
// import { BT_API } from './config';

// export type Level2View = {
//   title: string;
//   hint: string;
//   clueIcon: string;
//   clueText: string;
//   length: number;
// };

// export type Level2Start = Level2View & {
//   success: boolean;
//   sessionId: number;
//   level: number;
//   status: string;
// };

// export type Level2Action = {
//   success: boolean;
//   correct: boolean;
//   completed: boolean;
//   message?: string;
//   wrongAttempts?: number;
//   score?: number;
//   stars?: number;
//   attempts?: number;
//   progressSaved?: boolean;
// };

// const call = async (path: string, body: unknown) => {
//   const url = `${BT_API}${path}`;
//   console.log('[BT Level2 API] POST', url);

//   const response = await fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
//     body: JSON.stringify(body),
//   });

//   const text = await response.text();
//   let data: any;

//   try {
//     data = text ? JSON.parse(text) : {};
//   } catch {
//     throw new Error(`Invalid server response (${response.status})`);
//   }

//   if (!response.ok || data.success === false) {
//     throw new Error(data.message || data.error || `Request failed (${response.status})`);
//   }

//   return data;
// };

// export const startLevel2 = (playerId: number): Promise<Level2Start> =>
//   call('/level2/start', { playerId });

// export const submitWord = (params: {
//   sessionId: number;
//   playerId: number;
//   answer: string;
// }): Promise<Level2Action> =>
//   call('/level2/action', {
//     sessionId: params.sessionId,
//     playerId: params.playerId,
//     answer: params.answer,
//   });
import { BT_API } from './config';

export type Level2View = {
  title: string;
  hint: string;
  clueIcon: string;
  clueText: string;
  length: number;
};

export type Level2Start = Level2View & {
  success: boolean;
  sessionId: number;
  level: number;
  status: string;
};

export type Level2Action = {
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

export type Level2Hint = {
  success: boolean;
  charged: boolean;      // false when there is nothing more to reveal (no cost)
  prefix?: string;       // letters revealed so far (e.g. "RA")
  hints: number;         // new hint balance
  message?: string;
};

const call = async (path: string, body: unknown) => {
  const url = `${BT_API}${path}`;
  console.log('[BT Level2 API] POST', url);

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

export const startLevel2 = (playerId: number): Promise<Level2Start> =>
  call('/level2/start', { playerId });

export const submitWord = (params: {
  sessionId: number;
  playerId: number;
  answer: string;
}): Promise<Level2Action> =>
  call('/level2/action', {
    sessionId: params.sessionId,
    playerId: params.playerId,
    answer: params.answer,
  });

// reveal the next letter of the answer (costs hints)
export const requestHint = (params: {
  sessionId: number;
  playerId: number;
  revealed: number;
}): Promise<Level2Hint> =>
  call('/level2/hint', {
    sessionId: params.sessionId,
    playerId: params.playerId,
    revealed: params.revealed,
  });

// skip Level 2 (costs hints) -> level completes, Level 3 unlocks
export const skipLevel2 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level2Action> =>
  call('/level2/skip', {
    sessionId: params.sessionId,
    playerId: params.playerId,
  });