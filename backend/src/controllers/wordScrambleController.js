// // // // backend/src/controllers/wordScrambleController.js
// // // //
// // // // Stateless-per-round controller for Word Scramble. The frontend keeps
// // // // track of current round number / lives / timer locally (like your
// // // // Gameplayscreen already does), and calls getRoundWord() for each new
// // // // round, passing back the words already used so they don't repeat.
// // // //
// // // // If you already have a Wordscramblecontroller.js / Wordscrambleroutes.js,
// // // // send me that file and I'll merge this into it instead of duplicating.

// // // const { WORD_SCRAMBLE_DIFFICULTY_CONFIG, VALID_WORD_SCRAMBLE_DIFFICULTIES } = require("../config/wordScrambleDifficulty");
// // // const { pickRandomWord } = require("../utils/random");
// // // const { buildClue } = require("../utils/clue");

// // // // GET /api/wordscramble/config/:difficulty
// // // // Frontend calls this once when a difficulty is picked, to know
// // // // rounds/timeLimitSec/lives/freeReveals up front.
// // // async function getDifficultyConfig(req, res) {
// // //   const { difficulty } = req.params;

// // //   if (!VALID_WORD_SCRAMBLE_DIFFICULTIES.includes(difficulty)) {
// // //     return res.status(400).json({
// // //       error: `Invalid difficulty. Must be one of: ${VALID_WORD_SCRAMBLE_DIFFICULTIES.join(", ")}`,
// // //     });
// // //   }

// // //   const config = WORD_SCRAMBLE_DIFFICULTY_CONFIG[difficulty];
// // //   res.json({
// // //     difficulty,
// // //     label: config.label,
// // //     rounds: config.rounds,
// // //     timeLimitSec: config.timeLimitSec,
// // //     lives: config.lives,
// // //     freeReveals: config.freeReveals,
// // //   });
// // // }

// // // // GET /api/wordscramble/round/:difficulty?exclude=WORD1,WORD2
// // // // Returns the next word for a round: scrambled letters + a difficulty-
// // // // shaped clue. `exclude` is a comma-separated list of words already used
// // // // this game, so rounds don't repeat.
// // // async function getRoundWord(req, res) {
// // //   const { difficulty } = req.params;

// // //   if (!VALID_WORD_SCRAMBLE_DIFFICULTIES.includes(difficulty)) {
// // //     return res.status(400).json({
// // //       error: `Invalid difficulty. Must be one of: ${VALID_WORD_SCRAMBLE_DIFFICULTIES.join(", ")}`,
// // //     });
// // //   }

// // //   const config = WORD_SCRAMBLE_DIFFICULTY_CONFIG[difficulty];
// // //   const excludeWords = req.query.exclude
// // //     ? req.query.exclude.split(",").map((w) => w.trim().toUpperCase()).filter(Boolean)
// // //     : [];

// // //   const { word, clue, scrambled } = await pickRandomWord(difficulty, excludeWords);

// // //   res.json({
// // //     word,                                   // client needs this to validate the drag-drop answer
// // //     scrambled,
// // //     clue: buildClue(clue, config.clueType),
// // //     clueType: config.clueType,
// // //     timeLimitSec: config.timeLimitSec,
// // //     freeReveals: config.freeReveals,
// // //   });
// // // }

// // // module.exports = { getDifficultyConfig, getRoundWord };
// // /**
// //  * ADD to: backend/src/controllers/wordScrambleController.js
// //  *
// //  * ASSUMPTION (please adjust to match your actual setup): a Mongoose
// //  * model called Round that stores one active word-hunt puzzle per room.
// //  * If you're on Postgres/Sequelize or plain in-memory room state instead,
// //  * the logic (pick letters -> compute valid words -> check submissions)
// //  * stays the same, only the persistence calls change.
// //  *
// //  * Example Mongoose schema (new file: backend/src/models/Round.js):
// //  *
// //  *   const mongoose = require("mongoose");
// //  *
// //  *   const roundSchema = new mongoose.Schema({
// //  *     roomCode: { type: String, required: true, index: true },
// //  *     baseLetters: [String],
// //  *     validWords: [String],      // never sent to the client directly
// //  *     foundWords: [{
// //  *       id: String,
// //  *       word: String,
// //  *       foundBy: String,
// //  *     }],
// //  *     status: { type: String, enum: ["active", "complete"], default: "active" },
// //  *   }, { timestamps: true });
// //  *
// //  *   module.exports = mongoose.model("Round", roundSchema);
// //  */

// // const { findAllWords } = require("../utils/findAllWords");
// // const Round = require("../models/Round");

// // // weighted so common letters (vowels, R/S/T/N) show up more often, similar
// // // to a Scrabble/Boggle letter bag
// // const LETTER_POOL =
// //   "AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ";

// // function pickBaseLetters(count = 7) {
// //   const letters = [];
// //   for (let i = 0; i < count; i++) {
// //     letters.push(LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)]);
// //   }
// //   return letters;
// // }

// // /**
// //  * Keeps re-rolling the letter set until it yields a reasonable number of
// //  * valid words, so players don't land on a puzzle with only 2-3 answers.
// //  */
// // function generateSolvableLetterSet(count = 7, minWords = 6, maxAttempts = 30) {
// //   let bestLetters = pickBaseLetters(count);
// //   let bestWords = findAllWords(bestLetters, 3);

// //   for (let attempt = 0; attempt < maxAttempts; attempt++) {
// //     if (bestWords.length >= minWords) break;

// //     const letters = pickBaseLetters(count);
// //     const words = findAllWords(letters, 3);

// //     if (words.length > bestWords.length) {
// //       bestLetters = letters;
// //       bestWords = words;
// //     }
// //   }

// //   return { baseLetters: bestLetters, validWords: bestWords };
// // }

// // /**
// //  * GET /api/wordscramble/round/:roomCode
// //  * Returns the active word-hunt round for a room, creating one if needed.
// //  */
// // exports.getWordHuntRound = async (req, res) => {
// //   try {
// //     const { roomCode } = req.params;

// //     let round = await Round.findOne({ roomCode, status: "active" });

// //     if (!round) {
// //       const { baseLetters, validWords } = generateSolvableLetterSet(7, 6);

// //       round = await Round.create({
// //         roomCode,
// //         baseLetters,
// //         validWords,
// //         foundWords: [],
// //         status: "active",
// //       });
// //     }

// //     return res.status(200).json({
// //       id: round._id,
// //       baseLetters: round.baseLetters,
// //       totalWords: round.validWords.length,
// //       wordSlots: round.validWords.map((word, index) => ({
// //         id: `slot-${index}`,
// //         length: word.length,
// //       })),
// //       foundWords: round.foundWords,
// //     });
// //   } catch (error) {
// //     console.error("getWordHuntRound failed:", error);
// //     return res.status(500).json({ message: "Could not load round" });
// //   }
// // };

// // /**
// //  * POST /api/wordscramble/submit-word
// //  * body: { roundId, playerName, word }
// //  */
// // exports.submitWord = async (req, res) => {
// //   try {
// //     const { roundId, playerName, word } = req.body;
// //     const attempt = String(word || "").toLowerCase().trim();

// //     const round = await Round.findById(roundId);

// //     if (!round) {
// //       return res.status(404).json({ message: "Round not found" });
// //     }

// //     const slotIndex = round.validWords.indexOf(attempt);
// //     const isValidWord = slotIndex !== -1;
// //     const alreadyFound = round.foundWords.some((f) => f.word === attempt);

// //     if (!isValidWord || alreadyFound) {
// //       return res.status(200).json({
// //         isCorrect: false,
// //         wordsFound: round.foundWords.length,
// //         totalWords: round.validWords.length,
// //         foundWords: round.foundWords,
// //       });
// //     }

// //     round.foundWords.push({
// //       id: `slot-${slotIndex}`,
// //       word: attempt,
// //       foundBy: playerName,
// //     });

// //     // TODO: bump this player's score on your Player/Room model here,
// //     // e.g. await Player.updateOne({ roomCode: round.roomCode, playerName }, { $inc: { score: attempt.length } });

// //     const isRoundComplete = round.foundWords.length === round.validWords.length;

// //     if (isRoundComplete) {
// //       round.status = "complete";
// //     }

// //     await round.save();

// //     return res.status(200).json({
// //       isCorrect: true,
// //       wordsFound: round.foundWords.length,
// //       totalWords: round.validWords.length,
// //       foundWords: round.foundWords,
// //       isRoundComplete,
// //     });
// //   } catch (error) {
// //     console.error("submitWord failed:", error);
// //     return res.status(500).json({ message: "Could not submit word" });
// //   }
// // };
// const { findAllWords } = require("../utils/findAllWords");
// const { generatePuzzle } = require("../utils/generatePuzzle");
// const { buildClue } = require("../utils/clue");
// const Round = require("../models/Round");

// // weighted so common letters (vowels, R/S/T/N) show up more often, similar
// // to a Scrabble/Boggle letter bag
// const LETTER_POOL =
//   "AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ";

// function pickBaseLetters(count = 7) {
//   const letters = [];
//   for (let i = 0; i < count; i++) {
//     letters.push(LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)]);
//   }
//   return letters;
// }

// /**
//  * Re-rolls the letter pool until generatePuzzle can actually LAY OUT
//  * minWords intersecting words from it. findAllWords alone isn't enough —
//  * a word can exist in the dictionary but still fail to connect to the
//  * grid (no shared letter with anything already placed), so we have to
//  * check against generatePuzzle's actual output, not just the word count.
//  */
// function generateSolvableRound(letterCount = 7, minWords = 6, maxAttempts = 40) {
//   let best = { baseLetters: pickBaseLetters(letterCount), wordSlots: [] };

//   for (let attempt = 0; attempt < maxAttempts; attempt++) {
//     const baseLetters = pickBaseLetters(letterCount);
//     const dictionary = findAllWords(baseLetters, 3);
//     const wordSlots = generatePuzzle(baseLetters, dictionary, minWords);

//     if (wordSlots.length > best.wordSlots.length) {
//       best = { baseLetters, wordSlots };
//     }
//     if (best.wordSlots.length >= minWords) break;
//   }

//   return best;
// }

// /**
//  * GET /api/wordscramble/round/:roomCode
//  * Returns the active word-connect round for a room, creating one if needed.
//  * The grid layout (word/row/col/direction) is generated ONCE here and
//  * reused for every player in the room — this is the piece that was
//  * missing before, which is why HAIR/CAR could be valid English but still
//  * fail: each client was guessing its own answer for that row.
//  */
// exports.getWordHuntRound = async (req, res) => {
//   try {
//     const { roomCode } = req.params;
//     const clueType = req.query.clueType || "moderate"; // wire this to the room's difficulty setting

//     let round = await Round.findOne({ roomCode, status: "active" });

//     if (!round) {
//       const { baseLetters, wordSlots } = generateSolvableRound(7, 6);

//       round = await Round.create({
//         roomCode,
//         baseLetters,
//         validWords: wordSlots.map((s) => s.word.toLowerCase()), // for scoring/back-compat
//         wordSlots, // [{ word, row, col, direction }] — the canonical grid
//         foundWords: [],
//         status: "active",
//       });
//     }

//     return res.status(200).json({
//       id: round._id,
//       baseLetters: round.baseLetters,
//       totalWords: round.wordSlots.length,
//       words: round.wordSlots.map((slot) => ({
//         text: slot.word.toUpperCase(),
//         row: slot.row,
//         col: slot.col,
//         direction: slot.direction,
//         length: slot.word.length,
//         found: round.foundWords.some((f) => f.word === slot.word.toLowerCase()),
//         // TODO: swap in a real per-word clue once your clue data source is
//         // wired in here — this placeholder just proves the pipeline works.
//         clue: buildClue(`Related to "${slot.word}"`, clueType),
//       })),
//       foundWords: round.foundWords,
//     });
//   } catch (error) {
//     console.error("getWordHuntRound failed:", error);
//     return res.status(500).json({ message: "Could not load round" });
//   }
// };

// /**
//  * POST /api/wordscramble/submit-word
//  * body: { roundId, playerName, word }
//  */
// exports.submitWord = async (req, res) => {
//   try {
//     const { roundId, playerName, word } = req.body;
//     const attempt = String(word || "").toLowerCase().trim();

//     const round = await Round.findById(roundId);
//     if (!round) {
//       return res.status(404).json({ message: "Round not found" });
//     }

//     const slot = round.wordSlots.find((s) => s.word.toLowerCase() === attempt);
//     const alreadyFound = round.foundWords.some((f) => f.word === attempt);

//     if (!slot || alreadyFound) {
//       return res.status(200).json({
//         isCorrect: false,
//         wordsFound: round.foundWords.length,
//         totalWords: round.wordSlots.length,
//         foundWords: round.foundWords,
//       });
//     }

//     round.foundWords.push({
//       word: attempt,
//       row: slot.row,
//       col: slot.col,
//       direction: slot.direction,
//       foundBy: playerName,
//     });

//     // TODO: bump this player's score on your Player/Room model here,
//     // e.g. await Player.updateOne({ roomCode: round.roomCode, playerName }, { $inc: { score: attempt.length } });

//     const isRoundComplete = round.foundWords.length === round.wordSlots.length;
//     if (isRoundComplete) {
//       round.status = "complete";
//     }

//     await round.save();

//     return res.status(200).json({
//       isCorrect: true,
//       wordsFound: round.foundWords.length,
//       totalWords: round.wordSlots.length,
//       foundWords: round.foundWords,
//       isRoundComplete,
//     });
//   } catch (error) {
//     console.error("submitWord failed:", error);
//     return res.status(500).json({ message: "Could not submit word" });
//   }
// };
const { findAllWords } = require("../utils/findAllWords");
const { generatePuzzle } = require("../utils/generatePuzzle");
const { buildClue } = require("../utils/clue");
const Round = require("../models/Round");

// weighted so common letters (vowels, R/S/T/N) show up more often, similar
// to a Scrabble/Boggle letter bag
const LETTER_POOL =
  "AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ";

function pickBaseLetters(count = 7) {
  const letters = [];
  for (let i = 0; i < count; i++) {
    letters.push(LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)]);
  }
  return letters;
}

/**
 * Re-rolls the letter pool until generatePuzzle can actually LAY OUT
 * minWords intersecting words from it. findAllWords alone isn't enough —
 * a word can exist in the dictionary but still fail to connect to the
 * grid (no shared letter with anything already placed), so we have to
 * check against generatePuzzle's actual output, not just the word count.
 */
function generateSolvableRound(letterCount = 7, minWords = 6, maxAttempts = 40) {
  let best = { baseLetters: pickBaseLetters(letterCount), wordSlots: [] };

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const baseLetters = pickBaseLetters(letterCount);
    const dictionary = findAllWords(baseLetters, 3);
    const wordSlots = generatePuzzle(baseLetters, dictionary, minWords);

    if (wordSlots.length > best.wordSlots.length) {
      best = { baseLetters, wordSlots };
    }
    if (best.wordSlots.length >= minWords) break;
  }

  return best;
}

/**
 * GET /api/wordscramble/round/:roomCode
 * Returns the active word-connect round for a room, creating one if needed.
 * The grid layout (word/row/col/direction) is generated ONCE here and
 * reused for every player in the room — this is the piece that was
 * missing before, which is why HAIR/CAR could be valid English but still
 * fail: each client was guessing its own answer for that row.
 */
exports.getWordHuntRound = async (req, res) => {
  try {
    const { roomCode } = req.params;
    const clueType = req.query.clueType || "moderate"; // wire this to the room's difficulty setting

    let round = await Round.findOne({ roomCode, status: "active" });

    if (!round) {
      const { baseLetters, wordSlots } = generateSolvableRound(7, 6);

      round = await Round.create({
        roomCode,
        baseLetters,
        validWords: wordSlots.map((s) => s.word.toLowerCase()), // for scoring/back-compat
        wordSlots, // [{ word, row, col, direction }] — the canonical grid
        foundWords: [],
        status: "active",
      });
    }

    return res.status(200).json({
      id: round._id,
      // GamePlayScreen.tsx reads `round.letters` for the tile wheel pool —
      // must be this exact key, not `baseLetters`.
      letters: round.baseLetters,
      totalWords: round.wordSlots.length,
      // GamePlayScreen.tsx reads `round.words` as WSWordSlot[] = { word, row,
      // col, direction } — field must be `word`, not `text`, or the
      // `round.words && round.words.length > 0` branch will pick this up
      // but buildGrid()/the match check against `w.word` will break.
      words: round.wordSlots.map((slot) => ({
        word: slot.word.toUpperCase(),
        row: slot.row,
        col: slot.col,
        direction: slot.direction,
      })),
      // Per-word clue text, kept separate from `words` since WSWordSlot
      // doesn't carry a clue field. Whichever screen/hook builds the
      // `round` prop for GamePlayScreen should pick the clue for the
      // current target word from here and set it as `round.clue`.
      clues: round.wordSlots.map((slot) => ({
        word: slot.word.toUpperCase(),
        // TODO: swap in a real per-word clue once your clue data source is
        // wired in here — this placeholder just proves the pipeline works.
        text: buildClue(`Related to "${slot.word}"`, clueType),
      })),
      foundWords: round.foundWords,
    });
  } catch (error) {
    console.error("getWordHuntRound failed:", error);
    return res.status(500).json({ message: "Could not load round" });
  }
};

/**
 * POST /api/wordscramble/rounds/:roundId/answer
 * body: { playerName, answer, timeTakenSec }
 *
 * THIS is the endpoint GamePlayScreen.tsx actually calls via submitAnswer()
 * in Wordscrambleapi.ts — /submit-word above is currently dead code, unused
 * by this screen. Route this one up in your routes file (whichever file
 * currently has POST /rounds/:roundId/answer, or add it if it doesn't
 * exist yet).
 *
 * Client only calls this AFTER it already matched the dragged letters
 * against a word in round.wordSlots (server-generated), so by the time we
 * get here the word is authoritative-correct — this handler's job is
 * scoring + persisting foundWords, not re-validating the drag.
 */
exports.submitAnswer = async (req, res) => {
  try {
    const { roundId } = req.params;
    const { playerName, answer, timeTakenSec } = req.body;
    const attempt = String(answer || "").toLowerCase().trim();

    const round = await Round.findById(roundId);
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    const slot = round.wordSlots.find((s) => s.word.toLowerCase() === attempt);
    const alreadyFound = round.foundWords.some((f) => f.word === attempt);

    if (!slot || alreadyFound) {
      // shouldn't normally happen since the client pre-validates against
      // round.words, but stay safe against stale/replayed requests
      return res.status(200).json({
        isCorrect: false,
        points: 0,
        wordsFound: round.foundWords.length,
        totalWords: round.wordSlots.length,
        foundWords: round.foundWords,
      });
    }

    // base score by word length, with a small speed bonus for fast finds —
    // tune this to whatever your existing scoring formula was
    const speedBonus = Math.max(0, 10 - Math.floor((timeTakenSec || 0) / 3));
    const points = slot.word.length * 10 + speedBonus;

    round.foundWords.push({
      word: attempt,
      row: slot.row,
      col: slot.col,
      direction: slot.direction,
      foundBy: playerName,
    });

    const isRoundComplete = round.foundWords.length === round.wordSlots.length;
    if (isRoundComplete) round.status = "complete";

    await round.save();

    // TODO: livesLeft — GamePlayScreen reads result.livesLeft but this
    // handler only ever fires on a CORRECT word (client pre-filters wrong
    // guesses locally), so lives never actually decrement here. If lives
    // should drop on timeout instead, that belongs in whatever endpoint
    // handles onRoundEnd("", false, livesLeft) when the timer hits 0 —
    // share that file/logic if you want this wired end-to-end too.
    return res.status(200).json({
      isCorrect: true,
      points,
      wordsFound: round.foundWords.length,
      totalWords: round.wordSlots.length,
      foundWords: round.foundWords,
      isRoundComplete,
    });
  } catch (error) {
    console.error("submitAnswer failed:", error);
    return res.status(500).json({ message: "Could not submit answer" });
  }
};

/**
 * POST /api/wordscramble/submit-word
 * body: { roundId, playerName, word }
 *
 * NOTE: not currently called by GamePlayScreen.tsx (see submitAnswer
 * above). Keeping this in case another screen/mode still uses it — if
 * nothing calls POST /submit-word in your routes file, safe to delete.
 */
exports.submitWord = async (req, res) => {
  try {
    const { roundId, playerName, word } = req.body;
    const attempt = String(word || "").toLowerCase().trim();

    const round = await Round.findById(roundId);
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    const slot = round.wordSlots.find((s) => s.word.toLowerCase() === attempt);
    const alreadyFound = round.foundWords.some((f) => f.word === attempt);

    if (!slot || alreadyFound) {
      return res.status(200).json({
        isCorrect: false,
        wordsFound: round.foundWords.length,
        totalWords: round.wordSlots.length,
        foundWords: round.foundWords,
      });
    }

    round.foundWords.push({
      word: attempt,
      row: slot.row,
      col: slot.col,
      direction: slot.direction,
      foundBy: playerName,
    });

    // TODO: bump this player's score on your Player/Room model here,
    // e.g. await Player.updateOne({ roomCode: round.roomCode, playerName }, { $inc: { score: attempt.length } });

    const isRoundComplete = round.foundWords.length === round.wordSlots.length;
    if (isRoundComplete) {
      round.status = "complete";
    }

    await round.save();

    return res.status(200).json({
      isCorrect: true,
      wordsFound: round.foundWords.length,
      totalWords: round.wordSlots.length,
      foundWords: round.foundWords,
      isRoundComplete,
    });
  } catch (error) {
    console.error("submitWord failed:", error);
    return res.status(500).json({ message: "Could not submit word" });
  }
};