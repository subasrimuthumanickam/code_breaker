// // // level44Db.js  - MySQL access for Brain Twist Level 44
// // const mysql = require('mysql2/promise');

// // const pool = mysql.createPool({
// //   host: process.env.DB_HOST || 'localhost',
// //   port: Number(process.env.DB_PORT || 3306),
// //   user: process.env.DB_USER || 'root',
// //   password: process.env.DB_PASSWORD || '',
// //   database: process.env.DB_NAME || 'braintwist',
// //   waitForConnections: true,
// //   connectionLimit: 10,
// // });

// // async function getLevelConfig() {
// //   const [rows] = await pool.query(
// //     'SELECT * FROM bt_level44_config WHERE level_number = 44 AND is_active = 1 LIMIT 1'
// //   );
// //   return rows[0] || null;
// // }

// // async function saveAttempt(userId, answer, isCorrect) {
// //   await pool.query(
// //     'INSERT INTO bt_level44_attempts (user_id, submitted_answer, is_correct) VALUES (?, ?, ?)',
// //     [userId, answer, isCorrect ? 1 : 0]
// //   );
// // }

// // async function markCompleted(userId) {
// //   await pool.query(
// //     `INSERT INTO bt_level44_progress (user_id, completed, completed_at)
// //      VALUES (?, 1, NOW())
// //      ON DUPLICATE KEY UPDATE completed = 1, completed_at = NOW()`,
// //     [userId]
// //   );
// // }

// // async function addHintUsed(userId) {
// //   await pool.query(
// //     `INSERT INTO bt_level44_progress (user_id, hints_used) VALUES (?, 1)
// //      ON DUPLICATE KEY UPDATE hints_used = hints_used + 1`,
// //     [userId]
// //   );
// // }

// // module.exports = { pool, getLevelConfig, saveAttempt, markCompleted, addHintUsed };
// // level44Db.js  - MySQL access for Brain Twist Level 44
// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   port: Number(process.env.DB_PORT || 3306),
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'codebreaker',
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// async function getLevelConfig() {
//   const [rows] = await pool.query(
//     'SELECT * FROM bt_level44_config WHERE level_number = 44 AND is_active = 1 LIMIT 1'
//   );
//   return rows[0] || null;
// }

// async function saveAttempt(userId, answer, isCorrect) {
//   await pool.query(
//     'INSERT INTO bt_level44_attempts (user_id, submitted_answer, is_correct) VALUES (?, ?, ?)',
//     [userId, answer, isCorrect ? 1 : 0]
//   );
// }

// async function markCompleted(userId) {
//   await pool.query(
//     `INSERT INTO bt_level44_progress (user_id, completed, completed_at)
//      VALUES (?, 1, NOW())
//      ON DUPLICATE KEY UPDATE completed = 1, completed_at = NOW()`,
//     [userId]
//   );
// }

// async function addHintUsed(userId) {
//   await pool.query(
//     `INSERT INTO bt_level44_progress (user_id, hints_used) VALUES (?, 1)
//      ON DUPLICATE KEY UPDATE hints_used = hints_used + 1`,
//     [userId]
//   );
// }

// module.exports = { pool, getLevelConfig, saveAttempt, markCompleted, addHintUsed };
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'code_breaker', // was 'codebreaker' (that DB is dropped)
  waitForConnections: true,
  connectionLimit: 10,
});

async function getLevelConfig() {
  const [rows] = await pool.query(
    'SELECT * FROM bt_level44_config WHERE level_number = 44 AND is_active = 1 LIMIT 1'
  );
  return rows[0] || null;
}

async function saveAttempt(userId, answer, isCorrect) {
  await pool.query(
    'INSERT INTO bt_level44_attempts (user_id, submitted_answer, is_correct) VALUES (?, ?, ?)',
    [userId, answer, isCorrect ? 1 : 0]
  );
}

async function markCompleted(userId) {
  await pool.query(
    `INSERT INTO bt_level44_progress (user_id, completed, completed_at)
     VALUES (?, 1, NOW())
     ON DUPLICATE KEY UPDATE completed = 1, completed_at = NOW()`,
    [userId]
  );
}

async function addHintUsed(userId) {
  await pool.query(
    `INSERT INTO bt_level44_progress (user_id, hints_used) VALUES (?, 1)
     ON DUPLICATE KEY UPDATE hints_used = hints_used + 1`,
    [userId]
  );
}

module.exports = { pool, getLevelConfig, saveAttempt, markCompleted, addHintUsed };