import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
import Svg,{Line,Path} from 'react-native-svg';
import {F,INK,Coin} from './BTShared';
import {Icon} from './Art';
import {startLevel6,connectDots,hintLevel6,Level6View,Level6Connect,L6Dot,L6Edge} from './Btlevel6api';
import {Tick,Cross,BigStar,Duster,ChalkPiece,dotPath} from './Btlevel6art';

const CHALK='#f6f4ea';
const DOT_R=14;          // drawn size of a dot
const GRAB=38;           // how close a finger must be to a dot to pick it up / drop on it

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level6Connect)=>void;
};

export default function BTLevel6Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width}=useWindowDimensions();
  const S=Math.min(width-48,340);                 // square drawing area

  const [view,setView]=useState<Level6View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);
  const [drag,setDrag]=useState<{x1:number;y1:number;x2:number;y2:number}|null>(null);
  const [mark,setMark]=useState<{x:number;y:number}|null>(null);
  const [glow,setGlow]=useState<{from:number;to:number}|null>(null);
  const [done,setDone]=useState(false);
  const [result,setResult]=useState<Level6Connect|null>(null);

  const shake=useRef(new Animated.Value(0)).current;
  const pop=useRef(new Animated.Value(0)).current;
  const sway=useRef(new Animated.Value(0)).current;
  const tickPop=useRef(new Animated.Value(0)).current;
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  // the pan responder is created once, so it reads the latest data from this ref
  const live=useRef<any>({});
  const pos=(d:L6Dot)=>{const sz=live.current.S||S;return {x:d.x*sz,y:d.y*sz}};
  const nearest=(x:number,y:number,skip?:number)=>{
    const v=live.current.view as Level6View|null;
    if(!v)return null;
    let best:L6Dot|null=null,bd=GRAB;
    for(const d of v.dots){
      if(d.id===skip)continue;
      const p=pos(d),dist=Math.hypot(p.x-x,p.y-y);
      if(dist<bd){bd=dist;best=d}
    }
    return best;
  };

  // 1. open the level - the backend creates or resumes the session
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel6(playerId)
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

  // 2. the finger joined two dots -> ask the backend if that is a line of the star
  const join=async(from:number,to:number)=>{
    const {view:v,sessionId:sid,busy:b,done:d}=live.current;
    if(b||d||!sid||!v)return;
    setBusy(true);setGlow(null);
    try{
      const res=await connectDots({sessionId:sid,playerId,from,to});

      if(!res.correct){
        const a=v.dots.find((x:L6Dot)=>x.id===from),c=v.dots.find((x:L6Dot)=>x.id===to);
        if(a&&c)setMark({x:(a.x+c.x)/2*S,y:(a.y+c.y)/2*S});
        doShake();flash(res.message);
        later(()=>setMark(null),700);
        setBusy(false);
        return;
      }

      setView(res);                                  // the new line is drawn from the server's list
      if(res.duplicate){flash(res.message);setBusy(false);return}

      if(res.completed){
        setDone(true);
        flash(res.message);
        Animated.spring(tickPop,{toValue:1,friction:4,tension:80,useNativeDriver:true}).start();
        later(()=>setResult(res),1500);
      }else{
        setBusy(false);
      }
    }catch(e:any){
      flash(e.message||'Network error');
      setBusy(false);
    }
  };

  const active=useRef<number|null>(null);
  const start=useRef({x:0,y:0});
  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>true,
    onPanResponderGrant:(e)=>{
      const x=e.nativeEvent.locationX,y=e.nativeEvent.locationY;
      start.current={x,y};
      const d=live.current.done||live.current.busy?null:nearest(x,y);
      active.current=d?d.id:null;
      if(d){const p=pos(d);setDrag({x1:p.x,y1:p.y,x2:x,y2:y})}
    },
    onPanResponderMove:(_,g)=>{
      if(active.current==null)return;
      const d=(live.current.view as Level6View).dots.find(q=>q.id===active.current);
      if(!d)return;
      const p=pos(d);
      setDrag({x1:p.x,y1:p.y,x2:start.current.x+g.dx,y2:start.current.y+g.dy});
    },
    onPanResponderRelease:(_,g)=>{
      const from=active.current;active.current=null;setDrag(null);
      if(from==null)return;
      const t=nearest(start.current.x+g.dx,start.current.y+g.dy,from);
      if(t)join(from,t.id);
    },
    onPanResponderTerminate:()=>{active.current=null;setDrag(null)},
  })).current;

  live.current={view,sessionId,busy,done,S};

  const onHint=async()=>{
    if(busy||done||!sessionId)return;
    try{
      const r=await hintLevel6({sessionId,playerId});
      setHints&&setHints(r.hints);
      setGlow({from:r.from,to:r.to});
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
        <Text style={bd.load}>Loading level 6...</Text>
      </>}
    </View></View></View>;
  }

  const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
  const dotById=(id:number)=>view.dots.find(d=>d.id===id) as L6Dot;
  const drawn:L6Edge[]=view.edges;

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
            <Text style={bd.signt}>LEVEL 6</Text>
            <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
          </View>
        </Animated.View>
        <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
      </View>

      <Text style={[bd.q,msg?{color:'#ffb4a8'}:null]}>{msg||view.title}</Text>

      {/* drawing area */}
      <View style={bd.boardWrap}>
        <Animated.View style={{width:S,height:S,transform:[{translateX:shake}]}}>
          <Svg width={S} height={S} style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* hint: dashed line between the next two dots */}
            {glow&&<Line x1={dotById(glow.from).x*S} y1={dotById(glow.from).y*S} x2={dotById(glow.to).x*S} y2={dotById(glow.to).y*S}
              stroke="#ffd84d" strokeWidth={5} strokeDasharray="4 10" strokeLinecap="round"/>}
            {/* lines the server accepted */}
            {drawn.map((e,i)=>{
              const a=dotById(e.from),b=dotById(e.to);
              return <Line key={i} x1={a.x*S} y1={a.y*S} x2={b.x*S} y2={b.y*S}
                stroke={done?'#ffd84d':CHALK} strokeWidth={9} strokeLinecap="round"/>;
            })}
            {/* line following the finger */}
            {drag&&<Line x1={drag.x1} y1={drag.y1} x2={drag.x2} y2={drag.y2}
              stroke="rgba(246,244,234,0.65)" strokeWidth={9} strokeLinecap="round"/>}
            {/* dots */}
            {view.dots.map(d=>
              <Path key={d.id} d={dotPath(d.x*S,d.y*S,glow&&(glow.from===d.id||glow.to===d.id)?DOT_R+3:DOT_R)}
                fill={glow&&(glow.from===d.id||glow.to===d.id)?'#ffd84d':CHALK}/>)}
          </Svg>

          {done&&<Animated.View pointerEvents="none" style={{position:'absolute',left:S/2-40,top:S*0.56-40,transform:[{scale:tickPop}]}}>
            <Tick s={80}/>
          </Animated.View>}
          {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-23,top:mark.y-23,zIndex:20}}><Cross/></View>}

          {/* touch layer */}
          <View style={StyleSheet.absoluteFill} {...pr.panHandlers}/>
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
