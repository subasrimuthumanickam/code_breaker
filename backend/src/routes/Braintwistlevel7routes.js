
const express = require('express');
const L7 = require('../data/level7Db');

const r = express.Router();

const LAST_STAGE = 3;
const HINT_COST = 25;   // charged once per stage, asking again for the same stage is free
const WRONG_DEFAULT = 'Hmm, think again!';

const STAGES = {
  1: {
    title: "Mia's bus leaves at 8:00! Which clock shows the real time?",
    hint: 'One clock has stopped. Find the one still running.',
    clue: 'The right time may be hiding in the wrong place… or is the wrong time right in front of you?',
    mode: 'tap',
    objects: [
      { id: 'wallclock', label: 'Wall clock' },
      { id: 'alarm', label: 'Alarm clock' },
      { id: 'calendar', label: 'Calendar' },
      { id: 'board', label: 'Timetable' },
    ],
    answer: 'alarm',
    wrong: {
      wallclock: 'The battery fell out, so this clock stopped at 7:20!',
      calendar: 'A calendar shows the day, not the time!',
      board: 'The timetable shows lessons, not the time!',
    },
    right: 'It is 7:50. Only 10 minutes left!',
    scene: { mood: 'late' },
  },
  2: {
    title: "Yesterday was Tuesday. Put today's book in Mia's bag.",
    hint: 'Work out today, then check the timetable.',
    clue: "Find the day that comes right after Tuesday. Look for the book with that day's name on it.",
    mode: 'drag',
    target: 'bag',
    tray: [
      { id: 'maths', label: 'Maths' },
      { id: 'science', label: 'Science' },
      { id: 'art', label: 'Art' },
    ],
    answer: 'science',
    wrong: {
      maths: 'Maths is on Monday. That was two days ago!',
      art: 'Art was yesterday (Tuesday). Today is Wednesday!',
    },
    right: 'Today is Wednesday, so Science. The bag is packed!',
    scene: { mood: 'pack' },
  },
  3: {
    title: 'Ticket: 9 coins. Mia has 4 and her brother gave 2. Which coin does she still need?',
    hint: 'Take what she has away from 9, then drag the coin to Mia.',
    clue: 'She already has some coins… but how many more coins does she need to buy the ticket?',
    mode: 'drag',
    target: 'mia',
    tray: [
      { id: 'c1', label: 'Coin 1' },
      { id: 'c3', label: 'Coin 3' },
      { id: 'c4', label: 'Coin 4' },
    ],
    answer: 'c3',
    wrong: {
      c1: '4 + 2 + 1 = 7. That is still not 9!',
      c4: '4 + 2 + 4 = 10. That is too much!',
    },
    right: '9 - 4 - 2 = 3. Mia caught the bus!',
    scene: { mood: 'pay' },
  },
};

// the room after the last right answer
const FINAL_SCENE = { mood: 'happy' };

// what the frontend may see about a stage (no answer, no clue text)
const stageView = (stage, clueUsed = false) => {
  const s = STAGES[stage];
  return {
    stage,
    totalStages: LAST_STAGE,
    title: s.title,
    hint: s.hint,
    mode: s.mode,
    target: s.target || null,
    objects: s.objects || [],
    tray: s.tray || [],
    scene: s.scene,
    clueUsed,
  };
};

/* ---------------- misc ---------------- */

const handle = (fn) => async (req, res) => {
  try { await fn(req, res); }
  catch (err) {
    console.error('[BrainTwist L7 Error]', req.method, req.originalUrl, err);
    if (!res.headersSent) res.status(500).json({ success: false, error: 'server_error', message: err.message });
  }
};

const toId = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
const word = (v) => String(v || '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 30);
const bad = (res, status, error, message) => res.status(status).json({ success: false, error, message });

r.use(async (req, res, next) => { await L7.ready; next(); });

/* ---------------- POST /start   { playerId } ---------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  let session = await L7.findActive(playerId);
  if (!session) session = await L7.createSession(playerId);

  const stage = Number(session.stage);
  res.json({
    success: true,
    sessionId: session.id,
    level: L7.LEVEL,
    status: session.status,
    ...stageView(stage, await L7.hasHint(session.id, stage)),
  });
}));

/* ---------------- POST /action   { sessionId, playerId, kind, item, target } ---------------- */

r.post('/action', handle(async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);
  const kind = word(req.body && req.body.kind);       // 'tap' or 'drag'
  const item = word(req.body && req.body.item);
  const target = word(req.body && req.body.target);
  if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

  const session = await L7.getSession(sessionId, playerId);
  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

  const stage = Number(session.stage);
  const s = STAGES[stage];

  // the move has to fit this stage
  const known = s.mode === 'tap'
    ? s.objects.some((o) => o.id === item)
    : s.tray.some((t) => t.id === item);
  if (kind !== s.mode || !known || (s.mode === 'drag' && target !== s.target)) {
    return bad(res, 400, 'invalid_move', 'That move is not allowed here');
  }

  const wrongBefore = Number(session.wrong_attempts);
  const attemptsBefore = Number(session.total_attempts);
  const correct = item === s.answer;

  await L7.recordAction(sessionId, stage, kind, item, target, correct);

  /* ----- wrong ----- */
  if (!correct) {
    return res.json({
      success: true,
      correct: false,
      completed: false,
      stage,
      wrongAttempts: wrongBefore + 1,
      message: s.wrong[item] || WRONG_DEFAULT,
    });
  }

  /* ----- right, more stages left (the next stage has a fresh clue) ----- */
  if (stage < LAST_STAGE) {
    const next = stage + 1;
    await L7.setStage(sessionId, next);
    return res.json({
      success: true,
      correct: true,
      completed: false,
      message: s.right,
      ...stageView(next, false),
    });
  }

  /* ----- right on the last stage: level finished ----- */
  const attempts = attemptsBefore + 1;
  const score = Math.max(100, 300 - wrongBefore * 50);
  const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

  await L7.completeSession(sessionId);

  let progressSaved = false;
  try { await L7.saveProgress(playerId, score, stars, attempts); progressSaved = true; }
  catch (err) { console.error('[BrainTwist L7] could not save progress:', err.message); }

  res.json({
    success: true,
    correct: true,
    completed: true,
    stage,
    scene: FINAL_SCENE,
    message: s.right,
    score, stars, attempts, progressSaved,
  });
}));

/* ---------------- POST /hint   { sessionId, playerId } ---------------- */

r.post('/hint', handle(async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);
  if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

  const session = await L7.getSession(sessionId, playerId);
  if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

  const stage = Number(session.stage);
  const clue = STAGES[stage].clue;

  const already = async () => res.json({
    success: true, stage, hints: await L7.getHints(playerId),
    cost: 0, alreadyUsed: true, clue,
  });

  // clue already bought for this stage -> free
  if (await L7.hasHint(sessionId, stage)) return already();

  // Claim once per stage so a repeated tap does not create duplicate state.
  const claimed = await L7.claimHint(sessionId, playerId, stage, 0);
  if (!claimed) return already();

  const hints = await L7.getHints(playerId);

  res.json({ success: true, free: true, stage, hints, cost: 0, alreadyUsed: false, clue });
}));

/* ---------------- GET /status/:playerId ---------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
  const row = await L7.getProgress(playerId);
  res.json({
    success: true,
    level: L7.LEVEL,
    completed: Boolean(row && row.is_completed),
    score: row ? Number(row.score) || 0 : 0,
    stars: row ? Number(row.stars) || 0 : 0,
    attempts: row ? Number(row.attempts) || 0 : 0,
    completedAt: row ? row.completed_at : null,
  });
}));

module.exports = r;