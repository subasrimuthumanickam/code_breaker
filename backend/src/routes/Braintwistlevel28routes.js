const express = require('express');
const db = require('../data/level28Db');

const router = express.Router();

const HINT_COST = 25;
const SKIP_COST = 50;
const REWARD = 75;       // video reward (+75)
const MAX_CLUES = 3;

const fail = (res, status, msg) => res.status(status).json({ error: msg, message: msg });

// a thrown error becomes a 500 json instead of a crash
const wrap = (fn) => async (req, res) => {
  try {
    await db.init();
    await fn(req, res);
  } catch (e) {
    console.error('[level28]', e);
    fail(res, 500, 'Server error');
  }
};

const pidOf = (req) => {
  const v = (req.body || {}).playerId ?? (req.body || {}).player_id;
  return v === undefined || v === null || v === '' ? null : String(v);
};

// loads the session and checks it belongs to the player and is still running
async function openSession(req, res) {
  const pid = pidOf(req);
  if (pid === null) { fail(res, 400, 'playerId is required'); return null; }
  const sid = Number(req.body.sessionId);
  if (!Number.isInteger(sid) || sid <= 0) { fail(res, 400, 'sessionId is required'); return null; }
  const s = await db.getSession(sid);
  if (!s || String(s.player_id) !== pid) { fail(res, 404, 'Session not found. Restart the level.'); return null; }
  if (s.status !== 'playing') { fail(res, 409, 'This level is already finished.'); return null; }
  return { pid, sid, s };
}

// ---------------------------------------------------------------------------
// POST /start  { playerId }  ->  { level, sessionId, title, length, hints }
// the word itself is NEVER sent, only how many letters it has
// ---------------------------------------------------------------------------
router.post('/start', wrap(async (req, res) => {
  const pid = pidOf(req);
  if (pid === null) return fail(res, 400, 'playerId is required');

  const cfg = await db.getConfig();
  const sessionId = await db.createSession(pid);
  const hints = await db.getHints(pid);

  res.json({ level: db.LEVEL, sessionId, title: cfg.title, length: cfg.length, hints });
}));

// ---------------------------------------------------------------------------
// POST /answer  { sessionId, playerId, answer }  answer = the word typed
// ---------------------------------------------------------------------------
router.post('/answer', wrap(async (req, res) => {
  const o = await openSession(req, res);
  if (!o) return;

  const a = String(req.body.answer ?? '').trim().toUpperCase();
  if (!/^[A-Z]{1,32}$/.test(a)) return fail(res, 400, 'Type a word.');

  const cfg = await db.getConfig();
  const correct = cfg.accepted.includes(a);
  const attempts = await db.recordAttempt(o.sid, o.pid, a, correct);
  const hints = await db.getHints(o.pid);

  if (!correct) {
    return res.json({ correct: false, message: 'Not quite. Try again!', stars: 0, score: 0, hints, attempts, skipped: false });
  }

  const used = Number(o.s.hints_used);
  const stars = attempts === 1 && used === 0 ? 3 : attempts <= 3 && used <= 1 ? 2 : 1;
  const score = Math.max(100, 1000 - (attempts - 1) * 100 - used * 100);
  await db.markWon(o.sid, stars, score);

  res.json({
    correct: true,
    message: `Great! The word is ${cfg.answer}.`,
    word: cfg.answer,
    stars,
    score,
    hints,
    attempts,
    skipped: false,
  });
}));

// ---------------------------------------------------------------------------
// POST /hint  { sessionId, playerId }   costs 25, gives the next clue
// ---------------------------------------------------------------------------
router.post('/hint', wrap(async (req, res) => {
  const o = await openSession(req, res);
  if (!o) return;

  if (Number(o.s.hints_used) >= MAX_CLUES) return fail(res, 400, 'No more clues for this level.');

  const left = await db.spendHints(o.pid, HINT_COST);
  if (left === null) return fail(res, 402, 'Not enough hints');

  const clueNo = await db.addHintUsed(o.sid);
  const cfg = await db.getConfig();
  res.json({ hints: left, clue: cfg.clues[clueNo - 1], clueNo, total: MAX_CLUES });
}));

// ---------------------------------------------------------------------------
// POST /skip  { sessionId, playerId }   costs 50
// ---------------------------------------------------------------------------
router.post('/skip', wrap(async (req, res) => {
  const o = await openSession(req, res);
  if (!o) return;

  const left = await db.spendHints(o.pid, SKIP_COST);
  if (left === null) return fail(res, 402, 'Not enough hints');

  await db.markSkipped(o.sid);
  res.json({
    correct: true,
    skipped: true,
    message: 'Level skipped.',
    stars: 0,
    score: 0,
    hints: left,
    attempts: Math.max(1, Number(o.s.attempts)),
  });
}));

// ---------------------------------------------------------------------------
// POST /reward  { playerId }   video reward, only adds hints
// ---------------------------------------------------------------------------
router.post('/reward', wrap(async (req, res) => {
  const pid = pidOf(req);
  if (pid === null) return fail(res, 400, 'playerId is required');
  const hints = await db.addHints(pid, REWARD);
  res.json({ hints, added: REWARD });
}));

module.exports = router;