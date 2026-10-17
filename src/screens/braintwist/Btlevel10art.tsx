import React from 'react';
import Svg, { Path, Circle, Line } from 'react-native-svg';

const CHALK = '#f6f4ea';
export const X_COLOR = '#7fc4ff';     // blue chalk = you
export const O_COLOR = '#ff8f8f';     // red chalk = rival

// the X of the player (chalk); the box is 60 x 60
export const XMark = ({ s = 40, color = X_COLOR }: { s?: number; color?: string }) => (
  <Svg width={s} height={s} viewBox="0 0 60 60">
    <Path d="M11 12 Q30 28 49 48" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
    <Path d="M49 11 Q30 30 12 49" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
  </Svg>
);

// the O of the rival (chalk); the box is 60 x 60
export const OMark = ({ s = 40, color = O_COLOR }: { s?: number; color?: string }) => (
  <Svg width={s} height={s} viewBox="0 0 60 60">
    <Circle cx="30" cy="30" r="19" stroke={color} strokeWidth="6" fill="none" />
  </Svg>
);

// the # board lines
export const Grid = ({ size }: { size: number }) => {
  const c = size / 3;
  const m = size * 0.03;
  const line = (k: string, x1: number, y1: number, x2: number, y2: number) => (
    <Line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={CHALK} strokeWidth={Math.max(3, size * 0.017)} strokeLinecap="round" />
  );
  return (
    <Svg width={size} height={size}>
      {line('v1', c, m, c, size - m)}
      {line('v2', c * 2, m, c * 2, size - m)}
      {line('h1', m, c, size - m, c)}
      {line('h2', m, c * 2, size - m, c * 2)}
    </Svg>
  );
};

// a gold line through the three winning squares
export const StrikeLine = ({ size, cells }: { size: number; cells: number[] }) => {
  const c = size / 3;
  const pt = (i: number) => ({ x: (i % 3 + 0.5) * c, y: (Math.floor(i / 3) + 0.5) * c });
  const a = pt(cells[0]);
  const b = pt(cells[2]);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ex = (dx / len) * c * 0.35;
  const ey = (dy / len) * c * 0.35;
  return (
    <Svg width={size} height={size} style={{ position: 'absolute', left: 0, top: 0 }}>
      <Line x1={a.x - ex} y1={a.y - ey} x2={b.x + ex} y2={b.y + ey} stroke="#ffd33d" strokeWidth={Math.max(5, size * 0.03)} strokeLinecap="round" />
    </Svg>
  );
};
