const express = require('express');
const L19 = require('../data/level19Db');

const r = express.Router();

const LEVEL = L19.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_HINT = 25;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;

/* ---------------------------------------------------------
   PUZZLE  (the answer stays on the server)
   3 lines across + 3 down = 9, 1 + 1 = 1, so 2 + 2 = 4  (the number of lines, squared)
--------------------------------------------------------- */

const TITLE = 'What number replaces the ?';

const FIGURES = [
  { lines: 3, label: '9' },
  { lines: 1, label: '1' },
  { lines: 2, label: '?' },
];

const ANSWER = 4;

// clues, one more each time the magnifier is used
const HINTS = [
  'Count the lines going across and going down in each picture.',
  '3 lines gives 9 and 1 line gives 1. Think about the lines times the lines.',
  'The last picture has 2 lines across and 2 lines down: 2 x 2.',
];

// score from the number of answers (wrong ones + the right one)
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
    console.error('[BrainTwist L19 Error]', req.method, req.originalUrl, err);
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

// wait until the level 19 tables exist before any request runs
r.use(async (req, res, next) => {
  await L19.ready;
  next();
});

// shared checks for /answer /hint /skip -> returns the open session or sends the error
const openSession = async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await L19.getSession(sessionId, playerId);
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

// unlock level 20 - a failure here must never break the answer
const tryUnlock = async (playerId, attempts) => {
  try {
    await L19.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L19] could not unlock next level:', err.message);
  }
};

/* ---------------------------------------------------------
   POST /start   body: { playerId }
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L19.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L19.abandonActive(playerId);
  const session = await L19.createSession(playerId);

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    title: TITLE,
    figures: FIGURES,
    hints: Number(player.hints) || 0,
  });
}));

/* ---------------------------------------------------------
   POST /answer   body: { sessionId, playerId, answer }
--------------------------------------------------------- */

r.post('/answer', handle(async (req, res) => {
  const answer = Number(req.body && req.body.answer);
  if (!Number.isInteger(answer) || answer < 0 || answer > 999) {
    return bad(res, 400, 'invalid_answer', 'answer must be a whole number');
  }

  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const correct = answer === ANSWER;
  const before = await L19.countAttempts(sessionId);
  await L19.recordAttempt(sessionId, answer, correct);

  if (!correct) {
    return res.json({
      success: true,
      correct: false,
      completed: false,
      message: 'Not quite. Try again!',
    });
  }

  const attempts = before + 1;
  const seconds = Number(session.elapsed) || 0;
  const { score, stars } = grade(attempts);

  await L19.completeSession(sessionId, attempts, seconds);

  let progressSaved = false;
  try {
    await L19.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L19] could not save progress:', err.message);
  }
  await tryUnlock(playerId, attempts);

  res.json({
    success: true,
    correct: true,
    completed: true,
    message: 'Correct!',
    score,
    stars,
    attempts,
    seconds,
    progressSaved,
    next: NEXT_LEVEL,
    hints: await L19.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /hint   body: { sessionId, playerId }   (costs 25 hints)
   a new clue each time
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const hints = await L19.spendHints(playerId, COST_HINT);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  const used = Number(session.hints_used) || 0;
  await L19.markHintUsed(sessionId);

  res.json({
    success: true,
    text: HINTS[Math.min(used, HINTS.length - 1)],
    hints,
    cost: COST_HINT,
  });
}));

/* ---------------------------------------------------------
   POST /skip   body: { sessionId, playerId }   (costs 50 hints)
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { sessionId, playerId } = ctx;

  const hints = await L19.spendHints(playerId, COST_SKIP);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L19.skipSession(sessionId);
  await tryUnlock(playerId, 0);

  res.json({
    success: true,
    correct: true,
    completed: true,
    skipped: true,
    message: 'Level skipped!',
    score: 0,
    stars: 0,
    attempts: 1,
    next: NEXT_LEVEL,
    hints,
  });
}));

/* ---------------------------------------------------------
   POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
--------------------------------------------------------- */

r.post('/reward', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
  if (!req.body || req.body.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

  const player = await L19.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const hints = await L19.addHints(playerId, REWARD_VIDEO);
  res.json({ success: true, added: REWARD_VIDEO, hints });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await L19.getProgress(playerId);

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