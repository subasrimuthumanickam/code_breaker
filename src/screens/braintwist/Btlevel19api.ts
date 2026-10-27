// import { BT_API } from './config';

// export type Level19Figure = {
//   lines: number;     
//   label: string;     
// };

// export type Level19View = {
//   success: boolean;
//   sessionId: number;
//   level: number;
//   status: string;
//   title: string;
//   figures: Level19Figure[];
//   hints: number;
// };

// export type Level19Result = {
//   success: boolean;
//   correct: boolean;
//   completed: boolean;
//   skipped?: boolean;
//   message?: string;
//   score?: number;
//   stars?: number;
//   attempts?: number;
//   seconds?: number;
//   progressSaved?: boolean;
//   next?: number;
//   hints?: number;
// };

// export type Level19Hint = {
//   success: boolean;
//   text: string;
//   hints: number;
//   cost: number;
// };

// export type Level19Reward = {
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


// export const startLevel19 = (playerId: number): Promise<Level19View> =>
//   call('/level19/start', { playerId });

// export const answerLevel19 = (params: {
//   sessionId: number;
//   playerId: number;
//   answer: number;
// }): Promise<Level19Result> => call('/level19/answer', params);


// export const hintLevel19 = (params: {
//   sessionId: number;
//   playerId: number;
// }): Promise<Level19Hint> => call('/level19/hint', params);


// export const skipLevel19 = (params: {
//   sessionId: number;
//   playerId: number;
// }): Promise<Level19Result> => call('/level19/skip', params);


// export const rewardLevel19 = (playerId: number): Promise<Level19Reward> =>
//   call('/level19/reward', { playerId, kind: 'video' });
import { BT_API } from './config';

export type Level19Figure = {
  lines: number;
  label: string;
};

export type Level19View = {
  success: boolean;
  sessionId: number;
  level: number;
  status: string;
  title: string;
  figures: Level19Figure[];
  hints: number;
};

export type Level19Result = {
  success: boolean;
  correct: boolean;
  completed: boolean;
  skipped?: boolean;
  message?: string;
  score?: number;
  stars?: number;
  attempts?: number;
  seconds?: number;
  progressSaved?: boolean;
  next?: number;
  hints?: number;
};

export type Level19Hint = {
  success: boolean;
  index: number;   // clue number: 1, 2, 3
  text: string;
  hints: number;
  cost: number;
};

export type Level19Reward = {
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

export const startLevel19 = (playerId: number): Promise<Level19View> =>
  call('/level19/start', { playerId });

export const answerLevel19 = (params: {
  sessionId: number;
  playerId: number;
  answer: number;
}): Promise<Level19Result> => call('/level19/answer', params);

export const hintLevel19 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level19Hint> => call('/level19/hint', params);

export const skipLevel19 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level19Result> => call('/level19/skip', params);

export const rewardLevel19 = (playerId: number): Promise<Level19Reward> =>
  call('/level19/reward', { playerId, kind: 'video' });