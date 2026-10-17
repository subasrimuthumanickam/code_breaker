// // src/screens/braintwist/btLevel2Api.ts
// //
// // Talks to the backend routes in braintwistLevel2Routes.js
// //   POST {BT_API}/level2/start
// //   POST {BT_API}/level2/action

// import { BT_API } from './config';

// export type FlowerPhase = 'blurred' | 'outline' | 'colored';

// export type Level2Tool = {
//   id: string;
//   label: string;
// };

// // what the backend sends for one stage
// export type Level2View = {
//   stage: number;
//   totalStages: number;
//   title: string;
//   hint: string;
//   hintTool: string;
//   flower: FlowerPhase;
//   tools: Level2Tool[];
// };

// export type Level2Start = Level2View & {
//   success: boolean;
//   sessionId: number;
//   level: number;
//   status: string;
// };

// export type Level2Action = Partial<Level2View> & {
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

// // 1. open level 2 (creates or resumes a session)
// export const startLevel2 = (playerId: number): Promise<Level2Start> =>
//   call('/level2/start', { playerId });

// // 2. a tool was dropped on the flower
// export const dropTool = (params: {
//   sessionId: number;
//   playerId: number;
//   tool: string;
// }): Promise<Level2Action> =>
//   call('/level2/action', {
//     sessionId: params.sessionId,
//     playerId: params.playerId,
//     tool: params.tool,
//     target: 'flower',
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