
// // // // // // // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // // // // // // import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // // // // // // // import {F,INK,Coin} from './BTShared';
// // // // // // // // import {Icon} from './Art';
// // // // // // // // import {startLevel5,pickItem,hintLevel5,Level5View,Level5Pick,L5Item} from './Btlevel5api';
// // // // // // // // import {Cucumber,Zucchini,Gourd,Tomato,Tick,Cross,BigStar,Duster,ChalkPiece} from './Btlevel5art';

// // // // // // // // const CHALK='#f6f4ea';

// // // // // // // // type Props={
// // // // // // // //   playerId:number;
// // // // // // // //   hints?:number;
// // // // // // // //   setHints?:(n:number)=>void;
// // // // // // // //   onExit:()=>void;
// // // // // // // //   onComplete?:(result:Level5Pick)=>void;
// // // // // // // // };

// // // // // // // // const CUC_W=112;           // cucumber / zucchini width
// // // // // // // // const TOM_W=66;

// // // // // // // // /* =========================================================
// // // // // // // //    ONE VEGETABLE ON THE BOARD
// // // // // // // // ========================================================= */

// // // // // // // // function Veg({it,bw,bh,glow,disabled,onPress}:{it:L5Item;bw:number;bh:number;glow:boolean;disabled:boolean;onPress:(it:L5Item)=>void}){
// // // // // // // //   const w=it.kind==='tomato'?TOM_W:CUC_W;
// // // // // // // //   const h=it.kind==='tomato'?TOM_W:CUC_W*0.4;
// // // // // // // //   const px=it.x*bw-w/2,py=it.y*bh-h/2;

// // // // // // // //   const x=useRef(new Animated.Value(px)).current;
// // // // // // // //   const y=useRef(new Animated.Value(py)).current;
// // // // // // // //   const sc=useRef(new Animated.Value(it.hidden?0:1)).current;
// // // // // // // //   const pulse=useRef(new Animated.Value(0)).current;

// // // // // // // //   // the server rearranged the board -> slide to the new spot
// // // // // // // //   useEffect(()=>{
// // // // // // // //     Animated.parallel([
// // // // // // // //       Animated.timing(x,{toValue:px,duration:600,useNativeDriver:false}),
// // // // // // // //       Animated.timing(y,{toValue:py,duration:600,useNativeDriver:false})]).start();
// // // // // // // //   },[px,py]);

// // // // // // // //   // picked cucumber shrinks away
// // // // // // // //   useEffect(()=>{
// // // // // // // //     if(it.hidden)Animated.timing(sc,{toValue:0,duration:280,useNativeDriver:false}).start();
// // // // // // // //   },[it.hidden]);

// // // // // // // //   // hint glow
// // // // // // // //   useEffect(()=>{
// // // // // // // //     if(!glow){pulse.setValue(0);return}
// // // // // // // //     const l=Animated.loop(Animated.sequence([
// // // // // // // //       Animated.timing(pulse,{toValue:1,duration:420,useNativeDriver:false}),
// // // // // // // //       Animated.timing(pulse,{toValue:0,duration:420,useNativeDriver:false})]));
// // // // // // // //     l.start();
// // // // // // // //     return()=>l.stop();
// // // // // // // //   },[glow]);


// // // // // // // //   const Art=it.kind==='cucumber'?Cucumber:it.kind==='zucchini'?Zucchini:it.kind==='gourd'?Gourd:Tomato;

// // // // // // // //   return <Animated.View pointerEvents={it.hidden?'none':'auto'} style={{
// // // // // // // //       position:'absolute',left:x,top:y,width:w,height:h,
// // // // // // // //       transform:[{rotate:it.rot+'deg'},{scale:sc}]}}>
// // // // // // // //     <Animated.View pointerEvents="none" style={{
// // // // // // // //       position:'absolute',left:-8,right:-8,top:-8,bottom:-8,borderRadius:20,
// // // // // // // //       borderWidth:3,borderColor:'#ffd84d',opacity:pulse}}/>
// // // // // // // //     <Pressable disabled={disabled} hitSlop={10} onPress={()=>onPress(it)} style={{width:w,height:h}}>
// // // // // // // //       <Art w={w}/>
// // // // // // // //     </Pressable>
// // // // // // // //   </Animated.View>;
// // // // // // // // }

// // // // // // // // /* =========================================================
// // // // // // // //    SCREEN
// // // // // // // // ========================================================= */

// // // // // // // // export default function BTLevel5Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // // // // // // //   const {width}=useWindowDimensions();
// // // // // // // //   const bw=Math.min(width-48,380),bh=300;

// // // // // // // //   const [view,setView]=useState<Level5View|null>(null);
// // // // // // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // // // // // //   const [loadErr,setLoadErr]=useState('');
// // // // // // // //   const [msg,setMsg]=useState('');
// // // // // // // //   const [busy,setBusy]=useState(false);
// // // // // // // //   const [mark,setMark]=useState<{x:number;y:number;ok:boolean}|null>(null);
// // // // // // // //   const [glow,setGlow]=useState<number|null>(null);
// // // // // // // //   const [result,setResult]=useState<Level5Pick|null>(null);

// // // // // // // //   const shake=useRef(new Animated.Value(0)).current;
// // // // // // // //   const pop=useRef(new Animated.Value(0)).current;
// // // // // // // //   const sway=useRef(new Animated.Value(0)).current;
// // // // // // // //   const timers=useRef<any[]>([]);
// // // // // // // //   const msgTimer=useRef<any>(null);
// // // // // // // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // // // // // // //   // 1. open the level - the backend creates or resumes the session
// // // // // // // //   const load=useCallback(()=>{
// // // // // // // //     setLoadErr('');setView(null);
// // // // // // // //     startLevel5(playerId)
// // // // // // // //       .then(v=>{setSessionId(v.sessionId as number);setView(v)})
// // // // // // // //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// // // // // // // //   },[playerId]);

// // // // // // // //   useEffect(()=>{
// // // // // // // //     load();
// // // // // // // //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// // // // // // // //   },[load]);

// // // // // // // //   useEffect(()=>{
// // // // // // // //     const l=Animated.loop(Animated.sequence([
// // // // // // // //       Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
// // // // // // // //       Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
// // // // // // // //     l.start();
// // // // // // // //     return()=>l.stop();
// // // // // // // //   },[]);

// // // // // // // //   useEffect(()=>{
// // // // // // // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // // // // // // //   },[result]);

// // // // // // // //   const flash=(m:string)=>{
// // // // // // // //     setMsg(m);clearTimeout(msgTimer.current);
// // // // // // // //     msgTimer.current=setTimeout(()=>setMsg(''),2600);
// // // // // // // //   };

// // // // // // // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// // // // // // // //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// // // // // // // //   // 2. the player tapped something -> ask the backend
// // // // // // // //   const onPick=async(it:L5Item)=>{
// // // // // // // //     if(busy||!sessionId||!view||result)return;
// // // // // // // //     setBusy(true);setGlow(null);
// // // // // // // //     try{
// // // // // // // //       const res=await pickItem({sessionId,playerId,itemId:it.id});

// // // // // // // //       if(!res.correct){
// // // // // // // //         setMark({x:it.x*bw,y:it.y*bh,ok:false});
// // // // // // // //         doShake();flash(res.message);
// // // // // // // //         later(()=>setMark(null),700);
// // // // // // // //         // zucchini -> the server sent a new arrangement
// // // // // // // //         later(()=>{setView(res);setBusy(false)},res.reshuffled?650:150);
// // // // // // // //         return;
// // // // // // // //       }

// // // // // // // //       // right cucumber: it hides first
// // // // // // // //       setView(v=>v&&{...v,items:v.items.map(i=>i.id===it.id?{...i,hidden:true}:i)});

// // // // // // // //       if(res.completed){
// // // // // // // //         later(()=>setResult(res),1000);
// // // // // // // //       }else if(res.stageDone){
// // // // // // // //         flash(res.message);
// // // // // // // //         later(()=>{setView(res);setBusy(false)},900);
// // // // // // // //       }else{
// // // // // // // //         setView(res);setBusy(false);
// // // // // // // //       }
// // // // // // // //     }catch(e:any){
// // // // // // // //       flash(e.message||'Network error');
// // // // // // // //       setBusy(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const onHint=async()=>{
// // // // // // // //     if(busy||!sessionId||result)return;
// // // // // // // //     try{
// // // // // // // //       const r=await hintLevel5({sessionId,playerId});
// // // // // // // //       setHints&&setHints(r.hints);
// // // // // // // //       setGlow(r.itemId);
// // // // // // // //     }catch(e:any){
// // // // // // // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   /* ---------- loading / error ---------- */

// // // // // // // //   if(loadErr||!view){
// // // // // // // //     return <View style={bd.wall}><View style={bd.frame}><View style={[bd.board,{justifyContent:'center'}]}>
// // // // // // // //       {loadErr?<>
// // // // // // // //         <Text style={bd.err}>{loadErr}</Text>
// // // // // // // //         <TouchableOpacity style={bd.retry} onPress={load}><Text style={bd.retryT}>Try again</Text></TouchableOpacity>
// // // // // // // //         <TouchableOpacity onPress={onExit}><Text style={bd.back}>Back</Text></TouchableOpacity>
// // // // // // // //       </>:<>
// // // // // // // //         <ActivityIndicator size="large" color={CHALK}/>
// // // // // // // //         <Text style={bd.load}>Loading level 5...</Text>
// // // // // // // //       </>}
// // // // // // // //     </View></View></View>;
// // // // // // // //   }

// // // // // // // //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});

// // // // // // // //   return <View style={bd.wall}>
// // // // // // // //     <View style={bd.frame}><View style={bd.board}>
// // // // // // // //       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
// // // // // // // //       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
// // // // // // // //       <View pointerEvents="none" style={bd.sheen}/>

// // // // // // // //       {/* top bar */}
// // // // // // // //       <View style={bd.top}>
// // // // // // // //         <View style={bd.topL}>
// // // // // // // //           <TouchableOpacity style={bd.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
// // // // // // // //           <View style={bd.round}><Icon n="gear" s={16}/></View>
// // // // // // // //         </View>
// // // // // // // //         <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
// // // // // // // //           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
// // // // // // // //           <View style={bd.sign}>
// // // // // // // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
// // // // // // // //             <Text style={bd.signt}>LEVEL 5</Text>
// // // // // // // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
// // // // // // // //           </View>
// // // // // // // //         </Animated.View>
// // // // // // // //         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
// // // // // // // //       </View>

// // // // // // // //       <Text style={[bd.q,msg?{color:'#ffb4a8'}:null]}>{msg||view.title}</Text>

// // // // // // // //       {/* vegetables */}
// // // // // // // //       <View style={bd.boardWrap}>
// // // // // // // //         <Animated.View style={{width:bw,height:bh,transform:[{translateX:shake}]}}>
// // // // // // // //           {view.items.map(it=>
// // // // // // // //             <Veg key={view.stage+'-'+it.id} it={it} bw={bw} bh={bh} glow={glow===it.id}
// // // // // // // //               disabled={busy||!!result} onPress={onPick}/>)}
// // // // // // // //           {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}>
// // // // // // // //             {mark.ok?<Tick/>:<Cross/>}
// // // // // // // //           </View>}
// // // // // // // //         </Animated.View>
// // // // // // // //       </View>

// // // // // // // //       <Text style={bd.sub}>{view.hint}</Text>

// // // // // // // //       {/* hint / video / skip */}
// // // // // // // //       <View style={bd.actions}>
// // // // // // // //         <View style={bd.acol}>
// // // // // // // //           <TouchableOpacity style={bd.hintBtn} onPress={onHint}><Icon n="search" s={34}/></TouchableOpacity>
// // // // // // // //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
// // // // // // // //         </View>
// // // // // // // //         <View style={bd.acol}>
// // // // // // // //           <View style={bd.videoBtn}><Icon n="film" s={40}/></View>
// // // // // // // //           <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
// // // // // // // //         </View>
// // // // // // // //         <View style={bd.acol}>
// // // // // // // //           <View style={bd.skipBtn}><Icon n="play" s={36}/></View>
// // // // // // // //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
// // // // // // // //         </View>
// // // // // // // //       </View>

// // // // // // // //       {/* chalk tray */}
// // // // // // // //       <View style={bd.ledge}>
// // // // // // // //         {[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:6+i*6,height:1,backgroundColor:'rgba(90,45,10,0.25)'}}/>)}
// // // // // // // //         <View style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>
// // // // // // // //         <View style={{position:'absolute',left:'40%',bottom:20}}><ChalkPiece w={78}/></View>
// // // // // // // //         <View style={{position:'absolute',left:'64%',bottom:22,transform:[{rotate:'-8deg'}]}}><ChalkPiece w={54}/></View>
// // // // // // // //       </View>

// // // // // // // //       {/* result card */}
// // // // // // // //       {!!result&&<View style={bd.overlay}>
// // // // // // // //         <Animated.View style={[bd.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // // // // // // //           <Text style={bd.cardTitle}>Level complete!</Text>
// // // // // // // //           <Text style={bd.cardMsg}>{result.message}</Text>
// // // // // // // //           <View style={bd.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// // // // // // // //           <Text style={bd.cardScore}>Score {result.score}</Text>
// // // // // // // //           <TouchableOpacity style={bd.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // // // // // // //             <Text style={bd.nextT}>NEXT</Text>
// // // // // // // //           </TouchableOpacity>
// // // // // // // //         </Animated.View>
// // // // // // // //       </View>}
// // // // // // // //     </View></View>
// // // // // // // //   </View>;
// // // // // // // // }

// // // // // // // // /* =========================================================
// // // // // // // //    STYLES  (same green chalkboard as Level 1)
// // // // // // // // ========================================================= */

// // // // // // // // const bd=StyleSheet.create({
// // // // // // // //   wall:{flex:1,backgroundColor:'#f1dcc0',paddingBottom:18},
// // // // // // // //   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:8,backgroundColor:'#1f5b44',overflow:'hidden'},
// // // // // // // //   board:{flex:1,alignItems:'center'},
// // // // // // // //   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
// // // // // // // //   sheen:{position:'absolute',left:0,right:0,top:0,height:120,backgroundColor:'rgba(255,255,255,0.04)'},

// // // // // // // //   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
// // // // // // // //   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
// // // // // // // //   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
// // // // // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // // // // //   signWrap:{alignItems:'center',paddingTop:14},
// // // // // // // //   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
// // // // // // // //   sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
// // // // // // // //   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
// // // // // // // //   dashes:{gap:4,justifyContent:'center'},
// // // // // // // //   dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
// // // // // // // //   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
// // // // // // // //   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},

// // // // // // // //   q:{fontFamily:F,fontSize:25,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,paddingHorizontal:12,
// // // // // // // //     textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
// // // // // // // //   boardWrap:{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:150},
// // // // // // // //   sub:{position:'absolute',bottom:150,fontFamily:F,fontSize:15,fontStyle:'italic',color:'rgba(246,244,234,0.6)',textAlign:'center'},

// // // // // // // //   actions:{position:'absolute',left:0,right:0,bottom:62,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
// // // // // // // //   acol:{alignItems:'center'},
// // // // // // // //   lblRow:{flexDirection:'row',alignItems:'center',gap:3,height:20,marginTop:4},
// // // // // // // //   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
// // // // // // // //   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// // // // // // // //   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // // // // // //   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // // // // // //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},

// // // // // // // //   overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
// // // // // // // //   card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
// // // // // // // //   cardTitle:{fontFamily:F,fontSize:28,fontWeight:'800',color:'#fff'},
// // // // // // // //   cardMsg:{fontFamily:F,fontSize:17,color:'#d8f3e3',textAlign:'center',marginTop:6},
// // // // // // // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // // // // // // //   cardScore:{fontFamily:F,fontSize:22,fontWeight:'700',color:'#ffd33d',marginTop:10},
// // // // // // // //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:'#a6e22e',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // // // // //   nextT:{fontFamily:F,fontSize:26,fontWeight:'900',color:INK},

// // // // // // // //   load:{fontFamily:F,fontSize:22,color:CHALK,marginTop:12},
// // // // // // // //   err:{fontFamily:F,fontSize:18,color:CHALK,textAlign:'center',paddingHorizontal:24},
// // // // // // // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
// // // // // // // //   retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
// // // // // // // //   back:{fontFamily:F,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
// // // // // // // // });
// // // // // // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // // // // // import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// // // // // // // import {Stage,Coin} from './BTShared';
// // // // // // // import {Icon} from './Art';
// // // // // // // import {startLevel5,pickItem,hintLevel5,Level5View,Level5Pick,L5Item} from './Btlevel5api';
// // // // // // // import {Cucumber,Zucchini,Gourd,Tomato,Tick,Cross,BigStar} from './Btlevel5art';
// // // // // // // import {Kovakkai,PointedGourd,SnakeGourd,RidgeGourd,Carrot,Brinjal,Pumpkin,Onion,Capsicum,VEG_SIZE} from './Btlevel5veg';
// // // // // // // import {RoomBackground,THEME} from './Btlevel4Theme';

// // // // // // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // // // // // // type Props={
// // // // // // //   playerId:number;
// // // // // // //   hints?:number;
// // // // // // //   setHints?:(n:number)=>void;
// // // // // // //   onExit:()=>void;
// // // // // // //   onComplete?:(result:Level5Pick)=>void;
// // // // // // // };

// // // // // // // /* =========================================================
// // // // // // //    LOOKS ONLY: the server still sends the same 4 kinds
// // // // // // //    (cucumber / tomato / zucchini / gourd). Here every kind is
// // // // // // //    drawn as one of several vegetables. The game rules are
// // // // // // //    decided by the server and do not change.
// // // // // // // ========================================================= */

// // // // // // // type Look={key:string;name:string;Art:any};

// // // // // // // const LOOKS:Record<string,Look[]>={
// // // // // // //   cucumber:[{key:'cucumber',name:'cucumber',Art:Cucumber}],
// // // // // // //   // not look-alikes
// // // // // // //   tomato:[
// // // // // // //     {key:'tomato',name:'tomato',Art:Tomato},
// // // // // // //     {key:'pumpkin',name:'pumpkin',Art:Pumpkin},
// // // // // // //     {key:'carrot',name:'carrot',Art:Carrot},
// // // // // // //     {key:'brinjal',name:'brinjal',Art:Brinjal},
// // // // // // //     {key:'onion',name:'onion',Art:Onion},
// // // // // // //     {key:'capsicum',name:'capsicum',Art:Capsicum},
// // // // // // //   ],
// // // // // // //   // look-alikes
// // // // // // //   zucchini:[
// // // // // // //     {key:'kovakkai',name:'ivy gourd',Art:Kovakkai},
// // // // // // //     {key:'pointed',name:'pointed gourd',Art:PointedGourd},
// // // // // // //     {key:'zucchini',name:'zucchini',Art:Zucchini},
// // // // // // //   ],
// // // // // // //   gourd:[
// // // // // // //     {key:'snake',name:'snake gourd',Art:SnakeGourd},
// // // // // // //     {key:'ridge',name:'ridge gourd',Art:RidgeGourd},
// // // // // // //     {key:'gourd',name:'bitter gourd',Art:Gourd},
// // // // // // //   ],
// // // // // // // };

// // // // // // // // same vegetable stays the same for an item (picked by its order among the same kind)
// // // // // // // const lookOf=(it:L5Item,items:L5Item[]):Look=>{
// // // // // // //   const list=LOOKS[it.kind]||LOOKS.tomato;
// // // // // // //   const order=items.filter(i=>i.kind===it.kind&&i.id<it.id).length;
// // // // // // //   return list[order%list.length];
// // // // // // // };

// // // // // // // const article=(n:string)=>/^[aeiou]/i.test(n)?'an':'a';

// // // // // // // // wrong-pick text that matches the vegetable that is drawn
// // // // // // // const wrongText=(kind:string,name:string)=>{
// // // // // // //   if(kind==='tomato')return `${article(name)[0].toUpperCase()+article(name).slice(1)} ${name} is not a cucumber!`;
// // // // // // //   if(kind==='zucchini')return `Oops! That is ${article(name)} ${name}. Find the real cucumber!`;
// // // // // // //   return `That is ${article(name)} ${name}, not a cucumber!`;
// // // // // // // };

// // // // // // // /* =========================================================
// // // // // // //    ONE VEGETABLE ON THE BOARD
// // // // // // // ========================================================= */

// // // // // // // function Veg({it,look,bw,bh,glow,disabled,onPress}:{it:L5Item;look:Look;bw:number;bh:number;glow:boolean;disabled:boolean;onPress:(it:L5Item)=>void}){
// // // // // // //   const size=VEG_SIZE[look.key]||VEG_SIZE.tomato;
// // // // // // //   const w=size.w,h=size.h;
// // // // // // //   const px=it.x*bw-w/2,py=it.y*bh-h/2;

// // // // // // //   const x=useRef(new Animated.Value(px)).current;
// // // // // // //   const y=useRef(new Animated.Value(py)).current;
// // // // // // //   const sc=useRef(new Animated.Value(it.hidden?0:1)).current;
// // // // // // //   const pulse=useRef(new Animated.Value(0)).current;

// // // // // // //   // the server rearranged the board -> slide to the new spot
// // // // // // //   useEffect(()=>{
// // // // // // //     Animated.parallel([
// // // // // // //       Animated.timing(x,{toValue:px,duration:600,useNativeDriver:false}),
// // // // // // //       Animated.timing(y,{toValue:py,duration:600,useNativeDriver:false})]).start();
// // // // // // //   },[px,py]);

// // // // // // //   // picked cucumber shrinks away
// // // // // // //   useEffect(()=>{
// // // // // // //     if(it.hidden)Animated.timing(sc,{toValue:0,duration:280,useNativeDriver:false}).start();
// // // // // // //   },[it.hidden]);

// // // // // // //   // hint glow
// // // // // // //   useEffect(()=>{
// // // // // // //     if(!glow){pulse.setValue(0);return}
// // // // // // //     const l=Animated.loop(Animated.sequence([
// // // // // // //       Animated.timing(pulse,{toValue:1,duration:420,useNativeDriver:false}),
// // // // // // //       Animated.timing(pulse,{toValue:0,duration:420,useNativeDriver:false})]));
// // // // // // //     l.start();
// // // // // // //     return()=>l.stop();
// // // // // // //   },[glow]);

// // // // // // //   const Art=look.Art;

// // // // // // //   return <Animated.View pointerEvents={it.hidden?'none':'auto'} style={{
// // // // // // //       position:'absolute',left:x,top:y,width:w,height:h,
// // // // // // //       transform:[{rotate:it.rot+'deg'},{scale:sc}]}}>
// // // // // // //     <Animated.View pointerEvents="none" style={{
// // // // // // //       position:'absolute',left:-8,right:-8,top:-8,bottom:-8,borderRadius:20,
// // // // // // //       borderWidth:3,borderColor:'#ffb300',opacity:pulse}}/>
// // // // // // //     <Pressable disabled={disabled} hitSlop={10} onPress={()=>onPress(it)} style={{width:w,height:h}}>
// // // // // // //       <Art w={w}/>
// // // // // // //     </Pressable>
// // // // // // //   </Animated.View>;
// // // // // // // }

// // // // // // // /* =========================================================
// // // // // // //    SCREEN
// // // // // // // ========================================================= */

// // // // // // // export default function BTLevel5Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // // // // // //   const {width,height}=useWindowDimensions();
// // // // // // //   const bw=Math.min(width-48,380);
// // // // // // //   const bh=Math.max(250,Math.min(300,height-360));

// // // // // // //   const [view,setView]=useState<Level5View|null>(null);
// // // // // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // // // // //   const [loadErr,setLoadErr]=useState('');
// // // // // // //   const [msg,setMsg]=useState('');
// // // // // // //   const [busy,setBusy]=useState(false);
// // // // // // //   const [mark,setMark]=useState<{x:number;y:number;ok:boolean}|null>(null);
// // // // // // //   const [glow,setGlow]=useState<number|null>(null);
// // // // // // //   const [result,setResult]=useState<Level5Pick|null>(null);

// // // // // // //   const shake=useRef(new Animated.Value(0)).current;
// // // // // // //   const pop=useRef(new Animated.Value(0)).current;
// // // // // // //   const timers=useRef<any[]>([]);
// // // // // // //   const msgTimer=useRef<any>(null);
// // // // // // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // // // // // //   // 1. open the level - the backend creates or resumes the session
// // // // // // //   const load=useCallback(()=>{
// // // // // // //     setLoadErr('');setView(null);
// // // // // // //     startLevel5(playerId)
// // // // // // //       .then(v=>{setSessionId(v.sessionId as number);setView(v)})
// // // // // // //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// // // // // // //   },[playerId]);

// // // // // // //   useEffect(()=>{
// // // // // // //     load();
// // // // // // //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// // // // // // //   },[load]);

// // // // // // //   useEffect(()=>{
// // // // // // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // // // // // //   },[result]);

// // // // // // //   const flash=(m:string)=>{
// // // // // // //     setMsg(m);clearTimeout(msgTimer.current);
// // // // // // //     msgTimer.current=setTimeout(()=>setMsg(''),2600);
// // // // // // //   };

// // // // // // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// // // // // // //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// // // // // // //   // 2. the player tapped something -> ask the backend
// // // // // // //   const onPick=async(it:L5Item)=>{
// // // // // // //     if(busy||!sessionId||!view||result)return;
// // // // // // //     const look=lookOf(it,view.items);
// // // // // // //     setBusy(true);setGlow(null);
// // // // // // //     try{
// // // // // // //       const res=await pickItem({sessionId,playerId,itemId:it.id});

// // // // // // //       if(!res.correct){
// // // // // // //         setMark({x:it.x*bw,y:it.y*bh,ok:false});
// // // // // // //         doShake();flash(wrongText(it.kind,look.name));
// // // // // // //         later(()=>setMark(null),700);
// // // // // // //         // zucchini / gourd in the last stage -> the server sent a new arrangement
// // // // // // //         later(()=>{setView(res);setBusy(false)},res.reshuffled?650:150);
// // // // // // //         return;
// // // // // // //       }

// // // // // // //       // right cucumber: it hides first
// // // // // // //       setView(v=>v&&{...v,items:v.items.map(i=>i.id===it.id?{...i,hidden:true}:i)});

// // // // // // //       if(res.completed){
// // // // // // //         later(()=>setResult(res),1000);
// // // // // // //       }else if(res.stageDone){
// // // // // // //         flash(res.message);
// // // // // // //         later(()=>{setView(res);setBusy(false)},900);
// // // // // // //       }else{
// // // // // // //         setView(res);setBusy(false);
// // // // // // //       }
// // // // // // //     }catch(e:any){
// // // // // // //       flash(e.message||'Network error');
// // // // // // //       setBusy(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const onHint=async()=>{
// // // // // // //     if(busy||!sessionId||result)return;
// // // // // // //     try{
// // // // // // //       const r=await hintLevel5({sessionId,playerId});
// // // // // // //       setHints&&setHints(r.hints);
// // // // // // //       setGlow(r.itemId);
// // // // // // //     }catch(e:any){
// // // // // // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // // // // // //     }
// // // // // // //   };

// // // // // // //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// // // // // // //   const header=(
// // // // // // //     <View style={st.topBar}>
// // // // // // //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
// // // // // // //         <Icon n="home" s={16}/>
// // // // // // //       </TouchableOpacity>

// // // // // // //       <View style={st.signWrap}>
// // // // // // //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// // // // // // //         <View style={st.sign}>
// // // // // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // // // // //           <Text style={st.signT}>LEVEL 5</Text>
// // // // // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // // // // //         </View>
// // // // // // //         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
// // // // // // //         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
// // // // // // //       </View>

// // // // // // //       <View style={st.pill}>
// // // // // // //         <Text style={st.pillT}>{hints}</Text>
// // // // // // //         <Text style={st.pillIcon}>💡</Text>
// // // // // // //       </View>
// // // // // // //     </View>
// // // // // // //   );

// // // // // // //   /* ---------- loading / error ---------- */

// // // // // // //   if(loadErr||!view){
// // // // // // //     return <Stage bg="#bddaee"><View style={st.root}>
// // // // // // //       <RoomBackground/>
// // // // // // //       {header}
// // // // // // //       <View style={st.centerMsg}>
// // // // // // //         {loadErr?<>
// // // // // // //           <Text style={st.err}>{loadErr}</Text>
// // // // // // //           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // // // // //           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // // // // //         </>:<>
// // // // // // //           <ActivityIndicator size="large" color={THEME.orange}/>
// // // // // // //           <Text style={st.load}>Loading level 5...</Text>
// // // // // // //         </>}
// // // // // // //       </View>
// // // // // // //     </View></Stage>;
// // // // // // //   }

// // // // // // //   return <Stage bg="#bddaee"><View style={st.root}>
// // // // // // //     <RoomBackground/>
// // // // // // //     {header}

// // // // // // //     <View style={st.center}>
// // // // // // //       {/* question pill (same as level 1) */}
// // // // // // //       <View style={st.qPill}>
// // // // // // //         <Text style={st.qArrow}>{'<'}</Text>
// // // // // // //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// // // // // // //         <Text style={st.qArrow}>{'>'}</Text>
// // // // // // //       </View>

// // // // // // //       {/* vegetables */}
// // // // // // //       <Animated.View style={{width:bw,height:bh,marginTop:10,transform:[{translateX:shake}]}}>
// // // // // // //         {view.items.map(it=>
// // // // // // //           <Veg key={view.stage+'-'+it.id} it={it} look={lookOf(it,view.items)} bw={bw} bh={bh} glow={glow===it.id}
// // // // // // //             disabled={busy||!!result} onPress={onPick}/>)}
// // // // // // //         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}>
// // // // // // //           {mark.ok?<Tick/>:<Cross/>}
// // // // // // //         </View>}
// // // // // // //       </Animated.View>

// // // // // // //       <Text style={st.sub}>{view.hint}</Text>
// // // // // // //     </View>

// // // // // // //     {/* bottom rounded panel (same as level 1) */}
// // // // // // //     <View style={st.panel}>
// // // // // // //       <View style={st.btnCol}>
// // // // // // //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
// // // // // // //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// // // // // // //         </TouchableOpacity>
// // // // // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
// // // // // // //       </View>

// // // // // // //       <View style={st.btnCol}>
// // // // // // //         <View style={st.ringWhite}><Icon n="film" s={36}/></View>
// // // // // // //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// // // // // // //       </View>

// // // // // // //       <View style={st.btnCol}>
// // // // // // //         <View style={st.ringWhite}><View style={st.circleRed}><Icon n="play" s={30}/></View></View>
// // // // // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// // // // // // //       </View>
// // // // // // //     </View>

// // // // // // //     {/* result card */}
// // // // // // //     {!!result&&<View style={st.overlay}>
// // // // // // //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // // // // // //         <Text style={st.cardTitle}>Level complete!</Text>
// // // // // // //         <Text style={st.cardMsg}>{result.message}</Text>
// // // // // // //         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// // // // // // //         <Text style={st.cardScore}>Score {result.score}</Text>
// // // // // // //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // // // // // //           <Text style={st.nextT}>NEXT</Text>
// // // // // // //         </TouchableOpacity>
// // // // // // //       </Animated.View>
// // // // // // //     </View>}
// // // // // // //   </View></Stage>;
// // // // // // // }

// // // // // // // /* =========================================================
// // // // // // //    STYLES  (same room theme as Level 1)
// // // // // // // ========================================================= */

// // // // // // // const st=StyleSheet.create({
// // // // // // //   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

// // // // // // //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// // // // // // //   homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
// // // // // // //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// // // // // // //   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
// // // // // // //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
// // // // // // //   signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
// // // // // // //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// // // // // // //   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
// // // // // // //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
// // // // // // //   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
// // // // // // //   pillIcon:{fontSize:16},

// // // // // // //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// // // // // // //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // // // // // //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,maxWidth:360},
// // // // // // //   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
// // // // // // //   q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},
// // // // // // //   sub:{fontFamily:FONT,fontSize:15,fontStyle:'italic',fontWeight:'700',color:THEME.navy,textAlign:'center',marginTop:6},

// // // // // // //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// // // // // // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// // // // // // //   btnCol:{alignItems:'center'},
// // // // // // //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // // // // //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// // // // // // //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // // // // //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// // // // // // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// // // // // // //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// // // // // // //   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
// // // // // // //   card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
// // // // // // //   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
// // // // // // //   cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
// // // // // // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // // // // // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
// // // // // // //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // // // // //   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

// // // // // // //   load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
// // // // // // //   err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
// // // // // // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
// // // // // // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
// // // // // // //   back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
// // // // // // // });
// // // // // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // // // // import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// // // // // // import {Stage,Coin} from './BTShared';
// // // // // // import {Icon} from './Art';
// // // // // // import {startLevel5,pickItem,hintLevel5,Level5View,Level5Pick,L5Item} from './Btlevel5api';
// // // // // // import {Cucumber,Tick,Cross,BigStar} from './Btlevel5art';
// // // // // // import {Kovakkai,PointedGourd,SnakeGourd,RidgeGourd,Capsicum,Okra,GreenChilli,Cabbage,Broccoli,VEG_SIZE} from './Btlevel5veg';
// // // // // // import {RoomBackground,THEME} from './Btlevel4Theme';

// // // // // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // // // // // type Props={
// // // // // //   playerId:number;
// // // // // //   hints?:number;
// // // // // //   setHints?:(n:number)=>void;
// // // // // //   onExit:()=>void;
// // // // // //   onComplete?:(result:Level5Pick)=>void;
// // // // // // };

// // // // // // /* =========================================================
// // // // // //    LOOKS ONLY: the server still sends the same 4 kinds
// // // // // //    (cucumber / tomato / zucchini / gourd). Here every kind is
// // // // // //    drawn as one of several vegetables. The game rules are
// // // // // //    decided by the server and do not change.
// // // // // // ========================================================= */

// // // // // // type Look={key:string;name:string;Art:any};

// // // // // // const LOOKS:Record<string,Look[]>={
// // // // // //   cucumber:[{key:'cucumber',name:'cucumber',Art:Cucumber}],
// // // // // //   // other green vegetables
// // // // // //   tomato:[
// // // // // //     {key:'capsicum',name:'capsicum',Art:Capsicum},
// // // // // //     {key:'okra',name:'ladies finger',Art:Okra},
// // // // // //     {key:'chilli',name:'green chilli',Art:GreenChilli},
// // // // // //     {key:'cabbage',name:'cabbage',Art:Cabbage},
// // // // // //     {key:'broccoli',name:'broccoli',Art:Broccoli},
// // // // // //   ],
// // // // // //   // gourds
// // // // // //   zucchini:[
// // // // // //     {key:'kovakkai',name:'ivy gourd',Art:Kovakkai},
// // // // // //     {key:'pointed',name:'pointed gourd',Art:PointedGourd},
// // // // // //   ],
// // // // // //   gourd:[
// // // // // //     {key:'snake',name:'snake gourd',Art:SnakeGourd},
// // // // // //     {key:'ridge',name:'ridge gourd',Art:RidgeGourd},
// // // // // //   ],
// // // // // // };

// // // // // // // same vegetable stays the same for an item (picked by its order among the same kind)
// // // // // // const lookOf=(it:L5Item,items:L5Item[]):Look=>{
// // // // // //   const list=LOOKS[it.kind]||LOOKS.tomato;
// // // // // //   const order=items.filter(i=>i.kind===it.kind&&i.id<it.id).length;
// // // // // //   return list[order%list.length];
// // // // // // };

// // // // // // const article=(n:string)=>/^[aeiou]/i.test(n)?'an':'a';

// // // // // // // wrong-pick text that matches the vegetable that is drawn
// // // // // // const wrongText=(kind:string,name:string)=>{
// // // // // //   if(kind==='tomato')return `${article(name)[0].toUpperCase()+article(name).slice(1)} ${name} is not a cucumber!`;
// // // // // //   if(kind==='zucchini')return `Oops! That is ${article(name)} ${name}. Find the real cucumber!`;
// // // // // //   return `That is ${article(name)} ${name}, not a cucumber!`;
// // // // // // };

// // // // // // /* =========================================================
// // // // // //    ONE VEGETABLE ON THE BOARD
// // // // // // ========================================================= */

// // // // // // function Veg({it,look,bw,bh,glow,disabled,onPress}:{it:L5Item;look:Look;bw:number;bh:number;glow:boolean;disabled:boolean;onPress:(it:L5Item)=>void}){
// // // // // //   const size=VEG_SIZE[look.key]||VEG_SIZE.tomato;
// // // // // //   const w=size.w,h=size.h;
// // // // // //   const px=it.x*bw-w/2,py=it.y*bh-h/2;

// // // // // //   const x=useRef(new Animated.Value(px)).current;
// // // // // //   const y=useRef(new Animated.Value(py)).current;
// // // // // //   const sc=useRef(new Animated.Value(it.hidden?0:1)).current;
// // // // // //   const pulse=useRef(new Animated.Value(0)).current;

// // // // // //   // the server rearranged the board -> slide to the new spot
// // // // // //   useEffect(()=>{
// // // // // //     Animated.parallel([
// // // // // //       Animated.timing(x,{toValue:px,duration:600,useNativeDriver:false}),
// // // // // //       Animated.timing(y,{toValue:py,duration:600,useNativeDriver:false})]).start();
// // // // // //   },[px,py]);

// // // // // //   // picked cucumber shrinks away
// // // // // //   useEffect(()=>{
// // // // // //     if(it.hidden)Animated.timing(sc,{toValue:0,duration:280,useNativeDriver:false}).start();
// // // // // //   },[it.hidden]);

// // // // // //   // hint glow
// // // // // //   useEffect(()=>{
// // // // // //     if(!glow){pulse.setValue(0);return}
// // // // // //     const l=Animated.loop(Animated.sequence([
// // // // // //       Animated.timing(pulse,{toValue:1,duration:420,useNativeDriver:false}),
// // // // // //       Animated.timing(pulse,{toValue:0,duration:420,useNativeDriver:false})]));
// // // // // //     l.start();
// // // // // //     return()=>l.stop();
// // // // // //   },[glow]);

// // // // // //   const Art=look.Art;

// // // // // //   return <Animated.View pointerEvents={it.hidden?'none':'auto'} style={{
// // // // // //       position:'absolute',left:x,top:y,width:w,height:h,
// // // // // //       transform:[{rotate:it.rot+'deg'},{scale:sc}]}}>
// // // // // //     <Animated.View pointerEvents="none" style={{
// // // // // //       position:'absolute',left:-8,right:-8,top:-8,bottom:-8,borderRadius:20,
// // // // // //       borderWidth:3,borderColor:'#ffb300',opacity:pulse}}/>
// // // // // //     <Pressable disabled={disabled} hitSlop={10} onPress={()=>onPress(it)} style={{width:w,height:h}}>
// // // // // //       <Art w={w}/>
// // // // // //     </Pressable>
// // // // // //   </Animated.View>;
// // // // // // }

// // // // // // /* =========================================================
// // // // // //    SCREEN
// // // // // // ========================================================= */

// // // // // // export default function BTLevel5Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // // // // //   const {width,height}=useWindowDimensions();
// // // // // //   const bw=Math.min(width-48,380);
// // // // // //   const bh=Math.max(250,Math.min(300,height-360));

// // // // // //   const [view,setView]=useState<Level5View|null>(null);
// // // // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // // // //   const [loadErr,setLoadErr]=useState('');
// // // // // //   const [msg,setMsg]=useState('');
// // // // // //   const [busy,setBusy]=useState(false);
// // // // // //   const [mark,setMark]=useState<{x:number;y:number;ok:boolean}|null>(null);
// // // // // //   const [glow,setGlow]=useState<number|null>(null);
// // // // // //   const [result,setResult]=useState<Level5Pick|null>(null);

// // // // // //   const shake=useRef(new Animated.Value(0)).current;
// // // // // //   const pop=useRef(new Animated.Value(0)).current;
// // // // // //   const timers=useRef<any[]>([]);
// // // // // //   const msgTimer=useRef<any>(null);
// // // // // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // // // // //   // 1. open the level - the backend creates or resumes the session
// // // // // //   const load=useCallback(()=>{
// // // // // //     setLoadErr('');setView(null);
// // // // // //     startLevel5(playerId)
// // // // // //       .then(v=>{setSessionId(v.sessionId as number);setView(v)})
// // // // // //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// // // // // //   },[playerId]);

// // // // // //   useEffect(()=>{
// // // // // //     load();
// // // // // //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// // // // // //   },[load]);

// // // // // //   useEffect(()=>{
// // // // // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // // // // //   },[result]);

// // // // // //   const flash=(m:string)=>{
// // // // // //     setMsg(m);clearTimeout(msgTimer.current);
// // // // // //     msgTimer.current=setTimeout(()=>setMsg(''),2600);
// // // // // //   };

// // // // // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// // // // // //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// // // // // //   // 2. the player tapped something -> ask the backend
// // // // // //   const onPick=async(it:L5Item)=>{
// // // // // //     if(busy||!sessionId||!view||result)return;
// // // // // //     const look=lookOf(it,view.items);
// // // // // //     setBusy(true);setGlow(null);
// // // // // //     try{
// // // // // //       const res=await pickItem({sessionId,playerId,itemId:it.id});

// // // // // //       if(!res.correct){
// // // // // //         setMark({x:it.x*bw,y:it.y*bh,ok:false});
// // // // // //         doShake();flash(wrongText(it.kind,look.name));
// // // // // //         later(()=>setMark(null),700);
// // // // // //         // wrong pick -> the server sent a new arrangement, the player taps again
// // // // // //         later(()=>{setView(res);setBusy(false)},res.reshuffled?650:150);
// // // // // //         return;
// // // // // //       }

// // // // // //       // right cucumber: it hides first
// // // // // //       setView(v=>v&&{...v,items:v.items.map(i=>i.id===it.id?{...i,hidden:true}:i)});

// // // // // //       if(res.completed){
// // // // // //         later(()=>setResult(res),1000);
// // // // // //       }else if(res.stageDone){
// // // // // //         flash(res.message);
// // // // // //         later(()=>{setView(res);setBusy(false)},900);
// // // // // //       }else{
// // // // // //         setView(res);setBusy(false);
// // // // // //       }
// // // // // //     }catch(e:any){
// // // // // //       flash(e.message||'Network error');
// // // // // //       setBusy(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const onHint=async()=>{
// // // // // //     if(busy||!sessionId||result)return;
// // // // // //     try{
// // // // // //       const r=await hintLevel5({sessionId,playerId});
// // // // // //       setHints&&setHints(r.hints);
// // // // // //       setGlow(r.itemId);
// // // // // //     }catch(e:any){
// // // // // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // // // // //     }
// // // // // //   };

// // // // // //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// // // // // //   const header=(
// // // // // //     <View style={st.topBar}>
// // // // // //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
// // // // // //         <Icon n="home" s={16}/>
// // // // // //       </TouchableOpacity>

// // // // // //       <View style={st.signWrap}>
// // // // // //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// // // // // //         <View style={st.sign}>
// // // // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // // // //           <Text style={st.signT}>LEVEL 5</Text>
// // // // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // // // //         </View>
// // // // // //         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
// // // // // //         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
// // // // // //       </View>

// // // // // //       <View style={st.pill}>
// // // // // //         <Text style={st.pillT}>{hints}</Text>
// // // // // //         <Text style={st.pillIcon}>💡</Text>
// // // // // //       </View>
// // // // // //     </View>
// // // // // //   );

// // // // // //   /* ---------- loading / error ---------- */

// // // // // //   if(loadErr||!view){
// // // // // //     return <Stage bg="#bddaee"><View style={st.root}>
// // // // // //       <RoomBackground/>
// // // // // //       {header}
// // // // // //       <View style={st.centerMsg}>
// // // // // //         {loadErr?<>
// // // // // //           <Text style={st.err}>{loadErr}</Text>
// // // // // //           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // // // //           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // // // //         </>:<>
// // // // // //           <ActivityIndicator size="large" color={THEME.orange}/>
// // // // // //           <Text style={st.load}>Loading level 5...</Text>
// // // // // //         </>}
// // // // // //       </View>
// // // // // //     </View></Stage>;
// // // // // //   }

// // // // // //   return <Stage bg="#bddaee"><View style={st.root}>
// // // // // //     <RoomBackground/>
// // // // // //     {header}

// // // // // //     <View style={st.center}>
// // // // // //       {/* question pill (same as level 1) */}
// // // // // //       <View style={st.qPill}>
// // // // // //         <Text style={st.qArrow}>{'<'}</Text>
// // // // // //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// // // // // //         <Text style={st.qArrow}>{'>'}</Text>
// // // // // //       </View>

// // // // // //       {/* vegetables */}
// // // // // //       <Animated.View style={{width:bw,height:bh,marginTop:10,transform:[{translateX:shake}]}}>
// // // // // //         {view.items.map(it=>
// // // // // //           <Veg key={view.stage+'-'+it.id} it={it} look={lookOf(it,view.items)} bw={bw} bh={bh} glow={glow===it.id}
// // // // // //             disabled={busy||!!result} onPress={onPick}/>)}
// // // // // //         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}>
// // // // // //           {mark.ok?<Tick/>:<Cross/>}
// // // // // //         </View>}
// // // // // //       </Animated.View>

// // // // // //       <Text style={st.sub}>{view.hint}</Text>
// // // // // //     </View>

// // // // // //     {/* bottom rounded panel (same as level 1) */}
// // // // // //     <View style={st.panel}>
// // // // // //       <View style={st.btnCol}>
// // // // // //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
// // // // // //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// // // // // //         </TouchableOpacity>
// // // // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
// // // // // //       </View>

// // // // // //       <View style={st.btnCol}>
// // // // // //         <View style={st.ringWhite}><Icon n="film" s={36}/></View>
// // // // // //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// // // // // //       </View>

// // // // // //       <View style={st.btnCol}>
// // // // // //         <View style={st.ringWhite}><View style={st.circleRed}><Icon n="play" s={30}/></View></View>
// // // // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// // // // // //       </View>
// // // // // //     </View>

// // // // // //     {/* result card */}
// // // // // //     {!!result&&<View style={st.overlay}>
// // // // // //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // // // // //         <Text style={st.cardTitle}>Level complete!</Text>
// // // // // //         <Text style={st.cardMsg}>{result.message}</Text>
// // // // // //         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// // // // // //         <Text style={st.cardScore}>Score {result.score}</Text>
// // // // // //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // // // // //           <Text style={st.nextT}>NEXT</Text>
// // // // // //         </TouchableOpacity>
// // // // // //       </Animated.View>
// // // // // //     </View>}
// // // // // //   </View></Stage>;
// // // // // // }

// // // // // // /* =========================================================
// // // // // //    STYLES  (same room theme as Level 1)
// // // // // // ========================================================= */

// // // // // // const st=StyleSheet.create({
// // // // // //   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

// // // // // //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// // // // // //   homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
// // // // // //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// // // // // //   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
// // // // // //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
// // // // // //   signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
// // // // // //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// // // // // //   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
// // // // // //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
// // // // // //   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
// // // // // //   pillIcon:{fontSize:16},

// // // // // //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// // // // // //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // // // // //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,maxWidth:360},
// // // // // //   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
// // // // // //   q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},
// // // // // //   sub:{fontFamily:FONT,fontSize:15,fontStyle:'italic',fontWeight:'700',color:THEME.navy,textAlign:'center',marginTop:6},

// // // // // //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// // // // // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// // // // // //   btnCol:{alignItems:'center'},
// // // // // //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // // // //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// // // // // //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // // // //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// // // // // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// // // // // //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// // // // // //   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
// // // // // //   card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
// // // // // //   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
// // // // // //   cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
// // // // // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // // // // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
// // // // // //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // // // //   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

// // // // // //   load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
// // // // // //   err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
// // // // // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
// // // // // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
// // // // // //   back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
// // // // // // });
// // // // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // // // import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// // // // // import {Stage,Coin} from './BTShared';
// // // // // import {Icon} from './Art';
// // // // // import {startLevel5,pickItem,hintLevel5,Level5View,Level5Pick,L5Item} from './Btlevel5api';
// // // // // import {Cucumber,Tick,Cross,BigStar} from './Btlevel5art';
// // // // // import {Kovakkai,PointedGourd,SnakeGourd,RidgeGourd,Capsicum,Okra,GreenChilli,Cabbage,Broccoli,VEG_SIZE} from './Btlevel5veg';
// // // // // import {RoomBackground,THEME} from './Btlevel4Theme';

// // // // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // // // // type Props={
// // // // //   playerId:number;
// // // // //   hints?:number;
// // // // //   setHints?:(n:number)=>void;
// // // // //   onExit:()=>void;
// // // // //   onComplete?:(result:Level5Pick)=>void;
// // // // // };

// // // // // /* =========================================================
// // // // //    LOOKS ONLY: the server still sends the same 4 kinds
// // // // //    (cucumber / tomato / zucchini / gourd). Here every kind is
// // // // //    drawn as one of several vegetables. The game rules are
// // // // //    decided by the server and do not change.
// // // // // ========================================================= */

// // // // // type Look={key:string;name:string;Art:any};

// // // // // const LOOKS:Record<string,Look[]>={
// // // // //   cucumber:[{key:'cucumber',name:'cucumber',Art:Cucumber}],
// // // // //   // other green vegetables
// // // // //   tomato:[
// // // // //     {key:'capsicum',name:'capsicum',Art:Capsicum},
// // // // //     {key:'okra',name:'ladies finger',Art:Okra},
// // // // //     {key:'chilli',name:'green chilli',Art:GreenChilli},
// // // // //     {key:'cabbage',name:'cabbage',Art:Cabbage},
// // // // //     {key:'broccoli',name:'broccoli',Art:Broccoli},
// // // // //   ],
// // // // //   // gourds
// // // // //   zucchini:[
// // // // //     {key:'kovakkai',name:'ivy gourd',Art:Kovakkai},
// // // // //     {key:'pointed',name:'pointed gourd',Art:PointedGourd},
// // // // //   ],
// // // // //   gourd:[
// // // // //     {key:'snake',name:'snake gourd',Art:SnakeGourd},
// // // // //     {key:'ridge',name:'ridge gourd',Art:RidgeGourd},
// // // // //   ],
// // // // // };

// // // // // // same vegetable stays the same for an item (picked by its order among the same kind)
// // // // // const lookOf=(it:L5Item,items:L5Item[]):Look=>{
// // // // //   const list=LOOKS[it.kind]||LOOKS.tomato;
// // // // //   const order=items.filter(i=>i.kind===it.kind&&i.id<it.id).length;
// // // // //   return list[order%list.length];
// // // // // };

// // // // // const article=(n:string)=>/^[aeiou]/i.test(n)?'an':'a';

// // // // // // wrong-pick text that matches the vegetable that is drawn
// // // // // const wrongText=(kind:string,name:string)=>{
// // // // //   if(kind==='tomato')return `${article(name)[0].toUpperCase()+article(name).slice(1)} ${name} is not a cucumber!`;
// // // // //   if(kind==='zucchini')return `Oops! That is ${article(name)} ${name}. Find the real cucumber!`;
// // // // //   return `That is ${article(name)} ${name}, not a cucumber!`;
// // // // // };

// // // // // /* =========================================================
// // // // //    ONE VEGETABLE ON THE BOARD
// // // // // ========================================================= */

// // // // // function Veg({it,look,bw,bh,glow,disabled,onPress}:{it:L5Item;look:Look;bw:number;bh:number;glow:boolean;disabled:boolean;onPress:(it:L5Item)=>void}){
// // // // //   const size=VEG_SIZE[look.key]||VEG_SIZE.tomato;
// // // // //   const w=size.w,h=size.h;
// // // // //   const px=it.x*bw-w/2,py=it.y*bh-h/2;

// // // // //   const x=useRef(new Animated.Value(px)).current;
// // // // //   const y=useRef(new Animated.Value(py)).current;
// // // // //   const sc=useRef(new Animated.Value(it.hidden?0:1)).current;
// // // // //   const pulse=useRef(new Animated.Value(0)).current;

// // // // //   // the server rearranged the board -> slide to the new spot
// // // // //   useEffect(()=>{
// // // // //     Animated.parallel([
// // // // //       Animated.timing(x,{toValue:px,duration:600,useNativeDriver:false}),
// // // // //       Animated.timing(y,{toValue:py,duration:600,useNativeDriver:false})]).start();
// // // // //   },[px,py]);

// // // // //   // picked cucumber shrinks away
// // // // //   useEffect(()=>{
// // // // //     if(it.hidden)Animated.timing(sc,{toValue:0,duration:280,useNativeDriver:false}).start();
// // // // //   },[it.hidden]);

// // // // //   // hint glow
// // // // //   useEffect(()=>{
// // // // //     if(!glow){pulse.setValue(0);return}
// // // // //     const l=Animated.loop(Animated.sequence([
// // // // //       Animated.timing(pulse,{toValue:1,duration:420,useNativeDriver:false}),
// // // // //       Animated.timing(pulse,{toValue:0,duration:420,useNativeDriver:false})]));
// // // // //     l.start();
// // // // //     return()=>l.stop();
// // // // //   },[glow]);

// // // // //   const Art=look.Art;

// // // // //   return <Animated.View pointerEvents={it.hidden?'none':'auto'} style={{
// // // // //       position:'absolute',left:x,top:y,width:w,height:h,
// // // // //       transform:[{rotate:it.rot+'deg'},{scale:sc}]}}>
// // // // //     <Animated.View pointerEvents="none" style={{
// // // // //       position:'absolute',left:-8,right:-8,top:-8,bottom:-8,borderRadius:20,
// // // // //       borderWidth:3,borderColor:'#ffb300',opacity:pulse}}/>
// // // // //     <Pressable disabled={disabled} hitSlop={10} onPress={()=>onPress(it)} style={{width:w,height:h}}>
// // // // //       <Art w={w}/>
// // // // //     </Pressable>
// // // // //   </Animated.View>;
// // // // // }

// // // // // /* =========================================================
// // // // //    SCREEN
// // // // // ========================================================= */

// // // // // export default function BTLevel5Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // // // //   const {width,height}=useWindowDimensions();
// // // // //   const bw=Math.min(width-48,380);
// // // // //   const bh=Math.max(250,Math.min(300,height-360));

// // // // //   const [view,setView]=useState<Level5View|null>(null);
// // // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // // //   const [loadErr,setLoadErr]=useState('');
// // // // //   const [msg,setMsg]=useState('');
// // // // //   const [busy,setBusy]=useState(false);
// // // // //   const [mark,setMark]=useState<{x:number;y:number;ok:boolean}|null>(null);
// // // // //   const [glow,setGlow]=useState<number|null>(null);
// // // // //   const [result,setResult]=useState<Level5Pick|null>(null);

// // // // //   const shake=useRef(new Animated.Value(0)).current;
// // // // //   const pop=useRef(new Animated.Value(0)).current;
// // // // //   const timers=useRef<any[]>([]);
// // // // //   const msgTimer=useRef<any>(null);
// // // // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // // // //   // 1. open the level - the backend creates or resumes the session
// // // // //   const load=useCallback(()=>{
// // // // //     setLoadErr('');setView(null);
// // // // //     startLevel5(playerId)
// // // // //       .then(v=>{setSessionId(v.sessionId as number);setView(v)})
// // // // //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// // // // //   },[playerId]);

// // // // //   useEffect(()=>{
// // // // //     load();
// // // // //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// // // // //   },[load]);

// // // // //   useEffect(()=>{
// // // // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // // // //   },[result]);

// // // // //   const flash=(m:string)=>{
// // // // //     setMsg(m);clearTimeout(msgTimer.current);
// // // // //     msgTimer.current=setTimeout(()=>setMsg(''),2600);
// // // // //   };

// // // // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// // // // //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// // // // //   // 2. the player tapped something -> ask the backend
// // // // //   const onPick=async(it:L5Item)=>{
// // // // //     if(busy||!sessionId||!view||result)return;
// // // // //     const look=lookOf(it,view.items);
// // // // //     setBusy(true);setGlow(null);
// // // // //     try{
// // // // //       const res=await pickItem({sessionId,playerId,itemId:it.id});

// // // // //       if(!res.correct){
// // // // //         setMark({x:it.x*bw,y:it.y*bh,ok:false});
// // // // //         doShake();flash(wrongText(it.kind,look.name));
// // // // //         later(()=>setMark(null),700);
// // // // //         // wrong pick -> the server sent a new arrangement, the player taps again
// // // // //         later(()=>{setView(res);setBusy(false)},res.reshuffled?650:150);
// // // // //         return;
// // // // //       }

// // // // //       // right cucumber: it hides first
// // // // //       setView(v=>v&&{...v,items:v.items.map(i=>i.id===it.id?{...i,hidden:true}:i)});

// // // // //       if(res.completed){
// // // // //         later(()=>setResult(res),1000);
// // // // //       }else if(res.stageDone){
// // // // //         flash(res.message);
// // // // //         later(()=>{setView(res);setBusy(false)},900);
// // // // //       }else{
// // // // //         setView(res);setBusy(false);
// // // // //       }
// // // // //     }catch(e:any){
// // // // //       flash(e.message||'Network error');
// // // // //       setBusy(false);
// // // // //     }
// // // // //   };

// // // // //   const onHint=async()=>{
// // // // //     if(busy||!sessionId||result)return;
// // // // //     try{
// // // // //       const r=await hintLevel5({sessionId,playerId});
// // // // //       setHints&&setHints(r.hints);
// // // // //       setGlow(r.itemId);
// // // // //     }catch(e:any){
// // // // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // // // //     }
// // // // //   };

// // // // //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// // // // //   const header=(
// // // // //     <View style={st.topBar}>
// // // // //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
// // // // //         <Icon n="home" s={16}/>
// // // // //       </TouchableOpacity>

// // // // //       <View style={st.signWrap}>
// // // // //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// // // // //         <View style={st.sign}>
// // // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // // //           <Text style={st.signT}>LEVEL 5</Text>
// // // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // // //         </View>
// // // // //         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
// // // // //         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
// // // // //       </View>

// // // // //       <View style={st.pill}>
// // // // //         <Text style={st.pillT}>{hints}</Text>
// // // // //         <Text style={st.pillIcon}>💡</Text>
// // // // //       </View>
// // // // //     </View>
// // // // //   );

// // // // //   /* ---------- loading / error ---------- */

// // // // //   if(loadErr||!view){
// // // // //     return <Stage bg="#bddaee"><View style={st.root}>
// // // // //       <RoomBackground/>
// // // // //       {header}
// // // // //       <View style={st.centerMsg}>
// // // // //         {loadErr?<>
// // // // //           <Text style={st.err}>{loadErr}</Text>
// // // // //           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // // //           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // // //         </>:<>
// // // // //           <ActivityIndicator size="large" color={THEME.orange}/>
// // // // //           <Text style={st.load}>Loading level 5...</Text>
// // // // //         </>}
// // // // //       </View>
// // // // //     </View></Stage>;
// // // // //   }

// // // // //   return <Stage bg="#bddaee"><View style={st.root}>
// // // // //     <RoomBackground/>
// // // // //     {header}

// // // // //     <View style={st.center}>
// // // // //       {/* question pill (same as level 1) */}
// // // // //       <View style={st.qPill}>
// // // // //         <Text style={st.qArrow}>{'<'}</Text>
// // // // //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// // // // //         <Text style={st.qArrow}>{'>'}</Text>
// // // // //       </View>

// // // // //       {/* vegetables */}
// // // // //       <Animated.View style={{width:bw,height:bh,marginTop:10,transform:[{translateX:shake}]}}>
// // // // //         {view.items.map(it=>
// // // // //           <Veg key={view.stage+'-'+it.id} it={it} look={lookOf(it,view.items)} bw={bw} bh={bh} glow={glow===it.id}
// // // // //             disabled={busy||!!result} onPress={onPick}/>)}
// // // // //         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}>
// // // // //           {mark.ok?<Tick/>:<Cross/>}
// // // // //         </View>}
// // // // //       </Animated.View>

// // // // //       <Text style={st.sub}>{view.hint}</Text>
// // // // //     </View>

// // // // //     {/* bottom rounded panel (same as level 1) */}
// // // // //     <View style={st.panel}>
// // // // //       <View style={st.btnCol}>
// // // // //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
// // // // //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// // // // //         </TouchableOpacity>
// // // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
// // // // //       </View>

// // // // //       <View style={st.btnCol}>
// // // // //         <View style={st.ringWhite}><Icon n="film" s={36}/></View>
// // // // //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// // // // //       </View>

// // // // //       <View style={st.btnCol}>
// // // // //         <View style={st.ringWhite}><View style={st.circleRed}><Icon n="play" s={30}/></View></View>
// // // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// // // // //       </View>
// // // // //     </View>

// // // // //     {/* result card */}
// // // // //     {!!result&&<View style={st.overlay}>
// // // // //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // // // //         <Text style={st.cardTitle}>Level complete!</Text>
// // // // //         <Text style={st.cardMsg}>{result.message}</Text>
// // // // //         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// // // // //         <Text style={st.cardScore}>Score {result.score}</Text>
// // // // //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // // // //           <Text style={st.nextT}>NEXT</Text>
// // // // //         </TouchableOpacity>
// // // // //       </Animated.View>
// // // // //     </View>}
// // // // //   </View></Stage>;
// // // // // }

// // // // // /* =========================================================
// // // // //    STYLES  (same room theme as Level 1)
// // // // // ========================================================= */

// // // // // const st=StyleSheet.create({
// // // // //   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

// // // // //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// // // // //   homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
// // // // //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// // // // //   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
// // // // //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
// // // // //   signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
// // // // //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// // // // //   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
// // // // //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
// // // // //   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
// // // // //   pillIcon:{fontSize:16},

// // // // //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// // // // //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // // // //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,maxWidth:360},
// // // // //   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
// // // // //   q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},
// // // // //   sub:{fontFamily:FONT,fontSize:15,fontStyle:'italic',fontWeight:'700',color:THEME.navy,textAlign:'center',marginTop:6},

// // // // //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// // // // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// // // // //   btnCol:{alignItems:'center'},
// // // // //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // // //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// // // // //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // // //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// // // // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// // // // //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// // // // //   overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
// // // // //   card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
// // // // //   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
// // // // //   cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
// // // // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // // // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
// // // // //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // // //   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

// // // // //   load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
// // // // //   err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
// // // // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
// // // // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
// // // // //   back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
// // // // // });
// // // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // // import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// // // // import {Stage,Coin} from './BTShared';
// // // // import {Icon} from './Art';
// // // // import {startLevel5,pickItem,hintLevel5,Level5View,Level5Pick,L5Item} from './Btlevel5api';
// // // // import {Cucumber,Tomato,Tick,Cross,BigStar} from './Btlevel5art';
// // // // import {Kovakkai,PointedGourd,SnakeGourd,RidgeGourd,Capsicum,Okra,GreenChilli,Cabbage,Broccoli,Pumpkin,Brinjal,Carrot,Onion,VEG_SIZE} from './Btlevel5veg';
// // // // import {RoomBackground,THEME} from './Btlevel4Theme';

// // // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // // // // clues shown in the CLUES popup when the magnifier is tapped
// // // // const CLUE_1='Not everything green is a cucumber… look beyond the stripes!';
// // // // const CLUE_2='Tap the glowing vegetable, it is the real cucumber.';

// // // // type Props={
// // // //   playerId:number;
// // // //   hints?:number;
// // // //   setHints?:(n:number)=>void;
// // // //   onExit:()=>void;
// // // //   onComplete?:(result:Level5Pick)=>void;
// // // // };

// // // // /* =========================================================
// // // //    LOOKS ONLY: the server still sends the same 4 kinds
// // // //    (cucumber / tomato / zucchini / gourd). Here every kind is
// // // //    drawn as one of several vegetables. The game rules are
// // // //    decided by the server and do not change.
// // // // ========================================================= */

// // // // type Look={key:string;name:string;Art:any};

// // // // const LOOKS:Record<string,Look[]>={
// // // //   cucumber:[{key:'cucumber',name:'cucumber',Art:Cucumber}],
// // // //   // mixed vegetables (green ones + pumpkin, brinjal, ... to confuse the player)
// // // //   tomato:[
// // // //     {key:'capsicum',name:'capsicum',Art:Capsicum},
// // // //     {key:'pumpkin',name:'pumpkin',Art:Pumpkin},
// // // //     {key:'okra',name:'ladies finger',Art:Okra},
// // // //     {key:'brinjal',name:'brinjal',Art:Brinjal},
// // // //     {key:'chilli',name:'green chilli',Art:GreenChilli},
// // // //     {key:'tomato',name:'tomato',Art:Tomato},
// // // //     {key:'cabbage',name:'cabbage',Art:Cabbage},
// // // //     {key:'carrot',name:'carrot',Art:Carrot},
// // // //     {key:'broccoli',name:'broccoli',Art:Broccoli},
// // // //     {key:'onion',name:'onion',Art:Onion},
// // // //   ],
// // // //   // gourds
// // // //   zucchini:[
// // // //     {key:'kovakkai',name:'ivy gourd',Art:Kovakkai},
// // // //     {key:'pointed',name:'pointed gourd',Art:PointedGourd},
// // // //   ],
// // // //   gourd:[
// // // //     {key:'snake',name:'snake gourd',Art:SnakeGourd},
// // // //     {key:'ridge',name:'ridge gourd',Art:RidgeGourd},
// // // //   ],
// // // // };

// // // // // same vegetable stays the same for an item (picked by its order among the same kind)
// // // // // (the start point changes on every screen so each screen shows a different mix)
// // // // const lookOf=(it:L5Item,items:L5Item[],stage:number):Look=>{
// // // //   const list=LOOKS[it.kind]||LOOKS.tomato;
// // // //   const order=items.filter(i=>i.kind===it.kind&&i.id<it.id).length;
// // // //   return list[(order+(stage-1)*3)%list.length];
// // // // };

// // // // const article=(n:string)=>/^[aeiou]/i.test(n)?'an':'a';

// // // // // wrong-pick text that matches the vegetable that is drawn
// // // // const wrongText=(kind:string,name:string)=>{
// // // //   if(kind==='tomato')return `${article(name)[0].toUpperCase()+article(name).slice(1)} ${name} is not a cucumber!`;
// // // //   if(kind==='zucchini')return `Oops! That is ${article(name)} ${name}. Find the real cucumber!`;
// // // //   return `That is ${article(name)} ${name}, not a cucumber!`;
// // // // };

// // // // /* =========================================================
// // // //    ONE VEGETABLE ON THE BOARD
// // // // ========================================================= */

// // // // function Veg({it,look,bw,bh,glow,disabled,onPress}:{it:L5Item;look:Look;bw:number;bh:number;glow:boolean;disabled:boolean;onPress:(it:L5Item)=>void}){
// // // //   const size=VEG_SIZE[look.key]||VEG_SIZE.tomato;
// // // //   const w=size.w,h=size.h;
// // // //   const px=it.x*bw-w/2,py=it.y*bh-h/2;

// // // //   const x=useRef(new Animated.Value(px)).current;
// // // //   const y=useRef(new Animated.Value(py)).current;
// // // //   const sc=useRef(new Animated.Value(it.hidden?0:1)).current;
// // // //   const pulse=useRef(new Animated.Value(0)).current;

// // // //   // the server rearranged the board -> slide to the new spot
// // // //   useEffect(()=>{
// // // //     Animated.parallel([
// // // //       Animated.timing(x,{toValue:px,duration:600,useNativeDriver:false}),
// // // //       Animated.timing(y,{toValue:py,duration:600,useNativeDriver:false})]).start();
// // // //   },[px,py]);

// // // //   // picked cucumber shrinks away
// // // //   useEffect(()=>{
// // // //     if(it.hidden)Animated.timing(sc,{toValue:0,duration:280,useNativeDriver:false}).start();
// // // //   },[it.hidden]);

// // // //   // hint glow
// // // //   useEffect(()=>{
// // // //     if(!glow){pulse.setValue(0);return}
// // // //     const l=Animated.loop(Animated.sequence([
// // // //       Animated.timing(pulse,{toValue:1,duration:420,useNativeDriver:false}),
// // // //       Animated.timing(pulse,{toValue:0,duration:420,useNativeDriver:false})]));
// // // //     l.start();
// // // //     return()=>l.stop();
// // // //   },[glow]);

// // // //   const Art=look.Art;

// // // //   return <Animated.View pointerEvents={it.hidden?'none':'auto'} style={{
// // // //       position:'absolute',left:x,top:y,width:w,height:h,
// // // //       transform:[{rotate:it.rot+'deg'},{scale:sc}]}}>
// // // //     <Animated.View pointerEvents="none" style={{
// // // //       position:'absolute',left:-8,right:-8,top:-8,bottom:-8,borderRadius:20,
// // // //       borderWidth:3,borderColor:'#ffb300',opacity:pulse}}/>
// // // //     <Pressable disabled={disabled} hitSlop={10} onPress={()=>onPress(it)} style={{width:w,height:h}}>
// // // //       <Art w={w}/>
// // // //     </Pressable>
// // // //   </Animated.View>;
// // // // }

// // // // /* =========================================================
// // // //    SCREEN
// // // // ========================================================= */

// // // // export default function BTLevel5Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // // //   const {width,height}=useWindowDimensions();
// // // //   const bw=Math.min(width-48,380);
// // // //   const bh=Math.max(250,Math.min(300,height-360));

// // // //   const [view,setView]=useState<Level5View|null>(null);
// // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // //   const [loadErr,setLoadErr]=useState('');
// // // //   const [msg,setMsg]=useState('');
// // // //   const [busy,setBusy]=useState(false);
// // // //   const [mark,setMark]=useState<{x:number;y:number;ok:boolean}|null>(null);
// // // //   const [glow,setGlow]=useState<number|null>(null);
// // // //   const [result,setResult]=useState<Level5Pick|null>(null);
// // // //   const [clueOpen,setClueOpen]=useState(false);
// // // //   const [clue2Shown,setClue2Shown]=useState(false);

// // // //   const shake=useRef(new Animated.Value(0)).current;
// // // //   const pop=useRef(new Animated.Value(0)).current;
// // // //   const timers=useRef<any[]>([]);
// // // //   const msgTimer=useRef<any>(null);
// // // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // // //   // 1. open the level - the backend creates or resumes the session
// // // //   const load=useCallback(()=>{
// // // //     setLoadErr('');setView(null);
// // // //     startLevel5(playerId)
// // // //       .then(v=>{setSessionId(v.sessionId as number);setView(v)})
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
// // // //     msgTimer.current=setTimeout(()=>setMsg(''),2600);
// // // //   };

// // // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// // // //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// // // //   // 2. the player tapped something -> ask the backend
// // // //   const onPick=async(it:L5Item)=>{
// // // //     if(busy||!sessionId||!view||result)return;
// // // //     const look=lookOf(it,view.items,view.stage);
// // // //     setBusy(true);setGlow(null);
// // // //     try{
// // // //       const res=await pickItem({sessionId,playerId,itemId:it.id});

// // // //       if(!res.correct){
// // // //         setMark({x:it.x*bw,y:it.y*bh,ok:false});
// // // //         doShake();flash(wrongText(it.kind,look.name));
// // // //         later(()=>setMark(null),700);
// // // //         // wrong pick -> the server sent a new arrangement, the player taps again
// // // //         later(()=>{setView(res);setBusy(false)},res.reshuffled?650:150);
// // // //         return;
// // // //       }

// // // //       // right cucumber: it hides first
// // // //       setView(v=>v&&{...v,items:v.items.map(i=>i.id===it.id?{...i,hidden:true}:i)});

// // // //       if(res.completed){
// // // //         later(()=>setResult(res),1000);
// // // //       }else if(res.stageDone){
// // // //         flash(res.message);
// // // //         later(()=>{setView(res);setBusy(false)},900);
// // // //       }else{
// // // //         setView(res);setBusy(false);
// // // //       }
// // // //     }catch(e:any){
// // // //       flash(e.message||'Network error');
// // // //       setBusy(false);
// // // //     }
// // // //   };

// // // //   const onHint=async()=>{
// // // //     if(busy||!sessionId||result)return;
// // // //     try{
// // // //       const r=await hintLevel5({sessionId,playerId});
// // // //       setHints&&setHints(r.hints);
// // // //       setGlow(r.itemId);
// // // //       setClue2Shown(false);
// // // //       setClueOpen(true);
// // // //     }catch(e:any){
// // // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // // //     }
// // // //   };

// // // //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// // // //   const header=(
// // // //     <View style={st.topBar}>
// // // //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
// // // //         <Icon n="home" s={16}/>
// // // //       </TouchableOpacity>

// // // //       <View style={st.signWrap}>
// // // //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// // // //         <View style={st.sign}>
// // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // //           <Text style={st.signT}>LEVEL 5</Text>
// // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // //         </View>
// // // //         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
// // // //         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
// // // //       </View>

// // // //       <View style={st.pill}>
// // // //         <Text style={st.pillT}>{hints}</Text>
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
// // // //           <Text style={st.load}>Loading level 5...</Text>
// // // //         </>}
// // // //       </View>
// // // //     </View></Stage>;
// // // //   }

// // // //   return <Stage bg="#bddaee"><View style={st.root}>
// // // //     <RoomBackground/>
// // // //     {header}

// // // //     <View style={st.center}>
// // // //       {/* question pill (same as level 1) */}
// // // //       <View style={st.qPill}>
// // // //         <Text style={st.qArrow}>{'<'}</Text>
// // // //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// // // //         <Text style={st.qArrow}>{'>'}</Text>
// // // //       </View>

// // // //       {/* vegetables */}
// // // //       <Animated.View style={{width:bw,height:bh,marginTop:10,transform:[{translateX:shake}]}}>
// // // //         {view.items.map(it=>
// // // //           <Veg key={view.stage+'-'+it.id} it={it} look={lookOf(it,view.items,view.stage)} bw={bw} bh={bh} glow={glow===it.id}
// // // //             disabled={busy||!!result} onPress={onPick}/>)}
// // // //         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}>
// // // //           {mark.ok?<Tick/>:<Cross/>}
// // // //         </View>}
// // // //       </Animated.View>

// // // //       <Text style={st.sub}>{view.hint}</Text>
// // // //     </View>

// // // //     {/* bottom rounded panel (same as level 1) */}
// // // //     <View style={st.panel}>
// // // //       <View style={st.btnCol}>
// // // //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
// // // //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// // // //         </TouchableOpacity>
// // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
// // // //       </View>

// // // //       <View style={st.btnCol}>
// // // //         <View style={st.ringWhite}><Icon n="film" s={36}/></View>
// // // //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// // // //       </View>

// // // //       <View style={st.btnCol}>
// // // //         <View style={st.ringWhite}><View style={st.circleRed}><Icon n="play" s={30}/></View></View>
// // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// // // //       </View>
// // // //     </View>

// // // //     {/* CLUES popup (only from the magnifier) */}
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
// // // //             <Text style={st.clueBody}>{CLUE_1}</Text>
// // // //           </View>
// // // //         </View>

// // // //         <TouchableOpacity activeOpacity={0.9} onPress={()=>setClue2Shown(true)}
// // // //           style={[st.clueRow,clue2Shown?st.clueRowOpen:st.clueRowLocked]}>
// // // //           <View style={st.clueNum}><Text style={st.clueNumT}>2</Text></View>
// // // //           <View style={{flex:1}}>
// // // //             <Text style={st.clueHead}>Clue 2</Text>
// // // //             <Text style={clue2Shown?st.clueBody:st.clueTap}>{clue2Shown?CLUE_2:'Tap to reveal'}</Text>
// // // //           </View>
// // // //         </TouchableOpacity>
// // // //       </View>
// // // //     </View>}

// // // //     {/* result card */}
// // // //     {!!result&&<View style={st.overlay}>
// // // //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // // //         <Text style={st.cardTitle}>Level complete!</Text>
// // // //         <Text style={st.cardMsg}>{result.message}</Text>
// // // //         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// // // //         <Text style={st.cardScore}>Score {result.score}</Text>
// // // //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // // //           <Text style={st.nextT}>NEXT</Text>
// // // //         </TouchableOpacity>
// // // //       </Animated.View>
// // // //     </View>}
// // // //   </View></Stage>;
// // // // }

// // // // /* =========================================================
// // // //    STYLES  (same room theme as Level 1)
// // // // ========================================================= */

// // // // const st=StyleSheet.create({
// // // //   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

// // // //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// // // //   homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
// // // //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// // // //   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
// // // //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
// // // //   signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
// // // //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// // // //   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
// // // //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
// // // //   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
// // // //   pillIcon:{fontSize:16},

// // // //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// // // //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // // //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,maxWidth:360},
// // // //   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
// // // //   q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},
// // // //   sub:{fontFamily:FONT,fontSize:15,fontStyle:'italic',fontWeight:'700',color:THEME.navy,textAlign:'center',marginTop:6},

// // // //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// // // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// // // //   btnCol:{alignItems:'center'},
// // // //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// // // //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// // // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// // // //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// // // //   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:22},
// // // //   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
// // // //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
// // // //   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
// // // //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
// // // //   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
// // // //   clueRowLocked:{backgroundColor:'#f8e3ae',borderColor:'#f3b73a'},
// // // //   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// // // //   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
// // // //   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
// // // //   clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},
// // // //   clueTap:{fontFamily:FONT,fontSize:15,fontWeight:'800',color:'#7a4a2a',marginTop:2},

// // // //   overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
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
// // // import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// // // import {Stage,Coin} from './BTShared';
// // // import {Icon} from './Art';
// // // import {startLevel5,pickItem,hintLevel5,Level5View,Level5Pick,L5Item} from './Btlevel5api';
// // // import {Cucumber,Tomato,Tick,Cross,BigStar} from './Btlevel5art';
// // // import {Kovakkai,PointedGourd,SnakeGourd,RidgeGourd,Capsicum,Okra,GreenChilli,Cabbage,Broccoli,Pumpkin,Brinjal,Carrot,Onion,VEG_SIZE} from './Btlevel5veg';
// // // import {RoomBackground,THEME} from './Btlevel4Theme';

// // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // // // a hint costs this many hints (must match the server and the badge on the magnifier)
// // // const HINT_COST=25;

// // // // clues shown in the CLUES popup when the magnifier is tapped
// // // const CLUE_1='Not everything green is a cucumber… look beyond the stripes!';
// // // const CLUE_2='Tap the glowing vegetable, it is the real cucumber.';

// // // type Props={
// // //   playerId:number;
// // //   hints?:number;
// // //   setHints?:(n:number)=>void;
// // //   onExit:()=>void;
// // //   onComplete?:(result:Level5Pick)=>void;
// // // };

// // // /* =========================================================
// // //    LOOKS ONLY: the server still sends the same 4 kinds
// // //    (cucumber / tomato / zucchini / gourd). Here every kind is
// // //    drawn as one of several vegetables. The game rules are
// // //    decided by the server and do not change.
// // // ========================================================= */

// // // type Look={key:string;name:string;Art:any};

// // // const LOOKS:Record<string,Look[]>={
// // //   cucumber:[{key:'cucumber',name:'cucumber',Art:Cucumber}],
// // //   // mixed vegetables (green ones + pumpkin, brinjal, ... to confuse the player)
// // //   tomato:[
// // //     {key:'capsicum',name:'capsicum',Art:Capsicum},
// // //     {key:'pumpkin',name:'pumpkin',Art:Pumpkin},
// // //     {key:'okra',name:'ladies finger',Art:Okra},
// // //     {key:'brinjal',name:'brinjal',Art:Brinjal},
// // //     {key:'chilli',name:'green chilli',Art:GreenChilli},
// // //     {key:'tomato',name:'tomato',Art:Tomato},
// // //     {key:'cabbage',name:'cabbage',Art:Cabbage},
// // //     {key:'carrot',name:'carrot',Art:Carrot},
// // //     {key:'broccoli',name:'broccoli',Art:Broccoli},
// // //     {key:'onion',name:'onion',Art:Onion},
// // //   ],
// // //   // gourds
// // //   zucchini:[
// // //     {key:'kovakkai',name:'ivy gourd',Art:Kovakkai},
// // //     {key:'pointed',name:'pointed gourd',Art:PointedGourd},
// // //   ],
// // //   gourd:[
// // //     {key:'snake',name:'snake gourd',Art:SnakeGourd},
// // //     {key:'ridge',name:'ridge gourd',Art:RidgeGourd},
// // //   ],
// // // };

// // // // same vegetable stays the same for an item (picked by its order among the same kind)
// // // // (the start point changes on every screen so each screen shows a different mix)
// // // const lookOf=(it:L5Item,items:L5Item[],stage:number):Look=>{
// // //   const list=LOOKS[it.kind]||LOOKS.tomato;
// // //   const order=items.filter(i=>i.kind===it.kind&&i.id<it.id).length;
// // //   return list[(order+(stage-1)*3)%list.length];
// // // };

// // // const article=(n:string)=>/^[aeiou]/i.test(n)?'an':'a';

// // // // wrong-pick text that matches the vegetable that is drawn
// // // const wrongText=(kind:string,name:string)=>{
// // //   if(kind==='tomato')return `${article(name)[0].toUpperCase()+article(name).slice(1)} ${name} is not a cucumber!`;
// // //   if(kind==='zucchini')return `Oops! That is ${article(name)} ${name}. Find the real cucumber!`;
// // //   return `That is ${article(name)} ${name}, not a cucumber!`;
// // // };

// // // /* =========================================================
// // //    ONE VEGETABLE ON THE BOARD
// // // ========================================================= */

// // // function Veg({it,look,bw,bh,glow,disabled,onPress}:{it:L5Item;look:Look;bw:number;bh:number;glow:boolean;disabled:boolean;onPress:(it:L5Item)=>void}){
// // //   // safe fallback so an unknown vegetable can never crash the board
// // //   const size=VEG_SIZE[look.key]||{w:64,h:64};
// // //   const w=size.w,h=size.h;
// // //   const px=it.x*bw-w/2,py=it.y*bh-h/2;

// // //   const x=useRef(new Animated.Value(px)).current;
// // //   const y=useRef(new Animated.Value(py)).current;
// // //   const sc=useRef(new Animated.Value(it.hidden?0:1)).current;
// // //   const pulse=useRef(new Animated.Value(0)).current;

// // //   // the server rearranged the board -> slide to the new spot
// // //   useEffect(()=>{
// // //     Animated.parallel([
// // //       Animated.timing(x,{toValue:px,duration:600,useNativeDriver:false}),
// // //       Animated.timing(y,{toValue:py,duration:600,useNativeDriver:false})]).start();
// // //   },[px,py]);

// // //   // picked cucumber shrinks away
// // //   useEffect(()=>{
// // //     if(it.hidden)Animated.timing(sc,{toValue:0,duration:280,useNativeDriver:false}).start();
// // //   },[it.hidden]);

// // //   // hint glow
// // //   useEffect(()=>{
// // //     if(!glow){pulse.setValue(0);return}
// // //     const l=Animated.loop(Animated.sequence([
// // //       Animated.timing(pulse,{toValue:1,duration:420,useNativeDriver:false}),
// // //       Animated.timing(pulse,{toValue:0,duration:420,useNativeDriver:false})]));
// // //     l.start();
// // //     return()=>l.stop();
// // //   },[glow]);

// // //   const Art=look.Art;

// // //   return <Animated.View pointerEvents={it.hidden?'none':'auto'} style={{
// // //       position:'absolute',left:x,top:y,width:w,height:h,
// // //       transform:[{rotate:it.rot+'deg'},{scale:sc}]}}>
// // //     <Animated.View pointerEvents="none" style={{
// // //       position:'absolute',left:-8,right:-8,top:-8,bottom:-8,borderRadius:20,
// // //       borderWidth:3,borderColor:'#ffb300',opacity:pulse}}/>
// // //     <Pressable disabled={disabled} hitSlop={10} onPress={()=>onPress(it)} style={{width:w,height:h}}>
// // //       <Art w={w}/>
// // //     </Pressable>
// // //   </Animated.View>;
// // // }

// // // /* =========================================================
// // //    SCREEN
// // // ========================================================= */

// // // export default function BTLevel5Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // //   const {width,height}=useWindowDimensions();
// // //   const bw=Math.min(width-48,380);
// // //   const bh=Math.max(250,Math.min(300,height-360));

// // //   const [view,setView]=useState<Level5View|null>(null);
// // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // //   const [loadErr,setLoadErr]=useState('');
// // //   const [msg,setMsg]=useState('');
// // //   const [busy,setBusy]=useState(false);
// // //   const [mark,setMark]=useState<{x:number;y:number;ok:boolean}|null>(null);
// // //   const [glow,setGlow]=useState<number|null>(null);
// // //   const [result,setResult]=useState<Level5Pick|null>(null);
// // //   const [clueOpen,setClueOpen]=useState(false);
// // //   const [clue2Shown,setClue2Shown]=useState(false);

// // //   const shake=useRef(new Animated.Value(0)).current;
// // //   const pop=useRef(new Animated.Value(0)).current;
// // //   const timers=useRef<any[]>([]);
// // //   const msgTimer=useRef<any>(null);
// // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // //   // 1. open the level - the backend creates or resumes the session
// // //   const load=useCallback(()=>{
// // //     setLoadErr('');setView(null);
// // //     startLevel5(playerId)
// // //       .then(v=>{setSessionId(v.sessionId as number);setView(v)})
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
// // //     msgTimer.current=setTimeout(()=>setMsg(''),2600);
// // //   };

// // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// // //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// // //   // 2. the player tapped something -> ask the backend
// // //   const onPick=async(it:L5Item)=>{
// // //     if(busy||!sessionId||!view||result)return;
// // //     const look=lookOf(it,view.items,view.stage);
// // //     setBusy(true);setGlow(null);
// // //     try{
// // //       const res=await pickItem({sessionId,playerId,itemId:it.id});

// // //       if(!res.correct){
// // //         setMark({x:it.x*bw,y:it.y*bh,ok:false});
// // //         doShake();flash(wrongText(it.kind,look.name));
// // //         later(()=>setMark(null),700);
// // //         // wrong pick -> the server sent a new arrangement, the player taps again
// // //         later(()=>{setView(res);setBusy(false)},res.reshuffled?650:150);
// // //         return;
// // //       }

// // //       // right cucumber: it hides first
// // //       setView(v=>v&&{...v,items:v.items.map(i=>i.id===it.id?{...i,hidden:true}:i)});

// // //       if(res.completed){
// // //         later(()=>setResult(res),1000);
// // //       }else if(res.stageDone){
// // //         flash(res.message);
// // //         later(()=>{setView(res);setBusy(false)},900);
// // //       }else{
// // //         setView(res);setBusy(false);
// // //       }
// // //     }catch(e:any){
// // //       flash(e.message||'Network error');
// // //       setBusy(false);
// // //     }
// // //   };

// // //   const onHint=async()=>{
// // //     if(busy||!sessionId||result)return;

// // //     // don't call the server if the player can't afford a hint (it would answer 402)
// // //     if(hints<HINT_COST){
// // //       flash(`You need ${HINT_COST} hints. Watch a video to earn more!`);
// // //       return;
// // //     }

// // //     try{
// // //       const r=await hintLevel5({sessionId,playerId});
// // //       setHints&&setHints(r.hints);
// // //       setGlow(r.itemId);
// // //       setClue2Shown(false);
// // //       setClueOpen(true);
// // //     }catch(e:any){
// // //       // the status may not be set by hintLevel5, so also match on the message
// // //       const noFunds=e?.status===402||/not enough|payment/i.test(e?.message||'');
// // //       flash(noFunds?'Not enough hints':e?.message||'Network error');
// // //     }
// // //   };

// // //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// // //   const header=(
// // //     <View style={st.topBar}>
// // //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
// // //         <Icon n="home" s={16}/>
// // //       </TouchableOpacity>

// // //       <View style={st.signWrap}>
// // //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// // //         <View style={st.sign}>
// // //           <Text style={st.signArrow}>{'<'}</Text>
// // //           <Text style={st.signT}>LEVEL 5</Text>
// // //           <Text style={st.signArrow}>{'>'}</Text>
// // //         </View>
// // //         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
// // //         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
// // //       </View>

// // //       <View style={st.pill}>
// // //         <Text style={st.pillT}>{hints}</Text>
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
// // //           <Text style={st.load}>Loading level 5...</Text>
// // //         </>}
// // //       </View>
// // //     </View></Stage>;
// // //   }

// // //   return <Stage bg="#bddaee"><View style={st.root}>
// // //     <RoomBackground/>
// // //     {header}

// // //     <View style={st.center}>
// // //       {/* question pill (same as level 1) */}
// // //       <View style={st.qPill}>
// // //         <Text style={st.qArrow}>{'<'}</Text>
// // //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// // //         <Text style={st.qArrow}>{'>'}</Text>
// // //       </View>

// // //       {/* vegetables */}
// // //       <Animated.View style={{width:bw,height:bh,marginTop:10,transform:[{translateX:shake}]}}>
// // //         {view.items.map(it=>
// // //           <Veg key={view.stage+'-'+it.id} it={it} look={lookOf(it,view.items,view.stage)} bw={bw} bh={bh} glow={glow===it.id}
// // //             disabled={busy||!!result} onPress={onPick}/>)}
// // //         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}>
// // //           {mark.ok?<Tick/>:<Cross/>}
// // //         </View>}
// // //       </Animated.View>

// // //       <Text style={st.sub}>{view.hint}</Text>
// // //     </View>

// // //     {/* bottom rounded panel (same as level 1) */}
// // //     <View style={st.panel}>
// // //       <View style={st.btnCol}>
// // //         {/* dimmed when the player can't afford a hint */}
// // //         <TouchableOpacity style={[st.ringGreen,hints<HINT_COST&&{opacity:0.5}]} activeOpacity={0.85} onPress={onHint}>
// // //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// // //         </TouchableOpacity>
// // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>{HINT_COST}</Text></View>
// // //       </View>

// // //       <View style={st.btnCol}>
// // //         <View style={st.ringWhite}><Icon n="film" s={36}/></View>
// // //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// // //       </View>

// // //       <View style={st.btnCol}>
// // //         <View style={st.ringWhite}><View style={st.circleRed}><Icon n="play" s={30}/></View></View>
// // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// // //       </View>
// // //     </View>

// // //     {/* CLUES popup (only from the magnifier) */}
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
// // //             <Text style={st.clueBody}>{CLUE_1}</Text>
// // //           </View>
// // //         </View>

// // //         <TouchableOpacity activeOpacity={0.9} onPress={()=>setClue2Shown(true)}
// // //           style={[st.clueRow,clue2Shown?st.clueRowOpen:st.clueRowLocked]}>
// // //           <View style={st.clueNum}><Text style={st.clueNumT}>2</Text></View>
// // //           <View style={{flex:1}}>
// // //             <Text style={st.clueHead}>Clue 2</Text>
// // //             <Text style={clue2Shown?st.clueBody:st.clueTap}>{clue2Shown?CLUE_2:'Tap to reveal'}</Text>
// // //           </View>
// // //         </TouchableOpacity>
// // //       </View>
// // //     </View>}

// // //     {/* result card */}
// // //     {!!result&&<View style={st.overlay}>
// // //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // //         <Text style={st.cardTitle}>Level complete!</Text>
// // //         <Text style={st.cardMsg}>{result.message}</Text>
// // //         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// // //         <Text style={st.cardScore}>Score {result.score}</Text>
// // //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // //           <Text style={st.nextT}>NEXT</Text>
// // //         </TouchableOpacity>
// // //       </Animated.View>
// // //     </View>}
// // //   </View></Stage>;
// // // }

// // // /* =========================================================
// // //    STYLES  (same room theme as Level 1)
// // // ========================================================= */

// // // const st=StyleSheet.create({
// // //   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

// // //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// // //   homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
// // //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// // //   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
// // //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
// // //   signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
// // //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// // //   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
// // //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
// // //   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
// // //   pillIcon:{fontSize:16},

// // //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// // //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,maxWidth:360},
// // //   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
// // //   q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},
// // //   sub:{fontFamily:FONT,fontSize:15,fontStyle:'italic',fontWeight:'700',color:THEME.navy,textAlign:'center',marginTop:6},

// // //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// // //   btnCol:{alignItems:'center'},
// // //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// // //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// // //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// // //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// // //   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:22},
// // //   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
// // //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
// // //   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
// // //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
// // //   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
// // //   clueRowLocked:{backgroundColor:'#f8e3ae',borderColor:'#f3b73a'},
// // //   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// // //   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
// // //   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
// // //   clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},
// // //   clueTap:{fontFamily:FONT,fontSize:15,fontWeight:'800',color:'#7a4a2a',marginTop:2},

// // //   overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
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
// // import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// // import {Stage,Coin} from './BTShared';
// // import {Icon} from './Art';
// // import {startLevel5,pickItem,hintLevel5,Level5View,Level5Pick,L5Item} from './Btlevel5api';
// // import {Cucumber,Tomato,Tick,Cross,BigStar} from './Btlevel5art';
// // import {Kovakkai,PointedGourd,SnakeGourd,RidgeGourd,Capsicum,Okra,GreenChilli,Cabbage,Broccoli,Pumpkin,Brinjal,Carrot,Onion,VEG_SIZE} from './Btlevel5veg';
// // import {RoomBackground,THEME} from './Btlevel4Theme';

// // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // // a clue costs this many hints (must match the server and the badge on the magnifier)
// // const HINT_COST=25;

// // // only ONE clue is shown when the magnifier is tapped
// // const CLUE_1='Not everything green is a cucumber… look beyond the stripes!';

// // type Props={
// //   playerId:number;
// //   hints?:number;
// //   setHints?:(n:number)=>void;
// //   onExit:()=>void;
// //   onComplete?:(result:Level5Pick)=>void;
// // };

// // /* =========================================================
// //    LOOKS ONLY: the server still sends the same 4 kinds
// //    (cucumber / tomato / zucchini / gourd). Here every kind is
// //    drawn as one of several vegetables. The game rules are
// //    decided by the server and do not change.
// // ========================================================= */

// // type Look={key:string;name:string;Art:any};

// // const LOOKS:Record<string,Look[]>={
// //   cucumber:[{key:'cucumber',name:'cucumber',Art:Cucumber}],
// //   // mixed vegetables (green ones + pumpkin, brinjal, ... to confuse the player)
// //   tomato:[
// //     {key:'capsicum',name:'capsicum',Art:Capsicum},
// //     {key:'pumpkin',name:'pumpkin',Art:Pumpkin},
// //     {key:'okra',name:'ladies finger',Art:Okra},
// //     {key:'brinjal',name:'brinjal',Art:Brinjal},
// //     {key:'chilli',name:'green chilli',Art:GreenChilli},
// //     {key:'tomato',name:'tomato',Art:Tomato},
// //     {key:'cabbage',name:'cabbage',Art:Cabbage},
// //     {key:'carrot',name:'carrot',Art:Carrot},
// //     {key:'broccoli',name:'broccoli',Art:Broccoli},
// //     {key:'onion',name:'onion',Art:Onion},
// //   ],
// //   // gourds
// //   zucchini:[
// //     {key:'kovakkai',name:'ivy gourd',Art:Kovakkai},
// //     {key:'pointed',name:'pointed gourd',Art:PointedGourd},
// //   ],
// //   gourd:[
// //     {key:'snake',name:'snake gourd',Art:SnakeGourd},
// //     {key:'ridge',name:'ridge gourd',Art:RidgeGourd},
// //   ],
// // };

// // // same vegetable stays the same for an item (picked by its order among the same kind)
// // // (the start point changes on every screen so each screen shows a different mix)
// // const lookOf=(it:L5Item,items:L5Item[],stage:number):Look=>{
// //   const list=LOOKS[it.kind]||LOOKS.tomato;
// //   const order=items.filter(i=>i.kind===it.kind&&i.id<it.id).length;
// //   return list[(order+(stage-1)*3)%list.length];
// // };

// // const article=(n:string)=>/^[aeiou]/i.test(n)?'an':'a';

// // // wrong-pick text that matches the vegetable that is drawn
// // const wrongText=(kind:string,name:string)=>{
// //   if(kind==='tomato')return `${article(name)[0].toUpperCase()+article(name).slice(1)} ${name} is not a cucumber!`;
// //   if(kind==='zucchini')return `Oops! That is ${article(name)} ${name}. Find the real cucumber!`;
// //   return `That is ${article(name)} ${name}, not a cucumber!`;
// // };

// // /* =========================================================
// //    ONE VEGETABLE ON THE BOARD
// // ========================================================= */

// // function Veg({it,look,bw,bh,glow,disabled,onPress}:{it:L5Item;look:Look;bw:number;bh:number;glow:boolean;disabled:boolean;onPress:(it:L5Item)=>void}){
// //   // safe fallback so an unknown vegetable can never crash the board
// //   const size=VEG_SIZE[look.key]||{w:64,h:64};
// //   const w=size.w,h=size.h;
// //   const px=it.x*bw-w/2,py=it.y*bh-h/2;

// //   const x=useRef(new Animated.Value(px)).current;
// //   const y=useRef(new Animated.Value(py)).current;
// //   const sc=useRef(new Animated.Value(it.hidden?0:1)).current;
// //   const pulse=useRef(new Animated.Value(0)).current;

// //   // the server rearranged the board -> slide to the new spot
// //   useEffect(()=>{
// //     Animated.parallel([
// //       Animated.timing(x,{toValue:px,duration:600,useNativeDriver:false}),
// //       Animated.timing(y,{toValue:py,duration:600,useNativeDriver:false})]).start();
// //   },[px,py]);

// //   // picked cucumber shrinks away
// //   useEffect(()=>{
// //     if(it.hidden)Animated.timing(sc,{toValue:0,duration:280,useNativeDriver:false}).start();
// //   },[it.hidden]);

// //   // hint glow (not used by the clue any more, kept so the board code stays the same)
// //   useEffect(()=>{
// //     if(!glow){pulse.setValue(0);return}
// //     const l=Animated.loop(Animated.sequence([
// //       Animated.timing(pulse,{toValue:1,duration:420,useNativeDriver:false}),
// //       Animated.timing(pulse,{toValue:0,duration:420,useNativeDriver:false})]));
// //     l.start();
// //     return()=>l.stop();
// //   },[glow]);

// //   const Art=look.Art;

// //   return <Animated.View pointerEvents={it.hidden?'none':'auto'} style={{
// //       position:'absolute',left:x,top:y,width:w,height:h,
// //       transform:[{rotate:it.rot+'deg'},{scale:sc}]}}>
// //     <Animated.View pointerEvents="none" style={{
// //       position:'absolute',left:-8,right:-8,top:-8,bottom:-8,borderRadius:20,
// //       borderWidth:3,borderColor:'#ffb300',opacity:pulse}}/>
// //     <Pressable disabled={disabled} hitSlop={10} onPress={()=>onPress(it)} style={{width:w,height:h}}>
// //       <Art w={w}/>
// //     </Pressable>
// //   </Animated.View>;
// // }

// // /* =========================================================
// //    SCREEN
// // ========================================================= */

// // export default function BTLevel5Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// //   const {width,height}=useWindowDimensions();
// //   const bw=Math.min(width-48,380);
// //   const bh=Math.max(250,Math.min(300,height-360));

// //   const [view,setView]=useState<Level5View|null>(null);
// //   const [sessionId,setSessionId]=useState<number|null>(null);
// //   const [loadErr,setLoadErr]=useState('');
// //   const [msg,setMsg]=useState('');
// //   const [busy,setBusy]=useState(false);
// //   const [mark,setMark]=useState<{x:number;y:number;ok:boolean}|null>(null);
// //   const [glow,setGlow]=useState<number|null>(null);
// //   const [result,setResult]=useState<Level5Pick|null>(null);
// //   const [clueOpen,setClueOpen]=useState(false);   // popup visible or not
// //   const [clueUsed,setClueUsed]=useState(false);   // clue already paid for -> no extra cost

// //   const shake=useRef(new Animated.Value(0)).current;
// //   const pop=useRef(new Animated.Value(0)).current;
// //   const timers=useRef<any[]>([]);
// //   const msgTimer=useRef<any>(null);
// //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// //   // 1. open the level - the backend creates or resumes the session
// //   const load=useCallback(()=>{
// //     setLoadErr('');setView(null);
// //     startLevel5(playerId)
// //       .then(v=>{setSessionId(v.sessionId as number);setView(v)})
// //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// //   },[playerId]);

// //   useEffect(()=>{
// //     load();
// //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// //   },[load]);

// //   useEffect(()=>{
// //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// //   },[result]);

// //   // new stage -> the clue is fresh again (delete this effect if you want ONE clue for the whole level)
// //   useEffect(()=>{
// //     setClueUsed(false);
// //     setClueOpen(false);
// //     setGlow(null);
// //   },[view?.stage]);

// //   const flash=(m:string)=>{
// //     setMsg(m);clearTimeout(msgTimer.current);
// //     msgTimer.current=setTimeout(()=>setMsg(''),2600);
// //   };

// //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// //   // 2. the player tapped something -> ask the backend
// //   const onPick=async(it:L5Item)=>{
// //     if(busy||!sessionId||!view||result)return;
// //     const look=lookOf(it,view.items,view.stage);
// //     setBusy(true);setGlow(null);
// //     try{
// //       const res=await pickItem({sessionId,playerId,itemId:it.id});

// //       if(!res.correct){
// //         setMark({x:it.x*bw,y:it.y*bh,ok:false});
// //         doShake();flash(wrongText(it.kind,look.name));
// //         later(()=>setMark(null),700);
// //         // wrong pick -> the server sent a new arrangement, the player taps again
// //         later(()=>{setView(res);setBusy(false)},res.reshuffled?650:150);
// //         return;
// //       }

// //       // right cucumber: it hides first
// //       setView(v=>v&&{...v,items:v.items.map(i=>i.id===it.id?{...i,hidden:true}:i)});

// //       if(res.completed){
// //         later(()=>setResult(res),1000);
// //       }else if(res.stageDone){
// //         flash(res.message);
// //         later(()=>{setView(res);setBusy(false)},900);
// //       }else{
// //         setView(res);setBusy(false);
// //       }
// //     }catch(e:any){
// //       flash(e.message||'Network error');
// //       setBusy(false);
// //     }
// //   };

// //   // 3. magnifier tapped -> show ONE clue
// //   const onHint=async()=>{
// //     if(busy||!sessionId||result)return;

// //     // clue already bought -> just show it again, NO extra cost
// //     if(clueUsed){
// //       setClueOpen(true);
// //       return;
// //     }

// //     // not enough hints -> only a message, the popup stays closed
// //     if(hints<HINT_COST){
// //       flash(`You need ${HINT_COST} hints. Watch a video to earn more!`);
// //       return;
// //     }

// //     try{
// //       const r=await hintLevel5({sessionId,playerId});
// //       setHints&&setHints(r.hints);
// //       setClueUsed(true);
// //       setClueOpen(true);
// //     }catch(e:any){
// //       // the status may not be set by hintLevel5, so also match on the message
// //       const noFunds=e?.status===402||/not enough|payment/i.test(e?.message||'');
// //       flash(noFunds?`You need ${HINT_COST} hints. Watch a video to earn more!`:e?.message||'Network error');
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
// //           <Text style={st.signT}>LEVEL 5</Text>
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
// //           <Text style={st.load}>Loading level 5...</Text>
// //         </>}
// //       </View>
// //     </View></Stage>;
// //   }

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

// //       {/* vegetables */}
// //       <Animated.View style={{width:bw,height:bh,marginTop:10,transform:[{translateX:shake}]}}>
// //         {view.items.map(it=>
// //           <Veg key={view.stage+'-'+it.id} it={it} look={lookOf(it,view.items,view.stage)} bw={bw} bh={bh} glow={glow===it.id}
// //             disabled={busy||!!result} onPress={onPick}/>)}
// //         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}>
// //           {mark.ok?<Tick/>:<Cross/>}
// //         </View>}
// //       </Animated.View>

// //       <Text style={st.sub}>{view.hint}</Text>
// //     </View>

// //     {/* bottom rounded panel (same as level 1) */}
// //     <View style={st.panel}>
// //       <View style={st.btnCol}>
// //         {/* dimmed only when the clue is not bought yet and the player can't afford it */}
// //         <TouchableOpacity style={[st.ringGreen,(!clueUsed&&hints<HINT_COST)&&{opacity:0.5}]} activeOpacity={0.85} onPress={onHint}>
// //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>{HINT_COST}</Text></View>
// //       </View>

// //       <View style={st.btnCol}>
// //         {/* video button: when the reward video finishes, ONLY add hints (setHints(hints+75)),
// //             never call setClueOpen(true) here */}
// //         <View style={st.ringWhite}><Icon n="film" s={36}/></View>
// //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// //       </View>

// //       <View style={st.btnCol}>
// //         <View style={st.ringWhite}><View style={st.circleRed}><Icon n="play" s={30}/></View></View>
// //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// //       </View>
// //     </View>

// //     {/* CLUE popup (only from the magnifier, ONE clue) */}
// //     {clueOpen&&<View style={st.overlay}>
// //       <View style={st.clueCard}>
// //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
// //           <Text style={st.closeT}>✕</Text>
// //         </TouchableOpacity>
// //         <Text style={st.clueTitle}>CLUE</Text>

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
// //    STYLES  (same room theme as Level 1)
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
// //   sub:{fontFamily:FONT,fontSize:15,fontStyle:'italic',fontWeight:'700',color:THEME.navy,textAlign:'center',marginTop:6},

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
// import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// import {Stage,Coin} from './BTShared';
// import {Icon} from './Art';
// import {startLevel5,pickItem,hintLevel5,Level5View,Level5Pick,L5Item} from './Btlevel5api';
// import {Cucumber,Tomato,Tick,Cross,BigStar} from './Btlevel5art';
// import {Kovakkai,PointedGourd,SnakeGourd,RidgeGourd,Capsicum,Okra,GreenChilli,Cabbage,Broccoli,Pumpkin,Brinjal,Carrot,Onion,VEG_SIZE} from './Btlevel5veg';
// import {RoomBackground,THEME} from './Btlevel4Theme';

// const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // a clue costs this many hints (must match the server and the badge on the magnifier)
// const HINT_COST=25;

// // only ONE clue is shown when the magnifier is tapped
// const CLUE_1='Not everything green is a cucumber… look beyond the stripes!';

// type Props={
//   playerId:number;
//   hints?:number;
//   setHints?:(n:number)=>void;
//   onExit:()=>void;
//   onComplete?:(result:Level5Pick)=>void;
//   // called when the player taps the coins / video buttons. The parent should ONLY add hints here.
//   onWatchVideo?:()=>void;
// };

// /* =========================================================
//    LOOKS ONLY: the server still sends the same 4 kinds
//    (cucumber / tomato / zucchini / gourd). Here every kind is
//    drawn as one of several vegetables. The game rules are
//    decided by the server and do not change.
// ========================================================= */

// type Look={key:string;name:string;Art:any};

// const LOOKS:Record<string,Look[]>={
//   cucumber:[{key:'cucumber',name:'cucumber',Art:Cucumber}],
//   // mixed vegetables (green ones + pumpkin, brinjal, ... to confuse the player)
//   tomato:[
//     {key:'capsicum',name:'capsicum',Art:Capsicum},
//     {key:'pumpkin',name:'pumpkin',Art:Pumpkin},
//     {key:'okra',name:'ladies finger',Art:Okra},
//     {key:'brinjal',name:'brinjal',Art:Brinjal},
//     {key:'chilli',name:'green chilli',Art:GreenChilli},
//     {key:'tomato',name:'tomato',Art:Tomato},
//     {key:'cabbage',name:'cabbage',Art:Cabbage},
//     {key:'carrot',name:'carrot',Art:Carrot},
//     {key:'broccoli',name:'broccoli',Art:Broccoli},
//     {key:'onion',name:'onion',Art:Onion},
//   ],
//   // gourds
//   zucchini:[
//     {key:'kovakkai',name:'ivy gourd',Art:Kovakkai},
//     {key:'pointed',name:'pointed gourd',Art:PointedGourd},
//   ],
//   gourd:[
//     {key:'snake',name:'snake gourd',Art:SnakeGourd},
//     {key:'ridge',name:'ridge gourd',Art:RidgeGourd},
//   ],
// };

// // same vegetable stays the same for an item (picked by its order among the same kind)
// // (the start point changes on every screen so each screen shows a different mix)
// const lookOf=(it:L5Item,items:L5Item[],stage:number):Look=>{
//   const list=LOOKS[it.kind]||LOOKS.tomato;
//   const order=items.filter(i=>i.kind===it.kind&&i.id<it.id).length;
//   return list[(order+(stage-1)*3)%list.length];
// };

// const article=(n:string)=>/^[aeiou]/i.test(n)?'an':'a';

// // wrong-pick text that matches the vegetable that is drawn
// const wrongText=(kind:string,name:string)=>{
//   if(kind==='tomato')return `${article(name)[0].toUpperCase()+article(name).slice(1)} ${name} is not a cucumber!`;
//   if(kind==='zucchini')return `Oops! That is ${article(name)} ${name}. Find the real cucumber!`;
//   return `That is ${article(name)} ${name}, not a cucumber!`;
// };

// /* =========================================================
//    ONE VEGETABLE ON THE BOARD
// ========================================================= */

// function Veg({it,look,bw,bh,glow,disabled,onPress}:{it:L5Item;look:Look;bw:number;bh:number;glow:boolean;disabled:boolean;onPress:(it:L5Item)=>void}){
//   // safe fallback so an unknown vegetable can never crash the board
//   const size=VEG_SIZE[look.key]||{w:64,h:64};
//   const w=size.w,h=size.h;
//   const px=it.x*bw-w/2,py=it.y*bh-h/2;

//   const x=useRef(new Animated.Value(px)).current;
//   const y=useRef(new Animated.Value(py)).current;
//   const sc=useRef(new Animated.Value(it.hidden?0:1)).current;
//   const pulse=useRef(new Animated.Value(0)).current;

//   // the server rearranged the board -> slide to the new spot
//   useEffect(()=>{
//     Animated.parallel([
//       Animated.timing(x,{toValue:px,duration:600,useNativeDriver:false}),
//       Animated.timing(y,{toValue:py,duration:600,useNativeDriver:false})]).start();
//   },[px,py]);

//   // picked cucumber shrinks away
//   useEffect(()=>{
//     if(it.hidden)Animated.timing(sc,{toValue:0,duration:280,useNativeDriver:false}).start();
//   },[it.hidden]);

//   // hint glow (not used by the clue any more, kept so the board code stays the same)
//   useEffect(()=>{
//     if(!glow){pulse.setValue(0);return}
//     const l=Animated.loop(Animated.sequence([
//       Animated.timing(pulse,{toValue:1,duration:420,useNativeDriver:false}),
//       Animated.timing(pulse,{toValue:0,duration:420,useNativeDriver:false})]));
//     l.start();
//     return()=>l.stop();
//   },[glow]);

//   const Art=look.Art;

//   return <Animated.View pointerEvents={it.hidden?'none':'auto'} style={{
//       position:'absolute',left:x,top:y,width:w,height:h,
//       transform:[{rotate:it.rot+'deg'},{scale:sc}]}}>
//     <Animated.View pointerEvents="none" style={{
//       position:'absolute',left:-8,right:-8,top:-8,bottom:-8,borderRadius:20,
//       borderWidth:3,borderColor:'#ffb300',opacity:pulse}}/>
//     <Pressable disabled={disabled} hitSlop={10} onPress={()=>onPress(it)} style={{width:w,height:h}}>
//       <Art w={w}/>
//     </Pressable>
//   </Animated.View>;
// }

// /* =========================================================
//    SCREEN
// ========================================================= */

// export default function BTLevel5Screen({playerId,hints=0,setHints,onExit,onComplete,onWatchVideo}:Props){
//   const {width,height}=useWindowDimensions();
//   const bw=Math.min(width-48,380);
//   const bh=Math.max(250,Math.min(300,height-360));

//   const [view,setView]=useState<Level5View|null>(null);
//   const [sessionId,setSessionId]=useState<number|null>(null);
//   const [loadErr,setLoadErr]=useState('');
//   const [msg,setMsg]=useState('');
//   const [busy,setBusy]=useState(false);
//   const [mark,setMark]=useState<{x:number;y:number;ok:boolean}|null>(null);
//   const [glow,setGlow]=useState<number|null>(null);
//   const [result,setResult]=useState<Level5Pick|null>(null);
//   const [clueOpen,setClueOpen]=useState(false);   // popup visible or not
//   const [clueUsed,setClueUsed]=useState(false);   // clue already paid for -> no extra cost

//   const shake=useRef(new Animated.Value(0)).current;
//   const pop=useRef(new Animated.Value(0)).current;
//   const timers=useRef<any[]>([]);
//   const msgTimer=useRef<any>(null);
//   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

//   // 1. open the level - the backend creates or resumes the session
//   const load=useCallback(()=>{
//     setLoadErr('');setView(null);
//     startLevel5(playerId)
//       .then(v=>{setSessionId(v.sessionId as number);setView(v)})
//       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
//   },[playerId]);

//   useEffect(()=>{
//     load();
//     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
//   },[load]);

//   useEffect(()=>{
//     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
//   },[result]);

//   // new stage -> the clue is fresh again (delete this effect if you want ONE clue for the whole level)
//   useEffect(()=>{
//     // the server tells us if the clue was already bought (survives refresh)
//     setClueUsed(!!(view as any)?.clueUsed);
//     setClueOpen(false);
//     setGlow(null);
//   },[view?.stage]);

//   const flash=(m:string)=>{
//     setMsg(m);clearTimeout(msgTimer.current);
//     msgTimer.current=setTimeout(()=>setMsg(''),2600);
//   };

//   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
//     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

//   // 2. the player tapped something -> ask the backend
//   const onPick=async(it:L5Item)=>{
//     if(busy||!sessionId||!view||result)return;
//     const look=lookOf(it,view.items,view.stage);
//     setBusy(true);setGlow(null);
//     try{
//       const res=await pickItem({sessionId,playerId,itemId:it.id});

//       if(!res.correct){
//         setMark({x:it.x*bw,y:it.y*bh,ok:false});
//         doShake();flash(wrongText(it.kind,look.name));
//         later(()=>setMark(null),700);
//         // wrong pick -> the server sent a new arrangement, the player taps again
//         later(()=>{setView(res);setBusy(false)},res.reshuffled?650:150);
//         return;
//       }

//       // right cucumber: it hides first
//       setView(v=>v&&{...v,items:v.items.map(i=>i.id===it.id?{...i,hidden:true}:i)});

//       if(res.completed){
//         later(()=>setResult(res),1000);
//       }else if(res.stageDone){
//         flash(res.message);
//         later(()=>{setView(res);setBusy(false)},900);
//       }else{
//         setView(res);setBusy(false);
//       }
//     }catch(e:any){
//       flash(e.message||'Network error');
//       setBusy(false);
//     }
//   };

//   // 3. magnifier tapped -> show ONE clue
//   const onHint=async()=>{
//     if(busy||!sessionId||result)return;

//     // clue already bought -> just show it again, NO extra cost
//     if(clueUsed){
//       setClueOpen(true);
//       return;
//     }

//     // not enough hints -> only a message, the popup stays closed
//     if(hints<HINT_COST){
//       flash(`You need ${HINT_COST} hints. Watch a video to earn more!`);
//       return;
//     }

//     try{
//       const r=await hintLevel5({sessionId,playerId});
//       setHints&&setHints(r.hints);
//       setClueUsed(true);
//       setClueOpen(true);
//     }catch(e:any){
//       // the status may not be set by hintLevel5, so also match on the message
//       const noFunds=e?.status===402||/not enough|payment/i.test(e?.message||'');
//       flash(noFunds?`You need ${HINT_COST} hints. Watch a video to earn more!`:e?.message||'Network error');
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
//           <Text style={st.signT}>LEVEL 5</Text>
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
//           <Text style={st.load}>Loading level 5...</Text>
//         </>}
//       </View>
//     </View></Stage>;
//   }

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

//       {/* vegetables */}
//       <Animated.View style={{width:bw,height:bh,marginTop:10,transform:[{translateX:shake}]}}>
//         {view.items.map(it=>
//           <Veg key={view.stage+'-'+it.id} it={it} look={lookOf(it,view.items,view.stage)} bw={bw} bh={bh} glow={glow===it.id}
//             disabled={busy||!!result} onPress={onPick}/>)}
//         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}>
//           {mark.ok?<Tick/>:<Cross/>}
//         </View>}
//       </Animated.View>

//       <Text style={st.sub}>{view.hint}</Text>
//     </View>

//     {/* bottom rounded panel (same as level 1) */}
//     <View style={st.panel}>
//       <View style={st.btnCol}>
//         {/* dimmed only when the clue is not bought yet and the player can't afford it */}
//         <TouchableOpacity style={[st.ringGreen,(!clueUsed&&hints<HINT_COST)&&{opacity:0.5}]} activeOpacity={0.85} onPress={onHint}>
//           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
//         </TouchableOpacity>
//         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>{HINT_COST}</Text></View>
//       </View>

//       <View style={st.btnCol}>
//         {/* video button: when the reward video finishes, ONLY add hints (setHints(hints+75)),
//             never call setClueOpen(true) here */}
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={()=>onWatchVideo&&onWatchVideo()}>
//           <Icon n="film" s={36}/>
//         </TouchableOpacity>
//         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
//       </View>

//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={()=>onWatchVideo&&onWatchVideo()}>
//           <View style={st.circleRed}><Icon n="play" s={30}/></View>
//         </TouchableOpacity>
//         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
//       </View>
//     </View>

//     {/* CLUE popup (only from the magnifier, ONE clue) */}
//     {clueOpen&&<View style={st.overlay}>
//       <View style={st.clueCard}>
//         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
//           <Text style={st.closeT}>✕</Text>
//         </TouchableOpacity>
//         <Text style={st.clueTitle}>CLUE</Text>

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
//         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
//           <Text style={st.nextT}>NEXT</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </View>}
//   </View></Stage>;
// }

// /* =========================================================
//    STYLES  (same room theme as Level 1)
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
//   sub:{fontFamily:FONT,fontSize:15,fontStyle:'italic',fontWeight:'700',color:THEME.navy,textAlign:'center',marginTop:6},

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
import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
import {Stage,Coin} from './BTShared';
import {Icon} from './Art';
import {startLevel5,pickItem,hintLevel5,Level5View,Level5Pick,L5Item} from './Btlevel5api';
import {Cucumber,Tomato,Tick,Cross,BigStar} from './Btlevel5art';
import {Kovakkai,PointedGourd,SnakeGourd,RidgeGourd,Capsicum,Okra,GreenChilli,Cabbage,Broccoli,Pumpkin,Brinjal,Carrot,Onion,VEG_SIZE} from './Btlevel5veg';
import {RoomBackground,THEME} from './Btlevel4Theme';

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// a clue costs this many hints (must match the server and the badge on the magnifier)
const HINT_COST=25;

// only ONE clue is shown when the magnifier is tapped
const CLUE_1='Not everything green is a cucumber… look beyond the stripes!';

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level5Pick)=>void;
  // called when the player taps the coins / video buttons. The parent should ONLY add hints here.
  onWatchVideo?:()=>void;
};

/* =========================================================
   LOOKS ONLY: the server still sends the same 4 kinds
   (cucumber / tomato / zucchini / gourd). Here every kind is
   drawn as one of several vegetables. The game rules are
   decided by the server and do not change.
========================================================= */

type Look={key:string;name:string;Art:any};

const LOOKS:Record<string,Look[]>={
  cucumber:[{key:'cucumber',name:'cucumber',Art:Cucumber}],
  // mixed vegetables (green ones + pumpkin, brinjal, ... to confuse the player)
  tomato:[
    {key:'capsicum',name:'capsicum',Art:Capsicum},
    {key:'pumpkin',name:'pumpkin',Art:Pumpkin},
    {key:'okra',name:'ladies finger',Art:Okra},
    {key:'brinjal',name:'brinjal',Art:Brinjal},
    {key:'chilli',name:'green chilli',Art:GreenChilli},
    {key:'tomato',name:'tomato',Art:Tomato},
    {key:'cabbage',name:'cabbage',Art:Cabbage},
    {key:'carrot',name:'carrot',Art:Carrot},
    {key:'broccoli',name:'broccoli',Art:Broccoli},
    {key:'onion',name:'onion',Art:Onion},
  ],
  // gourds
  zucchini:[
    {key:'kovakkai',name:'ivy gourd',Art:Kovakkai},
    {key:'pointed',name:'pointed gourd',Art:PointedGourd},
  ],
  gourd:[
    {key:'snake',name:'snake gourd',Art:SnakeGourd},
    {key:'ridge',name:'ridge gourd',Art:RidgeGourd},
  ],
};

// same vegetable stays the same for an item (picked by its order among the same kind)
// (the start point changes on every screen so each screen shows a different mix)
const lookOf=(it:L5Item,items:L5Item[],stage:number):Look=>{
  const list=LOOKS[it.kind]||LOOKS.tomato;
  const order=items.filter(i=>i.kind===it.kind&&i.id<it.id).length;
  return list[(order+(stage-1)*3)%list.length];
};

const article=(n:string)=>/^[aeiou]/i.test(n)?'an':'a';

// wrong-pick text that matches the vegetable that is drawn
const wrongText=(kind:string,name:string)=>{
  if(kind==='tomato')return `${article(name)[0].toUpperCase()+article(name).slice(1)} ${name} is not a cucumber!`;
  if(kind==='zucchini')return `Oops! That is ${article(name)} ${name}. Find the real cucumber!`;
  return `That is ${article(name)} ${name}, not a cucumber!`;
};

/* =========================================================
   ONE VEGETABLE ON THE BOARD
========================================================= */

function Veg({it,look,bw,bh,glow,disabled,onPress}:{it:L5Item;look:Look;bw:number;bh:number;glow:boolean;disabled:boolean;onPress:(it:L5Item)=>void}){
  // safe fallback so an unknown vegetable can never crash the board
  const size=VEG_SIZE[look.key]||{w:64,h:64};
  const w=size.w,h=size.h;
  const px=it.x*bw-w/2,py=it.y*bh-h/2;

  const x=useRef(new Animated.Value(px)).current;
  const y=useRef(new Animated.Value(py)).current;
  const sc=useRef(new Animated.Value(it.hidden?0:1)).current;
  const pulse=useRef(new Animated.Value(0)).current;

  // the server rearranged the board -> slide to the new spot
  useEffect(()=>{
    Animated.parallel([
      Animated.timing(x,{toValue:px,duration:600,useNativeDriver:false}),
      Animated.timing(y,{toValue:py,duration:600,useNativeDriver:false})]).start();
  },[px,py]);

  // picked cucumber shrinks away
  useEffect(()=>{
    if(it.hidden)Animated.timing(sc,{toValue:0,duration:280,useNativeDriver:false}).start();
  },[it.hidden]);

  // hint glow (not used by the clue any more, kept so the board code stays the same)
  useEffect(()=>{
    if(!glow){pulse.setValue(0);return}
    const l=Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:420,useNativeDriver:false}),
      Animated.timing(pulse,{toValue:0,duration:420,useNativeDriver:false})]));
    l.start();
    return()=>l.stop();
  },[glow]);

  const Art=look.Art;

  return <Animated.View pointerEvents={it.hidden?'none':'auto'} style={{
      position:'absolute',left:x,top:y,width:w,height:h,
      transform:[{rotate:it.rot+'deg'},{scale:sc}]}}>
    <Animated.View pointerEvents="none" style={{
      position:'absolute',left:-8,right:-8,top:-8,bottom:-8,borderRadius:20,
      borderWidth:3,borderColor:'#ffb300',opacity:pulse}}/>
    <Pressable disabled={disabled} hitSlop={10} onPress={()=>onPress(it)} style={{width:w,height:h}}>
      <Art w={w}/>
    </Pressable>
  </Animated.View>;
}

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevel5Screen({playerId,hints=0,setHints,onExit,onComplete,onWatchVideo}:Props){
  const {width,height}=useWindowDimensions();
  const bw=Math.min(width-48,380);
  const bh=Math.max(250,Math.min(300,height-360));

  const [view,setView]=useState<Level5View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);
  const [mark,setMark]=useState<{x:number;y:number;ok:boolean}|null>(null);
  const [glow,setGlow]=useState<number|null>(null);
  const [result,setResult]=useState<Level5Pick|null>(null);
  const [clueOpen,setClueOpen]=useState(false);   // popup visible or not
  const [clueUsed,setClueUsed]=useState(false);   // clue already paid for -> no extra cost

  const shake=useRef(new Animated.Value(0)).current;
  const pop=useRef(new Animated.Value(0)).current;
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  // 1. open the level - the backend creates or resumes the session
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel5(playerId)
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

  // new stage -> the clue is fresh again (delete this effect if you want ONE clue for the whole level)
  useEffect(()=>{
    // the server tells us if the clue was already bought (survives refresh)
    setClueUsed(!!(view as any)?.clueUsed);
    setClueOpen(false);
    setGlow(null);
  },[view?.stage]);

  const flash=(m:string)=>{
    setMsg(m);clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2600);
  };

  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
    Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  // 2. the player tapped something -> ask the backend
  const onPick=async(it:L5Item)=>{
    if(busy||!sessionId||!view||result)return;
    const look=lookOf(it,view.items,view.stage);
    setBusy(true);setGlow(null);
    try{
      const res=await pickItem({sessionId,playerId,itemId:it.id});

      if(!res.correct){
        setMark({x:it.x*bw,y:it.y*bh,ok:false});
        doShake();flash(wrongText(it.kind,look.name));
        later(()=>setMark(null),700);
        // wrong pick -> the server sent a new arrangement, the player taps again
        later(()=>{setView(res);setBusy(false)},res.reshuffled?650:150);
        return;
      }

      // right cucumber: it hides first
      setView(v=>v&&{...v,items:v.items.map(i=>i.id===it.id?{...i,hidden:true}:i)});

      if(res.completed){
        later(()=>setResult(res),1000);
      }else if(res.stageDone){
        flash(res.message);
        later(()=>{setView(res);setBusy(false)},900);
      }else{
        setView(res);setBusy(false);
      }
    }catch(e:any){
      flash(e.message||'Network error');
      setBusy(false);
    }
  };

  // 3. magnifier tapped -> show ONE clue
  const onHint=async()=>{
    if(busy||!sessionId||result)return;

    // clue already bought -> just show it again, NO extra cost
    if(clueUsed){
      setClueOpen(true);
      return;
    }

    // not enough hints -> only a message, the popup stays closed
    if(hints<HINT_COST){
      flash(`You need ${HINT_COST} hints. Watch a video to earn more!`);
      return;
    }

    try{
      const r=await hintLevel5({sessionId,playerId});
      setHints&&setHints(r.hints);
      setClueUsed(true);
      setClueOpen(true);
    }catch(e:any){
      // the status may not be set by hintLevel5, so also match on the message
      const noFunds=e?.status===402||/not enough|payment/i.test(e?.message||'');
      flash(noFunds?`You need ${HINT_COST} hints. Watch a video to earn more!`:e?.message||'Network error');
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
          <Text style={st.signT}>LEVEL 5</Text>
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
          <Text style={st.load}>Loading level 5...</Text>
        </>}
      </View>
    </View></Stage>;
  }

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

      {/* vegetables */}
      <Animated.View style={{width:bw,height:bh,marginTop:10,transform:[{translateX:shake}]}}>
        {view.items.map(it=>
          <Veg key={view.stage+'-'+it.id} it={it} look={lookOf(it,view.items,view.stage)} bw={bw} bh={bh} glow={glow===it.id}
            disabled={busy||!!result} onPress={onPick}/>)}
        {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}>
          {mark.ok?<Tick/>:<Cross/>}
        </View>}
      </Animated.View>

      <Text style={st.sub}>{view.hint}</Text>
    </View>

    {/* bottom rounded panel (same as level 1) */}
    <View style={st.panel}>
      <View style={st.btnCol}>
        {/* dimmed only when the clue is not bought yet and the player can't afford it */}
        <TouchableOpacity style={[st.ringGreen,(!clueUsed&&hints<HINT_COST)&&{opacity:0.5}]} activeOpacity={0.85} onPress={onHint}>
          <View style={st.circleGreen}><Icon n="search" s={32}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>{HINT_COST}</Text></View>
      </View>

      <View style={st.btnCol}>
        {/* video button: when the reward video finishes, ONLY add hints (setHints(hints+75)),
            never call setClueOpen(true) here */}
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={()=>onWatchVideo&&onWatchVideo()}>
          <Icon n="film" s={36}/>
        </TouchableOpacity>
        <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={()=>onWatchVideo&&onWatchVideo()}>
          <View style={st.circleRed}><Icon n="play" s={30}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
      </View>
    </View>

    {/* CLUE popup (only from the magnifier, ONE clue) */}
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
   STYLES  (same room theme as Level 1)
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
  sub:{fontFamily:FONT,fontSize:15,fontStyle:'italic',fontWeight:'700',color:THEME.navy,textAlign:'center',marginTop:6},

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
