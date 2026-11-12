import {Platform} from 'react-native';

// same convention as the other level api files
const LAN_IP='192.168.1.10'; // <-- your PC's LAN IP (used on real phones / iOS)
const HOST=Platform.OS==='web'?'localhost':Platform.OS==='android'?'10.0.2.2':LAN_IP;
export const API_BASE_URL=`http://${HOST}:4000`;

export type ClueResult={success:boolean;clue?:string;clueNo?:number;level?:number;message?:string};

/** POST /api/braintwist/clue  ->  backend saves the view in MySQL and returns the clue as JSON */
export async function fetchClue(playerId:any,level:number):Promise<ClueResult>{
  const ctrl=new AbortController();
  const timer=setTimeout(()=>ctrl.abort(),8000);
  try{
    const res=await fetch(`${API_BASE_URL}/api/braintwist/clue`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({playerId,level,clueNo:1}),
      signal:ctrl.signal});
    const json=await res.json();
    if(!res.ok||!json?.success)return {success:false,message:json?.message||'Could not load clue'};
    return json;
  }catch(e:any){
    return {success:false,message:e?.name==='AbortError'?'Request timed out':'Network error'};
  }finally{clearTimeout(timer)}}