// import React,{useCallback,useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// import {F,INK} from './BTShared';
// import {Icon} from './Art';
// import {startLevel5,pickItem,hintLevel5,Level5View,Level5Pick,L5Item} from './Btlevel5api';
// import {Cucumber,Zucchini,Tomato,Tick,Cross,BigStar} from './Btlevel5art';

// type Props={
//   playerId:number;
//   hints?:number;
//   setHints?:(n:number)=>void;
//   onExit:()=>void;
//   onComplete?:(result:Level5Pick)=>void;
// };

// const CUC_W=112;           // cucumber / zucchini width
// const TOM_W=66;

// /* =========================================================
//    ONE VEGETABLE ON THE BOARD
// ========================================================= */

// function Veg({it,bw,bh,glow,disabled,onPress}:{it:L5Item;bw:number;bh:number;glow:boolean;disabled:boolean;onPress:(it:L5Item)=>void}){
//   const w=it.kind==='tomato'?TOM_W:CUC_W;
//   const h=it.kind==='tomato'?TOM_W:CUC_W*0.4;
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

//   // hint glow
//   useEffect(()=>{
//     if(!glow){pulse.setValue(0);return}
//     const l=Animated.loop(Animated.sequence([
//       Animated.timing(pulse,{toValue:1,duration:420,useNativeDriver:false}),
//       Animated.timing(pulse,{toValue:0,duration:420,useNativeDriver:false})]));
//     l.start();
//     return()=>l.stop();
//   },[glow]);


//   const Art=it.kind==='cucumber'?Cucumber:it.kind==='zucchini'?Zucchini:Tomato;

//   return <Animated.View pointerEvents={it.hidden?'none':'auto'} style={{
//       position:'absolute',left:x,top:y,width:w,height:h,
//       transform:[{rotate:it.rot+'deg'},{scale:sc}]}}>
//     <Animated.View pointerEvents="none" style={{
//       position:'absolute',left:-8,right:-8,top:-8,bottom:-8,borderRadius:20,
//       borderWidth:3,borderColor:'#ffd23f',opacity:pulse}}/>
//     <Pressable disabled={disabled} hitSlop={10} onPress={()=>onPress(it)} style={{width:w,height:h}}>
//       <Art w={w}/>
//     </Pressable>
//   </Animated.View>;
// }

// /* =========================================================
//    SCREEN
// ========================================================= */

// export default function BTLevel5Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
//   const {width}=useWindowDimensions();
//   const bw=Math.min(width-48,380),bh=300;

//   const [view,setView]=useState<Level5View|null>(null);
//   const [sessionId,setSessionId]=useState<number|null>(null);
//   const [loadErr,setLoadErr]=useState('');
//   const [msg,setMsg]=useState('');
//   const [busy,setBusy]=useState(false);
//   const [mark,setMark]=useState<{x:number;y:number;ok:boolean}|null>(null);
//   const [glow,setGlow]=useState<number|null>(null);
//   const [result,setResult]=useState<Level5Pick|null>(null);

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

//   const flash=(m:string)=>{
//     setMsg(m);clearTimeout(msgTimer.current);
//     msgTimer.current=setTimeout(()=>setMsg(''),2600);
//   };

//   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
//     Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

//   // 2. the player tapped something -> ask the backend
//   const onPick=async(it:L5Item)=>{
//     if(busy||!sessionId||!view||result)return;
//     setBusy(true);setGlow(null);
//     try{
//       const res=await pickItem({sessionId,playerId,itemId:it.id});

//       if(!res.correct){
//         setMark({x:it.x*bw,y:it.y*bh,ok:false});
//         doShake();flash(res.message);
//         later(()=>setMark(null),700);
//         // zucchini -> the server sent a new arrangement
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

//   const onHint=async()=>{
//     if(busy||!sessionId||result)return;
//     try{
//       const r=await hintLevel5({sessionId,playerId});
//       setHints&&setHints(r.hints);
//       setGlow(r.itemId);
//     }catch(e:any){
//       flash(e.status===402?'Not enough hints':e.message||'Network error');
//     }
//   };

//   /* ---------- loading / error ---------- */

//   if(loadErr||!view){
//     return <View style={st.wood}>
//       <View style={[st.paper,{alignItems:'center',justifyContent:'center'}]}>
//         {loadErr?<>
//           <Text style={st.err}>{loadErr}</Text>
//           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
//           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
//         </>:<>
//           <ActivityIndicator size="large" color={INK}/>
//           <Text style={st.loading}>Loading level 5...</Text>
//         </>}
//       </View>
//     </View>;
//   }

//   return <View style={st.wood}>
//     <View style={st.pink}/>
//     <View style={st.paper}>
//       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
//       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}

//       {/* header */}
//       <View style={st.head}>
//         <TouchableOpacity style={st.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
//         <View style={st.round}><Icon n="gear" s={16}/></View>
//         <View style={st.round}><Icon n="dots" s={16}/></View>
//         <Text style={st.title}>LEVEL 5</Text>
//         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View>
//       </View>

//       <Text style={[st.ql,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>

//       {/* board */}
//       <View style={st.boardWrap}>
//         <Animated.View style={{width:bw,height:bh,transform:[{translateX:shake}]}}>
//           {view.items.map(it=>
//             <Veg key={view.stage+'-'+it.id} it={it} bw={bw} bh={bh} glow={glow===it.id}
//               disabled={busy||!!result} onPress={onPick}/>)}
//           {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}>
//             {mark.ok?<Tick/>:<Cross/>}
//           </View>}
//         </Animated.View>
//       </View>

//       <Text style={st.sub}>{view.hint}</Text>

//       {/* bottom bar */}
//       <View style={st.bar}>
//         {[['search','x25',onHint,'#bdeaf2'],['gift','',undefined,'transparent'],['film','+75',undefined,'#d9bff7'],['play','x50',undefined,'#f4a0a0']].map(([n,c,f,bg]:any)=>
//           <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}>
//             <View style={{flexDirection:'row',height:20,alignItems:'center'}}>
//               {c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}
//             </View>
//             <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View>
//           </TouchableOpacity>)}
//       </View>

//       {/* result card */}
//       {!!result&&<View style={st.overlay}>
//         <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
//           <Text style={st.cardTitle}>Level complete!</Text>
//           <Text style={st.cardMsg}>{result.message}</Text>
//           <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
//           <Text style={st.cardScore}>Score {result.score}</Text>
//           <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
//             <Text style={st.nextT}>NEXT</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>}
//     </View>
//   </View>;
// }

// /* =========================================================
//    STYLES  (same notebook look as the other paper levels)
// ========================================================= */

// const st=StyleSheet.create({
//   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},
//   pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
//   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
//   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},
//   hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
//   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},

//   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
//   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
//   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26,minWidth:56},
//   pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},

//   ql:{fontFamily:F,fontSize:18,color:'#444',textAlign:'center',marginTop:18,paddingHorizontal:16},
//   boardWrap:{flex:1,alignItems:'center',justifyContent:'center'},
//   sub:{fontFamily:F,fontSize:14,color:'#8a8a8a',textAlign:'center',marginBottom:6},

//   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},
//   bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},
//   cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},

//   overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
//   card:{width:'82%',alignItems:'center',backgroundColor:'#fffdf8',borderWidth:3,borderColor:INK,borderRadius:22,padding:20},
//   cardTitle:{fontFamily:F,fontSize:28,fontWeight:'800',color:INK},
//   cardMsg:{fontFamily:F,fontSize:17,color:'#555',textAlign:'center',marginTop:6},
//   stars:{flexDirection:'row',gap:6,marginTop:14},
//   cardScore:{fontFamily:F,fontSize:22,fontWeight:'700',color:'#c98a00',marginTop:10},
//   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:'#a6e22e',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   nextT:{fontFamily:F,fontSize:26,fontWeight:'900',color:INK},

//   loading:{fontFamily:F,fontSize:18,color:INK,marginTop:12},
//   err:{fontFamily:F,fontSize:18,color:INK,textAlign:'center',paddingHorizontal:24},
//   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
//   retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
//   back:{fontFamily:F,fontSize:16,color:'#555',marginTop:14,textDecorationLine:'underline'},
// });
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
import {F,INK,Coin} from './BTShared';
import {Icon} from './Art';
import {startLevel5,pickItem,hintLevel5,Level5View,Level5Pick,L5Item} from './Btlevel5api';
import {Cucumber,Zucchini,Gourd,Tomato,Tick,Cross,BigStar,Duster,ChalkPiece} from './Btlevel5art';

const CHALK='#f6f4ea';

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level5Pick)=>void;
};

const CUC_W=112;           // cucumber / zucchini width
const TOM_W=66;

/* =========================================================
   ONE VEGETABLE ON THE BOARD
========================================================= */

function Veg({it,bw,bh,glow,disabled,onPress}:{it:L5Item;bw:number;bh:number;glow:boolean;disabled:boolean;onPress:(it:L5Item)=>void}){
  const w=it.kind==='tomato'?TOM_W:CUC_W;
  const h=it.kind==='tomato'?TOM_W:CUC_W*0.4;
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

  // hint glow
  useEffect(()=>{
    if(!glow){pulse.setValue(0);return}
    const l=Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:420,useNativeDriver:false}),
      Animated.timing(pulse,{toValue:0,duration:420,useNativeDriver:false})]));
    l.start();
    return()=>l.stop();
  },[glow]);


  const Art=it.kind==='cucumber'?Cucumber:it.kind==='zucchini'?Zucchini:it.kind==='gourd'?Gourd:Tomato;

  return <Animated.View pointerEvents={it.hidden?'none':'auto'} style={{
      position:'absolute',left:x,top:y,width:w,height:h,
      transform:[{rotate:it.rot+'deg'},{scale:sc}]}}>
    <Animated.View pointerEvents="none" style={{
      position:'absolute',left:-8,right:-8,top:-8,bottom:-8,borderRadius:20,
      borderWidth:3,borderColor:'#ffd84d',opacity:pulse}}/>
    <Pressable disabled={disabled} hitSlop={10} onPress={()=>onPress(it)} style={{width:w,height:h}}>
      <Art w={w}/>
    </Pressable>
  </Animated.View>;
}

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevel5Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width}=useWindowDimensions();
  const bw=Math.min(width-48,380),bh=300;

  const [view,setView]=useState<Level5View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);
  const [mark,setMark]=useState<{x:number;y:number;ok:boolean}|null>(null);
  const [glow,setGlow]=useState<number|null>(null);
  const [result,setResult]=useState<Level5Pick|null>(null);

  const shake=useRef(new Animated.Value(0)).current;
  const pop=useRef(new Animated.Value(0)).current;
  const sway=useRef(new Animated.Value(0)).current;
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
    msgTimer.current=setTimeout(()=>setMsg(''),2600);
  };

  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
    Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  // 2. the player tapped something -> ask the backend
  const onPick=async(it:L5Item)=>{
    if(busy||!sessionId||!view||result)return;
    setBusy(true);setGlow(null);
    try{
      const res=await pickItem({sessionId,playerId,itemId:it.id});

      if(!res.correct){
        setMark({x:it.x*bw,y:it.y*bh,ok:false});
        doShake();flash(res.message);
        later(()=>setMark(null),700);
        // zucchini -> the server sent a new arrangement
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

  const onHint=async()=>{
    if(busy||!sessionId||result)return;
    try{
      const r=await hintLevel5({sessionId,playerId});
      setHints&&setHints(r.hints);
      setGlow(r.itemId);
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
        <Text style={bd.load}>Loading level 5...</Text>
      </>}
    </View></View></View>;
  }

  const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});

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
            <Text style={bd.signt}>LEVEL 5</Text>
            <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
          </View>
        </Animated.View>
        <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
      </View>

      <Text style={[bd.q,msg?{color:'#ffb4a8'}:null]}>{msg||view.title}</Text>

      {/* vegetables */}
      <View style={bd.boardWrap}>
        <Animated.View style={{width:bw,height:bh,transform:[{translateX:shake}]}}>
          {view.items.map(it=>
            <Veg key={view.stage+'-'+it.id} it={it} bw={bw} bh={bh} glow={glow===it.id}
              disabled={busy||!!result} onPress={onPick}/>)}
          {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}>
            {mark.ok?<Tick/>:<Cross/>}
          </View>}
        </Animated.View>
      </View>

      <Text style={bd.sub}>{view.hint}</Text>

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

/* =========================================================
   STYLES  (same green chalkboard as Level 1)
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

  q:{fontFamily:F,fontSize:25,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,paddingHorizontal:12,
    textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
  boardWrap:{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:150},
  sub:{position:'absolute',bottom:150,fontFamily:F,fontSize:15,fontStyle:'italic',color:'rgba(246,244,234,0.6)',textAlign:'center'},

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
