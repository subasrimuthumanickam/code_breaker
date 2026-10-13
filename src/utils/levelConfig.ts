/**
 * Maps a level / round number (1–50) to how many words the crossword
 * for that level should contain.
 *
 *  Level 1–5   -> 2-word cross
 *  Level 6–15  -> 3-word cross
 *  Level 16–30 -> 4-word cross
 *  Level 31–50 -> 5-word cross
 *
 * Anything above 50 just keeps using the top tier (5 words) so the
 * game doesn't break if more levels get added later.
 */
export function getWordCountForLevel(level: number): number {
  if (level <= 5) return 2;
  if (level <= 15) return 3;
  if (level <= 30) return 4;
  return 5;
}