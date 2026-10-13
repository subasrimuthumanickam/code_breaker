/**
 * Maps a level / round number (1–50) to how many words the crossword
 * for that level should contain. Mirrors utils/levelConfig.ts on the
 * frontend so both sides agree on puzzle difficulty per level.
 *
 *  Level 1–5   -> 2-word cross
 *  Level 6–15  -> 3-word cross
 *  Level 16–30 -> 4-word cross
 *  Level 31–50 -> 5-word cross
 *
 * Anything above 50 keeps using the top tier (5 words).
 */
function getWordCountForLevel(level) {
  const lvl = Number(level) || 1;
  if (lvl <= 5) return 2;
  if (lvl <= 15) return 3;
  if (lvl <= 30) return 4;
  return 5;
}

module.exports = { getWordCountForLevel };