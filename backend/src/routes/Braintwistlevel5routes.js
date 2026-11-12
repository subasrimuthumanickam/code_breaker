
// // // // // // const express = require('express');
// // // // // // const L5 = require('../data/level5Db');

// // // // // // const r = express.Router();

// // // // // // const LAST_STAGE = 3;
// // // // // // const HINT_COST = 25;
// // // // // // const TOTAL = 20;   // items on every screen

// // // // // // // target = what the player must tap. Total items per screen = 20.
// // // // // // // rearrange = a wrong tap moves everything around (only screen 2).
// // // // // // const STAGES = {
// // // // // //   1: { title: 'Pick the apples!', hint: 'Tap every apple', target: 'apple', apple: 20, tomato: 0,
// // // // // //        rearrange: false, right: 'Nice! Now look carefully...' },
// // // // // //   2: { title: 'Find the 4 tomatoes!', hint: 'Tomatoes look like apples. Tap only the 4 tomatoes', target: 'tomato', apple: 16, tomato: 4,
// // // // // //        rearrange: true, right: 'Sharp eyes! One more screen.' },
// // // // // //   3: { title: 'Pick the apples!', hint: 'Tap every apple, not the tomato', target: 'apple', apple: 19, tomato: 1,
// // // // // //        rearrange: false, right: 'You found all the apples!' },
// // // // // // };

// // // // // // const WRONG = {
// // // // // //   apple: 'That is an apple, not a tomato!',
// // // // // //   tomato: 'That is a tomato, not an apple!',
// // // // // // };

// // // // // // /* ---------------- random scattered positions ---------------- */

// // // // // // // minimum gap between two items (as a fraction of the board width / height)
// // // // // // const MINX = 0.125;
// // // // // // const MINY = 0.175;

// // // // // // const shuffle = (arr) => {
// // // // // //   const a = arr.slice();
// // // // // //   for (let i = a.length - 1; i > 0; i--) {
// // // // // //     const j = Math.floor(Math.random() * (i + 1));
// // // // // //     [a[i], a[j]] = [a[j], a[i]];
// // // // // //   }
// // // // // //   return a;
// // // // // // };

// // // // // // // n random points over the whole board, no two too close (so nothing overlaps)
// // // // // // const genPoints = (n) => {
// // // // // //   let k = 1;
// // // // // //   for (let round = 0; round < 60; round++) {
// // // // // //     for (let t = 0; t < 40; t++) {
// // // // // //       const pts = [];
// // // // // //       let tries = 0;
// // // // // //       while (pts.length < n && tries < 4000) {
// // // // // //         tries++;
// // // // // //         const x = 0.08 + Math.random() * 0.84;
// // // // // //         const y = 0.09 + Math.random() * 0.82;
// // // // // //         const ok = pts.every((p) =>
// // // // // //           Math.pow((p.x - x) / (MINX * k), 2) + Math.pow((p.y - y) / (MINY * k), 2) >= 1);
// // // // // //         if (ok) pts.push({ x, y });
// // // // // //       }
// // // // // //       if (pts.length === n) return pts;
// // // // // //     }
// // // // // //     k *= 0.97;   // board too crowded -> allow slightly smaller gaps and try again
// // // // // //   }
// // // // // //   // safety fallback: loose jittered grid
// // // // // //   const out = [];
// // // // // //   const cols = 5, rows = Math.ceil(n / cols);
// // // // // //   for (let i = 0; i < n; i++) {
// // // // // //     out.push({
// // // // // //       x: 0.1 + ((i % cols) + Math.random() * 0.4) * (0.8 / cols),
// // // // // //       y: 0.1 + (Math.floor(i / cols) + Math.random() * 0.4) * (0.8 / rows),
// // // // // //     });
// // // // // //   }
// // // // // //   return out;
// // // // // // };

// // // // // // const randRot = () => Math.round(Math.random() * 60 - 30);

// // // // // // /* ---------------- layout helpers ---------------- */

// // // // // // const buildLayout = (stage) => {
// // // // // //   const s = STAGES[stage];
// // // // // //   const kinds = shuffle([
// // // // // //     ...Array(s.apple).fill('apple'),
// // // // // //     ...Array(s.tomato).fill('tomato'),
// // // // // //   ]);
// // // // // //   const pts = genPoints(kinds.length);
// // // // // //   return kinds.map((kind, i) => ({
// // // // // //     id: i + 1, kind, hidden: false,
// // // // // //     x: pts[i].x, y: pts[i].y, rot: randRot(),
// // // // // //   }));
// // // // // // };

// // // // // // // every item gets a brand new random place
// // // // // // const reshuffle = (layout) => {
// // // // // //   const pts = genPoints(layout.length);
// // // // // //   return layout.map((i, k) => ({ ...i, x: pts[k].x, y: pts[k].y, rot: randRot() }));
// // // // // // };

// // // // // // const itemsView = (layout) =>
// // // // // //   layout.map((i) => ({
// // // // // //     id: i.id, kind: i.kind, hidden: !!i.hidden,
// // // // // //     x: i.x, y: i.y, rot: i.rot,
// // // // // //   }));

// // // // // // const remaining = (layout, stage) =>
// // // // // //   layout.filter((i) => i.kind === STAGES[stage].target && !i.hidden).length;

// // // // // // const stageView = (stage, layout) => ({
// // // // // //   stage,
// // // // // //   totalStages: LAST_STAGE,
// // // // // //   title: STAGES[stage].title,
// // // // // //   hint: STAGES[stage].hint,
// // // // // //   target: STAGES[stage].target,
// // // // // //   remaining: remaining(layout, stage),
// // // // // //   items: itemsView(layout),
// // // // // // });

// // // // // // /* ---------------- misc ---------------- */

// // // // // // const handle = (fn) => async (req, res) => {
// // // // // //   try { await fn(req, res); }
// // // // // //   catch (err) {
// // // // // //     console.error('[BrainTwist L5 Error]', req.method, req.originalUrl, err);
// // // // // //     if (!res.headersSent) res.status(500).json({ success: false, error: 'server_error', message: err.message });
// // // // // //   }
// // // // // // };

// // // // // // const toId = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
// // // // // // const bad = (res, status, error, message) => res.status(status).json({ success: false, error, message });

// // // // // // r.use(async (req, res, next) => { await L5.ready; next(); });

// // // // // // /* ---------------- POST /start ---------------- */

// // // // // // r.post('/start', handle(async (req, res) => {
// // // // // //   const playerId = toId(req.body && req.body.playerId);
// // // // // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// // // // // //   let session = await L5.findActive(playerId);
// // // // // //   // old sessions (grid / slot layout) are closed and a fresh scattered one is made
// // // // // //   if (session && !(
// // // // // //     session.layout.length === TOTAL &&
// // // // // //     session.layout.every((i) =>
// // // // // //       (i.kind === 'apple' || i.kind === 'tomato') &&
// // // // // //       typeof i.x === 'number' && typeof i.y === 'number')
// // // // // //   )) {
// // // // // //     await L5.completeSession(session.id);
// // // // // //     session = null;
// // // // // //   }
// // // // // //   if (!session) session = await L5.createSession(playerId, buildLayout(1));

// // // // // //   res.json({
// // // // // //     success: true,
// // // // // //     sessionId: session.id,
// // // // // //     level: L5.LEVEL,
// // // // // //     status: session.status,
// // // // // //     ...stageView(Number(session.stage), session.layout),
// // // // // //   });
// // // // // // }));

// // // // // // /* ---------------- POST /pick ---------------- */

// // // // // // r.post('/pick', handle(async (req, res) => {
// // // // // //   const sessionId = toId(req.body && req.body.sessionId);
// // // // // //   const playerId = toId(req.body && req.body.playerId);
// // // // // //   const itemId = toId(req.body && req.body.itemId);
// // // // // //   if (!sessionId || !playerId || !itemId) return bad(res, 400, 'ids_required', 'sessionId, playerId and itemId are required');

// // // // // //   const session = await L5.getSession(sessionId, playerId);
// // // // // //   if (!session) return bad(res, 404, 'no_session', 'Session not found');
// // // // // //   if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

// // // // // //   const stage = Number(session.stage);
// // // // // //   const cfg = STAGES[stage];
// // // // // //   let layout = session.layout;
// // // // // //   const item = layout.find((i) => i.id === itemId);
// // // // // //   if (!item || item.hidden) return bad(res, 400, 'invalid_move', 'That item cannot be picked');

// // // // // //   /* ----- wrong pick ----- */
// // // // // //   if (item.kind !== cfg.target) {
// // // // // //     if (cfg.rearrange) layout = reshuffle(layout);   // only screen 2 rearranges
// // // // // //     await L5.recordPick(sessionId, stage, itemId, item.kind, false, cfg.rearrange);
// // // // // //     await L5.saveLayout(sessionId, layout, stage);

// // // // // //     return res.json({
// // // // // //       success: true,
// // // // // //       correct: false,
// // // // // //       completed: false,
// // // // // //       stageDone: false,
// // // // // //       itemId,
// // // // // //       reshuffled: cfg.rearrange,
// // // // // //       wrongAttempts: Number(session.wrong_attempts) + 1,
// // // // // //       message: WRONG[item.kind],
// // // // // //       ...stageView(stage, layout),
// // // // // //     });
// // // // // //   }

// // // // // //   /* ----- right pick: it hides ----- */
// // // // // //   item.hidden = true;
// // // // // //   await L5.recordPick(sessionId, stage, itemId, item.kind, true, false);

// // // // // //   if (remaining(layout, stage) > 0) {
// // // // // //     await L5.saveLayout(sessionId, layout, stage);
// // // // // //     return res.json({
// // // // // //       success: true, correct: true, completed: false, stageDone: false, itemId,
// // // // // //       message: 'Good! Keep going.',
// // // // // //       ...stageView(stage, layout),
// // // // // //     });
// // // // // //   }

// // // // // //   /* ----- screen finished -> next screen ----- */
// // // // // //   if (stage < LAST_STAGE) {
// // // // // //     const next = stage + 1;
// // // // // //     const fresh = buildLayout(next);
// // // // // //     await L5.saveLayout(sessionId, fresh, next);
// // // // // //     return res.json({
// // // // // //       success: true, correct: true, completed: false, stageDone: true, itemId,
// // // // // //       message: cfg.right,
// // // // // //       ...stageView(next, fresh),
// // // // // //     });
// // // // // //   }

// // // // // //   /* ----- level finished (only after screen 3) ----- */
// // // // // //   const wrong = Number(session.wrong_attempts);
// // // // // //   const attempts = Number(session.total_attempts) + 1;
// // // // // //   const score = Math.max(100, 300 - wrong * 50);
// // // // // //   const stars = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;

// // // // // //   await L5.saveLayout(sessionId, layout, stage);
// // // // // //   await L5.completeSession(sessionId);

// // // // // //   let progressSaved = false;
// // // // // //   try { await L5.saveProgress(playerId, score, stars, attempts); progressSaved = true; }
// // // // // //   catch (err) { console.error('[BrainTwist L5] could not save progress:', err.message); }

// // // // // //   res.json({
// // // // // //     success: true, correct: true, completed: true, stageDone: true, itemId,
// // // // // //     message: cfg.right,
// // // // // //     score, stars, attempts, progressSaved,
// // // // // //     ...stageView(stage, layout),
// // // // // //   });
// // // // // // }));

// // // // // // /* ---------------- POST /hint ---------------- */

// // // // // // r.post('/hint', handle(async (req, res) => {
// // // // // //   const sessionId = toId(req.body && req.body.sessionId);
// // // // // //   const playerId = toId(req.body && req.body.playerId);
// // // // // //   if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

// // // // // //   const session = await L5.getSession(sessionId, playerId);
// // // // // //   if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

// // // // // //   const stage = Number(session.stage);
// // // // // //   const target = session.layout.find((i) => i.kind === STAGES[stage].target && !i.hidden);
// // // // // //   if (!target) return bad(res, 409, 'nothing_to_hint', 'Nothing left to find');

// // // // // //   const hints = await L5.spendHints(playerId, HINT_COST);
// // // // // //   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

// // // // // //   res.json({ success: true, itemId: target.id, hints, cost: HINT_COST });
// // // // // // }));

// // // // // // /* ---------------- GET /status/:playerId ---------------- */

// // // // // // r.get('/status/:playerId', handle(async (req, res) => {
// // // // // //   const playerId = toId(req.params.playerId);
// // // // // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
// // // // // //   const row = await L5.getProgress(playerId);
// // // // // //   res.json({
// // // // // //     success: true,
// // // // // //     level: L5.LEVEL,
// // // // // //     completed: Boolean(row && row.is_completed),
// // // // // //     score: row ? Number(row.score) || 0 : 0,
// // // // // //     stars: row ? Number(row.stars) || 0 : 0,
// // // // // //     attempts: row ? Number(row.attempts) || 0 : 0,
// // // // // //     completedAt: row ? row.completed_at : null,
// // // // // //   });
// // // // // // }));

// // // // // // r._test = { buildLayout, reshuffle, itemsView, remaining, STAGES };
// // // // // // module.exports = r;
// // // // // const express = require('express');
// // // // // const L5 = require('../data/level5Db');

// // // // // const r = express.Router();

// // // // // const LAST_STAGE = 3;
// // // // // const HINT_COST = 25;

// // // // // // target = what the player must tap.
// // // // // // rearrange = a wrong tap moves everything around (only screen 3).
// // // // // // Items per screen: 1 -> 15 apples + 1 tomato, 2 -> 12 apples + 1 tomato, 3 -> 8 apples + 1 tomato
// // // // // const STAGES = {
// // // // //   1: { title: 'Find the tomato!', hint: 'Tomatoes look like apples. Tap only the tomato', target: 'tomato', apple: 15, tomato: 1,
// // // // //        rearrange: false, right: 'Nice! Now look carefully...' },
// // // // //   2: { title: 'Find the tomato!', hint: 'Tomatoes look like apples. Tap only the tomato', target: 'tomato', apple: 12, tomato: 1,
// // // // //        rearrange: false, right: 'Sharp eyes! One more screen.' },
// // // // //   3: { title: 'Find the tomato!', hint: 'Careful! A wrong tap rearranges everything', target: 'tomato', apple: 8, tomato: 1,
// // // // //        rearrange: true, right: 'You found the tomato!' },
// // // // // };

// // // // // const totalFor = (stage) => STAGES[stage].apple + STAGES[stage].tomato;

// // // // // const WRONG = {
// // // // //   apple: 'That is an apple, not a tomato!',
// // // // //   tomato: 'That is a tomato, not an apple!',
// // // // // };

// // // // // /* ---------------- random scattered positions ---------------- */

// // // // // // minimum gap between two items (as a fraction of the board width / height)
// // // // // const MINX = 0.15;
// // // // // const MINY = 0.2;

// // // // // const shuffle = (arr) => {
// // // // //   const a = arr.slice();
// // // // //   for (let i = a.length - 1; i > 0; i--) {
// // // // //     const j = Math.floor(Math.random() * (i + 1));
// // // // //     [a[i], a[j]] = [a[j], a[i]];
// // // // //   }
// // // // //   return a;
// // // // // };

// // // // // // n random points over the whole board, no two too close (so nothing overlaps)
// // // // // const genPoints = (n) => {
// // // // //   let k = 1;
// // // // //   for (let round = 0; round < 60; round++) {
// // // // //     for (let t = 0; t < 40; t++) {
// // // // //       const pts = [];
// // // // //       let tries = 0;
// // // // //       while (pts.length < n && tries < 4000) {
// // // // //         tries++;
// // // // //         const x = 0.09 + Math.random() * 0.82;
// // // // //         const y = 0.1 + Math.random() * 0.8;
// // // // //         const ok = pts.every((p) =>
// // // // //           Math.pow((p.x - x) / (MINX * k), 2) + Math.pow((p.y - y) / (MINY * k), 2) >= 1);
// // // // //         if (ok) pts.push({ x, y });
// // // // //       }
// // // // //       if (pts.length === n) return pts;
// // // // //     }
// // // // //     k *= 0.97;   // board too crowded -> allow slightly smaller gaps and try again
// // // // //   }
// // // // //   // safety fallback: loose jittered grid
// // // // //   const out = [];
// // // // //   const cols = 4, rows = Math.ceil(n / cols);
// // // // //   for (let i = 0; i < n; i++) {
// // // // //     out.push({
// // // // //       x: 0.12 + ((i % cols) + Math.random() * 0.4) * (0.76 / cols),
// // // // //       y: 0.12 + (Math.floor(i / cols) + Math.random() * 0.4) * (0.76 / rows),
// // // // //     });
// // // // //   }
// // // // //   return out;
// // // // // };

// // // // // const randRot = () => Math.round(Math.random() * 60 - 30);

// // // // // /* ---------------- layout helpers ---------------- */

// // // // // const buildLayout = (stage) => {
// // // // //   const s = STAGES[stage];
// // // // //   const kinds = shuffle([
// // // // //     ...Array(s.apple).fill('apple'),
// // // // //     ...Array(s.tomato).fill('tomato'),
// // // // //   ]);
// // // // //   const pts = genPoints(kinds.length);
// // // // //   return kinds.map((kind, i) => ({
// // // // //     id: i + 1, kind, hidden: false,
// // // // //     x: pts[i].x, y: pts[i].y, rot: randRot(),
// // // // //   }));
// // // // // };

// // // // // // every item gets a brand new random place
// // // // // const reshuffle = (layout) => {
// // // // //   const pts = genPoints(layout.length);
// // // // //   return layout.map((i, k) => ({ ...i, x: pts[k].x, y: pts[k].y, rot: randRot() }));
// // // // // };

// // // // // const itemsView = (layout) =>
// // // // //   layout.map((i) => ({
// // // // //     id: i.id, kind: i.kind, hidden: !!i.hidden,
// // // // //     x: i.x, y: i.y, rot: i.rot,
// // // // //   }));

// // // // // const remaining = (layout, stage) =>
// // // // //   layout.filter((i) => i.kind === STAGES[stage].target && !i.hidden).length;

// // // // // const stageView = (stage, layout) => ({
// // // // //   stage,
// // // // //   totalStages: LAST_STAGE,
// // // // //   title: STAGES[stage].title,
// // // // //   hint: STAGES[stage].hint,
// // // // //   target: STAGES[stage].target,
// // // // //   remaining: remaining(layout, stage),
// // // // //   items: itemsView(layout),
// // // // // });

// // // // // /* ---------------- misc ---------------- */

// // // // // const handle = (fn) => async (req, res) => {
// // // // //   try { await fn(req, res); }
// // // // //   catch (err) {
// // // // //     console.error('[BrainTwist L5 Error]', req.method, req.originalUrl, err);
// // // // //     if (!res.headersSent) res.status(500).json({ success: false, error: 'server_error', message: err.message });
// // // // //   }
// // // // // };

// // // // // const toId = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
// // // // // const bad = (res, status, error, message) => res.status(status).json({ success: false, error, message });

// // // // // r.use(async (req, res, next) => { await L5.ready; next(); });

// // // // // /* ---------------- POST /start ---------------- */

// // // // // r.post('/start', handle(async (req, res) => {
// // // // //   const playerId = toId(req.body && req.body.playerId);
// // // // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// // // // //   let session = await L5.findActive(playerId);
// // // // //   // old sessions (20 items, old layout) are closed and a fresh one is made
// // // // //   if (session) {
// // // // //     const st = Number(session.stage);
// // // // //     const okStage = STAGES[st];
// // // // //     const okLayout = okStage &&
// // // // //       session.layout.length === totalFor(st) &&
// // // // //       session.layout.every((i) =>
// // // // //         (i.kind === 'apple' || i.kind === 'tomato') &&
// // // // //         typeof i.x === 'number' && typeof i.y === 'number');
// // // // //     if (!okLayout) {
// // // // //       await L5.completeSession(session.id);
// // // // //       session = null;
// // // // //     }
// // // // //   }
// // // // //   if (!session) session = await L5.createSession(playerId, buildLayout(1));

// // // // //   res.json({
// // // // //     success: true,
// // // // //     sessionId: session.id,
// // // // //     level: L5.LEVEL,
// // // // //     status: session.status,
// // // // //     ...stageView(Number(session.stage), session.layout),
// // // // //   });
// // // // // }));

// // // // // /* ---------------- POST /pick ---------------- */

// // // // // r.post('/pick', handle(async (req, res) => {
// // // // //   const sessionId = toId(req.body && req.body.sessionId);
// // // // //   const playerId = toId(req.body && req.body.playerId);
// // // // //   const itemId = toId(req.body && req.body.itemId);
// // // // //   if (!sessionId || !playerId || !itemId) return bad(res, 400, 'ids_required', 'sessionId, playerId and itemId are required');

// // // // //   const session = await L5.getSession(sessionId, playerId);
// // // // //   if (!session) return bad(res, 404, 'no_session', 'Session not found');
// // // // //   if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

// // // // //   const stage = Number(session.stage);
// // // // //   const cfg = STAGES[stage];
// // // // //   let layout = session.layout;
// // // // //   const item = layout.find((i) => i.id === itemId);
// // // // //   if (!item || item.hidden) return bad(res, 400, 'invalid_move', 'That item cannot be picked');

// // // // //   /* ----- wrong pick ----- */
// // // // //   if (item.kind !== cfg.target) {
// // // // //     if (cfg.rearrange) layout = reshuffle(layout);   // only screen 3 rearranges
// // // // //     await L5.recordPick(sessionId, stage, itemId, item.kind, false, cfg.rearrange);
// // // // //     await L5.saveLayout(sessionId, layout, stage);

// // // // //     return res.json({
// // // // //       success: true,
// // // // //       correct: false,
// // // // //       completed: false,
// // // // //       stageDone: false,
// // // // //       itemId,
// // // // //       reshuffled: cfg.rearrange,
// // // // //       wrongAttempts: Number(session.wrong_attempts) + 1,
// // // // //       message: WRONG[item.kind],
// // // // //       ...stageView(stage, layout),
// // // // //     });
// // // // //   }

// // // // //   /* ----- right pick: it hides ----- */
// // // // //   item.hidden = true;
// // // // //   await L5.recordPick(sessionId, stage, itemId, item.kind, true, false);

// // // // //   if (remaining(layout, stage) > 0) {
// // // // //     await L5.saveLayout(sessionId, layout, stage);
// // // // //     return res.json({
// // // // //       success: true, correct: true, completed: false, stageDone: false, itemId,
// // // // //       message: 'Good! Keep going.',
// // // // //       ...stageView(stage, layout),
// // // // //     });
// // // // //   }

// // // // //   /* ----- screen finished -> next screen ----- */
// // // // //   if (stage < LAST_STAGE) {
// // // // //     const next = stage + 1;
// // // // //     const fresh = buildLayout(next);
// // // // //     await L5.saveLayout(sessionId, fresh, next);
// // // // //     return res.json({
// // // // //       success: true, correct: true, completed: false, stageDone: true, itemId,
// // // // //       message: cfg.right,
// // // // //       ...stageView(next, fresh),
// // // // //     });
// // // // //   }

// // // // //   /* ----- level finished (only after screen 3) ----- */
// // // // //   const wrong = Number(session.wrong_attempts);
// // // // //   const attempts = Number(session.total_attempts) + 1;
// // // // //   const score = Math.max(100, 300 - wrong * 50);
// // // // //   const stars = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;

// // // // //   await L5.saveLayout(sessionId, layout, stage);
// // // // //   await L5.completeSession(sessionId);

// // // // //   let progressSaved = false;
// // // // //   try { await L5.saveProgress(playerId, score, stars, attempts); progressSaved = true; }
// // // // //   catch (err) { console.error('[BrainTwist L5] could not save progress:', err.message); }

// // // // //   res.json({
// // // // //     success: true, correct: true, completed: true, stageDone: true, itemId,
// // // // //     message: cfg.right,
// // // // //     score, stars, attempts, progressSaved,
// // // // //     ...stageView(stage, layout),
// // // // //   });
// // // // // }));

// // // // // /* ---------------- POST /hint ---------------- */

// // // // // r.post('/hint', handle(async (req, res) => {
// // // // //   const sessionId = toId(req.body && req.body.sessionId);
// // // // //   const playerId = toId(req.body && req.body.playerId);
// // // // //   if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

// // // // //   const session = await L5.getSession(sessionId, playerId);
// // // // //   if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

// // // // //   const stage = Number(session.stage);
// // // // //   const target = session.layout.find((i) => i.kind === STAGES[stage].target && !i.hidden);
// // // // //   if (!target) return bad(res, 409, 'nothing_to_hint', 'Nothing left to find');

// // // // //   const hints = await L5.spendHints(playerId, HINT_COST);
// // // // //   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

// // // // //   res.json({ success: true, itemId: target.id, hints, cost: HINT_COST });
// // // // // }));

// // // // // /* ---------------- GET /status/:playerId ---------------- */

// // // // // r.get('/status/:playerId', handle(async (req, res) => {
// // // // //   const playerId = toId(req.params.playerId);
// // // // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
// // // // //   const row = await L5.getProgress(playerId);
// // // // //   res.json({
// // // // //     success: true,
// // // // //     level: L5.LEVEL,
// // // // //     completed: Boolean(row && row.is_completed),
// // // // //     score: row ? Number(row.score) || 0 : 0,
// // // // //     stars: row ? Number(row.stars) || 0 : 0,
// // // // //     attempts: row ? Number(row.attempts) || 0 : 0,
// // // // //     completedAt: row ? row.completed_at : null,
// // // // //   });
// // // // // }));

// // // // // r._test = { buildLayout, reshuffle, itemsView, remaining, STAGES };
// // // // // module.exports = r;
// // // // const express = require('express');
// // // // const L5 = require('../data/level5Db');

// // // // const r = express.Router();

// // // // const LAST_STAGE = 3;
// // // // const HINT_COST = 25;

// // // // // target = what the player must tap (the apples). The single tomato is the trap.
// // // // // rearrange = a wrong tap (the tomato) moves everything around (only screen 3).
// // // // // Items per screen: 1 -> 15 apples + 1 tomato, 2 -> 12 apples + 1 tomato, 3 -> 8 apples + 1 tomato
// // // // const STAGES = {
// // // //   1: { title: 'Find the apples!', hint: 'Tap every apple, but not the tomato', target: 'apple', apple: 15, tomato: 1,
// // // //        rearrange: false, right: 'Nice! Now look carefully...' },
// // // //   2: { title: 'Find the apples!', hint: 'Tap every apple, but not the tomato', target: 'apple', apple: 12, tomato: 1,
// // // //        rearrange: false, right: 'Sharp eyes! One more screen.' },
// // // //   3: { title: 'Find the apples!', hint: 'Careful! Tapping the tomato rearranges everything', target: 'apple', apple: 8, tomato: 1,
// // // //        rearrange: true, right: 'You found all the apples!' },
// // // // };

// // // // const totalFor = (stage) => STAGES[stage].apple + STAGES[stage].tomato;

// // // // const WRONG = {
// // // //   apple: 'That is an apple, not a tomato!',
// // // //   tomato: 'That is a tomato, not an apple!',
// // // // };

// // // // /* ---------------- random scattered positions ---------------- */

// // // // // minimum gap between two items (as a fraction of the board width / height)
// // // // const MINX = 0.15;
// // // // const MINY = 0.2;

// // // // const shuffle = (arr) => {
// // // //   const a = arr.slice();
// // // //   for (let i = a.length - 1; i > 0; i--) {
// // // //     const j = Math.floor(Math.random() * (i + 1));
// // // //     [a[i], a[j]] = [a[j], a[i]];
// // // //   }
// // // //   return a;
// // // // };

// // // // // n random points over the whole board, no two too close (so nothing overlaps)
// // // // const genPoints = (n) => {
// // // //   let k = 1;
// // // //   for (let round = 0; round < 60; round++) {
// // // //     for (let t = 0; t < 40; t++) {
// // // //       const pts = [];
// // // //       let tries = 0;
// // // //       while (pts.length < n && tries < 4000) {
// // // //         tries++;
// // // //         const x = 0.09 + Math.random() * 0.82;
// // // //         const y = 0.1 + Math.random() * 0.8;
// // // //         const ok = pts.every((p) =>
// // // //           Math.pow((p.x - x) / (MINX * k), 2) + Math.pow((p.y - y) / (MINY * k), 2) >= 1);
// // // //         if (ok) pts.push({ x, y });
// // // //       }
// // // //       if (pts.length === n) return pts;
// // // //     }
// // // //     k *= 0.97;   // board too crowded -> allow slightly smaller gaps and try again
// // // //   }
// // // //   // safety fallback: loose jittered grid
// // // //   const out = [];
// // // //   const cols = 4, rows = Math.ceil(n / cols);
// // // //   for (let i = 0; i < n; i++) {
// // // //     out.push({
// // // //       x: 0.12 + ((i % cols) + Math.random() * 0.4) * (0.76 / cols),
// // // //       y: 0.12 + (Math.floor(i / cols) + Math.random() * 0.4) * (0.76 / rows),
// // // //     });
// // // //   }
// // // //   return out;
// // // // };

// // // // const randRot = () => Math.round(Math.random() * 60 - 30);

// // // // /* ---------------- layout helpers ---------------- */

// // // // const buildLayout = (stage) => {
// // // //   const s = STAGES[stage];
// // // //   const kinds = shuffle([
// // // //     ...Array(s.apple).fill('apple'),
// // // //     ...Array(s.tomato).fill('tomato'),
// // // //   ]);
// // // //   const pts = genPoints(kinds.length);
// // // //   return kinds.map((kind, i) => ({
// // // //     id: i + 1, kind, hidden: false,
// // // //     x: pts[i].x, y: pts[i].y, rot: randRot(),
// // // //   }));
// // // // };

// // // // // every item gets a brand new random place
// // // // const reshuffle = (layout) => {
// // // //   const pts = genPoints(layout.length);
// // // //   return layout.map((i, k) => ({ ...i, x: pts[k].x, y: pts[k].y, rot: randRot() }));
// // // // };

// // // // const itemsView = (layout) =>
// // // //   layout.map((i) => ({
// // // //     id: i.id, kind: i.kind, hidden: !!i.hidden,
// // // //     x: i.x, y: i.y, rot: i.rot,
// // // //   }));

// // // // const remaining = (layout, stage) =>
// // // //   layout.filter((i) => i.kind === STAGES[stage].target && !i.hidden).length;

// // // // const stageView = (stage, layout) => ({
// // // //   stage,
// // // //   totalStages: LAST_STAGE,
// // // //   title: STAGES[stage].title,
// // // //   hint: STAGES[stage].hint,
// // // //   target: STAGES[stage].target,
// // // //   remaining: remaining(layout, stage),
// // // //   items: itemsView(layout),
// // // // });

// // // // /* ---------------- misc ---------------- */

// // // // const handle = (fn) => async (req, res) => {
// // // //   try { await fn(req, res); }
// // // //   catch (err) {
// // // //     console.error('[BrainTwist L5 Error]', req.method, req.originalUrl, err);
// // // //     if (!res.headersSent) res.status(500).json({ success: false, error: 'server_error', message: err.message });
// // // //   }
// // // // };

// // // // const toId = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
// // // // const bad = (res, status, error, message) => res.status(status).json({ success: false, error, message });

// // // // r.use(async (req, res, next) => { await L5.ready; next(); });

// // // // /* ---------------- POST /start ---------------- */

// // // // r.post('/start', handle(async (req, res) => {
// // // //   const playerId = toId(req.body && req.body.playerId);
// // // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// // // //   let session = await L5.findActive(playerId);
// // // //   // old sessions (old counts / old layout) are closed and a fresh one is made
// // // //   if (session) {
// // // //     const st = Number(session.stage);
// // // //     const okStage = STAGES[st];
// // // //     const okLayout = okStage &&
// // // //       session.layout.length === totalFor(st) &&
// // // //       session.layout.every((i) =>
// // // //         (i.kind === 'apple' || i.kind === 'tomato') &&
// // // //         typeof i.x === 'number' && typeof i.y === 'number');
// // // //     if (!okLayout) {
// // // //       await L5.completeSession(session.id);
// // // //       session = null;
// // // //     }
// // // //   }
// // // //   if (!session) session = await L5.createSession(playerId, buildLayout(1));

// // // //   res.json({
// // // //     success: true,
// // // //     sessionId: session.id,
// // // //     level: L5.LEVEL,
// // // //     status: session.status,
// // // //     ...stageView(Number(session.stage), session.layout),
// // // //   });
// // // // }));

// // // // /* ---------------- POST /pick ---------------- */

// // // // r.post('/pick', handle(async (req, res) => {
// // // //   const sessionId = toId(req.body && req.body.sessionId);
// // // //   const playerId = toId(req.body && req.body.playerId);
// // // //   const itemId = toId(req.body && req.body.itemId);
// // // //   if (!sessionId || !playerId || !itemId) return bad(res, 400, 'ids_required', 'sessionId, playerId and itemId are required');

// // // //   const session = await L5.getSession(sessionId, playerId);
// // // //   if (!session) return bad(res, 404, 'no_session', 'Session not found');
// // // //   if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

// // // //   const stage = Number(session.stage);
// // // //   const cfg = STAGES[stage];
// // // //   let layout = session.layout;
// // // //   const item = layout.find((i) => i.id === itemId);
// // // //   if (!item || item.hidden) return bad(res, 400, 'invalid_move', 'That item cannot be picked');

// // // //   /* ----- wrong pick (the tomato) ----- */
// // // //   if (item.kind !== cfg.target) {
// // // //     if (cfg.rearrange) layout = reshuffle(layout);   // only screen 3 rearranges
// // // //     await L5.recordPick(sessionId, stage, itemId, item.kind, false, cfg.rearrange);
// // // //     await L5.saveLayout(sessionId, layout, stage);

// // // //     return res.json({
// // // //       success: true,
// // // //       correct: false,
// // // //       completed: false,
// // // //       stageDone: false,
// // // //       itemId,
// // // //       reshuffled: cfg.rearrange,
// // // //       wrongAttempts: Number(session.wrong_attempts) + 1,
// // // //       message: WRONG[item.kind],
// // // //       ...stageView(stage, layout),
// // // //     });
// // // //   }

// // // //   /* ----- right pick (an apple): it hides ----- */
// // // //   item.hidden = true;
// // // //   await L5.recordPick(sessionId, stage, itemId, item.kind, true, false);

// // // //   if (remaining(layout, stage) > 0) {
// // // //     await L5.saveLayout(sessionId, layout, stage);
// // // //     return res.json({
// // // //       success: true, correct: true, completed: false, stageDone: false, itemId,
// // // //       message: 'Good! Keep going.',
// // // //       ...stageView(stage, layout),
// // // //     });
// // // //   }

// // // //   /* ----- screen finished -> next screen ----- */
// // // //   if (stage < LAST_STAGE) {
// // // //     const next = stage + 1;
// // // //     const fresh = buildLayout(next);
// // // //     await L5.saveLayout(sessionId, fresh, next);
// // // //     return res.json({
// // // //       success: true, correct: true, completed: false, stageDone: true, itemId,
// // // //       message: cfg.right,
// // // //       ...stageView(next, fresh),
// // // //     });
// // // //   }

// // // //   /* ----- level finished (only after screen 3) ----- */
// // // //   const wrong = Number(session.wrong_attempts);
// // // //   const attempts = Number(session.total_attempts) + 1;
// // // //   const score = Math.max(100, 300 - wrong * 50);
// // // //   const stars = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;

// // // //   await L5.saveLayout(sessionId, layout, stage);
// // // //   await L5.completeSession(sessionId);

// // // //   let progressSaved = false;
// // // //   try { await L5.saveProgress(playerId, score, stars, attempts); progressSaved = true; }
// // // //   catch (err) { console.error('[BrainTwist L5] could not save progress:', err.message); }

// // // //   res.json({
// // // //     success: true, correct: true, completed: true, stageDone: true, itemId,
// // // //     message: cfg.right,
// // // //     score, stars, attempts, progressSaved,
// // // //     ...stageView(stage, layout),
// // // //   });
// // // // }));

// // // // /* ---------------- POST /hint ---------------- */

// // // // r.post('/hint', handle(async (req, res) => {
// // // //   const sessionId = toId(req.body && req.body.sessionId);
// // // //   const playerId = toId(req.body && req.body.playerId);
// // // //   if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

// // // //   const session = await L5.getSession(sessionId, playerId);
// // // //   if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

// // // //   const stage = Number(session.stage);
// // // //   const target = session.layout.find((i) => i.kind === STAGES[stage].target && !i.hidden);
// // // //   if (!target) return bad(res, 409, 'nothing_to_hint', 'Nothing left to find');

// // // //   const hints = await L5.spendHints(playerId, HINT_COST);
// // // //   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

// // // //   res.json({ success: true, itemId: target.id, hints, cost: HINT_COST });
// // // // }));

// // // // /* ---------------- GET /status/:playerId ---------------- */

// // // // r.get('/status/:playerId', handle(async (req, res) => {
// // // //   const playerId = toId(req.params.playerId);
// // // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
// // // //   const row = await L5.getProgress(playerId);
// // // //   res.json({
// // // //     success: true,
// // // //     level: L5.LEVEL,
// // // //     completed: Boolean(row && row.is_completed),
// // // //     score: row ? Number(row.score) || 0 : 0,
// // // //     stars: row ? Number(row.stars) || 0 : 0,
// // // //     attempts: row ? Number(row.attempts) || 0 : 0,
// // // //     completedAt: row ? row.completed_at : null,
// // // //   });
// // // // }));

// // // // r._test = { buildLayout, reshuffle, itemsView, remaining, STAGES };
// // // // module.exports = r;
// // // const express = require('express');
// // // const L5 = require('../data/level5Db');

// // // const r = express.Router();

// // // const LAST_STAGE = 3;
// // // const HINT_COST = 25;

// // // // target = what the player must tap (always the apples).
// // // // Screen 1: 15 apples, no tomato
// // // // Screen 2: 12 apples, no tomato
// // // // Screen 3: 8 apples + 1 tomato (trap). Tapping the tomato = wrong + everything rearranges.
// // // const STAGES = {
// // //   1: { title: 'Find the apples!', hint: 'Tap every apple', target: 'apple', apple: 15, tomato: 0,
// // //        rearrange: false, right: 'Nice! Now look carefully...' },
// // //   2: { title: 'Find the apples!', hint: 'Tap every apple', target: 'apple', apple: 12, tomato: 0,
// // //        rearrange: false, right: 'Sharp eyes! One more screen.' },
// // //   3: { title: 'Find the apples!', hint: 'Tap every apple, but not the tomato!', target: 'apple', apple: 8, tomato: 1,
// // //        rearrange: true, right: 'You found all the apples!' },
// // // };

// // // const totalFor = (stage) => STAGES[stage].apple + STAGES[stage].tomato;

// // // const WRONG = {
// // //   apple: 'That is an apple, not a tomato!',
// // //   tomato: 'That is a tomato, not an apple!',
// // // };

// // // /* ---------------- random scattered positions ---------------- */

// // // // minimum gap between two items (as a fraction of the board width / height)
// // // const MINX = 0.15;
// // // const MINY = 0.2;

// // // const shuffle = (arr) => {
// // //   const a = arr.slice();
// // //   for (let i = a.length - 1; i > 0; i--) {
// // //     const j = Math.floor(Math.random() * (i + 1));
// // //     [a[i], a[j]] = [a[j], a[i]];
// // //   }
// // //   return a;
// // // };

// // // // n random points over the whole board, no two too close (so nothing overlaps)
// // // const genPoints = (n) => {
// // //   let k = 1;
// // //   for (let round = 0; round < 60; round++) {
// // //     for (let t = 0; t < 40; t++) {
// // //       const pts = [];
// // //       let tries = 0;
// // //       while (pts.length < n && tries < 4000) {
// // //         tries++;
// // //         const x = 0.09 + Math.random() * 0.82;
// // //         const y = 0.1 + Math.random() * 0.8;
// // //         const ok = pts.every((p) =>
// // //           Math.pow((p.x - x) / (MINX * k), 2) + Math.pow((p.y - y) / (MINY * k), 2) >= 1);
// // //         if (ok) pts.push({ x, y });
// // //       }
// // //       if (pts.length === n) return pts;
// // //     }
// // //     k *= 0.97;   // board too crowded -> allow slightly smaller gaps and try again
// // //   }
// // //   // safety fallback: loose jittered grid
// // //   const out = [];
// // //   const cols = 4, rows = Math.ceil(n / cols);
// // //   for (let i = 0; i < n; i++) {
// // //     out.push({
// // //       x: 0.12 + ((i % cols) + Math.random() * 0.4) * (0.76 / cols),
// // //       y: 0.12 + (Math.floor(i / cols) + Math.random() * 0.4) * (0.76 / rows),
// // //     });
// // //   }
// // //   return out;
// // // };

// // // const randRot = () => Math.round(Math.random() * 60 - 30);

// // // /* ---------------- layout helpers ---------------- */

// // // const buildLayout = (stage) => {
// // //   const s = STAGES[stage];
// // //   const kinds = shuffle([
// // //     ...Array(s.apple).fill('apple'),
// // //     ...Array(s.tomato).fill('tomato'),
// // //   ]);
// // //   const pts = genPoints(kinds.length);
// // //   return kinds.map((kind, i) => ({
// // //     id: i + 1, kind, hidden: false,
// // //     x: pts[i].x, y: pts[i].y, rot: randRot(),
// // //   }));
// // // };

// // // // every item gets a brand new random place
// // // const reshuffle = (layout) => {
// // //   const pts = genPoints(layout.length);
// // //   return layout.map((i, k) => ({ ...i, x: pts[k].x, y: pts[k].y, rot: randRot() }));
// // // };

// // // const itemsView = (layout) =>
// // //   layout.map((i) => ({
// // //     id: i.id, kind: i.kind, hidden: !!i.hidden,
// // //     x: i.x, y: i.y, rot: i.rot,
// // //   }));

// // // const remaining = (layout, stage) =>
// // //   layout.filter((i) => i.kind === STAGES[stage].target && !i.hidden).length;

// // // const stageView = (stage, layout) => ({
// // //   stage,
// // //   totalStages: LAST_STAGE,
// // //   title: STAGES[stage].title,
// // //   hint: STAGES[stage].hint,
// // //   target: STAGES[stage].target,
// // //   remaining: remaining(layout, stage),
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

// // // /* ---------------- POST /start ---------------- */

// // // r.post('/start', handle(async (req, res) => {
// // //   const playerId = toId(req.body && req.body.playerId);
// // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// // //   let session = await L5.findActive(playerId);
// // //   // old sessions (old counts / old layout) are closed and a fresh one is made
// // //   if (session) {
// // //     const st = Number(session.stage);
// // //     const okStage = STAGES[st];
// // //     const okLayout = okStage &&
// // //       session.layout.length === totalFor(st) &&
// // //       session.layout.filter((i) => i.kind === 'tomato').length === STAGES[st].tomato &&
// // //       session.layout.every((i) =>
// // //         (i.kind === 'apple' || i.kind === 'tomato') &&
// // //         typeof i.x === 'number' && typeof i.y === 'number');
// // //     if (!okLayout) {
// // //       await L5.completeSession(session.id);
// // //       session = null;
// // //     }
// // //   }
// // //   if (!session) session = await L5.createSession(playerId, buildLayout(1));

// // //   res.json({
// // //     success: true,
// // //     sessionId: session.id,
// // //     level: L5.LEVEL,
// // //     status: session.status,
// // //     ...stageView(Number(session.stage), session.layout),
// // //   });
// // // }));

// // // /* ---------------- POST /pick ---------------- */

// // // r.post('/pick', handle(async (req, res) => {
// // //   const sessionId = toId(req.body && req.body.sessionId);
// // //   const playerId = toId(req.body && req.body.playerId);
// // //   const itemId = toId(req.body && req.body.itemId);
// // //   if (!sessionId || !playerId || !itemId) return bad(res, 400, 'ids_required', 'sessionId, playerId and itemId are required');

// // //   const session = await L5.getSession(sessionId, playerId);
// // //   if (!session) return bad(res, 404, 'no_session', 'Session not found');
// // //   if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

// // //   const stage = Number(session.stage);
// // //   const cfg = STAGES[stage];
// // //   let layout = session.layout;
// // //   const item = layout.find((i) => i.id === itemId);
// // //   if (!item || item.hidden) return bad(res, 400, 'invalid_move', 'That item cannot be picked');

// // //   /* ----- wrong pick (the tomato, screen 3 only) ----- */
// // //   if (item.kind !== cfg.target) {
// // //     if (cfg.rearrange) layout = reshuffle(layout);   // screen 3: everything moves
// // //     await L5.recordPick(sessionId, stage, itemId, item.kind, false, cfg.rearrange);
// // //     await L5.saveLayout(sessionId, layout, stage);

// // //     return res.json({
// // //       success: true,
// // //       correct: false,
// // //       completed: false,
// // //       stageDone: false,
// // //       itemId,
// // //       reshuffled: cfg.rearrange,
// // //       wrongAttempts: Number(session.wrong_attempts) + 1,
// // //       message: WRONG[item.kind],
// // //       ...stageView(stage, layout),
// // //     });
// // //   }

// // //   /* ----- right pick (an apple): it hides ----- */
// // //   item.hidden = true;
// // //   await L5.recordPick(sessionId, stage, itemId, item.kind, true, false);

// // //   if (remaining(layout, stage) > 0) {
// // //     await L5.saveLayout(sessionId, layout, stage);
// // //     return res.json({
// // //       success: true, correct: true, completed: false, stageDone: false, itemId,
// // //       message: 'Good! Keep going.',
// // //       ...stageView(stage, layout),
// // //     });
// // //   }

// // //   /* ----- screen finished -> next screen ----- */
// // //   if (stage < LAST_STAGE) {
// // //     const next = stage + 1;
// // //     const fresh = buildLayout(next);
// // //     await L5.saveLayout(sessionId, fresh, next);
// // //     return res.json({
// // //       success: true, correct: true, completed: false, stageDone: true, itemId,
// // //       message: cfg.right,
// // //       ...stageView(next, fresh),
// // //     });
// // //   }

// // //   /* ----- level finished (only after screen 3) ----- */
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
// // //     message: cfg.right,
// // //     score, stars, attempts, progressSaved,
// // //     ...stageView(stage, layout),
// // //   });
// // // }));

// // // /* ---------------- POST /hint ---------------- */

// // // r.post('/hint', handle(async (req, res) => {
// // //   const sessionId = toId(req.body && req.body.sessionId);
// // //   const playerId = toId(req.body && req.body.playerId);
// // //   if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

// // //   const session = await L5.getSession(sessionId, playerId);
// // //   if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

// // //   const stage = Number(session.stage);
// // //   const target = session.layout.find((i) => i.kind === STAGES[stage].target && !i.hidden);
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

// // // target = what the player must tap (always the apples).
// // // Screen 1: 12 apples, no tomato
// // // Screen 2: 8 apples, no tomato
// // // Screen 3: 8 apples + 1 tomato (trap). Tapping the tomato = wrong + the WHOLE screen
// // //           resets (tapped apples come back) and everything is rearranged.
// // const STAGES = {
// //   1: { title: 'Find the apples!', hint: 'Tap every apple', target: 'apple', apple: 12, tomato: 0,
// //        rearrange: false, right: 'Nice! Now look carefully...' },
// //   2: { title: 'Find the apples!', hint: 'Tap every apple', target: 'apple', apple: 8, tomato: 0,
// //        rearrange: false, right: 'Sharp eyes! One more screen.' },
// //   3: { title: 'Find the apples!', hint: 'Tap every apple, but not the tomato!', target: 'apple', apple: 8, tomato: 1,
// //        rearrange: true, right: 'You found all the apples!' },
// // };

// // const totalFor = (stage) => STAGES[stage].apple + STAGES[stage].tomato;

// // const WRONG = {
// //   apple: 'That is an apple, not a tomato!',
// //   tomato: 'That is a tomato, not an apple!',
// // };

// // /* ---------------- random scattered positions ---------------- */

// // // minimum gap between two items (as a fraction of the board width / height)
// // const MINX = 0.15;
// // const MINY = 0.2;

// // const shuffle = (arr) => {
// //   const a = arr.slice();
// //   for (let i = a.length - 1; i > 0; i--) {
// //     const j = Math.floor(Math.random() * (i + 1));
// //     [a[i], a[j]] = [a[j], a[i]];
// //   }
// //   return a;
// // };

// // // n random points over the whole board, no two too close (so nothing overlaps)
// // const genPoints = (n) => {
// //   let k = 1;
// //   for (let round = 0; round < 60; round++) {
// //     for (let t = 0; t < 40; t++) {
// //       const pts = [];
// //       let tries = 0;
// //       while (pts.length < n && tries < 4000) {
// //         tries++;
// //         const x = 0.09 + Math.random() * 0.82;
// //         const y = 0.1 + Math.random() * 0.8;
// //         const ok = pts.every((p) =>
// //           Math.pow((p.x - x) / (MINX * k), 2) + Math.pow((p.y - y) / (MINY * k), 2) >= 1);
// //         if (ok) pts.push({ x, y });
// //       }
// //       if (pts.length === n) return pts;
// //     }
// //     k *= 0.97;   // board too crowded -> allow slightly smaller gaps and try again
// //   }
// //   // safety fallback: loose jittered grid
// //   const out = [];
// //   const cols = 4, rows = Math.ceil(n / cols);
// //   for (let i = 0; i < n; i++) {
// //     out.push({
// //       x: 0.12 + ((i % cols) + Math.random() * 0.4) * (0.76 / cols),
// //       y: 0.12 + (Math.floor(i / cols) + Math.random() * 0.4) * (0.76 / rows),
// //     });
// //   }
// //   return out;
// // };

// // const randRot = () => Math.round(Math.random() * 60 - 30);

// // /* ---------------- layout helpers ---------------- */

// // const buildLayout = (stage) => {
// //   const s = STAGES[stage];
// //   const kinds = shuffle([
// //     ...Array(s.apple).fill('apple'),
// //     ...Array(s.tomato).fill('tomato'),
// //   ]);
// //   const pts = genPoints(kinds.length);
// //   return kinds.map((kind, i) => ({
// //     id: i + 1, kind, hidden: false,
// //     x: pts[i].x, y: pts[i].y, rot: randRot(),
// //   }));
// // };

// // // every item (including apples already tapped) comes back with a brand new random place
// // const reshuffle = (layout) => {
// //   const pts = genPoints(layout.length);
// //   return layout.map((i, k) => ({
// //     ...i,
// //     hidden: false,              // tapped apples come back
// //     x: pts[k].x, y: pts[k].y, rot: randRot(),
// //   }));
// // };

// // const itemsView = (layout) =>
// //   layout.map((i) => ({
// //     id: i.id, kind: i.kind, hidden: !!i.hidden,
// //     x: i.x, y: i.y, rot: i.rot,
// //   }));

// // const remaining = (layout, stage) =>
// //   layout.filter((i) => i.kind === STAGES[stage].target && !i.hidden).length;

// // const stageView = (stage, layout) => ({
// //   stage,
// //   totalStages: LAST_STAGE,
// //   title: STAGES[stage].title,
// //   hint: STAGES[stage].hint,
// //   target: STAGES[stage].target,
// //   remaining: remaining(layout, stage),
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

// // /* ---------------- POST /start ---------------- */

// // r.post('/start', handle(async (req, res) => {
// //   const playerId = toId(req.body && req.body.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   let session = await L5.findActive(playerId);
// //   // old sessions (old counts / old layout) are closed and a fresh one is made
// //   if (session) {
// //     const st = Number(session.stage);
// //     const okStage = STAGES[st];
// //     const okLayout = okStage &&
// //       session.layout.length === totalFor(st) &&
// //       session.layout.filter((i) => i.kind === 'tomato').length === STAGES[st].tomato &&
// //       session.layout.every((i) =>
// //         (i.kind === 'apple' || i.kind === 'tomato') &&
// //         typeof i.x === 'number' && typeof i.y === 'number');
// //     if (!okLayout) {
// //       await L5.completeSession(session.id);
// //       session = null;
// //     }
// //   }
// //   if (!session) session = await L5.createSession(playerId, buildLayout(1));

// //   res.json({
// //     success: true,
// //     sessionId: session.id,
// //     level: L5.LEVEL,
// //     status: session.status,
// //     ...stageView(Number(session.stage), session.layout),
// //   });
// // }));

// // /* ---------------- POST /pick ---------------- */

// // r.post('/pick', handle(async (req, res) => {
// //   const sessionId = toId(req.body && req.body.sessionId);
// //   const playerId = toId(req.body && req.body.playerId);
// //   const itemId = toId(req.body && req.body.itemId);
// //   if (!sessionId || !playerId || !itemId) return bad(res, 400, 'ids_required', 'sessionId, playerId and itemId are required');

// //   const session = await L5.getSession(sessionId, playerId);
// //   if (!session) return bad(res, 404, 'no_session', 'Session not found');
// //   if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

// //   const stage = Number(session.stage);
// //   const cfg = STAGES[stage];
// //   let layout = session.layout;
// //   const item = layout.find((i) => i.id === itemId);
// //   if (!item || item.hidden) return bad(res, 400, 'invalid_move', 'That item cannot be picked');

// //   /* ----- wrong pick (the tomato, screen 3 only) ----- */
// //   if (item.kind !== cfg.target) {
// //     // screen 3: full reset -> all 8 apples + tomato come back in new places
// //     if (cfg.rearrange) layout = reshuffle(layout);
// //     await L5.recordPick(sessionId, stage, itemId, item.kind, false, cfg.rearrange);
// //     await L5.saveLayout(sessionId, layout, stage);

// //     return res.json({
// //       success: true,
// //       correct: false,
// //       completed: false,
// //       stageDone: false,
// //       itemId,
// //       reshuffled: cfg.rearrange,
// //       wrongAttempts: Number(session.wrong_attempts) + 1,
// //       message: WRONG[item.kind],
// //       ...stageView(stage, layout),
// //     });
// //   }

// //   /* ----- right pick (an apple): it hides ----- */
// //   item.hidden = true;
// //   await L5.recordPick(sessionId, stage, itemId, item.kind, true, false);

// //   if (remaining(layout, stage) > 0) {
// //     await L5.saveLayout(sessionId, layout, stage);
// //     return res.json({
// //       success: true, correct: true, completed: false, stageDone: false, itemId,
// //       message: 'Good! Keep going.',
// //       ...stageView(stage, layout),
// //     });
// //   }

// //   /* ----- screen finished -> next screen ----- */
// //   if (stage < LAST_STAGE) {
// //     const next = stage + 1;
// //     const fresh = buildLayout(next);
// //     await L5.saveLayout(sessionId, fresh, next);
// //     return res.json({
// //       success: true, correct: true, completed: false, stageDone: true, itemId,
// //       message: cfg.right,
// //       ...stageView(next, fresh),
// //     });
// //   }

// //   /* ----- level finished (only after screen 3) ----- */
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
// //     message: cfg.right,
// //     score, stars, attempts, progressSaved,
// //     ...stageView(stage, layout),
// //   });
// // }));

// // /* ---------------- POST /hint ---------------- */

// // r.post('/hint', handle(async (req, res) => {
// //   const sessionId = toId(req.body && req.body.sessionId);
// //   const playerId = toId(req.body && req.body.playerId);
// //   if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

// //   const session = await L5.getSession(sessionId, playerId);
// //   if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

// //   const stage = Number(session.stage);
// //   const target = session.layout.find((i) => i.kind === STAGES[stage].target && !i.hidden);
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

// // target = what the player must tap (always the apples).
// // Screen 1: 12 apples, no tomato
// // Screen 2: 8 apples, no tomato
// // Screen 3: 8 apples + 1 tomato (trap). Tapping the tomato = wrong + the WHOLE screen
// //           resets (tapped apples come back) and everything is rearranged.
// const STAGES = {
//   1: { title: 'Find the apples!', hint: 'Tap every apple', target: 'apple', apple: 12, tomato: 0,
//        rearrange: false, right: 'Nice! Now look carefully...' },
//   2: { title: 'Find the apples!', hint: 'Tap every apple', target: 'apple', apple: 8, tomato: 0,
//        rearrange: false, right: 'Sharp eyes! One more screen.' },
//   3: { title: 'Find the apples!', hint: 'Tap every apple, but not the tomato!', target: 'apple', apple: 8, tomato: 1,
//        rearrange: true, right: 'You found all the apples!' },
// };

// // clue text per screen (the frontend only displays what the backend sends)
// const CLUES = {
//   1: 'Apples have a little brown stem and a green leaf. The tomato has a star-shaped green top!',
//   2: 'Apples have a little brown stem and a green leaf. The tomato has a star-shaped green top!',
//   3: 'Careful! The tomato is a little wider and has a star-shaped green top. A wrong tap shuffles everything!',
// };

// const totalFor = (stage) => STAGES[stage].apple + STAGES[stage].tomato;

// const WRONG = {
//   apple: 'That is an apple, not a tomato!',
//   tomato: 'That is a tomato, not an apple!',
// };

// /* ---------------- random scattered positions ---------------- */

// // minimum gap between two items (as a fraction of the board width / height)
// const MINX = 0.15;
// const MINY = 0.2;

// const shuffle = (arr) => {
//   const a = arr.slice();
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// };

// // n random points over the whole board, no two too close (so nothing overlaps)
// const genPoints = (n) => {
//   let k = 1;
//   for (let round = 0; round < 60; round++) {
//     for (let t = 0; t < 40; t++) {
//       const pts = [];
//       let tries = 0;
//       while (pts.length < n && tries < 4000) {
//         tries++;
//         const x = 0.09 + Math.random() * 0.82;
//         const y = 0.1 + Math.random() * 0.8;
//         const ok = pts.every((p) =>
//           Math.pow((p.x - x) / (MINX * k), 2) + Math.pow((p.y - y) / (MINY * k), 2) >= 1);
//         if (ok) pts.push({ x, y });
//       }
//       if (pts.length === n) return pts;
//     }
//     k *= 0.97;   // board too crowded -> allow slightly smaller gaps and try again
//   }
//   // safety fallback: loose jittered grid
//   const out = [];
//   const cols = 4, rows = Math.ceil(n / cols);
//   for (let i = 0; i < n; i++) {
//     out.push({
//       x: 0.12 + ((i % cols) + Math.random() * 0.4) * (0.76 / cols),
//       y: 0.12 + (Math.floor(i / cols) + Math.random() * 0.4) * (0.76 / rows),
//     });
//   }
//   return out;
// };

// const randRot = () => Math.round(Math.random() * 60 - 30);

// /* ---------------- layout helpers ---------------- */

// const buildLayout = (stage) => {
//   const s = STAGES[stage];
//   const kinds = shuffle([
//     ...Array(s.apple).fill('apple'),
//     ...Array(s.tomato).fill('tomato'),
//   ]);
//   const pts = genPoints(kinds.length);
//   return kinds.map((kind, i) => ({
//     id: i + 1, kind, hidden: false,
//     x: pts[i].x, y: pts[i].y, rot: randRot(),
//   }));
// };

// // every item (including apples already tapped) comes back with a brand new random place
// const reshuffle = (layout) => {
//   const pts = genPoints(layout.length);
//   return layout.map((i, k) => ({
//     ...i,
//     hidden: false,              // tapped apples come back
//     x: pts[k].x, y: pts[k].y, rot: randRot(),
//   }));
// };

// const itemsView = (layout) =>
//   layout.map((i) => ({
//     id: i.id, kind: i.kind, hidden: !!i.hidden,
//     x: i.x, y: i.y, rot: i.rot,
//   }));

// const remaining = (layout, stage) =>
//   layout.filter((i) => i.kind === STAGES[stage].target && !i.hidden).length;

// const stageView = (stage, layout, clueUsed = false) => ({
//   stage,
//   totalStages: LAST_STAGE,
//   title: STAGES[stage].title,
//   hint: STAGES[stage].hint,
//   target: STAGES[stage].target,
//   remaining: remaining(layout, stage),
//   clueUsed,
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
//   // old sessions (old counts / old layout) are closed and a fresh one is made
//   if (session) {
//     const st = Number(session.stage);
//     const okStage = STAGES[st];
//     const okLayout = okStage &&
//       session.layout.length === totalFor(st) &&
//       session.layout.filter((i) => i.kind === 'tomato').length === STAGES[st].tomato &&
//       session.layout.every((i) =>
//         (i.kind === 'apple' || i.kind === 'tomato') &&
//         typeof i.x === 'number' && typeof i.y === 'number');
//     if (!okLayout) {
//       await L5.completeSession(session.id);
//       session = null;
//     }
//   }
//   if (!session) session = await L5.createSession(playerId, buildLayout(1));

//   const stg = Number(session.stage);
//   res.json({
//     success: true,
//     sessionId: session.id,
//     level: L5.LEVEL,
//     status: session.status,
//     ...stageView(stg, session.layout, await L5.hasHint(session.id, stg)),
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
//   const clueUsed = await L5.hasHint(sessionId, stage);
//   let layout = session.layout;
//   const item = layout.find((i) => i.id === itemId);
//   if (!item || item.hidden) return bad(res, 400, 'invalid_move', 'That item cannot be picked');

//   /* ----- wrong pick (the tomato, screen 3 only) ----- */
//   if (item.kind !== cfg.target) {
//     // screen 3: full reset -> all 8 apples + tomato come back in new places
//     if (cfg.rearrange) layout = reshuffle(layout);
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
//       ...stageView(stage, layout, clueUsed),
//     });
//   }

//   /* ----- right pick (an apple): it hides ----- */
//   item.hidden = true;
//   await L5.recordPick(sessionId, stage, itemId, item.kind, true, false);

//   if (remaining(layout, stage) > 0) {
//     await L5.saveLayout(sessionId, layout, stage);
//     return res.json({
//       success: true, correct: true, completed: false, stageDone: false, itemId,
//       message: 'Good! Keep going.',
//       ...stageView(stage, layout, clueUsed),
//     });
//   }

//   /* ----- screen finished -> next screen (fresh clue) ----- */
//   if (stage < LAST_STAGE) {
//     const next = stage + 1;
//     const fresh = buildLayout(next);
//     await L5.saveLayout(sessionId, fresh, next);
//     return res.json({
//       success: true, correct: true, completed: false, stageDone: true, itemId,
//       message: cfg.right,
//       ...stageView(next, fresh, false),
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
//     ...stageView(stage, layout, clueUsed),
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

//   const already = async () => res.json({
//     success: true, itemId: target.id, hints: await L5.getHints(playerId),
//     cost: 0, alreadyUsed: true, clue: CLUES[stage],
//   });

//   // clue already bought for this stage -> free
//   if (await L5.hasHint(sessionId, stage)) return already();

//   // claim first (unique key stops double-charging on double taps)
//   const claimed = await L5.claimHint(sessionId, playerId, stage, HINT_COST);
//   if (!claimed) return already();

//   const hints = await L5.spendHints(playerId, HINT_COST);
//   if (hints === null) {
//     await L5.releaseHint(sessionId, stage);   // not enough hints -> undo
//     return bad(res, 402, 'not_enough_hints', 'Not enough hints');
//   }

//   res.json({ success: true, itemId: target.id, hints, cost: HINT_COST, alreadyUsed: false, clue: CLUES[stage] });
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

// target = what the player must tap (always the apples).
// Screen 1: 12 apples, no tomato
// Screen 2: 8 apples, no tomato
// Screen 3: 8 apples + 1 tomato (trap). Tapping the tomato = wrong + the WHOLE screen
//           resets (tapped apples come back) and everything is rearranged.
const STAGES = {
  1: { title: 'Tap the apples', hint: 'Tap every apple', target: 'apple', apple: 12, tomato: 0,
       rearrange: false, right: 'Nice! Now look carefully...' },
  2: { title: 'Tap the apples', hint: 'Tap every apple', target: 'apple', apple: 8, tomato: 0,
       rearrange: false, right: 'Sharp eyes! One more screen.' },
  3: { title: 'Tap the apples', hint: 'Tap every apple, but not the tomato!', target: 'apple', apple: 8, tomato: 1,
       rearrange: true, right: 'You found all the apples!' },
};

// clue text per screen (the frontend only displays what the backend sends)
const CLUES = {
  1: 'Choose the apple carefully to win the game',
  2: 'Choose the apple carefully to win the game',
  3: 'Choose the apple carefully to win the game',
};

const totalFor = (stage) => STAGES[stage].apple + STAGES[stage].tomato;

const WRONG = {
  apple: 'That is an apple, not a tomato!',
  tomato: 'That is a tomato, not an apple!',
};

/* ---------------- random scattered positions ---------------- */

// minimum gap between two items (as a fraction of the board width / height)
const MINX = 0.15;
const MINY = 0.2;

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
        const x = 0.09 + Math.random() * 0.82;
        const y = 0.1 + Math.random() * 0.8;
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
  const cols = 4, rows = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) {
    out.push({
      x: 0.12 + ((i % cols) + Math.random() * 0.4) * (0.76 / cols),
      y: 0.12 + (Math.floor(i / cols) + Math.random() * 0.4) * (0.76 / rows),
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

// every item (including apples already tapped) comes back with a brand new random place
const reshuffle = (layout) => {
  const pts = genPoints(layout.length);
  return layout.map((i, k) => ({
    ...i,
    hidden: false,              // tapped apples come back
    x: pts[k].x, y: pts[k].y, rot: randRot(),
  }));
};

const itemsView = (layout) =>
  layout.map((i) => ({
    id: i.id, kind: i.kind, hidden: !!i.hidden,
    x: i.x, y: i.y, rot: i.rot,
  }));

const remaining = (layout, stage) =>
  layout.filter((i) => i.kind === STAGES[stage].target && !i.hidden).length;

const stageView = (stage, layout, clueUsed = false) => ({
  stage,
  totalStages: LAST_STAGE,
  title: STAGES[stage].title,
  hint: STAGES[stage].hint,
  target: STAGES[stage].target,
  remaining: remaining(layout, stage),
  clueUsed,
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
  // old sessions (old counts / old layout) are closed and a fresh one is made
  if (session) {
    const st = Number(session.stage);
    const okStage = STAGES[st];
    const okLayout = okStage &&
      session.layout.length === totalFor(st) &&
      session.layout.filter((i) => i.kind === 'tomato').length === STAGES[st].tomato &&
      session.layout.every((i) =>
        (i.kind === 'apple' || i.kind === 'tomato') &&
        typeof i.x === 'number' && typeof i.y === 'number');
    if (!okLayout) {
      await L5.completeSession(session.id);
      session = null;
    }
  }
  if (!session) session = await L5.createSession(playerId, buildLayout(1));

  const stg = Number(session.stage);
  res.json({
    success: true,
    sessionId: session.id,
    level: L5.LEVEL,
    status: session.status,
    ...stageView(stg, session.layout, await L5.hasHint(session.id, stg)),
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
  const clueUsed = await L5.hasHint(sessionId, stage);
  let layout = session.layout;
  const item = layout.find((i) => i.id === itemId);
  if (!item || item.hidden) return bad(res, 400, 'invalid_move', 'That item cannot be picked');

  /* ----- wrong pick (the tomato, screen 3 only) ----- */
  if (item.kind !== cfg.target) {
    // screen 3: full reset -> all 8 apples + tomato come back in new places
    if (cfg.rearrange) layout = reshuffle(layout);
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
      ...stageView(stage, layout, clueUsed),
    });
  }

  /* ----- right pick (an apple): it hides ----- */
  item.hidden = true;
  await L5.recordPick(sessionId, stage, itemId, item.kind, true, false);

  if (remaining(layout, stage) > 0) {
    await L5.saveLayout(sessionId, layout, stage);
    return res.json({
      success: true, correct: true, completed: false, stageDone: false, itemId,
      message: 'Good! Keep going.',
      ...stageView(stage, layout, clueUsed),
    });
  }

  /* ----- screen finished -> next screen (fresh clue) ----- */
  if (stage < LAST_STAGE) {
    const next = stage + 1;
    const fresh = buildLayout(next);
    await L5.saveLayout(sessionId, fresh, next);
    return res.json({
      success: true, correct: true, completed: false, stageDone: true, itemId,
      message: cfg.right,
      ...stageView(next, fresh, false),
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
    ...stageView(stage, layout, clueUsed),
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

  const already = async () => res.json({
    success: true, itemId: target.id, hints: await L5.getHints(playerId),
    cost: 0, alreadyUsed: true, clue: CLUES[stage],
  });

  // clue already bought for this stage -> free
  if (await L5.hasHint(sessionId, stage)) return already();

  // claim first (unique key stops double-charging on double taps)
  const claimed = await L5.claimHint(sessionId, playerId, stage, HINT_COST);
  if (!claimed) return already();

  const hints = await L5.spendHints(playerId, HINT_COST);
  if (hints === null) {
    await L5.releaseHint(sessionId, stage);   // not enough hints -> undo
    return bad(res, 402, 'not_enough_hints', 'Not enough hints');
  }

  res.json({ success: true, itemId: target.id, hints, cost: HINT_COST, alreadyUsed: false, clue: CLUES[stage] });
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