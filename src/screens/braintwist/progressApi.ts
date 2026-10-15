import * as cfg from './config';

// config.ts la irukkura server URL-a automatic-a edukkum
const C:any=cfg;
const pick=(o:any):string=>o?(typeof o==='string'?o:(o.API_URL||o.BASE_URL||o.API_BASE||o.SERVER_URL||o.baseUrl||'')):'';
const BASE:string=(pick(C)||pick(C.default)).replace(/\/+$/,'');
const PREFIX='/braintwist';   // api.ts la level/answer endpoints epdi irukko adhe prefix (e.g. '/api/braintwist' na inga maathunga)

async function call(path:string,opts?:any){
  const r=await fetch(BASE+PREFIX+path,{headers:{'Content-Type':'application/json'},...opts});
  const j=await r.json().catch(()=>({}));
  if(!r.ok){const e:any=new Error(j.error||'Request failed');e.status=r.status;throw e}
  return j}

// POST: level mudinjadhum anuppum -> backend DB la save panni JSON return pannum
export const complete=(b:{playerId:number;level:number;attempts:number;hintsUsed:number;skipped:boolean})=>
  call('/progress/complete',{method:'POST',body:JSON.stringify(b)});

// GET: player-oda ella level progress
export const getProgress=(playerId:number)=>call('/progress/'+playerId);