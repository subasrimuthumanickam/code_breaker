// Run once from the backend folder:
//   node src/utils/seedWordScrambleLevels.js
// Safe to re-run: existing levels are updated, not duplicated.

const db = require("../db");

const TOTAL_LEVELS = 50;
const ZONES = [
  "Sunny Meadow",
  "Whispering Woods",
  "Crystal Lake",
  "Dragon Peaks",
  "Star Summit",
];

function buildLevel(n) {
  const zoneIdx = Math.floor((n - 1) / 10);
  const posInZone = (n - 1) % 10;

  const difficulty = zoneIdx <= 1 ? "easy" : zoneIdx <= 3 ? "medium" : "hard";
  const totalRounds = 5 + zoneIdx; // 5..9 rounds
  const timeLimitSec = Math.max(25, 70 - zoneIdx * 8 - posInZone); // gets tighter
  const lives = 5 - Math.floor(zoneIdx / 2); // 5,5,4,4,3
  const targetScore = totalRounds * (60 + n * 2); // score needed for 3 stars

  return [n, ZONES[zoneIdx], difficulty, totalRounds, timeLimitSec, lives, targetScore];
}

async function seed() {
  const sql = `
    INSERT INTO word_scramble_levels
      (level_number, zone_name, difficulty, total_rounds, time_limit_sec, lives, target_score)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      zone_name = VALUES(zone_name),
      difficulty = VALUES(difficulty),
      total_rounds = VALUES(total_rounds),
      time_limit_sec = VALUES(time_limit_sec),
      lives = VALUES(lives),
      target_score = VALUES(target_score)`;

  for (let n = 1; n <= TOTAL_LEVELS; n++) {
    await db.query(sql, buildLevel(n));
  }
  console.log(`Seeded ${TOTAL_LEVELS} word scramble levels.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});