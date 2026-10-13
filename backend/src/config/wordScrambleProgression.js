// // // backend/src/config/wordScrambleProgression.js
// // //
// // // Controls, per round number:
// // //   1) how many words ("cross") the crossword table has
// // //   2) how many seconds the round timer gets (depends on difficulty)

// // /* ------------------------------------------------------------
// //    1) WORD COUNT PER ROUND

// //    Rounds 1-3   -> 3 words
// //    Rounds 4-6   -> 5 words
// //    Rounds 7-9   -> 6 words
// //    Rounds 10-12 -> 8 words
// //    Rounds 13-15 -> 9 words
// //    Rounds 16+   -> 10 words (capped, never goes to 11, 12 ...)

// //    Pattern: every 3 rounds the count grows (+2, +1, +2, +1 ...),
// //    then it stops at MAX_WORDS.
// // ------------------------------------------------------------ */

// // const ROUNDS_PER_STEP = 3;
// // const START_WORDS = 3;
// // const MAX_WORDS = 10;

// // function getTargetWordCount(roundNumber) {
// //   const round = Math.max(1, Number(roundNumber) || 1);
// //   const step = Math.floor((round - 1) / ROUNDS_PER_STEP); // 0,1,2,3...
// //   const words = START_WORDS + Math.ceil(step * 1.5); // 3,5,6,8,9,11...
// //   return Math.min(MAX_WORDS, words);
// // }

// // /* ------------------------------------------------------------
// //    2) TIMER PER ROUND  (edit these numbers freely)

// //    time = base + perWord * wordCount

// //    easy   -> shorter timer
// //    medium -> longer timer
// //    hard   -> longest timer
// // ------------------------------------------------------------ */

// // const TIME_RULES = {
// //   easy: { base: 10, perWord: 4 }, //  3 words = 22s ... 10 words = 50s
// //   medium: { base: 20, perWord: 6 }, //  3 words = 38s ... 10 words = 80s
// //   hard: { base: 25, perWord: 8 }, //  3 words = 49s ... 10 words = 105s
// // };

// // function getTimeLimitSec(difficulty, roundNumber) {
// //   const rule = TIME_RULES[difficulty] || TIME_RULES.easy;
// //   return rule.base + rule.perWord * getTargetWordCount(roundNumber);
// // }

// // /* ------------------------------------------------------------
// //    3) RANDOM PUZZLE WITH THE TARGET WORD COUNT

// //    Wraps your existing generatePuzzle(letters, dictionary, maxWords).
// //    The dictionary is shuffled on every attempt so each round gets
// //    different random words. It keeps the attempt that is closest to
// //    the target count and stops early when it hits it exactly.
// // ------------------------------------------------------------ */

// // function shuffled(list) {
// //   const copy = [...list];
// //   for (let i = copy.length - 1; i > 0; i--) {
// //     const j = Math.floor(Math.random() * (i + 1));
// //     [copy[i], copy[j]] = [copy[j], copy[i]];
// //   }
// //   return copy;
// // }

// // function generatePuzzleForRound(
// //   generatePuzzle,
// //   letters,
// //   dictionary,
// //   roundNumber,
// //   attempts = 12
// // ) {
// //   const target = getTargetWordCount(roundNumber);
// //   let best = [];

// //   for (let i = 0; i < attempts; i++) {
// //     const slots = generatePuzzle(letters, shuffled(dictionary), target) || [];

// //     if (slots.length > best.length) best = slots;
// //     if (best.length >= target) break;
// //   }

// //   return best;
// // }

// // module.exports = {
// //   ROUNDS_PER_STEP,
// //   START_WORDS,
// //   MAX_WORDS,
// //   TIME_RULES,
// //   getTargetWordCount,
// //   getTimeLimitSec,
// //   generatePuzzleForRound,
// // };
// // backend/src/config/wordScrambleProgression.js
// //
// // Controls, per round number:
// //   1) how many words ("cross") the crossword table has
// //   2) how many seconds the round timer gets (depends on difficulty)

// /* ------------------------------------------------------------
//    1) WORD COUNT PER ROUND

//    Rounds 1-3   -> 3 words
//    Rounds 4-6   -> 5 words
//    Rounds 7-9   -> 6 words
//    Rounds 10-12 -> 8 words
//    Rounds 13-15 -> 9 words
//    Rounds 16+   -> 10 words (capped, never goes to 11, 12 ...)

//    Pattern: every 3 rounds the count grows (+2, +1, +2, +1 ...),
//    then it stops at MAX_WORDS.
// ------------------------------------------------------------ */

// const ROUNDS_PER_STEP = 3;
// const START_WORDS = 3;
// const MAX_WORDS = 10;

// function getTargetWordCount(roundNumber) {
//   const round = Math.max(1, Number(roundNumber) || 1);
//   const step = Math.floor((round - 1) / ROUNDS_PER_STEP); // 0,1,2,3...
//   const words = START_WORDS + Math.ceil(step * 1.5); // 3,5,6,8,9,11...
//   return Math.min(MAX_WORDS, words);
// }

// /* ------------------------------------------------------------
//    2) TIMER PER ROUND  (edit these numbers freely)

//    time = base + perWord * wordCount

//    easy   -> shorter timer
//    medium -> longer timer
//    hard   -> longest timer
// ------------------------------------------------------------ */

// const TIME_RULES = {
//   easy: { base: 10, perWord: 4 }, //  3 words = 22s ... 10 words = 50s
//   medium: { base: 20, perWord: 6 }, //  3 words = 38s ... 10 words = 80s
//   hard: { base: 25, perWord: 8 }, //  3 words = 49s ... 10 words = 105s
// };

// // Timer for a puzzle that really has `wordCount` words
// function getTimeLimitForWords(difficulty, wordCount) {
//   const rule = TIME_RULES[difficulty] || TIME_RULES.easy;
//   return rule.base + rule.perWord * Math.max(1, Number(wordCount) || 1);
// }

// // Timer based on the round number (uses the target word count)
// function getTimeLimitSec(difficulty, roundNumber) {
//   return getTimeLimitForWords(difficulty, getTargetWordCount(roundNumber));
// }

// /* ------------------------------------------------------------
//    3) RANDOM PUZZLE WITH THE TARGET WORD COUNT

//    Wraps your existing generatePuzzle(letters, dictionary, maxWords).
//    The dictionary is shuffled on every attempt so each round gets
//    different random words. It keeps the attempt that is closest to
//    the target count and stops early when it hits it exactly.
// ------------------------------------------------------------ */

// function shuffled(list) {
//   const copy = [...list];
//   for (let i = copy.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [copy[i], copy[j]] = [copy[j], copy[i]];
//   }
//   return copy;
// }

// function generatePuzzleForRound(
//   generatePuzzle,
//   letters,
//   dictionary,
//   roundNumber,
//   attempts = 12
// ) {
//   const target = getTargetWordCount(roundNumber);
//   let best = [];

//   for (let i = 0; i < attempts; i++) {
//     const slots = generatePuzzle(letters, shuffled(dictionary), target) || [];

//     if (slots.length > best.length) best = slots;
//     if (best.length >= target) break;
//   }

//   return best;
// }

// module.exports = {
//   ROUNDS_PER_STEP,
//   START_WORDS,
//   MAX_WORDS,
//   TIME_RULES,
//   getTargetWordCount,
//   getTimeLimitSec,
//   getTimeLimitForWords,
//   generatePuzzleForRound,
// };
// backend/src/config/wordScrambleProgression.js
//
// Controls, per round number:
//   1) how many words ("cross") the crossword table has
//   2) how many seconds the round timer gets (depends on difficulty)

/* ------------------------------------------------------------
   1) WORD COUNT PER ROUND

   Rounds 1-3   -> 3 words
   Rounds 4-6   -> 5 words
   Rounds 7-9   -> 6 words
   Rounds 10-12 -> 8 words
   Rounds 13-15 -> 9 words
   Rounds 16+   -> 10 words (capped, never goes to 11, 12 ...)

   Pattern: every 3 rounds the count grows (+2, +1, +2, +1 ...),
   then it stops at MAX_WORDS.
------------------------------------------------------------ */

const ROUNDS_PER_STEP = 3;
const START_WORDS = 3;
const MAX_WORDS = 10;

function getTargetWordCount(roundNumber) {
  const round = Math.max(1, Number(roundNumber) || 1);
  const step = Math.floor((round - 1) / ROUNDS_PER_STEP); // 0,1,2,3...
  const words = START_WORDS + Math.ceil(step * 1.5); // 3,5,6,8,9,11...
  return Math.min(MAX_WORDS, words);
}

/* ------------------------------------------------------------
   2) TIMER PER ROUND  (edit these numbers freely)

   time = base + perWord * wordCount

   Right now every round of a difficulty gets the SAME time
   (perWord = 0):
     easy   -> 60s   (same as before)
     medium -> 75s   (a bit more)
     hard   -> 90s   (a bit more again)

   Want big tables (8-10 words) to get extra time? Set perWord,
   e.g. { base: 50, perWord: 4 } -> 3 words = 62s, 10 words = 90s.
------------------------------------------------------------ */

const TIME_RULES = {
  easy: { base: 60, perWord: 0 },
  medium: { base: 75, perWord: 0 },
  hard: { base: 90, perWord: 0 },
};

// Timer for a puzzle that really has `wordCount` words
function getTimeLimitForWords(difficulty, wordCount) {
  const rule = TIME_RULES[difficulty] || TIME_RULES.easy;
  return rule.base + rule.perWord * Math.max(1, Number(wordCount) || 1);
}

// Timer based on the round number (uses the target word count)
function getTimeLimitSec(difficulty, roundNumber) {
  return getTimeLimitForWords(difficulty, getTargetWordCount(roundNumber));
}

/* ------------------------------------------------------------
   3) RANDOM PUZZLE WITH THE TARGET WORD COUNT

   Wraps your existing generatePuzzle(letters, dictionary, maxWords).
   The dictionary is shuffled on every attempt so each round gets
   different random words. It keeps the attempt that is closest to
   the target count and stops early when it hits it exactly.
------------------------------------------------------------ */

function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generatePuzzleForRound(
  generatePuzzle,
  letters,
  dictionary,
  roundNumber,
  attempts = 12
) {
  const target = getTargetWordCount(roundNumber);
  let best = [];

  for (let i = 0; i < attempts; i++) {
    const slots = generatePuzzle(letters, shuffled(dictionary), target) || [];

    if (slots.length > best.length) best = slots;
    if (best.length >= target) break;
  }

  return best;
}

module.exports = {
  ROUNDS_PER_STEP,
  START_WORDS,
  MAX_WORDS,
  TIME_RULES,
  getTargetWordCount,
  getTimeLimitSec,
  getTimeLimitForWords,
  generatePuzzleForRound,
};