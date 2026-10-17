// // src/screens/braintwist/Btlevel3api.ts
// //
// // Talks to the backend routes in Braintwistlevel3routes.js
// //   POST {BT_API}/level3/start
// //   POST {BT_API}/level3/answer
// //   POST {BT_API}/level3/hint
// //   POST {BT_API}/level3/skip
// //   POST {BT_API}/level3/reward

// import { BT_API } from './config';

// export type Level3Start = {
//   success: boolean;
//   sessionId: number;
//   level: number;
//   status: string;
//   question: string;
//   options: number[];
//   removed: number[];
//   hints: number;
//   wrongAttempts: number;
// };

// export type Level3Answer = {
//   success: boolean;
//   correct: boolean;
//   completed: boolean;
//   skipped?: boolean;
//   message?: string;
//   wrongAttempts?: number;
//   score?: number;
//   stars?: number;
//   attempts?: number;
//   progressSaved?: boolean;
//   hints?: number;
// };

// export type Level3Hint = {
//   success: boolean;
//   hint: { removeOption?: number; text?: string };
//   removed: number[];
//   hints: number;
// };

// export type Level3Reward = {
//   success: boolean;
//   added: number;
//   hints: number;
// };

// const call = async (path: string, body: unknown) => {
//   const url = `${BT_API}${path}`;

//   console.log('[BT Level3 API] POST', url);

//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     },
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

// // 1. open level 3 (creates or resumes a session)
// export const startLevel3 = (playerId: number): Promise<Level3Start> =>
//   call('/level3/start', { playerId });

// // 2. player picked a number of differences
// export const answerLevel3 = (params: {
//   sessionId: number;
//   playerId: number;
//   picked: number;
// }): Promise<Level3Answer> => call('/level3/answer', params);

// // 3. magnifier: removes one wrong option (costs 25 hints)
// export const hintLevel3 = (params: {
//   sessionId: number;
//   playerId: number;
// }): Promise<Level3Hint> => call('/level3/hint', params);

// // 4. skip the level (costs 50 hints)
// export const skipLevel3 = (params: {
//   sessionId: number;
//   playerId: number;
// }): Promise<Level3Answer> => call('/level3/skip', params);

// // 5. video reward (+75 hints)
// export const rewardLevel3 = (playerId: number): Promise<Level3Reward> =>
//   call('/level3/reward', { playerId, kind: 'video' });
import { BT_API } from './config';

export type Sym = '+' | '-';

export type Level3Start = {
  success: boolean;
  sessionId: number;
  level: number;
  status: string;
  question: string;
  numbers: number[];                                // [1, 2, 3]
  symbols: Sym[];                                   // ['+', '-']
  revealed: { slot: number; symbol: Sym }[];        // slots already filled by hints
  hints: number;
  wrongAttempts: number;
};

export type Level3Answer = {
  success: boolean;
  correct: boolean;
  completed: boolean;
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

export type Level3Hint = {
  success: boolean;
  hint: { place?: { slot: number; symbol: Sym }; text?: string };
  revealed: { slot: number; symbol: Sym }[];
  hints: number;
};

export type Level3Reward = {
  success: boolean;
  added: number;
  hints: number;
};

const call = async (path: string, body: unknown) => {
  const url = `${BT_API}${path}`;

  console.log('[BT Level3 API] POST', url);

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

// 1. open level 3 (creates or resumes a session)
export const startLevel3 = (playerId: number): Promise<Level3Start> =>
  call('/level3/start', { playerId });

// 2. player dropped both symbols: symbols[0] = gap between 1 and 2, symbols[1] = gap between 2 and 3
export const answerLevel3 = (params: {
  sessionId: number;
  playerId: number;
  symbols: Sym[];
}): Promise<Level3Answer> => call('/level3/answer', params);

// 3. magnifier: places one correct symbol for the player (costs 25 hints)
export const hintLevel3 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level3Hint> => call('/level3/hint', params);

// 4. skip the level (costs 50 hints)
export const skipLevel3 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level3Answer> => call('/level3/skip', params);

// 5. video reward (+75 hints)
export const rewardLevel3 = (playerId: number): Promise<Level3Reward> =>
  call('/level3/reward', { playerId, kind: 'video' });