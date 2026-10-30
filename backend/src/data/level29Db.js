// // data/level29Db.js  - Level 29 (car parking spot number) SQL storage
// const mysql = require("mysql2/promise");

// // !! Unga data/level28Db.js la ulla pool/connection ADHE inga use pannunga.
// // Adhu pool export panna, mela ulla createPool ah delete panni: const pool = require("./level28Db").pool
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_NAME || "codebreaker",
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// // !! Unga hints (bulb) balance irukkura table / column. Level 28 db la paathu maathunga.
// const PLAYERS_TABLE = process.env.BT_PLAYERS_TABLE || "players";
// const PLAYERS_ID_COL = process.env.BT_PLAYERS_ID_COL || "id";
// const PLAYERS_HINTS_COL = process.env.BT_PLAYERS_HINTS_COL || "hints";

// const HINT_COST = 25;
// const SKIP_COST = 50;
// const VIDEO_REWARD = 75;

// const PUZZLE = {
//   question: "What's the car's parking spot number?",
//   spots: ["16", "06", "68", "88", "?", "98"], // "?" = car
//   answer: "87",
//   hint: "Turn your screen upside down and read the numbers again!",
// };

// async function init() {
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS bt_level29_puzzle (
//       id INT PRIMARY KEY,
//       question VARCHAR(255) NOT NULL,
//       spots VARCHAR(100) NOT NULL,
//       answer VARCHAR(10) NOT NULL,
//       hint_text VARCHAR(255) NOT NULL
//     )`);
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS bt_level29_progress (
//       player_id VARCHAR(64) PRIMARY KEY,
//       attempts INT NOT NULL DEFAULT 0,
//       solved TINYINT(1) NOT NULL DEFAULT 0,
//       skipped TINYINT(1) NOT NULL DEFAULT 0,
//       hint_used TINYINT(1) NOT NULL DEFAULT 0,
//       last_answer VARCHAR(10) NULL,
//       solved_at DATETIME NULL,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//     )`);
//   await pool.query(
//     `INSERT INTO bt_level29_puzzle (id, question, spots, answer, hint_text)
//      VALUES (1, ?, ?, ?, ?)
//      ON DUPLICATE KEY UPDATE question=VALUES(question), spots=VALUES(spots),
//        answer=VALUES(answer), hint_text=VALUES(hint_text)`,
//     [PUZZLE.question, PUZZLE.spots.join(","), PUZZLE.answer, PUZZLE.hint]
//   );
// }
// const ready = init().catch((e) => console.error("[level29Db] init failed:", e.message));

// async function getPuzzle() {
//   await ready;
//   const [rows] = await pool.query("SELECT * FROM bt_level29_puzzle WHERE id = 1");
//   const p = rows[0];
//   return { question: p.question, spots: p.spots.split(","), answer: p.answer, hint: p.hint_text };
// }

// async function ensureProgress(playerId) {
//   await ready;
//   await pool.query("INSERT IGNORE INTO bt_level29_progress (player_id) VALUES (?)", [String(playerId)]);
//   const [rows] = await pool.query("SELECT * FROM bt_level29_progress WHERE player_id = ?", [String(playerId)]);
//   return rows[0];
// }

// async function saveAnswer(playerId, answer, correct) {
//   await ensureProgress(playerId);
//   if (correct) {
//     await pool.query(
//       `UPDATE bt_level29_progress SET attempts = attempts + 1, solved = 1,
//        last_answer = ?, solved_at = NOW() WHERE player_id = ?`,
//       [answer, String(playerId)]
//     );
//   } else {
//     await pool.query(
//       "UPDATE bt_level29_progress SET attempts = attempts + 1, last_answer = ? WHERE player_id = ?",
//       [answer, String(playerId)]
//     );
//   }
//   const [rows] = await pool.query("SELECT attempts FROM bt_level29_progress WHERE player_id = ?", [String(playerId)]);
//   return rows[0].attempts;
// }

// async function markHint(playerId) {
//   await ensureProgress(playerId);
//   await pool.query("UPDATE bt_level29_progress SET hint_used = 1 WHERE player_id = ?", [String(playerId)]);
// }

// async function markSkip(playerId) {
//   await ensureProgress(playerId);
//   await pool.query("UPDATE bt_level29_progress SET skipped = 1 WHERE player_id = ?", [String(playerId)]);
// }

// // ---- hints (bulb) balance ----
// async function getHints(playerId) {
//   const [rows] = await pool.query(
//     `SELECT ${PLAYERS_HINTS_COL} AS hints FROM ${PLAYERS_TABLE} WHERE ${PLAYERS_ID_COL} = ?`,
//     [playerId]
//   );
//   return rows[0] ? Number(rows[0].hints) : null;
// }

// async function addHints(playerId, delta) {
//   await pool.query(
//     `UPDATE ${PLAYERS_TABLE} SET ${PLAYERS_HINTS_COL} = ${PLAYERS_HINTS_COL} + ? WHERE ${PLAYERS_ID_COL} = ?`,
//     [delta, playerId]
//   );
//   return getHints(playerId);
// }

// module.exports = {
//   pool, HINT_COST, SKIP_COST, VIDEO_REWARD,
//   getPuzzle, ensureProgress, saveAnswer, markHint, markSkip, getHints, addHints,
// };
// data/level29Db.js - Level 29 (car parking spot number, answer 87) SQL storage
const pool = require('../db'); // mysql2/promise pool (same as level 26 / 27 / 28)

const LEVEL = 29;
const HINT_COST = 25;
const SKIP_COST = 50;
const VIDEO_REWARD = 75;

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
    // one row per level: question, spots ("?" = car), answer, clue
    await q(`CREATE TABLE IF NOT EXISTS braintwist_level29_config (
      level      INT PRIMARY KEY,
      question   VARCHAR(255) NOT NULL,
      spots      VARCHAR(100) NOT NULL,
      answer     VARCHAR(10)  NOT NULL,
      clue       TEXT         NOT NULL
    )`);

    // one row per player
    await q(`CREATE TABLE IF NOT EXISTS braintwist_level29_progress (
      player_id    VARCHAR(64) PRIMARY KEY,
      attempts     INT         NOT NULL DEFAULT 0,
      solved       TINYINT(1)  NOT NULL DEFAULT 0,
      skipped      TINYINT(1)  NOT NULL DEFAULT 0,
      hint_used    TINYINT(1)  NOT NULL DEFAULT 0,
      last_answer  VARCHAR(10) NULL,
      solved_at    TIMESTAMP   NULL DEFAULT NULL,
      updated_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    // every number the player typed
    await q(`CREATE TABLE IF NOT EXISTS braintwist_level29_attempts (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      player_id   VARCHAR(64) NOT NULL,
      answer      VARCHAR(10) NOT NULL,
      is_correct  TINYINT(1)  NOT NULL DEFAULT 0,
      created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l29_player (player_id)
    )`);

    await q(
      `INSERT IGNORE INTO braintwist_level29_config (level, question, spots, answer, clue)
       VALUES (?,?,?,?,?)`,
      [
        LEVEL,
        "What's the car's parking spot number?",
        '16,06,68,88,?,98',
        '87',
        'Turn your screen upside down and read the numbers again!',
      ]
    );
  })().catch((e) => {
    initPromise = null; // try again on the next request
    throw e;
  });
  return initPromise;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
async function getPuzzle() {
  await init();
  const rows = await q('SELECT * FROM braintwist_level29_config WHERE level = ?', [LEVEL]);
  const r = rows[0];
  if (!r) throw new Error('Level 29 config is missing');
  return {
    question: r.question,
    spots: String(r.spots).split(','),
    answer: String(r.answer).trim(),
    hint: r.clue,
  };
}

// ---------------------------------------------------------------------------
// Progress + attempts
// ---------------------------------------------------------------------------
async function ensureProgress(playerId) {
  await init();
  await q('INSERT IGNORE INTO braintwist_level29_progress (player_id) VALUES (?)', [String(playerId)]);
  const rows = await q('SELECT * FROM braintwist_level29_progress WHERE player_id = ?', [String(playerId)]);
  return rows[0];
}

// saves one answer; returns the new attempt number
async function saveAnswer(playerId, answer, correct) {
  await ensureProgress(playerId);
  await q(
    'INSERT INTO braintwist_level29_attempts (player_id, answer, is_correct) VALUES (?,?,?)',
    [String(playerId), String(answer), correct ? 1 : 0]
  );
  if (correct) {
    await q(
      `UPDATE braintwist_level29_progress
          SET attempts = attempts + 1, solved = 1, last_answer = ?, solved_at = CURRENT_TIMESTAMP
        WHERE player_id = ?`,
      [String(answer), String(playerId)]
    );
  } else {
    await q(
      'UPDATE braintwist_level29_progress SET attempts = attempts + 1, last_answer = ? WHERE player_id = ?',
      [String(answer), String(playerId)]
    );
  }
  const p = await ensureProgress(playerId);
  return Number(p.attempts);
}

async function markHint(playerId) {
  await ensureProgress(playerId);
  await q('UPDATE braintwist_level29_progress SET hint_used = 1 WHERE player_id = ?', [String(playerId)]);
}

async function markSkip(playerId) {
  await ensureProgress(playerId);
  await q('UPDATE braintwist_level29_progress SET skipped = 1 WHERE player_id = ?', [String(playerId)]);
}

// ---------------------------------------------------------------------------
// Hint balance (shared with all other levels: bt_players.hints)
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
  HINT_COST,
  SKIP_COST,
  VIDEO_REWARD,
  init,
  getPuzzle,
  ensureProgress,
  saveAnswer,
  markHint,
  markSkip,
  getHints,
  spendHints,
  addHints,
};