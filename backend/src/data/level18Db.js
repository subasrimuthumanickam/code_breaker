const db = require("../db");

const LEVEL = 18;

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};



const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level18_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      attempts INT NOT NULL DEFAULT 0,
      seconds INT NOT NULL DEFAULT 0,
      hints_used INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l18_player (player_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level18_answers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      answer VARCHAR(20) NOT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l18_session (session_id)
    )
  `);

  console.log('[BrainTwist L18] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L18] could not create tables:', err.message)
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
                        FROM bt_level18_sessions s`;

const getSession = (sessionId, playerId) =>
  one(`${SELECT_SESSION} WHERE s.id = ? AND s.player_id = ?`, [sessionId, playerId]);

const createSession = async (playerId) => {
  const [r] = await db.query('INSERT INTO bt_level18_sessions (player_id) VALUES (?)', [playerId]);
  return one(`${SELECT_SESSION} WHERE s.id = ?`, [r.insertId]);
};

const abandonActive = (playerId) =>
  db.query(
    "UPDATE bt_level18_sessions SET status = 'abandoned', completed_at = NOW() WHERE player_id = ? AND status = 'in_progress'",
    [playerId]
  );

const markHintUsed = (sessionId) =>
  db.query('UPDATE bt_level18_sessions SET hints_used = hints_used + 1 WHERE id = ?', [sessionId]);

const completeSession = (sessionId, attempts, seconds) =>
  db.query(
    "UPDATE bt_level18_sessions SET status = 'completed', attempts = ?, seconds = ?, completed_at = NOW() WHERE id = ?",
    [attempts, seconds, sessionId]
  );

const skipSession = (sessionId) =>
  db.query(
    "UPDATE bt_level18_sessions SET status = 'skipped', completed_at = NOW() WHERE id = ?",
    [sessionId]
  );

/* ---------------------------------------------------------
   ANSWERS
--------------------------------------------------------- */

const countWrong = async (sessionId) => {
  const row = await one(
    'SELECT COUNT(*) AS n FROM bt_level18_answers WHERE session_id = ? AND is_correct = 0',
    [sessionId]
  );
  return row ? Number(row.n) || 0 : 0;
};

const recordAnswer = (sessionId, answer, correct) =>
  db.query(
    'INSERT INTO bt_level18_answers (session_id, answer, is_correct) VALUES (?, ?, ?)',
    [sessionId, answer, correct ? 1 : 0]
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
  countWrong,
  recordAnswer,
  saveProgress,
  unlockNext,
  getProgress,
};