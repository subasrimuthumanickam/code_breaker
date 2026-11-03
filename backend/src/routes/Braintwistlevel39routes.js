// // const express = require('express');
// // const db = require('./level39Db');

// // const router = express.Router();

// // const wrap = (fn) => (req, res) =>
// //   fn(req, res).catch((err) => {
// //     console.error('[level39]', err);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   });

// // const getUserId = (req) => String(req.body?.userId || req.query?.userId || '').trim();

// // // GET /api/braintwist/level39?userId=abc  -> level data (answer is never sent)
// // router.get('/level39', wrap(async (req, res) => {
// //   const userId = getUserId(req);
// //   if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

// //   const level = await db.getLevel();
// //   if (!level) return res.status(404).json({ success: false, message: 'Level not found' });
// //   const p = await db.getOrCreateProgress(userId);

// //   res.json({
// //     success: true,
// //     data: {
// //       level: level.level_no,
// //       question: level.question,
// //       coins: p.coins,
// //       solved: !!p.solved,
// //       costs: { search: level.search_cost, clue: level.clue_reward, skip: level.skip_cost },
// //     },
// //   });
// // }));

// // // POST /api/braintwist/level39/submit  { userId, answer }
// // router.post('/level39/submit', wrap(async (req, res) => {
// //   const userId = getUserId(req);
// //   const answer = String(req.body?.answer ?? '').trim();
// //   if (!userId || !answer) return res.status(400).json({ success: false, message: 'userId and answer required' });

// //   const level = await db.getLevel();
// //   await db.getOrCreateProgress(userId);
// //   const correct = answer === String(level.answer).trim();
// //   await db.logAttempt(userId, answer, correct);

// //   if (correct) {
// //     await db.markSolved(userId);
// //     await db.adjustCoins(userId, level.solve_reward);
// //   }
// //   const p = await db.getOrCreateProgress(userId);
// //   res.json({
// //     success: true,
// //     data: {
// //       correct,
// //       coins: p.coins,
// //       reward: correct ? level.solve_reward : 0,
// //       nextLevel: correct ? 40 : null,
// //       message: correct ? 'Correct!' : 'Wrong answer, try again',
// //     },
// //   });
// // }));

// // // POST /api/braintwist/level39/search  { userId }   (costs coins)
// // router.post('/level39/search', wrap(async (req, res) => {
// //   const userId = getUserId(req);
// //   if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

// //   const level = await db.getLevel();
// //   await db.getOrCreateProgress(userId);
// //   const ok = await db.adjustCoins(userId, -level.search_cost);
// //   const p = await db.getOrCreateProgress(userId);
// //   if (!ok) return res.json({ success: false, message: 'Not enough coins', data: { coins: p.coins } });

// //   res.json({ success: true, data: { hint: level.search_hint, coins: p.coins } });
// // }));

// // // POST /api/braintwist/level39/clue  { userId }   (reward after clue video watched)
// // router.post('/level39/clue', wrap(async (req, res) => {
// //   const userId = getUserId(req);
// //   if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

// //   const level = await db.getLevel();
// //   await db.getOrCreateProgress(userId);
// //   await db.adjustCoins(userId, level.clue_reward);
// //   const p = await db.getOrCreateProgress(userId);
// //   res.json({ success: true, data: { added: level.clue_reward, coins: p.coins } });
// // }));

// // // POST /api/braintwist/level39/skip  { userId }   (costs coins)
// // router.post('/level39/skip', wrap(async (req, res) => {
// //   const userId = getUserId(req);
// //   if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

// //   const level = await db.getLevel();
// //   await db.getOrCreateProgress(userId);
// //   const ok = await db.adjustCoins(userId, -level.skip_cost);
// //   const p = await db.getOrCreateProgress(userId);
// //   if (!ok) return res.json({ success: false, message: 'Not enough coins', data: { coins: p.coins } });

// //   await db.markSkipped(userId);
// //   res.json({ success: true, data: { coins: p.coins, nextLevel: 40 } });
// // }));

// // module.exports = router;

// // // In your server.js:
// // //   app.use(express.json());
// // //   app.use('/api/braintwist', require('./Braintwistlevel39routes'));
// const express = require('express');
// const db = require('../data/level39Db');

// const router = express.Router();

// const wrap = (fn) => (req, res) =>
//   fn(req, res).catch((err) => {
//     console.error('[level39]', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   });

// const getUserId = (req) => String(req.body?.userId || req.query?.userId || '').trim();

// // GET /api/braintwist/level39?userId=abc  -> level data (answer is never sent)
// router.get('/', wrap(async (req, res) => {
//   const userId = getUserId(req);
//   if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

//   const level = await db.getLevel();
//   if (!level) return res.status(404).json({ success: false, message: 'Level not found' });
//   const p = await db.getOrCreateProgress(userId);

//   res.json({
//     success: true,
//     data: {
//       level: level.level_no,
//       question: level.question,
//       coins: p.coins,
//       solved: !!p.solved,
//       costs: { search: level.search_cost, clue: level.clue_reward, skip: level.skip_cost },
//     },
//   });
// }));

// // POST /api/braintwist/level39/submit  { userId, answer }
// router.post('/submit', wrap(async (req, res) => {
//   const userId = getUserId(req);
//   const answer = String(req.body?.answer ?? '').trim();
//   if (!userId || !answer) return res.status(400).json({ success: false, message: 'userId and answer required' });

//   const level = await db.getLevel();
//   await db.getOrCreateProgress(userId);
//   const correct = answer === String(level.answer).trim();
//   await db.logAttempt(userId, answer, correct);

//   if (correct) {
//     await db.markSolved(userId);
//     await db.adjustCoins(userId, level.solve_reward);
//   }
//   const p = await db.getOrCreateProgress(userId);
//   res.json({
//     success: true,
//     data: {
//       correct,
//       coins: p.coins,
//       reward: correct ? level.solve_reward : 0,
//       nextLevel: correct ? 40 : null,
//       message: correct ? 'Correct!' : 'Wrong answer, try again',
//     },
//   });
// }));

// // POST /api/braintwist/level39/search  { userId }   (costs coins)
// router.post('/search', wrap(async (req, res) => {
//   const userId = getUserId(req);
//   if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

//   const level = await db.getLevel();
//   await db.getOrCreateProgress(userId);
//   const ok = await db.adjustCoins(userId, -level.search_cost);
//   const p = await db.getOrCreateProgress(userId);
//   if (!ok) return res.json({ success: false, message: 'Not enough coins', data: { coins: p.coins } });

//   res.json({ success: true, data: { hint: level.search_hint, coins: p.coins } });
// }));

// // POST /api/braintwist/level39/clue  { userId }   (reward after clue video watched)
// router.post('/clue', wrap(async (req, res) => {
//   const userId = getUserId(req);
//   if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

//   const level = await db.getLevel();
//   await db.getOrCreateProgress(userId);
//   await db.adjustCoins(userId, level.clue_reward);
//   const p = await db.getOrCreateProgress(userId);
//   res.json({ success: true, data: { added: level.clue_reward, coins: p.coins } });
// }));

// // POST /api/braintwist/level39/skip  { userId }   (costs coins)
// router.post('/skip', wrap(async (req, res) => {
//   const userId = getUserId(req);
//   if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

//   const level = await db.getLevel();
//   await db.getOrCreateProgress(userId);
//   const ok = await db.adjustCoins(userId, -level.skip_cost);
//   const p = await db.getOrCreateProgress(userId);
//   if (!ok) return res.json({ success: false, message: 'Not enough coins', data: { coins: p.coins } });

//   await db.markSkipped(userId);
//   res.json({ success: true, data: { coins: p.coins, nextLevel: 40 } });
// }));

// module.exports = router;

// // server.js mounts this automatically:
// //   app.use('/api/braintwist/level39', router)
// // Final URLs: GET /api/braintwist/level39, POST /api/braintwist/level39/submit | search | clue | skip
const express = require('express');
const db = require('../data/level39Db');

const router = express.Router();

const wrap = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error('[level39]', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.code || err.message });
  });

const getUserId = (req) => String(req.body?.userId || req.query?.userId || '').trim();

// GET /api/braintwist/level39?userId=abc  -> level data (answer is never sent)
router.get('/', wrap(async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

  const level = await db.getLevel();
  if (!level) return res.status(404).json({ success: false, message: 'Level not found' });
  const p = await db.getOrCreateProgress(userId);

  res.json({
    success: true,
    data: {
      level: level.level_no,
      question: level.question,
      coins: p.coins,
      solved: !!p.solved,
      costs: { search: level.search_cost, clue: level.clue_reward, skip: level.skip_cost },
    },
  });
}));

// POST /api/braintwist/level39/submit  { userId, answer }
router.post('/submit', wrap(async (req, res) => {
  const userId = getUserId(req);
  const answer = String(req.body?.answer ?? '').trim();
  if (!userId || !answer) return res.status(400).json({ success: false, message: 'userId and answer required' });

  const level = await db.getLevel();
  await db.getOrCreateProgress(userId);
  const correct = answer === String(level.answer).trim();
  await db.logAttempt(userId, answer, correct);

  if (correct) {
    await db.markSolved(userId);
    await db.adjustCoins(userId, level.solve_reward);
  }
  const p = await db.getOrCreateProgress(userId);
  res.json({
    success: true,
    data: {
      correct,
      coins: p.coins,
      reward: correct ? level.solve_reward : 0,
      nextLevel: correct ? 40 : null,
      message: correct ? 'Correct!' : 'Wrong answer, try again',
    },
  });
}));

// POST /api/braintwist/level39/search  { userId }   (costs coins)
router.post('/search', wrap(async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

  const level = await db.getLevel();
  await db.getOrCreateProgress(userId);
  const ok = await db.adjustCoins(userId, -level.search_cost);
  const p = await db.getOrCreateProgress(userId);
  if (!ok) return res.json({ success: false, message: 'Not enough coins', data: { coins: p.coins } });

  res.json({ success: true, data: { hint: level.search_hint, coins: p.coins } });
}));

// POST /api/braintwist/level39/clue  { userId }   (reward after clue video watched)
router.post('/clue', wrap(async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

  const level = await db.getLevel();
  await db.getOrCreateProgress(userId);
  await db.adjustCoins(userId, level.clue_reward);
  const p = await db.getOrCreateProgress(userId);
  res.json({ success: true, data: { added: level.clue_reward, coins: p.coins } });
}));

// POST /api/braintwist/level39/skip  { userId }   (costs coins)
router.post('/skip', wrap(async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

  const level = await db.getLevel();
  await db.getOrCreateProgress(userId);
  const ok = await db.adjustCoins(userId, -level.skip_cost);
  const p = await db.getOrCreateProgress(userId);
  if (!ok) return res.json({ success: false, message: 'Not enough coins', data: { coins: p.coins } });

  await db.markSkipped(userId);
  res.json({ success: true, data: { coins: p.coins, nextLevel: 40 } });
}));

module.exports = router;

// server.js mounts this automatically:
//   app.use('/api/braintwist/level39', router)
// Final URLs: GET /api/braintwist/level39, POST /api/braintwist/level39/submit | search | clue | skip