import { BT_API } from './config';

export type CalendarDate = { weekday: string; month: string; day: number };

export type Level12View = {
  success: boolean;
  sessionId: number;
  level: number;
  status: string;
  title: string;
  calendar: CalendarDate;          // what the calendar shows at the start (TUESDAY OCT 1)
  hints: number;
};

export type Level12Result = {
  success: boolean;
  correct: boolean;
  completed: boolean;
  skipped?: boolean;
  message?: string;
  calendar?: CalendarDate;         // the new date, sent when the answer is right (WEDNESDAY OCT 2)
  score?: number;
  stars?: number;
  attempts?: number;
  seconds?: number;
  progressSaved?: boolean;
  next?: number;
  hints?: number;
};

export type Level12Hint = {
  success: boolean;
  text: string;
  target: string;
  hints: number;
  cost: number;
};

export type Level12Reward = {
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

// 1. open level 12 (creates a new game)
export const startLevel12 = (playerId: number): Promise<Level12View> =>
  call('/level12/start', { playerId });

// 2. the player tapped something in the room: the server decides if it is the right answer
export const tapLevel12 = (params: {
  sessionId: number;
  playerId: number;
  target: string;
}): Promise<Level12Result> => call('/level12/tap', params);

// 3. magnifier: tells which thing to look at (costs 25 hints)
export const hintLevel12 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level12Hint> => call('/level12/hint', params);

// 4. skip the level (costs 50 hints)
export const skipLevel12 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level12Result> => call('/level12/skip', params);

// 5. video reward (+75 hints)
export const rewardLevel12 = (playerId: number): Promise<Level12Reward> =>
  call('/level12/reward', { playerId, kind: 'video' });