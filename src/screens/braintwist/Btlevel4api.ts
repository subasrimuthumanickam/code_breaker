import { BT_API } from './config';

export type Level4Start = {
  success: boolean;
  sessionId: number;
  level: number;
  status: string;
  question: string;
  hintLevel: number | null;      // water line shown after the magnifier was used
  hints: number;
  wrongAttempts: number;
};

export type Level4Answer = {
  success: boolean;
  correct: boolean;
  completed: boolean;
  outcome?: 'splash' | 'too_shallow' | 'hit_bottom';
  skipped?: boolean;
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
  hint: { level?: number; text?: string };
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

// 2. JUMP button: send how high the player raised the water (0 - 100)
export const jumpLevel4 = (params: {
  sessionId: number;
  playerId: number;
  waterLevel: number;
}): Promise<Level4Answer> => call('/level4/jump', params);

// 3. magnifier: shows the water line to reach (costs 25 hints)
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