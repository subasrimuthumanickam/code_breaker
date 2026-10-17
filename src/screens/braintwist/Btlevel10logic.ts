/* ---------------------------------------------------------
   LEVEL 10 - "tilt" tic-tac-toe (the same rules as the server)

   board: 9 numbers, 0 = empty, 1 = X (the player), 2 = O (the rival)
   TAP an empty square -> the rival answers at once
   SWIPE the board     -> every piece slides to that side like gravity
--------------------------------------------------------- */

export type Board = number[];
export type Dir = 'L' | 'R' | 'U' | 'D';
export type Status = 'play' | 'win' | 'lose' | 'draw';

export const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];
export const DIRS: Dir[] = ['L', 'R', 'U', 'D'];

export const winLine = (b: Board, p: number): number[] | null =>
  LINES.find((l) => l.every((i) => b[i] === p)) || null;

const isFull = (b: Board) => b.every((v) => v !== 0);

// 'win' = X has a line and O has none, 'lose' = O has a line, 'draw' = full, else 'play'
export const status = (b: Board): Status => {
  const x = winLine(b, 1);
  const o = winLine(b, 2);
  if (x && !o) return 'win';
  if (o) return 'lose';
  if (isFull(b)) return 'draw';
  return 'play';
};

// the square that completes a line for player p (or -1)
const completing = (b: Board, p: number) => {
  for (const l of LINES) {
    const v = l.map((i) => b[i]);
    if (v.filter((x) => x === p).length === 2 && v.includes(0)) return l[v.indexOf(0)];
  }
  return -1;
};

// the rival: win if it can, else block, else centre, else a corner, else the first free square
const rivalMove = (b: Board) => {
  let c = completing(b, 2);
  if (c >= 0) return c;
  c = completing(b, 1);
  if (c >= 0) return c;
  if (b[4] === 0) return 4;
  for (const k of [0, 2, 6, 8]) if (b[k] === 0) return k;
  return b.indexOf(0);
};

// X taps a square, the rival answers
export const tap = (board: Board, c: number): { board: Board; status: Status; rival: number } => {
  const b = board.slice();
  b[c] = 1;
  const s = status(b);
  if (s !== 'play') return { board: b, status: s, rival: -1 };
  const r = rivalMove(b);
  if (r < 0) return { board: b, status: 'draw', rival: -1 };
  b[r] = 2;
  return { board: b, status: status(b), rival: r };
};

// every piece slides to one side, order kept -> where each piece goes
export const tiltMoves = (b: Board, d: Dir): { from: number; to: number }[] => {
  const moves: { from: number; to: number }[] = [];
  for (let k = 0; k < 3; k += 1) {
    const idx = [0, 1, 2].map((i) => (d === 'L' || d === 'R' ? k * 3 + i : i * 3 + k));
    const pieces = idx.filter((i) => b[i] !== 0);
    const target = d === 'L' || d === 'U' ? idx.slice(0, pieces.length) : idx.slice(3 - pieces.length);
    pieces.forEach((from, n) => moves.push({ from, to: target[n] }));
  }
  return moves;
};

export const tilt = (b: Board, d: Dir): Board => {
  const n = new Array(9).fill(0);
  tiltMoves(b, d).forEach((m) => { n[m.to] = b[m.from]; });
  return n;
};