// Btlevel50art.tsx — room theme, notebook paper, bulbs and switches
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop,
} from 'react-native-svg';

export const COLORS = {
  navy: '#1B2F6E',
  paper: '#FBF6E9',
  paperLine: '#DCE8EE',
  hole: '#8EC8EE',
  cream: '#F7EEDC',
  yellow: '#FFD966',
  glow: '#FFE45C',
  green: '#9ACD32',
  greenRing: '#C9EA7A',
  red: '#EF4452',
  mat: '#F5E9D3',
  matBorder: '#BBD3E8',
  brown: '#8A5A2B',
  leaf: '#7CC043',
};

export function RoomBackground({ width: w, height: h }: { width: number; height: number }) {
  const floorY = h * 0.78;
  return (
    <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="sky50" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#9ED4F7" />
          <Stop offset="1" stopColor="#D5EEFB" />
        </LinearGradient>
        <LinearGradient id="floor50" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F2B97A" />
          <Stop offset="1" stopColor="#E89F58" />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={w} height={floorY} fill="url(#sky50)" />
      {/* window + plants */}
      <Rect x={-10} y={h * 0.1} width={w * 0.2} height={h * 0.3} fill="#BFE6FB" stroke="#F4B66A" strokeWidth={6} />
      <Circle cx={w * 0.1} cy={h * 0.46} r={30} fill="#6CC04A" />
      <Circle cx={w * 0.03} cy={h * 0.5} r={26} fill="#59B23E" />
      {/* sun + cloud (top right) */}
      <Circle cx={w * 0.93} cy={h * 0.1} r={34} fill="#FFD84A" opacity={0.95} />
      <Circle cx={w * 0.86} cy={h * 0.14} r={16} fill="#fff" />
      <Circle cx={w * 0.9} cy={h * 0.15} r={14} fill="#fff" />
      {/* shelf (right) */}
      <Rect x={w * 0.9} y={h * 0.42} width={w * 0.12} height={h * 0.34} fill="#E3A55F" />
      <Rect x={w * 0.92} y={h * 0.38} width={10} height={44} fill="#8E7CD8" />
      <Rect x={w * 0.95} y={h * 0.4} width={10} height={38} fill="#4FB3E8" />
      <Rect x={w * 0.92} y={h * 0.53} width={30} height={26} rx={12} fill="#B9763A" />
      {/* skirting + floor */}
      <Rect x={0} y={floorY - 12} width={w} height={12} fill="#F0C3C3" />
      <Rect x={0} y={floorY} width={w} height={h - floorY} fill="url(#floor50)" />
      {[0.15, 0.38, 0.62, 0.86].map((p, i) => (
        <Path key={i} d={`M ${w * p} ${floorY} L ${w * (p - 0.1)} ${h}`} stroke="#D98A45" strokeWidth={2} opacity={0.45} />
      ))}
      {/* books stack + toy car (left) */}
      <G x={-6} y={floorY - 76}>
        <Rect x={0} y={0} width={86} height={16} rx={3} fill="#3F9AD6" />
        <Rect x={-4} y={17} width={94} height={16} rx={3} fill="#E86FAE" />
        <Rect x={0} y={34} width={90} height={16} rx={3} fill="#F2C14E" />
        <Rect x={0} y={51} width={82} height={14} rx={3} fill="#4B7FC4" />
      </G>
      <G x={4} y={floorY - 8}>
        <Rect x={0} y={14} width={64} height={24} rx={10} fill="#3AA0E0" />
        <Rect x={16} y={2} width={28} height={16} rx={8} fill="#7CC7F0" />
        <Circle cx={14} cy={40} r={8} fill="#2D4A6B" />
        <Circle cx={50} cy={40} r={8} fill="#2D4A6B" />
      </G>
      {/* foreground bushes */}
      <Circle cx={w - 20} cy={h - 10} r={46} fill="#5DC043" />
      <Circle cx={-6} cy={h - 4} r={44} fill="#5DC043" />
    </Svg>
  );
}

/** hanging wooden LEVEL sign */
export function LevelSign({ level }: { level: number }) {
  return (
    <View style={s.signWrap}>
      <View style={[s.string, { left: 22, transform: [{ rotate: '12deg' }] }]} />
      <View style={[s.string, { right: 22, transform: [{ rotate: '-12deg' }] }]} />
      <View style={s.sign}>
        <View style={[s.leaf, { left: -8, transform: [{ rotate: '-30deg' }] }]} />
        <View style={[s.leaf, { right: -8, transform: [{ rotate: '30deg' }] }]} />
        <Text style={s.arrow}>‹</Text>
        <Text style={s.signText}>LEVEL {level}</Text>
        <Text style={s.arrow}>›</Text>
      </View>
    </View>
  );
}

/** Notebook paper card with spiral holes + ruled lines */
export function Notebook({ children, style }: { children?: React.ReactNode; style?: any }) {
  return (
    <View style={[s.paper, style]}>
      <View style={s.holes}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={i} style={s.hole} />
        ))}
      </View>
      {Array.from({ length: 16 }).map((_, i) => (
        <View key={i} style={[s.line, { top: 46 + i * 34 }]} />
      ))}
      {children}
    </View>
  );
}

/** Light bulb (outline when off, yellow + glow when on) */
export function Bulb({ on, size = 80 }: { on: boolean; size?: number }) {
  const h = size * 1.4;
  return (
    <Svg width={size} height={h} viewBox="0 0 100 140">
      {on && (
        <G>
          <Circle cx={50} cy={52} r={52} fill={COLORS.glow} opacity={0.35} />
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => (
            <Line
              key={a}
              x1={50 + 56 * Math.cos((a * Math.PI) / 180)}
              y1={52 + 56 * Math.sin((a * Math.PI) / 180)}
              x2={50 + 68 * Math.cos((a * Math.PI) / 180)}
              y2={52 + 68 * Math.sin((a * Math.PI) / 180)}
              stroke="#F5B800"
              strokeWidth={4}
              strokeLinecap="round"
            />
          ))}
        </G>
      )}
      <Path
        d="M50 6 C22 6 8 28 8 50 C8 68 20 78 28 90 L28 98 L72 98 L72 90 C80 78 92 68 92 50 C92 28 78 6 50 6 Z"
        fill={on ? COLORS.glow : '#FFFFFF'}
        stroke="#1A1A1A"
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <Path
        d="M38 98 L38 66 C30 58 34 50 42 56 L50 64 L58 56 C66 50 70 58 62 66 L62 98"
        fill="none"
        stroke={on ? '#E08A00' : '#1A1A1A'}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Rect x={28} y={98} width={44} height={9} rx={4} fill={on ? '#F2F2F2' : '#fff'} stroke="#1A1A1A" strokeWidth={3} />
      <Rect x={30} y={109} width={40} height={9} rx={4} fill={on ? '#F2F2F2' : '#fff'} stroke="#1A1A1A" strokeWidth={3} />
      <Rect x={34} y={120} width={32} height={9} rx={4} fill={on ? '#F2F2F2' : '#fff'} stroke="#1A1A1A" strokeWidth={3} />
    </Svg>
  );
}

/** Wall switch plate */
export function WallSwitch({ on, onPress, size = 66 }: { on: boolean; onPress: () => void; size?: number }) {
  return (
    <Pressable onPress={onPress} style={[s.plate, { width: size, height: size * 0.82 }]}>
      <View style={[s.rockerSlot, { width: size * 0.38, height: size * 0.56 }]}>
        <View
          style={[
            s.rocker,
            { backgroundColor: on ? '#7BD34A' : '#F2F2F2', top: on ? 2 : undefined, bottom: on ? undefined : 2 },
          ]}
        />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  signWrap: { alignItems: 'center', paddingTop: 12 },
  string: { position: 'absolute', top: -2, width: 2, height: 18, backgroundColor: '#9A6A3A' },
  sign: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#A8601F', borderColor: '#D98B3D',
    borderWidth: 3, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, elevation: 5,
  },
  leaf: { position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: COLORS.leaf },
  signText: { color: '#fff', fontWeight: '900', fontSize: 20, marginHorizontal: 6 },
  arrow: { color: '#FFC83D', fontSize: 24, fontWeight: '900', marginTop: -3 },
  paper: {
    backgroundColor: COLORS.paper, borderRadius: 8, borderWidth: 2, borderColor: '#EADFC6',
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
  },
  holes: { flexDirection: 'row', justifyContent: 'space-around', marginTop: -4, paddingHorizontal: 6 },
  hole: { width: 12, height: 18, borderRadius: 6, backgroundColor: COLORS.hole },
  line: { position: 'absolute', left: 8, right: 8, height: 1.5, backgroundColor: COLORS.paperLine },
  plate: {
    backgroundColor: '#A9A9AD', borderRadius: 6, borderWidth: 2, borderColor: '#6E6E73',
    alignItems: 'center', justifyContent: 'center', elevation: 3,
  },
  rockerSlot: { backgroundColor: '#7A7A80', borderRadius: 7, borderWidth: 2, borderColor: '#5A5A60' },
  rocker: { position: 'absolute', left: 2, right: 2, height: '52%', borderRadius: 5, borderWidth: 1.5, borderColor: '#555' },
});
