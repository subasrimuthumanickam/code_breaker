
import {BT_API} from './config';

export type MapLevel={n:number;status:'completed'|'current'|'open'|'soon'|'locked';playable:boolean;stars:number};
export type LevelMap={playerId:number;total:number;currentLevel:number;finished:boolean;levels:MapLevel[]};

async function call(path:string,body?:any){
  const res=await fetch(`${BT_API}/map/${path}`,{
    method:body?'POST':'GET',
    headers:{'Content-Type':'application/json'},
    body:body?JSON.stringify(body):undefined,
  });
  const data=await res.json().catch(()=>({}));
  if(!res.ok){const e:any=new Error(data.message||data.error||'request failed');e.code=data.error;e.map=data.map;throw e;}
  return data;
}

export const getMap=(playerId:number):Promise<LevelMap>=>call(String(playerId));
export const openLevel=(playerId:number,level:number):Promise<{ok:boolean;level:number;map:LevelMap}>=>call(`${playerId}/open`,{level});
export const completeLevel=(playerId:number,level:number,attempts=1):Promise<{ok:boolean;completed:number;nextLevel:number|null;map:LevelMap}>=>call(`${playerId}/complete`,{level,attempts});