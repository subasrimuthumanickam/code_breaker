// import React,{useCallback,useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Animated,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// import Svg,{Circle,Ellipse,Path,Line,Rect} from 'react-native-svg';
// import {Stage,Coin} from './BTShared';
// import {Icon} from './Art';
// import {BigStar} from './Btlevel7art';
// import {startLevel26,hintLevel26,finishLevel26,skipLevel26,rewardLevel26,Level26View,Level26Result,Level26Action,Level26Cloud} from './Btlevel26api';
// import {RoomBackground,THEME} from './Btlevel4Theme';

// const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // used when the server does not send a clue text
// const CLUE_FALLBACK='Horns and alarms are not what this sleepy cat needs. What is hiding behind the clouds?';

// type Props={
//   playerId:number;
//   hints?:number;
//   setHints?:(n:number)=>void;
//   onExit:()=>void;
//   onComplete?:(result:Level26Result)=>void;
// };

// type Pt={x:number;y:number};

// const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
// const r4=(v:number)=>Math.round(v*10000)/10000;
// const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'pointer'}:{};

// // true when no cloud hides the sun (same rule as the server)
// const sunIsFree=(clouds:Level26Cloud[],pos:Record<number,Pt>,sun:Level26View['sun'])=>
//   clouds.every(c=>{
//     const p=pos[c.id]||c;
//     return Math.hypot(p.x-sun.x,p.y-sun.y)>=c.r+sun.r+sun.margin;
//   });

// /* =========================================================
//    DRAWINGS (simple svg)
// ========================================================= */

// const PUFFS=[[28,40,18],[50,28,24],[74,38,19],[52,44,18]];

// const CloudArt=({w,tone}:{w:number;tone:'blue'|'gray'})=>{
//   const fill=tone==='gray'?'#d3d8de':'#cdeaf7';
//   const line=tone==='gray'?'#6f7a86':'#2b2f36';
//   return <Svg width={w} height={w*0.64} viewBox="0 0 100 64">
//     {PUFFS.map(([x,y,r],i)=><Circle key={'o'+i} cx={x} cy={y} r={r+1.6} fill={line}/>)}
//     {PUFFS.map(([x,y,r],i)=><Circle key={'f'+i} cx={x} cy={y} r={r} fill={fill}/>)}
//   </Svg>;
// };

// const SunArt=({s}:{s:number})=>(
//   <Svg width={s} height={s} viewBox="0 0 100 100">
//     {Array.from({length:12}).map((_,i)=>{
//       const a=i*Math.PI/6;
//       return <Line key={i} x1={50+Math.cos(a)*36} y1={50+Math.sin(a)*36} x2={50+Math.cos(a)*47} y2={50+Math.sin(a)*47}
//         stroke="#f39a1e" strokeWidth={5} strokeLinecap="round"/>;
//     })}
//     <Circle cx={50} cy={50} r={28} fill="#ffc83d" stroke="#f39a1e" strokeWidth={3}/>
//     <Path d="M40 52 Q50 62 60 52" stroke="#f39a1e" strokeWidth={3} fill="none" strokeLinecap="round"/>
//     <Circle cx={41} cy={44} r={3} fill="#a85b10"/><Circle cx={59} cy={44} r={3} fill="#a85b10"/>
//   </Svg>
// );

// const CatArt=({w,awake}:{w:number;awake:boolean})=>(
//   <Svg width={w} height={w*0.85} viewBox="0 0 120 100">
//     <Path d={awake?'M96 68 Q118 62 110 34':'M96 72 Q114 68 106 54'} stroke="#c9741f" strokeWidth={9} fill="none" strokeLinecap="round"/>
//     <Path d={awake?'M96 68 Q118 62 110 34':'M96 72 Q114 68 106 54'} stroke="#f4a24a" strokeWidth={5} fill="none" strokeLinecap="round"/>
//     <Ellipse cx={60} cy={66} rx={38} ry={26} fill="#f4a24a" stroke="#c9741f" strokeWidth={3}/>
//     <Path d="M40 52 L46 60 M52 48 L56 58 M70 48 L66 58 M82 52 L76 60" stroke="#c9741f" strokeWidth={3} strokeLinecap="round"/>
//     <Path d="M40 32 L44 10 L58 26 Z" fill="#f4a24a" stroke="#c9741f" strokeWidth={3} strokeLinejoin="round"/>
//     <Path d="M80 32 L76 10 L62 26 Z" fill="#f4a24a" stroke="#c9741f" strokeWidth={3} strokeLinejoin="round"/>
//     <Circle cx={60} cy={44} r={23} fill="#f4a24a" stroke="#c9741f" strokeWidth={3}/>
//     {awake?<>
//       <Circle cx={50} cy={42} r={6} fill="#fff" stroke="#c9741f" strokeWidth={1.5}/>
//       <Circle cx={70} cy={42} r={6} fill="#fff" stroke="#c9741f" strokeWidth={1.5}/>
//       <Circle cx={51} cy={43} r={3} fill="#2b2f36"/><Circle cx={71} cy={43} r={3} fill="#2b2f36"/>
//       <Path d="M52 54 Q60 62 68 54" stroke="#7a3d0a" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
//     </>:<>
//       <Path d="M44 44 Q50 50 56 44" stroke="#7a3d0a" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
//       <Path d="M64 44 Q70 50 76 44" stroke="#7a3d0a" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
//       <Path d="M54 54 Q60 58 66 54" stroke="#7a3d0a" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
//     </>}
//     <Circle cx={60} cy={49} r={2.5} fill="#e8788a"/>
//   </Svg>
// );

// const CushionArt=({w}:{w:number})=>(
//   <Svg width={w} height={w*0.4} viewBox="0 0 100 40">
//     <Ellipse cx={50} cy={22} rx={48} ry={16} fill="#a8571f" stroke="#6b3410" strokeWidth={2.5}/>
//     <Ellipse cx={50} cy={18} rx={40} ry={11} fill="#c4742e"/>
//   </Svg>
// );

// const HornArt=({w}:{w:number})=>(
//   <Svg width={w} height={w*0.57} viewBox="0 0 70 40">
//     <Path d="M2 20 L30 8 L30 32 Z" fill="#9aa3ad" stroke="#5c646d" strokeWidth={2} strokeLinejoin="round"/>
//     <Circle cx={46} cy={22} r={11} fill="#e23b3b" stroke="#a52020" strokeWidth={2}/>
//   </Svg>
// );

// const ClockArt=({w}:{w:number})=>(
//   <Svg width={w} height={w} viewBox="0 0 60 60">
//     <Circle cx={16} cy={12} r={7} fill="#b8bec6" stroke="#5c646d" strokeWidth={1.5}/>
//     <Circle cx={44} cy={12} r={7} fill="#b8bec6" stroke="#5c646d" strokeWidth={1.5}/>
//     <Circle cx={30} cy={34} r={21} fill="#fff" stroke="#d22b2b" strokeWidth={5}/>
//     <Line x1={30} y1={34} x2={30} y2={22} stroke="#2b2f36" strokeWidth={2.5} strokeLinecap="round"/>
//     <Line x1={30} y1={34} x2={39} y2={38} stroke="#2b2f36" strokeWidth={2.5} strokeLinecap="round"/>
//     <Rect x={20} y={54} width={5} height={5} fill="#5c646d"/><Rect x={35} y={54} width={5} height={5} fill="#5c646d"/>
//   </Svg>
// );

// /* =========================================================
//    ONE CLOUD THE PLAYER CAN DRAG
// ========================================================= */

// type CloudProps={
//   c:Level26Cloud;
//   W:number;
//   b:Level26View['bounds'];
//   locked:boolean;
//   onGrab:()=>void;
//   onRelease:(id:number,x:number,y:number)=>void;
// };

// const DragCloud=({c,W,b,locked,onGrab,onRelease}:CloudProps)=>{
//   const cw=c.w*W,ch=cw*0.64;
//   const cur=useRef<Pt>({x:c.x,y:c.y});      // centre now
//   const start=useRef<Pt>({x:c.x,y:c.y});    // centre when the finger touched it
//   const pos=useRef(new Animated.ValueXY({x:c.x*W-cw/2,y:c.y*W-ch/2})).current;
//   const lockedRef=useRef(locked);lockedRef.current=locked;
//   const geo=useRef({W,cw,ch,b});geo.current={W,cw,ch,b};
//   const cbs=useRef({onGrab,onRelease});cbs.current={onGrab,onRelease};

//   // the screen size changed: put the cloud on its place again
//   useEffect(()=>{
//     pos.setValue({x:cur.current.x*W-cw/2,y:cur.current.y*W-ch/2});
//   },[W]);                                          // eslint-disable-line react-hooks/exhaustive-deps

//   const finishDrag=()=>{
//     const moved=Math.hypot(cur.current.x-start.current.x,cur.current.y-start.current.y)>0.004;
//     if(moved)cbs.current.onRelease(c.id,cur.current.x,cur.current.y);
//   };

//   const pan=useRef(PanResponder.create({
//     onStartShouldSetPanResponder:()=>!lockedRef.current,
//     onMoveShouldSetPanResponder:()=>!lockedRef.current,
//     onPanResponderTerminationRequest:()=>false,
//     onPanResponderGrant:()=>{
//       start.current={...cur.current};
//       cbs.current.onGrab();
//     },
//     onPanResponderMove:(_e,g)=>{
//       const q=geo.current;
//       const x=clamp(start.current.x+g.dx/q.W,q.b.minX,q.b.maxX);
//       const y=clamp(start.current.y+g.dy/q.W,q.b.minY,q.b.maxY);
//       cur.current={x,y};
//       pos.setValue({x:x*q.W-q.cw/2,y:y*q.W-q.ch/2});
//     },
//     onPanResponderRelease:finishDrag,
//     onPanResponderTerminate:finishDrag,
//   })).current;

//   return <Animated.View {...pan.panHandlers}
//     style={[{position:'absolute',left:0,top:0,width:cw,height:ch,transform:pos.getTranslateTransform()},webTouch]}>
//     <CloudArt w={cw} tone={c.tone}/>
//   </Animated.View>;
// };

// /* =========================================================
//    SCREEN
// ========================================================= */

// export default function BTLevel26Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
//   const {width,height}=useWindowDimensions();
//   const W=Math.floor(clamp(Math.min(width-60,(height-330)/1.05,340),220,340));   // scene width in pixels
//   const H=Math.round(W*1.05);                                                   // scene height

//   const [view,setView]=useState<Level26View|null>(null);
//   const [sessionId,setSessionId]=useState<number|null>(null);
//   const [loadErr,setLoadErr]=useState('');
//   const [msg,setMsg]=useState('');
//   const [done,setDone]=useState(false);
//   const [sunUp,setSunUp]=useState(false);
//   const [awake,setAwake]=useState(false);
//   const [result,setResult]=useState<Level26Result|null>(null);
//   const [confirmSkip,setConfirmSkip]=useState(false);
//   const [clueOpen,setClueOpen]=useState(false);
//   const [clueText,setClueText]=useState(CLUE_FALLBACK);
//   const [hintCloud,setHintCloud]=useState<{id:number;dir:'L'|'R'}|null>(null);
//   const [resetKey,setResetKey]=useState(0);

//   const pop=useRef(new Animated.Value(0)).current;
//   const bob=useRef(new Animated.Value(0)).current;
//   const sunPop=useRef(new Animated.Value(0)).current;
//   const jump=useRef(new Animated.Value(0)).current;

//   const viewRef=useRef<Level26View|null>(null);
//   const posRef=useRef<Record<number,Pt>>({});             // where every cloud is now
//   const actionsRef=useRef<Level26Action[]>([]);           // every drag since the start
//   const doneRef=useRef(false);
//   const sessionRef=useRef<number|null>(null);
//   const timers=useRef<any[]>([]);
//   const msgTimer=useRef<any>(null);
//   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

//   const flash=(m:string)=>{
//     setMsg(m);clearTimeout(msgTimer.current);
//     msgTimer.current=setTimeout(()=>setMsg(''),2800);
//   };

//   const startPositions=(v:Level26View)=>{
//     const o:Record<number,Pt>={};
//     v.clouds.forEach(c=>{o[c.id]={x:c.x,y:c.y}});
//     return o;
//   };

//   // 1. open the level - the backend sends the sun, the clouds and a new session
//   const load=useCallback(()=>{
//     setLoadErr('');setView(null);
//     startLevel26(playerId)
//       .then(v=>{
//         viewRef.current=v;
//         posRef.current=startPositions(v);
//         actionsRef.current=[];
//         doneRef.current=false;
//         setDone(false);setResult(null);setSunUp(false);setAwake(false);setHintCloud(null);
//         setResetKey(k=>k+1);
//         setSessionId(v.sessionId);sessionRef.current=v.sessionId;
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
//     const b=Animated.loop(Animated.sequence([
//       Animated.timing(bob,{toValue:1,duration:450,useNativeDriver:true}),
//       Animated.timing(bob,{toValue:0,duration:450,useNativeDriver:true})]));
//     b.start();
//     return()=>{b.stop()};
//   },[]);

//   useEffect(()=>{
//     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
//   },[result]);

//   // the sun shows
//   useEffect(()=>{
//     if(sunUp)Animated.spring(sunPop,{toValue:1,friction:4,tension:80,useNativeDriver:true}).start();
//     else sunPop.setValue(0);
//   },[sunUp]);

//   // the cat wakes up and jumps
//   useEffect(()=>{
//     if(awake){
//       Animated.loop(Animated.sequence([
//         Animated.timing(jump,{toValue:1,duration:200,useNativeDriver:true}),
//         Animated.timing(jump,{toValue:0,duration:200,useNativeDriver:true})]),{iterations:3}).start();
//     }else jump.setValue(0);
//   },[awake]);

//   // 2. the sun is free: send every drag, the backend plays them again and saves the win
//   const finish=async(attempt:number)=>{
//     const sid=sessionRef.current;
//     if(!sid)return;
//     try{
//       const r=await finishLevel26({sessionId:sid,playerId,actions:actionsRef.current.slice()});
//       if(setHints&&typeof r.hints==='number')setHints(r.hints);
//       setDone(true);
//       later(()=>setResult(r),1500);
//     }catch(e:any){
//       if(attempt<2){later(()=>finishRef.current(attempt+1),1200);return}
//       flash(e.message||'Network error. Try again.');
//       later(restart,1600);
//     }
//   };
//   const finishRef=useRef(finish);
//   finishRef.current=finish;

//   // put all clouds back on the sun
//   const restart=()=>{
//     const v=viewRef.current;
//     if(!v)return;
//     posRef.current=startPositions(v);
//     actionsRef.current=[];
//     doneRef.current=false;
//     setSunUp(false);setAwake(false);setHintCloud(null);
//     setResetKey(k=>k+1);
//   };

//   // a cloud was dropped
//   const onRelease=(id:number,x:number,y:number)=>{
//     const v=viewRef.current;
//     if(!v||doneRef.current)return;
//     posRef.current[id]={x,y};
//     actionsRef.current.push({t:'drag',id,x:r4(x),y:r4(y)});
//     setHintCloud(null);
//     if(sunIsFree(v.clouds,posRef.current,v.sun)){
//       doneRef.current=true;
//       setConfirmSkip(false);
//       setSunUp(true);
//       later(()=>setAwake(true),700);
//       finishRef.current(0);
//     }
//   };

//   const onGrab=()=>{setConfirmSkip(false)};

//   const onNoise=(what:string)=>{
//     if(doneRef.current)return;
//     flash(what);
//   };

//   // magnifier (search icon): frontend -> POST /hint -> backend saves it in the database -> JSON back -> popup opens
//   const onHint=async()=>{
//     if(done||!sessionId||!view)return;
//     setConfirmSkip(false);
//     try{
//       const clouds=view.clouds.map(c=>({id:c.id,x:(posRef.current[c.id]||c).x,y:(posRef.current[c.id]||c).y}));
//       const r=await hintLevel26({sessionId,playerId,clouds});
//       if(typeof r.hints==='number'&&setHints)setHints(r.hints);
//       setClueText(r.clue||CLUE_FALLBACK);
//       if(r.target&&r.dir){
//         setHintCloud({id:r.target,dir:r.dir});
//         later(()=>setHintCloud(null),6000);
//       }
//       setClueOpen(true);
//     }catch(e:any){
//       flash(e.status===402?'Not enough hints':e.message||'Network error');
//     }
//   };

//   // video reward (+25 hints) - only adds hints, never opens the clue popup
//   const onReward=async()=>{
//     if(done)return;
//     setConfirmSkip(false);
//     try{
//       const r=await rewardLevel26(playerId);
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
//       const r=await skipLevel26({sessionId,playerId});
//       setHints&&setHints(r.hints||0);
//       doneRef.current=true;
//       onComplete?onComplete(r):onExit();
//     }catch(e:any){
//       setConfirmSkip(false);
//       flash(e.status===402?'Not enough hints':e.message||'Network error');
//     }
//   };

//   /* ---------- header (home, wooden sign, hints pill) ---------- */

//   const header=(
//     <View style={st.topBar}>
//       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
//         <Icon n="home" s={16}/>
//       </TouchableOpacity>

//       <View style={st.signWrap}>
//         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
//         <View style={st.sign}>
//           <Text style={st.signArrow}>{'<'}</Text>
//           <Text style={st.signT}>LEVEL 26</Text>
//           <Text style={st.signArrow}>{'>'}</Text>
//         </View>
//         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
//         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
//       </View>

//       <View style={st.pill}>
//         <Text style={st.pillT}>{hints}</Text>
//         <Text style={st.pillIcon}>💡</Text>
//       </View>
//     </View>
//   );

//   /* ---------- loading / error ---------- */

//   if(loadErr||!view){
//     return <Stage bg="#bddaee"><View style={st.root}>
//       <RoomBackground/>
//       {header}
//       <View style={st.centerMsg}>
//         {loadErr?<>
//           <Text style={st.err}>{loadErr}</Text>
//           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
//           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
//         </>:<>
//           <ActivityIndicator size="large" color={THEME.orange}/>
//           <Text style={st.load}>Loading level 26...</Text>
//         </>}
//       </View>
//     </View></Stage>;
//   }

//   const bobX=bob.interpolate({inputRange:[0,1],outputRange:[-6,6]});
//   const bobY=bob.interpolate({inputRange:[0,1],outputRange:[0,-6]});
//   const sunS=view.sun.r*2*W/0.56;                    // sun drawing size (rays included)
//   const catW=W*0.46;
//   const hintPos=hintCloud?(posRef.current[hintCloud.id]||null):null;

//   return <Stage bg="#bddaee"><View style={st.root}>
//     <RoomBackground/>
//     {header}

//     <View style={st.center}>
//       {/* question pill */}
//       <View style={st.qPill}>
//         <Text style={st.qArrow}>{'<'}</Text>
//         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
//         <Text style={st.qArrow}>{'>'}</Text>
//       </View>

//       {/* notebook page with the scene */}
//       <View style={[st.paper,{width:W+28}]}>
//         <View style={st.holes}>
//           {Array.from({length:10}).map((_,i)=><View key={i} style={st.hole}/>)}
//         </View>

//         <View style={{width:W,height:H}}>
//           {[0.18,0.34,0.5,0.66,0.82,0.98].map(k=><View key={k} style={[st.ruled,{top:k*H}]}/>)}

//           {/* the line the horn and the clock sit on */}
//           <View style={{position:'absolute',left:0.06*W,width:0.88*W,top:0.55*W,height:2,backgroundColor:'#555'}}/>

//           {/* sun (behind the clouds) */}
//           <Animated.View pointerEvents="none"
//             style={{position:'absolute',left:view.sun.x*W-sunS/2,top:view.sun.y*W-sunS/2,width:sunS,height:sunS,
//               transform:[{scale:sunPop.interpolate({inputRange:[0,1],outputRange:[1,1.25]})}]}}>
//             <SunArt s={sunS}/>
//           </Animated.View>

//           {/* things that do NOT wake the cat */}
//           <TouchableOpacity activeOpacity={0.8} onPress={()=>onNoise('Honk! The cat does not care...')}
//             style={{position:'absolute',left:0.1*W,top:0.57*W}}>
//             <HornArt w={0.16*W}/>
//           </TouchableOpacity>
//           <TouchableOpacity activeOpacity={0.8} onPress={()=>onNoise('Ring! The cat sleeps on...')}
//             style={{position:'absolute',left:0.8*W,top:0.5*W}}>
//             <ClockArt w={0.14*W}/>
//           </TouchableOpacity>

//           {/* cushion and cat */}
//           <View pointerEvents="none" style={{position:'absolute',left:0.5*W-0.31*W,top:0.8*W}}>
//             <CushionArt w={0.62*W}/>
//           </View>
//           <Animated.View pointerEvents="none"
//             style={{position:'absolute',left:0.5*W-catW/2,top:0.62*W,
//               transform:[{translateY:jump.interpolate({inputRange:[0,1],outputRange:[0,-14]})}]}}>
//             <CatArt w={catW} awake={awake}/>
//           </Animated.View>
//           {!awake&&<Animated.Text pointerEvents="none"
//             style={{position:'absolute',left:0.5*W+catW*0.3,top:0.55*W,fontSize:22,transform:[{translateY:bobY}]}}>💤</Animated.Text>}

//           {/* the clouds the player drags away */}
//           {view.clouds.map(c=>
//             <DragCloud key={c.id+'-'+resetKey} c={c} W={W} b={view.bounds} locked={done||sunUp}
//               onGrab={onGrab} onRelease={onRelease}/>)}

//           {/* magnifier: which cloud to move and to which side */}
//           {!!hintCloud&&!!hintPos&&<Animated.Text pointerEvents="none"
//             style={{position:'absolute',left:hintPos.x*W-22,top:hintPos.y*W-28,fontSize:46,color:'#ff9f1c',fontWeight:'bold',
//               textShadowColor:'#fff',textShadowRadius:4,zIndex:20,
//               transform:[{rotate:hintCloud.dir==='L'?'180deg':'0deg'},{translateX:bobX}]}}>{'\u279C'}</Animated.Text>}
//         </View>
//       </View>
//     </View>

//     {/* bottom rounded panel */}
//     <View style={st.panel}>
//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
//           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
//         </TouchableOpacity>
//         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
//       </View>

//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onReward}>
//           <Icon n="film" s={36}/>
//         </TouchableOpacity>
//         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+25</Text></View>
//       </View>

//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
//           <View style={st.circleRed}><Icon n="play" s={30}/></View>
//         </TouchableOpacity>
//         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
//       </View>
//     </View>

//     {/* CLUES popup (only from the magnifier / search icon) */}
//     {clueOpen&&<View style={st.overlay}>
//       <View style={st.clueCard}>
//         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
//           <Text style={st.closeT}>✕</Text>
//         </TouchableOpacity>
//         <Text style={st.clueTitle}>CLUES</Text>

//         <View style={[st.clueRow,st.clueRowOpen]}>
//           <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
//           <View style={{flex:1}}>
//             <Text style={st.clueHead}>Clue 1</Text>
//             <Text style={st.clueBody}>{clueText}</Text>
//           </View>
//         </View>
//       </View>
//     </View>}

//     {/* result card */}
//     {!!result&&<View style={st.overlay}>
//       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
//         <Text style={st.cardTitle}>Level complete!</Text>
//         <Text style={st.cardMsg}>{result.message}</Text>
//         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
//         <Text style={st.cardScore}>Score {result.score}</Text>
//         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
//           <Text style={st.nextT}>NEXT</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </View>}
//   </View></Stage>;
// }

// /* =========================================================
//    STYLES
// ========================================================= */

// const st=StyleSheet.create({
//   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

//   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
//   homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
//   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
//   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
//   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
//   signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
//   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
//   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
//   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
//   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
//   pillIcon:{fontSize:16},

//   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
//   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
//   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,marginBottom:10,maxWidth:360},
//   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
//   q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

//   paper:{backgroundColor:'#fbf6e9',borderWidth:3,borderColor:'#e6d3a8',borderRadius:10,paddingHorizontal:14,paddingBottom:14,alignItems:'center'},
//   holes:{flexDirection:'row',justifyContent:'space-between',alignSelf:'stretch',paddingVertical:8},
//   hole:{width:11,height:11,borderRadius:6,backgroundColor:'#e8a860'},
//   ruled:{position:'absolute',left:0,right:0,height:1,backgroundColor:'#e5dcc6'},

//   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
//     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
//   btnCol:{alignItems:'center'},
//   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
//   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
//   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
//   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
//   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
//   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

//   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
//   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
//   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
//   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
//   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
//   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
//   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
//   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
//   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
//   clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},

//   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
//   card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
//   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
//   cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
//   stars:{flexDirection:'row',gap:6,marginTop:14},
//   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
//   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
//   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

//   load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
//   err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
//   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
//   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
//   back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
// });
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
import Svg,{Circle,Ellipse,Path,Line,Rect,G} from 'react-native-svg';
import {Stage,Coin} from './BTShared';
import {Icon} from './Art';
import {BigStar} from './Btlevel7art';
import {startLevel26,hintLevel26,finishLevel26,skipLevel26,rewardLevel26,Level26View,Level26Result,Level26Action,Level26Cloud} from './Btlevel26api';
import {RoomBackground,THEME} from './Btlevel4Theme';

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// used when the server does not send a clue text
const CLUE_FALLBACK='Horns and alarms are not what this sleepy cat needs. What is hiding behind the clouds?';

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level26Result)=>void;
};

type Pt={x:number;y:number};

const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
const r4=(v:number)=>Math.round(v*10000)/10000;
const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'pointer'}:{};

// true when no cloud hides the sun (same rule as the server)
const sunIsFree=(clouds:Level26Cloud[],pos:Record<number,Pt>,sun:Level26View['sun'])=>
  clouds.every(c=>{
    const p=pos[c.id]||c;
    return Math.hypot(p.x-sun.x,p.y-sun.y)>=c.r+sun.r+sun.margin;
  });

/* =========================================================
   DRAWINGS (simple svg)
========================================================= */

const PUFFS=[[28,40,18],[50,28,24],[74,38,19],[52,44,18]];

const CloudArt=({w,tone}:{w:number;tone:'blue'|'gray'})=>{
  const fill=tone==='gray'?'#d3d8de':'#cdeaf7';
  const line=tone==='gray'?'#6f7a86':'#2b2f36';
  return <Svg width={w} height={w*0.64} viewBox="0 0 100 64">
    {PUFFS.map(([x,y,r],i)=><Circle key={'o'+i} cx={x} cy={y} r={r+1.6} fill={line}/>)}
    {PUFFS.map(([x,y,r],i)=><Circle key={'f'+i} cx={x} cy={y} r={r} fill={fill}/>)}
  </Svg>;
};

const SunArt=({s}:{s:number})=>(
  <Svg width={s} height={s} viewBox="0 0 100 100">
    {Array.from({length:12}).map((_,i)=>{
      const a=i*Math.PI/6;
      return <Line key={i} x1={50+Math.cos(a)*36} y1={50+Math.sin(a)*36} x2={50+Math.cos(a)*47} y2={50+Math.sin(a)*47}
        stroke="#f39a1e" strokeWidth={5} strokeLinecap="round"/>;
    })}
    <Circle cx={50} cy={50} r={28} fill="#ffc83d" stroke="#f39a1e" strokeWidth={3}/>
    <Path d="M40 52 Q50 62 60 52" stroke="#f39a1e" strokeWidth={3} fill="none" strokeLinecap="round"/>
    <Circle cx={41} cy={44} r={3} fill="#a85b10"/><Circle cx={59} cy={44} r={3} fill="#a85b10"/>
  </Svg>
);

// sleeping cat = curled up on the cushion (like the reference). awake = sitting up.
const CatArt=({w,awake}:{w:number;awake:boolean})=>(
  <Svg width={w} height={w*0.667} viewBox="0 0 150 100">
    {awake?<G transform="translate(15 0)">
      <Path d="M96 68 Q118 62 110 34" stroke="#c9741f" strokeWidth={9} fill="none" strokeLinecap="round"/>
      <Path d="M96 68 Q118 62 110 34" stroke="#f4a24a" strokeWidth={5} fill="none" strokeLinecap="round"/>
      <Ellipse cx={60} cy={66} rx={38} ry={26} fill="#f4a24a" stroke="#c9741f" strokeWidth={3}/>
      <Path d="M40 52 L46 60 M52 48 L56 58 M70 48 L66 58 M82 52 L76 60" stroke="#c9741f" strokeWidth={3} strokeLinecap="round"/>
      <Path d="M40 32 L44 10 L58 26 Z" fill="#f4a24a" stroke="#c9741f" strokeWidth={3} strokeLinejoin="round"/>
      <Path d="M80 32 L76 10 L62 26 Z" fill="#f4a24a" stroke="#c9741f" strokeWidth={3} strokeLinejoin="round"/>
      <Circle cx={60} cy={44} r={23} fill="#f4a24a" stroke="#c9741f" strokeWidth={3}/>
      <Circle cx={50} cy={42} r={6} fill="#fff" stroke="#c9741f" strokeWidth={1.5}/>
      <Circle cx={70} cy={42} r={6} fill="#fff" stroke="#c9741f" strokeWidth={1.5}/>
      <Circle cx={51} cy={43} r={3} fill="#2b2f36"/><Circle cx={71} cy={43} r={3} fill="#2b2f36"/>
      <Path d="M52 54 Q60 62 68 54" stroke="#7a3d0a" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
      <Circle cx={60} cy={49} r={2.5} fill="#e8788a"/>
    </G>:<>
      {/* tail curling round the front */}
      <Path d="M118 80 Q146 74 136 50" stroke="#c9741f" strokeWidth={10} fill="none" strokeLinecap="round"/>
      <Path d="M118 80 Q146 74 136 50" stroke="#f4a24a" strokeWidth={5.5} fill="none" strokeLinecap="round"/>
      {/* round body */}
      <Ellipse cx={76} cy={68} rx={58} ry={30} fill="#f4a24a" stroke="#c9741f" strokeWidth={3}/>
      <Path d="M90 42 L93 52 M104 46 L106 56 M116 54 L116 63" stroke="#c9741f" strokeWidth={3} strokeLinecap="round"/>
      {/* ears */}
      <Path d="M34 48 L36 27 L51 39 Z" fill="#f4a24a" stroke="#c9741f" strokeWidth={3} strokeLinejoin="round"/>
      <Path d="M76 48 L74 27 L59 39 Z" fill="#f4a24a" stroke="#c9741f" strokeWidth={3} strokeLinejoin="round"/>
      {/* head */}
      <Circle cx={55} cy={60} r={24} fill="#f4a24a" stroke="#c9741f" strokeWidth={3}/>
      <Path d="M50 41 L50 47 M55 39 L55 46 M60 41 L60 47" stroke="#c9741f" strokeWidth={2.5} strokeLinecap="round"/>
      <Path d="M43 58 Q48 63 53 58" stroke="#7a3d0a" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
      <Path d="M58 58 Q63 63 68 58" stroke="#7a3d0a" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
      <Circle cx={55} cy={65} r={2.3} fill="#e8788a"/>
      <Path d="M49 69 Q52 73 55 68 Q58 73 61 69" stroke="#7a3d0a" strokeWidth={2} fill="none" strokeLinecap="round"/>
      {/* paws */}
      <Ellipse cx={40} cy={88} rx={10} ry={6} fill="#f4a24a" stroke="#c9741f" strokeWidth={2.5}/>
      <Ellipse cx={70} cy={90} rx={10} ry={6} fill="#f4a24a" stroke="#c9741f" strokeWidth={2.5}/>
    </>}
  </Svg>
);

const CushionArt=({w}:{w:number})=>(
  <Svg width={w} height={w*0.4} viewBox="0 0 100 40">
    <Path d="M6 16 Q50 -2 94 12 Q101 22 92 29 Q50 42 9 31 Q-1 24 6 16 Z" fill="#a8571f" stroke="#6b3410" strokeWidth={2}/>
    <Path d="M13 17 Q50 4 88 14 Q92 21 86 25 Q50 35 14 27 Q8 22 13 17 Z" fill="#c4742e"/>
  </Svg>
);

const GrassArt=({w}:{w:number})=>(
  <Svg width={w} height={w*0.4} viewBox="0 0 30 12">
    <Path d="M2 11 L5 2 L8 10 L12 0 L15 10 L20 3 L22 10 L27 5 L28 11" stroke="#4a4a4a" strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// bell opens to the left, red rubber bulb on the right
const HornArt=({w}:{w:number})=>(
  <Svg width={w} height={w*0.57} viewBox="0 0 70 40">
    <Path d="M2 6 L30 15 L30 25 L2 34 Z" fill="#aeb6bf" stroke="#5c646d" strokeWidth={2} strokeLinejoin="round"/>
    <Rect x={30} y={16} width={8} height={8} fill="#8b949e" stroke="#5c646d" strokeWidth={1.5}/>
    <Circle cx={50} cy={20} r={11} fill="#e23b3b" stroke="#a52020" strokeWidth={2}/>
    <Circle cx={46} cy={16} r={3} fill="#f27b7b"/>
  </Svg>
);

const ClockArt=({w}:{w:number})=>(
  <Svg width={w} height={w} viewBox="0 0 60 60">
    <Circle cx={16} cy={12} r={7} fill="#b8bec6" stroke="#5c646d" strokeWidth={1.5}/>
    <Circle cx={44} cy={12} r={7} fill="#b8bec6" stroke="#5c646d" strokeWidth={1.5}/>
    <Circle cx={30} cy={34} r={21} fill="#fff" stroke="#d22b2b" strokeWidth={5}/>
    <Line x1={30} y1={34} x2={30} y2={22} stroke="#2b2f36" strokeWidth={2.5} strokeLinecap="round"/>
    <Line x1={30} y1={34} x2={39} y2={38} stroke="#2b2f36" strokeWidth={2.5} strokeLinecap="round"/>
    <Rect x={20} y={54} width={5} height={5} fill="#5c646d"/><Rect x={35} y={54} width={5} height={5} fill="#5c646d"/>
  </Svg>
);

/* =========================================================
   ONE CLOUD THE PLAYER CAN DRAG
========================================================= */

type CloudProps={
  c:Level26Cloud;
  W:number;
  b:Level26View['bounds'];
  locked:boolean;
  onGrab:()=>void;
  onRelease:(id:number,x:number,y:number)=>void;
};

const DragCloud=({c,W,b,locked,onGrab,onRelease}:CloudProps)=>{
  const cw=c.w*W,ch=cw*0.64;
  const cur=useRef<Pt>({x:c.x,y:c.y});      // centre now
  const start=useRef<Pt>({x:c.x,y:c.y});    // centre when the finger touched it
  const pos=useRef(new Animated.ValueXY({x:c.x*W-cw/2,y:c.y*W-ch/2})).current;
  const lockedRef=useRef(locked);lockedRef.current=locked;
  const geo=useRef({W,cw,ch,b});geo.current={W,cw,ch,b};
  const cbs=useRef({onGrab,onRelease});cbs.current={onGrab,onRelease};

  // the screen size changed: put the cloud on its place again
  useEffect(()=>{
    pos.setValue({x:cur.current.x*W-cw/2,y:cur.current.y*W-ch/2});
  },[W]);                                          // eslint-disable-line react-hooks/exhaustive-deps

  const finishDrag=()=>{
    const moved=Math.hypot(cur.current.x-start.current.x,cur.current.y-start.current.y)>0.004;
    if(moved)cbs.current.onRelease(c.id,cur.current.x,cur.current.y);
  };

  const pan=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>!lockedRef.current,
    onMoveShouldSetPanResponder:()=>!lockedRef.current,
    onPanResponderTerminationRequest:()=>false,
    onPanResponderGrant:()=>{
      start.current={...cur.current};
      cbs.current.onGrab();
    },
    onPanResponderMove:(_e,g)=>{
      const q=geo.current;
      const x=clamp(start.current.x+g.dx/q.W,q.b.minX,q.b.maxX);
      const y=clamp(start.current.y+g.dy/q.W,q.b.minY,q.b.maxY);
      cur.current={x,y};
      pos.setValue({x:x*q.W-q.cw/2,y:y*q.W-q.ch/2});
    },
    onPanResponderRelease:finishDrag,
    onPanResponderTerminate:finishDrag,
  })).current;

  return <Animated.View {...pan.panHandlers}
    style={[{position:'absolute',left:0,top:0,width:cw,height:ch,transform:pos.getTranslateTransform()},webTouch]}>
    <CloudArt w={cw} tone={c.tone}/>
  </Animated.View>;
};

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevel26Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width,height}=useWindowDimensions();
  const W=Math.floor(clamp(Math.min(width-60,(height-330)/1.05,340),220,340));   // scene width in pixels
  const H=Math.round(W*1.05);                                                   // scene height

  const [view,setView]=useState<Level26View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [done,setDone]=useState(false);
  const [sunUp,setSunUp]=useState(false);
  const [awake,setAwake]=useState(false);
  const [result,setResult]=useState<Level26Result|null>(null);
  const [confirmSkip,setConfirmSkip]=useState(false);
  const [clueOpen,setClueOpen]=useState(false);
  const [clueText,setClueText]=useState(CLUE_FALLBACK);
  const [hintCloud,setHintCloud]=useState<{id:number;dir:'L'|'R'}|null>(null);
  const [resetKey,setResetKey]=useState(0);

  const pop=useRef(new Animated.Value(0)).current;
  const bob=useRef(new Animated.Value(0)).current;
  const sunPop=useRef(new Animated.Value(0)).current;
  const jump=useRef(new Animated.Value(0)).current;

  const viewRef=useRef<Level26View|null>(null);
  const posRef=useRef<Record<number,Pt>>({});             // where every cloud is now
  const actionsRef=useRef<Level26Action[]>([]);           // every drag since the start
  const doneRef=useRef(false);
  const sessionRef=useRef<number|null>(null);
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  const flash=(m:string)=>{
    setMsg(m);clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2800);
  };

  const startPositions=(v:Level26View)=>{
    const o:Record<number,Pt>={};
    v.clouds.forEach(c=>{o[c.id]={x:c.x,y:c.y}});
    return o;
  };

  // 1. open the level - the backend sends the sun, the clouds and a new session
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel26(playerId)
      .then(v=>{
        viewRef.current=v;
        posRef.current=startPositions(v);
        actionsRef.current=[];
        doneRef.current=false;
        setDone(false);setResult(null);setSunUp(false);setAwake(false);setHintCloud(null);
        setResetKey(k=>k+1);
        setSessionId(v.sessionId);sessionRef.current=v.sessionId;
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
    const b=Animated.loop(Animated.sequence([
      Animated.timing(bob,{toValue:1,duration:450,useNativeDriver:true}),
      Animated.timing(bob,{toValue:0,duration:450,useNativeDriver:true})]));
    b.start();
    return()=>{b.stop()};
  },[]);

  useEffect(()=>{
    if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
  },[result]);

  // the sun shows
  useEffect(()=>{
    if(sunUp)Animated.spring(sunPop,{toValue:1,friction:4,tension:80,useNativeDriver:true}).start();
    else sunPop.setValue(0);
  },[sunUp]);

  // the cat wakes up and jumps
  useEffect(()=>{
    if(awake){
      Animated.loop(Animated.sequence([
        Animated.timing(jump,{toValue:1,duration:200,useNativeDriver:true}),
        Animated.timing(jump,{toValue:0,duration:200,useNativeDriver:true})]),{iterations:3}).start();
    }else jump.setValue(0);
  },[awake]);

  // 2. the sun is free: send every drag, the backend plays them again and saves the win
  const finish=async(attempt:number)=>{
    const sid=sessionRef.current;
    if(!sid)return;
    try{
      const r=await finishLevel26({sessionId:sid,playerId,actions:actionsRef.current.slice()});
      if(setHints&&typeof r.hints==='number')setHints(r.hints);
      setDone(true);
      later(()=>setResult(r),1500);
    }catch(e:any){
      if(attempt<2){later(()=>finishRef.current(attempt+1),1200);return}
      flash(e.message||'Network error. Try again.');
      later(restart,1600);
    }
  };
  const finishRef=useRef(finish);
  finishRef.current=finish;

  // put all clouds back on the sun
  const restart=()=>{
    const v=viewRef.current;
    if(!v)return;
    posRef.current=startPositions(v);
    actionsRef.current=[];
    doneRef.current=false;
    setSunUp(false);setAwake(false);setHintCloud(null);
    setResetKey(k=>k+1);
  };

  // a cloud was dropped
  const onRelease=(id:number,x:number,y:number)=>{
    const v=viewRef.current;
    if(!v||doneRef.current)return;
    posRef.current[id]={x,y};
    actionsRef.current.push({t:'drag',id,x:r4(x),y:r4(y)});
    setHintCloud(null);
    if(sunIsFree(v.clouds,posRef.current,v.sun)){
      doneRef.current=true;
      setConfirmSkip(false);
      setSunUp(true);
      later(()=>setAwake(true),700);
      finishRef.current(0);
    }
  };

  const onGrab=()=>{setConfirmSkip(false)};

  const onNoise=(what:string)=>{
    if(doneRef.current)return;
    flash(what);
  };

  // magnifier (search icon): frontend -> POST /hint -> backend saves it in the database -> JSON back -> popup opens
  const onHint=async()=>{
    if(done||!sessionId||!view)return;
    setConfirmSkip(false);
    try{
      const clouds=view.clouds.map(c=>({id:c.id,x:(posRef.current[c.id]||c).x,y:(posRef.current[c.id]||c).y}));
      const r=await hintLevel26({sessionId,playerId,clouds});
      if(typeof r.hints==='number'&&setHints)setHints(r.hints);
      setClueText(r.clue||CLUE_FALLBACK);
      if(r.target&&r.dir){
        setHintCloud({id:r.target,dir:r.dir});
        later(()=>setHintCloud(null),6000);
      }
      setClueOpen(true);
    }catch(e:any){
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }
  };

  // video reward (+25 hints) - only adds hints, never opens the clue popup
  const onReward=async()=>{
    if(done)return;
    setConfirmSkip(false);
    try{
      const r=await rewardLevel26(playerId);
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
      const r=await skipLevel26({sessionId,playerId});
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
          <Text style={st.signT}>LEVEL 26</Text>
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
          <Text style={st.load}>Loading level 26...</Text>
        </>}
      </View>
    </View></Stage>;
  }

  const bobX=bob.interpolate({inputRange:[0,1],outputRange:[-6,6]});
  const sunS=view.sun.r*2*W/0.56;                    // sun drawing size (rays included)
  const catW=W*0.34;
  const catH=catW*0.667;
  const hintPos=hintCloud?(posRef.current[hintCloud.id]||null):null;

  return <Stage bg="#bddaee"><View style={st.root}>
    <RoomBackground/>
    {header}

    <View style={st.center}>
      {/* question pill */}
      <View style={st.qPill}>
        <Text style={st.qArrow}>{'<'}</Text>
        <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
        <Text style={st.qArrow}>{'>'}</Text>
      </View>

      {/* notebook page with the scene */}
      <View style={[st.paper,{width:W+28}]}>
        <View style={st.holes}>
          {Array.from({length:10}).map((_,i)=><View key={i} style={st.hole}/>)}
        </View>

        <View style={{width:W,height:H}}>
          {[0.18,0.34,0.5,0.66,0.82,0.98].map(k=><View key={k} style={[st.ruled,{top:k*H}]}/>)}

          {/* the line the horn and the clock sit on */}
          <View style={{position:'absolute',left:0.04*W,width:0.89*W,top:0.55*W,height:2,backgroundColor:'#3a3a3a'}}/>
          <View pointerEvents="none" style={{position:'absolute',left:0.09*W,top:0.55*W-0.07*W}}><GrassArt w={0.09*W}/></View>
          <View pointerEvents="none" style={{position:'absolute',left:0.68*W,top:0.55*W-0.07*W}}><GrassArt w={0.09*W}/></View>

          {/* sun (behind the clouds) */}
          <Animated.View pointerEvents="none"
            style={{position:'absolute',left:view.sun.x*W-sunS/2,top:view.sun.y*W-sunS/2,width:sunS,height:sunS,
              transform:[{scale:sunPop.interpolate({inputRange:[0,1],outputRange:[1,1.25]})}]}}>
            <SunArt s={sunS}/>
          </Animated.View>

          {/* things that do NOT wake the cat: horn (left of the cat) and alarm clock (right end of the line) */}
          <TouchableOpacity activeOpacity={0.8} onPress={()=>onNoise('Honk! The cat does not care...')}
            style={{position:'absolute',left:0.1*W,top:0.6*W}}>
            <HornArt w={0.14*W}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={()=>onNoise('Ring! The cat sleeps on...')}
            style={{position:'absolute',left:0.79*W,top:0.49*W}}>
            <ClockArt w={0.13*W}/>
          </TouchableOpacity>

          {/* cushion, grass and the curled-up cat */}
          <View pointerEvents="none" style={{position:'absolute',left:0.2*W,top:0.72*W}}><GrassArt w={0.07*W}/></View>
          <View pointerEvents="none" style={{position:'absolute',left:0.79*W,top:0.74*W}}><GrassArt w={0.07*W}/></View>
          <View pointerEvents="none" style={{position:'absolute',left:0.5*W-0.25*W,top:0.66*W}}>
            <CushionArt w={0.5*W}/>
          </View>
          <Animated.View pointerEvents="none"
            style={{position:'absolute',left:0.5*W-catW/2,top:0.8*W-catH,
              transform:[{translateY:jump.interpolate({inputRange:[0,1],outputRange:[0,-14]})}]}}>
            <CatArt w={catW} awake={awake}/>
          </Animated.View>

          {/* the clouds the player drags away */}
          {view.clouds.map(c=>
            <DragCloud key={c.id+'-'+resetKey} c={c} W={W} b={view.bounds} locked={done||sunUp}
              onGrab={onGrab} onRelease={onRelease}/>)}

          {/* magnifier: which cloud to move and to which side */}
          {!!hintCloud&&!!hintPos&&<Animated.Text pointerEvents="none"
            style={{position:'absolute',left:hintPos.x*W-22,top:hintPos.y*W-28,fontSize:46,color:'#ff9f1c',fontWeight:'bold',
              textShadowColor:'#fff',textShadowRadius:4,zIndex:20,
              transform:[{rotate:hintCloud.dir==='L'?'180deg':'0deg'},{translateX:bobX}]}}>{'\u279C'}</Animated.Text>}
        </View>
      </View>
    </View>

    {/* bottom rounded panel */}
    <View style={st.panel}>
      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
          <View style={st.circleGreen}><Icon n="search" s={32}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onReward}>
          <Icon n="film" s={36}/>
        </TouchableOpacity>
        <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+25</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
          <View style={st.circleRed}><Icon n="play" s={30}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
      </View>
    </View>

    {/* CLUES popup (only from the magnifier / search icon) */}
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
            <Text style={st.clueBody}>{clueText}</Text>
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
   STYLES
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
  qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,marginBottom:10,maxWidth:360},
  qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
  q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

  paper:{backgroundColor:'#fbf6e9',borderWidth:3,borderColor:'#e6d3a8',borderRadius:10,paddingHorizontal:14,paddingBottom:14,alignItems:'center'},
  holes:{flexDirection:'row',justifyContent:'space-between',alignSelf:'stretch',paddingVertical:8},
  hole:{width:11,height:11,borderRadius:6,backgroundColor:'#e8a860'},
  ruled:{position:'absolute',left:0,right:0,height:1,backgroundColor:'#e5dcc6'},

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
