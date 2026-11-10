
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, Rect, Ellipse, Circle, Path, G,
} from 'react-native-svg';
import { F } from './BTShared';
import * as api from './api';
import { answerLevel24 } from './Btlevel24api';

const QUESTION =
  'When I was 4 years old, my younger sister was half my age. If I am now 20 years old, how old is my younger sister?';

// pink / blue / yellow options (garden theme, like the reference picture)
const OPTIONS = [
  { id: 'A', text: '10 years', main: '#e5243b', light: '#ff8aa0', bg: '#ffc9d8', border: '#ee2f55', dash: '#ff9db4' },
  { id: 'B', text: '16 years', main: '#1f7fe8', light: '#7bbcfb', bg: '#c3e3ff', border: '#2c86f0', dash: '#8fc2f8' },
  { id: 'C', text: '18 years', main: '#f59a0c', light: '#fbc34f', bg: '#fff2b8', border: '#f5b410', dash: '#f2d27f' },
];

const INK = '#6b3410';
const HINT_COST = 25;
const SKIP_COST = 50;

/* ---------- small drawing pieces ---------- */
const Leaf = ({ x, y, r = 0, s = 1, c = '#4caf50' }: any) => (
  <G transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <Path d="M0 0 C 14 -18, 36 -8, 32 12 C 16 18, 4 12, 0 0 Z" fill={c} stroke="#2e7d32" strokeWidth={1} />
    <Path d="M2 2 C 12 -3, 22 -1, 30 9" stroke="#2e7d32" strokeWidth={1.5} fill="none" />
  </G>
);

// big white flower with soft shading and an orange centre
const Flower = ({ x, y, s = 1 }: any) => (
  <G transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 72, 144, 216, 288].map((a) => (
      <G key={a} transform={`rotate(${a})`}>
        <Ellipse cx={0} cy={-7} rx={5.4} ry={7.4} fill="#fffaf2" stroke="#e8dccb" strokeWidth={0.7} />
        <Ellipse cx={0} cy={-4} rx={2.2} ry={3.4} fill="#f6e9d6" />
      </G>
    ))}
    <Circle cx={0} cy={0} r={3.8} fill="#f5a623" stroke="#d9861a" strokeWidth={0.7} />
    <Circle cx={-1} cy={-1} r={1.3} fill="#ffd27a" />
  </G>
);

/* ---------- garden background scene ---------- */
const Cloud = ({ x, y, s = 1 }: any) => (
  <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity={0.95}>
    <Ellipse cx={0} cy={0} rx={40} ry={18} /><Ellipse cx={-30} cy={7} rx={27} ry={14} />
    <Ellipse cx={32} cy={8} rx={29} ry={14} /><Ellipse cx={5} cy={-14} rx={25} ry={17} />
  </G>
);
const Tuft = ({ x, y, s = 1 }: any) => (
  <Path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0 Q-4 -18 -10 -27 Q-1 -16 2 -25 Q6 -13 14 -22 Q7 -8 9 0Z" fill="#4faa2b" />
);
const Rock = ({ x, y, w, h }: any) => (
  <G>
    <Ellipse cx={x} cy={y} rx={w} ry={h} fill="#8c939b" />
    <Ellipse cx={x - w * 0.2} cy={y - h * 0.3} rx={w * 0.55} ry={h * 0.4} fill="#adb3ba" />
  </G>
);
const Blossom = ({ x, y, s = 1, petal = '#fff' }: any) => (
  <G transform={`translate(${x} ${y}) scale(${s})`}>
    <Path d="M-12 14 Q-4 -2 0 5 Q5 -3 14 12 Q5 9 0 15 Q-6 9 -12 14Z" fill="#4faa2b" />
    {[0, 72, 144, 216, 288].map((a) => (
      <Ellipse key={a} cx={0} cy={-8} rx={5.2} ry={8} fill={petal} stroke="rgba(0,0,0,0.08)" strokeWidth={0.6} transform={`rotate(${a})`} />
    ))}
    <Circle cx={0} cy={0} r={4} fill="#f9c933" />
  </G>
);

const Room = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="sky24" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#47b5ee" />
          <Stop offset="0.5" stopColor="#97d7f6" />
          <Stop offset="1" stopColor="#d3f0fb" />
        </LinearGradient>
        <LinearGradient id="grass24" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#9be353" />
          <Stop offset="1" stopColor="#4fa92d" />
        </LinearGradient>
      </Defs>

      <Rect width={400} height={800} fill="url(#sky24)" />
      <Cloud x={330} y={110} s={0.7} /><Cloud x={55} y={190} s={0.55} /><Cloud x={350} y={290} s={0.6} />

      {/* rolling hills + trees in the distance */}
      <Ellipse cx={60} cy={330} rx={120} ry={46} fill="#6dbf3e" />
      <Ellipse cx={340} cy={335} rx={130} ry={50} fill="#62b738" />
      <Ellipse cx={200} cy={350} rx={170} ry={36} fill="#7fcc4b" />
      <Ellipse cx={22} cy={300} rx={46} ry={40} fill="#58ae33" />
      <Ellipse cx={382} cy={305} rx={50} ry={42} fill="#58ae33" />

      {/* meadow */}
      <Path d="M0 355 Q200 322 400 355 V800 H0 Z" fill="url(#grass24)" />
      <Path d="M0 470 Q120 450 220 470 T400 465 V800 H0 Z" fill="#8bdc48" opacity={0.35} />

      {/* fence pieces at the sides */}
      {[0, 1].map((i) => (
        <G key={'fl' + i}>
          <Path d={`M${i * 24 - 2} 405 V352 L${i * 24 + 10} 338 L${i * 24 + 22} 352 V405Z`} fill="#eeaa55" stroke="#bf7329" strokeWidth={1.5} />
        </G>
      ))}
      <Rect x={0} y={366} width={46} height={7} fill="#dc9640" /><Rect x={0} y={388} width={46} height={7} fill="#dc9640" />
      {[0, 1].map((i) => (
        <G key={'fr' + i}>
          <Path d={`M${400 - i * 24 + 2} 405 V352 L${400 - i * 24 - 10} 338 L${400 - i * 24 - 22} 352 V405Z`} fill="#eeaa55" stroke="#bf7329" strokeWidth={1.5} />
        </G>
      ))}
      <Rect x={354} y={366} width={46} height={7} fill="#dc9640" /><Rect x={354} y={388} width={46} height={7} fill="#dc9640" />

      {/* grass tufts + flowers */}
      <Tuft x={25} y={430} /><Tuft x={372} y={452} /><Tuft x={18} y={560} s={1.2} /><Tuft x={380} y={575} s={1.2} />
      <Tuft x={30} y={650} /><Tuft x={368} y={668} /><Tuft x={210} y={742} />
      <Blossom x={20} y={452} s={0.8} petal="#fff" />
      <Blossom x={378} y={500} s={0.7} petal="#fff7b0" />
      <Blossom x={22} y={540} s={0.75} petal="#9fd8ff" />
      <Blossom x={386} y={588} s={0.8} petal="#fff" />
      <Blossom x={24} y={640} s={0.85} petal="#ffb4d0" />
      <Blossom x={372} y={650} s={0.8} petal="#fff" />
      <Blossom x={34} y={706} s={0.85} petal="#fff" />
      <Blossom x={374} y={716} s={0.85} petal="#ffb4d0" />

      {/* rocks */}
      <Rock x={4} y={602} w={36} h={24} /><Rock x={398} y={612} w={40} h={26} />
      <Rock x={26} y={778} w={34} h={20} /><Rock x={372} y={784} w={38} h={22} /><Rock x={160} y={796} w={14} h={8} />

      {/* leaves in the top corners */}
      <Ellipse cx={14} cy={6} rx={80} ry={40} fill="#3f9f35" />
      <Ellipse cx={95} cy={0} rx={55} ry={26} fill="#58b940" />
      <Ellipse cx={40} cy={42} rx={40} ry={17} fill="#6fcb4c" />
      <Ellipse cx={392} cy={4} rx={86} ry={44} fill="#3a9a32" />
      <Ellipse cx={315} cy={0} rx={55} ry={24} fill="#58b940" />
      <Ellipse cx={366} cy={42} rx={40} ry={17} fill="#6fcb4c" />
    </Svg>
  </View>
);

/* ---------- flower + leaves sprig (card corners) ---------- */
const Sprig = ({ w = 74, flipX = false, flipY = false }: { w?: number; flipX?: boolean; flipY?: boolean }) => (
  <Svg
    width={w}
    height={(w * 54) / 66}
    viewBox="0 0 66 54"
    style={{ transform: [{ scaleX: flipX ? -1 : 1 }, { scaleY: flipY ? -1 : 1 }] }}
  >
    <Leaf x={32} y={32} r={-160} s={1.2} c="#58b948" />
    <Leaf x={32} y={32} r={-95} s={1.1} c="#3f9d4a" />
    <Leaf x={32} y={32} r={-20} s={1.2} c="#4caf50" />
    <Leaf x={32} y={32} r={100} s={1.1} c="#6cc65f" />
    <Flower x={30} y={28} s={1.9} />
  </Svg>
);

/* ---------- round letter badge (white ring + soft glow) ---------- */
const Badge = ({ id, main, light }: { id: string; main: string; light: string }) => (
  <View style={{ width: 58, height: 58, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={58} height={58} viewBox="0 0 58 58" style={{ position: 'absolute' }}>
      <Circle cx={29} cy={29} r={28} fill={light} opacity={0.55} />
      <Circle cx={29} cy={29} r={23} fill={main} stroke="#fff" strokeWidth={3} />
      <Ellipse cx={22} cy={19} rx={8} ry={4.5} fill="rgba(255,255,255,0.4)" />
    </Svg>
    <Text style={s.badgeTxt}>{id}</Text>
  </View>
);

/* ---------- hanging chain (for the level sign) ---------- */
const Chain = ({ h = 34 }: { h?: number }) => {
  const n = Math.max(2, Math.round(h / 11));
  return (
    <Svg width={12} height={h} viewBox={`0 0 12 ${h}`}>
      {Array.from({ length: n }).map((_, i) => (
        <Ellipse
          key={i}
          cx={6}
          cy={6 + i * ((h - 12) / (n - 1))}
          rx={i % 2 ? 2.2 : 4}
          ry={6}
          fill="none"
          stroke="#4a4f57"
          strokeWidth={2.4}
        />
      ))}
    </Svg>
  );
};

/* ---------- icons ---------- */
const HomeIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path d="M12 3 L2 12 H5 V21 H10 V15 H14 V21 H19 V12 H22 Z" fill={INK} />
  </Svg>
);
const GearIcon = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={8} stroke={INK} strokeWidth={4} strokeDasharray="3.1 3.1" fill="none" />
    <Circle cx={12} cy={12} r={6.5} fill={INK} />
    <Circle cx={12} cy={12} r={2.8} fill="#ffd21f" />
  </Svg>
);
const Bulb = ({ k = 1 }: { k?: number }) => (
  <Svg width={26 * k} height={30 * k} viewBox="0 0 24 28">
    <Path d="M12 2 C6 2 3 6 3 10 C3 14 6 15 7 19 H17 C18 15 21 14 21 10 C21 6 18 2 12 2 Z" fill="#ffd23f" stroke="#e0a81f" strokeWidth={1.5} />
    <Rect x={8} y={20} width={8} height={3} rx={1.5} fill="#8d8d8d" />
    <Rect x={9} y={24} width={6} height={3} rx={1.5} fill="#6f6f6f" />
  </Svg>
);
// yellow coin used in the labels under the 3 buttons
const CoinIcon = ({ k = 1 }: { k?: number }) => (
  <Svg width={20 * k} height={20 * k} viewBox="0 0 20 20">
    <Circle cx={10} cy={10} r={9} fill="#f6c62a" stroke="#d99a12" strokeWidth={1.5} />
    <Circle cx={10} cy={10} r={6} fill="#ffe066" />
    <Ellipse cx={7.5} cy={7} rx={2.4} ry={1.5} fill="rgba(255,255,255,0.8)" />
  </Svg>
);
const SearchIcon = () => (
  <Svg width={40} height={40} viewBox="0 0 24 24">
    <Circle cx={10} cy={10} r={6.5} stroke="#1d2b2b" strokeWidth={2.8} fill="rgba(180,230,255,0.55)" />
    <Path d="M15 15 L21 21" stroke="#1d2b2b" strokeWidth={3.4} strokeLinecap="round" />
  </Svg>
);
const FilmIcon = () => (
  <Svg width={40} height={40} viewBox="0 0 24 24">
    <Rect x={2} y={4} width={20} height={16} rx={2} fill="#3a3350" />
    <Rect x={4} y={6} width={16} height={12} rx={1} fill="#9b6be0" />
    <Path d="M10 9 L15 12 L10 15 Z" fill="#1f1830" />
  </Svg>
);
const FastForwardIcon = () => (
  <Svg width={38} height={38} viewBox="0 0 24 24">
    <Path d="M3 5 L12 12 L3 19 Z" fill="#3a0a10" />
    <Path d="M12 5 L21 12 L12 19 Z" fill="#3a0a10" />
  </Svg>
);

/* =====================  SCREEN  ===================== */
type Props = {
  playerId: number | string;
  hints: number;
  setHints?: (n: number) => void;
  onExit: () => void;
  onComplete: (r: any) => void;
};

export default function BTLevel24Screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle');
  const [err, setErr] = useState('');
  const [hidden, setHidden] = useState<string[]>([]);
  const busy = useRef(false);
  const actBusy = useRef(false);
  const tries = useRef(0);
  const shake = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
  }, []);

  const doShake = () =>
    Animated.sequence([10, -10, 6, -6, 0].map((v) =>
      Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }),
    )).start();

  const flash = (m: string) => { setErr(m); setTimeout(() => setErr(''), 1800); };

  const onPick = async (id: string) => {
    if (busy.current || status === 'right') return;
    busy.current = true;
    setPicked(id);
    tries.current += 1;
    try {
      const r = await answerLevel24(playerId, id, tries.current);
      if (r.correct) {
        setStatus('right');
        setTimeout(() => onComplete({ ...r, skipped: false }), 1000);
      } else {
        setStatus('wrong');
        doShake();
        setTimeout(() => { setStatus('idle'); setPicked(null); }, 800);
      }
    } catch (e: any) {
      tries.current -= 1;
      flash(e?.message || 'Network error');
      setPicked(null);
    } finally {
      busy.current = false;
    }
  };

  const useHint = async () => {
    if (actBusy.current || status === 'right') return;
    if (hints < HINT_COST) { flash('Need ' + HINT_COST + ' hints. You have ' + hints + '.'); return; }
    const wrong = OPTIONS.filter((o) => o.id !== 'C' && !hidden.includes(o.id));
    if (!wrong.length) { flash('Only one answer left!'); return; }
    actBusy.current = true;
    try {
      const r = await (api as any).hint(24, playerId, []);
      if (typeof r?.hints === 'number') setHints?.(r.hints);
      setHidden((h) => [...h, wrong[0].id]);
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
    } finally { actBusy.current = false; }
  };

  const watchVideo = async () => {
    if (actBusy.current) return;
    actBusy.current = true;
    try {
      const r = await (api as any).reward(playerId, 'video');
      if (typeof r?.hints === 'number') setHints?.(r.hints);
    } catch {} finally { actBusy.current = false; }
  };

  const skipLevel = async () => {
    if (actBusy.current || status === 'right') return;
    if (hints < SKIP_COST) { flash('Need ' + SKIP_COST + ' hints. You have ' + hints + '.'); return; }
    actBusy.current = true;
    try {
      const r = await (api as any).skip(24, playerId);
      setHints?.(typeof r?.hints === 'number' ? r.hints : hints - SKIP_COST);
      setStatus('right');
      setTimeout(() => onComplete({ ...r, skipped: true }), 600);
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
    } finally { actBusy.current = false; }
  };

  return (
    <View style={s.root}>
      <Room />
      <View style={s.content}>
        {/* top bar */}
        <View style={s.topBar}>
          <View style={s.row}>
            <TouchableOpacity style={s.roundBtn} onPress={onExit}><HomeIcon /></TouchableOpacity>
            <TouchableOpacity style={[s.roundBtn, { marginLeft: 8 }]}><GearIcon /></TouchableOpacity>
          </View>
          <View style={s.hintPill}>
            <Bulb />
            <Text style={s.hintNum}>{hints}</Text>
          </View>
        </View>

        {/* wooden level sign hanging on chains:  < LEVEL 24 > */}
        <View style={s.signWrap} pointerEvents="none">
          <View style={[s.chain, { left: 26 }]}><Chain h={34} /></View>
          <View style={[s.chain, { right: 26 }]}><Chain h={34} /></View>
          <View style={s.sign}>
            <View style={s.signInner}>
              <Text style={s.signArrow}>{'<'}</Text>
              <Text style={s.signTxt}>LEVEL 24</Text>
              <Text style={s.signArrow}>{'>'}</Text>
            </View>
            <View style={[s.nail, { left: 6, top: 6 }]} /><View style={[s.nail, { right: 6, top: 6 }]} />
            <View style={[s.nail, { left: 6, bottom: 6 }]} /><View style={[s.nail, { right: 6, bottom: 6 }]} />
          </View>
        </View>

        <Animated.View style={{ flex: 1, transform: [{ translateX: shake }] }}>
          {/* question board */}
          <Animated.View style={[s.frame, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }]}>
            <View style={s.paper}>
              <Text style={s.question}>{QUESTION}</Text>
            </View>
            <View style={{ position: 'absolute', left: -20, top: -24 }}><Sprig /></View>
            <View style={{ position: 'absolute', right: -20, top: -24 }}><Sprig flipX /></View>
            <View style={{ position: 'absolute', left: -20, bottom: -22 }}><Sprig flipY /></View>
            <View style={{ position: 'absolute', right: -20, bottom: -22 }}><Sprig flipX flipY /></View>
          </Animated.View>

          {/* options */}
          <View style={s.options}>
            {OPTIONS.map((o) => {
              const p = picked === o.id;
              const isRight = p && status === 'right';
              const isWrong = p && status === 'wrong';
              const bg = isRight ? '#d4f5cd' : isWrong ? '#ffd0d0' : o.bg;
              const gone = hidden.includes(o.id);
              return (
                <TouchableOpacity
                  key={o.id}
                  activeOpacity={0.85}
                  disabled={gone}
                  style={[s.option, { backgroundColor: bg, borderColor: o.border, opacity: gone ? 0.2 : 1 }]}
                  onPress={() => onPick(o.id)}
                >
                  <View style={[s.dashed, { borderColor: o.dash }]} pointerEvents="none" />
                  <View style={s.shine} pointerEvents="none" />
                  <Badge id={o.id} main={o.main} light={o.light} />
                  <Text style={s.optTxt}>{isRight ? o.text + ' ✓' : o.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* hint / video / skip bar */}
        <View style={s.bar}>
          <View style={[s.plankLine, { top: '34%' }]} pointerEvents="none" />
          <View style={[s.plankLine, { top: '68%' }]} pointerEvents="none" />
          <View style={[s.nail, { left: 8, top: 8 }]} /><View style={[s.nail, { right: 8, top: 8 }]} />
          <View style={[s.nail, { left: 8, bottom: 8 }]} /><View style={[s.nail, { right: 8, bottom: 8 }]} />
          <View style={s.acol}>
            <TouchableOpacity activeOpacity={0.8} style={[s.btn, s.hintBtn]} onPress={useHint}><SearchIcon /></TouchableOpacity>
            <View style={s.lblRow}><CoinIcon k={0.8} /><Text style={s.lbl}>{HINT_COST}</Text></View>
          </View>
          <View style={s.acol}>
            <TouchableOpacity activeOpacity={0.8} style={[s.btn, s.videoBtn]} onPress={watchVideo}><FilmIcon /></TouchableOpacity>
            <View style={s.lblRow}><CoinIcon k={0.8} /><Text style={s.lbl}>+75</Text></View>
          </View>
          <View style={s.acol}>
            <TouchableOpacity activeOpacity={0.8} style={[s.btn, s.skipBtn]} onPress={skipLevel}><FastForwardIcon /></TouchableOpacity>
            <View style={s.lblRow}><CoinIcon k={0.8} /><Text style={s.lbl}>{SKIP_COST}</Text></View>
          </View>
        </View>

        {!!err && <Text style={s.err}>{err}</Text>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#7fcdf3', overflow: 'hidden' },
  content: { flex: 1, paddingHorizontal: 18, paddingTop: 30, paddingBottom: 14 },
  row: { flexDirection: 'row' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 },
  roundBtn: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#f8bc30',
    borderWidth: 4, borderColor: '#cf7f1c', alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 3, shadowOffset: { width: 0, height: 2 },
  },
  hintPill: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fbf2df', borderRadius: 24, borderWidth: 2.5, borderStyle: 'dashed', borderColor: '#e6b9a0',
    paddingHorizontal: 14, height: 46, minWidth: 96,
  },
  hintNum: { fontFamily: F, fontSize: 22, fontWeight: '800', color: '#1d1a3a', marginLeft: 10 },

  // sign + chains
  signWrap: { alignItems: 'center', alignSelf: 'center', marginTop: -36, zIndex: 4 },
  chain: { position: 'absolute', top: 0 },
  nail: { position: 'absolute', width: 6, height: 6, borderRadius: 3, backgroundColor: '#5a3a1a' },
  plankLine: { position: 'absolute', left: 10, right: 10, height: 2, backgroundColor: 'rgba(150,80,20,0.35)' },
  sign: {
    marginTop: 30, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10,
    backgroundColor: '#b4651f', borderWidth: 4, borderColor: '#7a3f10',
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
  },
  signInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,214,150,0.45)', borderRadius: 6, paddingHorizontal: 16, paddingVertical: 2,
  },
  signArrow: { fontFamily: F, fontSize: 24, fontWeight: '900', color: '#ffc93c', marginHorizontal: 6 },
  signTxt: {
    fontFamily: F, color: '#ffffff', fontSize: 28, fontWeight: '900', letterSpacing: 1,
    textShadowColor: '#7a3f10', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 2,
  },

  frame: {
    flex: 1.1, marginTop: 24, padding: 7, borderRadius: 10,
    backgroundColor: '#e8a24a', borderWidth: 3, borderColor: '#b8651f',
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 4 },
  },
  paper: {
    flex: 1, justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 18,
    backgroundColor: '#faedcf', borderRadius: 5, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d9b080',
  },
  question: { fontFamily: F, fontSize: 23, lineHeight: 31, textAlign: 'center', color: '#1d2146', fontWeight: '800' },

  options: { flex: 1.5, marginTop: 22, justifyContent: 'space-between' },
  option: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 36, borderWidth: 3.5,
    paddingVertical: 4, paddingHorizontal: 8, flex: 1, maxHeight: 78, marginBottom: 8,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
  },
  dashed: {
    position: 'absolute', left: 5, right: 5, top: 5, bottom: 5, borderRadius: 30,
    borderWidth: 1, borderStyle: 'dashed', opacity: 0.7,
  },
  shine: {
    position: 'absolute', left: 76, right: 24, top: 7, height: 7, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  badgeTxt: { position: 'absolute', fontFamily: F, color: '#fff', fontSize: 27, fontWeight: '900' },
  optTxt: { flex: 1, textAlign: 'center', fontFamily: F, fontSize: 28, fontWeight: '900', color: '#1d2146', marginRight: 48 },

  bar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#e99f4a', borderRadius: 16, borderWidth: 4, borderColor: '#b9701f',
    paddingVertical: 12, paddingHorizontal: 10, marginTop: 4,
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
  },
  acol: { alignItems: 'center' },
  btn: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 4, elevation: 4 },
  hintBtn: { backgroundColor: '#9be21c', borderColor: '#d9f58f' },
  videoBtn: { backgroundColor: '#f7b82e', borderColor: '#ffe39a' },
  skipBtn: { backgroundColor: '#e8212f', borderColor: '#ffc9cc' },
  lblRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 28, minWidth: 70, marginTop: 5,
    paddingHorizontal: 10, borderRadius: 14, backgroundColor: '#5a2f12',
  },
  lbl: { fontFamily: F, fontSize: 16, fontWeight: 'bold', color: '#fff', marginLeft: 4 },
  err: { position: 'absolute', bottom: 140, alignSelf: 'center', color: '#c0392b', fontSize: 15, fontWeight: 'bold', backgroundColor: '#fff6e6', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 4, overflow: 'hidden', textAlign: 'center' },
});
