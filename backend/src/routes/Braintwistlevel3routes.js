

const express = require('express');
const L3 = require('../data/level3Db');

const r = express.Router();

const LEVEL = L3.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_HINT = 25;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;



const PUZZLE = {
  question: 'How many differences can you spot between the two pictures?',
  numbers: [1, 2, 3],
  symbols: ['+', '-'],
  answer: ['+', '-'],
  hint: 'Both symbols are already placed.',
};

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L3 Error]', req.method, req.originalUrl, err);
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

// accept the real minus sign too
const cleanSymbol = (s) => (s === '\u2212' || s === '\u2013' ? '-' : s);

// [0, 1] -> [{ slot: 0, symbol: '+' }, { slot: 1, symbol: '-' }]
const revealedList = (slots) =>
  slots
    .filter((s) => s === 0 || s === 1)
    .map((s) => ({ slot: s, symbol: PUZZLE.answer[s] }));

// wait until the level 3 tables exist before any request runs
r.use(async (req, res, next) => {
  await L3.ready;
  next();
});

// shared checks for /answer /hint /skip -> returns the open session or sends the error
const openSession = async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await L3.getSession(sessionId, playerId);
  if (!session) {
    bad(res, 404, 'no_session', 'Session not found');
    return null;
  }
  if (session.status !== 'in_progress') {
    bad(res, 409, 'already_completed', 'This level is already completed');
    return null;
  }

  return { session, sessionId, playerId };
};

/* ---------------------------------------------------------
   POST /start   body: { playerId }
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L3.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const session = (await L3.findOpenSession(playerId)) || (await L3.createSession(playerId));

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    question: PUZZLE.question,
    numbers: PUZZLE.numbers,
    symbols: PUZZLE.symbols,
    revealed: revealedList(L3.parseList(session.removed)),
    hints: Number(player.hints) || 0,
    wrongAttempts: Number(session.wrong_attempts) || 0,
  });
}));

/* ---------------------------------------------------------
   POST /answer   body: { sessionId, playerId, symbols: ['+', '-'] }
--------------------------------------------------------- */

r.post('/answer', handle(async (req, res) => {
  const raw = req.body?.symbols;
  if (!Array.isArray(raw) || raw.length !== PUZZLE.answer.length) {
    return bad(res, 400, 'invalid_answer', 'Place both symbols between the numbers');
  }

  const symbols = raw.map(cleanSymbol);
  if (!symbols.every((s) => PUZZLE.symbols.includes(s))) {
    return bad(res, 400, 'invalid_answer', 'That answer is not allowed');
  }

  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const wrongBefore = Number(session.wrong_attempts) || 0;
  const attemptsBefore = Number(session.total_attempts) || 0;
  const correct = symbols.every((s, i) => s === PUZZLE.answer[i]);

  await L3.recordAttempt(sessionId, symbols.join(','), correct);

  if (!correct) {
    await L3.markWrong(sessionId);
    return res.json({
      success: true,
      correct: false,
      completed: false,
      wrongAttempts: wrongBefore + 1,
      message: 'Not quite. Try again!',
    });
  }

  const attempts = attemptsBefore + 1;
  const score = Math.max(100, 300 - wrongBefore * 50);
  const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

  await L3.completeSession(sessionId);

  let progressSaved = false;
  try {
    await L3.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L3] could not save progress:', err.message);
  }

  try {
    await L3.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L3] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    message: 'Sharp eyes! 1 + 2 \u2212 3 is right.',
    score,
    stars,
    attempts,
    progressSaved,
    next: NEXT_LEVEL,
    hints: await L3.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /hint   body: { sessionId, playerId }   (costs 25 hints)
   places one correct symbol in its gap
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  if (!(await L3.spendHints(playerId, COST_HINT))) {
    return bad(res, 402, 'not_enough_hints', 'Not enough hints!');
  }

  const slots = L3.parseList(session.removed);
  const free = PUZZLE.answer.map((_, i) => i).filter((i) => !slots.includes(i));

  let hint;
  if (free.length) {
    const slot = free[0];
    slots.push(slot);
    await L3.saveRevealed(sessionId, slots);
    hint = { place: { slot, symbol: PUZZLE.answer[slot] } };
  } else {
    hint = { text: PUZZLE.hint };
  }

  res.json({
    success: true,
    hint,
    revealed: revealedList(slots),
    hints: await L3.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /skip   body: { sessionId, playerId }   (costs 50 hints)
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  if (!(await L3.spendHints(playerId, COST_SKIP))) {
    return bad(res, 402, 'not_enough_hints', 'Not enough hints!');
  }

  await L3.skipSession(sessionId);

  try {
    await L3.unlockNext(playerId, Number(session.total_attempts) || 0);
  } catch (err) {
    console.error('[BrainTwist L3] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    skipped: true,
    message: 'Level skipped!',
    score: 0,
    stars: 0,
    next: NEXT_LEVEL,
    hints: await L3.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
--------------------------------------------------------- */

r.post('/reward', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
  if (req.body?.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

  const player = await L3.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L3.addHints(playerId, REWARD_VIDEO);

  res.json({ success: true, added: REWARD_VIDEO, hints: await L3.getHints(playerId) });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await L3.getProgress(playerId);

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