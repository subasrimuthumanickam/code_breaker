// Example client for the React Native app — drop this in e.g. utils/gameApi.ts
// and swap out the local generateSecretCode()/computeFeedback() calls in
// GameScreen.tsx for these instead.

const BASE_URL = "http://YOUR_BACKEND_HOST:4000/api"; // e.g. your machine's LAN IP for Expo Go

export interface GameState {
  gameId: string;
  difficulty: string;
  codeLength: number;
  maxAttempts: number;
  timeLimitSec: number;
  attemptsUsed: number;
  attemptsLeft: number;
  score: number;
  status: "playing" | "won" | "lost";
  secretCode?: number[];
}

export interface GuessResult extends GameState {
  feedback: { exactMatches: number; partialMatches: number };
}

export async function startGame(difficulty: string): Promise<GameState> {
  const res = await fetch(`${BASE_URL}/games/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ difficulty }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to start game");
  return res.json();
}

export async function submitGuess(
  gameId: string,
  guess: number[],
  timeLeft: number
): Promise<GuessResult> {
  const res = await fetch(`${BASE_URL}/games/${gameId}/guess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guess, timeLeft }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to submit guess");
  return res.json();
}

export async function getHighScore(): Promise<number> {
  const res = await fetch(`${BASE_URL}/highscore`);
  const data = await res.json();
  return data.highScore;
}
