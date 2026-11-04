import { Platform } from 'react-native';

// Browser (expo web) runs on the same PC as the backend, so use localhost there.
// Phone / emulator uses the PC's LAN IP.
const HOST = Platform.OS === 'web' ? 'http://localhost:4000' : 'http://192.168.31.241:4000';
const BASE_URL = `${HOST}/api/braintwist`;

const TIMEOUT_MS = 3000; // if the server doesn't answer in 3s, the screen uses its offline fallback

export interface Level45Option {
  label: string;
  color: string;
}

export interface Level45Stage {
  stage: number;
  prompt: string;
  options: Level45Option[];
}

export interface Level45Data {
  level: number;
  hintCost: number;
  skipCost: number;
  stages: Level45Stage[];
}

export interface Level45CheckResult {
  correct: boolean;
  message: string;
  completed: boolean;
  nextStage: number | null;
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

export const fetchLevel45 = () => request<Level45Data>('/level45');

export const checkLevel45 = (userId: string, stage: number, pickedIndex: number) =>
  request<Level45CheckResult>('/level45/check', {
    method: 'POST',
    body: JSON.stringify({ userId, stage, pickedIndex }),
  });

export const getLevel45Hint = (userId: string, stage: number) =>
  request<{ hint: string; cost: number }>('/level45/hint', {
    method: 'POST',
    body: JSON.stringify({ userId, stage }),
  });