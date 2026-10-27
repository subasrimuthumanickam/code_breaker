
// // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Animated,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // import {F,INK,Coin} from './BTShared';
// // import {Icon} from './Art';
// // import {Backdrop,Grid} from './Btlevel19art';
// // import {startLevel19,answerLevel19,hintLevel19,skipLevel19,rewardLevel19,Level19View,Level19Result} from './Btlevel19api';

// // type Props={
// //   playerId:number;
// //   hints?:number;
// //   setHints?:(n:number)=>void;
// //   onExit:()=>void;
// //   onComplete?:(result:Level19Result)=>void;
// // };

// // const NAVY='#1b2a5c';
// // const PINK='#ff5a7a';

// // export default function BTLevel19Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// //   const {width,height}=useWindowDimensions();
// //   const CW=Math.min(width-24,380);                 // card width
// //   // size of one drawing: smaller on short screens, so SUBMIT always stays above the tray
// //   const FS=Math.max(52,Math.min(74,Math.floor((height-470)/4.6),Math.floor((CW-60)/2.3)));

// //   const [view,setView]=useState<Level19View|null>(null);
// //   const [sessionId,setSessionId]=useState<number|null>(null);
// //   const [loadErr,setLoadErr]=useState('');
// //   const [msg,setMsg]=useState('');
// //   const [done,setDone]=useState(false);
// //   const [count,setCount]=useState(0);
// //   const [ov,setOv]=useState<string|null>(null);       // check / cross over the number
// //   const [confirmSkip,setConfirmSkip]=useState(false);

// //   const shake=useRef(new Animated.Value(0)).current;
// //   const sway=useRef(new Animated.Value(0)).current;

// //   const doneRef=useRef(false);
// //   const busyRef=useRef(false);
// //   const timers=useRef<any[]>([]);
// //   const msgTimer=useRef<any>(null);
// //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// //   const flash=(m:string)=>{
// //     setMsg(m);clearTimeout(msgTimer.current);
// //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// //   };
// //   const doShake=()=>Animated.sequence([8,-8,5,-5,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// //   // 1. open the level - the backend makes a new game
// //   const load=useCallback(()=>{
// //     setLoadErr('');setView(null);
// //     startLevel19(playerId)
// //       .then(v=>{
// //         doneRef.current=false;busyRef.current=false;
// //         setDone(false);setOv(null);setCount(0);
// //         setSessionId(v.sessionId);
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
// //     const a=Animated.loop(Animated.sequence([
// //       Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
// //       Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
// //     a.start();
// //     return()=>a.stop();
// //   },[]);

// //   // 2. SUBMIT: send the number, the backend says if it is right
// //   const submit=async()=>{
// //     if(doneRef.current||busyRef.current||!sessionId)return;
// //     busyRef.current=true;
// //     setConfirmSkip(false);
// //     try{
// //       const r=await answerLevel19({sessionId,playerId,answer:count});
// //       if(r.correct){
// //         doneRef.current=true;
// //         setDone(true);setOv('check');
// //         if(setHints&&typeof r.hints==='number')setHints(r.hints);
// //         later(()=>{onComplete?onComplete(r):onExit()},1100);
// //       }else{
// //         doShake();
// //         setOv('cross');
// //         flash(r.message||'Not quite. Try again!');
// //         later(()=>setOv(null),800);
// //       }
// //     }catch(e:any){
// //       flash(e.message||'Network error');
// //     }finally{
// //       busyRef.current=false;
// //     }
// //   };

// //   // magnifier: a clue about the pattern (25 hints)
// //   const onHint=async()=>{
// //     if(done||!sessionId)return;
// //     setConfirmSkip(false);
// //     try{
// //       const r=await hintLevel19({sessionId,playerId});
// //       setHints&&setHints(r.hints);
// //       flash(r.text);
// //     }catch(e:any){
// //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// //     }
// //   };

// //   // video reward (+75 hints)
// //   const onReward=async()=>{
// //     if(done)return;
// //     setConfirmSkip(false);
// //     try{
// //       const r=await rewardLevel19(playerId);
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
// //       const r=await skipLevel19({sessionId,playerId});
// //       setHints&&setHints(r.hints||0);
// //       doneRef.current=true;
// //       onComplete?onComplete(r):onExit();
// //     }catch(e:any){
// //       setConfirmSkip(false);
// //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// //     }
// //   };

// //   /* ---------- loading / error ---------- */

// //   if(loadErr||!view){
// //     return <View style={s.root}>
// //       <Backdrop/>
// //       <View style={s.center}>
// //         {loadErr?<>
// //           <Text style={s.err}>{loadErr}</Text>
// //           <TouchableOpacity style={s.retry} onPress={load}><Text style={s.retryT}>Try again</Text></TouchableOpacity>
// //           <TouchableOpacity onPress={onExit}><Text style={s.back}>Back</Text></TouchableOpacity>
// //         </>:<>
// //           <ActivityIndicator size="large" color={NAVY}/>
// //           <Text style={s.load}>Loading level 19...</Text>
// //         </>}
// //       </View>
// //     </View>;
// //   }

// //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
// //   const top=view.figures.slice(0,2),bottom=view.figures.slice(2);

// //   // one drawing: the number is written under it, the "?" is written inside it
// //   const fig=(f:{lines:number;label:string},i:number)=><View key={i} style={s.fig}>
// //     <Grid lines={f.lines} size={FS} mark={f.label==='?'?'?':undefined}/>
// //     {f.label!=='?'&&<Text style={s.figNum}>{f.label}</Text>}
// //   </View>;

// //   return <View style={s.root}>
// //     <Backdrop/>

// //     {/* top bar */}
// //     <View style={s.top}>
// //       <View style={s.topL}>
// //         <TouchableOpacity style={s.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
// //         <View style={s.round}><Icon n="gear" s={16}/></View>
// //       </View>
// //       <Animated.View style={[s.signWrap,{transform:[{rotate:swayR}]}]}>
// //         <View style={[s.leaf,{left:-14,top:-4,transform:[{rotate:'-30deg'}]}]}/>
// //         <View style={[s.leaf,{right:-14,top:-4,transform:[{rotate:'30deg'}]}]}/>
// //         <View style={[s.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[s.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
// //         <View style={s.sign}>
// //           <Text style={s.chev}>{'<'}</Text>
// //           <Text style={s.signt}>LEVEL 19</Text>
// //           <Text style={s.chev}>{'>'}</Text>
// //         </View>
// //       </Animated.View>
// //       <View style={s.topR}><View style={s.bpill}><Text style={s.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
// //     </View>

// //     {/* question */}
// //     <View style={s.qWrap}>
// //       <View style={s.qPill}>
// //         <Text style={s.qChev}>{'<'}</Text>
// //         <Text style={[s.qText,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// //         <Text style={s.qChev}>{'>'}</Text>
// //       </View>
// //     </View>

// //     <Animated.View style={[s.cardWrap,{transform:[{translateX:shake}]}]}>
// //       {/* the picture puzzle */}
// //       <View style={[s.card,{width:CW}]}>
// //         <View style={s.row}>{top.map(fig)}</View>
// //         <View style={s.row}>{bottom.map(fig)}</View>
// //       </View>

// //       {/* number + submit */}
// //       <View style={s.crow}>
// //         <TouchableOpacity style={s.cbtn} disabled={done} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={s.cbt}>−</Text></TouchableOpacity>
// //         <View style={s.cnumBox}>
// //           <Text style={s.cnum}>{count}</Text>
// //           {!!ov&&<View pointerEvents="none" style={s.cov}><Icon n={ov} s={56}/></View>}
// //         </View>
// //         <TouchableOpacity style={s.cbtn} disabled={done} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={s.cbt}>+</Text></TouchableOpacity>
// //       </View>
// //       <TouchableOpacity style={s.submit} disabled={done} onPress={submit}><Text style={s.subt}>SUBMIT</Text></TouchableOpacity>
// //     </Animated.View>

// //     {/* tray with hint / video / skip */}
// //     <View style={s.tray}>
// //       <View style={s.acol}>
// //         <TouchableOpacity style={s.hintBtn} onPress={onHint}><Icon n="search" s={34}/></TouchableOpacity>
// //       </View>
// //       <View style={s.acol}>
// //         <TouchableOpacity style={s.videoBtn} onPress={onReward}><Icon n="film" s={40}/></TouchableOpacity>
// //       </View>
// //       <View style={s.acol}>
// //         <TouchableOpacity style={s.skipBtn} onPress={onSkip}><Icon n="play" s={36}/></TouchableOpacity>
// //       </View>
// //     </View>
// //     <View style={s.labels}>
// //       <View style={s.lblPill}><Icon n="bulb" s={14}/><Text style={s.lbl}>25</Text></View>
// //       <View style={s.lblPill}><Coin s={14}/><Text style={s.lbl}>+75</Text></View>
// //       <View style={s.lblPill}><Icon n="bulb" s={14}/><Text style={s.lbl}>50</Text></View>
// //     </View>
// //   </View>;
// // }

// // /* =========================================================
// //    STYLES  (bright room like level 1, no pencil or eraser)
// // ========================================================= */

// // const s=StyleSheet.create({
// //   root:{flex:1,backgroundColor:'#bfe0f7',overflow:'hidden'},
// //   center:{flex:1,alignItems:'center',justifyContent:'center'},

// //   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:34,paddingHorizontal:10},
// //   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
// //   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
// //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// //   signWrap:{alignItems:'center',paddingTop:14},
// //   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
// //   leaf:{position:'absolute',width:26,height:16,borderRadius:10,backgroundColor:'#6fc23e',zIndex:2},
// //   sign:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#9a5a22',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:12,paddingVertical:6},
// //   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
// //   chev:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#ffd84d'},
// //   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
// //   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},

// //   qWrap:{alignItems:'center',marginTop:14,paddingHorizontal:12},
// //   qPill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#fbf1dd',borderRadius:30,paddingHorizontal:16,paddingVertical:10,maxWidth:'100%'},
// //   qChev:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#f2a900'},
// //   qText:{flexShrink:1,fontFamily:F,fontSize:19,fontWeight:'700',color:NAVY,textAlign:'center'},

// //   cardWrap:{alignItems:'center',marginTop:10},
// //   card:{backgroundColor:'#fffdf8',borderWidth:3,borderColor:'#d9c9a8',borderRadius:14,paddingVertical:6,paddingHorizontal:10},
// //   row:{flexDirection:'row',justifyContent:'center',gap:56},
// //   fig:{alignItems:'center',minWidth:70},
// //   figNum:{fontFamily:F,fontSize:24,fontWeight:'900',color:PINK,marginTop:-6,marginBottom:0,lineHeight:28},

// //   crow:{flexDirection:'row',alignItems:'center',gap:18,marginTop:8},
// //   cbtn:{width:44,height:44,borderRadius:22,backgroundColor:'#5ba8d0',borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},
// //   cbt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK,lineHeight:34},
// //   cnumBox:{minWidth:70,height:52,alignItems:'center',justifyContent:'center'},
// //   cnum:{fontFamily:F,fontSize:42,fontWeight:'bold',color:NAVY},
// //   cov:{position:'absolute',left:0,right:0,top:-4,alignItems:'center'},
// //   submit:{marginTop:6,paddingHorizontal:30,paddingVertical:7,borderRadius:20,borderWidth:2.5,borderColor:INK,backgroundColor:'#fbf1dd'},
// //   subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},

// //   tray:{position:'absolute',left:18,right:18,bottom:46,height:100,borderRadius:50,backgroundColor:'#f8e9cf',flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:8},
// //   acol:{alignItems:'center'},
// //   hintBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// //   videoBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#ffffff',borderWidth:3,borderColor:'#efe6d2',alignItems:'center',justifyContent:'center'},
// //   skipBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#ffffff',alignItems:'center',justifyContent:'center'},
// //   labels:{position:'absolute',left:18,right:18,bottom:10,flexDirection:'row',justifyContent:'space-around'},
// //   lblPill:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'#5b3a1e',borderRadius:14,paddingHorizontal:12,height:28},
// //   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},

// //   load:{fontFamily:F,fontSize:22,color:NAVY,marginTop:12},
// //   err:{fontFamily:F,fontSize:18,color:NAVY,textAlign:'center',paddingHorizontal:24},
// //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
// //   retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
// //   back:{fontFamily:F,fontSize:16,color:NAVY,marginTop:14,textDecorationLine:'underline'},
// // });
// import React,{useCallback,useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Animated,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// import {F,INK,Coin} from './BTShared';
// import {Icon} from './Art';
// import {Backdrop,Grid} from './Btlevel19art';
// import {startLevel19,answerLevel19,hintLevel19,skipLevel19,rewardLevel19,Level19View,Level19Result} from './Btlevel19api';

// type Props={
//   playerId:number;
//   hints?:number;
//   setHints?:(n:number)=>void;
//   onExit:()=>void;
//   onComplete?:(result:Level19Result)=>void;
// };

// const NAVY='#1b2a5c';
// const PINK='#ff5a7a';

// export default function BTLevel19Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
//   const {width,height}=useWindowDimensions();
//   const CW=Math.min(width-24,380);                 // card width
//   // size of one drawing: smaller on short screens, so SUBMIT always stays above the tray
//   const FS=Math.max(52,Math.min(74,Math.floor((height-470)/4.6),Math.floor((CW-60)/2.3)));

//   const [view,setView]=useState<Level19View|null>(null);
//   const [sessionId,setSessionId]=useState<number|null>(null);
//   const [loadErr,setLoadErr]=useState('');
//   const [msg,setMsg]=useState('');
//   const [done,setDone]=useState(false);
//   const [count,setCount]=useState(0);
//   const [ov,setOv]=useState<string|null>(null);       // check / cross over the number
//   const [confirmSkip,setConfirmSkip]=useState(false);
//   const [clues,setClues]=useState<{n:number;text:string}[]>([]);
//   const [showClues,setShowClues]=useState(false);

//   const shake=useRef(new Animated.Value(0)).current;
//   const sway=useRef(new Animated.Value(0)).current;

//   const doneRef=useRef(false);
//   const busyRef=useRef(false);
//   const timers=useRef<any[]>([]);
//   const msgTimer=useRef<any>(null);
//   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

//   const flash=(m:string)=>{
//     setMsg(m);clearTimeout(msgTimer.current);
//     msgTimer.current=setTimeout(()=>setMsg(''),2800);
//   };
//   const doShake=()=>Animated.sequence([8,-8,5,-5,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

//   // 1. open the level - the backend makes a new game
//   const load=useCallback(()=>{
//     setLoadErr('');setView(null);
//     startLevel19(playerId)
//       .then(v=>{
//         doneRef.current=false;busyRef.current=false;
//         setDone(false);setOv(null);setCount(0);
//         setClues([]);setShowClues(false);
//         setSessionId(v.sessionId);
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
//     const a=Animated.loop(Animated.sequence([
//       Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
//       Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
//     a.start();
//     return()=>a.stop();
//   },[]);

//   // 2. SUBMIT: send the number, the backend says if it is right
//   const submit=async()=>{
//     if(doneRef.current||busyRef.current||!sessionId)return;
//     busyRef.current=true;
//     setConfirmSkip(false);
//     try{
//       const r=await answerLevel19({sessionId,playerId,answer:count});
//       if(r.correct){
//         doneRef.current=true;
//         setDone(true);setOv('check');
//         if(setHints&&typeof r.hints==='number')setHints(r.hints);
//         later(()=>{onComplete?onComplete(r):onExit()},1100);
//       }else{
//         doShake();
//         setOv('cross');
//         flash(r.message||'Not quite. Try again!');
//         later(()=>setOv(null),800);
//       }
//     }catch(e:any){
//       flash(e.message||'Network error');
//     }finally{
//       busyRef.current=false;
//     }
//   };

//   // magnifier: a clue about the pattern (25 hints), shown in the CLUES modal
//   const onHint=async()=>{
//     if(done||!sessionId)return;
//     setConfirmSkip(false);
//     try{
//       const r=await hintLevel19({sessionId,playerId});
//       setHints&&setHints(r.hints);
//       setClues(prev=>{
//         const rest=prev.filter(c=>c.n!==r.index);
//         return [...rest,{n:r.index,text:r.text}].sort((a,b)=>a.n-b.n);
//       });
//       setShowClues(true);
//     }catch(e:any){
//       flash(e.status===402?'Not enough hints':e.message||'Network error');
//     }
//   };

//   // video reward (+75 hints)
//   const onReward=async()=>{
//     if(done)return;
//     setConfirmSkip(false);
//     try{
//       const r=await rewardLevel19(playerId);
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
//       const r=await skipLevel19({sessionId,playerId});
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
//     return <View style={s.root}>
//       <Backdrop/>
//       <View style={s.center}>
//         {loadErr?<>
//           <Text style={s.err}>{loadErr}</Text>
//           <TouchableOpacity style={s.retry} onPress={load}><Text style={s.retryT}>Try again</Text></TouchableOpacity>
//           <TouchableOpacity onPress={onExit}><Text style={s.back}>Back</Text></TouchableOpacity>
//         </>:<>
//           <ActivityIndicator size="large" color={NAVY}/>
//           <Text style={s.load}>Loading level 19...</Text>
//         </>}
//       </View>
//     </View>;
//   }

//   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
//   const top=view.figures.slice(0,2),bottom=view.figures.slice(2);

//   // one drawing: the number is written under it, the "?" is written inside it
//   const fig=(f:{lines:number;label:string},i:number)=><View key={i} style={s.fig}>
//     <Grid lines={f.lines} size={FS} mark={f.label==='?'?'?':undefined}/>
//     {f.label!=='?'&&<Text style={s.figNum}>{f.label}</Text>}
//   </View>;

//   return <View style={s.root}>
//     <Backdrop/>

//     {/* top bar */}
//     <View style={s.top}>
//       <View style={s.topL}>
//         <TouchableOpacity style={s.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
//         <View style={s.round}><Icon n="gear" s={16}/></View>
//       </View>
//       <Animated.View style={[s.signWrap,{transform:[{rotate:swayR}]}]}>
//         <View style={[s.leaf,{left:-14,top:-4,transform:[{rotate:'-30deg'}]}]}/>
//         <View style={[s.leaf,{right:-14,top:-4,transform:[{rotate:'30deg'}]}]}/>
//         <View style={[s.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[s.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
//         <View style={s.sign}>
//           <Text style={s.chev}>{'<'}</Text>
//           <Text style={s.signt}>LEVEL 19</Text>
//           <Text style={s.chev}>{'>'}</Text>
//         </View>
//       </Animated.View>
//       <View style={s.topR}><View style={s.bpill}><Text style={s.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
//     </View>

//     {/* question */}
//     <View style={s.qWrap}>
//       <View style={s.qPill}>
//         <Text style={s.qChev}>{'<'}</Text>
//         <Text style={[s.qText,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
//         <Text style={s.qChev}>{'>'}</Text>
//       </View>
//     </View>

//     <Animated.View style={[s.cardWrap,{transform:[{translateX:shake}]}]}>
//       {/* the picture puzzle */}
//       <View style={[s.card,{width:CW}]}>
//         <View style={s.row}>{top.map(fig)}</View>
//         <View style={s.row}>{bottom.map(fig)}</View>
//       </View>

//       {/* number + submit */}
//       <View style={s.crow}>
//         <TouchableOpacity style={s.cbtn} disabled={done} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={s.cbt}>−</Text></TouchableOpacity>
//         <View style={s.cnumBox}>
//           <Text style={s.cnum}>{count}</Text>
//           {!!ov&&<View pointerEvents="none" style={s.cov}><Icon n={ov} s={56}/></View>}
//         </View>
//         <TouchableOpacity style={s.cbtn} disabled={done} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={s.cbt}>+</Text></TouchableOpacity>
//       </View>
//       <TouchableOpacity style={s.submit} disabled={done} onPress={submit}><Text style={s.subt}>SUBMIT</Text></TouchableOpacity>
//     </Animated.View>

//     {/* tray with hint / video / skip */}
//     <View style={s.tray}>
//       <View style={s.acol}>
//         <TouchableOpacity style={s.hintBtn} onPress={onHint}><Icon n="search" s={34}/></TouchableOpacity>
//       </View>
//       <View style={s.acol}>
//         <TouchableOpacity style={s.videoBtn} onPress={onReward}><Icon n="film" s={40}/></TouchableOpacity>
//       </View>
//       <View style={s.acol}>
//         <TouchableOpacity style={s.skipBtn} onPress={onSkip}><Icon n="play" s={36}/></TouchableOpacity>
//       </View>
//     </View>
//     <View style={s.labels}>
//       <View style={s.lblPill}><Icon n="bulb" s={14}/><Text style={s.lbl}>25</Text></View>
//       <View style={s.lblPill}><Coin s={14}/><Text style={s.lbl}>+75</Text></View>
//       <View style={s.lblPill}><Icon n="bulb" s={14}/><Text style={s.lbl}>50</Text></View>
//     </View>

//     {/* CLUES modal */}
//     {showClues&&<View style={s.mOverlay}>
//       <View style={s.mBox}>
//         <TouchableOpacity style={s.mClose} onPress={()=>setShowClues(false)}>
//           <Text style={s.mCloseT}>✕</Text>
//         </TouchableOpacity>
//         <Text style={s.mTitle}>CLUES</Text>
//         {clues.map(c=>(
//           <View key={c.n} style={s.mClue}>
//             <View style={s.mNum}><Text style={s.mNumT}>{c.n}</Text></View>
//             <View style={{flex:1}}>
//               <Text style={s.mClueH}>Clue {c.n}</Text>
//               <Text style={s.mClueT}>{c.text}</Text>
//             </View>
//           </View>
//         ))}
//       </View>
//     </View>}
//   </View>;
// }

// /* =========================================================
//    STYLES  (bright room like level 1, no pencil or eraser)
// ========================================================= */

// const s=StyleSheet.create({
//   root:{flex:1,backgroundColor:'#bfe0f7',overflow:'hidden'},
//   center:{flex:1,alignItems:'center',justifyContent:'center'},

//   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:34,paddingHorizontal:10},
//   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
//   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
//   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   signWrap:{alignItems:'center',paddingTop:14},
//   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
//   leaf:{position:'absolute',width:26,height:16,borderRadius:10,backgroundColor:'#6fc23e',zIndex:2},
//   sign:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#9a5a22',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:12,paddingVertical:6},
//   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
//   chev:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#ffd84d'},
//   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
//   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},

//   qWrap:{alignItems:'center',marginTop:14,paddingHorizontal:12},
//   qPill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#fbf1dd',borderRadius:30,paddingHorizontal:16,paddingVertical:10,maxWidth:'100%'},
//   qChev:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#f2a900'},
//   qText:{flexShrink:1,fontFamily:F,fontSize:19,fontWeight:'700',color:NAVY,textAlign:'center'},

//   cardWrap:{alignItems:'center',marginTop:10},
//   card:{backgroundColor:'#fffdf8',borderWidth:3,borderColor:'#d9c9a8',borderRadius:14,paddingVertical:6,paddingHorizontal:10},
//   row:{flexDirection:'row',justifyContent:'center',gap:56},
//   fig:{alignItems:'center',minWidth:70},
//   figNum:{fontFamily:F,fontSize:24,fontWeight:'900',color:PINK,marginTop:-6,marginBottom:0,lineHeight:28},

//   crow:{flexDirection:'row',alignItems:'center',gap:18,marginTop:8},
//   cbtn:{width:44,height:44,borderRadius:22,backgroundColor:'#5ba8d0',borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   cbt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK,lineHeight:34},
//   cnumBox:{minWidth:70,height:52,alignItems:'center',justifyContent:'center'},
//   cnum:{fontFamily:F,fontSize:42,fontWeight:'bold',color:NAVY},
//   cov:{position:'absolute',left:0,right:0,top:-4,alignItems:'center'},
//   submit:{marginTop:6,paddingHorizontal:30,paddingVertical:7,borderRadius:20,borderWidth:2.5,borderColor:INK,backgroundColor:'#fbf1dd'},
//   subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},

//   tray:{position:'absolute',left:18,right:18,bottom:46,height:100,borderRadius:50,backgroundColor:'#f8e9cf',flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:8},
//   acol:{alignItems:'center'},
//   hintBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
//   videoBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#ffffff',borderWidth:3,borderColor:'#efe6d2',alignItems:'center',justifyContent:'center'},
//   skipBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#ffffff',alignItems:'center',justifyContent:'center'},
//   labels:{position:'absolute',left:18,right:18,bottom:10,flexDirection:'row',justifyContent:'space-around'},
//   lblPill:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'#5b3a1e',borderRadius:14,paddingHorizontal:12,height:28},
//   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},

//   load:{fontFamily:F,fontSize:22,color:NAVY,marginTop:12},
//   err:{fontFamily:F,fontSize:18,color:NAVY,textAlign:'center',paddingHorizontal:24},
//   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
//   retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
//   back:{fontFamily:F,fontSize:16,color:NAVY,marginTop:14,textDecorationLine:'underline'},

//   // CLUES modal
//   mOverlay:{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(20,30,60,0.45)',alignItems:'center',justifyContent:'center',paddingHorizontal:18,zIndex:50},
//   mBox:{width:'100%',maxWidth:380,backgroundColor:'#fdf3e0',borderWidth:5,borderColor:'#f09a2a',borderRadius:22,padding:16,paddingTop:14},
//   mClose:{position:'absolute',right:-8,top:-14,width:38,height:38,borderRadius:19,backgroundColor:'#ffe27a',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center',zIndex:2},
//   mCloseT:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#e0402f'},
//   mTitle:{fontFamily:F,fontSize:26,fontWeight:'900',color:NAVY,textAlign:'center',marginBottom:10},
//   mClue:{flexDirection:'row',alignItems:'center',gap:12,borderWidth:2.5,borderColor:'#4fc46a',borderRadius:16,padding:12,marginBottom:8,backgroundColor:'#fff8ea'},
//   mNum:{width:48,height:48,borderRadius:24,backgroundColor:'#c46f1a',alignItems:'center',justifyContent:'center'},
//   mNumT:{fontFamily:F,fontSize:26,fontWeight:'900',color:'#fff'},
//   mClueH:{fontFamily:F,fontSize:18,fontWeight:'800',color:'#c46f1a'},
//   mClueT:{fontFamily:F,fontSize:16,fontStyle:'italic',color:NAVY},
// });
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
import {F,INK,Coin} from './BTShared';
import {Icon} from './Art';
import {Backdrop,Grid} from './Btlevel19art';
import {startLevel19,answerLevel19,hintLevel19,skipLevel19,rewardLevel19,Level19View,Level19Result} from './Btlevel19api';

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level19Result)=>void;
};

const NAVY='#1b2a5c';
const PINK='#ff5a7a';

export default function BTLevel19Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width,height}=useWindowDimensions();
  const CW=Math.min(width-24,380);                 // card width
  // size of one drawing: smaller on short screens, so SUBMIT always stays above the tray
  const FS=Math.max(52,Math.min(74,Math.floor((height-470)/4.6),Math.floor((CW-60)/2.3)));

  const [view,setView]=useState<Level19View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [done,setDone]=useState(false);
  const [count,setCount]=useState(0);
  const [ov,setOv]=useState<string|null>(null);       // check / cross over the number
  const [confirmSkip,setConfirmSkip]=useState(false);
  const [clues,setClues]=useState<{n:number;text:string}[]>([]);
  const [showClues,setShowClues]=useState(false);

  const shake=useRef(new Animated.Value(0)).current;
  const sway=useRef(new Animated.Value(0)).current;

  const doneRef=useRef(false);
  const busyRef=useRef(false);
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  const flash=(m:string)=>{
    setMsg(m);clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2800);
  };
  const doShake=()=>Animated.sequence([8,-8,5,-5,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  // 1. open the level - the backend makes a new game
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel19(playerId)
      .then(v=>{
        doneRef.current=false;busyRef.current=false;
        setDone(false);setOv(null);setCount(0);
        setClues([]);setShowClues(false);
        setSessionId(v.sessionId);
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
    const a=Animated.loop(Animated.sequence([
      Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
      Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
    a.start();
    return()=>a.stop();
  },[]);

  // 2. SUBMIT: send the number, the backend says if it is right
  const submit=async()=>{
    if(doneRef.current||busyRef.current||!sessionId)return;
    busyRef.current=true;
    setConfirmSkip(false);
    try{
      const r=await answerLevel19({sessionId,playerId,answer:count});
      if(r.correct){
        doneRef.current=true;
        setDone(true);setOv('check');
        if(setHints&&typeof r.hints==='number')setHints(r.hints);
        later(()=>{onComplete?onComplete(r):onExit()},1100);
      }else{
        doShake();
        setOv('cross');
        flash(r.message||'Not quite. Try again!');
        later(()=>setOv(null),800);
      }
    }catch(e:any){
      flash(e.message||'Network error');
    }finally{
      busyRef.current=false;
    }
  };

  // magnifier: a clue about the pattern (25 hints), shown in the CLUES modal
  const onHint=async()=>{
    if(done||!sessionId)return;
    setConfirmSkip(false);
    try{
      const r=await hintLevel19({sessionId,playerId});
      setHints&&setHints(r.hints);
      setClues(prev=>{
        const rest=prev.filter(c=>c.n!==r.index);
        return [...rest,{n:r.index,text:r.text}].sort((a,b)=>a.n-b.n);
      });
      setShowClues(true);
    }catch(e:any){
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }
  };

  // video reward (+75 hints)
  const onReward=async()=>{
    if(done)return;
    setConfirmSkip(false);
    try{
      const r=await rewardLevel19(playerId);
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
      const r=await skipLevel19({sessionId,playerId});
      setHints&&setHints(r.hints||0);
      doneRef.current=true;
      onComplete?onComplete(r):onExit();
    }catch(e:any){
      setConfirmSkip(false);
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }
  };

  /* ---------- loading / error ---------- */

  if(loadErr||!view){
    return <View style={s.root}>
      <Backdrop/>
      <View style={s.center}>
        {loadErr?<>
          <Text style={s.err}>{loadErr}</Text>
          <TouchableOpacity style={s.retry} onPress={load}><Text style={s.retryT}>Try again</Text></TouchableOpacity>
          <TouchableOpacity onPress={onExit}><Text style={s.back}>Back</Text></TouchableOpacity>
        </>:<>
          <ActivityIndicator size="large" color={NAVY}/>
          <Text style={s.load}>Loading level 19...</Text>
        </>}
      </View>
    </View>;
  }

  const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
  const top=view.figures.slice(0,2),bottom=view.figures.slice(2);

  // one drawing: the number is written under it, the "?" is written inside it
  const fig=(f:{lines:number;label:string},i:number)=><View key={i} style={s.fig}>
    <Grid lines={f.lines} size={FS} mark={f.label==='?'?'?':undefined}/>
    {f.label!=='?'&&<Text style={s.figNum}>{f.label}</Text>}
  </View>;

  return <View style={s.root}>
    <Backdrop/>

    {/* top bar */}
    <View style={s.top}>
      <View style={s.topL}>
        <TouchableOpacity style={s.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
        <View style={s.round}><Icon n="gear" s={16}/></View>
      </View>
      <Animated.View style={[s.signWrap,{transform:[{rotate:swayR}]}]}>
        <View style={[s.leaf,{left:-14,top:-4,transform:[{rotate:'-30deg'}]}]}/>
        <View style={[s.leaf,{right:-14,top:-4,transform:[{rotate:'30deg'}]}]}/>
        <View style={[s.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[s.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
        <View style={s.sign}>
          <Text style={s.chev}>{'<'}</Text>
          <Text style={s.signt}>LEVEL 19</Text>
          <Text style={s.chev}>{'>'}</Text>
        </View>
      </Animated.View>
      <View style={s.topR}><View style={s.bpill}><Text style={s.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
    </View>

    {/* question */}
    <View style={s.qWrap}>
      <View style={s.qPill}>
        <Text style={s.qChev}>{'<'}</Text>
        <Text style={[s.qText,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
        <Text style={s.qChev}>{'>'}</Text>
      </View>
    </View>

    <Animated.View style={[s.cardWrap,{transform:[{translateX:shake}]}]}>
      {/* the picture puzzle */}
      <View style={[s.card,{width:CW}]}>
        <View style={s.row}>{top.map(fig)}</View>
        <View style={s.row}>{bottom.map(fig)}</View>
      </View>

      {/* number + submit */}
      <View style={s.crow}>
        <TouchableOpacity style={s.cbtn} disabled={done} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={s.cbt}>−</Text></TouchableOpacity>
        <View style={s.cnumBox}>
          <Text style={s.cnum}>{count}</Text>
          {!!ov&&<View pointerEvents="none" style={s.cov}><Icon n={ov} s={56}/></View>}
        </View>
        <TouchableOpacity style={s.cbtn} disabled={done} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={s.cbt}>+</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={s.submit} disabled={done} onPress={submit}><Text style={s.subt}>SUBMIT</Text></TouchableOpacity>
    </Animated.View>

    {/* tray with hint / video / skip */}
    <View style={s.tray}>
      <View style={s.acol}>
        <TouchableOpacity style={s.hintBtn} onPress={onHint}><Icon n="search" s={34}/></TouchableOpacity>
      </View>
      <View style={s.acol}>
        <TouchableOpacity style={s.videoBtn} onPress={onReward}><Icon n="film" s={40}/></TouchableOpacity>
      </View>
      <View style={s.acol}>
        <TouchableOpacity style={s.skipBtn} onPress={onSkip}><Icon n="play" s={36}/></TouchableOpacity>
      </View>
    </View>
    <View style={s.labels}>
      <View style={s.lblPill}><Text style={s.lbl}>FREE</Text></View>
      <View style={s.lblPill}><Coin s={14}/><Text style={s.lbl}>+75</Text></View>
      <View style={s.lblPill}><Icon n="bulb" s={14}/><Text style={s.lbl}>50</Text></View>
    </View>

    {/* CLUES modal */}
    {showClues&&<View style={s.mOverlay}>
      <View style={s.mBox}>
        <TouchableOpacity style={s.mClose} onPress={()=>setShowClues(false)}>
          <Text style={s.mCloseT}>✕</Text>
        </TouchableOpacity>
        <Text style={s.mTitle}>CLUES</Text>
        {clues.map(c=>(
          <View key={c.n} style={s.mClue}>
            <View style={s.mNum}><Text style={s.mNumT}>{c.n}</Text></View>
            <View style={{flex:1}}>
              <Text style={s.mClueH}>Clue {c.n}</Text>
              <Text style={s.mClueT}>{c.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>}
  </View>;
}

/* =========================================================
   STYLES  (bright room like level 1, no pencil or eraser)
========================================================= */

const s=StyleSheet.create({
  root:{flex:1,backgroundColor:'#bfe0f7',overflow:'hidden'},
  center:{flex:1,alignItems:'center',justifyContent:'center'},

  top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:34,paddingHorizontal:10},
  topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
  topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
  round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
  signWrap:{alignItems:'center',paddingTop:14},
  string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
  leaf:{position:'absolute',width:26,height:16,borderRadius:10,backgroundColor:'#6fc23e',zIndex:2},
  sign:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#9a5a22',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:12,paddingVertical:6},
  signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
  chev:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#ffd84d'},
  bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
  bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},

  qWrap:{alignItems:'center',marginTop:14,paddingHorizontal:12},
  qPill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#fbf1dd',borderRadius:30,paddingHorizontal:16,paddingVertical:10,maxWidth:'100%'},
  qChev:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#f2a900'},
  qText:{flexShrink:1,fontFamily:F,fontSize:19,fontWeight:'700',color:NAVY,textAlign:'center'},

  cardWrap:{alignItems:'center',marginTop:10},
  card:{backgroundColor:'#fffdf8',borderWidth:3,borderColor:'#d9c9a8',borderRadius:14,paddingVertical:6,paddingHorizontal:10},
  row:{flexDirection:'row',justifyContent:'center',gap:56},
  fig:{alignItems:'center',minWidth:70},
  figNum:{fontFamily:F,fontSize:24,fontWeight:'900',color:PINK,marginTop:-6,marginBottom:0,lineHeight:28},

  crow:{flexDirection:'row',alignItems:'center',gap:18,marginTop:8},
  cbtn:{width:44,height:44,borderRadius:22,backgroundColor:'#5ba8d0',borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},
  cbt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK,lineHeight:34},
  cnumBox:{minWidth:70,height:52,alignItems:'center',justifyContent:'center'},
  cnum:{fontFamily:F,fontSize:42,fontWeight:'bold',color:NAVY},
  cov:{position:'absolute',left:0,right:0,top:-4,alignItems:'center'},
  submit:{marginTop:6,paddingHorizontal:30,paddingVertical:7,borderRadius:20,borderWidth:2.5,borderColor:INK,backgroundColor:'#fbf1dd'},
  subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},

  tray:{position:'absolute',left:18,right:18,bottom:46,height:100,borderRadius:50,backgroundColor:'#f8e9cf',flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:8},
  acol:{alignItems:'center'},
  hintBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
  videoBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#ffffff',borderWidth:3,borderColor:'#efe6d2',alignItems:'center',justifyContent:'center'},
  skipBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#ffffff',alignItems:'center',justifyContent:'center'},
  labels:{position:'absolute',left:18,right:18,bottom:10,flexDirection:'row',justifyContent:'space-around'},
  lblPill:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'#5b3a1e',borderRadius:14,paddingHorizontal:12,height:28},
  lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},

  load:{fontFamily:F,fontSize:22,color:NAVY,marginTop:12},
  err:{fontFamily:F,fontSize:18,color:NAVY,textAlign:'center',paddingHorizontal:24},
  retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
  retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
  back:{fontFamily:F,fontSize:16,color:NAVY,marginTop:14,textDecorationLine:'underline'},

  // CLUES modal
  mOverlay:{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(20,30,60,0.45)',alignItems:'center',justifyContent:'center',paddingHorizontal:18,zIndex:50},
  mBox:{width:'100%',maxWidth:380,backgroundColor:'#fdf3e0',borderWidth:5,borderColor:'#f09a2a',borderRadius:22,padding:16,paddingTop:14},
  mClose:{position:'absolute',right:-8,top:-14,width:38,height:38,borderRadius:19,backgroundColor:'#ffe27a',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center',zIndex:2},
  mCloseT:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#e0402f'},
  mTitle:{fontFamily:F,fontSize:26,fontWeight:'900',color:NAVY,textAlign:'center',marginBottom:10},
  mClue:{flexDirection:'row',alignItems:'center',gap:12,borderWidth:2.5,borderColor:'#4fc46a',borderRadius:16,padding:12,marginBottom:8,backgroundColor:'#fff8ea'},
  mNum:{width:48,height:48,borderRadius:24,backgroundColor:'#c46f1a',alignItems:'center',justifyContent:'center'},
  mNumT:{fontFamily:F,fontSize:26,fontWeight:'900',color:'#fff'},
  mClueH:{fontFamily:F,fontSize:18,fontWeight:'800',color:'#c46f1a'},
  mClueT:{fontFamily:F,fontSize:16,fontStyle:'italic',color:NAVY},
});
