
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Animated, PanResponder, Easing, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Stage, Coin, F } from './BTShared';
import { Icon } from './Art';
import { StarIcon } from './Btlevel2art';
import { startLevel25, sendAction25, skipLevel25, Level25Start, Level25Action } from './Btlevel25api';
import { Scene, VanArt, NinjaArt, Tick, Cross, SCENE_W, SCENE_H, VAN, NINJA, ZONES } from './Btlevel25art';
import * as api from './api';
import { play } from './BTSound';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

const SKIP_COST = 50; // keep in sync with Braintwistlevel25routes.js

/* garden palette (same as Level 9 / 11 / 12 / 15 / 24) */
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

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit: () => void;
  onComplete?: (result: Level25Action) => void;
};

const DRAG_DOOR = 'door_left'; // the ONE door that can be pulled out (Sahur's house). If the level says "wrong", change to 'door_right'.

/* door size / position, measured against the invisible drop zone of that door.
   Nudge these if the small door does not sit exactly on the painted one. */
const DOOR_W = 0.18;   // door width  = 18% of the zone width
const DOOR_H = 0.38;   // door height = 38% of the zone height
const DOOR_DX = -0.03; // shift left (-) / right (+) as a fraction of the zone width
const DOOR_DY = 0.0;   // shift up (-) / down (+) as a fraction of the zone height
const WALL = '#fbd8ae';// house wall colour, hides the painted door once it is pulled out
const GRAB = 12;       // extra touch area around the small door (px)

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
          <LinearGradient id="g25sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g25sky)" />
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

/* a small wooden door (drawn with views, no extra art file needed) */
function DoorArt({ w, h }: { w: number; h: number }) {
  const bw = Math.max(1.5, w * 0.1), knob = Math.max(2, w * 0.16);
  return (
    <View style={{ width: w, height: h, backgroundColor: '#7a4a28', borderWidth: bw, borderColor: '#3d3552', borderRadius: 1.5 }}>
      <View style={{ position: 'absolute', right: w * 0.14, top: h * 0.48, width: knob, height: knob, borderRadius: knob / 2, backgroundColor: '#f3e3c3' }} />
    </View>
  );
}

/* Sahur after he escapes from the van: a little wooden log man (views only) */
function SahurFree({ w }: { w: number }) {
  const h = w * 1.5, bw = w * 0.7, bx = (w - bw) / 2, bh = h * 0.58, edge = Math.max(1.5, w * 0.05), dark = '#6b3b12', orange = '#d0802f';
  const eye = bw * 0.26;
  return (
    <View style={{ width: w, height: h }}>
      <View style={{ position: 'absolute', left: w * 0.3, top: bh - 2, width: w * 0.15, height: h - bh + 2, backgroundColor: dark, borderRadius: w * 0.05 }} />
      <View style={{ position: 'absolute', left: w * 0.55, top: bh - 2, width: w * 0.15, height: h - bh + 2, backgroundColor: dark, borderRadius: w * 0.05 }} />
      <View style={{ position: 'absolute', left: bx - w * 0.12, top: bh * 0.3, width: w * 0.15, height: bh * 0.6, backgroundColor: orange, borderRadius: w * 0.07, borderWidth: edge, borderColor: dark, transform: [{ rotate: '22deg' }] }} />
      <View style={{ position: 'absolute', left: bx + bw - w * 0.03, top: bh * 0.3, width: w * 0.15, height: bh * 0.6, backgroundColor: orange, borderRadius: w * 0.07, borderWidth: edge, borderColor: dark, transform: [{ rotate: '-22deg' }] }} />
      <View style={{ position: 'absolute', left: bx, top: 0, width: bw, height: bh, backgroundColor: orange, borderRadius: bw * 0.3, borderWidth: edge, borderColor: dark }}>
        <View style={{ position: 'absolute', left: bw * 0.12, top: bh * 0.2, width: eye, height: eye, borderRadius: eye / 2, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><View style={{ width: eye * 0.45, height: eye * 0.45, borderRadius: eye, backgroundColor: '#222' }} /></View>
        <View style={{ position: 'absolute', right: bw * 0.12, top: bh * 0.2, width: eye, height: eye, borderRadius: eye / 2, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><View style={{ width: eye * 0.45, height: eye * 0.45, borderRadius: eye, backgroundColor: '#222' }} /></View>
        <View style={{ position: 'absolute', left: bw * 0.3, top: bh * 0.62, width: bw * 0.4, height: Math.max(2, bh * 0.08), borderRadius: 4, backgroundColor: dark }} />
      </View>
    </View>
  );
}

/* the house door: drag it out of the wall and drop it beside the police van */
function DragDoor({ g, pan, fade, disabled, onDrop }: { g: { x: number; y: number; w: number; h: number }; pan: Animated.ValueXY; fade: Animated.Value; disabled: boolean; onDrop: (x: number, y: number) => Promise<boolean> }) {
  const [lift, setLift] = useState(false);
  const live = useRef({ disabled, onDrop });
  live.current = { disabled, onDrop };
  const back = () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();
  const pr = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !live.current.disabled,
    onPanResponderGrant: () => { setLift(true); pan.setOffset({ x: 0, y: 0 }); pan.setValue({ x: 0, y: 0 }); },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: async (_, gs) => {
      setLift(false);
      const ok = await live.current.onDrop(gs.moveX, gs.moveY);
      if (!ok) back();
    },
    onPanResponderTerminate: () => { setLift(false); back(); },
  })).current;
  return (
    <>
      {/* plain wall where the door used to be (hides the painted door) */}
      <View pointerEvents="none" style={{ position: 'absolute', left: g.x - 2, top: g.y - 2, width: g.w + 4, height: g.h + 5, backgroundColor: WALL, zIndex: 4 }} />
      <Animated.View {...pr.panHandlers}
        style={{
          position: 'absolute', left: g.x - GRAB, top: g.y - GRAB, width: g.w + GRAB * 2, height: g.h + GRAB * 2,
          alignItems: 'center', justifyContent: 'center', opacity: fade,
          zIndex: lift ? 60 : 6, elevation: lift ? 12 : 3,
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        }}>
        <DoorArt w={g.w} h={g.h} />
      </Animated.View>
    </>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevel25Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
  const { width, height } = useWindowDimensions();
  const SW = Math.max(240, Math.min(width - 24, 440, (height - 360) * SCENE_W / SCENE_H));  // scene width
  const k = SW / SCENE_W;                                                                     // scene units -> pixels
  const SH = SCENE_H * k;
  // the small door: centred on its drop zone, much smaller than the zone
  const dz = ZONES[DRAG_DOOR];
  const dW = dz.w * k * DOOR_W, dH = dz.h * k * DOOR_H;
  const door = { x: (dz.x + dz.w / 2) * k + dz.w * k * DOOR_DX - dW / 2, y: (dz.y + dz.h / 2) * k + dz.h * k * DOOR_DY - dH / 2, w: dW, h: dH };
  const sW = VAN.w * k * 0.3; // size of Sahur once he has escaped

  const [view, setView] = useState<Level25Start | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [mark, setMark] = useState<{ x: number; y: number } | null>(null);
  const [result, setResult] = useState<Level25Action | null>(null);
  const [clueOpen, setClueOpen] = useState(false);
  const [bal, setBal] = useState<number>(Number(hints) || 0);

  const shake = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const panD = useRef(new Animated.ValueXY()).current;   // the draggable door
  const doorFade = useRef(new Animated.Value(1)).current;
  const sahurS = useRef(new Animated.Value(0)).current;   // pop-out scale
  const sahurX = useRef(new Animated.Value(0)).current;   // run away
  const sahurO = useRef(new Animated.Value(1)).current;
  const ninX = useRef(new Animated.Value(0)).current;
  const ninY = useRef(new Animated.Value(0)).current;
  const ninO = useRef(new Animated.Value(1)).current;
  const timers = useRef<any[]>([]);
  const msgTimer = useRef<any>(null);
  const actBusy = useRef(false);
  const vanRef = useRef<View>(null);   // the (fixed) police van = the drop target
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  useEffect(() => { setBal(Number(hints) || 0); }, [hints]);
  const updHints = (h: number) => { setBal(h); if (setHints) setHints(h); };

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

  // 1. open the level - the backend creates or resumes the session
  const load = useCallback(() => {
    setLoadErr(''); setView(null);
    startLevel25(playerId)
      .then((v) => {
        setSessionId(v.sessionId);
        setView(v);
        if (typeof v.hints === 'number') updHints(v.hints);
      })
      .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
  }, [playerId]);

  useEffect(() => {
    load();
    return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
  }, [load]);

  useEffect(() => {
    if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
  }, [result]);

  const flash = (m: string) => {
    setMsg(m); clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 2800);
  };
  const doShake = () => Animated.sequence([10, -10, 6, -6, 0].map((v) =>
    Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

  // right move: the door STAYS exactly where the player dropped it (on the van).
  // Sahur pops out of the van and runs away.
  const playWin = () => {
    Animated.sequence([
      Animated.delay(150),
      Animated.spring(sahurS, { toValue: 1, friction: 5, tension: 90, useNativeDriver: false }),
      Animated.delay(450),
      Animated.parallel([
        Animated.timing(sahurX, { toValue: 70 * k, duration: 800, useNativeDriver: false }),
        Animated.timing(sahurO, { toValue: 0, duration: 800, useNativeDriver: false }),
      ]),
    ]).start();
  };

  // 2. send the drop to the backend; the backend decides if it is right
  const act = async (target: string): Promise<boolean> => {
    if (busy || done || !sessionId) return false;
    setBusy(true);
    const z = ZONES[target];
    try {
      // backend contract is unchanged: "van" + door id. Door dropped beside the van == van beside that door.
      const res = await sendAction25({ sessionId, playerId, item: 'van', target });
      if (!res.correct) {
        play('wrong');
        if (z) setMark({ x: (z.x + z.w / 2) * k, y: (z.y + z.h / 2) * k });
        doShake(); flash(res.message || 'Not quite. Try again!');
        later(() => setMark(null), 700);
        setBusy(false);
        return false;
      }
      play('correct');
      flash(res.message || 'Correct!');
      setDone(true);
      playWin();
      later(() => setResult(res), 2400);
      return true;
    } catch (e: any) {
      flash(e.message || 'Network error');
      setBusy(false);
      return false;
    }
  };

  // is the finger near the van when the door is let go? (pad = extra forgiving margin in px)
  const hit = (ref: React.RefObject<View>, mx: number, my: number, pad: number) => new Promise<boolean>((resolve) => {
    const node: any = ref.current;
    if (!node || !node.measureInWindow) { resolve(false); return; }
    node.measureInWindow((x: number, y: number, w: number, h: number) => {
      resolve(mx >= x - pad && mx <= x + w + pad && my >= y - pad && my <= y + h + pad);
    });
  });

  const onDrop = async (mx: number, my: number): Promise<boolean> => {
    if (busy || done || !sessionId) return false;
    if (await hit(vanRef, mx, my, 36)) return act(DRAG_DOOR);
    return false;
  };

  // magnifier: free clue popup, no hints / coins / video needed
  const onClue = () => { if (!done) { play('clue'); setClueOpen(true); } };

  const onVideo = async () => {
    if (actBusy.current) return;
    play('btn');
    actBusy.current = true;
    try {
      const r: any = await api.reward(playerId, 'video');
      if (typeof r?.hints === 'number') updHints(r.hints);
    } catch (e) { }
    finally { actBusy.current = false; }
  };

  const onSkip = async () => {
    if (actBusy.current || busy || done || !sessionId) return;
    play('btn');
    if (bal < SKIP_COST) { flash('Need ' + SKIP_COST + ' hints. You have ' + bal + '.'); return; }
    actBusy.current = true;
    try {
      const r = await skipLevel25({ sessionId, playerId });
      if (typeof r.hints === 'number') updHints(r.hints);
      setDone(true);
      flash('Skipped!');
      later(() => setResult({ ...r, skipped: true }), 900);
    } catch (e: any) {
      flash(e.message || 'Network error');
    } finally { actBusy.current = false; }
  };

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
          <Text style={st.signT}>LEVEL 25</Text>
          <Text style={st.signArrow}>{'>'}</Text>
        </View>
      </Animated.View>

      <View style={st.pillWrap}>
        <View style={st.pill}>
          <Text style={st.pillT}>{bal}</Text>
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
                <Text style={st.load}>Loading level 25...</Text>
              </>
            )}
          </View>
        </View>
      </Stage>
    );
  }

  const ninja = (
    <Animated.View pointerEvents="none"
      style={{
        position: 'absolute', left: NINJA.x * k, top: NINJA.y * k, width: NINJA.w * k, height: NINJA.h * k, opacity: ninO,
        transform: [{ translateX: ninX }, { translateY: ninY }],
      }}>
      <NinjaArt w={NINJA.w * k} />
    </Animated.View>
  );

  return (
    <Stage bg={SKY}>
      <View style={st.root}>
        <Garden />
        {header}

        <View style={st.center}>
          {/* question pill */}
          <View style={st.qPill}>
            <Text style={st.qArrow}>{'<'}</Text>
            <Text style={[st.q, msg ? { color: done ? '#2b8a3e' : '#c0392b' } : null]}>{msg || view.title}</Text>
            <Text style={st.qArrow}>{'>'}</Text>
          </View>

          {/* the scene */}
          <Animated.View style={{ width: SW, height: SH, marginTop: 10, transform: [{ translateX: shake }] }}>
            {/* Sahur sits behind the roof until the level is solved */}
            {!done && ninja}
            <Scene w={SW} />
            {/* after the win he jumps down in front of everything */}
            {done && ninja}

            {/* the police van stays where it is - it is the drop target */}
            <View ref={vanRef} collapsable={false} pointerEvents="none"
              style={{ position: 'absolute', left: VAN.x * k, top: VAN.y * k, width: VAN.w * k, height: VAN.h * k, zIndex: 5 }}>
              <VanArt w={VAN.w * k} />
            </View>

            {/* only ONE house door can be pulled out and dropped beside the van */}
            <DragDoor g={door} pan={panD} fade={doorFade} disabled={busy || done} onDrop={onDrop} />

            {/* Sahur escapes from the van */}
            {done && (
              <Animated.View pointerEvents="none"
                style={{
                  position: 'absolute', left: (VAN.x + VAN.w * 0.78) * k, top: (VAN.y + VAN.h) * k - sW * 1.5, zIndex: 65, opacity: sahurO,
                  transform: [{ translateX: sahurX }, { scale: sahurS }],
                }}>
                <SahurFree w={sW} />
              </Animated.View>
            )}

            {done && <View pointerEvents="none" style={{ position: 'absolute', left: SW / 2 - 40, top: SH * 0.12, zIndex: 70 }}><Tick s={80} /></View>}
            {mark && <View pointerEvents="none" style={{ position: 'absolute', left: mark.x - 23, top: mark.y - 23, zIndex: 80 }}><Cross /></View>}
          </Animated.View>
        </View>

        {/* bottom wooden panel (same as Level 11 / 15 / 24) */}
        <View style={st.panel}>
          <View style={[st.plank, { top: 14, left: 28, right: 28 }]} />
          <View style={[st.plank, { top: 56, left: 22, right: 22 }]} />
          <View style={[st.plank, { bottom: 12, left: 28, right: 28 }]} />
          <View style={[st.screw, { left: 12, top: 12 }]} />
          <View style={[st.screw, { right: 12, top: 12 }]} />
          <View style={[st.screw, { left: 12, bottom: 12 }]} />
          <View style={[st.screw, { right: 12, bottom: 12 }]} />

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={onClue}>
              <Icon n="search" s={28} />
            </TouchableOpacity>
            <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onVideo}>
              <Icon n="film" s={32} />
            </TouchableOpacity>
            <View style={st.badge}><Coin s={12} /><Text style={st.badgeT}>+75</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onSkip}>
              <DoubleArrow s={30} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>{SKIP_COST}</Text></View>
          </View>
        </View>

        {/* CLUES popup (free) */}
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
                  <Text style={st.clueBody}>{view.clue}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* result card */}
        {!!result && (
          <View style={st.overlay}>
            <Animated.View style={[st.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
              <Text style={st.cardTitle}>Level complete!</Text>
              <Text style={st.cardMsg}>{result.message}</Text>
              <View style={st.stars}>{[1, 2, 3].map((n) => <StarIcon key={n} size={46} on={n <= (result.stars || 0)} />)}</View>
              {!result.skipped && <Text style={st.cardScore}>Score {result.score}</Text>}
              <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={() => { play('btn'); onComplete ? onComplete(result) : onExit(); }}>
                <Text style={st.nextT}>NEXT</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </Stage>
  );
}

/* =========================================================
   STYLES (garden theme, same as Level 9 / 11 / 15 / 24)
========================================================= */

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

  /* top bar */
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

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 135 },
  centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, maxWidth: 380, elevation: 3 },
  qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
  q: { flexShrink: 1, fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

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
  badgeT: { fontFamily: FONT, fontSize: 14, fontWeight: '900', color: '#fff' },

  /* clue popup */
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 90, elevation: 90 },
  clueCard: { width: '86%', maxWidth: 360, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
  clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
  closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12 },
  clueRowOpen: { backgroundColor: '#fff', borderColor: GREEN_OK },
  clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
  clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
  clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
  clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },

  /* result card */
  card: { width: '82%', maxWidth: 360, alignItems: 'center', backgroundColor: CREAM, borderWidth: 6, borderColor: WOOD_D, borderRadius: 28, padding: 20 },
  cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY },
  cardMsg: { fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center', marginTop: 6 },
  stars: { flexDirection: 'row', gap: 6, marginTop: 14 },
  cardScore: { fontFamily: FONT, fontSize: 22, fontWeight: '800', color: '#bd6b29', marginTop: 10 },
  next: { marginTop: 18, minWidth: 170, height: 56, borderRadius: 28, backgroundColor: LIME, borderWidth: 3, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
  nextT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: '#1b1b1b' },

  /* loading / error */
  load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
  err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
  retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
  retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
  back: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },
});
