// // Btlevel41api.ts — frontend -> backend requests for Level 41
// // Android emulator: http://10.0.2.2:3000 | real phone: http://<your-PC-LAN-IP>:3000
// export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000';
// const ROOT = `${BASE_URL}/api/braintwist/level41`;

// export type Level41State = {
//   level: number;
//   status: 'playing' | 'solved' | 'skipped';
//   answerLength: number;
//   attempts: number;
//   cluesUsed: number;
//   bulbs: number;
//   clueCost: number;
//   skipCost: number;
//   reward: number;
//   revealed: { index: number; letter: string }[];
//   answer?: string; // only sent after solved / skipped
// };

// export type Level41Response = {
//   success: boolean;
//   state?: Level41State;
//   correct?: boolean;
//   alreadyDone?: boolean;
//   error?: 'NOT_ENOUGH_BULBS' | 'NO_MORE_CLUES' | 'LEVEL_FINISHED' | 'GUESS_REQUIRED' | 'SERVER_ERROR';
//   message?: string;
// };

// async function request(path: string, method: 'GET' | 'POST', body?: object): Promise<Level41Response> {
//   try {
//     const res = await fetch(`${ROOT}${path}`, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: body ? JSON.stringify(body) : undefined,
//     });
//     return (await res.json()) as Level41Response;
//   } catch (e: any) {
//     return { success: false, error: 'SERVER_ERROR', message: e?.message ?? 'Network error' };
//   }
// }

// export const fetchLevel41 = (userId: number) => request(`?userId=${userId}`, 'GET');
// export const submitLevel41Answer = (userId: number, guess: string) =>
//   request('/answer', 'POST', { userId, guess });
// export const requestLevel41Clue = (userId: number) => request('/clue', 'POST', { userId });
// export const skipLevel41 = (userId: number) => request('/skip', 'POST', { userId });
// Btlevel41api.ts — frontend -> backend requests for Level 41
import { Platform } from 'react-native';

// Web browser / iOS simulator -> localhost | Android emulator -> 10.0.2.2 | real phone -> set EXPO_PUBLIC_API_URL=http://<PC-LAN-IP>:4000
// (use the SAME host:port that your other levels' api.ts uses; backend PORT is 4000)
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${HOST}:4000`;
const ROOT = `${BASE_URL}/api/braintwist/level41`;

export type Level41State = {
  level: number;
  status: 'playing' | 'solved' | 'skipped';
  answerLength: number;
  attempts: number;
  cluesUsed: number;
  bulbs: number;
  clueCost: number;
  skipCost: number;
  reward: number;
  revealed: { index: number; letter: string }[];
  answer?: string; // only sent after solved / skipped
};

export type Level41Response = {
  success: boolean;
  state?: Level41State;
  correct?: boolean;
  alreadyDone?: boolean;
  error?: 'NOT_ENOUGH_BULBS' | 'NO_MORE_CLUES' | 'LEVEL_FINISHED' | 'GUESS_REQUIRED' | 'SERVER_ERROR';
  message?: string;
};

async function request(path: string, method: 'GET' | 'POST', body?: object): Promise<Level41Response> {
  try {
    const res = await fetch(`${ROOT}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    return (await res.json()) as Level41Response;
  } catch (e: any) {
    return { success: false, error: 'SERVER_ERROR', message: e?.message ?? 'Network error' };
  }
}

export const fetchLevel41 = (playerId: number) => request(`?playerId=${playerId}`, 'GET');
export const submitLevel41Answer = (playerId: number, guess: string) =>
  request('/answer', 'POST', { playerId, guess });
export const requestLevel41Clue = (playerId: number) => request('/clue', 'POST', { playerId });
export const skipLevel41 = (playerId: number) => request('/skip', 'POST', { playerId });