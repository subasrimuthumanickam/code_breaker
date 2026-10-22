
import React,{useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Pressable,Animated,PanResponder,StyleSheet} from 'react-native';
import {Icon} from './Art';
import {F,INK,Stage,Coin,loop} from './BTShared';
import {RoomBg,Giraffe,Fridge,FRIDGE_W,FRIDGE_H} from './Btlevel14art';
import {startLevel14,sendAction14,hint14,skip14,reward14,Action} from './Btlevel14api';

const NAVY='#10245e',CREAM='#fbf6e9',SKY='#9fc6ea';

// positions inside the 320 x 300 play area
const GX=14,GY=76,GW=100,GH=150;              // giraffe
const FX=170,FY=40;                            // fridge (size from art file)

type Props={playerId:number;hints:number;setHints:(n:number)=>void;onExit:()=>void;onComplete:(r:any)=>void};

export default function BTLevel14Screen({playerId,hints,setHints,onExit,onComplete}:Props){
  const[sid,setSid]=useState<number|null>(null),[open,setOpen]=useState(false),[giraffeIn,setGiraffeIn]=useState(false),
    [note,setNote]=useState(''),[done,setDone]=useState(false);
  const door=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current;
  const sway=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,qIn=useRef(new Animated.Value(0)).current,shake=useRef(new Animated.Value(0)).current;
  const busy=useRef(false),sidR=useRef<number|null>(null),doneR=useRef(false),putR=useRef<any>(null);
  sidR.current=sid;doneR.current=done;

  const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1800)};
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();
  const back=()=>Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start();

  const startedR=useRef(false);
  // opens a fresh game on the backend (only abandons the old one when we really need a new one)
  const begin=async()=>{
    try{const r=await startLevel14(playerId);
      if(r.success){sidR.current=r.sessionId;setSid(r.sessionId);setOpen(false);setGiraffeIn(false);return r.sessionId}
      flash(r.message||'Cannot start level')}
    catch(e){flash('Cannot reach server')}
    return null};

  useEffect(()=>{
    if(!startedR.current){startedR.current=true;begin()}   // React runs effects twice in dev: start only once
    loop(sway,1800);loop(pulse,900);
    Animated.spring(qIn,{toValue:1,friction:6,tension:70,useNativeDriver:true}).start();
  },[]);

  useEffect(()=>{Animated.timing(door,{toValue:open?1:0,duration:420,useNativeDriver:true}).start()},[open]);

  const finish=(r:any)=>{setDone(true);flash(r.message||'Done!');setTimeout(()=>onComplete(r),1100)};

  // every move goes to the backend -> MySQL, the backend answers in JSON
  const act=async(a:Action)=>{
    if(!sidR.current)return null;
    try{const r=await sendAction14(sidR.current,playerId,a);
      if(r.status===409&&!doneR.current){await begin();flash('Game restarted. Try again!');return null}
      if(!r.success){flash(r.message||'Error');return null}
      return r}
    catch(e){flash('Network error');return null}};

  const tapFridge=async()=>{
    if(busy.current||doneR.current)return;busy.current=true;
    try{const r=await act(open?'close_fridge':'open_fridge');if(!r)return;
      setOpen(r.state.open);setGiraffeIn(r.state.giraffeIn);
      if(r.completed)finish(r)}
    finally{busy.current=false}};

  const putIn=async()=>{
    if(busy.current||doneR.current){back();return}busy.current=true;
    try{const r=await act('giraffe_in');
      if(!r){back();return}
      if(!r.correct){flash(r.message||'Not yet!');doShake();back();return}
      setGiraffeIn(true);setOpen(r.state.open);pan.setValue({x:0,y:0})}
    finally{busy.current=false}};
  putR.current=putIn;

  // drag the giraffe onto the fridge, or just tap it
  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>!doneR.current,
    onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
    onPanResponderRelease:(_,g)=>{
      const moved=Math.hypot(g.dx,g.dy),cx=GX+GW/2+g.dx,cy=GY+GH/2+g.dy;
      const hit=cx>FX&&cx<FX+FRIDGE_W&&cy>FY&&cy<FY+FRIDGE_H;
      if(moved<8||hit)putR.current&&putR.current();else back()}})).current;

  const hint=async()=>{if(!sid)return;try{const r=await hint14(sid,playerId);
    if(r.status===402){flash('Not enough hints');return}
    if(r.success){setHints(r.hints);flash(r.text)}}catch(e){flash('Network error')}};
  const reward=async()=>{try{const r=await reward14(playerId);if(r.success)setHints(r.hints)}catch(e){}};
  const skip=async()=>{if(!sid)return;try{const r=await skip14(sid,playerId);
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
            <Text style={bd.signt}>LEVEL 14</Text>
            <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
          </View>
        </Animated.View>
        <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
      </View>

      {/* question banner */}
      <Animated.View style={[bd.qWrap,{opacity:qIn,transform:[{translateY:qY}]}]}>
        <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
        <Text style={bd.q}>Put the giraffe into the fridge.</Text>
        <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
      </Animated.View>

      {/* play area */}
      <Animated.View style={{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:240,transform:[{translateX:shake}]}}>
        <View style={{width:320,height:300}}>
          <Pressable onPress={tapFridge} style={{position:'absolute',left:FX,top:FY,width:FRIDGE_W,height:FRIDGE_H}}>
            <Fridge door={door}>
              {giraffeIn&&<View style={{position:'absolute',left:(FRIDGE_W-80)/2,top:FRIDGE_H-120-12}}><Giraffe w={80}/></View>}
            </Fridge>
          </Pressable>
          {!giraffeIn&&<Animated.View {...pr.panHandlers} style={{position:'absolute',left:GX,top:GY,zIndex:5,transform:pan.getTranslateTransform()}}>
            <Giraffe w={GW}/>
          </Animated.View>}
        </View>
      </Animated.View>

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
  actions:{position:'absolute',left:0,right:0,bottom:34,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
  acol:{alignItems:'center'},
  lblRow:{flexDirection:'row',alignItems:'center',gap:4,height:26,marginTop:6,paddingHorizontal:12,borderRadius:13,backgroundColor:'#6b4423'},
  lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
  hintBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#a8e22a',borderWidth:4,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center',elevation:6},
  videoBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f3efe2',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},
  skipBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f0484f',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},
  note:{position:'absolute',bottom:6,alignSelf:'center',fontFamily:F,fontSize:17,fontWeight:'bold',color:'#c0392b'}});
