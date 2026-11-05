
// // const express = require("express");
// // const router = express.Router();
// // const db = require("../db"); // mysql2/promise pool. Use the SAME import as your Level 21 route.

// // // The correct answer lives ONLY on the backend.
// // // Thief head start = 60 km/h x 0.5 h = 30 km. Relative speed = 75 - 60 = 15 km/h.
// // // Catch time = 30 / 15 = 2 h after 2:30 PM => 4:30 PM
// // const CORRECT_ANSWER = "4:30 PM";
// // const OPTIONS = ["3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"];
// // const REWARD_COINS = 75;

// // const QUESTION =
// //   "A thief steals a car at 2:00 PM and escapes at a speed of 60 km/h. " +
// //   "The police discover the theft at 2:30 PM and immediately chase the thief " +
// //   "in another car at a speed of 75 km/h. At what time will the police catch the thief?";

// // const getPlayerId = (req) =>
// //   req.body.playerId ||
// //   req.body.userId ||
// //   req.query.playerId ||
// //   req.query.userId ||
// //   req.params.playerId;

// // // POST /api/braintwist/level22/start   body: { playerId }
// // router.post("/start", async (req, res) => {
// //   try {
// //     const playerId = getPlayerId(req);
// //     if (!playerId) {
// //       return res.status(400).json({ success: false, error: "playerId required" });
// //     }

// //     const [result] = await db.query(
// //       "INSERT INTO bt_level22_sessions (user_id) VALUES (?)",
// //       [playerId]
// //     );

// //     res.json({
// //       success: true,
// //       sessionId: result.insertId,
// //       question: { text: QUESTION, options: OPTIONS },
// //     });
// //   } catch (err) {
// //     console.error("L22 start error:", err);
// //     res.status(500).json({ success: false, error: "Server error" });
// //   }
// // });

// // // POST /api/braintwist/level22/answer   body: { playerId, sessionId, answer }
// // router.post("/answer", async (req, res) => {
// //   try {
// //     const playerId = getPlayerId(req);
// //     const { sessionId, answer } = req.body;

// //     if (!playerId || !sessionId || !answer) {
// //       return res.status(400).json({
// //         success: false,
// //         error: "playerId, sessionId and answer required",
// //       });
// //     }
// //     if (!OPTIONS.includes(answer)) {
// //       return res.status(400).json({ success: false, error: "Invalid option" });
// //     }

// //     const [rows] = await db.query(
// //       "SELECT id, status, attempts FROM bt_level22_sessions WHERE id = ? AND user_id = ?",
// //       [sessionId, playerId]
// //     );
// //     if (rows.length === 0) {
// //       return res.status(404).json({ success: false, error: "Session not found" });
// //     }
// //     if (rows[0].status === "completed") {
// //       return res.json({
// //         success: true,
// //         correct: true,
// //         attempts: rows[0].attempts,
// //         coins: 0,
// //         message: "Already completed",
// //       });
// //     }

// //     const isCorrect = answer === CORRECT_ANSWER;
// //     const attempts = rows[0].attempts + 1;

// //     await db.query(
// //       "INSERT INTO bt_level22_attempts (session_id, user_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)",
// //       [sessionId, playerId, answer, isCorrect ? 1 : 0]
// //     );

// //     if (isCorrect) {
// //       await db.query(
// //         "UPDATE bt_level22_sessions SET attempts = ?, status = 'completed', completed_at = NOW() WHERE id = ?",
// //         [attempts, sessionId]
// //       );
// //     } else {
// //       await db.query(
// //         "UPDATE bt_level22_sessions SET attempts = ? WHERE id = ?",
// //         [attempts, sessionId]
// //       );
// //     }

// //     // NOTE: the app calls completeLevel() after onComplete, so
// //     // brain_twist_progress is updated there. Nothing more needed here.
// //     res.json({
// //       success: true,
// //       correct: isCorrect,
// //       attempts,
// //       coins: isCorrect ? REWARD_COINS : 0,
// //       explanation: isCorrect
// //         ? "Head start = 30 km, relative speed = 15 km/h, so 2 hours after 2:30 PM = 4:30 PM."
// //         : "Not quite. Try again!",
// //     });
// //   } catch (err) {
// //     console.error("L22 answer error:", err);
// //     res.status(500).json({ success: false, error: "Server error" });
// //   }
// // });

// // // GET /api/braintwist/level22/status/:playerId
// // router.get("/status/:playerId", async (req, res) => {
// //   try {
// //     const playerId = req.params.playerId;
// //     const [rows] = await db.query(
// //       `SELECT COUNT(*) AS sessions,
// //               COALESCE(SUM(status = 'completed'), 0) AS completed,
// //               COALESCE(SUM(attempts), 0) AS attempts
// //          FROM bt_level22_sessions WHERE user_id = ?`,
// //       [playerId]
// //     );
// //     res.json({
// //       success: true,
// //       sessions: rows[0].sessions,
// //       completed: Number(rows[0].completed) > 0,
// //       attempts: Number(rows[0].attempts),
// //     });
// //   } catch (err) {
// //     console.error("L22 status error:", err);
// //     res.status(500).json({ success: false, error: "Server error" });
// //   }
// // });

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const db = require("../db"); // mysql2/promise pool. Use the SAME import as your Level 21 route.
// const { ensureLevel22Tables } = require("./level22Db"); // same folder as this file

// // ---------------------------------------------------------------------------
// // Level 22: "Give them apples, but never leave the plate empty."
// //
// // 3 kids (0 = left, 1 = middle, 2 = right), 3 apples on one plate.
// // The app sends the moves the player made:
// //   "apple:K" = one loose apple given to kid K
// //   "plate:K" = the plate (with the apples still on it) given to kid K
// //
// // Correct solution (the answer lives ONLY here on the backend):
// //   apple:0, apple:1, plate:2
// //   -> the 3rd apple goes together with the plate, so the plate is never empty.
// // Giving the 3rd apple alone leaves the plate empty = wrong.
// // ---------------------------------------------------------------------------
// const STRICT_ORDER = true; // true: left kid first, then middle, then right. false: any order
// const REWARD_COINS = 75;
// const MAX_MOVES = 6;

// const QUESTION = "Give them apples, but never leave the plate empty.";

// ensureLevel22Tables().catch((e) => console.error("L22 tables:", e));

// const getPlayerId = (req) =>
//   req.body.playerId ||
//   req.body.userId ||
//   req.query.playerId ||
//   req.query.userId ||
//   req.params.playerId;

// // returns { ok, reason }
// function judge(moves) {
//   if (!Array.isArray(moves) || moves.length === 0 || moves.length > MAX_MOVES) {
//     return { ok: false, reason: "invalid" };
//   }

//   let apples = 3;
//   let plateGiven = false;
//   let last = -1;
//   const kids = [0, 0, 0];

//   for (const m of moves) {
//     const match = /^(apple|plate):([0-2])$/.exec(String(m));
//     if (!match) return { ok: false, reason: "invalid" };
//     if (plateGiven) return { ok: false, reason: "wrong" }; // nothing happens after the plate is gone

//     const type = match[1];
//     const kid = Number(match[2]);

//     if (STRICT_ORDER && kid !== last + 1) return { ok: false, reason: "order" };
//     last = kid;

//     if (type === "apple") {
//       if (apples <= 0) return { ok: false, reason: "wrong" };
//       apples -= 1;
//       kids[kid] += 1;
//       if (apples === 0) return { ok: false, reason: "empty" }; // last apple taken alone = empty plate
//     } else {
//       kids[kid] += apples; // the plate goes with whatever is still on it
//       apples = 0;
//       plateGiven = true;
//     }
//   }

//   const everyoneHasOne = kids[0] === 1 && kids[1] === 1 && kids[2] === 1;
//   if (plateGiven && everyoneHasOne) return { ok: true };
//   return { ok: false, reason: "wrong" };
// }

// const EXPLAIN = {
//   empty: "Oops! The plate was left empty.",
//   order: "Not quite. Start with the first kid on the left.",
//   wrong: "Not quite. Try again!",
//   invalid: "Not quite. Try again!",
// };

// // POST /api/braintwist/level22/start   body: { playerId }
// router.post("/start", async (req, res) => {
//   try {
//     const playerId = getPlayerId(req);
//     if (!playerId) {
//       return res.status(400).json({ success: false, error: "playerId required" });
//     }

//     await ensureLevel22Tables();

//     const [result] = await db.query(
//       "INSERT INTO bt_level22_sessions (user_id) VALUES (?)",
//       [playerId]
//     );

//     res.json({
//       success: true,
//       sessionId: result.insertId,
//       question: { text: QUESTION },
//     });
//   } catch (err) {
//     console.error("L22 start error:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// });

// // POST /api/braintwist/level22/answer   body: { playerId, sessionId, moves: ["apple:0", ...] }
// router.post("/answer", async (req, res) => {
//   try {
//     const playerId = getPlayerId(req);
//     const { sessionId, moves } = req.body;

//     if (!playerId || !sessionId || !Array.isArray(moves)) {
//       return res.status(400).json({
//         success: false,
//         error: "playerId, sessionId and moves required",
//       });
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

//     const verdict = judge(moves);
//     const isCorrect = verdict.ok;
//     const attempts = rows[0].attempts + 1;
//     const movesText = moves.map((m) => String(m)).join(",").slice(0, 250);

//     await db.query(
//       "INSERT INTO bt_level22_attempts (session_id, user_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)",
//       [sessionId, playerId, movesText, isCorrect ? 1 : 0]
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
//         ? "The last apple goes together with the plate, so the plate is never empty."
//         : EXPLAIN[verdict.reason] || EXPLAIN.wrong,
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

// ---------------------------------------------------------------------------
// Level 22: "Give them apples, but never leave the plate empty."
//
// 3 kids (0 = left, 1 = middle, 2 = right), 3 apples on one plate.
// The app sends the moves the player made:
//   "apple:K" = one loose apple given to kid K
//   "plate:K" = the plate (with the apples still on it) given to kid K
//
// Correct solution (the answer lives ONLY here on the backend):
//   apple:0, apple:1, plate:2
//   -> the 3rd apple goes together with the plate, so the plate is never empty.
// Giving the 3rd apple alone leaves the plate empty = wrong.
// ---------------------------------------------------------------------------
const STRICT_ORDER = true; // true: left kid first, then middle, then right. false: any order
const REWARD_COINS = 75;
const MAX_MOVES = 6;

const QUESTION = "Give them apples, but never leave the plate empty.";


// ---------------------------------------------------------------------------
// Tables (created automatically, safe to run many times)
// ---------------------------------------------------------------------------
let tablesReady = null;
function ensureLevel22Tables() {
  if (!tablesReady) {
    tablesReady = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS bt_level22_sessions (
          id           INT AUTO_INCREMENT PRIMARY KEY,
          user_id      INT NOT NULL,
          status       VARCHAR(20) NOT NULL DEFAULT 'started',
          attempts     INT NOT NULL DEFAULT 0,
          created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMP NULL DEFAULT NULL,
          INDEX idx_l22_sessions_user (user_id)
        )
      `);
      // selected_answer now stores the moves, e.g. "apple:0,apple:1,plate:2"
      await db.query(`
        CREATE TABLE IF NOT EXISTS bt_level22_attempts (
          id              INT AUTO_INCREMENT PRIMARY KEY,
          session_id      INT NOT NULL,
          user_id         INT NOT NULL,
          selected_answer VARCHAR(255) NOT NULL,
          is_correct      TINYINT(1) NOT NULL DEFAULT 0,
          created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_l22_attempts_session (session_id),
          INDEX idx_l22_attempts_user (user_id)
        )
      `);
      try {
        await db.query("ALTER TABLE bt_level22_attempts MODIFY selected_answer VARCHAR(255) NOT NULL");
      } catch (e) {
        console.error("L22 alter selected_answer:", e.message);
      }
    })().catch((e) => {
      tablesReady = null;
      throw e;
    });
  }
  return tablesReady;
}

ensureLevel22Tables().catch((e) => console.error("L22 tables:", e));

const getPlayerId = (req) =>
  req.body.playerId ||
  req.body.userId ||
  req.query.playerId ||
  req.query.userId ||
  req.params.playerId;

// returns { ok, reason }
function judge(moves) {
  if (!Array.isArray(moves) || moves.length === 0 || moves.length > MAX_MOVES) {
    return { ok: false, reason: "invalid" };
  }

  let apples = 3;
  let plateGiven = false;
  let last = -1;
  const kids = [0, 0, 0];

  for (const m of moves) {
    const match = /^(apple|plate):([0-2])$/.exec(String(m));
    if (!match) return { ok: false, reason: "invalid" };
    if (plateGiven) return { ok: false, reason: "wrong" }; // nothing happens after the plate is gone

    const type = match[1];
    const kid = Number(match[2]);

    if (STRICT_ORDER && kid !== last + 1) return { ok: false, reason: "order" };
    last = kid;

    if (type === "apple") {
      if (apples <= 0) return { ok: false, reason: "wrong" };
      apples -= 1;
      kids[kid] += 1;
      if (apples === 0) return { ok: false, reason: "empty" }; // last apple taken alone = empty plate
    } else {
      kids[kid] += apples; // the plate goes with whatever is still on it
      apples = 0;
      plateGiven = true;
    }
  }

  const everyoneHasOne = kids[0] === 1 && kids[1] === 1 && kids[2] === 1;
  if (plateGiven && everyoneHasOne) return { ok: true };
  return { ok: false, reason: "wrong" };
}

const EXPLAIN = {
  empty: "Oops! The plate was left empty.",
  order: "Not quite. Start with the first kid on the left.",
  wrong: "Not quite. Try again!",
  invalid: "Not quite. Try again!",
};

// POST /api/braintwist/level22/start   body: { playerId }
router.post("/start", async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    if (!playerId) {
      return res.status(400).json({ success: false, error: "playerId required" });
    }

    await ensureLevel22Tables();

    const [result] = await db.query(
      "INSERT INTO bt_level22_sessions (user_id) VALUES (?)",
      [playerId]
    );

    res.json({
      success: true,
      sessionId: result.insertId,
      question: { text: QUESTION },
    });
  } catch (err) {
    console.error("L22 start error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// POST /api/braintwist/level22/answer   body: { playerId, sessionId, moves: ["apple:0", ...] }
router.post("/answer", async (req, res) => {
  try {
    const playerId = getPlayerId(req);
    const { sessionId, moves } = req.body;

    if (!playerId || !sessionId || !Array.isArray(moves)) {
      return res.status(400).json({
        success: false,
        error: "playerId, sessionId and moves required",
      });
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

    const verdict = judge(moves);
    const isCorrect = verdict.ok;
    const attempts = rows[0].attempts + 1;
    const movesText = moves.map((m) => String(m)).join(",").slice(0, 250);

    await db.query(
      "INSERT INTO bt_level22_attempts (session_id, user_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)",
      [sessionId, playerId, movesText, isCorrect ? 1 : 0]
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
        ? "The last apple goes together with the plate, so the plate is never empty."
        : EXPLAIN[verdict.reason] || EXPLAIN.wrong,
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