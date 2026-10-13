import { API_BASE_URL } from "./api"; // same import Wordscrambleapi.ts uses

const WS_API_URL = `${API_BASE_URL}/wordscramble`;

export type LevelStatus = "locked" | "unlocked" | "completed";

export interface LevelInfo {
  levelNumber: number;
  zoneName: string;
  difficulty: "easy" | "medium" | "hard";
  totalRounds: number;
  timeLimitSec: number;
  lives: number;
  targetScore: number;
  status: LevelStatus;
  stars: number;
  bestScore: number;
}

export interface LevelsResponse {
  success: boolean;
  currentLevel: number;
  totalStars: number;
  maxStars: number;
  levels: LevelInfo[];
}

export interface CompleteLevelResult {
  success: boolean;
  levelNumber: number;
  stars: number;
  bestScore: number;
  newlyUnlocked: number | null;
}

async function errorMessage(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return data?.error || data?.message || fallback;
  } catch {
    return fallback;
  }
}

/** GET /api/wordscramble/levels?playerName=X */
export async function fetchLevels(playerName: string): Promise<LevelsResponse> {
  const response = await fetch(
    `${WS_API_URL}/levels?playerName=${encodeURIComponent(playerName)}`
  );
  if (!response.ok) {
    throw new Error(
      await errorMessage(response, `Failed to load levels: ${response.status}`)
    );
  }
  return response.json();
}

/** POST /api/wordscramble/levels/:levelNumber/complete */
export async function completeLevel(
  levelNumber: number,
  playerName: string,
  score: number
): Promise<CompleteLevelResult> {
  const response = await fetch(`${WS_API_URL}/levels/${levelNumber}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName, score }),
  });
  if (!response.ok) {
    throw new Error(
      await errorMessage(response, `Failed to save level: ${response.status}`)
    );
  }
  return response.json();
}