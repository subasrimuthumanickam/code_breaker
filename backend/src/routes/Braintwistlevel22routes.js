// // const express = require('express');
// // const router = express.Router();
// // const db = require('../db'); // mysql2/promise pool - adjust path to your db file

// // // The correct answer lives ONLY on the backend.
// // // Thief head start = 60 km/h * 0.5 h = 30 km. Relative speed = 75 - 60 = 15 km/h.
// // // Time to catch = 30 / 15 = 2 h after 2:30 PM => 4:30 PM
// // const CORRECT_ANSWER = '4:30 PM';
// // const OPTIONS = ['3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'];

// // // Replace with your real auth (e.g. req.user.id from JWT middleware)
// // const getUserId = (req) =>
// //   (req.user && req.user.id) || req.body.userId || req.query.userId;

// // // POST /api/braintwist/level22/start
// // router.post('/start', async (req, res) => {
// //   try {
// //     const userId = getUserId(req);
// //     if (!userId) {
// //       return res.status(400).json({ success: false, message: 'userId required' });
// //     }

// //     const [result] = await db.query(
// //       'INSERT INTO bt_level22_sessions (user_id) VALUES (?)',
// //       [userId]
// //     );

// //     res.json({
// //       success: true,
// //       sessionId: result.insertId,
// //       question: {
// //         text:
// //           'A thief steals a car at 2:00 PM and escapes at a speed of 60 km/h. The police discover the theft at 2:30 PM and immediately chase the thief in another car at a speed of 75 km/h. At what time will the police catch the thief?',
// //         options: OPTIONS,
// //       },
// //     });
// //   } catch (err) {
// //     console.error('L22 start error:', err);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // POST /api/braintwist/level22/answer   body: { userId, sessionId, answer }
// // router.post('/answer', async (req, res) => {
// //   try {
// //     const userId = getUserId(req);
// //     const { sessionId, answer } = req.body;

// //     if (!userId || !sessionId || !answer) {
// //       return res
// //         .status(400)
// //         .json({ success: false, message: 'userId, sessionId, answer required' });
// //     }
// //     if (!OPTIONS.includes(answer)) {
// //       return res.status(400).json({ success: false, message: 'Invalid option' });
// //     }

// //     const [rows] = await db.query(
// //       'SELECT id, status FROM bt_level22_sessions WHERE id = ? AND user_id = ?',
// //       [sessionId, userId]
// //     );
// //     if (rows.length === 0) {
// //       return res.status(404).json({ success: false, message: 'Session not found' });
// //     }
// //     if (rows[0].status === 'completed') {
// //       return res.json({ success: true, correct: true, coins: 0, message: 'Already completed' });
// //     }

// //     const isCorrect = answer === CORRECT_ANSWER;

// //     await db.query(
// //       'INSERT INTO bt_level22_attempts (session_id, user_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)',
// //       [sessionId, userId, answer, isCorrect ? 1 : 0]
// //     );

// //     await db.query(
// //       'UPDATE bt_level22_sessions SET attempts = attempts + 1 WHERE id = ?',
// //       [sessionId]
// //     );

// //     if (isCorrect) {
// //       await db.query(
// //         "UPDATE bt_level22_sessions SET status = 'completed', completed_at = NOW() WHERE id = ?",
// //         [sessionId]
// //       );
// //       // TODO: update brain_twist_progress here (same as your level 20/21 routes)
// //     }

// //     res.json({
// //       success: true,
// //       correct: isCorrect,
// //       coins: isCorrect ? 75 : 0,
// //       explanation: isCorrect
// //         ? 'Head start = 30 km, relative speed = 15 km/h, so 2 hours after 2:30 PM = 4:30 PM.'
// //         : 'Not quite. Try again!',
// //     });
// //   } catch (err) {
// //     console.error('L22 answer error:', err);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // module.exports = router;

// // // In your main server file add:
// // // app.use('/api/braintwist/level22', require('./routes/Braintwistlevel22routes'));
// const express = require("express");
// const router = express.Router();
// const db = require("../db"); // mysql2/promise pool. Use the SAME import as your Level 21 route.

// // The correct answer lives ONLY on the backend.
// // Thief head start = 60 km/h x 0.5 h = 30 km. Relative speed = 75 - 60 = 15 km/h.
// // Catch time = 30 / 15 = 2 h after 2:30 PM => 4:30 PM
// const CORRECT_ANSWER = "4:30 PM";
// const OPTIONS = ["3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"];
// const REWARD_COINS = 75;

// const QUESTION =
//   "A thief steals a car at 2:00 PM and escapes at a speed of 60 km/h. " +
//   "The police discover the theft at 2:30 PM and immediately chase the thief " +
//   "in another car at a speed of 75 km/h. At what time will the police catch the thief?";

// const getPlayerId = (req) =>
//   req.body.playerId ||
//   req.body.userId ||
//   req.query.playerId ||
//   req.query.userId ||
//   req.params.playerId;

// // POST /api/braintwist/level22/start   body: { playerId }
// router.post("/start", async (req, res) => {
//   try {
//     const playerId = getPlayerId(req);
//     if (!playerId) {
//       return res.status(400).json({ success: false, error: "playerId required" });
//     }

//     const [result] = await db.query(
//       "INSERT INTO bt_level22_sessions (user_id) VALUES (?)",
//       [playerId]
//     );

//     res.json({
//       success: true,
//       sessionId: result.insertId,
//       question: { text: QUESTION, options: OPTIONS },
//     });
//   } catch (err) {
//     console.error("L22 start error:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// });

// // POST /api/braintwist/level22/answer   body: { playerId, sessionId, answer }
// router.post("/answer", async (req, res) => {
//   try {
//     const playerId = getPlayerId(req);
//     const { sessionId, answer } = req.body;

//     if (!playerId || !sessionId || !answer) {
//       return res.status(400).json({
//         success: false,
//         error: "playerId, sessionId and answer required",
//       });
//     }
//     if (!OPTIONS.includes(answer)) {
//       return res.status(400).json({ success: false, error: "Invalid option" });
//     }

//     const [rows] = await db.query(
//       "SELECT id, status, attempts FROM bt_level22_sessions WHERE id = ? AND user_id = ?",
//       [sessionId, playerId]
//     );
//     if (rows.length === 0) {
//       return res.status(404).json({ success: false, error: "Session not found" });
//     }
//     if (rows[0].status === "completed") {
//       return res.json({
//         success: true,
//         correct: true,
//         attempts: rows[0].attempts,
//         coins: 0,
//         message: "Already completed",
//       });
//     }

//     const isCorrect = answer === CORRECT_ANSWER;
//     const attempts = rows[0].attempts + 1;

//     await db.query(
//       "INSERT INTO bt_level22_attempts (session_id, user_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)",
//       [sessionId, playerId, answer, isCorrect ? 1 : 0]
//     );

//     if (isCorrect) {
//       await db.query(
//         "UPDATE bt_level22_sessions SET attempts = ?, status = 'completed', completed_at = NOW() WHERE id = ?",
//         [attempts, sessionId]
//       );
//     } else {
//       await db.query(
//         "UPDATE bt_level22_sessions SET attempts = ? WHERE id = ?",
//         [attempts, sessionId]
//       );
//     }

//     // NOTE: the app calls completeLevel() after onComplete, so
//     // brain_twist_progress is updated there. Nothing more needed here.
//     res.json({
//       success: true,
//       correct: isCorrect,
//       attempts,
//       coins: isCorrect ? REWARD_COINS : 0,
//       explanation: isCorrect
//         ? "Head start = 30 km, relative speed = 15 km/h, so 2 hours after 2:30 PM = 4:30 PM."
//         : "Not quite. Try again!",
//     });
//   } catch (err) {
//     console.error("L22 answer error:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// });

// // GET /api/braintwist/level22/status/:playerId
// router.get("/status/:playerId", async (req, res) => {
//   try {
//     const playerId = req.params.playerId;
//     const [rows] = await db.query(
//       `SELECT COUNT(*) AS sessions,
//               COALESCE(SUM(status = 'completed'), 0) AS completed,
//               COALESCE(SUM(attempts), 0) AS attempts
//          FROM bt_level22_sessions WHERE user_id = ?`,
//       [playerId]
//     );
//     res.json({
//       success: true,
//       sessions: rows[0].sessions,
//       completed: Number(rows[0].completed) > 0,
//       attempts: Number(rows[0].attempts),
//     });
//   } catch (err) {
//     console.error("L22 status error:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../db"); // mysql2/promise pool. Use the SAME import as your Level 21 route.

// The correct answer lives ONLY on the backend.
// Thief head start = 60 km/h x 0.5 h = 30 km. Relative speed = 75 - 60 = 15 km/h.
// Catch time = 30 / 15 = 2 h after 2:30 PM => 4:30 PM
const CORRECT_ANSWER = "4:30 PM";
const OPTIONS = ["3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"];
const REWARD_COINS = 75;

const QUESTION =
  "A thief steals a car at 2:00 PM and escapes at a speed of 60 km/h. " +
  "The police discover the theft at 2:30 PM and immediately chase the thief " +
  "in another car at a speed of 75 km/h. At what time will the police catch the thief?";

const getPlayerId = (req) =>
  req.body.playerId ||
  req.body.userId ||
  req.query.playerId ||
  req.query.userId ||
  req.params.playerId;

// POST /api/braintwist/level22/start   body: { playerId }
router.post("/start", async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: "playerId required" });
    }

    const [result] = await db.query(
      "INSERT INTO bt_level22_sessions (user_id) VALUES (?)",
      [playerId]
    );

    res.json({
      success: true,
      sessionId: result.insertId,
      question: { text: QUESTION, options: OPTIONS },
    });
  } catch (err) {
    console.error("L22 start error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// POST /api/braintwist/level22/answer   body: { playerId, sessionId, answer }
router.post("/answer", async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    const { sessionId, answer } = req.body;

    if (!playerId || !sessionId || !answer) {
      return res.status(400).json({
        success: false,
        error: "playerId, sessionId and answer required",
      });
    }
    if (!OPTIONS.includes(answer)) {
      return res.status(400).json({ success: false, error: "Invalid option" });
    }

    const [rows] = await db.query(
      "SELECT id, status, attempts FROM bt_level22_sessions WHERE id = ? AND user_id = ?",
      [sessionId, playerId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }
    if (rows[0].status === "completed") {
      return res.json({
        success: true,
        correct: true,
        attempts: rows[0].attempts,
        coins: 0,
        message: "Already completed",
      });
    }

    const isCorrect = answer === CORRECT_ANSWER;
    const attempts = rows[0].attempts + 1;

    await db.query(
      "INSERT INTO bt_level22_attempts (session_id, user_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)",
      [sessionId, playerId, answer, isCorrect ? 1 : 0]
    );

    if (isCorrect) {
      await db.query(
        "UPDATE bt_level22_sessions SET attempts = ?, status = 'completed', completed_at = NOW() WHERE id = ?",
        [attempts, sessionId]
      );
    } else {
      await db.query(
        "UPDATE bt_level22_sessions SET attempts = ? WHERE id = ?",
        [attempts, sessionId]
      );
    }

    // NOTE: the app calls completeLevel() after onComplete, so
    // brain_twist_progress is updated there. Nothing more needed here.
    res.json({
      success: true,
      correct: isCorrect,
      attempts,
      coins: isCorrect ? REWARD_COINS : 0,
      explanation: isCorrect
        ? "Head start = 30 km, relative speed = 15 km/h, so 2 hours after 2:30 PM = 4:30 PM."
        : "Not quite. Try again!",
    });
  } catch (err) {
    console.error("L22 answer error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET /api/braintwist/level22/status/:playerId
router.get("/status/:playerId", async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const [rows] = await db.query(
      `SELECT COUNT(*) AS sessions,
              COALESCE(SUM(status = 'completed'), 0) AS completed,
              COALESCE(SUM(attempts), 0) AS attempts
         FROM bt_level22_sessions WHERE user_id = ?`,
      [playerId]
    );
    res.json({
      success: true,
      sessions: rows[0].sessions,
      completed: Number(rows[0].completed) > 0,
      attempts: Number(rows[0].attempts),
    });
  } catch (err) {
    console.error("L22 status error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;