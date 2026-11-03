
const express = require('express');
const {
  LAYOUT,
  isFed,
  initLevel43Tables,
  saveAttempt,
  getProgress,
} = require('../data/level43Db');

const router = express.Router();

initLevel43Tables().catch((e) => console.error('Level43 table init failed:', e));

const getPlayerId = (req) => req.body?.playerId || req.query?.playerId;

// GET /api/braintwist/level43/config?playerId=16   (answer rule is NOT sent)
router.get('/config', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    const progress = playerId ? await getProgress(String(playerId)) : { completed: 0, attempts: 0 };
    return res.json({
      success: true,
      data: {
        level: 43,
        question: 'Feed the monkey please, he is hungry!',
        layout: LAYOUT,
        completed: !!progress.completed,
        attempts: progress.attempts,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/braintwist/level43/submit  { playerId, item, target, x, y }
// target: 'monkey_word' (the word "monkey" in the question)  -> correct
//         'monkey_image' (the drawn monkey) / 'none'          -> wrong
router.post('/submit', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    const item = String(req.body.item || '');
    const target = String(req.body.target || '');
    const x = Number(req.body.x) || 0;
    const y = Number(req.body.y) || 0;

    if (!playerId) {
      return res.status(400).json({ success: false, message: 'playerId is required' });
    }
    if (!item || !target) {
      return res.status(400).json({ success: false, message: 'Invalid drop data' });
    }

    const isCorrect = isFed(item, target);
    await saveAttempt({ playerId: String(playerId), item, x, y, isCorrect });
    const progress = await getProgress(String(playerId));

    return res.json({
      success: true,
      data: {
        correct: isCorrect,
        attempts: progress.attempts,
        message: isCorrect ? 'Yummy! 🍌' : 'Not quite. Try again!',
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;