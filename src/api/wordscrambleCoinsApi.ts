
const BASE_URL = "http://localhost:4000/api/wordscramble/coins";

export interface CoinsResponse {
  success: boolean;
  coins: number;
  hintTokens?: number; // free hints won on the Lucky Spin
  bonusSeconds?: number; // banked extra time for the next round
  message?: string;
}
export interface HintCoinResponse extends CoinsResponse {
  insufficient?: boolean;
  usedToken?: boolean;
  cost?: number;
}
export interface LevelBonusResponse extends CoinsResponse {
  roundReward?: number;
  giftBonus?: number;
  giftClueGranted?: boolean;
  bonus?: number;
  bonusGranted?: boolean;
}

// Returns the JSON body even for 402/400 so the screen can read `insufficient` etc.
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return (await res.json()) as T;
}

const post = <T,>(path: string, body: object) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body) });

export const fetchCoins = (playerName: string) =>
  request<CoinsResponse>(`/${encodeURIComponent(playerName)}`);

export const spendHintCoins = (playerName: string, roundId: string) =>
  post<HintCoinResponse>("/hint", { playerName, roundId });

export const claimLevelBonus = (playerName: string, roundId: string, level: number) =>
  post<LevelBonusResponse>("/level-complete", { playerName, roundId, level });

/* ---------- Lucky Spin (after every 5th level) ---------- */
export interface SpinSegment {
  id: string;
  type: "coins" | "hints" | "time";
  amount: number;
  label: string;
  emoji: string;
  color: string;
}
export interface SpinConfigResponse {
  success: boolean;
  segments: SpinSegment[];
}
export interface SpinResponse extends CoinsResponse {
  alreadySpun?: boolean;
  segmentIndex?: number;
  prize?: SpinSegment;
}
export interface TimeBoostResponse extends CoinsResponse {
  seconds?: number;
}

export const fetchSpinConfig = () => request<SpinConfigResponse>("/spin/config");

export const spinWheel = (playerName: string, roundId: string, level: number) =>
  post<SpinResponse>("/spin", { playerName, roundId, level });

export const claimTimeBoost = (playerName: string, roundId: string) =>
  post<TimeBoostResponse>("/time-boost", { playerName, roundId });