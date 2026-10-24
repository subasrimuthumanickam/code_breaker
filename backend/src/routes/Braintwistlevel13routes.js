// Level 13 - "Burn everything!"  (cat on the shelf)
//
// Frontend  --POST-->  /level13/start | /level13/burn | /level13/hint
// Backend validates, saves to MySQL (bt_level13_sessions / bt_level13_actions) and answers in JSON.
//
// MOUNT it next to the other Brain Twist routes, e.g. in your server/app file:
//   app.use('/api/brain-twist/level13', require('./routes/Braintwistlevel13routes'));
// (use the SAME prefix as BT_API in the app's ./config, plus "/level13")

const express = require('express');
const L = require('../data/level13Db');

const router = express.Router();

L.ensureTables().catch((e) => console.error('[level13] could not create tables:', e.message));

// what each item does when the torch touches it
const RULES = {
  sofa:    { burn: ['sofa', 'pillow'] },            // fire spreads to the pillow
  pillow:  { burn: ['pillow'] },
  clothes: { burn: ['clothes'] },
  shelf:   { burn: ['shelf'], catEscapes: true },   // the cat jumps down and runs away
  cat:     { wrong: true },                         // never burn the cat
};
const MUST_BURN = ['sofa', 'pillow', 'clothes', 'shelf'];
const HINT_ORDER = ['sofa', 'clothes', 'shelf'];
const HINT_COST = 25;

const HINT_TEXT = {
  sofa: 'Light the sofa. The fire spreads to the pillow too.',
  clothes: "Don't forget the pile of clothes on the floor.",
  shelf: 'Burn the shelf as well. The cat can look after itself!',
};

const bad = (res, code, error, message) => res.status(code).json({ ok: false, error, message });

const view = (s, extra = {}) => ({
  ok: true,
  sessionId: s.id,
  burned: L.csv(s.burned),
  catEscaped: !!s.cat_escaped,
  completed: s.status === 'completed',
  attempts: s.total_attempts,
  wrong: s.wrong_attempts,
  ...extra,
});

async function loadSession(req, res) {
  const playerId = Number(req.body.playerId);
  const sessionId = Number(req.body.sessionId);
  if (!playerId || !sessionId) { bad(res, 400, 'bad_request', 'playerId and sessionId are required'); return null; }
  const s = await L.getSession(sessionId);
  if (!s || s.player_id !== playerId) { bad(res, 404, 'session_not_found', 'Session not found'); return null; }
  return s;
}

/* POST /level13/start  { playerId } */
router.post('/start', async (req, res) => {
  try {
    const playerId = Number(req.body.playerId);
    if (!playerId) return bad(res, 400, 'bad_request', 'playerId is required');
    const s = (await L.findOpenSession(playerId)) || (await L.createSession(playerId));
    res.json(view(s, { items: MUST_BURN }));
  } catch (e) {
    console.error('[level13] start:', e);
    bad(res, 500, 'server_error', 'Could not start level 13');
  }
});

/* POST /level13/burn  { playerId, sessionId, item } */
router.post('/burn', async (req, res) => {
  try {
    const s = await loadSession(req, res);
    if (!s) return;

    const item = String(req.body.item || '');
    const rule = RULES[item];
    if (!rule) return bad(res, 400, 'bad_item', 'Unknown item');

    if (s.status === 'completed') return res.json(view(s, { correct: true, newlyBurned: [], message: 'Already completed' }));

    let burned = L.csv(s.burned);
    let catEscaped = !!s.cat_escaped;
    let newly = [];
    let correct = true;
    let message = '';

    if (rule.wrong) {
      correct = false;
      message = "Not the cat! Keep it safe. 🐱";
    } else {
      newly = rule.burn.filter((x) => !burned.includes(x));
      burned = [...burned, ...newly];
      if (rule.catEscapes && !catEscaped) {
        catEscaped = true;
        message = 'The cat jumped down and ran away! 🐱💨';
      } else if (!newly.length) {
        message = 'That is already burned.';
      } else if (item === 'sofa') {
        message = 'The fire spread to the pillow! 🔥';
      }
    }

    const completed = MUST_BURN.every((x) => burned.includes(x));
    const saved = await L.saveBurn(s, { item, correct, newly, burned, catEscaped, completed });

    res.json(view(saved, {
      item,
      correct,
      newlyBurned: newly,
      allBurned: completed,
      message: completed ? 'Everything is burned! 🔥' : message,
    }));
  } catch (e) {
    console.error('[level13] burn:', e);
    bad(res, 500, 'server_error', 'Could not save your move');
  }
});

/* POST /level13/hint  { playerId, sessionId }   (costs 25 hints) */
router.post('/hint', async (req, res) => {
  try {
    const s = await loadSession(req, res);
    if (!s) return;

    const burned = L.csv(s.burned);
    const next = HINT_ORDER.find((x) => !burned.includes(x));
    if (!next) return res.json(view(s, { text: 'Everything is already burned!', hints: null }));

    const hints = await L.spendHints(s.player_id, HINT_COST);
    if (hints === null) return bad(res, 402, 'not_enough_hints', 'Not enough hints');

    await L.addHintUsed(s.id);
    res.json(view(s, { hints, text: HINT_TEXT[next], target: next }));
  } catch (e) {
    console.error('[level13] hint:', e);
    bad(res, 500, 'server_error', 'Could not get a hint');
  }
});

module.exports = router;