// // // // // // // // // // // const { v4: uuidv4 } = require("uuid");
// // // // // // // // // // // const pool = require("../db");
// // // // // // // // // // // const { DIFFICULTY_CONFIG, VALID_DIFFICULTIES } = require("../config/difficulty");
// // // // // // // // // // // const { generateSecretCode } = require("../utils/random");
// // // // // // // // // // // const { computeFeedback } = require("../utils/feedback");

// // // // // // // // // // // // helper: DB stores the secret/guess as a string like "0472"
// // // // // // // // // // // const toArray = (str) => str.split("").map(Number);
// // // // // // // // // // // const toStr = (arr) => arr.join("");

// // // // // // // // // // // // Strip the secret code out of a game row unless the game is finished.
// // // // // // // // // // // function publicGame(row, { includeSecret = false } = {}) {
// // // // // // // // // // //   return {
// // // // // // // // // // //     gameId: row.id,
// // // // // // // // // // //     difficulty: row.difficulty,
// // // // // // // // // // //     codeLength: row.code_length,
// // // // // // // // // // //     maxAttempts: row.max_attempts,
// // // // // // // // // // //     timeLimitSec: row.time_limit_sec,
// // // // // // // // // // //     attemptsUsed: row.attempts_used,
// // // // // // // // // // //     attemptsLeft: row.max_attempts - row.attempts_used,
// // // // // // // // // // //     score: row.score,
// // // // // // // // // // //     status: row.status, // 'playing' | 'won' | 'lost'
// // // // // // // // // // //     startedAt: row.started_at,
// // // // // // // // // // //     finishedAt: row.finished_at,
// // // // // // // // // // //     ...(includeSecret || row.status !== "playing"
// // // // // // // // // // //       ? { secretCode: toArray(row.secret_code) }
// // // // // // // // // // //       : {}),
// // // // // // // // // // //   };
// // // // // // // // // // // }

// // // // // // // // // // // // POST /api/games/start   { difficulty }
// // // // // // // // // // // async function startGame(req, res) {
// // // // // // // // // // //   const { difficulty } = req.body;

// // // // // // // // // // //   if (!VALID_DIFFICULTIES.includes(difficulty)) {
// // // // // // // // // // //     return res.status(400).json({
// // // // // // // // // // //       error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
// // // // // // // // // // //     });
// // // // // // // // // // //   }

// // // // // // // // // // //   const config = DIFFICULTY_CONFIG[difficulty];
// // // // // // // // // // //   const secret = generateSecretCode(config.codeLength);
// // // // // // // // // // //   const id = uuidv4();

// // // // // // // // // // //   await pool.query(
// // // // // // // // // // //     `INSERT INTO games (id, difficulty, secret_code, code_length, max_attempts, time_limit_sec)
// // // // // // // // // // //      VALUES (?, ?, ?, ?, ?, ?)`,
// // // // // // // // // // //     [id, difficulty, toStr(secret), config.codeLength, config.maxAttempts, config.timeLimitSec]
// // // // // // // // // // //   );

// // // // // // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [id]);
// // // // // // // // // // //   res.status(201).json(publicGame(rows[0]));
// // // // // // // // // // // }

// // // // // // // // // // // // GET /api/games/:gameId
// // // // // // // // // // // async function getGame(req, res) {
// // // // // // // // // // //   const { gameId } = req.params;
// // // // // // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // // // // // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // // // // // // // //   const [guesses] = await pool.query(
// // // // // // // // // // //     "SELECT guess, exact_matches, partial_matches, created_at FROM guesses WHERE game_id = ? ORDER BY id ASC",
// // // // // // // // // // //     [gameId]
// // // // // // // // // // //   );

// // // // // // // // // // //   res.json({
// // // // // // // // // // //     ...publicGame(rows[0]),
// // // // // // // // // // //     history: guesses.map((g) => ({
// // // // // // // // // // //       guess: toArray(g.guess),
// // // // // // // // // // //       feedback: { exactMatches: g.exact_matches, partialMatches: g.partial_matches },
// // // // // // // // // // //       createdAt: g.created_at,
// // // // // // // // // // //     })),
// // // // // // // // // // //   });
// // // // // // // // // // // }

// // // // // // // // // // // // POST /api/games/:gameId/guess   { guess: number[], timeLeft?: number }
// // // // // // // // // // // async function submitGuess(req, res) {
// // // // // // // // // // //   const { gameId } = req.params;
// // // // // // // // // // //   const { guess, timeLeft } = req.body;

// // // // // // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // // // // // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // // // // // // // //   const game = rows[0];

// // // // // // // // // // //   if (game.status !== "playing") {
// // // // // // // // // // //     return res.status(409).json({ error: `Game already finished (${game.status})`, ...publicGame(game) });
// // // // // // // // // // //   }
// // // // // // // // // // //   if (!Array.isArray(guess) || guess.length !== game.code_length || guess.some((d) => !Number.isInteger(d) || d < 0 || d > 9)) {
// // // // // // // // // // //     return res.status(400).json({ error: `Guess must be an array of ${game.code_length} digits (0-9)` });
// // // // // // // // // // //   }

// // // // // // // // // // //   const secretArr = toArray(game.secret_code);
// // // // // // // // // // //   const feedback = computeFeedback(secretArr, guess);
// // // // // // // // // // //   const gained = feedback.exactMatches * 30 + feedback.partialMatches * 10;

// // // // // // // // // // //   const newAttemptsUsed = game.attempts_used + 1;
// // // // // // // // // // //   let newScore = game.score + gained;

// // // // // // // // // // //   const won = feedback.exactMatches === game.code_length;
// // // // // // // // // // //   const outOfAttempts = !won && newAttemptsUsed >= game.max_attempts;

// // // // // // // // // // //   let status = "playing";
// // // // // // // // // // //   let finishedAt = null;

// // // // // // // // // // //   if (won) {
// // // // // // // // // // //     status = "won";
// // // // // // // // // // //     finishedAt = new Date();
// // // // // // // // // // //     const safeTimeLeft = Number.isFinite(timeLeft) ? Math.max(0, timeLeft) : 0;
// // // // // // // // // // //     newScore += safeTimeLeft * 2; // time bonus, mirrors the frontend's original logic
// // // // // // // // // // //   } else if (outOfAttempts) {
// // // // // // // // // // //     status = "lost";
// // // // // // // // // // //     finishedAt = new Date();
// // // // // // // // // // //   }

// // // // // // // // // // //   await pool.query(
// // // // // // // // // // //     `INSERT INTO guesses (game_id, guess, exact_matches, partial_matches) VALUES (?, ?, ?, ?)`,
// // // // // // // // // // //     [gameId, toStr(guess), feedback.exactMatches, feedback.partialMatches]
// // // // // // // // // // //   );

// // // // // // // // // // //   await pool.query(
// // // // // // // // // // //     `UPDATE games SET attempts_used = ?, score = ?, status = ?, finished_at = ? WHERE id = ?`,
// // // // // // // // // // //     [newAttemptsUsed, newScore, status, finishedAt, gameId]
// // // // // // // // // // //   );

// // // // // // // // // // //   const [updatedRows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);

// // // // // // // // // // //   res.json({
// // // // // // // // // // //     ...publicGame(updatedRows[0]),
// // // // // // // // // // //     feedback,
// // // // // // // // // // //   });
// // // // // // // // // // // }

// // // // // // // // // // // // GET /api/stats
// // // // // // // // // // // async function getStats(req, res) {
// // // // // // // // // // //   const [[totals]] = await pool.query(
// // // // // // // // // // //     `SELECT
// // // // // // // // // // //        COUNT(*) AS gamesPlayed,
// // // // // // // // // // //        SUM(status = 'won') AS wins,
// // // // // // // // // // //        SUM(status = 'lost') AS losses,
// // // // // // // // // // //        MAX(score) AS highScore,
// // // // // // // // // // //        AVG(CASE WHEN status = 'won' THEN attempts_used END) AS avgAttemptsToWin
// // // // // // // // // // //      FROM games
// // // // // // // // // // //      WHERE status != 'playing'`
// // // // // // // // // // //   );

// // // // // // // // // // //   res.json({
// // // // // // // // // // //     gamesPlayed: totals.gamesPlayed || 0,
// // // // // // // // // // //     wins: totals.wins || 0,
// // // // // // // // // // //     losses: totals.losses || 0,
// // // // // // // // // // //     highScore: totals.highScore || 0,
// // // // // // // // // // //     avgAttemptsToWin: totals.avgAttemptsToWin ? Number(totals.avgAttemptsToWin).toFixed(1) : null,
// // // // // // // // // // //   });
// // // // // // // // // // // }

// // // // // // // // // // // // GET /api/highscore
// // // // // // // // // // // async function getHighScore(req, res) {
// // // // // // // // // // //   const [[row]] = await pool.query("SELECT MAX(score) AS highScore FROM games WHERE status = 'won'");
// // // // // // // // // // //   res.json({ highScore: row.highScore || 0 });
// // // // // // // // // // // }

// // // // // // // // // // // module.exports = { startGame, getGame, submitGuess, getStats, getHighScore };
// // // // // // // // // // const { v4: uuidv4 } = require("uuid");
// // // // // // // // // // const pool = require("../db");
// // // // // // // // // // const { DIFFICULTY_CONFIG, VALID_DIFFICULTIES } = require("../config/difficulty");
// // // // // // // // // // const { generateSecretCode } = require("../utils/random");
// // // // // // // // // // const { computeFeedback } = require("../utils/feedback");

// // // // // // // // // // // helper: DB stores the secret/guess as a string like "0472"
// // // // // // // // // // const toArray = (str) => str.split("").map(Number);
// // // // // // // // // // const toStr = (arr) => arr.join("");

// // // // // // // // // // // Strip the secret code out of a game row unless the game is finished.
// // // // // // // // // // function publicGame(row, { includeSecret = false } = {}) {
// // // // // // // // // //   return {
// // // // // // // // // //     gameId: row.id,
// // // // // // // // // //     difficulty: row.difficulty,
// // // // // // // // // //     codeLength: row.code_length,
// // // // // // // // // //     maxAttempts: row.max_attempts,
// // // // // // // // // //     timeLimitSec: row.time_limit_sec,
// // // // // // // // // //     attemptsUsed: row.attempts_used,
// // // // // // // // // //     attemptsLeft: row.max_attempts - row.attempts_used,
// // // // // // // // // //     score: row.score,
// // // // // // // // // //     status: row.status, // 'playing' | 'won' | 'lost'
// // // // // // // // // //     startedAt: row.started_at,
// // // // // // // // // //     finishedAt: row.finished_at,
// // // // // // // // // //     ...(includeSecret || row.status !== "playing"
// // // // // // // // // //       ? { secretCode: toArray(row.secret_code) }
// // // // // // // // // //       : {}),
// // // // // // // // // //   };
// // // // // // // // // // }

// // // // // // // // // // // POST /api/game/start   { difficulty }
// // // // // // // // // // async function startGame(req, res) {
// // // // // // // // // //   const { difficulty } = req.body;

// // // // // // // // // //   if (!VALID_DIFFICULTIES.includes(difficulty)) {
// // // // // // // // // //     return res.status(400).json({
// // // // // // // // // //       error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
// // // // // // // // // //     });
// // // // // // // // // //   }

// // // // // // // // // //   const config = DIFFICULTY_CONFIG[difficulty];
// // // // // // // // // //   const secret = generateSecretCode(config.codeLength);
// // // // // // // // // //   const id = uuidv4();

// // // // // // // // // //   await pool.query(
// // // // // // // // // //     `INSERT INTO games (id, difficulty, secret_code, code_length, max_attempts, time_limit_sec)
// // // // // // // // // //      VALUES (?, ?, ?, ?, ?, ?)`,
// // // // // // // // // //     [id, difficulty, toStr(secret), config.codeLength, config.maxAttempts, config.timeLimitSec]
// // // // // // // // // //   );

// // // // // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [id]);
// // // // // // // // // //   res.status(201).json(publicGame(rows[0]));
// // // // // // // // // // }

// // // // // // // // // // // GET /api/games/:gameId
// // // // // // // // // // async function getGame(req, res) {
// // // // // // // // // //   const { gameId } = req.params;
// // // // // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // // // // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // // // // // // //   const [guesses] = await pool.query(
// // // // // // // // // //     "SELECT guess, exact_matches, partial_matches, created_at FROM guesses WHERE game_id = ? ORDER BY id ASC",
// // // // // // // // // //     [gameId]
// // // // // // // // // //   );

// // // // // // // // // //   res.json({
// // // // // // // // // //     ...publicGame(rows[0]),
// // // // // // // // // //     history: guesses.map((g) => ({
// // // // // // // // // //       guess: toArray(g.guess),
// // // // // // // // // //       feedback: { exactMatches: g.exact_matches, partialMatches: g.partial_matches },
// // // // // // // // // //       createdAt: g.created_at,
// // // // // // // // // //     })),
// // // // // // // // // //   });
// // // // // // // // // // }

// // // // // // // // // // // POST /api/games/:gameId/guess   { guess: number[], timeLeft?: number }
// // // // // // // // // // async function submitGuess(req, res) {
// // // // // // // // // //   const { gameId } = req.params;
// // // // // // // // // //   const { guess, timeLeft } = req.body;

// // // // // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // // // // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // // // // // // //   const game = rows[0];

// // // // // // // // // //   if (game.status !== "playing") {
// // // // // // // // // //     return res.status(409).json({ error: `Game already finished (${game.status})`, ...publicGame(game) });
// // // // // // // // // //   }
// // // // // // // // // //   if (!Array.isArray(guess) || guess.length !== game.code_length || guess.some((d) => !Number.isInteger(d) || d < 0 || d > 9)) {
// // // // // // // // // //     return res.status(400).json({ error: `Guess must be an array of ${game.code_length} digits (0-9)` });
// // // // // // // // // //   }

// // // // // // // // // //   const secretArr = toArray(game.secret_code);
// // // // // // // // // //   const feedback = computeFeedback(secretArr, guess);
// // // // // // // // // //   const gained = feedback.exactMatches * 30 + feedback.partialMatches * 10;

// // // // // // // // // //   const newAttemptsUsed = game.attempts_used + 1;
// // // // // // // // // //   let newScore = game.score + gained;

// // // // // // // // // //   const won = feedback.exactMatches === game.code_length;
// // // // // // // // // //   const outOfAttempts = !won && newAttemptsUsed >= game.max_attempts;

// // // // // // // // // //   let status = "playing";
// // // // // // // // // //   let finishedAt = null;

// // // // // // // // // //   if (won) {
// // // // // // // // // //     status = "won";
// // // // // // // // // //     finishedAt = new Date();
// // // // // // // // // //     const safeTimeLeft = Number.isFinite(timeLeft) ? Math.max(0, timeLeft) : 0;
// // // // // // // // // //     newScore += safeTimeLeft * 2; // time bonus, mirrors the frontend's original logic
// // // // // // // // // //   } else if (outOfAttempts) {
// // // // // // // // // //     status = "lost";
// // // // // // // // // //     finishedAt = new Date();
// // // // // // // // // //   }

// // // // // // // // // //   await pool.query(
// // // // // // // // // //     `INSERT INTO guesses (game_id, guess, exact_matches, partial_matches) VALUES (?, ?, ?, ?)`,
// // // // // // // // // //     [gameId, toStr(guess), feedback.exactMatches, feedback.partialMatches]
// // // // // // // // // //   );

// // // // // // // // // //   await pool.query(
// // // // // // // // // //     `UPDATE games SET attempts_used = ?, score = ?, status = ?, finished_at = ? WHERE id = ?`,
// // // // // // // // // //     [newAttemptsUsed, newScore, status, finishedAt, gameId]
// // // // // // // // // //   );

// // // // // // // // // //   const [updatedRows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);

// // // // // // // // // //   res.json({
// // // // // // // // // //     ...publicGame(updatedRows[0]),
// // // // // // // // // //     feedback,
// // // // // // // // // //   });
// // // // // // // // // // }

// // // // // // // // // // // GET /api/stats
// // // // // // // // // // // Response shape matches the frontend's StatsResponse interface exactly:
// // // // // // // // // // // { highScore, gamesPlayed, gamesWon, currentStreak, bestStreak, avgAttempts }
// // // // // // // // // // async function getStats(req, res) {
// // // // // // // // // //   const [[totals]] = await pool.query(
// // // // // // // // // //     `SELECT
// // // // // // // // // //        COUNT(*) AS gamesPlayed,
// // // // // // // // // //        SUM(status = 'won') AS wins,
// // // // // // // // // //        MAX(score) AS highScore,
// // // // // // // // // //        AVG(CASE WHEN status = 'won' THEN attempts_used END) AS avgAttemptsToWin
// // // // // // // // // //      FROM games
// // // // // // // // // //      WHERE status != 'playing'`
// // // // // // // // // //   );

// // // // // // // // // //   // Pull finished games in chronological order to compute win streaks.
// // // // // // // // // //   // (currentStreak = consecutive wins ending at the most recent finished game,
// // // // // // // // // //   //  bestStreak = longest consecutive-win run anywhere in the history)
// // // // // // // // // //   const [finishedGames] = await pool.query(
// // // // // // // // // //     `SELECT status FROM games WHERE status != 'playing' ORDER BY finished_at ASC`
// // // // // // // // // //   );

// // // // // // // // // //   let bestStreak = 0;
// // // // // // // // // //   let runningStreak = 0;
// // // // // // // // // //   for (const game of finishedGames) {
// // // // // // // // // //     if (game.status === "won") {
// // // // // // // // // //       runningStreak += 1;
// // // // // // // // // //       bestStreak = Math.max(bestStreak, runningStreak);
// // // // // // // // // //     } else {
// // // // // // // // // //       runningStreak = 0;
// // // // // // // // // //     }
// // // // // // // // // //   }

// // // // // // // // // //   // currentStreak is the streak counted backwards from the most recent game
// // // // // // // // // //   let currentStreak = 0;
// // // // // // // // // //   for (let i = finishedGames.length - 1; i >= 0; i--) {
// // // // // // // // // //     if (finishedGames[i].status === "won") {
// // // // // // // // // //       currentStreak += 1;
// // // // // // // // // //     } else {
// // // // // // // // // //       break;
// // // // // // // // // //     }
// // // // // // // // // //   }

// // // // // // // // // //   res.json({
// // // // // // // // // //     highScore: totals.highScore || 0,
// // // // // // // // // //     gamesPlayed: totals.gamesPlayed || 0,
// // // // // // // // // //     gamesWon: totals.wins || 0,
// // // // // // // // // //     currentStreak,
// // // // // // // // // //     bestStreak,
// // // // // // // // // //     avgAttempts: totals.avgAttemptsToWin ? Number(totals.avgAttemptsToWin) : 0,
// // // // // // // // // //   });
// // // // // // // // // // }

// // // // // // // // // // // GET /api/highscore
// // // // // // // // // // async function getHighScore(req, res) {
// // // // // // // // // //   const [[row]] = await pool.query("SELECT MAX(score) AS highScore FROM games WHERE status = 'won'");
// // // // // // // // // //   res.json({ highScore: row.highScore || 0 });
// // // // // // // // // // }

// // // // // // // // // // module.exports = { startGame, getGame, submitGuess, getStats, getHighScore };
// // // // // // // // // const { v4: uuidv4 } = require("uuid");
// // // // // // // // // const pool = require("../db");
// // // // // // // // // const { DIFFICULTY_CONFIG, VALID_DIFFICULTIES } = require("../config/difficulty");
// // // // // // // // // const { generateSecretCode } = require("../utils/random");
// // // // // // // // // const {
// // // // // // // // //   computeFeedback,
// // // // // // // // //   computeDirectReveal,
// // // // // // // // //   mergeReveal,
// // // // // // // // //   countNewlyRevealed,
// // // // // // // // //   revealToStr,
// // // // // // // // //   strToReveal,
// // // // // // // // // } = require("../utils/feedback");

// // // // // // // // // const toArray = (str) => str.split("").map(Number);
// // // // // // // // // const toStr = (arr) => arr.join("");

// // // // // // // // // // Strip the secret code out of a game row unless the game is finished.
// // // // // // // // // function publicGame(row, { includeSecret = false } = {}) {
// // // // // // // // //   const config = DIFFICULTY_CONFIG[row.difficulty];

// // // // // // // // //   return {
// // // // // // // // //     gameId: row.id,
// // // // // // // // //     difficulty: row.difficulty,
// // // // // // // // //     clueType: config.clueType,
// // // // // // // // //     rounds: config.rounds,
// // // // // // // // //     codeLength: row.code_length,
// // // // // // // // //     maxAttempts: row.max_attempts,
// // // // // // // // //     timeLimitSec: row.time_limit_sec,
// // // // // // // // //     attemptsUsed: row.attempts_used,
// // // // // // // // //     attemptsLeft: row.max_attempts - row.attempts_used,
// // // // // // // // //     score: row.score,
// // // // // // // // //     status: row.status, // 'playing' | 'won' | 'lost'
// // // // // // // // //     startedAt: row.started_at,
// // // // // // // // //     finishedAt: row.finished_at,
// // // // // // // // //     // Only meaningful for "direct" (easy) clueType — the positions found so far.
// // // // // // // // //     ...(config.clueType === "direct" && row.revealed_code
// // // // // // // // //       ? { revealedCode: strToReveal(row.revealed_code) }
// // // // // // // // //       : {}),
// // // // // // // // //     ...(includeSecret || row.status !== "playing"
// // // // // // // // //       ? { secretCode: toArray(row.secret_code) }
// // // // // // // // //       : {}),
// // // // // // // // //   };
// // // // // // // // // }

// // // // // // // // // // POST /api/game/start   { difficulty }
// // // // // // // // // async function startGame(req, res) {
// // // // // // // // //   const { difficulty } = req.body;

// // // // // // // // //   if (!VALID_DIFFICULTIES.includes(difficulty)) {
// // // // // // // // //     return res.status(400).json({
// // // // // // // // //       error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
// // // // // // // // //     });
// // // // // // // // //   }

// // // // // // // // //   const config = DIFFICULTY_CONFIG[difficulty];
// // // // // // // // //   const secret = generateSecretCode(config.codeLength);
// // // // // // // // //   const id = uuidv4();

// // // // // // // // //   // Start with everything hidden ("???" for a 3-digit easy code)
// // // // // // // // //   const initialRevealed = config.clueType === "direct" ? "?".repeat(config.codeLength) : null;

// // // // // // // // //   await pool.query(
// // // // // // // // //     `INSERT INTO games (id, difficulty, secret_code, code_length, max_attempts, time_limit_sec, revealed_code)
// // // // // // // // //      VALUES (?, ?, ?, ?, ?, ?, ?)`,
// // // // // // // // //     [id, difficulty, toStr(secret), config.codeLength, config.maxAttempts, config.timeLimitSec, initialRevealed]
// // // // // // // // //   );

// // // // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [id]);
// // // // // // // // //   res.status(201).json(publicGame(rows[0]));
// // // // // // // // // }

// // // // // // // // // // GET /api/games/:gameId
// // // // // // // // // async function getGame(req, res) {
// // // // // // // // //   const { gameId } = req.params;
// // // // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // // // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // // // // // //   const [guesses] = await pool.query(
// // // // // // // // //     "SELECT guess, exact_matches, partial_matches, created_at FROM guesses WHERE game_id = ? ORDER BY id ASC",
// // // // // // // // //     [gameId]
// // // // // // // // //   );

// // // // // // // // //   const config = DIFFICULTY_CONFIG[rows[0].difficulty];

// // // // // // // // //   res.json({
// // // // // // // // //     ...publicGame(rows[0]),
// // // // // // // // //     history: guesses.map((g) => ({
// // // // // // // // //       guess: toArray(g.guess),
// // // // // // // // //       feedback:
// // // // // // // // //         config.clueType === "hard"
// // // // // // // // //           ? { exactMatches: g.exact_matches, partialMatches: null }
// // // // // // // // //           : { exactMatches: g.exact_matches, partialMatches: g.partial_matches },
// // // // // // // // //       createdAt: g.created_at,
// // // // // // // // //     })),
// // // // // // // // //   });
// // // // // // // // // }

// // // // // // // // // // POST /api/games/:gameId/guess   { guess: number[], timeLeft?: number }
// // // // // // // // // async function submitGuess(req, res) {
// // // // // // // // //   const { gameId } = req.params;
// // // // // // // // //   const { guess, timeLeft } = req.body;

// // // // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // // // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // // // // // //   const game = rows[0];
// // // // // // // // //   const config = DIFFICULTY_CONFIG[game.difficulty];

// // // // // // // // //   if (game.status !== "playing") {
// // // // // // // // //     return res.status(409).json({ error: `Game already finished (${game.status})`, ...publicGame(game) });
// // // // // // // // //   }
// // // // // // // // //   if (
// // // // // // // // //     !Array.isArray(guess) ||
// // // // // // // // //     guess.length !== game.code_length ||
// // // // // // // // //     guess.some((d) => !Number.isInteger(d) || d < 0 || d > 9)
// // // // // // // // //   ) {
// // // // // // // // //     return res.status(400).json({ error: `Guess must be an array of ${game.code_length} digits (0-9)` });
// // // // // // // // //   }

// // // // // // // // //   const secretArr = toArray(game.secret_code);
// // // // // // // // //   const feedback = computeFeedback(secretArr, guess); // always computed, used for scoring
// // // // // // // // //   const gained = feedback.exactMatches * 30 + feedback.partialMatches * 10;

// // // // // // // // //   const newAttemptsUsed = game.attempts_used + 1;
// // // // // // // // //   let newScore = game.score + gained;

// // // // // // // // //   const won = feedback.exactMatches === game.code_length;
// // // // // // // // //   const outOfAttempts = !won && newAttemptsUsed >= game.max_attempts;

// // // // // // // // //   let status = "playing";
// // // // // // // // //   let finishedAt = null;

// // // // // // // // //   if (won) {
// // // // // // // // //     status = "won";
// // // // // // // // //     finishedAt = new Date();
// // // // // // // // //     const safeTimeLeft = Number.isFinite(timeLeft) ? Math.max(0, timeLeft) : 0;
// // // // // // // // //     newScore += safeTimeLeft * 2;
// // // // // // // // //   } else if (outOfAttempts) {
// // // // // // // // //     status = "lost";
// // // // // // // // //     finishedAt = new Date();
// // // // // // // // //   }

// // // // // // // // //   // --- direct-clue bookkeeping (easy mode) ---
// // // // // // // // //   let newRevealedStr = game.revealed_code;
// // // // // // // // //   let newlyRevealedCount = 0;
// // // // // // // // //   if (config.clueType === "direct") {
// // // // // // // // //     const previousRevealed = strToReveal(game.revealed_code || "?".repeat(game.code_length));
// // // // // // // // //     const thisGuessReveal = computeDirectReveal(secretArr, guess);
// // // // // // // // //     const merged = won ? secretArr : mergeReveal(previousRevealed, thisGuessReveal);
// // // // // // // // //     newlyRevealedCount = countNewlyRevealed(previousRevealed, merged);
// // // // // // // // //     newRevealedStr = revealToStr(merged);
// // // // // // // // //   }

// // // // // // // // //   await pool.query(
// // // // // // // // //     `INSERT INTO guesses (game_id, guess, exact_matches, partial_matches) VALUES (?, ?, ?, ?)`,
// // // // // // // // //     [gameId, toStr(guess), feedback.exactMatches, feedback.partialMatches]
// // // // // // // // //   );

// // // // // // // // //   await pool.query(
// // // // // // // // //     `UPDATE games SET attempts_used = ?, score = ?, status = ?, finished_at = ?, revealed_code = ? WHERE id = ?`,
// // // // // // // // //     [newAttemptsUsed, newScore, status, finishedAt, newRevealedStr, gameId]
// // // // // // // // //   );

// // // // // // // // //   const [updatedRows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);

// // // // // // // // //   // Shape the feedback the client actually sees, based on clueType
// // // // // // // // //   let clientFeedback = feedback;
// // // // // // // // //   if (config.clueType === "hard") {
// // // // // // // // //     clientFeedback = { exactMatches: feedback.exactMatches, partialMatches: null };
// // // // // // // // //   }

// // // // // // // // //   res.json({
// // // // // // // // //     ...publicGame(updatedRows[0]),
// // // // // // // // //     feedback: clientFeedback,
// // // // // // // // //     ...(config.clueType === "direct" ? { newlyRevealedCount } : {}),
// // // // // // // // //   });
// // // // // // // // // }

// // // // // // // // // // GET /api/stats  (unchanged)
// // // // // // // // // async function getStats(req, res) {
// // // // // // // // //   const [[totals]] = await pool.query(
// // // // // // // // //     `SELECT
// // // // // // // // //        COUNT(*) AS gamesPlayed,
// // // // // // // // //        SUM(status = 'won') AS wins,
// // // // // // // // //        MAX(score) AS highScore,
// // // // // // // // //        AVG(CASE WHEN status = 'won' THEN attempts_used END) AS avgAttemptsToWin
// // // // // // // // //      FROM games
// // // // // // // // //      WHERE status != 'playing'`
// // // // // // // // //   );

// // // // // // // // //   const [finishedGames] = await pool.query(
// // // // // // // // //     `SELECT status FROM games WHERE status != 'playing' ORDER BY finished_at ASC`
// // // // // // // // //   );

// // // // // // // // //   let bestStreak = 0;
// // // // // // // // //   let runningStreak = 0;
// // // // // // // // //   for (const game of finishedGames) {
// // // // // // // // //     if (game.status === "won") {
// // // // // // // // //       runningStreak += 1;
// // // // // // // // //       bestStreak = Math.max(bestStreak, runningStreak);
// // // // // // // // //     } else {
// // // // // // // // //       runningStreak = 0;
// // // // // // // // //     }
// // // // // // // // //   }

// // // // // // // // //   let currentStreak = 0;
// // // // // // // // //   for (let i = finishedGames.length - 1; i >= 0; i--) {
// // // // // // // // //     if (finishedGames[i].status === "won") {
// // // // // // // // //       currentStreak += 1;
// // // // // // // // //     } else {
// // // // // // // // //       break;
// // // // // // // // //     }
// // // // // // // // //   }

// // // // // // // // //   res.json({
// // // // // // // // //     highScore: totals.highScore || 0,
// // // // // // // // //     gamesPlayed: totals.gamesPlayed || 0,
// // // // // // // // //     gamesWon: totals.wins || 0,
// // // // // // // // //     currentStreak,
// // // // // // // // //     bestStreak,
// // // // // // // // //     avgAttempts: totals.avgAttemptsToWin ? Number(totals.avgAttemptsToWin) : 0,
// // // // // // // // //   });
// // // // // // // // // }

// // // // // // // // // async function getHighScore(req, res) {
// // // // // // // // //   const [[row]] = await pool.query("SELECT MAX(score) AS highScore FROM games WHERE status = 'won'");
// // // // // // // // //   res.json({ highScore: row.highScore || 0 });
// // // // // // // // // }

// // // // // // // // // module.exports = { startGame, getGame, submitGuess, getStats, getHighScore };
// // // // // // // // const { v4: uuidv4 } = require("uuid");
// // // // // // // // const pool = require("../db");
// // // // // // // // const { DIFFICULTY_CONFIG, VALID_DIFFICULTIES } = require("../config/difficulty");
// // // // // // // // const { generateSecretCode } = require("../utils/random");
// // // // // // // // const {
// // // // // // // //   computeFeedback,
// // // // // // // //   computeDirectReveal,
// // // // // // // //   mergeReveal,
// // // // // // // //   countNewlyRevealed,
// // // // // // // //   revealToStr,
// // // // // // // //   strToReveal,
// // // // // // // // } = require("../utils/feedback");

// // // // // // // // const toArray = (str) => str.split("").map(Number);
// // // // // // // // const toStr = (arr) => arr.join("");

// // // // // // // // function publicGame(row, { includeSecret = false } = {}) {
// // // // // // // //   const config = DIFFICULTY_CONFIG[row.difficulty];

// // // // // // // //   return {
// // // // // // // //     gameId: row.id,
// // // // // // // //     difficulty: row.difficulty,
// // // // // // // //     clueType: config.clueType,
// // // // // // // //     rounds: config.rounds,
// // // // // // // //     codeLength: row.code_length,
// // // // // // // //     maxAttempts: row.max_attempts,
// // // // // // // //     timeLimitSec: row.time_limit_sec,
// // // // // // // //     attemptsUsed: row.attempts_used,
// // // // // // // //     attemptsLeft: row.max_attempts - row.attempts_used,
// // // // // // // //     score: row.score,
// // // // // // // //     status: row.status,
// // // // // // // //     startedAt: row.started_at,
// // // // // // // //     finishedAt: row.finished_at,
// // // // // // // //     ...(config.clueType === "direct" && row.revealed_code
// // // // // // // //       ? { revealedCode: strToReveal(row.revealed_code) }
// // // // // // // //       : {}),
// // // // // // // //     ...(includeSecret || row.status !== "playing"
// // // // // // // //       ? { secretCode: toArray(row.secret_code) }
// // // // // // // //       : {}),
// // // // // // // //   };
// // // // // // // // }

// // // // // // // // async function startGame(req, res) {
// // // // // // // //   const { difficulty } = req.body;

// // // // // // // //   if (!VALID_DIFFICULTIES.includes(difficulty)) {
// // // // // // // //     return res.status(400).json({
// // // // // // // //       error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
// // // // // // // //     });
// // // // // // // //   }

// // // // // // // //   const config = DIFFICULTY_CONFIG[difficulty];
// // // // // // // //   const secret = generateSecretCode(config.codeLength);
// // // // // // // //   const id = uuidv4();

// // // // // // // //   const initialRevealed = config.clueType === "direct" ? "?".repeat(config.codeLength) : null;

// // // // // // // //   await pool.query(
// // // // // // // //     `INSERT INTO games (id, difficulty, secret_code, code_length, max_attempts, time_limit_sec, revealed_code)
// // // // // // // //      VALUES (?, ?, ?, ?, ?, ?, ?)`,
// // // // // // // //     [id, difficulty, toStr(secret), config.codeLength, config.maxAttempts, config.timeLimitSec, initialRevealed]
// // // // // // // //   );

// // // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [id]);
// // // // // // // //   res.status(201).json(publicGame(rows[0]));
// // // // // // // // }

// // // // // // // // async function getGame(req, res) {
// // // // // // // //   const { gameId } = req.params;
// // // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // // // // //   const [guesses] = await pool.query(
// // // // // // // //     "SELECT guess, exact_matches, partial_matches, created_at FROM guesses WHERE game_id = ? ORDER BY id ASC",
// // // // // // // //     [gameId]
// // // // // // // //   );

// // // // // // // //   const config = DIFFICULTY_CONFIG[rows[0].difficulty];
// // // // // // // //   const secretArr = toArray(rows[0].secret_code);

// // // // // // // //   res.json({
// // // // // // // //     ...publicGame(rows[0]),
// // // // // // // //     history: guesses.map((g) => {
// // // // // // // //       const guessArr = toArray(g.guess);
// // // // // // // //       let fb;
// // // // // // // //       if (config.clueType === "direct") {
// // // // // // // //         // 👇 per-digit correct/wrong, matching what submitGuess now returns live
// // // // // // // //         fb = guessArr.map((d, i) => ({
// // // // // // // //           digit: d,
// // // // // // // //           status: d === secretArr[i] ? "correct" : "wrong",
// // // // // // // //         }));
// // // // // // // //       } else if (config.clueType === "hard") {
// // // // // // // //         fb = { exactMatches: g.exact_matches, partialMatches: null };
// // // // // // // //       } else {
// // // // // // // //         fb = { exactMatches: g.exact_matches, partialMatches: g.partial_matches };
// // // // // // // //       }
// // // // // // // //       return {
// // // // // // // //         guess: guessArr,
// // // // // // // //         feedback: fb,
// // // // // // // //         createdAt: g.created_at,
// // // // // // // //       };
// // // // // // // //     }),
// // // // // // // //   });
// // // // // // // // }

// // // // // // // // async function submitGuess(req, res) {
// // // // // // // //   const { gameId } = req.params;
// // // // // // // //   const { guess, timeLeft } = req.body;

// // // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // // // // //   const game = rows[0];
// // // // // // // //   const config = DIFFICULTY_CONFIG[game.difficulty];

// // // // // // // //   if (game.status !== "playing") {
// // // // // // // //     return res.status(409).json({ error: `Game already finished (${game.status})`, ...publicGame(game) });
// // // // // // // //   }
// // // // // // // //   if (
// // // // // // // //     !Array.isArray(guess) ||
// // // // // // // //     guess.length !== game.code_length ||
// // // // // // // //     guess.some((d) => !Number.isInteger(d) || d < 0 || d > 9)
// // // // // // // //   ) {
// // // // // // // //     return res.status(400).json({ error: `Guess must be an array of ${game.code_length} digits (0-9)` });
// // // // // // // //   }

// // // // // // // //   const secretArr = toArray(game.secret_code);
// // // // // // // //   const feedback = computeFeedback(secretArr, guess);
// // // // // // // //   const gained = feedback.exactMatches * 30 + feedback.partialMatches * 10;

// // // // // // // //   const newAttemptsUsed = game.attempts_used + 1;
// // // // // // // //   let newScore = game.score + gained;

// // // // // // // //   const won = feedback.exactMatches === game.code_length;
// // // // // // // //   const outOfAttempts = !won && newAttemptsUsed >= game.max_attempts;

// // // // // // // //   let status = "playing";
// // // // // // // //   let finishedAt = null;

// // // // // // // //   if (won) {
// // // // // // // //     status = "won";
// // // // // // // //     finishedAt = new Date();
// // // // // // // //     const safeTimeLeft = Number.isFinite(timeLeft) ? Math.max(0, timeLeft) : 0;
// // // // // // // //     newScore += safeTimeLeft * 2;
// // // // // // // //   } else if (outOfAttempts) {
// // // // // // // //     status = "lost";
// // // // // // // //     finishedAt = new Date();
// // // // // // // //   }

// // // // // // // //   let newRevealedStr = game.revealed_code;
// // // // // // // //   let newlyRevealedCount = 0;
// // // // // // // //   if (config.clueType === "direct") {
// // // // // // // //     const previousRevealed = strToReveal(game.revealed_code || "?".repeat(game.code_length));
// // // // // // // //     const thisGuessReveal = computeDirectReveal(secretArr, guess);
// // // // // // // //     const merged = won ? secretArr : mergeReveal(previousRevealed, thisGuessReveal);
// // // // // // // //     newlyRevealedCount = countNewlyRevealed(previousRevealed, merged);
// // // // // // // //     newRevealedStr = revealToStr(merged);
// // // // // // // //   }

// // // // // // // //   await pool.query(
// // // // // // // //     `INSERT INTO guesses (game_id, guess, exact_matches, partial_matches) VALUES (?, ?, ?, ?)`,
// // // // // // // //     [gameId, toStr(guess), feedback.exactMatches, feedback.partialMatches]
// // // // // // // //   );

// // // // // // // //   await pool.query(
// // // // // // // //     `UPDATE games SET attempts_used = ?, score = ?, status = ?, finished_at = ?, revealed_code = ? WHERE id = ?`,
// // // // // // // //     [newAttemptsUsed, newScore, status, finishedAt, newRevealedStr, gameId]
// // // // // // // //   );

// // // // // // // //   const [updatedRows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);

// // // // // // // //   // Shape the feedback the client actually sees, based on clueType
// // // // // // // //   let clientFeedback;
// // // // // // // //   if (config.clueType === "direct") {
// // // // // // // //     // Easy mode — per-digit clear feedback: exact place correct/wrong, no ambiguity
// // // // // // // //     clientFeedback = guess.map((d, i) => ({
// // // // // // // //       digit: d,
// // // // // // // //       status: d === secretArr[i] ? "correct" : "wrong",
// // // // // // // //     }));
// // // // // // // //   } else if (config.clueType === "hard") {
// // // // // // // //     clientFeedback = { exactMatches: feedback.exactMatches, partialMatches: null };
// // // // // // // //   } else {
// // // // // // // //     clientFeedback = { exactMatches: feedback.exactMatches, partialMatches: feedback.partialMatches };
// // // // // // // //   }

// // // // // // // //   res.json({
// // // // // // // //     ...publicGame(updatedRows[0]),
// // // // // // // //     feedback: clientFeedback,
// // // // // // // //     ...(config.clueType === "direct" ? { newlyRevealedCount } : {}),
// // // // // // // //   });
// // // // // // // // }

// // // // // // // // async function getStats(req, res) {
// // // // // // // //   const [[totals]] = await pool.query(
// // // // // // // //     `SELECT
// // // // // // // //        COUNT(*) AS gamesPlayed,
// // // // // // // //        SUM(status = 'won') AS wins,
// // // // // // // //        MAX(score) AS highScore,
// // // // // // // //        AVG(CASE WHEN status = 'won' THEN attempts_used END) AS avgAttemptsToWin
// // // // // // // //      FROM games
// // // // // // // //      WHERE status != 'playing'`
// // // // // // // //   );

// // // // // // // //   const [finishedGames] = await pool.query(
// // // // // // // //     `SELECT status FROM games WHERE status != 'playing' ORDER BY finished_at ASC`
// // // // // // // //   );

// // // // // // // //   let bestStreak = 0;
// // // // // // // //   let runningStreak = 0;
// // // // // // // //   for (const game of finishedGames) {
// // // // // // // //     if (game.status === "won") {
// // // // // // // //       runningStreak += 1;
// // // // // // // //       bestStreak = Math.max(bestStreak, runningStreak);
// // // // // // // //     } else {
// // // // // // // //       runningStreak = 0;
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   let currentStreak = 0;
// // // // // // // //   for (let i = finishedGames.length - 1; i >= 0; i--) {
// // // // // // // //     if (finishedGames[i].status === "won") {
// // // // // // // //       currentStreak += 1;
// // // // // // // //     } else {
// // // // // // // //       break;
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   res.json({
// // // // // // // //     highScore: totals.highScore || 0,
// // // // // // // //     gamesPlayed: totals.gamesPlayed || 0,
// // // // // // // //     gamesWon: totals.wins || 0,
// // // // // // // //     currentStreak,
// // // // // // // //     bestStreak,
// // // // // // // //     avgAttempts: totals.avgAttemptsToWin ? Number(totals.avgAttemptsToWin) : 0,
// // // // // // // //   });
// // // // // // // // }

// // // // // // // // async function getHighScore(req, res) {
// // // // // // // //   const [[row]] = await pool.query("SELECT MAX(score) AS highScore FROM games WHERE status = 'won'");
// // // // // // // //   res.json({ highScore: row.highScore || 0 });
// // // // // // // // }

// // // // // // // // module.exports = { startGame, getGame, submitGuess, getStats, getHighScore };
// // // // // // // const { v4: uuidv4 } = require("uuid");
// // // // // // // const pool = require("../db");
// // // // // // // const { DIFFICULTY_CONFIG, VALID_DIFFICULTIES } = require("../config/difficulty");
// // // // // // // const { generateSecretCode } = require("../utils/random");
// // // // // // // const {
// // // // // // //   computeFeedback,
// // // // // // //   computeDirectReveal,
// // // // // // //   mergeReveal,
// // // // // // //   countNewlyRevealed,
// // // // // // //   revealToStr,
// // // // // // //   strToReveal,
// // // // // // // } = require("../utils/feedback");

// // // // // // // const toArray = (str) => str.split("").map(Number);
// // // // // // // const toStr = (arr) => arr.join("");

// // // // // // // // 3-state per-digit feedback for "direct" clueType (Easy mode):
// // // // // // // //  - "correct": right digit, right place
// // // // // // // //  - "present": digit exists in the secret, but at a different place
// // // // // // // //  - "absent" : digit does not exist in the secret at all
// // // // // // // function computePerDigitFeedback(secretArr, guess) {
// // // // // // //   const result = new Array(guess.length).fill(null);
// // // // // // //   const secretRemaining = [...secretArr];

// // // // // // //   // Pass 1 — exact matches
// // // // // // //   for (let i = 0; i < guess.length; i++) {
// // // // // // //     if (guess[i] === secretArr[i]) {
// // // // // // //       result[i] = { digit: guess[i], status: "correct" };
// // // // // // //       secretRemaining[i] = null;
// // // // // // //     }
// // // // // // //   }

// // // // // // //   // Pass 2 — present elsewhere vs absent entirely
// // // // // // //   for (let i = 0; i < guess.length; i++) {
// // // // // // //     if (result[i]) continue;
// // // // // // //     const foundIdx = secretRemaining.findIndex((d) => d === guess[i]);
// // // // // // //     if (foundIdx !== -1) {
// // // // // // //       result[i] = { digit: guess[i], status: "present" };
// // // // // // //       secretRemaining[foundIdx] = null;
// // // // // // //     } else {
// // // // // // //       result[i] = { digit: guess[i], status: "absent" };
// // // // // // //     }
// // // // // // //   }

// // // // // // //   return result;
// // // // // // // }

// // // // // // // function publicGame(row, { includeSecret = false } = {}) {
// // // // // // //   const config = DIFFICULTY_CONFIG[row.difficulty];

// // // // // // //   return {
// // // // // // //     gameId: row.id,
// // // // // // //     difficulty: row.difficulty,
// // // // // // //     clueType: config.clueType,
// // // // // // //     rounds: config.rounds,
// // // // // // //     codeLength: row.code_length,
// // // // // // //     maxAttempts: row.max_attempts,
// // // // // // //     timeLimitSec: row.time_limit_sec,
// // // // // // //     attemptsUsed: row.attempts_used,
// // // // // // //     attemptsLeft: row.max_attempts - row.attempts_used,
// // // // // // //     score: row.score,
// // // // // // //     status: row.status,
// // // // // // //     startedAt: row.started_at,
// // // // // // //     finishedAt: row.finished_at,
// // // // // // //     ...(config.clueType === "direct" && row.revealed_code
// // // // // // //       ? { revealedCode: strToReveal(row.revealed_code) }
// // // // // // //       : {}),
// // // // // // //     ...(includeSecret || row.status !== "playing"
// // // // // // //       ? { secretCode: toArray(row.secret_code) }
// // // // // // //       : {}),
// // // // // // //   };
// // // // // // // }

// // // // // // // async function startGame(req, res) {
// // // // // // //   const { difficulty } = req.body;

// // // // // // //   if (!VALID_DIFFICULTIES.includes(difficulty)) {
// // // // // // //     return res.status(400).json({
// // // // // // //       error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
// // // // // // //     });
// // // // // // //   }

// // // // // // //   const config = DIFFICULTY_CONFIG[difficulty];
// // // // // // //   const secret = generateSecretCode(config.codeLength);
// // // // // // //   const id = uuidv4();

// // // // // // //   const initialRevealed = config.clueType === "direct" ? "?".repeat(config.codeLength) : null;

// // // // // // //   await pool.query(
// // // // // // //     `INSERT INTO games (id, difficulty, secret_code, code_length, max_attempts, time_limit_sec, revealed_code)
// // // // // // //      VALUES (?, ?, ?, ?, ?, ?, ?)`,
// // // // // // //     [id, difficulty, toStr(secret), config.codeLength, config.maxAttempts, config.timeLimitSec, initialRevealed]
// // // // // // //   );

// // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [id]);
// // // // // // //   res.status(201).json(publicGame(rows[0]));
// // // // // // // }

// // // // // // // async function getGame(req, res) {
// // // // // // //   const { gameId } = req.params;
// // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // // // //   const [guesses] = await pool.query(
// // // // // // //     "SELECT guess, exact_matches, partial_matches, created_at FROM guesses WHERE game_id = ? ORDER BY id ASC",
// // // // // // //     [gameId]
// // // // // // //   );

// // // // // // //   const config = DIFFICULTY_CONFIG[rows[0].difficulty];
// // // // // // //   const secretArr = toArray(rows[0].secret_code);

// // // // // // //   res.json({
// // // // // // //     ...publicGame(rows[0]),
// // // // // // //     history: guesses.map((g) => {
// // // // // // //       const guessArr = toArray(g.guess);
// // // // // // //       let fb;
// // // // // // //       if (config.clueType === "direct") {
// // // // // // //         // 👇 3-state per-digit feedback, matching what submitGuess now returns live
// // // // // // //         fb = computePerDigitFeedback(secretArr, guessArr);
// // // // // // //       } else if (config.clueType === "hard") {
// // // // // // //         fb = { exactMatches: g.exact_matches, partialMatches: null };
// // // // // // //       } else {
// // // // // // //         fb = { exactMatches: g.exact_matches, partialMatches: g.partial_matches };
// // // // // // //       }
// // // // // // //       return {
// // // // // // //         guess: guessArr,
// // // // // // //         feedback: fb,
// // // // // // //         createdAt: g.created_at,
// // // // // // //       };
// // // // // // //     }),
// // // // // // //   });
// // // // // // // }

// // // // // // // async function submitGuess(req, res) {
// // // // // // //   const { gameId } = req.params;
// // // // // // //   const { guess, timeLeft } = req.body;

// // // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // // // //   const game = rows[0];
// // // // // // //   const config = DIFFICULTY_CONFIG[game.difficulty];

// // // // // // //   if (game.status !== "playing") {
// // // // // // //     return res.status(409).json({ error: `Game already finished (${game.status})`, ...publicGame(game) });
// // // // // // //   }
// // // // // // //   if (
// // // // // // //     !Array.isArray(guess) ||
// // // // // // //     guess.length !== game.code_length ||
// // // // // // //     guess.some((d) => !Number.isInteger(d) || d < 0 || d > 9)
// // // // // // //   ) {
// // // // // // //     return res.status(400).json({ error: `Guess must be an array of ${game.code_length} digits (0-9)` });
// // // // // // //   }

// // // // // // //   const secretArr = toArray(game.secret_code);
// // // // // // //   const feedback = computeFeedback(secretArr, guess);
// // // // // // //   const gained = feedback.exactMatches * 30 + feedback.partialMatches * 10;

// // // // // // //   const newAttemptsUsed = game.attempts_used + 1;
// // // // // // //   let newScore = game.score + gained;

// // // // // // //   const won = feedback.exactMatches === game.code_length;
// // // // // // //   const outOfAttempts = !won && newAttemptsUsed >= game.max_attempts;

// // // // // // //   let status = "playing";
// // // // // // //   let finishedAt = null;

// // // // // // //   if (won) {
// // // // // // //     status = "won";
// // // // // // //     finishedAt = new Date();
// // // // // // //     const safeTimeLeft = Number.isFinite(timeLeft) ? Math.max(0, timeLeft) : 0;
// // // // // // //     newScore += safeTimeLeft * 2;
// // // // // // //   } else if (outOfAttempts) {
// // // // // // //     status = "lost";
// // // // // // //     finishedAt = new Date();
// // // // // // //   }

// // // // // // //   let newRevealedStr = game.revealed_code;
// // // // // // //   let newlyRevealedCount = 0;
// // // // // // //   if (config.clueType === "direct") {
// // // // // // //     const previousRevealed = strToReveal(game.revealed_code || "?".repeat(game.code_length));
// // // // // // //     const thisGuessReveal = computeDirectReveal(secretArr, guess);
// // // // // // //     const merged = won ? secretArr : mergeReveal(previousRevealed, thisGuessReveal);
// // // // // // //     newlyRevealedCount = countNewlyRevealed(previousRevealed, merged);
// // // // // // //     newRevealedStr = revealToStr(merged);
// // // // // // //   }

// // // // // // //   await pool.query(
// // // // // // //     `INSERT INTO guesses (game_id, guess, exact_matches, partial_matches) VALUES (?, ?, ?, ?)`,
// // // // // // //     [gameId, toStr(guess), feedback.exactMatches, feedback.partialMatches]
// // // // // // //   );

// // // // // // //   await pool.query(
// // // // // // //     `UPDATE games SET attempts_used = ?, score = ?, status = ?, finished_at = ?, revealed_code = ? WHERE id = ?`,
// // // // // // //     [newAttemptsUsed, newScore, status, finishedAt, newRevealedStr, gameId]
// // // // // // //   );

// // // // // // //   const [updatedRows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);

// // // // // // //   // Shape the feedback the client actually sees, based on clueType
// // // // // // //   let clientFeedback;
// // // // // // //   if (config.clueType === "direct") {
// // // // // // //     // Easy mode — 3-state per-digit feedback: correct / exists-but-wrong-place / not-in-code
// // // // // // //     clientFeedback = computePerDigitFeedback(secretArr, guess);
// // // // // // //   } else if (config.clueType === "hard") {
// // // // // // //     clientFeedback = { exactMatches: feedback.exactMatches, partialMatches: null };
// // // // // // //   } else {
// // // // // // //     clientFeedback = { exactMatches: feedback.exactMatches, partialMatches: feedback.partialMatches };
// // // // // // //   }

// // // // // // //   res.json({
// // // // // // //     ...publicGame(updatedRows[0]),
// // // // // // //     feedback: clientFeedback,
// // // // // // //     ...(config.clueType === "direct" ? { newlyRevealedCount } : {}),
// // // // // // //   });
// // // // // // // }

// // // // // // // async function getStats(req, res) {
// // // // // // //   const [[totals]] = await pool.query(
// // // // // // //     `SELECT
// // // // // // //        COUNT(*) AS gamesPlayed,
// // // // // // //        SUM(status = 'won') AS wins,
// // // // // // //        MAX(score) AS highScore,
// // // // // // //        AVG(CASE WHEN status = 'won' THEN attempts_used END) AS avgAttemptsToWin
// // // // // // //      FROM games
// // // // // // //      WHERE status != 'playing'`
// // // // // // //   );

// // // // // // //   const [finishedGames] = await pool.query(
// // // // // // //     `SELECT status FROM games WHERE status != 'playing' ORDER BY finished_at ASC`
// // // // // // //   );

// // // // // // //   let bestStreak = 0;
// // // // // // //   let runningStreak = 0;
// // // // // // //   for (const game of finishedGames) {
// // // // // // //     if (game.status === "won") {
// // // // // // //       runningStreak += 1;
// // // // // // //       bestStreak = Math.max(bestStreak, runningStreak);
// // // // // // //     } else {
// // // // // // //       runningStreak = 0;
// // // // // // //     }
// // // // // // //   }

// // // // // // //   let currentStreak = 0;
// // // // // // //   for (let i = finishedGames.length - 1; i >= 0; i--) {
// // // // // // //     if (finishedGames[i].status === "won") {
// // // // // // //       currentStreak += 1;
// // // // // // //     } else {
// // // // // // //       break;
// // // // // // //     }
// // // // // // //   }

// // // // // // //   res.json({
// // // // // // //     highScore: totals.highScore || 0,
// // // // // // //     gamesPlayed: totals.gamesPlayed || 0,
// // // // // // //     gamesWon: totals.wins || 0,
// // // // // // //     currentStreak,
// // // // // // //     bestStreak,
// // // // // // //     avgAttempts: totals.avgAttemptsToWin ? Number(totals.avgAttemptsToWin) : 0,
// // // // // // //   });
// // // // // // // }

// // // // // // // async function getHighScore(req, res) {
// // // // // // //   const [[row]] = await pool.query("SELECT MAX(score) AS highScore FROM games WHERE status = 'won'");
// // // // // // //   res.json({ highScore: row.highScore || 0 });
// // // // // // // }

// // // // // // // module.exports = { startGame, getGame, submitGuess, getStats, getHighScore };
// // // // // // const { v4: uuidv4 } = require("uuid");
// // // // // // const pool = require("../db");
// // // // // // const { DIFFICULTY_CONFIG, VALID_DIFFICULTIES } = require("../config/difficulty");
// // // // // // const { generateSecretCode } = require("../utils/random");
// // // // // // const {
// // // // // //   computeFeedback,
// // // // // //   computeDirectReveal,
// // // // // //   mergeReveal,
// // // // // //   countNewlyRevealed,
// // // // // //   revealToStr,
// // // // // //   strToReveal,
// // // // // // } = require("../utils/feedback");

// // // // // // const toArray = (str) => str.split("").map(Number);
// // // // // // const toStr = (arr) => arr.join("");

// // // // // // // 3-state per-digit feedback for "direct" clueType (Easy mode):
// // // // // // //  - "correct": right digit, right place
// // // // // // //  - "present": digit exists in the secret, but at a different place
// // // // // // //  - "absent" : digit does not exist in the secret at all
// // // // // // function computePerDigitFeedback(secretArr, guess) {
// // // // // //   const result = new Array(guess.length).fill(null);
// // // // // //   const secretRemaining = [...secretArr];

// // // // // //   // Pass 1 — exact matches
// // // // // //   for (let i = 0; i < guess.length; i++) {
// // // // // //     if (guess[i] === secretArr[i]) {
// // // // // //       result[i] = { digit: guess[i], status: "correct" };
// // // // // //       secretRemaining[i] = null;
// // // // // //     }
// // // // // //   }

// // // // // //   // Pass 2 — present elsewhere vs absent entirely
// // // // // //   for (let i = 0; i < guess.length; i++) {
// // // // // //     if (result[i]) continue;
// // // // // //     const foundIdx = secretRemaining.findIndex((d) => d === guess[i]);
// // // // // //     if (foundIdx !== -1) {
// // // // // //       result[i] = { digit: guess[i], status: "present" };
// // // // // //       secretRemaining[foundIdx] = null;
// // // // // //     } else {
// // // // // //       result[i] = { digit: guess[i], status: "absent" };
// // // // // //     }
// // // // // //   }

// // // // // //   return result;
// // // // // // }

// // // // // // function publicGame(row, { includeSecret = false } = {}) {
// // // // // //   const config = DIFFICULTY_CONFIG[row.difficulty];

// // // // // //   return {
// // // // // //     gameId: row.id,
// // // // // //     difficulty: row.difficulty,
// // // // // //     clueType: config.clueType,
// // // // // //     rounds: config.rounds,
// // // // // //     codeLength: row.code_length,
// // // // // //     maxAttempts: row.max_attempts,
// // // // // //     timeLimitSec: row.time_limit_sec,
// // // // // //     attemptsUsed: row.attempts_used,
// // // // // //     attemptsLeft: row.max_attempts - row.attempts_used,
// // // // // //     score: row.score,
// // // // // //     status: row.status,
// // // // // //     startedAt: row.started_at,
// // // // // //     finishedAt: row.finished_at,
// // // // // //     ...(config.clueType === "direct" && row.revealed_code
// // // // // //       ? { revealedCode: strToReveal(row.revealed_code) }
// // // // // //       : {}),
// // // // // //     ...(includeSecret || row.status !== "playing"
// // // // // //       ? { secretCode: toArray(row.secret_code) }
// // // // // //       : {}),
// // // // // //   };
// // // // // // }

// // // // // // async function startGame(req, res) {
// // // // // //   const { difficulty, roundNumber } = req.body;

// // // // // //   if (!VALID_DIFFICULTIES.includes(difficulty)) {
// // // // // //     return res.status(400).json({
// // // // // //       error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
// // // // // //     });
// // // // // //   }

// // // // // //   const config = DIFFICULTY_CONFIG[difficulty];
// // // // // //   const secret = generateSecretCode(config.codeLength);
// // // // // //   const id = uuidv4();

// // // // // //   // Easy mode ("direct" clueType): one position is given free every round,
// // // // // //   // rotating through the positions as the round number increases.
// // // // // //   //   round 1 -> index 0 revealed, round 2 -> index 1, round 3 -> index 2,
// // // // // //   //   round 4 -> index 0 again, ... (cycles with codeLength)
// // // // // //   let initialRevealed = null;
// // // // // //   if (config.clueType === "direct") {
// // // // // //     const round = Number.isInteger(roundNumber) && roundNumber > 0 ? roundNumber : 1;
// // // // // //     const revealedIndex = (round - 1) % config.codeLength;
// // // // // //     const revealArr = secret.map((digit, i) => (i === revealedIndex ? digit : null));
// // // // // //     initialRevealed = revealToStr(revealArr);
// // // // // //   }

// // // // // //   await pool.query(
// // // // // //     `INSERT INTO games (id, difficulty, secret_code, code_length, max_attempts, time_limit_sec, revealed_code)
// // // // // //      VALUES (?, ?, ?, ?, ?, ?, ?)`,
// // // // // //     [id, difficulty, toStr(secret), config.codeLength, config.maxAttempts, config.timeLimitSec, initialRevealed]
// // // // // //   );

// // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [id]);
// // // // // //   res.status(201).json(publicGame(rows[0]));
// // // // // // }

// // // // // // async function getGame(req, res) {
// // // // // //   const { gameId } = req.params;
// // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // // //   const [guesses] = await pool.query(
// // // // // //     "SELECT guess, exact_matches, partial_matches, created_at FROM guesses WHERE game_id = ? ORDER BY id ASC",
// // // // // //     [gameId]
// // // // // //   );

// // // // // //   const config = DIFFICULTY_CONFIG[rows[0].difficulty];
// // // // // //   const secretArr = toArray(rows[0].secret_code);

// // // // // //   res.json({
// // // // // //     ...publicGame(rows[0]),
// // // // // //     history: guesses.map((g) => {
// // // // // //       const guessArr = toArray(g.guess);
// // // // // //       let fb;
// // // // // //       if (config.clueType === "direct") {
// // // // // //         // 3-state per-digit feedback, matching what submitGuess returns live
// // // // // //         fb = computePerDigitFeedback(secretArr, guessArr);
// // // // // //       } else if (config.clueType === "hard") {
// // // // // //         fb = { exactMatches: g.exact_matches, partialMatches: null };
// // // // // //       } else {
// // // // // //         fb = { exactMatches: g.exact_matches, partialMatches: g.partial_matches };
// // // // // //       }
// // // // // //       return {
// // // // // //         guess: guessArr,
// // // // // //         feedback: fb,
// // // // // //         createdAt: g.created_at,
// // // // // //       };
// // // // // //     }),
// // // // // //   });
// // // // // // }

// // // // // // async function submitGuess(req, res) {
// // // // // //   const { gameId } = req.params;
// // // // // //   const { guess, timeLeft } = req.body;

// // // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // // //   const game = rows[0];
// // // // // //   const config = DIFFICULTY_CONFIG[game.difficulty];

// // // // // //   if (game.status !== "playing") {
// // // // // //     return res.status(409).json({ error: `Game already finished (${game.status})`, ...publicGame(game) });
// // // // // //   }
// // // // // //   if (
// // // // // //     !Array.isArray(guess) ||
// // // // // //     guess.length !== game.code_length ||
// // // // // //     guess.some((d) => !Number.isInteger(d) || d < 0 || d > 9)
// // // // // //   ) {
// // // // // //     return res.status(400).json({ error: `Guess must be an array of ${game.code_length} digits (0-9)` });
// // // // // //   }

// // // // // //   const secretArr = toArray(game.secret_code);
// // // // // //   const feedback = computeFeedback(secretArr, guess);
// // // // // //   const gained = feedback.exactMatches * 30 + feedback.partialMatches * 10;

// // // // // //   const newAttemptsUsed = game.attempts_used + 1;
// // // // // //   let newScore = game.score + gained;

// // // // // //   const won = feedback.exactMatches === game.code_length;
// // // // // //   const outOfAttempts = !won && newAttemptsUsed >= game.max_attempts;

// // // // // //   let status = "playing";
// // // // // //   let finishedAt = null;

// // // // // //   if (won) {
// // // // // //     status = "won";
// // // // // //     finishedAt = new Date();
// // // // // //     const safeTimeLeft = Number.isFinite(timeLeft) ? Math.max(0, timeLeft) : 0;
// // // // // //     newScore += safeTimeLeft * 2;
// // // // // //   } else if (outOfAttempts) {
// // // // // //     status = "lost";
// // // // // //     finishedAt = new Date();
// // // // // //   }

// // // // // //   let newRevealedStr = game.revealed_code;
// // // // // //   let newlyRevealedCount = 0;
// // // // // //   if (config.clueType === "direct") {
// // // // // //     const previousRevealed = strToReveal(game.revealed_code || "?".repeat(game.code_length));
// // // // // //     const thisGuessReveal = computeDirectReveal(secretArr, guess);
// // // // // //     const merged = won ? secretArr : mergeReveal(previousRevealed, thisGuessReveal);
// // // // // //     newlyRevealedCount = countNewlyRevealed(previousRevealed, merged);
// // // // // //     newRevealedStr = revealToStr(merged);
// // // // // //   }

// // // // // //   await pool.query(
// // // // // //     `INSERT INTO guesses (game_id, guess, exact_matches, partial_matches) VALUES (?, ?, ?, ?)`,
// // // // // //     [gameId, toStr(guess), feedback.exactMatches, feedback.partialMatches]
// // // // // //   );

// // // // // //   await pool.query(
// // // // // //     `UPDATE games SET attempts_used = ?, score = ?, status = ?, finished_at = ?, revealed_code = ? WHERE id = ?`,
// // // // // //     [newAttemptsUsed, newScore, status, finishedAt, newRevealedStr, gameId]
// // // // // //   );

// // // // // //   const [updatedRows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);

// // // // // //   // Shape the feedback the client actually sees, based on clueType
// // // // // //   let clientFeedback;
// // // // // //   if (config.clueType === "direct") {
// // // // // //     // Easy mode — 3-state per-digit feedback: correct / exists-but-wrong-place / not-in-code
// // // // // //     clientFeedback = computePerDigitFeedback(secretArr, guess);
// // // // // //   } else if (config.clueType === "hard") {
// // // // // //     clientFeedback = { exactMatches: feedback.exactMatches, partialMatches: null };
// // // // // //   } else {
// // // // // //     clientFeedback = { exactMatches: feedback.exactMatches, partialMatches: feedback.partialMatches };
// // // // // //   }

// // // // // //   res.json({
// // // // // //     ...publicGame(updatedRows[0]),
// // // // // //     feedback: clientFeedback,
// // // // // //     ...(config.clueType === "direct" ? { newlyRevealedCount } : {}),
// // // // // //   });
// // // // // // }

// // // // // // async function getStats(req, res) {
// // // // // //   const [[totals]] = await pool.query(
// // // // // //     `SELECT
// // // // // //        COUNT(*) AS gamesPlayed,
// // // // // //        SUM(status = 'won') AS wins,
// // // // // //        MAX(score) AS highScore,
// // // // // //        AVG(CASE WHEN status = 'won' THEN attempts_used END) AS avgAttemptsToWin
// // // // // //      FROM games
// // // // // //      WHERE status != 'playing'`
// // // // // //   );

// // // // // //   const [finishedGames] = await pool.query(
// // // // // //     `SELECT status FROM games WHERE status != 'playing' ORDER BY finished_at ASC`
// // // // // //   );

// // // // // //   let bestStreak = 0;
// // // // // //   let runningStreak = 0;
// // // // // //   for (const game of finishedGames) {
// // // // // //     if (game.status === "won") {
// // // // // //       runningStreak += 1;
// // // // // //       bestStreak = Math.max(bestStreak, runningStreak);
// // // // // //     } else {
// // // // // //       runningStreak = 0;
// // // // // //     }
// // // // // //   }

// // // // // //   let currentStreak = 0;
// // // // // //   for (let i = finishedGames.length - 1; i >= 0; i--) {
// // // // // //     if (finishedGames[i].status === "won") {
// // // // // //       currentStreak += 1;
// // // // // //     } else {
// // // // // //       break;
// // // // // //     }
// // // // // //   }

// // // // // //   res.json({
// // // // // //     highScore: totals.highScore || 0,
// // // // // //     gamesPlayed: totals.gamesPlayed || 0,
// // // // // //     gamesWon: totals.wins || 0,
// // // // // //     currentStreak,
// // // // // //     bestStreak,
// // // // // //     avgAttempts: totals.avgAttemptsToWin ? Number(totals.avgAttemptsToWin) : 0,
// // // // // //   });
// // // // // // }

// // // // // // async function getHighScore(req, res) {
// // // // // //   const [[row]] = await pool.query("SELECT MAX(score) AS highScore FROM games WHERE status = 'won'");
// // // // // //   res.json({ highScore: row.highScore || 0 });
// // // // // // }

// // // // // // module.exports = { startGame, getGame, submitGuess, getStats, getHighScore };
// // // // // const { v4: uuidv4 } = require("uuid");
// // // // // const pool = require("../db");
// // // // // const { DIFFICULTY_CONFIG, VALID_DIFFICULTIES } = require("../config/difficulty");
// // // // // const { generateSecretCode } = require("../utils/random");
// // // // // const {
// // // // //   computeFeedback,
// // // // //   computeDirectReveal,
// // // // //   mergeReveal,
// // // // //   countNewlyRevealed,
// // // // //   revealToStr,
// // // // //   strToReveal,
// // // // // } = require("../utils/feedback");

// // // // // const toArray = (str) => str.split("").map(Number);
// // // // // const toStr = (arr) => arr.join("");

// // // // // // 3-state per-digit feedback for "direct" clueType (Easy mode):
// // // // // //  - "correct": right digit, right place
// // // // // //  - "present": digit exists in the secret, but at a different place
// // // // // //  - "absent" : digit does not exist in the secret at all
// // // // // function computePerDigitFeedback(secretArr, guess) {
// // // // //   const result = new Array(guess.length).fill(null);
// // // // //   const secretRemaining = [...secretArr];

// // // // //   // Pass 1 — exact matches
// // // // //   for (let i = 0; i < guess.length; i++) {
// // // // //     if (guess[i] === secretArr[i]) {
// // // // //       result[i] = { digit: guess[i], status: "correct" };
// // // // //       secretRemaining[i] = null;
// // // // //     }
// // // // //   }

// // // // //   // Pass 2 — present elsewhere vs absent entirely
// // // // //   for (let i = 0; i < guess.length; i++) {
// // // // //     if (result[i]) continue;
// // // // //     const foundIdx = secretRemaining.findIndex((d) => d === guess[i]);
// // // // //     if (foundIdx !== -1) {
// // // // //       result[i] = { digit: guess[i], status: "present" };
// // // // //       secretRemaining[foundIdx] = null;
// // // // //     } else {
// // // // //       result[i] = { digit: guess[i], status: "absent" };
// // // // //     }
// // // // //   }

// // // // //   return result;
// // // // // }

// // // // // function publicGame(row, { includeSecret = false } = {}) {
// // // // //   const config = DIFFICULTY_CONFIG[row.difficulty];

// // // // //   return {
// // // // //     gameId: row.id,
// // // // //     difficulty: row.difficulty,
// // // // //     clueType: config.clueType,
// // // // //     rounds: config.rounds,
// // // // //     codeLength: row.code_length,
// // // // //     maxAttempts: row.max_attempts,
// // // // //     timeLimitSec: row.time_limit_sec,
// // // // //     attemptsUsed: row.attempts_used,
// // // // //     attemptsLeft: row.max_attempts - row.attempts_used,
// // // // //     score: row.score,
// // // // //     status: row.status,
// // // // //     startedAt: row.started_at,
// // // // //     finishedAt: row.finished_at,
// // // // //     ...(config.clueType === "direct" && row.revealed_code
// // // // //       ? { revealedCode: strToReveal(row.revealed_code) }
// // // // //       : {}),
// // // // //     ...(includeSecret || row.status !== "playing"
// // // // //       ? { secretCode: toArray(row.secret_code) }
// // // // //       : {}),
// // // // //   };
// // // // // }

// // // // // async function startGame(req, res) {
// // // // //   const { difficulty, roundNumber } = req.body;

// // // // //   if (!VALID_DIFFICULTIES.includes(difficulty)) {
// // // // //     return res.status(400).json({
// // // // //       error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
// // // // //     });
// // // // //   }

// // // // //   const config = DIFFICULTY_CONFIG[difficulty];
// // // // //   const secret = generateSecretCode(config.codeLength);
// // // // //   const id = uuidv4();

// // // // //   // Easy mode ("direct" clueType): one position is given free every round,
// // // // //   // rotating through the positions as the round number increases.
// // // // //   //   round 1 -> index 0 revealed, round 2 -> index 1, round 3 -> index 2,
// // // // //   //   round 4 -> index 0 again, ... (cycles with codeLength)
// // // // //   let initialRevealed = null;
// // // // //   if (config.clueType === "direct") {
// // // // //     const round = Number.isInteger(roundNumber) && roundNumber > 0 ? roundNumber : 1;
// // // // //     const revealedIndex = (round - 1) % config.codeLength;
// // // // //     const revealArr = secret.map((digit, i) => (i === revealedIndex ? digit : null));
// // // // //     initialRevealed = revealToStr(revealArr);
// // // // //   }

// // // // //   await pool.query(
// // // // //     `INSERT INTO games (id, difficulty, secret_code, code_length, max_attempts, time_limit_sec, revealed_code)
// // // // //      VALUES (?, ?, ?, ?, ?, ?, ?)`,
// // // // //     [id, difficulty, toStr(secret), config.codeLength, config.maxAttempts, config.timeLimitSec, initialRevealed]
// // // // //   );

// // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [id]);
// // // // //   res.status(201).json(publicGame(rows[0]));
// // // // // }

// // // // // async function getGame(req, res) {
// // // // //   const { gameId } = req.params;
// // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // //   const [guesses] = await pool.query(
// // // // //     "SELECT guess, exact_matches, partial_matches, created_at FROM guesses WHERE game_id = ? ORDER BY id ASC",
// // // // //     [gameId]
// // // // //   );

// // // // //   const config = DIFFICULTY_CONFIG[rows[0].difficulty];
// // // // //   const secretArr = toArray(rows[0].secret_code);

// // // // //   res.json({
// // // // //     ...publicGame(rows[0]),
// // // // //     history: guesses.map((g) => {
// // // // //       const guessArr = toArray(g.guess);
// // // // //       let fb;
// // // // //       if (config.clueType === "direct") {
// // // // //         // 3-state per-digit feedback, matching what submitGuess returns live
// // // // //         fb = computePerDigitFeedback(secretArr, guessArr);
// // // // //       } else if (config.clueType === "hard") {
// // // // //         fb = { exactMatches: g.exact_matches, partialMatches: null };
// // // // //       } else {
// // // // //         fb = { exactMatches: g.exact_matches, partialMatches: g.partial_matches };
// // // // //       }
// // // // //       return {
// // // // //         guess: guessArr,
// // // // //         feedback: fb,
// // // // //         createdAt: g.created_at,
// // // // //       };
// // // // //     }),
// // // // //   });
// // // // // }

// // // // // async function submitGuess(req, res) {
// // // // //   const { gameId } = req.params;
// // // // //   const { guess, timeLeft } = req.body;

// // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // //   const game = rows[0];
// // // // //   const config = DIFFICULTY_CONFIG[game.difficulty];

// // // // //   if (game.status !== "playing") {
// // // // //     return res.status(409).json({ error: `Game already finished (${game.status})`, ...publicGame(game) });
// // // // //   }
// // // // //   if (
// // // // //     !Array.isArray(guess) ||
// // // // //     guess.length !== game.code_length ||
// // // // //     guess.some((d) => !Number.isInteger(d) || d < 0 || d > 9)
// // // // //   ) {
// // // // //     return res.status(400).json({ error: `Guess must be an array of ${game.code_length} digits (0-9)` });
// // // // //   }

// // // // //   const secretArr = toArray(game.secret_code);
// // // // //   const feedback = computeFeedback(secretArr, guess);
// // // // //   const gained = feedback.exactMatches * 30 + feedback.partialMatches * 10;

// // // // //   const newAttemptsUsed = game.attempts_used + 1;
// // // // //   let newScore = game.score + gained;

// // // // //   const won = feedback.exactMatches === game.code_length;
// // // // //   const outOfAttempts = !won && newAttemptsUsed >= game.max_attempts;

// // // // //   let status = "playing";
// // // // //   let finishedAt = null;

// // // // //   if (won) {
// // // // //     status = "won";
// // // // //     finishedAt = new Date();
// // // // //     const safeTimeLeft = Number.isFinite(timeLeft) ? Math.max(0, timeLeft) : 0;
// // // // //     newScore += safeTimeLeft * 2;
// // // // //   } else if (outOfAttempts) {
// // // // //     status = "lost";
// // // // //     finishedAt = new Date();
// // // // //   }

// // // // //   let newRevealedStr = game.revealed_code;
// // // // //   let newlyRevealedCount = 0;
// // // // //   if (config.clueType === "direct") {
// // // // //     const previousRevealed = strToReveal(game.revealed_code || "?".repeat(game.code_length));
// // // // //     const thisGuessReveal = computeDirectReveal(secretArr, guess);
// // // // //     const merged = won ? secretArr : mergeReveal(previousRevealed, thisGuessReveal);
// // // // //     newlyRevealedCount = countNewlyRevealed(previousRevealed, merged);
// // // // //     newRevealedStr = revealToStr(merged);
// // // // //   }

// // // // //   await pool.query(
// // // // //     `INSERT INTO guesses (game_id, guess, exact_matches, partial_matches) VALUES (?, ?, ?, ?)`,
// // // // //     [gameId, toStr(guess), feedback.exactMatches, feedback.partialMatches]
// // // // //   );

// // // // //   await pool.query(
// // // // //     `UPDATE games SET attempts_used = ?, score = ?, status = ?, finished_at = ?, revealed_code = ? WHERE id = ?`,
// // // // //     [newAttemptsUsed, newScore, status, finishedAt, newRevealedStr, gameId]
// // // // //   );

// // // // //   const [updatedRows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);

// // // // //   // Shape the feedback the client actually sees, based on clueType
// // // // //   let clientFeedback;
// // // // //   if (config.clueType === "direct") {
// // // // //     // Easy mode — 3-state per-digit feedback: correct / exists-but-wrong-place / not-in-code
// // // // //     clientFeedback = computePerDigitFeedback(secretArr, guess);
// // // // //   } else if (config.clueType === "hard") {
// // // // //     clientFeedback = { exactMatches: feedback.exactMatches, partialMatches: null };
// // // // //   } else {
// // // // //     clientFeedback = { exactMatches: feedback.exactMatches, partialMatches: feedback.partialMatches };
// // // // //   }

// // // // //   res.json({
// // // // //     ...publicGame(updatedRows[0]),
// // // // //     feedback: clientFeedback,
// // // // //     ...(config.clueType === "direct" ? { newlyRevealedCount } : {}),
// // // // //   });
// // // // // }

// // // // // // Instant per-digit check for Easy mode's numpad flash feedback.
// // // // // // Does NOT consume an attempt, does NOT write to guesses/history — purely
// // // // // // tells the client "correct / present / absent" the moment a key is tapped,
// // // // // // so the numpad key can flash green/red before the full guess is even typed.
// // // // // async function checkDigit(req, res) {
// // // // //   const { gameId } = req.params;
// // // // //   const { position, digit } = req.body;

// // // // //   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
// // // // //   if (rows.length === 0) return res.status(404).json({ error: "Game not found" });

// // // // //   const game = rows[0];
// // // // //   const config = DIFFICULTY_CONFIG[game.difficulty];

// // // // //   if (config.clueType !== "direct") {
// // // // //     return res.status(400).json({ error: "check-digit is only available for Easy (direct) difficulty" });
// // // // //   }
// // // // //   if (game.status !== "playing") {
// // // // //     return res.status(409).json({ error: `Game already finished (${game.status})` });
// // // // //   }
// // // // //   if (
// // // // //     !Number.isInteger(position) ||
// // // // //     position < 0 ||
// // // // //     position >= game.code_length ||
// // // // //     !Number.isInteger(digit) ||
// // // // //     digit < 0 ||
// // // // //     digit > 9
// // // // //   ) {
// // // // //     return res.status(400).json({ error: "Invalid position or digit" });
// // // // //   }

// // // // //   const secretArr = toArray(game.secret_code);
// // // // //   let status;
// // // // //   if (secretArr[position] === digit) {
// // // // //     status = "correct";
// // // // //   } else if (secretArr.includes(digit)) {
// // // // //     status = "present";
// // // // //   } else {
// // // // //     status = "absent";
// // // // //   }

// // // // //   res.json({ status });
// // // // // }

// // // // // async function getStats(req, res) {
// // // // //   const [[totals]] = await pool.query(
// // // // //     `SELECT
// // // // //        COUNT(*) AS gamesPlayed,
// // // // //        SUM(status = 'won') AS wins,
// // // // //        MAX(score) AS highScore,
// // // // //        AVG(CASE WHEN status = 'won' THEN attempts_used END) AS avgAttemptsToWin
// // // // //      FROM games
// // // // //      WHERE status != 'playing'`
// // // // //   );

// // // // //   const [finishedGames] = await pool.query(
// // // // //     `SELECT status FROM games WHERE status != 'playing' ORDER BY finished_at ASC`
// // // // //   );

// // // // //   let bestStreak = 0;
// // // // //   let runningStreak = 0;
// // // // //   for (const game of finishedGames) {
// // // // //     if (game.status === "won") {
// // // // //       runningStreak += 1;
// // // // //       bestStreak = Math.max(bestStreak, runningStreak);
// // // // //     } else {
// // // // //       runningStreak = 0;
// // // // //     }
// // // // //   }

// // // // //   let currentStreak = 0;
// // // // //   for (let i = finishedGames.length - 1; i >= 0; i--) {
// // // // //     if (finishedGames[i].status === "won") {
// // // // //       currentStreak += 1;
// // // // //     } else {
// // // // //       break;
// // // // //     }
// // // // //   }

// // // // //   res.json({
// // // // //     highScore: totals.highScore || 0,
// // // // //     gamesPlayed: totals.gamesPlayed || 0,
// // // // //     gamesWon: totals.wins || 0,
// // // // //     currentStreak,
// // // // //     bestStreak,
// // // // //     avgAttempts: totals.avgAttemptsToWin ? Number(totals.avgAttemptsToWin) : 0,
// // // // //   });
// // // // // }

// // // // // async function getHighScore(req, res) {
// // // // //   const [[row]] = await pool.query("SELECT MAX(score) AS highScore FROM games WHERE status = 'won'");
// // // // //   res.json({ highScore: row.highScore || 0 });
// // // // // }

// // // // // module.exports = { startGame, getGame, submitGuess, checkDigit, getStats, getHighScore };
// // // // const { v4: uuidv4 } = require("uuid");
// // // // const pool = require("../db");

// // // // const {
// // // //   DIFFICULTY_CONFIG,
// // // //   VALID_DIFFICULTIES,
// // // // } = require("../config/difficulty");

// // // // const { generateSecretCode } = require("../utils/random");

// // // // const {
// // // //   computeFeedback,
// // // //   computeDirectReveal,
// // // //   mergeReveal,
// // // //   countNewlyRevealed,
// // // //   revealToStr,
// // // //   strToReveal,
// // // // } = require("../utils/feedback");


// // // // // ============================================================
// // // // // HELPERS
// // // // // ============================================================

// // // // const toArray = (str) => String(str).split("").map(Number);

// // // // const toStr = (arr) => arr.join("");


// // // // // ============================================================
// // // // // PER-DIGIT CODE BREAKER FEEDBACK
// // // // //
// // // // // correct = correct digit + correct position
// // // // // present = correct digit + wrong position
// // // // // absent  = digit does not exist in secret
// // // // //
// // // // // Example:
// // // // //
// // // // // Secret : 527
// // // // // Guess  : 594
// // // // //
// // // // // Result:
// // // // // 5 -> correct
// // // // // 9 -> absent
// // // // // 4 -> absent
// // // // // ============================================================

// // // // function computePerDigitFeedback(secretArr, guess) {
// // // //   const result = new Array(guess.length).fill(null);

// // // //   // Copy secret so already-used digits are not reused
// // // //   const secretRemaining = [...secretArr];


// // // //   // ----------------------------------------------------------
// // // //   // PASS 1
// // // //   // Find exact matches first
// // // //   // ----------------------------------------------------------

// // // //   for (let i = 0; i < guess.length; i++) {
// // // //     if (guess[i] === secretArr[i]) {
// // // //       result[i] = {
// // // //         digit: guess[i],
// // // //         status: "correct",
// // // //       };

// // // //       // Mark this secret position as already used
// // // //       secretRemaining[i] = null;
// // // //     }
// // // //   }


// // // //   // ----------------------------------------------------------
// // // //   // PASS 2
// // // //   // Find correct digit but wrong position
// // // //   // Otherwise mark as absent
// // // //   // ----------------------------------------------------------

// // // //   for (let i = 0; i < guess.length; i++) {
// // // //     if (result[i]) {
// // // //       continue;
// // // //     }

// // // //     const foundIdx = secretRemaining.findIndex(
// // // //       (digit) => digit === guess[i]
// // // //     );

// // // //     if (foundIdx !== -1) {
// // // //       result[i] = {
// // // //         digit: guess[i],
// // // //         status: "present",
// // // //       };

// // // //       // Do not use the same secret digit again
// // // //       secretRemaining[foundIdx] = null;
// // // //     } else {
// // // //       result[i] = {
// // // //         digit: guess[i],
// // // //         status: "absent",
// // // //       };
// // // //     }
// // // //   }

// // // //   return result;
// // // // }


// // // // // ============================================================
// // // // // BUILD CLIENT CLUE
// // // // //
// // // // // EASY
// // // // // MEDIUM
// // // // //   -> exact digit-by-digit feedback
// // // // //
// // // // // HARD
// // // // //   -> count only
// // // // //
// // // // // EXTREME
// // // // //   -> minimal count information
// // // // // ============================================================

// // // // function buildClientFeedback({
// // // //   difficulty,
// // // //   secretArr,
// // // //   guess,
// // // //   feedback,
// // // // }) {
// // // //   // ==========================================================
// // // //   // EASY
// // // //   //
// // // //   // Show exact feedback for every digit
// // // //   //
// // // //   // 🟢 correct
// // // //   // 🟡 present
// // // //   // ⚪ absent
// // // //   // ==========================================================

// // // //   if (difficulty === "easy") {
// // // //     return {
// // // //       type: "per_digit",
// // // //       digits: computePerDigitFeedback(secretArr, guess),
// // // //     };
// // // //   }


// // // //   // ==========================================================
// // // //   // MEDIUM
// // // //   //
// // // //   // Also show exact digit-by-digit feedback.
// // // //   //
// // // //   // This gives the player more information than Hard/Extreme.
// // // //   // ==========================================================

// // // //   if (difficulty === "medium") {
// // // //     return {
// // // //       type: "per_digit",
// // // //       digits: computePerDigitFeedback(secretArr, guess),
// // // //     };
// // // //   }


// // // //   // ==========================================================
// // // //   // HARD
// // // //   //
// // // //   // DO NOT tell the player which digit.
// // // //   //
// // // //   // Only tell:
// // // //   //
// // // //   // 2 digits correct place
// // // //   // 1 digit wrong place
// // // //   // 2 digits not in code
// // // //   // ==========================================================

// // // //   if (difficulty === "hard") {
// // // //     const exactMatches = feedback.exactMatches;
// // // //     const partialMatches = feedback.partialMatches;

// // // //     const absentMatches =
// // // //       guess.length - exactMatches - partialMatches;

// // // //     return {
// // // //       type: "summary",

// // // //       exactMatches,

// // // //       partialMatches,

// // // //       absentMatches,
// // // //     };
// // // //   }


// // // //   // ==========================================================
// // // //   // EXTREME
// // // //   //
// // // //   // Give only minimal information.
// // // //   //
// // // //   // Example:
// // // //   //
// // // //   // 3 digits are in the secret code
// // // //   // Only 1 digit is in the correct place
// // // //   // ==========================================================

// // // //   if (difficulty === "extreme") {
// // // //     const exactMatches = feedback.exactMatches;
// // // //     const partialMatches = feedback.partialMatches;

// // // //     const digitsInCode =
// // // //       exactMatches + partialMatches;

// // // //     return {
// // // //       type: "minimal",

// // // //       digitsInCode,

// // // //       exactMatches,
// // // //     };
// // // //   }


// // // //   // ==========================================================
// // // //   // FALLBACK
// // // //   // ==========================================================

// // // //   return {
// // // //     type: "summary",
// // // //     exactMatches: feedback.exactMatches,
// // // //     partialMatches: feedback.partialMatches,
// // // //     absentMatches:
// // // //       guess.length -
// // // //       feedback.exactMatches -
// // // //       feedback.partialMatches,
// // // //   };
// // // // }


// // // // // ============================================================
// // // // // PUBLIC GAME
// // // // //
// // // // // IMPORTANT:
// // // // // Secret code is NOT returned while game is playing.
// // // // //
// // // // // It is returned only when:
// // // // // - game is finished
// // // // // - OR includeSecret = true
// // // // // ============================================================

// // // // function publicGame(row, { includeSecret = false } = {}) {
// // // //   const config = DIFFICULTY_CONFIG[row.difficulty];

// // // //   return {
// // // //     gameId: row.id,

// // // //     difficulty: row.difficulty,

// // // //     clueType: config.clueType,

// // // //     rounds: config.rounds,

// // // //     codeLength: row.code_length,

// // // //     maxAttempts: row.max_attempts,

// // // //     timeLimitSec: row.time_limit_sec,

// // // //     attemptsUsed: row.attempts_used,

// // // //     attemptsLeft:
// // // //       row.max_attempts - row.attempts_used,

// // // //     score: row.score,

// // // //     status: row.status,

// // // //     startedAt: row.started_at,

// // // //     finishedAt: row.finished_at,


// // // //     // --------------------------------------------------------
// // // //     // Easy revealed code
// // // //     // --------------------------------------------------------

// // // //     ...(config.clueType === "direct" &&
// // // //     row.revealed_code
// // // //       ? {
// // // //           revealedCode: strToReveal(
// // // //             row.revealed_code
// // // //           ),
// // // //         }
// // // //       : {}),


// // // //     // --------------------------------------------------------
// // // //     // Secret is only visible after game finishes
// // // //     // --------------------------------------------------------

// // // //     ...(includeSecret || row.status !== "playing"
// // // //       ? {
// // // //           secretCode: toArray(
// // // //             row.secret_code
// // // //           ),
// // // //         }
// // // //       : {}),
// // // //   };
// // // // }


// // // // // ============================================================
// // // // // START GAME
// // // // // ============================================================

// // // // async function startGame(req, res) {
// // // //   const {
// // // //     difficulty,
// // // //     roundNumber,
// // // //   } = req.body;


// // // //   // ----------------------------------------------------------
// // // //   // Validate difficulty
// // // //   // ----------------------------------------------------------

// // // //   if (
// // // //     !VALID_DIFFICULTIES.includes(difficulty)
// // // //   ) {
// // // //     return res.status(400).json({
// // // //       error:
// // // //         `Invalid difficulty. Must be one of: ` +
// // // //         `${VALID_DIFFICULTIES.join(", ")}`,
// // // //     });
// // // //   }


// // // //   // ----------------------------------------------------------
// // // //   // Difficulty configuration
// // // //   // ----------------------------------------------------------

// // // //   const config =
// // // //     DIFFICULTY_CONFIG[difficulty];


// // // //   // ----------------------------------------------------------
// // // //   // Generate secret code
// // // //   // ----------------------------------------------------------

// // // //   const secret =
// // // //     generateSecretCode(
// // // //       config.codeLength
// // // //     );


// // // //   const id = uuidv4();


// // // //   // ----------------------------------------------------------
// // // //   // Easy mode
// // // //   //
// // // //   // One digit is automatically revealed.
// // // //   //
// // // //   // Round 1 -> position 0
// // // //   // Round 2 -> position 1
// // // //   // Round 3 -> position 2
// // // //   // ...
// // // //   // Then cycles again.
// // // //   // ----------------------------------------------------------

// // // //   let initialRevealed = null;


// // // //   if (config.clueType === "direct") {
// // // //     const round =
// // // //       Number.isInteger(roundNumber) &&
// // // //       roundNumber > 0
// // // //         ? roundNumber
// // // //         : 1;


// // // //     const revealedIndex =
// // // //       (round - 1) %
// // // //       config.codeLength;


// // // //     const revealArr =
// // // //       secret.map((digit, i) =>
// // // //         i === revealedIndex
// // // //           ? digit
// // // //           : null
// // // //       );


// // // //     initialRevealed =
// // // //       revealToStr(revealArr);
// // // //   }


// // // //   // ----------------------------------------------------------
// // // //   // Save game
// // // //   // ----------------------------------------------------------

// // // //   await pool.query(
// // // //     `
// // // //       INSERT INTO games
// // // //       (
// // // //         id,
// // // //         difficulty,
// // // //         secret_code,
// // // //         code_length,
// // // //         max_attempts,
// // // //         time_limit_sec,
// // // //         revealed_code
// // // //       )
// // // //       VALUES (?, ?, ?, ?, ?, ?, ?)
// // // //     `,
// // // //     [
// // // //       id,
// // // //       difficulty,
// // // //       toStr(secret),
// // // //       config.codeLength,
// // // //       config.maxAttempts,
// // // //       config.timeLimitSec,
// // // //       initialRevealed,
// // // //     ]
// // // //   );


// // // //   // ----------------------------------------------------------
// // // //   // Get created game
// // // //   // ----------------------------------------------------------

// // // //   const [rows] =
// // // //     await pool.query(
// // // //       "SELECT * FROM games WHERE id = ?",
// // // //       [id]
// // // //     );


// // // //   // ----------------------------------------------------------
// // // //   // Return public game
// // // //   // ----------------------------------------------------------

// // // //   res.status(201).json(
// // // //     publicGame(rows[0])
// // // //   );
// // // // }


// // // // // ============================================================
// // // // // GET GAME
// // // // //
// // // // // Used when:
// // // // // - opening game
// // // // // - refreshing game
// // // // // - restoring game
// // // // // - loading history
// // // // // ============================================================

// // // // async function getGame(req, res) {
// // // //   const {
// // // //     gameId,
// // // //   } = req.params;


// // // //   // ----------------------------------------------------------
// // // //   // Find game
// // // //   // ----------------------------------------------------------

// // // //   const [rows] =
// // // //     await pool.query(
// // // //       "SELECT * FROM games WHERE id = ?",
// // // //       [gameId]
// // // //     );


// // // //   if (rows.length === 0) {
// // // //     return res.status(404).json({
// // // //       error: "Game not found",
// // // //     });
// // // //   }


// // // //   const game = rows[0];


// // // //   // ----------------------------------------------------------
// // // //   // Get guesses
// // // //   // ----------------------------------------------------------

// // // //   const [guesses] =
// // // //     await pool.query(
// // // //       `
// // // //         SELECT
// // // //           guess,
// // // //           exact_matches,
// // // //           partial_matches,
// // // //           created_at
// // // //         FROM guesses
// // // //         WHERE game_id = ?
// // // //         ORDER BY id ASC
// // // //       `,
// // // //       [gameId]
// // // //     );


// // // //   const secretArr =
// // // //     toArray(game.secret_code);


// // // //   // ----------------------------------------------------------
// // // //   // Build history
// // // //   // ----------------------------------------------------------

// // // //   const history =
// // // //     guesses.map((g) => {
// // // //       const guessArr =
// // // //         toArray(g.guess);


// // // //       const storedFeedback = {
// // // //         exactMatches:
// // // //           g.exact_matches,

// // // //         partialMatches:
// // // //           g.partial_matches,
// // // //       };


// // // //       // ------------------------------------------------------
// // // //       // EASY + MEDIUM
// // // //       // ------------------------------------------------------

// // // //       if (
// // // //         game.difficulty === "easy" ||
// // // //         game.difficulty === "medium"
// // // //       ) {
// // // //         return {
// // // //           guess: guessArr,

// // // //           feedback: {
// // // //             type: "per_digit",

// // // //             digits:
// // // //               computePerDigitFeedback(
// // // //                 secretArr,
// // // //                 guessArr
// // // //               ),
// // // //           },

// // // //           createdAt:
// // // //             g.created_at,
// // // //         };
// // // //       }


// // // //       // ------------------------------------------------------
// // // //       // HARD
// // // //       // ------------------------------------------------------

// // // //       if (
// // // //         game.difficulty === "hard"
// // // //       ) {
// // // //         return {
// // // //           guess: guessArr,

// // // //           feedback: {
// // // //             type: "summary",

// // // //             exactMatches:
// // // //               g.exact_matches,

// // // //             partialMatches:
// // // //               g.partial_matches,

// // // //             absentMatches:
// // // //               guessArr.length -
// // // //               g.exact_matches -
// // // //               g.partial_matches,
// // // //           },

// // // //           createdAt:
// // // //             g.created_at,
// // // //         };
// // // //       }


// // // //       // ------------------------------------------------------
// // // //       // EXTREME
// // // //       // ------------------------------------------------------

// // // //       if (
// // // //         game.difficulty === "extreme"
// // // //       ) {
// // // //         return {
// // // //           guess: guessArr,

// // // //           feedback: {
// // // //             type: "minimal",

// // // //             digitsInCode:
// // // //               g.exact_matches +
// // // //               g.partial_matches,

// // // //             exactMatches:
// // // //               g.exact_matches,
// // // //           },

// // // //           createdAt:
// // // //             g.created_at,
// // // //         };
// // // //       }


// // // //       // ------------------------------------------------------
// // // //       // Fallback
// // // //       // ------------------------------------------------------

// // // //       return {
// // // //         guess: guessArr,

// // // //         feedback:
// // // //           storedFeedback,

// // // //         createdAt:
// // // //           g.created_at,
// // // //       };
// // // //     });


// // // //   // ----------------------------------------------------------
// // // //   // Response
// // // //   // ----------------------------------------------------------

// // // //   res.json({
// // // //     ...publicGame(game),

// // // //     history,
// // // //   });
// // // // }


// // // // // ============================================================
// // // // // SUBMIT GUESS
// // // // // ============================================================

// // // // async function submitGuess(req, res) {
// // // //   const {
// // // //     gameId,
// // // //   } = req.params;


// // // //   const {
// // // //     guess,
// // // //     timeLeft,
// // // //   } = req.body;


// // // //   // ----------------------------------------------------------
// // // //   // Find game
// // // //   // ----------------------------------------------------------

// // // //   const [rows] =
// // // //     await pool.query(
// // // //       "SELECT * FROM games WHERE id = ?",
// // // //       [gameId]
// // // //     );


// // // //   if (rows.length === 0) {
// // // //     return res.status(404).json({
// // // //       error: "Game not found",
// // // //     });
// // // //   }


// // // //   const game = rows[0];


// // // //   const config =
// // // //     DIFFICULTY_CONFIG[
// // // //       game.difficulty
// // // //     ];


// // // //   // ----------------------------------------------------------
// // // //   // Check game status
// // // //   // ----------------------------------------------------------

// // // //   if (game.status !== "playing") {
// // // //     return res.status(409).json({
// // // //       error:
// // // //         `Game already finished (${game.status})`,

// // // //       ...publicGame(game),
// // // //     });
// // // //   }


// // // //   // ----------------------------------------------------------
// // // //   // Validate guess
// // // //   // ----------------------------------------------------------

// // // //   if (
// // // //     !Array.isArray(guess) ||
// // // //     guess.length !== game.code_length ||
// // // //     guess.some(
// // // //       (d) =>
// // // //         !Number.isInteger(d) ||
// // // //         d < 0 ||
// // // //         d > 9
// // // //     )
// // // //   ) {
// // // //     return res.status(400).json({
// // // //       error:
// // // //         `Guess must be an array of ` +
// // // //         `${game.code_length} digits (0-9)`,
// // // //     });
// // // //   }


// // // //   // ----------------------------------------------------------
// // // //   // Convert secret
// // // //   // ----------------------------------------------------------

// // // //   const secretArr =
// // // //     toArray(game.secret_code);


// // // //   // ----------------------------------------------------------
// // // //   // Calculate normal feedback
// // // //   //
// // // //   // exactMatches
// // // //   // partialMatches
// // // //   // ----------------------------------------------------------

// // // //   const feedback =
// // // //     computeFeedback(
// // // //       secretArr,
// // // //       guess
// // // //     );


// // // //   // ----------------------------------------------------------
// // // //   // Calculate score
// // // //   // ----------------------------------------------------------

// // // //   const gained =
// // // //     feedback.exactMatches * 30 +
// // // //     feedback.partialMatches * 10;


// // // //   const newAttemptsUsed =
// // // //     game.attempts_used + 1;


// // // //   let newScore =
// // // //     game.score + gained;


// // // //   // ----------------------------------------------------------
// // // //   // Check win
// // // //   // ----------------------------------------------------------

// // // //   const won =
// // // //     feedback.exactMatches ===
// // // //     game.code_length;


// // // //   // ----------------------------------------------------------
// // // //   // Check attempts
// // // //   // ----------------------------------------------------------

// // // //   const outOfAttempts =
// // // //     !won &&
// // // //     newAttemptsUsed >=
// // // //       game.max_attempts;


// // // //   // ----------------------------------------------------------
// // // //   // Status
// // // //   // ----------------------------------------------------------

// // // //   let status = "playing";

// // // //   let finishedAt = null;


// // // //   if (won) {
// // // //     status = "won";

// // // //     finishedAt =
// // // //       new Date();


// // // //     // --------------------------------------------------------
// // // //     // Time bonus
// // // //     // --------------------------------------------------------

// // // //     const safeTimeLeft =
// // // //       Number.isFinite(timeLeft)
// // // //         ? Math.max(
// // // //             0,
// // // //             timeLeft
// // // //           )
// // // //         : 0;


// // // //     newScore +=
// // // //       safeTimeLeft * 2;

// // // //   } else if (outOfAttempts) {
// // // //     status = "lost";

// // // //     finishedAt =
// // // //       new Date();
// // // //   }


// // // //   // ==========================================================
// // // //   // EASY REVEALED DIGITS
// // // //   // ==========================================================

// // // //   let newRevealedStr =
// // // //     game.revealed_code;


// // // //   let newlyRevealedCount = 0;


// // // //   if (
// // // //     config.clueType === "direct"
// // // //   ) {
// // // //     const previousRevealed =
// // // //       strToReveal(
// // // //         game.revealed_code ||
// // // //           "?".repeat(
// // // //             game.code_length
// // // //           )
// // // //       );


// // // //     const thisGuessReveal =
// // // //       computeDirectReveal(
// // // //         secretArr,
// // // //         guess
// // // //       );


// // // //     const merged =
// // // //       won
// // // //         ? secretArr
// // // //         : mergeReveal(
// // // //             previousRevealed,
// // // //             thisGuessReveal
// // // //           );


// // // //     newlyRevealedCount =
// // // //       countNewlyRevealed(
// // // //         previousRevealed,
// // // //         merged
// // // //       );


// // // //     newRevealedStr =
// // // //       revealToStr(merged);
// // // //   }


// // // //   // ==========================================================
// // // //   // SAVE GUESS
// // // //   // ==========================================================

// // // //   await pool.query(
// // // //     `
// // // //       INSERT INTO guesses
// // // //       (
// // // //         game_id,
// // // //         guess,
// // // //         exact_matches,
// // // //         partial_matches
// // // //       )
// // // //       VALUES (?, ?, ?, ?)
// // // //     `,
// // // //     [
// // // //       gameId,
// // // //       toStr(guess),
// // // //       feedback.exactMatches,
// // // //       feedback.partialMatches,
// // // //     ]
// // // //   );


// // // //   // ==========================================================
// // // //   // UPDATE GAME
// // // //   // ==========================================================

// // // //   await pool.query(
// // // //     `
// // // //       UPDATE games
// // // //       SET
// // // //         attempts_used = ?,
// // // //         score = ?,
// // // //         status = ?,
// // // //         finished_at = ?,
// // // //         revealed_code = ?
// // // //       WHERE id = ?
// // // //     `,
// // // //     [
// // // //       newAttemptsUsed,
// // // //       newScore,
// // // //       status,
// // // //       finishedAt,
// // // //       newRevealedStr,
// // // //       gameId,
// // // //     ]
// // // //   );


// // // //   // ==========================================================
// // // //   // GET UPDATED GAME
// // // //   // ==========================================================

// // // //   const [updatedRows] =
// // // //     await pool.query(
// // // //       "SELECT * FROM games WHERE id = ?",
// // // //       [gameId]
// // // //     );


// // // //   // ==========================================================
// // // //   // BUILD CLUE FOR FRONTEND
// // // //   // ==========================================================

// // // //   const clientFeedback =
// // // //     buildClientFeedback({
// // // //       difficulty:
// // // //         game.difficulty,

// // // //       secretArr,

// // // //       guess,

// // // //       feedback,
// // // //     });


// // // //   // ==========================================================
// // // //   // RESPONSE
// // // //   // ==========================================================

// // // //   res.json({
// // // //     ...publicGame(
// // // //       updatedRows[0]
// // // //     ),

// // // //     feedback:
// // // //       clientFeedback,


// // // //     // Easy only
// // // //     ...(config.clueType === "direct"
// // // //       ? {
// // // //           newlyRevealedCount,
// // // //         }
// // // //       : {}),
// // // //   });
// // // // }


// // // // // ============================================================
// // // // // CHECK DIGIT
// // // // //
// // // // // Easy mode only.
// // // // //
// // // // // This does NOT consume an attempt.
// // // // //
// // // // // Used when the user taps a digit on the numpad.
// // // // //
// // // // // Returns:
// // // // //
// // // // // correct
// // // // // present
// // // // // absent
// // // // // ============================================================

// // // // async function checkDigit(req, res) {
// // // //   const {
// // // //     gameId,
// // // //   } = req.params;


// // // //   const {
// // // //     position,
// // // //     digit,
// // // //   } = req.body;


// // // //   // ----------------------------------------------------------
// // // //   // Find game
// // // //   // ----------------------------------------------------------

// // // //   const [rows] =
// // // //     await pool.query(
// // // //       "SELECT * FROM games WHERE id = ?",
// // // //       [gameId]
// // // //     );


// // // //   if (rows.length === 0) {
// // // //     return res.status(404).json({
// // // //       error: "Game not found",
// // // //     });
// // // //   }


// // // //   const game = rows[0];


// // // //   const config =
// // // //     DIFFICULTY_CONFIG[
// // // //       game.difficulty
// // // //     ];


// // // //   // ----------------------------------------------------------
// // // //   // Only Easy
// // // //   // ----------------------------------------------------------

// // // //   if (
// // // //     config.clueType !== "direct"
// // // //   ) {
// // // //     return res.status(400).json({
// // // //       error:
// // // //         "check-digit is only available for Easy (direct) difficulty",
// // // //     });
// // // //   }


// // // //   // ----------------------------------------------------------
// // // //   // Check game status
// // // //   // ----------------------------------------------------------

// // // //   if (
// // // //     game.status !== "playing"
// // // //   ) {
// // // //     return res.status(409).json({
// // // //       error:
// // // //         `Game already finished (${game.status})`,
// // // //     });
// // // //   }


// // // //   // ----------------------------------------------------------
// // // //   // Validate position + digit
// // // //   // ----------------------------------------------------------

// // // //   if (
// // // //     !Number.isInteger(position) ||
// // // //     position < 0 ||
// // // //     position >= game.code_length ||
// // // //     !Number.isInteger(digit) ||
// // // //     digit < 0 ||
// // // //     digit > 9
// // // //   ) {
// // // //     return res.status(400).json({
// // // //       error:
// // // //         "Invalid position or digit",
// // // //     });
// // // //   }


// // // //   // ----------------------------------------------------------
// // // //   // Secret
// // // //   // ----------------------------------------------------------

// // // //   const secretArr =
// // // //     toArray(
// // // //       game.secret_code
// // // //     );


// // // //   // ----------------------------------------------------------
// // // //   // Calculate status
// // // //   // ----------------------------------------------------------

// // // //   let status;


// // // //   if (
// // // //     secretArr[position] === digit
// // // //   ) {
// // // //     status = "correct";

// // // //   } else if (
// // // //     secretArr.includes(digit)
// // // //   ) {
// // // //     status = "present";

// // // //   } else {
// // // //     status = "absent";
// // // //   }


// // // //   // ----------------------------------------------------------
// // // //   // Response
// // // //   // ----------------------------------------------------------

// // // //   res.json({
// // // //     status,
// // // //   });
// // // // }


// // // // // ============================================================
// // // // // STATS
// // // // // ============================================================

// // // // async function getStats(req, res) {
// // // //   const [[totals]] =
// // // //     await pool.query(
// // // //       `
// // // //         SELECT
// // // //           COUNT(*) AS gamesPlayed,

// // // //           SUM(
// // // //             status = 'won'
// // // //           ) AS wins,

// // // //           MAX(score) AS highScore,

// // // //           AVG(
// // // //             CASE
// // // //               WHEN status = 'won'
// // // //               THEN attempts_used
// // // //             END
// // // //           ) AS avgAttemptsToWin

// // // //         FROM games

// // // //         WHERE status != 'playing'
// // // //       `
// // // //     );


// // // //   // ----------------------------------------------------------
// // // //   // Finished games
// // // //   // ----------------------------------------------------------

// // // //   const [finishedGames] =
// // // //     await pool.query(
// // // //       `
// // // //         SELECT status
// // // //         FROM games
// // // //         WHERE status != 'playing'
// // // //         ORDER BY finished_at ASC
// // // //       `
// // // //     );


// // // //   // ----------------------------------------------------------
// // // //   // Best streak
// // // //   // ----------------------------------------------------------

// // // //   let bestStreak = 0;

// // // //   let runningStreak = 0;


// // // //   for (
// // // //     const game of finishedGames
// // // //   ) {
// // // //     if (
// // // //       game.status === "won"
// // // //     ) {
// // // //       runningStreak += 1;

// // // //       bestStreak =
// // // //         Math.max(
// // // //           bestStreak,
// // // //           runningStreak
// // // //         );

// // // //     } else {
// // // //       runningStreak = 0;
// // // //     }
// // // //   }


// // // //   // ----------------------------------------------------------
// // // //   // Current streak
// // // //   // ----------------------------------------------------------

// // // //   let currentStreak = 0;


// // // //   for (
// // // //     let i =
// // // //       finishedGames.length - 1;
// // // //     i >= 0;
// // // //     i--
// // // //   ) {
// // // //     if (
// // // //       finishedGames[i].status ===
// // // //       "won"
// // // //     ) {
// // // //       currentStreak += 1;

// // // //     } else {
// // // //       break;
// // // //     }
// // // //   }


// // // //   // ----------------------------------------------------------
// // // //   // Response
// // // //   // ----------------------------------------------------------

// // // //   res.json({
// // // //     highScore:
// // // //       totals.highScore || 0,

// // // //     gamesPlayed:
// // // //       totals.gamesPlayed || 0,

// // // //     gamesWon:
// // // //       totals.wins || 0,

// // // //     currentStreak,

// // // //     bestStreak,

// // // //     avgAttempts:
// // // //       totals.avgAttemptsToWin
// // // //         ? Number(
// // // //             totals.avgAttemptsToWin
// // // //           )
// // // //         : 0,
// // // //   });
// // // // }


// // // // // ============================================================
// // // // // HIGH SCORE
// // // // // ============================================================

// // // // async function getHighScore(req, res) {
// // // //   const [[row]] =
// // // //     await pool.query(
// // // //       `
// // // //         SELECT
// // // //           MAX(score) AS highScore
// // // //         FROM games
// // // //         WHERE status = 'won'
// // // //       `
// // // //     );


// // // //   res.json({
// // // //     highScore:
// // // //       row.highScore || 0,
// // // //   });
// // // // }


// // // // // ============================================================
// // // // // EXPORTS
// // // // // ============================================================

// // // // module.exports = {
// // // //   startGame,
// // // //   getGame,
// // // //   submitGuess,
// // // //   checkDigit,
// // // //   getStats,
// // // //   getHighScore,
// // // // };
// // // const crypto = require("crypto");
// // // const dbModule = require("../db");
// // // // Works whether db.js exports the pool directly or as { pool } (mysql2/promise).
// // // const db = dbModule.pool || dbModule;

// // // const { LEVELS, DIFFICULTY_TO_LEVEL, getLevel } = require("../config/levels");
// // // const {
// // //   generateSecret,
// // //   scoreGuess,
// // //   countPossible,
// // //   validateGuess,
// // //   calcStars,
// // // } = require("../utils/mastermind");

// // // const toCode = (str) => str.split("").map(Number);
// // // const fromCode = (arr) => arr.join("");

// // // const rowToCfg = (g) => ({
// // //   level: g.level,
// // //   slots: g.slots,
// // //   colors: g.colors,
// // //   allowRepeats: !!g.allow_repeats,
// // //   maxGuesses: g.max_guesses,
// // // });

// // // const getTotalStars = async (conn, playerId) => {
// // //   const [rows] = await conn.query(
// // //     "SELECT COALESCE(SUM(best_stars), 0) AS total FROM cb_progress WHERE player_id = ?",
// // //     [playerId]
// // //   );
// // //   return Number(rows[0].total);
// // // };

// // // /* ---------------------------------------------------------------
// // //    POST /games/start
// // //    body: { difficulty?, level?, playerId? }
// // // --------------------------------------------------------------- */
// // // exports.startGame = async (req, res) => {
// // //   try {
// // //     const { difficulty = "easy", level, playerId = "guest" } = req.body || {};
// // //     const levelNumber = parseInt(level, 10) || DIFFICULTY_TO_LEVEL[difficulty] || 1;
// // //     const cfg = getLevel(levelNumber);

// // //     const secret = generateSecret(cfg);
// // //     const id = crypto.randomUUID();

// // //     await db.query(
// // //       `INSERT INTO cb_games
// // //         (id, player_id, difficulty, level, slots, colors, allow_repeats, max_guesses, secret_code)
// // //        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// // //       [
// // //         id,
// // //         String(playerId).slice(0, 64),
// // //         String(difficulty).slice(0, 16),
// // //         cfg.level,
// // //         cfg.slots,
// // //         cfg.colors,
// // //         cfg.allowRepeats ? 1 : 0,
// // //         cfg.maxGuesses,
// // //         fromCode(secret),
// // //       ]
// // //     );

// // //     const totalStars = await getTotalStars(db, playerId);

// // //     // NOTE: the secret code is never sent while the game is running.
// // //     res.status(201).json({
// // //       gameId: id,
// // //       level: cfg.level,
// // //       totalLevels: LEVELS.length,
// // //       slots: cfg.slots,
// // //       colors: cfg.colors,
// // //       allowRepeats: cfg.allowRepeats,
// // //       maxGuesses: cfg.maxGuesses,
// // //       guessesUsed: 0,
// // //       guessesLeft: cfg.maxGuesses,
// // //       possibleCodes: countPossible(cfg, []),
// // //       status: "playing",
// // //       totalStars,
// // //     });
// // //   } catch (err) {
// // //     console.error("startGame error:", err);
// // //     res.status(500).json({ error: "Could not start the game" });
// // //   }
// // // };

// // // /* ---------------------------------------------------------------
// // //    POST /games/:id/guess
// // //    body: { guess: [1,3,4] }
// // // --------------------------------------------------------------- */
// // // exports.submitGuess = async (req, res) => {
// // //   const { id } = req.params;
// // //   const guess = req.body && req.body.guess;

// // //   let conn;
// // //   try {
// // //     conn = await db.getConnection();
// // //     await conn.beginTransaction();

// // //     // Lock the row so a double-tap on "Check" can never count twice.
// // //     const [games] = await conn.query("SELECT * FROM cb_games WHERE id = ? FOR UPDATE", [id]);
// // //     if (games.length === 0) {
// // //       await conn.rollback();
// // //       return res.status(404).json({ error: "Game not found" });
// // //     }

// // //     const g = games[0];
// // //     const cfg = rowToCfg(g);

// // //     if (g.status !== "playing") {
// // //       await conn.rollback();
// // //       return res.status(409).json({
// // //         error: "Game already finished",
// // //         status: g.status,
// // //         stars: g.stars,
// // //         guessesUsed: g.guesses_used,
// // //         secretCode: toCode(g.secret_code),
// // //       });
// // //     }

// // //     const problem = validateGuess(guess, cfg);
// // //     if (problem) {
// // //       await conn.rollback();
// // //       return res.status(400).json({ error: problem });
// // //     }

// // //     const secret = toCode(g.secret_code);
// // //     const { exact, misplaced } = scoreGuess(secret, guess);
// // //     const guessNo = g.guesses_used + 1;

// // //     const [prevRows] = await conn.query(
// // //       "SELECT guess_code, exact_count, misplaced_count FROM cb_guesses WHERE game_id = ? ORDER BY guess_no",
// // //       [id]
// // //     );
// // //     const history = prevRows.map((r) => ({
// // //       guess: toCode(r.guess_code),
// // //       exact: r.exact_count,
// // //       misplaced: r.misplaced_count,
// // //     }));
// // //     history.push({ guess, exact, misplaced });

// // //     const possibleCodes = countPossible(cfg, history);

// // //     let status = "playing";
// // //     let stars = 0;
// // //     if (exact === cfg.slots) {
// // //       status = "won";
// // //       stars = calcStars(guessNo, cfg.maxGuesses);
// // //     } else if (guessNo >= cfg.maxGuesses) {
// // //       status = "lost";
// // //     }

// // //     await conn.query(
// // //       `INSERT INTO cb_guesses (game_id, guess_no, guess_code, exact_count, misplaced_count, possible_left)
// // //        VALUES (?, ?, ?, ?, ?, ?)`,
// // //       [id, guessNo, fromCode(guess), exact, misplaced, possibleCodes]
// // //     );

// // //     await conn.query(
// // //       `UPDATE cb_games
// // //           SET guesses_used = ?, status = ?, stars = ?,
// // //               finished_at = IF(? = 'playing', NULL, NOW())
// // //         WHERE id = ?`,
// // //       [guessNo, status, stars, status, id]
// // //     );

// // //     if (status === "won") {
// // //       await conn.query(
// // //         `INSERT INTO cb_progress (player_id, level, best_stars, times_won)
// // //          VALUES (?, ?, ?, 1)
// // //          ON DUPLICATE KEY UPDATE
// // //            best_stars = GREATEST(best_stars, VALUES(best_stars)),
// // //            times_won  = times_won + 1`,
// // //         [g.player_id, g.level, stars]
// // //       );
// // //     }

// // //     const totalStars = await getTotalStars(conn, g.player_id);
// // //     await conn.commit();

// // //     const response = {
// // //       gameId: id,
// // //       guessNo,
// // //       guess,
// // //       feedback: { exact, misplaced },
// // //       guessesUsed: guessNo,
// // //       guessesLeft: cfg.maxGuesses - guessNo,
// // //       possibleCodes,
// // //       status,
// // //       stars,
// // //       totalStars,
// // //     };
// // //     if (status !== "playing") response.secretCode = secret; // reveal only when the round is over

// // //     res.json(response);
// // //   } catch (err) {
// // //     if (conn) await conn.rollback().catch(() => {});
// // //     console.error("submitGuess error:", err);
// // //     res.status(500).json({ error: "Could not check your guess" });
// // //   } finally {
// // //     if (conn) conn.release();
// // //   }
// // // };

// // // /* ---------------------------------------------------------------
// // //    GET /games/:id   (resume a game after reload)
// // // --------------------------------------------------------------- */
// // // exports.getGame = async (req, res) => {
// // //   try {
// // //     const [games] = await db.query("SELECT * FROM cb_games WHERE id = ?", [req.params.id]);
// // //     if (games.length === 0) return res.status(404).json({ error: "Game not found" });

// // //     const g = games[0];
// // //     const cfg = rowToCfg(g);

// // //     const [rows] = await db.query(
// // //       "SELECT guess_no, guess_code, exact_count, misplaced_count, possible_left FROM cb_guesses WHERE game_id = ? ORDER BY guess_no",
// // //       [g.id]
// // //     );
// // //     const history = rows.map((r) => ({
// // //       guessNo: r.guess_no,
// // //       guess: toCode(r.guess_code),
// // //       feedback: { exact: r.exact_count, misplaced: r.misplaced_count },
// // //     }));

// // //     const possibleCodes = rows.length
// // //       ? rows[rows.length - 1].possible_left
// // //       : countPossible(cfg, []);

// // //     const body = {
// // //       gameId: g.id,
// // //       level: g.level,
// // //       ...cfg,
// // //       guessesUsed: g.guesses_used,
// // //       guessesLeft: cfg.maxGuesses - g.guesses_used,
// // //       possibleCodes,
// // //       status: g.status,
// // //       stars: g.stars,
// // //       history,
// // //     };
// // //     if (g.status !== "playing") body.secretCode = toCode(g.secret_code);

// // //     res.json(body);
// // //   } catch (err) {
// // //     console.error("getGame error:", err);
// // //     res.status(500).json({ error: "Could not load the game" });
// // //   }
// // // };

// // // /* ---------------------------------------------------------------
// // //    GET /games/progress/:playerId   (Level Map + total stars)
// // // --------------------------------------------------------------- */
// // // exports.getProgress = async (req, res) => {
// // //   try {
// // //     const playerId = req.params.playerId || "guest";
// // //     const [rows] = await db.query(
// // //       "SELECT level, best_stars FROM cb_progress WHERE player_id = ?",
// // //       [playerId]
// // //     );
// // //     const best = {};
// // //     rows.forEach((r) => {
// // //       best[r.level] = r.best_stars;
// // //     });

// // //     const levels = LEVELS.map((l) => ({
// // //       level: l.level,
// // //       slots: l.slots,
// // //       colors: l.colors,
// // //       bestStars: best[l.level] || 0,
// // //       // Level 1 is always open; the next one opens after you win the previous one.
// // //       unlocked: l.level === 1 || (best[l.level - 1] || 0) > 0,
// // //     }));

// // //     res.json({
// // //       playerId,
// // //       totalStars: levels.reduce((sum, l) => sum + l.bestStars, 0),
// // //       levels,
// // //     });
// // //   } catch (err) {
// // //     console.error("getProgress error:", err);
// // //     res.status(500).json({ error: "Could not load progress" });
// // //   }
// // // };
// // const crypto = require("crypto");
// // const dbModule = require("../db");
// // // db.js may export the pool directly or as { pool }.
// // const rawDb = dbModule.pool || dbModule;
// // // If db.js uses plain "mysql2" (callback style), switch to its promise wrapper so await works.
// // // If it already uses "mysql2/promise", use it as it is.
// // const db = typeof rawDb.promise === "function" ? rawDb.promise() : rawDb;

// // const { LEVELS, DIFFICULTY_TO_LEVEL, getLevel } = require("../config/levels");
// // const {
// //   generateSecret,
// //   scoreGuess,
// //   countPossible,
// //   validateGuess,
// //   calcStars,
// // } = require("../utils/mastermind");

// // const toCode = (str) => str.split("").map(Number);
// // const fromCode = (arr) => arr.join("");

// // const rowToCfg = (g) => ({
// //   level: g.level,
// //   slots: g.slots,
// //   colors: g.colors,
// //   allowRepeats: !!g.allow_repeats,
// //   maxGuesses: g.max_guesses,
// // });

// // const getTotalStars = async (conn, playerId) => {
// //   const [rows] = await conn.query(
// //     "SELECT COALESCE(SUM(best_stars), 0) AS total FROM cb_progress WHERE player_id = ?",
// //     [playerId]
// //   );
// //   return Number(rows[0].total);
// // };

// // /* ---------------------------------------------------------------
// //    POST /games/start
// //    body: { difficulty?, level?, playerId? }
// // --------------------------------------------------------------- */
// // exports.startGame = async (req, res) => {
// //   try {
// //     const { difficulty = "easy", level, playerId = "guest" } = req.body || {};
// //     const levelNumber = parseInt(level, 10) || DIFFICULTY_TO_LEVEL[difficulty] || 1;
// //     const cfg = getLevel(levelNumber);

// //     const secret = generateSecret(cfg);
// //     const id = crypto.randomUUID();

// //     await db.query(
// //       `INSERT INTO cb_games
// //         (id, player_id, difficulty, level, slots, colors, allow_repeats, max_guesses, secret_code)
// //        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// //       [
// //         id,
// //         String(playerId).slice(0, 64),
// //         String(difficulty).slice(0, 16),
// //         cfg.level,
// //         cfg.slots,
// //         cfg.colors,
// //         cfg.allowRepeats ? 1 : 0,
// //         cfg.maxGuesses,
// //         fromCode(secret),
// //       ]
// //     );

// //     const totalStars = await getTotalStars(db, playerId);

// //     // NOTE: the secret code is never sent while the game is running.
// //     res.status(201).json({
// //       gameId: id,
// //       level: cfg.level,
// //       totalLevels: LEVELS.length,
// //       slots: cfg.slots,
// //       colors: cfg.colors,
// //       allowRepeats: cfg.allowRepeats,
// //       maxGuesses: cfg.maxGuesses,
// //       guessesUsed: 0,
// //       guessesLeft: cfg.maxGuesses,
// //       possibleCodes: countPossible(cfg, []),
// //       status: "playing",
// //       totalStars,
// //     });
// //   } catch (err) {
// //     console.error("startGame error:", err);
// //     res.status(500).json({ error: "Could not start the game" });
// //   }
// // };

// // /* ---------------------------------------------------------------
// //    POST /games/:id/guess
// //    body: { guess: [1,3,4] }
// // --------------------------------------------------------------- */
// // exports.submitGuess = async (req, res) => {
// //   const { id } = req.params;
// //   const guess = req.body && req.body.guess;

// //   let conn;
// //   try {
// //     conn = await db.getConnection();
// //     await conn.beginTransaction();

// //     // Lock the row so a double-tap on "Check" can never count twice.
// //     const [games] = await conn.query("SELECT * FROM cb_games WHERE id = ? FOR UPDATE", [id]);
// //     if (games.length === 0) {
// //       await conn.rollback();
// //       return res.status(404).json({ error: "Game not found" });
// //     }

// //     const g = games[0];
// //     const cfg = rowToCfg(g);

// //     if (g.status !== "playing") {
// //       await conn.rollback();
// //       return res.status(409).json({
// //         error: "Game already finished",
// //         status: g.status,
// //         stars: g.stars,
// //         guessesUsed: g.guesses_used,
// //         secretCode: toCode(g.secret_code),
// //       });
// //     }

// //     const problem = validateGuess(guess, cfg);
// //     if (problem) {
// //       await conn.rollback();
// //       return res.status(400).json({ error: problem });
// //     }

// //     const secret = toCode(g.secret_code);
// //     const { exact, misplaced } = scoreGuess(secret, guess);
// //     const guessNo = g.guesses_used + 1;

// //     const [prevRows] = await conn.query(
// //       "SELECT guess_code, exact_count, misplaced_count FROM cb_guesses WHERE game_id = ? ORDER BY guess_no",
// //       [id]
// //     );
// //     const history = prevRows.map((r) => ({
// //       guess: toCode(r.guess_code),
// //       exact: r.exact_count,
// //       misplaced: r.misplaced_count,
// //     }));
// //     history.push({ guess, exact, misplaced });

// //     const possibleCodes = countPossible(cfg, history);

// //     let status = "playing";
// //     let stars = 0;
// //     if (exact === cfg.slots) {
// //       status = "won";
// //       stars = calcStars(guessNo, cfg.maxGuesses);
// //     } else if (guessNo >= cfg.maxGuesses) {
// //       status = "lost";
// //     }

// //     await conn.query(
// //       `INSERT INTO cb_guesses (game_id, guess_no, guess_code, exact_count, misplaced_count, possible_left)
// //        VALUES (?, ?, ?, ?, ?, ?)`,
// //       [id, guessNo, fromCode(guess), exact, misplaced, possibleCodes]
// //     );

// //     await conn.query(
// //       `UPDATE cb_games
// //           SET guesses_used = ?, status = ?, stars = ?,
// //               finished_at = IF(? = 'playing', NULL, NOW())
// //         WHERE id = ?`,
// //       [guessNo, status, stars, status, id]
// //     );

// //     if (status === "won") {
// //       await conn.query(
// //         `INSERT INTO cb_progress (player_id, level, best_stars, times_won)
// //          VALUES (?, ?, ?, 1)
// //          ON DUPLICATE KEY UPDATE
// //            best_stars = GREATEST(best_stars, VALUES(best_stars)),
// //            times_won  = times_won + 1`,
// //         [g.player_id, g.level, stars]
// //       );
// //     }

// //     const totalStars = await getTotalStars(conn, g.player_id);
// //     await conn.commit();

// //     const response = {
// //       gameId: id,
// //       guessNo,
// //       guess,
// //       feedback: { exact, misplaced },
// //       guessesUsed: guessNo,
// //       guessesLeft: cfg.maxGuesses - guessNo,
// //       possibleCodes,
// //       status,
// //       stars,
// //       totalStars,
// //     };
// //     if (status !== "playing") response.secretCode = secret; // reveal only when the round is over

// //     res.json(response);
// //   } catch (err) {
// //     if (conn) await conn.rollback().catch(() => {});
// //     console.error("submitGuess error:", err);
// //     res.status(500).json({ error: "Could not check your guess" });
// //   } finally {
// //     if (conn) conn.release();
// //   }
// // };

// // /* ---------------------------------------------------------------
// //    GET /games/:id   (resume a game after reload)
// // --------------------------------------------------------------- */
// // exports.getGame = async (req, res) => {
// //   try {
// //     const [games] = await db.query("SELECT * FROM cb_games WHERE id = ?", [req.params.id]);
// //     if (games.length === 0) return res.status(404).json({ error: "Game not found" });

// //     const g = games[0];
// //     const cfg = rowToCfg(g);

// //     const [rows] = await db.query(
// //       "SELECT guess_no, guess_code, exact_count, misplaced_count, possible_left FROM cb_guesses WHERE game_id = ? ORDER BY guess_no",
// //       [g.id]
// //     );
// //     const history = rows.map((r) => ({
// //       guessNo: r.guess_no,
// //       guess: toCode(r.guess_code),
// //       feedback: { exact: r.exact_count, misplaced: r.misplaced_count },
// //     }));

// //     const possibleCodes = rows.length
// //       ? rows[rows.length - 1].possible_left
// //       : countPossible(cfg, []);

// //     const body = {
// //       gameId: g.id,
// //       level: g.level,
// //       ...cfg,
// //       guessesUsed: g.guesses_used,
// //       guessesLeft: cfg.maxGuesses - g.guesses_used,
// //       possibleCodes,
// //       status: g.status,
// //       stars: g.stars,
// //       history,
// //     };
// //     if (g.status !== "playing") body.secretCode = toCode(g.secret_code);

// //     res.json(body);
// //   } catch (err) {
// //     console.error("getGame error:", err);
// //     res.status(500).json({ error: "Could not load the game" });
// //   }
// // };

// // /* ---------------------------------------------------------------
// //    GET /games/progress/:playerId   (Level Map + total stars)
// // --------------------------------------------------------------- */
// // exports.getProgress = async (req, res) => {
// //   try {
// //     const playerId = req.params.playerId || "guest";
// //     const [rows] = await db.query(
// //       "SELECT level, best_stars FROM cb_progress WHERE player_id = ?",
// //       [playerId]
// //     );
// //     const best = {};
// //     rows.forEach((r) => {
// //       best[r.level] = r.best_stars;
// //     });

// //     const levels = LEVELS.map((l) => ({
// //       level: l.level,
// //       slots: l.slots,
// //       colors: l.colors,
// //       bestStars: best[l.level] || 0,
// //       // Level 1 is always open; the next one opens after you win the previous one.
// //       unlocked: l.level === 1 || (best[l.level - 1] || 0) > 0,
// //     }));

// //     res.json({
// //       playerId,
// //       totalStars: levels.reduce((sum, l) => sum + l.bestStars, 0),
// //       levels,
// //     });
// //   } catch (err) {
// //     console.error("getProgress error:", err);
// //     res.status(500).json({ error: "Could not load progress" });
// //   }
// // };
// const crypto = require("crypto");
// const dbModule = require("../db");
// // db.js may export the pool directly or as { pool }.
// const rawDb = dbModule.pool || dbModule;
// // If db.js uses plain "mysql2" (callback style), switch to its promise wrapper so await works.
// // If it already uses "mysql2/promise", use it as it is.
// const db = typeof rawDb.promise === "function" ? rawDb.promise() : rawDb;

// const { LEVELS, DIFFICULTY_TO_LEVEL, getLevel } = require("../config/levels");
// const {
//   generateSecret,
//   scoreGuess,
//   countPossible,
//   validateGuess,
//   calcStars,
// } = require("../utils/mastermind");

// const toCode = (str) => str.split("").map(Number);
// const fromCode = (arr) => arr.join("");

// const rowToCfg = (g) => ({
//   level: g.level,
//   slots: g.slots,
//   colors: g.colors,
//   allowRepeats: !!g.allow_repeats,
//   maxGuesses: g.max_guesses,
// });

// const getTotalStars = async (conn, playerId) => {
//   const [rows] = await conn.query(
//     "SELECT COALESCE(SUM(best_stars), 0) AS total FROM cb_progress WHERE player_id = ?",
//     [playerId]
//   );
//   return Number(rows[0].total);
// };

// /* ---------------------------------------------------------------
//    POST /games/start
//    body: { difficulty?, level?, playerId? }
// --------------------------------------------------------------- */
// exports.startGame = async (req, res) => {
//   try {
//     const { difficulty = "easy", level, playerId = "guest" } = req.body || {};
//     const levelNumber = parseInt(level, 10) || DIFFICULTY_TO_LEVEL[difficulty] || 1;
//     const cfg = getLevel(levelNumber);

//     const secret = generateSecret(cfg);
//     const id = crypto.randomUUID();

//     await db.query(
//       `INSERT INTO cb_games
//         (id, player_id, difficulty, level, slots, colors, allow_repeats, max_guesses, secret_code)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         id,
//         String(playerId).slice(0, 64),
//         String(difficulty).slice(0, 16),
//         cfg.level,
//         cfg.slots,
//         cfg.colors,
//         cfg.allowRepeats ? 1 : 0,
//         cfg.maxGuesses,
//         fromCode(secret),
//       ]
//     );

//     const totalStars = await getTotalStars(db, playerId);

//     // NOTE: the secret code is never sent while the game is running.
//     res.status(201).json({
//       gameId: id,
//       level: cfg.level,
//       totalLevels: LEVELS.length,
//       slots: cfg.slots,
//       colors: cfg.colors,
//       allowRepeats: cfg.allowRepeats,
//       maxGuesses: cfg.maxGuesses,
//       guessesUsed: 0,
//       guessesLeft: cfg.maxGuesses,
//       possibleCodes: countPossible(cfg, []),
//       status: "playing",
//       totalStars,
//     });
//   } catch (err) {
//     console.error("startGame error:", err);
//     res.status(500).json({ error: "Could not start the game" });
//   }
// };

// /* ---------------------------------------------------------------
//    POST /games/:id/guess
//    body: { guess: [1,3,4] }
// --------------------------------------------------------------- */
// exports.submitGuess = async (req, res) => {
//   const { id } = req.params;
//   const guess = req.body && req.body.guess;

//   let conn;
//   try {
//     conn = await db.getConnection();
//     await conn.beginTransaction();

//     // Lock the row so a double-tap on "Check" can never count twice.
//     const [games] = await conn.query("SELECT * FROM cb_games WHERE id = ? FOR UPDATE", [id]);
//     if (games.length === 0) {
//       await conn.rollback();
//       return res.status(404).json({ error: "Game not found" });
//     }

//     const g = games[0];
//     const cfg = rowToCfg(g);

//     if (g.status !== "playing") {
//       await conn.rollback();
//       return res.status(409).json({
//         error: "Game already finished",
//         status: g.status,
//         stars: g.stars,
//         guessesUsed: g.guesses_used,
//         secretCode: toCode(g.secret_code),
//       });
//     }

//     const problem = validateGuess(guess, cfg);
//     if (problem) {
//       await conn.rollback();
//       return res.status(400).json({ error: problem });
//     }

//     const secret = toCode(g.secret_code);
//     const { exact, misplaced } = scoreGuess(secret, guess);
//     const guessNo = g.guesses_used + 1;

//     const [prevRows] = await conn.query(
//       "SELECT guess_code, exact_count, misplaced_count FROM cb_guesses WHERE game_id = ? ORDER BY guess_no",
//       [id]
//     );
//     const history = prevRows.map((r) => ({
//       guess: toCode(r.guess_code),
//       exact: r.exact_count,
//       misplaced: r.misplaced_count,
//     }));
//     history.push({ guess, exact, misplaced });

//     const possibleCodes = countPossible(cfg, history);

//     let status = "playing";
//     let stars = 0;
//     if (exact === cfg.slots) {
//       status = "won";
//       stars = calcStars(guessNo, cfg.maxGuesses);
//     } else if (guessNo >= cfg.maxGuesses) {
//       status = "lost";
//     }

//     await conn.query(
//       `INSERT INTO cb_guesses (game_id, guess_no, guess_code, exact_count, misplaced_count, possible_left)
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       [id, guessNo, fromCode(guess), exact, misplaced, possibleCodes]
//     );

//     await conn.query(
//       `UPDATE cb_games
//           SET guesses_used = ?, status = ?, stars = ?,
//               finished_at = IF(? = 'playing', NULL, NOW())
//         WHERE id = ?`,
//       [guessNo, status, stars, status, id]
//     );

//     if (status === "won") {
//       await conn.query(
//         `INSERT INTO cb_progress (player_id, level, best_stars, times_won)
//          VALUES (?, ?, ?, 1)
//          ON DUPLICATE KEY UPDATE
//            best_stars = GREATEST(best_stars, VALUES(best_stars)),
//            times_won  = times_won + 1`,
//         [g.player_id, g.level, stars]
//       );
//     }

//     const totalStars = await getTotalStars(conn, g.player_id);
//     await conn.commit();

//     const response = {
//       gameId: id,
//       guessNo,
//       guess,
//       feedback: { exact, misplaced },
//       guessesUsed: guessNo,
//       guessesLeft: cfg.maxGuesses - guessNo,
//       possibleCodes,
//       status,
//       stars,
//       totalStars,
//     };
//     if (status !== "playing") response.secretCode = secret; // reveal only when the round is over

//     res.json(response);
//   } catch (err) {
//     if (conn) await conn.rollback().catch(() => {});
//     console.error("submitGuess error:", err);
//     res.status(500).json({ error: "Could not check your guess" });
//   } finally {
//     if (conn) conn.release();
//   }
// };

// /* ---------------------------------------------------------------
//    GET /games/:id   (resume a game after reload)
// --------------------------------------------------------------- */
// exports.getGame = async (req, res) => {
//   try {
//     const [games] = await db.query("SELECT * FROM cb_games WHERE id = ?", [req.params.id]);
//     if (games.length === 0) return res.status(404).json({ error: "Game not found" });

//     const g = games[0];
//     const cfg = rowToCfg(g);

//     const [rows] = await db.query(
//       "SELECT guess_no, guess_code, exact_count, misplaced_count, possible_left FROM cb_guesses WHERE game_id = ? ORDER BY guess_no",
//       [g.id]
//     );
//     const history = rows.map((r) => ({
//       guessNo: r.guess_no,
//       guess: toCode(r.guess_code),
//       feedback: { exact: r.exact_count, misplaced: r.misplaced_count },
//     }));

//     const possibleCodes = rows.length
//       ? rows[rows.length - 1].possible_left
//       : countPossible(cfg, []);

//     const body = {
//       gameId: g.id,
//       level: g.level,
//       ...cfg,
//       guessesUsed: g.guesses_used,
//       guessesLeft: cfg.maxGuesses - g.guesses_used,
//       possibleCodes,
//       status: g.status,
//       stars: g.stars,
//       history,
//     };
//     if (g.status !== "playing") body.secretCode = toCode(g.secret_code);

//     res.json(body);
//   } catch (err) {
//     console.error("getGame error:", err);
//     res.status(500).json({ error: "Could not load the game" });
//   }
// };

// /* ---------------------------------------------------------------
//    GET /games/progress/:playerId   (Level Map + total stars)
// --------------------------------------------------------------- */
// exports.getProgress = async (req, res) => {
//   try {
//     const playerId = req.params.playerId || "guest";
//     const [rows] = await db.query(
//       "SELECT level, best_stars FROM cb_progress WHERE player_id = ?",
//       [playerId]
//     );
//     const best = {};
//     rows.forEach((r) => {
//       best[r.level] = r.best_stars;
//     });

//     const levels = LEVELS.map((l) => ({
//       level: l.level,
//       slots: l.slots,
//       colors: l.colors,
//       maxGuesses: l.maxGuesses,
//       bestStars: best[l.level] || 0,
//       // Level 1 is always open; the next one opens after you win the previous one.
//       unlocked: l.level === 1 || (best[l.level - 1] || 0) > 0,
//     }));

//     res.json({
//       playerId,
//       totalStars: levels.reduce((sum, l) => sum + l.bestStars, 0),
//       levels,
//     });
//   } catch (err) {
//     console.error("getProgress error:", err);
//     res.status(500).json({ error: "Could not load progress" });
//   }
// };
const crypto = require("crypto");
const dbModule = require("../db");
// db.js may export the pool directly or as { pool }.
const rawDb = dbModule.pool || dbModule;
// If db.js uses plain "mysql2" (callback style), switch to its promise wrapper so await works.
// If it already uses "mysql2/promise", use it as it is.
const db = typeof rawDb.promise === "function" ? rawDb.promise() : rawDb;
const { logActivity } = require("../utils/playerActivity");

const { LEVELS, getLevel } = require("../config/levels");
const {
  generateSecret,
  scoreGuess,
  countPossible,
  validateGuess,
  calcStars,
} = require("../utils/mastermind");

const toCode = (str) => str.split("").map(Number);
const fromCode = (arr) => arr.join("");

const rowToCfg = (g) => ({
  level: g.level,
  slots: g.slots,
  colors: g.colors,
  allowRepeats: !!g.allow_repeats,
  maxGuesses: g.max_guesses,
});

const getTotalStars = async (conn, playerId) => {
  const [rows] = await conn.query(
    "SELECT COALESCE(SUM(best_stars), 0) AS total FROM cb_progress WHERE player_id = ?",
    [playerId]
  );
  return Number(rows[0].total);
};

/* ---------------------------------------------------------------
   Progress rules
   - You can only play your CURRENT level (first level without a star).
   - Levels you already won stay closed (no going back to level 1).
   - Once ALL levels are won, every level opens again for replay.
--------------------------------------------------------------- */
const loadProgress = async (conn, playerId) => {
  const [rows] = await conn.query(
    "SELECT level, best_stars FROM cb_progress WHERE player_id = ?",
    [playerId]
  );
  const best = {};
  rows.forEach((r) => {
    best[r.level] = r.best_stars;
  });
  const firstOpen = LEVELS.find((l) => !(best[l.level] > 0));
  return {
    best,
    allCompleted: !firstOpen,
    currentLevel: firstOpen ? firstOpen.level : null,
  };
};

/* ---------------------------------------------------------------
   POST /games/start
   body: { difficulty?, level?, playerId? }
--------------------------------------------------------------- */
exports.startGame = async (req, res) => {
  try {
    const { difficulty = "easy", level, playerId = "guest" } = req.body || {};
    const pid = String(playerId).slice(0, 64);

    const progress = await loadProgress(db, pid);

    let levelNumber = parseInt(level, 10);
    if (!levelNumber || levelNumber < 1 || levelNumber > LEVELS.length) {
      levelNumber = progress.currentLevel || 1;
    }
    // Not all levels finished yet -> only the current level is playable.
    if (!progress.allCompleted && levelNumber !== progress.currentLevel) {
      levelNumber = progress.currentLevel;
    }

    const cfg = getLevel(levelNumber);

    const secret = generateSecret(cfg);
    const id = crypto.randomUUID();

    await db.query(
      `INSERT INTO cb_games
        (id, player_id, difficulty, level, slots, colors, allow_repeats, max_guesses, secret_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        pid,
        String(difficulty).slice(0, 16),
        cfg.level,
        cfg.slots,
        cfg.colors,
        cfg.allowRepeats ? 1 : 0,
        cfg.maxGuesses,
        fromCode(secret),
      ]
    );

    const totalStars = await getTotalStars(db, pid);

    // NOTE: the secret code is never sent while the game is running.
    res.status(201).json({
      gameId: id,
      level: cfg.level,
      totalLevels: LEVELS.length,
      slots: cfg.slots,
      colors: cfg.colors,
      allowRepeats: cfg.allowRepeats,
      maxGuesses: cfg.maxGuesses,
      guessesUsed: 0,
      guessesLeft: cfg.maxGuesses,
      possibleCodes: countPossible(cfg, []),
      status: "playing",
      totalStars,
    });
  } catch (err) {
    console.error("startGame error:", err);
    res.status(500).json({ error: "Could not start the game" });
  }
};

/* ---------------------------------------------------------------
   POST /games/:id/guess
   body: { guess: [1,3,4] }
--------------------------------------------------------------- */
exports.submitGuess = async (req, res) => {
  const { id } = req.params;
  const guess = req.body && req.body.guess;

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    // Lock the row so a double-tap on "Check" can never count twice.
    const [games] = await conn.query("SELECT * FROM cb_games WHERE id = ? FOR UPDATE", [id]);
    if (games.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Game not found" });
    }

    const g = games[0];
    const cfg = rowToCfg(g);

    if (g.status !== "playing") {
      await conn.rollback();
      return res.status(409).json({
        error: "Game already finished",
        status: g.status,
        stars: g.stars,
        guessesUsed: g.guesses_used,
        secretCode: toCode(g.secret_code),
      });
    }

    const problem = validateGuess(guess, cfg);
    if (problem) {
      await conn.rollback();
      return res.status(400).json({ error: problem });
    }

    const secret = toCode(g.secret_code);
    const { exact, misplaced } = scoreGuess(secret, guess);
    const guessNo = g.guesses_used + 1;

    const [prevRows] = await conn.query(
      "SELECT guess_code, exact_count, misplaced_count FROM cb_guesses WHERE game_id = ? ORDER BY guess_no",
      [id]
    );
    const history = prevRows.map((r) => ({
      guess: toCode(r.guess_code),
      exact: r.exact_count,
      misplaced: r.misplaced_count,
    }));
    history.push({ guess, exact, misplaced });

    const possibleCodes = countPossible(cfg, history);

    let status = "playing";
    let stars = 0;
    if (exact === cfg.slots) {
      status = "won";
      stars = calcStars(guessNo, cfg.maxGuesses);
    } else if (guessNo >= cfg.maxGuesses) {
      status = "lost";
    }

    await conn.query(
      `INSERT INTO cb_guesses (game_id, guess_no, guess_code, exact_count, misplaced_count, possible_left)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, guessNo, fromCode(guess), exact, misplaced, possibleCodes]
    );

    await conn.query(
      `UPDATE cb_games
          SET guesses_used = ?, status = ?, stars = ?,
              finished_at = IF(? = 'playing', NULL, NOW())
        WHERE id = ?`,
      [guessNo, status, stars, status, id]
    );

    if (status === "won") {
      await conn.query(
        `INSERT INTO cb_progress (player_id, level, best_stars, times_won)
         VALUES (?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE
           best_stars = GREATEST(best_stars, VALUES(best_stars)),
           times_won  = times_won + 1`,
        [g.player_id, g.level, stars]
      );
    }

    const totalStars = await getTotalStars(conn, g.player_id);
    await conn.commit();

    if (status === "won" || status === "lost") {
      try {
        await logActivity({
          game: "code-breaker",
          type: status === "won" ? "game_win" : "game_lose",
          value: stars,
          activityKey: `code-breaker:${id}`,
          detail:
            status === "won"
              ? `Completed Level ${g.level} with ${stars} star${stars === 1 ? "" : "s"}`
              : `Tried Level ${g.level}`,
        });
      } catch (activityError) {
        console.error("Code Breaker activity log failed:", activityError);
      }
    }

    const response = {
      gameId: id,
      guessNo,
      guess,
      feedback: { exact, misplaced },
      guessesUsed: guessNo,
      guessesLeft: cfg.maxGuesses - guessNo,
      possibleCodes,
      status,
      stars,
      totalStars,
    };
    if (status !== "playing") response.secretCode = secret; // reveal only when the round is over

    res.json(response);
  } catch (err) {
    if (conn) await conn.rollback().catch(() => {});
    console.error("submitGuess error:", err);
    res.status(500).json({ error: "Could not check your guess" });
  } finally {
    if (conn) conn.release();
  }
};

/* ---------------------------------------------------------------
   GET /games/:id   (resume a game after reload)
--------------------------------------------------------------- */
exports.getGame = async (req, res) => {
  try {
    const [games] = await db.query("SELECT * FROM cb_games WHERE id = ?", [req.params.id]);
    if (games.length === 0) return res.status(404).json({ error: "Game not found" });

    const g = games[0];
    const cfg = rowToCfg(g);

    const [rows] = await db.query(
      "SELECT guess_no, guess_code, exact_count, misplaced_count, possible_left FROM cb_guesses WHERE game_id = ? ORDER BY guess_no",
      [g.id]
    );
    const history = rows.map((r) => ({
      guessNo: r.guess_no,
      guess: toCode(r.guess_code),
      feedback: { exact: r.exact_count, misplaced: r.misplaced_count },
    }));

    const possibleCodes = rows.length
      ? rows[rows.length - 1].possible_left
      : countPossible(cfg, []);

    const body = {
      gameId: g.id,
      level: g.level,
      ...cfg,
      guessesUsed: g.guesses_used,
      guessesLeft: cfg.maxGuesses - g.guesses_used,
      possibleCodes,
      status: g.status,
      stars: g.stars,
      history,
    };
    if (g.status !== "playing") body.secretCode = toCode(g.secret_code);

    res.json(body);
  } catch (err) {
    console.error("getGame error:", err);
    res.status(500).json({ error: "Could not load the game" });
  }
};

/* ---------------------------------------------------------------
   GET /games/progress/:playerId   (Level Map + total stars)
--------------------------------------------------------------- */
exports.getProgress = async (req, res) => {
  try {
    const playerId = String(req.params.playerId || "guest").slice(0, 64);
    const { best, allCompleted, currentLevel } = await loadProgress(db, playerId);

    const levels = LEVELS.map((l) => {
      const bestStars = best[l.level] || 0;
      return {
        level: l.level,
        slots: l.slots,
        colors: l.colors,
        maxGuesses: l.maxGuesses,
        bestStars,
        completed: bestStars > 0,
        // Only the current level is playable. After ALL levels are won, everything opens again.
        unlocked: allCompleted || l.level === currentLevel,
      };
    });

    res.json({
      playerId,
      totalStars: levels.reduce((sum, l) => sum + l.bestStars, 0),
      currentLevel,
      allCompleted,
      levels,
    });
  } catch (err) {
    console.error("getProgress error:", err);
    res.status(500).json({ error: "Could not load progress" });
  }
};