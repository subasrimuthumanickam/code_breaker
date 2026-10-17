// // const express = require('express');
// // const db = require('../db');

// // const r = express.Router();

// // const LEVEL = 3;
// // const COST_HINT = 25;
// // const COST_SKIP = 50;
// // const REWARD_VIDEO = 75;

// // /* ---------------------------------------------------------
// //    PUZZLE  (the right answer stays on the server)
// // --------------------------------------------------------- */

// // const PUZZLE = {
// //   question: 'How many differences can you spot between the two pictures?',
// //   options: [1, 2, 3, 4],
// //   answer: 3,
// //   hint: 'Look at the donuts and the shirt.',
// // };

// // /* ---------------------------------------------------------
// //    HELPERS
// // --------------------------------------------------------- */

// // const handle = (fn) => async (req, res) => {
// //   try {
// //     await fn(req, res);
// //   } catch (err) {
// //     console.error('[BrainTwist L3 Error]', req.method, req.originalUrl, err);
// //     if (!res.headersSent) {
// //       res.status(500).json({ success: false, error: 'server_error', message: err.message });
// //     }
// //   }
// // };

// // const one = async (sql, params = []) => {
// //   const [rows] = await db.query(sql, params);
// //   return rows[0] || null;
// // };

// // const toId = (value) => {
// //   const n = Number(value);
// //   return Number.isInteger(n) && n > 0 ? n : null;
// // };

// // const bad = (res, status, error, message) =>
// //   res.status(status).json({ success: false, error, message });

// // const parseList = (text) => {
// //   try {
// //     const v = JSON.parse(text || '[]');
// //     return Array.isArray(v) ? v.map(Number) : [];
// //   } catch {
// //     return [];
// //   }
// // };

// // const spendHints = async (playerId, amount) => {
// //   const [result] = await db.query(
// //     'UPDATE bt_players SET hints = hints - ? WHERE id = ? AND hints >= ?',
// //     [amount, playerId, amount]
// //   );
// //   return result.affectedRows > 0;
// // };

// // const getHints = async (playerId) => {
// //   const row = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
// //   return row ? Number(row.hints) || 0 : 0;
// // };

// // /* ---------------------------------------------------------
// //    TABLES
// // --------------------------------------------------------- */

// // const ready = (async () => {
// //   await db.query(`
// //     CREATE TABLE IF NOT EXISTS bt_level3_sessions (
// //       id INT AUTO_INCREMENT PRIMARY KEY,
// //       player_id INT NOT NULL,
// //       status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
// //       wrong_attempts INT NOT NULL DEFAULT 0,
// //       total_attempts INT NOT NULL DEFAULT 0,
// //       removed TEXT NULL,
// //       started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
// //       completed_at DATETIME NULL,
// //       INDEX idx_l3_player (player_id)
// //     )
// //   `);

// //   await db.query(`
// //     CREATE TABLE IF NOT EXISTS bt_level3_attempts (
// //       id INT AUTO_INCREMENT PRIMARY KEY,
// //       session_id INT NOT NULL,
// //       picked INT NOT NULL,
// //       is_correct TINYINT(1) NOT NULL DEFAULT 0,
// //       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
// //       INDEX idx_l3_session (session_id)
// //     )
// //   `);

// //   console.log('[BrainTwist L3] tables ready');
// // })().catch((err) =>
// //   console.error('[BrainTwist L3] could not create tables:', err.message)
// // );

// // r.use(async (req, res, next) => {
// //   await ready;
// //   next();
// // });

// // /* ---------------------------------------------------------
// //    SAVE RESULT + UNLOCK NEXT LEVEL (same tables level 2 uses)
// // --------------------------------------------------------- */

// // const saveProgress = async (playerId, score, stars, attempts) => {
// //   const found = await one(
// //     'SELECT id FROM brain_twist_progress WHERE player_id = ? AND level_number = ?',
// //     [playerId, LEVEL]
// //   );

// //   if (found) {
// //     await db.query(
// //       `UPDATE brain_twist_progress
// //        SET is_completed = 1,
// //            score = GREATEST(COALESCE(score, 0), ?),
// //            stars = GREATEST(COALESCE(stars, 0), ?),
// //            attempts = COALESCE(attempts, 0) + ?,
// //            completed_at = NOW()
// //        WHERE id = ?`,
// //       [score, stars, attempts, found.id]
// //     );
// //   } else {
// //     await db.query(
// //       `INSERT INTO brain_twist_progress
// //         (player_id, level_number, is_completed, score, stars, attempts, completed_at)
// //        VALUES (?, ?, 1, ?, ?, ?, NOW())`,
// //       [playerId, LEVEL, score, stars, attempts]
// //     );
// //   }
// // };

// // const unlockNext = async (playerId, attempts) => {
// //   await db.query(
// //     `INSERT INTO bt_progress (player_id, level_n, attempts, solved_at)
// //      VALUES (?, ?, ?, NOW())
// //      ON DUPLICATE KEY UPDATE solved_at = COALESCE(solved_at, NOW())`,
// //     [playerId, LEVEL, attempts]
// //   );

// //   await db.query(
// //     `UPDATE bt_players
// //      SET current_level = GREATEST(COALESCE(current_level, 1), ?)
// //      WHERE id = ?`,
// //     [LEVEL + 1, playerId]
// //   );
// // };

// // const loadSession = async (sessionId, playerId) =>
// //   one('SELECT * FROM bt_level3_sessions WHERE id = ? AND player_id = ?', [sessionId, playerId]);

// // /* ---------------------------------------------------------
// //    POST /start   body: { playerId }
// // --------------------------------------------------------- */

// // r.post('/start', handle(async (req, res) => {
// //   const playerId = toId(req.body?.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const player = await one('SELECT id, hints FROM bt_players WHERE id = ?', [playerId]);
// //   if (!player) return bad(res, 404, 'no_player', 'Player not found');

// //   let session = await one(
// //     `SELECT * FROM bt_level3_sessions
// //      WHERE player_id = ? AND status = 'in_progress'
// //      ORDER BY id DESC LIMIT 1`,
// //     [playerId]
// //   );

// //   if (!session) {
// //     const [inserted] = await db.query(
// //       "INSERT INTO bt_level3_sessions (player_id, removed) VALUES (?, '[]')",
// //       [playerId]
// //     );
// //     session = await one('SELECT * FROM bt_level3_sessions WHERE id = ?', [inserted.insertId]);
// //   }

// //   res.json({
// //     success: true,
// //     sessionId: session.id,
// //     level: LEVEL,
// //     status: session.status,
// //     question: PUZZLE.question,
// //     options: PUZZLE.options,
// //     removed: parseList(session.removed),
// //     hints: Number(player.hints) || 0,
// //     wrongAttempts: Number(session.wrong_attempts) || 0,
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /answer   body: { sessionId, playerId, picked }
// // --------------------------------------------------------- */

// // r.post('/answer', handle(async (req, res) => {
// //   const sessionId = toId(req.body?.sessionId);
// //   const playerId = toId(req.body?.playerId);
// //   const picked = Number(req.body?.picked);

// //   if (!sessionId || !playerId) {
// //     return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
// //   }
// //   if (!PUZZLE.options.includes(picked)) {
// //     return bad(res, 400, 'invalid_answer', 'That answer is not allowed');
// //   }

// //   const session = await loadSession(sessionId, playerId);
// //   if (!session) return bad(res, 404, 'no_session', 'Session not found');
// //   if (session.status !== 'in_progress') {
// //     return bad(res, 409, 'already_completed', 'This level is already completed');
// //   }

// //   const wrongBefore = Number(session.wrong_attempts) || 0;
// //   const attemptsBefore = Number(session.total_attempts) || 0;
// //   const correct = picked === PUZZLE.answer;

// //   await db.query(
// //     'INSERT INTO bt_level3_attempts (session_id, picked, is_correct) VALUES (?, ?, ?)',
// //     [sessionId, picked, correct ? 1 : 0]
// //   );

// //   if (!correct) {
// //     await db.query(
// //       `UPDATE bt_level3_sessions
// //        SET wrong_attempts = wrong_attempts + 1, total_attempts = total_attempts + 1
// //        WHERE id = ?`,
// //       [sessionId]
// //     );

// //     return res.json({
// //       success: true,
// //       correct: false,
// //       completed: false,
// //       wrongAttempts: wrongBefore + 1,
// //       message: 'Not quite. Look again!',
// //     });
// //   }

// //   const attempts = attemptsBefore + 1;
// //   const score = Math.max(100, 300 - wrongBefore * 50);
// //   const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

// //   await db.query(
// //     `UPDATE bt_level3_sessions
// //      SET status = 'completed', total_attempts = total_attempts + 1, completed_at = NOW()
// //      WHERE id = ?`,
// //     [sessionId]
// //   );

// //   let progressSaved = false;
// //   try {
// //     await saveProgress(playerId, score, stars, attempts);
// //     progressSaved = true;
// //   } catch (err) {
// //     console.error('[BrainTwist L3] could not save progress:', err.message);
// //   }

// //   try {
// //     await unlockNext(playerId, attempts);
// //   } catch (err) {
// //     console.error('[BrainTwist L3] could not unlock next level:', err.message);
// //   }

// //   res.json({
// //     success: true,
// //     correct: true,
// //     completed: true,
// //     message: 'Sharp eyes! There are 3 differences.',
// //     score,
// //     stars,
// //     attempts,
// //     progressSaved,
// //     hints: await getHints(playerId),
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /hint   body: { sessionId, playerId }   (costs 25 hints)
// // --------------------------------------------------------- */

// // r.post('/hint', handle(async (req, res) => {
// //   const sessionId = toId(req.body?.sessionId);
// //   const playerId = toId(req.body?.playerId);
// //   if (!sessionId || !playerId) {
// //     return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
// //   }

// //   const session = await loadSession(sessionId, playerId);
// //   if (!session) return bad(res, 404, 'no_session', 'Session not found');
// //   if (session.status !== 'in_progress') {
// //     return bad(res, 409, 'already_completed', 'This level is already completed');
// //   }

// //   if (!(await spendHints(playerId, COST_HINT))) {
// //     return bad(res, 402, 'not_enough_hints', 'Not enough hints!');
// //   }

// //   const removed = parseList(session.removed);
// //   const candidates = PUZZLE.options.filter((o) => o !== PUZZLE.answer && !removed.includes(o));

// //   let hint;
// //   if (candidates.length) {
// //     const pick = candidates[Math.floor(Math.random() * candidates.length)];
// //     removed.push(pick);
// //     await db.query('UPDATE bt_level3_sessions SET removed = ? WHERE id = ?', [
// //       JSON.stringify(removed),
// //       sessionId,
// //     ]);
// //     hint = { removeOption: pick };
// //   } else {
// //     hint = { text: PUZZLE.hint };
// //   }

// //   res.json({ success: true, hint, removed, hints: await getHints(playerId) });
// // }));

// // /* ---------------------------------------------------------
// //    POST /skip   body: { sessionId, playerId }   (costs 50 hints)
// // --------------------------------------------------------- */

// // r.post('/skip', handle(async (req, res) => {
// //   const sessionId = toId(req.body?.sessionId);
// //   const playerId = toId(req.body?.playerId);
// //   if (!sessionId || !playerId) {
// //     return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
// //   }

// //   const session = await loadSession(sessionId, playerId);
// //   if (!session) return bad(res, 404, 'no_session', 'Session not found');
// //   if (session.status !== 'in_progress') {
// //     return bad(res, 409, 'already_completed', 'This level is already completed');
// //   }

// //   if (!(await spendHints(playerId, COST_SKIP))) {
// //     return bad(res, 402, 'not_enough_hints', 'Not enough hints!');
// //   }

// //   await db.query(
// //     "UPDATE bt_level3_sessions SET status = 'skipped', completed_at = NOW() WHERE id = ?",
// //     [sessionId]
// //   );

// //   try {
// //     await unlockNext(playerId, Number(session.total_attempts) || 0);
// //   } catch (err) {
// //     console.error('[BrainTwist L3] could not unlock next level:', err.message);
// //   }

// //   res.json({
// //     success: true,
// //     correct: true,
// //     completed: true,
// //     skipped: true,
// //     message: 'Level skipped!',
// //     score: 0,
// //     stars: 0,
// //     hints: await getHints(playerId),
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
// // --------------------------------------------------------- */

// // r.post('/reward', handle(async (req, res) => {
// //   const playerId = toId(req.body?.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
// //   if (req.body?.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

// //   const player = await one('SELECT id FROM bt_players WHERE id = ?', [playerId]);
// //   if (!player) return bad(res, 404, 'no_player', 'Player not found');

// //   await db.query('UPDATE bt_players SET hints = hints + ? WHERE id = ?', [REWARD_VIDEO, playerId]);

// //   res.json({ success: true, added: REWARD_VIDEO, hints: await getHints(playerId) });
// // }));

// // /* ---------------------------------------------------------
// //    GET /status/:playerId
// // --------------------------------------------------------- */

// // r.get('/status/:playerId', handle(async (req, res) => {
// //   const playerId = toId(req.params.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const row = await one(
// //     `SELECT is_completed, score, stars, attempts, completed_at
// //      FROM brain_twist_progress
// //      WHERE player_id = ? AND level_number = ?`,
// //     [playerId, LEVEL]
// //   );

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
// // backend/src/routes/Braintwistlevel3routes.js
// // Brain Twist - LEVEL 3 routes: read the request, call level3Db.js, send JSON back.

// const express = require('express');
// const L3 = require('../data/level3Db');

// const r = express.Router();

// const LEVEL = L3.LEVEL;
// const NEXT_LEVEL = LEVEL + 1;
// const COST_HINT = 25;
// const COST_SKIP = 50;
// const REWARD_VIDEO = 75;

// /* ---------------------------------------------------------
//    PUZZLE  (the right answer stays on the server)
// --------------------------------------------------------- */

// const PUZZLE = {
//   question: 'How many differences can you spot between the two pictures?',
//   options: [1, 2, 3],
//   answer: 3,
//   hint: 'Look at the donuts and the shirt.',
// };

// /* ---------------------------------------------------------
//    HELPERS
// --------------------------------------------------------- */

// const handle = (fn) => async (req, res) => {
//   try {
//     await fn(req, res);
//   } catch (err) {
//     console.error('[BrainTwist L3 Error]', req.method, req.originalUrl, err);
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

// // wait until the level 3 tables exist before any request runs
// r.use(async (req, res, next) => {
//   await L3.ready;
//   next();
// });

// // shared checks for /answer /hint /skip -> returns the open session or sends the error
// const openSession = async (req, res) => {
//   const sessionId = toId(req.body?.sessionId);
//   const playerId = toId(req.body?.playerId);

//   if (!sessionId || !playerId) {
//     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
//     return null;
//   }

//   const session = await L3.getSession(sessionId, playerId);
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

// /* ---------------------------------------------------------
//    POST /start   body: { playerId }
// --------------------------------------------------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body?.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const player = await L3.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   const session = (await L3.findOpenSession(playerId)) || (await L3.createSession(playerId));

//   res.json({
//     success: true,
//     sessionId: session.id,
//     level: LEVEL,
//     status: session.status,
//     question: PUZZLE.question,
//     options: PUZZLE.options,
//     removed: L3.parseList(session.removed),
//     hints: Number(player.hints) || 0,
//     wrongAttempts: Number(session.wrong_attempts) || 0,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /answer   body: { sessionId, playerId, picked }
// --------------------------------------------------------- */

// r.post('/answer', handle(async (req, res) => {
//   const picked = Number(req.body?.picked);
//   if (!PUZZLE.options.includes(picked)) {
//     return bad(res, 400, 'invalid_answer', 'That answer is not allowed');
//   }

//   const ctx = await openSession(req, res);
//   if (!ctx) return;
//   const { session, sessionId, playerId } = ctx;

//   const wrongBefore = Number(session.wrong_attempts) || 0;
//   const attemptsBefore = Number(session.total_attempts) || 0;
//   const correct = picked === PUZZLE.answer;

//   await L3.recordAttempt(sessionId, picked, correct);

//   if (!correct) {
//     await L3.markWrong(sessionId);
//     return res.json({
//       success: true,
//       correct: false,
//       completed: false,
//       wrongAttempts: wrongBefore + 1,
//       message: 'Not quite. Look again!',
//     });
//   }

//   const attempts = attemptsBefore + 1;
//   const score = Math.max(100, 300 - wrongBefore * 50);
//   const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

//   await L3.completeSession(sessionId);

//   let progressSaved = false;
//   try {
//     await L3.saveProgress(playerId, score, stars, attempts);
//     progressSaved = true;
//   } catch (err) {
//     console.error('[BrainTwist L3] could not save progress:', err.message);
//   }

//   try {
//     await L3.unlockNext(playerId, attempts);
//   } catch (err) {
//     console.error('[BrainTwist L3] could not unlock next level:', err.message);
//   }

//   res.json({
//     success: true,
//     correct: true,
//     completed: true,
//     message: 'Sharp eyes! There are 3 differences.',
//     score,
//     stars,
//     attempts,
//     progressSaved,
//     next: NEXT_LEVEL,
//     hints: await L3.getHints(playerId),
//   });
// }));

// /* ---------------------------------------------------------
//    POST /hint   body: { sessionId, playerId }   (costs 25 hints)
// --------------------------------------------------------- */

// r.post('/hint', handle(async (req, res) => {
//   const ctx = await openSession(req, res);
//   if (!ctx) return;
//   const { session, sessionId, playerId } = ctx;

//   if (!(await L3.spendHints(playerId, COST_HINT))) {
//     return bad(res, 402, 'not_enough_hints', 'Not enough hints!');
//   }

//   const removed = L3.parseList(session.removed);
//   const candidates = PUZZLE.options.filter((o) => o !== PUZZLE.answer && !removed.includes(o));

//   let hint;
//   if (candidates.length) {
//     const pick = candidates[Math.floor(Math.random() * candidates.length)];
//     removed.push(pick);
//     await L3.saveRemoved(sessionId, removed);
//     hint = { removeOption: pick };
//   } else {
//     hint = { text: PUZZLE.hint };
//   }

//   res.json({ success: true, hint, removed, hints: await L3.getHints(playerId) });
// }));

// /* ---------------------------------------------------------
//    POST /skip   body: { sessionId, playerId }   (costs 50 hints)
// --------------------------------------------------------- */

// r.post('/skip', handle(async (req, res) => {
//   const ctx = await openSession(req, res);
//   if (!ctx) return;
//   const { session, sessionId, playerId } = ctx;

//   if (!(await L3.spendHints(playerId, COST_SKIP))) {
//     return bad(res, 402, 'not_enough_hints', 'Not enough hints!');
//   }

//   await L3.skipSession(sessionId);

//   try {
//     await L3.unlockNext(playerId, Number(session.total_attempts) || 0);
//   } catch (err) {
//     console.error('[BrainTwist L3] could not unlock next level:', err.message);
//   }

//   res.json({
//     success: true,
//     correct: true,
//     completed: true,
//     skipped: true,
//     message: 'Level skipped!',
//     score: 0,
//     stars: 0,
//     next: NEXT_LEVEL,
//     hints: await L3.getHints(playerId),
//   });
// }));

// /* ---------------------------------------------------------
//    POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
// --------------------------------------------------------- */

// r.post('/reward', handle(async (req, res) => {
//   const playerId = toId(req.body?.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
//   if (req.body?.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

//   const player = await L3.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   await L3.addHints(playerId, REWARD_VIDEO);

//   res.json({ success: true, added: REWARD_VIDEO, hints: await L3.getHints(playerId) });
// }));

// /* ---------------------------------------------------------
//    GET /status/:playerId
// --------------------------------------------------------- */

// r.get('/status/:playerId', handle(async (req, res) => {
//   const playerId = toId(req.params.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const row = await L3.getProgress(playerId);

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
// backend/src/routes/Braintwistlevel3routes.js
// Brain Twist - LEVEL 3 routes: read the request, call level3Db.js, send JSON back.
//
// Puzzle: drag "+" and "-" between the numbers  1 _ 2 _ 3
//   symbols[0] = gap between 1 and 2,  symbols[1] = gap between 2 and 3
//   the right answer is  1 + 2 - 3

const express = require('express');
const L3 = require('../data/level3Db');

const r = express.Router();

const LEVEL = L3.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_HINT = 25;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;

/* ---------------------------------------------------------
   PUZZLE  (the right answer stays on the server)
--------------------------------------------------------- */

const PUZZLE = {
  question: 'How many differences can you spot between the two pictures?',
  numbers: [1, 2, 3],
  symbols: ['+', '-'],
  answer: ['+', '-'],
  hint: 'Both symbols are already placed.',
};

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L3 Error]', req.method, req.originalUrl, err);
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

// accept the real minus sign too
const cleanSymbol = (s) => (s === '\u2212' || s === '\u2013' ? '-' : s);

// [0, 1] -> [{ slot: 0, symbol: '+' }, { slot: 1, symbol: '-' }]
const revealedList = (slots) =>
  slots
    .filter((s) => s === 0 || s === 1)
    .map((s) => ({ slot: s, symbol: PUZZLE.answer[s] }));

// wait until the level 3 tables exist before any request runs
r.use(async (req, res, next) => {
  await L3.ready;
  next();
});

// shared checks for /answer /hint /skip -> returns the open session or sends the error
const openSession = async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await L3.getSession(sessionId, playerId);
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

/* ---------------------------------------------------------
   POST /start   body: { playerId }
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L3.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const session = (await L3.findOpenSession(playerId)) || (await L3.createSession(playerId));

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    question: PUZZLE.question,
    numbers: PUZZLE.numbers,
    symbols: PUZZLE.symbols,
    revealed: revealedList(L3.parseList(session.removed)),
    hints: Number(player.hints) || 0,
    wrongAttempts: Number(session.wrong_attempts) || 0,
  });
}));

/* ---------------------------------------------------------
   POST /answer   body: { sessionId, playerId, symbols: ['+', '-'] }
--------------------------------------------------------- */

r.post('/answer', handle(async (req, res) => {
  const raw = req.body?.symbols;
  if (!Array.isArray(raw) || raw.length !== PUZZLE.answer.length) {
    return bad(res, 400, 'invalid_answer', 'Place both symbols between the numbers');
  }

  const symbols = raw.map(cleanSymbol);
  if (!symbols.every((s) => PUZZLE.symbols.includes(s))) {
    return bad(res, 400, 'invalid_answer', 'That answer is not allowed');
  }

  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const wrongBefore = Number(session.wrong_attempts) || 0;
  const attemptsBefore = Number(session.total_attempts) || 0;
  const correct = symbols.every((s, i) => s === PUZZLE.answer[i]);

  await L3.recordAttempt(sessionId, symbols.join(','), correct);

  if (!correct) {
    await L3.markWrong(sessionId);
    return res.json({
      success: true,
      correct: false,
      completed: false,
      wrongAttempts: wrongBefore + 1,
      message: 'Not quite. Try again!',
    });
  }

  const attempts = attemptsBefore + 1;
  const score = Math.max(100, 300 - wrongBefore * 50);
  const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

  await L3.completeSession(sessionId);

  let progressSaved = false;
  try {
    await L3.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L3] could not save progress:', err.message);
  }

  try {
    await L3.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L3] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    message: 'Sharp eyes! 1 + 2 \u2212 3 is right.',
    score,
    stars,
    attempts,
    progressSaved,
    next: NEXT_LEVEL,
    hints: await L3.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /hint   body: { sessionId, playerId }   (costs 25 hints)
   places one correct symbol in its gap
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  if (!(await L3.spendHints(playerId, COST_HINT))) {
    return bad(res, 402, 'not_enough_hints', 'Not enough hints!');
  }

  const slots = L3.parseList(session.removed);
  const free = PUZZLE.answer.map((_, i) => i).filter((i) => !slots.includes(i));

  let hint;
  if (free.length) {
    const slot = free[0];
    slots.push(slot);
    await L3.saveRevealed(sessionId, slots);
    hint = { place: { slot, symbol: PUZZLE.answer[slot] } };
  } else {
    hint = { text: PUZZLE.hint };
  }

  res.json({
    success: true,
    hint,
    revealed: revealedList(slots),
    hints: await L3.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /skip   body: { sessionId, playerId }   (costs 50 hints)
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  if (!(await L3.spendHints(playerId, COST_SKIP))) {
    return bad(res, 402, 'not_enough_hints', 'Not enough hints!');
  }

  await L3.skipSession(sessionId);

  try {
    await L3.unlockNext(playerId, Number(session.total_attempts) || 0);
  } catch (err) {
    console.error('[BrainTwist L3] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    skipped: true,
    message: 'Level skipped!',
    score: 0,
    stars: 0,
    next: NEXT_LEVEL,
    hints: await L3.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
--------------------------------------------------------- */

r.post('/reward', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
  if (req.body?.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

  const player = await L3.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L3.addHints(playerId, REWARD_VIDEO);

  res.json({ success: true, added: REWARD_VIDEO, hints: await L3.getHints(playerId) });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await L3.getProgress(playerId);

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