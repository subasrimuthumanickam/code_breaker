// // // Brain Twist - Level 7: "The sleepy baby"
// // // A dark room, a crying baby. Three small steps, each one has ONE right answer:
// // //   1. tap the lamp           (so the player can see)
// // //   2. drag the milk bottle   onto the baby (hungry)
// // //   3. drag the blanket       onto the baby (cold and sleepy)
// // // The server owns the answers and the state of the room. The frontend only draws it.
// // const express = require('express');
// // const L7 = require('../data/level7Db');

// // const r = express.Router();

// // const LAST_STAGE = 3;
// // const HINT_COST = 25;
// // const WRONG_DEFAULT = 'Hmm, that does not help the baby. Try again!';

// // const STAGES = {
// //   1: {
// //     title: 'Oh no! It is so dark and the baby is crying!',
// //     hint: 'Tap the thing that gives light',
// //     mode: 'tap',
// //     objects: [
// //       { id: 'lamp', label: 'Lamp' },
// //       { id: 'curtain', label: 'Curtain' },
// //       { id: 'tv', label: 'TV' },
// //       { id: 'teddy', label: 'Teddy' },
// //       { id: 'clock', label: 'Clock' },
// //     ],
// //     answer: 'lamp',
// //     wrong: {
// //       curtain: 'It is night time. The curtain will not bring any light!',
// //       tv: 'A loud, bright TV will wake the baby up even more!',
// //       teddy: 'The teddy cannot light up the room!',
// //       clock: 'A clock only tells the time. It gives no light!',
// //     },
// //     right: 'Click! Now the room is bright.',
// //     scene: { light: false, baby: 'crying' },
// //   },
// //   2: {
// //     title: 'Now the baby is hungry!',
// //     hint: 'Drag the right thing onto the baby',
// //     mode: 'drag',
// //     tray: [
// //       { id: 'duck', label: 'Duck' },
// //       { id: 'bottle', label: 'Bottle' },
// //       { id: 'book', label: 'Book' },
// //     ],
// //     answer: 'bottle',
// //     wrong: {
// //       duck: 'The duck is a toy. Babies cannot eat toys!',
// //       book: 'Babies cannot eat books!',
// //     },
// //     right: 'Yum! The baby is full and happy.',
// //     scene: { light: true, baby: 'hungry' },
// //   },
// //   3: {
// //     title: 'The baby is sleepy and a little cold!',
// //     hint: 'Drag the right thing onto the baby',
// //     mode: 'drag',
// //     tray: [
// //       { id: 'umbrella', label: 'Umbrella' },
// //       { id: 'sunglasses', label: 'Glasses' },
// //       { id: 'blanket', label: 'Blanket' },
// //     ],
// //     answer: 'blanket',
// //     wrong: {
// //       umbrella: 'It is not raining inside the room!',
// //       sunglasses: 'It is night time. The baby does not need sunglasses!',
// //     },
// //     right: 'Sweet dreams, little baby!',
// //     scene: { light: true, baby: 'sleepy' },
// //   },
// // };

// // // the room after the last right answer
// // const FINAL_SCENE = { light: true, baby: 'sleeping' };

// // // what the frontend may see about a stage (no answer)
// // const stageView = (stage) => {
// //   const s = STAGES[stage];
// //   return {
// //     stage,
// //     totalStages: LAST_STAGE,
// //     title: s.title,
// //     hint: s.hint,
// //     mode: s.mode,
// //     objects: s.objects || [],
// //     tray: s.tray || [],
// //     scene: s.scene,
// //   };
// // };

// // /* ---------------- misc ---------------- */

// // const handle = (fn) => async (req, res) => {
// //   try { await fn(req, res); }
// //   catch (err) {
// //     console.error('[BrainTwist L7 Error]', req.method, req.originalUrl, err);
// //     if (!res.headersSent) res.status(500).json({ success: false, error: 'server_error', message: err.message });
// //   }
// // };

// // const toId = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
// // const word = (v) => String(v || '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 30);
// // const bad = (res, status, error, message) => res.status(status).json({ success: false, error, message });

// // r.use(async (req, res, next) => { await L7.ready; next(); });

// // /* ---------------- POST /start   { playerId } ---------------- */

// // r.post('/start', handle(async (req, res) => {
// //   const playerId = toId(req.body && req.body.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// //   let session = await L7.findActive(playerId);
// //   if (!session) session = await L7.createSession(playerId);

// //   res.json({
// //     success: true,
// //     sessionId: session.id,
// //     level: L7.LEVEL,
// //     status: session.status,
// //     ...stageView(Number(session.stage)),
// //   });
// // }));

// // /* ---------------- POST /action   { sessionId, playerId, kind, item, target } ---------------- */

// // r.post('/action', handle(async (req, res) => {
// //   const sessionId = toId(req.body && req.body.sessionId);
// //   const playerId = toId(req.body && req.body.playerId);
// //   const kind = word(req.body && req.body.kind);       // 'tap' or 'drag'
// //   const item = word(req.body && req.body.item);
// //   const target = word(req.body && req.body.target);
// //   if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

// //   const session = await L7.getSession(sessionId, playerId);
// //   if (!session) return bad(res, 404, 'no_session', 'Session not found');
// //   if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

// //   const stage = Number(session.stage);
// //   const s = STAGES[stage];

// //   // the move has to fit this stage
// //   const known = s.mode === 'tap'
// //     ? s.objects.some((o) => o.id === item)
// //     : s.tray.some((t) => t.id === item);
// //   if (kind !== s.mode || !known || (s.mode === 'drag' && target !== 'baby')) {
// //     return bad(res, 400, 'invalid_move', 'That move is not allowed here');
// //   }

// //   const wrongBefore = Number(session.wrong_attempts);
// //   const attemptsBefore = Number(session.total_attempts);
// //   const correct = item === s.answer;

// //   await L7.recordAction(sessionId, stage, kind, item, target, correct);

// //   /* ----- wrong ----- */
// //   if (!correct) {
// //     return res.json({
// //       success: true,
// //       correct: false,
// //       completed: false,
// //       stage,
// //       wrongAttempts: wrongBefore + 1,
// //       message: s.wrong[item] || WRONG_DEFAULT,
// //     });
// //   }

// //   /* ----- right, more stages left ----- */
// //   if (stage < LAST_STAGE) {
// //     const next = stage + 1;
// //     await L7.setStage(sessionId, next);
// //     return res.json({
// //       success: true,
// //       correct: true,
// //       completed: false,
// //       message: s.right,
// //       ...stageView(next),
// //     });
// //   }

// //   /* ----- right on the last stage: level finished ----- */
// //   const attempts = attemptsBefore + 1;
// //   const score = Math.max(100, 300 - wrongBefore * 50);
// //   const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

// //   await L7.completeSession(sessionId);

// //   let progressSaved = false;
// //   try { await L7.saveProgress(playerId, score, stars, attempts); progressSaved = true; }
// //   catch (err) { console.error('[BrainTwist L7] could not save progress:', err.message); }

// //   res.json({
// //     success: true,
// //     correct: true,
// //     completed: true,
// //     stage,
// //     scene: FINAL_SCENE,
// //     message: s.right,
// //     score, stars, attempts, progressSaved,
// //   });
// // }));

// // /* ---------------- POST /hint   { sessionId, playerId } ---------------- */

// // r.post('/hint', handle(async (req, res) => {
// //   const sessionId = toId(req.body && req.body.sessionId);
// //   const playerId = toId(req.body && req.body.playerId);
// //   if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

// //   const session = await L7.getSession(sessionId, playerId);
// //   if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

// //   const hints = await L7.spendHints(playerId, HINT_COST);
// //   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

// //   res.json({ success: true, item: STAGES[Number(session.stage)].answer, hints, cost: HINT_COST });
// // }));

// // /* ---------------- GET /status/:playerId ---------------- */

// // r.get('/status/:playerId', handle(async (req, res) => {
// //   const playerId = toId(req.params.playerId);
// //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
// //   const row = await L7.getProgress(playerId);
// //   res.json({
// //     success: true,
// //     level: L7.LEVEL,
// //     completed: Boolean(row && row.is_completed),
// //     score: row ? Number(row.score) || 0 : 0,
// //     stars: row ? Number(row.stars) || 0 : 0,
// //     attempts: row ? Number(row.attempts) || 0 : 0,
// //     completedAt: row ? row.completed_at : null,
// //   });
// // }));

// // module.exports = r;
// // Brain Twist - Level 7: "Late for the school bus"
// // Mia is late. Three small logic / maths steps, each one has ONE right answer:
// //   1. tap the clock that really works (the wall clock has stopped)
// //   2. drag the right school book into the bag (read the timetable, "yesterday was Tuesday")
// //   3. drag the right coin to Mia (ticket 9 coins, she has 4 + 2 = 6, so she needs 3)
// // The server owns the answers and the state of the room. The frontend only draws it.
// const express = require('express');
// const L7 = require('../data/level7Db');

// const r = express.Router();

// const LAST_STAGE = 3;
// const HINT_COST = 25;
// const WRONG_DEFAULT = 'Hmm, think again!';

// const STAGES = {
//   1: {
//     title: 'Mia is late! The school bus leaves at 8:00. Which clock tells the real time?',
//     hint: 'One clock has no battery',
//     mode: 'tap',
//     objects: [
//       { id: 'wallclock', label: 'Wall clock' },
//       { id: 'alarm', label: 'Alarm clock' },
//       { id: 'calendar', label: 'Calendar' },
//       { id: 'board', label: 'Timetable' },
//     ],
//     answer: 'alarm',
//     wrong: {
//       wallclock: 'Look at the floor. The battery fell out, so this clock stopped at 7:20!',
//       calendar: 'A calendar shows the day, not the time!',
//       board: 'The timetable shows lessons, not the time!',
//     },
//     right: 'It is 7:50. Only 10 minutes left!',
//     scene: { mood: 'late' },
//   },
//   2: {
//     title: 'Yesterday was Tuesday. Pack the book Mia needs for today!',
//     hint: 'Read the timetable on the wall',
//     mode: 'drag',
//     target: 'bag',
//     tray: [
//       { id: 'maths', label: 'Maths' },
//       { id: 'science', label: 'Science' },
//       { id: 'art', label: 'Art' },
//     ],
//     answer: 'science',
//     wrong: {
//       maths: 'Maths is on Monday. That was two days ago!',
//       art: 'Art was yesterday (Tuesday). Today is Wednesday!',
//     },
//     right: 'Wednesday is Science. The bag is packed!',
//     scene: { mood: 'pack' },
//   },
//   3: {
//     title: 'The bus ticket costs 9 coins. Mia has 4 coins and her brother gave her 2 more. Which coin does she still need?',
//     hint: 'Drag the right coin to Mia',
//     mode: 'drag',
//     target: 'mia',
//     tray: [
//       { id: 'c1', label: 'Coin 1' },
//       { id: 'c3', label: 'Coin 3' },
//       { id: 'c4', label: 'Coin 4' },
//     ],
//     answer: 'c3',
//     wrong: {
//       c1: '4 + 2 + 1 = 7. That is still not 9!',
//       c4: '4 + 2 + 4 = 10. That is too much!',
//     },
//     right: 'Mia caught the bus. Great maths!',
//     scene: { mood: 'pay' },
//   },
// };

// // the room after the last right answer
// const FINAL_SCENE = { mood: 'happy' };

// // what the frontend may see about a stage (no answer)
// const stageView = (stage) => {
//   const s = STAGES[stage];
//   return {
//     stage,
//     totalStages: LAST_STAGE,
//     title: s.title,
//     hint: s.hint,
//     mode: s.mode,
//     target: s.target || null,
//     objects: s.objects || [],
//     tray: s.tray || [],
//     scene: s.scene,
//   };
// };

// /* ---------------- misc ---------------- */

// const handle = (fn) => async (req, res) => {
//   try { await fn(req, res); }
//   catch (err) {
//     console.error('[BrainTwist L7 Error]', req.method, req.originalUrl, err);
//     if (!res.headersSent) res.status(500).json({ success: false, error: 'server_error', message: err.message });
//   }
// };

// const toId = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
// const word = (v) => String(v || '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 30);
// const bad = (res, status, error, message) => res.status(status).json({ success: false, error, message });

// r.use(async (req, res, next) => { await L7.ready; next(); });

// /* ---------------- POST /start   { playerId } ---------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body && req.body.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   let session = await L7.findActive(playerId);
//   if (!session) session = await L7.createSession(playerId);

//   res.json({
//     success: true,
//     sessionId: session.id,
//     level: L7.LEVEL,
//     status: session.status,
//     ...stageView(Number(session.stage)),
//   });
// }));

// /* ---------------- POST /action   { sessionId, playerId, kind, item, target } ---------------- */

// r.post('/action', handle(async (req, res) => {
//   const sessionId = toId(req.body && req.body.sessionId);
//   const playerId = toId(req.body && req.body.playerId);
//   const kind = word(req.body && req.body.kind);       // 'tap' or 'drag'
//   const item = word(req.body && req.body.item);
//   const target = word(req.body && req.body.target);
//   if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

//   const session = await L7.getSession(sessionId, playerId);
//   if (!session) return bad(res, 404, 'no_session', 'Session not found');
//   if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

//   const stage = Number(session.stage);
//   const s = STAGES[stage];

//   // the move has to fit this stage
//   const known = s.mode === 'tap'
//     ? s.objects.some((o) => o.id === item)
//     : s.tray.some((t) => t.id === item);
//   if (kind !== s.mode || !known || (s.mode === 'drag' && target !== s.target)) {
//     return bad(res, 400, 'invalid_move', 'That move is not allowed here');
//   }

//   const wrongBefore = Number(session.wrong_attempts);
//   const attemptsBefore = Number(session.total_attempts);
//   const correct = item === s.answer;

//   await L7.recordAction(sessionId, stage, kind, item, target, correct);

//   /* ----- wrong ----- */
//   if (!correct) {
//     return res.json({
//       success: true,
//       correct: false,
//       completed: false,
//       stage,
//       wrongAttempts: wrongBefore + 1,
//       message: s.wrong[item] || WRONG_DEFAULT,
//     });
//   }

//   /* ----- right, more stages left ----- */
//   if (stage < LAST_STAGE) {
//     const next = stage + 1;
//     await L7.setStage(sessionId, next);
//     return res.json({
//       success: true,
//       correct: true,
//       completed: false,
//       message: s.right,
//       ...stageView(next),
//     });
//   }

//   /* ----- right on the last stage: level finished ----- */
//   const attempts = attemptsBefore + 1;
//   const score = Math.max(100, 300 - wrongBefore * 50);
//   const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

//   await L7.completeSession(sessionId);

//   let progressSaved = false;
//   try { await L7.saveProgress(playerId, score, stars, attempts); progressSaved = true; }
//   catch (err) { console.error('[BrainTwist L7] could not save progress:', err.message); }

//   res.json({
//     success: true,
//     correct: true,
//     completed: true,
//     stage,
//     scene: FINAL_SCENE,
//     message: s.right,
//     score, stars, attempts, progressSaved,
//   });
// }));

// /* ---------------- POST /hint   { sessionId, playerId } ---------------- */

// r.post('/hint', handle(async (req, res) => {
//   const sessionId = toId(req.body && req.body.sessionId);
//   const playerId = toId(req.body && req.body.playerId);
//   if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

//   const session = await L7.getSession(sessionId, playerId);
//   if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

//   const hints = await L7.spendHints(playerId, HINT_COST);
//   if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

//   res.json({ success: true, item: STAGES[Number(session.stage)].answer, hints, cost: HINT_COST });
// }));

// /* ---------------- GET /status/:playerId ---------------- */

// r.get('/status/:playerId', handle(async (req, res) => {
//   const playerId = toId(req.params.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
//   const row = await L7.getProgress(playerId);
//   res.json({
//     success: true,
//     level: L7.LEVEL,
//     completed: Boolean(row && row.is_completed),
//     score: row ? Number(row.score) || 0 : 0,
//     stars: row ? Number(row.stars) || 0 : 0,
//     attempts: row ? Number(row.attempts) || 0 : 0,
//     completedAt: row ? row.completed_at : null,
//   });
// }));

// module.exports = r;

const express = require('express');
const L7 = require('../data/level7Db');

const r = express.Router();

const LAST_STAGE = 3;
const HINT_COST = 25;
const WRONG_DEFAULT = 'Hmm, think again!';

const STAGES = {
  1: {
    title: "Mia's bus leaves at 8:00! Which clock shows the real time?",
    hint: 'One clock has stopped. Find the one still running.',
    mode: 'tap',
    objects: [
      { id: 'wallclock', label: 'Wall clock' },
      { id: 'alarm', label: 'Alarm clock' },
      { id: 'calendar', label: 'Calendar' },
      { id: 'board', label: 'Timetable' },
    ],
    answer: 'alarm',
    wrong: {
      wallclock: 'The battery fell out, so this clock stopped at 7:20!',
      calendar: 'A calendar shows the day, not the time!',
      board: 'The timetable shows lessons, not the time!',
    },
    right: 'It is 7:50. Only 10 minutes left!',
    scene: { mood: 'late' },
  },
  2: {
    title: "Yesterday was Tuesday. Put today's book in Mia's bag.",
    hint: 'Work out today, then check the timetable.',
    mode: 'drag',
    target: 'bag',
    tray: [
      { id: 'maths', label: 'Maths' },
      { id: 'science', label: 'Science' },
      { id: 'art', label: 'Art' },
    ],
    answer: 'science',
    wrong: {
      maths: 'Maths is on Monday. That was two days ago!',
      art: 'Art was yesterday (Tuesday). Today is Wednesday!',
    },
    right: 'Today is Wednesday, so Science. The bag is packed!',
    scene: { mood: 'pack' },
  },
  3: {
    title: 'Ticket: 9 coins. Mia has 4 and her brother gave 2. Which coin does she still need?',
    hint: 'Take what she has away from 9, then drag the coin to Mia.',
    mode: 'drag',
    target: 'mia',
    tray: [
      { id: 'c1', label: 'Coin 1' },
      { id: 'c3', label: 'Coin 3' },
      { id: 'c4', label: 'Coin 4' },
    ],
    answer: 'c3',
    wrong: {
      c1: '4 + 2 + 1 = 7. That is still not 9!',
      c4: '4 + 2 + 4 = 10. That is too much!',
    },
    right: '9 - 4 - 2 = 3. Mia caught the bus!',
    scene: { mood: 'pay' },
  },
};

// the room after the last right answer
const FINAL_SCENE = { mood: 'happy' };

// what the frontend may see about a stage (no answer)
const stageView = (stage) => {
  const s = STAGES[stage];
  return {
    stage,
    totalStages: LAST_STAGE,
    title: s.title,
    hint: s.hint,
    mode: s.mode,
    target: s.target || null,
    objects: s.objects || [],
    tray: s.tray || [],
    scene: s.scene,
  };
};

/* ---------------- misc ---------------- */

const handle = (fn) => async (req, res) => {
  try { await fn(req, res); }
  catch (err) {
    console.error('[BrainTwist L7 Error]', req.method, req.originalUrl, err);
    if (!res.headersSent) res.status(500).json({ success: false, error: 'server_error', message: err.message });
  }
};

const toId = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
const word = (v) => String(v || '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 30);
const bad = (res, status, error, message) => res.status(status).json({ success: false, error, message });

r.use(async (req, res, next) => { await L7.ready; next(); });

/* ---------------- POST /start   { playerId } ---------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body && req.body.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  let session = await L7.findActive(playerId);
  if (!session) session = await L7.createSession(playerId);

  res.json({
    success: true,
    sessionId: session.id,
    level: L7.LEVEL,
    status: session.status,
    ...stageView(Number(session.stage)),
  });
}));

/* ---------------- POST /action   { sessionId, playerId, kind, item, target } ---------------- */

r.post('/action', handle(async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);
  const kind = word(req.body && req.body.kind);       // 'tap' or 'drag'
  const item = word(req.body && req.body.item);
  const target = word(req.body && req.body.target);
  if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

  const session = await L7.getSession(sessionId, playerId);
  if (!session) return bad(res, 404, 'no_session', 'Session not found');
  if (session.status === 'completed') return bad(res, 409, 'already_completed', 'This level is already completed');

  const stage = Number(session.stage);
  const s = STAGES[stage];

  // the move has to fit this stage
  const known = s.mode === 'tap'
    ? s.objects.some((o) => o.id === item)
    : s.tray.some((t) => t.id === item);
  if (kind !== s.mode || !known || (s.mode === 'drag' && target !== s.target)) {
    return bad(res, 400, 'invalid_move', 'That move is not allowed here');
  }

  const wrongBefore = Number(session.wrong_attempts);
  const attemptsBefore = Number(session.total_attempts);
  const correct = item === s.answer;

  await L7.recordAction(sessionId, stage, kind, item, target, correct);

  /* ----- wrong ----- */
  if (!correct) {
    return res.json({
      success: true,
      correct: false,
      completed: false,
      stage,
      wrongAttempts: wrongBefore + 1,
      message: s.wrong[item] || WRONG_DEFAULT,
    });
  }

  /* ----- right, more stages left ----- */
  if (stage < LAST_STAGE) {
    const next = stage + 1;
    await L7.setStage(sessionId, next);
    return res.json({
      success: true,
      correct: true,
      completed: false,
      message: s.right,
      ...stageView(next),
    });
  }

  /* ----- right on the last stage: level finished ----- */
  const attempts = attemptsBefore + 1;
  const score = Math.max(100, 300 - wrongBefore * 50);
  const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

  await L7.completeSession(sessionId);

  let progressSaved = false;
  try { await L7.saveProgress(playerId, score, stars, attempts); progressSaved = true; }
  catch (err) { console.error('[BrainTwist L7] could not save progress:', err.message); }

  res.json({
    success: true,
    correct: true,
    completed: true,
    stage,
    scene: FINAL_SCENE,
    message: s.right,
    score, stars, attempts, progressSaved,
  });
}));

/* ---------------- POST /hint   { sessionId, playerId } ---------------- */

r.post('/hint', handle(async (req, res) => {
  const sessionId = toId(req.body && req.body.sessionId);
  const playerId = toId(req.body && req.body.playerId);
  if (!sessionId || !playerId) return bad(res, 400, 'ids_required', 'sessionId and playerId are required');

  const session = await L7.getSession(sessionId, playerId);
  if (!session || session.status !== 'in_progress') return bad(res, 404, 'no_session', 'Session not found');

  const hints = await L7.spendHints(playerId, HINT_COST);
  if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

  res.json({ success: true, item: STAGES[Number(session.stage)].answer, hints, cost: HINT_COST });
}));

/* ---------------- GET /status/:playerId ---------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');
  const row = await L7.getProgress(playerId);
  res.json({
    success: true,
    level: L7.LEVEL,
    completed: Boolean(row && row.is_completed),
    score: row ? Number(row.score) || 0 : 0,
    stars: row ? Number(row.stars) || 0 : 0,
    attempts: row ? Number(row.attempts) || 0 : 0,
    completedAt: row ? row.completed_at : null,
  });
}));

module.exports = r;