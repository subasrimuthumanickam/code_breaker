// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASS || '',
//   database: process.env.DB_NAME || 'brain_game',
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// async function getLevel() {
//   const [rows] = await pool.query('SELECT * FROM level37_config WHERE level_no = 37 LIMIT 1');
//   return rows[0] || null;
// }

// async function saveAttempt(userId, selected, isCorrect) {
//   await pool.query(
//     'INSERT INTO level37_attempts (user_id, selected, is_correct) VALUES (?, ?, ?)',
//     [userId, selected, isCorrect ? 1 : 0]
//   );
// }

// async function getCoins(userId) {
//   const [rows] = await pool.query('SELECT coins FROM player_progress WHERE user_id = ?', [userId]);
//   return rows.length ? rows[0].coins : 0;
// }

// // delta can be + (video reward) or - (skip cost). Returns null if not enough coins.
// async function changeCoins(userId, delta) {
//   const [res] = await pool.query(
//     'UPDATE player_progress SET coins = coins + ? WHERE user_id = ? AND coins + ? >= 0',
//     [delta, userId, delta]
//   );
//   if (res.affectedRows === 0) return null;
//   return getCoins(userId);
// }

// module.exports = { getLevel, saveAttempt, getCoins, changeCoins };
require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "code_breaker",
  waitForConnections: true,
  connectionLimit: 10,
});

async function getLevel() {
  const [rows] = await pool.query("SELECT * FROM braintwist_level37 WHERE id = 1 LIMIT 1");
  return rows[0] || null;
}

async function saveAttempt(playerId, selected, isCorrect) {
  await pool.query(
    "INSERT INTO braintwist_level37_attempts (player_id, selected, is_correct) VALUES (?, ?, ?)",
    [playerId, selected, isCorrect ? 1 : 0]
  );
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS n FROM braintwist_level37_attempts WHERE player_id = ?",
    [playerId]
  );
  return rows[0].n;
}

module.exports = { getLevel, saveAttempt };