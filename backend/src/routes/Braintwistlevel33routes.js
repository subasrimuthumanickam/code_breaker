// // backend/routes/Braintwistlevel33routes.js
// const express = require('express');
// const router = express.Router();
// const db = require('../db/level33Db');

// db.initTables().catch((e) => console.error('level33 init error:', e));

// const getPlayerId = (req) => Number(req.body?.playerId ?? req.query?.playerId);

// // GET /api/braintwist/level33?playerId=1  -> question + progress
// router.get('/level33', async (req, res) => {
//   try {
//     const playerId = getPlayerId(req);
//     if (!playerId) return res.status(400).json({ success: false, message: 'playerId required' });

//     const progress = await db.getProgress(playerId);
//     const hints = await db.getHints(playerId);
//     const { correct, ...publicQuestion } = db.QUESTION; // correct answer frontend ku anuppa maatom

//     res.json({
//       success: true,
//       level: db.LEVEL_NO,
//       question: publicQuestion,
//       hints,
//       progress: {
//         status: progress.status,
//         attempts: progress.attempts,
//         hintUsed: !!progress.hint_used,
//         skipped: !!progress.skipped,
//       },
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // POST /api/braintwist/level33/answer  { playerId, answer: 'A'|'B'|'C'|'D' }
// router.post('/level33/answer', async (req, res) => {
//   try {
//     const playerId = getPlayerId(req);
//     const answer = String(req.body?.answer || '').toUpperCase();
//     if (!playerId || !['A', 'B', 'C', 'D'].includes(answer)) {
//       return res.status(400).json({ success: false, message: 'Invalid request' });
//     }

//     const isCorrect = answer === db.QUESTION.correct;
//     await db.saveAnswer(playerId, answer, isCorrect);
//     const hints = await db.getHints(playerId);

//     res.json({
//       success: true,
//       correct: isCorrect,
//       reward: isCorrect ? db.QUESTION.reward : 0,
//       hints,
//       message: isCorrect ? 'Correct! 🎉' : 'Wrong answer, try again',
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // POST /api/braintwist/level33/hint  { playerId }
// router.post('/level33/hint', async (req, res) => {
//   try {
//     const playerId = getPlayerId(req);
//     if (!playerId) return res.status(400).json({ success: false, message: 'playerId required' });

//     await db.getProgress(playerId);
//     const spent = await db.spendHints(playerId, db.QUESTION.hintCost);
//     if (!spent.ok) {
//       return res.json({ success: false, hints: spent.hints, message: spent.message });
//     }
//     await db.markHintUsed(playerId);

//     res.json({
//       success: true,
//       hints: spent.hints,
//       hint: 'Think about the national flag nicknames. India\'s flag is called Tricolor.',
//       // wrong option ellaam illaama oru option remove pannum hint
//       eliminate: ['D'],
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // POST /api/braintwist/level33/skip  { playerId }
// router.post('/level33/skip', async (req, res) => {
//   try {
//     const playerId = getPlayerId(req);
//     if (!playerId) return res.status(400).json({ success: false, message: 'playerId required' });

//     await db.getProgress(playerId);
//     const spent = await db.spendHints(playerId, db.QUESTION.skipCost);
//     if (!spent.ok) {
//       return res.json({ success: false, hints: spent.hints, message: spent.message });
//     }
//     await db.markSkipped(playerId);

//     res.json({ success: true, hints: spent.hints, message: 'Level skipped' });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // POST /api/braintwist/level33/video-reward  { playerId }
// router.post('/level33/video-reward', async (req, res) => {
//   try {
//     const playerId = getPlayerId(req);
//     if (!playerId) return res.status(400).json({ success: false, message: 'playerId required' });

//     const hints = await db.addVideoReward(playerId);
//     res.json({ success: true, hints, reward: db.QUESTION.videoReward });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = router;
// backend/src/routes/Braintwistlevel33routes.js
const express = require('express');
const router = express.Router();
const db = require('../data/level33Db');

db.initTables().catch((e) => console.error('[level33] init error:', e));

const getPlayerId = (req) => Number(req.body?.playerId ?? req.query?.playerId);

// ---- START: question + hints + progress ----
// GET or POST /api/braintwist/level33/start?playerId=1
const start = async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: 'playerId required' });
    }

    const progress = await db.getProgress(playerId);
    const hints = await db.getHints(playerId);
    const { correct, ...publicQuestion } = db.QUESTION; // correct answer frontend ku anuppa maatom

    res.json({
      success: true,
      level: db.LEVEL_NO,
      question: publicQuestion,
      hints,
      progress: {
        status: progress.status,
        attempts: progress.attempts,
        hintUsed: !!progress.hint_used,
        skipped: !!progress.skipped,
      },
    });
  } catch (e) {
    console.error('[level33] start', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
router.get('/start', start);
router.post('/start', start);

// ---- ANSWER: { playerId, answer: 'A'|'B'|'C'|'D' } ----
router.post('/answer', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    const answer = String(req.body?.answer || '').toUpperCase();
    if (!playerId || !['A', 'B', 'C', 'D'].includes(answer)) {
      return res.status(400).json({ success: false, error: 'Invalid request' });
    }

    const isCorrect = answer === db.QUESTION.correct;
    await db.saveAnswer(playerId, answer, isCorrect);
    const progress = await db.getProgress(playerId);
    const hints = await db.getHints(playerId);

    res.json({
      success: true,
      correct: isCorrect,
      reward: isCorrect ? db.QUESTION.reward : 0,
      attempts: progress.attempts,
      hints,
      message: isCorrect ? 'Correct!' : 'Wrong answer, try again',
    });
  } catch (e) {
    console.error('[level33] answer', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ---- HINT: { playerId } ----
router.post('/hint', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: 'playerId required' });
    }

    await db.getProgress(playerId);
    await db.markHintUsed(playerId);

    res.json({
      success: true,
      free: true,
      cost: 0,
      hints: await db.getHints(playerId),
      hint: {
        text: "Think about national flag nicknames. India's flag is called Tricolor.",
        removeOption: 'D',
      },
    });
  } catch (e) {
    console.error('[level33] hint', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ---- SKIP: { playerId } ----
router.post('/skip', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: 'playerId required' });
    }

    await db.getProgress(playerId);
    const spent = await db.spendHints(playerId, db.QUESTION.skipCost);
    if (!spent.ok) {
      return res.status(402).json({ success: false, hints: spent.hints, error: spent.message });
    }
    await db.markSkipped(playerId);

    const progress = await db.getProgress(playerId);
    res.json({
      success: true,
      skipped: true,
      attempts: progress.attempts,
      hints: spent.hints,
      message: 'Level skipped',
    });
  } catch (e) {
    console.error('[level33] skip', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ---- REWARD (video): { playerId } ----
router.post('/reward', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: 'playerId required' });
    }

    const hints = await db.addVideoReward(playerId);
    res.json({ success: true, hints, reward: db.QUESTION.videoReward });
  } catch (e) {
    console.error('[level33] reward', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;