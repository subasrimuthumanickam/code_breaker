// // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Animated,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // import {Stage,Coin} from './BTShared';
// // import {Icon} from './Art';
// // import {BigStar} from './Btlevel7art';
// // import {RoomBackground,THEME} from './Btlevel4Theme';
// // import {Chalkboard,ChalkDigit} from './Btlevel27art';
// // import {startLevel27,answerLevel27,hintLevel27,skipLevel27,rewardLevel27,Level27View,Level27Result} from './Btlevel27api';

// // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // type Props={
// //   playerId:number;
// //   hints?:number;
// //   setHints?:(n:number)=>void;
// //   onExit:()=>void;
// //   onComplete?:(result:Level27Result)=>void;
// // };

// // const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));

// // export default function BTLevel27Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// //   const {width}=useWindowDimensions();
// //   const bw=Math.floor(clamp(width-48,240,380));   // board width
// //   const bh=Math.round(bw*0.62);                   // board height

// //   const [view,setView]=useState<Level27View|null>(null);
// //   const [loadErr,setLoadErr]=useState('');
// //   const [msg,setMsg]=useState('');
// //   const [typed,setTyped]=useState('');
// //   const [keypad,setKeypad]=useState(false);
// //   const [solved,setSolved]=useState('');
// //   const [done,setDone]=useState(false);
// //   const [result,setResult]=useState<Level27Result|null>(null);
// //   const [confirmSkip,setConfirmSkip]=useState(false);
// //   const [clueOpen,setClueOpen]=useState(false);
// //   const [clues,setClues]=useState<string[]>([]);

// //   const shake=useRef(new Animated.Value(0)).current;
// //   const pulse=useRef(new Animated.Value(0)).current;
// //   const pop=useRef(new Animated.Value(0)).current;
// //   const busy=useRef(false);
// //   const timers=useRef<any[]>([]);
// //   const msgTimer=useRef<any>(null);
// //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// //   const flash=(m:string)=>{
// //     setMsg(m);clearTimeout(msgTimer.current);
// //     msgTimer.current=setTimeout(()=>setMsg(''),2600);
// //   };
// //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// //   // 1. open the level: backend creates a session in SQL and sends the board
// //   const load=useCallback(()=>{
// //     setLoadErr('');setView(null);
// //     startLevel27(playerId)
// //       .then(v=>{
// //         setView(v);setTyped('');setSolved('');setDone(false);setResult(null);setClues([]);
// //         if(setHints&&typeof v.hints==='number')setHints(v.hints);
// //       })
// //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// //   },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

// //   useEffect(()=>{
// //     load();
// //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// //   },[load]);

// //   // the ? breathes so the player knows to tap it
// //   useEffect(()=>{
// //     const a=Animated.loop(Animated.sequence([
// //       Animated.timing(pulse,{toValue:1,duration:700,useNativeDriver:true}),
// //       Animated.timing(pulse,{toValue:0,duration:700,useNativeDriver:true})]));
// //     a.start();
// //     return()=>{a.stop()};
// //   },[]);

// //   useEffect(()=>{
// //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// //   },[result]);

// //   // 2. send the typed number; the backend checks it and saves the attempt
// //   const submit=async()=>{
// //     if(!typed||busy.current||done||!view)return;
// //     busy.current=true;
// //     try{
// //       const r=await answerLevel27({sessionId:view.sessionId,playerId,answer:Number(typed)});
// //       if(typeof r.hints==='number'&&setHints)setHints(r.hints);
// //       if(r.correct){
// //         setSolved(typed);setKeypad(false);setDone(true);setConfirmSkip(false);
// //         later(()=>setResult(r),1300);
// //       }else{
// //         doShake();flash('Not quite. Try again!');
// //         later(()=>setTyped(''),600);
// //       }
// //     }catch(e:any){
// //       flash(e.message||'Network error');
// //     }finally{busy.current=false}
// //   };

// //   // magnifier: costs 25, backend sends the next clue
// //   const onHint=async()=>{
// //     if(done||!view||busy.current)return;
// //     setConfirmSkip(false);
// //     busy.current=true;
// //     try{
// //       const r=await hintLevel27({sessionId:view.sessionId,playerId});
// //       if(typeof r.hints==='number'&&setHints)setHints(r.hints);
// //       setClues(c=>c.includes(r.clue)?c:[...c,r.clue]);
// //       setClueOpen(true);
// //     }catch(e:any){
// //       if(e.status===400&&clues.length)setClueOpen(true);
// //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// //     }finally{busy.current=false}
// //   };

// //   // video reward: only adds hints
// //   const onReward=async()=>{
// //     if(done||busy.current)return;
// //     setConfirmSkip(false);
// //     busy.current=true;
// //     try{
// //       const r=await rewardLevel27(playerId);
// //       setHints&&setHints(r.hints);
// //       flash('+'+r.added+' hints');
// //     }catch(e:any){
// //       flash(e.message||'Network error');
// //     }finally{busy.current=false}
// //   };

// //   // skip (50): tap twice
// //   const onSkip=async()=>{
// //     if(done||!view||busy.current)return;
// //     if(!confirmSkip){
// //       setConfirmSkip(true);
// //       flash('Skip costs 50 hints. Tap again to skip.');
// //       return;
// //     }
// //     busy.current=true;
// //     try{
// //       const r=await skipLevel27({sessionId:view.sessionId,playerId});
// //       setHints&&setHints(r.hints||0);
// //       setDone(true);
// //       onComplete?onComplete(r):onExit();
// //     }catch(e:any){
// //       setConfirmSkip(false);
// //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// //     }finally{busy.current=false}
// //   };

// //   const onDigit=(d:number)=>{if(!done)setTyped(x=>((x==='0'?'':x)+d).slice(0,3))};

// //   /* ---------- header ---------- */
// //   const header=(
// //     <View style={st.topBar}>
// //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
// //         <Icon n="home" s={16}/>
// //       </TouchableOpacity>

// //       <View style={st.signWrap}>
// //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// //         <View style={st.sign}>
// //           <Text style={st.signArrow}>{'<'}</Text>
// //           <Text style={st.signT}>LEVEL 27</Text>
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
// //           <Text style={st.load}>Loading level 27...</Text>
// //         </>}
// //       </View>
// //     </View></Stage>;
// //   }

// //   const digit=Math.round(bw*0.17);
// //   const qScale=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.14]});

// //   return <Stage bg="#bddaee"><View style={st.root}>
// //     <RoomBackground/>
// //     {header}

// //     <View style={st.center}>
// //       {/* question pill */}
// //       <View style={st.qPill}>
// //         <Text style={st.qArrow}>{'<'}</Text>
// //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// //         <Text style={st.qArrow}>{'>'}</Text>
// //       </View>

// //       {/* chalkboard with the number grid */}
// //       <Animated.View style={{transform:[{translateX:shake}]}}>
// //         <Chalkboard w={bw} h={bh}>
// //           {view.grid.map((row,ri)=>
// //             <View key={ri} style={st.row}>
// //               {row.map((v,ci)=>{
// //                 if(v!==null)return <View key={ci} style={st.cell}><ChalkDigit t={v} size={digit}/></View>;
// //                 // the missing number
// //                 const shown=solved||typed;
// //                 return <TouchableOpacity key={ci} style={st.cell} activeOpacity={0.8} disabled={done}
// //                   onPress={()=>{setKeypad(true);setConfirmSkip(false)}}>
// //                   <Animated.View style={{transform:[{scale:shown?1:qScale}]}}>
// //                     <ChalkDigit t={shown||'?'} size={digit} color={solved?'#ffe27a':shown?'#ffffff':'#1f2f78'}/>
// //                   </Animated.View>
// //                 </TouchableOpacity>;
// //               })}
// //             </View>)}
// //         </Chalkboard>
// //       </Animated.View>

// //       {!done&&<Text style={st.tap}>Tap the ? to type your answer</Text>}
// //     </View>

// //     {/* bottom rounded panel */}
// //     <View style={st.panel}>
// //       <View style={st.btnCol}>
// //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
// //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
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

// //     {/* number pad */}
// //     {keypad&&!done&&<View style={st.overlay}>
// //       <Animated.View style={[st.padCard,{transform:[{translateX:shake}]}]}>
// //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>{setKeypad(false);setTyped('')}}>
// //           <Text style={st.closeT}>✕</Text>
// //         </TouchableOpacity>
// //         <Text style={st.padTitle}>Your answer</Text>

// //         <View style={st.padRow}>
// //           <TouchableOpacity style={[st.side,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={st.sideT}>⌫</Text></TouchableOpacity>
// //           <View style={st.display}><Text style={st.displayT}>{typed}</Text></View>
// //           <TouchableOpacity style={[st.side,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed} onPress={submit}><Text style={st.sideT}>✓</Text></TouchableOpacity>
// //         </View>

// //         {[[1,2,3,4,5],[6,7,8,9,0]].map(r=>
// //           <View key={r[0]} style={st.padRow}>
// //             {r.map(d=><TouchableOpacity key={d} style={st.key} activeOpacity={0.8} onPress={()=>onDigit(d)}><Text style={st.keyT}>{d}</Text></TouchableOpacity>)}
// //           </View>)}
// //       </Animated.View>
// //     </View>}

// //     {/* CLUES popup */}
// //     {clueOpen&&<View style={st.overlay}>
// //       <View style={st.clueCard}>
// //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
// //           <Text style={st.closeT}>✕</Text>
// //         </TouchableOpacity>
// //         <Text style={st.clueTitle}>CLUES</Text>
// //         {clues.map((c,i)=>
// //           <View key={i} style={[st.clueRow,st.clueRowOpen]}>
// //             <View style={st.clueNum}><Text style={st.clueNumT}>{i+1}</Text></View>
// //             <View style={{flex:1}}>
// //               <Text style={st.clueHead}>{'Clue '+(i+1)}</Text>
// //               <Text style={st.clueBody}>{c}</Text>
// //             </View>
// //           </View>)}
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
// //    STYLES
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
// //   qPill:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,backgroundColor:THEME.cream,borderRadius:30,paddingVertical:14,paddingHorizontal:20,marginBottom:16,minWidth:260,maxWidth:380},
// //   qArrow:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.orange},
// //   q:{flexShrink:1,fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy,textAlign:'center'},
// //   tap:{fontFamily:FONT,fontSize:15,fontStyle:'italic',color:THEME.navy,marginTop:14,opacity:0.8},

// //   row:{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginVertical:4},
// //   cell:{width:'30%',height:70,alignItems:'center',justifyContent:'center'},

// //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// //   btnCol:{alignItems:'center'},
// //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// //   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},

// //   padCard:{width:'86%',maxWidth:360,alignItems:'center',backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:14,paddingTop:16,paddingBottom:14,gap:10},
// //   padTitle:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.navy},
// //   padRow:{flexDirection:'row',alignItems:'center',gap:8},
// //   side:{width:42,height:42,borderRadius:21,borderWidth:2,borderColor:'#10245e',alignItems:'center',justifyContent:'center'},
// //   sideT:{fontSize:20,fontWeight:'900',color:'#10245e'},
// //   display:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:'#10245e',backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:4},
// //   displayT:{fontFamily:FONT,fontSize:30,fontWeight:'900',color:'#10245e'},
// //   key:{width:46,height:46,borderRadius:23,borderWidth:2.5,borderColor:'#10245e',backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},
// //   keyT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:'#10245e'},

// //   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
// //   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
// //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
// //   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
// //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:12,paddingHorizontal:14,marginBottom:10},
// //   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
// //   clueNum:{width:46,height:46,borderRadius:23,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// //   clueNumT:{fontFamily:FONT,fontSize:24,fontWeight:'900',color:'#fff'},
// //   clueHead:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#c0702b'},
// //   clueBody:{fontFamily:FONT,fontSize:15,fontStyle:'italic',color:THEME.navy,marginTop:2},

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
// import {View,Text,TextInput,TouchableOpacity,Animated,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// import {Stage,Coin} from './BTShared';
// import {Icon} from './Art';
// import {BigStar} from './Btlevel7art';
// import {RoomBackground,THEME} from './Btlevel4Theme';
// import {Chalkboard,ChalkDigit} from './Btlevel27art';
// import {startLevel27,answerLevel27,hintLevel27,skipLevel27,rewardLevel27,Level27View,Level27Result} from './Btlevel27api';

// const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// type Props={
//   playerId:number;
//   hints?:number;
//   setHints?:(n:number)=>void;
//   onExit:()=>void;
//   onComplete?:(result:Level27Result)=>void;
// };

// const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));

// export default function BTLevel27Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
//   const {width}=useWindowDimensions();
//   const bw=Math.floor(clamp(width-48,240,380));   // board width
//   const bh=Math.round(bw*0.62);                   // board height

//   const [view,setView]=useState<Level27View|null>(null);
//   const [loadErr,setLoadErr]=useState('');
//   const [msg,setMsg]=useState('');
//   const [typed,setTyped]=useState('');
//   const [keypad,setKeypad]=useState(false);
//   const [solved,setSolved]=useState('');
//   const [done,setDone]=useState(false);
//   const [result,setResult]=useState<Level27Result|null>(null);
//   const [confirmSkip,setConfirmSkip]=useState(false);
//   const [clueOpen,setClueOpen]=useState(false);
//   const [clues,setClues]=useState<string[]>([]);

//   const shake=useRef(new Animated.Value(0)).current;
//   const pulse=useRef(new Animated.Value(0)).current;
//   const pop=useRef(new Animated.Value(0)).current;
//   const busy=useRef(false);
//   const timers=useRef<any[]>([]);
//   const msgTimer=useRef<any>(null);
//   const inputRef=useRef<TextInput>(null);
//   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

//   const flash=(m:string)=>{
//     setMsg(m);clearTimeout(msgTimer.current);
//     msgTimer.current=setTimeout(()=>setMsg(''),2600);
//   };
//   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
//     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

//   // 1. open the level: backend creates a session in SQL and sends the board
//   const load=useCallback(()=>{
//     setLoadErr('');setView(null);
//     startLevel27(playerId)
//       .then(v=>{
//         setView(v);setTyped('');setSolved('');setDone(false);setResult(null);setClues([]);
//         if(setHints&&typeof v.hints==='number')setHints(v.hints);
//       })
//       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
//   },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(()=>{
//     load();
//     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
//   },[load]);

//   // the ? breathes so the player knows to tap it
//   useEffect(()=>{
//     const a=Animated.loop(Animated.sequence([
//       Animated.timing(pulse,{toValue:1,duration:700,useNativeDriver:true}),
//       Animated.timing(pulse,{toValue:0,duration:700,useNativeDriver:true})]));
//     a.start();
//     return()=>{a.stop()};
//   },[]);

//   useEffect(()=>{
//     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
//   },[result]);

//   // open the answer box and pop up the system keyboard
//   const openInput=()=>{
//     if(done)return;
//     setKeypad(true);setConfirmSkip(false);
//     later(()=>inputRef.current?.focus(),150);
//   };
//   const closeInput=()=>{
//     inputRef.current?.blur();
//     setKeypad(false);setTyped('');
//   };

//   // 2. send the typed number; the backend checks it and saves the attempt
//   const submit=async()=>{
//     if(!typed||busy.current||done||!view)return;
//     busy.current=true;
//     try{
//       const r=await answerLevel27({sessionId:view.sessionId,playerId,answer:Number(typed)});
//       if(typeof r.hints==='number'&&setHints)setHints(r.hints);
//       if(r.correct){
//         inputRef.current?.blur();
//         setSolved(typed);setKeypad(false);setDone(true);setConfirmSkip(false);
//         later(()=>setResult(r),1300);
//       }else{
//         doShake();flash('Not quite. Try again!');
//         later(()=>{setTyped('');inputRef.current?.focus()},600);
//       }
//     }catch(e:any){
//       flash(e.message||'Network error');
//     }finally{busy.current=false}
//   };

//   // magnifier: costs 25, backend sends the next clue
//   const onHint=async()=>{
//     if(done||!view||busy.current)return;
//     setConfirmSkip(false);
//     busy.current=true;
//     try{
//       const r=await hintLevel27({sessionId:view.sessionId,playerId});
//       if(typeof r.hints==='number'&&setHints)setHints(r.hints);
//       setClues(c=>c.includes(r.clue)?c:[...c,r.clue]);
//       setClueOpen(true);
//     }catch(e:any){
//       if(e.status===400&&clues.length)setClueOpen(true);
//       flash(e.status===402?'Not enough hints':e.message||'Network error');
//     }finally{busy.current=false}
//   };

//   // video reward: only adds hints
//   const onReward=async()=>{
//     if(done||busy.current)return;
//     setConfirmSkip(false);
//     busy.current=true;
//     try{
//       const r=await rewardLevel27(playerId);
//       setHints&&setHints(r.hints);
//       flash('+'+r.added+' hints');
//     }catch(e:any){
//       flash(e.message||'Network error');
//     }finally{busy.current=false}
//   };

//   // skip (50): tap twice
//   const onSkip=async()=>{
//     if(done||!view||busy.current)return;
//     if(!confirmSkip){
//       setConfirmSkip(true);
//       flash('Skip costs 50 hints. Tap again to skip.');
//       return;
//     }
//     busy.current=true;
//     try{
//       const r=await skipLevel27({sessionId:view.sessionId,playerId});
//       setHints&&setHints(r.hints||0);
//       setDone(true);
//       onComplete?onComplete(r):onExit();
//     }catch(e:any){
//       setConfirmSkip(false);
//       flash(e.status===402?'Not enough hints':e.message||'Network error');
//     }finally{busy.current=false}
//   };

//   // only digits, max 3
//   const onChangeText=(t:string)=>{if(!done)setTyped(t.replace(/[^0-9]/g,'').slice(0,3))};

//   /* ---------- header ---------- */
//   const header=(
//     <View style={st.topBar}>
//       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
//         <Icon n="home" s={16}/>
//       </TouchableOpacity>

//       <View style={st.signWrap}>
//         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
//         <View style={st.sign}>
//           <Text style={st.signArrow}>{'<'}</Text>
//           <Text style={st.signT}>LEVEL 27</Text>
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
//           <Text style={st.load}>Loading level 27...</Text>
//         </>}
//       </View>
//     </View></Stage>;
//   }

//   const digit=Math.round(bw*0.17);
//   const qScale=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.14]});

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

//       {/* chalkboard with the number grid */}
//       <Animated.View style={{transform:[{translateX:shake}]}}>
//         <Chalkboard w={bw} h={bh}>
//           {view.grid.map((row,ri)=>
//             <View key={ri} style={st.row}>
//               {row.map((v,ci)=>{
//                 if(v!==null)return <View key={ci} style={st.cell}><ChalkDigit t={v} size={digit}/></View>;
//                 // the missing number
//                 const shown=solved||typed;
//                 return <TouchableOpacity key={ci} style={st.cell} activeOpacity={0.8} disabled={done}
//                   onPress={openInput}>
//                   <Animated.View style={{transform:[{scale:shown?1:qScale}]}}>
//                     <ChalkDigit t={shown||'?'} size={digit} color={solved?'#ffe27a':shown?'#ffffff':'#1f2f78'}/>
//                   </Animated.View>
//                 </TouchableOpacity>;
//               })}
//             </View>)}
//         </Chalkboard>
//       </Animated.View>

//       {!done&&<Text style={st.tap}>Tap the ? to type your answer</Text>}
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
//         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
//       </View>

//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
//           <View style={st.circleRed}><Icon n="play" s={30}/></View>
//         </TouchableOpacity>
//         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
//       </View>
//     </View>

//     {/* answer box: uses the SYSTEM keyboard. type the number, press Enter or the tick */}
//     {keypad&&!done&&<View style={[st.overlay,st.overlayTop]}>
//       <Animated.View style={[st.padCard,{transform:[{translateX:shake}]}]}>
//         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={closeInput}>
//           <Text style={st.closeT}>✕</Text>
//         </TouchableOpacity>
//         <Text style={st.padTitle}>Your answer</Text>

//         <View style={st.padRow}>
//           <TouchableOpacity style={[st.side,{backgroundColor:'#e8523f'}]} onPress={()=>{setTyped('');inputRef.current?.focus()}}><Text style={st.sideT}>⌫</Text></TouchableOpacity>
//           <TextInput
//             ref={inputRef}
//             style={st.input}
//             value={typed}
//             onChangeText={onChangeText}
//             onSubmitEditing={submit}
//             keyboardType="number-pad"
//             inputMode="numeric"
//             returnKeyType="done"
//             maxLength={3}
//             autoFocus
//             blurOnSubmit={false}
//             placeholder="?"
//             placeholderTextColor="#9aa3c7"
//             textAlign="center"
//             // @ts-ignore web only: removes the focus outline
//             underlineColorAndroid="transparent"
//           />
//           <TouchableOpacity style={[st.side,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed} onPress={submit}><Text style={st.sideT}>✓</Text></TouchableOpacity>
//         </View>
//       </Animated.View>
//     </View>}

//     {/* CLUES popup */}
//     {clueOpen&&<View style={st.overlay}>
//       <View style={st.clueCard}>
//         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
//           <Text style={st.closeT}>✕</Text>
//         </TouchableOpacity>
//         <Text style={st.clueTitle}>CLUES</Text>
//         {clues.map((c,i)=>
//           <View key={i} style={[st.clueRow,st.clueRowOpen]}>
//             <View style={st.clueNum}><Text style={st.clueNumT}>{i+1}</Text></View>
//             <View style={{flex:1}}>
//               <Text style={st.clueHead}>{'Clue '+(i+1)}</Text>
//               <Text style={st.clueBody}>{c}</Text>
//             </View>
//           </View>)}
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
//   qPill:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,backgroundColor:THEME.cream,borderRadius:30,paddingVertical:14,paddingHorizontal:20,marginBottom:16,minWidth:260,maxWidth:380},
//   qArrow:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.orange},
//   q:{flexShrink:1,fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy,textAlign:'center'},
//   tap:{fontFamily:FONT,fontSize:15,fontStyle:'italic',color:THEME.navy,marginTop:14,opacity:0.8},

//   row:{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginVertical:4},
//   cell:{width:'30%',height:70,alignItems:'center',justifyContent:'center'},

//   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
//     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
//   btnCol:{alignItems:'center'},
//   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
//   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
//   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
//   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
//   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
//   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

//   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
//   // answer box sits near the top so the system keyboard does not cover it
//   overlayTop:{justifyContent:'flex-start',paddingTop:150},

//   padCard:{width:'86%',maxWidth:360,alignItems:'center',backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:14,paddingTop:16,paddingBottom:16,gap:12},
//   padTitle:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.navy},
//   padRow:{flexDirection:'row',alignItems:'center',gap:8},
//   side:{width:42,height:42,borderRadius:21,borderWidth:2,borderColor:'#10245e',alignItems:'center',justifyContent:'center'},
//   sideT:{fontSize:20,fontWeight:'900',color:'#10245e'},
//   input:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:'#10245e',backgroundColor:'#fff',marginHorizontal:4,
//     fontFamily:FONT,fontSize:30,fontWeight:'900',color:'#10245e',paddingVertical:0,paddingHorizontal:8},

//   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
//   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
//   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
//   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
//   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:12,paddingHorizontal:14,marginBottom:10},
//   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
//   clueNum:{width:46,height:46,borderRadius:23,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
//   clueNumT:{fontFamily:FONT,fontSize:24,fontWeight:'900',color:'#fff'},
//   clueHead:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#c0702b'},
//   clueBody:{fontFamily:FONT,fontSize:15,fontStyle:'italic',color:THEME.navy,marginTop:2},

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
import {View,Text,TouchableOpacity,Animated,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
import {Stage,Coin} from './BTShared';
import {Icon} from './Art';
import {BigStar} from './Btlevel7art';
import {RoomBackground,THEME} from './Btlevel4Theme';
import {Chalkboard,ChalkDigit} from './Btlevel27art';
import {startLevel27,answerLevel27,hintLevel27,skipLevel27,rewardLevel27,Level27View,Level27Result} from './Btlevel27api';

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level27Result)=>void;
};

const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));

// computer-style keyboard: numbers, letters, symbols
const BACK='⌫';
const KEY_ROWS:string[][]=[
  '1234567890'.split(''),
  'QWERTYUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  [...'ZXCVBNM'.split(''),BACK],
  ['+','-','×','÷','=','(',')','.','!','?'],
];
const MAX_LEN=3;

export default function BTLevel27Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width}=useWindowDimensions();
  const bw=Math.floor(clamp(width-48,240,380));   // board width
  const bh=Math.round(bw*0.62);                   // board height

  // keyboard key size: 10 keys per row
  const kbW=Math.min(width,420)-16;
  const GAP=5;
  const kw=Math.floor((kbW-GAP*9-16)/10);

  const [view,setView]=useState<Level27View|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [typed,setTyped]=useState('');
  const [keypad,setKeypad]=useState(false);
  const [solved,setSolved]=useState('');
  const [done,setDone]=useState(false);
  const [result,setResult]=useState<Level27Result|null>(null);
  const [confirmSkip,setConfirmSkip]=useState(false);
  const [clueOpen,setClueOpen]=useState(false);
  const [clues,setClues]=useState<string[]>([]);

  const shake=useRef(new Animated.Value(0)).current;
  const pulse=useRef(new Animated.Value(0)).current;
  const pop=useRef(new Animated.Value(0)).current;
  const busy=useRef(false);
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  const flash=(m:string)=>{
    setMsg(m);clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2600);
  };
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
    Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  // 1. open the level: backend creates a session in SQL and sends the board
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel27(playerId)
      .then(v=>{
        setView(v);setTyped('');setSolved('');setDone(false);setResult(null);setClues([]);
        if(setHints&&typeof v.hints==='number')setHints(v.hints);
      })
      .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
  },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{
    load();
    return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
  },[load]);

  // the ? breathes so the player knows to tap it
  useEffect(()=>{
    const a=Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:700,useNativeDriver:true}),
      Animated.timing(pulse,{toValue:0,duration:700,useNativeDriver:true})]));
    a.start();
    return()=>{a.stop()};
  },[]);

  useEffect(()=>{
    if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
  },[result]);

  // 2. send the typed key; the backend checks it and saves the attempt
  const submit=async()=>{
    if(!typed||busy.current||done||!view)return;
    busy.current=true;
    try{
      const r=await answerLevel27({sessionId:view.sessionId,playerId,answer:typed as any});
      if(typeof r.hints==='number'&&setHints)setHints(r.hints);
      if(r.correct){
        setSolved(typed);setKeypad(false);setDone(true);setConfirmSkip(false);
        later(()=>setResult(r),1300);
      }else{
        doShake();flash('Not quite. Try again!');
        later(()=>setTyped(''),600);
      }
    }catch(e:any){
      flash(e.message||'Network error');
    }finally{busy.current=false}
  };

  // magnifier: costs 25, backend sends the next clue
  const onHint=async()=>{
    if(done||!view||busy.current)return;
    setConfirmSkip(false);
    busy.current=true;
    try{
      const r=await hintLevel27({sessionId:view.sessionId,playerId});
      if(typeof r.hints==='number'&&setHints)setHints(r.hints);
      setClues(c=>c.includes(r.clue)?c:[...c,r.clue]);
      setClueOpen(true);
    }catch(e:any){
      if(e.status===400&&clues.length)setClueOpen(true);
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }finally{busy.current=false}
  };

  // video reward: only adds hints
  const onReward=async()=>{
    if(done||busy.current)return;
    setConfirmSkip(false);
    busy.current=true;
    try{
      const r=await rewardLevel27(playerId);
      setHints&&setHints(r.hints);
      flash('+'+r.added+' hints');
    }catch(e:any){
      flash(e.message||'Network error');
    }finally{busy.current=false}
  };

  // skip (50): tap twice
  const onSkip=async()=>{
    if(done||!view||busy.current)return;
    if(!confirmSkip){
      setConfirmSkip(true);
      flash('Skip costs 50 hints. Tap again to skip.');
      return;
    }
    busy.current=true;
    try{
      const r=await skipLevel27({sessionId:view.sessionId,playerId});
      setHints&&setHints(r.hints||0);
      setDone(true);
      onComplete?onComplete(r):onExit();
    }catch(e:any){
      setConfirmSkip(false);
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }finally{busy.current=false}
  };

  // keyboard press
  const onKey=(k:string)=>{
    if(done)return;
    if(k===BACK)setTyped(x=>x.slice(0,-1));
    else setTyped(x=>(x+k).slice(0,MAX_LEN));
  };

  /* ---------- header ---------- */
  const header=(
    <View style={st.topBar}>
      <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
        <Icon n="home" s={16}/>
      </TouchableOpacity>

      <View style={st.signWrap}>
        <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
        <View style={st.sign}>
          <Text style={st.signArrow}>{'<'}</Text>
          <Text style={st.signT}>LEVEL 27</Text>
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
          <Text style={st.load}>Loading level 27...</Text>
        </>}
      </View>
    </View></Stage>;
  }

  const digit=Math.round(bw*0.17);
  const qScale=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.14]});
  const kbOpen=keypad&&!done;

  return <Stage bg="#bddaee"><View style={st.root}>
    <RoomBackground/>
    {header}

    <View style={[st.center,kbOpen&&{paddingBottom:300}]}>
      {/* question pill */}
      <View style={st.qPill}>
        <Text style={st.qArrow}>{'<'}</Text>
        <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
        <Text style={st.qArrow}>{'>'}</Text>
      </View>

      {/* chalkboard with the number grid */}
      <Animated.View style={{transform:[{translateX:shake}]}}>
        <Chalkboard w={bw} h={bh}>
          {view.grid.map((row,ri)=>
            <View key={ri} style={st.row}>
              {row.map((v,ci)=>{
                if(v!==null)return <View key={ci} style={st.cell}><ChalkDigit t={v} size={digit}/></View>;
                // the missing one
                const shown=solved||typed;
                return <TouchableOpacity key={ci} style={st.cell} activeOpacity={0.8} disabled={done}
                  onPress={()=>{setKeypad(true);setConfirmSkip(false)}}>
                  <Animated.View style={{transform:[{scale:shown?1:qScale}]}}>
                    <ChalkDigit t={shown||'?'} size={digit} color={solved?'#ffe27a':shown?'#ffffff':'#1f2f78'}/>
                  </Animated.View>
                </TouchableOpacity>;
              })}
            </View>)}
        </Chalkboard>
      </Animated.View>

      {!done&&<Text style={st.tap}>Tap the ? to type your answer</Text>}
    </View>

    {/* bottom rounded panel */}
    {!kbOpen&&<View style={st.panel}>
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
        <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
          <View style={st.circleRed}><Icon n="play" s={30}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
      </View>
    </View>}

    {/* keyboard: numbers, letters, symbols. tap a key, then the tick */}
    {kbOpen&&<Animated.View style={[st.kb,{width:kbW+16,transform:[{translateX:shake}]}]}>
      <View style={st.kbTop}>
        <TouchableOpacity style={[st.side,{backgroundColor:'#ffd35c'}]} activeOpacity={0.85} onPress={()=>{setKeypad(false);setTyped('')}}>
          <Text style={st.sideT}>✕</Text>
        </TouchableOpacity>
        <View style={st.display}><Text style={st.displayT}>{typed}</Text></View>
        <TouchableOpacity style={[st.side,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed} activeOpacity={0.85} onPress={submit}>
          <Text style={st.sideT}>✓</Text>
        </TouchableOpacity>
      </View>

      {KEY_ROWS.map((r,ri)=>
        <View key={ri} style={[st.kbRow,{gap:GAP}]}>
          {r.map(k=>{
            const back=k===BACK;
            return <TouchableOpacity key={k} activeOpacity={0.8} onPress={()=>onKey(k)}
              style={[st.key,{width:kw,height:Math.max(36,kw+4)},back&&st.keyBack]}>
              <Text style={[st.keyT,{fontSize:Math.max(15,Math.round(kw*0.5))}]}>{k}</Text>
            </TouchableOpacity>;
          })}
        </View>)}
    </Animated.View>}

    {/* CLUES popup */}
    {clueOpen&&<View style={st.overlay}>
      <View style={st.clueCard}>
        <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
          <Text style={st.closeT}>✕</Text>
        </TouchableOpacity>
        <Text style={st.clueTitle}>CLUES</Text>
        {clues.map((c,i)=>
          <View key={i} style={[st.clueRow,st.clueRowOpen]}>
            <View style={st.clueNum}><Text style={st.clueNumT}>{i+1}</Text></View>
            <View style={{flex:1}}>
              <Text style={st.clueHead}>{'Clue '+(i+1)}</Text>
              <Text style={st.clueBody}>{c}</Text>
            </View>
          </View>)}
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
  qPill:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,backgroundColor:THEME.cream,borderRadius:30,paddingVertical:14,paddingHorizontal:20,marginBottom:16,minWidth:260,maxWidth:380},
  qArrow:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.orange},
  q:{flexShrink:1,fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy,textAlign:'center'},
  tap:{fontFamily:FONT,fontSize:15,fontStyle:'italic',color:THEME.navy,marginTop:14,opacity:0.8},

  row:{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginVertical:4},
  cell:{width:'30%',height:70,alignItems:'center',justifyContent:'center'},

  panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
    flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
  btnCol:{alignItems:'center'},
  ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
  circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
  ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
  circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
  badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
  badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

  overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},

  // keyboard
  kb:{position:'absolute',bottom:0,alignSelf:'center',alignItems:'center',backgroundColor:'#f9efdf',borderTopWidth:5,borderLeftWidth:5,borderRightWidth:5,borderColor:'#e8912e',
    borderTopLeftRadius:26,borderTopRightRadius:26,paddingHorizontal:8,paddingTop:10,paddingBottom:14,gap:7,zIndex:50},
  kbTop:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,marginBottom:2},
  kbRow:{flexDirection:'row',justifyContent:'center'},
  side:{width:42,height:42,borderRadius:21,borderWidth:2,borderColor:'#10245e',alignItems:'center',justifyContent:'center'},
  sideT:{fontSize:20,fontWeight:'900',color:'#10245e'},
  display:{width:130,height:50,borderRadius:25,borderWidth:2.5,borderColor:'#10245e',backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
  displayT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#10245e'},
  key:{borderRadius:10,borderWidth:2,borderColor:'#10245e',backgroundColor:'#fdf6e6',alignItems:'center',justifyContent:'center'},
  keyBack:{backgroundColor:'#ffd9d9'},
  keyT:{fontFamily:FONT,fontWeight:'900',color:'#10245e'},

  clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
  clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
  closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
  closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
  clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:12,paddingHorizontal:14,marginBottom:10},
  clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
  clueNum:{width:46,height:46,borderRadius:23,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
  clueNumT:{fontFamily:FONT,fontSize:24,fontWeight:'900',color:'#fff'},
  clueHead:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#c0702b'},
  clueBody:{fontFamily:FONT,fontSize:15,fontStyle:'italic',color:THEME.navy,marginTop:2},

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
