
function computeFeedback(secret, guess) {
  const length = secret.length;
  const secretUsed = new Array(length).fill(false);
  const guessUsed = new Array(length).fill(false);

  let exactMatches = 0;
  for (let i = 0; i < length; i++) {
    if (secret[i] === guess[i]) {
      exactMatches++;
      secretUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  let partialMatches = 0;
  for (let i = 0; i < length; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < length; j++) {
      if (secretUsed[j]) continue;
      if (guess[i] === secret[j]) {
        partialMatches++;
        secretUsed[j] = true;
        break;
      }
    }
  }

  return { exactMatches, partialMatches };
}

/**
 * "direct" clue (Easy): for each position, reveal the secret digit if this
 * guess got that position right, otherwise null (shown as "*" on the client).
 */
function computeDirectReveal(secret, guess) {
  return secret.map((digit, i) => (guess[i] === digit ? digit : null));
}

/**
 * Once a position is found in ANY guess, it should stay revealed in later
 * guesses. Merge keeps whatever was already found and adds newly found ones.
 */
function mergeReveal(previousRevealed, newRevealed) {
  return previousRevealed.map((prev, i) => (prev !== null ? prev : newRevealed[i]));
}

/** How many NEW positions this guess revealed (drives the "found a number!" popup) */
function countNewlyRevealed(previousRevealed, mergedRevealed) {
  let count = 0;
  for (let i = 0; i < mergedRevealed.length; i++) {
    if (previousRevealed[i] === null && mergedRevealed[i] !== null) count++;
  }
  return count;
}

// "?" placeholder string <-> array helpers for the DB column
function revealToStr(revealed) {
  return revealed.map((d) => (d === null ? "?" : String(d))).join("");
}
function strToReveal(str) {
  return str.split("").map((c) => (c === "?" ? null : Number(c)));
}

function feedbackLabel(fb, codeLength) {
  if (fb.exactMatches === codeLength) return "Cracked!";
  if (fb.exactMatches === 0 && (fb.partialMatches ?? 0) === 0) return "No correct number";
  const parts = [];
  if (fb.exactMatches > 0) {
    parts.push(`${fb.exactMatches} correct position${fb.exactMatches > 1 ? "s" : ""}`);
  }
  if (fb.partialMatches) {
    parts.push(`${fb.partialMatches} correct number${fb.partialMatches > 1 ? "s" : ""}, wrong place`);
  }
  return parts.join(" · ");
}

module.exports = {
  computeFeedback,
  computeDirectReveal,
  mergeReveal,
  countNewlyRevealed,
  revealToStr,
  strToReveal,
  feedbackLabel,
};