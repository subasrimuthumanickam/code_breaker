// const express = require('express');
// const L31 = require('../data/level31Db');

// const r = express.Router();

// const LEVEL = L31.LEVEL;
// const NEXT_LEVEL = LEVEL + 1;
// const COST_HINT = 25;
// const COST_SKIP = 50;
// const REWARD_VIDEO = 75;

// /* ---------------------------------------------------------
//    LEVEL 31 - find the mistake
//    the sentence has a double word: "find the the mistake"
//    the answer is the repeated word: "the"
// --------------------------------------------------------- */

// // NOTE: the double "the" is the mistake - do not fix it!
// const QUESTION = '84% of people reading this will not find the the mistake in this.';
// const LINES = ['A, B, C, D, E, F, G, H, I, J, K, L, M,', 'N, O, P, Q, R, S, T, U, V, W, X, Y, Z.'];
// const CLUE_TEXT = 'Read the sentence slowly, word by word. One word is written twice in a row.';

// // "the" -> "the"
// const clean = (v) =>
//   String(v === undefined || v === null ? '' : v)
//     .toLowerCase()
//     .replace(/[^a-z0-9]/g, '');

// // accepted answers (already cleaned): "the" or "the the"
// const ACCEPTED = ['the', 'thethe'];

// // score from the number of tries
// const grade = (attempts) => {
//   if (attempts <= 1) return { score: 300, stars: 3 };
//   if (attempts <= 3) return { score: 200, stars: 2 };
//   return { score: 100, stars: 1 };
// };

// /* ---------------------------------------------------------
//    HELPERS
// --------------------------------------------------------- */

// const handle = (fn) => async (req, res) => {
//   try {
//     await fn(req, res);
//   } catch (err) {
//     console.error('[BrainTwist L31 Error]', req.method, req.originalUrl, err);
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

// // wait until the level 31 tables exist before any request runs
// r.use(async (req, res, next) => {
//   await L31.ready;
//   next();
// });

// // unlock level 32 - a failure here must never break the answer
// const tryUnlock = async (playerId, attempts) => {
//   try {
//     await L31.unlockNext(playerId, attempts);
//   } catch (err) {
//     console.error('[BrainTwist L31] could not unlock next level:', err.message);
//   }
// };

// const progressOf = (st) => ({
//   attempts: st ? Number(st.attempts) || 0 : 0,
//   solved: Boolean(st && st.solved),
//   skipped: Boolean(st && st.skipped),
//   hintsUsed: st ? Number(st.hints_used) || 0 : 0,
// });

// /* ---------------------------------------------------------
//    POST /start   body: { playerId }
//    every time the level is opened: a fresh game
// --------------------------------------------------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const player = await L31.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   const state = await L31.resetState(playerId);

//   res.json({
//     success: true,
//     level: LEVEL,
//     question: QUESTION,
//     lines: LINES,
//     hintCost: COST_HINT,
//     skipCost: COST_SKIP,
//     videoReward: REWARD_VIDEO,
//     hints: Number(player.hints) || 0,
//     progress: progressOf(state),
//   });
// }));

// /* ---------------------------------------------------------
//    POST /answer   body: { playerId, answer }
//    right answer -> saved in the database, level 32 unlocked
//    wrong answer -> correct:false (the try is saved too)
// --------------------------------------------------------- */

// r.post('/answer', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const given = req.body && req.body.answer;
//   if (given === undefined || given === null || String(given).trim() === '') {
//     return bad(res, 400, 'answer_required', 'answer is required');
//   }

//   const player = await L31.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   await L31.ensureState(playerId);

//   const correct = ACCEPTED.includes(clean(given));
//   const attempts = await L31.addAttempt(playerId);
//   await L31.logAnswer(playerId, given, correct);

//   if (!correct) {
//     return res.json({
//       success: true,
//       correct: false,
//       attempts,
//       message: 'Not quite. Try again!',
//     });
//   }

//   const { score, stars } = grade(attempts);
//   await L31.markSolved(playerId);

//   try {
//     await L31.saveProgress(playerId, score, stars, attempts);
//   } catch (err) {
//     console.error('[BrainTwist L31] could not save progress:', err.message);
//   }
//   await tryUnlock(playerId, attempts);

//   res.json({
//     success: true,
//     correct: true,
//     attempts,
//     answer: 'the',
//     message: 'Correct! Well done!',
//     score,
//     stars,
//     next: NEXT_LEVEL,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /hint   body: { playerId }   (costs 25 hints)
// --------------------------------------------------------- */

// r.post('/hint', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const player = await L31.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   await L31.ensureState(playerId);

//   const hints = await L31.spendHints(playerId, COST_HINT);
//   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

//   await L31.markHintUsed(playerId);
//   await L31.logHint(playerId, hints);

//   res.json({ success: true, hints, hint: { text: CLUE_TEXT } });
// }));

// /* ---------------------------------------------------------
//    POST /skip   body: { playerId }   (costs 50 hints)
// --------------------------------------------------------- */

// r.post('/skip', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const player = await L31.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   const state = await L31.ensureState(playerId);

//   const hints = await L31.spendHints(playerId, COST_SKIP);
//   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

//   await L31.markSkipped(playerId);
//   const attempts = Math.max(1, Number(state.attempts) || 0);
//   await tryUnlock(playerId, attempts);

//   res.json({ success: true, hints, skipped: true, attempts });
// }));

// /* ---------------------------------------------------------
//    POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
// --------------------------------------------------------- */

// r.post('/reward', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
//   if (!req.body || req.body.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

//   const player = await L31.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   const hints = await L31.addHints(playerId, REWARD_VIDEO);
//   res.json({ success: true, hints, added: REWARD_VIDEO });
// }));

// /* ---------------------------------------------------------
//    GET /status/:playerId
// --------------------------------------------------------- */

// r.get('/status/:playerId', handle(async (req, res) => {
//   const playerId = toId(req.params.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const row = await L31.getProgress(playerId);

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
const db = require('../db');

const LEVEL = 31;

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

const ready = (async () => {
  // one row per player: the state of the game that is open now
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level31_state (
      player_id INT PRIMARY KEY,
      attempts INT NOT NULL DEFAULT 0,
      solved TINYINT(1) NOT NULL DEFAULT 0,
      skipped TINYINT(1) NOT NULL DEFAULT 0,
      hints_used INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // every answer the player types (right or wrong)
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level31_answers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      answer VARCHAR(100) NOT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l31_ans_player (player_id)
    )
  `);

  // every tap on the clue button
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level31_hint_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      hints_left INT NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l31_hint_player (player_id)
    )
  `);

  console.log('[BrainTwist L31] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L31] could not create tables:', err.message)
);

/* ---------- player / hints ---------- */

const getPlayer = (playerId) =>
  one('SELECT id, hints FROM bt_players WHERE id = ?', [playerId]);

const getHints = async (playerId) => {
  const row = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
  return row ? Number(row.hints) || 0 : 0;
};

// takes `amount` hints; null when the player does not have enough
const spendHints = async (playerId, amount) => {
  const [r] = await db.query(
    'UPDATE bt_players SET hints = hints - ? WHERE id = ? AND hints >= ?',
    [amount, playerId, amount]
  );
  if (!r.affectedRows) return null;
  return getHints(playerId);
};

const addHints = async (playerId, amount) => {
  await db.query('UPDATE bt_players SET hints = hints + ? WHERE id = ?', [amount, playerId]);
  return getHints(playerId);
};

/* ---------- game state ---------- */

// every time the level is opened: a fresh game
const resetState = async (playerId) => {
  await db.query(
    `INSERT INTO bt_level31_state (player_id, attempts, solved, skipped, hints_used, started_at, updated_at)
     VALUES (?, 0, 0, 0, 0, NOW(), NOW())
     ON DUPLICATE KEY UPDATE attempts = 0, solved = 0, skipped = 0, hints_used = 0,
                             started_at = NOW(), updated_at = NOW()`,
    [playerId]
  );
  return getState(playerId);
};

const getState = (playerId) =>
  one('SELECT * FROM bt_level31_state WHERE player_id = ?', [playerId]);

// makes sure the row exists (when /answer is called before /start)
const ensureState = async (playerId) => {
  const found = await getState(playerId);
  return found || resetState(playerId);
};

const addAttempt = async (playerId) => {
  await db.query(
    'UPDATE bt_level31_state SET attempts = attempts + 1, updated_at = NOW() WHERE player_id = ?',
    [playerId]
  );
  const row = await getState(playerId);
  return row ? Number(row.attempts) : 1;
};

const markHintUsed = (playerId) =>
  db.query(
    'UPDATE bt_level31_state SET hints_used = hints_used + 1, updated_at = NOW() WHERE player_id = ?',
    [playerId]
  );

const markSolved = (playerId) =>
  db.query('UPDATE bt_level31_state SET solved = 1, updated_at = NOW() WHERE player_id = ?', [playerId]);

const markSkipped = (playerId) =>
  db.query(
    'UPDATE bt_level31_state SET skipped = 1, updated_at = NOW() WHERE player_id = ?',
    [playerId]
  );

const logAnswer = (playerId, answer, correct) =>
  db.query('INSERT INTO bt_level31_answers (player_id, answer, is_correct) VALUES (?, ?, ?)', [
    playerId,
    String(answer).slice(0, 100),
    correct ? 1 : 0,
  ]);

const logHint = (playerId, hintsLeft) =>
  db.query('INSERT INTO bt_level31_hint_log (player_id, hints_left) VALUES (?, ?)', [
    playerId,
    hintsLeft,
  ]);

/* ---------- progress ---------- */

const saveProgress = async (playerId, score, stars, attempts) => {
  const found = await one(
    'SELECT id FROM brain_twist_progress WHERE player_id = ? AND level_number = ?',
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

const unlockNext = async (playerId, attempts) => {
  await db.query(
    `INSERT INTO bt_progress (player_id, level_n, attempts, solved_at)
     VALUES (?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE solved_at = COALESCE(solved_at, NOW())`,
    [playerId, LEVEL, attempts]
  );

  await db.query(
    `UPDATE bt_players
     SET current_level = GREATEST(COALESCE(current_level, 1), ?)
     WHERE id = ?`,
    [LEVEL + 1, playerId]
  );
};

const getProgress = (playerId) =>
  one(
    `SELECT is_completed, score, stars, attempts, completed_at
     FROM brain_twist_progress WHERE player_id = ? AND level_number = ?`,
    [playerId, LEVEL]
  );

module.exports = {
  LEVEL,
  ready,
  getPlayer,
  getHints,
  spendHints,
  addHints,
  resetState,
  getState,
  ensureState,
  addAttempt,
  markHintUsed,
  markSolved,
  markSkipped,
  logAnswer,
  logHint,
  saveProgress,
  unlockNext,
  getProgress,
};