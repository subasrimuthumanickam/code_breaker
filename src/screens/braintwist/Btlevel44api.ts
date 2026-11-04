
import { Platform } from 'react-native';

// Browser (expo web) runs on the same PC as the backend, so use localhost there.
// Phone / emulator uses the PC's LAN IP.
const HOST = Platform.OS === 'web' ? 'http://localhost:4000' : 'http://192.168.31.241:4000';
const BASE_URL = `${HOST}/api/braintwist`;

const TIMEOUT_MS = 3000; // if the server doesn't answer in 3s, the screen uses its offline fallback

export interface Level44Data {
  level: number;
  prefix: string;
  suffix: string;
  shownNumber: number;
  appleCount: number;
  hintCost: number;
  skipCost: number;
}

export interface CheckResult {
  correct: boolean;
  message: string;
  nextLevel: number | null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export const fetchLevel44 = () => request<Level44Data>('/level44');

export const checkLevel44 = (userId: string, answer: number) =>
  request<CheckResult>('/level44/check', {
    method: 'POST',
    body: JSON.stringify({ userId, answer }),
  });

export const getLevel44Hint = (userId: string) =>
  request<{ hint: string; cost: number }>('/level44/hint', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });