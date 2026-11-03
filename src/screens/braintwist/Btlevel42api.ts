
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
const PREFIX = `${BASE_URL}/api/braintwist/level42`;

export type SliceConfig = { id: number; x: number; y: number; rot: number; hasHidden: boolean };
export type Level42Config = {
  level: number; question: string; slices: SliceConfig[]; completed: boolean; attempts: number;
};
export type Level42SubmitResult = { correct: boolean; attempts: number; message: string };

type ApiResponse<T> = { success: boolean; message?: string; data: T };

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const json: ApiResponse<T> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Request failed');
  return json.data;
}

export const getLevel42Config = (playerId: string | number) =>
  request<Level42Config>(`${PREFIX}/config?playerId=${encodeURIComponent(String(playerId))}`);

export const submitLevel42Answer = (playerId: string | number, answer: number, draggedCount: number) =>
  request<Level42SubmitResult>(`${PREFIX}/submit`, {
    method: 'POST',
    body: JSON.stringify({ playerId, answer, draggedCount }),
  });