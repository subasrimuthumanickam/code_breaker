// // backend/src/utils/generatePuzzle.js
// //
// // Server-side port of your client-side wordConnectEngine.ts generator.
// // Given a letter pool + dictionary, finds every real word the pool can
// // spell and lays the best of them into ONE intersecting crossword grid
// // (Wordscapes / Word Cookies style). This runs ONCE per round on the
// // server — every client then renders the exact same grid and validates
// // drags against the exact same answer per row, instead of each client
// // picking its own words independently (which was causing HAIR/CAR to be
// // valid English but "wrong" for that slot).

// function letterCounts(letters) {
//   const counts = {};
//   letters.forEach((l) => {
//     const ch = l.toUpperCase();
//     counts[ch] = (counts[ch] || 0) + 1;
//   });
//   return counts;
// }

// function fitsPool(word, poolCounts) {
//   const wordCounts = {};
//   for (const ch of word.toUpperCase()) {
//     wordCounts[ch] = (wordCounts[ch] || 0) + 1;
//   }
//   return Object.entries(wordCounts).every(
//     ([ch, c]) => (poolCounts[ch] || 0) >= c
//   );
// }

// /**
//  * Every dictionary word that can be spelled from the given letter pool,
//  * longest first (so the "full" word that produced the tiles is tried
//  * first, same priority order as the client version had).
//  */
// function findCandidateWords(letters, dictionary, maxCandidates = 80) {
//   const poolCounts = letterCounts(letters);
//   const maxLen = letters.length;
//   const results = dictionary.filter(
//     (w) => w.length >= 2 && w.length <= maxLen && fitsPool(w, poolCounts)
//   );
//   results.sort((a, b) => b.length - a.length || a.localeCompare(b));

//   const seen = new Set();
//   const deduped = [];
//   for (const w of results) {
//     const key = w.toUpperCase();
//     if (seen.has(key)) continue;
//     seen.add(key);
//     deduped.push(w);
//   }
//   return deduped.slice(0, maxCandidates);
// }

// function isValidPlacement(word, row, col, direction, occupied) {
//   for (let k = 0; k < word.length; k++) {
//     const r = direction === "down" ? row + k : row;
//     const c = direction === "across" ? col + k : col;
//     const existing = occupied.get(`${r},${c}`);
//     if (existing && existing !== word[k].toUpperCase()) return false;
//   }
//   return true;
// }

// function tryPlaceWord(word, occupied) {
//   const upper = word.toUpperCase();
//   for (const [key, letter] of occupied.entries()) {
//     const [er, ec] = key.split(",").map(Number);
//     for (let k = 0; k < upper.length; k++) {
//       if (upper[k] !== letter) continue;
//       // try crossing through this shared letter, in both orientations
//       const candidates = [
//         { row: er, col: ec - k, direction: "across" },
//         { row: er - k, col: ec, direction: "down" },
//       ];
//       for (const cand of candidates) {
//         if (cand.row < 0 || cand.col < 0) continue;
//         if (isValidPlacement(word, cand.row, cand.col, cand.direction, occupied)) {
//           return cand;
//         }
//       }
//     }
//   }
//   return null;
// }

// /**
//  * Builds a crossword layout from a letter pool + dictionary.
//  *
//  * @param {string[]} letters
//  * @param {string[]} dictionary
//  * @param {number} targetWordCount
//  * @returns {{ word: string, row: number, col: number, direction: "across"|"down" }[]}
//  */
// function generatePuzzle(letters, dictionary, targetWordCount = 6) {
//   const candidates = findCandidateWords(letters, dictionary);
//   if (candidates.length === 0) return [];

//   const occupied = new Map();
//   const slots = [];
//   const chosen = new Set();

//   const seed = candidates[0];
//   for (let k = 0; k < seed.length; k++) {
//     occupied.set(`0,${k}`, seed[k].toUpperCase());
//   }
//   slots.push({ word: seed, row: 0, col: 0, direction: "across" });
//   chosen.add(seed.toUpperCase());

//   for (const cand of candidates) {
//     if (slots.length >= targetWordCount) break;
//     const upper = cand.toUpperCase();
//     if (chosen.has(upper)) continue;

//     const placement = tryPlaceWord(cand, occupied);
//     if (!placement) continue;

//     for (let k = 0; k < cand.length; k++) {
//       const r = placement.direction === "down" ? placement.row + k : placement.row;
//       const c = placement.direction === "across" ? placement.col + k : placement.col;
//       occupied.set(`${r},${c}`, cand[k].toUpperCase());
//     }
//     slots.push({
//       word: cand,
//       row: placement.row,
//       col: placement.col,
//       direction: placement.direction,
//     });
//     chosen.add(upper);
//   }

//   const minRow = Math.min(...slots.map((w) => w.row));
//   const minCol = Math.min(...slots.map((w) => w.col));
//   return slots.map((w) => ({ ...w, row: w.row - minRow, col: w.col - minCol }));
// }

// module.exports = { findCandidateWords, generatePuzzle };
// backend/src/utils/generatePuzzle.js
//
// Server-side port of your client-side wordConnectEngine.ts generator.
// Given a letter pool + dictionary, finds every real word the pool can
// spell and lays the best of them into ONE intersecting crossword grid
// (Wordscapes / Word Cookies style). This runs ONCE per round on the
// server — every client then renders the exact same grid and validates
// drags against the exact same answer per row, instead of each client
// picking its own words independently (which was causing HAIR/CAR to be
// valid English but "wrong" for that slot).

function letterCounts(letters) {
  const counts = {};
  letters.forEach((l) => {
    const ch = l.toUpperCase();
    counts[ch] = (counts[ch] || 0) + 1;
  });
  return counts;
}

function fitsPool(word, poolCounts) {
  const wordCounts = {};
  for (const ch of word.toUpperCase()) {
    wordCounts[ch] = (wordCounts[ch] || 0) + 1;
  }
  return Object.entries(wordCounts).every(
    ([ch, c]) => (poolCounts[ch] || 0) >= c
  );
}

/**
 * Every dictionary word that can be spelled from the given letter pool,
 * longest first (so the "full" word that produced the tiles is tried
 * first, same priority order as the client version had).
 */
function findCandidateWords(letters, dictionary, maxCandidates = 80) {
  const poolCounts = letterCounts(letters);
  const maxLen = letters.length;
  const results = dictionary.filter(
    (w) => w.length >= 2 && w.length <= maxLen && fitsPool(w, poolCounts)
  );
  results.sort((a, b) => b.length - a.length || a.localeCompare(b));

  const seen = new Set();
  const deduped = [];
  for (const w of results) {
    const key = w.toUpperCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(w);
  }
  return deduped.slice(0, maxCandidates);
}

function isValidPlacement(word, row, col, direction, occupied) {
  for (let k = 0; k < word.length; k++) {
    const r = direction === "down" ? row + k : row;
    const c = direction === "across" ? col + k : col;
    const existing = occupied.get(`${r},${c}`);
    if (existing && existing !== word[k].toUpperCase()) return false;
  }
  return true;
}

function tryPlaceWord(word, occupied) {
  const upper = word.toUpperCase();
  for (const [key, letter] of occupied.entries()) {
    const [er, ec] = key.split(",").map(Number);
    for (let k = 0; k < upper.length; k++) {
      if (upper[k] !== letter) continue;
      // try crossing through this shared letter, in both orientations
      const candidates = [
        { row: er, col: ec - k, direction: "across" },
        { row: er - k, col: ec, direction: "down" },
      ];
      for (const cand of candidates) {
        if (cand.row < 0 || cand.col < 0) continue;
        if (isValidPlacement(word, cand.row, cand.col, cand.direction, occupied)) {
          return cand;
        }
      }
    }
  }
  return null;
}

/**
 * Builds a crossword layout from a letter pool + dictionary.
 *
 * @param {string[]} letters
 * @param {string[]} dictionary
 * @param {number} targetWordCount
 * @returns {{ word: string, row: number, col: number, direction: "across"|"down" }[]}
 */
function generatePuzzle(letters, dictionary, targetWordCount = 6) {
  const candidates = findCandidateWords(letters, dictionary);
  if (candidates.length === 0) return [];

  const occupied = new Map();
  const slots = [];
  const chosen = new Set();

  const seed = candidates[0];
  for (let k = 0; k < seed.length; k++) {
    occupied.set(`0,${k}`, seed[k].toUpperCase());
  }
  slots.push({ word: seed, row: 0, col: 0, direction: "across" });
  chosen.add(seed.toUpperCase());

  for (const cand of candidates) {
    if (slots.length >= targetWordCount) break;
    const upper = cand.toUpperCase();
    if (chosen.has(upper)) continue;

    const placement = tryPlaceWord(cand, occupied);
    if (!placement) continue;

    for (let k = 0; k < cand.length; k++) {
      const r = placement.direction === "down" ? placement.row + k : placement.row;
      const c = placement.direction === "across" ? placement.col + k : placement.col;
      occupied.set(`${r},${c}`, cand[k].toUpperCase());
    }
    slots.push({
      word: cand,
      row: placement.row,
      col: placement.col,
      direction: placement.direction,
    });
    chosen.add(upper);
  }

  const minRow = Math.min(...slots.map((w) => w.row));
  const minCol = Math.min(...slots.map((w) => w.col));
  return slots.map((w) => ({ ...w, row: w.row - minRow, col: w.col - minCol }));
}

module.exports = { findCandidateWords, generatePuzzle };