
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