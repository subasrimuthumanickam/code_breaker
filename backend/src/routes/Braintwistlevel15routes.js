
// const express = require('express');
// const l15 = require('../data/level15Db');

// const r = express.Router();

// const HINT_COST = 25;
// const SKIP_COST = 50;
// const REWARD_HINTS = 75;

// /* ---------- WHAT THE PLAYER CAN TAP (decoys) ---------- */

// const TAP_MESSAGES = {
//   books: 'Just some books. Nothing inside.',
//   desk: 'An ordinary desk.',
//   window: 'Nice view, but no code here.',
//   picture: 'A sunny picture.',
//   plant: 'A happy plant.',
//   shelf: 'Only books on the shelf.',
// };

// /* ---------- HELPERS ---------- */

// const handle = (fn) => async (req, res) => {
//   try {
//     await fn(req, res);
//   } catch (err) {
//     console.error('[BrainTwist L15 Error]', req.method, req.originalUrl, err);
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

// // what the frontend may see. The code is sent ONLY after the vault was moved.
// const sessionView = (session, hints) => ({
//   success: true,
//   sessionId: session.id,
//   level: l15.LEVEL,
//   status: session.status,
//   vaultMoved: Boolean(session.vault_moved),
//   code: session.vault_moved ? session.code : null,
//   codeLength: l15.CODE_LENGTH,
//   wrongAttempts: Number(session.wrong_attempts),
//   hints,
// });

// // reads ids from body, loads the session, answers the error itself when something is wrong
// const loadSession = async (req, res, { allowFinished = false } = {}) => {
//   const sessionId = toId(req.body?.sessionId);
//   const playerId = toId(req.body?.playerId);

//   if (!sessionId || !playerId) {
//     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
//     return null;
//   }

//   const session = await l15.getSession(sessionId, playerId);
//   if (!session) {
//     bad(res, 404, 'no_session', 'Session not found');
//     return null;
//   }

//   if (!allowFinished && session.status !== 'in_progress') {
//     bad(res, 409, 'already_finished', 'This level is already finished');
//     return null;
//   }

//   return { session, playerId };
// };

// r.use(async (req, res, next) => {
//   await l15.ready;
//   next();
// });

// /* ---------------------------------------------------------
//    POST /level15/start     body: { playerId }
// --------------------------------------------------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body?.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const player = await l15.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   // continue an unfinished game, otherwise start a new one with a new password
//   let session = await l15.getActiveSession(playerId);

//   // an old unfinished game with a repeated-digit code is replaced (the dots need 4 different digits)
//   if (session && new Set(String(session.code).split('')).size !== String(session.code).length) {
//     await l15.abandonSession(session.id);
//     session = null;
//   }
//   if (!session) session = await l15.createSession(playerId);

//   // opening the level again: the vault is back in its place and the paper is hidden
//   if (session.vault_moved) {
//     await l15.resetVault(session.id);
//     session.vault_moved = 0;
//   }

//   res.json({
//     ...sessionView(session, Number(player.hints) || 0),
//     title: 'We must open this vault.',
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level15/move      body: { sessionId, playerId }
//    the player pushed the vault aside -> the paper behind it is shown
// --------------------------------------------------------- */

// r.post('/move', handle(async (req, res) => {
//   const ctx = await loadSession(req, res);
//   if (!ctx) return;
//   const { session, playerId } = ctx;

//   if (!session.vault_moved) {
//     await l15.markVaultMoved(session.id);
//     await l15.recordAction(session.id, 'move', 'vault', true);
//     session.vault_moved = 1;
//   }

//   res.json({
//     ...sessionView(session, await l15.getHints(playerId)),
//     message: 'A paper was hidden behind the vault!',
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level15/tap       body: { sessionId, playerId, target }
//    wrong places (books, desk ...) are saved too
// --------------------------------------------------------- */

// r.post('/tap', handle(async (req, res) => {
//   const ctx = await loadSession(req, res);
//   if (!ctx) return;
//   const { session } = ctx;

//   const target = String(req.body?.target || '').toLowerCase().replace(/[^a-z]/g, '').slice(0, 20);
//   if (!TAP_MESSAGES[target]) return bad(res, 400, 'bad_target', 'Unknown target');

//   await l15.recordAction(session.id, 'tap', target, false);
//   await l15.addTap(session.id);

//   res.json({ success: true, correct: false, message: TAP_MESSAGES[target] });
// }));

// /* ---------------------------------------------------------
//    POST /level15/enter     body: { sessionId, playerId, code }
// --------------------------------------------------------- */

// r.post('/enter', handle(async (req, res) => {
//   const ctx = await loadSession(req, res);
//   if (!ctx) return;
//   const { session, playerId } = ctx;

//   const code = String(req.body?.code || '').replace(/[^0-9]/g, '').slice(0, 8);
//   if (code.length !== l15.CODE_LENGTH) {
//     return bad(res, 400, 'invalid_code', `Code must have ${l15.CODE_LENGTH} digits`);
//   }

//   const wrongBefore = Number(session.wrong_attempts);
//   const attemptsBefore = Number(session.total_attempts);
//   // the paper shows only dots (no order), so the 4 digits are accepted in any order
//   const sortDigits = (c) => String(c).split('').sort().join('');
//   const correct = sortDigits(code) === sortDigits(session.code);

//   await l15.recordAction(session.id, 'code', code, correct);
//   await l15.addAttempt(session.id, !correct);

//   if (!correct) {
//     return res.json({
//       success: true,
//       correct: false,
//       completed: false,
//       wrongAttempts: wrongBefore + 1,
//       message: session.vault_moved
//         ? 'Wrong code. Check the paper again.'
//         : 'Wrong code. Look around, the code is hidden somewhere.',
//     });
//   }

//   // correct -> score, stars, save progress, unlock level 16
//   const attempts = attemptsBefore + 1;
//   const score = Math.max(100, 300 - wrongBefore * 50);
//   const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

//   await l15.completeSession(session.id, Number(session.elapsed) || 0);

//   let progressSaved = false;
//   try {
//     await l15.saveProgress(playerId, score, stars, attempts);
//     progressSaved = true;
//   } catch (err) {
//     console.error('[BrainTwist L15] could not save progress:', err.message);
//   }

//   try {
//     await l15.unlockNext(playerId, attempts);
//   } catch (err) {
//     console.error('[BrainTwist L15] could not unlock next level:', err.message);
//   }

//   res.json({
//     success: true,
//     correct: true,
//     completed: true,
//     message: 'The vault is open!',
//     score,
//     stars,
//     attempts,
//     seconds: Number(session.elapsed) || 0,
//     progressSaved,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level15/hint      body: { sessionId, playerId }     costs 25 hints
// --------------------------------------------------------- */

// r.post('/hint', handle(async (req, res) => {
//   const ctx = await loadSession(req, res);
//   if (!ctx) return;
//   const { session, playerId } = ctx;

//   const left = await l15.spendHints(playerId, HINT_COST);
//   if (left === null) {
//     return bad(res, 402, 'not_enough_hints', `You need ${HINT_COST} hints`);
//   }

//   await l15.markHintUsed(session.id);
//   await l15.recordAction(session.id, 'hint', '', false);

//   res.json({
//     success: true,
//     hints: left,
//     message: session.vault_moved
//       ? 'Type the numbers from the paper on the keypad.'
//       : 'Something is hidden behind the vault. Try to move it.',
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level15/skip      body: { sessionId, playerId }     costs 50 hints
// --------------------------------------------------------- */

// r.post('/skip', handle(async (req, res) => {
//   const ctx = await loadSession(req, res);
//   if (!ctx) return;
//   const { session, playerId } = ctx;

//   const left = await l15.spendHints(playerId, SKIP_COST);
//   if (left === null) {
//     return bad(res, 402, 'not_enough_hints', `You need ${SKIP_COST} hints`);
//   }

//   await l15.skipSession(session.id, Number(session.elapsed) || 0);
//   await l15.recordAction(session.id, 'skip', '', false);
//   await l15.unlockNext(playerId, Number(session.total_attempts) || 0);

//   res.json({ success: true, skipped: true, hints: left, message: 'Level skipped' });
// }));

// /* ---------------------------------------------------------
//    POST /level15/reward    body: { playerId }      video reward +75 hints
// --------------------------------------------------------- */

// r.post('/reward', handle(async (req, res) => {
//   const playerId = toId(req.body?.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const hints = await l15.addHints(playerId, REWARD_HINTS);
//   res.json({ success: true, hints, added: REWARD_HINTS });
// }));

// /* ---------------------------------------------------------
//    GET /level15/status/:playerId
// --------------------------------------------------------- */

// r.get('/status/:playerId', handle(async (req, res) => {
//   const playerId = toId(req.params.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const row = await l15.getProgress(playerId);

//   res.json({
//     success: true,
//     level: l15.LEVEL,
//     completed: Boolean(row && row.is_completed),
//     score: row ? Number(row.score) || 0 : 0,
//     stars: row ? Number(row.stars) || 0 : 0,
//     attempts: row ? Number(row.attempts) || 0 : 0,
//     completedAt: row ? row.completed_at : null,
//   });
// }));

// module.exports = r;
const express = require('express');
const l15 = require('../data/level15Db');

const r = express.Router();

const SKIP_COST = 50;
const REWARD_HINTS = 75;

// the clue is free (no hints are spent)
const CLUE_TEXT = "The secret isn't always in front of you. Sometimes, you need to look at the other side!";

/* ---------- WHAT THE PLAYER CAN TAP (decoys) ---------- */

const TAP_MESSAGES = {
  books: 'Just some books. Nothing inside.',
  desk: 'An ordinary desk.',
  window: 'Nice view, but no code here.',
  picture: 'A sunny picture.',
  plant: 'A happy plant.',
  shelf: 'Only books on the shelf.',
};

/* ---------- HELPERS ---------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L15 Error]', req.method, req.originalUrl, err);
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

// what the frontend may see. The code is sent ONLY after the vault was moved.
const sessionView = (session, hints) => ({
  success: true,
  sessionId: session.id,
  level: l15.LEVEL,
  status: session.status,
  vaultMoved: Boolean(session.vault_moved),
  code: session.vault_moved ? session.code : null,
  codeLength: l15.CODE_LENGTH,
  wrongAttempts: Number(session.wrong_attempts),
  hints,
});

// reads ids from body, loads the session, answers the error itself when something is wrong
const loadSession = async (req, res, { allowFinished = false } = {}) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await l15.getSession(sessionId, playerId);
  if (!session) {
    bad(res, 404, 'no_session', 'Session not found');
    return null;
  }

  if (!allowFinished && session.status !== 'in_progress') {
    bad(res, 409, 'already_finished', 'This level is already finished');
    return null;
  }

  return { session, playerId };
};

r.use(async (req, res, next) => {
  await l15.ready;
  next();
});

/* ---------------------------------------------------------
   POST /level15/start     body: { playerId }
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await l15.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  // continue an unfinished game, otherwise start a new one with a new password
  let session = await l15.getActiveSession(playerId);

  // an old unfinished game with a repeated-digit code is replaced (the dots need 4 different digits)
  if (session && new Set(String(session.code).split('')).size !== String(session.code).length) {
    await l15.abandonSession(session.id);
    session = null;
  }
  if (!session) session = await l15.createSession(playerId);

  // opening the level again: the vault is back in its place and the paper is hidden
  if (session.vault_moved) {
    await l15.resetVault(session.id);
    session.vault_moved = 0;
  }

  res.json({
    ...sessionView(session, Number(player.hints) || 0),
    title: 'We must open this vault.',
  });
}));

/* ---------------------------------------------------------
   POST /level15/move      body: { sessionId, playerId }
   the player pushed the vault aside -> the paper behind it is shown
--------------------------------------------------------- */

r.post('/move', handle(async (req, res) => {
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session, playerId } = ctx;

  if (!session.vault_moved) {
    await l15.markVaultMoved(session.id);
    await l15.recordAction(session.id, 'move', 'vault', true);
    session.vault_moved = 1;
  }

  res.json({
    ...sessionView(session, await l15.getHints(playerId)),
    message: 'A paper was hidden behind the vault!',
  });
}));

/* ---------------------------------------------------------
   POST /level15/tap       body: { sessionId, playerId, target }
   wrong places (books, desk ...) are saved too
--------------------------------------------------------- */

r.post('/tap', handle(async (req, res) => {
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session } = ctx;

  const target = String(req.body?.target || '').toLowerCase().replace(/[^a-z]/g, '').slice(0, 20);
  if (!TAP_MESSAGES[target]) return bad(res, 400, 'bad_target', 'Unknown target');

  await l15.recordAction(session.id, 'tap', target, false);
  await l15.addTap(session.id);

  res.json({ success: true, correct: false, message: TAP_MESSAGES[target] });
}));

/* ---------------------------------------------------------
   POST /level15/enter     body: { sessionId, playerId, code }
--------------------------------------------------------- */

r.post('/enter', handle(async (req, res) => {
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session, playerId } = ctx;

  const code = String(req.body?.code || '').replace(/[^0-9]/g, '').slice(0, 8);
  if (code.length !== l15.CODE_LENGTH) {
    return bad(res, 400, 'invalid_code', `Code must have ${l15.CODE_LENGTH} digits`);
  }

  const wrongBefore = Number(session.wrong_attempts);
  const attemptsBefore = Number(session.total_attempts);
  // the paper shows only dots (no order), so the 4 digits are accepted in any order
  const sortDigits = (c) => String(c).split('').sort().join('');
  const correct = sortDigits(code) === sortDigits(session.code);

  await l15.recordAction(session.id, 'code', code, correct);
  await l15.addAttempt(session.id, !correct);

  if (!correct) {
    return res.json({
      success: true,
      correct: false,
      completed: false,
      wrongAttempts: wrongBefore + 1,
      message: session.vault_moved
        ? 'Wrong code. Check the paper again.'
        : 'Wrong code. Look around, the code is hidden somewhere.',
    });
  }

  // correct -> score, stars, save progress, unlock level 16
  const attempts = attemptsBefore + 1;
  const score = Math.max(100, 300 - wrongBefore * 50);
  const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

  await l15.completeSession(session.id, Number(session.elapsed) || 0);

  let progressSaved = false;
  try {
    await l15.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L15] could not save progress:', err.message);
  }

  try {
    await l15.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L15] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    message: 'The vault is open!',
    score,
    stars,
    attempts,
    seconds: Number(session.elapsed) || 0,
    progressSaved,
  });
}));

/* ---------------------------------------------------------
   POST /level15/hint      body: { sessionId, playerId }     FREE
   shows the clue directly, no hints are spent
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session, playerId } = ctx;

  await l15.markHintUsed(session.id);
  await l15.recordAction(session.id, 'hint', '', false);

  res.json({
    success: true,
    hints: await l15.getHints(playerId),
    message: CLUE_TEXT,
    text: CLUE_TEXT,
    cost: 0,
  });
}));

/* ---------------------------------------------------------
   POST /level15/skip      body: { sessionId, playerId }     costs 50 hints
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session, playerId } = ctx;

  const left = await l15.spendHints(playerId, SKIP_COST);
  if (left === null) {
    return bad(res, 402, 'not_enough_hints', `You need ${SKIP_COST} hints`);
  }

  await l15.skipSession(session.id, Number(session.elapsed) || 0);
  await l15.recordAction(session.id, 'skip', '', false);
  await l15.unlockNext(playerId, Number(session.total_attempts) || 0);

  res.json({ success: true, skipped: true, hints: left, message: 'Level skipped' });
}));

/* ---------------------------------------------------------
   POST /level15/reward    body: { playerId }      video reward +75 hints
--------------------------------------------------------- */

r.post('/reward', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const hints = await l15.addHints(playerId, REWARD_HINTS);
  res.json({ success: true, hints, added: REWARD_HINTS });
}));

/* ---------------------------------------------------------
   GET /level15/status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await l15.getProgress(playerId);

  res.json({
    success: true,
    level: l15.LEVEL,
    completed: Boolean(row && row.is_completed),
    score: row ? Number(row.score) || 0 : 0,
    stars: row ? Number(row.stars) || 0 : 0,
    attempts: row ? Number(row.attempts) || 0 : 0,
    completedAt: row ? row.completed_at : null,
  });
}));

module.exports = r;