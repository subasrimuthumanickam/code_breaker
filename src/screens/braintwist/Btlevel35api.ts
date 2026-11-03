// // // BTLevel35Api.ts
// // // Frontend -> backend requests for Brain Twist Level 35.

// // import { Platform } from 'react-native';

// // const DEFAULT_HOST =
// //   Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

// // // Set EXPO_PUBLIC_API_URL in .env to point to your real server / PC IP.
// // export const BT35_BASE =
// //   ((process.env.EXPO_PUBLIC_API_URL as string | undefined) || DEFAULT_HOST) +
// //   '/api/braintwist/level35';

// // export type BT35Progress = {
// //   level: number;
// //   digits: number;
// //   userId: string;
// //   bulbs: number;
// //   coins: number;
// //   attempts: number;
// //   hintsUsed: number;
// //   solved: boolean;
// //   solvedBy: string | null;
// //   costs: { hint: number; reveal: number };
// //   adReward: number;
// // };

// // export type BT35StateRes = { success: boolean; progress: BT35Progress };
// // export type BT35AttemptRes = {
// //   success: boolean;
// //   correct: boolean;
// //   message: string;
// //   progress: BT35Progress;
// // };
// // export type BT35HintRes = { success: boolean; hint: string; progress: BT35Progress };
// // export type BT35RevealRes = { success: boolean; answer: string; progress: BT35Progress };
// // export type BT35AdRes = { success: boolean; reward: number; progress: BT35Progress };

// // async function request<T>(path: string, body?: object, userId?: string): Promise<T> {
// //   const controller = new AbortController();
// //   const timer = setTimeout(() => controller.abort(), 10000);
// //   try {
// //     const url =
// //       body === undefined
// //         ? `${BT35_BASE}${path}?userId=${encodeURIComponent(userId || '')}`
// //         : `${BT35_BASE}${path}`;
// //     const res = await fetch(url, {
// //       method: body === undefined ? 'GET' : 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: body === undefined ? undefined : JSON.stringify(body),
// //       signal: controller.signal,
// //     });
// //     const data = await res.json().catch(() => ({}));
// //     if (!res.ok || data.success === false) {
// //       throw new Error(data.message || `Request failed (${res.status})`);
// //     }
// //     return data as T;
// //   } catch (e: any) {
// //     if (e && e.name === 'AbortError') throw new Error('Server timeout');
// //     throw new Error(e && e.message ? e.message : 'Network error');
// //   } finally {
// //     clearTimeout(timer);
// //   }
// // }

// // export const bt35GetState = (userId: string) =>
// //   request<BT35StateRes>('/state', undefined, userId);

// // export const bt35Attempt = (userId: string, guess: string) =>
// //   request<BT35AttemptRes>('/attempt', { userId, guess });

// // export const bt35Hint = (userId: string) =>
// //   request<BT35HintRes>('/hint', { userId });

// // export const bt35Reveal = (userId: string) =>
// //   request<BT35RevealRes>('/reveal', { userId });

// // export const bt35RewardAd = (userId: string) =>
// //   request<BT35AdRes>('/reward-ad', { userId });
// // BTLevel35Api.ts
// // Frontend -> backend requests for Brain Twist Level 35.

// import { Platform } from 'react-native';

// const DEFAULT_HOST =
//   Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

// // Same server as the other levels (port 4000). Set EXPO_PUBLIC_API_URL in .env for a phone / real IP.
// export const BT35_BASE =
//   ((process.env.EXPO_PUBLIC_API_URL as string | undefined) || DEFAULT_HOST) +
//   '/api/braintwist/level35';

// export type BT35State = {
//   success: boolean;
//   level: number;
//   playerId: string;
//   hints: number; // hint (bulb) balance
//   attempts: number;
//   hintsUsed: number;
//   solved: boolean;
//   solvedBy: string | null;
//   costs: { hint: number; skip: number };
//   reward: number;
// };
// export type BT35AnswerRes = BT35State & { correct: boolean; message: string };
// export type BT35HintRes = BT35State & { hint: { text: string } };
// export type BT35SkipRes = BT35State & { correct: boolean; skipped: boolean; answer: string };

// export class BT35Error extends Error {
//   status: number;
//   constructor(message: string, status = 0) {
//     super(message);
//     this.status = status;
//   }
// }

// async function post<T>(path: string, body: object): Promise<T> {
//   const controller = new AbortController();
//   const timer = setTimeout(() => controller.abort(), 10000);
//   try {
//     const res = await fetch(`${BT35_BASE}${path}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//       signal: controller.signal,
//     });
//     const data = await res.json().catch(() => ({}));
//     if (!res.ok || data.success === false) {
//       throw new BT35Error(data.error || `Request failed (${res.status})`, res.status);
//     }
//     return data as T;
//   } catch (e: any) {
//     if (e instanceof BT35Error) throw e;
//     if (e && e.name === 'AbortError') throw new BT35Error('Server timeout');
//     throw new BT35Error('Network error');
//   } finally {
//     clearTimeout(timer);
//   }
// }

// export const bt35Start = (playerId: any) =>
//   post<BT35State>('/start', { playerId: String(playerId) });

// export const bt35Answer = (playerId: any, answer: string) =>
//   post<BT35AnswerRes>('/answer', { playerId: String(playerId), answer });

// export const bt35Hint = (playerId: any) =>
//   post<BT35HintRes>('/hint', { playerId: String(playerId) });

// export const bt35Skip = (playerId: any) =>
//   post<BT35SkipRes>('/skip', { playerId: String(playerId) });

// export const bt35Reward = (playerId: any) =>
//   post<BT35State>('/reward', { playerId: String(playerId) });
// BTLevel35Api.ts
// Frontend -> backend requests for Brain Twist Level 35.

import { Platform } from 'react-native';

const DEFAULT_HOST =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

// Same server as the other levels (port 4000). Set EXPO_PUBLIC_API_URL in .env for a phone / real IP.
export const BT35_BASE =
  ((process.env.EXPO_PUBLIC_API_URL as string | undefined) || DEFAULT_HOST) +
  '/api/braintwist/level35';

export type BT35State = {
  success: boolean;
  level: number;
  playerId: string;
  hints: number; // hint (bulb) balance
  attempts: number;
  hintsUsed: number;
  solved: boolean;
  solvedBy: string | null;
  costs: { hint: number; skip: number };
  reward: number;
};
export type BT35AnswerRes = BT35State & { correct: boolean; message: string };
export type BT35HintRes = BT35State & { hint: { text: string } };
export type BT35SkipRes = BT35State & { correct: boolean; skipped: boolean; answer: string };

export class BT35Error extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.status = status;
  }
}

async function post<T>(path: string, body: object): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${BT35_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      throw new BT35Error(data.error || `Request failed (${res.status})`, res.status);
    }
    return data as T;
  } catch (e: any) {
    if (e instanceof BT35Error) throw e;
    if (e && e.name === 'AbortError') throw new BT35Error('Server timeout');
    throw new BT35Error('Network error');
  } finally {
    clearTimeout(timer);
  }
}

export const bt35Start = (playerId: any) =>
  post<BT35State>('/start', { playerId: String(playerId) });

export const bt35Answer = (playerId: any, answer: string) =>
  post<BT35AnswerRes>('/answer', { playerId: String(playerId), answer });

export const bt35Hint = (playerId: any) =>
  post<BT35HintRes>('/hint', { playerId: String(playerId) });

export const bt35Skip = (playerId: any) =>
  post<BT35SkipRes>('/skip', { playerId: String(playerId) });

export const bt35Reward = (playerId: any) =>
  post<BT35State>('/reward', { playerId: String(playerId) });