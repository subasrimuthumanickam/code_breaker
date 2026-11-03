// Same base url as your ./api.ts (must end with /api)
const API = 'http://localhost:4000/api';
const BASE = `${API}/braintwist/level38`;

export interface Level38 { success: boolean; level: number; title: string; lines: string[]; length: number }
export interface Level38Result { success: boolean; correct: boolean; attempts: number; message: string }

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

export const getLevel = () => req<Level38>('/');
export const submit = (playerId: number, answer: string) => req<Level38Result>('/submit', 'POST', { playerId, answer });
export const getSearchHint = () => req<{ success: boolean; text: string }>('/search', 'POST', {});
export const getClueHint = () => req<{ success: boolean; text: string }>('/clue', 'POST', {});