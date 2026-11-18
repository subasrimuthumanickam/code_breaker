
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
CREATE TABLE IF NOT EXISTS braintwist_level48 (
  id        INT           NOT NULL PRIMARY KEY,
  question  VARCHAR(255)  NOT NULL,
  hint      VARCHAR(255)  NULL,
  answer    INT           NOT NULL
)`;

const SELECT_LEVEL_SQL = `SELECT * FROM braintwist_level48 WHERE id = ? LIMIT 1`;

const UPSERT_LEVEL_SQL = `
INSERT INTO braintwist_level48 (id, question, hint, answer)
VALUES (?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
  question = VALUES(question),
  hint = VALUES(hint),
  answer = VALUES(answer)`;

/* Level 48: the rectangles can be dragged apart -> 4 rectangles */
const ANSWER = 4;

const LEVEL_48 = {
  id: 48,
  question: 'How many rectangles are there?',
  hint: 'Try dragging the rectangles apart and count them.',
  answer: ANSWER,
};

async function initLevel48() {
  await pool.query(CREATE_TABLE_SQL);
  await pool.query(UPSERT_LEVEL_SQL, [
    LEVEL_48.id,
    LEVEL_48.question,
    LEVEL_48.hint,
    LEVEL_48.answer,
  ]);
  console.log('[level48] seeded, answer =', LEVEL_48.answer);
}

async function getLevel48() {
  const [rows] = await pool.query(SELECT_LEVEL_SQL, [48]);
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    question: r.question,
    hint: r.hint,
    answer: r.answer,
  };
}

module.exports = { pool, initLevel48, getLevel48, CREATE_TABLE_SQL };