
// import React,{useCallback,useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Animated,StyleSheet,Platform,ActivityIndicator,useWindowDimensions} from 'react-native';
// import {startLevel2,submitWord,Level2View,Level2Action} from './Btlevel2api';
// import {ClueArt,RoomBackground,HomeIcon,GearIcon,BulbIcon} from './Btlevel2art';

// const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// const NAVY='#13235b',LIME='#a6e22e',CREAM='#f7f1df',YELLOW='#ffd33d',WRONG='#e5383b',SKY='#9fc6ea';

// const ROWS=['QWERTYUIOP','ASDFGHJKL','ZXCVBNM<'];

// type Props={
//   playerId:number;
//   hints?:number;
//   onExit:()=>void;
//   onComplete?:(result:Level2Action)=>void;
// };

// export default function BTLevel2Screen({playerId,hints=0,onExit,onComplete}:Props){
//   const {width}=useWindowDimensions();
//   const bw=Math.min(width,480);          // game column: same on phone and website
//   const cardW=bw-32;
//   const gap=5;
//   const keyW=Math.floor((bw-16-gap*9)/10);

//   const [view,setView]=useState<Level2View|null>(null);
//   const [sessionId,setSessionId]=useState<number|null>(null);
//   const [loadErr,setLoadErr]=useState('');
//   const [typed,setTyped]=useState('');
//   const [msg,setMsg]=useState('');
//   const [busy,setBusy]=useState(false);
//   const [solved,setSolved]=useState(false);
//   const [pressed,setPressed]=useState('');

//   const shake=useRef(new Animated.Value(0)).current;
//   const bob=useRef(new Animated.Value(0)).current;
//   const win=useRef(new Animated.Value(1)).current;
//   const timers=useRef<any[]>([]);
//   const msgTimer=useRef<any>(null);

//   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

//   const load=useCallback(()=>{
//     setLoadErr('');setView(null);setTyped('');
//     startLevel2(playerId)
//       .then(v=>{setSessionId(v.sessionId);setView(v)})
//       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
//   },[playerId]);

//   useEffect(()=>{
//     load();
//     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
//   },[load]);

//   useEffect(()=>{
//     const l=Animated.loop(Animated.sequence([
//       Animated.timing(bob,{toValue:1,duration:900,useNativeDriver:true}),
//       Animated.timing(bob,{toValue:0,duration:900,useNativeDriver:true})]));
//     l.start();
//     return()=>l.stop();
//   },[]);

//   const showMsg=(m:string)=>{
//     setMsg(m);
//     clearTimeout(msgTimer.current);
//     msgTimer.current=setTimeout(()=>setMsg(''),2800);
//   };

//   const shakeCard=()=>{
//     Animated.sequence([
//       Animated.timing(shake,{toValue:10,duration:60,useNativeDriver:true}),
//       Animated.timing(shake,{toValue:-10,duration:60,useNativeDriver:true}),
//       Animated.timing(shake,{toValue:6,duration:60,useNativeDriver:true}),
//       Animated.timing(shake,{toValue:0,duration:60,useNativeDriver:true})]).start();
//   };

//   const submit=async(word:string)=>{
//     if(!sessionId)return;
//     setBusy(true);
//     try{
//       const res=await submitWord({sessionId,playerId,answer:word});
//       if(res.correct){
//         setSolved(true);
//         showMsg(res.message||'Correct!');
//         Animated.sequence([
//           Animated.timing(win,{toValue:1.12,duration:200,useNativeDriver:true}),
//           Animated.spring(win,{toValue:1,friction:4,useNativeDriver:true})]).start();
//         // no modal: go straight to the next screen
//         later(()=>{onComplete?onComplete(res):onExit()},1400);
//         return;
//       }
//       showMsg(res.message||'Not quite. Try again!');
//       shakeCard();
//     }catch(e:any){
//       showMsg(e.message||'Network error');
//     }
//     later(()=>{setTyped('');setBusy(false)},450);
//   };

//   const onKey=(k:string)=>{
//     if(busy||solved||!view)return;
//     if(k==='<'){setTyped(t=>t.slice(0,-1));return}
//     if(typed.length>=view.length)return;
//     const next=typed+k;
//     setTyped(next);
//     if(next.length===view.length)submit(next);
//   };

//   /* ---------- loading / error ---------- */

//   if(loadErr||!view){
//     return <View style={st.page}>
//       <View style={[st.col,{width:bw}]}>
//         <RoomBackground/>
//         <View style={[st.board,{alignItems:'center',justifyContent:'center'}]}>
//           {loadErr?<>
//             <Text style={st.errText}>{loadErr}</Text>
//             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
//             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
//           </>:<>
//             <ActivityIndicator color={NAVY} size="large"/>
//             <Text style={st.loading}>Loading level 2...</Text>
//           </>}
//         </View>
//       </View>
//     </View>;
//   }

//   const slotW=Math.min(36,Math.floor((cardW-48)/view.length)-6);

//   return <View style={st.page}>
//     <View style={[st.col,{width:bw}]}>
//       <RoomBackground/>
//       <View style={st.board}>

//         <View style={st.header}>
//           <View style={st.headLeft}>
//             <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon/></TouchableOpacity>
//             <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon/></TouchableOpacity>
//           </View>
//           <View style={st.signWrap}>
//             <View style={[st.rope,{left:18,transform:[{rotate:'-8deg'}]}]}/>
//             <View style={[st.rope,{right:18,transform:[{rotate:'8deg'}]}]}/>
//             <View style={st.plaque}>
//               <Text style={st.chev}>‹</Text>
//               <Text style={st.plaqueT}>LEVEL 2</Text>
//               <Text style={st.chev}>›</Text>
//             </View>
//           </View>
//           <View style={st.pillWrap}>
//             <View style={st.pill}><Text style={st.pillT}>{hints}</Text></View>
//             <View style={st.bulb}><BulbIcon size={28}/></View>
//           </View>
//         </View>

//         <View style={st.titleRow}>
//           <View style={st.titlePill}>
//             <Text style={st.titleChev}>‹</Text>
//             <Text style={st.title}>{view.title}</Text>
//             <Text style={st.titleChev}>›</Text>
//           </View>
//         </View>

//         <Animated.View style={{alignItems:'center',marginTop:20,transform:[{translateX:shake},{scale:win}]}}>
//           <View style={[st.paper,{width:cardW}]}>
//             <View style={st.holes}>{Array.from({length:8}).map((_,i)=><View key={i} style={st.hole}/>)}</View>
//             {[0,1,2,3,4].map(i=><View key={i} style={[st.ruled,{top:52+i*34}]}/>)}

//             <View style={st.clueRow}>
//               <Animated.View style={{transform:[{translateY:bob.interpolate({inputRange:[0,1],outputRange:[0,-6]})}]}}>
//                 <ClueArt size={108}/>
//               </Animated.View>
//               <Text style={st.clueText}>{view.clueText}</Text>
//             </View>

//             <View style={st.slots}>
//               {Array.from({length:view.length}).map((_,i)=>
//                 <View key={i} style={[st.slot,{width:slotW},solved&&{borderBottomColor:'#5cb04a'}]}>
//                   <Text style={[st.slotT,solved&&{color:'#3d9a2c'}]}>{typed[i]||''}</Text>
//                 </View>)}
//             </View>
//           </View>
//         </Animated.View>

//         <Text style={[st.hintText,msg?{color:solved?'#3d9a2c':WRONG}:null]}>{msg||view.hint}</Text>

//         <View style={{flex:1}}/>

//         <View style={st.keyboard}>
//           {ROWS.map(row=>
//             <View key={row} style={st.keyRow}>
//               {row.split('').map(k=>{
//                 const isBack=k==='<';
//                 return <TouchableOpacity key={k} activeOpacity={0.8}
//                   onPressIn={()=>setPressed(k)} onPressOut={()=>setPressed('')}
//                   onPress={()=>onKey(k)}
//                   style={[st.key,{width:keyW,height:Math.round(keyW*1.3)},isBack&&{backgroundColor:'#ffd8d8'},pressed===k&&{backgroundColor:LIME}]}>
//                   <Text style={st.keyT}>{isBack?'⌫':k}</Text>
//                 </TouchableOpacity>;
//               })}
//             </View>)}
//         </View>
//       </View>
//     </View>
//   </View>;
// }

// const st=StyleSheet.create({
//   page:{flex:1,backgroundColor:SKY,alignItems:'center'},
//   col:{flex:1,overflow:'hidden',backgroundColor:SKY},
//   board:{flex:1,paddingTop:14,paddingBottom:18},

//   header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12},
//   headLeft:{flexDirection:'row',gap:8},
//   round:{width:40,height:40,borderRadius:20,backgroundColor:'#ffd83a',borderWidth:2.5,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
//   signWrap:{alignItems:'center',paddingTop:14},
//   rope:{position:'absolute',top:0,width:3,height:16,backgroundColor:'#6b4a1a'},
//   plaque:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#9a5a1c',borderWidth:3,borderColor:'#c98a3e',borderRadius:6,paddingHorizontal:14,paddingVertical:5},
//   plaqueT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:'#fff',letterSpacing:0.5},
//   chev:{fontSize:26,fontWeight:'900',color:YELLOW,marginTop:-3},
//   pillWrap:{minWidth:100,height:44,justifyContent:'center'},
//   pill:{height:34,borderRadius:17,backgroundColor:'#fff',justifyContent:'center',paddingLeft:18,paddingRight:30},
//   pillT:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#1b1b1b'},
//   bulb:{position:'absolute',right:-4,top:-2},

//   titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:14},
//   titlePill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:CREAM,borderRadius:28,paddingHorizontal:20,paddingVertical:8,
//     shadowColor:'#000',shadowOffset:{width:0,height:3},shadowOpacity:0.12,shadowRadius:4,elevation:3},
//   titleChev:{fontSize:24,fontWeight:'900',color:YELLOW,marginTop:-2},
//   title:{fontFamily:FONT,fontSize:24,fontWeight:'800',color:NAVY},

//   paper:{backgroundColor:'#fff',borderRadius:6,paddingTop:34,paddingBottom:22,paddingHorizontal:16,transform:[{rotate:'-1.2deg'}],
//     shadowColor:'#000',shadowOffset:{width:0,height:5},shadowOpacity:0.18,shadowRadius:7,elevation:5,overflow:'hidden'},
//   holes:{position:'absolute',top:8,left:0,right:0,flexDirection:'row',justifyContent:'space-evenly'},
//   hole:{width:14,height:14,borderRadius:7,backgroundColor:'#c3dcf1'},
//   ruled:{position:'absolute',left:0,right:0,height:1.5,backgroundColor:'#dfe8f2'},
//   clueRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12},
//   clueText:{fontFamily:FONT,fontSize:50,fontWeight:'900',color:'#111'},
//   slots:{flexDirection:'row',justifyContent:'center',gap:6,marginTop:18},
//   slot:{height:46,borderBottomWidth:4,borderBottomColor:NAVY,alignItems:'center',justifyContent:'flex-end'},
//   slotT:{fontFamily:FONT,fontSize:32,fontWeight:'900',color:NAVY,lineHeight:40},

//   hintText:{fontFamily:FONT,fontSize:18,fontWeight:'700',color:NAVY,textAlign:'center',marginTop:16,paddingHorizontal:20},

//   keyboard:{alignItems:'center',gap:8,paddingHorizontal:8},
//   keyRow:{flexDirection:'row',justifyContent:'center',gap:5},
//   key:{backgroundColor:CREAM,borderRadius:9,borderWidth:2,borderColor:'rgba(19,35,91,0.25)',alignItems:'center',justifyContent:'center',
//     shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.15,shadowRadius:2,elevation:2},
//   keyT:{fontFamily:FONT,fontSize:22,fontWeight:'800',color:NAVY},

//   loading:{fontFamily:FONT,fontSize:18,color:NAVY,marginTop:12},
//   errText:{fontFamily:FONT,fontSize:18,color:NAVY,textAlign:'center',paddingHorizontal:24},
//   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:LIME,borderWidth:2.5,borderColor:'#1b1b1b'},
//   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:'#1b1b1b'},
//   back:{fontFamily:FONT,fontSize:16,color:NAVY,marginTop:14,textDecorationLine:'underline'},
// });
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,StyleSheet,Platform,ActivityIndicator,useWindowDimensions} from 'react-native';
import {startLevel2,submitWord,requestHint,skipLevel2,Level2View,Level2Action} from './Btlevel2api';
import {ClueArt,RoomBackground,HomeIcon,GearIcon,BulbIcon,SearchIcon,VideoIcon,SkipIcon} from './Btlevel2art';
import {Coin} from './BTShared';
import * as api from './api';

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
const NAVY='#13235b',LIME='#a6e22e',CREAM='#f7f1df',YELLOW='#ffd33d',WRONG='#e5383b',SKY='#9fc6ea';

const HINT_COST=25,SKIP_COST=50; // keep in sync with Braintwistlevel2routes.js

const ROWS=['QWERTYUIOP','ASDFGHJKL','ZXCVBNM<'];

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level2Action)=>void;
};

export default function BTLevel2Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width}=useWindowDimensions();
  const bw=Math.min(width,480);          // game column: same on phone and website
  const cardW=bw-32;
  const gap=5;
  const keyW=Math.floor((bw-16-gap*9)/10);

  const [view,setView]=useState<Level2View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [typed,setTyped]=useState('');
  const [locked,setLocked]=useState(0);      // letters revealed by hints (cannot be deleted)
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);
  const [solved,setSolved]=useState(false);
  const [pressed,setPressed]=useState('');
  const [bal,setBal]=useState<number>(Number(hints)||0);   // current hint (bulb) balance

  const shake=useRef(new Animated.Value(0)).current;
  const bob=useRef(new Animated.Value(0)).current;
  const win=useRef(new Animated.Value(1)).current;
  const pulse=useRef(new Animated.Value(0)).current;
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const actBusy=useRef(false);               // no double hint / skip / video taps
  const lockedR=useRef(0);

  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  useEffect(()=>{setBal(Number(hints)||0)},[hints]);

  const updHints=(h:number)=>{setBal(h);if(setHints)setHints(h)};

  const load=useCallback(()=>{
    setLoadErr('');setView(null);setTyped('');setLocked(0);lockedR.current=0;
    startLevel2(playerId)
      .then(v=>{setSessionId(v.sessionId);setView(v)})
      .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
  },[playerId]);

  useEffect(()=>{
    load();
    return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
  },[load]);

  useEffect(()=>{
    const l=Animated.loop(Animated.sequence([
      Animated.timing(bob,{toValue:1,duration:900,useNativeDriver:true}),
      Animated.timing(bob,{toValue:0,duration:900,useNativeDriver:true})]));
    l.start();
    const p=Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:900,useNativeDriver:true}),
      Animated.timing(pulse,{toValue:0,duration:900,useNativeDriver:true})]));
    p.start();
    return()=>{l.stop();p.stop()};
  },[]);

  const showMsg=(m:string)=>{
    setMsg(m);
    clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2800);
  };

  const shakeCard=()=>{
    Animated.sequence([
      Animated.timing(shake,{toValue:10,duration:60,useNativeDriver:true}),
      Animated.timing(shake,{toValue:-10,duration:60,useNativeDriver:true}),
      Animated.timing(shake,{toValue:6,duration:60,useNativeDriver:true}),
      Animated.timing(shake,{toValue:0,duration:60,useNativeDriver:true})]).start();
  };

  const submit=async(word:string)=>{
    if(!sessionId)return;
    setBusy(true);
    try{
      const res=await submitWord({sessionId,playerId,answer:word});
      if(res.correct){
        setSolved(true);
        showMsg(res.message||'Correct!');
        Animated.sequence([
          Animated.timing(win,{toValue:1.12,duration:200,useNativeDriver:true}),
          Animated.spring(win,{toValue:1,friction:4,useNativeDriver:true})]).start();
        // no modal: go straight to the next screen
        later(()=>{onComplete?onComplete(res):onExit()},1400);
        return;
      }
      showMsg(res.message||'Not quite. Try again!');
      shakeCard();
    }catch(e:any){
      showMsg(e.message||'Network error');
    }
    // wrong answer: clear what was typed, but keep the letters revealed by hints
    later(()=>{setTyped(t=>t.slice(0,lockedR.current));setBusy(false)},450);
  };

  const onKey=(k:string)=>{
    if(busy||solved||!view)return;
    if(k==='<'){setTyped(t=>t.length>lockedR.current?t.slice(0,-1):t);return}
    if(typed.length>=view.length)return;
    const next=typed+k;
    setTyped(next);
    if(next.length===view.length)submit(next);
  };

  /* ---------- hint: reveals the next letter (costs HINT_COST) ---------- */
  const onHint=async()=>{
    if(actBusy.current||busy||solved||!sessionId)return;
    if(bal<HINT_COST){showMsg('Need '+HINT_COST+' hints. You have '+bal+'.');return}
    actBusy.current=true;
    try{
      const r:any=await requestHint({sessionId,playerId,revealed:lockedR.current});
      if(typeof r.hints==='number')updHints(r.hints);
      if(r.prefix){
        lockedR.current=r.prefix.length;
        setLocked(r.prefix.length);
        setTyped(r.prefix);
      }
      showMsg(r.message||'Hint used');
    }catch(e:any){
      showMsg(e.message||'Network error');
    }finally{actBusy.current=false}
  };

  /* ---------- video: free hints (+75) ---------- */
  const onVideo=async()=>{
    if(actBusy.current)return;
    actBusy.current=true;
    try{
      const r:any=await api.reward(playerId,'video');
      if(typeof r?.hints==='number')updHints(r.hints);
    }catch(e){}
    finally{actBusy.current=false}
  };

  /* ---------- skip: costs SKIP_COST, completes the level ---------- */
  const onSkip=async()=>{
    if(actBusy.current||busy||solved||!sessionId)return;
    if(bal<SKIP_COST){showMsg('Need '+SKIP_COST+' hints. You have '+bal+'.');return}
    actBusy.current=true;
    try{
      const r:any=await skipLevel2({sessionId,playerId});
      if(typeof r.hints==='number')updHints(r.hints);
      setSolved(true);
      showMsg('Skipped!');
      later(()=>{onComplete?onComplete({...r,skipped:true}):onExit()},900);
    }catch(e:any){
      showMsg(e.message||'Network error');
    }finally{actBusy.current=false}
  };

  /* ---------- loading / error ---------- */

  if(loadErr||!view){
    return <View style={st.page}>
      <View style={[st.col,{width:bw}]}>
        <RoomBackground/>
        <View style={[st.board,{alignItems:'center',justifyContent:'center'}]}>
          {loadErr?<>
            <Text style={st.errText}>{loadErr}</Text>
            <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
            <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
          </>:<>
            <ActivityIndicator color={NAVY} size="large"/>
            <Text style={st.loading}>Loading level 2...</Text>
          </>}
        </View>
      </View>
    </View>;
  }

  const slotW=Math.min(36,Math.floor((cardW-48)/view.length)-6);
  const pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.09]});

  return <View style={st.page}>
    <View style={[st.col,{width:bw}]}>
      <RoomBackground/>
      <View style={st.board}>

        <View style={st.header}>
          <View style={st.headLeft}>
            <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon/></TouchableOpacity>
            <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon/></TouchableOpacity>
          </View>
          <View style={st.signWrap}>
            <View style={[st.rope,{left:18,transform:[{rotate:'-8deg'}]}]}/>
            <View style={[st.rope,{right:18,transform:[{rotate:'8deg'}]}]}/>
            <View style={st.plaque}>
              <Text style={st.chev}>‹</Text>
              <Text style={st.plaqueT}>LEVEL 2</Text>
              <Text style={st.chev}>›</Text>
            </View>
          </View>
          <View style={st.pillWrap}>
            <View style={st.pill}><Text style={st.pillT}>{bal}</Text></View>
            <View style={st.bulb}><BulbIcon size={28}/></View>
          </View>
        </View>

        <View style={st.titleRow}>
          <View style={st.titlePill}>
            <Text style={st.titleChev}>‹</Text>
            <Text style={st.title}>{view.title}</Text>
            <Text style={st.titleChev}>›</Text>
          </View>
        </View>

        <Animated.View style={{alignItems:'center',marginTop:14,transform:[{translateX:shake},{scale:win}]}}>
          <View style={[st.paper,{width:cardW}]}>
            <View style={st.holes}>{Array.from({length:8}).map((_,i)=><View key={i} style={st.hole}/>)}</View>
            {[0,1,2,3,4].map(i=><View key={i} style={[st.ruled,{top:52+i*34}]}/>)}

            <View style={st.clueRow}>
              <Animated.View style={{transform:[{translateY:bob.interpolate({inputRange:[0,1],outputRange:[0,-6]})}]}}>
                <ClueArt size={96}/>
              </Animated.View>
              <Text style={st.clueText}>{view.clueText}</Text>
            </View>

            <View style={st.slots}>
              {Array.from({length:view.length}).map((_,i)=>
                <View key={i} style={[st.slot,{width:slotW},solved&&{borderBottomColor:'#5cb04a'}]}>
                  <Text style={[st.slotT,i<locked&&!solved&&{color:'#2b8a3e'},solved&&{color:'#3d9a2c'}]}>{typed[i]||''}</Text>
                </View>)}
            </View>
          </View>
        </Animated.View>

        <Text style={[st.hintText,msg?{color:solved?'#3d9a2c':WRONG}:null]}>{msg||view.hint}</Text>

        <View style={{flex:1}}/>

        {/* hint / video / skip  (same as Level 1) */}
        <View style={st.barPill}>
          <View style={st.acol}>
            <Animated.View style={{transform:[{scale:pulseS}]}}>
              <TouchableOpacity activeOpacity={0.8} style={st.hintBtn} onPress={onHint}><SearchIcon size={30}/></TouchableOpacity>
            </Animated.View>
            <View style={st.lblRow}><BulbIcon size={14}/><Text style={st.lbl}>{HINT_COST}</Text></View>
          </View>
          <View style={st.acol}>
            <TouchableOpacity activeOpacity={0.8} style={st.videoBtn} onPress={onVideo}><VideoIcon size={34}/></TouchableOpacity>
            <View style={st.lblRow}><Coin s={12}/><Text style={st.lbl}>+75</Text></View>
          </View>
          <View style={st.acol}>
            <TouchableOpacity activeOpacity={0.8} style={st.skipBtn} onPress={onSkip}><SkipIcon size={30}/></TouchableOpacity>
            <View style={st.lblRow}><BulbIcon size={14}/><Text style={st.lbl}>{SKIP_COST}</Text></View>
          </View>
        </View>

        <View style={st.keyboard}>
          {ROWS.map(row=>
            <View key={row} style={st.keyRow}>
              {row.split('').map(k=>{
                const isBack=k==='<';
                return <TouchableOpacity key={k} activeOpacity={0.8}
                  onPressIn={()=>setPressed(k)} onPressOut={()=>setPressed('')}
                  onPress={()=>onKey(k)}
                  style={[st.key,{width:keyW,height:Math.round(keyW*1.15)},isBack&&{backgroundColor:'#ffd8d8'},pressed===k&&{backgroundColor:LIME}]}>
                  <Text style={st.keyT}>{isBack?'⌫':k}</Text>
                </TouchableOpacity>;
              })}
            </View>)}
        </View>
      </View>
    </View>
  </View>;
}

const st=StyleSheet.create({
  page:{flex:1,backgroundColor:SKY,alignItems:'center'},
  col:{flex:1,overflow:'hidden',backgroundColor:SKY},
  board:{flex:1,paddingTop:14,paddingBottom:14},

  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12},
  headLeft:{flexDirection:'row',gap:8},
  round:{width:40,height:40,borderRadius:20,backgroundColor:'#ffd83a',borderWidth:2.5,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
  signWrap:{alignItems:'center',paddingTop:14},
  rope:{position:'absolute',top:0,width:3,height:16,backgroundColor:'#6b4a1a'},
  plaque:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#9a5a1c',borderWidth:3,borderColor:'#c98a3e',borderRadius:6,paddingHorizontal:14,paddingVertical:5},
  plaqueT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:'#fff',letterSpacing:0.5},
  chev:{fontSize:26,fontWeight:'900',color:YELLOW,marginTop:-3},
  pillWrap:{minWidth:100,height:44,justifyContent:'center'},
  pill:{height:34,borderRadius:17,backgroundColor:'#fff',justifyContent:'center',paddingLeft:18,paddingRight:30},
  pillT:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#1b1b1b'},
  bulb:{position:'absolute',right:-4,top:-2},

  titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:12},
  titlePill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:CREAM,borderRadius:28,paddingHorizontal:20,paddingVertical:8,
    shadowColor:'#000',shadowOffset:{width:0,height:3},shadowOpacity:0.12,shadowRadius:4,elevation:3},
  titleChev:{fontSize:24,fontWeight:'900',color:YELLOW,marginTop:-2},
  title:{fontFamily:FONT,fontSize:24,fontWeight:'800',color:NAVY},

  paper:{backgroundColor:'#fff',borderRadius:6,paddingTop:30,paddingBottom:18,paddingHorizontal:16,transform:[{rotate:'-1.2deg'}],
    shadowColor:'#000',shadowOffset:{width:0,height:5},shadowOpacity:0.18,shadowRadius:7,elevation:5,overflow:'hidden'},
  holes:{position:'absolute',top:8,left:0,right:0,flexDirection:'row',justifyContent:'space-evenly'},
  hole:{width:14,height:14,borderRadius:7,backgroundColor:'#c3dcf1'},
  ruled:{position:'absolute',left:0,right:0,height:1.5,backgroundColor:'#dfe8f2'},
  clueRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12},
  clueText:{fontFamily:FONT,fontSize:50,fontWeight:'900',color:'#111'},
  slots:{flexDirection:'row',justifyContent:'center',gap:6,marginTop:14},
  slot:{height:46,borderBottomWidth:4,borderBottomColor:NAVY,alignItems:'center',justifyContent:'flex-end'},
  slotT:{fontFamily:FONT,fontSize:32,fontWeight:'900',color:NAVY,lineHeight:40},

  hintText:{fontFamily:FONT,fontSize:17,fontWeight:'700',color:NAVY,textAlign:'center',marginTop:10,paddingHorizontal:20},

  /* hint / video / skip bar (same look as Level 1) */
  barPill:{alignSelf:'center',flexDirection:'row',alignItems:'flex-start',justifyContent:'center',gap:26,
    backgroundColor:'#f6e8cc',borderRadius:46,borderWidth:6,borderColor:'rgba(143,190,235,0.85)',
    paddingHorizontal:26,paddingTop:8,paddingBottom:8,marginBottom:10},
  acol:{alignItems:'center'},
  lblRow:{flexDirection:'row',alignItems:'center',gap:4,height:24,marginTop:5,paddingHorizontal:12,borderRadius:12,backgroundColor:'#6b4423'},
  lbl:{fontFamily:FONT,fontSize:15,fontWeight:'bold',color:'#fff'},
  hintBtn:{width:58,height:58,borderRadius:29,backgroundColor:'#a8e22a',borderWidth:4,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center',elevation:6},
  videoBtn:{width:58,height:58,borderRadius:29,backgroundColor:'#f3efe2',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},
  skipBtn:{width:58,height:58,borderRadius:29,backgroundColor:'#f0484f',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},

  keyboard:{alignItems:'center',gap:7,paddingHorizontal:8},
  keyRow:{flexDirection:'row',justifyContent:'center',gap:5},
  key:{backgroundColor:CREAM,borderRadius:9,borderWidth:2,borderColor:'rgba(19,35,91,0.25)',alignItems:'center',justifyContent:'center',
    shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.15,shadowRadius:2,elevation:2},
  keyT:{fontFamily:FONT,fontSize:22,fontWeight:'800',color:NAVY},

  loading:{fontFamily:FONT,fontSize:18,color:NAVY,marginTop:12},
  errText:{fontFamily:FONT,fontSize:18,color:NAVY,textAlign:'center',paddingHorizontal:24},
  retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:LIME,borderWidth:2.5,borderColor:'#1b1b1b'},
  retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:'#1b1b1b'},
  back:{fontFamily:FONT,fontSize:16,color:NAVY,marginTop:14,textDecorationLine:'underline'},
});
