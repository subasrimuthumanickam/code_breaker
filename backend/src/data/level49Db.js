// data/level49Db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'braintwist',
  waitForConnections: true,
  connectionLimit: 10,
});

async function getConfig() {
  const [rows] = await pool.query('SELECT * FROM bt_level49_config WHERE id = 1');
  return rows[0] || null;
}

async function getProgress(playerId) {
  const [rows] = await pool.query(
    'SELECT * FROM bt_level49_progress WHERE player_id = ?',
    [playerId]
  );
  return rows[0] || null;
}

async function ensureProgress(playerId) {
  await pool.query(
    'INSERT IGNORE INTO bt_level49_progress (player_id) VALUES (?)',
    [playerId]
  );
  return getProgress(playerId);
}

async function recordAttempt(playerId, guess, correct) {
  await ensureProgress(playerId);
  if (correct) {
    await pool.query(
      `UPDATE bt_level49_progress
       SET attempts = attempts + 1, last_guess = ?, solved = 1, solved_at = NOW()
       WHERE player_id = ?`,
      [guess, playerId]
    );
  } else {
    await pool.query(
      `UPDATE bt_level49_progress
       SET attempts = attempts + 1, last_guess = ?
       WHERE player_id = ?`,
      [guess, playerId]
    );
  }
  return getProgress(playerId);
}

async function recordClue(playerId) {
  await ensureProgress(playerId);
  await pool.query(
    'UPDATE bt_level49_progress SET clues_used = clues_used + 1 WHERE player_id = ?',
    [playerId]
  );
  return getProgress(playerId);
}

async function recordSkip(playerId) {
  await ensureProgress(playerId);
  await pool.query(
    'UPDATE bt_level49_progress SET skipped = 1 WHERE player_id = ?',
    [playerId]
  );
  return getProgress(playerId);
}

module.exports = {
  pool,
  getConfig,
  getProgress,
  ensureProgress,
  recordAttempt,
  recordClue,
  recordSkip,
};