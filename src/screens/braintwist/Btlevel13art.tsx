// import React,{useEffect,useRef} from 'react';
// import {View,Animated,Easing} from 'react-native';
// import Svg,{Rect,Path,Circle,Ellipse,Polygon,Line} from 'react-native-svg';

// const K='#2b2b2b';
// const sw={stroke:K,strokeWidth:1.6,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};

// /* ---------- flickering flame ---------- */
// export const Flame=({w=24,delay=0}:any)=>{
//   const f=useRef(new Animated.Value(0)).current;
//   useEffect(()=>{
//     const a=Animated.loop(Animated.sequence([
//       Animated.timing(f,{toValue:1,duration:260,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
//       Animated.timing(f,{toValue:0,duration:260,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
//     const t=setTimeout(()=>a.start(),delay);
//     return()=>{clearTimeout(t);a.stop()}},[]);
//   return <Animated.View pointerEvents="none" style={{width:w,height:w*32/24,
//     transform:[{scaleY:f.interpolate({inputRange:[0,1],outputRange:[0.9,1.12]})},{scaleX:f.interpolate({inputRange:[0,1],outputRange:[1.05,0.92]})}]}}>
//     <Svg width={w} height={w*32/24} viewBox="0 0 24 32">
//       <Path d="M12 1 C16 8 22 12 22 20 A10 10 0 0 1 2 20 C2 14 6 11 8 6 C9 9 10 10 11 10 C11 7 11 4 12 1Z" fill="#ff8a1f" stroke="#e5531a" strokeWidth="1"/>
//       <Path d="M12 14 C15 18 17 20 17 23 A5 5 0 0 1 7 23 C7 20 10 18 12 14Z" fill="#ffd23f"/>
//     </Svg></Animated.View>};

// /* ---------- torch (draggable by the screen) ---------- */
// export const Torch=()=><View style={{width:44,height:120}}>
//   <View style={{position:'absolute',left:10,top:0}}><Flame w={24}/></View>
//   <Svg width={44} height={120} viewBox="0 0 44 120" style={{position:'absolute',left:0,top:0}}>
//     <Path d="M10 26 H34 L29 46 H15 Z" fill="#5a5a5e" {...sw}/>
//     <Path d="M18 46 H26 L28 116 H16 Z" fill="#9b9ba1" {...sw}/>
//     <Path d="M18 46 H22 L22 116 H16 Z" fill="#b9b9bf"/>
//   </Svg></View>;

// /* ---------- cat sitting on the shelf (replaces the teddy bear) ---------- */
// export const Cat=({w=52}:any)=><Svg width={w} height={w*70/60} viewBox="0 0 60 70">
//   <Path d="M44 62 C58 62 58 44 50 40" fill="none" stroke="#e8964a" strokeWidth="6" strokeLinecap="round"/>
//   <Ellipse cx="30" cy="50" rx="16" ry="18" fill="#f2a65a" {...sw}/>
//   <Ellipse cx="30" cy="55" rx="9" ry="11" fill="#ffe0b8"/>
//   <Ellipse cx="21" cy="66" rx="6" ry="3.5" fill="#f2a65a" {...sw}/>
//   <Ellipse cx="39" cy="66" rx="6" ry="3.5" fill="#f2a65a" {...sw}/>
//   <Polygon points="14,17 16,1 29,11" fill="#f2a65a" {...sw}/>
//   <Polygon points="46,17 44,1 31,11" fill="#f2a65a" {...sw}/>
//   <Polygon points="18,12 17.5,5 24,10" fill="#ffb6b6"/>
//   <Polygon points="42,12 42.5,5 36,10" fill="#ffb6b6"/>
//   <Circle cx="30" cy="27" r="17" fill="#f2a65a" {...sw}/>
//   <Path d="M26 11 V17 M30 10 V16 M34 11 V17" stroke="#d9812f" strokeWidth="2" strokeLinecap="round"/>
//   <Circle cx="24" cy="27" r="2.6" fill={K}/><Circle cx="36" cy="27" r="2.6" fill={K}/>
//   <Circle cx="23.2" cy="26" r="0.9" fill="#fff"/><Circle cx="35.2" cy="26" r="0.9" fill="#fff"/>
//   <Polygon points="28,32 32,32 30,35" fill="#e0608a"/>
//   <Path d="M30 35 q-3 4 -6 1 M30 35 q3 4 6 1" fill="none" stroke={K} strokeWidth="1.2" strokeLinecap="round"/>
//   <Path d="M19 33 h-8 M19 36 h-7 M41 33 h8 M41 36 h7" stroke={K} strokeWidth="1" strokeLinecap="round"/>
// </Svg>;

// /* ---------- scene pieces (burned = charred colours) ---------- */
// const pick=(burned:boolean,a:string,b:string)=>burned?b:a;

// export const Shelf=({w=180,burned}:any)=><Svg width={w} height={w*40/180} viewBox="0 0 180 40">
//   <Rect x="4" y="4" width="172" height="10" rx="3" fill={pick(burned,'#fff','#3a3a3a')} {...sw}/>
//   <Path d="M30 14 V34 M150 14 V34" stroke={K} strokeWidth="3" strokeLinecap="round"/>
// </Svg>;

// export const Sofa=({w=250,burned}:any)=><Svg width={w} height={w*140/250} viewBox="0 0 250 140">
//   {/* back */}
//   <Rect x="20" y="2" width="102" height="62" rx="10" fill={pick(burned,'#fff','#4a4a4a')} {...sw}/>
//   <Rect x="128" y="2" width="102" height="62" rx="10" fill={pick(burned,'#fff','#4a4a4a')} {...sw}/>
//   {/* frame */}
//   <Rect x="2" y="52" width="246" height="58" rx="8" fill={pick(burned,'#f2b83a','#3b3326')} {...sw}/>
//   {/* seat cushions */}
//   <Rect x="14" y="56" width="112" height="34" rx="8" fill={pick(burned,'#fff','#575757')} {...sw}/>
//   <Rect x="124" y="56" width="112" height="34" rx="8" fill={pick(burned,'#fff','#575757')} {...sw}/>
//   {/* legs */}
//   <Rect x="14" y="108" width="10" height="26" rx="3" fill={K}/>
//   <Rect x="226" y="108" width="10" height="26" rx="3" fill={K}/>
// </Svg>;

// export const Pillow=({w=60,burned}:any)=><Svg width={w} height={w*52/60} viewBox="0 0 60 52">
//   <Path d="M6 8 Q30 0 54 6 Q58 26 52 46 Q30 52 8 46 Q2 26 6 8Z" fill={pick(burned,'#2f6fd1','#2a2a2a')} {...sw}/>
//   <Path d="M14 14 Q30 9 46 13" fill="none" stroke={pick(burned,'#6fa0ec','#555')} strokeWidth="2.4" strokeLinecap="round"/>
// </Svg>;

// export const Clothes=({w=90,burned}:any)=><Svg width={w} height={w*60/90} viewBox="0 0 90 60">
//   <Rect x="6" y="38" width="78" height="18" rx="8" fill={pick(burned,'#b9d0d3','#3b3b3b')} {...sw}/>
//   <Rect x="12" y="22" width="68" height="18" rx="8" fill={pick(burned,'#6a1f1f','#262626')} {...sw}/>
//   <Path d="M20 20 Q46 0 74 18 Q62 26 20 24Z" fill={pick(burned,'#e6c986','#4a4a4a')} {...sw}/>
// </Svg>;
import React,{useEffect,useRef} from 'react';
import {View,Animated,Easing} from 'react-native';
import Svg,{Rect,Path,Circle,Ellipse,Polygon,Line} from 'react-native-svg';

const K='#2b2b2b';
const sw={stroke:K,strokeWidth:1.6,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};

/* ---------- flickering flame ---------- */
export const Flame=({w=24,delay=0}:any)=>{
  const f=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    const a=Animated.loop(Animated.sequence([
      Animated.timing(f,{toValue:1,duration:260,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
      Animated.timing(f,{toValue:0,duration:260,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
    const t=setTimeout(()=>a.start(),delay);
    return()=>{clearTimeout(t);a.stop()}},[]);
  return <Animated.View pointerEvents="none" style={{width:w,height:w*32/24,
    transform:[{scaleY:f.interpolate({inputRange:[0,1],outputRange:[0.9,1.12]})},{scaleX:f.interpolate({inputRange:[0,1],outputRange:[1.05,0.92]})}]}}>
    <Svg width={w} height={w*32/24} viewBox="0 0 24 32">
      <Path d="M12 1 C16 8 22 12 22 20 A10 10 0 0 1 2 20 C2 14 6 11 8 6 C9 9 10 10 11 10 C11 7 11 4 12 1Z" fill="#ff8a1f" stroke="#e5531a" strokeWidth="1"/>
      <Path d="M12 14 C15 18 17 20 17 23 A5 5 0 0 1 7 23 C7 20 10 18 12 14Z" fill="#ffd23f"/>
    </Svg></Animated.View>};

/* ---------- torch (draggable by the screen) ---------- */
export const Torch=()=><View style={{width:44,height:120}}>
  <View style={{position:'absolute',left:10,top:0}}><Flame w={24}/></View>
  <Svg width={44} height={120} viewBox="0 0 44 120" style={{position:'absolute',left:0,top:0}}>
    <Path d="M10 26 H34 L29 46 H15 Z" fill="#5a5a5e" {...sw}/>
    <Path d="M18 46 H26 L28 116 H16 Z" fill="#9b9ba1" {...sw}/>
    <Path d="M18 46 H22 L22 116 H16 Z" fill="#b9b9bf"/>
  </Svg></View>;

/* ---------- cat sitting on the shelf (burned = charred colours) ---------- */
export const Cat=({w=52,burned}:any)=>{
  const o=burned?'#3a2e28':'#f2a65a';
  const o2=burned?'#2f2520':'#e8964a';
  const belly=burned?'#4a3d36':'#ffe0b8';
  const ear=burned?'#5a4a42':'#ffb6b6';
  const stripe=burned?'#241c18':'#d9812f';
  return <Svg width={w} height={w*70/60} viewBox="0 0 60 70">
    <Path d="M44 62 C58 62 58 44 50 40" fill="none" stroke={o2} strokeWidth="6" strokeLinecap="round"/>
    <Ellipse cx="30" cy="50" rx="16" ry="18" fill={o} {...sw}/>
    <Ellipse cx="30" cy="55" rx="9" ry="11" fill={belly}/>
    <Ellipse cx="21" cy="66" rx="6" ry="3.5" fill={o} {...sw}/>
    <Ellipse cx="39" cy="66" rx="6" ry="3.5" fill={o} {...sw}/>
    <Polygon points="14,17 16,1 29,11" fill={o} {...sw}/>
    <Polygon points="46,17 44,1 31,11" fill={o} {...sw}/>
    <Polygon points="18,12 17.5,5 24,10" fill={ear}/>
    <Polygon points="42,12 42.5,5 36,10" fill={ear}/>
    <Circle cx="30" cy="27" r="17" fill={o} {...sw}/>
    <Path d="M26 11 V17 M30 10 V16 M34 11 V17" stroke={stripe} strokeWidth="2" strokeLinecap="round"/>
    <Circle cx="24" cy="27" r="2.6" fill={K}/><Circle cx="36" cy="27" r="2.6" fill={K}/>
    <Circle cx="23.2" cy="26" r="0.9" fill="#fff"/><Circle cx="35.2" cy="26" r="0.9" fill="#fff"/>
    <Polygon points="28,32 32,32 30,35" fill="#e0608a"/>
    <Path d="M30 35 q-3 4 -6 1 M30 35 q3 4 6 1" fill="none" stroke={K} strokeWidth="1.2" strokeLinecap="round"/>
    <Path d="M19 33 h-8 M19 36 h-7 M41 33 h8 M41 36 h7" stroke={K} strokeWidth="1" strokeLinecap="round"/>
  </Svg>;
};

/* ---------- scene pieces (burned = charred colours) ---------- */
const pick=(burned:boolean,a:string,b:string)=>burned?b:a;

export const Shelf=({w=180,burned}:any)=><Svg width={w} height={w*40/180} viewBox="0 0 180 40">
  <Rect x="4" y="4" width="172" height="10" rx="3" fill={pick(burned,'#fff','#3a3a3a')} {...sw}/>
  <Path d="M30 14 V34 M150 14 V34" stroke={K} strokeWidth="3" strokeLinecap="round"/>
</Svg>;

export const Sofa=({w=250,burned}:any)=><Svg width={w} height={w*140/250} viewBox="0 0 250 140">
  <Rect x="20" y="2" width="102" height="62" rx="10" fill={pick(burned,'#fff','#4a4a4a')} {...sw}/>
  <Rect x="128" y="2" width="102" height="62" rx="10" fill={pick(burned,'#fff','#4a4a4a')} {...sw}/>
  <Rect x="2" y="52" width="246" height="58" rx="8" fill={pick(burned,'#f2b83a','#3b3326')} {...sw}/>
  <Rect x="14" y="56" width="112" height="34" rx="8" fill={pick(burned,'#fff','#575757')} {...sw}/>
  <Rect x="124" y="56" width="112" height="34" rx="8" fill={pick(burned,'#fff','#575757')} {...sw}/>
  <Rect x="14" y="108" width="10" height="26" rx="3" fill={K}/>
  <Rect x="226" y="108" width="10" height="26" rx="3" fill={K}/>
</Svg>;

export const Pillow=({w=60,burned}:any)=><Svg width={w} height={w*52/60} viewBox="0 0 60 52">
  <Path d="M6 8 Q30 0 54 6 Q58 26 52 46 Q30 52 8 46 Q2 26 6 8Z" fill={pick(burned,'#2f6fd1','#2a2a2a')} {...sw}/>
  <Path d="M14 14 Q30 9 46 13" fill="none" stroke={pick(burned,'#6fa0ec','#555')} strokeWidth="2.4" strokeLinecap="round"/>
</Svg>;

export const Clothes=({w=90,burned}:any)=><Svg width={w} height={w*60/90} viewBox="0 0 90 60">
  <Rect x="6" y="38" width="78" height="18" rx="8" fill={pick(burned,'#b9d0d3','#3b3b3b')} {...sw}/>
  <Rect x="12" y="22" width="68" height="18" rx="8" fill={pick(burned,'#6a1f1f','#262626')} {...sw}/>
  <Path d="M20 20 Q46 0 74 18 Q62 26 20 24Z" fill={pick(burned,'#e6c986','#4a4a4a')} {...sw}/>
</Svg>;