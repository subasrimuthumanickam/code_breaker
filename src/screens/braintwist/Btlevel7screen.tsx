// import React,{useCallback,useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Pressable,Animated,PanResponder,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// import {F,INK,Coin} from './BTShared';
// import {Icon} from './Art';
// import {startLevel7,sendAction,hintLevel7,Level7View,Level7Result,L7Thing} from './Btlevel7api';
// import {Room,Thing,Tick,Cross,BigStar,Duster,ChalkPiece,HOT,ROOM_W,ROOM_H} from './Btlevel7art';

// const CHALK='#f6f4ea';

// type Props={
//   playerId:number;
//   hints?:number;
//   setHints?:(n:number)=>void;
//   onExit:()=>void;
//   onComplete?:(result:Level7Result)=>void;
// };

// /* one draggable item in the tray; it snaps back unless dropped on the baby */
// function DragItem({thing,onDrop,disabled,glow}:{thing:L7Thing;onDrop:(id:string,x:number,y:number)=>Promise<boolean>;disabled:boolean;glow:boolean}){
//   const xy=useRef(new Animated.ValueXY()).current;
//   const [lift,setLift]=useState(false);
//   const live=useRef({disabled,onDrop,thing});
//   live.current={disabled,onDrop,thing};
//   const back=()=>Animated.spring(xy,{toValue:{x:0,y:0},friction:6,useNativeDriver:true}).start();
//   const pr=useRef(PanResponder.create({
//     onStartShouldSetPanResponder:()=>!live.current.disabled,
//     onPanResponderGrant:()=>{setLift(true);xy.setOffset({x:0,y:0});xy.setValue({x:0,y:0})},
//     onPanResponderMove:Animated.event([null,{dx:xy.x,dy:xy.y}],{useNativeDriver:false}),
//     onPanResponderRelease:async(e,g)=>{
//       setLift(false);
//       const ok=await live.current.onDrop(live.current.thing.id,g.moveX,g.moveY);
//       if(!ok)back();
//     },
//     onPanResponderTerminate:()=>{setLift(false);back()},
//   })).current;
//   return <Animated.View {...pr.panHandlers}
//     style={[ts.item,glow&&ts.itemGlow,{zIndex:lift?60:1,transform:[{translateX:xy.x},{translateY:xy.y},{scale:lift?1.15:1}]}]}>
//     <Thing id={thing.id} size={62}/>
//   </Animated.View>;
// }

// export default function BTLevel7Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
//   const {width}=useWindowDimensions();
//   const RW=Math.min(width-36,340);               // room width
//   const k=RW/ROOM_W;                              // room units -> pixels
//   const RH=ROOM_H*k;

//   const [view,setView]=useState<Level7View|null>(null);
//   const [sessionId,setSessionId]=useState<number|null>(null);
//   const [loadErr,setLoadErr]=useState('');
//   const [msg,setMsg]=useState('');
//   const [busy,setBusy]=useState(false);
//   const [done,setDone]=useState(false);
//   const [mark,setMark]=useState<{x:number;y:number}|null>(null);
//   const [glow,setGlow]=useState<string|null>(null);
//   const [result,setResult]=useState<Level7Result|null>(null);

//   const shake=useRef(new Animated.Value(0)).current;
//   const pop=useRef(new Animated.Value(0)).current;
//   const sway=useRef(new Animated.Value(0)).current;
//   const timers=useRef<any[]>([]);
//   const msgTimer=useRef<any>(null);
//   const babyRef=useRef<View>(null);
//   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

//   // 1. open the level - the backend creates or resumes the session
//   const load=useCallback(()=>{
//     setLoadErr('');setView(null);
//     startLevel7(playerId)
//       .then(v=>{setSessionId(v.sessionId as number);setView(v)})
//       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
//   },[playerId]);

//   useEffect(()=>{
//     load();
//     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
//   },[load]);

//   useEffect(()=>{
//     const l=Animated.loop(Animated.sequence([
//       Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
//       Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
//     l.start();
//     return()=>l.stop();
//   },[]);

//   useEffect(()=>{
//     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
//   },[result]);

//   const flash=(m:string)=>{
//     setMsg(m);clearTimeout(msgTimer.current);
//     msgTimer.current=setTimeout(()=>setMsg(''),2800);
//   };
//   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
//     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

//   // 2. send the player's action; the backend decides if it is right
//   const act=async(kind:'tap'|'drag',item:string,target:string|undefined,at:{x:number;y:number}):Promise<boolean>=>{
//     if(busy||done||!sessionId||!view)return false;
//     setBusy(true);setGlow(null);
//     try{
//       const res=await sendAction({sessionId,playerId,kind,item,target});
//       if(!res.correct){
//         setMark(at);doShake();flash(res.message);
//         later(()=>setMark(null),700);
//         setBusy(false);
//         return false;
//       }
//       flash(res.message);
//       if(res.completed){
//         setDone(true);
//         setView({...view,scene:res.scene||view.scene});
//         later(()=>setResult(res),1700);
//       }else{
//         setView({...view,...(res as any)});            // next stage comes from the server
//         setBusy(false);
//       }
//       return true;
//     }catch(e:any){
//       flash(e.message||'Network error');
//       setBusy(false);
//       return false;
//     }
//   };

//   const onTap=(id:string)=>{
//     const h=HOT[id];
//     act('tap',id,undefined,{x:(h.x+h.w/2)*k,y:(h.y+h.h/2)*k});
//   };

//   // dropped somewhere: only counts when the finger is over the baby
//   const onDrop=(id:string,mx:number,my:number):Promise<boolean>=>new Promise(resolve=>{
//     const node:any=babyRef.current;
//     if(!node||!node.measureInWindow){resolve(false);return}
//     node.measureInWindow((x:number,y:number,w:number,h:number)=>{
//       const inside=mx>=x&&mx<=x+w&&my>=y&&my<=y+h;
//       if(!inside){resolve(false);return}
//       act('drag',id,'baby',{x:(HOT.baby.x+HOT.baby.w/2)*k,y:(HOT.baby.y+HOT.baby.h/2)*k}).then(resolve);
//     });
//   });

//   const onHint=async()=>{
//     if(busy||done||!sessionId)return;
//     try{
//       const r=await hintLevel7({sessionId,playerId});
//       setHints&&setHints(r.hints);
//       setGlow(r.item);
//     }catch(e:any){
//       flash(e.status===402?'Not enough hints':e.message||'Network error');
//     }
//   };

//   /* ---------- loading / error ---------- */

//   if(loadErr||!view){
//     return <View style={bd.wall}><View style={bd.frame}><View style={[bd.board,{justifyContent:'center'}]}>
//       {loadErr?<>
//         <Text style={bd.err}>{loadErr}</Text>
//         <TouchableOpacity style={bd.retry} onPress={load}><Text style={bd.retryT}>Try again</Text></TouchableOpacity>
//         <TouchableOpacity onPress={onExit}><Text style={bd.back}>Back</Text></TouchableOpacity>
//       </>:<>
//         <ActivityIndicator size="large" color={CHALK}/>
//         <Text style={bd.load}>Loading level 7...</Text>
//       </>}
//     </View></View></View>;
//   }

//   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
//   const tap=view.mode==='tap';

//   return <View style={bd.wall}>
//     <View style={bd.frame}><View style={bd.board}>
//       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
//       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
//       <View pointerEvents="none" style={bd.sheen}/>

//       {/* top bar */}
//       <View style={bd.top}>
//         <View style={bd.topL}>
//           <TouchableOpacity style={bd.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
//           <View style={bd.round}><Icon n="gear" s={16}/></View>
//         </View>
//         <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
//           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
//           <View style={bd.sign}>
//             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
//             <Text style={bd.signt}>LEVEL 7</Text>
//             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
//           </View>
//         </Animated.View>
//         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
//       </View>

//       <Text style={[bd.q,msg?{color:'#ffb4a8'}:null]}>{msg||view.title}</Text>

//       {/* the room */}
//       <View style={bd.boardWrap}>
//         <Animated.View style={{width:RW,height:RH,transform:[{translateX:shake}]}}>
//           <Room w={RW} light={view.scene.light} baby={view.scene.baby}/>

//           {/* drop target = the crib */}
//           <View ref={babyRef} collapsable={false} pointerEvents="none"
//             style={{position:'absolute',left:HOT.baby.x*k,top:HOT.baby.y*k,width:HOT.baby.w*k,height:HOT.baby.h*k}}/>

//           {/* tap stage: invisible hotspots over every thing in the room */}
//           {tap&&!done&&view.objects.map(o=>{
//             const h=HOT[o.id];
//             if(!h)return null;
//             return <Pressable key={o.id} onPress={()=>onTap(o.id)}
//               style={{position:'absolute',left:h.x*k,top:h.y*k,width:h.w*k,height:h.h*k,borderRadius:12,
//                 borderWidth:glow===o.id?3:0,borderColor:'#ffd84d',backgroundColor:glow===o.id?'rgba(255,216,77,0.18)':'transparent'}}/>;
//           })}

//           {done&&<View pointerEvents="none" style={{position:'absolute',left:RW/2-40,top:RH*0.3,}}><Tick s={80}/></View>}
//           {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}><Cross/></View>}
//         </Animated.View>
//       </View>

//       <Text style={bd.sub}>{view.hint}</Text>

//       {/* drag stage: items on the chalk tray */}
//       {!tap&&!done&&<View style={ts.row} pointerEvents="box-none">
//         {view.tray.map(t=><DragItem key={view.stage+'-'+t.id} thing={t} disabled={busy} glow={glow===t.id} onDrop={onDrop}/>)}
//       </View>}

//       {/* hint / video / skip */}
//       <View style={bd.actions}>
//         <View style={bd.acol}>
//           <TouchableOpacity style={bd.hintBtn} onPress={onHint}><Icon n="search" s={34}/></TouchableOpacity>
//           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
//         </View>
//         <View style={bd.acol}>
//           <View style={bd.videoBtn}><Icon n="film" s={40}/></View>
//           <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
//         </View>
//         <View style={bd.acol}>
//           <View style={bd.skipBtn}><Icon n="play" s={36}/></View>
//           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
//         </View>
//       </View>

//       {/* chalk tray */}
//       <View style={bd.ledge}>
//         {[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:6+i*6,height:1,backgroundColor:'rgba(90,45,10,0.25)'}}/>)}
//         <View style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>
//         <View style={{position:'absolute',left:'40%',bottom:20}}><ChalkPiece w={78}/></View>
//         <View style={{position:'absolute',left:'64%',bottom:22,transform:[{rotate:'-8deg'}]}}><ChalkPiece w={54}/></View>
//       </View>

//       {/* result card */}
//       {!!result&&<View style={bd.overlay}>
//         <Animated.View style={[bd.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
//           <Text style={bd.cardTitle}>Level complete!</Text>
//           <Text style={bd.cardMsg}>{result.message}</Text>
//           <View style={bd.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
//           <Text style={bd.cardScore}>Score {result.score}</Text>
//           <TouchableOpacity style={bd.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
//             <Text style={bd.nextT}>NEXT</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>}
//     </View></View>
//   </View>;
// }

// const ts=StyleSheet.create({
//   row:{position:'absolute',left:0,right:0,bottom:140,flexDirection:'row',justifyContent:'center',gap:18,zIndex:30},
//   item:{width:76,height:76,borderRadius:16,backgroundColor:'rgba(246,244,234,0.92)',borderWidth:3,borderColor:'#d98b3d',alignItems:'center',justifyContent:'center'},
//   itemGlow:{borderColor:'#ffd84d',backgroundColor:'#fff3b8'},
// });

// /* =========================================================
//    STYLES  (same green chalkboard as the other board levels)
// ========================================================= */

// const bd=StyleSheet.create({
//   wall:{flex:1,backgroundColor:'#f1dcc0',paddingBottom:18},
//   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:8,backgroundColor:'#1f5b44',overflow:'hidden'},
//   board:{flex:1,alignItems:'center'},
//   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
//   sheen:{position:'absolute',left:0,right:0,top:0,height:120,backgroundColor:'rgba(255,255,255,0.04)'},

//   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
//   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
//   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
//   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   signWrap:{alignItems:'center',paddingTop:14},
//   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
//   sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
//   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
//   dashes:{gap:4,justifyContent:'center'},
//   dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
//   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
//   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},

//   q:{fontFamily:F,fontSize:25,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,paddingHorizontal:12,
//     textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
//   boardWrap:{flex:1,alignItems:'center',justifyContent:'flex-start',paddingTop:6,paddingBottom:230},
//   sub:{position:'absolute',bottom:228,fontFamily:F,fontSize:15,fontStyle:'italic',color:'rgba(246,244,234,0.6)',textAlign:'center'},

//   actions:{position:'absolute',left:0,right:0,bottom:62,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
//   acol:{alignItems:'center'},
//   lblRow:{flexDirection:'row',alignItems:'center',gap:3,height:20,marginTop:4},
//   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
//   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
//   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
//   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
//   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},

//   overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
//   card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
//   cardTitle:{fontFamily:F,fontSize:28,fontWeight:'800',color:'#fff'},
//   cardMsg:{fontFamily:F,fontSize:17,color:'#d8f3e3',textAlign:'center',marginTop:6},
//   stars:{flexDirection:'row',gap:6,marginTop:14},
//   cardScore:{fontFamily:F,fontSize:22,fontWeight:'700',color:'#ffd33d',marginTop:10},
//   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:'#a6e22e',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   nextT:{fontFamily:F,fontSize:26,fontWeight:'900',color:INK},

//   load:{fontFamily:F,fontSize:22,color:CHALK,marginTop:12},
//   err:{fontFamily:F,fontSize:18,color:CHALK,textAlign:'center',paddingHorizontal:24},
//   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
//   retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
//   back:{fontFamily:F,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
// });
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Pressable,Animated,PanResponder,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
import {F,INK,Coin} from './BTShared';
import {Icon} from './Art';
import {startLevel7,sendAction,hintLevel7,Level7View,Level7Result,L7Thing} from './Btlevel7api';
import {Room,Thing,Tick,Cross,BigStar,Duster,ChalkPiece,HOT,ROOM_W,ROOM_H} from './Btlevel7art';

const CHALK='#f6f4ea';

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level7Result)=>void;
};

/* one draggable item in the tray; it snaps back unless dropped on the baby */
function DragItem({thing,onDrop,disabled,glow}:{thing:L7Thing;onDrop:(id:string,x:number,y:number)=>Promise<boolean>;disabled:boolean;glow:boolean}){
  const xy=useRef(new Animated.ValueXY()).current;
  const [lift,setLift]=useState(false);
  const live=useRef({disabled,onDrop,thing});
  live.current={disabled,onDrop,thing};
  const back=()=>Animated.spring(xy,{toValue:{x:0,y:0},friction:6,useNativeDriver:true}).start();
  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>!live.current.disabled,
    onPanResponderGrant:()=>{setLift(true);xy.setOffset({x:0,y:0});xy.setValue({x:0,y:0})},
    onPanResponderMove:Animated.event([null,{dx:xy.x,dy:xy.y}],{useNativeDriver:false}),
    onPanResponderRelease:async(e,g)=>{
      setLift(false);
      const ok=await live.current.onDrop(live.current.thing.id,g.moveX,g.moveY);
      if(!ok)back();
    },
    onPanResponderTerminate:()=>{setLift(false);back()},
  })).current;
  return <Animated.View {...pr.panHandlers}
    style={[ts.item,glow&&ts.itemGlow,{zIndex:lift?60:1,transform:[{translateX:xy.x},{translateY:xy.y},{scale:lift?1.15:1}]}]}>
    <Thing id={thing.id} size={62}/>
  </Animated.View>;
}

export default function BTLevel7Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width}=useWindowDimensions();
  const RW=Math.min(width-36,340);               // room width
  const k2=(RW-6)/ROOM_W;                         // room units -> pixels (inside the 3px frame)
  const RH=ROOM_H*k2+6;

  const [view,setView]=useState<Level7View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);
  const [done,setDone]=useState(false);
  const [mark,setMark]=useState<{x:number;y:number}|null>(null);
  const [glow,setGlow]=useState<string|null>(null);
  const [result,setResult]=useState<Level7Result|null>(null);
  const zone=view&&view.target?HOT[view.target]:null;   // where the dragged thing must be dropped

  const shake=useRef(new Animated.Value(0)).current;
  const pop=useRef(new Animated.Value(0)).current;
  const sway=useRef(new Animated.Value(0)).current;
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
    const l=Animated.loop(Animated.sequence([
      Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
      Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
    l.start();
    return()=>l.stop();
  },[]);

  useEffect(()=>{
    if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
  },[result]);

  const flash=(m:string)=>{
    setMsg(m);clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2800);
  };
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
    Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  // 2. send the player's action; the backend decides if it is right
  const act=async(kind:'tap'|'drag',item:string,target:string|undefined,at:{x:number;y:number}):Promise<boolean>=>{
    if(busy||done||!sessionId||!view)return false;
    setBusy(true);setGlow(null);
    try{
      const res=await sendAction({sessionId,playerId,kind,item,target});
      if(!res.correct){
        setMark(at);doShake();flash(res.message);
        later(()=>setMark(null),700);
        setBusy(false);
        return false;
      }
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
    act('tap',id,undefined,{x:3+(h.x+h.w/2)*k2,y:3+(h.y+h.h/2)*k2});
  };

  // dropped somewhere: only counts when the finger is over the baby
  const onDrop=(id:string,mx:number,my:number):Promise<boolean>=>new Promise(resolve=>{
    const node:any=babyRef.current;
    if(!node||!zone||!node.measureInWindow){resolve(false);return}
    node.measureInWindow((x:number,y:number,w:number,h:number)=>{
      const inside=mx>=x&&mx<=x+w&&my>=y&&my<=y+h;
      if(!inside){resolve(false);return}
      act('drag',id,view?.target||'',{x:3+(zone.x+zone.w/2)*k2,y:3+(zone.y+zone.h/2)*k2}).then(resolve);
    });
  });

  const onHint=async()=>{
    if(busy||done||!sessionId)return;
    try{
      const r=await hintLevel7({sessionId,playerId});
      setHints&&setHints(r.hints);
      setGlow(r.item);
    }catch(e:any){
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }
  };

  /* ---------- loading / error ---------- */

  if(loadErr||!view){
    return <View style={bd.wall}><View style={bd.frame}><View style={[bd.board,{justifyContent:'center'}]}>
      {loadErr?<>
        <Text style={bd.err}>{loadErr}</Text>
        <TouchableOpacity style={bd.retry} onPress={load}><Text style={bd.retryT}>Try again</Text></TouchableOpacity>
        <TouchableOpacity onPress={onExit}><Text style={bd.back}>Back</Text></TouchableOpacity>
      </>:<>
        <ActivityIndicator size="large" color={CHALK}/>
        <Text style={bd.load}>Loading level 7...</Text>
      </>}
    </View></View></View>;
  }

  const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
  const tap=view.mode==='tap';

  return <View style={bd.wall}>
    <View style={bd.frame}><View style={bd.board}>
      <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
      <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
      <View pointerEvents="none" style={bd.sheen}/>

      {/* top bar */}
      <View style={bd.top}>
        <View style={bd.topL}>
          <TouchableOpacity style={bd.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
          <View style={bd.round}><Icon n="gear" s={16}/></View>
        </View>
        <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
          <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
          <View style={bd.sign}>
            <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
            <Text style={bd.signt}>LEVEL 7</Text>
            <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
          </View>
        </Animated.View>
        <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
      </View>

      <Text style={[bd.q,msg?{color:'#ffb4a8'}:null]}>{msg||view.title}</Text>

      {/* the room */}
      <View style={bd.boardWrap}>
        <Animated.View style={{width:RW,height:RH,transform:[{translateX:shake}]}}>
          <View style={bd.panel}><Room w={RW-6} mood={view.scene.mood}/></View>

          {/* drop target: the bag (stage 2) or Mia (stage 3), set by the server */}
          {!!zone&&<View ref={babyRef} collapsable={false} pointerEvents="none"
            style={{position:'absolute',left:3+zone.x*k2,top:3+zone.y*k2,width:zone.w*k2,height:zone.h*k2}}/>}

          {/* tap stage: invisible hotspots over every thing in the room */}
          {tap&&!done&&view.objects.map(o=>{
            const h=HOT[o.id];
            if(!h)return null;
            return <Pressable key={o.id} onPress={()=>onTap(o.id)}
              style={{position:'absolute',left:3+h.x*k2,top:3+h.y*k2,width:h.w*k2,height:h.h*k2,borderRadius:12,
                borderWidth:glow===o.id?3:0,borderColor:'#ffd84d',backgroundColor:glow===o.id?'rgba(255,216,77,0.18)':'transparent'}}/>;
          })}

          {done&&<View pointerEvents="none" style={{position:'absolute',left:RW/2-40,top:RH*0.3}}><Tick s={80}/></View>}
          {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}><Cross/></View>}
        </Animated.View>
      </View>

      <Text style={bd.sub}>{view.hint}</Text>

      {/* drag stage: items on the chalk tray */}
      {!tap&&!done&&<View style={ts.row} pointerEvents="box-none">
        {view.tray.map(t=><DragItem key={view.stage+'-'+t.id} thing={t} disabled={busy} glow={glow===t.id} onDrop={onDrop}/>)}
      </View>}

      {/* hint / video / skip */}
      <View style={bd.actions}>
        <View style={bd.acol}>
          <TouchableOpacity style={bd.hintBtn} onPress={onHint}><Icon n="search" s={34}/></TouchableOpacity>
          <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
        </View>
        <View style={bd.acol}>
          <View style={bd.videoBtn}><Icon n="film" s={40}/></View>
          <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
        </View>
        <View style={bd.acol}>
          <View style={bd.skipBtn}><Icon n="play" s={36}/></View>
          <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
        </View>
      </View>

      {/* chalk tray */}
      <View style={bd.ledge}>
        {[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:6+i*6,height:1,backgroundColor:'rgba(90,45,10,0.25)'}}/>)}
        <View style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>
        <View style={{position:'absolute',left:'40%',bottom:20}}><ChalkPiece w={78}/></View>
        <View style={{position:'absolute',left:'64%',bottom:22,transform:[{rotate:'-8deg'}]}}><ChalkPiece w={54}/></View>
      </View>

      {/* result card */}
      {!!result&&<View style={bd.overlay}>
        <Animated.View style={[bd.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
          <Text style={bd.cardTitle}>Level complete!</Text>
          <Text style={bd.cardMsg}>{result.message}</Text>
          <View style={bd.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
          <Text style={bd.cardScore}>Score {result.score}</Text>
          <TouchableOpacity style={bd.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
            <Text style={bd.nextT}>NEXT</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>}
    </View></View>
  </View>;
}

const ts=StyleSheet.create({
  row:{position:'absolute',left:0,right:0,bottom:140,flexDirection:'row',justifyContent:'center',gap:18,zIndex:30},
  item:{width:76,height:76,borderRadius:16,backgroundColor:'rgba(246,244,234,0.92)',borderWidth:3,borderColor:'#d98b3d',alignItems:'center',justifyContent:'center'},
  itemGlow:{borderColor:'#ffd84d',backgroundColor:'#fff3b8'},
});

/* =========================================================
   STYLES  (same green chalkboard as the other board levels)
========================================================= */

const bd=StyleSheet.create({
  wall:{flex:1,backgroundColor:'#f1dcc0',paddingBottom:18},
  frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:8,backgroundColor:'#1f5b44',overflow:'hidden'},
  board:{flex:1,alignItems:'center'},
  smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
  sheen:{position:'absolute',left:0,right:0,top:0,height:120,backgroundColor:'rgba(255,255,255,0.04)'},

  top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
  topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
  topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
  round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
  signWrap:{alignItems:'center',paddingTop:14},
  string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
  sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
  signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
  dashes:{gap:4,justifyContent:'center'},
  dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
  bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
  bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},

  q:{fontFamily:F,fontSize:21,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,paddingHorizontal:12,
    textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
  panel:{borderWidth:3,borderColor:'#f6f4ea',borderRadius:10,overflow:'hidden',backgroundColor:'#eef1f4'},
  boardWrap:{flex:1,alignItems:'center',justifyContent:'flex-start',paddingTop:6,paddingBottom:230},
  sub:{position:'absolute',bottom:228,fontFamily:F,fontSize:15,fontStyle:'italic',color:'rgba(246,244,234,0.6)',textAlign:'center'},

  actions:{position:'absolute',left:0,right:0,bottom:62,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
  acol:{alignItems:'center'},
  lblRow:{flexDirection:'row',alignItems:'center',gap:3,height:20,marginTop:4},
  lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
  hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
  videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
  skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
  ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},

  overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
  card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
  cardTitle:{fontFamily:F,fontSize:28,fontWeight:'800',color:'#fff'},
  cardMsg:{fontFamily:F,fontSize:17,color:'#d8f3e3',textAlign:'center',marginTop:6},
  stars:{flexDirection:'row',gap:6,marginTop:14},
  cardScore:{fontFamily:F,fontSize:22,fontWeight:'700',color:'#ffd33d',marginTop:10},
  next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:'#a6e22e',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
  nextT:{fontFamily:F,fontSize:26,fontWeight:'900',color:INK},

  load:{fontFamily:F,fontSize:22,color:CHALK,marginTop:12},
  err:{fontFamily:F,fontSize:18,color:CHALK,textAlign:'center',paddingHorizontal:24},
  retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
  retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
  back:{fontFamily:F,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
});
