import { BT_API } from './config';

// all positions are in units of the scene width (x 0..1, y in the same unit)
export type Level26Cloud = {
  id: number;
  x: number;            // centre of the cloud
  y: number;
  w: number;            // drawn width
  r: number;            // how far the cloud reaches around its centre
  tone: 'blue' | 'gray';
};

export type Level26View = {
  success: boolean;
  sessionId: number;
  level: number;
  status: string;
  title: string;
  sun: { x: number; y: number; r: number; margin: number };
  clouds: Level26Cloud[];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  hints: number;
};

// one drag of a cloud (where the cloud was dropped)
export type Level26Action = { t: 'drag'; id: number; x: number; y: number };

export type Level26Result = {
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

export type Level26Hint = {
  success: boolean;
  clue: string;                       // text for the CLUES popup
  target: number | null;              // id of the cloud to move (null when the clue was free)
  dir: 'L' | 'R' | null;              // side to move it to (null when the clue was free)
  hints: number;                      // hints left
  charged: boolean;                   // true when 25 hints were taken
  cost: number;                       // 25 when charged, otherwise 0
};

export type Level26Reward = {
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

// 1. open level 26 (the server sends the sun, the clouds and a new session)
export const startLevel26 = (playerId: number): Promise<Level26View> =>
  call('/level26/start', { playerId });

// 2. sun is free: send every drag, the server plays them again, checks and saves the win
export const finishLevel26 = (params: {
  sessionId: number;
  playerId: number;
  actions: Level26Action[];
}): Promise<Level26Result> => call('/level26/finish', params);

// 3. magnifier: the server saves the request and sends the clue (25 hints for the cloud arrow)
export const hintLevel26 = (params: {
  sessionId: number;
  playerId: number;
  clouds: { id: number; x: number; y: number }[];
}): Promise<Level26Hint> => call('/level26/hint', params);

// 4. skip the level (costs 50 hints)
export const skipLevel26 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level26Result> => call('/level26/skip', params);

// 5. video reward (+25 hints)
export const rewardLevel26 = (playerId: number): Promise<Level26Reward> =>
  call('/level26/reward', { playerId, kind: 'video' });