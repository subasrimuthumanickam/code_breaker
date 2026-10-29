// // Use the SAME base URL that Btlevel2api.ts uses.
// // Android emulator: http://10.0.2.2:3000 | real phone: http://<your-PC-IP>:3000
// const BASE='http://YOUR_PC_IP:3000/api/braintwist/level21';

// export type Level21View={
//   success:boolean;
//   sessionId:number;
//   puzzleId:number;
//   title:string;
//   hint:string;
//   target:number;
//   numbers:number[];
//   pickCount:number;
// };

// export type Level21Action={
//   success:boolean;
//   correct?:boolean;
//   completed?:boolean;
//   skipped?:boolean;
//   total?:number;
//   message?:string;
//   score?:number;
//   stars?:number;
//   attempts?:number;
//   hints?:number;
// };

// async function post<T>(path:string,body:object):Promise<T>{
//   const res=await fetch(BASE+path,{
//     method:'POST',
//     headers:{'Content-Type':'application/json'},
//     body:JSON.stringify(body),
//   });
//   let data:any=null;
//   try{data=await res.json()}catch(e){}
//   if(!res.ok||(data&&data.success===false)){
//     throw new Error((data&&data.message)||('Request failed ('+res.status+')'));
//   }
//   return data as T;
// }

// export const startLevel21=(playerId:number)=>
//   post<Level21View>('/start',{playerId});

// export const submitPicks=(p:{sessionId:number;playerId:number;picks:number[]})=>
//   post<Level21Action>('/action',p);

// export const requestHint21=(p:{sessionId:number;playerId:number;locked:number[]})=>
//   post<{success:boolean;charged:boolean;indices:number[];hints:number;message:string}>('/hint',p);

// export const skipLevel21=(p:{sessionId:number;playerId:number})=>
//   post<Level21Action>('/skip',p);
// Use the SAME host that Btlevel2api.ts / api.ts uses. Your server runs on port 4000.
// Browser on the same PC: http://localhost:4000
// Android emulator:       http://10.0.2.2:4000
// Real phone:             http://<your-PC-IP>:4000
const HOST='http://localhost:4000';
const BASE=HOST+'/api/braintwist/level21';

export type Level21View={
  success:boolean;
  sessionId:number;
  puzzleId:number;
  title:string;
  hint:string;
  target:number;
  numbers:number[];
  pickCount:number;
};

export type Level21Action={
  success:boolean;
  correct?:boolean;
  completed?:boolean;
  skipped?:boolean;
  total?:number;
  message?:string;
  score?:number;
  stars?:number;
  attempts?:number;
  hints?:number;
};

async function post<T>(path:string,body:object):Promise<T>{
  const res=await fetch(BASE+path,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(body),
  });
  let data:any=null;
  try{data=await res.json()}catch(e){}
  if(!res.ok||(data&&data.success===false)){
    throw new Error((data&&data.message)||('Request failed ('+res.status+')'));
  }
  return data as T;
}

export const startLevel21=(playerId:number)=>
  post<Level21View>('/start',{playerId});

export const submitPicks=(p:{sessionId:number;playerId:number;picks:number[]})=>
  post<Level21Action>('/action',p);

export const requestHint21=(p:{sessionId:number;playerId:number;locked:number[]})=>
  post<{success:boolean;charged:boolean;indices:number[];hints:number;message:string}>('/hint',p);

export const skipLevel21=(p:{sessionId:number;playerId:number})=>
  post<Level21Action>('/skip',p);