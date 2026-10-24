const express = require("express");
const { getOrCreateRound } = require("../controllers/puzzleController");

const router = express.Router();
router.post("/round", getOrCreateRound);

module.exports = router;

