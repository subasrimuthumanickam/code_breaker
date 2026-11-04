// // // Braintwistlevel46routes.js
// // // app.use('/api/braintwist/level46', require('./Braintwistlevel46routes'));

// // const express = require('express');
// // const { initLevel46, getLevel46 } = require('./level46Db');

// // const router = express.Router();

// // // create table + seed on startup
// // initLevel46().catch((e) => console.error('[level46] init failed', e));

// // // 7-segment digit map (segments sorted alphabetically)
// // const DIGIT_SEGMENTS = {
// //   0: 'abcdef',
// //   1: 'bc',
// //   2: 'abdeg',
// //   3: 'abcdg',
// //   4: 'bcfg',
// //   5: 'acdfg',
// //   6: 'acdefg',
// //   7: 'abc',
// //   8: 'abcdefg',
// //   9: 'abcdfg',
// // };

// // function decode(sticks, digitCount = 2) {
// //   let out = '';
// //   for (let d = 0; d < digitCount; d++) {
// //     const segs = sticks
// //       .filter((s) => s.digit === d)
// //       .map((s) => s.seg)
// //       .sort()
// //       .join('');
// //     if (!segs) continue;
// //     const hit = Object.keys(DIGIT_SEGMENTS).find((k) => DIGIT_SEGMENTS[k] === segs);
// //     out += hit !== undefined ? hit : '?';
// //   }
// //   return out;
// // }

// // // GET /  -> level data (solution is NOT sent)
// // router.get('/', async (req, res) => {
// //   try {
// //     const lv = await getLevel46();
// //     if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });
// //     const { solutionIds, ...safe } = lv;
// //     res.json({ success: true, data: safe });
// //   } catch (e) {
// //     console.error(e);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // POST /check  body: { removedIds: string[] }
// // router.post('/check', async (req, res) => {
// //   try {
// //     const lv = await getLevel46();
// //     if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });

// //     const removedIds = req.body && req.body.removedIds;
// //     if (!Array.isArray(removedIds)) {
// //       return res.status(400).json({ success: false, message: 'removedIds must be an array' });
// //     }

// //     const unique = [...new Set(removedIds)];
// //     const validIds = new Set(lv.sticks.map((s) => s.id));
// //     if (unique.length !== removedIds.length || !unique.every((id) => validIds.has(id))) {
// //       return res.status(400).json({ success: false, message: 'Invalid stick ids' });
// //     }

// //     const remaining = lv.sticks.filter((s) => !unique.includes(s.id));
// //     const resultText = decode(remaining);
// //     const correct = unique.length === lv.removeCount && resultText === lv.targetText;

// //     res.json({
// //       success: true,
// //       correct,
// //       removedCount: unique.length,
// //       resultText,
// //       message: correct ? 'Correct! It shows 10 (TEN)' : 'Wrong, try again',
// //     });
// //   } catch (e) {
// //     console.error(e);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // GET /solution -> ids to remove (for the "show solution" animation)
// // router.get('/solution', async (req, res) => {
// //   try {
// //     const lv = await getLevel46();
// //     if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });
// //     res.json({ success: true, data: { solutionIds: lv.solutionIds } });
// //   } catch (e) {
// //     console.error(e);
// //     res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // module.exports = router;
// // Braintwistlevel46routes.js
// // app.use('/api/braintwist/level46', require('./Braintwistlevel46routes'));

// const express = require('express');
// // level46Db.js normally lives in ../data/ ; fall back to this folder if you put it next to the routes
// let db;
// try {
//   db = require('../data/level46Db');
// } catch (e) {
//   if (e.code !== 'MODULE_NOT_FOUND') throw e;
//   db = require('./level46Db');
// }
// const { initLevel46, getLevel46 } = db;

// const router = express.Router();

// // create table + seed on startup
// initLevel46().catch((e) => console.error('[level46] init failed', e));

// // 7-segment digit map (segments sorted alphabetically)
// const DIGIT_SEGMENTS = {
//   0: 'abcdef',
//   1: 'bc',
//   2: 'abdeg',
//   3: 'abcdg',
//   4: 'bcfg',
//   5: 'acdfg',
//   6: 'acdefg',
//   7: 'abc',
//   8: 'abcdefg',
//   9: 'abcdfg',
// };

// function decode(sticks, digitCount = 2) {
//   let out = '';
//   for (let d = 0; d < digitCount; d++) {
//     const segs = sticks
//       .filter((s) => s.digit === d)
//       .map((s) => s.seg)
//       .sort()
//       .join('');
//     if (!segs) continue;
//     const hit = Object.keys(DIGIT_SEGMENTS).find((k) => DIGIT_SEGMENTS[k] === segs);
//     out += hit !== undefined ? hit : '?';
//   }
//   return out;
// }

// // GET /  -> level data (solution is NOT sent)
// router.get('/', async (req, res) => {
//   try {
//     const lv = await getLevel46();
//     if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });
//     const { solutionIds, ...safe } = lv;
//     res.json({ success: true, data: safe });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // POST /check  body: { removedIds: string[] }
// router.post('/check', async (req, res) => {
//   try {
//     const lv = await getLevel46();
//     if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });

//     const removedIds = req.body && req.body.removedIds;
//     if (!Array.isArray(removedIds)) {
//       return res.status(400).json({ success: false, message: 'removedIds must be an array' });
//     }

//     const unique = [...new Set(removedIds)];
//     const validIds = new Set(lv.sticks.map((s) => s.id));
//     if (unique.length !== removedIds.length || !unique.every((id) => validIds.has(id))) {
//       return res.status(400).json({ success: false, message: 'Invalid stick ids' });
//     }

//     const remaining = lv.sticks.filter((s) => !unique.includes(s.id));
//     const resultText = decode(remaining);
//     const correct = unique.length === lv.removeCount && resultText === lv.targetText;

//     res.json({
//       success: true,
//       correct,
//       removedCount: unique.length,
//       resultText,
//       message: correct ? 'Correct! It shows 10 (TEN)' : 'Wrong, try again',
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // GET /solution -> ids to remove (for the "show solution" animation)
// router.get('/solution', async (req, res) => {
//   try {
//     const lv = await getLevel46();
//     if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });
//     res.json({ success: true, data: { solutionIds: lv.solutionIds } });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = router;
const express = require('express');
let db;
try {
  db = require('../data/level46Db');
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') throw e;
  db = require('./level46Db');
}
const { initLevel46, getLevel46 } = db;

const router = express.Router();

initLevel46().catch((e) => console.error('[level46] init failed', e));

// GET /  -> level data (solution is NOT sent)
router.get('/', async (req, res) => {
  try {
    const lv = await getLevel46();
    if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });
    const { solutionIds, ...safe } = lv;
    res.json({ success: true, data: safe });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /check  body: { removedIds: string[] }
router.post('/check', async (req, res) => {
  try {
    const lv = await getLevel46();
    if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });

    const removedIds = req.body && req.body.removedIds;
    if (!Array.isArray(removedIds)) {
      return res.status(400).json({ success: false, message: 'removedIds must be an array' });
    }

    const unique = [...new Set(removedIds)];
    const validIds = new Set(lv.sticks.map((s) => s.id));
    if (unique.length !== removedIds.length || !unique.every((id) => validIds.has(id))) {
      return res.status(400).json({ success: false, message: 'Invalid stick ids' });
    }

    const solution = new Set(lv.solutionIds);
    const correct =
      unique.length === lv.removeCount &&
      unique.length === solution.size &&
      unique.every((id) => solution.has(id));

    res.json({
      success: true,
      correct,
      removedCount: unique.length,
      resultText: '',
      message: correct ? 'Correct!' : 'Wrong, try again',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /solution -> ids to remove (for the "show solution" animation)
router.get('/solution', async (req, res) => {
  try {
    const lv = await getLevel46();
    if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });
    res.json({ success: true, data: { solutionIds: lv.solutionIds } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;