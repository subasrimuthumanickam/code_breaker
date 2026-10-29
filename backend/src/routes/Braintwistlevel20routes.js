// // // backend/src/routes/Braintwistlevel20routes.js
// // // Mount in your app:  app.use('/api/braintwist/level20', require('./routes/Braintwistlevel20routes'));

// // const express = require('express');
// // const router = express.Router();

// // // TODO: match these two imports to what Braintwistlevel19routes.js uses
// // const pool = require('../config/db');                  // mysql2/promise pool
// // const auth = require('../middleware/authMiddleware');  // sets req.user.id

// // const QUESTION = {
// //   text: 'If a clock takes 5 seconds to strike 6 times, how many seconds will it take to strike 12 times?',
// //   options: [
// //     { key: 'A', label: '10' },
// //     { key: 'B', label: '11' },
// //     { key: 'C', label: '12' },
// //     { key: 'D', label: '15' },
// //   ],
// // };
// // const CORRECT_KEY = 'B'; // stays on the server only
// // const EXPLANATION =
// //   '6 strikes have 5 gaps, so each gap is 1 second. 12 strikes have 11 gaps, so 11 seconds.';

// // // POST /start  -> reuse the active session or create one, return the question
// // router.post('/start', auth, async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const [rows] = await pool.query(
// //       "SELECT id, attempts FROM bt_level20_sessions WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1",
// //       [userId]
// //     );
// //     let sessionId, attempts = 0;
// //     if (rows.length) {
// //       sessionId = rows[0].id;
// //       attempts = rows[0].attempts;
// //     } else {
// //       const [ins] = await pool.query('INSERT INTO bt_level20_sessions (user_id) VALUES (?)', [userId]);
// //       sessionId = ins.insertId;
// //     }
// //     res.json({ success: true, sessionId, attempts, question: QUESTION });
// //   } catch (err) {
// //     console.error('level20 start:', err);
// //     res.status(500).json({ success: false, message: 'Could not start level 20' });
// //   }
// // });

// // // POST /answer  { sessionId, choice }
// // router.post('/answer', auth, async (req, res) => {
// //   const conn = await pool.getConnection();
// //   try {
// //     const userId = req.user.id;
// //     const sessionId = Number(req.body.sessionId);
// //     const choice = String(req.body.choice || '').toUpperCase();

// //     if (!sessionId || !QUESTION.options.some(o => o.key === choice)) {
// //       return res.status(400).json({ success: false, message: 'Invalid request' });
// //     }

// //     await conn.beginTransaction();

// //     const [rows] = await conn.query(
// //       'SELECT id, status FROM bt_level20_sessions WHERE id = ? AND user_id = ? FOR UPDATE',
// //       [sessionId, userId]
// //     );
// //     if (!rows.length) {
// //       await conn.rollback();
// //       return res.status(404).json({ success: false, message: 'Session not found' });
// //     }
// //     if (rows[0].status === 'completed') {
// //       await conn.rollback();
// //       return res.status(409).json({ success: false, message: 'Level already completed' });
// //     }

// //     const isCorrect = choice === CORRECT_KEY;

// //     await conn.query(
// //       'INSERT INTO bt_level20_attempts (session_id, user_id, choice, is_correct) VALUES (?, ?, ?, ?)',
// //       [sessionId, userId, choice, isCorrect ? 1 : 0]
// //     );
// //     await conn.query(
// //       isCorrect
// //         ? "UPDATE bt_level20_sessions SET attempts = attempts + 1, status = 'completed', completed_at = NOW() WHERE id = ?"
// //         : 'UPDATE bt_level20_sessions SET attempts = attempts + 1 WHERE id = ?',
// //       [sessionId]
// //     );

// //     // TODO: on isCorrect, update brain_twist_progress the same way level 19 does
// //     // (mark level 20 complete / unlock next level / award coins).

// //     await conn.commit();

// //     res.json({
// //       success: true,
// //       correct: isCorrect,
// //       ...(isCorrect && { correctKey: CORRECT_KEY, explanation: EXPLANATION }),
// //     });
// //   } catch (err) {
// //     await conn.rollback();
// //     console.error('level20 answer:', err);
// //     res.status(500).json({ success: false, message: 'Could not check answer' });
// //   } finally {
// //     conn.release();
// //   }
// // });

// // module.exports = router;
// // backend/src/routes/Braintwistlevel20routes.js
// // Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// // (/start, /answer, /status/:playerId)

// const express = require("express");
// const router = express.Router();

// // TODO: use the same db import as Braintwistlevel19routes.js / data/level19Db.js
// const pool = require("../config/db"); // mysql2/promise pool

// const QUESTION = {
//   text: "If a clock takes 5 seconds to strike 6 times, how many seconds will it take to strike 12 times?",
//   options: [
//     { key: "A", label: "10" },
//     { key: "B", label: "11" },
//     { key: "C", label: "12" },
//     { key: "D", label: "15" },
//   ],
// };
// const CORRECT_KEY = "B"; // stays on the server only
// const EXPLANATION =
//   "6 strikes have 5 gaps, so each gap is 1 second. 12 strikes have 11 gaps, so 11 seconds.";

// const toId = (v) => {
//   const n = Number(v);
//   return Number.isInteger(n) && n > 0 ? n : null;
// };

// // POST /start  { playerId } -> reuse active session or create one, return the question
// router.post("/start", async (req, res, next) => {
//   try {
//     const playerId = toId(req.body.playerId);
//     if (!playerId) return res.status(400).json({ success: false, error: "playerId required" });

//     const [rows] = await pool.query(
//       "SELECT id, attempts FROM bt_level20_sessions WHERE player_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1",
//       [playerId]
//     );
//     let sessionId, attempts = 0;
//     if (rows.length) {
//       sessionId = rows[0].id;
//       attempts = rows[0].attempts;
//     } else {
//       const [ins] = await pool.query("INSERT INTO bt_level20_sessions (player_id) VALUES (?)", [playerId]);
//       sessionId = ins.insertId;
//     }
//     res.json({ success: true, sessionId, attempts, question: QUESTION });
//   } catch (err) {
//     next(err);
//   }
// });

// // POST /answer  { playerId, sessionId, choice }
// router.post("/answer", async (req, res, next) => {
//   let conn;
//   try {
//     const playerId = toId(req.body.playerId);
//     const sessionId = toId(req.body.sessionId);
//     const choice = String(req.body.choice || "").toUpperCase();

//     if (!playerId || !sessionId || !QUESTION.options.some((o) => o.key === choice)) {
//       return res.status(400).json({ success: false, error: "Invalid request" });
//     }

//     conn = await pool.getConnection();
//     await conn.beginTransaction();

//     const [rows] = await conn.query(
//       "SELECT id, status, attempts FROM bt_level20_sessions WHERE id = ? AND player_id = ? FOR UPDATE",
//       [sessionId, playerId]
//     );
//     if (!rows.length) {
//       await conn.rollback();
//       return res.status(404).json({ success: false, error: "Session not found" });
//     }
//     if (rows[0].status === "completed") {
//       await conn.rollback();
//       return res.status(409).json({ success: false, error: "Level already completed" });
//     }

//     const isCorrect = choice === CORRECT_KEY;
//     const attempts = rows[0].attempts + 1;

//     await conn.query(
//       "INSERT INTO bt_level20_attempts (session_id, player_id, choice, is_correct) VALUES (?, ?, ?, ?)",
//       [sessionId, playerId, choice, isCorrect ? 1 : 0]
//     );
//     await conn.query(
//       isCorrect
//         ? "UPDATE bt_level20_sessions SET attempts = ?, status = 'completed', completed_at = NOW() WHERE id = ?"
//         : "UPDATE bt_level20_sessions SET attempts = ? WHERE id = ?",
//       [attempts, sessionId]
//     );
//     await conn.commit();

//     // The app calls completeLevel() (map progress / stars) after a correct answer.
//     res.json({
//       success: true,
//       correct: isCorrect,
//       attempts,
//       ...(isCorrect && { correctKey: CORRECT_KEY, explanation: EXPLANATION }),
//     });
//   } catch (err) {
//     if (conn) await conn.rollback().catch(() => {});
//     next(err);
//   } finally {
//     if (conn) conn.release();
//   }
// });

// // GET /status/:playerId
// router.get("/status/:playerId", async (req, res, next) => {
//   try {
//     const playerId = toId(req.params.playerId);
//     if (!playerId) return res.status(400).json({ success: false, error: "Invalid playerId" });
//     const [rows] = await pool.query(
//       "SELECT COUNT(*) AS done FROM bt_level20_sessions WHERE player_id = ? AND status = 'completed'",
//       [playerId]
//     );
//     res.json({ success: true, completed: rows[0].done > 0 });
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;
// backend/src/routes/Braintwistlevel20routes.js
// Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// (/start, /answer, /status/:playerId)

const express = require("express");
const router = express.Router();

// ---- database pool ----
// Set DB_PATH to the same file your other routes use (see the db require line in
// Braintwistlevel19routes.js or data/level19Db.js). If left null, common locations are tried.
const DB_PATH = null; // example: "../db"  or  "../config/database"

function loadPool() {
  const candidates = DB_PATH
    ? [DB_PATH]
    : ["../db", "../config/db", "../config/database", "../database", "../data/db", "../utils/db", "../../db", "../db/pool", "../lib/db"];
  for (const c of candidates) {
    try {
      const mod = require(c);
      const raw = mod.pool || mod.db || mod.default || mod;
      return typeof raw.promise === "function" ? raw.promise() : raw; // normalise to the promise API
    } catch (e) {
      if (e.code !== "MODULE_NOT_FOUND" || !String(e.message).includes(c)) throw e;
    }
  }
  throw new Error("Level 20: db file not found. Set DB_PATH at the top of Braintwistlevel20routes.js");
}
const pool = loadPool();

const QUESTION = {
  text: "If a clock takes 5 seconds to strike 6 times, how many seconds will it take to strike 12 times?",
  options: [
    { key: "A", label: "10" },
    { key: "B", label: "11" },
    { key: "C", label: "12" },
    { key: "D", label: "15" },
  ],
};
const CORRECT_KEY = "B"; // stays on the server only
const EXPLANATION =
  "6 strikes have 5 gaps, so each gap is 1 second. 12 strikes have 11 gaps, so 11 seconds.";

const toId = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// POST /start  { playerId } -> reuse active session or create one, return the question
router.post("/start", async (req, res, next) => {
  try {
    const playerId = toId(req.body.playerId);
    if (!playerId) return res.status(400).json({ success: false, error: "playerId required" });

    const [rows] = await pool.query(
      "SELECT id, attempts FROM bt_level20_sessions WHERE player_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1",
      [playerId]
    );
    let sessionId, attempts = 0;
    if (rows.length) {
      sessionId = rows[0].id;
      attempts = rows[0].attempts;
    } else {
      const [ins] = await pool.query("INSERT INTO bt_level20_sessions (player_id) VALUES (?)", [playerId]);
      sessionId = ins.insertId;
    }
    res.json({ success: true, sessionId, attempts, question: QUESTION });
  } catch (err) {
    next(err);
  }
});

// POST /answer  { playerId, sessionId, choice }
router.post("/answer", async (req, res, next) => {
  let conn;
  try {
    const playerId = toId(req.body.playerId);
    const sessionId = toId(req.body.sessionId);
    const choice = String(req.body.choice || "").toUpperCase();

    if (!playerId || !sessionId || !QUESTION.options.some((o) => o.key === choice)) {
      return res.status(400).json({ success: false, error: "Invalid request" });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT id, status, attempts FROM bt_level20_sessions WHERE id = ? AND player_id = ? FOR UPDATE",
      [sessionId, playerId]
    );
    if (!rows.length) {
      await conn.rollback();
      return res.status(404).json({ success: false, error: "Session not found" });
    }
    if (rows[0].status === "completed") {
      await conn.rollback();
      return res.status(409).json({ success: false, error: "Level already completed" });
    }

    const isCorrect = choice === CORRECT_KEY;
    const attempts = rows[0].attempts + 1;

    await conn.query(
      "INSERT INTO bt_level20_attempts (session_id, player_id, choice, is_correct) VALUES (?, ?, ?, ?)",
      [sessionId, playerId, choice, isCorrect ? 1 : 0]
    );
    await conn.query(
      isCorrect
        ? "UPDATE bt_level20_sessions SET attempts = ?, status = 'completed', completed_at = NOW() WHERE id = ?"
        : "UPDATE bt_level20_sessions SET attempts = ? WHERE id = ?",
      [attempts, sessionId]
    );
    await conn.commit();

    // The app calls completeLevel() (map progress / stars) after a correct answer.
    res.json({
      success: true,
      correct: isCorrect,
      attempts,
      ...(isCorrect && { correctKey: CORRECT_KEY, explanation: EXPLANATION }),
    });
  } catch (err) {
    if (conn) await conn.rollback().catch(() => {});
    next(err);
  } finally {
    if (conn) conn.release();
  }
});

// GET /status/:playerId
router.get("/status/:playerId", async (req, res, next) => {
  try {
    const playerId = toId(req.params.playerId);
    if (!playerId) return res.status(400).json({ success: false, error: "Invalid playerId" });
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS done FROM bt_level20_sessions WHERE player_id = ? AND status = 'completed'",
      [playerId]
    );
    res.json({ success: true, completed: rows[0].done > 0 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;