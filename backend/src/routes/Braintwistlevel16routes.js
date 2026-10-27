
// // const express = require('express');
// // const l16 = require('../data/level16Db');

// // const r = express.Router();

// // const HINT_COST = 25;
// // const SKIP_COST = 50;
// // const REWARD_HINTS = 75;

// // /* ---------- HELPERS ---------- */

// // const handle = (fn) => async (req, res) => {
// //   try {
// //     await fn(req, res);
// //   } catch (err) {
// //     console.error('[BrainTwist L16 Error]', req.method, req.originalUrl, err);
// //     if (!res.headersSent) {
// //       res.status(500).json({ success: false, error: 'server_error', message: err.message });
// //     }
// //   }
// // };

// // const toId = (value) => {
// //   const n = Number(value);
// //   return Number.isInteger(n) && n > 0 ? n : null;
// // };

// // const bad = (res, status, error, message) =>
// //   res.status(status).json({ success: false, error, message });

// // // reads ids from body, loads the session, answers the error itself when something is wrong
// // const loadSession = async (req, res) => {
// //   const sessionId = toId(req.body?.sessionId);
// //   const playerId = toId(req.body?.playerId);

// //   if (!sessionId || !playerId) {
// //     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
// //     return null;
// //   }

// //   const session = await l16.getSession(sessionId, playerId);
// //   if (!session) {
// //     bad(res, 404, 'no_session', 'Session not found');
// //     return null;
// //   }

// //   if (session.status !== 'in_progress') {
// //     bad(res, 409, 'already_finished', 'This level is already finished');
// //     return null;
// //   }

// //   return { session, playerId };
// // };

// // r.use(async (req, res, next) => {
// //   await l16.ready;
// //   next();
// // });

// // /* ---------------------------------------------------------
// //    POST /level16/start     body: { playerId }
// //    level data is sent WITHOUT the answer
// // --------------------------------------------------------- */

// // r.post('/start', handle(async (req, res) => {
// //   const playerId = toId(req.body?.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const player = await l16.getPlayer(playerId);
// //   if (!player) return bad(res, 404, 'no_player', 'Player not found');

// //   // continue an unfinished game, otherwise start a new one
// //   let session = await l16.getActiveSession(playerId);
// //   if (!session) session = await l16.createSession(playerId);

// //   res.json({
// //     success: true,
// //     sessionId: session.id,
// //     level: l16.LEVEL_DATA,
// //     status: session.status,
// //     hintsUsed: Number(session.hints_used),
// //     wrongAttempts: Number(session.wrong_attempts),
// //     hints: Number(player.hints) || 0,
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /level16/answer    body: { sessionId, playerId, choice }
// // --------------------------------------------------------- */

// // r.post('/answer', handle(async (req, res) => {
// //   const ctx = await loadSession(req, res);
// //   if (!ctx) return;
// //   const { session, playerId } = ctx;

// //   const choice = String(req.body?.choice || '').toUpperCase().trim();
// //   if (!l16.LEVEL_DATA.options.includes(choice)) {
// //     return bad(res, 400, 'invalid_choice', 'Choice must be A, B, C or D');
// //   }

// //   const wrongBefore = Number(session.wrong_attempts);
// //   const attemptsBefore = Number(session.total_attempts);
// //   const correct = choice === l16.ANSWER;

// //   await l16.recordAction(session.id, 'answer', choice, correct);
// //   await l16.addAttempt(session.id, !correct);

// //   if (!correct) {
// //     return res.json({
// //       success: true,
// //       correct: false,
// //       completed: false,
// //       wrongAttempts: wrongBefore + 1,
// //       attempts: attemptsBefore + 1,
// //       message: 'Not him. Look at the clues again!',
// //     });
// //   }

// //   // correct -> score, stars, save progress, unlock next level
// //   const attempts = attemptsBefore + 1;
// //   const score = Math.max(100, 300 - wrongBefore * 50);
// //   const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;
// //   const seconds = Number(session.elapsed) || 0;

// //   await l16.completeSession(session.id, seconds);

// //   let progressSaved = false;
// //   try {
// //     await l16.saveProgress(playerId, score, stars, attempts);
// //     progressSaved = true;
// //   } catch (err) {
// //     console.error('[BrainTwist L16] could not save progress:', err.message);
// //   }

// //   try {
// //     await l16.unlockNext(playerId, attempts);
// //   } catch (err) {
// //     console.error('[BrainTwist L16] could not unlock next level:', err.message);
// //   }

// //   res.json({
// //     success: true,
// //     correct: true,
// //     completed: true,
// //     explanation: l16.EXPLANATION,
// //     score,
// //     stars,
// //     attempts,
// //     wrongAttempts: wrongBefore,
// //     hintsUsed: Number(session.hints_used),
// //     seconds,
// //     progressSaved,
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /level16/hint      body: { sessionId, playerId }     costs 25 hints
// // --------------------------------------------------------- */

// // r.post('/hint', handle(async (req, res) => {
// //   const ctx = await loadSession(req, res);
// //   if (!ctx) return;
// //   const { session, playerId } = ctx;

// //   const left = await l16.spendHints(playerId, HINT_COST);
// //   if (left === null) {
// //     return bad(res, 402, 'not_enough_hints', `You need ${HINT_COST} hints`);
// //   }

// //   const text = l16.HINTS[Math.min(Number(session.hints_used), l16.HINTS.length - 1)];

// //   await l16.markHintUsed(session.id);
// //   await l16.recordAction(session.id, 'hint', String(Number(session.hints_used) + 1), false);

// //   res.json({
// //     success: true,
// //     hints: left,
// //     hint: { text },
// //     hintsUsed: Number(session.hints_used) + 1,
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /level16/skip      body: { sessionId, playerId }     costs 50 hints
// // --------------------------------------------------------- */

// // r.post('/skip', handle(async (req, res) => {
// //   const ctx = await loadSession(req, res);
// //   if (!ctx) return;
// //   const { session, playerId } = ctx;

// //   const left = await l16.spendHints(playerId, SKIP_COST);
// //   if (left === null) {
// //     return bad(res, 402, 'not_enough_hints', `You need ${SKIP_COST} hints`);
// //   }

// //   await l16.skipSession(session.id, Number(session.elapsed) || 0);
// //   await l16.recordAction(session.id, 'skip', '', false);
// //   await l16.unlockNext(playerId, Number(session.total_attempts) || 0);

// //   res.json({
// //     success: true,
// //     skipped: true,
// //     hints: left,
// //     attempts: Number(session.total_attempts) || 0,
// //     message: 'Level skipped',
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /level16/reward    body: { playerId }      video reward +75 hints
// // --------------------------------------------------------- */

// // r.post('/reward', handle(async (req, res) => {
// //   const playerId = toId(req.body?.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const hints = await l16.addHints(playerId, REWARD_HINTS);
// //   res.json({ success: true, hints, added: REWARD_HINTS });
// // }));

// // /* ---------------------------------------------------------
// //    GET /level16/status/:playerId
// // --------------------------------------------------------- */

// // r.get('/status/:playerId', handle(async (req, res) => {
// //   const playerId = toId(req.params.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const row = await l16.getProgress(playerId);

// //   res.json({
// //     success: true,
// //     level: l16.LEVEL,
// //     completed: Boolean(row && row.is_completed),
// //     score: row ? Number(row.score) || 0 : 0,
// //     stars: row ? Number(row.stars) || 0 : 0,
// //     attempts: row ? Number(row.attempts) || 0 : 0,
// //     completedAt: row ? row.completed_at : null,
// //   });
// // }));

// // module.exports = r;
// const express = require('express');
// const l16 = require('../data/level16Db');

// const r = express.Router();

// const SKIP_COST = 50;
// const REWARD_HINTS = 75;

// // the clue is free (no hints are spent)
// const CLUE_TEXT = "Sometimes, the best excuse is the one that sounds too perfect. Look for something that doesn't add up.";

// /* ---------- HELPERS ---------- */

// const handle = (fn) => async (req, res) => {
//   try {
//     await fn(req, res);
//   } catch (err) {
//     console.error('[BrainTwist L16 Error]', req.method, req.originalUrl, err);
//     if (!res.headersSent) {
//       res.status(500).json({ success: false, error: 'server_error', message: err.message });
//     }
//   }
// };

// const toId = (value) => {
//   const n = Number(value);
//   return Number.isInteger(n) && n > 0 ? n : null;
// };

// const bad = (res, status, error, message) =>
//   res.status(status).json({ success: false, error, message });

// // reads ids from body, loads the session, answers the error itself when something is wrong
// const loadSession = async (req, res) => {
//   const sessionId = toId(req.body?.sessionId);
//   const playerId = toId(req.body?.playerId);

//   if (!sessionId || !playerId) {
//     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
//     return null;
//   }

//   const session = await l16.getSession(sessionId, playerId);
//   if (!session) {
//     bad(res, 404, 'no_session', 'Session not found');
//     return null;
//   }

//   if (session.status !== 'in_progress') {
//     bad(res, 409, 'already_finished', 'This level is already finished');
//     return null;
//   }

//   return { session, playerId };
// };

// r.use(async (req, res, next) => {
//   await l16.ready;
//   next();
// });

// /* ---------------------------------------------------------
//    POST /level16/start     body: { playerId }
//    level data is sent WITHOUT the answer
// --------------------------------------------------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body?.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const player = await l16.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   // continue an unfinished game, otherwise start a new one
//   let session = await l16.getActiveSession(playerId);
//   if (!session) session = await l16.createSession(playerId);

//   res.json({
//     success: true,
//     sessionId: session.id,
//     level: l16.LEVEL_DATA,
//     status: session.status,
//     hintsUsed: Number(session.hints_used),
//     wrongAttempts: Number(session.wrong_attempts),
//     hints: Number(player.hints) || 0,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level16/answer    body: { sessionId, playerId, choice }
// --------------------------------------------------------- */

// r.post('/answer', handle(async (req, res) => {
//   const ctx = await loadSession(req, res);
//   if (!ctx) return;
//   const { session, playerId } = ctx;

//   const choice = String(req.body?.choice || '').toUpperCase().trim();
//   if (!l16.LEVEL_DATA.options.includes(choice)) {
//     return bad(res, 400, 'invalid_choice', 'Choice must be A, B, C or D');
//   }

//   const wrongBefore = Number(session.wrong_attempts);
//   const attemptsBefore = Number(session.total_attempts);
//   const correct = choice === l16.ANSWER;

//   await l16.recordAction(session.id, 'answer', choice, correct);
//   await l16.addAttempt(session.id, !correct);

//   if (!correct) {
//     return res.json({
//       success: true,
//       correct: false,
//       completed: false,
//       wrongAttempts: wrongBefore + 1,
//       attempts: attemptsBefore + 1,
//       message: 'Not him. Look at the clues again!',
//     });
//   }

//   // correct -> score, stars, save progress, unlock next level
//   const attempts = attemptsBefore + 1;
//   const score = Math.max(100, 300 - wrongBefore * 50);
//   const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;
//   const seconds = Number(session.elapsed) || 0;

//   await l16.completeSession(session.id, seconds);

//   let progressSaved = false;
//   try {
//     await l16.saveProgress(playerId, score, stars, attempts);
//     progressSaved = true;
//   } catch (err) {
//     console.error('[BrainTwist L16] could not save progress:', err.message);
//   }

//   try {
//     await l16.unlockNext(playerId, attempts);
//   } catch (err) {
//     console.error('[BrainTwist L16] could not unlock next level:', err.message);
//   }

//   res.json({
//     success: true,
//     correct: true,
//     completed: true,
//     explanation: l16.EXPLANATION,
//     score,
//     stars,
//     attempts,
//     wrongAttempts: wrongBefore,
//     hintsUsed: Number(session.hints_used),
//     seconds,
//     progressSaved,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level16/hint      body: { sessionId, playerId }     FREE
//    shows the clue directly, no hints are spent
// --------------------------------------------------------- */

// r.post('/hint', handle(async (req, res) => {
//   const ctx = await loadSession(req, res);
//   if (!ctx) return;
//   const { session, playerId } = ctx;

//   await l16.markHintUsed(session.id);
//   await l16.recordAction(session.id, 'hint', String(Number(session.hints_used) + 1), false);

//   res.json({
//     success: true,
//     hints: await l16.getHints(playerId),
//     hint: { text: CLUE_TEXT },
//     hintsUsed: Number(session.hints_used) + 1,
//     cost: 0,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level16/skip      body: { sessionId, playerId }     costs 50 hints
// --------------------------------------------------------- */

// r.post('/skip', handle(async (req, res) => {
//   const ctx = await loadSession(req, res);
//   if (!ctx) return;
//   const { session, playerId } = ctx;

//   const left = await l16.spendHints(playerId, SKIP_COST);
//   if (left === null) {
//     return bad(res, 402, 'not_enough_hints', `You need ${SKIP_COST} hints`);
//   }

//   await l16.skipSession(session.id, Number(session.elapsed) || 0);
//   await l16.recordAction(session.id, 'skip', '', false);
//   await l16.unlockNext(playerId, Number(session.total_attempts) || 0);

//   res.json({
//     success: true,
//     skipped: true,
//     hints: left,
//     attempts: Number(session.total_attempts) || 0,
//     message: 'Level skipped',
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level16/reward    body: { playerId }      video reward +75 hints
// --------------------------------------------------------- */

// r.post('/reward', handle(async (req, res) => {
//   const playerId = toId(req.body?.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const hints = await l16.addHints(playerId, REWARD_HINTS);
//   res.json({ success: true, hints, added: REWARD_HINTS });
// }));

// /* ---------------------------------------------------------
//    GET /level16/status/:playerId
// --------------------------------------------------------- */

// r.get('/status/:playerId', handle(async (req, res) => {
//   const playerId = toId(req.params.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const row = await l16.getProgress(playerId);

//   res.json({
//     success: true,
//     level: l16.LEVEL,
//     completed: Boolean(row && row.is_completed),
//     score: row ? Number(row.score) || 0 : 0,
//     stars: row ? Number(row.stars) || 0 : 0,
//     attempts: row ? Number(row.attempts) || 0 : 0,
//     completedAt: row ? row.completed_at : null,
//   });
// }));

// module.exports = r;
const express = require('express');
const l16 = require('../data/level16Db');

const r = express.Router();

const SKIP_COST = 50;
const REWARD_HINTS = 75;

// the clue is free (no hints are spent)
const CLUE_TEXT = "Sometimes, the best excuse is the one that sounds too perfect. Look for something that doesn't add up.";

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
   POST /level16/hint      body: { sessionId, playerId }     FREE
   shows the clue directly, no hints are spent
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  console.log('NEW L16 HINT ROUTE');
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session, playerId } = ctx;

  await l16.markHintUsed(session.id);
  await l16.recordAction(session.id, 'hint', String(Number(session.hints_used) + 1), false);

  res.json({
    success: true,
    hints: await l16.getHints(playerId),
    hint: { text: CLUE_TEXT },
    hintsUsed: Number(session.hints_used) + 1,
    cost: 0,
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