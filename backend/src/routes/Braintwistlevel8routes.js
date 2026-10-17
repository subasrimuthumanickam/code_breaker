// // // backend/src/routes/Braintwistlevel8routes.js
// // // Brain Twist - LEVEL 8 routes: read the request, call level8Db.js, send JSON back.
// // //
// // // Puzzle: the room is dark. The player drags a spotlight around (scene is 300 x 240 units).
// // //   The parrot hides in one of the spots below (picked by the server, kept in MySQL).
// // //   When the middle of the spotlight is close enough to the parrot, the level is won.

// // const express = require('express');
// // const L8 = require('../data/level8Db');

// // const r = express.Router();

// // const LEVEL = L8.LEVEL;
// // const NEXT_LEVEL = LEVEL + 1;
// // const COST_HINT = 25;
// // const COST_SKIP = 50;
// // const REWARD_VIDEO = 75;

// // /* ---------------------------------------------------------
// //    PUZZLE  (the answer stays on the server)
// // --------------------------------------------------------- */

// // const SCENE = { w: 300, h: 240 };
// // const LIGHT_R = 34;     // radius of the spotlight, in scene units
// // const FOUND_DIST = 26;  // spotlight centre must be this close to the parrot
// // const START = { x: 150, y: 200 };

// // const SPOTS = {
// //   window: { x: 107, y: 72 },   // on the window sill
// //   lamp: { x: 176, y: 20 },     // on top of the lamp
// //   shelf: { x: 252, y: 100 },   // on the bookshelf
// //   plant: { x: 41, y: 158 },    // on the plant pot
// //   sofa: { x: 107, y: 92 },     // on the back of the sofa
// //   table: { x: 216, y: 166 },   // on the little table
// // };

// // const TITLE = 'Where is the parrot hiding?';

// // /* ---------------------------------------------------------
// //    HELPERS
// // --------------------------------------------------------- */

// // const handle = (fn) => async (req, res) => {
// //   try {
// //     await fn(req, res);
// //   } catch (err) {
// //     console.error('[BrainTwist L8 Error]', req.method, req.originalUrl, err);
// //     if (!res.headersSent) {
// //       res.status(500).json({ success: false, error: 'server_error', message: err.message });
// //     }
// //   }
// // };

// // const toId = (value) => {
// //   const n = Number(value);
// //   return Number.isInteger(n) && n > 0 ? n : null;
// // };

// // const bad = (res, status, error, message) =>
// //   res.status(status).json({ success: false, error, message });

// // const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
// // const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// // const pickSpot = () => {
// //   const names = Object.keys(SPOTS);
// //   const name = names[Math.floor(Math.random() * names.length)];
// //   return { name, ...SPOTS[name] };
// // };

// // // a point about one spotlight-radius away from the parrot: its edge peeks into the light
// // const hintPoint = (px, py) => {
// //   for (let i = 0; i < 24; i += 1) {
// //     const a = Math.random() * Math.PI * 2;
// //     const x = clamp(Math.round(px + Math.cos(a) * LIGHT_R), 10, SCENE.w - 10);
// //     const y = clamp(Math.round(py + Math.sin(a) * LIGHT_R), 10, SCENE.h - 10);
// //     const d = dist(x, y, px, py);
// //     if (d >= FOUND_DIST + 4 && d <= LIGHT_R + 2) return { x, y };
// //   }
// //   return { x: clamp(px + 30, 10, SCENE.w - 10), y: clamp(py + 30, 10, SCENE.h - 10) };
// // };

// // // score from the time taken (seconds since the level was opened)
// // const grade = (seconds) => {
// //   if (seconds <= 30) return { score: 300, stars: 3 };
// //   if (seconds <= 75) return { score: 200, stars: 2 };
// //   return { score: 100, stars: 1 };
// // };

// // // wait until the level 8 tables exist before any request runs
// // r.use(async (req, res, next) => {
// //   await L8.ready;
// //   next();
// // });

// // // shared checks for /look /hint /skip -> returns the open session or sends the error
// // const openSession = async (req, res) => {
// //   const sessionId = toId(req.body && req.body.sessionId);
// //   const playerId = toId(req.body && req.body.playerId);

// //   if (!sessionId || !playerId) {
// //     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
// //     return null;
// //   }

// //   const session = await L8.getSession(sessionId, playerId);
// //   if (!session) {
// //     bad(res, 404, 'no_session', 'Session not found');
// //     return null;
// //   }
// //   if (session.status !== 'in_progress') {
// //     bad(res, 409, 'already_completed', 'This level is already completed');
// //     return null;
// //   }

// //   return { session, sessionId, playerId };
// // };

// // // unlock level 9 - a failure here must never break the answer
// // const tryUnlock = async (playerId, attempts) => {
// //   try {
// //     await L8.unlockNext(playerId, attempts);
// //   } catch (err) {
// //     console.error('[BrainTwist L8] could not unlock next level:', err.message);
// //   }
// // };

// // /* ---------------------------------------------------------
// //    POST /start   body: { playerId }
// // --------------------------------------------------------- */

// // r.post('/start', handle(async (req, res) => {
// //   const playerId = toId(req.body && req.body.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const player = await L8.getPlayer(playerId);
// //   if (!player) return bad(res, 404, 'no_player', 'Player not found');

// //   let session = await L8.findActive(playerId);
// //   if (session) {
// //     await L8.restartTimer(session.id);
// //   } else {
// //     const spot = pickSpot();
// //     session = await L8.createSession(playerId, spot.name, spot.x, spot.y);
// //   }

// //   res.json({
// //     success: true,
// //     sessionId: session.id,
// //     level: LEVEL,
// //     status: session.status,
// //     title: TITLE,
// //     scene: SCENE,
// //     lightR: LIGHT_R,
// //     start: START,
// //     hints: Number(player.hints) || 0,
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /look   body: { sessionId, playerId, x, y }
// //    x, y = middle of the spotlight in scene units
// // --------------------------------------------------------- */

// // r.post('/look', handle(async (req, res) => {
// //   const x = Number(req.body && req.body.x);
// //   const y = Number(req.body && req.body.y);
// //   if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > SCENE.w || y < 0 || y > SCENE.h) {
// //     return bad(res, 400, 'invalid_position', 'x and y must be inside the room');
// //   }

// //   const ctx = await openSession(req, res);
// //   if (!ctx) return;
// //   const { session, sessionId, playerId } = ctx;

// //   const d = dist(x, y, Number(session.parrot_x), Number(session.parrot_y));
// //   const found = d <= FOUND_DIST;

// //   await L8.recordLook(sessionId, Math.round(x), Math.round(y), Math.round(d), found);

// //   if (!found) {
// //     return res.json({ success: true, found: false, completed: false });
// //   }

// //   const seconds = Number(session.elapsed) || 0;
// //   const { score, stars } = grade(seconds);
// //   const attempts = 1;

// //   await L8.completeSession(sessionId);

// //   let progressSaved = false;
// //   try {
// //     await L8.saveProgress(playerId, score, stars, attempts);
// //     progressSaved = true;
// //   } catch (err) {
// //     console.error('[BrainTwist L8] could not save progress:', err.message);
// //   }
// //   await tryUnlock(playerId, attempts);

// //   res.json({
// //     success: true,
// //     found: true,
// //     completed: true,
// //     message: 'You found the parrot!',
// //     parrot: { x: Number(session.parrot_x), y: Number(session.parrot_y), spot: session.spot },
// //     score,
// //     stars,
// //     attempts,
// //     seconds,
// //     progressSaved,
// //     next: NEXT_LEVEL,
// //     hints: await L8.getHints(playerId),
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /hint   body: { sessionId, playerId }   (costs 25 hints)
// //    moves the spotlight close to the parrot - its edge shows in the light
// // --------------------------------------------------------- */

// // r.post('/hint', handle(async (req, res) => {
// //   const ctx = await openSession(req, res);
// //   if (!ctx) return;
// //   const { session, sessionId, playerId } = ctx;

// //   const hints = await L8.spendHints(playerId, COST_HINT);
// //   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

// //   await L8.markHintUsed(sessionId);

// //   const point = hintPoint(Number(session.parrot_x), Number(session.parrot_y));
// //   res.json({ success: true, x: point.x, y: point.y, hints, cost: COST_HINT });
// // }));

// // /* ---------------------------------------------------------
// //    POST /skip   body: { sessionId, playerId }   (costs 50 hints)
// // --------------------------------------------------------- */

// // r.post('/skip', handle(async (req, res) => {
// //   const ctx = await openSession(req, res);
// //   if (!ctx) return;
// //   const { sessionId, playerId } = ctx;

// //   const hints = await L8.spendHints(playerId, COST_SKIP);
// //   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

// //   await L8.skipSession(sessionId);
// //   await tryUnlock(playerId, 0);

// //   res.json({
// //     success: true,
// //     found: true,
// //     completed: true,
// //     skipped: true,
// //     message: 'Level skipped!',
// //     score: 0,
// //     stars: 0,
// //     attempts: 1,
// //     next: NEXT_LEVEL,
// //     hints,
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
// // --------------------------------------------------------- */

// // r.post('/reward', handle(async (req, res) => {
// //   const playerId = toId(req.body && req.body.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
// //   if (!req.body || req.body.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

// //   const player = await L8.getPlayer(playerId);
// //   if (!player) return bad(res, 404, 'no_player', 'Player not found');

// //   const hints = await L8.addHints(playerId, REWARD_VIDEO);
// //   res.json({ success: true, added: REWARD_VIDEO, hints });
// // }));

// // /* ---------------------------------------------------------
// //    GET /status/:playerId
// // --------------------------------------------------------- */

// // r.get('/status/:playerId', handle(async (req, res) => {
// //   const playerId = toId(req.params.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const row = await L8.getProgress(playerId);

// //   res.json({
// //     success: true,
// //     level: LEVEL,
// //     completed: Boolean(row && row.is_completed),
// //     score: row ? Number(row.score) || 0 : 0,
// //     stars: row ? Number(row.stars) || 0 : 0,
// //     attempts: row ? Number(row.attempts) || 0 : 0,
// //     completedAt: row ? row.completed_at : null,
// //   });
// // }));

// // module.exports = r;
// const express = require('express');
// const L8 = require('../data/level8Db');

// const r = express.Router();

// const LEVEL = L8.LEVEL;
// const NEXT_LEVEL = LEVEL + 1;
// const COST_HINT = 25;
// const COST_SKIP = 50;
// const REWARD_VIDEO = 75;

// /* ---------------------------------------------------------
//    PUZZLE  (the answer stays on the server)
// --------------------------------------------------------- */

// const SCENE = { w: 300, h: 240 };
// const LIGHT_R = 32;     // radius of the spotlight, in scene units
// const SEEN_DIST = 26;   // parrot is shown to the player once the light centre is this close
// const TAP_DIST = 18;    // the player must TAP within this distance of the parrot to find it

// // same list as HIDE_SPOTS in Btlevel8art.tsx (centre of the parrot, scene units)
// const SPOTS = {
//   'bookshelf top': { x: 250, y: 23 },
//   'sofa back': { x: 107, y: 95 },
//   'window sill': { x: 108, y: 75 },
//   'plant': { x: 41, y: 111 },
//   'table': { x: 212, y: 163 },
//   'toy box': { x: 265, y: 175 },
//   'basket': { x: 104, y: 181 },
//   'floor lamp': { x: 176, y: 91 },
//   'picture frame': { x: 31, y: 31 },
//   'boxes': { x: 13, y: 167 },
//   'rug': { x: 150, y: 206 },
// };

// // places the spotlight can start from (the far ones from the parrot are used)
// const STARTS = [
//   { x: 150, y: 200 }, { x: 40, y: 205 }, { x: 260, y: 150 }, { x: 150, y: 60 },
//   { x: 60, y: 120 }, { x: 240, y: 210 }, { x: 25, y: 25 }, { x: 280, y: 30 },
// ];
// const MIN_START_DIST = 110;

// const TITLE = 'Where is the parrot hiding?';

// /* ---------------------------------------------------------
//    HELPERS
// --------------------------------------------------------- */

// const handle = (fn) => async (req, res) => {
//   try {
//     await fn(req, res);
//   } catch (err) {
//     console.error('[BrainTwist L8 Error]', req.method, req.originalUrl, err);
//     if (!res.headersSent) {
//       res.status(500).json({ success: false, error: 'server_error', message: err.message });
//     }
//   }
// };

// const toId = (value) => {
//   const n = Number(value);
//   return Number.isInteger(n) && n > 0 ? n : null;
// };

// const bad = (res, status, error, message) =>
//   res.status(status).json({ success: false, error, message });

// const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
// const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// // random hiding place, never the same as the last game
// const pickSpot = (lastName) => {
//   let names = Object.keys(SPOTS).filter((n) => n !== lastName);
//   if (!names.length) names = Object.keys(SPOTS);
//   const name = names[Math.floor(Math.random() * names.length)];
//   return { name, ...SPOTS[name] };
// };

// // a start point far away from the parrot
// const pickStart = (spot) => {
//   let far = STARTS.filter((s) => dist(s.x, s.y, spot.x, spot.y) >= MIN_START_DIST);
//   if (!far.length) far = STARTS;
//   return far[Math.floor(Math.random() * far.length)];
// };

// // a point close to the parrot, so it shows up inside the light
// const hintPoint = (px, py) => {
//   for (let i = 0; i < 24; i += 1) {
//     const a = Math.random() * Math.PI * 2;
//     const rad = 10 + Math.random() * 8;
//     const x = clamp(Math.round(px + Math.cos(a) * rad), 10, SCENE.w - 10);
//     const y = clamp(Math.round(py + Math.sin(a) * rad), 10, SCENE.h - 10);
//     const d = dist(x, y, px, py);
//     if (d >= 8 && d <= SEEN_DIST - 4) return { x, y };
//   }
//   return { x: clamp(px + 12, 10, SCENE.w - 10), y: clamp(py + 12, 10, SCENE.h - 10) };
// };

// // score from the time taken (seconds since the level was opened)
// const grade = (seconds) => {
//   if (seconds <= 45) return { score: 300, stars: 3 };
//   if (seconds <= 100) return { score: 200, stars: 2 };
//   return { score: 100, stars: 1 };
// };

// // wait until the level 8 tables exist before any request runs
// r.use(async (req, res, next) => {
//   await L8.ready;
//   next();
// });

// // shared checks for /look /hint /skip -> returns the open session or sends the error
// const openSession = async (req, res) => {
//   const sessionId = toId(req.body && req.body.sessionId);
//   const playerId = toId(req.body && req.body.playerId);

//   if (!sessionId || !playerId) {
//     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
//     return null;
//   }

//   const session = await L8.getSession(sessionId, playerId);
//   if (!session) {
//     bad(res, 404, 'no_session', 'Session not found');
//     return null;
//   }
//   if (session.status !== 'in_progress') {
//     bad(res, 409, 'already_completed', 'This level is already completed');
//     return null;
//   }

//   return { session, sessionId, playerId };
// };

// // unlock level 9 - a failure here must never break the answer
// const tryUnlock = async (playerId, attempts) => {
//   try {
//     await L8.unlockNext(playerId, attempts);
//   } catch (err) {
//     console.error('[BrainTwist L8] could not unlock next level:', err.message);
//   }
// };

// /* ---------------------------------------------------------
//    POST /start   body: { playerId }
//    EVERY time the level is opened: a new session, a new hiding place
// --------------------------------------------------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const player = await L8.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   const last = await L8.lastSpot(playerId);
//   await L8.abandonActive(playerId);

//   const spot = pickSpot(last);
//   const session = await L8.createSession(playerId, spot.name, spot.x, spot.y);
//   const start = pickStart(spot);

//   res.json({
//     success: true,
//     sessionId: session.id,
//     level: LEVEL,
//     status: session.status,
//     title: TITLE,
//     scene: SCENE,
//     lightR: LIGHT_R,
//     start,
//     hints: Number(player.hints) || 0,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /look   body: { sessionId, playerId, x, y, tap? }
//    tap false: x, y = middle of the spotlight. If the parrot is inside the light,
//               its position comes back as `seen` so the app can draw it.
//    tap true : x, y = the spot the player tapped. Found only when it is on the parrot.
// --------------------------------------------------------- */

// r.post('/look', handle(async (req, res) => {
//   const x = Number(req.body && req.body.x);
//   const y = Number(req.body && req.body.y);
//   const tap = Boolean(req.body && req.body.tap);
//   if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > SCENE.w || y < 0 || y > SCENE.h) {
//     return bad(res, 400, 'invalid_position', 'x and y must be inside the room');
//   }

//   const ctx = await openSession(req, res);
//   if (!ctx) return;
//   const { session, sessionId, playerId } = ctx;

//   const px = Number(session.parrot_x);
//   const py = Number(session.parrot_y);
//   const d = dist(x, y, px, py);
//   const found = tap && d <= TAP_DIST;

//   await L8.recordLook(sessionId, Math.round(x), Math.round(y), Math.round(d), found);

//   if (!found) {
//     // for a tap the light centre is unknown here, so only a move shows the parrot
//     const seen = !tap && d <= SEEN_DIST ? { x: px, y: py } : null;
//     return res.json({ success: true, found: false, completed: false, seen });
//   }

//   const seconds = Number(session.elapsed) || 0;
//   const { score, stars } = grade(seconds);
//   const attempts = 1;

//   await L8.completeSession(sessionId);

//   let progressSaved = false;
//   try {
//     await L8.saveProgress(playerId, score, stars, attempts);
//     progressSaved = true;
//   } catch (err) {
//     console.error('[BrainTwist L8] could not save progress:', err.message);
//   }
//   await tryUnlock(playerId, attempts);

//   res.json({
//     success: true,
//     found: true,
//     completed: true,
//     message: 'You found the parrot!',
//     parrot: { x: px, y: py, spot: session.spot },
//     score,
//     stars,
//     attempts,
//     seconds,
//     progressSaved,
//     next: NEXT_LEVEL,
//     hints: await L8.getHints(playerId),
//   });
// }));

// /* ---------------------------------------------------------
//    POST /hint   body: { sessionId, playerId }   (costs 25 hints)
//    moves the spotlight close to the parrot, so it shows in the light
// --------------------------------------------------------- */

// r.post('/hint', handle(async (req, res) => {
//   const ctx = await openSession(req, res);
//   if (!ctx) return;
//   const { session, sessionId, playerId } = ctx;

//   const hints = await L8.spendHints(playerId, COST_HINT);
//   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

//   await L8.markHintUsed(sessionId);

//   const point = hintPoint(Number(session.parrot_x), Number(session.parrot_y));
//   res.json({ success: true, x: point.x, y: point.y, hints, cost: COST_HINT });
// }));

// /* ---------------------------------------------------------
//    POST /skip   body: { sessionId, playerId }   (costs 50 hints)
// --------------------------------------------------------- */

// r.post('/skip', handle(async (req, res) => {
//   const ctx = await openSession(req, res);
//   if (!ctx) return;
//   const { sessionId, playerId } = ctx;

//   const hints = await L8.spendHints(playerId, COST_SKIP);
//   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

//   await L8.skipSession(sessionId);
//   await tryUnlock(playerId, 0);

//   res.json({
//     success: true,
//     found: true,
//     completed: true,
//     skipped: true,
//     message: 'Level skipped!',
//     score: 0,
//     stars: 0,
//     attempts: 1,
//     next: NEXT_LEVEL,
//     hints,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
// --------------------------------------------------------- */

// r.post('/reward', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
//   if (!req.body || req.body.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

//   const player = await L8.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   const hints = await L8.addHints(playerId, REWARD_VIDEO);
//   res.json({ success: true, added: REWARD_VIDEO, hints });
// }));

// /* ---------------------------------------------------------
//    GET /status/:playerId
// --------------------------------------------------------- */

// r.get('/status/:playerId', handle(async (req, res) => {
//   const playerId = toId(req.params.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const row = await L8.getProgress(playerId);

//   res.json({
//     success: true,
//     level: LEVEL,
//     completed: Boolean(row && row.is_completed),
//     score: row ? Number(row.score) || 0 : 0,
//     stars: row ? Number(row.stars) || 0 : 0,
//     attempts: row ? Number(row.attempts) || 0 : 0,
//     completedAt: row ? row.completed_at : null,
//   });
// }));

// module.exports = r;
const express = require('express');
const L8 = require('../data/level8Db');

const r = express.Router();

const LEVEL = L8.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_HINT = 25;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;

/* ---------------------------------------------------------
   PUZZLE  (the answer stays on the server)
--------------------------------------------------------- */

const SCENE = { w: 300, h: 240 };
const LIGHT_R = 26;     // radius of the spotlight, in scene units (small = harder)
const SEEN_DIST = 20;   // parrot is shown to the player once the light centre is this close
const TAP_DIST = 20;    // the player must TAP within this distance of the parrot to find it

// same list as HIDE_SPOTS in Btlevel8art.tsx (centre of the parrot, scene units)
const SPOTS = {
  'bookshelf top': { x: 250, y: 23 },
  'bookshelf row': { x: 252, y: 64 },
  'sofa back': { x: 107, y: 100 },
  'window sill': { x: 108, y: 75 },
  'curtain': { x: 158, y: 64 },
  'plant': { x: 41, y: 128 },
  'table': { x: 212, y: 170 },
  'toy box': { x: 265, y: 182 },
  'basket': { x: 104, y: 196 },
  'floor lamp': { x: 176, y: 96 },
  'picture frame': { x: 31, y: 31 },
  'boxes': { x: 13, y: 172 },
  'rug': { x: 136, y: 204 },
  'wall shelf': { x: 198, y: 77 },
  'coat hooks': { x: 22, y: 80 },
};

// places the spotlight can start from (the far ones from the parrot are used)
const STARTS = [
  { x: 150, y: 200 }, { x: 40, y: 205 }, { x: 260, y: 150 }, { x: 150, y: 60 },
  { x: 60, y: 120 }, { x: 240, y: 210 }, { x: 25, y: 25 }, { x: 280, y: 30 },
];
const MIN_START_DIST = 110;

const TITLE = 'Where is the parrot hiding?';

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L8 Error]', req.method, req.originalUrl, err);
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

const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// random hiding place, never the same as the last game
const pickSpot = (lastName) => {
  let names = Object.keys(SPOTS).filter((n) => n !== lastName);
  if (!names.length) names = Object.keys(SPOTS);
  const name = names[Math.floor(Math.random() * names.length)];
  return { name, ...SPOTS[name] };
};

// a start point far away from the parrot
const pickStart = (spot) => {
  let far = STARTS.filter((s) => dist(s.x, s.y, spot.x, spot.y) >= MIN_START_DIST);
  if (!far.length) far = STARTS;
  return far[Math.floor(Math.random() * far.length)];
};

// a point close to the parrot, so it shows up inside the light
const hintPoint = (px, py) => {
  for (let i = 0; i < 24; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const rad = 10 + Math.random() * 8;
    const x = clamp(Math.round(px + Math.cos(a) * rad), 10, SCENE.w - 10);
    const y = clamp(Math.round(py + Math.sin(a) * rad), 10, SCENE.h - 10);
    const d = dist(x, y, px, py);
    if (d >= 8 && d <= SEEN_DIST - 4) return { x, y };
  }
  return { x: clamp(px + 12, 10, SCENE.w - 10), y: clamp(py + 12, 10, SCENE.h - 10) };
};

// score from the time taken (seconds since the level was opened)
const grade = (seconds) => {
  if (seconds <= 45) return { score: 300, stars: 3 };
  if (seconds <= 100) return { score: 200, stars: 2 };
  return { score: 100, stars: 1 };
};

// wait until the level 8 tables exist before any request runs
r.use(async (req, res, next) => {
  await L8.ready;
  next();
});

// shared checks for /look /hint /skip -> returns the open session or sends the error
const openSession = async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await L8.getSession(sessionId, playerId);
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

// unlock level 9 - a failure here must never break the answer
const tryUnlock = async (playerId, attempts) => {
  try {
    await L8.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L8] could not unlock next level:', err.message);
  }
};

/* ---------------------------------------------------------
   POST /start   body: { playerId }
   EVERY time the level is opened: a new session, a new hiding place
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L8.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const last = await L8.lastSpot(playerId);
  await L8.abandonActive(playerId);

  const spot = pickSpot(last);
  const session = await L8.createSession(playerId, spot.name, spot.x, spot.y);
  const start = pickStart(spot);

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    title: TITLE,
    scene: SCENE,
    lightR: LIGHT_R,
    start,
    hints: Number(player.hints) || 0,
  });
}));

/* ---------------------------------------------------------
   POST /look   body: { sessionId, playerId, x, y, tap? }
   tap false: x, y = middle of the spotlight. If the parrot is inside the light,
              its position comes back as `seen` so the app can draw it.
   tap true : x, y = the spot the player tapped. Found only when it is on the parrot.
--------------------------------------------------------- */

r.post('/look', handle(async (req, res) => {
  const x = Number(req.body && req.body.x);
  const y = Number(req.body && req.body.y);
  const tap = Boolean(req.body && req.body.tap);
  if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > SCENE.w || y < 0 || y > SCENE.h) {
    return bad(res, 400, 'invalid_position', 'x and y must be inside the room');
  }

  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const px = Number(session.parrot_x);
  const py = Number(session.parrot_y);
  const d = dist(x, y, px, py);
  const found = tap && d <= TAP_DIST;

  await L8.recordLook(sessionId, Math.round(x), Math.round(y), Math.round(d), found);

  if (!found) {
    // for a tap the light centre is unknown here, so only a move shows the parrot
    const seen = !tap && d <= SEEN_DIST ? { x: px, y: py } : null;
    return res.json({ success: true, found: false, completed: false, seen });
  }

  const seconds = Number(session.elapsed) || 0;
  const { score, stars } = grade(seconds);
  const attempts = 1;

  await L8.completeSession(sessionId);

  let progressSaved = false;
  try {
    await L8.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L8] could not save progress:', err.message);
  }
  await tryUnlock(playerId, attempts);

  res.json({
    success: true,
    found: true,
    completed: true,
    message: 'You found the parrot!',
    parrot: { x: px, y: py, spot: session.spot },
    score,
    stars,
    attempts,
    seconds,
    progressSaved,
    next: NEXT_LEVEL,
    hints: await L8.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /hint   body: { sessionId, playerId }   (costs 25 hints)
   moves the spotlight close to the parrot, so it shows in the light
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const hints = await L8.spendHints(playerId, COST_HINT);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L8.markHintUsed(sessionId);

  const point = hintPoint(Number(session.parrot_x), Number(session.parrot_y));
  res.json({ success: true, x: point.x, y: point.y, hints, cost: COST_HINT });
}));

/* ---------------------------------------------------------
   POST /skip   body: { sessionId, playerId }   (costs 50 hints)
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { sessionId, playerId } = ctx;

  const hints = await L8.spendHints(playerId, COST_SKIP);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L8.skipSession(sessionId);
  await tryUnlock(playerId, 0);

  res.json({
    success: true,
    found: true,
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

  const player = await L8.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const hints = await L8.addHints(playerId, REWARD_VIDEO);
  res.json({ success: true, added: REWARD_VIDEO, hints });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await L8.getProgress(playerId);

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