// // Change BASE_URL to match your other Btlevel*api.ts files
// const BASE_URL = 'http://YOUR_IP:5000/api/braintwist/level22';

// export type L22StartResponse = {
//   success: boolean;
//   sessionId: number;
//   question: { text: string; options: string[] };
// };

// export type L22AnswerResponse = {
//   success: boolean;
//   correct: boolean;
//   coins?: number;
//   explanation?: string;
//   message?: string;
// };

// export async function startLevel22(userId: number): Promise<L22StartResponse> {
//   const res = await fetch(`${BASE_URL}/start`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ userId }),
//   });
//   return res.json();
// }

// export async function submitLevel22Answer(
//   userId: number,
//   sessionId: number,
//   answer: string
// ): Promise<L22AnswerResponse> {
//   const res = await fetch(`${BASE_URL}/answer`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ userId, sessionId, answer }),
//   });
//   return res.json();
// }
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
  question: { text: string; options: string[] };
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

export function submitLevel22Answer(
  playerId: number,
  sessionId: number,
  answer: string
): Promise<L22AnswerResponse> {
  return post('/answer', { playerId, sessionId, answer });
}

export async function getLevel22Status(playerId: number) {
  const res = await fetch(`${BASE_URL}/status/${playerId}`);
  return res.json();
}