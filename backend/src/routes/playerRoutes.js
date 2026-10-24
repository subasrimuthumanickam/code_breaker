
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