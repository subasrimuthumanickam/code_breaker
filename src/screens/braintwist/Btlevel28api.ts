// Level 28 API: every call sends JSON to the backend and gets JSON back.
// IMPORTANT: use the SAME base url as Btlevel27api.ts
// (localhost works on the web; on a phone use your computer's LAN ip, e.g. http://192.168.1.5:4000/api/braintwist)
const API_BASE = 'http://localhost:4000/api/braintwist';

export type Level28View = {
  level: number;
  sessionId: number;
  title: string;
  length: number;   // how many letters the word has (the word itself is never sent)
  hints: number;
};

export type Level28Result = {
  correct: boolean;
  skipped?: boolean;
  message: string;
  word?: string;
  stars: number;
  score: number;
  hints: number;
  attempts: number;
};

export type Level28Clue = { hints: number; clue: string; clueNo: number; total: number };

async function post<T>(path: string, body: any): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/level28${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw Object.assign(new Error('Cannot reach the server'), { status: 0 });
  }

  let data: any = {};
  try { data = await res.json(); } catch { /* empty body */ }

  if (!res.ok) {
    throw Object.assign(new Error(data.error || data.message || 'Server error'), { status: res.status });
  }
  return data as T;
}

export const startLevel28  = (playerId: number) =>
  post<Level28View>('/start', { playerId });

export const answerLevel28 = (b: { sessionId: number; playerId: number; answer: string }) =>
  post<Level28Result>('/answer', b);

export const hintLevel28   = (b: { sessionId: number; playerId: number }) =>
  post<Level28Clue>('/hint', b);

export const skipLevel28   = (b: { sessionId: number; playerId: number }) =>
  post<Level28Result>('/skip', b);

export const rewardLevel28 = (playerId: number) =>
  post<{ hints: number; added: number }>('/reward', { playerId });