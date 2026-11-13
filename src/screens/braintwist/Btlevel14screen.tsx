
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Pressable, Animated, Easing, PanResponder, StyleSheet, Platform,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Icon } from './Art';
import { F, Stage, Coin, loop } from './BTShared';
import { Giraffe, Fridge, FRIDGE_W, FRIDGE_H } from './Btlevel14art';
import { startLevel14, sendAction14, hint14, skip14, reward14, Action } from './Btlevel14api';
import { play } from './BTSound';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

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

// positions inside the 320 x 300 play area
const GX = 14, GY = 76, GW = 100, GH = 150;       // giraffe
const FX = 170, FY = 40;                          // fridge (size from art file)

type Props = { playerId: number; hints: number; setHints: (n: number) => void; onExit: () => void; onComplete: (r: any) => void };

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
          <LinearGradient id="g14sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g14sky)" />
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

export default function BTLevel14Screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
  const [sid, setSid] = useState<number | null>(null), [open, setOpen] = useState(false), [giraffeIn, setGiraffeIn] = useState(false),
    [note, setNote] = useState(''), [done, setDone] = useState(false),
    [clue, setClue] = useState(''), [showClues, setShowClues] = useState(false);
  const door = useRef(new Animated.Value(0)).current, pan = useRef(new Animated.ValueXY()).current;
  const sway = useRef(new Animated.Value(0)).current, qIn = useRef(new Animated.Value(0)).current, shake = useRef(new Animated.Value(0)).current;
  const busy = useRef(false), sidR = useRef<number | null>(null), doneR = useRef(false), putR = useRef<any>(null);
  sidR.current = sid; doneR.current = done;

  const flash = (m: string) => { setNote(m); setTimeout(() => setNote(''), 1800); };
  const doShake = () => Animated.sequence([10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();
  const back = () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();

  const startedR = useRef(false);
  // opens a fresh game on the backend (only abandons the old one when we really need a new one)
  const begin = async () => {
    try {
      const r = await startLevel14(playerId);
      if (r.success) { sidR.current = r.sessionId; setSid(r.sessionId); setOpen(false); setGiraffeIn(false); setClue(''); return r.sessionId; }
      flash(r.message || 'Cannot start level');
    } catch (e) { flash('Cannot reach server'); }
    return null;
  };

  useEffect(() => {
    if (!startedR.current) { startedR.current = true; begin(); }   // React runs effects twice in dev: start only once
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    Animated.spring(qIn, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
    return () => a.stop();
  }, []);

  useEffect(() => { Animated.timing(door, { toValue: open ? 1 : 0, duration: 420, useNativeDriver: true }).start(); }, [open]);

  const finish = (r: any) => { play('correct'); setDone(true); flash(r.message || 'Done!'); setTimeout(() => onComplete(r), 1100); };

  // every move goes to the backend -> MySQL, the backend answers in JSON
  const act = async (a: Action) => {
    if (!sidR.current) return null;
    try {
      const r = await sendAction14(sidR.current, playerId, a);
      if (r.status === 409 && !doneR.current) { await begin(); flash('Game restarted. Try again!'); return null; }
      if (!r.success) { flash(r.message || 'Error'); return null; }
      return r;
    } catch (e) { flash('Network error'); return null; }
  };

  const tapFridge = async () => {
    if (busy.current || doneR.current) return; busy.current = true;
    play('tap');
    try {
      const r = await act(open ? 'close_fridge' : 'open_fridge'); if (!r) return;
      setOpen(r.state.open); setGiraffeIn(r.state.giraffeIn);
      if (r.completed) finish(r);
    } finally { busy.current = false; }
  };

  const putIn = async () => {
    if (busy.current || doneR.current) { back(); return; } busy.current = true;
    try {
      const r = await act('giraffe_in');
      if (!r) { back(); return; }
      if (!r.correct) { play('wrong'); flash(r.message || 'Not yet!'); doShake(); back(); return; }
      play('tap');
      setGiraffeIn(true); setOpen(r.state.open); pan.setValue({ x: 0, y: 0 });
    } finally { busy.current = false; }
  };
  putR.current = putIn;

  // drag the giraffe onto the fridge, or just tap it
  const pr = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !doneR.current,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      const moved = Math.hypot(g.dx, g.dy), cx = GX + GW / 2 + g.dx, cy = GY + GH / 2 + g.dy;
      const hit = cx > FX && cx < FX + FRIDGE_W && cy > FY && cy < FY + FRIDGE_H;
      if (moved < 8 || hit) putR.current && putR.current(); else back();
    },
  })).current;

  // clue is free: tap the search icon and it shows directly
  const hint = async () => {
    play('clue');
    if (clue) { setShowClues(true); return; }
    if (!sid) return;
    try {
      const r = await hint14(sid, playerId);
      if (r.success) { setHints(r.hints); setClue(r.text); setShowClues(true); }
      else flash(r.message || 'Error');
    } catch (e) { flash('Network error'); }
  };
  const reward = async () => { play('btn'); try { const r = await reward14(playerId); if (r.success) setHints(r.hints); } catch (e) { } };
  const skip = async () => {
    if (!sid) return;
    play('btn');
    try {
      const r = await skip14(sid, playerId);
      if (r.status === 402) { play('wrong'); flash('Not enough hints'); return; }
      if (r.success) { setHints(r.hints); onComplete(r); }
    } catch (e) { flash('Network error'); }
  };

  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] }),
    qY = qIn.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

  /* ---------- header ---------- */
  const header = (
    <View style={bd.topBar}>
      <View style={bd.leftBtns}>
        <TouchableOpacity style={bd.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
          <Icon n="home" s={20} />
        </TouchableOpacity>
        <TouchableOpacity style={bd.woodBtn} activeOpacity={0.85}>
          <Icon n="gear" s={21} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[bd.signWrap, { transform: [{ rotate: swayR }] }]}>
        <Chain h={30} style={{ left: 24, top: -6 }} />
        <Chain h={30} style={{ right: 24, top: -6 }} />
        <View style={bd.sign}>
          <Text style={bd.signArrow}>{'<'}</Text>
          <Text style={bd.signT}>LEVEL 14</Text>
          <Text style={bd.signArrow}>{'>'}</Text>
        </View>
      </Animated.View>

      {/* hint counter: small fixed-size pill, number only */}
      <View style={bd.pillWrap}>
        <View style={bd.pill}>
          <Text style={bd.pillT} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{hints}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Stage bg={SKY}>
      <View style={bd.root}>
        <Garden />
        {header}

        {/* question pill */}
        <Animated.View style={[bd.qWrap, { opacity: qIn, transform: [{ translateY: qY }] }]}>
          <View style={bd.qPill}>
            <Text style={bd.qArrow}>{'<'}</Text>
            <Text style={bd.q}>Put the giraffe into the fridge.</Text>
            <Text style={bd.qArrow}>{'>'}</Text>
          </View>
        </Animated.View>

        {/* play area */}
        <Animated.View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 135, transform: [{ translateX: shake }] }}>
          <View style={{ width: 320, height: 300 }}>
            <Pressable onPress={tapFridge} style={{ position: 'absolute', left: FX, top: FY, width: FRIDGE_W, height: FRIDGE_H }}>
              <Fridge door={door}>
                {giraffeIn && <View style={{ position: 'absolute', left: (FRIDGE_W - 80) / 2, top: FRIDGE_H - 120 - 12 }}><Giraffe w={80} /></View>}
              </Fridge>
            </Pressable>
            {!giraffeIn && (
              <Animated.View {...pr.panHandlers} style={{ position: 'absolute', left: GX, top: GY, zIndex: 5, transform: pan.getTranslateTransform() }}>
                <Giraffe w={GW} />
              </Animated.View>
            )}
          </View>
        </Animated.View>

        {!!note && <View style={bd.noteWrap} pointerEvents="none"><Text style={bd.note}>{note}</Text></View>}

        {/* bottom wooden panel (smaller, same as Level 13) */}
        <View style={bd.panel}>
          <View style={[bd.plank, { top: 14, left: 28, right: 28 }]} />
          <View style={[bd.plank, { top: 56, left: 22, right: 22 }]} />
          <View style={[bd.plank, { bottom: 12, left: 28, right: 28 }]} />
          <View style={[bd.screw, { left: 12, top: 12 }]} />
          <View style={[bd.screw, { right: 12, top: 12 }]} />
          <View style={[bd.screw, { left: 12, bottom: 12 }]} />
          <View style={[bd.screw, { right: 12, bottom: 12 }]} />

          <View style={bd.btnCol}>
            <TouchableOpacity style={[bd.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={hint}>
              <Icon n="search" s={28} />
            </TouchableOpacity>
            <View style={bd.badge}><Text style={bd.badgeT}>FREE</Text></View>
          </View>

          <View style={bd.btnCol}>
            <TouchableOpacity style={[bd.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={reward}>
              <Icon n="film" s={32} />
            </TouchableOpacity>
            <View style={bd.badge}><Coin s={12} /><Text style={bd.badgeT}>+75</Text></View>
          </View>

          <View style={bd.btnCol}>
            <TouchableOpacity style={[bd.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={skip}>
              <DoubleArrow s={30} />
            </TouchableOpacity>
            <View style={bd.badge}><Icon n="bulb" s={15} /><Text style={bd.badgeT}>50</Text></View>
          </View>
        </View>

        {/* CLUES popup */}
        {showClues && (
          <View style={bd.overlay}>
            <View style={bd.clueCard}>
              <TouchableOpacity style={bd.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setShowClues(false); }}>
                <Icon n="cross" s={20} />
              </TouchableOpacity>
              <Text style={bd.clueTitle}>HINTS</Text>

              <View style={[bd.clueRow, bd.clueRowOpen]}>
                <View style={bd.clueNum}><Text style={bd.clueNumT}>1</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={bd.clueHead}>Hint 1</Text>
                  <Text style={bd.clueBody}>{clue}</Text>
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

const bd = StyleSheet.create({
  root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 14 },
  leftBtns: { flexDirection: 'row', gap: 8 },
  woodBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: YEL_BTN, borderWidth: 2.5, borderColor: YEL_BTN_D, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
  sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 6, backgroundColor: '#bd6b29', borderWidth: 3, borderColor: WOOD_DD, elevation: 3 },
  signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },

  // hint counter (compact, lower height)
  pillWrap: { position: 'relative', minWidth: 88, height: 36, justifyContent: 'center' },
  pill: { height: 28, borderRadius: 14, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 14, paddingRight: 26, elevation: 3 },
  pillT: { fontFamily: FONT, fontSize: 18, fontWeight: '900', color: '#1b1b1b' },
  pillIcon: { position: 'absolute', right: -5, top: -3 },

  qWrap: { alignItems: 'center', marginTop: 12, paddingHorizontal: 12 },
  qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, maxWidth: 380, elevation: 3 },
  qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
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