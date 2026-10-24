
import React from 'react';
import Svg,{Circle,Ellipse,Rect,Path,G,Line,Polygon,Defs,ClipPath,Text as SvgText} from 'react-native-svg';
const K='#2b2b2b';
const sw={stroke:K,strokeWidth:1.4,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
const V=({w,h,vb='0 0 100 100',children}:any)=><Svg width={w} height={h||w} viewBox={vb}>{children}</Svg>;
export const Lion=({w}:any)=><V w={w}><Ellipse cx="68" cy="82" rx="26" ry="15" fill="#ffc890" {...sw}/><Path d="M92 82 q6 -14 -2 -24" fill="none" {...sw}/><Circle cx="45" cy="42" r="38" fill="#ffa733" stroke="#f08a1c" strokeWidth="2"/><Circle cx="45" cy="44" r="25" fill="#ffd9b0" {...sw}/><Circle cx="28" cy="26" r="6" fill="#ffd9b0" {...sw}/><Circle cx="62" cy="26" r="6" fill="#ffd9b0" {...sw}/><Circle cx="37" cy="42" r="2" fill={K}/><Circle cx="53" cy="42" r="2" fill={K}/><Path d="M42 50 h6 l-3 4z" fill="#d94a6a"/><Path d="M45 54 q-5 6 -9 1 M45 54 q5 6 9 1" fill="none" {...sw}/></V>;
export const Elephant=({w}:any)=><V w={w}><Ellipse cx="50" cy="94" rx="36" ry="4" fill="#0000001a"/><Rect x="38" y="72" width="9" height="20" rx="3" fill="#7ba7cc" {...sw}/><Rect x="66" y="72" width="9" height="20" rx="3" fill="#7ba7cc" {...sw}/><Ellipse cx="58" cy="62" rx="32" ry="22" fill="#7ba7cc" {...sw}/><Circle cx="32" cy="50" r="17" fill="#7ba7cc" {...sw}/><Circle cx="44" cy="48" r="12" fill="#a8c6e0" stroke="#4d7fae" strokeWidth="2"/><Circle cx="27" cy="47" r="1.8" fill={K}/><Path d="M18 56 q-8 14 4 18" fill="none" stroke="#4d7fae" strokeWidth="5" strokeLinecap="round"/></V>;
export const Mouse=({w}:any)=><V w={w}><Path d="M30 66 Q8 70 12 52" stroke="#999" strokeWidth="2" fill="none"/><Ellipse cx="50" cy="66" rx="19" ry="13" fill="#bdbdbd" {...sw}/><Circle cx="72" cy="60" r="9" fill="#bdbdbd" {...sw}/><Circle cx="66" cy="50" r="5" fill="#f4b6b6" {...sw}/><Circle cx="77" cy="50" r="5" fill="#f4b6b6" {...sw}/><Circle cx="75" cy="59" r="1.4" fill={K}/><Polygon points="84,84 98,88 84,92" fill="#ffd84d" {...sw}/></V>;
export const Zebra=({w}:any)=><V w={w}><Ellipse cx="50" cy="96" rx="36" ry="3" fill="#0000001a"/>{[28,40,58,70].map(x=><Rect key={x} x={x} y="62" width="7" height="32" fill="#fff" {...sw}/>)}<Rect x="22" y="38" width="56" height="34" rx="14" fill="#fff" {...sw}/>{[32,42,52,62,72].map(x=><Line key={x} x1={x} y1="40" x2={x-4} y2="70" stroke={K} strokeWidth="3"/>)}<Path d="M70 44 L84 14 L96 24 L88 44z" fill="#fff" {...sw}/><Path d="M72 36 L82 12" stroke={K} strokeWidth="4"/><Circle cx="90" cy="26" r="1.6" fill={K}/></V>;
export const Sloth=({w}:any)=><V w={w}><Path d="M0 22 Q50 8 100 14" stroke="#8a5a3a" strokeWidth="6" fill="none" strokeLinecap="round"/><Circle cx="14" cy="14" r="5" fill="#6fbf5a"/><Circle cx="88" cy="8" r="5" fill="#6fbf5a"/><Path d="M40 20 L44 46 M60 18 L56 46" stroke="#a67856" strokeWidth="6" strokeLinecap="round"/><Ellipse cx="50" cy="56" rx="17" ry="22" fill="#a67856" {...sw}/><Circle cx="50" cy="66" r="13" fill="#f2d3b0" {...sw}/><Circle cx="45" cy="64" r="1.8" fill={K}/><Circle cx="55" cy="64" r="1.8" fill={K}/><Path d="M46 71 q4 3 8 0" fill="none" {...sw}/><Path d="M42 78 l16 0 l-4 8z" fill="#e0504a"/></V>;
export const Cloud=({w,grey}:any)=><V w={w}><Path d="M14 70 a16 16 0 0 1 10 -28 a24 24 0 0 1 46 -6 a18 18 0 0 1 18 34 z" fill={grey?'#c8c8cc':'#8ecdf0'} {...sw} strokeWidth="2.4"/></V>;
export const Flower=({w,bloom}:any)=><V w={w}><Path d="M50 74 V36" stroke="#3a8f3a" strokeWidth="2.5"/><Ellipse cx="40" cy="56" rx="9" ry="4.5" fill="#7ac95a" {...sw} transform="rotate(-25 40 56)"/><Ellipse cx="60" cy="48" rx="9" ry="4.5" fill="#7ac95a" {...sw} transform="rotate(25 60 48)"/>
{bloom?<G>{[0,72,144,216,288].map(a=><Ellipse key={a} cx="50" cy="20" rx="7" ry="11" fill="#ff6f91" {...sw} transform={`rotate(${a} 50 32)`}/>)}<Circle cx="50" cy="32" r="5" fill="#ffd84d"/></G>:<Ellipse cx="50" cy="32" rx="6" ry="9" fill="#e8344e" {...sw}/>}
<Path d="M32 74 H68 L63 98 H37 Z" fill="#4fa7c9" {...sw}/><Rect x="30" y="68" width="40" height="8" rx="2" fill="#4fa7c9" {...sw}/></V>;
export const Fridge=({w,open}:any)=><V w={w}><Polygon points="80,12 96,6 96,92 80,94" fill="#3aa795" {...sw}/><Rect x="8" y="12" width="72" height="82" fill={open?'#1f7a6c':'#41bfab'} {...sw}/>
{open?<G><Line x1="12" y1="40" x2="76" y2="40" stroke="#7fd6c8" strokeWidth="2"/><Line x1="12" y1="66" x2="76" y2="66" stroke="#7fd6c8" strokeWidth="2"/><Polygon points="8,12 0,20 0,86 8,94" fill="#33a392" {...sw}/></G>
:<G><Line x1="8" y1="44" x2="80" y2="44" stroke={K} strokeWidth="1.2"/><Rect x="70" y="26" width="3" height="12" rx="1.5" fill="#e8fff9" {...sw}/></G>}</V>;

/* ---------- level 4 to 7 drawings ---------- */

const CLOUD_D='M14 70 a16 16 0 0 1 10 -28 a24 24 0 0 1 46 -6 a18 18 0 0 1 18 34 z';
const SLICE='M50 95 L10 24 Q50 4 90 24 Z';
// crescent moon with a grey cloud in front and a tiny blue cloud
export const Moon=({w}:any)=><V w={w}><Path d="M60 10 A40 40 0 1 0 60 90 A62 62 0 0 1 60 10 Z" fill="#fff" {...sw} strokeWidth="1.8"/><G transform="translate(6 54) scale(0.48)"><Path d={CLOUD_D} fill="#c9c9cf" {...sw} strokeWidth="2.4"/></G><G transform="translate(58 8) scale(0.3)"><Path d={CLOUD_D} fill="#8ecdf0" {...sw} strokeWidth="3"/></G></V>;
// big blue cloud with a smaller light cloud behind it
export const CloudPair=({w}:any)=><V w={w} h={w*0.6} vb="0 0 100 60"><G transform="translate(-4 6) scale(0.62)"><Path d={CLOUD_D} fill="#b9dff3" {...sw} strokeWidth="2"/></G><G transform="translate(4 -14) scale(0.95)"><Path d={CLOUD_D} fill="#8ecdf0" {...sw} strokeWidth="2.4"/></G></V>;

export const Sun=({w}:any)=><V w={w}><Circle cx="50" cy="50" r="22" fill="#ffb42b" stroke="#e8890c" strokeWidth="2"/><Circle cx="44" cy="44" r="8" fill="#ffd36b" opacity="0.7"/><G stroke="#3a3a3a" strokeWidth="1.4" strokeLinecap="round">{Array.from({length:12},(_,k)=><Line key={k} x1="50" y1={k%2?12:14} x2="50" y2={k%2?20:22} transform={`rotate(${k*30} 50 50)`}/>)}</G></V>;

export const Pizza=({w}:any)=><V w={w}><Path d={SLICE} fill="#ffd35c" stroke="#f5a623" strokeWidth="5" strokeLinejoin="round"/><Path d={SLICE} fill="#ffd35c" {...sw}/><Path d="M17 30 Q50 12 83 30" fill="none" stroke="#e5533d" strokeWidth="5" strokeLinecap="round"/><Path d="M10 24 Q50 4 90 24" fill="none" stroke={K} strokeWidth="12" strokeLinecap="round"/><Path d="M10 24 Q50 4 90 24" fill="none" stroke="#e8b36a" strokeWidth="9" strokeLinecap="round"/><Path d="M14 21 Q50 3 86 21" fill="none" stroke="#f3cb8c" strokeWidth="2.5" strokeLinecap="round"/>{[[36,42],[64,43],[50,68]].map(([x,y],k)=><G key={k}><Circle cx={x} cy={y} r="6.5" fill="#c0492f" {...sw} strokeWidth="1.2"/><Circle cx={x-2} cy={y-1} r="1.1" fill="#8a2c1b"/><Circle cx={x+2} cy={y+2} r="1.1" fill="#8a2c1b"/></G>)}</V>;

const RACER_COLORS=['#e8344e','#3a8fe0','#ffb020','#3ccf2f'];
export const Racer=({w,i=0}:any)=>{const c=RACER_COLORS[i%4];return <V w={w} h={w*0.9}>
  <Circle cx="50" cy="16" r="13" fill="#fff" {...sw} strokeWidth="2"/>
  <SvgText x="50" y="22" fontSize="17" fontWeight="bold" textAnchor="middle" fill={K}>{i+1}</SvgText>
  <Path d="M28 62 L38 42 H64 L74 62 Z" fill={c} {...sw} strokeWidth="2"/>
  <Path d="M42 58 L47 46 H60 L66 58 Z" fill="#cfeefc" {...sw}/>
  <Rect x="8" y="58" width="84" height="24" rx="10" fill={c} {...sw} strokeWidth="2"/>
  <Line x1="14" y1="70" x2="86" y2="70" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
  <Circle cx="29" cy="84" r="10" fill={K}/><Circle cx="29" cy="84" r="4" fill="#ccc"/>
  <Circle cx="71" cy="84" r="10" fill={K}/><Circle cx="71" cy="84" r="4" fill="#ccc"/>
</V>};

export const Cookie=({w}:any)=><V w={w}><Circle cx="50" cy="50" r="40" fill="#e0aa6a" {...sw} strokeWidth="2"/>{[[34,36],[62,34],[68,58],[40,64],[52,48],[28,56]].map(([x,y],k)=><Circle key={k} cx={x} cy={y} r="5" fill="#6b3f1d"/>)}</V>;

export const Barrier=({w}:any)=><V w={w} h={w*50/280} vb="0 0 280 50">
  <Rect x="30" y="30" width="10" height="20" fill="#9a9a9a" {...sw}/>
  <Rect x="240" y="30" width="10" height="20" fill="#9a9a9a" {...sw}/>
  <Rect x="4" y="4" width="272" height="30" rx="6" fill="#ffd84d"/>
  {Array.from({length:11},(_,k)=><Polygon key={k} points={`${8+k*22},34 ${22+k*22},34 ${36+k*22},4 ${22+k*22},4`} fill={K}/>)}
  <Rect x="4" y="4" width="272" height="30" rx="6" fill="none" {...sw} strokeWidth="2.4"/>
</V>;

// barbed wire coil (level 7: replaces the barrier)
export const Wire=({w}:any)=>{
  const N=7,S=40,pts:number[][]=[];
  for(let k=0;k<=N*S;k++){const t=k/S*2*Math.PI;pts.push([20+(300/(2*Math.PI*N))*t-13*Math.sin(t),28+20*Math.cos(t)])}
  const d='M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');
  return <V w={w} h={w*56/340} vb="0 0 340 56">
    <Path d={d} fill="none" stroke={K} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    {pts.filter((_,k)=>k%10===5).map(([x,y],k)=><G key={k}>
      <Line x1={x-5} y1={y-5} x2={x+5} y2={y+5} stroke={K} strokeWidth="2"/>
      <Line x1={x-5} y1={y+5} x2={x+5} y2={y-5} stroke={K} strokeWidth="2"/></G>)}
  </V>};

export const Cat=({w,open}:any)=><V w={w}>
  <Ellipse cx="50" cy="96" rx="30" ry="4" fill="#0000001a"/>
  <Path d="M72 82 q22 -4 18 -26" fill="none" stroke="#f5a45d" strokeWidth="7" strokeLinecap="round"/>
  <Ellipse cx="50" cy="72" rx="26" ry="24" fill="#f5a45d" {...sw} strokeWidth="2"/>
  <Path d="M27 26 L29 6 L45 17 Z" fill="#f5a45d" {...sw} strokeWidth="2"/>
  <Path d="M73 26 L71 6 L55 17 Z" fill="#f5a45d" {...sw} strokeWidth="2"/>
  <Circle cx="50" cy="40" r="26" fill="#f5a45d" {...sw} strokeWidth="2"/>
  <Circle cx="40" cy="37" r="3.2" fill={K}/><Circle cx="60" cy="37" r="3.2" fill={K}/>
  <Path d="M47 45 h6 l-3 4z" fill="#d94a6a"/>
  {open?<Path d="M42 52 q8 14 16 0z" fill="#d94a6a" {...sw}/>:<Path d="M41 56 q9 -7 18 0" fill="none" {...sw}/>}
  <Path d="M24 44 h-12 M24 50 h-12 M76 44 h12 M76 50 h12" stroke={K} strokeWidth="1.2" strokeLinecap="round"/>
</V>;

/* ---------- unchanged ---------- */

export const Hand=({w}:any)=><V w={w}><Polygon points="34,66 70,66 80,100 28,100" fill="#f6cba7" {...sw}/><Rect x="30" y="34" width="44" height="38" rx="14" fill="#f6cba7" {...sw}/><Rect x="43" y="2" width="14" height="44" rx="7" fill="#f6cba7" {...sw}/><Ellipse cx="30" cy="54" rx="6" ry="11" fill="#f6cba7" {...sw}/></V>;
export const Drop=()=><Svg width={10} height={14} viewBox="0 0 10 14"><Path d="M5 0 C8 5 10 7 10 9 A5 5 0 0 1 0 9 C0 7 2 5 5 0z" fill="#5bb8ef"/></Svg>;
export const Claps=({w}:any)=><V w={w} h={w*0.5} vb="0 0 200 100">{[28,100,172].map((x,i)=><G key={x}>
  <Rect x={x-13} y="42" width="26" height="60" fill="#fff" {...sw}/>{[50,62,74,86].map(y=>i===1?<Circle key={y} cx={x} cy={y} r="2.5" fill={K}/>:<Line key={y} x1={x-13} y1={y} x2={x+13} y2={y} stroke={K} strokeWidth="1.5"/>)}
  <Ellipse cx={x} cy="30" rx="14" ry="22" fill="#fff" {...sw} transform={`rotate(${i===1?0:i===0?-12:12} ${x} 40)`}/></G>)}</V>;
const Lobes=({fill}:any)=><G><Path d="M50 8 C20 4 4 30 14 52 C6 74 26 94 50 90 C74 94 94 74 86 52 C96 30 80 4 50 8z" fill={fill} stroke={K} strokeWidth="2.5"/><Path d="M50 10 V90 M30 30 q10 6 0 14 M70 30 q-10 6 0 14 M28 62 q12 4 4 14 M72 62 q-12 4 -4 14" fill="none" stroke={K} strokeWidth="1.8"/></G>;
export const Brain=({w,p}:any)=><V w={w}><Defs><ClipPath id="cl"><Rect x="0" y="0" width={p} height="100"/></ClipPath></Defs><G opacity="0.3"><Lobes fill="#f4a6a6"/></G><G clipPath="url(#cl)"><Lobes fill="#e8777b"/></G></V>;
export const Icon=({n,s=20}:any)=>{const o={stroke:K,strokeWidth:2,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
  const m:any={
  home:<Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill={K}/>,
  gear:<G><Circle cx="12" cy="12" r="8" stroke={K} strokeWidth="4" strokeDasharray="3 3.3" fill="none"/><Circle cx="12" cy="12" r="5" fill="none" {...o} strokeWidth="2.6"/></G>,
  dots:<G><Circle cx="5" cy="12" r="2" fill={K}/><Circle cx="12" cy="12" r="2" fill={K}/><Circle cx="19" cy="12" r="2" fill={K}/></G>,
  search:<G><Circle cx="10" cy="10" r="6.5" fill="none" {...o} strokeWidth="2.6"/><Line x1="15" y1="15" x2="21" y2="21" {...o} strokeWidth="3"/></G>,
  gift:<G><Rect x="4" y="11" width="16" height="10" fill="#ffb347" {...o}/><Rect x="3" y="7" width="18" height="4" fill="#ffb347" {...o}/><Line x1="12" y1="7" x2="12" y2="21" {...o}/><Path d="M12 7 C8 1 4 5 8 7 M12 7 C16 1 20 5 16 7" fill="none" {...o}/></G>,
  film:<G><Rect x="4" y="5" width="16" height="14" fill="#b57af0" {...o}/><Polygon points="10,9 15,12 10,15" fill="#fff"/></G>,
  play:<Polygon points="8,5 19,12 8,19" fill={K} stroke={K} strokeWidth="2" strokeLinejoin="round"/>,
  bulb:<G><Circle cx="12" cy="10" r="6.5" fill="#ffe27a" {...o}/><Rect x="9.5" y="16.5" width="5" height="4" fill="#ffe27a" {...o}/></G>,
  check:<Path d="M3 13 L9 19 L21 5" fill="none" {...o} stroke="#3ccf2f" strokeWidth="4"/>,
  cross:<Path d="M5 5 L19 19 M19 5 L5 19" fill="none" {...o} stroke="#e5484d" strokeWidth="4"/>};
  return <Svg width={s} height={s} viewBox="0 0 24 24">{m[n]}</Svg>};
