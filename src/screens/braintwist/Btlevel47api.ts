import { Platform } from 'react-native';

// Same machine that runs the Express server (port 4000).
//  - web / iOS simulator -> localhost
//  - Android emulator    -> 10.0.2.2
//  - real phone (Expo Go) -> put your PC's LAN IP here, e.g. 'http://192.168.1.5:4000'
const LAN_IP: string | null = null;
const HOST = LAN_IP ?? (Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000');
export const API_BASE_URL = `${HOST}/api/braintwist/level47`;

export interface NumberItem {
  id: string;
  value: number;
}

export interface Level47Data {
  id: number;
  question: string;
  hint: string;
  items: NumberItem[]; // already in display order (top -> bottom)
}

export interface CheckResult {
  correct: boolean; // full sequence matched
  valid: boolean; // sequence so far is right
  count: number;
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
    throw new Error(json.message || 'Request failed');
  }
  return json as T;
}

export async function fetchLevel47(): Promise<Level47Data> {
  const json = await request<{ data: Level47Data }>('/');
  return json.data;
}

export async function checkLevel47(clickedIds: string[]): Promise<CheckResult> {
  return request<CheckResult>('/check', {
    method: 'POST',
    body: JSON.stringify({ clickedIds }),
  });
}

export async function fetchLevel47Solution(): Promise<string[]> {
  const json = await request<{ data: { solutionIds: string[] } }>('/solution');
  return json.data.solutionIds;
}