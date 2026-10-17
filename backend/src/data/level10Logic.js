/* ---------------------------------------------------------
   LEVEL 10 - "tilt" tic-tac-toe (server copy of the rules)

   board: 9 numbers, 0 = empty, 1 = X (the player), 2 = O (the rival)
   The player may TAP an empty square (the rival answers at once)
   or SWIPE the board: every piece slides to that side like gravity.
   The start boards look lost for X, and tapping can never win.
   The only win is the right swipe.
--------------------------------------------------------- */

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];
const DIRS = ['L', 'R', 'U', 'D'];

const winLine = (b, p) => LINES.find((l) => l.every((i) => b[i] === p)) || null;
const isFull = (b) => b.every((v) => v !== 0);

// 'win' = X has a line and O has none, 'lose' = O has a line, 'draw' = full, else 'play'
const status = (b) => {
  const x = winLine(b, 1);
  const o = winLine(b, 2);
  if (x && !o) return 'win';
  if (o) return 'lose';
  if (isFull(b)) return 'draw';
  return 'play';
};

// the square that completes a line for player p (or -1)
const completing = (b, p) => {
  for (const l of LINES) {
    const v = l.map((i) => b[i]);
    if (v.filter((x) => x === p).length === 2 && v.includes(0)) return l[v.indexOf(0)];
  }
  return -1;
};

// the rival: win if it can, else block, else centre, else a corner, else the first free square
const rivalMove = (b) => {
  let c = completing(b, 2);
  if (c >= 0) return c;
  c = completing(b, 1);
  if (c >= 0) return c;
  if (b[4] === 0) return 4;
  for (const k of [0, 2, 6, 8]) if (b[k] === 0) return k;
  return b.indexOf(0);
};

// X taps a square, the rival answers. -> { board, status, rival }
const tap = (board, c) => {
  const b = board.slice();
  b[c] = 1;
  let s = status(b);
  if (s !== 'play') return { board: b, status: s, rival: -1 };
  const r = rivalMove(b);
  if (r < 0) return { board: b, status: 'draw', rival: -1 };
  b[r] = 2;
  return { board: b, status: status(b), rival: r };
};

// every piece slides to one side, order kept. -> [{ from, to }] for each piece
const tiltMoves = (b, d) => {
  const moves = [];
  for (let k = 0; k < 3; k += 1) {
    const idx = [0, 1, 2].map((i) => (d === 'L' || d === 'R' ? k * 3 + i : i * 3 + k));
    const pieces = idx.filter((i) => b[i] !== 0);
    const target = d === 'L' || d === 'U' ? idx.slice(0, pieces.length) : idx.slice(3 - pieces.length);
    pieces.forEach((from, n) => moves.push({ from, to: target[n] }));
  }
  return moves;
};

const tilt = (b, d) => {
  const n = new Array(9).fill(0);
  tiltMoves(b, d).forEach((m) => { n[m.to] = b[m.from]; });
  return n;
};

// the swipe that makes X win from this board (or null)
const solveDir = (b) => {
  for (const d of DIRS) {
    const t = tilt(b, d);
    if (t.some((v, i) => v !== b[i]) && status(t) === 'win') return d;
  }
  return null;
};

// can X win by tapping only? (used to prove the start boards are tricky)
const tapOnlyWin = (b) => {
  for (let c = 0; c < 9; c += 1) {
    if (b[c] !== 0) continue;
    const r = tap(b, c);
    if (r.status === 'win') return true;
    if (r.status === 'play' && tapOnlyWin(r.board)) return true;
  }
  return false;
};

/* the start boards: one base board, turned and mirrored = 8 boards */
const BASE = [1, 2, 2, 1, 0, 2, 2, 1, 0];
const ROT = [6, 3, 0, 7, 4, 1, 8, 5, 2];
const MIR = [2, 1, 0, 5, 4, 3, 8, 7, 6];
const BOARDS = (() => {
  const out = [];
  [BASE, BASE.map((_, i) => BASE[MIR[i]])].forEach((start) => {
    let b = start;
    for (let k = 0; k < 4; k += 1) {
      out.push(b);
      b = b.map((_, i) => b[ROT[i]]);
    }
  });
  return out;
})();

const initialBoard = (seed) => BOARDS[Math.abs(Number(seed) || 0) % BOARDS.length].slice();

/* replay what the player did: actions = [{ t:'tap', c:4 }, { t:'swipe', d:'R' }]
   -> { ok, board, status } ; ok = false when an action is not allowed */
const play = (start, actions) => {
  let b = start.slice();
  let s = 'play';
  if (!Array.isArray(actions) || actions.length > 60) return { ok: false, board: b, status: s };

  for (const a of actions) {
    if (s !== 'play') return { ok: false, board: b, status: s };   // moves after the end
    if (!a || typeof a !== 'object') return { ok: false, board: b, status: s };

    if (a.t === 'tap') {
      if (!Number.isInteger(a.c) || a.c < 0 || a.c > 8 || b[a.c] !== 0) return { ok: false, board: b, status: s };
      const r = tap(b, a.c);
      b = r.board;
      s = r.status;
    } else if (a.t === 'swipe') {
      if (!DIRS.includes(a.d)) return { ok: false, board: b, status: s };
      b = tilt(b, a.d);
      s = status(b);
    } else {
      return { ok: false, board: b, status: s };
    }
  }
  return { ok: true, board: b, status: s };
};

module.exports = {
  LINES, DIRS, BOARDS,
  winLine, status, tap, tilt, tiltMoves, solveDir, tapOnlyWin, initialBoard, play,
};