
// import React,{useCallback,useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Animated,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// import {F,INK,Coin} from './BTShared';
// import {Icon} from './Art';
// import {BigStar,Duster,ChalkPiece} from './Btlevel7art';
// import {Room,RoomFront,Parrot,Darkness,SCENE_W,SCENE_H} from './Btlevel8art';
// import {startLevel8,lookLevel8,hintLevel8,skipLevel8,rewardLevel8,Level8View,Level8Result} from './Btlevel8api';

// const CHALK='#f6f4ea';

// type Props={
//   playerId:number;
//   hints?:number;
//   setHints?:(n:number)=>void;
//   onExit:()=>void;
//   onComplete?:(result:Level8Result)=>void;
// };

// const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));

// export default function BTLevel8Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
//   const {width}=useWindowDimensions();
//   const RW=Math.min(width-36,340);                 // frame width
//   const IW=RW-6;                                   // room width inside the 3px border
//   const k=IW/SCENE_W;                              // scene units -> pixels
//   const RH=SCENE_H*k+6;

//   const [view,setView]=useState<Level8View|null>(null);
//   const [sessionId,setSessionId]=useState<number|null>(null);
//   const [loadErr,setLoadErr]=useState('');
//   const [msg,setMsg]=useState('');
//   const [done,setDone]=useState(false);
//   const [light,setLight]=useState({x:150,y:200});
//   const [parrot,setParrot]=useState<{x:number;y:number}|null>(null);   // set once found
//   const [seen,setSeen]=useState<{x:number;y:number}|null>(null);       // parrot inside the light: tap it
//   const [result,setResult]=useState<Level8Result|null>(null);
//   const [confirmSkip,setConfirmSkip]=useState(false);

//   const reveal=useRef(new Animated.Value(1)).current;   // 1 = dark, 0 = lights on
//   const flap=useRef(new Animated.Value(1)).current;
//   const pop=useRef(new Animated.Value(0)).current;
//   const sway=useRef(new Animated.Value(0)).current;

//   const lightRef=useRef({x:150,y:200});
//   const dragStart=useRef({x:150,y:200});
//   const lastSent=useRef({x:-999,y:-999,t:0});
//   const pending=useRef<{x:number;y:number}|null>(null);
//   const inflight=useRef(false);
//   const doneRef=useRef(false);
//   const sessionRef=useRef<number|null>(null);
//   const kRef=useRef(k);
//   kRef.current=k;
//   const timers=useRef<any[]>([]);
//   const msgTimer=useRef<any>(null);
//   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

//   const moveLight=(x:number,y:number)=>{
//     lightRef.current={x,y};
//     setLight({x,y});
//   };

//   const flash=(m:string)=>{
//     setMsg(m);clearTimeout(msgTimer.current);
//     msgTimer.current=setTimeout(()=>setMsg(''),2800);
//   };

//   // 1. open the level - the backend makes a NEW game, hides the parrot in a random place
//   const load=useCallback(()=>{
//     setLoadErr('');setView(null);
//     startLevel8(playerId)
//       .then(v=>{
//         setSessionId(v.sessionId);sessionRef.current=v.sessionId;
//         moveLight(v.start.x,v.start.y);
//         dragStart.current={x:v.start.x,y:v.start.y};
//         setSeen(null);
//         setView(v);
//         if(setHints&&typeof v.hints==='number')setHints(v.hints);
//       })
//       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
//   },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(()=>{
//     load();
//     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
//   },[load]);

//   useEffect(()=>{
//     const l=Animated.loop(Animated.sequence([
//       Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
//       Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
//     l.start();
//     return()=>l.stop();
//   },[]);

//   useEffect(()=>{
//     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
//   },[result]);

//   // the server said the parrot was tapped: lights on, parrot jumps
//   const onFound=(r:Level8Result)=>{
//     doneRef.current=true;
//     setDone(true);
//     setSeen(null);
//     if(r.parrot)setParrot({x:r.parrot.x,y:r.parrot.y});
//     if(setHints&&typeof r.hints==='number')setHints(r.hints);
//     Animated.timing(reveal,{toValue:0,duration:700,useNativeDriver:true}).start();
//     Animated.sequence([
//       Animated.timing(flap,{toValue:1.35,duration:180,useNativeDriver:true}),
//       Animated.timing(flap,{toValue:1,duration:180,useNativeDriver:true}),
//       Animated.timing(flap,{toValue:1.25,duration:180,useNativeDriver:true}),
//       Animated.timing(flap,{toValue:1,duration:180,useNativeDriver:true}),
//     ]).start();
//     later(()=>setResult(r),1600);
//   };

//   // 2. send where the spotlight is; the backend says if the parrot is inside it (`seen`).
//   //    Only one request at a time - the newest position waits in `pending`.
//   const pump=async()=>{
//     if(inflight.current||doneRef.current)return;
//     const p=pending.current;
//     const sid=sessionRef.current;
//     if(!p||!sid)return;
//     pending.current=null;
//     inflight.current=true;
//     try{
//       const r=await lookLevel8({sessionId:sid,playerId,x:p.x,y:p.y});
//       if(r.found)onFound(r);else setSeen(r.seen||null);
//     }catch(e:any){
//       flash(e.message||'Network error');
//     }finally{
//       inflight.current=false;
//       if(pending.current&&!doneRef.current)pump();
//     }
//   };
//   const queueLook=(x:number,y:number)=>{
//     pending.current={x:Math.round(x),y:Math.round(y)};
//     pump();
//   };
//   const queueRef=useRef(queueLook);
//   queueRef.current=queueLook;

//   // 3. the player TAPPED the room: found only if the tap is on the parrot
//   const doTap=async(x:number,y:number)=>{
//     const sid=sessionRef.current;
//     if(!sid||doneRef.current)return;
//     try{
//       const r=await lookLevel8({sessionId:sid,playerId,x:Math.round(x),y:Math.round(y),tap:true});
//       if(r.found)onFound(r);
//     }catch(e:any){
//       flash(e.message||'Network error');
//     }
//   };
//   const tapRef=useRef(doTap);
//   tapRef.current=doTap;

//   // drag anywhere on the room: the spotlight moves the same way as the finger
//   const pan=useRef(PanResponder.create({
//     onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
//     onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
//     onPanResponderTerminationRequest:()=>false,
//     onPanResponderGrant:()=>{
//       dragStart.current={...lightRef.current};
//       setConfirmSkip(false);
//     },
//     onPanResponderMove:(_e,g)=>{
//       if(doneRef.current)return;
//       const nx=clamp(dragStart.current.x+g.dx/kRef.current,0,SCENE_W);
//       const ny=clamp(dragStart.current.y+g.dy/kRef.current,0,SCENE_H);
//       moveLight(nx,ny);
//       const now=Date.now();
//       const s=lastSent.current;
//       if(now-s.t>=200&&Math.hypot(nx-s.x,ny-s.y)>=5){
//         lastSent.current={x:nx,y:ny,t:now};
//         queueRef.current(nx,ny);
//       }
//     },
//     onPanResponderRelease:(e,g)=>{
//       if(doneRef.current)return;
//       if(Math.hypot(g.dx,g.dy)<8){                 // a tap, not a drag
//         tapRef.current(e.nativeEvent.locationX/kRef.current,e.nativeEvent.locationY/kRef.current);
//         return;
//       }
//       const p=lightRef.current;
//       lastSent.current={x:p.x,y:p.y,t:Date.now()};
//       queueRef.current(p.x,p.y);
//     },
//     onPanResponderTerminate:()=>{
//       if(doneRef.current)return;
//       const p=lightRef.current;
//       queueRef.current(p.x,p.y);
//     },
//   })).current;

//   // slide the spotlight to a point (used by the hint), then ask the server what is in the light
//   const glideTo=(x:number,y:number)=>{
//     const from={...lightRef.current};
//     const steps=24;
//     let i=0;
//     const id:any=setInterval(()=>{
//       i+=1;
//       const t=i/steps;
//       const e=t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
//       moveLight(from.x+(x-from.x)*e,from.y+(y-from.y)*e);
//       if(i>=steps){clearInterval(id);queueRef.current(x,y)}
//     },20);
//     timers.current.push(id);
//   };

//   // magnifier: the server moves the light close to the parrot (25 hints)
//   const onHint=async()=>{
//     if(done||!sessionId)return;
//     setConfirmSkip(false);
//     try{
//       const r=await hintLevel8({sessionId,playerId});
//       setHints&&setHints(r.hints);
//       glideTo(r.x,r.y);
//     }catch(e:any){
//       flash(e.status===402?'Not enough hints':e.message||'Network error');
//     }
//   };

//   // video reward (+75 hints)
//   const onReward=async()=>{
//     if(done)return;
//     setConfirmSkip(false);
//     try{
//       const r=await rewardLevel8(playerId);
//       setHints&&setHints(r.hints);
//       flash('+'+r.added+' hints');
//     }catch(e:any){
//       flash(e.message||'Network error');
//     }
//   };

//   // skip (50 hints): tap twice
//   const onSkip=async()=>{
//     if(done||!sessionId)return;
//     if(!confirmSkip){
//       setConfirmSkip(true);
//       flash('Skip costs 50 hints. Tap again to skip.');
//       return;
//     }
//     try{
//       const r=await skipLevel8({sessionId,playerId});
//       setHints&&setHints(r.hints||0);
//       doneRef.current=true;
//       onComplete?onComplete(r):onExit();
//     }catch(e:any){
//       setConfirmSkip(false);
//       flash(e.status===402?'Not enough hints':e.message||'Network error');
//     }
//   };

//   /* ---------- loading / error ---------- */

//   if(loadErr||!view){
//     return <View style={bd.wall}><View style={bd.frame}><View style={[bd.board,{justifyContent:'center'}]}>
//       {loadErr?<>
//         <Text style={bd.err}>{loadErr}</Text>
//         <TouchableOpacity style={bd.retry} onPress={load}><Text style={bd.retryT}>Try again</Text></TouchableOpacity>
//         <TouchableOpacity onPress={onExit}><Text style={bd.back}>Back</Text></TouchableOpacity>
//       </>:<>
//         <ActivityIndicator size="large" color={CHALK}/>
//         <Text style={bd.load}>Loading level 8...</Text>
//       </>}
//     </View></View></View>;
//   }

//   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
//   const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'grab'}:{};
//   const pw=24*k;                                    // parrot width in pixels

//   return <View style={bd.wall}>
//     <View style={bd.frame}><View style={bd.board}>
//       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
//       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
//       <View pointerEvents="none" style={bd.sheen}/>

//       {/* top bar */}
//       <View style={bd.top}>
//         <View style={bd.topL}>
//           <TouchableOpacity style={bd.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
//           <View style={bd.round}><Icon n="gear" s={16}/></View>
//         </View>
//         <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
//           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
//           <View style={bd.sign}>
//             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
//             <Text style={bd.signt}>LEVEL 8</Text>
//             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
//           </View>
//         </Animated.View>
//         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
//       </View>

//       <Text style={[bd.q,msg?{color:'#ffb4a8'}:null]}>{msg||(seen?'I can see it! Tap the parrot!':view.title)}</Text>

//       {/* the dark room: drag to move the spotlight, tap the parrot when you see it */}
//       <View style={bd.boardWrap}>
//         <View style={{width:RW,height:RH}}>
//           <View style={bd.panel}>
//             <Room w={IW}/>

//             {/* the parrot while it is inside the light: things in front of it hide part of it */}
//             {!!seen&&!parrot&&<View pointerEvents="none"
//               style={{position:'absolute',left:(seen.x-12)*k,top:(seen.y-17)*k}}>
//               <Parrot w={pw}/>
//             </View>}

//             {/* curtain, sofa, plant, basket, books... drawn over the parrot */}
//             <View pointerEvents="none" style={{position:'absolute',left:0,top:0}}>
//               <RoomFront w={IW}/>
//             </View>

//             {/* once found, the parrot jumps in front of everything */}
//             {!!parrot&&<Animated.View pointerEvents="none"
//               style={{position:'absolute',left:(parrot.x-12)*k,top:(parrot.y-17)*k,transform:[{scale:flap}]}}>
//               <Parrot w={pw}/>
//             </Animated.View>}

//             <Animated.View pointerEvents="none" style={{position:'absolute',left:0,top:0,opacity:reveal}}>
//               <Darkness w={IW} x={light.x} y={light.y} r={view.lightR}/>
//             </Animated.View>

//             <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
//           </View>
//         </View>
//       </View>

//       {/* hint / video / skip */}
//       <View style={bd.actions}>
//         <View style={bd.acol}>
//           <TouchableOpacity style={bd.hintBtn} onPress={onHint}><Icon n="search" s={34}/></TouchableOpacity>
//           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
//         </View>
//         <View style={bd.acol}>
//           <TouchableOpacity style={bd.videoBtn} onPress={onReward}><Icon n="film" s={40}/></TouchableOpacity>
//           <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
//         </View>
//         <View style={bd.acol}>
//           <TouchableOpacity style={bd.skipBtn} onPress={onSkip}><Icon n="play" s={36}/></TouchableOpacity>
//           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
//         </View>
//       </View>

//       {/* chalk tray */}
//       <View style={bd.ledge}>
//         {[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:6+i*6,height:1,backgroundColor:'rgba(90,45,10,0.25)'}}/>)}
//         <View style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>
//         <View style={{position:'absolute',left:'40%',bottom:20}}><ChalkPiece w={78}/></View>
//         <View style={{position:'absolute',left:'64%',bottom:22,transform:[{rotate:'-8deg'}]}}><ChalkPiece w={54}/></View>
//       </View>

//       {/* result card */}
//       {!!result&&<View style={bd.overlay}>
//         <Animated.View style={[bd.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
//           <Text style={bd.cardTitle}>Level complete!</Text>
//           <Text style={bd.cardMsg}>{result.message}</Text>
//           <View style={bd.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
//           <Text style={bd.cardScore}>Score {result.score}</Text>
//           <TouchableOpacity style={bd.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
//             <Text style={bd.nextT}>NEXT</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>}
//     </View></View>
//   </View>;
// }

// /* =========================================================
//    STYLES  (same green chalkboard as level 7)
// ========================================================= */

// const bd=StyleSheet.create({
//   wall:{flex:1,backgroundColor:'#f1dcc0',paddingBottom:18},
//   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:8,backgroundColor:'#1f5b44',overflow:'hidden'},
//   board:{flex:1,alignItems:'center'},
//   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
//   sheen:{position:'absolute',left:0,right:0,top:0,height:120,backgroundColor:'rgba(255,255,255,0.04)'},

//   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
//   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
//   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
//   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   signWrap:{alignItems:'center',paddingTop:14},
//   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
//   sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
//   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
//   dashes:{gap:4,justifyContent:'center'},
//   dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
//   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
//   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},

//   q:{fontFamily:F,fontSize:21,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,paddingHorizontal:12,
//     textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
//   panel:{borderWidth:3,borderColor:'#f6f4ea',borderRadius:10,overflow:'hidden',backgroundColor:'#000'},
//   boardWrap:{flex:1,alignItems:'center',justifyContent:'flex-start',paddingTop:14,paddingBottom:200},

//   actions:{position:'absolute',left:0,right:0,bottom:62,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
//   acol:{alignItems:'center'},
//   lblRow:{flexDirection:'row',alignItems:'center',gap:3,height:20,marginTop:4},
//   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
//   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
//   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
//   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
//   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},

//   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
//   card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
//   cardTitle:{fontFamily:F,fontSize:28,fontWeight:'800',color:'#fff'},
//   cardMsg:{fontFamily:F,fontSize:17,color:'#d8f3e3',textAlign:'center',marginTop:6},
//   stars:{flexDirection:'row',gap:6,marginTop:14},
//   cardScore:{fontFamily:F,fontSize:22,fontWeight:'700',color:'#ffd33d',marginTop:10},
//   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:'#a6e22e',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   nextT:{fontFamily:F,fontSize:26,fontWeight:'900',color:INK},

//   load:{fontFamily:F,fontSize:22,color:CHALK,marginTop:12},
//   err:{fontFamily:F,fontSize:18,color:CHALK,textAlign:'center',paddingHorizontal:24},
//   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
//   retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
//   back:{fontFamily:F,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
// });
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
import {Stage,Coin} from './BTShared';
import {Icon} from './Art';
import {BigStar} from './Btlevel7art';
import {Room,RoomFront,Parrot,Darkness,SCENE_W,SCENE_H} from './Btlevel8art';
import {startLevel8,lookLevel8,skipLevel8,rewardLevel8,Level8View,Level8Result} from './Btlevel8api';
import {RoomBackground,THEME} from './Btlevel4Theme';

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// the clue is FREE: it never depends on hints, coins or videos
// only ONE clue is shown when the magnifier is tapped
const CLUE_1='The parrot is right under your eyes… but you may need to look at things a little differently!';

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level8Result)=>void;
};

const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));

export default function BTLevel8Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width,height}=useWindowDimensions();
  const RW=Math.max(240,Math.min(width-36,340,(height-380)*SCENE_W/SCENE_H));   // frame width
  const IW=RW-6;                                   // room width inside the 3px border
  const k=IW/SCENE_W;                              // scene units -> pixels
  const RH=SCENE_H*k+6;

  const [view,setView]=useState<Level8View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [done,setDone]=useState(false);
  const [light,setLight]=useState({x:150,y:200});
  const [parrot,setParrot]=useState<{x:number;y:number}|null>(null);   // set once found
  const [seen,setSeen]=useState<{x:number;y:number}|null>(null);       // parrot inside the light: tap it
  const [result,setResult]=useState<Level8Result|null>(null);
  const [confirmSkip,setConfirmSkip]=useState(false);
  const [clueOpen,setClueOpen]=useState(false);

  const reveal=useRef(new Animated.Value(1)).current;   // 1 = dark, 0 = lights on
  const flap=useRef(new Animated.Value(1)).current;
  const pop=useRef(new Animated.Value(0)).current;

  const lightRef=useRef({x:150,y:200});
  const dragStart=useRef({x:150,y:200});
  const lastSent=useRef({x:-999,y:-999,t:0});
  const pending=useRef<{x:number;y:number}|null>(null);
  const inflight=useRef(false);
  const doneRef=useRef(false);
  const sessionRef=useRef<number|null>(null);
  const kRef=useRef(k);
  kRef.current=k;
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  const moveLight=(x:number,y:number)=>{
    lightRef.current={x,y};
    setLight({x,y});
  };

  const flash=(m:string)=>{
    setMsg(m);clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2800);
  };

  // 1. open the level - the backend makes a NEW game, hides the parrot in a random place
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel8(playerId)
      .then(v=>{
        setSessionId(v.sessionId);sessionRef.current=v.sessionId;
        moveLight(v.start.x,v.start.y);
        dragStart.current={x:v.start.x,y:v.start.y};
        setSeen(null);
        setView(v);
        if(setHints&&typeof v.hints==='number')setHints(v.hints);
      })
      .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
  },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{
    load();
    return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
  },[load]);

  useEffect(()=>{
    if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
  },[result]);

  // the server said the parrot was tapped: lights on, parrot jumps
  const onFound=(r:Level8Result)=>{
    doneRef.current=true;
    setDone(true);
    setSeen(null);
    setClueOpen(false);
    if(r.parrot)setParrot({x:r.parrot.x,y:r.parrot.y});
    if(setHints&&typeof r.hints==='number')setHints(r.hints);
    Animated.timing(reveal,{toValue:0,duration:700,useNativeDriver:true}).start();
    Animated.sequence([
      Animated.timing(flap,{toValue:1.35,duration:180,useNativeDriver:true}),
      Animated.timing(flap,{toValue:1,duration:180,useNativeDriver:true}),
      Animated.timing(flap,{toValue:1.25,duration:180,useNativeDriver:true}),
      Animated.timing(flap,{toValue:1,duration:180,useNativeDriver:true}),
    ]).start();
    later(()=>setResult(r),1600);
  };

  // 2. send where the spotlight is; the backend says if the parrot is inside it (`seen`).
  //    Only one request at a time - the newest position waits in `pending`.
  const pump=async()=>{
    if(inflight.current||doneRef.current)return;
    const p=pending.current;
    const sid=sessionRef.current;
    if(!p||!sid)return;
    pending.current=null;
    inflight.current=true;
    try{
      const r=await lookLevel8({sessionId:sid,playerId,x:p.x,y:p.y});
      if(r.found)onFound(r);else setSeen(r.seen||null);
    }catch(e:any){
      flash(e.message||'Network error');
    }finally{
      inflight.current=false;
      if(pending.current&&!doneRef.current)pump();
    }
  };
  const queueLook=(x:number,y:number)=>{
    pending.current={x:Math.round(x),y:Math.round(y)};
    pump();
  };
  const queueRef=useRef(queueLook);
  queueRef.current=queueLook;

  // 3. the player TAPPED the room: found only if the tap is on the parrot
  const doTap=async(x:number,y:number)=>{
    const sid=sessionRef.current;
    if(!sid||doneRef.current)return;
    try{
      const r=await lookLevel8({sessionId:sid,playerId,x:Math.round(x),y:Math.round(y),tap:true});
      if(r.found)onFound(r);
    }catch(e:any){
      flash(e.message||'Network error');
    }
  };
  const tapRef=useRef(doTap);
  tapRef.current=doTap;

  // drag anywhere on the room: the spotlight moves the same way as the finger
  const pan=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
    onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
    onPanResponderTerminationRequest:()=>false,
    onPanResponderGrant:()=>{
      dragStart.current={...lightRef.current};
      setConfirmSkip(false);
    },
    onPanResponderMove:(_e,g)=>{
      if(doneRef.current)return;
      const nx=clamp(dragStart.current.x+g.dx/kRef.current,0,SCENE_W);
      const ny=clamp(dragStart.current.y+g.dy/kRef.current,0,SCENE_H);
      moveLight(nx,ny);
      const now=Date.now();
      const s=lastSent.current;
      if(now-s.t>=200&&Math.hypot(nx-s.x,ny-s.y)>=5){
        lastSent.current={x:nx,y:ny,t:now};
        queueRef.current(nx,ny);
      }
    },
    onPanResponderRelease:(e,g)=>{
      if(doneRef.current)return;
      if(Math.hypot(g.dx,g.dy)<8){                 // a tap, not a drag
        tapRef.current(e.nativeEvent.locationX/kRef.current,e.nativeEvent.locationY/kRef.current);
        return;
      }
      const p=lightRef.current;
      lastSent.current={x:p.x,y:p.y,t:Date.now()};
      queueRef.current(p.x,p.y);
    },
    onPanResponderTerminate:()=>{
      if(doneRef.current)return;
      const p=lightRef.current;
      queueRef.current(p.x,p.y);
    },
  })).current;

  // magnifier: show the clue directly (free, no hints / coins / video needed)
  const onHint=()=>{
    if(done)return;
    setConfirmSkip(false);
    setClueOpen(true);
  };

  // video reward (+75 hints) - only adds hints, never opens the clue
  const onReward=async()=>{
    if(done)return;
    setConfirmSkip(false);
    try{
      const r=await rewardLevel8(playerId);
      setHints&&setHints(r.hints);
      flash('+'+r.added+' hints');
    }catch(e:any){
      flash(e.message||'Network error');
    }
  };

  // skip (50 hints): tap twice
  const onSkip=async()=>{
    if(done||!sessionId)return;
    if(!confirmSkip){
      setConfirmSkip(true);
      flash('Skip costs 50 hints. Tap again to skip.');
      return;
    }
    try{
      const r=await skipLevel8({sessionId,playerId});
      setHints&&setHints(r.hints||0);
      doneRef.current=true;
      onComplete?onComplete(r):onExit();
    }catch(e:any){
      setConfirmSkip(false);
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }
  };

  /* ---------- header (home, wooden sign, hints pill) ---------- */

  const header=(
    <View style={st.topBar}>
      <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
        <Icon n="home" s={16}/>
      </TouchableOpacity>

      <View style={st.signWrap}>
        <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
        <View style={st.sign}>
          <Text style={st.signArrow}>{'<'}</Text>
          <Text style={st.signT}>LEVEL 8</Text>
          <Text style={st.signArrow}>{'>'}</Text>
        </View>
        <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
        <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
      </View>

      <View style={st.pill}>
        <Text style={st.pillT}>{hints}</Text>
        <Text style={st.pillIcon}>💡</Text>
      </View>
    </View>
  );

  /* ---------- loading / error ---------- */

  if(loadErr||!view){
    return <Stage bg="#bddaee"><View style={st.root}>
      <RoomBackground/>
      {header}
      <View style={st.centerMsg}>
        {loadErr?<>
          <Text style={st.err}>{loadErr}</Text>
          <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
          <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
        </>:<>
          <ActivityIndicator size="large" color={THEME.orange}/>
          <Text style={st.load}>Loading level 8...</Text>
        </>}
      </View>
    </View></Stage>;
  }

  const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'grab'}:{};
  const pw=24*k;                                    // parrot width in pixels

  return <Stage bg="#bddaee"><View style={st.root}>
    <RoomBackground/>
    {header}

    <View style={st.center}>
      {/* question pill (same as level 1) */}
      <View style={st.qPill}>
        <Text style={st.qArrow}>{'<'}</Text>
        <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||(seen?'I can see it! Tap the parrot!':view.title)}</Text>
        <Text style={st.qArrow}>{'>'}</Text>
      </View>

      {/* the dark room: drag to move the spotlight, tap the parrot when you see it */}
      <View style={{width:RW,height:RH,marginTop:12}}>
        <View style={st.panelFrame}>
          <Room w={IW}/>

          {/* the parrot while it is inside the light: things in front of it hide part of it */}
          {!!seen&&!parrot&&<View pointerEvents="none"
            style={{position:'absolute',left:(seen.x-12)*k,top:(seen.y-17)*k}}>
            <Parrot w={pw}/>
          </View>}

          {/* curtain, sofa, plant, basket, books... drawn over the parrot */}
          <View pointerEvents="none" style={{position:'absolute',left:0,top:0}}>
            <RoomFront w={IW}/>
          </View>

          {/* once found, the parrot jumps in front of everything */}
          {!!parrot&&<Animated.View pointerEvents="none"
            style={{position:'absolute',left:(parrot.x-12)*k,top:(parrot.y-17)*k,transform:[{scale:flap}]}}>
            <Parrot w={pw}/>
          </Animated.View>}

          <Animated.View pointerEvents="none" style={{position:'absolute',left:0,top:0,opacity:reveal}}>
            <Darkness w={IW} x={light.x} y={light.y} r={view.lightR}/>
          </Animated.View>

          <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
        </View>
      </View>
    </View>

    {/* bottom rounded panel (same as level 1) */}
    <View style={st.panel}>
      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
          <View style={st.circleGreen}><Icon n="search" s={32}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onReward}>
          <Icon n="film" s={36}/>
        </TouchableOpacity>
        <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
          <View style={st.circleRed}><Icon n="play" s={30}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
      </View>
    </View>

    {/* CLUES popup (only from the magnifier, ONE clue) */}
    {clueOpen&&<View style={st.overlay}>
      <View style={st.clueCard}>
        <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
          <Text style={st.closeT}>✕</Text>
        </TouchableOpacity>
        <Text style={st.clueTitle}>CLUES</Text>

        <View style={[st.clueRow,st.clueRowOpen]}>
          <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
          <View style={{flex:1}}>
            <Text style={st.clueHead}>Clue 1</Text>
            <Text style={st.clueBody}>{CLUE_1}</Text>
          </View>
        </View>
      </View>
    </View>}

    {/* result card */}
    {!!result&&<View style={st.overlay}>
      <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
        <Text style={st.cardTitle}>Level complete!</Text>
        <Text style={st.cardMsg}>{result.message}</Text>
        <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
        <Text style={st.cardScore}>Score {result.score}</Text>
        <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
          <Text style={st.nextT}>NEXT</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>}
  </View></Stage>;
}

/* =========================================================
   STYLES  (same cozy room theme as Level 1 / 5 / 6 / 7)
========================================================= */

const st=StyleSheet.create({
  root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

  topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
  homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
  signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
  string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
  sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
  signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
  signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
  leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
  pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
  pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
  pillIcon:{fontSize:16},

  center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
  centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
  qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,maxWidth:360},
  qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
  q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

  // wooden frame around the dark room
  panelFrame:{flex:1,borderWidth:3,borderColor:THEME.wood,borderRadius:12,overflow:'hidden',backgroundColor:'#000'},

  panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
    flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
  btnCol:{alignItems:'center'},
  ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
  circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
  ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
  circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
  badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
  badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

  clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
  clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
  closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
  closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
  clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
  clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
  clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
  clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
  clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
  clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},

  overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
  card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
  cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
  cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
  stars:{flexDirection:'row',gap:6,marginTop:14},
  cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
  next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
  nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

  load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
  err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
  retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
  retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
  back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
});
