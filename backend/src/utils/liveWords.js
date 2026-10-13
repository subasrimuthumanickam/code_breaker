// LIVE random words for Word Scramble - no need to store words in the database.
//
//   words   : `random-words` npm library (common English words, works offline)
//   clues   : dictionaryapi.dev (free, no key) -> real definition as the clue
//   quality : wordlist.json + findSubWords -> only words that make a good crossword
//
// Ready-to-use words are kept in a small in-memory pool that is filled in the
// background, so a round never waits for the internet. If the live source is
// not available (no internet), the caller falls back to the database words.

const { findSubWords } = require("./crosswordGenerator");

let DICTIONARY = [];
try {
  DICTIONARY = require("../data/wordlist.json");
} catch (e) {
  console.warn("[liveWords] backend/src/data/wordlist.json missing - live words disabled");
}

const dictSet = new Set(
  DICTIONARY.map((w) => String(typeof w === "object" && w ? w.word : w).toLowerCase())
);

/* ---------------- settings ---------------- */

// word length per difficulty (same style as the words already in your DB)
const LENGTH = {
  easy: { min: 5, max: 5 },
  medium: { min: 6, max: 6 },
  hard: { min: 7, max: 8 },
};

const WARM_UP_COUNT = 40; // ready words per difficulty after start-up
const MIN_ELIGIBLE = 15; // when fewer unseen words are left, refill in background
const REFILL_BATCH = 30;
const POOL_MAX = 400;
const MIN_SUBWORDS = 5; // a word must allow at least this many smaller words
const ON_DEMAND_TIMEOUT_MS = 7000;

/* ------------------------------------------ */

const STOP_WORDS = new Set([
  "these", "those", "their", "there", "where", "which", "while", "whose", "whom",
  "would", "could", "should", "might", "shall", "being", "about", "above", "below",
  "after", "again", "since", "until", "under", "least", "other", "every", "among",
  "using", "often", "never", "maybe", "whilst", "within", "without", "toward",
]);

const ALLOWED_POS = ["noun", "verb", "adjective"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const pools = { easy: [], medium: [], hard: [] };
const refilling = { easy: false, medium: false, hard: false };
const clueCache = new Map(); // word -> clue | null
let rateLimitedUntil = 0;

/* ---------------- random-words (ES module) ---------------- */

let randomWordsMod = null;
async function getGenerate() {
  if (!randomWordsMod) randomWordsMod = await import("random-words");
  return randomWordsMod.generate;
}

/* ---------------- clue ---------------- */

function isGoodClue(word, def) {
  if (!def || def.length < 12 || def.length > 90) return false;
  if (/^\(|\.\.\.|\be\.\s?g\.|\bobsolete\b|\barchaic\b|\bdated\b|\brare\b|\bslang\b/i.test(def)) return false;

  const lower = def.toLowerCase();
  if (lower.includes(word.toLowerCase())) return false; // contains the answer

  // a word in the clue that starts like the answer (anger -> angry) gives it away
  const prefix = word.toLowerCase().slice(0, Math.min(4, word.length - 2));
  const tokens = lower.match(/[a-z]+/g) || [];
  if (tokens.some((t) => t.length >= prefix.length && t.startsWith(prefix))) return false;

  return true;
}

async function fetchClue(word) {
  if (clueCache.has(word)) return clueCache.get(word);
  if (Date.now() < rateLimitedUntil) return null;

  let clue = null;
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      { signal: AbortSignal.timeout(6000) }
    );

    if (res.status === 429) {
      rateLimitedUntil = Date.now() + 60 * 1000; // free API asked us to slow down
      return null;
    }

    if (res.ok) {
      const data = await res.json();
      const meanings = data?.[0]?.meanings || [];
      const ordered = ALLOWED_POS.flatMap((pos) => meanings.filter((m) => m.partOfSpeech === pos));

      const good = [];
      for (const m of ordered.slice(0, 2)) {
        for (const d of (m.definitions || []).slice(0, 4)) {
          const text = String(d?.definition || "").trim();
          if (isGoodClue(word, text)) good.push(text);
        }
      }

      if (good.length) {
        good.sort((a, b) => a.length - b.length); // shortest = simplest, most modern meaning
        clue = good[0].charAt(0).toUpperCase() + good[0].slice(1);
      }
    } else if (res.status === 404) {
      clueCache.set(word, null); // not a real dictionary word - never try again
      return null;
    }
  } catch (e) {
    return null; // network problem: do not cache, try again later
  }

  clueCache.set(word, clue);
  return clue;
}

/* ---------------- building the pool ---------------- */

// Finds ONE good new word for this difficulty (or null).
async function makeCandidate(difficulty, avoid = new Set()) {
  const generate = await getGenerate();
  const { min, max } = LENGTH[difficulty] || LENGTH.easy;

  const raw = generate({ exactly: 25, minLength: min, maxLength: max });

  for (const w of raw) {
    const word = String(w).toLowerCase();
    const upper = word.toUpperCase();

    if (!/^[a-z]+$/.test(word)) continue;
    if (STOP_WORDS.has(word)) continue;
    if (avoid.has(upper)) continue;
    if (pools[difficulty].some((c) => c.word === upper)) continue;
    if (!dictSet.has(word)) continue;

    const subWords = findSubWords(word.split(""), DICTIONARY);
    if (!subWords || subWords.length < MIN_SUBWORDS) continue;

    const clue = await fetchClue(word);
    if (!clue) continue;

    return { word: upper, clue };
  }
  return null;
}

// Adds `count` new ready words to the pool in the background.
async function refill(difficulty, count) {
  if (refilling[difficulty]) return;
  refilling[difficulty] = true;

  try {
    let added = 0;
    let misses = 0;

    while (added < count && pools[difficulty].length < POOL_MAX && misses < 12) {
      const c = await makeCandidate(difficulty);
      if (c) {
        pools[difficulty].push(c);
        added++;
        misses = 0;
      } else {
        misses++;
      }
      await sleep(200); // be polite to the free dictionary API
    }
  } catch (err) {
    console.warn(`[liveWords] refill(${difficulty}) failed:`, err.message);
  } finally {
    refilling[difficulty] = false;
  }
}

// Call once when the server starts. Does not block start-up.
function warmUpLiveWords() {
  if (!DICTIONARY.length) return;

  setTimeout(async () => {
    for (const difficulty of Object.keys(pools)) {
      await refill(difficulty, WARM_UP_COUNT);
      console.log(`[liveWords] ${difficulty}: ${pools[difficulty].length} words ready`);
    }
  }, 500);
}

/* ---------------- picking a word ---------------- */

function scramble(word) {
  const letters = word.split("");
  for (let attempt = 0; attempt < 20; attempt++) {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    const result = letters.join("");
    if (result !== word) return result;
  }
  return word.split("").reverse().join("");
}

/*
  Same shape as pickRandomWord(): returns { word, clue, scrambled, difficulty }.
  `exclude` = words that must NOT be asked again.
  Throws if no live word can be found (the caller then uses the database).
*/
async function pickLiveWord(difficulty, exclude = []) {
  if (!DICTIONARY.length) throw new Error("live words disabled");

  const level = pools[difficulty] ? difficulty : "easy";
  const ex = new Set(exclude.map((w) => String(w).toUpperCase()));

  let eligible = pools[level].filter((c) => !ex.has(c.word));

  // running low on unseen words -> top up in the background
  if (eligible.length < MIN_ELIGIBLE) refill(level, REFILL_BATCH);

  // nothing ready: try to build one right now (limited time)
  if (eligible.length === 0) {
    const deadline = Date.now() + ON_DEMAND_TIMEOUT_MS;
    while (Date.now() < deadline) {
      const c = await makeCandidate(level, ex);
      if (c) {
        pools[level].push(c);
        eligible = [c];
        break;
      }
      await sleep(150);
    }
  }

  if (eligible.length === 0) throw new Error("no live word available");

  const chosen = eligible[Math.floor(Math.random() * eligible.length)];

  return {
    word: chosen.word,
    clue: chosen.clue,
    scrambled: scramble(chosen.word),
    difficulty: level,
  };
}

module.exports = { pickLiveWord, warmUpLiveWords };