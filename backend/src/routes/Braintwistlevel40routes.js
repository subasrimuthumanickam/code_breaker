// // Braintwistlevel40routes.js  -  Express routes for Level 40
// const express = require('express');
// const { pool } = require('./level40Db');

// const router = express.Router();

// const LEVEL = 40;
// const SECRET = '2285';
// const CLUE_COST = 25;
// const SKIP_COST = 50;
// const CLUE_TEXT = 'Books-la irukura numbers overlap aagi irukku. Order: 2, 2, 8, 5.';

// async function ensureUser(userId) {
//   await pool.query('INSERT IGNORE INTO bt_users (user_id) VALUES (?)', [userId]);
//   const [rows] = await pool.query('SELECT hints, current_level FROM bt_users WHERE user_id = ?', [userId]);
//   return rows[0];
// }

// // GET /api/braintwist/level40/progress/:userId
// router.get('/progress/:userId', async (req, res) => {
//   try {
//     const user = await ensureUser(req.params.userId);
//     res.json({ success: true, level: LEVEL, hints: user.hints, currentLevel: user.current_level });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // POST /api/braintwist/level40/submit   { userId, answer }
// router.post('/submit', async (req, res) => {
//   try {
//     const { userId, answer } = req.body || {};
//     if (!userId || typeof answer !== 'string' || !/^\d{1,8}$/.test(answer)) {
//       return res.status(400).json({ success: false, message: 'userId and numeric answer required' });
//     }
//     await ensureUser(userId);
//     const correct = answer === SECRET;

//     await pool.query(
//       'INSERT INTO bt_level40_attempts (user_id, submitted_answer, is_correct) VALUES (?,?,?)',
//       [userId, answer, correct ? 1 : 0]
//     );

//     if (correct) {
//       await pool.query(
//         `INSERT INTO bt_level_progress (user_id, level, status) VALUES (?,?, 'solved')
//          ON DUPLICATE KEY UPDATE status = 'solved'`,
//         [userId, LEVEL]
//       );
//       await pool.query(
//         'UPDATE bt_users SET current_level = GREATEST(current_level, ?) WHERE user_id = ?',
//         [LEVEL + 1, userId]
//       );
//     }

//     res.json({
//       success: true,
//       correct,
//       message: correct ? 'Correct! Level 40 complete.' : 'Wrong answer, try again.',
//       nextLevel: correct ? LEVEL + 1 : null,
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // POST /api/braintwist/level40/clue   { userId }
// router.post('/clue', async (req, res) => {
//   try {
//     const { userId } = req.body || {};
//     if (!userId) return res.status(400).json({ success: false, message: 'userId required' });
//     const user = await ensureUser(userId);
//     if (user.hints < CLUE_COST) {
//       return res.json({ success: false, message: 'Not enough hints', hints: user.hints });
//     }
//     await pool.query('UPDATE bt_users SET hints = hints - ? WHERE user_id = ?', [CLUE_COST, userId]);
//     res.json({ success: true, clue: CLUE_TEXT, hints: user.hints - CLUE_COST });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // POST /api/braintwist/level40/skip   { userId }
// router.post('/skip', async (req, res) => {
//   try {
//     const { userId } = req.body || {};
//     if (!userId) return res.status(400).json({ success: false, message: 'userId required' });
//     const user = await ensureUser(userId);
//     if (user.hints < SKIP_COST) {
//       return res.json({ success: false, message: 'Not enough hints to skip', hints: user.hints });
//     }
//     await pool.query('UPDATE bt_users SET hints = hints - ? WHERE user_id = ?', [SKIP_COST, userId]);
//     await pool.query(
//       `INSERT INTO bt_level_progress (user_id, level, status) VALUES (?,?, 'skipped')
//        ON DUPLICATE KEY UPDATE status = IF(status = 'solved', 'solved', 'skipped')`,
//       [userId, LEVEL]
//     );
//     await pool.query(
//       'UPDATE bt_users SET current_level = GREATEST(current_level, ?) WHERE user_id = ?',
//       [LEVEL + 1, userId]
//     );
//     res.json({ success: true, hints: user.hints - SKIP_COST, nextLevel: LEVEL + 1 });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = router;

// /* ---- server.js la add pannunga ----
// const express = require('express');
// const cors = require('cors');
// const { initLevel40Db } = require('./level40Db');
// const level40Routes = require('./Braintwistlevel40routes');

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use('/api/braintwist/level40', level40Routes);

// initLevel40Db().then(() => app.listen(3000, () => console.log('Server on 3000')));
// */
// Braintwistlevel40routes.js  -  Express routes for Level 40
const express = require('express');
const { pool, initLevel40Db } = require('../data/level40Db');

const router = express.Router();

// create the Level 40 tables on startup (safe to run every time)
initLevel40Db().catch((e) => console.error('[Level40] DB init failed:', e.message));

const LEVEL = 40;
const SECRET = '2285';
const SKIP_COST = 50;
const CLUE_TEXT = 'Books-la irukura numbers overlap aagi irukku. Order: 2, 2, 8, 5.';

async function ensureUser(userId) {
  await pool.query('INSERT IGNORE INTO bt_users (user_id) VALUES (?)', [userId]);
  const [rows] = await pool.query('SELECT hints, current_level FROM bt_users WHERE user_id = ?', [userId]);
  return rows[0];
}

// GET /api/braintwist/level40/progress/:userId
router.get('/progress/:userId', async (req, res) => {
  try {
    const user = await ensureUser(req.params.userId);
    res.json({ success: true, level: LEVEL, hints: user.hints, currentLevel: user.current_level });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/braintwist/level40/submit   { userId, answer }
router.post('/submit', async (req, res) => {
  try {
    const { userId, answer } = req.body || {};
    if (!userId || typeof answer !== 'string' || !/^\d{1,8}$/.test(answer)) {
      return res.status(400).json({ success: false, message: 'userId and numeric answer required' });
    }
    await ensureUser(userId);
    const correct = answer === SECRET;

    await pool.query(
      'INSERT INTO bt_level40_attempts (user_id, submitted_answer, is_correct) VALUES (?,?,?)',
      [userId, answer, correct ? 1 : 0]
    );

    if (correct) {
      await pool.query(
        `INSERT INTO bt_level_progress (user_id, level, status) VALUES (?,?, 'solved')
         ON DUPLICATE KEY UPDATE status = 'solved'`,
        [userId, LEVEL]
      );
      await pool.query(
        'UPDATE bt_users SET current_level = GREATEST(current_level, ?) WHERE user_id = ?',
        [LEVEL + 1, userId]
      );
    }

    res.json({
      success: true,
      correct,
      message: correct ? 'Correct! Level 40 complete.' : 'Wrong answer, try again.',
      nextLevel: correct ? LEVEL + 1 : null,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/braintwist/level40/clue   { userId }   free; usage is logged
router.post('/clue', async (req, res) => {
  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ success: false, message: 'userId required' });
    const user = await ensureUser(userId);
    res.json({ success: true, free: true, cost: 0, clue: CLUE_TEXT, hints: user.hints });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/braintwist/level40/skip   { userId }
router.post('/skip', async (req, res) => {
  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ success: false, message: 'userId required' });
    const user = await ensureUser(userId);
    if (user.hints < SKIP_COST) {
      return res.json({ success: false, message: 'Not enough hints to skip', hints: user.hints });
    }
    await pool.query('UPDATE bt_users SET hints = hints - ? WHERE user_id = ?', [SKIP_COST, userId]);
    await pool.query(
      `INSERT INTO bt_level_progress (user_id, level, status) VALUES (?,?, 'skipped')
       ON DUPLICATE KEY UPDATE status = IF(status = 'solved', 'solved', 'skipped')`,
      [userId, LEVEL]
    );
    await pool.query(
      'UPDATE bt_users SET current_level = GREATEST(current_level, ?) WHERE user_id = ?',
      [LEVEL + 1, userId]
    );
    res.json({ success: true, hints: user.hints - SKIP_COST, nextLevel: LEVEL + 1 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

/* ---- server.js la add pannunga ----
const express = require('express');
const cors = require('cors');
const { initLevel40Db } = require('./level40Db');
const level40Routes = require('./Braintwistlevel40routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/braintwist/level40', level40Routes);

initLevel40Db().then(() => app.listen(3000, () => console.log('Server on 3000')));
*/