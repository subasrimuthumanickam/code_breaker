const express = require("express");
const pool = require("../db");

const router = express.Router();

async function ensureRow() {
  await pool.query(
    `INSERT IGNORE INTO settings (id, sound_enabled, haptics_enabled, dark_mode)
     VALUES (1, 1, 1, 1)`
  );
}

function toApi(row) {
  return {
    soundEnabled: !!row.sound_enabled,
    hapticsEnabled: !!row.haptics_enabled,
    darkMode: !!row.dark_mode,
  };
}

// GET /api/settings
router.get("/settings", async (req, res, next) => {
  try {
    await ensureRow();
    const [[row]] = await pool.query("SELECT * FROM settings WHERE id = 1");
    res.json(toApi(row));
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings  { soundEnabled, hapticsEnabled, darkMode }
router.put("/settings", async (req, res, next) => {
  try {
    const { soundEnabled, hapticsEnabled, darkMode } = req.body;
    await ensureRow();
    await pool.query(
      `UPDATE settings SET
         sound_enabled = ?,
         haptics_enabled = ?,
         dark_mode = ?
       WHERE id = 1`,
      [soundEnabled ? 1 : 0, hapticsEnabled ? 1 : 0, darkMode ? 1 : 0]
    );
    const [[row]] = await pool.query("SELECT * FROM settings WHERE id = 1");
    res.json(toApi(row));
  } catch (err) {
    next(err);
  }
});

// POST /api/settings/reset-stats
// Wipes game history, which resets everything statsRoutes.js computes.
router.post("/settings/reset-stats", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM guesses");
    await pool.query("DELETE FROM games");
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;