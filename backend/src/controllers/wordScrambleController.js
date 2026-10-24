
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