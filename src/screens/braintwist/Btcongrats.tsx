import React,{useEffect,useRef,useState} from 'react';
import {View,Text,Animated,Pressable,Easing} from 'react-native';
import Svg,{Rect,Path,Circle,Ellipse,G,Polygon,Defs,LinearGradient,Stop} from 'react-native-svg';
import {F} from './BTShared';

const NAVY='#132f70';

/* 5-point star path (centre 0,0) */
const starPts=(R:number,r:number)=>{
  const pts:string[]=[];
  for(let i=0;i<10;i++){
    const a=-Math.PI/2+i*Math.PI/5,rad=i%2===0?R:r;
    pts.push((Math.cos(a)*rad).toFixed(1)+','+(Math.sin(a)*rad).toFixed(1));
  }
  return pts.join(' ')};

const MiniStar=({x,y,s}:any)=><G transform={`translate(${x} ${y}) scale(${s})`}>
  <Polygon points={starPts(40,18)} fill="#ffd93b" stroke="#f5b50f" strokeWidth="9" strokeLinejoin="round"/>
  <Polygon points={starPts(40,18)} fill="#ffe66d"/></G>;

/* ---------- happy star mascot ---------- */
const StarMascot=({w}:any)=><Svg width={w} height={w*0.82} viewBox="-130 -105 260 215">
  <Defs><LinearGradient id="gStar" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#ffe45c"/><Stop offset="1" stopColor="#f9bd16"/></LinearGradient></Defs>
  {/* glow */}
  <Circle cx="0" cy="0" r="105" fill="rgba(255,244,170,0.55)"/>
  {/* arms */}
  <Path d="M-62 28 Q-96 10 -104 -22" stroke="#b4651f" strokeWidth="13" strokeLinecap="round" fill="none"/>
  <Path d="M62 28 Q96 10 104 -22" stroke="#b4651f" strokeWidth="13" strokeLinecap="round" fill="none"/>
  <Circle cx="-106" cy="-30" r="20" fill="#fff" stroke="#8a4a1b" strokeWidth="4"/>
  <Circle cx="106" cy="-30" r="20" fill="#fff" stroke="#8a4a1b" strokeWidth="4"/>
  {/* body */}
  <Polygon points={starPts(100,52)} fill="url(#gStar)" stroke="#f2b00f" strokeWidth="14" strokeLinejoin="round"/>
  <Polygon points={starPts(100,52)} fill="url(#gStar)"/>
  {/* face */}
  <Path d="M-38 -4 Q-28 -18 -18 -4" stroke="#5b2a12" strokeWidth="6" strokeLinecap="round" fill="none"/>
  <Path d="M18 -4 Q28 -18 38 -4" stroke="#5b2a12" strokeWidth="6" strokeLinecap="round" fill="none"/>
  <Ellipse cx="-44" cy="14" rx="13" ry="9" fill="#ff8f7a" opacity="0.85"/>
  <Ellipse cx="44" cy="14" rx="13" ry="9" fill="#ff8f7a" opacity="0.85"/>
  <Path d="M-16 8 Q0 36 16 8 Z" fill="#7a1f1f" stroke="#5b2a12" strokeWidth="4" strokeLinejoin="round"/>
  <Path d="M-8 20 Q0 28 8 20 Q0 15 -8 20Z" fill="#ff7a7a"/>
</Svg>;

/* ---------- sky + confetti ---------- */
function Backdrop(){
  const conf:any[]=[[40,120,'#c04ee8',20],[330,90,'#ffd93b',-30],[70,240,'#7bd957',40],[350,230,'#e86fb5',-20],[30,380,'#ffd93b',25],[360,400,'#7a5cf0',-40],[110,70,'#ff9f43',10],[290,150,'#4fc3f7',50],[200,40,'#7bd957',-15]];
  return <Svg width="100%" height="100%" viewBox="0 0 400 760" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',left:0,top:0}}>
    <Defs>
      <LinearGradient id="gSky2" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#3f94dd"/><Stop offset="0.6" stopColor="#62b9f1"/><Stop offset="1" stopColor="#9bdcf8"/></LinearGradient>
      <LinearGradient id="gGr2" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#8fdc4f"/><Stop offset="1" stopColor="#4ba72d"/></LinearGradient>
    </Defs>
    <Rect width="400" height="760" fill="url(#gSky2)"/>
    <Ellipse cx="60" cy="14" rx="110" ry="40" fill="#3f9f35"/><Ellipse cx="360" cy="10" rx="120" ry="42" fill="#3a9a32"/>
    <G fill="#fff" opacity="0.9"><Ellipse cx="340" cy="190" rx="38" ry="18"/><Ellipse cx="318" cy="198" rx="26" ry="14"/><Ellipse cx="362" cy="198" rx="26" ry="14"/></G>
    {conf.map((c,i)=><Rect key={i} x={c[0]} y={c[1]} width="14" height="26" rx="4" fill={c[2]} transform={`rotate(${c[3]} ${c[0]} ${c[1]})`}/>)}
    {/* meadow + fence */}
    <Ellipse cx="80" cy="690" rx="200" ry="70" fill="#86d14a"/><Ellipse cx="340" cy="700" rx="220" ry="70" fill="#9be05a"/>
    <Path d="M0 700 Q200 676 400 700 V760 H0Z" fill="url(#gGr2)"/>
    <Rect x="0" y="640" width="400" height="9" fill="#e49c46"/><Rect x="0" y="668" width="400" height="9" fill="#e49c46"/>
    {[0,1,2,3,4,5,6,7,8].map(i=>{const x=i*48-6;return <Path key={i} d={`M${x} 690 V636 L${x+13} 622 L${x+26} 636 V690Z`} fill="#f0b45a" stroke="#c27a2a" strokeWidth="2"/>})}
  </Svg>}

/* ---------- squish button ---------- */
function Squish({onPress,style,children}:any){
  const s=useRef(new Animated.Value(1)).current;
  const to=(v:number)=>Animated.spring(s,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
  return <Pressable onPress={onPress} onPressIn={()=>to(0.94)} onPressOut={()=>to(1)} style={style}>
    <Animated.View style={{transform:[{scale:s}]}}>{children}</Animated.View></Pressable>}

/* =====================  CONGRATS PAGE  =====================
   props: n = level number just completed, onNext = go to next level            */
export default function BTCongrats({n,onNext}:any){
  const [box,setBox]=useState({w:0,h:0});
  const pop=useRef(new Animated.Value(0)).current;
  const bob=useRef(new Animated.Value(0)).current;
  const twinkle=useRef(new Animated.Value(0)).current;

  useEffect(()=>{
    Animated.spring(pop,{toValue:1,friction:6,tension:90,useNativeDriver:true}).start();
    const a=Animated.loop(Animated.sequence([
      Animated.timing(bob,{toValue:1,duration:900,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
      Animated.timing(bob,{toValue:0,duration:900,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
    const b=Animated.loop(Animated.sequence([
      Animated.timing(twinkle,{toValue:1,duration:700,useNativeDriver:true}),
      Animated.timing(twinkle,{toValue:0.35,duration:700,useNativeDriver:true})]));
    a.start();b.start();
    return()=>{a.stop();b.stop()}},[]);

  const cw=Math.min(box.w*0.88,460),s=cw/360;

  return <View style={{flex:1,backgroundColor:'#62b9f1'}} onLayout={e=>setBox({w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height})}>
    <Backdrop/>
    {box.w>0&&<View pointerEvents="box-none" style={{position:'absolute',left:0,right:0,top:0,bottom:0,alignItems:'center',justifyContent:'center'}}>
      <Animated.View style={{width:cw,alignItems:'center',opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}}>

        {/* star mascot + sparkles */}
        <Animated.View style={{zIndex:3,marginBottom:-30*s,alignItems:'center',transform:[{translateY:bob.interpolate({inputRange:[0,1],outputRange:[0,-8*s]})}]}}>
          <StarMascot w={210*s}/>
          <Animated.View pointerEvents="none" style={{position:'absolute',left:0,top:0,width:210*s,height:172*s,opacity:twinkle}}>
            <Svg width={210*s} height={172*s} viewBox="0 0 210 172">
              <MiniStar x={20} y={30} s={0.55}/><MiniStar x={192} y={26} s={0.5}/>
              <MiniStar x={10} y={110} s={0.45}/><MiniStar x={202} y={112} s={0.5}/>
            </Svg>
          </Animated.View>
        </Animated.View>

        {/* Congratulations banner */}
        <View style={{zIndex:4,width:cw*0.98,paddingVertical:12*s,borderRadius:18*s,backgroundColor:'#b4651f',borderWidth:5*s,borderColor:'#8a4a1b',alignItems:'center',justifyContent:'center',elevation:6,marginBottom:-18*s}}>
          <View style={{position:'absolute',top:6*s,left:14*s,right:14*s,height:4*s,borderRadius:2*s,backgroundColor:'rgba(255,214,150,0.35)'}}/>
          <Text numberOfLines={1} style={{fontFamily:F,fontSize:36*s,fontWeight:'900',color:'#fff',includeFontPadding:false,textShadowColor:'rgba(60,25,0,0.65)',textShadowOffset:{width:0,height:2},textShadowRadius:3}}>Congratulations!</Text>
        </View>

        {/* cream panel */}
        <View style={{zIndex:2,width:cw*0.9,paddingTop:38*s,paddingBottom:26*s,paddingHorizontal:20*s,borderRadius:34*s,backgroundColor:'#fcf1de',borderWidth:8*s,borderColor:'#e0902f',alignItems:'center',elevation:4}}>
          <Text style={{fontFamily:F,fontSize:24*s,fontWeight:'900',color:NAVY,includeFontPadding:false}}>You completed</Text>
          <Text numberOfLines={1} style={{fontFamily:F,fontSize:50*s,fontWeight:'900',color:NAVY,includeFontPadding:false,marginTop:2*s}}>{'Level '+n+'!'}</Text>

          {/* Next Level button */}
          <Squish onPress={onNext} style={{marginTop:22*s,width:'100%'}}>
            <View style={{height:62*s,borderRadius:31*s,backgroundColor:'#7fd62f',borderWidth:4*s,borderColor:'#3f9a1c',borderBottomWidth:8*s,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:14*s}}>
              <Text numberOfLines={1} style={{fontFamily:F,fontSize:30*s,fontWeight:'900',color:'#fff',includeFontPadding:false,textShadowColor:'rgba(30,90,10,0.7)',textShadowOffset:{width:0,height:2},textShadowRadius:2}}>Next Level</Text>
              <Svg width={28*s} height={28*s} viewBox="0 0 100 100"><Polygon points="22,12 86,50 22,88" fill="#fff" stroke="#fff" strokeWidth="8" strokeLinejoin="round"/></Svg>
            </View>
          </Squish>
        </View>

      </Animated.View>
    </View>}
  </View>}
