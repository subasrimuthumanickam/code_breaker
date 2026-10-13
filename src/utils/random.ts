/**
 * Fisher-Yates shuffle. Never mutates the input array.
 */
function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a brand-new secret code every time it's called — digits 0-9,
 * no repeats within the code. Since codeLength never exceeds 6 in any
 * difficulty and there are 10 possible digits, a repeat-free code is
 * always achievable.
 */
export function generateSecretCode(codeLength: number): number[] {
  const digitPool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return shuffle(digitPool).slice(0, codeLength);
}

export function codeToDisplayString(code: number[]): string {
  return code.join("");
}