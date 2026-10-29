const express = require('express');
const db = require('../db');

const r = express.Router();

const LEVEL = 21;
const PICK_COUNT = 4;

// keep in sync with the frontend (Btlevel21screen.tsx)
const HINT_COST = 25;
const SKIP_COST = 50;

/* ---------- HELPERS ---------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L21 Error]', req.method, req.originalUrl, err);
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

/* ---------- PUZZLE (comes from MySQL) ---------- */

const shape = (row) => {
  let numbers = [];
  try {
    const a = JSON.parse(row.numbers);
    if (Array.isArray(a)) numbers = a.map(Number).filter((n) => Number.isFinite(n));
  } catch (e) {}
  return {
    id: row.id,
    title: row.title,
    hint: row.hint_text,
    target: Number(row.target),
    numbers,
  };
};

const puzzleView = (p) => ({
  puzzleId: p.id,
  title: p.title,
  hint: p.hint,
  target: p.target,
  numbers: p.numbers,
  pickCount: PICK_COUNT,
});

const puzzleForSession = async (session) => {
  let row = null;
  if (session.puzzle_id) {
    row = await one('SELECT * FROM bt_level21_puzzles WHERE id = ?', [session.puzzle_id]);
  }
  if (!row) {
    row = await one('SELECT * FROM bt_level21_puzzles WHERE is_active = 1 ORDER BY id LIMIT 1');
  }
  if (!row) throw new Error('No active puzzle in bt_level21_puzzles');
  return shape(row);
};

// every set of PICK_COUNT indexes whose numbers add up to the target
const findSolutions = (numbers, target) => {
  const out = [];
  const walk = (start, chosen, sum) => {
    if (chosen.length === PICK_COUNT) {
      if (sum === target) out.push([...chosen]);
      return;
    }
    for (let i = start; i < numbers.length; i++) {
      chosen.push(i);
      walk(i + 1, chosen, sum + numbers[i]);
      chosen.pop();
    }
  };
  walk(0, [], 0);
  return out;
};

// clean an index list coming from the frontend
const cleanIdx = (arr, max) => {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  const out = [];
  for (const v of arr) {
    const n = Number(v);
    if (Number.isInteger(n) && n >= 0 && n < max && !seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  }
  return out;
};

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
    CREATE TABLE IF NOT EXISTS bt_level21_puzzles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      hint_text VARCHAR(200) NOT NULL DEFAULT 'Pick any 4 numbers',
      numbers TEXT NOT NULL,
      target INT NOT NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1
    )
  `);

  const count = await one('SELECT COUNT(*) AS c FROM bt_level21_puzzles');
  if (!count || Number(count.c) === 0) {
    await db.query(
      `INSERT INTO bt_level21_puzzles (title, hint_text, numbers, target, is_active)
       VALUES (?, ?, ?, ?, 1)`,
      [
        'Add any 4 numbers to make 200',
        'Tap 4 numbers',
        JSON.stringify([45, 80, 35, 60, 25, 90, 75, 50, 100]),
        200,
      ]
    );
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level21_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      puzzle_id INT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
      wrong_attempts INT NOT NULL DEFAULT 0,
      total_attempts INT NOT NULL DEFAULT 0,
      started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      INDEX idx_l21_player (player_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bt_level21_picks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id INT NOT NULL,
      kind VARCHAR(20) NOT NULL,
      picks VARCHAR(100) NOT NULL,
      total INT NULL,
      is_correct TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_l21_session (session_id)
    )
  `);

  console.log('[BrainTwist L21] tables ready');
})().catch((err) =>
  console.error('[BrainTwist L21] could not create tables:', err.message)
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
   POST /level21/start     body: { playerId }
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const active = await one(
    'SELECT * FROM bt_level21_puzzles WHERE is_active = 1 ORDER BY id LIMIT 1'
  );
  if (!active) return bad(res, 500, 'no_puzzle', 'No active puzzle in bt_level21_puzzles');

  let session = await one(
    `SELECT * FROM bt_level21_sessions
     WHERE player_id = ? AND status = 'in_progress'
     ORDER BY id DESC LIMIT 1`,
    [playerId]
  );

  // puzzle was changed in the DB: close the old session
  if (session && session.puzzle_id !== active.id) {
    await db.query(`UPDATE bt_level21_sessions SET status = 'abandoned' WHERE id = ?`, [session.id]);
    session = null;
  }

  if (!session) {
    const [inserted] = await db.query(
      'INSERT INTO bt_level21_sessions (player_id, puzzle_id) VALUES (?, ?)',
      [playerId, active.id]
    );
    session = await one('SELECT * FROM bt_level21_sessions WHERE id = ?', [inserted.insertId]);
  }

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    ...puzzleView(shape(active)),
  });
}));

/* ---------------------------------------------------------
   POST /level21/action    body: { sessionId, playerId, picks: [index x4] }
--------------------------------------------------------- */

r.post('/action', handle(async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);

  if (!sessionId || !playerId) {
    return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
  }

  const session = await one(
    'SELECT * FROM bt_level21_sessions WHERE id = ? AND player_id = ?',
    [sessionId, playerId]
  );
  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') {
    return bad(res, 409, 'already_completed', 'This level is already completed');
  }

  const puzzle = await puzzleForSession(session);
  const picks = cleanIdx(req.body?.picks, puzzle.numbers.length);

  if (picks.length !== PICK_COUNT) {
    return bad(res, 400, 'invalid_picks', `Pick exactly ${PICK_COUNT} different numbers`);
  }

  const total = picks.reduce((s, i) => s + puzzle.numbers[i], 0);
  const correct = total === puzzle.target;

  const wrongBefore = Number(session.wrong_attempts);
  const attemptsBefore = Number(session.total_attempts);

  // 1) save what the player picked
  await db.query(
    `INSERT INTO bt_level21_picks (session_id, kind, picks, total, is_correct)
     VALUES (?, 'submit', ?, ?, ?)`,
    [sessionId, picks.map((i) => puzzle.numbers[i]).join(','), total, correct ? 1 : 0]
  );

  await db.query(
    'UPDATE bt_level21_sessions SET total_attempts = total_attempts + 1 WHERE id = ?',
    [sessionId]
  );

  // 2) wrong -> JSON back
  if (!correct) {
    await db.query(
      'UPDATE bt_level21_sessions SET wrong_attempts = wrong_attempts + 1 WHERE id = ?',
      [sessionId]
    );

    const diff = total - puzzle.target;
    return res.json({
      success: true,
      correct: false,
      completed: false,
      total,
      wrongAttempts: wrongBefore + 1,
      message: diff > 0
        ? `Total is ${total}. That is ${diff} too high.`
        : `Total is ${total}. That is ${-diff} too low.`,
    });
  }

  // 3) correct -> score, stars, save, unlock next level
  const attempts = attemptsBefore + 1;
  const score = Math.max(100, 300 - wrongBefore * 50);
  const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

  await db.query(
    `UPDATE bt_level21_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?`,
    [sessionId]
  );

  let progressSaved = false;
  try {
    await saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L21] could not save progress:', err.message);
  }

  try {
    await unlockNext(playerId);
  } catch (err) {
    console.error('[BrainTwist L21] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    total,
    message: `Yes! Total is ${total}`,
    score,
    stars,
    attempts,
    progressSaved,
  });
}));

/* ---------------------------------------------------------
   POST /level21/hint     body: { sessionId, playerId, locked: [index...] }
   Reveals one more number that belongs to a valid answer. Costs HINT_COST.
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);

  if (!sessionId || !playerId) {
    return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
  }

  const session = await one(
    'SELECT * FROM bt_level21_sessions WHERE id = ? AND player_id = ?',
    [sessionId, playerId]
  );
  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') {
    return bad(res, 409, 'already_completed', 'This level is already completed');
  }

  const puzzle = await puzzleForSession(session);
  let locked = cleanIdx(req.body?.locked, puzzle.numbers.length).slice(0, PICK_COUNT);

  // keep the last number for the player
  if (locked.length >= PICK_COUNT - 1) {
    return res.json({
      success: true,
      charged: false,
      indices: locked,
      hints: await getHints(playerId),
      message: 'No more hints. You can do it!',
    });
  }

  const sols = findSolutions(puzzle.numbers, puzzle.target);
  if (!sols.length) return bad(res, 500, 'no_solution', 'This puzzle has no valid answer');

  let sol = sols.find((s) => locked.every((i) => s.includes(i)));
  if (!sol) {
    locked = [];
    sol = sols[0];
  }

  const next = sol.find((i) => !locked.includes(i));

  const newBalance = await spendHints(playerId, HINT_COST);
  if (newBalance === null) {
    return bad(res, 402, 'not_enough_hints', `Need ${HINT_COST} hints. You have ${await getHints(playerId)}.`);
  }

  const indices = [...locked, next];

  await db.query(
    `INSERT INTO bt_level21_picks (session_id, kind, picks, total, is_correct)
     VALUES (?, 'hint', ?, NULL, 0)`,
    [sessionId, indices.map((i) => puzzle.numbers[i]).join(',')]
  );

  res.json({
    success: true,
    charged: true,
    indices,
    hints: newBalance,
    message: `Hint: ${puzzle.numbers[next]} is in the answer`,
  });
}));

/* ---------------------------------------------------------
   POST /level21/skip     body: { sessionId, playerId }
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);

  if (!sessionId || !playerId) {
    return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
  }

  const session = await one(
    'SELECT * FROM bt_level21_sessions WHERE id = ? AND player_id = ?',
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
    `UPDATE bt_level21_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?`,
    [sessionId]
  );

  await db.query(
    `INSERT INTO bt_level21_picks (session_id, kind, picks, total, is_correct)
     VALUES (?, 'skip', 'skip', NULL, 0)`,
    [sessionId]
  );

  let progressSaved = false;
  try {
    await saveProgress(playerId, 50, 1, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L21] could not save skip progress:', err.message);
  }

  try {
    await unlockNext(playerId);
  } catch (err) {
    console.error('[BrainTwist L21] could not unlock next level:', err.message);
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
   GET /level21/status/:playerId
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