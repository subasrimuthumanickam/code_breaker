// // // const express = require('express');
// // // const db = require('./level36Db');

// // // const router = express.Router();

// // // const ANSWER = '70';
// // // const HINT_COST = 25;
// // // const SKIP_COST = 50; // keep in sync with the app
// // // const REWARD = 75;

// // // const HINTS = [
// // //   'Look at the sign at the top.',
// // //   'The level number has a digit you can move.',
// // //   'Drag the 0 from the sign and put it next to the 7.',
// // // ];

// // // function need(req, res) {
// // //   const { playerId } = req.body || {};
// // //   if (playerId === undefined || playerId === null || playerId === '') {
// // //     res.status(400).json({ error: 'playerId required' });
// // //     return null;
// // //   }
// // //   return playerId;
// // // }

// // // router.post('/start', (req, res) => {
// // //   const playerId = need(req, res);
// // //   if (playerId === null) return;
// // //   const p = db.getPlayer(playerId);
// // //   res.json({ hints: p.hints });
// // // });

// // // router.post('/answer', (req, res) => {
// // //   const playerId = need(req, res);
// // //   if (playerId === null) return;
// // //   const guess = String((req.body || {}).guess || '').trim();
// // //   const attempts = db.addAttempt(playerId);
// // //   const correct = guess === ANSWER;
// // //   if (correct) db.markSolved(playerId);
// // //   res.json({ correct, attempts, hints: db.getPlayer(playerId).hints });
// // // });

// // // router.post('/hint', (req, res) => {
// // //   const playerId = need(req, res);
// // //   if (playerId === null) return;
// // //   if (!db.spendHints(playerId, HINT_COST)) {
// // //     return res.status(402).json({ error: 'Not enough hints' });
// // //   }
// // //   const i = Math.min(db.nextHintIndex(playerId), HINTS.length - 1);
// // //   res.json({ hint: { text: HINTS[i] }, hints: db.getPlayer(playerId).hints });
// // // });

// // // router.post('/reward', (req, res) => {
// // //   const playerId = need(req, res);
// // //   if (playerId === null) return;
// // //   // TODO: verify the rewarded ad on the server before paying out
// // //   const hints = db.addHints(playerId, REWARD);
// // //   res.json({ hints });
// // // });

// // // router.post('/skip', (req, res) => {
// // //   const playerId = need(req, res);
// // //   if (playerId === null) return;
// // //   if (!db.spendHints(playerId, SKIP_COST)) {
// // //     return res.status(402).json({ error: 'Not enough hints' });
// // //   }
// // //   const attempts = db.getPlayer(playerId).attempts || 1;
// // //   db.markSolved(playerId);
// // //   res.json({ answer: ANSWER, attempts, hints: db.getPlayer(playerId).hints });
// // // });

// // // module.exports = router;
// // // Simple in-memory store for Level 36. Replace with your real database.
// // const players = new Map();

// // const START_HINTS = 100;

// // function getPlayer(playerId) {
// //   const id = String(playerId);
// //   if (!players.has(id)) {
// //     players.set(id, { hints: START_HINTS, attempts: 0, hintsUsed: 0, solved: false });
// //   }
// //   return players.get(id);
// // }

// // function spendHints(playerId, cost) {
// //   const p = getPlayer(playerId);
// //   if (p.hints < cost) return false;
// //   p.hints -= cost;
// //   return true;
// // }

// // function addHints(playerId, amount) {
// //   const p = getPlayer(playerId);
// //   p.hints += amount;
// //   return p.hints;
// // }

// // function addAttempt(playerId) {
// //   const p = getPlayer(playerId);
// //   p.attempts += 1;
// //   return p.attempts;
// // }

// // function nextHintIndex(playerId) {
// //   const p = getPlayer(playerId);
// //   const i = p.hintsUsed;
// //   p.hintsUsed += 1;
// //   return i;
// // }

// // function markSolved(playerId) {
// //   getPlayer(playerId).solved = true;
// // }

// // module.exports = {
// //   getPlayer,
// //   spendHints,
// //   addHints,
// //   addAttempt,
// //   nextHintIndex,
// //   markSolved,
// // };
// const express = require("express");
// const router = express.Router();

// const {
//   getPlayer,
//   spendHints,
//   addHints,
//   addAttempt,
//   nextHintIndex,
//   markSolved,
// } = require("../data/level36Db");

// const ANSWER = "70";
// const HINT_COST = 25;
// const SKIP_COST = 50;
// const REWARD = 75;

// const HINTS = [
//   { text: "Look at the sign at the top." },
//   { text: "Can you move a digit from the sign?" },
//   { text: "Drag the 0 from LEVEL 70 next to the 7." },
// ];

// function needPlayer(req, res) {
//   const { playerId } = req.body || {};
//   if (playerId === undefined || playerId === null || playerId === "") {
//     res.status(400).json({ success: false, error: "playerId required" });
//     return null;
//   }
//   return playerId;
// }

// router.post("/start", (req, res) => {
//   const playerId = needPlayer(req, res);
//   if (playerId === null) return;
//   const p = getPlayer(playerId);
//   res.json({ success: true, hints: p.hints, attempts: p.attempts, solved: p.solved });
// });

// router.post("/answer", (req, res) => {
//   const playerId = needPlayer(req, res);
//   if (playerId === null) return;

//   const attempts = addAttempt(playerId);
//   const guess = String(req.body.guess ?? "").trim();
//   const correct = guess === ANSWER;
//   if (correct) markSolved(playerId);

//   res.json({ success: true, correct, attempts, hints: getPlayer(playerId).hints });
// });

// router.post("/hint", (req, res) => {
//   const playerId = needPlayer(req, res);
//   if (playerId === null) return;

//   if (!spendHints(playerId, HINT_COST)) {
//     return res.status(402).json({ success: false, error: "Not enough hints" });
//   }
//   const i = Math.min(nextHintIndex(playerId), HINTS.length - 1);
//   res.json({ success: true, hint: HINTS[i], hints: getPlayer(playerId).hints });
// });

// router.post("/reward", (req, res) => {
//   const playerId = needPlayer(req, res);
//   if (playerId === null) return;
//   const hints = addHints(playerId, REWARD);
//   res.json({ success: true, hints });
// });

// router.post("/skip", (req, res) => {
//   const playerId = needPlayer(req, res);
//   if (playerId === null) return;

//   if (!spendHints(playerId, SKIP_COST)) {
//     return res.status(402).json({ success: false, error: "Not enough hints" });
//   }
//   const attempts = addAttempt(playerId);
//   markSolved(playerId);
//   res.json({ success: true, answer: ANSWER, attempts, hints: getPlayer(playerId).hints });
// });

// router.get("/status/:playerId", (req, res) => {
//   const p = getPlayer(req.params.playerId);
//   res.json({ success: true, ...p });
// });

// module.exports = router;
const express = require("express");
const router = express.Router();

const {
  getPlayer,
  spendHints,
  addHints,
  addAttempt,
  nextHintIndex,
  markSolved,
} = require("../data/level36Db");

const ANSWER = "36";
const HINT_COST = 25;
const SKIP_COST = 50;
const REWARD = 75;

const HINTS = [
  { text: "Look at the sign at the top." },
  { text: "Can you move a digit from the sign?" },
  { text: "Drag the 0 from LEVEL 70 next to the 7." },
];

function needPlayer(req, res) {
  const { playerId } = req.body || {};
  if (playerId === undefined || playerId === null || playerId === "") {
    res.status(400).json({ success: false, error: "playerId required" });
    return null;
  }
  return playerId;
}

router.post("/start", (req, res) => {
  const playerId = needPlayer(req, res);
  if (playerId === null) return;
  const p = getPlayer(playerId);
  res.json({ success: true, hints: p.hints, attempts: p.attempts, solved: p.solved });
});

router.post("/answer", (req, res) => {
  const playerId = needPlayer(req, res);
  if (playerId === null) return;

  const attempts = addAttempt(playerId);
  const guess = String(req.body.guess ?? "").trim();
  const correct = guess === ANSWER;
  if (correct) markSolved(playerId);

  res.json({ success: true, correct, attempts, hints: getPlayer(playerId).hints });
});

router.post("/hint", (req, res) => {
  const playerId = needPlayer(req, res);
  if (playerId === null) return;

  if (!spendHints(playerId, HINT_COST)) {
    return res.status(402).json({ success: false, error: "Not enough hints" });
  }
  const i = Math.min(nextHintIndex(playerId), HINTS.length - 1);
  res.json({ success: true, hint: HINTS[i], hints: getPlayer(playerId).hints });
});

router.post("/reward", (req, res) => {
  const playerId = needPlayer(req, res);
  if (playerId === null) return;
  const hints = addHints(playerId, REWARD);
  res.json({ success: true, hints });
});

router.post("/skip", (req, res) => {
  const playerId = needPlayer(req, res);
  if (playerId === null) return;

  if (!spendHints(playerId, SKIP_COST)) {
    return res.status(402).json({ success: false, error: "Not enough hints" });
  }
  const attempts = addAttempt(playerId);
  markSolved(playerId);
  res.json({ success: true, answer: ANSWER, attempts, hints: getPlayer(playerId).hints });
});

router.get("/status/:playerId", (req, res) => {
  const p = getPlayer(req.params.playerId);
  res.json({ success: true, ...p });
});

module.exports = router;