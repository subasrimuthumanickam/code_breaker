
import { BT_API } from './config';

export type Level4Start = {
  success: boolean;
  sessionId: number;
  level: number;
  status: string;
  question: string;
  hintLevel: number | null;   // water line, only after the clue was opened in this game
  hints: number;
  wrongAttempts: number;
};

export type Level4Answer = {
  success: boolean;
  correct: boolean;
  completed: boolean;
  skipped?: boolean;
  outcome?: 'splash' | 'too_shallow' | 'hit_bottom' | string;
  message?: string;
  wrongAttempts?: number;
  score?: number;
  stars?: number;
  attempts?: number;
  progressSaved?: boolean;
  next?: number;
  hints?: number;
};

export type Level4Hint = {
  success: boolean;
  hint: { level?: number; step?: number; text?: string };
  charged?: boolean;          // always false now: the clue is free
  hints: number;
};

export type Level4Reward = {
  success: boolean;
  added: number;
  hints: number;
};

const call = async (path: string, body: unknown) => {
  const url = `${BT_API}${path}`;

  console.log('[BT Level4 API] POST', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  let data: any;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Invalid server response (${response.status})`);
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || data.error || `Request failed (${response.status})`);
  }

  return data;
};

// 1. open level 4 (creates or resumes a session)
export const startLevel4 = (playerId: number): Promise<Level4Start> =>
  call('/level4/start', { playerId });

// 2. JUMP: frontend sends the water level (0-100), backend decides splash / too_shallow / hit_bottom
export const jumpLevel4 = (params: {
  sessionId: number;
  playerId: number;
  waterLevel: number;
}): Promise<Level4Answer> => call('/level4/jump', params);

// 3. magnifier: FREE. The backend saves the view in MySQL and sends the
//    hint step + text + water line back as JSON (no hints or coins are taken)
export const hintLevel4 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level4Hint> => call('/level4/hint', params);

// 4. skip the level (costs 50 hints)
export const skipLevel4 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level4Answer> => call('/level4/skip', params);

// 5. video reward (+75 hints)
export const rewardLevel4 = (playerId: number): Promise<Level4Reward> =>
  call('/level4/reward', { playerId, kind: 'video' });