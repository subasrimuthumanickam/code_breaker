// level40Db.js  -  MySQL connection + table setup for Brain Twist Level 40
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'braintwist',
  waitForConnections: true,
  connectionLimit: 10,
});

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS bt_users (
    user_id VARCHAR(64) PRIMARY KEY,
    hints INT NOT NULL DEFAULT 100,
    current_level INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS bt_level40_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    submitted_answer VARCHAR(16) NOT NULL,
    is_correct TINYINT(1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id)
  )`,
  `CREATE TABLE IF NOT EXISTS bt_level_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    level INT NOT NULL,
    status ENUM('solved','skipped') NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_level (user_id, level)
  )`,
];

async function initLevel40Db() {
  for (const sql of SCHEMA) await pool.query(sql);
  console.log('Level 40 tables ready');
}

module.exports = { pool, initLevel40Db };