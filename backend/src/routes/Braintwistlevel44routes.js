// // Braintwistlevel44routes.js
// const express = require('express');
// const db = require('./level44Db');

// const router = express.Router();

// // GET /api/braintwist/level44  -> level data (answer is NOT sent to the client)
// router.get('/level44', async (req, res) => {
//   try {
//     const cfg = await db.getLevelConfig();
//     if (!cfg) return res.status(404).json({ error: 'Level 44 not found' });
//     res.json({
//       level: cfg.level_number,
//       prefix: cfg.question_prefix,
//       suffix: cfg.question_suffix,
//       shownNumber: cfg.shown_number,
//       appleCount: cfg.apple_count,
//       hintCost: cfg.hint_cost,
//       skipCost: cfg.skip_cost,
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // POST /api/braintwist/level44/check   body: { userId, answer }
// router.post('/level44/check', async (req, res) => {
//   try {
//     const { userId = 'guest', answer } = req.body || {};
//     if (typeof answer !== 'number') return res.status(400).json({ error: 'answer must be a number' });

//     const cfg = await db.getLevelConfig();
//     if (!cfg) return res.status(404).json({ error: 'Level 44 not found' });

//     const correct = answer === cfg.answer_number;
//     await db.saveAttempt(userId, answer, correct);
//     if (correct) await db.markCompleted(userId);

//     res.json({
//       correct,
//       message: correct ? 'Correct! 9 turned into 6.' : 'Not quite. Try again!',
//       nextLevel: correct ? 45 : null,
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // POST /api/braintwist/level44/hint   body: { userId }
// router.post('/level44/hint', async (req, res) => {
//   try {
//     const { userId = 'guest' } = req.body || {};
//     const cfg = await db.getLevelConfig();
//     if (!cfg) return res.status(404).json({ error: 'Level 44 not found' });
//     await db.addHintUsed(userId);
//     res.json({ hint: cfg.hint_text, cost: cfg.hint_cost });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;

// // In server.js:
// //   app.use(express.json());
// //   app.use('/api/braintwist', require('./Braintwistlevel44routes'));
// Braintwistlevel44routes.js
const express = require('express');
// level44Db.js normally lives in src/data/, but also works if it sits next to this file in src/routes/
let db;
try {
  db = require('../data/level44Db');
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') throw e;
  db = require('./level44Db');
}

const router = express.Router();

// GET /api/braintwist/level44  -> level data (answer is NOT sent to the client)
router.get('/', async (req, res) => {
  try {
    const cfg = await db.getLevelConfig();
    if (!cfg) return res.status(404).json({ error: 'Level 44 not found' });
    res.json({
      level: cfg.level_number,
      prefix: cfg.question_prefix,
      suffix: cfg.question_suffix,
      shownNumber: cfg.shown_number,
      appleCount: cfg.apple_count,
      hintCost: cfg.hint_cost,
      skipCost: cfg.skip_cost,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/braintwist/level44/check   body: { userId, answer }
router.post('/check', async (req, res) => {
  try {
    const { userId = 'guest', answer } = req.body || {};
    if (typeof answer !== 'number') return res.status(400).json({ error: 'answer must be a number' });

    const cfg = await db.getLevelConfig();
    if (!cfg) return res.status(404).json({ error: 'Level 44 not found' });

    const correct = answer === cfg.answer_number;
    await db.saveAttempt(userId, answer, correct);
    if (correct) await db.markCompleted(userId);

    res.json({
      correct,
      message: correct ? 'Correct! 9 turned into 6.' : 'Not quite. Try again!',
      nextLevel: correct ? 45 : null,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/braintwist/level44/hint   body: { userId }
router.post('/hint', async (req, res) => {
  try {
    const { userId = 'guest' } = req.body || {};
    const cfg = await db.getLevelConfig();
    if (!cfg) return res.status(404).json({ error: 'Level 44 not found' });
    await db.addHintUsed(userId);
    res.json({ hint: cfg.hint_text, cost: cfg.hint_cost });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

// Mounted by server.js (level loop) at /api/braintwist/level44
//   GET  /api/braintwist/level44
//   POST /api/braintwist/level44/check
//   POST /api/braintwist/level44/hint