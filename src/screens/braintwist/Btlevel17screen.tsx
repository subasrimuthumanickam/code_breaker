
// // import React,{useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet} from 'react-native';
// // import Svg,{Circle} from 'react-native-svg';
// // import {Icon} from './Art';
// // import {F,INK,Stage,Coin,loop} from './BTShared';
// // import {RoomBg} from './Btlevel14art';   // same cozy room background as the other levels
// // import {startLevel17,reveal17,answer17,hint17,skip17,reward17} from './Btlevel17api';

// // const NAVY='#10245e',CREAM='#fbf6e9',SKY='#9fc6ea';
// // const BALL=84;            // circle size
// // const MOVE_TO_REVEAL=55;  // how far the circle must move before the number shows

// // type Props={playerId:number;hints:number;setHints:(n:number)=>void;onExit:()=>void;onComplete:(r:any)=>void};

// // /* the movable circle that hides the number: same cream bubble + dashed ring as the number bubbles in the app */
// // const Ball=()=><Svg width={BALL} height={BALL} viewBox="0 0 100 100">
// //   <Circle cx="50" cy="54" r="38" fill="rgba(0,0,0,0.12)"/>
// //   <Circle cx="50" cy="50" r="48" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeDasharray="5 5" fill="rgba(255,255,255,0.18)"/>
// //   <Circle cx="50" cy="50" r="38" fill={CREAM}/>
// // </Svg>;

// // export default function BTLevel17Screen({playerId,hints,setHints,onExit,onComplete}:Props){
// //   const[sid,setSid]=useState<number|null>(null),[value,setValue]=useState<number|null>(null),[typed,setTyped]=useState(''),
// //     [ov,setOv]=useState<string|null>(null),[note,setNote]=useState(''),[done,setDone]=useState(false);
// //   const pos=useRef({x:0,y:0}),pan=useRef(new Animated.ValueXY()).current;
// //   const sway=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,qIn=useRef(new Animated.Value(0)).current,shake=useRef(new Animated.Value(0)).current;
// //   const busy=useRef(false),sidR=useRef<number|null>(null),doneR=useRef(false),revealedR=useRef(false),startedR=useRef(false),revealFn=useRef<any>(null);
// //   sidR.current=sid;doneR.current=done;

// //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1800)};
// //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// //   // opens a game on the backend (only called once, or again if the old session was closed)
// //   const begin=async()=>{
// //     try{const r=await startLevel17(playerId);
// //       if(r.success){sidR.current=r.sessionId;setSid(r.sessionId);revealedR.current=false;setValue(null);return r.sessionId}
// //       flash(r.message||'Cannot start level')}
// //     catch(e){flash('Cannot reach server')}
// //     return null};

// //   useEffect(()=>{
// //     if(!startedR.current){startedR.current=true;begin()}
// //     loop(sway,1800);loop(pulse,900);
// //     Animated.spring(qIn,{toValue:1,friction:6,tension:70,useNativeDriver:true}).start();
// //   },[]);

// //   const finish=(r:any)=>{setDone(true);flash(r.message||'Done!');setTimeout(()=>onComplete(r),1100)};

// //   // the circle was moved -> ask the backend for the hidden number
// //   const doReveal=async()=>{
// //     if(revealedR.current||!sidR.current)return;revealedR.current=true;
// //     try{const r=await reveal17(sidR.current,playerId);
// //       if(r.status===409){revealedR.current=false;await begin();return}
// //       if(r.success)setValue(r.value);else revealedR.current=false}
// //     catch(e){revealedR.current=false;flash('Network error')}};
// //   revealFn.current=doReveal;

// //   // drag the circle anywhere
// //   const pr=useRef(PanResponder.create({
// //     onStartShouldSetPanResponder:()=>!doneR.current,
// //     onPanResponderMove:(_,g)=>{
// //       const x=pos.current.x+g.dx,y=pos.current.y+g.dy;
// //       pan.setValue({x,y});
// //       if(Math.hypot(x,y)>MOVE_TO_REVEAL)revealFn.current&&revealFn.current()},
// //     onPanResponderRelease:(_,g)=>{pos.current={x:pos.current.x+g.dx,y:pos.current.y+g.dy}}})).current;

// //   const submit=async()=>{
// //     if(!typed||doneR.current||busy.current||!sidR.current)return;busy.current=true;
// //     try{const r=await answer17(sidR.current,playerId,Number(typed));
// //       if(r.status===409){await begin();flash('Game restarted. Try again!');setTyped('');return}
// //       if(!r.success){flash(r.message||'Error');return}
// //       if(r.correct){setOv('check');finish(r)}
// //       else{doShake();setOv('cross');flash(r.message||'Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}}
// //     catch(e){flash('Network error')}
// //     finally{busy.current=false}};

// //   const hint=async()=>{if(!sid)return;try{const r=await hint17(sid,playerId);
// //     if(r.status===402){flash('Not enough hints');return}
// //     if(r.success){setHints(r.hints);flash(r.text)}}catch(e){flash('Network error')}};
// //   const reward=async()=>{try{const r=await reward17(playerId);if(r.success)setHints(r.hints)}catch(e){}};
// //   const skip=async()=>{if(!sid)return;try{const r=await skip17(sid,playerId);
// //     if(r.status===402){flash('Not enough hints');return}
// //     if(r.success){setHints(r.hints);onComplete(r)}}catch(e){flash('Network error')}};

// //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']}),
// //     pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.09]}),
// //     qY=qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]});

// //   return <Stage bg={SKY}><View style={bd.wall}>
// //     <RoomBg/>
// //     <View style={bd.board}>

// //       {/* top bar */}
// //       <View style={bd.top}>
// //         <View style={bd.topL}>
// //           <TouchableOpacity onPress={onExit} style={bd.round}><Icon n="home" s={16}/></TouchableOpacity>
// //           <TouchableOpacity style={bd.round}><Icon n="gear" s={16}/></TouchableOpacity>
// //         </View>
// //         <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
// //           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
// //           <View style={bd.sign}>
// //             <View style={[bd.leafTop,{left:-8,transform:[{rotate:'-30deg'}]}]}/><View style={[bd.leafTop,{right:-8,transform:[{rotate:'30deg'}]}]}/>
// //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
// //             <Text style={bd.signt}>LEVEL 17</Text>
// //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
// //           </View>
// //         </Animated.View>
// //         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
// //       </View>

// //       {/* question banner */}
// //       <Animated.View style={[bd.qWrap,{opacity:qIn,transform:[{translateY:qY}]}]}>
// //         <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
// //         <Text style={bd.q}>What is the hidden number?</Text>
// //         <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
// //       </Animated.View>

// //       {/* the sequence: 5-15-25-( )-100 */}
// //       <Animated.View style={[bd.seqRow,{transform:[{translateX:shake}]}]}>
// //         <Text style={bd.seq}>5-15-25-</Text>
// //         <View style={bd.slot}>
// //           {value!==null&&<View style={bd.slotRing}/>}
// //           {value!==null&&<Text style={bd.slotNum}>{value}</Text>}
// //           {/* the circle sits on top of the number, drag it away */}
// //           <Animated.View {...pr.panHandlers} style={[bd.ball,{transform:pan.getTranslateTransform()}]}><Ball/></Animated.View>
// //         </View>
// //         <Text style={bd.seq}>-100</Text>
// //       </Animated.View>

// //       {/* keypad */}
// //       <View style={bd.kwrap}>
// //         <View style={bd.krow}>
// //           <TouchableOpacity style={[bd.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={bd.kst}>✕</Text></TouchableOpacity>
// //           <View style={bd.kpill}><Text style={bd.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={bd.cov}><Icon n={ov} s={52}/></View>}</View>
// //           <TouchableOpacity style={[bd.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={submit}><Text style={bd.kst}>✓</Text></TouchableOpacity>
// //         </View>
// //         {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={bd.krow}>{row.map(d=>
// //           <TouchableOpacity key={d} style={bd.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,3))}><Text style={bd.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
// //       </View>

// //       {/* hint / video / skip */}
// //       <View style={bd.actions}>
// //         <View style={bd.acol}>
// //           <Animated.View style={{transform:[{scale:pulseS}]}}><TouchableOpacity style={bd.hintBtn} onPress={hint}><Icon n="search" s={34}/></TouchableOpacity></Animated.View>
// //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
// //         </View>
// //         <View style={bd.acol}>
// //           <TouchableOpacity style={bd.videoBtn} onPress={reward}><Icon n="film" s={40}/></TouchableOpacity>
// //           <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
// //         </View>
// //         <View style={bd.acol}>
// //           <TouchableOpacity style={bd.skipBtn} onPress={skip}><Icon n="play" s={36}/></TouchableOpacity>
// //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
// //         </View>
// //       </View>

// //       {!!note&&<Text style={bd.note}>{note}</Text>}
// //     </View>
// //   </View></Stage>;
// // }

// // const bd=StyleSheet.create({
// //   wall:{flex:1,backgroundColor:SKY,overflow:'hidden'},
// //   board:{flex:1,alignItems:'center',paddingTop:30},
// //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// //   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
// //   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
// //   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
// //   signWrap:{alignItems:'center',paddingTop:14},
// //   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#9a6a3a'},
// //   sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#a8601f',borderWidth:3,borderColor:'#d98b3d',borderRadius:8,paddingHorizontal:12,paddingVertical:6,elevation:6,shadowColor:'#000',shadowOpacity:0.25,shadowRadius:4,shadowOffset:{width:0,height:3}},
// //   leafTop:{position:'absolute',top:-12,width:16,height:24,borderRadius:12,backgroundColor:'#5fae3a'},
// //   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
// //   dashes:{gap:4,justifyContent:'center'},dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffc83d'},
// //   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
// //   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},
// //   qWrap:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:CREAM,borderRadius:30,paddingHorizontal:22,paddingVertical:10,marginTop:22,elevation:4,shadowColor:'#000',shadowOpacity:0.15,shadowRadius:4,shadowOffset:{width:0,height:2}},
// //   q:{fontFamily:F,fontSize:24,fontWeight:'bold',color:NAVY,textAlign:'center'},
// //   seqRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:34,zIndex:20},
// //   seq:{fontFamily:F,fontSize:36,fontWeight:'900',color:NAVY,includeFontPadding:false},
// //   slot:{width:BALL+8,height:BALL+8,alignItems:'center',justifyContent:'center',marginHorizontal:2},
// //   slotRing:{position:'absolute',width:BALL+8,height:BALL+8,borderRadius:(BALL+8)/2,borderWidth:2,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.95)',backgroundColor:'rgba(255,255,255,0.18)'},
// //   slotNum:{position:'absolute',fontFamily:F,fontSize:44,fontWeight:'900',color:NAVY,includeFontPadding:false},
// //   ball:{position:'absolute',zIndex:30,elevation:30,width:BALL,height:BALL},
// //   kwrap:{position:'absolute',left:0,right:0,bottom:150,alignItems:'center',gap:8},
// //   krow:{flexDirection:'row',alignItems:'center',gap:8},
// //   kside:{width:38,height:38,borderRadius:19,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
// //   kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},
// //   knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-2,alignItems:'center'},
// //   kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
// //   actions:{position:'absolute',left:0,right:0,bottom:34,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
// //   acol:{alignItems:'center'},
// //   lblRow:{flexDirection:'row',alignItems:'center',gap:4,height:26,marginTop:6,paddingHorizontal:12,borderRadius:13,backgroundColor:'#6b4423'},
// //   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
// //   hintBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#a8e22a',borderWidth:4,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center',elevation:6},
// //   videoBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f3efe2',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},
// //   skipBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f0484f',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},
// //   note:{position:'absolute',bottom:6,alignSelf:'center',fontFamily:F,fontSize:17,fontWeight:'bold',color:'#c0392b'}});
// import React,{useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet} from 'react-native';
// import Svg,{Circle} from 'react-native-svg';
// import {Icon} from './Art';
// import {F,INK,Stage,Coin,loop} from './BTShared';
// import {RoomBg} from './Btlevel14art';   // same cozy room background as the other levels
// import {startLevel17,reveal17,answer17,hint17,skip17,reward17} from './Btlevel17api';

// // SKY = same light blue wall as Level 1 (if Level 1 uses another value, copy it here)
// const NAVY='#10245e',CREAM='#fbf6e9',SKY='#b3d6f0';
// const BALL=84;            // circle size
// const MOVE_TO_REVEAL=55;  // how far the circle must move before the number shows
// const CLUE_TEXT='Not every number wants to be seen. Sometimes, the answer is hiding in plain sight!';

// type Props={playerId:number;hints:number;setHints:(n:number)=>void;onExit:()=>void;onComplete:(r:any)=>void};

// /* the movable circle that hides the number: same cream bubble + dashed ring as the number bubbles in the app */
// const Ball=()=><Svg width={BALL} height={BALL} viewBox="0 0 100 100">
//   <Circle cx="50" cy="54" r="38" fill="rgba(0,0,0,0.12)"/>
//   <Circle cx="50" cy="50" r="48" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeDasharray="5 5" fill="rgba(255,255,255,0.18)"/>
//   <Circle cx="50" cy="50" r="38" fill={CREAM}/>
// </Svg>;

// export default function BTLevel17Screen({playerId,hints,setHints,onExit,onComplete}:Props){
//   const[sid,setSid]=useState<number|null>(null),[value,setValue]=useState<number|null>(null),[typed,setTyped]=useState(''),
//     [ov,setOv]=useState<string|null>(null),[note,setNote]=useState(''),[done,setDone]=useState(false),
//     [clue,setClue]=useState(''),[showClues,setShowClues]=useState(false);
//   const pos=useRef({x:0,y:0}),pan=useRef(new Animated.ValueXY()).current;
//   const sway=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,qIn=useRef(new Animated.Value(0)).current,shake=useRef(new Animated.Value(0)).current;
//   const busy=useRef(false),sidR=useRef<number|null>(null),doneR=useRef(false),revealedR=useRef(false),startedR=useRef(false),revealFn=useRef<any>(null);
//   sidR.current=sid;doneR.current=done;

//   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1800)};
//   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

//   // opens a game on the backend (only called once, or again if the old session was closed)
//   const begin=async()=>{
//     try{const r=await startLevel17(playerId);
//       if(r.success){sidR.current=r.sessionId;setSid(r.sessionId);revealedR.current=false;setValue(null);return r.sessionId}
//       flash(r.message||'Cannot start level')}
//     catch(e){flash('Cannot reach server')}
//     return null};

//   useEffect(()=>{
//     if(!startedR.current){startedR.current=true;begin()}
//     loop(sway,1800);loop(pulse,900);
//     Animated.spring(qIn,{toValue:1,friction:6,tension:70,useNativeDriver:true}).start();
//   },[]);

//   const finish=(r:any)=>{setDone(true);flash(r.message||'Done!');setTimeout(()=>onComplete(r),1100)};

//   // the circle was moved -> ask the backend for the hidden number
//   const doReveal=async()=>{
//     if(revealedR.current||!sidR.current)return;revealedR.current=true;
//     try{const r=await reveal17(sidR.current,playerId);
//       if(r.status===409){revealedR.current=false;await begin();return}
//       if(r.success)setValue(r.value);else revealedR.current=false}
//     catch(e){revealedR.current=false;flash('Network error')}};
//   revealFn.current=doReveal;

//   // drag the circle anywhere
//   const pr=useRef(PanResponder.create({
//     onStartShouldSetPanResponder:()=>!doneR.current,
//     onPanResponderMove:(_,g)=>{
//       const x=pos.current.x+g.dx,y=pos.current.y+g.dy;
//       pan.setValue({x,y});
//       if(Math.hypot(x,y)>MOVE_TO_REVEAL)revealFn.current&&revealFn.current()},
//     onPanResponderRelease:(_,g)=>{pos.current={x:pos.current.x+g.dx,y:pos.current.y+g.dy}}})).current;

//   const submit=async()=>{
//     if(!typed||doneR.current||busy.current||!sidR.current)return;busy.current=true;
//     try{const r=await answer17(sidR.current,playerId,Number(typed));
//       if(r.status===409){await begin();flash('Game restarted. Try again!');setTyped('');return}
//       if(!r.success){flash(r.message||'Error');return}
//       if(r.correct){setOv('check');finish(r)}
//       else{doShake();setOv('cross');flash(r.message||'Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}}
//     catch(e){flash('Network error')}
//     finally{busy.current=false}};

//   // clue is free: the CLUES modal opens right away, the backend call only saves the hint
//   const hint=async()=>{
//     if(!sid||done)return;
//     const first=!clue;
//     setClue(CLUE_TEXT);setShowClues(true);
//     if(!first)return;
//     try{const r=await hint17(sid,playerId);
//       if(r.success){if(r.text)setClue(r.text);setHints(r.hints)}}
//     catch(e){/* the clue is already shown, ignore */}};
//   const reward=async()=>{try{const r=await reward17(playerId);if(r.success)setHints(r.hints)}catch(e){}};
//   const skip=async()=>{if(!sid)return;try{const r=await skip17(sid,playerId);
//     if(r.status===402){flash('Not enough hints');return}
//     if(r.success){setHints(r.hints);onComplete(r)}}catch(e){flash('Network error')}};

//   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']}),
//     pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.09]}),
//     qY=qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]});

//   return <Stage bg={SKY}><View style={bd.wall}>
//     <RoomBg/>
//     <View style={bd.board}>

//       {/* top bar */}
//       <View style={bd.top}>
//         <View style={bd.topL}>
//           <TouchableOpacity onPress={onExit} style={bd.round}><Icon n="home" s={16}/></TouchableOpacity>
//           <TouchableOpacity style={bd.round}><Icon n="gear" s={16}/></TouchableOpacity>
//         </View>
//         <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
//           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
//           <View style={bd.sign}>
//             <View style={[bd.leafTop,{left:-8,transform:[{rotate:'-30deg'}]}]}/><View style={[bd.leafTop,{right:-8,transform:[{rotate:'30deg'}]}]}/>
//             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
//             <Text style={bd.signt}>LEVEL 17</Text>
//             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
//           </View>
//         </Animated.View>
//         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
//       </View>

//       {/* question banner */}
//       <Animated.View style={[bd.qWrap,{opacity:qIn,transform:[{translateY:qY}]}]}>
//         <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
//         <Text style={bd.q}>What is the hidden number?</Text>
//         <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
//       </Animated.View>

//       {/* the sequence: 5-15-25-( )-100 */}
//       <Animated.View style={[bd.seqRow,{transform:[{translateX:shake}]}]}>
//         <Text style={bd.seq}>5-15-25-</Text>
//         <View style={bd.slot}>
//           {value!==null&&<View style={bd.slotRing}/>}
//           {value!==null&&<Text style={bd.slotNum}>{value}</Text>}
//           {/* the circle sits on top of the number, drag it away */}
//           <Animated.View {...pr.panHandlers} style={[bd.ball,{transform:pan.getTranslateTransform()}]}><Ball/></Animated.View>
//         </View>
//         <Text style={bd.seq}>-100</Text>
//       </Animated.View>

//       {/* keypad */}
//       <View style={bd.kwrap}>
//         <View style={bd.krow}>
//           <TouchableOpacity style={[bd.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={bd.kst}>✕</Text></TouchableOpacity>
//           <View style={bd.kpill}><Text style={bd.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={bd.cov}><Icon n={ov} s={52}/></View>}</View>
//           <TouchableOpacity style={[bd.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={submit}><Text style={bd.kst}>✓</Text></TouchableOpacity>
//         </View>
//         {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={bd.krow}>{row.map(d=>
//           <TouchableOpacity key={d} style={bd.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,3))}><Text style={bd.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
//       </View>

//       {/* clue / video / skip */}
//       <View style={bd.actions}>
//         <View style={bd.acol}>
//           <Animated.View style={{transform:[{scale:pulseS}]}}><TouchableOpacity style={bd.hintBtn} onPress={hint}><Icon n="search" s={34}/></TouchableOpacity></Animated.View>
//           <View style={bd.lblRow}><Text style={bd.lbl}>FREE</Text></View>
//         </View>
//         <View style={bd.acol}>
//           <TouchableOpacity style={bd.videoBtn} onPress={reward}><Icon n="film" s={40}/></TouchableOpacity>
//           <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
//         </View>
//         <View style={bd.acol}>
//           <TouchableOpacity style={bd.skipBtn} onPress={skip}><Icon n="play" s={36}/></TouchableOpacity>
//           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
//         </View>
//       </View>

//       {!!note&&<Text style={bd.note}>{note}</Text>}

//       {/* clues modal */}
//       {showClues&&<View style={bd.overlay}>
//         <View style={bd.modal}>
//           <Text style={bd.mTitle}>CLUES</Text>
//           <TouchableOpacity style={bd.mClose} onPress={()=>setShowClues(false)}>
//             <Text style={bd.mCloseX}>✕</Text>
//           </TouchableOpacity>
//           <View style={bd.clueCard}>
//             <View style={bd.clueNum}><Text style={bd.clueNumT}>1</Text></View>
//             <View style={{flex:1}}>
//               <Text style={bd.clueHead}>Clue 1</Text>
//               <Text style={bd.clueBody}>{clue}</Text>
//             </View>
//           </View>
//         </View>
//       </View>}
//     </View>
//   </View></Stage>;
// }

// const bd=StyleSheet.create({
//   wall:{flex:1,backgroundColor:SKY,overflow:'hidden'},
//   board:{flex:1,alignItems:'center',paddingTop:30},
//   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
//   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
//   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
//   signWrap:{alignItems:'center',paddingTop:14},
//   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#9a6a3a'},
//   sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#a8601f',borderWidth:3,borderColor:'#d98b3d',borderRadius:8,paddingHorizontal:12,paddingVertical:6,elevation:6,shadowColor:'#000',shadowOpacity:0.25,shadowRadius:4,shadowOffset:{width:0,height:3}},
//   leafTop:{position:'absolute',top:-12,width:16,height:24,borderRadius:12,backgroundColor:'#5fae3a'},
//   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
//   dashes:{gap:4,justifyContent:'center'},dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffc83d'},
//   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
//   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},
//   qWrap:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:CREAM,borderRadius:30,paddingHorizontal:22,paddingVertical:10,marginTop:22,elevation:4,shadowColor:'#000',shadowOpacity:0.15,shadowRadius:4,shadowOffset:{width:0,height:2}},
//   q:{fontFamily:F,fontSize:24,fontWeight:'bold',color:NAVY,textAlign:'center'},
//   seqRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:34,zIndex:20},
//   seq:{fontFamily:F,fontSize:36,fontWeight:'900',color:NAVY,includeFontPadding:false},
//   slot:{width:BALL+8,height:BALL+8,alignItems:'center',justifyContent:'center',marginHorizontal:2},
//   slotRing:{position:'absolute',width:BALL+8,height:BALL+8,borderRadius:(BALL+8)/2,borderWidth:2,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.95)',backgroundColor:'rgba(255,255,255,0.18)'},
//   slotNum:{position:'absolute',fontFamily:F,fontSize:44,fontWeight:'900',color:NAVY,includeFontPadding:false},
//   ball:{position:'absolute',zIndex:30,elevation:30,width:BALL,height:BALL},
//   kwrap:{position:'absolute',left:0,right:0,bottom:150,alignItems:'center',gap:8},
//   krow:{flexDirection:'row',alignItems:'center',gap:8},
//   kside:{width:38,height:38,borderRadius:19,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
//   kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},
//   knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-2,alignItems:'center'},
//   kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
//   actions:{position:'absolute',left:0,right:0,bottom:34,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
//   acol:{alignItems:'center'},
//   lblRow:{flexDirection:'row',alignItems:'center',gap:4,height:26,marginTop:6,paddingHorizontal:12,borderRadius:13,backgroundColor:'#6b4423'},
//   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
//   hintBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#a8e22a',borderWidth:4,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center',elevation:6},
//   videoBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f3efe2',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},
//   skipBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f0484f',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},
//   note:{position:'absolute',bottom:6,alignSelf:'center',fontFamily:F,fontSize:17,fontWeight:'bold',color:'#c0392b'},

//   /* clues modal */
//   overlay:{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(16,36,94,0.45)',alignItems:'center',justifyContent:'center',zIndex:100,elevation:100,paddingHorizontal:16},
//   modal:{width:'100%',maxWidth:360,backgroundColor:'#fbf1de',borderWidth:5,borderColor:'#e8912d',borderRadius:28,padding:18,paddingTop:16},
//   mTitle:{fontFamily:F,fontSize:26,fontWeight:'bold',color:NAVY,textAlign:'center',marginBottom:14},
//   mClose:{position:'absolute',right:-6,top:-6,width:38,height:38,borderRadius:19,backgroundColor:'#ffe27a',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   mCloseX:{fontSize:18,fontWeight:'bold',color:'#e0453a'},
//   clueCard:{flexDirection:'row',alignItems:'center',gap:14,backgroundColor:'#fdf6e8',borderWidth:2,borderColor:'#4cc46a',borderRadius:22,padding:14},
//   clueNum:{width:54,height:54,borderRadius:27,backgroundColor:'#c26a22',alignItems:'center',justifyContent:'center'},
//   clueNumT:{fontFamily:F,fontSize:28,fontWeight:'bold',color:'#fff'},
//   clueHead:{fontFamily:F,fontSize:18,fontWeight:'bold',color:'#c26a22'},
//   clueBody:{fontSize:17,fontStyle:'italic',color:NAVY,marginTop:2}});
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Pressable,Animated,PanResponder,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
import {Stage,Coin} from './BTShared';
import {Icon} from './Art';
import {startLevel7,sendAction,Level7View,Level7Result,L7Thing} from './Btlevel7api';
import {Room,Thing,Tick,Cross,BigStar,HOT,ROOM_W,ROOM_H} from './Btlevel7art';
import {RoomBackground,THEME} from './Btlevel4Theme';
import {play} from './BTSound';   // same sounds as Level 5 and Level 6

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// the clue is FREE: it never depends on hints, coins or videos.
// one clue per stage (stage 1 = clock, stage 2 = timetable, stage 3 = coins)
const CLUES:Record<number,string>={
  1:'The right time may be hiding in the wrong place… or is the wrong time right in front of you?',
  2:'Find the day that comes right after Tuesday. Look for the book with that day\'s name on it.',
  3:'She already has some coins… but how many more coins does she need to buy the ticket?',
};

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level7Result)=>void;
  // called when the coins / video buttons are tapped. The parent should ONLY add hints here.
  onWatchVideo?:()=>void;
};

/* one draggable item in the tray; it snaps back unless dropped on the target */
function DragItem({thing,onDrop,disabled}:{thing:L7Thing;onDrop:(id:string,x:number,y:number)=>Promise<boolean>;disabled:boolean}){
  const xy=useRef(new Animated.ValueXY()).current;
  const [lift,setLift]=useState(false);
  const live=useRef({disabled,onDrop,thing});
  live.current={disabled,onDrop,thing};
  const back=()=>Animated.spring(xy,{toValue:{x:0,y:0},friction:6,useNativeDriver:true}).start();
  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>!live.current.disabled,
    onPanResponderGrant:()=>{play('drag');setLift(true);xy.setOffset({x:0,y:0});xy.setValue({x:0,y:0})},   // item picked up
    onPanResponderMove:Animated.event([null,{dx:xy.x,dy:xy.y}],{useNativeDriver:false}),
    onPanResponderRelease:async(e,g)=>{
      setLift(false);
      const ok=await live.current.onDrop(live.current.thing.id,g.moveX,g.moveY);
      if(!ok)back();
    },
    onPanResponderTerminate:()=>{setLift(false);back()},
  })).current;
  return <Animated.View {...pr.panHandlers}
    style={[ts.item,{zIndex:lift?60:1,elevation:lift?12:0,transform:[{translateX:xy.x},{translateY:xy.y},{scale:lift?1.15:1}]}]}>
    <Thing id={thing.id} size={62}/>
  </Animated.View>;
}

export default function BTLevel7Screen({playerId,hints=0,onExit,onComplete,onWatchVideo}:Props){
  const {width,height}=useWindowDimensions();
  const RW=Math.max(240,Math.min(width-36,340,(height-470)*ROOM_W/ROOM_H));   // room width
  const k2=(RW-6)/ROOM_W;                         // room units -> pixels (inside the 3px frame)
  const RH=ROOM_H*k2+6;

  const [view,setView]=useState<Level7View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);
  const [done,setDone]=useState(false);
  const [mark,setMark]=useState<{x:number;y:number}|null>(null);
  const [result,setResult]=useState<Level7Result|null>(null);
  const [clueOpen,setClueOpen]=useState(false);
  const zone=view&&view.target?HOT[view.target]:null;   // where the dragged thing must be dropped

  const shake=useRef(new Animated.Value(0)).current;
  const pop=useRef(new Animated.Value(0)).current;
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const babyRef=useRef<View>(null);
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  // 1. open the level - the backend creates or resumes the session
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel7(playerId)
      .then(v=>{setSessionId(v.sessionId as number);setView(v)})
      .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
  },[playerId]);

  useEffect(()=>{
    load();
    return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
  },[load]);

  useEffect(()=>{
    if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
  },[result]);

  // new stage -> close the clue popup (each stage has its own clue)
  useEffect(()=>{setClueOpen(false)},[view?.stage]);

  const flash=(m:string)=>{
    setMsg(m);clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2800);
  };
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
    Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  // 2. send the player's action; the backend decides if it is right
  const act=async(kind:'tap'|'drag',item:string,target:string|undefined,at:{x:number;y:number}):Promise<boolean>=>{
    if(busy||done||!sessionId||!view)return false;
    setBusy(true);
    try{
      const res=await sendAction({sessionId,playerId,kind,item,target});
      if(!res.correct){
        play('wrong');                                  // wrong answer
        setMark(at);doShake();flash(res.message);
        later(()=>setMark(null),700);
        setBusy(false);
        return false;
      }
      play('correct');                                  // right answer
      flash(res.message);
      if(res.completed){
        setDone(true);
        setView({...view,scene:res.scene||view.scene});
        later(()=>setResult(res),1700);
      }else{
        setView({...view,...(res as any)});            // next stage comes from the server
        setBusy(false);
      }
      return true;
    }catch(e:any){
      flash(e.message||'Network error');
      setBusy(false);
      return false;
    }
  };

  const onTap=(id:string)=>{
    const h=HOT[id];
    play('tap');                                        // something in the room tapped
    act('tap',id,undefined,{x:3+(h.x+h.w/2)*k2,y:3+(h.y+h.h/2)*k2});
  };

  // dropped somewhere: only counts when the finger is over the target
  const onDrop=(id:string,mx:number,my:number):Promise<boolean>=>new Promise(resolve=>{
    const node:any=babyRef.current;
    if(!node||!zone||!node.measureInWindow){resolve(false);return}
    node.measureInWindow((x:number,y:number,w:number,h:number)=>{
      const inside=mx>=x&&mx<=x+w&&my>=y&&my<=y+h;
      if(!inside){resolve(false);return}
      act('drag',id,view?.target||'',{x:3+(zone.x+zone.w/2)*k2,y:3+(zone.y+zone.h/2)*k2}).then(resolve);
    });
  });

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
          <Text style={st.signT}>LEVEL 7</Text>
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
          <Text style={st.load}>Loading level 7...</Text>
        </>}
      </View>
    </View></Stage>;
  }

  const tap=view.mode==='tap';
  const stageNo=Math.min(3,Math.max(1,Number(view.stage)||1));

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

      {/* the room scene */}
      <Animated.View style={{width:RW,height:RH,marginTop:10,transform:[{translateX:shake}]}}>
        <View style={st.panelFrame}><Room w={RW-6} mood={view.scene.mood}/></View>

        {/* drop target: the bag (stage 2) or Mia (stage 3), set by the server */}
        {!!zone&&<View ref={babyRef} collapsable={false} pointerEvents="none"
          style={{position:'absolute',left:3+zone.x*k2,top:3+zone.y*k2,width:zone.w*k2,height:zone.h*k2}}/>}

        {/* tap stage: invisible hotspots over every thing in the room */}
        {tap&&!done&&view.objects.map(o=>{
          const h=HOT[o.id];
          if(!h)return null;
          return <Pressable key={o.id} onPress={()=>onTap(o.id)}
            style={{position:'absolute',left:3+h.x*k2,top:3+h.y*k2,width:h.w*k2,height:h.h*k2,borderRadius:12}}/>;
        })}

        {done&&<View pointerEvents="none" style={{position:'absolute',left:RW/2-40,top:RH*0.3}}><Tick s={80}/></View>}
        {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}><Cross/></View>}
      </Animated.View>

      {/* drag stage: items to drag onto the target */}
      {!tap&&!done&&<View style={ts.row}>
        {view.tray.map(t=><DragItem key={view.stage+'-'+t.id} thing={t} disabled={busy} onDrop={onDrop}/>)}
      </View>}
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

    {/* CLUES popup (only from the magnifier, the clue of the current stage) */}
    {clueOpen&&<View style={st.overlay}>
      <View style={st.clueCard}>
        <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>{play('btn');setClueOpen(false)}}>
          <Text style={st.closeT}>✕</Text>
        </TouchableOpacity>
        <Text style={st.clueTitle}>HINTS</Text>

        <View style={[st.clueRow,st.clueRowOpen]}>
          <View style={st.clueNum}><Text style={st.clueNumT}>{stageNo}</Text></View>
          <View style={{flex:1}}>
            <Text style={st.clueHead}>{'Hint '+stageNo}</Text>
            <Text style={st.clueBody}>{CLUES[stageNo]}</Text>
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

const ts=StyleSheet.create({
  row:{flexDirection:'row',justifyContent:'center',gap:14,marginTop:16,zIndex:30,elevation:10},
  item:{width:76,height:76,borderRadius:16,backgroundColor:'rgba(255,248,230,0.95)',borderWidth:3,borderColor:'#d98b3d',alignItems:'center',justifyContent:'center'},
});

/* =========================================================
   STYLES  (same cozy room theme as Level 1 / 5 / 6)
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
  q:{flexShrink:1,fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

  panelFrame:{borderWidth:3,borderColor:THEME.wood,borderRadius:12,overflow:'hidden',backgroundColor:'#eef1f4'},

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