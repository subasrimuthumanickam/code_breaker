// // data/level50Db.js
// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'braintwist',
//   waitForConnections: true,
//   connectionLimit: 10,
//   connectTimeout: 8000,
// });

// // JSON columns come back parsed on MySQL, but as strings on MariaDB
// const asJson = (v) => (typeof v === 'string' ? JSON.parse(v) : v);

// async function getConfig() {
//   const [rows] = await pool.query('SELECT * FROM bt_level50_config WHERE id = 1');
//   if (!rows[0]) return null;
//   const r = rows[0];
//   return {
//     question: r.question,
//     patterns: asJson(r.patterns),
//     needOn: asJson(r.need_on),
//     hints: asJson(r.hints),
//     clueCost: r.clue_cost,
//     skipCost: r.skip_cost,
//     rewardHints: r.reward_hints,
//   };
// }

// async function getProgress(playerId) {
//   const [rows] = await pool.query('SELECT * FROM bt_level50_progress WHERE player_id = ?', [playerId]);
//   return rows[0] || null;
// }

// async function ensureProgress(playerId) {
//   await pool.query('INSERT IGNORE INTO bt_level50_progress (player_id) VALUES (?)', [playerId]);
//   return getProgress(playerId);
// }

// async function recordAttempt(playerId, moves, correct) {
//   await ensureProgress(playerId);
//   const json = JSON.stringify(moves || []).slice(0, 4000);
//   if (correct) {
//     await pool.query(
//       `UPDATE bt_level50_progress
//        SET attempts = attempts + 1, last_moves = ?, solved = 1, solved_at = NOW()
//        WHERE player_id = ?`,
//       [json, playerId]
//     );
//   } else {
//     await pool.query(
//       `UPDATE bt_level50_progress SET attempts = attempts + 1, last_moves = ? WHERE player_id = ?`,
//       [json, playerId]
//     );
//   }
//   return getProgress(playerId);
// }

// async function recordClue(playerId) {
//   await ensureProgress(playerId);
//   await pool.query('UPDATE bt_level50_progress SET clues_used = clues_used + 1 WHERE player_id = ?', [playerId]);
//   return getProgress(playerId);
// }

// async function recordSkip(playerId) {
//   await ensureProgress(playerId);
//   await pool.query('UPDATE bt_level50_progress SET skipped = 1 WHERE player_id = ?', [playerId]);
//   return getProgress(playerId);
// }

// module.exports = {
//   pool,
//   getConfig,
//   getProgress,
//   ensureProgress,
//   recordAttempt,
//   recordClue,
//   recordSkip,
// };
// data/level50Db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'code_breaker', // was 'braintwist' (that DB does not exist)
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 8000,
});

// JSON columns come back parsed on MySQL, but as strings on MariaDB
const asJson = (v) => (typeof v === 'string' ? JSON.parse(v) : v);

async function getConfig() {
  const [rows] = await pool.query('SELECT * FROM bt_level50_config WHERE id = 1');
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    question: r.question,
    patterns: asJson(r.patterns),
    needOn: asJson(r.need_on),
    hints: asJson(r.hints),
    clueCost: r.clue_cost,
    skipCost: r.skip_cost,
    rewardHints: r.reward_hints,
  };
}

async function getProgress(playerId) {
  const [rows] = await pool.query('SELECT * FROM bt_level50_progress WHERE player_id = ?', [playerId]);
  return rows[0] || null;
}

async function ensureProgress(playerId) {
  await pool.query('INSERT IGNORE INTO bt_level50_progress (player_id) VALUES (?)', [playerId]);
  return getProgress(playerId);
}

async function recordAttempt(playerId, moves, correct) {
  await ensureProgress(playerId);
  const json = JSON.stringify(moves || []).slice(0, 4000);
  if (correct) {
    await pool.query(
      `UPDATE bt_level50_progress
       SET attempts = attempts + 1, last_moves = ?, solved = 1, solved_at = NOW()
       WHERE player_id = ?`,
      [json, playerId]
    );
  } else {
    await pool.query(
      `UPDATE bt_level50_progress SET attempts = attempts + 1, last_moves = ? WHERE player_id = ?`,
      [json, playerId]
    );
  }
  return getProgress(playerId);
}

async function recordClue(playerId) {
  await ensureProgress(playerId);
  await pool.query('UPDATE bt_level50_progress SET clues_used = clues_used + 1 WHERE player_id = ?', [playerId]);
  return getProgress(playerId);
}

async function recordSkip(playerId) {
  await ensureProgress(playerId);
  await pool.query('UPDATE bt_level50_progress SET skipped = 1 WHERE player_id = ?', [playerId]);
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