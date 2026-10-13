// // // Shared player rules + helpers (used by playerRoutes.js and gameController.js)
// // const dbModule = require("../db");
// // // db.js may export the pool directly or as { pool }.
// // const rawDb = dbModule.pool || dbModule;
// // // If db.js uses plain "mysql2" (callback style), switch to its promise wrapper.
// // const pool = typeof rawDb.promise === "function" ? rawDb.promise() : rawDb;

// // /* ------------------------------------------------------------------ */
// // /* Rules (server side, so the app can't fake XP)                       */
// // /* ------------------------------------------------------------------ */

// // const XP_PER_LEVEL = 300;
// // const NAME_MAX = 30;

// // const GAMES = {
// //   "code-breaker": "Code Breaker",
// //   "word-scramble": "Word Scramble",
// // };

// // const ACTIVITY_TYPES = {
// //   game_win: { xp: 30, detail: () => "Completed a game" },
// //   game_lose: { xp: 10, detail: () => "Played a game" },
// //   high_score: { xp: 50, detail: (v) => `Scored ${v} points` },
// //   room_joined: { xp: 5, detail: () => "Joined a room" },
// //   room_created: { xp: 5, detail: () => "Created a room" },
// // };

// // // Badge definitions. `metric` is a key of the stats object returned by
// // // getPlayerStats(); a badge is earned when stats[metric] >= target.
// // const BADGES = [
// //   { id: "first-win", title: "First Win", description: "Win 1 game", icon: "star", color: "#F5A623", metric: "gamesWon", target: 1 },
// //   { id: "sharp-mind", title: "Sharp Mind", description: "Play 10 games", icon: "brain", color: "#3B82F6", metric: "gamesPlayed", target: 10 },
// //   { id: "streaker", title: "Streaker", description: "Win 3 in a row", icon: "fire", color: "#10B981", metric: "bestStreak", target: 3 },
// //   { id: "top-player", title: "Top Player", description: "High score 500+", icon: "crown", color: "#A855F7", metric: "highScore", target: 500 },
// // ];

// // /* ------------------------------------------------------------------ */
// // /* Tables (created / upgraded on first use)                            */
// // /* ------------------------------------------------------------------ */

// // let ready = null;

// // function ensureTables() {
// //   if (!ready) {
// //     ready = (async () => {
// //       await pool.query(`
// //         CREATE TABLE IF NOT EXISTS player (
// //           id INT PRIMARY KEY,
// //           name VARCHAR(${NAME_MAX}) NOT NULL DEFAULT 'Player',
// //           xp INT NOT NULL DEFAULT 0,
// //           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
// //         )
// //       `);
// //       await pool.query(`
// //         CREATE TABLE IF NOT EXISTS player_activity (
// //           id INT AUTO_INCREMENT PRIMARY KEY,
// //           player_id INT NOT NULL,
// //           game VARCHAR(30) NOT NULL,
// //           type VARCHAR(30) NOT NULL,
// //           title VARCHAR(80) NOT NULL,
// //           detail VARCHAR(160) NOT NULL,
// //           xp_awarded INT NOT NULL DEFAULT 0,
// //           value INT NOT NULL DEFAULT 0,
// //           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
// //           INDEX idx_player_created (player_id, id)
// //         )
// //       `);
// //       // Old installs: add the `value` (score) column once. Error 1060 = already there.
// //       try {
// //         await pool.query("ALTER TABLE player_activity ADD COLUMN value INT NOT NULL DEFAULT 0");
// //       } catch (e) {
// //         if (e.errno !== 1060) throw e;
// //       }
// //       await pool.query("INSERT IGNORE INTO player (id, name) VALUES (1, 'Player')");
// //     })().catch((err) => {
// //       ready = null; // allow a retry on the next call
// //       throw err;
// //     });
// //   }
// //   return ready;
// // }

// // /* ------------------------------------------------------------------ */
// // /* Save one finished game / event into Recent Activity                 */
// // /* ------------------------------------------------------------------ */

// // async function logActivity({ game, type, value = 0, detail }) {
// //   await ensureTables();

// //   if (!GAMES[game]) throw new Error("Unknown game");
// //   const rule = ACTIVITY_TYPES[type];
// //   if (!rule) throw new Error("Unknown activity type");

// //   const num = Number(value);
// //   const safeValue = Number.isFinite(num) ? Math.max(0, Math.round(num)) : 0;
// //   const text = String(detail || rule.detail(safeValue)).slice(0, 160);

// //   await pool.query(
// //     `INSERT INTO player_activity (player_id, game, type, title, detail, xp_awarded, value)
// //      VALUES (1, ?, ?, ?, ?, ?, ?)`,
// //     [game, type, GAMES[game], text, rule.xp, safeValue]
// //   );
// //   await pool.query("UPDATE player SET xp = xp + ? WHERE id = 1", [rule.xp]);
// // }

// // /* ------------------------------------------------------------------ */
// // /* Stats (everything calculated from the saved history)                */
// // /* ------------------------------------------------------------------ */

// // async function getPlayerStats() {
// //   await ensureTables();

// //   const [rows] = await pool.query(
// //     `SELECT type, value
// //        FROM player_activity
// //       WHERE player_id = 1 AND type IN ('game_win', 'game_lose', 'high_score')
// //       ORDER BY id DESC`
// //   );

// //   const games = rows.filter((r) => r.type === "game_win" || r.type === "game_lose"); // newest first
// //   const gamesPlayed = games.length;
// //   const gamesWon = games.filter((r) => r.type === "game_win").length;

// //   const highScore = rows
// //     .filter((r) => r.type === "game_win" || r.type === "high_score")
// //     .reduce((m, r) => Math.max(m, Number(r.value) || 0), 0);

// //   // current streak: from the latest game backwards until the first loss
// //   let currentStreak = 0;
// //   for (const g of games) {
// //     if (g.type === "game_win") currentStreak++;
// //     else break;
// //   }

// //   // best streak ever (for the "Streaker" badge)
// //   let bestStreak = 0;
// //   let run = 0;
// //   for (const g of [...games].reverse()) {
// //     if (g.type === "game_win") {
// //       run++;
// //       if (run > bestStreak) bestStreak = run;
// //     } else {
// //       run = 0;
// //     }
// //   }

// //   const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

// //   return { gamesPlayed, gamesWon, highScore, currentStreak, bestStreak, winRate };
// // }

// // module.exports = {
// //   pool,
// //   XP_PER_LEVEL,
// //   NAME_MAX,
// //   GAMES,
// //   ACTIVITY_TYPES,
// //   BADGES,
// //   ensureTables,
// //   logActivity,
// //   getPlayerStats,
// // };
// // Shared player rules + helpers
// // Used by playerRoutes.js and gameController.js

// const dbModule = require("../db");

// // db.js may export the pool directly or as { pool }
// const rawDb = dbModule.pool || dbModule;

// // If db.js uses plain mysql2 callback style,
// // switch to its promise wrapper.
// const pool =
//   typeof rawDb.promise === "function"
//     ? rawDb.promise()
//     : rawDb;

// /* ------------------------------------------------------------------ */
// /* Rules                                                               */
// /* ------------------------------------------------------------------ */

// const XP_PER_LEVEL = 300;
// const NAME_MAX = 30;

// const GAMES = {
//   "code-breaker": "Code Breaker",
//   "word-scramble": "Word Scramble",
// };

// const ACTIVITY_TYPES = {
//   game_win: {
//     xp: 30,
//     detail: () => "Completed a game",
//   },

//   game_lose: {
//     xp: 10,
//     detail: () => "Played a game",
//   },

//   high_score: {
//     xp: 50,
//     detail: (v) => `Scored ${v} points`,
//   },

//   room_joined: {
//     xp: 5,
//     detail: () => "Joined a room",
//   },

//   room_created: {
//     xp: 5,
//     detail: () => "Created a room",
//   },
// };

// /* ------------------------------------------------------------------ */
// /* Badges                                                              */
// /* ------------------------------------------------------------------ */

// const BADGES = [
//   {
//     id: "first-win",
//     title: "First Win",
//     description: "Win 1 game",
//     icon: "star",
//     color: "#F5A623",
//     metric: "gamesWon",
//     target: 1,
//   },

//   {
//     id: "sharp-mind",
//     title: "Sharp Mind",
//     description: "Play 10 games",
//     icon: "brain",
//     color: "#3B82F6",
//     metric: "gamesPlayed",
//     target: 10,
//   },

//   {
//     id: "streaker",
//     title: "Streaker",
//     description: "Win 3 in a row",
//     icon: "fire",
//     color: "#10B981",
//     metric: "bestStreak",
//     target: 3,
//   },

//   {
//     id: "top-player",
//     title: "Top Player",
//     description: "High score 500+",
//     icon: "crown",
//     color: "#A855F7",
//     metric: "highScore",
//     target: 500,
//   },
// ];

// /* ------------------------------------------------------------------ */
// /* Tables                                                              */
// /* ------------------------------------------------------------------ */

// let ready = null;

// function ensureTables() {
//   if (!ready) {
//     ready = (async () => {
//       /* ------------------------------------------------------------ */
//       /* PLAYER                                                        */
//       /* ------------------------------------------------------------ */

//       await pool.query(`
//         CREATE TABLE IF NOT EXISTS player (
//           id INT PRIMARY KEY,
//           name VARCHAR(${NAME_MAX}) NOT NULL DEFAULT 'Player',
//           xp INT NOT NULL DEFAULT 0,
//           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
//         )
//       `);

//       /* ------------------------------------------------------------ */
//       /* PLAYER ACTIVITY                                               */
//       /* ------------------------------------------------------------ */

//       await pool.query(`
//         CREATE TABLE IF NOT EXISTS player_activity (
//           id INT AUTO_INCREMENT PRIMARY KEY,

//           player_id INT NOT NULL,

//           game VARCHAR(30) NOT NULL,

//           type VARCHAR(30) NOT NULL,

//           title VARCHAR(80) NOT NULL,

//           detail VARCHAR(160) NOT NULL,

//           xp_awarded INT NOT NULL DEFAULT 0,

//           value INT NOT NULL DEFAULT 0,

//           source_key VARCHAR(120) NULL,

//           created_at TIMESTAMP NOT NULL
//             DEFAULT CURRENT_TIMESTAMP,

//           INDEX idx_player_created (player_id, id),
//           UNIQUE KEY uq_player_activity_source (player_id, source_key)
//         )
//       `);

//       /* ------------------------------------------------------------ */
//       /* OLD DATABASE SUPPORT                                          */
//       /* ------------------------------------------------------------ */

//       try {
//         await pool.query(`
//           ALTER TABLE player_activity
//           ADD COLUMN value INT NOT NULL DEFAULT 0
//         `);
//       } catch (e) {
//         // 1060 = column already exists
//         if (e.errno !== 1060) {
//           throw e;
//         }
//       }

//       try {
//         await pool.query(`
//           ALTER TABLE player_activity
//           ADD COLUMN source_key VARCHAR(120) NULL
//         `);
//       } catch (e) {
//         if (e.errno !== 1060) {
//           throw e;
//         }
//       }

//       try {
//         await pool.query(`
//           ALTER TABLE player_activity
//           ADD UNIQUE KEY uq_player_activity_source (player_id, source_key)
//         `);
//       } catch (e) {
//         if (e.errno !== 1061) {
//           throw e;
//         }
//       }

//       /* ------------------------------------------------------------ */
//       /* DEFAULT PLAYER                                                */
//       /* ------------------------------------------------------------ */

//       await pool.query(`
//         INSERT IGNORE INTO player
//         (id, name)
//         VALUES
//         (1, 'Player')
//       `);
//     })().catch((err) => {
//       ready = null;
//       throw err;
//     });
//   }

//   return ready;
// }

// /* ------------------------------------------------------------------ */
// /* Save Activity                                                       */
// /* ------------------------------------------------------------------ */

// async function logActivity({
//   playerId = 1,
//   game,
//   type,
//   value = 0,
//   detail,
//   activityKey,
// }) {
//   await ensureTables();

//   const numericPlayerId = Number(playerId) || 1;

//   /* -------------------------------------------------------------- */
//   /* Validate game                                                   */
//   /* -------------------------------------------------------------- */

//   if (!GAMES[game]) {
//     throw new Error("Unknown game");
//   }

//   /* -------------------------------------------------------------- */
//   /* Validate activity type                                         */
//   /* -------------------------------------------------------------- */

//   const rule = ACTIVITY_TYPES[type];

//   if (!rule) {
//     throw new Error("Unknown activity type");
//   }

//   /* -------------------------------------------------------------- */
//   /* Make sure player exists                                        */
//   /* -------------------------------------------------------------- */

//   await pool.query(
//     `
//     INSERT IGNORE INTO player
//     (
//       id,
//       name
//     )
//     VALUES
//     (?, 'Player')
//     `,
//     [numericPlayerId]
//   );

//   /* -------------------------------------------------------------- */
//   /* Sanitize score/value                                           */
//   /* -------------------------------------------------------------- */

//   const num = Number(value);

//   const safeValue = Number.isFinite(num)
//     ? Math.max(0, Math.round(num))
//     : 0;

//   const text = String(
//     detail || rule.detail(safeValue)
//   ).slice(0, 160);
//   const sourceKey =
//     typeof activityKey === "string" && activityKey.trim()
//       ? activityKey.trim().slice(0, 120)
//       : null;

//   /* -------------------------------------------------------------- */
//   /* Save activity                                                   */
//   /* -------------------------------------------------------------- */

//   const [insertResult] = await pool.query(
//     `
//     INSERT ${sourceKey ? "IGNORE " : ""}INTO player_activity
//     (
//       player_id,
//       game,
//       type,
//       title,
//       detail,
//       xp_awarded,
//       value,
//       source_key
//     )
//     VALUES
//     (?, ?, ?, ?, ?, ?, ?, ?)
//     `,
//     [
//       numericPlayerId,
//       game,
//       type,
//       GAMES[game],
//       text,
//       rule.xp,
//       safeValue,
//       sourceKey,
//     ]
//   );

//   if (insertResult.affectedRows === 0) {
//     return false;
//   }

//   /* -------------------------------------------------------------- */
//   /* Update XP                                                       */
//   /* -------------------------------------------------------------- */

//   await pool.query(
//     `
//     UPDATE player
//     SET xp = xp + ?
//     WHERE id = ?
//     `,
//     [
//       rule.xp,
//       numericPlayerId,
//     ]
//   );

//   return true;
// }

// /* ------------------------------------------------------------------ */
// /* Get Player Stats                                                    */
// /* ------------------------------------------------------------------ */

// async function getPlayerStats(playerId = 1) {
//   await ensureTables();

//   const numericPlayerId =
//     Number(playerId) || 1;

//   const [rows] = await pool.query(
//     `
//     SELECT
//       type,
//       value
//     FROM player_activity
//     WHERE
//       player_id = ?
//       AND type IN
//       (
//         'game_win',
//         'game_lose',
//         'high_score'
//       )
//     ORDER BY id DESC
//     `,
//     [numericPlayerId]
//   );

//   /* -------------------------------------------------------------- */
//   /* Games played                                                    */
//   /* -------------------------------------------------------------- */

//   const games = rows.filter(
//     (r) =>
//       r.type === "game_win" ||
//       r.type === "game_lose"
//   );

//   const gamesPlayed = games.length;

//   /* -------------------------------------------------------------- */
//   /* Games won                                                       */
//   /* -------------------------------------------------------------- */

//   const gamesWon = games.filter(
//     (r) => r.type === "game_win"
//   ).length;

//   /* -------------------------------------------------------------- */
//   /* High score                                                      */
//   /* -------------------------------------------------------------- */

//   const highScore = rows
//     .filter(
//       (r) =>
//         r.type === "game_win" ||
//         r.type === "high_score"
//     )
//     .reduce(
//       (max, r) =>
//         Math.max(
//           max,
//           Number(r.value) || 0
//         ),
//       0
//     );

//   /* -------------------------------------------------------------- */
//   /* Current streak                                                  */
//   /* -------------------------------------------------------------- */

//   let currentStreak = 0;

//   for (const game of games) {
//     if (game.type === "game_win") {
//       currentStreak++;
//     } else {
//       break;
//     }
//   }

//   /* -------------------------------------------------------------- */
//   /* Best streak                                                     */
//   /* -------------------------------------------------------------- */

//   let bestStreak = 0;
//   let run = 0;

//   for (const game of [...games].reverse()) {
//     if (game.type === "game_win") {
//       run++;

//       if (run > bestStreak) {
//         bestStreak = run;
//       }
//     } else {
//       run = 0;
//     }
//   }

//   /* -------------------------------------------------------------- */
//   /* Win rate                                                        */
//   /* -------------------------------------------------------------- */

//   const winRate =
//     gamesPlayed > 0
//       ? Math.round(
//           (gamesWon / gamesPlayed) * 100
//         )
//       : 0;

//   return {
//     gamesPlayed,
//     gamesWon,
//     highScore,
//     currentStreak,
//     bestStreak,
//     winRate,
//   };
// }

// /* ------------------------------------------------------------------ */
// /* Get Complete Player Profile                                        */
// /* ------------------------------------------------------------------ */

// async function getPlayerProfile(playerId = 1) {
//   await ensureTables();

//   const numericPlayerId =
//     Number(playerId) || 1;

//   /* -------------------------------------------------------------- */
//   /* Player                                                          */
//   /* -------------------------------------------------------------- */

//   const [playerRows] = await pool.query(
//     `
//     // SELECT
//     //   id,
//     //   name,
//     //   xp,
//     //   created_at
//     // FROM player
//     SELECT
//   id,
//   name,
//   dob,
//   gender,
//   phone,
//   type,
//   xp,
//   created_at
// FROM player
//     WHERE id = ?
//     LIMIT 1
//     `,
//     [numericPlayerId]
//   );

//   /* -------------------------------------------------------------- */
//   /* If player doesn't exist                                         */
//   /* -------------------------------------------------------------- */

//   if (playerRows.length === 0) {
//     await pool.query(
//       `
//       INSERT INTO player
//       (
//         id,
//         name
//       )
//       VALUES
//       (?, 'Player')
//       `,
//       [numericPlayerId]
//     );
//   }

//   /* Get player again */
//   const [[player]] = await pool.query(
//     `
//     // SELECT
//     //   id,
//     //   name,
//     //   xp,
//     //   created_at
//     // FROM player
//     SELECT
//   id,
//   name,
//   dob,
//   gender,
//   phone,
//   type,
//   xp,
//   created_at
// FROM player
//     WHERE id = ?
//     LIMIT 1
//     `,
//     [numericPlayerId]
//   );

//   /* -------------------------------------------------------------- */
//   /* Recent activity                                                 */
//   /* -------------------------------------------------------------- */

//   const [activity] = await pool.query(
//     `
//     SELECT
//       id,
//       game,
//       type,
//       title,
//       detail,
//       xp_awarded,
//       value,
//       created_at
//     FROM player_activity
//     WHERE player_id = ?
//     ORDER BY id DESC
//     LIMIT 10
//     `,
//     [numericPlayerId]
//   );

//   /* -------------------------------------------------------------- */
//   /* Stats                                                            */
//   /* -------------------------------------------------------------- */

//   const stats =
//     await getPlayerStats(
//       numericPlayerId
//     );

//   /* -------------------------------------------------------------- */
//   /* XP / Level                                                       */
//   /* -------------------------------------------------------------- */

//   const totalXp =
//     Number(player.xp) || 0;

//   const level =
//     Math.floor(
//       totalXp / XP_PER_LEVEL
//     ) + 1;

//   const currentLevelXp =
//     totalXp % XP_PER_LEVEL;

//   /* -------------------------------------------------------------- */
//   /* Badges                                                           */
//   /* -------------------------------------------------------------- */

//   const badges = BADGES.map(
//     (badge) => {
//       const value =
//         Number(
//           stats[badge.metric]
//         ) || 0;

//       return {
//         id: badge.id,

//         title: badge.title,

//         description:
//           badge.description,

//         icon: badge.icon,

//         color: badge.color,

//         metric: badge.metric,

//         target: badge.target,

//         progress:
//           Math.min(
//             value,
//             badge.target
//           ),

//         currentValue: value,

//         unlocked:
//           value >= badge.target,
//       };
//     }
//   );

//   /* -------------------------------------------------------------- */
//   /* Recent activity JSON                                            */
//   /* -------------------------------------------------------------- */

//   const recentActivity =
//     activity.map((item) => ({
//       id: item.id,

//       game: item.game,

//       type: item.type,

//       title: item.title,

//       detail: item.detail,

//       xpAwarded:
//         Number(
//           item.xp_awarded
//         ) || 0,

//       value:
//         Number(item.value) || 0,

//       createdAt:
//         new Date(
//           item.created_at
//         ).toISOString(),
//     }));

//   /* -------------------------------------------------------------- */
//   /* Final response object                                           */
//   /* -------------------------------------------------------------- */

//   // return {
//   //   player: {
//   //     id: player.id,
//   //     name: player.name,
//   //     joinedAt:
//   //       new Date(
//   //         player.created_at
//   //       ).toISOString(),
//   //   },
// return {
//   player: {
//     id: player.id,
//     name: player.name,
//     dob: player.dob
//       ? String(player.dob).slice(0, 10)
//       : null,
//     gender: player.gender || null,
//     phone: player.phone || null,
//     type: player.type || "user",
//     joinedAt:
//       new Date(
//         player.created_at
//       ).toISOString(),
//   },
//     level,

//     xp: currentLevelXp,

//     xpForNext: XP_PER_LEVEL,

//     totalXp,

//     stats,

//     badges,

//     recentActivity,
//   };
// }

// /* ------------------------------------------------------------------ */
// /* Exports                                                             */
// /* ------------------------------------------------------------------ */

// module.exports = {
//   pool,

//   XP_PER_LEVEL,

//   NAME_MAX,

//   GAMES,

//   ACTIVITY_TYPES,

//   BADGES,

//   ensureTables,

//   logActivity,

//   getPlayerStats,

//   getPlayerProfile,
// };
const dbModule = require("../db");

// db.js may export the pool directly or as { pool }
const rawDb = dbModule.pool || dbModule;

// If db.js uses plain mysql2 callback style,
// switch to its promise wrapper.
const pool =
  typeof rawDb.promise === "function"
    ? rawDb.promise()
    : rawDb;

/* ------------------------------------------------------------------ */
/* Rules                                                              */
/* ------------------------------------------------------------------ */

const XP_PER_LEVEL = 300;
const NAME_MAX = 30;

const GAMES = {
  "code-breaker": "Code Breaker",
  "word-scramble": "Word Scramble",
};

const ACTIVITY_TYPES = {
  game_win: {
    xp: 30,
    detail: () => "Completed a game",
  },

  game_lose: {
    xp: 10,
    detail: () => "Played a game",
  },

  high_score: {
    xp: 50,
    detail: (v) => `Scored ${v} points`,
  },

  room_joined: {
    xp: 5,
    detail: () => "Joined a room",
  },

  room_created: {
    xp: 5,
    detail: () => "Created a room",
  },
};

/* ------------------------------------------------------------------ */
/* Badges                                                             */
/* ------------------------------------------------------------------ */

const BADGES = [
  {
    id: "first-win",
    title: "First Win",
    description: "Win 1 game",
    icon: "star",
    color: "#F5A623",
    metric: "gamesWon",
    target: 1,
  },

  {
    id: "sharp-mind",
    title: "Sharp Mind",
    description: "Play 10 games",
    icon: "brain",
    color: "#3B82F6",
    metric: "gamesPlayed",
    target: 10,
  },

  {
    id: "streaker",
    title: "Streaker",
    description: "Win 3 in a row",
    icon: "fire",
    color: "#10B981",
    metric: "bestStreak",
    target: 3,
  },

  {
    id: "top-player",
    title: "Top Player",
    description: "High score 500+",
    icon: "crown",
    color: "#A855F7",
    metric: "highScore",
    target: 500,
  },
];

/* ------------------------------------------------------------------ */
/* Tables                                                             */
/* ------------------------------------------------------------------ */

let ready = null;

function ensureTables() {
  if (!ready) {
    ready = (async () => {
      /* ------------------------------------------------------------ */
      /* PLAYER                                                         */
      /* ------------------------------------------------------------ */

      await pool.query(`
        CREATE TABLE IF NOT EXISTS player (
          id INT PRIMARY KEY,
          name VARCHAR(${NAME_MAX}) NOT NULL DEFAULT 'Player',
          xp INT NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);

      /* ------------------------------------------------------------ */
      /* PROFILE COLUMNS - OLD DATABASE SUPPORT                        */
      /* ------------------------------------------------------------ */

      try {
        await pool.query(`
          ALTER TABLE player
          ADD COLUMN dob DATE NULL
        `);
      } catch (e) {
        if (e.errno !== 1060) {
          throw e;
        }
      }

      try {
        await pool.query(`
          ALTER TABLE player
          ADD COLUMN gender VARCHAR(10) NULL
        `);
      } catch (e) {
        if (e.errno !== 1060) {
          throw e;
        }
      }

      try {
        await pool.query(`
          ALTER TABLE player
          ADD COLUMN phone VARCHAR(20) NULL
        `);
      } catch (e) {
        if (e.errno !== 1060) {
          throw e;
        }
      }

      try {
        await pool.query(`
          ALTER TABLE player
          ADD COLUMN type VARCHAR(20) NULL DEFAULT 'user'
        `);
      } catch (e) {
        if (e.errno !== 1060) {
          throw e;
        }
      }

      /* ------------------------------------------------------------ */
      /* PLAYER ACTIVITY                                               */
      /* ------------------------------------------------------------ */

      await pool.query(`
        CREATE TABLE IF NOT EXISTS player_activity (
          id INT AUTO_INCREMENT PRIMARY KEY,

          player_id INT NOT NULL,

          game VARCHAR(30) NOT NULL,

          type VARCHAR(30) NOT NULL,

          title VARCHAR(80) NOT NULL,

          detail VARCHAR(160) NOT NULL,

          xp_awarded INT NOT NULL DEFAULT 0,

          value INT NOT NULL DEFAULT 0,

          source_key VARCHAR(120) NULL,

          created_at TIMESTAMP NOT NULL
            DEFAULT CURRENT_TIMESTAMP,

          INDEX idx_player_created (player_id, id),

          UNIQUE KEY uq_player_activity_source
            (player_id, source_key)
        )
      `);

      /* ------------------------------------------------------------ */
      /* OLD DATABASE SUPPORT - ACTIVITY VALUE                         */
      /* ------------------------------------------------------------ */

      try {
        await pool.query(`
          ALTER TABLE player_activity
          ADD COLUMN value INT NOT NULL DEFAULT 0
        `);
      } catch (e) {
        if (e.errno !== 1060) {
          throw e;
        }
      }

      /* ------------------------------------------------------------ */
      /* OLD DATABASE SUPPORT - SOURCE KEY                             */
      /* ------------------------------------------------------------ */

      try {
        await pool.query(`
          ALTER TABLE player_activity
          ADD COLUMN source_key VARCHAR(120) NULL
        `);
      } catch (e) {
        if (e.errno !== 1060) {
          throw e;
        }
      }

      /* ------------------------------------------------------------ */
      /* UNIQUE SOURCE KEY                                             */
      /* ------------------------------------------------------------ */

      try {
        await pool.query(`
          ALTER TABLE player_activity
          ADD UNIQUE KEY uq_player_activity_source
          (player_id, source_key)
        `);
      } catch (e) {
        // 1061 = duplicate key name
        if (e.errno !== 1061) {
          throw e;
        }
      }

      /* ------------------------------------------------------------ */
      /* DEFAULT PLAYER                                                 */
      /* ------------------------------------------------------------ */

      await pool.query(`
        INSERT IGNORE INTO player
        (id, name, type)
        VALUES
        (1, 'Player', 'user')
      `);
    })().catch((err) => {
      ready = null;
      throw err;
    });
  }

  return ready;
}

/* ------------------------------------------------------------------ */
/* Save Activity                                                      */
/* ------------------------------------------------------------------ */

async function logActivity({
  playerId = 1,
  game,
  type,
  value = 0,
  detail,
  activityKey,
}) {
  await ensureTables();

  const numericPlayerId = Number(playerId) || 1;

  /* -------------------------------------------------------------- */
  /* Validate game                                                   */
  /* -------------------------------------------------------------- */

  if (!GAMES[game]) {
    throw new Error("Unknown game");
  }

  /* -------------------------------------------------------------- */
  /* Validate activity type                                          */
  /* -------------------------------------------------------------- */

  const rule = ACTIVITY_TYPES[type];

  if (!rule) {
    throw new Error("Unknown activity type");
  }

  /* -------------------------------------------------------------- */
  /* Make sure player exists                                         */
  /* -------------------------------------------------------------- */

  await pool.query(
    `
    INSERT IGNORE INTO player
    (
      id,
      name,
      type
    )
    VALUES
    (?, 'Player', 'user')
    `,
    [numericPlayerId]
  );

  /* -------------------------------------------------------------- */
  /* Sanitize score/value                                            */
  /* -------------------------------------------------------------- */

  const num = Number(value);

  const safeValue = Number.isFinite(num)
    ? Math.max(0, Math.round(num))
    : 0;

  const text = String(
    detail || rule.detail(safeValue)
  ).slice(0, 160);

  const sourceKey =
    typeof activityKey === "string" &&
    activityKey.trim()
      ? activityKey.trim().slice(0, 120)
      : null;

  /* -------------------------------------------------------------- */
  /* Save activity                                                    */
  /* -------------------------------------------------------------- */

  const [insertResult] = await pool.query(
    `
    INSERT ${sourceKey ? "IGNORE " : ""}INTO player_activity
    (
      player_id,
      game,
      type,
      title,
      detail,
      xp_awarded,
      value,
      source_key
    )
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      numericPlayerId,
      game,
      type,
      GAMES[game],
      text,
      rule.xp,
      safeValue,
      sourceKey,
    ]
  );

  if (insertResult.affectedRows === 0) {
    return false;
  }

  /* -------------------------------------------------------------- */
  /* Update XP                                                        */
  /* -------------------------------------------------------------- */

  await pool.query(
    `
    UPDATE player
    SET xp = xp + ?
    WHERE id = ?
    `,
    [
      rule.xp,
      numericPlayerId,
    ]
  );

  return true;
}

/* ------------------------------------------------------------------ */
/* Get Player Stats                                                   */
/* ------------------------------------------------------------------ */

async function getPlayerStats(playerId = 1) {
  await ensureTables();

  const numericPlayerId =
    Number(playerId) || 1;

  const [rows] = await pool.query(
    `
    SELECT
      type,
      value
    FROM player_activity
    WHERE
      player_id = ?
      AND type IN
      (
        'game_win',
        'game_lose',
        'high_score'
      )
    ORDER BY id DESC
    `,
    [numericPlayerId]
  );

  /* -------------------------------------------------------------- */
  /* Games played                                                     */
  /* -------------------------------------------------------------- */

  const games = rows.filter(
    (r) =>
      r.type === "game_win" ||
      r.type === "game_lose"
  );

  const gamesPlayed = games.length;

  /* -------------------------------------------------------------- */
  /* Games won                                                        */
  /* -------------------------------------------------------------- */

  const gamesWon = games.filter(
    (r) => r.type === "game_win"
  ).length;

  /* -------------------------------------------------------------- */
  /* High score                                                       */
  /* -------------------------------------------------------------- */

  const highScore = rows
    .filter(
      (r) =>
        r.type === "game_win" ||
        r.type === "high_score"
    )
    .reduce(
      (max, r) =>
        Math.max(
          max,
          Number(r.value) || 0
        ),
      0
    );

  /* -------------------------------------------------------------- */
  /* Current streak                                                   */
  /* -------------------------------------------------------------- */

  let currentStreak = 0;

  for (const game of games) {
    if (game.type === "game_win") {
      currentStreak++;
    } else {
      break;
    }
  }

  /* -------------------------------------------------------------- */
  /* Best streak                                                      */
  /* -------------------------------------------------------------- */

  let bestStreak = 0;
  let run = 0;

  for (const game of [...games].reverse()) {
    if (game.type === "game_win") {
      run++;

      if (run > bestStreak) {
        bestStreak = run;
      }
    } else {
      run = 0;
    }
  }

  /* -------------------------------------------------------------- */
  /* Win rate                                                         */
  /* -------------------------------------------------------------- */

  const winRate =
    gamesPlayed > 0
      ? Math.round(
          (gamesWon / gamesPlayed) * 100
        )
      : 0;

  return {
    gamesPlayed,
    gamesWon,
    highScore,
    currentStreak,
    bestStreak,
    winRate,
  };
}

/* ------------------------------------------------------------------ */
/* Get Complete Player Profile                                       */
/* ------------------------------------------------------------------ */

async function getPlayerProfile(playerId = 1) {
  await ensureTables();

  const numericPlayerId =
    Number(playerId) || 1;

  /* -------------------------------------------------------------- */
  /* Get player                                                       */
  /* -------------------------------------------------------------- */

  const [playerRows] = await pool.query(
    `
    SELECT
      id,
      name,
      dob,
      gender,
      phone,
      type,
      xp,
      created_at
    FROM player
    WHERE id = ?
    LIMIT 1
    `,
    [numericPlayerId]
  );

  /* -------------------------------------------------------------- */
  /* If player doesn't exist                                         */
  /* -------------------------------------------------------------- */

  if (playerRows.length === 0) {
    await pool.query(
      `
      INSERT INTO player
      (
        id,
        name,
        type
      )
      VALUES
      (?, 'Player', 'user')
      `,
      [numericPlayerId]
    );
  }

  /* -------------------------------------------------------------- */
  /* Get player again                                                 */
  /* -------------------------------------------------------------- */

  const [updatedRows] = await pool.query(
    `
    SELECT
      id,
      name,
      dob,
      gender,
      phone,
      type,
      xp,
      created_at
    FROM player
    WHERE id = ?
    LIMIT 1
    `,
    [numericPlayerId]
  );

  if (updatedRows.length === 0) {
    throw new Error(
      `Player ${numericPlayerId} could not be loaded`
    );
  }

  const player = updatedRows[0];

  /* -------------------------------------------------------------- */
  /* Recent activity                                                  */
  /* -------------------------------------------------------------- */

  const [activity] = await pool.query(
    `
    SELECT
      id,
      game,
      type,
      title,
      detail,
      xp_awarded,
      value,
      created_at
    FROM player_activity
    WHERE player_id = ?
    ORDER BY id DESC
    LIMIT 10
    `,
    [numericPlayerId]
  );

  /* -------------------------------------------------------------- */
  /* Stats                                                             */
  /* -------------------------------------------------------------- */

  const stats =
    await getPlayerStats(
      numericPlayerId
    );

  /* -------------------------------------------------------------- */
  /* XP / Level                                                        */
  /* -------------------------------------------------------------- */

  const totalXp =
    Number(player.xp) || 0;

  const level =
    Math.floor(
      totalXp / XP_PER_LEVEL
    ) + 1;

  const currentLevelXp =
    totalXp % XP_PER_LEVEL;

  /* -------------------------------------------------------------- */
  /* Badges                                                            */
  /* -------------------------------------------------------------- */

  const badges = BADGES.map(
    (badge) => {
      const value =
        Number(
          stats[badge.metric]
        ) || 0;

      return {
        id: badge.id,

        title: badge.title,

        description:
          badge.description,

        icon: badge.icon,

        color: badge.color,

        metric: badge.metric,

        target: badge.target,

        progress:
          Math.min(
            value,
            badge.target
          ),

        currentValue: value,

        unlocked:
          value >= badge.target,
      };
    }
  );

  /* -------------------------------------------------------------- */
  /* Recent activity JSON                                             */
  /* -------------------------------------------------------------- */

  const recentActivity =
    activity.map(
      (item) => ({
        id: item.id,

        game: item.game,

        type: item.type,

        title: item.title,

        detail: item.detail,

        xpAwarded:
          Number(
            item.xp_awarded
          ) || 0,

        value:
          Number(item.value) || 0,

        createdAt:
          new Date(
            item.created_at
          ).toISOString(),
      })
    );

  /* -------------------------------------------------------------- */
  /* Final response                                                   */
  /* -------------------------------------------------------------- */

  return {
    player: {
      id: player.id,

      name: player.name,

      dob: player.dob
        ? String(player.dob).slice(0, 10)
        : null,

      gender:
        player.gender || null,

      phone:
        player.phone || null,

      type:
        player.type || "user",

      joinedAt:
        player.created_at
          ? new Date(
              player.created_at
            ).toISOString()
          : null,
    },

    level,

    xp: currentLevelXp,

    xpForNext:
      XP_PER_LEVEL,

    totalXp,

    stats,

    badges,

    recentActivity,
  };
}

/* ------------------------------------------------------------------ */
/* Exports                                                            */
/* ------------------------------------------------------------------ */

module.exports = {
  pool,

  XP_PER_LEVEL,

  NAME_MAX,

  GAMES,

  ACTIVITY_TYPES,

  BADGES,

  ensureTables,

  logActivity,

  getPlayerStats,

  getPlayerProfile,
};