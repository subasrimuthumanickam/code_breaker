
const express = require("express");
const db = require("../data/level32Db");
const router = express.Router();

const LETTERS = ["A", "B", "C", "D"];
const HINT_COST = 25;
const SKIP_COST = 50;

async function ownSession(req, res) {
  const sessionId = Number(req.body.sessionId);
  const playerId = Number(req.body.playerId);
  if (!sessionId || !playerId) {
    res.status(400).json({ success: false, error: "Invalid request" });
    return null;
  }
  const s = await db.getSession(sessionId);
  if (!s || s.player_id !== playerId) {
    res.status(404).json({ success: false, error: "Session not found" });
    return null;
  }
  return { s, sessionId, playerId };
}

router.post("/start", async (req, res) => {
  try {
    const playerId = Number(req.body.playerId);
    if (!playerId) return res.status(400).json({ success: false, error: "playerId required" });
    const s = await db.startSession(playerId);
    res.json({ success: true, ...s });
  } catch (e) {
    console.error("[level32 /start]", e);
    res.status(500).json({ success: false, error: "Could not start level 32" });
  }
});

router.post("/answer", async (req, res) => {
  try {
    const own = await ownSession(req, res);
    if (!own) return;
    const answer = String(req.body.answer || "").toUpperCase();
    if (!LETTERS.includes(answer))
      return res.status(400).json({ success: false, error: "Invalid answer" });

    const correct = answer === own.s.correct_answer;
    const attempts = await db.saveAttempt(own.sessionId, own.playerId, answer, correct);
    res.json({ success: true, correct, attempts, answer: correct ? own.s.correct_answer : null });
  } catch (e) {
    console.error("[level32 /answer]", e);
    res.status(500).json({ success: false, error: "Could not save answer" });
  }
});

// hint: removes one wrong shadow for free. body: {sessionId, playerId, hidden:["B"]}
router.post("/hint", async (req, res) => {
  try {
    const own = await ownSession(req, res);
    if (!own) return;
    const hidden = Array.isArray(req.body.hidden) ? req.body.hidden.map(String) : [];
    const wrong = LETTERS.filter((l) => l !== own.s.correct_answer && !hidden.includes(l));
    if (wrong.length <= 1)
      return res.status(400).json({ success: false, error: "No more hints for this puzzle" });

    const remove = wrong[Math.floor(Math.random() * wrong.length)];
    res.json({ success: true, free: true, cost: 0, hints: await db.getHints(own.playerId), remove });
  } catch (e) {
    console.error("[level32 /hint]", e);
    res.status(500).json({ success: false, error: e.message || "Could not use hint" });
  }
});

// skip: costs 50 hints, level counts as done
router.post("/skip", async (req, res) => {
  try {
    const own = await ownSession(req, res);
    if (!own) return;
    const hints = await db.spendHints(own.playerId, SKIP_COST);
    if (hints === null)
      return res.status(402).json({ success: false, error: "Not enough hints" });
    await db.completeSession(own.sessionId);
    res.json({ success: true, hints, skipped: true, attempts: 1 });
  } catch (e) {
    console.error("[level32 /skip]", e);
    res.status(500).json({ success: false, error: e.message || "Could not skip" });
  }
});

router.get("/status/:playerId", async (req, res) => {
  try {
    res.json({ success: true, ...(await db.status(Number(req.params.playerId))) });
  } catch (e) {
    console.error("[level32 /status]", e);
    res.status(500).json({ success: false, error: "Could not load status" });
  }
});

module.exports = router;