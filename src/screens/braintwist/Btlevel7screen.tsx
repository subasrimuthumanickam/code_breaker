
// // // // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // // // import {View,Text,TouchableOpacity,Pressable,Animated,PanResponder,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// // // // // import {Stage,Coin} from './BTShared';
// // // // // import {Icon} from './Art';
// // // // // import {startLevel7,sendAction,Level7View,Level7Result,L7Thing} from './Btlevel7api';
// // // // // import {Room,Thing,Tick,Cross,BigStar,HOT,ROOM_W,ROOM_H} from './Btlevel7art';
// // // // // import {RoomBackground,THEME} from './Btlevel4Theme';
// // // // // import {play} from './BTSound';

// // // // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // // // // // the clue is FREE: it never depends on hints, coins or videos.
// // // // // // one clue per stage (stage 1 = clock, stage 2 = timetable, stage 3 = coins)
// // // // // const CLUES:Record<number,string>={
// // // // //   1:'The right time may be hiding in the wrong place… or is the wrong time right in front of you?',
// // // // //   2:'Find the day that comes right after Tuesday. Look for the book with that day\'s name on it.',
// // // // //   3:'She already has some coins… but how many more coins does she need to buy the ticket?',
// // // // // };

// // // // // type Props={
// // // // //   playerId:number;
// // // // //   hints?:number;
// // // // //   setHints?:(n:number)=>void;
// // // // //   onExit:()=>void;
// // // // //   onComplete?:(result:Level7Result)=>void;
// // // // //   // called when the coins / video buttons are tapped. The parent should ONLY add hints here.
// // // // //   onWatchVideo?:()=>void;
// // // // // };

// // // // // /* one draggable item in the tray; it snaps back unless dropped on the target */
// // // // // function DragItem({thing,onDrop,disabled}:{thing:L7Thing;onDrop:(id:string,x:number,y:number)=>Promise<boolean>;disabled:boolean}){
// // // // //   const xy=useRef(new Animated.ValueXY()).current;
// // // // //   const [lift,setLift]=useState(false);
// // // // //   const live=useRef({disabled,onDrop,thing});
// // // // //   live.current={disabled,onDrop,thing};
// // // // //   const back=()=>Animated.spring(xy,{toValue:{x:0,y:0},friction:6,useNativeDriver:true}).start();
// // // // //   const pr=useRef(PanResponder.create({
// // // // //     onStartShouldSetPanResponder:()=>!live.current.disabled,
// // // // //     onPanResponderGrant:()=>{play('drag');setLift(true);xy.setOffset({x:0,y:0});xy.setValue({x:0,y:0})},
// // // // //     onPanResponderMove:Animated.event([null,{dx:xy.x,dy:xy.y}],{useNativeDriver:false}),
// // // // //     onPanResponderRelease:async(e,g)=>{
// // // // //       setLift(false);
// // // // //       const ok=await live.current.onDrop(live.current.thing.id,g.moveX,g.moveY);
// // // // //       if(!ok)back();
// // // // //     },
// // // // //     onPanResponderTerminate:()=>{setLift(false);back()},
// // // // //   })).current;
// // // // //   return <Animated.View {...pr.panHandlers}
// // // // //     style={[ts.item,{zIndex:lift?60:1,elevation:lift?12:0,transform:[{translateX:xy.x},{translateY:xy.y},{scale:lift?1.15:1}]}]}>
// // // // //     <Thing id={thing.id} size={62}/>
// // // // //   </Animated.View>;
// // // // // }

// // // // // export default function BTLevel7Screen({playerId,hints=0,onExit,onComplete,onWatchVideo}:Props){
// // // // //   const {width,height}=useWindowDimensions();
// // // // //   const RW=Math.max(240,Math.min(width-36,340,(height-470)*ROOM_W/ROOM_H));   // room width
// // // // //   const k2=(RW-6)/ROOM_W;                         // room units -> pixels (inside the 3px frame)
// // // // //   const RH=ROOM_H*k2+6;

// // // // //   const [view,setView]=useState<Level7View|null>(null);
// // // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // // //   const [loadErr,setLoadErr]=useState('');
// // // // //   const [msg,setMsg]=useState('');
// // // // //   const [busy,setBusy]=useState(false);
// // // // //   const [done,setDone]=useState(false);
// // // // //   const [mark,setMark]=useState<{x:number;y:number}|null>(null);
// // // // //   const [result,setResult]=useState<Level7Result|null>(null);
// // // // //   const [clueOpen,setClueOpen]=useState(false);
// // // // //   const zone=view&&view.target?HOT[view.target]:null;   // where the dragged thing must be dropped

// // // // //   const shake=useRef(new Animated.Value(0)).current;
// // // // //   const pop=useRef(new Animated.Value(0)).current;
// // // // //   const timers=useRef<any[]>([]);
// // // // //   const msgTimer=useRef<any>(null);
// // // // //   const babyRef=useRef<View>(null);
// // // // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // // // //   // 1. open the level - the backend creates or resumes the session
// // // // //   const load=useCallback(()=>{
// // // // //     setLoadErr('');setView(null);
// // // // //     startLevel7(playerId)
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

// // // // //   // new stage -> close the clue popup (each stage has its own clue)
// // // // //   useEffect(()=>{setClueOpen(false)},[view?.stage]);

// // // // //   const flash=(m:string)=>{
// // // // //     setMsg(m);clearTimeout(msgTimer.current);
// // // // //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// // // // //   };
// // // // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// // // // //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// // // // //   // 2. send the player's action; the backend decides if it is right
// // // // //   const act=async(kind:'tap'|'drag',item:string,target:string|undefined,at:{x:number;y:number}):Promise<boolean>=>{
// // // // //     if(busy||done||!sessionId||!view)return false;
// // // // //     setBusy(true);
// // // // //     try{
// // // // //       const res=await sendAction({sessionId,playerId,kind,item,target});
// // // // //       if(!res.correct){
// // // // //         play('wrong');
// // // // //         setMark(at);doShake();flash(res.message);
// // // // //         later(()=>setMark(null),700);
// // // // //         setBusy(false);
// // // // //         return false;
// // // // //       }
// // // // //       play('correct');
// // // // //       flash(res.message);
// // // // //       if(res.completed){
// // // // //         setDone(true);
// // // // //         setView({...view,scene:res.scene||view.scene});
// // // // //         later(()=>setResult(res),1700);
// // // // //       }else{
// // // // //         setView({...view,...(res as any)});            // next stage comes from the server
// // // // //         setBusy(false);
// // // // //       }
// // // // //       return true;
// // // // //     }catch(e:any){
// // // // //       flash(e.message||'Network error');
// // // // //       setBusy(false);
// // // // //       return false;
// // // // //     }
// // // // //   };

// // // // //   const onTap=(id:string)=>{
// // // // //     const h=HOT[id];
// // // // //     play('tap');
// // // // //     act('tap',id,undefined,{x:3+(h.x+h.w/2)*k2,y:3+(h.y+h.h/2)*k2});
// // // // //   };

// // // // //   // dropped somewhere: only counts when the finger is over the target
// // // // //   const onDrop=(id:string,mx:number,my:number):Promise<boolean>=>new Promise(resolve=>{
// // // // //     const node:any=babyRef.current;
// // // // //     if(!node||!zone||!node.measureInWindow){resolve(false);return}
// // // // //     node.measureInWindow((x:number,y:number,w:number,h:number)=>{
// // // // //       const inside=mx>=x&&mx<=x+w&&my>=y&&my<=y+h;
// // // // //       if(!inside){resolve(false);return}
// // // // //       act('drag',id,view?.target||'',{x:3+(zone.x+zone.w/2)*k2,y:3+(zone.y+zone.h/2)*k2}).then(resolve);
// // // // //     });
// // // // //   });

// // // // //   // 3. magnifier tapped -> show the clue directly (free, no hints / coins / video needed)
// // // // //   const onHint=()=>{
// // // // //     if(done)return;
// // // // //     play('clue');
// // // // //     setClueOpen(true);
// // // // //   };

// // // // //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// // // // //   const header=(
// // // // //     <View style={st.topBar}>
// // // // //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={()=>{play('btn');onExit()}}>
// // // // //         <Icon n="home" s={16}/>
// // // // //       </TouchableOpacity>

// // // // //       <View style={st.signWrap}>
// // // // //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// // // // //         <View style={st.sign}>
// // // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // // //           <Text style={st.signT}>LEVEL 7</Text>
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
// // // // //           <TouchableOpacity style={st.retry} onPress={()=>{play('btn');load()}}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // // //           <TouchableOpacity onPress={()=>{play('btn');onExit()}}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // // //         </>:<>
// // // // //           <ActivityIndicator size="large" color={THEME.orange}/>
// // // // //           <Text style={st.load}>Loading level 7...</Text>
// // // // //         </>}
// // // // //       </View>
// // // // //     </View></Stage>;
// // // // //   }

// // // // //   const tap=view.mode==='tap';
// // // // //   const stageNo=Math.min(3,Math.max(1,Number(view.stage)||1));

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

// // // // //       {/* the room scene */}
// // // // //       <Animated.View style={{width:RW,height:RH,marginTop:10,transform:[{translateX:shake}]}}>
// // // // //         <View style={st.panelFrame}><Room w={RW-6} mood={view.scene.mood}/></View>

// // // // //         {/* drop target: the bag (stage 2) or Mia (stage 3), set by the server */}
// // // // //         {!!zone&&<View ref={babyRef} collapsable={false} pointerEvents="none"
// // // // //           style={{position:'absolute',left:3+zone.x*k2,top:3+zone.y*k2,width:zone.w*k2,height:zone.h*k2}}/>}

// // // // //         {/* tap stage: invisible hotspots over every thing in the room */}
// // // // //         {tap&&!done&&view.objects.map(o=>{
// // // // //           const h=HOT[o.id];
// // // // //           if(!h)return null;
// // // // //           return <Pressable key={o.id} onPress={()=>onTap(o.id)}
// // // // //             style={{position:'absolute',left:3+h.x*k2,top:3+h.y*k2,width:h.w*k2,height:h.h*k2,borderRadius:12}}/>;
// // // // //         })}

// // // // //         {done&&<View pointerEvents="none" style={{position:'absolute',left:RW/2-40,top:RH*0.3}}><Tick s={80}/></View>}
// // // // //         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}><Cross/></View>}
// // // // //       </Animated.View>

// // // // //       {/* drag stage: items to drag onto the target */}
// // // // //       {!tap&&!done&&<View style={ts.row}>
// // // // //         {view.tray.map(t=><DragItem key={view.stage+'-'+t.id} thing={t} disabled={busy} onDrop={onDrop}/>)}
// // // // //       </View>}
// // // // //     </View>

// // // // //     {/* bottom rounded panel (same as level 1) */}
// // // // //     <View style={st.panel}>
// // // // //       <View style={st.btnCol}>
// // // // //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
// // // // //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// // // // //         </TouchableOpacity>
// // // // //         <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
// // // // //       </View>

// // // // //       <View style={st.btnCol}>
// // // // //         {/* coins / video button: the parent ONLY adds hints, it never opens the clue */}
// // // // //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={()=>{play('btn');onWatchVideo&&onWatchVideo()}}>
// // // // //           <Icon n="film" s={36}/>
// // // // //         </TouchableOpacity>
// // // // //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// // // // //       </View>

// // // // //       <View style={st.btnCol}>
// // // // //         <View style={st.ringWhite}><View style={st.circleRed}><Icon n="play" s={30}/></View></View>
// // // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// // // // //       </View>
// // // // //     </View>

// // // // //     {/* CLUES popup (only from the magnifier, the clue of the current stage) */}
// // // // //     {clueOpen&&<View style={st.overlay}>
// // // // //       <View style={st.clueCard}>
// // // // //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>{play('btn');setClueOpen(false)}}>
// // // // //           <Text style={st.closeT}>✕</Text>
// // // // //         </TouchableOpacity>
// // // // //         <Text style={st.clueTitle}>CLUES</Text>

// // // // //         <View style={[st.clueRow,st.clueRowOpen]}>
// // // // //           <View style={st.clueNum}><Text style={st.clueNumT}>{stageNo}</Text></View>
// // // // //           <View style={{flex:1}}>
// // // // //             <Text style={st.clueHead}>{'Clue '+stageNo}</Text>
// // // // //             <Text style={st.clueBody}>{CLUES[stageNo]}</Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       </View>
// // // // //     </View>}

// // // // //     {/* result card */}
// // // // //     {!!result&&<View style={st.overlay}>
// // // // //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // // // //         <Text style={st.cardTitle}>Level complete!</Text>
// // // // //         <Text style={st.cardMsg}>{result.message}</Text>
// // // // //         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// // // // //         <Text style={st.cardScore}>Score {result.score}</Text>
// // // // //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>{play('btn');onComplete?onComplete(result):onExit()}}>
// // // // //           <Text style={st.nextT}>NEXT</Text>
// // // // //         </TouchableOpacity>
// // // // //       </Animated.View>
// // // // //     </View>}
// // // // //   </View></Stage>;
// // // // // }

// // // // // const ts=StyleSheet.create({
// // // // //   row:{flexDirection:'row',justifyContent:'center',gap:14,marginTop:16,zIndex:30,elevation:10},
// // // // //   item:{width:76,height:76,borderRadius:16,backgroundColor:'rgba(255,248,230,0.95)',borderWidth:3,borderColor:'#d98b3d',alignItems:'center',justifyContent:'center'},
// // // // // });

// // // // // /* =========================================================
// // // // //    STYLES  (same cozy room theme as Level 1 / 5 / 6)
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
// // // // //   q:{flexShrink:1,fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

// // // // //   panelFrame:{borderWidth:3,borderColor:THEME.wood,borderRadius:12,overflow:'hidden',backgroundColor:'#eef1f4'},

// // // // //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// // // // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// // // // //   btnCol:{alignItems:'center'},
// // // // //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // // //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// // // // //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // // //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// // // // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// // // // //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// // // // //   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
// // // // //   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
// // // // //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
// // // // //   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
// // // // //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
// // // // //   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
// // // // //   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// // // // //   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
// // // // //   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
// // // // //   clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},

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
// // // // import {View,Text,TouchableOpacity,Pressable,Animated,PanResponder,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// // // // import Svg,{Rect,Path,Circle,Ellipse,G,Polygon,Defs,LinearGradient,Stop} from 'react-native-svg';
// // // // import {Stage,Coin} from './BTShared';
// // // // import {Icon} from './Art';
// // // // import {startLevel7,sendAction,Level7View,Level7Result,L7Thing} from './Btlevel7api';
// // // // import {Room,Thing,Tick,Cross,BigStar,HOT,ROOM_W,ROOM_H} from './Btlevel7art';
// // // // import {play} from './BTSound';

// // // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // const SERIF:any=Platform.select({web:'"Playfair Display",Georgia,"Times New Roman",serif',ios:'Georgia-Italic',default:'serif'});

// // // // /* garden palette (same as level 5 / 6) */
// // // // const NAVY='#13235b';
// // // // const SKY='#5cc0f5';
// // // // const CREAM='#faf0e2';
// // // // const CREAM_BORDER='#ead2a4';
// // // // const WOOD='#eba24e';
// // // // const WOOD_D='#c2782c';
// // // // const WOOD_DD='#8f5a1f';
// // // // const LIME='#a4e02a';
// // // // const LIME_RING='#f4f1dc';
// // // // const RED='#f0434d';
// // // // const ARROW='#ffb629';
// // // // const BADGE='#6b4423';
// // // // const GREEN_OK='#3ec45a';

// // // // // the clue is FREE: it never depends on hints, coins or videos.
// // // // // one clue per stage (stage 1 = clock, stage 2 = timetable, stage 3 = coins)
// // // // const CLUES:Record<number,string>={
// // // //   1:'The right time may be hiding in the wrong place… or is the wrong time right in front of you?',
// // // //   2:'Find the day that comes right after Tuesday. Look for the book with that day\'s name on it.',
// // // //   3:'She already has some coins… but how many more coins does she need to buy the ticket?',
// // // // };

// // // // type Props={
// // // //   playerId:number;
// // // //   hints?:number;
// // // //   setHints?:(n:number)=>void;
// // // //   onExit:()=>void;
// // // //   onComplete?:(result:Level7Result)=>void;
// // // //   // called when the coins / video buttons are tapped. The parent should ONLY add hints here.
// // // //   onWatchVideo?:()=>void;
// // // // };

// // // // /* =========================================================
// // // //    GARDEN BACKGROUND  (ONE svg, design grid 945 x 1665)
// // // // ========================================================= */

// // // // function Flower({x,y,s=1}:any){
// // // //   return <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // //     {[0,72,144,216,288].map(a=><Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`}/>)}
// // // //     <Circle cx="0" cy="0" r="12" fill="#ffd33d"/>
// // // //   </G>;
// // // // }

// // // // function Tuft({x,y}:any){
// // // //   return <G transform={`translate(${x} ${y})`} fill="#4fb12c">
// // // //     <Polygon points="-14,0 -8,-34 -2,0"/>
// // // //     <Polygon points="-4,0 4,-44 12,0"/>
// // // //     <Polygon points="8,0 18,-30 24,0"/>
// // // //   </G>;
// // // // }

// // // // function Cloud({x,y,s=1}:any){
// // // //   return <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.96">
// // // //     <Ellipse cx="0" cy="0" rx="80" ry="28"/>
// // // //     <Ellipse cx="-24" cy="-22" rx="42" ry="30"/>
// // // //     <Ellipse cx="22" cy="-30" rx="38" ry="30"/>
// // // //   </G>;
// // // // }

// // // // function Rock({x,y,s=1}:any){
// // // //   return <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // //     <Ellipse cx="0" cy="0" rx="68" ry="40" fill="#9b9b9b"/>
// // // //     <Ellipse cx="-6" cy="-10" rx="50" ry="26" fill="#b6b6b6"/>
// // // //   </G>;
// // // // }

// // // // function Garden(){
// // // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// // // //     <Svg width="100%" height="100%" viewBox="0 0 945 1665" preserveAspectRatio="xMidYMid slice">
// // // //       <Defs>
// // // //         <LinearGradient id="g7sky" x1="0" y1="0" x2="0" y2="1">
// // // //           <Stop offset="0" stopColor="#4fc3fa"/>
// // // //           <Stop offset="0.67" stopColor="#a6dffa"/>
// // // //           <Stop offset="1" stopColor="#a6dffa"/>
// // // //         </LinearGradient>
// // // //         <LinearGradient id="g7grass" x1="0" y1="0" x2="0" y2="1">
// // // //           <Stop offset="0" stopColor="#7dd63f"/>
// // // //           <Stop offset="1" stopColor="#68c832"/>
// // // //         </LinearGradient>
// // // //       </Defs>

// // // //       {/* one continuous sky */}
// // // //       <Rect width="945" height="1665" fill="url(#g7sky)"/>

// // // //       {/* trees in the top corners */}
// // // //       <Ellipse cx="60" cy="10" rx="170" ry="80" fill="#5bc07a" opacity="0.8"/>
// // // //       <Ellipse cx="120" cy="-10" rx="150" ry="70" fill="#6cc98a" opacity="0.8"/>
// // // //       <Ellipse cx="880" cy="0" rx="190" ry="70" fill="#58b843"/>
// // // //       <Ellipse cx="800" cy="-20" rx="140" ry="65" fill="#66c64a"/>

// // // //       {/* clouds */}
// // // //       <Cloud x={865} y={235} s={0.9}/>
// // // //       <Cloud x={55} y={295} s={0.7}/>
// // // //       <Cloud x={880} y={420} s={0.9}/>
// // // //       <Cloud x={70} y={715} s={0.9}/>

// // // //       {/* wooden frame + plant (left) */}
// // // //       <Rect x="0" y="312" width="210" height="22" fill="#eeb15e"/>
// // // //       <Rect x="186" y="312" width="24" height="240" fill="#eeb15e"/>
// // // //       <Ellipse cx="85" cy="450" rx="42" ry="92" fill="#6cbf3d"/>
// // // //       <Ellipse cx="150" cy="440" rx="36" ry="80" fill="#7fcf4b" transform="rotate(14 150 440)"/>
// // // //       <Ellipse cx="38" cy="470" rx="34" ry="64" fill="#5fae38" transform="rotate(-14 38 470)"/>
// // // //       <Rect x="62" y="488" width="104" height="70" rx="18" fill="#f8f1e6"/>
// // // //       <Circle cx="92" cy="518" r="5" fill="#4a3320"/>
// // // //       <Circle cx="138" cy="518" r="5" fill="#4a3320"/>
// // // //       <Ellipse cx="80" cy="532" rx="9" ry="6" fill="#f6b3b3"/>
// // // //       <Ellipse cx="150" cy="532" rx="9" ry="6" fill="#f6b3b3"/>
// // // //       <Path d="M106 530 Q115 540 124 530" stroke="#4a3320" strokeWidth="4" fill="none" strokeLinecap="round"/>
// // // //       <Rect x="0" y="552" width="228" height="38" fill="#f4c070"/>
// // // //       <Rect x="0" y="582" width="228" height="8" fill="#dca24f" opacity="0.6"/>

// // // //       {/* big bush (left) */}
// // // //       <Ellipse cx="55" cy="1010" rx="125" ry="115" fill="#4ea83a"/>
// // // //       <Ellipse cx="130" cy="1070" rx="120" ry="75" fill="#5bb83f"/>
// // // //       <Ellipse cx="20" cy="1090" rx="100" ry="60" fill="#66c447"/>

// // // //       {/* bookshelf (right) */}
// // // //       <Rect x="798" y="570" width="147" height="545" fill="#eeb15e"/>
// // // //       <Rect x="812" y="590" width="133" height="515" fill="#dfa04f"/>
// // // //       <Rect x="798" y="740" width="147" height="14" fill="#f4c070"/>
// // // //       <Rect x="798" y="905" width="147" height="14" fill="#f4c070"/>
// // // //       <Rect x="832" y="630" width="32" height="110" fill="#2f9ef0"/>
// // // //       <Rect x="866" y="646" width="30" height="94" fill="#f8d04c"/>
// // // //       <Rect x="898" y="640" width="32" height="100" fill="#8a63da"/>
// // // //       <Rect x="930" y="650" width="15" height="90" fill="#ef4b4b"/>
// // // //       <Rect x="830" y="808" width="30" height="98" fill="#3a5ed6"/>
// // // //       <Rect x="862" y="796" width="30" height="110" fill="#34c48a"/>
// // // //       <Circle cx="838" cy="972" r="18" fill="#c98a4b"/>
// // // //       <Circle cx="908" cy="972" r="18" fill="#c98a4b"/>
// // // //       <Ellipse cx="873" cy="1000" rx="46" ry="42" fill="#c98a4b"/>

// // // //       {/* wooden wall */}
// // // //       <Rect x="0" y="1112" width="945" height="200" fill="#f4c26c"/>
// // // //       <Path d="M0 1165 L945 1161 M0 1235 L945 1231" stroke="#dca24f" strokeWidth="3" opacity="0.55" fill="none"/>
// // // //       <Path d="M300 1112 L300 1300 M640 1112 L640 1300" stroke="#dca24f" strokeWidth="3" opacity="0.45" fill="none"/>

// // // //       {/* flower bushes beside the wall */}
// // // //       <Ellipse cx="60" cy="1290" rx="110" ry="80" fill="#5cbf36"/>
// // // //       <Ellipse cx="885" cy="1290" rx="110" ry="80" fill="#5cbf36"/>

// // // //       {/* front meadow */}
// // // //       <Path d="M0 1320 C150 1285 300 1300 470 1295 C650 1288 800 1278 945 1282 L945 1665 L0 1665 Z" fill="url(#g7grass)"/>
// // // //       <Path d="M0 1350 C40 1325 90 1350 90 1410 L90 1520 L0 1520 Z" fill="#5fb832"/>
// // // //       <Path d="M945 1350 C905 1325 855 1350 855 1410 L855 1520 L945 1520 Z" fill="#5fb832"/>

// // // //       {/* rocks */}
// // // //       <Rock x={40} y={1540} s={0.85}/>
// // // //       <Rock x={905} y={1545} s={0.85}/>

// // // //       {/* tufts */}
// // // //       <Tuft x={30} y={1480}/><Tuft x={915} y={1480}/>
// // // //       <Tuft x={130} y={1655}/><Tuft x={380} y={1655}/><Tuft x={600} y={1655}/><Tuft x={840} y={1655}/>

// // // //       {/* flowers */}
// // // //       <Flower x={65} y={1095} s={0.8}/>
// // // //       <Flower x={70} y={1262} s={0.9}/>
// // // //       <Flower x={885} y={1262} s={0.9}/>
// // // //       <Flower x={40} y={1580} s={0.85}/>
// // // //       <Flower x={185} y={1625} s={0.95}/>
// // // //       <Flower x={795} y={1625} s={0.95}/>
// // // //       <Flower x={905} y={1580} s={0.85}/>
// // // //     </Svg>
// // // //   </View>;
// // // // }

// // // // /* double arrow (skip icon) */
// // // // function DoubleArrow({s}:{s:number}){
// // // //   return <Svg width={s} height={s} viewBox="0 0 100 100">
// // // //     <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round"/>
// // // //     <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round"/>
// // // //   </Svg>;
// // // // }

// // // // /* =========================================================
// // // //    ONE DRAGGABLE ITEM IN THE TRAY (snaps back unless dropped on the target)
// // // // ========================================================= */

// // // // function DragItem({thing,onDrop,disabled}:{thing:L7Thing;onDrop:(id:string,x:number,y:number)=>Promise<boolean>;disabled:boolean}){
// // // //   const xy=useRef(new Animated.ValueXY()).current;
// // // //   const [lift,setLift]=useState(false);
// // // //   const live=useRef({disabled,onDrop,thing});
// // // //   live.current={disabled,onDrop,thing};
// // // //   const back=()=>Animated.spring(xy,{toValue:{x:0,y:0},friction:6,useNativeDriver:true}).start();
// // // //   const pr=useRef(PanResponder.create({
// // // //     onStartShouldSetPanResponder:()=>!live.current.disabled,
// // // //     onPanResponderGrant:()=>{play('drag');setLift(true);xy.setOffset({x:0,y:0});xy.setValue({x:0,y:0})},
// // // //     onPanResponderMove:Animated.event([null,{dx:xy.x,dy:xy.y}],{useNativeDriver:false}),
// // // //     onPanResponderRelease:async(e,g)=>{
// // // //       setLift(false);
// // // //       const ok=await live.current.onDrop(live.current.thing.id,g.moveX,g.moveY);
// // // //       if(!ok)back();
// // // //     },
// // // //     onPanResponderTerminate:()=>{setLift(false);back()},
// // // //   })).current;
// // // //   return <Animated.View {...pr.panHandlers}
// // // //     style={[ts.item,{zIndex:lift?60:1,elevation:lift?12:3,transform:[{translateX:xy.x},{translateY:xy.y},{scale:lift?1.15:1}]}]}>
// // // //     <Thing id={thing.id} size={62}/>
// // // //   </Animated.View>;
// // // // }

// // // // /* =========================================================
// // // //    SCREEN
// // // // ========================================================= */

// // // // export default function BTLevel7Screen({playerId,hints=0,onExit,onComplete,onWatchVideo}:Props){
// // // //   const {width,height}=useWindowDimensions();
// // // //   const RW=Math.max(240,Math.min(width-36,340,(height-470)*ROOM_W/ROOM_H));   // room width
// // // //   const k2=(RW-6)/ROOM_W;                         // room units -> pixels (inside the 3px frame)
// // // //   const RH=ROOM_H*k2+6;

// // // //   const [view,setView]=useState<Level7View|null>(null);
// // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // //   const [loadErr,setLoadErr]=useState('');
// // // //   const [msg,setMsg]=useState('');
// // // //   const [busy,setBusy]=useState(false);
// // // //   const [done,setDone]=useState(false);
// // // //   const [mark,setMark]=useState<{x:number;y:number}|null>(null);
// // // //   const [result,setResult]=useState<Level7Result|null>(null);
// // // //   const [clueOpen,setClueOpen]=useState(false);
// // // //   const zone=view&&view.target?HOT[view.target]:null;   // where the dragged thing must be dropped

// // // //   const shake=useRef(new Animated.Value(0)).current;
// // // //   const pop=useRef(new Animated.Value(0)).current;
// // // //   const timers=useRef<any[]>([]);
// // // //   const msgTimer=useRef<any>(null);
// // // //   const babyRef=useRef<View>(null);
// // // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // // //   // 1. open the level - the backend creates or resumes the session
// // // //   const load=useCallback(()=>{
// // // //     setLoadErr('');setView(null);
// // // //     startLevel7(playerId)
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

// // // //   // new stage -> close the clue popup (each stage has its own clue)
// // // //   useEffect(()=>{setClueOpen(false)},[view?.stage]);

// // // //   const flash=(m:string)=>{
// // // //     setMsg(m);clearTimeout(msgTimer.current);
// // // //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// // // //   };
// // // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// // // //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// // // //   // 2. send the player's action; the backend decides if it is right
// // // //   const act=async(kind:'tap'|'drag',item:string,target:string|undefined,at:{x:number;y:number}):Promise<boolean>=>{
// // // //     if(busy||done||!sessionId||!view)return false;
// // // //     setBusy(true);
// // // //     try{
// // // //       const res=await sendAction({sessionId,playerId,kind,item,target});
// // // //       if(!res.correct){
// // // //         play('wrong');
// // // //         setMark(at);doShake();flash(res.message);
// // // //         later(()=>setMark(null),700);
// // // //         setBusy(false);
// // // //         return false;
// // // //       }
// // // //       play('correct');
// // // //       flash(res.message);
// // // //       if(res.completed){
// // // //         setDone(true);
// // // //         setView({...view,scene:res.scene||view.scene});
// // // //         later(()=>setResult(res),1700);
// // // //       }else{
// // // //         setView({...view,...(res as any)});            // next stage comes from the server
// // // //         setBusy(false);
// // // //       }
// // // //       return true;
// // // //     }catch(e:any){
// // // //       flash(e.message||'Network error');
// // // //       setBusy(false);
// // // //       return false;
// // // //     }
// // // //   };

// // // //   const onTap=(id:string)=>{
// // // //     const h=HOT[id];
// // // //     play('tap');
// // // //     act('tap',id,undefined,{x:3+(h.x+h.w/2)*k2,y:3+(h.y+h.h/2)*k2});
// // // //   };

// // // //   // dropped somewhere: only counts when the finger is over the target
// // // //   const onDrop=(id:string,mx:number,my:number):Promise<boolean>=>new Promise(resolve=>{
// // // //     const node:any=babyRef.current;
// // // //     if(!node||!zone||!node.measureInWindow){resolve(false);return}
// // // //     node.measureInWindow((x:number,y:number,w:number,h:number)=>{
// // // //       const inside=mx>=x&&mx<=x+w&&my>=y&&my<=y+h;
// // // //       if(!inside){resolve(false);return}
// // // //       act('drag',id,view?.target||'',{x:3+(zone.x+zone.w/2)*k2,y:3+(zone.y+zone.h/2)*k2}).then(resolve);
// // // //     });
// // // //   });

// // // //   // 3. magnifier tapped -> show the clue directly (free, no hints / coins / video needed)
// // // //   const onHint=()=>{
// // // //     if(done)return;
// // // //     play('clue');
// // // //     setClueOpen(true);
// // // //   };

// // // //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// // // //   const header=(
// // // //     <View style={st.topBar}>
// // // //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={()=>{play('btn');onExit()}}>
// // // //         <Icon n="home" s={20}/>
// // // //       </TouchableOpacity>

// // // //       <View style={st.signWrap}>
// // // //         <View style={[st.rope,{left:26}]}/><View style={[st.rope,{right:26}]}/>
// // // //         <View style={st.sign}>
// // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // //           <Text style={st.signT}>LEVEL 7</Text>
// // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // //         </View>
// // // //         <View style={[st.leaf,{left:-14,transform:[{rotate:'-28deg'}]}]}/>
// // // //         <View style={[st.leaf,{right:-14,transform:[{rotate:'28deg'}]}]}/>
// // // //       </View>

// // // //       <View style={st.pill}>
// // // //         <Text style={st.pillT}>{hints}</Text>
// // // //         <Text style={st.pillIcon}>💡</Text>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   /* ---------- loading / error ---------- */

// // // //   if(loadErr||!view){
// // // //     return <Stage bg={SKY}><View style={st.root}>
// // // //       <Garden/>
// // // //       {header}
// // // //       <View style={st.centerMsg}>
// // // //         {loadErr?<>
// // // //           <Text style={st.err}>{loadErr}</Text>
// // // //           <TouchableOpacity style={st.retry} onPress={()=>{play('btn');load()}}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // //           <TouchableOpacity onPress={()=>{play('btn');onExit()}}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // //         </>:<>
// // // //           <ActivityIndicator size="large" color="#fff"/>
// // // //           <Text style={st.load}>Loading level 7...</Text>
// // // //         </>}
// // // //       </View>
// // // //     </View></Stage>;
// // // //   }

// // // //   const tap=view.mode==='tap';
// // // //   const stageNo=Math.min(3,Math.max(1,Number(view.stage)||1));

// // // //   return <Stage bg={SKY}><View style={st.root}>
// // // //     <Garden/>
// // // //     {header}

// // // //     <View style={st.center}>
// // // //       {/* question pill */}
// // // //       <View style={st.qPill}>
// // // //         <Text style={st.qArrow}>{'<'}</Text>
// // // //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// // // //         <Text style={st.qArrow}>{'>'}</Text>
// // // //       </View>

// // // //       {/* the room scene (wooden frame, leaves on top) */}
// // // //       <Animated.View style={{width:RW,height:RH,marginTop:12,transform:[{translateX:shake}]}}>
// // // //         <View style={st.panelFrame}><Room w={RW-6} mood={view.scene.mood}/></View>

// // // //         {/* drop target: the bag (stage 2) or Mia (stage 3), set by the server */}
// // // //         {!!zone&&<View ref={babyRef} collapsable={false} pointerEvents="none"
// // // //           style={{position:'absolute',left:3+zone.x*k2,top:3+zone.y*k2,width:zone.w*k2,height:zone.h*k2}}/>}

// // // //         {/* tap stage: invisible hotspots over every thing in the room */}
// // // //         {tap&&!done&&view.objects.map(o=>{
// // // //           const h=HOT[o.id];
// // // //           if(!h)return null;
// // // //           return <Pressable key={o.id} onPress={()=>onTap(o.id)}
// // // //             style={{position:'absolute',left:3+h.x*k2,top:3+h.y*k2,width:h.w*k2,height:h.h*k2,borderRadius:12}}/>;
// // // //         })}

// // // //         {done&&<View pointerEvents="none" style={{position:'absolute',left:RW/2-40,top:RH*0.3}}><Tick s={80}/></View>}
// // // //         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}><Cross/></View>}

// // // //         <View pointerEvents="none" style={[st.bLeaf,{left:6,top:-11,transform:[{rotate:'-24deg'}]}]}/>
// // // //         <View pointerEvents="none" style={[st.bLeaf,{right:6,top:-11,transform:[{rotate:'24deg'}]}]}/>
// // // //         <View pointerEvents="none" style={[st.bLeaf,{right:-6,top:-5,transform:[{rotate:'58deg'}]}]}/>
// // // //       </Animated.View>

// // // //       {/* drag stage: items to drag onto the target */}
// // // //       {!tap&&!done&&<View style={ts.row}>
// // // //         {view.tray.map(t=><DragItem key={view.stage+'-'+t.id} thing={t} disabled={busy} onDrop={onDrop}/>)}
// // // //       </View>}
// // // //     </View>

// // // //     {/* bottom wooden panel */}
// // // //     <View style={st.panel}>
// // // //       <View style={[st.screw,{left:14,top:14}]}/><View style={[st.screw,{right:14,top:14}]}/>
// // // //       <View style={[st.screw,{left:14,bottom:14}]}/><View style={[st.screw,{right:14,bottom:14}]}/>

// // // //       <View style={st.btnCol}>
// // // //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
// // // //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// // // //         </TouchableOpacity>
// // // //         <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
// // // //       </View>

// // // //       <View style={st.btnCol}>
// // // //         {/* coins / video button: the parent ONLY adds hints, it never opens the clue */}
// // // //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={()=>{play('btn');onWatchVideo&&onWatchVideo()}}>
// // // //           <Icon n="film" s={36}/>
// // // //         </TouchableOpacity>
// // // //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// // // //       </View>

// // // //       <View style={st.btnCol}>
// // // //         <View style={st.ringWhite}><View style={st.circleRed}><DoubleArrow s={32}/></View></View>
// // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// // // //       </View>
// // // //     </View>

// // // //     {/* CLUES popup (only from the magnifier, the clue of the current stage) */}
// // // //     {clueOpen&&<View style={st.overlay}>
// // // //       <View style={st.clueCard}>
// // // //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>{play('btn');setClueOpen(false)}}>
// // // //           <Text style={st.closeT}>✕</Text>
// // // //         </TouchableOpacity>
// // // //         <Text style={st.clueTitle}>CLUES</Text>

// // // //         <View style={[st.clueRow,st.clueRowOpen]}>
// // // //           <View style={st.clueNum}><Text style={st.clueNumT}>{stageNo}</Text></View>
// // // //           <View style={{flex:1}}>
// // // //             <Text style={st.clueHead}>{'Clue '+stageNo}</Text>
// // // //             <Text style={st.clueBody}>{CLUES[stageNo]}</Text>
// // // //           </View>
// // // //         </View>
// // // //       </View>
// // // //     </View>}

// // // //     {/* result card */}
// // // //     {!!result&&<View style={st.overlay}>
// // // //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // // //         <Text style={st.cardTitle}>Level complete!</Text>
// // // //         <Text style={st.cardMsg}>{result.message}</Text>
// // // //         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// // // //         <Text style={st.cardScore}>Score {result.score}</Text>
// // // //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>{play('btn');onComplete?onComplete(result):onExit()}}>
// // // //           <Text style={st.nextT}>NEXT</Text>
// // // //         </TouchableOpacity>
// // // //       </Animated.View>
// // // //     </View>}
// // // //   </View></Stage>;
// // // // }

// // // // /* tray styles */
// // // // const ts=StyleSheet.create({
// // // //   row:{flexDirection:'row',justifyContent:'center',gap:14,marginTop:16,zIndex:30,elevation:10},
// // // //   item:{width:76,height:76,borderRadius:18,backgroundColor:CREAM,borderWidth:3.5,borderColor:WOOD_D,alignItems:'center',justifyContent:'center'},
// // // // });

// // // // /* =========================================================
// // // //    STYLES  (garden theme, same as Level 5 / 6)
// // // // ========================================================= */

// // // // const st=StyleSheet.create({
// // // //   root:{flex:1,backgroundColor:SKY,overflow:'hidden'},

// // // //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// // // //   homeBtn:{width:44,height:44,borderRadius:22,backgroundColor:WOOD,borderWidth:3,borderColor:WOOD_D,alignItems:'center',justifyContent:'center',elevation:3},
// // // //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:14},
// // // //   rope:{position:'absolute',top:-2,width:5,height:20,borderRadius:2,backgroundColor:'#8a8a8a',borderWidth:1.5,borderColor:'#4d4d4d'},
// // // //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:20,height:48,borderRadius:6,backgroundColor:'#bd6b29',borderWidth:3,borderColor:WOOD_DD,elevation:3},
// // // //   signT:{fontFamily:FONT,fontSize:23,fontWeight:'900',color:'#fff',letterSpacing:0.5},
// // // //   signArrow:{fontFamily:FONT,fontSize:23,fontWeight:'900',color:'#ffc533'},
// // // //   leaf:{position:'absolute',top:0,width:30,height:14,borderRadius:8,backgroundColor:'#7fcf3f',borderWidth:1.5,borderColor:'#4c9a26'},
// // // //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:38,minWidth:84,justifyContent:'center',paddingHorizontal:14,borderRadius:19,backgroundColor:'#fff'},
// // // //   pillT:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#1b1b1b'},
// // // //   pillIcon:{fontSize:18},

// // // //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// // // //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // // //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:CREAM,borderRadius:28,borderWidth:2.5,borderColor:CREAM_BORDER,borderStyle:'dashed',paddingVertical:8,paddingHorizontal:18,maxWidth:380,elevation:3},
// // // //   qArrow:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:ARROW},
// // // //   q:{flexShrink:1,fontFamily:SERIF,fontSize:17,fontStyle:'italic',color:NAVY,textAlign:'center'},

// // // //   // room frame: keep the 3px border so the hotspot maths (k2) stays correct
// // // //   panelFrame:{borderWidth:3,borderColor:WOOD,borderRadius:16,overflow:'hidden',backgroundColor:'#eef1f4',elevation:5},
// // // //   bLeaf:{position:'absolute',width:34,height:16,borderRadius:9,backgroundColor:'#7fcf3f',borderWidth:1.5,borderColor:'#4c9a26'},

// // // //   panel:{position:'absolute',left:14,right:14,bottom:14,height:118,borderRadius:44,backgroundColor:WOOD,borderWidth:6,borderColor:WOOD_D,
// // // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8,elevation:6},
// // // //   screw:{position:'absolute',width:8,height:8,borderRadius:4,backgroundColor:WOOD_DD},
// // // //   btnCol:{alignItems:'center'},
// // // //   ringGreen:{width:64,height:64,borderRadius:32,backgroundColor:LIME_RING,alignItems:'center',justifyContent:'center'},
// // // //   circleGreen:{width:54,height:54,borderRadius:27,backgroundColor:LIME,alignItems:'center',justifyContent:'center'},
// // // //   ringWhite:{width:64,height:64,borderRadius:32,backgroundColor:'#f7ebd4',borderWidth:3,borderColor:'#fbf3e3',alignItems:'center',justifyContent:'center'},
// // // //   circleRed:{width:56,height:56,borderRadius:28,backgroundColor:RED,alignItems:'center',justifyContent:'center'},
// // // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:5,paddingHorizontal:12,height:24,borderRadius:12,backgroundColor:BADGE},
// // // //   badgeT:{fontFamily:FONT,fontSize:14,fontWeight:'900',color:'#fff'},

// // // //   clueCard:{width:'86%',maxWidth:360,backgroundColor:CREAM,borderColor:WOOD_D,borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
// // // //   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:NAVY,textAlign:'center',marginBottom:14},
// // // //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:WOOD,borderWidth:3,borderColor:WOOD_D,alignItems:'center',justifyContent:'center',zIndex:2},
// // // //   closeT:{fontSize:18,fontWeight:'900',color:'#e5383b'},
// // // //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
// // // //   clueRowOpen:{backgroundColor:'#fff',borderColor:GREEN_OK},
// // // //   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// // // //   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
// // // //   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
// // // //   clueBody:{fontFamily:SERIF,fontSize:16,fontStyle:'italic',color:NAVY,marginTop:2},

// // // //   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(10,25,60,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
// // // //   card:{width:'82%',alignItems:'center',backgroundColor:CREAM,borderWidth:8,borderColor:WOOD_D,borderRadius:28,padding:20},
// // // //   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:NAVY},
// // // //   cardMsg:{fontFamily:SERIF,fontSize:17,fontStyle:'italic',color:NAVY,textAlign:'center',marginTop:6},
// // // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:'#c0702b',marginTop:10},
// // // //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:'#8fe62d',borderWidth:4,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// // // //   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:NAVY},

// // // //   load:{fontFamily:FONT,fontSize:22,color:'#fff',marginTop:12},
// // // //   err:{fontFamily:FONT,fontSize:18,color:'#fff',textAlign:'center',paddingHorizontal:24},
// // // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:LIME,borderWidth:2.5,borderColor:'#1b1b1b'},
// // // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:'#1b1b1b'},
// // // //   back:{fontFamily:FONT,fontSize:16,color:'#fff',marginTop:14,textDecorationLine:'underline'},
// // // // });
// // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // import {View,Text,TouchableOpacity,Pressable,Animated,PanResponder,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
// // // import Svg,{Rect,Path,Circle,Ellipse,G,Polygon,Defs,LinearGradient,Stop} from 'react-native-svg';
// // // import {Stage,Coin} from './BTShared';
// // // import {Icon} from './Art';
// // // import {startLevel7,sendAction,Level7View,Level7Result,L7Thing} from './Btlevel7api';
// // // import {Room,Thing,Tick,Cross,BigStar,HOT,ROOM_W,ROOM_H} from './Btlevel7art';
// // // import {play} from './BTSound';

// // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // const SERIF:any=Platform.select({web:'"Playfair Display",Georgia,"Times New Roman",serif',ios:'Georgia-Italic',default:'serif'});

// // // /* garden palette */
// // // const NAVY='#13235b';
// // // const SKY='#5cc0f5';
// // // const CREAM='#fbf1de';
// // // const CREAM_BORDER='#ead2a4';
// // // const WOOD='#f4ab3f';
// // // const WOOD_D='#dd8a26';
// // // const WOOD_DD='#a85b1e';
// // // const PANEL='#f8b955';
// // // const PANEL_BORDER='#e0902c';
// // // const LIME='#a4e02a';
// // // const LIME_RING='#f4f1dc';
// // // const RED='#f0434d';
// // // const ARROW='#ffb629';
// // // const BADGE='#6b4423';
// // // const GREEN_OK='#3ec45a';

// // // // thickness of the wooden room frame (all hotspot / drop-zone maths uses this)
// // // const FW=9;

// // // // the clue is FREE: it never depends on hints, coins or videos.
// // // // one clue per stage (stage 1 = clock, stage 2 = timetable, stage 3 = coins)
// // // const CLUES:Record<number,string>={
// // //   1:'The right time may be hiding in the wrong place… or is the wrong time right in front of you?',
// // //   2:'Find the day that comes right after Tuesday. Look for the book with that day\'s name on it.',
// // //   3:'She already has some coins… but how many more coins does she need to buy the ticket?',
// // // };

// // // type Props={
// // //   playerId:number;
// // //   hints?:number;
// // //   setHints?:(n:number)=>void;
// // //   onExit:()=>void;
// // //   onComplete?:(result:Level7Result)=>void;
// // //   // called when the coins / video buttons are tapped. The parent should ONLY add hints here.
// // //   onWatchVideo?:()=>void;
// // // };

// // // /* =========================================================
// // //    GARDEN BACKGROUND  (ONE svg, design grid 945 x 1665)
// // //    tree + fence on the left, bookshelf on the right, green hill below
// // // ========================================================= */

// // // function Flower({x,y,s=1}:any){
// // //   return <G transform={`translate(${x} ${y}) scale(${s})`}>
// // //     {[0,72,144,216,288].map(a=><Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`}/>)}
// // //     <Circle cx="0" cy="0" r="12" fill="#ffd33d"/>
// // //   </G>;
// // // }

// // // function Tuft({x,y}:any){
// // //   return <G transform={`translate(${x} ${y})`} fill="#4fb12c">
// // //     <Polygon points="-14,0 -8,-34 -2,0"/>
// // //     <Polygon points="-4,0 4,-44 12,0"/>
// // //     <Polygon points="8,0 18,-30 24,0"/>
// // //   </G>;
// // // }

// // // function Cloud({x,y,s=1}:any){
// // //   return <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.96">
// // //     <Ellipse cx="0" cy="0" rx="80" ry="28"/>
// // //     <Ellipse cx="-24" cy="-22" rx="42" ry="30"/>
// // //     <Ellipse cx="22" cy="-30" rx="38" ry="30"/>
// // //   </G>;
// // // }

// // // function Garden(){
// // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// // //     <Svg width="100%" height="100%" viewBox="0 0 945 1665" preserveAspectRatio="xMidYMid slice">
// // //       <Defs>
// // //         <LinearGradient id="g7sky" x1="0" y1="0" x2="0" y2="1">
// // //           <Stop offset="0" stopColor="#4fc3fa"/>
// // //           <Stop offset="0.6" stopColor="#a6dffa"/>
// // //           <Stop offset="1" stopColor="#a6dffa"/>
// // //         </LinearGradient>
// // //         <LinearGradient id="g7grass" x1="0" y1="0" x2="0" y2="1">
// // //           <Stop offset="0" stopColor="#86dc45"/>
// // //           <Stop offset="1" stopColor="#62c42d"/>
// // //         </LinearGradient>
// // //       </Defs>

// // //       {/* sky */}
// // //       <Rect width="945" height="1665" fill="url(#g7sky)"/>

// // //       {/* trees in the top corners */}
// // //       <Ellipse cx="60" cy="10" rx="170" ry="80" fill="#5bc07a" opacity="0.8"/>
// // //       <Ellipse cx="120" cy="-10" rx="150" ry="70" fill="#6cc98a" opacity="0.8"/>
// // //       <Ellipse cx="880" cy="0" rx="190" ry="70" fill="#58b843"/>
// // //       <Ellipse cx="800" cy="-20" rx="140" ry="65" fill="#66c64a"/>

// // //       {/* clouds */}
// // //       <Cloud x={880} y={190} s={0.8}/>
// // //       <Cloud x={905} y={385} s={0.8}/>
// // //       <Cloud x={50} y={250} s={0.7}/>
// // //       <Cloud x={40} y={735} s={0.8}/>

// // //       {/* wooden bar (left) */}
// // //       <Rect x="0" y="308" width="175" height="22" fill="#eeb15e"/>
// // //       <Rect x="152" y="308" width="24" height="130" fill="#eeb15e"/>

// // //       {/* big tree (left) */}
// // //       <Ellipse cx="30" cy="450" rx="115" ry="125" fill="#5dbd3c"/>
// // //       <Ellipse cx="55" cy="650" rx="105" ry="85" fill="#4fb135"/>
// // //       <Rect x="0" y="690" width="48" height="130" fill="#b9793a"/>
// // //       <Rect x="8" y="690" width="12" height="130" fill="#d09050" opacity="0.7"/>
// // //       <Ellipse cx="70" cy="800" rx="95" ry="62" fill="#5fc9a6"/>

// // //       {/* wooden fence (left) */}
// // //       <Rect x="0" y="880" width="116" height="16" fill="#dca24f"/>
// // //       <Polygon points="0,990 0,832 26,800 52,832 52,990" fill="#f0b25c"/>
// // //       <Polygon points="60,990 60,832 86,800 112,832 112,990" fill="#f0b25c"/>

// // //       {/* bookshelf (right) */}
// // //       <Rect x="828" y="520" width="117" height="520" fill="#eeb15e"/>
// // //       <Rect x="842" y="545" width="103" height="480" fill="#dfa04f"/>
// // //       <Rect x="828" y="688" width="117" height="14" fill="#f4c070"/>
// // //       <Rect x="828" y="836" width="117" height="14" fill="#f4c070"/>
// // //       <Rect x="848" y="578" width="26" height="110" fill="#26c6da"/>
// // //       <Rect x="876" y="578" width="30" height="110" fill="#f8d04c"/>
// // //       <Rect x="908" y="590" width="32" height="98" fill="#a855f7"/>
// // //       <Rect x="930" y="600" width="15" height="88" fill="#ef4b4b"/>
// // //       <Rect x="848" y="745" width="28" height="92" fill="#2f5fd6"/>
// // //       <Rect x="878" y="728" width="30" height="109" fill="#34c48a"/>
// // //       <Circle cx="866" cy="892" r="17" fill="#c98a4b"/>
// // //       <Circle cx="922" cy="892" r="17" fill="#c98a4b"/>
// // //       <Ellipse cx="894" cy="925" rx="44" ry="40" fill="#c98a4b"/>

// // //       {/* green hill */}
// // //       <Path d="M0 985 C160 955 330 990 520 980 C700 970 830 950 945 965 L945 1665 L0 1665 Z" fill="url(#g7grass)"/>

// // //       {/* darker bushes behind the bottom panel */}
// // //       <Ellipse cx="40" cy="1330" rx="130" ry="85" fill="#52b233"/>
// // //       <Ellipse cx="905" cy="1330" rx="130" ry="85" fill="#52b233"/>

// // //       {/* tufts */}
// // //       <Tuft x={40} y={1190}/><Tuft x={910} y={1190}/>
// // //       <Tuft x={330} y={1250}/><Tuft x={575} y={1245}/><Tuft x={795} y={1250}/>
// // //       <Tuft x={140} y={1655}/><Tuft x={520} y={1640}/><Tuft x={840} y={1655}/>

// // //       {/* flowers */}
// // //       <Flower x={58} y={1115} s={0.85}/>
// // //       <Flower x={892} y={1115} s={0.85}/>
// // //       <Flower x={72} y={1265} s={1}/>
// // //       <Flower x={890} y={1265} s={1}/>
// // //       <Flower x={42} y={1578} s={0.9}/>
// // //       <Flower x={905} y={1575} s={0.9}/>
// // //       <Flower x={187} y={1625} s={0.95}/>
// // //       <Flower x={792} y={1622} s={0.95}/>
// // //     </Svg>
// // //   </View>;
// // // }

// // // /* double arrow (skip icon) */
// // // function DoubleArrow({s}:{s:number}){
// // //   return <Svg width={s} height={s} viewBox="0 0 100 100">
// // //     <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round"/>
// // //     <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round"/>
// // //   </Svg>;
// // // }

// // // /* purple clapperboard (video button) */
// // // function Clapper({s}:{s:number}){
// // //   return <Svg width={s} height={s} viewBox="0 0 100 100">
// // //     <Rect x="14" y="42" width="72" height="44" rx="6" fill="#8a5be0" stroke="#2b1b4a" strokeWidth="5"/>
// // //     <Polygon points="42,53 42,76 63,64.5" fill="#fff"/>
// // //     <G transform="rotate(-10 50 28)">
// // //       <Rect x="12" y="16" width="76" height="22" rx="4" fill="#2b1b4a"/>
// // //       {[0,1,2,3].map(i=>
// // //         <Polygon key={i} points={`${22+i*18},16 ${32+i*18},16 ${24+i*18},38 ${14+i*18},38`} fill="#c7a6ff"/>)}
// // //     </G>
// // //   </Svg>;
// // // }

// // // /* =========================================================
// // //    ONE DRAGGABLE ITEM IN THE TRAY (snaps back unless dropped on the target)
// // // ========================================================= */

// // // function DragItem({thing,size,onDrop,disabled}:{thing:L7Thing;size:number;onDrop:(id:string,x:number,y:number)=>Promise<boolean>;disabled:boolean}){
// // //   const xy=useRef(new Animated.ValueXY()).current;
// // //   const [lift,setLift]=useState(false);
// // //   const live=useRef({disabled,onDrop,thing});
// // //   live.current={disabled,onDrop,thing};
// // //   const back=()=>Animated.spring(xy,{toValue:{x:0,y:0},friction:6,useNativeDriver:true}).start();
// // //   const pr=useRef(PanResponder.create({
// // //     onStartShouldSetPanResponder:()=>!live.current.disabled,
// // //     onPanResponderGrant:()=>{play('drag');setLift(true);xy.setOffset({x:0,y:0});xy.setValue({x:0,y:0})},
// // //     onPanResponderMove:Animated.event([null,{dx:xy.x,dy:xy.y}],{useNativeDriver:false}),
// // //     onPanResponderRelease:async(e,g)=>{
// // //       setLift(false);
// // //       const ok=await live.current.onDrop(live.current.thing.id,g.moveX,g.moveY);
// // //       if(!ok)back();
// // //     },
// // //     onPanResponderTerminate:()=>{setLift(false);back()},
// // //   })).current;
// // //   return <Animated.View {...pr.panHandlers}
// // //     style={[ts.item,{width:size,height:size,zIndex:lift?60:1,elevation:lift?12:4,
// // //       transform:[{translateX:xy.x},{translateY:xy.y},{scale:lift?1.15:1}]}]}>
// // //     <Thing id={thing.id} size={Math.round(size*0.78)}/>
// // //   </Animated.View>;
// // // }

// // // /* =========================================================
// // //    SCREEN
// // // ========================================================= */

// // // export default function BTLevel7Screen({playerId,hints=0,onExit,onComplete,onWatchVideo}:Props){
// // //   const {width,height}=useWindowDimensions();
// // //   const RW=Math.max(240,Math.min(width*0.78,360,(height-420)*ROOM_W/ROOM_H));   // room width (incl. frame)
// // //   const k2=(RW-2*FW)/ROOM_W;                      // room units -> pixels (inside the frame)
// // //   const RH=ROOM_H*k2+2*FW;
// // //   const ITEM=Math.min(100,Math.floor((RW-32)/3)); // tray card size

// // //   const [view,setView]=useState<Level7View|null>(null);
// // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // //   const [loadErr,setLoadErr]=useState('');
// // //   const [msg,setMsg]=useState('');
// // //   const [busy,setBusy]=useState(false);
// // //   const [done,setDone]=useState(false);
// // //   const [mark,setMark]=useState<{x:number;y:number}|null>(null);
// // //   const [result,setResult]=useState<Level7Result|null>(null);
// // //   const [clueOpen,setClueOpen]=useState(false);
// // //   const zone=view&&view.target?HOT[view.target]:null;   // where the dragged thing must be dropped

// // //   const shake=useRef(new Animated.Value(0)).current;
// // //   const pop=useRef(new Animated.Value(0)).current;
// // //   const timers=useRef<any[]>([]);
// // //   const msgTimer=useRef<any>(null);
// // //   const babyRef=useRef<View>(null);
// // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // //   // 1. open the level - the backend creates or resumes the session
// // //   const load=useCallback(()=>{
// // //     setLoadErr('');setView(null);
// // //     startLevel7(playerId)
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

// // //   // new stage -> close the clue popup (each stage has its own clue)
// // //   useEffect(()=>{setClueOpen(false)},[view?.stage]);

// // //   const flash=(m:string)=>{
// // //     setMsg(m);clearTimeout(msgTimer.current);
// // //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// // //   };
// // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
// // //     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

// // //   // 2. send the player's action; the backend decides if it is right
// // //   const act=async(kind:'tap'|'drag',item:string,target:string|undefined,at:{x:number;y:number}):Promise<boolean>=>{
// // //     if(busy||done||!sessionId||!view)return false;
// // //     setBusy(true);
// // //     try{
// // //       const res=await sendAction({sessionId,playerId,kind,item,target});
// // //       if(!res.correct){
// // //         play('wrong');
// // //         setMark(at);doShake();flash(res.message);
// // //         later(()=>setMark(null),700);
// // //         setBusy(false);
// // //         return false;
// // //       }
// // //       play('correct');
// // //       flash(res.message);
// // //       if(res.completed){
// // //         setDone(true);
// // //         setView({...view,scene:res.scene||view.scene});
// // //         later(()=>setResult(res),1700);
// // //       }else{
// // //         setView({...view,...(res as any)});            // next stage comes from the server
// // //         setBusy(false);
// // //       }
// // //       return true;
// // //     }catch(e:any){
// // //       flash(e.message||'Network error');
// // //       setBusy(false);
// // //       return false;
// // //     }
// // //   };

// // //   const onTap=(id:string)=>{
// // //     const h=HOT[id];
// // //     play('tap');
// // //     act('tap',id,undefined,{x:FW+(h.x+h.w/2)*k2,y:FW+(h.y+h.h/2)*k2});
// // //   };

// // //   // dropped somewhere: only counts when the finger is over the target
// // //   const onDrop=(id:string,mx:number,my:number):Promise<boolean>=>new Promise(resolve=>{
// // //     const node:any=babyRef.current;
// // //     if(!node||!zone||!node.measureInWindow){resolve(false);return}
// // //     node.measureInWindow((x:number,y:number,w:number,h:number)=>{
// // //       const inside=mx>=x&&mx<=x+w&&my>=y&&my<=y+h;
// // //       if(!inside){resolve(false);return}
// // //       act('drag',id,view?.target||'',{x:FW+(zone.x+zone.w/2)*k2,y:FW+(zone.y+zone.h/2)*k2}).then(resolve);
// // //     });
// // //   });

// // //   // 3. magnifier tapped -> show the clue directly (free, no hints / coins / video needed)
// // //   const onHint=()=>{
// // //     if(done)return;
// // //     play('clue');
// // //     setClueOpen(true);
// // //   };

// // //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// // //   const header=(
// // //     <View style={st.topBar}>
// // //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={()=>{play('btn');onExit()}}>
// // //         <Icon n="home" s={22}/>
// // //       </TouchableOpacity>

// // //       <View style={st.signWrap}>
// // //         <View style={[st.ring,{left:24}]}/><View style={[st.ring,{right:24}]}/>
// // //         <View style={st.sign}>
// // //           <Text style={st.signArrow}>{'<'}</Text>
// // //           <Text style={st.signT}>LEVEL 7</Text>
// // //           <Text style={st.signArrow}>{'>'}</Text>
// // //         </View>
// // //         <View style={[st.leaf,{left:-14,transform:[{rotate:'-28deg'}]}]}/>
// // //         <View style={[st.leaf,{right:-14,transform:[{rotate:'28deg'}]}]}/>
// // //       </View>

// // //       <View style={st.pill}>
// // //         <Text style={st.pillT}>{hints}</Text>
// // //         <Text style={st.pillIcon}>💡</Text>
// // //       </View>
// // //     </View>
// // //   );

// // //   /* ---------- loading / error ---------- */

// // //   if(loadErr||!view){
// // //     return <Stage bg={SKY}><View style={st.root}>
// // //       <Garden/>
// // //       {header}
// // //       <View style={st.centerMsg}>
// // //         {loadErr?<>
// // //           <Text style={st.err}>{loadErr}</Text>
// // //           <TouchableOpacity style={st.retry} onPress={()=>{play('btn');load()}}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // //           <TouchableOpacity onPress={()=>{play('btn');onExit()}}><Text style={st.back}>Back</Text></TouchableOpacity>
// // //         </>:<>
// // //           <ActivityIndicator size="large" color="#fff"/>
// // //           <Text style={st.load}>Loading level 7...</Text>
// // //         </>}
// // //       </View>
// // //     </View></Stage>;
// // //   }

// // //   const tap=view.mode==='tap';
// // //   const stageNo=Math.min(3,Math.max(1,Number(view.stage)||1));

// // //   return <Stage bg={SKY}><View style={st.root}>
// // //     <Garden/>
// // //     {header}

// // //     <View style={st.center}>
// // //       {/* question pill */}
// // //       <View style={[st.qPill,{maxWidth:Math.min(width-48,350)}]}>
// // //         <Text style={st.qArrow}>{'<'}</Text>
// // //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// // //         <Text style={st.qArrow}>{'>'}</Text>
// // //       </View>

// // //       {/* the room scene (thick wooden frame) */}
// // //       <Animated.View style={{width:RW,height:RH,marginTop:12,transform:[{translateX:shake}]}}>
// // //         <View style={st.panelFrame}>
// // //           <Room w={RW-2*FW} mood={view.scene.mood}/>
// // //           <View pointerEvents="none" style={st.frameInner}/>
// // //         </View>

// // //         {/* drop target: the bag (stage 2) or Mia (stage 3), set by the server */}
// // //         {!!zone&&<View ref={babyRef} collapsable={false} pointerEvents="none"
// // //           style={{position:'absolute',left:FW+zone.x*k2,top:FW+zone.y*k2,width:zone.w*k2,height:zone.h*k2}}/>}

// // //         {/* tap stage: invisible hotspots over every thing in the room */}
// // //         {tap&&!done&&view.objects.map(o=>{
// // //           const h=HOT[o.id];
// // //           if(!h)return null;
// // //           return <Pressable key={o.id} onPress={()=>onTap(o.id)}
// // //             style={{position:'absolute',left:FW+h.x*k2,top:FW+h.y*k2,width:h.w*k2,height:h.h*k2,borderRadius:12}}/>;
// // //         })}

// // //         {done&&<View pointerEvents="none" style={{position:'absolute',left:RW/2-40,top:RH*0.3}}><Tick s={80}/></View>}
// // //         {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}><Cross/></View>}
// // //       </Animated.View>

// // //       {/* drag stage: items to drag onto the target */}
// // //       {!tap&&!done&&<View style={[ts.row,{width:RW}]}>
// // //         {view.tray.map(t=><DragItem key={view.stage+'-'+t.id} thing={t} size={ITEM} disabled={busy} onDrop={onDrop}/>)}
// // //       </View>}
// // //     </View>

// // //     {/* bottom wooden panel */}
// // //     <View style={st.panel}>
// // //       <View style={[st.screw,{left:16,top:16}]}/><View style={[st.screw,{right:16,top:16}]}/>
// // //       <View style={[st.screw,{left:16,bottom:16}]}/><View style={[st.screw,{right:16,bottom:16}]}/>

// // //       <View style={st.btnCol}>
// // //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
// // //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// // //         </TouchableOpacity>
// // //         <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
// // //       </View>

// // //       <View style={st.btnCol}>
// // //         {/* coins / video button: the parent ONLY adds hints, it never opens the clue */}
// // //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={()=>{play('btn');onWatchVideo&&onWatchVideo()}}>
// // //           <Clapper s={42}/>
// // //         </TouchableOpacity>
// // //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// // //       </View>

// // //       <View style={st.btnCol}>
// // //         <View style={st.ringWhite}><View style={st.circleRed}><DoubleArrow s={32}/></View></View>
// // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// // //       </View>
// // //     </View>

// // //     {/* CLUES popup (only from the magnifier, the clue of the current stage) */}
// // //     {clueOpen&&<View style={st.overlay}>
// // //       <View style={st.clueCard}>
// // //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>{play('btn');setClueOpen(false)}}>
// // //           <Text style={st.closeT}>✕</Text>
// // //         </TouchableOpacity>
// // //         <Text style={st.clueTitle}>CLUES</Text>

// // //         <View style={[st.clueRow,st.clueRowOpen]}>
// // //           <View style={st.clueNum}><Text style={st.clueNumT}>{stageNo}</Text></View>
// // //           <View style={{flex:1}}>
// // //             <Text style={st.clueHead}>{'Clue '+stageNo}</Text>
// // //             <Text style={st.clueBody}>{CLUES[stageNo]}</Text>
// // //           </View>
// // //         </View>
// // //       </View>
// // //     </View>}

// // //     {/* result card */}
// // //     {!!result&&<View style={st.overlay}>
// // //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // //         <Text style={st.cardTitle}>Level complete!</Text>
// // //         <Text style={st.cardMsg}>{result.message}</Text>
// // //         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// // //         <Text style={st.cardScore}>Score {result.score}</Text>
// // //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>{play('btn');onComplete?onComplete(result):onExit()}}>
// // //           <Text style={st.nextT}>NEXT</Text>
// // //         </TouchableOpacity>
// // //       </Animated.View>
// // //     </View>}
// // //   </View></Stage>;
// // // }

// // // /* tray styles (cream cards with a thick orange edge and a bottom shadow) */
// // // const ts=StyleSheet.create({
// // //   row:{flexDirection:'row',justifyContent:'center',gap:16,marginTop:16,zIndex:30,elevation:10},
// // //   item:{borderRadius:26,backgroundColor:CREAM,borderWidth:5,borderColor:WOOD,alignItems:'center',justifyContent:'center',
// // //     shadowColor:WOOD_D,shadowOffset:{width:0,height:5},shadowOpacity:1,shadowRadius:0},
// // // });

// // // /* =========================================================
// // //    STYLES  (garden theme)
// // // ========================================================= */

// // // const st=StyleSheet.create({
// // //   root:{flex:1,backgroundColor:SKY,overflow:'hidden'},

// // //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// // //   homeBtn:{width:52,height:52,borderRadius:26,backgroundColor:WOOD,borderWidth:3.5,borderColor:WOOD_D,alignItems:'center',justifyContent:'center',elevation:3},
// // //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:14},
// // //   ring:{position:'absolute',top:-4,width:11,height:20,borderRadius:6,borderWidth:3,borderColor:'#d9962f',backgroundColor:'transparent'},
// // //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:20,height:48,borderRadius:8,backgroundColor:'#c8782f',borderWidth:3.5,borderColor:WOOD_DD,elevation:3},
// // //   signT:{fontFamily:FONT,fontSize:23,fontWeight:'900',color:'#fff',letterSpacing:0.5},
// // //   signArrow:{fontFamily:FONT,fontSize:23,fontWeight:'900',color:'#ffc533'},
// // //   leaf:{position:'absolute',top:0,width:30,height:14,borderRadius:8,backgroundColor:'#7fcf3f',borderWidth:1.5,borderColor:'#4c9a26'},
// // //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:40,minWidth:100,justifyContent:'center',paddingHorizontal:14,borderRadius:20,backgroundColor:'#fff',elevation:2},
// // //   pillT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:'#1b1b1b'},
// // //   pillIcon:{fontSize:20},

// // //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// // //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:CREAM,borderRadius:30,borderWidth:2.5,borderColor:CREAM_BORDER,borderStyle:'dashed',paddingVertical:10,paddingHorizontal:18,elevation:3},
// // //   qArrow:{fontFamily:FONT,fontSize:24,fontWeight:'900',color:ARROW},
// // //   q:{flexShrink:1,fontFamily:SERIF,fontSize:17,fontStyle:'italic',color:NAVY,textAlign:'center'},

// // //   // thick wooden room frame (border = FW, so the hotspot maths stays correct)
// // //   panelFrame:{borderWidth:FW,borderColor:WOOD,borderRadius:26,overflow:'hidden',backgroundColor:'#eef1f4',elevation:5},
// // //   frameInner:{...StyleSheet.absoluteFillObject,borderWidth:2,borderColor:'rgba(168,91,30,0.55)',borderRadius:16},

// // //   panel:{position:'absolute',left:20,right:20,bottom:14,height:124,borderRadius:52,backgroundColor:PANEL,borderWidth:7,borderColor:PANEL_BORDER,
// // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:10,elevation:6},
// // //   screw:{position:'absolute',width:8,height:8,borderRadius:4,backgroundColor:WOOD_DD},
// // //   btnCol:{alignItems:'center'},
// // //   ringGreen:{width:66,height:66,borderRadius:33,backgroundColor:LIME_RING,alignItems:'center',justifyContent:'center'},
// // //   circleGreen:{width:56,height:56,borderRadius:28,backgroundColor:LIME,alignItems:'center',justifyContent:'center'},
// // //   ringWhite:{width:66,height:66,borderRadius:33,backgroundColor:'#f7ebd4',borderWidth:3,borderColor:'#fbf3e3',alignItems:'center',justifyContent:'center'},
// // //   circleRed:{width:58,height:58,borderRadius:29,backgroundColor:RED,alignItems:'center',justifyContent:'center'},
// // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:5,paddingHorizontal:12,height:24,borderRadius:12,backgroundColor:BADGE},
// // //   badgeT:{fontFamily:FONT,fontSize:14,fontWeight:'900',color:'#fff'},

// // //   clueCard:{width:'86%',maxWidth:360,backgroundColor:CREAM,borderColor:WOOD_D,borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
// // //   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:NAVY,textAlign:'center',marginBottom:14},
// // //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:WOOD,borderWidth:3,borderColor:WOOD_D,alignItems:'center',justifyContent:'center',zIndex:2},
// // //   closeT:{fontSize:18,fontWeight:'900',color:'#e5383b'},
// // //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
// // //   clueRowOpen:{backgroundColor:'#fff',borderColor:GREEN_OK},
// // //   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// // //   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
// // //   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
// // //   clueBody:{fontFamily:SERIF,fontSize:16,fontStyle:'italic',color:NAVY,marginTop:2},

// // //   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(10,25,60,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
// // //   card:{width:'82%',alignItems:'center',backgroundColor:CREAM,borderWidth:8,borderColor:WOOD_D,borderRadius:28,padding:20},
// // //   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:NAVY},
// // //   cardMsg:{fontFamily:SERIF,fontSize:17,fontStyle:'italic',color:NAVY,textAlign:'center',marginTop:6},
// // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:'#c0702b',marginTop:10},
// // //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:'#8fe62d',borderWidth:4,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// // //   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:NAVY},

// // //   load:{fontFamily:FONT,fontSize:22,color:'#fff',marginTop:12},
// // //   err:{fontFamily:FONT,fontSize:18,color:'#fff',textAlign:'center',paddingHorizontal:24},
// // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:LIME,borderWidth:2.5,borderColor:'#1b1b1b'},
// // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:'#1b1b1b'},
// // //   back:{fontFamily:FONT,fontSize:16,color:'#fff',marginTop:14,textDecorationLine:'underline'},
// // // });
// // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // import {
// //   View, Text, TouchableOpacity, Pressable, Animated, Easing, PanResponder, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
// // } from 'react-native';
// // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // import { Stage, F, Coin } from './BTShared';
// // import { Icon } from './Art';
// // import { startLevel7, sendAction, Level7View, Level7Result, L7Thing } from './Btlevel7api';
// // import { Room, Thing, Tick, Cross, BigStar, HOT, ROOM_W, ROOM_H } from './Btlevel7art';
// // import { play } from './BTSound';

// // const FONT: any = F;
// // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// // /* garden palette (same as Level 3 / 4 / 5 / 6) */
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

// // // thickness of the wooden room frame (all hotspot / drop-zone maths uses this)
// // const FW = 9;

// // // the clue is FREE: it never depends on hints, coins or videos.
// // // one clue per stage (stage 1 = clock, stage 2 = timetable, stage 3 = coins)
// // const CLUES: Record<number, string> = {
// //   1: 'The right time may be hiding in the wrong place… or is the wrong time right in front of you?',
// //   2: 'Find the day that comes right after Tuesday. Look for the book with that day\'s name on it.',
// //   3: 'She already has some coins… but how many more coins does she need to buy the ticket?',
// // };

// // type Props = {
// //   playerId: number;
// //   hints?: number;
// //   setHints?: (n: number) => void;
// //   onExit: () => void;
// //   onComplete?: (result: Level7Result) => void;
// //   // called when the coins / video buttons are tapped. The parent should ONLY add hints here.
// //   onWatchVideo?: () => void;
// // };

// // /* ---------- garden background ---------- */
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

// // /* sprout friend (same as Level 3), local coords: body at 0..120 x 55..133 */
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
// //       {/* full-height sky (stretches to any screen, so no plain blue strip anywhere) */}
// //       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
// //         <Defs>
// //           <LinearGradient id="g4sky" x1="0" y1="0" x2="0" y2="1">
// //             <Stop offset="0" stopColor="#46b6f3" />
// //             <Stop offset="1" stopColor="#c2e8fb" />
// //           </LinearGradient>
// //         </Defs>
// //         <Rect width="10" height="10" fill="url(#g4sky)" />
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

// //       {/* ground (Level 3 scene), pinned to the bottom: hills, fence, bookshelf, sprout, meadow to the very edge */}
// //       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
// //         <Svg width="100%" height="100%" viewBox="0 0 942 1269">
// //           {/* clouds */}
// //           <Cloud x={50} y={585} s={0.9} />
// //           <Cloud x={880} y={600} s={0.6} />

// //           {/* rolling hills */}
// //           <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
// //           <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
// //           <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

// //           {/* fence: pickets first, rails in front */}
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

// //           {/* bookshelf (right) with potted plant */}
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

// //           {/* sprout friend (left) */}
// //           <Sprout x={10} y={740} s={1} />

// //           {/* front meadow, runs to the bottom edge */}
// //           <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
// //           <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

// //           {/* stones */}
// //           <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// //           <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
// //           <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// //           <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

// //           {/* grass tufts + flowers */}
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

// // /* ---------- thin link chain for the hanging sign (same as Level 3) ---------- */
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

// // /* ---------- double arrow (skip icon, same as Level 3) ---------- */
// // function DoubleArrow({ s }: { s: number }) {
// //   return (
// //     <Svg width={s} height={s} viewBox="0 0 100 100">
// //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// //     </Svg>
// //   );
// // }

// // /* =========================================================
// //    ONE DRAGGABLE ITEM IN THE TRAY (snaps back unless dropped on the target)
// // ========================================================= */

// // function DragItem({ thing, size, onDrop, disabled }: { thing: L7Thing; size: number; onDrop: (id: string, x: number, y: number) => Promise<boolean>; disabled: boolean }) {
// //   const xy = useRef(new Animated.ValueXY()).current;
// //   const [lift, setLift] = useState(false);
// //   const live = useRef({ disabled, onDrop, thing });
// //   live.current = { disabled, onDrop, thing };
// //   const back = () => Animated.spring(xy, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: true }).start();
// //   const pr = useRef(PanResponder.create({
// //     onStartShouldSetPanResponder: () => !live.current.disabled,
// //     onPanResponderGrant: () => { play('drag'); setLift(true); xy.setOffset({ x: 0, y: 0 }); xy.setValue({ x: 0, y: 0 }); },
// //     onPanResponderMove: Animated.event([null, { dx: xy.x, dy: xy.y }], { useNativeDriver: false }),
// //     onPanResponderRelease: async (e, g) => {
// //       setLift(false);
// //       const ok = await live.current.onDrop(live.current.thing.id, g.moveX, g.moveY);
// //       if (!ok) back();
// //     },
// //     onPanResponderTerminate: () => { setLift(false); back(); },
// //   })).current;
// //   return (
// //     <Animated.View {...pr.panHandlers}
// //       style={[ts.item, {
// //         width: size, height: size, zIndex: lift ? 60 : 1, elevation: lift ? 12 : 4,
// //         transform: [{ translateX: xy.x }, { translateY: xy.y }, { scale: lift ? 1.15 : 1 }],
// //       }]}>
// //       <Thing id={thing.id} size={Math.round(size * 0.78)} />
// //     </Animated.View>
// //   );
// // }

// // /* =========================================================
// //    SCREEN
// // ========================================================= */

// // export default function BTLevel7Screen({ playerId, hints = 0, onExit, onComplete, onWatchVideo }: Props) {
// //   const { width, height } = useWindowDimensions();
// //   const RW = Math.max(240, Math.min(width * 0.78, 360, ((height - 470) * ROOM_W) / ROOM_H)); // room width (incl. frame)
// //   const k2 = (RW - 2 * FW) / ROOM_W; // room units -> pixels (inside the frame)
// //   const RH = ROOM_H * k2 + 2 * FW;
// //   const ITEM = Math.min(100, Math.floor((RW - 32) / 3)); // tray card size

// //   const [view, setView] = useState<Level7View | null>(null);
// //   const [sessionId, setSessionId] = useState<number | null>(null);
// //   const [loadErr, setLoadErr] = useState('');
// //   const [msg, setMsg] = useState('');
// //   const [busy, setBusy] = useState(false);
// //   const [done, setDone] = useState(false);
// //   const [mark, setMark] = useState<{ x: number; y: number } | null>(null);
// //   const [result, setResult] = useState<Level7Result | null>(null);
// //   const [clueOpen, setClueOpen] = useState(false);
// //   const zone = view && view.target ? HOT[view.target] : null; // where the dragged thing must be dropped

// //   const shake = useRef(new Animated.Value(0)).current;
// //   const pop = useRef(new Animated.Value(0)).current;
// //   const sway = useRef(new Animated.Value(0)).current;
// //   const timers = useRef<any[]>([]);
// //   const msgTimer = useRef<any>(null);
// //   const babyRef = useRef<View>(null);
// //   const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

// //   // hanging sign sways gently (same as Level 3 - 6)
// //   useEffect(() => {
// //     const a = Animated.loop(Animated.sequence([
// //       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //     ]));
// //     a.start();
// //     return () => a.stop();
// //   }, [sway]);
// //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// //   // 1. open the level - the backend creates or resumes the session
// //   const load = useCallback(() => {
// //     setLoadErr(''); setView(null);
// //     startLevel7(playerId)
// //       .then((v) => { setSessionId(v.sessionId as number); setView(v); })
// //       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
// //   }, [playerId]);

// //   useEffect(() => {
// //     load();
// //     return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
// //   }, [load]);

// //   useEffect(() => {
// //     if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
// //   }, [result]);

// //   // new stage -> close the clue popup (each stage has its own clue)
// //   useEffect(() => { setClueOpen(false); }, [view?.stage]);

// //   const flash = (m: string) => {
// //     setMsg(m); clearTimeout(msgTimer.current);
// //     msgTimer.current = setTimeout(() => setMsg(''), 2800);
// //   };
// //   const doShake = () => Animated.sequence([10, -10, 6, -6, 0].map((v) =>
// //     Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

// //   // 2. send the player's action; the backend decides if it is right
// //   const act = async (kind: 'tap' | 'drag', item: string, target: string | undefined, at: { x: number; y: number }): Promise<boolean> => {
// //     if (busy || done || !sessionId || !view) return false;
// //     setBusy(true);
// //     try {
// //       const res = await sendAction({ sessionId, playerId, kind, item, target });
// //       if (!res.correct) {
// //         play('wrong');
// //         setMark(at); doShake(); flash(res.message);
// //         later(() => setMark(null), 700);
// //         setBusy(false);
// //         return false;
// //       }
// //       play('correct');
// //       flash(res.message);
// //       if (res.completed) {
// //         setDone(true);
// //         setView({ ...view, scene: res.scene || view.scene });
// //         later(() => setResult(res), 1700);
// //       } else {
// //         setView({ ...view, ...(res as any) }); // next stage comes from the server
// //         setBusy(false);
// //       }
// //       return true;
// //     } catch (e: any) {
// //       flash(e.message || 'Network error');
// //       setBusy(false);
// //       return false;
// //     }
// //   };

// //   const onTap = (id: string) => {
// //     const h = HOT[id];
// //     play('tap');
// //     act('tap', id, undefined, { x: FW + (h.x + h.w / 2) * k2, y: FW + (h.y + h.h / 2) * k2 });
// //   };

// //   // dropped somewhere: only counts when the finger is over the target
// //   const onDrop = (id: string, mx: number, my: number): Promise<boolean> => new Promise((resolve) => {
// //     const node: any = babyRef.current;
// //     if (!node || !zone || !node.measureInWindow) { resolve(false); return; }
// //     node.measureInWindow((x: number, y: number, w: number, h: number) => {
// //       const inside = mx >= x && mx <= x + w && my >= y && my <= y + h;
// //       if (!inside) { resolve(false); return; }
// //       act('drag', id, view?.target || '', { x: FW + (zone.x + zone.w / 2) * k2, y: FW + (zone.y + zone.h / 2) * k2 }).then(resolve);
// //     });
// //   });

// //   // 3. magnifier tapped -> show the clue directly (free, no hints / coins / video needed)
// //   const onHint = () => {
// //     if (done) return;
// //     play('clue');
// //     setClueOpen(true);
// //   };

// //   /* ---------- header (same as Level 4 / 5 / 6) ---------- */
// //   const header = (
// //     <View style={st.topBar}>
// //       <View style={st.leftBtns}>
// //         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
// //           <Icon n="home" s={20} />
// //         </TouchableOpacity>
// //         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
// //           <Icon n="gear" s={21} />
// //         </TouchableOpacity>
// //       </View>

// //       <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
// //         <Chain h={30} style={{ left: 24, top: -6 }} />
// //         <Chain h={30} style={{ right: 24, top: -6 }} />
// //         <View style={st.sign}>
// //           <Text style={st.signArrow}>{'<'}</Text>
// //           <Text style={st.signT}>LEVEL 7</Text>
// //           <Text style={st.signArrow}>{'>'}</Text>
// //         </View>
// //       </Animated.View>

// //       <View style={st.pillWrap}>
// //         <View style={st.pill}>
// //           <Text style={st.pillT}>{hints}</Text>
// //         </View>
// //         <View style={st.pillIcon}>
// //           <Icon n="bulb" s={34} />
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   /* ---------- loading / error ---------- */
// //   if (loadErr || !view) {
// //     return (
// //       <Stage bg={SKY}>
// //         <View style={st.root}>
// //           <Garden />
// //           {header}
// //           <View style={st.centerMsg}>
// //             {loadErr ? (
// //               <>
// //                 <Text style={st.err}>{loadErr}</Text>
// //                 <TouchableOpacity style={st.retry} onPress={() => { play('btn'); load(); }}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// //                 <TouchableOpacity onPress={() => { play('btn'); onExit(); }}><Text style={st.back}>Back</Text></TouchableOpacity>
// //               </>
// //             ) : (
// //               <>
// //                 <ActivityIndicator size="large" color="#fff" />
// //                 <Text style={st.load}>Loading level 7...</Text>
// //               </>
// //             )}
// //           </View>
// //         </View>
// //       </Stage>
// //     );
// //   }

// //   const tap = view.mode === 'tap';
// //   const stageNo = Math.min(3, Math.max(1, Number(view.stage) || 1));

// //   return (
// //     <Stage bg={SKY}>
// //       <View style={st.root}>
// //         <Garden />
// //         {header}

// //         <View style={st.center}>
// //           {/* question pill */}
// //           <View style={[st.qPill, { maxWidth: Math.min(width - 48, 350) }]}>
// //             <Text style={st.qArrow}>{'<'}</Text>
// //             <Text style={[st.q, msg ? { color: '#c0392b' } : null]}>{msg || view.title}</Text>
// //             <Text style={st.qArrow}>{'>'}</Text>
// //           </View>

// //           {/* the room scene (thick wooden frame) */}
// //           <Animated.View style={{ width: RW, height: RH, marginTop: 12, transform: [{ translateX: shake }] }}>
// //             <View style={st.panelFrame}>
// //               <Room w={RW - 2 * FW} mood={view.scene.mood} />
// //               <View pointerEvents="none" style={st.frameInner} />
// //             </View>

// //             {/* drop target: the bag (stage 2) or Mia (stage 3), set by the server */}
// //             {!!zone && <View ref={babyRef} collapsable={false} pointerEvents="none"
// //               style={{ position: 'absolute', left: FW + zone.x * k2, top: FW + zone.y * k2, width: zone.w * k2, height: zone.h * k2 }} />}

// //             {/* tap stage: invisible hotspots over every thing in the room */}
// //             {tap && !done && view.objects.map((o) => {
// //               const h = HOT[o.id];
// //               if (!h) return null;
// //               return <Pressable key={o.id} onPress={() => onTap(o.id)}
// //                 style={{ position: 'absolute', left: FW + h.x * k2, top: FW + h.y * k2, width: h.w * k2, height: h.h * k2, borderRadius: 12 }} />;
// //             })}

// //             {done && <View pointerEvents="none" style={{ position: 'absolute', left: RW / 2 - 40, top: RH * 0.3 }}><Tick s={80} /></View>}
// //             {mark && <View pointerEvents="none" style={{ position: 'absolute', left: mark.x - 23, top: mark.y - 23, zIndex: 20 }}><Cross /></View>}
// //           </Animated.View>

// //           {/* drag stage: items to drag onto the target */}
// //           {!tap && !done && (
// //             <View style={[ts.row, { width: RW }]}>
// //               {view.tray.map((t) => <DragItem key={view.stage + '-' + t.id} thing={t} size={ITEM} disabled={busy} onDrop={onDrop} />)}
// //             </View>
// //           )}
// //         </View>

// //         {/* bottom wooden panel (same as Level 3 - 6) */}
// //         <View style={st.panel}>
// //           <View style={[st.plank, { top: 18, left: 34, right: 34 }]} />
// //           <View style={[st.plank, { top: 76, left: 26, right: 26 }]} />
// //           <View style={[st.plank, { bottom: 16, left: 34, right: 34 }]} />
// //           <View style={[st.screw, { left: 16, top: 16 }]} />
// //           <View style={[st.screw, { right: 16, top: 16 }]} />
// //           <View style={[st.screw, { left: 16, bottom: 16 }]} />
// //           <View style={[st.screw, { right: 16, bottom: 16 }]} />

// //           <View style={st.btnCol}>
// //             <TouchableOpacity style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={onHint}>
// //               <Icon n="search" s={40} />
// //             </TouchableOpacity>
// //             <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
// //           </View>

// //           <View style={st.btnCol}>
// //             {/* coins / video button: the parent ONLY adds hints, it never opens the clue */}
// //             <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={() => { play('btn'); onWatchVideo && onWatchVideo(); }}>
// //               <Icon n="film" s={46} />
// //             </TouchableOpacity>
// //             <View style={st.badge}><Coin s={15} /><Text style={st.badgeT}>+75</Text></View>
// //           </View>

// //           <View style={st.btnCol}>
// //             <View style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]}>
// //               <DoubleArrow s={42} />
// //             </View>
// //             <View style={st.badge}><Icon n="bulb" s={19} /><Text style={st.badgeT}>50</Text></View>
// //           </View>
// //         </View>

// //         {/* CLUES popup (only from the magnifier, the clue of the current stage) */}
// //         {clueOpen && (
// //           <View style={st.overlay}>
// //             <View style={st.clueCard}>
// //               <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
// //                 <Icon n="cross" s={20} />
// //               </TouchableOpacity>
// //               <Text style={st.clueTitle}>CLUES</Text>

// //               <View style={[st.clueRow, st.clueRowOpen]}>
// //                 <View style={st.clueNum}><Text style={st.clueNumT}>{stageNo}</Text></View>
// //                 <View style={{ flex: 1 }}>
// //                   <Text style={st.clueHead}>{'Clue ' + stageNo}</Text>
// //                   <Text style={st.clueBody}>{CLUES[stageNo]}</Text>
// //                 </View>
// //               </View>
// //             </View>
// //           </View>
// //         )}

// //         {/* result card */}
// //         {!!result && (
// //           <View style={st.overlay}>
// //             <Animated.View style={[st.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
// //               <Text style={st.cardTitle}>Level complete!</Text>
// //               <Text style={st.cardMsg}>{result.message}</Text>
// //               <View style={st.stars}>{[1, 2, 3].map((n) => <BigStar key={n} s={46} on={n <= (result.stars || 0)} />)}</View>
// //               <Text style={st.cardScore}>Score {result.score}</Text>
// //               <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={() => { play('btn'); onComplete ? onComplete(result) : onExit(); }}>
// //                 <Text style={st.nextT}>NEXT</Text>
// //               </TouchableOpacity>
// //             </Animated.View>
// //           </View>
// //         )}
// //       </View>
// //     </Stage>
// //   );
// // }

// // /* tray styles (cream cards with a thick orange edge and a bottom shadow) */
// // const ts = StyleSheet.create({
// //   row: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 16, zIndex: 30, elevation: 10 },
// //   item: {
// //     borderRadius: 26, backgroundColor: CREAM, borderWidth: 5, borderColor: WOOD, alignItems: 'center', justifyContent: 'center',
// //     shadowColor: WOOD_D, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 0,
// //   },
// // });

// // /* =========================================================
// //    STYLES  (garden theme, same as Level 5)
// // ========================================================= */

// // const st = StyleSheet.create({
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
// //   qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, elevation: 3 },
// //   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
// //   q: { flexShrink: 1, fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

// //   // thick wooden room frame (border = FW, so the hotspot maths stays correct)
// //   panelFrame: { borderWidth: FW, borderColor: WOOD, borderRadius: 26, overflow: 'hidden', backgroundColor: '#eef1f4', elevation: 5 },
// //   frameInner: { ...StyleSheet.absoluteFillObject, borderWidth: 2, borderColor: 'rgba(143,90,31,0.55)', borderRadius: 16 },

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
// //   clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12 },
// //   clueRowOpen: { backgroundColor: '#fff', borderColor: GREEN_OK },
// //   clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
// //   clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
// //   clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
// //   clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },

// //   overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
// //   card: { width: '82%', alignItems: 'center', backgroundColor: CREAM, borderWidth: 8, borderColor: WOOD_D, borderRadius: 28, padding: 20 },
// //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: NAVY },
// //   cardMsg: { fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center', marginTop: 6 },
// //   stars: { flexDirection: 'row', gap: 6, marginTop: 14 },
// //   cardScore: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#bd6b29', marginTop: 10 },
// //   next: { marginTop: 18, minWidth: 170, height: 56, borderRadius: 28, backgroundColor: '#8fe62d', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center' },
// //   nextT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },

// //   load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
// //   err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
// //   retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
// //   back: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },
// // });
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, Pressable, Animated, Easing, PanResponder, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
// } from 'react-native';
// import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// import { Stage, F, Coin } from './BTShared';
// import { Icon } from './Art';
// import { startLevel7, sendAction, hintLevel7, Level7View, Level7Result, L7Thing } from './Btlevel7api';
// import { Room, Thing, Tick, Cross, BigStar, HOT, ROOM_W, ROOM_H } from './Btlevel7art';
// import { play } from './BTSound';

// const FONT: any = F;
// const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// /* garden palette (same as Level 3 / 4 / 5 / 6) */
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

// // thickness of the wooden room frame (all hotspot / drop-zone maths uses this)
// const FW = 9;

// // must match HINT_COST in the backend (the backend is the one that really charges)
// const HINT_COST = 25;

// type Props = {
//   playerId: number;
//   hints?: number;
//   setHints?: (n: number) => void;
//   onExit: () => void;
//   onComplete?: (result: Level7Result) => void;
//   // called when the coins / video buttons are tapped. The parent should ONLY add hints here.
//   onWatchVideo?: () => void;
// };

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

// /* =========================================================
//    ONE DRAGGABLE ITEM IN THE TRAY (snaps back unless dropped on the target)
// ========================================================= */

// function DragItem({ thing, size, onDrop, disabled }: { thing: L7Thing; size: number; onDrop: (id: string, x: number, y: number) => Promise<boolean>; disabled: boolean }) {
//   const xy = useRef(new Animated.ValueXY()).current;
//   const [lift, setLift] = useState(false);
//   const live = useRef({ disabled, onDrop, thing });
//   live.current = { disabled, onDrop, thing };
//   const back = () => Animated.spring(xy, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: true }).start();
//   const pr = useRef(PanResponder.create({
//     onStartShouldSetPanResponder: () => !live.current.disabled,
//     onPanResponderGrant: () => { play('drag'); setLift(true); xy.setOffset({ x: 0, y: 0 }); xy.setValue({ x: 0, y: 0 }); },
//     onPanResponderMove: Animated.event([null, { dx: xy.x, dy: xy.y }], { useNativeDriver: false }),
//     onPanResponderRelease: async (e, g) => {
//       setLift(false);
//       const ok = await live.current.onDrop(live.current.thing.id, g.moveX, g.moveY);
//       if (!ok) back();
//     },
//     onPanResponderTerminate: () => { setLift(false); back(); },
//   })).current;
//   return (
//     <Animated.View {...pr.panHandlers}
//       style={[ts.item, {
//         width: size, height: size, zIndex: lift ? 60 : 1, elevation: lift ? 12 : 4,
//         transform: [{ translateX: xy.x }, { translateY: xy.y }, { scale: lift ? 1.15 : 1 }],
//       }]}>
//       <Thing id={thing.id} size={Math.round(size * 0.78)} />
//     </Animated.View>
//   );
// }

// /* =========================================================
//    SCREEN
// ========================================================= */

// export default function BTLevel7Screen({ playerId, hints = 0, setHints, onExit, onComplete, onWatchVideo }: Props) {
//   const { width, height } = useWindowDimensions();
//   const RW = Math.max(240, Math.min(width * 0.78, 360, ((height - 440) * ROOM_W) / ROOM_H)); // room width (incl. frame)
//   const k2 = (RW - 2 * FW) / ROOM_W; // room units -> pixels (inside the frame)
//   const RH = ROOM_H * k2 + 2 * FW;
//   const ITEM = Math.min(100, Math.floor((RW - 32) / 3)); // tray card size

//   const [view, setView] = useState<Level7View | null>(null);
//   const [sessionId, setSessionId] = useState<number | null>(null);
//   const [loadErr, setLoadErr] = useState('');
//   const [msg, setMsg] = useState('');
//   const [busy, setBusy] = useState(false);
//   const [done, setDone] = useState(false);
//   const [mark, setMark] = useState<{ x: number; y: number } | null>(null);
//   const [result, setResult] = useState<Level7Result | null>(null);
//   const [clueOpen, setClueOpen] = useState(false);
//   const [clueUsed, setClueUsed] = useState(false); // the backend says this stage's clue was already bought
//   const [clueText, setClueText] = useState('');    // clue text comes from the backend
//   const zone = view && view.target ? HOT[view.target] : null; // where the dragged thing must be dropped

//   const shake = useRef(new Animated.Value(0)).current;
//   const pop = useRef(new Animated.Value(0)).current;
//   const sway = useRef(new Animated.Value(0)).current;
//   const timers = useRef<any[]>([]);
//   const msgTimer = useRef<any>(null);
//   const babyRef = useRef<View>(null);
//   const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

//   // hanging sign sways gently (same as Level 3 - 6)
//   useEffect(() => {
//     const a = Animated.loop(Animated.sequence([
//       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//     ]));
//     a.start();
//     return () => a.stop();
//   }, [sway]);
//   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

//   // 1. open the level - the backend creates or resumes the session
//   const load = useCallback(() => {
//     setLoadErr(''); setView(null);
//     startLevel7(playerId)
//       .then((v) => { setSessionId(v.sessionId as number); setView(v); })
//       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
//   }, [playerId]);

//   useEffect(() => {
//     load();
//     return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
//   }, [load]);

//   useEffect(() => {
//     if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
//   }, [result]);

//   // new stage -> the server tells us if this stage's clue was already bought
//   useEffect(() => {
//     setClueUsed(!!view?.clueUsed);
//     setClueText('');
//     setClueOpen(false);
//   }, [view?.stage]);

//   const flash = (m: string) => {
//     setMsg(m); clearTimeout(msgTimer.current);
//     msgTimer.current = setTimeout(() => setMsg(''), 2800);
//   };
//   const doShake = () => Animated.sequence([10, -10, 6, -6, 0].map((v) =>
//     Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

//   // 2. send the player's action; the backend decides if it is right
//   const act = async (kind: 'tap' | 'drag', item: string, target: string | undefined, at: { x: number; y: number }): Promise<boolean> => {
//     if (busy || done || !sessionId || !view) return false;
//     setBusy(true);
//     try {
//       const res = await sendAction({ sessionId, playerId, kind, item, target });
//       if (!res.correct) {
//         play('wrong');
//         setMark(at); doShake(); flash(res.message);
//         later(() => setMark(null), 700);
//         setBusy(false);
//         return false;
//       }
//       play('correct');
//       flash(res.message);
//       if (res.completed) {
//         setDone(true);
//         setView({ ...view, scene: res.scene || view.scene });
//         later(() => setResult(res), 1700);
//       } else {
//         setView({ ...view, ...(res as any) }); // next stage comes from the server
//         setBusy(false);
//       }
//       return true;
//     } catch (e: any) {
//       flash(e.message || 'Network error');
//       setBusy(false);
//       return false;
//     }
//   };

//   const onTap = (id: string) => {
//     const h = HOT[id];
//     play('tap');
//     act('tap', id, undefined, { x: FW + (h.x + h.w / 2) * k2, y: FW + (h.y + h.h / 2) * k2 });
//   };

//   // dropped somewhere: only counts when the finger is over the target
//   const onDrop = (id: string, mx: number, my: number): Promise<boolean> => new Promise((resolve) => {
//     const node: any = babyRef.current;
//     if (!node || !zone || !node.measureInWindow) { resolve(false); return; }
//     node.measureInWindow((x: number, y: number, w: number, h: number) => {
//       const inside = mx >= x && mx <= x + w && my >= y && my <= y + h;
//       if (!inside) { resolve(false); return; }
//       act('drag', id, view?.target || '', { x: FW + (zone.x + zone.w / 2) * k2, y: FW + (zone.y + zone.h / 2) * k2 }).then(resolve);
//     });
//   });

//   // 3. magnifier tapped -> ask the backend. It charges HINT_COST once per stage,
//   //    saves that in the database, and sends the clue text back (free if already bought).
//   const onHint = async () => {
//     if (done || busy || !sessionId) return;

//     // not bought yet and cannot afford it
//     if (!clueUsed && hints < HINT_COST) {
//       play('wrong');
//       flash(`You need ${HINT_COST} hints. Watch a video to earn more!`);
//       return;
//     }

//     try {
//       const r = await hintLevel7({ sessionId, playerId });
//       if (!r.alreadyUsed) setHints && setHints(r.hints);
//       setClueUsed(true);
//       setClueText(r.clue || '');
//       play('clue');
//       setClueOpen(true);
//     } catch (e: any) {
//       const noFunds = e?.status === 402 || /not enough|payment/i.test(e?.message || '');
//       flash(noFunds ? `You need ${HINT_COST} hints. Watch a video to earn more!` : e?.message || 'Network error');
//     }
//   };

//   /* ---------- header (same as Level 4 / 5 / 6) ---------- */
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
//           <Text style={st.signT}>LEVEL 7</Text>
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
//                 <Text style={st.load}>Loading level 7...</Text>
//               </>
//             )}
//           </View>
//         </View>
//       </Stage>
//     );
//   }

//   const tap = view.mode === 'tap';
//   const stageNo = Math.min(3, Math.max(1, Number(view.stage) || 1));

//   return (
//     <Stage bg={SKY}>
//       <View style={st.root}>
//         <Garden />
//         {header}

//         <View style={st.center}>
//           {/* question pill */}
//           <View style={[st.qPill, { maxWidth: Math.min(width - 48, 350) }]}>
//             <Text style={st.qArrow}>{'<'}</Text>
//             <Text style={[st.q, msg ? { color: '#c0392b' } : null]}>{msg || view.title}</Text>
//             <Text style={st.qArrow}>{'>'}</Text>
//           </View>

//           {/* the room scene (thick wooden frame) */}
//           <Animated.View style={{ width: RW, height: RH, marginTop: 12, transform: [{ translateX: shake }] }}>
//             <View style={st.panelFrame}>
//               <Room w={RW - 2 * FW} mood={view.scene.mood} />
//               <View pointerEvents="none" style={st.frameInner} />
//             </View>

//             {/* drop target: the bag (stage 2) or Mia (stage 3), set by the server */}
//             {!!zone && <View ref={babyRef} collapsable={false} pointerEvents="none"
//               style={{ position: 'absolute', left: FW + zone.x * k2, top: FW + zone.y * k2, width: zone.w * k2, height: zone.h * k2 }} />}

//             {/* tap stage: invisible hotspots over every thing in the room */}
//             {tap && !done && view.objects.map((o) => {
//               const h = HOT[o.id];
//               if (!h) return null;
//               return <Pressable key={o.id} onPress={() => onTap(o.id)}
//                 style={{ position: 'absolute', left: FW + h.x * k2, top: FW + h.y * k2, width: h.w * k2, height: h.h * k2, borderRadius: 12 }} />;
//             })}

//             {done && <View pointerEvents="none" style={{ position: 'absolute', left: RW / 2 - 40, top: RH * 0.3 }}><Tick s={80} /></View>}
//             {mark && <View pointerEvents="none" style={{ position: 'absolute', left: mark.x - 23, top: mark.y - 23, zIndex: 20 }}><Cross /></View>}
//           </Animated.View>

//           {/* drag stage: items to drag onto the target */}
//           {!tap && !done && (
//             <View style={[ts.row, { width: RW }]}>
//               {view.tray.map((t) => <DragItem key={view.stage + '-' + t.id} thing={t} size={ITEM} disabled={busy} onDrop={onDrop} />)}
//             </View>
//           )}
//         </View>

//         {/* bottom wooden panel (same small size as Level 5 / 6) */}
//         <View style={st.panel}>
//           <View style={[st.plank, { top: 12, left: 30, right: 30 }]} />
//           <View style={[st.plank, { top: 58, left: 22, right: 22 }]} />
//           <View style={[st.plank, { bottom: 12, left: 30, right: 30 }]} />
//           <View style={[st.screw, { left: 13, top: 12 }]} />
//           <View style={[st.screw, { right: 13, top: 12 }]} />
//           <View style={[st.screw, { left: 13, bottom: 12 }]} />
//           <View style={[st.screw, { right: 13, bottom: 12 }]} />

//           <View style={st.btnCol}>
//             <TouchableOpacity
//               style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }, (!clueUsed && hints < HINT_COST) && { opacity: 0.5 }]}
//               activeOpacity={0.85} onPress={onHint}
//             >
//               <Icon n="search" s={31} />
//             </TouchableOpacity>
//             <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>{HINT_COST}</Text></View>
//           </View>

//           <View style={st.btnCol}>
//             {/* coins / video button: the parent ONLY adds hints, it never opens the clue */}
//             <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={() => { play('btn'); onWatchVideo && onWatchVideo(); }}>
//               <Icon n="film" s={36} />
//             </TouchableOpacity>
//             <View style={st.badge}><Coin s={12} /><Text style={st.badgeT}>+75</Text></View>
//           </View>

//           <View style={st.btnCol}>
//             <View style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]}>
//               <DoubleArrow s={33} />
//             </View>
//             <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>50</Text></View>
//           </View>
//         </View>

//         {/* CLUES popup (only from the magnifier, the clue of the current stage, text from the backend) */}
//         {clueOpen && (
//           <View style={st.overlay}>
//             <View style={st.clueCard}>
//               <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
//                 <Icon n="cross" s={20} />
//               </TouchableOpacity>
//               <Text style={st.clueTitle}>HINTS</Text>

//               <View style={[st.clueRow, st.clueRowOpen]}>
//                 <View style={st.clueNum}><Text style={st.clueNumT}>{stageNo}</Text></View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={st.clueHead}>{'Hint ' + stageNo}</Text>
//                   <Text style={st.clueBody}>{clueText}</Text>
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

// /* tray styles (cream cards with a thick orange edge and a bottom shadow) */
// const ts = StyleSheet.create({
//   row: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 16, zIndex: 30, elevation: 10 },
//   item: {
//     borderRadius: 26, backgroundColor: CREAM, borderWidth: 5, borderColor: WOOD, alignItems: 'center', justifyContent: 'center',
//     shadowColor: WOOD_D, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 0,
//   },
// });

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

//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 135 },
//   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
//   qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, elevation: 3 },
//   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
//   q: { flexShrink: 1, fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

//   // thick wooden room frame (border = FW, so the hotspot maths stays correct)
//   panelFrame: { borderWidth: FW, borderColor: WOOD, borderRadius: 26, overflow: 'hidden', backgroundColor: '#eef1f4', elevation: 5 },
//   frameInner: { ...StyleSheet.absoluteFillObject, borderWidth: 2, borderColor: 'rgba(143,90,31,0.55)', borderRadius: 16 },

//   // bottom wooden panel (small, same as Level 5 / 6)
//   panel: {
//     position: 'absolute', left: 14, right: 14, bottom: 18, height: 118, borderRadius: 38,
//     backgroundColor: WOOD, borderWidth: 5, borderColor: WOOD_D,
//     flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 14, elevation: 6,
//   },
//   plank: { position: 'absolute', height: 2.5, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
//   screw: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: WOOD_DD },
//   btnCol: { alignItems: 'center' },
//   circleBtn: { width: 62, height: 62, borderRadius: 31, borderWidth: 5, alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 5, minWidth: 62, paddingHorizontal: 10, height: 25, borderRadius: 13, backgroundColor: BADGE },
//   badgeT: { fontFamily: FONT, fontSize: 14, fontWeight: '900', color: '#fff' },

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
  View, Text, TouchableOpacity, Pressable, Animated, Easing, PanResponder, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Stage, F, Coin } from './BTShared';
import { Icon } from './Art';
import { startLevel7, sendAction, hintLevel7, Level7View, Level7Result, L7Thing } from './Btlevel7api';
import { Room, Thing, Tick, Cross, HOT, ROOM_W, ROOM_H } from './Btlevel7art';
import { play } from './BTSound';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

/* garden palette (same as Level 3 / 4 / 5 / 6) */
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

// thickness of the wooden room frame (all hotspot / drop-zone maths uses this)
const FW = 9;

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit: () => void;
  onComplete?: (result: Level7Result) => void;
  // called when the coins / video buttons are tapped. The parent should ONLY add hints here.
  onWatchVideo?: () => void;
};

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

/* =========================================================
   ONE DRAGGABLE ITEM IN THE TRAY (snaps back unless dropped on the target)
========================================================= */

function DragItem({ thing, size, onDrop, disabled }: { thing: L7Thing; size: number; onDrop: (id: string, x: number, y: number) => Promise<boolean>; disabled: boolean }) {
  const xy = useRef(new Animated.ValueXY()).current;
  const [lift, setLift] = useState(false);
  const live = useRef({ disabled, onDrop, thing });
  live.current = { disabled, onDrop, thing };
  const back = () => Animated.spring(xy, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: true }).start();
  const pr = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !live.current.disabled,
    onPanResponderGrant: () => { play('drag'); setLift(true); xy.setOffset({ x: 0, y: 0 }); xy.setValue({ x: 0, y: 0 }); },
    onPanResponderMove: Animated.event([null, { dx: xy.x, dy: xy.y }], { useNativeDriver: false }),
    onPanResponderRelease: async (e, g) => {
      setLift(false);
      const ok = await live.current.onDrop(live.current.thing.id, g.moveX, g.moveY);
      if (!ok) back();
    },
    onPanResponderTerminate: () => { setLift(false); back(); },
  })).current;
  return (
    <Animated.View {...pr.panHandlers}
      style={[ts.item, {
        width: size, height: size, zIndex: lift ? 60 : 1, elevation: lift ? 12 : 4,
        transform: [{ translateX: xy.x }, { translateY: xy.y }, { scale: lift ? 1.15 : 1 }],
      }]}>
      <Thing id={thing.id} size={Math.round(size * 0.78)} />
    </Animated.View>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevel7Screen({ playerId, hints = 0, setHints, onExit, onComplete, onWatchVideo }: Props) {
  const { width, height } = useWindowDimensions();
  const RW = Math.max(240, Math.min(width * 0.78, 360, ((height - 440) * ROOM_W) / ROOM_H)); // room width (incl. frame)
  const k2 = (RW - 2 * FW) / ROOM_W; // room units -> pixels (inside the frame)
  const RH = ROOM_H * k2 + 2 * FW;
  const ITEM = Math.min(100, Math.floor((RW - 32) / 3)); // tray card size

  const [view, setView] = useState<Level7View | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [mark, setMark] = useState<{ x: number; y: number } | null>(null);
  const [clueOpen, setClueOpen] = useState(false);
  const [clueUsed, setClueUsed] = useState(false); // the backend says this stage's clue was already bought
  const [clueText, setClueText] = useState('');    // clue text comes from the backend
  const zone = view && view.target ? HOT[view.target] : null; // where the dragged thing must be dropped

  const shake = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const timers = useRef<any[]>([]);
  const msgTimer = useRef<any>(null);
  const babyRef = useRef<View>(null);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  // hanging sign sways gently (same as Level 3 - 6)
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [sway]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

  // 1. open the level - the backend creates or resumes the session
  const load = useCallback(() => {
    setLoadErr(''); setView(null);
    startLevel7(playerId)
      .then((v) => { setSessionId(v.sessionId as number); setView(v); })
      .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
  }, [playerId]);

  useEffect(() => {
    load();
    return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
  }, [load]);

  // new stage -> the server tells us if this stage's clue was already bought
  useEffect(() => {
    setClueUsed(!!view?.clueUsed);
    setClueText('');
    setClueOpen(false);
  }, [view?.stage]);

  const flash = (m: string) => {
    setMsg(m); clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 2800);
  };
  const doShake = () => Animated.sequence([10, -10, 6, -6, 0].map((v) =>
    Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

  // 2. send the player's action; the backend decides if it is right
  const act = async (kind: 'tap' | 'drag', item: string, target: string | undefined, at: { x: number; y: number }): Promise<boolean> => {
    if (busy || done || !sessionId || !view) return false;
    setBusy(true);
    try {
      const res = await sendAction({ sessionId, playerId, kind, item, target });
      if (!res.correct) {
        play('wrong');
        setMark(at); doShake(); flash(res.message);
        later(() => setMark(null), 700);
        setBusy(false);
        return false;
      }
      play('correct');
      flash(res.message);
      if (res.completed) {
        setDone(true);
        setView({ ...view, scene: res.scene || view.scene });
        // no popup: after the tick, go straight on
        later(() => { onComplete ? onComplete(res) : onExit(); }, 1700);
      } else {
        setView({ ...view, ...(res as any) }); // next stage comes from the server
        setBusy(false);
      }
      return true;
    } catch (e: any) {
      flash(e.message || 'Network error');
      setBusy(false);
      return false;
    }
  };

  const onTap = (id: string) => {
    const h = HOT[id];
    play('tap');
    act('tap', id, undefined, { x: FW + (h.x + h.w / 2) * k2, y: FW + (h.y + h.h / 2) * k2 });
  };

  // dropped somewhere: only counts when the finger is over the target
  const onDrop = (id: string, mx: number, my: number): Promise<boolean> => new Promise((resolve) => {
    const node: any = babyRef.current;
    if (!node || !zone || !node.measureInWindow) { resolve(false); return; }
    node.measureInWindow((x: number, y: number, w: number, h: number) => {
      const inside = mx >= x && mx <= x + w && my >= y && my <= y + h;
      if (!inside) { resolve(false); return; }
      act('drag', id, view?.target || '', { x: FW + (zone.x + zone.w / 2) * k2, y: FW + (zone.y + zone.h / 2) * k2 }).then(resolve);
    });
  });

  // Ask the backend for the clue; hints do not consume the player's balance.
  const onHint = async () => {
    if (done || busy || !sessionId) return;

    try {
      const r = await hintLevel7({ sessionId, playerId });
      if (!r.alreadyUsed) setHints && setHints(r.hints);
      setClueUsed(true);
      setClueText(r.clue || '');
      play('clue');
      setClueOpen(true);
    } catch (e: any) {
      flash(e?.message || 'Network error');
    }
  };

  /* ---------- header (same as Level 4 / 5 / 6) ---------- */
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
          <Text style={st.signT}>LEVEL 7</Text>
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
                <Text style={st.load}>Loading level 7...</Text>
              </>
            )}
          </View>
        </View>
      </Stage>
    );
  }

  const tap = view.mode === 'tap';
  const stageNo = Math.min(3, Math.max(1, Number(view.stage) || 1));

  return (
    <Stage bg={SKY}>
      <View style={st.root}>
        <Garden />
        {header}

        <View style={st.center}>
          {/* question pill */}
          <View style={[st.qPill, { maxWidth: Math.min(width - 48, 350) }]}>
            <Text style={st.qArrow}>{'<'}</Text>
            <Text style={[st.q, msg ? { color: '#c0392b' } : null]}>{msg || view.title}</Text>
            <Text style={st.qArrow}>{'>'}</Text>
          </View>

          {/* the room scene (thick wooden frame) */}
          <Animated.View style={{ width: RW, height: RH, marginTop: 12, transform: [{ translateX: shake }] }}>
            <View style={st.panelFrame}>
              <Room w={RW - 2 * FW} mood={view.scene.mood} />
              <View pointerEvents="none" style={st.frameInner} />
            </View>

            {/* drop target: the bag (stage 2) or Mia (stage 3), set by the server */}
            {!!zone && <View ref={babyRef} collapsable={false} pointerEvents="none"
              style={{ position: 'absolute', left: FW + zone.x * k2, top: FW + zone.y * k2, width: zone.w * k2, height: zone.h * k2 }} />}

            {/* tap stage: invisible hotspots over every thing in the room */}
            {tap && !done && view.objects.map((o) => {
              const h = HOT[o.id];
              if (!h) return null;
              return <Pressable key={o.id} onPress={() => onTap(o.id)}
                style={{ position: 'absolute', left: FW + h.x * k2, top: FW + h.y * k2, width: h.w * k2, height: h.h * k2, borderRadius: 12 }} />;
            })}

            {done && <View pointerEvents="none" style={{ position: 'absolute', left: RW / 2 - 40, top: RH * 0.3 }}><Tick s={80} /></View>}
            {mark && <View pointerEvents="none" style={{ position: 'absolute', left: mark.x - 23, top: mark.y - 23, zIndex: 20 }}><Cross /></View>}
          </Animated.View>

          {/* drag stage: items to drag onto the target */}
          {!tap && !done && (
            <View style={[ts.row, { width: RW }]}>
              {view.tray.map((t) => <DragItem key={view.stage + '-' + t.id} thing={t} size={ITEM} disabled={busy} onDrop={onDrop} />)}
            </View>
          )}
        </View>

        {/* bottom wooden panel (same small size as Level 5 / 6) */}
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
              style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]}
              activeOpacity={0.85} onPress={onHint}
            >
              <Icon n="search" s={31} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>FREE</Text></View>
          </View>

          <View style={st.btnCol}>
            {/* coins / video button: the parent ONLY adds hints, it never opens the clue */}
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={() => { play('btn'); onWatchVideo && onWatchVideo(); }}>
              <Icon n="film" s={36} />
            </TouchableOpacity>
            <View style={st.badge}><Coin s={12} /><Text style={st.badgeT}>+75</Text></View>
          </View>

          <View style={st.btnCol}>
            <View style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]}>
              <DoubleArrow s={33} />
            </View>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>50</Text></View>
          </View>
        </View>

        {/* CLUES popup (only from the magnifier, the clue of the current stage, text from the backend) */}
        {clueOpen && (
          <View style={st.overlay}>
            <View style={st.clueCard}>
              <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
                <Icon n="cross" s={20} />
              </TouchableOpacity>
              <Text style={st.clueTitle}>HINTS</Text>

              <View style={[st.clueRow, st.clueRowOpen]}>
                <View style={st.clueNum}><Text style={st.clueNumT}>{stageNo}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={st.clueHead}>{'Hint ' + stageNo}</Text>
                  <Text style={st.clueBody}>{clueText}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </Stage>
  );
}

/* tray styles (cream cards with a thick orange edge and a bottom shadow) */
const ts = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 16, zIndex: 30, elevation: 10 },
  item: {
    borderRadius: 26, backgroundColor: CREAM, borderWidth: 5, borderColor: WOOD, alignItems: 'center', justifyContent: 'center',
    shadowColor: WOOD_D, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 0,
  },
});

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

  // thick wooden room frame (border = FW, so the hotspot maths stays correct)
  panelFrame: { borderWidth: FW, borderColor: WOOD, borderRadius: 26, overflow: 'hidden', backgroundColor: '#eef1f4', elevation: 5 },
  frameInner: { ...StyleSheet.absoluteFillObject, borderWidth: 2, borderColor: 'rgba(143,90,31,0.55)', borderRadius: 16 },

  // bottom wooden panel (small, same as Level 5 / 6)
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

  load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
  err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
  retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
  retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
  back: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },
});
