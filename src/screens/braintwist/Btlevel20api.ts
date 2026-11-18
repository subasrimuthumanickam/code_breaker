
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

const BASE = `${detectHost()}/api/braintwist/level20`;
console.log('[Level20] API base:', BASE);

// key is A-D, label is a number from 1 to 200 (sent by the backend as text)
export type Level20Option = { key: 'A' | 'B' | 'C' | 'D'; label: string };

export type Level20StartResponse = {
  success: boolean;
  sessionId: number;
  attempts: number;
  question: { text: string; options: Level20Option[] };
};

export type Level20AnswerResponse = {
  success: boolean;
  correct?: boolean;
  attempts?: number;
  correctKey?: string;
  explanation?: string;
  error?: string;
};

export type Level20HintResponse = {
  success: boolean;
  free: boolean;
  cost: number;
  text: string;
  hintsUsed: number;
  error?: string;
};

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let json: any = {};
  try { json = await res.json(); } catch (e) {}
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json as T;
}

// 1. start: backend makes (or reuses) a session with 4 numbers from 1 to 200, saved in MySQL
export const startLevel20 = (playerId: number) =>
  post<Level20StartResponse>('/start', { playerId });

// 2. answer: backend checks the choice against the saved numbers
export const submitLevel20Answer = (playerId: number, sessionId: number, choice: string) =>
  post<Level20AnswerResponse>('/answer', { playerId, sessionId, choice });

// 3. hint: backend saves the hint use and sends the hint text
export const getLevel20Hint = (playerId: number, sessionId: number) =>
  post<Level20HintResponse>('/hint', { playerId, sessionId });