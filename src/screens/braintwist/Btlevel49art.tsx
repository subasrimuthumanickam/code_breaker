
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

export const COLORS = {
  navy: '#1B2F6E',
  cream: '#F7EEDC',
  creamBorder: '#EAD9B8',
  wood: '#B8703A',
  woodDark: '#8A4F24',
  leaf: '#7CC043',
  yellow: '#FFD966',
  yellowDark: '#E0A82E',
  green: '#9ACD32',
  greenRing: '#C9EA7A',
  red: '#EF4452',
  mat: '#F5E9D3',
  matBorder: '#BBD3E8',
  brown: '#8A5A2B',
  keyBorder: '#D8C7A0',
};

export function RoomBackground({ width: w, height: h }: { width: number; height: number }) {
  const floorY = h * 0.78;
  return (
    <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#BFE3FA" />
          <Stop offset="1" stopColor="#E3F3FC" />
        </LinearGradient>
        <LinearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F2B97A" />
          <Stop offset="1" stopColor="#E89F58" />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={w} height={floorY} fill="url(#sky)" />
      {/* window */}
      <Rect x={-10} y={h * 0.1} width={w * 0.24} height={h * 0.26} fill="#CDEBFB" stroke="#F4D9A8" strokeWidth={6} />
      <Circle cx={w * 0.14} cy={h * 0.17} r={22} fill="#FFE18A" />
      <Circle cx={w * 0.08} cy={h * 0.23} r={14} fill="#fff" opacity={0.9} />
      {/* shelf on the right */}
      <Rect x={w * 0.9} y={h * 0.3} width={w * 0.12} height={h * 0.46} fill="#E3A55F" />
      <Rect x={w * 0.92} y={h * 0.33} width={10} height={44} fill="#8E7CD8" />
      <Rect x={w * 0.95} y={h * 0.36} width={10} height={38} fill="#4FB3E8" />
      <Rect x={w * 0.92} y={h * 0.5} width={34} height={30} rx={14} fill="#B9763A" />
      {/* skirting + floor */}
      <Rect x={0} y={floorY - 12} width={w} height={12} fill="#F0C3C3" />
      <Rect x={0} y={floorY} width={w} height={h - floorY} fill="url(#floor)" />
      {[0.15, 0.38, 0.62, 0.86].map((p, i) => (
        <Path key={i} d={`M ${w * p} ${floorY} L ${w * (p - 0.1)} ${h}`} stroke="#D98A45" strokeWidth={2} opacity={0.45} />
      ))}
      {/* books stack (left) */}
      <G x={-6} y={floorY - 74}>
        <Rect x={0} y={0} width={86} height={16} rx={3} fill="#3F9AD6" />
        <Rect x={-4} y={17} width={94} height={16} rx={3} fill="#E86FAE" />
        <Rect x={0} y={34} width={90} height={16} rx={3} fill="#F2C14E" />
        <Rect x={0} y={51} width={82} height={14} rx={3} fill="#4B7FC4" />
      </G>
      {/* toy car */}
      <G x={4} y={floorY - 6}>
        <Rect x={0} y={14} width={64} height={24} rx={10} fill="#3AA0E0" />
        <Rect x={16} y={2} width={28} height={16} rx={8} fill="#7CC7F0" />
        <Circle cx={14} cy={40} r={8} fill="#2D4A6B" />
        <Circle cx={50} cy={40} r={8} fill="#2D4A6B" />
      </G>
      {/* pencil cup */}
      <Rect x={w - 52} y={floorY - 14} width={40} height={54} rx={6} fill="#F5C63A" stroke="#E0A81F" strokeWidth={2} />
    </Svg>
  );
}

/** Pyramid of T's (rows = [1,3,5]); u = size scale */
export function TPicture({ rows, u = 1 }: { rows: number[]; u?: number }) {
  const sizes = [70, 58, 46].map((x) => x * u);
  return (
    <View style={[s.card, { paddingVertical: 8 * u }]}>
      {rows.map((count, r) => (
        <View key={r} style={s.row}>
          {Array.from({ length: count }).map((_, i) => (
            <Text
              key={i}
              style={[s.t, { fontSize: sizes[r] ?? 46 * u, lineHeight: (sizes[r] ?? 46 * u) * 1.08, marginHorizontal: (r === 0 ? 0 : r === 1 ? 12 : 7) * u }]}
            >
              T
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

/** hanging wooden LEVEL sign like Level 3 */
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

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cream,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#2A2A3C',
    paddingHorizontal: 8,
    alignItems: 'center',
    alignSelf: 'center',
    width: '86%',
  },
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  t: { color: COLORS.navy, fontWeight: '900', fontFamily: 'serif' },
  signWrap: { alignItems: 'center', paddingTop: 12 },
  string: { position: 'absolute', top: -2, width: 2, height: 18, backgroundColor: '#9A6A3A' },
  sign: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A8601F',
    borderColor: '#D98B3D',
    borderWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 5,
  },
  leaf: { position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: COLORS.leaf },
  signText: { color: '#fff', fontWeight: '900', fontSize: 20, marginHorizontal: 6 },
  arrow: { color: '#FFC83D', fontSize: 24, fontWeight: '900', marginTop: -3 },
});
