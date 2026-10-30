// Btlevel30api.ts
import { Platform } from 'react-native';

// Phone la (Expo Go) test panna mattum, unga PC oda LAN IP inga podunga. e.g. '192.168.1.5'
const LAN_IP = '';
const PORT = 4000;

const HOST =
  Platform.OS === 'web'
    ? 'localhost'
    : LAN_IP || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');

export const BASE_URL = `http://${HOST}:${PORT}/api/braintwist/level30`;

export interface Level30Data {
  success: boolean;
  level: number;
  question: string;
  pieces: string[]; // art keys, left to right: can, you, be, ready, at, five
  hintCost: number;
  skipCost: number;
  videoReward: number;
  hints: number | null;
  progress: { attempts: number; solved: boolean; skipped: boolean; hintsUsed: number };
}

export interface Level30AnswerRes {
  success: boolean;
  correct: boolean;
  attempts: number;
  answer?: string;
  message: string;
}

export interface Level30HintRes {
  success: boolean;
  hints: number;
  hint: { text: string };
}

export interface Level30SkipRes {
  success: boolean;
  hints: number;
  skipped: boolean;
  attempts: number;
}

export interface Level30RewardRes {
  success: boolean;
  hints: number;
  added: number;
}

async function post<T>(path: string, body: any): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch (e) {}
  if (!res.ok) {
    const err: any = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.url = url;
    throw err;
  }
  return data as T;
}

export const startLevel30 = (playerId: any) => post<Level30Data>('/start', { playerId });
export const answerLevel30 = (playerId: any, answer: string) =>
  post<Level30AnswerRes>('/answer', { playerId, answer });
export const hintLevel30 = (playerId: any) => post<Level30HintRes>('/hint', { playerId });
export const skipLevel30 = (playerId: any) => post<Level30SkipRes>('/skip', { playerId });
export const rewardLevel30 = (playerId: any) =>
  post<Level30RewardRes>('/reward', { playerId, kind: 'video' });