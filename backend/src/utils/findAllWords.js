/**
 * NEW FILE — save as: backend/src/utils/findAllWords.js
 *
 * Assumes utils/words.js exports an array (or Set) of lowercase
 * dictionary words, e.g.:
 *   module.exports = ["cat", "care", "race", "acre", ...];
 * If your words.js exports something else, adjust the `require` line below.
 */

const DICTIONARY = require("./words");

const dictionaryList = Array.isArray(DICTIONARY)
  ? DICTIONARY
  : Array.from(DICTIONARY);

function letterCounts(letters) {
  const counts = {};
  letters.forEach((letter) => {
    const key = letter.toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function canBuildFromLetters(word, availableCounts) {
  const need = {};
  for (const char of word) {
    need[char] = (need[char] || 0) + 1;
  }
  return Object.keys(need).every(
    (char) => (availableCounts[char] || 0) >= need[char]
  );
}

/**
 * Returns every dictionary word (length >= minLength, and no longer than
 * the letter pool itself) that can be spelled using the given letters,
 * respecting how many of each letter is actually available (so "BOO"
 * needs two O's in the pool, not just one).
 *
 * @param {string[]} letters - e.g. ["C","R","E","A","M","Y","S"]
 * @param {number} minLength - shortest word to count, default 3
 * @returns {string[]} lowercase words
 */
function findAllWords(letters, minLength = 3) {
  const available = letterCounts(letters);
  const results = [];

  for (const rawWord of dictionaryList) {
    const word = rawWord.toLowerCase();

    if (word.length < minLength || word.length > letters.length) {
      continue;
    }

    if (canBuildFromLetters(word, available)) {
      results.push(word);
    }
  }

  return results;
}

module.exports = { findAllWords };