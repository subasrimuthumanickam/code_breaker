// // // // backend/src/routes/Braintwistlevel32routes.js
// // // // Mount in app.js / server.js:
// // // //   app.use("/api/braintwist/level32", require("./routes/Braintwistlevel32routes"));
// // // const express = require("express");
// // // const db = require("../db/Level32Db");

// // // const router = express.Router();

// // // db.initLevel32Tables().catch((e) =>
// // //   console.error("Level32 table init failed:", e.message)
// // // );

// // // // POST /start  { playerId }  -> new session + shuffled options
// // // router.post("/start", async (req, res) => {
// // //   try {
// // //     const playerId = Number(req.body.playerId);
// // //     if (!playerId) return res.status(400).json({ success: false, message: "playerId required" });
// // //     const s = await db.createSession(playerId);
// // //     res.json({ success: true, data: s });
// // //   } catch (e) {
// // //     console.error(e);
// // //     res.status(500).json({ success: false, message: "Could not start level 32" });
// // //   }
// // // });

// // // // POST /answer  { sessionId, playerId, answer: "A"|"B"|"C"|"D" }
// // // router.post("/answer", async (req, res) => {
// // //   try {
// // //     const sessionId = Number(req.body.sessionId);
// // //     const playerId = Number(req.body.playerId);
// // //     const answer = String(req.body.answer || "").toUpperCase();

// // //     if (!sessionId || !playerId || !["A", "B", "C", "D"].includes(answer)) {
// // //       return res.status(400).json({ success: false, message: "Invalid request" });
// // //     }
// // //     const session = await db.getSession(sessionId);
// // //     if (!session || session.player_id !== playerId) {
// // //       return res.status(404).json({ success: false, message: "Session not found" });
// // //     }

// // //     const isCorrect = answer === session.correct_answer;
// // //     await db.saveAttempt({ sessionId, playerId, answer, isCorrect });

// // //     res.json({
// // //       success: true,
// // //       data: {
// // //         isCorrect,
// // //         correctAnswer: isCorrect ? session.correct_answer : null, // don't leak on wrong guess
// // //         message: isCorrect ? "Great job! That's the right shadow." : "Not quite. Look at the tail and fins again.",
// // //       },
// // //     });
// // //   } catch (e) {
// // //     console.error(e);
// // //     res.status(500).json({ success: false, message: "Could not save answer" });
// // //   }
// // // });

// // // // GET /progress/:playerId
// // // router.get("/progress/:playerId", async (req, res) => {
// // //   try {
// // //     const data = await db.getProgress(Number(req.params.playerId));
// // //     res.json({ success: true, data });
// // //   } catch (e) {
// // //     console.error(e);
// // //     res.status(500).json({ success: false, message: "Could not load progress" });
// // //   }
// // // });

// // // module.exports = router;
// // // backend/src/data/level32Db.js  - Brain Twist level 32 (find the correct shadow)
// // const mysql = require("mysql2/promise");

// // const pool = mysql.createPool({
// //   host: process.env.DB_HOST || "127.0.0.1",
// //   user: process.env.DB_USER || "root",
// //   password: process.env.DB_PASSWORD || "",
// //   database: process.env.DB_NAME || "code_breaker",
// //   waitForConnections: true,
// //   connectionLimit: 10,
// // });

// // const LETTERS = ["A", "B", "C", "D"];

// // async function init() {
// //   await pool.query(`CREATE TABLE IF NOT EXISTS braintwist_level32_config (
// //     id INT AUTO_INCREMENT PRIMARY KEY,
// //     question VARCHAR(255) NOT NULL,
// //     correct_variant VARCHAR(10) NOT NULL,
// //     variants JSON NOT NULL,
// //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
// //   await pool.query(`CREATE TABLE IF NOT EXISTS braintwist_level32_sessions (
// //     id INT AUTO_INCREMENT PRIMARY KEY,
// //     player_id INT NOT NULL,
// //     options JSON NOT NULL,
// //     correct_answer CHAR(1) NOT NULL,
// //     status ENUM('active','completed') DEFAULT 'active',
// //     started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// //     completed_at TIMESTAMP NULL,
// //     INDEX (player_id))`);
// //   await pool.query(`CREATE TABLE IF NOT EXISTS braintwist_level32_attempts (
// //     id INT AUTO_INCREMENT PRIMARY KEY,
// //     session_id INT NOT NULL,
// //     player_id INT NOT NULL,
// //     answer CHAR(1) NOT NULL,
// //     is_correct TINYINT(1) NOT NULL,
// //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// //     INDEX (session_id), INDEX (player_id))`);
// //   const [r] = await pool.query("SELECT COUNT(*) AS c FROM braintwist_level32_config");
// //   if (r[0].c === 0) {
// //     await pool.query(
// //       "INSERT INTO braintwist_level32_config (question, correct_variant, variants) VALUES (?,?,?)",
// //       ["Find the Correct Shadow", "v3", JSON.stringify(["v1", "v2", "v3", "v4"])]
// //     );
// //   }
// // }
// // const ready = init().catch((e) => console.error("[level32Db] init failed:", e.message));

// // const shuffle = (a) => {
// //   a = [...a];
// //   for (let i = a.length - 1; i > 0; i--) {
// //     const j = Math.floor(Math.random() * (i + 1));
// //     [a[i], a[j]] = [a[j], a[i]];
// //   }
// //   return a;
// // };

// // async function startSession(playerId) {
// //   await ready;
// //   const [rows] = await pool.query("SELECT * FROM braintwist_level32_config ORDER BY id DESC LIMIT 1");
// //   const c = rows[0];
// //   const variants = typeof c.variants === "string" ? JSON.parse(c.variants) : c.variants;
// //   const options = shuffle(variants).slice(0, 4);
// //   const correct = LETTERS[options.indexOf(c.correct_variant)];
// //   const [res] = await pool.query(
// //     "INSERT INTO braintwist_level32_sessions (player_id, options, correct_answer) VALUES (?,?,?)",
// //     [playerId, JSON.stringify(options), correct]
// //   );
// //   return { sessionId: res.insertId, question: c.question, target: c.correct_variant, options };
// // }

// // async function getSession(id) {
// //   await ready;
// //   const [r] = await pool.query("SELECT * FROM braintwist_level32_sessions WHERE id=?", [id]);
// //   return r[0] || null;
// // }

// // async function saveAttempt(sessionId, playerId, answer, isCorrect) {
// //   await pool.query(
// //     "INSERT INTO braintwist_level32_attempts (session_id, player_id, answer, is_correct) VALUES (?,?,?,?)",
// //     [sessionId, playerId, answer, isCorrect ? 1 : 0]
// //   );
// //   if (isCorrect)
// //     await pool.query(
// //       "UPDATE braintwist_level32_sessions SET status='completed', completed_at=NOW() WHERE id=?",
// //       [sessionId]
// //     );
// //   const [c] = await pool.query(
// //     "SELECT COUNT(*) AS n FROM braintwist_level32_attempts WHERE session_id=?",
// //     [sessionId]
// //   );
// //   return Number(c[0].n);
// // }

// // async function status(playerId) {
// //   await ready;
// //   const [a] = await pool.query(
// //     "SELECT COUNT(*) AS attempts, COALESCE(SUM(is_correct),0) AS correct FROM braintwist_level32_attempts WHERE player_id=?",
// //     [playerId]
// //   );
// //   const [s] = await pool.query(
// //     "SELECT COUNT(*) AS c FROM braintwist_level32_sessions WHERE player_id=? AND status='completed'",
// //     [playerId]
// //   );
// //   return { attempts: Number(a[0].attempts), correct: Number(a[0].correct), completed: s[0].c > 0 };
// // }

// // module.exports = { pool, startSession, getSession, saveAttempt, status };
// // Brain Twist level 32 - find the correct shadow
// // (/start, /answer, /status/:playerId) - saved in SQL (data/level32Db.js)
// const express = require("express");
// const db = require("../data/level32Db");
// const router = express.Router();

// const LETTERS = ["A", "B", "C", "D"];

// router.post("/start", async (req, res) => {
//   try {
//     const playerId = Number(req.body.playerId);
//     if (!playerId) return res.status(400).json({ success: false, error: "playerId required" });
//     const s = await db.startSession(playerId);
//     res.json({ success: true, ...s });
//   } catch (e) {
//     console.error("[level32 /start]", e);
//     res.status(500).json({ success: false, error: "Could not start level 32" });
//   }
// });

// router.post("/answer", async (req, res) => {
//   try {
//     const sessionId = Number(req.body.sessionId);
//     const playerId = Number(req.body.playerId);
//     const answer = String(req.body.answer || "").toUpperCase();
//     if (!sessionId || !playerId || !LETTERS.includes(answer))
//       return res.status(400).json({ success: false, error: "Invalid request" });

//     const s = await db.getSession(sessionId);
//     if (!s || s.player_id !== playerId)
//       return res.status(404).json({ success: false, error: "Session not found" });

//     const correct = answer === s.correct_answer;
//     const attempts = await db.saveAttempt(sessionId, playerId, answer, correct);
//     res.json({ success: true, correct, attempts, answer: correct ? s.correct_answer : null });
//   } catch (e) {
//     console.error("[level32 /answer]", e);
//     res.status(500).json({ success: false, error: "Could not save answer" });
//   }
// });

// router.get("/status/:playerId", async (req, res) => {
//   try {
//     res.json({ success: true, ...(await db.status(Number(req.params.playerId))) });
//   } catch (e) {
//     console.error("[level32 /status]", e);
//     res.status(500).json({ success: false, error: "Could not load status" });
//   }
// });

// module.exports = router;
// Brain Twist level 32 - find the correct shadow (drag the bird onto its shadow)
// (/start, /answer, /hint, /skip, /status/:playerId) - saved in SQL (data/level32Db.js)
// the video reward (+75) uses the shared reward route, same as the other levels
const express = require("express");
const db = require("../data/level32Db");
const router = express.Router();

const LETTERS = ["A", "B", "C", "D"];
const HINT_COST = 25;
const SKIP_COST = 50;

async function ownSession(req, res) {
  const sessionId = Number(req.body.sessionId);
  const playerId = Number(req.body.playerId);
  if (!sessionId || !playerId) {
    res.status(400).json({ success: false, error: "Invalid request" });
    return null;
  }
  const s = await db.getSession(sessionId);
  if (!s || s.player_id !== playerId) {
    res.status(404).json({ success: false, error: "Session not found" });
    return null;
  }
  return { s, sessionId, playerId };
}

router.post("/start", async (req, res) => {
  try {
    const playerId = Number(req.body.playerId);
    if (!playerId) return res.status(400).json({ success: false, error: "playerId required" });
    const s = await db.startSession(playerId);
    res.json({ success: true, ...s });
  } catch (e) {
    console.error("[level32 /start]", e);
    res.status(500).json({ success: false, error: "Could not start level 32" });
  }
});

router.post("/answer", async (req, res) => {
  try {
    const own = await ownSession(req, res);
    if (!own) return;
    const answer = String(req.body.answer || "").toUpperCase();
    if (!LETTERS.includes(answer))
      return res.status(400).json({ success: false, error: "Invalid answer" });

    const correct = answer === own.s.correct_answer;
    const attempts = await db.saveAttempt(own.sessionId, own.playerId, answer, correct);
    res.json({ success: true, correct, attempts, answer: correct ? own.s.correct_answer : null });
  } catch (e) {
    console.error("[level32 /answer]", e);
    res.status(500).json({ success: false, error: "Could not save answer" });
  }
});

// hint: removes one wrong shadow (costs 25 hints). body: {sessionId, playerId, hidden:["B"]}
router.post("/hint", async (req, res) => {
  try {
    const own = await ownSession(req, res);
    if (!own) return;
    const hidden = Array.isArray(req.body.hidden) ? req.body.hidden.map(String) : [];
    const wrong = LETTERS.filter((l) => l !== own.s.correct_answer && !hidden.includes(l));
    if (wrong.length <= 1)
      return res.status(400).json({ success: false, error: "No more hints for this puzzle" });

    const hints = await db.spendHints(own.playerId, HINT_COST);
    if (hints === null)
      return res.status(402).json({ success: false, error: "Not enough hints" });

    const remove = wrong[Math.floor(Math.random() * wrong.length)];
    res.json({ success: true, hints, remove });
  } catch (e) {
    console.error("[level32 /hint]", e);
    res.status(500).json({ success: false, error: e.message || "Could not use hint" });
  }
});

// skip: costs 50 hints, level counts as done
router.post("/skip", async (req, res) => {
  try {
    const own = await ownSession(req, res);
    if (!own) return;
    const hints = await db.spendHints(own.playerId, SKIP_COST);
    if (hints === null)
      return res.status(402).json({ success: false, error: "Not enough hints" });
    await db.completeSession(own.sessionId);
    res.json({ success: true, hints, skipped: true, attempts: 1 });
  } catch (e) {
    console.error("[level32 /skip]", e);
    res.status(500).json({ success: false, error: e.message || "Could not skip" });
  }
});

router.get("/status/:playerId", async (req, res) => {
  try {
    res.json({ success: true, ...(await db.status(Number(req.params.playerId))) });
  } catch (e) {
    console.error("[level32 /status]", e);
    res.status(500).json({ success: false, error: "Could not load status" });
  }
});

module.exports = router;