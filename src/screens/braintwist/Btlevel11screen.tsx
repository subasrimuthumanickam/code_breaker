
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Pressable, Animated, StyleSheet, Easing, ScrollView, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Stage, F, INK, Coin } from './BTShared';
import { Icon } from './Art';
import * as api from './Btlevel11api';
import * as mainApi from './api';
import { play } from './BTSound';

/* garden palette (same as Level 5 / Level 9) */
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
const GREEN_OK = '#3ec45a';
const YEL_BTN = '#fbc02d';
const YEL_BTN_D = '#d98e1c';

// clue shown in the CLUES popup when the magnifier is tapped
const CLUE_1 = "Don't think about time itself. Think about the words in the question.";

// scale of the clock picture (fits the shorter card)
const CLOCK_SCALE = 0.8;
const CLOCK_H = 176;

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
          <LinearGradient id="g11sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g11sky)" />
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

/* ---------- alarm clock scene (plain Views, scaled to fit the shorter card) ---------- */
const ClockArt = ({ bob }: any) => {
  const wig = bob.interpolate({ inputRange: [0, 1], outputRange: ['-3deg', '3deg'] });
  // scaling happens around the centre, so push it down to keep the bottom edge in place
  const dropY = (CLOCK_H * (1 - CLOCK_SCALE)) / 2;
  return (
    <View style={s.scene}>
      <View style={s.cloudA} /><View style={s.cloudB} />
      <View style={s.deskArt} />
      {/* shine rays */}
      <View style={[s.rayA, { left: '18%', top: 50, transform: [{ rotate: '-10deg' }] }]} />
      <View style={[s.rayA, { left: '22%', top: 90, transform: [{ rotate: '30deg' }] }]} />
      <View style={[s.rayA, { right: '30%', top: 44, transform: [{ rotate: '-40deg' }] }]} />
      <View style={[s.rayA, { right: '28%', top: 84, transform: [{ rotate: '-5deg' }] }]} />
      <Animated.View style={[s.clockWrap, { transform: [{ translateY: dropY }, { rotate: wig }, { scale: CLOCK_SCALE }] }]}>
        <View style={[s.bell, { left: 8, transform: [{ rotate: '-28deg' }] }]} /><View style={[s.bell, { right: 8, transform: [{ rotate: '28deg' }] }]} />
        <View style={s.handle} />
        <View style={s.clockBody}>
          <View style={s.faceIn}>
            <Text style={[s.cn, { top: 1, left: 0, right: 0, textAlign: 'center' }]}>12</Text>
            <Text style={[s.cn, { bottom: 1, left: 0, right: 0, textAlign: 'center' }]}>6</Text>
            <Text style={[s.cn, { right: 5, top: 44 }]}>3</Text>
            <Text style={[s.cn, { left: 5, top: 44 }]}>9</Text>
            {/* hour + minute hands */}
            <View style={[s.handBox, { transform: [{ rotate: '-70deg' }] }]}><View style={[s.hand, { top: 56 - 26, height: 26, backgroundColor: INK }]} /></View>
            <View style={[s.handBox, { transform: [{ rotate: '62deg' }] }]}><View style={[s.hand, { top: 56 - 38, height: 38, backgroundColor: '#e5384b' }]} /></View>
            <View style={s.pin} />
            {/* happy face */}
            <View style={[s.eye, { left: 30 }]} /><View style={[s.eye, { right: 30 }]} />
            <View style={s.mouth} />
          </View>
        </View>
        <View style={[s.legC, { left: 26, transform: [{ rotate: '14deg' }] }]} /><View style={[s.legC, { right: 26, transform: [{ rotate: '-14deg' }] }]} />
      </Animated.View>
      {/* plant on books */}
      <View style={s.books}>
        <View style={[s.bookC, { backgroundColor: '#e86fae', width: 92 }]} /><View style={[s.bookC, { backgroundColor: '#6a7fd0', width: 84, marginLeft: 6 }]} />
        <View style={s.plantBox}>
          <View style={[s.leafC, { left: 2, transform: [{ rotate: '-30deg' }] }]} /><View style={[s.leafC, { left: 16, height: 34, backgroundColor: '#3f9a2e' }]} /><View style={[s.leafC, { left: 30, transform: [{ rotate: '30deg' }] }]} />
          <View style={s.pot} />
        </View>
      </View>
    </View>
  );
};

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevel11Screen({ playerId, hints, setHints, onExit, onComplete }: any) {
  const { width } = useWindowDimensions();
  const wide = width >= 700;
  const [lv, setLv] = useState<any>(null), [typed, setTyped] = useState(''), [ov, setOv] = useState<string | null>(null),
    [note, setNote] = useState(''), [done, setDone] = useState(false), [busy, setBusy] = useState(false),
    [clueOpen, setClueOpen] = useState(false);
  const lock = useRef(false);   // one check at a time
  const shake = useRef(new Animated.Value(0)).current,
    bob = useRef(new Animated.Value(0)).current, qIn = useRef(new Animated.Value(0)).current,
    sway = useRef(new Animated.Value(0)).current,
    pop = useRef(new Animated.Value(0)).current;
  const flash = (m: string) => { setNote(m); setTimeout(() => setNote(''), 1800); };
  const doShake = () => Animated.sequence([10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();
  const yoyo = (v: Animated.Value, ms: number) => Animated.loop(Animated.sequence([
    Animated.timing(v, { toValue: 1, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    Animated.timing(v, { toValue: 0, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true })])).start();

  // hanging sign sways gently (same as Level 5 / Level 9)
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [sway]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

  /* frontend -> backend: start the level */
  useEffect(() => {
    api.start(playerId).then((r: any) => {
      setLv(r.level);
      if (typeof r.hints === 'number') setHints && setHints(r.hints);
      Animated.spring(qIn, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
    }).catch(() => flash('Cannot load level 11'));
    yoyo(bob, 700);
  }, []);

  const qRot = qIn.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '-1.5deg'] });

  // result symbol pops in each time it shows
  const popIn = () => { pop.setValue(0); Animated.spring(pop, { toValue: 1, friction: 5, tension: 150, useNativeDriver: true }).start(); };

  /* frontend -> backend: check the answer INSTANTLY while typing (no Enter / button) */
  const check = async (val: string) => {
    if (done || lock.current || !val.trim()) return;
    lock.current = true; setBusy(true);
    try {
      const r: any = await api.answer(playerId, val.trim());
      if (r.correct) {
        play('correct');
        setOv('check'); popIn(); setDone(true);
        setTimeout(() => onComplete && onComplete({ ...r, skipped: false }), 1100);
      } else {
        play('wrong');
        doShake(); setOv('cross'); popIn(); flash(r.message || 'Wrong answer!');
        setTimeout(() => { setOv(null); setTyped(''); }, 800);
      }
    } catch (e: any) {
      flash('Network error'); setTyped('');
    }
    lock.current = false; setBusy(false);
  };

  // letters AND numbers allowed; result shows immediately
  const onType = (t: string) => {
    if (done || ov) return;
    const c = t.replace(/[^a-zA-Z0-9 ]/g, '');
    setTyped(c);
    if (c.trim()) check(c);
  };

  // Ask the backend to record the free hint before opening the clue.
  const hint = async () => {
    if (busy) return;
    play('clue');
    setBusy(true);
    try {
      const r: any = await mainApi.recordHintUse(11, playerId);
      if (typeof r.hints === 'number') setHints && setHints(r.hints);
      setClueOpen(true);
    } catch (e: any) {
      flash(e.message || 'Could not load hint');
    } finally {
      setBusy(false);
    }
  };
  const skip = async () => {
    play('btn');
    try {
      const r: any = await api.skip(playerId);
      if (typeof r.hints === 'number') setHints && setHints(r.hints);
      setDone(true); onComplete && onComplete({ ...r, skipped: true });
    } catch (e: any) { play('wrong'); flash(e.status === 402 ? 'Not enough hints' : 'Network error'); }
  };
  const video = async () => {
    play('btn');
    try { const r: any = await mainApi.reward(playerId, 'video'); setHints && setHints(r.hints); } catch (e) { }
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
          <Text style={s.signT}>LEVEL 11</Text>
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

  /* ---------- loading ---------- */
  if (!lv) {
    return (
      <Stage bg={SKY}>
        <View style={s.root}>
          <Garden />
          {header}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={s.load}>{note || 'Loading level 11...'}</Text>
          </View>
        </View>
      </Stage>
    );
  }

  /* ---- notebook paper with the question ---- */
  const Paper = (
    <Animated.View style={[s.paperWrap, wide && { width: '42%' }, { opacity: qIn, transform: [{ rotate: qRot }] }]}>
      <View style={s.paperBack} />
      <View style={s.paper}>
        <View style={s.holes}>{Array.from({ length: 10 }, (_, i) => <View key={i} style={s.hole} />)}</View>
        {[0, 1, 2].map((i) => <View key={i} style={[s.rule, { top: 76 + i * 32 }]} />)}
        <Text style={s.q}>{lv.question}</Text>
      </View>
    </Animated.View>
  );

  /* ---- picture card + input ---- */
  const Right = (
    <View style={[s.right, wide && { width: '52%' }]}>
      <Animated.View style={[s.card, { transform: [{ translateX: shake }] }]}>
        <ClockArt bob={bob} />
      </Animated.View>
      <View style={[s.inputPill, ov === 'check' && { borderColor: '#2a9a43' }, ov === 'cross' && { borderColor: '#b81f29' }]}>
        <TextInput style={s.input} value={typed} placeholder="Type here..." placeholderTextColor="#b7b0a2"
          autoCapitalize="none" autoCorrect={false} maxLength={lv.maxDigits || 30} editable={!done && !ov}
          onChangeText={onType} returnKeyType="done" />
        {!!ov && (
          <Animated.View pointerEvents="none" style={[s.cov, {
            backgroundColor: ov === 'check' ? 'rgba(70,194,95,0.45)' : 'rgba(238,70,80,0.40)',
            opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
          }]}>
            <Icon n={ov} s={46} />
          </Animated.View>
        )}
      </View>
      {!!note && <Text style={s.note}>{note}</Text>}
    </View>
  );

  return (
    <Stage bg={SKY}>
      <View style={s.root}>
        <Garden />
        {header}

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={[s.main, wide && { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            {Paper}{Right}
          </View>
        </ScrollView>

        {/* bottom wooden panel (smaller) */}
        <View style={s.panel}>
          <View style={[s.plank, { top: 14, left: 28, right: 28 }]} />
          <View style={[s.plank, { top: 56, left: 22, right: 22 }]} />
          <View style={[s.plank, { bottom: 12, left: 28, right: 28 }]} />
          <View style={[s.screw, { left: 12, top: 12 }]} />
          <View style={[s.screw, { right: 12, top: 12 }]} />
          <View style={[s.screw, { left: 12, bottom: 12 }]} />
          <View style={[s.screw, { right: 12, bottom: 12 }]} />

          <View style={s.btnCol}>
            <TouchableOpacity style={[s.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={hint}>
              <Icon n="search" s={28} />
            </TouchableOpacity>
            <View style={s.badge}><Text style={s.badgeT}>FREE</Text></View>
          </View>

          <View style={s.btnCol}>
            <TouchableOpacity style={[s.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={video}>
              <Icon n="film" s={32} />
            </TouchableOpacity>
            <View style={s.badge}><Coin s={12} /><Text style={s.badgeT}>+75</Text></View>
          </View>

          <View style={s.btnCol}>
            <TouchableOpacity style={[s.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={skip}>
              <DoubleArrow s={30} />
            </TouchableOpacity>
            <View style={s.badge}><Icon n="bulb" s={15} /><Text style={s.badgeT}>{lv.skipCost}</Text></View>
          </View>
        </View>

        {/* CLUES popup (only from the magnifier) */}
        {clueOpen && (
          <View style={s.overlay}>
            <View style={s.clueCard}>
              <TouchableOpacity style={s.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
                <Icon n="cross" s={20} />
              </TouchableOpacity>
              <Text style={s.clueTitle}>HINTS</Text>

              <View style={s.clueRow}>
                <View style={s.clueNum}><Text style={s.clueNumT}>1</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.clueHead}>Hint 1</Text>
                  <Text style={s.clueBody}>{CLUE_1}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </Stage>
  );
}

/* =========================================================
   STYLES (garden theme same as Level 9)
========================================================= */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
  scroll: { flexGrow: 1, paddingTop: 16, paddingBottom: 160, paddingHorizontal: 12 },
  load: { fontFamily: F, fontSize: 22, color: '#fff' },

  /* top bar (Level 9) */
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

  /* layout */
  main: { marginTop: 8, gap: 16 },
  right: { width: '100%', gap: 12 },

  /* notebook paper */
  paperWrap: { width: '100%', minHeight: 150 },
  paperBack: { position: 'absolute', left: 6, right: -4, top: 10, bottom: -8, backgroundColor: '#ebe6d8', borderRadius: 4, transform: [{ rotate: '1.5deg' }] },
  paper: { backgroundColor: PAPER, borderRadius: 4, minHeight: 150, paddingHorizontal: 22, paddingTop: 38, paddingBottom: 12, overflow: 'hidden', elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  holes: { position: 'absolute', left: 0, right: 0, top: 8, flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10 },
  hole: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#e9c796' },
  rule: { position: 'absolute', left: 0, right: 0, height: 1.5, backgroundColor: '#cfe0f2' },
  q: { fontFamily: F, fontSize: 20, fontWeight: 'bold', color: NAVY, textAlign: 'center', lineHeight: 32, marginTop: 4 },

  /* picture card (shorter so the input box stays above the wooden panel) */
  card: { height: 170, borderRadius: 18, borderWidth: 4, borderColor: INK, backgroundColor: '#3fc1f5', overflow: 'hidden', justifyContent: 'flex-end' },

  /* input (no button: result shows instantly while typing) */
  inputPill: { height: 54, borderRadius: 27, borderWidth: 3, borderColor: INK, backgroundColor: '#fffaf0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, overflow: 'hidden' },
  input: { flex: 1, fontFamily: F, fontSize: 26, fontWeight: 'bold', color: INK, paddingVertical: 0 },
  cov: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 27 },
  note: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: '#c0392b', textAlign: 'center' },

  /* bottom wooden panel (smaller) */
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

  /* clue popup (Level 9) */
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  clueCard: { width: '86%', maxWidth: 360, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
  clueTitle: { fontFamily: F, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
  closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12, backgroundColor: '#fff', borderColor: GREEN_OK },
  clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
  clueNumT: { fontFamily: F, fontSize: 28, fontWeight: '900', color: '#fff' },
  clueHead: { fontFamily: F, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
  clueBody: { fontFamily: F, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },

  /* clock scene */
  scene: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  cloudA: { position: 'absolute', left: '6%', top: 16, width: 80, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.9)' },
  cloudB: { position: 'absolute', right: '8%', top: 10, width: 64, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.85)' },
  deskArt: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 36, backgroundColor: '#f2a04a', borderTopWidth: 3, borderColor: INK },
  rayA: { position: 'absolute', width: 22, height: 6, borderRadius: 3, backgroundColor: '#ffd93b' },
  clockWrap: { position: 'absolute', left: '50%', marginLeft: -82, bottom: 8, width: 164, height: CLOCK_H },
  bell: { position: 'absolute', top: 0, width: 44, height: 26, borderTopLeftRadius: 26, borderTopRightRadius: 26, backgroundColor: '#f5b82e', borderWidth: 3, borderColor: INK },
  handle: { position: 'absolute', top: 4, left: 42, width: 80, height: 22, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderWidth: 5, borderBottomWidth: 0, borderColor: '#4b4b5a' },
  clockBody: { position: 'absolute', top: 16, left: 14, width: 136, height: 136, borderRadius: 68, backgroundColor: '#e5384b', borderWidth: 3, borderColor: INK, alignItems: 'center', justifyContent: 'center' },
  faceIn: { width: 112, height: 112, borderRadius: 56, backgroundColor: '#fff8e8', borderWidth: 2, borderColor: INK, overflow: 'hidden' },
  cn: { position: 'absolute', fontFamily: F, fontSize: 12, fontWeight: 'bold', color: INK },
  handBox: { position: 'absolute', left: 0, top: 0, width: 112, height: 112 },
  hand: { position: 'absolute', left: 54, width: 4, borderRadius: 2 },
  pin: { position: 'absolute', left: 51, top: 51, width: 10, height: 10, borderRadius: 5, backgroundColor: '#e5384b', borderWidth: 2, borderColor: INK },
  eye: { position: 'absolute', top: 62, width: 14, height: 8, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderTopWidth: 3, borderColor: INK },
  mouth: { position: 'absolute', top: 78, left: 41, width: 30, height: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, backgroundColor: '#e5304a', borderWidth: 2, borderColor: INK },
  legC: { position: 'absolute', bottom: 0, width: 10, height: 22, borderRadius: 4, backgroundColor: '#4b4b5a' },
  books: { position: 'absolute', right: -6, bottom: 36, width: 104 },
  bookC: { height: 18, borderRadius: 3, borderWidth: 2, borderColor: INK, marginTop: 1 },
  plantBox: { position: 'absolute', left: 24, bottom: 34, width: 56, height: 70 },
  leafC: { position: 'absolute', bottom: 24, width: 18, height: 42, borderRadius: 10, backgroundColor: '#4fae3a', borderWidth: 2, borderColor: INK },
  pot: { position: 'absolute', left: 8, bottom: 0, width: 40, height: 26, borderRadius: 5, backgroundColor: '#e8802a', borderWidth: 2, borderColor: INK },
});