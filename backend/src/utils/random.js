// // Generates a secret code as an array of unique digits (0-9), matching the
// // classic "each digit appears once" rule used by GameScreen's numpad UI.
// function generateSecretCode(length) {
//   const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//   for (let i = digits.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [digits[i], digits[j]] = [digits[j], digits[i]];
//   }
//   return digits.slice(0, length);
// }

// module.exports = { generateSecretCode };
// backend/src/utils/random.js

/**
 * Generates a secret code with UNIQUE digits (no repeats).
 * This cuts down possibilities a lot (e.g. 3-digit: 1000 → 720 combos)
 * and makes per-digit elimination logic actually work for the player —
 * repeated digits make "present" clues ambiguous and much harder to reason about.
 */
function generateSecretCode(length) {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Fisher-Yates shuffle
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }

  return digits.slice(0, length);
}

module.exports = { generateSecretCode };