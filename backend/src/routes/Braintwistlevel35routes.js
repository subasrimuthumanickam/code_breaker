
const express = require('express');
const router = express.Router();
const db = require('../data/level35Db');

db.initTables().catch((e) => console.error('[level35] init error:', e));

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
      question: db.QUESTION, // the answer is NOT sent to the frontend
      hints,
      progress: {
        status: progress.status,
        attempts: progress.attempts,
        hintsUsed: progress.hints_used,
        skipped: !!progress.skipped,
      },
    });
  } catch (e) {
    console.error('[level35] start', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
router.get('/start', start);
router.post('/start', start);

// ---- ANSWER: { playerId, answer: '052' } ----
router.post('/answer', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    const answer = String(req.body?.answer ?? '').trim();
    if (!playerId || !/^\d{3}$/.test(answer)) {
      return res.status(400).json({ success: false, error: 'Answer must be exactly 3 digits' });
    }

    const isCorrect = db.isCorrectAnswer(answer);
    const rewarded = await db.saveAnswer(playerId, answer, isCorrect);
    const progress = await db.getProgress(playerId);
    const hints = await db.getHints(playerId);

    res.json({
      success: true,
      correct: isCorrect,
      reward: rewarded ? db.QUESTION.reward : 0,
      attempts: progress.attempts,
      hints,
      message: isCorrect ? 'Correct!' : 'Not quite. Try again!',
    });
  } catch (e) {
    console.error('[level35] answer', e);
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
    const used = await db.markHintUsed(playerId);

    res.json({
      success: true,
      free: true,
      cost: 0,
      hints: await db.getHints(playerId),
      hint: { text: db.hintText(used) },
    });
  } catch (e) {
    console.error('[level35] hint', e);
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
      correct: true,
      skipped: true,
      answer: db.ANSWER, // the skip button shows the answer
      attempts: progress.attempts,
      hints: spent.hints,
      message: 'Level skipped',
    });
  } catch (e) {
    console.error('[level35] skip', e);
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
    console.error('[level35] reward', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;