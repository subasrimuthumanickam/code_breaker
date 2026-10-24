// // Level 6 (Draw a star) - every call goes to the backend, the backend owns the answers.
// import {BT_API} from './config';

// export type L6Dot={id:number;x:number;y:number};          // x / y = 0..1 of the square board
// export type L6Edge={from:number;to:number};

// export type Level6View={
//   success:boolean;
//   sessionId?:number;
//   level:number;
//   title:string;
//   hint:string;
//   dots:L6Dot[];
//   edges:L6Edge[];
//   totalEdges:number;
//   remaining:number;
// };

// export type Level6Connect=Level6View&{
//   correct:boolean;
//   completed:boolean;
//   duplicate?:boolean;
//   from?:number;
//   to?:number;
//   message:string;
//   wrongAttempts?:number;
//   score?:number;
//   stars?:number;
//   attempts?:number;
//   progressSaved?:boolean;
// };

// async function call(path:string,body?:any){
//   const res=await fetch(`${BT_API}/level6/${path}`,{
//     method:body?'POST':'GET',
//     headers:{'Content-Type':'application/json'},
//     body:body?JSON.stringify(body):undefined,
//   });
//   const data=await res.json().catch(()=>({}));
//   if(!res.ok){
//     const e:any=new Error(data.message||data.error||'Request failed');
//     e.status=res.status;e.code=data.error;
//     throw e;
//   }
//   return data;
// }

// export const startLevel6=(playerId:number):Promise<Level6View>=>call('start',{playerId});
// export const connectDots=(p:{sessionId:number;playerId:number;from:number;to:number}):Promise<Level6Connect>=>call('connect',p);
// export const hintLevel6=(p:{sessionId:number;playerId:number}):Promise<{from:number;to:number;hints:number;cost:number}>=>call('hint',p);
// export const statusLevel6=(playerId:number)=>call(`status/${playerId}`);
// Level 6 (Draw a star) - every call goes to the backend, the backend owns the answers.
import {BT_API} from './config';

export type L6Dot={id:number;x:number;y:number};          // x / y = 0..1 of the square board
export type L6Edge={from:number;to:number};

export type Level6View={
  success:boolean;
  sessionId?:number;
  level:number;
  title:string;
  hint:string;
  dots:L6Dot[];
  edges:L6Edge[];
  totalEdges:number;
  remaining:number;
  clueUsed?:boolean;   // server: the clue was already bought for this session
};

export type Level6Connect=Level6View&{
  correct:boolean;
  completed:boolean;
  duplicate?:boolean;
  from?:number;
  to?:number;
  message:string;
  wrongAttempts?:number;
  score?:number;
  stars?:number;
  attempts?:number;
  progressSaved?:boolean;
};

async function call(path:string,body?:any){
  const res=await fetch(`${BT_API}/level6/${path}`,{
    method:body?'POST':'GET',
    headers:{'Content-Type':'application/json'},
    body:body?JSON.stringify(body):undefined,
  });
  const data=await res.json().catch(()=>({}));
  if(!res.ok){
    const e:any=new Error(data.message||data.error||'Request failed');
    e.status=res.status;e.code=data.error;
    throw e;
  }
  return data;
}

export const startLevel6=(playerId:number):Promise<Level6View>=>call('start',{playerId});
export const connectDots=(p:{sessionId:number;playerId:number;from:number;to:number}):Promise<Level6Connect>=>call('connect',p);
// hints = hints left after paying; alreadyUsed = the clue was bought before (nothing charged)
export const hintLevel6=(p:{sessionId:number;playerId:number}):Promise<{hints:number;cost:number;alreadyUsed?:boolean}>=>call('hint',p);
export const statusLevel6=(playerId:number)=>call(`status/${playerId}`);