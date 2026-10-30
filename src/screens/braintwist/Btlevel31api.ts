// /* ---------------------------------------------------------
//    LEVEL 31 API - talks to Braintwistlevel31routes.js
//    Set BASE_URL to your server (same host/port you use for level 30)
//    - Android emulator : http://10.0.2.2:3000
//    - real phone       : http://<your-pc-ip>:3000
// --------------------------------------------------------- */

// const HOST = 'http://10.0.2.2:3000';

// // must match the path where you mounted Braintwistlevel31routes.js in the server
// export const BASE_URL = HOST + '/api/braintwist/level31';

// export interface Level31Progress {
//   attempts: number;
//   solved: boolean;
//   skipped: boolean;
//   hintsUsed: number;
// }

// export interface Level31Data {
//   success: boolean;
//   level: number;
//   question: string;
//   lines: string[];
//   hintCost: number;
//   skipCost: number;
//   videoReward: number;
//   hints: number;
//   progress: Level31Progress;
// }

// export interface Level31Answer {
//   success: boolean;
//   correct: boolean;
//   attempts: number;
//   message?: string;
//   answer?: string;
//   score?: number;
//   stars?: number;
//   next?: number;
// }

// export interface Level31Hint {
//   success: boolean;
//   hints: number;
//   hint: { text: string };
// }

// export interface Level31Skip {
//   success: boolean;
//   hints: number;
//   skipped: boolean;
//   attempts: number;
// }

// export interface Level31Reward {
//   success: boolean;
//   hints: number;
//   added: number;
// }

// // small fetch helper: throws an error that carries .url and .status
// const call = async <T,>(path: string, method: 'GET' | 'POST', body?: any): Promise<T> => {
//   const url = BASE_URL + path;
//   let res: Response;
//   try {
//     res = await fetch(url, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: body === undefined ? undefined : JSON.stringify(body),
//     });
//   } catch (e: any) {
//     const err: any = new Error(e?.message || 'Network request failed');
//     err.url = url;
//     err.status = 0;
//     throw err;
//   }

//   let json: any = null;
//   try {
//     json = await res.json();
//   } catch (e) {
//     json = null;
//   }

//   if (!res.ok || (json && json.success === false)) {
//     const err: any = new Error((json && (json.message || json.error)) || 'Request failed (' + res.status + ')');
//     err.url = url;
//     err.status = res.status;
//     throw err;
//   }

//   return json as T;
// };

// export const startLevel31 = (playerId: any) => call<Level31Data>('/start', 'POST', { playerId });

// export const answerLevel31 = (playerId: any, answer: string) =>
//   call<Level31Answer>('/answer', 'POST', { playerId, answer });

// export const hintLevel31 = (playerId: any) => call<Level31Hint>('/hint', 'POST', { playerId });

// export const skipLevel31 = (playerId: any) => call<Level31Skip>('/skip', 'POST', { playerId });

// export const rewardLevel31 = (playerId: any) =>
//   call<Level31Reward>('/reward', 'POST', { playerId, kind: 'video' });

// export const statusLevel31 = (playerId: any) => call<any>('/status/' + playerId, 'GET');
/* ---------------------------------------------------------
   LEVEL 31 API - talks to Braintwistlevel31routes.js
   Set BASE_URL to your server (same host/port you use for level 30)
   - Android emulator : http://10.0.2.2:3000
   - real phone       : http://<your-pc-ip>:3000
--------------------------------------------------------- */

import { Platform } from 'react-native';

// Your server runs on port 4000 (server.js: process.env.PORT || 4000).
// - browser (Expo web)  : localhost
// - Android emulator    : 10.0.2.2
// - real phone          : put your PC's WiFi IP here, e.g. 'http://192.168.1.5:4000'
const PHONE_IP = ''; // <- fill this only when testing on a real phone

const HOST = PHONE_IP
  ? PHONE_IP
  : Platform.OS === 'web'
  ? 'http://localhost:4000'
  : 'http://10.0.2.2:4000';

// must match the path where you mounted Braintwistlevel31routes.js in the server
export const BASE_URL = HOST + '/api/braintwist/level31';

export interface Level31Progress {
  attempts: number;
  solved: boolean;
  skipped: boolean;
  hintsUsed: number;
}

export interface Level31Data {
  success: boolean;
  level: number;
  question: string;
  lines: string[];
  hintCost: number;
  skipCost: number;
  videoReward: number;
  hints: number;
  progress: Level31Progress;
}

export interface Level31Answer {
  success: boolean;
  correct: boolean;
  attempts: number;
  message?: string;
  answer?: string;
  score?: number;
  stars?: number;
  next?: number;
}

export interface Level31Hint {
  success: boolean;
  hints: number;
  hint: { text: string };
}

export interface Level31Skip {
  success: boolean;
  hints: number;
  skipped: boolean;
  attempts: number;
}

export interface Level31Reward {
  success: boolean;
  hints: number;
  added: number;
}

// small fetch helper: throws an error that carries .url and .status
const call = async <T,>(path: string, method: 'GET' | 'POST', body?: any): Promise<T> => {
  const url = BASE_URL + path;
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e: any) {
    const err: any = new Error(e?.message || 'Network request failed');
    err.url = url;
    err.status = 0;
    throw err;
  }

  let json: any = null;
  try {
    json = await res.json();
  } catch (e) {
    json = null;
  }

  if (!res.ok || (json && json.success === false)) {
    const err: any = new Error((json && (json.message || json.error)) || 'Request failed (' + res.status + ')');
    err.url = url;
    err.status = res.status;
    throw err;
  }

  return json as T;
};

export const startLevel31 = (playerId: any) => call<Level31Data>('/start', 'POST', { playerId });

export const answerLevel31 = (playerId: any, answer: string) =>
  call<Level31Answer>('/answer', 'POST', { playerId, answer });

export const hintLevel31 = (playerId: any) => call<Level31Hint>('/hint', 'POST', { playerId });

export const skipLevel31 = (playerId: any) => call<Level31Skip>('/skip', 'POST', { playerId });

export const rewardLevel31 = (playerId: any) =>
  call<Level31Reward>('/reward', 'POST', { playerId, kind: 'video' });

export const statusLevel31 = (playerId: any) => call<any>('/status/' + playerId, 'GET');