
const pool = require('../db');

const LEVEL_NO = 35;
const ANSWER = '052'; // lives ONLY on the server

const QUESTION = {
  text: 'Guess the number',
  hintCost: 0,
  skipCost: 50,
  videoReward: 75,
  reward: 10,
};

const HINTS = [
  'Rock, paper and scissors... think about your hand when you play.',
  'Count the fingers you show for each symbol.',
  'Rock = 0 (closed fist), Paper = 5 (open hand), Scissors = 2 (two fingers).',
];

function isCorrectAnswer(raw) {
  return String(raw || '').replace(/\D/g, '') === ANSWER;
}

function hintText(count) {
  return HINTS[Math.min(Math.max(count, 1), HINTS.length) - 1];
}

async function initTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bt_level35_progress (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'playing',
      attempts INT NOT NULL DEFAULT 0,
      hints_used INT NOT NULL DEFAULT 0,
      skipped TINYINT(1) NOT NULL DEFAULT 0,
      last_answer VARCHAR(10) NULL,
      completed_at DATETIME NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_player (player_id)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bt_level35_attempts (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      answer VARCHAR(10) NOT NULL,
      is_correct TINYINT(1) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_player (player_id)
    )
  `);
}

async function getHints(playerId) {
  const [rows] = await pool.query('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
  return rows.length ? Number(rows[0].hints) : 0;
}

async function getProgress(playerId) {
  await pool.query('INSERT IGNORE INTO bt_level35_progress (player_id) VALUES (?)', [playerId]);
  const [rows] = await pool.query('SELECT * FROM bt_level35_progress WHERE player_id = ?', [
    playerId,
  ]);
  return rows[0];
}

// Saves the guess (every attempt is logged). The +reward hints are given only the first time.
async function saveAnswer(playerId, answer, isCorrect) {
  const before = await getProgress(playerId);
  const text = String(answer || '').slice(0, 10);

  await pool.query(
    'INSERT INTO bt_level35_attempts (player_id, answer, is_correct) VALUES (?, ?, ?)',
    [playerId, text, isCorrect ? 1 : 0]
  );

  if (isCorrect) {
    const firstTime = before.status === 'playing';
    await pool.query(
      `UPDATE bt_level35_progress
          SET attempts = attempts + 1, last_answer = ?,
              status = IF(status = 'skipped', status, 'completed'),
              completed_at = IF(completed_at IS NULL, NOW(), completed_at)
        WHERE player_id = ?`,
      [text, playerId]
    );
    if (firstTime) {
      await pool.query('UPDATE bt_players SET hints = hints + ? WHERE id = ?', [
        QUESTION.reward,
        playerId,
      ]);
    }
    return firstTime;
  }

  await pool.query(
    'UPDATE bt_level35_progress SET attempts = attempts + 1, last_answer = ? WHERE player_id = ?',
    [text, playerId]
  );
  return false;
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

// counts the hints used and returns the new count (picks the next hint text)
async function markHintUsed(playerId) {
  await pool.query(
    'UPDATE bt_level35_progress SET hints_used = hints_used + 1 WHERE player_id = ?',
    [playerId]
  );
  const [rows] = await pool.query(
    'SELECT hints_used FROM bt_level35_progress WHERE player_id = ?',
    [playerId]
  );
  return rows.length ? Number(rows[0].hints_used) : 1;
}

async function markSkipped(playerId) {
  await pool.query(
    `UPDATE bt_level35_progress
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
  ANSWER,
  QUESTION,
  isCorrectAnswer,
  hintText,
  initTables,
  getHints,
  getProgress,
  saveAnswer,
  spendHints,
  markHintUsed,
  markSkipped,
  addVideoReward,
};