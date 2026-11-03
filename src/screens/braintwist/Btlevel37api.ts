// const BASE_URL = 'http://YOUR_PC_IP:3000/api/level37'; // emulator: http://10.0.2.2:3000
// const USER_ID = 1;

// export interface Level37Data { success: boolean; level: number; question: string; min: number; max: number; coins: number }
// export interface SubmitResult { success: boolean; correct: boolean; message: string }

// async function request<T>(path: string, method: 'GET' | 'POST' = 'GET', body?: object): Promise<T> {
//   const res = await fetch(`${BASE_URL}${path}`, {
//     method,
//     headers: { 'Content-Type': 'application/json' },
//     body: body ? JSON.stringify({ userId: USER_ID, ...body }) : undefined,
//   });
//   return res.json();
// }

// export const getLevel37 = () => request<Level37Data>(`?userId=${USER_ID}`);
// export const submitLevel37 = (answer: number) => request<SubmitResult>('/submit', 'POST', { answer });
// export const getClue37 = () => request<{ success: boolean; clue: string }>('/clue', 'POST', {});
// export const watchVideo37 = () => request<{ success: boolean; reward: number; coins: number }>('/video', 'POST', {});
// export const skipLevel37 = () =>
//   request<{ success: boolean; coins?: number; nextLevel?: number; message?: string }>('/skip', 'POST', {});
const API = 'http://localhost:4000/api';
const BASE = `${API}/braintwist/level37`;

export interface Level37 { success: boolean; level: number; question: string; min: number; max: number }
export interface Level37Result { success: boolean; correct: boolean; attempts: number; message: string }

async function req<T>(path: string, method: 'GET' | 'POST' = 'GET', body?: object): Promise<T> {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data?.error || 'Request failed'), { status: res.status });
  return data as T;
}

export const getLevel = () => req<Level37>('/');
export const submit = (playerId: number, answer: number) => req<Level37Result>('/submit', 'POST', { playerId, answer });
export const getClue = () => req<{ success: boolean; clue: string }>('/clue', 'POST', {});