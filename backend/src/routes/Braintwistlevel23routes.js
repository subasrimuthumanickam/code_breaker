
const express = require("express");
const router = express.Router();
const db = require("../db"); // same db import as Braintwistlevel22routes.js

// Level 23 - tap the emoji faces in the order shown.
// The server picks a random order for every session, stores it in MySQL,
// and is the only one that decides if the tapped order is correct.
const FACES = ["cool", "angry", "sick", "devil", "wink", "bandage", "star"];
const REWARD_COINS = 75;

// The hint is free (it never uses coins or the hint balance).
// The text is sent by the backend, the frontend does not hardcode it.
const HINT_TEXT =
  "Look at the instruction at the top: \"Tap them in order\". Tap the faces in the same order as the small faces shown there, from left to right.";

let hintLogReady;
const ensureHintLogTable = () => {
  if (!hintLogReady) {
    hintLogReady = db.query(`
      CREATE TABLE IF NOT EXISTS bt_level23_hint_logs (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        session_id BIGINT UNSIGNED NOT NULL,
        player_id VARCHAR(64) NOT NULL,
        selected_order TEXT NOT NULL,
        hint_index SMALLINT UNSIGNED NULL,
        hint_face VARCHAR(20) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_l23_hint_session (session_id, created_at)
      )
    `).catch((err) => {
      hintLogReady = null;
      throw err;
    });
  }
  return hintLogReady;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const getPlayerId = (req) =>
  req.body.playerId ||
  req.body.userId ||
  req.query.playerId ||
  req.query.userId ||
  req.params.playerId;

// POST /api/braintwist/level23/start   body: { playerId }
router.post("/start", async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: "playerId required" });
    }

    const sequence = shuffle(FACES);

    const [result] = await db.query(
      "INSERT INTO bt_level23_sessions (player_id, sequence) VALUES (?, ?)",
      [playerId, sequence.join(",")]
    );

    res.json({
      success: true,
      sessionId: result.insertId,
      question: "Tap them in order:",
      sequence,
    });
  } catch (err) {
    console.error("L23 start error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// POST /api/braintwist/level23/hint
// body: { playerId, sessionId, picked: ["cool", ...] }
// Free hint: saves the hint use in MySQL and sends the hint text as JSON.
router.post("/hint", async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    const { sessionId, picked } = req.body;
    if (!playerId || !sessionId || !Array.isArray(picked)) {
      return res.status(400).json({
        success: false,
        error: "playerId, sessionId and picked (array) required",
      });
    }

    const validPicked =
      picked.length <= FACES.length &&
      new Set(picked).size === picked.length &&
      picked.every((face) => FACES.includes(face));
    if (!validPicked) {
      return res.status(400).json({ success: false, error: "Invalid picked order" });
    }

    const [rows] = await db.query(
      "SELECT sequence, status FROM bt_level23_sessions WHERE id = ? AND player_id = ?",
      [sessionId, playerId]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }
    if (rows[0].status === "completed") {
      return res.status(409).json({ success: false, error: "Level already completed" });
    }

    const sequence = String(rows[0].sequence || "").split(",");
    if (sequence.length !== FACES.length || !sequence.every((face) => FACES.includes(face))) {
      throw new Error("Invalid sequence saved for level 23 session");
    }

    // which face comes next (saved in the log, the frontend does not need it)
    const wrongAt = picked.findIndex((face, index) => face !== sequence[index]);
    const hintFace = wrongAt < 0 ? sequence[picked.length] || null : null;

    // save the hint use
    await ensureHintLogTable();
    await db.query(
      `INSERT INTO bt_level23_hint_logs
        (session_id, player_id, selected_order, hint_index, hint_face)
       VALUES (?, ?, ?, ?, ?)`,
      [
        sessionId,
        String(playerId),
        JSON.stringify(picked),
        hintFace ? picked.length + 1 : null,
        hintFace,
      ]
    );

    res.json({
      success: true,
      free: true,
      cost: 0,
      text: HINT_TEXT,
      message: HINT_TEXT,
    });
  } catch (err) {
    console.error("L23 hint error:", err);
    res.status(500).json({ success: false, error: "Could not save level 23 hint" });
  }
});

// POST /api/braintwist/level23/answer   body: { playerId, sessionId, answer: ["cool", ...] }
router.post("/answer", async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    const { sessionId, answer } = req.body;

    if (!playerId || !sessionId || !Array.isArray(answer)) {
      return res.status(400).json({
        success: false,
        error: "playerId, sessionId and answer (array) required",
      });
    }
    const valid =
      answer.length === FACES.length &&
      new Set(answer).size === FACES.length &&
      answer.every((f) => FACES.includes(f));
    if (!valid) {
      return res.status(400).json({ success: false, error: "Invalid answer" });
    }

    const [rows] = await db.query(
      "SELECT id, sequence, status, attempts FROM bt_level23_sessions WHERE id = ? AND player_id = ?",
      [sessionId, playerId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }
    const session = rows[0];

    if (session.status === "completed") {
      return res.json({
        success: true,
        correct: true,
        attempts: session.attempts,
        coins: 0,
        message: "Already completed",
      });
    }

    const target = session.sequence.split(",");
    const matched = answer.filter((f, i) => f === target[i]).length;
    const isCorrect = matched === target.length;
    const attempts = session.attempts + 1;

    await db.query(
      "INSERT INTO bt_level23_attempts (session_id, player_id, answer, matched, is_correct) VALUES (?, ?, ?, ?, ?)",
      [sessionId, playerId, answer.join(","), matched, isCorrect ? 1 : 0]
    );

    if (isCorrect) {
      await db.query(
        "UPDATE bt_level23_sessions SET attempts = ?, status = 'completed', completed_at = NOW() WHERE id = ?",
        [attempts, sessionId]
      );
    } else {
      await db.query("UPDATE bt_level23_sessions SET attempts = ? WHERE id = ?", [
        attempts,
        sessionId,
      ]);
    }

    // The app calls completeLevel() after onComplete, so brain_twist_progress
    // (score / stars / attempts) is saved there.
    res.json({
      success: true,
      correct: isCorrect,
      matched,
      attempts,
      coins: isCorrect ? REWARD_COINS : 0,
      explanation: isCorrect
        ? "Perfect order!"
        : "Not quite. Follow the small faces at the top, left to right.",
    });
  } catch (err) {
    console.error("L23 answer error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET /api/braintwist/level23/status/:playerId
router.get("/status/:playerId", async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const [rows] = await db.query(
      `SELECT COUNT(*) AS sessions,
              COALESCE(SUM(status = 'completed'), 0) AS completed,
              COALESCE(SUM(attempts), 0) AS attempts
         FROM bt_level23_sessions WHERE player_id = ?`,
      [playerId]
    );
    res.json({
      success: true,
      sessions: rows[0].sessions,
      completed: Number(rows[0].completed) > 0,
      attempts: Number(rows[0].attempts),
    });
  } catch (err) {
    console.error("L23 status error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;