// Brain Twist - Level 6: "Draw a star please"
// 5 dots sit on the points of a star. The player drags a line from one dot to another.
// The server decides which lines belong to the star (every dot connects to the dot two
// places further round). Joining neighbours would make a pentagon, so that is wrong.
const express = require('express');
const L6 = require('../data/level6Db');

const r = express.Router();

const HINT_COST = 25;
const TITLE = 'Draw a star please';
const HINT = 'Join the dots with your finger';

// dot positions, 0..1 of a square board (a star standing on two feet)
const DOTS = [0, 1, 2, 3, 4].map((k) => {
  const a = (-90 + k * 72) * Math.PI / 180;
  return { id: k + 1, x: +(0.5 + 0.42 * Math.cos(a)).toFixed(4), y: +(0.54 + 0.42 * Math.sin(a)).toFixed(4) };
});

// the 5 lines of the star: dot k -> dot k+2
const STAR_EDGES = [0, 1, 2, 3, 4].map((k) => {
  const a = k + 1, b = ((k + 2) % 5) + 1;
  return a < b ? [a, b] : [b, a];
});

const key = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
const STAR_KEYS = new Set(STAR_EDGES.map(([a, b]) => key(a, b)));

const view = (edges) => ({
  level: L6.LEVEL,
  title: TITLE,
  hint: HINT,
  dots: DOTS,
  totalEdges: STAR_EDGES.length,
  remaining: STAR_EDGES.length - edges.length,
  edges: edges.map(([from, to]) => ({ from, to })),
});

/* ---------------- misc ---------------- */

const handle = (fn) => async (req, res) => {
  try { await fn(req, res); }
  catch (err) {
    console.error('[BrainTwist L6 Error]', req.method, req.originalUrl, err);
    if (!res.headersSent) res.status(500).json({ success: false, error: 'server_error', message: err.message });
  }
};

const toId = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
const toDot = (v) => { const n = Number(v); return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null; };
const bad = (res, status, error, message) => res.status(status).json({ success: false, error, message });

r.use(async (req, res, next) => { await L6.ready; next(); });

/* ---------------- POST /start   { playerId } ---------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  let session = await L6.findActive(playerId);
  if (!session) session = await L6.createSession(playerId);

  res.json({ success: true, sessionId: session.id, status: session.status, ...view(session.edges) });
}));

/* ---------------- POST /connect   { sessionId, playerId, from, to } ---------------- */

r.post('/connect', handle(async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);
  const from = toDot(req.body && req.body.from);
  const to = toDot(req.body && req.body.to);
  if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
  if (!from || !to || from === to) return bad(res, 400, 'invalid_move', 'Join two different dots');

  const session = await L6.getSession(sessionId, playerId);
  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

  const edges = session.edges;
  const k = key(from, to);

  // already drawn -> nothing changes
  if (edges.some(([a, b]) => key(a, b) === k)) {
    return res.json({ success: true, correct: true, duplicate: true, completed: false, message: 'You already drew that line.', ...view(edges) });
  }

  /* ----- not a line of the star ----- */
  if (!STAR_KEYS.has(k)) {
    await L6.recordMove(sessionId, from, to, false, 'not_star_edge');
    return res.json({
      success: true,
      correct: false,
      completed: false,
      from, to,
      wrongAttempts: Number(session.wrong_attempts) + 1,
      message: 'That makes a pentagon, not a star! Skip a dot.',
      ...view(edges),
    });
  }

  /* ----- right line ----- */
  const next = [...edges, from < to ? [from, to] : [to, from]];
  await L6.recordMove(sessionId, from, to, true, 'star_edge');
  await L6.saveEdges(sessionId, next);

  if (next.length < STAR_EDGES.length) {
    return res.json({ success: true, correct: true, completed: false, from, to, message: 'Nice line!', ...view(next) });
  }

  /* ----- star finished ----- */
  const wrong = Number(session.wrong_attempts);
  const attempts = Number(session.total_attempts) + 1;
  const score = Math.max(100, 300 - wrong * 50);
  const stars = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;

  await L6.completeSession(sessionId);

  let progressSaved = false;
  try { await L6.saveProgress(playerId, score, stars, attempts); progressSaved = true; }
  catch (err) { console.error('[BrainTwist L6] could not save progress:', err.message); }

  res.json({
    success: true, correct: true, completed: true, from, to,
    message: 'What a shiny star!',
    score, stars, attempts, progressSaved,
    ...view(next),
  });
}));

/* ---------------- POST /hint   { sessionId, playerId } ---------------- */

r.post('/hint', handle(async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);
  if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

  const session = await L6.getSession(sessionId, playerId);
  if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

  const drawn = new Set(session.edges.map(([a, b]) => key(a, b)));
  const target = STAR_EDGES.find(([a, b]) => !drawn.has(key(a, b)));
  if (!target) return bad(res, 409, 'nothing_to_hint', 'Nothing left to draw');

  const hints = await L6.spendHints(playerId, HINT_COST);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  res.json({ success: true, from: target[0], to: target[1], hints, cost: HINT_COST });
}));

/* ---------------- GET /status/:playerId ---------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
  const row = await L6.getProgress(playerId);
  res.json({
    success: true,
    level: L6.LEVEL,
    completed: Boolean(row && row.is_completed),
    score: row ? Number(row.score) || 0 : 0,
    stars: row ? Number(row.stars) || 0 : 0,
    attempts: row ? Number(row.attempts) || 0 : 0,
    completedAt: row ? row.completed_at : null,
  });
}));

r._test = { DOTS, STAR_EDGES };
module.exports = r;