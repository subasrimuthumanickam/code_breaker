// // // // Same base-URL import that Btlevel23api.ts uses. Change the name if yours differs.
// // // import { API_BASE } from './config';

// // // export type Level24Option = { id: 'A' | 'B' | 'C'; text: string };

// // // export type Level24Start = {
// // //   success: boolean;
// // //   sessionId: number;
// // //   question: string;
// // //   options: Level24Option[];
// // // };

// // // export type Level24Answer = {
// // //   success: boolean;
// // //   correct: boolean;
// // //   attempts: number;
// // // };

// // // const url = (p: string) => `${API_BASE}/api/braintwist/level24${p}`;

// // // async function post<T>(path: string, body: any): Promise<T> {
// // //   const res = await fetch(url(path), {
// // //     method: 'POST',
// // //     headers: { 'Content-Type': 'application/json' },
// // //     body: JSON.stringify(body),
// // //   });
// // //   if (!res.ok) throw new Error(`Level 24 request failed (${res.status})`);
// // //   return res.json();
// // // }

// // // export const startLevel24 = (playerId: number | string) =>
// // //   post<Level24Start>('/start', { playerId });

// // // export const answerLevel24 = (
// // //   playerId: number | string,
// // //   sessionId: number,
// // //   optionId: string,
// // // ) => post<Level24Answer>('/answer', { playerId, sessionId, optionId });
// // // Works with whatever name your config.ts uses for the server address.
// // import * as cfg from './config';

// // const BASE: string =
// //   (cfg as any).API_BASE ||
// //   (cfg as any).API_URL ||
// //   (cfg as any).API_BASE_URL ||
// //   (cfg as any).BASE_URL ||
// //   (cfg as any).SERVER_URL ||
// //   (cfg as any).default ||
// //   '';

// // export type Level24Answer = {
// //   success: boolean;
// //   correct: boolean;
// //   attempts: number;
// // };

// // const url = (p: string) => `${BASE}/api/braintwist/level24${p}`;

// // export async function answerLevel24(
// //   playerId: number | string,
// //   optionId: string,
// //   attempts: number,
// // ): Promise<Level24Answer> {
// //   let res: Response;
// //   try {
// //     res = await fetch(url('/answer'), {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({ playerId, optionId, attempts }),
// //     });
// //   } catch {
// //     throw new Error('Cannot reach server');
// //   }
// //   if (!res.ok) throw new Error('Server error ' + res.status);
// //   return res.json();
// // }
// // Finds the server address from your config.ts automatically,
// // whatever the export is called (API_BASE, API_URL, BASE_URL, API.baseUrl ...).
// import * as cfg from './config';

// function findBase(): string {
//   const seen = new Set<any>();
//   const walk = (o: any, depth: number): string => {
//     if (!o || depth > 2 || seen.has(o)) return '';
//     if (typeof o === 'string') return /^https?:\/\//i.test(o) ? o : '';
//     if (typeof o !== 'object') return '';
//     seen.add(o);
//     // prefer keys that look like an address
//     const keys = Object.keys(o).sort((a, b) => {
//       const w = (k: string) => (/api|base|url|server|host/i.test(k) ? 0 : 1);
//       return w(a) - w(b);
//     });
//     for (const k of keys) {
//       const r = walk(o[k], depth + 1);
//       if (r) return r;
//     }
//     return '';
//   };
//   return walk(cfg, 0);
// }

// const BASE = findBase().replace(/\/+$/, '').replace(/\/api$/i, '');

// export type Level24Answer = {
//   success: boolean;
//   correct: boolean;
//   attempts: number;
// };

// const url = (p: string) => `${BASE}/api/braintwist/level24${p}`;

// export async function answerLevel24(
//   playerId: number | string,
//   optionId: string,
//   attempts: number,
// ): Promise<Level24Answer> {
//   if (!BASE) throw new Error('Server address not found in config.ts');
//   let res: Response;
//   try {
//     res = await fetch(url('/answer'), {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ playerId, optionId, attempts }),
//     });
//   } catch {
//     throw new Error('Cannot reach server: ' + BASE);
//   }
//   const text = await res.text();
//   let data: any;
//   try {
//     data = JSON.parse(text);
//   } catch {
//     console.log('[Level24] non-JSON reply from', url('/answer'), text.slice(0, 120));
//     throw new Error('Wrong server address (got a web page)');
//   }
//   if (!res.ok) throw new Error(data?.error || 'Server error ' + res.status);
//   return data;
// }
// Finds the server address from your config.ts automatically,
// whatever the export is called (API_BASE, API_URL, BASE_URL, API.baseUrl ...).
import * as cfg from './config';

function findBase(): string {
  const seen = new Set<any>();
  const walk = (o: any, depth: number): string => {
    if (!o || depth > 2 || seen.has(o)) return '';
    if (typeof o === 'string') return /^https?:\/\//i.test(o) ? o : '';
    if (typeof o !== 'object') return '';
    seen.add(o);
    // prefer keys that look like an address
    const keys = Object.keys(o).sort((a, b) => {
      const w = (k: string) => (/api|base|url|server|host/i.test(k) ? 0 : 1);
      return w(a) - w(b);
    });
    for (const k of keys) {
      const r = walk(o[k], depth + 1);
      if (r) return r;
    }
    return '';
  };
  return walk(cfg, 0);
}

// keep ONLY scheme + host + port (e.g. http://localhost:4000), because config.ts may
// already contain a path like /api/braintwist and we add the full path ourselves
const found = findBase();
const BASE = (found.match(/^https?:\/\/[^/]+/i) || [''])[0];

export type Level24Answer = {
  success: boolean;
  correct: boolean;
  attempts: number;
};

const url = (p: string) => `${BASE}/api/braintwist/level24${p}`;

export async function answerLevel24(
  playerId: number | string,
  optionId: string,
  attempts: number,
): Promise<Level24Answer> {
  if (!BASE) throw new Error('Server address not found in config.ts');
  let res: Response;
  try {
    res = await fetch(url('/answer'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, optionId, attempts }),
    });
  } catch {
    throw new Error('Cannot reach server: ' + BASE);
  }
  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    console.log('[Level24] non-JSON reply from', url('/answer'), text.slice(0, 120));
    throw new Error('Wrong server address (got a web page)');
  }
  if (!res.ok) throw new Error(data?.error || 'Server error ' + res.status);
  return data;
}