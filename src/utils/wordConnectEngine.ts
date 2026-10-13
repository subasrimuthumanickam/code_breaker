// // // Client-side generator for word-connect style puzzles: given a fixed pool of
// // // letter tiles, find every real word that can be spelled from that pool
// // // (respecting letter counts) and lay the best of them into a single
// // // intersecting crossword grid, the way Wordscapes-style games do it.

// // export type WSWordSlot = {
// //   word: string;
// //   row: number;
// //   col: number;
// //   direction: "across" | "down";
// // };

// // const letterCounts = (letters: string[]): Record<string, number> => {
// //   const counts: Record<string, number> = {};
// //   letters.forEach((l) => {
// //     const ch = l.toUpperCase();
// //     counts[ch] = (counts[ch] || 0) + 1;
// //   });
// //   return counts;
// // };

// // const fitsPool = (word: string, poolCounts: Record<string, number>): boolean => {
// //   const wordCounts: Record<string, number> = {};
// //   for (const ch of word.toUpperCase()) {
// //     wordCounts[ch] = (wordCounts[ch] || 0) + 1;
// //   }
// //   return Object.entries(wordCounts).every(([ch, c]) => (poolCounts[ch] || 0) >= c);
// // };

// // /**
// //  * Every dictionary word that can be spelled from the given letter pool,
// //  * longest first (so the "full" word that produced the tiles is tried first).
// //  */
// // export const findCandidateWords = (
// //   letters: string[],
// //   dictionary: string[],
// //   maxCandidates = 80
// // ): string[] => {
// //   const poolCounts = letterCounts(letters);
// //   const maxLen = letters.length;
// //   const results = dictionary.filter(
// //     (w) => w.length >= 2 && w.length <= maxLen && fitsPool(w, poolCounts)
// //   );
// //   results.sort((a, b) => b.length - a.length || a.localeCompare(b));
// //   // de-dupe case-insensitively while preserving order
// //   const seen = new Set<string>();
// //   const deduped: string[] = [];
// //   for (const w of results) {
// //     const key = w.toUpperCase();
// //     if (seen.has(key)) continue;
// //     seen.add(key);
// //     deduped.push(w);
// //   }
// //   return deduped.slice(0, maxCandidates);
// // };

// // const isValidPlacement = (
// //   word: string,
// //   row: number,
// //   col: number,
// //   direction: "across" | "down",
// //   occupied: Map<string, string>
// // ): boolean => {
// //   for (let k = 0; k < word.length; k++) {
// //     const r = direction === "down" ? row + k : row;
// //     const c = direction === "across" ? col + k : col;
// //     const existing = occupied.get(`${r},${c}`);
// //     if (existing && existing !== word[k].toUpperCase()) return false;
// //   }
// //   return true;
// // };

// // const tryPlaceWord = (
// //   word: string,
// //   occupied: Map<string, string>
// // ): { row: number; col: number; direction: "across" | "down" } | null => {
// //   const upper = word.toUpperCase();
// //   for (const [key, letter] of occupied.entries()) {
// //     const [er, ec] = key.split(",").map(Number);
// //     for (let k = 0; k < upper.length; k++) {
// //       if (upper[k] !== letter) continue;
// //       // try crossing through this shared letter, in both orientations
// //       const candidates: { row: number; col: number; direction: "across" | "down" }[] = [
// //         { row: er, col: ec - k, direction: "across" },
// //         { row: er - k, col: ec, direction: "down" },
// //       ];
// //       for (const cand of candidates) {
// //         if (cand.row < 0 || cand.col < 0) continue;
// //         if (isValidPlacement(word, cand.row, cand.col, cand.direction, occupied)) {
// //           return cand;
// //         }
// //       }
// //     }
// //   }
// //   return null;
// // };

// // /**
// //  * Builds a crossword layout from a letter pool + dictionary. Falls back to a
// //  * single across word (the pool itself, if it happens to be a real word) when
// //  * nothing better can be built.
// //  */
// // export const generatePuzzle = (
// //   letters: string[],
// //   dictionary: string[],
// //   targetWordCount = 6
// // ): WSWordSlot[] => {
// //   const candidates = findCandidateWords(letters, dictionary);
// //   if (candidates.length === 0) return [];

// //   const occupied = new Map<string, string>();
// //   const slots: WSWordSlot[] = [];
// //   const chosen = new Set<string>();

// //   const seed = candidates[0];
// //   for (let k = 0; k < seed.length; k++) occupied.set(`0,${k}`, seed[k].toUpperCase());
// //   slots.push({ word: seed, row: 0, col: 0, direction: "across" });
// //   chosen.add(seed.toUpperCase());

// //   for (const cand of candidates) {
// //     if (slots.length >= targetWordCount) break;
// //     const upper = cand.toUpperCase();
// //     if (chosen.has(upper)) continue;

// //     const placement = tryPlaceWord(cand, occupied);
// //     if (!placement) continue;

// //     for (let k = 0; k < cand.length; k++) {
// //       const r = placement.direction === "down" ? placement.row + k : placement.row;
// //       const c = placement.direction === "across" ? placement.col + k : placement.col;
// //       occupied.set(`${r},${c}`, cand[k].toUpperCase());
// //     }
// //     slots.push({ word: cand, row: placement.row, col: placement.col, direction: placement.direction });
// //     chosen.add(upper);
// //   }

// //   const minRow = Math.min(...slots.map((w) => w.row));
// //   const minCol = Math.min(...slots.map((w) => w.col));
// //   return slots.map((w) => ({ ...w, row: w.row - minRow, col: w.col - minCol }));
// // };
// // Client-side generator for word-connect style puzzles: given a fixed pool of
// // letter tiles, find every real word that can be spelled from that pool
// // (respecting letter counts) and lay the best of them into a single
// // intersecting crossword grid, the way Wordscapes / Arkadium do it.

// export type WSWordSlot = {
//   word: string;
//   row: number;
//   col: number;
//   direction: "across" | "down";
// };

// type Dir = "across" | "down";

// interface GridCell {
//   letter: string;
//   across: boolean; // an across word already uses this cell
//   down: boolean; // a down word already uses this cell
// }

// const MIN_WORD_LEN = 3;

// /* ============================================================
//    Letter pool helpers
// ============================================================ */

// const countLetters = (letters: string[]): Record<string, number> => {
//   const counts: Record<string, number> = {};
//   letters.forEach((l) => {
//     const ch = l.toUpperCase();
//     counts[ch] = (counts[ch] || 0) + 1;
//   });
//   return counts;
// };

// const fitsPool = (word: string, pool: Record<string, number>): boolean => {
//   const need: Record<string, number> = {};
//   for (const ch of word) need[ch] = (need[ch] || 0) + 1;
//   return Object.entries(need).every(([ch, n]) => (pool[ch] || 0) >= n);
// };

// function shuffle<T>(arr: T[]): T[] {
//   const a = [...arr];
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }

// /**
//  * Every dictionary word (3+ letters, UPPERCASE) that can be spelled from the
//  * letter pool, longest first.
//  */
// export const findCandidateWords = (
//   letters: string[],
//   dictionary: string[],
//   maxCandidates = 200
// ): string[] => {
//   const pool = countLetters(letters);
//   const maxLen = letters.length;
//   const seen = new Set<string>();
//   const out: string[] = [];

//   for (const raw of dictionary) {
//     const w = String(raw).trim().toUpperCase();
//     if (w.length < MIN_WORD_LEN || w.length > maxLen) continue;
//     if (!/^[A-Z]+$/.test(w)) continue;
//     if (seen.has(w)) continue;
//     if (!fitsPool(w, pool)) continue;
//     seen.add(w);
//     out.push(w);
//   }

//   out.sort((a, b) => b.length - a.length || a.localeCompare(b));
//   return out.slice(0, maxCandidates);
// };

// /* ============================================================
//    Crossword placement rules
//    - a new word must cross an existing word at a shared letter
//    - it can never overlap another word running in the SAME direction
//    - it can never touch other words side by side (no accidental
//      two-letter "words" next to each other)
// ============================================================ */

// const cellKey = (r: number, c: number) => `${r},${c}`;

// const canPlace = (
//   word: string,
//   row: number,
//   col: number,
//   dir: Dir,
//   grid: Map<string, GridCell>
// ): boolean => {
//   const dr = dir === "down" ? 1 : 0;
//   const dc = dir === "across" ? 1 : 0;

//   // the cells right before the first letter and right after the last letter must be empty
//   if (grid.has(cellKey(row - dr, col - dc))) return false;
//   if (grid.has(cellKey(row + dr * word.length, col + dc * word.length))) return false;

//   let crossings = 0;

//   for (let k = 0; k < word.length; k++) {
//     const r = row + dr * k;
//     const c = col + dc * k;
//     const cell = grid.get(cellKey(r, c));

//     if (cell) {
//       if (cell.letter !== word[k]) return false; // letter clash
//       if (cell[dir]) return false; // would overlap a word going the same way
//       crossings++;
//     } else if (dir === "across") {
//       if (grid.has(cellKey(r - 1, c)) || grid.has(cellKey(r + 1, c))) return false;
//     } else {
//       if (grid.has(cellKey(r, c - 1)) || grid.has(cellKey(r, c + 1))) return false;
//     }
//   }

//   return crossings >= 1 && crossings < word.length;
// };

// const findSpot = (
//   word: string,
//   grid: Map<string, GridCell>
// ): { row: number; col: number; dir: Dir } | null => {
//   const anchors = shuffle(Array.from(grid.entries()));

//   for (const [k, cell] of anchors) {
//     if (cell.across && cell.down) continue; // already a crossing, can't take a third word
//     const [er, ec] = k.split(",").map(Number);
//     const dir: Dir = cell.across ? "down" : "across";

//     for (let i = 0; i < word.length; i++) {
//       if (word[i] !== cell.letter) continue;
//       const row = dir === "down" ? er - i : er;
//       const col = dir === "across" ? ec - i : ec;
//       if (canPlace(word, row, col, dir, grid)) return { row, col, dir };
//     }
//   }
//   return null;
// };

// /* ============================================================
//    MAIN: build a multi-word intersecting crossword layout.
//    Never returns an empty list, so the game screen can't get stuck.

//    fallbackWord: the word the round was built from (round.word). Only used
//    when nothing at all can be built from the dictionary.
// ============================================================ */

// export const generatePuzzle = (
//   letters: string[],
//   dictionary: string[],
//   maxWords: number = 6,
//   fallbackWord?: string
// ): WSWordSlot[] => {
//   // shuffle first, then sort by length: longest words first, random order inside each length
//   const candidates = shuffle(findCandidateWords(letters, dictionary)).sort(
//     (a, b) => b.length - a.length
//   );

//   if (candidates.length === 0) {
//     const pool = countLetters(letters);
//     const fb = (fallbackWord ?? "").trim().toUpperCase();
//     const word = fb.length >= 2 && fitsPool(fb, pool) ? fb : letters.join("").toUpperCase();
//     return [{ word, row: 0, col: 0, direction: "across" }];
//   }

//   const grid = new Map<string, GridCell>();
//   const slots: WSWordSlot[] = [];

//   const put = (word: string, row: number, col: number, dir: Dir) => {
//     for (let k = 0; k < word.length; k++) {
//       const r = dir === "down" ? row + k : row;
//       const c = dir === "across" ? col + k : col;
//       const existing = grid.get(cellKey(r, c));
//       if (existing) {
//         existing[dir] = true;
//       } else {
//         grid.set(cellKey(r, c), {
//           letter: word[k],
//           across: dir === "across",
//           down: dir === "down",
//         });
//       }
//     }
//     slots.push({ word, row, col, direction: dir });
//   };

//   // longest word goes first, across, at the origin
//   put(candidates[0], 0, 0, "across");

//   for (let i = 1; i < candidates.length && slots.length < maxWords; i++) {
//     const spot = findSpot(candidates[i], grid);
//     if (spot) put(candidates[i], spot.row, spot.col, spot.dir);
//   }

//   // shift so the top-left of the grid is (0, 0)
//   const minRow = Math.min(...slots.map((s) => s.row));
//   const minCol = Math.min(...slots.map((s) => s.col));

//   return slots.map((s) => ({ ...s, row: s.row - minRow, col: s.col - minCol }));
// };
export interface WSWordSlot {
  word: string;
  row: number;
  col: number;
  direction: "across" | "down";
}

const MIN_LEN = 3;

// Can `word` be spelled using the wheel letters (each letter used at most as many times as it appears)?
const fitsLetters = (word: string, pool: Record<string, number>) => {
  const used: Record<string, number> = {};
  for (const ch of word) {
    used[ch] = (used[ch] ?? 0) + 1;
    if (used[ch] > (pool[ch] ?? 0)) return false;
  }
  return true;
};

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

type Placed = WSWordSlot;

const key = (r: number, c: number) => `${r},${c}`;

// One attempt at building a crossword. Returns placed words (row/col may be negative).
const buildOnce = (candidates: string[], first: string, maxWords: number): Placed[] => {
  const cells = new Map<string, string>(); // cell -> letter
  const dirs = new Map<string, Set<string>>(); // cell -> directions passing through it
  const placed: Placed[] = [];

  const put = (word: string, row: number, col: number, direction: "across" | "down") => {
    for (let k = 0; k < word.length; k++) {
      const r = direction === "across" ? row : row + k;
      const c = direction === "across" ? col + k : col;
      cells.set(key(r, c), word[k]);
      if (!dirs.has(key(r, c))) dirs.set(key(r, c), new Set());
      dirs.get(key(r, c))!.add(direction);
    }
    placed.push({ word, row, col, direction });
  };

  const canPlace = (word: string, row: number, col: number, direction: "across" | "down") => {
    const dr = direction === "across" ? 0 : 1;
    const dc = direction === "across" ? 1 : 0;

    // cell before start and after end must be empty
    if (cells.has(key(row - dr, col - dc))) return false;
    if (cells.has(key(row + dr * word.length, col + dc * word.length))) return false;

    let crossings = 0;
    for (let k = 0; k < word.length; k++) {
      const r = row + dr * k;
      const c = col + dc * k;
      const existing = cells.get(key(r, c));
      if (existing) {
        if (existing !== word[k]) return false;
        if (dirs.get(key(r, c))!.has(direction)) return false; // overlapping same-direction word
        crossings++;
      } else {
        // side neighbours must be empty, otherwise words would touch without crossing
        const s1 = key(r + dc, c + dr);
        const s2 = key(r - dc, c - dr);
        if (cells.has(s1) || cells.has(s2)) return false;
      }
    }
    return crossings === 1; // exactly one crossing keeps the layout clean
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
};

/**
 * Builds a crossword-style layout (words crossing each other) from the wheel letters.
 * Deterministic output is NOT guaranteed - for "same puzzle for every player",
 * run this on the backend once per round and send the result in `round.words`.
 */
export function generatePuzzle(
  letters: string[],
  dictionary: string[],
  maxWords = 6,
  mainWord?: string
): WSWordSlot[] {
  const pool: Record<string, number> = {};
  letters.forEach((l) => {
    const k = l.toLowerCase();
    pool[k] = (pool[k] ?? 0) + 1;
  });

  const all = Array.from(
    new Set(
      dictionary
        .map((w) => w.toLowerCase())
        .filter((w) => w.length >= MIN_LEN && w.length <= letters.length && /^[a-z]+$/.test(w) && fitsLetters(w, pool))
    )
  );

  const main = mainWord && fitsLetters(mainWord.toLowerCase(), pool) ? mainWord.toLowerCase() : undefined;
  const start = main ?? all.sort((a, b) => b.length - a.length)[0];
  if (!start) return [];

  let best: Placed[] = [];
  for (let attempt = 0; attempt < 60; attempt++) {
    const candidates = shuffle(all.filter((w) => w !== start)).sort((a, b) => b.length - a.length + (Math.random() - 0.5) * 2);
    const result = buildOnce(candidates, start, maxWords);
    if (result.length > best.length) best = result;
    if (best.length >= maxWords) break;
  }

  // normalise so the top-left cell is (0, 0)
  const minR = Math.min(...best.map((w) => w.row));
  const minC = Math.min(...best.map((w) => w.col));
  return best.map((w) => ({ ...w, row: w.row - minR, col: w.col - minC }));
}