
const mysql = require('mysql2/promise');

// same database as the other levels (level41 uses "code_breaker")
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'code_breaker',
  waitForConnections: true,
  connectionLimit: 10,
});

// Play area is 320 x 340. Coordinates are relative to it.
const LAYOUT = {
  area: { w: 320, h: 340 },
  banana: { x: 110, y: 6, w: 100, h: 84 }, // bunch of bananas
  wire: { y: 112, h: 76 },
  monkey: { x: 100, y: 205, w: 120, h: 130 },
};

// Trick: the ONLY correct place is the word "monkey" inside the question text.
// Dropping the bananas on the drawn monkey (or anywhere else) is wrong.
function isFed(item, target) {
  return item === 'banana' && target === 'monkey_word';
}

async function initLevel43Tables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS braintwist_level43_attempts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id VARCHAR(64) NOT NULL,
      item VARCHAR(32) NOT NULL,
      drop_x INT NOT NULL,
      drop_y INT NOT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_player (player_id)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS braintwist_level43_progress (
      player_id VARCHAR(64) PRIMARY KEY,
      completed TINYINT(1) NOT NULL DEFAULT 0,
      attempts INT NOT NULL DEFAULT 0,
      completed_at TIMESTAMP NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

async function saveAttempt({ playerId, item, x, y, isCorrect }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      `INSERT INTO braintwist_level43_attempts
       (player_id, item, drop_x, drop_y, is_correct) VALUES (?, ?, ?, ?, ?)`,
      [playerId, item, Math.round(Number(x) || 0), Math.round(Number(y) || 0), isCorrect ? 1 : 0]
    );
    await conn.query(
      `INSERT INTO braintwist_level43_progress (player_id, completed, attempts, completed_at)
       VALUES (?, ?, 1, ${isCorrect ? 'NOW()' : 'NULL'})
       ON DUPLICATE KEY UPDATE
         attempts = attempts + 1,
         completed_at = IF(completed = 1, completed_at, VALUES(completed_at)),
         completed = IF(completed = 1, 1, VALUES(completed))`,
      [playerId, isCorrect ? 1 : 0]
    );
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

async function getProgress(playerId) {
  const [rows] = await pool.query(
    'SELECT completed, attempts FROM braintwist_level43_progress WHERE player_id = ?',
    [playerId]
  );
  return rows[0] || { completed: 0, attempts: 0 };
}

module.exports = {
  pool,
  LAYOUT,
  isFed,
  initLevel43Tables,
  saveAttempt,
  getProgress,
};