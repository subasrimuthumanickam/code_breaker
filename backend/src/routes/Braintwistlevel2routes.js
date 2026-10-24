
const express = require('express');
const db = require('../db');

const r = express.Router();

const LEVEL = 2;

/* ---------- PUZZLE (answer stays on the server) ---------- */

const PUZZLE = {
  title: 'What word is this?',
  hint: 'Look at the picture and the word together',
  clueIcon: 'rain',
  clueText: 'BOW',
  answer: 'RAINBOW',
  right: 'Yes! Rain + Bow = RAINBOW',
  wrong: [
    'Not quite. Try again!',
    'Look at the cloud and the word together.',
    'Rain + BOW. What shows up after rain?',
  ],
};

// what the frontend may see (no answer)
const puzzleView = () => ({
  title: PUZZLE.title,
  hint: PUZZLE.hint,
  clueIcon: PUZZLE.clueIcon,
  clueText: PUZZLE.clueText,
  length: PUZZLE.answer.length,
});

/* ---------- HELPERS ---------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L2 Error]', req.method, req.originalUrl, err);
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

/* ---------- TABLES (auto create) ---------- */

const ready = (async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level2_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      stage TINYINT NOT NULL DEFAULT 1,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      wrong_attempts INT NOT NULL DEFAULT 0,
      total_attempts INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      stage1_done_at DATETIME NULL,
      completed_at DATETIME NULL,
      INDEX idx_l2_player (player_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level2_actions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      stage TINYINT NOT NULL,
      tool VARCHAR(30) NOT NULL,
      target VARCHAR(30) NOT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l2_session (session_id)
    )
  `);

  console.log('[BrainTwist L2] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L2] could not create tables:', err.message)
);

r.use(async (req, res, next) => {
  await ready;
  next();
});

/* ---------- SAVE RESULT + UNLOCK LEVEL 3 ---------- */

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
   POST /level2/start     body: { playerId }
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  // continue unfinished session, otherwise create a new one
  let session = await one(
    `SELECT * FROM bt_level2_sessions
     WHERE player_id = ? AND status = 'in_progress'
     ORDER BY id DESC LIMIT 1`,
    [playerId]
  );

  if (!session) {
    const [inserted] = await db.query(
      'INSERT INTO bt_level2_sessions (player_id) VALUES (?)',
      [playerId]
    );
    session = await one('SELECT * FROM bt_level2_sessions WHERE id = ?', [inserted.insertId]);
  }

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    ...puzzleView(),
  });
}));

/* ---------------------------------------------------------
   POST /level2/action    body: { sessionId, playerId, answer }
--------------------------------------------------------- */

r.post('/action', handle(async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);
  const answer = String(req.body?.answer || '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 30);

  if (!sessionId || !playerId) {
    return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
  }

  const session = await one(
    'SELECT * FROM bt_level2_sessions WHERE id = ? AND player_id = ?',
    [sessionId, playerId]
  );

  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') {
    return bad(res, 409, 'already_completed', 'This level is already completed');
  }

  if (answer.length !== PUZZLE.answer.length) {
    return bad(res, 400, 'invalid_answer', `Answer must have ${PUZZLE.answer.length} letters`);
  }

  const wrongBefore = Number(session.wrong_attempts);
  const attemptsBefore = Number(session.total_attempts);
  const correct = answer === PUZZLE.answer;

  // 1) save the typed word
  await db.query(
    `INSERT INTO bt_level2_actions (session_id, stage, tool, target, is_correct)
     VALUES (?, 1, ?, 'word', ?)`,
    [sessionId, answer, correct ? 1 : 0]
  );

  await db.query(
    'UPDATE bt_level2_sessions SET total_attempts = total_attempts + 1 WHERE id = ?',
    [sessionId]
  );

  // 2) wrong answer -> JSON back to frontend
  if (!correct) {
    await db.query(
      'UPDATE bt_level2_sessions SET wrong_attempts = wrong_attempts + 1 WHERE id = ?',
      [sessionId]
    );

    return res.json({
      success: true,
      correct: false,
      completed: false,
      wrongAttempts: wrongBefore + 1,
      message: PUZZLE.wrong[Math.min(wrongBefore, PUZZLE.wrong.length - 1)],
    });
  }

  // 3) correct answer -> score, stars, save, unlock next level
  const attempts = attemptsBefore + 1;
  const score = Math.max(100, 300 - wrongBefore * 50);
  const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

  await db.query(
    `UPDATE bt_level2_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?`,
    [sessionId]
  );

  let progressSaved = false;
  try {
    await saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L2] could not save progress:', err.message);
  }

  try {
    await unlockNext(playerId);
  } catch (err) {
    console.error('[BrainTwist L2] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    message: PUZZLE.right,
    score,
    stars,
    attempts,
    progressSaved,
  });
}));

/* ---------------------------------------------------------
   GET /level2/status/:playerId
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