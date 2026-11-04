const express = require('express');
// level48Db.js normally lives in ../data/ ; fall back to this folder if you put it next to the routes
let db;
try {
  db = require('../data/level48Db');
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') throw e;
  db = require('./level48Db');
}
const { initLevel48, getLevel48 } = db;

const router = express.Router();

// create table + seed on startup
initLevel48().catch((e) => console.error('[level48] init failed', e));

// GET /  -> level data (answer and hint are NOT sent)
router.get('/', async (req, res) => {
  try {
    const lv = await getLevel48();
    if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });
    res.json({ success: true, data: { id: lv.id, question: lv.question } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /check  body: { answer: number }
router.post('/check', async (req, res) => {
  try {
    const lv = await getLevel48();
    if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });

    const answer = Number(req.body && req.body.answer);
    if (!Number.isInteger(answer) || answer < 0 || answer > 99) {
      return res.status(400).json({ success: false, message: 'answer must be a whole number' });
    }

    const correct = answer === Number(lv.answer);
    res.json({
      success: true,
      correct,
      message: correct ? 'Correct!' : 'Wrong, try again',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /hint -> hint text
router.get('/hint', async (req, res) => {
  try {
    const lv = await getLevel48();
    if (!lv) return res.status(404).json({ success: false, message: 'Level not found' });
    res.json({ success: true, data: { hint: lv.hint || '' } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;