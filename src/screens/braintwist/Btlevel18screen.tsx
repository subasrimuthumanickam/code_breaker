
import React,{useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet} from 'react-native';
import {Icon} from './Art';
import {F,INK,Stage,Coin,loop} from './BTShared';
import {RoomBg} from './Btlevel14art';   // same cozy room background as the other levels
import {startLevel18,answer18,hint18,skip18,reward18} from './Btlevel18api';

const NAVY='#10245e',CREAM='#fbf6e9',SKY='#9fc6ea';
const TILE=68;
// pastel sticky tiles like the reference picture
const COLORS=['#fde58a','#fb9aa5','#cfb9f4','#a9dcf6','#a9efc3','#f9c999','#f9b7d7','#a9dcf6'];
const ROT=[-5,3,-3,4,4,-4,2,-3];

type Props={playerId:number;hints:number;setHints:(n:number)=>void;onExit:()=>void;onComplete:(r:any)=>void};
type Tile={id:number;ch:string};

export default function BTLevel18Screen({playerId,hints,setHints,onExit,onComplete}:Props){
  const[sid,setSid]=useState<number|null>(null),[tiles,setTiles]=useState<Tile[]>([]),[len,setLen]=useState(0),
    [title,setTitle]=useState('Arrange the letters to find the correct word.'),[clue,setClue]=useState(''),
    [picked,setPicked]=useState<number[]>([]),[state,setState]=useState<'idle'|'bad'|'good'>('idle'),
    [note,setNote]=useState(''),[done,setDone]=useState(false);
  const sway=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,qIn=useRef(new Animated.Value(0)).current,shake=useRef(new Animated.Value(0)).current;
  const busy=useRef(false),sidR=useRef<number|null>(null),doneR=useRef(false),startedR=useRef(false);
  sidR.current=sid;doneR.current=done;

  const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1800)};
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  // opens a game on the backend (only once, or again if the old session was closed)
  const begin=async()=>{
    try{const r=await startLevel18(playerId);
      if(r.success){sidR.current=r.sessionId;setSid(r.sessionId);setTiles(r.tiles||[]);setLen(r.length||0);
        if(r.title)setTitle(r.title);if(r.clue)setClue(r.clue);setPicked([]);setState('idle');return r.sessionId}
      flash(r.message||'Cannot start level')}
    catch(e){flash('Cannot reach server')}
    return null};

  useEffect(()=>{
    if(!startedR.current){startedR.current=true;begin()}
    loop(sway,1800);loop(pulse,900);
    Animated.spring(qIn,{toValue:1,friction:6,tension:70,useNativeDriver:true}).start();
  },[]);

  const finish=(r:any)=>{setDone(true);setState('good');flash(r.message||'Done!');setTimeout(()=>onComplete(r),1200)};

  // when every slot is filled, the backend checks the word
  useEffect(()=>{if(len&&picked.length===len&&!doneR.current)check()},[picked]);

  const check=async()=>{
    if(busy.current||!sidR.current)return;busy.current=true;
    const word=picked.map(id=>tiles.find(t=>t.id===id)?.ch||'').join('');
    try{const r=await answer18(sidR.current,playerId,word);
      if(r.status===409){await begin();flash('Game restarted. Try again!');return}
      if(!r.success){flash(r.message||'Error');setPicked([]);return}
      if(r.correct)finish(r);
      else{setState('bad');doShake();flash(r.message||'Not quite. Try again!');setTimeout(()=>{setPicked([]);setState('idle')},900)}}
    catch(e){flash('Network error');setPicked([])}
    finally{busy.current=false}};

  const pickTile=(id:number)=>{if(done||state!=='idle'||picked.includes(id)||picked.length>=len)return;setPicked(p=>[...p,id])};
  const removeAt=(i:number)=>{if(done||state!=='idle')return;setPicked(p=>p.filter((_,k)=>k!==i))};

  const hint=async()=>{if(!sid)return;try{const r=await hint18(sid,playerId);
    if(r.status===402){flash('Not enough hints');return}
    if(r.success){setHints(r.hints);flash(r.text)}}catch(e){flash('Network error')}};
  const reward=async()=>{try{const r=await reward18(playerId);if(r.success)setHints(r.hints)}catch(e){}};
  const skip=async()=>{if(!sid)return;try{const r=await skip18(sid,playerId);
    if(r.status===402){flash('Not enough hints');return}
    if(r.success){setHints(r.hints);onComplete(r)}}catch(e){flash('Network error')}};

  const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']}),
    pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.09]}),
    qY=qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]});

  const slotBg=state==='bad'?'#f9b4ad':state==='good'?'#b6ef63':CREAM;

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
            <Text style={bd.signt}>LEVEL 18</Text>
            <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
          </View>
        </Animated.View>
        <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
      </View>

      {/* question banner */}
      <Animated.View style={[bd.qWrap,{opacity:qIn,transform:[{translateY:qY}]}]}>
        <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
        <View style={{flexShrink:1,alignItems:'center'}}>
          <Text style={bd.q}>{title}</Text>
          {!!clue&&<Text style={bd.clue}>{clue}</Text>}
        </View>
        <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
      </Animated.View>

      {/* letter tiles */}
      <Animated.View style={[bd.tiles,{transform:[{translateX:shake}]}]}>
        {tiles.length===0&&<Text style={bd.load}>Loading...</Text>}
        {tiles.map((t,i)=>{const used=picked.includes(t.id);
          return <Pressable key={t.id} disabled={used||done} onPress={()=>pickTile(t.id)}
            style={[bd.tile,{backgroundColor:COLORS[i%COLORS.length],opacity:used?0.25:1,transform:[{rotate:ROT[i%ROT.length]+'deg'}]}]}>
            <Text style={bd.tileT}>{t.ch}</Text></Pressable>})}
      </Animated.View>

      {/* answer slots */}
      <Animated.View style={[bd.slots,{transform:[{translateX:shake}]}]}>
        {Array.from({length:len},(_,i)=>{const id=picked[i],ch=id!==undefined?tiles.find(t=>t.id===id)?.ch:'';
          return <Pressable key={i} onPress={()=>removeAt(i)} style={[bd.slot,{backgroundColor:ch?slotBg:'rgba(255,255,255,0.35)'}]}>
            <Text style={bd.slotT}>{ch}</Text></Pressable>})}
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
  load:{fontFamily:F,fontSize:22,color:NAVY},
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
  qWrap:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:CREAM,borderRadius:28,paddingHorizontal:16,paddingVertical:10,marginTop:20,maxWidth:'94%',elevation:4,shadowColor:'#000',shadowOpacity:0.15,shadowRadius:4,shadowOffset:{width:0,height:2}},
  q:{fontFamily:F,fontSize:19,fontWeight:'bold',color:NAVY,textAlign:'center'},
  clue:{fontFamily:F,fontSize:14,color:'#3a4a7a',textAlign:'center',marginTop:3},
  tiles:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',width:330,gap:14,marginTop:26},
  tile:{width:TILE,height:TILE,borderRadius:14,borderWidth:2,borderStyle:'dashed',borderColor:'#2b2b2b',alignItems:'center',justifyContent:'center',elevation:3,shadowColor:'#000',shadowOpacity:0.18,shadowRadius:3,shadowOffset:{width:0,height:2}},
  tileT:{fontFamily:F,fontSize:38,fontWeight:'900',color:'#1c1c1c',includeFontPadding:false},
  slots:{flexDirection:'row',justifyContent:'center',gap:6,marginTop:22,maxWidth:'96%'},
  slot:{width:41,height:48,borderRadius:12,borderWidth:2,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.95)',alignItems:'center',justifyContent:'center'},
  slotT:{fontFamily:F,fontSize:28,fontWeight:'900',color:NAVY,includeFontPadding:false},
  actions:{position:'absolute',left:0,right:0,bottom:34,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
  acol:{alignItems:'center'},
  lblRow:{flexDirection:'row',alignItems:'center',gap:4,height:26,marginTop:6,paddingHorizontal:12,borderRadius:13,backgroundColor:'#6b4423'},
  lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
  hintBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#a8e22a',borderWidth:4,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center',elevation:6},
  videoBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f3efe2',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},
  skipBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f0484f',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},
  note:{position:'absolute',bottom:6,alignSelf:'center',fontFamily:F,fontSize:17,fontWeight:'bold',color:'#c0392b'}});
