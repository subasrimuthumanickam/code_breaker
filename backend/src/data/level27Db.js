// // // data/level27Db.js
// // // Level 27 - "What number is missing?"   1 3 5 / 2 4 ?   (answer 6)
// // // SQL layer (MySQL / MariaDB, mysql2/promise style).
// // //
// // // !! Change the next line so it points to YOUR existing database connection
// // //    (the same pool that level25Db.js / level26 use). It must expose
// // //    pool.query(sql, params) -> [rows]  (mysql2/promise).
// // const raw = require('../db');
// // const pool = raw.pool || raw;

// // const LEVEL = 27;
// // const START_HINTS = 2200; // balance given to a brand-new player (testing)

// // const q = async (sql, params = []) => {
// //   const [r] = await pool.query(sql, params);
// //   return r;
// // };

// // // ---------------------------------------------------------------------------
// // // Tables + seed (runs once, safe to run many times)
// // // ---------------------------------------------------------------------------
// // let initPromise = null;

// // function init() {
// //   if (initPromise) return initPromise;
// //   initPromise = (async () => {
// //     await q(`CREATE TABLE IF NOT EXISTS braintwist_level27_config (
// //       level        INT PRIMARY KEY,
// //       title        VARCHAR(255) NOT NULL,
// //       grid_json    TEXT         NOT NULL,
// //       answer       INT          NOT NULL,
// //       clue1        TEXT         NOT NULL,
// //       clue2        TEXT         NOT NULL,
// //       clue3        TEXT         NOT NULL
// //     )`);

// //     await q(`CREATE TABLE IF NOT EXISTS braintwist_level27_sessions (
// //       id           INT AUTO_INCREMENT PRIMARY KEY,
// //       player_id    VARCHAR(64) NOT NULL,
// //       attempts     INT         NOT NULL DEFAULT 0,
// //       hints_used   INT         NOT NULL DEFAULT 0,
// //       status       VARCHAR(12) NOT NULL DEFAULT 'playing',
// //       stars        INT         NOT NULL DEFAULT 0,
// //       score        INT         NOT NULL DEFAULT 0,
// //       started_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
// //       finished_at  TIMESTAMP   NULL DEFAULT NULL,
// //       INDEX idx_l27_player (player_id)
// //     )`);

// //     await q(`CREATE TABLE IF NOT EXISTS braintwist_level27_attempts (
// //       id           INT AUTO_INCREMENT PRIMARY KEY,
// //       session_id   INT         NOT NULL,
// //       player_id    VARCHAR(64) NOT NULL,
// //       answer       VARCHAR(16) NOT NULL,
// //       is_correct   TINYINT(1)  NOT NULL DEFAULT 0,
// //       created_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
// //       INDEX idx_l27_session (session_id)
// //     )`);

// //     // hint balance. If the rest of your game keeps hints in another table,
// //     // replace getHints / spendHints / addHints below with queries on that table.
// //     await q(`CREATE TABLE IF NOT EXISTS braintwist_level27_wallet (
// //       player_id    VARCHAR(64) PRIMARY KEY,
// //       hints        INT         NOT NULL DEFAULT ${START_HINTS}
// //     )`);

// //     const grid = JSON.stringify([[1, 3, 5], [2, 4, null]]);
// //     await q(
// //       `INSERT IGNORE INTO braintwist_level27_config
// //         (level, title, grid_json, answer, clue1, clue2, clue3) VALUES (?,?,?,?,?,?,?)`,
// //       [
// //         LEVEL,
// //         'What number is missing?',
// //         grid,
// //         6,
// //         'Look at each row on its own. What do the numbers in the top row have in common?',
// //         'The top row has odd numbers: 1, 3, 5. The bottom row follows a pattern too.',
// //         'Bottom row: 2, 4, ... Count up by twos.',
// //       ]
// //     );
// //   })().catch((e) => {
// //     initPromise = null; // try again on the next request
// //     throw e;
// //   });
// //   return initPromise;
// // }

// // // ---------------------------------------------------------------------------
// // // Config
// // // ---------------------------------------------------------------------------
// // async function getConfig() {
// //   const rows = await q('SELECT * FROM braintwist_level27_config WHERE level = ?', [LEVEL]);
// //   const r = rows[0];
// //   if (!r) throw new Error('Level 27 config is missing');
// //   return {
// //     title: r.title,
// //     grid: JSON.parse(r.grid_json),
// //     answer: Number(r.answer),
// //     clues: [r.clue1, r.clue2, r.clue3],
// //   };
// // }

// // // ---------------------------------------------------------------------------
// // // Sessions + attempts
// // // ---------------------------------------------------------------------------
// // async function createSession(playerId) {
// //   const r = await q('INSERT INTO braintwist_level27_sessions (player_id) VALUES (?)', [String(playerId)]);
// //   return Number(r.insertId);
// // }

// // async function getSession(sessionId) {
// //   const rows = await q('SELECT * FROM braintwist_level27_sessions WHERE id = ?', [sessionId]);
// //   return rows[0] || null;
// // }

// // // saves one answer and counts the attempt; returns the new attempt number
// // async function recordAttempt(sessionId, playerId, answer, isCorrect) {
// //   await q(
// //     'INSERT INTO braintwist_level27_attempts (session_id, player_id, answer, is_correct) VALUES (?,?,?,?)',
// //     [sessionId, String(playerId), String(answer), isCorrect ? 1 : 0]
// //   );
// //   await q('UPDATE braintwist_level27_sessions SET attempts = attempts + 1 WHERE id = ?', [sessionId]);
// //   const s = await getSession(sessionId);
// //   return Number(s.attempts);
// // }

// // async function addHintUsed(sessionId) {
// //   await q('UPDATE braintwist_level27_sessions SET hints_used = hints_used + 1 WHERE id = ?', [sessionId]);
// //   const s = await getSession(sessionId);
// //   return Number(s.hints_used);
// // }

// // async function markWon(sessionId, stars, score) {
// //   await q(
// //     `UPDATE braintwist_level27_sessions
// //         SET status = 'won', stars = ?, score = ?, finished_at = CURRENT_TIMESTAMP
// //       WHERE id = ? AND status = 'playing'`,
// //     [stars, score, sessionId]
// //   );
// // }

// // async function markSkipped(sessionId) {
// //   await q(
// //     `UPDATE braintwist_level27_sessions
// //         SET status = 'skipped', finished_at = CURRENT_TIMESTAMP
// //       WHERE id = ? AND status = 'playing'`,
// //     [sessionId]
// //   );
// // }

// // // ---------------------------------------------------------------------------
// // // Hint balance
// // // ---------------------------------------------------------------------------
// // async function ensureWallet(playerId) {
// //   await q('INSERT IGNORE INTO braintwist_level27_wallet (player_id, hints) VALUES (?, ?)', [
// //     String(playerId),
// //     START_HINTS,
// //   ]);
// // }

// // async function getHints(playerId) {
// //   await ensureWallet(playerId);
// //   const rows = await q('SELECT hints FROM braintwist_level27_wallet WHERE player_id = ?', [String(playerId)]);
// //   return Number(rows[0].hints);
// // }

// // // takes `cost` hints in one atomic step; returns the new balance or null if not enough
// // async function spendHints(playerId, cost) {
// //   await ensureWallet(playerId);
// //   const r = await q(
// //     'UPDATE braintwist_level27_wallet SET hints = hints - ? WHERE player_id = ? AND hints >= ?',
// //     [cost, String(playerId), cost]
// //   );
// //   if (!r.affectedRows) return null;
// //   return getHints(playerId);
// // }

// // async function addHints(playerId, amount) {
// //   await ensureWallet(playerId);
// //   await q('UPDATE braintwist_level27_wallet SET hints = hints + ? WHERE player_id = ?', [amount, String(playerId)]);
// //   return getHints(playerId);
// // }

// // module.exports = {
// //   LEVEL,
// //   init,
// //   getConfig,
// //   createSession,
// //   getSession,
// //   recordAttempt,
// //   addHintUsed,
// //   markWon,
// //   markSkipped,
// //   getHints,
// //   spendHints,
// //   addHints,
// // };
// const pool = require('../db'); // mysql2/promise pool (same as level 26)

// const LEVEL = 27;

// const q = async (sql, params = []) => {
//   const [r] = await pool.query(sql, params);
//   return r;
// };

// // ---------------------------------------------------------------------------
// // Tables + seed (runs once, safe to run many times)
// // ---------------------------------------------------------------------------
// let initPromise = null;

// function init() {
//   if (initPromise) return initPromise;
//   initPromise = (async () => {
//     await q(`CREATE TABLE IF NOT EXISTS braintwist_level27_config (
//       level        INT PRIMARY KEY,
//       title        VARCHAR(255) NOT NULL,
//       grid_json    TEXT         NOT NULL,
//       answer       INT          NOT NULL,
//       clue1        TEXT         NOT NULL,
//       clue2        TEXT         NOT NULL,
//       clue3        TEXT         NOT NULL
//     )`);

//     await q(`CREATE TABLE IF NOT EXISTS braintwist_level27_sessions (
//       id           INT AUTO_INCREMENT PRIMARY KEY,
//       player_id    VARCHAR(64) NOT NULL,
//       attempts     INT         NOT NULL DEFAULT 0,
//       hints_used   INT         NOT NULL DEFAULT 0,
//       status       VARCHAR(12) NOT NULL DEFAULT 'playing',
//       stars        INT         NOT NULL DEFAULT 0,
//       score        INT         NOT NULL DEFAULT 0,
//       started_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       finished_at  TIMESTAMP   NULL DEFAULT NULL,
//       INDEX idx_l27_player (player_id)
//     )`);

//     await q(`CREATE TABLE IF NOT EXISTS braintwist_level27_attempts (
//       id           INT AUTO_INCREMENT PRIMARY KEY,
//       session_id   INT         NOT NULL,
//       player_id    VARCHAR(64) NOT NULL,
//       answer       VARCHAR(16) NOT NULL,
//       is_correct   TINYINT(1)  NOT NULL DEFAULT 0,
//       created_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       INDEX idx_l27_session (session_id)
//     )`);

//     const grid = JSON.stringify([[1, 3, 5], [2, 4, null]]);
//     await q(
//       `INSERT IGNORE INTO braintwist_level27_config
//         (level, title, grid_json, answer, clue1, clue2, clue3) VALUES (?,?,?,?,?,?,?)`,
//       [
//         LEVEL,
//         'What number is missing?',
//         grid,
//         6,
//         'Look at each row on its own. What do the numbers in the top row have in common?',
//         'The top row has odd numbers: 1, 3, 5. The bottom row follows a pattern too.',
//         'Bottom row: 2, 4, ... Count up by twos.',
//       ]
//     );
//   })().catch((e) => {
//     initPromise = null; // try again on the next request
//     throw e;
//   });
//   return initPromise;
// }

// // ---------------------------------------------------------------------------
// // Config
// // ---------------------------------------------------------------------------
// async function getConfig() {
//   const rows = await q('SELECT * FROM braintwist_level27_config WHERE level = ?', [LEVEL]);
//   const r = rows[0];
//   if (!r) throw new Error('Level 27 config is missing');
//   return {
//     title: r.title,
//     grid: JSON.parse(r.grid_json),
//     answer: Number(r.answer),
//     clues: [r.clue1, r.clue2, r.clue3],
//   };
// }

// // ---------------------------------------------------------------------------
// // Sessions + attempts
// // ---------------------------------------------------------------------------
// async function createSession(playerId) {
//   const r = await q('INSERT INTO braintwist_level27_sessions (player_id) VALUES (?)', [String(playerId)]);
//   return Number(r.insertId);
// }

// async function getSession(sessionId) {
//   const rows = await q('SELECT * FROM braintwist_level27_sessions WHERE id = ?', [sessionId]);
//   return rows[0] || null;
// }

// // saves one answer and counts the attempt; returns the new attempt number
// async function recordAttempt(sessionId, playerId, answer, isCorrect) {
//   await q(
//     'INSERT INTO braintwist_level27_attempts (session_id, player_id, answer, is_correct) VALUES (?,?,?,?)',
//     [sessionId, String(playerId), String(answer), isCorrect ? 1 : 0]
//   );
//   await q('UPDATE braintwist_level27_sessions SET attempts = attempts + 1 WHERE id = ?', [sessionId]);
//   const s = await getSession(sessionId);
//   return Number(s.attempts);
// }

// async function addHintUsed(sessionId) {
//   await q('UPDATE braintwist_level27_sessions SET hints_used = hints_used + 1 WHERE id = ?', [sessionId]);
//   const s = await getSession(sessionId);
//   return Number(s.hints_used);
// }

// async function markWon(sessionId, stars, score) {
//   await q(
//     `UPDATE braintwist_level27_sessions
//         SET status = 'won', stars = ?, score = ?, finished_at = CURRENT_TIMESTAMP
//       WHERE id = ? AND status = 'playing'`,
//     [stars, score, sessionId]
//   );
// }

// async function markSkipped(sessionId) {
//   await q(
//     `UPDATE braintwist_level27_sessions
//         SET status = 'skipped', finished_at = CURRENT_TIMESTAMP
//       WHERE id = ? AND status = 'playing'`,
//     [sessionId]
//   );
// }

// // ---------------------------------------------------------------------------
// // Hint balance  (shared with all other levels: bt_players.hints)
// // ---------------------------------------------------------------------------
// async function getHints(playerId) {
//   const rows = await q('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
//   return rows[0] ? Number(rows[0].hints) || 0 : 0;
// }

// // takes `cost` hints in one atomic step; returns the new balance or null if not enough
// async function spendHints(playerId, cost) {
//   const r = await q(
//     'UPDATE bt_players SET hints = hints - ? WHERE id = ? AND hints >= ?',
//     [cost, playerId, cost]
//   );
//   if (!r.affectedRows) return null;
//   return getHints(playerId);
// }

// async function addHints(playerId, amount) {
//   await q('UPDATE bt_players SET hints = hints + ? WHERE id = ?', [amount, playerId]);
//   return getHints(playerId);
// }

// module.exports = {
//   LEVEL,
//   init,
//   getConfig,
//   createSession,
//   getSession,
//   recordAttempt,
//   addHintUsed,
//   markWon,
//   markSkipped,
//   getHints,
//   spendHints,
//   addHints,
// };
const pool = require('../db'); // mysql2/promise pool (same as level 26)

const LEVEL = 27;
const ANSWER = 'R';   // the correct key

const q = async (sql, params = []) => {
  const [r] = await pool.query(sql, params);
  return r;
};

// ---------------------------------------------------------------------------
// Tables + seed (runs once, safe to run many times)
// ---------------------------------------------------------------------------
let initPromise = null;

function init() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    await q(`CREATE TABLE IF NOT EXISTS braintwist_level27_config (
      level        INT PRIMARY KEY,
      title        VARCHAR(255) NOT NULL,
      grid_json    TEXT         NOT NULL,
      answer       VARCHAR(16)  NOT NULL,
      clue1        TEXT         NOT NULL,
      clue2        TEXT         NOT NULL,
      clue3        TEXT         NOT NULL
    )`);

    // older installs had answer as INT (6): make it text so a letter fits
    await q('ALTER TABLE braintwist_level27_config MODIFY answer VARCHAR(16) NOT NULL');

    await q(`CREATE TABLE IF NOT EXISTS braintwist_level27_sessions (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      player_id    VARCHAR(64) NOT NULL,
      attempts     INT         NOT NULL DEFAULT 0,
      hints_used   INT         NOT NULL DEFAULT 0,
      status       VARCHAR(12) NOT NULL DEFAULT 'playing',
      stars        INT         NOT NULL DEFAULT 0,
      score        INT         NOT NULL DEFAULT 0,
      started_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
      finished_at  TIMESTAMP   NULL DEFAULT NULL,
      INDEX idx_l27_player (player_id)
    )`);

    await q(`CREATE TABLE IF NOT EXISTS braintwist_level27_attempts (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      session_id   INT         NOT NULL,
      player_id    VARCHAR(64) NOT NULL,
      answer       VARCHAR(16) NOT NULL,
      is_correct   TINYINT(1)  NOT NULL DEFAULT 0,
      created_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l27_session (session_id)
    )`);

    const grid = JSON.stringify([[1, 3, 5], [2, 4, null]]);
    await q(
      `INSERT IGNORE INTO braintwist_level27_config
        (level, title, grid_json, answer, clue1, clue2, clue3) VALUES (?,?,?,?,?,?,?)`,
      [
        LEVEL,
        'What number is missing?',
        grid,
        ANSWER,
        'Look at each row on its own. What do the numbers in the top row have in common?',
        'The top row has odd numbers: 1, 3, 5. The bottom row follows a pattern too.',
        'Bottom row: 2, 4, ... Count up by twos.',
      ]
    );

    // make sure an old row (answer 6) now says R
    await q('UPDATE braintwist_level27_config SET answer = ? WHERE level = ?', [ANSWER, LEVEL]);
  })().catch((e) => {
    initPromise = null; // try again on the next request
    throw e;
  });
  return initPromise;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
async function getConfig() {
  const rows = await q('SELECT * FROM braintwist_level27_config WHERE level = ?', [LEVEL]);
  const r = rows[0];
  if (!r) throw new Error('Level 27 config is missing');
  return {
    title: r.title,
    grid: JSON.parse(r.grid_json),
    answer: String(r.answer).trim().toUpperCase(),
    clues: [r.clue1, r.clue2, r.clue3],
  };
}

// ---------------------------------------------------------------------------
// Sessions + attempts
// ---------------------------------------------------------------------------
async function createSession(playerId) {
  const r = await q('INSERT INTO braintwist_level27_sessions (player_id) VALUES (?)', [String(playerId)]);
  return Number(r.insertId);
}

async function getSession(sessionId) {
  const rows = await q('SELECT * FROM braintwist_level27_sessions WHERE id = ?', [sessionId]);
  return rows[0] || null;
}

// saves one answer and counts the attempt; returns the new attempt number
async function recordAttempt(sessionId, playerId, answer, isCorrect) {
  await q(
    'INSERT INTO braintwist_level27_attempts (session_id, player_id, answer, is_correct) VALUES (?,?,?,?)',
    [sessionId, String(playerId), String(answer), isCorrect ? 1 : 0]
  );
  await q('UPDATE braintwist_level27_sessions SET attempts = attempts + 1 WHERE id = ?', [sessionId]);
  const s = await getSession(sessionId);
  return Number(s.attempts);
}

async function addHintUsed(sessionId) {
  await q('UPDATE braintwist_level27_sessions SET hints_used = hints_used + 1 WHERE id = ?', [sessionId]);
  const s = await getSession(sessionId);
  return Number(s.hints_used);
}

async function markWon(sessionId, stars, score) {
  await q(
    `UPDATE braintwist_level27_sessions
        SET status = 'won', stars = ?, score = ?, finished_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'playing'`,
    [stars, score, sessionId]
  );
}

async function markSkipped(sessionId) {
  await q(
    `UPDATE braintwist_level27_sessions
        SET status = 'skipped', finished_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'playing'`,
    [sessionId]
  );
}

// ---------------------------------------------------------------------------
// Hint balance  (shared with all other levels: bt_players.hints)
// ---------------------------------------------------------------------------
async function getHints(playerId) {
  const rows = await q('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
  return rows[0] ? Number(rows[0].hints) || 0 : 0;
}

// takes `cost` hints in one atomic step; returns the new balance or null if not enough
async function spendHints(playerId, cost) {
  const r = await q(
    'UPDATE bt_players SET hints = hints - ? WHERE id = ? AND hints >= ?',
    [cost, playerId, cost]
  );
  if (!r.affectedRows) return null;
  return getHints(playerId);
}

async function addHints(playerId, amount) {
  await q('UPDATE bt_players SET hints = hints + ? WHERE id = ?', [amount, playerId]);
  return getHints(playerId);
}

module.exports = {
  LEVEL,
  init,
  getConfig,
  createSession,
  getSession,
  recordAttempt,
  addHintUsed,
  markWon,
  markSkipped,
  getHints,
  spendHints,
  addHints,
};