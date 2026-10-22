// const express = require('express');
// const router = express.Router();
// const db = require('../data/level14Db');

// const VALID = ['open_fridge', 'giraffe_in', 'close_fridge'];

// // ADJUST: use the same way level12 gets the logged-in player (auth middleware)
// const getPlayerId = (req) => (req.user && req.user.id) || req.body.playerId;

// // 1) frontend -> start level
// router.post('/start', async (req, res) => {
//   try {
//     const playerId = getPlayerId(req);
//     if (!playerId) return res.status(400).json({ success: false, message: 'playerId missing' });
//     const sessionId = await db.createSession(playerId);
//     res.json({ success: true, sessionId });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // 2) frontend -> every tap is stored
// router.post('/action', async (req, res) => {
//   try {
//     const { sessionId, action } = req.body;
//     const playerId = getPlayerId(req);
//     if (!VALID.includes(action)) return res.status(400).json({ success: false, message: 'Invalid action' });
//     const s = await db.getSession(sessionId, playerId);
//     if (!s || s.status !== 'active') return res.status(404).json({ success: false, message: 'Session not found' });
//     await db.addAction(sessionId, action);
//     res.json({ success: true });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // 3) frontend -> submit; backend verifies from DB
// router.post('/submit', async (req, res) => {
//   try {
//     const { sessionId } = req.body;
//     const playerId = getPlayerId(req);
//     const s = await db.getSession(sessionId, playerId);
//     if (!s) return res.status(404).json({ success: false, message: 'Session not found' });

//     const actions = await db.getActions(sessionId);
//     if (!db.isSolved(actions)) {
//       return res.json({ success: true, correct: false, message: 'Open the fridge, put the giraffe in, then close it.' });
//     }
//     await db.completeSession(sessionId, playerId);
//     res.json({ success: true, correct: true, nextLevel: 15 });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = router;

// // In your main server file (where level12 is registered) add:
// // app.use('/api/braintwist/level14', require('./routes/Braintwistlevel14routes'));
const express = require('express');
const L14 = require('../data/level14Db');

const r = express.Router();

const LEVEL = L14.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_HINT = 25;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;

/* ---------------------------------------------------------
   PUZZLE  (the rules stay on the server)
   Put the giraffe into the fridge:
   open the fridge -> put the giraffe in -> close the fridge
--------------------------------------------------------- */

const TITLE = 'Put the giraffe into the fridge.';
const ACTIONS = ['open_fridge', 'giraffe_in', 'close_fridge'];

const HINT_TEXT = 'First open the door. Then close it when the giraffe is inside!';

// score from the number of wrong actions + the final one
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
    console.error('[BrainTwist L14 Error]', req.method, req.originalUrl, err);
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
  await L14.ready;
  next();
});

const openSession = async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await L14.getSession(sessionId, playerId);
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
    await L14.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L14] could not unlock next level:', err.message);
  }
};

/* ---------------------------------------------------------
   POST /start   body: { playerId }
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L14.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L14.abandonActive(playerId);
  const session = await L14.createSession(playerId);

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    title: TITLE,
    state: { open: false, giraffeIn: false },
    hints: Number(player.hints) || 0,
  });
}));

/* ---------------------------------------------------------
   POST /action   body: { sessionId, playerId, action }
   action = open_fridge | giraffe_in | close_fridge
--------------------------------------------------------- */

r.post('/action', handle(async (req, res) => {
  const action = String((req.body && req.body.action) || '');
  if (!ACTIONS.includes(action)) return bad(res, 400, 'bad_action', 'Unknown action');

  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const state = await L14.getState(sessionId);

  // giraffe can only go in when the door is open and it is not already inside
  if (action === 'giraffe_in' && (!state.open || state.giraffeIn)) {
    await L14.recordAction(sessionId, action, false);
    return res.json({
      success: true,
      correct: false,
      completed: false,
      message: state.giraffeIn ? 'The giraffe is already inside!' : 'The fridge door is closed.',
      state,
    });
  }

  await L14.recordAction(sessionId, action, true);

  const next = { ...state };
  if (action === 'open_fridge') next.open = true;
  if (action === 'giraffe_in') next.giraffeIn = true;
  if (action === 'close_fridge') next.open = false;

  // solved: door closed with the giraffe inside
  const solved = action === 'close_fridge' && state.open && state.giraffeIn;
  if (!solved) {
    return res.json({ success: true, correct: true, completed: false, state: next });
  }

  const attempts = (await L14.countWrong(sessionId)) + 1;
  const seconds = Number(session.elapsed) || 0;
  const { score, stars } = grade(attempts);

  await L14.completeSession(sessionId, attempts, seconds);

  let progressSaved = false;
  try {
    await L14.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L14] could not save progress:', err.message);
  }
  await tryUnlock(playerId, attempts);

  res.json({
    success: true,
    correct: true,
    completed: true,
    message: 'The giraffe is in the fridge!',
    state: next,
    score,
    stars,
    attempts,
    seconds,
    progressSaved,
    next: NEXT_LEVEL,
    hints: await L14.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /hint   body: { sessionId, playerId }   (costs 25 hints)
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { sessionId, playerId } = ctx;

  const hints = await L14.spendHints(playerId, COST_HINT);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L14.markHintUsed(sessionId);

  res.json({ success: true, text: HINT_TEXT, hints, cost: COST_HINT });
}));

/* ---------------------------------------------------------
   POST /skip   body: { sessionId, playerId }   (costs 50 hints)
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { sessionId, playerId } = ctx;

  const hints = await L14.spendHints(playerId, COST_SKIP);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L14.skipSession(sessionId);
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

  const player = await L14.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const hints = await L14.addHints(playerId, REWARD_VIDEO);
  res.json({ success: true, added: REWARD_VIDEO, hints });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await L14.getProgress(playerId);

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