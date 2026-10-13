// const express = require("express");
// const router = express.Router();
// const db = require("../db"); // same db.js (mysql2 promise pool)

// // deviceId is created by the app (letters + numbers)
// const DEVICE_REGEX = /^[A-Za-z0-9-]{8,64}$/;

// const randomName = (prefix) =>
//   `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;

// /*
//   Uses the SAME `player` table as the rest of the game, so progress,
//   coins, levels etc. stay connected to the player id.

//   Login  -> player.device_id = deviceId
//   Guest  -> player.device_id = "guest-" + deviceId   (separate guest account)
// */
// async function findOrCreate(deviceKey, prefix) {
//   const [rows] = await db.query(
//     "SELECT id, name FROM player WHERE device_id = ? LIMIT 1",
//     [deviceKey]
//   );

//   if (rows.length > 0) {
//     return { player: { id: rows[0].id, name: rows[0].name }, isNew: false };
//   }

//   const name = randomName(prefix);
//   const [result] = await db.query(
//     "INSERT INTO player (name, device_id) VALUES (?, ?)",
//     [name, deviceKey]
//   );

//   return { player: { id: result.insertId, name }, isNew: true };
// }

// const handle = (type, prefix, keyOf) => async (req, res) => {
//   try {
//     const { deviceId } = req.body || {};

//     // 1. Validate request
//     if (typeof deviceId !== "string" || !DEVICE_REGEX.test(deviceId)) {
//       return res.status(400).json({ success: false, error: "Invalid device id" });
//     }

//     // 2. Read / save in database
//     const { player, isNew } = await findOrCreate(keyOf(deviceId), prefix);

//     // 3. JSON response to frontend
//     return res.json({
//       success: true,
//       message: isNew ? "Account created" : "Welcome back",
//       player: { ...player, type },
//     });
//   } catch (err) {
//     console.error(`auth/${type} error:`, err);
//     return res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // POST /api/auth/login
// router.post("/auth/login", handle("user", "Player", (d) => d));

// // POST /api/auth/guest
// router.post("/auth/guest", handle("guest", "Guest", (d) => `guest-${d}`));

// module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../db"); // same db.js (mysql2 promise pool)

// deviceId is created by the app (letters + numbers)
const DEVICE_REGEX = /^[A-Za-z0-9-]{8,64}$/;

const randomName = (prefix) =>
  `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;

/*
  Uses the SAME `player` table as the rest of the game, so progress,
  coins, levels etc. stay connected to the player id.

  Login  -> player.device_id = deviceId
  Guest  -> player.device_id = "guest-" + deviceId   (separate guest account)
*/
async function findOrCreate(deviceKey, prefix) {
  const [rows] = await db.query(
    "SELECT id, name FROM player WHERE device_id = ? LIMIT 1",
    [deviceKey]
  );

  if (rows.length > 0) {
    return { player: { id: rows[0].id, name: rows[0].name }, isNew: false };
  }

  const name = randomName(prefix);
  const [result] = await db.query(
    "INSERT INTO player (name, device_id) VALUES (?, ?)",
    [name, deviceKey]
  );

  return { player: { id: result.insertId, name }, isNew: true };
}

const handle = (type, prefix, keyOf) => async (req, res) => {
  try {
    const { deviceId } = req.body || {};

    // 1. Validate request
    if (typeof deviceId !== "string" || !DEVICE_REGEX.test(deviceId)) {
      return res.status(400).json({ success: false, error: "Invalid device id" });
    }

    // 2. Read / save in database
    const { player, isNew } = await findOrCreate(keyOf(deviceId), prefix);

    // 3. JSON response to frontend
    return res.json({
      success: true,
      message: isNew ? "Account created" : "Welcome back",
      player: { ...player, type },
    });
  } catch (err) {
    console.error(`auth/${type} error:`, err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// POST /api/auth/login
router.post("/auth/login", handle("user", "Player", (d) => d));

// POST /api/auth/guest
router.post("/auth/guest", handle("guest", "Guest", (d) => `guest-${d}`));

// POST /api/auth/register  (Create Your Account / Login form)
// Needs columns on `player`: dob, gender, phone  (see player_columns.sql)
router.post("/auth/register", async (req, res) => {
  try {
    const { deviceId, username, dob, gender, phone } = req.body || {};

    // 1. Validate request
    if (typeof deviceId !== "string" || !DEVICE_REGEX.test(deviceId)) {
      return res.status(400).json({ success: false, error: "Invalid device id" });
    }

    const name =
      typeof username === "string" ? username.trim().replace(/\s+/g, " ") : "";
    if (name.length < 2 || name.length > 20 || !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name)) {
      return res.status(400).json({
        success: false,
        error: "Username must be 2-20 letters only",
      });
    }

    if (typeof dob !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return res.status(400).json({ success: false, error: "Invalid date of birth" });
    }
    const dobDate = new Date(`${dob}T00:00:00Z`);
    if (
      Number.isNaN(dobDate.getTime()) ||
      dobDate.toISOString().slice(0, 10) !== dob ||
      dobDate.getTime() > Date.now() ||
      dobDate.getUTCFullYear() < 1900
    ) {
      return res.status(400).json({ success: false, error: "Invalid date of birth" });
    }

    if (!["Male", "Female", "Other"].includes(gender)) {
      return res.status(400).json({ success: false, error: "Invalid gender" });
    }

    if (typeof phone !== "string" || !/^\+91[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, error: "Invalid phone number" });
    }

    // 2. Same phone already registered -> log that player in
    const [byPhone] = await db.query(
      "SELECT id, name FROM player WHERE phone = ? LIMIT 1",
      [phone]
    );
    if (byPhone.length > 0) {
      return res.json({
        success: true,
        message: "Welcome back",
        player: { id: byPhone[0].id, name: byPhone[0].name, type: "user" },
      });
    }

    // 3. This device already has a player row (auto-created) -> complete it
    const [byDevice] = await db.query(
      "SELECT id, phone FROM player WHERE device_id = ? LIMIT 1",
      [deviceId]
    );

    if (byDevice.length > 0 && !byDevice[0].phone) {
      await db.query(
        "UPDATE player SET name = ?, dob = ?, gender = ?, phone = ? WHERE id = ?",
        [name, dob, gender, phone, byDevice[0].id]
      );
      return res.json({
        success: true,
        message: "Account created",
        player: { id: byDevice[0].id, name, type: "user" },
      });
    }

    // 4. New player (if device id is taken by another account, make it unique)
    const deviceKey = byDevice.length > 0 ? `${deviceId}-${phone.slice(3)}` : deviceId;
    const [result] = await db.query(
      "INSERT INTO player (name, device_id, dob, gender, phone) VALUES (?, ?, ?, ?, ?)",
      [name, deviceKey, dob, gender, phone]
    );

    // 5. JSON response to frontend
    return res.json({
      success: true,
      message: "Account created",
      player: { id: result.insertId, name, type: "user" },
    });
  } catch (err) {
    console.error("auth/register error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;