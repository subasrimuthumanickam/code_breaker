// // // // // // // // backend/src/routes/playerRoutes.js
// // // // // // // // Player profile: name, XP / level, badge definitions and recent activity.
// // // // // // // // Everything is stored in MySQL; the frontend only sends requests and renders JSON.
// // // // // // // //
// // // // // // // // Mount it next to the other routes (same place you mount SettingsRoutes):
// // // // // // // //   app.use("/api", require("./routes/playerRoutes"));

// // // // // // // const express = require("express");
// // // // // // // const pool = require("../db");

// // // // // // // const router = express.Router();

// // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // /* Rules (server side, so the app can't fake XP)                       */
// // // // // // // /* ------------------------------------------------------------------ */

// // // // // // // const XP_PER_LEVEL = 300;
// // // // // // // const NAME_MAX = 30;

// // // // // // // const GAMES = {
// // // // // // //   "code-breaker": "Code Breaker",
// // // // // // //   "word-scramble": "Word Scramble",
// // // // // // // };

// // // // // // // const ACTIVITY_TYPES = {
// // // // // // //   game_win: { xp: 30, detail: () => "Completed a game" },
// // // // // // //   game_lose: { xp: 10, detail: () => "Played a game" },
// // // // // // //   high_score: { xp: 50, detail: (v) => `Scored ${v} points` },
// // // // // // //   room_joined: { xp: 5, detail: () => "Joined a room" },
// // // // // // //   room_created: { xp: 5, detail: () => "Created a room" },
// // // // // // // };

// // // // // // // // Badge definitions. `metric` is a field of GET /api/stats; the app marks a
// // // // // // // // badge as earned when stats[metric] >= target.
// // // // // // // const BADGES = [
// // // // // // //   { id: "first-win", title: "First Win", description: "Win 1 game", icon: "star", color: "#F5A623", metric: "gamesWon", target: 1 },
// // // // // // //   { id: "sharp-mind", title: "Sharp Mind", description: "Play 10 games", icon: "brain", color: "#3B82F6", metric: "gamesPlayed", target: 10 },
// // // // // // //   { id: "streaker", title: "Streaker", description: "Win 3 in a row", icon: "fire", color: "#10B981", metric: "bestStreak", target: 3 },
// // // // // // //   { id: "top-player", title: "Top Player", description: "High score 500+", icon: "crown", color: "#A855F7", metric: "highScore", target: 500 },
// // // // // // // ];

// // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // /* Tables (created on first request)                                   */
// // // // // // // /* ------------------------------------------------------------------ */

// // // // // // // let ready = null;

// // // // // // // function ensureTables() {
// // // // // // //   if (!ready) {
// // // // // // //     ready = (async () => {
// // // // // // //       await pool.query(`
// // // // // // //         CREATE TABLE IF NOT EXISTS player (
// // // // // // //           id INT PRIMARY KEY,
// // // // // // //           name VARCHAR(${NAME_MAX}) NOT NULL DEFAULT 'Player',
// // // // // // //           xp INT NOT NULL DEFAULT 0,
// // // // // // //           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
// // // // // // //         )
// // // // // // //       `);
// // // // // // //       await pool.query(`
// // // // // // //         CREATE TABLE IF NOT EXISTS player_activity (
// // // // // // //           id INT AUTO_INCREMENT PRIMARY KEY,
// // // // // // //           player_id INT NOT NULL,
// // // // // // //           game VARCHAR(30) NOT NULL,
// // // // // // //           type VARCHAR(30) NOT NULL,
// // // // // // //           title VARCHAR(80) NOT NULL,
// // // // // // //           detail VARCHAR(160) NOT NULL,
// // // // // // //           xp_awarded INT NOT NULL DEFAULT 0,
// // // // // // //           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
// // // // // // //           INDEX idx_player_created (player_id, id)
// // // // // // //         )
// // // // // // //       `);
// // // // // // //       await pool.query("INSERT IGNORE INTO player (id, name) VALUES (1, 'Player')");
// // // // // // //     })().catch((err) => {
// // // // // // //       ready = null; // allow a retry on the next request
// // // // // // //       throw err;
// // // // // // //     });
// // // // // // //   }
// // // // // // //   return ready;
// // // // // // // }

// // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // /* Helpers                                                             */
// // // // // // // /* ------------------------------------------------------------------ */

// // // // // // // async function loadProfile() {
// // // // // // //   const [[player]] = await pool.query("SELECT * FROM player WHERE id = 1");
// // // // // // //   const [activity] = await pool.query(
// // // // // // //     `SELECT id, game, type, title, detail, created_at
// // // // // // //        FROM player_activity
// // // // // // //       WHERE player_id = 1
// // // // // // //       ORDER BY id DESC
// // // // // // //       LIMIT 5`
// // // // // // //   );

// // // // // // //   const totalXp = Number(player.xp) || 0;

// // // // // // //   return {
// // // // // // //     name: player.name,
// // // // // // //     joinedAt: new Date(player.created_at).toISOString(),
// // // // // // //     level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
// // // // // // //     xp: totalXp % XP_PER_LEVEL,
// // // // // // //     xpForNext: XP_PER_LEVEL,
// // // // // // //     totalXp,
// // // // // // //     badges: BADGES,
// // // // // // //     recentActivity: activity.map((a) => ({
// // // // // // //       id: a.id,
// // // // // // //       game: a.game,
// // // // // // //       type: a.type,
// // // // // // //       title: a.title,
// // // // // // //       detail: a.detail,
// // // // // // //       createdAt: new Date(a.created_at).toISOString(),
// // // // // // //     })),
// // // // // // //   };
// // // // // // // }

// // // // // // // /* ------------------------------------------------------------------ */
// // // // // // // /* Routes                                                              */
// // // // // // // /* ------------------------------------------------------------------ */

// // // // // // // // GET /api/player
// // // // // // // router.get("/player", async (req, res, next) => {
// // // // // // //   try {
// // // // // // //     await ensureTables();
// // // // // // //     res.json(await loadProfile());
// // // // // // //   } catch (err) {
// // // // // // //     next(err);
// // // // // // //   }
// // // // // // // });

// // // // // // // // PUT /api/player  { name }
// // // // // // // router.put("/player", async (req, res, next) => {
// // // // // // //   try {
// // // // // // //     await ensureTables();
// // // // // // //     const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";

// // // // // // //     if (name.length < 1 || name.length > NAME_MAX) {
// // // // // // //       return res.status(400).json({ error: `Name must be 1-${NAME_MAX} characters.` });
// // // // // // //     }

// // // // // // //     await pool.query("UPDATE player SET name = ? WHERE id = 1", [name]);
// // // // // // //     res.json(await loadProfile());
// // // // // // //   } catch (err) {
// // // // // // //     next(err);
// // // // // // //   }
// // // // // // // });

// // // // // // // // POST /api/player/activity  { game, type, value? }
// // // // // // // router.post("/player/activity", async (req, res, next) => {
// // // // // // //   try {
// // // // // // //     await ensureTables();
// // // // // // //     const { game, type, value } = req.body || {};

// // // // // // //     if (!GAMES[game]) return res.status(400).json({ error: "Unknown game." });
// // // // // // //     const rule = ACTIVITY_TYPES[type];
// // // // // // //     if (!rule) return res.status(400).json({ error: "Unknown activity type." });

// // // // // // //     const num = Number(value);
// // // // // // //     const safeValue = Number.isFinite(num) ? Math.max(0, Math.round(num)) : 0;

// // // // // // //     await pool.query(
// // // // // // //       `INSERT INTO player_activity (player_id, game, type, title, detail, xp_awarded)
// // // // // // //        VALUES (1, ?, ?, ?, ?, ?)`,
// // // // // // //       [game, type, GAMES[game], rule.detail(safeValue), rule.xp]
// // // // // // //     );
// // // // // // //     await pool.query("UPDATE player SET xp = xp + ? WHERE id = 1", [rule.xp]);

// // // // // // //     res.status(201).json(await loadProfile());
// // // // // // //   } catch (err) {
// // // // // // //     next(err);
// // // // // // //   }
// // // // // // // });

// // // // // // // module.exports = router;
// // // // // // // backend/src/routes/playerRoutes.js
// // // // // // // Player profile: name, XP / level, stats, badges and recent activity.
// // // // // // // Everything is stored in MySQL; the frontend only sends requests and renders JSON.
// // // // // // //
// // // // // // // Mount it next to the other routes (same place you mount SettingsRoutes):
// // // // // // //   app.use("/api", require("./routes/playerRoutes"));

// // // // // // const express = require("express");
// // // // // // const {
// // // // // //   pool,
// // // // // //   XP_PER_LEVEL,
// // // // // //   NAME_MAX,
// // // // // //   GAMES,
// // // // // //   ACTIVITY_TYPES,
// // // // // //   BADGES,
// // // // // //   ensureTables,
// // // // // //   logActivity,
// // // // // //   getPlayerStats,
// // // // // // } = require("../utils/playerActivity");

// // // // // // const router = express.Router();

// // // // // // /* ------------------------------------------------------------------ */
// // // // // // /* Helpers                                                             */
// // // // // // /* ------------------------------------------------------------------ */

// // // // // // async function loadProfile() {
// // // // // //   const [[player]] = await pool.query("SELECT * FROM player WHERE id = 1");
// // // // // //   const [activity] = await pool.query(
// // // // // //     `SELECT id, game, type, title, detail, created_at
// // // // // //        FROM player_activity
// // // // // //       WHERE player_id = 1
// // // // // //       ORDER BY id DESC
// // // // // //       LIMIT 5`
// // // // // //   );

// // // // // //   const stats = await getPlayerStats();
// // // // // //   const totalXp = Number(player.xp) || 0;

// // // // // //   return {
// // // // // //     name: player.name,
// // // // // //     joinedAt: new Date(player.created_at).toISOString(),
// // // // // //     level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
// // // // // //     xp: totalXp % XP_PER_LEVEL,
// // // // // //     xpForNext: XP_PER_LEVEL,
// // // // // //     totalXp,
// // // // // //     stats,
// // // // // //     badges: BADGES.map((b) => {
// // // // // //       const value = Number(stats[b.metric]) || 0;
// // // // // //       return {
// // // // // //         ...b,
// // // // // //         progress: Math.min(value, b.target),
// // // // // //         unlocked: value >= b.target,
// // // // // //       };
// // // // // //     }),
// // // // // //     recentActivity: activity.map((a) => ({
// // // // // //       id: a.id,
// // // // // //       game: a.game,
// // // // // //       type: a.type,
// // // // // //       title: a.title,
// // // // // //       detail: a.detail,
// // // // // //       createdAt: new Date(a.created_at).toISOString(),
// // // // // //     })),
// // // // // //   };
// // // // // // }

// // // // // // /* ------------------------------------------------------------------ */
// // // // // // /* Routes                                                              */
// // // // // // /* ------------------------------------------------------------------ */

// // // // // // // GET /api/player
// // // // // // router.get("/player", async (req, res, next) => {
// // // // // //   try {
// // // // // //     await ensureTables();
// // // // // //     res.json(await loadProfile());
// // // // // //   } catch (err) {
// // // // // //     next(err);
// // // // // //   }
// // // // // // });

// // // // // // // PUT /api/player  { name }
// // // // // // router.put("/player", async (req, res, next) => {
// // // // // //   try {
// // // // // //     await ensureTables();
// // // // // //     const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";

// // // // // //     if (name.length < 1 || name.length > NAME_MAX) {
// // // // // //       return res.status(400).json({ error: `Name must be 1-${NAME_MAX} characters.` });
// // // // // //     }

// // // // // //     await pool.query("UPDATE player SET name = ? WHERE id = 1", [name]);
// // // // // //     res.json(await loadProfile());
// // // // // //   } catch (err) {
// // // // // //     next(err);
// // // // // //   }
// // // // // // });

// // // // // // // POST /api/player/activity  { game, type, value? }
// // // // // // // (Other games, e.g. Word Scramble, can use this to log their results too.)
// // // // // // router.post("/player/activity", async (req, res, next) => {
// // // // // //   try {
// // // // // //     await ensureTables();
// // // // // //     const { game, type, value } = req.body || {};

// // // // // //     if (!GAMES[game]) return res.status(400).json({ error: "Unknown game." });
// // // // // //     if (!ACTIVITY_TYPES[type]) return res.status(400).json({ error: "Unknown activity type." });

// // // // // //     await logActivity({ game, type, value });
// // // // // //     res.status(201).json(await loadProfile());
// // // // // //   } catch (err) {
// // // // // //     next(err);
// // // // // //   }
// // // // // // });

// // // // // // module.exports = router;
// // // // // const express = require("express");

// // // // // const {
// // // // //   pool,
// // // // //   XP_PER_LEVEL,
// // // // //   NAME_MAX,
// // // // //   GAMES,
// // // // //   ACTIVITY_TYPES,
// // // // //   ensureTables,
// // // // //   logActivity,
// // // // //   getPlayerStats,
// // // // //   getPlayerProfile,
// // // // // } = require("../utils/playerActivity");

// // // // // const router = express.Router();

// // // // // /* ------------------------------------------------------------------ */
// // // // // /* Helpers                                                             */
// // // // // /* ------------------------------------------------------------------ */

// // // // // /*
// // // // //   Default player is currently player ID 1.

// // // // //   This keeps your existing application working.

// // // // //   Later, when login/auth is fully connected,
// // // // //   you can replace this with req.user.id.
// // // // // */

// // // // // function getPlayerId(req) {
// // // // //   const requestedId =
// // // // //     req.params?.playerId ||
// // // // //     req.body?.playerId;

// // // // //   const playerId =
// // // // //     Number(requestedId);

// // // // //   if (
// // // // //     Number.isInteger(playerId) &&
// // // // //     playerId > 0
// // // // //   ) {
// // // // //     return playerId;
// // // // //   }

// // // // //   return 1;
// // // // // }

// // // // // /* ------------------------------------------------------------------ */
// // // // // /* GET PROFILE - DEFAULT PLAYER                                       */
// // // // // /* ------------------------------------------------------------------ */

// // // // // /*
// // // // //   GET /api/player

// // // // //   Existing API.

// // // // //   Returns:
// // // // //   player
// // // // //   level
// // // // //   xp
// // // // //   stats
// // // // //   badges
// // // // //   recentActivity
// // // // // */

// // // // // router.get(
// // // // //   "/player",
// // // // //   async (req, res, next) => {
// // // // //     try {
// // // // //       await ensureTables();

// // // // //       const playerId =
// // // // //         getPlayerId(req);

// // // // //       const profile =
// // // // //         await getPlayerProfile(
// // // // //           playerId
// // // // //         );

// // // // //       return res.json({
// // // // //         success: true,
// // // // //         data: profile,
// // // // //       });
// // // // //     } catch (err) {
// // // // //       next(err);
// // // // //     }
// // // // //   }
// // // // // );

// // // // // /* ------------------------------------------------------------------ */
// // // // // /* GET PROFILE - PLAYER ID                                            */
// // // // // /* ------------------------------------------------------------------ */

// // // // // /*
// // // // //   GET /api/player/:playerId/profile

// // // // //   Example:

// // // // //   GET
// // // // //   http://localhost:4000/api/player/1/profile
// // // // // */

// // // // // router.get(
// // // // //   "/player/:playerId/profile",
// // // // //   async (req, res, next) => {
// // // // //     try {
// // // // //       await ensureTables();

// // // // //       const playerId =
// // // // //         Number(
// // // // //           req.params.playerId
// // // // //         );

// // // // //       /* ------------------------------------------------------------ */
// // // // //       /* Validate player ID                                           */
// // // // //       /* ------------------------------------------------------------ */

// // // // //       if (
// // // // //         !Number.isInteger(playerId) ||
// // // // //         playerId <= 0
// // // // //       ) {
// // // // //         return res.status(400).json({
// // // // //           success: false,
// // // // //           message:
// // // // //             "Invalid player ID",
// // // // //         });
// // // // //       }

// // // // //       /* ------------------------------------------------------------ */
// // // // //       /* Get profile                                                   */
// // // // //       /* ------------------------------------------------------------ */

// // // // //       const profile =
// // // // //         await getPlayerProfile(
// // // // //           playerId
// // // // //         );

// // // // //       /* ------------------------------------------------------------ */
// // // // //       /* JSON response                                                 */
// // // // //       /* ------------------------------------------------------------ */

// // // // //       return res.json({
// // // // //         success: true,

// // // // //         data: profile,
// // // // //       });
// // // // //     } catch (err) {
// // // // //       console.error(
// // // // //         "Profile fetch error:",
// // // // //         err
// // // // //       );

// // // // //       next(err);
// // // // //     }
// // // // //   }
// // // // // );

// // // // // /* ------------------------------------------------------------------ */
// // // // // /* UPDATE PLAYER NAME                                                 */
// // // // // /* ------------------------------------------------------------------ */

// // // // // /*
// // // // //   PUT /api/player

// // // // //   Body:

// // // // //   {
// // // // //     "name": "Suba"
// // // // //   }
// // // // // */

// // // // // router.put(
// // // // //   "/player",
// // // // //   async (req, res, next) => {
// // // // //     try {
// // // // //       await ensureTables();

// // // // //       const playerId =
// // // // //         getPlayerId(req);

// // // // //       const name =
// // // // //         typeof req.body?.name ===
// // // // //         "string"
// // // // //           ? req.body.name.trim()
// // // // //           : "";

// // // // //       /* ------------------------------------------------------------ */
// // // // //       /* Validate name                                                 */
// // // // //       /* ------------------------------------------------------------ */

// // // // //       if (
// // // // //         name.length < 1 ||
// // // // //         name.length > NAME_MAX
// // // // //       ) {
// // // // //         return res.status(400).json({
// // // // //           success: false,

// // // // //           error:
// // // // //             `Name must be 1-${NAME_MAX} characters.`,
// // // // //         });
// // // // //       }

// // // // //       /* ------------------------------------------------------------ */
// // // // //       /* Update                                                        */
// // // // //       /* ------------------------------------------------------------ */

// // // // //       await pool.query(
// // // // //         `
// // // // //         UPDATE player
// // // // //         SET name = ?
// // // // //         WHERE id = ?
// // // // //         `,
// // // // //         [
// // // // //           name,
// // // // //           playerId,
// // // // //         ]
// // // // //       );

// // // // //       /* ------------------------------------------------------------ */
// // // // //       /* Return updated profile                                       */
// // // // //       /* ------------------------------------------------------------ */

// // // // //       const profile =
// // // // //         await getPlayerProfile(
// // // // //           playerId
// // // // //         );

// // // // //       return res.json({
// // // // //         success: true,

// // // // //         data: profile,
// // // // //       });
// // // // //     } catch (err) {
// // // // //       next(err);
// // // // //     }
// // // // //   }
// // // // // );

// // // // // /* ------------------------------------------------------------------ */
// // // // // /* POST ACTIVITY                                                      */
// // // // // /* ------------------------------------------------------------------ */

// // // // // /*
// // // // //   POST /api/player/activity

// // // // //   Body:

// // // // //   {
// // // // //     "playerId": 1,
// // // // //     "game": "code-breaker",
// // // // //     "type": "game_win",
// // // // //     "value": 120
// // // // //   }

// // // // //   OR

// // // // //   {
// // // // //     "playerId": 1,
// // // // //     "game": "code-breaker",
// // // // //     "type": "game_lose",
// // // // //     "value": 50
// // // // //   }
// // // // // */

// // // // // router.post(
// // // // //   "/player/activity",
// // // // //   async (req, res, next) => {
// // // // //     try {
// // // // //       await ensureTables();

// // // // //       const {
// // // // //         game,
// // // // //         type,
// // // // //         value,
// // // // //         playerId,
// // // // //         detail,
// // // // //       } = req.body || {};

// // // // //       /* ---------------------------------------------------------- */
// // // // //       /* Player ID                                                   */
// // // // //       /* ---------------------------------------------------------- */

// // // // //       const numericPlayerId =
// // // // //         Number(playerId) || 1;

// // // // //       /* ---------------------------------------------------------- */
// // // // //       /* Validate game                                               */
// // // // //       /* ---------------------------------------------------------- */

// // // // //       if (!GAMES[game]) {
// // // // //         return res.status(400).json({
// // // // //           success: false,

// // // // //           error:
// // // // //             "Unknown game.",
// // // // //         });
// // // // //       }

// // // // //       /* ---------------------------------------------------------- */
// // // // //       /* Validate activity type                                     */
// // // // //       /* ---------------------------------------------------------- */

// // // // //       if (!ACTIVITY_TYPES[type]) {
// // // // //         return res.status(400).json({
// // // // //           success: false,

// // // // //           error:
// // // // //             "Unknown activity type.",
// // // // //         });
// // // // //       }

// // // // //       /* ---------------------------------------------------------- */
// // // // //       /* Save activity                                               */
// // // // //       /* ---------------------------------------------------------- */

// // // // //       await logActivity({
// // // // //         playerId:
// // // // //           numericPlayerId,

// // // // //         game,

// // // // //         type,

// // // // //         value,

// // // // //         detail,
// // // // //       });

// // // // //       /* ---------------------------------------------------------- */
// // // // //       /* Get fresh profile                                           */
// // // // //       /* ---------------------------------------------------------- */

// // // // //       const profile =
// // // // //         await getPlayerProfile(
// // // // //           numericPlayerId
// // // // //         );

// // // // //       /* ---------------------------------------------------------- */
// // // // //       /* Response                                                    */
// // // // //       /* ---------------------------------------------------------- */

// // // // //       return res.status(201).json({
// // // // //         success: true,

// // // // //         message:
// // // // //           "Activity saved successfully.",

// // // // //         data: profile,
// // // // //       });
// // // // //     } catch (err) {
// // // // //       console.error(
// // // // //         "Activity save error:",
// // // // //         err
// // // // //       );

// // // // //       next(err);
// // // // //     }
// // // // //   }
// // // // // );

// // // // // /* ------------------------------------------------------------------ */
// // // // // /* GET STATS                                                          */
// // // // // /* ------------------------------------------------------------------ */

// // // // // /*
// // // // //   GET /api/player/stats

// // // // //   Useful if another screen only needs statistics.
// // // // // */

// // // // // router.get(
// // // // //   "/player/stats",
// // // // //   async (req, res, next) => {
// // // // //     try {
// // // // //       await ensureTables();

// // // // //       const playerId =
// // // // //         getPlayerId(req);

// // // // //       const stats =
// // // // //         await getPlayerStats(
// // // // //           playerId
// // // // //         );

// // // // //       return res.json({
// // // // //         success: true,

// // // // //         data: stats,
// // // // //       });
// // // // //     } catch (err) {
// // // // //       next(err);
// // // // //     }
// // // // //   }
// // // // // );

// // // // // /* ------------------------------------------------------------------ */
// // // // // /* Export                                                             */
// // // // // /* ------------------------------------------------------------------ */

// // // // // module.exports = router;
// // // // const express = require("express");

// // // // const {
// // // //   pool,
// // // //   XP_PER_LEVEL,
// // // //   NAME_MAX,
// // // //   GAMES,
// // // //   ACTIVITY_TYPES,
// // // //   ensureTables,
// // // //   logActivity,
// // // //   getPlayerStats,
// // // //   getPlayerProfile,
// // // // } = require("../utils/playerActivity");

// // // // const router = express.Router();

// // // // /* ------------------------------------------------------------------ */
// // // // /* Helpers                                                             */
// // // // /* ------------------------------------------------------------------ */

// // // // /*
// // // //   Which account is calling?
// // // //   Order: URL param -> body -> ?playerId= -> X-Player-Id header.
// // // //   If nothing is sent we still fall back to player 1 so old clients keep working.
// // // // */
// // // // function getPlayerId(req) {
// // // //   const requestedId =
// // // //     req.params?.playerId ||
// // // //     req.body?.playerId ||
// // // //     req.query?.playerId ||
// // // //     req.headers?.["x-player-id"];

// // // //   const playerId = Number(requestedId);

// // // //   if (Number.isInteger(playerId) && playerId > 0) {
// // // //     return playerId;
// // // //   }

// // // //   return 1;
// // // // }

// // // // /*
// // // //   Every account gets its OWN row in `player`.
// // // //   New accounts start with the name "Player<id>" until they edit it.
// // // // */
// // // // async function ensurePlayerRow(playerId) {
// // // //   await pool.query(
// // // //     `INSERT IGNORE INTO player (id, name, xp) VALUES (?, ?, 0)`,
// // // //     [playerId, `Player${playerId}`]
// // // //   );
// // // // }

// // // // /* ------------------------------------------------------------------ */
// // // // /* GET PROFILE - CURRENT ACCOUNT                                      */
// // // // /* ------------------------------------------------------------------ */

// // // // /*
// // // //   GET /api/player?playerId=2
// // // // */
// // // // router.get("/player", async (req, res, next) => {
// // // //   try {
// // // //     await ensureTables();

// // // //     const playerId = getPlayerId(req);
// // // //     await ensurePlayerRow(playerId);

// // // //     const profile = await getPlayerProfile(playerId);

// // // //     return res.json({
// // // //       success: true,
// // // //       data: profile,
// // // //     });
// // // //   } catch (err) {
// // // //     next(err);
// // // //   }
// // // // });

// // // // /* ------------------------------------------------------------------ */
// // // // /* GET PROFILE - PLAYER ID                                            */
// // // // /* ------------------------------------------------------------------ */

// // // // /*
// // // //   GET /api/player/:playerId/profile
// // // // */
// // // // router.get("/player/:playerId/profile", async (req, res, next) => {
// // // //   try {
// // // //     await ensureTables();

// // // //     const playerId = Number(req.params.playerId);

// // // //     if (!Number.isInteger(playerId) || playerId <= 0) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: "Invalid player ID",
// // // //       });
// // // //     }

// // // //     const profile = await getPlayerProfile(playerId);

// // // //     return res.json({
// // // //       success: true,
// // // //       data: profile,
// // // //     });
// // // //   } catch (err) {
// // // //     console.error("Profile fetch error:", err);
// // // //     next(err);
// // // //   }
// // // // });

// // // // /* ------------------------------------------------------------------ */
// // // // /* UPDATE PLAYER NAME - ONLY THE CURRENT ACCOUNT                      */
// // // // /* ------------------------------------------------------------------ */

// // // // /*
// // // //   PUT /api/player?playerId=2

// // // //   Body: { "name": "Suba", "playerId": 2 }
// // // // */
// // // // router.put("/player", async (req, res, next) => {
// // // //   try {
// // // //     await ensureTables();

// // // //     const playerId = getPlayerId(req);
// // // //     await ensurePlayerRow(playerId);

// // // //     const name =
// // // //       typeof req.body?.name === "string" ? req.body.name.trim() : "";

// // // //     if (name.length < 1 || name.length > NAME_MAX) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         error: `Name must be 1-${NAME_MAX} characters.`,
// // // //       });
// // // //     }

// // // //     await pool.query(
// // // //       `
// // // //       UPDATE player
// // // //       SET name = ?
// // // //       WHERE id = ?
// // // //       `,
// // // //       [name, playerId]
// // // //     );

// // // //     const profile = await getPlayerProfile(playerId);

// // // //     return res.json({
// // // //       success: true,
// // // //       data: profile,
// // // //     });
// // // //   } catch (err) {
// // // //     next(err);
// // // //   }
// // // // });

// // // // /* ------------------------------------------------------------------ */
// // // // /* POST ACTIVITY                                                      */
// // // // /* ------------------------------------------------------------------ */

// // // // /*
// // // //   POST /api/player/activity

// // // //   Body:
// // // //   { "playerId": 2, "game": "code-breaker", "type": "game_win", "value": 120 }
// // // // */
// // // // router.post("/player/activity", async (req, res, next) => {
// // // //   try {
// // // //     await ensureTables();

// // // //     const { game, type, value, detail } = req.body || {};

// // // //     const numericPlayerId = getPlayerId(req);
// // // //     await ensurePlayerRow(numericPlayerId);

// // // //     if (!GAMES[game]) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         error: "Unknown game.",
// // // //       });
// // // //     }

// // // //     if (!ACTIVITY_TYPES[type]) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         error: "Unknown activity type.",
// // // //       });
// // // //     }

// // // //     await logActivity({
// // // //       playerId: numericPlayerId,
// // // //       game,
// // // //       type,
// // // //       value,
// // // //       detail,
// // // //     });

// // // //     const profile = await getPlayerProfile(numericPlayerId);

// // // //     return res.status(201).json({
// // // //       success: true,
// // // //       message: "Activity saved successfully.",
// // // //       data: profile,
// // // //     });
// // // //   } catch (err) {
// // // //     console.error("Activity save error:", err);
// // // //     next(err);
// // // //   }
// // // // });

// // // // /* ------------------------------------------------------------------ */
// // // // /* GET STATS                                                          */
// // // // /* ------------------------------------------------------------------ */

// // // // /*
// // // //   GET /api/player/stats?playerId=2
// // // // */
// // // // router.get("/player/stats", async (req, res, next) => {
// // // //   try {
// // // //     await ensureTables();

// // // //     const playerId = getPlayerId(req);
// // // //     await ensurePlayerRow(playerId);

// // // //     const stats = await getPlayerStats(playerId);

// // // //     return res.json({
// // // //       success: true,
// // // //       data: stats,
// // // //     });
// // // //   } catch (err) {
// // // //     next(err);
// // // //   }
// // // // });

// // // // /* ------------------------------------------------------------------ */
// // // // /* Export                                                             */
// // // // /* ------------------------------------------------------------------ */

// // // // module.exports = router;
// // // const express = require("express");

// // // const {
// // //   pool,
// // //   NAME_MAX,
// // //   GAMES,
// // //   ACTIVITY_TYPES,
// // //   ensureTables,
// // //   logActivity,
// // //   getPlayerStats,
// // //   getPlayerProfile,
// // // } = require("../utils/playerActivity");

// // // const router = express.Router();

// // // /* ------------------------------------------------------------------ */
// // // /* Helpers                                                             */
// // // /* ------------------------------------------------------------------ */

// // // /*
// // //   Which account is calling?
// // //   Order: URL param -> body -> ?playerId= -> X-Player-Id header.

// // //   IMPORTANT: there is NO fallback to player 1 anymore.
// // //   If the id is missing/invalid we return null and the request is rejected.
// // //   (The old fallback to 1 was why every account showed the same name.)
// // // */
// // // function getPlayerId(req) {
// // //   const requestedId =
// // //     req.params?.playerId ||
// // //     req.body?.playerId ||
// // //     req.query?.playerId ||
// // //     req.headers?.["x-player-id"];

// // //   const playerId = Number(requestedId);

// // //   if (Number.isInteger(playerId) && playerId > 0) {
// // //     return playerId;
// // //   }

// // //   return null;
// // // }

// // // /*
// // //   Reads the player id, makes sure that account really exists in the DB.
// // //   Returns the id, or sends an error response and returns null.
// // //   Accounts are created ONLY by /api/auth/register, never here.
// // // */
// // // async function requirePlayer(req, res) {
// // //   const playerId = getPlayerId(req);

// // //   if (!playerId) {
// // //     res.status(401).json({
// // //       success: false,
// // //       error: "Not logged in. playerId is missing.",
// // //     });
// // //     return null;
// // //   }

// // //   const [rows] = await pool.query(`SELECT id FROM player WHERE id = ?`, [
// // //     playerId,
// // //   ]);

// // //   if (rows.length === 0) {
// // //     res.status(404).json({
// // //       success: false,
// // //       error: "Player account not found.",
// // //     });
// // //     return null;
// // //   }

// // //   return playerId;
// // // }

// // // /* ------------------------------------------------------------------ */
// // // /* GET PROFILE - CURRENT ACCOUNT                                      */
// // // /* ------------------------------------------------------------------ */

// // // /*
// // //   GET /api/player?playerId=2
// // // */
// // // router.get("/player", async (req, res, next) => {
// // //   try {
// // //     await ensureTables();

// // //     const playerId = await requirePlayer(req, res);
// // //     if (!playerId) return;

// // //     const profile = await getPlayerProfile(playerId);

// // //     return res.json({
// // //       success: true,
// // //       data: profile,
// // //     });
// // //   } catch (err) {
// // //     next(err);
// // //   }
// // // });

// // // /* ------------------------------------------------------------------ */
// // // /* GET PROFILE - PLAYER ID                                            */
// // // /* ------------------------------------------------------------------ */

// // // /*
// // //   GET /api/player/:playerId/profile
// // // */
// // // router.get("/player/:playerId/profile", async (req, res, next) => {
// // //   try {
// // //     await ensureTables();

// // //     const playerId = await requirePlayer(req, res);
// // //     if (!playerId) return;

// // //     const profile = await getPlayerProfile(playerId);

// // //     return res.json({
// // //       success: true,
// // //       data: profile,
// // //     });
// // //   } catch (err) {
// // //     console.error("Profile fetch error:", err);
// // //     next(err);
// // //   }
// // // });

// // // /* ------------------------------------------------------------------ */
// // // /* UPDATE PLAYER NAME - ONLY THE CURRENT ACCOUNT                      */
// // // /* ------------------------------------------------------------------ */

// // // /*
// // //   PUT /api/player?playerId=2
// // //   Body: { "name": "Suba", "playerId": 2 }
// // // */
// // // router.put("/player", async (req, res, next) => {
// // //   try {
// // //     await ensureTables();

// // //     const playerId = await requirePlayer(req, res);
// // //     if (!playerId) return;

// // //     const name =
// // //       typeof req.body?.name === "string" ? req.body.name.trim() : "";

// // //     if (name.length < 1 || name.length > NAME_MAX) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: `Name must be 1-${NAME_MAX} characters.`,
// // //       });
// // //     }

// // //     await pool.query(`UPDATE player SET name = ? WHERE id = ?`, [
// // //       name,
// // //       playerId,
// // //     ]);

// // //     const profile = await getPlayerProfile(playerId);

// // //     return res.json({
// // //       success: true,
// // //       data: profile,
// // //     });
// // //   } catch (err) {
// // //     next(err);
// // //   }
// // // });

// // // /* ------------------------------------------------------------------ */
// // // /* POST ACTIVITY                                                      */
// // // /* ------------------------------------------------------------------ */

// // // /*
// // //   POST /api/player/activity
// // //   Body: { "playerId": 2, "game": "code-breaker", "type": "game_win", "value": 120 }
// // // */
// // // router.post("/player/activity", async (req, res, next) => {
// // //   try {
// // //     await ensureTables();

// // //     const playerId = await requirePlayer(req, res);
// // //     if (!playerId) return;

// // //     const { game, type, value, detail } = req.body || {};

// // //     if (!GAMES[game]) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: "Unknown game.",
// // //       });
// // //     }

// // //     if (!ACTIVITY_TYPES[type]) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: "Unknown activity type.",
// // //       });
// // //     }

// // //     await logActivity({
// // //       playerId,
// // //       game,
// // //       type,
// // //       value,
// // //       detail,
// // //     });

// // //     const profile = await getPlayerProfile(playerId);

// // //     return res.status(201).json({
// // //       success: true,
// // //       message: "Activity saved successfully.",
// // //       data: profile,
// // //     });
// // //   } catch (err) {
// // //     console.error("Activity save error:", err);
// // //     next(err);
// // //   }
// // // });

// // // /* ------------------------------------------------------------------ */
// // // /* GET STATS                                                          */
// // // /* ------------------------------------------------------------------ */

// // // /*
// // //   GET /api/player/stats?playerId=2
// // // */
// // // router.get("/player/stats", async (req, res, next) => {
// // //   try {
// // //     await ensureTables();

// // //     const playerId = await requirePlayer(req, res);
// // //     if (!playerId) return;

// // //     const stats = await getPlayerStats(playerId);

// // //     return res.json({
// // //       success: true,
// // //       data: stats,
// // //     });
// // //   } catch (err) {
// // //     next(err);
// // //   }
// // // });

// // // /* ------------------------------------------------------------------ */
// // // /* Export                                                             */
// // // /* ------------------------------------------------------------------ */

// // // module.exports = router;
// // const express = require("express");

// // const {
// //   pool,
// //   NAME_MAX,
// //   GAMES,
// //   ACTIVITY_TYPES,
// //   ensureTables,
// //   logActivity,
// //   getPlayerStats,
// //   getPlayerProfile,
// // } = require("../utils/playerActivity");

// // const router = express.Router();

// // /* ------------------------------------------------------------------ */
// // /* Helpers                                                             */
// // /* ------------------------------------------------------------------ */

// // /*
// //   Which account is calling?
// //   Order: URL param -> body -> ?playerId= -> X-Player-Id header.

// //   IMPORTANT: there is NO fallback to player 1 anymore.
// //   If the id is missing/invalid we return null and the request is rejected.
// //   (The old fallback to 1 was why every account showed the same name.)
// // */
// // function getPlayerId(req) {
// //   const requestedId =
// //     req.params?.playerId ||
// //     req.body?.playerId ||
// //     req.query?.playerId ||
// //     req.headers?.["x-player-id"];

// //   const playerId = Number(requestedId);

// //   if (Number.isInteger(playerId) && playerId > 0) {
// //     return playerId;
// //   }

// //   return null;
// // }

// // /*
// //   Reads the player id, makes sure that account really exists in the DB.
// //   Returns the id, or sends an error response and returns null.
// //   Accounts are created ONLY by /api/auth/register, never here.
// // */
// // async function requirePlayer(req, res) {
// //   const playerId = getPlayerId(req);

// //   if (!playerId) {
// //     res.status(401).json({
// //       success: false,
// //       error: "Not logged in. playerId is missing.",
// //     });
// //     return null;
// //   }

// //   const [rows] = await pool.query(`SELECT id FROM player WHERE id = ?`, [
// //     playerId,
// //   ]);

// //   if (rows.length === 0) {
// //     res.status(404).json({
// //       success: false,
// //       error: "Player account not found.",
// //     });
// //     return null;
// //   }

// //   return playerId;
// // }

// // /* ------------------------------------------------------------------ */
// // /* GET PROFILE - CURRENT ACCOUNT                                      */
// // /* ------------------------------------------------------------------ */

// // /*
// //   GET /api/player?playerId=2
// // */
// // router.get("/player", async (req, res, next) => {
// //   try {
// //     await ensureTables();

// //     const playerId = await requirePlayer(req, res);
// //     if (!playerId) return;

// //     const profile = await getPlayerProfile(playerId);

// //     return res.json({
// //       success: true,
// //       data: profile,
// //     });
// //   } catch (err) {
// //     next(err);
// //   }
// // });

// // /* ------------------------------------------------------------------ */
// // /* GET PROFILE - PLAYER ID                                            */
// // /* ------------------------------------------------------------------ */

// // /*
// //   GET /api/player/:playerId/profile
// // */
// // router.get("/player/:playerId/profile", async (req, res, next) => {
// //   try {
// //     await ensureTables();

// //     const playerId = await requirePlayer(req, res);
// //     if (!playerId) return;

// //     const profile = await getPlayerProfile(playerId);

// //     return res.json({
// //       success: true,
// //       data: profile,
// //     });
// //   } catch (err) {
// //     console.error("Profile fetch error:", err);
// //     next(err);
// //   }
// // });

// // /* ------------------------------------------------------------------ */
// // /* UPDATE PLAYER NAME - ONLY THE CURRENT ACCOUNT                      */
// // /* ------------------------------------------------------------------ */

// // /*
// //   PUT /api/player?playerId=2
// //   Body: { "name": "Suba", "playerId": 2 }
// // */
// // router.put("/player", async (req, res, next) => {
// //   try {
// //     await ensureTables();

// //     const playerId = await requirePlayer(req, res);
// //     if (!playerId) return;

// //     const name =
// //       typeof req.body?.name === "string" ? req.body.name.trim() : "";

// //     if (name.length < 1 || name.length > NAME_MAX) {
// //       return res.status(400).json({
// //         success: false,
// //         error: `Name must be 1-${NAME_MAX} characters.`,
// //       });
// //     }

// //     await pool.query(`UPDATE player SET name = ? WHERE id = ?`, [
// //       name,
// //       playerId,
// //     ]);

// //     const profile = await getPlayerProfile(playerId);

// //     return res.json({
// //       success: true,
// //       data: profile,
// //     });
// //   } catch (err) {
// //     next(err);
// //   }
// // });

// // /* ------------------------------------------------------------------ */
// // /* POST ACTIVITY                                                      */
// // /* ------------------------------------------------------------------ */

// // /*
// //   POST /api/player/activity
// //   Body: { "playerId": 2, "game": "code-breaker", "type": "game_win", "value": 120 }
// // */
// // router.post("/player/activity", async (req, res, next) => {
// //   try {
// //     await ensureTables();

// //     const playerId = await requirePlayer(req, res);
// //     if (!playerId) return;

// //     const { game, type, value, detail } = req.body || {};

// //     if (!GAMES[game]) {
// //       return res.status(400).json({
// //         success: false,
// //         error: "Unknown game.",
// //       });
// //     }

// //     if (!ACTIVITY_TYPES[type]) {
// //       return res.status(400).json({
// //         success: false,
// //         error: "Unknown activity type.",
// //       });
// //     }

// //     await logActivity({
// //       playerId,
// //       game,
// //       type,
// //       value,
// //       detail,
// //     });

// //     const profile = await getPlayerProfile(playerId);

// //     return res.status(201).json({
// //       success: true,
// //       message: "Activity saved successfully.",
// //       data: profile,
// //     });
// //   } catch (err) {
// //     console.error("Activity save error:", err);
// //     next(err);
// //   }
// // });

// // /* ------------------------------------------------------------------ */
// // /* GET STATS                                                          */
// // /* ------------------------------------------------------------------ */

// // /*
// //   GET /api/player/stats?playerId=2
// // */
// // router.get("/player/stats", async (req, res, next) => {
// //   try {
// //     await ensureTables();

// //     const playerId = await requirePlayer(req, res);
// //     if (!playerId) return;

// //     const stats = await getPlayerStats(playerId);

// //     return res.json({
// //       success: true,
// //       data: stats,
// //     });
// //   } catch (err) {
// //     next(err);
// //   }
// // });

// // /* ------------------------------------------------------------------ */
// // /* Export                                                             */
// // /* ------------------------------------------------------------------ */

// // module.exports = router;
// const express = require("express");

// const {
//   pool,
//   NAME_MAX,
//   GAMES,
//   ACTIVITY_TYPES,
//   ensureTables,
//   logActivity,
//   getPlayerStats,
//   getPlayerProfile,
// } = require("../utils/playerActivity");

// const router = express.Router();

// /* ------------------------------------------------------------------ */
// /* Helpers                                                             */
// /* ------------------------------------------------------------------ */

// /*
//   Which account is calling?
//   Order: URL param -> body -> ?playerId= -> X-Player-Id header.

//   IMPORTANT: there is NO fallback to player 1 anymore.
//   If the id is missing/invalid we return null and the request is rejected.
//   (The old fallback to 1 was why every account showed the same name.)
// */
// function getPlayerId(req) {
//   const requestedId =
//     req.params?.playerId ||
//     req.body?.playerId ||
//     req.query?.playerId ||
//     req.headers?.["x-player-id"];

//   const playerId = Number(requestedId);

//   if (Number.isInteger(playerId) && playerId > 0) {
//     return playerId;
//   }

//   return null;
// }

// /*
//   Reads the player id, makes sure that account really exists in the DB.
//   Returns the id, or sends an error response and returns null.
//   Accounts are created ONLY by /api/auth/register, never here.
// */
// async function requirePlayer(req, res) {
//   const playerId = getPlayerId(req);

//   if (!playerId) {
//     res.status(401).json({
//       success: false,
//       error: "Not logged in. playerId is missing.",
//     });
//     return null;
//   }

//   const [rows] = await pool.query(`SELECT id FROM player WHERE id = ?`, [
//     playerId,
//   ]);

//   if (rows.length === 0) {
//     res.status(404).json({
//       success: false,
//       error: "Player account not found.",
//     });
//     return null;
//   }

//   return playerId;
// }

// /* ------------------------------------------------------------------ */
// /* GET PROFILE - CURRENT ACCOUNT                                      */
// /* ------------------------------------------------------------------ */

// /*
//   GET /api/player?playerId=2
// */
// router.get("/player", async (req, res, next) => {
//   try {
//     await ensureTables();

//     const playerId = await requirePlayer(req, res);
//     if (!playerId) return;

//     const profile = await getPlayerProfile(playerId);

//     return res.json({
//       success: true,
//       data: profile,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// /* ------------------------------------------------------------------ */
// /* GET PROFILE - PLAYER ID                                            */
// /* ------------------------------------------------------------------ */

// /*
//   GET /api/player/:playerId/profile
// */
// router.get("/player/:playerId/profile", async (req, res, next) => {
//   try {
//     await ensureTables();

//     const playerId = await requirePlayer(req, res);
//     if (!playerId) return;

//     const profile = await getPlayerProfile(playerId);

//     return res.json({
//       success: true,
//       data: profile,
//     });
//   } catch (err) {
//     console.error("Profile fetch error:", err);
//     next(err);
//   }
// });

// /* ------------------------------------------------------------------ */
// /* UPDATE PLAYER NAME - ONLY THE CURRENT ACCOUNT                      */
// /* ------------------------------------------------------------------ */

// /*
//   PUT /api/player?playerId=2
//   Body: { "name": "Suba", "playerId": 2 }
// */
// router.put("/player", async (req, res, next) => {
//   try {
//     await ensureTables();

//     const playerId = await requirePlayer(req, res);
//     if (!playerId) return;

//     const name =
//       typeof req.body?.name === "string" ? req.body.name.trim() : "";

//     if (name.length < 1 || name.length > NAME_MAX) {
//       return res.status(400).json({
//         success: false,
//         error: `Name must be 1-${NAME_MAX} characters.`,
//       });
//     }

//     await pool.query(`UPDATE player SET name = ? WHERE id = ?`, [
//       name,
//       playerId,
//     ]);

//     const profile = await getPlayerProfile(playerId);

//     return res.json({
//       success: true,
//       data: profile,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// /* ------------------------------------------------------------------ */
// /* POST ACTIVITY                                                      */
// /* ------------------------------------------------------------------ */

// /*
//   POST /api/player/activity
//   Body: { "playerId": 2, "game": "code-breaker", "type": "game_win", "value": 120 }
// */
// router.post("/player/activity", async (req, res, next) => {
//   try {
//     await ensureTables();

//     const playerId = await requirePlayer(req, res);
//     if (!playerId) return;

//     const { game, type, value, detail } = req.body || {};

//     if (!GAMES[game]) {
//       return res.status(400).json({
//         success: false,
//         error: "Unknown game.",
//       });
//     }

//     if (!ACTIVITY_TYPES[type]) {
//       return res.status(400).json({
//         success: false,
//         error: "Unknown activity type.",
//       });
//     }

//     await logActivity({
//       playerId,
//       game,
//       type,
//       value,
//       detail,
//     });

//     const profile = await getPlayerProfile(playerId);

//     return res.status(201).json({
//       success: true,
//       message: "Activity saved successfully.",
//       data: profile,
//     });
//   } catch (err) {
//     console.error("Activity save error:", err);
//     next(err);
//   }
// });

// /* ------------------------------------------------------------------ */
// /* GET STATS                                                          */
// /* ------------------------------------------------------------------ */

// /*
//   GET /api/player/stats?playerId=2
// */
// router.get("/player/stats", async (req, res, next) => {
//   try {
//     await ensureTables();

//     const playerId = await requirePlayer(req, res);
//     if (!playerId) return;

//     const stats = await getPlayerStats(playerId);

//     return res.json({
//       success: true,
//       data: stats,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// /* ------------------------------------------------------------------ */
// /* Export                                                             */
// /* ------------------------------------------------------------------ */

// module.exports = router;
const express = require("express");

const {
  pool,
  NAME_MAX,
  GAMES,
  ACTIVITY_TYPES,
  ensureTables,
  logActivity,
  getPlayerStats,
  getPlayerProfile,
} = require("../utils/playerActivity");

const router = express.Router();

/* ------------------------------------------------------------------ */
/* HELPERS                                                            */
/* ------------------------------------------------------------------ */

/*
  Get logged-in player ID.

  Priority:
  1. URL parameter
  2. Request body
  3. Query parameter
  4. X-Player-Id header

  Examples:

  GET /api/player?playerId=2

  GET /api/player/2/profile

  Header:
  X-Player-Id: 2
*/
function getPlayerId(req) {
  const requestedId =
    req.params?.playerId ||
    req.body?.playerId ||
    req.query?.playerId ||
    req.headers?.["x-player-id"];

  const playerId = Number(requestedId);

  console.log("PLAYER ID CHECK:", {
    params: req.params,
    body: req.body,
    query: req.query,
    header: req.headers?.["x-player-id"],
    finalPlayerId: playerId,
  });

  if (
    Number.isInteger(playerId) &&
    playerId > 0
  ) {
    return playerId;
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* REQUIRE VALID PLAYER                                               */
/* ------------------------------------------------------------------ */

async function requirePlayer(req, res) {
  const playerId = getPlayerId(req);

  /*
    No player ID.
  */

  if (!playerId) {
    console.warn(
      "PLAYER REQUEST REJECTED: playerId missing"
    );

    res.status(401).json({
      success: false,
      error: "Not logged in. playerId is missing.",
    });

    return null;
  }

  /*
    Check whether player exists in MySQL.
  */

  const [rows] = await pool.query(
    `SELECT id, name FROM player WHERE id = ?`,
    [playerId]
  );

  console.log(
    "PLAYER DB LOOKUP:",
    rows
  );

  /*
    Player doesn't exist.
  */

  if (rows.length === 0) {
    console.warn(
      `PLAYER NOT FOUND: ${playerId}`
    );

    res.status(404).json({
      success: false,
      error: "Player account not found.",
    });

    return null;
  }

  /*
    Player exists.
  */

  console.log(
    `PLAYER VERIFIED: ${playerId}`
  );

  return playerId;
}

/* ------------------------------------------------------------------ */
/* GET PLAYER PROFILE                                                 */
/* ------------------------------------------------------------------ */

/*
  GET /api/player?playerId=2
*/
router.get(
  "/player",
  async (req, res, next) => {
    try {
      console.log(
        "\n========== GET /api/player =========="
      );

      console.log(
        "Request URL:",
        req.originalUrl
      );

      /*
        Make sure database tables exist.
      */

      await ensureTables();

      /*
        Validate player ID.
      */

      const playerId =
        await requirePlayer(req, res);

      /*
        IMPORTANT:
        requirePlayer() may already have
        sent a 401 or 404 response.

        Do NOT continue.
      */

      if (!playerId) {
        return;
      }

      /*
        Get profile from MySQL.
      */

      const profile =
        await getPlayerProfile(playerId);

      console.log(
        "PROFILE FROM DATABASE:",
        JSON.stringify(profile)
      );

      /*
        Send JSON response to frontend.
      */

      return res.status(200).json({
        success: true,
        data: profile,
      });

    } catch (err) {

      console.error(
        "GET /api/player error:",
        err
      );

      /*
        Prevent:
        ERR_HTTP_HEADERS_SENT
      */

      if (res.headersSent) {
        return;
      }

      return next(err);
    }
  }
);

/* ------------------------------------------------------------------ */
/* GET PLAYER PROFILE BY ID                                           */
/* ------------------------------------------------------------------ */

/*
  GET /api/player/:playerId/profile
*/
router.get(
  "/player/:playerId/profile",
  async (req, res, next) => {

    try {

      console.log(
        "\n========== GET PLAYER PROFILE =========="
      );

      console.log(
        "Request URL:",
        req.originalUrl
      );

      await ensureTables();

      const playerId =
        await requirePlayer(req, res);

      if (!playerId) {
        return;
      }

      const profile =
        await getPlayerProfile(playerId);

      return res.status(200).json({
        success: true,
        data: profile,
      });

    } catch (err) {

      console.error(
        "Profile fetch error:",
        err
      );

      if (res.headersSent) {
        return;
      }

      return next(err);
    }
  }
);

/* ------------------------------------------------------------------ */
/* UPDATE PLAYER NAME                                                 */
/* ------------------------------------------------------------------ */

/*
  PUT /api/player?playerId=2

  Body:

  {
    "name": "Suba"
  }
*/
router.put(
  "/player",
  async (req, res, next) => {

    try {

      console.log(
        "\n========== PUT /api/player =========="
      );

      console.log(
        "Request URL:",
        req.originalUrl
      );

      console.log(
        "Request body:",
        req.body
      );

      await ensureTables();

      const playerId =
        await requirePlayer(req, res);

      if (!playerId) {
        return;
      }

      const name =
        typeof req.body?.name === "string"
          ? req.body.name.trim()
          : "";

      if (
        name.length < 1 ||
        name.length > NAME_MAX
      ) {

        return res.status(400).json({
          success: false,
          error:
            `Name must be 1-${NAME_MAX} characters.`,
        });
      }

      /*
        Update MySQL.
      */

      await pool.query(
        `UPDATE player
         SET name = ?
         WHERE id = ?`,
        [
          name,
          playerId,
        ]
      );

      console.log(
        `PLAYER ${playerId} NAME UPDATED TO: ${name}`
      );

      /*
        Read updated profile.
      */

      const profile =
        await getPlayerProfile(playerId);

      return res.status(200).json({
        success: true,
        data: profile,
      });

    } catch (err) {

      console.error(
        "PUT /api/player error:",
        err
      );

      if (res.headersSent) {
        return;
      }

      return next(err);
    }
  }
);

/* ------------------------------------------------------------------ */
/* SAVE PLAYER ACTIVITY                                               */
/* ------------------------------------------------------------------ */

/*
  POST /api/player/activity

  Body:

  {
    "playerId": 2,
    "game": "code-breaker",
    "type": "game_win",
    "value": 120
  }
*/
router.post(
  "/player/activity",
  async (req, res, next) => {

    try {

      console.log(
        "\n========== POST /api/player/activity =========="
      );

      console.log(
        "Request body:",
        req.body
      );

      await ensureTables();

      const playerId =
        await requirePlayer(req, res);

      if (!playerId) {
        return;
      }

      const {
        game,
        type,
        value,
        detail,
      } = req.body || {};

      if (!GAMES[game]) {

        return res.status(400).json({
          success: false,
          error: "Unknown game.",
        });
      }

      if (!ACTIVITY_TYPES[type]) {

        return res.status(400).json({
          success: false,
          error: "Unknown activity type.",
        });
      }

      /*
        Save activity in MySQL.
      */

      await logActivity({
        playerId,
        game,
        type,
        value,
        detail,
      });

      console.log(
        `ACTIVITY SAVED FOR PLAYER ${playerId}`
      );

      /*
        Return updated profile.
      */

      const profile =
        await getPlayerProfile(playerId);

      return res.status(201).json({
        success: true,
        message:
          "Activity saved successfully.",
        data: profile,
      });

    } catch (err) {

      console.error(
        "Activity save error:",
        err
      );

      if (res.headersSent) {
        return;
      }

      return next(err);
    }
  }
);

/* ------------------------------------------------------------------ */
/* GET PLAYER STATS                                                   */
/* ------------------------------------------------------------------ */

/*
  GET /api/player/stats?playerId=2
*/
router.get(
  "/player/stats",
  async (req, res, next) => {

    try {

      console.log(
        "\n========== GET /api/player/stats =========="
      );

      console.log(
        "Request URL:",
        req.originalUrl
      );

      await ensureTables();

      const playerId =
        await requirePlayer(req, res);

      if (!playerId) {
        return;
      }

      const stats =
        await getPlayerStats(playerId);

      console.log(
        "PLAYER STATS:",
        JSON.stringify(stats)
      );

      return res.status(200).json({
        success: true,
        data: stats,
      });

    } catch (err) {

      console.error(
        "GET /api/player/stats error:",
        err
      );

      if (res.headersSent) {
        return;
      }

      return next(err);
    }
  }
);

/* ------------------------------------------------------------------ */
/* EXPORT                                                             */
/* ------------------------------------------------------------------ */

module.exports = router;