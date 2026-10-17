const db = require('../db');

const LEVEL = 9;

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

/* ---------------------------------------------------------
   TABLES  (created once when the server starts)
   bt_level9_sessions : one row per game (the maze seed, status, moves, hints used)
   bt_level9_runs     : the way the dog walked, saved when the level is won
--------------------------------------------------------- */

const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level9_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      seed INT NOT NULL,
      cols INT NOT NULL,
      \`rows\` INT NOT NULL,
      moves INT NOT NULL DEFAULT 0,
      hints_used INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l9_player (player_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level9_runs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      player_id INT NOT NULL,
      moves INT NOT NULL,
      seconds INT NOT NULL,
      path TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l9_run_session (session_id),
      INDEX idx_l9_run_player (player_id)
    )
  `);

  console.log('[BrainTwist L9] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L9] could not create tables:', err.message)
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
   SESSIONS   (elapsed = seconds since the maze was made)
--------------------------------------------------------- */

const SELECT_SESSION = `SELECT s.*, TIMESTAMPDIFF(SECOND, s.started_at, NOW()) AS elapsed
                        FROM bt_level9_sessions s`;

const getSession = (sessionId, playerId) =>
  one(`${SELECT_SESSION} WHERE s.id = ? AND s.player_id = ?`, [sessionId, playerId]);

const createSession = async (playerId, seed, cols, rows) => {
  const [r] = await db.query(
    'INSERT INTO bt_level9_sessions (player_id, seed, cols, `rows`) VALUES (?, ?, ?, ?)',
    [playerId, seed, cols, rows]
  );
  return one(`${SELECT_SESSION} WHERE s.id = ?`, [r.insertId]);
};

// a game that was left unfinished is closed, a fresh maze starts next time
const abandonActive = (playerId) =>
  db.query(
    "UPDATE bt_level9_sessions SET status = 'abandoned', completed_at = NOW() WHERE player_id = ? AND status = 'in_progress'",
    [playerId]
  );

const markHintUsed = (sessionId) =>
  db.query('UPDATE bt_level9_sessions SET hints_used = hints_used + 1 WHERE id = ?', [sessionId]);

// the dog reached the bone: close the game and save the walked path
const completeSession = async (sessionId, playerId, moves, seconds, pathJson) => {
  await db.query(
    "UPDATE bt_level9_sessions SET status = 'completed', moves = ?, completed_at = NOW() WHERE id = ?",
    [moves, sessionId]
  );
  await db.query(
    'INSERT INTO bt_level9_runs (session_id, player_id, moves, seconds, path) VALUES (?, ?, ?, ?, ?)',
    [sessionId, playerId, moves, seconds, pathJson]
  );
};

const skipSession = (sessionId) =>
  db.query(
    "UPDATE bt_level9_sessions SET status = 'skipped', completed_at = NOW() WHERE id = ?",
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
  markHintUsed,
  completeSession,
  skipSession,
  saveProgress,
  unlockNext,
  getProgress,
};