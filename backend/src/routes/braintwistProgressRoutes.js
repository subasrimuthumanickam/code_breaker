// const express = require('express');
// const router = express.Router();

// // !!! unga existing braintwistRoutes.js top la DB ethu require panraangalo adhe path inga podunga
// const db = require('../db');  // (mysql2/promise pool nu assume pannirukken)

// const rows = async (sql, params) => {
//   const r = await db.query(sql, params);
//   return Array.isArray(r) && Array.isArray(r[0]) ? r[0] : r;
// };

// // 1st try, no hint = 3 stars | 2nd try = 2 | more = 1 | hint use panna -1 (min 1) | skip = 1
// const calcStars = (attempts, hintsUsed, skipped) => {
//   if (skipped) return 1;
//   let s = attempts <= 1 ? 3 : attempts === 2 ? 2 : 1;
//   if (hintsUsed > 0) s = Math.max(1, s - 1);
//   return s;
// };

// // POST /progress/complete  -> request handle, DB save, JSON response
// router.post('/progress/complete', async (req, res) => {
//   try {
//     const b = req.body || {};
//     const playerId = parseInt(b.playerId, 10);
//     const level = parseInt(b.level, 10);
//     const attempts = Math.min(50, Math.max(1, parseInt(b.attempts, 10) || 1));
//     const hintsUsed = Math.min(50, Math.max(0, parseInt(b.hintsUsed, 10) || 0));
//     const skipped = !!b.skipped;

//     if (!playerId || !level || level < 1 || level > 1000) {
//       return res.status(400).json({ success: false, error: 'playerId and level are required' });
//     }

//     const stars = calcStars(attempts, hintsUsed, skipped);
//     const score = skipped ? 0 : Math.max(0, stars * 100 - hintsUsed * 10);

//     await rows(
//       `INSERT INTO brain_twist_progress (player_id, level_number, is_completed, score, stars, attempts, completed_at)
//        VALUES (?, ?, 1, ?, ?, ?, NOW())
//        ON DUPLICATE KEY UPDATE
//          is_completed = 1,
//          score = GREATEST(score, VALUES(score)),
//          stars = GREATEST(stars, VALUES(stars)),
//          attempts = attempts + VALUES(attempts),
//          completed_at = NOW()`,
//       [playerId, level, score, stars, attempts]
//     );

//     const best = (await rows(
//       'SELECT stars, score, attempts FROM brain_twist_progress WHERE player_id = ? AND level_number = ?',
//       [playerId, level]
//     ))[0] || {};
//     const tot = (await rows(
//       'SELECT COUNT(*) AS levels, COALESCE(SUM(stars),0) AS stars FROM brain_twist_progress WHERE player_id = ? AND is_completed = 1',
//       [playerId]
//     ))[0] || {};

//     res.json({
//       success: true,
//       level, stars, score, attempts,
//       bestStars: best.stars, bestScore: best.score, totalAttempts: best.attempts,
//       completedLevels: Number(tot.levels || 0), totalStars: Number(tot.stars || 0),
//       nextLevel: level + 1
//     });
//   } catch (e) {
//     console.error('[braintwist] progress/complete', e);
//     res.status(500).json({ success: false, error: 'Server error' });
//   }
// });

// // GET /progress/:playerId  -> saved progress as JSON
// router.get('/progress/:playerId', async (req, res) => {
//   try {
//     const playerId = parseInt(req.params.playerId, 10);
//     if (!playerId) return res.status(400).json({ success: false, error: 'Invalid playerId' });
//     const list = await rows(
//       'SELECT level_number, is_completed, score, stars, attempts, completed_at FROM brain_twist_progress WHERE player_id = ? ORDER BY level_number',
//       [playerId]
//     );
//     res.json({ success: true, progress: list });
//   } catch (e) {
//     console.error('[braintwist] progress/get', e);
//     res.status(500).json({ success: false, error: 'Server error' });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();

const db = require('../db');

const rows = async (sql, params) => {
  const r = await db.query(sql, params);
  return Array.isArray(r) && Array.isArray(r[0]) ? r[0] : r;
};

// 1st try, no hint = 3 stars | 2nd try = 2 | more = 1 | hint use panna -1 (min 1) | skip = 1
const calcStars = (attempts, hintsUsed, skipped) => {
  if (skipped) return 1;
  let s = attempts <= 1 ? 3 : attempts === 2 ? 2 : 1;
  if (hintsUsed > 0) s = Math.max(1, s - 1);
  return s;
};

// POST /progress/complete  -> request handle, DB save, JSON response
router.post('/progress/complete', async (req, res) => {
  try {
    const b = req.body || {};
    const playerId = parseInt(b.playerId, 10);
    const level = parseInt(b.level, 10);
    const attempts = Math.min(50, Math.max(1, parseInt(b.attempts, 10) || 1));
    const hintsUsed = Math.min(50, Math.max(0, parseInt(b.hintsUsed, 10) || 0));
    const skipped = !!b.skipped;

    if (!playerId || !level || level < 1 || level > 1000) {
      return res.status(400).json({ success: false, error: 'playerId and level are required' });
    }

    const stars = calcStars(attempts, hintsUsed, skipped);
    const score = skipped ? 0 : Math.max(0, stars * 100 - hintsUsed * 10);

    // 1) stars / score table
    await rows(
      `INSERT INTO brain_twist_progress (player_id, level_number, is_completed, score, stars, attempts, completed_at)
       VALUES (?, ?, 1, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         is_completed = 1,
         score = GREATEST(score, VALUES(score)),
         stars = GREATEST(stars, VALUES(stars)),
         attempts = attempts + VALUES(attempts),
         completed_at = NOW()`,
      [playerId, level, score, stars, attempts]
    );

    // 2) level map table (map idha paathu completed / current / locked decide pannum)
    await rows(
      `INSERT INTO bt_progress (player_id, level_n, attempts, solved_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         attempts = GREATEST(attempts, VALUES(attempts)),
         solved_at = COALESCE(solved_at, NOW())`,
      [playerId, level, attempts]
    );

    // 3) player oda current level next ku move
    await rows(
      `UPDATE bt_players
       SET current_level = GREATEST(COALESCE(current_level, 1), ?)
       WHERE id = ?`,
      [level + 1, playerId]
    );

    const best = (await rows(
      'SELECT stars, score, attempts FROM brain_twist_progress WHERE player_id = ? AND level_number = ?',
      [playerId, level]
    ))[0] || {};
    const tot = (await rows(
      'SELECT COUNT(*) AS levels, COALESCE(SUM(stars),0) AS stars FROM brain_twist_progress WHERE player_id = ? AND is_completed = 1',
      [playerId]
    ))[0] || {};

    res.json({
      success: true,
      level, stars, score, attempts,
      bestStars: best.stars, bestScore: best.score, totalAttempts: best.attempts,
      completedLevels: Number(tot.levels || 0), totalStars: Number(tot.stars || 0),
      nextLevel: level + 1
    });
  } catch (e) {
    console.error('[braintwist] progress/complete', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /progress/:playerId  -> saved progress as JSON
router.get('/progress/:playerId', async (req, res) => {
  try {
    const playerId = parseInt(req.params.playerId, 10);
    if (!playerId) return res.status(400).json({ success: false, error: 'Invalid playerId' });
    const list = await rows(
      'SELECT level_number, is_completed, score, stars, attempts, completed_at FROM brain_twist_progress WHERE player_id = ? ORDER BY level_number',
      [playerId]
    );
    res.json({ success: true, progress: list });
  } catch (e) {
    console.error('[braintwist] progress/get', e);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;