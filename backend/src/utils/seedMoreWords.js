// Adds MANY more words to `word_scramble_words` so questions stop repeating.
//
//   cd backend
//   npm i random-words
//   node src/utils/seedMoreWords.js
//
// Safe to re-run: words that already exist are skipped.
//
// How it works (all done ONCE, not while the game is running):
//   1. random-words  -> candidate common English words of the right length
//   2. wordlist.json + findSubWords -> keep only words that make a good crossword
//      (enough smaller words can be built from the letters)
//   3. dictionaryapi.dev (free, no key) -> real definition used as the clue
//      (words with no definition are skipped, so only real words get in)

const db = require("../db");
const { findSubWords } = require("./crosswordGenerator");

let DICTIONARY = [];
try {
  DICTIONARY = require("../data/wordlist.json");
} catch (e) {
  console.error("backend/src/data/wordlist.json is missing - cannot validate words.");
  process.exit(1);
}

/* ---------------- settings you can change ---------------- */

// How many NEW words to add for each difficulty
const TARGET = { easy: 120, medium: 120, hard: 80 };

// Word length per difficulty (same style as your existing words)
const LENGTH = {
  easy: { min: 5, max: 5 },
  medium: { min: 6, max: 6 },
  hard: { min: 7, max: 8 },
};

// A word must allow at least this many smaller words (good crossword)
const MIN_SUBWORDS = 5;

const CANDIDATES_PER_DIFFICULTY = 2500;
const DELAY_MS = 250; // be polite to the free dictionary API

/* --------------------------------------------------------- */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const dictSet = new Set(
  DICTIONARY.map((w) => String(typeof w === "object" && w ? w.word : w).toLowerCase())
);

async function getClue(word) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;

    const data = await res.json();
    let def = data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition;
    if (!def || typeof def !== "string") return null;

    // never leak the answer inside the clue
    def = def.replace(new RegExp(word, "gi"), "_____").trim();

    if (def.length > 100) {
      def = def.slice(0, 100).replace(/\s+\S*$/, "") + "...";
    }
    return def.length >= 8 ? def : null;
  } catch (e) {
    return null;
  }
}

async function seed() {
  // random-words is an ES module, so it is loaded with import()
  const { generate } = await import("random-words");

  const [existingRows] = await db.query(`SELECT word FROM word_scramble_words`);
  const existing = new Set(existingRows.map((r) => String(r.word).toUpperCase()));

  let totalAdded = 0;

  for (const difficulty of Object.keys(TARGET)) {
    const { min, max } = LENGTH[difficulty];
    const wanted = TARGET[difficulty];
    let added = 0;

    const raw = generate({ exactly: CANDIDATES_PER_DIFFICULTY, minLength: min, maxLength: max });
    const candidates = [...new Set(raw.map((w) => String(w).toLowerCase()))].filter((w) =>
      /^[a-z]+$/.test(w)
    );

    console.log(`\n[${difficulty}] ${candidates.length} candidates, want ${wanted} new words`);

    for (const word of candidates) {
      if (added >= wanted) break;

      const upper = word.toUpperCase();
      if (existing.has(upper)) continue;
      if (!dictSet.has(word)) continue;

      // good crossword? (enough smaller words can be formed)
      const subWords = findSubWords(word.split(""), DICTIONARY);
      if (!subWords || subWords.length < MIN_SUBWORDS) continue;

      const clue = await getClue(word);
      await sleep(DELAY_MS);
      if (!clue) continue;

      try {
        await db.query(`INSERT INTO word_scramble_words (word, clue, difficulty) VALUES (?, ?, ?)`, [
          upper,
          clue,
          difficulty,
        ]);
        existing.add(upper);
        added++;
        totalAdded++;
        console.log(`  + ${upper.padEnd(9)} ${clue}`);
      } catch (err) {
        if (err.code !== "ER_DUP_ENTRY") console.warn("  insert failed:", err.message);
      }
    }

    console.log(`[${difficulty}] added ${added}`);
  }

  console.log(`\nDone. Added ${totalAdded} new words.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});