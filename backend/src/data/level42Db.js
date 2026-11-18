
const mysql = require('mysql2/promise');

// If your other levels use a shared pool (e.g. require('./db')), import it here
// and delete this createPool block.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'braintwist',
  waitForConnections: true,
  connectionLimit: 10,
});

const VISIBLE_SLICES = 5;


const LAYOUT = [
  { id: 0, x: 18,  y: 8,   rot: -30, hasHidden: true  },
  { id: 1, x: 214, y: 8,   rot: 30,  hasHidden: true  },
  { id: 2, x: 116, y: 78,  rot: 0,   hasHidden: false },
  { id: 3, x: 26,  y: 140, rot: -60, hasHidden: true  },
  { id: 4, x: 206, y: 140, rot: 60,  hasHidden: true  },
];
const getTotalSlices = () =>
  VISIBLE_SLICES + LAYOUT.filter((s) => s.hasHidden).length; // 9

async function initLevel42Tables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS braintwist_level42_attempts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      selected_answer INT NOT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      dragged_count INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user (user_id)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS braintwist_level42_progress (
      user_id VARCHAR(64) PRIMARY KEY,
      completed TINYINT(1) NOT NULL DEFAULT 0,
      attempts INT NOT NULL DEFAULT 0,
      completed_at TIMESTAMP NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

async function saveAttempt({ userId, answer, isCorrect, draggedCount }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      `INSERT INTO braintwist_level42_attempts
       (user_id, selected_answer, is_correct, dragged_count) VALUES (?, ?, ?, ?)`,
      [userId, answer, isCorrect ? 1 : 0, draggedCount]
    );
    await conn.query(
      `INSERT INTO braintwist_level42_progress (user_id, completed, attempts, completed_at)
       VALUES (?, ?, 1, ${isCorrect ? 'NOW()' : 'NULL'})
       ON DUPLICATE KEY UPDATE
         attempts = attempts + 1,
         completed_at = IF(completed = 1, completed_at, VALUES(completed_at)),
         completed = IF(completed = 1, 1, VALUES(completed))`,
      [userId, isCorrect ? 1 : 0]
    );
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

async function getProgress(userId) {
  const [rows] = await pool.query(
    'SELECT completed, attempts FROM braintwist_level42_progress WHERE user_id = ?',
    [userId]
  );
  return rows[0] || { completed: 0, attempts: 0 };
}

module.exports = {
  pool,
  LAYOUT,
  getTotalSlices,
  initLevel42Tables,
  saveAttempt,
  getProgress,
};