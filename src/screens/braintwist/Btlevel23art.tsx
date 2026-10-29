import React from 'react';
import Svg, { Circle, Rect, Path, Polygon, Ellipse, G } from 'react-native-svg';

export const FACE_IDS = ['cool', 'angry', 'sick', 'devil', 'wink', 'bandage', 'star'];

// where each face sits inside the 290 x 250 play area
export const FACE_LAYOUT: Record<string, { x: number; y: number }> = {
  star: { x: 12, y: 25 },
  wink: { x: 97, y: 33 },
  angry: { x: 215, y: 0 },
  cool: { x: 12, y: 113 },
  devil: { x: 167, y: 100 },
  sick: { x: 86, y: 168 },
  bandage: { x: 200, y: 177 },
};

const DARK = '#3a2a12';

function body(id: string) {
  switch (id) {
    case 'cool':
      return (
        <>
          <Circle cx="50" cy="50" r="46" fill="#fbb917" stroke="#e19a0c" strokeWidth="3" />
          <Rect x="12" y="36" width="32" height="19" rx="5" fill="#2e2e2e" />
          <Rect x="56" y="36" width="32" height="19" rx="5" fill="#2e2e2e" />
          <Rect x="42" y="42" width="16" height="5" fill="#2e2e2e" />
          <Path d="M38 68 Q50 78 62 68" stroke="#8a4b0f" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      );
    case 'angry':
      return (
        <>
          <Circle cx="50" cy="50" r="46" fill="#d6402b" stroke="#a82a19" strokeWidth="3" />
          <Circle cx="34" cy="42" r="11" fill="#f6e9e4" stroke="#333" strokeWidth="3" />
          <Circle cx="66" cy="42" r="11" fill="#f6e9e4" stroke="#333" strokeWidth="3" />
          <Circle cx="34" cy="42" r="4" fill="#333" />
          <Circle cx="66" cy="42" r="4" fill="#333" />
          <Ellipse cx="50" cy="70" rx="5" ry="7" fill="#333" />
        </>
      );
    case 'sick':
      return (
        <>
          <Circle cx="50" cy="52" r="46" fill="#6aa84f" stroke="#4c8238" strokeWidth="3" />
          <Path d="M27 40 L41 54 M41 40 L27 54 M59 40 L73 54 M73 40 L59 54" stroke="#2b4a1c" strokeWidth="4" strokeLinecap="round" />
          <Path d="M36 72 H64" stroke="#2b4a1c" strokeWidth="4" strokeLinecap="round" />
          <Path d="M74 8 Q80 18 74 24 Q68 18 74 8 Z" fill="#cfeaf5" />
          <Path d="M62 14 Q66 20 62 24 Q58 20 62 14 Z" fill="#cfeaf5" />
        </>
      );
    case 'devil':
      return (
        <>
          <Polygon points="12,34 18,4 40,20" fill="#a259d9" stroke="#7d3cb0" strokeWidth="3" />
          <Polygon points="88,34 82,4 60,20" fill="#a259d9" stroke="#7d3cb0" strokeWidth="3" />
          <Circle cx="50" cy="54" r="44" fill="#a259d9" stroke="#7d3cb0" strokeWidth="3" />
          <Path d="M26 52 Q35 42 44 52 M56 52 Q65 42 74 52" stroke="#2d1244" strokeWidth="4" fill="none" strokeLinecap="round" />
          <Path d="M36 68 Q50 80 64 68" stroke="#2d1244" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      );
    case 'wink':
      return (
        <>
          <Circle cx="50" cy="50" r="46" fill="#fbb917" stroke="#e19a0c" strokeWidth="3" />
          <Path d="M24 36 L42 46 L24 56" stroke="#5a3205" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="68" cy="46" r="5" fill="#333" />
          <Ellipse cx="50" cy="70" rx="8" ry="9" fill="#8a2b1a" />
          <Ellipse cx="50" cy="75" rx="5" ry="4" fill="#ff7a8a" />
        </>
      );
    case 'bandage':
      return (
        <>
          <Circle cx="50" cy="50" r="46" fill="#fbb917" stroke="#e19a0c" strokeWidth="3" />
          <G rotation="-8" origin="50, 30">
            <Rect x="4" y="20" width="92" height="20" fill="#f6ecd0" stroke="#d9c58e" strokeWidth="2" />
            <Path d="M30 24 V36 M50 24 V36 M70 24 V36" stroke="#d9c58e" strokeWidth="2" />
          </G>
          <Path d="M26 54 Q33 47 40 54 M60 54 Q67 47 74 54" stroke="#5a3205" strokeWidth="4" fill="none" strokeLinecap="round" />
          <Path d="M28 58 Q20 76 30 82 Q40 76 34 58 Z" fill="#5bc0f0" />
          <Path d="M66 58 Q60 76 70 82 Q80 76 72 58 Z" fill="#5bc0f0" />
          <Path d="M40 78 Q50 70 60 78" stroke="#5a3205" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      );
    case 'star':
    default:
      return (
        <>
          <Circle cx="50" cy="50" r="46" fill="#e8cdb9" stroke="#c9a98f" strokeWidth="3" />
          <Path d="M32 30 L36 40 L46 44 L36 48 L32 58 L28 48 L18 44 L28 40 Z" fill="#f2b705" />
          <Path d="M68 30 L72 40 L82 44 L72 48 L68 58 L64 48 L54 44 L64 40 Z" fill="#f2b705" />
          <Ellipse cx="50" cy="70" rx="6" ry="5" fill="#c97b6b" />
        </>
      );
  }
}

export function Face({ id, size }: { id: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {body(id)}
    </Svg>
  );
}
