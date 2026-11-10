
// // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// // import Svg,{Line,Path} from 'react-native-svg';
// // import {Stage,Coin} from './BTShared';
// // import {Icon} from './Art';
// // import {startLevel6,connectDots,Level6View,Level6Connect,L6Dot,L6Edge} from './Btlevel6api';
// // import {Tick,Cross,BigStar,dotPath} from './Btlevel6art';
// // import {RoomBackground,THEME} from './Btlevel4Theme';

// // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // const CHALK='#f6f4ea';
// // const DOT_R=14;          // drawn size of a dot
// // const GRAB=38;           // how close a finger must be to a dot to pick it up / drop on it

// // // the clue is FREE: it never depends on hints, coins or videos
// // // only ONE clue is shown when the magnifier is tapped
// // const CLUE_1='The star is hiding in plain sight… connect the dots, but don’t follow the obvious path!';

// // type Props={
// //   playerId:number;
// //   hints?:number;
// //   setHints?:(n:number)=>void;
// //   onExit:()=>void;
// //   onComplete?:(result:Level6Connect)=>void;
// //   // called when the coins / video buttons are tapped. The parent should ONLY add hints here.
// //   onWatchVideo?:()=>void;
// // };

// // export default function BTLevel6Screen({playerId,hints=0,setHints,onExit,onComplete,onWatchVideo}:Props){
// //   const {width,height}=useWindowDimensions();
// //   const S=Math.max(220,Math.min(width-48,340,height-380));   // square chalkboard

// //   const [view,setView]=useState<Level6View|null>(null);
// //   const [sessionId,setSessionId]=useState<number|null>(null);
// //   const [loadErr,setLoadErr]=useState('');
// //   const [msg,setMsg]=useState('');
// //   const [busy,setBusy]=useState(false);
// //   const [drag,setDrag]=useState<{x1:number;y1:number;x2:number;y2:number}|null>(null);
// //   const [mark,setMark]=useState<{x:number;y:number}|null>(null);
// //   const [done,setDone]=useState(false);
// //   const [result,setResult]=useState<Level6Connect|null>(null);
// //   const [clueOpen,setClueOpen]=useState(false);   // popup visible or not

// //   const shake=useRef(new Animated.Value(0)).current;
// //   const pop=useRef(new Animated.Value(0)).current;
// //   const tickPop=useRef(new Animated.Value(0)).current;
// //   const timers=useRef<any[]>([]);
// //   const msgTimer=useRef<any>(null);
// //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// //   // the pan responder is created once, so it reads the latest data from this ref
// //   const live=useRef<any>({});
// //   const pos=(d:L6Dot)=>{const sz=live.current.S||S;return {x:d.x*sz,y:d.y*sz}};
// //   const nearest=(x:number,y:number,skip?:number)=>{
// //     const v=live.current.view as Level6View|null;
// //     if(!v)return null;
// //     let best:L6Dot|null=null,bd=GRAB;
// //     for(const d of v.dots){
// //       if(d.id===skip)continue;
// //       const p=pos(d),dist=Math.hypot(p.x-x,p.y-y);
// //       if(dist<bd){bd=dist;best=d}
// //     }
// //     return best;
// //   };

// //   // 1. open the level - the backend creates or resumes the session
// //   const load=useCallback(()=>{
// //     setLoadErr('');setView(null);
// //     startLevel6(playerId)
// //       .then(v=>{
// //         setSessionId(v.sessionId as number);
// //         setView(v);
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
// //     msgTimer.current=setTimeout(()=>setMsg(''),2600);
// //   };
// //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// //   // 2. the finger joined two dots -> ask the backend if that is a line of the star
// //   const join=async(from:number,to:number)=>{
// //     const {view:v,sessionId:sid,busy:b,done:d}=live.current;
// //     if(b||d||!sid||!v)return;
// //     setBusy(true);
// //     try{
// //       const res=await connectDots({sessionId:sid,playerId,from,to});

// //       if(!res.correct){
// //         const a=v.dots.find((x:L6Dot)=>x.id===from),c=v.dots.find((x:L6Dot)=>x.id===to);
// //         if(a&&c)setMark({x:(a.x+c.x)/2*S,y:(a.y+c.y)/2*S});
// //         doShake();flash(res.message);
// //         later(()=>setMark(null),700);
// //         setBusy(false);
// //         return;
// //       }

// //       setView(res);                                  // the new line is drawn from the server's list
// //       if(res.duplicate){flash(res.message);setBusy(false);return}

// //       if(res.completed){
// //         setDone(true);
// //         flash(res.message);
// //         Animated.spring(tickPop,{toValue:1,friction:4,tension:80,useNativeDriver:true}).start();
// //         later(()=>setResult(res),1500);
// //       }else{
// //         setBusy(false);
// //       }
// //     }catch(e:any){
// //       flash(e.message||'Network error');
// //       setBusy(false);
// //     }
// //   };

// //   const active=useRef<number|null>(null);
// //   const start=useRef({x:0,y:0});
// //   const pr=useRef(PanResponder.create({
// //     onStartShouldSetPanResponder:()=>true,
// //     onPanResponderGrant:(e)=>{
// //       const x=e.nativeEvent.locationX,y=e.nativeEvent.locationY;
// //       start.current={x,y};
// //       const d=live.current.done||live.current.busy?null:nearest(x,y);
// //       active.current=d?d.id:null;
// //       if(d){const p=pos(d);setDrag({x1:p.x,y1:p.y,x2:x,y2:y})}
// //     },
// //     onPanResponderMove:(_,g)=>{
// //       if(active.current==null)return;
// //       const d=(live.current.view as Level6View).dots.find(q=>q.id===active.current);
// //       if(!d)return;
// //       const p=pos(d);
// //       setDrag({x1:p.x,y1:p.y,x2:start.current.x+g.dx,y2:start.current.y+g.dy});
// //     },
// //     onPanResponderRelease:(_,g)=>{
// //       const from=active.current;active.current=null;setDrag(null);
// //       if(from==null)return;
// //       const t=nearest(start.current.x+g.dx,start.current.y+g.dy,from);
// //       if(t)join(from,t.id);
// //     },
// //     onPanResponderTerminate:()=>{active.current=null;setDrag(null)},
// //   })).current;

// //   live.current={view,sessionId,busy,done,S};

// //   // 3. magnifier tapped -> show the clue directly (free, no hints / coins / video needed)
// //   const onHint=()=>{
// //     if(done)return;
// //     setClueOpen(true);
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
// //           <Text style={st.signT}>LEVEL 6</Text>
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
// //           <Text style={st.load}>Loading level 6...</Text>
// //         </>}
// //       </View>
// //     </View></Stage>;
// //   }

// //   const dotById=(id:number)=>view.dots.find(d=>d.id===id) as L6Dot;
// //   const drawn:L6Edge[]=view.edges;

// //   return <Stage bg="#bddaee"><View style={st.root}>
// //     <RoomBackground/>
// //     {header}

// //     <View style={st.center}>
// //       {/* question pill (same as level 1) */}
// //       <View style={st.qPill}>
// //         <Text style={st.qArrow}>{'<'}</Text>
// //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// //         <Text style={st.qArrow}>{'>'}</Text>
// //       </View>

// //       {/* small chalkboard hanging in the room */}
// //       <Animated.View style={[st.boardFrame,{width:S+16,height:S+16,transform:[{translateX:shake}]}]}>
// //         <View style={{width:S,height:S}}>
// //           <Svg width={S} height={S} style={StyleSheet.absoluteFill} pointerEvents="none">
// //             {/* lines the server accepted */}
// //             {drawn.map((e,i)=>{
// //               const a=dotById(e.from),b=dotById(e.to);
// //               return <Line key={i} x1={a.x*S} y1={a.y*S} x2={b.x*S} y2={b.y*S}
// //                 stroke={done?'#ffd84d':CHALK} strokeWidth={9} strokeLinecap="round"/>;
// //             })}
// //             {/* line following the finger */}
// //             {drag&&<Line x1={drag.x1} y1={drag.y1} x2={drag.x2} y2={drag.y2}
// //               stroke="rgba(246,244,234,0.65)" strokeWidth={9} strokeLinecap="round"/>}
// //             {/* dots */}
// //             {view.dots.map(d=><Path key={d.id} d={dotPath(d.x*S,d.y*S,DOT_R)} fill={CHALK}/>)}
// //           </Svg>

// //           {done&&<Animated.View pointerEvents="none" style={{position:'absolute',left:S/2-40,top:S*0.56-40,transform:[{scale:tickPop}]}}>
// //             <Tick s={80}/>
// //           </Animated.View>}
// //           {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}><Cross/></View>}

// //           {/* touch layer */}
// //           <View style={StyleSheet.absoluteFill} {...pr.panHandlers}/>
// //         </View>
// //       </Animated.View>

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
// //         {/* coins / video button: the parent ONLY adds hints, it never opens the clue */}
// //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={()=>onWatchVideo&&onWatchVideo()}>
// //           <Icon n="film" s={36}/>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// //       </View>

// //       <View style={st.btnCol}>
// //         <View style={st.ringWhite}><View style={st.circleRed}><Icon n="play" s={30}/></View></View>
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
// //    STYLES  (same cozy room theme as Level 1 / Level 5)
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

// //   // wooden frame + green chalk surface (so the white chalk dots are always visible)
// //   boardFrame:{marginTop:12,borderRadius:14,borderWidth:8,borderColor:THEME.wood,backgroundColor:'#1f5b44',alignItems:'center',justifyContent:'center',overflow:'hidden'},

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

// //   overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
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
// import Svg,{Line,Path} from 'react-native-svg';
// import {Stage,Coin} from './BTShared';
// import {Icon} from './Art';
// import {startLevel6,connectDots,Level6View,Level6Connect,L6Dot,L6Edge} from './Btlevel6api';
// import {Tick,Cross,BigStar,dotPath} from './Btlevel6art';
// import {RoomBackground,THEME} from './Btlevel4Theme';
// import {play} from './BTSound';   // Level 5-la epdi import pannirukeengalo apdiye path vaiyunga

// const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// const CHALK='#f6f4ea';
// const DOT_R=14;          // drawn size of a dot
// const GRAB=38;           // how close a finger must be to a dot to pick it up / drop on it

// // the clue is FREE: it never depends on hints, coins or videos
// // only ONE clue is shown when the magnifier is tapped
// const CLUE_1='The star is hiding in plain sight… connect the dots, but don’t follow the obvious path!';

// type Props={
//   playerId:number;
//   hints?:number;
//   setHints?:(n:number)=>void;
//   onExit:()=>void;
//   onComplete?:(result:Level6Connect)=>void;
//   // called when the coins / video buttons are tapped. The parent should ONLY add hints here.
//   onWatchVideo?:()=>void;
// };

// export default function BTLevel6Screen({playerId,hints=0,setHints,onExit,onComplete,onWatchVideo}:Props){
//   const {width,height}=useWindowDimensions();
//   const S=Math.max(220,Math.min(width-48,340,height-380));   // square chalkboard

//   const [view,setView]=useState<Level6View|null>(null);
//   const [sessionId,setSessionId]=useState<number|null>(null);
//   const [loadErr,setLoadErr]=useState('');
//   const [msg,setMsg]=useState('');
//   const [busy,setBusy]=useState(false);
//   const [drag,setDrag]=useState<{x1:number;y1:number;x2:number;y2:number}|null>(null);
//   const [mark,setMark]=useState<{x:number;y:number}|null>(null);
//   const [done,setDone]=useState(false);
//   const [result,setResult]=useState<Level6Connect|null>(null);
//   const [clueOpen,setClueOpen]=useState(false);   // popup visible or not

//   const shake=useRef(new Animated.Value(0)).current;
//   const pop=useRef(new Animated.Value(0)).current;
//   const tickPop=useRef(new Animated.Value(0)).current;
//   const timers=useRef<any[]>([]);
//   const msgTimer=useRef<any>(null);
//   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

//   // the pan responder is created once, so it reads the latest data from this ref
//   const live=useRef<any>({});
//   const pos=(d:L6Dot)=>{const sz=live.current.S||S;return {x:d.x*sz,y:d.y*sz}};
//   const nearest=(x:number,y:number,skip?:number)=>{
//     const v=live.current.view as Level6View|null;
//     if(!v)return null;
//     let best:L6Dot|null=null,bd=GRAB;
//     for(const d of v.dots){
//       if(d.id===skip)continue;
//       const p=pos(d),dist=Math.hypot(p.x-x,p.y-y);
//       if(dist<bd){bd=dist;best=d}
//     }
//     return best;
//   };

//   // 1. open the level - the backend creates or resumes the session
//   const load=useCallback(()=>{
//     setLoadErr('');setView(null);
//     startLevel6(playerId)
//       .then(v=>{
//         setSessionId(v.sessionId as number);
//         setView(v);
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
//     msgTimer.current=setTimeout(()=>setMsg(''),2600);
//   };
//   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
//     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

//   // 2. the finger joined two dots -> ask the backend if that is a line of the star
//   const join=async(from:number,to:number)=>{
//     const {view:v,sessionId:sid,busy:b,done:d}=live.current;
//     if(b||d||!sid||!v)return;
//     setBusy(true);
//     try{
//       const res=await connectDots({sessionId:sid,playerId,from,to});

//       if(!res.correct){
//         play('wrong');                                  // wrong line
//         const a=v.dots.find((x:L6Dot)=>x.id===from),c=v.dots.find((x:L6Dot)=>x.id===to);
//         if(a&&c)setMark({x:(a.x+c.x)/2*S,y:(a.y+c.y)/2*S});
//         doShake();flash(res.message);
//         later(()=>setMark(null),700);
//         setBusy(false);
//         return;
//       }

//       setView(res);                                     // the new line is drawn from the server's list
//       if(res.duplicate){play('tap');flash(res.message);setBusy(false);return}

//       if(res.completed){
//         play('correct');                                // star finished
//         setDone(true);
//         flash(res.message);
//         Animated.spring(tickPop,{toValue:1,friction:4,tension:80,useNativeDriver:true}).start();
//         later(()=>setResult(res),1500);
//       }else{
//         play('pencil');                                 // 2 dots joined -> line drawn
//         setBusy(false);
//       }
//     }catch(e:any){
//       flash(e.message||'Network error');
//       setBusy(false);
//     }
//   };

//   const active=useRef<number|null>(null);
//   const start=useRef({x:0,y:0});
//   const pr=useRef(PanResponder.create({
//     onStartShouldSetPanResponder:()=>true,
//     onPanResponderGrant:(e)=>{
//       const x=e.nativeEvent.locationX,y=e.nativeEvent.locationY;
//       start.current={x,y};
//       const d=live.current.done||live.current.busy?null:nearest(x,y);
//       active.current=d?d.id:null;
//       if(d){play('drag');const p=pos(d);setDrag({x1:p.x,y1:p.y,x2:x,y2:y})}   // dot picked up
//     },
//     onPanResponderMove:(_,g)=>{
//       if(active.current==null)return;
//       const d=(live.current.view as Level6View).dots.find(q=>q.id===active.current);
//       if(!d)return;
//       const p=pos(d);
//       setDrag({x1:p.x,y1:p.y,x2:start.current.x+g.dx,y2:start.current.y+g.dy});
//     },
//     onPanResponderRelease:(_,g)=>{
//       const from=active.current;active.current=null;setDrag(null);
//       if(from==null)return;
//       const t=nearest(start.current.x+g.dx,start.current.y+g.dy,from);
//       if(t)join(from,t.id);
//     },
//     onPanResponderTerminate:()=>{active.current=null;setDrag(null)},
//   })).current;

//   live.current={view,sessionId,busy,done,S};

//   // 3. magnifier tapped -> show the clue directly (free, no hints / coins / video needed)
//   const onHint=()=>{
//     if(done)return;
//     play('clue');
//     setClueOpen(true);
//   };

//   const watchVideo=()=>{play('btn');onWatchVideo&&onWatchVideo()};

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
//           <Text style={st.signT}>LEVEL 6</Text>
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
//           <Text style={st.load}>Loading level 6...</Text>
//         </>}
//       </View>
//     </View></Stage>;
//   }

//   const dotById=(id:number)=>view.dots.find(d=>d.id===id) as L6Dot;
//   const drawn:L6Edge[]=view.edges;

//   return <Stage bg="#bddaee"><View style={st.root}>
//     <RoomBackground/>
//     {header}

//     <View style={st.center}>
//       {/* question pill (same as level 1) */}
//       <View style={st.qPill}>
//         <Text style={st.qArrow}>{'<'}</Text>
//         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
//         <Text style={st.qArrow}>{'>'}</Text>
//       </View>

//       {/* small chalkboard hanging in the room */}
//       <Animated.View style={[st.boardFrame,{width:S+16,height:S+16,transform:[{translateX:shake}]}]}>
//         <View style={{width:S,height:S}}>
//           <Svg width={S} height={S} style={StyleSheet.absoluteFill} pointerEvents="none">
//             {/* lines the server accepted */}
//             {drawn.map((e,i)=>{
//               const a=dotById(e.from),b=dotById(e.to);
//               return <Line key={i} x1={a.x*S} y1={a.y*S} x2={b.x*S} y2={b.y*S}
//                 stroke={done?'#ffd84d':CHALK} strokeWidth={9} strokeLinecap="round"/>;
//             })}
//             {/* line following the finger */}
//             {drag&&<Line x1={drag.x1} y1={drag.y1} x2={drag.x2} y2={drag.y2}
//               stroke="rgba(246,244,234,0.65)" strokeWidth={9} strokeLinecap="round"/>}
//             {/* dots */}
//             {view.dots.map(d=><Path key={d.id} d={dotPath(d.x*S,d.y*S,DOT_R)} fill={CHALK}/>)}
//           </Svg>

//           {done&&<Animated.View pointerEvents="none" style={{position:'absolute',left:S/2-40,top:S*0.56-40,transform:[{scale:tickPop}]}}>
//             <Tick s={80}/>
//           </Animated.View>}
//           {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}><Cross/></View>}

//           {/* touch layer */}
//           <View style={StyleSheet.absoluteFill} {...pr.panHandlers}/>
//         </View>
//       </Animated.View>

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
//         {/* coins / video button: the parent ONLY adds hints, it never opens the clue */}
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={watchVideo}>
//           <Icon n="film" s={36}/>
//         </TouchableOpacity>
//         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
//       </View>

//       <View style={st.btnCol}>
//         <View style={st.ringWhite}><View style={st.circleRed}><Icon n="play" s={30}/></View></View>
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
//    STYLES  (same cozy room theme as Level 1 / Level 5)
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

//   // wooden frame + green chalk surface (so the white chalk dots are always visible)
//   boardFrame:{marginTop:12,borderRadius:14,borderWidth:8,borderColor:THEME.wood,backgroundColor:'#1f5b44',alignItems:'center',justifyContent:'center',overflow:'hidden'},

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

//   overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
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
import Svg,{Line,Path} from 'react-native-svg';
import {Stage,Coin} from './BTShared';
import {Icon} from './Art';
import {startLevel6,connectDots,Level6View,Level6Connect,L6Dot,L6Edge} from './Btlevel6api';
import {Tick,Cross,BigStar,dotPath} from './Btlevel6art';
import {RoomBackground,THEME} from './Btlevel4Theme';
import {play} from './BTSound';   // Level 5-la epdi import pannirukeengalo apdiye path vaiyunga

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
const CHALK='#f6f4ea';
const DOT_R=14;          // drawn size of a dot
const GRAB=38;           // how close a finger must be to a dot to pick it up / drop on it

// the clue is FREE: it never depends on hints, coins or videos
// only ONE clue is shown when the magnifier is tapped
const CLUE_1='The star is hiding in plain sight… connect the dots, but don’t follow the obvious path!';

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level6Connect)=>void;
  // called when the coins / video buttons are tapped. The parent should ONLY add hints here.
  onWatchVideo?:()=>void;
};

export default function BTLevel6Screen({playerId,hints=0,setHints,onExit,onComplete,onWatchVideo}:Props){
  const {width,height}=useWindowDimensions();
  const S=Math.max(220,Math.min(width-48,340,height-380));   // square chalkboard

  const [view,setView]=useState<Level6View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);
  const [drag,setDrag]=useState<{x1:number;y1:number;x2:number;y2:number}|null>(null);
  const [mark,setMark]=useState<{x:number;y:number}|null>(null);
  const [done,setDone]=useState(false);
  const [result,setResult]=useState<Level6Connect|null>(null);
  const [clueOpen,setClueOpen]=useState(false);   // popup visible or not

  const shake=useRef(new Animated.Value(0)).current;
  const pop=useRef(new Animated.Value(0)).current;
  const tickPop=useRef(new Animated.Value(0)).current;
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  // the pan responder is created once, so it reads the latest data from this ref
  const live=useRef<any>({});
  const pos=(d:L6Dot)=>{const sz=live.current.S||S;return {x:d.x*sz,y:d.y*sz}};
  const nearest=(x:number,y:number,skip?:number)=>{
    const v=live.current.view as Level6View|null;
    if(!v)return null;
    let best:L6Dot|null=null,bd=GRAB;
    for(const d of v.dots){
      if(d.id===skip)continue;
      const p=pos(d),dist=Math.hypot(p.x-x,p.y-y);
      if(dist<bd){bd=dist;best=d}
    }
    return best;
  };

  // 1. open the level - the backend creates or resumes the session
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel6(playerId)
      .then(v=>{
        setSessionId(v.sessionId as number);
        setView(v);
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
    msgTimer.current=setTimeout(()=>setMsg(''),2600);
  };
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
    Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  // 2. the finger joined two dots -> ask the backend if that is a line of the star
  const join=async(from:number,to:number)=>{
    const {view:v,sessionId:sid,busy:b,done:d}=live.current;
    if(b||d||!sid||!v)return;
    setBusy(true);
    try{
      const res=await connectDots({sessionId:sid,playerId,from,to});

      if(!res.correct){
        play('wrong');                                  // wrong line
        const a=v.dots.find((x:L6Dot)=>x.id===from),c=v.dots.find((x:L6Dot)=>x.id===to);
        if(a&&c)setMark({x:(a.x+c.x)/2*S,y:(a.y+c.y)/2*S});
        doShake();flash(res.message);
        later(()=>setMark(null),700);
        setBusy(false);
        return;
      }

      setView(res);                                     // the new line is drawn from the server's list
      if(res.duplicate){play('tap');flash(res.message);setBusy(false);return}

      if(res.completed){
        play('line5');                                  // last line = happy flourish
        setDone(true);
        flash(res.message);
        Animated.spring(tickPop,{toValue:1,friction:4,tension:80,useNativeDriver:true}).start();
        later(()=>setResult(res),1500);
      }else{
        // correct line: 1st line = line1 ... 4th line = line4 (each one a higher note)
        const n=Math.min(Math.max(res.edges.length,1),4);
        play(('line'+n) as any);
        setBusy(false);
      }
    }catch(e:any){
      flash(e.message||'Network error');
      setBusy(false);
    }
  };

  const active=useRef<number|null>(null);
  const start=useRef({x:0,y:0});
  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>true,
    onPanResponderGrant:(e)=>{
      const x=e.nativeEvent.locationX,y=e.nativeEvent.locationY;
      start.current={x,y};
      const d=live.current.done||live.current.busy?null:nearest(x,y);
      active.current=d?d.id:null;
      if(d){play('drag');const p=pos(d);setDrag({x1:p.x,y1:p.y,x2:x,y2:y})}   // dot picked up
    },
    onPanResponderMove:(_,g)=>{
      if(active.current==null)return;
      const d=(live.current.view as Level6View).dots.find(q=>q.id===active.current);
      if(!d)return;
      const p=pos(d);
      setDrag({x1:p.x,y1:p.y,x2:start.current.x+g.dx,y2:start.current.y+g.dy});
    },
    onPanResponderRelease:(_,g)=>{
      const from=active.current;active.current=null;setDrag(null);
      if(from==null)return;
      const t=nearest(start.current.x+g.dx,start.current.y+g.dy,from);
      if(t)join(from,t.id);
    },
    onPanResponderTerminate:()=>{active.current=null;setDrag(null)},
  })).current;

  live.current={view,sessionId,busy,done,S};

  // 3. magnifier tapped -> show the clue directly (free, no hints / coins / video needed)
  const onHint=()=>{
    if(done)return;
    play('clue');
    setClueOpen(true);
  };

  const watchVideo=()=>{play('btn');onWatchVideo&&onWatchVideo()};

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
          <Text style={st.signT}>LEVEL 6</Text>
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
          <Text style={st.load}>Loading level 6...</Text>
        </>}
      </View>
    </View></Stage>;
  }

  const dotById=(id:number)=>view.dots.find(d=>d.id===id) as L6Dot;
  const drawn:L6Edge[]=view.edges;

  return <Stage bg="#bddaee"><View style={st.root}>
    <RoomBackground/>
    {header}

    <View style={st.center}>
      {/* question pill (same as level 1) */}
      <View style={st.qPill}>
        <Text style={st.qArrow}>{'<'}</Text>
        <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
        <Text style={st.qArrow}>{'>'}</Text>
      </View>

      {/* small chalkboard hanging in the room */}
      <Animated.View style={[st.boardFrame,{width:S+16,height:S+16,transform:[{translateX:shake}]}]}>
        <View style={{width:S,height:S}}>
          <Svg width={S} height={S} style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* lines the server accepted */}
            {drawn.map((e,i)=>{
              const a=dotById(e.from),b=dotById(e.to);
              return <Line key={i} x1={a.x*S} y1={a.y*S} x2={b.x*S} y2={b.y*S}
                stroke={done?'#ffd84d':CHALK} strokeWidth={9} strokeLinecap="round"/>;
            })}
            {/* line following the finger */}
            {drag&&<Line x1={drag.x1} y1={drag.y1} x2={drag.x2} y2={drag.y2}
              stroke="rgba(246,244,234,0.65)" strokeWidth={9} strokeLinecap="round"/>}
            {/* dots */}
            {view.dots.map(d=><Path key={d.id} d={dotPath(d.x*S,d.y*S,DOT_R)} fill={CHALK}/>)}
          </Svg>

          {done&&<Animated.View pointerEvents="none" style={{position:'absolute',left:S/2-40,top:S*0.56-40,transform:[{scale:tickPop}]}}>
            <Tick s={80}/>
          </Animated.View>}
          {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}><Cross/></View>}

          {/* touch layer */}
          <View style={StyleSheet.absoluteFill} {...pr.panHandlers}/>
        </View>
      </Animated.View>

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
        {/* coins / video button: the parent ONLY adds hints, it never opens the clue */}
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={watchVideo}>
          <Icon n="film" s={36}/>
        </TouchableOpacity>
        <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
      </View>

      <View style={st.btnCol}>
        <View style={st.ringWhite}><View style={st.circleRed}><Icon n="play" s={30}/></View></View>
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
   STYLES  (same cozy room theme as Level 1 / Level 5)
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

  // wooden frame + green chalk surface (so the white chalk dots are always visible)
  boardFrame:{marginTop:12,borderRadius:14,borderWidth:8,borderColor:THEME.wood,backgroundColor:'#1f5b44',alignItems:'center',justifyContent:'center',overflow:'hidden'},

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

  overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
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