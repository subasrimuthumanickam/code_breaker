// // backend/src/data/level3Db.js
// // Brain Twist - LEVEL 3 : every MySQL query lives in this file.
// // The routes file (Braintwistlevel3routes.js) only handles request / response (JSON).

// const db = require('../db');

// const LEVEL = 3;

// /* ---------------------------------------------------------
//    small helpers
// --------------------------------------------------------- */

// const one = async (sql, params = []) => {
//   const [rows] = await db.query(sql, params);
//   return rows[0] || null;
// };

// const parseList = (text) => {
//   try {
//     const v = JSON.parse(text || '[]');
//     return Array.isArray(v) ? v.map(Number) : [];
//   } catch {
//     return [];
//   }
// };

// /* ---------------------------------------------------------
//    TABLES  (created once when the server starts)
// --------------------------------------------------------- */

// const ready = (async () => {
//   await db.query(`
//     CREATE TABLE IF NOT EXISTS bt_level3_sessions (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       player_id INT NOT NULL,
//       status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
//       wrong_attempts INT NOT NULL DEFAULT 0,
//       total_attempts INT NOT NULL DEFAULT 0,
//       removed TEXT NULL,
//       started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       completed_at DATETIME NULL,
//       INDEX idx_l3_player (player_id)
//     )
//   `);

//   await db.query(`
//     CREATE TABLE IF NOT EXISTS bt_level3_attempts (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       session_id INT NOT NULL,
//       picked INT NOT NULL,
//       is_correct TINYINT(1) NOT NULL DEFAULT 0,
//       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       INDEX idx_l3_session (session_id)
//     )
//   `);

//   console.log('[BrainTwist L3] tables ready');
// })().catch((err) =>
//   console.error('[BrainTwist L3] could not create tables:', err.message)
// );

// /* ---------------------------------------------------------
//    PLAYER / HINTS
// --------------------------------------------------------- */

// const getPlayer = (playerId) =>
//   one('SELECT id, hints FROM bt_players WHERE id = ?', [playerId]);

// const getHints = async (playerId) => {
//   const row = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
//   return row ? Number(row.hints) || 0 : 0;
// };

// // returns false when the player does not have enough hints
// const spendHints = async (playerId, amount) => {
//   const [result] = await db.query(
//     'UPDATE bt_players SET hints = hints - ? WHERE id = ? AND hints >= ?',
//     [amount, playerId, amount]
//   );
//   return result.affectedRows > 0;
// };

// const addHints = (playerId, amount) =>
//   db.query('UPDATE bt_players SET hints = hints + ? WHERE id = ?', [amount, playerId]);

// /* ---------------------------------------------------------
//    SESSIONS
// --------------------------------------------------------- */

// const getSession = (sessionId, playerId) =>
//   one('SELECT * FROM bt_level3_sessions WHERE id = ? AND player_id = ?', [sessionId, playerId]);

// const findOpenSession = (playerId) =>
//   one(
//     `SELECT * FROM bt_level3_sessions
//      WHERE player_id = ? AND status = 'in_progress'
//      ORDER BY id DESC LIMIT 1`,
//     [playerId]
//   );

// const createSession = async (playerId) => {
//   const [inserted] = await db.query(
//     "INSERT INTO bt_level3_sessions (player_id, removed) VALUES (?, '[]')",
//     [playerId]
//   );
//   return one('SELECT * FROM bt_level3_sessions WHERE id = ?', [inserted.insertId]);
// };

// const saveRemoved = (sessionId, removed) =>
//   db.query('UPDATE bt_level3_sessions SET removed = ? WHERE id = ?', [
//     JSON.stringify(removed),
//     sessionId,
//   ]);

// /* ---------------------------------------------------------
//    ANSWERS
// --------------------------------------------------------- */

// const recordAttempt = (sessionId, picked, correct) =>
//   db.query(
//     'INSERT INTO bt_level3_attempts (session_id, picked, is_correct) VALUES (?, ?, ?)',
//     [sessionId, picked, correct ? 1 : 0]
//   );

// const markWrong = (sessionId) =>
//   db.query(
//     `UPDATE bt_level3_sessions
//      SET wrong_attempts = wrong_attempts + 1, total_attempts = total_attempts + 1
//      WHERE id = ?`,
//     [sessionId]
//   );

// const completeSession = (sessionId) =>
//   db.query(
//     `UPDATE bt_level3_sessions
//      SET status = 'completed', total_attempts = total_attempts + 1, completed_at = NOW()
//      WHERE id = ?`,
//     [sessionId]
//   );

// const skipSession = (sessionId) =>
//   db.query(
//     "UPDATE bt_level3_sessions SET status = 'skipped', completed_at = NOW() WHERE id = ?",
//     [sessionId]
//   );

// /* ---------------------------------------------------------
//    PROGRESS  (same tables level 2 uses)
// --------------------------------------------------------- */

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
//      FROM brain_twist_progress
//      WHERE player_id = ? AND level_number = ?`,
//     [playerId, LEVEL]
//   );

// module.exports = {
//   LEVEL,
//   ready,
//   parseList,
//   getPlayer,
//   getHints,
//   spendHints,
//   addHints,
//   getSession,
//   findOpenSession,
//   createSession,
//   saveRemoved,
//   recordAttempt,
//   markWrong,
//   completeSession,
//   skipSession,
//   saveProgress,
//   unlockNext,
//   getProgress,
// };
// backend/src/data/level3Db.js
// Brain Twist - LEVEL 3 : every MySQL query lives in this file.
// The routes file (Braintwistlevel3routes.js) only handles request / response (JSON).
//
// Level 3 puzzle: drag "+" and "-" between the numbers 1 _ 2 _ 3.
// An attempt is stored as the arrangement text, e.g. "+,-"  (= 1 + 2 - 3).

const db = require('../db');

const LEVEL = 3;

/* ---------------------------------------------------------
   small helpers
--------------------------------------------------------- */

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

const parseList = (text) => {
  try {
    const v = JSON.parse(text || '[]');
    return Array.isArray(v) ? v.map(Number) : [];
  } catch {
    return [];
  }
};

// run an ALTER and ignore "already done" errors (so old databases upgrade themselves)
const tryAlter = async (sql) => {
  try {
    await db.query(sql);
  } catch (err) {
    if (!/duplicate column|already exists/i.test(err.message)) {
      console.error('[BrainTwist L3] migration warning:', err.message);
    }
  }
};

/* ---------------------------------------------------------
   TABLES  (created once when the server starts)
--------------------------------------------------------- */

const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level3_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      wrong_attempts INT NOT NULL DEFAULT 0,
      total_attempts INT NOT NULL DEFAULT 0,
      removed TEXT NULL,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l3_player (player_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level3_attempts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      picked INT NULL,
      arrangement VARCHAR(20) NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l3_session (session_id)
    )
  `);

  // tables made by the older number-picking version -> upgrade in place
  await tryAlter('ALTER TABLE bt_level3_attempts ADD COLUMN arrangement VARCHAR(20) NULL');
  await tryAlter('ALTER TABLE bt_level3_attempts MODIFY picked INT NULL');

  console.log('[BrainTwist L3] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L3] could not create tables:', err.message)
);

/* ---------------------------------------------------------
   PLAYER / HINTS
--------------------------------------------------------- */

const getPlayer = (playerId) =>
  one('SELECT id, hints FROM bt_players WHERE id = ?', [playerId]);

const getHints = async (playerId) => {
  const row = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
  return row ? Number(row.hints) || 0 : 0;
};

// returns false when the player does not have enough hints
const spendHints = async (playerId, amount) => {
  const [result] = await db.query(
    'UPDATE bt_players SET hints = hints - ? WHERE id = ? AND hints >= ?',
    [amount, playerId, amount]
  );
  return result.affectedRows > 0;
};

const addHints = (playerId, amount) =>
  db.query('UPDATE bt_players SET hints = hints + ? WHERE id = ?', [amount, playerId]);

/* ---------------------------------------------------------
   SESSIONS
--------------------------------------------------------- */

const getSession = (sessionId, playerId) =>
  one('SELECT * FROM bt_level3_sessions WHERE id = ? AND player_id = ?', [sessionId, playerId]);

const findOpenSession = (playerId) =>
  one(
    `SELECT * FROM bt_level3_sessions
     WHERE player_id = ? AND status = 'in_progress'
     ORDER BY id DESC LIMIT 1`,
    [playerId]
  );

const createSession = async (playerId) => {
  const [inserted] = await db.query(
    "INSERT INTO bt_level3_sessions (player_id, removed) VALUES (?, '[]')",
    [playerId]
  );
  return one('SELECT * FROM bt_level3_sessions WHERE id = ?', [inserted.insertId]);
};

// the "removed" column now stores the gap numbers (0 / 1) that a hint already filled
const saveRevealed = (sessionId, slots) =>
  db.query('UPDATE bt_level3_sessions SET removed = ? WHERE id = ?', [
    JSON.stringify(slots),
    sessionId,
  ]);

/* ---------------------------------------------------------
   ANSWERS
--------------------------------------------------------- */

const recordAttempt = (sessionId, arrangement, correct) =>
  db.query(
    'INSERT INTO bt_level3_attempts (session_id, picked, arrangement, is_correct) VALUES (?, 0, ?, ?)',
    [sessionId, arrangement, correct ? 1 : 0]
  );

const markWrong = (sessionId) =>
  db.query(
    `UPDATE bt_level3_sessions
     SET wrong_attempts = wrong_attempts + 1, total_attempts = total_attempts + 1
     WHERE id = ?`,
    [sessionId]
  );

const completeSession = (sessionId) =>
  db.query(
    `UPDATE bt_level3_sessions
     SET status = 'completed', total_attempts = total_attempts + 1, completed_at = NOW()
     WHERE id = ?`,
    [sessionId]
  );

const skipSession = (sessionId) =>
  db.query(
    "UPDATE bt_level3_sessions SET status = 'skipped', completed_at = NOW() WHERE id = ?",
    [sessionId]
  );

/* ---------------------------------------------------------
   PROGRESS  (same tables level 2 uses)
--------------------------------------------------------- */

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
     FROM brain_twist_progress
     WHERE player_id = ? AND level_number = ?`,
    [playerId, LEVEL]
  );

module.exports = {
  LEVEL,
  ready,
  parseList,
  getPlayer,
  getHints,
  spendHints,
  addHints,
  getSession,
  findOpenSession,
  createSession,
  saveRevealed,
  recordAttempt,
  markWrong,
  completeSession,
  skipSession,
  saveProgress,
  unlockNext,
  getProgress,
};