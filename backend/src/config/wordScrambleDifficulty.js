// backend/src/config/wordScrambleDifficulty.js
//
// This is a SEPARATE config from ./difficulty.js (which drives the
// Code Breaker digit-guessing game). Word Scramble has its own rounds/
// timing/lives/clue-strictness per difficulty.

const WORD_SCRAMBLE_DIFFICULTY_CONFIG = {
  easy: {
    label: "EASY",
    clueType: "direct",     // full clue text + free letter reveals allowed
    rounds: 10,
    timeLimitSec: 60,       // per round
    lives: 5,
    freeReveals: 1,         // letter reveals per round with no life/time penalty
  },
  medium: {
    label: "MEDIUM",
    clueType: "moderate",   // full clue text, but no free letter reveal
    rounds: 8,
    timeLimitSec: 40,
    lives: 3,
    freeReveals: 0,
  },
  hard: {
    label: "HARD",
    clueType: "vague",      // shortened / softened clue text only
    rounds: 7,
    timeLimitSec: 25,
    lives: 2,
    freeReveals: 0,
  },
};

const VALID_WORD_SCRAMBLE_DIFFICULTIES = Object.keys(WORD_SCRAMBLE_DIFFICULTY_CONFIG);

module.exports = { WORD_SCRAMBLE_DIFFICULTY_CONFIG, VALID_WORD_SCRAMBLE_DIFFICULTIES };