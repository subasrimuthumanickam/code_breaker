// // Level 5 (Cucumber vs Zucchini) - every call goes to the backend, the backend owns the answers.
// import {BT_API} from './config';

// export type L5Kind='cucumber'|'tomato'|'zucchini';
// export type L5Item={id:number;kind:L5Kind;hidden:boolean;x:number;y:number;rot:number};

// export type Level5View={
//   success:boolean;
//   sessionId?:number;
//   stage:number;
//   totalStages:number;
//   title:string;
//   hint:string;
//   remaining:number;
//   items:L5Item[];
// };

// export type Level5Pick=Level5View&{
//   correct:boolean;
//   completed:boolean;
//   stageDone:boolean;
//   reshuffled?:boolean;
//   itemId:number;
//   message:string;
//   wrongAttempts?:number;
//   score?:number;
//   stars?:number;
//   attempts?:number;
//   progressSaved?:boolean;
// };

// async function call(path:string,body?:any){
//   const res=await fetch(`${BT_API}/level5/${path}`,{
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

// export const startLevel5=(playerId:number):Promise<Level5View>=>call('start',{playerId});
// export const pickItem=(p:{sessionId:number;playerId:number;itemId:number}):Promise<Level5Pick>=>call('pick',p);
// export const hintLevel5=(p:{sessionId:number;playerId:number}):Promise<{itemId:number;hints:number;cost:number}>=>call('hint',p);
// export const statusLevel5=(playerId:number)=>call(`status/${playerId}`);
// Level 5 (Cucumber vs Zucchini) - every call goes to the backend, the backend owns the answers.
import {BT_API} from './config';

export type L5Kind='cucumber'|'tomato'|'zucchini'|'gourd';
export type L5Item={id:number;kind:L5Kind;hidden:boolean;x:number;y:number;rot:number};

export type Level5View={
  success:boolean;
  sessionId?:number;
  stage:number;
  totalStages:number;
  title:string;
  hint:string;
  remaining:number;
  items:L5Item[];
};

export type Level5Pick=Level5View&{
  correct:boolean;
  completed:boolean;
  stageDone:boolean;
  reshuffled?:boolean;
  itemId:number;
  message:string;
  wrongAttempts?:number;
  score?:number;
  stars?:number;
  attempts?:number;
  progressSaved?:boolean;
};

async function call(path:string,body?:any){
  const res=await fetch(`${BT_API}/level5/${path}`,{
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

export const startLevel5=(playerId:number):Promise<Level5View>=>call('start',{playerId});
export const pickItem=(p:{sessionId:number;playerId:number;itemId:number}):Promise<Level5Pick>=>call('pick',p);
export const hintLevel5=(p:{sessionId:number;playerId:number}):Promise<{itemId:number;hints:number;cost:number}>=>call('hint',p);
export const statusLevel5=(playerId:number)=>call(`status/${playerId}`);