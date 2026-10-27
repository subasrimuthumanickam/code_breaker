
const db = require('../db');   // FIX: Level 12-la "pool" nu irundhadhu, adhaan "db is not defined"

const LEVEL = 15;
const CODE_LENGTH = 4;

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};



const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level15_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      code VARCHAR(8) NOT NULL,
      vault_moved TINYINT(1) NOT NULL DEFAULT 0,
      taps INT NOT NULL DEFAULT 0,
      wrong_attempts INT NOT NULL DEFAULT 0,
      total_attempts INT NOT NULL DEFAULT 0,
      hints_used INT NOT NULL DEFAULT 0,
      seconds INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l15_player (player_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level15_actions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      action VARCHAR(20) NOT NULL,
      value VARCHAR(30) NOT NULL DEFAULT '',
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l15_session (session_id)
    )
  `);

  console.log('[BrainTwist L15] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L15] could not create tables:', err.message)
);

/* ---------------------------------------------------------
   PLAYER / HINTS
--------------------------------------------------------- */

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

/* ---------------------------------------------------------
   SESSIONS
--------------------------------------------------------- */

const SELECT_SESSION = `SELECT s.*, TIMESTAMPDIFF(SECOND, s.started_at, NOW()) AS elapsed
                        FROM bt_level15_sessions s`;

// random password, digits 1-9 only (the keypad has no 0)
// 4 DIFFERENT digits, so the dots on the paper show the code without any doubt
const makeCode = () => {
  const d = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d.slice(0, CODE_LENGTH).join('');
};

const getSession = (sessionId, playerId) =>
  one(`${SELECT_SESSION} WHERE s.id = ? AND s.player_id = ?`, [sessionId, playerId]);

const getActiveSession = (playerId) =>
  one(
    `${SELECT_SESSION} WHERE s.player_id = ? AND s.status = 'in_progress' ORDER BY s.id DESC LIMIT 1`,
    [playerId]
  );

const createSession = async (playerId) => {
  const [r] = await db.query(
    'INSERT INTO bt_level15_sessions (player_id, code) VALUES (?, ?)',
    [playerId, makeCode()]
  );
  return one(`${SELECT_SESSION} WHERE s.id = ?`, [r.insertId]);
};

// the vault is pushed back to its place (paper hidden again) every time the level is opened
const resetVault = (sessionId) =>
  db.query('UPDATE bt_level15_sessions SET vault_moved = 0 WHERE id = ?', [sessionId]);

// closes a game (used for old games that have a repeated-digit code)
const abandonSession = (sessionId) =>
  db.query(
    "UPDATE bt_level15_sessions SET status = 'abandoned', completed_at = NOW() WHERE id = ?",
    [sessionId]
  );

/* ---------------------------------------------------------
   ACTIONS
--------------------------------------------------------- */

const recordAction = (sessionId, action, value = '', correct = false) =>
  db.query(
    'INSERT INTO bt_level15_actions (session_id, action, value, is_correct) VALUES (?, ?, ?, ?)',
    [sessionId, action, String(value).slice(0, 30), correct ? 1 : 0]
  );

const markVaultMoved = (sessionId) =>
  db.query('UPDATE bt_level15_sessions SET vault_moved = 1 WHERE id = ?', [sessionId]);

const addTap = (sessionId) =>
  db.query('UPDATE bt_level15_sessions SET taps = taps + 1 WHERE id = ?', [sessionId]);

const addAttempt = (sessionId, wrong) =>
  db.query(
    `UPDATE bt_level15_sessions
     SET total_attempts = total_attempts + 1,
         wrong_attempts = wrong_attempts + ?
     WHERE id = ?`,
    [wrong ? 1 : 0, sessionId]
  );

const markHintUsed = (sessionId) =>
  db.query('UPDATE bt_level15_sessions SET hints_used = hints_used + 1 WHERE id = ?', [sessionId]);

const completeSession = (sessionId, seconds) =>
  db.query(
    "UPDATE bt_level15_sessions SET status = 'completed', seconds = ?, completed_at = NOW() WHERE id = ?",
    [seconds, sessionId]
  );

const skipSession = (sessionId, seconds) =>
  db.query(
    "UPDATE bt_level15_sessions SET status = 'skipped', seconds = ?, completed_at = NOW() WHERE id = ?",
    [seconds, sessionId]
  );

/* ---------------------------------------------------------
   PROGRESS  (same tables every level uses)
--------------------------------------------------------- */

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
  CODE_LENGTH,
  ready,
  getPlayer,
  getHints,
  spendHints,
  addHints,
  getSession,
  getActiveSession,
  createSession,
  abandonSession,
  resetVault,
  recordAction,
  markVaultMoved,
  addTap,
  addAttempt,
  markHintUsed,
  completeSession,
  skipSession,
  saveProgress,
  unlockNext,
  getProgress,
};