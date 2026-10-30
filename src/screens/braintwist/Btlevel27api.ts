// Btlevel27api.ts
// Frontend -> backend requests for Level 27. The backend (Braintwistlevel27routes.js)
// saves everything in SQL and answers with JSON.

// !! Use the SAME base url your other levels use (see Btlevel26api.ts).
const BASE:string=(typeof process!=='undefined'&&(process as any).env&&(process as any).env.EXPO_PUBLIC_API_URL)||'http://localhost:4000';
const URL27=BASE+'/api/braintwist/level27';

export type Level27View={
  level:number;
  sessionId:number;
  title:string;
  grid:(number|null)[][];   // null = the missing number (?)
  hints:number;
};

export type Level27Result={
  correct:boolean;
  message:string;
  stars:number;
  score:number;
  hints:number;
  attempts:number;
  skipped:boolean;
};

export type Level27Hint={hints:number;clue:string;clueNo:number;total:number};

async function post<T>(path:string,body:any):Promise<T>{
  const res=await fetch(URL27+path,{
    method:'POST',
    headers:{'Content-Type':'application/json',Accept:'application/json'},
    body:JSON.stringify(body),
  });
  let data:any=null;
  try{data=await res.json()}catch(e){}
  if(!res.ok){
    const err:any=new Error((data&&(data.message||data.error))||'Request failed ('+res.status+')');
    err.status=res.status;
    throw err;
  }
  return data as T;
}

export const startLevel27=(playerId:number)=>
  post<Level27View>('/start',{playerId});

export const answerLevel27=(p:{sessionId:number;playerId:number;answer:number})=>
  post<Level27Result>('/answer',p);

export const hintLevel27=(p:{sessionId:number;playerId:number})=>
  post<Level27Hint>('/hint',p);

export const skipLevel27=(p:{sessionId:number;playerId:number})=>
  post<Level27Result>('/skip',p);

export const rewardLevel27=(playerId:number)=>
  post<{hints:number;added:number}>('/reward',{playerId});