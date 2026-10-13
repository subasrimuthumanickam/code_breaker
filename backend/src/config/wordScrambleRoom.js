// // Minimum number of players required before a room can start a game.
// // Used by /rooms/:roomCode/start to reject early starts.
// const MIN_PLAYERS_TO_START = 2;

// module.exports = { MIN_PLAYERS_TO_START };
const express = require("express");
const router = express.Router();
const db = require("../db");
const { pickRandomWord } = require("../utils/words");
const { WORD_SCRAMBLE_DIFFICULTY_CONFIG, VALID_WORD_SCRAMBLE_DIFFICULTIES } = require("../config/wordScrambleDifficulty");
const { buildClue } = require("../utils/clue");
const { MIN_PLAYERS_TO_START } = require("../config/wordScrambleRoom");
const { generatePuzzle } = require("../utils/generatePuzzle");

// How many letters a single player may reveal with the hint bulb in one
// round, and how many points each reveal costs them. Tune freely.
const HINTS_PER_PLAYER_PER_ROUND = 3;
const HINT_SCORE_PENALTY = 5;

// Same dictionary your frontend uses to find sub-words that fit inside the
// round's letter pool (data/wordlist.json). Copy that file into
// backend/src/data/wordlist.json — without it, rounds fall back to a
// single-word puzzle (today's behaviour) instead of a crossword.
let DICTIONARY = [];
try {
  DICTIONARY = require("../data/wordlist.json");
} catch (e) {
  console.warn(
    "[wordscramble] backend/src/data/wordlist.json not found — rounds will fall back to a single word instead of a crossword layout. Copy the frontend's data/wordlist.json into backend/src/data/ to enable multi-word rounds."
  );
}

/**
 * Given the base word picked from the word bank (with its clue already
 * attached), builds the full crossword layout server-side — this result is
 * what gets stored + sent to every client, so nobody generates their own
 * puzzle anymore.
 */
function buildRoundWords(baseWord) {
  const letters = baseWord.toUpperCase().split("");
  if (DICTIONARY.length === 0) {
    return {
      letters,
      words: [{ word: baseWord.toUpperCase(), row: 0, col: 0, direction: "across" }],
    };
  }
  const slots = generatePuzzle(letters, DICTIONARY, 6);
  return {
    letters,
    words: slots.length > 0 ? slots : [{ word: baseWord.toUpperCase(), row: 0, col: 0, direction: "across" }],
  };
}

// Every {row, col, letter} cell a word slot occupies in the grid — same
// math GamePlayScreen.tsx's buildGrid()/cellsForWord() use client-side, so
// the row/col pairs line up exactly with what the client renders.
function wordCells(slot) {
  const cells = [];
  for (let k = 0; k < slot.word.length; k++) {
    const row = slot.direction === "across" ? slot.row : slot.row + k;
    const col = slot.direction === "across" ? slot.col + k : slot.col;
    cells.push({ row, col, letter: slot.word[k].toUpperCase() });
  }
  return cells;
}

// Picks `count` random cells across the whole puzzle to reveal for free
// the moment the round starts — this is computed ONCE here (not on each
// client) so every player in the room sees the identical freebie letters,
// the same way the word layout itself is shared.
function pickInitialReveals(words, count) {
  if (!count || count <= 0) return [];
  const allCells = [];
  words.forEach((w) => wordCells(w).forEach((cell) => allCells.push(cell)));
  const shuffled = [...allCells].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, allCells.length)).map(({ row, col }) => ({ row, col }));
}

function getConfigForDifficulty(difficulty) {
  return WORD_SCRAMBLE_DIFFICULTY_CONFIG[difficulty] || WORD_SCRAMBLE_DIFFICULTY_CONFIG.easy;
}

// Same query everywhere a room's player list is sent to the frontend:
// includes host flag + avatar colour (from the player's profile)
const PLAYERS_SQL = `
  SELECT p.id, p.player_name, p.is_ready, p.is_host, pr.avatar_color, p.score
  FROM word_scramble_players p
  LEFT JOIN word_scramble_profiles pr ON pr.name = p.player_name
  WHERE p.room_id = ?
  ORDER BY p.id ASC`;

// Random 4-digit room code
function generateRoomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// Keeps generating until it finds a code not already in use.
async function generateUniqueRoomCode() {
  let attempts = 0;
  while (attempts < 10) {
    const code = generateRoomCode();
    const [existing] = await db.query(
      `SELECT id FROM word_scramble_rooms WHERE room_code = ?`,
      [code]
    );
    if (existing.length === 0) {
      return code;
    }
    attempts++;
  }
  throw new Error("Could not generate a unique room code, please try again");
}

// ---------------------------------------------
// 1) CREATE ROOM
// ---------------------------------------------
router.post("/rooms", async (req, res) => {
  try {
    const { roomName, roomType, maxPlayers, playerName, difficulty } = req.body;

    if (!playerName) {
      return res.status(400).json({ error: "playerName is required" });
    }

    const validDifficulty = VALID_WORD_SCRAMBLE_DIFFICULTIES.includes(difficulty) ? difficulty : "easy";
    const config = getConfigForDifficulty(validDifficulty);
    const roomCode = await generateUniqueRoomCode();

    const [roomResult] = await db.query(
      `INSERT INTO word_scramble_rooms (room_code, room_name, room_type, max_players, difficulty, status)
       VALUES (?, ?, ?, ?, ?, 'waiting')`,
      [roomCode, roomName || "FunRoom", roomType || "public", maxPlayers || 4, validDifficulty]
    );

    const roomId = roomResult.insertId;

    // The creator is the host
    await db.query(
      `INSERT INTO word_scramble_players (room_id, player_name, is_ready, is_host)
       VALUES (?, ?, TRUE, TRUE)`,
      [roomId, playerName]
    );

    const [players] = await db.query(PLAYERS_SQL, [roomId]);

    return res.status(201).json({
      success: true,
      room: {
        id: roomId,
        roomCode,
        roomName: roomName || "FunRoom",
        roomType: roomType || "public",
        maxPlayers: maxPlayers || 4,
        minPlayers: MIN_PLAYERS_TO_START,
        difficulty: validDifficulty,
        status: "waiting",
        totalRounds: config.rounds,
        timeLimitSec: config.timeLimitSec,
        lives: config.lives,
        players,
      },
    });
  } catch (err) {
    console.error("Create room error:", err);
    return res.status(500).json({ error: "Failed to create room" });
  }
});

// ---------------------------------------------
// 2) JOIN ROOM
// ---------------------------------------------
router.post("/rooms/:roomCode/join", async (req, res) => {
  try {
    const { roomCode } = req.params;
    const { playerName } = req.body;

    if (!playerName) {
      return res.status(400).json({ error: "playerName is required" });
    }

    const [rooms] = await db.query(
      `SELECT * FROM word_scramble_rooms WHERE room_code = ?`,
      [roomCode]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    const room = rooms[0];
    const config = getConfigForDifficulty(room.difficulty);

    const [existingPlayers] = await db.query(
      `SELECT * FROM word_scramble_players WHERE room_id = ?`,
      [room.id]
    );

    // Already in this room (page reload / rejoin) → don't add a duplicate row
    const alreadyIn = existingPlayers.some((p) => p.player_name === playerName);

    if (!alreadyIn) {
      if (existingPlayers.length >= room.max_players) {
        return res.status(409).json({ error: "Room is full" });
      }

      await db.query(
        `INSERT INTO word_scramble_players (room_id, player_name, is_ready, is_host)
         VALUES (?, ?, FALSE, FALSE)`,
        [room.id, playerName]
      );
    }

    const [players] = await db.query(PLAYERS_SQL, [room.id]);

    return res.status(200).json({
      success: true,
      room: {
        id: room.id,
        roomCode: room.room_code,
        roomName: room.room_name,
        roomType: room.room_type,
        maxPlayers: room.max_players,
        minPlayers: MIN_PLAYERS_TO_START,
        difficulty: room.difficulty,
        status: room.status,
        totalRounds: config.rounds,
        timeLimitSec: config.timeLimitSec,
        lives: config.lives,
        players,
      },
    });
  } catch (err) {
    console.error("Join room error:", err);
    return res.status(500).json({ error: "Failed to join room" });
  }
});

// ---------------------------------------------
// 3) GET ROOM (Room Waiting screen polls this)
// ---------------------------------------------
router.get("/rooms/:roomCode", async (req, res) => {
  try {
    const { roomCode } = req.params;

    const [rooms] = await db.query(
      `SELECT * FROM word_scramble_rooms WHERE room_code = ?`,
      [roomCode]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    const room = rooms[0];
    const config = getConfigForDifficulty(room.difficulty);

    const [players] = await db.query(PLAYERS_SQL, [room.id]);

    return res.status(200).json({
      success: true,
      room: {
        id: room.id,
        roomCode: room.room_code,
        roomName: room.room_name,
        roomType: room.room_type,
        maxPlayers: room.max_players,
        minPlayers: MIN_PLAYERS_TO_START,
        difficulty: room.difficulty,
        status: room.status,
        totalRounds: config.rounds,
        timeLimitSec: config.timeLimitSec,
        lives: config.lives,
        players,
      },
    });
  } catch (err) {
    console.error("Get room error:", err);
    return res.status(500).json({ error: "Failed to fetch room" });
  }
});

// ---------------------------------------------
// 4) LEADERBOARD (Top Players on Home screen)
// ---------------------------------------------
router.get("/leaderboard", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT player_name, SUM(score) AS total_score
       FROM word_scramble_players
       GROUP BY player_name
       ORDER BY total_score DESC
       LIMIT 10`
    );

    return res.status(200).json({
      success: true,
      players: rows.map((r, i) => ({
        rank: i + 1,
        name: r.player_name,
        score: r.total_score,
      })),
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// ---------------------------------------------
// 5) START GAME (creates round 1)
// ---------------------------------------------
router.post("/rooms/:roomCode/start", async (req, res) => {
  try {
    const { roomCode } = req.params;

    const [rooms] = await db.query(
      `SELECT * FROM word_scramble_rooms WHERE room_code = ?`,
      [roomCode]
    );
    if (rooms.length === 0) return res.status(404).json({ error: "Room not found" });
    const room = rooms[0];
    const config = getConfigForDifficulty(room.difficulty);

    // Enough players?
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS c FROM word_scramble_players WHERE room_id = ?`,
      [room.id]
    );
    if (countRows[0].c < MIN_PLAYERS_TO_START) {
      return res.status(409).json({ error: `Need at least ${MIN_PLAYERS_TO_START} players to start` });
    }

    await db.query(`UPDATE word_scramble_rooms SET status = 'in_progress' WHERE id = ?`, [room.id]);

    const { word, clue, scrambled } = await pickRandomWord(room.difficulty);
    // Build the full multi-word crossword layout ONCE here — this is what
    // every client in the room will render, instead of each client
    // generating its own with generatePuzzle() locally.
    const { letters, words } = buildRoundWords(word);
    // Same idea for the free starter reveals: pick them once here so every
    // player in the room opens the puzzle with the identical letters
    // already showing (see wordCells/pickInitialReveals above).
    const revealedCells = pickInitialReveals(words, config.freeReveals);

    const [roundResult] = await db.query(
      `INSERT INTO word_scramble_rounds (room_id, round_number, word, clue, scrambled, time_limit_sec, letters_json, words_json, revealed_json)
       VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?)`,
      [room.id, word, clue, scrambled, config.timeLimitSec, JSON.stringify(letters), JSON.stringify(words), JSON.stringify(revealedCells)]
    );

    return res.status(201).json({
      success: true,
      round: {
        id: roundResult.insertId,
        roundNumber: 1,
        totalRounds: config.rounds,
        scrambled,
        letters,
        words,
        totalWords: words.length,
        clue: buildClue(clue, config.clueType),
        clueType: config.clueType,
        timeLimitSec: config.timeLimitSec,
        lives: config.lives,
        freeReveals: config.freeReveals,
        // GamePlayScreen.tsx reads this as round.revealedCells to seed its
        // revealedCells map before the player's made any hint calls.
        revealedCells,
      },
    });
  } catch (err) {
    console.error("Start game error:", err);
    return res.status(500).json({ error: "Failed to start game" });
  }
});

// ---------------------------------------------
// 6) ROUND RESULTS
// ---------------------------------------------
router.get("/rounds/:roundId/results", async (req, res) => {
  try {
    const { roundId } = req.params;

    const [rounds] = await db.query(`SELECT * FROM word_scramble_rounds WHERE id = ?`, [roundId]);
    if (rounds.length === 0) return res.status(404).json({ error: "Round not found" });
    const round = rounds[0];

    const [roomRows] = await db.query(`SELECT difficulty FROM word_scramble_rooms WHERE id = ?`, [round.room_id]);
    const config = getConfigForDifficulty(roomRows[0]?.difficulty);

    const [answers] = await db.query(
      `SELECT player_name, answer, is_correct, time_taken_sec, points
       FROM word_scramble_answers WHERE round_id = ? ORDER BY points DESC`,
      [roundId]
    );

    const [players] = await db.query(
      `SELECT player_name, score FROM word_scramble_players WHERE room_id = ? ORDER BY score DESC`,
      [round.room_id]
    );

    return res.status(200).json({
      success: true,
      word: round.word,
      roundNumber: round.round_number,
      totalRounds: config.rounds,
      answers,
      standings: players,
    });
  } catch (err) {
    console.error("Round results error:", err);
    return res.status(500).json({ error: "Failed to fetch round results" });
  }
});

// ---------------------------------------------
// 7) NEXT ROUND
// ---------------------------------------------
router.post("/rooms/:roomCode/next-round", async (req, res) => {
  try {
    const { roomCode } = req.params;

    const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
    if (rooms.length === 0) return res.status(404).json({ error: "Room not found" });
    const room = rooms[0];
    const config = getConfigForDifficulty(room.difficulty);

    const [lastRoundRows] = await db.query(
      `SELECT * FROM word_scramble_rounds WHERE room_id = ? ORDER BY round_number DESC LIMIT 1`,
      [room.id]
    );
    const lastRoundNumber = lastRoundRows.length > 0 ? lastRoundRows[0].round_number : 0;
    const nextRoundNumber = lastRoundNumber + 1;

    if (nextRoundNumber > config.rounds) {
      await db.query(`UPDATE word_scramble_rooms SET status = 'finished' WHERE id = ?`, [room.id]);
      return res.status(200).json({ success: true, finished: true });
    }

    const [previousWords] = await db.query(
      `SELECT word FROM word_scramble_rounds WHERE room_id = ?`,
      [room.id]
    );
    const { word, clue, scrambled } = await pickRandomWord(room.difficulty, previousWords.map((r) => r.word));
    const { letters, words } = buildRoundWords(word);
    const revealedCells = pickInitialReveals(words, config.freeReveals);

    const [roundResult] = await db.query(
      `INSERT INTO word_scramble_rounds (room_id, round_number, word, clue, scrambled, time_limit_sec, letters_json, words_json, revealed_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [room.id, nextRoundNumber, word, clue, scrambled, config.timeLimitSec, JSON.stringify(letters), JSON.stringify(words), JSON.stringify(revealedCells)]
    );

    return res.status(201).json({
      success: true,
      finished: false,
      round: {
        id: roundResult.insertId,
        roundNumber: nextRoundNumber,
        totalRounds: config.rounds,
        scrambled,
        letters,
        words,
        totalWords: words.length,
        clue: buildClue(clue, config.clueType),
        clueType: config.clueType,
        timeLimitSec: config.timeLimitSec,
        lives: config.lives,
        freeReveals: config.freeReveals,
        revealedCells,
      },
    });
  } catch (err) {
    console.error("Next round error:", err);
    return res.status(500).json({ error: "Failed to advance round" });
  }
});

// ---------------------------------------------
// 8) FINAL STANDINGS (Game Over screen)
// ---------------------------------------------
router.get("/rooms/:roomCode/final", async (req, res) => {
  try {
    const { roomCode } = req.params;

    const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
    if (rooms.length === 0) return res.status(404).json({ error: "Room not found" });
    const room = rooms[0];
    const config = getConfigForDifficulty(room.difficulty);

    const [players] = await db.query(
      `SELECT player_name, score FROM word_scramble_players WHERE room_id = ? ORDER BY score DESC`,
      [room.id]
    );

    const [fastest] = await db.query(
      `SELECT a.player_name, MIN(a.time_taken_sec) AS best_time
       FROM word_scramble_answers a
       JOIN word_scramble_rounds r ON a.round_id = r.id
       WHERE r.room_id = ? AND a.is_correct = TRUE
       ORDER BY best_time ASC LIMIT 1`,
      [room.id]
    );

    return res.status(200).json({
      success: true,
      standings: players,
      fastestAnswer: fastest[0] || null,
      totalRounds: config.rounds,
    });
  } catch (err) {
    console.error("Final standings error:", err);
    return res.status(500).json({ error: "Failed to fetch final standings" });
  }
});

// ---------------------------------------------
// 9) CHAT — send + fetch messages
// ---------------------------------------------
router.post("/rooms/:roomCode/messages", async (req, res) => {
  try {
    const { roomCode } = req.params;
    const { playerName, message } = req.body;

    const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
    if (rooms.length === 0) return res.status(404).json({ error: "Room not found" });

    await db.query(
      `INSERT INTO word_scramble_messages (room_id, player_name, message) VALUES (?, ?, ?)`,
      [rooms[0].id, playerName, message]
    );

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("Send message error:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
});

router.get("/rooms/:roomCode/messages", async (req, res) => {
  try {
    const { roomCode } = req.params;

    const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
    if (rooms.length === 0) return res.status(404).json({ error: "Room not found" });

    const [messages] = await db.query(
      `SELECT player_name, message, sent_at FROM word_scramble_messages
       WHERE room_id = ? ORDER BY sent_at ASC LIMIT 100`,
      [rooms[0].id]
    );

    return res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error("Fetch messages error:", err);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ---------------------------------------------
// 10) GAME CONFIG — GET /config/easy | medium | hard
// ---------------------------------------------
router.get("/config/:difficulty", (req, res) => {
  const { difficulty } = req.params;

  if (!VALID_WORD_SCRAMBLE_DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({
      error: `Invalid difficulty. Must be one of: ${VALID_WORD_SCRAMBLE_DIFFICULTIES.join(", ")}`,
    });
  }

  const config = getConfigForDifficulty(difficulty);
  return res.status(200).json({
    success: true,
    difficulty,
    label: config.label,
    totalRounds: config.rounds,
    timeLimitSec: config.timeLimitSec,
    lives: config.lives,
    freeReveals: config.freeReveals,
  });
});

// ---------------------------------------------
// WORD BANK — list / add / delete words
// ---------------------------------------------
router.get("/words", async (req, res) => {
  try {
    const { difficulty } = req.query;

    let sql = "SELECT id, word, clue, difficulty, created_at FROM word_scramble_words";
    const params = [];

    if (difficulty) {
      if (!VALID_WORD_SCRAMBLE_DIFFICULTIES.includes(difficulty)) {
        return res.status(400).json({
          error: `Invalid difficulty. Must be one of: ${VALID_WORD_SCRAMBLE_DIFFICULTIES.join(", ")}`,
        });
      }
      sql += " WHERE difficulty = ?";
      params.push(difficulty);
    }

    sql += " ORDER BY created_at DESC";

    const [words] = await db.query(sql, params);

    return res.status(200).json({ success: true, words });
  } catch (err) {
    console.error("Fetch words error:", err);
    return res.status(500).json({ error: "Failed to fetch words" });
  }
});

router.post("/words", async (req, res) => {
  try {
    const { word, clue, difficulty } = req.body;

    if (!word || !clue) {
      return res.status(400).json({ error: "word and clue are required" });
    }

    const validDifficulty = VALID_WORD_SCRAMBLE_DIFFICULTIES.includes(difficulty)
      ? difficulty
      : "easy";

    const [result] = await db.query(
      `INSERT INTO word_scramble_words (word, clue, difficulty) VALUES (?, ?, ?)`,
      [word.trim().toUpperCase(), clue.trim(), validDifficulty]
    );

    return res.status(201).json({
      success: true,
      wordEntry: {
        id: result.insertId,
        word: word.trim().toUpperCase(),
        clue: clue.trim(),
        difficulty: validDifficulty,
      },
    });
  } catch (err) {
    console.error("Add word error:", err);
    return res.status(500).json({ error: "Failed to add word" });
  }
});

router.delete("/words/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(`DELETE FROM word_scramble_words WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Word not found" });
    }

    return res.status(200).json({ success: true, deletedId: Number(id) });
  } catch (err) {
    console.error("Delete word error:", err);
    return res.status(500).json({ error: "Failed to delete word" });
  }
});

// ---------------------------------------------
// 11) SUBMIT ANSWER — now checks against the round's full word LIST
//   (words_json), not just the single `word` column. A round can have
//   several correct answers; each one found earns points once.
// ---------------------------------------------
router.post("/rounds/:roundId/answer", async (req, res) => {
  try {
    const { roundId } = req.params;
    const { playerName, answer, timeTakenSec } = req.body;

    if (!playerName) {
      return res.status(400).json({ error: "playerName is required" });
    }
    if (answer === undefined || answer === null) {
      return res.status(400).json({ error: "answer is required" });
    }

    // 1. Get current round
    const [rounds] = await db.query(
      `SELECT * FROM word_scramble_rounds WHERE id = ? LIMIT 1`,
      [roundId]
    );
    if (rounds.length === 0) {
      return res.status(404).json({ error: "Round not found" });
    }
    const round = rounds[0];

    // 2. Load this round's word list (falls back to the single legacy
    // `word` column for rounds created before this migration)
    let words = [];
    try {
      words = JSON.parse(round.words_json || "[]");
    } catch (e) {
      words = [];
    }
    if (words.length === 0 && round.word) {
      words = [{ word: round.word, row: 0, col: 0, direction: "across" }];
    }

    const userAnswer = String(answer).trim().toUpperCase();
    const matchedSlot = words.find((w) => String(w.word).toUpperCase() === userAnswer);
    const isCorrect = !!matchedSlot;

    const [existingFind] = await db.query(
      `SELECT id FROM word_scramble_found_words WHERE round_id = ? AND word = ? LIMIT 1`,
      [roundId, userAnswer]
    );
    const alreadyFound = existingFind.length > 0;

    // 3. Points (faster + correct = more) — only awarded the first time
    // this particular word is found in the round
    const seconds = Number(timeTakenSec) || 0;
    const points = isCorrect && !alreadyFound ? Math.max(20, 100 - Math.round(seconds * 5)) : 0;

    // 4. Save answer (kept for round-results history + lives calc below)
    await db.query(
      `INSERT INTO word_scramble_answers
        (round_id, player_name, answer, is_correct, time_taken_sec, points)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [roundId, playerName, answer, isCorrect, seconds, points]
    );

    if (isCorrect && !alreadyFound) {
      await db.query(
        `INSERT INTO word_scramble_found_words (round_id, word, found_by) VALUES (?, ?, ?)`,
        [roundId, userAnswer, playerName]
      );

      if (points > 0) {
        await db.query(
          `UPDATE word_scramble_players SET score = score + ? WHERE room_id = ? AND player_name = ?`,
          [points, round.room_id, playerName]
        );
      }
    }

    // 5. Lives come from the room's difficulty config (not hardcoded)
    const [roomRows] = await db.query(
      `SELECT difficulty FROM word_scramble_rooms WHERE id = ? LIMIT 1`,
      [round.room_id]
    );
    if (roomRows.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }
    const config = getConfigForDifficulty(roomRows[0].difficulty);

    const [wrongRows] = await db.query(
      `SELECT COUNT(*) AS wrong_count
       FROM word_scramble_answers a
       INNER JOIN word_scramble_rounds r ON a.round_id = r.id
       WHERE r.room_id = ? AND a.player_name = ? AND a.is_correct = FALSE`,
      [round.room_id, playerName]
    );
    const wrongCount = Number(wrongRows[0]?.wrong_count) || 0;
    const livesLeft = Math.max(0, config.lives - wrongCount);

    // 6. Round-wide progress (used by GamePlayScreen's grid / progress bar)
    const [foundRows] = await db.query(
      `SELECT word, found_by AS foundBy FROM word_scramble_found_words WHERE round_id = ?`,
      [roundId]
    );
    const isRoundComplete = foundRows.length >= words.length;

    return res.status(200).json({
      success: true,
      isCorrect,
      points,
      livesLeft,
      wordsFound: foundRows.length,
      totalWords: words.length,
      foundWords: foundRows,
      isRoundComplete,
    });
  } catch (err) {
    console.error("Submit answer error:", err);
    return res.status(500).json({
      error: "Failed to submit answer",
      details: err.message,
    });
  }
});

// ---------------------------------------------
// 11b) HINT — reveal one more letter in the shared grid.
//   POST /api/wordscramble/rounds/:roundId/hint
//   body: { playerName }
//
//   Persists the reveal (word_scramble_hints) so it survives refresh and
//   is visible to every player in the room, enforces a per-player cap of
//   HINTS_PER_PLAYER_PER_ROUND, and deducts HINT_SCORE_PENALTY from that
//   player's score server-side — GamePlayScreen.tsx's revealRandomLetter()
//   calls this via useHint() in Wordscrambleapi.ts.
// ---------------------------------------------
router.post("/rounds/:roundId/hint", async (req, res) => {
  try {
    const { roundId } = req.params;
    const { playerName } = req.body;

    if (!playerName) {
      return res.status(400).json({ error: "playerName is required" });
    }

    const [roundRows] = await db.query(
      `SELECT * FROM word_scramble_rounds WHERE id = ? LIMIT 1`,
      [roundId]
    );
    if (roundRows.length === 0) {
      return res.status(404).json({ error: "Round not found" });
    }
    const round = roundRows[0];

    let words = [];
    try {
      words = JSON.parse(round.words_json || "[]");
    } catch (e) {
      words = [];
    }
    if (words.length === 0 && round.word) {
      words = [{ word: round.word, row: 0, col: 0, direction: "across" }];
    }

    // How many hints has THIS player already burned this round?
    const [usedRows] = await db.query(
      `SELECT COUNT(*) AS c FROM word_scramble_hints WHERE round_id = ? AND player_name = ?`,
      [roundId, playerName]
    );
    const hintsUsed = Number(usedRows[0]?.c) || 0;

    if (hintsUsed >= HINTS_PER_PLAYER_PER_ROUND) {
      return res.status(409).json({ error: "No hints left this round", hintsLeft: 0 });
    }

    // Cells that are already visible for everyone: the free starter
    // reveals from round creation, any hint any player has used so far,
    // and every cell belonging to a word that's already been fully found.
    let initialReveals = [];
    try {
      initialReveals = JSON.parse(round.revealed_json || "[]");
    } catch (e) {
      initialReveals = [];
    }

    const [hintRows] = await db.query(
      "SELECT `row`, `col` FROM word_scramble_hints WHERE round_id = ?",
      [roundId]
    );
    const [foundRows] = await db.query(
      `SELECT word FROM word_scramble_found_words WHERE round_id = ?`,
      [roundId]
    );
    const foundWordsUpper = new Set(foundRows.map((r) => String(r.word).toUpperCase()));

    const revealedKeys = new Set([
      ...initialReveals.map((c) => `${c.row}-${c.col}`),
      ...hintRows.map((c) => `${c.row}-${c.col}`),
    ]);

    const candidates = [];
    words.forEach((w) => {
      if (foundWordsUpper.has(String(w.word).toUpperCase())) return;
      wordCells(w).forEach((cell) => {
        const key = `${cell.row}-${cell.col}`;
        if (!revealedKeys.has(key)) candidates.push(cell);
      });
    });

    if (candidates.length === 0) {
      // Nothing left to reveal (player's basically solved it already)
      return res.status(200).json({
        success: true,
        exhausted: true,
        hintsLeft: HINTS_PER_PLAYER_PER_ROUND - hintsUsed,
      });
    }

    const pick = candidates[Math.floor(Math.random() * candidates.length)];

    await db.query(
      "INSERT INTO word_scramble_hints (round_id, player_name, `row`, `col`, letter) VALUES (?, ?, ?, ?, ?)",
      [roundId, playerName, pick.row, pick.col, pick.letter]
    );

    await db.query(
      `UPDATE word_scramble_players SET score = GREATEST(0, score - ?) WHERE room_id = ? AND player_name = ?`,
      [HINT_SCORE_PENALTY, round.room_id, playerName]
    );

    return res.status(200).json({
      success: true,
      revealed: pick, // { row, col, letter }
      scorePenalty: HINT_SCORE_PENALTY,
      hintsLeft: HINTS_PER_PLAYER_PER_ROUND - (hintsUsed + 1),
    });
  } catch (err) {
    console.error("Hint error:", err);
    return res.status(500).json({ error: "Failed to reveal hint" });
  }
});

// ---------------------------------------------
// 12) RETRY ROUND (wrong answer)
//   Same round number, NEW word / scramble / clue / timer
// ---------------------------------------------
router.post("/rounds/:roundId/retry", async (req, res) => {
  try {
    const { roundId } = req.params;
    const { roomCode } = req.body;

    if (!roomCode) {
      return res.status(400).json({ error: "roomCode is required" });
    }

    // 1. Current round
    const [roundRows] = await db.query(
      `SELECT * FROM word_scramble_rounds WHERE id = ? LIMIT 1`,
      [roundId]
    );

    if (roundRows.length === 0) {
      return res.status(404).json({ error: "Round not found" });
    }

    const currentRound = roundRows[0];

    // 2. Room
    const [roomRows] = await db.query(
      `SELECT * FROM word_scramble_rooms WHERE id = ? AND room_code = ? LIMIT 1`,
      [currentRound.room_id, roomCode]
    );

    if (roomRows.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    const room = roomRows[0];

    // 3. Difficulty config
    const config = getConfigForDifficulty(room.difficulty);

    // 4. Words already used in this room
    const [usedWordRows] = await db.query(
      `SELECT word FROM word_scramble_rounds WHERE room_id = ? AND word IS NOT NULL`,
      [room.id]
    );

    const usedWords = usedWordRows.map((row) => row.word).filter(Boolean);

    // 5. Pick another word from the DATABASE
    const { word, clue, scrambled } = await pickRandomWord(room.difficulty, usedWords);
    const { letters, words } = buildRoundWords(word);
    const revealedCells = pickInitialReveals(words, config.freeReveals);

    // 6. Save as a NEW row with the SAME round_number
    const [newRoundResult] = await db.query(
      `INSERT INTO word_scramble_rounds
        (room_id, round_number, word, clue, scrambled, time_limit_sec, letters_json, words_json, revealed_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [room.id, currentRound.round_number, word, clue, scrambled, config.timeLimitSec, JSON.stringify(letters), JSON.stringify(words), JSON.stringify(revealedCells)]
    );

    // 7. Send the new question
    return res.status(201).json({
      success: true,
      round: {
        id: newRoundResult.insertId,
        roundNumber: currentRound.round_number,
        totalRounds: config.rounds,
        scrambled,
        letters,
        words,
        totalWords: words.length,
        clue: buildClue(clue, config.clueType),
        clueType: config.clueType,
        timeLimitSec: config.timeLimitSec,
        lives: config.lives,
        freeReveals: config.freeReveals,
        revealedCells,
      },
    });
  } catch (err) {
    console.error("Retry round error:", err);
    return res.status(500).json({
      error: "Failed to load new question",
      details: err.message,
    });
  }
});
router.patch("/rooms/:roomCode/settings", async (req, res) => {
  try {
    const { roomCode } = req.params;
    const { playerName, totalRounds, timePerRoundSec } = req.body;

    if (!playerName) {
      return res.status(400).json({ error: "playerName is required" });
    }
    if (!totalRounds || !timePerRoundSec) {
      return res.status(400).json({ error: "totalRounds and timePerRoundSec are required" });
    }

    const [rooms] = await db.query(
      `SELECT * FROM word_scramble_rooms WHERE room_code = ?`,
      [roomCode]
    );
    if (rooms.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }
    const room = rooms[0];

    // Only the host can change settings
    const [hostRows] = await db.query(
      `SELECT player_name FROM word_scramble_players WHERE room_id = ? AND is_host = TRUE LIMIT 1`,
      [room.id]
    );
    if (hostRows.length === 0 || hostRows[0].player_name !== playerName) {
      return res.status(403).json({ error: "Only the host can update settings" });
    }

    // Only while the room is still waiting to start
    if (room.status !== "waiting") {
      return res.status(409).json({ error: "Cannot change settings after the game has started" });
    }

    await db.query(
      `UPDATE word_scramble_rooms SET total_rounds = ?, time_limit_sec = ? WHERE id = ?`,
      [totalRounds, timePerRoundSec, room.id]
    );

    const [players] = await db.query(PLAYERS_SQL, [room.id]);

    return res.status(200).json({
      success: true,
      room: {
        id: room.id,
        roomCode: room.room_code,
        roomName: room.room_name,
        roomType: room.room_type,
        maxPlayers: room.max_players,
        minPlayers: MIN_PLAYERS_TO_START,
        difficulty: room.difficulty,
        status: room.status,
        totalRounds,
        timePerRoundSec,
        players,
      },
    });
  } catch (err) {
    console.error("Update room settings error:", err);
    return res.status(500).json({ error: "Failed to update settings" });
  }
});
module.exports = router;