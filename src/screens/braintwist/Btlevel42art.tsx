// Btlevel42art.tsx
import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export const SLICE_W = 78;
export const SLICE_H = 92;

// Theme colours (same blue room / wooden sign look)
export const THEME = {
  bg: '#A9CFEF',
  sign: '#8B4A17',
  signBorder: '#5A2E0C',
  pill: '#F6EEDB',
  navy: '#14285B',
  yellow: '#F7C93B',
  green: '#A4E321',
  red: '#EE4B55',
  brown: '#6B3F1D',
  paper: '#FFFFFF',
};

export const PizzaSlice = ({ size = 1 }: { size?: number }) => (
  <Svg width={SLICE_W * size} height={SLICE_H * size} viewBox="0 0 78 92">
    {/* crust */}
    <Path d="M2 6 Q39 -4 76 6 L72 20 Q39 10 6 20 Z" fill="#D9945A" stroke="#4A2A12" strokeWidth={2} />
    {/* cheese */}
    <Path d="M6 20 Q39 10 72 20 L39 88 Z" fill="#F7C93B" stroke="#4A2A12" strokeWidth={2} />
    {/* sauce edge */}
    <Path d="M10 24 Q39 15 68 24" stroke="#D8452F" strokeWidth={4} fill="none" />
    {/* pepperoni */}
    <Circle cx={26} cy={34} r={6} fill="#B5533C" />
    <Circle cx={50} cy={36} r={6} fill="#B5533C" />
    <Circle cx={38} cy={54} r={6} fill="#B5533C" />
    <Circle cx={38} cy={72} r={4} fill="#B5533C" />
  </Svg>
);