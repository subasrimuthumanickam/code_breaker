// // Brain Twist - Level 5: Cucumber vs Zucchini
// // Stage 1 + 2: pick the cucumbers (tomatoes are wrong), picked cucumbers hide.
// // Stage 3: zucchini look like cucumbers. Tapping one is wrong -> everything is rearranged.
// // The server owns the layout and the answers. The frontend only draws what it is sent.
// const express = require('express');
// const L5 = require('../data/level5Db');

// const r = express.Router();

// const LAST_STAGE = 3;
// const HINT_COST = 25;

// // 7 spots on the board (x / y = 0..1 of the board, rot in degrees)
// const SLOTS = [
//   { x: 0.20, y: 0.16, rot: -28 },
//   { x: 0.55, y: 0.12, rot: 10 },
//   { x: 0.84, y: 0.24, rot: 32 },
//   { x: 0.16, y: 0.52, rot: 18 },
//   { x: 0.50, y: 0.50, rot: -12 },
//   { x: 0.84, y: 0.62, rot: -34 },
//   { x: 0.36, y: 0.86, rot: 6 },
// ];

// const STAGES = {
//   1: { title: 'Pick the cucumbers!', hint: 'Tap every cucumber', cucumber: 3, tomato: 4, zucchini: 0,
//        right: 'Nice! Now find them again.' },
//   2: { title: 'Pick the cucumbers!', hint: 'Tap every cucumber', cucumber: 4, tomato: 3, zucchini: 0,
//        right: 'Careful... something looks different now.' },
//   3: { title: 'Pick the cucumbers!', hint: 'Are you sure that is a cucumber?', cucumber: 2, tomato: 2, zucchini: 3,
//        right: 'You found the real cucumbers!' },
// };

// const WRONG = {
//   tomato: 'A tomato is not a cucumber!',
//   zucchini: 'Oops! That is a zucchini. Find the real cucumber!',
// };

// /* ---------------- layout helpers ---------------- */

// const shuffle = (arr) => {
//   const a = arr.slice();
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// };

// const buildLayout = (stage) => {
//   const s = STAGES[stage];
//   const kinds = shuffle([
//     ...Array(s.cucumber).fill('cucumber'),
//     ...Array(s.tomato).fill('tomato'),
//     ...Array(s.zucchini).fill('zucchini'),
//   ]);
//   const slots = shuffle(SLOTS.map((_, i) => i));
//   return kinds.map((kind, i) => ({ id: i + 1, kind, slot: slots[i], hidden: false }));
// };

// // new positions for the same items (must differ from the old ones)
// const reshuffle = (layout) => {
//   let slots;
//   for (let t = 0; t < 8; t++) {
//     slots = shuffle(layout.map((i) => i.slot));
//     const moved = slots.filter((s, k) => s !== layout[k].slot).length;
//     if (moved >= Math.ceil(layout.length / 2)) break;
//   }
//   return layout.map((i, k) => ({ ...i, slot: slots[k] }));
// };

// // what the frontend may see
// const itemsView = (layout) =>
//   layout.map((i) => ({
//     id: i.id, kind: i.kind, hidden: !!i.hidden,
//     x: SLOTS[i.slot].x, y: SLOTS[i.slot].y, rot: SLOTS[i.slot].rot,
//   }));

// const remaining = (layout) => layout.filter((i) => i.kind === 'cucumber' && !i.hidden).length;

// const stageView = (stage, layout) => ({
//   stage,
//   totalStages: LAST_STAGE,
//   title: STAGES[stage].title,
//   hint: STAGES[stage].hint,
//   remaining: remaining(layout),
//   items: itemsView(layout),
// });

// /* ---------------- misc ---------------- */

// const handle = (fn) => async (req, res) => {
//   try { await fn(req, res); }
//   catch (err) {
//     console.error('[BrainTwist L5 Error]', req.method, req.originalUrl, err);
//     if (!res.headersSent) res.status(500).json({ success: false, error: 'server_error', message: err.message });
//   }
// };

// const toId = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
// const bad = (res, status, error, message) => res.status(status).json({ success: false, error, message });

// r.use(async (req, res, next) => { await L5.ready; next(); });

// /* ---------------- POST /start   { playerId } ---------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   let session = await L5.findActive(playerId);
//   if (!session) session = await L5.createSession(playerId, buildLayout(1));

//   res.json({
//     success: true,
//     sessionId: session.id,
//     level: L5.LEVEL,
//     status: session.status,
//     ...stageView(Number(session.stage), session.layout),
//   });
// }));

// /* ---------------- POST /pick   { sessionId, playerId, itemId } ---------------- */

// r.post('/pick', handle(async (req, res) => {
//   const sessionId = toId(req.body && req.body.sessionId);
//   const playerId = toId(req.body && req.body.playerId);
//   const itemId = toId(req.body && req.body.itemId);
//   if (!sessionId || !playerId || !itemId) return bad(res, 400, 'ids_required', 'sessionId, playerId and itemId are required');

//   const session = await L5.getSession(sessionId, playerId);
//   if (!session) return bad(res, 404, 'no_session', 'Session not found');
//   if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

//   const stage = Number(session.stage);
//   let layout = session.layout;
//   const item = layout.find((i) => i.id === itemId);
//   if (!item || item.hidden) return bad(res, 400, 'invalid_move', 'That item cannot be picked');

//   /* ----- wrong pick ----- */
//   if (item.kind !== 'cucumber') {
//     const shuffled = item.kind === 'zucchini';          // zucchini -> rearrange everything
//     if (shuffled) layout = reshuffle(layout);
//     await L5.recordPick(sessionId, stage, itemId, item.kind, false, shuffled);
//     if (shuffled) await L5.saveLayout(sessionId, layout, stage);

//     return res.json({
//       success: true,
//       correct: false,
//       completed: false,
//       stageDone: false,
//       itemId,
//       reshuffled: shuffled,
//       wrongAttempts: Number(session.wrong_attempts) + 1,
//       message: WRONG[item.kind],
//       ...stageView(stage, layout),
//     });
//   }

//   /* ----- right pick: the cucumber hides ----- */
//   item.hidden = true;
//   await L5.recordPick(sessionId, stage, itemId, 'cucumber', true, false);

//   if (remaining(layout) > 0) {
//     await L5.saveLayout(sessionId, layout, stage);
//     return res.json({
//       success: true, correct: true, completed: false, stageDone: false, itemId,
//       message: 'Good! Keep going.',
//       ...stageView(stage, layout),
//     });
//   }

//   /* ----- stage finished ----- */
//   if (stage < LAST_STAGE) {
//     const next = stage + 1;
//     const fresh = buildLayout(next);
//     await L5.saveLayout(sessionId, fresh, next);
//     return res.json({
//       success: true, correct: true, completed: false, stageDone: true, itemId,
//       message: STAGES[stage].right,
//       ...stageView(next, fresh),
//     });
//   }

//   /* ----- level finished ----- */
//   const wrong = Number(session.wrong_attempts);
//   const attempts = Number(session.total_attempts) + 1;
//   const score = Math.max(100, 300 - wrong * 50);
//   const stars = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;

//   await L5.saveLayout(sessionId, layout, stage);
//   await L5.completeSession(sessionId);

//   let progressSaved = false;
//   try { await L5.saveProgress(playerId, score, stars, attempts); progressSaved = true; }
//   catch (err) { console.error('[BrainTwist L5] could not save progress:', err.message); }

//   res.json({
//     success: true, correct: true, completed: true, stageDone: true, itemId,
//     message: STAGES[stage].right,
//     score, stars, attempts, progressSaved,
//     ...stageView(stage, layout),
//   });
// }));

// /* ---------------- POST /hint   { sessionId, playerId } ---------------- */

// r.post('/hint', handle(async (req, res) => {
//   const sessionId = toId(req.body && req.body.sessionId);
//   const playerId = toId(req.body && req.body.playerId);
//   if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

//   const session = await L5.getSession(sessionId, playerId);
//   if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

//   const target = session.layout.find((i) => i.kind === 'cucumber' && !i.hidden);
//   if (!target) return bad(res, 409, 'nothing_to_hint', 'Nothing left to find');

//   const hints = await L5.spendHints(playerId, HINT_COST);
//   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

//   res.json({ success: true, itemId: target.id, hints, cost: HINT_COST });
// }));

// /* ---------------- GET /status/:playerId ---------------- */

// r.get('/status/:playerId', handle(async (req, res) => {
//   const playerId = toId(req.params.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
//   const row = await L5.getProgress(playerId);
//   res.json({
//     success: true,
//     level: L5.LEVEL,
//     completed: Boolean(row && row.is_completed),
//     score: row ? Number(row.score) || 0 : 0,
//     stars: row ? Number(row.stars) || 0 : 0,
//     attempts: row ? Number(row.attempts) || 0 : 0,
//     completedAt: row ? row.completed_at : null,
//   });
// }));

// r._test = { buildLayout, reshuffle, itemsView, remaining, STAGES };
// module.exports = r;
// Brain Twist - Level 5: Cucumber vs Zucchini
// Stage 1 + 2: pick the cucumbers (tomatoes are wrong), picked cucumbers hide.
// Stage 2 adds bitter gourds, stage 3 adds zucchini - both look like cucumbers on purpose.
// Stage 3: tapping a look-alike is wrong -> everything is rearranged.
// The server owns the layout and the answers. The frontend only draws what it is sent.
const express = require('express');
const L5 = require('../data/level5Db');

const r = express.Router();

const LAST_STAGE = 3;
const HINT_COST = 25;

// 7 spots on the board (x / y = 0..1 of the board, rot in degrees)
const SLOTS = [
  { x: 0.20, y: 0.16, rot: -28 },
  { x: 0.55, y: 0.12, rot: 10 },
  { x: 0.84, y: 0.24, rot: 32 },
  { x: 0.16, y: 0.52, rot: 18 },
  { x: 0.50, y: 0.50, rot: -12 },
  { x: 0.84, y: 0.62, rot: -34 },
  { x: 0.36, y: 0.86, rot: 6 },
];

const STAGES = {
  1: { title: 'Pick the cucumbers!', hint: 'Tap every cucumber', cucumber: 3, tomato: 4, zucchini: 0, gourd: 0,
       right: 'Nice! Now find them again.' },
  2: { title: 'Pick the cucumbers!', hint: 'Tap every cucumber', cucumber: 3, tomato: 2, zucchini: 0, gourd: 2,
       right: 'Careful... something looks different now.' },
  3: { title: 'Pick the cucumbers!', hint: 'Are you sure that is a cucumber?', cucumber: 2, tomato: 1, zucchini: 3, gourd: 1,
       right: 'You found the real cucumbers!' },
};

const WRONG = {
  tomato: 'A tomato is not a cucumber!',
  zucchini: 'Oops! That is a zucchini. Find the real cucumber!',
  gourd: 'That is a bitter gourd, not a cucumber!',
};

// look-alikes: in the last stage tapping one rearranges the whole board
const LOOKALIKES = ['zucchini', 'gourd'];

/* ---------------- layout helpers ---------------- */

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildLayout = (stage) => {
  const s = STAGES[stage];
  const kinds = shuffle([
    ...Array(s.cucumber).fill('cucumber'),
    ...Array(s.tomato).fill('tomato'),
    ...Array(s.zucchini).fill('zucchini'),
    ...Array(s.gourd).fill('gourd'),
  ]);
  const slots = shuffle(SLOTS.map((_, i) => i));
  return kinds.map((kind, i) => ({ id: i + 1, kind, slot: slots[i], hidden: false }));
};

// new positions for the same items (must differ from the old ones)
const reshuffle = (layout) => {
  let slots;
  for (let t = 0; t < 8; t++) {
    slots = shuffle(layout.map((i) => i.slot));
    const moved = slots.filter((s, k) => s !== layout[k].slot).length;
    if (moved >= Math.ceil(layout.length / 2)) break;
  }
  return layout.map((i, k) => ({ ...i, slot: slots[k] }));
};

// what the frontend may see
const itemsView = (layout) =>
  layout.map((i) => ({
    id: i.id, kind: i.kind, hidden: !!i.hidden,
    x: SLOTS[i.slot].x, y: SLOTS[i.slot].y, rot: SLOTS[i.slot].rot,
  }));

const remaining = (layout) => layout.filter((i) => i.kind === 'cucumber' && !i.hidden).length;

const stageView = (stage, layout) => ({
  stage,
  totalStages: LAST_STAGE,
  title: STAGES[stage].title,
  hint: STAGES[stage].hint,
  remaining: remaining(layout),
  items: itemsView(layout),
});

/* ---------------- misc ---------------- */

const handle = (fn) => async (req, res) => {
  try { await fn(req, res); }
  catch (err) {
    console.error('[BrainTwist L5 Error]', req.method, req.originalUrl, err);
    if (!res.headersSent) res.status(500).json({ success: false, error: 'server_error', message: err.message });
  }
};

const toId = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
const bad = (res, status, error, message) => res.status(status).json({ success: false, error, message });

r.use(async (req, res, next) => { await L5.ready; next(); });

/* ---------------- POST /start   { playerId } ---------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  let session = await L5.findActive(playerId);
  if (!session) session = await L5.createSession(playerId, buildLayout(1));

  res.json({
    success: true,
    sessionId: session.id,
    level: L5.LEVEL,
    status: session.status,
    ...stageView(Number(session.stage), session.layout),
  });
}));

/* ---------------- POST /pick   { sessionId, playerId, itemId } ---------------- */

r.post('/pick', handle(async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);
  const itemId = toId(req.body && req.body.itemId);
  if (!sessionId || !playerId || !itemId) return bad(res, 400, 'ids_required', 'sessionId, playerId and itemId are required');

  const session = await L5.getSession(sessionId, playerId);
  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

  const stage = Number(session.stage);
  let layout = session.layout;
  const item = layout.find((i) => i.id === itemId);
  if (!item || item.hidden) return bad(res, 400, 'invalid_move', 'That item cannot be picked');

  /* ----- wrong pick ----- */
  if (item.kind !== 'cucumber') {
    const shuffled = stage === LAST_STAGE && LOOKALIKES.includes(item.kind);   // look-alike in the last stage -> rearrange everything
    if (shuffled) layout = reshuffle(layout);
    await L5.recordPick(sessionId, stage, itemId, item.kind, false, shuffled);
    if (shuffled) await L5.saveLayout(sessionId, layout, stage);

    return res.json({
      success: true,
      correct: false,
      completed: false,
      stageDone: false,
      itemId,
      reshuffled: shuffled,
      wrongAttempts: Number(session.wrong_attempts) + 1,
      message: WRONG[item.kind],
      ...stageView(stage, layout),
    });
  }

  /* ----- right pick: the cucumber hides ----- */
  item.hidden = true;
  await L5.recordPick(sessionId, stage, itemId, 'cucumber', true, false);

  if (remaining(layout) > 0) {
    await L5.saveLayout(sessionId, layout, stage);
    return res.json({
      success: true, correct: true, completed: false, stageDone: false, itemId,
      message: 'Good! Keep going.',
      ...stageView(stage, layout),
    });
  }

  /* ----- stage finished ----- */
  if (stage < LAST_STAGE) {
    const next = stage + 1;
    const fresh = buildLayout(next);
    await L5.saveLayout(sessionId, fresh, next);
    return res.json({
      success: true, correct: true, completed: false, stageDone: true, itemId,
      message: STAGES[stage].right,
      ...stageView(next, fresh),
    });
  }

  /* ----- level finished ----- */
  const wrong = Number(session.wrong_attempts);
  const attempts = Number(session.total_attempts) + 1;
  const score = Math.max(100, 300 - wrong * 50);
  const stars = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;

  await L5.saveLayout(sessionId, layout, stage);
  await L5.completeSession(sessionId);

  let progressSaved = false;
  try { await L5.saveProgress(playerId, score, stars, attempts); progressSaved = true; }
  catch (err) { console.error('[BrainTwist L5] could not save progress:', err.message); }

  res.json({
    success: true, correct: true, completed: true, stageDone: true, itemId,
    message: STAGES[stage].right,
    score, stars, attempts, progressSaved,
    ...stageView(stage, layout),
  });
}));

/* ---------------- POST /hint   { sessionId, playerId } ---------------- */

r.post('/hint', handle(async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);
  if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

  const session = await L5.getSession(sessionId, playerId);
  if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

  const target = session.layout.find((i) => i.kind === 'cucumber' && !i.hidden);
  if (!target) return bad(res, 409, 'nothing_to_hint', 'Nothing left to find');

  const hints = await L5.spendHints(playerId, HINT_COST);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  res.json({ success: true, itemId: target.id, hints, cost: HINT_COST });
}));

/* ---------------- GET /status/:playerId ---------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
  const row = await L5.getProgress(playerId);
  res.json({
    success: true,
    level: L5.LEVEL,
    completed: Boolean(row && row.is_completed),
    score: row ? Number(row.score) || 0 : 0,
    stars: row ? Number(row.stars) || 0 : 0,
    attempts: row ? Number(row.attempts) || 0 : 0,
    completedAt: row ? row.completed_at : null,
  });
}));

r._test = { buildLayout, reshuffle, itemsView, remaining, STAGES };
module.exports = r;