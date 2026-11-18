
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "code_breaker",
  waitForConnections: true,
  connectionLimit: 10,
});

const LETTERS = ["A", "B", "C", "D"];

async function init() {
  await pool.query(`CREATE TABLE IF NOT EXISTS braintwist_level32_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    correct_variant VARCHAR(10) NOT NULL,
    variants JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS braintwist_level32_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    options JSON NOT NULL,
    correct_answer CHAR(1) NOT NULL,
    status ENUM('active','completed') DEFAULT 'active',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    INDEX (player_id))`);
  await pool.query(`CREATE TABLE IF NOT EXISTS braintwist_level32_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    player_id INT NOT NULL,
    answer CHAR(1) NOT NULL,
    is_correct TINYINT(1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (session_id), INDEX (player_id))`);
  const [r] = await pool.query("SELECT COUNT(*) AS c FROM braintwist_level32_config");
  if (r[0].c === 0) {
    await pool.query(
      "INSERT INTO braintwist_level32_config (question, correct_variant, variants) VALUES (?,?,?)",
      ["Find the Correct Shadow", "v3", JSON.stringify(["v1", "v2", "v3", "v4"])]
    );
  }
}
const ready = init().catch((e) => console.error("[level32Db] init failed:", e.message));

const shuffle = (a) => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

async function startSession(playerId) {
  await ready;
  const [rows] = await pool.query("SELECT * FROM braintwist_level32_config ORDER BY id DESC LIMIT 1");
  const c = rows[0];
  const variants = typeof c.variants === "string" ? JSON.parse(c.variants) : c.variants;
  const options = shuffle(variants).slice(0, 4);
  const correct = LETTERS[options.indexOf(c.correct_variant)];
  const [res] = await pool.query(
    "INSERT INTO braintwist_level32_sessions (player_id, options, correct_answer) VALUES (?,?,?)",
    [playerId, JSON.stringify(options), correct]
  );
  return { sessionId: res.insertId, question: c.question, target: c.correct_variant, options };
}

async function getSession(id) {
  await ready;
  const [r] = await pool.query("SELECT * FROM braintwist_level32_sessions WHERE id=?", [id]);
  return r[0] || null;
}

async function completeSession(sessionId) {
  await pool.query(
    "UPDATE braintwist_level32_sessions SET status='completed', completed_at=NOW() WHERE id=?",
    [sessionId]
  );
}

async function saveAttempt(sessionId, playerId, answer, isCorrect) {
  await pool.query(
    "INSERT INTO braintwist_level32_attempts (session_id, player_id, answer, is_correct) VALUES (?,?,?,?)",
    [sessionId, playerId, answer, isCorrect ? 1 : 0]
  );
  if (isCorrect) await completeSession(sessionId);
  const [c] = await pool.query(
    "SELECT COUNT(*) AS n FROM braintwist_level32_attempts WHERE session_id=?",
    [sessionId]
  );
  return Number(c[0].n);
}

async function status(playerId) {
  await ready;
  const [a] = await pool.query(
    "SELECT COUNT(*) AS attempts, COALESCE(SUM(is_correct),0) AS correct FROM braintwist_level32_attempts WHERE player_id=?",
    [playerId]
  );
  const [s] = await pool.query(
    "SELECT COUNT(*) AS c FROM braintwist_level32_sessions WHERE player_id=? AND status='completed'",
    [playerId]
  );
  return { attempts: Number(a[0].attempts), correct: Number(a[0].correct), completed: s[0].c > 0 };
}

/* ---------- hint balance (bulbs) ----------
   Finds the table that holds the player's hints automatically (a table with a `hints` column
   and an `id` / `player_id` column). If it picks the wrong one, set these in .env:
   HINTS_TABLE=players  HINTS_COL=hints  HINTS_KEY=id                                      */
let target = null;
async function findTarget() {
  if (target) return target;
  if (process.env.HINTS_TABLE) {
    target = {
      table: process.env.HINTS_TABLE,
      col: process.env.HINTS_COL || "hints",
      key: process.env.HINTS_KEY || "id",
    };
    return target;
  }
  const [rows] = await pool.query(
    `SELECT TABLE_NAME AS t, COLUMN_NAME AS c FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND COLUMN_NAME IN ('hints','id','player_id')`
  );
  const tables = {};
  rows.forEach((r) => ((tables[r.t] = tables[r.t] || new Set()).add(r.c)));
  const names = Object.keys(tables).filter(
    (t) => tables[t].has("hints") && (tables[t].has("id") || tables[t].has("player_id")) &&
      !/^(braintwist_level|bt_level)/i.test(t)
  );
  const pick =
    names.find((t) => /^players?$/i.test(t)) ||
    names.find((t) => /player|user/i.test(t)) ||
    names[0];
  if (!pick) return null;
  const key = /^players?$/i.test(pick) ? "id" : tables[pick].has("player_id") ? "player_id" : "id";
  target = { table: pick, col: "hints", key };
  console.log("[level32Db] hints table:", target);
  return target;
}

// returns the new balance, or null when the player does not have enough hints
async function spendHints(playerId, cost) {
  const t = await findTarget();
  if (!t) throw new Error("hints table not found - set HINTS_TABLE in .env");
  const [r] = await pool.query(
    `UPDATE \`${t.table}\` SET \`${t.col}\` = \`${t.col}\` - ? WHERE \`${t.key}\` = ? AND \`${t.col}\` >= ?`,
    [cost, playerId, cost]
  );
  if (!r.affectedRows) return null;
  const [b] = await pool.query(`SELECT \`${t.col}\` AS h FROM \`${t.table}\` WHERE \`${t.key}\` = ?`, [playerId]);
  return Number(b[0].h);
}

module.exports = { pool, startSession, getSession, completeSession, saveAttempt, status, spendHints };