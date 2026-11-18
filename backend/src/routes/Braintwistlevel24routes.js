
const express = require("express");
const router = express.Router();
const level24Db = require("../data/level24Db");

// Level 24 - younger sister's age.
// Progress is saved by the normal level-complete flow (map routes);
// only the hint is stored/logged in the database.
const QUESTION =
  "When I was 4 years old, my younger sister was half my age. If I am now 20 years old, how old is my younger sister?";

const OPTIONS = [
  { id: "A", text: "10 years" },
  { id: "B", text: "16 years" },
  { id: "C", text: "18 years" },
];
const CORRECT = "C"; // sister is 2 years younger -> 20 - 2 = 18

// make sure the hint tables exist when the server starts
level24Db.ensureTables().catch((e) => console.log("[L24] table setup failed:", e.message));

router.post("/start", (req, res) => {
  res.json({ success: true, sessionId: Date.now(), question: QUESTION, options: OPTIONS });
});

router.post("/answer", (req, res) => {
  const { optionId, attempts } = req.body || {};
  if (!OPTIONS.some((o) => o.id === optionId)) {
    return res.status(400).json({ success: false, error: "Invalid option" });
  }
  res.json({
    success: true,
    correct: optionId === CORRECT,
    attempts: Math.max(1, Number(attempts) || 1),
  });
});

// hint: frontend sends request -> read hint from DB -> log it -> send JSON back
router.post("/hint", async (req, res) => {
  try {
    const { playerId } = req.body || {};
    if (playerId === undefined || playerId === null || playerId === "") {
      return res.status(400).json({ success: false, error: "playerId required" });
    }
    const text = await level24Db.getHint(1);
    if (!text) {
      return res.status(404).json({ success: false, error: "Hint not found" });
    }
    await level24Db.logHint(playerId, 1);
    res.json({
      success: true,
      hintNo: 1,
      free: true,
      cost: 0,
      text,
      message: text,
    });
  } catch (e) {
    console.log("[L24] hint error:", e);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/status/:playerId", (req, res) => {
  res.json({ success: true, level: 24 });
});

module.exports = router;