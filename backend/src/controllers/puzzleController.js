// ASSUMPTION: ../db exports a mysql2/promise pool (db.query(sql, params) -> [rows]).
// If you use another DB, only the three db.query(...) calls below need changing.
const db = require("../db");
const dictionary = require("../data/wordlist.json"); // copy src/data/wordlist.json from the frontend into backend/src/data/
const { generatePuzzle } = require("../utils/crosswordGenerator");

const TIME_LIMIT_SEC = 120;

// Bigger wheel as rounds go up (5 -> 7 letters).
const letterCountForRound = (roundNumber) => Math.min(7, 5 + Math.floor((roundNumber - 1) / 2));

const parseJson = (v) => (typeof v === "string" ? JSON.parse(v) : v);

const toResponse = (row, totalRounds) => ({
  id: row.id,
  roundNumber: row.round_number,
  totalRounds,
  timeLimitSec: row.time_limit_sec,
  letters: row.letters.split(""),
  words: parseJson(row.words), // [{word,row,col,direction}] -> frontend draws the crossword grid from this
  bonusCount: parseJson(row.bonus_words).length,
});

/**
 * POST /api/wordscramble/round
 * body: { roomId, roundNumber, totalRounds }
 * First caller generates + saves the puzzle; everyone else in the room gets the saved one.
 */
exports.getOrCreateRound = async (req, res) => {
  try {
    const { roomId, roundNumber = 1, totalRounds = 5 } = req.body || {};
    if (!roomId) return res.status(400).json({ error: "roomId is required" });

    const find = async () => {
      const [rows] = await db.query("SELECT * FROM ws_rounds WHERE room_id = ? AND round_number = ?", [
        roomId,
        roundNumber,
      ]);
      return rows[0];
    };

    let row = await find();

    if (!row) {
      const puzzle = generatePuzzle(dictionary, {
        letterCount: letterCountForRound(roundNumber),
        minWords: 4,
        maxWords: 7,
      });

      // INSERT IGNORE + UNIQUE(room_id, round_number) => safe if two players ask at the same moment
      await db.query(
        `INSERT IGNORE INTO ws_rounds
           (room_id, round_number, root_word, letters, words, bonus_words, time_limit_sec)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          roomId,
          roundNumber,
          puzzle.rootWord,
          puzzle.letters.join(""),
          JSON.stringify(puzzle.words),
          JSON.stringify(puzzle.bonusWords),
          TIME_LIMIT_SEC,
        ]
      );
      row = await find();
    }

    return res.json(toResponse(row, totalRounds));
  } catch (err) {
    console.error("getOrCreateRound failed:", err);
    return res.status(500).json({ error: "Could not create round" });
  }
};