// // const express = require('express');
// // const L17 = require('../data/level17Db');

// // const r = express.Router();

// // const LEVEL = L17.LEVEL;
// // const NEXT_LEVEL = LEVEL + 1;
// // const COST_HINT = 25;
// // const COST_SKIP = 50;
// // const REWARD_VIDEO = 75;



// // const TITLE = 'What is the hidden number?';
// // const SEQUENCE = { before: [5, 15, 25], after: [100] };
// // const ANSWER = 80;
// // const HINT_TEXT = 'Move the circle and look under it!';

// // const grade = (attempts) => {
// //   if (attempts <= 1) return { score: 300, stars: 3 };
// //   if (attempts <= 3) return { score: 200, stars: 2 };
// //   return { score: 100, stars: 1 };
// // };


// // const handle = (fn) => async (req, res) => {
// //   try {
// //     await fn(req, res);
// //   } catch (err) {
// //     console.error('[BrainTwist L17 Error]', req.method, req.originalUrl, err);
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

// // r.use(async (req, res, next) => {
// //   await L17.ready;
// //   next();
// // });

// // const openSession = async (req, res) => {
// //   const sessionId = toId(req.body && req.body.sessionId);
// //   const playerId = toId(req.body && req.body.playerId);

// //   if (!sessionId || !playerId) {
// //     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
// //     return null;
// //   }

// //   const session = await L17.getSession(sessionId, playerId);
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

// // const tryUnlock = async (playerId, attempts) => {
// //   try {
// //     await L17.unlockNext(playerId, attempts);
// //   } catch (err) {
// //     console.error('[BrainTwist L17] could not unlock next level:', err.message);
// //   }
// // };

// // /* ---------------------------------------------------------
// //    POST /start   body: { playerId }
// // --------------------------------------------------------- */

// // r.post('/start', handle(async (req, res) => {
// //   const playerId = toId(req.body && req.body.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const player = await L17.getPlayer(playerId);
// //   if (!player) return bad(res, 404, 'no_player', 'Player not found');

// //   await L17.abandonActive(playerId);
// //   const session = await L17.createSession(playerId);

// //   res.json({
// //     success: true,
// //     sessionId: session.id,
// //     level: LEVEL,
// //     status: session.status,
// //     title: TITLE,
// //     sequence: SEQUENCE,
// //     hints: Number(player.hints) || 0,
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /reveal   body: { sessionId, playerId }
// //    the player moved the circle -> server shows the hidden number
// // --------------------------------------------------------- */

// // r.post('/reveal', handle(async (req, res) => {
// //   const ctx = await openSession(req, res);
// //   if (!ctx) return;

// //   await L17.markRevealed(ctx.sessionId);
// //   res.json({ success: true, value: ANSWER });
// // }));

// // /* ---------------------------------------------------------
// //    POST /answer   body: { sessionId, playerId, answer }
// // --------------------------------------------------------- */

// // r.post('/answer', handle(async (req, res) => {
// //   const answer = Number(req.body && req.body.answer);
// //   if (!Number.isInteger(answer) || answer < 0 || answer > 9999) {
// //     return bad(res, 400, 'bad_answer', 'Send a whole number');
// //   }

// //   const ctx = await openSession(req, res);
// //   if (!ctx) return;
// //   const { session, sessionId, playerId } = ctx;

// //   const correct = answer === ANSWER;
// //   await L17.recordAnswer(sessionId, answer, correct);

// //   if (!correct) {
// //     return res.json({
// //       success: true,
// //       correct: false,
// //       completed: false,
// //       message: 'Not quite. Try again!',
// //     });
// //   }

// //   const attempts = (await L17.countWrong(sessionId)) + 1;
// //   const seconds = Number(session.elapsed) || 0;
// //   const { score, stars } = grade(attempts);

// //   await L17.completeSession(sessionId, attempts, seconds);

// //   let progressSaved = false;
// //   try {
// //     await L17.saveProgress(playerId, score, stars, attempts);
// //     progressSaved = true;
// //   } catch (err) {
// //     console.error('[BrainTwist L17] could not save progress:', err.message);
// //   }
// //   await tryUnlock(playerId, attempts);

// //   res.json({
// //     success: true,
// //     correct: true,
// //     completed: true,
// //     message: 'Correct! The hidden number is 80.',
// //     score,
// //     stars,
// //     attempts,
// //     seconds,
// //     progressSaved,
// //     next: NEXT_LEVEL,
// //     hints: await L17.getHints(playerId),
// //   });
// // }));

// // /* ---------------------------------------------------------
// //    POST /hint   body: { sessionId, playerId }   (costs 25 hints)
// // --------------------------------------------------------- */

// // r.post('/hint', handle(async (req, res) => {
// //   const ctx = await openSession(req, res);
// //   if (!ctx) return;
// //   const { sessionId, playerId } = ctx;

// //   const hints = await L17.spendHints(playerId, COST_HINT);
// //   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

// //   await L17.markHintUsed(sessionId);

// //   res.json({ success: true, text: HINT_TEXT, hints, cost: COST_HINT });
// // }));



// // r.post('/skip', handle(async (req, res) => {
// //   const ctx = await openSession(req, res);
// //   if (!ctx) return;
// //   const { sessionId, playerId } = ctx;

// //   const hints = await L17.spendHints(playerId, COST_SKIP);
// //   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

// //   await L17.skipSession(sessionId);
// //   await tryUnlock(playerId, 0);

// //   res.json({
// //     success: true,
// //     correct: true,
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

// //   const player = await L17.getPlayer(playerId);
// //   if (!player) return bad(res, 404, 'no_player', 'Player not found');

// //   const hints = await L17.addHints(playerId, REWARD_VIDEO);
// //   res.json({ success: true, added: REWARD_VIDEO, hints });
// // }));

// // /* ---------------------------------------------------------
// //    GET /status/:playerId
// // --------------------------------------------------------- */

// // r.get('/status/:playerId', handle(async (req, res) => {
// //   const playerId = toId(req.params.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   const row = await L17.getProgress(playerId);

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
// const L17 = require('../data/level17Db');

// const r = express.Router();

// const LEVEL = L17.LEVEL;
// const NEXT_LEVEL = LEVEL + 1;
// const COST_SKIP = 50;
// const REWARD_VIDEO = 75;

// const TITLE = 'What is the hidden number?';
// const SEQUENCE = { before: [5, 15, 25], after: [100] };
// const ANSWER = 80;

// // the clue is free (no hints are spent)
// const HINT_TEXT = 'Not every number wants to be seen. Sometimes, the answer is hiding in plain sight!';

// const grade = (attempts) => {
//   if (attempts <= 1) return { score: 300, stars: 3 };
//   if (attempts <= 3) return { score: 200, stars: 2 };
//   return { score: 100, stars: 1 };
// };


// const handle = (fn) => async (req, res) => {
//   try {
//     await fn(req, res);
//   } catch (err) {
//     console.error('[BrainTwist L17 Error]', req.method, req.originalUrl, err);
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

// r.use(async (req, res, next) => {
//   await L17.ready;
//   next();
// });

// const openSession = async (req, res) => {
//   const sessionId = toId(req.body && req.body.sessionId);
//   const playerId = toId(req.body && req.body.playerId);

//   if (!sessionId || !playerId) {
//     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
//     return null;
//   }

//   const session = await L17.getSession(sessionId, playerId);
//   if (!session) {
//     bad(res, 404, 'no_session', 'Session not found');
//     return null;
//   }
//   if (session.status !== 'in_progress') {
//     bad(res, 409, 'already_completed', 'This level is already completed');
//     return null;
//   }

//   return { session, sessionId, playerId };
// };

// const tryUnlock = async (playerId, attempts) => {
//   try {
//     await L17.unlockNext(playerId, attempts);
//   } catch (err) {
//     console.error('[BrainTwist L17] could not unlock next level:', err.message);
//   }
// };

// /* ---------------------------------------------------------
//    POST /start   body: { playerId }
// --------------------------------------------------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const player = await L17.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   await L17.abandonActive(playerId);
//   const session = await L17.createSession(playerId);

//   res.json({
//     success: true,
//     sessionId: session.id,
//     level: LEVEL,
//     status: session.status,
//     title: TITLE,
//     sequence: SEQUENCE,
//     hints: Number(player.hints) || 0,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /reveal   body: { sessionId, playerId }
//    the player moved the circle -> server shows the hidden number
// --------------------------------------------------------- */

// r.post('/reveal', handle(async (req, res) => {
//   const ctx = await openSession(req, res);
//   if (!ctx) return;

//   await L17.markRevealed(ctx.sessionId);
//   res.json({ success: true, value: ANSWER });
// }));

// /* ---------------------------------------------------------
//    POST /answer   body: { sessionId, playerId, answer }
// --------------------------------------------------------- */

// r.post('/answer', handle(async (req, res) => {
//   const answer = Number(req.body && req.body.answer);
//   if (!Number.isInteger(answer) || answer < 0 || answer > 9999) {
//     return bad(res, 400, 'bad_answer', 'Send a whole number');
//   }

//   const ctx = await openSession(req, res);
//   if (!ctx) return;
//   const { session, sessionId, playerId } = ctx;

//   const correct = answer === ANSWER;
//   await L17.recordAnswer(sessionId, answer, correct);

//   if (!correct) {
//     return res.json({
//       success: true,
//       correct: false,
//       completed: false,
//       message: 'Not quite. Try again!',
//     });
//   }

//   const attempts = (await L17.countWrong(sessionId)) + 1;
//   const seconds = Number(session.elapsed) || 0;
//   const { score, stars } = grade(attempts);

//   await L17.completeSession(sessionId, attempts, seconds);

//   let progressSaved = false;
//   try {
//     await L17.saveProgress(playerId, score, stars, attempts);
//     progressSaved = true;
//   } catch (err) {
//     console.error('[BrainTwist L17] could not save progress:', err.message);
//   }
//   await tryUnlock(playerId, attempts);

//   res.json({
//     success: true,
//     correct: true,
//     completed: true,
//     message: 'Correct! The hidden number is 80.',
//     score,
//     stars,
//     attempts,
//     seconds,
//     progressSaved,
//     next: NEXT_LEVEL,
//     hints: await L17.getHints(playerId),
//   });
// }));

// /* ---------------------------------------------------------
//    POST /hint   body: { sessionId, playerId }   FREE
//    shows the clue directly, no hints are spent
// --------------------------------------------------------- */

// r.post('/hint', handle(async (req, res) => {
//   console.log('NEW L17 HINT ROUTE');
//   const ctx = await openSession(req, res);
//   if (!ctx) return;
//   const { sessionId, playerId } = ctx;

//   await L17.markHintUsed(sessionId);

//   res.json({
//     success: true,
//     text: HINT_TEXT,
//     hints: await L17.getHints(playerId),
//     cost: 0,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /skip   body: { sessionId, playerId }   (costs 50 hints)
// --------------------------------------------------------- */

// r.post('/skip', handle(async (req, res) => {
//   const ctx = await openSession(req, res);
//   if (!ctx) return;
//   const { sessionId, playerId } = ctx;

//   const hints = await L17.spendHints(playerId, COST_SKIP);
//   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

//   await L17.skipSession(sessionId);
//   await tryUnlock(playerId, 0);

//   res.json({
//     success: true,
//     correct: true,
//     completed: true,
//     skipped: true,
//     message: 'Level skipped!',
//     score: 0,
//     stars: 0,
//     attempts: 1,
//     next: NEXT_LEVEL,
//     hints,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
// --------------------------------------------------------- */

// r.post('/reward', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
//   if (!req.body || req.body.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

//   const player = await L17.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   const hints = await L17.addHints(playerId, REWARD_VIDEO);
//   res.json({ success: true, added: REWARD_VIDEO, hints });
// }));

// /* ---------------------------------------------------------
//    GET /status/:playerId
// --------------------------------------------------------- */

// r.get('/status/:playerId', handle(async (req, res) => {
//   const playerId = toId(req.params.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const row = await L17.getProgress(playerId);

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
const L17 = require('../data/level17Db');

const r = express.Router();

const LEVEL = L17.LEVEL;
const NEXT_LEVEL = LEVEL + 1;
const COST_SKIP = 50;
const REWARD_VIDEO = 75;

const TITLE = 'What is the hidden number?';
const SEQUENCE = { before: [5, 15, 25], after: [100] };
const ANSWER = 80;

// the clue is free (no hints are spent)
const HINT_TEXT = 'Not every number wants to be seen. Sometimes, the answer is hiding in plain sight!';

const grade = (attempts) => {
  if (attempts <= 1) return { score: 300, stars: 3 };
  if (attempts <= 3) return { score: 200, stars: 2 };
  return { score: 100, stars: 1 };
};


const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L17 Error]', req.method, req.originalUrl, err);
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

r.use(async (req, res, next) => {
  await L17.ready;
  next();
});

const openSession = async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await L17.getSession(sessionId, playerId);
  if (!session) {
    bad(res, 404, 'no_session', 'Session not found');
    return null;
  }
  if (session.status !== 'in_progress') {
    bad(res, 409, 'already_completed', 'This level is already completed');
    return null;
  }

  return { session, sessionId, playerId };
};

const tryUnlock = async (playerId, attempts) => {
  try {
    await L17.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L17] could not unlock next level:', err.message);
  }
};

/* ---------------------------------------------------------
   POST /start   body: { playerId }
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await L17.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  await L17.abandonActive(playerId);
  const session = await L17.createSession(playerId);

  res.json({
    success: true,
    sessionId: session.id,
    level: LEVEL,
    status: session.status,
    title: TITLE,
    sequence: SEQUENCE,
    hints: Number(player.hints) || 0,
  });
}));

/* ---------------------------------------------------------
   POST /reveal   body: { sessionId, playerId }
   the player moved the circle -> server shows the hidden number
--------------------------------------------------------- */

r.post('/reveal', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;

  await L17.markRevealed(ctx.sessionId);
  res.json({ success: true, value: ANSWER });
}));

/* ---------------------------------------------------------
   POST /answer   body: { sessionId, playerId, answer }
--------------------------------------------------------- */

r.post('/answer', handle(async (req, res) => {
  const answer = Number(req.body && req.body.answer);
  if (!Number.isInteger(answer) || answer < 0 || answer > 9999) {
    return bad(res, 400, 'bad_answer', 'Send a whole number');
  }

  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { session, sessionId, playerId } = ctx;

  const correct = answer === ANSWER;
  await L17.recordAnswer(sessionId, answer, correct);

  if (!correct) {
    return res.json({
      success: true,
      correct: false,
      completed: false,
      message: 'Not quite. Try again!',
    });
  }

  const attempts = (await L17.countWrong(sessionId)) + 1;
  const seconds = Number(session.elapsed) || 0;
  const { score, stars } = grade(attempts);

  await L17.completeSession(sessionId, attempts, seconds);

  let progressSaved = false;
  try {
    await L17.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L17] could not save progress:', err.message);
  }
  await tryUnlock(playerId, attempts);

  res.json({
    success: true,
    correct: true,
    completed: true,
    message: 'Correct! The hidden number is 80.',
    score,
    stars,
    attempts,
    seconds,
    progressSaved,
    next: NEXT_LEVEL,
    hints: await L17.getHints(playerId),
  });
}));

/* ---------------------------------------------------------
   POST /clue   (also answers on /hint)   body: { sessionId, playerId }   FREE
   shows the clue directly, no hints are spent
--------------------------------------------------------- */

const clueHandler = handle(async (req, res) => {
  console.log('NEW L17 CLUE ROUTE', req.originalUrl);
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { sessionId, playerId } = ctx;

  await L17.markHintUsed(sessionId);

  res.json({
    success: true,
    text: HINT_TEXT,
    hints: await L17.getHints(playerId),
    cost: 0,
  });
});

r.post('/clue', clueHandler);
r.post('/hint', clueHandler);

/* ---------------------------------------------------------
   POST /skip   body: { sessionId, playerId }   (costs 50 hints)
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const ctx = await openSession(req, res);
  if (!ctx) return;
  const { sessionId, playerId } = ctx;

  const hints = await L17.spendHints(playerId, COST_SKIP);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  await L17.skipSession(sessionId);
  await tryUnlock(playerId, 0);

  res.json({
    success: true,
    correct: true,
    completed: true,
    skipped: true,
    message: 'Level skipped!',
    score: 0,
    stars: 0,
    attempts: 1,
    next: NEXT_LEVEL,
    hints,
  });
}));

/* ---------------------------------------------------------
   POST /reward   body: { playerId, kind: 'video' }   (+75 hints)
--------------------------------------------------------- */

r.post('/reward', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
  if (!req.body || req.body.kind !== 'video') return bad(res, 400, 'bad_kind', 'Unknown reward');

  const player = await L17.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  const hints = await L17.addHints(playerId, REWARD_VIDEO);
  res.json({ success: true, added: REWARD_VIDEO, hints });
}));

/* ---------------------------------------------------------
   GET /status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await L17.getProgress(playerId);

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