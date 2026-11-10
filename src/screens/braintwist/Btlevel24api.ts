
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