// Level 11 API client -> /api/braintwist/level11/*
// !!! Set BASE the same way Btlevel10api.ts does (copy its base URL line) !!!
import {Platform} from 'react-native';

const BASE: string =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
const URL11 = BASE + '/api/braintwist/level11';

async function call(path: string, body?: any, method = 'POST') {
  let res: Response;
  try {
    res = await fetch(URL11 + path, {
      method,
      headers: {'Content-Type': 'application/json'},
      body: method === 'GET' ? undefined : JSON.stringify(body || {}),
    });
  } catch (e) {
    const err: any = new Error('Network error');
    err.status = 0;
    throw err;
  }
  let data: any = null;
  try { data = await res.json(); } catch (e) {}
  if (!res.ok || !data || data.success === false) {
    const err: any = new Error((data && data.error) || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const start = (playerId: number) => call('/start', {playerId});
export const answer = (playerId: number, answer: string | number) => call('/answer', {playerId, answer});
export const hint = (playerId: number) => call('/hint', {playerId});
export const skip = (playerId: number) => call('/skip', {playerId});
export const status = (playerId: number) => call('/status/' + playerId, undefined, 'GET');