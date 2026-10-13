// // // // // // // // const express = require("express");
// // // // // // // // const router = express.Router();
// // // // // // // // const authController = require("../controllers/authController");

// // // // // // // // router.post("/login", authController.login);

// // // // // // // // module.exports = router;
// // // // // // // const express = require("express");
// // // // // // // const bcrypt = require("bcrypt");
// // // // // // // const { pool } = require("../utils/playerActivity");

// // // // // // // const router = express.Router();

// // // // // // // /*
// // // // // // //   Table `player` must have:  id, name, xp, username (UNIQUE), password_hash
// // // // // // //   (name = the display/player name shown in all games)
// // // // // // // */

// // // // // // // /* ---------------------------- REGISTER ---------------------------- */
// // // // // // // /*
// // // // // // //   POST /api/auth/register
// // // // // // //   Body: { "username": "arun", "password": "1234", "name": "Arun" }
// // // // // // // */
// // // // // // // router.post("/auth/register", async (req, res) => {
// // // // // // //   try {
// // // // // // //     const username = String(req.body?.username || "").trim().toLowerCase();
// // // // // // //     const password = String(req.body?.password || "");
// // // // // // //     const name = String(req.body?.name || "").trim();

// // // // // // //     if (!username || !password || !name) {
// // // // // // //       return res
// // // // // // //         .status(400)
// // // // // // //         .json({ success: false, error: "username, password and name are required." });
// // // // // // //     }

// // // // // // //     const [exists] = await pool.query(
// // // // // // //       "SELECT id FROM player WHERE username = ?",
// // // // // // //       [username]
// // // // // // //     );

// // // // // // //     if (exists.length > 0) {
// // // // // // //       return res
// // // // // // //         .status(409)
// // // // // // //         .json({ success: false, error: "Username already taken." });
// // // // // // //     }

// // // // // // //     const hash = await bcrypt.hash(password, 10);

// // // // // // //     // Every account gets its OWN new row -> its own id and its own name
// // // // // // //     const [result] = await pool.query(
// // // // // // //       "INSERT INTO player (username, password_hash, name, xp) VALUES (?, ?, ?, 0)",
// // // // // // //       [username, hash, name]
// // // // // // //     );

// // // // // // //     return res.status(201).json({
// // // // // // //       success: true,
// // // // // // //       player: { id: result.insertId, username, name },
// // // // // // //     });
// // // // // // //   } catch (err) {
// // // // // // //     console.error("Register error:", err);
// // // // // // //     return res.status(500).json({ success: false, error: "Server error." });
// // // // // // //   }
// // // // // // // });

// // // // // // // /* ------------------------------ LOGIN ----------------------------- */
// // // // // // // /*
// // // // // // //   POST /api/auth/login
// // // // // // //   Body: { "username": "arun", "password": "1234" }
// // // // // // // */
// // // // // // // router.post("/auth/login", async (req, res) => {
// // // // // // //   try {
// // // // // // //     const username = String(req.body?.username || "").trim().toLowerCase();
// // // // // // //     const password = String(req.body?.password || "");

// // // // // // //     const [rows] = await pool.query(
// // // // // // //       "SELECT id, username, name, password_hash FROM player WHERE username = ?",
// // // // // // //       [username]
// // // // // // //     );

// // // // // // //     const ok =
// // // // // // //       rows.length > 0 &&
// // // // // // //       rows[0].password_hash &&
// // // // // // //       (await bcrypt.compare(password, rows[0].password_hash));

// // // // // // //     if (!ok) {
// // // // // // //       return res
// // // // // // //         .status(401)
// // // // // // //         .json({ success: false, error: "Invalid username or password." });
// // // // // // //     }

// // // // // // //     const p = rows[0];

// // // // // // //     return res.json({
// // // // // // //       success: true,
// // // // // // //       player: { id: p.id, username: p.username, name: p.name },
// // // // // // //     });
// // // // // // //   } catch (err) {
// // // // // // //     console.error("Login error:", err);
// // // // // // //     return res.status(500).json({ success: false, error: "Server error." });
// // // // // // //   }
// // // // // // // });

// // // // // // // module.exports = router;
// // // // // // const express = require("express");
// // // // // // const bcrypt = require("bcrypt");
// // // // // // const { pool } = require("../utils/playerActivity");

// // // // // // const router = express.Router();

// // // // // // /*
// // // // // //   Table `player` must have:  id, name, xp, username (UNIQUE), password_hash
// // // // // //   (name = the display/player name shown in all games)
// // // // // // */

// // // // // // /* ---------------------------- REGISTER ---------------------------- */
// // // // // // /*
// // // // // //   POST /api/auth/register
// // // // // //   Body: { "username": "arun", "password": "1234", "name": "Arun" }
// // // // // // */
// // // // // // router.post("/auth/register", async (req, res) => {
// // // // // //   try {
// // // // // //     const username = String(req.body?.username || "").trim().toLowerCase();
// // // // // //     const password = String(req.body?.password || "");
// // // // // //     const name = String(req.body?.name || "").trim();

// // // // // //     if (!username || !password || !name) {
// // // // // //       return res
// // // // // //         .status(400)
// // // // // //         .json({ success: false, error: "username, password and name are required." });
// // // // // //     }

// // // // // //     const [exists] = await pool.query(
// // // // // //       "SELECT id FROM player WHERE username = ?",
// // // // // //       [username]
// // // // // //     );

// // // // // //     if (exists.length > 0) {
// // // // // //       return res
// // // // // //         .status(409)
// // // // // //         .json({ success: false, error: "Username already taken." });
// // // // // //     }

// // // // // //     const hash = await bcrypt.hash(password, 10);

// // // // // //     // Every account gets its OWN new row -> its own id and its own name
// // // // // //     const [result] = await pool.query(
// // // // // //       "INSERT INTO player (username, password_hash, name, xp) VALUES (?, ?, ?, 0)",
// // // // // //       [username, hash, name]
// // // // // //     );

// // // // // //     return res.status(201).json({
// // // // // //       success: true,
// // // // // //       player: { id: result.insertId, username, name },
// // // // // //     });
// // // // // //   } catch (err) {
// // // // // //     console.error("Register error:", err);
// // // // // //     return res.status(500).json({ success: false, error: "Server error." });
// // // // // //   }
// // // // // // });

// // // // // // /* ------------------------------ LOGIN ----------------------------- */
// // // // // // /*
// // // // // //   POST /api/auth/login
// // // // // //   Body: { "username": "arun", "password": "1234" }
// // // // // // */
// // // // // // router.post("/auth/login", async (req, res) => {
// // // // // //   try {
// // // // // //     const username = String(req.body?.username || "").trim().toLowerCase();
// // // // // //     const password = String(req.body?.password || "");

// // // // // //     const [rows] = await pool.query(
// // // // // //       "SELECT id, username, name, password_hash FROM player WHERE username = ?",
// // // // // //       [username]
// // // // // //     );

// // // // // //     const ok =
// // // // // //       rows.length > 0 &&
// // // // // //       rows[0].password_hash &&
// // // // // //       (await bcrypt.compare(password, rows[0].password_hash));

// // // // // //     if (!ok) {
// // // // // //       return res
// // // // // //         .status(401)
// // // // // //         .json({ success: false, error: "Invalid username or password." });
// // // // // //     }

// // // // // //     const p = rows[0];

// // // // // //     return res.json({
// // // // // //       success: true,
// // // // // //       player: { id: p.id, username: p.username, name: p.name },
// // // // // //     });
// // // // // //   } catch (err) {
// // // // // //     console.error("Login error:", err);
// // // // // //     return res.status(500).json({ success: false, error: "Server error." });
// // // // // //   }
// // // // // // });

// // // // // // /* ------------------------- ENTER (name only) ----------------------- */
// // // // // // /*
// // // // // //   POST /api/auth/enter
// // // // // //   Body: { "name": "Arun" }

// // // // // //   For the "enter your name" login screen (no password):
// // // // // //   - same name  -> same account (same id, same stats)
// // // // // //   - new name   -> NEW account row (new id, own stats, own name)
// // // // // //   `username` is the fixed login key (lowercase of the typed name).
// // // // // //   `name` is the display name, which can be edited later in Profile.
// // // // // // */
// // // // // // router.post("/auth/enter", async (req, res) => {
// // // // // //   try {
// // // // // //     const typed = String(req.body?.name || "").trim();

// // // // // //     if (typed.length < 2 || typed.length > 30) {
// // // // // //       return res
// // // // // //         .status(400)
// // // // // //         .json({ success: false, error: "Name must be 2-30 characters." });
// // // // // //     }

// // // // // //     const username = typed.toLowerCase();

// // // // // //     const [rows] = await pool.query(
// // // // // //       "SELECT id, username, name FROM player WHERE username = ?",
// // // // // //       [username]
// // // // // //     );

// // // // // //     if (rows.length > 0) {
// // // // // //       const p = rows[0];
// // // // // //       return res.json({
// // // // // //         success: true,
// // // // // //         created: false,
// // // // // //         player: { id: p.id, username: p.username, name: p.name },
// // // // // //       });
// // // // // //     }

// // // // // //     const [result] = await pool.query(
// // // // // //       "INSERT INTO player (username, name, xp) VALUES (?, ?, 0)",
// // // // // //       [username, typed]
// // // // // //     );

// // // // // //     return res.status(201).json({
// // // // // //       success: true,
// // // // // //       created: true,
// // // // // //       player: { id: result.insertId, username, name: typed },
// // // // // //     });
// // // // // //   } catch (err) {
// // // // // //     console.error("Enter error:", err);
// // // // // //     return res.status(500).json({ success: false, error: "Server error." });
// // // // // //   }
// // // // // // });

// // // // // // module.exports = router;
// // // // // const express = require("express");
// // // // // const { pool } = require("../utils/playerActivity");

// // // // // const router = express.Router();

// // // // // /*
// // // // //   Table `player` must have:  id, name, xp, username (UNIQUE)
// // // // //   (name = the display/player name shown in all games)

// // // // //   POST /api/auth/enter
// // // // //   Body: { "name": "Arun" }

// // // // //   - same name  -> same account (same id, same stats)
// // // // //   - new name   -> NEW account row (new id, own stats, own name)
// // // // //   `username` is the fixed login key (lowercase of the typed name).
// // // // //   `name` is the display name, which can be edited later in Profile.
// // // // // */
// // // // // router.post("/auth/enter", async (req, res) => {
// // // // //   try {
// // // // //     const typed = String(req.body?.name || "").trim();

// // // // //     if (typed.length < 2 || typed.length > 30) {
// // // // //       return res
// // // // //         .status(400)
// // // // //         .json({ success: false, error: "Name must be 2-30 characters." });
// // // // //     }

// // // // //     const username = typed.toLowerCase();

// // // // //     const [rows] = await pool.query(
// // // // //       "SELECT id, username, name FROM player WHERE username = ?",
// // // // //       [username]
// // // // //     );

// // // // //     if (rows.length > 0) {
// // // // //       const p = rows[0];
// // // // //       return res.json({
// // // // //         success: true,
// // // // //         created: false,
// // // // //         player: { id: p.id, username: p.username, name: p.name },
// // // // //       });
// // // // //     }

// // // // //     const [result] = await pool.query(
// // // // //       "INSERT INTO player (username, name, xp) VALUES (?, ?, 0)",
// // // // //       [username, typed]
// // // // //     );

// // // // //     return res.status(201).json({
// // // // //       success: true,
// // // // //       created: true,
// // // // //       player: { id: result.insertId, username, name: typed },
// // // // //     });
// // // // //   } catch (err) {
// // // // //     console.error("Enter error:", err);
// // // // //     return res.status(500).json({ success: false, error: "Server error." });
// // // // //   }
// // // // // });

// // // // // module.exports = router;
// // // // const express = require("express");
// // // // const { pool } = require("../utils/playerActivity");

// // // // const router = express.Router();

// // // // /*
// // // //   Table `player` must have:  id, name, xp, username (UNIQUE)
// // // // */

// // // // /* ------------------------- DEVICE ACCOUNT ------------------------- */
// // // // /*
// // // //   POST /api/auth/device
// // // //   Body: { "deviceId": "abc123..." }

// // // //   - known deviceId -> that device's account (same id, name, stats)
// // // //   - new deviceId   -> NEW account row (default name "Player<id>")
// // // // */
// // // // router.post("/auth/device", async (req, res) => {
// // // //   try {
// // // //     const raw = String(req.body?.deviceId || "");
// // // //     const deviceId = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);

// // // //     if (deviceId.length < 8) {
// // // //       return res
// // // //         .status(400)
// // // //         .json({ success: false, error: "A valid deviceId is required." });
// // // //     }

// // // //     const username = `dev-${deviceId}`;

// // // //     const [rows] = await pool.query(
// // // //       "SELECT id, username, name FROM player WHERE username = ?",
// // // //       [username]
// // // //     );

// // // //     if (rows.length > 0) {
// // // //       const p = rows[0];
// // // //       return res.json({
// // // //         success: true,
// // // //         created: false,
// // // //         player: { id: p.id, username: p.username, name: p.name },
// // // //       });
// // // //     }

// // // //     const [result] = await pool.query(
// // // //       "INSERT INTO player (username, name, xp) VALUES (?, ?, 0)",
// // // //       [username, "Player"]
// // // //     );

// // // //     const name = `Player${result.insertId}`;

// // // //     await pool.query("UPDATE player SET name = ? WHERE id = ?", [
// // // //       name,
// // // //       result.insertId,
// // // //     ]);

// // // //     return res.status(201).json({
// // // //       success: true,
// // // //       created: true,
// // // //       player: { id: result.insertId, username, name },
// // // //     });
// // // //   } catch (err) {
// // // //     console.error("Device account error:", err);
// // // //     return res.status(500).json({ success: false, error: "Server error." });
// // // //   }
// // // // });

// // // // /* ------------------------- ENTER (name only) ----------------------- */
// // // // /*
// // // //   POST /api/auth/enter
// // // //   Body: { "name": "Arun" }
// // // //   same name -> same account, new name -> new account
// // // // */
// // // // router.post("/auth/enter", async (req, res) => {
// // // //   try {
// // // //     const typed = String(req.body?.name || "").trim();

// // // //     if (typed.length < 2 || typed.length > 30) {
// // // //       return res
// // // //         .status(400)
// // // //         .json({ success: false, error: "Name must be 2-30 characters." });
// // // //     }

// // // //     const username = typed.toLowerCase();

// // // //     const [rows] = await pool.query(
// // // //       "SELECT id, username, name FROM player WHERE username = ?",
// // // //       [username]
// // // //     );

// // // //     if (rows.length > 0) {
// // // //       const p = rows[0];
// // // //       return res.json({
// // // //         success: true,
// // // //         created: false,
// // // //         player: { id: p.id, username: p.username, name: p.name },
// // // //       });
// // // //     }

// // // //     const [result] = await pool.query(
// // // //       "INSERT INTO player (username, name, xp) VALUES (?, ?, 0)",
// // // //       [username, typed]
// // // //     );

// // // //     return res.status(201).json({
// // // //       success: true,
// // // //       created: true,
// // // //       player: { id: result.insertId, username, name: typed },
// // // //     });
// // // //   } catch (err) {
// // // //     console.error("Enter error:", err);
// // // //     return res.status(500).json({ success: false, error: "Server error." });
// // // //   }
// // // // });

// // // // module.exports = router;
// // // const express = require("express");
// // // const { pool } = require("../utils/playerActivity");

// // // const router = express.Router();

// // // /*
// // //   PLAYER ACCOUNT FLOW

// // //   Frontend
// // //       ↓
// // //   POST /api/auth/enter
// // //       ↓
// // //   MySQL player table
// // //       ↓
// // //   Find existing player OR create player
// // //       ↓
// // //   Return the REAL player.id
// // //       ↓
// // //   Frontend stores player.id
// // //       ↓
// // //   GET /api/player?playerId=<REAL_ID>
// // // */


// // // /* ================================================================
// // //    Helper: Get player by ID
// // // ================================================================ */

// // // async function getPlayerById(playerId) {
// // //   const [rows] = await pool.query(
// // //     `
// // //     SELECT
// // //       id,
// // //       username,
// // //       name,
// // //       xp
// // //     FROM player
// // //     WHERE id = ?
// // //     LIMIT 1
// // //     `,
// // //     [playerId]
// // //   );

// // //   return rows.length > 0 ? rows[0] : null;
// // // }


// // // /* ================================================================
// // //    DEVICE ACCOUNT
// // //    POST /api/auth/device
// // // ================================================================ */

// // // router.post("/auth/device", async (req, res) => {
// // //   try {
// // //     const raw = String(req.body?.deviceId || "");

// // //     const deviceId = raw
// // //       .replace(/[^a-zA-Z0-9_-]/g, "")
// // //       .slice(0, 40);

// // //     if (deviceId.length < 8) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: "A valid deviceId is required.",
// // //       });
// // //     }

// // //     const username = `dev-${deviceId}`;

// // //     console.log("DEVICE LOGIN");
// // //     console.log("username:", username);

// // //     /* ------------------------------------------------------------
// // //        Check existing account
// // //     ------------------------------------------------------------ */

// // //     const [rows] = await pool.query(
// // //       `
// // //       SELECT id, username, name, xp
// // //       FROM player
// // //       WHERE username = ?
// // //       LIMIT 1
// // //       `,
// // //       [username]
// // //     );

// // //     if (rows.length > 0) {
// // //       const player = rows[0];

// // //       console.log("Existing device player:", player);

// // //       return res.status(200).json({
// // //         success: true,
// // //         created: false,
// // //         player: {
// // //           id: player.id,
// // //           username: player.username,
// // //           name: player.name,
// // //           xp: player.xp,
// // //         },
// // //       });
// // //     }

// // //     /* ------------------------------------------------------------
// // //        Create new account
// // //     ------------------------------------------------------------ */

// // //     const [result] = await pool.query(
// // //       `
// // //       INSERT INTO player
// // //         (username, name, xp)
// // //       VALUES
// // //         (?, ?, ?)
// // //       `,
// // //       [username, "Player", 0]
// // //     );

// // //     const playerId = result.insertId;

// // //     console.log("Created player ID:", playerId);

// // //     /* ------------------------------------------------------------
// // //        Give default name
// // //     ------------------------------------------------------------ */

// // //     const defaultName = `Player${playerId}`;

// // //     await pool.query(
// // //       `
// // //       UPDATE player
// // //       SET name = ?
// // //       WHERE id = ?
// // //       `,
// // //       [defaultName, playerId]
// // //     );

// // //     /* ------------------------------------------------------------
// // //        IMPORTANT:
// // //        Read the account again from DB.
// // //        This guarantees the ID actually exists.
// // //     ------------------------------------------------------------ */

// // //     const player = await getPlayerById(playerId);

// // //     if (!player) {
// // //       console.error(
// // //         "ERROR: Player was inserted but could not be read back.",
// // //         playerId
// // //       );

// // //       return res.status(500).json({
// // //         success: false,
// // //         error: "Player account could not be verified after creation.",
// // //       });
// // //     }

// // //     console.log("Verified new device player:", player);

// // //     return res.status(201).json({
// // //       success: true,
// // //       created: true,
// // //       player: {
// // //         id: player.id,
// // //         username: player.username,
// // //         name: player.name,
// // //         xp: player.xp,
// // //       },
// // //     });
// // //   } catch (err) {
// // //     console.error("Device account error:", err);

// // //     return res.status(500).json({
// // //       success: false,
// // //       error: "Server error while creating device account.",
// // //     });
// // //   }
// // // });


// // // /* ================================================================
// // //    ENTER WITH NAME
// // //    POST /api/auth/enter

// // //    Body:
// // //    {
// // //      "name": "Suba"
// // //    }

// // //    Response:
// // //    {
// // //      "success": true,
// // //      "created": false,
// // //      "player": {
// // //        "id": 2,
// // //        "username": "suba",
// // //        "name": "Suba",
// // //        "xp": 0
// // //      }
// // //    }
// // // ================================================================ */

// // // router.post("/auth/enter", async (req, res) => {
// // //   try {
// // //     const typed = String(req.body?.name || "").trim();

// // //     console.log("------------------------------------");
// // //     console.log("POST /api/auth/enter");
// // //     console.log("Received name:", typed);

// // //     /* ------------------------------------------------------------
// // //        Validate name
// // //     ------------------------------------------------------------ */

// // //     if (typed.length < 2 || typed.length > 30) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         error: "Name must be 2-30 characters.",
// // //       });
// // //     }

// // //     /*
// // //       username is used as the unique account key.
// // //       Example:

// // //       Suba
// // //       ↓
// // //       suba
// // //     */

// // //     const username = typed.toLowerCase();

// // //     console.log("Username:", username);


// // //     /* ------------------------------------------------------------
// // //        STEP 1
// // //        Search player table
// // //     ------------------------------------------------------------ */

// // //     const [rows] = await pool.query(
// // //       `
// // //       SELECT
// // //         id,
// // //         username,
// // //         name,
// // //         xp
// // //       FROM player
// // //       WHERE username = ?
// // //       LIMIT 1
// // //       `,
// // //       [username]
// // //     );

// // //     /* ------------------------------------------------------------
// // //        STEP 2
// // //        Existing account
// // //     ------------------------------------------------------------ */

// // //     if (rows.length > 0) {
// // //       const player = rows[0];

// // //       console.log("Existing player found:");
// // //       console.log(player);

// // //       /*
// // //         Verify the ID one more time.
// // //       */

// // //       const verifiedPlayer = await getPlayerById(player.id);

// // //       if (!verifiedPlayer) {
// // //         console.error(
// // //           "Player returned by username lookup but ID cannot be found:",
// // //           player.id
// // //         );

// // //         return res.status(500).json({
// // //           success: false,
// // //           error: "Player account verification failed.",
// // //         });
// // //       }

// // //       console.log("Verified player:");
// // //       console.log(verifiedPlayer);

// // //       return res.status(200).json({
// // //         success: true,
// // //         created: false,
// // //         player: {
// // //           id: verifiedPlayer.id,
// // //           username: verifiedPlayer.username,
// // //           name: verifiedPlayer.name,
// // //           xp: verifiedPlayer.xp,
// // //         },
// // //       });
// // //     }


// // //     /* ------------------------------------------------------------
// // //        STEP 3
// // //        Create new account
// // //     ------------------------------------------------------------ */

// // //     console.log("Player does not exist. Creating account...");

// // //     const [result] = await pool.query(
// // //       `
// // //       INSERT INTO player
// // //         (username, name, xp)
// // //       VALUES
// // //         (?, ?, ?)
// // //       `,
// // //       [username, typed, 0]
// // //     );

// // //     const playerId = result.insertId;

// // //     console.log("New player ID:", playerId);


// // //     /* ------------------------------------------------------------
// // //        STEP 4
// // //        Read newly-created account from DB
// // //     ------------------------------------------------------------ */

// // //     const player = await getPlayerById(playerId);

// // //     if (!player) {
// // //       console.error(
// // //         "CRITICAL: INSERT succeeded but player cannot be found.",
// // //         {
// // //           insertId: playerId,
// // //           username,
// // //         }
// // //       );

// // //       return res.status(500).json({
// // //         success: false,
// // //         error: "Player account was created but could not be verified.",
// // //       });
// // //     }


// // //     /* ------------------------------------------------------------
// // //        STEP 5
// // //        Send REAL DB player ID to frontend
// // //     ------------------------------------------------------------ */

// // //     console.log("Final player response:");
// // //     console.log(player);

// // //     console.log("------------------------------------");

// // //     return res.status(201).json({
// // //       success: true,
// // //       created: true,
// // //       player: {
// // //         id: player.id,
// // //         username: player.username,
// // //         name: player.name,
// // //         xp: player.xp,
// // //       },
// // //     });

// // //   } catch (err) {
// // //     console.error("Enter error:", err);

// // //     /*
// // //       Duplicate username protection.
// // //     */

// // //     if (err.code === "ER_DUP_ENTRY") {
// // //       try {
// // //         const typed = String(req.body?.name || "").trim();
// // //         const username = typed.toLowerCase();

// // //         const [rows] = await pool.query(
// // //           `
// // //           SELECT
// // //             id,
// // //             username,
// // //             name,
// // //             xp
// // //           FROM player
// // //           WHERE username = ?
// // //           LIMIT 1
// // //           `,
// // //           [username]
// // //         );

// // //         if (rows.length > 0) {
// // //           const player = rows[0];

// // //           return res.status(200).json({
// // //             success: true,
// // //             created: false,
// // //             player: {
// // //               id: player.id,
// // //               username: player.username,
// // //               name: player.name,
// // //               xp: player.xp,
// // //             },
// // //           });
// // //         }
// // //       } catch (duplicateErr) {
// // //         console.error(
// // //           "Duplicate recovery error:",
// // //           duplicateErr
// // //         );
// // //       }
// // //     }

// // //     return res.status(500).json({
// // //       success: false,
// // //       error: "Server error while entering account.",
// // //     });
// // //   }
// // // });


// // // module.exports = router;
// // const express = require("express");
// // const router = express.Router();
// // const db = require("../db"); // your db.js (mysql2 promise pool)

// // // deviceId comes from the frontend (UUID saved in the browser)
// // const DEVICE_REGEX = /^[A-Za-z0-9-]{8,64}$/;

// // const randomName = (prefix) =>
// //   `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;

// // // Find the player for this device, or create a new one
// // async function findOrCreate(deviceId, type, prefix) {
// //   const [rows] = await db.query(
// //     "SELECT id, name, type FROM app_users WHERE device_id = ? AND type = ?",
// //     [deviceId, type]
// //   );

// //   if (rows.length > 0) {
// //     await db.query("UPDATE app_users SET last_login = NOW() WHERE id = ?", [
// //       rows[0].id,
// //     ]);
// //     return { player: rows[0], isNew: false };
// //   }

// //   const name = randomName(prefix);
// //   const [result] = await db.query(
// //     "INSERT INTO app_users (device_id, type, name) VALUES (?, ?, ?)",
// //     [deviceId, type, name]
// //   );
// //   return { player: { id: result.insertId, name, type }, isNew: true };
// // }

// // // Shared handler for both buttons
// // const handle = (type, prefix) => async (req, res) => {
// //   try {
// //     const { deviceId } = req.body || {};

// //     // 1. Validate the request
// //     if (typeof deviceId !== "string" || !DEVICE_REGEX.test(deviceId)) {
// //       return res
// //         .status(400)
// //         .json({ success: false, message: "Invalid device id" });
// //     }

// //     // 2. Read / save in database
// //     const { player, isNew } = await findOrCreate(deviceId, type, prefix);

// //     // 3. Send JSON response to frontend
// //     return res.json({
// //       success: true,
// //       message: isNew ? "Account created" : "Welcome back",
// //       player,
// //     });
// //   } catch (err) {
// //     console.error(`auth/${type} error:`, err);
// //     return res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// // // POST /api/auth/login   -> registered player (progress is saved)
// // router.post("/auth/login", handle("user", "Player"));

// // // POST /api/auth/guest   -> guest player
// // router.post("/auth/guest", handle("guest", "Guest"));

// // module.exports = router;

// // /*
// //   In server.js make sure you have:

// //     app.use(express.json());
// //     app.use("/api", require("./src/routes/authRoutes"));
// // */
// const express = require("express");
// const router = express.Router();
// const db = require("../db"); // same db.js (mysql2 promise pool)

// // deviceId is created by the app (letters + numbers)
// const DEVICE_REGEX = /^[A-Za-z0-9-]{8,64}$/;

// const randomName = (prefix) =>
//   `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;

// /*
//   Uses the SAME `player` table as the rest of the game, so progress,
//   coins, levels etc. stay connected to the player id.

//   Login  -> player.device_id = deviceId
//   Guest  -> player.device_id = "guest-" + deviceId   (separate guest account)
// */
// async function findOrCreate(deviceKey, prefix) {
//   const [rows] = await db.query(
//     "SELECT id, name FROM player WHERE device_id = ? LIMIT 1",
//     [deviceKey]
//   );

//   if (rows.length > 0) {
//     return { player: { id: rows[0].id, name: rows[0].name }, isNew: false };
//   }

//   const name = randomName(prefix);
//   const [result] = await db.query(
//     "INSERT INTO player (name, device_id) VALUES (?, ?)",
//     [name, deviceKey]
//   );

//   return { player: { id: result.insertId, name }, isNew: true };
// }

// const handle = (type, prefix, keyOf) => async (req, res) => {
//   try {
//     const { deviceId } = req.body || {};

//     // 1. Validate request
//     if (typeof deviceId !== "string" || !DEVICE_REGEX.test(deviceId)) {
//       return res.status(400).json({ success: false, error: "Invalid device id" });
//     }

//     // 2. Read / save in database
//     const { player, isNew } = await findOrCreate(keyOf(deviceId), prefix);

//     // 3. JSON response to frontend
//     return res.json({
//       success: true,
//       message: isNew ? "Account created" : "Welcome back",
//       player: { ...player, type },
//     });
//   } catch (err) {
//     console.error(`auth/${type} error:`, err);
//     return res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // POST /api/auth/login
// router.post("/auth/login", handle("user", "Player", (d) => d));

// // POST /api/auth/guest
// router.post("/auth/guest", handle("guest", "Guest", (d) => `guest-${d}`));

// // POST /api/auth/register  (Create Your Account / Login form)
// // Needs columns on `player`: dob, gender, phone
// router.post("/auth/register", async (req, res) => {
//   try {
//     const { deviceId, username, dob, gender, phone } = req.body || {};

//     // 1. Validate request
//     if (typeof deviceId !== "string" || !DEVICE_REGEX.test(deviceId)) {
//       return res.status(400).json({ success: false, error: "Invalid device id" });
//     }

//     const name =
//       typeof username === "string" ? username.trim().replace(/\s+/g, " ") : "";
//     if (name.length < 2 || name.length > 20 || !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name)) {
//       return res.status(400).json({
//         success: false,
//         error: "Username must be 2-20 letters only",
//       });
//     }

//     if (typeof dob !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
//       return res.status(400).json({ success: false, error: "Invalid date of birth" });
//     }
//     const dobDate = new Date(`${dob}T00:00:00Z`);
//     if (
//       Number.isNaN(dobDate.getTime()) ||
//       dobDate.toISOString().slice(0, 10) !== dob ||
//       dobDate.getTime() > Date.now() ||
//       dobDate.getUTCFullYear() < 1900
//     ) {
//       return res.status(400).json({ success: false, error: "Invalid date of birth" });
//     }

//     if (!["Male", "Female", "Other"].includes(gender)) {
//       return res.status(400).json({ success: false, error: "Invalid gender" });
//     }

//     if (typeof phone !== "string" || !/^\+91[6-9]\d{9}$/.test(phone)) {
//       return res.status(400).json({ success: false, error: "Invalid phone number" });
//     }

//     // 2. Same phone already registered -> log that player in
//     const [byPhone] = await db.query(
//       "SELECT id, name FROM player WHERE phone = ? LIMIT 1",
//       [phone]
//     );
//     if (byPhone.length > 0) {
//       return res.json({
//         success: true,
//         message: "Welcome back",
//         player: { id: byPhone[0].id, name: byPhone[0].name, type: "user" },
//       });
//     }

//     // 3. This device already has a player row (auto-created) -> complete it
//     const [byDevice] = await db.query(
//       "SELECT id, phone FROM player WHERE device_id = ? LIMIT 1",
//       [deviceId]
//     );

//     if (byDevice.length > 0 && !byDevice[0].phone) {
//       await db.query(
//         "UPDATE player SET name = ?, dob = ?, gender = ?, phone = ? WHERE id = ?",
//         [name, dob, gender, phone, byDevice[0].id]
//       );
//       return res.json({
//         success: true,
//         message: "Account created",
//         player: { id: byDevice[0].id, name, type: "user" },
//       });
//     }

//     // 4. New player (if device id is taken by another account, make it unique)
//     const deviceKey = byDevice.length > 0 ? `${deviceId}-${phone.slice(3)}` : deviceId;
//     const [result] = await db.query(
//       "INSERT INTO player (name, device_id, dob, gender, phone) VALUES (?, ?, ?, ?, ?)",
//       [name, deviceKey, dob, gender, phone]
//     );

//     // 5. JSON response to frontend
//     return res.json({
//       success: true,
//       message: "Account created",
//       player: { id: result.insertId, name, type: "user" },
//     });
//   } catch (err) {
//     console.error("auth/register error:", err);
//     return res.status(500).json({ success: false, error: "Server error" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../db"); // same db.js (mysql2 promise pool)

// deviceId is created by the app (letters + numbers)
const DEVICE_REGEX = /^[A-Za-z0-9-]{8,64}$/;

const randomName = (prefix) =>
  `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;

/*
  Uses the SAME `player` table as the rest of the game, so progress,
  coins, levels etc. stay connected to the player id.

  Login  -> player.device_id = deviceId
  Guest  -> player.device_id = "guest-" + deviceId   (separate guest account)
*/
async function findOrCreate(deviceKey, prefix) {
  const [rows] = await db.query(
    "SELECT id, name FROM player WHERE device_id = ? LIMIT 1",
    [deviceKey]
  );

  if (rows.length > 0) {
    return { player: { id: rows[0].id, name: rows[0].name }, isNew: false };
  }

  const name = randomName(prefix);
  const [result] = await db.query(
    "INSERT INTO player (name, device_id) VALUES (?, ?)",
    [name, deviceKey]
  );

  return { player: { id: result.insertId, name }, isNew: true };
}

const handle = (type, prefix, keyOf) => async (req, res) => {
  try {
    const { deviceId } = req.body || {};

    // 1. Validate request
    if (typeof deviceId !== "string" || !DEVICE_REGEX.test(deviceId)) {
      return res.status(400).json({ success: false, error: "Invalid device id" });
    }

    // 2. Read / save in database
    const { player, isNew } = await findOrCreate(keyOf(deviceId), prefix);

    // 3. JSON response to frontend
    return res.json({
      success: true,
      message: isNew ? "Account created" : "Welcome back",
      player: { ...player, type },
    });
  } catch (err) {
    console.error(`auth/${type} error:`, err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// POST /api/auth/login
router.post("/auth/login", handle("user", "Player", (d) => d));

// POST /api/auth/guest  (nickname typed by the user is saved as player name)
router.post("/auth/guest", async (req, res) => {
  try {
    const { deviceId, nickname } = req.body || {};

    // 1. Validate request
    if (typeof deviceId !== "string" || !DEVICE_REGEX.test(deviceId)) {
      return res.status(400).json({ success: false, error: "Invalid device id" });
    }

    const name =
      typeof nickname === "string" ? nickname.trim().replace(/\s+/g, " ") : "";

    if (name.length < 2 || name.length > 20 || !/^[A-Za-z0-9_ ]+$/.test(name)) {
      return res.status(400).json({
        success: false,
        error: "Nickname must be 2-20 characters (letters, numbers, _ only)",
      });
    }

    // 2. Guest account is separate: device_id = "guest-" + deviceId
    const deviceKey = `guest-${deviceId}`;

    const [rows] = await db.query(
      "SELECT id FROM player WHERE device_id = ? LIMIT 1",
      [deviceKey]
    );

    let playerId;
    let isNew = false;

    if (rows.length > 0) {
      // existing guest -> update the name with the new nickname
      playerId = rows[0].id;
      await db.query("UPDATE player SET name = ? WHERE id = ?", [name, playerId]);
    } else {
      const [result] = await db.query(
        "INSERT INTO player (name, device_id) VALUES (?, ?)",
        [name, deviceKey]
      );
      playerId = result.insertId;
      isNew = true;
    }

    // 3. JSON response to frontend
    return res.json({
      success: true,
      message: isNew ? "Account created" : "Welcome back",
      player: { id: playerId, name, type: "guest" },
    });
  } catch (err) {
    console.error("auth/guest error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// POST /api/auth/register  (Create Your Account / Login form)
// Needs columns on `player`: dob, gender, phone
router.post("/auth/register", async (req, res) => {
  try {
    const { deviceId, username, dob, gender, phone } = req.body || {};

    // 1. Validate request
    if (typeof deviceId !== "string" || !DEVICE_REGEX.test(deviceId)) {
      return res.status(400).json({ success: false, error: "Invalid device id" });
    }

    const name =
      typeof username === "string" ? username.trim().replace(/\s+/g, " ") : "";
    if (name.length < 2 || name.length > 20 || !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name)) {
      return res.status(400).json({
        success: false,
        error: "Username must be 2-20 letters only",
      });
    }

    if (typeof dob !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return res.status(400).json({ success: false, error: "Invalid date of birth" });
    }
    const dobDate = new Date(`${dob}T00:00:00Z`);
    if (
      Number.isNaN(dobDate.getTime()) ||
      dobDate.toISOString().slice(0, 10) !== dob ||
      dobDate.getTime() > Date.now() ||
      dobDate.getUTCFullYear() < 1900
    ) {
      return res.status(400).json({ success: false, error: "Invalid date of birth" });
    }

    if (!["Male", "Female", "Other"].includes(gender)) {
      return res.status(400).json({ success: false, error: "Invalid gender" });
    }

    if (typeof phone !== "string" || !/^\+91[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, error: "Invalid phone number" });
    }

    // 2. Same phone already registered -> log that player in
    const [byPhone] = await db.query(
      "SELECT id, name FROM player WHERE phone = ? LIMIT 1",
      [phone]
    );
    if (byPhone.length > 0) {
      return res.json({
        success: true,
        message: "Welcome back",
        player: { id: byPhone[0].id, name: byPhone[0].name, type: "user" },
      });
    }

    // 3. This device already has a player row (auto-created) -> complete it
    const [byDevice] = await db.query(
      "SELECT id, phone FROM player WHERE device_id = ? LIMIT 1",
      [deviceId]
    );

    if (byDevice.length > 0 && !byDevice[0].phone) {
      await db.query(
        "UPDATE player SET name = ?, dob = ?, gender = ?, phone = ? WHERE id = ?",
        [name, dob, gender, phone, byDevice[0].id]
      );
      return res.json({
        success: true,
        message: "Account created",
        player: { id: byDevice[0].id, name, type: "user" },
      });
    }

    // 4. New player (if device id is taken by another account, make it unique)
    const deviceKey = byDevice.length > 0 ? `${deviceId}-${phone.slice(3)}` : deviceId;
    const [result] = await db.query(
      "INSERT INTO player (name, device_id, dob, gender, phone) VALUES (?, ?, ?, ?, ?)",
      [name, deviceKey, dob, gender, phone]
    );

    // 5. JSON response to frontend
    return res.json({
      success: true,
      message: "Account created",
      player: { id: result.insertId, name, type: "user" },
    });
  } catch (err) {
    console.error("auth/register error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});
router.post("/auth/device", handle("user", "Player", (d) => d));
module.exports = router;