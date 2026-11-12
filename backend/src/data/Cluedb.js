// // const pool=require('../db');

// // const DEFAULT_CLUE='Read the question carefully and think again!';

// // async function getClue(playerId,level,clueNo=1){
// //   const [rows]=await pool.query(
// //     'SELECT clue_text FROM bt_level_clues WHERE level_no=? AND clue_no=? LIMIT 1',
// //     [level,clueNo]);
// //   const clue=rows[0]?.clue_text||DEFAULT_CLUE;

// //   // store / save that this player opened this clue (count increases if opened again)
// //   await pool.query(
// //     `INSERT INTO bt_clue_usage (player_id,level_no,clue_no,view_count)
// //      VALUES (?,?,?,1)
// //      ON DUPLICATE KEY UPDATE view_count=view_count+1,last_viewed_at=CURRENT_TIMESTAMP`,
// //     [playerId,level,clueNo]);

// //   return {level,clueNo,clue};
// // }

// // module.exports={getClue};
// // backend/src/data/Cluedb.js
// const pool = require('../db');

// const DEFAULT_CLUE = 'Read the question carefully and think again!';

// // tables + first clues are created automatically on the first request (no manual SQL needed)
// const ready = (async () => {
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS bt_level_clues (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       level_no INT NOT NULL,
//       clue_no INT NOT NULL DEFAULT 1,
//       clue_text VARCHAR(500) NOT NULL,
//       UNIQUE KEY uq_level_clue (level_no, clue_no)
//     )
//   `);

//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS bt_clue_usage (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       player_id INT NOT NULL,
//       level_no INT NOT NULL,
//       clue_no INT NOT NULL DEFAULT 1,
//       view_count INT NOT NULL DEFAULT 1,
//       first_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       UNIQUE KEY uq_player_level_clue (player_id, level_no, clue_no)
//     )
//   `);

//   // INSERT IGNORE: never overwrites a clue you edited in MySQL
//   await pool.query(
//     `INSERT IGNORE INTO bt_level_clues (level_no, clue_no, clue_text) VALUES
//       (1, 1, 'Half of 10 is 5. Now add 4 to it.'),
//       (2, 1, 'The secret is protected. Think of what keeps information safe, then complete the word.')`
//   );

//   console.log('[BrainTwist Clue] tables ready');
// })().catch((err) => console.error('[BrainTwist Clue] could not create tables:', err.message));

// async function getClue(playerId, level, clueNo = 1) {
//   await ready;

//   const [rows] = await pool.query(
//     'SELECT clue_text FROM bt_level_clues WHERE level_no=? AND clue_no=? LIMIT 1',
//     [level, clueNo]
//   );
//   const clue = rows[0]?.clue_text || DEFAULT_CLUE;

//   // store / save that this player opened this clue (count goes up if opened again)
//   await pool.query(
//     `INSERT INTO bt_clue_usage (player_id, level_no, clue_no, view_count)
//      VALUES (?, ?, ?, 1)
//      ON DUPLICATE KEY UPDATE view_count = view_count + 1, last_viewed_at = CURRENT_TIMESTAMP`,
//     [playerId, level, clueNo]
//   );

//   return { level, clueNo, clue };
// }

// module.exports = { getClue };
// backend/src/data/Cluedb.js
const pool = require('../db');

const DEFAULT_CLUE = 'Read the question carefully and think again!';

// tables + first clues are created automatically on the first request (no manual SQL needed)
const ready = (async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bt_level_clues (
      id INT AUTO_INCREMENT PRIMARY KEY,
      level_no INT NOT NULL,
      clue_no INT NOT NULL DEFAULT 1,
      clue_text VARCHAR(500) NOT NULL,
      UNIQUE KEY uq_level_clue (level_no, clue_no)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bt_clue_usage (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      level_no INT NOT NULL,
      clue_no INT NOT NULL DEFAULT 1,
      view_count INT NOT NULL DEFAULT 1,
      first_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_player_level_clue (player_id, level_no, clue_no)
    )
  `);

  // INSERT IGNORE: never overwrites a clue you edited in MySQL
  await pool.query(
    `INSERT IGNORE INTO bt_level_clues (level_no, clue_no, clue_text) VALUES
      (1, 1, 'Half of 10 is 5. Now add 4 to it.'),
      (2, 1, 'The secret is protected. Think of what keeps information safe, then complete the word.'),
      (3, 1, 'Sometimes, the smallest changes can make the biggest difference. Look closely at what is missing between the numbers!')`
  );

  console.log('[BrainTwist Clue] tables ready');
})().catch((err) => console.error('[BrainTwist Clue] could not create tables:', err.message));

async function getClue(playerId, level, clueNo = 1) {
  await ready;

  const [rows] = await pool.query(
    'SELECT clue_text FROM bt_level_clues WHERE level_no=? AND clue_no=? LIMIT 1',
    [level, clueNo]
  );
  const clue = rows[0]?.clue_text || DEFAULT_CLUE;

  // store / save that this player opened this clue (count goes up if opened again)
  await pool.query(
    `INSERT INTO bt_clue_usage (player_id, level_no, clue_no, view_count)
     VALUES (?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE view_count = view_count + 1, last_viewed_at = CURRENT_TIMESTAMP`,
    [playerId, level, clueNo]
  );

  return { level, clueNo, clue };
}

module.exports = { getClue };