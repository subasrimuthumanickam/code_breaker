// // // // // Server-side mirror of the frontend's DIFFICULTY_CONFIG (types/game.ts).
// // // // // IMPORTANT: adjust these numbers so they match your frontend config exactly —
// // // // // the backend is now the source of truth for scoring/attempts/time, so if the
// // // // // two drift apart the UI and the API will disagree with each other.
// // // // const DIFFICULTY_CONFIG = {
// // // //   easy: { label: "EASY", codeLength: 3, maxAttempts: 4, timeLimitSec: 60, color: "#22C55E" },
// // // //   medium: { label: "MEDIUM", codeLength: 4, maxAttempts: 6, timeLimitSec: 90, color: "#F5C518" },
// // // //   hard: { label: "HARD", codeLength: 5, maxAttempts: 8, timeLimitSec: 120, color: "#F97316" },
// // // //   extreme: { label: "EXTREME", codeLength: 6, maxAttempts: 10, timeLimitSec: 150, color: "#EF4444" },
// // // // };

// // // // const VALID_DIFFICULTIES = Object.keys(DIFFICULTY_CONFIG);

// // // // module.exports = { DIFFICULTY_CONFIG, VALID_DIFFICULTIES };
// // // // Server-side mirror of the frontend's DIFFICULTY_CONFIG (types/game.ts).
// // // // IMPORTANT: keep this in sync with the frontend file — the backend is the
// // // // source of truth for scoring/attempts/time, the frontend must match it.
// // // //
// // // // clueType controls how much info a guess reveals:
// // // //   "direct"   (easy)    -> position-by-position digit reveal
// // // //   "moderate" (medium)  -> exact + partial match counts (bulls & cows)
// // // //   "hard"     (hard/extreme) -> exact match count only, partials hidden
// // // //
// // // // rounds = how many separate secret-codes the player plays through in one
// // // // session at that difficulty (session flow lives in the frontend; the
// // // // backend just answers "start a game" repeatedly).
// // // const DIFFICULTY_CONFIG = {
// // //   easy: {
// // //     label: "EASY",
// // //     codeLength: 3,
// // //     maxAttempts: 4,
// // //     timeLimitSec: 240, // 4 min per round
// // //     rounds: 8,
// // //     clueType: "direct",
// // //     color: "#22C55E",
// // //   },
// // //   medium: {
// // //     label: "MEDIUM",
// // //     codeLength: 4,
// // //     maxAttempts: 6,
// // //     timeLimitSec: 180, // 3 min per round
// // //     rounds: 7,
// // //     clueType: "moderate",
// // //     color: "#F5C518",
// // //   },
// // //   hard: {
// // //     label: "HARD",
// // //     codeLength: 5,
// // //     maxAttempts: 8,
// // //     timeLimitSec: 120, // 2 min per round
// // //     rounds: 6,
// // //     clueType: "hard",
// // //     color: "#F97316",
// // //   },
// // //   extreme: {
// // //     label: "EXTREME",
// // //     codeLength: 6,
// // //     maxAttempts: 10,
// // //     timeLimitSec: 60, // 1 min per round
// // //     rounds: 4,
// // //     clueType: "hard",
// // //     color: "#EF4444",
// // //   },
// // // };

// // // const VALID_DIFFICULTIES = Object.keys(DIFFICULTY_CONFIG);

// // // module.exports = { DIFFICULTY_CONFIG, VALID_DIFFICULTIES };
// // // backend/src/config/difficulty.js

// // const DIFFICULTY_CONFIG = {
// //   easy: {
// //     label: "EASY",
// //     clueType: "direct",     // per-digit correct/present/absent feedback
// //     codeLength: 3,
// //     maxAttempts: 6,          // 👈 was 4 — 6 gives enough room to actually use logic
// //     timeLimitSec: 90,
// //     rounds: 8,
// //     color: "#22C55E",
// //   },
// //   medium: {
// //     label: "MEDIUM",
// //     clueType: "counts",      // exactMatches + partialMatches only (Mastermind-style counts)
// //     codeLength: 4,
// //     maxAttempts: 8,
// //     timeLimitSec: 90,
// //     rounds: 8,
// //     color: "#F5C518",
// //   },
// //   hard: {
// //     label: "HARD",
// //     clueType: "hard",        // only exactMatches shown, no partial info
// //     codeLength: 4,
// //     maxAttempts: 8,
// //     timeLimitSec: 75,
// //     rounds: 10,
// //     color: "#F97066",
// //   },
// //   extreme: {
// //     label: "EXTREME",
// //     clueType: "hard",
// //     codeLength: 5,
// //     maxAttempts: 10,
// //     timeLimitSec: 60,
// //     rounds: 10,
// //     color: "#A855F7",
// //   },
// // };

// // const VALID_DIFFICULTIES = Object.keys(DIFFICULTY_CONFIG);

// // module.exports = { DIFFICULTY_CONFIG, VALID_DIFFICULTIES };
// const DIFFICULTY_CONFIG = {
//   easy: {
//     label: "EASY",
//     clueType: "direct",
//     codeLength: 3,
//     maxAttempts: 6,
//     timeLimitSec: 240,   // 4 min
//     rounds: 7,
//     color: "#22C55E",
//   },
//   medium: {
//     label: "MEDIUM",
//     clueType: "counts",
//     codeLength: 4,
//     maxAttempts: 8,
//     timeLimitSec: 180,   // 3 min
//     rounds: 7,
//     color: "#F5C518",
//   },
//   hard: {
//     label: "HARD",
//     clueType: "hard",
//     codeLength: 4,
//     maxAttempts: 8,
//     timeLimitSec: 120,   // 2 min
//     rounds: 7,
//     color: "#F97066",
//   },
//   extreme: {
//     label: "EXTREME",
//     clueType: "hard",
//     codeLength: 5,
//     maxAttempts: 10,
//     timeLimitSec: 60,    // 1 min
//     rounds: 7,
//     color: "#A855F7",
//   },
// };

// const VALID_DIFFICULTIES = Object.keys(DIFFICULTY_CONFIG);
// const DIFFICULTY_ORDER = ["easy", "medium", "hard", "extreme"];

// module.exports = { DIFFICULTY_CONFIG, VALID_DIFFICULTIES, DIFFICULTY_ORDER };
const DIFFICULTY_CONFIG = {
  easy: {
    label: "EASY",
    clueType: "direct",
    codeLength: 3,
    maxAttempts: 6,
    timeLimitSec: 240,   // 4 min
    rounds: 7,
    color: "#22C55E",
  },
  medium: {
    label: "MEDIUM",
    clueType: "counts",
    codeLength: 4,
    maxAttempts: 8,
    timeLimitSec: 180,   // 3 min
    rounds: 7,
    color: "#F5C518",
  },
  hard: {
    label: "HARD",
    clueType: "hard",
    codeLength: 4,
    maxAttempts: 8,
    timeLimitSec: 120,   // 2 min
    rounds: 7,
    color: "#F97066",
  },
  extreme: {
    label: "EXTREME",
    clueType: "hard",
    codeLength: 5,
    maxAttempts: 10,
    timeLimitSec: 60,    // 1 min
    rounds: 7,
    color: "#A855F7",
  },
};

const VALID_DIFFICULTIES = Object.keys(DIFFICULTY_CONFIG);
const DIFFICULTY_ORDER = ["easy", "medium", "hard", "extreme"];

module.exports = { DIFFICULTY_CONFIG, VALID_DIFFICULTIES, DIFFICULTY_ORDER };