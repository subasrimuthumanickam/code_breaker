import React from 'react';
import Svg, {Circle, Path, Rect, Ellipse, G, Polygon, Line, Text as SvgText} from 'react-native-svg';

/* =========================================================
   LEVEL 25 ART  -  "Save Tung Tung Tung Sahur from the police!"
   Everything is drawn in a 480 x 420 scene grid.
   The screen scales it with  k = sceneWidth / SCENE_W
========================================================= */

export const SCENE_W = 480;
export const SCENE_H = 420;

// the police van in its start position (scene units)
export const VAN = {x: 190, y: 265, w: 150, h: 97};

// where the van stops after the right move (centre point): beside the left house door
export const SOLVED_CENTER = {x: 222, y: 238};

// ninja (Tung Tung Tung Sahur) on the left roof
export const NINJA = {x: 88, y: 34, w: 56, h: 80};

// drop zones the van can be dropped on (the server decides which one is right)
export const ZONES: Record<string, {x: number; y: number; w: number; h: number}> = {
  door_left: {x: 52, y: 150, w: 124, h: 112},
  door_right: {x: 298, y: 108, w: 104, h: 104},
};

const INK = '#2f3b52';

/* ---------- one house (local box about 170 x 140) ---------- */
function House({tx, ty, s = 1, roof, roofDark, wall, side}: any) {
  return (
    <G transform={`translate(${tx} ${ty}) scale(${s})`}>
      {/* side wall */}
      <Polygon points="100,75 172,40 172,105 100,140" fill={side} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      {/* front wall */}
      <Polygon points="0,60 100,75 100,140 0,125" fill={wall} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      {/* roof */}
      <Polygon points="-12,62 72,6 182,38 100,80" fill={roof} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <Polygon points="72,6 182,38 100,80 60,52" fill={roofDark} opacity={0.45} />
      {/* window */}
      <Polygon points="14,82 42,86 42,108 14,104" fill="#ffd95a" stroke={INK} strokeWidth={2} />
      <Line x1={28} y1={84} x2={28} y2={106} stroke={INK} strokeWidth={1.5} />
      <Line x1={14} y1={94} x2={42} y2={97} stroke={INK} strokeWidth={1.5} />
      {/* door */}
      <Polygon points="58,94 78,97 78,137 58,134" fill="#6b4328" stroke={INK} strokeWidth={2} />
      <Circle cx={74} cy={116} r={1.8} fill="#f6e3b0" />
    </G>
  );
}

/* ---------- the static scene (no van, no ninja) ---------- */
export function Scene({w}: {w: number}) {
  const h = (w * SCENE_H) / SCENE_W;
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} pointerEvents="none">
      {/* grey street */}
      <Rect x={0} y={128} width={SCENE_W} height={SCENE_H - 128} fill="#a6a6a6" />

      {/* left house (Sahur is on its roof) */}
      <House tx={40} ty={95} roof="#8e2f33" roofDark="#5a1a1e" wall="#f8d9b2" side="#d9b48c" />

      {/* shark in blue shoes, hiding behind the right house */}
      <G transform="translate(236 118)">
        <Ellipse cx={30} cy={70} rx={30} ry={5} fill="#7d7d7d" opacity={0.6} />
        <Rect x={12} y={44} width={11} height={22} fill="#2c4fa0" />
        <Rect x={34} y={44} width={11} height={22} fill="#2c4fa0" />
        <Ellipse cx={14} cy={67} rx={13} ry={6} fill="#2d6ae0" stroke={INK} strokeWidth={1.5} />
        <Ellipse cx={42} cy={67} rx={13} ry={6} fill="#2d6ae0" stroke={INK} strokeWidth={1.5} />
        <Polygon points="30,8 40,-8 48,10" fill="#6f879b" stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
        <Polygon points="0,34 18,10 48,6 66,26 58,44 18,46" fill="#7f98ad" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <Path d="M4 36 L58 42" stroke={INK} strokeWidth={1.5} />
        <Polygon points="10,38 14,44 18,39 22,45 26,40 30,46 34,41 38,46 42,41 46,45 50,41" fill="#fff" stroke={INK} strokeWidth={0.8} />
        <Circle cx={22} cy={22} r={3.4} fill="#fff" stroke={INK} strokeWidth={1.2} />
        <Circle cx={22} cy={22} r={1.5} fill={INK} />
      </G>

      {/* right house */}
      <House tx={285} ty={55} s={0.95} roof="#7a1f27" roofDark="#4a1016" wall="#f5d2a8" side="#cfa982" />

      {/* police officer */}
      <G transform="translate(42 250)">
        <Ellipse cx={27} cy={112} rx={30} ry={5} fill="#7d7d7d" opacity={0.6} />
        <Rect x={14} y={82} width={11} height={26} fill="#25618f" stroke={INK} strokeWidth={1.5} />
        <Rect x={29} y={82} width={11} height={26} fill="#25618f" stroke={INK} strokeWidth={1.5} />
        <Ellipse cx={18} cy={109} rx={9} ry={4.5} fill="#2a2f3a" />
        <Ellipse cx={35} cy={109} rx={9} ry={4.5} fill="#2a2f3a" />
        <Rect x={2} y={46} width={11} height={32} rx={5} fill="#2f78b5" stroke={INK} strokeWidth={1.5} />
        <Rect x={41} y={46} width={11} height={32} rx={5} fill="#2f78b5" stroke={INK} strokeWidth={1.5} />
        <Rect x={10} y={44} width={34} height={40} rx={8} fill="#3a86c6" stroke={INK} strokeWidth={1.5} />
        <Rect x={10} y={72} width={34} height={6} fill="#2a2f3a" />
        <Rect x={24} y={72} width={6} height={6} fill="#f2c94c" />
        <Circle cx={27} cy={30} r={16} fill="#f6d4b0" stroke={INK} strokeWidth={1.5} />
        <Circle cx={21} cy={31} r={2} fill={INK} /><Circle cx={33} cy={31} r={2} fill={INK} />
        <Path d="M22 39 Q27 36 32 39" stroke={INK} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        <Path d="M9 18 Q27 -6 45 18 Z" fill="#2a6fa8" stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
        <Rect x={4} y={16} width={46} height={6} rx={3} fill="#1f5a8c" stroke={INK} strokeWidth={1.5} />
        <Circle cx={27} cy={10} r={3} fill="#f2c94c" />
      </G>
    </Svg>
  );
}

/* ---------- the police van (own SVG so it can be dragged) ---------- */
export function VanArt({w}: {w: number}) {
  const h = (w * 130) / 200;
  return (
    <Svg width={w} height={h} viewBox="0 0 200 130">
      <Ellipse cx={104} cy={124} rx={90} ry={6} fill="#6f6f6f" opacity={0.5} />
      {/* roof lights */}
      <Rect x={62} y={14} width={22} height={9} rx={3} fill="#e53b46" stroke={INK} strokeWidth={1.5} />
      <Rect x={84} y={16} width={20} height={9} rx={3} fill="#f4f4f4" stroke={INK} strokeWidth={1.5} />
      <Rect x={104} y={18} width={22} height={9} rx={3} fill="#4fd0f0" stroke={INK} strokeWidth={1.5} />
      {/* body */}
      <Polygon points="8,46 120,28 190,62 190,108 70,126 8,98" fill="#3f7fe0" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <Polygon points="8,46 120,28 190,62 72,82" fill="#5a98f2" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      {/* windshield */}
      <Polygon points="150,50 178,63 178,82 150,72" fill="#a7d6f6" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      {/* cage window with the prisoner */}
      <Rect x={16} y={56} width={48} height={32} rx={3} fill="#2c3a55" stroke={INK} strokeWidth={2} />
      <Circle cx={40} cy={74} r={11} fill="#f0742c" />
      <Circle cx={36} cy={72} r={2} fill="#fff" /><Circle cx={45} cy={72} r={2} fill="#fff" />
      {[24, 32, 40, 48, 56].map(x => <Line key={x} x1={x} y1={57} x2={x} y2={87} stroke="#d9dde6" strokeWidth={2} />)}
      {/* text */}
      <SvgText x={96} y={108} fontSize={20} fontWeight="bold" fill="#fff" transform="rotate(-9 96 108)">POLICE</SvgText>
      {/* bumper */}
      <Rect x={184} y={90} width={10} height={9} rx={3} fill="#e9e9e9" stroke={INK} strokeWidth={1.5} />
      {/* wheels */}
      <Circle cx={72} cy={112} r={17} fill="#2a2f3a" stroke={INK} strokeWidth={2} /><Circle cx={72} cy={112} r={7} fill="#d4d8e0" />
      <Circle cx={152} cy={98} r={16} fill="#2a2f3a" stroke={INK} strokeWidth={2} /><Circle cx={152} cy={98} r={6.5} fill="#d4d8e0" />
    </Svg>
  );
}

/* ---------- Tung Tung Tung Sahur ---------- */
export function NinjaArt({w}: {w: number}) {
  const h = (w * 80) / 56;
  return (
    <Svg width={w} height={h} viewBox="0 0 56 80">
      {/* swords */}
      <Line x1={5} y1={6} x2={5} y2={46} stroke="#c9ced8" strokeWidth={3.5} strokeLinecap="round" />
      <Line x1={51} y1={6} x2={51} y2={46} stroke="#c9ced8" strokeWidth={3.5} strokeLinecap="round" />
      <Rect x={2} y={44} width={7} height={5} fill="#e53b46" />
      <Rect x={47} y={44} width={7} height={5} fill="#e53b46" />
      {/* body */}
      <Rect x={13} y={16} width={30} height={62} rx={10} fill="#8a5a33" stroke={INK} strokeWidth={2} />
      <Rect x={13} y={16} width={30} height={9} rx={4} fill="#6f4222" />
      <Rect x={13} y={30} width={30} height={13} fill="#3a2418" />
      <Circle cx={22} cy={36} r={3} fill="#fff" /><Circle cx={34} cy={36} r={3} fill="#fff" />
      <Circle cx={22} cy={36} r={1.3} fill={INK} /><Circle cx={34} cy={36} r={1.3} fill={INK} />
      <Rect x={9} y={44} width={8} height={5} rx={2} fill="#e53b46" />
      <Line x1={13} y1={56} x2={43} y2={56} stroke="#6f4222" strokeWidth={2} />
    </Svg>
  );
}

/* ---------- small feedback icons ---------- */
export function Tick({s = 80}: {s?: number}) {
  return (
    <Svg width={s} height={s} viewBox="0 0 80 80">
      <Circle cx={40} cy={40} r={36} fill="#3ec45a" stroke="#fff" strokeWidth={5} />
      <Path d="M22 41 L35 54 L59 27" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Cross({s = 46}: {s?: number}) {
  return (
    <Svg width={s} height={s} viewBox="0 0 46 46">
      <Circle cx={23} cy={23} r={21} fill="#ee4558" stroke="#fff" strokeWidth={3} />
      <Path d="M14 14 L32 32 M32 14 L14 32" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
    </Svg>
  );
}
