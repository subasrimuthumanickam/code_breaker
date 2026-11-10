
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
// //   // called when the player taps the coins / video buttons. The parent should ONLY add hints here.
// //   onWatchVideo?:()=>void;
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

// // export default function BTLevel5Screen({playerId,hints=0,setHints,onExit,onComplete,onWatchVideo}:Props){
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
// //     // the server tells us if the clue was already bought (survives refresh)
// //     setClueUsed(!!(view as any)?.clueUsed);
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
// //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={()=>onWatchVideo&&onWatchVideo()}>
// //           <Icon n="film" s={36}/>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// //       </View>

// //       <View style={st.btnCol}>
// //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={()=>onWatchVideo&&onWatchVideo()}>
// //           <View style={st.circleRed}><Icon n="play" s={30}/></View>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// //       </View>
// //     </View>

// //     {/* CLUE popup (only from the magnifier, ONE clue) */}
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
// import {Apple,Tomato,Tick,Cross,BigStar} from './Btlevel5art';
// import {Kovakkai,PointedGourd,SnakeGourd,RidgeGourd,Capsicum,Okra,GreenChilli,Cabbage,Broccoli,Pumpkin,Brinjal,Carrot,Onion,VEG_SIZE} from './Btlevel5veg';
// import {RoomBackground,THEME} from './Btlevel4Theme';
// import {play} from './BTSound';   // <- BTSound file path ungal project-ku match pannunga (level 1-la epdi import pannirukeengalo apdiye)

// const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // a clue costs this many hints (must match the server and the badge on the magnifier)
// const HINT_COST=25;

// // only ONE clue is shown when the magnifier is tapped
// const CLUE_1='Look for the shiny red ones with a little green leaf!';

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
//    LOOKS ONLY: the server still sends the same 4 kinds.
//    "cucumber" kind = APPLE (the correct pick).
//    Other kinds are drawn as other vegetables.
//    The game rules are decided by the server.
// ========================================================= */

// type Look={key:string;name:string;Art:any};

// const LOOKS:Record<string,Look[]>={
//   // the correct pick is now an apple
//   cucumber:[{key:'apple',name:'apple',Art:Apple}],
//   // mixed vegetables (wrong picks)
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
// // stage 3: the single wrong item is always a real TOMATO
// const lookOf=(it:L5Item,items:L5Item[],stage:number):Look=>{
//   if(stage===3&&it.kind==='tomato')return {key:'tomato',name:'tomato',Art:Tomato};
//   const list=LOOKS[it.kind]||LOOKS.tomato;
//   const order=items.filter(i=>i.kind===it.kind&&i.id<it.id).length;
//   return list[(order+(stage-1)*3)%list.length];
// };

// const article=(n:string)=>/^[aeiou]/i.test(n)?'an':'a';

// // wrong-pick text that matches the vegetable that is drawn
// const wrongText=(kind:string,name:string)=>{
//   const a=article(name);
//   return `${a[0].toUpperCase()+a.slice(1)} ${name} is not an apple!`;
// };

// /* =========================================================
//    ONE ITEM ON THE BOARD
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

//   // picked apple shrinks away
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

//   // level complete -> card pops in + win sound
//   useEffect(()=>{
//     if(result){
//       play('correct');
//       Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
//     }
//   },[result]);

//   // new stage -> the clue is fresh again
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
//     play('tap');                                   // click sound
//     try{
//       const res=await pickItem({sessionId,playerId,itemId:it.id});

//       if(!res.correct){
//         play('wrong');                             // wrong sound (same as level 1)
//         setMark({x:it.x*bw,y:it.y*bh,ok:false});
//         doShake();flash(wrongText(it.kind,look.name));
//         later(()=>setMark(null),700);
//         // wrong pick -> the server sent a new arrangement, the player taps again
//         later(()=>{setView(res);setBusy(false)},res.reshuffled?650:150);
//         return;
//       }

//       // right apple: correct sound, then it hides
//       play('correct');
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
//       play('clue');
//       setClueOpen(true);
//       return;
//     }

//     // not enough hints -> only a message, the popup stays closed
//     if(hints<HINT_COST){
//       play('wrong');
//       flash(`You need ${HINT_COST} hints. Watch a video to earn more!`);
//       return;
//     }

//     try{
//       const r=await hintLevel5({sessionId,playerId});
//       setHints&&setHints(r.hints);
//       setClueUsed(true);
//       play('clue');
//       setClueOpen(true);
//     }catch(e:any){
//       // the status may not be set by hintLevel5, so also match on the message
//       const noFunds=e?.status===402||/not enough|payment/i.test(e?.message||'');
//       flash(noFunds?`You need ${HINT_COST} hints. Watch a video to earn more!`:e?.message||'Network error');
//     }
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
//           <TouchableOpacity style={st.retry} onPress={()=>{play('btn');load()}}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
//           <TouchableOpacity onPress={()=>{play('btn');onExit()}}><Text style={st.back}>Back</Text></TouchableOpacity>
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

//       {/* items on the board */}
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
//         {/* video button: when the reward video finishes, ONLY add hints */}
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={watchVideo}>
//           <Icon n="film" s={36}/>
//         </TouchableOpacity>
//         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
//       </View>

//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={watchVideo}>
//           <View style={st.circleRed}><Icon n="play" s={30}/></View>
//         </TouchableOpacity>
//         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
//       </View>
//     </View>

//     {/* CLUE popup (only from the magnifier, ONE clue) */}
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
import {Apple,Tomato,Tick,Cross,BigStar} from './Btlevel5art';
import {RoomBackground,THEME} from './Btlevel4Theme';
import {play} from './BTSound';   // level 1-la epdi import pannirukeengalo apdiye path vaiyunga

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

const HINT_COST=25;
const ITEM_SIZE=46;   // apples and tomatoes are drawn at this size (20 items fit on the board)

// clue text for each screen
const clueFor=(stage:number)=>
  stage===2
    ?'Apples and tomatoes look alike. Tomatoes are a little wider and have a star-shaped green top!'
    :'Apples have a little brown stem and a green leaf. The tomato has a star-shaped top!';

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level5Pick)=>void;
  // called when the player taps the coins / video buttons. The parent should ONLY add hints here.
  onWatchVideo?:()=>void;
};

const wrongText=(kind:string)=>kind==='apple'?'That is an apple, not a tomato!':'That is a tomato, not an apple!';

/* =========================================================
   ONE ITEM ON THE BOARD (apple or tomato)
========================================================= */

function Veg({it,bw,bh,glow,disabled,onPress}:{it:L5Item;bw:number;bh:number;glow:boolean;disabled:boolean;onPress:(it:L5Item)=>void}){
  const w=ITEM_SIZE,h=ITEM_SIZE;
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

  // picked item shrinks away
  useEffect(()=>{
    if(it.hidden)Animated.timing(sc,{toValue:0,duration:280,useNativeDriver:false}).start();
  },[it.hidden]);

  useEffect(()=>{
    if(!glow){pulse.setValue(0);return}
    const l=Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:420,useNativeDriver:false}),
      Animated.timing(pulse,{toValue:0,duration:420,useNativeDriver:false})]));
    l.start();
    return()=>l.stop();
  },[glow]);

  const Art=it.kind==='tomato'?Tomato:Apple;

  return <Animated.View pointerEvents={it.hidden?'none':'auto'} style={{
      position:'absolute',left:x,top:y,width:w,height:h,
      transform:[{rotate:it.rot+'deg'},{scale:sc}]}}>
    <Animated.View pointerEvents="none" style={{
      position:'absolute',left:-8,right:-8,top:-8,bottom:-8,borderRadius:20,
      borderWidth:3,borderColor:'#ffb300',opacity:pulse}}/>
    <Pressable disabled={disabled} hitSlop={2} onPress={()=>onPress(it)} style={{width:w,height:h}}>
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
  const [clueOpen,setClueOpen]=useState(false);
  const [clueUsed,setClueUsed]=useState(false);

  const shake=useRef(new Animated.Value(0)).current;
  const pop=useRef(new Animated.Value(0)).current;
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  // 1. open the level
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

  // level complete -> card pops in + sound
  useEffect(()=>{
    if(result){
      play('correct');
      Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
    }
  },[result]);

  // new stage -> the clue is fresh again
  useEffect(()=>{
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
    setBusy(true);setGlow(null);
    play('tap');
    try{
      const res=await pickItem({sessionId,playerId,itemId:it.id});

      if(!res.correct){
        play('wrong');
        setMark({x:it.x*bw,y:it.y*bh,ok:false});
        doShake();flash(wrongText(it.kind));
        later(()=>setMark(null),700);
        // wrong pick -> (screen 2: board rearranged) the player taps again
        later(()=>{setView(res);setBusy(false)},res.reshuffled?650:150);
        return;
      }

      // right pick: it hides
      play('correct');
      setView(v=>v&&{...v,items:v.items.map(i=>i.id===it.id?{...i,hidden:true}:i)});

      if(res.completed){
        // only after screen 3 is finished
        later(()=>setResult(res),1000);
      }else if(res.stageDone){
        // go to the next screen
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

  // 3. magnifier tapped -> ONE clue
  const onHint=async()=>{
    if(busy||!sessionId||result)return;

    // clue already bought -> show again, no extra cost
    if(clueUsed){
      play('clue');
      setClueOpen(true);
      return;
    }

    if(hints<HINT_COST){
      play('wrong');
      flash(`You need ${HINT_COST} hints. Watch a video to earn more!`);
      return;
    }

    try{
      const r=await hintLevel5({sessionId,playerId});
      setHints&&setHints(r.hints);
      setClueUsed(true);
      play('clue');
      setClueOpen(true);
    }catch(e:any){
      const noFunds=e?.status===402||/not enough|payment/i.test(e?.message||'');
      flash(noFunds?`You need ${HINT_COST} hints. Watch a video to earn more!`:e?.message||'Network error');
    }
  };

  const watchVideo=()=>{play('btn');onWatchVideo&&onWatchVideo()};

  /* ---------- header ---------- */

  const header=(
    <View style={st.topBar}>
      <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={()=>{play('btn');onExit()}}>
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
          <TouchableOpacity style={st.retry} onPress={()=>{play('btn');load()}}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>{play('btn');onExit()}}><Text style={st.back}>Back</Text></TouchableOpacity>
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
      <View style={st.qPill}>
        <Text style={st.qArrow}>{'<'}</Text>
        <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
        <Text style={st.qArrow}>{'>'}</Text>
      </View>

      <Animated.View style={{width:bw,height:bh,marginTop:10,transform:[{translateX:shake}]}}>
        {view.items.map(it=>
          <Veg key={view.stage+'-'+it.id} it={it} bw={bw} bh={bh} glow={glow===it.id}
            disabled={busy||!!result} onPress={onPick}/>)}
        {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}>
          {mark.ok?<Tick/>:<Cross/>}
        </View>}
      </Animated.View>

      <Text style={st.sub}>{view.hint}</Text>
    </View>

    {/* bottom panel */}
    <View style={st.panel}>
      <View style={st.btnCol}>
        <TouchableOpacity style={[st.ringGreen,(!clueUsed&&hints<HINT_COST)&&{opacity:0.5}]} activeOpacity={0.85} onPress={onHint}>
          <View style={st.circleGreen}><Icon n="search" s={32}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>{HINT_COST}</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={watchVideo}>
          <Icon n="film" s={36}/>
        </TouchableOpacity>
        <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={watchVideo}>
          <View style={st.circleRed}><Icon n="play" s={30}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
      </View>
    </View>

    {/* CLUE popup */}
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
            <Text style={st.clueBody}>{clueFor(view.stage)}</Text>
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
   STYLES (unchanged)
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