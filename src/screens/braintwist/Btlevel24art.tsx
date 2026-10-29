import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, Rect, Ellipse, Circle, Path, G,
} from 'react-native-svg';

const Leaf = ({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) => (
  <G transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <Path d="M0 0 C 18 -22, 44 -10, 40 14 C 20 22, 4 14, 0 0 Z" fill="#4caf50" />
    <Path d="M2 2 C 14 -4, 26 -2, 36 10" stroke="#2e7d32" strokeWidth={2} fill="none" />
  </G>
);

const Plant = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <G transform={`translate(${x} ${y}) scale(${s})`}>
    <Leaf x={0} y={0} r={-70} />
    <Leaf x={0} y={0} r={-30} s={1.2} />
    <Leaf x={0} y={0} r={10} s={1.1} />
    <Leaf x={0} y={0} r={-110} s={1.1} />
    <Leaf x={0} y={0} r={-150} />
    <Path d="M-26 0 L26 0 L20 46 L-20 46 Z" fill="#f3d9cf" />
    <Rect x={-28} y={-4} width={56} height={8} rx={4} fill="#e8c4b6" />
  </G>
);

const BookStack = ({ x, y }: { x: number; y: number }) => (
  <G transform={`translate(${x} ${y})`}>
    <Rect x={0} y={0} width={130} height={26} rx={5} fill="#2e9e6b" />
    <Rect x={-8} y={-28} width={136} height={26} rx={5} fill="#ec6f9a" />
    <Rect x={6} y={-56} width={120} height={26} rx={5} fill="#3f7fd6" />
  </G>
);

export const Level24Background = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#fdebc8" />
          <Stop offset="1" stopColor="#f6d49a" />
        </LinearGradient>
        <LinearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#f2b668" />
          <Stop offset="1" stopColor="#e39a45" />
        </LinearGradient>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8fd0f5" />
          <Stop offset="1" stopColor="#c8ecff" />
        </LinearGradient>
      </Defs>

      {/* wall + floor */}
      <Rect x={0} y={0} width={400} height={800} fill="url(#wall)" />
      <Rect x={0} y={600} width={400} height={200} fill="url(#floor)" />

      {/* window */}
      <Rect x={-10} y={30} width={110} height={190} rx={6} fill="#d9894a" />
      <Rect x={-4} y={38} width={96} height={174} fill="url(#sky)" />
      <Ellipse cx={40} cy={90} rx={26} ry={12} fill="#fff" opacity={0.9} />
      <Ellipse cx={64} cy={100} rx={22} ry={10} fill="#fff" opacity={0.9} />
      <Rect x={-4} y={120} width={96} height={6} fill="#d9894a" />
      <Plant x={30} y={300} s={1.3} />

      {/* right shelf */}
      <Rect x={350} y={90} width={60} height={520} fill="#e7b072" />
      <Rect x={350} y={280} width={60} height={6} fill="#c98d4f" />
      <Rect x={350} y={450} width={60} height={6} fill="#c98d4f" />
      <Rect x={358} y={160} width={14} height={120} rx={3} fill="#c47fd0" />
      <Rect x={374} y={175} width={14} height={105} rx={3} fill="#79c6d9" />
      <Rect x={358} y={340} width={14} height={110} rx={3} fill="#ec6f9a" />
      <Rect x={374} y={350} width={14} height={100} rx={3} fill="#3f7fd6" />
      <Circle cx={380} cy={110} r={24} fill="#fff" opacity={0.9} />
      <Plant x={375} y={560} s={0.9} />

      {/* bottom decor */}
      <BookStack x={-10} y={700} />
      <Ellipse cx={230} cy={730} rx={200} ry={60} fill="#f6a8b8" />
      <Ellipse cx={230} cy={730} rx={160} ry={44} fill="#f9bfcb" />
      <Plant x={360} y={780} s={1.2} />
      <Plant x={20} y={800} s={1.4} />
    </Svg>
  </View>
);

/** Wooden hanging sign background */
export const WoodPlate = ({ children, style }: { children?: React.ReactNode; style?: any }) => (
  <View style={[artStyles.wood, style]}>{children}</View>
);

const artStyles = StyleSheet.create({
  wood: {
    backgroundColor: '#c97f3c',
    borderColor: '#8a4f1d',
    borderWidth: 3,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});