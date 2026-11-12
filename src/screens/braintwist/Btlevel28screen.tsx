
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,Image,TouchableOpacity,Animated,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
import {Stage,Coin} from './BTShared';
import {Icon} from './Art';
import {BigStar} from './Btlevel7art';
import {RoomBackground,THEME} from './Btlevel4Theme';
import Svg,{Path,Ellipse,Line} from 'react-native-svg';
import {startLevel28,answerLevel28,hintLevel28,skipLevel28,rewardLevel28,Level28View,Level28Result} from './Btlevel28api';

/* ---------------------------------------------------------
   Whole egg with a slight crack (scratch lines).
   No animation: the crack lines are visible from the start.
--------------------------------------------------------- */
const EGG_BODY='M100 34 C138 34 166 92 166 130 C166 162 135 183 100 183 C65 183 34 162 34 130 C34 92 62 34 100 34 Z';

const CrackingEgg=({s}:{s:number})=>(
  <View style={{width:s,height:s}}>
    <Svg width={s} height={s} viewBox="0 0 200 200">
      {/* shadow + whole egg */}
      <Ellipse cx="100" cy="188" rx="62" ry="8" fill="rgba(90,50,20,0.15)"/>
      <Path d={EGG_BODY} fill="#f7dcc0" stroke="#b5703a" strokeWidth="3" strokeLinejoin="round"/>
      {/* shine */}
      <Path d="M52 135 C54 155 70 170 90 174" stroke="#fff4e6" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <Path d="M62 92 C66 74 76 60 90 52" stroke="#fffaf2" strokeWidth="5" strokeLinecap="round" fill="none"/>
      {/* slight crack: thin scratch lines */}
      <Path d="M118 46 L111 62 L123 72 L114 88" stroke="#8a4f22" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <Path d="M123 72 L136 76" stroke="#8a4f22" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <Path d="M111 62 L100 60" stroke="#8a4f22" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* small sparkles */}
      <Line x1="76" y1="22" x2="70" y2="10" stroke="#ffc400" strokeWidth="5" strokeLinecap="round"/>
      <Line x1="100" y1="16" x2="100" y2="2" stroke="#ffc400" strokeWidth="5" strokeLinecap="round"/>
      <Line x1="124" y1="22" x2="130" y2="10" stroke="#ffc400" strokeWidth="5" strokeLinecap="round"/>
    </Svg>
  </View>
);

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// put the cracked egg picture in your assets folder and switch this line on:
// const EGG_IMG:any=require('./assets/level28-egg.png');
const EGG_IMG:any=null;

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level28Result)=>void;
};

const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));

const BACK='⌫';
const KEY_ROWS:string[][]=[
  'QWERTYUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  [...'ZXCVBNM'.split(''),BACK],
];

export default function BTLevel28Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width,height}=useWindowDimensions();
  const cardW=Math.floor(clamp(width-32,260,460));      // notebook card width
  const imgS=Math.floor(clamp(Math.min(cardW*0.55,height*0.2),90,220)); // egg size
  const kbW=Math.min(width,460)-16;
  const GAP=5;
  const kw=Math.floor((kbW-GAP*9)/10);

  const [view,setView]=useState<Level28View|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [typed,setTyped]=useState('');
  const [solved,setSolved]=useState('');
  const [done,setDone]=useState(false);
  const [result,setResult]=useState<Level28Result|null>(null);
  const [confirmSkip,setConfirmSkip]=useState(false);
  const [clueOpen,setClueOpen]=useState(false);
  const [clues,setClues]=useState<string[]>([]);

  const shake=useRef(new Animated.Value(0)).current;
  const pop=useRef(new Animated.Value(0)).current;
  const busy=useRef(false);
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  const flash=(m:string)=>{
    setMsg(m);clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2600);
  };
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>
    Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  // 1. open the level: backend creates a session in SQL and sends the question
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel28(playerId)
      .then(v=>{
        setView(v);setTyped('');setSolved('');setDone(false);setResult(null);setClues([]);
        if(setHints&&typeof v.hints==='number')setHints(v.hints);
      })
      .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
  },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{
    load();
    return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
  },[load]);

  useEffect(()=>{
    if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
  },[result]);

  // 2. send the word; the backend checks it and saves the attempt
  const submit=async(word:string)=>{
    if(!word||busy.current||done||!view)return;
    busy.current=true;
    try{
      const r=await answerLevel28({sessionId:view.sessionId,playerId,answer:word});
      if(typeof r.hints==='number'&&setHints)setHints(r.hints);
      if(r.correct){
        setSolved(r.word||word);setDone(true);setConfirmSkip(false);
        later(()=>setResult(r),1300);
      }else{
        doShake();flash('Not quite. Try again!');
        later(()=>setTyped(''),600);
      }
    }catch(e:any){
      flash(e.message||'Network error');
      later(()=>setTyped(''),600);
    }finally{busy.current=false}
  };

  // magnifier: costs 25, backend sends the next clue
  const onHint=async()=>{
    if(done||!view||busy.current)return;
    setConfirmSkip(false);
    busy.current=true;
    try{
      const r=await hintLevel28({sessionId:view.sessionId,playerId});
      if(typeof r.hints==='number'&&setHints)setHints(r.hints);
      setClues(c=>c.includes(r.clue)?c:[...c,r.clue]);
      setClueOpen(true);
    }catch(e:any){
      if(e.status===400&&clues.length)setClueOpen(true);
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }finally{busy.current=false}
  };

  // video reward: only adds hints
  const onReward=async()=>{
    if(done||busy.current)return;
    setConfirmSkip(false);
    busy.current=true;
    try{
      const r=await rewardLevel28(playerId);
      setHints&&setHints(r.hints);
      flash('+'+r.added+' hints');
    }catch(e:any){
      flash(e.message||'Network error');
    }finally{busy.current=false}
  };

  // skip (50): tap twice
  const onSkip=async()=>{
    if(done||!view||busy.current)return;
    if(!confirmSkip){
      setConfirmSkip(true);
      flash('Skip costs 50 hints. Tap again to skip.');
      return;
    }
    busy.current=true;
    try{
      const r=await skipLevel28({sessionId:view.sessionId,playerId});
      setHints&&setHints(r.hints||0);
      setDone(true);
      onComplete?onComplete(r):onExit();
    }catch(e:any){
      setConfirmSkip(false);
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }finally{busy.current=false}
  };

  // keyboard press; when every letter box is full the word is sent automatically
  const onKey=(k:string)=>{
    if(done||busy.current||!view)return;
    setConfirmSkip(false);
    if(k===BACK){setTyped(x=>x.slice(0,-1));return}
    if(typed.length>=view.length)return;
    const next=typed+k;
    setTyped(next);
    if(next.length===view.length)submit(next);
  };

  /* ---------- header ---------- */
  const header=(
    <View style={st.topBar}>
      <View style={st.leftBtns}>
        <TouchableOpacity style={st.roundBtn} activeOpacity={0.85} onPress={onExit}>
          <Icon n="home" s={16}/>
        </TouchableOpacity>
      </View>

      <View style={st.signWrap}>
        <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
        <View style={st.sign}>
          <Text style={st.signArrow}>{'<'}</Text>
          <Text style={st.signT}>LEVEL 28</Text>
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
          <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
          <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
        </>:<>
          <ActivityIndicator size="large" color={THEME.orange}/>
          <Text style={st.load}>Loading level 28...</Text>
        </>}
      </View>
    </View></Stage>;
  }

  // letter boxes
  const n=view.length;
  const boxS=Math.floor(clamp((cardW-48-(n-1)*8)/n,30,56));
  const letters=(solved||typed).split('');

  return <Stage bg="#bddaee"><View style={st.root}>
    <RoomBackground/>
    {header}

    <View style={st.center}>
      <Animated.View style={[st.paper,{width:cardW,transform:[{translateX:shake}]}]}>
        {/* spiral holes */}
        <View style={st.holes}>
          {Array.from({length:12}).map((_,i)=><View key={i} style={st.hole}/>)}
        </View>

        {/* question */}
        <View style={st.qPill}>
          <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
        </View>

        {/* picture */}
        <View style={{height:imgS,alignItems:'center',justifyContent:'center',marginTop:8}}>
          {EGG_IMG
            ?<Image source={EGG_IMG} style={{width:imgS,height:imgS}} resizeMode="contain"/>
            :<CrackingEgg s={imgS}/>}
        </View>

        {/* answer line: no empty boxes, the letters you tap appear on the line */}
        <View style={[st.ansLine,solved?st.ansLineOk:null]}>
          <Text style={[st.ansT,solved?{color:'#2e9e47'}:null]}>{letters.join(' ')||' '}</Text>
        </View>
      </Animated.View>
    </View>

    {/* keyboard */}
    <View style={st.kb}>
      {KEY_ROWS.map((r,ri)=>
        <View key={ri} style={[st.kbRow,{gap:GAP}]}>
          {r.map(k=>{
            const back=k===BACK;
            return <TouchableOpacity key={k} activeOpacity={0.8} disabled={done} onPress={()=>onKey(k)}
              style={[st.key,{width:kw,height:Math.max(38,kw+6)},back&&st.keyBack]}>
              <Text style={[st.keyT,{fontSize:Math.max(16,Math.round(kw*0.55))}]}>{k}</Text>
            </TouchableOpacity>;
          })}
        </View>)}
    </View>

    {/* bottom rounded panel */}
    <View style={st.panel}>
      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
          <View style={st.circleGreen}><Icon n="search" s={32}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onReward}>
          <Icon n="film" s={36}/>
        </TouchableOpacity>
        <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
          <View style={st.circleRed}><Icon n="play" s={30}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
      </View>
    </View>

    {/* CLUES popup */}
    {clueOpen&&<View style={st.overlay}>
      <View style={st.clueCard}>
        <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
          <Text style={st.closeT}>✕</Text>
        </TouchableOpacity>
        <Text style={st.clueTitle}>HINTS</Text>
        {clues.map((c,i)=>
          <View key={i} style={[st.clueRow,st.clueRowOpen]}>
            <View style={st.clueNum}><Text style={st.clueNumT}>{i+1}</Text></View>
            <View style={{flex:1}}>
              <Text style={st.clueHead}>{'Hint '+(i+1)}</Text>
              <Text style={st.clueBody}>{c}</Text>
            </View>
          </View>)}
      </View>
    </View>}

    {/* result card */}
    {!!result&&<View style={st.overlay}>
      <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
        <Text style={st.cardTitle}>Level complete!</Text>
        <Text style={st.cardMsg}>{result.message}</Text>
        <View style={st.stars}>{[1,2,3].map(s=><BigStar key={s} s={46} on={s<=(result.stars||0)}/>)}</View>
        <Text style={st.cardScore}>Score {result.score}</Text>
        <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
          <Text style={st.nextT}>NEXT</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>}
  </View></Stage>;
}

/* =========================================================
   STYLES
========================================================= */

const st=StyleSheet.create({
  root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

  topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
  leftBtns:{flexDirection:'row',gap:8,minWidth:64},
  roundBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
  signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
  string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
  sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
  signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
  signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
  leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
  pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
  pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
  pillIcon:{fontSize:16},

  center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8},
  centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},

  paper:{backgroundColor:'#fbf3df',borderRadius:14,borderWidth:2,borderColor:'#ead9b5',paddingHorizontal:16,paddingTop:6,paddingBottom:18,alignItems:'center'},
  holes:{flexDirection:'row',justifyContent:'space-between',alignSelf:'stretch',marginBottom:8,paddingHorizontal:2},
  hole:{width:10,height:10,borderRadius:5,backgroundColor:'#bddaee',borderWidth:1,borderColor:'#9bbad0'},
  qPill:{alignSelf:'stretch',backgroundColor:'#fff0c4',borderRadius:30,borderWidth:2,borderColor:'#e0b45a',paddingVertical:10,paddingHorizontal:16},
  q:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy,textAlign:'center'},

  ansLine:{alignSelf:'stretch',marginTop:14,marginHorizontal:12,minHeight:56,alignItems:'center',justifyContent:'flex-end',
    borderBottomWidth:4,borderStyle:'dashed',borderColor:'#10245e'},
  ansLineOk:{borderColor:'#3ec45a'},
  ansT:{fontFamily:FONT,fontSize:38,fontWeight:'900',color:'#10245e',letterSpacing:4,paddingBottom:2},

  kb:{alignItems:'center',gap:7,marginBottom:136},
  kbRow:{flexDirection:'row',justifyContent:'center'},
  key:{borderRadius:10,borderWidth:2,borderColor:'#10245e',backgroundColor:'#fdf6e6',alignItems:'center',justifyContent:'center'},
  keyBack:{backgroundColor:'#ffd9d9'},
  keyT:{fontFamily:FONT,fontWeight:'900',color:'#10245e'},

  panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
    flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
  btnCol:{alignItems:'center'},
  ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
  circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
  ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
  circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
  badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
  badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

  overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},

  clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
  clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
  closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
  closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
  clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:12,paddingHorizontal:14,marginBottom:10},
  clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
  clueNum:{width:46,height:46,borderRadius:23,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
  clueNumT:{fontFamily:FONT,fontSize:24,fontWeight:'900',color:'#fff'},
  clueHead:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#c0702b'},
  clueBody:{fontFamily:FONT,fontSize:15,fontStyle:'italic',color:THEME.navy,marginTop:2},

  card:{width:'82%',maxWidth:380,alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
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
