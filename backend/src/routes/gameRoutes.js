
const express = require("express");
const router = express.Router();
const game = require("../controllers/gameController");

// server.js mounts this file with: app.use("/api", gameRoutes)
// so every path here MUST start with /games  ->  /api/games/...
router.post("/games/start", game.startGame);
router.get("/games/progress/:playerId", game.getProgress); // keep ABOVE "/games/:id"
router.post("/games/:id/guess", game.submitGuess);
router.get("/games/:id", game.getGame);

module.exports = router;