// // // // // // level41Db.js  — MySQL layer for Brain Twist Level 41
// // // // // const mysql = require('mysql2/promise');

// // // // // const pool = mysql.createPool({
// // // // //   host: process.env.DB_HOST || 'localhost',
// // // // //   user: process.env.DB_USER || 'root',
// // // // //   password: process.env.DB_PASSWORD || '',
// // // // //   database: process.env.DB_NAME || 'braintwist',
// // // // //   waitForConnections: true,
// // // // //   connectionLimit: 10,
// // // // // });

// // // // // const DEFAULT_BULBS = 100;

// // // // // // creates tables + seeds puzzle (same as level41.sql). Call once at server start.
// // // // // async function initLevel41Db() {
// // // // //   await pool.query(`CREATE TABLE IF NOT EXISTS bt_wallet (
// // // // //     user_id INT NOT NULL PRIMARY KEY,
// // // // //     bulbs INT NOT NULL DEFAULT ${DEFAULT_BULBS},
// // // // //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
// // // // //   await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_puzzle (
// // // // //     id INT AUTO_INCREMENT PRIMARY KEY,
// // // // //     title VARCHAR(100) NOT NULL,
// // // // //     answer VARCHAR(20) NOT NULL,
// // // // //     answer_length TINYINT NOT NULL,
// // // // //     clue_cost INT NOT NULL DEFAULT 25,
// // // // //     skip_cost INT NOT NULL DEFAULT 50,
// // // // //     reward INT NOT NULL DEFAULT 10,
// // // // //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
// // // // //   await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_progress (
// // // // //     id INT AUTO_INCREMENT PRIMARY KEY,
// // // // //     user_id INT NOT NULL,
// // // // //     puzzle_id INT NOT NULL,
// // // // //     status ENUM('playing','solved','skipped') NOT NULL DEFAULT 'playing',
// // // // //     attempts INT NOT NULL DEFAULT 0,
// // // // //     clues_used INT NOT NULL DEFAULT 0,
// // // // //     revealed_json JSON NULL,
// // // // //     solved_at DATETIME NULL,
// // // // //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
// // // // //     UNIQUE KEY uq_user_puzzle (user_id, puzzle_id))`);
// // // // //   await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_attempts (
// // // // //     id INT AUTO_INCREMENT PRIMARY KEY,
// // // // //     user_id INT NOT NULL,
// // // // //     puzzle_id INT NOT NULL,
// // // // //     guess VARCHAR(20) NOT NULL,
// // // // //     is_correct TINYINT(1) NOT NULL DEFAULT 0,
// // // // //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// // // // //     INDEX idx_user (user_id, puzzle_id))`);
// // // // //   await pool.query(
// // // // //     `INSERT INTO bt_level41_puzzle (title, answer, answer_length, clue_cost, skip_cost, reward)
// // // // //      SELECT 'Clouds raining B', 'BRAIN', 5, 25, 50, 10
// // // // //      WHERE NOT EXISTS (SELECT 1 FROM bt_level41_puzzle WHERE answer = 'BRAIN')`
// // // // //   );
// // // // // }

// // // // // async function getPuzzle(conn = pool) {
// // // // //   const [rows] = await conn.query('SELECT * FROM bt_level41_puzzle ORDER BY id LIMIT 1');
// // // // //   return rows[0];
// // // // // }

// // // // // async function ensureUser(conn, userId, puzzleId) {
// // // // //   await conn.query('INSERT IGNORE INTO bt_wallet (user_id, bulbs) VALUES (?, ?)', [userId, DEFAULT_BULBS]);
// // // // //   await conn.query(
// // // // //     `INSERT IGNORE INTO bt_level41_progress (user_id, puzzle_id, revealed_json) VALUES (?, ?, JSON_ARRAY())`,
// // // // //     [userId, puzzleId]
// // // // //   );
// // // // // }

// // // // // function parseRevealed(v) {
// // // // //   if (Array.isArray(v)) return v;
// // // // //   try { return JSON.parse(v || '[]'); } catch { return []; }
// // // // // }

// // // // // // builds the JSON the frontend needs (never contains the answer unless solved/skipped)
// // // // // async function buildState(conn, userId, puzzle) {
// // // // //   const [[p]] = await conn.query(
// // // // //     'SELECT * FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ?', [userId, puzzle.id]);
// // // // //   const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ?', [userId]);
// // // // //   const revealedIdx = parseRevealed(p.revealed_json);
// // // // //   return {
// // // // //     level: 41,
// // // // //     status: p.status,
// // // // //     answerLength: puzzle.answer_length,
// // // // //     attempts: p.attempts,
// // // // //     cluesUsed: p.clues_used,
// // // // //     bulbs: w.bulbs,
// // // // //     clueCost: puzzle.clue_cost,
// // // // //     skipCost: puzzle.skip_cost,
// // // // //     reward: puzzle.reward,
// // // // //     revealed: revealedIdx.map((i) => ({ index: i, letter: puzzle.answer[i] })),
// // // // //     answer: p.status === 'playing' ? undefined : puzzle.answer,
// // // // //   };
// // // // // }

// // // // // async function withTx(fn) {
// // // // //   const conn = await pool.getConnection();
// // // // //   try {
// // // // //     await conn.beginTransaction();
// // // // //     const out = await fn(conn);
// // // // //     await conn.commit();
// // // // //     return out;
// // // // //   } catch (e) {
// // // // //     await conn.rollback();
// // // // //     throw e;
// // // // //   } finally {
// // // // //     conn.release();
// // // // //   }
// // // // // }

// // // // // async function getLevel41(userId) {
// // // // //   return withTx(async (conn) => {
// // // // //     const puzzle = await getPuzzle(conn);
// // // // //     await ensureUser(conn, userId, puzzle.id);
// // // // //     return buildState(conn, userId, puzzle);
// // // // //   });
// // // // // }

// // // // // async function submitAnswer(userId, rawGuess) {
// // // // //   const guess = String(rawGuess || '').toUpperCase().replace(/[^A-Z]/g, '');
// // // // //   return withTx(async (conn) => {
// // // // //     const puzzle = await getPuzzle(conn);
// // // // //     await ensureUser(conn, userId, puzzle.id);
// // // // //     const [[p]] = await conn.query(
// // // // //       'SELECT status FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
// // // // //       [userId, puzzle.id]);
// // // // //     if (p.status !== 'playing') {
// // // // //       return { correct: p.status === 'solved', alreadyDone: true, state: await buildState(conn, userId, puzzle) };
// // // // //     }
// // // // //     const correct = guess === puzzle.answer;
// // // // //     await conn.query(
// // // // //       'INSERT INTO bt_level41_attempts (user_id, puzzle_id, guess, is_correct) VALUES (?,?,?,?)',
// // // // //       [userId, puzzle.id, guess.slice(0, 20), correct ? 1 : 0]);
// // // // //     if (correct) {
// // // // //       await conn.query(
// // // // //         `UPDATE bt_level41_progress SET attempts = attempts + 1, status = 'solved', solved_at = NOW()
// // // // //          WHERE user_id = ? AND puzzle_id = ?`, [userId, puzzle.id]);
// // // // //       await conn.query('UPDATE bt_wallet SET bulbs = bulbs + ? WHERE user_id = ?', [puzzle.reward, userId]);
// // // // //     } else {
// // // // //       await conn.query(
// // // // //         'UPDATE bt_level41_progress SET attempts = attempts + 1 WHERE user_id = ? AND puzzle_id = ?',
// // // // //         [userId, puzzle.id]);
// // // // //     }
// // // // //     return { correct, state: await buildState(conn, userId, puzzle) };
// // // // //   });
// // // // // }

// // // // // async function useClue(userId) {
// // // // //   return withTx(async (conn) => {
// // // // //     const puzzle = await getPuzzle(conn);
// // // // //     await ensureUser(conn, userId, puzzle.id);
// // // // //     const [[p]] = await conn.query(
// // // // //       'SELECT * FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
// // // // //       [userId, puzzle.id]);
// // // // //     const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ? FOR UPDATE', [userId]);
// // // // //     if (p.status !== 'playing') return { ok: false, error: 'LEVEL_FINISHED', state: await buildState(conn, userId, puzzle) };
// // // // //     const revealed = parseRevealed(p.revealed_json);
// // // // //     const hidden = [...Array(puzzle.answer_length).keys()].filter((i) => !revealed.includes(i));
// // // // //     if (hidden.length <= 1) return { ok: false, error: 'NO_MORE_CLUES', state: await buildState(conn, userId, puzzle) };
// // // // //     if (w.bulbs < puzzle.clue_cost) return { ok: false, error: 'NOT_ENOUGH_BULBS', state: await buildState(conn, userId, puzzle) };
// // // // //     const pick = hidden[Math.floor(Math.random() * hidden.length)];
// // // // //     revealed.push(pick);
// // // // //     await conn.query('UPDATE bt_wallet SET bulbs = bulbs - ? WHERE user_id = ?', [puzzle.clue_cost, userId]);
// // // // //     await conn.query(
// // // // //       'UPDATE bt_level41_progress SET clues_used = clues_used + 1, revealed_json = ? WHERE user_id = ? AND puzzle_id = ?',
// // // // //       [JSON.stringify(revealed), userId, puzzle.id]);
// // // // //     return { ok: true, state: await buildState(conn, userId, puzzle) };
// // // // //   });
// // // // // }

// // // // // async function skipLevel(userId) {
// // // // //   return withTx(async (conn) => {
// // // // //     const puzzle = await getPuzzle(conn);
// // // // //     await ensureUser(conn, userId, puzzle.id);
// // // // //     const [[p]] = await conn.query(
// // // // //       'SELECT status FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
// // // // //       [userId, puzzle.id]);
// // // // //     const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ? FOR UPDATE', [userId]);
// // // // //     if (p.status !== 'playing') return { ok: true, state: await buildState(conn, userId, puzzle) };
// // // // //     if (w.bulbs < puzzle.skip_cost) return { ok: false, error: 'NOT_ENOUGH_BULBS', state: await buildState(conn, userId, puzzle) };
// // // // //     await conn.query('UPDATE bt_wallet SET bulbs = bulbs - ? WHERE user_id = ?', [puzzle.skip_cost, userId]);
// // // // //     await conn.query(
// // // // //       `UPDATE bt_level41_progress SET status = 'skipped' WHERE user_id = ? AND puzzle_id = ?`,
// // // // //       [userId, puzzle.id]);
// // // // //     return { ok: true, state: await buildState(conn, userId, puzzle) };
// // // // //   });
// // // // // }

// // // // // module.exports = { pool, initLevel41Db, getLevel41, submitAnswer, useClue, skipLevel };
// // // // // routes/Braintwistlevel41routes.js — Express routes for Brain Twist Level 41
// // // // // level41Db.js can be in  src/data/level41Db.js  (recommended)  OR  src/routes/level41Db.js — both work.
// // // // const express = require('express');

// // // // let db;
// // // // try {
// // // //   db = require('../data/level41Db');
// // // // } catch (e) {
// // // //   if (e.code !== 'MODULE_NOT_FOUND') throw e;
// // // //   db = require('./level41Db');
// // // // }
// // // // const { initLevel41Db, getLevel41, submitAnswer, useClue, skipLevel } = db;

// // // // const router = express.Router();

// // // // initLevel41Db().catch((e) => console.error('Level41 DB init failed:', e.message));

// // // // // playerId (or userId) comes from body / query
// // // // const getUserId = (req) => {
// // // //   const id = parseInt(
// // // //     req.body?.playerId ?? req.query?.playerId ?? req.body?.userId ?? req.query?.userId ?? req.headers['x-user-id'] ?? 1,
// // // //     10
// // // //   );
// // // //   return Number.isFinite(id) && id > 0 ? id : 1;
// // // // };

// // // // const wrap = (fn) => async (req, res) => {
// // // //   try {
// // // //     await fn(req, res);
// // // //   } catch (e) {
// // // //     console.error('Level41 error:', e);
// // // //     res.status(500).json({ success: false, error: 'SERVER_ERROR', message: e.message });
// // // //   }
// // // // };

// // // // // GET /api/braintwist/level41?playerId=1  -> puzzle state
// // // // router.get('/', wrap(async (req, res) => {
// // // //   const state = await getLevel41(getUserId(req));
// // // //   res.json({ success: true, state });
// // // // }));

// // // // // POST /api/braintwist/level41/answer  { playerId, guess:"BRAIN" }
// // // // router.post('/answer', wrap(async (req, res) => {
// // // //   const guess = req.body?.guess;
// // // //   if (typeof guess !== 'string' || !guess.trim()) {
// // // //     return res.status(400).json({ success: false, error: 'GUESS_REQUIRED' });
// // // //   }
// // // //   const out = await submitAnswer(getUserId(req), guess);
// // // //   res.json({ success: true, ...out });
// // // // }));

// // // // // POST /api/braintwist/level41/clue  { playerId }
// // // // router.post('/clue', wrap(async (req, res) => {
// // // //   const out = await useClue(getUserId(req));
// // // //   res.status(out.ok ? 200 : 400).json({ success: out.ok, ...out });
// // // // }));

// // // // // POST /api/braintwist/level41/skip  { playerId }
// // // // router.post('/skip', wrap(async (req, res) => {
// // // //   const out = await skipLevel(getUserId(req));
// // // //   res.status(out.ok ? 200 : 400).json({ success: out.ok, ...out });
// // // // }));

// // // // module.exports = router;
// // // // level41Db.js  — MySQL layer for Brain Twist Level 41
// // // const mysql = require('mysql2/promise');

// // // const pool = mysql.createPool({
// // //   host: process.env.DB_HOST || 'localhost',
// // //   user: process.env.DB_USER || 'root',
// // //   password: process.env.DB_PASSWORD || '',
// // //   database: process.env.DB_NAME || 'braintwist',
// // //   waitForConnections: true,
// // //   connectionLimit: 10,
// // // });

// // // const DEFAULT_BULBS = 100;

// // // // creates tables + seeds puzzle (same as level41.sql). Called once from the routes file.
// // // async function initLevel41Db() {
// // //   await pool.query(`CREATE TABLE IF NOT EXISTS bt_wallet (
// // //     user_id INT NOT NULL PRIMARY KEY,
// // //     bulbs INT NOT NULL DEFAULT ${DEFAULT_BULBS},
// // //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
// // //   await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_puzzle (
// // //     id INT AUTO_INCREMENT PRIMARY KEY,
// // //     title VARCHAR(100) NOT NULL,
// // //     answer VARCHAR(20) NOT NULL,
// // //     answer_length TINYINT NOT NULL,
// // //     clue_cost INT NOT NULL DEFAULT 25,
// // //     skip_cost INT NOT NULL DEFAULT 50,
// // //     reward INT NOT NULL DEFAULT 10,
// // //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
// // //   await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_progress (
// // //     id INT AUTO_INCREMENT PRIMARY KEY,
// // //     user_id INT NOT NULL,
// // //     puzzle_id INT NOT NULL,
// // //     status ENUM('playing','solved','skipped') NOT NULL DEFAULT 'playing',
// // //     attempts INT NOT NULL DEFAULT 0,
// // //     clues_used INT NOT NULL DEFAULT 0,
// // //     revealed_json JSON NULL,
// // //     solved_at DATETIME NULL,
// // //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
// // //     UNIQUE KEY uq_user_puzzle (user_id, puzzle_id))`);
// // //   await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_attempts (
// // //     id INT AUTO_INCREMENT PRIMARY KEY,
// // //     user_id INT NOT NULL,
// // //     puzzle_id INT NOT NULL,
// // //     guess VARCHAR(20) NOT NULL,
// // //     is_correct TINYINT(1) NOT NULL DEFAULT 0,
// // //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// // //     INDEX idx_user (user_id, puzzle_id))`);
// // //   await pool.query(
// // //     `INSERT INTO bt_level41_puzzle (title, answer, answer_length, clue_cost, skip_cost, reward)
// // //      SELECT 'Clouds raining B', 'BRAIN', 5, 25, 50, 10
// // //      WHERE NOT EXISTS (SELECT 1 FROM bt_level41_puzzle WHERE answer = 'BRAIN')`
// // //   );
// // // }

// // // async function getPuzzle(conn = pool) {
// // //   const [rows] = await conn.query('SELECT * FROM bt_level41_puzzle ORDER BY id LIMIT 1');
// // //   return rows[0];
// // // }

// // // async function ensureUser(conn, userId, puzzleId) {
// // //   await conn.query('INSERT IGNORE INTO bt_wallet (user_id, bulbs) VALUES (?, ?)', [userId, DEFAULT_BULBS]);
// // //   await conn.query(
// // //     `INSERT IGNORE INTO bt_level41_progress (user_id, puzzle_id, revealed_json) VALUES (?, ?, JSON_ARRAY())`,
// // //     [userId, puzzleId]
// // //   );
// // // }

// // // function parseRevealed(v) {
// // //   if (Array.isArray(v)) return v;
// // //   try { return JSON.parse(v || '[]'); } catch { return []; }
// // // }

// // // // builds the JSON the frontend needs (never contains the answer unless solved/skipped)
// // // async function buildState(conn, userId, puzzle) {
// // //   const [[p]] = await conn.query(
// // //     'SELECT * FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ?', [userId, puzzle.id]);
// // //   const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ?', [userId]);
// // //   const revealedIdx = parseRevealed(p.revealed_json);
// // //   return {
// // //     level: 41,
// // //     status: p.status,
// // //     answerLength: puzzle.answer_length,
// // //     attempts: p.attempts,
// // //     cluesUsed: p.clues_used,
// // //     bulbs: w.bulbs,
// // //     clueCost: puzzle.clue_cost,
// // //     skipCost: puzzle.skip_cost,
// // //     reward: puzzle.reward,
// // //     revealed: revealedIdx.map((i) => ({ index: i, letter: puzzle.answer[i] })),
// // //     answer: p.status === 'playing' ? undefined : puzzle.answer,
// // //   };
// // // }

// // // async function withTx(fn) {
// // //   const conn = await pool.getConnection();
// // //   try {
// // //     await conn.beginTransaction();
// // //     const out = await fn(conn);
// // //     await conn.commit();
// // //     return out;
// // //   } catch (e) {
// // //     await conn.rollback();
// // //     throw e;
// // //   } finally {
// // //     conn.release();
// // //   }
// // // }

// // // async function getLevel41(userId) {
// // //   return withTx(async (conn) => {
// // //     const puzzle = await getPuzzle(conn);
// // //     await ensureUser(conn, userId, puzzle.id);
// // //     return buildState(conn, userId, puzzle);
// // //   });
// // // }

// // // async function submitAnswer(userId, rawGuess) {
// // //   const guess = String(rawGuess || '').toUpperCase().replace(/[^A-Z]/g, '');
// // //   return withTx(async (conn) => {
// // //     const puzzle = await getPuzzle(conn);
// // //     await ensureUser(conn, userId, puzzle.id);
// // //     const [[p]] = await conn.query(
// // //       'SELECT status FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
// // //       [userId, puzzle.id]);
// // //     if (p.status !== 'playing') {
// // //       return { correct: p.status === 'solved', alreadyDone: true, state: await buildState(conn, userId, puzzle) };
// // //     }
// // //     const correct = guess === puzzle.answer;
// // //     await conn.query(
// // //       'INSERT INTO bt_level41_attempts (user_id, puzzle_id, guess, is_correct) VALUES (?,?,?,?)',
// // //       [userId, puzzle.id, guess.slice(0, 20), correct ? 1 : 0]);
// // //     if (correct) {
// // //       await conn.query(
// // //         `UPDATE bt_level41_progress SET attempts = attempts + 1, status = 'solved', solved_at = NOW()
// // //          WHERE user_id = ? AND puzzle_id = ?`, [userId, puzzle.id]);
// // //       await conn.query('UPDATE bt_wallet SET bulbs = bulbs + ? WHERE user_id = ?', [puzzle.reward, userId]);
// // //     } else {
// // //       await conn.query(
// // //         'UPDATE bt_level41_progress SET attempts = attempts + 1 WHERE user_id = ? AND puzzle_id = ?',
// // //         [userId, puzzle.id]);
// // //     }
// // //     return { correct, state: await buildState(conn, userId, puzzle) };
// // //   });
// // // }

// // // async function useClue(userId) {
// // //   return withTx(async (conn) => {
// // //     const puzzle = await getPuzzle(conn);
// // //     await ensureUser(conn, userId, puzzle.id);
// // //     const [[p]] = await conn.query(
// // //       'SELECT * FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
// // //       [userId, puzzle.id]);
// // //     const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ? FOR UPDATE', [userId]);
// // //     if (p.status !== 'playing') return { ok: false, error: 'LEVEL_FINISHED', state: await buildState(conn, userId, puzzle) };
// // //     const revealed = parseRevealed(p.revealed_json);
// // //     const hidden = [...Array(puzzle.answer_length).keys()].filter((i) => !revealed.includes(i));
// // //     if (hidden.length <= 1) return { ok: false, error: 'NO_MORE_CLUES', state: await buildState(conn, userId, puzzle) };
// // //     if (w.bulbs < puzzle.clue_cost) return { ok: false, error: 'NOT_ENOUGH_BULBS', state: await buildState(conn, userId, puzzle) };
// // //     const pick = hidden[Math.floor(Math.random() * hidden.length)];
// // //     revealed.push(pick);
// // //     await conn.query('UPDATE bt_wallet SET bulbs = bulbs - ? WHERE user_id = ?', [puzzle.clue_cost, userId]);
// // //     await conn.query(
// // //       'UPDATE bt_level41_progress SET clues_used = clues_used + 1, revealed_json = ? WHERE user_id = ? AND puzzle_id = ?',
// // //       [JSON.stringify(revealed), userId, puzzle.id]);
// // //     return { ok: true, state: await buildState(conn, userId, puzzle) };
// // //   });
// // // }

// // // async function skipLevel(userId) {
// // //   return withTx(async (conn) => {
// // //     const puzzle = await getPuzzle(conn);
// // //     await ensureUser(conn, userId, puzzle.id);
// // //     const [[p]] = await conn.query(
// // //       'SELECT status FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
// // //       [userId, puzzle.id]);
// // //     const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ? FOR UPDATE', [userId]);
// // //     if (p.status !== 'playing') return { ok: true, state: await buildState(conn, userId, puzzle) };
// // //     if (w.bulbs < puzzle.skip_cost) return { ok: false, error: 'NOT_ENOUGH_BULBS', state: await buildState(conn, userId, puzzle) };
// // //     await conn.query('UPDATE bt_wallet SET bulbs = bulbs - ? WHERE user_id = ?', [puzzle.skip_cost, userId]);
// // //     await conn.query(
// // //       `UPDATE bt_level41_progress SET status = 'skipped' WHERE user_id = ? AND puzzle_id = ?`,
// // //       [userId, puzzle.id]);
// // //     return { ok: true, state: await buildState(conn, userId, puzzle) };
// // //   });
// // // }

// // // module.exports = { pool, initLevel41Db, getLevel41, submitAnswer, useClue, skipLevel };
// // // level41Db.js  — MySQL layer for Brain Twist Level 41
// // const mysql = require('mysql2/promise');

// // const pool = mysql.createPool({
// //   host: process.env.DB_HOST || 'localhost',
// //   user: process.env.DB_USER || 'root',
// //   password: process.env.DB_PASSWORD || '',
// //   database: process.env.DB_NAME || 'code_breaker',
// //   waitForConnections: true,
// //   connectionLimit: 10,
// // });

// // const DEFAULT_BULBS = 100;

// // // creates tables + seeds puzzle (same as level41.sql). Call once at server start.
// // async function initLevel41Db() {
// //   await pool.query(`CREATE TABLE IF NOT EXISTS bt_wallet (
// //     user_id INT NOT NULL PRIMARY KEY,
// //     bulbs INT NOT NULL DEFAULT ${DEFAULT_BULBS},
// //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
// //   await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_puzzle (
// //     id INT AUTO_INCREMENT PRIMARY KEY,
// //     title VARCHAR(100) NOT NULL,
// //     answer VARCHAR(20) NOT NULL,
// //     answer_length TINYINT NOT NULL,
// //     clue_cost INT NOT NULL DEFAULT 25,
// //     skip_cost INT NOT NULL DEFAULT 50,
// //     reward INT NOT NULL DEFAULT 10,
// //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
// //   await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_progress (
// //     id INT AUTO_INCREMENT PRIMARY KEY,
// //     user_id INT NOT NULL,
// //     puzzle_id INT NOT NULL,
// //     status ENUM('playing','solved','skipped') NOT NULL DEFAULT 'playing',
// //     attempts INT NOT NULL DEFAULT 0,
// //     clues_used INT NOT NULL DEFAULT 0,
// //     revealed_json JSON NULL,
// //     solved_at DATETIME NULL,
// //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
// //     UNIQUE KEY uq_user_puzzle (user_id, puzzle_id))`);
// //   await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_attempts (
// //     id INT AUTO_INCREMENT PRIMARY KEY,
// //     user_id INT NOT NULL,
// //     puzzle_id INT NOT NULL,
// //     guess VARCHAR(20) NOT NULL,
// //     is_correct TINYINT(1) NOT NULL DEFAULT 0,
// //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// //     INDEX idx_user (user_id, puzzle_id))`);
// //   await pool.query(
// //     `INSERT INTO bt_level41_puzzle (title, answer, answer_length, clue_cost, skip_cost, reward)
// //      SELECT 'Clouds raining B', 'BRAIN', 5, 25, 50, 10
// //      WHERE NOT EXISTS (SELECT 1 FROM bt_level41_puzzle WHERE answer = 'BRAIN')`
// //   );
// // }

// // async function getPuzzle(conn = pool) {
// //   const [rows] = await conn.query('SELECT * FROM bt_level41_puzzle ORDER BY id LIMIT 1');
// //   return rows[0];
// // }

// // async function ensureUser(conn, userId, puzzleId) {
// //   await conn.query('INSERT IGNORE INTO bt_wallet (user_id, bulbs) VALUES (?, ?)', [userId, DEFAULT_BULBS]);
// //   await conn.query(
// //     `INSERT IGNORE INTO bt_level41_progress (user_id, puzzle_id, revealed_json) VALUES (?, ?, JSON_ARRAY())`,
// //     [userId, puzzleId]
// //   );
// // }

// // function parseRevealed(v) {
// //   if (Array.isArray(v)) return v;
// //   try { return JSON.parse(v || '[]'); } catch { return []; }
// // }

// // // builds the JSON the frontend needs (never contains the answer unless solved/skipped)
// // async function buildState(conn, userId, puzzle) {
// //   const [[p]] = await conn.query(
// //     'SELECT * FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ?', [userId, puzzle.id]);
// //   const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ?', [userId]);
// //   const revealedIdx = parseRevealed(p.revealed_json);
// //   return {
// //     level: 41,
// //     status: p.status,
// //     answerLength: puzzle.answer_length,
// //     attempts: p.attempts,
// //     cluesUsed: p.clues_used,
// //     bulbs: w.bulbs,
// //     clueCost: puzzle.clue_cost,
// //     skipCost: puzzle.skip_cost,
// //     reward: puzzle.reward,
// //     revealed: revealedIdx.map((i) => ({ index: i, letter: puzzle.answer[i] })),
// //     answer: p.status === 'playing' ? undefined : puzzle.answer,
// //   };
// // }

// // async function withTx(fn) {
// //   const conn = await pool.getConnection();
// //   try {
// //     await conn.beginTransaction();
// //     const out = await fn(conn);
// //     await conn.commit();
// //     return out;
// //   } catch (e) {
// //     await conn.rollback();
// //     throw e;
// //   } finally {
// //     conn.release();
// //   }
// // }

// // async function getLevel41(userId) {
// //   return withTx(async (conn) => {
// //     const puzzle = await getPuzzle(conn);
// //     await ensureUser(conn, userId, puzzle.id);
// //     return buildState(conn, userId, puzzle);
// //   });
// // }

// // async function submitAnswer(userId, rawGuess) {
// //   const guess = String(rawGuess || '').toUpperCase().replace(/[^A-Z]/g, '');
// //   return withTx(async (conn) => {
// //     const puzzle = await getPuzzle(conn);
// //     await ensureUser(conn, userId, puzzle.id);
// //     const [[p]] = await conn.query(
// //       'SELECT status FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
// //       [userId, puzzle.id]);
// //     if (p.status !== 'playing') {
// //       return { correct: p.status === 'solved', alreadyDone: true, state: await buildState(conn, userId, puzzle) };
// //     }
// //     const correct = guess === puzzle.answer;
// //     await conn.query(
// //       'INSERT INTO bt_level41_attempts (user_id, puzzle_id, guess, is_correct) VALUES (?,?,?,?)',
// //       [userId, puzzle.id, guess.slice(0, 20), correct ? 1 : 0]);
// //     if (correct) {
// //       await conn.query(
// //         `UPDATE bt_level41_progress SET attempts = attempts + 1, status = 'solved', solved_at = NOW()
// //          WHERE user_id = ? AND puzzle_id = ?`, [userId, puzzle.id]);
// //       await conn.query('UPDATE bt_wallet SET bulbs = bulbs + ? WHERE user_id = ?', [puzzle.reward, userId]);
// //     } else {
// //       await conn.query(
// //         'UPDATE bt_level41_progress SET attempts = attempts + 1 WHERE user_id = ? AND puzzle_id = ?',
// //         [userId, puzzle.id]);
// //     }
// //     return { correct, state: await buildState(conn, userId, puzzle) };
// //   });
// // }

// // async function useClue(userId) {
// //   return withTx(async (conn) => {
// //     const puzzle = await getPuzzle(conn);
// //     await ensureUser(conn, userId, puzzle.id);
// //     const [[p]] = await conn.query(
// //       'SELECT * FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
// //       [userId, puzzle.id]);
// //     const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ? FOR UPDATE', [userId]);
// //     if (p.status !== 'playing') return { ok: false, error: 'LEVEL_FINISHED', state: await buildState(conn, userId, puzzle) };
// //     const revealed = parseRevealed(p.revealed_json);
// //     const hidden = [...Array(puzzle.answer_length).keys()].filter((i) => !revealed.includes(i));
// //     if (hidden.length <= 1) return { ok: false, error: 'NO_MORE_CLUES', state: await buildState(conn, userId, puzzle) };
// //     if (w.bulbs < puzzle.clue_cost) return { ok: false, error: 'NOT_ENOUGH_BULBS', state: await buildState(conn, userId, puzzle) };
// //     const pick = hidden[Math.floor(Math.random() * hidden.length)];
// //     revealed.push(pick);
// //     await conn.query('UPDATE bt_wallet SET bulbs = bulbs - ? WHERE user_id = ?', [puzzle.clue_cost, userId]);
// //     await conn.query(
// //       'UPDATE bt_level41_progress SET clues_used = clues_used + 1, revealed_json = ? WHERE user_id = ? AND puzzle_id = ?',
// //       [JSON.stringify(revealed), userId, puzzle.id]);
// //     return { ok: true, state: await buildState(conn, userId, puzzle) };
// //   });
// // }

// // async function skipLevel(userId) {
// //   return withTx(async (conn) => {
// //     const puzzle = await getPuzzle(conn);
// //     await ensureUser(conn, userId, puzzle.id);
// //     const [[p]] = await conn.query(
// //       'SELECT status FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
// //       [userId, puzzle.id]);
// //     const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ? FOR UPDATE', [userId]);
// //     if (p.status !== 'playing') return { ok: true, state: await buildState(conn, userId, puzzle) };
// //     if (w.bulbs < puzzle.skip_cost) return { ok: false, error: 'NOT_ENOUGH_BULBS', state: await buildState(conn, userId, puzzle) };
// //     await conn.query('UPDATE bt_wallet SET bulbs = bulbs - ? WHERE user_id = ?', [puzzle.skip_cost, userId]);
// //     await conn.query(
// //       `UPDATE bt_level41_progress SET status = 'skipped' WHERE user_id = ? AND puzzle_id = ?`,
// //       [userId, puzzle.id]);
// //     return { ok: true, state: await buildState(conn, userId, puzzle) };
// //   });
// // }

// // module.exports = { pool, initLevel41Db, getLevel41, submitAnswer, useClue, skipLevel };
// // level41Db.js  — MySQL layer for Brain Twist Level 41
// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'code_breaker',
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// const DEFAULT_BULBS = 100;

// // creates tables + seeds puzzle (same as level41.sql). Call once at server start.
// async function initLevel41Db() {
//   await pool.query(`CREATE TABLE IF NOT EXISTS bt_wallet (
//     user_id INT NOT NULL PRIMARY KEY,
//     bulbs INT NOT NULL DEFAULT ${DEFAULT_BULBS},
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
//   await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_puzzle (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     title VARCHAR(100) NOT NULL,
//     answer VARCHAR(20) NOT NULL,
//     answer_length TINYINT NOT NULL,
//     clue_cost INT NOT NULL DEFAULT 25,
//     skip_cost INT NOT NULL DEFAULT 50,
//     reward INT NOT NULL DEFAULT 10,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
//   await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_progress (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT NOT NULL,
//     puzzle_id INT NOT NULL,
//     status ENUM('playing','solved','skipped') NOT NULL DEFAULT 'playing',
//     attempts INT NOT NULL DEFAULT 0,
//     clues_used INT NOT NULL DEFAULT 0,
//     revealed_json JSON NULL,
//     solved_at DATETIME NULL,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     UNIQUE KEY uq_user_puzzle (user_id, puzzle_id))`);
//   await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_attempts (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT NOT NULL,
//     puzzle_id INT NOT NULL,
//     guess VARCHAR(20) NOT NULL,
//     is_correct TINYINT(1) NOT NULL DEFAULT 0,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     INDEX idx_user (user_id, puzzle_id))`);
//   await pool.query(
//     `INSERT INTO bt_level41_puzzle (title, answer, answer_length, clue_cost, skip_cost, reward)
//      SELECT 'Clouds raining B', 'BRAIN', 5, 25, 50, 10
//      WHERE NOT EXISTS (SELECT 1 FROM bt_level41_puzzle WHERE answer = 'BRAIN')`
//   );
// }

// async function getPuzzle(conn = pool) {
//   const [rows] = await conn.query('SELECT * FROM bt_level41_puzzle ORDER BY id LIMIT 1');
//   return rows[0];
// }

// async function ensureUser(conn, userId, puzzleId) {
//   await conn.query('INSERT IGNORE INTO bt_wallet (user_id, bulbs) VALUES (?, ?)', [userId, DEFAULT_BULBS]);
//   await conn.query(
//     `INSERT IGNORE INTO bt_level41_progress (user_id, puzzle_id, revealed_json) VALUES (?, ?, JSON_ARRAY())`,
//     [userId, puzzleId]
//   );
// }

// function parseRevealed(v) {
//   if (Array.isArray(v)) return v;
//   try { return JSON.parse(v || '[]'); } catch { return []; }
// }

// // builds the JSON the frontend needs (never contains the answer unless solved/skipped)
// async function buildState(conn, userId, puzzle) {
//   const [[p]] = await conn.query(
//     'SELECT * FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ?', [userId, puzzle.id]);
//   const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ?', [userId]);
//   const revealedIdx = parseRevealed(p.revealed_json);
//   return {
//     level: 41,
//     status: p.status,
//     answerLength: puzzle.answer_length,
//     attempts: p.attempts,
//     cluesUsed: p.clues_used,
//     bulbs: w.bulbs,
//     clueCost: puzzle.clue_cost,
//     skipCost: puzzle.skip_cost,
//     reward: puzzle.reward,
//     revealed: revealedIdx.map((i) => ({ index: i, letter: puzzle.answer[i] })),
//   };
// }

// async function withTx(fn) {
//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();
//     const out = await fn(conn);
//     await conn.commit();
//     return out;
//   } catch (e) {
//     await conn.rollback();
//     throw e;
//   } finally {
//     conn.release();
//   }
// }

// async function getLevel41(userId) {
//   return withTx(async (conn) => {
//     const puzzle = await getPuzzle(conn);
//     await ensureUser(conn, userId, puzzle.id);
//     return buildState(conn, userId, puzzle);
//   });
// }

// async function submitAnswer(userId, rawGuess) {
//   const guess = String(rawGuess || '').toUpperCase().replace(/[^A-Z]/g, '');
//   return withTx(async (conn) => {
//     const puzzle = await getPuzzle(conn);
//     await ensureUser(conn, userId, puzzle.id);
//     const [[p]] = await conn.query(
//       'SELECT status FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
//       [userId, puzzle.id]);
//     if (p.status !== 'playing') {
//       return { correct: guess === puzzle.answer, alreadyDone: true, state: await buildState(conn, userId, puzzle) };
//     }
//     const correct = guess === puzzle.answer;
//     await conn.query(
//       'INSERT INTO bt_level41_attempts (user_id, puzzle_id, guess, is_correct) VALUES (?,?,?,?)',
//       [userId, puzzle.id, guess.slice(0, 20), correct ? 1 : 0]);
//     if (correct) {
//       await conn.query(
//         `UPDATE bt_level41_progress SET attempts = attempts + 1, status = 'solved', solved_at = NOW()
//          WHERE user_id = ? AND puzzle_id = ?`, [userId, puzzle.id]);
//       await conn.query('UPDATE bt_wallet SET bulbs = bulbs + ? WHERE user_id = ?', [puzzle.reward, userId]);
//     } else {
//       await conn.query(
//         'UPDATE bt_level41_progress SET attempts = attempts + 1 WHERE user_id = ? AND puzzle_id = ?',
//         [userId, puzzle.id]);
//     }
//     return { correct, state: await buildState(conn, userId, puzzle) };
//   });
// }

// async function useClue(userId) {
//   return withTx(async (conn) => {
//     const puzzle = await getPuzzle(conn);
//     await ensureUser(conn, userId, puzzle.id);
//     const [[p]] = await conn.query(
//       'SELECT * FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
//       [userId, puzzle.id]);
//     const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ? FOR UPDATE', [userId]);
//     if (p.status !== 'playing') return { ok: false, error: 'LEVEL_FINISHED', state: await buildState(conn, userId, puzzle) };
//     const revealed = parseRevealed(p.revealed_json);
//     const hidden = [...Array(puzzle.answer_length).keys()].filter((i) => !revealed.includes(i));
//     if (hidden.length <= 1) return { ok: false, error: 'NO_MORE_CLUES', state: await buildState(conn, userId, puzzle) };
//     if (w.bulbs < puzzle.clue_cost) return { ok: false, error: 'NOT_ENOUGH_BULBS', state: await buildState(conn, userId, puzzle) };
//     const pick = hidden[Math.floor(Math.random() * hidden.length)];
//     revealed.push(pick);
//     await conn.query('UPDATE bt_wallet SET bulbs = bulbs - ? WHERE user_id = ?', [puzzle.clue_cost, userId]);
//     await conn.query(
//       'UPDATE bt_level41_progress SET clues_used = clues_used + 1, revealed_json = ? WHERE user_id = ? AND puzzle_id = ?',
//       [JSON.stringify(revealed), userId, puzzle.id]);
//     return { ok: true, state: await buildState(conn, userId, puzzle) };
//   });
// }

// async function skipLevel(userId) {
//   return withTx(async (conn) => {
//     const puzzle = await getPuzzle(conn);
//     await ensureUser(conn, userId, puzzle.id);
//     const [[p]] = await conn.query(
//       'SELECT status FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
//       [userId, puzzle.id]);
//     const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ? FOR UPDATE', [userId]);
//     if (p.status !== 'playing') return { ok: true, state: await buildState(conn, userId, puzzle) };
//     if (w.bulbs < puzzle.skip_cost) return { ok: false, error: 'NOT_ENOUGH_BULBS', state: await buildState(conn, userId, puzzle) };
//     await conn.query('UPDATE bt_wallet SET bulbs = bulbs - ? WHERE user_id = ?', [puzzle.skip_cost, userId]);
//     await conn.query(
//       `UPDATE bt_level41_progress SET status = 'skipped' WHERE user_id = ? AND puzzle_id = ?`,
//       [userId, puzzle.id]);
//     return { ok: true, state: await buildState(conn, userId, puzzle) };
//   });
// }

// module.exports = { pool, initLevel41Db, getLevel41, submitAnswer, useClue, skipLevel };
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'code_breaker',
  waitForConnections: true,
  connectionLimit: 10,
});

const DEFAULT_BULBS = 100;
const LEVEL41_ANSWER = 'BRAIN';

// creates tables + seeds puzzle. Call once at server start.
async function initLevel41Db() {
  await pool.query(`CREATE TABLE IF NOT EXISTS bt_wallet (
    user_id INT NOT NULL PRIMARY KEY,
    bulbs INT NOT NULL DEFAULT ${DEFAULT_BULBS},
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_puzzle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    answer VARCHAR(20) NOT NULL,
    answer_length TINYINT NOT NULL,
    clue_cost INT NOT NULL DEFAULT 25,
    skip_cost INT NOT NULL DEFAULT 50,
    reward INT NOT NULL DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    puzzle_id INT NOT NULL,
    status ENUM('playing','solved','skipped') NOT NULL DEFAULT 'playing',
    attempts INT NOT NULL DEFAULT 0,
    clues_used INT NOT NULL DEFAULT 0,
    revealed_json JSON NULL,
    solved_at DATETIME NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_puzzle (user_id, puzzle_id))`);
  await pool.query(`CREATE TABLE IF NOT EXISTS bt_level41_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    puzzle_id INT NOT NULL,
    guess VARCHAR(20) NOT NULL,
    is_correct TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id, puzzle_id))`);

  // no row yet -> insert
  await pool.query(
    `INSERT INTO bt_level41_puzzle (title, answer, answer_length, clue_cost, skip_cost, reward)
     SELECT 'Clouds raining B', ?, ?, 25, 50, 10
     FROM DUAL
     WHERE NOT EXISTS (SELECT 1 FROM bt_level41_puzzle)`,
    [LEVEL41_ANSWER, LEVEL41_ANSWER.length]
  );
  // row already there (old/wrong data) -> force the first puzzle to BRAIN
  await pool.query(
    `UPDATE bt_level41_puzzle
        SET title = 'Clouds raining B', answer = ?, answer_length = ?
      ORDER BY id LIMIT 1`,
    [LEVEL41_ANSWER, LEVEL41_ANSWER.length]
  );
}

// always returns a clean puzzle: answer trimmed + UPPERCASE, length matches answer
async function getPuzzle(conn = pool) {
  const [rows] = await conn.query('SELECT * FROM bt_level41_puzzle ORDER BY id LIMIT 1');
  const p = rows[0];
  const answer = String(p.answer || '').trim().toUpperCase().replace(/[^A-Z]/g, '');
  return { ...p, answer, answer_length: answer.length };
}

async function ensureUser(conn, userId, puzzleId) {
  await conn.query('INSERT IGNORE INTO bt_wallet (user_id, bulbs) VALUES (?, ?)', [userId, DEFAULT_BULBS]);
  await conn.query(
    `INSERT IGNORE INTO bt_level41_progress (user_id, puzzle_id, revealed_json) VALUES (?, ?, JSON_ARRAY())`,
    [userId, puzzleId]
  );
}

function parseRevealed(v) {
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v || '[]'); } catch { return []; }
}

// builds the JSON the frontend needs (never contains the answer unless solved/skipped)
async function buildState(conn, userId, puzzle) {
  const [[p]] = await conn.query(
    'SELECT * FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ?', [userId, puzzle.id]);
  const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ?', [userId]);
  const revealedIdx = parseRevealed(p.revealed_json);
  return {
    level: 41,
    status: p.status,
    answerLength: puzzle.answer_length,
    attempts: p.attempts,
    cluesUsed: p.clues_used,
    bulbs: w.bulbs,
    clueCost: 0,
    skipCost: puzzle.skip_cost,
    reward: puzzle.reward,
    revealed: revealedIdx.map((i) => ({ index: i, letter: puzzle.answer[i] })),
  };
}

async function withTx(fn) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const out = await fn(conn);
    await conn.commit();
    return out;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

async function getLevel41(userId) {
  return withTx(async (conn) => {
    const puzzle = await getPuzzle(conn);
    await ensureUser(conn, userId, puzzle.id);
    return buildState(conn, userId, puzzle);
  });
}

async function submitAnswer(userId, rawGuess) {
  const guess = String(rawGuess || '').trim().toUpperCase().replace(/[^A-Z]/g, '');
  return withTx(async (conn) => {
    const puzzle = await getPuzzle(conn);
    await ensureUser(conn, userId, puzzle.id);
    const [[p]] = await conn.query(
      'SELECT status FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
      [userId, puzzle.id]);
    const correct = guess.length > 0 && guess === puzzle.answer;
    if (p.status !== 'playing') {
      return { correct, alreadyDone: true, state: await buildState(conn, userId, puzzle) };
    }
    await conn.query(
      'INSERT INTO bt_level41_attempts (user_id, puzzle_id, guess, is_correct) VALUES (?,?,?,?)',
      [userId, puzzle.id, guess.slice(0, 20), correct ? 1 : 0]);
    if (correct) {
      await conn.query(
        `UPDATE bt_level41_progress SET attempts = attempts + 1, status = 'solved', solved_at = NOW()
         WHERE user_id = ? AND puzzle_id = ?`, [userId, puzzle.id]);
      await conn.query('UPDATE bt_wallet SET bulbs = bulbs + ? WHERE user_id = ?', [puzzle.reward, userId]);
    } else {
      await conn.query(
        'UPDATE bt_level41_progress SET attempts = attempts + 1 WHERE user_id = ? AND puzzle_id = ?',
        [userId, puzzle.id]);
    }
    return { correct, state: await buildState(conn, userId, puzzle) };
  });
}

async function useClue(userId) {
  return withTx(async (conn) => {
    const puzzle = await getPuzzle(conn);
    await ensureUser(conn, userId, puzzle.id);
    const [[p]] = await conn.query(
      'SELECT * FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
      [userId, puzzle.id]);
    if (p.status !== 'playing') return { ok: false, error: 'LEVEL_FINISHED', state: await buildState(conn, userId, puzzle) };
    const revealed = parseRevealed(p.revealed_json);
    const hidden = [...Array(puzzle.answer_length).keys()].filter((i) => !revealed.includes(i));
    if (hidden.length <= 1) return { ok: false, error: 'NO_MORE_CLUES', state: await buildState(conn, userId, puzzle) };
    const pick = hidden[Math.floor(Math.random() * hidden.length)];
    revealed.push(pick);
    await conn.query(
      'UPDATE bt_level41_progress SET clues_used = clues_used + 1, revealed_json = ? WHERE user_id = ? AND puzzle_id = ?',
      [JSON.stringify(revealed), userId, puzzle.id]);
    return { ok: true, state: await buildState(conn, userId, puzzle) };
  });
}

async function skipLevel(userId) {
  return withTx(async (conn) => {
    const puzzle = await getPuzzle(conn);
    await ensureUser(conn, userId, puzzle.id);
    const [[p]] = await conn.query(
      'SELECT status FROM bt_level41_progress WHERE user_id = ? AND puzzle_id = ? FOR UPDATE',
      [userId, puzzle.id]);
    const [[w]] = await conn.query('SELECT bulbs FROM bt_wallet WHERE user_id = ? FOR UPDATE', [userId]);
    if (p.status !== 'playing') return { ok: true, state: await buildState(conn, userId, puzzle) };
    if (w.bulbs < puzzle.skip_cost) return { ok: false, error: 'NOT_ENOUGH_BULBS', state: await buildState(conn, userId, puzzle) };
    await conn.query('UPDATE bt_wallet SET bulbs = bulbs - ? WHERE user_id = ?', [puzzle.skip_cost, userId]);
    await conn.query(
      `UPDATE bt_level41_progress SET status = 'skipped' WHERE user_id = ? AND puzzle_id = ?`,
      [userId, puzzle.id]);
    return { ok: true, state: await buildState(conn, userId, puzzle) };
  });
}

module.exports = { pool, initLevel41Db, getLevel41, submitAnswer, useClue, skipLevel };