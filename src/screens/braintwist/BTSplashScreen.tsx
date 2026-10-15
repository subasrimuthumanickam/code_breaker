import React,{useEffect,useRef,useState} from 'react';
import {View,Text,Animated,StyleSheet} from 'react-native';
import Svg,{Circle,Path,Defs,ClipPath,Rect,G} from 'react-native-svg';
import {F,Stage,loop,useStageW} from './BTShared';

const BC=[[62,62,30],[100,46,32],[138,62,30],[48,100,28],[152,100,28],[100,92,46],[70,128,28],[130,128,28]];
const FOLDS='M78 52 Q90 62 82 74 M120 50 Q110 62 120 72 M58 92 Q70 98 64 110 M144 92 Q132 100 138 112';
const TIPS=['Warming up your brain...','Sharpening the puzzles...','Almost ready to think!'];
const DOTS=Array.from({length:20},(_,i)=>({x:(i*53)%96+2,y:(i*37)%78+3,s:2+(i%3),o:0.35+(i%4)*0.15}));

// brain: dim outline, pink fill grows left -> right with progress
const BrainFill=({w,p}:any)=><Svg width={w} height={w*0.8} viewBox="0 14 200 160">
  <Defs><ClipPath id="btfill"><Rect x="0" y="0" width={Math.max(0,p*2)} height="200"/></ClipPath></Defs>
  {BC.map(([x,y,r]:any,i)=><Circle key={'a'+i} cx={x} cy={y} r={r} fill="#2b2378" stroke="#4b3fb0" strokeWidth="5"/>)}
  {BC.map(([x,y,r]:any,i)=><Circle key={'b'+i} cx={x} cy={y} r={r-1} fill="#2b2378"/>)}
  <Path d={FOLDS} stroke="#4b3fb0" strokeWidth="3" fill="none" strokeLinecap="round"/>
  <G clipPath="url(#btfill)">
    {BC.map(([x,y,r]:any,i)=><Circle key={'c'+i} cx={x} cy={y} r={r} fill="#f58fa6" stroke="#e0607f" strokeWidth="5"/>)}
    {BC.map(([x,y,r]:any,i)=><Circle key={'d'+i} cx={x} cy={y} r={r-1} fill="#f58fa6"/>)}
    <Path d={FOLDS} stroke="#e0607f" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </G>
</Svg>;

export default function BTSplashScreen({onDone}:any){
  const[p,setP]=useState(0),sw=useStageW();
  const pop=useRef(new Animated.Value(0)).current,fl=useRef(new Animated.Value(0)).current,
    gl=useRef(new Animated.Value(0)).current,tw=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
    loop(fl,1000);loop(gl,1400);loop(tw,800);
    const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
  useEffect(()=>{if(p>=100){const t=setTimeout(onDone,350);return()=>clearTimeout(t)}},[p]);
  const flY=fl.interpolate({inputRange:[0,1],outputRange:[0,-10]}),
    glS=gl.interpolate({inputRange:[0,1],outputRange:[0.9,1.12]}),glO=gl.interpolate({inputRange:[0,1],outputRange:[0.12,0.3]}),
    twA=tw.interpolate({inputRange:[0,1],outputRange:[0.25,1]}),twB=tw.interpolate({inputRange:[0,1],outputRange:[1,0.25]}),
    popS=pop.interpolate({inputRange:[0,1],outputRange:[0.4,1]});
  const barW=Math.min(sw*0.7,300);
  return <Stage bg="#1a1445">
    {DOTS.map((d,i)=><Animated.View key={i} pointerEvents="none" style={{position:'absolute',left:(d.x+'%') as any,top:(d.y+'%') as any,width:d.s,height:d.s,borderRadius:d.s,backgroundColor:'#fff',opacity:i%2?twA:twB}}/>)}
    <View style={sp.center}>
      <Animated.View style={{alignItems:'center',opacity:pop,transform:[{scale:popS}]}}>
        <Text style={sp.t1}>{'BRAIN '}<Text style={{color:'#ffd21f'}}>TWIST</Text></Text>
        <Text style={sp.tag}>THINK  •  SOLVE  •  GROW</Text>
      </Animated.View>

      <View style={sp.brainBox}>
        <Animated.View style={[sp.glow,{opacity:glO,transform:[{scale:glS}]}]}/>
        <Animated.View style={{transform:[{translateY:flY}]}}><BrainFill w={Math.min(230,sw*0.6)} p={p}/></Animated.View>
      </View>

      <Text style={sp.pct}>{p+'%'}</Text>
      <View style={[sp.track,{width:barW}]}>
        <View style={[sp.fill,{width:(p+'%') as any}]}><View style={sp.shine}/></View>
      </View>
      <Text style={sp.tip}>{TIPS[Math.min(2,Math.floor(p/34))]}</Text>
    </View>
  </Stage>}

const sp=StyleSheet.create({
  center:{flex:1,alignItems:'center',justifyContent:'center'},
  t1:{fontFamily:F,fontSize:46,fontWeight:'900',color:'#fff',textShadowColor:'rgba(106,79,224,0.8)',textShadowRadius:10,textShadowOffset:{width:0,height:3}},
  tag:{fontFamily:F,fontSize:14,fontWeight:'bold',color:'#a79ee0',letterSpacing:3,marginTop:2},
  brainBox:{width:280,height:230,alignItems:'center',justifyContent:'center',marginTop:20},
  glow:{position:'absolute',width:250,height:250,borderRadius:125,backgroundColor:'#6a4fe0'},
  pct:{fontFamily:F,fontSize:30,fontWeight:'900',color:'#fff',marginTop:6},
  track:{height:20,borderRadius:10,backgroundColor:'#2b2378',borderWidth:3,borderColor:'#4b3fb0',marginTop:10,overflow:'hidden'},
  fill:{height:'100%',backgroundColor:'#34c73c',borderRadius:8},
  shine:{position:'absolute',top:2,left:6,right:6,height:4,borderRadius:2,backgroundColor:'rgba(255,255,255,0.45)'},
  tip:{fontFamily:F,fontSize:15,color:'#a79ee0',marginTop:14}});