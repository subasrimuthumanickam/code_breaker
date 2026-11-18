
import { Platform } from 'react-native';

// ---- server address -------------------------------------------------------
// Web (localhost:8081 etc.)  -> uses the same host as the page, port 4000.
// Phone / emulator           -> put your PC's LAN IP below (same one your other
//                               Btlevel*api.ts / api.ts files use).
const PORT = 4000;
const LAN_IP = '192.168.1.5'; // <-- CHANGE to your PC IP for phone / emulator

const HOST =
  Platform.OS === 'web'
    ? (typeof window !== 'undefined' && window.location && window.location.hostname) || 'localhost'
    : LAN_IP;

export const BASE_URL = `http://${HOST}:${PORT}/api/braintwist/level22`;

export type L22StartResponse = {
  success: boolean;
  sessionId: number;
  question: { text: string };
  error?: string;
};

export type L22AnswerResponse = {
  success: boolean;
  correct: boolean;
  attempts?: number;
  coins?: number;
  explanation?: string;
  message?: string;
  error?: string;
};

export type L22HintResponse = {
  success: boolean;
  text: string;
  error?: string;
};

async function post(path: string, body: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export function startLevel22(playerId: number): Promise<L22StartResponse> {
  return post('/start', { playerId });
}

// moves look like: ['apple:0', 'apple:1', 'plate:2']
//   apple:K = one loose apple given to kid K (0 = left, 1 = middle, 2 = right)
//   plate:K = the plate (with its apples) given to kid K
export function submitLevel22Answer(
  playerId: number,
  sessionId: number,
  moves: string[]
): Promise<L22AnswerResponse> {
  return post('/answer', { playerId, sessionId, moves });
}

// hint: the backend saves the hint use and sends the hint text
export async function getLevel22Hint(playerId: number, sessionId: number): Promise<L22HintResponse> {
  const data = await post('/hint', { playerId, sessionId });
  if (!data || data.success === false) {
    throw new Error((data && data.error) || 'Hint not available');
  }
  return data as L22HintResponse;
}

export async function getLevel22Status(playerId: number) {
  const res = await fetch(`${BASE_URL}/status/${playerId}`);
  return res.json();
}