// // // data/level30Db.js - Level 30 (rebus: can + you + be + ready + at + 5) SQL storage
// // const pool = require('../db'); // mysql2/promise pool (same as level 26 / 27 / 28)

// // const LEVEL = 30;
// // const HINT_COST = 25;
// // const SKIP_COST = 50;
// // const VIDEO_REWARD = 75;

// // const q = async (sql, params = []) => {
// //   const [r] = await pool.query(sql, params);
// //   return r;
// // };

// // // lowercase, remove punctuation, single spaces: "Can you be ready at 5!" -> "can you be ready at 5"
// // const norm = (s) =>
// //   String(s || '')
// //     .toLowerCase()
// //     .replace(/[^a-z0-9\s]/g, '')
// //     .replace(/\s+/g, ' ')
// //     .trim();

// // // ---------------------------------------------------------------------------
// // // Tables + seed (runs once, safe to run many times)
// // // ---------------------------------------------------------------------------
// // let initPromise = null;

// // function init() {
// //   if (initPromise) return initPromise;
// //   initPromise = (async () => {
// //     await q(`CREATE TABLE IF NOT EXISTS braintwist_level30_config (
// //       level        INT PRIMARY KEY,
// //       question     VARCHAR(255) NOT NULL,
// //       pieces       VARCHAR(100) NOT NULL,
// //       answer       VARCHAR(100) NOT NULL,
// //       alt_answers  VARCHAR(500) NOT NULL DEFAULT '',
// //       clue1        TEXT NOT NULL,
// //       clue2        TEXT NOT NULL,
// //       clue3        TEXT NOT NULL
// //     )`);

// //     await q(`CREATE TABLE IF NOT EXISTS braintwist_level30_progress (
// //       player_id    VARCHAR(64) PRIMARY KEY,
// //       attempts     INT        NOT NULL DEFAULT 0,
// //       hints_used   INT        NOT NULL DEFAULT 0,
// //       solved       TINYINT(1) NOT NULL DEFAULT 0,
// //       skipped      TINYINT(1) NOT NULL DEFAULT 0,
// //       last_answer  VARCHAR(100) NULL,
// //       solved_at    TIMESTAMP  NULL DEFAULT NULL,
// //       updated_at   TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// //     )`);

// //     await q(`CREATE TABLE IF NOT EXISTS braintwist_level30_attempts (
// //       id          INT AUTO_INCREMENT PRIMARY KEY,
// //       player_id   VARCHAR(64)  NOT NULL,
// //       answer      VARCHAR(100) NOT NULL,
// //       is_correct  TINYINT(1)   NOT NULL DEFAULT 0,
// //       created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
// //       INDEX idx_l30_player (player_id)
// //     )`);

// //     await q(
// //       `INSERT IGNORE INTO braintwist_level30_config
// //         (level, question, pieces, answer, alt_answers, clue1, clue2, clue3) VALUES (?,?,?,?,?,?,?,?)`,
// //       [
// //         LEVEL,
// //         'Can you translate this into words?',
// //         'can,you,be,ready,at,five', // art keys, shown left to right
// //         'Can you be ready at 5',
// //         'can you be ready at five,can you be ready at 5 oclock,can you be ready at 5 o clock,can you be ready at five oclock',
// //         'Say what each picture is, one by one, from left to right.',
// //         'It is a question. It starts with the soda can and ends with the clock.',
// //         'Can + You + Be + Ready + At + 5',
// //       ]
// //     );
// //   })().catch((e) => {
// //     initPromise = null; // try again on the next request
// //     throw e;
// //   });
// //   return initPromise;
// // }

// // // ---------------------------------------------------------------------------
// // // Config
// // // ---------------------------------------------------------------------------
// // async function getConfig() {
// //   await init();
// //   const rows = await q('SELECT * FROM braintwist_level30_config WHERE level = ?', [LEVEL]);
// //   const r = rows[0];
// //   if (!r) throw new Error('Level 30 config is missing');
// //   const accepted = [norm(r.answer)].concat(
// //     String(r.alt_answers || '')
// //       .split(',')
// //       .map(norm)
// //       .filter(Boolean)
// //   );
// //   return {
// //     question: r.question,
// //     pieces: String(r.pieces).split(','),
// //     answer: r.answer,
// //     accepted,
// //     clues: [r.clue1, r.clue2, r.clue3],
// //   };
// // }

// // // ---------------------------------------------------------------------------
// // // Progress + attempts
// // // ---------------------------------------------------------------------------
// // async function ensureProgress(playerId) {
// //   await init();
// //   await q('INSERT IGNORE INTO braintwist_level30_progress (player_id) VALUES (?)', [String(playerId)]);
// //   const rows = await q('SELECT * FROM braintwist_level30_progress WHERE player_id = ?', [String(playerId)]);
// //   return rows[0];
// // }

// // // saves one typed answer; returns the new attempt number
// // async function saveAnswer(playerId, answer, correct) {
// //   await ensureProgress(playerId);
// //   await q(
// //     'INSERT INTO braintwist_level30_attempts (player_id, answer, is_correct) VALUES (?,?,?)',
// //     [String(playerId), String(answer).slice(0, 100), correct ? 1 : 0]
// //   );
// //   if (correct) {
// //     await q(
// //       `UPDATE braintwist_level30_progress
// //           SET attempts = attempts + 1, solved = 1, last_answer = ?, solved_at = CURRENT_TIMESTAMP
// //         WHERE player_id = ?`,
// //       [String(answer).slice(0, 100), String(playerId)]
// //     );
// //   } else {
// //     await q(
// //       'UPDATE braintwist_level30_progress SET attempts = attempts + 1, last_answer = ? WHERE player_id = ?',
// //       [String(answer).slice(0, 100), String(playerId)]
// //     );
// //   }
// //   const p = await ensureProgress(playerId);
// //   return Number(p.attempts);
// // }

// // // counts one used clue; returns how many clues were used so far
// // async function addHintUsed(playerId) {
// //   await ensureProgress(playerId);
// //   await q('UPDATE braintwist_level30_progress SET hints_used = hints_used + 1 WHERE player_id = ?', [String(playerId)]);
// //   const p = await ensureProgress(playerId);
// //   return Number(p.hints_used);
// // }

// // async function markSkip(playerId) {
// //   await ensureProgress(playerId);
// //   await q('UPDATE braintwist_level30_progress SET skipped = 1 WHERE player_id = ?', [String(playerId)]);
// // }

// // // ---------------------------------------------------------------------------
// // // Hint balance (shared with all other levels: bt_players.hints)
// // // ---------------------------------------------------------------------------
// // async function getHints(playerId) {
// //   const rows = await q('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
// //   return rows[0] ? Number(rows[0].hints) || 0 : 0;
// // }

// // // takes `cost` hints in one atomic step; returns the new balance or null if not enough
// // async function spendHints(playerId, cost) {
// //   const r = await q(
// //     'UPDATE bt_players SET hints = hints - ? WHERE id = ? AND hints >= ?',
// //     [cost, playerId, cost]
// //   );
// //   if (!r.affectedRows) return null;
// //   return getHints(playerId);
// // }

// // async function addHints(playerId, amount) {
// //   await q('UPDATE bt_players SET hints = hints + ? WHERE id = ?', [amount, playerId]);
// //   return getHints(playerId);
// // }

// // module.exports = {
// //   LEVEL,
// //   HINT_COST,
// //   SKIP_COST,
// //   VIDEO_REWARD,
// //   norm,
// //   init,
// //   getConfig,
// //   ensureProgress,
// //   saveAnswer,
// //   addHintUsed,
// //   markSkip,
// //   getHints,
// //   spendHints,
// //   addHints,
// // };
// const db = require('../db');

// const LEVEL = 30;

// const one = async (sql, params = []) => {
//   const [rows] = await db.query(sql, params);
//   return rows[0] || null;
// };

// const ready = (async () => {
//   await db.query(`
//     CREATE TABLE IF NOT EXISTS bt_level30_sessions (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       player_id INT NOT NULL,
//       status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
//       attempts INT NOT NULL DEFAULT 0,
//       hints_used INT NOT NULL DEFAULT 0,
//       started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       completed_at DATETIME NULL,
//       INDEX idx_l30_player (player_id)
//     )
//   `);

//   // every answer the player sends (right or wrong)
//   await db.query(`
//     CREATE TABLE IF NOT EXISTS bt_level30_answers (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       session_id INT NOT NULL,
//       player_id INT NOT NULL,
//       answer VARCHAR(100) NOT NULL,
//       is_correct TINYINT(1) NOT NULL DEFAULT 0,
//       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       INDEX idx_l30_ans_session (session_id)
//     )
//   `);

//   // every tap on the search icon
//   await db.query(`
//     CREATE TABLE IF NOT EXISTS bt_level30_hint_log (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       session_id INT NOT NULL,
//       player_id INT NOT NULL,
//       charged TINYINT(1) NOT NULL DEFAULT 0,
//       hints_left INT NOT NULL DEFAULT 0,
//       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       INDEX idx_l30_hint_session (session_id)
//     )
//   `);

//   console.log('[BrainTwist L30] tables ready');
// })().catch((err) =>
//   console.error('[BrainTwist L30] could not create tables:', err.message)
// );

// /* ---------- player / hints ---------- */

// const getPlayer = (playerId) =>
//   one('SELECT id, hints FROM bt_players WHERE id = ?', [playerId]);

// const getHints = async (playerId) => {
//   const row = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
//   return row ? Number(row.hints) || 0 : 0;
// };

// // takes `amount` hints; null when the player does not have enough
// const spendHints = async (playerId, amount) => {
//   const [r] = await db.query(
//     'UPDATE bt_players SET hints = hints - ? WHERE id = ? AND hints >= ?',
//     [amount, playerId, amount]
//   );
//   if (!r.affectedRows) return null;
//   return getHints(playerId);
// };

// const addHints = async (playerId, amount) => {
//   await db.query('UPDATE bt_players SET hints = hints + ? WHERE id = ?', [amount, playerId]);
//   return getHints(playerId);
// };

// /* ---------- sessions ---------- */

// const getSession = (sessionId, playerId) =>
//   one('SELECT * FROM bt_level30_sessions WHERE id = ? AND player_id = ?', [sessionId, playerId]);

// const createSession = async (playerId) => {
//   const [r] = await db.query('INSERT INTO bt_level30_sessions (player_id) VALUES (?)', [playerId]);
//   return one('SELECT * FROM bt_level30_sessions WHERE id = ?', [r.insertId]);
// };

// const abandonActive = (playerId) =>
//   db.query(
//     "UPDATE bt_level30_sessions SET status = 'abandoned', completed_at = NOW() WHERE player_id = ? AND status = 'in_progress'",
//     [playerId]
//   );

// const addAttempt = async (sessionId) => {
//   await db.query('UPDATE bt_level30_sessions SET attempts = attempts + 1 WHERE id = ?', [sessionId]);
//   const row = await one('SELECT attempts FROM bt_level30_sessions WHERE id = ?', [sessionId]);
//   return row ? Number(row.attempts) : 1;
// };

// const markHintUsed = (sessionId) =>
//   db.query('UPDATE bt_level30_sessions SET hints_used = hints_used + 1 WHERE id = ?', [sessionId]);

// const logAnswer = (sessionId, playerId, answer, correct) =>
//   db.query(
//     'INSERT INTO bt_level30_answers (session_id, player_id, answer, is_correct) VALUES (?, ?, ?, ?)',
//     [sessionId, playerId, String(answer).slice(0, 100), correct ? 1 : 0]
//   );

// const logHint = (sessionId, playerId, charged, hintsLeft) =>
//   db.query(
//     'INSERT INTO bt_level30_hint_log (session_id, player_id, charged, hints_left) VALUES (?, ?, ?, ?)',
//     [sessionId, playerId, charged ? 1 : 0, hintsLeft]
//   );

// const completeSession = (sessionId) =>
//   db.query(
//     "UPDATE bt_level30_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?",
//     [sessionId]
//   );

// const skipSession = (sessionId) =>
//   db.query(
//     "UPDATE bt_level30_sessions SET status = 'skipped', completed_at = NOW() WHERE id = ?",
//     [sessionId]
//   );

// /* ---------- progress ---------- */

// const saveProgress = async (playerId, score, stars, attempts) => {
//   const found = await one(
//     'SELECT id FROM brain_twist_progress WHERE player_id = ? AND level_number = ?',
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

// const unlockNext = async (playerId, attempts) => {
//   await db.query(
//     `INSERT INTO bt_progress (player_id, level_n, attempts, solved_at)
//      VALUES (?, ?, ?, NOW())
//      ON DUPLICATE KEY UPDATE solved_at = COALESCE(solved_at, NOW())`,
//     [playerId, LEVEL, attempts]
//   );

//   await db.query(
//     `UPDATE bt_players
//      SET current_level = GREATEST(COALESCE(current_level, 1), ?)
//      WHERE id = ?`,
//     [LEVEL + 1, playerId]
//   );
// };

// const getProgress = (playerId) =>
//   one(
//     `SELECT is_completed, score, stars, attempts, completed_at
//      FROM brain_twist_progress WHERE player_id = ? AND level_number = ?`,
//     [playerId, LEVEL]
//   );

// module.exports = {
//   LEVEL,
//   ready,
//   getPlayer,
//   getHints,
//   spendHints,
//   addHints,
//   getSession,
//   createSession,
//   abandonActive,
//   addAttempt,
//   markHintUsed,
//   logAnswer,
//   logHint,
//   completeSession,
//   skipSession,
//   saveProgress,
//   unlockNext,
//   getProgress,
// };
const db = require('../db');

const LEVEL = 30;

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

const ready = (async () => {
  // one row per player: the state of the game that is open now
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level30_state (
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
    CREATE TABLE IF NOT EXISTS bt_level30_answers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      answer VARCHAR(100) NOT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l30_ans_player (player_id)
    )
  `);

  // every tap on the clue button
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level30_hint_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      hints_left INT NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l30_hint_player (player_id)
    )
  `);

  console.log('[BrainTwist L30] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L30] could not create tables:', err.message)
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
    `INSERT INTO bt_level30_state (player_id, attempts, solved, skipped, hints_used, started_at, updated_at)
     VALUES (?, 0, 0, 0, 0, NOW(), NOW())
     ON DUPLICATE KEY UPDATE attempts = 0, solved = 0, skipped = 0, hints_used = 0,
                             started_at = NOW(), updated_at = NOW()`,
    [playerId]
  );
  return getState(playerId);
};

const getState = (playerId) =>
  one('SELECT * FROM bt_level30_state WHERE player_id = ?', [playerId]);

// makes sure the row exists (when /answer is called before /start)
const ensureState = async (playerId) => {
  const found = await getState(playerId);
  return found || resetState(playerId);
};

const addAttempt = async (playerId) => {
  await db.query(
    'UPDATE bt_level30_state SET attempts = attempts + 1, updated_at = NOW() WHERE player_id = ?',
    [playerId]
  );
  const row = await getState(playerId);
  return row ? Number(row.attempts) : 1;
};

const markHintUsed = (playerId) =>
  db.query(
    'UPDATE bt_level30_state SET hints_used = hints_used + 1, updated_at = NOW() WHERE player_id = ?',
    [playerId]
  );

const markSolved = (playerId) =>
  db.query('UPDATE bt_level30_state SET solved = 1, updated_at = NOW() WHERE player_id = ?', [playerId]);

const markSkipped = (playerId) =>
  db.query(
    'UPDATE bt_level30_state SET skipped = 1, updated_at = NOW() WHERE player_id = ?',
    [playerId]
  );

const logAnswer = (playerId, answer, correct) =>
  db.query('INSERT INTO bt_level30_answers (player_id, answer, is_correct) VALUES (?, ?, ?)', [
    playerId,
    String(answer).slice(0, 100),
    correct ? 1 : 0,
  ]);

const logHint = (playerId, hintsLeft) =>
  db.query('INSERT INTO bt_level30_hint_log (player_id, hints_left) VALUES (?, ?)', [
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