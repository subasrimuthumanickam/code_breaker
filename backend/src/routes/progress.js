const express = require("express");
const router = express.Router();
const { getProgress, completeRound } = require("../controllers/progressController");

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

router.get("/progress/:deviceId", wrap(getProgress));
router.post("/progress/:deviceId/:difficulty/complete-round", wrap(completeRound));

module.exports = router;