// level47Db.js
// MySQL (mysql2) data layer for Brain Twist - Level 47
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'braintwist',
  waitForConnections: true,
  connectionLimit: 10,
});

/* ------------------------------------------------------------------ */
/* SQL                                                                */
/* ------------------------------------------------------------------ */

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS braintwist_level47 (
  id            INT           NOT NULL PRIMARY KEY,
  question      VARCHAR(255)  NOT NULL,
  hint          VARCHAR(255)  NULL,
  items         JSON          NOT NULL,  -- [{ id, value }] in display order (top -> bottom)
  solution_ids  JSON          NOT NULL   -- item ids in the order they must be clicked
)`;

const SELECT_LEVEL_SQL = `SELECT * FROM braintwist_level47 WHERE id = ? LIMIT 1`;

const UPSERT_LEVEL_SQL = `
INSERT INTO braintwist_level47 (id, question, hint, items, solution_ids)
VALUES (?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
  question = VALUES(question),
  hint = VALUES(hint),
  items = VALUES(items),
  solution_ids = VALUES(solution_ids)`;

/* ------------------------------------------------------------------ */
/* Level 47 seed                                                      */
/* list (top -> bottom): -459, 522, 1008, -5, 66, 578                 */
/* answer = click from the BOTTOM to the TOP: 578 ... -459            */
/* ------------------------------------------------------------------ */

const LEVEL_47 = {
  id: 47,
  question: 'Click them from low to high.',
  hint: 'Start from the bottom',
  items: [
    { id: 'n1', value: -459 },
    { id: 'n2', value: 522 },
    { id: 'n3', value: 1008 },
    { id: 'n4', value: -5 },
    { id: 'n5', value: 66 },
    { id: 'n6', value: 578 },
  ],
  solutionIds: ['n6', 'n5', 'n4', 'n3', 'n2', 'n1'],
};

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const parseJson = (v) => (typeof v === 'string' ? JSON.parse(v) : v);

async function initLevel47() {
  await pool.query(CREATE_TABLE_SQL);
  await pool.query(UPSERT_LEVEL_SQL, [
    LEVEL_47.id,
    LEVEL_47.question,
    LEVEL_47.hint,
    JSON.stringify(LEVEL_47.items),
    JSON.stringify(LEVEL_47.solutionIds),
  ]);
  console.log('[level47] seeded');
}

async function getLevel47() {
  const [rows] = await pool.query(SELECT_LEVEL_SQL, [47]);
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    question: r.question,
    hint: r.hint,
    items: parseJson(r.items),
    solutionIds: parseJson(r.solution_ids),
  };
}

module.exports = { pool, initLevel47, getLevel47, CREATE_TABLE_SQL };