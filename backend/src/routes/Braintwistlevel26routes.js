

const express = require('express');
const router = express.Router();

const LEVEL = 26;
const HINT_COST = 25;
const SKIP_COST = 50;
const REWARD = 25;
const START_HINTS = 2200;

// ---------------------------------------------------------------------------
// Level layout (what the screen reads as Level26View)
// ---------------------------------------------------------------------------
const SUN = { x: 0.5, y: 0.18, r: 0.09, margin: 0.02 };
const BOUNDS = { minX: 0.17, maxX: 0.83, minY: 0.08, maxY: 0.45 };
// 4 overlapping clouds hiding the sun (same look as the reference design)
// x, y = centre, w = width (fraction of scene width), r = collision radius
const CLOUDS = [
  { id: 1, x: 0.49, y: 0.11, w: 0.34, r: 0.11,  tone: 'blue' },
  { id: 2, x: 0.39, y: 0.24, w: 0.26, r: 0.085, tone: 'gray' },
  { id: 3, x: 0.59, y: 0.25, w: 0.27, r: 0.09,  tone: 'gray' },
  { id: 4, x: 0.5,  y: 0.27, w: 0.37, r: 0.12,  tone: 'blue' },
];
const TITLE = 'Can you wake up my cat?';
const CLUE =
  'Horns and alarms are not what this sleepy cat needs. What is hiding behind the clouds?';

// ---------------------------------------------------------------------------
// In-memory state (swap getHints/setHints for your DB calls if you keep
// the hint balance in the database).
// ---------------------------------------------------------------------------
const hintsStore = new Map();   // playerId -> balance
const sessions = new Map();     // sessionId -> { playerId, attempts, hints }
let nextSession = 1;

const getHints = (pid) => (hintsStore.has(pid) ? hintsStore.get(pid) : START_HINTS);
const setHints = (pid, v) => hintsStore.set(pid, v);

const fail = (res, status, msg) => res.status(status).json({ error: msg, message: msg });

const pidOf = (req) => {
  const b = req.body || {};
  const q = req.query || {};
  const v = b.playerId ?? b.player_id ?? q.playerId ?? q.player_id;
  return v === undefined || v === null || v === '' ? null : String(v);
};

// cloud hides the sun?
const blocks = (c, p) =>
  Math.hypot(p.x - SUN.x, p.y - SUN.y) < c.r + SUN.r + SUN.margin;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const view = (sessionId, hints) => ({
  level: LEVEL,
  sessionId,
  title: TITLE,
  question: TITLE,
  hints,
  sun: SUN,
  clouds: CLOUDS,
  bounds: BOUNDS,
});

// ---------------------------------------------------------------------------
// POST /start
// ---------------------------------------------------------------------------
router.post('/start', (req, res) => {
  const pid = pidOf(req);
  if (pid === null) return fail(res, 400, 'playerId is required');
  const sessionId = nextSession++;
  sessions.set(sessionId, { playerId: pid, attempts: 0, hintsUsed: 0 });
  res.json(view(sessionId, getHints(pid)));
});

// ---------------------------------------------------------------------------
// POST /hint   body: { sessionId, playerId, clouds:[{id,x,y}] }
// ---------------------------------------------------------------------------
router.post('/hint', (req, res) => {
  const pid = pidOf(req);
  if (pid === null) return fail(res, 400, 'playerId is required');

  const s = sessions.get(Number(req.body.sessionId));
  if (s) s.hintsUsed += 1;

  // find a cloud that still hides the sun and say which way to push it
  const now = Array.isArray(req.body.clouds) ? req.body.clouds : CLOUDS;
  let target = null;
  let dir = null;
  for (const c of CLOUDS) {
    const p = now.find((o) => Number(o.id) === c.id) || c;
    if (blocks(c, p)) {
      target = c.id;
      dir = p.x <= SUN.x ? 'L' : 'R';
      break;
    }
  }

  res.json({ success: true, free: true, cost: 0, hints: getHints(pid), clue: CLUE, target, dir });
});

// ---------------------------------------------------------------------------
// POST /finish   body: { sessionId, playerId, actions:[{t:'drag',id,x,y}] }
// Replays every drag and checks the sun is free.
// ---------------------------------------------------------------------------
router.post('/finish', (req, res) => {
  const pid = pidOf(req);
  if (pid === null) return fail(res, 400, 'playerId is required');

  const sid = Number(req.body.sessionId);
  const s = sessions.get(sid);
  if (!s || s.playerId !== pid) return fail(res, 400, 'Session not found. Restart the level.');

  const actions = Array.isArray(req.body.actions) ? req.body.actions : [];
  const pos = {};
  CLOUDS.forEach((c) => { pos[c.id] = { x: c.x, y: c.y }; });

  let drags = 0;
  for (const a of actions) {
    if (!a || a.t !== 'drag' || !pos[a.id]) continue;
    const x = Number(a.x), y = Number(a.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    pos[a.id] = { x: clamp(x, BOUNDS.minX, BOUNDS.maxX), y: clamp(y, BOUNDS.minY, BOUNDS.maxY) };
    drags += 1;
  }

  s.attempts += 1;
  const free = CLOUDS.every((c) => !blocks(c, pos[c.id]));
  if (!free) return fail(res, 400, 'The sun is still hidden.');

  const stars = drags <= 5 && s.hintsUsed === 0 ? 3 : drags <= 8 ? 2 : 1;
  const score = Math.max(100, 1000 - drags * 40 - s.hintsUsed * 100);
  sessions.delete(sid);

  res.json({
    correct: true,
    message: 'The sun is out and the cat is awake!',
    stars,
    score,
    hints: getHints(pid),
    attempts: s.attempts,
    skipped: false,
  });
});

// ---------------------------------------------------------------------------
// POST /skip   body: { sessionId, playerId }
// ---------------------------------------------------------------------------
router.post('/skip', (req, res) => {
  const pid = pidOf(req);
  if (pid === null) return fail(res, 400, 'playerId is required');

  const bal = getHints(pid);
  if (bal < SKIP_COST) return fail(res, 402, 'Not enough hints');
  setHints(pid, bal - SKIP_COST);

  const sid = Number(req.body.sessionId);
  const s = sessions.get(sid);
  sessions.delete(sid);

  res.json({
    correct: true,
    skipped: true,
    message: 'Level skipped.',
    stars: 0,
    score: 0,
    hints: bal - SKIP_COST,
    attempts: s ? Math.max(1, s.attempts) : 1,
  });
});

// ---------------------------------------------------------------------------
// POST /reward   body: { playerId }   (video reward, +25 hints)
// ---------------------------------------------------------------------------
router.post('/reward', (req, res) => {
  const pid = pidOf(req);
  if (pid === null) return fail(res, 400, 'playerId is required');
  const bal = getHints(pid) + REWARD;
  setHints(pid, bal);
  res.json({ hints: bal, added: REWARD });
});

module.exports = router;