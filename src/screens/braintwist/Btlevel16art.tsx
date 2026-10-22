import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

/* ───────────────────────── Background (kid room) ───────────────────────── */

export function Level16Background() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 3200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 3200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const beamOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 450 800" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#8fd0f7" />
            <Stop offset="1" stopColor="#bde3f6" />
          </LinearGradient>
        </Defs>

        {/* wall */}
        <Rect x={0} y={0} width={450} height={800} fill="url(#wall)" />
        <Rect x={0} y={320} width={450} height={220} fill="#a6d8f1" opacity={0.55} />

        {/* floor */}
        <Rect x={0} y={540} width={450} height={260} fill="#e8b27c" />
        <Rect x={0} y={532} width={450} height={10} fill="#ffffff" opacity={0.5} />
        {[585, 630, 675, 720, 765].map((y) => (
          <Rect key={y} x={0} y={y} width={450} height={3} fill="#d9985f" />
        ))}

        {/* window */}
        <Rect x={-10} y={70} width={130} height={250} fill="#ffffff" />
        <Rect x={0} y={82} width={108} height={104} fill="#8fd0f8" />
        <Rect x={0} y={196} width={108} height={104} fill="#8fd0f8" />
        <Ellipse cx={30} cy={122} rx={22} ry={10} fill="#ffffff" opacity={0.9} />
        <Ellipse cx={52} cy={116} rx={16} ry={9} fill="#ffffff" opacity={0.9} />
        <Rect x={-10} y={300} width={135} height={14} fill="#e6a867" />

        {/* plant with face on the sill */}
        <Ellipse cx={40} cy={238} rx={9} ry={30} fill="#62c24d" transform="rotate(-22 40 238)" />
        <Ellipse cx={58} cy={232} rx={9} ry={32} fill="#4fb23c" />
        <Ellipse cx={76} cy={238} rx={9} ry={30} fill="#62c24d" transform="rotate(22 76 238)" />
        <Rect x={38} y={262} width={42} height={38} rx={10} fill="#f3efe0" />
        <Circle cx={51} cy={280} r={2.5} fill="#333" />
        <Circle cx={67} cy={280} r={2.5} fill="#333" />

        {/* sun picture frame */}
        <Rect x={345} y={92} width={95} height={95} rx={4} fill="#d4ecf8" stroke="#8dc4e0" strokeWidth={5} />
        <Circle cx={392} cy={140} r={24} fill="#f7a43a" />
        <Circle cx={392} cy={140} r={17} fill="#f9b94f" />

        {/* bookshelf with teddy */}
        <Rect x={366} y={300} width={90} height={240} fill="#e2a255" />
        <Rect x={374} y={308} width={80} height={106} fill="#c98a45" />
        <Rect x={374} y={422} width={80} height={110} fill="#c98a45" />
        <Rect x={380} y={358} width={12} height={54} fill="#4aa3c7" />
        <Rect x={394} y={348} width={12} height={64} fill="#7b5cc4" />
        <Rect x={408} y={364} width={12} height={48} fill="#f0a23a" />
        <Rect x={422} y={354} width={12} height={58} fill="#e0566b" />
        <Rect x={436} y={362} width={12} height={50} fill="#4aa3c7" />
        <Circle cx={402} cy={482} r={20} fill="#a8693a" />
        <Circle cx={386} cy={464} r={8} fill="#a8693a" />
        <Circle cx={418} cy={464} r={8} fill="#a8693a" />
        <Ellipse cx={402} cy={490} rx={9} ry={7} fill="#d9a06a" />
        <Circle cx={396} cy={478} r={2.2} fill="#222" />
        <Circle cx={408} cy={478} r={2.2} fill="#222" />
        <Rect x={394} y={498} width={16} height={28} rx={6} fill="#a8693a" />

        {/* left stacked books + big leaf */}
        <Rect x={0} y={508} width={95} height={16} fill="#4a9bd6" />
        <Rect x={0} y={524} width={102} height={16} fill="#ee6fa8" />
        <Path d="M0 640 Q44 600 74 650 Q84 730 40 800 L0 800 Z" fill="#6cc04a" />
      </Svg>

      {/* animated sunbeams */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: beamOpacity }]}>
        <Svg width="100%" height="100%" viewBox="0 0 450 800" preserveAspectRatio="xMidYMid slice">
          <Polygon points="110,70 250,70 400,800 150,800" fill="#ffffff" opacity={0.14} />
          <Polygon points="230,0 310,0 450,520 340,700" fill="#ffffff" opacity={0.1} />
        </Svg>
      </Animated.View>
    </View>
  );
}

/* ───────────────────────── Pizza scene (4 kids) ───────────────────────── */

export type SceneState = 'idle' | 'wrong' | 'right';

type KidKind = 'A' | 'B' | 'C' | 'D';

const SKIN = '#f6c9a0';

const KIDS: {
  kind: KidKind;
  cx: number;
  hoodie: string;
  hoodieDark: string;
  hair: string;
  lines: string[];
}[] = [
  { kind: 'A', cx: 45, hoodie: '#f0689c', hoodieDark: '#d94f85', hair: '#4a2e2a', lines: ["I didn't", 'take it!'] },
  { kind: 'B', cx: 135, hoodie: '#3b6fd8', hoodieDark: '#2c58b5', hair: '#1c1c24', lines: ['I was', 'watching TV', 'the whole', 'time.'] },
  { kind: 'C', cx: 225, hoodie: '#8a5bd0', hoodieDark: '#7144b8', hair: '#6b4630', lines: ["I didn't", 'take it!'] },
  { kind: 'D', cx: 315, hoodie: '#2f9a63', hoodieDark: '#237a4e', hair: '#b8662c', lines: ["I didn't", 'take it', 'either!'] },
];

function Bubble({ cx, lines }: { cx: number; lines: string[] }) {
  const y = 6;
  const h = 14 + lines.length * 11;
  const bottom = y + h;
  return (
    <G>
      <Rect x={cx - 42} y={y} width={84} height={h} rx={14} fill="#fff" stroke="#2a2a2a" strokeWidth={1.2} />
      <Path d={`M${cx - 6} ${bottom} L${cx} ${bottom + 10} L${cx + 6} ${bottom}`} fill="#fff" stroke="#2a2a2a" strokeWidth={1.2} />
      <Path d={`M${cx - 5} ${bottom} L${cx + 5} ${bottom}`} stroke="#fff" strokeWidth={2.4} />
      {lines.map((t, i) => (
        <SvgText
          key={i}
          x={cx}
          y={y + 17 + i * 11}
          fontSize={10}
          fontWeight="bold"
          fill="#222"
          textAnchor="middle"
        >
          {t}
        </SvgText>
      ))}
    </G>
  );
}

function Kid({ kind, cx, hoodie, hoodieDark, hair }: (typeof KIDS)[number]) {
  const look = kind === 'C' ? -2.2 : 2.2; // pupils direction
  return (
    <G transform={`translate(${cx} 0)`}>
      {/* long hair behind (A) */}
      {kind === 'A' && <Rect x={-30} y={96} width={60} height={84} rx={26} fill={hair} />}

      {/* body */}
      <Rect x={-32} y={140} width={64} height={84} rx={24} fill={hoodie} />
      <Ellipse cx={0} cy={144} rx={22} ry={8} fill={hoodieDark} />
      <Path d="M-6 152 L-6 178 M6 152 L6 178" stroke="#fff" strokeWidth={2} strokeLinecap="round" />

      {/* head */}
      <Circle cx={0} cy={118} r={24} fill={SKIN} />

      {/* hair front */}
      {kind !== 'D' && (
        <Path d="M-25 118 Q-28 88 0 90 Q28 88 25 118 Q16 100 0 102 Q-16 100 -25 118 Z" fill={hair} />
      )}
      {kind === 'C' && <Circle cx={0} cy={86} r={10} fill={hair} />}
      {kind === 'D' && (
        <G fill={hair}>
          <Circle cx={-18} cy={99} r={10} />
          <Circle cx={-5} cy={92} r={10} />
          <Circle cx={9} cy={92} r={10} />
          <Circle cx={21} cy={100} r={10} />
          <Circle cx={-25} cy={112} r={7} />
          <Circle cx={25} cy={112} r={7} />
        </G>
      )}

      {/* eyes */}
      <Ellipse cx={-9} cy={119} rx={6.5} ry={7.5} fill="#fff" />
      <Ellipse cx={9} cy={119} rx={6.5} ry={7.5} fill="#fff" />
      <Circle cx={-9 + look} cy={120} r={3.4} fill="#1d1d1d" />
      <Circle cx={9 + look} cy={120} r={3.4} fill="#1d1d1d" />

      {/* cheeks */}
      <Circle cx={-15} cy={130} r={3.5} fill="#f19a8e" opacity={0.7} />
      <Circle cx={15} cy={130} r={3.5} fill="#f19a8e" opacity={0.7} />

      {/* mouth */}
      {kind === 'A' && <Path d="M-8 128 Q0 138 8 128" stroke="#7a3b2e" strokeWidth={2} fill="none" strokeLinecap="round" />}
      {kind === 'B' && <Path d="M-5 131 L5 131" stroke="#7a3b2e" strokeWidth={2} strokeLinecap="round" />}
      {kind === 'C' && <Path d="M-4 130 Q0 133 4 130" stroke="#7a3b2e" strokeWidth={2} fill="none" strokeLinecap="round" />}
      {kind === 'D' && <Path d="M-9 128 Q0 140 9 128 Z" stroke="#7a3b2e" strokeWidth={1.6} fill="#fff" />}

      {/* extra details */}
      {kind === 'B' && <Circle cx={13} cy={142} r={9} fill={SKIN} />}
      {kind === 'C' && (
        <G>
          <Rect x={-7} y={150} width={15} height={26} rx={3} fill="#2c2c34" />
          <Circle cx={-8} cy={170} r={5} fill={SKIN} />
          <Circle cx={10} cy={170} r={5} fill={SKIN} />
        </G>
      )}
      {(kind === 'A' || kind === 'D') && (
        <G fill="#c9722f">
          <Circle cx={kind === 'A' ? 13 : -13} cy={132} r={1.4} />
          <Circle cx={kind === 'A' ? 17 : -17} cy={128} r={1.2} />
          <Circle cx={kind === 'A' ? 10 : -10} cy={136} r={1.2} />
        </G>
      )}
    </G>
  );
}

export function PizzaScene({
  width,
  selected,
  state,
}: {
  width: number;
  selected: string | null;
  state: SceneState;
}) {
  const height = (width * 250) / 360;
  const ringColor = state === 'wrong' ? '#ef4444' : state === 'right' ? '#22c55e' : '#ffd23f';
  const selKid = KIDS.find((k) => k.kind === selected);

  return (
    <Svg width={width} height={height} viewBox="0 0 360 250">
      {/* kids */}
      {KIDS.map((k) => (
        <Kid key={k.kind} {...k} />
      ))}

      {/* table */}
      <Ellipse cx={180} cy={238} rx={200} ry={58} fill="#a8622f" />
      <Ellipse cx={180} cy={232} rx={196} ry={54} fill="#c98147" />

      {/* plates */}
      {KIDS.map((k) => (
        <G key={`p-${k.kind}`}>
          <Ellipse cx={k.cx} cy={208} rx={29} ry={8.5} fill="#fdfdfd" stroke="#d9d9d9" strokeWidth={1} />
          <Ellipse cx={k.cx} cy={208} rx={18} ry={4.5} fill="#f1f1f1" />
          {(k.kind === 'A' || k.kind === 'B') && (
            <G fill="#d9823b">
              <Circle cx={k.cx - 8} cy={208} r={1.6} />
              <Circle cx={k.cx - 2} cy={210} r={1.4} />
              <Circle cx={k.cx + 6} cy={207} r={1.7} />
              <Circle cx={k.cx + 11} cy={210} r={1.3} />
            </G>
          )}
        </G>
      ))}

      {/* glasses of water */}
      {[90, 180, 270].map((x) => (
        <G key={`g-${x}`}>
          <Rect x={x - 7} y={186} width={14} height={20} rx={3} fill="#bfe6f8" stroke="#8ec7e3" strokeWidth={1} />
          <Rect x={x - 6} y={193} width={12} height={12} rx={2} fill="#7fc4ec" opacity={0.7} />
        </G>
      ))}

      {/* pizza box + last slice */}
      <Polygon points="132,214 230,214 262,242 104,242" fill="#d9b27a" stroke="#a67c47" strokeWidth={1.5} />
      <Polygon points="146,219 224,219 246,238 122,238" fill="#c9a068" />
      <Polygon points="160,236 214,221 234,236" fill="#f2b04c" stroke="#b9792a" strokeWidth={1} />
      <Polygon points="168,234 212,224 226,234" fill="#e2452f" />
      <Circle cx={186} cy={230} r={3.6} fill="#b82a1c" />
      <Circle cx={203} cy={229} r={3.2} fill="#b82a1c" />
      <Circle cx={216} cy={232} r={2.8} fill="#b82a1c" />

      {/* letter badges */}
      {KIDS.map((k) => (
        <G key={`b-${k.kind}`}>
          <Rect x={k.cx - 38} y={196} width={22} height={22} rx={4} fill="#f7d046" stroke="#3a2a12" strokeWidth={1.4} />
          <SvgText x={k.cx - 27} y={212} fontSize={15} fontWeight="bold" fill="#2a1d08" textAnchor="middle">
            {k.kind}
          </SvgText>
        </G>
      ))}

      {/* selection ring */}
      {selKid && (
        <Rect
          x={selKid.cx - 44}
          y={84}
          width={88}
          height={164}
          rx={18}
          fill={ringColor}
          fillOpacity={0.12}
          stroke={ringColor}
          strokeWidth={3}
          strokeDasharray={state === 'idle' ? '6 4' : undefined}
        />
      )}

      {/* speech bubbles (last so they stay on top) */}
      {KIDS.map((k) => (
        <Bubble key={`s-${k.kind}`} cx={k.cx} lines={k.lines} />
      ))}
    </Svg>
  );
}