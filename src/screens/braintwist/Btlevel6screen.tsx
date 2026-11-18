
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, PanResponder, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
} from 'react-native';
import Svg, { Line, Rect, Circle, Ellipse, G, Path, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Stage, F, Coin } from './BTShared';
import { Icon } from './Art';
import { startLevel6, connectDots, hintLevel6, Level6View, Level6Connect, L6Dot, L6Edge } from './Btlevel6api';
import { Tick, Cross } from './Btlevel6art';
import { play } from './BTSound';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

/* garden palette (same as Level 3 / 4 / 5) */
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
const BOARD = '#1f5b44';

const CHALK = '#f6f4ea';
const DOT_R = 14; // drawn size of a dot
const GRAB = 38; // how close a finger must be to a dot to pick it up / drop on it
const DOT_ROT = [28, 24, 22, 16, 18, 20, 25]; // each chalk blob is tilted a little, like the design

// the question shown in the top pill
const QUESTION = 'Follow the dots and complete the star';

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit: () => void;
  onComplete?: (result: Level6Connect) => void;
  // called when the coins / video buttons are tapped. The parent should ONLY add hints here.
  onWatchVideo?: () => void;
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

/* sprout friend (same as Level 3), local coords: body at 0..120 x 55..133 */
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
      {/* full-height sky (stretches to any screen, so no plain blue strip anywhere) */}
      <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="g4sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g4sky)" />
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

      {/* ground (Level 3 scene), pinned to the bottom: hills, fence, bookshelf, sprout, meadow to the very edge */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
        <Svg width="100%" height="100%" viewBox="0 0 942 1269">
          {/* clouds */}
          <Cloud x={50} y={585} s={0.9} />
          <Cloud x={880} y={600} s={0.6} />

          {/* rolling hills */}
          <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
          <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
          <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

          {/* fence: pickets first, rails in front */}
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

          {/* bookshelf (right) with potted plant */}
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

          {/* sprout friend (left) */}
          <Sprout x={10} y={740} s={1} />

          {/* front meadow, runs to the bottom edge */}
          <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
          <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

          {/* stones */}
          <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
          <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
          <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
          <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

          {/* grass tufts + flowers */}
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

/* ---------- thin link chain for the hanging sign (same as Level 3) ---------- */
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

/* ---------- double arrow (skip icon, same as Level 3) ---------- */
function DoubleArrow({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
      <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
    </Svg>
  );
}

/* faint star outline drawn in the chalkboard corners */
const starPts = (cx: number, cy: number, R: number) => {
  const r = R * 0.45, p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 === 0 ? R : r;
    p.push(`${(cx + Math.cos(a) * rad).toFixed(1)},${(cy + Math.sin(a) * rad).toFixed(1)}`);
  }
  return p.join(' ');
};

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevel6Screen({ playerId, hints = 0, setHints, onExit, onComplete, onWatchVideo }: Props) {
  const { width, height } = useWindowDimensions();
  const S = Math.max(220, Math.min(width - 60, 350, height - 420)); // square chalkboard

  const [view, setView] = useState<Level6View | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [mark, setMark] = useState<{ x: number; y: number } | null>(null);
  const [done, setDone] = useState(false);
  const [clueOpen, setClueOpen] = useState(false); // popup visible or not
  const [clueUsed, setClueUsed] = useState(false); // the backend says the clue was already bought
  const [clueText, setClueText] = useState('');    // clue text comes from the backend

  const shake = useRef(new Animated.Value(0)).current;
  const tickPop = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const timers = useRef<any[]>([]);
  const msgTimer = useRef<any>(null);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  // hanging sign sways gently (same as Level 3 / 4 / 5)
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [sway]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

  // the pan responder is created once, so it reads the latest data from this ref
  const live = useRef<any>({});
  const pos = (d: L6Dot) => { const sz = live.current.S || S; return { x: d.x * sz, y: d.y * sz }; };
  const nearest = (x: number, y: number, skip?: number) => {
    const v = live.current.view as Level6View | null;
    if (!v) return null;
    let best: L6Dot | null = null, bd = GRAB;
    for (const d of v.dots) {
      if (d.id === skip) continue;
      const p = pos(d), dist = Math.hypot(p.x - x, p.y - y);
      if (dist < bd) { bd = dist; best = d; }
    }
    return best;
  };

  // 1. open the level - the backend creates or resumes the session
  const load = useCallback(() => {
    setLoadErr(''); setView(null);
    startLevel6(playerId)
      .then((v) => {
        setSessionId(v.sessionId as number);
        setClueUsed(!!v.clueUsed);
        setView(v);
      })
      .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
  }, [playerId]);

  useEffect(() => {
    load();
    return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
  }, [load]);

  const flash = (m: string) => {
    setMsg(m); clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 2600);
  };
  const doShake = () => Animated.sequence([10, -10, 6, -6, 0].map((v) =>
    Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

  // 2. the finger joined two dots -> ask the backend if that is a line of the star
  const join = async (from: number, to: number) => {
    const { view: v, sessionId: sid, busy: b, done: d } = live.current;
    if (b || d || !sid || !v) return;
    setBusy(true);
    try {
      const res = await connectDots({ sessionId: sid, playerId, from, to });

      if (!res.correct) {
        play('wrong'); // wrong line
        const a = v.dots.find((x: L6Dot) => x.id === from), c = v.dots.find((x: L6Dot) => x.id === to);
        if (a && c) setMark({ x: ((a.x + c.x) / 2) * S, y: ((a.y + c.y) / 2) * S });
        doShake(); flash(res.message);
        later(() => setMark(null), 700);
        setBusy(false);
        return;
      }

      setView(res); // the new line is drawn from the server's list
      if (res.duplicate) { play('tap'); flash(res.message); setBusy(false); return; }

      if (res.completed) {
        play('line5'); // last line = happy flourish
        setDone(true);
        flash(res.message);
        Animated.spring(tickPop, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }).start();
        later(() => { onComplete ? onComplete(res) : onExit(); }, 1500); // no popup: go straight on after the tick
      } else {
        // correct line: 1st line = line1 ... 4th line = line4 (each one a higher note)
        const n = Math.min(Math.max(res.edges.length, 1), 4);
        play(('line' + n) as any);
        setBusy(false);
      }
    } catch (e: any) {
      flash(e.message || 'Network error');
      setBusy(false);
    }
  };

  const active = useRef<number | null>(null);
  const start = useRef({ x: 0, y: 0 });
  const pr = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      const x = e.nativeEvent.locationX, y = e.nativeEvent.locationY;
      start.current = { x, y };
      const d = live.current.done || live.current.busy ? null : nearest(x, y);
      active.current = d ? d.id : null;
      if (d) { play('drag'); const p = pos(d); setDrag({ x1: p.x, y1: p.y, x2: x, y2: y }); } // dot picked up
    },
    onPanResponderMove: (_, g) => {
      if (active.current == null) return;
      const d = (live.current.view as Level6View).dots.find((q) => q.id === active.current);
      if (!d) return;
      const p = pos(d);
      setDrag({ x1: p.x, y1: p.y, x2: start.current.x + g.dx, y2: start.current.y + g.dy });
    },
    onPanResponderRelease: (_, g) => {
      const from = active.current; active.current = null; setDrag(null);
      if (from == null) return;
      const t = nearest(start.current.x + g.dx, start.current.y + g.dy, from);
      if (t) join(from, t.id);
    },
    onPanResponderTerminate: () => { active.current = null; setDrag(null); },
  })).current;

  live.current = { view, sessionId, busy, done, S };

  // Ask the backend for the clue; hints do not consume the player's balance.
  const onHint = async () => {
    if (done || busy || !sessionId) return;

    try {
      const r = await hintLevel6({ sessionId, playerId });
      if (!r.alreadyUsed) setHints && setHints(r.hints);
      setClueUsed(true);
      setClueText(r.clue || '');
      play('clue');
      setClueOpen(true);
    } catch (e: any) {
      flash(e?.message || 'Network error');
    }
  };

  const watchVideo = () => { play('btn'); onWatchVideo && onWatchVideo(); };

  /* ---------- header (same as Level 4 / 5) ---------- */
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
          <Text style={st.signT}>LEVEL 6</Text>
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

  /* ---------- loading / error ---------- */
  if (loadErr || !view) {
    return (
      <Stage bg={SKY}>
        <View style={st.root}>
          <Garden />
          {header}
          <View style={st.centerMsg}>
            {loadErr ? (
              <>
                <Text style={st.err}>{loadErr}</Text>
                <TouchableOpacity style={st.retry} onPress={() => { play('btn'); load(); }}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { play('btn'); onExit(); }}><Text style={st.back}>Back</Text></TouchableOpacity>
              </>
            ) : (
              <>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={st.load}>Loading level 6...</Text>
              </>
            )}
          </View>
        </View>
      </Stage>
    );
  }

  const dotById = (id: number) => view.dots.find((d) => d.id === id) as L6Dot;
  const drawn: L6Edge[] = view.edges;

  return (
    <Stage bg={SKY}>
      <View style={st.root}>
        <Garden />
        {header}

        <View style={st.center}>
          {/* question pill */}
          <View style={[st.qPill, { minWidth: Math.min(width * 0.64, 330), maxWidth: Math.min(width - 40, 360) }]}>
            <Text style={st.qArrow}>{'<'}</Text>
            <Text style={[st.q, msg ? { color: '#c0392b' } : null]}>{msg || QUESTION}</Text>
            <Text style={st.qArrow}>{'>'}</Text>
          </View>

          {/* wooden chalkboard with leaves on the top corners */}
          <Animated.View style={{ width: S + 18, height: S + 18, marginTop: 18, transform: [{ translateX: shake }] }}>
            <View style={st.boardFrame}>
              <View style={{ width: S, height: S }}>
                <Svg width={S} height={S} style={StyleSheet.absoluteFill} pointerEvents="none">
                  {/* faint chalk stars in the corners */}
                  <Polygon points={starPts(S * 0.09, S * 0.09, S * 0.052)} fill="none" stroke="rgba(246,244,234,0.28)" strokeWidth={1.8} strokeLinejoin="round" />
                  <Polygon points={starPts(S * 0.91, S * 0.09, S * 0.052)} fill="none" stroke="rgba(246,244,234,0.28)" strokeWidth={1.8} strokeLinejoin="round" />
                  <Polygon points={starPts(S * 0.09, S * 0.91, S * 0.052)} fill="none" stroke="rgba(246,244,234,0.28)" strokeWidth={1.8} strokeLinejoin="round" />
                  <Polygon points={starPts(S * 0.91, S * 0.91, S * 0.052)} fill="none" stroke="rgba(246,244,234,0.28)" strokeWidth={1.8} strokeLinejoin="round" />

                  {/* lines the server accepted */}
                  {drawn.map((e, i) => {
                    const a = dotById(e.from), b = dotById(e.to);
                    return <Line key={i} x1={a.x * S} y1={a.y * S} x2={b.x * S} y2={b.y * S}
                      stroke={done ? '#ffd84d' : CHALK} strokeWidth={9} strokeLinecap="round" />;
                  })}
                  {/* line following the finger */}
                  {drag && <Line x1={drag.x1} y1={drag.y1} x2={drag.x2} y2={drag.y2}
                    stroke="rgba(246,244,234,0.65)" strokeWidth={9} strokeLinecap="round" />}
                  {/* dots: tilted white chalk blobs */}
                  {view.dots.map((d, i) => {
                    const cx = d.x * S, cy = d.y * S;
                    return (
                      <G key={d.id} transform={`rotate(${DOT_ROT[i % DOT_ROT.length]} ${cx} ${cy})`}>
                        <Ellipse cx={cx} cy={cy} rx={DOT_R * 1.25} ry={DOT_R * 0.86} fill={CHALK} />
                        <Ellipse cx={cx + DOT_R * 0.4} cy={cy + DOT_R * 0.12} rx={DOT_R * 0.72} ry={DOT_R * 0.58} fill={CHALK} />
                      </G>
                    );
                  })}
                </Svg>

                {done && (
                  <Animated.View pointerEvents="none" style={{ position: 'absolute', left: S / 2 - 40, top: S * 0.56 - 40, transform: [{ scale: tickPop }] }}>
                    <Tick s={80} />
                  </Animated.View>
                )}
                {mark && <View pointerEvents="none" style={{ position: 'absolute', left: mark.x - 23, top: mark.y - 23, zIndex: 20 }}><Cross /></View>}

                {/* touch layer */}
                <View style={StyleSheet.absoluteFill} {...pr.panHandlers} />
              </View>
            </View>

            <View pointerEvents="none" style={[st.bLeaf, { left: -8, top: -14, transform: [{ rotate: '-28deg' }] }]} />
            <View pointerEvents="none" style={[st.bLeaf, { right: -2, top: -16, transform: [{ rotate: '28deg' }] }]} />
            <View pointerEvents="none" style={[st.bLeaf, { right: -14, top: -6, transform: [{ rotate: '62deg' }] }]} />
          </Animated.View>
        </View>

        {/* bottom wooden panel (same small size as Level 5) */}
        <View style={st.panel}>
          <View style={[st.plank, { top: 12, left: 30, right: 30 }]} />
          <View style={[st.plank, { top: 58, left: 22, right: 22 }]} />
          <View style={[st.plank, { bottom: 12, left: 30, right: 30 }]} />
          <View style={[st.screw, { left: 13, top: 12 }]} />
          <View style={[st.screw, { right: 13, top: 12 }]} />
          <View style={[st.screw, { left: 13, bottom: 12 }]} />
          <View style={[st.screw, { right: 13, bottom: 12 }]} />

          <View style={st.btnCol}>
            <TouchableOpacity
              style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]}
              activeOpacity={0.85} onPress={onHint}
            >
              <Icon n="search" s={31} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>FREE</Text></View>
          </View>

          <View style={st.btnCol}>
            {/* coins / video button: the parent ONLY adds hints, it never opens the clue */}
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={watchVideo}>
              <Icon n="film" s={36} />
            </TouchableOpacity>
            <View style={st.badge}><Coin s={12} /><Text style={st.badgeT}>+75</Text></View>
          </View>

          <View style={st.btnCol}>
            <View style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]}>
              <DoubleArrow s={33} />
            </View>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>50</Text></View>
          </View>
        </View>

        {/* CLUES popup (only from the magnifier, ONE clue, text from the backend) */}
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
   STYLES  (garden theme, same as Level 5)
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
  pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
  pill: { height: 32, borderRadius: 16, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 18, paddingRight: 30, elevation: 3 },
  pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
  pillIcon: { position: 'absolute', right: -6, top: -4 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 135 },
  centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  qPill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, elevation: 3 },
  qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
  q: { flexShrink: 1, fontFamily: SERIF, fontSize: 20, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

  // wooden frame + dark green chalk surface
  boardFrame: { width: '100%', height: '100%', borderRadius: 22, borderWidth: 9, borderColor: WOOD, backgroundColor: BOARD, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', elevation: 5 },
  bLeaf: { position: 'absolute', width: 40, height: 17, borderRadius: 9, backgroundColor: '#7fcf3f', borderWidth: 1.5, borderColor: '#4c9a26' },

  // bottom wooden panel (small, same as Level 5)
  panel: {
    position: 'absolute', left: 14, right: 14, bottom: 18, height: 118, borderRadius: 38,
    backgroundColor: WOOD, borderWidth: 5, borderColor: WOOD_D,
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 14, elevation: 6,
  },
  plank: { position: 'absolute', height: 2.5, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
  screw: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: WOOD_DD },
  btnCol: { alignItems: 'center' },
  circleBtn: { width: 62, height: 62, borderRadius: 31, borderWidth: 5, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 5, minWidth: 62, paddingHorizontal: 10, height: 25, borderRadius: 13, backgroundColor: BADGE },
  badgeT: { fontFamily: FONT, fontSize: 14, fontWeight: '900', color: '#fff' },

  clueCard: { width: '86%', maxWidth: 360, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
  clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
  closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12 },
  clueRowOpen: { backgroundColor: '#fff', borderColor: GREEN_OK },
  clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
  clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
  clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
  clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },

  load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
  err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
  retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
  retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
  back: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },
});
