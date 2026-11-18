
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, PanResponder, StyleSheet, Platform,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Stage, F, Coin } from './BTShared';
import { Icon } from './Art';
// ⚠ ithu ellam un original file-la irundha import lines-ah match pannunga (path maaritha maathikonga)
import { Shelf, Sofa, Pillow, Clothes, Flame, Torch } from './Btlevel13art';
import * as l13 from './Btlevel13api';
import * as api from './api';
import { play } from './BTSound';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

const SW = 320, SH = 300;
const TORCH = { x: 18, y: 40, w: 44, h: 120, tipX: 22, tipY: 16 };

/* garden palette (same as Level 9) */
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
const GREEN_OK = '#3ec45a';
const YEL_BTN = '#fbc02d';
const YEL_BTN_D = '#d98e1c';

// TODO: change this text if you want a different clue 1

// hit boxes inside the 320 x 300 scene: [x, y, w, h]  (checked in this order)
// (backend id 'cat' appadiye iruku, ippo adhu teddy-ya kaattum)
const BOX: any = { text: [30, -52, 260, 44], cat: [158, 22, 52, 60], pillow: [140, 138, 60, 52], clothes: [210, 208, 90, 60], shelf: [70, 74, 180, 30], sofa: [35, 118, 250, 140] };
const ORDER = ['text', 'cat', 'pillow', 'clothes', 'shelf', 'sofa'];
const ALL = ['sofa', 'pillow', 'clothes', 'shelf', 'cat', 'text'];
const hitTest = (x: number, y: number) => ORDER.find((k) => { const [bx, by, bw, bh] = BOX[k]; return x >= bx && x <= bx + bw && y >= by && y <= by + bh; });

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
      <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="g13sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g13sky)" />
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

/* ---------- teddy bear (cat-ku badhila) ---------- */
function Teddy({ w, burned }: { w: number; burned: boolean }) {
  const fur = burned ? '#3b2c25' : '#b9753c';
  const light = burned ? '#2a1f1a' : '#dba165';
  const dark = burned ? '#1b1411' : '#4a2c14';
  const eye = burned ? '#8a7d75' : '#2b1a0c';
  return (
    <Svg width={w} height={w * 1.1} viewBox="0 0 100 110">
      {/* ears */}
      <Circle cx="24" cy="16" r="12" fill={fur} />
      <Circle cx="24" cy="16" r="6" fill={light} />
      <Circle cx="76" cy="16" r="12" fill={fur} />
      <Circle cx="76" cy="16" r="6" fill={light} />
      {/* arms + legs */}
      <Ellipse cx="22" cy="72" rx="8" ry="16" fill={fur} transform="rotate(20 22 72)" />
      <Ellipse cx="78" cy="72" rx="8" ry="16" fill={fur} transform="rotate(-20 78 72)" />
      <Ellipse cx="34" cy="100" rx="13" ry="8" fill={fur} />
      <Ellipse cx="66" cy="100" rx="13" ry="8" fill={fur} />
      <Ellipse cx="34" cy="101" rx="7" ry="4" fill={light} />
      <Ellipse cx="66" cy="101" rx="7" ry="4" fill={light} />
      {/* body */}
      <Ellipse cx="50" cy="78" rx="27" ry="26" fill={fur} />
      <Ellipse cx="50" cy="82" rx="16" ry="16" fill={light} />
      {/* head */}
      <Circle cx="50" cy="34" r="27" fill={fur} />
      <Ellipse cx="50" cy="43" rx="13" ry="10" fill={light} />
      <Ellipse cx="50" cy="39" rx="4.5" ry="3.2" fill={dark} />
      <Circle cx="40" cy="29" r="3.2" fill={eye} />
      <Circle cx="60" cy="29" r="3.2" fill={eye} />
      <Path d="M44 46 Q50 51 56 46" stroke={dark} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* bow */}
      <Polygon points="50,58 38,53 38,65" fill={burned ? '#3a2a2a' : '#ee4558'} />
      <Polygon points="50,58 62,53 62,65" fill={burned ? '#3a2a2a' : '#ee4558'} />
      <Circle cx="50" cy="58" r="3.5" fill={burned ? '#2a1f1a' : '#c92c3e'} />
    </Svg>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevel13Screen({ playerId, hints, setHints, onHints, onExit, onComplete }: any) {
  const [sid, setSid] = useState<number | null>(null);
  const [burned, setBurned] = useState<string[]>([]);
  const [catGone, setCatGone] = useState(false);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [clueOpen, setClueOpen] = useState(false);
  const [clueText, setClueText] = useState('');

  const sidR = useRef<number | null>(null), busyR = useRef(false), doneR = useRef(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const shake = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const catX = useRef(new Animated.Value(0)).current, catY = useRef(new Animated.Value(0)).current, catO = useRef(new Animated.Value(1)).current;

  const setH = (v: number) => { setHints?.(v); onHints?.(v); };
  const flash = (m: string) => { setNote(m); setTimeout(() => setNote(''), 2200); };
  const doShake = () => Animated.sequence([10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();
  const runAway = () => {
    setCatGone(true);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(catY, { toValue: -16, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(catY, { toValue: 62, duration: 380, easing: Easing.in(Easing.quad), useNativeDriver: true })]),
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(catX, { toValue: -190, duration: 1100, easing: Easing.linear, useNativeDriver: true })]),
      Animated.sequence([Animated.delay(900), Animated.timing(catO, { toValue: 0, duration: 400, useNativeDriver: true })])]).start();
  };

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

  /* ---- start a session; always begin with a clean scene (no fire) ---- */
  useEffect(() => {
    l13.start(playerId).then((r: any) => {
      sidR.current = r.sessionId; setSid(r.sessionId); setBurned([]);
      setLoading(false);
    }).catch((e: any) => { setLoading(false); flash(e?.message || 'Cannot load level 13'); });
  }, []);

  const addB = (...k: string[]) => setBurned((b) => Array.from(new Set([...b, ...k])));

  /* ---- burn something ---- */
  const burn = async (item: string) => {
    if (busyR.current || doneR.current) return;
    if (item === 'text') { play('tap'); addB('text'); return; }          // text is only visual
    if (item === 'cat' && catGone) return;
    if (!sidR.current) return;
    busyR.current = true;
    play('tap');
    try {
      const r = await l13.burn(playerId, sidR.current, item);
      if (item === 'cat') addB('cat');
      else if (r.newlyBurned?.length) addB(...r.newlyBurned);
      else if (r.correct !== false) addB(item);
      if (r.catEscaped && !catGone && item !== 'cat') runAway();
      if (r.correct === false && item !== 'cat') { play('wrong'); doShake(); }
      if (r.message && item !== 'cat') flash(r.message);
      if (r.completed && !doneR.current) {
        doneR.current = true;
        play('correct');
        setTimeout(() => onComplete?.({ correct: true, completed: true, attempts: r.attempts }), 1500);
      }
    } catch (e: any) { flash(e?.message || 'Network error'); }
    finally { busyR.current = false; }
  };

  /* ---- everything burned (incl. teddy + text) -> finish the level ---- */
  useEffect(() => {
    if (ALL.every((k) => burned.includes(k)) && !doneR.current) {
      const t = setTimeout(() => {
        if (doneR.current) return;
        doneR.current = true;
        play('correct');
        onComplete?.({ correct: true, completed: true, attempts: 1 });
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [burned]);

  /* ---- draggable torch ---- */
  const pr = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !busyR.current && !doneR.current,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      const tx = TORCH.x + g.dx + TORCH.tipX, ty = TORCH.y + g.dy + TORCH.tipY;
      const item = hitTest(tx, ty);
      Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();
      if (item) burn(item);
    },
  })).current;

  /* ---- clues popup / video / skip ---- */
  const openClues = async () => {
    if (doneR.current || busyR.current || !sidR.current) return;
    busyR.current = true;
    play('clue');
    try {
      const r = await l13.hint(playerId, sidR.current);
      if (typeof r.hints === 'number') setH(r.hints);
      setClueText(r.text || 'No hint available.');
      setClueOpen(true);
    } catch (e: any) {
      flash(e?.message || 'Could not load hint');
    } finally {
      busyR.current = false;
    }
  };
  const reward = async (k: 'video' | 'gift') => { play('btn'); try { const r = await api.reward(playerId, k); setH(r.hints); } catch (e) { } };
  const skip = async () => {
    play('btn');
    try { const r = await api.skip(13, playerId); if (typeof hints === 'number') setH(hints - 50); onComplete?.({ ...r, skipped: true, attempts: 1 }); }
    catch (e: any) { play('wrong'); flash(e?.status === 402 ? 'Not enough hints' : 'Network error'); }
  };

  const has = (k: string) => burned.includes(k);
  const allBurned = ALL.every(has);
  const fires: [string, number, number, number][] = [
    ['sofa', 70, 92, 26], ['sofa', 150, 98, 30], ['sofa', 215, 98, 26],
    ['pillow', 156, 112, 26],
    ['clothes', 226, 176, 26], ['clothes', 258, 182, 22],
    ['shelf', 96, 48, 22], ['shelf', 140, 50, 24], ['shelf', 200, 48, 22],
    ['cat', 166, 26, 24], ['cat', 186, 48, 20],
    ['text', 50, -52, 22], ['text', 140, -56, 26], ['text', 225, -52, 22]];

  /* ---------- header (same as Level 9) ---------- */
  const header = (
    <View style={st.topBar}>
      <View style={st.leftBtns}>
        <TouchableOpacity style={st.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
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
          <Text style={st.signT}>LEVEL 13</Text>
          <Text style={st.signArrow}>{'>'}</Text>
        </View>
      </Animated.View>

      <View style={st.pillWrap}>
        <View style={st.pill}>
          <Text style={st.pillT}>{hints}</Text>
        </View>
        <View style={st.pillIcon}>
          <Icon n="bulb" s={34} />
        </View>
      </View>
    </View>
  );

  return (
    <Stage bg={SKY}>
      <View style={st.root}>
        <Garden />
        {allBurned && <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(40,28,20,0.45)' }]} />}
        {header}

        {/* scene */}
        <View style={st.body}>
          <Animated.View style={{ transform: [{ translateX: shake }] }}>
            {loading ? <Text style={st.load}>Loading level 13...</Text> : (
              <View style={st.scene}>
                {/* instruction text (can be burned) */}
                <View style={{ position: 'absolute', left: 30, top: -48, width: 260, alignItems: 'center' }} pointerEvents="none">
                  <View style={[st.qPill, has('text') && { backgroundColor: '#2b2420', borderColor: '#4a3d35' }]}>
                    <Text style={[st.qArrow, has('text') && { color: '#8a7d75' }]}>{'<'}</Text>
                    <Text style={[st.q, has('text') && { color: '#8a7d75' }]}>Burn everything!</Text>
                    <Text style={[st.qArrow, has('text') && { color: '#8a7d75' }]}>{'>'}</Text>
                  </View>
                </View>

                <View style={{ position: 'absolute', left: 70, top: 74 }} pointerEvents="none"><Shelf w={180} burned={has('shelf')} /></View>

                {/* teddy bear (shelf mela, cat irundha edathula) */}
                <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 158, top: 22, opacity: catO, transform: [{ translateX: catX }, { translateY: catY }] }}>
                  <Teddy w={52} burned={has('cat')} />
                </Animated.View>

                <View style={{ position: 'absolute', left: 35, top: 118 }} pointerEvents="none"><Sofa w={250} burned={has('sofa')} /></View>
                <View style={{ position: 'absolute', left: 140, top: 138 }} pointerEvents="none"><Pillow w={60} burned={has('pillow')} /></View>
                <View style={{ position: 'absolute', left: 210, top: 208 }} pointerEvents="none"><Clothes w={90} burned={has('clothes')} /></View>

                {fires.filter((f) => has(f[0])).map((f, i) =>
                  <View key={i} pointerEvents="none" style={{ position: 'absolute', left: f[1], top: f[2] }}><Flame w={f[3]} delay={i * 90} /></View>)}

                <Animated.View {...pr.panHandlers} style={{
                  position: 'absolute', left: TORCH.x, top: TORCH.y, width: TORCH.w, height: TORCH.h, zIndex: 10,
                  transform: pan.getTranslateTransform(),
                }}><Torch /></Animated.View>
              </View>
            )}
          </Animated.View>
        </View>

        {/* message (above the bottom panel) */}
        {!!note && <View style={st.noteWrap} pointerEvents="none"><Text style={st.note}>{note}</Text></View>}

        {/* bottom wooden panel (smaller) */}
        <View style={st.panel}>
          <View style={[st.plank, { top: 14, left: 28, right: 28 }]} />
          <View style={[st.plank, { top: 56, left: 22, right: 22 }]} />
          <View style={[st.plank, { bottom: 12, left: 28, right: 28 }]} />
          <View style={[st.screw, { left: 12, top: 12 }]} />
          <View style={[st.screw, { right: 12, top: 12 }]} />
          <View style={[st.screw, { left: 12, bottom: 12 }]} />
          <View style={[st.screw, { right: 12, bottom: 12 }]} />

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={openClues}>
              <Icon n="search" s={28} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>FREE</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={() => reward('video')}>
              <Icon n="film" s={32} />
            </TouchableOpacity>
            <View style={st.badge}><Coin s={12} /><Text style={st.badgeT}>+75</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={skip}>
              <DoubleArrow s={30} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>50</Text></View>
          </View>
        </View>

        {/* CLUES popup */}
        {clueOpen && (
          <View style={st.overlay}>
            <View style={st.clueCard}>
              <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
                <Icon n="cross" s={20} />
              </TouchableOpacity>
              <Text style={st.clueTitle}>HINTS</Text>

              <View style={[st.clueRow, st.clueRowOpen]}>
                <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={st.clueHead}>Hint 1</Text>
                  <Text style={st.clueBody}>{clueText}</Text>
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
   STYLES (same as Level 9, smaller bottom panel)
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
  pillWrap: { position: 'relative', minWidth: 88, height: 36, justifyContent: 'center' },
  pill: { height: 28, borderRadius: 14, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 14, paddingRight: 26, elevation: 3 },
  pillT: { fontFamily: FONT, fontSize: 18, fontWeight: '900', color: '#1b1b1b' },
  pillIcon: { position: 'absolute', right: -5, top: -3 },

  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, paddingBottom: 135 },
  scene: { width: SW, height: SH },
  load: { fontFamily: FONT, fontSize: 18, color: '#fff' },

  qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 6, paddingHorizontal: 16, elevation: 3 },
  qArrow: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: ARROW },
  q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

  noteWrap: { position: 'absolute', left: 0, right: 0, bottom: 140, alignItems: 'center', zIndex: 20 },
  note: { fontFamily: FONT, fontSize: 17, fontWeight: 'bold', color: '#c0392b', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },

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

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  clueCard: { width: '86%', maxWidth: 360, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
  clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
  closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12 },
  clueRowOpen: { backgroundColor: '#fff', borderColor: GREEN_OK },
  clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
  clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
  clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
  clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },
});