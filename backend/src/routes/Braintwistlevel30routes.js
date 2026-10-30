// // const express = require('express');
// // const L30 = require('../data/level30Db');

// // const r = express.Router();

// // const LEVEL = L30.LEVEL;
// // const NEXT_LEVEL = LEVEL + 1;
// // const COST_HINT = 25;
// // const COST_SKIP = 50;
// // const REWARD_VIDEO = 75;

// // /* ---------------------------------------------------------
// //    LEVEL 30 SETTINGS  <-- change only this block for your puzzle
// // --------------------------------------------------------- */

// // const TITLE = 'Level 30 question goes here';      // text shown in the question pill
// // const ANSWERS = ['answer'];                       // every accepted answer (lower case, no spaces needed)
// // const CLUE_TEXT = 'Your clue text goes here.';    // text shown in the CLUES popup

// // /* --------------------------------------------------------- */

// // // "  Hello World " -> "helloworld"
// // const clean = (v) => String(v === undefined || v === null ? '' : v).toLowerCase().replace(/\s+/g, '');
// // const ACCEPTED = ANSWERS.map(clean);

// // // score from the number of tries
// // const grade = (attempts) => {
// //   if (attempts <= 1) return { score: 300, stars: 3 };
// //   if (attempts <= 3) return { score: 200, stars: 2 };
// //   return { score: 100, stars: 1 };
// // };

// // /* ---------------------------------------------------------
// //    HELPERS
// // --------------------------------------------------------- */

// // const handle = (fn) => async (req, res) => {
// //   try {
// //     await fn(req, res);
// //   } catch (err) {
// //     console.error('[BrainTwist L30 Error]', req.method, req.originalUrl, err);
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

// // // wait until the level 30 tables exist before any request runs
// // r.use(async (req, res, next) => {
// //   await L30.ready;
// //   next();
// // });

// // // shared checks for /answer /hint /skip -> returns the open session or sends the error
// // const openSession = async (req, res) => {
// //   const sessionId = toId(req.body && req.body.sessionId);
// //   const playerId = toId(req.body && req.body.playerId);

// //   if (!sessionId || !playerId) {
// //     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
// //     return null;
// //   }

// //   const session = await L30.getSession(sessionId, playerId);
// //   if (!session) {
// //     bad(res, 404, 'no_session', 'Session not found');
// //     return null;
// //   }
// //   if (session.status !== 'in_progress') {
// //     bad(res, 409, 'already_completed', 'This level is already completed');
// //     return null;
// //   }

// //   return { session, sessionId, playerId };
// // };

// // // unlock level 31 - a failure here must never break the answer
// // const tryUnlock = async (playerId, attempts) => {
// //   try {
// //     await L30.unlockNext(playerId, attempts);
// //   } catch (err) {
// //     console.error('[BrainTwist L30] could not unlock next level:', err.message);
// //   }
// // };

// // /* ---------------------------------------------------------
// //    POST /start   body: { playerId }
// // --------------------------------------------------------- */

// // r.post('/start', handle(async (req, res) => {
// //   const playerId = toId(req.body && req.body.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const player = await L30.getPlayer(playerId);
// //   if (!player) return bad(res, 404, 'no_player', 'Player not found');

// //   await L30.abandonActive(playerId);
// //   const session = await L30.createSession(playerId);

// //   res.json({
// //     success: true,
// //     sessionId: session.id,
// //     level: LEVEL,
// //     status: session.status,
// //     title: TITLE,
// //     hints: Number(player.hints) || 0,
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /answer   body: { sessionId, playerId, answer }
// //    right answer -> saved in the database, level 31 unlocked
// //    wrong answer -> correct:false (the try is saved too)
// // --------------------------------------------------------- */

// // r.post('/answer', handle(async (req, res) => {
// //   const ctx = await openSession(req, res);
// //   if (!ctx) return;
// //   const { sessionId, playerId } = ctx;

// //   const given = req.body && req.body.answer;
// //   if (given === undefined || given === null || String(given).trim() === '') {
// //     return bad(res, 400, 'answer_required', 'answer is required');
// //   }

// //   const correct = ACCEPTED.includes(clean(given));
// //   const attempts = await L30.addAttempt(sessionId);
// //   await L30.logAnswer(sessionId, playerId, given, correct);

// //   if (!correct) {
// //     return res.json({
// //       success: true,
// //       correct: false,
// //       message: 'Not quite. Try again!',
// //       attempts,
// //       hints: await L30.getHints(playerId),
// //     });
// //   }

// //   const { score, stars } = grade(attempts);
// //   await L30.completeSession(sessionId);

// //   let progressSaved = false;
// //   try {
// //     await L30.saveProgress(playerId, score, stars, attempts);
// //     progressSaved = true;
// //   } catch (err) {
// //     console.error('[BrainTwist L30] could not save progress:', err.message);
// //   }
// //   await tryUnlock(playerId, attempts);

// //   res.json({
// //     success: true,
// //     correct: true,
// //     completed: true,
// //     message: 'Correct! Well done!',
// //     score,
// //     stars,
// //     attempts,
// //     progressSaved,
// //     next: NEXT_LEVEL,
// //     hints: await L30.getHints(playerId),
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /hint   body: { sessionId, playerId }
// //    Search icon (magnifier):
// //    - frontend sends the request
// //    - backend saves it in the database (bt_level30_hint_log)
// //    - backend answers with JSON: clue text and hints left
// //    With 25+ hints: 25 are taken (charged: true).
// //    With fewer hints: the clue is still sent, free (charged: false).
// // --------------------------------------------------------- */

// // r.post('/hint', handle(async (req, res) => {
// //   const ctx = await openSession(req, res);
// //   if (!ctx) return;
// //   const { sessionId, playerId } = ctx;

// //   const paid = await L30.spendHints(playerId, COST_HINT);   // null = not enough hints
// //   const charged = paid !== null;
// //   const hints = charged ? paid : await L30.getHints(playerId);

// //   if (charged) await L30.markHintUsed(sessionId);
// //   await L30.logHint(sessionId, playerId, charged, hints);

// //   res.json({
// //     success: true,
// //     clue: CLUE_TEXT,
// //     hints,
// //     charged,
// //     cost: charged ? COST_HINT : 0,
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /skip   body: { sessionId, playerId }   (costs 50 hints)
// // --------------------------------------------------------- */

// // r.post('/skip', handle(async (req, res) => {
// //   const ctx = await openSession(req, res);
// //   if (!ctx) return;
// //   const { sessionId, playerId } = ctx;

// //   const hints = await L30.spendHints(playerId, COST_SKIP);
// //   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

// //   await L30.skipSession(sessionId);
// //   await tryUnlock(playerId, 0);

// //   res.json({
// //     success: true,
// //     completed: true,
// //     skipped: true,
// //     message: 'Level skipped!',
// //     score: 0,
// //     stars: 0,
// //     attempts: 1,
// //     next: NEXT_LEVEL,
// //     hints,
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
// // --------------------------------------------------------- */

// // r.post('/reward', handle(async (req, res) => {
// //   const playerId = toId(req.body && req.body.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
// //   if (!req.body || req.body.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

// //   const player = await L30.getPlayer(playerId);
// //   if (!player) return bad(res, 404, 'no_player', 'Player not found');

// //   const hints = await L30.addHints(playerId, REWARD_VIDEO);
// //   res.json({ success: true, added: REWARD_VIDEO, hints });
// // }));

// // /* ---------------------------------------------------------
// //    GET /status/:playerId
// // --------------------------------------------------------- */

// // r.get('/status/:playerId', handle(async (req, res) => {
// //   const playerId = toId(req.params.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const row = await L30.getProgress(playerId);

// //   res.json({
// //     success: true,
// //     level: LEVEL,
// //     completed: Boolean(row && row.is_completed),
// //     score: row ? Number(row.score) || 0 : 0,
// //     stars: row ? Number(row.stars) || 0 : 0,
// //     attempts: row ? Number(row.attempts) || 0 : 0,
// //     completedAt: row ? row.completed_at : null,
// //   });
// // }));

// // module.exports = r;
// const express = require('express');
// const L30 = require('../data/level30Db');

// const r = express.Router();

// const LEVEL = L30.LEVEL;
// const NEXT_LEVEL = LEVEL + 1;
// const COST_HINT = 25;
// const COST_SKIP = 50;
// const REWARD_VIDEO = 75;

// /* ---------------------------------------------------------
//    LEVEL 30 - translate the pictures into words
//    pictures (left to right): can, you, be, ready, at, five
//    the answer is the sentence: "Can you be ready at five?"
// --------------------------------------------------------- */

// const QUESTION = 'Translate the pictures into words';
// const PIECES = ['can', 'you', 'be', 'ready', 'at', 'five'];   // keys drawn by Btlevel30art.tsx
// const CLUE_TEXT = 'Say what each picture is, one by one, and join the words into a question.';

// // "Can you be ready at five?" -> "canyoubereadyatfive"
// const clean = (v) =>
//   String(v === undefined || v === null ? '' : v)
//     .toLowerCase()
//     .replace(/[^a-z0-9]/g, '');

// // accepted answers (already cleaned)
// const ACCEPTED = ['canyoubereadyatfive', 'canyoubereadyat5'];

// // score from the number of tries
// const grade = (attempts) => {
//   if (attempts <= 1) return { score: 300, stars: 3 };
//   if (attempts <= 3) return { score: 200, stars: 2 };
//   return { score: 100, stars: 1 };
// };

// /* ---------------------------------------------------------
//    HELPERS
// --------------------------------------------------------- */

// const handle = (fn) => async (req, res) => {
//   try {
//     await fn(req, res);
//   } catch (err) {
//     console.error('[BrainTwist L30 Error]', req.method, req.originalUrl, err);
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

// // wait until the level 30 tables exist before any request runs
// r.use(async (req, res, next) => {
//   await L30.ready;
//   next();
// });

// // unlock level 31 - a failure here must never break the answer
// const tryUnlock = async (playerId, attempts) => {
//   try {
//     await L30.unlockNext(playerId, attempts);
//   } catch (err) {
//     console.error('[BrainTwist L30] could not unlock next level:', err.message);
//   }
// };

// const progressOf = (st) => ({
//   attempts: st ? Number(st.attempts) || 0 : 0,
//   solved: Boolean(st && st.solved),
//   skipped: Boolean(st && st.skipped),
//   hintsUsed: st ? Number(st.hints_used) || 0 : 0,
// });

// /* ---------------------------------------------------------
//    POST /start   body: { playerId }
//    every time the level is opened: a fresh game
// --------------------------------------------------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const player = await L30.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   const state = await L30.resetState(playerId);

//   res.json({
//     success: true,
//     level: LEVEL,
//     question: QUESTION,
//     pieces: PIECES,
//     hintCost: COST_HINT,
//     skipCost: COST_SKIP,
//     videoReward: REWARD_VIDEO,
//     hints: Number(player.hints) || 0,
//     progress: progressOf(state),
//   });
// }));

// /* ---------------------------------------------------------
//    POST /answer   body: { playerId, answer }
//    right answer -> saved in the database, level 31 unlocked
//    wrong answer -> correct:false (the try is saved too)
// --------------------------------------------------------- */

// r.post('/answer', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const given = req.body && req.body.answer;
//   if (given === undefined || given === null || String(given).trim() === '') {
//     return bad(res, 400, 'answer_required', 'answer is required');
//   }

//   const player = await L30.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   await L30.ensureState(playerId);

//   const correct = ACCEPTED.includes(clean(given));
//   const attempts = await L30.addAttempt(playerId);
//   await L30.logAnswer(playerId, given, correct);

//   if (!correct) {
//     return res.json({
//       success: true,
//       correct: false,
//       attempts,
//       message: 'Not quite. Try again!',
//     });
//   }

//   const { score, stars } = grade(attempts);
//   await L30.markSolved(playerId);

//   try {
//     await L30.saveProgress(playerId, score, stars, attempts);
//   } catch (err) {
//     console.error('[BrainTwist L30] could not save progress:', err.message);
//   }
//   await tryUnlock(playerId, attempts);

//   res.json({
//     success: true,
//     correct: true,
//     attempts,
//     answer: 'Can you be ready at five?',
//     message: 'Correct! Well done!',
//     score,
//     stars,
//     next: NEXT_LEVEL,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /hint   body: { playerId }   (costs 25 hints)
//    the clue is saved in the database and sent back as JSON
// --------------------------------------------------------- */

// r.post('/hint', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const player = await L30.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   await L30.ensureState(playerId);

//   const hints = await L30.spendHints(playerId, COST_HINT);
//   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

//   await L30.markHintUsed(playerId);
//   await L30.logHint(playerId, hints);

//   res.json({ success: true, hints, hint: { text: CLUE_TEXT } });
// }));

// /* ---------------------------------------------------------
//    POST /skip   body: { playerId }   (costs 50 hints)
// --------------------------------------------------------- */

// r.post('/skip', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const player = await L30.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   const state = await L30.ensureState(playerId);

//   const hints = await L30.spendHints(playerId, COST_SKIP);
//   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

//   await L30.markSkipped(playerId);
//   const attempts = Math.max(1, Number(state.attempts) || 0);
//   await tryUnlock(playerId, attempts);

//   res.json({ success: true, hints, skipped: true, attempts });
// }));

// /* ---------------------------------------------------------
//    POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
// --------------------------------------------------------- */

// r.post('/reward', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
//   if (!req.body || req.body.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

//   const player = await L30.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   const hints = await L30.addHints(playerId, REWARD_VIDEO);
//   res.json({ success: true, hints, added: REWARD_VIDEO });
// }));

// /* ---------------------------------------------------------
//    GET /status/:playerId
// --------------------------------------------------------- */

// r.get('/status/:playerId', handle(async (req, res) => {
//   const playerId = toId(req.params.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const row = await L30.getProgress(playerId);

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
const express = require('express');
const L30 = require('../data/level30Db');

const r = express.Router();

const LEVEL = L30.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_HINT = 25;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;

/* ---------------------------------------------------------
   LEVEL 30 - translate the pictures into words
   pictures (left to right): can, you, be, ready, at, five
   the answer is the sentence: "Can you be ready at five?"
--------------------------------------------------------- */

const QUESTION = 'Can you translate this into words?';
const PIECES = ['can', 'you', 'be', 'ready', 'at', 'five'];   // keys drawn by Btlevel30art.tsx
const CLUE_TEXT = 'Say what each picture is, one by one, and join the words into a question.';

// "Can you be ready at five?" -> "canyoubereadyatfive"
const clean = (v) =>
  String(v === undefined || v === null ? '' : v)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

// accepted answers (already cleaned)
const ACCEPTED = ['canyoubereadyatfive', 'canyoubereadyat5'];

// score from the number of tries
const grade = (attempts) => {
  if (attempts <= 1) return { score: 300, stars: 3 };
  if (attempts <= 3) return { score: 200, stars: 2 };
  return { score: 100, stars: 1 };
};

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L30 Error]', req.method, req.originalUrl, err);
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

// wait until the level 30 tables exist before any request runs
r.use(async (req, res, next) => {
  await L30.ready;
  next();
});

// unlock level 31 - a failure here must never break the answer
const tryUnlock = async (playerId, attempts) => {
  try {
    await L30.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L30] could not unlock next level:', err.message);
  }
};

const progressOf = (st) => ({
  attempts: st ? Number(st.attempts) || 0 : 0,
  solved: Boolean(st && st.solved),
  skipped: Boolean(st && st.skipped),
  hintsUsed: st ? Number(st.hints_used) || 0 : 0,
});

/* ---------------------------------------------------------
   POST /start   body: { playerId }
   every time the level is opened: a fresh game
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L30.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const state = await L30.resetState(playerId);

  res.json({
    success: true,
    level: LEVEL,
    question: QUESTION,
    pieces: PIECES,
    hintCost: COST_HINT,
    skipCost: COST_SKIP,
    videoReward: REWARD_VIDEO,
    hints: Number(player.hints) || 0,
    progress: progressOf(state),
  });
}));

/* ---------------------------------------------------------
   POST /answer   body: { playerId, answer }
   right answer -> saved in the database, level 31 unlocked
   wrong answer -> correct:false (the try is saved too)
--------------------------------------------------------- */

r.post('/answer', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const given = req.body && req.body.answer;
  if (given === undefined || given === null || String(given).trim() === '') {
    return bad(res, 400, 'answer_required', 'answer is required');
  }

  const player = await L30.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L30.ensureState(playerId);

  const correct = ACCEPTED.includes(clean(given));
  const attempts = await L30.addAttempt(playerId);
  await L30.logAnswer(playerId, given, correct);

  if (!correct) {
    return res.json({
      success: true,
      correct: false,
      attempts,
      message: 'Not quite. Try again!',
    });
  }

  const { score, stars } = grade(attempts);
  await L30.markSolved(playerId);

  try {
    await L30.saveProgress(playerId, score, stars, attempts);
  } catch (err) {
    console.error('[BrainTwist L30] could not save progress:', err.message);
  }
  await tryUnlock(playerId, attempts);

  res.json({
    success: true,
    correct: true,
    attempts,
    answer: 'Can you be ready at five?',
    message: 'Correct! Well done!',
    score,
    stars,
    next: NEXT_LEVEL,
  });
}));

/* ---------------------------------------------------------
   POST /hint   body: { playerId }   (costs 25 hints)
   the clue is saved in the database and sent back as JSON
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L30.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L30.ensureState(playerId);

  const hints = await L30.spendHints(playerId, COST_HINT);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L30.markHintUsed(playerId);
  await L30.logHint(playerId, hints);

  res.json({ success: true, hints, hint: { text: CLUE_TEXT } });
}));

/* ---------------------------------------------------------
   POST /skip   body: { playerId }   (costs 50 hints)
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L30.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const state = await L30.ensureState(playerId);

  const hints = await L30.spendHints(playerId, COST_SKIP);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L30.markSkipped(playerId);
  const attempts = Math.max(1, Number(state.attempts) || 0);
  await tryUnlock(playerId, attempts);

  res.json({ success: true, hints, skipped: true, attempts });
}));

/* ---------------------------------------------------------
   POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
--------------------------------------------------------- */

r.post('/reward', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
  if (!req.body || req.body.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

  const player = await L30.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const hints = await L30.addHints(playerId, REWARD_VIDEO);
  res.json({ success: true, hints, added: REWARD_VIDEO });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await L30.getProgress(playerId);

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