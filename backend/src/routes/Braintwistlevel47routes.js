const express = require('express');
// level47Db.js normally lives in ../data/ ; fall back to this folder if you put it next to the routes
let db;
try {
  db = require('../data/level47Db');
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') throw e;
  db = require('./level47Db');
}
const { initLevel47, getLevel47 } = db;

const router = express.Router();

// create table + seed on startup
initLevel47().catch((e) => console.error('[level47] init failed', e));

// GET /  -> level data (solution is NOT sent)
router.get('/', async (req, res) => {
  try {
    const lv = await getLevel47();
    if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });
    const { solutionIds, ...safe } = lv;
    res.json({ success: true, data: safe });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /check  body: { clickedIds: string[] }  (ids in click order)
//   valid   -> the clicks so far match the start of the solution
//   correct -> all clicks match the full solution
router.post('/check', async (req, res) => {
  try {
    const lv = await getLevel47();
    if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });

    const clickedIds = req.body && req.body.clickedIds;
    if (!Array.isArray(clickedIds)) {
      return res.status(400).json({ success: false, message: 'clickedIds must be an array' });
    }

    const unique = [...new Set(clickedIds)];
    const validIds = new Set(lv.items.map((i) => i.id));
    if (
      unique.length !== clickedIds.length ||
      clickedIds.length > lv.solutionIds.length ||
      !unique.every((id) => validIds.has(id))
    ) {
      return res.status(400).json({ success: false, message: 'Invalid ids' });
    }

    const valid = clickedIds.every((id, i) => id === lv.solutionIds[i]);
    const correct = valid && clickedIds.length === lv.solutionIds.length;

    res.json({
      success: true,
      correct,
      valid,
      count: clickedIds.length,
      message: correct ? 'Correct!' : valid ? 'Keep going' : 'Wrong, try again',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /solution -> ids in click order (for the "show solution" animation)
router.get('/solution', async (req, res) => {
  try {
    const lv = await getLevel47();
    if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });
    res.json({ success: true, data: { solutionIds: lv.solutionIds } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;