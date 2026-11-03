// const express = require('express');
// const db = require("../data/level37Db");
// const router = express.Router();

// const VIDEO_REWARD = 75;
// const SKIP_COST = 50;
// const userOf = (req) => Number(req.body?.userId || req.query?.userId || 1);

// // GET /api/level37?userId=1  -> question + coins (answer is NOT sent)
// router.get('/', async (req, res) => {
//   try {
//     const level = await db.getLevel();
//     if (!level) return res.status(404).json({ success: false, message: 'Level not found' });
//     const coins = await db.getCoins(userOf(req));
//     res.json({
//       success: true,
//       level: 37,
//       question: level.question,
//       min: level.min_value,
//       max: level.max_value,
//       coins,
//     });
//   } catch (e) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // POST /api/level37/submit  { userId, answer }
// router.post('/submit', async (req, res) => {
//   try {
//     const selected = Number(req.body.answer);
//     if (!Number.isInteger(selected)) {
//       return res.status(400).json({ success: false, message: 'Invalid answer' });
//     }
//     const level = await db.getLevel();
//     const correct = selected === level.answer;
//     await db.saveAttempt(userOf(req), selected, correct);
//     res.json({
//       success: true,
//       correct,
//       message: correct ? 'Correct! 5 brothers + 1 sister = 6' : 'Wrong answer, try again',
//     });
//   } catch (e) {
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // POST /api/level37/clue
// router.post('/clue', async (_req, res) => {
//   const level = await db.getLevel();
//   res.json({ success: true, clue: level.clue });
// });

// // POST /api/level37/video   -> +75 coins after watching video
// router.post('/video', async (req, res) => {
//   const coins = await db.changeCoins(userOf(req), VIDEO_REWARD);
//   res.json({ success: true, reward: VIDEO_REWARD, coins });
// });

// // POST /api/level37/skip    -> costs 50 coins
// router.post('/skip', async (req, res) => {
//   const coins = await db.changeCoins(userOf(req), -SKIP_COST);
//   if (coins === null) return res.json({ success: false, message: 'Not enough coins' });
//   res.json({ success: true, cost: SKIP_COST, coins, nextLevel: 38 });
// });

// module.exports = router;

// // In server.js:
// //   app.use(express.json());
// //   app.use('/api/level37', require('./Btlevel37routes'));
const express = require("express");
const db = require("../data/level37Db");
const router = express.Router();

// GET /api/braintwist/level37  -> question + counter range (answer is never sent)
router.get("/", async (req, res, next) => {
  try {
    const lv = await db.getLevel();
    if (!lv) return res.status(404).json({ success: false, error: "Level 37 not found" });
    res.json({
      success: true,
      level: 37,
      question: lv.question,
      min: lv.min_value,
      max: lv.max_value,
    });
  } catch (e) { next(e); }
});

// POST /api/braintwist/level37/submit   body: { playerId, answer }
router.post("/submit", async (req, res, next) => {
  try {
    const playerId = Number(req.body.playerId);
    const answer = Number(req.body.answer);
    if (!Number.isInteger(playerId) || !Number.isInteger(answer)) {
      return res.status(400).json({ success: false, error: "playerId and answer must be numbers" });
    }
    const lv = await db.getLevel();
    const correct = answer === lv.answer;
    const attempts = await db.saveAttempt(playerId, answer, correct);
    res.json({
      success: true,
      correct,
      attempts,
      message: correct ? "Correct! 5 brothers + 1 sister = 6" : "Not quite. Try again!",
    });
  } catch (e) { next(e); }
});

// POST /api/braintwist/level37/clue
router.post("/clue", async (req, res, next) => {
  try {
    const lv = await db.getLevel();
    res.json({ success: true, clue: lv.clue });
  } catch (e) { next(e); }
});

module.exports = router;