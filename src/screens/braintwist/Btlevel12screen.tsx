
// // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // // import {F,INK,Coin} from './BTShared';
// // // import {Icon} from './Art';
// // // import {Backdrop,Room12,Calendar,OBJECTS,CAL,SCENE_W,SCENE_H} from './Btlevel12art';
// // // import {startLevel12,tapLevel12,skipLevel12,rewardLevel12,Level12View,Level12Result,CalendarDate} from './Btlevel12api';

// // // // clue shown in the CLUES popup when the magnifier is tapped
// // // const CLUE_1='Everything seems right at first glance… but is it really where it belongs?';

// // // type Props={
// // //   playerId:number;
// // //   hints?:number;
// // //   setHints?:(n:number)=>void;
// // //   onExit:()=>void;
// // //   onComplete?:(result:Level12Result)=>void;
// // // };

// // // export default function BTLevel12Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // //   const {width}=useWindowDimensions();
// // //   const SW=Math.min(width-24,380);                 // game card width
// // //   const IW=SW-6;                                   // inside the 3px border
// // //   const k=IW/SCENE_W;                              // scene units -> pixels

// // //   const [view,setView]=useState<Level12View|null>(null);
// // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // //   const [loadErr,setLoadErr]=useState('');
// // //   const [msg,setMsg]=useState('');
// // //   const [done,setDone]=useState(false);
// // //   const [date,setDate]=useState<CalendarDate>({weekday:'TUESDAY',month:'OCT',day:1});
// // //   const [confirmSkip,setConfirmSkip]=useState(false);
// // //   const [clueOpen,setClueOpen]=useState(false);

// // //   const flip=useRef(new Animated.Value(1)).current;     // calendar flip (scaleY)
// // //   const shake=useRef(new Animated.Value(0)).current;
// // //   const sway=useRef(new Animated.Value(0)).current;

// // //   const doneRef=useRef(false);
// // //   const busyRef=useRef(false);
// // //   const timers=useRef<any[]>([]);
// // //   const msgTimer=useRef<any>(null);
// // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // //   const flash=(m:string)=>{
// // //     setMsg(m);clearTimeout(msgTimer.current);
// // //     msgTimer.current=setTimeout(()=>setMsg(''),2600);
// // //   };
// // //   const doShake=()=>Animated.sequence([8,-8,5,-5,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// // //   // 1. open the level - the backend makes a new game
// // //   const load=useCallback(()=>{
// // //     setLoadErr('');setView(null);
// // //     startLevel12(playerId)
// // //       .then(v=>{
// // //         doneRef.current=false;busyRef.current=false;
// // //         setDone(false);
// // //         flip.setValue(1);
// // //         setDate(v.calendar);
// // //         setSessionId(v.sessionId);
// // //         setView(v);
// // //         if(setHints&&typeof v.hints==='number')setHints(v.hints);
// // //       })
// // //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// // //   },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

// // //   useEffect(()=>{
// // //     load();
// // //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// // //   },[load]);

// // //   useEffect(()=>{
// // //     const a=Animated.loop(Animated.sequence([
// // //       Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
// // //       Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
// // //     a.start();
// // //     return()=>{a.stop()};
// // //   },[]);

// // //   // 2. the player tapped something: the backend says if it is the right one
// // //   const onTap=async(target:string)=>{
// // //     if(doneRef.current||busyRef.current||!sessionId)return;
// // //     busyRef.current=true;
// // //     setConfirmSkip(false);
// // //     try{
// // //       const r=await tapLevel12({sessionId,playerId,target});
// // //       if(r.correct){
// // //         doneRef.current=true;
// // //         setDone(true);
// // //         if(setHints&&typeof r.hints==='number')setHints(r.hints);
// // //         // the calendar flips over to the new date
// // //         Animated.timing(flip,{toValue:0,duration:170,useNativeDriver:true}).start(()=>{
// // //           if(r.calendar)setDate(r.calendar);
// // //           Animated.spring(flip,{toValue:1,friction:5,tension:90,useNativeDriver:true}).start();
// // //         });
// // //         // no result card: after the calendar flips, go straight on
// // //         later(()=>{onComplete?onComplete(r):onExit()},1600);
// // //       }else{
// // //         doShake();
// // //         flash(r.message||'Not that one. Try again!');
// // //       }
// // //     }catch(e:any){
// // //       flash(e.message||'Network error');
// // //     }finally{
// // //       busyRef.current=false;
// // //     }
// // //   };

// // //   // magnifier: the CLUES popup opens directly (free, no hints or video needed)
// // //   const onHint=()=>{
// // //     if(done)return;
// // //     setConfirmSkip(false);
// // //     setClueOpen(true);
// // //   };

// // //   // video reward (+75 hints)
// // //   const onReward=async()=>{
// // //     if(done)return;
// // //     setConfirmSkip(false);
// // //     try{
// // //       const r=await rewardLevel12(playerId);
// // //       setHints&&setHints(r.hints);
// // //       flash('+'+r.added+' hints');
// // //     }catch(e:any){
// // //       flash(e.message||'Network error');
// // //     }
// // //   };

// // //   // skip (50 hints): tap twice
// // //   const onSkip=async()=>{
// // //     if(done||!sessionId)return;
// // //     if(!confirmSkip){
// // //       setConfirmSkip(true);
// // //       flash('Skip costs 50 hints. Tap again to skip.');
// // //       return;
// // //     }
// // //     try{
// // //       const r=await skipLevel12({sessionId,playerId});
// // //       setHints&&setHints(r.hints||0);
// // //       doneRef.current=true;
// // //       onComplete?onComplete(r):onExit();
// // //     }catch(e:any){
// // //       setConfirmSkip(false);
// // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // //     }
// // //   };

// // //   /* ---------- loading / error ---------- */

// // //   if(loadErr||!view){
// // //     return <View style={s.root}>
// // //       <Backdrop/>
// // //       <View style={s.center}>
// // //         {loadErr?<>
// // //           <Text style={s.err}>{loadErr}</Text>
// // //           <TouchableOpacity style={s.retry} onPress={load}><Text style={s.retryT}>Try again</Text></TouchableOpacity>
// // //           <TouchableOpacity onPress={onExit}><Text style={s.back}>Back</Text></TouchableOpacity>
// // //         </>:<>
// // //           <ActivityIndicator size="large" color="#1b2a5c"/>
// // //           <Text style={s.load}>Loading level 12...</Text>
// // //         </>}
// // //       </View>
// // //     </View>;
// // //   }

// // //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});

// // //   return <View style={s.root}>
// // //     <Backdrop/>

// // //     {/* top bar */}
// // //     <View style={s.top}>
// // //       <View style={s.topL}>
// // //         <TouchableOpacity style={s.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
// // //         <View style={s.round}><Icon n="gear" s={16}/></View>
// // //       </View>
// // //       <Animated.View style={[s.signWrap,{transform:[{rotate:swayR}]}]}>
// // //         <View style={[s.leaf,{left:-14,top:-4,transform:[{rotate:'-30deg'}]}]}/>
// // //         <View style={[s.leaf,{right:-14,top:-4,transform:[{rotate:'30deg'}]}]}/>
// // //         <View style={[s.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[s.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
// // //         <View style={s.sign}>
// // //           <Text style={s.chev}>{'<'}</Text>
// // //           <Text style={s.signt}>LEVEL 12</Text>
// // //           <Text style={s.chev}>{'>'}</Text>
// // //         </View>
// // //       </Animated.View>
// // //       <View style={s.topR}><View style={s.bpill}><Text style={s.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
// // //     </View>

// // //     {/* question */}
// // //     <View style={s.qWrap}>
// // //       <View style={s.qPill}>
// // //         <Text style={s.qChev}>{'<'}</Text>
// // //         <Text style={[s.qText,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// // //         <Text style={s.qChev}>{'>'}</Text>
// // //       </View>
// // //     </View>

// // //     {/* the room: tap the thing that helps her */}
// // //     <Animated.View style={[s.cardWrap,{transform:[{translateX:shake}]}]}>
// // //       <View style={[s.card,{width:SW}]}>
// // //         <Room12 w={IW}/>

// // //         {/* calendar (flips to the new date when the answer is right) */}
// // //         <Animated.View pointerEvents="none"
// // //           style={{position:'absolute',left:CAL.x*k,top:CAL.y*k,transform:[{scaleY:flip}]}}>
// // //           <Calendar w={CAL.w*k} weekday={date.weekday} month={date.month} day={date.day}/>
// // //         </Animated.View>

// // //         {/* tap areas */}
// // //         {OBJECTS.map(o=><Pressable key={o.id} onPress={()=>onTap(o.id)}
// // //           style={{position:'absolute',left:o.x*k,top:o.y*k,width:o.w*k,height:o.h*k}}/>)}
// // //       </View>
// // //     </Animated.View>

// // //     {/* tray with clue / video / skip */}
// // //     <View style={s.tray}>
// // //       <View style={s.acol}>
// // //         <TouchableOpacity style={s.hintBtn} onPress={onHint}><Icon n="search" s={34}/></TouchableOpacity>
// // //       </View>
// // //       <View style={s.acol}>
// // //         <TouchableOpacity style={s.videoBtn} onPress={onReward}><Icon n="film" s={40}/></TouchableOpacity>
// // //       </View>
// // //       <View style={s.acol}>
// // //         <TouchableOpacity style={s.skipBtn} onPress={onSkip}><Icon n="play" s={36}/></TouchableOpacity>
// // //       </View>
// // //     </View>
// // //     <View style={s.labels}>
// // //       <View style={[s.lblPill,{opacity:0}]}><Icon n="bulb" s={14}/><Text style={s.lbl}>25</Text></View>
// // //       <View style={s.lblPill}><Coin s={14}/><Text style={s.lbl}>+75</Text></View>
// // //       <View style={s.lblPill}><Icon n="bulb" s={14}/><Text style={s.lbl}>50</Text></View>
// // //     </View>

// // //     {/* CLUES popup (only from the magnifier) */}
// // //     {clueOpen&&<View style={s.overlay}>
// // //       <View style={s.clueCard}>
// // //         <TouchableOpacity style={s.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
// // //           <Text style={s.closeT}>✕</Text>
// // //         </TouchableOpacity>
// // //         <Text style={s.clueTitle}>CLUES</Text>

// // //         <View style={s.clueRow}>
// // //           <View style={s.clueNum}><Text style={s.clueNumT}>1</Text></View>
// // //           <View style={{flex:1}}>
// // //             <Text style={s.clueHead}>Clue 1</Text>
// // //             <Text style={s.clueBody}>{CLUE_1}</Text>
// // //           </View>
// // //         </View>
// // //       </View>
// // //     </View>}

// // //   </View>;
// // // }

// // // /* =========================================================
// // //    STYLES  (bright room like level 1)
// // // ========================================================= */

// // // const NAVY='#1b2a5c';

// // // const s=StyleSheet.create({
// // //   root:{flex:1,backgroundColor:'#bfe0f7',overflow:'hidden'},
// // //   center:{flex:1,alignItems:'center',justifyContent:'center'},

// // //   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:34,paddingHorizontal:10},
// // //   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
// // //   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
// // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // //   signWrap:{alignItems:'center',paddingTop:14},
// // //   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
// // //   leaf:{position:'absolute',width:26,height:16,borderRadius:10,backgroundColor:'#6fc23e',zIndex:2},
// // //   sign:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#9a5a22',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:12,paddingVertical:6},
// // //   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
// // //   chev:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#ffd84d'},
// // //   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
// // //   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},

// // //   qWrap:{alignItems:'center',marginTop:14,paddingHorizontal:12},
// // //   qPill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#fbf1dd',borderRadius:30,paddingHorizontal:16,paddingVertical:10,maxWidth:'100%'},
// // //   qChev:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#f2a900'},
// // //   qText:{flexShrink:1,fontFamily:F,fontSize:19,fontWeight:'700',color:NAVY,textAlign:'center'},

// // //   cardWrap:{alignItems:'center',marginTop:16},
// // //   card:{borderWidth:3,borderColor:'#d9c9a8',borderRadius:14,overflow:'hidden',backgroundColor:'#ffffff',height:undefined},

// // //   tray:{position:'absolute',left:18,right:18,bottom:62,height:112,borderRadius:56,backgroundColor:'#f8e9cf',flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:8},
// // //   acol:{alignItems:'center'},
// // //   hintBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// // //   videoBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#ffffff',borderWidth:3,borderColor:'#efe6d2',alignItems:'center',justifyContent:'center'},
// // //   skipBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#ffffff',alignItems:'center',justifyContent:'center'},
// // //   labels:{position:'absolute',left:18,right:18,bottom:22,flexDirection:'row',justifyContent:'space-around'},
// // //   lblPill:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'#5b3a1e',borderRadius:14,paddingHorizontal:12,height:28},
// // //   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},

// // //   overlay:{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
// // //   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
// // //   clueTitle:{fontFamily:F,fontSize:28,fontWeight:'900',color:NAVY,textAlign:'center',marginBottom:14},
// // //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:'#ffe08a',borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
// // //   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
// // //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12,backgroundColor:'#fff',borderColor:'#3ec45a'},
// // //   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// // //   clueNumT:{fontFamily:F,fontSize:28,fontWeight:'900',color:'#fff'},
// // //   clueHead:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#c0702b'},
// // //   clueBody:{fontFamily:F,fontSize:16,fontStyle:'italic',color:NAVY,marginTop:2},

// // //   load:{fontFamily:F,fontSize:22,color:NAVY,marginTop:12},
// // //   err:{fontFamily:F,fontSize:18,color:NAVY,textAlign:'center',paddingHorizontal:24},
// // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
// // //   retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
// // //   back:{fontFamily:F,fontSize:16,color:NAVY,marginTop:14,textDecorationLine:'underline'},
// // // });
// // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // import {
// //   View, Text, TouchableOpacity, Pressable, Animated, Easing, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
// // } from 'react-native';
// // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // import { Stage, F, Coin } from './BTShared';
// // import { Icon } from './Art';
// // import { Room12, Calendar, OBJECTS, CAL, SCENE_W } from './Btlevel12art';
// // import { startLevel12, tapLevel12, skipLevel12, rewardLevel12, Level12View, Level12Result, CalendarDate } from './Btlevel12api';
// // import { play } from './BTSound';

// // const FONT: any = F;
// // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// // /* garden palette (same as Level 5 / Level 9) */
// // const NAVY = '#13235b';
// // const SKY = '#5cc0f5';
// // const CREAM = '#faf0e2';
// // const CREAM_BORDER = '#ead2a4';
// // const WOOD = '#eba24e';
// // const WOOD_D = '#c2782c';
// // const WOOD_DD = '#8f5a1f';
// // const LIME = '#a4e02a';
// // const LIME_RING = '#f4f1dc';
// // const RED = '#f0434d';
// // const ARROW = '#ffb629';
// // const BADGE = '#6b4423';
// // const GREEN_OK = '#3ec45a';
// // const YEL_BTN = '#fbc02d';
// // const YEL_BTN_D = '#d98e1c';

// // // clue shown in the CLUES popup when the magnifier is tapped
// // const CLUE_1 = 'Everything seems right at first glance… but is it really where it belongs?';

// // type Props = {
// //   playerId: number;
// //   hints?: number;
// //   setHints?: (n: number) => void;
// //   onExit: () => void;
// //   onComplete?: (result: Level12Result) => void;
// // };

// // /* ---------- garden background (same as Level 9) ---------- */
// // function Flower({ x, y, s = 1 }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// //       {[0, 72, 144, 216, 288].map((a) => (
// //         <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
// //       ))}
// //       <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
// //     </G>
// //   );
// // }

// // function Tuft({ x, y }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
// //       <Polygon points="-14,0 -8,-34 -2,0" />
// //       <Polygon points="-4,0 4,-44 12,0" />
// //       <Polygon points="8,0 18,-30 24,0" />
// //     </G>
// //   );
// // }

// // function Cloud({ x, y, s = 1 }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
// //       <Ellipse cx="0" cy="0" rx="70" ry="26" />
// //       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
// //       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
// //     </G>
// //   );
// // }

// // function Sprout({ x, y, s = 1 }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// //       <G fill="#5cb85c">
// //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
// //         <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
// //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
// //       </G>
// //       <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
// //       <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// //       <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// //       <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
// //       <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
// //       <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// //     </G>
// //   );
// // }

// // function Garden() {
// //   return (
// //     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// //       {/* full-height sky */}
// //       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
// //         <Defs>
// //           <LinearGradient id="g12sky" x1="0" y1="0" x2="0" y2="1">
// //             <Stop offset="0" stopColor="#46b6f3" />
// //             <Stop offset="1" stopColor="#c2e8fb" />
// //           </LinearGradient>
// //         </Defs>
// //         <Rect width="10" height="10" fill="url(#g12sky)" />
// //       </Svg>

// //       {/* trees + cloud, pinned to the top */}
// //       <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
// //         <Svg width="100%" height="100%" viewBox="0 0 942 330">
// //           <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// //           <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// //           <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
// //           <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
// //           <Cloud x={850} y={245} s={1} />
// //         </Svg>
// //       </View>

// //       {/* ground: hills, fence, bookshelf, sprout, meadow */}
// //       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
// //         <Svg width="100%" height="100%" viewBox="0 0 942 1269">
// //           <Cloud x={50} y={585} s={0.9} />
// //           <Cloud x={880} y={600} s={0.6} />

// //           <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
// //           <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
// //           <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

// //           {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
// //             const x = -10 + i * 90;
// //             return (
// //               <G key={i}>
// //                 <Polygon points={`${x},730 ${x + 33},698 ${x + 66},730`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// //                 <Rect x={x} y="730" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// //               </G>
// //             );
// //           })}
// //           <Rect x="0" y="760" width="942" height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
// //           <Rect x="0" y="808" width="942" height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

// //           <G>
// //             <Rect x="845" y="190" width="80" height="18" rx="4" fill="#e8903a" />
// //             <Polygon points="852,208 918,208 910,250 860,250" fill="#f0a050" />
// //             <G fill="#4cb04a">
// //               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(-28 885 198)" />
// //               <Ellipse cx="885" cy="140" rx="20" ry="62" fill="#3a9a3c" />
// //               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(28 885 198)" />
// //             </G>
// //             <Rect x="780" y="250" width="162" height="575" fill="#eaa24f" />
// //             <Rect x="796" y="266" width="146" height="545" fill="#dc9d4f" />
// //             <Rect x="780" y="440" width="162" height="16" fill="#f2b866" />
// //             <Rect x="780" y="630" width="162" height="16" fill="#f2b866" />
// //             <Rect x="780" y="250" width="162" height="16" fill="#f2b866" />
// //             <Rect x="810" y="310" width="36" height="130" fill="#2a9d9d" />
// //             <Rect x="850" y="290" width="34" height="150" fill="#f06ba8" />
// //             <Rect x="888" y="315" width="40" height="125" fill="#8a63da" />
// //             <Rect x="805" y="515" width="30" height="115" fill="#e5484d" />
// //             <Rect x="840" y="490" width="24" height="140" fill="#3b82e0" />
// //             <Rect x="868" y="510" width="38" height="120" fill="#4caf50" />
// //             <Rect x="810" y="695" width="34" height="120" fill="#f5c518" />
// //             <Rect x="848" y="665" width="40" height="150" fill="#2c6fdc" />
// //           </G>

// //           <Sprout x={10} y={740} s={1} />

// //           <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
// //           <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

// //           <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// //           <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
// //           <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// //           <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

// //           <Tuft x="905" y="925" /><Tuft x="910" y="1050" /><Tuft x="20" y="1040" />
// //           <Tuft x="100" y="1260" /><Tuft x="340" y="1260" /><Tuft x="580" y="1260" /><Tuft x="820" y="1260" />
// //           <Flower x="885" y="815" s={0.8} />
// //           <Flower x="200" y="1225" s={0.95} />
// //           <Flower x="735" y="1225" s={0.95} />
// //         </Svg>
// //       </View>
// //     </View>
// //   );
// // }

// // /* ---------- thin link chain for the hanging sign ---------- */
// // function Chain({ h = 28, style }: { h?: number; style?: any }) {
// //   const n = Math.max(2, Math.round(h / 8));
// //   return (
// //     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
// //       {Array.from({ length: n }).map((_, i) => (
// //         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// //       ))}
// //     </Svg>
// //   );
// // }

// // /* ---------- double arrow (skip icon) ---------- */
// // function DoubleArrow({ s }: { s: number }) {
// //   return (
// //     <Svg width={s} height={s} viewBox="0 0 100 100">
// //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// //     </Svg>
// //   );
// // }

// // /* =========================================================
// //    SCREEN
// // ========================================================= */

// // export default function BTLevel12Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
// //   const { width } = useWindowDimensions();
// //   const SW = Math.min(width - 24, 380);            // game card width
// //   const IW = SW - 6;                               // inside the 3px border
// //   const k = IW / SCENE_W;                          // scene units -> pixels

// //   const [view, setView] = useState<Level12View | null>(null);
// //   const [sessionId, setSessionId] = useState<number | null>(null);
// //   const [loadErr, setLoadErr] = useState('');
// //   const [msg, setMsg] = useState('');
// //   const [done, setDone] = useState(false);
// //   const [date, setDate] = useState<CalendarDate>({ weekday: 'TUESDAY', month: 'OCT', day: 1 });
// //   const [confirmSkip, setConfirmSkip] = useState(false);
// //   const [clueOpen, setClueOpen] = useState(false);

// //   const flip = useRef(new Animated.Value(1)).current;     // calendar flip (scaleY)
// //   const shake = useRef(new Animated.Value(0)).current;
// //   const sway = useRef(new Animated.Value(0)).current;

// //   const doneRef = useRef(false);
// //   const busyRef = useRef(false);
// //   const timers = useRef<any[]>([]);
// //   const msgTimer = useRef<any>(null);
// //   const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

// //   const flash = (m: string) => {
// //     setMsg(m); clearTimeout(msgTimer.current);
// //     msgTimer.current = setTimeout(() => setMsg(''), 2600);
// //   };
// //   const doShake = () => Animated.sequence([8, -8, 5, -5, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

// //   // hanging sign sways gently (same as Level 5 / Level 9)
// //   useEffect(() => {
// //     const a = Animated.loop(Animated.sequence([
// //       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //     ]));
// //     a.start();
// //     return () => a.stop();
// //   }, [sway]);
// //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// //   // 1. open the level - the backend makes a new game
// //   const load = useCallback(() => {
// //     setLoadErr(''); setView(null);
// //     startLevel12(playerId)
// //       .then((v) => {
// //         doneRef.current = false; busyRef.current = false;
// //         setDone(false);
// //         flip.setValue(1);
// //         setDate(v.calendar);
// //         setSessionId(v.sessionId);
// //         setView(v);
// //         if (setHints && typeof v.hints === 'number') setHints(v.hints);
// //       })
// //       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
// //   }, [playerId]);                                  // eslint-disable-line react-hooks/exhaustive-deps

// //   useEffect(() => {
// //     load();
// //     return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
// //   }, [load]);

// //   // 2. the player tapped something: the backend says if it is the right one
// //   const onTap = async (target: string) => {
// //     if (doneRef.current || busyRef.current || !sessionId) return;
// //     busyRef.current = true;
// //     setConfirmSkip(false);
// //     play('tap');
// //     try {
// //       const r = await tapLevel12({ sessionId, playerId, target });
// //       if (r.correct) {
// //         play('correct');
// //         doneRef.current = true;
// //         setDone(true);
// //         if (setHints && typeof r.hints === 'number') setHints(r.hints);
// //         // the calendar flips over to the new date
// //         Animated.timing(flip, { toValue: 0, duration: 170, useNativeDriver: true }).start(() => {
// //           if (r.calendar) setDate(r.calendar);
// //           Animated.spring(flip, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }).start();
// //         });
// //         // no result card: after the calendar flips, go straight on
// //         later(() => { onComplete ? onComplete(r) : onExit(); }, 1600);
// //       } else {
// //         play('wrong');
// //         doShake();
// //         flash(r.message || 'Not that one. Try again!');
// //       }
// //     } catch (e: any) {
// //       flash(e.message || 'Network error');
// //     } finally {
// //       busyRef.current = false;
// //     }
// //   };

// //   // magnifier: the CLUES popup opens directly (free, no hints or video needed)
// //   const onHint = () => {
// //     if (done) return;
// //     setConfirmSkip(false);
// //     play('clue');
// //     setClueOpen(true);
// //   };

// //   // video reward (+75 hints)
// //   const onReward = async () => {
// //     if (done) return;
// //     play('btn');
// //     setConfirmSkip(false);
// //     try {
// //       const r = await rewardLevel12(playerId);
// //       setHints && setHints(r.hints);
// //       flash('+' + r.added + ' hints');
// //     } catch (e: any) {
// //       flash(e.message || 'Network error');
// //     }
// //   };

// //   // skip (50 hints): tap twice
// //   const onSkip = async () => {
// //     if (done || !sessionId) return;
// //     play('btn');
// //     if (!confirmSkip) {
// //       setConfirmSkip(true);
// //       flash('Skip costs 50 hints. Tap again to skip.');
// //       return;
// //     }
// //     try {
// //       const r = await skipLevel12({ sessionId, playerId });
// //       setHints && setHints(r.hints || 0);
// //       doneRef.current = true;
// //       onComplete ? onComplete(r) : onExit();
// //     } catch (e: any) {
// //       setConfirmSkip(false);
// //       play('wrong');
// //       flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
// //     }
// //   };

// //   /* ---------- header (same as Level 9) ---------- */
// //   const header = (
// //     <View style={s.topBar}>
// //       <View style={s.leftBtns}>
// //         <TouchableOpacity style={s.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
// //           <Icon n="home" s={20} />
// //         </TouchableOpacity>
// //         <TouchableOpacity style={s.woodBtn} activeOpacity={0.85}>
// //           <Icon n="gear" s={21} />
// //         </TouchableOpacity>
// //       </View>

// //       <Animated.View style={[s.signWrap, { transform: [{ rotate: swayR }] }]}>
// //         <Chain h={30} style={{ left: 24, top: -6 }} />
// //         <Chain h={30} style={{ right: 24, top: -6 }} />
// //         <View style={s.sign}>
// //           <Text style={s.signArrow}>{'<'}</Text>
// //           <Text style={s.signT}>LEVEL 12</Text>
// //           <Text style={s.signArrow}>{'>'}</Text>
// //         </View>
// //       </Animated.View>

// //       <View style={s.pillWrap}>
// //         <View style={s.pill}>
// //           <Text style={s.pillT}>{hints}</Text>
// //         </View>
// //         <View style={s.pillIcon}>
// //           <Icon n="bulb" s={34} />
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   /* ---------- loading / error ---------- */
// //   if (loadErr || !view) {
// //     return (
// //       <Stage bg={SKY}>
// //         <View style={s.root}>
// //           <Garden />
// //           {header}
// //           <View style={s.centerMsg}>
// //             {loadErr ? (
// //               <>
// //                 <Text style={s.err}>{loadErr}</Text>
// //                 <TouchableOpacity style={s.retry} onPress={() => { play('btn'); load(); }}><Text style={s.retryT}>Try again</Text></TouchableOpacity>
// //                 <TouchableOpacity onPress={() => { play('btn'); onExit(); }}><Text style={s.back}>Back</Text></TouchableOpacity>
// //               </>
// //             ) : (
// //               <>
// //                 <ActivityIndicator size="large" color="#fff" />
// //                 <Text style={s.load}>Loading level 12...</Text>
// //               </>
// //             )}
// //           </View>
// //         </View>
// //       </Stage>
// //     );
// //   }

// //   return (
// //     <Stage bg={SKY}>
// //       <View style={s.root}>
// //         <Garden />
// //         {header}

// //         <View style={s.center}>
// //           {/* question pill */}
// //           <View style={s.qPill}>
// //             <Text style={s.qArrow}>{'<'}</Text>
// //             <Text style={[s.q, msg ? { color: '#c0392b' } : null]}>{msg || view.title}</Text>
// //             <Text style={s.qArrow}>{'>'}</Text>
// //           </View>

// //           {/* the room: tap the thing that helps her */}
// //           <Animated.View style={{ transform: [{ translateX: shake }] }}>
// //             <View style={[s.card, { width: SW }]}>
// //               <Room12 w={IW} />

// //               {/* calendar (flips to the new date when the answer is right) */}
// //               <Animated.View pointerEvents="none"
// //                 style={{ position: 'absolute', left: CAL.x * k, top: CAL.y * k, transform: [{ scaleY: flip }] }}>
// //                 <Calendar w={CAL.w * k} weekday={date.weekday} month={date.month} day={date.day} />
// //               </Animated.View>

// //               {/* tap areas */}
// //               {OBJECTS.map((o) => (
// //                 <Pressable key={o.id} onPress={() => onTap(o.id)}
// //                   style={{ position: 'absolute', left: o.x * k, top: o.y * k, width: o.w * k, height: o.h * k }} />
// //               ))}
// //             </View>
// //           </Animated.View>
// //         </View>

// //         {/* bottom wooden panel (same as Level 9) */}
// //         <View style={s.panel}>
// //           <View style={[s.plank, { top: 18, left: 34, right: 34 }]} />
// //           <View style={[s.plank, { top: 76, left: 26, right: 26 }]} />
// //           <View style={[s.plank, { bottom: 16, left: 34, right: 34 }]} />
// //           <View style={[s.screw, { left: 16, top: 16 }]} />
// //           <View style={[s.screw, { right: 16, top: 16 }]} />
// //           <View style={[s.screw, { left: 16, bottom: 16 }]} />
// //           <View style={[s.screw, { right: 16, bottom: 16 }]} />

// //           <View style={s.btnCol}>
// //             <TouchableOpacity style={[s.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={onHint}>
// //               <Icon n="search" s={40} />
// //             </TouchableOpacity>
// //             <View style={s.badge}><Text style={s.badgeT}>FREE</Text></View>
// //           </View>

// //           <View style={s.btnCol}>
// //             <TouchableOpacity style={[s.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onReward}>
// //               <Icon n="film" s={46} />
// //             </TouchableOpacity>
// //             <View style={s.badge}><Coin s={15} /><Text style={s.badgeT}>+75</Text></View>
// //           </View>

// //           <View style={s.btnCol}>
// //             <TouchableOpacity style={[s.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onSkip}>
// //               <DoubleArrow s={42} />
// //             </TouchableOpacity>
// //             <View style={s.badge}><Icon n="bulb" s={19} /><Text style={s.badgeT}>50</Text></View>
// //           </View>
// //         </View>

// //         {/* CLUES popup (only from the magnifier) */}
// //         {clueOpen && (
// //           <View style={s.overlay}>
// //             <View style={s.clueCard}>
// //               <TouchableOpacity style={s.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
// //                 <Icon n="cross" s={20} />
// //               </TouchableOpacity>
// //               <Text style={s.clueTitle}>HINTS</Text>

// //               <View style={s.clueRow}>
// //                 <View style={s.clueNum}><Text style={s.clueNumT}>1</Text></View>
// //                 <View style={{ flex: 1 }}>
// //                   <Text style={s.clueHead}>Hint 1</Text>
// //                   <Text style={s.clueBody}>{CLUE_1}</Text>
// //                 </View>
// //               </View>
// //             </View>
// //           </View>
// //         )}
// //       </View>
// //     </Stage>
// //   );
// // }

// // /* =========================================================
// //    STYLES (same as Level 9)
// // ========================================================= */

// // const s = StyleSheet.create({
// //   root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

// //   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 14 },
// //   leftBtns: { flexDirection: 'row', gap: 8 },
// //   woodBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: YEL_BTN, borderWidth: 2.5, borderColor: YEL_BTN_D, alignItems: 'center', justifyContent: 'center', elevation: 3 },
// //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
// //   sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 6, backgroundColor: '#bd6b29', borderWidth: 3, borderColor: WOOD_DD, elevation: 3 },
// //   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
// //   signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
// //   pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
// //   pill: { height: 32, borderRadius: 16, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 18, paddingRight: 30, elevation: 3 },
// //   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
// //   pillIcon: { position: 'absolute', right: -6, top: -4 },

// //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 170 },
// //   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
// //   qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, marginBottom: 12, maxWidth: 380, elevation: 3 },
// //   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
// //   q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

// //   card: { borderWidth: 3, borderColor: '#d9c9a8', borderRadius: 14, overflow: 'hidden', backgroundColor: '#ffffff' },

// //   // bottom wooden panel (solid wood, plank lines, corner rivets)
// //   panel: {
// //     position: 'absolute', left: 14, right: 14, bottom: 18, height: 148, borderRadius: 46,
// //     backgroundColor: WOOD, borderWidth: 6, borderColor: WOOD_D,
// //     flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 20, elevation: 6,
// //   },
// //   plank: { position: 'absolute', height: 2.5, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
// //   screw: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: WOOD_DD },
// //   btnCol: { alignItems: 'center' },
// //   circleBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 7, alignItems: 'center', justifyContent: 'center', elevation: 6 },
// //   badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 8, minWidth: 76, paddingHorizontal: 12, height: 32, borderRadius: 16, backgroundColor: BADGE },
// //   badgeT: { fontFamily: FONT, fontSize: 17, fontWeight: '900', color: '#fff' },

// //   clueCard: { width: '86%', maxWidth: 360, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
// //   clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
// //   closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
// //   clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12, backgroundColor: '#fff', borderColor: GREEN_OK },
// //   clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
// //   clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
// //   clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
// //   clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },

// //   overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },

// //   load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
// //   err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
// //   retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
// //   back: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },
// // });
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, Pressable, Animated, Easing, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
// } from 'react-native';
// import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// import { Stage, F, Coin } from './BTShared';
// import { Icon } from './Art';
// import { Room12, Calendar, OBJECTS, CAL, SCENE_W } from './Btlevel12art';
// import { startLevel12, tapLevel12, skipLevel12, rewardLevel12, Level12View, Level12Result, CalendarDate } from './Btlevel12api';
// import { play } from './BTSound';

// const FONT: any = F;
// const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// /* garden palette (same as Level 5 / Level 9) */
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

// // clue shown in the CLUES popup when the magnifier is tapped
// const CLUE_1 = 'Everything seems right at first glance… but is it really where it belongs?';

// type Props = {
//   playerId: number;
//   hints?: number;
//   setHints?: (n: number) => void;
//   onExit: () => void;
//   onComplete?: (result: Level12Result) => void;
// };

// /* ---------- garden background (same as Level 9) ---------- */
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
//       {/* full-height sky */}
//       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
//         <Defs>
//           <LinearGradient id="g12sky" x1="0" y1="0" x2="0" y2="1">
//             <Stop offset="0" stopColor="#46b6f3" />
//             <Stop offset="1" stopColor="#c2e8fb" />
//           </LinearGradient>
//         </Defs>
//         <Rect width="10" height="10" fill="url(#g12sky)" />
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

//       {/* ground: hills, fence, bookshelf, sprout, meadow */}
//       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
//         <Svg width="100%" height="100%" viewBox="0 0 942 1269">
//           <Cloud x={50} y={585} s={0.9} />
//           <Cloud x={880} y={600} s={0.6} />

//           <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
//           <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
//           <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

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

//           <Sprout x={10} y={740} s={1} />

//           <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
//           <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

//           <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
//           <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
//           <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
//           <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

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

// /* ---------- thin link chain for the hanging sign ---------- */
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

// /* ---------- double arrow (skip icon) ---------- */
// function DoubleArrow({ s }: { s: number }) {
//   return (
//     <Svg width={s} height={s} viewBox="0 0 100 100">
//       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
//       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
//     </Svg>
//   );
// }

// /* =========================================================
//    SCREEN
// ========================================================= */

// export default function BTLevel12Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
//   const { width } = useWindowDimensions();
//   const SW = Math.min(width - 24, 380);            // game card width
//   const IW = SW - 6;                               // inside the 3px border
//   const k = IW / SCENE_W;                          // scene units -> pixels

//   const [view, setView] = useState<Level12View | null>(null);
//   const [sessionId, setSessionId] = useState<number | null>(null);
//   const [loadErr, setLoadErr] = useState('');
//   const [msg, setMsg] = useState('');
//   const [done, setDone] = useState(false);
//   const [date, setDate] = useState<CalendarDate>({ weekday: 'TUESDAY', month: 'OCT', day: 1 });
//   const [confirmSkip, setConfirmSkip] = useState(false);
//   const [clueOpen, setClueOpen] = useState(false);

//   const flip = useRef(new Animated.Value(1)).current;     // calendar flip (scaleY)
//   const shake = useRef(new Animated.Value(0)).current;
//   const sway = useRef(new Animated.Value(0)).current;

//   const doneRef = useRef(false);
//   const busyRef = useRef(false);
//   const timers = useRef<any[]>([]);
//   const msgTimer = useRef<any>(null);
//   const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

//   const flash = (m: string) => {
//     setMsg(m); clearTimeout(msgTimer.current);
//     msgTimer.current = setTimeout(() => setMsg(''), 2600);
//   };
//   const doShake = () => Animated.sequence([8, -8, 5, -5, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

//   // hanging sign sways gently (same as Level 5 / Level 9)
//   useEffect(() => {
//     const a = Animated.loop(Animated.sequence([
//       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//     ]));
//     a.start();
//     return () => a.stop();
//   }, [sway]);
//   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

//   // 1. open the level - the backend makes a new game
//   const load = useCallback(() => {
//     setLoadErr(''); setView(null);
//     startLevel12(playerId)
//       .then((v) => {
//         doneRef.current = false; busyRef.current = false;
//         setDone(false);
//         flip.setValue(1);
//         setDate(v.calendar);
//         setSessionId(v.sessionId);
//         setView(v);
//         if (setHints && typeof v.hints === 'number') setHints(v.hints);
//       })
//       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
//   }, [playerId]);                                  // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     load();
//     return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
//   }, [load]);

//   // 2. the player tapped something: the backend says if it is the right one
//   const onTap = async (target: string) => {
//     if (doneRef.current || busyRef.current || !sessionId) return;
//     busyRef.current = true;
//     setConfirmSkip(false);
//     play('tap');
//     try {
//       const r = await tapLevel12({ sessionId, playerId, target });
//       if (r.correct) {
//         play('correct');
//         doneRef.current = true;
//         setDone(true);
//         if (setHints && typeof r.hints === 'number') setHints(r.hints);
//         // the calendar flips over to the new date
//         Animated.timing(flip, { toValue: 0, duration: 170, useNativeDriver: true }).start(() => {
//           if (r.calendar) setDate(r.calendar);
//           Animated.spring(flip, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }).start();
//         });
//         // no result card: after the calendar flips, go straight on
//         later(() => { onComplete ? onComplete(r) : onExit(); }, 1600);
//       } else {
//         play('wrong');
//         doShake();
//         flash(r.message || 'Not that one. Try again!');
//       }
//     } catch (e: any) {
//       flash(e.message || 'Network error');
//     } finally {
//       busyRef.current = false;
//     }
//   };

//   // magnifier: the CLUES popup opens directly (free, no hints or video needed)
//   const onHint = () => {
//     if (done) return;
//     setConfirmSkip(false);
//     play('clue');
//     setClueOpen(true);
//   };

//   // video reward (+75 hints)
//   const onReward = async () => {
//     if (done) return;
//     play('btn');
//     setConfirmSkip(false);
//     try {
//       const r = await rewardLevel12(playerId);
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
//       const r = await skipLevel12({ sessionId, playerId });
//       setHints && setHints(r.hints || 0);
//       doneRef.current = true;
//       onComplete ? onComplete(r) : onExit();
//     } catch (e: any) {
//       setConfirmSkip(false);
//       play('wrong');
//       flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
//     }
//   };

//   /* ---------- header (same as Level 9) ---------- */
//   const header = (
//     <View style={s.topBar}>
//       <View style={s.leftBtns}>
//         <TouchableOpacity style={s.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
//           <Icon n="home" s={20} />
//         </TouchableOpacity>
//         <TouchableOpacity style={s.woodBtn} activeOpacity={0.85}>
//           <Icon n="gear" s={21} />
//         </TouchableOpacity>
//       </View>

//       <Animated.View style={[s.signWrap, { transform: [{ rotate: swayR }] }]}>
//         <Chain h={30} style={{ left: 24, top: -6 }} />
//         <Chain h={30} style={{ right: 24, top: -6 }} />
//         <View style={s.sign}>
//           <Text style={s.signArrow}>{'<'}</Text>
//           <Text style={s.signT}>LEVEL 12</Text>
//           <Text style={s.signArrow}>{'>'}</Text>
//         </View>
//       </Animated.View>

//       <View style={s.pillWrap}>
//         <View style={s.pill}>
//           <Text style={s.pillT}>{hints}</Text>
//         </View>
//         <View style={s.pillIcon}>
//           <Icon n="bulb" s={34} />
//         </View>
//       </View>
//     </View>
//   );

//   /* ---------- loading / error ---------- */
//   if (loadErr || !view) {
//     return (
//       <Stage bg={SKY}>
//         <View style={s.root}>
//           <Garden />
//           {header}
//           <View style={s.centerMsg}>
//             {loadErr ? (
//               <>
//                 <Text style={s.err}>{loadErr}</Text>
//                 <TouchableOpacity style={s.retry} onPress={() => { play('btn'); load(); }}><Text style={s.retryT}>Try again</Text></TouchableOpacity>
//                 <TouchableOpacity onPress={() => { play('btn'); onExit(); }}><Text style={s.back}>Back</Text></TouchableOpacity>
//               </>
//             ) : (
//               <>
//                 <ActivityIndicator size="large" color="#fff" />
//                 <Text style={s.load}>Loading level 12...</Text>
//               </>
//             )}
//           </View>
//         </View>
//       </Stage>
//     );
//   }

//   return (
//     <Stage bg={SKY}>
//       <View style={s.root}>
//         <Garden />
//         {header}

//         <View style={s.center}>
//           {/* question pill */}
//           <View style={s.qPill}>
//             <Text style={s.qArrow}>{'<'}</Text>
//             <Text style={[s.q, msg ? { color: '#c0392b' } : null]}>{msg || view.title}</Text>
//             <Text style={s.qArrow}>{'>'}</Text>
//           </View>

//           {/* the room: tap the thing that helps her */}
//           <Animated.View style={{ transform: [{ translateX: shake }] }}>
//             <View style={[s.card, { width: SW }]}>
//               <Room12 w={IW} />

//               {/* calendar (flips to the new date when the answer is right) */}
//               <Animated.View pointerEvents="none"
//                 style={{ position: 'absolute', left: CAL.x * k, top: CAL.y * k, transform: [{ scaleY: flip }] }}>
//                 <Calendar w={CAL.w * k} weekday={date.weekday} month={date.month} day={date.day} />
//               </Animated.View>

//               {/* tap areas */}
//               {OBJECTS.map((o) => (
//                 <Pressable key={o.id} onPress={() => onTap(o.id)}
//                   style={{ position: 'absolute', left: o.x * k, top: o.y * k, width: o.w * k, height: o.h * k }} />
//               ))}
//             </View>
//           </Animated.View>
//         </View>

//         {/* bottom wooden panel (smaller) */}
//         <View style={s.panel}>
//           <View style={[s.plank, { top: 14, left: 28, right: 28 }]} />
//           <View style={[s.plank, { top: 56, left: 22, right: 22 }]} />
//           <View style={[s.plank, { bottom: 12, left: 28, right: 28 }]} />
//           <View style={[s.screw, { left: 12, top: 12 }]} />
//           <View style={[s.screw, { right: 12, top: 12 }]} />
//           <View style={[s.screw, { left: 12, bottom: 12 }]} />
//           <View style={[s.screw, { right: 12, bottom: 12 }]} />

//           <View style={s.btnCol}>
//             <TouchableOpacity style={[s.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={onHint}>
//               <Icon n="search" s={28} />
//             </TouchableOpacity>
//             <View style={s.badge}><Text style={s.badgeT}>FREE</Text></View>
//           </View>

//           <View style={s.btnCol}>
//             <TouchableOpacity style={[s.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onReward}>
//               <Icon n="film" s={32} />
//             </TouchableOpacity>
//             <View style={s.badge}><Coin s={12} /><Text style={s.badgeT}>+75</Text></View>
//           </View>

//           <View style={s.btnCol}>
//             <TouchableOpacity style={[s.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onSkip}>
//               <DoubleArrow s={30} />
//             </TouchableOpacity>
//             <View style={s.badge}><Icon n="bulb" s={15} /><Text style={s.badgeT}>50</Text></View>
//           </View>
//         </View>

//         {/* CLUES popup (only from the magnifier) */}
//         {clueOpen && (
//           <View style={s.overlay}>
//             <View style={s.clueCard}>
//               <TouchableOpacity style={s.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
//                 <Icon n="cross" s={20} />
//               </TouchableOpacity>
//               <Text style={s.clueTitle}>HINTS</Text>

//               <View style={s.clueRow}>
//                 <View style={s.clueNum}><Text style={s.clueNumT}>1</Text></View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={s.clueHead}>Hint 1</Text>
//                   <Text style={s.clueBody}>{CLUE_1}</Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         )}
//       </View>
//     </Stage>
//   );
// }

// /* =========================================================
//    STYLES (same as Level 9, smaller bottom panel)
// ========================================================= */

// const s = StyleSheet.create({
//   root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

//   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 14 },
//   leftBtns: { flexDirection: 'row', gap: 8 },
//   woodBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: YEL_BTN, borderWidth: 2.5, borderColor: YEL_BTN_D, alignItems: 'center', justifyContent: 'center', elevation: 3 },
//   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
//   sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 6, backgroundColor: '#bd6b29', borderWidth: 3, borderColor: WOOD_DD, elevation: 3 },
//   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
//   signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
//   pillWrap: { position: 'relative', minWidth: 88, height: 36, justifyContent: 'center' },
//   pill: { height: 28, borderRadius: 14, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 14, paddingRight: 26, elevation: 3 },
//   pillT: { fontFamily: FONT, fontSize: 18, fontWeight: '900', color: '#1b1b1b' },
//   pillIcon: { position: 'absolute', right: -5, top: -3 },

//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 135 },
//   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
//   qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, marginBottom: 12, maxWidth: 380, elevation: 3 },
//   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
//   q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

//   card: { borderWidth: 3, borderColor: '#d9c9a8', borderRadius: 14, overflow: 'hidden', backgroundColor: '#ffffff' },

//   // bottom wooden panel (smaller: solid wood, plank lines, corner rivets)
//   panel: {
//     position: 'absolute', left: 14, right: 14, bottom: 14, height: 116, borderRadius: 34,
//     backgroundColor: WOOD, borderWidth: 5, borderColor: WOOD_D,
//     flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 10, elevation: 6,
//   },
//   plank: { position: 'absolute', height: 2, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
//   screw: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: WOOD_DD },
//   btnCol: { alignItems: 'center' },
//   circleBtn: { width: 60, height: 60, borderRadius: 30, borderWidth: 5, alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 5, minWidth: 62, paddingHorizontal: 10, height: 26, borderRadius: 13, backgroundColor: BADGE },
//   badgeT: { fontFamily: FONT, fontSize: 14, fontWeight: '900', color: '#fff' },

//   clueCard: { width: '86%', maxWidth: 360, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
//   clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
//   closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
//   clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12, backgroundColor: '#fff', borderColor: GREEN_OK },
//   clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
//   clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
//   clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
//   clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },

//   overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },

//   load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
//   err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
//   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
//   retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
//   back: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },
// });
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Pressable, Animated, Easing, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Stage, F, Coin } from './BTShared';
import { Icon } from './Art';
import { Room12, Calendar, OBJECTS, CAL, SCENE_W } from './Btlevel12art';
import { startLevel12, tapLevel12, skipLevel12, rewardLevel12, Level12View, Level12Result, CalendarDate } from './Btlevel12api';
import * as mainApi from './api';
import { play } from './BTSound';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

/* garden palette (same as Level 5 / Level 9) */
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

// clue shown in the CLUES popup when the magnifier is tapped
const CLUE_1 = 'Time and dates may hold the answer.';

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit: () => void;
  onComplete?: (result: Level12Result) => void;
};

/* ---------- garden background (same as Level 9) ---------- */
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
      {/* full-height sky */}
      <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="g12sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g12sky)" />
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

      {/* ground: hills, fence, bookshelf, sprout, meadow */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
        <Svg width="100%" height="100%" viewBox="0 0 942 1269">
          <Cloud x={50} y={585} s={0.9} />
          <Cloud x={880} y={600} s={0.6} />

          <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
          <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
          <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

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

          <Sprout x={10} y={740} s={1} />

          <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
          <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

          <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
          <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
          <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
          <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

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

/* ---------- thin link chain for the hanging sign ---------- */
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

/* ---------- double arrow (skip icon) ---------- */
function DoubleArrow({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
      <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
    </Svg>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevel12Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
  const { width } = useWindowDimensions();
  const SW = Math.min(width - 24, 380);            // game card width
  const IW = SW - 6;                               // inside the 3px border
  const k = IW / SCENE_W;                          // scene units -> pixels

  const [view, setView] = useState<Level12View | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const [date, setDate] = useState<CalendarDate>({ weekday: 'TUESDAY', month: 'OCT', day: 1 });
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [clueOpen, setClueOpen] = useState(false);

  const flip = useRef(new Animated.Value(1)).current;     // calendar flip (scaleY)
  const shake = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  const doneRef = useRef(false);
  const busyRef = useRef(false);
  const timers = useRef<any[]>([]);
  const msgTimer = useRef<any>(null);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const flash = (m: string) => {
    setMsg(m); clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 2600);
  };
  const doShake = () => Animated.sequence([8, -8, 5, -5, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

  // hanging sign sways gently (same as Level 5 / Level 9)
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [sway]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

  // 1. open the level - the backend makes a new game
  const load = useCallback(() => {
    setLoadErr(''); setView(null);
    startLevel12(playerId)
      .then((v) => {
        doneRef.current = false; busyRef.current = false;
        setDone(false);
        flip.setValue(1);
        setDate(v.calendar);
        setSessionId(v.sessionId);
        setView(v);
        if (setHints && typeof v.hints === 'number') setHints(v.hints);
      })
      .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
  }, [playerId]);                                  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
    return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
  }, [load]);

  // 2. the player tapped something: the backend says if it is the right one
  const onTap = async (target: string) => {
    if (doneRef.current || busyRef.current || !sessionId) return;
    busyRef.current = true;
    setConfirmSkip(false);
    play('tap');
    try {
      const r = await tapLevel12({ sessionId, playerId, target });
      if (r.correct) {
        play('correct');
        doneRef.current = true;
        setDone(true);
        if (setHints && typeof r.hints === 'number') setHints(r.hints);
        // the calendar flips over to the new date
        Animated.timing(flip, { toValue: 0, duration: 170, useNativeDriver: true }).start(() => {
          if (r.calendar) setDate(r.calendar);
          Animated.spring(flip, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }).start();
        });
        // no result card: after the calendar flips, go straight on
        later(() => { onComplete ? onComplete(r) : onExit(); }, 1600);
      } else {
        play('wrong');
        doShake();
        flash(r.message || 'Not that one. Try again!');
      }
    } catch (e: any) {
      flash(e.message || 'Network error');
    } finally {
      busyRef.current = false;
    }
  };

  // Record the free hint request before showing the clue.
  const onHint = async () => {
    if (done || busyRef.current) return;
    setConfirmSkip(false);
    play('clue');
    busyRef.current = true;
    try {
      const r = await mainApi.recordHintUse(12, playerId);
      if (typeof r.hints === 'number') setHints && setHints(r.hints);
      setClueOpen(true);
    } catch (e: any) {
      flash(e.message || 'Could not load hint');
    } finally {
      busyRef.current = false;
    }
  };

  // video reward (+75 hints)
  const onReward = async () => {
    if (done) return;
    play('btn');
    setConfirmSkip(false);
    try {
      const r = await rewardLevel12(playerId);
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
      const r = await skipLevel12({ sessionId, playerId });
      setHints && setHints(r.hints || 0);
      doneRef.current = true;
      onComplete ? onComplete(r) : onExit();
    } catch (e: any) {
      setConfirmSkip(false);
      play('wrong');
      flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
    }
  };

  /* ---------- header (same as Level 9) ---------- */
  const header = (
    <View style={s.topBar}>
      <View style={s.leftBtns}>
        <TouchableOpacity style={s.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
          <Icon n="home" s={20} />
        </TouchableOpacity>
        <TouchableOpacity style={s.woodBtn} activeOpacity={0.85}>
          <Icon n="gear" s={21} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[s.signWrap, { transform: [{ rotate: swayR }] }]}>
        <Chain h={30} style={{ left: 24, top: -6 }} />
        <Chain h={30} style={{ right: 24, top: -6 }} />
        <View style={s.sign}>
          <Text style={s.signArrow}>{'<'}</Text>
          <Text style={s.signT}>LEVEL 12</Text>
          <Text style={s.signArrow}>{'>'}</Text>
        </View>
      </Animated.View>

      <View style={s.pillWrap}>
        <View style={s.pill}>
          <Text style={s.pillT}>{hints}</Text>
        </View>
        <View style={s.pillIcon}>
          <Icon n="bulb" s={34} />
        </View>
      </View>
    </View>
  );

  /* ---------- loading / error ---------- */
  if (loadErr || !view) {
    return (
      <Stage bg={SKY}>
        <View style={s.root}>
          <Garden />
          {header}
          <View style={s.centerMsg}>
            {loadErr ? (
              <>
                <Text style={s.err}>{loadErr}</Text>
                <TouchableOpacity style={s.retry} onPress={() => { play('btn'); load(); }}><Text style={s.retryT}>Try again</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { play('btn'); onExit(); }}><Text style={s.back}>Back</Text></TouchableOpacity>
              </>
            ) : (
              <>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={s.load}>Loading level 12...</Text>
              </>
            )}
          </View>
        </View>
      </Stage>
    );
  }

  return (
    <Stage bg={SKY}>
      <View style={s.root}>
        <Garden />
        {header}

        <View style={s.center}>
          {/* question pill */}
          <View style={s.qPill}>
            <Text style={s.qArrow}>{'<'}</Text>
            <Text style={[s.q, msg ? { color: '#c0392b' } : null]}>{msg || view.title}</Text>
            <Text style={s.qArrow}>{'>'}</Text>
          </View>

          {/* the room: tap the thing that helps her */}
          <Animated.View style={{ transform: [{ translateX: shake }] }}>
            <View style={[s.card, { width: SW }]}>
              <Room12 w={IW} />

              {/* calendar (flips to the new date when the answer is right) */}
              <Animated.View pointerEvents="none"
                style={{ position: 'absolute', left: CAL.x * k, top: CAL.y * k, transform: [{ scaleY: flip }] }}>
                <Calendar w={CAL.w * k} weekday={date.weekday} month={date.month} day={date.day} />
              </Animated.View>

              {/* tap areas */}
              {OBJECTS.map((o) => (
                <Pressable key={o.id} onPress={() => onTap(o.id)}
                  style={{ position: 'absolute', left: o.x * k, top: o.y * k, width: o.w * k, height: o.h * k }} />
              ))}
            </View>
          </Animated.View>
        </View>

        {/* bottom wooden panel (smaller) */}
        <View style={s.panel}>
          <View style={[s.plank, { top: 14, left: 28, right: 28 }]} />
          <View style={[s.plank, { top: 56, left: 22, right: 22 }]} />
          <View style={[s.plank, { bottom: 12, left: 28, right: 28 }]} />
          <View style={[s.screw, { left: 12, top: 12 }]} />
          <View style={[s.screw, { right: 12, top: 12 }]} />
          <View style={[s.screw, { left: 12, bottom: 12 }]} />
          <View style={[s.screw, { right: 12, bottom: 12 }]} />

          <View style={s.btnCol}>
            <TouchableOpacity style={[s.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={onHint}>
              <Icon n="search" s={28} />
            </TouchableOpacity>
            <View style={s.badge}><Text style={s.badgeT}>FREE</Text></View>
          </View>

          <View style={s.btnCol}>
            <TouchableOpacity style={[s.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onReward}>
              <Icon n="film" s={32} />
            </TouchableOpacity>
            <View style={s.badge}><Coin s={12} /><Text style={s.badgeT}>+75</Text></View>
          </View>

          <View style={s.btnCol}>
            <TouchableOpacity style={[s.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onSkip}>
              <DoubleArrow s={30} />
            </TouchableOpacity>
            <View style={s.badge}><Icon n="bulb" s={15} /><Text style={s.badgeT}>50</Text></View>
          </View>
        </View>

        {/* CLUES popup (only from the magnifier) */}
        {clueOpen && (
          <View style={s.overlay}>
            <View style={s.clueCard}>
              <TouchableOpacity style={s.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
                <Icon n="cross" s={20} />
              </TouchableOpacity>
              <Text style={s.clueTitle}>HINTS</Text>

              <View style={s.clueRow}>
                <View style={s.clueNum}><Text style={s.clueNumT}>1</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.clueHead}>Hint 1</Text>
                  <Text style={s.clueBody}>{CLUE_1}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </Stage>
  );
}

/* =========================================================
   STYLES (same as Level 9, smaller bottom panel)
========================================================= */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 14 },
  leftBtns: { flexDirection: 'row', gap: 8 },
  woodBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: YEL_BTN, borderWidth: 2.5, borderColor: YEL_BTN_D, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
  sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 6, backgroundColor: '#bd6b29', borderWidth: 3, borderColor: WOOD_DD, elevation: 3 },
  signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
  pillWrap: { position: 'relative', minWidth: 88, height: 36, justifyContent: 'center' },
  pill: { height: 28, borderRadius: 14, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 14, paddingRight: 26, elevation: 3 },
  pillT: { fontFamily: FONT, fontSize: 18, fontWeight: '900', color: '#1b1b1b' },
  pillIcon: { position: 'absolute', right: -5, top: -3 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 135 },
  centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, marginBottom: 12, maxWidth: 380, elevation: 3 },
  qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
  q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

  card: { borderWidth: 3, borderColor: '#d9c9a8', borderRadius: 14, overflow: 'hidden', backgroundColor: '#ffffff' },

  // bottom wooden panel (smaller: solid wood, plank lines, corner rivets)
  panel: {
    position: 'absolute', left: 14, right: 14, bottom: 14, height: 116, borderRadius: 34,
    backgroundColor: WOOD, borderWidth: 5, borderColor: WOOD_D,
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 10, elevation: 6,
  },
  plank: { position: 'absolute', height: 2, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
  screw: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: WOOD_DD },
  btnCol: { alignItems: 'center' },
  circleBtn: { width: 60, height: 60, borderRadius: 30, borderWidth: 5, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 5, minWidth: 62, paddingHorizontal: 10, height: 26, borderRadius: 13, backgroundColor: BADGE },
  badgeT: { fontFamily: FONT, fontSize: 14, fontWeight: '900', color: '#fff' },

  clueCard: { width: '86%', maxWidth: 360, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
  clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
  closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12, backgroundColor: '#fff', borderColor: GREEN_OK },
  clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
  clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
  clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
  clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },

  load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
  err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
  retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
  retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
  back: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },
});
