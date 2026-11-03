// Btlevel41art.tsx — drawing for Level 41 (two dark clouds raining "B")
// needs: npx expo install react-native-svg
import React from 'react';
import Svg, { Path, Text as SvgText, G } from 'react-native-svg';

type Props = { width?: number; height?: number };

// x, y, rotation, size  (all inside a 340 x 260 viewBox)
const DROPS: [number, number, number, number][] = [
  [40, 150, -20, 34], [78, 172, 12, 28], [112, 148, -8, 24], [150, 150, 6, 36],
  [188, 164, -14, 26], [222, 150, 18, 32], [262, 160, -10, 24], [298, 148, 10, 30],
  [52, 210, 20, 30], [96, 226, -12, 34], [140, 212, 14, 32], [182, 228, -18, 30],
  [226, 214, 12, 36], [268, 226, -8, 28], [304, 212, 16, 32], [124, 188, 8, 22],
  [248, 190, -16, 22],
];

export default function Btlevel41art({ width = 300, height = 230 }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 340 260">
      {/* big cloud */}
      <Path
        d="M20 122 C0 120 -2 92 20 84 C20 62 50 54 68 66 C76 36 122 28 140 54
           C160 36 196 48 196 76 C214 74 222 98 208 112 C214 124 204 134 192 130
           L36 130 C28 132 20 128 20 122 Z"
        fill="#3A4250"
      />
      {/* small cloud */}
      <Path
        d="M206 130 C190 128 190 106 206 102 C204 82 232 72 246 84 C252 62 290 58 302 80
           C320 78 330 102 316 116 C322 128 312 134 300 132 L222 132 C212 134 206 134 206 130 Z"
        fill="#3A4250"
      />
      {/* falling B letters */}
      {DROPS.map(([x, y, rot, size], i) => (
        <G key={i} rotation={rot} origin={`${x}, ${y}`}>
          <SvgText x={x} y={y} fontSize={size} fontWeight="900" fill="#111" textAnchor="middle">
            B
          </SvgText>
        </G>
      ))}
    </Svg>
  );
}
