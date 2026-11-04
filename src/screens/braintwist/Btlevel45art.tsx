import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Ellipse, Circle, Line, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

export const COLORS = {
  cream: '#fbeedd',
  cardBorder: '#a9d6f5',
  cardLine: '#cfe6f3',
  prompt: '#1d3f8f',
  yellow: '#f6dc6a',
  brown: '#7a4a24',
  signBrown: '#b9672a',
  signDark: '#8a4a1b',
  orange: '#f5a21c',
};

/** Kids room: sky wall, wooden window, sun, bookshelf, bushes, wooden floor */
export const RoomBackground: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const fy = height - 160; // floor line (sits behind the bottom bar)
  const planks = [];
  for (let i = 1; i < 8; i++) {
    planks.push(
      <Line
        key={i}
        x1={(width / 8) * i}
        y1={fy}
        x2={(width / 8) * i + (i - 4) * 22}
        y2={height}
        stroke="#e29d57"
        strokeWidth={2}
      />
    );
  }
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8ccaf3" />
          <Stop offset="1" stopColor="#d3ebfb" />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#sky)" />

      {/* sun + clouds */}
      <Circle cx={width - 26} cy={110} r={46} fill="#fbe98a" />
      <Circle cx={width - 26} cy={110} r={34} fill="#ffcf40" />
      <Ellipse cx={width - 60} cy={150} rx={34} ry={14} fill="#fff" />
      <Ellipse cx={90} cy={78} rx={36} ry={13} fill="#fff" />
      <Ellipse cx={70} cy={86} rx={26} ry={11} fill="#fff" />

      {/* window with wooden frame */}
      <Rect x={-10} y={130} width={110} height={170} fill="#bfe4fb" />
      <Rect x={-10} y={130} width={110} height={170} fill="none" stroke="#f0a050" strokeWidth={7} />
      <Line x1={45} y1={130} x2={45} y2={300} stroke="#f0a050" strokeWidth={6} />
      <Line x1={-10} y1={210} x2={100} y2={210} stroke="#f0a050" strokeWidth={6} />

      {/* bookshelf with books + pencil cup (right) */}
      <Rect x={width - 74} y={fy - 190} width={90} height={190} fill="#f0a868" />
      <Line x1={width - 74} x2={width} y1={fy - 120} y2={fy - 120} stroke="#d98a45" strokeWidth={6} />
      <Rect x={width - 68} y={fy - 170} width={11} height={44} fill="#8a6bd6" />
      <Rect x={width - 54} y={fy - 162} width={11} height={38} fill="#e0627a" />
      <Rect x={width - 40} y={fy - 168} width={11} height={42} fill="#8a7a6a" />
      <Rect x={width - 26} y={fy - 160} width={11} height={36} fill="#4aa3df" />
      <Rect x={width - 52} y={fy - 100} width={26} height={36} fill="#ffd21f" />
      <Line x1={width - 46} y1={fy - 100} x2={width - 52} y2={fy - 126} stroke="#e0627a" strokeWidth={4} />
      <Line x1={width - 38} y1={fy - 100} x2={width - 36} y2={fy - 128} stroke="#4aa3df" strokeWidth={4} />

      {/* floor */}
      <Rect x={0} y={fy} width={width} height={height - fy} fill="#f2b774" />
      <Rect x={0} y={fy - 14} width={width} height={14} fill="#f6bdbd" />
      {planks}

      {/* bushes */}
      <Ellipse cx={4} cy={fy - 6} rx={40} ry={56} fill="#6dbf4a" />
      <Ellipse cx={46} cy={fy + 8} rx={30} ry={34} fill="#5aae3f" />
      <Ellipse cx={width - 6} cy={height - 20} rx={46} ry={60} fill="#6dbf4a" />
      <Ellipse cx={width - 52} cy={height - 6} rx={30} ry={30} fill="#5aae3f" />
    </Svg>
  );
};

/** Wooden hanging sign: "‹ LEVEL 45 ›" */
export const WoodSign: React.FC<{ text: string }> = ({ text }) => (
  <View style={{ alignItems: 'center' }}>
    <View style={{ flexDirection: 'row', width: 150, justifyContent: 'space-between' }}>
      <View style={styles.string} />
      <View style={styles.string} />
    </View>
    <View style={styles.sign}>
      <View style={[styles.leaf, { left: -10, top: -8 }]} />
      <View style={[styles.leaf, { right: -10, top: -8 }]} />
      <Text style={styles.signText}>
        <Text style={styles.signArrow}>{'‹ '}</Text>
        {text}
        <Text style={styles.signArrow}>{' ›'}</Text>
      </Text>
    </View>
  </View>
);

/** Cream notebook board with a light-blue outer border and blue lines */
export const BoardCard: React.FC<{ width: number; height: number; children?: React.ReactNode }> = ({
  width,
  height,
  children,
}) => {
  const innerW = width - 16;
  const innerH = height - 16;
  const lines = [];
  for (let y = 64; y < innerH - 12; y += 52) {
    lines.push(<Line key={y} x1={18} x2={innerW - 18} y1={y} y2={y} stroke={COLORS.cardLine} strokeWidth={1.5} />);
  }
  return (
    <View
      style={{
        width, height, borderRadius: 40, backgroundColor: COLORS.cardBorder, padding: 8, alignSelf: 'center',
      }}
    >
      <View style={{ flex: 1, borderRadius: 32, backgroundColor: COLORS.cream, overflow: 'hidden' }}>
        <Svg width={innerW} height={innerH} style={StyleSheet.absoluteFill}>{lines}</Svg>
        {children}
      </View>
    </View>
  );
};

/** Glossy round colour button with a label (the label may lie about the colour!) */
export const GlossyOption: React.FC<{
  label: string;
  color: string;
  state?: 'ok' | 'bad' | null;
  disabled?: boolean;
  onPress?: () => void;
}> = ({ label, color, state, disabled, onPress }) => (
  <View
    style={[
      styles.optHalo,
      state === 'ok' && { backgroundColor: 'rgba(46,204,64,0.55)' },
      state === 'bad' && { backgroundColor: 'rgba(224,49,49,0.5)' },
    ]}
  >
    <TouchableOpacity activeOpacity={0.85} disabled={disabled} onPress={onPress} style={styles.optRing}>
      <View style={[styles.optInner, { backgroundColor: color }]}>
        <View style={styles.gloss} />
        <Text style={styles.optLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  </View>
);

export const SearchIcon: React.FC = () => (
  <Svg width={30} height={30} viewBox="0 0 28 28">
    <Circle cx={12} cy={12} r={7.5} stroke="#222" strokeWidth={3} fill="none" />
    <Line x1={17.5} y1={17.5} x2={24} y2={24} stroke="#222" strokeWidth={3.5} strokeLinecap="round" />
  </Svg>
);

export const SkipIcon: React.FC = () => (
  <Svg width={30} height={30} viewBox="0 0 28 28">
    <Path d="M5 5 L19 14 L5 23 Z" fill="#222" />
    <Rect x={21} y={5} width={3.5} height={18} rx={1.5} fill="#222" />
  </Svg>
);

export const HeaderCircle: React.FC<{ label: string; onPress?: () => void }> = ({ label, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.circle}>
    <Text style={styles.circleText}>{label}</Text>
  </TouchableOpacity>
);

export const HintPill: React.FC<{ count: number }> = ({ count }) => (
  <View style={styles.pill}>
    <Text style={styles.pillText}>{count}</Text>
    <Text style={{ fontSize: 18 }}>💡</Text>
  </View>
);

/** Round bottom button with ring + brown cost pill below */
export const RoundButton: React.FC<{
  children: React.ReactNode;
  bg: string;
  ring?: string;
  cost?: string;
  costIcon?: string;
  onPress?: () => void;
}> = ({ children, bg, ring = '#fff', cost, costIcon = '💡', onPress }) => (
  <View style={{ alignItems: 'center', width: 72 }}>
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.roundOuter, { backgroundColor: ring }]}
    >
      <View style={[styles.roundInner, { backgroundColor: bg }]}>{children}</View>
    </TouchableOpacity>
    {cost ? (
      <View style={styles.costPill}>
        <Text style={{ fontSize: 12 }}>{costIcon}</Text>
        <Text style={styles.costText}>{cost}</Text>
      </View>
    ) : (
      <View style={{ height: 25, marginTop: 6 }} />
    )}
  </View>
);

const styles = StyleSheet.create({
  circle: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.yellow,
    borderWidth: 2, borderColor: '#222', alignItems: 'center', justifyContent: 'center', marginRight: 6,
  },
  circleText: { fontSize: 14, fontWeight: '700', color: '#222' },
  pill: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#222',
    borderRadius: 16, paddingHorizontal: 10, height: 28, backgroundColor: '#fff',
  },
  pillText: { fontWeight: '800', marginRight: 4, color: '#222' },
  string: { width: 3, height: 14, backgroundColor: '#6b4a2b' },
  sign: {
    backgroundColor: COLORS.signBrown, borderRadius: 10, borderWidth: 3, borderColor: COLORS.signDark,
    paddingHorizontal: 22, paddingVertical: 6,
  },
  signText: { color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: 1 },
  signArrow: { color: COLORS.orange },
  leaf: {
    position: 'absolute', width: 22, height: 12, borderRadius: 8, backgroundColor: '#6dbf4a',
    transform: [{ rotate: '-30deg' }],
  },
  optHalo: {
    width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  optRing: {
    width: 84, height: 84, borderRadius: 42, borderWidth: 4, borderColor: '#111',
    overflow: 'hidden',
  },
  optInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gloss: {
    position: 'absolute', top: 6, left: 14, width: 36, height: 18, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.45)', transform: [{ rotate: '-18deg' }],
  },
  optLabel: { fontSize: 14, fontWeight: '900', color: '#111' },
  roundOuter: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center' },
  roundInner: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  costPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.brown, borderRadius: 13,
    paddingHorizontal: 9, paddingVertical: 3, marginTop: 6,
  },
  costText: { color: '#fff', fontWeight: '800', fontSize: 13, marginLeft: 4 },
});
