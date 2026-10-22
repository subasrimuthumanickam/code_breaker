
import React,{useEffect,useRef} from 'react';
import {View,Animated,PanResponder,StyleSheet,Easing} from 'react-native';
import Svg,{Rect,Path,Circle,Ellipse,Polygon,Line} from 'react-native-svg';

/* ---------- eraser + pencil (same as the other levels) ---------- */
export const Eraser=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#f4f4f0" stroke="#d9d9d4" strokeWidth="2"/><Path d="M4 20 Q4 8 16 8 H70 L52 54 H16 Q4 54 4 42 Z" fill="#2ab4d9"/><Path d="M12 15 H60" stroke="#8fe0f2" strokeWidth="3" strokeLinecap="round"/></Svg>;
export const Pencil=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke="#c9985a" strokeWidth="1"/><Polygon points="2,15 10,11.5 10,18.5" fill="#333"/><Rect x="26" y="4" width="84" height="22" fill="#2fa86f"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Line x1="28" y1="19" x2="108" y2="19" stroke="#1f7a4e" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#9a9a9a"/><Line x1="116" y1="3" x2="116" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Line x1="124" y1="3" x2="124" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#f4f2ea"/></Svg>;

export function FreeDrag({children}:any){
  const pan=useRef(new Animated.ValueXY()).current;
  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>true,
    onPanResponderGrant:()=>{pan.extractOffset()},
    onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
    onPanResponderRelease:()=>{pan.flattenOffset()}})).current;
  return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

/* ---------- animated cozy room background (same as the app's room) ---------- */
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
const eye=StyleSheet.create({eye:{width:4,height:4,borderRadius:2,backgroundColor:'#5b3a29'}});

export function RoomBg(){
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
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <View style={{position:'absolute',left:0,right:0,top:0,height:'45%',backgroundColor:'rgba(255,255,255,0.22)'}}/>
    <View style={{position:'absolute',left:0,right:0,top:'45%',height:'30%',backgroundColor:'rgba(255,255,255,0.08)'}}/>
    <View style={{position:'absolute',right:'7%',top:'11%',width:66,height:74,backgroundColor:'#cfe6f3',borderWidth:4,borderColor:'#8fc3d8'}}>
      <View style={{alignSelf:'center',marginTop:14,width:34,height:34,borderRadius:17,backgroundColor:'#f6a43c',borderWidth:4,borderColor:'#f7c36a'}}/></View>
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
    <View style={{position:'absolute',left:0,top:'8%',marginTop:196,width:96,height:14,backgroundColor:'#e9b370',borderTopRightRadius:4,borderBottomRightRadius:4}}/>
    <Animated.View style={{position:'absolute',left:10,top:'8%',marginTop:132,width:70,height:66,transform:[{rotate:plantR}]}}>
      <Leaf l={6} b={24} w={20} h={50} r={-28}/><Leaf l={22} b={24} w={22} h={60} r={-4} c="#4f9f34"/><Leaf l={40} b={24} w={20} h={48} r={26}/>
      <View style={{position:'absolute',left:14,bottom:0,width:40,height:28,borderRadius:8,backgroundColor:'#f5ead8'}}>
        <View style={{flexDirection:'row',justifyContent:'center',gap:10,marginTop:9}}><View style={eye.eye}/><View style={eye.eye}/></View></View></Animated.View>
    <Animated.View style={{position:'absolute',top:'-6%',left:'14%',width:96,height:'82%',backgroundColor:'rgba(255,255,255,0.16)',opacity:bo,transform:[{translateX:bx},{rotate:'-17deg'}]}}/>
    <Animated.View style={{position:'absolute',top:'-6%',left:'34%',width:64,height:'80%',backgroundColor:'rgba(255,255,255,0.12)',opacity:bo.interpolate({inputRange:[0.45,1],outputRange:[1,0.5]}),transform:[{translateX:bx},{rotate:'-17deg'}]}}/>
    <Animated.View style={{position:'absolute',top:'-6%',left:'54%',width:110,height:'78%',backgroundColor:'rgba(255,255,255,0.10)',opacity:bo,transform:[{translateX:bx},{rotate:'-17deg'}]}}/>
    <View style={{position:'absolute',right:0,top:'38%',width:70,height:'31%',backgroundColor:'#e0a85e',borderLeftWidth:5,borderTopWidth:5,borderColor:'#c98d4d'}}>
      <View style={{flex:1,flexDirection:'row',alignItems:'flex-end',paddingLeft:8,borderBottomWidth:5,borderColor:'#c98d4d'}}>{books([[12,46,'#58a6c8'],[10,52,'#f2c14e'],[12,44,'#7b6bd0']])}</View>
      <View style={{flex:1,flexDirection:'row',alignItems:'flex-end',paddingLeft:8,borderBottomWidth:5,borderColor:'#c98d4d'}}>{books([[12,40,'#3f7fc4'],[10,46,'#59b3a0']])}</View>
      <View style={{flex:1,alignItems:'center',justifyContent:'flex-end'}}>
        <View style={{width:44,height:34,borderRadius:16,backgroundColor:'#b9763a'}}/>
        <View style={{position:'absolute',top:6,left:10,width:14,height:14,borderRadius:7,backgroundColor:'#b9763a'}}/>
        <View style={{position:'absolute',top:6,right:14,width:14,height:14,borderRadius:7,backgroundColor:'#b9763a'}}/>
        <View style={{position:'absolute',top:20,width:20,height:14,borderRadius:8,backgroundColor:'#f0cfa0'}}/></View></View>
    <Animated.View style={{position:'absolute',right:2,top:'30%',width:50,height:80,transform:[{rotate:plantR2}]}}>
      <Leaf l={6} b={8} w={14} h={30} r={-20}/><Leaf l={22} b={20} w={14} h={32} r={18} c="#4f9f34"/><Leaf l={10} b={42} w={14} h={30} r={-10}/></Animated.View>
    <View style={{position:'absolute',left:0,right:0,bottom:0,height:'31%',backgroundColor:'#e9b575'}}>
      {[18,46,78,112,150].map((t,i)=><View key={i} style={{position:'absolute',left:0,right:0,top:t,height:1.5,backgroundColor:'rgba(150,90,40,0.18)'}}/>)}
      <View style={{position:'absolute',left:'4%',top:'12%',width:'92%',height:140,borderRadius:80,backgroundColor:'#f6e8cc',borderWidth:10,borderColor:'rgba(143,190,235,0.55)'}}/></View>
    <View style={{position:'absolute',left:0,right:0,bottom:'31%',height:14,backgroundColor:'#e8b8b0'}}/>
    <View style={{position:'absolute',left:-6,bottom:'27%'}}>
      <View style={{width:84,height:16,borderRadius:3,backgroundColor:'#3f9ad6',marginBottom:1}}/>
      <View style={{width:92,height:16,borderRadius:3,backgroundColor:'#e86fae',marginBottom:1,marginLeft:-4}}/>
      <View style={{width:88,height:16,borderRadius:3,backgroundColor:'#f2c14e',marginBottom:1}}/>
      <View style={{width:80,height:14,borderRadius:3,backgroundColor:'#4b7fc4'}}/></View>
    <View style={{position:'absolute',left:6,bottom:'25%',width:54,height:24,borderRadius:10,backgroundColor:'#3aa0e0'}}>
      <View style={{position:'absolute',left:14,top:-10,width:24,height:14,borderTopLeftRadius:8,borderTopRightRadius:8,backgroundColor:'#7cc7f0'}}/>
      <View style={{position:'absolute',left:6,bottom:-6,width:12,height:12,borderRadius:6,backgroundColor:'#2d4a6b'}}/>
      <View style={{position:'absolute',right:6,bottom:-6,width:12,height:12,borderRadius:6,backgroundColor:'#2d4a6b'}}/></View>
    <View style={{position:'absolute',right:6,bottom:'24%',width:44,height:58,borderRadius:6,backgroundColor:'#f5c63a',borderWidth:2,borderColor:'#e0a81f'}}/>
    <View style={{position:'absolute',right:22,bottom:'24%',marginBottom:54,width:6,height:46,backgroundColor:'#e86f6f',transform:[{rotate:'-10deg'}]}}/>
    <View style={{position:'absolute',right:14,bottom:'24%',marginBottom:54,width:6,height:50,backgroundColor:'#3f7fc4',transform:[{rotate:'-22deg'}]}}/>
    <View style={{position:'absolute',right:30,bottom:'24%',marginBottom:54,width:6,height:44,backgroundColor:'#5fae3a',transform:[{rotate:'8deg'}]}}/>
    <Animated.View style={{position:'absolute',left:-34,bottom:-26,width:150,height:210,transform:[{rotate:plantR}]}}>
      <Leaf l={6} b={0} w={60} h={170} r={-14} c="#6bbb3f"/><Leaf l={44} b={0} w={56} h={150} r={18} c="#4f9f34"/><Leaf l={24} b={0} w={50} h={190} r={2} c="#7cc94a"/></Animated.View>
    {[[40,5,9000,0],[110,4,11000,2500],[180,6,10000,1200],[240,4,12000,4000],[300,5,9500,800],[75,3,13000,6000],[210,3,8500,3200]].map((m,i)=><Mote key={i} left={m[0]} size={m[1]} ms={m[2]} delay={m[3]}/>)}
  </View>}

/* ---------- giraffe (cute, matches the picture) ---------- */
export const Giraffe=({w=100}:any)=>
  <Svg width={w} height={w*1.5} viewBox="0 0 100 150">
    <Ellipse cx="50" cy="144" rx="34" ry="5" fill="rgba(0,0,0,0.15)"/>
    <Path d="M24 112 Q10 112 12 124 Q18 122 24 124Z" fill="#8a4b1f"/>
    <Rect x="24" y="100" width="10" height="42" rx="4" fill="#f5b23c"/>
    <Rect x="38" y="100" width="10" height="42" rx="4" fill="#f0a52c"/>
    <Rect x="58" y="100" width="10" height="42" rx="4" fill="#f5b23c"/>
    <Rect x="24" y="134" width="10" height="8" rx="3" fill="#8a4b1f"/>
    <Rect x="38" y="134" width="10" height="8" rx="3" fill="#8a4b1f"/>
    <Rect x="58" y="134" width="10" height="8" rx="3" fill="#8a4b1f"/>
    <Path d="M30 58 Q36 22 52 26 L58 62 Q74 76 72 106 L24 106 Q20 80 30 58Z" fill="#f5b23c"/>
    <Ellipse cx="60" cy="24" rx="23" ry="17" fill="#f5b23c"/>
    <Ellipse cx="72" cy="31" rx="13" ry="9" fill="#fbd98a"/>
    <Path d="M46 14 L36 8 L44 22Z" fill="#f4a3a8"/>
    <Circle cx="58" cy="19" r="2.6" fill="#3b2410"/>
    <Circle cx="68" cy="30" r="1.3" fill="#3b2410"/><Circle cx="75" cy="30" r="1.3" fill="#3b2410"/>
    <Rect x="48" y="2" width="3" height="10" fill="#c9852f"/><Circle cx="49.5" cy="3" r="3.5" fill="#8a4b1f"/>
    <Rect x="62" y="1" width="3" height="10" fill="#c9852f"/><Circle cx="63.5" cy="2" r="3.5" fill="#8a4b1f"/>
    {[[40,72],[56,86],[38,96],[60,66],[46,50],[50,102]].map(([x,y],i)=><Circle key={i} cx={x} cy={y} r="5.5" fill="#a65a23"/>)}
  </Svg>;

/* ---------- fridge: body (inside) + animated door ---------- */
export const FRIDGE_W=130, FRIDGE_H=220;

export const Fridge=({door,children}:{door:Animated.Value,children?:any})=>{
  const W=FRIDGE_W,H=FRIDGE_H;
  const tx=door.interpolate({inputRange:[0,1],outputRange:[0,-W*0.4]});
  const sx=door.interpolate({inputRange:[0,1],outputRange:[1,0.2]});
  return <View style={{width:W,height:H}}>
    <Svg width={W} height={H} viewBox="0 0 130 220" style={{position:'absolute'}}>
      <Rect x="2" y="2" width="126" height="216" rx="12" fill="#2a8f80" stroke="#14403a" strokeWidth="4"/>
      <Rect x="12" y="12" width="106" height="196" rx="6" fill="#e8f4f1"/>
      <Line x1="12" y1="78" x2="118" y2="78" stroke="#b8d8d1" strokeWidth="4"/>
      <Line x1="12" y1="146" x2="118" y2="146" stroke="#b8d8d1" strokeWidth="4"/>
    </Svg>
    {children}
    <Animated.View pointerEvents="none" style={{position:'absolute',left:0,top:0,width:W,height:H,transform:[{translateX:tx},{scaleX:sx}]}}>
      <Svg width={W} height={H} viewBox="0 0 130 220">
        <Rect x="2" y="2" width="126" height="216" rx="12" fill="#3dbfa9" stroke="#14403a" strokeWidth="4"/>
        <Path d="M10 12 H120" stroke="#7fe0cf" strokeWidth="4" strokeLinecap="round"/>
        <Rect x="106" y="84" width="9" height="56" rx="4.5" fill="#e8efee" stroke="#14403a" strokeWidth="2"/>
      </Svg>
    </Animated.View>
  </View>};
