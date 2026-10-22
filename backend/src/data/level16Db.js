// // Level 16 - "Who didn't take the last slice of pizza?"
// // Correct answer inga mattum irukku. Frontend ku ANSWER anuppave koodathu.

// const ANSWER = 'B';

// const LEVEL16 = {
//   level: 16,
//   title: 'LEVEL 16',
//   subtitle: 'Only one person is lying…',
//   question: "Who didn't take the last slice of pizza?",
//   options: ['A', 'B', 'C', 'D'],
//   statements: [
//     { id: 'A', text: "I didn't take it!" },
//     { id: 'B', text: 'I was watching TV the whole time.' },
//     { id: 'C', text: "I didn't take it!" },
//     { id: 'D', text: "I didn't take it either!" },
//   ],
// };

// const HINTS = [
//   'Look carefully at the clues!',
//   'Check the whole room. Is there a TV anywhere?',
//   "Somebody's alibi doesn't match the room. Look at B.",
// ];

// const EXPLANATION =
//   "B is the liar. He says he was watching TV the whole time, but there is no TV in the room! " +
//   'Also, there are crumbs on his plate, so his alibi is suspicious.';

// module.exports = { ANSWER, LEVEL16, HINTS, EXPLANATION };
const db = require('../db');

const LEVEL = 16;

/* ---------------------------------------------------------
   LEVEL 16 - "Only one person is lying... Who didn't take the last slice of pizza?"
   The correct answer lives ONLY here (backend). It is never sent to the frontend
   before the player answers correctly.
--------------------------------------------------------- */

const ANSWER = 'B';

const LEVEL_DATA = {
  level: LEVEL,
  title: 'LEVEL 16',
  subtitle: 'Only one person is lying…',
  question: "Who didn't take the last slice of pizza?",
  options: ['A', 'B', 'C', 'D'],
  statements: [
    { id: 'A', text: "I didn't take it!" },
    { id: 'B', text: 'I was watching TV the whole time.' },
    { id: 'C', text: "I didn't take it!" },
    { id: 'D', text: "I didn't take it either!" },
  ],
};

// one hint per use, in this order
const HINTS = [
  'Look carefully at the clues!',
  'Check the whole room. Is there a TV anywhere?',
  "Somebody's alibi doesn't match the room. Look at B.",
];

const EXPLANATION =
  'B is the liar. He says he was watching TV the whole time, but there is no TV in the room! ' +
  'Also, there are crumbs on his plate, so his alibi is suspicious.';

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

/* ---------------------------------------------------------
   TABLES  (created once when the server starts)
   bt_level16_sessions : one row per game
   bt_level16_actions  : every answer / hint / skip the player did
--------------------------------------------------------- */

const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level16_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      total_attempts INT NOT NULL DEFAULT 0,
      wrong_attempts INT NOT NULL DEFAULT 0,
      hints_used INT NOT NULL DEFAULT 0,
      seconds INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l16_player (player_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level16_actions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      action VARCHAR(20) NOT NULL,
      value VARCHAR(30) NOT NULL DEFAULT '',
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l16_session (session_id)
    )
  `);

  console.log('[BrainTwist L16] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L16] could not create tables:', err.message)
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
                        FROM bt_level16_sessions s`;

const getSession = (sessionId, playerId) =>
  one(`${SELECT_SESSION} WHERE s.id = ? AND s.player_id = ?`, [sessionId, playerId]);

const getActiveSession = (playerId) =>
  one(
    `${SELECT_SESSION} WHERE s.player_id = ? AND s.status = 'in_progress' ORDER BY s.id DESC LIMIT 1`,
    [playerId]
  );

const createSession = async (playerId) => {
  const [r] = await db.query('INSERT INTO bt_level16_sessions (player_id) VALUES (?)', [playerId]);
  return one(`${SELECT_SESSION} WHERE s.id = ?`, [r.insertId]);
};

/* ---------------------------------------------------------
   ACTIONS
--------------------------------------------------------- */

const recordAction = (sessionId, action, value = '', correct = false) =>
  db.query(
    'INSERT INTO bt_level16_actions (session_id, action, value, is_correct) VALUES (?, ?, ?, ?)',
    [sessionId, action, String(value).slice(0, 30), correct ? 1 : 0]
  );

const addAttempt = (sessionId, wrong) =>
  db.query(
    `UPDATE bt_level16_sessions
     SET total_attempts = total_attempts + 1,
         wrong_attempts = wrong_attempts + ?
     WHERE id = ?`,
    [wrong ? 1 : 0, sessionId]
  );

const markHintUsed = (sessionId) =>
  db.query('UPDATE bt_level16_sessions SET hints_used = hints_used + 1 WHERE id = ?', [sessionId]);

const completeSession = (sessionId, seconds) =>
  db.query(
    "UPDATE bt_level16_sessions SET status = 'completed', seconds = ?, completed_at = NOW() WHERE id = ?",
    [seconds, sessionId]
  );

const skipSession = (sessionId, seconds) =>
  db.query(
    "UPDATE bt_level16_sessions SET status = 'skipped', seconds = ?, completed_at = NOW() WHERE id = ?",
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
  ANSWER,
  LEVEL_DATA,
  HINTS,
  EXPLANATION,
  ready,
  getPlayer,
  getHints,
  spendHints,
  addHints,
  getSession,
  getActiveSession,
  createSession,
  recordAction,
  addAttempt,
  markHintUsed,
  completeSession,
  skipSession,
  saveProgress,
  unlockNext,
  getProgress,
};