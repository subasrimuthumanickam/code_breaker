
import { BT_API } from './config';

export type Level25Start = {
  success: boolean;
  sessionId: number;
  level: number;
  title: string;   // "Save Tung Tung Tung Sahur from the police!"
  hints: number;   // current hint balance
};

export type Level25Hint = {
  success: boolean;
  hintNo: number;     // how many times this session opened the hint
  free: boolean;
  cost: number;
  text: string;       // the hint text (from the backend / database)
  message: string;
};

export type Level25Action = {
  success: boolean;
  correct: boolean;
  completed: boolean;
  message?: string;
  wrongAttempts?: number;
  score?: number;
  stars?: number;
  attempts?: number;
  progressSaved?: boolean;
  skipped?: boolean;
  hints?: number;
};

const call = async (path: string, body: unknown) => {
  const url = `${BT_API}${path}`;
  console.log('[BT Level25 API] POST', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
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

export const startLevel25 = (playerId: number): Promise<Level25Start> =>
  call('/level25/start', { playerId });

// magnifier pressed: the backend saves the hint request in the database
// and sends the hint text back as JSON
export const requestHint25 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level25Hint> =>
  call('/level25/hint', {
    sessionId: params.sessionId,
    playerId: params.playerId,
  });

// the player dropped an item on a target. item = 'van', target = 'door_left' | 'door_right'
export const sendAction25 = (params: {
  sessionId: number;
  playerId: number;
  item: string;
  target: string;
}): Promise<Level25Action> =>
  call('/level25/action', {
    sessionId: params.sessionId,
    playerId: params.playerId,
    item: params.item,
    target: params.target,
  });

// skip Level 25 (costs hints) -> level completes, Level 26 unlocks
export const skipLevel25 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level25Action> =>
  call('/level25/skip', {
    sessionId: params.sessionId,
    playerId: params.playerId,
  });