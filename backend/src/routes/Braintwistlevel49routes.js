// // routes/Braintwistlevel49routes.js
// const express = require('express');
// const db = require('../data/level49Db');

// const router = express.Router();

// const clean = (s) => String(s || '').toUpperCase().replace(/[^A-Z]/g, '');

// // GET /api/braintwist/level49/info?playerId=xxx
// router.get('/info', async (req, res) => {
//   try {
//     const playerId = String(req.query.playerId || '');
//     if (!playerId) return res.status(400).json({ ok: false, error: 'playerId required' });

//     const cfg = await db.getConfig();
//     if (!cfg) return res.status(500).json({ ok: false, error: 'level49 config missing' });

//     const progress = await db.ensureProgress(playerId);
//     res.json({
//       ok: true,
//       level: 49,
//       question: 'What does the picture say?',
//       length: cfg.answer.length,
//       rows: [1, 3, 5], // pyramid of T's shown in the picture
//       clueCost: cfg.clue_cost,
//       skipCost: cfg.skip_cost,
//       solved: !!progress.solved,
//       cluesUsed: progress.clues_used,
//     });
//   } catch (e) {
//     console.error('level49 info', e);
//     res.status(500).json({ ok: false, error: 'server error' });
//   }
// });

// // POST /api/braintwist/level49/answer  { playerId, guess }
// router.post('/answer', async (req, res) => {
//   try {
//     const { playerId } = req.body || {};
//     const guess = clean(req.body && req.body.guess);
//     if (!playerId || !guess) return res.status(400).json({ ok: false, error: 'playerId & guess required' });

//     const cfg = await db.getConfig();
//     const correct = guess === cfg.answer;
//     await db.recordAttempt(String(playerId), guess, correct);

//     res.json({ ok: true, correct, reward: correct ? cfg.reward_hints : 0 });
//   } catch (e) {
//     console.error('level49 answer', e);
//     res.status(500).json({ ok: false, error: 'server error' });
//   }
// });

// // POST /api/braintwist/level49/clue  { playerId, hints, revealed: [indexes already revealed] }
// router.post('/clue', async (req, res) => {
//   try {
//     const { playerId, hints } = req.body || {};
//     const revealed = Array.isArray(req.body && req.body.revealed) ? req.body.revealed : [];
//     if (!playerId) return res.status(400).json({ ok: false, error: 'playerId required' });

//     const cfg = await db.getConfig();
//     if (Number(hints) < cfg.clue_cost) {
//       return res.json({ ok: false, error: 'not_enough_hints', cost: cfg.clue_cost });
//     }

//     const free = [];
//     for (let i = 0; i < cfg.answer.length; i++) if (!revealed.includes(i)) free.push(i);
//     if (!free.length) return res.json({ ok: false, error: 'all_revealed' });

//     const index = free[0];
//     await db.recordClue(String(playerId));
//     res.json({ ok: true, index, letter: cfg.answer[index], cost: cfg.clue_cost });
//   } catch (e) {
//     console.error('level49 clue', e);
//     res.status(500).json({ ok: false, error: 'server error' });
//   }
// });

// // POST /api/braintwist/level49/skip  { playerId, hints }
// router.post('/skip', async (req, res) => {
//   try {
//     const { playerId, hints } = req.body || {};
//     if (!playerId) return res.status(400).json({ ok: false, error: 'playerId required' });

//     const cfg = await db.getConfig();
//     if (Number(hints) < cfg.skip_cost) {
//       return res.json({ ok: false, error: 'not_enough_hints', cost: cfg.skip_cost });
//     }
//     await db.recordSkip(String(playerId));
//     res.json({ ok: true, cost: cfg.skip_cost });
//   } catch (e) {
//     console.error('level49 skip', e);
//     res.status(500).json({ ok: false, error: 'server error' });
//   }
// });

// module.exports = router;
// routes/Braintwistlevel49routes.js
const express = require('express');
const db = require('../data/level49Db');

const router = express.Router();

const clean = (s) => String(s || '').toUpperCase().replace(/[^A-Z]/g, '');

// GET /api/braintwist/level49/info?playerId=xxx
router.get('/info', async (req, res) => {
  try {
    const playerId = String(req.query.playerId || '');
    if (!playerId) return res.status(400).json({ ok: false, error: 'playerId required' });

    const cfg = await db.getConfig();
    if (!cfg) return res.status(500).json({ ok: false, error: 'level49 config missing' });

    const progress = await db.ensureProgress(playerId);
    res.json({
      ok: true,
      level: 49,
      question: 'What does the picture say?',
      length: cfg.answer.length,
      rows: [1, 3, 5], // pyramid of T's shown in the picture
      clueCost: 0,
      skipCost: cfg.skip_cost,
      solved: !!progress.solved,
      cluesUsed: progress.clues_used,
    });
  } catch (e) {
    console.error('level49 info', e);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

// POST /api/braintwist/level49/answer  { playerId, guess }
router.post('/answer', async (req, res) => {
  try {
    const { playerId } = req.body || {};
    const guess = clean(req.body && req.body.guess);
    if (!playerId || !guess) return res.status(400).json({ ok: false, error: 'playerId & guess required' });

    const cfg = await db.getConfig();
    // answer column may hold several accepted words, e.g. 'TIERS,TEPEE'
    const accepted = String(cfg.answer).split(',').map(clean).filter(Boolean);
    const correct = accepted.includes(guess);
    await db.recordAttempt(String(playerId), guess, correct);

    res.json({ ok: true, correct, reward: correct ? cfg.reward_hints : 0 });
  } catch (e) {
    console.error('level49 answer', e);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

// POST /api/braintwist/level49/clue  { playerId, hints, revealed: [indexes already revealed] }
router.post('/clue', async (req, res) => {
  try {
    const { playerId } = req.body || {};
    const revealed = Array.isArray(req.body && req.body.revealed) ? req.body.revealed : [];
    if (!playerId) return res.status(400).json({ ok: false, error: 'playerId required' });

    const cfg = await db.getConfig();
    const free = [];
    for (let i = 0; i < cfg.answer.length; i++) if (!revealed.includes(i)) free.push(i);
    if (!free.length) return res.json({ ok: false, error: 'all_revealed' });

    const index = free[0];
    await db.recordClue(String(playerId));
    res.json({ ok: true, success: true, free: true, index, letter: cfg.answer[index], cost: 0 });
  } catch (e) {
    console.error('level49 clue', e);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

// POST /api/braintwist/level49/skip  { playerId, hints }
router.post('/skip', async (req, res) => {
  try {
    const { playerId, hints } = req.body || {};
    if (!playerId) return res.status(400).json({ ok: false, error: 'playerId required' });

    const cfg = await db.getConfig();
    if (Number(hints) < cfg.skip_cost) {
      return res.json({ ok: false, error: 'not_enough_hints', cost: cfg.skip_cost });
    }
    await db.recordSkip(String(playerId));
    res.json({ ok: true, cost: cfg.skip_cost });
  } catch (e) {
    console.error('level49 skip', e);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

module.exports = router;