
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