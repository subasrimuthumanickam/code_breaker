// backend/src/utils/clue.js
//
// Shapes the clue text shown to the player based on the difficulty's
// clueType. Real word-puzzle apps (Wordscapes, Word Cookies) do this same
// thing: Easy gives you almost everything, Hard makes you work for it.
//
//  - "direct":   full clue text as stored in DB, plus letter reveals allowed
//  - "moderate": full clue text, but no free letter reveal
//  - "vague":    a shortened / softened version of the clue (least helpful)

function buildClue(rawClue, clueType) {
  switch (clueType) {
    case "direct":
      return rawClue;
    case "moderate":
      return rawClue;
    case "vague":
      return vagueify(rawClue);
    default:
      return rawClue;
  }
}

// Cuts a full clue down to roughly half its words + "..." so Hard mode
// players get a hint without the full definition.
// e.g. "an outdoor area where plants are grown" -> "an outdoor area..."
function vagueify(rawClue) {
  const words = rawClue.trim().split(/\s+/);
  const cut = Math.max(2, Math.ceil(words.length / 2));
  return words.slice(0, cut).join(" ") + "...";
}

// Applies a free letter reveal to a scrambled/answer word, used only when
// the difficulty's freeReveals > 0 (Easy mode).
// revealedSoFar: e.g. "G?R??N", word: "GARDEN" -> reveals the next "?" slot
function revealNextLetter(word, revealedSoFar) {
  const chars = revealedSoFar ? revealedSoFar.split("") : word.split("").map(() => "?");
  const nextIdx = chars.findIndex((c) => c === "?");
  if (nextIdx === -1) return chars.join(""); // already fully revealed
  chars[nextIdx] = word[nextIdx];
  return chars.join("");
}

module.exports = { buildClue, revealNextLetter };