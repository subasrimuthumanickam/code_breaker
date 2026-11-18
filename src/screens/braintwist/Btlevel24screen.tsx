
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Pressable, Animated, Easing, StyleSheet, ScrollView, Platform,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Stage, F, Coin } from './BTShared';
import { Icon } from './Art';
import * as api from './api';
import { answerLevel24, requestLevel24Hint } from './Btlevel24api';
import { play } from './BTSound';

const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

const QUESTION =
  'When I was 4 years old, my younger sister was half my age. If I am now 20 years old, how old is my younger sister?';

// pink / blue / yellow options (garden theme)
const OPTIONS = [
  { id: 'A', text: '10 years', main: '#e5243b', light: '#ff8aa0', bg: '#ffc9d8', border: '#ee2f55', dash: '#ff9db4' },
  { id: 'B', text: '16 years', main: '#1f7fe8', light: '#7bbcfb', bg: '#c3e3ff', border: '#2c86f0', dash: '#8fc2f8' },
  { id: 'C', text: '18 years', main: '#f59a0c', light: '#fbc34f', bg: '#fff2b8', border: '#f5b410', dash: '#f2d27f' },
];

const SKIP_COST = 50;

/* garden palette (same as Level 9 / 11 / 12 / 15) */
const NAVY = '#13235b';
const SKY = '#5cc0f5';
const PAPER = '#fffdf7';
const CREAM = '#faf0e2';
const WOOD = '#eba24e';
const WOOD_D = '#c2782c';
const WOOD_DD = '#8f5a1f';
const LIME = '#a4e02a';
const LIME_RING = '#f4f1dc';
const RED = '#f0434d';
const BADGE = '#6b4423';
const YEL_BTN = '#fbc02d';
const YEL_BTN_D = '#d98e1c';

/* ---------- garden background (same as Level 9) ---------- */
function Flower({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
      ))}
      <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
    </G>
  );
}

function Tuft({ x, y }: any) {
  return (
    <G transform={`translate(${x} ${y})`} fill="#4fb12c">
      <Polygon points="-14,0 -8,-34 -2,0" />
      <Polygon points="-4,0 4,-44 12,0" />
      <Polygon points="8,0 18,-30 24,0" />
    </G>
  );
}

function Cloud({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
      <Ellipse cx="0" cy="0" rx="70" ry="26" />
      <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
      <Ellipse cx="22" cy="-12" rx="30" ry="22" />
    </G>
  );
}

function Sprout({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <G fill="#5cb85c">
        <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
        <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
        <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
      </G>
      <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
      <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
      <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
      <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
      <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
      <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </G>
  );
}

function Garden() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* full-height sky */}
      <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="g24sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g24sky)" />
      </Svg>

      {/* trees + cloud, pinned to the top */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
        <Svg width="100%" height="100%" viewBox="0 0 942 330">
          <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
          <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
          <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
          <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
          <Cloud x={850} y={245} s={1} />
        </Svg>
      </View>

      {/* ground: hills, fence, bookshelf, sprout, meadow */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
        <Svg width="100%" height="100%" viewBox="0 0 942 1269">
          <Cloud x={50} y={585} s={0.9} />
          <Cloud x={880} y={600} s={0.6} />

          <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
          <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
          <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            const x = -10 + i * 90;
            return (
              <G key={i}>
                <Polygon points={`${x},730 ${x + 33},698 ${x + 66},730`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
                <Rect x={x} y="730" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
              </G>
            );
          })}
          <Rect x="0" y="760" width="942" height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
          <Rect x="0" y="808" width="942" height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

          <G>
            <Rect x="845" y="190" width="80" height="18" rx="4" fill="#e8903a" />
            <Polygon points="852,208 918,208 910,250 860,250" fill="#f0a050" />
            <G fill="#4cb04a">
              <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(-28 885 198)" />
              <Ellipse cx="885" cy="140" rx="20" ry="62" fill="#3a9a3c" />
              <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(28 885 198)" />
            </G>
            <Rect x="780" y="250" width="162" height="575" fill="#eaa24f" />
            <Rect x="796" y="266" width="146" height="545" fill="#dc9d4f" />
            <Rect x="780" y="440" width="162" height="16" fill="#f2b866" />
            <Rect x="780" y="630" width="162" height="16" fill="#f2b866" />
            <Rect x="780" y="250" width="162" height="16" fill="#f2b866" />
            <Rect x="810" y="310" width="36" height="130" fill="#2a9d9d" />
            <Rect x="850" y="290" width="34" height="150" fill="#f06ba8" />
            <Rect x="888" y="315" width="40" height="125" fill="#8a63da" />
            <Rect x="805" y="515" width="30" height="115" fill="#e5484d" />
            <Rect x="840" y="490" width="24" height="140" fill="#3b82e0" />
            <Rect x="868" y="510" width="38" height="120" fill="#4caf50" />
            <Rect x="810" y="695" width="34" height="120" fill="#f5c518" />
            <Rect x="848" y="665" width="40" height="150" fill="#2c6fdc" />
          </G>

          <Sprout x={10} y={740} s={1} />

          <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
          <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

          <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
          <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
          <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
          <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

          <Tuft x="905" y="925" /><Tuft x="910" y="1050" /><Tuft x="20" y="1040" />
          <Tuft x="100" y="1260" /><Tuft x="340" y="1260" /><Tuft x="580" y="1260" /><Tuft x="820" y="1260" />
          <Flower x="885" y="815" s={0.8} />
          <Flower x="200" y="1225" s={0.95} />
          <Flower x="735" y="1225" s={0.95} />
        </Svg>
      </View>
    </View>
  );
}

/* ---------- thin link chain for the hanging sign ---------- */
function Chain({ h = 28, style }: { h?: number; style?: any }) {
  const n = Math.max(2, Math.round(h / 8));
  return (
    <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
      {Array.from({ length: n }).map((_, i) => (
        <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
      ))}
    </Svg>
  );
}

/* ---------- double arrow (skip icon) ---------- */
function DoubleArrow({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
      <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
    </Svg>
  );
}

/* ---------- round letter badge (white ring + soft glow) ---------- */
const Badge = ({ id, main, light }: { id: string; main: string; light: string }) => (
  <View style={{ width: 54, height: 54, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={54} height={54} viewBox="0 0 58 58" style={{ position: 'absolute' }}>
      <Circle cx={29} cy={29} r={28} fill={light} opacity={0.55} />
      <Circle cx={29} cy={29} r={23} fill={main} stroke="#fff" strokeWidth={3} />
      <Ellipse cx={22} cy={19} rx={8} ry={4.5} fill="rgba(255,255,255,0.4)" />
    </Svg>
    <Text style={s.badgeTxt}>{id}</Text>
  </View>
);

/* ---------- hints popup (same look as Level 22 / 23) ---------- */
function HintsModal({ text, onClose }: { text: string; onClose: () => void }) {
  const pop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 7, tension: 90, useNativeDriver: true }).start();
  }, []);
  return (
    <View style={s.overlay}>
      {/* tap outside the card to close */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <Animated.View style={[s.hintCard, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }]}>
        <Text style={s.hintTitle}>HINTS</Text>
        <View style={s.hintBox}>
          <View style={s.hintNum}>
            <Text style={s.hintNumT}>1</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.hintHead}>Hint 1</Text>
            <Text style={s.hintText}>{text}</Text>
          </View>
        </View>
        <TouchableOpacity style={s.hintClose} activeOpacity={0.85} onPress={onClose}>
          <Text style={s.hintCloseT}>✕</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

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
  const [hintText, setHintText] = useState<string | null>(null);
  const busy = useRef(false);
  const actBusy = useRef(false);
  const tries = useRef(0);
  const errTimer = useRef<any>(null);
  const shake = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
    return () => clearTimeout(errTimer.current);
  }, []);

  // hanging sign sways gently (same as Level 9)
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [sway]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });
  const paperRot = pop.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '-1.5deg'] });

  const doShake = () =>
    Animated.sequence([10, -10, 6, -6, 0].map((v) =>
      Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }),
    )).start();

  const flash = (m: string) => {
    setErr(m);
    clearTimeout(errTimer.current);
    errTimer.current = setTimeout(() => setErr(''), 2000);
  };

  const onPick = async (id: string) => {
    if (busy.current || status === 'right' || hintText) return;
    busy.current = true;
    setPicked(id);
    tries.current += 1;
    try {
      const r = await answerLevel24(playerId, id, tries.current);
      if (r.correct) {
        play('correct');
        setStatus('right');
        setTimeout(() => onComplete({ ...r, skipped: false }), 1000);
      } else {
        play('wrong');
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

  // magnifier (free): frontend sends the request, backend reads the hint from the DB,
  // saves the usage and replies in JSON; the text is shown in the popup
  const useHint = async () => {
    if (actBusy.current || status === 'right' || hintText) return;
    play('clue');
    actBusy.current = true;
    try {
      const r = await requestLevel24Hint(playerId);
      const text = r?.text || r?.message;
      if (r?.success && text) setHintText(text);
      else flash('Hint not available');
    } catch (e: any) {
      flash(e?.message || 'Network error');
    } finally { actBusy.current = false; }
  };

  const closeHint = () => {
    play('btn');
    setHintText(null);
  };

  const watchVideo = async () => {
    if (actBusy.current) return;
    play('btn');
    actBusy.current = true;
    try {
      const r = await (api as any).reward(playerId, 'video');
      if (typeof r?.hints === 'number') setHints?.(r.hints);
    } catch {} finally { actBusy.current = false; }
  };

  const skipLevel = async () => {
    if (actBusy.current || status === 'right') return;
    play('btn');
    if (hints < SKIP_COST) { flash('Need ' + SKIP_COST + ' hints. You have ' + hints + '.'); return; }
    actBusy.current = true;
    try {
      const r = await (api as any).skip(24, playerId);
      setHints?.(typeof r?.hints === 'number' ? r.hints : hints - SKIP_COST);
      setStatus('right');
      setTimeout(() => onComplete({ ...r, skipped: true }), 600);
    } catch (e: any) {
      play('wrong');
      flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
    } finally { actBusy.current = false; }
  };

  /* ---------- header (same as Level 9) ---------- */
  const header = (
    <View style={s.topBar}>
      <View style={s.leftBtns}>
        <TouchableOpacity style={s.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
          <Icon n="home" s={20} />
        </TouchableOpacity>
        <TouchableOpacity style={s.woodBtn} activeOpacity={0.85}>
          <Icon n="gear" s={21} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[s.signWrap, { transform: [{ rotate: swayR }] }]}>
        <Chain h={30} style={{ left: 24, top: -6 }} />
        <Chain h={30} style={{ right: 24, top: -6 }} />
        <View style={s.sign}>
          <Text style={s.signArrow}>{'<'}</Text>
          <Text style={s.signT}>LEVEL 24</Text>
          <Text style={s.signArrow}>{'>'}</Text>
        </View>
      </Animated.View>

      <View style={s.pillWrap}>
        <View style={s.pill}>
          <Text style={s.pillT}>{hints}</Text>
        </View>
        <View style={s.pillIcon}>
          <Icon n="bulb" s={34} />
        </View>
      </View>
    </View>
  );

  return (
    <Stage bg={SKY}>
      <View style={s.root}>
        <Garden />
        {header}

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* notebook paper with the question */}
          <Animated.View style={[s.paperWrap, { opacity: pop, transform: [{ rotate: paperRot }] }]}>
            <View style={s.paperBack} />
            <View style={s.paper}>
              <View style={s.holes}>{Array.from({ length: 10 }, (_, i) => <View key={i} style={s.hole} />)}</View>
              {[0, 1, 2, 3].map((i) => <View key={i} style={[s.rule, { top: 76 + i * 32 }]} />)}
              <Text style={s.question}>{QUESTION}</Text>
            </View>
          </Animated.View>

          {/* options */}
          <Animated.View style={[s.options, { transform: [{ translateX: shake }] }]}>
            {OPTIONS.map((o) => {
              const p = picked === o.id;
              const isRight = p && status === 'right';
              const isWrong = p && status === 'wrong';
              const bg = isRight ? '#d4f5cd' : isWrong ? '#ffd0d0' : o.bg;
              return (
                <TouchableOpacity
                  key={o.id}
                  activeOpacity={0.85}
                  style={[s.option, { backgroundColor: bg, borderColor: o.border }]}
                  onPress={() => onPick(o.id)}
                >
                  <View style={[s.dashed, { borderColor: o.dash }]} pointerEvents="none" />
                  <View style={s.shine} pointerEvents="none" />
                  <Badge id={o.id} main={o.main} light={o.light} />
                  <Text style={s.optTxt}>{isRight ? o.text + ' ✓' : o.text}</Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {!!err && <Text style={s.err}>{err}</Text>}
        </ScrollView>

        {/* bottom wooden panel (same as Level 11 / 15) */}
        <View style={s.panel}>
          <View style={[s.plank, { top: 14, left: 28, right: 28 }]} />
          <View style={[s.plank, { top: 56, left: 22, right: 22 }]} />
          <View style={[s.plank, { bottom: 12, left: 28, right: 28 }]} />
          <View style={[s.screw, { left: 12, top: 12 }]} />
          <View style={[s.screw, { right: 12, top: 12 }]} />
          <View style={[s.screw, { left: 12, bottom: 12 }]} />
          <View style={[s.screw, { right: 12, bottom: 12 }]} />

          <View style={s.btnCol}>
            <TouchableOpacity style={[s.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={useHint}>
              <Icon n="search" s={28} />
            </TouchableOpacity>
            <View style={s.badge}><Icon n="bulb" s={15} /><Text style={s.badgeT}>FREE</Text></View>
          </View>

          <View style={s.btnCol}>
            <TouchableOpacity style={[s.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={watchVideo}>
              <Icon n="film" s={32} />
            </TouchableOpacity>
            <View style={s.badge}><Coin s={12} /><Text style={s.badgeT}>+75</Text></View>
          </View>

          <View style={s.btnCol}>
            <TouchableOpacity style={[s.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={skipLevel}>
              <DoubleArrow s={30} />
            </TouchableOpacity>
            <View style={s.badge}><Icon n="bulb" s={15} /><Text style={s.badgeT}>{SKIP_COST}</Text></View>
          </View>
        </View>

        {/* hint popup (text comes from the backend / database) */}
        {!!hintText && <HintsModal text={hintText} onClose={closeHint} />}
      </View>
    </Stage>
  );
}

/* =========================================================
   STYLES (garden theme same as Level 9 / 11)
========================================================= */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
  scroll: { flexGrow: 1, paddingTop: 18, paddingBottom: 170, paddingHorizontal: 14 },

  /* top bar */
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 14 },
  leftBtns: { flexDirection: 'row', gap: 8 },
  woodBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: YEL_BTN, borderWidth: 2.5, borderColor: YEL_BTN_D, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
  sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 6, backgroundColor: '#bd6b29', borderWidth: 3, borderColor: WOOD_DD, elevation: 3 },
  signT: { fontFamily: F, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  signArrow: { fontFamily: F, fontSize: 22, fontWeight: '900', color: '#ffc533' },
  pillWrap: { position: 'relative', minWidth: 88, height: 36, justifyContent: 'center' },
  pill: { height: 28, borderRadius: 14, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 14, paddingRight: 26, elevation: 3 },
  pillT: { fontFamily: F, fontSize: 18, fontWeight: '900', color: '#1b1b1b' },
  pillIcon: { position: 'absolute', right: -5, top: -3 },

  /* notebook paper */
  paperWrap: { width: '100%', marginTop: 4 },
  paperBack: { position: 'absolute', left: 6, right: -4, top: 10, bottom: -8, backgroundColor: '#ebe6d8', borderRadius: 4, transform: [{ rotate: '1.5deg' }] },
  paper: { backgroundColor: PAPER, borderRadius: 4, paddingHorizontal: 22, paddingTop: 38, paddingBottom: 10, overflow: 'hidden', elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  holes: { position: 'absolute', left: 0, right: 0, top: 8, flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10 },
  hole: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#e9c796' },
  rule: { position: 'absolute', left: 0, right: 0, height: 1.5, backgroundColor: '#cfe0f2' },
  question: { fontFamily: F, fontSize: 20, fontWeight: 'bold', color: NAVY, textAlign: 'center', lineHeight: 32, marginTop: 4 },

  /* options */
  options: { marginTop: 20, gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 32, borderWidth: 3.5,
    height: 62, paddingHorizontal: 8,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
  },
  dashed: { position: 'absolute', left: 5, right: 5, top: 5, bottom: 5, borderRadius: 28, borderWidth: 1, borderStyle: 'dashed', opacity: 0.7 },
  shine: { position: 'absolute', left: 72, right: 24, top: 7, height: 6, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.7)' },
  badgeTxt: { position: 'absolute', fontFamily: F, color: '#fff', fontSize: 26, fontWeight: '900' },
  optTxt: { flex: 1, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: '900', color: NAVY, marginRight: 46 },

  err: { marginTop: 12, alignSelf: 'center', color: '#c0392b', fontFamily: F, fontSize: 16, fontWeight: 'bold', backgroundColor: '#fff6e6', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 4, overflow: 'hidden', textAlign: 'center' },

  /* bottom wooden panel */
  panel: {
    position: 'absolute', left: 14, right: 14, bottom: 14, height: 116, borderRadius: 34,
    backgroundColor: WOOD, borderWidth: 5, borderColor: WOOD_D,
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 10, elevation: 6,
  },
  plank: { position: 'absolute', height: 2, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
  screw: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: WOOD_DD },
  btnCol: { alignItems: 'center' },
  circleBtn: { width: 60, height: 60, borderRadius: 30, borderWidth: 5, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 5, minWidth: 62, paddingHorizontal: 10, height: 26, borderRadius: 13, backgroundColor: BADGE },
  badgeT: { fontFamily: F, fontSize: 14, fontWeight: '900', color: '#fff' },

  /* hint popup */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30,40,60,0.55)',
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 14, zIndex: 100, elevation: 20,
  },
  hintCard: {
    width: '100%', maxWidth: 400, backgroundColor: CREAM, borderRadius: 30,
    borderWidth: 5, borderColor: '#c9792b', paddingHorizontal: 16, paddingTop: 18, paddingBottom: 20,
    elevation: 24,
  },
  hintTitle: { fontFamily: F, fontSize: 34, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
  hintBox: {
    flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fffaf1',
    borderRadius: 20, borderWidth: 3, borderColor: '#3cc15a', paddingVertical: 14, paddingHorizontal: 14,
  },
  hintNum: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#b8651f', alignItems: 'center', justifyContent: 'center' },
  hintNumT: { fontFamily: F, fontSize: 30, fontWeight: '900', color: '#fff' },
  hintHead: { fontFamily: SERIF, fontSize: 20, fontWeight: '700', color: '#b8651f', marginBottom: 2 },
  hintText: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', lineHeight: 21 },
  hintClose: {
    position: 'absolute', top: -16, right: -12, width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#f4a24c', borderWidth: 3, borderColor: '#c9792b', alignItems: 'center', justifyContent: 'center', elevation: 26,
  },
  hintCloseT: { fontFamily: F, fontSize: 22, fontWeight: '900', color: '#e5484d', lineHeight: 26 },
});
