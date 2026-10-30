// // // Braintwistlevel29routes.js
// // const express = require('express');
// // const mysql = require('mysql2/promise');

// // const router = express.Router();

// // // Already unga project la pool irundha, adhai inga use pannunga
// // const pool = mysql.createPool({
// //   host: process.env.DB_HOST || 'localhost',
// //   user: process.env.DB_USER || 'root',
// //   password: process.env.DB_PASSWORD || '',
// //   database: process.env.DB_NAME || 'codebreaker',
// //   waitForConnections: true,
// //   connectionLimit: 10,
// // });

// // async function getPuzzle() {
// //   const [rows] = await pool.query('SELECT * FROM bt_level29_puzzle ORDER BY id LIMIT 1');
// //   return rows[0];
// // }

// // async function ensureProgress(userId) {
// //   await pool.query('INSERT IGNORE INTO bt_level29_progress (user_id) VALUES (?)', [userId]);
// // }

// // // GET /api/braintwist/level29?userId=abc  -> puzzle (answer anuppa maatom)
// // router.get('/level29', async (req, res) => {
// //   try {
// //     const userId = String(req.query.userId || '').trim();
// //     if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

// //     const puzzle = await getPuzzle();
// //     if (!puzzle) return res.status(404).json({ success: false, message: 'Puzzle not found' });

// //     await ensureProgress(userId);
// //     const [rows] = await pool.query('SELECT * FROM bt_level29_progress WHERE user_id = ?', [userId]);
// //     const p = rows[0];

// //     res.json({
// //       success: true,
// //       level: 29,
// //       question: puzzle.question,
// //       spots: puzzle.spots.split(','),
// //       hintCost: puzzle.hint_cost,
// //       skipCost: puzzle.skip_cost,
// //       videoReward: puzzle.video_reward,
// //       progress: {
// //         attempts: p.attempts,
// //         solved: !!p.solved,
// //         skipped: !!p.skipped,
// //         hintUsed: !!p.hint_used,
// //       },
// //     });
// //   } catch (err) {
// //     console.error('level29 get error', err);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // POST /api/braintwist/level29/submit  { userId, answer }
// // router.post('/level29/submit', async (req, res) => {
// //   try {
// //     const userId = String(req.body.userId || '').trim();
// //     const answer = String(req.body.answer || '').trim();
// //     if (!userId || !answer) {
// //       return res.status(400).json({ success: false, message: 'userId and answer required' });
// //     }

// //     const puzzle = await getPuzzle();
// //     await ensureProgress(userId);

// //     const correct = answer === puzzle.answer;

// //     if (correct) {
// //       await pool.query(
// //         `UPDATE bt_level29_progress
// //          SET attempts = attempts + 1, solved = 1, last_answer = ?, solved_at = NOW()
// //          WHERE user_id = ?`,
// //         [answer, userId]
// //       );
// //     } else {
// //       await pool.query(
// //         'UPDATE bt_level29_progress SET attempts = attempts + 1, last_answer = ? WHERE user_id = ?',
// //         [answer, userId]
// //       );
// //     }

// //     const [rows] = await pool.query('SELECT attempts FROM bt_level29_progress WHERE user_id = ?', [userId]);

// //     res.json({
// //       success: true,
// //       correct,
// //       attempts: rows[0].attempts,
// //       message: correct ? 'Correct! 🎉' : 'Wrong answer, try again!',
// //       nextLevel: correct ? 30 : null,
// //     });
// //   } catch (err) {
// //     console.error('level29 submit error', err);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // POST /api/braintwist/level29/hint  { userId }
// // router.post('/level29/hint', async (req, res) => {
// //   try {
// //     const userId = String(req.body.userId || '').trim();
// //     if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

// //     const puzzle = await getPuzzle();
// //     await ensureProgress(userId);
// //     await pool.query('UPDATE bt_level29_progress SET hint_used = 1 WHERE user_id = ?', [userId]);

// //     res.json({ success: true, hint: puzzle.hint_text, cost: puzzle.hint_cost });
// //   } catch (err) {
// //     console.error('level29 hint error', err);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // POST /api/braintwist/level29/skip  { userId }
// // router.post('/level29/skip', async (req, res) => {
// //   try {
// //     const userId = String(req.body.userId || '').trim();
// //     if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

// //     const puzzle = await getPuzzle();
// //     await ensureProgress(userId);
// //     await pool.query('UPDATE bt_level29_progress SET skipped = 1 WHERE user_id = ?', [userId]);

// //     res.json({ success: true, cost: puzzle.skip_cost, nextLevel: 30 });
// //   } catch (err) {
// //     console.error('level29 skip error', err);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // module.exports = router;
// // routes/Braintwistlevel29routes.js
// // Mounted at /api/braintwist/level29
// // (/start, /answer, /hint, /skip, /reward, /status/:playerId) - saved in SQL (data/level29Db.js)
// const express = require("express");
// const db = require("../data/level29Db");

// const router = express.Router();

// const pid = (req) => String(req.body?.playerId ?? req.query?.playerId ?? "").trim();
// const fail = (res, code, msg) => res.status(code).json({ success: false, error: msg });

// // START: puzzle anuppum (answer anuppa maatom)
// async function start(req, res) {
//   try {
//     const playerId = pid(req);
//     if (!playerId) return fail(res, 400, "playerId required");
//     const puzzle = await db.getPuzzle();
//     const p = await db.ensureProgress(playerId);
//     const hints = await db.getHints(playerId);
//     res.json({
//       success: true,
//       level: 29,
//       question: puzzle.question,
//       spots: puzzle.spots,
//       hintCost: db.HINT_COST,
//       skipCost: db.SKIP_COST,
//       videoReward: db.VIDEO_REWARD,
//       hints,
//       progress: { attempts: p.attempts, solved: !!p.solved, skipped: !!p.skipped, hintUsed: !!p.hint_used },
//     });
//   } catch (e) {
//     console.error("[level29] start", e);
//     fail(res, 500, e.message);
//   }
// }
// router.post("/start", start);
// router.get("/start", start);

// // ANSWER
// router.post("/answer", async (req, res) => {
//   try {
//     const playerId = pid(req);
//     const answer = String(req.body?.answer ?? "").trim();
//     if (!playerId || !answer) return fail(res, 400, "playerId and answer required");
//     const puzzle = await db.getPuzzle();
//     const correct = answer === puzzle.answer;
//     const attempts = await db.saveAnswer(playerId, answer, correct);
//     res.json({ success: true, correct, attempts, message: correct ? "Correct!" : "Not quite. Try again!" });
//   } catch (e) {
//     console.error("[level29] answer", e);
//     fail(res, 500, e.message);
//   }
// });

// // HINT (25 bulbs)
// router.post("/hint", async (req, res) => {
//   try {
//     const playerId = pid(req);
//     if (!playerId) return fail(res, 400, "playerId required");
//     const bal = await db.getHints(playerId);
//     if (bal === null) return fail(res, 404, "player not found");
//     if (bal < db.HINT_COST) return res.status(402).json({ success: false, error: "Not enough hints", hints: bal });
//     const hints = await db.addHints(playerId, -db.HINT_COST);
//     await db.markHint(playerId);
//     const puzzle = await db.getPuzzle();
//     res.json({ success: true, hints, hint: { text: puzzle.hint } });
//   } catch (e) {
//     console.error("[level29] hint", e);
//     fail(res, 500, e.message);
//   }
// });

// // SKIP (50 bulbs)
// router.post("/skip", async (req, res) => {
//   try {
//     const playerId = pid(req);
//     if (!playerId) return fail(res, 400, "playerId required");
//     const bal = await db.getHints(playerId);
//     if (bal === null) return fail(res, 404, "player not found");
//     if (bal < db.SKIP_COST) return res.status(402).json({ success: false, error: "Not enough hints", hints: bal });
//     const hints = await db.addHints(playerId, -db.SKIP_COST);
//     await db.markSkip(playerId);
//     const p = await db.ensureProgress(playerId);
//     res.json({ success: true, hints, skipped: true, attempts: p.attempts });
//   } catch (e) {
//     console.error("[level29] skip", e);
//     fail(res, 500, e.message);
//   }
// });

// // REWARD (video +75)
// router.post("/reward", async (req, res) => {
//   try {
//     const playerId = pid(req);
//     if (!playerId) return fail(res, 400, "playerId required");
//     const hints = await db.addHints(playerId, db.VIDEO_REWARD);
//     res.json({ success: true, hints, added: db.VIDEO_REWARD });
//   } catch (e) {
//     console.error("[level29] reward", e);
//     fail(res, 500, e.message);
//   }
// });

// // STATUS
// router.get("/status/:playerId", async (req, res) => {
//   try {
//     const p = await db.ensureProgress(req.params.playerId);
//     res.json({
//       success: true,
//       attempts: p.attempts,
//       solved: !!p.solved,
//       skipped: !!p.skipped,
//       hintUsed: !!p.hint_used,
//     });
//   } catch (e) {
//     console.error("[level29] status", e);
//     fail(res, 500, e.message);
//   }
// });

// module.exports = router;
// routes/Braintwistlevel29routes.js
// Mounted at /api/braintwist/level29
// (/start, /answer, /hint, /skip, /reward, /status/:playerId) - saved in SQL (data/level29Db.js)
const express = require('express');
const db = require('../data/level29Db');

const router = express.Router();

const pid = (req) => String(req.body?.playerId ?? req.query?.playerId ?? '').trim();
const fail = (res, code, msg) => res.status(code).json({ success: false, error: msg });

// START: puzzle anuppum (answer anuppa maatom)
async function start(req, res) {
  try {
    const playerId = pid(req);
    if (!playerId) return fail(res, 400, 'playerId required');
    const puzzle = await db.getPuzzle();
    const p = await db.ensureProgress(playerId);
    const hints = await db.getHints(playerId);
    res.json({
      success: true,
      level: db.LEVEL,
      question: puzzle.question,
      spots: puzzle.spots,
      hintCost: db.HINT_COST,
      skipCost: db.SKIP_COST,
      videoReward: db.VIDEO_REWARD,
      hints,
      progress: {
        attempts: p.attempts,
        solved: !!p.solved,
        skipped: !!p.skipped,
        hintUsed: !!p.hint_used,
      },
    });
  } catch (e) {
    console.error('[level29] start', e);
    fail(res, 500, e.message);
  }
}
router.post('/start', start);
router.get('/start', start);

// ANSWER
router.post('/answer', async (req, res) => {
  try {
    const playerId = pid(req);
    const answer = String(req.body?.answer ?? '').trim();
    if (!playerId || !answer) return fail(res, 400, 'playerId and answer required');
    const puzzle = await db.getPuzzle();
    const correct = answer === puzzle.answer;
    const attempts = await db.saveAnswer(playerId, answer, correct);
    res.json({
      success: true,
      correct,
      attempts,
      message: correct ? 'Correct!' : 'Not quite. Try again!',
    });
  } catch (e) {
    console.error('[level29] answer', e);
    fail(res, 500, e.message);
  }
});

// HINT (25 hints)
router.post('/hint', async (req, res) => {
  try {
    const playerId = pid(req);
    if (!playerId) return fail(res, 400, 'playerId required');
    const hints = await db.spendHints(playerId, db.HINT_COST);
    if (hints === null) {
      return res.status(402).json({ success: false, error: 'Not enough hints', hints: await db.getHints(playerId) });
    }
    await db.markHint(playerId);
    const puzzle = await db.getPuzzle();
    res.json({ success: true, hints, hint: { text: puzzle.hint } });
  } catch (e) {
    console.error('[level29] hint', e);
    fail(res, 500, e.message);
  }
});

// SKIP (50 hints)
router.post('/skip', async (req, res) => {
  try {
    const playerId = pid(req);
    if (!playerId) return fail(res, 400, 'playerId required');
    const hints = await db.spendHints(playerId, db.SKIP_COST);
    if (hints === null) {
      return res.status(402).json({ success: false, error: 'Not enough hints', hints: await db.getHints(playerId) });
    }
    await db.markSkip(playerId);
    const p = await db.ensureProgress(playerId);
    res.json({ success: true, hints, skipped: true, attempts: p.attempts });
  } catch (e) {
    console.error('[level29] skip', e);
    fail(res, 500, e.message);
  }
});

// REWARD (video +75)
router.post('/reward', async (req, res) => {
  try {
    const playerId = pid(req);
    if (!playerId) return fail(res, 400, 'playerId required');
    const hints = await db.addHints(playerId, db.VIDEO_REWARD);
    res.json({ success: true, hints, added: db.VIDEO_REWARD });
  } catch (e) {
    console.error('[level29] reward', e);
    fail(res, 500, e.message);
  }
});

// STATUS
router.get('/status/:playerId', async (req, res) => {
  try {
    const p = await db.ensureProgress(req.params.playerId);
    res.json({
      success: true,
      attempts: p.attempts,
      solved: !!p.solved,
      skipped: !!p.skipped,
      hintUsed: !!p.hint_used,
    });
  } catch (e) {
    console.error('[level29] status', e);
    fail(res, 500, e.message);
  }
});

module.exports = router;