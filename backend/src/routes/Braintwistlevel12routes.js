const express = require('express');
const L12 = require('../data/level12Db');

const r = express.Router();

const LEVEL = L12.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_HINT = 25;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;



const TITLE = 'Oh no! She is so late for school today!';

const CALENDAR_START = { weekday: 'TUESDAY', month: 'OCT', day: 1 };
const CALENDAR_NEW = { weekday: 'WEDNESDAY', month: 'OCT', day: 2 };

const ANSWER = 'calendar';

// every thing in the room the player can tap, and what to say when it is the wrong one
const TARGETS = {
  calendar: 'The date!',
  clock: 'The clock is not the answer. Look somewhere else!',
  girl: 'Poor girl! Tapping her does not help.',
  window: 'Just a window. Nothing happens.',
  picture: 'A nice picture, but it does not help.',
  lamp: 'The lamp is not the problem.',
  table: 'Only a table with some flowers.',
  bookshelf: 'Books will not help her today.',
  cabinet: 'The phone is not ringing.',
  chairL: 'Nothing here, just a chair.',
  chairR: 'Nothing here, just a chair.',
  rug: 'A cozy rug. Nothing else.',
};

const HINT_TEXT = 'Check what day it is!';

// score from the number of taps (wrong taps + the right one)
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
    console.error('[BrainTwist L12 Error]', req.method, req.originalUrl, err);
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

// wait until the level 12 tables exist before any request runs
r.use(async (req, res, next) => {
  await L12.ready;
  next();
});

// shared checks for /tap /hint /skip -> returns the open session or sends the error
const openSession = async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await L12.getSession(sessionId, playerId);
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

// unlock level 13 - a failure here must never break the answer
const tryUnlock = async (playerId, attempts) => {
  try {
    await L12.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L12] could not unlock next level:', err.message);
  }
};

/* ---------------------------------------------------------
   POST /start   body: { playerId }
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L12.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L12.abandonActive(playerId);
  const session = await L12.createSession(playerId);

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    title: TITLE,
    calendar: CALENDAR_START,
    hints: Number(player.hints) || 0,
  });
}));

/* ---------------------------------------------------------
   POST /tap   body: { sessionId, playerId, target }
   target = which thing in the room the player tapped
--------------------------------------------------------- */

r.post('/tap', handle(async (req, res) => {
  const target = String((req.body && req.body.target) || '');
  if (!Object.prototype.hasOwnProperty.call(TARGETS, target)) {
    return bad(res, 400, 'bad_target', 'Unknown thing');
  }

  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const correct = target === ANSWER;
  const before = await L12.countTaps(sessionId);
  await L12.recordTap(sessionId, target, correct);

  if (!correct) {
    return res.json({
      success: true,
      correct: false,
      completed: false,
      message: TARGETS[target],
    });
  }

  const attempts = before + 1;
  const seconds = Number(session.elapsed) || 0;
  const { score, stars } = grade(attempts);

  await L12.completeSession(sessionId, attempts, seconds);

  let progressSaved = false;
  try {
    await L12.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L12] could not save progress:', err.message);
  }
  await tryUnlock(playerId, attempts);

  res.json({
    success: true,
    correct: true,
    completed: true,
    message: 'The calendar changed to Oct 2!',
    calendar: CALENDAR_NEW,
    score,
    stars,
    attempts,
    seconds,
    progressSaved,
    next: NEXT_LEVEL,
    hints: await L12.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /hint   body: { sessionId, playerId }   (costs 25 hints)
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { sessionId, playerId } = ctx;

  const hints = await L12.spendHints(playerId, COST_HINT);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L12.markHintUsed(sessionId);

  res.json({ success: true, text: HINT_TEXT, target: ANSWER, hints, cost: COST_HINT });
}));

/* ---------------------------------------------------------
   POST /skip   body: { sessionId, playerId }   (costs 50 hints)
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { sessionId, playerId } = ctx;

  const hints = await L12.spendHints(playerId, COST_SKIP);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L12.skipSession(sessionId);
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

  const player = await L12.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const hints = await L12.addHints(playerId, REWARD_VIDEO);
  res.json({ success: true, added: REWARD_VIDEO, hints });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await L12.getProgress(playerId);

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