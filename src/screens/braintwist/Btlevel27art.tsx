import React from 'react';
import {View,Text,Platform} from 'react-native';
import Svg,{Rect,Path} from 'react-native-svg';

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

/* green school board with a dark frame (like the Level 27 design) */
export const Chalkboard=({w,h,children}:{w:number;h:number;children?:any})=>{
  const r=Math.round(h*0.12),b=Math.max(5,Math.round(h*0.025));
  return <View style={{width:w,height:h}}>
    <Svg width={w} height={h} style={{position:'absolute'}}>
      {/* frame */}
      <Rect x={0} y={0} width={w} height={h} rx={r+4} fill="#3b2a1d"/>
      {/* board */}
      <Rect x={b} y={b} width={w-b*2} height={h-b*2} rx={r} fill="#37a057"/>
      {/* soft light at the top and shade at the bottom */}
      <Path d={`M${b+r} ${b+2} H${w-b-r} Q${w-b-2} ${b+2} ${w-b-2} ${b+r}`} stroke="#a7d96b" strokeWidth={4} fill="none" strokeLinecap="round"/>
      <Rect x={b+4} y={h-b-14} width={w-b*2-8} height={8} rx={4} fill="rgba(0,0,0,0.12)"/>
    </Svg>
    <View style={{position:'absolute',left:0,top:0,width:w,height:h,justifyContent:'center'}}>{children}</View>
  </View>;
};

/* one chalk number (or the ? mark) */
export const ChalkDigit=({t,size,color='#ffffff'}:{t:string|number;size:number;color?:string})=>(
  <Text style={{fontFamily:FONT,fontSize:size,fontWeight:'800',color,textAlign:'center',includeFontPadding:false,
    textShadowColor:'rgba(255,255,255,0.35)',textShadowRadius:2,textShadowOffset:{width:0,height:0}}}>{t}</Text>
);
