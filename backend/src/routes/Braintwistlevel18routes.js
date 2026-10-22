const express = require('express');
const L18 = require('../data/level18Db');

const r = express.Router();

const LEVEL = L18.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_HINT = 25;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;

/* ---------------------------------------------------------
   PUZZLE  (the answer stays on the server)
   Arrange the letters to find the correct word.
   Answer: COASTER. The board has one extra letter (K) to confuse the player.
--------------------------------------------------------- */

const TITLE = 'Arrange the letters to find the correct word.';
const CLUE = "It's a name of something you can find in a kitchen... but it's not a common word!";
const WORD = 'COASTER';
const TILES = ['E', 'K', 'R', 'A', 'T', 'C', 'O', 'S'].map((ch, id) => ({ id, ch }));

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
    console.error('[BrainTwist L18 Error]', req.method, req.originalUrl, err);
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

r.use(async (req, res, next) => {
  await L18.ready;
  next();
});

const openSession = async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await L18.getSession(sessionId, playerId);
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

const tryUnlock = async (playerId, attempts) => {
  try {
    await L18.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L18] could not unlock next level:', err.message);
  }
};

/* ---------------------------------------------------------
   POST /start   body: { playerId }
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L18.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L18.abandonActive(playerId);
  const session = await L18.createSession(playerId);

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    title: TITLE,
    clue: CLUE,
    tiles: TILES,
    length: WORD.length,
    hints: Number(player.hints) || 0,
  });
}));

/* ---------------------------------------------------------
   POST /answer   body: { sessionId, playerId, answer }
   answer = the letters the player arranged, e.g. "COASTER"
--------------------------------------------------------- */

r.post('/answer', handle(async (req, res) => {
  const answer = String((req.body && req.body.answer) || '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
  if (!answer || answer.length > 12) return bad(res, 400, 'bad_answer', 'Send the arranged letters');

  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const correct = answer === WORD;
  await L18.recordAnswer(sessionId, answer, correct);

  if (!correct) {
    return res.json({
      success: true,
      correct: false,
      completed: false,
      message: 'Not quite. Try again!',
    });
  }

  const attempts = (await L18.countWrong(sessionId)) + 1;
  const seconds = Number(session.elapsed) || 0;
  const { score, stars } = grade(attempts);

  await L18.completeSession(sessionId, attempts, seconds);

  let progressSaved = false;
  try {
    await L18.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L18] could not save progress:', err.message);
  }
  await tryUnlock(playerId, attempts);

  res.json({
    success: true,
    correct: true,
    completed: true,
    message: 'Correct! The word is COASTER.',
    score,
    stars,
    attempts,
    seconds,
    progressSaved,
    next: NEXT_LEVEL,
    hints: await L18.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /hint   body: { sessionId, playerId }   (costs 25 hints)
   1st hint = first letter, 2nd = first two letters, 3rd+ = first three
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const hints = await L18.spendHints(playerId, COST_HINT);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L18.markHintUsed(sessionId);

  const shown = Math.min((Number(session.hints_used) || 0) + 1, 3);
  res.json({
    success: true,
    text: 'The word starts with: ' + WORD.slice(0, shown),
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

  const hints = await L18.spendHints(playerId, COST_SKIP);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L18.skipSession(sessionId);
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

  const player = await L18.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const hints = await L18.addHints(playerId, REWARD_VIDEO);
  res.json({ success: true, added: REWARD_VIDEO, hints });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await L18.getProgress(playerId);

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