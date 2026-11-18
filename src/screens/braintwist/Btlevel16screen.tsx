
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Platform, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Icon } from './Art';
import { F, Stage, Coin } from './BTShared';
import { play } from './BTSound';
import * as api from './api'; // generic api (api.reward for the video button)
import { Placements, PuzzleBoard, SceneState } from './Btlevel16art';
import {
  answerLevel16,
  hintLevel16,
  Level16Data,
  skipLevel16,
  startLevel16,
} from './Btlevel16api';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

/* garden palette (same as Level 15) */
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

const SKIP_COST = 50;
const EMPTY: Placements = { red: null, green: null, cyan: null };

type Props = {
  playerId: number;
  hints: number;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onComplete?: (r: any) => void;
};

/* ---------- garden background (same as Level 15) ---------- */
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
          <LinearGradient id="g16sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g16sky)" />
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

export default function Btlevel16screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
  const { width } = useWindowDimensions();
  const W = Math.min(width, 450);
  const sceneW = Math.min(W - 56, 340);

  const [level, setLevel] = useState<Level16Data | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [placements, setPlacements] = useState<Placements>(EMPTY);
  const [sceneState, setSceneState] = useState<SceneState>('idle');
  const [locked, setLocked] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [clues, setClues] = useState<string[]>([]);   // hint texts that came from the backend
  const [showClues, setShowClues] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const qIn = useRef(new Animated.Value(0)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // hanging sign sways gently
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    Animated.spring(qIn, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
    return () => a.stop();
  }, [sway, qIn]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });
  const qY = qIn.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const d = await startLevel16(playerId);
      setSessionId(d.sessionId);
      setLevel(d.level);
      setClues(d.clues ?? []);   // hints this session already used (stored in the database)
      if (typeof d.hints === 'number') setHints?.(d.hints);
    } catch (e: any) {
      setError(e?.message ?? 'Cannot load level 16');
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (m: string) => {
    setNote(m);
    later(() => setNote(null), 2600);
  };

  const runShake = () => {
    shake.setValue(0);
    Animated.sequence(
      [1, -1, 1, 0].map((v) =>
        Animated.timing(shake, { toValue: v, duration: 70, easing: Easing.linear, useNativeDriver: true })
      )
    ).start();
  };

  /* ---------- puzzle (drag & drop) ---------- */

  const submit = async (next: Placements) => {
    if (!sessionId) return;
    setLocked(true);
    try {
      const r = await answerLevel16(playerId, sessionId, next as Record<string, string>);
      if (r.correct) {
        play('correct');
        setSceneState('right');
        setExplanation(r.explanation);
        later(() => onComplete?.({ ...r, skipped: false }), 2400);
      } else {
        play('wrong');
        setSceneState('wrong');
        runShake();
        if (r.message) flash(r.message);
        later(() => {
          setPlacements(EMPTY);
          setSceneState('idle');
          setLocked(false);
        }, 1000);
      }
    } catch (e: any) {
      flash('Network error');
      setPlacements(EMPTY);
      setLocked(false);
    }
  };

  // an object was dropped: into a frame (frameId) or back outside (null)
  const handleDrop = (pieceId: string, frameId: string | null) => {
    if (locked) return;
    const next = { ...placements, [pieceId]: frameId };
    setPlacements(next);
    if (Object.values(next).every(Boolean)) submit(next);
  };

  /* ---------- bottom buttons ---------- */

  // tap the search button:
  //  frontend -> POST /level16/hint -> backend saves the hint use in the database
  //  -> backend answers JSON { hint: { number, text } } -> we show that text in the popup
  const handleHint = async () => {
    if (!sessionId || locked) return;
    play('clue');
    // ALWAYS ask the backend, every single tap (the backend saves the first use only once)
    try {
      const r = await hintLevel16(playerId, sessionId);
      setClues(r.clues && r.clues.length ? r.clues : [r.hint.text]);
      if (typeof r.hints === 'number') setHints?.(r.hints);
      setShowClues(true);
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : e?.message || 'Network error');
    }
  };

  const handleSkip = async () => {
    if (!sessionId || locked) return;
    play('btn');
    try {
      setLocked(true);
      const r = await skipLevel16(playerId, sessionId);
      setHints?.(r.hints);
      onComplete?.({ ...r, skipped: true });
    } catch (e: any) {
      setLocked(false);
      play('wrong');
      flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
    }
  };

  const handleVideo = async () => {
    play('btn');
    try {
      const r = await api.reward(playerId, 'video');
      setHints?.(r.hints);
    } catch (e) {}
  };

  const shakeX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-9, 9] });
  const shownClues = clues.map((text, i) => ({ text, n: i + 1 })).filter((c) => !!c.text);

  /* ---------- header (same as Level 15, small hint counter) ---------- */
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
          <Text style={st.signT}>LEVEL 16</Text>
          <Text style={st.signArrow}>{'>'}</Text>
        </View>
      </Animated.View>

      <View style={st.pillWrap}>
        <View style={st.pill}>
          <Text style={st.pillT} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{hints}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Stage bg={SKY}>
      <View style={st.root}>
        <Garden />
        {header}

        {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 60 }} />}

        {!loading && error && (
          <View style={st.errorBox}>
            <Text style={st.errorText}>{error}</Text>
            <TouchableOpacity style={st.retryBtn} onPress={() => { play('btn'); load(); }}>
              <Text style={st.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && level && (
          <>
            {/* question pill */}
            <Animated.View style={[st.qWrap, { opacity: qIn, transform: [{ translateY: qY }] }]}>
              <View style={st.qPill}>
                <Text style={st.qArrow}>{'<'}</Text>
                <Text style={[st.q, note ? { color: '#c0392b' } : null]}>{note || level.question}</Text>
                <Text style={st.qArrow}>{'>'}</Text>
              </View>
            </Animated.View>

            {/* puzzle card */}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 135 }}>
              <View style={[st.card, { width: sceneW + 24 }]}>
                <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
                  <PuzzleBoard
                    width={sceneW}
                    placements={placements}
                    state={sceneState}
                    disabled={locked}
                    onDrop={handleDrop}
                  />
                </Animated.View>

                {explanation ? (
                  <View style={st.okBox}>
                    <Text style={st.okTitle}>Correct!</Text>
                    <Text style={st.okText}>{explanation}</Text>
                  </View>
                ) : (
                  <Text style={st.tip}>{level.subtitle}</Text>
                )}
              </View>
            </View>
          </>
        )}

        {/* bottom wooden panel (same as Level 15) */}
        <View style={st.panel}>
          <View style={[st.plank, { top: 14, left: 28, right: 28 }]} />
          <View style={[st.plank, { top: 56, left: 22, right: 22 }]} />
          <View style={[st.plank, { bottom: 12, left: 28, right: 28 }]} />
          <View style={[st.screw, { left: 12, top: 12 }]} />
          <View style={[st.screw, { right: 12, top: 12 }]} />
          <View style={[st.screw, { left: 12, bottom: 12 }]} />
          <View style={[st.screw, { right: 12, bottom: 12 }]} />

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={handleHint}>
              <Icon n="search" s={28} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>FREE</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={handleVideo}>
              <Icon n="film" s={32} />
            </TouchableOpacity>
            <View style={st.badge}><Coin s={12} /><Text style={st.badgeT}>+75</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={handleSkip}>
              <DoubleArrow s={30} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>{SKIP_COST}</Text></View>
          </View>
        </View>

        {/* HINTS popup (texts come from the backend) */}
        {showClues && (
          <View style={st.overlay}>
            <View style={st.clueCard}>
              <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setShowClues(false); }}>
                <Icon n="cross" s={20} />
              </TouchableOpacity>
              <Text style={st.clueTitle}>HINTS</Text>

              {shownClues.map((c) => (
                <View key={c.n} style={[st.clueRow, st.clueRowOpen]}>
                  <View style={st.clueNum}><Text style={st.clueNumT}>{c.n}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.clueHead}>Hint {c.n}</Text>
                    <Text style={st.clueBody}>{c.text}</Text>
                  </View>
                </View>
              ))}

              {level && shownClues.length < level.hintCount && (
                <Text style={st.mFoot}>Tap the search button for the next free hint</Text>
              )}
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

  // puzzle card (light card like the vault picture in Level 15)
  card: {
    backgroundColor: '#ececec', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 12, alignItems: 'center',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },
  tip: { marginTop: 6, fontFamily: FONT, fontSize: 13, fontWeight: '700', color: '#6a7ea8', textAlign: 'center' },
  okBox: { marginTop: 8, backgroundColor: '#dff7e4', borderColor: GREEN_OK, borderWidth: 2, borderRadius: 14, paddingVertical: 8, paddingHorizontal: 12 },
  okTitle: { fontFamily: FONT, fontSize: 16, fontWeight: '900', color: '#1b6b3a', textAlign: 'center' },
  okText: { fontFamily: FONT, fontSize: 13, fontWeight: '600', color: '#33302a', textAlign: 'center' },

  errorBox: { marginTop: 60, alignItems: 'center', gap: 12 },
  errorText: { fontFamily: FONT, color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center', paddingHorizontal: 20 },
  retryBtn: { backgroundColor: LIME, borderWidth: 3, borderColor: '#1b1b1b', borderRadius: 30, paddingHorizontal: 30, paddingVertical: 8 },
  retryText: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },

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
  mFoot: { fontFamily: FONT, marginBottom: 8, textAlign: 'center', fontSize: 13, fontWeight: '700', color: '#7a5a2a' },
});
