import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,StyleSheet,Platform,ActivityIndicator,useWindowDimensions} from 'react-native';
import {startLevel21,submitPicks,requestHint21,skipLevel21,Level21View,Level21Action} from './Btlevel21api';
import {RoomBackground,HomeIcon,GearIcon,BulbIcon,SearchIcon,VideoIcon,SkipIcon} from './Btlevel2art';
import {Coin} from './BTShared';
import * as api from './api';

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
const SERIF:any=Platform.select({ios:'Georgia',android:'serif',default:'Georgia, serif'});
const NAVY='#13235b',LIME='#a6e22e',CREAM='#f7f1df',YELLOW='#ffd33d',WRONG='#e5383b',SKY='#9fc6ea';

const HINT_COST=25,SKIP_COST=50; // keep in sync with Braintwistlevel21routes.js

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level21Action)=>void;
};

export default function BTLevel21Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width}=useWindowDimensions();
  const bw=Math.min(width,480);

  const [view,setView]=useState<Level21View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [picked,setPicked]=useState<number[]>([]);
  const [locked,setLocked]=useState<number[]>([]);   // numbers revealed by hints
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);
  const [solved,setSolved]=useState(false);
  const [bal,setBal]=useState<number>(Number(hints)||0);

  const shake=useRef(new Animated.Value(0)).current;
  const win=useRef(new Animated.Value(1)).current;
  const pulse=useRef(new Animated.Value(0)).current;
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const actBusy=useRef(false);
  const lockedR=useRef<number[]>([]);

  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  useEffect(()=>{setBal(Number(hints)||0)},[hints]);
  const updHints=(h:number)=>{setBal(h);if(setHints)setHints(h)};

  const load=useCallback(()=>{
    setLoadErr('');setView(null);setPicked([]);setLocked([]);lockedR.current=[];setSolved(false);
    startLevel21(playerId)
      .then(v=>{setSessionId(v.sessionId);setView(v)})
      .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
  },[playerId]);

  useEffect(()=>{
    load();
    return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
  },[load]);

  useEffect(()=>{
    const p=Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:900,useNativeDriver:true}),
      Animated.timing(pulse,{toValue:0,duration:900,useNativeDriver:true})]));
    p.start();
    return()=>p.stop();
  },[]);

  const showMsg=(m:string)=>{
    setMsg(m);
    clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2800);
  };

  const shakeBoard=()=>{
    Animated.sequence([
      Animated.timing(shake,{toValue:10,duration:60,useNativeDriver:true}),
      Animated.timing(shake,{toValue:-10,duration:60,useNativeDriver:true}),
      Animated.timing(shake,{toValue:6,duration:60,useNativeDriver:true}),
      Animated.timing(shake,{toValue:0,duration:60,useNativeDriver:true})]).start();
  };

  /* frontend -> backend -> MySQL -> JSON back */
  const submit=async(list:number[])=>{
    if(!sessionId)return;
    setBusy(true);
    try{
      const res=await submitPicks({sessionId,playerId,picks:list});
      if(res.correct){
        setSolved(true);
        showMsg(res.message||'Correct!');
        Animated.sequence([
          Animated.timing(win,{toValue:1.06,duration:200,useNativeDriver:true}),
          Animated.spring(win,{toValue:1,friction:4,useNativeDriver:true})]).start();
        later(()=>{onComplete?onComplete(res):onExit()},1400);
        return;
      }
      showMsg(res.message||'Not quite. Try again!');
      shakeBoard();
    }catch(e:any){
      showMsg(e.message||'Network error');
    }
    // wrong: clear the picks, but keep numbers revealed by hints
    later(()=>{setPicked(lockedR.current);setBusy(false)},700);
  };

  const onPick=(i:number)=>{
    if(busy||solved||!view)return;
    if(lockedR.current.includes(i))return;       // hint numbers stay selected
    if(picked.includes(i)){setPicked(picked.filter(x=>x!==i));return}
    if(picked.length>=view.pickCount)return;
    const next=[...picked,i];
    setPicked(next);
    if(next.length===view.pickCount)submit(next);
  };

  const onHint=async()=>{
    if(actBusy.current||busy||solved||!sessionId)return;
    if(bal<HINT_COST){showMsg('Need '+HINT_COST+' hints. You have '+bal+'.');return}
    actBusy.current=true;
    try{
      const r=await requestHint21({sessionId,playerId,locked:lockedR.current});
      if(typeof r.hints==='number')updHints(r.hints);
      if(r.indices){
        lockedR.current=r.indices;
        setLocked(r.indices);
        setPicked(r.indices);
      }
      showMsg(r.message||'Hint used');
    }catch(e:any){
      showMsg(e.message||'Network error');
    }finally{actBusy.current=false}
  };

  const onVideo=async()=>{
    if(actBusy.current)return;
    actBusy.current=true;
    try{
      const r:any=await api.reward(playerId,'video');
      if(typeof r?.hints==='number')updHints(r.hints);
    }catch(e){}
    finally{actBusy.current=false}
  };

  const onSkip=async()=>{
    if(actBusy.current||busy||solved||!sessionId)return;
    if(bal<SKIP_COST){showMsg('Need '+SKIP_COST+' hints. You have '+bal+'.');return}
    actBusy.current=true;
    try{
      const r=await skipLevel21({sessionId,playerId});
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
            <Text style={st.loading}>Loading level 21...</Text>
          </>}
        </View>
      </View>
    </View>;
  }

  const total=picked.reduce((s,i)=>s+(view.numbers[i]||0),0);
  const cell=Math.floor((bw-40)/3);                 // grid cell
  const circle=Math.min(112,cell-22);               // number bubble
  const ring=circle+16;                             // dashed ring
  const numFS=Math.round(circle*0.42);
  const pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.09]});

  const info=msg||(picked.length?`Picked ${picked.length}/${view.pickCount}  •  Total ${total}`:view.hint);

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
              <View style={[st.leaf,{left:-12,top:-9,transform:[{rotate:'-38deg'}]}]}/>
              <View style={[st.leaf,{right:-12,top:-9,transform:[{rotate:'38deg'}]}]}/>
              <Text style={st.chev}>‹</Text>
              <Text style={st.plaqueT}>LEVEL 21</Text>
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

        {/* 3 x 3 number grid */}
        <Animated.View style={[st.grid,{transform:[{translateX:shake},{scale:win}]}]}>
          {view.numbers.map((n,i)=>{
            const on=picked.includes(i);
            const isLocked=locked.includes(i);
            return <View key={i} style={{width:cell,height:cell,alignItems:'center',justifyContent:'center'}}>
              <TouchableOpacity activeOpacity={0.85} onPress={()=>onPick(i)}
                style={[st.ring,{width:ring,height:ring,borderRadius:ring/2},
                  on&&{borderColor:solved?'#5cb04a':isLocked?'#2b8a3e':NAVY}]}>
                <View style={[st.bubble,{width:circle,height:circle,borderRadius:circle/2},
                  on&&{backgroundColor:solved?'#c8f0b8':isLocked?'#d7f5c4':LIME,borderColor:NAVY}]}>
                  <Text style={[st.num,{fontSize:numFS}]}>{n}</Text>
                </View>
              </TouchableOpacity>
            </View>;
          })}
        </Animated.View>

        <Text style={[st.hintText,msg?{color:solved?'#3d9a2c':WRONG}:null]}>{info}</Text>

        <View style={{flex:1}}/>

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
  plaque:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#a85f1a',borderWidth:3,borderColor:'#d9a04d',borderRadius:8,paddingHorizontal:16,paddingVertical:5},
  leaf:{position:'absolute',width:26,height:13,borderRadius:13,backgroundColor:'#6fb13a',borderWidth:1.5,borderColor:'#4a8a25'},
  plaqueT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:'#fff',letterSpacing:0.5},
  chev:{fontSize:26,fontWeight:'900',color:YELLOW,marginTop:-3},
  pillWrap:{minWidth:100,height:44,justifyContent:'center'},
  pill:{height:34,borderRadius:17,backgroundColor:'#fff',justifyContent:'center',paddingLeft:18,paddingRight:30},
  pillT:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#1b1b1b'},
  bulb:{position:'absolute',right:-4,top:-2},

  titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:14,paddingHorizontal:14},
  titlePill:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:CREAM,borderRadius:32,paddingHorizontal:20,paddingVertical:10,
    shadowColor:'#000',shadowOffset:{width:0,height:3},shadowOpacity:0.12,shadowRadius:4,elevation:3},
  titleChev:{fontSize:26,fontWeight:'900',color:'#ff9f1c',marginTop:-2},
  title:{fontFamily:SERIF,fontSize:21,fontStyle:'italic',fontWeight:'700',color:NAVY,textAlign:'center',flexShrink:1},

  grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',marginTop:16,paddingHorizontal:20},
  ring:{alignItems:'center',justifyContent:'center',borderWidth:2,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.9)'},
  bubble:{backgroundColor:CREAM,alignItems:'center',justifyContent:'center',borderWidth:3,borderColor:'#fff',
    shadowColor:'#000',shadowOffset:{width:0,height:3},shadowOpacity:0.18,shadowRadius:4,elevation:4},
  num:{fontFamily:FONT,fontWeight:'900',color:NAVY},

  hintText:{fontFamily:SERIF,fontSize:18,fontWeight:'800',color:NAVY,textAlign:'center',marginTop:8,paddingHorizontal:20},

  barPill:{alignSelf:'center',flexDirection:'row',alignItems:'flex-start',justifyContent:'center',gap:26,
    backgroundColor:'#f6e8cc',borderRadius:46,borderWidth:6,borderColor:'rgba(143,190,235,0.85)',
    paddingHorizontal:26,paddingTop:8,paddingBottom:8,marginBottom:10},
  acol:{alignItems:'center'},
  lblRow:{flexDirection:'row',alignItems:'center',gap:4,height:24,marginTop:5,paddingHorizontal:12,borderRadius:12,backgroundColor:'#6b4423'},
  lbl:{fontFamily:FONT,fontSize:15,fontWeight:'bold',color:'#fff'},
  hintBtn:{width:58,height:58,borderRadius:29,backgroundColor:'#a8e22a',borderWidth:4,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center',elevation:6},
  videoBtn:{width:58,height:58,borderRadius:29,backgroundColor:'#f3efe2',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},
  skipBtn:{width:58,height:58,borderRadius:29,backgroundColor:'#f0484f',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center',elevation:6},

  loading:{fontFamily:FONT,fontSize:18,color:NAVY,marginTop:12},
  errText:{fontFamily:FONT,fontSize:18,color:NAVY,textAlign:'center',paddingHorizontal:24},
  retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:LIME,borderWidth:2.5,borderColor:'#1b1b1b'},
  retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:'#1b1b1b'},
  back:{fontFamily:FONT,fontSize:16,color:NAVY,marginTop:14,textDecorationLine:'underline'},
});