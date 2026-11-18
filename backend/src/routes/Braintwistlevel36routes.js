
const express = require("express");
const router = express.Router();

const {
  getPlayer,
  spendHints,
  addHints,
  addAttempt,
  nextHintIndex,
  markSolved,
} = require("../data/level36Db");

const ANSWER = "36";
const HINT_COST = 25;
const SKIP_COST = 50;
const REWARD = 75;

const HINTS = [
  { text: "Look at the sign at the top." },
  { text: "Can you move a digit from the sign?" },
  { text: "Drag the 0 from LEVEL 70 next to the 7." },
];

function needPlayer(req, res) {
  const { playerId } = req.body || {};
  if (playerId === undefined || playerId === null || playerId === "") {
    res.status(400).json({ success: false, error: "playerId required" });
    return null;
  }
  return playerId;
}

router.post("/start", (req, res) => {
  const playerId = needPlayer(req, res);
  if (playerId === null) return;
  const p = getPlayer(playerId);
  res.json({ success: true, hints: p.hints, attempts: p.attempts, solved: p.solved });
});

router.post("/answer", (req, res) => {
  const playerId = needPlayer(req, res);
  if (playerId === null) return;

  const attempts = addAttempt(playerId);
  const guess = String(req.body.guess ?? "").trim();
  const correct = guess === ANSWER;
  if (correct) markSolved(playerId);

  res.json({ success: true, correct, attempts, hints: getPlayer(playerId).hints });
});

router.post("/hint", (req, res) => {
  const playerId = needPlayer(req, res);
  if (playerId === null) return;

  const i = Math.min(nextHintIndex(playerId), HINTS.length - 1);
  res.json({ success: true, free: true, cost: 0, hint: HINTS[i], hints: getPlayer(playerId).hints });
});

router.post("/reward", (req, res) => {
  const playerId = needPlayer(req, res);
  if (playerId === null) return;
  const hints = addHints(playerId, REWARD);
  res.json({ success: true, hints });
});

router.post("/skip", (req, res) => {
  const playerId = needPlayer(req, res);
  if (playerId === null) return;

  if (!spendHints(playerId, SKIP_COST)) {
    return res.status(402).json({ success: false, error: "Not enough hints" });
  }
  const attempts = addAttempt(playerId);
  markSolved(playerId);
  res.json({ success: true, answer: ANSWER, attempts, hints: getPlayer(playerId).hints });
});

router.get("/status/:playerId", (req, res) => {
  const p = getPlayer(req.params.playerId);
  res.json({ success: true, ...p });
});

module.exports = router;