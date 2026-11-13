const express = require('express');
// level45Db.js normally lives in src/data/, but also works if it sits next to this file in src/routes/
let db;
try {
  db = require('../data/level45Db');
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') throw e;
  db = require('./level45Db');
}

const router = express.Router();

const parseOptions = (v) => (typeof v === 'string' ? JSON.parse(v) : v);

// GET /api/braintwist/level45  -> all stages (correct answers are NOT sent to the client)
router.get('/', async (req, res) => {
  try {
    const cfg = await db.getLevelConfig();
    if (!cfg) return res.status(404).json({ error: 'Level 45 not found' });
    const stages = await db.getStages();
    if (!stages.length) return res.status(404).json({ error: 'Level 45 has no stages' });

    res.json({
      level: cfg.level_number,
      hintCost: 0,
      skipCost: cfg.skip_cost,
      stages: stages.map((s) => ({
        stage: s.stage_number,
        prompt: s.prompt,
        options: parseOptions(s.options_json),
      })),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/braintwist/level45/check   body: { userId, stage, pickedIndex }
router.post('/check', async (req, res) => {
  try {
    const { userId = 'guest', stage, pickedIndex } = req.body || {};
    if (!Number.isInteger(stage) || !Number.isInteger(pickedIndex)) {
      return res.status(400).json({ error: 'stage and pickedIndex must be integers' });
    }

    const cfg = await db.getLevelConfig();
    if (!cfg) return res.status(404).json({ error: 'Level 45 not found' });
    const row = await db.getStage(stage);
    if (!row) return res.status(404).json({ error: 'Stage not found' });

    const correct = pickedIndex === row.correct_index;
    await db.saveAttempt(String(userId), stage, pickedIndex, correct);

    const isLast = stage >= cfg.total_stages;
    if (correct) await db.saveStageProgress(String(userId), stage, isLast);

    const completed = correct && isLast;
    res.json({
      correct,
      message: correct
        ? completed ? 'Level complete!' : 'Correct! Next one...'
        : 'Not quite. Try again!',
      completed,
      nextStage: correct && !isLast ? stage + 1 : null,
      nextLevel: completed ? 46 : null,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/braintwist/level45/hint   body: { userId, stage }
router.post('/hint', async (req, res) => {
  try {
    const { userId = 'guest', stage = 1 } = req.body || {};
    const cfg = await db.getLevelConfig();
    if (!cfg) return res.status(404).json({ error: 'Level 45 not found' });
    const row = await db.getStage(Number(stage));
    if (!row) return res.status(404).json({ error: 'Stage not found' });
    await db.addHintUsed(String(userId));
    res.json({ success: true, free: true, hint: row.hint_text, cost: 0 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;