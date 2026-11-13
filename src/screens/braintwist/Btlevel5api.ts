
// // // import {BT_API} from './config';

// // // export type L5Kind='cucumber'|'tomato'|'zucchini'|'gourd';
// // // export type L5Item={id:number;kind:L5Kind;hidden:boolean;x:number;y:number;rot:number};

// // // export type Level5View={
// // //   success:boolean;
// // //   sessionId?:number;
// // //   stage:number;
// // //   totalStages:number;
// // //   title:string;
// // //   hint:string;
// // //   remaining:number;
// // //   items:L5Item[];
// // //   clueUsed?:boolean;   // server: the clue was already bought for this session
// // // };

// // // export type Level5Pick=Level5View&{
// // //   correct:boolean;
// // //   completed:boolean;
// // //   stageDone:boolean;
// // //   reshuffled?:boolean;
// // //   itemId:number;
// // //   message:string;
// // //   wrongAttempts?:number;
// // //   score?:number;
// // //   stars?:number;
// // //   attempts?:number;
// // //   progressSaved?:boolean;
// // // };

// // // async function call(path:string,body?:any){
// // //   const res=await fetch(`${BT_API}/level5/${path}`,{
// // //     method:body?'POST':'GET',
// // //     headers:{'Content-Type':'application/json'},
// // //     body:body?JSON.stringify(body):undefined,
// // //   });
// // //   const data=await res.json().catch(()=>({}));
// // //   if(!res.ok){
// // //     const e:any=new Error(data.message||data.error||'Request failed');
// // //     e.status=res.status;e.code=data.error;
// // //     throw e;
// // //   }
// // //   return data;
// // // }

// // // export const startLevel5=(playerId:number):Promise<Level5View>=>call('start',{playerId});
// // // export const pickItem=(p:{sessionId:number;playerId:number;itemId:number}):Promise<Level5Pick>=>call('pick',p);
// // // // hints = hints left after paying; alreadyUsed = clue was bought before (nothing charged)
// // // export const hintLevel5=(p:{sessionId:number;playerId:number}):Promise<{itemId:number;hints:number;cost:number;alreadyUsed?:boolean}>=>call('hint',p);
// // // export const statusLevel5=(playerId:number)=>call(`status/${playerId}`);
// // import {BT_API} from './config';

// // export type L5Kind='apple'|'tomato';
// // export type L5Item={id:number;kind:L5Kind;hidden:boolean;x:number;y:number;rot:number};

// // export type Level5View={
// //   success:boolean;
// //   sessionId?:number;
// //   stage:number;
// //   totalStages:number;
// //   title:string;
// //   hint:string;
// //   remaining:number;
// //   items:L5Item[];
// //   clueUsed?:boolean;   // server: the clue was already bought for this session
// // };

// // export type Level5Pick=Level5View&{
// //   correct:boolean;
// //   completed:boolean;
// //   stageDone:boolean;
// //   reshuffled?:boolean;
// //   itemId:number;
// //   message:string;
// //   wrongAttempts?:number;
// //   score?:number;
// //   stars?:number;
// //   attempts?:number;
// //   progressSaved?:boolean;
// // };

// // async function call(path:string,body?:any){
// //   const res=await fetch(`${BT_API}/level5/${path}`,{
// //     method:body?'POST':'GET',
// //     headers:{'Content-Type':'application/json'},
// //     body:body?JSON.stringify(body):undefined,
// //   });
// //   const data=await res.json().catch(()=>({}));
// //   if(!res.ok){
// //     const e:any=new Error(data.message||data.error||'Request failed');
// //     e.status=res.status;e.code=data.error;
// //     throw e;
// //   }
// //   return data;
// // }

// // export const startLevel5=(playerId:number):Promise<Level5View>=>call('start',{playerId});
// // export const pickItem=(p:{sessionId:number;playerId:number;itemId:number}):Promise<Level5Pick>=>call('pick',p);
// // // hints = hints left after paying; alreadyUsed = clue was bought before (nothing charged)
// // export const hintLevel5=(p:{sessionId:number;playerId:number}):Promise<{itemId:number;hints:number;cost:number;alreadyUsed?:boolean}>=>call('hint',p);
// // export const statusLevel5=(playerId:number)=>call(`status/${playerId}`);
// import {BT_API} from './config';

// export type L5Kind='apple'|'tomato';
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
//   clueUsed?:boolean;   // server: the clue was already bought for this stage
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

// export type Level5Hint={
//   itemId:number;
//   hints:number;          // hints left after paying
//   cost:number;           // 0 when the clue was already bought
//   alreadyUsed?:boolean;
//   clue?:string;          // clue text sent by the backend
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
// export const hintLevel5=(p:{sessionId:number;playerId:number}):Promise<Level5Hint>=>call('hint',p);
// export const statusLevel5=(playerId:number)=>call(`status/${playerId}`);
import {BT_API} from './config';

export type L5Kind='apple'|'tomato';
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
  clueUsed?:boolean;   // server: the clue was already opened for this stage
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

// JSON the backend sends back for POST /level5/hint (the hint is FREE)
export type Level5Hint={
  success:boolean;
  free:boolean;          // always true: the hint costs no hints / coins
  cost:number;           // always 0
  stage:number;
  uses:number;           // how many times the hint was opened on this stage (saved in the database)
  alreadyUsed?:boolean;  // true when it was opened before on this stage
  hints:number;          // the player's hint balance (unchanged)
  clue:string;           // clue text sent by the backend
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
export const hintLevel5=(p:{sessionId:number;playerId:number}):Promise<Level5Hint>=>call('hint',p);
export const statusLevel5=(playerId:number)=>call(`status/${playerId}`);