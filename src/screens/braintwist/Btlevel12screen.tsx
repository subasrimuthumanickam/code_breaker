
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Pressable,Animated,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
import {F,INK,Coin} from './BTShared';
import {Icon} from './Art';
import {Backdrop,Room12,Calendar,OBJECTS,CAL,SCENE_W,SCENE_H} from './Btlevel12art';
import {startLevel12,tapLevel12,hintLevel12,skipLevel12,rewardLevel12,Level12View,Level12Result,CalendarDate} from './Btlevel12api';

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level12Result)=>void;
};

export default function BTLevel12Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width}=useWindowDimensions();
  const SW=Math.min(width-24,380);                 // game card width
  const IW=SW-6;                                   // inside the 3px border
  const k=IW/SCENE_W;                              // scene units -> pixels

  const [view,setView]=useState<Level12View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [done,setDone]=useState(false);
  const [date,setDate]=useState<CalendarDate>({weekday:'TUESDAY',month:'OCT',day:1});
  const [glow,setGlow]=useState(false);
  const [confirmSkip,setConfirmSkip]=useState(false);

  const flip=useRef(new Animated.Value(1)).current;     // calendar flip (scaleY)
  const shake=useRef(new Animated.Value(0)).current;
  const sway=useRef(new Animated.Value(0)).current;
  const pulse=useRef(new Animated.Value(0)).current;

  const doneRef=useRef(false);
  const busyRef=useRef(false);
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  const flash=(m:string)=>{
    setMsg(m);clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2600);
  };
  const doShake=()=>Animated.sequence([8,-8,5,-5,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  // 1. open the level - the backend makes a new game
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel12(playerId)
      .then(v=>{
        doneRef.current=false;busyRef.current=false;
        setDone(false);setGlow(false);
        flip.setValue(1);
        setDate(v.calendar);
        setSessionId(v.sessionId);
        setView(v);
        if(setHints&&typeof v.hints==='number')setHints(v.hints);
      })
      .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
  },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{
    load();
    return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
  },[load]);

  useEffect(()=>{
    const a=Animated.loop(Animated.sequence([
      Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
      Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
    const b=Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:500,useNativeDriver:true}),
      Animated.timing(pulse,{toValue:0,duration:500,useNativeDriver:true})]));
    a.start();b.start();
    return()=>{a.stop();b.stop()};
  },[]);

  // 2. the player tapped something: the backend says if it is the right one
  const onTap=async(target:string)=>{
    if(doneRef.current||busyRef.current||!sessionId)return;
    busyRef.current=true;
    setConfirmSkip(false);
    try{
      const r=await tapLevel12({sessionId,playerId,target});
      if(r.correct){
        doneRef.current=true;
        setDone(true);setGlow(false);
        if(setHints&&typeof r.hints==='number')setHints(r.hints);
        // the calendar flips over to the new date
        Animated.timing(flip,{toValue:0,duration:170,useNativeDriver:true}).start(()=>{
          if(r.calendar)setDate(r.calendar);
          Animated.spring(flip,{toValue:1,friction:5,tension:90,useNativeDriver:true}).start();
        });
        // no result card: after the calendar flips, go straight on
        later(()=>{onComplete?onComplete(r):onExit()},1600);
      }else{
        doShake();
        flash(r.message||'Not that one. Try again!');
      }
    }catch(e:any){
      flash(e.message||'Network error');
    }finally{
      busyRef.current=false;
    }
  };

  // magnifier: the backend tells what to look at (25 hints)
  const onHint=async()=>{
    if(done||!sessionId)return;
    setConfirmSkip(false);
    try{
      const r=await hintLevel12({sessionId,playerId});
      setHints&&setHints(r.hints);
      flash(r.text);
      setGlow(true);
      later(()=>setGlow(false),4000);
    }catch(e:any){
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }
  };

  // video reward (+75 hints)
  const onReward=async()=>{
    if(done)return;
    setConfirmSkip(false);
    try{
      const r=await rewardLevel12(playerId);
      setHints&&setHints(r.hints);
      flash('+'+r.added+' hints');
    }catch(e:any){
      flash(e.message||'Network error');
    }
  };

  // skip (50 hints): tap twice
  const onSkip=async()=>{
    if(done||!sessionId)return;
    if(!confirmSkip){
      setConfirmSkip(true);
      flash('Skip costs 50 hints. Tap again to skip.');
      return;
    }
    try{
      const r=await skipLevel12({sessionId,playerId});
      setHints&&setHints(r.hints||0);
      doneRef.current=true;
      onComplete?onComplete(r):onExit();
    }catch(e:any){
      setConfirmSkip(false);
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }
  };

  /* ---------- loading / error ---------- */

  if(loadErr||!view){
    return <View style={s.root}>
      <Backdrop/>
      <View style={s.center}>
        {loadErr?<>
          <Text style={s.err}>{loadErr}</Text>
          <TouchableOpacity style={s.retry} onPress={load}><Text style={s.retryT}>Try again</Text></TouchableOpacity>
          <TouchableOpacity onPress={onExit}><Text style={s.back}>Back</Text></TouchableOpacity>
        </>:<>
          <ActivityIndicator size="large" color="#1b2a5c"/>
          <Text style={s.load}>Loading level 12...</Text>
        </>}
      </View>
    </View>;
  }

  const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
  const glowS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.18]});

  return <View style={s.root}>
    <Backdrop/>

    {/* top bar */}
    <View style={s.top}>
      <View style={s.topL}>
        <TouchableOpacity style={s.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
        <View style={s.round}><Icon n="gear" s={16}/></View>
      </View>
      <Animated.View style={[s.signWrap,{transform:[{rotate:swayR}]}]}>
        <View style={[s.leaf,{left:-14,top:-4,transform:[{rotate:'-30deg'}]}]}/>
        <View style={[s.leaf,{right:-14,top:-4,transform:[{rotate:'30deg'}]}]}/>
        <View style={[s.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[s.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
        <View style={s.sign}>
          <Text style={s.chev}>{'<'}</Text>
          <Text style={s.signt}>LEVEL 12</Text>
          <Text style={s.chev}>{'>'}</Text>
        </View>
      </Animated.View>
      <View style={s.topR}><View style={s.bpill}><Text style={s.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
    </View>

    {/* question */}
    <View style={s.qWrap}>
      <View style={s.qPill}>
        <Text style={s.qChev}>{'<'}</Text>
        <Text style={[s.qText,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
        <Text style={s.qChev}>{'>'}</Text>
      </View>
    </View>

    {/* the room: tap the thing that helps her */}
    <Animated.View style={[s.cardWrap,{transform:[{translateX:shake}]}]}>
      <View style={[s.card,{width:SW}]}>
        <Room12 w={IW}/>

        {/* calendar (flips to the new date when the answer is right) */}
        <Animated.View pointerEvents="none"
          style={{position:'absolute',left:CAL.x*k,top:CAL.y*k,transform:[{scaleY:flip}]}}>
          <Calendar w={CAL.w*k} weekday={date.weekday} month={date.month} day={date.day}/>
        </Animated.View>

        {/* hint ring around the calendar */}
        {glow&&!done&&<Animated.View pointerEvents="none"
          style={{position:'absolute',left:(CAL.x-3)*k,top:(CAL.y-3)*k,width:(CAL.w+6)*k,height:(CAL.h+6)*k,
            borderWidth:3,borderColor:'#ffb300',borderRadius:8,transform:[{scale:glowS}]}}/>}

        {/* tap areas */}
        {OBJECTS.map(o=><Pressable key={o.id} onPress={()=>onTap(o.id)}
          style={{position:'absolute',left:o.x*k,top:o.y*k,width:o.w*k,height:o.h*k}}/>)}
      </View>
    </Animated.View>

    {/* tray with hint / video / skip */}
    <View style={s.tray}>
      <View style={s.acol}>
        <TouchableOpacity style={s.hintBtn} onPress={onHint}><Icon n="search" s={34}/></TouchableOpacity>
      </View>
      <View style={s.acol}>
        <TouchableOpacity style={s.videoBtn} onPress={onReward}><Icon n="film" s={40}/></TouchableOpacity>
      </View>
      <View style={s.acol}>
        <TouchableOpacity style={s.skipBtn} onPress={onSkip}><Icon n="play" s={36}/></TouchableOpacity>
      </View>
    </View>
    <View style={s.labels}>
      <View style={s.lblPill}><Icon n="bulb" s={14}/><Text style={s.lbl}>25</Text></View>
      <View style={s.lblPill}><Coin s={14}/><Text style={s.lbl}>+75</Text></View>
      <View style={s.lblPill}><Icon n="bulb" s={14}/><Text style={s.lbl}>50</Text></View>
    </View>

  </View>;
}

/* =========================================================
   STYLES  (bright room like level 1)
========================================================= */

const NAVY='#1b2a5c';

const s=StyleSheet.create({
  root:{flex:1,backgroundColor:'#bfe0f7',overflow:'hidden'},
  center:{flex:1,alignItems:'center',justifyContent:'center'},

  top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:34,paddingHorizontal:10},
  topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
  topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
  round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
  signWrap:{alignItems:'center',paddingTop:14},
  string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
  leaf:{position:'absolute',width:26,height:16,borderRadius:10,backgroundColor:'#6fc23e',zIndex:2},
  sign:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#9a5a22',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:12,paddingVertical:6},
  signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
  chev:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#ffd84d'},
  bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
  bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},

  qWrap:{alignItems:'center',marginTop:14,paddingHorizontal:12},
  qPill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#fbf1dd',borderRadius:30,paddingHorizontal:16,paddingVertical:10,maxWidth:'100%'},
  qChev:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#f2a900'},
  qText:{flexShrink:1,fontFamily:F,fontSize:19,fontWeight:'700',color:NAVY,textAlign:'center'},

  cardWrap:{alignItems:'center',marginTop:16},
  card:{borderWidth:3,borderColor:'#d9c9a8',borderRadius:14,overflow:'hidden',backgroundColor:'#ffffff',height:undefined},

  tray:{position:'absolute',left:18,right:18,bottom:62,height:112,borderRadius:56,backgroundColor:'#f8e9cf',flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:8},
  acol:{alignItems:'center'},
  hintBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
  videoBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#ffffff',borderWidth:3,borderColor:'#efe6d2',alignItems:'center',justifyContent:'center'},
  skipBtn:{width:66,height:66,borderRadius:33,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#ffffff',alignItems:'center',justifyContent:'center'},
  labels:{position:'absolute',left:18,right:18,bottom:22,flexDirection:'row',justifyContent:'space-around'},
  lblPill:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'#5b3a1e',borderRadius:14,paddingHorizontal:12,height:28},
  lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},

  overlay:{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
  rCard:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
  rTitle:{fontFamily:F,fontSize:28,fontWeight:'800',color:'#fff'},
  rMsg:{fontFamily:F,fontSize:17,color:'#d8f3e3',textAlign:'center',marginTop:6},
  stars:{flexDirection:'row',gap:6,marginTop:14},
  rScore:{fontFamily:F,fontSize:22,fontWeight:'700',color:'#ffd33d',marginTop:10},
  next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:'#a6e22e',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
  nextT:{fontFamily:F,fontSize:26,fontWeight:'900',color:INK},

  load:{fontFamily:F,fontSize:22,color:NAVY,marginTop:12},
  err:{fontFamily:F,fontSize:18,color:NAVY,textAlign:'center',paddingHorizontal:24},
  retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
  retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
  back:{fontFamily:F,fontSize:16,color:NAVY,marginTop:14,textDecorationLine:'underline'},
});
