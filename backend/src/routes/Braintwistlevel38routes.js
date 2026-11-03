const express = require("express");
const db = require("../data/level38Db");
const router = express.Router();

// GET /api/braintwist/level38 -> riddle lines + answer length (answer itself is never sent)
router.get("/", async (req, res, next) => {
  try {
    const lv = await db.getLevel();
    if (!lv) return res.status(404).json({ success: false, error: "Level 38 not found" });
    res.json({
      success: true,
      level: 38,
      title: "What am I?",
      lines: String(lv.riddle).split("\n"),
      length: String(lv.answer).trim().length,
    });
  } catch (e) { next(e); }
});

// POST /api/braintwist/level38/submit   body: { playerId, answer: "R" }
router.post("/submit", async (req, res, next) => {
  try {
    const playerId = Number(req.body.playerId);
    const answer = String(req.body.answer || "").trim().toUpperCase();
    if (!Number.isInteger(playerId) || !answer) {
      return res.status(400).json({ success: false, error: "playerId and answer are required" });
    }
    const lv = await db.getLevel();
    const correct = answer === String(lv.answer).trim().toUpperCase();
    const attempts = await db.saveAttempt(playerId, answer.slice(0, 20), correct);
    res.json({
      success: true,
      correct,
      attempts,
      message: correct
        ? "Correct! R appears 2, 1, 0 and 1 times"
        : "Not quite. Try again!",
    });
  } catch (e) { next(e); }
});

// POST /api/braintwist/level38/search -> first hint  (cost is charged by the existing hint api)
router.post("/search", async (req, res, next) => {
  try { const lv = await db.getLevel(); res.json({ success: true, text: lv.hint1 }); }
  catch (e) { next(e); }
});

// POST /api/braintwist/level38/clue -> second (stronger) hint
router.post("/clue", async (req, res, next) => {
  try { const lv = await db.getLevel(); res.json({ success: true, text: lv.hint2 }); }
  catch (e) { next(e); }
});

module.exports = router;