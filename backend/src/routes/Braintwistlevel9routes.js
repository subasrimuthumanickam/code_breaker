// // const express = require('express');
// // const L9 = require('../data/level9Db');

// // const r = express.Router();

// // const LEVEL = L9.LEVEL;
// // const NEXT_LEVEL = LEVEL + 1;
// // const COST_HINT = 25;
// // const COST_SKIP = 50;
// // const REWARD_VIDEO = 75;

// // /* ---------------------------------------------------------
// //    MAZE  (built on the server from a random seed, the player only gets the walls)
// // --------------------------------------------------------- */

// // const COLS = 9;
// // const ROWS = 9;
// // const START = 0;                    // top-left: the dog
// // const GOAL = COLS * ROWS - 1;       // bottom-right: the dog house + the bone
// // const HINT_LENGTH = 8;              // how many cells the magnifier shows

// // const TITLE = 'Help the dog find the bone!';

// // // open sides of a cell: 1 = up, 2 = right, 4 = down, 8 = left
// // const OPEN_N = 1;
// // const OPEN_E = 2;
// // const OPEN_S = 4;
// // const OPEN_W = 8;
// // const DIRS = [
// //   { bit: OPEN_N, back: OPEN_S, dx: 0, dy: -1 },
// //   { bit: OPEN_E, back: OPEN_W, dx: 1, dy: 0 },
// //   { bit: OPEN_S, back: OPEN_N, dx: 0, dy: 1 },
// //   { bit: OPEN_W, back: OPEN_E, dx: -1, dy: 0 },
// // ];

// // // small seeded random generator: the same seed always gives the same maze
// // const mulberry32 = (seed) => {
// //   let a = seed | 0;
// //   return () => {
// //     a = (a + 0x6d2b79f5) | 0;
// //     let t = Math.imul(a ^ (a >>> 15), 1 | a);
// //     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
// //     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
// //   };
// // };

// // // depth-first maze: every cell can be reached, there is exactly one way from START to GOAL
// // const buildMaze = (seed, cols, rows) => {
// //   const rnd = mulberry32(seed);
// //   const cells = new Array(cols * rows).fill(0);
// //   const seen = new Array(cols * rows).fill(false);
// //   const stack = [START];
// //   seen[START] = true;

// //   while (stack.length) {
// //     const cur = stack[stack.length - 1];
// //     const cx = cur % cols;
// //     const cy = Math.floor(cur / cols);
// //     const options = DIRS.filter((d) => {
// //       const nx = cx + d.dx;
// //       const ny = cy + d.dy;
// //       return nx >= 0 && ny >= 0 && nx < cols && ny < rows && !seen[ny * cols + nx];
// //     });

// //     if (!options.length) {
// //       stack.pop();
// //       continue;
// //     }

// //     const d = options[Math.floor(rnd() * options.length)];
// //     const next = (cy + d.dy) * cols + cx + d.dx;
// //     cells[cur] |= d.bit;
// //     cells[next] |= d.back;
// //     seen[next] = true;
// //     stack.push(next);
// //   }

// //   return cells;
// // };

// // // shortest way from one cell to another (breadth-first search)
// // const solve = (cells, cols, from, to) => {
// //   const prev = new Array(cells.length).fill(-2);
// //   const queue = [from];
// //   prev[from] = -1;

// //   while (queue.length) {
// //     const cur = queue.shift();
// //     if (cur === to) break;
// //     const cx = cur % cols;
// //     const cy = Math.floor(cur / cols);
// //     DIRS.forEach((d) => {
// //       if (!(cells[cur] & d.bit)) return;
// //       const next = (cy + d.dy) * cols + cx + d.dx;
// //       if (prev[next] === -2) {
// //         prev[next] = cur;
// //         queue.push(next);
// //       }
// //     });
// //   }

// //   const path = [];
// //   for (let c = to; c !== -1 && c !== -2; c = prev[c]) path.push(c);
// //   return path.reverse();
// // };

// // // the walked path must start at the dog, end at the bone and only use open sides
// // const validPath = (cells, cols, rows, path) => {
// //   if (!Array.isArray(path) || path.length < 2 || path.length > cols * rows * 3) return false;
// //   if (path.some((c) => !Number.isInteger(c) || c < 0 || c >= cols * rows)) return false;
// //   if (path[0] !== START || path[path.length - 1] !== GOAL) return false;

// //   for (let i = 1; i < path.length; i += 1) {
// //     const a = path[i - 1];
// //     const b = path[i];
// //     const dx = (b % cols) - (a % cols);
// //     const dy = Math.floor(b / cols) - Math.floor(a / cols);
// //     const step = DIRS.find((d) => d.dx === dx && d.dy === dy);
// //     if (!step || !(cells[a] & step.bit)) return false;
// //   }
// //   return true;
// // };

// // // score from the time taken (seconds since the maze was made)
// // const grade = (seconds) => {
// //   if (seconds <= 45) return { score: 300, stars: 3 };
// //   if (seconds <= 100) return { score: 200, stars: 2 };
// //   return { score: 100, stars: 1 };
// // };

// // /* ---------------------------------------------------------
// //    HELPERS
// // --------------------------------------------------------- */

// // const handle = (fn) => async (req, res) => {
// //   try {
// //     await fn(req, res);
// //   } catch (err) {
// //     console.error('[BrainTwist L9 Error]', req.method, req.originalUrl, err);
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

// // // wait until the level 9 tables exist before any request runs
// // r.use(async (req, res, next) => {
// //   await L9.ready;
// //   next();
// // });

// // // shared checks for /hint /finish /skip -> returns the open session or sends the error
// // const openSession = async (req, res) => {
// //   const sessionId = toId(req.body && req.body.sessionId);
// //   const playerId = toId(req.body && req.body.playerId);

// //   if (!sessionId || !playerId) {
// //     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
// //     return null;
// //   }

// //   const session = await L9.getSession(sessionId, playerId);
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

// // // unlock level 10 - a failure here must never break the answer
// // const tryUnlock = async (playerId, attempts) => {
// //   try {
// //     await L9.unlockNext(playerId, attempts);
// //   } catch (err) {
// //     console.error('[BrainTwist L9] could not unlock next level:', err.message);
// //   }
// // };

// // /* ---------------------------------------------------------
// //    POST /start   body: { playerId }
// //    EVERY time the level is opened: a new session and a new maze
// // --------------------------------------------------------- */

// // r.post('/start', handle(async (req, res) => {
// //   const playerId = toId(req.body && req.body.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const player = await L9.getPlayer(playerId);
// //   if (!player) return bad(res, 404, 'no_player', 'Player not found');

// //   await L9.abandonActive(playerId);

// //   const seed = Math.floor(Math.random() * 2147483646) + 1;
// //   const session = await L9.createSession(playerId, seed, COLS, ROWS);

// //   res.json({
// //     success: true,
// //     sessionId: session.id,
// //     level: LEVEL,
// //     status: session.status,
// //     title: TITLE,
// //     cols: COLS,
// //     rows: ROWS,
// //     cells: buildMaze(seed, COLS, ROWS),
// //     start: START,
// //     goal: GOAL,
// //     hints: Number(player.hints) || 0,
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /finish   body: { sessionId, playerId, path, moves }
// //    path = the cells the dog walked. The server checks it against the maze.
// // --------------------------------------------------------- */

// // r.post('/finish', handle(async (req, res) => {
// //   const ctx = await openSession(req, res);
// //   if (!ctx) return;
// //   const { session, sessionId, playerId } = ctx;

// //   const cols = Number(session.cols);
// //   const rows = Number(session.rows);
// //   const cells = buildMaze(Number(session.seed), cols, rows);
// //   const path = req.body && req.body.path;

// //   if (!validPath(cells, cols, rows, path)) {
// //     return bad(res, 400, 'bad_path', 'That path does not lead through the maze to the bone');
// //   }

// //   const moves = path.length - 1;
// //   const seconds = Number(session.elapsed) || 0;
// //   const { score, stars } = grade(seconds);
// //   const attempts = 1;

// //   await L9.completeSession(sessionId, playerId, moves, seconds, JSON.stringify(path));

// //   let progressSaved = false;
// //   try {
// //     await L9.saveProgress(playerId, score, stars, attempts);
// //     progressSaved = true;
// //   } catch (err) {
// //     console.error('[BrainTwist L9] could not save progress:', err.message);
// //   }
// //   await tryUnlock(playerId, attempts);

// //   res.json({
// //     success: true,
// //     completed: true,
// //     message: 'Yum! The dog found the bone!',
// //     score,
// //     stars,
// //     attempts,
// //     moves,
// //     seconds,
// //     progressSaved,
// //     next: NEXT_LEVEL,
// //     hints: await L9.getHints(playerId),
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /hint   body: { sessionId, playerId, cell }   (costs 25 hints)
// //    shows the next cells of the right way from where the dog stands
// // --------------------------------------------------------- */

// // r.post('/hint', handle(async (req, res) => {
// //   const cell = Number(req.body && req.body.cell);
// //   if (!Number.isInteger(cell) || cell < 0 || cell >= COLS * ROWS) {
// //     return bad(res, 400, 'invalid_cell', 'cell must be a cell of the maze');
// //   }

// //   const ctx = await openSession(req, res);
// //   if (!ctx) return;
// //   const { session, sessionId, playerId } = ctx;

// //   const hints = await L9.spendHints(playerId, COST_HINT);
// //   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

// //   await L9.markHintUsed(sessionId);

// //   const cols = Number(session.cols);
// //   const rows = Number(session.rows);
// //   const cells = buildMaze(Number(session.seed), cols, rows);
// //   const way = solve(cells, cols, cell, GOAL).slice(0, HINT_LENGTH + 1);

// //   res.json({ success: true, path: way, hints, cost: COST_HINT });
// // }));

// // /* ---------------------------------------------------------
// //    POST /skip   body: { sessionId, playerId }   (costs 50 hints)
// // --------------------------------------------------------- */

// // r.post('/skip', handle(async (req, res) => {
// //   const ctx = await openSession(req, res);
// //   if (!ctx) return;
// //   const { sessionId, playerId } = ctx;

// //   const hints = await L9.spendHints(playerId, COST_SKIP);
// //   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

// //   await L9.skipSession(sessionId);
// //   await tryUnlock(playerId, 0);

// //   res.json({
// //     success: true,
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

// //   const player = await L9.getPlayer(playerId);
// //   if (!player) return bad(res, 404, 'no_player', 'Player not found');

// //   const hints = await L9.addHints(playerId, REWARD_VIDEO);
// //   res.json({ success: true, added: REWARD_VIDEO, hints });
// // }));

// // /* ---------------------------------------------------------
// //    GET /status/:playerId
// // --------------------------------------------------------- */

// // r.get('/status/:playerId', handle(async (req, res) => {
// //   const playerId = toId(req.params.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const row = await L9.getProgress(playerId);

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
// const L9 = require('../data/level9Db');

// const r = express.Router();

// const LEVEL = L9.LEVEL;
// const NEXT_LEVEL = LEVEL + 1;
// const COST_HINT = 25;
// const COST_SKIP = 50;
// const REWARD_VIDEO = 75;

// /* ---------------------------------------------------------
//    MAZE  (built on the server from a random seed, the player only gets the walls)
// --------------------------------------------------------- */

// const COLS = 9;
// const ROWS = 9;
// const START = 0;                    // top-left: the dog
// const GOAL = COLS * ROWS - 1;       // bottom-right: the dog house + the bone
// const HINT_LENGTH = 8;              // how many cells the magnifier shows

// const TITLE = 'Help the dog find the bone!';

// // open sides of a cell: 1 = up, 2 = right, 4 = down, 8 = left
// const OPEN_N = 1;
// const OPEN_E = 2;
// const OPEN_S = 4;
// const OPEN_W = 8;
// const DIRS = [
//   { bit: OPEN_N, back: OPEN_S, dx: 0, dy: -1 },
//   { bit: OPEN_E, back: OPEN_W, dx: 1, dy: 0 },
//   { bit: OPEN_S, back: OPEN_N, dx: 0, dy: 1 },
//   { bit: OPEN_W, back: OPEN_E, dx: -1, dy: 0 },
// ];

// // small seeded random generator: the same seed always gives the same maze
// const mulberry32 = (seed) => {
//   let a = seed | 0;
//   return () => {
//     a = (a + 0x6d2b79f5) | 0;
//     let t = Math.imul(a ^ (a >>> 15), 1 | a);
//     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
//     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//   };
// };

// // depth-first maze: every cell can be reached, there is exactly one way from START to GOAL
// const buildMaze = (seed, cols, rows) => {
//   const rnd = mulberry32(seed);
//   const cells = new Array(cols * rows).fill(0);
//   const seen = new Array(cols * rows).fill(false);
//   const stack = [START];
//   seen[START] = true;

//   while (stack.length) {
//     const cur = stack[stack.length - 1];
//     const cx = cur % cols;
//     const cy = Math.floor(cur / cols);
//     const options = DIRS.filter((d) => {
//       const nx = cx + d.dx;
//       const ny = cy + d.dy;
//       return nx >= 0 && ny >= 0 && nx < cols && ny < rows && !seen[ny * cols + nx];
//     });

//     if (!options.length) {
//       stack.pop();
//       continue;
//     }

//     const d = options[Math.floor(rnd() * options.length)];
//     const next = (cy + d.dy) * cols + cx + d.dx;
//     cells[cur] |= d.bit;
//     cells[next] |= d.back;
//     seen[next] = true;
//     stack.push(next);
//   }

//   return cells;
// };

// // shortest way from one cell to another (breadth-first search) - used by the hint
// const solve = (cells, cols, from, to) => {
//   const prev = new Array(cells.length).fill(-2);
//   const queue = [from];
//   prev[from] = -1;

//   while (queue.length) {
//     const cur = queue.shift();
//     if (cur === to) break;
//     const cx = cur % cols;
//     const cy = Math.floor(cur / cols);
//     DIRS.forEach((d) => {
//       if (!(cells[cur] & d.bit)) return;
//       const next = (cy + d.dy) * cols + cx + d.dx;
//       if (prev[next] === -2) {
//         prev[next] = cur;
//         queue.push(next);
//       }
//     });
//   }

//   const path = [];
//   for (let c = to; c !== -1 && c !== -2; c = prev[c]) path.push(c);
//   return path.reverse();
// };

// // score from the time taken (seconds since the maze was made)
// const grade = (seconds) => {
//   if (seconds <= 45) return { score: 300, stars: 3 };
//   if (seconds <= 100) return { score: 200, stars: 2 };
//   return { score: 100, stars: 1 };
// };

// /* ---------------------------------------------------------
//    HELPERS
// --------------------------------------------------------- */

// const handle = (fn) => async (req, res) => {
//   try {
//     await fn(req, res);
//   } catch (err) {
//     console.error('[BrainTwist L9 Error]', req.method, req.originalUrl, err);
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

// // wait until the level 9 tables exist before any request runs
// r.use(async (req, res, next) => {
//   await L9.ready;
//   next();
// });

// // shared checks for /hint /finish /skip -> returns the open session or sends the error
// const openSession = async (req, res) => {
//   const sessionId = toId(req.body && req.body.sessionId);
//   const playerId = toId(req.body && req.body.playerId);

//   if (!sessionId || !playerId) {
//     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
//     return null;
//   }

//   const session = await L9.getSession(sessionId, playerId);
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

// // unlock level 10 - a failure here must never break the answer
// const tryUnlock = async (playerId, attempts) => {
//   try {
//     await L9.unlockNext(playerId, attempts);
//   } catch (err) {
//     console.error('[BrainTwist L9] could not unlock next level:', err.message);
//   }
// };

// /* ---------------------------------------------------------
//    POST /start   body: { playerId }
//    EVERY time the level is opened: a new session and a new maze
// --------------------------------------------------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const player = await L9.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   await L9.abandonActive(playerId);

//   const seed = Math.floor(Math.random() * 2147483646) + 1;
//   const session = await L9.createSession(playerId, seed, COLS, ROWS);

//   res.json({
//     success: true,
//     sessionId: session.id,
//     level: LEVEL,
//     status: session.status,
//     title: TITLE,
//     cols: COLS,
//     rows: ROWS,
//     cells: buildMaze(seed, COLS, ROWS),
//     start: START,
//     goal: GOAL,
//     hints: Number(player.hints) || 0,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /finish   body: { sessionId, playerId, path, moves }
//    FREE DRAG: the dog may cross walls, so the path is NOT checked
//    against the maze. Reaching the bone is enough to win.
// --------------------------------------------------------- */

// r.post('/finish', handle(async (req, res) => {
//   const ctx = await openSession(req, res);
//   if (!ctx) return;
//   const { sessionId, playerId } = ctx;

//   const path = [START, GOAL];
//   const moves = Math.max(1, Number(req.body && req.body.moves) || 1);

//   const seconds = Number(ctx.session.elapsed) || 0;
//   const { score, stars } = grade(seconds);
//   const attempts = 1;

//   await L9.completeSession(sessionId, playerId, moves, seconds, JSON.stringify(path));

//   let progressSaved = false;
//   try {
//     await L9.saveProgress(playerId, score, stars, attempts);
//     progressSaved = true;
//   } catch (err) {
//     console.error('[BrainTwist L9] could not save progress:', err.message);
//   }
//   await tryUnlock(playerId, attempts);

//   res.json({
//     success: true,
//     completed: true,
//     message: 'Yum! The dog found the bone!',
//     score,
//     stars,
//     attempts,
//     moves,
//     seconds,
//     progressSaved,
//     next: NEXT_LEVEL,
//     hints: await L9.getHints(playerId),
//   });
// }));

// /* ---------------------------------------------------------
//    POST /hint   body: { sessionId, playerId, cell }   (costs 25 hints)
//    shows the next cells of the right way from where the dog stands
// --------------------------------------------------------- */

// r.post('/hint', handle(async (req, res) => {
//   const cell = Number(req.body && req.body.cell);
//   if (!Number.isInteger(cell) || cell < 0 || cell >= COLS * ROWS) {
//     return bad(res, 400, 'invalid_cell', 'cell must be a cell of the maze');
//   }

//   const ctx = await openSession(req, res);
//   if (!ctx) return;
//   const { session, sessionId, playerId } = ctx;

//   const hints = await L9.spendHints(playerId, COST_HINT);
//   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

//   await L9.markHintUsed(sessionId);

//   const cols = Number(session.cols);
//   const rows = Number(session.rows);
//   const cells = buildMaze(Number(session.seed), cols, rows);
//   const way = solve(cells, cols, cell, GOAL).slice(0, HINT_LENGTH + 1);

//   res.json({ success: true, path: way, hints, cost: COST_HINT });
// }));

// /* ---------------------------------------------------------
//    POST /skip   body: { sessionId, playerId }   (costs 50 hints)
// --------------------------------------------------------- */

// r.post('/skip', handle(async (req, res) => {
//   const ctx = await openSession(req, res);
//   if (!ctx) return;
//   const { sessionId, playerId } = ctx;

//   const hints = await L9.spendHints(playerId, COST_SKIP);
//   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

//   await L9.skipSession(sessionId);
//   await tryUnlock(playerId, 0);

//   res.json({
//     success: true,
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

//   const player = await L9.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   const hints = await L9.addHints(playerId, REWARD_VIDEO);
//   res.json({ success: true, added: REWARD_VIDEO, hints });
// }));

// /* ---------------------------------------------------------
//    GET /status/:playerId
// --------------------------------------------------------- */

// r.get('/status/:playerId', handle(async (req, res) => {
//   const playerId = toId(req.params.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const row = await L9.getProgress(playerId);

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
const L9 = require('../data/level9Db');

const r = express.Router();

const LEVEL = L9.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_HINT = 25;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;

/* ---------------------------------------------------------
   MAZE  (built on the server from a random seed, the player only gets the walls)
--------------------------------------------------------- */

const COLS = 11;
const ROWS = 11;
const START = 0;                    // top-left: the dog
const GOAL = COLS * ROWS - 1;       // bottom-right: the dog house + the bone

const TITLE = 'Help the dog find the bone!';

// open sides of a cell: 1 = up, 2 = right, 4 = down, 8 = left
const OPEN_N = 1;
const OPEN_E = 2;
const OPEN_S = 4;
const OPEN_W = 8;
const DIRS = [
  { bit: OPEN_N, back: OPEN_S, dx: 0, dy: -1 },
  { bit: OPEN_E, back: OPEN_W, dx: 1, dy: 0 },
  { bit: OPEN_S, back: OPEN_N, dx: 0, dy: 1 },
  { bit: OPEN_W, back: OPEN_E, dx: -1, dy: 0 },
];

// small seeded random generator: the same seed always gives the same maze
const mulberry32 = (seed) => {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// A confusing maze with many branches, dead ends and loops.
// The GOAL cell is NEVER connected to the maze inside: the bone can only be reached from OUTSIDE,
// through the open bottom side of the goal cell. The only way out of the maze is the open top of the START cell.
const buildMaze = (seed, cols, rows) => {
  const rnd = mulberry32(seed);
  const cells = new Array(cols * rows).fill(0);
  const seen = new Array(cols * rows).fill(false);
  const active = [START];
  seen[START] = true;
  seen[GOAL] = true;                // never carved into: the goal stays closed from inside

  // growing tree: mixes "newest cell" and "random cell" -> lots of short branches and dead ends
  while (active.length) {
    const idx = rnd() < 0.5 ? active.length - 1 : Math.floor(rnd() * active.length);
    const cur = active[idx];
    const cx = cur % cols;
    const cy = Math.floor(cur / cols);
    const options = DIRS.filter((d) => {
      const nx = cx + d.dx;
      const ny = cy + d.dy;
      return nx >= 0 && ny >= 0 && nx < cols && ny < rows && !seen[ny * cols + nx];
    });

    if (!options.length) {
      active.splice(idx, 1);
      continue;
    }

    const d = options[Math.floor(rnd() * options.length)];
    const next = (cy + d.dy) * cols + cx + d.dx;
    cells[cur] |= d.bit;
    cells[next] |= d.back;
    seen[next] = true;
    active.push(next);
  }

  // open a few extra walls: loops make the maze much more confusing (the goal is never touched)
  for (let i = 0; i < cols * rows; i += 1) {
    if (i === GOAL) continue;
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    [DIRS[1], DIRS[2]].forEach((d) => {
      const nx = cx + d.dx;
      const ny = cy + d.dy;
      if (nx >= cols || ny >= rows) return;
      const n = ny * cols + nx;
      if (n === GOAL || (cells[i] & d.bit)) return;
      if (rnd() < 0.12) {
        cells[i] |= d.bit;
        cells[n] |= d.back;
      }
    });
  }

  cells[GOAL] = OPEN_S;             // the gate at the bottom of the goal cell (outside only)
  return cells;
};

// shortest way from one cell to another (breadth-first search) - used by the hint
const solve = (cells, cols, from, to) => {
  const prev = new Array(cells.length).fill(-2);
  const queue = [from];
  prev[from] = -1;

  while (queue.length) {
    const cur = queue.shift();
    if (cur === to) break;
    const cx = cur % cols;
    const cy = Math.floor(cur / cols);
    DIRS.forEach((d) => {
      if (!(cells[cur] & d.bit)) return;
      const next = (cy + d.dy) * cols + cx + d.dx;
      if (prev[next] === -2) {
        prev[next] = cur;
        queue.push(next);
      }
    });
  }

  const path = [];
  for (let c = to; c !== -1 && c !== -2; c = prev[c]) path.push(c);
  return path.reverse();
};

// score from the time taken (seconds since the maze was made)
const grade = (seconds) => {
  if (seconds <= 45) return { score: 300, stars: 3 };
  if (seconds <= 100) return { score: 200, stars: 2 };
  return { score: 100, stars: 1 };
};

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L9 Error]', req.method, req.originalUrl, err);
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

// wait until the level 9 tables exist before any request runs
r.use(async (req, res, next) => {
  await L9.ready;
  next();
});

// shared checks for /hint /finish /skip -> returns the open session or sends the error
const openSession = async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await L9.getSession(sessionId, playerId);
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

// unlock level 10 - a failure here must never break the answer
const tryUnlock = async (playerId, attempts) => {
  try {
    await L9.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L9] could not unlock next level:', err.message);
  }
};

/* ---------------------------------------------------------
   POST /start   body: { playerId }
   EVERY time the level is opened: a new session and a new maze
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L9.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L9.abandonActive(playerId);

  const seed = Math.floor(Math.random() * 2147483646) + 1;
  const session = await L9.createSession(playerId, seed, COLS, ROWS);

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    title: TITLE,
    cols: COLS,
    rows: ROWS,
    cells: buildMaze(seed, COLS, ROWS),
    start: START,
    goal: GOAL,
    hints: Number(player.hints) || 0,
  });
}));

/* ---------------------------------------------------------
   POST /finish   body: { sessionId, playerId, path, moves }
   FREE DRAG: the dog may cross walls, so the path is NOT checked
   against the maze. Reaching the bone is enough to win.
--------------------------------------------------------- */

r.post('/finish', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { sessionId, playerId } = ctx;

  const path = [START, GOAL];
  const moves = Math.max(1, Number(req.body && req.body.moves) || 1);

  const seconds = Number(ctx.session.elapsed) || 0;
  const { score, stars } = grade(seconds);
  const attempts = 1;

  await L9.completeSession(sessionId, playerId, moves, seconds, JSON.stringify(path));

  let progressSaved = false;
  try {
    await L9.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L9] could not save progress:', err.message);
  }
  await tryUnlock(playerId, attempts);

  res.json({
    success: true,
    completed: true,
    message: 'Yum! The dog found the bone!',
    score,
    stars,
    attempts,
    moves,
    seconds,
    progressSaved,
    next: NEXT_LEVEL,
    hints: await L9.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /hint   body: { sessionId, playerId, cell }   (costs 25 hints)
   shows the next cells of the right way from where the dog stands
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const cell = Number(req.body && req.body.cell);
  if (!Number.isInteger(cell) || cell < 0 || cell >= COLS * ROWS) {
    return bad(res, 400, 'invalid_cell', 'cell must be a cell of the maze');
  }

  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const hints = await L9.spendHints(playerId, COST_HINT);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L9.markHintUsed(sessionId);

  const cols = Number(session.cols);
  const rows = Number(session.rows);
  const cells = buildMaze(Number(session.seed), cols, rows);
  // inside the maze the only useful way is back to the exit (the start cell)
  const way = solve(cells, cols, cell, START);

  res.json({ success: true, path: way, hints, cost: COST_HINT });
}));

/* ---------------------------------------------------------
   POST /skip   body: { sessionId, playerId }   (costs 50 hints)
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { sessionId, playerId } = ctx;

  const hints = await L9.spendHints(playerId, COST_SKIP);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L9.skipSession(sessionId);
  await tryUnlock(playerId, 0);

  res.json({
    success: true,
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

  const player = await L9.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const hints = await L9.addHints(playerId, REWARD_VIDEO);
  res.json({ success: true, added: REWARD_VIDEO, hints });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await L9.getProgress(playerId);

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