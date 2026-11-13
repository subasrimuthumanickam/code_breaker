

const express = require("express");
const router = express.Router();



function loadPool() {
  const candidates = DB_PATH
    ? [DB_PATH]
    : ["../db", "../config/db", "../config/database", "../database", "../data/db", "../utils/db", "../../db", "../db/pool", "../lib/db"];
  for (const c of candidates) {
    try {
      const mod = require(c);
      const raw = mod.pool || mod.db || mod.default || mod;
      return typeof raw.promise === "function" ? raw.promise() : raw; // normalise to the promise API
    } catch (e) {
      if (e.code !== "MODULE_NOT_FOUND" || !String(e.message).includes(c)) throw e;
    }
  }
  throw new Error("Level 20: db file not found. Set DB_PATH at the top of Braintwistlevel20routes.js");
}
const pool = loadPool();

const QUESTION = {
  text: "If a clock takes 5 seconds to strike 6 times, how many seconds will it take to strike 12 times?",
  options: [
    { key: "A", label: "10" },
    { key: "B", label: "11" },
    { key: "C", label: "12" },
    { key: "D", label: "15" },
  ],
};
const CORRECT_KEY = "B"; // stays on the server only
const EXPLANATION =
  "6 strikes have 5 gaps, so each gap is 1 second. 12 strikes have 11 gaps, so 11 seconds.";

const toId = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// POST /start  { playerId } -> reuse active session or create one, return the question
router.post("/start", async (req, res, next) => {
  try {
    const playerId = toId(req.body.playerId);
    if (!playerId) return res.status(400).json({ success: false, error: "playerId required" });

    const [rows] = await pool.query(
      "SELECT id, attempts FROM bt_level20_sessions WHERE player_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1",
      [playerId]
    );
    let sessionId, attempts = 0;
    if (rows.length) {
      sessionId = rows[0].id;
      attempts = rows[0].attempts;
    } else {
      const [ins] = await pool.query("INSERT INTO bt_level20_sessions (player_id) VALUES (?)", [playerId]);
      sessionId = ins.insertId;
    }
    res.json({ success: true, sessionId, attempts, question: QUESTION });
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

    if (!playerId || !sessionId || !QUESTION.options.some((o) => o.key === choice)) {
      return res.status(400).json({ success: false, error: "Invalid request" });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT id, status, attempts FROM bt_level20_sessions WHERE id = ? AND player_id = ? FOR UPDATE",
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

    const isCorrect = choice === CORRECT_KEY;
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

    // The app calls completeLevel() (map progress / stars) after a correct answer.
    res.json({
      success: true,
      correct: isCorrect,
      attempts,
      ...(isCorrect && { correctKey: CORRECT_KEY, explanation: EXPLANATION }),
    });
  } catch (err) {
    if (conn) await conn.rollback().catch(() => {});
    next(err);
  } finally {
    if (conn) conn.release();
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