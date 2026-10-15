// // backend/src/routes/braintwistLevel2Routes.js
// //
// // Level 2  ->  "Make a flower"  then  "Color a flower"
// //
// // The frontend only draws the screen. The backend owns the game state:
// //   1. POST /start   -> creates (or resumes) a session row, sends the first stage
// //   2. POST /action  -> frontend says "tool X was dropped on the flower"
// //                       backend checks it, saves it, moves to the next stage or finishes
// //   3. GET  /status/:playerId -> best score / stars saved for level 2
// //
// // Tables used (created automatically when the backend starts):
// //   bt_level2_sessions  one row per play of level 2 (stage, attempts, status)
// //   bt_level2_actions   one row per tool drop (what the player tried)
// //   brain_twist_progress  existing table, receives the final score and stars

// const express = require('express');
// const db = require('../db');

// const r = express.Router();

// const LEVEL = 2;
// const LAST_STAGE = 2;
// const DEFAULT_WRONG = 'Not quite. Try another tool!';



// const STAGES = {
//   1: {
//     title: 'Make a flower',
//     hint: 'Drag the pencil onto the flower',
//     hintTool: 'pencil',
//     flower: 'blurred',
//     answer: 'pencil',
//     tools: [
//       { id: 'pencil', label: 'Pencil' },
//       { id: 'scissors', label: 'Scissors' },
//       { id: 'pen', label: 'Pen' },
//     ],
//     wrong: {
//       scissors: 'Scissors cut things. They cannot make a flower!',
//       pen: 'A pen is too messy here. Try another tool!',
//     },
//     right: 'Nice! Now the flower is clear.',
//   },

//   2: {
//     title: 'Color a flower',
//     hint: 'Drag the paintbrush onto the flower',
//     hintTool: 'paintbrush',
//     flower: 'outline',
//     answer: 'paintbrush',
//     tools: [
//       { id: 'paintbrush', label: 'Paintbrush' },
//       { id: 'sketch', label: 'Sketch' },
//       { id: 'crayons', label: 'Crayons' },
//     ],
//     wrong: {
//       sketch: 'A sketch only draws lines. We need paint!',
//       crayons: 'Crayons are too small for this big flower!',
//     },
//     right: 'Beautiful! What a lovely flower.',
//   },
// };

// // what the frontend is allowed to see about a stage (no answer)
// const stageView = (stage) => {
//   const s = STAGES[stage];

//   return {
//     stage,
//     totalStages: LAST_STAGE,
//     title: s.title,
//     hint: s.hint,
//     hintTool: s.hintTool,
//     flower: s.flower,
//     tools: s.tools,
//   };
// };

// /* ---------------------------------------------------------
//    HELPERS
// --------------------------------------------------------- */

// const handle = (fn) => async (req, res) => {
//   try {
//     await fn(req, res);
//   } catch (err) {
//     console.error('[BrainTwist L2 Error]', req.method, req.originalUrl, err);
//     if (!res.headersSent) {
//       res.status(500).json({
//         success: false,
//         error: 'server_error',
//         message: err.message,
//       });
//     }
//   }
// };

// const one = async (sql, params = []) => {
//   const [rows] = await db.query(sql, params);
//   return rows[0] || null;
// };

// const toId = (value) => {
//   const n = Number(value);
//   return Number.isInteger(n) && n > 0 ? n : null;
// };

// const bad = (res, status, error, message) =>
//   res.status(status).json({ success: false, error, message });

// /* ---------------------------------------------------------
//    TABLES
// --------------------------------------------------------- */

// const ready = (async () => {
//   await db.query(`
//     CREATE TABLE IF NOT EXISTS bt_level2_sessions (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       player_id INT NOT NULL,
//       stage TINYINT NOT NULL DEFAULT 1,
//       status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
//       wrong_attempts INT NOT NULL DEFAULT 0,
//       total_attempts INT NOT NULL DEFAULT 0,
//       started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       stage1_done_at DATETIME NULL,
//       completed_at DATETIME NULL,
//       INDEX idx_l2_player (player_id)
//     )
//   `);

//   await db.query(`
//     CREATE TABLE IF NOT EXISTS bt_level2_actions (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       session_id INT NOT NULL,
//       stage TINYINT NOT NULL,
//       tool VARCHAR(30) NOT NULL,
//       target VARCHAR(30) NOT NULL,
//       is_correct TINYINT(1) NOT NULL DEFAULT 0,
//       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       INDEX idx_l2_session (session_id)
//     )
//   `);

//   console.log('[BrainTwist L2] tables ready');
// })().catch((err) =>
//   console.error('[BrainTwist L2] could not create tables:', err.message)
// );

// r.use(async (req, res, next) => {
//   await ready;
//   next();
// });

// /* ---------------------------------------------------------
//    SAVE FINAL RESULT INTO brain_twist_progress
// --------------------------------------------------------- */

// const saveProgress = async (playerId, score, stars, attempts) => {
//   const found = await one(
//     `SELECT id FROM brain_twist_progress
//      WHERE player_id = ? AND level_number = ?`,
//     [playerId, LEVEL]
//   );

//   if (found) {
//     await db.query(
//       `UPDATE brain_twist_progress
//        SET is_completed = 1,
//            score = GREATEST(COALESCE(score, 0), ?),
//            stars = GREATEST(COALESCE(stars, 0), ?),
//            attempts = COALESCE(attempts, 0) + ?,
//            completed_at = NOW()
//        WHERE id = ?`,
//       [score, stars, attempts, found.id]
//     );
//   } else {
//     await db.query(
//       `INSERT INTO brain_twist_progress
//         (player_id, level_number, is_completed, score, stars, attempts, completed_at)
//        VALUES (?, ?, 1, ?, ?, ?, NOW())`,
//       [playerId, LEVEL, score, stars, attempts]
//     );
//   }
// };

// /* ---------------------------------------------------------
//    POST /start
//    body: { playerId }
// --------------------------------------------------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body?.playerId);

//   if (!playerId) {
//     return bad(res, 400, 'playerId_required', 'playerId is required');
//   }

//   // continue an unfinished session, otherwise start a new one
//   let session = await one(
//     `SELECT * FROM bt_level2_sessions
//      WHERE player_id = ? AND status = 'in_progress'
//      ORDER BY id DESC LIMIT 1`,
//     [playerId]
//   );

//   if (!session) {
//     const [inserted] = await db.query(
//       'INSERT INTO bt_level2_sessions (player_id) VALUES (?)',
//       [playerId]
//     );

//     session = await one(
//       'SELECT * FROM bt_level2_sessions WHERE id = ?',
//       [inserted.insertId]
//     );
//   }

//   res.json({
//     success: true,
//     sessionId: session.id,
//     level: LEVEL,
//     status: session.status,
//     ...stageView(Number(session.stage)),
//   });
// }));

// /* ---------------------------------------------------------
//    POST /action
//    body: { sessionId, playerId, tool, target }
// --------------------------------------------------------- */

// r.post('/action', handle(async (req, res) => {
//   const sessionId = toId(req.body?.sessionId);
//   const playerId = toId(req.body?.playerId);
//   const tool = String(req.body?.tool || '').toLowerCase().slice(0, 30);
//   const target = String(req.body?.target || '').toLowerCase().slice(0, 30);

//   if (!sessionId || !playerId) {
//     return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
//   }

//   const session = await one(
//     'SELECT * FROM bt_level2_sessions WHERE id = ? AND player_id = ?',
//     [sessionId, playerId]
//   );

//   if (!session) {
//     return bad(res, 404, 'no_session', 'Session not found');
//   }

//   if (session.status === 'completed') {
//     return bad(res, 409, 'already_completed', 'This level is already completed');
//   }

//   const stageNumber = Number(session.stage);
//   const stage = STAGES[stageNumber];

//   // numbers as they were before this move
//   const wrongBefore = Number(session.wrong_attempts);
//   const attemptsBefore = Number(session.total_attempts);

//   const knownTool = stage.tools.some((t) => t.id === tool);

//   if (!knownTool || target !== 'flower') {
//     return bad(res, 400, 'invalid_move', 'That move is not allowed here');
//   }

//   const correct = tool === stage.answer;

//   // save what the player tried
//   await db.query(
//     `INSERT INTO bt_level2_actions (session_id, stage, tool, target, is_correct)
//      VALUES (?, ?, ?, ?, ?)`,
//     [sessionId, stageNumber, tool, target, correct ? 1 : 0]
//   );

//   await db.query(
//     'UPDATE bt_level2_sessions SET total_attempts = total_attempts + 1 WHERE id = ?',
//     [sessionId]
//   );

//   // wrong tool
//   if (!correct) {
//     await db.query(
//       'UPDATE bt_level2_sessions SET wrong_attempts = wrong_attempts + 1 WHERE id = ?',
//       [sessionId]
//     );

//     return res.json({
//       success: true,
//       correct: false,
//       completed: false,
//       stage: stageNumber,
//       wrongAttempts: wrongBefore + 1,
//       message: stage.wrong[tool] || DEFAULT_WRONG,
//     });
//   }

//   // right tool, more stages left -> move on
//   if (stageNumber < LAST_STAGE) {
//     const next = stageNumber + 1;

//     await db.query(
//       'UPDATE bt_level2_sessions SET stage = ?, stage1_done_at = NOW() WHERE id = ?',
//       [next, sessionId]
//     );

//     return res.json({
//       success: true,
//       correct: true,
//       completed: false,
//       message: stage.right,
//       ...stageView(next),
//     });
//   }

//   // right tool on the last stage -> level complete
//   const wrong = wrongBefore;
//   const attempts = attemptsBefore + 1;
//   const score = Math.max(100, 300 - wrong * 50);
//   const stars = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;

//   await db.query(
//     `UPDATE bt_level2_sessions
//      SET status = 'completed', completed_at = NOW()
//      WHERE id = ?`,
//     [sessionId]
//   );

//   let progressSaved = false;

//   try {
//     await saveProgress(playerId, score, stars, attempts);
//     progressSaved = true;
//   } catch (err) {
//     console.error('[BrainTwist L2] could not save progress:', err.message);
//   }

//   res.json({
//     success: true,
//     correct: true,
//     completed: true,
//     stage: stageNumber,
//     flower: 'colored',
//     message: stage.right,
//     score,
//     stars,
//     attempts,
//     progressSaved,
//   });
// }));

// /* ---------------------------------------------------------
//    GET /status/:playerId
// --------------------------------------------------------- */

// r.get('/status/:playerId', handle(async (req, res) => {
//   const playerId = toId(req.params.playerId);

//   if (!playerId) {
//     return bad(res, 400, 'playerId_required', 'playerId is required');
//   }

//   const row = await one(
//     `SELECT is_completed, score, stars, attempts, completed_at
//      FROM brain_twist_progress
//      WHERE player_id = ? AND level_number = ?`,
//     [playerId, LEVEL]
//   );

//   res.json({
//     success: true,
//     level: LEVEL,
//     completed: Boolean(row && row.is_completed),
//     score: row ? Number(row.score) || 0 : 0,
//     stars: row ? Number(row.stars) || 0 : 0,
//     attempts: row ? Number(row.attempts) || 0 : 0,
//     completedAt: row ? row.completed_at : null,
//   });
// }));

// module.exports = r;
// backend/src/routes/braintwistLevel2Routes.js
//
// Level 2  ->  "Make a flower"  then  "Color a flower"
//
// The frontend only draws the screen. The backend owns the game state:
//   1. POST /start   -> creates (or resumes) a session row, sends the first stage
//   2. POST /action  -> frontend says "tool X was dropped on the flower"
//                       backend checks it, saves it, moves to the next stage or finishes
//   3. GET  /status/:playerId -> best score / stars saved for level 2
//
// Tables used (created automatically when the backend starts):
//   bt_level2_sessions  one row per play of level 2 (stage, attempts, status)
//   bt_level2_actions   one row per tool drop (what the player tried)
//   brain_twist_progress  existing table, receives the final score and stars

const express = require('express');
const db = require('../db');

const r = express.Router();

const LEVEL = 2;
const LAST_STAGE = 2;
const DEFAULT_WRONG = 'Not quite. Try another tool!';

/* ---------------------------------------------------------
   STAGES  (the right answer stays on the server)
--------------------------------------------------------- */

const STAGES = {
  1: {
    title: 'Make a flower',
    hint: 'Drag the pencil onto the flower',
    hintTool: 'pencil',
    flower: 'blurred',
    answer: 'pencil',
    tools: [
      { id: 'pencil', label: 'Pencil' },
      { id: 'scissors', label: 'Scissors' },
      { id: 'pen', label: 'Pen' },
    ],
    wrong: {
      scissors: 'Scissors cut things. They cannot make a flower!',
      pen: 'A pen is too messy here. Try another tool!',
    },
    right: 'Nice! Now the flower is clear.',
  },

  2: {
    title: 'Color a flower',
    hint: 'Drag the paintbrush onto the flower',
    hintTool: 'paintbrush',
    flower: 'outline',
    answer: 'paintbrush',
    tools: [
      { id: 'paintbrush', label: 'Paintbrush' },
      { id: 'sketch', label: 'Sketch' },
      { id: 'crayons', label: 'Crayons' },
    ],
    wrong: {
      sketch: 'A sketch only draws lines. We need paint!',
      crayons: 'Crayons are too small for this big flower!',
    },
    right: 'Beautiful! What a lovely flower.',
  },
};

// what the frontend is allowed to see about a stage (no answer)
const stageView = (stage) => {
  const s = STAGES[stage];

  return {
    stage,
    totalStages: LAST_STAGE,
    title: s.title,
    hint: s.hint,
    hintTool: s.hintTool,
    flower: s.flower,
    tools: s.tools,
  };
};

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L2 Error]', req.method, req.originalUrl, err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'server_error',
        message: err.message,
      });
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

/* ---------------------------------------------------------
   TABLES
--------------------------------------------------------- */

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

/* ---------------------------------------------------------
   SAVE FINAL RESULT INTO brain_twist_progress
--------------------------------------------------------- */

const saveProgress = async (playerId, score, stars, attempts) => {
  const found = await one(
    `SELECT id FROM brain_twist_progress
     WHERE player_id = ? AND level_number = ?`,
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

/* ---------------------------------------------------------
   UNLOCK LEVEL 3  (same tables the other levels use)
--------------------------------------------------------- */

const unlockNext = async (playerId) => {
  await db.query(
    `INSERT INTO bt_progress
      (player_id, level_n, attempts, solved_at)
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
   POST /start
   body: { playerId }
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);

  if (!playerId) {
    return bad(res, 400, 'playerId_required', 'playerId is required');
  }

  // continue an unfinished session, otherwise start a new one
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

    session = await one(
      'SELECT * FROM bt_level2_sessions WHERE id = ?',
      [inserted.insertId]
    );
  }

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    ...stageView(Number(session.stage)),
  });
}));

/* ---------------------------------------------------------
   POST /action
   body: { sessionId, playerId, tool, target }
--------------------------------------------------------- */

r.post('/action', handle(async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);
  const tool = String(req.body?.tool || '').toLowerCase().slice(0, 30);
  const target = String(req.body?.target || '').toLowerCase().slice(0, 30);

  if (!sessionId || !playerId) {
    return bad(res, 400, 'ids_required', 'sessionId and playerId are required');
  }

  const session = await one(
    'SELECT * FROM bt_level2_sessions WHERE id = ? AND player_id = ?',
    [sessionId, playerId]
  );

  if (!session) {
    return bad(res, 404, 'no_session', 'Session not found');
  }

  if (session.status === 'completed') {
    return bad(res, 409, 'already_completed', 'This level is already completed');
  }

  const stageNumber = Number(session.stage);
  const stage = STAGES[stageNumber];

  // numbers as they were before this move
  const wrongBefore = Number(session.wrong_attempts);
  const attemptsBefore = Number(session.total_attempts);

  const knownTool = stage.tools.some((t) => t.id === tool);

  if (!knownTool || target !== 'flower') {
    return bad(res, 400, 'invalid_move', 'That move is not allowed here');
  }

  const correct = tool === stage.answer;

  // save what the player tried
  await db.query(
    `INSERT INTO bt_level2_actions (session_id, stage, tool, target, is_correct)
     VALUES (?, ?, ?, ?, ?)`,
    [sessionId, stageNumber, tool, target, correct ? 1 : 0]
  );

  await db.query(
    'UPDATE bt_level2_sessions SET total_attempts = total_attempts + 1 WHERE id = ?',
    [sessionId]
  );

  // wrong tool
  if (!correct) {
    await db.query(
      'UPDATE bt_level2_sessions SET wrong_attempts = wrong_attempts + 1 WHERE id = ?',
      [sessionId]
    );

    return res.json({
      success: true,
      correct: false,
      completed: false,
      stage: stageNumber,
      wrongAttempts: wrongBefore + 1,
      message: stage.wrong[tool] || DEFAULT_WRONG,
    });
  }

  // right tool, more stages left -> move on
  if (stageNumber < LAST_STAGE) {
    const next = stageNumber + 1;

    await db.query(
      'UPDATE bt_level2_sessions SET stage = ?, stage1_done_at = NOW() WHERE id = ?',
      [next, sessionId]
    );

    return res.json({
      success: true,
      correct: true,
      completed: false,
      message: stage.right,
      ...stageView(next),
    });
  }

  // right tool on the last stage -> level complete
  const wrong = wrongBefore;
  const attempts = attemptsBefore + 1;
  const score = Math.max(100, 300 - wrong * 50);
  const stars = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;

  await db.query(
    `UPDATE bt_level2_sessions
     SET status = 'completed', completed_at = NOW()
     WHERE id = ?`,
    [sessionId]
  );

  let progressSaved = false;

  try {
    await saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L2] could not save progress:', err.message);
  }

  // best effort: the next level should open for this player
  try {
    await unlockNext(playerId);
  } catch (err) {
    console.error('[BrainTwist L2] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    stage: stageNumber,
    flower: 'colored',
    message: stage.right,
    score,
    stars,
    attempts,
    progressSaved,
  });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);

  if (!playerId) {
    return bad(res, 400, 'playerId_required', 'playerId is required');
  }

  const row = await one(
    `SELECT is_completed, score, stars, attempts, completed_at
     FROM brain_twist_progress
     WHERE player_id = ? AND level_number = ?`,
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