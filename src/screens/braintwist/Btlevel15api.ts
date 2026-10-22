
import * as cfg from './config';


const raw: any = cfg as any;
const named = raw.API_URL ?? raw.API_BASE ?? raw.BASE_URL ?? raw.SERVER_URL ?? raw.URL ?? raw.default;
const anyHttp = Object.values(raw).find((v) => typeof v === 'string' && /^https?:\/\//.test(v as string));
const ROOT: string = String(
  (typeof named === 'string' ? named : undefined) ?? (anyHttp as string | undefined) ?? ''
).replace(/\/+$/, '');

// works whether your config value is "http://host:4000", ".../api" or ".../api/braintwist"
const BASE = `${ROOT.replace(/\/api(\/.*)?$/, '')}/api/braintwist/level15`;

export type L15Session = {
  success: boolean;
  sessionId: number;
  level: number;
  status: string;
  vaultMoved: boolean;
  code: string | null; // only sent after the vault was moved
  codeLength: number;
  wrongAttempts: number;
  hints: number;
  title?: string;
  message?: string;
};

export type L15EnterResult = {
  success: boolean;
  correct: boolean;
  completed: boolean;
  message: string;
  wrongAttempts?: number;
  score?: number;
  stars?: number;
  attempts?: number;
  seconds?: number;
  progressSaved?: boolean;
};

async function call<T>(path: string, method: 'GET' | 'POST' = 'POST', body?: object): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* not json */
  }

  if (!res.ok || (data && data.success === false)) {
    // the server's 404 handler sends { error: "No route: POST /xxx" }, so show that text too
    const err: any = new Error(data?.message || data?.error || `Request failed (${res.status})`);
    err.code = data?.error;
    err.status = res.status;
    throw err;
  }
  return data as T;
}

export const startLevel15 = (playerId: number) =>
  call<L15Session>('/start', 'POST', { playerId });

export const moveVault = (sessionId: number, playerId: number) =>
  call<L15Session>('/move', 'POST', { sessionId, playerId });

export const tapThing = (sessionId: number, playerId: number, target: string) =>
  call<{ success: boolean; message: string }>('/tap', 'POST', { sessionId, playerId, target });

export const enterCode = (sessionId: number, playerId: number, code: string) =>
  call<L15EnterResult>('/enter', 'POST', { sessionId, playerId, code });

export const buyHint = (sessionId: number, playerId: number) =>
  call<{ success: boolean; hints: number; message: string }>('/hint', 'POST', { sessionId, playerId });

export const skipLevel = (sessionId: number, playerId: number) =>
  call<{ success: boolean; hints: number }>('/skip', 'POST', { sessionId, playerId });

export const rewardHints = (playerId: number) =>
  call<{ success: boolean; hints: number; added: number }>('/reward', 'POST', { playerId });

export const getStatus15 = (playerId: number) =>
  call<{ success: boolean; completed: boolean; score: number; stars: number; attempts: number }>(
    `/status/${playerId}`,
    'GET'
  );