// backend/src/routes/Braintwistlevel34routes.js
// mounted at /api/braintwist/level34  ->  /start, /answer, /hint, /skip, /reward
const express = require('express');
const router = express.Router();
const db = require('../data/level34Db');

db.initTables().catch((e) => console.error('[level34] init error:', e));

const getPlayerId = (req) => Number(req.body?.playerId ?? req.query?.playerId);

// ---- START: question + hints + progress ----
const start = async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: 'playerId required' });
    }

    const progress = await db.getProgress(playerId);
    const hints = await db.getHints(playerId);

    res.json({
      success: true,
      level: db.LEVEL_NO,
      question: db.QUESTION, // answer inga illa, frontend ku anuppa maatom
      hints,
      progress: {
        status: progress.status,
        attempts: progress.attempts,
        hintUsed: !!progress.hint_used,
        skipped: !!progress.skipped,
      },
    });
  } catch (e) {
    console.error('[level34] start', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
router.get('/start', start);
router.post('/start', start);

// ---- ANSWER: { playerId, answer: 'mother' } ----
router.post('/answer', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    const answer = String(req.body?.answer ?? '').trim();
    if (!playerId || !answer) {
      return res.status(400).json({ success: false, error: 'Invalid request' });
    }

    const isCorrect = db.isCorrectAnswer(answer);
    await db.saveAnswer(playerId, answer, isCorrect);
    const progress = await db.getProgress(playerId);
    const hints = await db.getHints(playerId);

    res.json({
      success: true,
      correct: isCorrect,
      reward: isCorrect ? db.QUESTION.reward : 0,
      attempts: progress.attempts,
      hints,
      message: isCorrect ? 'Correct!' : 'Not quite. Try again!',
    });
  } catch (e) {
    console.error('[level34] answer', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ---- HINT ----
router.post('/hint', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: 'playerId required' });
    }

    await db.getProgress(playerId);
    const spent = await db.spendHints(playerId, db.QUESTION.hintCost);
    if (!spent.ok) {
      return res.status(402).json({ success: false, hints: spent.hints, error: spent.message });
    }
    await db.markHintUsed(playerId);

    res.json({
      success: true,
      hints: spent.hints,
      hint: { text: 'Doctors can be women too. Who else is a parent of the boy?' },
    });
  } catch (e) {
    console.error('[level34] hint', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ---- SKIP ----
router.post('/skip', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: 'playerId required' });
    }

    await db.getProgress(playerId);
    const spent = await db.spendHints(playerId, db.QUESTION.skipCost);
    if (!spent.ok) {
      return res.status(402).json({ success: false, hints: spent.hints, error: spent.message });
    }
    await db.markSkipped(playerId);

    const progress = await db.getProgress(playerId);
    res.json({
      success: true,
      skipped: true,
      attempts: progress.attempts,
      hints: spent.hints,
      message: 'Level skipped',
    });
  } catch (e) {
    console.error('[level34] skip', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ---- REWARD (video) ----
router.post('/reward', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: 'playerId required' });
    }

    const hints = await db.addVideoReward(playerId);
    res.json({ success: true, hints, reward: db.QUESTION.videoReward });
  } catch (e) {
    console.error('[level34] reward', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;