/**
 * Word-Connect / Wordscapes style puzzle generator (the logic Arkadium uses):
 *  1. pick a ROOT word (e.g. 6 letters) -> those letters become the wheel
 *  2. find EVERY dictionary word that can be spelled from the wheel letters
 *  3. lay out several of them as a CROSSWORD (words cross on shared letters)
 *  4. words that are valid but not placed on the grid are BONUS words
 */

const MIN_LEN = 3;
const key = (r, c) => `${r},${c}`;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const countLetters = (str) => {
  const m = {};
  for (const ch of str) m[ch] = (m[ch] || 0) + 1;
  return m;
};

const fitsLetters = (word, pool) => {
  const used = {};
  for (const ch of word) {
    used[ch] = (used[ch] || 0) + 1;
    if (used[ch] > (pool[ch] || 0)) return false;
  }
  return true;
};

/** Every dictionary word (>= 3 letters) spellable from `letters`. */
function findSubWords(letters, dictionary) {
  const pool = countLetters(letters.join("").toLowerCase());
  const out = new Set();
  for (const raw of dictionary) {
    const w = String(raw).toLowerCase();
    if (w.length >= MIN_LEN && w.length <= letters.length && /^[a-z]+$/.test(w) && fitsLetters(w, pool)) {
      out.add(w);
    }
  }
  return [...out];
}

/** One randomised attempt at building a crossword. */
function buildOnce(candidates, first, maxWords) {
  const cells = new Map(); // "r,c" -> letter
  const dirs = new Map(); // "r,c" -> Set(directions passing through)
  const placed = [];

  const put = (word, row, col, direction) => {
    for (let k = 0; k < word.length; k++) {
      const r = direction === "across" ? row : row + k;
      const c = direction === "across" ? col + k : col;
      cells.set(key(r, c), word[k]);
      if (!dirs.has(key(r, c))) dirs.set(key(r, c), new Set());
      dirs.get(key(r, c)).add(direction);
    }
    placed.push({ word, row, col, direction });
  };

  const canPlace = (word, row, col, direction) => {
    const dr = direction === "across" ? 0 : 1;
    const dc = direction === "across" ? 1 : 0;

    if (cells.has(key(row - dr, col - dc))) return false; // cell before start
    if (cells.has(key(row + dr * word.length, col + dc * word.length))) return false; // cell after end

    let crossings = 0;
    for (let k = 0; k < word.length; k++) {
      const r = row + dr * k;
      const c = col + dc * k;
      const existing = cells.get(key(r, c));
      if (existing) {
        if (existing !== word[k]) return false;
        if (dirs.get(key(r, c)).has(direction)) return false; // would overlap a same-direction word
        crossings++;
      } else if (cells.has(key(r + dc, c + dr)) || cells.has(key(r - dc, c - dr))) {
        return false; // would touch a neighbouring word without crossing it
      }
    }
    return crossings >= 1;
  };

  put(first, 0, 0, Math.random() < 0.5 ? "across" : "down");

  for (const word of candidates) {
    if (placed.length >= maxWords) break;
    if (placed.some((p) => p.word === word)) continue;

    let done = false;
    for (const p of shuffle(placed)) {
      if (done) break;
      const newDir = p.direction === "across" ? "down" : "across";
      for (let i = 0; i < p.word.length && !done; i++) {
        for (let j = 0; j < word.length && !done; j++) {
          if (p.word[i] !== word[j]) continue;
          const pr = p.direction === "across" ? p.row : p.row + i;
          const pc = p.direction === "across" ? p.col + i : p.col;
          const row = newDir === "across" ? pr : pr - j;
          const col = newDir === "across" ? pc - j : pc;
          if (canPlace(word, row, col, newDir)) {
            put(word, row, col, newDir);
            done = true;
          }
        }
      }
    }
  }
  return placed;
}

function layoutCrossword(allWords, root, maxWords, attempts = 60) {
  let best = [];
  for (let a = 0; a < attempts; a++) {
    const candidates = shuffle(allWords.filter((w) => w !== root));
    const result = buildOnce(candidates, root, maxWords);
    if (result.length > best.length) best = result;
    if (best.length >= maxWords) break;
  }
  if (best.length === 0) return [];
  const minR = Math.min(...best.map((w) => w.row));
  const minC = Math.min(...best.map((w) => w.col));
  return best.map((w) => ({ ...w, row: w.row - minR, col: w.col - minC }));
}

/**
 * @param {string[]} dictionary
 * @param {{letterCount?:number, maxWords?:number, minWords?:number}} opts
 * @returns {{rootWord:string, letters:string[], words:{word:string,row:number,col:number,direction:string}[], bonusWords:string[]}}
 */
function generatePuzzle(dictionary, opts = {}) {
  const { letterCount = 6, maxWords = 7, minWords = 4 } = opts;

  const roots = shuffle(
    dictionary
      .map((w) => String(w).toLowerCase())
      .filter((w) => w.length === letterCount && /^[a-z]+$/.test(w))
  );

  let best = null;
  for (const root of roots.slice(0, 300)) {
    const letters = root.split("");
    const all = findSubWords(letters, dictionary);
    if (all.length < minWords) continue;

    const words = layoutCrossword(all, root, maxWords);
    if (!best || words.length > best.words.length) {
      const placedSet = new Set(words.map((w) => w.word));
      best = {
        rootWord: root,
        letters: shuffle(letters).map((l) => l.toUpperCase()),
        words,
        bonusWords: all.filter((w) => !placedSet.has(w)),
      };
    }
    if (words.length >= minWords) break;
  }

  if (!best) throw new Error(`No puzzle could be generated for ${letterCount} letters`);
  return best;
}

module.exports = { generatePuzzle, findSubWords, layoutCrossword };