
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path } from 'react-native-svg';

export const THEME = {
  bg: '#A9CFEF',
  sign: '#8B4A17',
  pill: '#F6EEDB',
  navy: '#14285B',
  yellow: '#F7C93B',
  green: '#A4E321',
  red: '#EE4B55',
  brown: '#6B3F1D',
  paper: '#FFFFFF',
};

/* ---------- cozy room background (same as level 42) ---------- */
export const RoomBg = () => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '45%', backgroundColor: 'rgba(255,255,255,0.22)' }} />
    <View style={{ position: 'absolute', left: -4, top: '8%', width: 76, height: 170, backgroundColor: '#f0b878', borderWidth: 5, borderColor: '#e2a35e', borderRadius: 4, overflow: 'hidden' }}>
      <View style={{ flex: 1, backgroundColor: '#8fd3f6' }}>
        <View style={{ position: 'absolute', top: 24, left: 8, width: 44, height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.9)' }} />
        <View style={{ position: 'absolute', left: 6, bottom: -14, width: 44, height: 60, borderRadius: 30, backgroundColor: '#7bc65a' }} />
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 4, backgroundColor: '#e2a35e' }} />
    </View>
    <View style={{ position: 'absolute', right: '7%', top: '9%', width: 60, height: 68, backgroundColor: '#cfe6f3', borderWidth: 4, borderColor: '#8fc3d8' }}>
      <View style={{ alignSelf: 'center', marginTop: 12, width: 30, height: 30, borderRadius: 15, backgroundColor: '#f6a43c', borderWidth: 4, borderColor: '#f7c36a' }} />
    </View>
    <View style={{ position: 'absolute', right: 0, top: '40%', width: 54, height: '26%', backgroundColor: '#e0a85e', borderLeftWidth: 5, borderTopWidth: 5, borderColor: '#c98d4d' }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 6, borderBottomWidth: 5, borderColor: '#c98d4d' }}>
        <View style={{ width: 10, height: 38, backgroundColor: '#58a6c8', marginRight: 1 }} />
        <View style={{ width: 9, height: 44, backgroundColor: '#f2c14e', marginRight: 1 }} />
        <View style={{ width: 10, height: 36, backgroundColor: '#7b6bd0' }} />
      </View>
    </View>
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '28%', backgroundColor: '#e9b575' }} />
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: '28%', height: 12, backgroundColor: '#e8b8b0' }} />
  </View>
);

/* ---------- bunch of bananas (4 bananas hanging from one stem) ---------- */
// one banana, hanging down from a stem at the top (local box 40 x 70, stem pivot at 20,6)
const OneBanana = ({ angle }: { angle: number }) => (
  <G transform={`translate(30 4) rotate(${angle} 20 6)`}>
    <Path
      d="M14 8 C6 30 12 56 34 68 C39 70 41 65 37 62 C21 52 19 30 25 8 Z"
      fill="#FFD83A"
      stroke="#5A3A12"
      strokeWidth={2.4}
      strokeLinejoin="round"
    />
    <Path d="M17 16 C14 32 18 49 31 60" stroke="#FFF08A" strokeWidth={2.6} fill="none" strokeLinecap="round" />
    {/* dark tip */}
    <Path d="M34 68 C39 70 41 65 37 62 Z" fill="#5A3A12" />
  </G>
);

export const Banana = ({ w = 100, h = 84 }: { w?: number; h?: number }) => (
  <Svg width={w} height={h} viewBox="0 0 100 84">
    {/* back bananas first, front ones last */}
    <OneBanana angle={-42} />
    <OneBanana angle={42} />
    <OneBanana angle={-16} />
    <OneBanana angle={16} />
    {/* common stem / crown */}
    <Path
      d="M40 2 L60 2 C62 2 63 4 62 6 L58 16 C57 18 55 19 53 19 L47 19 C45 19 43 18 42 16 L38 6 C37 4 38 2 40 2 Z"
      fill="#7A5A1E"
      stroke="#5A3A12"
      strokeWidth={2.2}
      strokeLinejoin="round"
    />
  </Svg>
);

/* ---------- monkey (hungry / happy) ---------- */
export const Monkey = ({ w = 120, h = 130, happy = false }: { w?: number; h?: number; happy?: boolean }) => (
  <Svg width={w} height={h} viewBox="0 0 120 130">
    {/* tail */}
    <Path d="M92 112 C122 112 118 78 100 82" stroke="#7A4A22" strokeWidth={8} fill="none" strokeLinecap="round" />
    {/* body */}
    <Ellipse cx={60} cy={102} rx={30} ry={26} fill="#9A5E2E" stroke="#4A2A12" strokeWidth={2.5} />
    <Ellipse cx={60} cy={106} rx={18} ry={17} fill="#F1CF9E" />
    {/* ears */}
    <Circle cx={20} cy={46} r={14} fill="#9A5E2E" stroke="#4A2A12" strokeWidth={2.5} />
    <Circle cx={20} cy={46} r={7} fill="#F1CF9E" />
    <Circle cx={100} cy={46} r={14} fill="#9A5E2E" stroke="#4A2A12" strokeWidth={2.5} />
    <Circle cx={100} cy={46} r={7} fill="#F1CF9E" />
    {/* head */}
    <Circle cx={60} cy={48} r={36} fill="#9A5E2E" stroke="#4A2A12" strokeWidth={2.5} />
    {/* face */}
    <Path
      d="M60 30 C44 22 28 34 32 52 C34 68 48 74 60 74 C72 74 86 68 88 52 C92 34 76 22 60 30 Z"
      fill="#F1CF9E"
    />
    {/* eyes */}
    {happy ? (
      <G stroke="#2A1608" strokeWidth={3} fill="none" strokeLinecap="round">
        <Path d="M42 46 Q48 38 54 46" />
        <Path d="M66 46 Q72 38 78 46" />
      </G>
    ) : (
      <G>
        <Circle cx={48} cy={46} r={5} fill="#2A1608" />
        <Circle cx={72} cy={46} r={5} fill="#2A1608" />
        <Circle cx={50} cy={44} r={1.6} fill="#fff" />
        <Circle cx={74} cy={44} r={1.6} fill="#fff" />
      </G>
    )}
    {/* nose */}
    <Ellipse cx={55} cy={56} rx={1.8} ry={2.4} fill="#4A2A12" />
    <Ellipse cx={65} cy={56} rx={1.8} ry={2.4} fill="#4A2A12" />
    {/* mouth */}
    {happy ? (
      <Path d="M48 62 Q60 76 72 62 Z" fill="#B3363A" stroke="#4A2A12" strokeWidth={2} strokeLinejoin="round" />
    ) : (
      <Path d="M50 68 Q60 60 70 68" stroke="#4A2A12" strokeWidth={3} fill="none" strokeLinecap="round" />
    )}
    {/* arms */}
    <Path d="M34 90 C22 100 24 116 34 118" stroke="#9A5E2E" strokeWidth={9} fill="none" strokeLinecap="round" />
    <Path d="M86 90 C98 100 96 116 86 118" stroke="#9A5E2E" strokeWidth={9} fill="none" strokeLinecap="round" />
  </Svg>
);

/* ---------- barbed wire (stays in the middle, never changes) ---------- */
export const BarbedWire = ({ w = 320, h = 76 }: { w?: number; h?: number }) => {
  const { d, barbs } = useMemo(() => {
    const loops = 9;
    const T = Math.PI * 2 * loops;
    const steps = 360;
    const amp = h * 0.34;
    const cy = h / 2;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (T * i) / steps;
      const x = 6 + ((w - 12) * t) / T - amp * 0.55 * Math.sin(t);
      const y = cy - amp * Math.cos(t);
      pts.push({ x, y });
    }
    const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const b: { x: number; y: number }[] = [];
    for (let i = 20; i < steps; i += 30) b.push(pts[i]);
    return { d: path, barbs: b };
  }, [w, h]);

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Path d={d} stroke="#111" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {barbs.map((p, i) => (
        <G key={i} stroke="#111" strokeWidth={2.4} strokeLinecap="round">
          <Line x1={p.x - 5} y1={p.y - 5} x2={p.x + 5} y2={p.y + 5} />
          <Line x1={p.x - 5} y1={p.y + 5} x2={p.x + 5} y2={p.y - 5} />
        </G>
      ))}
    </Svg>
  );
};