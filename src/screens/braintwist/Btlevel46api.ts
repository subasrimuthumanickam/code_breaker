
import { Platform } from 'react-native';
import type { Stick } from './Btlevel46art';

// Same machine that runs the Express server (port 4000).
//  - web / iOS simulator -> localhost
//  - Android emulator    -> 10.0.2.2
//  - real phone (Expo Go) -> put your PC's LAN IP here, e.g. 'http://192.168.1.5:4000'
const LAN_IP: string | null = null;
const HOST = LAN_IP ?? (Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000');
export const API_BASE_URL = `${HOST}/api/braintwist/level46`;

export interface Level46Data {
  id: number;
  question: string;
  removeCount: number;
  targetText: string;
  hint: string;
  sticks: Stick[];
}

export interface CheckResult {
  correct: boolean;
  removedCount: number;
  resultText: string;
  message: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // never hang forever: abort after 8s so the screen shows an error instead of a spinner
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
    throw new Error(json.message || 'Request failed');
  }
  return json as T;
}

export async function fetchLevel46(): Promise<Level46Data> {
  const json = await request<{ data: Level46Data }>('/');
  return json.data;
}

export async function checkLevel46(removedIds: string[]): Promise<CheckResult> {
  return request<CheckResult>('/check', {
    method: 'POST',
    body: JSON.stringify({ removedIds }),
  });
}

export async function fetchLevel46Solution(): Promise<string[]> {
  const json = await request<{ data: { solutionIds: string[] } }>('/solution');
  return json.data.solutionIds;
}