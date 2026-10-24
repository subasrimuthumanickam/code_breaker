import {BT_API} from './config';



export type L13State={
  ok:boolean;sessionId:number;burned:string[];catEscaped:boolean;completed:boolean;
  attempts:number;wrong:number;
  // burn
  item?:string;correct?:boolean;newlyBurned?:string[];allBurned?:boolean;message?:string;
  // hint
  hints?:number|null;text?:string;target?:string;
};

const call=async(path:string,body:any):Promise<L13State>=>{
  const res=await fetch(`${BT_API}/level13${path}`,{
    method:'POST',
    headers:{'Content-Type':'application/json',Accept:'application/json'},
    body:JSON.stringify(body),
  });
  const text=await res.text();
  let data:any;
  try{data=text?JSON.parse(text):{}}catch{throw new Error(`Invalid API response (${res.status})`)}
  if(!res.ok){
    const e:any=new Error(data.message||data.error||`API request failed: ${res.status}`);
    e.status=res.status;
    throw e;
  }
  return data;
};

export const start=(playerId:number)=>call('/start',{playerId});
export const burn=(playerId:number,sessionId:number,item:string)=>call('/burn',{playerId,sessionId,item});
export const hint=(playerId:number,sessionId:number)=>call('/hint',{playerId,sessionId});