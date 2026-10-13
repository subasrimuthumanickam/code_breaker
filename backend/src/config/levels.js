// // // Backend is the single source of truth for level rules.
// // // The frontend reads slots / colors / allowRepeats / maxGuesses from the /start response.

// // const LEVELS = [
// //   { level: 1, slots: 3, colors: 4, allowRepeats: false, maxGuesses: 7 }, // matches constantkid Level 1
// //   { level: 2, slots: 3, colors: 5, allowRepeats: false, maxGuesses: 7 },
// //   { level: 3, slots: 4, colors: 5, allowRepeats: false, maxGuesses: 8 },
// //   { level: 4, slots: 4, colors: 6, allowRepeats: false, maxGuesses: 8 },
// //   { level: 5, slots: 4, colors: 6, allowRepeats: true, maxGuesses: 9 },
// //   { level: 6, slots: 5, colors: 7, allowRepeats: false, maxGuesses: 10 },
// // ];

// // // Your existing Difficulty screen still works: each difficulty starts at one of these levels.
// // const DIFFICULTY_TO_LEVEL = { easy: 1, medium: 3, hard: 4, extreme: 6 };

// // const getLevel = (n) => {
// //   const num = Math.min(Math.max(parseInt(n, 10) || 1, 1), LEVELS.length);
// //   return LEVELS[num - 1];
// // };

// // module.exports = { LEVELS, DIFFICULTY_TO_LEVEL, getLevel };
// // Backend is the single source of truth for level rules.
// // The frontend reads slots / colors / allowRepeats / maxGuesses from the /start response.
// //
// // ALL 10 levels use the same board: 3 slots, 4 pins (digits 1-4), no repeats
// // -> 4 x 3 x 2 = 24 possible codes on every level.
// // Only the number of guesses goes down as the levels go up.
// // Want it easier / harder? Just edit the numbers in GUESSES below.

// const BASE = { slots: 3, colors: 4, allowRepeats: false };

// const GUESSES = [7, 7, 7, 6, 6, 6, 5, 5, 5, 5]; // guesses allowed for level 1..10

// const LEVELS = GUESSES.map((maxGuesses, i) => ({
//   level: i + 1,
//   ...BASE,
//   maxGuesses,
// }));

// // Old difficulty names still work if some screen sends them.
// const DIFFICULTY_TO_LEVEL = { easy: 1, medium: 4, hard: 7, extreme: 10 };

// const getLevel = (n) => {
//   const num = Math.min(Math.max(parseInt(n, 10) || 1, 1), LEVELS.length);
//   return LEVELS[num - 1];
// };

// module.exports = { LEVELS, DIFFICULTY_TO_LEVEL, getLevel };
/**
 * Code Breaker - 50 levels
 *
 *  Levels  1-10 : 4 pins (colours), 3 places (slots)      -> 24 codes
 *  Levels 11-20 : 5 pins,           4 places              -> 120 codes
 *  Levels 21-30 : 6 pins,           5 places              -> 720 codes
 *  Levels 31-40 : 7 pins,           6 places              -> 5,040 codes
 *  Levels 41-50 : 8 pins,           7 places              -> 40,320 codes
 *
 * "pins"   = the colour buttons the player taps (colors)
 * "places" = the empty slots in the row the player fills (slots)
 * No repeats on any level.
 *
 * Guesses shrink inside each group of 10 levels (7,7,7,6,6,6,5,5,5,5)
 * and every tougher group gets +1 guess. Tweak GUESS_PATTERN / the
 * "+ tier" below if you want it easier or harder.
 */

const LEVELS_PER_TIER = 10;
const TOTAL_LEVELS = 50;

const TIERS = [
  { colors: 4, slots: 3 },
  { colors: 5, slots: 4 },
  { colors: 6, slots: 5 },
  { colors: 7, slots: 6 },
  { colors: 8, slots: 7 },
];

const GUESS_PATTERN = [7, 7, 7, 6, 6, 6, 5, 5, 5, 5];

const LEVELS = Array.from({ length: TOTAL_LEVELS }, (_, i) => {
  const tier = Math.floor(i / LEVELS_PER_TIER);
  const pos = i % LEVELS_PER_TIER;
  return {
    level: i + 1,
    slots: TIERS[tier].slots,
    colors: TIERS[tier].colors,
    allowRepeats: false,
    maxGuesses: GUESS_PATTERN[pos] + tier,
  };
});

// kept only so old imports do not break
const DIFFICULTY_TO_LEVEL = { easy: 1, medium: 11, hard: 31 };

const getLevel = (n) => {
  const num = Math.min(Math.max(parseInt(n, 10) || 1, 1), LEVELS.length);
  return LEVELS[num - 1];
};

module.exports = { LEVELS, DIFFICULTY_TO_LEVEL, getLevel };