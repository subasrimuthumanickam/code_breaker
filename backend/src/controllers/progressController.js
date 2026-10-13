// const pool = require("../db"); // ⚠️ adjust path to your actual mysql2 pool file
// const { DIFFICULTY_CONFIG, DIFFICULTY_ORDER } = require("../config/difficulty");

// // GET /progress/:deviceId
// // Returns rounds completed + unlock status for every difficulty
// const getProgress = async (req, res) => {
//   const { deviceId } = req.params;
//   if (!deviceId) return res.status(400).json({ error: "deviceId is required" });

//   const [rows] = await db.query(
//     "SELECT difficulty, rounds_completed, completed FROM user_progress WHERE device_id = ?",
//     [deviceId]
//   );

//   const byDifficulty = {};
//   rows.forEach((r) => {
//     byDifficulty[r.difficulty] = {
//       roundsCompleted: r.rounds_completed,
//       completed: !!r.completed,
//     };
//   });

//   const result = {};
//   DIFFICULTY_ORDER.forEach((diff, idx) => {
//     const entry = byDifficulty[diff] || { roundsCompleted: 0, completed: false };
//     const unlocked =
//       idx === 0 ? true : !!(byDifficulty[DIFFICULTY_ORDER[idx - 1]]?.completed);
//     result[diff] = {
//       roundsCompleted: entry.roundsCompleted,
//       roundsTotal: DIFFICULTY_CONFIG[diff].rounds,
//       completed: entry.completed,
//       unlocked,
//     };
//   });

//   res.json(result);
// };

// // POST /progress/:deviceId/:difficulty/complete-round
// // Called after a round win; increments rounds_completed, marks completed when full
// const completeRound = async (req, res) => {
//   const { deviceId, difficulty } = req.params;
//   if (!DIFFICULTY_CONFIG[difficulty]) {
//     return res.status(400).json({ error: "Invalid difficulty" });
//   }

//   const totalRounds = DIFFICULTY_CONFIG[difficulty].rounds;

//   await db.query(
//     `INSERT INTO user_progress (device_id, difficulty, rounds_completed, completed)
//      VALUES (?, ?, 1, ?)
//      ON DUPLICATE KEY UPDATE
//        rounds_completed = LEAST(rounds_completed + 1, ?),
//        completed = (rounds_completed + 1) >= ?`,
//     [deviceId, difficulty, totalRounds <= 1, totalRounds, totalRounds]
//   );

//   const [rows] = await db.query(
//     "SELECT rounds_completed, completed FROM user_progress WHERE device_id = ? AND difficulty = ?",
//     [deviceId, difficulty]
//   );

//   res.json({
//     roundsCompleted: rows[0].rounds_completed,
//     roundsTotal: totalRounds,
//     completed: !!rows[0].completed,
//   });
// };

// module.exports = { getProgress, completeRound };
const pool = require("../db");
const { DIFFICULTY_CONFIG, DIFFICULTY_ORDER } = require("../config/difficulty");

// GET /progress/:deviceId
// Returns rounds completed + unlock status for every difficulty
async function getProgress(req, res) {
  const { deviceId } = req.params;
  if (!deviceId) return res.status(400).json({ error: "deviceId is required" });

  const [rows] = await pool.query(
    "SELECT difficulty, rounds_completed, completed FROM user_progress WHERE device_id = ?",
    [deviceId]
  );

  const byDifficulty = {};
  rows.forEach((r) => {
    byDifficulty[r.difficulty] = {
      roundsCompleted: r.rounds_completed,
      completed: !!r.completed,
    };
  });

  const result = {};
  DIFFICULTY_ORDER.forEach((diff, idx) => {
    const entry = byDifficulty[diff] || { roundsCompleted: 0, completed: false };
    const unlocked =
      idx === 0 ? true : !!(byDifficulty[DIFFICULTY_ORDER[idx - 1]]?.completed);
    result[diff] = {
      roundsCompleted: entry.roundsCompleted,
      roundsTotal: DIFFICULTY_CONFIG[diff].rounds,
      completed: entry.completed,
      unlocked,
    };
  });

  res.json(result);
}

// POST /progress/:deviceId/:difficulty/complete-round
// Called after a round win; increments rounds_completed, marks completed when full
async function completeRound(req, res) {
  const { deviceId, difficulty } = req.params;
  if (!DIFFICULTY_CONFIG[difficulty]) {
    return res.status(400).json({ error: "Invalid difficulty" });
  }

  const totalRounds = DIFFICULTY_CONFIG[difficulty].rounds;

  await pool.query(
    `INSERT INTO user_progress (device_id, difficulty, rounds_completed, completed)
     VALUES (?, ?, 1, ?)
     ON DUPLICATE KEY UPDATE
       rounds_completed = LEAST(rounds_completed + 1, ?),
       completed = (rounds_completed + 1) >= ?`,
    [deviceId, difficulty, totalRounds <= 1, totalRounds, totalRounds]
  );

  const [rows] = await pool.query(
    "SELECT rounds_completed, completed FROM user_progress WHERE device_id = ? AND difficulty = ?",
    [deviceId, difficulty]
  );

  res.json({
    roundsCompleted: rows[0].rounds_completed,
    roundsTotal: totalRounds,
    completed: !!rows[0].completed,
  });
}

module.exports = { getProgress, completeRound };