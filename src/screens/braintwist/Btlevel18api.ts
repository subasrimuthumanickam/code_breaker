
const BASE = 'http://localhost:4000/api/braintwist/level18';

async function post(path: string, body: object): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { ...json, status: res.status };
}

export const startLevel18 = (playerId: number) => post('/start', { playerId });
export const answer18 = (sessionId: number, playerId: number, answer: string) =>
  post('/answer', { sessionId, playerId, answer });
export const hint18 = (sessionId: number, playerId: number) => post('/hint', { sessionId, playerId });
export const skip18 = (sessionId: number, playerId: number) => post('/skip', { sessionId, playerId });
export const reward18 = (playerId: number) => post('/reward', { playerId, kind: 'video' });