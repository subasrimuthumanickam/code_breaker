// // src/screens/braintwist/Btlevel20api.ts

// // TODO: copy the same BASE url line that Btlevel19api.ts uses
// const BASE = 'http://YOUR_SERVER_IP:4000/api/braintwist/level20';

// export type Level20Option = { key: 'A' | 'B' | 'C' | 'D'; label: string };

// export type Level20StartResponse = {
//   success: boolean;
//   sessionId: number;
//   attempts: number;
//   question: { text: string; options: Level20Option[] };
// };

// export type Level20AnswerResponse = {
//   success: boolean;
//   correct?: boolean;
//   attempts?: number;
//   correctKey?: string;
//   explanation?: string;
//   error?: string;
// };

// async function post<T>(path: string, body: object): Promise<T> {
//   const res = await fetch(`${BASE}${path}`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   });
//   const json = await res.json();
//   if (!res.ok) throw new Error(json.error || 'Request failed');
//   return json as T;
// }

// export const startLevel20 = (playerId: number) =>
//   post<Level20StartResponse>('/start', { playerId });

// export const submitLevel20Answer = (playerId: number, sessionId: number, choice: string) =>
//   post<Level20AnswerResponse>('/answer', { playerId, sessionId, choice });
// src/screens/braintwist/Btlevel20api.ts

// Server address: reuse the SAME address your other levels use (exported from ./api).
// Common export names are tried automatically. To force one, set FORCE_API_ORIGIN,
// e.g. 'http://192.168.1.10:4000' (no /api at the end).
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

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json as T;
}

export const startLevel20 = (playerId: number) =>
  post<Level20StartResponse>('/start', { playerId });

export const submitLevel20Answer = (playerId: number, sessionId: number, choice: string) =>
  post<Level20AnswerResponse>('/answer', { playerId, sessionId, choice });