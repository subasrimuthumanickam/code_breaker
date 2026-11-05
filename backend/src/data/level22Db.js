// Level 22 tables (MySQL / MariaDB).
// Same import as the routes file: mysql2/promise pool.
const db = require("../db");

let ready = null;

// Creates the tables if they do not exist. Safe to call many times.
function ensureLevel22Tables() {
  if (!ready) {
    ready = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS bt_level22_sessions (
          id           INT AUTO_INCREMENT PRIMARY KEY,
          user_id      INT NOT NULL,
          status       VARCHAR(20) NOT NULL DEFAULT 'started',
          attempts     INT NOT NULL DEFAULT 0,
          created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMP NULL DEFAULT NULL,
          INDEX idx_l22_sessions_user (user_id)
        )
      `);

      // selected_answer now stores the list of moves, e.g. "apple:0,apple:1,plate:2"
      await db.query(`
        CREATE TABLE IF NOT EXISTS bt_level22_attempts (
          id              INT AUTO_INCREMENT PRIMARY KEY,
          session_id      INT NOT NULL,
          user_id         INT NOT NULL,
          selected_answer VARCHAR(255) NOT NULL,
          is_correct      TINYINT(1) NOT NULL DEFAULT 0,
          created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_l22_attempts_session (session_id),
          INDEX idx_l22_attempts_user (user_id)
        )
      `);

      // the old table (time answers like "4:30 PM") may have a shorter column
      try {
        await db.query(
          "ALTER TABLE bt_level22_attempts MODIFY selected_answer VARCHAR(255) NOT NULL"
        );
      } catch (e) {
        console.error("L22 alter selected_answer:", e.message);
      }
    })().catch((e) => {
      ready = null; // try again next time
      throw e;
    });
  }
  return ready;
}

module.exports = { ensureLevel22Tables };

/* ---------------------------------------------------------------
   Same thing as plain SQL, if you prefer to run it by hand:

   CREATE TABLE IF NOT EXISTS bt_level22_sessions (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     status VARCHAR(20) NOT NULL DEFAULT 'started',
     attempts INT NOT NULL DEFAULT 0,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     completed_at TIMESTAMP NULL DEFAULT NULL,
     INDEX idx_l22_sessions_user (user_id)
   );

   CREATE TABLE IF NOT EXISTS bt_level22_attempts (
     id INT AUTO_INCREMENT PRIMARY KEY,
     session_id INT NOT NULL,
     user_id INT NOT NULL,
     selected_answer VARCHAR(255) NOT NULL,
     is_correct TINYINT(1) NOT NULL DEFAULT 0,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     INDEX idx_l22_attempts_session (session_id),
     INDEX idx_l22_attempts_user (user_id)
   );

   -- only if the table already existed with a short column:
   ALTER TABLE bt_level22_attempts MODIFY selected_answer VARCHAR(255) NOT NULL;
---------------------------------------------------------------- */