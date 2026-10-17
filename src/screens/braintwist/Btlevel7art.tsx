// import React from 'react';
// import Svg,{Path,Circle,Ellipse,Rect,Line,G,Polygon,Text as SvgText} from 'react-native-svg';
// import {L7Scene} from './Btlevel7api';

// const CH='#f6f4ea';            // chalk
// const K='#2b2b2b';

// // the room is drawn in a 300 x 260 box. Hotspots use the same units.
// export const ROOM_W=300,ROOM_H=260;
// export const HOT:{[k:string]:{x:number;y:number;w:number;h:number}}={
//   lamp:   {x:30, y:98, w:48, h:62},
//   curtain:{x:14, y:20, w:86, h:90},
//   tv:     {x:206,y:50, w:80, h:76},
//   teddy:  {x:222,y:156,w:44, h:48},
//   clock:  {x:126,y:10, w:48, h:48},
//   baby:   {x:98, y:112,w:112,h:96},      // the crib = where things are dropped
// };

// const ch={stroke:CH,strokeWidth:2.4,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,fill:'none'};

// /* ---------------- the baby (face changes with the mood) ---------------- */

// const Baby=({mood}:{mood:L7Scene['baby']})=>{
//   const cx=154,cy=150;
//   return <G>
//     {/* body */}
//     <Ellipse cx={cx} cy={cy+34} rx={22} ry={20} fill="#ffd8b0" stroke={CH} strokeWidth={2.2}/>
//     {/* head */}
//     <Circle cx={cx} cy={cy} r={19} fill="#ffe3c2" stroke={CH} strokeWidth={2.4}/>
//     <Path d={`M${cx-6} ${cy-18} Q${cx} ${cy-26} ${cx+6} ${cy-18}`} stroke="#c98a4b" strokeWidth={3} fill="none" strokeLinecap="round"/>
//     {mood==='crying'&&<G>
//       <Path d={`M${cx-11} ${cy-4} Q${cx-7} ${cy-8} ${cx-3} ${cy-4}`} stroke={K} strokeWidth={2.2} fill="none" strokeLinecap="round"/>
//       <Path d={`M${cx+3} ${cy-4} Q${cx+7} ${cy-8} ${cx+11} ${cy-4}`} stroke={K} strokeWidth={2.2} fill="none" strokeLinecap="round"/>
//       <Ellipse cx={cx} cy={cy+9} rx={6} ry={5} fill="#c0304f" stroke={K} strokeWidth={1.6}/>
//       <Path d={`M${cx-9} ${cy-1} q-2 8 0 12 q2 -4 0 -12Z`} fill="#7fd3ff"/>
//       <Path d={`M${cx+9} ${cy-1} q2 8 0 12 q-2 -4 0 -12Z`} fill="#7fd3ff"/>
//     </G>}
//     {mood==='hungry'&&<G>
//       <Circle cx={cx-6} cy={cy-3} r={2.6} fill={K}/><Circle cx={cx+6} cy={cy-3} r={2.6} fill={K}/>
//       <Ellipse cx={cx} cy={cy+8} rx={5} ry={4} fill="#c0304f" stroke={K} strokeWidth={1.4}/>
//       <Rect x={cx+20} y={cy-34} width={44} height={20} rx={10} fill={CH} stroke={K} strokeWidth={1.4}/>
//       <SvgText x={cx+42} y={cy-20} fontSize={11} fontWeight="bold" fill={K} textAnchor="middle">milk?</SvgText>
//     </G>}
//     {mood==='sleepy'&&<G>
//       <Path d={`M${cx-10} ${cy-3} h7 M${cx+3} ${cy-3} h7`} stroke={K} strokeWidth={2.2} strokeLinecap="round"/>
//       <Ellipse cx={cx} cy={cy+8} rx={4} ry={5} fill="#c0304f" stroke={K} strokeWidth={1.4}/>
//       <SvgText x={cx+28} y={cy-22} fontSize={12} fontWeight="bold" fill={CH}>brrr</SvgText>
//     </G>}
//     {mood==='sleeping'&&<G>
//       <Path d={`M${cx-10} ${cy-3} Q${cx-6.5} ${cy+1} ${cx-3} ${cy-3}`} stroke={K} strokeWidth={2.2} fill="none" strokeLinecap="round"/>
//       <Path d={`M${cx+3} ${cy-3} Q${cx+6.5} ${cy+1} ${cx+10} ${cy-3}`} stroke={K} strokeWidth={2.2} fill="none" strokeLinecap="round"/>
//       <Path d={`M${cx-4} ${cy+8} Q${cx} ${cy+11} ${cx+4} ${cy+8}`} stroke={K} strokeWidth={1.8} fill="none" strokeLinecap="round"/>
//       <SvgText x={cx+24} y={cy-18} fontSize={14} fontWeight="bold" fill="#ffe9a0">Z</SvgText>
//       <SvgText x={cx+34} y={cy-30} fontSize={11} fontWeight="bold" fill="#ffe9a0">z</SvgText>
//       {/* blanket */}
//       <Rect x={cx-34} y={cy+14} width={68} height={40} rx={8} fill="#6aa7e0" stroke={CH} strokeWidth={2.2}/>
//       <Path d={`M${cx-30} ${cy+26} H${cx+30} M${cx-30} ${cy+38} H${cx+30}`} stroke="#c9e2fa" strokeWidth={1.6} strokeDasharray="4 4"/>
//     </G>}
//   </G>;
// };

// /* ---------------- the room ---------------- */

// export const Room=({w,light,baby}:{w:number;light:boolean;baby:L7Scene['baby']})=>(
//   <Svg width={w} height={w*ROOM_H/ROOM_W} viewBox={`0 0 ${ROOM_W} ${ROOM_H}`}>
//     {/* walls + floor */}
//     <Rect x={6} y={6} width={288} height={200} rx={6} {...ch} fill="rgba(255,255,255,0.04)"/>
//     <Line x1={6} y1={206} x2={294} y2={206} {...ch}/>
//     <Ellipse cx={150} cy={234} rx={104} ry={17} {...ch} strokeDasharray="6 7" strokeWidth={2}/>

//     {/* window with the night sky + curtains */}
//     <Rect x={26} y={28} width={62} height={72} {...ch} fill="#16384a"/>
//     <Line x1={57} y1={28} x2={57} y2={100} {...ch}/><Line x1={26} y1={64} x2={88} y2={64} {...ch}/>
//     <Circle cx={42} cy={46} r={9} fill="#ffe9a0"/><Circle cx={46} cy={43} r={8} fill="#16384a"/>
//     <Circle cx={72} cy={42} r={1.8} fill={CH}/><Circle cx={68} cy={80} r={1.6} fill={CH}/><Circle cx={78} cy={90} r={1.4} fill={CH}/>
//     <Path d="M18 24 Q30 60 20 104 L34 104 Q40 60 34 24Z" fill="rgba(255,138,158,0.45)" stroke={CH} strokeWidth={2}/>
//     <Path d="M96 24 Q84 60 94 104 L80 104 Q74 60 80 24Z" fill="rgba(255,138,158,0.45)" stroke={CH} strokeWidth={2}/>

//     {/* wall clock showing 2 o'clock */}
//     <Circle cx={150} cy={34} r={19} {...ch} fill="rgba(255,255,255,0.08)"/>
//     <Line x1={150} y1={34} x2={150} y2={21} {...ch} strokeWidth={2.2}/>
//     <Line x1={150} y1={34} x2={158} y2={30} {...ch} strokeWidth={2.8}/>
//     <Circle cx={150} cy={34} r={1.8} fill={CH}/>

//     {/* tv */}
//     <Rect x={214} y={58} width={66} height={46} rx={4} {...ch}/>
//     <Rect x={220} y={64} width={54} height={34} rx={2} fill="#0e2a22" stroke={CH} strokeWidth={1.4}/>
//     <Path d="M236 104 L230 120 M258 104 L264 120" {...ch}/>
//     <Line x1={226} y1={120} x2={268} y2={120} {...ch}/>

//     {/* table + lamp */}
//     <Rect x={20} y={158} width={62} height={7} rx={2} {...ch}/>
//     <Line x1={28} y1={165} x2={28} y2={206} {...ch}/><Line x1={74} y1={165} x2={74} y2={206} {...ch}/>
//     <Line x1={51} y1={142} x2={51} y2={158} {...ch}/>
//     <Path d="M36 112 L66 112 L60 142 L42 142Z" {...ch} fill={light?'#ffe9a0':'rgba(255,255,255,0.12)'}/>

//     {/* crib */}
//     <Rect x={98} y={120} width={112} height={80} rx={6} {...ch}/>
//     {[114,130,146,162,178,194].map(x=><Line key={x} x1={x} y1={120} x2={x} y2={200} stroke={CH} strokeWidth={1.8} strokeLinecap="round"/>)}
//     <Line x1={98} y1={200} x2={98} y2={206} {...ch}/><Line x1={210} y1={200} x2={210} y2={206} {...ch}/>
//     <Baby mood={baby}/>
//     {/* rails drawn again in front of the baby's body */}
//     <Line x1={98} y1={176} x2={210} y2={176} {...ch} strokeWidth={2}/>

//     {/* teddy */}
//     <Ellipse cx={244} cy={190} rx={12} ry={13} fill="#c98a4b" stroke={CH} strokeWidth={2}/>
//     <Circle cx={244} cy={170} r={11} fill="#d9a066" stroke={CH} strokeWidth={2}/>
//     <Circle cx={236} cy={161} r={4} fill="#d9a066" stroke={CH} strokeWidth={1.8}/><Circle cx={252} cy={161} r={4} fill="#d9a066" stroke={CH} strokeWidth={1.8}/>
//     <Circle cx={240} cy={169} r={1.5} fill={K}/><Circle cx={248} cy={169} r={1.5} fill={K}/>

//     {/* light on: warm glow around the lamp. Light off: the whole room is dark */}
//     {light
//       ?<Circle cx={51} cy={128} r={84} fill="#ffe9a0" opacity={0.16}/>
//       :<Rect x={0} y={0} width={ROOM_W} height={ROOM_H} fill="#06140f" opacity={0.5}/>}
//   </Svg>
// );

// /* ---------------- things you can drag onto the baby ---------------- */

// export const Thing=({id,size=58}:{id:string;size?:number}):React.ReactElement=>{
//   const s=size;
//   const p={stroke:K,strokeWidth:2.6,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
//   return <Svg width={s} height={s} viewBox="0 0 60 60">
//     {id==='bottle'&&<G>
//       <Rect x={22} y={6} width={16} height={10} rx={4} fill="#ff8aa8" {...p}/>
//       <Path d="M20 18 H40 V50 Q40 55 35 55 H25 Q20 55 20 50Z" fill="#f4f8ff" {...p}/>
//       <Path d="M20 34 H40 V50 Q40 55 35 55 H25 Q20 55 20 50Z" fill="#fff" stroke="none"/>
//       <Path d="M24 26 H32 M24 32 H34" stroke="#7fb4e6" strokeWidth={2.4}/>
//     </G>}
//     {id==='book'&&<G>
//       <Rect x={10} y={12} width={40} height={36} rx={3} fill="#e8523f" {...p}/>
//       <Rect x={14} y={16} width={32} height={28} fill="#fff7e6" stroke={K} strokeWidth={1.8}/>
//       <Path d="M20 24 H40 M20 31 H40 M20 38 H34" stroke="#9aa" strokeWidth={2}/>
//     </G>}
//     {id==='duck'&&<G>
//       <Ellipse cx={28} cy={38} rx={18} ry={13} fill="#ffd23f" {...p}/>
//       <Circle cx={38} cy={20} r={10} fill="#ffd23f" {...p}/>
//       <Path d="M46 20 L56 23 L46 26Z" fill="#ff8a3d" {...p} strokeWidth={2}/>
//       <Circle cx={40} cy={18} r={1.8} fill={K}/>
//     </G>}
//     {id==='blanket'&&<G>
//       <Rect x={6} y={14} width={48} height={34} rx={5} fill="#6aa7e0" {...p}/>
//       <Path d="M6 26 H54 M6 38 H54" stroke="#c9e2fa" strokeWidth={2} strokeDasharray="4 4"/>
//       <Path d="M14 14 V48 M26 14 V48 M38 14 V48" stroke="rgba(255,255,255,0.35)" strokeWidth={2}/>
//     </G>}
//     {id==='sunglasses'&&<G>
//       <Rect x={5} y={20} width={22} height={16} rx={7} fill="#333" {...p}/>
//       <Rect x={33} y={20} width={22} height={16} rx={7} fill="#333" {...p}/>
//       <Path d="M27 26 H33" {...p}/><Path d="M5 24 L2 20 M55 24 L58 20" {...p}/>
//     </G>}
//     {id==='umbrella'&&<G>
//       <Path d="M6 30 Q30 -2 54 30 Q46 26 40 30 Q34 26 30 30 Q26 26 20 30 Q14 26 6 30Z" fill="#e8403f" {...p}/>
//       <Path d="M30 30 V50 Q30 56 24 55" fill="none" {...p}/>
//     </G>}
//   </Svg>;
// };

// export const Tick=({s=46}:{s?:number})=>(
//   <Svg width={s} height={s} viewBox="0 0 48 48"><Path d="M8 26 L19 37 L41 11" stroke="#5bd33a" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round"/></Svg>
// );
// export const Cross=({s=46}:{s?:number})=>(
//   <Svg width={s} height={s} viewBox="0 0 48 48"><Circle cx={24} cy={24} r={21} fill="#e8403f" stroke={K} strokeWidth={2.5}/><Path d="M16 16 L32 32 M32 16 L16 32" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round"/></Svg>
// );
// export const BigStar=({s=44,on=true}:{s?:number;on?:boolean})=>(
//   <Svg width={s} height={s} viewBox="0 0 50 50"><Polygon points="25,4 31,18 46,19 35,29 38,45 25,37 12,45 15,29 4,19 19,18" fill={on?'#ffd23f':'#d9d2b8'} stroke={K} strokeWidth={2.2} strokeLinejoin="round"/></Svg>
// );
// export const Duster=({w=84}:{w?:number})=>(
//   <Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>
// );
// export const ChalkPiece=({w=78}:{w?:number})=>(
//   <Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>
// );
import React from 'react';
import Svg,{Path,Circle,Ellipse,Rect,Line,G,Polygon,Text as SvgText} from 'react-native-svg';
import {L7Scene} from './Btlevel7api';

// Colourful cartoon room (flat colours + dark outline), drawn in a 300 x 240 box.
export const ROOM_W=300,ROOM_H=240;
export const HOT:{[k:string]:{x:number;y:number;w:number;h:number}}={
  wallclock:{x:118,y:6, w:56,h:56},
  calendar: {x:184,y:12,w:40,h:50},
  board:    {x:232,y:10,w:62,h:78},
  alarm:    {x:228,y:130,w:52,h:44},
  bag:      {x:40, y:150,w:62,h:62},
  mia:      {x:108,y:84, w:84,h:128},
};

const O='#3a3a45';          // outline
const ol={stroke:O,strokeWidth:2,strokeLinejoin:'round' as const,strokeLinecap:'round' as const};

/* ---------------- Mia ---------------- */

const Mia=({mood}:{mood:L7Scene['mood']})=>{
  const cx=150;
  const happy=mood==='happy';
  return <G>
    {/* legs + shoes */}
    <Rect x={cx-14} y={176} width={10} height={28} rx={3} fill="#ffd8b8" {...ol}/>
    <Rect x={cx+4} y={176} width={10} height={28} rx={3} fill="#ffd8b8" {...ol}/>
    <Path d={`M${cx-18} 204 h18 v6 h-20z`} fill="#e8523f" {...ol}/>
    <Path d={`M${cx+2} 204 h18 v6 h-16z`} fill="#e8523f" {...ol}/>
    {/* backpack straps / bag on her back once it is packed */}
    {(mood==='pay'||happy)&&<Rect x={cx+14} y={128} width={20} height={36} rx={7} fill="#f2b632" {...ol}/>}
    {/* dress */}
    <Path d={`M${cx-20} 176 L${cx-14} 128 H${cx+14} L${cx+20} 176Z`} fill="#3d7fd9" {...ol}/>
    <Rect x={cx-6} y={128} width={12} height={9} fill="#fff" {...ol}/>
    {/* arms */}
    <Path d={`M${cx-14} 132 L${cx-26} ${mood==='pay'?150:164}`} stroke="#ffd8b8" strokeWidth={8} strokeLinecap="round"/>
    <Path d={`M${cx+14} 132 L${cx+(mood==='pay'?32:26)} ${mood==='pay'?136:164}`} stroke="#ffd8b8" strokeWidth={8} strokeLinecap="round"/>
    {mood==='pay'&&<Circle cx={cx+32} cy={134} r={5} fill="#ffd8b8" {...ol}/>}
    {/* head */}
    <Circle cx={cx} cy={110} r={19} fill="#ffe0c4" {...ol}/>
    {/* hair */}
    <Path d={`M${cx-20} 108 Q${cx-20} 86 ${cx} 88 Q${cx+20} 86 ${cx+20} 108 Q${cx+10} 96 ${cx} 98 Q${cx-10} 96 ${cx-20} 108Z`} fill="#7a4a2a" {...ol}/>
    <Circle cx={cx-22} cy={94} r={7} fill="#7a4a2a" {...ol}/><Circle cx={cx+22} cy={94} r={7} fill="#7a4a2a" {...ol}/>
    <Rect x={cx-22} y={90} width={5} height={5} fill="#e8523f"/><Rect x={cx+17} y={90} width={5} height={5} fill="#e8523f"/>
    {/* face */}
    {happy
      ?<G>
        <Path d={`M${cx-10} 110 Q${cx-6} 105 ${cx-2} 110`} stroke={O} strokeWidth={2} fill="none" strokeLinecap="round"/>
        <Path d={`M${cx+2} 110 Q${cx+6} 105 ${cx+10} 110`} stroke={O} strokeWidth={2} fill="none" strokeLinecap="round"/>
        <Path d={`M${cx-8} 117 Q${cx} 128 ${cx+8} 117Z`} fill="#c0304f" {...ol} strokeWidth={1.5}/>
      </G>
      :<G>
        <Circle cx={cx-6} cy={110} r={2.4} fill={O}/><Circle cx={cx+6} cy={110} r={2.4} fill={O}/>
        <Path d={`M${cx-10} 103 L${cx-3} 105 M${cx+10} 103 L${cx+3} 105`} stroke={O} strokeWidth={1.8} strokeLinecap="round"/>
        {mood==='late'
          ?<Ellipse cx={cx} cy={120} rx={4} ry={3.2} fill="#c0304f" stroke={O} strokeWidth={1.4}/>
          :<Path d={`M${cx-5} 120 Q${cx} 116 ${cx+5} 120`} stroke={O} strokeWidth={1.8} fill="none" strokeLinecap="round"/>}
      </G>}
    {mood==='late'&&<Path d={`M${cx+22} 100 q-4 8 0 11 q4 -3 0 -11Z`} fill="#7fd3ff" stroke={O} strokeWidth={1.2}/>}
    {happy&&<G>
      <Polygon points="196,92 200,101 210,102 202,108 205,118 196,112 187,118 190,108 182,102 192,101" fill="#ffd23f" {...ol} strokeWidth={1.6}/>
    </G>}
  </G>;
};

/* ---------------- the room ---------------- */

export const Room=({w,mood}:{w:number;mood:L7Scene['mood']})=>{
  const bag=mood==='late'||mood==='pack';
  return <Svg width={w} height={w*ROOM_H/ROOM_W} viewBox={`0 0 ${ROOM_W} ${ROOM_H}`}>
    {/* wall + floor */}
    <Rect x={0} y={0} width={300} height={240} fill="#eef1f4"/>
    <Rect x={0} y={0} width={300} height={170} fill="#f6f8fa"/>
    <Path d="M0 170 H300 V240 H0Z" fill="#d9b07a"/>
    <Path d="M0 170 H300" stroke={O} strokeWidth={2}/>
    {[190,210,228].map(y=><Line key={y} x1={0} y1={y} x2={300} y2={y} stroke="#c49a63" strokeWidth={1.4}/>)}
    {/* rug */}
    <Ellipse cx={150} cy={206} rx={104} ry={20} fill="#6bc4c4" {...ol}/>

    {/* window */}
    <Rect x={14} y={22} width={72} height={78} fill="#8fd3f4" {...ol}/>
    <Circle cx={66} cy={42} r={9} fill="#ffd23f" stroke={O} strokeWidth={1.6}/>
    <Path d="M22 92 Q38 70 56 80 Q70 62 80 90Z" fill="#7ccf6a" stroke={O} strokeWidth={1.4}/>
    <Line x1={50} y1={22} x2={50} y2={100} stroke={O} strokeWidth={2}/><Line x1={14} y1={61} x2={86} y2={61} stroke={O} strokeWidth={2}/>
    <Path d="M6 18 Q14 58 8 106 L24 106 Q30 58 24 18Z" fill="#ffd36e" {...ol}/>
    <Path d="M94 18 Q86 58 92 106 L76 106 Q70 58 76 18Z" fill="#ffd36e" {...ol}/>
    <Rect x={2} y={14} width={98} height={6} rx={3} fill="#8a5a2e" {...ol}/>

    {/* wall clock: no battery, stopped at 7:20 */}
    <Circle cx={146} cy={34} r={25} fill="#fff" stroke={O} strokeWidth={3}/>
    {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <Line key={i} x1={146+Math.sin(a)*20} y1={34-Math.cos(a)*20} x2={146+Math.sin(a)*23} y2={34-Math.cos(a)*23} stroke={O} strokeWidth={i%3===0?2.4:1.4}/>})}
    <Line x1={146} y1={34} x2={146+Math.sin(220*Math.PI/180)*12} y2={34-Math.cos(220*Math.PI/180)*12} stroke={O} strokeWidth={3} strokeLinecap="round"/>
    <Line x1={146} y1={34} x2={146+Math.sin(120*Math.PI/180)*18} y2={34-Math.cos(120*Math.PI/180)*18} stroke={O} strokeWidth={2} strokeLinecap="round"/>
    <Circle cx={146} cy={34} r={2.4} fill={O}/>
    {/* battery on the floor */}
    <Rect x={122} y={196} width={20} height={8} rx={2} fill="#e8523f" {...ol} strokeWidth={1.4}/>
    <Rect x={142} y={198} width={3} height={4} fill={O}/>
    <SvgText x={132} y={203} fontSize={6} fontWeight="bold" fill="#fff" textAnchor="middle">AA</SvgText>

    {/* bus sign */}
    <Rect x={104} y={68} width={84} height={16} rx={4} fill="#ffd23f" {...ol}/>
    <SvgText x={146} y={80} fontSize={10} fontWeight="bold" fill={O} textAnchor="middle">BUS LEAVES 8:00</SvgText>

    {/* calendar */}
    <Rect x={186} y={14} width={36} height={46} rx={3} fill="#fff" {...ol}/>
    <Rect x={186} y={14} width={36} height={13} rx={3} fill="#e8523f" {...ol}/>
    <SvgText x={204} y={24} fontSize={8} fontWeight="bold" fill="#fff" textAnchor="middle">WED</SvgText>
    <SvgText x={204} y={48} fontSize={17} fontWeight="bold" fill={O} textAnchor="middle">15</SvgText>

    {/* timetable poster */}
    <Rect x={234} y={12} width={58} height={74} rx={3} fill="#fff8e1" {...ol}/>
    <SvgText x={263} y={23} fontSize={8} fontWeight="bold" fill="#e8523f" textAnchor="middle">TIMETABLE</SvgText>
    {[['MON','Maths'],['TUE','Art'],['WED','Science'],['THU','Music'],['FRI','Sports']].map(([d,s],i)=><G key={d}>
      <SvgText x={240} y={35+i*10.5} fontSize={7.5} fontWeight="bold" fill={O}>{d}</SvgText>
      <SvgText x={262} y={35+i*10.5} fontSize={7.5} fill="#555">{s}</SvgText>
      <Line x1={238} y1={37+i*10.5} x2={288} y2={37+i*10.5} stroke="#e0d3a8" strokeWidth={0.8}/>
    </G>)}

    {/* desk + alarm clock (works!) */}
    <Rect x={222} y={170} width={72} height={8} rx={2} fill="#9b6a3a" {...ol}/>
    <Rect x={228} y={178} width={6} height={30} fill="#7d522b" {...ol} strokeWidth={1.4}/><Rect x={282} y={178} width={6} height={30} fill="#7d522b" {...ol} strokeWidth={1.4}/>
    <Circle cx={240} cy={148} r={6} fill="#ff8a3d" {...ol} strokeWidth={1.4}/><Circle cx={268} cy={148} r={6} fill="#ff8a3d" {...ol} strokeWidth={1.4}/>
    <Rect x={236} y={142} width={36} height={28} rx={9} fill="#e8403f" {...ol}/>
    <Rect x={241} y={148} width={26} height={14} rx={3} fill="#1d3b2f" stroke={O} strokeWidth={1.4}/>
    <SvgText x={254} y={159} fontSize={11} fontWeight="bold" fill="#7dff9a" textAnchor="middle">7:50</SvgText>
    <Line x1={242} y1={170} x2={240} y2={174} stroke={O} strokeWidth={2}/><Line x1={266} y1={170} x2={268} y2={174} stroke={O} strokeWidth={2}/>

    {/* school bag on the floor (until it is packed) */}
    {bag&&<G>
      <Rect x={44} y={158} width={54} height={50} rx={12} fill="#f2b632" {...ol}/>
      <Rect x={52} y={176} width={38} height={22} rx={6} fill="#e89a1c" {...ol} strokeWidth={1.6}/>
      <Path d="M58 158 Q71 142 84 158" stroke={O} strokeWidth={3} fill="none" strokeLinecap="round"/>
      <Path d="M44 170 Q71 162 98 170" stroke={O} strokeWidth={1.6} fill="none"/>
      <Circle cx={71} cy={186} r={3} fill={O}/>
    </G>}

    <Mia mood={mood}/>
  </Svg>;
};

/* ---------------- things you can drag ---------------- */

export const Thing=({id,size=58}:{id:string;size?:number}):React.ReactElement=>{
  const s=size;
  const p={stroke:O,strokeWidth:2.4,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
  const coin=(n:string)=><G>
    <Circle cx={30} cy={30} r={22} fill="#ffd23f" {...p}/>
    <Circle cx={30} cy={30} r={16} fill="#ffe680" stroke="#d9a800" strokeWidth={1.6}/>
    <SvgText x={30} y={39} fontSize={24} fontWeight="bold" fill={O} textAnchor="middle">{n}</SvgText>
  </G>;
  return <Svg width={s} height={s} viewBox="0 0 60 60">
    {id==='maths'&&<G>
      <Rect x={9} y={8} width={42} height={46} rx={4} fill="#3d7fd9" {...p}/>
      <Rect x={9} y={8} width={8} height={46} rx={3} fill="#2c63ad" {...p}/>
      <SvgText x={33} y={27} fontSize={11} fontWeight="bold" fill="#fff" textAnchor="middle">MATHS</SvgText>
      <SvgText x={33} y={45} fontSize={15} fontWeight="bold" fill="#ffe680" textAnchor="middle">+ − ×</SvgText>
    </G>}
    {id==='science'&&<G>
      <Rect x={9} y={8} width={42} height={46} rx={4} fill="#3fae5a" {...p}/>
      <Rect x={9} y={8} width={8} height={46} rx={3} fill="#2c8444" {...p}/>
      <SvgText x={33} y={22} fontSize={8.5} fontWeight="bold" fill="#fff" textAnchor="middle">SCIENCE</SvgText>
      <Path d="M29 28 h8 v8 l7 12 h-22 l7 -12z" fill="#bfeaff" {...p} strokeWidth={1.8}/>
      <Circle cx={33} cy={44} r={2.2} fill="#e8523f"/>
    </G>}
    {id==='art'&&<G>
      <Path d="M30 8 C10 8 6 26 12 38 C18 52 30 54 36 50 C42 46 36 40 42 36 C54 30 52 8 30 8Z" fill="#f2c88c" {...p}/>
      <Circle cx={22} cy={22} r={5} fill="#e8403f" stroke={O} strokeWidth={1.4}/>
      <Circle cx={36} cy={18} r={5} fill="#3d7fd9" stroke={O} strokeWidth={1.4}/>
      <Circle cx={44} cy={30} r={5} fill="#ffd23f" stroke={O} strokeWidth={1.4}/>
      <Circle cx={18} cy={36} r={4.5} fill="#3fae5a" stroke={O} strokeWidth={1.4}/>
    </G>}
    {id==='c1'&&coin('1')}{id==='c3'&&coin('3')}{id==='c4'&&coin('4')}
  </Svg>;
};

export const Tick=({s=46}:{s?:number})=>(
  <Svg width={s} height={s} viewBox="0 0 48 48"><Path d="M8 26 L19 37 L41 11" stroke="#5bd33a" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round"/></Svg>
);
export const Cross=({s=46}:{s?:number})=>(
  <Svg width={s} height={s} viewBox="0 0 48 48"><Circle cx={24} cy={24} r={21} fill="#e8403f" stroke={O} strokeWidth={2.5}/><Path d="M16 16 L32 32 M32 16 L16 32" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round"/></Svg>
);
export const BigStar=({s=44,on=true}:{s?:number;on?:boolean})=>(
  <Svg width={s} height={s} viewBox="0 0 50 50"><Polygon points="25,4 31,18 46,19 35,29 38,45 25,37 12,45 15,29 4,19 19,18" fill={on?'#ffd23f':'#d9d2b8'} stroke={O} strokeWidth={2.2} strokeLinejoin="round"/></Svg>
);
export const Duster=({w=84}:{w?:number})=>(
  <Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>
);
export const ChalkPiece=({w=78}:{w?:number})=>(
  <Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>
);
