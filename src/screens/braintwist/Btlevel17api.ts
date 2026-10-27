
// const BASE = 'http://localhost:4000/api/braintwist/level17';

// async function post(path: string, body: object): Promise<any> {
//   const res = await fetch(`${BASE}${path}`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   });
//   const json = await res.json().catch(() => ({}));
//   return { ...json, status: res.status };
// }

// export const startLevel17 = (playerId: number) => post('/start', { playerId });
// export const reveal17 = (sessionId: number, playerId: number) => post('/reveal', { sessionId, playerId });
// export const answer17 = (sessionId: number, playerId: number, answer: number) =>
//   post('/answer', { sessionId, playerId, answer });
// export const hint17 = (sessionId: number, playerId: number) => post('/hint', { sessionId, playerId });
// export const skip17 = (sessionId: number, playerId: number) => post('/skip', { sessionId, playerId });
// export const reward17 = (playerId: number) => post('/reward', { playerId, kind: 'video' });
const BASE = 'http://localhost:4000/api/braintwist/level17';

async function post(path: string, body: object): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { ...json, status: res.status };
}

export const startLevel17 = (playerId: number) => post('/start', { playerId });
export const reveal17 = (sessionId: number, playerId: number) => post('/reveal', { sessionId, playerId });
export const answer17 = (sessionId: number, playerId: number, answer: number) =>
  post('/answer', { sessionId, playerId, answer });
// the clue is free: it uses /clue (a new path, so no old /hint code can answer it)
export const hint17 = (sessionId: number, playerId: number) => post('/clue', { sessionId, playerId });
export const skip17 = (sessionId: number, playerId: number) => post('/skip', { sessionId, playerId });
export const reward17 = (playerId: number) => post('/reward', { playerId, kind: 'video' });