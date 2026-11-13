const db = require('../db');

let ready;

const ensureTable = () => {
  if (!ready) {
    ready = db.query(`
      CREATE TABLE IF NOT EXISTS bt_hint_usage (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        player_id VARCHAR(64) NOT NULL,
        level_number SMALLINT UNSIGNED NOT NULL,
        session_id VARCHAR(64) NULL,
        stage SMALLINT UNSIGNED NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_bt_hint_player_level (player_id, level_number, created_at)
      )
    `);
  }
  return ready;
};

const recordHintUse = async ({ playerId, level, sessionId, stage }) => {
  const playerKey = String(playerId ?? '').trim();
  const levelNumber = Number(level);
  if (!playerKey || playerKey.length > 64 || !Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > 50) {
    return null;
  }

  await ensureTable();
  const playerIdNumber = Number(playerKey);
  const isNumericPlayer = Number.isSafeInteger(playerIdNumber) && playerIdNumber > 0;
  const [players] = isNumericPlayer
    ? await db.query('SELECT hints FROM bt_players WHERE id = ?', [playerIdNumber])
    : [[]];

  const sessionKey = sessionId == null ? null : String(sessionId).slice(0, 64);
  const stageNumber = Number(stage);
  const validStage = Number.isInteger(stageNumber) && stageNumber > 0 ? stageNumber : null;

  await db.query(
    `INSERT INTO bt_hint_usage (player_id, level_number, session_id, stage)
     VALUES (?, ?, ?, ?)`,
    [playerKey, levelNumber, sessionKey, validStage]
  );
  const [counts] = await db.query(
    `SELECT COUNT(*) AS uses
     FROM bt_hint_usage
     WHERE player_id = ? AND level_number = ?`,
    [playerKey, levelNumber]
  );

  return {
    success: true,
    free: true,
    cost: 0,
    level: levelNumber,
    uses: Number(counts[0]?.uses) || 0,
    hints: Number(players[0]?.hints) || 0,
  };
};

module.exports = { ensureTable, recordHintUse };
