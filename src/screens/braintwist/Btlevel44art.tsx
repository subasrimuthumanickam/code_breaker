
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Ellipse, Circle, Line, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

export const COLORS = {
  paper: '#fdfdfb',
  line: '#c7d3e3',
  ink: '#2b2b2b',
  yellow: '#f6dc6a',
  red: '#e0141e',
  cream: '#f8ecd9',
  brown: '#7a4a24',
  signBrown: '#b9672a',
  signDark: '#8a4a1b',
  orange: '#f5a21c',
};

/** Kids room: sky wall, window, shelf with toys, plant, wooden floor (like Level 3 theme) */
export const RoomBackground: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const fy = height * 0.74; // floor line
  const planks = [];
  for (let i = 1; i < 7; i++) {
    planks.push(
      <Line
        key={i}
        x1={(width / 7) * i}
        y1={fy}
        x2={(width / 7) * i + (i - 3.5) * 18}
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

      {/* window */}
      <Rect x={-10} y={120} width={118} height={150} fill="#bfe4fb" stroke="#f6f1e6" strokeWidth={6} />
      <Circle cx={78} cy={158} r={22} fill="#ffd36b" />
      <Ellipse cx={46} cy={208} rx={30} ry={11} fill="#fff" />
      <Ellipse cx={70} cy={198} rx={22} ry={12} fill="#fff" />

      {/* shelf */}
      <Rect x={width - 76} y={fy - 200} width={90} height={200} fill="#dfa05c" />
      <Line x1={width - 76} x2={width} y1={fy - 135} y2={fy - 135} stroke="#b9742f" strokeWidth={5} />
      <Line x1={width - 76} x2={width} y1={fy - 70} y2={fy - 70} stroke="#b9742f" strokeWidth={5} />
      <Rect x={width - 68} y={fy - 178} width={11} height={40} fill="#8a6bd6" />
      <Rect x={width - 54} y={fy - 170} width={11} height={32} fill="#e0627a" />
      <Rect x={width - 40} y={fy - 176} width={11} height={38} fill="#4aa3df" />
      <Circle cx={width - 42} cy={fy - 100} r={16} fill="#d9985a" />
      <Circle cx={width - 55} cy={fy - 114} r={6} fill="#d9985a" />
      <Circle cx={width - 29} cy={fy - 114} r={6} fill="#d9985a" />
      <Rect x={width - 66} y={fy - 62} width={50} height={20} fill="#4aa3df" />

      {/* floor */}
      <Rect x={0} y={fy} width={width} height={height - fy} fill="#f2b774" />
      <Rect x={0} y={fy - 14} width={width} height={14} fill="#f3b9b9" />
      {planks}

      {/* plant */}
      <Ellipse cx={10} cy={fy - 14} rx={34} ry={50} fill="#6dbf4a" />
      <Ellipse cx={44} cy={fy + 6} rx={26} ry={30} fill="#5aae3f" />
    </Svg>
  );
};

/** Wooden hanging sign: "< LEVEL 44 >" */
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

/** White notebook paper card with blue lines that holds the apples + bowl */
export const PaperCard: React.FC<{ width: number; height: number; children?: React.ReactNode }> = ({
  width,
  height,
  children,
}) => {
  const lines = [];
  for (let y = 60; y < height - 8; y += 36) {
    lines.push(<Line key={y} x1={12} x2={width - 12} y1={y} y2={y} stroke={COLORS.line} strokeWidth={1.5} />);
  }
  return (
    <View
      style={{
        width, height, backgroundColor: COLORS.paper, borderRadius: 18, borderWidth: 3,
        borderColor: '#e9e4d6', overflow: 'hidden', alignSelf: 'center',
      }}
    >
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>{lines}</Svg>
      {children}
    </View>
  );
};

/** Dark bowl with shadow */
export const Bowl: React.FC<{ width?: number }> = ({ width = 170 }) => {
  const h = width * 0.42;
  return (
    <Svg width={width} height={h} viewBox="0 0 170 72">
      <Ellipse cx={85} cy={58} rx={82} ry={11} fill="#d8d8d8" />
      <Path d="M8 22 C12 52 50 60 85 60 C120 60 158 52 162 22 Z" fill="#3c4750" />
      <Ellipse cx={85} cy={20} rx={78} ry={15} fill="#2c353d" />
      <Ellipse cx={85} cy={20} rx={70} ry={11} fill="#4a5660" />
    </Svg>
  );
};

/** Cartoon apple */
export const Apple: React.FC<{ size?: number }> = ({ size = 58 }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Path
      d="M30 17 C22 9 6 14 6 32 C6 47 17 57 26 55 C28 54 32 54 34 55 C43 57 54 47 54 32 C54 14 38 9 30 17 Z"
      fill={COLORS.red}
      stroke="#111"
      strokeWidth={1.6}
    />
    <Path d="M16 24 C14 30 15 36 18 40" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" fill="none" />
    <Path d="M31 16 C33 9 36 6 38 4" stroke="#6b3b12" strokeWidth={2.4} strokeLinecap="round" fill="none" />
    <Path d="M33 13 C38 4 48 4 54 9 C48 17 40 18 33 13 Z" fill="#59b34a" stroke="#1d5a1d" strokeWidth={1.4} />
  </Svg>
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

/** Round bottom button with ring + brown cost pill below (like Level 3) */
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
  roundOuter: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center' },
  roundInner: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  costPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.brown, borderRadius: 13,
    paddingHorizontal: 9, paddingVertical: 3, marginTop: 6,
  },
  costText: { color: '#fff', fontWeight: '800', fontSize: 13, marginLeft: 4 },
});
