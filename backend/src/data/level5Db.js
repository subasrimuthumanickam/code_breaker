// Level 5 (Cucumber vs Zucchini) - all MySQL code lives here.
// The route file (routes/Braintwistlevel5routes.js) only calls these functions.
const db = require('../db');

const LEVEL = 5;

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

/* ---------------- tables ---------------- */

const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level5_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      stage TINYINT NOT NULL DEFAULT 1,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      layout LONGTEXT NOT NULL,
      wrong_attempts INT NOT NULL DEFAULT 0,
      total_attempts INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l5_player (player_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level5_picks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      stage TINYINT NOT NULL,
      item_id INT NOT NULL,
      kind VARCHAR(20) NOT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      reshuffled TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l5_session (session_id)
    )
  `);

  console.log('[BrainTwist L5] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L5] could not create tables:', err.message)
);

/* ---------------- sessions ---------------- */

const parse = (row) => {
  if (!row) return null;
  let layout = row.layout;
  try { layout = JSON.parse(layout); } catch { layout = []; }
  return { ...row, layout };
};

const findActive = async (playerId) =>
  parse(await one(
    `SELECT * FROM bt_level5_sessions
     WHERE player_id = ? AND status = 'in_progress'
     ORDER BY id DESC LIMIT 1`,
    [playerId]
  ));

const getSession = async (sessionId, playerId) =>
  parse(await one(
    'SELECT * FROM bt_level5_sessions WHERE id = ? AND player_id = ?',
    [sessionId, playerId]
  ));

const createSession = async (playerId, layout) => {
  const [r] = await db.query(
    'INSERT INTO bt_level5_sessions (player_id, stage, layout) VALUES (?, 1, ?)',
    [playerId, JSON.stringify(layout)]
  );
  return parse(await one('SELECT * FROM bt_level5_sessions WHERE id = ?', [r.insertId]));
};

const saveLayout = (sessionId, layout, stage) =>
  db.query(
    'UPDATE bt_level5_sessions SET layout = ?, stage = ? WHERE id = ?',
    [JSON.stringify(layout), stage, sessionId]
  );

const recordPick = async (sessionId, stage, itemId, kind, correct, reshuffled) => {
  await db.query(
    `INSERT INTO bt_level5_picks (session_id, stage, item_id, kind, is_correct, reshuffled)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [sessionId, stage, itemId, kind, correct ? 1 : 0, reshuffled ? 1 : 0]
  );
  await db.query(
    `UPDATE bt_level5_sessions
     SET total_attempts = total_attempts + 1,
         wrong_attempts = wrong_attempts + ?
     WHERE id = ?`,
    [correct ? 0 : 1, sessionId]
  );
};

const completeSession = (sessionId) =>
  db.query(
    `UPDATE bt_level5_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?`,
    [sessionId]
  );

/* ---------------- progress / hints ---------------- */

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

const getProgress = (playerId) =>
  one(
    `SELECT is_completed, score, stars, attempts, completed_at
     FROM brain_twist_progress WHERE player_id = ? AND level_number = ?`,
    [playerId, LEVEL]
  );

// takes `amount` hints from the player; false when there are not enough
const spendHints = async (playerId, amount) => {
  const [r] = await db.query(
    'UPDATE bt_players SET hints = hints - ? WHERE id = ? AND hints >= ?',
    [amount, playerId, amount]
  );
  if (!r.affectedRows) return null;
  const p = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
  return Number(p && p.hints) || 0;
};

module.exports = {
  LEVEL, ready, findActive, getSession, createSession, saveLayout,
  recordPick, completeSession, saveProgress, getProgress, spendHints,
};
