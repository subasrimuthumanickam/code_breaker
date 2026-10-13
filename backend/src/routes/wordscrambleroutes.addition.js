/**
 * ADD to: backend/src/routes/Wordscrambleroutes.js
 * (near your other router.get/router.post calls, using whatever
 * `router` / controller import you already have in that file)
 */

const wordScrambleController = require("../controllers/wordScrambleController");

router.get(
  "/wordscramble/round/:roomCode",
  wordScrambleController.getWordHuntRound
);

router.post(
  "/wordscramble/submit-word",
  wordScrambleController.submitWord
);