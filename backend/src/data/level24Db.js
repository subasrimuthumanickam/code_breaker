// backend/src/data/level24Db.js
// Level 24 hint storage (MySQL).
// NOTE: change this require to the same pool/db import your other levelXXDb.js files use.
const db = require("../db");

const HINT_1 =
  "Your sister's age difference from you never changes, even as you grow older.";

let ready = null;

// creates the tables + seeds the hint (runs once)
function ensureTables() {
  if (!ready) {
    ready = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS bt_level24_hints (
          hint_no   INT          NOT NULL PRIMARY KEY,
          hint_text VARCHAR(500) NOT NULL
        )`);
      await db.query(`
        CREATE TABLE IF NOT EXISTS bt_level24_hint_log (
          id         INT AUTO_INCREMENT PRIMARY KEY,
          player_id  VARCHAR(64) NOT NULL,
          hint_no    INT         NOT NULL,
          created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_player (player_id)
        )`);
      await db.query(
        `INSERT INTO bt_level24_hints (hint_no, hint_text) VALUES (1, ?)
         ON DUPLICATE KEY UPDATE hint_text = VALUES(hint_text)`,
        [HINT_1]
      );
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}

async function getHint(hintNo = 1) {
  await ensureTables();
  const [rows] = await db.query(
    "SELECT hint_text FROM bt_level24_hints WHERE hint_no = ? LIMIT 1",
    [hintNo]
  );
  return rows && rows[0] ? rows[0].hint_text : null;
}

// save that this player opened the hint
async function logHint(playerId, hintNo = 1) {
  await ensureTables();
  await db.query(
    "INSERT INTO bt_level24_hint_log (player_id, hint_no) VALUES (?, ?)",
    [String(playerId), hintNo]
  );
}

module.exports = { ensureTables, getHint, logHint };