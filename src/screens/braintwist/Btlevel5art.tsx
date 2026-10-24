
import React from 'react';
import Svg,{Path,Circle,Ellipse,G,Line,Polygon,Rect} from 'react-native-svg';

const K='#2b2b2b';
const ol={stroke:K,strokeWidth:2.4,strokeLinejoin:'round' as const,strokeLinecap:'round' as const};

/* cucumber: dark green, bumpy, thin */
export const Cucumber=({w=120}:{w?:number})=>(
  <Svg width={w} height={w*0.4} viewBox="0 0 120 48">
    <Path d="M10 24 C10 12 24 8 60 8 C96 8 112 12 112 24 C112 36 96 40 60 40 C24 40 10 36 10 24Z" fill="#2f8f35" {...ol}/>
    <Path d="M18 15 C40 11 80 11 104 15" stroke="#5cc15a" strokeWidth={3.2} fill="none" strokeLinecap="round"/>
    <Path d="M18 33 C40 37 80 37 104 33" stroke="#1d6a26" strokeWidth={3} fill="none" strokeLinecap="round"/>
    {[[30,22],[44,26],[58,21],[72,26],[86,22],[98,26],[38,18],[66,30],[92,31]].map(([x,y],i)=>
      <Circle key={i} cx={x} cy={y} r={1.8} fill="#9be28f"/>)}
    <Path d="M10 24 C4 24 2 21 3 18 C7 18 10 20 12 22Z" fill="#6b8e23" {...ol} strokeWidth={2}/>
  </Svg>
);

/* zucchini: lighter, speckled with pale stripes, flared cap - looks almost like a cucumber */
export const Zucchini=({w=120}:{w?:number})=>(
  <Svg width={w} height={w*0.4} viewBox="0 0 120 48">
    <Path d="M16 24 C16 11 28 7 62 7 C96 7 112 12 112 24 C112 36 96 41 62 41 C28 41 16 37 16 24Z" fill="#6fbf3f" {...ol}/>
    <Path d="M24 14 C46 10 84 10 104 14 M24 24 C48 21 84 21 106 24 M24 34 C46 38 84 38 104 34" stroke="#b6e07a" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.9}/>
    {[[40,17],[58,29],[76,18],[92,30],[50,25],[84,24]].map(([x,y],i)=>
      <Circle key={i} cx={x} cy={y} r={1.4} fill="#f1f7c4"/>)}
    <Path d="M16 24 C16 17 12 12 6 12 L3 24 L6 36 C12 36 16 31 16 24Z" fill="#3f7d2a" {...ol} strokeWidth={2}/>
    <Line x1={8} y1={18} x2={8} y2={30} stroke="#2a5a1b" strokeWidth={1.6} strokeLinecap="round"/>
  </Svg>
);

/* bitter gourd: green, warty ridges, pointed tip - the extra decoy that looks like a cucumber */
export const Gourd=({w=120}:{w?:number})=>(
  <Svg width={w} height={w*0.4} viewBox="0 0 120 48">
    <Path d="M8 24 C8 13 22 8 52 8 C84 8 104 16 118 24 C104 32 84 40 52 40 C22 40 8 35 8 24Z" fill="#3f9d3c" {...ol}/>
    <Path d="M16 24 C40 22 80 23 112 24" stroke="#256b27" strokeWidth={2.4} fill="none" strokeLinecap="round"/>
    <Path d="M20 14 C44 11 80 14 104 21 M20 34 C44 37 80 34 104 27" stroke="#6bc060" strokeWidth={2.6} fill="none" strokeLinecap="round"/>
    {[[24,18],[34,30],[44,17],[54,31],[64,18],[74,30],[84,19],[94,28],[40,24],[70,24],[56,24]].map(([x,y],i)=>
      <Ellipse key={i} cx={x} cy={y} rx={3.2} ry={2.2} fill="#2a7a2d" stroke="#1d5a20" strokeWidth={0.8}/>)}
    <Path d="M8 24 C3 24 2 20 3 17 C6 17 9 19 11 21Z" fill="#7a8f2a" {...ol} strokeWidth={2}/>
  </Svg>
);

export const Duster=({w=84}:{w?:number})=>(
  <Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>
);
export const ChalkPiece=({w=78}:{w?:number})=>(
  <Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>
);

export const Tomato=({w=70}:{w?:number})=>(
  <Svg width={w} height={w} viewBox="0 0 70 70">
    <Ellipse cx={35} cy={40} rx={28} ry={24} fill="#e0301e" {...ol}/>
    <Path d="M18 32 C20 24 26 20 32 20" stroke="#ff8a78" strokeWidth={3.4} fill="none" strokeLinecap="round"/>
    <Polygon points="35,16 40,24 49,20 44,28 52,33 41,32 35,40 29,32 18,33 26,28 21,20 30,24" fill="#3fa23a" {...ol} strokeWidth={2}/>
    <Path d="M35 16 C35 11 37 8 41 7" stroke="#3b7d2f" strokeWidth={3} fill="none" strokeLinecap="round"/>
  </Svg>
);

/* small helper icons for this screen */
export const Tick=({s=46}:{s?:number})=>(
  <Svg width={s} height={s} viewBox="0 0 48 48"><Circle cx={24} cy={24} r={21} fill="#2fc24a" stroke={K} strokeWidth={2.5}/><Path d="M13 25 L21 33 L36 16" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round"/></Svg>
);
export const Cross=({s=46}:{s?:number})=>(
  <Svg width={s} height={s} viewBox="0 0 48 48"><Circle cx={24} cy={24} r={21} fill="#e8403f" stroke={K} strokeWidth={2.5}/><Path d="M16 16 L32 32 M32 16 L16 32" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round"/></Svg>
);
export const BigStar=({s=44,on=true}:{s?:number;on?:boolean})=>(
  <Svg width={s} height={s} viewBox="0 0 50 50"><Polygon points="25,4 31,18 46,19 35,29 38,45 25,37 12,45 15,29 4,19 19,18" fill={on?'#ffd23f':'#d9d2b8'} stroke={K} strokeWidth={2.2} strokeLinejoin="round"/></Svg>
);
