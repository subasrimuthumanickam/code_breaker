import { Platform } from 'react-native';

// Same machine that runs the Express server (port 4000).
//  - web / iOS simulator -> localhost
//  - Android emulator    -> 10.0.2.2
//  - real phone (Expo Go) -> put your PC's LAN IP here, e.g. 'http://192.168.1.5:4000'
const LAN_IP: string | null = null;
const HOST = LAN_IP ?? (Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000');
export const API_BASE_URL = `${HOST}/api/braintwist/level50`;

export type SwitchRule = { on: number[]; off: number[] };
export type Move = { s: number; on: boolean };

export type Level50Info = {
  ok: boolean;
  question: string;
  bulbs: number;
  switches: SwitchRule[];
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
  if (!res.ok) throw new Error(json.message || json.error || 'Request failed');
  return json as T;
}

export const fetchLevel50Info = (playerId: string) =>
  request<Level50Info>(`/info?playerId=${encodeURIComponent(playerId)}`);

export const submitLevel50Answer = (playerId: string, moves: Move[], dragged: boolean) =>
  request<{ ok: boolean; correct: boolean; reward: number; bulbs: number[] }>('/answer', {
    method: 'POST',
    body: JSON.stringify({ playerId, moves, dragged }),
  });

export const requestLevel50Clue = (playerId: string, hints: number) =>
  request<{ ok: boolean; text?: string; cost?: number; error?: string }>('/clue', {
    method: 'POST',
    body: JSON.stringify({ playerId, hints }),
  });

export const requestLevel50Skip = (playerId: string, hints: number) =>
  request<{ ok: boolean; cost?: number; error?: string }>('/skip', {
    method: 'POST',
    body: JSON.stringify({ playerId, hints }),
  });
