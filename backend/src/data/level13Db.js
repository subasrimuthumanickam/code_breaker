// Level 13 - "Burn everything!"  (database layer)
// ADAPT: line below must point to YOUR mysql2/promise pool (same one the other level files use).
const db = require('../db');

async function ensureTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level13_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      status ENUM('in_progress','completed') NOT NULL DEFAULT 'in_progress',
      burned VARCHAR(255) NOT NULL DEFAULT '',
      cat_escaped TINYINT(1) NOT NULL DEFAULT 0,
      wrong_attempts INT NOT NULL DEFAULT 0,
      total_attempts INT NOT NULL DEFAULT 0,
      hints_used INT NOT NULL DEFAULT 0,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l13s_player (player_id)
    ) ENGINE=InnoDB`);
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level13_actions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      player_id INT NOT NULL,
      item VARCHAR(30) NOT NULL,
      correct TINYINT(1) NOT NULL,
      newly_burned VARCHAR(255) NOT NULL DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l13a_session (session_id)
    ) ENGINE=InnoDB`);
}

const csv = (s) => (s ? String(s).split(',').filter(Boolean) : []);

async function findOpenSession(playerId) {
  const [rows] = await db.query(
    "SELECT * FROM bt_level13_sessions WHERE player_id = ? AND status = 'in_progress' ORDER BY id DESC LIMIT 1",
    [playerId]
  );
  return rows[0] || null;
}

async function createSession(playerId) {
  const [r] = await db.query('INSERT INTO bt_level13_sessions (player_id) VALUES (?)', [playerId]);
  const [rows] = await db.query('SELECT * FROM bt_level13_sessions WHERE id = ?', [r.insertId]);
  return rows[0];
}

async function getSession(sessionId) {
  const [rows] = await db.query('SELECT * FROM bt_level13_sessions WHERE id = ?', [sessionId]);
  return rows[0] || null;
}

async function saveBurn(s, { item, correct, newly, burned, catEscaped, completed }) {
  await db.query(
    `UPDATE bt_level13_sessions
        SET burned = ?, cat_escaped = ?, total_attempts = total_attempts + 1,
            wrong_attempts = wrong_attempts + ?, status = ?, completed_at = ?
      WHERE id = ?`,
    [
      burned.join(','),
      catEscaped ? 1 : 0,
      correct ? 0 : 1,
      completed ? 'completed' : 'in_progress',
      completed ? new Date() : null,
      s.id,
    ]
  );
  await db.query(
    'INSERT INTO bt_level13_actions (session_id, player_id, item, correct, newly_burned) VALUES (?,?,?,?,?)',
    [s.id, s.player_id, item, correct ? 1 : 0, newly.join(',')]
  );
  return getSession(s.id);
}

async function addHintUsed(sessionId) {
  await db.query('UPDATE bt_level13_sessions SET hints_used = hints_used + 1 WHERE id = ?', [sessionId]);
}

// ADAPT: assumes the guest player table is bt_players with a "hints" column.
async function spendHints(playerId, cost) {
  const [r] = await db.query('UPDATE bt_players SET hints = hints - ? WHERE id = ? AND hints >= ?', [cost, playerId, cost]);
  if (!r.affectedRows) return null;
  const [rows] = await db.query('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
  return rows[0] ? Number(rows[0].hints) : null;
}

module.exports = { ensureTables, csv, findOpenSession, createSession, getSession, saveBurn, addHintUsed, spendHints };