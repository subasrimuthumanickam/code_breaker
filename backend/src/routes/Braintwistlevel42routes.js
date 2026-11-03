
const express = require('express');
const {
  LAYOUT,
  getTotalSlices,
  initLevel42Tables,
  saveAttempt,
  getProgress,
} = require('../data/level42Db'); // '../data/' because this file is in src/routes

const router = express.Router();

initLevel42Tables().catch((e) => console.error('Level42 table init failed:', e));

const getPlayerId = (req) => req.body?.playerId || req.query?.playerId;

// GET /api/braintwist/level42/config?playerId=1   (answer is NOT sent)
router.get('/config', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    const progress = playerId ? await getProgress(String(playerId)) : { completed: 0, attempts: 0 };
    return res.json({
      success: true,
      data: {
        level: 42,
        question: 'How many pizza slices do we have?',
        slices: LAYOUT,
        completed: !!progress.completed,
        attempts: progress.attempts,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/braintwist/level42/submit  { playerId, answer, draggedCount }
router.post('/submit', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    const answer = Number(req.body.answer);
    const draggedCount = Number(req.body.draggedCount) || 0;

    if (!playerId) {
      return res.status(400).json({ success: false, message: 'playerId is required' });
    }
    if (!Number.isInteger(answer) || answer < 0 || answer > 99) {
      return res.status(400).json({ success: false, message: 'Invalid answer' });
    }

    const isCorrect = answer === getTotalSlices(); // 9
    await saveAttempt({ userId: String(playerId), answer, isCorrect, draggedCount });
    const progress = await getProgress(String(playerId));

    return res.json({
      success: true,
      data: {
        correct: isCorrect,
        attempts: progress.attempts,
        message: isCorrect ? 'Correct! 🍕' : 'Not quite. Try again!',
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;