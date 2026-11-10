
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Rect, Circle, Ellipse, Path, Line, Text as SvgText } from 'react-native-svg';

const PURPLE = '#2b2a6b';

/* ---------- the six pictures: can, you, be, ready, at, five ---------- */
// every picture is drawn in a 100 x 100 box and scaled to size s

type P = { s: number };

// 1. red soda can  ->  "can"
const CanArt = ({ s }: P) => (
  <Svg width={s} height={s} viewBox="0 0 100 100">
    <Rect x={28} y={16} width={44} height={70} rx={8} fill="#d8333a" />
    <Rect x={34} y={22} width={6} height={58} rx={3} fill="#f3777c" opacity={0.75} />
    <Rect x={28} y={12} width={44} height={11} rx={4} fill="#d3d9de" stroke="#8d97a0" strokeWidth={2} />
    <Rect x={28} y={79} width={44} height={9} rx={4} fill="#d3d9de" stroke="#8d97a0" strokeWidth={2} />
    <Ellipse cx={52} cy={15} rx={12} ry={2.5} fill="#eef1f3" />
  </Svg>
);

// 2. the letter U  ->  "you"
const YouArt = ({ s }: P) => (
  <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: s * 0.85, fontWeight: '900', color: PURPLE, includeFontPadding: false, lineHeight: s }}>U</Text>
  </View>
);

// 3. smiling bee  ->  "be"
const BeeArt = ({ s }: P) => (
  <Svg width={s} height={s} viewBox="0 0 100 100">
    <Ellipse cx={26} cy={42} rx={15} ry={11} fill="#e4f3ff" stroke="#7bb3e0" strokeWidth={2.5} rotation={-25} origin="26, 42" />
    <Ellipse cx={74} cy={42} rx={15} ry={11} fill="#e4f3ff" stroke="#7bb3e0" strokeWidth={2.5} rotation={25} origin="74, 42" />
    <Ellipse cx={50} cy={62} rx={24} ry={27} fill="#ffd23f" stroke="#5a3d00" strokeWidth={3} />
    <Path d="M28 62 Q50 70 72 62" stroke="#3b2b00" strokeWidth={7} fill="none" />
    <Path d="M30 76 Q50 84 70 76" stroke="#3b2b00" strokeWidth={7} fill="none" />
    <Circle cx={50} cy={40} r={19} fill="#ffd23f" stroke="#5a3d00" strokeWidth={3} />
    <Path d="M42 24 Q38 12 32 14" stroke="#3b2b00" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    <Path d="M58 24 Q62 12 68 14" stroke="#3b2b00" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    <Circle cx={31} cy={14} r={3} fill="#3b2b00" />
    <Circle cx={69} cy={14} r={3} fill="#3b2b00" />
    <Circle cx={43} cy={40} r={3.5} fill="#2b2f36" />
    <Circle cx={57} cy={40} r={3.5} fill="#2b2f36" />
    <Path d="M43 49 Q50 55 57 49" stroke="#2b2f36" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    <Circle cx={37} cy={47} r={3} fill="#ff9a8a" opacity={0.7} />
    <Circle cx={63} cy={47} r={3} fill="#ff9a8a" opacity={0.7} />
  </Svg>
);

// 4. runner crouched on the starting blocks ("set" position)  ->  "ready"
const ReadyArt = ({ s }: P) => (
  <Svg width={s} height={s} viewBox="0 0 100 100">
    {/* track line */}
    <Line x1={2} y1={90} x2={98} y2={90} stroke="#c9792b" strokeWidth={3} strokeLinecap="round" />

    {/* starting blocks: base bar + two wedges */}
    <Rect x={4} y={86} width={56} height={4} rx={2} fill="#1b6fa3" />
    <Path d="M6 86 L18 86 L16 76 Z" fill="#2fa0e0" stroke="#1b6fa3" strokeWidth={1.5} strokeLinejoin="round" />
    <Path d="M38 86 L54 86 L52 70 Z" fill="#2fa0e0" stroke="#1b6fa3" strokeWidth={1.5} strokeLinejoin="round" />

    {/* back leg: hip -> knee (low) -> foot on back block */}
    <Path d="M36 50 L24 74 L12 82" stroke="#f2b48c" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Circle cx={12} cy={82} r={4.5} fill="#e8453c" />

    {/* front leg: hip -> knee (bent high) -> foot on front block */}
    <Path d="M36 50 L56 64 L47 82" stroke="#f2b48c" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Circle cx={47} cy={82} r={4.5} fill="#e8453c" />

    {/* torso (hips raised, leaning forward) */}
    <Path d="M34 48 L62 40" stroke="#2b6fd6" strokeWidth={15} strokeLinecap="round" />
    {/* shorts */}
    <Path d="M32 50 L42 54" stroke="#2fa86f" strokeWidth={13} strokeLinecap="round" />

    {/* arms straight down to the track */}
    <Path d="M62 44 L68 84" stroke="#f2b48c" strokeWidth={6.5} strokeLinecap="round" />
    <Circle cx={68} cy={85} r={3.5} fill="#f2b48c" />

    {/* head looking down the track */}
    <Circle cx={73} cy={34} r={9} fill="#f2b48c" />
    <Path d="M64 32 Q70 22 82 29 Q76 26 64 32 Z" fill="#3b2b00" />
    <Circle cx={77} cy={36} r={1.6} fill="#2b2f36" />
  </Svg>
);

// 5. @  ->  "at"
const AtArt = ({ s }: P) => (
  <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: s * 0.95, fontWeight: '900', color: PURPLE, includeFontPadding: false, lineHeight: s }}>@</Text>
  </View>
);

// 6. clock that shows five o'clock  ->  "five"
const FiveArt = ({ s }: P) => (
  <Svg width={s} height={s} viewBox="0 0 100 100">
    <Circle cx={50} cy={50} r={44} fill="#ffffff" stroke="#e8dcc0" strokeWidth={5} />
    <SvgText x={50} y={24} fontSize={11} fontWeight="bold" fill={PURPLE} textAnchor="middle">12</SvgText>
    <SvgText x={80} y={54} fontSize={11} fontWeight="bold" fill={PURPLE} textAnchor="middle">3</SvgText>
    <SvgText x={50} y={84} fontSize={11} fontWeight="bold" fill={PURPLE} textAnchor="middle">6</SvgText>
    <SvgText x={20} y={54} fontSize={11} fontWeight="bold" fill={PURPLE} textAnchor="middle">9</SvgText>
    {/* minute hand at 12 */}
    <Line x1={50} y1={50} x2={50} y2={22} stroke="#f2b21a" strokeWidth={4} strokeLinecap="round" />
    {/* hour hand at 5 */}
    <Line x1={50} y1={50} x2={62} y2={70} stroke="#f2b21a" strokeWidth={5} strokeLinecap="round" />
    <Circle cx={50} cy={50} r={4} fill="#f2b21a" />
  </Svg>
);

const ART: Record<string, React.ComponentType<P>> = {
  can: CanArt,
  you: YouArt,
  be: BeeArt,
  ready: ReadyArt,
  at: AtArt,
  five: FiveArt,
};

/* ---------- the orange panel with all pictures in one row (left to right) ---------- */

export const PicturePanel = ({ pieces }: { pieces: string[] }) => {
  const { width } = useWindowDimensions();
  const PW = Math.min(width - 24, 380);
  const list = pieces || [];
  const sz = Math.floor((PW - 40) / Math.max(1, list.length));

  return (
    <View style={[st.panel, { width: PW }]}>
      {/* darker orange shadow on the right and the bottom */}
      <View style={st.shadeBottom} />
      <View style={st.shadeRight} />
      <View style={st.row}>
        {list.map((k, i) => {
          const A = ART[k];
          return (
            <View key={i} style={{ width: sz, height: sz, alignItems: 'center', justifyContent: 'center' }}>
              {A ? <A s={sz} /> : <Text style={st.unknown}>?</Text>}
            </View>
          );
        })}
      </View>
    </View>
  );
};

/* ---------- boy thinking, sitting on a pink cloud ---------- */
// (export name kept as GoatCloud so the screen file needs no change)

export const GoatCloud = () => (
  <Svg width={176} height={132} viewBox="0 0 170 130">
    {/* pink cloud */}
    {[[30, 108, 22], [62, 98, 28], [100, 100, 30], [134, 108, 22], [82, 114, 24]].map(([x, y, r], i) => (
      <Circle key={'c' + i} cx={x} cy={y} r={r} fill="#f6aabd" />
    ))}
    {[[56, 92, 14], [96, 94, 16], [124, 102, 11]].map(([x, y, r], i) => (
      <Circle key={'h' + i} cx={x} cy={y} r={r} fill="#fbcfda" />
    ))}

    {/* legs (sitting, knees up) */}
    <Rect x={66} y={88} width={13} height={22} rx={6} fill="#3f4a73" />
    <Rect x={91} y={88} width={13} height={22} rx={6} fill="#3f4a73" />
    <Ellipse cx={72} cy={111} rx={9} ry={5} fill="#e8453c" />
    <Ellipse cx={98} cy={111} rx={9} ry={5} fill="#e8453c" />

    {/* body / shirt */}
    <Ellipse cx={85} cy={80} rx={21} ry={22} fill="#2fa0e0" />

    {/* left arm resting on lap */}
    <Path d="M68 76 L62 92 L76 98" stroke="#2fa0e0" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx={77} cy={98} r={5} fill="#f6c9a0" />

    {/* right arm bent, hand on chin */}
    <Path d="M102 74 L112 86 L100 66 L92 62" stroke="#2fa0e0" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx={92} cy={61} r={5.5} fill="#f6c9a0" />

    {/* head */}
    <Circle cx={85} cy={44} r={21} fill="#f6c9a0" />
    {/* hair */}
    <Path d="M64 42 Q62 18 85 20 Q108 18 106 42 Q98 30 85 32 Q72 30 64 42 Z" fill="#4a2f1b" />
    {/* ear */}
    <Circle cx={64} cy={46} r={4} fill="#eeb88a" />
    {/* eyes looking up-right (thinking) */}
    <Circle cx={77} cy={44} r={4.5} fill="#ffffff" />
    <Circle cx={95} cy={44} r={4.5} fill="#ffffff" />
    <Circle cx={79} cy={42.5} r={2.2} fill="#2b2f36" />
    <Circle cx={97} cy={42.5} r={2.2} fill="#2b2f36" />
    {/* brows: one raised */}
    <Path d="M72 36 L82 36" stroke="#4a2f1b" strokeWidth={2} strokeLinecap="round" />
    <Path d="M91 32 L100 35" stroke="#4a2f1b" strokeWidth={2} strokeLinecap="round" />
    {/* small unsure mouth */}
    <Path d="M80 56 Q85 53 90 57" stroke="#b5654a" strokeWidth={2} fill="none" strokeLinecap="round" />
    <Circle cx={72} cy={52} r={3} fill="#ff9a8a" opacity={0.6} />

    {/* thought bubble */}
    <Circle cx={114} cy={36} r={2.5} fill="#ffffff" stroke="#c9d3e6" strokeWidth={1} />
    <Circle cx={121} cy={29} r={3.5} fill="#ffffff" stroke="#c9d3e6" strokeWidth={1} />
    <Ellipse cx={142} cy={16} rx={20} ry={13} fill="#ffffff" stroke="#c9d3e6" strokeWidth={1.5} />
    <SvgText x={142} y={23} fontSize={18} fontWeight="bold" fill="#5a4bd1" textAnchor="middle">?</SvgText>

    {/* question mark on the left */}
    <SvgText x={34} y={30} fontSize={18} fontWeight="bold" fill="#5a4bd1">?</SvgText>
  </Svg>
);

/* ---------- twinkling gold stars around the boy ---------- */

const Twinkle = ({ left, top, size, ms }: any) => {
  const o = useRef(new Animated.Value(0.45)).current;
  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(o, { toValue: 1, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(o, { toValue: 0.4, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);
  return (
    <Animated.Text
      style={{ position: 'absolute', left, top, fontSize: size, color: '#f6c542', opacity: o, textShadowColor: '#d99a1c', textShadowRadius: 2 }}
    >
      ★
    </Animated.Text>
  );
};

export const Stars = () => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Twinkle left="6%" top="22%" size={26} ms={1200} />
    <Twinkle left="22%" top="58%" size={18} ms={1500} />
    <Twinkle left="14%" top="82%" size={22} ms={1000} />
    <Twinkle left="76%" top="30%" size={24} ms={1400} />
    <Twinkle left="86%" top="64%" size={18} ms={1100} />
    <Twinkle left="68%" top="8%" size={16} ms={1700} />
  </View>
);

const st = StyleSheet.create({
  panel: {
    backgroundColor: '#ffbf47',
    borderWidth: 5,
    borderColor: PURPLE,
    borderRadius: 30,
    paddingVertical: 24,
    paddingHorizontal: 14,
    overflow: 'hidden',
    elevation: 5,
  },
  shadeBottom: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, backgroundColor: '#ff9a1f' },
  shadeRight: { position: 'absolute', top: 0, bottom: 0, right: 0, width: 10, backgroundColor: '#ff9a1f' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  unknown: { fontSize: 30, fontWeight: '900', color: PURPLE },
});
