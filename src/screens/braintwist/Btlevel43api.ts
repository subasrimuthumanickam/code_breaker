
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
const PREFIX = `${BASE_URL}/api/braintwist/level43`;
const TIMEOUT_MS = 8000;

export type Rect = { x: number; y: number; w: number; h: number };
export type Level43Layout = {
  area: { w: number; h: number };
  banana: Rect;
  wire: { y: number; h: number };
  monkey: Rect;
};
export type Level43Config = {
  level: number;
  question: string;
  layout: Level43Layout;
  completed: boolean;
  attempts: number;
};
export type Level43SubmitResult = { correct: boolean; attempts: number; message: string };

type ApiResponse<T> = { success: boolean; message?: string; error?: string; data: T };

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      ...options,
    });
    let json: ApiResponse<T>;
    try {
      json = await res.json();
    } catch {
      throw new Error(`Bad response from server (HTTP ${res.status}). Is the level43 route mounted?`);
    }
    if (!res.ok || !json.success) {
      throw new Error(json.message || json.error || `Request failed (HTTP ${res.status})`);
    }
    return json.data;
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      throw new Error(`Server not responding (${BASE_URL}). Is the backend running?`);
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export const getLevel43Config = (playerId: string | number) =>
  request<Level43Config>(`${PREFIX}/config?playerId=${encodeURIComponent(String(playerId))}`);

// target = where the bananas were dropped: 'monkey_word' | 'monkey_image' | 'none'
export const submitLevel43Drop = (
  playerId: string | number,
  item: string,
  target: string,
  x: number,
  y: number
) =>
  request<Level43SubmitResult>(`${PREFIX}/submit`, {
    method: 'POST',
    body: JSON.stringify({ playerId, item, target, x, y }),
  });