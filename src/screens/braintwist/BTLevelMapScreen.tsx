
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing,
  StyleSheet, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Circle, Ellipse, G, Polygon, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from './Art';
import { getMap, openLevel, LevelMap, MapLevel } from './mapApi';

/* palette */
const NAVY = '#13235b';
const CREAM = '#faf0e2';
const CREAM_IN = '#fbeedb';
const WOOD_D = '#c2782c';
const WOOD_DD = '#8f5a1f';
const SIGN = '#bd6b29';
const YEL = '#fbc02d';
const YEL_D = '#d98e1c';
const GOLD = '#fdd23a';

const HEADER_H = 100;
const ROWS_TOP = HEADER_H + 10;
const PER_PAGE = 5;
const MAX_LEVEL = 50;
const BTN = 66;

type Props = { playerId: number; hints?: number; onBack: () => void; onPlay: (n: number) => void };

/* ---------- small drawings ---------- */
function Chain({ h = 30, style }: { h?: number; style?: any }) {
  const n = Math.max(2, Math.round(h / 8));
  return (
    <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
      {Array.from({ length: n }).map((_, i) => (
        <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
      ))}
    </Svg>
  );
}

function HomeIcon({ s = 22 }: { s?: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      <Path d="M12 3 L2 12 H5 V21 H10 V15 H14 V21 H19 V12 H22 Z" fill={NAVY} stroke={NAVY} strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  );
}

function GearIcon({ s = 23 }: { s?: number }) {
  const teeth = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      <G transform="translate(12 12)">
        {teeth.map((a) => (
          <Rect key={a} x="-2" y="-11" width="4" height="6" rx="1" fill={NAVY} transform={`rotate(${a})`} />
        ))}
        <Circle r="7.5" fill={NAVY} />
        <Circle r="3" fill={YEL} />
      </G>
    </Svg>
  );
}

function ArrowIcon({ s = 28, dir = 'right' }: { s?: number; dir?: 'left' | 'right' }) {
  const pts = dir === 'right' ? '25,12 88,50 25,88' : '75,12 12,50 75,88';
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      <Polygon points={pts} fill={NAVY} stroke={NAVY} strokeWidth="8" strokeLinejoin="round" />
    </Svg>
  );
}

function Sparkle({ flip }: { flip?: boolean }) {
  return (
    <Svg width={34} height={34} viewBox="0 0 34 34" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
      <Polygon points="6,4 14,2 20,14 12,16" fill={GOLD} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      <Polygon points="2,22 18,20 18,28 2,30" fill={GOLD} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  );
}

/* full sitting cat - head, body, tail, paws all visible (viewBox 100 x 120) */
function Cat({ width = 80 }: { width?: number }) {
  const height = width * 1.2;
  const FUR = '#fdf1ea';
  const EDGE = '#e3c9bb';
  return (
    <Svg width={width} height={height} viewBox="0 0 100 120">
      {/* tail */}
      <Path d="M74 108 C 100 108 100 76 86 72" stroke={EDGE} strokeWidth="12" fill="none" strokeLinecap="round" />
      <Path d="M74 108 C 100 108 100 76 86 72" stroke={FUR} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* body */}
      <Ellipse cx="50" cy="92" rx="27" ry="26" fill={FUR} stroke={EDGE} strokeWidth="2" />
      <Ellipse cx="50" cy="98" rx="14" ry="16" fill="#fff" opacity={0.7} />
      {/* paws */}
      <Ellipse cx="39" cy="115" rx="10" ry="5.5" fill={FUR} stroke={EDGE} strokeWidth="2" />
      <Ellipse cx="61" cy="115" rx="10" ry="5.5" fill={FUR} stroke={EDGE} strokeWidth="2" />
      {/* ears */}
      <Polygon points="14,44 16,10 40,28" fill={FUR} stroke={EDGE} strokeWidth="2" strokeLinejoin="round" />
      <Polygon points="19,38 20,19 32,28" fill="#f6a5ae" />
      <Polygon points="86,44 84,10 60,28" fill={FUR} stroke={EDGE} strokeWidth="2" strokeLinejoin="round" />
      <Polygon points="81,38 80,19 68,28" fill="#f6a5ae" />
      {/* head */}
      <Ellipse cx="50" cy="52" rx="38" ry="31" fill={FUR} stroke={EDGE} strokeWidth="2" />
      {/* eyes */}
      <Circle cx="34" cy="50" r="5" fill="#3a2a2a" />
      <Circle cx="66" cy="50" r="5" fill="#3a2a2a" />
      <Circle cx="35.8" cy="48.2" r="1.7" fill="#fff" />
      <Circle cx="67.8" cy="48.2" r="1.7" fill="#fff" />
      {/* cheeks */}
      <Ellipse cx="23" cy="63" rx="8" ry="5.5" fill="#f6a5ae" />
      <Ellipse cx="77" cy="63" rx="8" ry="5.5" fill="#f6a5ae" />
      {/* nose + mouth */}
      <Polygon points="46,58 54,58 50,63" fill="#f08a99" />
      <Path d="M50 63 Q45 70 40 66 M50 63 Q55 70 60 66" stroke="#3a2a2a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* whiskers */}
      <Path d="M8 56 L24 59 M8 66 L24 64 M92 56 L76 59 M92 66 L76 64" stroke="#b9a094" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function Star({ x, y, s = 1, o = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <Polygon points="0,-6 1.6,-1.6 6,0 1.6,1.6 0,6 -1.6,1.6 -6,0 -1.6,-1.6" fill="#fff6c8" />
    </G>
  );
}

function PuzzlePiece({ x, y, r = 0, s = 1, c = '#ff8fb1' }: any) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={0.9}>
      <Rect x="-12" y="-12" width="24" height="24" rx="3" fill={c} />
      <Circle cx="12" cy="0" r="6" fill={c} />
      <Circle cx="0" cy="-12" r="6" fill={c} />
      <Circle cx="-12" cy="0" r="4.5" fill="#5b2a9e" />
      <Rect x="-8" y="-8" width="10" height="5" rx="2.5" fill="#fff" opacity={0.35} />
    </G>
  );
}

function Cloud({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff" opacity={0.22}>
      <Ellipse cx="0" cy="0" rx="70" ry="26" />
      <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
      <Ellipse cx="22" cy="-12" rx="30" ry="22" />
    </G>
  );
}

function Flower({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <Ellipse key={a} cx="0" cy="-9" rx="6" ry="8" fill="#ffe3f1" transform={`rotate(${a})`} />
      ))}
      <Circle cx="0" cy="0" r="5" fill="#ffd33d" />
    </G>
  );
}

function Tuft({ x, y }: any) {
  return (
    <G transform={`translate(${x} ${y})`} fill="#2f9e6a">
      <Polygon points="-8,0 -4,-16 0,0" />
      <Polygon points="-2,0 3,-22 8,0" />
      <Polygon points="5,0 10,-14 14,0" />
    </G>
  );
}

/* ---------- background : "Dream Night Puzzle Land" ---------- */
function Background({ W, H, groundTop }: { W: number; H: number; groundTop: number }) {
  const gTop = groundTop - 16;
  const gH = H - gTop;

  const stars = [
    [0.12, 0.05, 1.1], [0.3, 0.1, 0.7], [0.55, 0.04, 0.9], [0.72, 0.12, 0.7], [0.93, 0.07, 1],
    [0.06, 0.24, 0.7], [0.94, 0.3, 0.8], [0.08, 0.42, 0.9], [0.92, 0.5, 0.7], [0.5, 0.2, 0.6],
  ];
  const pieces = [
    { x: W * 0.09, y: H * 0.22, r: -18, s: 1.1, c: '#ff8fb1' },
    { x: W * 0.92, y: H * 0.26, r: 20, s: 0.95, c: '#6fe3d6' },
    { x: W * 0.07, y: H * 0.44, r: 12, s: 0.8, c: '#ffd36b' },
    { x: W * 0.93, y: H * 0.47, r: -14, s: 1, c: '#b69bff' },
  ];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* twilight sky */}
      <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="mapSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#1b1464" />
            <Stop offset="0.4" stopColor="#4a2a9a" />
            <Stop offset="0.72" stopColor="#b6529f" />
            <Stop offset="1" stopColor="#ffb38a" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#mapSky)" />
      </Svg>

      {/* stars, moon, clouds, floating puzzle pieces */}
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', top: 0, left: 0 }}>
        {stars.map((s, i) => (
          <Star key={i} x={W * s[0]} y={H * s[1]} s={s[2]} o={0.9} />
        ))}

        {/* crescent moon (behind header, top-right area below counter) */}
        <G transform={`translate(${W * 0.86} ${H * 0.14})`}>
          <Circle r="30" fill="#ffe9a8" opacity={0.15} />
          <Path d="M0 -20 A20 20 0 1 0 0 20 A15 15 0 1 1 0 -20 Z" fill="#ffe9a8" />
        </G>

        <Cloud x={W * 0.18} y={H * 0.34} s={0.5} />
        <Cloud x={W * 0.85} y={H * 0.38} s={0.42} />
        <Cloud x={W * 0.15} y={H * 0.56} s={0.4} />

        {pieces.map((p, i) => (
          <PuzzlePiece key={i} {...p} />
        ))}
      </Svg>

      {/* glowing lamp post on the right */}
      <Svg width={70} height={190} viewBox="0 0 70 190" style={{ position: 'absolute', right: 6, top: groundTop - 176 }}>
        <Circle cx="35" cy="26" r="30" fill="#ffe27a" opacity={0.18} />
        <Circle cx="35" cy="26" r="20" fill="#ffe27a" opacity={0.25} />
        <Rect x="32" y="40" width="6" height="140" rx="3" fill="#3b2a73" />
        <Rect x="24" y="170" width="22" height="10" rx="3" fill="#2c1f5a" />
        <Circle cx="35" cy="26" r="11" fill="#ffe27a" />
        <Circle cx="31" cy="22" r="3.5" fill="#fff" opacity={0.8} />
        <Rect x="28" y="36" width="14" height="6" rx="2" fill="#3b2a73" />
      </Svg>

      {/* rolling hills + grass */}
      <Svg width={W} height={gH} viewBox={`0 0 ${W} ${gH}`} style={{ position: 'absolute', left: 0, top: gTop }}>
        <Path d={`M0 22 C ${W * 0.2} -14 ${W * 0.5} 6 ${W * 0.75} -8 C ${W * 0.9} -16 ${W} 0 ${W} 6 L ${W} ${gH} L 0 ${gH} Z`} fill="#6a4bb5" />
        <Path d={`M0 ${gH * 0.3} C ${W * 0.25} ${gH * 0.06} ${W * 0.6} ${gH * 0.3} ${W} ${gH * 0.14} L ${W} ${gH} L 0 ${gH} Z`} fill="#2fa39a" />
        <Path d={`M0 ${gH * 0.5} C ${W * 0.3} ${gH * 0.36} ${W * 0.7} ${gH * 0.5} ${W} ${gH * 0.4} L ${W} ${gH} L 0 ${gH} Z`} fill="#46c47a" />
        <Tuft x={W * 0.34} y={gH * 0.7} />
        <Tuft x={W * 0.64} y={gH * 0.62} />
        <Tuft x={W * 0.52} y={gH * 0.92} />
        <Flower x={W * 0.3} y={gH * 0.88} s={0.95} />
        <Flower x={W * 0.7} y={gH * 0.84} s={1.05} />
        <Flower x={W * 0.9} y={gH * 0.66} s={0.85} />
      </Svg>
    </View>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevelMapScreen({ playerId, hints, onBack, onPlay }: Props) {
  const { width, height } = useWindowDimensions();
  const W = Math.min(width, 460);
  const H = height;

  /* layout: level 5 ends right above a short grass strip */
  const groundH = Math.max(100, Math.min(125, H * 0.15));
  const groundTop = H - groundH;
  const rowsBottom = groundTop + 6;
  const free = rowsBottom - ROWS_TOP;
  const rowH = Math.max(52, Math.min(74, (free / PER_PAGE) * 0.88));
  const gap = Math.max(4, (free - PER_PAGE * rowH) / (PER_PAGE - 1));

  const [map, setMap] = useState<LevelMap | null>(null);
  const [page, setPage] = useState(0);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulse = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const p = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );
    const s = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    p.start(); s.start();
    return () => { p.stop(); s.stop(); };
  }, [pulse, sway]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

  const showToast = (m: string) => {
    setToast(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2400);
  };

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      getMap(playerId)
        .then((m) => { if (alive) setMap(m); })
        .catch((e: any) => alive && showToast(e.message || 'Could not load levels'));
      return () => { alive = false; };
    }, [playerId])
  );

  const tap = async (l: MapLevel) => {
    if (busy) return;
    if (l.status === 'soon') return showToast('Coming soon!');
    setBusy(true);
    try {
      await openLevel(playerId, l.n);
      onPlay(l.n);
    } catch (e: any) {
      showToast(e.message || 'Cannot open level');
      if (e.map) setMap(e.map);
    } finally {
      setBusy(false);
    }
  };

  if (!map) {
    return (
      <View style={[st.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const all = map.levels.slice(0, MAX_LEVEL);
  const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const shown = all.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const hasNext = page < pages - 1;
  const hasPrev = page > 0;

  const earned = map.levels.reduce((sum, l) => sum + (l.stars || 0), 0);
  const counter = typeof hints === 'number' ? hints : earned;
  const pillW = Math.min(W * 0.54, 250);

  /* cat sits fully visible on the grass, left of the pills, above the prev button */
  const sideSpace = (W - pillW) / 2;
  const catW = Math.max(56, Math.min(80, sideSpace - 12));
  const catH = catW * 1.2;
  const catTop = groundTop + 12 - catH;

  const row = (l: MapLevel) => {
    const soon = l.status === 'soon';
    const done = l.status === 'completed';
    const cur = l.status === 'current';
    const scale = cur ? pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }) : 1;

    return (
      <View key={l.n} style={{ height: rowH, marginBottom: gap, justifyContent: 'center' }}>
        {cur && (
          <>
            <View style={{ position: 'absolute', left: -38, top: 2 }} pointerEvents="none"><Sparkle /></View>
            <View style={{ position: 'absolute', right: -38, top: 2 }} pointerEvents="none"><Sparkle flip /></View>
          </>
        )}
        <TouchableOpacity activeOpacity={0.85} onPress={() => tap(l)}>
          <Animated.View style={[st.pillOuter, { height: rowH, borderRadius: rowH / 2 }, soon && { opacity: 0.6 }, { transform: [{ scale }] }]}>
            <View style={[st.pillInner, { borderRadius: rowH / 2 }, cur && { backgroundColor: GOLD }]}>
              <View style={st.gloss} pointerEvents="none" />
              <Text style={[st.pillT, { fontSize: Math.round(rowH * 0.36), marginTop: done ? -8 : 0 }]}>LEVEL {l.n}</Text>
              {done && (
                <View style={st.starRow} pointerEvents="none">
                  {[0, 1, 2].map((s) => (
                    <Text key={s} style={{ fontSize: 11, color: s < l.stars ? '#f5a500' : '#d9c9a8' }}>★</Text>
                  ))}
                </View>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={st.root}>
      <View style={{ width: W, flex: 1, alignSelf: 'center' }}>
        <Background W={W} H={H} groundTop={groundTop} />

        {/* full cat on the grass (drawn after the background so nothing hides it) */}
        <View pointerEvents="none" style={{ position: 'absolute', left: 6, top: catTop }}>
          <Cat width={catW} />
        </View>

        {/* 5 levels of the current page */}
        <View style={{ paddingTop: ROWS_TOP, alignItems: 'center' }}>
          <View style={{ width: pillW }}>
            {shown.map((l) => row(l))}
          </View>
        </View>

        {/* header */}
        <View style={st.header} pointerEvents="box-none">
          <View style={st.leftBtns}>
            <TouchableOpacity style={st.roundBtn} activeOpacity={0.85} onPress={onBack}>
              <HomeIcon s={22} />
            </TouchableOpacity>
            <TouchableOpacity style={st.roundBtn} activeOpacity={0.85}>
              <GearIcon s={23} />
            </TouchableOpacity>
          </View>

          <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
            <Chain h={30} style={{ left: 24, top: -6 }} />
            <Chain h={30} style={{ right: 24, top: -6 }} />
            <View style={st.sign}>
              <Text style={st.signArrow}>{'<'}</Text>
              <Text style={st.signT}>LEVELS</Text>
              <Text style={st.signArrow}>{'>'}</Text>
            </View>
          </Animated.View>

          <View style={st.counterWrap}>
            <View style={st.counter}>
              <Text style={st.counterT} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{counter}</Text>
            </View>
            <View style={st.counterIcon}>
              <Icon n="bulb" s={32} />
            </View>
          </View>
        </View>

        {/* previous page (bottom left) */}
        {hasPrev && (
          <TouchableOpacity style={[st.playBtn, { left: 14 }]} activeOpacity={0.85} onPress={() => setPage(page - 1)}>
            <ArrowIcon s={30} dir="left" />
          </TouchableOpacity>
        )}

        {/* next page (bottom right) */}
        {hasNext && (
          <TouchableOpacity style={[st.playBtn, { right: 14 }]} activeOpacity={0.85} onPress={() => setPage(page + 1)}>
            <ArrowIcon s={30} dir="right" />
          </TouchableOpacity>
        )}

        {!!toast && (
          <View style={[st.toast, { top: HEADER_H + 4, width: W * 0.84, alignSelf: 'center' }]}>
            <Text style={st.toastT}>{toast}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1b1464' },

  header: {
    position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H,
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingTop: 14, zIndex: 10,
  },
  leftBtns: { flexDirection: 'row', gap: 8 },
  roundBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: YEL, borderWidth: 3, borderColor: YEL_D,
    alignItems: 'center', justifyContent: 'center', elevation: 3,
  },
  signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 10 },
  sign: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, height: 48,
    borderRadius: 8, backgroundColor: SIGN, borderWidth: 3, borderColor: WOOD_DD, elevation: 3,
  },
  signT: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  signArrow: { fontSize: 24, fontWeight: '900', color: '#ffc533' },

  // hint counter (cream pill + bulb)
  counterWrap: { width: 74, height: 40, marginTop: 4, justifyContent: 'center' },
  counter: {
    width: 62, height: 30, borderRadius: 15, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed',
    borderColor: '#d8c8a8', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 12, paddingRight: 6, elevation: 3,
  },
  counterT: { fontSize: 17, fontWeight: '900', color: NAVY, width: 36 },
  counterIcon: { position: 'absolute', right: 0, top: -2 },

  // level pills (height / radius are set inline from rowH)
  pillOuter: {
    backgroundColor: WOOD_D, padding: 4,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  pillInner: {
    flex: 1, backgroundColor: CREAM_IN, borderWidth: 2, borderColor: '#f3b95e',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  gloss: {
    position: 'absolute', top: 3, left: 14, right: 14, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.55)',
  },
  pillT: { fontWeight: '900', color: NAVY, letterSpacing: 0.5 },
  starRow: { position: 'absolute', bottom: 3, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },

  // page buttons (bottom corners, on the grass)
  playBtn: {
    position: 'absolute', bottom: 20, width: BTN, height: BTN, borderRadius: BTN / 2,
    backgroundColor: CREAM, borderWidth: 5, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center',
    elevation: 8, zIndex: 12,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
  },

  toast: {
    position: 'absolute', paddingVertical: 10, borderRadius: 30,
    backgroundColor: 'rgba(45,25,10,0.92)', borderWidth: 2, borderColor: '#8a6a45', zIndex: 20,
  },
  toastT: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
});