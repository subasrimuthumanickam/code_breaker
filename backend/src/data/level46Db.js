
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'braintwist',
  waitForConnections: true,
  connectionLimit: 10,
});

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS braintwist_level46 (
  id            INT           NOT NULL PRIMARY KEY,
  question      VARCHAR(255)  NOT NULL,
  remove_count  INT           NOT NULL,
  target_text   VARCHAR(10)   NOT NULL,
  hint          VARCHAR(255)  NULL,
  sticks        JSON          NOT NULL,
  solution_ids  JSON          NOT NULL
)`;

const SELECT_LEVEL_SQL = `SELECT * FROM braintwist_level46 WHERE id = ? LIMIT 1`;

// upsert so the NEW layout replaces the old 88 layout already stored in the table
const UPSERT_LEVEL_SQL = `
INSERT INTO braintwist_level46
  (id, question, remove_count, target_text, hint, sticks, solution_ids)
VALUES (?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
  question = VALUES(question),
  remove_count = VALUES(remove_count),
  target_text = VALUES(target_text),
  hint = VALUES(hint),
  sticks = VALUES(sticks),
  solution_ids = VALUES(solution_ids)`;

/* ------------------------------------------------------------------ */
/* 3 shapes, 140 x 140 each (same arrangement as the reference image) */
/* head of every stick is at (x2, y2)                                 */
/* ------------------------------------------------------------------ */
const S = 140;
const H = (id, shape, x1, x2, y) => ({ id, shape, x1, y1: y, x2, y2: y }); // horizontal, head right
const V = (id, shape, x) => ({ id, shape, x1: x, y1: S, x2: x, y2: 0 }); // vertical, head top

const STICKS = [
  // shape 0: top, bottom + 3 verticals
  H('s0_top', 0, 0, S, 0),
  H('s0_bot', 0, 0, S, S),
  V('s0_l', 0, 0),
  V('s0_m', 0, S / 2),
  V('s0_r', 0, S),

  // shape 1: top, middle, bottom + 2 verticals
  H('s1_top', 1, 0, S, 0),
  H('s1_mid', 1, -8, S + 8, S / 2),
  H('s1_bot', 1, 0, S, S),
  V('s1_l', 1, 0),
  V('s1_r', 1, S),

  // shape 2: top, bottom, 2 verticals + diagonal
  H('s2_top', 2, 0, S, 0),
  H('s2_bot', 2, 0, S, S),
  V('s2_l', 2, 0),
  V('s2_r', 2, S),
  { id: 's2_diag', shape: 2, x1: S, y1: S, x2: 0, y2: 0 },
];

// const LEVEL_46 = {
//   id: 46,
//   question: 'Remove 6 sticks and make it a 10.',
//   removeCount: 6,
//   targetText: '10',
//   hint: '',
//   sticks: STICKS,
//   // TODO: PLACEHOLDER - put the real 6 stick ids of your puzzle answer here
//   solutionIds: ['s0_m', 's0_l', 's1_mid', 's2_diag', 's2_top', 's2_r'],
// };
const LEVEL_46 = {
  id: 46,
  question: 'Remove 6 sticks and make it TEN.',
  removeCount: 6,
  targetText: 'TEN',
  hint: 'T, E, N',
  sticks: STICKS,
  solutionIds: ['s0_bot', 's0_l', 's0_r', 's1_r', 's2_top', 's2_bot'],
};
const parseJson = (v) => (typeof v === 'string' ? JSON.parse(v) : v);

async function initLevel46() {
  await pool.query(CREATE_TABLE_SQL);
  await pool.query(UPSERT_LEVEL_SQL, [
    LEVEL_46.id,
    LEVEL_46.question,
    LEVEL_46.removeCount,
    LEVEL_46.targetText,
    LEVEL_46.hint,
    JSON.stringify(LEVEL_46.sticks),
    JSON.stringify(LEVEL_46.solutionIds),
  ]);
  console.log('[level46] seeded');
}

async function getLevel46() {
  const [rows] = await pool.query(SELECT_LEVEL_SQL, [46]);
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    question: r.question,
    removeCount: r.remove_count,
    targetText: r.target_text,
    hint: r.hint,
    sticks: parseJson(r.sticks),
    solutionIds: parseJson(r.solution_ids),
  };
}

module.exports = { pool, initLevel46, getLevel46, CREATE_TABLE_SQL };