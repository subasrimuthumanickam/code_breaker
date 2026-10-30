// // // Btlevel29api.ts
// // const BASE_URL = 'http://YOUR_IP:5000/api/braintwist'; // unga backend URL

// // export interface Level29Puzzle {
// //   success: boolean;
// //   level: number;
// //   question: string;
// //   spots: string[]; // "?" = car spot
// //   hintCost: number;
// //   skipCost: number;
// //   videoReward: number;
// //   progress: { attempts: number; solved: boolean; skipped: boolean; hintUsed: boolean };
// // }

// // export interface Level29SubmitResponse {
// //   success: boolean;
// //   correct: boolean;
// //   attempts: number;
// //   message: string;
// //   nextLevel: number | null;
// // }

// // export interface Level29HintResponse {
// //   success: boolean;
// //   hint: string;
// //   cost: number;
// // }

// // export interface Level29SkipResponse {
// //   success: boolean;
// //   cost: number;
// //   nextLevel: number;
// // }

// // async function request<T>(path: string, options?: RequestInit): Promise<T> {
// //   const res = await fetch(`${BASE_URL}${path}`, {
// //     headers: { 'Content-Type': 'application/json' },
// //     ...options,
// //   });
// //   if (!res.ok) throw new Error(`Request failed: ${res.status}`);
// //   return res.json() as Promise<T>;
// // }

// // export const fetchLevel29 = (userId: string) =>
// //   request<Level29Puzzle>(`/level29?userId=${encodeURIComponent(userId)}`);

// // export const submitLevel29Answer = (userId: string, answer: string) =>
// //   request<Level29SubmitResponse>('/level29/submit', {
// //     method: 'POST',
// //     body: JSON.stringify({ userId, answer }),
// //   });

// // export const fetchLevel29Hint = (userId: string) =>
// //   request<Level29HintResponse>('/level29/hint', {
// //     method: 'POST',
// //     body: JSON.stringify({ userId }),
// //   });

// // export const skipLevel29 = (userId: string) =>
// //   request<Level29SkipResponse>('/level29/skip', {
// //     method: 'POST',
// //     body: JSON.stringify({ userId }),
// //   });
// // Btlevel29api.ts
// // !! BASE_URL: Btlevel28api.ts la use pannura ADHE host:port ah inga podunga.
// // Server port 4000. Phone la test panna "localhost" work aagaadhu, PC oda LAN IP (e.g. 192.168.1.5) venum.
// export const BASE_URL = 'http://YOUR_PC_IP:4000/api/braintwist/level29';

// export interface Level29Data {
//   success: boolean;
//   level: number;
//   question: string;
//   spots: string[]; // "?" = car
//   hintCost: number;
//   skipCost: number;
//   videoReward: number;
//   hints: number | null;
//   progress: { attempts: number; solved: boolean; skipped: boolean; hintUsed: boolean };
// }

// export interface Level29AnswerRes {
//   success: boolean;
//   correct: boolean;
//   attempts: number;
//   message: string;
// }

// export interface Level29HintRes {
//   success: boolean;
//   hints: number;
//   hint: { text: string };
// }

// export interface Level29SkipRes {
//   success: boolean;
//   hints: number;
//   skipped: boolean;
//   attempts: number;
// }

// export interface Level29RewardRes {
//   success: boolean;
//   hints: number;
//   added: number;
// }

// async function post<T>(path: string, body: any): Promise<T> {
//   const url = `${BASE_URL}${path}`;
//   const res = await fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   });
//   let data: any = null;
//   try {
//     data = await res.json();
//   } catch (e) {}
//   if (!res.ok) {
//     const err: any = new Error(data?.error || `HTTP ${res.status}`);
//     err.status = res.status;
//     err.url = url;
//     throw err;
//   }
//   return data as T;
// }

// export const startLevel29 = (playerId: any) => post<Level29Data>('/start', { playerId });
// export const answerLevel29 = (playerId: any, answer: string) =>
//   post<Level29AnswerRes>('/answer', { playerId, answer });
// export const hintLevel29 = (playerId: any) => post<Level29HintRes>('/hint', { playerId });
// export const skipLevel29 = (playerId: any) => post<Level29SkipRes>('/skip', { playerId });
// export const rewardLevel29 = (playerId: any) =>
//   post<Level29RewardRes>('/reward', { playerId, kind: 'video' });
// Btlevel29api.ts
import { Platform } from 'react-native';

// Phone la (Expo Go) test panna mattum, unga PC oda LAN IP inga podunga. e.g. '192.168.1.5'
// (cmd la `ipconfig` -> IPv4 Address). Web / emulator la idhu thevai illa.
const LAN_IP = '';

const PORT = 4000;

const HOST =
  Platform.OS === 'web'
    ? 'localhost'                       // browser (neenga ippo run panradhu)
    : LAN_IP || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost'); // android emulator / iOS simulator

// Unga Level 28 api la vera BASE_URL irundha, atha use pannalaam.
export const BASE_URL = `http://${HOST}:${PORT}/api/braintwist/level29`;

export interface Level29Data {
  success: boolean;
  level: number;
  question: string;
  spots: string[]; // "?" = car
  hintCost: number;
  skipCost: number;
  videoReward: number;
  hints: number | null;
  progress: { attempts: number; solved: boolean; skipped: boolean; hintUsed: boolean };
}

export interface Level29AnswerRes {
  success: boolean;
  correct: boolean;
  attempts: number;
  message: string;
}

export interface Level29HintRes {
  success: boolean;
  hints: number;
  hint: { text: string };
}

export interface Level29SkipRes {
  success: boolean;
  hints: number;
  skipped: boolean;
  attempts: number;
}

export interface Level29RewardRes {
  success: boolean;
  hints: number;
  added: number;
}

async function post<T>(path: string, body: any): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch (e) {}
  if (!res.ok) {
    const err: any = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.url = url;
    throw err;
  }
  return data as T;
}

export const startLevel29 = (playerId: any) => post<Level29Data>('/start', { playerId });
export const answerLevel29 = (playerId: any, answer: string) =>
  post<Level29AnswerRes>('/answer', { playerId, answer });
export const hintLevel29 = (playerId: any) => post<Level29HintRes>('/hint', { playerId });
export const skipLevel29 = (playerId: any) => post<Level29SkipRes>('/skip', { playerId });
export const rewardLevel29 = (playerId: any) =>
  post<Level29RewardRes>('/reward', { playerId, kind: 'video' });