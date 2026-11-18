
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