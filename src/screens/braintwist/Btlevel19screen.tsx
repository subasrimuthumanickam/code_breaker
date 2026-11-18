
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Platform, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { F, Stage, Coin } from './BTShared';
import { Icon } from './Art';
import { Grid } from './Btlevel19art';
import { play } from './BTSound';
import { startLevel19, answerLevel19, hintLevel19, skipLevel19, rewardLevel19, Level19View, Level19Result } from './Btlevel19api';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

/* garden palette (same as Level 16 / 18) */
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
const PINK = '#ff5a7a';
const INK = '#1b1b1b';

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit: () => void;
  onComplete?: (result: Level19Result) => void;
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
          <LinearGradient id="g19sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g19sky)" />
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

export default function BTLevel19Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
  const { width, height } = useWindowDimensions();
  const CW = Math.min(width - 24, 380);                 // card width
  // size of one drawing: smaller on short screens, so SUBMIT always stays above the panel
  const FS = Math.max(50, Math.min(72, Math.floor((height - 450) / 4.6), Math.floor((CW - 60) / 2.3)));

  const [view, setView] = useState<Level19View | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  const [ov, setOv] = useState<string | null>(null);       // check / cross over the number
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [clues, setClues] = useState<{ n: number; text: string }[]>([]);
  const [showClues, setShowClues] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const qIn = useRef(new Animated.Value(0)).current;

  const doneRef = useRef(false);
  const busyRef = useRef(false);
  const timers = useRef<any[]>([]);
  const msgTimer = useRef<any>(null);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const flash = (m: string) => {
    setMsg(m); clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 2800);
  };
  const doShake = () => Animated.sequence([8, -8, 5, -5, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

  // 1. open the level - the backend makes a new game
  const load = useCallback(() => {
    setLoadErr(''); setView(null);
    startLevel19(playerId)
      .then((v) => {
        doneRef.current = false; busyRef.current = false;
        setDone(false); setOv(null); setCount(0);
        setClues([]); setShowClues(false);
        setSessionId(v.sessionId);
        setView(v);
        if (setHints && typeof v.hints === 'number') setHints(v.hints);
      })
      .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
  }, [playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

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

  // 2. SUBMIT: send the number, the backend says if it is right
  const submit = async () => {
    if (doneRef.current || busyRef.current || !sessionId) return;
    busyRef.current = true;
    setConfirmSkip(false);
    play('btn');
    try {
      const r = await answerLevel19({ sessionId, playerId, answer: count });
      if (r.correct) {
        play('correct');
        doneRef.current = true;
        setDone(true); setOv('check');
        if (setHints && typeof r.hints === 'number') setHints(r.hints);
        later(() => { onComplete ? onComplete(r) : onExit(); }, 1100);
      } else {
        play('wrong');
        doShake();
        setOv('cross');
        flash(r.message || 'Not quite. Try again!');
        later(() => setOv(null), 800);
      }
    } catch (e: any) {
      flash(e.message || 'Network error');
    } finally {
      busyRef.current = false;
    }
  };

  // magnifier: a clue about the pattern, shown in the CLUES modal
  const onHint = async () => {
    if (done || !sessionId) return;
    play('clue');
    setConfirmSkip(false);
    try {
      const r = await hintLevel19({ sessionId, playerId });
      setHints && setHints(r.hints);
      setClues((prev) => {
        const rest = prev.filter((c) => c.n !== r.index);
        return [...rest, { n: r.index, text: r.text }].sort((a, b) => a.n - b.n);
      });
      setShowClues(true);
    } catch (e: any) {
      flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
    }
  };

  // video reward (+75 hints)
  const onReward = async () => {
    if (done) return;
    play('btn');
    setConfirmSkip(false);
    try {
      const r = await rewardLevel19(playerId);
      setHints && setHints(r.hints);
      flash('+' + r.added + ' hints');
    } catch (e: any) {
      flash(e.message || 'Network error');
    }
  };

  // skip (50 hints): tap twice
  const onSkip = async () => {
    if (done || !sessionId) return;
    play('btn');
    if (!confirmSkip) {
      setConfirmSkip(true);
      flash('Skip costs 50 hints. Tap again to skip.');
      return;
    }
    try {
      const r = await skipLevel19({ sessionId, playerId });
      setHints && setHints(r.hints || 0);
      doneRef.current = true;
      onComplete ? onComplete(r) : onExit();
    } catch (e: any) {
      setConfirmSkip(false);
      play('wrong');
      flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
    }
  };

  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });
  const qY = qIn.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

  /* ---------- header (same as Level 16 / 18) ---------- */
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
          <Text style={s.signT}>LEVEL 19</Text>
          <Text style={s.signArrow}>{'>'}</Text>
        </View>
      </Animated.View>

      <View style={s.pillWrap}>
        <View style={s.pill}>
          <Text style={s.pillT} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{hints}</Text>
        </View>
      </View>
    </View>
  );

  /* ---------- loading / error ---------- */

  if (loadErr || !view) {
    return (
      <Stage bg={SKY}>
        <View style={s.root}>
          <Garden />
          {header}
          <View style={s.center}>
            {loadErr ? (
              <>
                <Text style={s.err}>{loadErr}</Text>
                <TouchableOpacity style={s.retry} onPress={() => { play('btn'); load(); }}>
                  <Text style={s.retryT}>Try again</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { play('btn'); onExit(); }}>
                  <Text style={s.back}>Back</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={s.load}>Loading level 19...</Text>
              </>
            )}
          </View>
        </View>
      </Stage>
    );
  }

  const top = view.figures.slice(0, 2), bottom = view.figures.slice(2);

  // one drawing: the label (number or "?") is always written under it,
  // in the same place and style, so the "?" is centered like the numbers
  const fig = (f: { lines: number; label: string }, i: number) => (
    <View key={i} style={s.fig}>
      <Grid lines={f.lines} size={FS} />
      <Text style={s.figNum}>{f.label}</Text>
    </View>
  );

  return (
    <Stage bg={SKY}>
      <View style={s.root}>
        <Garden />
        {header}

        {/* question pill */}
        <Animated.View style={[s.qWrap, { opacity: qIn, transform: [{ translateY: qY }] }]}>
          <View style={s.qPill}>
            <Text style={s.qArrow}>{'<'}</Text>
            <Text style={[s.q, msg ? { color: '#c0392b' } : null]}>{msg || view.title}</Text>
            <Text style={s.qArrow}>{'>'}</Text>
          </View>
        </Animated.View>

        {/* puzzle + counter + submit */}
        <Animated.View style={[s.play, { transform: [{ translateX: shake }] }]}>
          <View style={[s.card, { width: CW }]}>
            <View style={s.row}>{top.map(fig)}</View>
            <View style={s.rowBottom}>{bottom.map(fig)}</View>
          </View>

          <View style={s.crow}>
            <TouchableOpacity style={s.cbtn} disabled={done} onPress={() => { play('tap'); setCount((c) => Math.max(0, c - 1)); }}>
              <Text style={s.cbt}>−</Text>
            </TouchableOpacity>
            <View style={s.cnumBox}>
              <Text style={s.cnum}>{count}</Text>
              {!!ov && <View pointerEvents="none" style={s.cov}><Icon n={ov} s={56} /></View>}
            </View>
            <TouchableOpacity style={s.cbtn} disabled={done} onPress={() => { play('tap'); setCount((c) => Math.min(99, c + 1)); }}>
              <Text style={s.cbt}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.submit} disabled={done} onPress={submit}>
            <Text style={s.subt}>SUBMIT</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* bottom wooden panel (smaller, same as Level 16 / 18) */}
        <View style={s.panel}>
          <View style={[s.plank, { top: 14, left: 28, right: 28 }]} />
          <View style={[s.plank, { top: 56, left: 22, right: 22 }]} />
          <View style={[s.plank, { bottom: 12, left: 28, right: 28 }]} />
          <View style={[s.screw, { left: 12, top: 12 }]} />
          <View style={[s.screw, { right: 12, top: 12 }]} />
          <View style={[s.screw, { left: 12, bottom: 12 }]} />
          <View style={[s.screw, { right: 12, bottom: 12 }]} />

          <View style={s.btnCol}>
            <TouchableOpacity style={[s.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={onHint}>
              <Icon n="search" s={28} />
            </TouchableOpacity>
            <View style={s.badge}><Text style={s.badgeT}>FREE</Text></View>
          </View>

          <View style={s.btnCol}>
            <TouchableOpacity style={[s.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onReward}>
              <Icon n="film" s={32} />
            </TouchableOpacity>
            <View style={s.badge}><Coin s={12} /><Text style={s.badgeT}>+75</Text></View>
          </View>

          <View style={s.btnCol}>
            <TouchableOpacity style={[s.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onSkip}>
              <DoubleArrow s={30} />
            </TouchableOpacity>
            <View style={s.badge}><Icon n="bulb" s={15} /><Text style={s.badgeT}>50</Text></View>
          </View>
        </View>

        {/* CLUES popup */}
        {showClues && (
          <View style={s.overlay}>
            <View style={s.clueCard}>
              <TouchableOpacity style={s.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setShowClues(false); }}>
                <Icon n="cross" s={20} />
              </TouchableOpacity>
              <Text style={s.clueTitle}>HINTS</Text>

              {clues.map((c) => (
                <View key={c.n} style={[s.clueRow, s.clueRowOpen]}>
                  <View style={s.clueNum}><Text style={s.clueNumT}>{c.n}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.clueHead}>Hint {c.n}</Text>
                    <Text style={s.clueBody}>{c.text}</Text>
                  </View>
                </View>
              ))}
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

const s = StyleSheet.create({
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
  qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, maxWidth: 380, elevation: 3 },
  qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
  q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

  // puzzle area
  play: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 135 },
  card: { backgroundColor: '#fffdf8', borderWidth: 3, borderColor: '#d9c9a8', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 10, elevation: 4 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 56 },
  rowBottom: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
  fig: { alignItems: 'center', justifyContent: 'center', minWidth: 70 },
  figNum: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: PINK, marginTop: -6, lineHeight: 28, textAlign: 'center', alignSelf: 'center' },

  crow: { flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 8 },
  cbtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#5ba8d0', borderWidth: 2.5, borderColor: INK, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  cbt: { fontFamily: FONT, fontSize: 30, fontWeight: 'bold', color: INK, lineHeight: 34 },
  cnumBox: { minWidth: 70, height: 52, alignItems: 'center', justifyContent: 'center' },
  cnum: { fontFamily: FONT, fontSize: 42, fontWeight: 'bold', color: NAVY },
  cov: { position: 'absolute', left: 0, right: 0, top: -4, alignItems: 'center' },
  submit: { marginTop: 6, paddingHorizontal: 30, paddingVertical: 7, borderRadius: 20, borderWidth: 2.5, borderColor: INK, backgroundColor: CREAM, elevation: 3 },
  subt: { fontFamily: FONT, fontSize: 20, fontWeight: 'bold', color: INK },

  load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
  err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
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