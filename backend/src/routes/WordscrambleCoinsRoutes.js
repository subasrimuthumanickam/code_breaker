// const express = require("express");
// const c = require("../controllers/wordScrambleCoinsController");
// const router = express.Router();

// router.get("/:playerName", c.getCoins);
// router.post("/gift", c.claimGift);
// router.post("/hint", c.spendHint);
// router.post("/level-complete", c.levelComplete);

// module.exports = router;

// // In server.js add (use the same prefix style as your other wordscramble routes):
// //   app.use("/api/wordscramble/coins", require("./routes/wordscrambleCoinsRoutes"));
const express = require("express");
const c = require("../controllers/wordScrambleCoinsController");

const router = express.Router();

// specific paths first, "/:playerName" last
router.get("/spin/config", c.spinConfig);
router.post("/spin", c.spin);
router.post("/time-boost", c.timeBoost);
router.post("/hint", c.spendHint);
router.post("/level-complete", c.levelComplete);
router.get("/:playerName", c.getCoins);

module.exports = router;