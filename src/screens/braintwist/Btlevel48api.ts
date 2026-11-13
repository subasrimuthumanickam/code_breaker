import { Platform } from 'react-native';

// Same machine that runs the Express server (port 4000).
//  - web / iOS simulator -> localhost
//  - Android emulator    -> 10.0.2.2
//  - real phone (Expo Go) -> put your PC's LAN IP here, e.g. 'http://192.168.1.5:4000'
const LAN_IP: string | null = null;
const HOST = LAN_IP ?? (Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000');
export const API_BASE_URL = `${HOST}/api/braintwist/level48`;

export interface Level48Data {
  id: number;
  question: string;
}

export interface CheckResult {
  correct: boolean;
  message: string;
}

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
  if (!res.ok || json.success === false) {
    throw new Error(json.message || json.error || 'Request failed');
  }
  return json as T;
}

export async function fetchLevel48(): Promise<Level48Data> {
  const json = await request<{ data: Level48Data }>('/');
  return json.data;
}

export async function checkLevel48(answer: number): Promise<CheckResult> {
  return request<CheckResult>('/check', {
    method: 'POST',
    body: JSON.stringify({ answer }),
  });
}

export async function fetchLevel48Hint(playerId: number | string): Promise<string> {
  const json = await request<{ data: { hint: string } }>('/hint', {
    method: 'POST',
    body: JSON.stringify({ playerId }),
  });
  return json.data.hint;
}