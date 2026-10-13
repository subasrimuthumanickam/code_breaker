-- Database: code_breaker (backend/src/db.js default and backend/.env.example)
-- Exact source DDL existed only for games, guesses, and word_scramble_words in backend/schema.sql.
-- Other tables are reconstructed from active backend SQL. Their SQL types, nullability,
-- primary/foreign keys, and indexes are inferred where the repository does not declare them.
-- Relationships and supporting indexes below are inferred from application joins/lookups.

CREATE DATABASE IF NOT EXISTS code_breaker
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE code_breaker;

CREATE TABLE IF NOT EXISTS games (
  id CHAR(36) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  secret_code VARCHAR(20) NOT NULL,
  code_length TINYINT UNSIGNED NOT NULL,
  max_attempts TINYINT UNSIGNED NOT NULL,
  time_limit_sec INT UNSIGNED NOT NULL,
  attempts_used TINYINT UNSIGNED NOT NULL DEFAULT 0,
  score INT NOT NULL DEFAULT 0,
  status ENUM('playing', 'won', 'lost') NOT NULL DEFAULT 'playing',
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at DATETIME NULL,
  PRIMARY KEY (id),
  INDEX idx_status (status),
  INDEX idx_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS guesses (
  id INT NOT NULL AUTO_INCREMENT,
  game_id CHAR(36) NOT NULL,
  guess VARCHAR(20) NOT NULL,
  exact_matches TINYINT UNSIGNED NOT NULL,
  partial_matches TINYINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_game_id (game_id),
  CONSTRAINT fk_guesses_game
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_words (
  id INT NOT NULL AUTO_INCREMENT,
  word VARCHAR(50) NOT NULL,
  clue VARCHAR(255) NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'easy',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_word_scramble_words_difficulty_created (difficulty, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_rooms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_code CHAR(4) NOT NULL,
  room_name VARCHAR(100) NOT NULL,
  room_type VARCHAR(20) NOT NULL,
  max_players TINYINT UNSIGNED NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'easy',
  status ENUM('waiting', 'in_progress', 'finished') NOT NULL DEFAULT 'waiting',
  total_rounds INT UNSIGNED NULL,
  time_limit_sec INT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_word_scramble_rooms_room_code (room_code),
  INDEX idx_word_scramble_rooms_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_profiles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  device_id VARCHAR(128) NOT NULL,
  name VARCHAR(64) NOT NULL,
  avatar_color CHAR(7) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_word_scramble_profiles_device_id (device_id),
  INDEX idx_word_scramble_profiles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_players (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_id BIGINT UNSIGNED NOT NULL,
  player_name VARCHAR(64) NOT NULL,
  is_ready BOOLEAN NOT NULL DEFAULT FALSE,
  is_host BOOLEAN NOT NULL DEFAULT FALSE,
  score INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_word_scramble_players_room_name (room_id, player_name),
  INDEX idx_word_scramble_players_name (player_name),
  CONSTRAINT fk_word_scramble_players_room
    FOREIGN KEY (room_id) REFERENCES word_scramble_rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_rounds (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_id BIGINT UNSIGNED NOT NULL,
  round_number INT UNSIGNED NOT NULL,
  word VARCHAR(50) NOT NULL,
  clue VARCHAR(255) NULL,
  scrambled VARCHAR(50) NOT NULL,
  time_limit_sec INT UNSIGNED NOT NULL,
  letters_json LONGTEXT NOT NULL,
  words_json LONGTEXT NOT NULL,
  revealed_json LONGTEXT NOT NULL,
  PRIMARY KEY (id),
  INDEX idx_word_scramble_rounds_room_number (room_id, round_number),
  CONSTRAINT fk_word_scramble_rounds_room
    FOREIGN KEY (room_id) REFERENCES word_scramble_rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_answers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  round_id BIGINT UNSIGNED NOT NULL,
  player_name VARCHAR(64) NOT NULL,
  answer VARCHAR(50) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_sec DECIMAL(8,2) NOT NULL DEFAULT 0,
  points INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX idx_word_scramble_answers_round_points (round_id, points),
  INDEX idx_word_scramble_answers_player (player_name),
  CONSTRAINT fk_word_scramble_answers_round
    FOREIGN KEY (round_id) REFERENCES word_scramble_rounds(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_found_words (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  round_id BIGINT UNSIGNED NOT NULL,
  word VARCHAR(50) NOT NULL,
  found_by VARCHAR(64) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_word_scramble_found_words_round_word (round_id, word),
  CONSTRAINT fk_word_scramble_found_words_round
    FOREIGN KEY (round_id) REFERENCES word_scramble_rounds(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_hints (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  round_id BIGINT UNSIGNED NOT NULL,
  player_name VARCHAR(64) NOT NULL,
  `row` INT NOT NULL,
  `col` INT NOT NULL,
  letter CHAR(1) NOT NULL,
  PRIMARY KEY (id),
  INDEX idx_word_scramble_hints_round_player (round_id, player_name),
  CONSTRAINT fk_word_scramble_hints_round
    FOREIGN KEY (round_id) REFERENCES word_scramble_rounds(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_scramble_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_id BIGINT UNSIGNED NOT NULL,
  player_name VARCHAR(64) NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_word_scramble_messages_room_sent (room_id, sent_at),
  CONSTRAINT fk_word_scramble_messages_room
    FOREIGN KEY (room_id) REFERENCES word_scramble_rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ws_rounds (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_id BIGINT UNSIGNED NOT NULL,
  round_number INT UNSIGNED NOT NULL,
  root_word VARCHAR(50) NOT NULL,
  letters VARCHAR(50) NOT NULL,
  words LONGTEXT NOT NULL,
  bonus_words LONGTEXT NOT NULL,
  time_limit_sec INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ws_rounds_room_number (room_id, round_number),
  CONSTRAINT fk_ws_rounds_room
    FOREIGN KEY (room_id) REFERENCES word_scramble_rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
  id TINYINT UNSIGNED NOT NULL,
  sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  haptics_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  dark_mode BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_progress (
  device_id VARCHAR(128) NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard', 'extreme') NOT NULL,
  rounds_completed INT UNSIGNED NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (device_id, difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cb_games (
  id CHAR(36) NOT NULL,
  player_id VARCHAR(64) NOT NULL,
  difficulty VARCHAR(16) NOT NULL,
  level SMALLINT UNSIGNED NOT NULL,
  slots TINYINT UNSIGNED NOT NULL,
  colors TINYINT UNSIGNED NOT NULL,
  allow_repeats BOOLEAN NOT NULL,
  max_guesses TINYINT UNSIGNED NOT NULL,
  secret_code VARCHAR(10) NOT NULL,
  guesses_used TINYINT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('playing', 'won', 'lost') NOT NULL DEFAULT 'playing',
  stars TINYINT UNSIGNED NOT NULL DEFAULT 0,
  finished_at DATETIME NULL,
  PRIMARY KEY (id),
  INDEX idx_cb_games_player_status (player_id, status),
  INDEX idx_cb_games_finished_at (finished_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cb_guesses (
  game_id CHAR(36) NOT NULL,
  guess_no TINYINT UNSIGNED NOT NULL,
  guess_code VARCHAR(10) NOT NULL,
  exact_count TINYINT UNSIGNED NOT NULL,
  misplaced_count TINYINT UNSIGNED NOT NULL,
  possible_left INT UNSIGNED NOT NULL,
  PRIMARY KEY (game_id, guess_no),
  CONSTRAINT fk_cb_guesses_game
    FOREIGN KEY (game_id) REFERENCES cb_games(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cb_progress (
  player_id VARCHAR(64) NOT NULL,
  level SMALLINT UNSIGNED NOT NULL,
  best_stars TINYINT UNSIGNED NOT NULL DEFAULT 0,
  times_won INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (player_id, level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO settings (id, sound_enabled, haptics_enabled, dark_mode)
VALUES (1, TRUE, TRUE, TRUE);

INSERT INTO word_scramble_words (word, clue, difficulty)
SELECT seed.word, seed.clue, seed.difficulty
FROM (
  SELECT 'APPLE' AS word, 'A fruit that keeps the doctor away' AS clue, 'easy' AS difficulty
  UNION ALL SELECT 'TIGER', 'A big striped wild cat', 'easy'
  UNION ALL SELECT 'HOUSE', 'A place where people live', 'easy'
  UNION ALL SELECT 'CHAIR', 'You sit on this', 'easy'
  UNION ALL SELECT 'WATER', 'You drink this to stay hydrated', 'easy'
  UNION ALL SELECT 'BREAD', 'Made from flour, sliced for sandwiches', 'easy'
  UNION ALL SELECT 'CLOCK', 'Tells you the time', 'easy'
  UNION ALL SELECT 'SMILE', 'What you do when you are happy', 'easy'
  UNION ALL SELECT 'BEACH', 'Sandy shore next to the ocean', 'easy'
  UNION ALL SELECT 'MONEY', 'You use this to buy things', 'easy'
  UNION ALL SELECT 'GUITAR', 'A musical instrument with strings you strum', 'medium'
  UNION ALL SELECT 'CASTLE', 'A large fortified building, home to kings', 'medium'
  UNION ALL SELECT 'BRIDGE', 'A structure built to cross a river', 'medium'
  UNION ALL SELECT 'DRAGON', 'A mythical fire-breathing creature', 'medium'
  UNION ALL SELECT 'FOREST', 'A large area covered with trees', 'medium'
  UNION ALL SELECT 'PENCIL', 'You write with this, has an eraser', 'medium'
  UNION ALL SELECT 'ROCKET', 'Flies into space', 'medium'
  UNION ALL SELECT 'GARDEN', 'A place where flowers and vegetables grow', 'medium'
  UNION ALL SELECT 'WINTER', 'The coldest season of the year', 'medium'
  UNION ALL SELECT 'PUZZLE', 'A game where pieces fit together', 'medium'
  UNION ALL SELECT 'ELEPHANT', 'The largest land animal, has a trunk', 'hard'
  UNION ALL SELECT 'COMPUTER', 'A machine you are probably using right now', 'hard'
  UNION ALL SELECT 'MOUNTAIN', 'A very tall natural landform', 'hard'
  UNION ALL SELECT 'BUTTERFLY', 'An insect with colorful wings, was once a caterpillar', 'hard'
  UNION ALL SELECT 'BIRTHDAY', 'The day you celebrate being born', 'hard'
  UNION ALL SELECT 'LIBRARY', 'A place full of books you can borrow', 'hard'
  UNION ALL SELECT 'SANDWICH', 'Food made between two slices of bread', 'hard'
  UNION ALL SELECT 'TELEPHONE', 'A device used to make calls', 'hard'
  UNION ALL SELECT 'VACATION', 'A trip taken to relax or explore', 'hard'
  UNION ALL SELECT 'CHOCOLATE', 'A sweet treat made from cocoa', 'hard'
) AS seed
WHERE NOT EXISTS (
  SELECT 1
  FROM word_scramble_words AS existing
  WHERE existing.word = seed.word AND existing.difficulty = seed.difficulty
);
