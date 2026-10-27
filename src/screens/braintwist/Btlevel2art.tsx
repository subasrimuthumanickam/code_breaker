
import React,{useEffect,useRef} from 'react';
import {View,Animated,Easing,StyleSheet} from 'react-native';
import Svg,{Circle,Path,Rect,Ellipse,G,Polygon,Line} from 'react-native-svg';

const INK='#2f3b52';



const drop=(x:number,y:number,k:number)=>
  <Path key={k} transform={`translate(${x} ${y})`} d="M0 -10 C6 -2 8 4 0 9 C-8 4 -6 -2 0 -10 Z" fill="#3b8fd6" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>;

export function ClueArt({size=120}:{size?:number}){
  const shapes=(fill:string,extra:any={})=><G>
    <Circle cx={38} cy={62} r={22} fill={fill} {...extra}/>
    <Circle cx={66} cy={44} r={28} fill={fill} {...extra}/>
    <Circle cx={94} cy={62} r={20} fill={fill} {...extra}/>
    <Rect x={38} y={52} width={56} height={32} rx={14} fill={fill} {...extra}/>
  </G>;
  return <Svg width={size} height={size*135/120} viewBox="0 0 120 135">
    {shapes(INK,{stroke:INK,strokeWidth:7})}
    {shapes('#9dbbd6')}
    <Path d="M24 56 Q30 44 44 44" stroke="#fff" strokeOpacity={0.6} strokeWidth={4} fill="none" strokeLinecap="round"/>
    {drop(32,102,0)}{drop(54,116,1)}{drop(76,100,2)}{drop(98,114,3)}{drop(64,128,4)}
  </Svg>;
}

/* =========================================================
   ROOM BACKGROUND  (same as Level 1 RoomBg: animated cozy room)
   Put it inside a container that has overflow:'hidden'
========================================================= */

const yoyo=(v:Animated.Value,ms:number)=>Animated.loop(Animated.sequence([
  Animated.timing(v,{toValue:1,duration:ms,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
  Animated.timing(v,{toValue:0,duration:ms,easing:Easing.inOut(Easing.sin),useNativeDriver:true})])).start();

const Mote=({left,size,ms,delay}:any)=>{
  const p=useRef(new Animated.Value(0)).current;
  useEffect(()=>{Animated.sequence([Animated.delay(delay),Animated.loop(Animated.timing(p,{toValue:1,duration:ms,easing:Easing.linear,useNativeDriver:true}))]).start()},[]);
  return <Animated.View pointerEvents="none" style={{position:'absolute',left,bottom:'18%',width:size,height:size,borderRadius:size/2,backgroundColor:'#fff',
    opacity:p.interpolate({inputRange:[0,0.2,0.8,1],outputRange:[0,0.8,0.6,0]}),
    transform:[{translateY:p.interpolate({inputRange:[0,1],outputRange:[0,-420]})},{translateX:p.interpolate({inputRange:[0,0.5,1],outputRange:[0,14,-8]})}]}}/>};

const Leaf=({l,b,w,h,r,c}:any)=><View style={{position:'absolute',left:l,bottom:b,width:w,height:h,borderRadius:h/2,backgroundColor:c||'#5fae3a',transform:[{rotate:r+'deg'}]}}/>;

export function RoomBackground(){
  const beam=useRef(new Animated.Value(0)).current,cl=useRef(new Animated.Value(0)).current,sw=useRef(new Animated.Value(0)).current,sw2=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    yoyo(beam,3600);yoyo(sw,2400);yoyo(sw2,3000);
    Animated.loop(Animated.timing(cl,{toValue:1,duration:26000,easing:Easing.linear,useNativeDriver:true})).start()},[]);
  const bo=beam.interpolate({inputRange:[0,1],outputRange:[0.45,1]}),
    bx=beam.interpolate({inputRange:[0,1],outputRange:[-14,14]}),
    cx=cl.interpolate({inputRange:[0,1],outputRange:[-50,90]}),
    plantR=sw.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']}),
    plantR2=sw2.interpolate({inputRange:[0,1],outputRange:['2.5deg','-2.5deg']});
  const books=(arr:any[])=>arr.map((b,i)=><View key={i} style={{width:b[0],height:b[1],backgroundColor:b[2],borderRadius:2,marginRight:1}}/>);
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill,{backgroundColor:'#9fc6ea',overflow:'hidden'}]}>
    {/* wall */}
    <View style={{position:'absolute',left:0,right:0,top:0,height:'45%',backgroundColor:'rgba(255,255,255,0.22)'}}/>
    <View style={{position:'absolute',left:0,right:0,top:'45%',height:'30%',backgroundColor:'rgba(255,255,255,0.08)'}}/>
    {/* picture frame */}
    <View style={{position:'absolute',right:'7%',top:'11%',width:66,height:74,backgroundColor:'#cfe6f3',borderWidth:4,borderColor:'#8fc3d8'}}>
      <View style={{alignSelf:'center',marginTop:14,width:34,height:34,borderRadius:17,backgroundColor:'#f6a43c',borderWidth:4,borderColor:'#f7c36a'}}/></View>
    {/* window */}
    <View style={{position:'absolute',left:-4,top:'8%',width:82,height:200,backgroundColor:'#f0b878',borderWidth:5,borderColor:'#e2a35e',borderRadius:4,overflow:'hidden'}}>
      <View style={{flex:1,backgroundColor:'#8fd3f6',overflow:'hidden'}}>
        <Animated.View style={{position:'absolute',top:24,transform:[{translateX:cx}]}}>
          <View style={{width:50,height:16,borderRadius:8,backgroundColor:'rgba(255,255,255,0.9)'}}/>
          <View style={{position:'absolute',left:10,top:-9,width:22,height:22,borderRadius:11,backgroundColor:'rgba(255,255,255,0.9)'}}/></Animated.View>
        <Animated.View style={{position:'absolute',top:76,transform:[{translateX:cx.interpolate({inputRange:[-50,90],outputRange:[60,-60]})}]}}>
          <View style={{width:36,height:12,borderRadius:6,backgroundColor:'rgba(255,255,255,0.75)'}}/></Animated.View>
        <View style={{position:'absolute',left:6,bottom:-14,width:44,height:60,borderRadius:30,backgroundColor:'#7bc65a'}}/>
        <View style={{position:'absolute',left:36,bottom:-20,width:50,height:70,borderRadius:35,backgroundColor:'#62b24a'}}/></View>
      <View style={{position:'absolute',left:0,right:0,top:'50%',height:4,backgroundColor:'#e2a35e'}}/></View>
    {/* window sill + plant */}
    <View style={{position:'absolute',left:0,top:'8%',marginTop:196,width:96,height:14,backgroundColor:'#e9b370',borderTopRightRadius:4,borderBottomRightRadius:4}}/>
    <Animated.View style={{position:'absolute',left:10,top:'8%',marginTop:132,width:70,height:66,transform:[{rotate:plantR}]}}>
      <Leaf l={6} b={24} w={20} h={50} r={-28}/><Leaf l={22} b={24} w={22} h={60} r={-4} c="#4f9f34"/><Leaf l={40} b={24} w={20} h={48} r={26}/>
      <View style={{position:'absolute',left:14,bottom:0,width:40,height:28,borderRadius:8,backgroundColor:'#f5ead8'}}>
        <View style={{flexDirection:'row',justifyContent:'center',gap:10,marginTop:9}}><View style={rb.eye}/><View style={rb.eye}/></View></View></Animated.View>
    {/* sunbeams */}
    <Animated.View style={{position:'absolute',top:'-6%',left:'14%',width:96,height:'82%',backgroundColor:'rgba(255,255,255,0.16)',opacity:bo,transform:[{translateX:bx},{rotate:'-17deg'}]}}/>
    <Animated.View style={{position:'absolute',top:'-6%',left:'34%',width:64,height:'80%',backgroundColor:'rgba(255,255,255,0.12)',opacity:bo.interpolate({inputRange:[0.45,1],outputRange:[1,0.5]}),transform:[{translateX:bx},{rotate:'-17deg'}]}}/>
    <Animated.View style={{position:'absolute',top:'-6%',left:'54%',width:110,height:'78%',backgroundColor:'rgba(255,255,255,0.10)',opacity:bo,transform:[{translateX:bx},{rotate:'-17deg'}]}}/>
    {/* bookshelf (right) */}
    <View style={{position:'absolute',right:0,top:'38%',width:70,height:'31%',backgroundColor:'#e0a85e',borderLeftWidth:5,borderTopWidth:5,borderColor:'#c98d4d'}}>
      <View style={{flex:1,flexDirection:'row',alignItems:'flex-end',paddingLeft:8,borderBottomWidth:5,borderColor:'#c98d4d'}}>{books([[12,46,'#58a6c8'],[10,52,'#f2c14e'],[12,44,'#7b6bd0']])}</View>
      <View style={{flex:1,flexDirection:'row',alignItems:'flex-end',paddingLeft:8,borderBottomWidth:5,borderColor:'#c98d4d'}}>{books([[12,40,'#3f7fc4'],[10,46,'#59b3a0']])}</View>
      <View style={{flex:1,alignItems:'center',justifyContent:'flex-end'}}>
        <View style={{width:44,height:34,borderRadius:16,backgroundColor:'#b9763a'}}/>
        <View style={{position:'absolute',top:6,left:10,width:14,height:14,borderRadius:7,backgroundColor:'#b9763a'}}/>
        <View style={{position:'absolute',top:6,right:14,width:14,height:14,borderRadius:7,backgroundColor:'#b9763a'}}/>
        <View style={{position:'absolute',top:20,width:20,height:14,borderRadius:8,backgroundColor:'#f0cfa0'}}/></View></View>
    {/* hanging vine on shelf */}
    <Animated.View style={{position:'absolute',right:2,top:'30%',width:50,height:80,transform:[{rotate:plantR2}]}}>
      <Leaf l={6} b={8} w={14} h={30} r={-20}/><Leaf l={22} b={20} w={14} h={32} r={18} c="#4f9f34"/><Leaf l={10} b={42} w={14} h={30} r={-10}/></Animated.View>
    {/* floor */}
    <View style={{position:'absolute',left:0,right:0,bottom:0,height:'31%',backgroundColor:'#e9b575'}}>
      {[18,46,78,112,150].map((t,i)=><View key={i} style={{position:'absolute',left:0,right:0,top:t,height:1.5,backgroundColor:'rgba(150,90,40,0.18)'}}/>)}
      <View style={{position:'absolute',left:'4%',top:'12%',width:'92%',height:140,borderRadius:80,backgroundColor:'#f6e8cc',borderWidth:10,borderColor:'rgba(143,190,235,0.55)'}}/></View>
    <View style={{position:'absolute',left:0,right:0,bottom:'31%',height:14,backgroundColor:'#e8b8b0'}}/>
    {/* books stack + toy car (left) */}
    <View style={{position:'absolute',left:-6,bottom:'27%'}}>
      <View style={{width:84,height:16,borderRadius:3,backgroundColor:'#3f9ad6',marginBottom:1}}/>
      <View style={{width:92,height:16,borderRadius:3,backgroundColor:'#e86fae',marginBottom:1,marginLeft:-4}}/>
      <View style={{width:88,height:16,borderRadius:3,backgroundColor:'#f2c14e',marginBottom:1}}/>
      <View style={{width:80,height:14,borderRadius:3,backgroundColor:'#4b7fc4'}}/></View>
    <View style={{position:'absolute',left:6,bottom:'25%',width:54,height:24,borderRadius:10,backgroundColor:'#3aa0e0'}}>
      <View style={{position:'absolute',left:14,top:-10,width:24,height:14,borderTopLeftRadius:8,borderTopRightRadius:8,backgroundColor:'#7cc7f0'}}/>
      <View style={{position:'absolute',left:6,bottom:-6,width:12,height:12,borderRadius:6,backgroundColor:'#2d4a6b'}}/>
      <View style={{position:'absolute',right:6,bottom:-6,width:12,height:12,borderRadius:6,backgroundColor:'#2d4a6b'}}/></View>
    {/* pencil cup (right) */}
    <View style={{position:'absolute',right:6,bottom:'24%',width:44,height:58,borderRadius:6,backgroundColor:'#f5c63a',borderWidth:2,borderColor:'#e0a81f'}}/>
    <View style={{position:'absolute',right:22,bottom:'24%',marginBottom:54,width:6,height:46,backgroundColor:'#e86f6f',transform:[{rotate:'-10deg'}]}}/>
    <View style={{position:'absolute',right:14,bottom:'24%',marginBottom:54,width:6,height:50,backgroundColor:'#3f7fc4',transform:[{rotate:'-22deg'}]}}/>
    <View style={{position:'absolute',right:30,bottom:'24%',marginBottom:54,width:6,height:44,backgroundColor:'#5fae3a',transform:[{rotate:'8deg'}]}}/>
    {/* foreground plant (bottom-left) */}
    <Animated.View style={{position:'absolute',left:-34,bottom:-26,width:150,height:210,transform:[{rotate:plantR}]}}>
      <Leaf l={6} b={0} w={60} h={170} r={-14} c="#6bbb3f"/><Leaf l={44} b={0} w={56} h={150} r={18} c="#4f9f34"/><Leaf l={24} b={0} w={50} h={190} r={2} c="#7cc94a"/></Animated.View>
    {/* dust motes */}
    {[[40,5,9000,0],[110,4,11000,2500],[180,6,10000,1200],[240,4,12000,4000],[300,5,9500,800],[75,3,13000,6000],[210,3,8500,3200]].map((m,i)=><Mote key={i} left={m[0]} size={m[1]} ms={m[2]} delay={m[3]}/>)}
  </View>;
}
const rb=StyleSheet.create({eye:{width:4,height:4,borderRadius:2,backgroundColor:'#5b3a29'}});

/* =========================================================
   HEADER ICONS (used by Level 2 AND Level 3)
========================================================= */

export function HomeIcon(){
  return <Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#1b1b1b" stroke="#1b1b1b" strokeWidth={1.5} strokeLinejoin="round"/></Svg>;
}

export function GearIcon(){
  return <Svg width={22} height={22} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={8} stroke="#1b1b1b" strokeWidth={4} strokeDasharray="3 3.3" fill="none"/>
    <Circle cx={12} cy={12} r={5} fill="none" stroke="#1b1b1b" strokeWidth={2.6}/>
  </Svg>;
}

export function BulbIcon({size=24}:{size?:number}){
  return <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx={12} cy={10} r={6.5} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
    <Rect x={9.5} y={16.5} width={5} height={4} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
  </Svg>;
}

export function StarIcon({size=40,on=true}:{size?:number;on?:boolean}){
  const pts=Array.from({length:10},(_,i)=>{
    const r=i%2?9:21,a=(-90+i*36)*Math.PI/180;
    return `${(24+r*Math.cos(a)).toFixed(1)},${(25+r*Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return <Svg width={size} height={size} viewBox="0 0 48 48">
    <Polygon points={pts} fill={on?'#ffd33d':'none'} stroke={on?'#f5a800':'rgba(255,255,255,0.5)'} strokeWidth={3} strokeLinejoin="round"/>
  </Svg>;
}

/* =========================================================
   CHALK TRAY (kept so other levels never break)
========================================================= */

export function ChalkTray(){
  return <View style={st.tray}>
    <View style={st.ledge}/>
    <View style={st.eraser}>
      <View style={st.eraserTop}/>
      <View style={st.eraserBottom}><View style={st.eraserLine}/><View style={st.eraserLine}/></View>
    </View>
    <View style={[st.chalk,{left:'33%',bottom:12,width:46}]}/>
    <View style={[st.chalk,{left:'50%',bottom:14,width:40,transform:[{rotate:'-12deg'}]}]}/>
  </View>;
}

/* =========================================================
   EXTRA ICONS
========================================================= */

export function SearchIcon({size=34}:{size?:number}){
  return <Svg width={size} height={size} viewBox="0 0 40 40">
    <Circle cx={17} cy={17} r={10} fill="none" stroke="#1b1b1b" strokeWidth={4.5}/>
    <Line x1={25} y1={25} x2={35} y2={35} stroke="#1b1b1b" strokeWidth={5.5} strokeLinecap="round"/>
  </Svg>;
}

export function VideoIcon({size=34}:{size?:number}){
  return <Svg width={size} height={size} viewBox="0 0 40 40">
    <Rect x={5} y={7} width={30} height={26} rx={4} fill="#8a5cf0" stroke="#1b1b1b" strokeWidth={3}/>
    <Polygon points="16,14 16,26 27,20" fill="#fff"/>
  </Svg>;
}

export function SkipIcon({size=34}:{size?:number}){
  return <Svg width={size} height={size} viewBox="0 0 40 40">
    <Polygon points="11,7 11,33 32,20" fill="#1b1b1b" stroke="#1b1b1b" strokeWidth={3} strokeLinejoin="round"/>
  </Svg>;
}

const st=StyleSheet.create({
  tray:{height:44,width:'100%'},
  ledge:{position:'absolute',left:0,right:0,bottom:0,height:20,backgroundColor:'#e08a2e',borderTopWidth:3,borderTopColor:'#f2a64a'},
  eraser:{position:'absolute',left:'8%',bottom:12,width:62,height:30},
  eraserTop:{height:14,backgroundColor:'#b0702a',borderTopLeftRadius:4,borderTopRightRadius:4},
  eraserBottom:{height:16,backgroundColor:'#222',borderBottomLeftRadius:3,borderBottomRightRadius:3,justifyContent:'space-evenly',paddingHorizontal:3},
  eraserLine:{height:2,backgroundColor:'#555'},
  chalk:{position:'absolute',height:8,borderRadius:4,backgroundColor:'#f6f3ea'},
});