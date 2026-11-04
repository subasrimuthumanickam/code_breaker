// routes/Braintwistlevel50routes.js
const express = require('express');
const db = require('../data/level50Db');

const router = express.Router();

// GET /api/braintwist/level50/info?playerId=xxx
router.get('/info', async (req, res) => {
  try {
    const playerId = String(req.query.playerId || '');
    if (!playerId) return res.status(400).json({ ok: false, error: 'playerId required' });

    const cfg = await db.getConfig();
    if (!cfg) return res.status(500).json({ ok: false, error: 'level50 config missing' });

    const progress = await db.ensureProgress(playerId);
    res.json({
      ok: true,
      level: 50,
      question: cfg.question,
      bulbs: 3,
      switches: cfg.patterns, // [{on:[1,0,0], off:[0,0,0]}, ...]
      clueCost: cfg.clueCost,
      skipCost: cfg.skipCost,
      solved: !!progress.solved,
      cluesUsed: progress.clues_used,
    });
  } catch (e) {
    console.error('level50 info', e);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

// POST /api/braintwist/level50/answer
// body: { playerId, moves: [{ s: 0..3, on: true|false }, ...], dragged: true }
// The server replays the switch moves itself, so the result cannot be faked by sending "bulbs".
router.post('/answer', async (req, res) => {
  try {
    const { playerId, moves, dragged } = req.body || {};
    if (!playerId || !Array.isArray(moves)) {
      return res.status(400).json({ ok: false, error: 'playerId & moves required' });
    }

    const cfg = await db.getConfig();
    let bulbs = [0, 0, 0];
    const state = [false, false, false, false];

    for (const m of moves.slice(0, 200)) {
      const s = Number(m && m.s);
      if (!Number.isInteger(s) || s < 0 || s >= cfg.patterns.length) continue;
      const on = !!m.on;
      if (state[s] === on) continue; // ignore impossible moves
      state[s] = on;
      bulbs = cfg.patterns[s][on ? 'on' : 'off'].slice();
    }

    const litOk = cfg.needOn.every((i) => bulbs[i] === 1);
    const correct = !!dragged && litOk;

    await db.recordAttempt(String(playerId), moves.slice(0, 200), correct);
    res.json({ ok: true, correct, reward: correct ? cfg.rewardHints : 0, bulbs });
  } catch (e) {
    console.error('level50 answer', e);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

// POST /api/braintwist/level50/clue  { playerId, hints }
router.post('/clue', async (req, res) => {
  try {
    const { playerId, hints } = req.body || {};
    if (!playerId) return res.status(400).json({ ok: false, error: 'playerId required' });

    const cfg = await db.getConfig();
    if (Number(hints) < cfg.clueCost) {
      return res.json({ ok: false, error: 'not_enough_hints', cost: cfg.clueCost });
    }

    const progress = await db.ensureProgress(String(playerId));
    const idx = Math.min(progress.clues_used, cfg.hints.length - 1);
    await db.recordClue(String(playerId));

    res.json({ ok: true, text: cfg.hints[idx], cost: cfg.clueCost });
  } catch (e) {
    console.error('level50 clue', e);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

// POST /api/braintwist/level50/skip  { playerId, hints }
router.post('/skip', async (req, res) => {
  try {
    const { playerId, hints } = req.body || {};
    if (!playerId) return res.status(400).json({ ok: false, error: 'playerId required' });

    const cfg = await db.getConfig();
    if (Number(hints) < cfg.skipCost) {
      return res.json({ ok: false, error: 'not_enough_hints', cost: cfg.skipCost });
    }
    await db.recordSkip(String(playerId));
    res.json({ ok: true, cost: cfg.skipCost });
  } catch (e) {
    console.error('level50 skip', e);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

module.exports = router;