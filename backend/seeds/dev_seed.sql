-- DEVELOPMENT / TEST SEED ONLY. Do not run against a database holding real player data.
-- Usage (after the migration): mysql -u root -p code_breaker < backend/seeds/dev_seed.sql
-- Idempotent: inserts a word only when the same word+difficulty is not already present.
-- Contains no player, account, score, or multiplayer records.

USE code_breaker;

INSERT INTO word_scramble_words (word, clue, difficulty)
SELECT seed.word, seed.clue, seed.difficulty
FROM (
  SELECT 'APPLE' AS word, 'A fruit that keeps the doctor away' AS clue, 'easy' AS difficulty
  UNION ALL SELECT 'TIGER', 'A big striped wild cat', 'easy'
  UNION ALL SELECT 'CHAIR', 'You sit on this', 'easy'
  UNION ALL SELECT 'GUITAR', 'A musical instrument with strings you strum', 'medium'
  UNION ALL SELECT 'CASTLE', 'A large fortified building, home to kings', 'medium'
  UNION ALL SELECT 'ELEPHANT', 'The largest land animal, has a trunk', 'hard'
) AS seed
WHERE NOT EXISTS (
  SELECT 1
  FROM word_scramble_words AS existing
  WHERE existing.word = seed.word AND existing.difficulty = seed.difficulty
);
