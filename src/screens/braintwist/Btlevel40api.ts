// // Btlevel40api.ts  -  frontend API calls for Level 40
// // Android emulator: http://10.0.2.2:3000 | Real phone: your PC's LAN IP
// export const BASE_URL = 'http://10.0.2.2:3000/api/braintwist/level40';

// export interface SubmitResponse {
//   success: boolean;
//   correct?: boolean;
//   message: string;
//   nextLevel?: number | null;
// }
// export interface ClueResponse {
//   success: boolean;
//   clue?: string;
//   hints?: number;
//   message?: string;
// }
// export interface SkipResponse {
//   success: boolean;
//   hints?: number;
//   nextLevel?: number;
//   message?: string;
// }
// export interface ProgressResponse {
//   success: boolean;
//   level: number;
//   hints: number;
//   currentLevel: number;
// }

// async function request<T>(path: string, method: 'GET' | 'POST' = 'GET', body?: object): Promise<T> {
//   const res = await fetch(`${BASE_URL}${path}`, {
//     method,
//     headers: { 'Content-Type': 'application/json' },
//     body: body ? JSON.stringify(body) : undefined,
//   });
//   return (await res.json()) as T;
// }

// export const getProgress = (userId: string) =>
//   request<ProgressResponse>(`/progress/${encodeURIComponent(userId)}`);

// export const submitAnswer = (userId: string, answer: string) =>
//   request<SubmitResponse>('/submit', 'POST', { userId, answer });

// export const getClue = (userId: string) =>
//   request<ClueResponse>('/clue', 'POST', { userId });

// export const skipLevel = (userId: string) =>
//   request<SkipResponse>('/skip', 'POST', { userId });
// Btlevel40api.ts  -  frontend API calls for Level 40
import { Platform } from 'react-native';

// Backend runs on port 4000 (server.js).
// Web browser: localhost | Android emulator: 10.0.2.2 | Real phone: your PC's LAN IP (e.g. 192.168.1.5)
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const BASE_URL = `http://${HOST}:4000/api/braintwist/level40`;

export interface SubmitResponse {
  success: boolean;
  correct?: boolean;
  message: string;
  nextLevel?: number | null;
}
export interface ClueResponse {
  success: boolean;
  clue?: string;
  hints?: number;
  message?: string;
}
export interface SkipResponse {
  success: boolean;
  hints?: number;
  nextLevel?: number;
  message?: string;
}
export interface ProgressResponse {
  success: boolean;
  level: number;
  hints: number;
  currentLevel: number;
}

async function request<T>(path: string, method: 'GET' | 'POST' = 'GET', body?: object): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return (await res.json()) as T;
}

export const getProgress = (userId: string) =>
  request<ProgressResponse>(`/progress/${encodeURIComponent(userId)}`);

export const submitAnswer = (userId: string, answer: string) =>
  request<SubmitResponse>('/submit', 'POST', { userId, answer });

export const getClue = (userId: string) =>
  request<ClueResponse>('/clue', 'POST', { userId });

export const skipLevel = (userId: string) =>
  request<SkipResponse>('/skip', 'POST', { userId });