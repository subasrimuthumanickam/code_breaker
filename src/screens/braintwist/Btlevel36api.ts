
// const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
// const BASE = (process.env.EXPO_PUBLIC_API_URL as string) || DEFAULT_HOST;
// const PREFIX = '/api/braintwist/level36';

// async function call(path: string, body: any) {
//   const res = await fetch(BASE + PREFIX + path, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   });
//   let data: any = {};
//   try {
//     data = await res.json();
//   } catch (_) {}
//   if (!res.ok) {
//     const err: any = new Error(data?.error || 'Request failed');
//     err.status = res.status;
//     throw err;
//   }
//   return data;
// }

// export const bt36Start = (playerId: any): Promise<{ hints: number }> =>
//   call('/start', { playerId });

// export const bt36Answer = (
//   playerId: any,
//   guess: string
// ): Promise<{ correct: boolean; attempts: number; hints: number }> =>
//   call('/answer', { playerId, guess });

// export const bt36Hint = (
//   playerId: any
// ): Promise<{ hint: { text: string }; hints: number }> =>
//   call('/hint', { playerId });

// export const bt36Reward = (playerId: any): Promise<{ hints: number }> =>
//   call('/reward', { playerId });

// export const bt36Skip = (
//   playerId: any
// ): Promise<{ answer: string; attempts: number; hints: number }> =>
//   call('/skip', { playerId });
import { Platform } from 'react-native';

const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
const BASE = (process.env.EXPO_PUBLIC_API_URL as string) || DEFAULT_HOST;
const PREFIX = '/api/braintwist/level36';

async function call(path: string, body: any) {
  const res = await fetch(BASE + PREFIX + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data: any = {};
  try {
    data = await res.json();
  } catch (_) {}
  if (!res.ok) {
    const err: any = new Error(data?.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const bt36Start = (playerId: any): Promise<{ hints: number }> =>
  call('/start', { playerId });

export const bt36Answer = (
  playerId: any,
  guess: string
): Promise<{ correct: boolean; attempts: number; hints: number }> =>
  call('/answer', { playerId, guess });

export const bt36Hint = (
  playerId: any
): Promise<{ hint: { text: string }; hints: number }> =>
  call('/hint', { playerId });

export const bt36Reward = (playerId: any): Promise<{ hints: number }> =>
  call('/reward', { playerId });

export const bt36Skip = (
  playerId: any
): Promise<{ answer: string; attempts: number; hints: number }> =>
  call('/skip', { playerId });