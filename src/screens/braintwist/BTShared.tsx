import React,{useEffect,useRef} from 'react';
import {View,Animated,Easing,StyleSheet,Platform,useWindowDimensions} from 'react-native';
import Svg,{Circle,Path} from 'react-native-svg';

export const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
export const INK='#1b1b1b';
export const MAXW=480;

// stage width (web la romba wide aagama 480 la cap aagum)
export const useStageW=()=>{const{width}=useWindowDimensions();return Math.min(width,MAXW)};

// every screen is wrapped in this: centered, max 480 wide, same look on web + mobile
export function Stage({bg,children}:any){
  return <View style={{flex:1,backgroundColor:bg,alignItems:'center'}}>
    <View style={{flex:1,width:'100%',maxWidth:MAXW,overflow:'hidden'}}>{children}</View></View>}

// 0 -> 1 -> 0 loop
export const loop=(v:Animated.Value,d:number)=>Animated.loop(Animated.sequence([
  Animated.timing(v,{toValue:1,duration:d,easing:Easing.inOut(Easing.quad),useNativeDriver:true}),
  Animated.timing(v,{toValue:0,duration:d,easing:Easing.inOut(Easing.quad),useNativeDriver:true})])).start();

export const Coin=({s=18}:any)=><View style={{width:s,height:s,borderRadius:s/2,backgroundColor:'#f5c518',borderWidth:2,borderColor:'#c9970c'}}/>;

export const Smiley=({w,c=INK}:any)=><Svg width={w} height={w} viewBox="0 0 40 40">
  <Circle cx="14" cy="15" r="2" fill={c}/><Circle cx="26" cy="15" r="2" fill={c}/>
  <Path d="M10 24 Q20 34 30 24" stroke={c} strokeWidth="2.6" fill="none" strokeLinecap="round"/></Svg>;

const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
export function Confetti(){
  const{width,height}=useWindowDimensions(),sw=Math.min(width,MAXW),end=height+40;
  const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(sw-40),c:COL[i%5],d:2000+Math.random()*1800,r:Math.random()*360}))).current;
  useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:end,duration:o.d,useNativeDriver:true}).start())},[]);
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=>
    <Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,
      transform:[{translateY:o.y},{rotate:o.y.interpolate({inputRange:[-30,end],outputRange:[o.r+'deg',(o.r+720)+'deg']})}]}}/>)}</View>}