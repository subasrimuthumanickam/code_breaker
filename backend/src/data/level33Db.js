// backend/db/level33Db.js
const pool = require('../db');

const LEVEL_NO = 33;

const QUESTION = {
  title: 'Match the relation',
  prompt: 'India : Tricolor',
  options: [
    { id: 'A', text: 'China : Sickle and Hammer' },
    { id: 'B', text: 'UK : Red Cross' },
    { id: 'C', text: 'USA : Stars and Stripes' },
    { id: 'D', text: 'None of the above' },
  ],
  correct: 'C',
  hintCost: 0,
  skipCost: 50,
  videoReward: 75,
  reward: 10,
};

async function initTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bt_level33_progress (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'playing',
      attempts INT NOT NULL DEFAULT 0,
      hint_used TINYINT(1) NOT NULL DEFAULT 0,
      skipped TINYINT(1) NOT NULL DEFAULT 0,
      last_answer CHAR(1) NULL,
      completed_at DATETIME NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_player (player_id)
    )
  `);
}

async function getHints(playerId) {
  const [rows] = await pool.query('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
  return rows.length ? Number(rows[0].hints) : 0;
}

async function getProgress(playerId) {
  await pool.query(
    'INSERT IGNORE INTO bt_level33_progress (player_id) VALUES (?)',
    [playerId]
  );
  const [rows] = await pool.query(
    'SELECT * FROM bt_level33_progress WHERE player_id = ?',
    [playerId]
  );
  return rows[0];
}

async function saveAnswer(playerId, answer, isCorrect) {
  await getProgress(playerId);
  if (isCorrect) {
    await pool.query(
      `UPDATE bt_level33_progress
         SET attempts = attempts + 1, last_answer = ?, status = 'completed', completed_at = NOW()
       WHERE player_id = ?`,
      [answer, playerId]
    );
    await pool.query('UPDATE bt_players SET hints = hints + ? WHERE id = ?', [
      QUESTION.reward,
      playerId,
    ]);
  } else {
    await pool.query(
      `UPDATE bt_level33_progress
         SET attempts = attempts + 1, last_answer = ?
       WHERE player_id = ?`,
      [answer, playerId]
    );
  }
}

// returns { ok, hints, message }
async function spendHints(playerId, cost) {
  const [res] = await pool.query(
    'UPDATE bt_players SET hints = hints - ? WHERE id = ? AND hints >= ?',
    [cost, playerId, cost]
  );
  const hints = await getHints(playerId);
  if (res.affectedRows === 0) {
    return { ok: false, hints, message: 'Not enough hints' };
  }
  return { ok: true, hints };
}

async function markHintUsed(playerId) {
  await pool.query('UPDATE bt_level33_progress SET hint_used = 1 WHERE player_id = ?', [playerId]);
}

async function markSkipped(playerId) {
  await pool.query(
    `UPDATE bt_level33_progress
       SET skipped = 1, status = 'skipped', completed_at = NOW()
     WHERE player_id = ?`,
    [playerId]
  );
}

async function addVideoReward(playerId) {
  await pool.query('UPDATE bt_players SET hints = hints + ? WHERE id = ?', [
    QUESTION.videoReward,
    playerId,
  ]);
  return getHints(playerId);
}

module.exports = {
  LEVEL_NO,
  QUESTION,
  initTables,
  getHints,
  getProgress,
  saveAnswer,
  spendHints,
  markHintUsed,
  markSkipped,
  addVideoReward,
};