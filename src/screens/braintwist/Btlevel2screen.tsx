
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,StyleSheet,Platform,ActivityIndicator,useWindowDimensions} from 'react-native';
import Svg,{Rect,Circle,Ellipse,G,Path,Polygon,Defs,LinearGradient,Stop} from 'react-native-svg';
import {startLevel2,submitWord,skipLevel2,Level2View,Level2Action} from './Btlevel2api';
import {ClueArt,HomeIcon,GearIcon,BulbIcon,SearchIcon,VideoIcon} from './Btlevel2art';
import {LockArt} from './Btlevel2lockart';
import {Coin} from './BTShared';
import * as api from './api';
import {play} from './BTSound';
import {fetchClue} from './Btclueapi';

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
const SERIF:any=Platform.select({web:'"Playfair Display",Georgia,"Times New Roman",serif',ios:'Georgia-Italic',default:'serif'});
const NAVY='#13235b',LIME='#a6e22e',CREAM='#f9eed9',YELLOW='#ffb81c',WRONG='#e5383b';
const SKY='#58b9f1';
const WOOD='#e9a24e',WOOD_D='#b8742a',WOOD_DD='#8f5a1f';

const QUESTION_TITLE='Guess the missing letters!';
const SKIP_COST=50; // keep in sync with Braintwistlevel2routes.js

const ROWS=['QWERTYUIOP','ASDFGHJKL','ZXCVBNM<'];

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level2Action)=>void;
};

/* =========================================================
   LEVEL 1 BACKGROUND (same scene as Level 1 board)
   ONE svg, design grid 942 x 1669:
   sky, clouds, hills, fence, face-plant (left), bookshelf (right), leaves
========================================================= */
const DW=942,DH=1669;

const Cloud=({x,y,s}:any)=><G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.96"><Ellipse cx="0" cy="0" rx="70" ry="34"/><Ellipse cx="-52" cy="12" rx="48" ry="26"/><Ellipse cx="56" cy="14" rx="52" ry="26"/><Ellipse cx="8" cy="-26" rx="44" ry="30"/></G>;
const Flower=({x,y,s=1}:any)=><G transform={`translate(${x} ${y}) scale(${s})`}>
  <Path d="M-26 28 Q-8 -4 0 10 Q10 -6 30 26 Q10 20 0 30 Q-12 20 -26 28Z" fill="#4faa2e"/>
  {[0,72,144,216,288].map(a=><Ellipse key={a} cx="0" cy="-17" rx="11" ry="17" fill="#fff" stroke="#e8e0d0" strokeWidth="1.5" transform={`rotate(${a})`}/>)}
  <Circle cx="0" cy="0" r="9" fill="#f9c933"/></G>;
const Tuft=({x,y,s=1}:any)=><Path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0 Q-8 -34 -18 -50 Q-2 -30 3 -46 Q10 -24 26 -40 Q12 -14 16 0Z" fill="#58b82f"/>;
const Rock=({x,y,w,h}:any)=><G><Ellipse cx={x} cy={y} rx={w} ry={h} fill="#8f969e"/><Ellipse cx={x-w*0.2} cy={y-h*0.3} rx={w*0.55} ry={h*0.4} fill="#aeb4bb"/></G>;

/* Level 1 red skip icon (double arrow) */
const FFIcon=({s}:{s:number})=><Svg width={s} height={s} viewBox="0 0 100 100"><Polygon points="14,22 50,50 14,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/><Polygon points="52,22 88,50 52,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/></Svg>;

function Garden(){
  const books1:any[]=[[822,36,112,'#2fa6a0'],[860,34,122,'#f27ab0'],[896,40,106,'#8a63da']];
  const books2:any[]=[[822,32,102,'#e5483f'],[856,26,92,'#2f8fd8'],[884,44,118,'#3eae52']];
  const books3:any[]=[[822,34,96,'#f4c431'],[858,38,124,'#2f6fd0'],[898,34,104,'#e8913a']];
  const shelf=(arr:any[],bottom:number)=>arr.map((b,i)=><Rect key={bottom+'-'+i} x={b[0]} y={bottom-b[2]} width={b[1]} height={b[2]} rx="4" fill={b[3]} stroke="rgba(0,0,0,0.18)" strokeWidth="2"/>);
  const [box,setBox]=useState({w:0,h:0});
  const bw=Math.min(box.w,box.h*DW/DH),bh=bw*DH/DW;
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill,{backgroundColor:'#8fd3f4'}]} onLayout={e=>setBox({w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height})}>
    {box.w>0&&<View style={{position:'absolute',left:(box.w-bw)/2,top:(box.h-bh)/2,width:bw,height:bh}}>
    <Svg width={bw} height={bh} viewBox={`0 0 ${DW} ${DH}`}>
      <Defs>
        <LinearGradient id="g2Sky" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#58b9f1"/><Stop offset="0.6" stopColor="#6cc3f4"/><Stop offset="1" stopColor="#9bdcf8"/></LinearGradient>
        <LinearGradient id="g2Grass" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#8fdc4f"/><Stop offset="1" stopColor="#4ba72d"/></LinearGradient>
      </Defs>

      {/* sky + clouds */}
      <Rect width={DW} height={DH} fill="url(#g2Sky)"/>
      <Cloud x={850} y={235} s={0.62}/><Cloud x={95} y={985} s={0.55}/><Cloud x={760} y={900} s={0.5}/>

      {/* rolling hills behind the fence */}
      <Ellipse cx="170" cy="1215" rx="330" ry="150" fill="#9be05a"/>
      <Ellipse cx="640" cy="1250" rx="420" ry="140" fill="#86d14a"/>
      <Ellipse cx="930" cy="1190" rx="200" ry="120" fill="#a4e464"/>

      {/* meadow */}
      <Path d="M0 1215 Q471 1180 942 1215 V1669 H0Z" fill="url(#g2Grass)"/>

      {/* wooden fence */}
      <G transform="translate(0 150)">
        <Rect x="0" y="1018" width={DW} height="18" fill="#e49c46"/>
        <Rect x="0" y="1070" width={DW} height="18" fill="#e49c46"/>
        {[0,1,2,3,4,5,6,7,8,9,10].map(i=>{const x=i*92-4;return <G key={'p'+i}>
          <Path d={`M${x} 1105 V985 L${x+27} 952 L${x+54} 985 V1105Z`} fill="#f0b45a" stroke="#c27a2a" strokeWidth="3"/>
          <Circle cx={x+27} cy="1000" r="4.5" fill="#8a5a2a"/><Circle cx={x+27} cy="1090" r="4.5" fill="#8a5a2a"/></G>})}
      </G>

      {/* grass details */}
      <Tuft x={250} y={1300} s={0.9}/><Tuft x={470} y={1285} s={0.8}/><Tuft x={700} y={1310} s={1}/>
      <Tuft x={150} y={1620} s={1.2}/><Tuft x={560} y={1650} s={1}/><Tuft x={780} y={1560} s={1}/>
      <Flower x={885} y={1235} s={0.9}/><Flower x={185} y={1610} s={1.1}/><Flower x={730} y={1630} s={1}/>
      <Rock x={60} y={1560} w={95} h={58}/><Rock x={875} y={1618} w={105} h={62}/>

      {/* cute plant in front of the fence (bottom-left) */}
      <G transform="translate(-27 629)">
        <Ellipse cx="95" cy="520" rx="44" ry="92" fill="#58b132"/>
        <Ellipse cx="152" cy="505" rx="34" ry="80" fill="#6fc842" transform="rotate(16 152 505)"/>
        <Ellipse cx="42" cy="535" rx="32" ry="64" fill="#4ea12b" transform="rotate(-16 42 535)"/>
        <Rect x="34" y="566" width="126" height="82" rx="28" fill="#f7ede0"/>
        <Circle cx="76" cy="604" r="6" fill="#5b3a29"/><Circle cx="118" cy="604" r="6" fill="#5b3a29"/>
        <Ellipse cx="56" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/><Ellipse cx="138" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/>
        <Path d="M88 618 Q97 628 106 618" stroke="#5b3a29" strokeWidth="4" fill="none" strokeLinecap="round"/>
      </G>

      {/* bookshelf (right) */}
      <Rect x="785" y="645" width="157" height="580" fill="#e8a24a"/>
      <Rect x="802" y="662" width="140" height="548" fill="#d58a33"/>
      {shelf(books1,826)}{shelf(books2,1006)}{shelf(books3,1190)}
      <Rect x="785" y="826" width="157" height="18" fill="#f2b862"/>
      <Rect x="785" y="1006" width="157" height="18" fill="#f2b862"/>
      <Rect x="785" y="1190" width="157" height="20" fill="#f2b862"/>
      <Rect x="785" y="645" width="157" height="20" fill="#f2b862"/>
      {/* plant on top of the shelf */}
      <Ellipse cx="850" cy="560" rx="26" ry="62" fill="#58b132" transform="rotate(-20 850 560)"/>
      <Ellipse cx="880" cy="545" rx="28" ry="72" fill="#6fc842"/>
      <Ellipse cx="912" cy="565" rx="24" ry="58" fill="#4ea12b" transform="rotate(22 912 565)"/>
      <Path d="M828 600 H934 L922 648 H840Z" fill="#e58a3e"/><Rect x="822" y="590" width="118" height="16" rx="6" fill="#f09a4a"/>

      {/* leaves in the top corners */}
      <Ellipse cx="30" cy="10" rx="170" ry="78" fill="#3f9f35"/><Ellipse cx="200" cy="0" rx="120" ry="52" fill="#58b940"/><Ellipse cx="90" cy="70" rx="80" ry="34" fill="#6fcb4c"/>
      <Ellipse cx="900" cy="8" rx="190" ry="84" fill="#3a9a32"/><Ellipse cx="730" cy="0" rx="115" ry="48" fill="#58b940"/><Ellipse cx="860" cy="78" rx="85" ry="34" fill="#6fcb4c"/>
    </Svg>
    </View>}
  </View>;
}

/* hanging chain made of real links (+ a small ring on the top end) */
const Chain=({h,style,ring=true}:{h:number;style?:any;ring?:boolean})=>{
  const n=Math.max(2,Math.ceil(h/9));
  return <View pointerEvents="none" style={[{position:'absolute',width:12,alignItems:'center'},style]}>
    {ring&&<View style={{width:10,height:10,borderRadius:5,borderWidth:2.5,borderColor:'#6a6a6a',backgroundColor:'#d9d9d9',marginBottom:-3}}/>}
    {Array.from({length:n}).map((_,i)=>
      <View key={i} style={{
        width:i%2===0?8:5,height:12,borderRadius:5,borderWidth:2.2,
        borderColor:'#6f6f6f',backgroundColor:i%2===0?'transparent':'#bdbdbd',marginTop:i===0?0:-4}}/>)}
  </View>;
};

/* Level 1 style chain (3 links) that holds the LEVEL sign */
const ChainL1=({h}:{h:number})=>
  <Svg width={h*0.34} height={h} viewBox="0 0 20 60">
    <Ellipse cx="10" cy="9" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/>
    <Ellipse cx="10" cy="27" rx="6" ry="9" fill="none" stroke="#6a5540" strokeWidth="3.2"/>
    <Ellipse cx="10" cy="45" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/>
  </Svg>;

export default function BTLevel2Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width}=useWindowDimensions();
  const bw=Math.min(width,480);
  const cardW=bw-32;
  const gap=5;
  const keyW=Math.floor((bw-16-gap*9)/10);

  const [view,setView]=useState<Level2View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [typed,setTyped]=useState('');
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);
  const [solved,setSolved]=useState(false);
  const [pressed,setPressed]=useState('');
  const [bal,setBal]=useState<number>(Number(hints)||0);
  const [showClue,setShowClue]=useState(false);
  const [clueText,setClueText]=useState('');
  const [clueBusy,setClueBusy]=useState(false);
  const [clueErr,setClueErr]=useState(false);
  const [panel,setPanel]=useState({w:0,h:0});
  const sway=useRef(new Animated.Value(0)).current;

  const shake=useRef(new Animated.Value(0)).current;
  const bob=useRef(new Animated.Value(0)).current;
  const win=useRef(new Animated.Value(1)).current;
  const pulse=useRef(new Animated.Value(0)).current;
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const actBusy=useRef(false);

  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  useEffect(()=>{setBal(Number(hints)||0)},[hints]);

  const updHints=(h:number)=>{setBal(h);if(setHints)setHints(h)};

  const load=useCallback(()=>{
    setLoadErr('');setView(null);setTyped('');setSolved(false);setShowClue(false);
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
    const s=Animated.loop(Animated.sequence([
      Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
      Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
    s.start();
    return()=>{l.stop();p.stop();s.stop()};
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

  /* frontend -> backend -> MySQL -> JSON back */
  const submit=async(word:string)=>{
    if(!sessionId)return;
    setBusy(true);
    try{
      const res=await submitWord({sessionId,playerId,answer:word});
      if(res.correct){
        play('correct');
        setSolved(true);
        showMsg(res.message||'Correct!');
        Animated.sequence([
          Animated.timing(win,{toValue:1.12,duration:200,useNativeDriver:true}),
          Animated.spring(win,{toValue:1,friction:4,useNativeDriver:true})]).start();
        later(()=>{onComplete?onComplete(res):onExit()},1400);
        return;
      }
      play('wrong');
      showMsg(res.message||'Not quite. Try again!');
      shakeCard();
    }catch(e:any){
      showMsg(e.message||'Network error');
    }
    later(()=>{setTyped('');setBusy(false)},450);
  };

  // key tap sound: 'key' = normal key, 'keydel' = backspace (falls back to 'key' in BTSound if not loaded)
  const onKey=(k:string)=>{
    if(busy||solved||!view||showClue)return;
    if(k==='<'){play('keydel');setTyped(t=>t.slice(0,-1));return}
    if(typed.length>=view.length)return;
    play('key');
    const next=typed+k;
    setTyped(next);
    if(next.length===view.length)submit(next);
  };

  // clue: frontend -> POST /api/braintwist/clue -> backend reads clue + saves the view in MySQL -> JSON back (free)
  const loadClue=async()=>{
    if(clueBusy)return;
    setClueBusy(true);setClueErr(false);
    const r=await fetchClue(playerId,2);
    if(r.success&&r.clue)setClueText(r.clue);
    else setClueErr(true);
    setClueBusy(false);
  };
  const onHint=()=>{
    if(busy||solved)return;
    play('clue');
    setShowClue(true);
    if(!clueText)loadClue();
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
        <Garden/>
        <View style={[st.board,{alignItems:'center',justifyContent:'center'}]}>
          {loadErr?<>
            <Text style={st.errText}>{loadErr}</Text>
            <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
            <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
          </>:<>
            <ActivityIndicator color="#fff" size="large"/>
            <Text style={st.loading}>Loading level 2...</Text>
          </>}
        </View>
      </View>
    </View>;
  }

  // sizes that always fit the card (frame adds 20px: padding 7*2 + border 3*2)
  const FRAME=20;
  const ART=76;
  const isLock=String(view.clueIcon||'').toLowerCase()==='lock';
  const artW=isLock?ART*1.15:ART;
  const innerW=cardW-FRAME;
  const clueAvail=innerW-32-artW-24;
  const clueFS=Math.max(22,Math.min(48,Math.floor(clueAvail/(String(view.clueText).length*0.95))));
  const slotGap=6;
  const slotW=Math.min(36,Math.floor((innerW-32-slotGap*(view.length-1))/view.length));
  const slotFS=Math.max(14,Math.min(32,Math.floor(slotW*1.05)));
  const pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.09]});
  const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});

  /* bottom panel button column (Level 1 positions: 22% / 50% / 78%) */
  const col=(pct:number,btn:any,pill?:any)=>
    <View style={{position:'absolute',left:(pct+'%') as any,marginLeft:-45,top:20,width:90,alignItems:'center'}}>
      {btn}{pill}
    </View>;
  const costPill=(icon:any,text:string)=>
    <View style={st.cost}>{icon}<Text style={st.costT}>{text}</Text></View>;

  return <View style={st.page}>
    <View style={[st.col,{width:bw}]}>
      <Garden/>
      <View style={st.board}>

        {/* header */}
        <View style={st.header}>
          <View style={st.headLeft}>
            <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon/></TouchableOpacity>
            <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon/></TouchableOpacity>
          </View>
          <Animated.View style={[st.signWrap,{transform:[{rotate:swayR}]}]}>
            <View style={{position:'absolute',left:26,top:-6}}><ChainL1 h={34}/></View>
            <View style={{position:'absolute',right:26,top:-6}}><ChainL1 h={34}/></View>
            <View style={st.plaque}>
              <View style={st.plaqueShine}/>
              <Text style={st.chev}>{'<'}</Text>
              <Text style={st.plaqueT}>LEVEL 2</Text>
              <Text style={st.chev}>{'>'}</Text>
            </View>
          </Animated.View>
          <View style={st.pillWrap}>
            <View style={st.pill}><Text numberOfLines={1} style={st.pillT}>{bal}</Text></View>
            <View style={st.bulb}><BulbIcon size={34}/></View>
          </View>
        </View>

        {/* question sign */}
        <View style={st.titleRow}>
          <View style={[st.titlePill,{maxWidth:cardW}]}>
            <Text style={st.titleChev}>{'<'}</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit style={st.title}>{QUESTION_TITLE}</Text>
            <Text style={st.titleChev}>{'>'}</Text>
          </View>
        </View>

        {/* chains that hold the board under the question sign */}
        <View style={{height:24,width:cardW,alignSelf:'center'}}>
          <Chain h={22} ring={false} style={{left:30,top:-4}}/>
          <Chain h={22} ring={false} style={{right:30,top:-4}}/>
        </View>

        {/* wooden board */}
        <Animated.View style={{alignItems:'center',transform:[{translateX:shake},{scale:win}]}}>
          <View style={[st.frame,{width:cardW}]}>
            <View style={st.hookL}/><View style={st.hookR}/>
            <View style={st.paper}>
              <View style={st.holes}>{Array.from({length:8}).map((_,i)=><View key={i} style={st.hole}/>)}</View>
              <View style={[st.ruled,{top:112}]}/>

              <View style={st.clueRow}>
                <Animated.View style={{transform:[{translateY:bob.interpolate({inputRange:[0,1],outputRange:[0,-6]})}]}}>
                  {isLock?<LockArt size={ART}/>:<ClueArt size={ART}/>}
                </Animated.View>
                <Text style={[st.clueText,{fontSize:clueFS}]}>{view.clueText}</Text>
              </View>

              <View style={st.slots}>
                {Array.from({length:view.length}).map((_,i)=>
                  <View key={i} style={[st.slot,{width:slotW},solved&&{borderBottomColor:'#5cb04a'}]}>
                    <Text style={[st.slotT,{fontSize:slotFS,lineHeight:slotFS+8},solved&&{color:'#3d9a2c'}]}>{typed[i]||''}</Text>
                  </View>)}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* wrong / right message */}
        <Text style={[st.hintText,{minHeight:20},msg?{color:solved?'#1f7a12':WRONG}:null]}>{msg}</Text>

        {/* keypad (sits just above the wooden panel) */}
        <View style={st.kbWrap}>
          <View style={st.keyboard}>
            {ROWS.map(row=>
              <View key={row} style={st.keyRow}>
                {row.split('').map(k=>{
                  const isBack=k==='<';
                  return <TouchableOpacity key={k} activeOpacity={0.8}
                    onPressIn={()=>setPressed(k)} onPressOut={()=>setPressed('')}
                    onPress={()=>onKey(k)}
                    style={[st.key,{width:keyW,height:Math.round(keyW*1.05)},isBack&&{backgroundColor:'#ffd8d8'},pressed===k&&{backgroundColor:LIME}]}>
                    <Text style={st.keyT}>{isBack?'⌫':k}</Text>
                  </TouchableOpacity>;
                })}
              </View>)}
          </View>
        </View>

        {/* bottom wooden panel: same as Level 1 (clue / video / skip) */}
        <View style={st.panel} onLayout={e=>setPanel({w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height})}>
          {panel.w>0&&<Svg pointerEvents="none" width={panel.w} height={panel.h} style={StyleSheet.absoluteFill}>
            <Defs><LinearGradient id="g2Wood" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#f0a94f"/><Stop offset="1" stopColor="#d98a3a"/></LinearGradient></Defs>
            <Rect x="2.5" y="2.5" width={panel.w-5} height={panel.h-5} rx={panel.h*0.23} fill="url(#g2Wood)" stroke="#a65d1d" strokeWidth="5"/>
            <Path d={`M${panel.w*0.08} ${panel.h*0.306} H${panel.w*0.92} M${panel.w*0.03} ${panel.h*0.65} H${panel.w*0.97}`} stroke="#b9722a" strokeWidth="3" opacity="0.7"/>
            <Path d={`M${panel.w*0.13} ${panel.h*0.12} H${panel.w*0.29} M${panel.w*0.55} ${panel.h*0.17} H${panel.w*0.83} M${panel.w*0.07} ${panel.h*0.45} H${panel.w*0.34} M${panel.w*0.65} ${panel.h*0.49} H${panel.w*0.92}`} stroke="#c98235" strokeWidth="2" opacity="0.55" strokeLinecap="round"/>
            <Circle cx={panel.w*0.06} cy={panel.h*0.15} r="4.5" fill="#8a5a2a"/><Circle cx={panel.w*0.94} cy={panel.h*0.15} r="4.5" fill="#8a5a2a"/>
            <Circle cx={panel.w*0.06} cy={panel.h*0.85} r="4.5" fill="#8a5a2a"/><Circle cx={panel.w*0.94} cy={panel.h*0.85} r="4.5" fill="#8a5a2a"/>
          </Svg>}

          {col(22,
            <Animated.View style={{transform:[{scale:pulseS}]}}>
              <TouchableOpacity activeOpacity={0.8} style={[st.circ,{backgroundColor:'#a4d732'}]} onPress={onHint}><SearchIcon size={27}/></TouchableOpacity>
            </Animated.View>)}
          {col(50,
            <TouchableOpacity activeOpacity={0.8} style={[st.circ,{backgroundColor:'#f7ecd6'}]} onPress={onVideo}><VideoIcon size={30}/></TouchableOpacity>,
            costPill(<Coin s={12}/>,'+75'))}
          {col(78,
            <TouchableOpacity activeOpacity={0.8} style={[st.circ,{backgroundColor:'#ed434d'}]} onPress={onSkip}><FFIcon s={30}/></TouchableOpacity>,
            costPill(<BulbIcon size={16}/>,String(SKIP_COST)))}
        </View>
      </View>{/* end board */}

      {/* CLUES modal */}
      {showClue&&<View style={st.overlay}>
        <View style={st.modal}>
          <View style={st.modalHead}>
            <Text style={st.modalTitle}>HINTS</Text>
            <TouchableOpacity style={st.closeBtn} activeOpacity={0.8} onPress={()=>setShowClue(false)}>
              <Text style={st.closeX}>✕</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={clueErr?0.7:1} disabled={!clueErr||clueBusy} onPress={loadClue} style={st.clueBox}>
            <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
            <View style={{flex:1}}>
              <Text style={st.clueTitle}>Hint 1</Text>
              <Text style={[st.clueBody,clueErr&&!clueBusy?{color:WRONG}:null]}>
                {clueBusy?'Loading clue...':clueErr?'Could not load the clue. Tap to try again.':(clueText||view.hint)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>}
    </View>{/* end col */}
  </View>;
}

const st=StyleSheet.create({
  page:{flex:1,backgroundColor:'#8fd3f4',alignItems:'center'},
  col:{flex:1,overflow:'hidden',backgroundColor:'#8fd3f4'},
  board:{flex:1,paddingTop:14},

  /* header: same colours / shapes as Level 1 */
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12},
  headLeft:{flexDirection:'row',gap:7},
  round:{width:38,height:38,borderRadius:19,backgroundColor:'#f9c93d',borderWidth:3,borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4},
  signWrap:{alignItems:'center',paddingTop:14},
  plaque:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#b4651f',borderWidth:3,borderColor:'#8a4a1b',borderRadius:8,paddingHorizontal:14,paddingVertical:7,elevation:6,marginTop:6},
  plaqueShine:{position:'absolute',top:4,left:8,right:8,height:3,borderRadius:2,backgroundColor:'rgba(255,214,150,0.35)'},
  plaqueT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:'#fff',letterSpacing:0.5,textShadowColor:'rgba(60,25,0,0.55)',textShadowOffset:{width:0,height:2},textShadowRadius:3},
  chev:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:'#ffc533'},
  pillWrap:{width:74,height:44,justifyContent:'center',marginRight:6},
  pill:{height:34,borderRadius:17,backgroundColor:'#fbf3e1',borderWidth:2,borderStyle:'dashed',borderColor:'#d9c79e',justifyContent:'center',alignItems:'center',paddingRight:14,elevation:4},
  pillT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:'#1d1d1d'},
  bulb:{position:'absolute',right:-8,top:-8},

  /* question pill: Level 1 style */
  titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:8},
  titlePill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#faf0da',borderRadius:30,borderWidth:2,borderColor:'#e9d4a6',paddingHorizontal:16,paddingVertical:6,elevation:4},
  titleChev:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:'#ffb629'},
  title:{flexShrink:1,fontFamily:SERIF,fontSize:19,fontStyle:'italic',color:'#17307a',textAlign:'center'},

  frame:{backgroundColor:'#d99342',borderRadius:22,borderWidth:3,borderColor:WOOD_D,padding:7,
    shadowColor:'#000',shadowOffset:{width:0,height:5},shadowOpacity:0.2,shadowRadius:7,elevation:6},
  hookL:{position:'absolute',left:22,top:-7,width:12,height:12,borderRadius:6,borderWidth:3,borderColor:'#6a6a6a',backgroundColor:'#d9d9d9',zIndex:3},
  hookR:{position:'absolute',right:22,top:-7,width:12,height:12,borderRadius:6,borderWidth:3,borderColor:'#6a6a6a',backgroundColor:'#d9d9d9',zIndex:3},
  paper:{backgroundColor:CREAM,borderRadius:15,paddingTop:30,paddingBottom:14,paddingHorizontal:16,overflow:'hidden'},
  holes:{position:'absolute',top:8,left:0,right:0,flexDirection:'row',justifyContent:'space-evenly'},
  hole:{width:14,height:14,borderRadius:7,backgroundColor:'#c98a3e'},
  ruled:{position:'absolute',left:0,right:0,height:1.5,backgroundColor:'#ecd9b5'},
  clueRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12},
  clueText:{fontFamily:FONT,fontWeight:'900',color:NAVY},
  slots:{flexDirection:'row',justifyContent:'center',gap:6,marginTop:8},
  slot:{height:42,borderBottomWidth:4,borderBottomColor:NAVY,alignItems:'center',justifyContent:'flex-end'},
  slotT:{fontFamily:FONT,fontWeight:'900',color:NAVY},

  hintText:{fontFamily:FONT,fontSize:15,fontWeight:'800',color:'#fff',textAlign:'center',marginTop:4,paddingHorizontal:20},

  // keyboard area fills the space between the board and the bottom panel
  kbWrap:{flex:1,justifyContent:'flex-end',paddingBottom:148},
  keyboard:{alignItems:'center',gap:6,paddingHorizontal:8},
  keyRow:{flexDirection:'row',justifyContent:'center',gap:5},
  key:{backgroundColor:CREAM,borderRadius:9,borderWidth:2.5,borderColor:'#e0b068',alignItems:'center',justifyContent:'center',
    shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.2,shadowRadius:2,elevation:3},
  keyT:{fontFamily:FONT,fontSize:22,fontWeight:'800',color:NAVY},

  // Level 1 bottom wooden board (drawn by the svg inside) + round buttons + dark cost pills
  panel:{position:'absolute',left:14,right:14,bottom:12,height:124},
  circ:{width:56,height:56,borderRadius:28,borderWidth:5,borderColor:'#f7f0d8',alignItems:'center',justifyContent:'center',elevation:6},
  cost:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,height:26,marginTop:6,paddingHorizontal:14,borderRadius:13,backgroundColor:'#7a4520'},
  costT:{fontFamily:FONT,fontSize:15,fontWeight:'900',color:'#fff'},

  loading:{fontFamily:FONT,fontSize:18,color:'#fff',marginTop:12},
  errText:{fontFamily:FONT,fontSize:18,color:'#fff',textAlign:'center',paddingHorizontal:24},
  retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:LIME,borderWidth:2.5,borderColor:'#1b1b1b'},
  retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:'#1b1b1b'},
  back:{fontFamily:FONT,fontSize:16,color:'#fff',marginTop:14,textDecorationLine:'underline'},

  /* CLUES modal */
  overlay:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(19,35,91,0.55)',alignItems:'center',justifyContent:'center',paddingHorizontal:20,zIndex:50},
  modal:{width:'100%',backgroundColor:CREAM,borderRadius:22,borderWidth:5,borderColor:WOOD_D,padding:16},
  modalHead:{alignItems:'center',justifyContent:'center',marginBottom:14,paddingVertical:4},
  modalTitle:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:NAVY,letterSpacing:0.5},
  closeBtn:{position:'absolute',right:0,top:0,width:38,height:38,borderRadius:19,backgroundColor:WOOD,borderWidth:2.5,borderColor:WOOD_D,alignItems:'center',justifyContent:'center'},
  closeX:{fontSize:18,fontWeight:'900',color:'#e5383b'},
  clueBox:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:'#fff',borderRadius:14,borderWidth:2,borderColor:'#4cbf5a',padding:14},
  clueNum:{width:48,height:48,borderRadius:24,backgroundColor:'#c46a25',alignItems:'center',justifyContent:'center'},
  clueNumT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:'#fff'},
  clueTitle:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#c46a25',marginBottom:2},
  clueBody:{fontSize:16,fontStyle:'italic',color:NAVY,lineHeight:22},
});
