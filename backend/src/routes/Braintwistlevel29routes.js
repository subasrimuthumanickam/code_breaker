
const express = require('express');
const db = require('../data/level29Db');

const router = express.Router();

const pid = (req) => String(req.body?.playerId ?? req.query?.playerId ?? '').trim();
const fail = (res, code, msg) => res.status(code).json({ success: false, error: msg });

// START: puzzle anuppum (answer anuppa maatom)
async function start(req, res) {
  try {
    const playerId = pid(req);
    if (!playerId) return fail(res, 400, 'playerId required');
    const puzzle = await db.getPuzzle();
    const p = await db.ensureProgress(playerId);
    const hints = await db.getHints(playerId);
    res.json({
      success: true,
      level: db.LEVEL,
      question: puzzle.question,
      spots: puzzle.spots,
      hintCost: 0,
      skipCost: db.SKIP_COST,
      videoReward: db.VIDEO_REWARD,
      hints,
      progress: {
        attempts: p.attempts,
        solved: !!p.solved,
        skipped: !!p.skipped,
        hintUsed: !!p.hint_used,
      },
    });
  } catch (e) {
    console.error('[level29] start', e);
    fail(res, 500, e.message);
  }
}
router.post('/start', start);
router.get('/start', start);

// ANSWER
router.post('/answer', async (req, res) => {
  try {
    const playerId = pid(req);
    const answer = String(req.body?.answer ?? '').trim();
    if (!playerId || !answer) return fail(res, 400, 'playerId and answer required');
    const puzzle = await db.getPuzzle();
    const correct = answer === puzzle.answer;
    const attempts = await db.saveAnswer(playerId, answer, correct);
    res.json({
      success: true,
      correct,
      attempts,
      message: correct ? 'Correct!' : 'Not quite. Try again!',
    });
  } catch (e) {
    console.error('[level29] answer', e);
    fail(res, 500, e.message);
  }
});

// HINT (free; usage is recorded in the database)
router.post('/hint', async (req, res) => {
  try {
    const playerId = pid(req);
    if (!playerId) return fail(res, 400, 'playerId required');
    await db.markHint(playerId);
    const puzzle = await db.getPuzzle();
    res.json({ success: true, free: true, cost: 0, hints: await db.getHints(playerId), hint: { text: puzzle.hint } });
  } catch (e) {
    console.error('[level29] hint', e);
    fail(res, 500, e.message);
  }
});

// SKIP (50 hints)
router.post('/skip', async (req, res) => {
  try {
    const playerId = pid(req);
    if (!playerId) return fail(res, 400, 'playerId required');
    const hints = await db.spendHints(playerId, db.SKIP_COST);
    if (hints === null) {
      return res.status(402).json({ success: false, error: 'Not enough hints', hints: await db.getHints(playerId) });
    }
    await db.markSkip(playerId);
    const p = await db.ensureProgress(playerId);
    res.json({ success: true, hints, skipped: true, attempts: p.attempts });
  } catch (e) {
    console.error('[level29] skip', e);
    fail(res, 500, e.message);
  }
});

// REWARD (video +75)
router.post('/reward', async (req, res) => {
  try {
    const playerId = pid(req);
    if (!playerId) return fail(res, 400, 'playerId required');
    const hints = await db.addHints(playerId, db.VIDEO_REWARD);
    res.json({ success: true, hints, added: db.VIDEO_REWARD });
  } catch (e) {
    console.error('[level29] reward', e);
    fail(res, 500, e.message);
  }
});

// STATUS
router.get('/status/:playerId', async (req, res) => {
  try {
    const p = await db.ensureProgress(req.params.playerId);
    res.json({
      success: true,
      attempts: p.attempts,
      solved: !!p.solved,
      skipped: !!p.skipped,
      hintUsed: !!p.hint_used,
    });
  } catch (e) {
    console.error('[level29] status', e);
    fail(res, 500, e.message);
  }
});

module.exports = router;