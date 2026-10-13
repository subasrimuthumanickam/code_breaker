const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /api/stats
// Computed live from the "games" table - no separate stats table needed,
// so there's never a mismatch between game results and displayed stats.
router.get("/stats", async (req, res, next) => {
  try {
    const [[summary]] = await pool.query(
      `SELECT
         COUNT(*) AS gamesPlayed,
         SUM(status = 'won') AS gamesWon,
         COALESCE(MAX(CASE WHEN status = 'won' THEN score END), 0) AS highScore,
         COALESCE(AVG(CASE WHEN status IN ('won','lost') THEN attempts_used END), 0) AS avgAttempts
       FROM games
       WHERE status IN ('won', 'lost')`
    );

    const [rows] = await pool.query(
      `SELECT status FROM games
       WHERE status IN ('won', 'lost')
       ORDER BY finished_at ASC, started_at ASC`
    );

    // Streaks are easiest to compute in JS once we have the ordered results.
    let bestStreak = 0;
    let running = 0;
    for (const row of rows) {
      if (row.status === "won") {
        running += 1;
        bestStreak = Math.max(bestStreak, running);
      } else {
        running = 0;
      }
    }

    let currentStreak = 0;
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].status === "won") currentStreak += 1;
      else break;
    }

    res.json({
      highScore: Number(summary.highScore) || 0,
      gamesPlayed: Number(summary.gamesPlayed) || 0,
      gamesWon: Number(summary.gamesWon) || 0,
      currentStreak,
      bestStreak,
      avgAttempts: Number(summary.avgAttempts) || 0,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;