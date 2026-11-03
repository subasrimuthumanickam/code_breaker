// // Braintwistlevel41routes.js — Express routes for Level 41
// // In server.js:
// //   const level41Routes = require('./Braintwistlevel41routes');
// //   app.use('/api/braintwist/level41', level41Routes);
// const express = require('express');
// const { initLevel41Db, getLevel41, submitAnswer, useClue, skipLevel } = require('./level41Db');

// const router = express.Router();

// initLevel41Db().catch((e) => console.error('Level41 DB init failed:', e.message));

// // userId comes from body / query (replace with your auth middleware if you have one)
// const getUserId = (req) => {
//   const id = parseInt(req.body?.userId ?? req.query?.userId ?? req.headers['x-user-id'] ?? 1, 10);
//   return Number.isFinite(id) && id > 0 ? id : 1;
// };

// const wrap = (fn) => async (req, res) => {
//   try {
//     await fn(req, res);
//   } catch (e) {
//     console.error('Level41 error:', e);
//     res.status(500).json({ success: false, error: 'SERVER_ERROR', message: e.message });
//   }
// };

// // GET /api/braintwist/level41?userId=1  -> puzzle state
// router.get('/', wrap(async (req, res) => {
//   const state = await getLevel41(getUserId(req));
//   res.json({ success: true, state });
// }));

// // POST /api/braintwist/level41/answer  { userId, guess:"BRAIN" }
// router.post('/answer', wrap(async (req, res) => {
//   const guess = req.body?.guess;
//   if (typeof guess !== 'string' || !guess.trim()) {
//     return res.status(400).json({ success: false, error: 'GUESS_REQUIRED' });
//   }
//   const out = await submitAnswer(getUserId(req), guess);
//   res.json({ success: true, ...out });
// }));

// // POST /api/braintwist/level41/clue  { userId }
// router.post('/clue', wrap(async (req, res) => {
//   const out = await useClue(getUserId(req));
//   res.status(out.ok ? 200 : 400).json({ success: out.ok, ...out });
// }));

// // POST /api/braintwist/level41/skip  { userId }
// router.post('/skip', wrap(async (req, res) => {
//   const out = await skipLevel(getUserId(req));
//   res.status(out.ok ? 200 : 400).json({ success: out.ok, ...out });
// }));

// module.exports = router;
// routes/Braintwistlevel41routes.js — Express routes for Brain Twist Level 41
// level41Db.js can be in  src/data/level41Db.js  (recommended)  OR  src/routes/level41Db.js — both work.
const express = require('express');

let db;
try {
  db = require('../data/level41Db');
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') throw e;
  db = require('./level41Db');
}
const { initLevel41Db, getLevel41, submitAnswer, useClue, skipLevel } = db;

const router = express.Router();

initLevel41Db().catch((e) => console.error('Level41 DB init failed:', e.message));

// playerId (or userId) comes from body / query
const getUserId = (req) => {
  const id = parseInt(
    req.body?.playerId ?? req.query?.playerId ?? req.body?.userId ?? req.query?.userId ?? req.headers['x-user-id'] ?? 1,
    10
  );
  return Number.isFinite(id) && id > 0 ? id : 1;
};

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (e) {
    console.error('Level41 error:', e);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: e.message });
  }
};

// GET /api/braintwist/level41?playerId=1  -> puzzle state
router.get('/', wrap(async (req, res) => {
  const state = await getLevel41(getUserId(req));
  res.json({ success: true, state });
}));

// POST /api/braintwist/level41/answer  { playerId, guess:"BRAIN" }
router.post('/answer', wrap(async (req, res) => {
  const guess = req.body?.guess;
  if (typeof guess !== 'string' || !guess.trim()) {
    return res.status(400).json({ success: false, error: 'GUESS_REQUIRED' });
  }
  const out = await submitAnswer(getUserId(req), guess);
  res.json({ success: true, ...out });
}));

// POST /api/braintwist/level41/clue  { playerId }
router.post('/clue', wrap(async (req, res) => {
  const out = await useClue(getUserId(req));
  res.status(out.ok ? 200 : 400).json({ success: out.ok, ...out });
}));

// POST /api/braintwist/level41/skip  { playerId }
router.post('/skip', wrap(async (req, res) => {
  const out = await skipLevel(getUserId(req));
  res.status(out.ok ? 200 : 400).json({ success: out.ok, ...out });
}));

module.exports = router;