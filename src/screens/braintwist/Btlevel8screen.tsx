
// // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Animated,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // import {Stage,Coin} from './BTShared';
// // import {Icon} from './Art';
// // import {BigStar} from './Btlevel7art';
// // import {Room,RoomFront,Parrot,Darkness,SCENE_W,SCENE_H} from './Btlevel8art';
// // import {startLevel8,lookLevel8,skipLevel8,rewardLevel8,Level8View,Level8Result} from './Btlevel8api';
// // import {RoomBackground,THEME} from './Btlevel4Theme';
// // import {play,loadSounds} from './BTSound';   // same sounds as Level 5, 6 and 7

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
// //   const dragSoundPlayed=useRef(false);
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

// //   // preload all sounds (clue / correct / wrong ...) so the first play has no delay
// //   useEffect(()=>{
// //     loadSounds().catch(()=>{});
// //   },[]);

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
// //     if(doneRef.current)return;
// //     play('correct');                                // CORRECT sound: parrot found
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
// //       if(r.found)onFound(r);                        // CORRECT sound plays inside onFound
// //       else play('wrong');                           // WRONG sound: tapped, but the parrot is not there
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
// //       dragSoundPlayed.current=false;
// //       dragStart.current={...lightRef.current};
// //       setConfirmSkip(false);
// //     },
// //     onPanResponderMove:(_e,g)=>{
// //       if(doneRef.current)return;
// //       if(!dragSoundPlayed.current&&Math.hypot(g.dx,g.dy)>=8){
// //         play('drag');
// //         dragSoundPlayed.current=true;
// //       }
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
// //         // no 'tap' sound here: the server answer decides 'correct' or 'wrong'
// //         tapRef.current(e.nativeEvent.locationX/kRef.current,e.nativeEvent.locationY/kRef.current);
// //         return;
// //       }
// //       if(!dragSoundPlayed.current)play('drag');
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
// //     play('clue');                                   // CLUE sound
// //     setConfirmSkip(false);
// //     setClueOpen(true);
// //   };

// //   // video reward (+75 hints) - only adds hints, never opens the clue
// //   const onReward=async()=>{
// //     if(done)return;
// //     play('btn');
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
// //     play('btn');
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
// //       play('wrong');                                // WRONG sound: not enough hints
// //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// //     }
// //   };

// //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// //   const header=(
// //     <View style={st.topBar}>
// //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={()=>{play('btn');onExit()}}>
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
// //           <TouchableOpacity style={st.retry} onPress={()=>{play('btn');load()}}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// //           <TouchableOpacity onPress={()=>{play('btn');onExit()}}><Text style={st.back}>Back</Text></TouchableOpacity>
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
// //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>{play('btn');setClueOpen(false)}}>
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
// //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>{play('btn');onComplete?onComplete(result):onExit()}}>
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
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, Animated, Easing, PanResponder, Platform, StyleSheet, ActivityIndicator, useWindowDimensions,
// } from 'react-native';
// import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// import { Stage, F, Coin } from './BTShared';
// import { Icon } from './Art';
// import { BigStar } from './Btlevel7art';
// import { Room, RoomFront, Parrot, Darkness, SCENE_W, SCENE_H } from './Btlevel8art';
// import { startLevel8, lookLevel8, skipLevel8, rewardLevel8, Level8View, Level8Result } from './Btlevel8api';
// import { play, loadSounds } from './BTSound'; // same sounds as Level 5, 6 and 7

// const FONT: any = F;
// const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// /* garden palette (same as Level 3 - 7) */
// const NAVY = '#13235b';
// const SKY = '#5cc0f5';
// const CREAM = '#faf0e2';
// const CREAM_BORDER = '#ead2a4';
// const WOOD = '#eba24e';
// const WOOD_D = '#c2782c';
// const WOOD_DD = '#8f5a1f';
// const LIME = '#a4e02a';
// const LIME_RING = '#f4f1dc';
// const RED = '#f0434d';
// const ARROW = '#ffb629';
// const BADGE = '#6b4423';
// const GREEN_OK = '#3ec45a';
// const YEL_BTN = '#fbc02d';
// const YEL_BTN_D = '#d98e1c';

// // thickness of the wooden room frame (the room / touch maths uses this)
// const FW = 8;

// // the clue is FREE: it never depends on hints, coins or videos
// // only ONE clue is shown when the magnifier is tapped
// const CLUE_1 = 'The parrot is right under your eyes… but you may need to look at things a little differently!';

// type Props = {
//   playerId: number;
//   hints?: number;
//   setHints?: (n: number) => void;
//   onExit: () => void;
//   onComplete?: (result: Level8Result) => void;
// };

// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// /* ---------- garden background ---------- */
// function Flower({ x, y, s = 1 }: any) {
//   return (
//     <G transform={`translate(${x} ${y}) scale(${s})`}>
//       {[0, 72, 144, 216, 288].map((a) => (
//         <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
//       ))}
//       <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
//     </G>
//   );
// }

// function Tuft({ x, y }: any) {
//   return (
//     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
//       <Polygon points="-14,0 -8,-34 -2,0" />
//       <Polygon points="-4,0 4,-44 12,0" />
//       <Polygon points="8,0 18,-30 24,0" />
//     </G>
//   );
// }

// function Cloud({ x, y, s = 1 }: any) {
//   return (
//     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
//       <Ellipse cx="0" cy="0" rx="70" ry="26" />
//       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
//       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
//     </G>
//   );
// }

// /* sprout friend (same as Level 3), local coords: body at 0..120 x 55..133 */
// function Sprout({ x, y, s = 1 }: any) {
//   return (
//     <G transform={`translate(${x} ${y}) scale(${s})`}>
//       <G fill="#5cb85c">
//         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
//         <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
//         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
//       </G>
//       <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
//       <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
//       <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
//       <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
//       <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
//       <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
//     </G>
//   );
// }

// function Garden() {
//   return (
//     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
//       {/* full-height sky (stretches to any screen, so no plain blue strip anywhere) */}
//       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
//         <Defs>
//           <LinearGradient id="g4sky" x1="0" y1="0" x2="0" y2="1">
//             <Stop offset="0" stopColor="#46b6f3" />
//             <Stop offset="1" stopColor="#c2e8fb" />
//           </LinearGradient>
//         </Defs>
//         <Rect width="10" height="10" fill="url(#g4sky)" />
//       </Svg>

//       {/* trees + cloud, pinned to the top */}
//       <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
//         <Svg width="100%" height="100%" viewBox="0 0 942 330">
//           <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
//           <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
//           <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
//           <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
//           <Cloud x={850} y={245} s={1} />
//         </Svg>
//       </View>

//       {/* ground (Level 3 scene), pinned to the bottom: hills, fence, bookshelf, sprout, meadow to the very edge */}
//       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
//         <Svg width="100%" height="100%" viewBox="0 0 942 1269">
//           {/* clouds */}
//           <Cloud x={50} y={585} s={0.9} />
//           <Cloud x={880} y={600} s={0.6} />

//           {/* rolling hills */}
//           <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
//           <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
//           <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

//           {/* fence: pickets first, rails in front */}
//           {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
//             const x = -10 + i * 90;
//             return (
//               <G key={i}>
//                 <Polygon points={`${x},730 ${x + 33},698 ${x + 66},730`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
//                 <Rect x={x} y="730" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
//               </G>
//             );
//           })}
//           <Rect x="0" y="760" width="942" height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
//           <Rect x="0" y="808" width="942" height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

//           {/* bookshelf (right) with potted plant */}
//           <G>
//             <Rect x="845" y="190" width="80" height="18" rx="4" fill="#e8903a" />
//             <Polygon points="852,208 918,208 910,250 860,250" fill="#f0a050" />
//             <G fill="#4cb04a">
//               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(-28 885 198)" />
//               <Ellipse cx="885" cy="140" rx="20" ry="62" fill="#3a9a3c" />
//               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(28 885 198)" />
//             </G>
//             <Rect x="780" y="250" width="162" height="575" fill="#eaa24f" />
//             <Rect x="796" y="266" width="146" height="545" fill="#dc9d4f" />
//             <Rect x="780" y="440" width="162" height="16" fill="#f2b866" />
//             <Rect x="780" y="630" width="162" height="16" fill="#f2b866" />
//             <Rect x="780" y="250" width="162" height="16" fill="#f2b866" />
//             <Rect x="810" y="310" width="36" height="130" fill="#2a9d9d" />
//             <Rect x="850" y="290" width="34" height="150" fill="#f06ba8" />
//             <Rect x="888" y="315" width="40" height="125" fill="#8a63da" />
//             <Rect x="805" y="515" width="30" height="115" fill="#e5484d" />
//             <Rect x="840" y="490" width="24" height="140" fill="#3b82e0" />
//             <Rect x="868" y="510" width="38" height="120" fill="#4caf50" />
//             <Rect x="810" y="695" width="34" height="120" fill="#f5c518" />
//             <Rect x="848" y="665" width="40" height="150" fill="#2c6fdc" />
//           </G>

//           {/* sprout friend (left) */}
//           <Sprout x={10} y={740} s={1} />

//           {/* front meadow, runs to the bottom edge */}
//           <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
//           <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

//           {/* stones */}
//           <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
//           <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
//           <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
//           <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

//           {/* grass tufts + flowers */}
//           <Tuft x="905" y="925" /><Tuft x="910" y="1050" /><Tuft x="20" y="1040" />
//           <Tuft x="100" y="1260" /><Tuft x="340" y="1260" /><Tuft x="580" y="1260" /><Tuft x="820" y="1260" />
//           <Flower x="885" y="815" s={0.8} />
//           <Flower x="200" y="1225" s={0.95} />
//           <Flower x="735" y="1225" s={0.95} />
//         </Svg>
//       </View>
//     </View>
//   );
// }

// /* ---------- thin link chain for the hanging sign (same as Level 3) ---------- */
// function Chain({ h = 28, style }: { h?: number; style?: any }) {
//   const n = Math.max(2, Math.round(h / 8));
//   return (
//     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
//       {Array.from({ length: n }).map((_, i) => (
//         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
//       ))}
//     </Svg>
//   );
// }

// /* ---------- double arrow (skip icon, same as Level 3) ---------- */
// function DoubleArrow({ s }: { s: number }) {
//   return (
//     <Svg width={s} height={s} viewBox="0 0 100 100">
//       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
//       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
//     </Svg>
//   );
// }

// export default function BTLevel8Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
//   const { width, height } = useWindowDimensions();
//   const RW = Math.max(240, Math.min(width - 36, 340, ((height - 440) * SCENE_W) / SCENE_H)); // frame width
//   const IW = RW - 2 * FW; // room width inside the wooden frame
//   const k = IW / SCENE_W; // scene units -> pixels
//   const RH = SCENE_H * k + 2 * FW;

//   const [view, setView] = useState<Level8View | null>(null);
//   const [sessionId, setSessionId] = useState<number | null>(null);
//   const [loadErr, setLoadErr] = useState('');
//   const [msg, setMsg] = useState('');
//   const [done, setDone] = useState(false);
//   const [light, setLight] = useState({ x: 150, y: 200 });
//   const [parrot, setParrot] = useState<{ x: number; y: number } | null>(null); // set once found
//   const [seen, setSeen] = useState<{ x: number; y: number } | null>(null); // parrot inside the light: tap it
//   const [result, setResult] = useState<Level8Result | null>(null);
//   const [confirmSkip, setConfirmSkip] = useState(false);
//   const [clueOpen, setClueOpen] = useState(false);

//   const reveal = useRef(new Animated.Value(1)).current; // 1 = dark, 0 = lights on
//   const flap = useRef(new Animated.Value(1)).current;
//   const pop = useRef(new Animated.Value(0)).current;
//   const sway = useRef(new Animated.Value(0)).current;

//   const lightRef = useRef({ x: 150, y: 200 });
//   const dragStart = useRef({ x: 150, y: 200 });
//   const dragSoundPlayed = useRef(false);
//   const lastSent = useRef({ x: -999, y: -999, t: 0 });
//   const pending = useRef<{ x: number; y: number } | null>(null);
//   const inflight = useRef(false);
//   const doneRef = useRef(false);
//   const sessionRef = useRef<number | null>(null);
//   const kRef = useRef(k);
//   kRef.current = k;
//   const timers = useRef<any[]>([]);
//   const msgTimer = useRef<any>(null);
//   const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

//   // hanging sign sways gently (same as Level 3 - 7)
//   useEffect(() => {
//     const a = Animated.loop(Animated.sequence([
//       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//     ]));
//     a.start();
//     return () => a.stop();
//   }, [sway]);
//   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

//   const moveLight = (x: number, y: number) => {
//     lightRef.current = { x, y };
//     setLight({ x, y });
//   };

//   const flash = (m: string) => {
//     setMsg(m); clearTimeout(msgTimer.current);
//     msgTimer.current = setTimeout(() => setMsg(''), 2800);
//   };

//   // preload all sounds (clue / correct / wrong ...) so the first play has no delay
//   useEffect(() => {
//     loadSounds().catch(() => {});
//   }, []);

//   // 1. open the level - the backend makes a NEW game, hides the parrot in a random place
//   const load = useCallback(() => {
//     setLoadErr(''); setView(null);
//     startLevel8(playerId)
//       .then((v) => {
//         setSessionId(v.sessionId); sessionRef.current = v.sessionId;
//         moveLight(v.start.x, v.start.y);
//         dragStart.current = { x: v.start.x, y: v.start.y };
//         setSeen(null);
//         setView(v);
//         if (setHints && typeof v.hints === 'number') setHints(v.hints);
//       })
//       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
//   }, [playerId]); // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     load();
//     return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
//   }, [load]);

//   useEffect(() => {
//     if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
//   }, [result]);

//   // the server said the parrot was tapped: lights on, parrot jumps
//   const onFound = (r: Level8Result) => {
//     if (doneRef.current) return;
//     play('correct'); // CORRECT sound: parrot found
//     doneRef.current = true;
//     setDone(true);
//     setSeen(null);
//     setClueOpen(false);
//     if (r.parrot) setParrot({ x: r.parrot.x, y: r.parrot.y });
//     if (setHints && typeof r.hints === 'number') setHints(r.hints);
//     Animated.timing(reveal, { toValue: 0, duration: 700, useNativeDriver: true }).start();
//     Animated.sequence([
//       Animated.timing(flap, { toValue: 1.35, duration: 180, useNativeDriver: true }),
//       Animated.timing(flap, { toValue: 1, duration: 180, useNativeDriver: true }),
//       Animated.timing(flap, { toValue: 1.25, duration: 180, useNativeDriver: true }),
//       Animated.timing(flap, { toValue: 1, duration: 180, useNativeDriver: true }),
//     ]).start();
//     later(() => setResult(r), 1600);
//   };

//   // 2. send where the spotlight is; the backend says if the parrot is inside it (`seen`).
//   //    Only one request at a time - the newest position waits in `pending`.
//   const pump = async () => {
//     if (inflight.current || doneRef.current) return;
//     const p = pending.current;
//     const sid = sessionRef.current;
//     if (!p || !sid) return;
//     pending.current = null;
//     inflight.current = true;
//     try {
//       const r = await lookLevel8({ sessionId: sid, playerId, x: p.x, y: p.y });
//       if (r.found) onFound(r); else setSeen(r.seen || null);
//     } catch (e: any) {
//       flash(e.message || 'Network error');
//     } finally {
//       inflight.current = false;
//       if (pending.current && !doneRef.current) pump();
//     }
//   };
//   const queueLook = (x: number, y: number) => {
//     pending.current = { x: Math.round(x), y: Math.round(y) };
//     pump();
//   };
//   const queueRef = useRef(queueLook);
//   queueRef.current = queueLook;

//   // 3. the player TAPPED the room: found only if the tap is on the parrot
//   const doTap = async (x: number, y: number) => {
//     const sid = sessionRef.current;
//     if (!sid || doneRef.current) return;
//     try {
//       const r = await lookLevel8({ sessionId: sid, playerId, x: Math.round(x), y: Math.round(y), tap: true });
//       if (r.found) onFound(r); // CORRECT sound plays inside onFound
//       else play('wrong'); // WRONG sound: tapped, but the parrot is not there
//     } catch (e: any) {
//       flash(e.message || 'Network error');
//     }
//   };
//   const tapRef = useRef(doTap);
//   tapRef.current = doTap;

//   // drag anywhere on the room: the spotlight moves the same way as the finger
//   const pan = useRef(PanResponder.create({
//     onStartShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
//     onMoveShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
//     onPanResponderTerminationRequest: () => false,
//     onPanResponderGrant: () => {
//       dragSoundPlayed.current = false;
//       dragStart.current = { ...lightRef.current };
//       setConfirmSkip(false);
//     },
//     onPanResponderMove: (_e, g) => {
//       if (doneRef.current) return;
//       if (!dragSoundPlayed.current && Math.hypot(g.dx, g.dy) >= 8) {
//         play('drag');
//         dragSoundPlayed.current = true;
//       }
//       const nx = clamp(dragStart.current.x + g.dx / kRef.current, 0, SCENE_W);
//       const ny = clamp(dragStart.current.y + g.dy / kRef.current, 0, SCENE_H);
//       moveLight(nx, ny);
//       const now = Date.now();
//       const s = lastSent.current;
//       if (now - s.t >= 200 && Math.hypot(nx - s.x, ny - s.y) >= 5) {
//         lastSent.current = { x: nx, y: ny, t: now };
//         queueRef.current(nx, ny);
//       }
//     },
//     onPanResponderRelease: (e, g) => {
//       if (doneRef.current) return;
//       if (Math.hypot(g.dx, g.dy) < 8) { // a tap, not a drag
//         // no 'tap' sound here: the server answer decides 'correct' or 'wrong'
//         tapRef.current(e.nativeEvent.locationX / kRef.current, e.nativeEvent.locationY / kRef.current);
//         return;
//       }
//       if (!dragSoundPlayed.current) play('drag');
//       const p = lightRef.current;
//       lastSent.current = { x: p.x, y: p.y, t: Date.now() };
//       queueRef.current(p.x, p.y);
//     },
//     onPanResponderTerminate: () => {
//       if (doneRef.current) return;
//       const p = lightRef.current;
//       queueRef.current(p.x, p.y);
//     },
//   })).current;

//   // magnifier: show the clue directly (free, no hints / coins / video needed)
//   const onHint = () => {
//     if (done) return;
//     play('clue'); // CLUE sound
//     setConfirmSkip(false);
//     setClueOpen(true);
//   };

//   // video reward (+75 hints) - only adds hints, never opens the clue
//   const onReward = async () => {
//     if (done) return;
//     play('btn');
//     setConfirmSkip(false);
//     try {
//       const r = await rewardLevel8(playerId);
//       setHints && setHints(r.hints);
//       flash('+' + r.added + ' hints');
//     } catch (e: any) {
//       flash(e.message || 'Network error');
//     }
//   };

//   // skip (50 hints): tap twice
//   const onSkip = async () => {
//     if (done || !sessionId) return;
//     play('btn');
//     if (!confirmSkip) {
//       setConfirmSkip(true);
//       flash('Skip costs 50 hints. Tap again to skip.');
//       return;
//     }
//     try {
//       const r = await skipLevel8({ sessionId, playerId });
//       setHints && setHints(r.hints || 0);
//       doneRef.current = true;
//       onComplete ? onComplete(r) : onExit();
//     } catch (e: any) {
//       setConfirmSkip(false);
//       play('wrong'); // WRONG sound: not enough hints
//       flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
//     }
//   };

//   /* ---------- header (same as Level 4 - 7) ---------- */
//   const header = (
//     <View style={st.topBar}>
//       <View style={st.leftBtns}>
//         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
//           <Icon n="home" s={20} />
//         </TouchableOpacity>
//         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
//           <Icon n="gear" s={21} />
//         </TouchableOpacity>
//       </View>

//       <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
//         <Chain h={30} style={{ left: 24, top: -6 }} />
//         <Chain h={30} style={{ right: 24, top: -6 }} />
//         <View style={st.sign}>
//           <Text style={st.signArrow}>{'<'}</Text>
//           <Text style={st.signT}>LEVEL 8</Text>
//           <Text style={st.signArrow}>{'>'}</Text>
//         </View>
//       </Animated.View>

//       <View style={st.pillWrap}>
//         <View style={st.pill}>
//           <Text style={st.pillT}>{hints}</Text>
//         </View>
//         <View style={st.pillIcon}>
//           <Icon n="bulb" s={34} />
//         </View>
//       </View>
//     </View>
//   );

//   /* ---------- loading / error ---------- */
//   if (loadErr || !view) {
//     return (
//       <Stage bg={SKY}>
//         <View style={st.root}>
//           <Garden />
//           {header}
//           <View style={st.centerMsg}>
//             {loadErr ? (
//               <>
//                 <Text style={st.err}>{loadErr}</Text>
//                 <TouchableOpacity style={st.retry} onPress={() => { play('btn'); load(); }}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
//                 <TouchableOpacity onPress={() => { play('btn'); onExit(); }}><Text style={st.back}>Back</Text></TouchableOpacity>
//               </>
//             ) : (
//               <>
//                 <ActivityIndicator size="large" color="#fff" />
//                 <Text style={st.load}>Loading level 8...</Text>
//               </>
//             )}
//           </View>
//         </View>
//       </Stage>
//     );
//   }

//   const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'grab' } : {};
//   const pw = 24 * k; // parrot width in pixels

//   return (
//     <Stage bg={SKY}>
//       <View style={st.root}>
//         <Garden />
//         {header}

//         <View style={st.center}>
//           {/* question pill */}
//           <View style={st.qPill}>
//             <Text style={st.qArrow}>{'<'}</Text>
//             <Text style={[st.q, msg ? { color: '#c0392b' } : null]}>{msg || (seen ? 'I can see it! Tap the parrot!' : view.title)}</Text>
//             <Text style={st.qArrow}>{'>'}</Text>
//           </View>

//           {/* the dark room: drag to move the spotlight, tap the parrot when you see it */}
//           <View style={{ width: RW, height: RH, marginTop: 12 }}>
//             <View style={st.panelFrame}>
//               <Room w={IW} />

//               {/* the parrot while it is inside the light: things in front of it hide part of it */}
//               {!!seen && !parrot && (
//                 <View pointerEvents="none" style={{ position: 'absolute', left: (seen.x - 12) * k, top: (seen.y - 17) * k }}>
//                   <Parrot w={pw} />
//                 </View>
//               )}

//               {/* curtain, sofa, plant, basket, books... drawn over the parrot */}
//               <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0 }}>
//                 <RoomFront w={IW} />
//               </View>

//               {/* once found, the parrot jumps in front of everything */}
//               {!!parrot && (
//                 <Animated.View pointerEvents="none"
//                   style={{ position: 'absolute', left: (parrot.x - 12) * k, top: (parrot.y - 17) * k, transform: [{ scale: flap }] }}>
//                   <Parrot w={pw} />
//                 </Animated.View>
//               )}

//               <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, opacity: reveal }}>
//                 <Darkness w={IW} x={light.x} y={light.y} r={view.lightR} />
//               </Animated.View>

//               <View {...pan.panHandlers} style={[StyleSheet.absoluteFill, webTouch]} />
//             </View>
//           </View>
//         </View>

//         {/* bottom wooden panel (same as Level 3 - 7) */}
//         <View style={st.panel}>
//           <View style={[st.plank, { top: 18, left: 34, right: 34 }]} />
//           <View style={[st.plank, { top: 76, left: 26, right: 26 }]} />
//           <View style={[st.plank, { bottom: 16, left: 34, right: 34 }]} />
//           <View style={[st.screw, { left: 16, top: 16 }]} />
//           <View style={[st.screw, { right: 16, top: 16 }]} />
//           <View style={[st.screw, { left: 16, bottom: 16 }]} />
//           <View style={[st.screw, { right: 16, bottom: 16 }]} />

//           <View style={st.btnCol}>
//             <TouchableOpacity style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={onHint}>
//               <Icon n="search" s={40} />
//             </TouchableOpacity>
//             <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
//           </View>

//           <View style={st.btnCol}>
//             <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onReward}>
//               <Icon n="film" s={46} />
//             </TouchableOpacity>
//             <View style={st.badge}><Coin s={15} /><Text style={st.badgeT}>+75</Text></View>
//           </View>

//           <View style={st.btnCol}>
//             <TouchableOpacity style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onSkip}>
//               <DoubleArrow s={42} />
//             </TouchableOpacity>
//             <View style={st.badge}><Icon n="bulb" s={19} /><Text style={st.badgeT}>50</Text></View>
//           </View>
//         </View>

//         {/* CLUES popup (only from the magnifier, ONE clue) */}
//         {clueOpen && (
//           <View style={st.overlay}>
//             <View style={st.clueCard}>
//               <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
//                 <Icon n="cross" s={20} />
//               </TouchableOpacity>
//               <Text style={st.clueTitle}>CLUES</Text>

//               <View style={[st.clueRow, st.clueRowOpen]}>
//                 <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={st.clueHead}>Clue 1</Text>
//                   <Text style={st.clueBody}>{CLUE_1}</Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* result card */}
//         {!!result && (
//           <View style={st.overlay}>
//             <Animated.View style={[st.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
//               <Text style={st.cardTitle}>Level complete!</Text>
//               <Text style={st.cardMsg}>{result.message}</Text>
//               <View style={st.stars}>{[1, 2, 3].map((n) => <BigStar key={n} s={46} on={n <= (result.stars || 0)} />)}</View>
//               <Text style={st.cardScore}>Score {result.score}</Text>
//               <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={() => { play('btn'); onComplete ? onComplete(result) : onExit(); }}>
//                 <Text style={st.nextT}>NEXT</Text>
//               </TouchableOpacity>
//             </Animated.View>
//           </View>
//         )}
//       </View>
//     </Stage>
//   );
// }

// /* =========================================================
//    STYLES  (garden theme, same as Level 5)
// ========================================================= */

// const st = StyleSheet.create({
//   root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

//   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 14 },
//   leftBtns: { flexDirection: 'row', gap: 8 },
//   woodBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: YEL_BTN, borderWidth: 2.5, borderColor: YEL_BTN_D, alignItems: 'center', justifyContent: 'center', elevation: 3 },
//   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
//   sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 6, backgroundColor: '#bd6b29', borderWidth: 3, borderColor: WOOD_DD, elevation: 3 },
//   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
//   signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
//   pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
//   pill: { height: 32, borderRadius: 16, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 18, paddingRight: 30, elevation: 3 },
//   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
//   pillIcon: { position: 'absolute', right: -6, top: -4 },

//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 170 },
//   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
//   qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, maxWidth: 360, elevation: 3 },
//   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
//   q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

//   // wooden frame around the dark room (border = FW, so the room maths stays correct)
//   panelFrame: { flex: 1, borderWidth: FW, borderColor: WOOD, borderRadius: 18, overflow: 'hidden', backgroundColor: '#000', elevation: 5 },

//   // bottom wooden panel (solid wood, plank lines, corner rivets)
//   panel: {
//     position: 'absolute', left: 14, right: 14, bottom: 18, height: 148, borderRadius: 46,
//     backgroundColor: WOOD, borderWidth: 6, borderColor: WOOD_D,
//     flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 20, elevation: 6,
//   },
//   plank: { position: 'absolute', height: 2.5, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
//   screw: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: WOOD_DD },
//   btnCol: { alignItems: 'center' },
//   circleBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 7, alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 8, minWidth: 76, paddingHorizontal: 12, height: 32, borderRadius: 16, backgroundColor: BADGE },
//   badgeT: { fontFamily: FONT, fontSize: 17, fontWeight: '900', color: '#fff' },

//   clueCard: { width: '86%', maxWidth: 360, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
//   clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
//   closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
//   clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12 },
//   clueRowOpen: { backgroundColor: '#fff', borderColor: GREEN_OK },
//   clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
//   clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
//   clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
//   clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },

//   overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
//   card: { width: '82%', alignItems: 'center', backgroundColor: CREAM, borderWidth: 8, borderColor: WOOD_D, borderRadius: 28, padding: 20 },
//   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: NAVY },
//   cardMsg: { fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center', marginTop: 6 },
//   stars: { flexDirection: 'row', gap: 6, marginTop: 14 },
//   cardScore: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#bd6b29', marginTop: 10 },
//   next: { marginTop: 18, minWidth: 170, height: 56, borderRadius: 28, backgroundColor: '#8fe62d', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center' },
//   nextT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },

//   load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
//   err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
//   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
//   retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
//   back: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },
// });
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, PanResponder, Platform, StyleSheet, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Stage, F, Coin } from './BTShared';
import { Icon } from './Art';
import { BigStar } from './Btlevel7art';
import { Room, RoomFront, Parrot, Darkness, SCENE_W, SCENE_H } from './Btlevel8art';
import { startLevel8, lookLevel8, hintLevel8, skipLevel8, rewardLevel8, Level8View, Level8Result } from './Btlevel8api';
import { play, loadSounds } from './BTSound'; // same sounds as Level 5, 6 and 7

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

/* garden palette (same as Level 3 - 7) */
const NAVY = '#13235b';
const SKY = '#5cc0f5';
const CREAM = '#faf0e2';
const CREAM_BORDER = '#ead2a4';
const WOOD = '#eba24e';
const WOOD_D = '#c2782c';
const WOOD_DD = '#8f5a1f';
const LIME = '#a4e02a';
const LIME_RING = '#f4f1dc';
const RED = '#f0434d';
const ARROW = '#ffb629';
const BADGE = '#6b4423';
const GREEN_OK = '#3ec45a';
const YEL_BTN = '#fbc02d';
const YEL_BTN_D = '#d98e1c';

// thickness of the wooden room frame (the room / touch maths uses this)
const FW = 8;

// must match COST_HINT in the backend (the backend is the one that really charges)
const HINT_COST = 25;

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit: () => void;
  onComplete?: (result: Level8Result) => void;
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/* ---------- garden background ---------- */
function Flower({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
      ))}
      <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
    </G>
  );
}

function Tuft({ x, y }: any) {
  return (
    <G transform={`translate(${x} ${y})`} fill="#4fb12c">
      <Polygon points="-14,0 -8,-34 -2,0" />
      <Polygon points="-4,0 4,-44 12,0" />
      <Polygon points="8,0 18,-30 24,0" />
    </G>
  );
}

function Cloud({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
      <Ellipse cx="0" cy="0" rx="70" ry="26" />
      <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
      <Ellipse cx="22" cy="-12" rx="30" ry="22" />
    </G>
  );
}

/* sprout friend (same as Level 3), local coords: body at 0..120 x 55..133 */
function Sprout({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <G fill="#5cb85c">
        <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
        <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
        <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
      </G>
      <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
      <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
      <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
      <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
      <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
      <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </G>
  );
}

function Garden() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* full-height sky (stretches to any screen, so no plain blue strip anywhere) */}
      <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="g4sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g4sky)" />
      </Svg>

      {/* trees + cloud, pinned to the top */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
        <Svg width="100%" height="100%" viewBox="0 0 942 330">
          <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
          <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
          <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
          <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
          <Cloud x={850} y={245} s={1} />
        </Svg>
      </View>

      {/* ground (Level 3 scene), pinned to the bottom: hills, fence, bookshelf, sprout, meadow to the very edge */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
        <Svg width="100%" height="100%" viewBox="0 0 942 1269">
          {/* clouds */}
          <Cloud x={50} y={585} s={0.9} />
          <Cloud x={880} y={600} s={0.6} />

          {/* rolling hills */}
          <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
          <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
          <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

          {/* fence: pickets first, rails in front */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            const x = -10 + i * 90;
            return (
              <G key={i}>
                <Polygon points={`${x},730 ${x + 33},698 ${x + 66},730`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
                <Rect x={x} y="730" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
              </G>
            );
          })}
          <Rect x="0" y="760" width="942" height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
          <Rect x="0" y="808" width="942" height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

          {/* bookshelf (right) with potted plant */}
          <G>
            <Rect x="845" y="190" width="80" height="18" rx="4" fill="#e8903a" />
            <Polygon points="852,208 918,208 910,250 860,250" fill="#f0a050" />
            <G fill="#4cb04a">
              <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(-28 885 198)" />
              <Ellipse cx="885" cy="140" rx="20" ry="62" fill="#3a9a3c" />
              <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(28 885 198)" />
            </G>
            <Rect x="780" y="250" width="162" height="575" fill="#eaa24f" />
            <Rect x="796" y="266" width="146" height="545" fill="#dc9d4f" />
            <Rect x="780" y="440" width="162" height="16" fill="#f2b866" />
            <Rect x="780" y="630" width="162" height="16" fill="#f2b866" />
            <Rect x="780" y="250" width="162" height="16" fill="#f2b866" />
            <Rect x="810" y="310" width="36" height="130" fill="#2a9d9d" />
            <Rect x="850" y="290" width="34" height="150" fill="#f06ba8" />
            <Rect x="888" y="315" width="40" height="125" fill="#8a63da" />
            <Rect x="805" y="515" width="30" height="115" fill="#e5484d" />
            <Rect x="840" y="490" width="24" height="140" fill="#3b82e0" />
            <Rect x="868" y="510" width="38" height="120" fill="#4caf50" />
            <Rect x="810" y="695" width="34" height="120" fill="#f5c518" />
            <Rect x="848" y="665" width="40" height="150" fill="#2c6fdc" />
          </G>

          {/* sprout friend (left) */}
          <Sprout x={10} y={740} s={1} />

          {/* front meadow, runs to the bottom edge */}
          <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
          <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

          {/* stones */}
          <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
          <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
          <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
          <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

          {/* grass tufts + flowers */}
          <Tuft x="905" y="925" /><Tuft x="910" y="1050" /><Tuft x="20" y="1040" />
          <Tuft x="100" y="1260" /><Tuft x="340" y="1260" /><Tuft x="580" y="1260" /><Tuft x="820" y="1260" />
          <Flower x="885" y="815" s={0.8} />
          <Flower x="200" y="1225" s={0.95} />
          <Flower x="735" y="1225" s={0.95} />
        </Svg>
      </View>
    </View>
  );
}

/* ---------- thin link chain for the hanging sign (same as Level 3) ---------- */
function Chain({ h = 28, style }: { h?: number; style?: any }) {
  const n = Math.max(2, Math.round(h / 8));
  return (
    <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
      {Array.from({ length: n }).map((_, i) => (
        <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
      ))}
    </Svg>
  );
}

/* ---------- double arrow (skip icon, same as Level 3) ---------- */
function DoubleArrow({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
      <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
    </Svg>
  );
}

export default function BTLevel8Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
  const { width, height } = useWindowDimensions();
  const RW = Math.max(240, Math.min(width - 36, 340, ((height - 420) * SCENE_W) / SCENE_H)); // frame width
  const IW = RW - 2 * FW; // room width inside the wooden frame
  const k = IW / SCENE_W; // scene units -> pixels
  const RH = SCENE_H * k + 2 * FW;

  const [view, setView] = useState<Level8View | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const [light, setLight] = useState({ x: 150, y: 200 });
  const [parrot, setParrot] = useState<{ x: number; y: number } | null>(null); // set once found
  const [seen, setSeen] = useState<{ x: number; y: number } | null>(null); // parrot inside the light: tap it
  const [result, setResult] = useState<Level8Result | null>(null);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [clueOpen, setClueOpen] = useState(false);
  const [clueUsed, setClueUsed] = useState(false); // the backend says the clue was already bought
  const [clueText, setClueText] = useState('');    // clue text comes from the backend

  const reveal = useRef(new Animated.Value(1)).current; // 1 = dark, 0 = lights on
  const flap = useRef(new Animated.Value(1)).current;
  const pop = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  const lightRef = useRef({ x: 150, y: 200 });
  const dragStart = useRef({ x: 150, y: 200 });
  const dragSoundPlayed = useRef(false);
  const lastSent = useRef({ x: -999, y: -999, t: 0 });
  const pending = useRef<{ x: number; y: number } | null>(null);
  const inflight = useRef(false);
  const doneRef = useRef(false);
  const sessionRef = useRef<number | null>(null);
  const kRef = useRef(k);
  kRef.current = k;
  const timers = useRef<any[]>([]);
  const msgTimer = useRef<any>(null);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  // hanging sign sways gently (same as Level 3 - 7)
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [sway]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

  const moveLight = (x: number, y: number) => {
    lightRef.current = { x, y };
    setLight({ x, y });
  };

  const flash = (m: string) => {
    setMsg(m); clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 2800);
  };

  // preload all sounds (clue / correct / wrong ...) so the first play has no delay
  useEffect(() => {
    loadSounds().catch(() => {});
  }, []);

  // 1. open the level - the backend makes a NEW game, hides the parrot in a random place
  const load = useCallback(() => {
    setLoadErr(''); setView(null);
    startLevel8(playerId)
      .then((v) => {
        setSessionId(v.sessionId); sessionRef.current = v.sessionId;
        moveLight(v.start.x, v.start.y);
        dragStart.current = { x: v.start.x, y: v.start.y };
        setSeen(null);
        setClueUsed(!!v.clueUsed);
        setClueText('');
        setView(v);
        if (setHints && typeof v.hints === 'number') setHints(v.hints);
      })
      .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
  }, [playerId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
    return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
  }, [load]);

  useEffect(() => {
    if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
  }, [result]);

  // the server said the parrot was tapped: lights on, parrot jumps
  const onFound = (r: Level8Result) => {
    if (doneRef.current) return;
    play('correct'); // CORRECT sound: parrot found
    doneRef.current = true;
    setDone(true);
    setSeen(null);
    setClueOpen(false);
    if (r.parrot) setParrot({ x: r.parrot.x, y: r.parrot.y });
    if (setHints && typeof r.hints === 'number') setHints(r.hints);
    Animated.timing(reveal, { toValue: 0, duration: 700, useNativeDriver: true }).start();
    Animated.sequence([
      Animated.timing(flap, { toValue: 1.35, duration: 180, useNativeDriver: true }),
      Animated.timing(flap, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(flap, { toValue: 1.25, duration: 180, useNativeDriver: true }),
      Animated.timing(flap, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
    later(() => setResult(r), 1600);
  };

  // 2. send where the spotlight is; the backend says if the parrot is inside it (`seen`).
  //    Only one request at a time - the newest position waits in `pending`.
  const pump = async () => {
    if (inflight.current || doneRef.current) return;
    const p = pending.current;
    const sid = sessionRef.current;
    if (!p || !sid) return;
    pending.current = null;
    inflight.current = true;
    try {
      const r = await lookLevel8({ sessionId: sid, playerId, x: p.x, y: p.y });
      if (r.found) onFound(r); else setSeen(r.seen || null);
    } catch (e: any) {
      flash(e.message || 'Network error');
    } finally {
      inflight.current = false;
      if (pending.current && !doneRef.current) pump();
    }
  };
  const queueLook = (x: number, y: number) => {
    pending.current = { x: Math.round(x), y: Math.round(y) };
    pump();
  };
  const queueRef = useRef(queueLook);
  queueRef.current = queueLook;

  // 3. the player TAPPED the room: found only if the tap is on the parrot
  const doTap = async (x: number, y: number) => {
    const sid = sessionRef.current;
    if (!sid || doneRef.current) return;
    try {
      const r = await lookLevel8({ sessionId: sid, playerId, x: Math.round(x), y: Math.round(y), tap: true });
      if (r.found) onFound(r); // CORRECT sound plays inside onFound
      else play('wrong'); // WRONG sound: tapped, but the parrot is not there
    } catch (e: any) {
      flash(e.message || 'Network error');
    }
  };
  const tapRef = useRef(doTap);
  tapRef.current = doTap;

  // drag anywhere on the room: the spotlight moves the same way as the finger
  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
    onMoveShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => {
      dragSoundPlayed.current = false;
      dragStart.current = { ...lightRef.current };
      setConfirmSkip(false);
    },
    onPanResponderMove: (_e, g) => {
      if (doneRef.current) return;
      if (!dragSoundPlayed.current && Math.hypot(g.dx, g.dy) >= 8) {
        play('drag');
        dragSoundPlayed.current = true;
      }
      const nx = clamp(dragStart.current.x + g.dx / kRef.current, 0, SCENE_W);
      const ny = clamp(dragStart.current.y + g.dy / kRef.current, 0, SCENE_H);
      moveLight(nx, ny);
      const now = Date.now();
      const s = lastSent.current;
      if (now - s.t >= 200 && Math.hypot(nx - s.x, ny - s.y) >= 5) {
        lastSent.current = { x: nx, y: ny, t: now };
        queueRef.current(nx, ny);
      }
    },
    onPanResponderRelease: (e, g) => {
      if (doneRef.current) return;
      if (Math.hypot(g.dx, g.dy) < 8) { // a tap, not a drag
        // no 'tap' sound here: the server answer decides 'correct' or 'wrong'
        tapRef.current(e.nativeEvent.locationX / kRef.current, e.nativeEvent.locationY / kRef.current);
        return;
      }
      if (!dragSoundPlayed.current) play('drag');
      const p = lightRef.current;
      lastSent.current = { x: p.x, y: p.y, t: Date.now() };
      queueRef.current(p.x, p.y);
    },
    onPanResponderTerminate: () => {
      if (doneRef.current) return;
      const p = lightRef.current;
      queueRef.current(p.x, p.y);
    },
  })).current;

  // magnifier: ask the backend. It charges HINT_COST once per game, saves that in the
  // database, and sends the clue text back (free if already bought).
  const onHint = async () => {
    if (done || !sessionId) return;
    setConfirmSkip(false);

    // not bought yet and cannot afford it
    if (!clueUsed && hints < HINT_COST) {
      play('wrong');
      flash(`You need ${HINT_COST} hints. Watch a video to earn more!`);
      return;
    }

    try {
      const r = await hintLevel8({ sessionId, playerId });
      if (!r.alreadyUsed) setHints && setHints(r.hints);
      setClueUsed(true);
      setClueText(r.clue || '');
      play('clue'); // CLUE sound
      setClueOpen(true);
    } catch (e: any) {
      const noFunds = e?.status === 402 || /not enough|payment/i.test(e?.message || '');
      flash(noFunds ? `You need ${HINT_COST} hints. Watch a video to earn more!` : e?.message || 'Network error');
    }
  };

  // video reward (+75 hints) - only adds hints, never opens the clue
  const onReward = async () => {
    if (done) return;
    play('btn');
    setConfirmSkip(false);
    try {
      const r = await rewardLevel8(playerId);
      setHints && setHints(r.hints);
      flash('+' + r.added + ' hints');
    } catch (e: any) {
      flash(e.message || 'Network error');
    }
  };

  // skip (50 hints): tap twice
  const onSkip = async () => {
    if (done || !sessionId) return;
    play('btn');
    if (!confirmSkip) {
      setConfirmSkip(true);
      flash('Skip costs 50 hints. Tap again to skip.');
      return;
    }
    try {
      const r = await skipLevel8({ sessionId, playerId });
      setHints && setHints(r.hints || 0);
      doneRef.current = true;
      onComplete ? onComplete(r) : onExit();
    } catch (e: any) {
      setConfirmSkip(false);
      play('wrong'); // WRONG sound: not enough hints
      flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
    }
  };

  /* ---------- header (same as Level 4 - 7) ---------- */
  const header = (
    <View style={st.topBar}>
      <View style={st.leftBtns}>
        <TouchableOpacity style={st.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
          <Icon n="home" s={20} />
        </TouchableOpacity>
        <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
          <Icon n="gear" s={21} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
        <Chain h={30} style={{ left: 24, top: -6 }} />
        <Chain h={30} style={{ right: 24, top: -6 }} />
        <View style={st.sign}>
          <Text style={st.signArrow}>{'<'}</Text>
          <Text style={st.signT}>LEVEL 8</Text>
          <Text style={st.signArrow}>{'>'}</Text>
        </View>
      </Animated.View>

      <View style={st.pillWrap}>
        <View style={st.pill}>
          <Text style={st.pillT}>{hints}</Text>
        </View>
        <View style={st.pillIcon}>
          <Icon n="bulb" s={34} />
        </View>
      </View>
    </View>
  );

  /* ---------- loading / error ---------- */
  if (loadErr || !view) {
    return (
      <Stage bg={SKY}>
        <View style={st.root}>
          <Garden />
          {header}
          <View style={st.centerMsg}>
            {loadErr ? (
              <>
                <Text style={st.err}>{loadErr}</Text>
                <TouchableOpacity style={st.retry} onPress={() => { play('btn'); load(); }}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { play('btn'); onExit(); }}><Text style={st.back}>Back</Text></TouchableOpacity>
              </>
            ) : (
              <>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={st.load}>Loading level 8...</Text>
              </>
            )}
          </View>
        </View>
      </Stage>
    );
  }

  const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'grab' } : {};
  const pw = 24 * k; // parrot width in pixels

  return (
    <Stage bg={SKY}>
      <View style={st.root}>
        <Garden />
        {header}

        <View style={st.center}>
          {/* question pill (the title text comes from the backend) */}
          <View style={[st.qPill, { maxWidth: Math.min(width - 40, 360) }]}>
            <Text style={st.qArrow}>{'<'}</Text>
            <Text style={[st.q, msg ? { color: '#c0392b' } : null]}>{msg || (seen ? 'I can see it! Tap the parrot!' : view.title)}</Text>
            <Text style={st.qArrow}>{'>'}</Text>
          </View>

          {/* the dark room: drag to move the spotlight, tap the parrot when you see it */}
          <View style={{ width: RW, height: RH, marginTop: 12 }}>
            <View style={st.panelFrame}>
              <Room w={IW} />

              {/* the parrot while it is inside the light: things in front of it hide part of it */}
              {!!seen && !parrot && (
                <View pointerEvents="none" style={{ position: 'absolute', left: (seen.x - 12) * k, top: (seen.y - 17) * k }}>
                  <Parrot w={pw} />
                </View>
              )}

              {/* curtain, sofa, plant, basket, books... drawn over the parrot */}
              <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0 }}>
                <RoomFront w={IW} />
              </View>

              {/* once found, the parrot jumps in front of everything */}
              {!!parrot && (
                <Animated.View pointerEvents="none"
                  style={{ position: 'absolute', left: (parrot.x - 12) * k, top: (parrot.y - 17) * k, transform: [{ scale: flap }] }}>
                  <Parrot w={pw} />
                </Animated.View>
              )}

              <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, opacity: reveal }}>
                <Darkness w={IW} x={light.x} y={light.y} r={view.lightR} />
              </Animated.View>

              <View {...pan.panHandlers} style={[StyleSheet.absoluteFill, webTouch]} />
            </View>
          </View>
        </View>

        {/* bottom wooden panel (same small size as Level 5 - 7) */}
        <View style={st.panel}>
          <View style={[st.plank, { top: 12, left: 30, right: 30 }]} />
          <View style={[st.plank, { top: 58, left: 22, right: 22 }]} />
          <View style={[st.plank, { bottom: 12, left: 30, right: 30 }]} />
          <View style={[st.screw, { left: 13, top: 12 }]} />
          <View style={[st.screw, { right: 13, top: 12 }]} />
          <View style={[st.screw, { left: 13, bottom: 12 }]} />
          <View style={[st.screw, { right: 13, bottom: 12 }]} />

          <View style={st.btnCol}>
            <TouchableOpacity
              style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }, (!clueUsed && hints < HINT_COST) && { opacity: 0.5 }]}
              activeOpacity={0.85} onPress={onHint}
            >
              <Icon n="search" s={31} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>{HINT_COST}</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onReward}>
              <Icon n="film" s={36} />
            </TouchableOpacity>
            <View style={st.badge}><Coin s={12} /><Text style={st.badgeT}>+75</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onSkip}>
              <DoubleArrow s={33} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>50</Text></View>
          </View>
        </View>

        {/* CLUES popup (only from the magnifier, ONE clue, text from the backend) */}
        {clueOpen && (
          <View style={st.overlay}>
            <View style={st.clueCard}>
              <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
                <Icon n="cross" s={20} />
              </TouchableOpacity>
              <Text style={st.clueTitle}>HINTS</Text>

              <View style={[st.clueRow, st.clueRowOpen]}>
                <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={st.clueHead}>Hint 1</Text>
                  <Text style={st.clueBody}>{clueText}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* result card */}
        {!!result && (
          <View style={st.overlay}>
            <Animated.View style={[st.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
              <Text style={st.cardTitle}>Level complete!</Text>
              <Text style={st.cardMsg}>{result.message}</Text>
              <View style={st.stars}>{[1, 2, 3].map((n) => <BigStar key={n} s={46} on={n <= (result.stars || 0)} />)}</View>
              <Text style={st.cardScore}>Score {result.score}</Text>
              <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={() => { play('btn'); onComplete ? onComplete(result) : onExit(); }}>
                <Text style={st.nextT}>NEXT</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </Stage>
  );
}

/* =========================================================
   STYLES  (garden theme, same as Level 5)
========================================================= */

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 14 },
  leftBtns: { flexDirection: 'row', gap: 8 },
  woodBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: YEL_BTN, borderWidth: 2.5, borderColor: YEL_BTN_D, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
  sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 6, backgroundColor: '#bd6b29', borderWidth: 3, borderColor: WOOD_DD, elevation: 3 },
  signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
  pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
  pill: { height: 32, borderRadius: 16, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 18, paddingRight: 30, elevation: 3 },
  pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
  pillIcon: { position: 'absolute', right: -6, top: -4 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 135 },
  centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, elevation: 3 },
  qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
  q: { flexShrink: 1, fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

  // wooden frame around the dark room (border = FW, so the room maths stays correct)
  panelFrame: { flex: 1, borderWidth: FW, borderColor: WOOD, borderRadius: 18, overflow: 'hidden', backgroundColor: '#000', elevation: 5 },

  // bottom wooden panel (small, same as Level 5 - 7)
  panel: {
    position: 'absolute', left: 14, right: 14, bottom: 18, height: 118, borderRadius: 38,
    backgroundColor: WOOD, borderWidth: 5, borderColor: WOOD_D,
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 14, elevation: 6,
  },
  plank: { position: 'absolute', height: 2.5, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
  screw: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: WOOD_DD },
  btnCol: { alignItems: 'center' },
  circleBtn: { width: 62, height: 62, borderRadius: 31, borderWidth: 5, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 5, minWidth: 62, paddingHorizontal: 10, height: 25, borderRadius: 13, backgroundColor: BADGE },
  badgeT: { fontFamily: FONT, fontSize: 14, fontWeight: '900', color: '#fff' },

  clueCard: { width: '86%', maxWidth: 360, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
  clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
  closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12 },
  clueRowOpen: { backgroundColor: '#fff', borderColor: GREEN_OK },
  clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
  clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
  clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
  clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  card: { width: '82%', alignItems: 'center', backgroundColor: CREAM, borderWidth: 8, borderColor: WOOD_D, borderRadius: 28, padding: 20 },
  cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: NAVY },
  cardMsg: { fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center', marginTop: 6 },
  stars: { flexDirection: 'row', gap: 6, marginTop: 14 },
  cardScore: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#bd6b29', marginTop: 10 },
  next: { marginTop: 18, minWidth: 170, height: 56, borderRadius: 28, backgroundColor: '#8fe62d', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center' },
  nextT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },

  load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
  err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
  retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
  retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
  back: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },
});
