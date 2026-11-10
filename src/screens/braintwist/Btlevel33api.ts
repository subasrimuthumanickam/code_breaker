
const HOST = 'http://YOUR_PC_IP:4000'; // Android emulator: http://10.0.2.2:4000, web: http://localhost:4000
export const API_BASE = `${HOST}/api/braintwist/level33`;

export type OptionId = 'A' | 'B' | 'C' | 'D';

export interface Level33Question {
  title: string;
  prompt: string;
  options: { id: OptionId; text: string }[];
  hintCost: number;
  skipCost: number;
  videoReward: number;
  reward: number;
}

export interface Level33Data {
  success: boolean;
  level: number;
  question: Level33Question;
  hints: number;
  progress: { status: string; attempts: number; hintUsed: boolean; skipped: boolean };
}

export interface AnswerResponse {
  success: boolean;
  correct: boolean;
  reward: number;
  attempts: number;
  hints: number;
  message: string;
}

export interface HintResponse {
  success: boolean;
  hints: number;
  hint?: { text?: string; removeOption?: OptionId };
  error?: string;
}

export interface SimpleResponse {
  success: boolean;
  hints: number;
  skipped?: boolean;
  attempts?: number;
  reward?: number;
  error?: string;
}

// 402 (not enough hints) response kooda JSON body vaangi return pannum
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return (await res.json()) as T;
}

const post = <T,>(path: string, body: object) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) });

export const level33Api = {
  getLevel: (playerId: number) => request<Level33Data>(`/start?playerId=${playerId}`),
  submitAnswer: (playerId: number, answer: OptionId) =>
    post<AnswerResponse>('/answer', { playerId, answer }),
  useHint: (playerId: number) => post<HintResponse>('/hint', { playerId }),
  skip: (playerId: number) => post<SimpleResponse>('/skip', { playerId }),
  videoReward: (playerId: number) => post<SimpleResponse>('/reward', { playerId }),
};