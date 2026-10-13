const express = require("express");
const { getOrCreateRound } = require("../controllers/puzzleController");

const router = express.Router();
router.post("/round", getOrCreateRound);

module.exports = router;

// In your server.js / app.js add:
//   const puzzleRoutes = require("./routes/puzzleRoutes");
//   app.use("/api/wordscramble", puzzleRoutes);
//
// ---------------------------------------------------------------
// Frontend (src/api/Wordscrambleapi.ts) - add next to submitAnswer,
// and reuse whatever base URL that file already uses:
//
// export const fetchRound = async (roomId: string, roundNumber: number, totalRounds = 5) => {
//   const res = await fetch(`${API_BASE_URL}/api/wordscramble/round`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ roomId, roundNumber, totalRounds }),
//   });
//   if (!res.ok) throw new Error("Failed to load round");
//   return res.json(); // { id, roundNumber, totalRounds, timeLimitSec, letters, words, bonusCount }
// };