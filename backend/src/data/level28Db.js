const pool = require('../db'); // mysql2/promise pool (same as level 26 / 27)

const LEVEL = 28;

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
    // one row per level: the question, the word, other accepted words, 3 clues
    await q(`CREATE TABLE IF NOT EXISTS braintwist_level28_config (
      level        INT PRIMARY KEY,
      title        VARCHAR(255) NOT NULL,
      answer       VARCHAR(32)  NOT NULL,
      alt_answers  VARCHAR(255) NOT NULL DEFAULT '',
      clue1        TEXT         NOT NULL,
      clue2        TEXT         NOT NULL,
      clue3        TEXT         NOT NULL
    )`);

    // one row each time the player opens the level
    await q(`CREATE TABLE IF NOT EXISTS braintwist_level28_sessions (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      player_id    VARCHAR(64) NOT NULL,
      attempts     INT         NOT NULL DEFAULT 0,
      hints_used   INT         NOT NULL DEFAULT 0,
      status       VARCHAR(12) NOT NULL DEFAULT 'playing',
      stars        INT         NOT NULL DEFAULT 0,
      score        INT         NOT NULL DEFAULT 0,
      started_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
      finished_at  TIMESTAMP   NULL DEFAULT NULL,
      INDEX idx_l28_player (player_id)
    )`);

    // every word the player typed
    await q(`CREATE TABLE IF NOT EXISTS braintwist_level28_attempts (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      session_id   INT         NOT NULL,
      player_id    VARCHAR(64) NOT NULL,
      answer       VARCHAR(32) NOT NULL,
      is_correct   TINYINT(1)  NOT NULL DEFAULT 0,
      created_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l28_session (session_id)
    )`);

    await q(
      `INSERT IGNORE INTO braintwist_level28_config
        (level, title, answer, alt_answers, clue1, clue2, clue3) VALUES (?,?,?,?,?,?,?)`,
      [
        LEVEL,
        'Can you guess this word?',
        'CRACK',
        'CRACKED',
        'Think about what has just happened to this egg.',
        'It is a 5-letter word. It names the lines that run across the broken shell.',
        'It starts with C and ends with K. It is also the sound a shell makes when it breaks.',
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
async function getConfig() {
  const rows = await q('SELECT * FROM braintwist_level28_config WHERE level = ?', [LEVEL]);
  const r = rows[0];
  if (!r) throw new Error('Level 28 config is missing');

  const answer = String(r.answer).trim().toUpperCase();
  const accepted = [answer].concat(
    String(r.alt_answers || '')
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean)
  );

  return {
    title: r.title,
    answer,
    accepted,
    length: answer.length,
    clues: [r.clue1, r.clue2, r.clue3],
  };
}

// ---------------------------------------------------------------------------
// Sessions + attempts
// ---------------------------------------------------------------------------
async function createSession(playerId) {
  const r = await q('INSERT INTO braintwist_level28_sessions (player_id) VALUES (?)', [String(playerId)]);
  return Number(r.insertId);
}

async function getSession(sessionId) {
  const rows = await q('SELECT * FROM braintwist_level28_sessions WHERE id = ?', [sessionId]);
  return rows[0] || null;
}

// saves one answer and counts the attempt; returns the new attempt number
async function recordAttempt(sessionId, playerId, answer, isCorrect) {
  await q(
    'INSERT INTO braintwist_level28_attempts (session_id, player_id, answer, is_correct) VALUES (?,?,?,?)',
    [sessionId, String(playerId), String(answer), isCorrect ? 1 : 0]
  );
  await q('UPDATE braintwist_level28_sessions SET attempts = attempts + 1 WHERE id = ?', [sessionId]);
  const s = await getSession(sessionId);
  return Number(s.attempts);
}

async function addHintUsed(sessionId) {
  await q('UPDATE braintwist_level28_sessions SET hints_used = hints_used + 1 WHERE id = ?', [sessionId]);
  const s = await getSession(sessionId);
  return Number(s.hints_used);
}

async function markWon(sessionId, stars, score) {
  await q(
    `UPDATE braintwist_level28_sessions
        SET status = 'won', stars = ?, score = ?, finished_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'playing'`,
    [stars, score, sessionId]
  );
}

async function markSkipped(sessionId) {
  await q(
    `UPDATE braintwist_level28_sessions
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