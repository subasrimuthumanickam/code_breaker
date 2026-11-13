// // // BrainTwistLevel35Routes.js
// // // Express routes for Brain Twist Level 35.
// // //
// // // Mount in your server:
// // //   app.use(express.json());
// // //   app.use('/api/braintwist/level35', require('./BrainTwistLevel35Routes'));
// // //
// // // Every response is JSON: { success: boolean, message?: string, ...data }

// // const express = require('express');
// // const db = require('./level35Db');

// // const router = express.Router();

// // // The answer lives ONLY on the server. Rock = 0, Paper = 5, Scissors = 2.
// // const ANSWER = '052';
// // const HINT_COST = 25;
// // const REVEAL_COST = 50;
// // const AD_REWARD = 75;

// // const HINTS = [
// //   'Rock, paper and scissors... think about your hand when you play.',
// //   'Count the fingers you show for each symbol.',
// //   'Rock = 0 (closed fist), Paper = 5 (open hand), Scissors = 2 (two fingers).',
// // ];

// // // Create tables on startup.
// // db.init().catch((err) => console.error('[level35] DB init failed:', err.message));

// // const wrap = (fn) => (req, res) =>
// //   Promise.resolve(fn(req, res)).catch((err) => {
// //     console.error('[level35]', err);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   });

// // function getUserId(req) {
// //   const id =
// //     (req.body && req.body.userId) || req.query.userId || req.get('x-user-id') || '';
// //   return /^[\w-]{1,64}$/.test(String(id)) ? String(id) : null;
// // }

// // function publicState(p) {
// //   return {
// //     level: 35,
// //     digits: 3,
// //     userId: p.user_id,
// //     bulbs: p.bulbs,
// //     coins: p.coins,
// //     attempts: p.attempts,
// //     hintsUsed: p.hints_used,
// //     solved: !!p.solved,
// //     solvedBy: p.solved_by,
// //     costs: { hint: HINT_COST, reveal: REVEAL_COST },
// //     adReward: AD_REWARD,
// //   };
// // }

// // // Reject requests without a valid userId before the handler runs.
// // router.use((req, res, next) => {
// //   const userId = getUserId(req);
// //   if (!userId) {
// //     return res.status(400).json({ success: false, message: 'Valid userId is required' });
// //   }
// //   req.userId = userId;
// //   next();
// // });

// // // GET /state?userId=abc
// // router.get(
// //   '/state',
// //   wrap(async (req, res) => {
// //     const progress = await db.getOrCreateProgress(req.userId);
// //     res.json({ success: true, progress: publicState(progress) });
// //   })
// // );

// // // POST /attempt  { userId, guess: "052" }
// // router.post(
// //   '/attempt',
// //   wrap(async (req, res) => {
// //     const guess = String((req.body && req.body.guess) ?? '');
// //     if (!/^\d{3}$/.test(guess)) {
// //       return res
// //         .status(400)
// //         .json({ success: false, message: 'Guess must be exactly 3 digits' });
// //     }
// //     const correct = guess === ANSWER;
// //     const progress = await db.recordAttempt(req.userId, guess, correct);
// //     res.json({
// //       success: true,
// //       correct,
// //       message: correct ? 'Correct! Level complete.' : 'Wrong answer, try again.',
// //       progress: publicState(progress),
// //     });
// //   })
// // );

// // // POST /hint  { userId }  (costs 25 bulbs)
// // router.post(
// //   '/hint',
// //   wrap(async (req, res) => {
// //     const progress = await db.useHint(req.userId, HINT_COST);
// //     if (!progress) {
// //       return res.status(402).json({ success: false, message: 'Not enough bulbs for a hint' });
// //     }
// //     const hint = HINTS[Math.min(progress.hints_used, HINTS.length) - 1];
// //     res.json({ success: true, hint, progress: publicState(progress) });
// //   })
// // );

// // // POST /reveal  { userId }  (costs 50 bulbs, solves the level)
// // router.post(
// //   '/reveal',
// //   wrap(async (req, res) => {
// //     const progress = await db.revealAnswer(req.userId, REVEAL_COST);
// //     if (!progress) {
// //       return res
// //         .status(402)
// //         .json({ success: false, message: 'Not enough bulbs to reveal the answer' });
// //     }
// //     res.json({ success: true, answer: ANSWER, progress: publicState(progress) });
// //   })
// // );

// // // POST /reward-ad  { userId }  (+75 coins after a rewarded video)
// // router.post(
// //   '/reward-ad',
// //   wrap(async (req, res) => {
// //     const progress = await db.addCoins(req.userId, AD_REWARD);
// //     res.json({ success: true, reward: AD_REWARD, progress: publicState(progress) });
// //   })
// // );

// // module.exports = router;
// // data/level35Db.js
// // SQL layer for Brain Twist Level 35 (MySQL / MariaDB via mysql2).
// // Install: npm i mysql2
// // Env (same .env as the server): DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   port: Number(process.env.DB_PORT || 3306),
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'codebreaker',
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// const START_BULBS = 210;

// async function init() {
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS bt_level35_progress (
//       player_id   VARCHAR(64) NOT NULL PRIMARY KEY,
//       bulbs       INT NOT NULL DEFAULT ${START_BULBS},
//       attempts    INT NOT NULL DEFAULT 0,
//       hints_used  INT NOT NULL DEFAULT 0,
//       solved      TINYINT(1) NOT NULL DEFAULT 0,
//       solved_by   VARCHAR(10) NULL,
//       solved_at   DATETIME NULL,
//       created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//     )
//   `);
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS bt_level35_attempts (
//       id          BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//       player_id   VARCHAR(64) NOT NULL,
//       guess       CHAR(3) NOT NULL,
//       is_correct  TINYINT(1) NOT NULL,
//       created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//       INDEX idx_player (player_id)
//     )
//   `);
// }

// async function getOrCreateProgress(playerId) {
//   await pool.query(
//     'INSERT IGNORE INTO bt_level35_progress (player_id, bulbs) VALUES (?, ?)',
//     [playerId, START_BULBS]
//   );
//   const [rows] = await pool.query(
//     'SELECT * FROM bt_level35_progress WHERE player_id = ?',
//     [playerId]
//   );
//   return rows[0];
// }

// // Saves the guess and updates counters. Marks solved on a correct guess.
// async function recordAttempt(playerId, guess, isCorrect) {
//   await getOrCreateProgress(playerId);
//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();
//     await conn.query(
//       'INSERT INTO bt_level35_attempts (player_id, guess, is_correct) VALUES (?, ?, ?)',
//       [playerId, guess, isCorrect ? 1 : 0]
//     );
//     await conn.query(
//       'UPDATE bt_level35_progress SET attempts = attempts + 1 WHERE player_id = ?',
//       [playerId]
//     );
//     if (isCorrect) {
//       await conn.query(
//         `UPDATE bt_level35_progress
//             SET solved = 1, solved_by = 'guess', solved_at = NOW()
//           WHERE player_id = ?`,
//         [playerId]
//       );
//     }
//     await conn.commit();
//   } catch (err) {
//     await conn.rollback();
//     throw err;
//   } finally {
//     conn.release();
//   }
//   return getOrCreateProgress(playerId);
// }

// // Spends bulbs for a hint. Returns null if the player cannot afford it.
// async function useHint(playerId, cost) {
//   await getOrCreateProgress(playerId);
//   const [res] = await pool.query(
//     `UPDATE bt_level35_progress
//         SET bulbs = bulbs - ?, hints_used = hints_used + 1
//       WHERE player_id = ? AND bulbs >= ?`,
//     [cost, playerId, cost]
//   );
//   if (res.affectedRows === 0) return null;
//   return getOrCreateProgress(playerId);
// }

// // Spends bulbs to skip (reveal) and marks the level solved. Null if too poor.
// async function skipLevel(playerId, cost) {
//   await getOrCreateProgress(playerId);
//   const [res] = await pool.query(
//     `UPDATE bt_level35_progress
//         SET bulbs = bulbs - ?, solved = 1, solved_by = 'skip', solved_at = NOW()
//       WHERE player_id = ? AND bulbs >= ?`,
//     [cost, playerId, cost]
//   );
//   if (res.affectedRows === 0) return null;
//   return getOrCreateProgress(playerId);
// }

// // Rewarded video: +amount bulbs.
// async function addBulbs(playerId, amount) {
//   await getOrCreateProgress(playerId);
//   await pool.query(
//     'UPDATE bt_level35_progress SET bulbs = bulbs + ? WHERE player_id = ?',
//     [amount, playerId]
//   );
//   return getOrCreateProgress(playerId);
// }

// module.exports = {
//   pool,
//   init,
//   getOrCreateProgress,
//   recordAttempt,
//   useHint,
//   skipLevel,
//   addBulbs,
// };
// backend/src/routes/BrainTwistLevel35Routes.js
// Brain Twist level 35 - rock paper scissors = ? ? ?  (the answer is 052)
// (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level35Db.js)
const express = require('express');
const router = express.Router();
const db = require('../data/level35Db');

db.initTables().catch((e) => console.error('[level35] init error:', e));

const getPlayerId = (req) => Number(req.body?.playerId ?? req.query?.playerId);

// ---- START: question + hints + progress ----
const start = async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: 'playerId required' });
    }

    const progress = await db.getProgress(playerId);
    const hints = await db.getHints(playerId);

    res.json({
      success: true,
      level: db.LEVEL_NO,
      question: db.QUESTION, // the answer is NOT sent to the frontend
      hints,
      progress: {
        status: progress.status,
        attempts: progress.attempts,
        hintsUsed: progress.hints_used,
        skipped: !!progress.skipped,
      },
    });
  } catch (e) {
    console.error('[level35] start', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
router.get('/start', start);
router.post('/start', start);

// ---- ANSWER: { playerId, answer: '052' } ----
router.post('/answer', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    const answer = String(req.body?.answer ?? '').trim();
    if (!playerId || !/^\d{3}$/.test(answer)) {
      return res.status(400).json({ success: false, error: 'Answer must be exactly 3 digits' });
    }

    const isCorrect = db.isCorrectAnswer(answer);
    const rewarded = await db.saveAnswer(playerId, answer, isCorrect);
    const progress = await db.getProgress(playerId);
    const hints = await db.getHints(playerId);

    res.json({
      success: true,
      correct: isCorrect,
      reward: rewarded ? db.QUESTION.reward : 0,
      attempts: progress.attempts,
      hints,
      message: isCorrect ? 'Correct!' : 'Not quite. Try again!',
    });
  } catch (e) {
    console.error('[level35] answer', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ---- HINT ----
router.post('/hint', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: 'playerId required' });
    }

    await db.getProgress(playerId);
    const used = await db.markHintUsed(playerId);

    res.json({
      success: true,
      free: true,
      cost: 0,
      hints: await db.getHints(playerId),
      hint: { text: db.hintText(used) },
    });
  } catch (e) {
    console.error('[level35] hint', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ---- SKIP ----
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
      correct: true,
      skipped: true,
      answer: db.ANSWER, // the skip button shows the answer
      attempts: progress.attempts,
      hints: spent.hints,
      message: 'Level skipped',
    });
  } catch (e) {
    console.error('[level35] skip', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ---- REWARD (video) ----
router.post('/reward', async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: 'playerId required' });
    }

    const hints = await db.addVideoReward(playerId);
    res.json({ success: true, hints, reward: db.QUESTION.videoReward });
  } catch (e) {
    console.error('[level35] reward', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;