
import React,{useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,Easing,StyleSheet,useWindowDimensions} from 'react-native';
import Svg,{Rect,Path,Circle,Ellipse,Polygon,G,Defs,LinearGradient,Stop} from 'react-native-svg';
import {F,Stage,Coin,useStageW} from './BTShared';
import BTSettingsModal from './BTSettingsModal'; // Settings pop-up (opens when the gear icon is tapped)
import {useBTSound,playSfx} from './BTSound';     // global Music / Sound Effects settings shared by ALL levels

const NAVY='#10245e',INDIGO='#4a1fc8',SKY='#25147e';

// local ping-pong loop (native driver) used by all the animations
const yoyo=(v:Animated.Value,ms:number)=>Animated.loop(Animated.sequence([
  Animated.timing(v,{toValue:1,duration:ms,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
  Animated.timing(v,{toValue:0,duration:ms,easing:Easing.inOut(Easing.sin),useNativeDriver:true})])).start();

/* ---------- small svg art ---------- */
const WIcon=({n}:any)=><Svg width={26} height={26} viewBox="0 0 24 24">{n==='home'?<Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#fff" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round"/>
  :n==='gear'?<G><Circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="4" strokeDasharray="3 3.3" fill="none"/><Circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2.6" fill="none"/></G>
  :<G><Circle cx="5" cy="12" r="2.2" fill="#fff"/><Circle cx="12" cy="12" r="2.2" fill="#fff"/><Circle cx="19" cy="12" r="2.2" fill="#fff"/></G>}</Svg>;

// 4-point sparkle
const SparkSvg=({w,fill='#fff3b8'}:any)=><Svg width={w} height={w} viewBox="0 0 100 100">
  <Polygon points="50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40" fill={fill}/></Svg>;

const StarSvg=({w,fill='#ffd93a',stroke='#f0b020'}:any)=><Svg width={w} height={w} viewBox="0 0 100 100">
  <Polygon points="50,6 62,36 94,38 69,58 78,90 50,72 22,90 31,58 6,38 38,36" fill={fill} stroke={stroke} strokeWidth="6" strokeLinejoin="round"/></Svg>;

// brain mascot: pink brain, round glasses, thinking hand + gripping hand (viewBox 220 x 210)
const BrainSvg=({w}:any)=><Svg width={w} height={w*210/220} viewBox="0 0 220 210">
  {/* shoulders */}
  <Path d="M52 210 C52 168 168 168 168 210 Z" fill="#1d2a6e"/>
  {/* brain lobes */}
  <G fill="#f7a1bf" stroke="#ec6f9a" strokeWidth="3">
    <Circle cx="52" cy="98" r="32"/><Circle cx="80" cy="58" r="34"/><Circle cx="128" cy="52" r="34"/>
    <Circle cx="164" cy="92" r="32"/><Circle cx="162" cy="130" r="28"/><Circle cx="56" cy="134" r="28"/>
    <Circle cx="84" cy="150" r="26"/><Circle cx="136" cy="150" r="26"/>
  </G>
  <Ellipse cx="108" cy="100" rx="70" ry="58" fill="#f7a1bf"/>
  {/* wrinkles */}
  <G stroke="#ec6f9a" strokeWidth="3" fill="none" strokeLinecap="round">
    <Path d="M70 48 Q82 38 96 48"/><Path d="M120 40 Q134 32 146 44"/><Path d="M30 96 Q40 84 52 92"/>
    <Path d="M176 84 Q188 92 182 106"/><Path d="M156 66 Q166 60 172 68"/>
  </G>
  {/* glasses */}
  <Path d="M130 95 L194 84" stroke="#111" strokeWidth="4" strokeLinecap="round"/>
  <Path d="M70 98 L36 108" stroke="#111" strokeWidth="4" strokeLinecap="round"/>
  <Circle cx="88" cy="102" r="24" fill="#fff" stroke="#111" strokeWidth="6"/>
  <Circle cx="144" cy="98" r="24" fill="#fff" stroke="#111" strokeWidth="6"/>
  <Path d="M110 100 Q116 96 122 99" stroke="#111" strokeWidth="5" fill="none"/>
  <Circle cx="92" cy="104" r="11" fill="#1a1a5a"/><Circle cx="148" cy="100" r="11" fill="#1a1a5a"/>
  <Circle cx="96" cy="99" r="4" fill="#fff"/><Circle cx="152" cy="95" r="4" fill="#fff"/>
  {/* mouth */}
  <Path d="M108 138 Q118 162 134 136 Z" fill="#c2185b"/>
  <Path d="M114 150 Q120 158 128 148 Z" fill="#ff7a9a"/>
  {/* thinking hand (finger on chin) */}
  <G stroke="#c8d2ee" strokeWidth="2.5" fill="#fff">
    <Ellipse cx="84" cy="168" rx="26" ry="18" transform="rotate(-25 84 168)"/>
    <Path d="M92 156 Q112 140 118 146 Q122 154 104 166 Z"/>
  </G>
  {/* gripping hand over the card edge */}
  <G stroke="#c8d2ee" strokeWidth="2.5" fill="#fff">
    <Ellipse cx="184" cy="198" rx="30" ry="14"/>
    <Circle cx="164" cy="194" r="8"/><Circle cx="178" cy="190" r="8"/><Circle cx="192" cy="190" r="8"/><Circle cx="205" cy="194" r="8"/>
  </G>
</Svg>;

// glowing light bulb with rays (viewBox 100 x 130)
const BulbSvg=({w}:any)=><Svg width={w} height={w*1.3} viewBox="0 0 100 130">
  <G stroke="#ffd21f" strokeWidth="5" strokeLinecap="round">
    <Path d="M50 4 V14"/><Path d="M14 18 L22 26"/><Path d="M86 18 L78 26"/>
    <Path d="M4 50 H14"/><Path d="M96 50 H86"/><Path d="M16 82 L24 76"/><Path d="M84 82 L76 76"/>
  </G>
  <Circle cx="50" cy="50" r="28" fill="#ffe35a" stroke="#f5b820" strokeWidth="3"/>
  <Ellipse cx="40" cy="38" rx="8" ry="12" fill="#fff" opacity={0.6} transform="rotate(25 40 38)"/>
  <Path d="M42 66 L42 54 Q50 40 58 54 L58 66" stroke="#e09a10" strokeWidth="3" fill="none"/>
  <Rect x="38" y="76" width="24" height="12" rx="3" fill="#7a8ad8"/>
  <Rect x="40" y="88" width="20" height="9" rx="3" fill="#3a4fb8"/>
  <Rect x="44" y="97" width="12" height="7" rx="3" fill="#2a3a98"/>
</Svg>;

// trophy standing on two books (viewBox 140 x 150)
const TrophySvg=({w}:any)=><Svg width={w} height={w*150/140} viewBox="0 0 140 150">
  {/* books */}
  <Rect x="6" y="118" width="124" height="28" rx="5" fill="#f08a1c"/>
  <Rect x="14" y="124" width="112" height="14" rx="3" fill="#fbe9c8"/>
  <Rect x="14" y="92" width="108" height="28" rx="5" fill="#2a6ee0"/>
  <Rect x="22" y="98" width="96" height="14" rx="3" fill="#e8f0fb"/>
  {/* trophy */}
  <Rect x="40" y="82" width="52" height="12" rx="3" fill="#3a2a2a"/>
  <Rect x="58" y="62" width="16" height="22" fill="#e8a020"/>
  <Path d="M34 14 H98 V36 C98 56 84 66 66 66 C48 66 34 56 34 36 Z" fill="#ffc83a" stroke="#e8a020" strokeWidth="3"/>
  <Path d="M34 20 C14 20 14 46 38 50" stroke="#e8a020" strokeWidth="6" fill="none" strokeLinecap="round"/>
  <Path d="M98 20 C118 20 118 46 94 50" stroke="#e8a020" strokeWidth="6" fill="none" strokeLinecap="round"/>
  <Polygon points="66,24 70,34 80,35 72,41 75,51 66,45 57,51 60,41 52,35 62,34" fill="#fff3b8"/>
</Svg>;

/* ---------- animated pieces ---------- */
const DriftCloud=({W,top,scale,ms,init,tint}:any)=>{
  const p=useRef(new Animated.Value(init)).current;
  useEffect(()=>{Animated.sequence([
    Animated.timing(p,{toValue:1,duration:Math.max(1,ms*(1-init)),easing:Easing.linear,useNativeDriver:true}),
    Animated.loop(Animated.timing(p,{toValue:1,duration:ms,easing:Easing.linear,useNativeDriver:true}))]).start()},[]);
  const c=tint||'rgba(255,255,255,0.10)';
  return <Animated.View pointerEvents="none" style={{position:'absolute',top,transform:[{translateX:p.interpolate({inputRange:[0,1],outputRange:[-200,W+200]})},{scale}]}}>
    <View style={{width:130,height:34,borderRadius:17,backgroundColor:c}}/>
    <View style={{position:'absolute',left:14,top:-18,width:46,height:46,borderRadius:23,backgroundColor:c}}/>
    <View style={{position:'absolute',left:46,top:-30,width:62,height:62,borderRadius:31,backgroundColor:c}}/>
    <View style={{position:'absolute',left:88,top:-14,width:40,height:40,borderRadius:20,backgroundColor:c}}/></Animated.View>};

const Twinkle=({x,y,w,delay}:any)=>{
  const p=useRef(new Animated.Value(0)).current;
  useEffect(()=>{Animated.sequence([Animated.delay(delay),Animated.loop(Animated.sequence([
    Animated.timing(p,{toValue:1,duration:900,useNativeDriver:true}),Animated.timing(p,{toValue:0,duration:900,useNativeDriver:true})]))]).start()},[]);
  return <Animated.View pointerEvents="none" style={{position:'absolute',left:x,top:y,opacity:p.interpolate({inputRange:[0,1],outputRange:[0.45,1]}),
    transform:[{scale:p.interpolate({inputRange:[0,1],outputRange:[0.8,1.2]})}]}}><SparkSvg w={w}/></Animated.View>};

// floating question mark (bobs + tilts)
const FloatQ=({x,y,s,c,ms,rot}:any)=>{
  const p=useRef(new Animated.Value(0)).current;
  useEffect(()=>{yoyo(p,ms)},[]);
  return <Animated.View pointerEvents="none" style={{position:'absolute',left:x,top:y,
    transform:[{translateY:p.interpolate({inputRange:[0,1],outputRange:[0,-12]})},{rotate:p.interpolate({inputRange:[0,1],outputRange:[rot-8+'deg',rot+8+'deg']})}]}}>
    <Text allowFontScaling={false} style={{fontFamily:F,fontSize:s,fontWeight:'900',color:c,textShadowColor:'rgba(20,10,80,0.35)',textShadowRadius:4,textShadowOffset:{width:2,height:3}}}>?</Text></Animated.View>};

/* The whole scene is drawn at FULL window width (W).
   Items that belong near the phone-sized column are placed relative to cx (column left)
   and cw (column width): on a website the sides are filled with sky / clouds,
   on mobile cx=0, cw=W. */
function SkyWorld({W,H,cx,cw,wide}:any){
  const X=(f:number)=>cx+cw*f,R=cx+cw,MID=cx+cw/2;
  // light rays shining out from behind the brain
  const rays=[-80,-60,-40,-20,0,20,40,60,80].map((a,i)=>{
    const oy=H*0.24,L=1200,a1=(a-90-6)*Math.PI/180,a2=(a-90+6)*Math.PI/180;
    return <Polygon key={i} points={`${MID},${oy} ${MID+L*Math.cos(a1)},${oy+L*Math.sin(a1)} ${MID+L*Math.cos(a2)},${oy+L*Math.sin(a2)}`} fill="#fff" opacity={0.06}/>});
  const pw=cw*0.92,px=cx+cw*0.04;
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {/* dream sky gradient */}
    <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
      <Defs><LinearGradient id="homeSky" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#25147e"/><Stop offset="0.35" stopColor="#3d28b8"/>
        <Stop offset="0.62" stopColor="#5a47e0"/><Stop offset="0.82" stopColor="#8a5fe6"/><Stop offset="1" stopColor="#b585ee"/></LinearGradient></Defs>
      <Rect width="10" height="10" fill="url(#homeSky)"/></Svg>
    <Svg width={W} height={H} style={{position:'absolute',left:0,top:0}}>{rays}</Svg>
    <DriftCloud W={W} top={H*0.34} scale={0.9} ms={44000} init={0.6}/>
    <DriftCloud W={W} top={H*0.62} scale={1.1} ms={52000} init={0.2}/>
    {/* sparkles */}
    <Twinkle x={X(0.2)} y={H*0.13} w={22} delay={0}/>
    <Twinkle x={X(0.05)} y={H*0.33} w={20} delay={500}/>
    <Twinkle x={X(0.92)} y={H*0.4} w={14} delay={900}/>
    <Twinkle x={X(0.78)} y={H*0.12} w={14} delay={300}/>
    <Twinkle x={X(0.42)} y={H*0.1} w={12} delay={650}/>
    <Twinkle x={X(0.86)} y={H*0.28} w={16} delay={400}/>
    {wide&&<><Twinkle x={cx-120} y={H*0.2} w={22} delay={200}/><Twinkle x={R+90} y={H*0.16} w={24} delay={700}/><Twinkle x={cx-260} y={H*0.45} w={18} delay={100}/><Twinkle x={R+220} y={H*0.4} w={20} delay={500}/></>}
    {/* floating question marks */}
    <FloatQ x={X(0.03)} y={H*0.17} s={74} c="#a56cf0" ms={2600} rot={-10}/>
    <FloatQ x={X(0.86)} y={H*0.23} s={58} c="#4fa8f0" ms={3000} rot={12}/>
    <FloatQ x={X(0.01)} y={H*0.5} s={72} c="#ff7fc8" ms={2900} rot={-14}/>
    <FloatQ x={X(0.88)} y={H*0.53} s={62} c="#38c8ee" ms={2500} rot={10}/>
    {/* yellow exclamation near the brain */}
    <View style={{position:'absolute',left:X(0.7),top:H*0.15,transform:[{rotate:'18deg'}]}}>
      <Text allowFontScaling={false} style={{fontFamily:F,fontSize:54,fontWeight:'900',color:'#ffd21f',textShadowColor:'rgba(20,10,80,0.3)',textShadowRadius:3,textShadowOffset:{width:1,height:2}}}>!</Text></View>
    {/* glowing podium */}
    <Svg width={pw} height={110} viewBox="0 0 400 110" style={{position:'absolute',left:px,bottom:-14}}>
      <Ellipse cx="200" cy="72" rx="196" ry="38" fill="#3a238f"/>
      <Ellipse cx="200" cy="58" rx="186" ry="40" fill="#5a36c4"/>
      <Ellipse cx="200" cy="56" rx="130" ry="22" fill="#ff7ad0" opacity={0.35}/>
      <Ellipse cx="200" cy="56" rx="108" ry="16" fill="none" stroke="#ffcf5a" strokeWidth="5"/>
      <Ellipse cx="200" cy="56" rx="90" ry="11" fill="#c08aff" opacity={0.55}/></Svg>
    {/* clouds around the bottom */}
    <Svg width={W} height={140} viewBox={`0 0 ${W} 140`} style={{position:'absolute',left:0,bottom:0}}>
      <Ellipse cx={cx+10} cy="130" rx="95" ry="46" fill="#c9a8f5"/>
      <Ellipse cx={cx+80} cy="140" rx="85" ry="40" fill="#e8c8f5"/>
      <Ellipse cx={cx+40} cy="150" rx="80" ry="40" fill="#fff" opacity={0.85}/>
      <Ellipse cx={R-10} cy="120" rx="95" ry="50" fill="#d8b8f8"/>
      <Ellipse cx={R-90} cy="140" rx="85" ry="40" fill="#f3d2f5"/>
      <Ellipse cx={R-40} cy="150" rx="85" ry="42" fill="#fff" opacity={0.88}/></Svg>
    {/* trophy on books (bottom-left) */}
    <View style={{position:'absolute',left:cx+4,bottom:H*0.05}}><TrophySvg w={Math.min(120,cw*0.28)}/></View>
    {/* big yellow ? on a blue cloud (bottom-right) */}
    <View style={{position:'absolute',left:R-100,bottom:H*0.045,width:90,height:110,alignItems:'center'}}>
      <View style={{position:'absolute',bottom:8,left:4,width:58,height:58,borderRadius:29,backgroundColor:'#4aa8f0'}}/>
      <Text allowFontScaling={false} style={{fontFamily:F,fontSize:110,fontWeight:'900',color:'#ffc83a',textShadowColor:'#f08a1c',textShadowRadius:3,textShadowOffset:{width:3,height:4}}}>?</Text></View>
  </View>}

/* ---------- screen ---------- */
export default function BTHomeScreen({hints,n,onHome,onGo,onLevels,err}:any){
  const sw=useStageW(),{width:ww,height:H}=useWindowDimensions();
  const wide=ww>sw+8,W=wide?ww:sw,cx=wide?Math.round((ww-sw)/2):0;
  const compact=H<700;
  const CW=sw-40;

  // layout (top -> bottom): brain + bulb, speech card, PLAY, LEVELS
  const brainW=Math.min(190,sw*0.46),brainH=brainW*210/220;
  const cardH=compact?150:Math.max(160,Math.min(190,H*0.22));
  const cardTop=Math.round(Math.max(H*0.3,100+brainH-22));
  const brainTop=cardTop+22-brainH;
  const bulbW=compact?54:64,bulbTop=Math.max(26,brainTop-bulbW*1.3+34);
  const playH=compact?60:72,playTop=cardTop+cardH+Math.round(H*0.03);
  const lvH=compact?42:48,lvTop=playTop+playH+14;
  const qFs=Math.floor(Math.min(32,(CW-36)/9.4));

  const [showSettings,setShowSettings]=useState(false);
  const {music,sfx,setMusic,setSfx}=useBTSound();

  const enter=useRef(new Animated.Value(0)).current,bob=useRef(new Animated.Value(0)).current,
    pu=useRef(new Animated.Value(0)).current,glow=useRef(new Animated.Value(0)).current,tw=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    Animated.spring(enter,{toValue:1,friction:6,tension:60,useNativeDriver:true}).start();
    yoyo(bob,1500);yoyo(pu,800);yoyo(glow,1100);yoyo(tw,700);
  },[]);
  const cardY=enter.interpolate({inputRange:[0,1],outputRange:[70,0]}),
    brainY=bob.interpolate({inputRange:[0,1],outputRange:[0,-6]}),
    puS=pu.interpolate({inputRange:[0,1],outputRange:[1,1.05]}),
    glowO=glow.interpolate({inputRange:[0,1],outputRange:[0.35,1]}),
    glowS=glow.interpolate({inputRange:[0,1],outputRange:[0.9,1.15]}),
    twO=tw.interpolate({inputRange:[0,1],outputRange:[0.3,1]});

  const dash=(c:string,rot:string,w=18)=><Animated.View style={{width:w,height:5,borderRadius:3,backgroundColor:c,opacity:twO,marginVertical:4,transform:[{rotate:rot}]}}/>;

  return <View style={{flex:1,backgroundColor:SKY}}>
    <SkyWorld W={W} H={H} cx={cx} cw={sw} wide={wide}/>

    <Stage bg="transparent">
      {/* ---- speech-bubble card ---- */}
      <Animated.View style={[hm.card,{left:20,right:20,top:cardTop,height:cardH,opacity:enter,transform:[{translateY:cardY}]}]}>
        <View style={hm.cardIn}>
          <View style={hm.gloss}/>
          <Text allowFontScaling={false} numberOfLines={1} style={[hm.q,{fontSize:qFs,color:NAVY}]}>Are you ready to</Text>
          <Text allowFontScaling={false} numberOfLines={1} style={[hm.q,{fontSize:qFs,color:INDIGO}]}>test your brain?</Text>
          <View style={hm.under}/>
        </View>
      </Animated.View>

      {/* ---- brain mascot (drawn after the card so its hand grips the card edge) ---- */}
      <Animated.View pointerEvents="none" style={{position:'absolute',left:0,right:0,top:brainTop,alignItems:'center',opacity:enter,transform:[{translateY:brainY}]}}>
        <BrainSvg w={brainW}/></Animated.View>

      {/* glowing light bulb */}
      <View pointerEvents="none" style={{position:'absolute',left:sw/2+brainW*0.1,top:bulbTop,width:bulbW,height:bulbW*1.3,alignItems:'center',justifyContent:'center'}}>
        <Animated.View style={{position:'absolute',width:bulbW*1.5,height:bulbW*1.5,borderRadius:bulbW*0.75,backgroundColor:'rgba(255,226,90,0.28)',opacity:glowO,transform:[{scale:glowS}]}}/>
        <BulbSvg w={bulbW}/></View>

      {/* ---- PLAY ---- */}
      <Animated.View style={{position:'absolute',left:0,right:0,top:playTop,alignItems:'center',opacity:enter,transform:[{scale:puS}]}}>
        <TouchableOpacity onPress={onGo} activeOpacity={0.85} style={[hm.btnOuter,{width:sw*0.64,height:playH}]}>
          <View style={hm.btnIn}>
            <View style={hm.btnShine}/>
            <Svg width={34} height={34} viewBox="0 0 24 24"><Polygon points="6,3 21,12 6,21" fill="#fff" stroke={NAVY} strokeWidth="2" strokeLinejoin="round"/></Svg>
            <Text style={[hm.btnt,{fontSize:compact?32:38}]}>PLAY</Text>
          </View></TouchableOpacity>
        <View style={{position:'absolute',left:sw*0.18-30,top:playH*0.2}}>{dash('#ffd21f','-35deg',16)}{dash('#ffd21f','0deg',16)}{dash('#ffd21f','35deg',16)}</View>
        <View style={{position:'absolute',right:sw*0.18-30,top:playH*0.2}}>{dash('#ffd21f','35deg',16)}{dash('#ffd21f','0deg',16)}{dash('#ffd21f','-35deg',16)}</View>
      </Animated.View>

      {/* ---- LEVELS ---- */}
      <Animated.View style={{position:'absolute',left:0,right:0,top:lvTop,alignItems:'center',opacity:enter}}>
        <TouchableOpacity onPress={onLevels} activeOpacity={0.85} style={[hm.lvOuter,{height:lvH}]}>
          <View style={hm.lvIn}>
            <View style={hm.lvShine}/>
            <Svg width={24} height={24} viewBox="0 0 24 24"><Path d="M4 6h2M9 6h11M4 12h2M9 12h11M4 18h2M9 18h11" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/></Svg>
            <Text style={[hm.lvT,{fontSize:compact?20:24}]}>LEVELS</Text>
          </View></TouchableOpacity>
      </Animated.View>
      {!!err&&<Text style={[hm.err,{position:'absolute',left:20,right:20,top:lvTop+lvH+8}]}>{err}</Text>}

      {/* ---- top bar ---- */}
      <View style={hm.top}>
        <TouchableOpacity onPress={onHome} style={[hm.tb,{backgroundColor:'#8a4fe0',borderColor:'#c9a8f5'}]}><WIcon n="home"/></TouchableOpacity>
        <TouchableOpacity onPress={()=>{playSfx('tap');setShowSettings(true);}} style={[hm.tb,{backgroundColor:'#2f8be0',borderColor:'#8cc8f8'}]}><WIcon n="gear"/></TouchableOpacity>
        <TouchableOpacity style={[hm.tb,{backgroundColor:'#f0457a',borderColor:'#ff9ec0'}]}><WIcon n="dots"/></TouchableOpacity>
        <View style={{flex:1}}/>
        <View style={hm.cpill}><Coin s={28}/><Text style={hm.cnum}>{hints}</Text><View style={hm.cplus}><Text style={hm.cplust}>+</Text></View></View>
      </View>

      {/* Settings pop-up (Music / Sound Effects / About / Close) */}
      <BTSettingsModal
        visible={showSettings}
        onClose={()=>setShowSettings(false)}
        music={music}
        sfx={sfx}
        onMusicChange={setMusic}
        onSfxChange={(v:boolean)=>{setSfx(v);if(v)playSfx('tap');}}
      />
    </Stage>
  </View>}

const hm=StyleSheet.create({
  top:{position:'absolute',top:34,left:0,right:0,flexDirection:'row',alignItems:'center',paddingHorizontal:14,gap:10},
  tb:{width:48,height:48,borderRadius:24,borderWidth:3,alignItems:'center',justifyContent:'center',elevation:5},
  cpill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#1a1060',borderWidth:3,borderColor:'#7a5af0',borderRadius:26,paddingHorizontal:10,height:48,elevation:5},
  cnum:{fontFamily:F,fontSize:22,fontWeight:'900',color:'#fff',minWidth:16,textAlign:'center'},
  cplus:{width:28,height:28,borderRadius:14,backgroundColor:'#2fc24a',alignItems:'center',justifyContent:'center'},
  cplust:{color:'#fff',fontWeight:'900',fontSize:20,lineHeight:24},

  card:{position:'absolute',backgroundColor:'#5a3be0',borderRadius:44,padding:5,elevation:10,shadowColor:'#9a7bff',shadowOpacity:0.7,shadowRadius:14,shadowOffset:{width:0,height:4}},
  cardIn:{flex:1,backgroundColor:'#f1eefc',borderRadius:40,borderWidth:3,borderColor:'#c9b8ff',alignItems:'center',justifyContent:'center',paddingTop:14,overflow:'hidden'},
  gloss:{position:'absolute',top:10,left:22,width:46,height:12,borderRadius:6,backgroundColor:'rgba(255,255,255,0.9)',transform:[{rotate:'-14deg'}]},
  q:{fontFamily:F,fontWeight:'900',textAlign:'center'},
  under:{marginTop:4,width:'42%',height:4,borderRadius:2,backgroundColor:'#ffc72c',transform:[{rotate:'-1.5deg'}]},

  btnOuter:{backgroundColor:'#f08a1c',borderRadius:42,padding:4,elevation:6,shadowColor:'#ffb030',shadowOpacity:0.6,shadowRadius:8,shadowOffset:{width:0,height:4}},
  btnIn:{flex:1,backgroundColor:'#ffd21f',borderRadius:38,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,overflow:'hidden'},
  btnShine:{position:'absolute',top:4,left:20,right:20,height:12,borderRadius:6,backgroundColor:'rgba(255,255,255,0.5)'},
  btnt:{fontFamily:F,fontWeight:'900',color:NAVY},

  lvOuter:{backgroundColor:'#3a1a9a',borderRadius:30,padding:3,elevation:4,minWidth:170},
  lvIn:{flex:1,backgroundColor:'#8a3fe0',borderRadius:27,paddingHorizontal:30,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,overflow:'hidden'},
  lvShine:{position:'absolute',top:3,left:18,right:18,height:8,borderRadius:4,backgroundColor:'rgba(255,255,255,0.3)'},
  lvT:{fontFamily:F,fontWeight:'900',color:'#fff'},
  err:{color:'#ffb0c8',fontFamily:F,fontSize:14,textAlign:'center'}});