// // const express = require("express");
// // const router = express.Router();
// // const db = require("../db");

// // const ADJECTIVES = ["Swift", "Clever", "Bold", "Lucky", "Quiet", "Sunny", "Brave", "Witty"];
// // const ANIMALS = ["Fox", "Otter", "Falcon", "Panda", "Wolf", "Heron", "Tiger", "Lynx"];
// // const AVATAR_COLORS = ["#F97066", "#3B82F6", "#2BC98A", "#F2B640", "#8B5CF6", "#14B8A6"];

// // function randomName() {
// //   const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
// //   const b = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
// //   const n = Math.floor(100 + Math.random() * 900);
// //   return `${a}${b}${n}`;
// // }

// // function randomColor() {
// //   return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
// // }

// // // Aggregate stats from the player's rows across all rooms they've played
// // async function getStatsForName(name) {
// //   const [rows] = await db.query(
// //     `SELECT
// //        COUNT(DISTINCT p.room_id)                                   AS games_played,
// //        COALESCE(SUM(p.score), 0)                                   AS total_score
// //      FROM word_scramble_players p
// //      WHERE p.player_name = ?`,
// //     [name]
// //   );
// //   return {
// //     gamesPlayed: Number(rows[0]?.games_played) || 0,
// //     totalScore: Number(rows[0]?.total_score) || 0,
// //   };
// // }

// // // ---------------------------------------------
// // // GET /players/:deviceId  → find or create profile
// // // ---------------------------------------------
// // router.get("/players/:deviceId", async (req, res) => {
// //   try {
// //     const { deviceId } = req.params;

// //     let [rows] = await db.query(
// //       `SELECT * FROM word_scramble_profiles WHERE device_id = ? LIMIT 1`,
// //       [deviceId]
// //     );

// //     if (rows.length === 0) {
// //       const name = randomName();
// //       const avatarColor = randomColor();
// //       const [result] = await db.query(
// //         `INSERT INTO word_scramble_profiles (device_id, name, avatar_color) VALUES (?, ?, ?)`,
// //         [deviceId, name, avatarColor]
// //       );
// //       rows = [{ id: result.insertId, device_id: deviceId, name, avatar_color: avatarColor }];
// //     }

// //     const profile = rows[0];
// //     const stats = await getStatsForName(profile.name);

// //     return res.status(200).json({
// //       success: true,
// //       profile: {
// //         id: profile.id,
// //         name: profile.name,
// //         avatarColor: profile.avatar_color,
// //         gamesPlayed: stats.gamesPlayed,
// //         wins: 0, // TODO: wire up once you have a "win" definition per room
// //         totalScore: stats.totalScore,
// //         rank: null,
// //       },
// //     });
// //   } catch (err) {
// //     console.error("Get profile error:", err);
// //     return res.status(500).json({ error: "Failed to fetch profile" });
// //   }
// // });

// // // ---------------------------------------------
// // // PUT /players/:deviceId   body: { name }
// // // ---------------------------------------------
// // router.put("/players/:deviceId", async (req, res) => {
// //   try {
// //     const { deviceId } = req.params;
// //     const { name } = req.body;

// //     if (!name || !name.trim()) {
// //       return res.status(400).json({ error: "name is required" });
// //     }

// //     const [existing] = await db.query(
// //       `SELECT * FROM word_scramble_profiles WHERE device_id = ? LIMIT 1`,
// //       [deviceId]
// //     );
// //     if (existing.length === 0) {
// //       return res.status(404).json({ error: "Profile not found" });
// //     }

// //     await db.query(
// //       `UPDATE word_scramble_profiles SET name = ? WHERE device_id = ?`,
// //       [name.trim(), deviceId]
// //     );

// //     const [rows] = await db.query(
// //       `SELECT * FROM word_scramble_profiles WHERE device_id = ? LIMIT 1`,
// //       [deviceId]
// //     );
// //     const profile = rows[0];
// //     const stats = await getStatsForName(profile.name);

// //     return res.status(200).json({
// //       success: true,
// //       profile: {
// //         id: profile.id,
// //         name: profile.name,
// //         avatarColor: profile.avatar_color,
// //         gamesPlayed: stats.gamesPlayed,
// //         wins: 0,
// //         totalScore: stats.totalScore,
// //         rank: null,
// //       },
// //     });
// //   } catch (err) {
// //     console.error("Update profile error:", err);
// //     return res.status(500).json({ error: "Failed to update profile" });
// //   }
// // });

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const db = require("../db");

// const ADJECTIVES = ["Swift", "Clever", "Bold", "Lucky", "Quiet", "Sunny", "Brave", "Witty"];
// const ANIMALS = ["Fox", "Otter", "Falcon", "Panda", "Wolf", "Heron", "Tiger", "Lynx"];
// const AVATAR_COLORS = ["#F97066", "#3B82F6", "#2BC98A", "#F2B640", "#8B5CF6", "#14B8A6"];
// const NAME_MAX = 30;

// function randomName() {
//   const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
//   const b = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
//   const n = Math.floor(100 + Math.random() * 900);
//   return `${a}${b}${n}`;
// }

// function randomColor() {
//   return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
// }

// function cleanName(value) {
//   if (typeof value !== "string") return "";
//   return value.trim().slice(0, NAME_MAX);
// }

// // Aggregate stats from the player's rows across all rooms they've played
// async function getStatsForName(name) {
//   const [rows] = await db.query(
//     `SELECT
//        COUNT(DISTINCT p.room_id)  AS games_played,
//        COALESCE(SUM(p.score), 0)  AS total_score
//      FROM word_scramble_players p
//      WHERE p.player_name = ?`,
//     [name]
//   );
//   return {
//     gamesPlayed: Number(rows[0]?.games_played) || 0,
//     totalScore: Number(rows[0]?.total_score) || 0,
//   };
// }

// // Rename profile + keep old game rows linked to the new name
// async function applyName(deviceId, oldName, newName) {
//   await db.query(
//     `UPDATE word_scramble_profiles SET name = ? WHERE device_id = ?`,
//     [newName, deviceId]
//   );
//   if (oldName && oldName !== newName) {
//     await db.query(
//       `UPDATE word_scramble_players SET player_name = ? WHERE player_name = ?`,
//       [newName, oldName]
//     );
//   }
// }

// function buildProfile(profile, stats) {
//   return {
//     id: profile.id,
//     name: profile.name,
//     avatarColor: profile.avatar_color,
//     gamesPlayed: stats.gamesPlayed,
//     wins: 0, // TODO: wire up once you have a "win" definition per room
//     totalScore: stats.totalScore,
//     rank: null,
//   };
// }

// // ---------------------------------------------
// // GET /players/:deviceId?name=vimal&playerId=1
// // find or create profile, synced with main app name
// // ---------------------------------------------
// router.get("/players/:deviceId", async (req, res) => {
//   try {
//     const { deviceId } = req.params;
//     const mainName = cleanName(req.query.name); // name from main app profile

//     let [rows] = await db.query(
//       `SELECT * FROM word_scramble_profiles WHERE device_id = ? LIMIT 1`,
//       [deviceId]
//     );

//     if (rows.length === 0) {
//       const name = mainName || randomName();
//       const avatarColor = randomColor();
//       const [result] = await db.query(
//         `INSERT INTO word_scramble_profiles (device_id, name, avatar_color) VALUES (?, ?, ?)`,
//         [deviceId, name, avatarColor]
//       );
//       rows = [{ id: result.insertId, device_id: deviceId, name, avatar_color: avatarColor }];
//     } else if (mainName && rows[0].name !== mainName) {
//       // main app name changed (or old random name) -> sync it
//       await applyName(deviceId, rows[0].name, mainName);
//       rows[0].name = mainName;
//     }

//     const profile = rows[0];
//     const stats = await getStatsForName(profile.name);

//     return res.status(200).json({
//       success: true,
//       profile: buildProfile(profile, stats),
//     });
//   } catch (err) {
//     console.error("Get profile error:", err);
//     return res.status(500).json({ error: "Failed to fetch profile" });
//   }
// });

// // ---------------------------------------------
// // PUT /players/:deviceId   body: { name }
// // ---------------------------------------------
// router.put("/players/:deviceId", async (req, res) => {
//   try {
//     const { deviceId } = req.params;
//     const name = cleanName(req.body?.name);

//     if (!name) {
//       return res.status(400).json({ error: "name is required" });
//     }

//     const [existing] = await db.query(
//       `SELECT * FROM word_scramble_profiles WHERE device_id = ? LIMIT 1`,
//       [deviceId]
//     );
//     if (existing.length === 0) {
//       return res.status(404).json({ error: "Profile not found" });
//     }

//     await applyName(deviceId, existing[0].name, name);

//     const [rows] = await db.query(
//       `SELECT * FROM word_scramble_profiles WHERE device_id = ? LIMIT 1`,
//       [deviceId]
//     );
//     const profile = rows[0];
//     const stats = await getStatsForName(profile.name);

//     return res.status(200).json({
//       success: true,
//       profile: buildProfile(profile, stats),
//     });
//   } catch (err) {
//     console.error("Update profile error:", err);
//     return res.status(500).json({ error: "Failed to update profile" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../db");

const ADJECTIVES = ["Swift", "Clever", "Bold", "Lucky", "Quiet", "Sunny", "Brave", "Witty"];
const ANIMALS = ["Fox", "Otter", "Falcon", "Panda", "Wolf", "Heron", "Tiger", "Lynx"];
const AVATAR_COLORS = ["#F97066", "#3B82F6", "#2BC98A", "#F2B640", "#8B5CF6", "#14B8A6"];
const NAME_MAX = 30;

function randomName() {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const b = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const n = Math.floor(100 + Math.random() * 900);
  return `${a}${b}${n}`;
}

function randomColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

function cleanName(value) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, NAME_MAX);
}

// Aggregate stats from the player's rows across all rooms they've played
async function getStatsForName(name) {
  const [rows] = await db.query(
    `SELECT
       COUNT(DISTINCT p.room_id)  AS games_played,
       COALESCE(SUM(p.score), 0)  AS total_score
     FROM word_scramble_players p
     WHERE p.player_name = ?`,
    [name]
  );
  return {
    gamesPlayed: Number(rows[0]?.games_played) || 0,
    totalScore: Number(rows[0]?.total_score) || 0,
  };
}

// Rename profile + keep old game rows linked to the new name
async function applyName(deviceId, oldName, newName) {
  await db.query(
    `UPDATE word_scramble_profiles SET name = ? WHERE device_id = ?`,
    [newName, deviceId]
  );

  if (oldName && oldName !== newName) {
    // FIX: UPDATE IGNORE skips rows that would break the unique key
    // (room_id + player_name) when the new name already exists in that room.
    // All other rows are renamed normally and no error is thrown.
    await db.query(
      `UPDATE IGNORE word_scramble_players SET player_name = ? WHERE player_name = ?`,
      [newName, oldName]
    );
  }
}

function buildProfile(profile, stats) {
  return {
    id: profile.id,
    name: profile.name,
    avatarColor: profile.avatar_color,
    gamesPlayed: stats.gamesPlayed,
    wins: 0, // TODO: wire up once you have a "win" definition per room
    totalScore: stats.totalScore,
    rank: null,
  };
}

// ---------------------------------------------
// GET /players/:deviceId?name=vimal&playerId=1
// find or create profile, synced with main app name
// ---------------------------------------------
router.get("/players/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const mainName = cleanName(req.query.name); // name from main app profile

    let [rows] = await db.query(
      `SELECT * FROM word_scramble_profiles WHERE device_id = ? LIMIT 1`,
      [deviceId]
    );

    if (rows.length === 0) {
      const name = mainName || randomName();
      const avatarColor = randomColor();
      const [result] = await db.query(
        `INSERT INTO word_scramble_profiles (device_id, name, avatar_color) VALUES (?, ?, ?)`,
        [deviceId, name, avatarColor]
      );
      rows = [{ id: result.insertId, device_id: deviceId, name, avatar_color: avatarColor }];
    } else if (mainName && rows[0].name !== mainName) {
      // main app name changed (or old random name) -> sync it
      await applyName(deviceId, rows[0].name, mainName);
      rows[0].name = mainName;
    }

    const profile = rows[0];
    const stats = await getStatsForName(profile.name);

    return res.status(200).json({
      success: true,
      profile: buildProfile(profile, stats),
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// ---------------------------------------------
// PUT /players/:deviceId   body: { name }
// ---------------------------------------------
router.put("/players/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const name = cleanName(req.body?.name);

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const [existing] = await db.query(
      `SELECT * FROM word_scramble_profiles WHERE device_id = ? LIMIT 1`,
      [deviceId]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    await applyName(deviceId, existing[0].name, name);

    const [rows] = await db.query(
      `SELECT * FROM word_scramble_profiles WHERE device_id = ? LIMIT 1`,
      [deviceId]
    );
    const profile = rows[0];
    const stats = await getStatsForName(profile.name);

    return res.status(200).json({
      success: true,
      profile: buildProfile(profile, stats),
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;