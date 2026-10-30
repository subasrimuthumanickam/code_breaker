// import { BT_API } from './config';

// export type Level10View = {
//   success: boolean;
//   sessionId: number;
//   level: number;
//   status: string;
//   title: string;
//   board: number[];      // 9 squares: 0 = empty, 1 = X (you), 2 = O (rival)
//   hints: number;
// };

// export type Level10Action =
//   | { t: 'tap'; c: number }        // X on a square
//   | { t: 'swipe'; d: 'L' | 'R' | 'U' | 'D' };   // the board was tilted

// export type Level10Result = {
//   success: boolean;
//   completed: boolean;
//   skipped?: boolean;
//   message?: string;
//   score?: number;
//   stars?: number;
//   attempts?: number;
//   moves?: number;
//   seconds?: number;
//   progressSaved?: boolean;
//   next?: number;
//   hints?: number;
// };

// export type Level10Hint = {
//   success: boolean;
//   dir: 'L' | 'R' | 'U' | 'D';   // the way to swipe the board
//   hints: number;
//   cost: number;
// };

// export type Level10Reward = {
//   success: boolean;
//   added: number;
//   hints: number;
// };

// const call = async (path: string, body: unknown) => {
//   const url = `${BT_API}${path}`;

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
//     const err: any = new Error(data.message || data.error || `Request failed (${response.status})`);
//     err.status = response.status;
//     throw err;
//   }

//   return data;
// };

// // 1. open level 10 (the server picks a start board every time)
// export const startLevel10 = (playerId: number): Promise<Level10View> =>
//   call('/level10/start', { playerId });

// // 2. X won: send what the player did, the server plays it again and checks it
// export const finishLevel10 = (params: {
//   sessionId: number;
//   playerId: number;
//   actions: Level10Action[];
// }): Promise<Level10Result> => call('/level10/finish', params);

// // 3. magnifier: which way to swipe the board (costs 25 hints)
// export const hintLevel10 = (params: {
//   sessionId: number;
//   playerId: number;
//   board: number[];
// }): Promise<Level10Hint> => call('/level10/hint', params);

// // 4. skip the level (costs 50 hints)
// export const skipLevel10 = (params: {
//   sessionId: number;
//   playerId: number;
// }): Promise<Level10Result> => call('/level10/skip', params);

// // 5. video reward (+75 hints)
// export const rewardLevel10 = (playerId: number): Promise<Level10Reward> =>
//   call('/level10/reward', { playerId, kind: 'video' });
import { BT_API } from './config';

export type Level10View = {
  success: boolean;
  sessionId: number;
  level: number;
  status: string;
  title: string;
  board: number[];      // 9 squares: 0 = empty, 1 = X (you), 2 = O (rival)
  hints: number;
};

export type Level10Action =
  | { t: 'tap'; c: number }        // X on a square
  | { t: 'swipe'; d: 'L' | 'R' | 'U' | 'D' };   // the board was tilted

export type Level10Result = {
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

export type Level10Hint = {
  success: boolean;
  clue: string;                          // text for the CLUES popup
  dir: 'L' | 'R' | 'U' | 'D' | null;     // the way to swipe the board (null when the clue was free)
  hints: number;                         // hints left
  charged: boolean;                      // true when 25 hints were taken
  cost: number;                          // 25 when charged, otherwise 0
};

export type Level10Reward = {
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

// 1. open level 10 (the server picks a start board every time)
export const startLevel10 = (playerId: number): Promise<Level10View> =>
  call('/level10/start', { playerId });

// 2. X won: send what the player did, the server plays it again and checks it
export const finishLevel10 = (params: {
  sessionId: number;
  playerId: number;
  actions: Level10Action[];
}): Promise<Level10Result> => call('/level10/finish', params);

// 3. magnifier: the server saves the request and sends the clue (25 hints for the swipe arrow)
export const hintLevel10 = (params: {
  sessionId: number;
  playerId: number;
  board: number[];
}): Promise<Level10Hint> => call('/level10/hint', params);

// 4. skip the level (costs 50 hints)
export const skipLevel10 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level10Result> => call('/level10/skip', params);

// 5. video reward (+75 hints)
export const rewardLevel10 = (playerId: number): Promise<Level10Reward> =>
  call('/level10/reward', { playerId, kind: 'video' });