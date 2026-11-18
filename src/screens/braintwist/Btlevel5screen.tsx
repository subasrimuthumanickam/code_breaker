
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Pressable, Animated, Easing, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Stage, F, Coin } from './BTShared';
import { Icon } from './Art';
import { startLevel5, pickItem, hintLevel5, Level5View, Level5Pick, L5Item } from './Btlevel5api';
import { Apple, Tomato, Tick, Cross } from './Btlevel5art';
import { play } from './BTSound';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

/* garden palette (same as Level 3 / Level 4) */
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

const ITEM_SIZE = 56; // 12, 8 and 9 items per screen

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit: () => void;
  onComplete?: (result: Level5Pick) => void;
  // called when the player taps the coins / video buttons. The parent should ONLY add hints here.
  onWatchVideo?: () => void;
};

const wrongText = (kind: string) => (kind === 'apple' ? 'That is an apple, not a tomato!' : 'That is a tomato, not an apple!');

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

/* =========================================================
   ONE ITEM ON THE BOARD (apple or tomato)
========================================================= */

function Veg({ it, bw, bh, glow, disabled, onPress }: { it: L5Item; bw: number; bh: number; glow: boolean; disabled: boolean; onPress: (it: L5Item) => void }) {
  const w = ITEM_SIZE, h = ITEM_SIZE;
  const px = it.x * bw - w / 2, py = it.y * bh - h / 2;

  const x = useRef(new Animated.Value(px)).current;
  const y = useRef(new Animated.Value(py)).current;
  const sc = useRef(new Animated.Value(it.hidden ? 0 : 1)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  // the server rearranged the board -> slide to the new spot
  useEffect(() => {
    Animated.parallel([
      Animated.timing(x, { toValue: px, duration: 600, useNativeDriver: false }),
      Animated.timing(y, { toValue: py, duration: 600, useNativeDriver: false }),
    ]).start();
  }, [px, py]);

  // picked item shrinks away, and pops back when the board is reset (wrong tomato tap on screen 3)
  useEffect(() => {
    Animated.timing(sc, { toValue: it.hidden ? 0 : 1, duration: it.hidden ? 280 : 350, useNativeDriver: false }).start();
  }, [it.hidden]);

  useEffect(() => {
    if (!glow) { pulse.setValue(0); return; }
    const l = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 420, useNativeDriver: false }),
      Animated.timing(pulse, { toValue: 0, duration: 420, useNativeDriver: false }),
    ]));
    l.start();
    return () => l.stop();
  }, [glow]);

  const Art = it.kind === 'tomato' ? Tomato : Apple;

  return (
    <Animated.View pointerEvents={it.hidden ? 'none' : 'auto'} style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      transform: [{ rotate: it.rot + 'deg' }, { scale: sc }],
    }}>
      <Animated.View pointerEvents="none" style={{
        position: 'absolute', left: -8, right: -8, top: -8, bottom: -8, borderRadius: 20,
        borderWidth: 3, borderColor: '#ffb300', opacity: pulse,
      }} />
      <Pressable disabled={disabled} hitSlop={2} onPress={() => onPress(it)} style={{ width: w, height: h }}>
        <Art w={w} />
      </Pressable>
    </Animated.View>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevel5Screen({ playerId, hints = 0, setHints, onExit, onComplete, onWatchVideo }: Props) {
  const { width, height } = useWindowDimensions();
  const bw = Math.min(width - 48, 380);
  const bh = Math.max(230, Math.min(280, height - 420));

  const [view, setView] = useState<Level5View | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [mark, setMark] = useState<{ x: number; y: number; ok: boolean } | null>(null);
  const [glow, setGlow] = useState<number | null>(null);
  const [result, setResult] = useState<Level5Pick | null>(null); // only used to lock the board once the level is finished
  const [clueOpen, setClueOpen] = useState(false);
  const [clueText, setClueText] = useState('');   // clue text comes from the backend (JSON)
  const [clueLoading, setClueLoading] = useState(false);
  const clueBusy = useRef(false);

  const shake = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const timers = useRef<any[]>([]);
  const msgTimer = useRef<any>(null);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  // hanging sign sways gently (same as Level 3 / 4)
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [sway]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

  // 1. open the level
  const load = useCallback(() => {
    setLoadErr(''); setView(null);
    startLevel5(playerId)
      .then((v) => { setSessionId(v.sessionId as number); setView(v); })
      .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
  }, [playerId]);

  useEffect(() => {
    load();
    return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
  }, [load]);

  // new stage -> close the clue popup and forget the old clue
  useEffect(() => {
    setClueOpen(false);
    setClueText('');
    setGlow(null);
  }, [view?.stage]);

  const flash = (m: string) => {
    setMsg(m); clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 2600);
  };

  const doShake = () => Animated.sequence([10, -10, 6, -6, 0].map((v) =>
    Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

  // 2. the player tapped something -> ask the backend
  const onPick = async (it: L5Item) => {
    if (busy || !sessionId || !view || result) return;
    setBusy(true); setGlow(null);
    play('tap');
    try {
      const res = await pickItem({ sessionId, playerId, itemId: it.id });

      if (!res.correct) {
        play('wrong');
        setMark({ x: it.x * bw, y: it.y * bh, ok: false });
        doShake(); flash(wrongText(it.kind));
        later(() => setMark(null), 700);
        // wrong pick -> (screen 3: whole board resets, tapped apples come back and everything
        // moves to new places) the player starts screen 3 again
        later(() => { setView(res); setBusy(false); }, res.reshuffled ? 650 : 150);
        return;
      }

      // right pick: it hides
      play('correct');
      setView((v) => v && { ...v, items: v.items.map((i) => (i.id === it.id ? { ...i, hidden: true } : i)) });

      if (res.completed) {
        // level finished: no result card, go straight on after the last item has shrunk away
        later(() => {
          setResult(res);
          if (onComplete) onComplete(res); else onExit();
        }, 900);
      } else if (res.stageDone) {
        // go to the next screen
        flash(res.message);
        later(() => { setView(res); setBusy(false); }, 900);
      } else {
        setView(res); setBusy(false);
      }
    } catch (e: any) {
      flash(e.message || 'Network error');
      setBusy(false);
    }
  };

  // 3. magnifier tapped (FREE, no hints / coins):
  //    frontend -> POST /level5/hint -> backend saves it in the database -> JSON { clue } -> popup
  const onHint = async () => {
    if (result || !sessionId || clueBusy.current) return;
    clueBusy.current = true;
    setClueLoading(true);
    play('clue');
    try {
      const r = await hintLevel5({ sessionId, playerId });
      setClueText(r.clue || '');
      if (typeof r.hints === 'number' && setHints) setHints(r.hints);
      setClueOpen(true);
    } catch (e: any) {
      flash(e.message || 'Network error');
    } finally {
      clueBusy.current = false;
      setClueLoading(false);
    }
  };

  const watchVideo = () => { play('btn'); onWatchVideo && onWatchVideo(); };

  /* ---------- header (same as Level 4) ---------- */
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
          <Text style={st.signT}>LEVEL 5</Text>
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
                <Text style={st.load}>Loading level 5...</Text>
              </>
            )}
          </View>
        </View>
      </Stage>
    );
  }

  return (
    <Stage bg={SKY}>
      <View style={st.root}>
        <Garden />
        {header}

        <View style={st.center}>
          <View style={st.qPill}>
            <Text style={st.qArrow}>{'<'}</Text>
            <Text style={[st.q, msg ? { color: '#c0392b' } : null]}>{msg || view.title}</Text>
            <Text style={st.qArrow}>{'>'}</Text>
          </View>

          <Animated.View style={{ width: bw, height: bh, marginTop: 10, transform: [{ translateX: shake }] }}>
            {view.items.map((it) => (
              <Veg key={view.stage + '-' + it.id} it={it} bw={bw} bh={bh} glow={glow === it.id}
                disabled={busy || !!result} onPress={onPick} />
            ))}
            {mark && (
              <View pointerEvents="none" style={{ position: 'absolute', left: mark.x - 23, top: mark.y - 23, zIndex: 20 }}>
                {mark.ok ? <Tick /> : <Cross />}
              </View>
            )}
          </Animated.View>
        </View>

        {/* bottom wooden panel (same as Level 3 / 4) */}
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
              style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }, clueLoading && { opacity: 0.7 }]}
              activeOpacity={0.85} onPress={onHint}
            >
              <Icon n="search" s={31} />
            </TouchableOpacity>
            <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={watchVideo}>
              <Icon n="film" s={36} />
            </TouchableOpacity>
            <View style={st.badge}><Coin s={12} /><Text style={st.badgeT}>+75</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={watchVideo}>
              <DoubleArrow s={33} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={15} /><Text style={st.badgeT}>50</Text></View>
          </View>
        </View>

        {/* HINTS popup */}
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
  pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
  pill: { height: 32, borderRadius: 16, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 18, paddingRight: 30, elevation: 3 },
  pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
  pillIcon: { position: 'absolute', right: -6, top: -4 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 135 },
  centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, maxWidth: 380, elevation: 3 },
  qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
  q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

  // bottom wooden panel (solid wood, plank lines, corner rivets)
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
