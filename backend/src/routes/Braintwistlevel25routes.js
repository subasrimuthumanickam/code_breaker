
const express = require('express');
const db = require('../db');
const L25 = require('../data/level25Db'); // title, hint (clue), answer, messages

const r = express.Router();

const LEVEL = 25;

// keep in sync with the frontend (Btlevel25screen.tsx)
const SKIP_COST = 50;

/* ---------- PUZZLE (all text comes from data/level25Db.js) ---------- */

const TITLE = L25.title;
const CLUE = L25.clue; // "Move the house door closer to the police van."

const ANSWER_ITEM = L25.answerItem;
const ANSWER_TARGET = L25.answerTarget;

const RIGHT_MSG = L25.rightMsg;
const WRONG_MSGS = L25.wrongMsgs;
const WRONG_RIGHT_DOOR = L25.wrongRightDoor;

/* ---------- HELPERS ---------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L25 Error]', req.method, req.originalUrl, err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'server_error', message: err.message });
    }
  }
};

const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

const toId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const bad = (res, status, error, message) =>
  res.status(status).json({ success: false, error, message });

/* ---------- HINT BALANCE (bt_players.hints) ---------- */

const spendHints = async (playerId, cost) => {
  const [result] = await db.query(
    `UPDATE bt_players
     SET hints = COALESCE(hints, 0) - ?
     WHERE id = ? AND COALESCE(hints, 0) >= ?`,
    [cost, playerId, cost]
  );

  if (!result.affectedRows) return null;

  const p = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
  return Number(p?.hints) || 0;
};

const getHints = async (playerId) => {
  const p = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);
  return Number(p?.hints) || 0;
};

/* ---------- TABLES (auto create) ---------- */

const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level25_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      wrong_attempts INT NOT NULL DEFAULT 0,
      total_attempts INT NOT NULL DEFAULT 0,
      hints_used INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l25_player (player_id)
    )
  `);

  // older installs: add the hints_used column if the table already existed
  try {
    await db.query('ALTER TABLE bt_level25_sessions ADD COLUMN hints_used INT NOT NULL DEFAULT 0');
  } catch (err) {
    // column already exists -> fine
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level25_actions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      item VARCHAR(30) NOT NULL,
      target VARCHAR(30) NOT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l25_session (session_id)
    )
  `);

  // every time the player presses the magnifier, one row is saved here
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level25_hints (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      player_id INT NOT NULL,
      hint_no INT NOT NULL,
      hint_text VARCHAR(500) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l25h_session (session_id),
      INDEX idx_l25h_player (player_id)
    )
  `);

  console.log('[BrainTwist L25] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L25] could not create tables:', err.message)
);

r.use(async (req, res, next) => {
  await ready;
  next();
});

/* ---------- SAVE RESULT + UNLOCK NEXT LEVEL ---------- */

const saveProgress = async (playerId, score, stars, attempts) => {
  const found = await one(
    `SELECT id FROM brain_twist_progress WHERE player_id = ? AND level_number = ?`,
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

const unlockNext = async (playerId) => {
  await db.query(
    `INSERT INTO bt_progress (player_id, level_n, attempts, solved_at)
     VALUES (?, ?, 0, NOW())
     ON DUPLICATE KEY UPDATE solved_at = NOW()`,
    [playerId, LEVEL]
  );

  await db.query(
    `UPDATE bt_players
     SET current_level = GREATEST(COALESCE(current_level, 1), ?)
     WHERE id = ?`,
    [LEVEL + 1, playerId]
  );
};

/* ---------------------------------------------------------
   POST /level25/start     body: { playerId }
   -> JSON { sessionId, title, hints }   (the hint text is NOT sent here;
      the frontend asks for it with POST /level25/hint)
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  let session = await one(
    `SELECT * FROM bt_level25_sessions
     WHERE player_id = ? AND status = 'in_progress'
     ORDER BY id DESC LIMIT 1`,
    [playerId]
  );

  if (!session) {
    const [inserted] = await db.query(
      'INSERT INTO bt_level25_sessions (player_id) VALUES (?)',
      [playerId]
    );
    session = await one('SELECT * FROM bt_level25_sessions WHERE id = ?', [inserted.insertId]);
  }

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    title: TITLE,
    hints: await getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /level25/hint      body: { sessionId, playerId }
   frontend request -> backend checks the session -> saves the hint
   request in the database -> sends the hint back as JSON
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);

  if (!sessionId || !playerId) {
    return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
  }

  const session = await one(
    'SELECT * FROM bt_level25_sessions WHERE id = ? AND player_id = ?',
    [sessionId, playerId]
  );

  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') {
    return bad(res, 409, 'already_completed', 'This level is already completed');
  }

  // 1) save the hint request
  const hintNo = Number(session.hints_used) + 1;

  await db.query(
    'INSERT INTO bt_level25_hints (session_id, player_id, hint_no, hint_text) VALUES (?, ?, ?, ?)',
    [sessionId, playerId, hintNo, CLUE]
  );

  await db.query(
    'UPDATE bt_level25_sessions SET hints_used = hints_used + 1 WHERE id = ?',
    [sessionId]
  );

  // 2) JSON back to the frontend (the magnifier is free)
  res.json({
    success: true,
    level: LEVEL,
    hintNo,
    free: true,
    cost: 0,
    text: CLUE,
    message: CLUE,
  });
}));

/* ---------------------------------------------------------
   POST /level25/action    body: { sessionId, playerId, item, target }
--------------------------------------------------------- */

r.post('/action', handle(async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);
  const item = String(req.body?.item || '').toLowerCase().replace(/[^a-z_]/g, '').slice(0, 30);
  const target = String(req.body?.target || '').toLowerCase().replace(/[^a-z_]/g, '').slice(0, 30);

  if (!sessionId || !playerId) {
    return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
  }
  if (!item || !target) {
    return bad(res, 400, 'action_required', 'item and target are required');
  }

  const session = await one(
    'SELECT * FROM bt_level25_sessions WHERE id = ? AND player_id = ?',
    [sessionId, playerId]
  );

  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') {
    return bad(res, 409, 'already_completed', 'This level is already completed');
  }

  const wrongBefore = Number(session.wrong_attempts);
  const attemptsBefore = Number(session.total_attempts);
  const correct = item === ANSWER_ITEM && target === ANSWER_TARGET;

  // 1) save what the player did
  await db.query(
    'INSERT INTO bt_level25_actions (session_id, item, target, is_correct) VALUES (?, ?, ?, ?)',
    [sessionId, item, target, correct ? 1 : 0]
  );

  await db.query(
    'UPDATE bt_level25_sessions SET total_attempts = total_attempts + 1 WHERE id = ?',
    [sessionId]
  );

  // 2) wrong move -> JSON back to the frontend
  if (!correct) {
    await db.query(
      'UPDATE bt_level25_sessions SET wrong_attempts = wrong_attempts + 1 WHERE id = ?',
      [sessionId]
    );

    const message =
      target === 'door_right'
        ? WRONG_RIGHT_DOOR
        : WRONG_MSGS[Math.min(wrongBefore, WRONG_MSGS.length - 1)];

    return res.json({
      success: true,
      correct: false,
      completed: false,
      wrongAttempts: wrongBefore + 1,
      message,
    });
  }

  // 3) right move -> score, stars, save, unlock next level
  const attempts = attemptsBefore + 1;
  const score = Math.max(100, 300 - wrongBefore * 50);
  const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

  await db.query(
    `UPDATE bt_level25_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?`,
    [sessionId]
  );

  let progressSaved = false;
  try {
    await saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L25] could not save progress:', err.message);
  }

  try {
    await unlockNext(playerId);
  } catch (err) {
    console.error('[BrainTwist L25] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    message: RIGHT_MSG,
    score,
    stars,
    attempts,
    progressSaved,
  });
}));

/* ---------------------------------------------------------
   POST /level25/skip      body: { sessionId, playerId }
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);

  if (!sessionId || !playerId) {
    return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
  }

  const session = await one(
    'SELECT * FROM bt_level25_sessions WHERE id = ? AND player_id = ?',
    [sessionId, playerId]
  );

  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') {
    return bad(res, 409, 'already_completed', 'This level is already completed');
  }

  const newBalance = await spendHints(playerId, SKIP_COST);
  if (newBalance === null) {
    return bad(res, 402, 'not_enough_hints', `Need ${SKIP_COST} hints. You have ${await getHints(playerId)}.`);
  }

  const attempts = Math.max(1, Number(session.total_attempts) || 0);

  await db.query(
    `UPDATE bt_level25_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?`,
    [sessionId]
  );

  await db.query(
    `INSERT INTO bt_level25_actions (session_id, item, target, is_correct)
     VALUES (?, 'skip', 'level', 0)`,
    [sessionId]
  );

  let progressSaved = false;
  try {
    await saveProgress(playerId, 50, 1, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L25] could not save skip progress:', err.message);
  }

  try {
    await unlockNext(playerId);
  } catch (err) {
    console.error('[BrainTwist L25] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    skipped: true,
    message: 'Level skipped',
    score: 50,
    stars: 1,
    attempts,
    hints: newBalance,
    progressSaved,
  });
}));

/* ---------------------------------------------------------
   GET /level25/status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await one(
    `SELECT is_completed, score, stars, attempts, completed_at
     FROM brain_twist_progress WHERE player_id = ? AND level_number = ?`,
    [playerId, LEVEL]
  );

  res.json({
    success: true,
    level: LEVEL,
    completed: Boolean(row && row.is_completed),
    score: row ? Number(row.score) || 0 : 0,
    stars: row ? Number(row.stars) || 0 : 0,
    attempts: row ? Number(row.attempts) || 0 : 0,
    completedAt: row ? row.completed_at : null,
  });
}));

module.exports = r;