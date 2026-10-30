const express = require('express');
const L31 = require('../data/level31Db');

const r = express.Router();

const LEVEL = L31.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_HINT = 25;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;

/* ---------------------------------------------------------
   LEVEL 31 - find the mistake
   the sentence has a double word: "find the the mistake"
   the answer is the repeated word: "the"
--------------------------------------------------------- */

// NOTE: the double "the" is the mistake - do not fix it!
const QUESTION = '84% of people reading this will not find the the mistake in this.';
const LINES = ['A, B, C, D, E, F, G, H, I, J, K, L, M,', 'N, O, P, Q, R, S, T, U, V, W, X, Y, Z.'];
const CLUE_TEXT = 'Read the sentence slowly, word by word. One word is written twice in a row.';

// "the" -> "the"
const clean = (v) =>
  String(v === undefined || v === null ? '' : v)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

// accepted answers (already cleaned): "the" or "the the"
const ACCEPTED = ['the', 'thethe'];

// score from the number of tries
const grade = (attempts) => {
  if (attempts <= 1) return { score: 300, stars: 3 };
  if (attempts <= 3) return { score: 200, stars: 2 };
  return { score: 100, stars: 1 };
};

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L31 Error]', req.method, req.originalUrl, err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'server_error', message: err.message });
    }
  }
};

const toId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const bad = (res, status, error, message) =>
  res.status(status).json({ success: false, error, message });

// wait until the level 31 tables exist before any request runs
r.use(async (req, res, next) => {
  await L31.ready;
  next();
});

// unlock level 32 - a failure here must never break the answer
const tryUnlock = async (playerId, attempts) => {
  try {
    await L31.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L31] could not unlock next level:', err.message);
  }
};

const progressOf = (st) => ({
  attempts: st ? Number(st.attempts) || 0 : 0,
  solved: Boolean(st && st.solved),
  skipped: Boolean(st && st.skipped),
  hintsUsed: st ? Number(st.hints_used) || 0 : 0,
});

/* ---------------------------------------------------------
   POST /start   body: { playerId }
   every time the level is opened: a fresh game
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L31.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const state = await L31.resetState(playerId);

  res.json({
    success: true,
    level: LEVEL,
    question: QUESTION,
    lines: LINES,
    hintCost: COST_HINT,
    skipCost: COST_SKIP,
    videoReward: REWARD_VIDEO,
    hints: Number(player.hints) || 0,
    progress: progressOf(state),
  });
}));

/* ---------------------------------------------------------
   POST /answer   body: { playerId, answer }
   right answer -> saved in the database, level 32 unlocked
   wrong answer -> correct:false (the try is saved too)
--------------------------------------------------------- */

r.post('/answer', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const given = req.body && req.body.answer;
  if (given === undefined || given === null || String(given).trim() === '') {
    return bad(res, 400, 'answer_required', 'answer is required');
  }

  const player = await L31.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L31.ensureState(playerId);

  const correct = ACCEPTED.includes(clean(given));
  const attempts = await L31.addAttempt(playerId);
  await L31.logAnswer(playerId, given, correct);

  if (!correct) {
    return res.json({
      success: true,
      correct: false,
      attempts,
      message: 'Not quite. Try again!',
    });
  }

  const { score, stars } = grade(attempts);
  await L31.markSolved(playerId);

  try {
    await L31.saveProgress(playerId, score, stars, attempts);
  } catch (err) {
    console.error('[BrainTwist L31] could not save progress:', err.message);
  }
  await tryUnlock(playerId, attempts);

  res.json({
    success: true,
    correct: true,
    attempts,
    answer: 'the',
    message: 'Correct! Well done!',
    score,
    stars,
    next: NEXT_LEVEL,
  });
}));

/* ---------------------------------------------------------
   POST /hint   body: { playerId }   (costs 25 hints)
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L31.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L31.ensureState(playerId);

  const hints = await L31.spendHints(playerId, COST_HINT);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L31.markHintUsed(playerId);
  await L31.logHint(playerId, hints);

  res.json({ success: true, hints, hint: { text: CLUE_TEXT } });
}));

/* ---------------------------------------------------------
   POST /skip   body: { playerId }   (costs 50 hints)
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L31.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const state = await L31.ensureState(playerId);

  const hints = await L31.spendHints(playerId, COST_SKIP);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L31.markSkipped(playerId);
  const attempts = Math.max(1, Number(state.attempts) || 0);
  await tryUnlock(playerId, attempts);

  res.json({ success: true, hints, skipped: true, attempts });
}));

/* ---------------------------------------------------------
   POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
--------------------------------------------------------- */

r.post('/reward', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
  if (!req.body || req.body.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

  const player = await L31.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const hints = await L31.addHints(playerId, REWARD_VIDEO);
  res.json({ success: true, hints, added: REWARD_VIDEO });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await L31.getProgress(playerId);

  res.json({
    success: true,
    level: LEVEL,
    completed: Boolean(row && row.is_completed),
    score: row ? Number(row.score) || 0 : 0,
    stars: row ? Number(row.stars) || 0 : 0,
    attempts: row ? Number(row.attempts) || 0 : 0,
    completedAt: row ? row.completed_at : null,
  });
}));

module.exports = r;