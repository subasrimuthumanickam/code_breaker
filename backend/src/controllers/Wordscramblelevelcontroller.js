// const db = require("../db");

// function starsFor(score, target) {
//   if (!target) return 1;
//   const pct = score / target;
//   if (pct >= 1) return 3;
//   if (pct >= 0.6) return 2;
//   return 1;
// }

// // GET /api/wordscramble/levels?playerName=Neelesh
// exports.getLevels = async (req, res) => {
//   try {
//     const playerName = String(req.query.playerName || "").trim();

//     const [levels] = await db.query(
//       `SELECT level_number, zone_name, difficulty, total_rounds,
//               time_limit_sec, lives, target_score
//        FROM word_scramble_levels
//        ORDER BY level_number ASC`
//     );

//     let progress = [];
//     if (playerName) {
//       [progress] = await db.query(
//         `SELECT level_number, stars, best_score
//          FROM word_scramble_level_progress
//          WHERE player_name = ?`,
//         [playerName]
//       );
//     }
//     const done = new Map(progress.map((p) => [p.level_number, p]));

//     let currentLevel = null;
//     let totalStars = 0;

//     const result = levels.map((l, i) => {
//       const p = done.get(l.level_number);
//       const prevDone = i === 0 || done.has(levels[i - 1].level_number);

//       let status = "locked";
//       if (p) status = "completed";
//       else if (prevDone) status = "unlocked";

//       if (status === "unlocked" && currentLevel === null) {
//         currentLevel = l.level_number;
//       }
//       if (p) totalStars += p.stars;

//       return {
//         levelNumber: l.level_number,
//         zoneName: l.zone_name,
//         difficulty: l.difficulty,
//         totalRounds: l.total_rounds,
//         timeLimitSec: l.time_limit_sec,
//         lives: l.lives,
//         targetScore: l.target_score,
//         status,
//         stars: p ? p.stars : 0,
//         bestScore: p ? p.best_score : 0,
//       };
//     });

//     // Every level finished: point at the last one.
//     if (currentLevel === null && levels.length) {
//       currentLevel = levels[levels.length - 1].level_number;
//     }

//     res.json({
//       success: true,
//       currentLevel,
//       totalStars,
//       maxStars: levels.length * 3,
//       levels: result,
//     });
//   } catch (err) {
//     console.error("getLevels error:", err);
//     res.status(500).json({ success: false, error: "Failed to load levels" });
//   }
// };

// // POST /api/wordscramble/levels/:levelNumber/complete
// // body: { playerName, score }
// exports.completeLevel = async (req, res) => {
//   try {
//     const levelNumber = parseInt(req.params.levelNumber, 10);
//     const playerName = String(req.body.playerName || "").trim();
//     const score = req.body.score;

//     if (!playerName || !Number.isInteger(levelNumber) || typeof score !== "number") {
//       return res.status(400).json({ success: false, error: "Invalid request" });
//     }

//     const [levelRows] = await db.query(
//       "SELECT level_number, target_score FROM word_scramble_levels WHERE level_number = ?",
//       [levelNumber]
//     );
//     if (!levelRows.length) {
//       return res.status(404).json({ success: false, error: "Level not found" });
//     }
//     const level = levelRows[0];

//     // A level is only playable if the previous one is completed.
//     if (levelNumber > 1) {
//       const [prev] = await db.query(
//         `SELECT 1 FROM word_scramble_level_progress
//          WHERE player_name = ? AND level_number = ?`,
//         [playerName, levelNumber - 1]
//       );
//       if (!prev.length) {
//         return res.status(403).json({ success: false, error: "Level is locked" });
//       }
//     }

//     const stars = starsFor(score, level.target_score);

//     await db.query(
//       `INSERT INTO word_scramble_level_progress (player_name, level_number, stars, best_score)
//        VALUES (?, ?, ?, ?)
//        ON DUPLICATE KEY UPDATE
//          stars = GREATEST(stars, VALUES(stars)),
//          best_score = GREATEST(best_score, VALUES(best_score))`,
//       [playerName, levelNumber, stars, score]
//     );

//     const [[saved]] = await db.query(
//       `SELECT stars, best_score FROM word_scramble_level_progress
//        WHERE player_name = ? AND level_number = ?`,
//       [playerName, levelNumber]
//     );
//     const [[maxRow]] = await db.query(
//       "SELECT MAX(level_number) AS maxLevel FROM word_scramble_levels"
//     );

//     res.json({
//       success: true,
//       levelNumber,
//       stars: saved.stars,
//       bestScore: saved.best_score,
//       newlyUnlocked: levelNumber < maxRow.maxLevel ? levelNumber + 1 : null,
//     });
//   } catch (err) {
//     console.error("completeLevel error:", err);
//     res.status(500).json({ success: false, error: "Failed to save progress" });
//   }
// };
const db = require("../db");
const { logActivity, getPlayerStats } = require("../utils/playerActivity");

function starsFor(score, target) {
  if (!target) return 1;
  const pct = score / target;
  if (pct >= 1) return 3;
  if (pct >= 0.6) return 2;
  return 1;
}

// GET /api/wordscramble/levels?playerName=Neelesh
exports.getLevels = async (req, res) => {
  try {
    const playerName = String(req.query.playerName || "").trim();

    const [levels] = await db.query(
      `SELECT level_number, zone_name, difficulty, total_rounds,
              time_limit_sec, lives, target_score
       FROM word_scramble_levels
       ORDER BY level_number ASC`
    );

    let progress = [];
    if (playerName) {
      [progress] = await db.query(
        `SELECT level_number, stars, best_score
         FROM word_scramble_level_progress
         WHERE player_name = ?`,
        [playerName]
      );
    }
    const done = new Map(progress.map((p) => [p.level_number, p]));

    let currentLevel = null;
    let totalStars = 0;

    const result = levels.map((l, i) => {
      const p = done.get(l.level_number);
      const prevDone = i === 0 || done.has(levels[i - 1].level_number);

      let status = "locked";
      if (p) status = "completed";
      else if (prevDone) status = "unlocked";

      if (status === "unlocked" && currentLevel === null) {
        currentLevel = l.level_number;
      }
      if (p) totalStars += p.stars;

      return {
        levelNumber: l.level_number,
        zoneName: l.zone_name,
        difficulty: l.difficulty,
        totalRounds: l.total_rounds,
        timeLimitSec: l.time_limit_sec,
        lives: l.lives,
        targetScore: l.target_score,
        status,
        stars: p ? p.stars : 0,
        bestScore: p ? p.best_score : 0,
      };
    });

    // Every level finished: point at the last one.
    if (currentLevel === null && levels.length) {
      currentLevel = levels[levels.length - 1].level_number;
    }

    res.json({
      success: true,
      currentLevel,
      totalStars,
      maxStars: levels.length * 3,
      levels: result,
    });
  } catch (err) {
    console.error("getLevels error:", err);
    res.status(500).json({ success: false, error: "Failed to load levels" });
  }
};

// POST /api/wordscramble/levels/:levelNumber/complete
// body: { playerName, score }
exports.completeLevel = async (req, res) => {
  try {
    const levelNumber = parseInt(req.params.levelNumber, 10);
    const playerName = String(req.body.playerName || "").trim();
    const score = req.body.score;

    if (!playerName || !Number.isInteger(levelNumber) || typeof score !== "number") {
      return res.status(400).json({ success: false, error: "Invalid request" });
    }

    const [levelRows] = await db.query(
      "SELECT level_number, target_score FROM word_scramble_levels WHERE level_number = ?",
      [levelNumber]
    );
    if (!levelRows.length) {
      return res.status(404).json({ success: false, error: "Level not found" });
    }
    const level = levelRows[0];

    // A level is only playable if the previous one is completed.
    if (levelNumber > 1) {
      const [prev] = await db.query(
        `SELECT 1 FROM word_scramble_level_progress
         WHERE player_name = ? AND level_number = ?`,
        [playerName, levelNumber - 1]
      );
      if (!prev.length) {
        return res.status(403).json({ success: false, error: "Level is locked" });
      }
    }

    const stars = starsFor(score, level.target_score);

    await db.query(
      `INSERT INTO word_scramble_level_progress (player_name, level_number, stars, best_score)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         stars = GREATEST(stars, VALUES(stars)),
         best_score = GREATEST(best_score, VALUES(best_score))`,
      [playerName, levelNumber, stars, score]
    );

    const [[saved]] = await db.query(
      `SELECT stars, best_score FROM word_scramble_level_progress
       WHERE player_name = ? AND level_number = ?`,
      [playerName, levelNumber]
    );
    const [[maxRow]] = await db.query(
      "SELECT MAX(level_number) AS maxLevel FROM word_scramble_levels"
    );

    // NEW: a new personal best score -> "Scored N points" in Recent Activity (+XP).
    // Never breaks level saving if it fails.
    try {
      const points = Math.max(0, Math.round(score));
      const before = await getPlayerStats();
      console.log("[activity] word-scramble level complete:", playerName, "level", levelNumber, "score", points);
      if (points > before.highScore) {
        await logActivity({ game: "word-scramble", type: "high_score", value: points });
      }
    } catch (e) {
      console.error("[activity] word-scramble score log failed:", e);
    }

    res.json({
      success: true,
      levelNumber,
      stars: saved.stars,
      bestScore: saved.best_score,
      newlyUnlocked: levelNumber < maxRow.maxLevel ? levelNumber + 1 : null,
    });
  } catch (err) {
    console.error("completeLevel error:", err);
    res.status(500).json({ success: false, error: "Failed to save progress" });
  }
};