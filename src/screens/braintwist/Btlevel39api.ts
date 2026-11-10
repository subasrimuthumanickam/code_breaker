
import { Platform } from 'react-native';

// Web browser / iOS simulator -> localhost | Android emulator -> 10.0.2.2
// Real phone -> set EXPO_PUBLIC_API_URL=http://<PC-LAN-IP>:4000/api/braintwist
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${HOST}:4000/api/braintwist`;

export interface Level39Data {
  level: number;
  question: string;
  coins: number;
  solved: boolean;
  costs: { search: number; clue: number; skip: number };
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

async function request<T>(path: string, method: 'GET' | 'POST', body?: object): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    return await res.json();
  } catch (e) {
    return { success: false, message: 'Network error' };
  }
}

export const getLevel39 = (userId: string) =>
  request<Level39Data>(`/level39?userId=${encodeURIComponent(userId)}`, 'GET');

export const submitLevel39 = (userId: string, answer: string) =>
  request<{ correct: boolean; coins: number; reward: number; nextLevel: number | null; message: string }>(
    '/level39/submit', 'POST', { userId, answer });

export const searchLevel39 = (userId: string) =>
  request<{ hint: string; coins: number }>('/level39/search', 'POST', { userId });

export const clueLevel39 = (userId: string) =>
  request<{ added: number; coins: number }>('/level39/clue', 'POST', { userId });

export const skipLevel39 = (userId: string) =>
  request<{ coins: number; nextLevel: number }>('/level39/skip', 'POST', { userId });