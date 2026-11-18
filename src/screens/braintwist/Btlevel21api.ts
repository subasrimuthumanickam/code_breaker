
import * as shared from './api';

const FORCE_API_ORIGIN: string | null = null;

function originFromShared(): string | null {
  const m: any = shared;
  const cand = [
    m.BASE, m.API_BASE, m.API_URL, m.BASE_URL, m.baseUrl, m.API, m.HOST, m.SERVER_URL, m.URL,
    m.default?.BASE, m.default?.API_BASE, m.default?.API_URL, m.default?.BASE_URL,
  ].find((v: any) => typeof v === 'string' && v.startsWith('http'));
  if (!cand) return null;
  const i = cand.indexOf('/api');            // keep only http://host:port
  return (i >= 0 ? cand.slice(0, i) : cand).replace(/\/+$/, '');
}

function detectHost(): string {
  if (FORCE_API_ORIGIN) return FORCE_API_ORIGIN;
  const fromShared = originFromShared();
  if (fromShared) return fromShared;
  try {
    const { Platform } = require('react-native');
    if (Platform.OS === 'web') return `http://${(globalThis as any).location?.hostname || 'localhost'}:4000`;
    const Constants = require('expo-constants').default;
    const hostUri: string | undefined = Constants?.expoConfig?.hostUri || Constants?.manifest?.debuggerHost;
    const ip = hostUri?.split(':')[0];
    if (ip) return `http://${ip}:4000`;
  } catch (e) {}
  return 'http://localhost:4000';
}

const BASE = `${detectHost()}/api/braintwist/level21`;
console.log('[Level21] API base:', BASE);

export type Level21View = {
  success: boolean;
  sessionId: number;
  puzzleId: number;
  title: string;
  hint: string;
  target: number;
  numbers: number[];      // 9 numbers between 1 and 200, made by the backend
  pickCount: number;
};

export type Level21Action = {
  success: boolean;
  correct?: boolean;
  completed?: boolean;
  skipped?: boolean;
  total?: number;
  message?: string;
  score?: number;
  stars?: number;
  attempts?: number;
  hints?: number;
};

export type Level21Hint = {
  success: boolean;
  charged?: boolean;
  hints: number;
  message: string;        // the single hint shown in the popup
};

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data: any = null;
  try { data = await res.json(); } catch (e) {}
  if (!res.ok || (data && data.success === false)) {
    throw new Error((data && data.message) || ('Request failed (' + res.status + ')'));
  }
  return data as T;
}

// 1. start: backend makes (or reuses) a session with 9 numbers, saved in MySQL
export const startLevel21 = (playerId: number) =>
  post<Level21View>('/start', { playerId });

// 2. submit the 4 picked numbers: backend adds them up and replies JSON
export const submitPicks = (p: { sessionId: number; playerId: number; picks: number[] }) =>
  post<Level21Action>('/action', p);

// 3. hint: backend returns the single hint without revealing answer numbers
export const requestHint21 = (p: { sessionId: number; playerId: number }) =>
  post<Level21Hint>('/hint', p);

// 4. skip (50 hints)
export const skipLevel21 = (p: { sessionId: number; playerId: number }) =>
  post<Level21Action>('/skip', p);