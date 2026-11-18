
import { BT_API } from './config';

export type Level9View = {
  success: boolean;
  sessionId: number;
  level: number;
  status: string;
  title: string;
  cols: number;
  rows: number;
  cells: number[];
  start: number;
  goal: number;
  hints: number;
};

export type Level9Result = {
  success: boolean;
  completed: boolean;
  skipped?: boolean;
  message?: string;
  score?: number;
  stars?: number;
  attempts?: number;
  moves?: number;
  seconds?: number;
  progressSaved?: boolean;
  next?: number;
  hints?: number;
};

export type Level9Hint = {
  success: boolean;
  clue: string;         // the clue text, sent by the server
  path: number[];       // kept for later use (empty now)
  hints: number;        // the player's hints (the clue does not take any)
  cost: number;         // always 0: the clue is free
};

export type Level9Reward = {
  success: boolean;
  added: number;
  hints: number;
};

const call = async (path: string, body: unknown) => {
  const url = `${BT_API}${path}`;

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
    const err: any = new Error(data.message || data.error || `Request failed (${response.status})`);
    err.status = response.status;
    throw err;
  }

  return data;
};

// 1. open level 9 (the server makes a NEW maze every time)
export const startLevel9 = (playerId: number): Promise<Level9View> =>
  call('/level9/start', { playerId });

// 2. the dog reached the bone: tell the server, it saves the win
export const finishLevel9 = (params: {
  sessionId: number;
  playerId: number;
  path: number[];
  moves: number;
}): Promise<Level9Result> => call('/level9/finish', params);

// 3. magnifier: the server saves the request in the database and answers with the clue text (free)
//    cell = the cell the dog stands on, or -1 when the dog is outside the maze
export const hintLevel9 = (params: {
  sessionId: number;
  playerId: number;
  cell: number;
}): Promise<Level9Hint> => call('/level9/hint', params);

// 4. skip the level (costs 50 hints)
export const skipLevel9 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level9Result> => call('/level9/skip', params);

// 5. video reward (+75 hints)
export const rewardLevel9 = (playerId: number): Promise<Level9Reward> =>
  call('/level9/reward', { playerId, kind: 'video' });