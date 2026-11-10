
// // // const express = require('express');
// // // const L5 = require('../data/level5Db');

// // // const r = express.Router();

// // // const LAST_STAGE = 3;
// // // const HINT_COST = 25;

// // // // 7 spots on the board (x / y = 0..1 of the board, rot in degrees)
// // // const SLOTS = [
// // //   { x: 0.20, y: 0.16, rot: -28 },
// // //   { x: 0.55, y: 0.12, rot: 10 },
// // //   { x: 0.84, y: 0.24, rot: 32 },
// // //   { x: 0.16, y: 0.52, rot: 18 },
// // //   { x: 0.50, y: 0.50, rot: -12 },
// // //   { x: 0.84, y: 0.62, rot: -34 },
// // //   { x: 0.36, y: 0.86, rot: 6 },
// // // ];

// // // const STAGES = {
// // //   1: { title: 'Pick the cucumbers!', hint: 'Tap every cucumber', cucumber: 3, tomato: 4, zucchini: 0, gourd: 0,
// // //        right: 'Nice! Now find them again.' },
// // //   2: { title: 'Pick the cucumbers!', hint: 'Tap every cucumber', cucumber: 3, tomato: 2, zucchini: 0, gourd: 2,
// // //        right: 'Careful... something looks different now.' },
// // //   3: { title: 'Pick the cucumbers!', hint: 'Are you sure that is a cucumber?', cucumber: 2, tomato: 1, zucchini: 3, gourd: 1,
// // //        right: 'You found the real cucumbers!' },
// // // };

// // // const WRONG = {
// // //   tomato: 'A tomato is not a cucumber!',
// // //   zucchini: 'Oops! That is a zucchini. Find the real cucumber!',
// // //   gourd: 'That is a bitter gourd, not a cucumber!',
// // // };

// // // /* ---------------- layout helpers ---------------- */

// // // const shuffle = (arr) => {
// // //   const a = arr.slice();
// // //   for (let i = a.length - 1; i > 0; i--) {
// // //     const j = Math.floor(Math.random() * (i + 1));
// // //     [a[i], a[j]] = [a[j], a[i]];
// // //   }
// // //   return a;
// // // };

// // // const buildLayout = (stage) => {
// // //   const s = STAGES[stage];
// // //   const kinds = shuffle([
// // //     ...Array(s.cucumber).fill('cucumber'),
// // //     ...Array(s.tomato).fill('tomato'),
// // //     ...Array(s.zucchini).fill('zucchini'),
// // //     ...Array(s.gourd).fill('gourd'),
// // //   ]);
// // //   const slots = shuffle(SLOTS.map((_, i) => i));
// // //   return kinds.map((kind, i) => ({ id: i + 1, kind, slot: slots[i], hidden: false }));
// // // };

// // // // new positions for the same items (must differ from the old ones)
// // // const reshuffle = (layout) => {
// // //   let slots;
// // //   for (let t = 0; t < 8; t++) {
// // //     slots = shuffle(layout.map((i) => i.slot));
// // //     const moved = slots.filter((s, k) => s !== layout[k].slot).length;
// // //     if (moved >= Math.ceil(layout.length / 2)) break;
// // //   }
// // //   return layout.map((i, k) => ({ ...i, slot: slots[k] }));
// // // };

// // // // what the frontend may see
// // // const itemsView = (layout) =>
// // //   layout.map((i) => ({
// // //     id: i.id, kind: i.kind, hidden: !!i.hidden,
// // //     x: SLOTS[i.slot].x, y: SLOTS[i.slot].y, rot: SLOTS[i.slot].rot,
// // //   }));

// // // const remaining = (layout) => layout.filter((i) => i.kind === 'cucumber' && !i.hidden).length;

// // // const stageView = (stage, layout) => ({
// // //   stage,
// // //   totalStages: LAST_STAGE,
// // //   title: STAGES[stage].title,
// // //   hint: STAGES[stage].hint,
// // //   remaining: remaining(layout),
// // //   items: itemsView(layout),
// // // });

// // // /* ---------------- misc ---------------- */

// // // const handle = (fn) => async (req, res) => {
// // //   try { await fn(req, res); }
// // //   catch (err) {
// // //     console.error('[BrainTwist L5 Error]', req.method, req.originalUrl, err);
// // //     if (!res.headersSent) res.status(500).json({ success: false, error: 'server_error', message: err.message });
// // //   }
// // // };

// // // const toId = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
// // // const bad = (res, status, error, message) => res.status(status).json({ success: false, error, message });

// // // r.use(async (req, res, next) => { await L5.ready; next(); });

// // // /* ---------------- POST /start   { playerId } ---------------- */

// // // r.post('/start', handle(async (req, res) => {
// // //   const playerId = toId(req.body && req.body.playerId);
// // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// // //   let session = await L5.findActive(playerId);
// // //   if (!session) session = await L5.createSession(playerId, buildLayout(1));

// // //   res.json({
// // //     success: true,
// // //     sessionId: session.id,
// // //     level: L5.LEVEL,
// // //     status: session.status,
// // //     ...stageView(Number(session.stage), session.layout),
// // //   });
// // // }));

// // // /* ---------------- POST /pick   { sessionId, playerId, itemId } ---------------- */

// // // r.post('/pick', handle(async (req, res) => {
// // //   const sessionId = toId(req.body && req.body.sessionId);
// // //   const playerId = toId(req.body && req.body.playerId);
// // //   const itemId = toId(req.body && req.body.itemId);
// // //   if (!sessionId || !playerId || !itemId) return bad(res, 400, 'ids_required', 'sessionId, playerId and itemId are required');

// // //   const session = await L5.getSession(sessionId, playerId);
// // //   if (!session) return bad(res, 404, 'no_session', 'Session not found');
// // //   if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

// // //   const stage = Number(session.stage);
// // //   let layout = session.layout;
// // //   const item = layout.find((i) => i.id === itemId);
// // //   if (!item || item.hidden) return bad(res, 400, 'invalid_move', 'That item cannot be picked');

// // //   /* ----- wrong pick: the whole board is rearranged in every stage ----- */
// // //   if (item.kind !== 'cucumber') {
// // //     const shuffled = true;
// // //     layout = reshuffle(layout);
// // //     await L5.recordPick(sessionId, stage, itemId, item.kind, false, shuffled);
// // //     await L5.saveLayout(sessionId, layout, stage);

// // //     return res.json({
// // //       success: true,
// // //       correct: false,
// // //       completed: false,
// // //       stageDone: false,
// // //       itemId,
// // //       reshuffled: shuffled,
// // //       wrongAttempts: Number(session.wrong_attempts) + 1,
// // //       message: WRONG[item.kind],
// // //       ...stageView(stage, layout),
// // //     });
// // //   }

// // //   /* ----- right pick: the cucumber hides ----- */
// // //   item.hidden = true;
// // //   await L5.recordPick(sessionId, stage, itemId, 'cucumber', true, false);

// // //   if (remaining(layout) > 0) {
// // //     await L5.saveLayout(sessionId, layout, stage);
// // //     return res.json({
// // //       success: true, correct: true, completed: false, stageDone: false, itemId,
// // //       message: 'Good! Keep going.',
// // //       ...stageView(stage, layout),
// // //     });
// // //   }

// // //   /* ----- stage finished ----- */
// // //   if (stage < LAST_STAGE) {
// // //     const next = stage + 1;
// // //     const fresh = buildLayout(next);
// // //     await L5.saveLayout(sessionId, fresh, next);
// // //     return res.json({
// // //       success: true, correct: true, completed: false, stageDone: true, itemId,
// // //       message: STAGES[stage].right,
// // //       ...stageView(next, fresh),
// // //     });
// // //   }

// // //   /* ----- level finished ----- */
// // //   const wrong = Number(session.wrong_attempts);
// // //   const attempts = Number(session.total_attempts) + 1;
// // //   const score = Math.max(100, 300 - wrong * 50);
// // //   const stars = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;

// // //   await L5.saveLayout(sessionId, layout, stage);
// // //   await L5.completeSession(sessionId);

// // //   let progressSaved = false;
// // //   try { await L5.saveProgress(playerId, score, stars, attempts); progressSaved = true; }
// // //   catch (err) { console.error('[BrainTwist L5] could not save progress:', err.message); }

// // //   res.json({
// // //     success: true, correct: true, completed: true, stageDone: true, itemId,
// // //     message: STAGES[stage].right,
// // //     score, stars, attempts, progressSaved,
// // //     ...stageView(stage, layout),
// // //   });
// // // }));

// // // /* ---------------- POST /hint   { sessionId, playerId } ---------------- */

// // // r.post('/hint', handle(async (req, res) => {
// // //   const sessionId = toId(req.body && req.body.sessionId);
// // //   const playerId = toId(req.body && req.body.playerId);
// // //   if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

// // //   const session = await L5.getSession(sessionId, playerId);
// // //   if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

// // //   const target = session.layout.find((i) => i.kind === 'cucumber' && !i.hidden);
// // //   if (!target) return bad(res, 409, 'nothing_to_hint', 'Nothing left to find');

// // //   const hints = await L5.spendHints(playerId, HINT_COST);
// // //   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

// // //   res.json({ success: true, itemId: target.id, hints, cost: HINT_COST });
// // // }));

// // // /* ---------------- GET /status/:playerId ---------------- */

// // // r.get('/status/:playerId', handle(async (req, res) => {
// // //   const playerId = toId(req.params.playerId);
// // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
// // //   const row = await L5.getProgress(playerId);
// // //   res.json({
// // //     success: true,
// // //     level: L5.LEVEL,
// // //     completed: Boolean(row && row.is_completed),
// // //     score: row ? Number(row.score) || 0 : 0,
// // //     stars: row ? Number(row.stars) || 0 : 0,
// // //     attempts: row ? Number(row.attempts) || 0 : 0,
// // //     completedAt: row ? row.completed_at : null,
// // //   });
// // // }));

// // // r._test = { buildLayout, reshuffle, itemsView, remaining, STAGES };
// // // module.exports = r;
// // const express = require('express');
// // const L5 = require('../data/level5Db');

// // const r = express.Router();

// // const LAST_STAGE = 3;
// // const HINT_COST = 25;

// // // 7 spots on the board (x / y = 0..1 of the board, rot in degrees)
// // const SLOTS = [
// //   { x: 0.20, y: 0.16, rot: -28 },
// //   { x: 0.55, y: 0.12, rot: 10 },
// //   { x: 0.84, y: 0.24, rot: 32 },
// //   { x: 0.16, y: 0.52, rot: 18 },
// //   { x: 0.50, y: 0.50, rot: -12 },
// //   { x: 0.84, y: 0.62, rot: -34 },
// //   { x: 0.36, y: 0.86, rot: 6 },
// // ];

// // // "cucumber" kind = apple (drawn as apple in the app). Total must be 7.
// // const STAGES = {
// //   1: { title: 'Pick the apples!', hint: 'Tap every apple', cucumber: 5, tomato: 2, zucchini: 0, gourd: 0,
// //        right: 'Nice! Now find them again.' },
// //   2: { title: 'Pick the apples!', hint: 'Tap every apple', cucumber: 6, tomato: 1, zucchini: 0, gourd: 0,
// //        right: 'Careful... something looks different now.' },
// //   3: { title: 'Pick the apples!', hint: 'Tap every apple', cucumber: 6, tomato: 1, zucchini: 0, gourd: 0,
// //        right: 'You found all the apples!' },
// // };

// // const WRONG = {
// //   tomato: 'That is not an apple!',
// //   zucchini: 'That is not an apple!',
// //   gourd: 'That is not an apple!',
// // };

// // /* ---------------- layout helpers ---------------- */

// // const shuffle = (arr) => {
// //   const a = arr.slice();
// //   for (let i = a.length - 1; i > 0; i--) {
// //     const j = Math.floor(Math.random() * (i + 1));
// //     [a[i], a[j]] = [a[j], a[i]];
// //   }
// //   return a;
// // };

// // const buildLayout = (stage) => {
// //   const s = STAGES[stage];
// //   const kinds = shuffle([
// //     ...Array(s.cucumber).fill('cucumber'),
// //     ...Array(s.tomato).fill('tomato'),
// //     ...Array(s.zucchini).fill('zucchini'),
// //     ...Array(s.gourd).fill('gourd'),
// //   ]);
// //   const slots = shuffle(SLOTS.map((_, i) => i));
// //   return kinds.map((kind, i) => ({ id: i + 1, kind, slot: slots[i], hidden: false }));
// // };

// // // new positions for the same items (must differ from the old ones)
// // const reshuffle = (layout) => {
// //   let slots;
// //   for (let t = 0; t < 8; t++) {
// //     slots = shuffle(layout.map((i) => i.slot));
// //     const moved = slots.filter((s, k) => s !== layout[k].slot).length;
// //     if (moved >= Math.ceil(layout.length / 2)) break;
// //   }
// //   return layout.map((i, k) => ({ ...i, slot: slots[k] }));
// // };

// // // what the frontend may see
// // const itemsView = (layout) =>
// //   layout.map((i) => ({
// //     id: i.id, kind: i.kind, hidden: !!i.hidden,
// //     x: SLOTS[i.slot].x, y: SLOTS[i.slot].y, rot: SLOTS[i.slot].rot,
// //   }));

// // const remaining = (layout) => layout.filter((i) => i.kind === 'cucumber' && !i.hidden).length;

// // const stageView = (stage, layout) => ({
// //   stage,
// //   totalStages: LAST_STAGE,
// //   title: STAGES[stage].title,
// //   hint: STAGES[stage].hint,
// //   remaining: remaining(layout),
// //   items: itemsView(layout),
// // });

// // /* ---------------- misc ---------------- */

// // const handle = (fn) => async (req, res) => {
// //   try { await fn(req, res); }
// //   catch (err) {
// //     console.error('[BrainTwist L5 Error]', req.method, req.originalUrl, err);
// //     if (!res.headersSent) res.status(500).json({ success: false, error: 'server_error', message: err.message });
// //   }
// // };

// // const toId = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
// // const bad = (res, status, error, message) => res.status(status).json({ success: false, error, message });

// // r.use(async (req, res, next) => { await L5.ready; next(); });

// // /* ---------------- POST /start   { playerId } ---------------- */

// // r.post('/start', handle(async (req, res) => {
// //   const playerId = toId(req.body && req.body.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   let session = await L5.findActive(playerId);
// //   if (!session) session = await L5.createSession(playerId, buildLayout(1));

// //   res.json({
// //     success: true,
// //     sessionId: session.id,
// //     level: L5.LEVEL,
// //     status: session.status,
// //     ...stageView(Number(session.stage), session.layout),
// //   });
// // }));

// // /* ---------------- POST /pick   { sessionId, playerId, itemId } ---------------- */

// // r.post('/pick', handle(async (req, res) => {
// //   const sessionId = toId(req.body && req.body.sessionId);
// //   const playerId = toId(req.body && req.body.playerId);
// //   const itemId = toId(req.body && req.body.itemId);
// //   if (!sessionId || !playerId || !itemId) return bad(res, 400, 'ids_required', 'sessionId, playerId and itemId are required');

// //   const session = await L5.getSession(sessionId, playerId);
// //   if (!session) return bad(res, 404, 'no_session', 'Session not found');
// //   if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

// //   const stage = Number(session.stage);
// //   let layout = session.layout;
// //   const item = layout.find((i) => i.id === itemId);
// //   if (!item || item.hidden) return bad(res, 400, 'invalid_move', 'That item cannot be picked');

// //   /* ----- wrong pick: the whole board is rearranged in every stage ----- */
// //   if (item.kind !== 'cucumber') {
// //     const shuffled = true;
// //     layout = reshuffle(layout);
// //     await L5.recordPick(sessionId, stage, itemId, item.kind, false, shuffled);
// //     await L5.saveLayout(sessionId, layout, stage);

// //     return res.json({
// //       success: true,
// //       correct: false,
// //       completed: false,
// //       stageDone: false,
// //       itemId,
// //       reshuffled: shuffled,
// //       wrongAttempts: Number(session.wrong_attempts) + 1,
// //       message: WRONG[item.kind],
// //       ...stageView(stage, layout),
// //     });
// //   }

// //   /* ----- right pick: the apple hides ----- */
// //   item.hidden = true;
// //   await L5.recordPick(sessionId, stage, itemId, 'cucumber', true, false);

// //   if (remaining(layout) > 0) {
// //     await L5.saveLayout(sessionId, layout, stage);
// //     return res.json({
// //       success: true, correct: true, completed: false, stageDone: false, itemId,
// //       message: 'Good! Keep going.',
// //       ...stageView(stage, layout),
// //     });
// //   }

// //   /* ----- stage finished ----- */
// //   if (stage < LAST_STAGE) {
// //     const next = stage + 1;
// //     const fresh = buildLayout(next);
// //     await L5.saveLayout(sessionId, fresh, next);
// //     return res.json({
// //       success: true, correct: true, completed: false, stageDone: true, itemId,
// //       message: STAGES[stage].right,
// //       ...stageView(next, fresh),
// //     });
// //   }

// //   /* ----- level finished ----- */
// //   const wrong = Number(session.wrong_attempts);
// //   const attempts = Number(session.total_attempts) + 1;
// //   const score = Math.max(100, 300 - wrong * 50);
// //   const stars = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;

// //   await L5.saveLayout(sessionId, layout, stage);
// //   await L5.completeSession(sessionId);

// //   let progressSaved = false;
// //   try { await L5.saveProgress(playerId, score, stars, attempts); progressSaved = true; }
// //   catch (err) { console.error('[BrainTwist L5] could not save progress:', err.message); }

// //   res.json({
// //     success: true, correct: true, completed: true, stageDone: true, itemId,
// //     message: STAGES[stage].right,
// //     score, stars, attempts, progressSaved,
// //     ...stageView(stage, layout),
// //   });
// // }));

// // /* ---------------- POST /hint   { sessionId, playerId } ---------------- */

// // r.post('/hint', handle(async (req, res) => {
// //   const sessionId = toId(req.body && req.body.sessionId);
// //   const playerId = toId(req.body && req.body.playerId);
// //   if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

// //   const session = await L5.getSession(sessionId, playerId);
// //   if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

// //   const target = session.layout.find((i) => i.kind === 'cucumber' && !i.hidden);
// //   if (!target) return bad(res, 409, 'nothing_to_hint', 'Nothing left to find');

// //   const hints = await L5.spendHints(playerId, HINT_COST);
// //   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

// //   res.json({ success: true, itemId: target.id, hints, cost: HINT_COST });
// // }));

// // /* ---------------- GET /status/:playerId ---------------- */

// // r.get('/status/:playerId', handle(async (req, res) => {
// //   const playerId = toId(req.params.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
// //   const row = await L5.getProgress(playerId);
// //   res.json({
// //     success: true,
// //     level: L5.LEVEL,
// //     completed: Boolean(row && row.is_completed),
// //     score: row ? Number(row.score) || 0 : 0,
// //     stars: row ? Number(row.stars) || 0 : 0,
// //     attempts: row ? Number(row.attempts) || 0 : 0,
// //     completedAt: row ? row.completed_at : null,
// //   });
// // }));

// // r._test = { buildLayout, reshuffle, itemsView, remaining, STAGES };
// // module.exports = r;
// const express = require('express');
// const L5 = require('../data/level5Db');

// const r = express.Router();

// const LAST_STAGE = 3;
// const HINT_COST = 25;

// // 20 spots (5 columns x 4 rows) so nothing overlaps. x / y = 0..1 of the board.
// const COLS = [0.10, 0.30, 0.50, 0.70, 0.90];
// const ROWS = [0.12, 0.38, 0.64, 0.90];
// const ROT = [-14, 9, -6, 13, -10, 7, -12, 5, 14, -8, 10, -5, 12, -13, 6, -9, 11, -7, 8, -11];
// const SLOTS = [];
// ROWS.forEach((y, ri) => COLS.forEach((x, ci) => {
//   SLOTS.push({ x, y, rot: ROT[ri * COLS.length + ci] });
// }));

// // target = what the player must tap. Total items per screen = 20.
// // rearrange = a wrong tap moves everything around (only screen 2).
// const STAGES = {
//   1: { title: 'Pick the apples!', hint: 'Tap every apple', target: 'apple', apple: 20, tomato: 0,
//        rearrange: false, right: 'Nice! Now look carefully...' },
//   2: { title: 'Find the 4 tomatoes!', hint: 'Tomatoes look like apples. Tap only the 4 tomatoes', target: 'tomato', apple: 16, tomato: 4,
//        rearrange: true, right: 'Sharp eyes! One more screen.' },
//   3: { title: 'Pick the apples!', hint: 'Tap every apple, not the tomato', target: 'apple', apple: 19, tomato: 1,
//        rearrange: false, right: 'You found all the apples!' },
// };

// const WRONG = {
//   apple: 'That is an apple, not a tomato!',
//   tomato: 'That is a tomato, not an apple!',
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
//     ...Array(s.apple).fill('apple'),
//     ...Array(s.tomato).fill('tomato'),
//   ]);
//   const slots = shuffle(SLOTS.map((_, i) => i));
//   return kinds.map((kind, i) => ({ id: i + 1, kind, slot: slots[i], hidden: false }));
// };

// // new positions for the same items (most of them must move)
// const reshuffle = (layout) => {
//   let slots;
//   for (let t = 0; t < 10; t++) {
//     slots = shuffle(layout.map((i) => i.slot));
//     const moved = slots.filter((s, k) => s !== layout[k].slot).length;
//     if (moved >= Math.ceil(layout.length * 0.7)) break;
//   }
//   return layout.map((i, k) => ({ ...i, slot: slots[k] }));
// };

// const itemsView = (layout) =>
//   layout.map((i) => ({
//     id: i.id, kind: i.kind, hidden: !!i.hidden,
//     x: SLOTS[i.slot].x, y: SLOTS[i.slot].y, rot: SLOTS[i.slot].rot,
//   }));

// const remaining = (layout, stage) =>
//   layout.filter((i) => i.kind === STAGES[stage].target && !i.hidden).length;

// const stageView = (stage, layout) => ({
//   stage,
//   totalStages: LAST_STAGE,
//   title: STAGES[stage].title,
//   hint: STAGES[stage].hint,
//   target: STAGES[stage].target,
//   remaining: remaining(layout, stage),
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

// /* ---------------- POST /start ---------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   let session = await L5.findActive(playerId);
//   // old sessions (other kinds / old layout) are closed and a fresh one is made
//   if (session && !(
//     session.layout.length === SLOTS.length &&
//     session.layout.every((i) => (i.kind === 'apple' || i.kind === 'tomato') && i.slot < SLOTS.length)
//   )) {
//     await L5.completeSession(session.id);
//     session = null;
//   }
//   if (!session) session = await L5.createSession(playerId, buildLayout(1));

//   res.json({
//     success: true,
//     sessionId: session.id,
//     level: L5.LEVEL,
//     status: session.status,
//     ...stageView(Number(session.stage), session.layout),
//   });
// }));

// /* ---------------- POST /pick ---------------- */

// r.post('/pick', handle(async (req, res) => {
//   const sessionId = toId(req.body && req.body.sessionId);
//   const playerId = toId(req.body && req.body.playerId);
//   const itemId = toId(req.body && req.body.itemId);
//   if (!sessionId || !playerId || !itemId) return bad(res, 400, 'ids_required', 'sessionId, playerId and itemId are required');

//   const session = await L5.getSession(sessionId, playerId);
//   if (!session) return bad(res, 404, 'no_session', 'Session not found');
//   if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

//   const stage = Number(session.stage);
//   const cfg = STAGES[stage];
//   let layout = session.layout;
//   const item = layout.find((i) => i.id === itemId);
//   if (!item || item.hidden) return bad(res, 400, 'invalid_move', 'That item cannot be picked');

//   /* ----- wrong pick ----- */
//   if (item.kind !== cfg.target) {
//     if (cfg.rearrange) layout = reshuffle(layout);   // only screen 2 rearranges
//     await L5.recordPick(sessionId, stage, itemId, item.kind, false, cfg.rearrange);
//     await L5.saveLayout(sessionId, layout, stage);

//     return res.json({
//       success: true,
//       correct: false,
//       completed: false,
//       stageDone: false,
//       itemId,
//       reshuffled: cfg.rearrange,
//       wrongAttempts: Number(session.wrong_attempts) + 1,
//       message: WRONG[item.kind],
//       ...stageView(stage, layout),
//     });
//   }

//   /* ----- right pick: it hides ----- */
//   item.hidden = true;
//   await L5.recordPick(sessionId, stage, itemId, item.kind, true, false);

//   if (remaining(layout, stage) > 0) {
//     await L5.saveLayout(sessionId, layout, stage);
//     return res.json({
//       success: true, correct: true, completed: false, stageDone: false, itemId,
//       message: 'Good! Keep going.',
//       ...stageView(stage, layout),
//     });
//   }

//   /* ----- screen finished -> next screen ----- */
//   if (stage < LAST_STAGE) {
//     const next = stage + 1;
//     const fresh = buildLayout(next);
//     await L5.saveLayout(sessionId, fresh, next);
//     return res.json({
//       success: true, correct: true, completed: false, stageDone: true, itemId,
//       message: cfg.right,
//       ...stageView(next, fresh),
//     });
//   }

//   /* ----- level finished (only after screen 3) ----- */
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
//     message: cfg.right,
//     score, stars, attempts, progressSaved,
//     ...stageView(stage, layout),
//   });
// }));

// /* ---------------- POST /hint ---------------- */

// r.post('/hint', handle(async (req, res) => {
//   const sessionId = toId(req.body && req.body.sessionId);
//   const playerId = toId(req.body && req.body.playerId);
//   if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

//   const session = await L5.getSession(sessionId, playerId);
//   if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

//   const stage = Number(session.stage);
//   const target = session.layout.find((i) => i.kind === STAGES[stage].target && !i.hidden);
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
const express = require('express');
const L5 = require('../data/level5Db');

const r = express.Router();

const LAST_STAGE = 3;
const HINT_COST = 25;
const TOTAL = 20;   // items on every screen

// target = what the player must tap. Total items per screen = 20.
// rearrange = a wrong tap moves everything around (only screen 2).
const STAGES = {
  1: { title: 'Pick the apples!', hint: 'Tap every apple', target: 'apple', apple: 20, tomato: 0,
       rearrange: false, right: 'Nice! Now look carefully...' },
  2: { title: 'Find the 4 tomatoes!', hint: 'Tomatoes look like apples. Tap only the 4 tomatoes', target: 'tomato', apple: 16, tomato: 4,
       rearrange: true, right: 'Sharp eyes! One more screen.' },
  3: { title: 'Pick the apples!', hint: 'Tap every apple, not the tomato', target: 'apple', apple: 19, tomato: 1,
       rearrange: false, right: 'You found all the apples!' },
};

const WRONG = {
  apple: 'That is an apple, not a tomato!',
  tomato: 'That is a tomato, not an apple!',
};

/* ---------------- random scattered positions ---------------- */

// minimum gap between two items (as a fraction of the board width / height)
const MINX = 0.125;
const MINY = 0.175;

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// n random points over the whole board, no two too close (so nothing overlaps)
const genPoints = (n) => {
  let k = 1;
  for (let round = 0; round < 60; round++) {
    for (let t = 0; t < 40; t++) {
      const pts = [];
      let tries = 0;
      while (pts.length < n && tries < 4000) {
        tries++;
        const x = 0.08 + Math.random() * 0.84;
        const y = 0.09 + Math.random() * 0.82;
        const ok = pts.every((p) =>
          Math.pow((p.x - x) / (MINX * k), 2) + Math.pow((p.y - y) / (MINY * k), 2) >= 1);
        if (ok) pts.push({ x, y });
      }
      if (pts.length === n) return pts;
    }
    k *= 0.97;   // board too crowded -> allow slightly smaller gaps and try again
  }
  // safety fallback: loose jittered grid
  const out = [];
  const cols = 5, rows = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) {
    out.push({
      x: 0.1 + ((i % cols) + Math.random() * 0.4) * (0.8 / cols),
      y: 0.1 + (Math.floor(i / cols) + Math.random() * 0.4) * (0.8 / rows),
    });
  }
  return out;
};

const randRot = () => Math.round(Math.random() * 60 - 30);

/* ---------------- layout helpers ---------------- */

const buildLayout = (stage) => {
  const s = STAGES[stage];
  const kinds = shuffle([
    ...Array(s.apple).fill('apple'),
    ...Array(s.tomato).fill('tomato'),
  ]);
  const pts = genPoints(kinds.length);
  return kinds.map((kind, i) => ({
    id: i + 1, kind, hidden: false,
    x: pts[i].x, y: pts[i].y, rot: randRot(),
  }));
};

// every item gets a brand new random place
const reshuffle = (layout) => {
  const pts = genPoints(layout.length);
  return layout.map((i, k) => ({ ...i, x: pts[k].x, y: pts[k].y, rot: randRot() }));
};

const itemsView = (layout) =>
  layout.map((i) => ({
    id: i.id, kind: i.kind, hidden: !!i.hidden,
    x: i.x, y: i.y, rot: i.rot,
  }));

const remaining = (layout, stage) =>
  layout.filter((i) => i.kind === STAGES[stage].target && !i.hidden).length;

const stageView = (stage, layout) => ({
  stage,
  totalStages: LAST_STAGE,
  title: STAGES[stage].title,
  hint: STAGES[stage].hint,
  target: STAGES[stage].target,
  remaining: remaining(layout, stage),
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

/* ---------------- POST /start ---------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  let session = await L5.findActive(playerId);
  // old sessions (grid / slot layout) are closed and a fresh scattered one is made
  if (session && !(
    session.layout.length === TOTAL &&
    session.layout.every((i) =>
      (i.kind === 'apple' || i.kind === 'tomato') &&
      typeof i.x === 'number' && typeof i.y === 'number')
  )) {
    await L5.completeSession(session.id);
    session = null;
  }
  if (!session) session = await L5.createSession(playerId, buildLayout(1));

  res.json({
    success: true,
    sessionId: session.id,
    level: L5.LEVEL,
    status: session.status,
    ...stageView(Number(session.stage), session.layout),
  });
}));

/* ---------------- POST /pick ---------------- */

r.post('/pick', handle(async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);
  const itemId = toId(req.body && req.body.itemId);
  if (!sessionId || !playerId || !itemId) return bad(res, 400, 'ids_required', 'sessionId, playerId and itemId are required');

  const session = await L5.getSession(sessionId, playerId);
  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

  const stage = Number(session.stage);
  const cfg = STAGES[stage];
  let layout = session.layout;
  const item = layout.find((i) => i.id === itemId);
  if (!item || item.hidden) return bad(res, 400, 'invalid_move', 'That item cannot be picked');

  /* ----- wrong pick ----- */
  if (item.kind !== cfg.target) {
    if (cfg.rearrange) layout = reshuffle(layout);   // only screen 2 rearranges
    await L5.recordPick(sessionId, stage, itemId, item.kind, false, cfg.rearrange);
    await L5.saveLayout(sessionId, layout, stage);

    return res.json({
      success: true,
      correct: false,
      completed: false,
      stageDone: false,
      itemId,
      reshuffled: cfg.rearrange,
      wrongAttempts: Number(session.wrong_attempts) + 1,
      message: WRONG[item.kind],
      ...stageView(stage, layout),
    });
  }

  /* ----- right pick: it hides ----- */
  item.hidden = true;
  await L5.recordPick(sessionId, stage, itemId, item.kind, true, false);

  if (remaining(layout, stage) > 0) {
    await L5.saveLayout(sessionId, layout, stage);
    return res.json({
      success: true, correct: true, completed: false, stageDone: false, itemId,
      message: 'Good! Keep going.',
      ...stageView(stage, layout),
    });
  }

  /* ----- screen finished -> next screen ----- */
  if (stage < LAST_STAGE) {
    const next = stage + 1;
    const fresh = buildLayout(next);
    await L5.saveLayout(sessionId, fresh, next);
    return res.json({
      success: true, correct: true, completed: false, stageDone: true, itemId,
      message: cfg.right,
      ...stageView(next, fresh),
    });
  }

  /* ----- level finished (only after screen 3) ----- */
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
    message: cfg.right,
    score, stars, attempts, progressSaved,
    ...stageView(stage, layout),
  });
}));

/* ---------------- POST /hint ---------------- */

r.post('/hint', handle(async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);
  if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

  const session = await L5.getSession(sessionId, playerId);
  if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

  const stage = Number(session.stage);
  const target = session.layout.find((i) => i.kind === STAGES[stage].target && !i.hidden);
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