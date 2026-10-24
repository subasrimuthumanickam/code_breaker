
const db = require("../db");
const { pickRandomWord } = require("../utils/words");
const { WORD_SCRAMBLE_DIFFICULTY_CONFIG } = require("../config/wordScrambleDifficulty");
const { buildClue } = require("../utils/clue");
const { MIN_PLAYERS_TO_START } = require("../config/wordScrambleRoom");
const { findSubWords, layoutCrossword } = require("../utils/crosswordGenerator");
const { pickLiveWord, warmUpLiveWords } = require("../utils/liveWords");

// CHANGED: word count + timer now come from the progression config
// (3,5,6,8,9,10 words ... capped at 10, timer depends on difficulty)
const {
  MAX_WORDS,
  getTargetWordCount,
  getTimeLimitForWords,
} = require("../config/wordScrambleProgression");

let DICTIONARY = [];
try {
  DICTIONARY = require("../data/wordlist.json");
} catch (e) {
  console.warn("[wordscramble] backend/src/data/wordlist.json missing - crossword rounds disabled");
}

// Fill the live word pool in the background (does not block the server start)
warmUpLiveWords();

const MIN_GRID_WORDS = 2;
const MAX_GRID_WORDS = MAX_WORDS; // CHANGED: was 7, now 10

// Highest level a player can reach when they keep going past the normal set
// (after using a Skip Round on the "Great Job" popup).
const MAX_LEVEL = 50;

const parse = (v, fallback = []) => {
  try {
    return typeof v === "string" ? JSON.parse(v) : v ?? fallback;
  } catch (e) {
    return fallback;
  }
};

const getConfig = (difficulty) =>
  WORD_SCRAMBLE_DIFFICULTY_CONFIG[difficulty] || WORD_SCRAMBLE_DIFFICULTY_CONFIG.easy;

// CHANGED: the room's own total_rounds (chosen on Create Room, 1 - 50) wins.
// Old rooms (NULL) fall back to the difficulty config.
const getTotalRounds = (room, config) => Number(room?.total_rounds) || config.rounds;

/* ---------- NO-REPEAT QUESTIONS: words each player has already been asked ---------- */

// Created automatically on start-up (same collation as the other word_scramble tables).
db.query(
  `CREATE TABLE IF NOT EXISTS ws_seen_words (
     player_name VARCHAR(100) NOT NULL,
     word        VARCHAR(50)  NOT NULL,
     seen_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (player_name, word)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
).catch((err) => console.warn("[wordscramble] could not create ws_seen_words:", err.message));

// Every word that ANY player in this room has already been asked.
async function getSeenWords(conn, roomId) {
  const [rows] = await conn.query(
    `SELECT DISTINCT s.word
     FROM ws_seen_words s
     JOIN word_scramble_players p ON p.player_name = s.player_name
     WHERE p.room_id = ?`,
    [roomId]
  );
  return rows.map((r) => r.word);
}

// Remember the question for every player in the room.
async function markWordSeen(conn, roomId, word) {
  await conn.query(
    `INSERT IGNORE INTO ws_seen_words (player_name, word)
     SELECT player_name, ? FROM word_scramble_players WHERE room_id = ?`,
    [word, roomId]
  );
}

// Words that must NOT be picked: this room's earlier rounds + everything the players have seen.
async function buildExcludeList(conn, room, usedWords) {
  const inRoom = [...new Set(usedWords)];
  const seen = await getSeenWords(conn, room.id);
  return [...new Set([...inRoom, ...seen])];
}

/* ---------- puzzle building ---------- */

function wordCells(slot) {
  const cells = [];
  for (let k = 0; k < slot.word.length; k++) {
    cells.push({
      row: slot.direction === "across" ? slot.row : slot.row + k,
      col: slot.direction === "across" ? slot.col + k : slot.col,
    });
  }
  return cells;
}

function pickInitialReveals(words, count) {
  if (!count || count <= 0) return [];
  const all = [];
  words.forEach((w) => wordCells(w).forEach((c) => all.push(c)));
  const uniq = [...new Map(all.map((c) => [`${c.row}-${c.col}`, c])).values()];
  return uniq.sort(() => Math.random() - 0.5).slice(0, Math.min(count, uniq.length));
}

function buildRoundWords(baseWord, maxWords) {
  const root = String(baseWord).toLowerCase();
  const letters = root.toUpperCase().split("");
  const all = findSubWords(root.split(""), DICTIONARY);
  const slots = all.length ? layoutCrossword(all, root, maxWords) : [];
  const words = (slots.length ? slots : [{ word: root, row: 0, col: 0, direction: "across" }]).map((s) => ({
    word: s.word.toUpperCase(),
    row: s.row,
    col: s.col,
    direction: s.direction,
  }));
  return { letters, words };
}

// Live random word first (library + dictionary API). If the internet / API is
// not available, fall back to the words stored in the database.
async function pickAnyWord(difficulty, tried) {
  try {
    return await pickLiveWord(difficulty, tried);
  } catch (err) {
    console.warn("[wordscramble] live word unavailable, using database word:", err.message);
    try {
      return await pickRandomWord(difficulty, tried);
    } catch (dbErr) {
      // database words are used up too -> allow a repeat instead of crashing the game
      return pickRandomWord(difficulty, []);
    }
  }
}

async function pickPlayableWord(difficulty, usedWords = [], wordCount = MIN_GRID_WORDS) {
  const tried = [...usedWords];
  let best = null;
  const targetWords = Math.min(Math.max(wordCount, MIN_GRID_WORDS), MAX_GRID_WORDS);

  // CHANGED: bigger tables (8-10 words) need a richer root word, so try more
  // random words before settling for the best one found.
  const attempts = targetWords >= 8 ? 30 : 15;

  for (let i = 0; i < attempts; i++) {
    const picked = await pickAnyWord(difficulty, tried);
    tried.push(picked.word);
    const built = buildRoundWords(picked.word, targetWords);
    if (!best || built.words.length > best.built.words.length) best = { picked, built };
    if (best.built.words.length >= targetWords) break;
  }
  return best;
}

/* ---------- DB helpers ---------- */

async function withRoomLock(roomId, work) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(`SELECT id FROM word_scramble_rooms WHERE id = ? FOR UPDATE`, [roomId]);
    const result = await work(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function latestRound(conn, roomId) {
  const [rows] = await conn.query(
    `SELECT * FROM word_scramble_rounds WHERE room_id = ? ORDER BY id DESC LIMIT 1`,
    [roomId]
  );
  return rows[0] || null;
}

/* ---------- per-player progress (keyed by player name) ---------- */

// Remember the furthest round every player in this room has reached.
async function recordProgress(conn, roomId, reachedRound) {
  await conn.query(
    `INSERT INTO ws_player_progress (player_name, next_round)
     SELECT player_name, ? FROM word_scramble_players WHERE room_id = ?
     ON DUPLICATE KEY UPDATE next_round = GREATEST(next_round, VALUES(next_round))`,
    [reachedRound, roomId]
  );
}

// A full set was finished -> everybody in the room starts again from round 1.
async function resetProgress(conn, roomId) {
  await conn.query(
    `UPDATE ws_player_progress pr
     JOIN word_scramble_players p ON p.player_name = pr.player_name
     SET pr.next_round = 1
     WHERE p.room_id = ?`,
    [roomId]
  );
}

// CHANGED: takes the room's totalRounds (not the difficulty config)
async function startingRound(conn, roomId, totalRounds) {
  const [rows] = await conn.query(
    `SELECT MAX(pr.next_round) AS n
     FROM ws_player_progress pr
     JOIN word_scramble_players p ON p.player_name = pr.player_name
     WHERE p.room_id = ?`,
    [roomId]
  );
  let n = Number(rows[0]?.n) || 1;
  if (n === totalRounds + 1) n = 1;
  return Math.min(Math.max(n, 1), MAX_LEVEL);
}

async function createRound(conn, room, roundNumber, config, usedWords) {
  // CHANGED: word count follows the progression (3,5,6,8,9,10 cap)
  const wordCount = getTargetWordCount(roundNumber);

  // never pick a word the players in this room have already been asked
  const exclude = await buildExcludeList(conn, room, usedWords);
  const { picked, built } = await pickPlayableWord(room.difficulty, exclude, wordCount);
  const revealed = pickInitialReveals(built.words, config.freeReveals);

  // CHANGED: timer depends on difficulty + how many words the table REALLY has
  // (must come AFTER `built` exists). Edit TIME_RULES in wordScrambleProgression.js
  const timeLimitSec = getTimeLimitForWords(room.difficulty, built.words.length);

  const [result] = await conn.query(
    `INSERT INTO word_scramble_rounds
       (room_id, round_number, word, clue, scrambled, time_limit_sec, letters_json, words_json, revealed_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      room.id,
      roundNumber,
      picked.word,
      picked.clue,
      picked.scrambled,
      timeLimitSec,
      JSON.stringify(built.letters),
      JSON.stringify(built.words),
      JSON.stringify(revealed),
    ]
  );

  await recordProgress(conn, room.id, roundNumber);
  await markWordSeen(conn, room.id, picked.word); // this question is now "asked"

  const [rows] = await conn.query(`SELECT * FROM word_scramble_rounds WHERE id = ?`, [result.insertId]);
  return rows[0];
}

// CHANGED: totalRounds is passed in (room's own value) instead of config.rounds
function roundPayload(row, config, totalRounds) {
  const words = parse(row.words_json);
  return {
    id: row.id,
    roundNumber: row.round_number,
    totalRounds,
    scrambled: row.scrambled,
    letters: parse(row.letters_json),
    words,
    totalWords: words.length,
    clue: buildClue(row.clue, config.clueType),
    clueType: config.clueType,
    timeLimitSec: row.time_limit_sec,
    lives: config.lives,
    freeReveals: config.freeReveals,
    revealedCells: parse(row.revealed_json),
  };
}

async function findRoom(roomCode) {
  const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
  return rooms[0] || null;
}

/* ---------- routes ---------- */

module.exports = function registerRoundRoutes(router) {
  // Which room is this player still playing? (works from any device, by player name)
  router.get("/active-room/:playerName", async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT r.room_code
         FROM word_scramble_rooms r
         JOIN word_scramble_players p ON p.room_id = r.id
         WHERE p.player_name = ? AND r.status = 'in_progress'
         ORDER BY r.id DESC LIMIT 1`,
        [req.params.playerName]
      );
      return res.status(200).json({ success: true, roomCode: rows[0]?.room_code ?? null });
    } catch (err) {
      console.error("Active room error:", err);
      return res.status(500).json({ error: "Failed to look up active room" });
    }
  });

  // START GAME - idempotent. Brand-new game starts at the player's saved progress.
  //
  // NEW RULE: while the room is still 'waiting', the game can start ONLY when
  // every seat is filled (joined players === max players). Once the game is
  // in_progress this check is skipped, so every player's app can still call
  // /start to get the same current round.
  router.post("/rooms/:roomCode/start", async (req, res) => {
    try {
      const room = await findRoom(req.params.roomCode);
      if (!room) return res.status(404).json({ error: "Room not found" });
      const config = getConfig(room.difficulty);
      const totalRounds = getTotalRounds(room, config); // CHANGED

      const [countRows] = await db.query(
        `SELECT COUNT(*) AS c FROM word_scramble_players WHERE room_id = ?`,
        [room.id]
      );
      const joined = Number(countRows[0].c) || 0;
      const maxPlayers = Number(room.max_players) || MIN_PLAYERS_TO_START;

      if (room.status === "waiting") {
        if (joined < MIN_PLAYERS_TO_START) {
          return res
            .status(409)
            .json({ success: false, error: `Need at least ${MIN_PLAYERS_TO_START} players to start` });
        }

        if (joined < maxPlayers) {
          return res.status(409).json({
            success: false,
            error: `Waiting for all players to join (${joined}/${maxPlayers})`,
            joined,
            maxPlayers,
          });
        }
      }

      const round = await withRoomLock(room.id, async (conn) => {
        const [fresh] = await conn.query(`SELECT status FROM word_scramble_rooms WHERE id = ?`, [room.id]);
        const existing = await latestRound(conn, room.id);
        if (fresh[0]?.status === "in_progress" && existing) return existing; // already started -> same round

        await conn.query(`UPDATE word_scramble_rooms SET status = 'in_progress' WHERE id = ?`, [room.id]);
        const first = await startingRound(conn, room.id, totalRounds); // CHANGED
        return createRound(conn, room, first, config, []);
      });

      return res
        .status(200)
        .json({ success: true, round: roundPayload(round, config, totalRounds) });
    } catch (err) {
      console.error("Start game error:", err);
      return res.status(500).json({ error: "Failed to start game" });
    }
  });

  // NEXT ROUND - body: { fromRoundId, skip }
  //   skip = 1 -> the player used a Skip Round on the "Great Job" popup:
  //   round (N+1) is skipped and round (N+2) is created, even past the last round.
  router.post("/rooms/:roomCode/next-round", async (req, res) => {
    try {
      const { fromRoundId } = req.body || {};
      let skip = Math.min(Math.max(parseInt(req.body?.skip, 10) || 0, 0), 1);

      const room = await findRoom(req.params.roomCode);
      if (!room) return res.status(404).json({ error: "Room not found" });
      const config = getConfig(room.difficulty);
      const totalRounds = getTotalRounds(room, config); // CHANGED

      const outcome = await withRoomLock(room.id, async (conn) => {
        const latest = await latestRound(conn, room.id);

        if (latest && fromRoundId && String(latest.id) !== String(fromRoundId)) {
          return { finished: false, round: latest }; // already advanced by another player
        }

        // Only honour skip if a skip token was really spent for this round
        // (POST /api/skip/use with roundId "after-<roundId>").
        if (skip > 0) {
          const key = `after-${fromRoundId || (latest ? latest.id : "")}`;
          const [ok] = await conn.query(`SELECT 1 FROM ws_skipped_rounds WHERE round_id = ? LIMIT 1`, [key]);
          if (ok.length === 0) skip = 0;
        }

        const currentNumber = latest ? latest.round_number : 0;
        const extended = skip > 0 || currentNumber > totalRounds; // CHANGED
        const limit = extended ? MAX_LEVEL : totalRounds; // CHANGED
        const nextNumber = currentNumber + 1 + skip;

        if (nextNumber > limit) {
          await conn.query(`UPDATE word_scramble_rooms SET status = 'finished' WHERE id = ?`, [room.id]);
          await resetProgress(conn, room.id); // set finished -> next game starts at round 1
          return { finished: true };
        }

        const [prev] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
        const round = await createRound(conn, room, nextNumber, config, prev.map((r) => r.word));
        return { finished: false, round };
      });

      if (outcome.finished) return res.status(200).json({ success: true, finished: true });
      return res.status(200).json({
        success: true,
        finished: false,
        round: roundPayload(outcome.round, config, totalRounds),
      });
    } catch (err) {
      console.error("Next round error:", err);
      return res.status(500).json({ error: "Failed to advance round" });
    }
  });

  // RETRY - same round number, ONE new puzzle shared by everyone who retries
  router.post("/rounds/:roundId/retry", async (req, res) => {
    try {
      const { roundId } = req.params;
      const { roomCode } = req.body || {};
      if (!roomCode) return res.status(400).json({ error: "roomCode is required" });

      const [roundRows] = await db.query(`SELECT * FROM word_scramble_rounds WHERE id = ? LIMIT 1`, [roundId]);
      if (roundRows.length === 0) return res.status(404).json({ error: "Round not found" });
      const current = roundRows[0];

      const [roomRows] = await db.query(
        `SELECT * FROM word_scramble_rooms WHERE id = ? AND room_code = ? LIMIT 1`,
        [current.room_id, roomCode]
      );
      if (roomRows.length === 0) return res.status(404).json({ error: "Room not found" });
      const room = roomRows[0];
      const config = getConfig(room.difficulty);
      const totalRounds = getTotalRounds(room, config); // CHANGED

      const round = await withRoomLock(room.id, async (conn) => {
        const latest = await latestRound(conn, room.id);
        if (latest && String(latest.id) !== String(current.id)) return latest; // someone already retried/advanced

        const [used] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
        return createRound(conn, room, current.round_number, config, used.map((r) => r.word));
      });

      return res
        .status(200)
        .json({ success: true, round: roundPayload(round, config, totalRounds) });
    } catch (err) {
      console.error("Retry round error:", err);
      return res.status(500).json({ error: "Failed to load new question", details: err.message });
    }
  });
};