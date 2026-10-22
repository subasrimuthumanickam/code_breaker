// // CHANGE this path to whatever your level12Db.js uses for the MySQL pool (mysql2/promise)
// const pool = require('../config/db');

// const SOLUTION = ['open_fridge', 'giraffe_in', 'close_fridge'];

// async function createSession(playerId) {
//   const [r] = await pool.query(
//     'INSERT INTO bt_level14_sessions (player_id) VALUES (?)',
//     [playerId]
//   );
//   return r.insertId;
// }

// async function getSession(sessionId, playerId) {
//   const [rows] = await pool.query(
//     'SELECT * FROM bt_level14_sessions WHERE id = ? AND player_id = ?',
//     [sessionId, playerId]
//   );
//   return rows[0] || null;
// }

// async function addAction(sessionId, actionType) {
//   await pool.query(
//     'INSERT INTO bt_level14_actions (session_id, action_type) VALUES (?, ?)',
//     [sessionId, actionType]
//   );
// }

// async function getActions(sessionId) {
//   const [rows] = await pool.query(
//     'SELECT action_type FROM bt_level14_actions WHERE session_id = ? ORDER BY id ASC',
//     [sessionId]
//   );
//   return rows.map(r => r.action_type);
// }

// // last 3 actions must be the exact solution order
// function isSolved(actions) {
//   const tail = actions.slice(-SOLUTION.length);
//   return tail.length === SOLUTION.length && tail.every((a, i) => a === SOLUTION[i]);
// }

// async function completeSession(sessionId, playerId) {
//   await pool.query(
//     "UPDATE bt_level14_sessions SET status='completed', completed_at=NOW() WHERE id=?",
//     [sessionId]
//   );
//   // ADJUST column names to match your brain_twist_progress table
//   await pool.query(
//     `INSERT INTO brain_twist_progress (player_id, level, completed, completed_at)
//      VALUES (?, 14, 1, NOW())
//      ON DUPLICATE KEY UPDATE completed = 1, completed_at = NOW()`,
//     [playerId]
//   );
// }

// module.exports = { createSession, getSession, addAction, getActions, isSolved, completeSession };
// !!! LINE 1: copy the EXACT db require line from level11Db.js (or level10Db.js), keep the name `db`
const db = require("../db");

const LEVEL = 14;

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

/* ---------------------------------------------------------
   TABLES  (created once when the server starts)
   bt_level14_sessions : one row per game
   bt_level14_actions  : every action (open_fridge / giraffe_in / close_fridge)
--------------------------------------------------------- */

const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level14_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      taps INT NOT NULL DEFAULT 0,
      attempts INT NOT NULL DEFAULT 0,
      seconds INT NOT NULL DEFAULT 0,
      hints_used INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l14_player (player_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level14_actions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      action VARCHAR(30) NOT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l14_session (session_id)
    )
  `);

  console.log('[BrainTwist L14] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L14] could not create tables:', err.message)
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
   SESSIONS
--------------------------------------------------------- */

const SELECT_SESSION = `SELECT s.*, TIMESTAMPDIFF(SECOND, s.started_at, NOW()) AS elapsed
                        FROM bt_level14_sessions s`;

const getSession = (sessionId, playerId) =>
  one(`${SELECT_SESSION} WHERE s.id = ? AND s.player_id = ?`, [sessionId, playerId]);

const createSession = async (playerId) => {
  const [r] = await db.query('INSERT INTO bt_level14_sessions (player_id) VALUES (?)', [playerId]);
  return one(`${SELECT_SESSION} WHERE s.id = ?`, [r.insertId]);
};

const abandonActive = (playerId) =>
  db.query(
    "UPDATE bt_level14_sessions SET status = 'abandoned', completed_at = NOW() WHERE player_id = ? AND status = 'in_progress'",
    [playerId]
  );

/* ---------------------------------------------------------
   ACTIONS  (state is rebuilt from the valid actions)
--------------------------------------------------------- */

// { open, giraffeIn } after replaying every valid action of this game
const getState = async (sessionId) => {
  const [rows] = await db.query(
    'SELECT action FROM bt_level14_actions WHERE session_id = ? AND is_correct = 1 ORDER BY id ASC',
    [sessionId]
  );
  let open = false;
  let giraffeIn = false;
  for (const { action } of rows) {
    if (action === 'open_fridge') open = true;
    else if (action === 'giraffe_in') giraffeIn = true;
    else if (action === 'close_fridge') open = false;
  }
  return { open, giraffeIn };
};

// wrong actions so far (used for attempts / stars)
const countWrong = async (sessionId) => {
  const row = await one(
    'SELECT COUNT(*) AS n FROM bt_level14_actions WHERE session_id = ? AND is_correct = 0',
    [sessionId]
  );
  return row ? Number(row.n) || 0 : 0;
};

const recordAction = async (sessionId, action, valid) => {
  await db.query(
    'INSERT INTO bt_level14_actions (session_id, action, is_correct) VALUES (?, ?, ?)',
    [sessionId, action, valid ? 1 : 0]
  );
  await db.query('UPDATE bt_level14_sessions SET taps = taps + 1 WHERE id = ?', [sessionId]);
};

const markHintUsed = (sessionId) =>
  db.query('UPDATE bt_level14_sessions SET hints_used = hints_used + 1 WHERE id = ?', [sessionId]);

const completeSession = (sessionId, attempts, seconds) =>
  db.query(
    "UPDATE bt_level14_sessions SET status = 'completed', attempts = ?, seconds = ?, completed_at = NOW() WHERE id = ?",
    [attempts, seconds, sessionId]
  );

const skipSession = (sessionId) =>
  db.query(
    "UPDATE bt_level14_sessions SET status = 'skipped', completed_at = NOW() WHERE id = ?",
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
  getSession,
  createSession,
  abandonActive,
  getState,
  countWrong,
  recordAction,
  markHintUsed,
  completeSession,
  skipSession,
  saveProgress,
  unlockNext,
  getProgress,
};