import { Platform } from 'react-native';

// Web  -> same host as the page, port 4000.
// Phone / emulator -> set LAN_IP to your PC IP (same one your other api files use).
const PORT = 4000;
const LAN_IP = '192.168.1.5'; // <-- CHANGE for phone / emulator

const HOST =
  Platform.OS === 'web'
    ? (typeof window !== 'undefined' && window.location && window.location.hostname) || 'localhost'
    : LAN_IP;

export const BASE_URL = `http://${HOST}:${PORT}/api/braintwist/level23`;

export type L23StartResponse = {
  success: boolean;
  sessionId: number;
  question: string;
  sequence: string[];
  error?: string;
};

export type L23AnswerResponse = {
  success: boolean;
  correct: boolean;
  matched?: number;
  attempts?: number;
  coins?: number;
  explanation?: string;
  message?: string;
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

export function startLevel23(playerId: number): Promise<L23StartResponse> {
  return post('/start', { playerId });
}

export function submitLevel23Answer(
  playerId: number,
  sessionId: number,
  answer: string[]
): Promise<L23AnswerResponse> {
  return post('/answer', { playerId, sessionId, answer });
}

export async function getLevel23Status(playerId: number) {
  const res = await fetch(`${BASE_URL}/status/${playerId}`);
  return res.json();
}