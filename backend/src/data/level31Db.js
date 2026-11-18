
const db = require('../db');

const LEVEL = 31;

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

const ready = (async () => {
  // one row per player: the state of the game that is open now
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level31_state (
      player_id INT PRIMARY KEY,
      attempts INT NOT NULL DEFAULT 0,
      solved TINYINT(1) NOT NULL DEFAULT 0,
      skipped TINYINT(1) NOT NULL DEFAULT 0,
      hints_used INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // every answer the player types (right or wrong)
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level31_answers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      answer VARCHAR(100) NOT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l31_ans_player (player_id)
    )
  `);

  // every tap on the clue button
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level31_hint_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      hints_left INT NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l31_hint_player (player_id)
    )
  `);

  console.log('[BrainTwist L31] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L31] could not create tables:', err.message)
);

/* ---------- player / hints ---------- */

const getPlayer = (playerId) =>
  one('SELECT id, hints FROM bt_players WHERE id = ?', [playerId]);

const getHints = async (playerId) => {
  const row = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
  return row ? Number(row.hints) || 0 : 0;
};

// takes `amount` hints; null when the player does not have enough
const spendHints = async (playerId, amount) => {
  const [r] = await db.query(
    'UPDATE bt_players SET hints = hints - ? WHERE id = ? AND hints >= ?',
    [amount, playerId, amount]
  );
  if (!r.affectedRows) return null;
  return getHints(playerId);
};

const addHints = async (playerId, amount) => {
  await db.query('UPDATE bt_players SET hints = hints + ? WHERE id = ?', [amount, playerId]);
  return getHints(playerId);
};

/* ---------- game state ---------- */

// every time the level is opened: a fresh game
const resetState = async (playerId) => {
  await db.query(
    `INSERT INTO bt_level31_state (player_id, attempts, solved, skipped, hints_used, started_at, updated_at)
     VALUES (?, 0, 0, 0, 0, NOW(), NOW())
     ON DUPLICATE KEY UPDATE attempts = 0, solved = 0, skipped = 0, hints_used = 0,
                             started_at = NOW(), updated_at = NOW()`,
    [playerId]
  );
  return getState(playerId);
};

const getState = (playerId) =>
  one('SELECT * FROM bt_level31_state WHERE player_id = ?', [playerId]);

// makes sure the row exists (when /answer is called before /start)
const ensureState = async (playerId) => {
  const found = await getState(playerId);
  return found || resetState(playerId);
};

const addAttempt = async (playerId) => {
  await db.query(
    'UPDATE bt_level31_state SET attempts = attempts + 1, updated_at = NOW() WHERE player_id = ?',
    [playerId]
  );
  const row = await getState(playerId);
  return row ? Number(row.attempts) : 1;
};

const markHintUsed = (playerId) =>
  db.query(
    'UPDATE bt_level31_state SET hints_used = hints_used + 1, updated_at = NOW() WHERE player_id = ?',
    [playerId]
  );

const markSolved = (playerId) =>
  db.query('UPDATE bt_level31_state SET solved = 1, updated_at = NOW() WHERE player_id = ?', [playerId]);

const markSkipped = (playerId) =>
  db.query(
    'UPDATE bt_level31_state SET skipped = 1, updated_at = NOW() WHERE player_id = ?',
    [playerId]
  );

const logAnswer = (playerId, answer, correct) =>
  db.query('INSERT INTO bt_level31_answers (player_id, answer, is_correct) VALUES (?, ?, ?)', [
    playerId,
    String(answer).slice(0, 100),
    correct ? 1 : 0,
  ]);

const logHint = (playerId, hintsLeft) =>
  db.query('INSERT INTO bt_level31_hint_log (player_id, hints_left) VALUES (?, ?)', [
    playerId,
    hintsLeft,
  ]);

/* ---------- progress ---------- */

const saveProgress = async (playerId, score, stars, attempts) => {
  const found = await one(
    'SELECT id FROM brain_twist_progress WHERE player_id = ? AND level_number = ?',
    [playerId, LEVEL]
  );

  if (found) {
    await db.query(
      `UPDATE brain_twist_progress
       SET is_completed = 1,
           score = GREATEST(COALESCE(score, 0), ?),
           stars = GREATEST(COALESCE(stars, 0), ?),
           attempts = COALESCE(attempts, 0) + ?,
           completed_at = NOW()
       WHERE id = ?`,
      [score, stars, attempts, found.id]
    );
  } else {
    await db.query(
      `INSERT INTO brain_twist_progress
        (player_id, level_number, is_completed, score, stars, attempts, completed_at)
       VALUES (?, ?, 1, ?, ?, ?, NOW())`,
      [playerId, LEVEL, score, stars, attempts]
    );
  }
};

const unlockNext = async (playerId, attempts) => {
  await db.query(
    `INSERT INTO bt_progress (player_id, level_n, attempts, solved_at)
     VALUES (?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE solved_at = COALESCE(solved_at, NOW())`,
    [playerId, LEVEL, attempts]
  );

  await db.query(
    `UPDATE bt_players
     SET current_level = GREATEST(COALESCE(current_level, 1), ?)
     WHERE id = ?`,
    [LEVEL + 1, playerId]
  );
};

const getProgress = (playerId) =>
  one(
    `SELECT is_completed, score, stars, attempts, completed_at
     FROM brain_twist_progress WHERE player_id = ? AND level_number = ?`,
    [playerId, LEVEL]
  );

module.exports = {
  LEVEL,
  ready,
  getPlayer,
  getHints,
  spendHints,
  addHints,
  resetState,
  getState,
  ensureState,
  addAttempt,
  markHintUsed,
  markSolved,
  markSkipped,
  logAnswer,
  logHint,
  saveProgress,
  unlockNext,
  getProgress,
};