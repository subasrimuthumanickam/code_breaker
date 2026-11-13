
import { Platform } from 'react-native';

// Same machine that runs the Express server (port 4000).
//  - web / iOS simulator -> localhost
//  - Android emulator    -> 10.0.2.2
//  - real phone (Expo Go) -> put your PC's LAN IP here, e.g. 'http://192.168.1.5:4000'
const LAN_IP: string | null = null;
const HOST = LAN_IP ?? (Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000');
export const API_BASE_URL = `${HOST}/api/braintwist/level49`;

export type Level49Info = {
  ok: boolean;
  question: string;
  length: number;
  rows: number[];
  clueCost: number;
  skipCost: number;
  solved: boolean;
  cluesUsed: number;
  error?: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      ...init,
    });
  } catch (e) {
    throw new Error('Cannot reach server: ' + API_BASE_URL);
  } finally {
    clearTimeout(timer);
  }
  const json = await res.json();
  if (!res.ok || json.ok === false) {
    // not_enough_hints etc. are returned with ok:false on purpose -> let the caller read them
    if (json && json.error && res.ok) return json as T;
    throw new Error(json.message || json.error || 'Request failed');
  }
  return json as T;
}

export const fetchLevel49Info = (playerId: string) =>
  request<Level49Info>(`/info?playerId=${encodeURIComponent(playerId)}`);

export const submitLevel49Answer = (playerId: string, guess: string) =>
  request<{ ok: boolean; correct: boolean; reward: number }>('/answer', {
    method: 'POST',
    body: JSON.stringify({ playerId, guess }),
  });

export const requestLevel49Clue = (playerId: string, revealed: number[]) =>
  request<{ ok: boolean; index?: number; letter?: string; cost?: number; error?: string }>('/clue', {
    method: 'POST',
    body: JSON.stringify({ playerId, revealed }),
  });

export const requestLevel49Skip = (playerId: string, hints: number) =>
  request<{ ok: boolean; cost?: number; error?: string }>('/skip', {
    method: 'POST',
    body: JSON.stringify({ playerId, hints }),
  });