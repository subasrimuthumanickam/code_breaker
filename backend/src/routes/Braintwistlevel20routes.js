
const express = require("express");
const pool = require("../db");
const router = express.Router();

const QUESTION_TEXT =
  "If a clock takes 5 seconds to strike 6 times, how many seconds will it take to strike 12 times?";
const CORRECT_LABEL = "11"; // stays on the server only
const MAX_NUMBER = 200;
const EXPLANATION =
  "6 strikes have 5 gaps, so each gap is 1 second. 12 strikes have 11 gaps, so 11 seconds.";
const HINT = "Don't count the 12 strikes directly; count the gaps between them.";

let hintColumnReady;
const ensureHintColumn = () => {
  if (!hintColumnReady) {
    hintColumnReady = pool
      .query("ALTER TABLE bt_level20_sessions ADD COLUMN hints_used INT NOT NULL DEFAULT 0")
      .catch((err) => {
        if (err.code === "ER_DUP_FIELDNAME") return;
        hintColumnReady = null;
        throw err;
      });
  }
  return hintColumnReady;
};

const toId = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// 4 different numbers between 1 and 200: the correct one + 3 random, shuffled
function makeOptions() {
  const nums = new Set([Number(CORRECT_LABEL)]);
  while (nums.size < 4) nums.add(1 + Math.floor(Math.random() * MAX_NUMBER));
  const arr = [...nums];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.map((n, i) => ({ key: "ABCD"[i], label: String(n) }));
}

const parseOptions = (txt) => {
  try { const o = JSON.parse(txt); return Array.isArray(o) && o.length === 4 ? o : null; }
  catch { return null; }
};

// POST /start  { playerId } -> reuse active session (same numbers) or create one
router.post("/start", async (req, res, next) => {
  try {
    const playerId = toId(req.body.playerId);
    if (!playerId) return res.status(400).json({ success: false, error: "playerId required" });

    const [rows] = await pool.query(
      "SELECT id, attempts, options_json FROM bt_level20_sessions WHERE player_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1",
      [playerId]
    );

    let sessionId, attempts = 0, options;
    if (rows.length) {
      sessionId = rows[0].id;
      attempts = rows[0].attempts;
      options = parseOptions(rows[0].options_json);
      if (!options) {                       // old session without saved numbers
        options = makeOptions();
        await pool.query("UPDATE bt_level20_sessions SET options_json = ? WHERE id = ?", [JSON.stringify(options), sessionId]);
      }
    } else {
      options = makeOptions();
      const [ins] = await pool.query(
        "INSERT INTO bt_level20_sessions (player_id, options_json) VALUES (?, ?)",
        [playerId, JSON.stringify(options)]
      );
      sessionId = ins.insertId;
    }

    res.json({ success: true, sessionId, attempts, question: { text: QUESTION_TEXT, options } });
  } catch (err) {
    next(err);
  }
});

// POST /answer  { playerId, sessionId, choice }
router.post("/answer", async (req, res, next) => {
  let conn;
  try {
    const playerId = toId(req.body.playerId);
    const sessionId = toId(req.body.sessionId);
    const choice = String(req.body.choice || "").toUpperCase();
    if (!playerId || !sessionId) return res.status(400).json({ success: false, error: "Invalid request" });

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT id, status, attempts, options_json FROM bt_level20_sessions WHERE id = ? AND player_id = ? FOR UPDATE",
      [sessionId, playerId]
    );
    if (!rows.length) {
      await conn.rollback();
      return res.status(404).json({ success: false, error: "Session not found" });
    }
    if (rows[0].status === "completed") {
      await conn.rollback();
      return res.status(409).json({ success: false, error: "Level already completed" });
    }

    const options = parseOptions(rows[0].options_json);
    const picked = options && options.find((o) => o.key === choice);
    if (!picked) {
      await conn.rollback();
      return res.status(400).json({ success: false, error: "Invalid choice" });
    }

    const isCorrect = picked.label === CORRECT_LABEL;
    const correctKey = options.find((o) => o.label === CORRECT_LABEL).key;
    const attempts = rows[0].attempts + 1;

    await conn.query(
      "INSERT INTO bt_level20_attempts (session_id, player_id, choice, is_correct) VALUES (?, ?, ?, ?)",
      [sessionId, playerId, choice, isCorrect ? 1 : 0]
    );
    await conn.query(
      isCorrect
        ? "UPDATE bt_level20_sessions SET attempts = ?, status = 'completed', completed_at = NOW() WHERE id = ?"
        : "UPDATE bt_level20_sessions SET attempts = ? WHERE id = ?",
      [attempts, sessionId]
    );
    await conn.commit();

    res.json({
      success: true,
      correct: isCorrect,
      attempts,
      ...(isCorrect && { correctKey, explanation: EXPLANATION }),
    });
  } catch (err) {
    if (conn) await conn.rollback().catch(() => {});
    next(err);
  } finally {
    if (conn) conn.release();
  }
});

// POST /hint  { playerId, sessionId } -> save hint use, return hint text
router.post("/hint", async (req, res, next) => {
  try {
    const playerId = toId(req.body.playerId);
    const sessionId = toId(req.body.sessionId);
    if (!playerId || !sessionId) return res.status(400).json({ success: false, error: "Invalid request" });

    await ensureHintColumn();
    const [r] = await pool.query(
      "UPDATE bt_level20_sessions SET hints_used = hints_used + 1 WHERE id = ? AND player_id = ? AND status = 'active'",
      [sessionId, playerId]
    );
    if (!r.affectedRows) return res.status(404).json({ success: false, error: "Session not found" });

    const [rows] = await pool.query(
      "SELECT hints_used FROM bt_level20_sessions WHERE id = ? AND player_id = ?",
      [sessionId, playerId]
    );
    res.json({
      success: true,
      free: true,
      cost: 0,
      text: HINT,
      hintsUsed: Number(rows[0]?.hints_used) || 0,
    });
  } catch (err) {
    next(err);
  }
});

// GET /status/:playerId
router.get("/status/:playerId", async (req, res, next) => {
  try {
    const playerId = toId(req.params.playerId);
    if (!playerId) return res.status(400).json({ success: false, error: "Invalid playerId" });
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS done FROM bt_level20_sessions WHERE player_id = ? AND status = 'completed'",
      [playerId]
    );
    res.json({ success: true, completed: rows[0].done > 0 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;