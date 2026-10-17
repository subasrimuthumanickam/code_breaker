// backend/src/routes/Braintwistlevel4routes.js
// Brain Twist - LEVEL 4 routes: read the request, call level4Db.js, send JSON back.
//
// Puzzle: the girl must dive into the pool and catch the fish.
//   The player raises the water (0 - 100) and presses JUMP.
//   waterLevel >= REQUIRED_LEVEL  -> safe splash, she catches the fish (win)
//   otherwise                     -> she hits the bottom, try again

const express = require('express');
const L4 = require('../data/level4Db');

const r = express.Router();

const LEVEL = L4.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_HINT = 25;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;

/* ---------------------------------------------------------
   PUZZLE  (the right answer stays on the server)
--------------------------------------------------------- */

const PUZZLE = {
  question: 'She must do a dive jump successfully.',
  requiredLevel: 70,   // water must reach at least this level
  hintLevel: 80,       // the line the magnifier shows
  hintText: 'Raise the water up to the line, then press JUMP.',
};

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L4 Error]', req.method, req.originalUrl, err);
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

// wait until the level 4 tables exist before any request runs
r.use(async (req, res, next) => {
  await L4.ready;
  next();
});

// shared checks for /jump /hint /skip -> returns the open session or sends the error
const openSession = async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await L4.getSession(sessionId, playerId);
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

  const player = await L4.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const session = (await L4.findOpenSession(playerId)) || (await L4.createSession(playerId));

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    question: PUZZLE.question,
    hintLevel: Number(session.hint_used) ? PUZZLE.hintLevel : null,
    hints: Number(player.hints) || 0,
    wrongAttempts: Number(session.wrong_attempts) || 0,
  });
}));

/* ---------------------------------------------------------
   POST /jump   body: { sessionId, playerId, waterLevel }
--------------------------------------------------------- */

r.post('/jump', handle(async (req, res) => {
  const raw = Number(req.body?.waterLevel);
  if (!Number.isFinite(raw) || raw < 0 || raw > 100) {
    return bad(res, 400, 'invalid_water', 'waterLevel must be between 0 and 100');
  }
  const waterLevel = Math.round(raw);

  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const wrongBefore = Number(session.wrong_attempts) || 0;
  const attemptsBefore = Number(session.total_attempts) || 0;

  let outcome;
  let message;
  if (waterLevel >= PUZZLE.requiredLevel) {
    outcome = 'splash';
    message = 'Splash! She caught the fish!';
  } else if (waterLevel >= 35) {
    outcome = 'too_shallow';
    message = 'Still too shallow! Raise the water more.';
  } else {
    outcome = 'hit_bottom';
    message = 'Ouch! She hit the bottom. Add water first!';
  }
  const correct = outcome === 'splash';

  await L4.recordAttempt(sessionId, waterLevel, outcome, correct);

  if (!correct) {
    await L4.markWrong(sessionId);
    return res.json({
      success: true,
      correct: false,
      completed: false,
      outcome,
      wrongAttempts: wrongBefore + 1,
      message,
    });
  }

  const attempts = attemptsBefore + 1;
  const score = Math.max(100, 300 - wrongBefore * 50);
  const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

  await L4.completeSession(sessionId);

  let progressSaved = false;
  try {
    await L4.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L4] could not save progress:', err.message);
  }

  try {
    await L4.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L4] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    outcome,
    message,
    score,
    stars,
    attempts,
    progressSaved,
    next: NEXT_LEVEL,
    hints: await L4.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /hint   body: { sessionId, playerId }   (costs 25 hints, only the first time)
   shows the water line the player has to reach
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  // already bought -> just show it again, no extra charge
  if (!Number(session.hint_used)) {
    if (!(await L4.spendHints(playerId, COST_HINT))) {
      return bad(res, 402, 'not_enough_hints', 'Not enough hints!');
    }
    await L4.markHintUsed(sessionId);
  }

  res.json({
    success: true,
    hint: { level: PUZZLE.hintLevel, text: PUZZLE.hintText },
    hints: await L4.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /skip   body: { sessionId, playerId }   (costs 50 hints)
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  if (!(await L4.spendHints(playerId, COST_SKIP))) {
    return bad(res, 402, 'not_enough_hints', 'Not enough hints!');
  }

  await L4.skipSession(sessionId);

  try {
    await L4.unlockNext(playerId, Number(session.total_attempts) || 0);
  } catch (err) {
    console.error('[BrainTwist L4] could not unlock next level:', err.message);
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
    hints: await L4.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
--------------------------------------------------------- */

r.post('/reward', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
  if (req.body?.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

  const player = await L4.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L4.addHints(playerId, REWARD_VIDEO);

  res.json({ success: true, added: REWARD_VIDEO, hints: await L4.getHints(playerId) });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await L4.getProgress(playerId);

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