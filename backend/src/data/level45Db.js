const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'code_breaker',
  waitForConnections: true,
  connectionLimit: 10,
});

const LEVEL = 45;

async function getLevelConfig() {
  const [rows] = await pool.query(
    'SELECT * FROM bt_level45_config WHERE level_number = ? AND is_active = 1 LIMIT 1',
    [LEVEL]
  );
  return rows[0] || null;
}

async function getStages() {
  const [rows] = await pool.query(
    `SELECT stage_number, prompt, options_json, correct_index, hint_text
       FROM bt_level45_stages
      WHERE level_number = ?
      ORDER BY stage_number`,
    [LEVEL]
  );
  return rows;
}

async function getStage(stageNumber) {
  const [rows] = await pool.query(
    `SELECT stage_number, prompt, options_json, correct_index, hint_text
       FROM bt_level45_stages
      WHERE level_number = ? AND stage_number = ?
      LIMIT 1`,
    [LEVEL, stageNumber]
  );
  return rows[0] || null;
}

async function saveAttempt(userId, stageNumber, pickedIndex, isCorrect) {
  await pool.query(
    `INSERT INTO bt_level45_attempts (user_id, stage_number, picked_index, is_correct)
     VALUES (?, ?, ?, ?)`,
    [userId, stageNumber, pickedIndex, isCorrect ? 1 : 0]
  );
}

// Called when a stage is answered correctly. isLast = true when it was the final stage.
async function saveStageProgress(userId, stageNumber, isLast) {
  await pool.query(
    `INSERT INTO bt_level45_progress (user_id, stages_cleared, completed, completed_at)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       stages_cleared = GREATEST(stages_cleared, VALUES(stages_cleared)),
       completed      = GREATEST(completed, VALUES(completed)),
       completed_at   = IF(VALUES(completed) = 1, NOW(), completed_at)`,
    [userId, stageNumber, isLast ? 1 : 0, isLast ? new Date() : null]
  );
}

async function addHintUsed(userId) {
  await pool.query(
    `INSERT INTO bt_level45_progress (user_id, hints_used) VALUES (?, 1)
     ON DUPLICATE KEY UPDATE hints_used = hints_used + 1`,
    [userId]
  );
}

module.exports = {
  pool,
  getLevelConfig,
  getStages,
  getStage,
  saveAttempt,
  saveStageProgress,
  addHintUsed,
};