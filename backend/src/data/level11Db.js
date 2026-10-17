// // Level 11 - "All but 9" sheep riddle.
// // The answer NEVER leaves the server (it is not sent in /start).

// const LEVEL = {
//   n: 11,
//   question: "A farmer has 17 sheep. All but 9 run away. How many are left?",
//   input: "keypad",
//   maxDigits: 2,
//   answer: "9",
//   hints: [
//     "Read the words 'all but 9' very slowly.",
//     "This is not a subtraction question.",
//     "'All but 9' means every sheep except 9 ran away.",
//   ],
//   hintCost: 25,
//   skipCost: 50,
// };

// const SCHEMA = [
//   `CREATE TABLE IF NOT EXISTS bt_level11_sessions (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     player_id INT NOT NULL,
//     status ENUM('active','completed','skipped') NOT NULL DEFAULT 'active',
//     attempts INT NOT NULL DEFAULT 0,
//     hints_used INT NOT NULL DEFAULT 0,
//     started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     finished_at DATETIME NULL,
//     INDEX idx_player (player_id)
//   )`,
//   `CREATE TABLE IF NOT EXISTS bt_level11_attempts (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     session_id INT NOT NULL,
//     player_id INT NOT NULL,
//     answer VARCHAR(20) NOT NULL,
//     is_correct TINYINT(1) NOT NULL DEFAULT 0,
//     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     INDEX idx_session (session_id)
//   )`,
// ];

// const normalize = (v) => String(v ?? "").trim().replace(/^0+(?=\d)/, "");
// const isCorrect = (v) => normalize(v) === LEVEL.answer;

// const starsFor = (attempts, skipped) =>
//   skipped ? 1 : attempts <= 2 ? 3 : attempts <= 5 ? 2 : 1;

// module.exports = { LEVEL, SCHEMA, isCorrect, normalize, starsFor };
// Brain Twist - Level 11 data (clock riddle)
// Put this at: backend/src/data/level11Db.js

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