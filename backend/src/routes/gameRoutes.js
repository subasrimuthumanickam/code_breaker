// // // // const express = require("express");
// // // // const router = express.Router();
// // // // const {
// // // //   startGame,
// // // //   getGame,
// // // //   submitGuess,
// // // //   getStats,
// // // //   getHighScore,
// // // // } = require("../controllers/gameController");

// // // // // Express 4 doesn't forward rejected promises to the error handler on its own —
// // // // // this wrapper catches them so a DB error returns JSON instead of hanging/crashing.
// // // // const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// // // // router.post("/game/start", wrap(startGame));
// // // // router.get("/games/:gameId", wrap(getGame));
// // // // router.post("/games/:gameId/guess", wrap(submitGuess));
// // // // router.get("/stats", wrap(getStats));
// // // // router.get("/highscore", wrap(getHighScore));

// // // // module.exports = router;
// // // const express = require("express");
// // // const router = express.Router();
// // // const {
// // //   startGame,
// // //   getGame,
// // //   submitGuess,
// // //   getStats,
// // //   getHighScore,
// // // } = require("../controllers/gameController");

// // // // Express 4 doesn't forward rejected promises to the error handler on its own —
// // // // this wrapper catches them so a DB error returns JSON instead of hanging/crashing.
// // // const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// // // router.post("/games/start", wrap(startGame));
// // // router.get("/games/:gameId", wrap(getGame));
// // // router.post("/games/:gameId/guess", wrap(submitGuess));
// // // router.get("/stats", wrap(getStats));
// // // router.get("/highscore", wrap(getHighScore));

// // // module.exports = router;
// // const express = require("express");
// // const router = express.Router();
// // const {
// //   startGame,
// //   getGame,
// //   submitGuess,
// //   checkDigit,
// //   getStats,
// //   getHighScore,
// // } = require("../controllers/gameController");

// // // Express 4 doesn't forward rejected promises to the error handler on its own —
// // // this wrapper catches them so a DB error returns JSON instead of hanging/crashing.
// // const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// // router.post("/games/start", wrap(startGame));
// // router.get("/games/:gameId", wrap(getGame));
// // router.post("/games/:gameId/guess", wrap(submitGuess));
// // router.post("/games/:gameId/check-digit", wrap(checkDigit));
// // router.get("/stats", wrap(getStats));
// // router.get("/highscore", wrap(getHighScore));

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const game = require("../controllers/gameController");

// router.post("/start", game.startGame);
// router.get("/progress/:playerId", game.getProgress); // keep ABOVE "/:id"
// router.post("/:id/guess", game.submitGuess);
// router.get("/:id", game.getGame);

// module.exports = router;

// // In server.js make sure this line exists (same as before):
// //   app.use("/games", require("./routes/gameRoutes"));
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