
import { API_BASE_URL } from "./api"; 

const API = `${API_BASE_URL}/skip`;

export interface SkipStats {
  roundsCompleted: number;
  totalRounds: number;
  starsEarned: number;
}

export interface SkipStatusResponse {
  success: boolean;
  skips: number;
  message?: string;
}

export interface SkipClaimResponse {
  success: boolean;
  awarded?: boolean;
  reward?: number;
  skips: number;
  stats: SkipStats;
  message?: string;
}

export interface SkipUseResponse {
  success: boolean;
  skips: number;
  insufficient?: boolean;
  message?: string;
}

const json = async <T>(res: Response): Promise<T> => {
  try {
    return await res.json();
  } catch {
    return {
      success: false,
      message: "Bad server response",
    } as T;
  }
};

export const fetchSkipStatus = async (
  playerName: string
): Promise<SkipStatusResponse> => {
  const res = await fetch(
    `${API}/status/${encodeURIComponent(playerName)}`
  );

  return json<SkipStatusResponse>(res);
};

export const claimSkipReward = async (
  playerName: string,
  setKey: string,
  totalRounds: number,
  starsEarned: number
): Promise<SkipClaimResponse> => {
  const res = await fetch(`${API}/claim`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      playerName,
      setKey,
      totalRounds,
      starsEarned,
    }),
  });

  return json<SkipClaimResponse>(res);
};

export const consumeSkip = async (
  playerName: string,
  roundId: string,
  roundNumber: number
): Promise<SkipUseResponse> => {
  const res = await fetch(`${API}/use`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      playerName,
      roundId,
      roundNumber,
    }),
  });

  return json<SkipUseResponse>(res);
};