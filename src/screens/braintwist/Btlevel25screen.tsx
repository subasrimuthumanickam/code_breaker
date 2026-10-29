// // // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// // // // import {Stage,Coin} from './BTShared';
// // // // import {Icon} from './Art';
// // // // import {StarIcon} from './Btlevel2art';
// // // // import {RoomBackground,THEME} from './Btlevel4Theme';
// // // // import {startLevel25,sendAction25,skipLevel25,Level25Start,Level25Action} from './Btlevel25api';
// // // // import {Scene,VanArt,NinjaArt,Tick,Cross,SCENE_W,SCENE_H,VAN,NINJA,ZONES,SOLVED_CENTER} from './Btlevel25art';
// // // // import * as api from './api';

// // // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // // // const SKIP_COST=50; // keep in sync with Braintwistlevel25routes.js

// // // // type Props={
// // // //   playerId:number;
// // // //   hints?:number;
// // // //   setHints?:(n:number)=>void;
// // // //   onExit:()=>void;
// // // //   onComplete?:(result:Level25Action)=>void;
// // // // };

// // // // /* the police van: drag it, drop it on a door */
// // // // function DragVan({pan,k,disabled,onDrop}:{pan:Animated.ValueXY;k:number;disabled:boolean;onDrop:(x:number,y:number)=>Promise<boolean>}){
// // // //   const [lift,setLift]=useState(false);
// // // //   const live=useRef({disabled,onDrop});
// // // //   live.current={disabled,onDrop};
// // // //   const back=()=>Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}).start();
// // // //   const pr=useRef(PanResponder.create({
// // // //     onStartShouldSetPanResponder:()=>!live.current.disabled,
// // // //     onPanResponderGrant:()=>{setLift(true);pan.setOffset({x:0,y:0});pan.setValue({x:0,y:0})},
// // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // //     onPanResponderRelease:async(_,g)=>{
// // // //       setLift(false);
// // // //       const ok=await live.current.onDrop(g.moveX,g.moveY);
// // // //       if(!ok)back();
// // // //     },
// // // //     onPanResponderTerminate:()=>{setLift(false);back()},
// // // //   })).current;
// // // //   return <Animated.View {...pr.panHandlers}
// // // //     style={{position:'absolute',left:VAN.x*k,top:VAN.y*k,width:VAN.w*k,height:VAN.h*k,
// // // //       zIndex:lift?60:5,elevation:lift?12:3,
// // // //       transform:[{translateX:pan.x},{translateY:pan.y},{scale:lift?1.08:1}]}}>
// // // //     <VanArt w={VAN.w*k}/>
// // // //   </Animated.View>;
// // // // }

// // // // export default function BTLevel25Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // // //   const {width,height}=useWindowDimensions();
// // // //   const SW=Math.max(240,Math.min(width-24,440,(height-340)*SCENE_W/SCENE_H));  // scene width
// // // //   const k=SW/SCENE_W;                                                           // scene units -> pixels
// // // //   const SH=SCENE_H*k;

// // // //   const [view,setView]=useState<Level25Start|null>(null);
// // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // //   const [loadErr,setLoadErr]=useState('');
// // // //   const [msg,setMsg]=useState('');
// // // //   const [busy,setBusy]=useState(false);
// // // //   const [done,setDone]=useState(false);
// // // //   const [mark,setMark]=useState<{x:number;y:number}|null>(null);
// // // //   const [result,setResult]=useState<Level25Action|null>(null);
// // // //   const [clueOpen,setClueOpen]=useState(false);
// // // //   const [bal,setBal]=useState<number>(Number(hints)||0);

// // // //   const shake=useRef(new Animated.Value(0)).current;
// // // //   const pop=useRef(new Animated.Value(0)).current;
// // // //   const pan=useRef(new Animated.ValueXY()).current;
// // // //   const ninX=useRef(new Animated.Value(0)).current;
// // // //   const ninY=useRef(new Animated.Value(0)).current;
// // // //   const ninO=useRef(new Animated.Value(1)).current;
// // // //   const timers=useRef<any[]>([]);
// // // //   const msgTimer=useRef<any>(null);
// // // //   const actBusy=useRef(false);
// // // //   const zoneL=useRef<View>(null);
// // // //   const zoneR=useRef<View>(null);
// // // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // // //   useEffect(()=>{setBal(Number(hints)||0)},[hints]);
// // // //   const updHints=(h:number)=>{setBal(h);if(setHints)setHints(h)};

// // // //   // 1. open the level - the backend creates or resumes the session
// // // //   const load=useCallback(()=>{
// // // //     setLoadErr('');setView(null);
// // // //     startLevel25(playerId)
// // // //       .then(v=>{
// // // //         setSessionId(v.sessionId);
// // // //         setView(v);
// // // //         if(typeof v.hints==='number')updHints(v.hints);
// // // //       })
// // // //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// // // //   },[playerId]);

// // // //   useEffect(()=>{
// // // //     load();
// // // //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// // // //   },[load]);

// // // //   useEffect(()=>{
// // // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // // //   },[result]);

// // // //   const flash=(m:string)=>{
// // // //     setMsg(m);clearTimeout(msgTimer.current);
// // // //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// // // //   };
// // // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// // // //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// // // //   // right move: the van parks beside the door, then Sahur jumps down and runs away
// // // //   const playWin=()=>{
// // // //     const vc={x:VAN.x+VAN.w/2,y:VAN.y+VAN.h/2};
// // // //     Animated.timing(pan,{toValue:{x:(SOLVED_CENTER.x-vc.x)*k,y:(SOLVED_CENTER.y-vc.y)*k},duration:650,useNativeDriver:false}).start();
// // // //     Animated.sequence([
// // // //       Animated.delay(750),
// // // //       Animated.timing(ninY,{toValue:62*k,duration:350,useNativeDriver:true}),
// // // //       Animated.parallel([
// // // //         Animated.timing(ninX,{toValue:-90*k,duration:700,useNativeDriver:true}),
// // // //         Animated.timing(ninO,{toValue:0,duration:700,useNativeDriver:true}),
// // // //       ]),
// // // //     ]).start();
// // // //   };

// // // //   // 2. send the drop to the backend; the backend decides if it is right
// // // //   const act=async(target:string):Promise<boolean>=>{
// // // //     if(busy||done||!sessionId)return false;
// // // //     setBusy(true);
// // // //     const z=ZONES[target];
// // // //     try{
// // // //       const res=await sendAction25({sessionId,playerId,item:'van',target});
// // // //       if(!res.correct){
// // // //         if(z)setMark({x:(z.x+z.w/2)*k,y:(z.y+z.h/2)*k});
// // // //         doShake();flash(res.message||'Not quite. Try again!');
// // // //         later(()=>setMark(null),700);
// // // //         setBusy(false);
// // // //         return false;
// // // //       }
// // // //       flash(res.message||'Correct!');
// // // //       setDone(true);
// // // //       playWin();
// // // //       later(()=>setResult(res),2000);
// // // //       return true;
// // // //     }catch(e:any){
// // // //       flash(e.message||'Network error');
// // // //       setBusy(false);
// // // //       return false;
// // // //     }
// // // //   };

// // // //   // which door is under the finger when the van is let go?
// // // //   const hit=(ref:React.RefObject<View>,mx:number,my:number)=>new Promise<boolean>(resolve=>{
// // // //     const node:any=ref.current;
// // // //     if(!node||!node.measureInWindow){resolve(false);return}
// // // //     node.measureInWindow((x:number,y:number,w:number,h:number)=>{
// // // //       resolve(mx>=x&&mx<=x+w&&my>=y&&my<=y+h);
// // // //     });
// // // //   });

// // // //   const onDrop=async(mx:number,my:number):Promise<boolean>=>{
// // // //     if(busy||done||!sessionId)return false;
// // // //     if(await hit(zoneL,mx,my))return act('door_left');
// // // //     if(await hit(zoneR,mx,my))return act('door_right');
// // // //     return false;
// // // //   };

// // // //   // magnifier: free clue popup, no hints / coins / video needed
// // // //   const onClue=()=>{if(!done)setClueOpen(true)};

// // // //   const onVideo=async()=>{
// // // //     if(actBusy.current)return;
// // // //     actBusy.current=true;
// // // //     try{
// // // //       const r:any=await api.reward(playerId,'video');
// // // //       if(typeof r?.hints==='number')updHints(r.hints);
// // // //     }catch(e){}
// // // //     finally{actBusy.current=false}
// // // //   };

// // // //   const onSkip=async()=>{
// // // //     if(actBusy.current||busy||done||!sessionId)return;
// // // //     if(bal<SKIP_COST){flash('Need '+SKIP_COST+' hints. You have '+bal+'.');return}
// // // //     actBusy.current=true;
// // // //     try{
// // // //       const r=await skipLevel25({sessionId,playerId});
// // // //       if(typeof r.hints==='number')updHints(r.hints);
// // // //       setDone(true);
// // // //       flash('Skipped!');
// // // //       later(()=>setResult({...r,skipped:true}),900);
// // // //     }catch(e:any){
// // // //       flash(e.message||'Network error');
// // // //     }finally{actBusy.current=false}
// // // //   };

// // // //   /* ---------- header (home, settings, wooden sign, hints pill) ---------- */

// // // //   const header=(
// // // //     <View style={st.topBar}>
// // // //       <View style={st.leftBtns}>
// // // //         <TouchableOpacity style={st.roundBtn} activeOpacity={0.85} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
// // // //         <TouchableOpacity style={st.roundBtn} activeOpacity={0.85}><Icon n="gear" s={18}/></TouchableOpacity>
// // // //       </View>

// // // //       <View style={st.signWrap}>
// // // //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// // // //         <View style={st.sign}>
// // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // //           <Text style={st.signT}>LEVEL 25</Text>
// // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // //         </View>
// // // //         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
// // // //         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
// // // //       </View>

// // // //       <View style={st.pill}>
// // // //         <Text style={st.pillT}>{bal}</Text>
// // // //         <Text style={st.pillIcon}>💡</Text>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   /* ---------- loading / error ---------- */

// // // //   if(loadErr||!view){
// // // //     return <Stage bg="#bddaee"><View style={st.root}>
// // // //       <RoomBackground/>
// // // //       {header}
// // // //       <View style={st.centerMsg}>
// // // //         {loadErr?<>
// // // //           <Text style={st.err}>{loadErr}</Text>
// // // //           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // //           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // //         </>:<>
// // // //           <ActivityIndicator size="large" color={THEME.orange}/>
// // // //           <Text style={st.load}>Loading level 25...</Text>
// // // //         </>}
// // // //       </View>
// // // //     </View></Stage>;
// // // //   }

// // // //   const ninja=(
// // // //     <Animated.View pointerEvents="none"
// // // //       style={{position:'absolute',left:NINJA.x*k,top:NINJA.y*k,width:NINJA.w*k,height:NINJA.h*k,opacity:ninO,
// // // //         transform:[{translateX:ninX},{translateY:ninY}]}}>
// // // //       <NinjaArt w={NINJA.w*k}/>
// // // //     </Animated.View>
// // // //   );

// // // //   const zoneBox=(id:string)=>{
// // // //     const z=ZONES[id];
// // // //     return {position:'absolute' as const,left:z.x*k,top:z.y*k,width:z.w*k,height:z.h*k};
// // // //   };

// // // //   return <Stage bg="#bddaee"><View style={st.root}>
// // // //     <RoomBackground/>
// // // //     {header}

// // // //     <View style={st.center}>
// // // //       {/* question pill */}
// // // //       <View style={st.qPill}>
// // // //         <Text style={st.qArrow}>{'<'}</Text>
// // // //         <Text style={[st.q,msg?{color:done?'#2b8a3e':'#c0392b'}:null]}>{msg||view.title}</Text>
// // // //         <Text style={st.qArrow}>{'>'}</Text>
// // // //       </View>

// // // //       {/* the scene */}
// // // //       <Animated.View style={{width:SW,height:SH,marginTop:10,transform:[{translateX:shake}]}}>
// // // //         {/* Sahur sits behind the roof until the level is solved */}
// // // //         {!done&&ninja}
// // // //         <Scene w={SW}/>
// // // //         {/* after the win he jumps down in front of everything */}
// // // //         {done&&ninja}

// // // //         {/* invisible drop zones (the two doors) */}
// // // //         <View ref={zoneL} collapsable={false} pointerEvents="none" style={zoneBox('door_left')}/>
// // // //         <View ref={zoneR} collapsable={false} pointerEvents="none" style={zoneBox('door_right')}/>

// // // //         <DragVan pan={pan} k={k} disabled={busy||done} onDrop={onDrop}/>

// // // //         {done&&<View pointerEvents="none" style={{position:'absolute',left:SW/2-40,top:SH*0.12,zIndex:70}}><Tick s={80}/></View>}
// // // //         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:80}}><Cross/></View>}
// // // //       </Animated.View>
// // // //     </View>

// // // //     {/* bottom rounded panel (same theme as the other levels) */}
// // // //     <View style={st.panel}>
// // // //       <View style={st.btnCol}>
// // // //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onClue}>
// // // //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// // // //         </TouchableOpacity>
// // // //         <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
// // // //       </View>

// // // //       <View style={st.btnCol}>
// // // //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onVideo}>
// // // //           <Icon n="film" s={36}/>
// // // //         </TouchableOpacity>
// // // //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// // // //       </View>

// // // //       <View style={st.btnCol}>
// // // //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
// // // //           <View style={st.circleRed}><Icon n="play" s={30}/></View>
// // // //         </TouchableOpacity>
// // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>{SKIP_COST}</Text></View>
// // // //       </View>
// // // //     </View>

// // // //     {/* CLUES popup (free) */}
// // // //     {clueOpen&&<View style={st.overlay}>
// // // //       <View style={st.clueCard}>
// // // //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
// // // //           <Text style={st.closeT}>✕</Text>
// // // //         </TouchableOpacity>
// // // //         <Text style={st.clueTitle}>CLUES</Text>
// // // //         <View style={[st.clueRow,st.clueRowOpen]}>
// // // //           <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
// // // //           <View style={{flex:1}}>
// // // //             <Text style={st.clueHead}>Clue 1</Text>
// // // //             <Text style={st.clueBody}>{view.clue}</Text>
// // // //           </View>
// // // //         </View>
// // // //       </View>
// // // //     </View>}

// // // //     {/* result card */}
// // // //     {!!result&&<View style={st.overlay}>
// // // //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // // //         <Text style={st.cardTitle}>Level complete!</Text>
// // // //         <Text style={st.cardMsg}>{result.message}</Text>
// // // //         <View style={st.stars}>{[1,2,3].map(n=><StarIcon key={n} size={46} on={n<=(result.stars||0)}/>)}</View>
// // // //         {!result.skipped&&<Text style={st.cardScore}>Score {result.score}</Text>}
// // // //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // // //           <Text style={st.nextT}>NEXT</Text>
// // // //         </TouchableOpacity>
// // // //       </Animated.View>
// // // //     </View>}
// // // //   </View></Stage>;
// // // // }

// // // // /* =========================================================
// // // //    STYLES  (same cozy room theme as Level 1 / 5 / 6 / 7)
// // // //    No pencil / eraser on this screen.
// // // // ========================================================= */

// // // // const st=StyleSheet.create({
// // // //   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

// // // //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// // // //   leftBtns:{flexDirection:'row',gap:8},
// // // //   roundBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
// // // //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// // // //   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
// // // //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:16,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
// // // //   signT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:THEME.cream,letterSpacing:1},
// // // //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// // // //   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
// // // //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
// // // //   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
// // // //   pillIcon:{fontSize:16},

// // // //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// // // //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // // //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,maxWidth:380},
// // // //   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
// // // //   q:{flexShrink:1,fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

// // // //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// // // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// // // //   btnCol:{alignItems:'center'},
// // // //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// // // //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// // // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// // // //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// // // //   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
// // // //   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
// // // //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
// // // //   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
// // // //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
// // // //   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
// // // //   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// // // //   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
// // // //   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
// // // //   clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},

// // // //   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
// // // //   card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
// // // //   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
// // // //   cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
// // // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
// // // //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // //   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

// // // //   load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
// // // //   err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
// // // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
// // // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
// // // //   back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
// // // // });
// // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// // // import {Stage,Coin} from './BTShared';
// // // import {Icon} from './Art';
// // // import {StarIcon} from './Btlevel2art';
// // // import {RoomBackground,THEME} from './Btlevel4Theme';
// // // import {startLevel25,sendAction25,skipLevel25,Level25Start,Level25Action} from './Btlevel25api';
// // // import {Scene,VanArt,NinjaArt,Tick,Cross,SCENE_W,SCENE_H,VAN,NINJA,ZONES} from './Btlevel25art';
// // // import * as api from './api';

// // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // // const SKIP_COST=50; // keep in sync with Braintwistlevel25routes.js

// // // type Props={
// // //   playerId:number;
// // //   hints?:number;
// // //   setHints?:(n:number)=>void;
// // //   onExit:()=>void;
// // //   onComplete?:(result:Level25Action)=>void;
// // // };

// // // /* a simple wooden door (drawn with views, no extra art file needed) */
// // // function DoorArt({w,h}:{w:number;h:number}){
// // //   const bw=Math.max(1.5,w*0.08),knob=Math.max(2.5,w*0.16);
// // //   return <View style={{width:w,height:h,backgroundColor:'#8a5a2c',borderWidth:bw,borderColor:'#3d3552',borderRadius:1.5}}>
// // //     <View style={{position:'absolute',right:w*0.16,top:h*0.48,width:knob,height:knob,borderRadius:knob/2,backgroundColor:'#f3e3c3'}}/>
// // //   </View>;
// // // }

// // // /* a house door: drag it out of the house and drop it beside the police van */
// // // const GRAB=14; // extra touch area around the small door (px)
// // // function DragDoor({id,k,pan,disabled,onDrop}:{id:string;k:number;pan:Animated.ValueXY;disabled:boolean;onDrop:(id:string,x:number,y:number)=>Promise<boolean>}){
// // //   const z=ZONES[id];
// // //   const [lift,setLift]=useState(false);
// // //   const live=useRef({disabled,onDrop});
// // //   live.current={disabled,onDrop};
// // //   const back=()=>Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}).start();
// // //   const pr=useRef(PanResponder.create({
// // //     onStartShouldSetPanResponder:()=>!live.current.disabled,
// // //     onPanResponderGrant:()=>{setLift(true);pan.setOffset({x:0,y:0});pan.setValue({x:0,y:0})},
// // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // //     onPanResponderRelease:async(_,g)=>{
// // //       setLift(false);
// // //       const ok=await live.current.onDrop(id,g.moveX,g.moveY);
// // //       if(!ok)back();
// // //     },
// // //     onPanResponderTerminate:()=>{setLift(false);back()},
// // //   })).current;
// // //   return <>
// // //     {/* the empty doorway left behind when the door is pulled out (also hides the painted door) */}
// // //     <View pointerEvents="none" style={{position:'absolute',left:z.x*k,top:z.y*k,width:z.w*k,height:z.h*k,backgroundColor:'#3b2f2f',zIndex:4}}/>
// // //     <Animated.View {...pr.panHandlers}
// // //       style={{position:'absolute',left:z.x*k-GRAB,top:z.y*k-GRAB,width:z.w*k+GRAB*2,height:z.h*k+GRAB*2,
// // //         alignItems:'center',justifyContent:'center',
// // //         zIndex:lift?60:6,elevation:lift?12:3,
// // //         transform:[{translateX:pan.x},{translateY:pan.y},{scale:lift?1.15:1}]}}>
// // //       <DoorArt w={z.w*k} h={z.h*k}/>
// // //     </Animated.View>
// // //   </>;
// // // }

// // // export default function BTLevel25Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // //   const {width,height}=useWindowDimensions();
// // //   const SW=Math.max(240,Math.min(width-24,440,(height-340)*SCENE_W/SCENE_H));  // scene width
// // //   const k=SW/SCENE_W;                                                           // scene units -> pixels
// // //   const SH=SCENE_H*k;

// // //   const [view,setView]=useState<Level25Start|null>(null);
// // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // //   const [loadErr,setLoadErr]=useState('');
// // //   const [msg,setMsg]=useState('');
// // //   const [busy,setBusy]=useState(false);
// // //   const [done,setDone]=useState(false);
// // //   const [mark,setMark]=useState<{x:number;y:number}|null>(null);
// // //   const [result,setResult]=useState<Level25Action|null>(null);
// // //   const [clueOpen,setClueOpen]=useState(false);
// // //   const [bal,setBal]=useState<number>(Number(hints)||0);

// // //   const shake=useRef(new Animated.Value(0)).current;
// // //   const pop=useRef(new Animated.Value(0)).current;
// // //   const panL=useRef(new Animated.ValueXY()).current;   // left door drag
// // //   const panR=useRef(new Animated.ValueXY()).current;   // right door drag
// // //   const ninX=useRef(new Animated.Value(0)).current;
// // //   const ninY=useRef(new Animated.Value(0)).current;
// // //   const ninO=useRef(new Animated.Value(1)).current;
// // //   const timers=useRef<any[]>([]);
// // //   const msgTimer=useRef<any>(null);
// // //   const actBusy=useRef(false);
// // //   const vanRef=useRef<View>(null);   // the (fixed) police van = the drop target
// // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // //   useEffect(()=>{setBal(Number(hints)||0)},[hints]);
// // //   const updHints=(h:number)=>{setBal(h);if(setHints)setHints(h)};

// // //   // 1. open the level - the backend creates or resumes the session
// // //   const load=useCallback(()=>{
// // //     setLoadErr('');setView(null);
// // //     startLevel25(playerId)
// // //       .then(v=>{
// // //         setSessionId(v.sessionId);
// // //         setView(v);
// // //         if(typeof v.hints==='number')updHints(v.hints);
// // //       })
// // //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// // //   },[playerId]);

// // //   useEffect(()=>{
// // //     load();
// // //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// // //   },[load]);

// // //   useEffect(()=>{
// // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // //   },[result]);

// // //   const flash=(m:string)=>{
// // //     setMsg(m);clearTimeout(msgTimer.current);
// // //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// // //   };
// // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// // //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// // //   // right move: the door settles beside the police van, then Sahur jumps down and runs away
// // //   const playWin=(target:string)=>{
// // //     const z=ZONES[target];
// // //     const p=target==='door_right'?panR:panL;
// // //     const tx=Math.max(0,VAN.x-z.w-8);          // just left of the van
// // //     const ty=VAN.y+VAN.h-z.h;                   // standing on the ground, level with the van
// // //     Animated.timing(p,{toValue:{x:(tx-z.x)*k,y:(ty-z.y)*k},duration:650,useNativeDriver:false}).start();
// // //     Animated.sequence([
// // //       Animated.delay(750),
// // //       Animated.timing(ninY,{toValue:62*k,duration:350,useNativeDriver:true}),
// // //       Animated.parallel([
// // //         Animated.timing(ninX,{toValue:-90*k,duration:700,useNativeDriver:true}),
// // //         Animated.timing(ninO,{toValue:0,duration:700,useNativeDriver:true}),
// // //       ]),
// // //     ]).start();
// // //   };

// // //   // 2. send the drop to the backend; the backend decides if it is right
// // //   const act=async(target:string):Promise<boolean>=>{
// // //     if(busy||done||!sessionId)return false;
// // //     setBusy(true);
// // //     const z=ZONES[target];
// // //     try{
// // //       // backend contract is unchanged: "van" + door id. Door dropped beside the van == van beside that door.
// // //       const res=await sendAction25({sessionId,playerId,item:'van',target});
// // //       if(!res.correct){
// // //         if(z)setMark({x:(z.x+z.w/2)*k,y:(z.y+z.h/2)*k});
// // //         doShake();flash(res.message||'Not quite. Try again!');
// // //         later(()=>setMark(null),700);
// // //         setBusy(false);
// // //         return false;
// // //       }
// // //       flash(res.message||'Correct!');
// // //       setDone(true);
// // //       playWin(target);
// // //       later(()=>setResult(res),2000);
// // //       return true;
// // //     }catch(e:any){
// // //       flash(e.message||'Network error');
// // //       setBusy(false);
// // //       return false;
// // //     }
// // //   };

// // //   // is the finger near the van when the door is let go? (pad = extra forgiving margin in px)
// // //   const hit=(ref:React.RefObject<View>,mx:number,my:number,pad:number)=>new Promise<boolean>(resolve=>{
// // //     const node:any=ref.current;
// // //     if(!node||!node.measureInWindow){resolve(false);return}
// // //     node.measureInWindow((x:number,y:number,w:number,h:number)=>{
// // //       resolve(mx>=x-pad&&mx<=x+w+pad&&my>=y-pad&&my<=y+h+pad);
// // //     });
// // //   });

// // //   const onDrop=async(id:string,mx:number,my:number):Promise<boolean>=>{
// // //     if(busy||done||!sessionId)return false;
// // //     if(await hit(vanRef,mx,my,36))return act(id);
// // //     return false;
// // //   };

// // //   // magnifier: free clue popup, no hints / coins / video needed
// // //   const onClue=()=>{if(!done)setClueOpen(true)};

// // //   const onVideo=async()=>{
// // //     if(actBusy.current)return;
// // //     actBusy.current=true;
// // //     try{
// // //       const r:any=await api.reward(playerId,'video');
// // //       if(typeof r?.hints==='number')updHints(r.hints);
// // //     }catch(e){}
// // //     finally{actBusy.current=false}
// // //   };

// // //   const onSkip=async()=>{
// // //     if(actBusy.current||busy||done||!sessionId)return;
// // //     if(bal<SKIP_COST){flash('Need '+SKIP_COST+' hints. You have '+bal+'.');return}
// // //     actBusy.current=true;
// // //     try{
// // //       const r=await skipLevel25({sessionId,playerId});
// // //       if(typeof r.hints==='number')updHints(r.hints);
// // //       setDone(true);
// // //       flash('Skipped!');
// // //       later(()=>setResult({...r,skipped:true}),900);
// // //     }catch(e:any){
// // //       flash(e.message||'Network error');
// // //     }finally{actBusy.current=false}
// // //   };

// // //   /* ---------- header (home, settings, wooden sign, hints pill) ---------- */

// // //   const header=(
// // //     <View style={st.topBar}>
// // //       <View style={st.leftBtns}>
// // //         <TouchableOpacity style={st.roundBtn} activeOpacity={0.85} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
// // //         <TouchableOpacity style={st.roundBtn} activeOpacity={0.85}><Icon n="gear" s={18}/></TouchableOpacity>
// // //       </View>

// // //       <View style={st.signWrap}>
// // //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// // //         <View style={st.sign}>
// // //           <Text style={st.signArrow}>{'<'}</Text>
// // //           <Text style={st.signT}>LEVEL 25</Text>
// // //           <Text style={st.signArrow}>{'>'}</Text>
// // //         </View>
// // //         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
// // //         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
// // //       </View>

// // //       <View style={st.pill}>
// // //         <Text style={st.pillT}>{bal}</Text>
// // //         <Text style={st.pillIcon}>💡</Text>
// // //       </View>
// // //     </View>
// // //   );

// // //   /* ---------- loading / error ---------- */

// // //   if(loadErr||!view){
// // //     return <Stage bg="#bddaee"><View style={st.root}>
// // //       <RoomBackground/>
// // //       {header}
// // //       <View style={st.centerMsg}>
// // //         {loadErr?<>
// // //           <Text style={st.err}>{loadErr}</Text>
// // //           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // //           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // //         </>:<>
// // //           <ActivityIndicator size="large" color={THEME.orange}/>
// // //           <Text style={st.load}>Loading level 25...</Text>
// // //         </>}
// // //       </View>
// // //     </View></Stage>;
// // //   }

// // //   const ninja=(
// // //     <Animated.View pointerEvents="none"
// // //       style={{position:'absolute',left:NINJA.x*k,top:NINJA.y*k,width:NINJA.w*k,height:NINJA.h*k,opacity:ninO,
// // //         transform:[{translateX:ninX},{translateY:ninY}]}}>
// // //       <NinjaArt w={NINJA.w*k}/>
// // //     </Animated.View>
// // //   );

// // //   return <Stage bg="#bddaee"><View style={st.root}>
// // //     <RoomBackground/>
// // //     {header}

// // //     <View style={st.center}>
// // //       {/* question pill */}
// // //       <View style={st.qPill}>
// // //         <Text style={st.qArrow}>{'<'}</Text>
// // //         <Text style={[st.q,msg?{color:done?'#2b8a3e':'#c0392b'}:null]}>{msg||view.title}</Text>
// // //         <Text style={st.qArrow}>{'>'}</Text>
// // //       </View>

// // //       {/* the scene */}
// // //       <Animated.View style={{width:SW,height:SH,marginTop:10,transform:[{translateX:shake}]}}>
// // //         {/* Sahur sits behind the roof until the level is solved */}
// // //         {!done&&ninja}
// // //         <Scene w={SW}/>
// // //         {/* after the win he jumps down in front of everything */}
// // //         {done&&ninja}

// // //         {/* the police van stays where it is - it is the drop target */}
// // //         <View ref={vanRef} collapsable={false} pointerEvents="none"
// // //           style={{position:'absolute',left:VAN.x*k,top:VAN.y*k,width:VAN.w*k,height:VAN.h*k,zIndex:5}}>
// // //           <VanArt w={VAN.w*k}/>
// // //         </View>

// // //         {/* both house doors can be pulled out and dragged next to the van; the backend says which is right */}
// // //         <DragDoor id="door_left" k={k} pan={panL} disabled={busy||done} onDrop={onDrop}/>
// // //         <DragDoor id="door_right" k={k} pan={panR} disabled={busy||done} onDrop={onDrop}/>

// // //         {done&&<View pointerEvents="none" style={{position:'absolute',left:SW/2-40,top:SH*0.12,zIndex:70}}><Tick s={80}/></View>}
// // //         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:80}}><Cross/></View>}
// // //       </Animated.View>
// // //     </View>

// // //     {/* bottom rounded panel (same theme as the other levels) */}
// // //     <View style={st.panel}>
// // //       <View style={st.btnCol}>
// // //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onClue}>
// // //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// // //         </TouchableOpacity>
// // //         <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
// // //       </View>

// // //       <View style={st.btnCol}>
// // //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onVideo}>
// // //           <Icon n="film" s={36}/>
// // //         </TouchableOpacity>
// // //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// // //       </View>

// // //       <View style={st.btnCol}>
// // //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
// // //           <View style={st.circleRed}><Icon n="play" s={30}/></View>
// // //         </TouchableOpacity>
// // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>{SKIP_COST}</Text></View>
// // //       </View>
// // //     </View>

// // //     {/* CLUES popup (free) */}
// // //     {clueOpen&&<View style={st.overlay}>
// // //       <View style={st.clueCard}>
// // //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
// // //           <Text style={st.closeT}>✕</Text>
// // //         </TouchableOpacity>
// // //         <Text style={st.clueTitle}>CLUES</Text>
// // //         <View style={[st.clueRow,st.clueRowOpen]}>
// // //           <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
// // //           <View style={{flex:1}}>
// // //             <Text style={st.clueHead}>Clue 1</Text>
// // //             <Text style={st.clueBody}>{view.clue}</Text>
// // //           </View>
// // //         </View>
// // //       </View>
// // //     </View>}

// // //     {/* result card */}
// // //     {!!result&&<View style={st.overlay}>
// // //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // //         <Text style={st.cardTitle}>Level complete!</Text>
// // //         <Text style={st.cardMsg}>{result.message}</Text>
// // //         <View style={st.stars}>{[1,2,3].map(n=><StarIcon key={n} size={46} on={n<=(result.stars||0)}/>)}</View>
// // //         {!result.skipped&&<Text style={st.cardScore}>Score {result.score}</Text>}
// // //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // //           <Text style={st.nextT}>NEXT</Text>
// // //         </TouchableOpacity>
// // //       </Animated.View>
// // //     </View>}
// // //   </View></Stage>;
// // // }

// // // /* =========================================================
// // //    STYLES  (same cozy room theme as Level 1 / 5 / 6 / 7)
// // //    No pencil / eraser on this screen.
// // // ========================================================= */

// // // const st=StyleSheet.create({
// // //   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

// // //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// // //   leftBtns:{flexDirection:'row',gap:8},
// // //   roundBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
// // //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// // //   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
// // //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:16,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
// // //   signT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:THEME.cream,letterSpacing:1},
// // //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// // //   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
// // //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
// // //   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
// // //   pillIcon:{fontSize:16},

// // //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// // //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,maxWidth:380},
// // //   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
// // //   q:{flexShrink:1,fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

// // //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// // //   btnCol:{alignItems:'center'},
// // //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// // //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// // //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// // //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// // //   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
// // //   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
// // //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
// // //   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
// // //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
// // //   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
// // //   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// // //   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
// // //   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
// // //   clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},

// // //   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
// // //   card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
// // //   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
// // //   cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
// // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
// // //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // //   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

// // //   load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
// // //   err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
// // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
// // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
// // //   back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
// // // });
// // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// // import {Stage,Coin} from './BTShared';
// // import {Icon} from './Art';
// // import {StarIcon} from './Btlevel2art';
// // import {RoomBackground,THEME} from './Btlevel4Theme';
// // import {startLevel25,sendAction25,skipLevel25,Level25Start,Level25Action} from './Btlevel25api';
// // import {Scene,VanArt,NinjaArt,Tick,Cross,SCENE_W,SCENE_H,VAN,NINJA,ZONES} from './Btlevel25art';
// // import * as api from './api';

// // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // const SKIP_COST=50; // keep in sync with Braintwistlevel25routes.js

// // type Props={
// //   playerId:number;
// //   hints?:number;
// //   setHints?:(n:number)=>void;
// //   onExit:()=>void;
// //   onComplete?:(result:Level25Action)=>void;
// // };

// // /* a simple wooden door (drawn with views, no extra art file needed) */
// // function DoorArt({w,h}:{w:number;h:number}){
// //   const bw=Math.max(1.5,w*0.08),knob=Math.max(2.5,w*0.16);
// //   return <View style={{width:w,height:h,backgroundColor:'#8a5a2c',borderWidth:bw,borderColor:'#3d3552',borderRadius:1.5}}>
// //     <View style={{position:'absolute',right:w*0.16,top:h*0.48,width:knob,height:knob,borderRadius:knob/2,backgroundColor:'#f3e3c3'}}/>
// //   </View>;
// // }

// // /* a house door: drag it out of the house and drop it beside the police van */
// // const GRAB=14; // extra touch area around the small door (px)
// // const DRAG_DOOR='door_left'; // the ONE door that can be pulled out (Sahur's house). If the level says "wrong", change this to 'door_right'.
// // function DragDoor({id,k,pan,disabled,onDrop}:{id:string;k:number;pan:Animated.ValueXY;disabled:boolean;onDrop:(id:string,x:number,y:number)=>Promise<boolean>}){
// //   const z=ZONES[id];
// //   const [lift,setLift]=useState(false);
// //   const live=useRef({disabled,onDrop});
// //   live.current={disabled,onDrop};
// //   const back=()=>Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}).start();
// //   const pr=useRef(PanResponder.create({
// //     onStartShouldSetPanResponder:()=>!live.current.disabled,
// //     onPanResponderGrant:()=>{setLift(true);pan.setOffset({x:0,y:0});pan.setValue({x:0,y:0})},
// //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// //     onPanResponderRelease:async(_,g)=>{
// //       setLift(false);
// //       const ok=await live.current.onDrop(id,g.moveX,g.moveY);
// //       if(!ok)back();
// //     },
// //     onPanResponderTerminate:()=>{setLift(false);back()},
// //   })).current;
// //   return <>
// //     {/* the empty doorway left behind when the door is pulled out (also hides the painted door) */}
// //     <View pointerEvents="none" style={{position:'absolute',left:z.x*k,top:z.y*k,width:z.w*k,height:z.h*k,backgroundColor:'#3b2f2f',zIndex:4}}/>
// //     <Animated.View {...pr.panHandlers}
// //       style={{position:'absolute',left:z.x*k-GRAB,top:z.y*k-GRAB,width:z.w*k+GRAB*2,height:z.h*k+GRAB*2,
// //         alignItems:'center',justifyContent:'center',
// //         zIndex:lift?60:6,elevation:lift?12:3,
// //         transform:[{translateX:pan.x},{translateY:pan.y}]}}>
// //       <DoorArt w={z.w*k} h={z.h*k}/>
// //     </Animated.View>
// //   </>;
// // }

// // export default function BTLevel25Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// //   const {width,height}=useWindowDimensions();
// //   const SW=Math.max(240,Math.min(width-24,440,(height-340)*SCENE_W/SCENE_H));  // scene width
// //   const k=SW/SCENE_W;                                                           // scene units -> pixels
// //   const SH=SCENE_H*k;

// //   const [view,setView]=useState<Level25Start|null>(null);
// //   const [sessionId,setSessionId]=useState<number|null>(null);
// //   const [loadErr,setLoadErr]=useState('');
// //   const [msg,setMsg]=useState('');
// //   const [busy,setBusy]=useState(false);
// //   const [done,setDone]=useState(false);
// //   const [mark,setMark]=useState<{x:number;y:number}|null>(null);
// //   const [result,setResult]=useState<Level25Action|null>(null);
// //   const [clueOpen,setClueOpen]=useState(false);
// //   const [bal,setBal]=useState<number>(Number(hints)||0);

// //   const shake=useRef(new Animated.Value(0)).current;
// //   const pop=useRef(new Animated.Value(0)).current;
// //   const panD=useRef(new Animated.ValueXY()).current;   // the draggable door
// //   const ninX=useRef(new Animated.Value(0)).current;
// //   const ninY=useRef(new Animated.Value(0)).current;
// //   const ninO=useRef(new Animated.Value(1)).current;
// //   const timers=useRef<any[]>([]);
// //   const msgTimer=useRef<any>(null);
// //   const actBusy=useRef(false);
// //   const vanRef=useRef<View>(null);   // the (fixed) police van = the drop target
// //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// //   useEffect(()=>{setBal(Number(hints)||0)},[hints]);
// //   const updHints=(h:number)=>{setBal(h);if(setHints)setHints(h)};

// //   // 1. open the level - the backend creates or resumes the session
// //   const load=useCallback(()=>{
// //     setLoadErr('');setView(null);
// //     startLevel25(playerId)
// //       .then(v=>{
// //         setSessionId(v.sessionId);
// //         setView(v);
// //         if(typeof v.hints==='number')updHints(v.hints);
// //       })
// //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// //   },[playerId]);

// //   useEffect(()=>{
// //     load();
// //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// //   },[load]);

// //   useEffect(()=>{
// //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// //   },[result]);

// //   const flash=(m:string)=>{
// //     setMsg(m);clearTimeout(msgTimer.current);
// //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// //   };
// //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// //   // right move: the door settles beside the police van, then Sahur jumps down and runs away
// //   const playWin=(target:string)=>{
// //     const z=ZONES[target];
// //     const p=panD;
// //     const tx=Math.max(0,VAN.x-z.w-8);          // just left of the van
// //     const ty=VAN.y+VAN.h-z.h;                   // standing on the ground, level with the van
// //     Animated.timing(p,{toValue:{x:(tx-z.x)*k,y:(ty-z.y)*k},duration:650,useNativeDriver:false}).start();
// //     Animated.sequence([
// //       Animated.delay(750),
// //       Animated.timing(ninY,{toValue:62*k,duration:350,useNativeDriver:true}),
// //       Animated.parallel([
// //         Animated.timing(ninX,{toValue:-90*k,duration:700,useNativeDriver:true}),
// //         Animated.timing(ninO,{toValue:0,duration:700,useNativeDriver:true}),
// //       ]),
// //     ]).start();
// //   };

// //   // 2. send the drop to the backend; the backend decides if it is right
// //   const act=async(target:string):Promise<boolean>=>{
// //     if(busy||done||!sessionId)return false;
// //     setBusy(true);
// //     const z=ZONES[target];
// //     try{
// //       // backend contract is unchanged: "van" + door id. Door dropped beside the van == van beside that door.
// //       const res=await sendAction25({sessionId,playerId,item:'van',target});
// //       if(!res.correct){
// //         if(z)setMark({x:(z.x+z.w/2)*k,y:(z.y+z.h/2)*k});
// //         doShake();flash(res.message||'Not quite. Try again!');
// //         later(()=>setMark(null),700);
// //         setBusy(false);
// //         return false;
// //       }
// //       flash(res.message||'Correct!');
// //       setDone(true);
// //       playWin(target);
// //       later(()=>setResult(res),2000);
// //       return true;
// //     }catch(e:any){
// //       flash(e.message||'Network error');
// //       setBusy(false);
// //       return false;
// //     }
// //   };

// //   // is the finger near the van when the door is let go? (pad = extra forgiving margin in px)
// //   const hit=(ref:React.RefObject<View>,mx:number,my:number,pad:number)=>new Promise<boolean>(resolve=>{
// //     const node:any=ref.current;
// //     if(!node||!node.measureInWindow){resolve(false);return}
// //     node.measureInWindow((x:number,y:number,w:number,h:number)=>{
// //       resolve(mx>=x-pad&&mx<=x+w+pad&&my>=y-pad&&my<=y+h+pad);
// //     });
// //   });

// //   const onDrop=async(id:string,mx:number,my:number):Promise<boolean>=>{
// //     if(busy||done||!sessionId)return false;
// //     if(await hit(vanRef,mx,my,36))return act(id);
// //     return false;
// //   };

// //   // magnifier: free clue popup, no hints / coins / video needed
// //   const onClue=()=>{if(!done)setClueOpen(true)};

// //   const onVideo=async()=>{
// //     if(actBusy.current)return;
// //     actBusy.current=true;
// //     try{
// //       const r:any=await api.reward(playerId,'video');
// //       if(typeof r?.hints==='number')updHints(r.hints);
// //     }catch(e){}
// //     finally{actBusy.current=false}
// //   };

// //   const onSkip=async()=>{
// //     if(actBusy.current||busy||done||!sessionId)return;
// //     if(bal<SKIP_COST){flash('Need '+SKIP_COST+' hints. You have '+bal+'.');return}
// //     actBusy.current=true;
// //     try{
// //       const r=await skipLevel25({sessionId,playerId});
// //       if(typeof r.hints==='number')updHints(r.hints);
// //       setDone(true);
// //       flash('Skipped!');
// //       later(()=>setResult({...r,skipped:true}),900);
// //     }catch(e:any){
// //       flash(e.message||'Network error');
// //     }finally{actBusy.current=false}
// //   };

// //   /* ---------- header (home, settings, wooden sign, hints pill) ---------- */

// //   const header=(
// //     <View style={st.topBar}>
// //       <View style={st.leftBtns}>
// //         <TouchableOpacity style={st.roundBtn} activeOpacity={0.85} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
// //         <TouchableOpacity style={st.roundBtn} activeOpacity={0.85}><Icon n="gear" s={18}/></TouchableOpacity>
// //       </View>

// //       <View style={st.signWrap}>
// //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// //         <View style={st.sign}>
// //           <Text style={st.signArrow}>{'<'}</Text>
// //           <Text style={st.signT}>LEVEL 25</Text>
// //           <Text style={st.signArrow}>{'>'}</Text>
// //         </View>
// //         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
// //         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
// //       </View>

// //       <View style={st.pill}>
// //         <Text style={st.pillT}>{bal}</Text>
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
// //           <Text style={st.load}>Loading level 25...</Text>
// //         </>}
// //       </View>
// //     </View></Stage>;
// //   }

// //   const ninja=(
// //     <Animated.View pointerEvents="none"
// //       style={{position:'absolute',left:NINJA.x*k,top:NINJA.y*k,width:NINJA.w*k,height:NINJA.h*k,opacity:ninO,
// //         transform:[{translateX:ninX},{translateY:ninY}]}}>
// //       <NinjaArt w={NINJA.w*k}/>
// //     </Animated.View>
// //   );

// //   return <Stage bg="#bddaee"><View style={st.root}>
// //     <RoomBackground/>
// //     {header}

// //     <View style={st.center}>
// //       {/* question pill */}
// //       <View style={st.qPill}>
// //         <Text style={st.qArrow}>{'<'}</Text>
// //         <Text style={[st.q,msg?{color:done?'#2b8a3e':'#c0392b'}:null]}>{msg||view.title}</Text>
// //         <Text style={st.qArrow}>{'>'}</Text>
// //       </View>

// //       {/* the scene */}
// //       <Animated.View style={{width:SW,height:SH,marginTop:10,transform:[{translateX:shake}]}}>
// //         {/* Sahur sits behind the roof until the level is solved */}
// //         {!done&&ninja}
// //         <Scene w={SW}/>
// //         {/* after the win he jumps down in front of everything */}
// //         {done&&ninja}

// //         {/* the police van stays where it is - it is the drop target */}
// //         <View ref={vanRef} collapsable={false} pointerEvents="none"
// //           style={{position:'absolute',left:VAN.x*k,top:VAN.y*k,width:VAN.w*k,height:VAN.h*k,zIndex:5}}>
// //           <VanArt w={VAN.w*k}/>
// //         </View>

// //         {/* only ONE house door can be pulled out and dropped beside the van */}
// //         <DragDoor id={DRAG_DOOR} k={k} pan={panD} disabled={busy||done} onDrop={onDrop}/>

// //         {done&&<View pointerEvents="none" style={{position:'absolute',left:SW/2-40,top:SH*0.12,zIndex:70}}><Tick s={80}/></View>}
// //         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:80}}><Cross/></View>}
// //       </Animated.View>
// //     </View>

// //     {/* bottom rounded panel (same theme as the other levels) */}
// //     <View style={st.panel}>
// //       <View style={st.btnCol}>
// //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onClue}>
// //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
// //       </View>

// //       <View style={st.btnCol}>
// //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onVideo}>
// //           <Icon n="film" s={36}/>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// //       </View>

// //       <View style={st.btnCol}>
// //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
// //           <View style={st.circleRed}><Icon n="play" s={30}/></View>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>{SKIP_COST}</Text></View>
// //       </View>
// //     </View>

// //     {/* CLUES popup (free) */}
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
// //             <Text style={st.clueBody}>{view.clue}</Text>
// //           </View>
// //         </View>
// //       </View>
// //     </View>}

// //     {/* result card */}
// //     {!!result&&<View style={st.overlay}>
// //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// //         <Text style={st.cardTitle}>Level complete!</Text>
// //         <Text style={st.cardMsg}>{result.message}</Text>
// //         <View style={st.stars}>{[1,2,3].map(n=><StarIcon key={n} size={46} on={n<=(result.stars||0)}/>)}</View>
// //         {!result.skipped&&<Text style={st.cardScore}>Score {result.score}</Text>}
// //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// //           <Text style={st.nextT}>NEXT</Text>
// //         </TouchableOpacity>
// //       </Animated.View>
// //     </View>}
// //   </View></Stage>;
// // }

// // /* =========================================================
// //    STYLES  (same cozy room theme as Level 1 / 5 / 6 / 7)
// //    No pencil / eraser on this screen.
// // ========================================================= */

// // const st=StyleSheet.create({
// //   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

// //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// //   leftBtns:{flexDirection:'row',gap:8},
// //   roundBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
// //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// //   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
// //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:16,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
// //   signT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:THEME.cream,letterSpacing:1},
// //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// //   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
// //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
// //   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
// //   pillIcon:{fontSize:16},

// //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,maxWidth:380},
// //   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
// //   q:{flexShrink:1,fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

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
// import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// import {Stage,Coin} from './BTShared';
// import {Icon} from './Art';
// import {StarIcon} from './Btlevel2art';
// import {RoomBackground,THEME} from './Btlevel4Theme';
// import {startLevel25,sendAction25,skipLevel25,Level25Start,Level25Action} from './Btlevel25api';
// import {Scene,VanArt,NinjaArt,Tick,Cross,SCENE_W,SCENE_H,VAN,NINJA,ZONES} from './Btlevel25art';
// import * as api from './api';

// const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// const SKIP_COST=50; // keep in sync with Braintwistlevel25routes.js

// type Props={
//   playerId:number;
//   hints?:number;
//   setHints?:(n:number)=>void;
//   onExit:()=>void;
//   onComplete?:(result:Level25Action)=>void;
// };

// const DRAG_DOOR='door_left'; // the ONE door that can be pulled out (Sahur's house). If the level says "wrong", change to 'door_right'.

// /* door size / position, measured against the invisible drop zone of that door.
//    Nudge these if the small door does not sit exactly on the painted one. */
// const DOOR_W=0.18;   // door width  = 18% of the zone width
// const DOOR_H=0.38;   // door height = 38% of the zone height
// const DOOR_DX=-0.03; // shift left (-) / right (+) as a fraction of the zone width
// const DOOR_DY=0.0;   // shift up (-) / down (+) as a fraction of the zone height
// const WALL='#fbd8ae';// house wall colour, hides the painted door once it is pulled out
// const GRAB=12;       // extra touch area around the small door (px)

// /* a small wooden door (drawn with views, no extra art file needed) */
// function DoorArt({w,h}:{w:number;h:number}){
//   const bw=Math.max(1.5,w*0.1),knob=Math.max(2,w*0.16);
//   return <View style={{width:w,height:h,backgroundColor:'#7a4a28',borderWidth:bw,borderColor:'#3d3552',borderRadius:1.5}}>
//     <View style={{position:'absolute',right:w*0.14,top:h*0.48,width:knob,height:knob,borderRadius:knob/2,backgroundColor:'#f3e3c3'}}/>
//   </View>;
// }

// /* Sahur after he escapes from the van: a little wooden log man (views only) */
// function SahurFree({w}:{w:number}){
//   const h=w*1.5,bw=w*0.7,bx=(w-bw)/2,bh=h*0.58,edge=Math.max(1.5,w*0.05),dark='#6b3b12',orange='#d0802f';
//   const eye=bw*0.26;
//   return <View style={{width:w,height:h}}>
//     <View style={{position:'absolute',left:w*0.3,top:bh-2,width:w*0.15,height:h-bh+2,backgroundColor:dark,borderRadius:w*0.05}}/>
//     <View style={{position:'absolute',left:w*0.55,top:bh-2,width:w*0.15,height:h-bh+2,backgroundColor:dark,borderRadius:w*0.05}}/>
//     <View style={{position:'absolute',left:bx-w*0.12,top:bh*0.3,width:w*0.15,height:bh*0.6,backgroundColor:orange,borderRadius:w*0.07,borderWidth:edge,borderColor:dark,transform:[{rotate:'22deg'}]}}/>
//     <View style={{position:'absolute',left:bx+bw-w*0.03,top:bh*0.3,width:w*0.15,height:bh*0.6,backgroundColor:orange,borderRadius:w*0.07,borderWidth:edge,borderColor:dark,transform:[{rotate:'-22deg'}]}}/>
//     <View style={{position:'absolute',left:bx,top:0,width:bw,height:bh,backgroundColor:orange,borderRadius:bw*0.3,borderWidth:edge,borderColor:dark}}>
//       <View style={{position:'absolute',left:bw*0.12,top:bh*0.2,width:eye,height:eye,borderRadius:eye/2,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}><View style={{width:eye*0.45,height:eye*0.45,borderRadius:eye,backgroundColor:'#222'}}/></View>
//       <View style={{position:'absolute',right:bw*0.12,top:bh*0.2,width:eye,height:eye,borderRadius:eye/2,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}><View style={{width:eye*0.45,height:eye*0.45,borderRadius:eye,backgroundColor:'#222'}}/></View>
//       <View style={{position:'absolute',left:bw*0.3,top:bh*0.62,width:bw*0.4,height:Math.max(2,bh*0.08),borderRadius:4,backgroundColor:dark}}/>
//     </View>
//   </View>;
// }

// /* the house door: drag it out of the wall and drop it beside the police van */
// function DragDoor({g,pan,fade,disabled,onDrop}:{g:{x:number;y:number;w:number;h:number};pan:Animated.ValueXY;fade:Animated.Value;disabled:boolean;onDrop:(x:number,y:number)=>Promise<boolean>}){
//   const [lift,setLift]=useState(false);
//   const live=useRef({disabled,onDrop});
//   live.current={disabled,onDrop};
//   const back=()=>Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}).start();
//   const pr=useRef(PanResponder.create({
//     onStartShouldSetPanResponder:()=>!live.current.disabled,
//     onPanResponderGrant:()=>{setLift(true);pan.setOffset({x:0,y:0});pan.setValue({x:0,y:0})},
//     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
//     onPanResponderRelease:async(_,gs)=>{
//       setLift(false);
//       const ok=await live.current.onDrop(gs.moveX,gs.moveY);
//       if(!ok)back();
//     },
//     onPanResponderTerminate:()=>{setLift(false);back()},
//   })).current;
//   return <>
//     {/* plain wall where the door used to be (hides the painted door) */}
//     <View pointerEvents="none" style={{position:'absolute',left:g.x-2,top:g.y-2,width:g.w+4,height:g.h+5,backgroundColor:WALL,zIndex:4}}/>
//     <Animated.View {...pr.panHandlers}
//       style={{position:'absolute',left:g.x-GRAB,top:g.y-GRAB,width:g.w+GRAB*2,height:g.h+GRAB*2,
//         alignItems:'center',justifyContent:'center',opacity:fade,
//         zIndex:lift?60:6,elevation:lift?12:3,
//         transform:[{translateX:pan.x},{translateY:pan.y}]}}>
//       <DoorArt w={g.w} h={g.h}/>
//     </Animated.View>
//   </>;
// }

// export default function BTLevel25Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
//   const {width,height}=useWindowDimensions();
//   const SW=Math.max(240,Math.min(width-24,440,(height-340)*SCENE_W/SCENE_H));  // scene width
//   const k=SW/SCENE_W;                                                           // scene units -> pixels
//   const SH=SCENE_H*k;
//   // the small door: centred on its drop zone, much smaller than the zone
//   const dz=ZONES[DRAG_DOOR];
//   const dW=dz.w*k*DOOR_W,dH=dz.h*k*DOOR_H;
//   const door={x:(dz.x+dz.w/2)*k+dz.w*k*DOOR_DX-dW/2,y:(dz.y+dz.h/2)*k+dz.h*k*DOOR_DY-dH/2,w:dW,h:dH};
//   const sW=VAN.w*k*0.3; // size of Sahur once he has escaped

//   const [view,setView]=useState<Level25Start|null>(null);
//   const [sessionId,setSessionId]=useState<number|null>(null);
//   const [loadErr,setLoadErr]=useState('');
//   const [msg,setMsg]=useState('');
//   const [busy,setBusy]=useState(false);
//   const [done,setDone]=useState(false);
//   const [mark,setMark]=useState<{x:number;y:number}|null>(null);
//   const [result,setResult]=useState<Level25Action|null>(null);
//   const [clueOpen,setClueOpen]=useState(false);
//   const [bal,setBal]=useState<number>(Number(hints)||0);

//   const shake=useRef(new Animated.Value(0)).current;
//   const pop=useRef(new Animated.Value(0)).current;
//   const panD=useRef(new Animated.ValueXY()).current;   // the draggable door
//   const doorFade=useRef(new Animated.Value(1)).current;
//   const sahurS=useRef(new Animated.Value(0)).current;   // pop-out scale
//   const sahurX=useRef(new Animated.Value(0)).current;   // run away
//   const sahurO=useRef(new Animated.Value(1)).current;
//   const ninX=useRef(new Animated.Value(0)).current;
//   const ninY=useRef(new Animated.Value(0)).current;
//   const ninO=useRef(new Animated.Value(1)).current;
//   const timers=useRef<any[]>([]);
//   const msgTimer=useRef<any>(null);
//   const actBusy=useRef(false);
//   const vanRef=useRef<View>(null);   // the (fixed) police van = the drop target
//   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

//   useEffect(()=>{setBal(Number(hints)||0)},[hints]);
//   const updHints=(h:number)=>{setBal(h);if(setHints)setHints(h)};

//   // 1. open the level - the backend creates or resumes the session
//   const load=useCallback(()=>{
//     setLoadErr('');setView(null);
//     startLevel25(playerId)
//       .then(v=>{
//         setSessionId(v.sessionId);
//         setView(v);
//         if(typeof v.hints==='number')updHints(v.hints);
//       })
//       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
//   },[playerId]);

//   useEffect(()=>{
//     load();
//     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
//   },[load]);

//   useEffect(()=>{
//     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
//   },[result]);

//   const flash=(m:string)=>{
//     setMsg(m);clearTimeout(msgTimer.current);
//     msgTimer.current=setTimeout(()=>setMsg(''),2800);
//   };
//   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
//     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

//   // right move: the door settles beside the van, then Sahur pops out of the van and runs away
//   const playWin=()=>{
//     const tx=VAN.x*k-door.w-6;
//     const ty=(VAN.y+VAN.h)*k-door.h;
//     Animated.sequence([
//       Animated.timing(panD,{toValue:{x:tx-door.x,y:ty-door.y},duration:600,useNativeDriver:false}),
//       Animated.parallel([
//         Animated.timing(doorFade,{toValue:0,duration:350,useNativeDriver:false}),
//         Animated.spring(sahurS,{toValue:1,friction:5,tension:90,useNativeDriver:false}),
//       ]),
//       Animated.delay(450),
//       Animated.parallel([
//         Animated.timing(sahurX,{toValue:70*k,duration:800,useNativeDriver:false}),
//         Animated.timing(sahurO,{toValue:0,duration:800,useNativeDriver:false}),
//       ]),
//     ]).start();
//   };

//   // 2. send the drop to the backend; the backend decides if it is right
//   const act=async(target:string):Promise<boolean>=>{
//     if(busy||done||!sessionId)return false;
//     setBusy(true);
//     const z=ZONES[target];
//     try{
//       // backend contract is unchanged: "van" + door id. Door dropped beside the van == van beside that door.
//       const res=await sendAction25({sessionId,playerId,item:'van',target});
//       if(!res.correct){
//         if(z)setMark({x:(z.x+z.w/2)*k,y:(z.y+z.h/2)*k});
//         doShake();flash(res.message||'Not quite. Try again!');
//         later(()=>setMark(null),700);
//         setBusy(false);
//         return false;
//       }
//       flash(res.message||'Correct!');
//       setDone(true);
//       playWin();
//       later(()=>setResult(res),2800);
//       return true;
//     }catch(e:any){
//       flash(e.message||'Network error');
//       setBusy(false);
//       return false;
//     }
//   };

//   // is the finger near the van when the door is let go? (pad = extra forgiving margin in px)
//   const hit=(ref:React.RefObject<View>,mx:number,my:number,pad:number)=>new Promise<boolean>(resolve=>{
//     const node:any=ref.current;
//     if(!node||!node.measureInWindow){resolve(false);return}
//     node.measureInWindow((x:number,y:number,w:number,h:number)=>{
//       resolve(mx>=x-pad&&mx<=x+w+pad&&my>=y-pad&&my<=y+h+pad);
//     });
//   });

//   const onDrop=async(mx:number,my:number):Promise<boolean>=>{
//     if(busy||done||!sessionId)return false;
//     if(await hit(vanRef,mx,my,36))return act(DRAG_DOOR);
//     return false;
//   };

//   // magnifier: free clue popup, no hints / coins / video needed
//   const onClue=()=>{if(!done)setClueOpen(true)};

//   const onVideo=async()=>{
//     if(actBusy.current)return;
//     actBusy.current=true;
//     try{
//       const r:any=await api.reward(playerId,'video');
//       if(typeof r?.hints==='number')updHints(r.hints);
//     }catch(e){}
//     finally{actBusy.current=false}
//   };

//   const onSkip=async()=>{
//     if(actBusy.current||busy||done||!sessionId)return;
//     if(bal<SKIP_COST){flash('Need '+SKIP_COST+' hints. You have '+bal+'.');return}
//     actBusy.current=true;
//     try{
//       const r=await skipLevel25({sessionId,playerId});
//       if(typeof r.hints==='number')updHints(r.hints);
//       setDone(true);
//       flash('Skipped!');
//       later(()=>setResult({...r,skipped:true}),900);
//     }catch(e:any){
//       flash(e.message||'Network error');
//     }finally{actBusy.current=false}
//   };

//   /* ---------- header (home, settings, wooden sign, hints pill) ---------- */

//   const header=(
//     <View style={st.topBar}>
//       <View style={st.leftBtns}>
//         <TouchableOpacity style={st.roundBtn} activeOpacity={0.85} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
//         <TouchableOpacity style={st.roundBtn} activeOpacity={0.85}><Icon n="gear" s={18}/></TouchableOpacity>
//       </View>

//       <View style={st.signWrap}>
//         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
//         <View style={st.sign}>
//           <Text style={st.signArrow}>{'<'}</Text>
//           <Text style={st.signT}>LEVEL 25</Text>
//           <Text style={st.signArrow}>{'>'}</Text>
//         </View>
//         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
//         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
//       </View>

//       <View style={st.pill}>
//         <Text style={st.pillT}>{bal}</Text>
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
//           <Text style={st.load}>Loading level 25...</Text>
//         </>}
//       </View>
//     </View></Stage>;
//   }

//   const ninja=(
//     <Animated.View pointerEvents="none"
//       style={{position:'absolute',left:NINJA.x*k,top:NINJA.y*k,width:NINJA.w*k,height:NINJA.h*k,opacity:ninO,
//         transform:[{translateX:ninX},{translateY:ninY}]}}>
//       <NinjaArt w={NINJA.w*k}/>
//     </Animated.View>
//   );

//   return <Stage bg="#bddaee"><View style={st.root}>
//     <RoomBackground/>
//     {header}

//     <View style={st.center}>
//       {/* question pill */}
//       <View style={st.qPill}>
//         <Text style={st.qArrow}>{'<'}</Text>
//         <Text style={[st.q,msg?{color:done?'#2b8a3e':'#c0392b'}:null]}>{msg||view.title}</Text>
//         <Text style={st.qArrow}>{'>'}</Text>
//       </View>

//       {/* the scene */}
//       <Animated.View style={{width:SW,height:SH,marginTop:10,transform:[{translateX:shake}]}}>
//         {/* Sahur sits behind the roof until the level is solved */}
//         {!done&&ninja}
//         <Scene w={SW}/>
//         {/* after the win he jumps down in front of everything */}
//         {done&&ninja}

//         {/* the police van stays where it is - it is the drop target */}
//         <View ref={vanRef} collapsable={false} pointerEvents="none"
//           style={{position:'absolute',left:VAN.x*k,top:VAN.y*k,width:VAN.w*k,height:VAN.h*k,zIndex:5}}>
//           <VanArt w={VAN.w*k}/>
//         </View>

//         {/* only ONE house door can be pulled out and dropped beside the van */}
//         <DragDoor g={door} pan={panD} fade={doorFade} disabled={busy||done} onDrop={onDrop}/>

//         {/* Sahur escapes from the van */}
//         {done&&<Animated.View pointerEvents="none"
//           style={{position:'absolute',left:(VAN.x+VAN.w*0.78)*k,top:(VAN.y+VAN.h)*k-sW*1.5,zIndex:65,opacity:sahurO,
//             transform:[{translateX:sahurX},{scale:sahurS}]}}>
//           <SahurFree w={sW}/>
//         </Animated.View>}

//         {done&&<View pointerEvents="none" style={{position:'absolute',left:SW/2-40,top:SH*0.12,zIndex:70}}><Tick s={80}/></View>}
//         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:80}}><Cross/></View>}
//       </Animated.View>
//     </View>

//     {/* bottom rounded panel (same theme as the other levels) */}
//     <View style={st.panel}>
//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onClue}>
//           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
//         </TouchableOpacity>
//         <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
//       </View>

//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onVideo}>
//           <Icon n="film" s={36}/>
//         </TouchableOpacity>
//         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
//       </View>

//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
//           <View style={st.circleRed}><Icon n="play" s={30}/></View>
//         </TouchableOpacity>
//         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>{SKIP_COST}</Text></View>
//       </View>
//     </View>

//     {/* CLUES popup (free) */}
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
//             <Text style={st.clueBody}>{view.clue}</Text>
//           </View>
//         </View>
//       </View>
//     </View>}

//     {/* result card */}
//     {!!result&&<View style={st.overlay}>
//       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
//         <Text style={st.cardTitle}>Level complete!</Text>
//         <Text style={st.cardMsg}>{result.message}</Text>
//         <View style={st.stars}>{[1,2,3].map(n=><StarIcon key={n} size={46} on={n<=(result.stars||0)}/>)}</View>
//         {!result.skipped&&<Text style={st.cardScore}>Score {result.score}</Text>}
//         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
//           <Text style={st.nextT}>NEXT</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </View>}
//   </View></Stage>;
// }

// /* =========================================================
//    STYLES  (same cozy room theme as Level 1 / 5 / 6 / 7)
//    No pencil / eraser on this screen.
// ========================================================= */

// const st=StyleSheet.create({
//   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

//   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
//   leftBtns:{flexDirection:'row',gap:8},
//   roundBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
//   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
//   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
//   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:16,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
//   signT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:THEME.cream,letterSpacing:1},
//   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
//   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
//   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
//   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
//   pillIcon:{fontSize:16},

//   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
//   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
//   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,maxWidth:380},
//   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
//   q:{flexShrink:1,fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

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
import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
import {Stage,Coin} from './BTShared';
import {Icon} from './Art';
import {StarIcon} from './Btlevel2art';
import {RoomBackground,THEME} from './Btlevel4Theme';
import {startLevel25,sendAction25,skipLevel25,Level25Start,Level25Action} from './Btlevel25api';
import {Scene,VanArt,NinjaArt,Tick,Cross,SCENE_W,SCENE_H,VAN,NINJA,ZONES} from './Btlevel25art';
import * as api from './api';

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

const SKIP_COST=50; // keep in sync with Braintwistlevel25routes.js

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level25Action)=>void;
};

const DRAG_DOOR='door_left'; // the ONE door that can be pulled out (Sahur's house). If the level says "wrong", change to 'door_right'.

/* door size / position, measured against the invisible drop zone of that door.
   Nudge these if the small door does not sit exactly on the painted one. */
const DOOR_W=0.18;   // door width  = 18% of the zone width
const DOOR_H=0.38;   // door height = 38% of the zone height
const DOOR_DX=-0.03; // shift left (-) / right (+) as a fraction of the zone width
const DOOR_DY=0.0;   // shift up (-) / down (+) as a fraction of the zone height
const WALL='#fbd8ae';// house wall colour, hides the painted door once it is pulled out
const GRAB=12;       // extra touch area around the small door (px)

/* a small wooden door (drawn with views, no extra art file needed) */
function DoorArt({w,h}:{w:number;h:number}){
  const bw=Math.max(1.5,w*0.1),knob=Math.max(2,w*0.16);
  return <View style={{width:w,height:h,backgroundColor:'#7a4a28',borderWidth:bw,borderColor:'#3d3552',borderRadius:1.5}}>
    <View style={{position:'absolute',right:w*0.14,top:h*0.48,width:knob,height:knob,borderRadius:knob/2,backgroundColor:'#f3e3c3'}}/>
  </View>;
}

/* Sahur after he escapes from the van: a little wooden log man (views only) */
function SahurFree({w}:{w:number}){
  const h=w*1.5,bw=w*0.7,bx=(w-bw)/2,bh=h*0.58,edge=Math.max(1.5,w*0.05),dark='#6b3b12',orange='#d0802f';
  const eye=bw*0.26;
  return <View style={{width:w,height:h}}>
    <View style={{position:'absolute',left:w*0.3,top:bh-2,width:w*0.15,height:h-bh+2,backgroundColor:dark,borderRadius:w*0.05}}/>
    <View style={{position:'absolute',left:w*0.55,top:bh-2,width:w*0.15,height:h-bh+2,backgroundColor:dark,borderRadius:w*0.05}}/>
    <View style={{position:'absolute',left:bx-w*0.12,top:bh*0.3,width:w*0.15,height:bh*0.6,backgroundColor:orange,borderRadius:w*0.07,borderWidth:edge,borderColor:dark,transform:[{rotate:'22deg'}]}}/>
    <View style={{position:'absolute',left:bx+bw-w*0.03,top:bh*0.3,width:w*0.15,height:bh*0.6,backgroundColor:orange,borderRadius:w*0.07,borderWidth:edge,borderColor:dark,transform:[{rotate:'-22deg'}]}}/>
    <View style={{position:'absolute',left:bx,top:0,width:bw,height:bh,backgroundColor:orange,borderRadius:bw*0.3,borderWidth:edge,borderColor:dark}}>
      <View style={{position:'absolute',left:bw*0.12,top:bh*0.2,width:eye,height:eye,borderRadius:eye/2,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}><View style={{width:eye*0.45,height:eye*0.45,borderRadius:eye,backgroundColor:'#222'}}/></View>
      <View style={{position:'absolute',right:bw*0.12,top:bh*0.2,width:eye,height:eye,borderRadius:eye/2,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}><View style={{width:eye*0.45,height:eye*0.45,borderRadius:eye,backgroundColor:'#222'}}/></View>
      <View style={{position:'absolute',left:bw*0.3,top:bh*0.62,width:bw*0.4,height:Math.max(2,bh*0.08),borderRadius:4,backgroundColor:dark}}/>
    </View>
  </View>;
}

/* the house door: drag it out of the wall and drop it beside the police van */
function DragDoor({g,pan,fade,disabled,onDrop}:{g:{x:number;y:number;w:number;h:number};pan:Animated.ValueXY;fade:Animated.Value;disabled:boolean;onDrop:(x:number,y:number)=>Promise<boolean>}){
  const [lift,setLift]=useState(false);
  const live=useRef({disabled,onDrop});
  live.current={disabled,onDrop};
  const back=()=>Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}).start();
  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>!live.current.disabled,
    onPanResponderGrant:()=>{setLift(true);pan.setOffset({x:0,y:0});pan.setValue({x:0,y:0})},
    onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
    onPanResponderRelease:async(_,gs)=>{
      setLift(false);
      const ok=await live.current.onDrop(gs.moveX,gs.moveY);
      if(!ok)back();
    },
    onPanResponderTerminate:()=>{setLift(false);back()},
  })).current;
  return <>
    {/* plain wall where the door used to be (hides the painted door) */}
    <View pointerEvents="none" style={{position:'absolute',left:g.x-2,top:g.y-2,width:g.w+4,height:g.h+5,backgroundColor:WALL,zIndex:4}}/>
    <Animated.View {...pr.panHandlers}
      style={{position:'absolute',left:g.x-GRAB,top:g.y-GRAB,width:g.w+GRAB*2,height:g.h+GRAB*2,
        alignItems:'center',justifyContent:'center',opacity:fade,
        zIndex:lift?60:6,elevation:lift?12:3,
        transform:[{translateX:pan.x},{translateY:pan.y}]}}>
      <DoorArt w={g.w} h={g.h}/>
    </Animated.View>
  </>;
}

export default function BTLevel25Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width,height}=useWindowDimensions();
  const SW=Math.max(240,Math.min(width-24,440,(height-340)*SCENE_W/SCENE_H));  // scene width
  const k=SW/SCENE_W;                                                           // scene units -> pixels
  const SH=SCENE_H*k;
  // the small door: centred on its drop zone, much smaller than the zone
  const dz=ZONES[DRAG_DOOR];
  const dW=dz.w*k*DOOR_W,dH=dz.h*k*DOOR_H;
  const door={x:(dz.x+dz.w/2)*k+dz.w*k*DOOR_DX-dW/2,y:(dz.y+dz.h/2)*k+dz.h*k*DOOR_DY-dH/2,w:dW,h:dH};
  const sW=VAN.w*k*0.3; // size of Sahur once he has escaped

  const [view,setView]=useState<Level25Start|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);
  const [done,setDone]=useState(false);
  const [mark,setMark]=useState<{x:number;y:number}|null>(null);
  const [result,setResult]=useState<Level25Action|null>(null);
  const [clueOpen,setClueOpen]=useState(false);
  const [bal,setBal]=useState<number>(Number(hints)||0);

  const shake=useRef(new Animated.Value(0)).current;
  const pop=useRef(new Animated.Value(0)).current;
  const panD=useRef(new Animated.ValueXY()).current;   // the draggable door
  const doorFade=useRef(new Animated.Value(1)).current;
  const sahurS=useRef(new Animated.Value(0)).current;   // pop-out scale
  const sahurX=useRef(new Animated.Value(0)).current;   // run away
  const sahurO=useRef(new Animated.Value(1)).current;
  const ninX=useRef(new Animated.Value(0)).current;
  const ninY=useRef(new Animated.Value(0)).current;
  const ninO=useRef(new Animated.Value(1)).current;
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const actBusy=useRef(false);
  const vanRef=useRef<View>(null);   // the (fixed) police van = the drop target
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  useEffect(()=>{setBal(Number(hints)||0)},[hints]);
  const updHints=(h:number)=>{setBal(h);if(setHints)setHints(h)};

  // 1. open the level - the backend creates or resumes the session
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel25(playerId)
      .then(v=>{
        setSessionId(v.sessionId);
        setView(v);
        if(typeof v.hints==='number')updHints(v.hints);
      })
      .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
  },[playerId]);

  useEffect(()=>{
    load();
    return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
  },[load]);

  useEffect(()=>{
    if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
  },[result]);

  const flash=(m:string)=>{
    setMsg(m);clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2800);
  };
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
    Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  // right move: the door STAYS exactly where the player dropped it (on the van).
  // Sahur pops out of the van and runs away.
  const playWin=()=>{
    Animated.sequence([
      Animated.delay(150),
      Animated.spring(sahurS,{toValue:1,friction:5,tension:90,useNativeDriver:false}),
      Animated.delay(450),
      Animated.parallel([
        Animated.timing(sahurX,{toValue:70*k,duration:800,useNativeDriver:false}),
        Animated.timing(sahurO,{toValue:0,duration:800,useNativeDriver:false}),
      ]),
    ]).start();
  };

  // 2. send the drop to the backend; the backend decides if it is right
  const act=async(target:string):Promise<boolean>=>{
    if(busy||done||!sessionId)return false;
    setBusy(true);
    const z=ZONES[target];
    try{
      // backend contract is unchanged: "van" + door id. Door dropped beside the van == van beside that door.
      const res=await sendAction25({sessionId,playerId,item:'van',target});
      if(!res.correct){
        if(z)setMark({x:(z.x+z.w/2)*k,y:(z.y+z.h/2)*k});
        doShake();flash(res.message||'Not quite. Try again!');
        later(()=>setMark(null),700);
        setBusy(false);
        return false;
      }
      flash(res.message||'Correct!');
      setDone(true);
      playWin();
      later(()=>setResult(res),2400);
      return true;
    }catch(e:any){
      flash(e.message||'Network error');
      setBusy(false);
      return false;
    }
  };

  // is the finger near the van when the door is let go? (pad = extra forgiving margin in px)
  const hit=(ref:React.RefObject<View>,mx:number,my:number,pad:number)=>new Promise<boolean>(resolve=>{
    const node:any=ref.current;
    if(!node||!node.measureInWindow){resolve(false);return}
    node.measureInWindow((x:number,y:number,w:number,h:number)=>{
      resolve(mx>=x-pad&&mx<=x+w+pad&&my>=y-pad&&my<=y+h+pad);
    });
  });

  const onDrop=async(mx:number,my:number):Promise<boolean>=>{
    if(busy||done||!sessionId)return false;
    if(await hit(vanRef,mx,my,36))return act(DRAG_DOOR);
    return false;
  };

  // magnifier: free clue popup, no hints / coins / video needed
  const onClue=()=>{if(!done)setClueOpen(true)};

  const onVideo=async()=>{
    if(actBusy.current)return;
    actBusy.current=true;
    try{
      const r:any=await api.reward(playerId,'video');
      if(typeof r?.hints==='number')updHints(r.hints);
    }catch(e){}
    finally{actBusy.current=false}
  };

  const onSkip=async()=>{
    if(actBusy.current||busy||done||!sessionId)return;
    if(bal<SKIP_COST){flash('Need '+SKIP_COST+' hints. You have '+bal+'.');return}
    actBusy.current=true;
    try{
      const r=await skipLevel25({sessionId,playerId});
      if(typeof r.hints==='number')updHints(r.hints);
      setDone(true);
      flash('Skipped!');
      later(()=>setResult({...r,skipped:true}),900);
    }catch(e:any){
      flash(e.message||'Network error');
    }finally{actBusy.current=false}
  };

  /* ---------- header (home, settings, wooden sign, hints pill) ---------- */

  const header=(
    <View style={st.topBar}>
      <View style={st.leftBtns}>
        <TouchableOpacity style={st.roundBtn} activeOpacity={0.85} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
        <TouchableOpacity style={st.roundBtn} activeOpacity={0.85}><Icon n="gear" s={18}/></TouchableOpacity>
      </View>

      <View style={st.signWrap}>
        <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
        <View style={st.sign}>
          <Text style={st.signArrow}>{'<'}</Text>
          <Text style={st.signT}>LEVEL 25</Text>
          <Text style={st.signArrow}>{'>'}</Text>
        </View>
        <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
        <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
      </View>

      <View style={st.pill}>
        <Text style={st.pillT}>{bal}</Text>
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
          <Text style={st.load}>Loading level 25...</Text>
        </>}
      </View>
    </View></Stage>;
  }

  const ninja=(
    <Animated.View pointerEvents="none"
      style={{position:'absolute',left:NINJA.x*k,top:NINJA.y*k,width:NINJA.w*k,height:NINJA.h*k,opacity:ninO,
        transform:[{translateX:ninX},{translateY:ninY}]}}>
      <NinjaArt w={NINJA.w*k}/>
    </Animated.View>
  );

  return <Stage bg="#bddaee"><View style={st.root}>
    <RoomBackground/>
    {header}

    <View style={st.center}>
      {/* question pill */}
      <View style={st.qPill}>
        <Text style={st.qArrow}>{'<'}</Text>
        <Text style={[st.q,msg?{color:done?'#2b8a3e':'#c0392b'}:null]}>{msg||view.title}</Text>
        <Text style={st.qArrow}>{'>'}</Text>
      </View>

      {/* the scene */}
      <Animated.View style={{width:SW,height:SH,marginTop:10,transform:[{translateX:shake}]}}>
        {/* Sahur sits behind the roof until the level is solved */}
        {!done&&ninja}
        <Scene w={SW}/>
        {/* after the win he jumps down in front of everything */}
        {done&&ninja}

        {/* the police van stays where it is - it is the drop target */}
        <View ref={vanRef} collapsable={false} pointerEvents="none"
          style={{position:'absolute',left:VAN.x*k,top:VAN.y*k,width:VAN.w*k,height:VAN.h*k,zIndex:5}}>
          <VanArt w={VAN.w*k}/>
        </View>

        {/* only ONE house door can be pulled out and dropped beside the van */}
        <DragDoor g={door} pan={panD} fade={doorFade} disabled={busy||done} onDrop={onDrop}/>

        {/* Sahur escapes from the van */}
        {done&&<Animated.View pointerEvents="none"
          style={{position:'absolute',left:(VAN.x+VAN.w*0.78)*k,top:(VAN.y+VAN.h)*k-sW*1.5,zIndex:65,opacity:sahurO,
            transform:[{translateX:sahurX},{scale:sahurS}]}}>
          <SahurFree w={sW}/>
        </Animated.View>}

        {done&&<View pointerEvents="none" style={{position:'absolute',left:SW/2-40,top:SH*0.12,zIndex:70}}><Tick s={80}/></View>}
        {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:80}}><Cross/></View>}
      </Animated.View>
    </View>

    {/* bottom rounded panel (same theme as the other levels) */}
    <View style={st.panel}>
      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onClue}>
          <View style={st.circleGreen}><Icon n="search" s={32}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onVideo}>
          <Icon n="film" s={36}/>
        </TouchableOpacity>
        <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
          <View style={st.circleRed}><Icon n="play" s={30}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>{SKIP_COST}</Text></View>
      </View>
    </View>

    {/* CLUES popup (free) */}
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
            <Text style={st.clueBody}>{view.clue}</Text>
          </View>
        </View>
      </View>
    </View>}

    {/* result card */}
    {!!result&&<View style={st.overlay}>
      <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
        <Text style={st.cardTitle}>Level complete!</Text>
        <Text style={st.cardMsg}>{result.message}</Text>
        <View style={st.stars}>{[1,2,3].map(n=><StarIcon key={n} size={46} on={n<=(result.stars||0)}/>)}</View>
        {!result.skipped&&<Text style={st.cardScore}>Score {result.score}</Text>}
        <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
          <Text style={st.nextT}>NEXT</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>}
  </View></Stage>;
}

/* =========================================================
   STYLES  (same cozy room theme as Level 1 / 5 / 6 / 7)
   No pencil / eraser on this screen.
========================================================= */

const st=StyleSheet.create({
  root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

  topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
  leftBtns:{flexDirection:'row',gap:8},
  roundBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
  signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
  string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
  sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:16,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
  signT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:THEME.cream,letterSpacing:1},
  signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
  leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
  pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
  pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
  pillIcon:{fontSize:16},

  center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
  centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
  qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,maxWidth:380},
  qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
  q:{flexShrink:1,fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

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
