
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Pressable,Animated,PanResponder,StyleSheet,ActivityIndicator,Platform,useWindowDimensions} from 'react-native';
import {Stage,Coin} from './BTShared';
import {Icon} from './Art';
import {startLevel7,sendAction,Level7View,Level7Result,L7Thing} from './Btlevel7api';
import * as mainApi from './api';
import {Room,Thing,Tick,Cross,BigStar,HOT,ROOM_W,ROOM_H} from './Btlevel7art';
import {RoomBackground,THEME} from './Btlevel4Theme';
import {play} from './BTSound';   // same sounds as Level 5 and Level 6

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// the clue is FREE: it never depends on hints, coins or videos.
// one clue per stage (stage 1 = clock, stage 2 = timetable, stage 3 = coins)
const CLUES:Record<number,string>={
  1:'The right time may be hiding in the wrong place… or is the wrong time right in front of you?',
  2:'Find the day that comes right after Tuesday. Look for the book with that day\'s name on it.',
  3:'She already has some coins… but how many more coins does she need to buy the ticket?',
};

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level7Result)=>void;
  // called when the coins / video buttons are tapped. The parent should ONLY add hints here.
  onWatchVideo?:()=>void;
};

/* one draggable item in the tray; it snaps back unless dropped on the target */
function DragItem({thing,onDrop,disabled}:{thing:L7Thing;onDrop:(id:string,x:number,y:number)=>Promise<boolean>;disabled:boolean}){
  const xy=useRef(new Animated.ValueXY()).current;
  const [lift,setLift]=useState(false);
  const live=useRef({disabled,onDrop,thing});
  live.current={disabled,onDrop,thing};
  const back=()=>Animated.spring(xy,{toValue:{x:0,y:0},friction:6,useNativeDriver:true}).start();
  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>!live.current.disabled,
    onPanResponderGrant:()=>{play('drag');setLift(true);xy.setOffset({x:0,y:0});xy.setValue({x:0,y:0})},   // item picked up
    onPanResponderMove:Animated.event([null,{dx:xy.x,dy:xy.y}],{useNativeDriver:false}),
    onPanResponderRelease:async(e,g)=>{
      setLift(false);
      const ok=await live.current.onDrop(live.current.thing.id,g.moveX,g.moveY);
      if(!ok)back();
    },
    onPanResponderTerminate:()=>{setLift(false);back()},
  })).current;
  return <Animated.View {...pr.panHandlers}
    style={[ts.item,{zIndex:lift?60:1,elevation:lift?12:0,transform:[{translateX:xy.x},{translateY:xy.y},{scale:lift?1.15:1}]}]}>
    <Thing id={thing.id} size={62}/>
  </Animated.View>;
}

export default function BTLevel7Screen({playerId,hints=0,setHints,onExit,onComplete,onWatchVideo}:Props){
  const {width,height}=useWindowDimensions();
  const RW=Math.max(240,Math.min(width-36,340,(height-470)*ROOM_W/ROOM_H));   // room width
  const k2=(RW-6)/ROOM_W;                         // room units -> pixels (inside the 3px frame)
  const RH=ROOM_H*k2+6;

  const [view,setView]=useState<Level7View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);
  const [done,setDone]=useState(false);
  const [mark,setMark]=useState<{x:number;y:number}|null>(null);
  const [result,setResult]=useState<Level7Result|null>(null);
  const [clueOpen,setClueOpen]=useState(false);
  const zone=view&&view.target?HOT[view.target]:null;   // where the dragged thing must be dropped

  const shake=useRef(new Animated.Value(0)).current;
  const pop=useRef(new Animated.Value(0)).current;
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
    if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
  },[result]);

  // new stage -> close the clue popup (each stage has its own clue)
  useEffect(()=>{setClueOpen(false)},[view?.stage]);

  const flash=(m:string)=>{
    setMsg(m);clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2800);
  };
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
    Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  // 2. send the player's action; the backend decides if it is right
  const act=async(kind:'tap'|'drag',item:string,target:string|undefined,at:{x:number;y:number}):Promise<boolean>=>{
    if(busy||done||!sessionId||!view)return false;
    setBusy(true);
    try{
      const res=await sendAction({sessionId,playerId,kind,item,target});
      if(!res.correct){
        play('wrong');                                  // wrong answer
        setMark(at);doShake();flash(res.message);
        later(()=>setMark(null),700);
        setBusy(false);
        return false;
      }
      play('correct');                                  // right answer
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
    play('tap');                                        // something in the room tapped
    act('tap',id,undefined,{x:3+(h.x+h.w/2)*k2,y:3+(h.y+h.h/2)*k2});
  };

  // dropped somewhere: only counts when the finger is over the target
  const onDrop=(id:string,mx:number,my:number):Promise<boolean>=>new Promise(resolve=>{
    const node:any=babyRef.current;
    if(!node||!zone||!node.measureInWindow){resolve(false);return}
    node.measureInWindow((x:number,y:number,w:number,h:number)=>{
      const inside=mx>=x&&mx<=x+w&&my>=y&&my<=y+h;
      if(!inside){resolve(false);return}
      act('drag',id,view?.target||'',{x:3+(zone.x+zone.w/2)*k2,y:3+(zone.y+zone.h/2)*k2}).then(resolve);
    });
  });

  // 3. magnifier tapped -> show the clue directly (free, no hints / coins / video needed)
  const onHint=async()=>{
    if(done||busy)return;
    play('clue');
    setBusy(true);
    try{
      const r=await mainApi.recordHintUse(17,playerId);
      if(typeof r.hints==='number')setHints&&setHints(r.hints);
      setClueOpen(true);
    }catch(e:any){flash(e?.message||'Could not load hint')}
    finally{setBusy(false)}
  };

  const watchVideo=()=>{play('btn');onWatchVideo&&onWatchVideo()};

  /* ---------- header (home, wooden sign, hints pill) ---------- */

  const header=(
    <View style={st.topBar}>
      <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={()=>{play('btn');onExit()}}>
        <Icon n="home" s={16}/>
      </TouchableOpacity>

      <View style={st.signWrap}>
        <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
        <View style={st.sign}>
          <Text style={st.signArrow}>{'<'}</Text>
          <Text style={st.signT}>LEVEL 7</Text>
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
          <Text style={st.load}>Loading level 7...</Text>
        </>}
      </View>
    </View></Stage>;
  }

  const tap=view.mode==='tap';
  const stageNo=Math.min(3,Math.max(1,Number(view.stage)||1));

  return <Stage bg="#bddaee"><View style={st.root}>
    <RoomBackground/>
    {header}

    <View style={st.center}>
      {/* question pill (same as level 1) */}
      <View style={st.qPill}>
        <Text style={st.qArrow}>{'<'}</Text>
        <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
        <Text style={st.qArrow}>{'>'}</Text>
      </View>

      {/* the room scene */}
      <Animated.View style={{width:RW,height:RH,marginTop:10,transform:[{translateX:shake}]}}>
        <View style={st.panelFrame}><Room w={RW-6} mood={view.scene.mood}/></View>

        {/* drop target: the bag (stage 2) or Mia (stage 3), set by the server */}
        {!!zone&&<View ref={babyRef} collapsable={false} pointerEvents="none"
          style={{position:'absolute',left:3+zone.x*k2,top:3+zone.y*k2,width:zone.w*k2,height:zone.h*k2}}/>}

        {/* tap stage: invisible hotspots over every thing in the room */}
        {tap&&!done&&view.objects.map(o=>{
          const h=HOT[o.id];
          if(!h)return null;
          return <Pressable key={o.id} onPress={()=>onTap(o.id)}
            style={{position:'absolute',left:3+h.x*k2,top:3+h.y*k2,width:h.w*k2,height:h.h*k2,borderRadius:12}}/>;
        })}

        {done&&<View pointerEvents="none" style={{position:'absolute',left:RW/2-40,top:RH*0.3}}><Tick s={80}/></View>}
        {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}><Cross/></View>}
      </Animated.View>

      {/* drag stage: items to drag onto the target */}
      {!tap&&!done&&<View style={ts.row}>
        {view.tray.map(t=><DragItem key={view.stage+'-'+t.id} thing={t} disabled={busy} onDrop={onDrop}/>)}
      </View>}
    </View>

    {/* bottom rounded panel (same as level 1) */}
    <View style={st.panel}>
      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
          <View style={st.circleGreen}><Icon n="search" s={32}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
      </View>

      <View style={st.btnCol}>
        {/* coins / video button: the parent ONLY adds hints, it never opens the clue */}
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={watchVideo}>
          <Icon n="film" s={36}/>
        </TouchableOpacity>
        <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
      </View>

      <View style={st.btnCol}>
        <View style={st.ringWhite}><View style={st.circleRed}><Icon n="play" s={30}/></View></View>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
      </View>
    </View>

    {/* CLUES popup (only from the magnifier, the clue of the current stage) */}
    {clueOpen&&<View style={st.overlay}>
      <View style={st.clueCard}>
        <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>{play('btn');setClueOpen(false)}}>
          <Text style={st.closeT}>✕</Text>
        </TouchableOpacity>
        <Text style={st.clueTitle}>HINTS</Text>

        <View style={[st.clueRow,st.clueRowOpen]}>
          <View style={st.clueNum}><Text style={st.clueNumT}>{stageNo}</Text></View>
          <View style={{flex:1}}>
            <Text style={st.clueHead}>{'Hint '+stageNo}</Text>
            <Text style={st.clueBody}>{CLUES[stageNo]}</Text>
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

const ts=StyleSheet.create({
  row:{flexDirection:'row',justifyContent:'center',gap:14,marginTop:16,zIndex:30,elevation:10},
  item:{width:76,height:76,borderRadius:16,backgroundColor:'rgba(255,248,230,0.95)',borderWidth:3,borderColor:'#d98b3d',alignItems:'center',justifyContent:'center'},
});

/* =========================================================
   STYLES  (same cozy room theme as Level 1 / 5 / 6)
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
  q:{flexShrink:1,fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

  panelFrame:{borderWidth:3,borderColor:THEME.wood,borderRadius:12,overflow:'hidden',backgroundColor:'#eef1f4'},

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