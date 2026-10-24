import React from 'react';
import { View, Image } from 'react-native';
import Svg, { Circle, Path, Rect, Ellipse, G, Polygon } from 'react-native-svg';

export const SPOT_A_IMG: any = null;
export const SPOT_B_IMG: any = null;

const BG = '#f48fb8';
const LINE = '#222';

function Donut({ x, y, r, c }: { x: number; y: number; r: number; c: string }) {
  return (
    <G>
      <Circle cx={x} cy={y} r={r} fill="#e8b36b" stroke={LINE} strokeWidth={1.5} />
      <Circle cx={x} cy={y} r={r * 0.8} fill={c} stroke={LINE} strokeWidth={1} />
      <Circle cx={x} cy={y} r={r * 0.3} fill={BG} stroke={LINE} strokeWidth={1} />
    </G>
  );
}

/* =========================================================
   SPOT SCENE  (viewBox 200 x 260)
   side 'a' and 'b' are the same picture with 3 differences:
   1. top-left donut colour   2. extra donut bottom-left   3. shirt pocket
========================================================= */

export function SpotScene({ side, width }: { side: 'a' | 'b'; width: number }) {
  const height = width * 1.3;
  const img = side === 'a' ? SPOT_A_IMG : SPOT_B_IMG;
  const a = side === 'a';

  return (
    <View style={{ width, height, borderWidth: 2, borderColor: LINE, backgroundColor: BG, overflow: 'hidden' }}>
      {img ? (
        <Image source={img} style={{ width, height }} resizeMode="cover" />
      ) : (
        <Svg width={width} height={height} viewBox="0 0 200 260">
          <Rect x={0} y={0} width={200} height={260} fill={BG} />

          {/* background donuts */}
          <Donut x={30} y={32} r={22} c={a ? '#7ed957' : '#ffd84a'} />
          <Donut x={108} y={24} r={18} c="#ff6aa8" />
          <Donut x={176} y={48} r={20} c="#8a5a3a" />
          <Donut x={24} y={110} r={20} c="#6ec6ff" />
          <Donut x={38} y={180} r={18} c="#ffd84a" />
          {a && <Donut x={26} y={236} r={16} c="#ff6aa8" />}

          {/* shirt */}
          <Path d="M64 260 L76 206 Q132 184 192 206 L200 260 Z" fill="#ff9a3d" stroke={LINE} strokeWidth={2} />
          {a && <Rect x={146} y={224} width={26} height={22} fill="#e07a1a" stroke={LINE} strokeWidth={1.5} />}

          {/* head */}
          <Ellipse cx={132} cy={140} rx={42} ry={44} fill="#f3c9a0" stroke={LINE} strokeWidth={2} />
          {/* hair */}
          <Path d="M88 128 Q90 84 132 84 Q176 84 176 128 L168 112 Q132 98 96 112 Z" fill={LINE} />
          <Rect x={92} y={96} width={80} height={24} rx={6} fill={LINE} />
          {/* beard */}
          <Path d="M92 146 Q96 196 132 196 Q168 196 172 146 Q150 168 132 168 Q114 168 92 146 Z" fill={LINE} />
          {/* eyes */}
          <Circle cx={118} cy={136} r={8} fill="#fff" stroke={LINE} strokeWidth={1.5} />
          <Circle cx={148} cy={136} r={8} fill="#fff" stroke={LINE} strokeWidth={1.5} />
          <Circle cx={118} cy={139} r={3.5} fill={LINE} />
          <Circle cx={148} cy={139} r={3.5} fill={LINE} />
          {/* big blue donut at his mouth */}
          <Donut x={96} y={170} r={22} c="#4fc3f7" />
        </Svg>
      )}
    </View>
  );
}

/* =========================================================
   BUTTON ICONS (viewBox 100 x 100)
========================================================= */

export function MagnifierIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={42} cy={42} r={26} fill="none" stroke="#1b1b1b" strokeWidth={9} />
      <Path d="M62 62 L88 88" stroke="#1b1b1b" strokeWidth={11} strokeLinecap="round" />
    </Svg>
  );
}

export function VideoIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Rect x={10} y={16} width={80} height={68} rx={8} fill="#a66bff" stroke="#1b1b1b" strokeWidth={6} />
      <Polygon points="40,34 40,66 68,50" fill="#ffffff" />
    </Svg>
  );
}

export function SkipIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Polygon points="34,22 34,78 78,50" fill="#1b1b1b" />
    </Svg>
  );
}

export function CoinIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={38} fill="#ffc83a" stroke="#b9801a" strokeWidth={8} />
      <Circle cx={50} cy={50} r={20} fill="none" stroke="#b9801a" strokeWidth={6} />
    </Svg>
  );
}