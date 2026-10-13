// // // // // // // // // // /**
// // // // // // // // // //  * Round flow for Word Scramble multiplayer  (start / next-round / retry)
// // // // // // // // // //  *
// // // // // // // // // //  * WHY THIS EXISTS
// // // // // // // // // //  * Every player's phone/browser calls these endpoints. The old versions created a
// // // // // // // // // //  * brand-new random round on EVERY call, so player 1 and player 2 each got a
// // // // // // // // // //  * different word/puzzle. Here the round is created ONCE per room step (inside a DB
// // // // // // // // // //  * lock) and every other caller simply receives that same row.
// // // // // // // // // //  *
// // // // // // // // // //  * Wire-up (in Wordscrambleroutes.js):
// // // // // // // // // //  *   1. DELETE the old routes  POST /rooms/:roomCode/start,
// // // // // // // // // //  *      POST /rooms/:roomCode/next-round  and  POST /rounds/:roundId/retry
// // // // // // // // // //  *   2. just above `module.exports = router;` add:
// // // // // // // // // //  *        require("./wordscrambleRoundFlow")(router);
// // // // // // // // // //  */
// // // // // // // // // // const db = require("../db");
// // // // // // // // // // const { pickRandomWord } = require("../utils/words");
// // // // // // // // // // const { WORD_SCRAMBLE_DIFFICULTY_CONFIG } = require("../config/wordScrambleDifficulty");
// // // // // // // // // // const { buildClue } = require("../utils/clue");
// // // // // // // // // // const { MIN_PLAYERS_TO_START } = require("../config/wordScrambleRoom");
// // // // // // // // // // const { findSubWords, layoutCrossword } = require("../utils/crosswordGenerator");

// // // // // // // // // // let DICTIONARY = [];
// // // // // // // // // // try {
// // // // // // // // // //   DICTIONARY = require("../data/wordlist.json");
// // // // // // // // // // } catch (e) {
// // // // // // // // // //   console.warn("[wordscramble] backend/src/data/wordlist.json missing - crossword rounds disabled");
// // // // // // // // // // }

// // // // // // // // // // const MIN_GRID_WORDS = 4; // a round must have at least this many crossing words
// // // // // // // // // // const MAX_GRID_WORDS = 7;

// // // // // // // // // // const parse = (v, fallback = []) => {
// // // // // // // // // //   try {
// // // // // // // // // //     return typeof v === "string" ? JSON.parse(v) : v ?? fallback;
// // // // // // // // // //   } catch (e) {
// // // // // // // // // //     return fallback;
// // // // // // // // // //   }
// // // // // // // // // // };

// // // // // // // // // // const getConfig = (difficulty) =>
// // // // // // // // // //   WORD_SCRAMBLE_DIFFICULTY_CONFIG[difficulty] || WORD_SCRAMBLE_DIFFICULTY_CONFIG.easy;

// // // // // // // // // // /* ---------- puzzle building ---------- */

// // // // // // // // // // function wordCells(slot) {
// // // // // // // // // //   const cells = [];
// // // // // // // // // //   for (let k = 0; k < slot.word.length; k++) {
// // // // // // // // // //     cells.push({
// // // // // // // // // //       row: slot.direction === "across" ? slot.row : slot.row + k,
// // // // // // // // // //       col: slot.direction === "across" ? slot.col + k : slot.col,
// // // // // // // // // //     });
// // // // // // // // // //   }
// // // // // // // // // //   return cells;
// // // // // // // // // // }

// // // // // // // // // // // same starter letters for every player: picked once, stored in revealed_json
// // // // // // // // // // function pickInitialReveals(words, count) {
// // // // // // // // // //   if (!count || count <= 0) return [];
// // // // // // // // // //   const all = [];
// // // // // // // // // //   words.forEach((w) => wordCells(w).forEach((c) => all.push(c)));
// // // // // // // // // //   const uniq = [...new Map(all.map((c) => [`${c.row}-${c.col}`, c])).values()];
// // // // // // // // // //   return uniq.sort(() => Math.random() - 0.5).slice(0, Math.min(count, uniq.length));
// // // // // // // // // // }

// // // // // // // // // // function buildRoundWords(baseWord) {
// // // // // // // // // //   const root = String(baseWord).toLowerCase();
// // // // // // // // // //   const letters = root.toUpperCase().split("");
// // // // // // // // // //   const all = findSubWords(root.split(""), DICTIONARY);
// // // // // // // // // //   const slots = all.length ? layoutCrossword(all, root, MAX_GRID_WORDS) : [];
// // // // // // // // // //   const words = (slots.length ? slots : [{ word: root, row: 0, col: 0, direction: "across" }]).map((s) => ({
// // // // // // // // // //     word: s.word.toUpperCase(),
// // // // // // // // // //     row: s.row,
// // // // // // // // // //     col: s.col,
// // // // // // // // // //     direction: s.direction,
// // // // // // // // // //   }));
// // // // // // // // // //   return { letters, words };
// // // // // // // // // // }

// // // // // // // // // // // keep drawing words from the word bank until one gives a proper crossword
// // // // // // // // // // async function pickPlayableWord(difficulty, usedWords = []) {
// // // // // // // // // //   const tried = [...usedWords];
// // // // // // // // // //   let best = null;
// // // // // // // // // //   for (let i = 0; i < 15; i++) {
// // // // // // // // // //     const picked = await pickRandomWord(difficulty, tried);
// // // // // // // // // //     tried.push(picked.word);
// // // // // // // // // //     const built = buildRoundWords(picked.word);
// // // // // // // // // //     if (!best || built.words.length > best.built.words.length) best = { picked, built };
// // // // // // // // // //     if (built.words.length >= MIN_GRID_WORDS) break;
// // // // // // // // // //   }
// // // // // // // // // //   return best;
// // // // // // // // // // }

// // // // // // // // // // /* ---------- DB helpers ---------- */

// // // // // // // // // // // Serialises everything that creates rounds for ONE room, so two players hitting
// // // // // // // // // // // the endpoint at the same moment can never create two different rounds.
// // // // // // // // // // async function withRoomLock(roomId, work) {
// // // // // // // // // //   const conn = await db.getConnection();
// // // // // // // // // //   try {
// // // // // // // // // //     await conn.beginTransaction();
// // // // // // // // // //     await conn.query(`SELECT id FROM word_scramble_rooms WHERE id = ? FOR UPDATE`, [roomId]);
// // // // // // // // // //     const result = await work(conn);
// // // // // // // // // //     await conn.commit();
// // // // // // // // // //     return result;
// // // // // // // // // //   } catch (err) {
// // // // // // // // // //     await conn.rollback();
// // // // // // // // // //     throw err;
// // // // // // // // // //   } finally {
// // // // // // // // // //     conn.release();
// // // // // // // // // //   }
// // // // // // // // // // }

// // // // // // // // // // async function latestRound(conn, roomId) {
// // // // // // // // // //   const [rows] = await conn.query(
// // // // // // // // // //     `SELECT * FROM word_scramble_rounds WHERE room_id = ? ORDER BY id DESC LIMIT 1`,
// // // // // // // // // //     [roomId]
// // // // // // // // // //   );
// // // // // // // // // //   return rows[0] || null;
// // // // // // // // // // }

// // // // // // // // // // async function createRound(conn, room, roundNumber, config, usedWords) {
// // // // // // // // // //   const { picked, built } = await pickPlayableWord(room.difficulty, usedWords);
// // // // // // // // // //   const revealed = pickInitialReveals(built.words, config.freeReveals);

// // // // // // // // // //   const [result] = await conn.query(
// // // // // // // // // //     `INSERT INTO word_scramble_rounds
// // // // // // // // // //        (room_id, round_number, word, clue, scrambled, time_limit_sec, letters_json, words_json, revealed_json)
// // // // // // // // // //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// // // // // // // // // //     [
// // // // // // // // // //       room.id,
// // // // // // // // // //       roundNumber,
// // // // // // // // // //       picked.word,
// // // // // // // // // //       picked.clue,
// // // // // // // // // //       picked.scrambled,
// // // // // // // // // //       config.timeLimitSec,
// // // // // // // // // //       JSON.stringify(built.letters),
// // // // // // // // // //       JSON.stringify(built.words),
// // // // // // // // // //       JSON.stringify(revealed),
// // // // // // // // // //     ]
// // // // // // // // // //   );
// // // // // // // // // //   const [rows] = await conn.query(`SELECT * FROM word_scramble_rounds WHERE id = ?`, [result.insertId]);
// // // // // // // // // //   return rows[0];
// // // // // // // // // // }

// // // // // // // // // // // One place that turns a DB row into the JSON the app expects (same for every player)
// // // // // // // // // // function roundPayload(row, config) {
// // // // // // // // // //   const words = parse(row.words_json);
// // // // // // // // // //   return {
// // // // // // // // // //     id: row.id,
// // // // // // // // // //     roundNumber: row.round_number,
// // // // // // // // // //     totalRounds: config.rounds,
// // // // // // // // // //     scrambled: row.scrambled,
// // // // // // // // // //     letters: parse(row.letters_json),
// // // // // // // // // //     words,
// // // // // // // // // //     totalWords: words.length,
// // // // // // // // // //     clue: buildClue(row.clue, config.clueType),
// // // // // // // // // //     clueType: config.clueType,
// // // // // // // // // //     timeLimitSec: row.time_limit_sec,
// // // // // // // // // //     lives: config.lives,
// // // // // // // // // //     freeReveals: config.freeReveals,
// // // // // // // // // //     revealedCells: parse(row.revealed_json),
// // // // // // // // // //   };
// // // // // // // // // // }

// // // // // // // // // // async function findRoom(roomCode) {
// // // // // // // // // //   const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
// // // // // // // // // //   return rooms[0] || null;
// // // // // // // // // // }

// // // // // // // // // // /* ---------- routes ---------- */

// // // // // // // // // // module.exports = function registerRoundRoutes(router) {
// // // // // // // // // //   // START GAME - idempotent: first call creates round 1, everyone else gets the same round
// // // // // // // // // //   router.post("/rooms/:roomCode/start", async (req, res) => {
// // // // // // // // // //     try {
// // // // // // // // // //       const room = await findRoom(req.params.roomCode);
// // // // // // // // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // // // // // // // //       const config = getConfig(room.difficulty);

// // // // // // // // // //       const [countRows] = await db.query(
// // // // // // // // // //         `SELECT COUNT(*) AS c FROM word_scramble_players WHERE room_id = ?`,
// // // // // // // // // //         [room.id]
// // // // // // // // // //       );
// // // // // // // // // //       if (countRows[0].c < MIN_PLAYERS_TO_START) {
// // // // // // // // // //         return res.status(409).json({ error: `Need at least ${MIN_PLAYERS_TO_START} players to start` });
// // // // // // // // // //       }

// // // // // // // // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // // // // // // // //         const [fresh] = await conn.query(`SELECT status FROM word_scramble_rooms WHERE id = ?`, [room.id]);
// // // // // // // // // //         const existing = await latestRound(conn, room.id);
// // // // // // // // // //         if (fresh[0]?.status === "in_progress" && existing) return existing; // already started

// // // // // // // // // //         await conn.query(`UPDATE word_scramble_rooms SET status = 'in_progress' WHERE id = ?`, [room.id]);
// // // // // // // // // //         return createRound(conn, room, 1, config, []);
// // // // // // // // // //       });

// // // // // // // // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       console.error("Start game error:", err);
// // // // // // // // // //       return res.status(500).json({ error: "Failed to start game" });
// // // // // // // // // //     }
// // // // // // // // // //   });

// // // // // // // // // //   // NEXT ROUND - body: { fromRoundId }  (the round the caller just finished)
// // // // // // // // // //   // If somebody else already advanced, the caller just receives that round.
// // // // // // // // // //   router.post("/rooms/:roomCode/next-round", async (req, res) => {
// // // // // // // // // //     try {
// // // // // // // // // //       const { fromRoundId } = req.body || {};
// // // // // // // // // //       const room = await findRoom(req.params.roomCode);
// // // // // // // // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // // // // // // // //       const config = getConfig(room.difficulty);

// // // // // // // // // //       const outcome = await withRoomLock(room.id, async (conn) => {
// // // // // // // // // //         const latest = await latestRound(conn, room.id);

// // // // // // // // // //         if (latest && fromRoundId && String(latest.id) !== String(fromRoundId)) {
// // // // // // // // // //           return { finished: false, round: latest }; // already advanced by another player
// // // // // // // // // //         }

// // // // // // // // // //         const nextNumber = (latest ? latest.round_number : 0) + 1;
// // // // // // // // // //         if (nextNumber > config.rounds) {
// // // // // // // // // //           await conn.query(`UPDATE word_scramble_rooms SET status = 'finished' WHERE id = ?`, [room.id]);
// // // // // // // // // //           return { finished: true };
// // // // // // // // // //         }

// // // // // // // // // //         const [prev] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // // // // // // // //         const round = await createRound(conn, room, nextNumber, config, prev.map((r) => r.word));
// // // // // // // // // //         return { finished: false, round };
// // // // // // // // // //       });

// // // // // // // // // //       if (outcome.finished) return res.status(200).json({ success: true, finished: true });
// // // // // // // // // //       return res.status(200).json({ success: true, finished: false, round: roundPayload(outcome.round, config) });
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       console.error("Next round error:", err);
// // // // // // // // // //       return res.status(500).json({ error: "Failed to advance round" });
// // // // // // // // // //     }
// // // // // // // // // //   });

// // // // // // // // // //   // RETRY - same round number, ONE new puzzle shared by everyone who retries
// // // // // // // // // //   router.post("/rounds/:roundId/retry", async (req, res) => {
// // // // // // // // // //     try {
// // // // // // // // // //       const { roundId } = req.params;
// // // // // // // // // //       const { roomCode } = req.body || {};
// // // // // // // // // //       if (!roomCode) return res.status(400).json({ error: "roomCode is required" });

// // // // // // // // // //       const [roundRows] = await db.query(`SELECT * FROM word_scramble_rounds WHERE id = ? LIMIT 1`, [roundId]);
// // // // // // // // // //       if (roundRows.length === 0) return res.status(404).json({ error: "Round not found" });
// // // // // // // // // //       const current = roundRows[0];

// // // // // // // // // //       const [roomRows] = await db.query(
// // // // // // // // // //         `SELECT * FROM word_scramble_rooms WHERE id = ? AND room_code = ? LIMIT 1`,
// // // // // // // // // //         [current.room_id, roomCode]
// // // // // // // // // //       );
// // // // // // // // // //       if (roomRows.length === 0) return res.status(404).json({ error: "Room not found" });
// // // // // // // // // //       const room = roomRows[0];
// // // // // // // // // //       const config = getConfig(room.difficulty);

// // // // // // // // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // // // // // // // //         const latest = await latestRound(conn, room.id);
// // // // // // // // // //         if (latest && String(latest.id) !== String(current.id)) return latest; // someone already retried/advanced

// // // // // // // // // //         const [used] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // // // // // // // //         return createRound(conn, room, current.round_number, config, used.map((r) => r.word));
// // // // // // // // // //       });

// // // // // // // // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       console.error("Retry round error:", err);
// // // // // // // // // //       return res.status(500).json({ error: "Failed to load new question", details: err.message });
// // // // // // // // // //     }
// // // // // // // // // //   });
// // // // // // // // // // };
// // // // // // // // // const db = require("../db");
// // // // // // // // // const { pickRandomWord } = require("../utils/words");
// // // // // // // // // const { WORD_SCRAMBLE_DIFFICULTY_CONFIG } = require("../config/wordScrambleDifficulty");
// // // // // // // // // const { buildClue } = require("../utils/clue");
// // // // // // // // // const { MIN_PLAYERS_TO_START } = require("../config/wordScrambleRoom");
// // // // // // // // // const { findSubWords, layoutCrossword } = require("../utils/crosswordGenerator");

// // // // // // // // // let DICTIONARY = [];
// // // // // // // // // try {
// // // // // // // // //   DICTIONARY = require("../data/wordlist.json");
// // // // // // // // // } catch (e) {
// // // // // // // // //   console.warn("[wordscramble] backend/src/data/wordlist.json missing - crossword rounds disabled");
// // // // // // // // // }

// // // // // // // // // const MIN_GRID_WORDS = 4; // a round must have at least this many crossing words
// // // // // // // // // const MAX_GRID_WORDS = 7;

// // // // // // // // // const parse = (v, fallback = []) => {
// // // // // // // // //   try {
// // // // // // // // //     return typeof v === "string" ? JSON.parse(v) : v ?? fallback;
// // // // // // // // //   } catch (e) {
// // // // // // // // //     return fallback;
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const getConfig = (difficulty) =>
// // // // // // // // //   WORD_SCRAMBLE_DIFFICULTY_CONFIG[difficulty] || WORD_SCRAMBLE_DIFFICULTY_CONFIG.easy;

// // // // // // // // // /* ---------- puzzle building ---------- */

// // // // // // // // // function wordCells(slot) {
// // // // // // // // //   const cells = [];
// // // // // // // // //   for (let k = 0; k < slot.word.length; k++) {
// // // // // // // // //     cells.push({
// // // // // // // // //       row: slot.direction === "across" ? slot.row : slot.row + k,
// // // // // // // // //       col: slot.direction === "across" ? slot.col + k : slot.col,
// // // // // // // // //     });
// // // // // // // // //   }
// // // // // // // // //   return cells;
// // // // // // // // // }

// // // // // // // // // // same starter letters for every player: picked once, stored in revealed_json
// // // // // // // // // function pickInitialReveals(words, count) {
// // // // // // // // //   if (!count || count <= 0) return [];
// // // // // // // // //   const all = [];
// // // // // // // // //   words.forEach((w) => wordCells(w).forEach((c) => all.push(c)));
// // // // // // // // //   const uniq = [...new Map(all.map((c) => [`${c.row}-${c.col}`, c])).values()];
// // // // // // // // //   return uniq.sort(() => Math.random() - 0.5).slice(0, Math.min(count, uniq.length));
// // // // // // // // // }

// // // // // // // // // function buildRoundWords(baseWord) {
// // // // // // // // //   const root = String(baseWord).toLowerCase();
// // // // // // // // //   const letters = root.toUpperCase().split("");
// // // // // // // // //   const all = findSubWords(root.split(""), DICTIONARY);
// // // // // // // // //   const slots = all.length ? layoutCrossword(all, root, MAX_GRID_WORDS) : [];
// // // // // // // // //   const words = (slots.length ? slots : [{ word: root, row: 0, col: 0, direction: "across" }]).map((s) => ({
// // // // // // // // //     word: s.word.toUpperCase(),
// // // // // // // // //     row: s.row,
// // // // // // // // //     col: s.col,
// // // // // // // // //     direction: s.direction,
// // // // // // // // //   }));
// // // // // // // // //   return { letters, words };
// // // // // // // // // }

// // // // // // // // // // keep drawing words from the word bank until one gives a proper crossword
// // // // // // // // // async function pickPlayableWord(difficulty, usedWords = []) {
// // // // // // // // //   const tried = [...usedWords];
// // // // // // // // //   let best = null;
// // // // // // // // //   for (let i = 0; i < 15; i++) {
// // // // // // // // //     const picked = await pickRandomWord(difficulty, tried);
// // // // // // // // //     tried.push(picked.word);
// // // // // // // // //     const built = buildRoundWords(picked.word);
// // // // // // // // //     if (!best || built.words.length > best.built.words.length) best = { picked, built };
// // // // // // // // //     if (built.words.length >= MIN_GRID_WORDS) break;
// // // // // // // // //   }
// // // // // // // // //   return best;
// // // // // // // // // }

// // // // // // // // // /* ---------- DB helpers ---------- */

// // // // // // // // // // Serialises everything that creates rounds for ONE room, so two players hitting
// // // // // // // // // // the endpoint at the same moment can never create two different rounds.
// // // // // // // // // async function withRoomLock(roomId, work) {
// // // // // // // // //   const conn = await db.getConnection();
// // // // // // // // //   try {
// // // // // // // // //     await conn.beginTransaction();
// // // // // // // // //     await conn.query(`SELECT id FROM word_scramble_rooms WHERE id = ? FOR UPDATE`, [roomId]);
// // // // // // // // //     const result = await work(conn);
// // // // // // // // //     await conn.commit();
// // // // // // // // //     return result;
// // // // // // // // //   } catch (err) {
// // // // // // // // //     await conn.rollback();
// // // // // // // // //     throw err;
// // // // // // // // //   } finally {
// // // // // // // // //     conn.release();
// // // // // // // // //   }
// // // // // // // // // }

// // // // // // // // // async function latestRound(conn, roomId) {
// // // // // // // // //   const [rows] = await conn.query(
// // // // // // // // //     `SELECT * FROM word_scramble_rounds WHERE room_id = ? ORDER BY id DESC LIMIT 1`,
// // // // // // // // //     [roomId]
// // // // // // // // //   );
// // // // // // // // //   return rows[0] || null;
// // // // // // // // // }

// // // // // // // // // async function createRound(conn, room, roundNumber, config, usedWords) {
// // // // // // // // //   const { picked, built } = await pickPlayableWord(room.difficulty, usedWords);
// // // // // // // // //   const revealed = pickInitialReveals(built.words, config.freeReveals);

// // // // // // // // //   const [result] = await conn.query(
// // // // // // // // //     `INSERT INTO word_scramble_rounds
// // // // // // // // //        (room_id, round_number, word, clue, scrambled, time_limit_sec, letters_json, words_json, revealed_json)
// // // // // // // // //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// // // // // // // // //     [
// // // // // // // // //       room.id,
// // // // // // // // //       roundNumber,
// // // // // // // // //       picked.word,
// // // // // // // // //       picked.clue,
// // // // // // // // //       picked.scrambled,
// // // // // // // // //       config.timeLimitSec,
// // // // // // // // //       JSON.stringify(built.letters),
// // // // // // // // //       JSON.stringify(built.words),
// // // // // // // // //       JSON.stringify(revealed),
// // // // // // // // //     ]
// // // // // // // // //   );
// // // // // // // // //   const [rows] = await conn.query(`SELECT * FROM word_scramble_rounds WHERE id = ?`, [result.insertId]);
// // // // // // // // //   return rows[0];
// // // // // // // // // }

// // // // // // // // // // One place that turns a DB row into the JSON the app expects (same for every player)
// // // // // // // // // function roundPayload(row, config) {
// // // // // // // // //   const words = parse(row.words_json);
// // // // // // // // //   return {
// // // // // // // // //     id: row.id,
// // // // // // // // //     roundNumber: row.round_number,
// // // // // // // // //     totalRounds: config.rounds,
// // // // // // // // //     scrambled: row.scrambled,
// // // // // // // // //     letters: parse(row.letters_json),
// // // // // // // // //     words,
// // // // // // // // //     totalWords: words.length,
// // // // // // // // //     clue: buildClue(row.clue, config.clueType),
// // // // // // // // //     clueType: config.clueType,
// // // // // // // // //     timeLimitSec: row.time_limit_sec,
// // // // // // // // //     lives: config.lives,
// // // // // // // // //     freeReveals: config.freeReveals,
// // // // // // // // //     revealedCells: parse(row.revealed_json),
// // // // // // // // //   };
// // // // // // // // // }

// // // // // // // // // async function findRoom(roomCode) {
// // // // // // // // //   const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
// // // // // // // // //   return rooms[0] || null;
// // // // // // // // // }

// // // // // // // // // /* ---------- routes ---------- */

// // // // // // // // // module.exports = function registerRoundRoutes(router) {
// // // // // // // // //   // START GAME - idempotent: first call creates round 1, everyone else gets the same round
// // // // // // // // //   router.post("/rooms/:roomCode/start", async (req, res) => {
// // // // // // // // //     try {
// // // // // // // // //       const room = await findRoom(req.params.roomCode);
// // // // // // // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // // // // // // //       const config = getConfig(room.difficulty);

// // // // // // // // //       const [countRows] = await db.query(
// // // // // // // // //         `SELECT COUNT(*) AS c FROM word_scramble_players WHERE room_id = ?`,
// // // // // // // // //         [room.id]
// // // // // // // // //       );
// // // // // // // // //       if (countRows[0].c < MIN_PLAYERS_TO_START) {
// // // // // // // // //         return res.status(409).json({ error: `Need at least ${MIN_PLAYERS_TO_START} players to start` });
// // // // // // // // //       }

// // // // // // // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // // // // // // //         const [fresh] = await conn.query(`SELECT status FROM word_scramble_rooms WHERE id = ?`, [room.id]);
// // // // // // // // //         const existing = await latestRound(conn, room.id);
// // // // // // // // //         if (fresh[0]?.status === "in_progress" && existing) return existing; // already started

// // // // // // // // //         await conn.query(`UPDATE word_scramble_rooms SET status = 'in_progress' WHERE id = ?`, [room.id]);
// // // // // // // // //         return createRound(conn, room, 1, config, []);
// // // // // // // // //       });

// // // // // // // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error("Start game error:", err);
// // // // // // // // //       return res.status(500).json({ error: "Failed to start game" });
// // // // // // // // //     }
// // // // // // // // //   });

// // // // // // // // //   // NEXT ROUND - body: { fromRoundId }  (the round the caller just finished)
// // // // // // // // //   // If somebody else already advanced, the caller just receives that round.
// // // // // // // // //   router.post("/rooms/:roomCode/next-round", async (req, res) => {
// // // // // // // // //     try {
// // // // // // // // //       const { fromRoundId } = req.body || {};
// // // // // // // // //       const room = await findRoom(req.params.roomCode);
// // // // // // // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // // // // // // //       const config = getConfig(room.difficulty);

// // // // // // // // //       const outcome = await withRoomLock(room.id, async (conn) => {
// // // // // // // // //         const latest = await latestRound(conn, room.id);

// // // // // // // // //         if (latest && fromRoundId && String(latest.id) !== String(fromRoundId)) {
// // // // // // // // //           return { finished: false, round: latest }; // already advanced by another player
// // // // // // // // //         }

// // // // // // // // //         const nextNumber = (latest ? latest.round_number : 0) + 1;
// // // // // // // // //         if (nextNumber > config.rounds) {
// // // // // // // // //           await conn.query(`UPDATE word_scramble_rooms SET status = 'finished' WHERE id = ?`, [room.id]);
// // // // // // // // //           return { finished: true };
// // // // // // // // //         }

// // // // // // // // //         const [prev] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // // // // // // //         const round = await createRound(conn, room, nextNumber, config, prev.map((r) => r.word));
// // // // // // // // //         return { finished: false, round };
// // // // // // // // //       });

// // // // // // // // //       if (outcome.finished) return res.status(200).json({ success: true, finished: true });
// // // // // // // // //       return res.status(200).json({ success: true, finished: false, round: roundPayload(outcome.round, config) });
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error("Next round error:", err);
// // // // // // // // //       return res.status(500).json({ error: "Failed to advance round" });
// // // // // // // // //     }
// // // // // // // // //   });

// // // // // // // // //   // RETRY - same round number, ONE new puzzle shared by everyone who retries
// // // // // // // // //   router.post("/rounds/:roundId/retry", async (req, res) => {
// // // // // // // // //     try {
// // // // // // // // //       const { roundId } = req.params;
// // // // // // // // //       const { roomCode } = req.body || {};
// // // // // // // // //       if (!roomCode) return res.status(400).json({ error: "roomCode is required" });

// // // // // // // // //       const [roundRows] = await db.query(`SELECT * FROM word_scramble_rounds WHERE id = ? LIMIT 1`, [roundId]);
// // // // // // // // //       if (roundRows.length === 0) return res.status(404).json({ error: "Round not found" });
// // // // // // // // //       const current = roundRows[0];

// // // // // // // // //       const [roomRows] = await db.query(
// // // // // // // // //         `SELECT * FROM word_scramble_rooms WHERE id = ? AND room_code = ? LIMIT 1`,
// // // // // // // // //         [current.room_id, roomCode]
// // // // // // // // //       );
// // // // // // // // //       if (roomRows.length === 0) return res.status(404).json({ error: "Room not found" });
// // // // // // // // //       const room = roomRows[0];
// // // // // // // // //       const config = getConfig(room.difficulty);

// // // // // // // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // // // // // // //         const latest = await latestRound(conn, room.id);
// // // // // // // // //         if (latest && String(latest.id) !== String(current.id)) return latest; // someone already retried/advanced

// // // // // // // // //         const [used] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // // // // // // //         return createRound(conn, room, current.round_number, config, used.map((r) => r.word));
// // // // // // // // //       });

// // // // // // // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error("Retry round error:", err);
// // // // // // // // //       return res.status(500).json({ error: "Failed to load new question", details: err.message });
// // // // // // // // //     }
// // // // // // // // //   });
// // // // // // // // // };
// // // // // // // // const db = require("../db");
// // // // // // // // const { pickRandomWord } = require("../utils/words");
// // // // // // // // const { WORD_SCRAMBLE_DIFFICULTY_CONFIG } = require("../config/wordScrambleDifficulty");
// // // // // // // // const { buildClue } = require("../utils/clue");
// // // // // // // // const { MIN_PLAYERS_TO_START } = require("../config/wordScrambleRoom");
// // // // // // // // const { findSubWords, layoutCrossword } = require("../utils/crosswordGenerator");

// // // // // // // // let DICTIONARY = [];
// // // // // // // // try {
// // // // // // // //   DICTIONARY = require("../data/wordlist.json");
// // // // // // // // } catch (e) {
// // // // // // // //   console.warn("[wordscramble] backend/src/data/wordlist.json missing - crossword rounds disabled");
// // // // // // // // }

// // // // // // // // const MIN_GRID_WORDS = 4; // a round must have at least this many crossing words
// // // // // // // // const MAX_GRID_WORDS = 7;

// // // // // // // // const parse = (v, fallback = []) => {
// // // // // // // //   try {
// // // // // // // //     return typeof v === "string" ? JSON.parse(v) : v ?? fallback;
// // // // // // // //   } catch (e) {
// // // // // // // //     return fallback;
// // // // // // // //   }
// // // // // // // // };

// // // // // // // // const getConfig = (difficulty) =>
// // // // // // // //   WORD_SCRAMBLE_DIFFICULTY_CONFIG[difficulty] || WORD_SCRAMBLE_DIFFICULTY_CONFIG.easy;

// // // // // // // // /* ---------- puzzle building ---------- */

// // // // // // // // function wordCells(slot) {
// // // // // // // //   const cells = [];
// // // // // // // //   for (let k = 0; k < slot.word.length; k++) {
// // // // // // // //     cells.push({
// // // // // // // //       row: slot.direction === "across" ? slot.row : slot.row + k,
// // // // // // // //       col: slot.direction === "across" ? slot.col + k : slot.col,
// // // // // // // //     });
// // // // // // // //   }
// // // // // // // //   return cells;
// // // // // // // // }

// // // // // // // // // same starter letters for every player: picked once, stored in revealed_json
// // // // // // // // function pickInitialReveals(words, count) {
// // // // // // // //   if (!count || count <= 0) return [];
// // // // // // // //   const all = [];
// // // // // // // //   words.forEach((w) => wordCells(w).forEach((c) => all.push(c)));
// // // // // // // //   const uniq = [...new Map(all.map((c) => [`${c.row}-${c.col}`, c])).values()];
// // // // // // // //   return uniq.sort(() => Math.random() - 0.5).slice(0, Math.min(count, uniq.length));
// // // // // // // // }

// // // // // // // // function buildRoundWords(baseWord) {
// // // // // // // //   const root = String(baseWord).toLowerCase();
// // // // // // // //   const letters = root.toUpperCase().split("");
// // // // // // // //   const all = findSubWords(root.split(""), DICTIONARY);
// // // // // // // //   const slots = all.length ? layoutCrossword(all, root, MAX_GRID_WORDS) : [];
// // // // // // // //   const words = (slots.length ? slots : [{ word: root, row: 0, col: 0, direction: "across" }]).map((s) => ({
// // // // // // // //     word: s.word.toUpperCase(),
// // // // // // // //     row: s.row,
// // // // // // // //     col: s.col,
// // // // // // // //     direction: s.direction,
// // // // // // // //   }));
// // // // // // // //   return { letters, words };
// // // // // // // // }

// // // // // // // // // keep drawing words from the word bank until one gives a proper crossword
// // // // // // // // async function pickPlayableWord(difficulty, usedWords = []) {
// // // // // // // //   const tried = [...usedWords];
// // // // // // // //   let best = null;
// // // // // // // //   for (let i = 0; i < 15; i++) {
// // // // // // // //     const picked = await pickRandomWord(difficulty, tried);
// // // // // // // //     tried.push(picked.word);
// // // // // // // //     const built = buildRoundWords(picked.word);
// // // // // // // //     if (!best || built.words.length > best.built.words.length) best = { picked, built };
// // // // // // // //     if (built.words.length >= MIN_GRID_WORDS) break;
// // // // // // // //   }
// // // // // // // //   return best;
// // // // // // // // }

// // // // // // // // /* ---------- DB helpers ---------- */

// // // // // // // // // Serialises everything that creates rounds for ONE room, so two players hitting
// // // // // // // // // the endpoint at the same moment can never create two different rounds.
// // // // // // // // async function withRoomLock(roomId, work) {
// // // // // // // //   const conn = await db.getConnection();
// // // // // // // //   try {
// // // // // // // //     await conn.beginTransaction();
// // // // // // // //     await conn.query(`SELECT id FROM word_scramble_rooms WHERE id = ? FOR UPDATE`, [roomId]);
// // // // // // // //     const result = await work(conn);
// // // // // // // //     await conn.commit();
// // // // // // // //     return result;
// // // // // // // //   } catch (err) {
// // // // // // // //     await conn.rollback();
// // // // // // // //     throw err;
// // // // // // // //   } finally {
// // // // // // // //     conn.release();
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // async function latestRound(conn, roomId) {
// // // // // // // //   const [rows] = await conn.query(
// // // // // // // //     `SELECT * FROM word_scramble_rounds WHERE room_id = ? ORDER BY id DESC LIMIT 1`,
// // // // // // // //     [roomId]
// // // // // // // //   );
// // // // // // // //   return rows[0] || null;
// // // // // // // // }

// // // // // // // // async function createRound(conn, room, roundNumber, config, usedWords) {
// // // // // // // //   const { picked, built } = await pickPlayableWord(room.difficulty, usedWords);
// // // // // // // //   const revealed = pickInitialReveals(built.words, config.freeReveals);

// // // // // // // //   const [result] = await conn.query(
// // // // // // // //     `INSERT INTO word_scramble_rounds
// // // // // // // //        (room_id, round_number, word, clue, scrambled, time_limit_sec, letters_json, words_json, revealed_json)
// // // // // // // //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// // // // // // // //     [
// // // // // // // //       room.id,
// // // // // // // //       roundNumber,
// // // // // // // //       picked.word,
// // // // // // // //       picked.clue,
// // // // // // // //       picked.scrambled,
// // // // // // // //       config.timeLimitSec,
// // // // // // // //       JSON.stringify(built.letters),
// // // // // // // //       JSON.stringify(built.words),
// // // // // // // //       JSON.stringify(revealed),
// // // // // // // //     ]
// // // // // // // //   );
// // // // // // // //   const [rows] = await conn.query(`SELECT * FROM word_scramble_rounds WHERE id = ?`, [result.insertId]);
// // // // // // // //   return rows[0];
// // // // // // // // }

// // // // // // // // // One place that turns a DB row into the JSON the app expects (same for every player)
// // // // // // // // function roundPayload(row, config) {
// // // // // // // //   const words = parse(row.words_json);
// // // // // // // //   return {
// // // // // // // //     id: row.id,
// // // // // // // //     roundNumber: row.round_number,
// // // // // // // //     totalRounds: config.rounds,
// // // // // // // //     scrambled: row.scrambled,
// // // // // // // //     letters: parse(row.letters_json),
// // // // // // // //     words,
// // // // // // // //     totalWords: words.length,
// // // // // // // //     clue: buildClue(row.clue, config.clueType),
// // // // // // // //     clueType: config.clueType,
// // // // // // // //     timeLimitSec: row.time_limit_sec,
// // // // // // // //     lives: config.lives,
// // // // // // // //     freeReveals: config.freeReveals,
// // // // // // // //     revealedCells: parse(row.revealed_json),
// // // // // // // //   };
// // // // // // // // }

// // // // // // // // async function findRoom(roomCode) {
// // // // // // // //   const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
// // // // // // // //   return rooms[0] || null;
// // // // // // // // }

// // // // // // // // /* ---------- routes ---------- */

// // // // // // // // module.exports = function registerRoundRoutes(router) {
// // // // // // // //   // START GAME - idempotent: first call creates round 1, everyone else gets the same round
// // // // // // // //   router.post("/rooms/:roomCode/start", async (req, res) => {
// // // // // // // //     try {
// // // // // // // //       const room = await findRoom(req.params.roomCode);
// // // // // // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // // // // // //       const config = getConfig(room.difficulty);

// // // // // // // //       const [countRows] = await db.query(
// // // // // // // //         `SELECT COUNT(*) AS c FROM word_scramble_players WHERE room_id = ?`,
// // // // // // // //         [room.id]
// // // // // // // //       );
// // // // // // // //       if (countRows[0].c < MIN_PLAYERS_TO_START) {
// // // // // // // //         return res.status(409).json({ error: `Need at least ${MIN_PLAYERS_TO_START} players to start` });
// // // // // // // //       }

// // // // // // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // // // // // //         const [fresh] = await conn.query(`SELECT status FROM word_scramble_rooms WHERE id = ?`, [room.id]);
// // // // // // // //         const existing = await latestRound(conn, room.id);
// // // // // // // //         if (fresh[0]?.status === "in_progress" && existing) return existing; // already started

// // // // // // // //         await conn.query(`UPDATE word_scramble_rooms SET status = 'in_progress' WHERE id = ?`, [room.id]);
// // // // // // // //         return createRound(conn, room, 1, config, []);
// // // // // // // //       });

// // // // // // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // // // // // //     } catch (err) {
// // // // // // // //       console.error("Start game error:", err);
// // // // // // // //       return res.status(500).json({ error: "Failed to start game" });
// // // // // // // //     }
// // // // // // // //   });

// // // // // // // //   // NEXT ROUND - body: { fromRoundId }  (the round the caller just finished)
// // // // // // // //   // If somebody else already advanced, the caller just receives that round.
// // // // // // // //   router.post("/rooms/:roomCode/next-round", async (req, res) => {
// // // // // // // //     try {
// // // // // // // //       const { fromRoundId } = req.body || {};
// // // // // // // //       const room = await findRoom(req.params.roomCode);
// // // // // // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // // // // // //       const config = getConfig(room.difficulty);

// // // // // // // //       const outcome = await withRoomLock(room.id, async (conn) => {
// // // // // // // //         const latest = await latestRound(conn, room.id);

// // // // // // // //         if (latest && fromRoundId && String(latest.id) !== String(fromRoundId)) {
// // // // // // // //           return { finished: false, round: latest }; // already advanced by another player
// // // // // // // //         }

// // // // // // // //         const nextNumber = (latest ? latest.round_number : 0) + 1;
// // // // // // // //         if (nextNumber > config.rounds) {
// // // // // // // //           await conn.query(`UPDATE word_scramble_rooms SET status = 'finished' WHERE id = ?`, [room.id]);
// // // // // // // //           return { finished: true };
// // // // // // // //         }

// // // // // // // //         const [prev] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // // // // // //         const round = await createRound(conn, room, nextNumber, config, prev.map((r) => r.word));
// // // // // // // //         return { finished: false, round };
// // // // // // // //       });

// // // // // // // //       if (outcome.finished) return res.status(200).json({ success: true, finished: true });
// // // // // // // //       return res.status(200).json({ success: true, finished: false, round: roundPayload(outcome.round, config) });
// // // // // // // //     } catch (err) {
// // // // // // // //       console.error("Next round error:", err);
// // // // // // // //       return res.status(500).json({ error: "Failed to advance round" });
// // // // // // // //     }
// // // // // // // //   });

// // // // // // // //   // RETRY - same round number, ONE new puzzle shared by everyone who retries
// // // // // // // //   router.post("/rounds/:roundId/retry", async (req, res) => {
// // // // // // // //     try {
// // // // // // // //       const { roundId } = req.params;
// // // // // // // //       const { roomCode } = req.body || {};
// // // // // // // //       if (!roomCode) return res.status(400).json({ error: "roomCode is required" });

// // // // // // // //       const [roundRows] = await db.query(`SELECT * FROM word_scramble_rounds WHERE id = ? LIMIT 1`, [roundId]);
// // // // // // // //       if (roundRows.length === 0) return res.status(404).json({ error: "Round not found" });
// // // // // // // //       const current = roundRows[0];

// // // // // // // //       const [roomRows] = await db.query(
// // // // // // // //         `SELECT * FROM word_scramble_rooms WHERE id = ? AND room_code = ? LIMIT 1`,
// // // // // // // //         [current.room_id, roomCode]
// // // // // // // //       );
// // // // // // // //       if (roomRows.length === 0) return res.status(404).json({ error: "Room not found" });
// // // // // // // //       const room = roomRows[0];
// // // // // // // //       const config = getConfig(room.difficulty);

// // // // // // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // // // // // //         const latest = await latestRound(conn, room.id);
// // // // // // // //         if (latest && String(latest.id) !== String(current.id)) return latest; // someone already retried/advanced

// // // // // // // //         const [used] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // // // // // //         return createRound(conn, room, current.round_number, config, used.map((r) => r.word));
// // // // // // // //       });

// // // // // // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // // // // // //     } catch (err) {
// // // // // // // //       console.error("Retry round error:", err);
// // // // // // // //       return res.status(500).json({ error: "Failed to load new question", details: err.message });
// // // // // // // //     }
// // // // // // // //   });
// // // // // // // // };
// // // // // // // const db = require("../db");
// // // // // // // const { pickRandomWord } = require("../utils/words");
// // // // // // // const { WORD_SCRAMBLE_DIFFICULTY_CONFIG } = require("../config/wordScrambleDifficulty");
// // // // // // // const { buildClue } = require("../utils/clue");
// // // // // // // const { MIN_PLAYERS_TO_START } = require("../config/wordScrambleRoom");
// // // // // // // const { findSubWords, layoutCrossword } = require("../utils/crosswordGenerator");
// // // // // // // // NEW: level -> word-count mapping, shared naming with utils/levelConfig.ts on the frontend
// // // // // // // const { getWordCountForLevel } = require("../utils/levelConfig");

// // // // // // // let DICTIONARY = [];
// // // // // // // try {
// // // // // // //   DICTIONARY = require("../data/wordlist.json");
// // // // // // // } catch (e) {
// // // // // // //   console.warn("[wordscramble] backend/src/data/wordlist.json missing - crossword rounds disabled");
// // // // // // // }

// // // // // // // // CHANGED: these are now just fallback/absolute bounds. The real per-round
// // // // // // // // target word count comes from getWordCountForLevel(roundNumber) below.
// // // // // // // const MIN_GRID_WORDS = 2; // never go below this even for very early levels
// // // // // // // const MAX_GRID_WORDS = 7; // safety ceiling if a level ever asks for more than this

// // // // // // // const parse = (v, fallback = []) => {
// // // // // // //   try {
// // // // // // //     return typeof v === "string" ? JSON.parse(v) : v ?? fallback;
// // // // // // //   } catch (e) {
// // // // // // //     return fallback;
// // // // // // //   }
// // // // // // // };

// // // // // // // const getConfig = (difficulty) =>
// // // // // // //   WORD_SCRAMBLE_DIFFICULTY_CONFIG[difficulty] || WORD_SCRAMBLE_DIFFICULTY_CONFIG.easy;

// // // // // // // /* ---------- puzzle building ---------- */

// // // // // // // function wordCells(slot) {
// // // // // // //   const cells = [];
// // // // // // //   for (let k = 0; k < slot.word.length; k++) {
// // // // // // //     cells.push({
// // // // // // //       row: slot.direction === "across" ? slot.row : slot.row + k,
// // // // // // //       col: slot.direction === "across" ? slot.col + k : slot.col,
// // // // // // //     });
// // // // // // //   }
// // // // // // //   return cells;
// // // // // // // }

// // // // // // // // same starter letters for every player: picked once, stored in revealed_json
// // // // // // // function pickInitialReveals(words, count) {
// // // // // // //   if (!count || count <= 0) return [];
// // // // // // //   const all = [];
// // // // // // //   words.forEach((w) => wordCells(w).forEach((c) => all.push(c)));
// // // // // // //   const uniq = [...new Map(all.map((c) => [`${c.row}-${c.col}`, c])).values()];
// // // // // // //   return uniq.sort(() => Math.random() - 0.5).slice(0, Math.min(count, uniq.length));
// // // // // // // }

// // // // // // // // CHANGED: takes maxWords now instead of always using the MAX_GRID_WORDS constant
// // // // // // // function buildRoundWords(baseWord, maxWords) {
// // // // // // //   const root = String(baseWord).toLowerCase();
// // // // // // //   const letters = root.toUpperCase().split("");
// // // // // // //   const all = findSubWords(root.split(""), DICTIONARY);
// // // // // // //   const slots = all.length ? layoutCrossword(all, root, maxWords) : [];
// // // // // // //   const words = (slots.length ? slots : [{ word: root, row: 0, col: 0, direction: "across" }]).map((s) => ({
// // // // // // //     word: s.word.toUpperCase(),
// // // // // // //     row: s.row,
// // // // // // //     col: s.col,
// // // // // // //     direction: s.direction,
// // // // // // //   }));
// // // // // // //   return { letters, words };
// // // // // // // }

// // // // // // // // CHANGED: keep drawing words from the word bank until one gives a proper
// // // // // // // // crossword with at least `wordCount` words (was a fixed MIN_GRID_WORDS
// // // // // // // // check before; now driven by the level's target word count).
// // // // // // // async function pickPlayableWord(difficulty, usedWords = [], wordCount = MIN_GRID_WORDS) {
// // // // // // //   const tried = [...usedWords];
// // // // // // //   let best = null;
// // // // // // //   // clamp so a bad level config can never ask for something impossible/huge
// // // // // // //   const targetWords = Math.min(Math.max(wordCount, MIN_GRID_WORDS), MAX_GRID_WORDS);

// // // // // // //   for (let i = 0; i < 15; i++) {
// // // // // // //     const picked = await pickRandomWord(difficulty, tried);
// // // // // // //     tried.push(picked.word);
// // // // // // //     const built = buildRoundWords(picked.word, targetWords);
// // // // // // //     if (!best || built.words.length > best.built.words.length) best = { picked, built };
// // // // // // //     if (best.built.words.length >= targetWords) break;
// // // // // // //   }
// // // // // // //   return best;
// // // // // // // }

// // // // // // // /* ---------- DB helpers ---------- */

// // // // // // // // Serialises everything that creates rounds for ONE room, so two players hitting
// // // // // // // // the endpoint at the same moment can never create two different rounds.
// // // // // // // async function withRoomLock(roomId, work) {
// // // // // // //   const conn = await db.getConnection();
// // // // // // //   try {
// // // // // // //     await conn.beginTransaction();
// // // // // // //     await conn.query(`SELECT id FROM word_scramble_rooms WHERE id = ? FOR UPDATE`, [roomId]);
// // // // // // //     const result = await work(conn);
// // // // // // //     await conn.commit();
// // // // // // //     return result;
// // // // // // //   } catch (err) {
// // // // // // //     await conn.rollback();
// // // // // // //     throw err;
// // // // // // //   } finally {
// // // // // // //     conn.release();
// // // // // // //   }
// // // // // // // }

// // // // // // // async function latestRound(conn, roomId) {
// // // // // // //   const [rows] = await conn.query(
// // // // // // //     `SELECT * FROM word_scramble_rounds WHERE room_id = ? ORDER BY id DESC LIMIT 1`,
// // // // // // //     [roomId]
// // // // // // //   );
// // // // // // //   return rows[0] || null;
// // // // // // // }

// // // // // // // // CHANGED: computes the word count for this specific round number/level and
// // // // // // // // passes it through to pickPlayableWord, so early levels get simple 2-word
// // // // // // // // crosswords and later levels scale up to 5 words (see levelConfig.js).
// // // // // // // async function createRound(conn, room, roundNumber, config, usedWords) {
// // // // // // //   const wordCount = getWordCountForLevel(roundNumber);
// // // // // // //   const { picked, built } = await pickPlayableWord(room.difficulty, usedWords, wordCount);
// // // // // // //   const revealed = pickInitialReveals(built.words, config.freeReveals);

// // // // // // //   const [result] = await conn.query(
// // // // // // //     `INSERT INTO word_scramble_rounds
// // // // // // //        (room_id, round_number, word, clue, scrambled, time_limit_sec, letters_json, words_json, revealed_json)
// // // // // // //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// // // // // // //     [
// // // // // // //       room.id,
// // // // // // //       roundNumber,
// // // // // // //       picked.word,
// // // // // // //       picked.clue,
// // // // // // //       picked.scrambled,
// // // // // // //       config.timeLimitSec,
// // // // // // //       JSON.stringify(built.letters),
// // // // // // //       JSON.stringify(built.words),
// // // // // // //       JSON.stringify(revealed),
// // // // // // //     ]
// // // // // // //   );
// // // // // // //   const [rows] = await conn.query(`SELECT * FROM word_scramble_rounds WHERE id = ?`, [result.insertId]);
// // // // // // //   return rows[0];
// // // // // // // }

// // // // // // // // One place that turns a DB row into the JSON the app expects (same for every player)
// // // // // // // function roundPayload(row, config) {
// // // // // // //   const words = parse(row.words_json);
// // // // // // //   return {
// // // // // // //     id: row.id,
// // // // // // //     roundNumber: row.round_number,
// // // // // // //     totalRounds: config.rounds,
// // // // // // //     scrambled: row.scrambled,
// // // // // // //     letters: parse(row.letters_json),
// // // // // // //     words,
// // // // // // //     totalWords: words.length,
// // // // // // //     clue: buildClue(row.clue, config.clueType),
// // // // // // //     clueType: config.clueType,
// // // // // // //     timeLimitSec: row.time_limit_sec,
// // // // // // //     lives: config.lives,
// // // // // // //     freeReveals: config.freeReveals,
// // // // // // //     revealedCells: parse(row.revealed_json),
// // // // // // //   };
// // // // // // // }

// // // // // // // async function findRoom(roomCode) {
// // // // // // //   const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
// // // // // // //   return rooms[0] || null;
// // // // // // // }

// // // // // // // /* ---------- routes ---------- */

// // // // // // // module.exports = function registerRoundRoutes(router) {
// // // // // // //   // START GAME - idempotent: first call creates round 1, everyone else gets the same round
// // // // // // //   router.post("/rooms/:roomCode/start", async (req, res) => {
// // // // // // //     try {
// // // // // // //       const room = await findRoom(req.params.roomCode);
// // // // // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // // // // //       const config = getConfig(room.difficulty);

// // // // // // //       const [countRows] = await db.query(
// // // // // // //         `SELECT COUNT(*) AS c FROM word_scramble_players WHERE room_id = ?`,
// // // // // // //         [room.id]
// // // // // // //       );
// // // // // // //       if (countRows[0].c < MIN_PLAYERS_TO_START) {
// // // // // // //         return res.status(409).json({ error: `Need at least ${MIN_PLAYERS_TO_START} players to start` });
// // // // // // //       }

// // // // // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // // // // //         const [fresh] = await conn.query(`SELECT status FROM word_scramble_rooms WHERE id = ?`, [room.id]);
// // // // // // //         const existing = await latestRound(conn, room.id);
// // // // // // //         if (fresh[0]?.status === "in_progress" && existing) return existing; // already started

// // // // // // //         await conn.query(`UPDATE word_scramble_rooms SET status = 'in_progress' WHERE id = ?`, [room.id]);
// // // // // // //         return createRound(conn, room, 1, config, []);
// // // // // // //       });

// // // // // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // // // // //     } catch (err) {
// // // // // // //       console.error("Start game error:", err);
// // // // // // //       return res.status(500).json({ error: "Failed to start game" });
// // // // // // //     }
// // // // // // //   });

// // // // // // //   // NEXT ROUND - body: { fromRoundId }  (the round the caller just finished)
// // // // // // //   // If somebody else already advanced, the caller just receives that round.
// // // // // // //   router.post("/rooms/:roomCode/next-round", async (req, res) => {
// // // // // // //     try {
// // // // // // //       const { fromRoundId } = req.body || {};
// // // // // // //       const room = await findRoom(req.params.roomCode);
// // // // // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // // // // //       const config = getConfig(room.difficulty);

// // // // // // //       const outcome = await withRoomLock(room.id, async (conn) => {
// // // // // // //         const latest = await latestRound(conn, room.id);

// // // // // // //         if (latest && fromRoundId && String(latest.id) !== String(fromRoundId)) {
// // // // // // //           return { finished: false, round: latest }; // already advanced by another player
// // // // // // //         }

// // // // // // //         const nextNumber = (latest ? latest.round_number : 0) + 1;
// // // // // // //         if (nextNumber > config.rounds) {
// // // // // // //           await conn.query(`UPDATE word_scramble_rooms SET status = 'finished' WHERE id = ?`, [room.id]);
// // // // // // //           return { finished: true };
// // // // // // //         }

// // // // // // //         const [prev] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // // // // //         const round = await createRound(conn, room, nextNumber, config, prev.map((r) => r.word));
// // // // // // //         return { finished: false, round };
// // // // // // //       });

// // // // // // //       if (outcome.finished) return res.status(200).json({ success: true, finished: true });
// // // // // // //       return res.status(200).json({ success: true, finished: false, round: roundPayload(outcome.round, config) });
// // // // // // //     } catch (err) {
// // // // // // //       console.error("Next round error:", err);
// // // // // // //       return res.status(500).json({ error: "Failed to advance round" });
// // // // // // //     }
// // // // // // //   });

// // // // // // //   // RETRY - same round number, ONE new puzzle shared by everyone who retries
// // // // // // //   router.post("/rounds/:roundId/retry", async (req, res) => {
// // // // // // //     try {
// // // // // // //       const { roundId } = req.params;
// // // // // // //       const { roomCode } = req.body || {};
// // // // // // //       if (!roomCode) return res.status(400).json({ error: "roomCode is required" });

// // // // // // //       const [roundRows] = await db.query(`SELECT * FROM word_scramble_rounds WHERE id = ? LIMIT 1`, [roundId]);
// // // // // // //       if (roundRows.length === 0) return res.status(404).json({ error: "Round not found" });
// // // // // // //       const current = roundRows[0];

// // // // // // //       const [roomRows] = await db.query(
// // // // // // //         `SELECT * FROM word_scramble_rooms WHERE id = ? AND room_code = ? LIMIT 1`,
// // // // // // //         [current.room_id, roomCode]
// // // // // // //       );
// // // // // // //       if (roomRows.length === 0) return res.status(404).json({ error: "Room not found" });
// // // // // // //       const room = roomRows[0];
// // // // // // //       const config = getConfig(room.difficulty);

// // // // // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // // // // //         const latest = await latestRound(conn, room.id);
// // // // // // //         if (latest && String(latest.id) !== String(current.id)) return latest; // someone already retried/advanced

// // // // // // //         const [used] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // // // // //         return createRound(conn, room, current.round_number, config, used.map((r) => r.word));
// // // // // // //       });

// // // // // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // // // // //     } catch (err) {
// // // // // // //       console.error("Retry round error:", err);
// // // // // // //       return res.status(500).json({ error: "Failed to load new question", details: err.message });
// // // // // // //     }
// // // // // // //   });
// // // // // // // };
// // // // // // const db = require("../db");
// // // // // // const { pickRandomWord } = require("../utils/words");
// // // // // // const { WORD_SCRAMBLE_DIFFICULTY_CONFIG } = require("../config/wordScrambleDifficulty");
// // // // // // const { buildClue } = require("../utils/clue");
// // // // // // const { MIN_PLAYERS_TO_START } = require("../config/wordScrambleRoom");
// // // // // // const { findSubWords, layoutCrossword } = require("../utils/crosswordGenerator");
// // // // // // const { getWordCountForLevel } = require("../utils/levelConfig");

// // // // // // let DICTIONARY = [];
// // // // // // try {
// // // // // //   DICTIONARY = require("../data/wordlist.json");
// // // // // // } catch (e) {
// // // // // //   console.warn("[wordscramble] backend/src/data/wordlist.json missing - crossword rounds disabled");
// // // // // // }

// // // // // // const MIN_GRID_WORDS = 2;
// // // // // // const MAX_GRID_WORDS = 7;

// // // // // // // NEW: highest level a player can reach when they keep going past the normal set
// // // // // // // (after using a Skip Round on the "Great Job" popup).
// // // // // // const MAX_LEVEL = 50;

// // // // // // const parse = (v, fallback = []) => {
// // // // // //   try {
// // // // // //     return typeof v === "string" ? JSON.parse(v) : v ?? fallback;
// // // // // //   } catch (e) {
// // // // // //     return fallback;
// // // // // //   }
// // // // // // };

// // // // // // const getConfig = (difficulty) =>
// // // // // //   WORD_SCRAMBLE_DIFFICULTY_CONFIG[difficulty] || WORD_SCRAMBLE_DIFFICULTY_CONFIG.easy;

// // // // // // /* ---------- puzzle building ---------- */

// // // // // // function wordCells(slot) {
// // // // // //   const cells = [];
// // // // // //   for (let k = 0; k < slot.word.length; k++) {
// // // // // //     cells.push({
// // // // // //       row: slot.direction === "across" ? slot.row : slot.row + k,
// // // // // //       col: slot.direction === "across" ? slot.col + k : slot.col,
// // // // // //     });
// // // // // //   }
// // // // // //   return cells;
// // // // // // }

// // // // // // function pickInitialReveals(words, count) {
// // // // // //   if (!count || count <= 0) return [];
// // // // // //   const all = [];
// // // // // //   words.forEach((w) => wordCells(w).forEach((c) => all.push(c)));
// // // // // //   const uniq = [...new Map(all.map((c) => [`${c.row}-${c.col}`, c])).values()];
// // // // // //   return uniq.sort(() => Math.random() - 0.5).slice(0, Math.min(count, uniq.length));
// // // // // // }

// // // // // // function buildRoundWords(baseWord, maxWords) {
// // // // // //   const root = String(baseWord).toLowerCase();
// // // // // //   const letters = root.toUpperCase().split("");
// // // // // //   const all = findSubWords(root.split(""), DICTIONARY);
// // // // // //   const slots = all.length ? layoutCrossword(all, root, maxWords) : [];
// // // // // //   const words = (slots.length ? slots : [{ word: root, row: 0, col: 0, direction: "across" }]).map((s) => ({
// // // // // //     word: s.word.toUpperCase(),
// // // // // //     row: s.row,
// // // // // //     col: s.col,
// // // // // //     direction: s.direction,
// // // // // //   }));
// // // // // //   return { letters, words };
// // // // // // }

// // // // // // async function pickPlayableWord(difficulty, usedWords = [], wordCount = MIN_GRID_WORDS) {
// // // // // //   const tried = [...usedWords];
// // // // // //   let best = null;
// // // // // //   const targetWords = Math.min(Math.max(wordCount, MIN_GRID_WORDS), MAX_GRID_WORDS);

// // // // // //   for (let i = 0; i < 15; i++) {
// // // // // //     const picked = await pickRandomWord(difficulty, tried);
// // // // // //     tried.push(picked.word);
// // // // // //     const built = buildRoundWords(picked.word, targetWords);
// // // // // //     if (!best || built.words.length > best.built.words.length) best = { picked, built };
// // // // // //     if (best.built.words.length >= targetWords) break;
// // // // // //   }
// // // // // //   return best;
// // // // // // }

// // // // // // /* ---------- DB helpers ---------- */

// // // // // // async function withRoomLock(roomId, work) {
// // // // // //   const conn = await db.getConnection();
// // // // // //   try {
// // // // // //     await conn.beginTransaction();
// // // // // //     await conn.query(`SELECT id FROM word_scramble_rooms WHERE id = ? FOR UPDATE`, [roomId]);
// // // // // //     const result = await work(conn);
// // // // // //     await conn.commit();
// // // // // //     return result;
// // // // // //   } catch (err) {
// // // // // //     await conn.rollback();
// // // // // //     throw err;
// // // // // //   } finally {
// // // // // //     conn.release();
// // // // // //   }
// // // // // // }

// // // // // // async function latestRound(conn, roomId) {
// // // // // //   const [rows] = await conn.query(
// // // // // //     `SELECT * FROM word_scramble_rounds WHERE room_id = ? ORDER BY id DESC LIMIT 1`,
// // // // // //     [roomId]
// // // // // //   );
// // // // // //   return rows[0] || null;
// // // // // // }

// // // // // // /* ---------- NEW: per-player progress (keyed by player name) ---------- */

// // // // // // // Remember the furthest round every player in this room has reached.
// // // // // // async function recordProgress(conn, roomId, reachedRound) {
// // // // // //   await conn.query(
// // // // // //     `INSERT INTO ws_player_progress (player_name, next_round)
// // // // // //      SELECT player_name, ? FROM word_scramble_players WHERE room_id = ?
// // // // // //      ON DUPLICATE KEY UPDATE next_round = GREATEST(next_round, VALUES(next_round))`,
// // // // // //     [reachedRound, roomId]
// // // // // //   );
// // // // // // }

// // // // // // // A full set was finished -> everybody in the room starts again from round 1.
// // // // // // async function resetProgress(conn, roomId) {
// // // // // //   await conn.query(
// // // // // //     `UPDATE ws_player_progress pr
// // // // // //      JOIN word_scramble_players p ON p.player_name = pr.player_name
// // // // // //      SET pr.next_round = 1
// // // // // //      WHERE p.room_id = ?`,
// // // // // //     [roomId]
// // // // // //   );
// // // // // // }


// // // // // // async function startingRound(conn, roomId, config) {
// // // // // //   const [rows] = await conn.query(
// // // // // //     `SELECT MAX(pr.next_round) AS n
// // // // // //      FROM ws_player_progress pr
// // // // // //      JOIN word_scramble_players p ON p.player_name = pr.player_name
// // // // // //      WHERE p.room_id = ?`,
// // // // // //     [roomId]
// // // // // //   );
// // // // // //   let n = Number(rows[0]?.n) || 1;
// // // // // //   if (n === config.rounds + 1) n = 1;
// // // // // //   return Math.min(Math.max(n, 1), MAX_LEVEL);
// // // // // // }

// // // // // // async function createRound(conn, room, roundNumber, config, usedWords) {
// // // // // //   const wordCount = getWordCountForLevel(roundNumber);
// // // // // //   const { picked, built } = await pickPlayableWord(room.difficulty, usedWords, wordCount);
// // // // // //   const revealed = pickInitialReveals(built.words, config.freeReveals);

// // // // // //   const [result] = await conn.query(
// // // // // //     `INSERT INTO word_scramble_rounds
// // // // // //        (room_id, round_number, word, clue, scrambled, time_limit_sec, letters_json, words_json, revealed_json)
// // // // // //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// // // // // //     [
// // // // // //       room.id,
// // // // // //       roundNumber,
// // // // // //       picked.word,
// // // // // //       picked.clue,
// // // // // //       picked.scrambled,
// // // // // //       config.timeLimitSec,
// // // // // //       JSON.stringify(built.letters),
// // // // // //       JSON.stringify(built.words),
// // // // // //       JSON.stringify(revealed),
// // // // // //     ]
// // // // // //   );

// // // // // //   await recordProgress(conn, room.id, roundNumber); // NEW

// // // // // //   const [rows] = await conn.query(`SELECT * FROM word_scramble_rounds WHERE id = ?`, [result.insertId]);
// // // // // //   return rows[0];
// // // // // // }

// // // // // // function roundPayload(row, config) {
// // // // // //   const words = parse(row.words_json);
// // // // // //   return {
// // // // // //     id: row.id,
// // // // // //     roundNumber: row.round_number,
// // // // // //     totalRounds: config.rounds,
// // // // // //     scrambled: row.scrambled,
// // // // // //     letters: parse(row.letters_json),
// // // // // //     words,
// // // // // //     totalWords: words.length,
// // // // // //     clue: buildClue(row.clue, config.clueType),
// // // // // //     clueType: config.clueType,
// // // // // //     timeLimitSec: row.time_limit_sec,
// // // // // //     lives: config.lives,
// // // // // //     freeReveals: config.freeReveals,
// // // // // //     revealedCells: parse(row.revealed_json),
// // // // // //   };
// // // // // // }

// // // // // // async function findRoom(roomCode) {
// // // // // //   const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
// // // // // //   return rooms[0] || null;
// // // // // // }

// // // // // // /* ---------- routes ---------- */

// // // // // // module.exports = function registerRoundRoutes(router) {
// // // // // //   // NEW: which room is this player still playing? (works from any device, by player name)
// // // // // //   router.get("/active-room/:playerName", async (req, res) => {
// // // // // //     try {
// // // // // //       const [rows] = await db.query(
// // // // // //         `SELECT r.room_code
// // // // // //          FROM word_scramble_rooms r
// // // // // //          JOIN word_scramble_players p ON p.room_id = r.id
// // // // // //          WHERE p.player_name = ? AND r.status = 'in_progress'
// // // // // //          ORDER BY r.id DESC LIMIT 1`,
// // // // // //         [req.params.playerName]
// // // // // //       );
// // // // // //       return res.status(200).json({ success: true, roomCode: rows[0]?.room_code ?? null });
// // // // // //     } catch (err) {
// // // // // //       console.error("Active room error:", err);
// // // // // //       return res.status(500).json({ error: "Failed to look up active room" });
// // // // // //     }
// // // // // //   });

// // // // // //   // START GAME - idempotent. Brand-new game starts at the player's saved progress.
// // // // // //   router.post("/rooms/:roomCode/start", async (req, res) => {
// // // // // //     try {
// // // // // //       const room = await findRoom(req.params.roomCode);
// // // // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // // // //       const config = getConfig(room.difficulty);

// // // // // //       const [countRows] = await db.query(
// // // // // //         `SELECT COUNT(*) AS c FROM word_scramble_players WHERE room_id = ?`,
// // // // // //         [room.id]
// // // // // //       );
// // // // // //       if (countRows[0].c < MIN_PLAYERS_TO_START) {
// // // // // //         return res.status(409).json({ error: `Need at least ${MIN_PLAYERS_TO_START} players to start` });
// // // // // //       }

// // // // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // // // //         const [fresh] = await conn.query(`SELECT status FROM word_scramble_rooms WHERE id = ?`, [room.id]);
// // // // // //         const existing = await latestRound(conn, room.id);
// // // // // //         if (fresh[0]?.status === "in_progress" && existing) return existing; // already started -> same round

// // // // // //         await conn.query(`UPDATE word_scramble_rooms SET status = 'in_progress' WHERE id = ?`, [room.id]);
// // // // // //         const first = await startingRound(conn, room.id, config); // CHANGED: was always 1
// // // // // //         return createRound(conn, room, first, config, []);
// // // // // //       });

// // // // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // // // //     } catch (err) {
// // // // // //       console.error("Start game error:", err);
// // // // // //       return res.status(500).json({ error: "Failed to start game" });
// // // // // //     }
// // // // // //   });

// // // // // //   // NEXT ROUND - body: { fromRoundId, skip }
// // // // // //   //   skip = 1 -> the player used a Skip Round on the "Great Job" popup:
// // // // // //   //   round (N+1) is skipped and round (N+2) is created, even past the last round.
// // // // // //   router.post("/rooms/:roomCode/next-round", async (req, res) => {
// // // // // //     try {
// // // // // //       const { fromRoundId } = req.body || {};
// // // // // //       let skip = Math.min(Math.max(parseInt(req.body?.skip, 10) || 0, 0), 1);

// // // // // //       const room = await findRoom(req.params.roomCode);
// // // // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // // // //       const config = getConfig(room.difficulty);

// // // // // //       const outcome = await withRoomLock(room.id, async (conn) => {
// // // // // //         const latest = await latestRound(conn, room.id);

// // // // // //         if (latest && fromRoundId && String(latest.id) !== String(fromRoundId)) {
// // // // // //           return { finished: false, round: latest }; // already advanced by another player
// // // // // //         }

// // // // // //         // Only honour skip if a skip token was really spent for this round
// // // // // //         // (POST /api/skip/use with roundId "after-<roundId>").
// // // // // //         if (skip > 0) {
// // // // // //           const key = `after-${fromRoundId || (latest ? latest.id : "")}`;
// // // // // //           const [ok] = await conn.query(`SELECT 1 FROM ws_skipped_rounds WHERE round_id = ? LIMIT 1`, [key]);
// // // // // //           if (ok.length === 0) skip = 0;
// // // // // //         }

// // // // // //         const currentNumber = latest ? latest.round_number : 0;
// // // // // //         const extended = skip > 0 || currentNumber > config.rounds;
// // // // // //         const limit = extended ? MAX_LEVEL : config.rounds;
// // // // // //         const nextNumber = currentNumber + 1 + skip;

// // // // // //         if (nextNumber > limit) {
// // // // // //           await conn.query(`UPDATE word_scramble_rooms SET status = 'finished' WHERE id = ?`, [room.id]);
// // // // // //           await resetProgress(conn, room.id); // set finished -> next game starts at round 1
// // // // // //           return { finished: true };
// // // // // //         }

// // // // // //         const [prev] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // // // //         const round = await createRound(conn, room, nextNumber, config, prev.map((r) => r.word));
// // // // // //         return { finished: false, round };
// // // // // //       });

// // // // // //       if (outcome.finished) return res.status(200).json({ success: true, finished: true });
// // // // // //       return res.status(200).json({ success: true, finished: false, round: roundPayload(outcome.round, config) });
// // // // // //     } catch (err) {
// // // // // //       console.error("Next round error:", err);
// // // // // //       return res.status(500).json({ error: "Failed to advance round" });
// // // // // //     }
// // // // // //   });

// // // // // //   // RETRY - same round number, ONE new puzzle shared by everyone who retries
// // // // // //   router.post("/rounds/:roundId/retry", async (req, res) => {
// // // // // //     try {
// // // // // //       const { roundId } = req.params;
// // // // // //       const { roomCode } = req.body || {};
// // // // // //       if (!roomCode) return res.status(400).json({ error: "roomCode is required" });

// // // // // //       const [roundRows] = await db.query(`SELECT * FROM word_scramble_rounds WHERE id = ? LIMIT 1`, [roundId]);
// // // // // //       if (roundRows.length === 0) return res.status(404).json({ error: "Round not found" });
// // // // // //       const current = roundRows[0];

// // // // // //       const [roomRows] = await db.query(
// // // // // //         `SELECT * FROM word_scramble_rooms WHERE id = ? AND room_code = ? LIMIT 1`,
// // // // // //         [current.room_id, roomCode]
// // // // // //       );
// // // // // //       if (roomRows.length === 0) return res.status(404).json({ error: "Room not found" });
// // // // // //       const room = roomRows[0];
// // // // // //       const config = getConfig(room.difficulty);

// // // // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // // // //         const latest = await latestRound(conn, room.id);
// // // // // //         if (latest && String(latest.id) !== String(current.id)) return latest; // someone already retried/advanced

// // // // // //         const [used] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // // // //         return createRound(conn, room, current.round_number, config, used.map((r) => r.word));
// // // // // //       });

// // // // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // // // //     } catch (err) {
// // // // // //       console.error("Retry round error:", err);
// // // // // //       return res.status(500).json({ error: "Failed to load new question", details: err.message });
// // // // // //     }
// // // // // //   });
// // // // // // };
// // // // // const db = require("../db");
// // // // // const { pickRandomWord } = require("../utils/words");
// // // // // const { WORD_SCRAMBLE_DIFFICULTY_CONFIG } = require("../config/wordScrambleDifficulty");
// // // // // const { buildClue } = require("../utils/clue");
// // // // // const { MIN_PLAYERS_TO_START } = require("../config/wordScrambleRoom");
// // // // // const { findSubWords, layoutCrossword } = require("../utils/crosswordGenerator");
// // // // // const { getWordCountForLevel } = require("../utils/levelConfig");

// // // // // let DICTIONARY = [];
// // // // // try {
// // // // //   DICTIONARY = require("../data/wordlist.json");
// // // // // } catch (e) {
// // // // //   console.warn("[wordscramble] backend/src/data/wordlist.json missing - crossword rounds disabled");
// // // // // }

// // // // // const MIN_GRID_WORDS = 2;
// // // // // const MAX_GRID_WORDS = 7;

// // // // // // NEW: highest level a player can reach when they keep going past the normal set
// // // // // // (after using a Skip Round on the "Great Job" popup).
// // // // // const MAX_LEVEL = 50;

// // // // // // pickPlayableWord() tries up to 15 candidates, so we need at least this many
// // // // // // unseen words left in the pool. If fewer are left, the seen-list is reset.
// // // // // const MIN_FRESH_WORDS = 15;

// // // // // const parse = (v, fallback = []) => {
// // // // //   try {
// // // // //     return typeof v === "string" ? JSON.parse(v) : v ?? fallback;
// // // // //   } catch (e) {
// // // // //     return fallback;
// // // // //   }
// // // // // };

// // // // // const getConfig = (difficulty) =>
// // // // //   WORD_SCRAMBLE_DIFFICULTY_CONFIG[difficulty] || WORD_SCRAMBLE_DIFFICULTY_CONFIG.easy;

// // // // // /* ---------- NO-REPEAT QUESTIONS: words each player has already been asked ---------- */

// // // // // // Created automatically on start-up (same collation as the other word_scramble tables).
// // // // // db.query(
// // // // //   `CREATE TABLE IF NOT EXISTS ws_seen_words (
// // // // //      player_name VARCHAR(100) NOT NULL,
// // // // //      word        VARCHAR(50)  NOT NULL,
// // // // //      seen_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// // // // //      PRIMARY KEY (player_name, word)
// // // // //    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
// // // // // ).catch((err) => console.warn("[wordscramble] could not create ws_seen_words:", err.message));

// // // // // // Every word that ANY player in this room has already been asked.
// // // // // async function getSeenWords(conn, roomId) {
// // // // //   const [rows] = await conn.query(
// // // // //     `SELECT DISTINCT s.word
// // // // //      FROM ws_seen_words s
// // // // //      JOIN word_scramble_players p ON p.player_name = s.player_name
// // // // //      WHERE p.room_id = ?`,
// // // // //     [roomId]
// // // // //   );
// // // // //   return rows.map((r) => r.word);
// // // // // }

// // // // // // Remember the question for every player in the room.
// // // // // async function markWordSeen(conn, roomId, word) {
// // // // //   await conn.query(
// // // // //     `INSERT IGNORE INTO ws_seen_words (player_name, word)
// // // // //      SELECT player_name, ? FROM word_scramble_players WHERE room_id = ?`,
// // // // //     [word, roomId]
// // // // //   );
// // // // // }

// // // // // async function countAvailableWords(conn, difficulty, exclude) {
// // // // //   let sql = `SELECT COUNT(*) AS c FROM word_scramble_words WHERE difficulty = ?`;
// // // // //   const params = [difficulty];
// // // // //   if (exclude.length) {
// // // // //     sql += ` AND word NOT IN (?)`;
// // // // //     params.push(exclude);
// // // // //   }
// // // // //   const [rows] = await conn.query(sql, params);
// // // // //   return Number(rows[0]?.c) || 0;
// // // // // }

// // // // // // The whole pool of this difficulty has been used -> start a fresh cycle.
// // // // // async function resetSeenForDifficulty(conn, roomId, difficulty) {
// // // // //   await conn.query(
// // // // //     `DELETE s FROM ws_seen_words s
// // // // //      JOIN word_scramble_players p ON p.player_name = s.player_name
// // // // //      WHERE p.room_id = ?
// // // // //        AND s.word IN (SELECT word FROM word_scramble_words WHERE difficulty = ?)`,
// // // // //     [roomId, difficulty]
// // // // //   );
// // // // // }

// // // // // // Words that must NOT be picked: this room's earlier rounds + everything the players have seen.
// // // // // async function buildExcludeList(conn, room, usedWords) {
// // // // //   const inRoom = [...new Set(usedWords)];
// // // // //   const seen = await getSeenWords(conn, room.id);
// // // // //   let exclude = [...new Set([...inRoom, ...seen])];

// // // // //   const available = await countAvailableWords(conn, room.difficulty, exclude);
// // // // //   if (available < MIN_FRESH_WORDS) {
// // // // //     await resetSeenForDifficulty(conn, room.id, room.difficulty);
// // // // //     exclude = inRoom;
// // // // //   }
// // // // //   return exclude;
// // // // // }

// // // // // /* ---------- puzzle building ---------- */

// // // // // function wordCells(slot) {
// // // // //   const cells = [];
// // // // //   for (let k = 0; k < slot.word.length; k++) {
// // // // //     cells.push({
// // // // //       row: slot.direction === "across" ? slot.row : slot.row + k,
// // // // //       col: slot.direction === "across" ? slot.col + k : slot.col,
// // // // //     });
// // // // //   }
// // // // //   return cells;
// // // // // }

// // // // // function pickInitialReveals(words, count) {
// // // // //   if (!count || count <= 0) return [];
// // // // //   const all = [];
// // // // //   words.forEach((w) => wordCells(w).forEach((c) => all.push(c)));
// // // // //   const uniq = [...new Map(all.map((c) => [`${c.row}-${c.col}`, c])).values()];
// // // // //   return uniq.sort(() => Math.random() - 0.5).slice(0, Math.min(count, uniq.length));
// // // // // }

// // // // // function buildRoundWords(baseWord, maxWords) {
// // // // //   const root = String(baseWord).toLowerCase();
// // // // //   const letters = root.toUpperCase().split("");
// // // // //   const all = findSubWords(root.split(""), DICTIONARY);
// // // // //   const slots = all.length ? layoutCrossword(all, root, maxWords) : [];
// // // // //   const words = (slots.length ? slots : [{ word: root, row: 0, col: 0, direction: "across" }]).map((s) => ({
// // // // //     word: s.word.toUpperCase(),
// // // // //     row: s.row,
// // // // //     col: s.col,
// // // // //     direction: s.direction,
// // // // //   }));
// // // // //   return { letters, words };
// // // // // }

// // // // // async function pickPlayableWord(difficulty, usedWords = [], wordCount = MIN_GRID_WORDS) {
// // // // //   const tried = [...usedWords];
// // // // //   let best = null;
// // // // //   const targetWords = Math.min(Math.max(wordCount, MIN_GRID_WORDS), MAX_GRID_WORDS);

// // // // //   for (let i = 0; i < 15; i++) {
// // // // //     const picked = await pickRandomWord(difficulty, tried);
// // // // //     tried.push(picked.word);
// // // // //     const built = buildRoundWords(picked.word, targetWords);
// // // // //     if (!best || built.words.length > best.built.words.length) best = { picked, built };
// // // // //     if (best.built.words.length >= targetWords) break;
// // // // //   }
// // // // //   return best;
// // // // // }

// // // // // /* ---------- DB helpers ---------- */

// // // // // async function withRoomLock(roomId, work) {
// // // // //   const conn = await db.getConnection();
// // // // //   try {
// // // // //     await conn.beginTransaction();
// // // // //     await conn.query(`SELECT id FROM word_scramble_rooms WHERE id = ? FOR UPDATE`, [roomId]);
// // // // //     const result = await work(conn);
// // // // //     await conn.commit();
// // // // //     return result;
// // // // //   } catch (err) {
// // // // //     await conn.rollback();
// // // // //     throw err;
// // // // //   } finally {
// // // // //     conn.release();
// // // // //   }
// // // // // }

// // // // // async function latestRound(conn, roomId) {
// // // // //   const [rows] = await conn.query(
// // // // //     `SELECT * FROM word_scramble_rounds WHERE room_id = ? ORDER BY id DESC LIMIT 1`,
// // // // //     [roomId]
// // // // //   );
// // // // //   return rows[0] || null;
// // // // // }

// // // // // /* ---------- NEW: per-player progress (keyed by player name) ---------- */

// // // // // // Remember the furthest round every player in this room has reached.
// // // // // async function recordProgress(conn, roomId, reachedRound) {
// // // // //   await conn.query(
// // // // //     `INSERT INTO ws_player_progress (player_name, next_round)
// // // // //      SELECT player_name, ? FROM word_scramble_players WHERE room_id = ?
// // // // //      ON DUPLICATE KEY UPDATE next_round = GREATEST(next_round, VALUES(next_round))`,
// // // // //     [reachedRound, roomId]
// // // // //   );
// // // // // }

// // // // // // A full set was finished -> everybody in the room starts again from round 1.
// // // // // async function resetProgress(conn, roomId) {
// // // // //   await conn.query(
// // // // //     `UPDATE ws_player_progress pr
// // // // //      JOIN word_scramble_players p ON p.player_name = pr.player_name
// // // // //      SET pr.next_round = 1
// // // // //      WHERE p.room_id = ?`,
// // // // //     [roomId]
// // // // //   );
// // // // // }


// // // // // async function startingRound(conn, roomId, config) {
// // // // //   const [rows] = await conn.query(
// // // // //     `SELECT MAX(pr.next_round) AS n
// // // // //      FROM ws_player_progress pr
// // // // //      JOIN word_scramble_players p ON p.player_name = pr.player_name
// // // // //      WHERE p.room_id = ?`,
// // // // //     [roomId]
// // // // //   );
// // // // //   let n = Number(rows[0]?.n) || 1;
// // // // //   if (n === config.rounds + 1) n = 1;
// // // // //   return Math.min(Math.max(n, 1), MAX_LEVEL);
// // // // // }

// // // // // async function createRound(conn, room, roundNumber, config, usedWords) {
// // // // //   const wordCount = getWordCountForLevel(roundNumber);

// // // // //   // CHANGED: never pick a word the players in this room have already been asked
// // // // //   const exclude = await buildExcludeList(conn, room, usedWords);
// // // // //   const { picked, built } = await pickPlayableWord(room.difficulty, exclude, wordCount);
// // // // //   const revealed = pickInitialReveals(built.words, config.freeReveals);

// // // // //   const [result] = await conn.query(
// // // // //     `INSERT INTO word_scramble_rounds
// // // // //        (room_id, round_number, word, clue, scrambled, time_limit_sec, letters_json, words_json, revealed_json)
// // // // //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// // // // //     [
// // // // //       room.id,
// // // // //       roundNumber,
// // // // //       picked.word,
// // // // //       picked.clue,
// // // // //       picked.scrambled,
// // // // //       config.timeLimitSec,
// // // // //       JSON.stringify(built.letters),
// // // // //       JSON.stringify(built.words),
// // // // //       JSON.stringify(revealed),
// // // // //     ]
// // // // //   );

// // // // //   await recordProgress(conn, room.id, roundNumber); // NEW
// // // // //   await markWordSeen(conn, room.id, picked.word); // NEW: this question is now "asked"

// // // // //   const [rows] = await conn.query(`SELECT * FROM word_scramble_rounds WHERE id = ?`, [result.insertId]);
// // // // //   return rows[0];
// // // // // }

// // // // // function roundPayload(row, config) {
// // // // //   const words = parse(row.words_json);
// // // // //   return {
// // // // //     id: row.id,
// // // // //     roundNumber: row.round_number,
// // // // //     totalRounds: config.rounds,
// // // // //     scrambled: row.scrambled,
// // // // //     letters: parse(row.letters_json),
// // // // //     words,
// // // // //     totalWords: words.length,
// // // // //     clue: buildClue(row.clue, config.clueType),
// // // // //     clueType: config.clueType,
// // // // //     timeLimitSec: row.time_limit_sec,
// // // // //     lives: config.lives,
// // // // //     freeReveals: config.freeReveals,
// // // // //     revealedCells: parse(row.revealed_json),
// // // // //   };
// // // // // }

// // // // // async function findRoom(roomCode) {
// // // // //   const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
// // // // //   return rooms[0] || null;
// // // // // }

// // // // // /* ---------- routes ---------- */

// // // // // module.exports = function registerRoundRoutes(router) {
// // // // //   // NEW: which room is this player still playing? (works from any device, by player name)
// // // // //   router.get("/active-room/:playerName", async (req, res) => {
// // // // //     try {
// // // // //       const [rows] = await db.query(
// // // // //         `SELECT r.room_code
// // // // //          FROM word_scramble_rooms r
// // // // //          JOIN word_scramble_players p ON p.room_id = r.id
// // // // //          WHERE p.player_name = ? AND r.status = 'in_progress'
// // // // //          ORDER BY r.id DESC LIMIT 1`,
// // // // //         [req.params.playerName]
// // // // //       );
// // // // //       return res.status(200).json({ success: true, roomCode: rows[0]?.room_code ?? null });
// // // // //     } catch (err) {
// // // // //       console.error("Active room error:", err);
// // // // //       return res.status(500).json({ error: "Failed to look up active room" });
// // // // //     }
// // // // //   });

// // // // //   // START GAME - idempotent. Brand-new game starts at the player's saved progress.
// // // // //   router.post("/rooms/:roomCode/start", async (req, res) => {
// // // // //     try {
// // // // //       const room = await findRoom(req.params.roomCode);
// // // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // // //       const config = getConfig(room.difficulty);

// // // // //       const [countRows] = await db.query(
// // // // //         `SELECT COUNT(*) AS c FROM word_scramble_players WHERE room_id = ?`,
// // // // //         [room.id]
// // // // //       );
// // // // //       if (countRows[0].c < MIN_PLAYERS_TO_START) {
// // // // //         return res.status(409).json({ error: `Need at least ${MIN_PLAYERS_TO_START} players to start` });
// // // // //       }

// // // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // // //         const [fresh] = await conn.query(`SELECT status FROM word_scramble_rooms WHERE id = ?`, [room.id]);
// // // // //         const existing = await latestRound(conn, room.id);
// // // // //         if (fresh[0]?.status === "in_progress" && existing) return existing; // already started -> same round

// // // // //         await conn.query(`UPDATE word_scramble_rooms SET status = 'in_progress' WHERE id = ?`, [room.id]);
// // // // //         const first = await startingRound(conn, room.id, config); // CHANGED: was always 1
// // // // //         return createRound(conn, room, first, config, []);
// // // // //       });

// // // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // // //     } catch (err) {
// // // // //       console.error("Start game error:", err);
// // // // //       return res.status(500).json({ error: "Failed to start game" });
// // // // //     }
// // // // //   });

// // // // //   // NEXT ROUND - body: { fromRoundId, skip }
// // // // //   //   skip = 1 -> the player used a Skip Round on the "Great Job" popup:
// // // // //   //   round (N+1) is skipped and round (N+2) is created, even past the last round.
// // // // //   router.post("/rooms/:roomCode/next-round", async (req, res) => {
// // // // //     try {
// // // // //       const { fromRoundId } = req.body || {};
// // // // //       let skip = Math.min(Math.max(parseInt(req.body?.skip, 10) || 0, 0), 1);

// // // // //       const room = await findRoom(req.params.roomCode);
// // // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // // //       const config = getConfig(room.difficulty);

// // // // //       const outcome = await withRoomLock(room.id, async (conn) => {
// // // // //         const latest = await latestRound(conn, room.id);

// // // // //         if (latest && fromRoundId && String(latest.id) !== String(fromRoundId)) {
// // // // //           return { finished: false, round: latest }; // already advanced by another player
// // // // //         }

// // // // //         // Only honour skip if a skip token was really spent for this round
// // // // //         // (POST /api/skip/use with roundId "after-<roundId>").
// // // // //         if (skip > 0) {
// // // // //           const key = `after-${fromRoundId || (latest ? latest.id : "")}`;
// // // // //           const [ok] = await conn.query(`SELECT 1 FROM ws_skipped_rounds WHERE round_id = ? LIMIT 1`, [key]);
// // // // //           if (ok.length === 0) skip = 0;
// // // // //         }

// // // // //         const currentNumber = latest ? latest.round_number : 0;
// // // // //         const extended = skip > 0 || currentNumber > config.rounds;
// // // // //         const limit = extended ? MAX_LEVEL : config.rounds;
// // // // //         const nextNumber = currentNumber + 1 + skip;

// // // // //         if (nextNumber > limit) {
// // // // //           await conn.query(`UPDATE word_scramble_rooms SET status = 'finished' WHERE id = ?`, [room.id]);
// // // // //           await resetProgress(conn, room.id); // set finished -> next game starts at round 1
// // // // //           return { finished: true };
// // // // //         }

// // // // //         const [prev] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // // //         const round = await createRound(conn, room, nextNumber, config, prev.map((r) => r.word));
// // // // //         return { finished: false, round };
// // // // //       });

// // // // //       if (outcome.finished) return res.status(200).json({ success: true, finished: true });
// // // // //       return res.status(200).json({ success: true, finished: false, round: roundPayload(outcome.round, config) });
// // // // //     } catch (err) {
// // // // //       console.error("Next round error:", err);
// // // // //       return res.status(500).json({ error: "Failed to advance round" });
// // // // //     }
// // // // //   });

// // // // //   // RETRY - same round number, ONE new puzzle shared by everyone who retries
// // // // //   router.post("/rounds/:roundId/retry", async (req, res) => {
// // // // //     try {
// // // // //       const { roundId } = req.params;
// // // // //       const { roomCode } = req.body || {};
// // // // //       if (!roomCode) return res.status(400).json({ error: "roomCode is required" });

// // // // //       const [roundRows] = await db.query(`SELECT * FROM word_scramble_rounds WHERE id = ? LIMIT 1`, [roundId]);
// // // // //       if (roundRows.length === 0) return res.status(404).json({ error: "Round not found" });
// // // // //       const current = roundRows[0];

// // // // //       const [roomRows] = await db.query(
// // // // //         `SELECT * FROM word_scramble_rooms WHERE id = ? AND room_code = ? LIMIT 1`,
// // // // //         [current.room_id, roomCode]
// // // // //       );
// // // // //       if (roomRows.length === 0) return res.status(404).json({ error: "Room not found" });
// // // // //       const room = roomRows[0];
// // // // //       const config = getConfig(room.difficulty);

// // // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // // //         const latest = await latestRound(conn, room.id);
// // // // //         if (latest && String(latest.id) !== String(current.id)) return latest; // someone already retried/advanced

// // // // //         const [used] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // // //         return createRound(conn, room, current.round_number, config, used.map((r) => r.word));
// // // // //       });

// // // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // // //     } catch (err) {
// // // // //       console.error("Retry round error:", err);
// // // // //       return res.status(500).json({ error: "Failed to load new question", details: err.message });
// // // // //     }
// // // // //   });
// // // // // };
// // // // const db = require("../db");
// // // // const { pickRandomWord } = require("../utils/words");
// // // // const { WORD_SCRAMBLE_DIFFICULTY_CONFIG } = require("../config/wordScrambleDifficulty");
// // // // const { buildClue } = require("../utils/clue");
// // // // const { MIN_PLAYERS_TO_START } = require("../config/wordScrambleRoom");
// // // // const { findSubWords, layoutCrossword } = require("../utils/crosswordGenerator");
// // // // const { getWordCountForLevel } = require("../utils/levelConfig");
// // // // const { pickLiveWord, warmUpLiveWords } = require("../utils/liveWords");

// // // // let DICTIONARY = [];
// // // // try {
// // // //   DICTIONARY = require("../data/wordlist.json");
// // // // } catch (e) {
// // // //   console.warn("[wordscramble] backend/src/data/wordlist.json missing - crossword rounds disabled");
// // // // }

// // // // // Fill the live word pool in the background (does not block the server start)
// // // // warmUpLiveWords();

// // // // const MIN_GRID_WORDS = 2;
// // // // const MAX_GRID_WORDS = 7;

// // // // // NEW: highest level a player can reach when they keep going past the normal set
// // // // // (after using a Skip Round on the "Great Job" popup).
// // // // const MAX_LEVEL = 50;

// // // // const parse = (v, fallback = []) => {
// // // //   try {
// // // //     return typeof v === "string" ? JSON.parse(v) : v ?? fallback;
// // // //   } catch (e) {
// // // //     return fallback;
// // // //   }
// // // // };

// // // // const getConfig = (difficulty) =>
// // // //   WORD_SCRAMBLE_DIFFICULTY_CONFIG[difficulty] || WORD_SCRAMBLE_DIFFICULTY_CONFIG.easy;

// // // // /* ---------- NO-REPEAT QUESTIONS: words each player has already been asked ---------- */

// // // // // Created automatically on start-up (same collation as the other word_scramble tables).
// // // // db.query(
// // // //   `CREATE TABLE IF NOT EXISTS ws_seen_words (
// // // //      player_name VARCHAR(100) NOT NULL,
// // // //      word        VARCHAR(50)  NOT NULL,
// // // //      seen_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// // // //      PRIMARY KEY (player_name, word)
// // // //    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
// // // // ).catch((err) => console.warn("[wordscramble] could not create ws_seen_words:", err.message));

// // // // // Every word that ANY player in this room has already been asked.
// // // // async function getSeenWords(conn, roomId) {
// // // //   const [rows] = await conn.query(
// // // //     `SELECT DISTINCT s.word
// // // //      FROM ws_seen_words s
// // // //      JOIN word_scramble_players p ON p.player_name = s.player_name
// // // //      WHERE p.room_id = ?`,
// // // //     [roomId]
// // // //   );
// // // //   return rows.map((r) => r.word);
// // // // }

// // // // // Remember the question for every player in the room.
// // // // async function markWordSeen(conn, roomId, word) {
// // // //   await conn.query(
// // // //     `INSERT IGNORE INTO ws_seen_words (player_name, word)
// // // //      SELECT player_name, ? FROM word_scramble_players WHERE room_id = ?`,
// // // //     [word, roomId]
// // // //   );
// // // // }

// // // // // Words that must NOT be picked: this room's earlier rounds + everything the players have seen.
// // // // async function buildExcludeList(conn, room, usedWords) {
// // // //   const inRoom = [...new Set(usedWords)];
// // // //   const seen = await getSeenWords(conn, room.id);
// // // //   return [...new Set([...inRoom, ...seen])];
// // // // }

// // // // /* ---------- puzzle building ---------- */

// // // // function wordCells(slot) {
// // // //   const cells = [];
// // // //   for (let k = 0; k < slot.word.length; k++) {
// // // //     cells.push({
// // // //       row: slot.direction === "across" ? slot.row : slot.row + k,
// // // //       col: slot.direction === "across" ? slot.col + k : slot.col,
// // // //     });
// // // //   }
// // // //   return cells;
// // // // }

// // // // function pickInitialReveals(words, count) {
// // // //   if (!count || count <= 0) return [];
// // // //   const all = [];
// // // //   words.forEach((w) => wordCells(w).forEach((c) => all.push(c)));
// // // //   const uniq = [...new Map(all.map((c) => [`${c.row}-${c.col}`, c])).values()];
// // // //   return uniq.sort(() => Math.random() - 0.5).slice(0, Math.min(count, uniq.length));
// // // // }

// // // // function buildRoundWords(baseWord, maxWords) {
// // // //   const root = String(baseWord).toLowerCase();
// // // //   const letters = root.toUpperCase().split("");
// // // //   const all = findSubWords(root.split(""), DICTIONARY);
// // // //   const slots = all.length ? layoutCrossword(all, root, maxWords) : [];
// // // //   const words = (slots.length ? slots : [{ word: root, row: 0, col: 0, direction: "across" }]).map((s) => ({
// // // //     word: s.word.toUpperCase(),
// // // //     row: s.row,
// // // //     col: s.col,
// // // //     direction: s.direction,
// // // //   }));
// // // //   return { letters, words };
// // // // }

// // // // // Live random word first (library + dictionary API). If the internet / API is
// // // // // not available, fall back to the words stored in the database.
// // // // async function pickAnyWord(difficulty, tried) {
// // // //   try {
// // // //     return await pickLiveWord(difficulty, tried);
// // // //   } catch (err) {
// // // //     console.warn("[wordscramble] live word unavailable, using database word:", err.message);
// // // //     try {
// // // //       return await pickRandomWord(difficulty, tried);
// // // //     } catch (dbErr) {
// // // //       // database words are used up too -> allow a repeat instead of crashing the game
// // // //       return pickRandomWord(difficulty, []);
// // // //     }
// // // //   }
// // // // }

// // // // async function pickPlayableWord(difficulty, usedWords = [], wordCount = MIN_GRID_WORDS) {
// // // //   const tried = [...usedWords];
// // // //   let best = null;
// // // //   const targetWords = Math.min(Math.max(wordCount, MIN_GRID_WORDS), MAX_GRID_WORDS);

// // // //   for (let i = 0; i < 15; i++) {
// // // //     const picked = await pickAnyWord(difficulty, tried);
// // // //     tried.push(picked.word);
// // // //     const built = buildRoundWords(picked.word, targetWords);
// // // //     if (!best || built.words.length > best.built.words.length) best = { picked, built };
// // // //     if (best.built.words.length >= targetWords) break;
// // // //   }
// // // //   return best;
// // // // }

// // // // /* ---------- DB helpers ---------- */

// // // // async function withRoomLock(roomId, work) {
// // // //   const conn = await db.getConnection();
// // // //   try {
// // // //     await conn.beginTransaction();
// // // //     await conn.query(`SELECT id FROM word_scramble_rooms WHERE id = ? FOR UPDATE`, [roomId]);
// // // //     const result = await work(conn);
// // // //     await conn.commit();
// // // //     return result;
// // // //   } catch (err) {
// // // //     await conn.rollback();
// // // //     throw err;
// // // //   } finally {
// // // //     conn.release();
// // // //   }
// // // // }

// // // // async function latestRound(conn, roomId) {
// // // //   const [rows] = await conn.query(
// // // //     `SELECT * FROM word_scramble_rounds WHERE room_id = ? ORDER BY id DESC LIMIT 1`,
// // // //     [roomId]
// // // //   );
// // // //   return rows[0] || null;
// // // // }

// // // // /* ---------- NEW: per-player progress (keyed by player name) ---------- */

// // // // // Remember the furthest round every player in this room has reached.
// // // // async function recordProgress(conn, roomId, reachedRound) {
// // // //   await conn.query(
// // // //     `INSERT INTO ws_player_progress (player_name, next_round)
// // // //      SELECT player_name, ? FROM word_scramble_players WHERE room_id = ?
// // // //      ON DUPLICATE KEY UPDATE next_round = GREATEST(next_round, VALUES(next_round))`,
// // // //     [reachedRound, roomId]
// // // //   );
// // // // }

// // // // // A full set was finished -> everybody in the room starts again from round 1.
// // // // async function resetProgress(conn, roomId) {
// // // //   await conn.query(
// // // //     `UPDATE ws_player_progress pr
// // // //      JOIN word_scramble_players p ON p.player_name = pr.player_name
// // // //      SET pr.next_round = 1
// // // //      WHERE p.room_id = ?`,
// // // //     [roomId]
// // // //   );
// // // // }


// // // // async function startingRound(conn, roomId, config) {
// // // //   const [rows] = await conn.query(
// // // //     `SELECT MAX(pr.next_round) AS n
// // // //      FROM ws_player_progress pr
// // // //      JOIN word_scramble_players p ON p.player_name = pr.player_name
// // // //      WHERE p.room_id = ?`,
// // // //     [roomId]
// // // //   );
// // // //   let n = Number(rows[0]?.n) || 1;
// // // //   if (n === config.rounds + 1) n = 1;
// // // //   return Math.min(Math.max(n, 1), MAX_LEVEL);
// // // // }

// // // // async function createRound(conn, room, roundNumber, config, usedWords) {
// // // //   const wordCount = getWordCountForLevel(roundNumber);

// // // //   // CHANGED: never pick a word the players in this room have already been asked
// // // //   const exclude = await buildExcludeList(conn, room, usedWords);
// // // //   const { picked, built } = await pickPlayableWord(room.difficulty, exclude, wordCount);
// // // //   const revealed = pickInitialReveals(built.words, config.freeReveals);

// // // //   const [result] = await conn.query(
// // // //     `INSERT INTO word_scramble_rounds
// // // //        (room_id, round_number, word, clue, scrambled, time_limit_sec, letters_json, words_json, revealed_json)
// // // //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// // // //     [
// // // //       room.id,
// // // //       roundNumber,
// // // //       picked.word,
// // // //       picked.clue,
// // // //       picked.scrambled,
// // // //       config.timeLimitSec,
// // // //       JSON.stringify(built.letters),
// // // //       JSON.stringify(built.words),
// // // //       JSON.stringify(revealed),
// // // //     ]
// // // //   );

// // // //   await recordProgress(conn, room.id, roundNumber); // NEW
// // // //   await markWordSeen(conn, room.id, picked.word); // NEW: this question is now "asked"

// // // //   const [rows] = await conn.query(`SELECT * FROM word_scramble_rounds WHERE id = ?`, [result.insertId]);
// // // //   return rows[0];
// // // // }

// // // // function roundPayload(row, config) {
// // // //   const words = parse(row.words_json);
// // // //   return {
// // // //     id: row.id,
// // // //     roundNumber: row.round_number,
// // // //     totalRounds: config.rounds,
// // // //     scrambled: row.scrambled,
// // // //     letters: parse(row.letters_json),
// // // //     words,
// // // //     totalWords: words.length,
// // // //     clue: buildClue(row.clue, config.clueType),
// // // //     clueType: config.clueType,
// // // //     timeLimitSec: row.time_limit_sec,
// // // //     lives: config.lives,
// // // //     freeReveals: config.freeReveals,
// // // //     revealedCells: parse(row.revealed_json),
// // // //   };
// // // // }

// // // // async function findRoom(roomCode) {
// // // //   const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
// // // //   return rooms[0] || null;
// // // // }

// // // // /* ---------- routes ---------- */

// // // // module.exports = function registerRoundRoutes(router) {
// // // //   // NEW: which room is this player still playing? (works from any device, by player name)
// // // //   router.get("/active-room/:playerName", async (req, res) => {
// // // //     try {
// // // //       const [rows] = await db.query(
// // // //         `SELECT r.room_code
// // // //          FROM word_scramble_rooms r
// // // //          JOIN word_scramble_players p ON p.room_id = r.id
// // // //          WHERE p.player_name = ? AND r.status = 'in_progress'
// // // //          ORDER BY r.id DESC LIMIT 1`,
// // // //         [req.params.playerName]
// // // //       );
// // // //       return res.status(200).json({ success: true, roomCode: rows[0]?.room_code ?? null });
// // // //     } catch (err) {
// // // //       console.error("Active room error:", err);
// // // //       return res.status(500).json({ error: "Failed to look up active room" });
// // // //     }
// // // //   });

// // // //   // START GAME - idempotent. Brand-new game starts at the player's saved progress.
// // // //   router.post("/rooms/:roomCode/start", async (req, res) => {
// // // //     try {
// // // //       const room = await findRoom(req.params.roomCode);
// // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // //       const config = getConfig(room.difficulty);

// // // //       const [countRows] = await db.query(
// // // //         `SELECT COUNT(*) AS c FROM word_scramble_players WHERE room_id = ?`,
// // // //         [room.id]
// // // //       );
// // // //       if (countRows[0].c < MIN_PLAYERS_TO_START) {
// // // //         return res.status(409).json({ error: `Need at least ${MIN_PLAYERS_TO_START} players to start` });
// // // //       }

// // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // //         const [fresh] = await conn.query(`SELECT status FROM word_scramble_rooms WHERE id = ?`, [room.id]);
// // // //         const existing = await latestRound(conn, room.id);
// // // //         if (fresh[0]?.status === "in_progress" && existing) return existing; // already started -> same round

// // // //         await conn.query(`UPDATE word_scramble_rooms SET status = 'in_progress' WHERE id = ?`, [room.id]);
// // // //         const first = await startingRound(conn, room.id, config); // CHANGED: was always 1
// // // //         return createRound(conn, room, first, config, []);
// // // //       });

// // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // //     } catch (err) {
// // // //       console.error("Start game error:", err);
// // // //       return res.status(500).json({ error: "Failed to start game" });
// // // //     }
// // // //   });

// // // //   // NEXT ROUND - body: { fromRoundId, skip }
// // // //   //   skip = 1 -> the player used a Skip Round on the "Great Job" popup:
// // // //   //   round (N+1) is skipped and round (N+2) is created, even past the last round.
// // // //   router.post("/rooms/:roomCode/next-round", async (req, res) => {
// // // //     try {
// // // //       const { fromRoundId } = req.body || {};
// // // //       let skip = Math.min(Math.max(parseInt(req.body?.skip, 10) || 0, 0), 1);

// // // //       const room = await findRoom(req.params.roomCode);
// // // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // // //       const config = getConfig(room.difficulty);

// // // //       const outcome = await withRoomLock(room.id, async (conn) => {
// // // //         const latest = await latestRound(conn, room.id);

// // // //         if (latest && fromRoundId && String(latest.id) !== String(fromRoundId)) {
// // // //           return { finished: false, round: latest }; // already advanced by another player
// // // //         }

// // // //         // Only honour skip if a skip token was really spent for this round
// // // //         // (POST /api/skip/use with roundId "after-<roundId>").
// // // //         if (skip > 0) {
// // // //           const key = `after-${fromRoundId || (latest ? latest.id : "")}`;
// // // //           const [ok] = await conn.query(`SELECT 1 FROM ws_skipped_rounds WHERE round_id = ? LIMIT 1`, [key]);
// // // //           if (ok.length === 0) skip = 0;
// // // //         }

// // // //         const currentNumber = latest ? latest.round_number : 0;
// // // //         const extended = skip > 0 || currentNumber > config.rounds;
// // // //         const limit = extended ? MAX_LEVEL : config.rounds;
// // // //         const nextNumber = currentNumber + 1 + skip;

// // // //         if (nextNumber > limit) {
// // // //           await conn.query(`UPDATE word_scramble_rooms SET status = 'finished' WHERE id = ?`, [room.id]);
// // // //           await resetProgress(conn, room.id); // set finished -> next game starts at round 1
// // // //           return { finished: true };
// // // //         }

// // // //         const [prev] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // //         const round = await createRound(conn, room, nextNumber, config, prev.map((r) => r.word));
// // // //         return { finished: false, round };
// // // //       });

// // // //       if (outcome.finished) return res.status(200).json({ success: true, finished: true });
// // // //       return res.status(200).json({ success: true, finished: false, round: roundPayload(outcome.round, config) });
// // // //     } catch (err) {
// // // //       console.error("Next round error:", err);
// // // //       return res.status(500).json({ error: "Failed to advance round" });
// // // //     }
// // // //   });

// // // //   // RETRY - same round number, ONE new puzzle shared by everyone who retries
// // // //   router.post("/rounds/:roundId/retry", async (req, res) => {
// // // //     try {
// // // //       const { roundId } = req.params;
// // // //       const { roomCode } = req.body || {};
// // // //       if (!roomCode) return res.status(400).json({ error: "roomCode is required" });

// // // //       const [roundRows] = await db.query(`SELECT * FROM word_scramble_rounds WHERE id = ? LIMIT 1`, [roundId]);
// // // //       if (roundRows.length === 0) return res.status(404).json({ error: "Round not found" });
// // // //       const current = roundRows[0];

// // // //       const [roomRows] = await db.query(
// // // //         `SELECT * FROM word_scramble_rooms WHERE id = ? AND room_code = ? LIMIT 1`,
// // // //         [current.room_id, roomCode]
// // // //       );
// // // //       if (roomRows.length === 0) return res.status(404).json({ error: "Room not found" });
// // // //       const room = roomRows[0];
// // // //       const config = getConfig(room.difficulty);

// // // //       const round = await withRoomLock(room.id, async (conn) => {
// // // //         const latest = await latestRound(conn, room.id);
// // // //         if (latest && String(latest.id) !== String(current.id)) return latest; // someone already retried/advanced

// // // //         const [used] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // // //         return createRound(conn, room, current.round_number, config, used.map((r) => r.word));
// // // //       });

// // // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // // //     } catch (err) {
// // // //       console.error("Retry round error:", err);
// // // //       return res.status(500).json({ error: "Failed to load new question", details: err.message });
// // // //     }
// // // //   });
// // // // };
// // // const db = require("../db");
// // // const { pickRandomWord } = require("../utils/words");
// // // const { WORD_SCRAMBLE_DIFFICULTY_CONFIG } = require("../config/wordScrambleDifficulty");
// // // const { buildClue } = require("../utils/clue");
// // // const { MIN_PLAYERS_TO_START } = require("../config/wordScrambleRoom");
// // // const { findSubWords, layoutCrossword } = require("../utils/crosswordGenerator");
// // // const { pickLiveWord, warmUpLiveWords } = require("../utils/liveWords");

// // // // CHANGED: word count + timer now come from the progression config
// // // // (3,5,6,8,9,10 words ... capped at 10, timer depends on difficulty)
// // // const {
// // //   MAX_WORDS,
// // //   getTargetWordCount,
// // //   getTimeLimitForWords,
// // // } = require("../config/wordScrambleProgression");

// // // let DICTIONARY = [];
// // // try {
// // //   DICTIONARY = require("../data/wordlist.json");
// // // } catch (e) {
// // //   console.warn("[wordscramble] backend/src/data/wordlist.json missing - crossword rounds disabled");
// // // }

// // // // Fill the live word pool in the background (does not block the server start)
// // // warmUpLiveWords();

// // // const MIN_GRID_WORDS = 2;
// // // const MAX_GRID_WORDS = MAX_WORDS; // CHANGED: was 7, now 10

// // // // Highest level a player can reach when they keep going past the normal set
// // // // (after using a Skip Round on the "Great Job" popup).
// // // const MAX_LEVEL = 50;

// // // const parse = (v, fallback = []) => {
// // //   try {
// // //     return typeof v === "string" ? JSON.parse(v) : v ?? fallback;
// // //   } catch (e) {
// // //     return fallback;
// // //   }
// // // };

// // // const getConfig = (difficulty) =>
// // //   WORD_SCRAMBLE_DIFFICULTY_CONFIG[difficulty] || WORD_SCRAMBLE_DIFFICULTY_CONFIG.easy;

// // // /* ---------- NO-REPEAT QUESTIONS: words each player has already been asked ---------- */

// // // // Created automatically on start-up (same collation as the other word_scramble tables).
// // // db.query(
// // //   `CREATE TABLE IF NOT EXISTS ws_seen_words (
// // //      player_name VARCHAR(100) NOT NULL,
// // //      word        VARCHAR(50)  NOT NULL,
// // //      seen_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// // //      PRIMARY KEY (player_name, word)
// // //    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
// // // ).catch((err) => console.warn("[wordscramble] could not create ws_seen_words:", err.message));

// // // // Every word that ANY player in this room has already been asked.
// // // async function getSeenWords(conn, roomId) {
// // //   const [rows] = await conn.query(
// // //     `SELECT DISTINCT s.word
// // //      FROM ws_seen_words s
// // //      JOIN word_scramble_players p ON p.player_name = s.player_name
// // //      WHERE p.room_id = ?`,
// // //     [roomId]
// // //   );
// // //   return rows.map((r) => r.word);
// // // }

// // // // Remember the question for every player in the room.
// // // async function markWordSeen(conn, roomId, word) {
// // //   await conn.query(
// // //     `INSERT IGNORE INTO ws_seen_words (player_name, word)
// // //      SELECT player_name, ? FROM word_scramble_players WHERE room_id = ?`,
// // //     [word, roomId]
// // //   );
// // // }

// // // // Words that must NOT be picked: this room's earlier rounds + everything the players have seen.
// // // async function buildExcludeList(conn, room, usedWords) {
// // //   const inRoom = [...new Set(usedWords)];
// // //   const seen = await getSeenWords(conn, room.id);
// // //   return [...new Set([...inRoom, ...seen])];
// // // }

// // // /* ---------- puzzle building ---------- */

// // // function wordCells(slot) {
// // //   const cells = [];
// // //   for (let k = 0; k < slot.word.length; k++) {
// // //     cells.push({
// // //       row: slot.direction === "across" ? slot.row : slot.row + k,
// // //       col: slot.direction === "across" ? slot.col + k : slot.col,
// // //     });
// // //   }
// // //   return cells;
// // // }

// // // function pickInitialReveals(words, count) {
// // //   if (!count || count <= 0) return [];
// // //   const all = [];
// // //   words.forEach((w) => wordCells(w).forEach((c) => all.push(c)));
// // //   const uniq = [...new Map(all.map((c) => [`${c.row}-${c.col}`, c])).values()];
// // //   return uniq.sort(() => Math.random() - 0.5).slice(0, Math.min(count, uniq.length));
// // // }

// // // function buildRoundWords(baseWord, maxWords) {
// // //   const root = String(baseWord).toLowerCase();
// // //   const letters = root.toUpperCase().split("");
// // //   const all = findSubWords(root.split(""), DICTIONARY);
// // //   const slots = all.length ? layoutCrossword(all, root, maxWords) : [];
// // //   const words = (slots.length ? slots : [{ word: root, row: 0, col: 0, direction: "across" }]).map((s) => ({
// // //     word: s.word.toUpperCase(),
// // //     row: s.row,
// // //     col: s.col,
// // //     direction: s.direction,
// // //   }));
// // //   return { letters, words };
// // // }

// // // // Live random word first (library + dictionary API). If the internet / API is
// // // // not available, fall back to the words stored in the database.
// // // async function pickAnyWord(difficulty, tried) {
// // //   try {
// // //     return await pickLiveWord(difficulty, tried);
// // //   } catch (err) {
// // //     console.warn("[wordscramble] live word unavailable, using database word:", err.message);
// // //     try {
// // //       return await pickRandomWord(difficulty, tried);
// // //     } catch (dbErr) {
// // //       // database words are used up too -> allow a repeat instead of crashing the game
// // //       return pickRandomWord(difficulty, []);
// // //     }
// // //   }
// // // }

// // // async function pickPlayableWord(difficulty, usedWords = [], wordCount = MIN_GRID_WORDS) {
// // //   const tried = [...usedWords];
// // //   let best = null;
// // //   const targetWords = Math.min(Math.max(wordCount, MIN_GRID_WORDS), MAX_GRID_WORDS);

// // //   // CHANGED: bigger tables (8-10 words) need a richer root word, so try more
// // //   // random words before settling for the best one found.
// // //   const attempts = targetWords >= 8 ? 30 : 15;

// // //   for (let i = 0; i < attempts; i++) {
// // //     const picked = await pickAnyWord(difficulty, tried);
// // //     tried.push(picked.word);
// // //     const built = buildRoundWords(picked.word, targetWords);
// // //     if (!best || built.words.length > best.built.words.length) best = { picked, built };
// // //     if (best.built.words.length >= targetWords) break;
// // //   }
// // //   return best;
// // // }

// // // /* ---------- DB helpers ---------- */

// // // async function withRoomLock(roomId, work) {
// // //   const conn = await db.getConnection();
// // //   try {
// // //     await conn.beginTransaction();
// // //     await conn.query(`SELECT id FROM word_scramble_rooms WHERE id = ? FOR UPDATE`, [roomId]);
// // //     const result = await work(conn);
// // //     await conn.commit();
// // //     return result;
// // //   } catch (err) {
// // //     await conn.rollback();
// // //     throw err;
// // //   } finally {
// // //     conn.release();
// // //   }
// // // }

// // // async function latestRound(conn, roomId) {
// // //   const [rows] = await conn.query(
// // //     `SELECT * FROM word_scramble_rounds WHERE room_id = ? ORDER BY id DESC LIMIT 1`,
// // //     [roomId]
// // //   );
// // //   return rows[0] || null;
// // // }

// // // /* ---------- per-player progress (keyed by player name) ---------- */

// // // // Remember the furthest round every player in this room has reached.
// // // async function recordProgress(conn, roomId, reachedRound) {
// // //   await conn.query(
// // //     `INSERT INTO ws_player_progress (player_name, next_round)
// // //      SELECT player_name, ? FROM word_scramble_players WHERE room_id = ?
// // //      ON DUPLICATE KEY UPDATE next_round = GREATEST(next_round, VALUES(next_round))`,
// // //     [reachedRound, roomId]
// // //   );
// // // }

// // // // A full set was finished -> everybody in the room starts again from round 1.
// // // async function resetProgress(conn, roomId) {
// // //   await conn.query(
// // //     `UPDATE ws_player_progress pr
// // //      JOIN word_scramble_players p ON p.player_name = pr.player_name
// // //      SET pr.next_round = 1
// // //      WHERE p.room_id = ?`,
// // //     [roomId]
// // //   );
// // // }

// // // async function startingRound(conn, roomId, config) {
// // //   const [rows] = await conn.query(
// // //     `SELECT MAX(pr.next_round) AS n
// // //      FROM ws_player_progress pr
// // //      JOIN word_scramble_players p ON p.player_name = pr.player_name
// // //      WHERE p.room_id = ?`,
// // //     [roomId]
// // //   );
// // //   let n = Number(rows[0]?.n) || 1;
// // //   if (n === config.rounds + 1) n = 1;
// // //   return Math.min(Math.max(n, 1), MAX_LEVEL);
// // // }

// // // async function createRound(conn, room, roundNumber, config, usedWords) {
// // //   // CHANGED: word count follows the progression (3,5,6,8,9,10 cap)
// // //   const wordCount = getTargetWordCount(roundNumber);

// // //   // never pick a word the players in this room have already been asked
// // //   const exclude = await buildExcludeList(conn, room, usedWords);
// // //   const { picked, built } = await pickPlayableWord(room.difficulty, exclude, wordCount);
// // //   const revealed = pickInitialReveals(built.words, config.freeReveals);

// // //   // CHANGED: timer depends on difficulty + how many words the table REALLY has
// // //   // (must come AFTER `built` exists). Edit TIME_RULES in wordScrambleProgression.js
// // //   const timeLimitSec = getTimeLimitForWords(room.difficulty, built.words.length);

// // //   const [result] = await conn.query(
// // //     `INSERT INTO word_scramble_rounds
// // //        (room_id, round_number, word, clue, scrambled, time_limit_sec, letters_json, words_json, revealed_json)
// // //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// // //     [
// // //       room.id,
// // //       roundNumber,
// // //       picked.word,
// // //       picked.clue,
// // //       picked.scrambled,
// // //       timeLimitSec,
// // //       JSON.stringify(built.letters),
// // //       JSON.stringify(built.words),
// // //       JSON.stringify(revealed),
// // //     ]
// // //   );

// // //   await recordProgress(conn, room.id, roundNumber);
// // //   await markWordSeen(conn, room.id, picked.word); // this question is now "asked"

// // //   const [rows] = await conn.query(`SELECT * FROM word_scramble_rounds WHERE id = ?`, [result.insertId]);
// // //   return rows[0];
// // // }

// // // function roundPayload(row, config) {
// // //   const words = parse(row.words_json);
// // //   return {
// // //     id: row.id,
// // //     roundNumber: row.round_number,
// // //     totalRounds: config.rounds,
// // //     scrambled: row.scrambled,
// // //     letters: parse(row.letters_json),
// // //     words,
// // //     totalWords: words.length,
// // //     clue: buildClue(row.clue, config.clueType),
// // //     clueType: config.clueType,
// // //     timeLimitSec: row.time_limit_sec,
// // //     lives: config.lives,
// // //     freeReveals: config.freeReveals,
// // //     revealedCells: parse(row.revealed_json),
// // //   };
// // // }

// // // async function findRoom(roomCode) {
// // //   const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
// // //   return rooms[0] || null;
// // // }

// // // /* ---------- routes ---------- */

// // // module.exports = function registerRoundRoutes(router) {
// // //   // Which room is this player still playing? (works from any device, by player name)
// // //   router.get("/active-room/:playerName", async (req, res) => {
// // //     try {
// // //       const [rows] = await db.query(
// // //         `SELECT r.room_code
// // //          FROM word_scramble_rooms r
// // //          JOIN word_scramble_players p ON p.room_id = r.id
// // //          WHERE p.player_name = ? AND r.status = 'in_progress'
// // //          ORDER BY r.id DESC LIMIT 1`,
// // //         [req.params.playerName]
// // //       );
// // //       return res.status(200).json({ success: true, roomCode: rows[0]?.room_code ?? null });
// // //     } catch (err) {
// // //       console.error("Active room error:", err);
// // //       return res.status(500).json({ error: "Failed to look up active room" });
// // //     }
// // //   });

// // //   // START GAME - idempotent. Brand-new game starts at the player's saved progress.
// // //   router.post("/rooms/:roomCode/start", async (req, res) => {
// // //     try {
// // //       const room = await findRoom(req.params.roomCode);
// // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // //       const config = getConfig(room.difficulty);

// // //       const [countRows] = await db.query(
// // //         `SELECT COUNT(*) AS c FROM word_scramble_players WHERE room_id = ?`,
// // //         [room.id]
// // //       );
// // //       if (countRows[0].c < MIN_PLAYERS_TO_START) {
// // //         return res.status(409).json({ error: `Need at least ${MIN_PLAYERS_TO_START} players to start` });
// // //       }

// // //       const round = await withRoomLock(room.id, async (conn) => {
// // //         const [fresh] = await conn.query(`SELECT status FROM word_scramble_rooms WHERE id = ?`, [room.id]);
// // //         const existing = await latestRound(conn, room.id);
// // //         if (fresh[0]?.status === "in_progress" && existing) return existing; // already started -> same round

// // //         await conn.query(`UPDATE word_scramble_rooms SET status = 'in_progress' WHERE id = ?`, [room.id]);
// // //         const first = await startingRound(conn, room.id, config);
// // //         return createRound(conn, room, first, config, []);
// // //       });

// // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // //     } catch (err) {
// // //       console.error("Start game error:", err);
// // //       return res.status(500).json({ error: "Failed to start game" });
// // //     }
// // //   });

// // //   // NEXT ROUND - body: { fromRoundId, skip }
// // //   //   skip = 1 -> the player used a Skip Round on the "Great Job" popup:
// // //   //   round (N+1) is skipped and round (N+2) is created, even past the last round.
// // //   router.post("/rooms/:roomCode/next-round", async (req, res) => {
// // //     try {
// // //       const { fromRoundId } = req.body || {};
// // //       let skip = Math.min(Math.max(parseInt(req.body?.skip, 10) || 0, 0), 1);

// // //       const room = await findRoom(req.params.roomCode);
// // //       if (!room) return res.status(404).json({ error: "Room not found" });
// // //       const config = getConfig(room.difficulty);

// // //       const outcome = await withRoomLock(room.id, async (conn) => {
// // //         const latest = await latestRound(conn, room.id);

// // //         if (latest && fromRoundId && String(latest.id) !== String(fromRoundId)) {
// // //           return { finished: false, round: latest }; // already advanced by another player
// // //         }

// // //         // Only honour skip if a skip token was really spent for this round
// // //         // (POST /api/skip/use with roundId "after-<roundId>").
// // //         if (skip > 0) {
// // //           const key = `after-${fromRoundId || (latest ? latest.id : "")}`;
// // //           const [ok] = await conn.query(`SELECT 1 FROM ws_skipped_rounds WHERE round_id = ? LIMIT 1`, [key]);
// // //           if (ok.length === 0) skip = 0;
// // //         }

// // //         const currentNumber = latest ? latest.round_number : 0;
// // //         const extended = skip > 0 || currentNumber > config.rounds;
// // //         const limit = extended ? MAX_LEVEL : config.rounds;
// // //         const nextNumber = currentNumber + 1 + skip;

// // //         if (nextNumber > limit) {
// // //           await conn.query(`UPDATE word_scramble_rooms SET status = 'finished' WHERE id = ?`, [room.id]);
// // //           await resetProgress(conn, room.id); // set finished -> next game starts at round 1
// // //           return { finished: true };
// // //         }

// // //         const [prev] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // //         const round = await createRound(conn, room, nextNumber, config, prev.map((r) => r.word));
// // //         return { finished: false, round };
// // //       });

// // //       if (outcome.finished) return res.status(200).json({ success: true, finished: true });
// // //       return res.status(200).json({ success: true, finished: false, round: roundPayload(outcome.round, config) });
// // //     } catch (err) {
// // //       console.error("Next round error:", err);
// // //       return res.status(500).json({ error: "Failed to advance round" });
// // //     }
// // //   });

// // //   // RETRY - same round number, ONE new puzzle shared by everyone who retries
// // //   router.post("/rounds/:roundId/retry", async (req, res) => {
// // //     try {
// // //       const { roundId } = req.params;
// // //       const { roomCode } = req.body || {};
// // //       if (!roomCode) return res.status(400).json({ error: "roomCode is required" });

// // //       const [roundRows] = await db.query(`SELECT * FROM word_scramble_rounds WHERE id = ? LIMIT 1`, [roundId]);
// // //       if (roundRows.length === 0) return res.status(404).json({ error: "Round not found" });
// // //       const current = roundRows[0];

// // //       const [roomRows] = await db.query(
// // //         `SELECT * FROM word_scramble_rooms WHERE id = ? AND room_code = ? LIMIT 1`,
// // //         [current.room_id, roomCode]
// // //       );
// // //       if (roomRows.length === 0) return res.status(404).json({ error: "Room not found" });
// // //       const room = roomRows[0];
// // //       const config = getConfig(room.difficulty);

// // //       const round = await withRoomLock(room.id, async (conn) => {
// // //         const latest = await latestRound(conn, room.id);
// // //         if (latest && String(latest.id) !== String(current.id)) return latest; // someone already retried/advanced

// // //         const [used] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// // //         return createRound(conn, room, current.round_number, config, used.map((r) => r.word));
// // //       });

// // //       return res.status(200).json({ success: true, round: roundPayload(round, config) });
// // //     } catch (err) {
// // //       console.error("Retry round error:", err);
// // //       return res.status(500).json({ error: "Failed to load new question", details: err.message });
// // //     }
// // //   });
// // // };
// // const db = require("../db");
// // const { pickRandomWord } = require("../utils/words");
// // const { WORD_SCRAMBLE_DIFFICULTY_CONFIG } = require("../config/wordScrambleDifficulty");
// // const { buildClue } = require("../utils/clue");
// // const { MIN_PLAYERS_TO_START } = require("../config/wordScrambleRoom");
// // const { findSubWords, layoutCrossword } = require("../utils/crosswordGenerator");
// // const { pickLiveWord, warmUpLiveWords } = require("../utils/liveWords");

// // // CHANGED: word count + timer now come from the progression config
// // // (3,5,6,8,9,10 words ... capped at 10, timer depends on difficulty)
// // const {
// //   MAX_WORDS,
// //   getTargetWordCount,
// //   getTimeLimitForWords,
// // } = require("../config/wordScrambleProgression");

// // let DICTIONARY = [];
// // try {
// //   DICTIONARY = require("../data/wordlist.json");
// // } catch (e) {
// //   console.warn("[wordscramble] backend/src/data/wordlist.json missing - crossword rounds disabled");
// // }

// // // Fill the live word pool in the background (does not block the server start)
// // warmUpLiveWords();

// // const MIN_GRID_WORDS = 2;
// // const MAX_GRID_WORDS = MAX_WORDS; // CHANGED: was 7, now 10

// // // Highest level a player can reach when they keep going past the normal set
// // // (after using a Skip Round on the "Great Job" popup).
// // const MAX_LEVEL = 50;

// // const parse = (v, fallback = []) => {
// //   try {
// //     return typeof v === "string" ? JSON.parse(v) : v ?? fallback;
// //   } catch (e) {
// //     return fallback;
// //   }
// // };

// // const getConfig = (difficulty) =>
// //   WORD_SCRAMBLE_DIFFICULTY_CONFIG[difficulty] || WORD_SCRAMBLE_DIFFICULTY_CONFIG.easy;

// // // CHANGED: the room's own total_rounds (chosen on Create Room, 1 - 50) wins.
// // // Old rooms (NULL) fall back to the difficulty config.
// // const getTotalRounds = (room, config) => Number(room?.total_rounds) || config.rounds;

// // /* ---------- NO-REPEAT QUESTIONS: words each player has already been asked ---------- */

// // // Created automatically on start-up (same collation as the other word_scramble tables).
// // db.query(
// //   `CREATE TABLE IF NOT EXISTS ws_seen_words (
// //      player_name VARCHAR(100) NOT NULL,
// //      word        VARCHAR(50)  NOT NULL,
// //      seen_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// //      PRIMARY KEY (player_name, word)
// //    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
// // ).catch((err) => console.warn("[wordscramble] could not create ws_seen_words:", err.message));

// // // Every word that ANY player in this room has already been asked.
// // async function getSeenWords(conn, roomId) {
// //   const [rows] = await conn.query(
// //     `SELECT DISTINCT s.word
// //      FROM ws_seen_words s
// //      JOIN word_scramble_players p ON p.player_name = s.player_name
// //      WHERE p.room_id = ?`,
// //     [roomId]
// //   );
// //   return rows.map((r) => r.word);
// // }

// // // Remember the question for every player in the room.
// // async function markWordSeen(conn, roomId, word) {
// //   await conn.query(
// //     `INSERT IGNORE INTO ws_seen_words (player_name, word)
// //      SELECT player_name, ? FROM word_scramble_players WHERE room_id = ?`,
// //     [word, roomId]
// //   );
// // }

// // // Words that must NOT be picked: this room's earlier rounds + everything the players have seen.
// // async function buildExcludeList(conn, room, usedWords) {
// //   const inRoom = [...new Set(usedWords)];
// //   const seen = await getSeenWords(conn, room.id);
// //   return [...new Set([...inRoom, ...seen])];
// // }

// // /* ---------- puzzle building ---------- */

// // function wordCells(slot) {
// //   const cells = [];
// //   for (let k = 0; k < slot.word.length; k++) {
// //     cells.push({
// //       row: slot.direction === "across" ? slot.row : slot.row + k,
// //       col: slot.direction === "across" ? slot.col + k : slot.col,
// //     });
// //   }
// //   return cells;
// // }

// // function pickInitialReveals(words, count) {
// //   if (!count || count <= 0) return [];
// //   const all = [];
// //   words.forEach((w) => wordCells(w).forEach((c) => all.push(c)));
// //   const uniq = [...new Map(all.map((c) => [`${c.row}-${c.col}`, c])).values()];
// //   return uniq.sort(() => Math.random() - 0.5).slice(0, Math.min(count, uniq.length));
// // }

// // function buildRoundWords(baseWord, maxWords) {
// //   const root = String(baseWord).toLowerCase();
// //   const letters = root.toUpperCase().split("");
// //   const all = findSubWords(root.split(""), DICTIONARY);
// //   const slots = all.length ? layoutCrossword(all, root, maxWords) : [];
// //   const words = (slots.length ? slots : [{ word: root, row: 0, col: 0, direction: "across" }]).map((s) => ({
// //     word: s.word.toUpperCase(),
// //     row: s.row,
// //     col: s.col,
// //     direction: s.direction,
// //   }));
// //   return { letters, words };
// // }

// // // Live random word first (library + dictionary API). If the internet / API is
// // // not available, fall back to the words stored in the database.
// // async function pickAnyWord(difficulty, tried) {
// //   try {
// //     return await pickLiveWord(difficulty, tried);
// //   } catch (err) {
// //     console.warn("[wordscramble] live word unavailable, using database word:", err.message);
// //     try {
// //       return await pickRandomWord(difficulty, tried);
// //     } catch (dbErr) {
// //       // database words are used up too -> allow a repeat instead of crashing the game
// //       return pickRandomWord(difficulty, []);
// //     }
// //   }
// // }

// // async function pickPlayableWord(difficulty, usedWords = [], wordCount = MIN_GRID_WORDS) {
// //   const tried = [...usedWords];
// //   let best = null;
// //   const targetWords = Math.min(Math.max(wordCount, MIN_GRID_WORDS), MAX_GRID_WORDS);

// //   // CHANGED: bigger tables (8-10 words) need a richer root word, so try more
// //   // random words before settling for the best one found.
// //   const attempts = targetWords >= 8 ? 30 : 15;

// //   for (let i = 0; i < attempts; i++) {
// //     const picked = await pickAnyWord(difficulty, tried);
// //     tried.push(picked.word);
// //     const built = buildRoundWords(picked.word, targetWords);
// //     if (!best || built.words.length > best.built.words.length) best = { picked, built };
// //     if (best.built.words.length >= targetWords) break;
// //   }
// //   return best;
// // }

// // /* ---------- DB helpers ---------- */

// // async function withRoomLock(roomId, work) {
// //   const conn = await db.getConnection();
// //   try {
// //     await conn.beginTransaction();
// //     await conn.query(`SELECT id FROM word_scramble_rooms WHERE id = ? FOR UPDATE`, [roomId]);
// //     const result = await work(conn);
// //     await conn.commit();
// //     return result;
// //   } catch (err) {
// //     await conn.rollback();
// //     throw err;
// //   } finally {
// //     conn.release();
// //   }
// // }

// // async function latestRound(conn, roomId) {
// //   const [rows] = await conn.query(
// //     `SELECT * FROM word_scramble_rounds WHERE room_id = ? ORDER BY id DESC LIMIT 1`,
// //     [roomId]
// //   );
// //   return rows[0] || null;
// // }

// // /* ---------- per-player progress (keyed by player name) ---------- */

// // // Remember the furthest round every player in this room has reached.
// // async function recordProgress(conn, roomId, reachedRound) {
// //   await conn.query(
// //     `INSERT INTO ws_player_progress (player_name, next_round)
// //      SELECT player_name, ? FROM word_scramble_players WHERE room_id = ?
// //      ON DUPLICATE KEY UPDATE next_round = GREATEST(next_round, VALUES(next_round))`,
// //     [reachedRound, roomId]
// //   );
// // }

// // // A full set was finished -> everybody in the room starts again from round 1.
// // async function resetProgress(conn, roomId) {
// //   await conn.query(
// //     `UPDATE ws_player_progress pr
// //      JOIN word_scramble_players p ON p.player_name = pr.player_name
// //      SET pr.next_round = 1
// //      WHERE p.room_id = ?`,
// //     [roomId]
// //   );
// // }

// // // CHANGED: takes the room's totalRounds (not the difficulty config)
// // async function startingRound(conn, roomId, totalRounds) {
// //   const [rows] = await conn.query(
// //     `SELECT MAX(pr.next_round) AS n
// //      FROM ws_player_progress pr
// //      JOIN word_scramble_players p ON p.player_name = pr.player_name
// //      WHERE p.room_id = ?`,
// //     [roomId]
// //   );
// //   let n = Number(rows[0]?.n) || 1;
// //   if (n === totalRounds + 1) n = 1;
// //   return Math.min(Math.max(n, 1), MAX_LEVEL);
// // }

// // async function createRound(conn, room, roundNumber, config, usedWords) {
// //   // CHANGED: word count follows the progression (3,5,6,8,9,10 cap)
// //   const wordCount = getTargetWordCount(roundNumber);

// //   // never pick a word the players in this room have already been asked
// //   const exclude = await buildExcludeList(conn, room, usedWords);
// //   const { picked, built } = await pickPlayableWord(room.difficulty, exclude, wordCount);
// //   const revealed = pickInitialReveals(built.words, config.freeReveals);

// //   // CHANGED: timer depends on difficulty + how many words the table REALLY has
// //   // (must come AFTER `built` exists). Edit TIME_RULES in wordScrambleProgression.js
// //   const timeLimitSec = getTimeLimitForWords(room.difficulty, built.words.length);

// //   const [result] = await conn.query(
// //     `INSERT INTO word_scramble_rounds
// //        (room_id, round_number, word, clue, scrambled, time_limit_sec, letters_json, words_json, revealed_json)
// //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// //     [
// //       room.id,
// //       roundNumber,
// //       picked.word,
// //       picked.clue,
// //       picked.scrambled,
// //       timeLimitSec,
// //       JSON.stringify(built.letters),
// //       JSON.stringify(built.words),
// //       JSON.stringify(revealed),
// //     ]
// //   );

// //   await recordProgress(conn, room.id, roundNumber);
// //   await markWordSeen(conn, room.id, picked.word); // this question is now "asked"

// //   const [rows] = await conn.query(`SELECT * FROM word_scramble_rounds WHERE id = ?`, [result.insertId]);
// //   return rows[0];
// // }

// // // CHANGED: totalRounds is passed in (room's own value) instead of config.rounds
// // function roundPayload(row, config, totalRounds) {
// //   const words = parse(row.words_json);
// //   return {
// //     id: row.id,
// //     roundNumber: row.round_number,
// //     totalRounds,
// //     scrambled: row.scrambled,
// //     letters: parse(row.letters_json),
// //     words,
// //     totalWords: words.length,
// //     clue: buildClue(row.clue, config.clueType),
// //     clueType: config.clueType,
// //     timeLimitSec: row.time_limit_sec,
// //     lives: config.lives,
// //     freeReveals: config.freeReveals,
// //     revealedCells: parse(row.revealed_json),
// //   };
// // }

// // async function findRoom(roomCode) {
// //   const [rooms] = await db.query(`SELECT * FROM word_scramble_rooms WHERE room_code = ?`, [roomCode]);
// //   return rooms[0] || null;
// // }

// // /* ---------- routes ---------- */

// // module.exports = function registerRoundRoutes(router) {
// //   // Which room is this player still playing? (works from any device, by player name)
// //   router.get("/active-room/:playerName", async (req, res) => {
// //     try {
// //       const [rows] = await db.query(
// //         `SELECT r.room_code
// //          FROM word_scramble_rooms r
// //          JOIN word_scramble_players p ON p.room_id = r.id
// //          WHERE p.player_name = ? AND r.status = 'in_progress'
// //          ORDER BY r.id DESC LIMIT 1`,
// //         [req.params.playerName]
// //       );
// //       return res.status(200).json({ success: true, roomCode: rows[0]?.room_code ?? null });
// //     } catch (err) {
// //       console.error("Active room error:", err);
// //       return res.status(500).json({ error: "Failed to look up active room" });
// //     }
// //   });

// //   // START GAME - idempotent. Brand-new game starts at the player's saved progress.
// //   router.post("/rooms/:roomCode/start", async (req, res) => {
// //     try {
// //       const room = await findRoom(req.params.roomCode);
// //       if (!room) return res.status(404).json({ error: "Room not found" });
// //       const config = getConfig(room.difficulty);
// //       const totalRounds = getTotalRounds(room, config); // CHANGED

// //       const [countRows] = await db.query(
// //         `SELECT COUNT(*) AS c FROM word_scramble_players WHERE room_id = ?`,
// //         [room.id]
// //       );
// //       if (countRows[0].c < MIN_PLAYERS_TO_START) {
// //         return res.status(409).json({ error: `Need at least ${MIN_PLAYERS_TO_START} players to start` });
// //       }

// //       const round = await withRoomLock(room.id, async (conn) => {
// //         const [fresh] = await conn.query(`SELECT status FROM word_scramble_rooms WHERE id = ?`, [room.id]);
// //         const existing = await latestRound(conn, room.id);
// //         if (fresh[0]?.status === "in_progress" && existing) return existing; // already started -> same round

// //         await conn.query(`UPDATE word_scramble_rooms SET status = 'in_progress' WHERE id = ?`, [room.id]);
// //         const first = await startingRound(conn, room.id, totalRounds); // CHANGED
// //         return createRound(conn, room, first, config, []);
// //       });

// //       return res
// //         .status(200)
// //         .json({ success: true, round: roundPayload(round, config, totalRounds) });
// //     } catch (err) {
// //       console.error("Start game error:", err);
// //       return res.status(500).json({ error: "Failed to start game" });
// //     }
// //   });

// //   // NEXT ROUND - body: { fromRoundId, skip }
// //   //   skip = 1 -> the player used a Skip Round on the "Great Job" popup:
// //   //   round (N+1) is skipped and round (N+2) is created, even past the last round.
// //   router.post("/rooms/:roomCode/next-round", async (req, res) => {
// //     try {
// //       const { fromRoundId } = req.body || {};
// //       let skip = Math.min(Math.max(parseInt(req.body?.skip, 10) || 0, 0), 1);

// //       const room = await findRoom(req.params.roomCode);
// //       if (!room) return res.status(404).json({ error: "Room not found" });
// //       const config = getConfig(room.difficulty);
// //       const totalRounds = getTotalRounds(room, config); // CHANGED

// //       const outcome = await withRoomLock(room.id, async (conn) => {
// //         const latest = await latestRound(conn, room.id);

// //         if (latest && fromRoundId && String(latest.id) !== String(fromRoundId)) {
// //           return { finished: false, round: latest }; // already advanced by another player
// //         }

// //         // Only honour skip if a skip token was really spent for this round
// //         // (POST /api/skip/use with roundId "after-<roundId>").
// //         if (skip > 0) {
// //           const key = `after-${fromRoundId || (latest ? latest.id : "")}`;
// //           const [ok] = await conn.query(`SELECT 1 FROM ws_skipped_rounds WHERE round_id = ? LIMIT 1`, [key]);
// //           if (ok.length === 0) skip = 0;
// //         }

// //         const currentNumber = latest ? latest.round_number : 0;
// //         const extended = skip > 0 || currentNumber > totalRounds; // CHANGED
// //         const limit = extended ? MAX_LEVEL : totalRounds; // CHANGED
// //         const nextNumber = currentNumber + 1 + skip;

// //         if (nextNumber > limit) {
// //           await conn.query(`UPDATE word_scramble_rooms SET status = 'finished' WHERE id = ?`, [room.id]);
// //           await resetProgress(conn, room.id); // set finished -> next game starts at round 1
// //           return { finished: true };
// //         }

// //         const [prev] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// //         const round = await createRound(conn, room, nextNumber, config, prev.map((r) => r.word));
// //         return { finished: false, round };
// //       });

// //       if (outcome.finished) return res.status(200).json({ success: true, finished: true });
// //       return res.status(200).json({
// //         success: true,
// //         finished: false,
// //         round: roundPayload(outcome.round, config, totalRounds),
// //       });
// //     } catch (err) {
// //       console.error("Next round error:", err);
// //       return res.status(500).json({ error: "Failed to advance round" });
// //     }
// //   });

// //   // RETRY - same round number, ONE new puzzle shared by everyone who retries
// //   router.post("/rounds/:roundId/retry", async (req, res) => {
// //     try {
// //       const { roundId } = req.params;
// //       const { roomCode } = req.body || {};
// //       if (!roomCode) return res.status(400).json({ error: "roomCode is required" });

// //       const [roundRows] = await db.query(`SELECT * FROM word_scramble_rounds WHERE id = ? LIMIT 1`, [roundId]);
// //       if (roundRows.length === 0) return res.status(404).json({ error: "Round not found" });
// //       const current = roundRows[0];

// //       const [roomRows] = await db.query(
// //         `SELECT * FROM word_scramble_rooms WHERE id = ? AND room_code = ? LIMIT 1`,
// //         [current.room_id, roomCode]
// //       );
// //       if (roomRows.length === 0) return res.status(404).json({ error: "Room not found" });
// //       const room = roomRows[0];
// //       const config = getConfig(room.difficulty);
// //       const totalRounds = getTotalRounds(room, config); // CHANGED

// //       const round = await withRoomLock(room.id, async (conn) => {
// //         const latest = await latestRound(conn, room.id);
// //         if (latest && String(latest.id) !== String(current.id)) return latest; // someone already retried/advanced

// //         const [used] = await conn.query(`SELECT word FROM word_scramble_rounds WHERE room_id = ?`, [room.id]);
// //         return createRound(conn, room, current.round_number, config, used.map((r) => r.word));
// //       });

// //       return res
// //         .status(200)
// //         .json({ success: true, round: roundPayload(round, config, totalRounds) });
// //     } catch (err) {
// //       console.error("Retry round error:", err);
// //       return res.status(500).json({ error: "Failed to load new question", details: err.message });
// //     }
// //   });
// // };
// import React, {
//   useEffect,
//   useState,
//   useCallback,
//   useRef,
// } from "react";

// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Share,
//   SafeAreaView,
//   StatusBar,
//   Animated,
//   Easing,
//   Platform,
//   ActivityIndicator,
//   useWindowDimensions,
// } from "react-native";

// import { Ionicons } from "@expo/vector-icons";

// import { fetchRoom, WordScrambleRoom } from "../api/Wordscrambleapi";

// import { setReady, leaveRoom } from "../api/wsProfileApi";

// import WordScrambleAnimatedBackground from "../components/WordScrambleAnimatedBackground";

// /* =========================================================
//    TYPES
// ========================================================= */

// interface RoomWaitingScreenProps {
//   /**
//    * Backend room object.
//    *
//    * This allows:
//    *
//    * <RoomWaitingScreen room={room} />
//    */
//   room: WordScrambleRoom;

//   /**
//    * Optional values.
//    * These are kept optional so the screen can also work
//    * when opened from a navigation route.
//    */
//   roomCode?: string;
//   playerName?: string;
//   maxPlayers?: number;

//   onBack?: () => void;

//   onStartGame?: () => void | Promise<void>;

//   onOpenChat?: () => void;

//   onOpenRoomSettings?: () => void;
// }

// /* =========================================================
//    THEME
// ========================================================= */

// const C = {
//   bg: "#FFF8F1",
//   card: "#FFFFFF",
//   border: "#F1E7DC",

//   text: "#141B34",
//   sub: "#6B7280",

//   indigo: "#4F46E5",
//   indigoSoft: "#EEF0FF",

//   coral: "#FF6B57",
//   coralSoft: "#FFECE8",

//   yellow: "#F2B640",
//   blue: "#3B82F6",
//   red: "#F0566A",
//   green: "#22B573",

//   greenSoft: "#E3F6EC",

//   grey: "#8A93A6",
//   greySoft: "#F1EEF0",
// };

// const TILE_COLORS = [C.yellow, C.blue, C.red, C.green];

// const TILE_ROTATIONS = ["-6deg", "4deg", "-3deg", "5deg"];

// const FALLBACK_AVATARS = [
//   C.coral,
//   C.blue,
//   C.green,
//   C.yellow,
//   C.red,
//   C.indigo,
//   "#14B8A6",
//   "#F97316",
// ];

// /* how often the lobby refreshes itself (so the host sees new players) */
// const POLL_MS = 2500;

// /* =========================================================
//    HELPERS
// ========================================================= */

// const pick = (obj: any, ...keys: string[]) => {
//   for (const key of keys) {
//     if (obj && obj[key] !== undefined && obj[key] !== null) {
//       return obj[key];
//     }
//   }

//   return undefined;
// };

// const statusInfo = (
//   status?: string
// ): {
//   label: string;
//   color: string;
// } => {
//   switch ((status || "").toLowerCase()) {
//     case "waiting":
//     case "lobby":
//     case "open":
//       return { label: "Lobby open", color: C.green };

//     case "playing":
//     case "in_progress":
//     case "started":
//       return { label: "Game in progress", color: C.blue };

//     case "finished":
//     case "ended":
//     case "completed":
//       return { label: "Game finished", color: C.grey };

//     default:
//       return {
//         label: status
//           ? status.charAt(0).toUpperCase() + status.slice(1)
//           : "Lobby open",
//         color: C.green,
//       };
//   }
// };

// /* =========================================================
//    COMPONENT
// ========================================================= */

// const RoomWaitingScreen: React.FC<RoomWaitingScreenProps> = ({
//   room: initialRoom,
//   roomCode: propRoomCode,
//   playerName: propPlayerName,
//   maxPlayers: propMaxPlayers,
//   onBack,
//   onStartGame,
//   onOpenChat,
//   onOpenRoomSettings,
// }) => {
//   const { width } = useWindowDimensions();

//   const wide = width >= 900;

//   /* -------------------------------------------------------
//      ROOM STATE
//   ------------------------------------------------------- */

//   const [room, setRoom] = useState<WordScrambleRoom | null>(
//     initialRoom || null
//   );

//   const [connError, setConnError] = useState(false);

//   const [copied, setCopied] = useState(false);

//   const [starting, setStarting] = useState(false);

//   const [togglingReady, setTogglingReady] = useState(false);

//   /* -------------------------------------------------------
//      ROOM DATA
//   ------------------------------------------------------- */

//   const r: any = room || {};

//   const roomCode =
//     propRoomCode || pick(r, "roomCode", "room_code", "code") || "";

//   const playerName =
//     propPlayerName ||
//     pick(r, "playerName", "player_name", "hostPlayerName", "host_player_name") ||
//     "";

//   const players: any[] = Array.isArray(r.players) ? r.players : [];

//   const max =
//     Number(pick(r, "maxPlayers", "max_players")) || propMaxPlayers || 2;

//   const roomName: string | undefined = pick(r, "roomName", "room_name", "name");

//   const minPlayers = Number(pick(r, "minPlayers", "min_players")) || 0;

//   const status = statusInfo(r.status);

//   /* -------------------------------------------------------
//      CURRENT PLAYER
//   ------------------------------------------------------- */

//   const me = players.find(
//     (p) => pick(p, "player_name", "playerName", "name") === playerName
//   );

//   const hasReadyField = players.some(
//     (p) => typeof pick(p, "is_ready", "isReady") === "boolean"
//   );

//   const myReady = !!pick(me, "is_ready", "isReady");

//   /* -------------------------------------------------------
//      PLAYER COUNTS

//      START GAME rule:
//        - it stays DISABLED until EVERY seat in the room is filled
//          (joined players === max players, e.g. 4 / 4).
//        - as soon as one player leaves, it is disabled again.
//   ------------------------------------------------------- */

//   const joined = players.length;

//   // players still missing before the game can start
//   const needMore = Math.max(0, Math.max(minPlayers, max) - joined);

//   const roomFull = !!room && needMore === 0;

//   const canStart = roomFull && !starting;

//   const emptySlots = Math.max(0, Math.min(max - joined, 8));

//   const fillPct = max > 0 ? Math.min(100, (joined / max) * 100) : 0;

//   /* =======================================================
//      PULSE ANIMATION
//   ======================================================= */

//   const pulse = useRef(new Animated.Value(0.35)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulse, {
//           toValue: 1,
//           duration: 700,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),

//         Animated.timing(pulse, {
//           toValue: 0.35,
//           duration: 700,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     );

//     loop.start();

//     return () => {
//       loop.stop();
//     };
//   }, [pulse]);

//   /* =======================================================
//      FETCH ROOM
//   ======================================================= */

//   const poll = useCallback(async () => {
//     if (!roomCode) {
//       return;
//     }

//     try {
//       const response = await fetchRoom(roomCode);

//       setRoom(response.room);

//       setConnError(false);
//     } catch (error) {
//       console.warn("Room poll failed:", error);

//       setConnError(true);
//     }
//   }, [roomCode]);

//   /* =======================================================
//      ROOM POLLING

//      Keeps polling the whole time the lobby is open, so:
//        - the host sees guests join (button enables at full room)
//        - the button disables again if somebody leaves
//   ======================================================= */

//   useEffect(() => {
//     poll();

//     const interval = setInterval(poll, POLL_MS);

//     return () => clearInterval(interval);
//   }, [poll]);

//   /* =======================================================
//      COPY FEEDBACK
//   ======================================================= */

//   const flashCopied = () => {
//     setCopied(true);

//     setTimeout(() => {
//       setCopied(false);
//     }, 2000);
//   };

//   /* =======================================================
//      SHARE ROOM
//   ======================================================= */

//   const handleShare = async () => {
//     const message = `Join my Word Scramble room! Code: ${roomCode}`;

//     try {
//       if (Platform.OS === "web") {
//         const nav: any = typeof navigator !== "undefined" ? navigator : null;

//         if (nav?.share) {
//           await nav.share({ text: message });

//           return;
//         }

//         if (nav?.clipboard?.writeText) {
//           await nav.clipboard.writeText(message);

//           flashCopied();

//           return;
//         }
//       }

//       await Share.share({ message });
//     } catch {
//       // user cancelled share
//     }
//   };

//   /* =======================================================
//      COPY ROOM CODE
//   ======================================================= */

//   const handleCopy = async () => {
//     try {
//       const nav: any = typeof navigator !== "undefined" ? navigator : null;

//       if (Platform.OS === "web" && nav?.clipboard?.writeText) {
//         await nav.clipboard.writeText(roomCode);

//         flashCopied();

//         return;
//       }

//       await Share.share({ message: roomCode });
//     } catch {
//       // ignore
//     }
//   };

//   /* =======================================================
//      START GAME
//   ======================================================= */

//   const handleStart = async () => {
//     // safety: never start unless every seat is filled
//     if (!canStart) {
//       return;
//     }

//     if (!onStartGame) {
//       console.warn("onStartGame callback was not provided.");

//       return;
//     }

//     setStarting(true);

//     try {
//       await onStartGame();
//     } finally {
//       setStarting(false);
//     }
//   };

//   /* =======================================================
//      READY
//   ======================================================= */

//   const handleToggleReady = async () => {
//     if (togglingReady || !me || !roomCode || !playerName) {
//       return;
//     }

//     setTogglingReady(true);

//     try {
//       await setReady(roomCode, playerName, !myReady);

//       await poll();
//     } catch (error) {
//       console.warn("Ready toggle failed:", error);
//     } finally {
//       setTogglingReady(false);
//     }
//   };

//   /* =======================================================
//      BACK
//   ======================================================= */

//   const handleBack = async () => {
//     if (roomCode && playerName) {
//       try {
//         await leaveRoom(roomCode, playerName);
//       } catch {
//         // continue back even if API fails
//       }
//     }

//     onBack?.();
//   };

//   /* =======================================================
//      HEADER
//   ======================================================= */

//   const header = (
//     <View style={styles.header}>
//       <TouchableOpacity
//         style={styles.roundButton}
//         onPress={handleBack}
//         activeOpacity={0.8}
//       >
//         <Ionicons name="arrow-back" size={20} color={C.text} />
//       </TouchableOpacity>

//       <View style={styles.headerCenter}>
//         <Text style={styles.headerTitle} numberOfLines={1}>
//           {roomName || `Room ${roomCode}`}
//         </Text>

//         <View style={styles.headerSubRow}>
//           <Animated.View
//             style={[
//               styles.liveDot,
//               {
//                 backgroundColor: status.color,
//                 opacity: pulse,
//               },
//             ]}
//           />

//           <Text style={styles.headerSub}>
//             {status.label}

//             {roomName ? ` • ${roomCode}` : ""}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.headerRight}>
//         <TouchableOpacity
//           style={styles.roundButton}
//           onPress={onOpenChat}
//           activeOpacity={0.8}
//         >
//           <Ionicons
//             name="chatbubble-ellipses-outline"
//             size={19}
//             color={C.indigo}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.roundButton}
//           onPress={onOpenRoomSettings}
//           activeOpacity={0.8}
//         >
//           <Ionicons name="settings-outline" size={19} color={C.indigo} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   /* =======================================================
//      ERROR BANNER
//   ======================================================= */

//   const errorBanner = connError ? (
//     <View style={styles.errorBanner}>
//       <Ionicons name="cloud-offline-outline" size={16} color={C.coral} />

//       <Text style={styles.errorText}>Can't reach the server. Retrying…</Text>
//     </View>
//   ) : null;

//   /* =======================================================
//      HEADING
//   ======================================================= */

//   const heading = (
//     <View style={styles.headingBlock}>
//       <Text style={styles.eyebrow}>LOBBY</Text>

//       <Text style={[styles.headingTitle, !wide && styles.headingTitlePhone]}>
//         {roomFull ? "Everyone is" : "Waiting for"}
//       </Text>

//       <Text
//         style={[
//           styles.headingTitle,
//           !wide && styles.headingTitlePhone,
//           { color: roomFull ? C.green : C.indigo },
//         ]}
//       >
//         {roomFull ? "here!" : "players…"}
//       </Text>

//       <Text style={styles.headingSub}>
//         {roomFull
//           ? "All players have joined. You can start the game now."
//           : "Share the room code with your friends. The game can start only after every player has joined."}
//       </Text>
//     </View>
//   );

//   /* =======================================================
//      PLAYERS CARD
//   ======================================================= */

//   const playersCard = (
//     <View style={styles.card}>
//       <View style={styles.cardHeadRow}>
//         <View>
//           <Text style={styles.cardTitle}>Players</Text>

//           <Text style={styles.cardSub}>Everyone in this room</Text>
//         </View>

//         <View style={styles.countPill}>
//           <Ionicons name="people-outline" size={14} color={C.indigo} />

//           <Text style={styles.countPillText}>
//             {joined}/{max}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.playerList}>
//         {!room &&
//           !connError &&
//           [0, 1].map((i) => (
//             <View key={`sk-${i}`} style={[styles.playerRow, { opacity: 0.6 }]}>
//               <View style={[styles.avatar, { backgroundColor: C.greySoft }]} />

//               <View style={{ flex: 1, gap: 6 }}>
//                 <View style={[styles.skelLine, { width: "40%" }]} />

//                 <View style={[styles.skelLine, { width: "25%", height: 8 }]} />
//               </View>
//             </View>
//           ))}

//         {players.map((p, i) => {
//           const currentName = pick(p, "player_name", "playerName", "name");

//           const isMe = currentName === playerName;

//           const isHost = !!pick(p, "is_host", "isHost");

//           const readyVal = pick(p, "is_ready", "isReady");

//           const color =
//             pick(p, "avatar_color", "avatarColor") ||
//             FALLBACK_AVATARS[i % FALLBACK_AVATARS.length];

//           return (
//             <View
//               key={String(p.id ?? currentName ?? i)}
//               style={styles.playerRow}
//             >
//               <View style={[styles.avatar, { backgroundColor: color }]}>
//                 <Text style={styles.avatarText}>
//                   {(currentName || "?").charAt(0).toUpperCase()}
//                 </Text>
//               </View>

//               <View style={{ flex: 1 }}>
//                 <Text style={styles.playerName} numberOfLines={1}>
//                   {currentName || "Player"}
//                 </Text>

//                 {isMe || isHost ? (
//                   <Text style={styles.playerTag}>
//                     {[isMe ? "That's you" : null, isHost ? "Host" : null]
//                       .filter(Boolean)
//                       .join(" • ")}
//                   </Text>
//                 ) : null}
//               </View>

//               {typeof readyVal === "boolean" ? (
//                 <View
//                   style={[
//                     styles.badge,
//                     {
//                       backgroundColor: readyVal ? C.greenSoft : C.greySoft,
//                     },
//                   ]}
//                 >
//                   <View
//                     style={[
//                       styles.badgeDot,
//                       {
//                         backgroundColor: readyVal ? C.green : C.grey,
//                       },
//                     ]}
//                   />

//                   <Text
//                     style={[
//                       styles.badgeText,
//                       {
//                         color: readyVal ? C.green : C.grey,
//                       },
//                     ]}
//                   >
//                     {readyVal ? "Ready" : "Not ready"}
//                   </Text>
//                 </View>
//               ) : null}
//             </View>
//           );
//         })}

//         {room
//           ? Array.from({ length: emptySlots }).map((_, i) => (
//               <View key={`empty-${i}`} style={styles.emptyRow}>
//                 <View style={styles.emptyAvatar}>
//                   <Ionicons
//                     name="person-add-outline"
//                     size={15}
//                     color="#B8AFA5"
//                   />
//                 </View>

//                 <Text style={styles.emptyText}>Waiting for player…</Text>

//                 <Animated.View
//                   style={[styles.emptyDot, { opacity: pulse }]}
//                 />
//               </View>
//             ))
//           : null}
//       </View>
//     </View>
//   );

//   /* =======================================================
//      ROOM CODE CARD
//   ======================================================= */

//   const codeCard = (
//     <View style={styles.card}>
//       <Text style={styles.cardTitle}>Room code</Text>

//       <Text style={styles.cardSub}>Friends enter this to join</Text>

//       <View style={styles.tilesRow}>
//         {String(roomCode)
//           .split("")
//           .map((ch, i) => (
//             <View
//               key={i}
//               style={[
//                 styles.tile,
//                 {
//                   backgroundColor: TILE_COLORS[i % TILE_COLORS.length],

//                   transform: [
//                     {
//                       rotate: TILE_ROTATIONS[i % TILE_ROTATIONS.length],
//                     },
//                   ],

//                   shadowColor: TILE_COLORS[i % TILE_COLORS.length],
//                 },
//               ]}
//             >
//               <Text style={styles.tileText}>{ch}</Text>
//             </View>
//           ))}
//       </View>

//       <View style={styles.codeActions}>
//         <TouchableOpacity
//           style={styles.softButton}
//           onPress={handleCopy}
//           activeOpacity={0.8}
//         >
//           <Ionicons
//             name={copied ? "checkmark" : "copy-outline"}
//             size={16}
//             color={C.indigo}
//           />

//           <Text style={styles.softButtonText}>
//             {copied ? "Copied!" : "Copy"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.softButton}
//           onPress={handleShare}
//           activeOpacity={0.8}
//         >
//           <Ionicons name="share-social-outline" size={16} color={C.indigo} />

//           <Text style={styles.softButtonText}>Share</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.divider} />

//       <View style={styles.progressHead}>
//         <Text style={styles.progressLabel}>Players joined</Text>

//         <Text style={styles.progressValue}>
//           {joined} / {max}
//         </Text>
//       </View>

//       <View style={styles.progressTrack}>
//         <View
//           style={[
//             styles.progressFill,
//             { width: `${fillPct}%` },
//             roomFull && { backgroundColor: C.green },
//           ]}
//         />
//       </View>

//       {hasReadyField && me ? (
//         <TouchableOpacity
//           style={[styles.readyToggle, myReady && styles.readyToggleOn]}
//           onPress={handleToggleReady}
//           activeOpacity={0.85}
//           disabled={togglingReady}
//         >
//           {togglingReady ? (
//             <ActivityIndicator
//               size="small"
//               color={myReady ? C.green : C.indigo}
//             />
//           ) : (
//             <Ionicons
//               name={myReady ? "checkmark-circle" : "ellipse-outline"}
//               size={18}
//               color={myReady ? C.green : C.indigo}
//             />
//           )}

//           <Text
//             style={[
//               styles.readyToggleText,
//               { color: myReady ? C.green : C.indigo },
//             ]}
//           >
//             {myReady ? "You're ready" : "Mark me as ready"}
//           </Text>
//         </TouchableOpacity>
//       ) : null}

//       {/* START GAME: disabled (grey + lock) until every player has joined */}
//       <TouchableOpacity
//         style={[styles.startWrap, !canStart && styles.startWrapDisabled]}
//         activeOpacity={0.88}
//         onPress={handleStart}
//         disabled={!canStart}
//         accessibilityRole="button"
//         accessibilityState={{ disabled: !canStart }}
//       >
//         <View
//           style={[styles.startButton, !canStart && styles.startButtonDisabled]}
//         >
//           {starting ? (
//             <ActivityIndicator color="#FFFFFF" />
//           ) : (
//             <>
//               <Text
//                 style={[
//                   styles.startButtonText,
//                   !canStart && styles.startButtonTextDisabled,
//                 ]}
//               >
//                 START GAME
//               </Text>

//               <View
//                 style={[
//                   styles.startArrow,
//                   !canStart && styles.startArrowDisabled,
//                 ]}
//               >
//                 <Ionicons
//                   name={canStart ? "arrow-forward" : "lock-closed"}
//                   size={16}
//                   color={canStart ? "#FFFFFF" : "#8A93A6"}
//                 />
//               </View>
//             </>
//           )}
//         </View>
//       </TouchableOpacity>

//       {needMore > 0 ? (
//         <Text style={styles.startHint}>
//           Waiting for {needMore} more {needMore === 1 ? "player" : "players"} to
//           join ({joined}/{max})
//         </Text>
//       ) : (
//         <Text style={[styles.startHint, { color: C.green }]}>
//           All players joined. Ready to start!
//         </Text>
//       )}
//     </View>
//   );

//   /* =======================================================
//      RETURN
//   ======================================================= */

//   return (
//     <View style={styles.flex}>
//       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

//       {/* NEW: animated background - FIRST child, behind everything */}
//       <WordScrambleAnimatedBackground backgroundColor={C.bg} />

//       {/* CHANGED: transparent, so the animation shows through */}
//       <SafeAreaView style={styles.safe}>
//         <ScrollView
//           contentContainerStyle={[
//             styles.scroll,
//             {
//               paddingHorizontal: wide ? 32 : 16,

//               paddingTop:
//                 Platform.OS === "android"
//                   ? (StatusBar.currentHeight ?? 0) + 8
//                   : 16,
//             },
//           ]}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.column}>
//             {header}

//             {errorBanner}

//             {wide ? (
//               <View style={styles.wideRow}>
//                 <View style={styles.mainCol}>
//                   {heading}

//                   {playersCard}
//                 </View>

//                 <View style={styles.sideCol}>{codeCard}</View>
//               </View>
//             ) : (
//               <View style={{ gap: 16 }}>
//                 {heading}

//                 {codeCard}

//                 {playersCard}
//               </View>
//             )}
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </View>
//   );
// };

// export default RoomWaitingScreen;

// /* =========================================================
//    STYLES
// ========================================================= */

// const styles = StyleSheet.create({
//   flex: {
//     flex: 1,
//     backgroundColor: C.bg,
//   },

//   // NEW: must be transparent, otherwise it hides the animated background
//   safe: {
//     flex: 1,
//     backgroundColor: "transparent",
//   },

//   scroll: {
//     paddingBottom: 32,
//   },

//   column: {
//     width: "100%",
//   },

//   wideRow: {
//     flexDirection: "row",
//     gap: 24,
//     alignItems: "flex-start",
//   },

//   mainCol: {
//     flex: 1,
//     gap: 18,
//     minWidth: 0,
//   },

//   sideCol: {
//     flex: 1,
//     maxWidth: 420,
//     marginTop: 8,
//   },

//   /* HEADER */

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 8,
//     gap: 8,
//   },

//   headerCenter: {
//     flex: 1,
//     alignItems: "center",
//   },

//   headerTitle: {
//     color: C.text,
//     fontSize: 17,
//     fontWeight: "800",
//   },

//   headerSubRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginTop: 3,
//   },

//   liveDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//   },

//   headerSub: {
//     color: C.sub,
//     fontSize: 12,
//   },

//   headerRight: {
//     flexDirection: "row",
//     gap: 8,
//   },

//   roundButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: C.card,
//     borderWidth: 1,
//     borderColor: C.border,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   /* ERROR */

//   errorBanner: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginTop: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 14,
//     backgroundColor: C.coralSoft,
//   },

//   errorText: {
//     color: C.coral,
//     fontSize: 13,
//     fontWeight: "700",
//   },

//   /* HEADING */

//   headingBlock: {
//     marginTop: 14,
//   },

//   eyebrow: {
//     color: C.coral,
//     fontSize: 12,
//     fontWeight: "800",
//     letterSpacing: 1.5,
//     marginBottom: 6,
//   },

//   headingTitle: {
//     color: C.text,
//     fontSize: 38,
//     fontWeight: "900",
//     lineHeight: 44,
//   },

//   headingTitlePhone: {
//     fontSize: 30,
//     lineHeight: 36,
//   },

//   headingSub: {
//     color: C.sub,
//     fontSize: 15,
//     lineHeight: 22,
//     marginTop: 10,
//     maxWidth: 480,
//   },

//   /* CARDS */

//   card: {
//     backgroundColor: C.card,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: C.border,
//     padding: 20,

//     shadowColor: "#B8A48C",
//     shadowOpacity: 0.12,
//     shadowRadius: 16,
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },

//     elevation: 2,
//   },

//   cardHeadRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   cardTitle: {
//     color: C.text,
//     fontSize: 18,
//     fontWeight: "800",
//   },

//   cardSub: {
//     color: C.sub,
//     fontSize: 12.5,
//     marginTop: 3,
//   },

//   countPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 14,
//     backgroundColor: C.indigoSoft,
//   },

//   countPillText: {
//     color: C.indigo,
//     fontWeight: "800",
//     fontSize: 13,
//   },

//   /* PLAYERS */

//   playerList: {
//     marginTop: 16,
//     gap: 10,
//   },

//   playerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     borderRadius: 16,
//     backgroundColor: "#FFFBF6",
//     borderWidth: 1,
//     borderColor: C.border,
//   },

//   avatar: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   avatarText: {
//     color: "#FFFFFF",
//     fontSize: 17,
//     fontWeight: "900",
//   },

//   playerName: {
//     color: C.text,
//     fontSize: 15,
//     fontWeight: "800",
//   },

//   playerTag: {
//     color: C.sub,
//     fontSize: 11.5,
//     marginTop: 2,
//   },

//   badge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 5,
//     paddingHorizontal: 11,
//     borderRadius: 12,
//   },

//   badgeDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//   },

//   badgeText: {
//     fontSize: 12,
//     fontWeight: "800",
//   },

//   skelLine: {
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: C.greySoft,
//   },

//   emptyRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     borderRadius: 16,
//     borderWidth: 1.5,
//     borderStyle: "dashed",
//     borderColor: "#E6DACB",
//   },

//   emptyAvatar: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: "#F6EFE6",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   emptyText: {
//     flex: 1,
//     color: "#A79D92",
//     fontSize: 14,
//     fontWeight: "600",
//   },

//   emptyDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: C.coral,
//   },

//   /* ROOM CODE */

//   tilesRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 10,
//     marginTop: 20,
//     marginBottom: 18,
//     flexWrap: "wrap",
//   },

//   tile: {
//     width: 54,
//     height: 54,
//     borderRadius: 15,
//     justifyContent: "center",
//     alignItems: "center",

//     shadowOpacity: 0.35,
//     shadowRadius: 10,
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },

//     elevation: 4,
//   },

//   tileText: {
//     color: "#FFFFFF",
//     fontSize: 26,
//     fontWeight: "900",
//   },

//   codeActions: {
//     flexDirection: "row",
//     gap: 10,
//   },

//   softButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     paddingVertical: 12,
//     borderRadius: 14,
//     backgroundColor: C.indigoSoft,
//   },

//   softButtonText: {
//     color: C.indigo,
//     fontWeight: "800",
//     fontSize: 14,
//   },

//   divider: {
//     height: 1,
//     backgroundColor: C.border,
//     marginVertical: 18,
//   },

//   progressHead: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },

//   progressLabel: {
//     color: C.sub,
//     fontSize: 13,
//   },

//   progressValue: {
//     color: C.text,
//     fontSize: 13,
//     fontWeight: "800",
//   },

//   progressTrack: {
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#F1EAE0",
//     overflow: "hidden",
//   },

//   progressFill: {
//     height: "100%",
//     borderRadius: 4,
//     backgroundColor: C.indigo,
//   },

//   /* READY */

//   readyToggle: {
//     marginTop: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     paddingVertical: 12,
//     borderRadius: 14,
//     borderWidth: 1.5,
//     borderColor: C.indigo,
//     backgroundColor: "#FFFFFF",
//   },

//   readyToggleOn: {
//     borderColor: C.green,
//     backgroundColor: C.greenSoft,
//   },

//   readyToggleText: {
//     fontWeight: "800",
//     fontSize: 14,
//   },

//   /* START */

//   startWrap: {
//     marginTop: 16,
//     borderRadius: 18,

//     shadowColor: C.indigo,
//     shadowOpacity: 0.35,
//     shadowRadius: 14,
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },

//     elevation: 6,
//   },

//   startWrapDisabled: {
//     shadowOpacity: 0,
//     elevation: 0,
//   },

//   startButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 12,
//     height: 58,
//     borderRadius: 18,
//     backgroundColor: C.indigo,
//   },

//   // clearly greyed-out so the player can see it is locked
//   startButtonDisabled: {
//     backgroundColor: "#E3E5EE",
//     borderWidth: 1.5,
//     borderColor: "#D2D6E4",
//   },

//   startButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "900",
//     letterSpacing: 1,
//   },

//   startButtonTextDisabled: {
//     color: "#8A93A6",
//   },

//   startArrow: {
//     width: 30,
//     height: 30,
//     borderRadius: 10,
//     backgroundColor: "rgba(255,255,255,0.22)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   startArrowDisabled: {
//     backgroundColor: "rgba(138,147,166,0.18)",
//   },

//   startHint: {
//     color: C.sub,
//     fontSize: 12.5,
//     textAlign: "center",
//     marginTop: 10,
//   },
// });
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