// Pure game logic - no database, no express. Easy to test.

const generateSecret = ({ slots, colors, allowRepeats }) => {
  if (allowRepeats) {
    return Array.from({ length: slots }, () => 1 + Math.floor(Math.random() * colors));
  }
  const pool = Array.from({ length: colors }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, slots);
};

// exact     = right colour in the right slot   (green dot)
// misplaced = right colour, wrong slot         (ring)
const scoreGuess = (secret, guess) => {
  let exact = 0;
  const secretCount = {};
  const guessCount = {};

  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) {
      exact++;
    } else {
      secretCount[secret[i]] = (secretCount[secret[i]] || 0) + 1;
      guessCount[guess[i]] = (guessCount[guess[i]] || 0) + 1;
    }
  }

  let misplaced = 0;
  for (const colour of Object.keys(guessCount)) {
    misplaced += Math.min(guessCount[colour], secretCount[colour] || 0);
  }
  return { exact, misplaced };
};

// "Codes still possible": how many codes are consistent with EVERY feedback so far.
const countPossible = (cfg, history) => {
  let count = 0;
  const cur = [];

  const walk = () => {
    if (cur.length === cfg.slots) {
      for (const h of history) {
        const s = scoreGuess(cur, h.guess);
        if (s.exact !== h.exact || s.misplaced !== h.misplaced) return;
      }
      count++;
      return;
    }
    for (let c = 1; c <= cfg.colors; c++) {
      if (!cfg.allowRepeats && cur.includes(c)) continue;
      cur.push(c);
      walk();
      cur.pop();
    }
  };

  walk();
  return count;
};

// Returns an error message or null.
const validateGuess = (guess, cfg) => {
  if (!Array.isArray(guess) || guess.length !== cfg.slots) {
    return `Guess must contain exactly ${cfg.slots} digits`;
  }
  for (const d of guess) {
    if (!Number.isInteger(d) || d < 1 || d > cfg.colors) {
      return `Each digit must be between 1 and ${cfg.colors}`;
    }
  }
  if (!cfg.allowRepeats && new Set(guess).size !== guess.length) {
    return "This level has no repeats - use each digit only once";
  }
  return null;
};

// 3 stars = solved fast, 1 star = solved on a late guess.
const calcStars = (guessesUsed, maxGuesses) => {
  const ratio = guessesUsed / maxGuesses;
  if (ratio <= 0.4) return 3;
  if (ratio <= 0.7) return 2;
  return 1;
};

module.exports = { generateSecret, scoreGuess, countPossible, validateGuess, calcStars };