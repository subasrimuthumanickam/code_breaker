
import React from 'react';
import Svg, { Rect, Path, Circle, Ellipse, Line, G, Defs, ClipPath, Polygon } from 'react-native-svg';

const SKIN = '#fbd5b5';
const LEG = '#f6dcc8';
const HAIR = '#5b3b2e';
const SUIT = '#ffd23f';
const SUIT_DARK = '#f0b72a';
const INK = '#3a2a22';

/** height of the elliptical rim of the pool for a given pool width */
export const poolRy = (w: number) => Math.round(w * 0.09);

export type GirlPose = 'stand' | 'dive';

// Cartoon girl (same look as the Level 9 character).
//  stand: arms raised, ponytail, ready on the board
//  dive : arms stretched over the head, body straight, ponytail streaming back
export const Girl = ({ w = 48, pose = 'stand' }: { w?: number; pose?: GirlPose }) => (
  <Svg width={w} height={w * (88 / 48)} viewBox="0 0 48 88">
    {pose === 'stand' ? (
      <G>
        {/* ponytail */}
        <Path d="M30 9 Q47 3 45 27 Q43 16 33 16 Z" fill={HAIR} />
        <Path d="M31 10 Q40 8 42 18" stroke="#7a5342" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* arms raised */}
        <Path d="M17 30 Q7 20 11 5" stroke={SKIN} strokeWidth="4.4" fill="none" strokeLinecap="round" />
        <Path d="M31 30 Q41 19 34 4" stroke={SKIN} strokeWidth="4.4" fill="none" strokeLinecap="round" />
        <Circle cx="11" cy="4.5" r="2.6" fill={SKIN} />
        <Circle cx="34" cy="3.5" r="2.6" fill={SKIN} />
        {/* legs + socks */}
        <Line x1="20" y1="54" x2="19.5" y2="82" stroke={LEG} strokeWidth="5.4" strokeLinecap="round" />
        <Line x1="28" y1="54" x2="28.5" y2="82" stroke={LEG} strokeWidth="5.4" strokeLinecap="round" />
        <Line x1="19.6" y1="70" x2="19.5" y2="82" stroke="#ffffff" strokeWidth="5.8" strokeLinecap="butt" />
        <Line x1="28.4" y1="70" x2="28.5" y2="82" stroke="#ffffff" strokeWidth="5.8" strokeLinecap="butt" />
        <Ellipse cx="18.5" cy="85" rx="5" ry="2.4" fill={LEG} />
        <Ellipse cx="29.5" cy="85" rx="5" ry="2.4" fill={LEG} />
        {/* swimsuit */}
        <Path d="M16 29 Q24 24 32 29 L31 56 Q24 61 17 56 Z" fill={SUIT} />
        <Path d="M17 29 Q24 25 31 29 L31 33 Q24 29 17 33 Z" fill={SUIT_DARK} />
        {/* neck + head */}
        <Rect x="21.5" y="22" width="5" height="6" rx="2" fill={SKIN} />
        <Circle cx="24" cy="15" r="9.8" fill={SKIN} />
        <Path d="M14 14 Q13.5 3 24 3 Q35 3 34 14 Q29 8.5 24 9 Q19 8.5 14 14 Z" fill={HAIR} />
        {/* face */}
        <Path d="M18.4 16 q2.2 2.2 4.4 0 M25.2 16 q2.2 2.2 4.4 0" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <Circle cx="18" cy="20" r="1.8" fill="#f4a7a0" opacity="0.7" />
        <Circle cx="30.4" cy="20" r="1.8" fill="#f4a7a0" opacity="0.7" />
        <Path d="M21 21.4 q3 2.6 6 0" stroke="#c0504d" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </G>
    ) : (
      <G>
        {/* arms overhead, hands together */}
        <Path d="M19.5 32 Q21 16 23.5 3" stroke={SKIN} strokeWidth="4.4" fill="none" strokeLinecap="round" />
        <Path d="M28.5 32 Q27 16 24.5 3" stroke={SKIN} strokeWidth="4.4" fill="none" strokeLinecap="round" />
        {/* ponytail streaming back */}
        <Path d="M30 17 Q41 22 36 38 Q35 28 29 25 Z" fill={HAIR} />
        {/* legs together, toes pointed */}
        <Path d="M21.5 56 L22.5 83" stroke={LEG} strokeWidth="5.2" strokeLinecap="round" />
        <Path d="M26.5 56 L25.5 83" stroke={LEG} strokeWidth="5.2" strokeLinecap="round" />
        <Path d="M22.5 82 L23.5 87 M25.5 82 L24.5 87" stroke={LEG} strokeWidth="3.2" strokeLinecap="round" />
        {/* swimsuit */}
        <Path d="M17 31 Q24 27 31 31 L30 58 Q24 62 18 58 Z" fill={SUIT} />
        <Path d="M18 31 Q24 28 30 31 L30 34 Q24 31 18 34 Z" fill={SUIT_DARK} />
        {/* head tucked between the arms */}
        <Circle cx="24" cy="18" r="8.8" fill={SKIN} />
        <Path d="M15.5 17 Q15 8 24 8 Q33 8 32.5 17 Q28 12.5 24 13 Q20 12.5 15.5 17 Z" fill={HAIR} />
        <Path d="M19.4 19 q1.8 1.8 3.6 0 M25 19 q1.8 1.8 3.6 0" stroke={INK} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <Path d="M22 23.4 q2 1.6 4 0" stroke="#c0504d" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </G>
    )}
  </Svg>
);

// diving board: fixed on the right, slopes down to the tip on the left
// top edge: from (3,19) to (100,3) in a 100 x 30 box
export const Board = ({ w, h }: { w: number; h: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 30" preserveAspectRatio="none">
    <Path d="M3 19 L100 3 L100 17 L8 30 Q0 31 0 25 Z" fill="#b98a73" />
    <Path d="M3 19 L100 3 L100 8 L4 23 Z" fill="#d3a58c" />
    <Rect x="91" y="0" width="9" height="20" rx="3" fill="#8d6552" />
  </Svg>
);

// teal wall with light rays and a curved floor line (like level 9)
export const Backdrop = ({ w, h }: { w: number; h: number }) => {
  const edge = h * 0.78;
  const ctrl = h * 0.66;
  const shape = `M0 0 H${w} V${edge} Q${w / 2} ${ctrl} 0 ${edge} Z`;
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Defs>
        <ClipPath id="bd4clip">
          <Path d={shape} />
        </ClipPath>
      </Defs>
      <Path d={shape} fill="#84bccb" />
      <G clipPath="url(#bd4clip)">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x1 = (w / 6) * i;
          const x2 = x1 + w / 12;
          return (
            <Polygon
              key={i}
              points={`${x1},0 ${x2},0 ${w * 0.5 + (i - 2.5) * 34},${h}`}
              fill="rgba(0,60,90,0.13)"
            />
          );
        })}
      </G>
    </Svg>
  );
};

// water drops when she lands
export const Splash = ({ w = 56 }: { w?: number }) => (
  <Svg width={w} height={w * 0.7} viewBox="0 0 56 40">
    <Circle cx="28" cy="8" r="4" fill="#bfeaff" />
    <Circle cx="14" cy="14" r="3.4" fill="#9fdcff" />
    <Circle cx="42" cy="14" r="3.4" fill="#9fdcff" />
    <Circle cx="6" cy="26" r="2.6" fill="#8ad2fb" />
    <Circle cx="50" cy="26" r="2.6" fill="#8ad2fb" />
    <Path d="M6 36 Q28 22 50 36" stroke="#d9f3ff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
  </Svg>
);

const PAD = 3; // room for strokes at the edges

const geometry = (w: number, h: number, level: number) => {
  const rx = w / 2;
  const ry = poolRy(w);
  const inner = h - 2 * ry;
  const wy = h - ry - (inner * level) / 100; // centre of the top ellipse of the water
  return { rx, ry, wy, floor: h - ry };
};

// A cylinder FULL of water. `level` (0-100) is how tall the water column is:
// the base stays on the floor and the top rises when the player drags up.
export const Pool = ({
  w,
  h,
  level,
  hintLevel,
}: {
  w: number;
  h: number;
  level: number;
  hintLevel?: number | null;
}) => {
  const { rx, ry, wy, floor } = geometry(w, h, level);
  const body = `M0 ${wy} L0 ${floor} A${rx} ${ry} 0 0 0 ${w} ${floor} L${w} ${wy} Z`;
  const sides = `M0 ${wy} L0 ${floor} A${rx} ${ry} 0 0 0 ${w} ${floor} L${w} ${wy}`;
  const hy = hintLevel ? h - ry - ((h - 2 * ry) * hintLevel) / 100 : null;

  return (
    <Svg width={w + PAD * 2} height={h + PAD * 2}>
      <G x={PAD} y={PAD}>
        <Path d={body} fill="#7fdcff" />
        <Path d={sides} stroke="#2b2b2b" strokeWidth={2} fill="none" />
        <Ellipse cx={rx} cy={wy} rx={rx} ry={ry} fill="#a9e9ff" stroke="#2b2b2b" strokeWidth={2} />
        {hy !== null && (
          <Path d={`M0 ${hy} Q${rx} ${hy + 2 * ry} ${w} ${hy}`} stroke="#ffd33d" strokeWidth={3} fill="none" />
        )}
      </G>
    </Svg>
  );
};

// transparent water drawn in FRONT of the girl so she looks under the water
export const PoolWater = ({ w, h, level }: { w: number; h: number; level: number }) => {
  const { rx, ry, wy, floor } = geometry(w, h, level);
  const body = `M0 ${wy} L0 ${floor} A${rx} ${ry} 0 0 0 ${w} ${floor} L${w} ${wy} Z`;
  return (
    <Svg width={w + PAD * 2} height={h + PAD * 2}>
      <G x={PAD} y={PAD}>
        <Path d={body} fill="rgba(63,180,240,0.38)" />
      </G>
    </Svg>
  );
};
