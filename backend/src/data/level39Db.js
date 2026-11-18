
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'code_breaker',
  waitForConnections: true,
  connectionLimit: 10,
});

const LEVEL_NO = 39;

async function getLevel() {
  const [rows] = await pool.query('SELECT * FROM bt_level39 WHERE level_no = ?', [LEVEL_NO]);
  return rows[0] || null;
}

async function getOrCreateProgress(userId) {
  await pool.query('INSERT IGNORE INTO bt_level39_progress (user_id) VALUES (?)', [userId]);
  const [rows] = await pool.query('SELECT * FROM bt_level39_progress WHERE user_id = ?', [userId]);
  return rows[0];
}

// delta can be negative; returns false if balance would go below 0
async function adjustCoins(userId, delta) {
  const [res] = await pool.query(
    'UPDATE bt_level39_progress SET coins = coins + ? WHERE user_id = ? AND coins + ? >= 0',
    [delta, userId, delta]
  );
  return res.affectedRows === 1;
}

async function logAttempt(userId, answer, isCorrect) {
  await pool.query(
    'INSERT INTO bt_level39_attempts (user_id, answer_given, is_correct) VALUES (?, ?, ?)',
    [userId, String(answer).slice(0, 50), isCorrect ? 1 : 0]
  );
  await pool.query('UPDATE bt_level39_progress SET attempts = attempts + 1 WHERE user_id = ?', [userId]);
}

async function markSolved(userId) {
  await pool.query('UPDATE bt_level39_progress SET solved = 1 WHERE user_id = ?', [userId]);
}

async function markSkipped(userId) {
  await pool.query('UPDATE bt_level39_progress SET skipped = 1 WHERE user_id = ?', [userId]);
}

module.exports = {
  LEVEL_NO,
  getLevel,
  getOrCreateProgress,
  adjustCoins,
  logAttempt,
  markSolved,
  markSkipped,
};