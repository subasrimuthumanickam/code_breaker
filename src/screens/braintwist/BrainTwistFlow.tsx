
import React,{useEffect,useState} from 'react';
import * as api from './api';
import BTSplashScreen from './BTSplashScreen';
import BTHomeScreen from './BTHomeScreen';
import BTGameScreen from './BTGameScreen';
import BTCongratsScreen from './BTCongratsScreen';


const FORCE_LEVEL:number|null=1;

export default function BrainTwistFlow({onExit}:any){
  const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),
    [n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');

  useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(FORCE_LEVEL??Math.min(p.currentLevel,p.total||1))})
    .catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);

  if(scr==='splash')return <BTSplashScreen onDone={()=>setScr('ready')}/>;

  if(scr==='ready')return <BTHomeScreen hints={hints} n={n} err={err} onHome={onExit}
    onGo={()=>{if(player){setWin(null);setScr('level')}}}/>;

  if(win)return <BTCongratsScreen key={'w'+n} n={n} hints={hints} playerId={player?.id} stats={win._stats} hasNext={!!win.next} onHome={onExit}
    onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;

  console.log('[BrainTwistFlow] opening level',n,'player',player?.id);

  return <BTGameScreen key={n} n={n} player={player} hints={hints} setHints={setHints}
    onWin={(r:any,s:any)=>{
      // Level 1 riddle skip (r.direct): go straight to the next level, no "LEVEL COMPLETE" screen
      if(r?.direct||(n===1&&s?.skipped)){
        const nx=Number(r.next)||n+1;   // do not depend on the server total: level 1 -> level 2
        console.log('[BrainTwistFlow] riddle skip -> opening level',nx,'server reply:',r);
        setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,nx)}));
        setN(nx);setWin(null);return}
      setWin({...r,_stats:s})}} onHome={onExit}/>}
