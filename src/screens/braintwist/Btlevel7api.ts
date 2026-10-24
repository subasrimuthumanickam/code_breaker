
import {BT_API} from './config';

export type L7Scene={mood:'late'|'pack'|'pay'|'happy'};
export type L7Thing={id:string;label:string};

export type Level7View={
  success:boolean;
  sessionId?:number;
  stage:number;
  totalStages:number;
  title:string;
  hint:string;
  mode:'tap'|'drag';
  target:string|null;    // where a dragged thing has to be dropped ('bag' or 'mia')
  objects:L7Thing[];     // things in the room that can be tapped (stage mode = tap)
  tray:L7Thing[];        // things that can be dragged onto the baby (stage mode = drag)
  scene:L7Scene;
};

export type Level7Result={
  success:boolean;
  correct:boolean;
  completed:boolean;
  message:string;
  wrongAttempts?:number;
  scene?:L7Scene;
  score?:number;
  stars?:number;
  attempts?:number;
  progressSaved?:boolean;
};

async function call(path:string,body?:any){
  const res=await fetch(`${BT_API}/level7/${path}`,{
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

export const startLevel7=(playerId:number):Promise<Level7View>=>call('start',{playerId});
export const sendAction=(p:{sessionId:number;playerId:number;kind:'tap'|'drag';item:string;target?:string}):Promise<Level7Result&Partial<Level7View>>=>call('action',p);
export const hintLevel7=(p:{sessionId:number;playerId:number}):Promise<{item:string;hints:number;cost:number}>=>call('hint',p);
export const statusLevel7=(playerId:number)=>call(`status/${playerId}`);