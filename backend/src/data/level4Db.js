// backend/src/data/level4Db.js
// Brain Twist - LEVEL 4 (dive jump + fish) : every MySQL query lives in this file.
// The routes file (Braintwistlevel4routes.js) only handles request / response (JSON).
//
// Player raises the pool water (0 - 100), presses JUMP, the server decides.
// Every jump is stored in bt_level4_attempts with the water level that was used.

const db = require('../db');

const LEVEL = 4;

/* ---------------------------------------------------------
   small helpers
--------------------------------------------------------- */

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

/* ---------------------------------------------------------
   TABLES  (created once when the server starts)
--------------------------------------------------------- */

const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level4_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      wrong_attempts INT NOT NULL DEFAULT 0,
      total_attempts INT NOT NULL DEFAULT 0,
      hint_used TINYINT(1) NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l4_player (player_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level4_attempts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      water_level INT NOT NULL,
      outcome VARCHAR(20) NOT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l4_session (session_id)
    )
  `);

  console.log('[BrainTwist L4] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L4] could not create tables:', err.message)
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
  one('SELECT * FROM bt_level4_sessions WHERE id = ? AND player_id = ?', [sessionId, playerId]);

const findOpenSession = (playerId) =>
  one(
    `SELECT * FROM bt_level4_sessions
     WHERE player_id = ? AND status = 'in_progress'
     ORDER BY id DESC LIMIT 1`,
    [playerId]
  );

const createSession = async (playerId) => {
  const [inserted] = await db.query(
    'INSERT INTO bt_level4_sessions (player_id) VALUES (?)',
    [playerId]
  );
  return one('SELECT * FROM bt_level4_sessions WHERE id = ?', [inserted.insertId]);
};

const markHintUsed = (sessionId) =>
  db.query('UPDATE bt_level4_sessions SET hint_used = 1 WHERE id = ?', [sessionId]);

/* ---------------------------------------------------------
   JUMPS
--------------------------------------------------------- */

const recordAttempt = (sessionId, waterLevel, outcome, correct) =>
  db.query(
    'INSERT INTO bt_level4_attempts (session_id, water_level, outcome, is_correct) VALUES (?, ?, ?, ?)',
    [sessionId, waterLevel, outcome, correct ? 1 : 0]
  );

const markWrong = (sessionId) =>
  db.query(
    `UPDATE bt_level4_sessions
     SET wrong_attempts = wrong_attempts + 1, total_attempts = total_attempts + 1
     WHERE id = ?`,
    [sessionId]
  );

const completeSession = (sessionId) =>
  db.query(
    `UPDATE bt_level4_sessions
     SET status = 'completed', total_attempts = total_attempts + 1, completed_at = NOW()
     WHERE id = ?`,
    [sessionId]
  );

const skipSession = (sessionId) =>
  db.query(
    "UPDATE bt_level4_sessions SET status = 'skipped', completed_at = NOW() WHERE id = ?",
    [sessionId]
  );

/* ---------------------------------------------------------
   PROGRESS  (same tables levels 2 and 3 use)
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
  getPlayer,
  getHints,
  spendHints,
  addHints,
  getSession,
  findOpenSession,
  createSession,
  markHintUsed,
  recordAttempt,
  markWrong,
  completeSession,
  skipSession,
  saveProgress,
  unlockNext,
  getProgress,
};