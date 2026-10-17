const express = require('express');
const L10 = require('../data/level10Db');
const G = require('../data/level10Logic');

const r = express.Router();

const LEVEL = L10.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_HINT = 25;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;

const TITLE = 'Win this game, somehow...';

// score from the time taken (seconds since the level was opened)
const grade = (seconds) => {
  if (seconds <= 45) return { score: 300, stars: 3 };
  if (seconds <= 100) return { score: 200, stars: 2 };
  return { score: 100, stars: 1 };
};

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L10 Error]', req.method, req.originalUrl, err);
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

// wait until the level 10 tables exist before any request runs
r.use(async (req, res, next) => {
  await L10.ready;
  next();
});

// shared checks for /hint /finish /skip -> returns the open session or sends the error
const openSession = async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await L10.getSession(sessionId, playerId);
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

// unlock level 11 - a failure here must never break the answer
const tryUnlock = async (playerId, attempts) => {
  try {
    await L10.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L10] could not unlock next level:', err.message);
  }
};

/* ---------------------------------------------------------
   POST /start   body: { playerId }
   EVERY time the level is opened: a new session and a start board
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L10.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L10.abandonActive(playerId);

  const seed = Math.floor(Math.random() * 2147483646) + 1;
  const session = await L10.createSession(playerId, seed);

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    title: TITLE,
    board: G.initialBoard(seed),
    hints: Number(player.hints) || 0,
  });
}));

/* ---------------------------------------------------------
   POST /finish   body: { sessionId, playerId, actions }
   actions = what the player did since the last restart:
   [{ t:'tap', c:4 }, { t:'swipe', d:'R' }]
   The server plays them again from the start board and X must win.
--------------------------------------------------------- */

r.post('/finish', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const actions = req.body && req.body.actions;
  const result = G.play(G.initialBoard(session.seed), actions);

  if (!result.ok || result.status !== 'win') {
    return bad(res, 400, 'bad_actions', 'Those moves do not win the game');
  }

  const moves = actions.length;
  const seconds = Number(session.elapsed) || 0;
  const { score, stars } = grade(seconds);
  const attempts = 1;

  await L10.completeSession(sessionId, playerId, moves, seconds, JSON.stringify(actions));

  let progressSaved = false;
  try {
    await L10.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L10] could not save progress:', err.message);
  }
  await tryUnlock(playerId, attempts);

  res.json({
    success: true,
    completed: true,
    message: 'Tilted! X wins the game!',
    score,
    stars,
    attempts,
    moves,
    seconds,
    progressSaved,
    next: NEXT_LEVEL,
    hints: await L10.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /hint   body: { sessionId, playerId, board }   (costs 25 hints)
   tells which way to swipe the board
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const hints = await L10.spendHints(playerId, COST_HINT);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L10.markHintUsed(sessionId);

  const start = G.initialBoard(session.seed);
  const sent = req.body && req.body.board;
  const current =
    Array.isArray(sent) && sent.length === 9 && sent.every((v) => v === 0 || v === 1 || v === 2)
      ? sent
      : start;

  // the swipe that wins now, else the one that wins from the start board
  const dir = G.solveDir(current) || G.solveDir(start);

  res.json({ success: true, dir, hints, cost: COST_HINT });
}));

/* ---------------------------------------------------------
   POST /skip   body: { sessionId, playerId }   (costs 50 hints)
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { sessionId, playerId } = ctx;

  const hints = await L10.spendHints(playerId, COST_SKIP);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L10.skipSession(sessionId);
  await tryUnlock(playerId, 0);

  res.json({
    success: true,
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

  const player = await L10.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const hints = await L10.addHints(playerId, REWARD_VIDEO);
  res.json({ success: true, added: REWARD_VIDEO, hints });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await L10.getProgress(playerId);

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