
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Platform, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { startLevel21, submitPicks, requestHint21, skipLevel21, Level21View, Level21Action } from './Btlevel21api';
import { F, Stage, Coin } from './BTShared';
import { Icon } from './Art';
import { play } from './BTSound';
import * as api from './api';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

/* garden palette (same as Level 16 - 20) */
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
const WRONG = '#c0392b';

const SKIP_COST = 50;

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit: () => void;
  onComplete?: (result: Level21Action) => void;
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
          <LinearGradient id="g21sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g21sky)" />
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

export default function BTLevel21Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
  const { width } = useWindowDimensions();
  const bw = Math.min(width, 460);

  const [view, setView] = useState<Level21View | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [picked, setPicked] = useState<number[]>([]);
  const [locked, setLocked] = useState<number[]>([]);   // numbers revealed by hints
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [solved, setSolved] = useState(false);
  const [bal, setBal] = useState<number>(Number(hints) || 0);
  const [hintText, setHintText] = useState('');
  const [showHint, setShowHint] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;
  const win = useRef(new Animated.Value(1)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const qIn = useRef(new Animated.Value(0)).current;
  const timers = useRef<any[]>([]);
  const msgTimer = useRef<any>(null);
  const actBusy = useRef(false);
  const lockedR = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  useEffect(() => { setBal(Number(hints) || 0); }, [hints]);
  const updHints = (h: number) => { setBal(h); if (setHints) setHints(h); };

  // 1. open the level: the backend makes 9 numbers (1..200) and saves them in MySQL
  const load = useCallback(() => {
    setLoadErr(''); setView(null); setPicked([]); setLocked([]); lockedR.current = []; setSolved(false);
    setShowHint(false); setHintText('');
    startLevel21(playerId)
      .then((v) => { setSessionId(v.sessionId); setView(v); })
      .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
  }, [playerId]);

  useEffect(() => {
    load();
    return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
  }, [load]);

  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    Animated.spring(qIn, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
    return () => a.stop();
  }, []);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });
  const qY = qIn.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

  const showMsg = (m: string) => {
    setMsg(m);
    clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 2800);
  };

  const shakeBoard = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true })]).start();
  };

  // 2. frontend -> backend -> MySQL -> JSON back
  const submit = async (list: number[]) => {
    if (!sessionId) return;
    setBusy(true);
    try {
      const res = await submitPicks({ sessionId, playerId, picks: list });
      if (res.correct) {
        play('correct');
        setSolved(true);
        showMsg(res.message || 'Correct!');
        Animated.sequence([
          Animated.timing(win, { toValue: 1.06, duration: 200, useNativeDriver: true }),
          Animated.spring(win, { toValue: 1, friction: 4, useNativeDriver: true })]).start();
        later(() => { onComplete ? onComplete(res) : onExit(); }, 1400);
        return;
      }
      play('wrong');
      showMsg(res.message || 'Not quite. Try again!');
      shakeBoard();
    } catch (e: any) {
      showMsg(e.message || 'Network error');
    }
    // wrong: clear the picks, but keep numbers revealed by hints
    later(() => { setPicked(lockedR.current); setBusy(false); }, 700);
  };

  const onPick = (i: number) => {
    if (busy || solved || !view) return;
    if (lockedR.current.includes(i)) return;       // hint numbers stay selected
    play('tap');
    if (picked.includes(i)) { setPicked(picked.filter((x) => x !== i)); return; }
    if (picked.length >= view.pickCount) return;
    const next = [...picked, i];
    setPicked(next);
    if (next.length === view.pickCount) submit(next);
  };

  // 3. hint: show the single clue without locking any answer numbers
  const onHint = async () => {
    if (actBusy.current || busy || solved || !sessionId) return;
    play('clue');
    actBusy.current = true;
    try {
      const r = await requestHint21({ sessionId, playerId });
      if (typeof r.hints === 'number') updHints(r.hints);
      setHintText(r.message || 'Hint used');
      setShowHint(true);
    } catch (e: any) {
      showMsg(e.message || 'Network error');
    } finally { actBusy.current = false; }
  };

  const onVideo = async () => {
    if (actBusy.current) return;
    actBusy.current = true;
    play('btn');
    try {
      const r: any = await api.reward(playerId, 'video');
      if (typeof r?.hints === 'number') updHints(r.hints);
    } catch (e) { }
    finally { actBusy.current = false; }
  };

  const onSkip = async () => {
    if (actBusy.current || busy || solved || !sessionId) return;
    play('btn');
    if (bal < SKIP_COST) { showMsg('Need ' + SKIP_COST + ' hints. You have ' + bal + '.'); return; }
    actBusy.current = true;
    try {
      const r = await skipLevel21({ sessionId, playerId });
      if (typeof r.hints === 'number') updHints(r.hints);
      setSolved(true);
      showMsg('Skipped!');
      later(() => { onComplete ? onComplete({ ...r, skipped: true }) : onExit(); }, 900);
    } catch (e: any) {
      showMsg(e.message || 'Network error');
    } finally { actBusy.current = false; }
  };

  /* ---------- header (same as Level 16 - 20) ---------- */
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
          <Text style={st.signT}>LEVEL 21</Text>
          <Text style={st.signArrow}>{'>'}</Text>
        </View>
      </Animated.View>

      <View style={st.pillWrap}>
        <View style={st.pill}>
          <Text style={st.pillT} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{bal}</Text>
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
          <View style={st.center}>
            {loadErr ? (
              <>
                <Text style={st.errText}>{loadErr}</Text>
                <TouchableOpacity style={st.retry} onPress={() => { play('btn'); load(); }}>
                  <Text style={st.retryT}>Try again</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { play('btn'); onExit(); }}>
                  <Text style={st.back}>Back</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <ActivityIndicator color="#fff" size="large" />
                <Text style={st.loading}>Loading level 21...</Text>
              </>
            )}
          </View>
        </View>
      </Stage>
    );
  }

  const total = picked.reduce((s, i) => s + (view.numbers[i] || 0), 0);
  const cell = Math.floor((bw - 60) / 3);              // grid cell
  const circle = Math.min(66, cell - 16);              // number bubble (smaller)
  const ring = circle + 12;                            // dashed ring
  const numFS = Math.round(circle * 0.36);             // smaller number text

  const info = msg || (picked.length ? `Picked ${picked.length}/${view.pickCount}  •  Total ${total}` : view.hint);
  const infoColor = msg ? (solved ? '#1b6b3a' : WRONG) : NAVY;

  return (
    <Stage bg={SKY}>
      <View style={st.root}>
        <Garden />
        {header}

        {/* question pill */}
        <Animated.View style={[st.qWrap, { opacity: qIn, transform: [{ translateY: qY }] }]}>
          <View style={st.qPill}>
            <Text style={st.qArrow}>{'<'}</Text>
            <Text style={st.q}>{view.title}</Text>
            <Text style={st.qArrow}>{'>'}</Text>
          </View>
        </Animated.View>

        {/* 3 x 3 number grid */}
        <View style={st.play}>
          <Animated.View style={[st.grid, { width: cell * 3, transform: [{ translateX: shake }, { scale: win }] }]}>
            {view.numbers.map((n, i) => {
              const on = picked.includes(i);
              const isLocked = locked.includes(i);
              return (
                <View key={i} style={{ width: cell, height: ring + 8, alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => onPick(i)}
                    style={[st.ring, { width: ring, height: ring, borderRadius: ring / 2 },
                      on && { borderColor: solved ? GREEN_OK : isLocked ? '#2b8a3e' : NAVY }]}
                  >
                    <View style={[st.bubble, { width: circle, height: circle, borderRadius: circle / 2 },
                      on && { backgroundColor: solved ? '#c8f0b8' : isLocked ? '#d7f5c4' : LIME, borderColor: NAVY }]}>
                      <Text style={[st.num, { fontSize: numFS }]} numberOfLines={1}>{n}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </Animated.View>

          <Text style={[st.info, { color: infoColor }]}>{info}</Text>
        </View>

        {/* bottom wooden panel (smaller, same as Level 16 - 20) */}
        <View style={st.panel}>
          <View style={[st.plank, { top: 14, left: 28, right: 28 }]} />
          <View style={[st.plank, { top: 56, left: 22, right: 22 }]} />
          <View style={[st.plank, { bottom: 12, left: 28, right: 28 }]} />
          <View style={[st.screw, { left: 12, top: 12 }]} />
          <View style={[st.screw, { right: 12, top: 12 }]} />
          <View style={[st.screw, { left: 12, bottom: 12 }]} />
          <View style={[st.screw, { right: 12, bottom: 12 }]} />

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={onHint}>
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

        {/* HINTS popup (same as Level 19 / 20) */}
        {showHint && (
          <View style={st.overlay}>
            <View style={st.clueCard}>
              <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setShowHint(false); }}>
                <Icon n="cross" s={20} />
              </TouchableOpacity>
              <Text style={st.clueTitle}>HINTS</Text>

              <View style={[st.clueRow, st.clueRowOpen]}>
                <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={st.clueHead}>Hint 1</Text>
                  <Text style={st.clueBody}>{hintText}</Text>
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
   STYLES
========================================================= */

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

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
  qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, maxWidth: 400, elevation: 3 },
  qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
  q: { flexShrink: 1, fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

  // number grid
  play: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 135 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  ring: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.95)' },
  bubble: {
    backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: CREAM_BORDER,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.18, shadowRadius: 4, elevation: 4,
  },
  num: { fontFamily: FONT, fontWeight: '900', color: NAVY },
  info: { fontFamily: SERIF, fontSize: 16, fontWeight: '800', fontStyle: 'italic', textAlign: 'center', marginTop: 10, paddingHorizontal: 20, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 14, paddingVertical: 4, overflow: 'hidden' },

  loading: { fontFamily: FONT, fontSize: 20, color: '#fff', marginTop: 12 },
  errText: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
  retry: { marginTop: 16, backgroundColor: LIME, borderWidth: 3, borderColor: '#1b1b1b', borderRadius: 30, paddingHorizontal: 30, paddingVertical: 8 },
  retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
  back: { fontFamily: FONT, fontSize: 18, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },

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

  // HINTS popup (same as Level 19 / 20)
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50, elevation: 50 },
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
