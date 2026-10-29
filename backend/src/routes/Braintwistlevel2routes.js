
// // const express = require('express');
// // const db = require('../db');

// // const r = express.Router();

// // const LEVEL = 2;



// // const PUZZLE = {
// //   title: 'What word is this?',
// //   hint: 'Look at the picture and the word together',
// //   clueIcon: 'rain',
// //   clueText: 'BOW',
// //   answer: 'RAINBOW',
// //   right: 'Yes! Rain + Bow = RAINBOW',
// //   wrong: [
// //     'Not quite. Try again!',
// //     'Look at the cloud and the word together.',
// //     'Rain + BOW. What shows up after rain?',
// //   ],
// // };

// // // what the frontend may see (no answer)
// // const puzzleView = () => ({
// //   title: PUZZLE.title,
// //   hint: PUZZLE.hint,
// //   clueIcon: PUZZLE.clueIcon,
// //   clueText: PUZZLE.clueText,
// //   length: PUZZLE.answer.length,
// // });

// // /* ---------- HELPERS ---------- */

// // const handle = (fn) => async (req, res) => {
// //   try {
// //     await fn(req, res);
// //   } catch (err) {
// //     console.error('[BrainTwist L2 Error]', req.method, req.originalUrl, err);
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

// // /* ---------- TABLES (auto create) ---------- */

// // const ready = (async () => {
// //   await db.query(`
// //     CREATE TABLE IF NOT EXISTS bt_level2_sessions (
// //       id INT AUTO_INCREMENT PRIMARY KEY,
// //       player_id INT NOT NULL,
// //       stage TINYINT NOT NULL DEFAULT 1,
// //       status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
// //       wrong_attempts INT NOT NULL DEFAULT 0,
// //       total_attempts INT NOT NULL DEFAULT 0,
// //       started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
// //       stage1_done_at DATETIME NULL,
// //       completed_at DATETIME NULL,
// //       INDEX idx_l2_player (player_id)
// //     )
// //   `);

// //   await db.query(`
// //     CREATE TABLE IF NOT EXISTS bt_level2_actions (
// //       id INT AUTO_INCREMENT PRIMARY KEY,
// //       session_id INT NOT NULL,
// //       stage TINYINT NOT NULL,
// //       tool VARCHAR(30) NOT NULL,
// //       target VARCHAR(30) NOT NULL,
// //       is_correct TINYINT(1) NOT NULL DEFAULT 0,
// //       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
// //       INDEX idx_l2_session (session_id)
// //     )
// //   `);

// //   console.log('[BrainTwist L2] tables ready');
// // })().catch((err) =>
// //   console.error('[BrainTwist L2] could not create tables:', err.message)
// // );

// // r.use(async (req, res, next) => {
// //   await ready;
// //   next();
// // });

// // /* ---------- SAVE RESULT + UNLOCK LEVEL 3 ---------- */

// // const saveProgress = async (playerId, score, stars, attempts) => {
// //   const found = await one(
// //     `SELECT id FROM brain_twist_progress WHERE player_id = ? AND level_number = ?`,
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

// // const unlockNext = async (playerId) => {
// //   await db.query(
// //     `INSERT INTO bt_progress (player_id, level_n, attempts, solved_at)
// //      VALUES (?, ?, 0, NOW())
// //      ON DUPLICATE KEY UPDATE solved_at = NOW()`,
// //     [playerId, LEVEL]
// //   );

// //   await db.query(
// //     `UPDATE bt_players
// //      SET current_level = GREATEST(COALESCE(current_level, 1), ?)
// //      WHERE id = ?`,
// //     [LEVEL + 1, playerId]
// //   );
// // };

// // /* ---------------------------------------------------------
// //    POST /level2/start     body: { playerId }
// // --------------------------------------------------------- */

// // r.post('/start', handle(async (req, res) => {
// //   const playerId = toId(req.body?.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   // continue unfinished session, otherwise create a new one
// //   let session = await one(
// //     `SELECT * FROM bt_level2_sessions
// //      WHERE player_id = ? AND status = 'in_progress'
// //      ORDER BY id DESC LIMIT 1`,
// //     [playerId]
// //   );

// //   if (!session) {
// //     const [inserted] = await db.query(
// //       'INSERT INTO bt_level2_sessions (player_id) VALUES (?)',
// //       [playerId]
// //     );
// //     session = await one('SELECT * FROM bt_level2_sessions WHERE id = ?', [inserted.insertId]);
// //   }

// //   res.json({
// //     success: true,
// //     sessionId: session.id,
// //     level: LEVEL,
// //     status: session.status,
// //     ...puzzleView(),
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /level2/action    body: { sessionId, playerId, answer }
// // --------------------------------------------------------- */

// // r.post('/action', handle(async (req, res) => {
// //   const sessionId = toId(req.body?.sessionId);
// //   const playerId = toId(req.body?.playerId);
// //   const answer = String(req.body?.answer || '')
// //     .toUpperCase()
// //     .replace(/[^A-Z]/g, '')
// //     .slice(0, 30);

// //   if (!sessionId || !playerId) {
// //     return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
// //   }

// //   const session = await one(
// //     'SELECT * FROM bt_level2_sessions WHERE id = ? AND player_id = ?',
// //     [sessionId, playerId]
// //   );

// //   if (!session) return bad(res, 404, 'no_session', 'Session not found');
// //   if (session.status === 'completed') {
// //     return bad(res, 409, 'already_completed', 'This level is already completed');
// //   }

// //   if (answer.length !== PUZZLE.answer.length) {
// //     return bad(res, 400, 'invalid_answer', `Answer must have ${PUZZLE.answer.length} letters`);
// //   }

// //   const wrongBefore = Number(session.wrong_attempts);
// //   const attemptsBefore = Number(session.total_attempts);
// //   const correct = answer === PUZZLE.answer;

// //   // 1) save the typed word
// //   await db.query(
// //     `INSERT INTO bt_level2_actions (session_id, stage, tool, target, is_correct)
// //      VALUES (?, 1, ?, 'word', ?)`,
// //     [sessionId, answer, correct ? 1 : 0]
// //   );

// //   await db.query(
// //     'UPDATE bt_level2_sessions SET total_attempts = total_attempts + 1 WHERE id = ?',
// //     [sessionId]
// //   );

// //   // 2) wrong answer -> JSON back to frontend
// //   if (!correct) {
// //     await db.query(
// //       'UPDATE bt_level2_sessions SET wrong_attempts = wrong_attempts + 1 WHERE id = ?',
// //       [sessionId]
// //     );

// //     return res.json({
// //       success: true,
// //       correct: false,
// //       completed: false,
// //       wrongAttempts: wrongBefore + 1,
// //       message: PUZZLE.wrong[Math.min(wrongBefore, PUZZLE.wrong.length - 1)],
// //     });
// //   }

// //   // 3) correct answer -> score, stars, save, unlock next level
// //   const attempts = attemptsBefore + 1;
// //   const score = Math.max(100, 300 - wrongBefore * 50);
// //   const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

// //   await db.query(
// //     `UPDATE bt_level2_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?`,
// //     [sessionId]
// //   );

// //   let progressSaved = false;
// //   try {
// //     await saveProgress(playerId, score, stars, attempts);
// //     progressSaved = true;
// //   } catch (err) {
// //     console.error('[BrainTwist L2] could not save progress:', err.message);
// //   }

// //   try {
// //     await unlockNext(playerId);
// //   } catch (err) {
// //     console.error('[BrainTwist L2] could not unlock next level:', err.message);
// //   }

// //   res.json({
// //     success: true,
// //     correct: true,
// //     completed: true,
// //     message: PUZZLE.right,
// //     score,
// //     stars,
// //     attempts,
// //     progressSaved,
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    GET /level2/status/:playerId
// // --------------------------------------------------------- */

// // r.get('/status/:playerId', handle(async (req, res) => {
// //   const playerId = toId(req.params.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const row = await one(
// //     `SELECT is_completed, score, stars, attempts, completed_at
// //      FROM brain_twist_progress WHERE player_id = ? AND level_number = ?`,
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
// const express = require('express');
// const db = require('../db');

// const r = express.Router();

// const LEVEL = 2;

// // keep in sync with the frontend (Btlevel2screen.tsx)
// const HINT_COST = 25;
// const SKIP_COST = 50;

// const PUZZLE = {
//   title: 'What word is this?',
//   hint: 'Look at the picture and the word together',
//   clueIcon: 'rain',
//   clueText: 'BOW',
//   answer: 'RAINBOW',
//   right: 'Yes! Rain + Bow = RAINBOW',
//   wrong: [
//     'Not quite. Try again!',
//     'Look at the cloud and the word together.',
//     'Rain + BOW. What shows up after rain?',
//   ],
// };

// // what the frontend may see (no answer)
// const puzzleView = () => ({
//   title: PUZZLE.title,
//   hint: PUZZLE.hint,
//   clueIcon: PUZZLE.clueIcon,
//   clueText: PUZZLE.clueText,
//   length: PUZZLE.answer.length,
// });

// /* ---------- HELPERS ---------- */

// const handle = (fn) => async (req, res) => {
//   try {
//     await fn(req, res);
//   } catch (err) {
//     console.error('[BrainTwist L2 Error]', req.method, req.originalUrl, err);
//     if (!res.headersSent) {
//       res.status(500).json({ success: false, error: 'server_error', message: err.message });
//     }
//   }
// };

// const one = async (sql, params = []) => {
//   const [rows] = await db.query(sql, params);
//   return rows[0] || null;
// };

// const toId = (value) => {
//   const n = Number(value);
//   return Number.isInteger(n) && n > 0 ? n : null;
// };

// const bad = (res, status, error, message) =>
//   res.status(status).json({ success: false, error, message });

// /* ---------- HINT BALANCE (bt_players.hints) ---------- */

// // takes `cost` hints from the player. Returns the new balance, or null when
// // the player does not have enough hints (nothing is taken in that case).
// const spendHints = async (playerId, cost) => {
//   const [result] = await db.query(
//     `UPDATE bt_players
//      SET hints = COALESCE(hints, 0) - ?
//      WHERE id = ? AND COALESCE(hints, 0) >= ?`,
//     [cost, playerId, cost]
//   );

//   if (!result.affectedRows) return null;

//   const p = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
//   return Number(p?.hints) || 0;
// };

// const getHints = async (playerId) => {
//   const p = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
//   return Number(p?.hints) || 0;
// };

// /* ---------- TABLES (auto create) ---------- */

// const ready = (async () => {
//   await db.query(`
//     CREATE TABLE IF NOT EXISTS bt_level2_sessions (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       player_id INT NOT NULL,
//       stage TINYINT NOT NULL DEFAULT 1,
//       status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
//       wrong_attempts INT NOT NULL DEFAULT 0,
//       total_attempts INT NOT NULL DEFAULT 0,
//       started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       stage1_done_at DATETIME NULL,
//       completed_at DATETIME NULL,
//       INDEX idx_l2_player (player_id)
//     )
//   `);

//   await db.query(`
//     CREATE TABLE IF NOT EXISTS bt_level2_actions (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       session_id INT NOT NULL,
//       stage TINYINT NOT NULL,
//       tool VARCHAR(30) NOT NULL,
//       target VARCHAR(30) NOT NULL,
//       is_correct TINYINT(1) NOT NULL DEFAULT 0,
//       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       INDEX idx_l2_session (session_id)
//     )
//   `);

//   console.log('[BrainTwist L2] tables ready');
// })().catch((err) =>
//   console.error('[BrainTwist L2] could not create tables:', err.message)
// );

// r.use(async (req, res, next) => {
//   await ready;
//   next();
// });

// /* ---------- SAVE RESULT + UNLOCK LEVEL 3 ---------- */

// const saveProgress = async (playerId, score, stars, attempts) => {
//   const found = await one(
//     `SELECT id FROM brain_twist_progress WHERE player_id = ? AND level_number = ?`,
//     [playerId, LEVEL]
//   );

//   if (found) {
//     await db.query(
//       `UPDATE brain_twist_progress
//        SET is_completed = 1,
//            score = GREATEST(COALESCE(score, 0), ?),
//            stars = GREATEST(COALESCE(stars, 0), ?),
//            attempts = COALESCE(attempts, 0) + ?,
//            completed_at = NOW()
//        WHERE id = ?`,
//       [score, stars, attempts, found.id]
//     );
//   } else {
//     await db.query(
//       `INSERT INTO brain_twist_progress
//         (player_id, level_number, is_completed, score, stars, attempts, completed_at)
//        VALUES (?, ?, 1, ?, ?, ?, NOW())`,
//       [playerId, LEVEL, score, stars, attempts]
//     );
//   }
// };

// const unlockNext = async (playerId) => {
//   await db.query(
//     `INSERT INTO bt_progress (player_id, level_n, attempts, solved_at)
//      VALUES (?, ?, 0, NOW())
//      ON DUPLICATE KEY UPDATE solved_at = NOW()`,
//     [playerId, LEVEL]
//   );

//   await db.query(
//     `UPDATE bt_players
//      SET current_level = GREATEST(COALESCE(current_level, 1), ?)
//      WHERE id = ?`,
//     [LEVEL + 1, playerId]
//   );
// };

// /* ---------------------------------------------------------
//    POST /level2/start     body: { playerId }
// --------------------------------------------------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body?.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   // continue unfinished session, otherwise create a new one
//   let session = await one(
//     `SELECT * FROM bt_level2_sessions
//      WHERE player_id = ? AND status = 'in_progress'
//      ORDER BY id DESC LIMIT 1`,
//     [playerId]
//   );

//   if (!session) {
//     const [inserted] = await db.query(
//       'INSERT INTO bt_level2_sessions (player_id) VALUES (?)',
//       [playerId]
//     );
//     session = await one('SELECT * FROM bt_level2_sessions WHERE id = ?', [inserted.insertId]);
//   }

//   res.json({
//     success: true,
//     sessionId: session.id,
//     level: LEVEL,
//     status: session.status,
//     ...puzzleView(),
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level2/action    body: { sessionId, playerId, answer }
// --------------------------------------------------------- */

// r.post('/action', handle(async (req, res) => {
//   const sessionId = toId(req.body?.sessionId);
//   const playerId = toId(req.body?.playerId);
//   const answer = String(req.body?.answer || '')
//     .toUpperCase()
//     .replace(/[^A-Z]/g, '')
//     .slice(0, 30);

//   if (!sessionId || !playerId) {
//     return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
//   }

//   const session = await one(
//     'SELECT * FROM bt_level2_sessions WHERE id = ? AND player_id = ?',
//     [sessionId, playerId]
//   );

//   if (!session) return bad(res, 404, 'no_session', 'Session not found');
//   if (session.status === 'completed') {
//     return bad(res, 409, 'already_completed', 'This level is already completed');
//   }

//   if (answer.length !== PUZZLE.answer.length) {
//     return bad(res, 400, 'invalid_answer', `Answer must have ${PUZZLE.answer.length} letters`);
//   }

//   const wrongBefore = Number(session.wrong_attempts);
//   const attemptsBefore = Number(session.total_attempts);
//   const correct = answer === PUZZLE.answer;

//   // 1) save the typed word
//   await db.query(
//     `INSERT INTO bt_level2_actions (session_id, stage, tool, target, is_correct)
//      VALUES (?, 1, ?, 'word', ?)`,
//     [sessionId, answer, correct ? 1 : 0]
//   );

//   await db.query(
//     'UPDATE bt_level2_sessions SET total_attempts = total_attempts + 1 WHERE id = ?',
//     [sessionId]
//   );

//   // 2) wrong answer -> JSON back to frontend
//   if (!correct) {
//     await db.query(
//       'UPDATE bt_level2_sessions SET wrong_attempts = wrong_attempts + 1 WHERE id = ?',
//       [sessionId]
//     );

//     return res.json({
//       success: true,
//       correct: false,
//       completed: false,
//       wrongAttempts: wrongBefore + 1,
//       message: PUZZLE.wrong[Math.min(wrongBefore, PUZZLE.wrong.length - 1)],
//     });
//   }

//   // 3) correct answer -> score, stars, save, unlock next level
//   const attempts = attemptsBefore + 1;
//   const score = Math.max(100, 300 - wrongBefore * 50);
//   const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

//   await db.query(
//     `UPDATE bt_level2_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?`,
//     [sessionId]
//   );

//   let progressSaved = false;
//   try {
//     await saveProgress(playerId, score, stars, attempts);
//     progressSaved = true;
//   } catch (err) {
//     console.error('[BrainTwist L2] could not save progress:', err.message);
//   }

//   try {
//     await unlockNext(playerId);
//   } catch (err) {
//     console.error('[BrainTwist L2] could not unlock next level:', err.message);
//   }

//   res.json({
//     success: true,
//     correct: true,
//     completed: true,
//     message: PUZZLE.right,
//     score,
//     stars,
//     attempts,
//     progressSaved,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level2/hint      body: { sessionId, playerId, revealed }
//    Reveals the next letter of the answer. Costs HINT_COST.
//    `revealed` = how many letters the player already has from hints.
// --------------------------------------------------------- */

// r.post('/hint', handle(async (req, res) => {
//   const sessionId = toId(req.body?.sessionId);
//   const playerId = toId(req.body?.playerId);
//   const revealedRaw = Number(req.body?.revealed);
//   const revealed = Number.isInteger(revealedRaw) && revealedRaw > 0 ? revealedRaw : 0;

//   if (!sessionId || !playerId) {
//     return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
//   }

//   const session = await one(
//     'SELECT * FROM bt_level2_sessions WHERE id = ? AND player_id = ?',
//     [sessionId, playerId]
//   );

//   if (!session) return bad(res, 404, 'no_session', 'Session not found');
//   if (session.status === 'completed') {
//     return bad(res, 409, 'already_completed', 'This level is already completed');
//   }

//   const len = PUZZLE.answer.length;

//   // never reveal the whole word: keep at least the last letter for the player
//   if (revealed >= len - 1) {
//     return res.json({
//       success: true,
//       charged: false,
//       prefix: PUZZLE.answer.slice(0, len - 1),
//       hints: await getHints(playerId),
//       message: 'No more hints. You can do it!',
//     });
//   }

//   const newBalance = await spendHints(playerId, HINT_COST);
//   if (newBalance === null) {
//     return bad(res, 402, 'not_enough_hints', `Need ${HINT_COST} hints. You have ${await getHints(playerId)}.`);
//   }

//   const prefix = PUZZLE.answer.slice(0, revealed + 1);

//   await db.query(
//     `INSERT INTO bt_level2_actions (session_id, stage, tool, target, is_correct)
//      VALUES (?, 1, 'hint', ?, 0)`,
//     [sessionId, prefix]
//   );

//   res.json({
//     success: true,
//     charged: true,
//     prefix,
//     hints: newBalance,
//     message: `Hint: it starts with "${prefix}"`,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level2/skip      body: { sessionId, playerId }
//    Costs SKIP_COST, completes Level 2 and unlocks Level 3.
// --------------------------------------------------------- */

// r.post('/skip', handle(async (req, res) => {
//   const sessionId = toId(req.body?.sessionId);
//   const playerId = toId(req.body?.playerId);

//   if (!sessionId || !playerId) {
//     return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
//   }

//   const session = await one(
//     'SELECT * FROM bt_level2_sessions WHERE id = ? AND player_id = ?',
//     [sessionId, playerId]
//   );

//   if (!session) return bad(res, 404, 'no_session', 'Session not found');
//   if (session.status === 'completed') {
//     return bad(res, 409, 'already_completed', 'This level is already completed');
//   }

//   const newBalance = await spendHints(playerId, SKIP_COST);
//   if (newBalance === null) {
//     return bad(res, 402, 'not_enough_hints', `Need ${SKIP_COST} hints. You have ${await getHints(playerId)}.`);
//   }

//   const attempts = Math.max(1, Number(session.total_attempts) || 0);

//   await db.query(
//     `UPDATE bt_level2_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?`,
//     [sessionId]
//   );

//   await db.query(
//     `INSERT INTO bt_level2_actions (session_id, stage, tool, target, is_correct)
//      VALUES (?, 1, 'skip', 'level', 0)`,
//     [sessionId]
//   );

//   let progressSaved = false;
//   try {
//     // skipped = lowest score, 1 star
//     await saveProgress(playerId, 50, 1, attempts);
//     progressSaved = true;
//   } catch (err) {
//     console.error('[BrainTwist L2] could not save skip progress:', err.message);
//   }

//   try {
//     await unlockNext(playerId);
//   } catch (err) {
//     console.error('[BrainTwist L2] could not unlock next level:', err.message);
//   }

//   res.json({
//     success: true,
//     correct: true,
//     completed: true,
//     skipped: true,
//     message: 'Level skipped',
//     score: 50,
//     stars: 1,
//     attempts,
//     hints: newBalance,
//     progressSaved,
//   });
// }));

// /* ---------------------------------------------------------
//    GET /level2/status/:playerId
// --------------------------------------------------------- */

// r.get('/status/:playerId', handle(async (req, res) => {
//   const playerId = toId(req.params.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const row = await one(
//     `SELECT is_completed, score, stars, attempts, completed_at
//      FROM brain_twist_progress WHERE player_id = ? AND level_number = ?`,
//     [playerId, LEVEL]
//   );

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
const db = require('../db');

const r = express.Router();

const LEVEL = 2;

// keep in sync with the frontend (Btlevel2screen.tsx)
const HINT_COST = 25;
const SKIP_COST = 50;

/* ---------- HELPERS ---------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L2 Error]', req.method, req.originalUrl, err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'server_error', message: err.message });
    }
  }
};

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

const toId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const bad = (res, status, error, message) =>
  res.status(status).json({ success: false, error, message });

/* ---------- PUZZLE (now comes from MySQL) ---------- */

const DEFAULT_WRONG = ['Not quite. Try again!', 'Look at the picture and the word together.'];

const parseWrong = (txt) => {
  try {
    const a = JSON.parse(txt);
    return Array.isArray(a) && a.length ? a : DEFAULT_WRONG;
  } catch (e) {
    return DEFAULT_WRONG;
  }
};

// normalise a DB row into the shape the routes use
const shape = (row) => ({
  id: row.id,
  title: row.title,
  hint: row.hint_text,
  clueIcon: row.clue_icon,
  clueText: row.clue_text,
  answer: String(row.answer).toUpperCase().replace(/[^A-Z]/g, ''),
  right: row.right_msg,
  wrong: parseWrong(row.wrong_msgs),
});

// what the frontend may see (no answer)
const puzzleView = (p) => ({
  puzzleId: p.id,
  title: p.title,
  hint: p.hint,
  clueIcon: p.clueIcon,
  clueText: p.clueText,
  length: p.answer.length,
});

// the puzzle that belongs to a session
const puzzleForSession = async (session) => {
  let row = null;
  if (session.puzzle_id) {
    row = await one('SELECT * FROM bt_level2_puzzles WHERE id = ?', [session.puzzle_id]);
  }
  if (!row) {
    row = await one('SELECT * FROM bt_level2_puzzles WHERE is_active = 1 ORDER BY id LIMIT 1');
  }
  if (!row) throw new Error('No active puzzle in bt_level2_puzzles');
  return shape(row);
};

/* ---------- HINT BALANCE (bt_players.hints) ---------- */

const spendHints = async (playerId, cost) => {
  const [result] = await db.query(
    `UPDATE bt_players
     SET hints = COALESCE(hints, 0) - ?
     WHERE id = ? AND COALESCE(hints, 0) >= ?`,
    [cost, playerId, cost]
  );

  if (!result.affectedRows) return null;

  const p = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
  return Number(p?.hints) || 0;
};

const getHints = async (playerId) => {
  const p = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
  return Number(p?.hints) || 0;
};

/* ---------- TABLES (auto create) ---------- */

const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level2_puzzles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100) NOT NULL DEFAULT 'What word is this?',
      hint_text VARCHAR(200) NOT NULL DEFAULT 'Look at the picture and the word together',
      clue_icon VARCHAR(30) NOT NULL,
      clue_text VARCHAR(50) NOT NULL,
      answer VARCHAR(30) NOT NULL,
      right_msg VARCHAR(200) NOT NULL,
      wrong_msgs TEXT NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1
    )
  `);

  // first run only: put the puzzles in the table
  const count = await one('SELECT COUNT(*) AS c FROM bt_level2_puzzles');
  if (!count || Number(count.c) === 0) {
    await db.query(
      `INSERT INTO bt_level2_puzzles
        (clue_icon, clue_text, answer, right_msg, wrong_msgs, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [
        'rain', 'BOW', 'RAINBOW', 'Yes! Rain + Bow = RAINBOW',
        JSON.stringify([
          'Not quite. Try again!',
          'Look at the cloud and the word together.',
          'Rain + BOW. What shows up after rain?',
        ]),
      ]
    );
    await db.query(
      `INSERT INTO bt_level2_puzzles
        (clue_icon, clue_text, answer, right_msg, wrong_msgs, is_active)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [
        'lock', 'GRAPHY', 'CRYPTOGRAPHY', 'Yes! Crypto + Graphy = CRYPTOGRAPHY',
        JSON.stringify(['Not quite. Try again!', 'A lock keeps data secret...']),
      ]
    );
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level2_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      stage TINYINT NOT NULL DEFAULT 1,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      wrong_attempts INT NOT NULL DEFAULT 0,
      total_attempts INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      stage1_done_at DATETIME NULL,
      completed_at DATETIME NULL,
      INDEX idx_l2_player (player_id)
    )
  `);

  // add puzzle_id to old tables (ignore if it already exists)
  try {
    await db.query('ALTER TABLE bt_level2_sessions ADD COLUMN puzzle_id INT NULL');
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') throw err;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level2_actions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      stage TINYINT NOT NULL,
      tool VARCHAR(30) NOT NULL,
      target VARCHAR(30) NOT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l2_session (session_id)
    )
  `);

  console.log('[BrainTwist L2] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L2] could not create tables:', err.message)
);

r.use(async (req, res, next) => {
  await ready;
  next();
});

/* ---------- SAVE RESULT + UNLOCK LEVEL 3 ---------- */

const saveProgress = async (playerId, score, stars, attempts) => {
  const found = await one(
    `SELECT id FROM brain_twist_progress WHERE player_id = ? AND level_number = ?`,
    [playerId, LEVEL]
  );

  if (found) {
    await db.query(
      `UPDATE brain_twist_progress
       SET is_completed = 1,
           score = GREATEST(COALESCE(score, 0), ?),
           stars = GREATEST(COALESCE(stars, 0), ?),
           attempts = COALESCE(attempts, 0) + ?,
           completed_at = NOW()
       WHERE id = ?`,
      [score, stars, attempts, found.id]
    );
  } else {
    await db.query(
      `INSERT INTO brain_twist_progress
        (player_id, level_number, is_completed, score, stars, attempts, completed_at)
       VALUES (?, ?, 1, ?, ?, ?, NOW())`,
      [playerId, LEVEL, score, stars, attempts]
    );
  }
};

const unlockNext = async (playerId) => {
  await db.query(
    `INSERT INTO bt_progress (player_id, level_n, attempts, solved_at)
     VALUES (?, ?, 0, NOW())
     ON DUPLICATE KEY UPDATE solved_at = NOW()`,
    [playerId, LEVEL]
  );

  await db.query(
    `UPDATE bt_players
     SET current_level = GREATEST(COALESCE(current_level, 1), ?)
     WHERE id = ?`,
    [LEVEL + 1, playerId]
  );
};

/* ---------------------------------------------------------
   POST /level2/start     body: { playerId }
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  // the currently active puzzle from MySQL
  const active = await one(
    'SELECT * FROM bt_level2_puzzles WHERE is_active = 1 ORDER BY id LIMIT 1'
  );
  if (!active) return bad(res, 500, 'no_puzzle', 'No active puzzle in bt_level2_puzzles');

  // continue unfinished session, but only if it uses the active puzzle
  let session = await one(
    `SELECT * FROM bt_level2_sessions
     WHERE player_id = ? AND status = 'in_progress'
     ORDER BY id DESC LIMIT 1`,
    [playerId]
  );

  if (session && session.puzzle_id !== active.id) {
    // question was changed in the DB: close the old session, start a new one
    await db.query(`UPDATE bt_level2_sessions SET status = 'abandoned' WHERE id = ?`, [session.id]);
    session = null;
  }

  if (!session) {
    const [inserted] = await db.query(
      'INSERT INTO bt_level2_sessions (player_id, puzzle_id) VALUES (?, ?)',
      [playerId, active.id]
    );
    session = await one('SELECT * FROM bt_level2_sessions WHERE id = ?', [inserted.insertId]);
  }

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    ...puzzleView(shape(active)),
  });
}));

/* ---------------------------------------------------------
   POST /level2/action    body: { sessionId, playerId, answer }
--------------------------------------------------------- */

r.post('/action', handle(async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);
  const answer = String(req.body?.answer || '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 30);

  if (!sessionId || !playerId) {
    return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
  }

  const session = await one(
    'SELECT * FROM bt_level2_sessions WHERE id = ? AND player_id = ?',
    [sessionId, playerId]
  );

  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') {
    return bad(res, 409, 'already_completed', 'This level is already completed');
  }

  const PUZZLE = await puzzleForSession(session);

  if (answer.length !== PUZZLE.answer.length) {
    return bad(res, 400, 'invalid_answer', `Answer must have ${PUZZLE.answer.length} letters`);
  }

  const wrongBefore = Number(session.wrong_attempts);
  const attemptsBefore = Number(session.total_attempts);
  const correct = answer === PUZZLE.answer;

  // 1) save the typed word
  await db.query(
    `INSERT INTO bt_level2_actions (session_id, stage, tool, target, is_correct)
     VALUES (?, 1, ?, 'word', ?)`,
    [sessionId, answer, correct ? 1 : 0]
  );

  await db.query(
    'UPDATE bt_level2_sessions SET total_attempts = total_attempts + 1 WHERE id = ?',
    [sessionId]
  );

  // 2) wrong answer -> JSON back to frontend
  if (!correct) {
    await db.query(
      'UPDATE bt_level2_sessions SET wrong_attempts = wrong_attempts + 1 WHERE id = ?',
      [sessionId]
    );

    return res.json({
      success: true,
      correct: false,
      completed: false,
      wrongAttempts: wrongBefore + 1,
      message: PUZZLE.wrong[Math.min(wrongBefore, PUZZLE.wrong.length - 1)],
    });
  }

  // 3) correct answer -> score, stars, save, unlock next level
  const attempts = attemptsBefore + 1;
  const score = Math.max(100, 300 - wrongBefore * 50);
  const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

  await db.query(
    `UPDATE bt_level2_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?`,
    [sessionId]
  );

  let progressSaved = false;
  try {
    await saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L2] could not save progress:', err.message);
  }

  try {
    await unlockNext(playerId);
  } catch (err) {
    console.error('[BrainTwist L2] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    message: PUZZLE.right,
    score,
    stars,
    attempts,
    progressSaved,
  });
}));

/* ---------------------------------------------------------
   POST /level2/hint      body: { sessionId, playerId, revealed }
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);
  const revealedRaw = Number(req.body?.revealed);
  const revealed = Number.isInteger(revealedRaw) && revealedRaw > 0 ? revealedRaw : 0;

  if (!sessionId || !playerId) {
    return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
  }

  const session = await one(
    'SELECT * FROM bt_level2_sessions WHERE id = ? AND player_id = ?',
    [sessionId, playerId]
  );

  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') {
    return bad(res, 409, 'already_completed', 'This level is already completed');
  }

  const PUZZLE = await puzzleForSession(session);
  const len = PUZZLE.answer.length;

  if (revealed >= len - 1) {
    return res.json({
      success: true,
      charged: false,
      prefix: PUZZLE.answer.slice(0, len - 1),
      hints: await getHints(playerId),
      message: 'No more hints. You can do it!',
    });
  }

  const newBalance = await spendHints(playerId, HINT_COST);
  if (newBalance === null) {
    return bad(res, 402, 'not_enough_hints', `Need ${HINT_COST} hints. You have ${await getHints(playerId)}.`);
  }

  const prefix = PUZZLE.answer.slice(0, revealed + 1);

  await db.query(
    `INSERT INTO bt_level2_actions (session_id, stage, tool, target, is_correct)
     VALUES (?, 1, 'hint', ?, 0)`,
    [sessionId, prefix]
  );

  res.json({
    success: true,
    charged: true,
    prefix,
    hints: newBalance,
    message: `Hint: it starts with "${prefix}"`,
  });
}));

/* ---------------------------------------------------------
   POST /level2/skip      body: { sessionId, playerId }
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);

  if (!sessionId || !playerId) {
    return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
  }

  const session = await one(
    'SELECT * FROM bt_level2_sessions WHERE id = ? AND player_id = ?',
    [sessionId, playerId]
  );

  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') {
    return bad(res, 409, 'already_completed', 'This level is already completed');
  }

  const newBalance = await spendHints(playerId, SKIP_COST);
  if (newBalance === null) {
    return bad(res, 402, 'not_enough_hints', `Need ${SKIP_COST} hints. You have ${await getHints(playerId)}.`);
  }

  const attempts = Math.max(1, Number(session.total_attempts) || 0);

  await db.query(
    `UPDATE bt_level2_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?`,
    [sessionId]
  );

  await db.query(
    `INSERT INTO bt_level2_actions (session_id, stage, tool, target, is_correct)
     VALUES (?, 1, 'skip', 'level', 0)`,
    [sessionId]
  );

  let progressSaved = false;
  try {
    await saveProgress(playerId, 50, 1, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L2] could not save skip progress:', err.message);
  }

  try {
    await unlockNext(playerId);
  } catch (err) {
    console.error('[BrainTwist L2] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    skipped: true,
    message: 'Level skipped',
    score: 50,
    stars: 1,
    attempts,
    hints: newBalance,
    progressSaved,
  });
}));

/* ---------------------------------------------------------
   GET /level2/status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await one(
    `SELECT is_completed, score, stars, attempts, completed_at
     FROM brain_twist_progress WHERE player_id = ? AND level_number = ?`,
    [playerId, LEVEL]
  );

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