
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
const PREFIX = `${BASE_URL}/api/braintwist/level16`;

export type Level16Data = {
  level: number;
  title: string;
  subtitle: string;
  question: string;
  options: string[];
  statements: { id: string; text: string }[];
};

async function call<T>(path: string, body?: object): Promise<T> {
  const res = await fetch(`${PREFIX}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    const e: any = new Error(data.error || `Request failed (${res.status})`);
    e.status = res.status;
    throw e;
  }
  return data as T;
}

export const startLevel16 = (playerId: number) =>
  call<{ success: boolean; sessionId: number; hintsUsed: number; wrongAttempts: number; level: Level16Data }>(
    '/start',
    { playerId }
  );

export const answerLevel16 = (playerId: number, sessionId: number, choice: string) =>
  call<{
    success: boolean;
    correct: boolean;
    explanation: string | null;
    attempts: number;
    wrongAttempts: number;
    hintsUsed: number;
    seconds: number;
  }>('/answer', { playerId, sessionId, choice });

export const hintLevel16 = (playerId: number, sessionId: number) =>
  call<{ success: boolean; hint: { text: string }; hints: number }>('/hint', { playerId, sessionId });

export const skipLevel16 = (playerId: number, sessionId: number) =>
  call<{ success: boolean; skipped: boolean; attempts: number; hints: number }>('/skip', {
    playerId,
    sessionId,
  });