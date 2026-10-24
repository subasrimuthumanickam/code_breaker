const express = require("express");
const { pool } = require("../utils/playerActivity");

const router = express.Router();


router.post("/auth/logout", async (req, res) => {
  try {
    console.log("\n========== POST /api/auth/logout ==========");
    console.log("Request body:", req.body);

    const playerId = Number(req.body?.playerId);

    if (!Number.isInteger(playerId) || playerId <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "playerId is required." });
    }

    const [result] = await pool.query(
      "UPDATE player SET last_logout = NOW() WHERE id = ?",
      [playerId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Player not found." });
    }

    console.log(`PLAYER ${playerId} LOGGED OUT`);

    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    console.error("POST /auth/logout error:", err);

    if (res.headersSent) return;

    return res.status(500).json({ success: false, error: "Logout failed." });
  }
});

module.exports = router;

/*
  Mount it in your main server file (same place as the other routers):

  app.use("/api", require("./routes/authLogout"));
*/