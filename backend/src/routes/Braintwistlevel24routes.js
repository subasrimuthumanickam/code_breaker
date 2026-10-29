// // const express = require('express');
// // const router = express.Router();
// // const db = require('../db'); // mysql2/promise pool - use the same import as Braintwistlevel23routes.js

// // const QUESTION =
// //   'When I was 4 years old, my younger sister was half my age. If I am now 20 years old, how old is my younger sister?';

// // const OPTIONS = [
// //   { id: 'A', text: '10 years' },
// //   { id: 'B', text: '16 years' },
// //   { id: 'C', text: '18 years' },
// // ];
// // const CORRECT = 'C';

// // // If you don't have this table yet, run in phpMyAdmin:
// // // CREATE TABLE bt_level24_sessions (
// // //   id INT AUTO_INCREMENT PRIMARY KEY,
// // //   user_id INT NULL,
// // //   attempts INT NOT NULL DEFAULT 0,
// // //   completed TINYINT(1) NOT NULL DEFAULT 0,
// // //   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// // // );

// // // POST /api/braintwist/level24/start
// // router.post('/start', async (req, res) => {
// //   try {
// //     const userId = req.user?.id || null; // set by your auth middleware, same as other levels
// //     const [r] = await db.query('INSERT INTO bt_level24_sessions (user_id) VALUES (?)', [userId]);
// //     res.json({ sessionId: r.insertId, question: QUESTION, options: OPTIONS });
// //   } catch (e) {
// //     console.error('level24 start', e);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // });

// // // POST /api/braintwist/level24/answer
// // router.post('/answer', async (req, res) => {
// //   try {
// //     const { sessionId, optionId } = req.body;
// //     if (!sessionId || !OPTIONS.some((o) => o.id === optionId)) {
// //       return res.status(400).json({ error: 'Invalid request' });
// //     }

// //     const [rows] = await db.query('SELECT * FROM bt_level24_sessions WHERE id = ?', [sessionId]);
// //     if (!rows.length) return res.status(404).json({ error: 'Session not found' });

// //     const attempts = rows[0].attempts + 1;
// //     const correct = optionId === CORRECT;

// //     await db.query(
// //       'UPDATE bt_level24_sessions SET attempts = ?, completed = ? WHERE id = ?',
// //       [attempts, correct ? 1 : rows[0].completed, sessionId],
// //     );

// //     res.json(correct ? { correct: true, correctId: CORRECT, attempts } : { correct: false, attempts });
// //   } catch (e) {
// //     console.error('level24 answer', e);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // });

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const db = require("../db"); // <-- use the SAME db import as Braintwistlevel23routes.js

// const QUESTION =
//   "When I was 4 years old, my younger sister was half my age. If I am now 20 years old, how old is my younger sister?";

// const OPTIONS = [
//   { id: "A", text: "10 years" },
//   { id: "B", text: "16 years" },
//   { id: "C", text: "18 years" },
// ];
// const CORRECT = "C"; // sister is 2 years younger, so 20 - 2 = 18

// /* Run once in phpMyAdmin (SQL tab):
// CREATE TABLE IF NOT EXISTS bt_level24_sessions (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   player_id INT NOT NULL,
//   attempts INT NOT NULL DEFAULT 0,
//   completed TINYINT(1) NOT NULL DEFAULT 0,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   INDEX (player_id)
// );
// */

// router.post("/start", async (req, res, next) => {
//   try {
//     const { playerId } = req.body;
//     if (!playerId) return res.status(400).json({ success: false, error: "playerId required" });
//     const [r] = await db.query(
//       "INSERT INTO bt_level24_sessions (player_id) VALUES (?)",
//       [playerId]
//     );
//     res.json({ success: true, sessionId: r.insertId, question: QUESTION, options: OPTIONS });
//   } catch (e) { next(e); }
// });

// router.post("/answer", async (req, res, next) => {
//   try {
//     const { playerId, sessionId, optionId } = req.body;
//     if (!playerId || !sessionId || !OPTIONS.some((o) => o.id === optionId)) {
//       return res.status(400).json({ success: false, error: "Invalid request" });
//     }
//     const [rows] = await db.query(
//       "SELECT * FROM bt_level24_sessions WHERE id = ? AND player_id = ?",
//       [sessionId, playerId]
//     );
//     if (!rows.length) return res.status(404).json({ success: false, error: "Session not found" });

//     const attempts = rows[0].attempts + 1;
//     const correct = optionId === CORRECT;
//     await db.query(
//       "UPDATE bt_level24_sessions SET attempts = ?, completed = ? WHERE id = ?",
//       [attempts, correct ? 1 : rows[0].completed, sessionId]
//     );
//     res.json({ success: true, correct, attempts });
//   } catch (e) { next(e); }
// });

// router.get("/status/:playerId", async (req, res, next) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT COUNT(*) AS runs, MAX(completed) AS completed, MIN(CASE WHEN completed=1 THEN attempts END) AS best FROM bt_level24_sessions WHERE player_id = ?",
//       [req.params.playerId]
//     );
//     res.json({ success: true, ...rows[0] });
//   } catch (e) { next(e); }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();

// Level 24 - younger sister's age. No database table needed:
// progress is saved by the normal level-complete flow (map routes).
const QUESTION =
  "When I was 4 years old, my younger sister was half my age. If I am now 20 years old, how old is my younger sister?";

const OPTIONS = [
  { id: "A", text: "10 years" },
  { id: "B", text: "16 years" },
  { id: "C", text: "18 years" },
];
const CORRECT = "C"; // sister is 2 years younger -> 20 - 2 = 18

router.post("/start", (req, res) => {
  res.json({ success: true, sessionId: Date.now(), question: QUESTION, options: OPTIONS });
});

router.post("/answer", (req, res) => {
  const { optionId, attempts } = req.body || {};
  if (!OPTIONS.some((o) => o.id === optionId)) {
    return res.status(400).json({ success: false, error: "Invalid option" });
  }
  res.json({
    success: true,
    correct: optionId === CORRECT,
    attempts: Math.max(1, Number(attempts) || 1),
  });
});

router.get("/status/:playerId", (req, res) => {
  res.json({ success: true, level: 24 });
});

module.exports = router;