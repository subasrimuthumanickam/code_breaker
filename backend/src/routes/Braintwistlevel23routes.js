const express = require("express");
const router = express.Router();
const db = require("../db"); // same db import as Braintwistlevel22routes.js

// Level 23 - tap the emoji faces in the order shown.
// The server picks a random order for every session, stores it in MySQL,
// and is the only one that decides if the tapped order is correct.
const FACES = ["cool", "angry", "sick", "devil", "wink", "bandage", "star"];
const REWARD_COINS = 75;

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