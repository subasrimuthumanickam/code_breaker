import React from 'react';
import Svg,{Path,Circle,Rect,Polygon} from 'react-native-svg';

const K='#2b2b2b';

export const Tick=({s=46}:{s?:number})=>(
  <Svg width={s} height={s} viewBox="0 0 48 48"><Path d="M8 26 L19 37 L41 11" stroke="#5bd33a" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round"/></Svg>
);
export const Cross=({s=46}:{s?:number})=>(
  <Svg width={s} height={s} viewBox="0 0 48 48"><Circle cx={24} cy={24} r={21} fill="#e8403f" stroke={K} strokeWidth={2.5}/><Path d="M16 16 L32 32 M32 16 L16 32" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round"/></Svg>
);
export const BigStar=({s=44,on=true}:{s?:number;on?:boolean})=>(
  <Svg width={s} height={s} viewBox="0 0 50 50"><Polygon points="25,4 31,18 46,19 35,29 38,45 25,37 12,45 15,29 4,19 19,18" fill={on?'#ffd23f':'#d9d2b8'} stroke={K} strokeWidth={2.2} strokeLinejoin="round"/></Svg>
);
export const Duster=({w=84}:{w?:number})=>(
  <Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>
);
export const ChalkPiece=({w=78}:{w?:number})=>(
  <Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>
);

// a hand-drawn chalk blob used for every dot (slightly uneven so it looks drawn)
export const dotPath=(cx:number,cy:number,r:number)=>
  `M${cx-r} ${cy} C${cx-r} ${cy-r*1.05} ${cx+r*0.15} ${cy-r*1.1} ${cx+r} ${cy-r*0.1} C${cx+r*1.05} ${cy+r*0.9} ${cx-r*0.1} ${cy+r*1.05} ${cx-r} ${cy}Z`;
