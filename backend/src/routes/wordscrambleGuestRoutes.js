// backend/src/routes/wordscrambleGuestRoutes.js
//
// POST /api/wordscramble/guest
//   body:     { nickname: "Guest1234" }
//   response: { success: true, guest: { name: "Guest1234" } }
//
// Saves the guest nickname in MySQL (table ws_guests, created automatically).
// Guests do NOT get a `player` account, so they never appear on the leaderboard
// and never touch the real players' stats.

const db = require("../db");

db.query(
  `CREATE TABLE IF NOT EXISTS ws_guests (
     name       VARCHAR(30) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     last_seen  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     PRIMARY KEY (name)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
).catch((err) => console.warn("[wordscramble] could not create ws_guests:", err.message));

module.exports = function registerGuestRoutes(router) {
  router.post("/guest", async (req, res) => {
    try {
      const nickname = String(req.body?.nickname || "")
        .trim()
        .replace(/\s+/g, " ");

      if (nickname.length < 2 || nickname.length > 16) {
        return res.status(400).json({
          success: false,
          error: "Nickname must be 2 to 16 characters.",
        });
      }

      console.log("GUEST ENTER:", nickname);

      await db.query(
        `INSERT INTO ws_guests (name) VALUES (?)
         ON DUPLICATE KEY UPDATE last_seen = CURRENT_TIMESTAMP`,
        [nickname]
      );

      return res.status(200).json({
        success: true,
        guest: { name: nickname },
      });
    } catch (err) {
      console.error("Guest enter error:", err);
      return res.status(500).json({
        success: false,
        error: "Server error while saving guest.",
      });
    }
  });
};