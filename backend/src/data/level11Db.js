

const LEVEL = {
  n: 11,
  question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
  input: "text",
  maxDigits: 30,          // frontend uses this as the max text length
  hintCost: 50,
  skipCost: 100,
  hints: [
    "Don't think about time itself. Think about the words in the question.",
    "Look closely at the words 'minute', 'moment' and 'thousand years'.",
    "Count how many times one particular letter appears in each word.",
  ],
};

const ANSWERS = ["m", "letter m", "the letter m", "the m", "an m"];

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS bt_level11_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'active',
    attempts INT NOT NULL DEFAULT 0,
    hints_used INT NOT NULL DEFAULT 0,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP NULL,
    INDEX idx_player (player_id)
  )`,
  `CREATE TABLE IF NOT EXISTS bt_level11_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    player_id INT NOT NULL,
    answer VARCHAR(64) NOT NULL,
    is_correct TINYINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id)
  )`,
];

const normalize = (v) =>
  String(v == null ? "" : v)
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const isCorrect = (v) => ANSWERS.includes(normalize(v));

const starsFor = (attempts, skipped) => {
  if (skipped) return 1;
  if (attempts <= 1) return 3;
  if (attempts <= 3) return 2;
  return 1;
};

module.exports = { LEVEL, SCHEMA, isCorrect, normalize, starsFor };