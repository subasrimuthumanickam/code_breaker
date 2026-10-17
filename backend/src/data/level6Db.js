// Level 6 (Draw a star) - all MySQL code lives here.
// The route file (routes/Braintwistlevel6routes.js) only calls these functions.
const db = require('../db');

const LEVEL = 6;

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

/* ---------------- tables ---------------- */

const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level6_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      edges LONGTEXT NOT NULL,
      wrong_attempts INT NOT NULL DEFAULT 0,
      total_attempts INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l6_player (player_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level6_moves (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      from_dot TINYINT NOT NULL,
      to_dot TINYINT NOT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      reason VARCHAR(30) NOT NULL DEFAULT '',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l6_session (session_id)
    )
  `);

  console.log('[BrainTwist L6] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L6] could not create tables:', err.message)
);

/* ---------------- sessions ---------------- */

const parse = (row) => {
  if (!row) return null;
  let edges = row.edges;
  try { edges = JSON.parse(edges); } catch { edges = []; }
  return { ...row, edges };
};

const findActive = async (playerId) =>
  parse(await one(
    `SELECT * FROM bt_level6_sessions
     WHERE player_id = ? AND status = 'in_progress'
     ORDER BY id DESC LIMIT 1`,
    [playerId]
  ));

const getSession = async (sessionId, playerId) =>
  parse(await one(
    'SELECT * FROM bt_level6_sessions WHERE id = ? AND player_id = ?',
    [sessionId, playerId]
  ));

const createSession = async (playerId) => {
  const [r] = await db.query(
    'INSERT INTO bt_level6_sessions (player_id, edges) VALUES (?, ?)',
    [playerId, '[]']
  );
  return parse(await one('SELECT * FROM bt_level6_sessions WHERE id = ?', [r.insertId]));
};

const saveEdges = (sessionId, edges) =>
  db.query('UPDATE bt_level6_sessions SET edges = ? WHERE id = ?', [JSON.stringify(edges), sessionId]);

// saves one try (right or wrong) and keeps the counters on the session
const recordMove = async (sessionId, from, to, correct, reason) => {
  await db.query(
    `INSERT INTO bt_level6_moves (session_id, from_dot, to_dot, is_correct, reason)
     VALUES (?, ?, ?, ?, ?)`,
    [sessionId, from, to, correct ? 1 : 0, reason]
  );
  await db.query(
    `UPDATE bt_level6_sessions
     SET total_attempts = total_attempts + 1,
         wrong_attempts = wrong_attempts + ?
     WHERE id = ?`,
    [correct ? 0 : 1, sessionId]
  );
};

const completeSession = (sessionId) =>
  db.query(
    `UPDATE bt_level6_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?`,
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
  LEVEL, ready, findActive, getSession, createSession, saveEdges,
  recordMove, completeSession, saveProgress, getProgress, spendHints,
};