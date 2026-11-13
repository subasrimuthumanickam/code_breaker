
const express = require('express');
const L4 = require('../data/level4Db');

const r = express.Router();

const LEVEL = L4.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;

const PUZZLE = {
  question: 'Help her make a safe jump into the pool!',
  requiredLevel: 70,   // water must reach at least this level
  hintLevel: 80,       // the line the magnifier shows
  hintStep: 1,         // number shown in the hint popup
  hintText: 'Drag the water up to the yellow line, then tap JUMP to help her dive safely!',
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
    // the yellow line stays on the board if the clue was already opened in this game
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
    message = 'Splash! Perfect dive!';
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
   POST /hint   body: { sessionId, playerId }
   FREE: no hints or coins are taken. The view is saved in MySQL and the
   water line + hint text are sent back as JSON.
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  // remember (in this game) that the clue was opened, so the yellow line stays after a reload
  if (!Number(session.hint_used)) {
    await L4.markHintUsed(sessionId);
  }

  // save this hint view in MySQL (a save problem must not break the game)
  try {
    await L4.saveHintView(sessionId, playerId, PUZZLE.hintText, false);
  } catch (err) {
    console.error('[BrainTwist L4] could not save hint view:', err.message);
  }

  res.json({
    success: true,
    hint: { level: PUZZLE.hintLevel, step: PUZZLE.hintStep, text: PUZZLE.hintText },
    charged: false,
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
    const have = await L4.getHints(playerId);
    return bad(
      res,
      402,
      'not_enough_hints',
      `Not enough hints! You have ${have}, skip needs ${COST_SKIP}.`
    );
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