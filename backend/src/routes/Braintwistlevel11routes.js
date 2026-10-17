// // Brain Twist - Level 11
// // POST /start  /answer  /hint  /skip      GET /status/:playerId
// // Every response is JSON: { success: true|false, ... }

// const express = require("express");
// const router = express.Router();

// // !!! CHANGE THIS to the same db import your Braintwistlevel10routes.js uses !!!
// // (must be a mysql2/promise pool: pool.query(sql, params) -> [rows])
// const pool = require("../db");

// const { LEVEL, SCHEMA, isCorrect, normalize, starsFor } = require("../data/level11Db");

// /* ---------- hints balance (CHANGE if your table/column names differ) ---------- */
// const PLAYERS_TABLE = "bt_players";
// const HINTS_COLUMN = "hints";

// async function getHints(pid) {
//   const [r] = await pool.query(`SELECT ${HINTS_COLUMN} AS h FROM ${PLAYERS_TABLE} WHERE id=?`, [pid]);
//   return r[0] ? Number(r[0].h) : null;
// }
// async function spendHints(pid, cost) {
//   const [r] = await pool.query(
//     `UPDATE ${PLAYERS_TABLE} SET ${HINTS_COLUMN}=${HINTS_COLUMN}-? WHERE id=? AND ${HINTS_COLUMN}>=?`,
//     [cost, pid, cost]
//   );
//   return r.affectedRows === 1;
// }

// /* ---------- helpers ---------- */
// let ready = null;
// const ensureTables = () => {
//   if (!ready) ready = (async () => { for (const q of SCHEMA) await pool.query(q); })();
//   return ready;
// };

// const bad = (res, code, error) => res.status(code).json({ success: false, error });

// const pidOf = (req) => {
//   const id = Number(req.body?.playerId ?? req.params?.playerId);
//   return Number.isInteger(id) && id > 0 ? id : null;
// };

// async function activeSession(pid, create) {
//   const [rows] = await pool.query(
//     "SELECT * FROM bt_level11_sessions WHERE player_id=? AND status='active' ORDER BY id DESC LIMIT 1",
//     [pid]
//   );
//   if (rows[0]) return rows[0];
//   if (!create) return null;
//   const [ins] = await pool.query("INSERT INTO bt_level11_sessions (player_id) VALUES (?)", [pid]);
//   const [again] = await pool.query("SELECT * FROM bt_level11_sessions WHERE id=?", [ins.insertId]);
//   return again[0];
// }

// const publicLevel = () => ({
//   n: LEVEL.n,
//   question: LEVEL.question,
//   input: LEVEL.input,
//   maxDigits: LEVEL.maxDigits,
//   hintCost: LEVEL.hintCost,
//   skipCost: LEVEL.skipCost,
//   totalHints: LEVEL.hints.length,
// });

// /* ---------- POST /start ---------- */
// router.post("/start", async (req, res, next) => {
//   try {
//     await ensureTables();
//     const pid = pidOf(req);
//     if (!pid) return bad(res, 400, "playerId is required");
//     const s = await activeSession(pid, true);
//     res.json({
//       success: true,
//       level: publicLevel(),
//       session: {
//         id: s.id,
//         attempts: s.attempts,
//         hintsUsed: s.hints_used,
//         shownHints: LEVEL.hints.slice(0, s.hints_used),
//       },
//       hints: await getHints(pid),
//     });
//   } catch (e) { next(e); }
// });

// /* ---------- POST /answer ---------- */
// router.post("/answer", async (req, res, next) => {
//   try {
//     await ensureTables();
//     const pid = pidOf(req);
//     const ans = normalize(req.body?.answer);
//     if (!pid) return bad(res, 400, "playerId is required");
//     if (!/^\d{1,2}$/.test(ans)) return bad(res, 400, "answer must be a number");

//     const s = await activeSession(pid, true);
//     const ok = isCorrect(ans);
//     const attempts = s.attempts + 1;

//     await pool.query(
//       "INSERT INTO bt_level11_attempts (session_id, player_id, answer, is_correct) VALUES (?,?,?,?)",
//       [s.id, pid, ans, ok ? 1 : 0]
//     );
//     if (ok) {
//       await pool.query(
//         "UPDATE bt_level11_sessions SET attempts=?, status='completed', finished_at=NOW() WHERE id=?",
//         [attempts, s.id]
//       );
//     } else {
//       await pool.query("UPDATE bt_level11_sessions SET attempts=? WHERE id=?", [attempts, s.id]);
//     }

//     res.json({
//       success: true,
//       correct: ok,
//       attempts,
//       stars: ok ? starsFor(attempts, false) : 0,
//       message: ok ? "Correct!" : "Not quite. Try again!",
//     });
//   } catch (e) { next(e); }
// });

// /* ---------- POST /hint ---------- */
// router.post("/hint", async (req, res, next) => {
//   try {
//     await ensureTables();
//     const pid = pidOf(req);
//     if (!pid) return bad(res, 400, "playerId is required");
//     const s = await activeSession(pid, true);

//     if (s.hints_used >= LEVEL.hints.length) return bad(res, 400, "No more hints for this level");
//     if (!(await spendHints(pid, LEVEL.hintCost))) return bad(res, 402, "Not enough hints");

//     await pool.query("UPDATE bt_level11_sessions SET hints_used=hints_used+1 WHERE id=?", [s.id]);
//     res.json({
//       success: true,
//       hint: { index: s.hints_used, text: LEVEL.hints[s.hints_used] },
//       hintsUsed: s.hints_used + 1,
//       hints: await getHints(pid),
//     });
//   } catch (e) { next(e); }
// });

// /* ---------- POST /skip ---------- */
// router.post("/skip", async (req, res, next) => {
//   try {
//     await ensureTables();
//     const pid = pidOf(req);
//     if (!pid) return bad(res, 400, "playerId is required");
//     const s = await activeSession(pid, true);

//     if (!(await spendHints(pid, LEVEL.skipCost))) return bad(res, 402, "Not enough hints");
//     await pool.query(
//       "UPDATE bt_level11_sessions SET status='skipped', finished_at=NOW() WHERE id=?",
//       [s.id]
//     );
//     res.json({
//       success: true,
//       correct: true,
//       skipped: true,
//       attempts: Math.max(1, s.attempts),
//       stars: starsFor(s.attempts, true),
//       hints: await getHints(pid),
//     });
//   } catch (e) { next(e); }
// });

// /* ---------- GET /status/:playerId ---------- */
// router.get("/status/:playerId", async (req, res, next) => {
//   try {
//     await ensureTables();
//     const pid = pidOf(req);
//     if (!pid) return bad(res, 400, "invalid playerId");
//     const [rows] = await pool.query(
//       "SELECT status, attempts, hints_used, finished_at FROM bt_level11_sessions WHERE player_id=? ORDER BY id DESC LIMIT 1",
//       [pid]
//     );
//     res.json({ success: true, session: rows[0] || null });
//   } catch (e) { next(e); }
// });

// module.exports = router;
// Brain Twist - Level 11 (clock riddle)
// POST /start  /answer  /hint  /skip      GET /status/:playerId
// Every response is JSON: { success: true|false, ... }

const express = require("express");
const router = express.Router();

// !!! CHANGE THIS to the same db import your Braintwistlevel10routes.js uses !!!
// (must be a mysql2/promise pool: pool.query(sql, params) -> [rows])
const pool = require("../db");

const { LEVEL, SCHEMA, isCorrect, normalize, starsFor } = require("../data/level11Db");

/* ---------- hints balance (CHANGE if your table/column names differ) ---------- */
const PLAYERS_TABLE = "bt_players";
const HINTS_COLUMN = "hints";

async function getHints(pid) {
  const [r] = await pool.query(`SELECT ${HINTS_COLUMN} AS h FROM ${PLAYERS_TABLE} WHERE id=?`, [pid]);
  return r[0] ? Number(r[0].h) : null;
}
async function spendHints(pid, cost) {
  const [r] = await pool.query(
    `UPDATE ${PLAYERS_TABLE} SET ${HINTS_COLUMN}=${HINTS_COLUMN}-? WHERE id=? AND ${HINTS_COLUMN}>=?`,
    [cost, pid, cost]
  );
  return r.affectedRows === 1;
}

/* ---------- helpers ---------- */
let ready = null;
const ensureTables = () => {
  if (!ready) ready = (async () => {
    for (const q of SCHEMA) await pool.query(q);
    // old sheep version stored the answer as a number; the clock riddle needs text ("m")
    try { await pool.query("ALTER TABLE bt_level11_attempts MODIFY answer VARCHAR(64) NOT NULL"); }
    catch (e) { console.warn("level11 answer column alter skipped:", e.message); }
  })();
  return ready;
};

const bad = (res, code, error) => res.status(code).json({ success: false, error });

const pidOf = (req) => {
  const id = Number(req.body?.playerId ?? req.params?.playerId);
  return Number.isInteger(id) && id > 0 ? id : null;
};

async function activeSession(pid, create) {
  const [rows] = await pool.query(
    "SELECT * FROM bt_level11_sessions WHERE player_id=? AND status='active' ORDER BY id DESC LIMIT 1",
    [pid]
  );
  if (rows[0]) return rows[0];
  if (!create) return null;
  const [ins] = await pool.query("INSERT INTO bt_level11_sessions (player_id) VALUES (?)", [pid]);
  const [again] = await pool.query("SELECT * FROM bt_level11_sessions WHERE id=?", [ins.insertId]);
  return again[0];
}

const publicLevel = () => ({
  n: LEVEL.n,
  question: LEVEL.question,
  input: LEVEL.input,
  maxDigits: LEVEL.maxDigits,
  hintCost: LEVEL.hintCost,
  skipCost: LEVEL.skipCost,
  totalHints: LEVEL.hints.length,
});

/* ---------- POST /start ---------- */
router.post("/start", async (req, res, next) => {
  try {
    await ensureTables();
    const pid = pidOf(req);
    if (!pid) return bad(res, 400, "playerId is required");
    const s = await activeSession(pid, true);
    res.json({
      success: true,
      level: publicLevel(),
      session: {
        id: s.id,
        attempts: s.attempts,
        hintsUsed: s.hints_used,
        shownHints: LEVEL.hints.slice(0, s.hints_used),
      },
      hints: await getHints(pid),
    });
  } catch (e) { next(e); }
});

/* ---------- POST /answer ---------- */
router.post("/answer", async (req, res, next) => {
  try {
    await ensureTables();
    const pid = pidOf(req);
    const ans = normalize(req.body?.answer);
    if (!pid) return bad(res, 400, "playerId is required");
    if (!ans || ans.length > 30) return bad(res, 400, "answer is required");

    const s = await activeSession(pid, true);
    const ok = isCorrect(ans);
    const attempts = s.attempts + 1;

    await pool.query(
      "INSERT INTO bt_level11_attempts (session_id, player_id, answer, is_correct) VALUES (?,?,?,?)",
      [s.id, pid, ans, ok ? 1 : 0]
    );
    if (ok) {
      await pool.query(
        "UPDATE bt_level11_sessions SET attempts=?, status='completed', finished_at=NOW() WHERE id=?",
        [attempts, s.id]
      );
    } else {
      await pool.query("UPDATE bt_level11_sessions SET attempts=? WHERE id=?", [attempts, s.id]);
    }

    res.json({
      success: true,
      correct: ok,
      attempts,
      stars: ok ? starsFor(attempts, false) : 0,
      message: ok ? "Correct!" : "Not quite. Try again!",
    });
  } catch (e) { next(e); }
});

/* ---------- POST /hint ---------- */
router.post("/hint", async (req, res, next) => {
  try {
    await ensureTables();
    const pid = pidOf(req);
    if (!pid) return bad(res, 400, "playerId is required");
    const s = await activeSession(pid, true);

    if (s.hints_used >= LEVEL.hints.length) return bad(res, 400, "No more hints for this level");
    if (!(await spendHints(pid, LEVEL.hintCost))) return bad(res, 402, "Not enough hints");

    await pool.query("UPDATE bt_level11_sessions SET hints_used=hints_used+1 WHERE id=?", [s.id]);
    res.json({
      success: true,
      hint: { index: s.hints_used, text: LEVEL.hints[s.hints_used] },
      hintsUsed: s.hints_used + 1,
      hints: await getHints(pid),
    });
  } catch (e) { next(e); }
});

/* ---------- POST /skip ---------- */
router.post("/skip", async (req, res, next) => {
  try {
    await ensureTables();
    const pid = pidOf(req);
    if (!pid) return bad(res, 400, "playerId is required");
    const s = await activeSession(pid, true);

    if (!(await spendHints(pid, LEVEL.skipCost))) return bad(res, 402, "Not enough hints");
    await pool.query(
      "UPDATE bt_level11_sessions SET status='skipped', finished_at=NOW() WHERE id=?",
      [s.id]
    );
    res.json({
      success: true,
      correct: true,
      skipped: true,
      attempts: Math.max(1, s.attempts),
      stars: starsFor(s.attempts, true),
      hints: await getHints(pid),
    });
  } catch (e) { next(e); }
});

/* ---------- GET /status/:playerId ---------- */
router.get("/status/:playerId", async (req, res, next) => {
  try {
    await ensureTables();
    const pid = pidOf(req);
    if (!pid) return bad(res, 400, "invalid playerId");
    const [rows] = await pool.query(
      "SELECT status, attempts, hints_used, finished_at FROM bt_level11_sessions WHERE player_id=? ORDER BY id DESC LIMIT 1",
      [pid]
    );
    res.json({ success: true, session: rows[0] || null });
  } catch (e) { next(e); }
});

module.exports = router;