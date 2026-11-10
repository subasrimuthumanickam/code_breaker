
// // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Animated,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // import {Stage,Coin} from './BTShared';
// // import {Icon} from './Art';
// // import {BigStar} from './Btlevel7art';
// // import {Room,RoomFront,Parrot,Darkness,SCENE_W,SCENE_H} from './Btlevel8art';
// // import {startLevel8,lookLevel8,skipLevel8,rewardLevel8,Level8View,Level8Result} from './Btlevel8api';
// // import {RoomBackground,THEME} from './Btlevel4Theme';

// // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // // the clue is FREE: it never depends on hints, coins or videos
// // // only ONE clue is shown when the magnifier is tapped
// // const CLUE_1='The parrot is right under your eyes… but you may need to look at things a little differently!';

// // type Props={
// //   playerId:number;
// //   hints?:number;
// //   setHints?:(n:number)=>void;
// //   onExit:()=>void;
// //   onComplete?:(result:Level8Result)=>void;
// // };

// // const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));

// // export default function BTLevel8Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// //   const {width,height}=useWindowDimensions();
// //   const RW=Math.max(240,Math.min(width-36,340,(height-380)*SCENE_W/SCENE_H));   // frame width
// //   const IW=RW-6;                                   // room width inside the 3px border
// //   const k=IW/SCENE_W;                              // scene units -> pixels
// //   const RH=SCENE_H*k+6;

// //   const [view,setView]=useState<Level8View|null>(null);
// //   const [sessionId,setSessionId]=useState<number|null>(null);
// //   const [loadErr,setLoadErr]=useState('');
// //   const [msg,setMsg]=useState('');
// //   const [done,setDone]=useState(false);
// //   const [light,setLight]=useState({x:150,y:200});
// //   const [parrot,setParrot]=useState<{x:number;y:number}|null>(null);   // set once found
// //   const [seen,setSeen]=useState<{x:number;y:number}|null>(null);       // parrot inside the light: tap it
// //   const [result,setResult]=useState<Level8Result|null>(null);
// //   const [confirmSkip,setConfirmSkip]=useState(false);
// //   const [clueOpen,setClueOpen]=useState(false);

// //   const reveal=useRef(new Animated.Value(1)).current;   // 1 = dark, 0 = lights on
// //   const flap=useRef(new Animated.Value(1)).current;
// //   const pop=useRef(new Animated.Value(0)).current;

// //   const lightRef=useRef({x:150,y:200});
// //   const dragStart=useRef({x:150,y:200});
// //   const lastSent=useRef({x:-999,y:-999,t:0});
// //   const pending=useRef<{x:number;y:number}|null>(null);
// //   const inflight=useRef(false);
// //   const doneRef=useRef(false);
// //   const sessionRef=useRef<number|null>(null);
// //   const kRef=useRef(k);
// //   kRef.current=k;
// //   const timers=useRef<any[]>([]);
// //   const msgTimer=useRef<any>(null);
// //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// //   const moveLight=(x:number,y:number)=>{
// //     lightRef.current={x,y};
// //     setLight({x,y});
// //   };

// //   const flash=(m:string)=>{
// //     setMsg(m);clearTimeout(msgTimer.current);
// //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// //   };

// //   // 1. open the level - the backend makes a NEW game, hides the parrot in a random place
// //   const load=useCallback(()=>{
// //     setLoadErr('');setView(null);
// //     startLevel8(playerId)
// //       .then(v=>{
// //         setSessionId(v.sessionId);sessionRef.current=v.sessionId;
// //         moveLight(v.start.x,v.start.y);
// //         dragStart.current={x:v.start.x,y:v.start.y};
// //         setSeen(null);
// //         setView(v);
// //         if(setHints&&typeof v.hints==='number')setHints(v.hints);
// //       })
// //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// //   },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

// //   useEffect(()=>{
// //     load();
// //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// //   },[load]);

// //   useEffect(()=>{
// //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// //   },[result]);

// //   // the server said the parrot was tapped: lights on, parrot jumps
// //   const onFound=(r:Level8Result)=>{
// //     doneRef.current=true;
// //     setDone(true);
// //     setSeen(null);
// //     setClueOpen(false);
// //     if(r.parrot)setParrot({x:r.parrot.x,y:r.parrot.y});
// //     if(setHints&&typeof r.hints==='number')setHints(r.hints);
// //     Animated.timing(reveal,{toValue:0,duration:700,useNativeDriver:true}).start();
// //     Animated.sequence([
// //       Animated.timing(flap,{toValue:1.35,duration:180,useNativeDriver:true}),
// //       Animated.timing(flap,{toValue:1,duration:180,useNativeDriver:true}),
// //       Animated.timing(flap,{toValue:1.25,duration:180,useNativeDriver:true}),
// //       Animated.timing(flap,{toValue:1,duration:180,useNativeDriver:true}),
// //     ]).start();
// //     later(()=>setResult(r),1600);
// //   };

// //   // 2. send where the spotlight is; the backend says if the parrot is inside it (`seen`).
// //   //    Only one request at a time - the newest position waits in `pending`.
// //   const pump=async()=>{
// //     if(inflight.current||doneRef.current)return;
// //     const p=pending.current;
// //     const sid=sessionRef.current;
// //     if(!p||!sid)return;
// //     pending.current=null;
// //     inflight.current=true;
// //     try{
// //       const r=await lookLevel8({sessionId:sid,playerId,x:p.x,y:p.y});
// //       if(r.found)onFound(r);else setSeen(r.seen||null);
// //     }catch(e:any){
// //       flash(e.message||'Network error');
// //     }finally{
// //       inflight.current=false;
// //       if(pending.current&&!doneRef.current)pump();
// //     }
// //   };
// //   const queueLook=(x:number,y:number)=>{
// //     pending.current={x:Math.round(x),y:Math.round(y)};
// //     pump();
// //   };
// //   const queueRef=useRef(queueLook);
// //   queueRef.current=queueLook;

// //   // 3. the player TAPPED the room: found only if the tap is on the parrot
// //   const doTap=async(x:number,y:number)=>{
// //     const sid=sessionRef.current;
// //     if(!sid||doneRef.current)return;
// //     try{
// //       const r=await lookLevel8({sessionId:sid,playerId,x:Math.round(x),y:Math.round(y),tap:true});
// //       if(r.found)onFound(r);
// //     }catch(e:any){
// //       flash(e.message||'Network error');
// //     }
// //   };
// //   const tapRef=useRef(doTap);
// //   tapRef.current=doTap;

// //   // drag anywhere on the room: the spotlight moves the same way as the finger
// //   const pan=useRef(PanResponder.create({
// //     onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// //     onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// //     onPanResponderTerminationRequest:()=>false,
// //     onPanResponderGrant:()=>{
// //       dragStart.current={...lightRef.current};
// //       setConfirmSkip(false);
// //     },
// //     onPanResponderMove:(_e,g)=>{
// //       if(doneRef.current)return;
// //       const nx=clamp(dragStart.current.x+g.dx/kRef.current,0,SCENE_W);
// //       const ny=clamp(dragStart.current.y+g.dy/kRef.current,0,SCENE_H);
// //       moveLight(nx,ny);
// //       const now=Date.now();
// //       const s=lastSent.current;
// //       if(now-s.t>=200&&Math.hypot(nx-s.x,ny-s.y)>=5){
// //         lastSent.current={x:nx,y:ny,t:now};
// //         queueRef.current(nx,ny);
// //       }
// //     },
// //     onPanResponderRelease:(e,g)=>{
// //       if(doneRef.current)return;
// //       if(Math.hypot(g.dx,g.dy)<8){                 // a tap, not a drag
// //         tapRef.current(e.nativeEvent.locationX/kRef.current,e.nativeEvent.locationY/kRef.current);
// //         return;
// //       }
// //       const p=lightRef.current;
// //       lastSent.current={x:p.x,y:p.y,t:Date.now()};
// //       queueRef.current(p.x,p.y);
// //     },
// //     onPanResponderTerminate:()=>{
// //       if(doneRef.current)return;
// //       const p=lightRef.current;
// //       queueRef.current(p.x,p.y);
// //     },
// //   })).current;

// //   // magnifier: show the clue directly (free, no hints / coins / video needed)
// //   const onHint=()=>{
// //     if(done)return;
// //     setConfirmSkip(false);
// //     setClueOpen(true);
// //   };

// //   // video reward (+75 hints) - only adds hints, never opens the clue
// //   const onReward=async()=>{
// //     if(done)return;
// //     setConfirmSkip(false);
// //     try{
// //       const r=await rewardLevel8(playerId);
// //       setHints&&setHints(r.hints);
// //       flash('+'+r.added+' hints');
// //     }catch(e:any){
// //       flash(e.message||'Network error');
// //     }
// //   };

// //   // skip (50 hints): tap twice
// //   const onSkip=async()=>{
// //     if(done||!sessionId)return;
// //     if(!confirmSkip){
// //       setConfirmSkip(true);
// //       flash('Skip costs 50 hints. Tap again to skip.');
// //       return;
// //     }
// //     try{
// //       const r=await skipLevel8({sessionId,playerId});
// //       setHints&&setHints(r.hints||0);
// //       doneRef.current=true;
// //       onComplete?onComplete(r):onExit();
// //     }catch(e:any){
// //       setConfirmSkip(false);
// //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// //     }
// //   };

// //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// //   const header=(
// //     <View style={st.topBar}>
// //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
// //         <Icon n="home" s={16}/>
// //       </TouchableOpacity>

// //       <View style={st.signWrap}>
// //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// //         <View style={st.sign}>
// //           <Text style={st.signArrow}>{'<'}</Text>
// //           <Text style={st.signT}>LEVEL 8</Text>
// //           <Text style={st.signArrow}>{'>'}</Text>
// //         </View>
// //         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
// //         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
// //       </View>

// //       <View style={st.pill}>
// //         <Text style={st.pillT}>{hints}</Text>
// //         <Text style={st.pillIcon}>💡</Text>
// //       </View>
// //     </View>
// //   );

// //   /* ---------- loading / error ---------- */

// //   if(loadErr||!view){
// //     return <Stage bg="#bddaee"><View style={st.root}>
// //       <RoomBackground/>
// //       {header}
// //       <View style={st.centerMsg}>
// //         {loadErr?<>
// //           <Text style={st.err}>{loadErr}</Text>
// //           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// //           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// //         </>:<>
// //           <ActivityIndicator size="large" color={THEME.orange}/>
// //           <Text style={st.load}>Loading level 8...</Text>
// //         </>}
// //       </View>
// //     </View></Stage>;
// //   }

// //   const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'grab'}:{};
// //   const pw=24*k;                                    // parrot width in pixels

// //   return <Stage bg="#bddaee"><View style={st.root}>
// //     <RoomBackground/>
// //     {header}

// //     <View style={st.center}>
// //       {/* question pill (same as level 1) */}
// //       <View style={st.qPill}>
// //         <Text style={st.qArrow}>{'<'}</Text>
// //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||(seen?'I can see it! Tap the parrot!':view.title)}</Text>
// //         <Text style={st.qArrow}>{'>'}</Text>
// //       </View>

// //       {/* the dark room: drag to move the spotlight, tap the parrot when you see it */}
// //       <View style={{width:RW,height:RH,marginTop:12}}>
// //         <View style={st.panelFrame}>
// //           <Room w={IW}/>

// //           {/* the parrot while it is inside the light: things in front of it hide part of it */}
// //           {!!seen&&!parrot&&<View pointerEvents="none"
// //             style={{position:'absolute',left:(seen.x-12)*k,top:(seen.y-17)*k}}>
// //             <Parrot w={pw}/>
// //           </View>}

// //           {/* curtain, sofa, plant, basket, books... drawn over the parrot */}
// //           <View pointerEvents="none" style={{position:'absolute',left:0,top:0}}>
// //             <RoomFront w={IW}/>
// //           </View>

// //           {/* once found, the parrot jumps in front of everything */}
// //           {!!parrot&&<Animated.View pointerEvents="none"
// //             style={{position:'absolute',left:(parrot.x-12)*k,top:(parrot.y-17)*k,transform:[{scale:flap}]}}>
// //             <Parrot w={pw}/>
// //           </Animated.View>}

// //           <Animated.View pointerEvents="none" style={{position:'absolute',left:0,top:0,opacity:reveal}}>
// //             <Darkness w={IW} x={light.x} y={light.y} r={view.lightR}/>
// //           </Animated.View>

// //           <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
// //         </View>
// //       </View>
// //     </View>

// //     {/* bottom rounded panel (same as level 1) */}
// //     <View style={st.panel}>
// //       <View style={st.btnCol}>
// //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
// //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
// //       </View>

// //       <View style={st.btnCol}>
// //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onReward}>
// //           <Icon n="film" s={36}/>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// //       </View>

// //       <View style={st.btnCol}>
// //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
// //           <View style={st.circleRed}><Icon n="play" s={30}/></View>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// //       </View>
// //     </View>

// //     {/* CLUES popup (only from the magnifier, ONE clue) */}
// //     {clueOpen&&<View style={st.overlay}>
// //       <View style={st.clueCard}>
// //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
// //           <Text style={st.closeT}>✕</Text>
// //         </TouchableOpacity>
// //         <Text style={st.clueTitle}>CLUES</Text>

// //         <View style={[st.clueRow,st.clueRowOpen]}>
// //           <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
// //           <View style={{flex:1}}>
// //             <Text style={st.clueHead}>Clue 1</Text>
// //             <Text style={st.clueBody}>{CLUE_1}</Text>
// //           </View>
// //         </View>
// //       </View>
// //     </View>}

// //     {/* result card */}
// //     {!!result&&<View style={st.overlay}>
// //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// //         <Text style={st.cardTitle}>Level complete!</Text>
// //         <Text style={st.cardMsg}>{result.message}</Text>
// //         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// //         <Text style={st.cardScore}>Score {result.score}</Text>
// //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// //           <Text style={st.nextT}>NEXT</Text>
// //         </TouchableOpacity>
// //       </Animated.View>
// //     </View>}
// //   </View></Stage>;
// // }

// // /* =========================================================
// //    STYLES  (same cozy room theme as Level 1 / 5 / 6 / 7)
// // ========================================================= */

// // const st=StyleSheet.create({
// //   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

// //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// //   homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
// //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// //   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
// //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
// //   signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
// //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// //   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
// //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
// //   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
// //   pillIcon:{fontSize:16},

// //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,maxWidth:360},
// //   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
// //   q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

// //   // wooden frame around the dark room
// //   panelFrame:{flex:1,borderWidth:3,borderColor:THEME.wood,borderRadius:12,overflow:'hidden',backgroundColor:'#000'},

// //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// //   btnCol:{alignItems:'center'},
// //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// //   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
// //   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
// //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
// //   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
// //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
// //   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
// //   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// //   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
// //   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
// //   clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},

// //   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
// //   card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
// //   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
// //   cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
// //   stars:{flexDirection:'row',gap:6,marginTop:14},
// //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
// //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// //   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

// //   load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
// //   err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
// //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
// //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
// //   back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
// // });
// import React,{useCallback,useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Animated,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// import {Stage,Coin} from './BTShared';
// import {Icon} from './Art';
// import {BigStar} from './Btlevel7art';
// import {Room,RoomFront,Parrot,Darkness,SCENE_W,SCENE_H} from './Btlevel8art';
// import {startLevel8,lookLevel8,skipLevel8,rewardLevel8,Level8View,Level8Result} from './Btlevel8api';
// import {RoomBackground,THEME} from './Btlevel4Theme';
// import {play} from './BTSound';   // same sounds as Level 5, 6 and 7

// const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // the clue is FREE: it never depends on hints, coins or videos
// // only ONE clue is shown when the magnifier is tapped
// const CLUE_1='The parrot is right under your eyes… but you may need to look at things a little differently!';

// type Props={
//   playerId:number;
//   hints?:number;
//   setHints?:(n:number)=>void;
//   onExit:()=>void;
//   onComplete?:(result:Level8Result)=>void;
// };

// const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));

// export default function BTLevel8Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
//   const {width,height}=useWindowDimensions();
//   const RW=Math.max(240,Math.min(width-36,340,(height-380)*SCENE_W/SCENE_H));   // frame width
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
//   const [clueOpen,setClueOpen]=useState(false);

//   const reveal=useRef(new Animated.Value(1)).current;   // 1 = dark, 0 = lights on
//   const flap=useRef(new Animated.Value(1)).current;
//   const pop=useRef(new Animated.Value(0)).current;

//   const lightRef=useRef({x:150,y:200});
//   const dragStart=useRef({x:150,y:200});
//   const dragSoundPlayed=useRef(false);
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
//     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
//   },[result]);

//   // the server said the parrot was tapped: lights on, parrot jumps
//   const onFound=(r:Level8Result)=>{
//     if(doneRef.current)return;
//     play('correct');                                // parrot found (correct)
//     doneRef.current=true;
//     setDone(true);
//     setSeen(null);
//     setClueOpen(false);
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
//       else play('wrong');                           // tapped, but the parrot is not there
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
//       dragSoundPlayed.current=false;
//       dragStart.current={...lightRef.current};
//       setConfirmSkip(false);
//     },
//     onPanResponderMove:(_e,g)=>{
//       if(doneRef.current)return;
//       if(!dragSoundPlayed.current&&Math.hypot(g.dx,g.dy)>=8){
//         play('drag');
//         dragSoundPlayed.current=true;
//       }
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
//         play('tap');
//         tapRef.current(e.nativeEvent.locationX/kRef.current,e.nativeEvent.locationY/kRef.current);
//         return;
//       }
//       if(!dragSoundPlayed.current)play('drag');
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

//   // magnifier: show the clue directly (free, no hints / coins / video needed)
//   const onHint=()=>{
//     if(done)return;
//     play('clue');
//     setConfirmSkip(false);
//     setClueOpen(true);
//   };

//   // video reward (+75 hints) - only adds hints, never opens the clue
//   const onReward=async()=>{
//     if(done)return;
//     play('btn');
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
//     play('btn');
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
//       play('wrong');
//       flash(e.status===402?'Not enough hints':e.message||'Network error');
//     }
//   };

//   /* ---------- header (home, wooden sign, hints pill) ---------- */

//   const header=(
//     <View style={st.topBar}>
//       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={()=>{play('btn');onExit()}}>
//         <Icon n="home" s={16}/>
//       </TouchableOpacity>

//       <View style={st.signWrap}>
//         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
//         <View style={st.sign}>
//           <Text style={st.signArrow}>{'<'}</Text>
//           <Text style={st.signT}>LEVEL 8</Text>
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
//           <TouchableOpacity style={st.retry} onPress={()=>{play('btn');load()}}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
//           <TouchableOpacity onPress={()=>{play('btn');onExit()}}><Text style={st.back}>Back</Text></TouchableOpacity>
//         </>:<>
//           <ActivityIndicator size="large" color={THEME.orange}/>
//           <Text style={st.load}>Loading level 8...</Text>
//         </>}
//       </View>
//     </View></Stage>;
//   }

//   const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'grab'}:{};
//   const pw=24*k;                                    // parrot width in pixels

//   return <Stage bg="#bddaee"><View style={st.root}>
//     <RoomBackground/>
//     {header}

//     <View style={st.center}>
//       {/* question pill (same as level 1) */}
//       <View style={st.qPill}>
//         <Text style={st.qArrow}>{'<'}</Text>
//         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||(seen?'I can see it! Tap the parrot!':view.title)}</Text>
//         <Text style={st.qArrow}>{'>'}</Text>
//       </View>

//       {/* the dark room: drag to move the spotlight, tap the parrot when you see it */}
//       <View style={{width:RW,height:RH,marginTop:12}}>
//         <View style={st.panelFrame}>
//           <Room w={IW}/>

//           {/* the parrot while it is inside the light: things in front of it hide part of it */}
//           {!!seen&&!parrot&&<View pointerEvents="none"
//             style={{position:'absolute',left:(seen.x-12)*k,top:(seen.y-17)*k}}>
//             <Parrot w={pw}/>
//           </View>}

//           {/* curtain, sofa, plant, basket, books... drawn over the parrot */}
//           <View pointerEvents="none" style={{position:'absolute',left:0,top:0}}>
//             <RoomFront w={IW}/>
//           </View>

//           {/* once found, the parrot jumps in front of everything */}
//           {!!parrot&&<Animated.View pointerEvents="none"
//             style={{position:'absolute',left:(parrot.x-12)*k,top:(parrot.y-17)*k,transform:[{scale:flap}]}}>
//             <Parrot w={pw}/>
//           </Animated.View>}

//           <Animated.View pointerEvents="none" style={{position:'absolute',left:0,top:0,opacity:reveal}}>
//             <Darkness w={IW} x={light.x} y={light.y} r={view.lightR}/>
//           </Animated.View>

//           <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
//         </View>
//       </View>
//     </View>

//     {/* bottom rounded panel (same as level 1) */}
//     <View style={st.panel}>
//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
//           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
//         </TouchableOpacity>
//         <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
//       </View>

//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onReward}>
//           <Icon n="film" s={36}/>
//         </TouchableOpacity>
//         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
//       </View>

//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
//           <View style={st.circleRed}><Icon n="play" s={30}/></View>
//         </TouchableOpacity>
//         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
//       </View>
//     </View>

//     {/* CLUES popup (only from the magnifier, ONE clue) */}
//     {clueOpen&&<View style={st.overlay}>
//       <View style={st.clueCard}>
//         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>{play('btn');setClueOpen(false)}}>
//           <Text style={st.closeT}>✕</Text>
//         </TouchableOpacity>
//         <Text style={st.clueTitle}>CLUES</Text>

//         <View style={[st.clueRow,st.clueRowOpen]}>
//           <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
//           <View style={{flex:1}}>
//             <Text style={st.clueHead}>Clue 1</Text>
//             <Text style={st.clueBody}>{CLUE_1}</Text>
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
//         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>{play('btn');onComplete?onComplete(result):onExit()}}>
//           <Text style={st.nextT}>NEXT</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </View>}
//   </View></Stage>;
// }

// /* =========================================================
//    STYLES  (same cozy room theme as Level 1 / 5 / 6 / 7)
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
//   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,maxWidth:360},
//   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
//   q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

//   // wooden frame around the dark room
//   panelFrame:{flex:1,borderWidth:3,borderColor:THEME.wood,borderRadius:12,overflow:'hidden',backgroundColor:'#000'},

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
import {Stage,Coin} from './BTShared';
import {Icon} from './Art';
import {BigStar} from './Btlevel7art';
import {Room,RoomFront,Parrot,Darkness,SCENE_W,SCENE_H} from './Btlevel8art';
import {startLevel8,lookLevel8,skipLevel8,rewardLevel8,Level8View,Level8Result} from './Btlevel8api';
import {RoomBackground,THEME} from './Btlevel4Theme';
import {play,loadSounds} from './BTSound';   // same sounds as Level 5, 6 and 7

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
  const dragSoundPlayed=useRef(false);
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

  // preload all sounds (clue / correct / wrong ...) so the first play has no delay
  useEffect(()=>{
    loadSounds().catch(()=>{});
  },[]);

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
    if(doneRef.current)return;
    play('correct');                                // CORRECT sound: parrot found
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
      if(r.found)onFound(r);                        // CORRECT sound plays inside onFound
      else play('wrong');                           // WRONG sound: tapped, but the parrot is not there
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
      dragSoundPlayed.current=false;
      dragStart.current={...lightRef.current};
      setConfirmSkip(false);
    },
    onPanResponderMove:(_e,g)=>{
      if(doneRef.current)return;
      if(!dragSoundPlayed.current&&Math.hypot(g.dx,g.dy)>=8){
        play('drag');
        dragSoundPlayed.current=true;
      }
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
        // no 'tap' sound here: the server answer decides 'correct' or 'wrong'
        tapRef.current(e.nativeEvent.locationX/kRef.current,e.nativeEvent.locationY/kRef.current);
        return;
      }
      if(!dragSoundPlayed.current)play('drag');
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
    play('clue');                                   // CLUE sound
    setConfirmSkip(false);
    setClueOpen(true);
  };

  // video reward (+75 hints) - only adds hints, never opens the clue
  const onReward=async()=>{
    if(done)return;
    play('btn');
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
    play('btn');
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
      play('wrong');                                // WRONG sound: not enough hints
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }
  };

  /* ---------- header (home, wooden sign, hints pill) ---------- */

  const header=(
    <View style={st.topBar}>
      <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={()=>{play('btn');onExit()}}>
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
          <TouchableOpacity style={st.retry} onPress={()=>{play('btn');load()}}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>{play('btn');onExit()}}><Text style={st.back}>Back</Text></TouchableOpacity>
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
        <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>{play('btn');setClueOpen(false)}}>
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
        <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>{play('btn');onComplete?onComplete(result):onExit()}}>
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
