// // backend/src/utils/words.js
// const WORD_LIST = [
//   "APPLE", "TIGER", "PLANET", "GUITAR", "CASTLE", "BRIDGE", "DRAGON",
//   "FOREST", "PENCIL", "ROCKET", "GARDEN", "WINTER", "PUZZLE", "CAMERA",
//   "SPIDER", "WINDOW", "ISLAND", "MARKET", "SILVER", "COFFEE",
// ];

// function shuffleString(str) {
//   const arr = str.split("");
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   const shuffled = arr.join("");
//   // avoid the rare case scramble == original word
//   return shuffled === str ? shuffleString(str) : shuffled;
// }

// function pickRandomWord(excludeWords = []) {
//   const pool = WORD_LIST.filter((w) => !excludeWords.includes(w));
//   const list = pool.length > 0 ? pool : WORD_LIST;
//   const word = list[Math.floor(Math.random() * list.length)];
//   return { word, scrambled: shuffleString(word) };
// }

// module.exports = { WORD_LIST, shuffleString, pickRandomWord };
// backend/src/utils/words.js
const db = require("../db");

function shuffleString(str) {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const shuffled = arr.join("");
  return shuffled === str ? shuffleString(str) : shuffled;
}

/**
 * Picks a random word + clue from the database for the given difficulty,
 * excluding words already used in this room (so rounds don't repeat).
 * @param {"easy"|"medium"|"hard"} difficulty
 * @param {string[]} excludeWords - words already used this room
 */
async function pickRandomWord(difficulty = "easy", excludeWords = []) {
  let rows;

  if (excludeWords.length > 0) {
    const placeholders = excludeWords.map(() => "?").join(",");
    [rows] = await db.query(
      `SELECT word, clue FROM word_scramble_words
       WHERE difficulty = ? AND word NOT IN (${placeholders})`,
      [difficulty, ...excludeWords]
    );
  } else {
    [rows] = await db.query(
      `SELECT word, clue FROM word_scramble_words WHERE difficulty = ?`,
      [difficulty]
    );
  }

  // If every word in this difficulty has been used, allow repeats rather than crash
  if (rows.length === 0) {
    [rows] = await db.query(
      `SELECT word, clue FROM word_scramble_words WHERE difficulty = ?`,
      [difficulty]
    );
  }

  const picked = rows[Math.floor(Math.random() * rows.length)];
  return {
    word: picked.word,
    clue: picked.clue,
    scrambled: shuffleString(picked.word),
  };
}

module.exports = { pickRandomWord, shuffleString };