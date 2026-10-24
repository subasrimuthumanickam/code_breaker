
const db = require('../db');

const LEVEL = 7;

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};



const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level7_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      stage TINYINT NOT NULL DEFAULT 1,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      wrong_attempts INT NOT NULL DEFAULT 0,
      total_attempts INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l7_player (player_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level7_actions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      stage TINYINT NOT NULL,
      kind VARCHAR(10) NOT NULL,
      item VARCHAR(30) NOT NULL,
      target VARCHAR(30) NOT NULL DEFAULT '',
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l7_session (session_id)
    )
  `);

  console.log('[BrainTwist L7] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L7] could not create tables:', err.message)
);

/* ---------------- sessions ---------------- */

const findActive = (playerId) =>
  one(
    `SELECT * FROM bt_level7_sessions
     WHERE player_id = ? AND status = 'in_progress'
     ORDER BY id DESC LIMIT 1`,
    [playerId]
  );

const getSession = (sessionId, playerId) =>
  one('SELECT * FROM bt_level7_sessions WHERE id = ? AND player_id = ?', [sessionId, playerId]);

const createSession = async (playerId) => {
  const [r] = await db.query('INSERT INTO bt_level7_sessions (player_id) VALUES (?)', [playerId]);
  return one('SELECT * FROM bt_level7_sessions WHERE id = ?', [r.insertId]);
};

// saves one try (right or wrong) and keeps the counters on the session
const recordAction = async (sessionId, stage, kind, item, target, correct) => {
  await db.query(
    `INSERT INTO bt_level7_actions (session_id, stage, kind, item, target, is_correct)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [sessionId, stage, kind, item, target, correct ? 1 : 0]
  );
  await db.query(
    `UPDATE bt_level7_sessions
     SET total_attempts = total_attempts + 1,
         wrong_attempts = wrong_attempts + ?
     WHERE id = ?`,
    [correct ? 0 : 1, sessionId]
  );
};

const setStage = (sessionId, stage) =>
  db.query('UPDATE bt_level7_sessions SET stage = ? WHERE id = ?', [stage, sessionId]);

const completeSession = (sessionId) =>
  db.query(
    `UPDATE bt_level7_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?`,
    [sessionId]
  );

/* ---------------- progress / hints ---------------- */

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

const getProgress = (playerId) =>
  one(
    `SELECT is_completed, score, stars, attempts, completed_at
     FROM brain_twist_progress WHERE player_id = ? AND level_number = ?`,
    [playerId, LEVEL]
  );

// takes `amount` hints from the player; null when there are not enough
const spendHints = async (playerId, amount) => {
  const [r] = await db.query(
    'UPDATE bt_players SET hints = hints - ? WHERE id = ? AND hints >= ?',
    [amount, playerId, amount]
  );
  if (!r.affectedRows) return null;
  const p = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
  return Number(p && p.hints) || 0;
};

module.exports = {
  LEVEL, ready, findActive, getSession, createSession, recordAction,
  setStage, completeSession, saveProgress, getProgress, spendHints,
};