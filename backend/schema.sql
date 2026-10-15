-- Code Breaker backend schema (MySQL 8+)
-- Usage: mysql -u root -p < schema.sql
-- Idempotent: every statement uses IF NOT EXISTS, so it is safe to re-run.
-- No foreign keys: the application inserts rows without enforcing parent order.

CREATE DATABASE IF NOT EXISTS code_breaker
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE code_breaker;

/* ---------------- Player accounts & activity ---------------- */

CREATE TABLE IF NOT EXISTS player (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(30)  NOT NULL DEFAULT 'Player',
  device_id   VARCHAR(100) NULL,
  xp          INT          NOT NULL DEFAULT 0,
  dob         DATE         NULL,
  gender      VARCHAR(10)  NULL,
  phone       VARCHAR(20)  NULL,
  type        VARCHAR(20)  NULL DEFAULT 'user',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_player_device (device_id),
  KEY idx_player_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS player_activity (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  player_id    INT          NOT NULL,
  game         VARCHAR(30)  NOT NULL,
  type         VARCHAR(30)  NOT NULL,
  title        VARCHAR(80)  NOT NULL,
  detail       VARCHAR(160) NOT NULL,
  xp_awarded   INT          NOT NULL DEFAULT 0,
  value        INT          NOT NULL DEFAULT 0,
  source_key   VARCHAR(120) NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_player_created (player_id, id),
  UNIQUE KEY uq_player_activity_source (player_id, source_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_progress (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  device_id        VARCHAR(100) NOT NULL,
  difficulty       VARCHAR(20)  NOT NULL,
  rounds_completed INT          NOT NULL DEFAULT 0,
  completed        TINYINT(1)   NOT NULL DEFAULT 0,
  UNIQUE KEY uq_user_progress (device_id, difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
  id               INT PRIMARY KEY,
  sound_enabled    TINYINT(1) NOT NULL DEFAULT 1,
  haptics_enabled  TINYINT(1) NOT NULL DEFAULT 1,
  dark_mode        TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* ---------------- Legacy game history (stats & reset) ---------------- */

CREATE TABLE IF NOT EXISTS games (
  id              VARCHAR(36)  PRIMARY KEY,
  difficulty      VARCHAR(20)  NULL,
  secret_code     VARCHAR(32)  NULL,
  code_length     INT          NULL,
  max_attempts    INT          NULL,
  time_limit_sec  INT          NULL,
  attempts_used   INT          NOT NULL DEFAULT 0,
  score           INT          NOT NULL DEFAULT 0,
  status          VARCHAR(20)  NOT NULL DEFAULT 'playing',
  started_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at     TIMESTAMP    NULL,
  KEY idx_games_status_finished (status, finished_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS guesses (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  game_id          VARCHAR(36) NOT NULL,
  guess            VARCHAR(32) NOT NULL,
  exact_matches    INT NOT NULL DEFAULT 0,
  partial_matches  INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_guesses_game (game_id, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* ---------------- Code Breaker (cb_*) ---------------- */

CREATE TABLE IF NOT EXISTS cb_games (
  id              VARCHAR(36) PRIMARY KEY,
  player_id       VARCHAR(64) NOT NULL,
  difficulty      VARCHAR(20) NOT NULL,
  level           INT         NOT NULL,
  slots           INT         NOT NULL,
  colors          INT         NOT NULL,
  allow_repeats   TINYINT(1)  NOT NULL DEFAULT 0,
  max_guesses     INT         NOT NULL,
  secret_code     VARCHAR(32) NOT NULL,
  guesses_used    INT         NOT NULL DEFAULT 0,
  status          VARCHAR(20) NOT NULL DEFAULT 'playing',
  stars           TINYINT     NOT NULL DEFAULT 0,
  created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at     TIMESTAMP   NULL,
  KEY idx_cb_games_player (player_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cb_guesses (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  game_id           VARCHAR(36) NOT NULL,
  guess_no          INT         NOT NULL,
  guess_code        VARCHAR(32) NOT NULL,
  exact_count       INT         NOT NULL DEFAULT 0,
  misplaced_count   INT         NOT NULL DEFAULT 0,
  possible_left     INT         NULL,
  created_at        TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cb_guesses_game_no (game_id, guess_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cb_progress (
  player_id   VARCHAR(64) NOT NULL,
  level       INT        NOT NULL,
  best_stars  TINYINT    NOT NULL DEFAULT 0,
  times_won   INT        NOT NULL DEFAULT 0,
  PRIMARY KEY (player_id, level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* ---------------- Word Scramble: content ---------------- */

CREATE TABLE IF NOT EXISTS word_scramble_words (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  word        VARCHAR(50)  NOT NULL,
  clue        VARCHAR(255) NOT NULL,
  difficulty  VARCHAR(20)  NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_word_scramble_words_word (word)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_levels (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  level_number    INT          NOT NULL,
  zone_name       VARCHAR(50)  NOT NULL,
  difficulty      VARCHAR(20)  NOT NULL,
  total_rounds    INT          NOT NULL,
  time_limit_sec  INT          NOT NULL,
  lives           INT          NOT NULL,
  target_score    INT          NOT NULL,
  UNIQUE KEY uq_word_scramble_levels_number (level_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_profiles (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  device_id     VARCHAR(100) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  avatar_color  VARCHAR(20)  NULL,
  UNIQUE KEY uq_word_scramble_profiles_device (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* ---------------- Word Scramble: rooms & play ---------------- */

CREATE TABLE IF NOT EXISTS word_scramble_rooms (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  room_code       VARCHAR(12)  NOT NULL,
  room_name       VARCHAR(30)  NULL,
  room_type       VARCHAR(20)  NULL,
  difficulty      VARCHAR(20)  NULL,
  status          VARCHAR(20)  NOT NULL DEFAULT 'waiting',
  max_players     INT          NOT NULL DEFAULT 4,
  total_rounds    INT          NULL,
  time_limit_sec  INT          NULL,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_word_scramble_rooms_code (room_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_players (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  room_id     INT          NOT NULL,
  player_name VARCHAR(100) NOT NULL,
  is_ready    TINYINT(1)   NOT NULL DEFAULT 0,
  is_host     TINYINT(1)   NOT NULL DEFAULT 0,
  score       INT          NOT NULL DEFAULT 0,
  joined_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_word_scramble_players_room_name (room_id, player_name),
  KEY idx_word_scramble_players_name (player_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_rounds (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  room_id         INT          NOT NULL,
  round_number    INT          NOT NULL,
  word            VARCHAR(50)  NOT NULL,
  clue            VARCHAR(255) NULL,
  scrambled       VARCHAR(50)  NULL,
  time_limit_sec  INT          NULL,
  letters_json    TEXT         NULL,
  words_json      TEXT         NULL,
  revealed_json   TEXT         NULL,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_word_scramble_rounds_room (room_id, round_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_answers (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  round_id        INT          NOT NULL,
  player_name     VARCHAR(100) NOT NULL,
  answer          VARCHAR(100) NULL,
  is_correct      TINYINT(1)   NOT NULL DEFAULT 0,
  time_taken_sec  INT          NULL,
  points          INT          NOT NULL DEFAULT 0,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_word_scramble_answers_round (round_id, player_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_found_words (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  round_id    INT          NOT NULL,
  word        VARCHAR(50)  NOT NULL,
  found_by    VARCHAR(100) NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_word_scramble_found_round_word (round_id, word)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_hints (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  round_id     INT          NOT NULL,
  player_name  VARCHAR(100) NOT NULL,
  `row`        INT          NOT NULL,
  `col`        INT          NOT NULL,
  letter       CHAR(1)      NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_word_scramble_hints_round (round_id, player_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_messages (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  room_id      INT          NOT NULL,
  player_name  VARCHAR(100) NOT NULL,
  message      VARCHAR(255) NOT NULL,
  sent_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_word_scramble_messages_room (room_id, sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ws_room_quits (
  room_id      INT          NOT NULL,
  player_name  VARCHAR(100) NOT NULL,
  quit_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (room_id, player_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* ---------------- Word Scramble: per-player state ---------------- */

CREATE TABLE IF NOT EXISTS ws_guests (
  name        VARCHAR(30) PRIMARY KEY,
  created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  last_seen   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ws_seen_words (
  player_name  VARCHAR(100) NOT NULL,
  word         VARCHAR(50)  NOT NULL,
  seen_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_name, word)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ws_player_progress (
  player_name  VARCHAR(100) PRIMARY KEY,
  next_round   INT          NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ws_player_wallet (
  player_name    VARCHAR(100) PRIMARY KEY,
  coins          INT NOT NULL DEFAULT 0,
  hint_tokens    INT NOT NULL DEFAULT 0,
  bonus_seconds  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ws_coin_transactions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  player_name  VARCHAR(100) NOT NULL,
  type         VARCHAR(30)  NOT NULL,
  amount       INT          NOT NULL,
  round_id     INT          NULL,
  level        INT          NULL,
  ref_key      VARCHAR(120) NULL,
  note         VARCHAR(255) NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ws_coin_tx_ref (player_name, ref_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ws_skip_wallet (
  player_name  VARCHAR(100) PRIMARY KEY,
  skips        INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ws_skip_claims (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  player_name  VARCHAR(100) NOT NULL,
  set_key      VARCHAR(120) NOT NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ws_skip_claims (player_name, set_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ws_skipped_rounds (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  player_name   VARCHAR(100) NOT NULL,
  round_id      VARCHAR(120) NOT NULL,
  round_number  INT          NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ws_skipped_rounds (player_name, round_id),
  KEY idx_ws_skipped_rounds_round (round_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* ---------------- Word Scramble: puzzle rounds ---------------- */

CREATE TABLE IF NOT EXISTS ws_rounds (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  room_id        INT          NOT NULL,
  round_number   INT          NOT NULL,
  root_word      VARCHAR(50)  NOT NULL,
  letters        VARCHAR(100) NOT NULL,
  words          TEXT         NULL,
  bonus_words    TEXT         NULL,
  time_limit_sec INT          NULL,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ws_rounds_room_number (room_id, round_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
