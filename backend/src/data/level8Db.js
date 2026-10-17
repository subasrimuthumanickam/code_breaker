// // backend/src/data/level8Db.js
// // Brain Twist - LEVEL 8 (find the hidden parrot in the dark room) : every MySQL query lives here.
// // The routes file (Braintwistlevel8routes.js) only handles request / response (JSON).
// //
// // The server picks where the parrot hides and keeps it in bt_level8_sessions,
// // so the phone never knows the answer. Every spotlight position the player
// // sends is stored in bt_level8_looks.

// const db = require('../db');

// const LEVEL = 8;

// const one = async (sql, params = []) => {
//   const [rows] = await db.query(sql, params);
//   return rows[0] || null;
// };

// /* ---------------------------------------------------------
//    TABLES  (created once when the server starts)
// --------------------------------------------------------- */

// const ready = (async () => {
//   await db.query(`
//     CREATE TABLE IF NOT EXISTS bt_level8_sessions (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       player_id INT NOT NULL,
//       status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
//       spot VARCHAR(20) NOT NULL,
//       parrot_x INT NOT NULL,
//       parrot_y INT NOT NULL,
//       looks INT NOT NULL DEFAULT 0,
//       hints_used INT NOT NULL DEFAULT 0,
//       started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       completed_at DATETIME NULL,
//       INDEX idx_l8_player (player_id)
//     )
//   `);

//   await db.query(`
//     CREATE TABLE IF NOT EXISTS bt_level8_looks (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       session_id INT NOT NULL,
//       x INT NOT NULL,
//       y INT NOT NULL,
//       distance INT NOT NULL,
//       is_found TINYINT(1) NOT NULL DEFAULT 0,
//       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       INDEX idx_l8_session (session_id)
//     )
//   `);

//   console.log('[BrainTwist L8] tables ready');
// })().catch((err) =>
//   console.error('[BrainTwist L8] could not create tables:', err.message)
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

// // takes `amount` hints from the player; null when there are not enough
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

// /* ---------------------------------------------------------
//    SESSIONS   (elapsed = seconds since the timer was last started)
// --------------------------------------------------------- */

// const SELECT_SESSION = `SELECT s.*, TIMESTAMPDIFF(SECOND, s.started_at, NOW()) AS elapsed
//                         FROM bt_level8_sessions s`;

// const findActive = (playerId) =>
//   one(`${SELECT_SESSION} WHERE s.player_id = ? AND s.status = 'in_progress' ORDER BY s.id DESC LIMIT 1`, [playerId]);

// const getSession = (sessionId, playerId) =>
//   one(`${SELECT_SESSION} WHERE s.id = ? AND s.player_id = ?`, [sessionId, playerId]);

// const createSession = async (playerId, spot, x, y) => {
//   const [r] = await db.query(
//     'INSERT INTO bt_level8_sessions (player_id, spot, parrot_x, parrot_y) VALUES (?, ?, ?, ?)',
//     [playerId, spot, x, y]
//   );
//   return one(`${SELECT_SESSION} WHERE s.id = ?`, [r.insertId]);
// };

// // the timer starts again every time the level is opened
// const restartTimer = (sessionId) =>
//   db.query('UPDATE bt_level8_sessions SET started_at = NOW() WHERE id = ?', [sessionId]);

// /* ---------------------------------------------------------
//    LOOKS  (every spotlight position the player sends)
// --------------------------------------------------------- */

// const recordLook = async (sessionId, x, y, distance, found) => {
//   await db.query(
//     'INSERT INTO bt_level8_looks (session_id, x, y, distance, is_found) VALUES (?, ?, ?, ?, ?)',
//     [sessionId, x, y, distance, found ? 1 : 0]
//   );
//   await db.query('UPDATE bt_level8_sessions SET looks = looks + 1 WHERE id = ?', [sessionId]);
// };

// const markHintUsed = (sessionId) =>
//   db.query('UPDATE bt_level8_sessions SET hints_used = hints_used + 1 WHERE id = ?', [sessionId]);

// const completeSession = (sessionId) =>
//   db.query(
//     "UPDATE bt_level8_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?",
//     [sessionId]
//   );

// const skipSession = (sessionId) =>
//   db.query(
//     "UPDATE bt_level8_sessions SET status = 'skipped', completed_at = NOW() WHERE id = ?",
//     [sessionId]
//   );

// /* ---------------------------------------------------------
//    PROGRESS
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
//   findActive,
//   getSession,
//   createSession,
//   restartTimer,
//   recordLook,
//   markHintUsed,
//   completeSession,
//   skipSession,
//   saveProgress,
//   unlockNext,
//   getProgress,
// };
const db = require('../db');

const LEVEL = 8;

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

/* ---------------------------------------------------------
   TABLES  (created once when the server starts)
--------------------------------------------------------- */

const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level8_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      spot VARCHAR(20) NOT NULL,
      parrot_x INT NOT NULL,
      parrot_y INT NOT NULL,
      looks INT NOT NULL DEFAULT 0,
      hints_used INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l8_player (player_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level8_looks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      x INT NOT NULL,
      y INT NOT NULL,
      distance INT NOT NULL,
      is_found TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l8_session (session_id)
    )
  `);

  console.log('[BrainTwist L8] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L8] could not create tables:', err.message)
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

// takes `amount` hints from the player; null when there are not enough
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

/* ---------------------------------------------------------
   SESSIONS   (elapsed = seconds since the timer was last started)
--------------------------------------------------------- */

const SELECT_SESSION = `SELECT s.*, TIMESTAMPDIFF(SECOND, s.started_at, NOW()) AS elapsed
                        FROM bt_level8_sessions s`;

const findActive = (playerId) =>
  one(`${SELECT_SESSION} WHERE s.player_id = ? AND s.status = 'in_progress' ORDER BY s.id DESC LIMIT 1`, [playerId]);

const getSession = (sessionId, playerId) =>
  one(`${SELECT_SESSION} WHERE s.id = ? AND s.player_id = ?`, [sessionId, playerId]);

const createSession = async (playerId, spot, x, y) => {
  const [r] = await db.query(
    'INSERT INTO bt_level8_sessions (player_id, spot, parrot_x, parrot_y) VALUES (?, ?, ?, ?)',
    [playerId, spot, x, y]
  );
  return one(`${SELECT_SESSION} WHERE s.id = ?`, [r.insertId]);
};

// the timer starts again every time the level is opened
const restartTimer = (sessionId) =>
  db.query('UPDATE bt_level8_sessions SET started_at = NOW() WHERE id = ?', [sessionId]);

// where the parrot hid in this player's previous game (so the next one is different)
const lastSpot = async (playerId) => {
  const row = await one(
    'SELECT spot FROM bt_level8_sessions WHERE player_id = ? ORDER BY id DESC LIMIT 1',
    [playerId]
  );
  return row ? row.spot : null;
};

// a game that was left unfinished is closed, a fresh one starts next time
const abandonActive = (playerId) =>
  db.query(
    "UPDATE bt_level8_sessions SET status = 'abandoned', completed_at = NOW() WHERE player_id = ? AND status = 'in_progress'",
    [playerId]
  );

/* ---------------------------------------------------------
   LOOKS  (every spotlight position the player sends)
--------------------------------------------------------- */

const recordLook = async (sessionId, x, y, distance, found) => {
  await db.query(
    'INSERT INTO bt_level8_looks (session_id, x, y, distance, is_found) VALUES (?, ?, ?, ?, ?)',
    [sessionId, x, y, distance, found ? 1 : 0]
  );
  await db.query('UPDATE bt_level8_sessions SET looks = looks + 1 WHERE id = ?', [sessionId]);
};

const markHintUsed = (sessionId) =>
  db.query('UPDATE bt_level8_sessions SET hints_used = hints_used + 1 WHERE id = ?', [sessionId]);

const completeSession = (sessionId) =>
  db.query(
    "UPDATE bt_level8_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?",
    [sessionId]
  );

const skipSession = (sessionId) =>
  db.query(
    "UPDATE bt_level8_sessions SET status = 'skipped', completed_at = NOW() WHERE id = ?",
    [sessionId]
  );

/* ---------------------------------------------------------
   PROGRESS
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
  findActive,
  getSession,
  createSession,
  restartTimer,
  lastSpot,
  abandonActive,
  recordLook,
  markHintUsed,
  completeSession,
  skipSession,
  saveProgress,
  unlockNext,
  getProgress,
};