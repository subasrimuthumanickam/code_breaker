// // // src/screens/braintwist/Btlevel32api.ts
// // // Change API_BASE to match your backend URL / env setup.
// // const API_BASE: string =
// //   (typeof window !== "undefined" && (window as any).__API_BASE__) ||
// //   "http://localhost:5000/api";

// // const BASE = `${API_BASE}/braintwist/level32`;

// // export type OptionLetter = "A" | "B" | "C" | "D";

// // export interface Level32Session {
// //   sessionId: number;
// //   title: string;
// //   instruction: string;
// //   targetVariant: string;
// //   options: string[]; // index 0..3 = A..D
// // }

// // export interface Level32AnswerResult {
// //   isCorrect: boolean;
// //   correctAnswer: OptionLetter | null;
// //   message: string;
// // }

// // export interface Level32Progress {
// //   attempts: number;
// //   correct: number;
// //   completed: boolean;
// // }

// // interface ApiEnvelope<T> {
// //   success: boolean;
// //   data?: T;
// //   message?: string;
// // }

// // async function request<T>(path: string, init?: RequestInit): Promise<T> {
// //   const res = await fetch(`${BASE}${path}`, {
// //     headers: { "Content-Type": "application/json" },
// //     ...init,
// //   });
// //   const json: ApiEnvelope<T> = await res.json().catch(() => ({ success: false }));
// //   if (!res.ok || !json.success || !json.data) {
// //     throw new Error(json.message || "Something went wrong. Please try again.");
// //   }
// //   return json.data;
// // }

// // export const startLevel32 = (playerId: number) =>
// //   request<Level32Session>("/start", {
// //     method: "POST",
// //     body: JSON.stringify({ playerId }),
// //   });

// // export const submitLevel32Answer = (
// //   sessionId: number,
// //   playerId: number,
// //   answer: OptionLetter
// // ) =>
// //   request<Level32AnswerResult>("/answer", {
// //     method: "POST",
// //     body: JSON.stringify({ sessionId, playerId, answer }),
// //   });

// // export const getLevel32Progress = (playerId: number) =>
// //   request<Level32Progress>(`/progress/${playerId}`);
// // Browser (localhost:8081) la test panna: localhost. Phone la test panna: unga PC IP (example 192.168.1.5)
// const BASE_URL = 'http://localhost:4000/api'; // <-- api.ts la irukkura same URL

// export type Letter = 'A' | 'B' | 'C' | 'D';

// export interface L32Start {
//   success: boolean;
//   sessionId: number;
//   question: string;
//   target: string;
//   options: string[];
// }
// export interface L32Answer {
//   success: boolean;
//   correct: boolean;
//   attempts: number;
//   answer: Letter | null;
// }

// async function call<T>(path: string, body?: any): Promise<T> {
//   const res = await fetch(`${BASE_URL}/braintwist/level32${path}`, {
//     method: body ? 'POST' : 'GET',
//     headers: {'Content-Type': 'application/json'},
//     body: body ? JSON.stringify(body) : undefined,
//   });
//   const j = await res.json().catch(() => null);
//   if (!res.ok || !j?.success) {
//     const e: any = new Error(j?.error || 'Network error');
//     e.status = res.status;
//     throw e;
//   }
//   return j as T;
// }

// export const start = (playerId: number) => call<L32Start>('/start', {playerId});
// export const answer = (sessionId: number, playerId: number, a: Letter) =>
//   call<L32Answer>('/answer', {sessionId, playerId, answer: a});
// export const status = (playerId: number) => call<any>(`/status/${playerId}`);
// src/screens/braintwist/Btlevel32api.ts
// Use the SAME base URL as ./api.ts. Browser on the PC: localhost. Phone: your PC IP (e.g. 192.168.1.5).
const BASE_URL = 'http://localhost:4000/api';

export type Letter = 'A' | 'B' | 'C' | 'D';

export interface L32Start {
  success: boolean;
  sessionId: number;
  question: string;
  target: string;
  options: string[];
}
export interface L32Answer {
  success: boolean;
  correct: boolean;
  attempts: number;
  answer: Letter | null;
}
export interface L32Hint { success: boolean; hints: number; remove: Letter }
export interface L32Skip { success: boolean; hints: number; skipped: boolean; attempts: number }

async function call<T>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${BASE_URL}/braintwist/level32${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {'Content-Type': 'application/json'},
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await res.json().catch(() => null);
  if (!res.ok || !j?.success) {
    const e: any = new Error(j?.error || 'Network error');
    e.status = res.status;
    throw e;
  }
  return j as T;
}

export const start = (playerId: number) => call<L32Start>('/start', {playerId});
export const answer = (sessionId: number, playerId: number, a: Letter) =>
  call<L32Answer>('/answer', {sessionId, playerId, answer: a});
export const hint = (sessionId: number, playerId: number, hidden: string[]) =>
  call<L32Hint>('/hint', {sessionId, playerId, hidden});
export const skip = (sessionId: number, playerId: number) =>
  call<L32Skip>('/skip', {sessionId, playerId});
export const status = (playerId: number) => call<any>(`/status/${playerId}`);