
import React,{useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet} from 'react-native';
import Svg,{Circle} from 'react-native-svg';
import {Icon} from './Art';
import {F,INK,Stage,Coin,loop} from './BTShared';
import {RoomBg} from './Btlevel14art';   // same cozy room background as the other levels
import {startLevel17,reveal17,answer17,hint17,skip17,reward17} from './Btlevel17api';

const NAVY='#10245e',CREAM='#fbf6e9',SKY='#9fc6ea';
const BALL=84;            // circle size
const MOVE_TO_REVEAL=55;  // how far the circle must move before the number shows

type Props={playerId:number;hints:number;setHints:(n:number)=>void;onExit:()=>void;onComplete:(r:any)=>void};

/* the movable circle that hides the number: same cream bubble + dashed ring as the number bubbles in the app */
const Ball=()=><Svg width={BALL} height={BALL} viewBox="0 0 100 100">
  <Circle cx="50" cy="54" r="38" fill="rgba(0,0,0,0.12)"/>
  <Circle cx="50" cy="50" r="48" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeDasharray="5 5" fill="rgba(255,255,255,0.18)"/>
  <Circle cx="50" cy="50" r="38" fill={CREAM}/>
</Svg>;

export default function BTLevel17Screen({playerId,hints,setHints,onExit,onComplete}:Props){
  const[sid,setSid]=useState<number|null>(null),[value,setValue]=useState<number|null>(null),[typed,setTyped]=useState(''),
    [ov,setOv]=useState<string|null>(null),[note,setNote]=useState(''),[done,setDone]=useState(false);
  const pos=useRef({x:0,y:0}),pan=useRef(new Animated.ValueXY()).current;
  const sway=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,qIn=useRef(new Animated.Value(0)).current,shake=useRef(new Animated.Value(0)).current;
  const busy=useRef(false),sidR=useRef<number|null>(null),doneR=useRef(false),revealedR=useRef(false),startedR=useRef(false),revealFn=useRef<any>(null);
  sidR.current=sid;doneR.current=done;

  const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1800)};
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  // opens a game on the backend (only called once, or again if the old session was closed)
  const begin=async()=>{
    try{const r=await startLevel17(playerId);
      if(r.success){sidR.current=r.sessionId;setSid(r.sessionId);revealedR.current=false;setValue(null);return r.sessionId}
      flash(r.message||'Cannot start level')}
    catch(e){flash('Cannot reach server')}
    return null};

  useEffect(()=>{
    if(!startedR.current){startedR.current=true;begin()}
    loop(sway,1800);loop(pulse,900);
    Animated.spring(qIn,{toValue:1,friction:6,tension:70,useNativeDriver:true}).start();
  },[]);

  const finish=(r:any)=>{setDone(true);flash(r.message||'Done!');setTimeout(()=>onComplete(r),1100)};

  // the circle was moved -> ask the backend for the hidden number
  const doReveal=async()=>{
    if(revealedR.current||!sidR.current)return;revealedR.current=true;
    try{const r=await reveal17(sidR.current,playerId);
      if(r.status===409){revealedR.current=false;await begin();return}
      if(r.success)setValue(r.value);else revealedR.current=false}
    catch(e){revealedR.current=false;flash('Network error')}};
  revealFn.current=doReveal;

  // drag the circle anywhere
  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>!doneR.current,
    onPanResponderMove:(_,g)=>{
      const x=pos.current.x+g.dx,y=pos.current.y+g.dy;
      pan.setValue({x,y});
      if(Math.hypot(x,y)>MOVE_TO_REVEAL)revealFn.current&&revealFn.current()},
    onPanResponderRelease:(_,g)=>{pos.current={x:pos.current.x+g.dx,y:pos.current.y+g.dy}}})).current;

  const submit=async()=>{
    if(!typed||doneR.current||busy.current||!sidR.current)return;busy.current=true;
    try{const r=await answer17(sidR.current,playerId,Number(typed));
      if(r.status===409){await begin();flash('Game restarted. Try again!');setTyped('');return}
      if(!r.success){flash(r.message||'Error');return}
      if(r.correct){setOv('check');finish(r)}
      else{doShake();setOv('cross');flash(r.message||'Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}}
    catch(e){flash('Network error')}
    finally{busy.current=false}};

  const hint=async()=>{if(!sid)return;try{const r=await hint17(sid,playerId);
    if(r.status===402){flash('Not enough hints');return}
    if(r.success){setHints(r.hints);flash(r.text)}}catch(e){flash('Network error')}};
  const reward=async()=>{try{const r=await reward17(playerId);if(r.success)setHints(r.hints)}catch(e){}};
  const skip=async()=>{if(!sid)return;try{const r=await skip17(sid,playerId);
    if(r.status===402){flash('Not enough hints');return}
    if(r.success){setHints(r.hints);onComplete(r)}}catch(e){flash('Network error')}};

  const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']}),
    pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.09]}),
    qY=qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]});

  return <Stage bg={SKY}><View style={bd.wall}>
    <RoomBg/>
    <View style={bd.board}>

      {/* top bar */}
      <View style={bd.top}>
        <View style={bd.topL}>
          <TouchableOpacity onPress={onExit} style={bd.round}><Icon n="home" s={16}/></TouchableOpacity>
          <TouchableOpacity style={bd.round}><Icon n="gear" s={16}/></TouchableOpacity>
        </View>
        <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
          <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
          <View style={bd.sign}>
            <View style={[bd.leafTop,{left:-8,transform:[{rotate:'-30deg'}]}]}/><View style={[bd.leafTop,{right:-8,transform:[{rotate:'30deg'}]}]}/>
            <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
            <Text style={bd.signt}>LEVEL 17</Text>
            <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
          </View>
        </Animated.View>
        <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
      </View>

      {/* question banner */}
      <Animated.View style={[bd.qWrap,{opacity:qIn,transform:[{translateY:qY}]}]}>
        <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
        <Text style={bd.q}>What is the hidden number?</Text>
        <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
      </Animated.View>

      {/* the sequence: 5-15-25-( )-100 */}
      <Animated.View style={[bd.seqRow,{transform:[{translateX:shake}]}]}>
        <Text style={bd.seq}>5-15-25-</Text>
        <View style={bd.slot}>
          {value!==null&&<View style={bd.slotRing}/>}
          {value!==null&&<Text style={bd.slotNum}>{value}</Text>}
          {/* the circle sits on top of the number, drag it away */}
          <Animated.View {...pr.panHandlers} style={[bd.ball,{transform:pan.getTranslateTransform()}]}><Ball/></Animated.View>
        </View>
        <Text style={bd.seq}>-100</Text>
      </Animated.View>

      {/* keypad */}
      <View style={bd.kwrap}>
        <View style={bd.krow}>
          <TouchableOpacity style={[bd.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={bd.kst}>✕</Text></TouchableOpacity>
          <View style={bd.kpill}><Text style={bd.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={bd.cov}><Icon n={ov} s={52}/></View>}</View>
          <TouchableOpacity style={[bd.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={submit}><Text style={bd.kst}>✓</Text></TouchableOpacity>
        </View>
        {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={bd.krow}>{row.map(d=>
          <TouchableOpacity key={d} style={bd.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,3))}><Text style={bd.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
      </View>

      {/* hint / video / skip */}
      <View style={bd.actions}>
        <View style={bd.acol}>
          <Animated.View style={{transform:[{scale:pulseS}]}}><TouchableOpacity style={bd.hintBtn} onPress={hint}><Icon n="search" s={34}/></TouchableOpacity></Animated.View>
          <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
        </View>
        <View style={bd.acol}>
          <TouchableOpacity style={bd.videoBtn} onPress={reward}><Icon n="film" s={40}/></TouchableOpacity>
          <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
        </View>
        <View style={bd.acol}>
          <TouchableOpacity style={bd.skipBtn} onPress={skip}><Icon n="play" s={36}/></TouchableOpacity>
          <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
        </View>
      </View>

      {!!note&&<Text style={bd.note}>{note}</Text>}
    </View>
  </View></Stage>;
}

const bd=StyleSheet.create({
  wall:{flex:1,backgroundColor:SKY,overflow:'hidden'},
  board:{flex:1,alignItems:'center',paddingTop:30},
  round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
  top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
  topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
  topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
  signWrap:{alignItems:'center',paddingTop:14},
  string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#9a6a3a'},
  sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#a8601f',borderWidth:3,borderColor:'#d98b3d',borderRadius:8,paddingHorizontal:12,paddingVertical:6,elevation:6,shadowColor:'#000',shadowOpacity:0.25,shadowRadius:4,shadowOffset:{width:0,height:3}},
  leafTop:{position:'absolute',top:-12,width:16,height:24,borderRadius:12,backgroundColor:'#5fae3a'},
  signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
  dashes:{gap:4,justifyContent:'center'},dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffc83d'},
  bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
  bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},
  qWrap:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:CREAM,borderRadius:30,paddingHorizontal:22,paddingVertical:10,marginTop:22,elevation:4,shadowColor:'#000',shadowOpacity:0.15,shadowRadius:4,shadowOffset:{width:0,height:2}},
  q:{fontFamily:F,fontSize:24,fontWeight:'bold',color:NAVY,textAlign:'center'},
  seqRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:34,zIndex:20},
  seq:{fontFamily:F,fontSize:36,fontWeight:'900',color:NAVY,includeFontPadding:false},
  slot:{width:BALL+8,height:BALL+8,alignItems:'center',justifyContent:'center',marginHorizontal:2},
  slotRing:{position:'absolute',width:BALL+8,height:BALL+8,borderRadius:(BALL+8)/2,borderWidth:2,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.95)',backgroundColor:'rgba(255,255,255,0.18)'},
  slotNum:{position:'absolute',fontFamily:F,fontSize:44,fontWeight:'900',color:NAVY,includeFontPadding:false},
  ball:{position:'absolute',zIndex:30,elevation:30,width:BALL,height:BALL},
  kwrap:{position:'absolute',left:0,right:0,bottom:150,alignItems:'center',gap:8},
  krow:{flexDirection:'row',alignItems:'center',gap:8},
  kside:{width:38,height:38,borderRadius:19,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
  kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},
  knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-2,alignItems:'center'},
  kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
  actions:{position:'absolute',left:0,right:0,bottom:34,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
  acol:{alignItems:'center'},
  lblRow:{flexDirection:'row',alignItems:'center',gap:4,height:26,marginTop:6,paddingHorizontal:12,borderRadius:13,backgroundColor:'#6b4423'},
  lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
  hintBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#a8e22a',borderWidth:4,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center',elevation:6},
  videoBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f3efe2',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},
  skipBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f0484f',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},
  note:{position:'absolute',bottom:6,alignSelf:'center',fontFamily:F,fontSize:17,fontWeight:'bold',color:'#c0392b'}});
