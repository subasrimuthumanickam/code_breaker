const express = require("express");
const router = express.Router();
const skip = require("../controllers/Skiproundcontroller");

router.get("/status/:playerName", skip.status);
router.post("/claim", skip.claim);
router.post("/use", skip.useSkip);

module.exports = router;