
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Pressable, Animated, Easing, StyleSheet, Platform, ActivityIndicator,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as api from './api'; // same helpers the other levels use (hint / skip / reward)
import { F, Stage, Coin } from './BTShared';
import { Icon } from './Art';
import { play } from './BTSound';
import { startLevel22, submitLevel22Answer } from './Btlevel22api';
import { ApplesGame } from './Btlevel22art';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

/* garden palette (same as Level 16 - 21) */
const NAVY = '#13235b';
const SKY = '#5cc0f5';
const CREAM = '#faf0e2';
const CREAM_BORDER = '#ead2a4';
const WOOD = '#eba24e';
const WOOD_D = '#c2782c';
const WOOD_DD = '#8f5a1f';
const LIME = '#a4e02a';
const LIME_RING = '#f4f1dc';
const RED = '#f0434d';
const ARROW = '#ffb629';
const BADGE = '#6b4423';
const YEL_BTN = '#fbc02d';
const YEL_BTN_D = '#d98e1c';

const LEVEL = 22;
const SKIP_COST = 50;

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onComplete?: (r: any) => void;
};

/* ---------- garden background ---------- */
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
      <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="g22sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g22sky)" />
      </Svg>

      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
        <Svg width="100%" height="100%" viewBox="0 0 942 330">
          <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
          <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
          <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
          <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
          <Cloud x={850} y={245} s={1} />
        </Svg>
      </View>

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

/* ---------- chain for the hanging sign ---------- */
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

/* =========================================================
   SCREEN
========================================================= */

export default function Btlevel22screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
  const bal = Number(hints) || 0;

  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [note, setNote] = useState('');
  const [resetKey, setResetKey] = useState(0); // changing it rebuilds the apples game

  const busy = useRef(false);
  const done = useRef(false);
  const noteTimer = useRef<any>(null);
  const shake = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const qIn = useRef(new Animated.Value(0)).current;

  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });
  const qY = qIn.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

  const flash = (m: string, ms = 2200) => {
    setNote(m);
    clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(''), ms);
  };
  const doShake = () =>
    Animated.sequence(
      [10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))
    ).start();

  const start = async () => {
    setLoading(true);
    setNote('');
    try {
      const data = await startLevel22(playerId);
      if (data.success) {
        setSessionId(data.sessionId);
        setQuestion(data.question.text);
      } else {
        setNote(data.error || 'Cannot load level 22');
      }
    } catch (e) {
      console.log('[L22] start failed:', e);
      setNote('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    start();
  }, [playerId]);

  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    Animated.spring(qIn, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
    return () => { a.stop(); clearTimeout(noteTimer.current); };
  }, []);

  // ---- the game finished: send the moves, the server decides ----
  const onFinish = async (moves: string[]) => {
    if (!sessionId || busy.current || done.current) return;
    busy.current = true;
    try {
      const data = await submitLevel22Answer(playerId, sessionId, moves);
      if (data.success && data.correct) {
        play('correct');
        done.current = true;
        setResult('correct');
        flash('Perfect! Nobody left the plate empty.', 1500);
        setTimeout(
          () => onComplete?.({ attempts: data.attempts || 1, skipped: false, correct: true }),
          1300
        );
      } else {
        play('wrong');
        setResult('wrong');
        doShake();
        flash(data.success ? data.explanation || 'Not quite. Try again!' : data.error || 'Something went wrong', 1800);
        setTimeout(() => {
          setResult(null);
          setResetKey((k) => k + 1);
        }, 1100);
      }
    } catch (e) {
      console.log('[L22] answer failed:', e);
      flash('Network error');
      setTimeout(() => setResetKey((k) => k + 1), 1100);
    } finally {
      busy.current = false;
    }
  };

  // ---- hint / video / skip (same costs as the other levels) ----
  const hint = async () => {
    if (busy.current || done.current) return;
    play('clue');
    busy.current = true;
    try {
      const r: any = await api.recordHintUse(LEVEL, playerId);
      if (typeof r?.hints === 'number') setHints?.(r.hints);
      flash(
        r?.hint?.text || 'The plate must never be empty. Think about the last apple...',
        3500
      );
    } catch (e: any) {
      flash(e?.message || 'Hint not available');
    } finally {
      busy.current = false;
    }
  };

  const video = async () => {
    if (busy.current) return;
    busy.current = true;
    play('btn');
    try {
      const r: any = await api.reward(playerId, 'video');
      if (typeof r?.hints === 'number') setHints?.(r.hints);
    } catch (e) {
    } finally {
      busy.current = false;
    }
  };

  const skip = async () => {
    if (busy.current || done.current) return;
    play('btn');
    if (bal < SKIP_COST) {
      flash('Need ' + SKIP_COST + ' hints. You have ' + bal + '.');
      return;
    }
    busy.current = true;
    try {
      const r: any = await api.skip(LEVEL, playerId);
      setHints?.(typeof r?.hints === 'number' ? r.hints : bal - SKIP_COST);
      done.current = true;
      onComplete?.({ attempts: 1, skipped: true });
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Skip not available');
    } finally {
      busy.current = false;
    }
  };

  const frame =
    result === 'correct' ? '#6cc644' : result === 'wrong' ? '#e74c3c' : 'transparent';

  /* ---------- header (same as Level 16 - 21) ---------- */
  const header = (
    <View style={st.topBar}>
      <View style={st.leftBtns}>
        <TouchableOpacity style={st.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit?.(); }}>
          <Icon n="home" s={20} />
        </TouchableOpacity>
        <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
          <Icon n="gear" s={21} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
        <Chain h={30} style={{ left: 24, top: -6 }} />
        <Chain h={30} style={{ right: 24, top: -6 }} />
        <View style={st.sign}>
          <Text style={st.signArrow}>{'<'}</Text>
          <Text style={st.signT}>{'LEVEL ' + LEVEL}</Text>
          <Text style={st.signArrow}>{'>'}</Text>
        </View>
      </Animated.View>

      <View style={st.pillWrap}>
        <View style={st.pill}>
          <Text style={st.pillT} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{hints ?? 0}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Stage bg={SKY}>
      <View style={st.root}>
        <Garden />
        {header}

        {/* question pill */}
        <Animated.View style={[st.qWrap, { opacity: qIn, transform: [{ translateY: qY }] }]}>
          <View style={st.qPill}>
            <Text style={st.qArrow}>{'<'}</Text>
            {loading ? (
              <ActivityIndicator color={NAVY} />
            ) : (
              <Text style={st.q}>{question || 'Could not load the question.'}</Text>
            )}
            <Text style={st.qArrow}>{'>'}</Text>
          </View>
        </Animated.View>

        {!loading && !sessionId && (
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <TouchableOpacity style={st.retry} onPress={() => { play('btn'); start(); }}>
              <Text style={st.retryT}>Tap to retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* kids + apples + plate */}
        <View style={st.play}>
          {!!sessionId && (
            <Animated.View style={{ alignItems: 'center', transform: [{ translateX: shake }] }}>
              <View style={[st.frame, { borderColor: frame }]}>
                <ApplesGame key={resetKey} onFinish={onFinish} />
              </View>
            </Animated.View>
          )}
        </View>

        {!!note && <View style={st.noteWrap} pointerEvents="none"><Text style={st.note}>{note}</Text></View>}

        {/* bottom wooden panel (smaller, same as Level 16 - 21) */}
        <View style={st.panel}>
          <View style={[st.plank, { top: 14, left: 28, right: 28 }]} />
          <View style={[st.plank, { top: 56, left: 22, right: 22 }]} />
          <View style={[st.plank, { bottom: 12, left: 28, right: 28 }]} />
          <View style={[st.screw, { left: 12, top: 12 }]} />
          <View style={[st.screw, { right: 12, top: 12 }]} />
          <View style={[st.screw, { left: 12, bottom: 12 }]} />
          <View style={[st.screw, { right: 12, bottom: 12 }]} />

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={hint}>
              <Icon n="search" s={28} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>FREE</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={video}>
              <Icon n="film" s={32} />
            </TouchableOpacity>
            <View style={st.badge}><Coin s={12} /><Text style={st.badgeT}>+75</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={skip}>
              <DoubleArrow s={30} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>{SKIP_COST}</Text></View>
          </View>
        </View>
      </View>
    </Stage>
  );
}

/* =========================================================
   STYLES
========================================================= */

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 14 },
  leftBtns: { flexDirection: 'row', gap: 8 },
  woodBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: YEL_BTN, borderWidth: 2.5, borderColor: YEL_BTN_D, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
  sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 6, backgroundColor: '#bd6b29', borderWidth: 3, borderColor: WOOD_DD, elevation: 3 },
  signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },

  // hint counter (small, fixed size)
  pillWrap: { width: 54, height: 44, justifyContent: 'center', alignItems: 'center' },
  pill: { width: 54, height: 28, borderRadius: 14, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, elevation: 3 },
  pillT: { fontFamily: FONT, fontSize: 15, fontWeight: '900', color: '#1b1b1b', textAlign: 'center' },

  qWrap: { alignItems: 'center', marginTop: 12, paddingHorizontal: 12 },
  qPill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 14, maxWidth: 400, elevation: 3 },
  qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
  q: { flexShrink: 1, fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

  retry: { backgroundColor: LIME, borderWidth: 3, borderColor: '#1b1b1b', borderRadius: 30, paddingHorizontal: 30, paddingVertical: 8 },
  retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },

  // apples game area
  play: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 135 },
  frame: { borderWidth: 3, borderRadius: 26, padding: 0 },

  noteWrap: { position: 'absolute', left: 0, right: 0, bottom: 140, alignItems: 'center', zIndex: 20 },
  note: { fontFamily: FONT, fontSize: 17, fontWeight: 'bold', color: '#c0392b', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', maxWidth: '92%' },

  // bottom wooden panel (smaller: solid wood, plank lines, corner rivets)
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
  badgeT: { fontFamily: FONT, fontSize: 14, fontWeight: '900', color: '#fff' },
});