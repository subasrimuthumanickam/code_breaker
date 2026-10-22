// // const express = require('express');
// // const router = express.Router();

// // // ⚠️ Level 15 route file la irukura same db import + auth line ah inga maathikko
// // const db = require('../config/db'); // mysql2/promise pool nu assume pannirukken

// // const { ANSWER, LEVEL16, HINTS, EXPLANATION } = require('../data/level16Db');

// // const getPlayerId = (req) =>
// //   req.user?.id ?? req.player?.id ?? req.body?.player_id ?? req.query?.player_id;

// // async function loadSession(sessionId, playerId) {
// //   const [rows] = await db.query(
// //     'SELECT * FROM bt_level16_sessions WHERE id = ? AND player_id = ?',
// //     [sessionId, playerId]
// //   );
// //   return rows[0] || null;
// // }

// // // POST /start -> session create (or resume) + level data (answer illa)
// // router.post('/start', async (req, res) => {
// //   try {
// //     const playerId = getPlayerId(req);
// //     if (!playerId) return res.status(401).json({ success: false, message: 'Not logged in' });

// //     const [existing] = await db.query(
// //       "SELECT id, hints_used, wrong_attempts FROM bt_level16_sessions WHERE player_id = ? AND status = 'in_progress' ORDER BY id DESC LIMIT 1",
// //       [playerId]
// //     );

// //     let sessionId;
// //     let hintsUsed = 0;
// //     let wrongAttempts = 0;

// //     if (existing.length) {
// //       sessionId = existing[0].id;
// //       hintsUsed = existing[0].hints_used;
// //       wrongAttempts = existing[0].wrong_attempts;
// //     } else {
// //       const [result] = await db.query(
// //         'INSERT INTO bt_level16_sessions (player_id) VALUES (?)',
// //         [playerId]
// //       );
// //       sessionId = result.insertId;
// //     }

// //     return res.json({ success: true, sessionId, hintsUsed, wrongAttempts, level: LEVEL16 });
// //   } catch (err) {
// //     console.error('[level16/start]', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // POST /answer { sessionId, choice }
// // router.post('/answer', async (req, res) => {
// //   try {
// //     const playerId = getPlayerId(req);
// //     const { sessionId } = req.body;
// //     const choice = String(req.body.choice || '').toUpperCase();

// //     if (!['A', 'B', 'C', 'D'].includes(choice)) {
// //       return res.status(400).json({ success: false, message: 'Invalid choice' });
// //     }

// //     const session = await loadSession(sessionId, playerId);
// //     if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
// //     if (session.status !== 'in_progress') {
// //       return res.status(409).json({ success: false, message: 'Level already finished' });
// //     }

// //     const isCorrect = choice === ANSWER;

// //     await db.query(
// //       'INSERT INTO bt_level16_actions (session_id, action, value, is_correct) VALUES (?, ?, ?, ?)',
// //       [session.id, 'answer', choice, isCorrect ? 1 : 0]
// //     );

// //     if (isCorrect) {
// //       await db.query(
// //         `UPDATE bt_level16_sessions
// //          SET total_attempts = total_attempts + 1,
// //              status = 'completed',
// //              completed_at = NOW(),
// //              seconds = TIMESTAMPDIFF(SECOND, started_at, NOW())
// //          WHERE id = ?`,
// //         [session.id]
// //       );
// //     } else {
// //       await db.query(
// //         `UPDATE bt_level16_sessions
// //          SET total_attempts = total_attempts + 1,
// //              wrong_attempts = wrong_attempts + 1
// //          WHERE id = ?`,
// //         [session.id]
// //       );
// //     }

// //     const updated = await loadSession(session.id, playerId);

// //     return res.json({
// //       success: true,
// //       correct: isCorrect,
// //       completed: isCorrect,
// //       explanation: isCorrect ? EXPLANATION : null,
// //       wrongAttempts: updated.wrong_attempts,
// //       totalAttempts: updated.total_attempts,
// //       hintsUsed: updated.hints_used,
// //       seconds: updated.seconds,
// //     });
// //   } catch (err) {
// //     console.error('[level16/answer]', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // POST /hint { sessionId }
// // router.post('/hint', async (req, res) => {
// //   try {
// //     const playerId = getPlayerId(req);
// //     const session = await loadSession(req.body.sessionId, playerId);
// //     if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
// //     if (session.status !== 'in_progress') {
// //       return res.status(409).json({ success: false, message: 'Level already finished' });
// //     }

// //     const hintIndex = Math.min(session.hints_used, HINTS.length - 1);

// //     await db.query('UPDATE bt_level16_sessions SET hints_used = hints_used + 1 WHERE id = ?', [session.id]);
// //     await db.query(
// //       'INSERT INTO bt_level16_actions (session_id, action, value) VALUES (?, ?, ?)',
// //       [session.id, 'hint', String(session.hints_used + 1)]
// //     );

// //     return res.json({
// //       success: true,
// //       hint: HINTS[hintIndex],
// //       hintsUsed: session.hints_used + 1,
// //     });
// //   } catch (err) {
// //     console.error('[level16/hint]', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // POST /skip { sessionId }
// // router.post('/skip', async (req, res) => {
// //   try {
// //     const playerId = getPlayerId(req);
// //     const session = await loadSession(req.body.sessionId, playerId);
// //     if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
// //     if (session.status !== 'in_progress') {
// //       return res.status(409).json({ success: false, message: 'Level already finished' });
// //     }

// //     await db.query(
// //       `UPDATE bt_level16_sessions
// //        SET status = 'skipped', completed_at = NOW(),
// //            seconds = TIMESTAMPDIFF(SECOND, started_at, NOW())
// //        WHERE id = ?`,
// //       [session.id]
// //     );
// //     await db.query(
// //       'INSERT INTO bt_level16_actions (session_id, action, value) VALUES (?, ?, ?)',
// //       [session.id, 'skip', '']
// //     );

// //     return res.json({ success: true, skipped: true });
// //   } catch (err) {
// //     console.error('[level16/skip]', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // module.exports = router;
// const express = require('express');
// const router = express.Router();

// // ⚠️ Braintwistlevel15routes.js top la irukura same db import-ah inga use pannu
// const db = require('../config/db'); // mysql2/promise pool nu assume

// const { ANSWER, LEVEL16, HINTS, EXPLANATION } = require('../data/level16Db');

// const HINT_COST = 25;
// const SKIP_COST = 50;

// /* ⚠️ ONLY PLACE I COULDN'T SEE:
//    Hints (bulbs) balance enga store aagudhu nu Level 15 routes la irukku.
//    Antha same logic-ah inga paste pannu. Rules:
//    - balance < cost na  -> throw error with status 402 (frontend 'Not enough hints' kaatum)
//    - illana balance kuraichu, new balance return pannu
//    Keela irukkuradhu placeholder (table / column name unga DB ku maathanum). */
// async function spendHints(playerId, cost) {
//   const [r] = await db.query('SELECT hints FROM player WHERE id = ?', [playerId]); // <-- adjust
//   const current = r.length ? Number(r[0].hints) : 0;
//   if (current < cost) {
//     const e = new Error('Not enough hints');
//     e.status = 402;
//     throw e;
//   }
//   await db.query('UPDATE player SET hints = hints - ? WHERE id = ?', [cost, playerId]); // <-- adjust
//   return current - cost;
// }

// async function loadSession(sessionId, playerId) {
//   const [rows] = await db.query(
//     'SELECT * FROM bt_level16_sessions WHERE id = ? AND player_id = ?',
//     [sessionId, playerId]
//   );
//   return rows[0] || null;
// }

// const fail = (res, err, tag) => {
//   if (err.status) return res.status(err.status).json({ success: false, error: err.message });
//   console.error(`[level16/${tag}]`, err);
//   return res.status(500).json({ success: false, error: 'Server error' });
// };

// // POST /start { playerId }
// router.post('/start', async (req, res) => {
//   try {
//     const playerId = Number(req.body.playerId);
//     if (!playerId) return res.status(400).json({ success: false, error: 'playerId required' });

//     const [existing] = await db.query(
//       "SELECT id, hints_used, wrong_attempts FROM bt_level16_sessions WHERE player_id = ? AND status = 'in_progress' ORDER BY id DESC LIMIT 1",
//       [playerId]
//     );

//     let sessionId, hintsUsed = 0, wrongAttempts = 0;
//     if (existing.length) {
//       sessionId = existing[0].id;
//       hintsUsed = existing[0].hints_used;
//       wrongAttempts = existing[0].wrong_attempts;
//     } else {
//       const [result] = await db.query('INSERT INTO bt_level16_sessions (player_id) VALUES (?)', [playerId]);
//       sessionId = result.insertId;
//     }

//     return res.json({ success: true, sessionId, hintsUsed, wrongAttempts, level: LEVEL16 });
//   } catch (err) {
//     return fail(res, err, 'start');
//   }
// });

// // POST /answer { playerId, sessionId, choice }
// router.post('/answer', async (req, res) => {
//   try {
//     const playerId = Number(req.body.playerId);
//     const choice = String(req.body.choice || '').toUpperCase();
//     if (!['A', 'B', 'C', 'D'].includes(choice)) {
//       return res.status(400).json({ success: false, error: 'Invalid choice' });
//     }

//     const session = await loadSession(req.body.sessionId, playerId);
//     if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
//     if (session.status !== 'in_progress') {
//       return res.status(409).json({ success: false, error: 'Level already finished' });
//     }

//     const isCorrect = choice === ANSWER;

//     await db.query(
//       'INSERT INTO bt_level16_actions (session_id, action, value, is_correct) VALUES (?, ?, ?, ?)',
//       [session.id, 'answer', choice, isCorrect ? 1 : 0]
//     );

//     if (isCorrect) {
//       await db.query(
//         `UPDATE bt_level16_sessions
//          SET total_attempts = total_attempts + 1, status = 'completed', completed_at = NOW(),
//              seconds = TIMESTAMPDIFF(SECOND, started_at, NOW())
//          WHERE id = ?`,
//         [session.id]
//       );
//     } else {
//       await db.query(
//         `UPDATE bt_level16_sessions
//          SET total_attempts = total_attempts + 1, wrong_attempts = wrong_attempts + 1
//          WHERE id = ?`,
//         [session.id]
//       );
//     }

//     const s = await loadSession(session.id, playerId);

//     return res.json({
//       success: true,
//       correct: isCorrect,
//       explanation: isCorrect ? EXPLANATION : null,
//       attempts: s.total_attempts,
//       wrongAttempts: s.wrong_attempts,
//       hintsUsed: s.hints_used,
//       seconds: s.seconds,
//     });
//   } catch (err) {
//     return fail(res, err, 'answer');
//   }
// });

// // POST /hint { playerId, sessionId }
// router.post('/hint', async (req, res) => {
//   try {
//     const playerId = Number(req.body.playerId);
//     const session = await loadSession(req.body.sessionId, playerId);
//     if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
//     if (session.status !== 'in_progress') {
//       return res.status(409).json({ success: false, error: 'Level already finished' });
//     }

//     const hints = await spendHints(playerId, HINT_COST);
//     const text = HINTS[Math.min(session.hints_used, HINTS.length - 1)];

//     await db.query('UPDATE bt_level16_sessions SET hints_used = hints_used + 1 WHERE id = ?', [session.id]);
//     await db.query(
//       'INSERT INTO bt_level16_actions (session_id, action, value) VALUES (?, ?, ?)',
//       [session.id, 'hint', String(session.hints_used + 1)]
//     );

//     return res.json({ success: true, hint: { text }, hints });
//   } catch (err) {
//     return fail(res, err, 'hint');
//   }
// });

// // POST /skip { playerId, sessionId }
// router.post('/skip', async (req, res) => {
//   try {
//     const playerId = Number(req.body.playerId);
//     const session = await loadSession(req.body.sessionId, playerId);
//     if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
//     if (session.status !== 'in_progress') {
//       return res.status(409).json({ success: false, error: 'Level already finished' });
//     }

//     const hints = await spendHints(playerId, SKIP_COST);

//     await db.query(
//       `UPDATE bt_level16_sessions
//        SET status = 'skipped', completed_at = NOW(), seconds = TIMESTAMPDIFF(SECOND, started_at, NOW())
//        WHERE id = ?`,
//       [session.id]
//     );
//     await db.query(
//       'INSERT INTO bt_level16_actions (session_id, action, value) VALUES (?, ?, ?)',
//       [session.id, 'skip', '']
//     );

//     return res.json({ success: true, skipped: true, attempts: session.total_attempts, hints });
//   } catch (err) {
//     return fail(res, err, 'skip');
//   }
// });

// // GET /status/:playerId
// router.get('/status/:playerId', async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       'SELECT id, status, total_attempts, wrong_attempts, hints_used, seconds FROM bt_level16_sessions WHERE player_id = ? ORDER BY id DESC LIMIT 1',
//       [Number(req.params.playerId)]
//     );
//     return res.json({ success: true, session: rows[0] || null });
//   } catch (err) {
//     return fail(res, err, 'status');
//   }
// });

// module.exports = router;
const express = require('express');
const l16 = require('../data/level16Db');

const r = express.Router();

const HINT_COST = 25;
const SKIP_COST = 50;
const REWARD_HINTS = 75;

/* ---------- HELPERS ---------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L16 Error]', req.method, req.originalUrl, err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'server_error', message: err.message });
    }
  }
};

const toId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const bad = (res, status, error, message) =>
  res.status(status).json({ success: false, error, message });

// reads ids from body, loads the session, answers the error itself when something is wrong
const loadSession = async (req, res) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await l16.getSession(sessionId, playerId);
  if (!session) {
    bad(res, 404, 'no_session', 'Session not found');
    return null;
  }

  if (session.status !== 'in_progress') {
    bad(res, 409, 'already_finished', 'This level is already finished');
    return null;
  }

  return { session, playerId };
};

r.use(async (req, res, next) => {
  await l16.ready;
  next();
});

/* ---------------------------------------------------------
   POST /level16/start     body: { playerId }
   level data is sent WITHOUT the answer
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await l16.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  // continue an unfinished game, otherwise start a new one
  let session = await l16.getActiveSession(playerId);
  if (!session) session = await l16.createSession(playerId);

  res.json({
    success: true,
    sessionId: session.id,
    level: l16.LEVEL_DATA,
    status: session.status,
    hintsUsed: Number(session.hints_used),
    wrongAttempts: Number(session.wrong_attempts),
    hints: Number(player.hints) || 0,
  });
}));

/* ---------------------------------------------------------
   POST /level16/answer    body: { sessionId, playerId, choice }
--------------------------------------------------------- */

r.post('/answer', handle(async (req, res) => {
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session, playerId } = ctx;

  const choice = String(req.body?.choice || '').toUpperCase().trim();
  if (!l16.LEVEL_DATA.options.includes(choice)) {
    return bad(res, 400, 'invalid_choice', 'Choice must be A, B, C or D');
  }

  const wrongBefore = Number(session.wrong_attempts);
  const attemptsBefore = Number(session.total_attempts);
  const correct = choice === l16.ANSWER;

  await l16.recordAction(session.id, 'answer', choice, correct);
  await l16.addAttempt(session.id, !correct);

  if (!correct) {
    return res.json({
      success: true,
      correct: false,
      completed: false,
      wrongAttempts: wrongBefore + 1,
      attempts: attemptsBefore + 1,
      message: 'Not him. Look at the clues again!',
    });
  }

  // correct -> score, stars, save progress, unlock next level
  const attempts = attemptsBefore + 1;
  const score = Math.max(100, 300 - wrongBefore * 50);
  const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;
  const seconds = Number(session.elapsed) || 0;

  await l16.completeSession(session.id, seconds);

  let progressSaved = false;
  try {
    await l16.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L16] could not save progress:', err.message);
  }

  try {
    await l16.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L16] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    explanation: l16.EXPLANATION,
    score,
    stars,
    attempts,
    wrongAttempts: wrongBefore,
    hintsUsed: Number(session.hints_used),
    seconds,
    progressSaved,
  });
}));

/* ---------------------------------------------------------
   POST /level16/hint      body: { sessionId, playerId }     costs 25 hints
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session, playerId } = ctx;

  const left = await l16.spendHints(playerId, HINT_COST);
  if (left === null) {
    return bad(res, 402, 'not_enough_hints', `You need ${HINT_COST} hints`);
  }

  const text = l16.HINTS[Math.min(Number(session.hints_used), l16.HINTS.length - 1)];

  await l16.markHintUsed(session.id);
  await l16.recordAction(session.id, 'hint', String(Number(session.hints_used) + 1), false);

  res.json({
    success: true,
    hints: left,
    hint: { text },
    hintsUsed: Number(session.hints_used) + 1,
  });
}));

/* ---------------------------------------------------------
   POST /level16/skip      body: { sessionId, playerId }     costs 50 hints
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session, playerId } = ctx;

  const left = await l16.spendHints(playerId, SKIP_COST);
  if (left === null) {
    return bad(res, 402, 'not_enough_hints', `You need ${SKIP_COST} hints`);
  }

  await l16.skipSession(session.id, Number(session.elapsed) || 0);
  await l16.recordAction(session.id, 'skip', '', false);
  await l16.unlockNext(playerId, Number(session.total_attempts) || 0);

  res.json({
    success: true,
    skipped: true,
    hints: left,
    attempts: Number(session.total_attempts) || 0,
    message: 'Level skipped',
  });
}));

/* ---------------------------------------------------------
   POST /level16/reward    body: { playerId }      video reward +75 hints
--------------------------------------------------------- */

r.post('/reward', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const hints = await l16.addHints(playerId, REWARD_HINTS);
  res.json({ success: true, hints, added: REWARD_HINTS });
}));

/* ---------------------------------------------------------
   GET /level16/status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await l16.getProgress(playerId);

  res.json({
    success: true,
    level: l16.LEVEL,
    completed: Boolean(row && row.is_completed),
    score: row ? Number(row.score) || 0 : 0,
    stars: row ? Number(row.stars) || 0 : 0,
    attempts: row ? Number(row.attempts) || 0 : 0,
    completedAt: row ? row.completed_at : null,
  });
}));

module.exports = r;