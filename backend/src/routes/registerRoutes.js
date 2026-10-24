const express = require("express");

// db.js exports the mysql2/promise pool
const dbModule = require("../db");
const pool = dbModule.pool || dbModule.default || dbModule;

const router = express.Router();

// const NAME_REGEX = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const NAME_REGEX = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

// const PHONE_REGEX = /^\+91[6-9]\d{9}$/;
const PHONE_REGEX = /^\+91[6-9]\d{9}$/;
const GENDERS = ["Male", "Female", "Other"];


let schemaPromise = null;

function ensureSchema() {
  if (schemaPromise) return schemaPromise;

  schemaPromise = (async () => {
    const [rows] = await pool.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'player'`
    );

    const have = rows.map((r) => r.COLUMN_NAME.toLowerCase());

    const add = async (name, ddl) => {
      if (!have.includes(name.toLowerCase())) {
        await pool.query(`ALTER TABLE player ADD COLUMN ${ddl}`);
        have.push(name.toLowerCase());
        console.log(`DB: added player.${name}`);
      }
    };

    await add("dob", "dob DATE NULL");
    await add("gender", "gender VARCHAR(10) NULL");
    await add("phone", "phone VARCHAR(20) NULL");
    await add("type", "type VARCHAR(20) NULL");

    let deviceCol = null;
    if (have.includes("device_id")) deviceCol = "device_id";
    else if (have.includes("deviceid")) deviceCol = "deviceId";
    else {
      await add("device_id", "device_id VARCHAR(100) NULL");
      deviceCol = "device_id";
    }

    return { deviceCol };
  })();

  // if it fails, allow a retry on the next request
  schemaPromise.catch(() => {
    schemaPromise = null;
  });

  return schemaPromise;
}

/* ------------------------------------------------------------------
   POST /api/auth/register
   Body: { deviceId, username, dob: "YYYY-MM-DD", gender, phone: "+91XXXXXXXXXX" }
   Reply: { success: true, player: { id, name, type: "user" } }
------------------------------------------------------------------ */
router.post("/auth/register", async (req, res) => {
  try {
    const { deviceId, username, dob, gender, phone } = req.body || {};

    const name = String(username || "").trim().replace(/\s+/g, " ");

    if (!name || name.length < 2 || name.length > 20 || !NAME_REGEX.test(name)) {
      return res
        .status(400)
        .json({ success: false, error: "Username must be 2-20 letters." });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dob || "")) || isNaN(Date.parse(dob))) {
      return res
        .status(400)
        .json({ success: false, error: "Enter a valid date of birth." });
    }

    if (!GENDERS.includes(gender)) {
      return res
        .status(400)
        .json({ success: false, error: "Please select a gender." });
    }

    if (!PHONE_REGEX.test(String(phone || ""))) {
      return res
        .status(400)
        .json({ success: false, error: "Enter a valid 10 digit phone number." });
    }

    const { deviceCol } = await ensureSchema();

    // 1) same phone number = returning user, just log them in
    const [byPhone] = await pool.query(
      "SELECT id, name FROM player WHERE phone = ? LIMIT 1",
      [phone]
    );

    if (byPhone.length > 0) {
      return res.json({
        success: true,
        player: { id: byPhone[0].id, name: byPhone[0].name, type: "user" },
      });
    }

    // 2) this device already has a guest row (no phone yet) -> upgrade it
    const [guestRows] = await pool.query(
      `SELECT id FROM player WHERE \`${deviceCol}\` = ? AND phone IS NULL
       ORDER BY id DESC LIMIT 1`,
      [deviceId || null]
    );

    let playerId;

    if (guestRows.length > 0) {
      playerId = guestRows[0].id;

      await pool.query(
        `UPDATE player SET name = ?, dob = ?, gender = ?, phone = ?, type = 'user'
         WHERE id = ?`,
        [name, dob, gender, phone, playerId]
      );
    } else {
      // 3) brand new player
      const [result] = await pool.query(
        `INSERT INTO player (name, dob, gender, phone, type, \`${deviceCol}\`)
         VALUES (?, ?, ?, ?, 'user', ?)`,
        [name, dob, gender, phone, deviceId || null]
      );

      playerId = result.insertId;
    }

    return res.json({
      success: true,
      player: { id: playerId, name, type: "user" },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        error: "That username is already taken. Try another one.",
      });
    }

    return res
      .status(500)
      .json({ success: false, error: "Server error. Please try again." });
  }
});

module.exports = router;