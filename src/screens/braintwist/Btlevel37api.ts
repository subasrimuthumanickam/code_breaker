
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
export const getClue = (playerId: number) => req<{ success: boolean; clue: string }>('/clue', 'POST', { playerId });