
const BASE = 'http://localhost:4000/api/braintwist/level14';

export type Action = 'open_fridge' | 'giraffe_in' | 'close_fridge';

async function post(path: string, body: object): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { ...json, status: res.status };
}

export const startLevel14 = (playerId: number) => post('/start', { playerId });

export const sendAction14 = (sessionId: number, playerId: number, action: Action) =>
  post('/action', { sessionId, playerId, action });

export const hint14 = (sessionId: number, playerId: number) =>
  post('/hint', { sessionId, playerId });

export const skip14 = (sessionId: number, playerId: number) =>
  post('/skip', { sessionId, playerId });

export const reward14 = (playerId: number) =>
  post('/reward', { playerId, kind: 'video' });