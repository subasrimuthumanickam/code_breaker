
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, Animated, PanResponder, StyleSheet, Platform,
//   ActivityIndicator, useWindowDimensions,
// } from 'react-native';
// import {
//   startLevel3, answerLevel3, hintLevel3, skipLevel3, rewardLevel3,
//   Level3Start, Level3Answer, Sym,
// } from './Btlevel3api';
// import { SpotScene, MagnifierIcon, VideoIcon, SkipIcon, CoinIcon } from './Btlevel3art';
// import { HomeIcon, GearIcon, BulbIcon, StarIcon } from './Btlevel2art';

// const FONT: any = Platform.select({ ios: 'Chalkboard SE', android: 'sans-serif-condensed', default: 'sans-serif' });
// const BOARD = '#1d6a49', FRAME = '#e08a2e', PAGE = '#f4e4c6', LIME = '#a6e22e', CREAM = '#f7f1df', YELLOW = '#ffd33d';
// const COST_HINT = 25, COST_SKIP = 50, REWARD = 75;

// const LABEL: Record<Sym, string> = { '+': '+', '-': '−' };
// type Slots = (Sym | null)[];

// type Props = {
//   playerId: number;
//   onHints?: (h: number) => void;
//   onExit: () => void;
//   onComplete?: (result: Level3Answer) => void;
// };

// /* ---------------------------------------------------------
//    wooden chalk tray (local copy, Level 3 does not depend on Level 2 art)
// --------------------------------------------------------- */

// function ChalkTray() {
//   return (
//     <View style={st.tray}>
//       <View style={st.ledge} />
//       <View style={st.eraser}>
//         <View style={st.eraserTop} />
//         <View style={st.eraserBottom}><View style={st.eraserLine} /><View style={st.eraserLine} /></View>
//       </View>
//       <View style={[st.chalk, { left: '33%', bottom: 12, width: 46 }]} />
//       <View style={[st.chalk, { left: '50%', bottom: 14, width: 40, transform: [{ rotate: '-12deg' }] }]} />
//     </View>
//   );
// }

// /* ---------------------------------------------------------
//    one draggable symbol (+ or −)
// --------------------------------------------------------- */

// function DragSymbol({ ch, size, disabled, onDrop }: {
//   ch: Sym; size: number; disabled: boolean;
//   onDrop: (ch: Sym, x: number, y: number) => Promise<boolean>;
// }) {
//   const pan = useRef(new Animated.ValueXY()).current;
//   const dropRef = useRef(onDrop);
//   const disRef = useRef(disabled);
//   dropRef.current = onDrop;
//   disRef.current = disabled;
//   const [drag, setDrag] = useState(false);

//   const back = () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();

//   const pr = useRef(PanResponder.create({
//     onStartShouldSetPanResponder: () => !disRef.current,
//     onPanResponderGrant: () => setDrag(true),
//     onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
//     onPanResponderRelease: async (_, g) => {
//       setDrag(false);
//       const ok = await dropRef.current(ch, g.moveX, g.moveY);
//       if (ok) pan.setValue({ x: 0, y: 0 }); else back();
//     },
//     onPanResponderTerminate: () => { setDrag(false); back(); },
//   })).current;

//   return (
//     <Animated.View
//       {...pr.panHandlers}
//       style={{
//         width: size, height: size, alignItems: 'center', justifyContent: 'center',
//         zIndex: drag ? 50 : 1, elevation: drag ? 20 : 0,
//         transform: pan.getTranslateTransform(),
//       }}
//     >
//       <Text style={[st.sym, { fontSize: size * 0.95, lineHeight: size * 1.05 }, drag && { color: LIME }]}>{LABEL[ch]}</Text>
//     </Animated.View>
//   );
// }

// const measure = (ref: React.RefObject<any>) =>
//   new Promise<{ x: number; y: number; w: number; h: number } | null>((resolve) => {
//     const node: any = ref.current;
//     if (!node || !node.measureInWindow) return resolve(null);
//     node.measureInWindow((x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }));
//   });

// /* ---------------------------------------------------------
//    SCREEN
// --------------------------------------------------------- */

// export default function BTLevel3Screen({ playerId, onHints, onExit, onComplete }: Props) {
//   const { width } = useWindowDimensions();
//   const bw = Math.min(width, 480);
//   const pw = Math.min(150, Math.floor((bw - 16 - 18 - 36) / 2));
//   const u = Math.max(40, Math.min(60, Math.floor((bw - 34 - 16) / 6.6)));
//   const gap = Math.round(u * 0.8);

//   const [data, setData] = useState<Level3Start | null>(null);
//   const [loadErr, setLoadErr] = useState('');
//   const [hints, setHints] = useState(0);
//   const [slots, setSlots] = useState<Slots>([null, null]);
//   const [fixed, setFixed] = useState<Slots>([null, null]);
//   const [msg, setMsg] = useState('');
//   const [busy, setBusy] = useState(false);
//   const [result, setResult] = useState<Level3Answer | null>(null);

//   const slotsRef = useRef<Slots>([null, null]);
//   const fixedRef = useRef<Slots>([null, null]);
//   slotsRef.current = slots;
//   fixedRef.current = fixed;

//   const slotRef0 = useRef<View>(null);
//   const slotRef1 = useRef<View>(null);
//   const slotRefs = [slotRef0, slotRef1];

//   const shake = useRef(new Animated.Value(0)).current;
//   const pop = useRef(new Animated.Value(0)).current;
//   const msgTimer = useRef<any>(null);
//   const timers = useRef<any[]>([]);

//   const readRevealed = (list: { slot: number; symbol: Sym }[] | undefined): Slots => {
//     const f: Slots = [null, null];
//     (list || []).forEach((r) => { if (r.slot === 0 || r.slot === 1) f[r.slot] = r.symbol; });
//     return f;
//   };

//   const load = useCallback(() => {
//     setLoadErr('');
//     setData(null);
//     startLevel3(playerId)
//       .then((d) => {
//         const f = readRevealed(d.revealed);
//         setData(d);
//         setHints(d.hints);
//         setFixed(f);
//         setSlots(f);
//       })
//       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
//   }, [playerId]);

//   useEffect(() => {
//     load();
//     return () => {
//       timers.current.forEach(clearTimeout);
//       clearTimeout(msgTimer.current);
//     };
//   }, [load]);

//   useEffect(() => {
//     if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
//   }, [result]);

//   useEffect(() => {
//     if (data) onHints?.(hints);
//   }, [hints, data]);

//   const showMsg = (m: string) => {
//     setMsg(m);
//     clearTimeout(msgTimer.current);
//     msgTimer.current = setTimeout(() => setMsg(''), 2600);
//   };

//   const shakeRow = () => {
//     Animated.sequence([
//       Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
//       Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
//       Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
//       Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
//     ]).start();
//   };

//   const submit = async (arr: Slots) => {
//     if (!data) return;
//     setBusy(true);
//     try {
//       const res = await answerLevel3({ sessionId: data.sessionId, playerId, symbols: arr as Sym[] });
//       if (!res.correct) {
//         showMsg(res.message || 'Not quite. Try again!');
//         shakeRow();
//         timers.current.push(setTimeout(() => {
//           setSlots(fixedRef.current);
//           slotsRef.current = fixedRef.current;
//           setBusy(false);
//         }, 700));
//         return;
//       }
//       if (typeof res.hints === 'number') setHints(res.hints);
//       timers.current.push(setTimeout(() => setResult(res), 700));
//     } catch (e: any) {
//       showMsg(e.message || 'Network error');
//       setSlots(fixedRef.current);
//       setBusy(false);
//     }
//   };

//   const handleDrop = async (ch: Sym, px: number, py: number): Promise<boolean> => {
//     if (busy || !data || result) return false;

//     const rects = await Promise.all(slotRefs.map(measure));
//     let best = -1;
//     let bestD = Infinity;
//     rects.forEach((r, i) => {
//       if (!r) return;
//       const d = Math.hypot(px - (r.x + r.w / 2), py - (r.y + r.h / 2));
//       if (d < bestD) { bestD = d; best = i; }
//     });

//     if (best < 0 || bestD > u * 1.1) return false;
//     if (fixedRef.current[best]) return false;

//     const next: Slots = [...slotsRef.current];
//     next[best] = ch;
//     setSlots(next);
//     slotsRef.current = next;

//     if (next.every(Boolean)) submit(next);
//     return true;
//   };

//   const removeSlot = (i: number) => {
//     if (busy || result || fixedRef.current[i]) return;
//     setSlots((s) => { const n = [...s]; n[i] = null; return n; });
//   };

//   const useHint = async () => {
//     if (busy || !data || result) return;
//     setBusy(true);
//     let full: Slots | null = null;
//     try {
//       const res = await hintLevel3({ sessionId: data.sessionId, playerId });
//       setHints(res.hints);
//       setFixed(readRevealed(res.revealed));

//       if (res.hint.place) {
//         const { slot, symbol } = res.hint.place;
//         const next: Slots = [...slotsRef.current];
//         next.forEach((s, i) => { if (s === symbol && i !== slot) next[i] = null; });
//         next[slot] = symbol;
//         setSlots(next);
//         slotsRef.current = next;
//         if (next.every(Boolean)) full = next;
//       } else if (res.hint.text) {
//         showMsg(res.hint.text);
//       }
//     } catch (e: any) {
//       showMsg(e.message || 'Hint failed');
//     }
//     setBusy(false);
//     if (full) submit(full);
//   };

//   const watchVideo = async () => {
//     if (busy || result) return;
//     setBusy(true);
//     try {
//       const res = await rewardLevel3(playerId);
//       setHints(res.hints);
//       showMsg(`+${res.added} hints!`);
//     } catch (e: any) {
//       showMsg(e.message || 'Reward failed');
//     }
//     setBusy(false);
//   };

//   const skip = async () => {
//     if (busy || !data || result) return;
//     setBusy(true);
//     try {
//       const res = await skipLevel3({ sessionId: data.sessionId, playerId });
//       if (typeof res.hints === 'number') setHints(res.hints);
//       setResult(res);
//     } catch (e: any) {
//       showMsg(e.message || 'Skip failed');
//       setBusy(false);
//     }
//   };

//   /* ---------- loading / error ---------- */

//   if (loadErr || !data) {
//     return (
//       <View style={st.page}>
//         <View style={[st.frame, { width: bw - 16 }]}>
//           <View style={[st.board, { alignItems: 'center', justifyContent: 'center' }]}>
//             {loadErr ? (
//               <>
//                 <Text style={st.errText}>{loadErr}</Text>
//                 <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
//                 <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
//               </>
//             ) : (
//               <>
//                 <ActivityIndicator color="#fff" size="large" />
//                 <Text style={st.loading}>Loading level 3...</Text>
//               </>
//             )}
//           </View>
//         </View>
//       </View>
//     );
//   }

//   const [n1, n2, n3] = data.numbers;
//   const numStyle = [st.num, { fontSize: u * 0.95, lineHeight: u * 1.05 }];

//   const home = (ch: Sym) =>
//     slots.includes(ch)
//       ? <View style={[st.homeEmpty, { width: u, height: u, borderRadius: u / 2 }]} />
//       : <DragSymbol ch={ch} size={u} disabled={busy || !!result} onDrop={handleDrop} />;

//   const gapView = (i: number) => (
//     <View ref={slotRefs[i]} collapsable={false} style={{ width: gap, height: u, alignItems: 'center', justifyContent: 'center' }}>
//       {slots[i] ? (
//         <TouchableOpacity activeOpacity={0.8} disabled={!!fixed[i] || busy || !!result} onPress={() => removeSlot(i)}>
//           <Text style={[st.sym, { fontSize: u * 0.95, lineHeight: u * 1.05 }]}>{LABEL[slots[i] as Sym]}</Text>
//         </TouchableOpacity>
//       ) : (
//         <View style={[st.slotRing, { width: gap * 0.7, height: gap * 0.7, borderRadius: gap }]} />
//       )}
//     </View>
//   );

//   return (
//     <View style={st.page}>
//       <View style={[st.frame, { width: bw - 16 }]}>
//         <View style={st.board}>

//           <View style={st.header}>
//             <View style={st.headLeft}>
//               <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon /></TouchableOpacity>
//               <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon /></TouchableOpacity>
//             </View>
//             <Text style={st.levelT}>LEVEL 3</Text>
//             <View style={st.pillWrap}>
//               <View style={st.pill}><Text style={st.pillT}>{hints}</Text></View>
//               <View style={st.bulb}><BulbIcon size={28} /></View>
//             </View>
//           </View>

//           <Text style={[st.question, msg ? { color: YELLOW } : null]}>
//             {msg || data.question}
//           </Text>

//           <View style={st.pictures}>
//             <SpotScene side="a" width={pw} />
//             <SpotScene side="b" width={pw} />
//           </View>

//           <Animated.View style={[st.mathRow, { transform: [{ translateX: shake }] }]}>
//             {home('+')}
//             <Text style={numStyle}>{n1}</Text>
//             {gapView(0)}
//             <Text style={numStyle}>{n2}</Text>
//             {gapView(1)}
//             <Text style={numStyle}>{n3}</Text>
//             {home('-')}
//           </Animated.View>

//           <View style={{ flex: 1 }} />

//           <View style={st.actions}>
//             <View style={st.actCol}>
//               <TouchableOpacity style={[st.act, { backgroundColor: LIME }]} onPress={useHint} activeOpacity={0.85}>
//                 <MagnifierIcon size={38} />
//               </TouchableOpacity>
//               <View style={st.costRow}><BulbIcon size={16} /><Text style={st.costT}>{COST_HINT}</Text></View>
//             </View>
//             <View style={st.actCol}>
//               <TouchableOpacity style={[st.act, { backgroundColor: CREAM }]} onPress={watchVideo} activeOpacity={0.85}>
//                 <VideoIcon size={40} />
//               </TouchableOpacity>
//               <View style={st.costRow}><CoinIcon size={16} /><Text style={st.costT}>+{REWARD}</Text></View>
//             </View>
//             <View style={st.actCol}>
//               <TouchableOpacity style={[st.act, { backgroundColor: '#ee4a55' }]} onPress={skip} activeOpacity={0.85}>
//                 <SkipIcon size={40} />
//               </TouchableOpacity>
//               <View style={st.costRow}><BulbIcon size={16} /><Text style={st.costT}>{COST_SKIP}</Text></View>
//             </View>
//           </View>

//           <ChalkTray />

//           {!!result && (
//             <View style={st.overlay}>
//               <Animated.View style={[st.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
//                 <Text style={st.cardTitle}>Level complete!</Text>
//                 <Text style={st.cardMsg}>{result.message}</Text>
//                 <View style={st.stars}>{[1, 2, 3].map((k) => <StarIcon key={k} size={46} on={k <= (result.stars || 0)} />)}</View>
//                 {!result.skipped && <Text style={st.cardScore}>Score {result.score}</Text>}
//                 <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}>
//                   <Text style={st.nextT}>NEXT</Text>
//                 </TouchableOpacity>
//               </Animated.View>
//             </View>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// /* =========================================================
//    STYLES
// ========================================================= */

// const st = StyleSheet.create({
//   page: { flex: 1, backgroundColor: PAGE, alignItems: 'center' },
//   frame: {
//     flex: 1, marginVertical: 8, backgroundColor: FRAME, borderRadius: 22, padding: 9,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
//   },
//   board: { flex: 1, backgroundColor: BOARD, borderRadius: 14, overflow: 'hidden', paddingTop: 14 },

//   tray: { height: 44, width: '100%' },
//   ledge: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 20, backgroundColor: '#e08a2e', borderTopWidth: 3, borderTopColor: '#f2a64a' },
//   eraser: { position: 'absolute', left: '8%', bottom: 12, width: 62, height: 30 },
//   eraserTop: { height: 14, backgroundColor: '#b0702a', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
//   eraserBottom: { height: 16, backgroundColor: '#222', borderBottomLeftRadius: 3, borderBottomRightRadius: 3, justifyContent: 'space-evenly', paddingHorizontal: 3 },
//   eraserLine: { height: 2, backgroundColor: '#555' },
//   chalk: { position: 'absolute', height: 8, borderRadius: 4, backgroundColor: '#f6f3ea' },

//   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
//   headLeft: { flexDirection: 'row', gap: 8, minWidth: 110 },
//   round: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffd83a', borderWidth: 2.5, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
//   levelT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: 1 },
//   pillWrap: { minWidth: 110, height: 44, justifyContent: 'center' },
//   pill: { height: 36, borderRadius: 18, backgroundColor: '#fff', justifyContent: 'center', paddingLeft: 18, paddingRight: 30 },
//   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
//   bulb: { position: 'absolute', right: -4, top: -2 },

//   question: {
//     fontFamily: FONT, fontSize: 21, lineHeight: 27, fontStyle: 'italic', fontWeight: '600',
//     color: '#f1f6ef', textAlign: 'center', paddingHorizontal: 22, marginTop: 16, minHeight: 56,
//   },
//   pictures: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 8 },

//   mathRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, zIndex: 10, elevation: 10 },
//   num: { fontFamily: FONT, fontWeight: '900', color: CREAM, textAlign: 'center', minWidth: 40 },
//   sym: { fontFamily: FONT, fontWeight: '900', color: YELLOW, textAlign: 'center', includeFontPadding: false },
//   homeEmpty: { borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.25)' },
//   slotRing: { borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.45)' },

//   actions: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-start', paddingHorizontal: 8, marginBottom: 6 },
//   actCol: { alignItems: 'center' },
//   act: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
//   costRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
//   costT: { fontFamily: FONT, fontSize: 16, fontWeight: '700', color: '#fff' },

//   overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
//   card: { width: '82%', alignItems: 'center', backgroundColor: '#175a3d', borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.8)', borderRadius: 22, padding: 20 },
//   cardTitle: { fontFamily: FONT, fontSize: 30, fontWeight: '800', color: '#fff' },
//   cardMsg: { fontFamily: FONT, fontSize: 18, color: '#d8f3e3', textAlign: 'center', marginTop: 6 },
//   stars: { flexDirection: 'row', gap: 6, marginTop: 14 },
//   cardScore: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: YELLOW, marginTop: 10 },
//   next: { marginTop: 18, minWidth: 170, height: 58, borderRadius: 29, backgroundColor: LIME, borderWidth: 3, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
//   nextT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#1b1b1b' },

//   loading: { fontFamily: FONT, fontSize: 18, color: '#fff', marginTop: 12 },
//   errText: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
//   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
//   retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
//   back: { fontFamily: FONT, fontSize: 16, color: '#d8f3e3', marginTop: 14, textDecorationLine: 'underline' },
// });
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, Animated, PanResponder, Pressable, StyleSheet, Platform, Easing,
  ActivityIndicator, TouchableOpacity, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { startLevel3, answerLevel3, rewardLevel3, Level3Start, Level3Answer, Sym } from './Btlevel3api';
import { SpotScene } from './Btlevel3art';
import { StarIcon } from './Btlevel2art';
import { F, INK, Coin } from './BTShared';
import { Icon } from './Art';
import BTSkipRiddle from './BTSkipRiddle';

/**
 * Level 3 - spot the differences, put + and − between 1 2 3.
 * Layout copied from Level 1 (942 x 1669 design grid, same room, same clue popup, same skip riddle).
 * No pencil / eraser on this screen.
 * Size comes from useWindowDimensions (works with or without a Stage wrapper).
 */

const NAVY = '#132f70', CREAM = '#faf0e2', K = '#1d1d1d', ORANGE = '#f5a623', GREEN = '#3ec75a';
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });
const DW = 942, DH = 1669;
const WALL = '#abd1f1', FLOOR = '#f0bb75', BASE = '#f1bebf';
const COST_CLUE = 25, COST_SKIP = 50, REWARD = 75; // only shown on the pills

const CLUES = [
  'Look at the numbers carefully. Can you find the correct mathematical symbols to make them work together?',
  'Sometimes, the smallest changes can make the biggest difference. Look closely at what’s missing between the numbers!',
];

const LABEL: Record<Sym, string> = { '+': '+', '-': '−' };
type Slots = (Sym | null)[];

type Props = {
  playerId: number;
  onHints?: (h: number) => void;
  onExit: () => void;
  onComplete?: (result: Level3Answer) => void;
};

const LockArt = ({ s }: any) => (
  <Svg width={s} height={s} viewBox="0 0 100 100">
    <Path d="M30 46 V34 a20 20 0 0 1 40 0 V46" fill="none" stroke="#7a6a55" strokeWidth="9" strokeLinecap="round" />
    <Rect x="20" y="44" width="60" height="44" rx="10" fill="#9b8a72" />
    <Circle cx="50" cy="63" r="6" fill="#f4e8d2" />
    <Rect x="47" y="63" width="6" height="15" rx="3" fill="#f4e8d2" />
  </Svg>
);

/* ---------- the room (same scene as Level 1) ---------- */
function Room({ w, h }: any) {
  return (
    <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <Defs><LinearGradient id="l3wall" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#abd1f1" /><Stop offset="1" stopColor="#b1d3ef" /></LinearGradient></Defs>
      <Rect width={DW} height={DH} fill="url(#l3wall)" />
      <Polygon points="250,0 430,0 150,1170 0,1170" fill="#fff" opacity="0.10" />
      <Polygon points="520,0 640,0 420,1170 330,1170" fill="#fff" opacity="0.07" />
      <Rect x="0" y="1165" width={DW} height="34" fill={BASE} />
      <Rect x="0" y="1199" width={DW} height={DH - 1199} fill={FLOOR} />
      {[0, 1, 2, 3, 4, 5].map(i => <Rect key={i} x={i * 170 - 20} y="1199" width="3" height={DH - 1199} fill="#e6a85f" opacity="0.5" />)}

      <Rect x="0" y="128" width="205" height="512" fill="#e8a55a" />
      <Rect x="0" y="140" width="190" height="488" fill="#97d9f9" />
      <Rect x="0" y="372" width="205" height="14" fill="#e8a55a" />
      <G fill="#fff"><Ellipse cx="165" cy="215" rx="28" ry="20" /><Ellipse cx="140" cy="230" rx="26" ry="16" /><Ellipse cx="10" cy="345" rx="22" ry="16" /></G>
      <Rect x="0" y="610" width="245" height="38" fill="#f0be76" />
      <Rect x="0" y="640" width="245" height="8" fill="#d99a4e" opacity="0.5" />
      <Ellipse cx="85" cy="520" rx="46" ry="92" fill="#6cbf3d" />
      <Ellipse cx="150" cy="500" rx="38" ry="84" fill="#7fcf4b" transform="rotate(14 150 500)" />
      <Ellipse cx="45" cy="540" rx="34" ry="64" fill="#5fae38" transform="rotate(-14 45 540)" />
      <Rect x="68" y="548" width="106" height="68" rx="16" fill="#f4eadc" />
      <Circle cx="102" cy="578" r="5" fill="#6b4423" /><Circle cx="140" cy="578" r="5" fill="#6b4423" />

      <Rect x="708" y="182" width="162" height="181" fill="#c8e4f3" stroke="#a9d1ea" strokeWidth="5" />
      <Circle cx="790" cy="267" r="56" fill="#f9cf6a" opacity="0.7" />
      <Circle cx="790" cy="267" r="42" fill="#f5a63e" />

      <Rect x="775" y="632" width="167" height="533" fill="#e9ab5e" />
      <Rect x="790" y="646" width="152" height="505" fill="#dc9d4f" />
      <Rect x="775" y="800" width="167" height="12" fill="#f0bb75" />
      <Rect x="775" y="980" width="167" height="12" fill="#f0bb75" />
      <Rect x="805" y="690" width="30" height="110" fill="#38aeea" />
      <Rect x="835" y="672" width="26" height="128" fill="#f8d04c" />
      <Rect x="862" y="692" width="30" height="108" fill="#8a63da" />
      <Rect x="805" y="872" width="30" height="106" fill="#5b86d6" />
      <Rect x="835" y="858" width="26" height="120" fill="#4db8b4" />
      <Circle cx="826" cy="1030" r="20" fill="#c98a4b" /><Circle cx="884" cy="1030" r="20" fill="#c98a4b" /><Circle cx="855" cy="1070" r="42" fill="#c98a4b" />
      <Rect x="838" y="522" width="26" height="110" rx="13" fill="#6cbf3d" transform="rotate(-6 851 580)" />
      <Rect x="872" y="568" width="30" height="80" rx="15" fill="#5fae38" transform="rotate(26 887 608)" />

      <Rect x="0" y="1095" width="195" height="37" fill="#39abea" />
      <Rect x="0" y="1132" width="205" height="42" fill="#ef69b0" />
      <Rect x="0" y="1175" width="208" height="38" fill="#f9d04c" />
      <Rect x="150" y="1185" width="50" height="14" fill="#fff" opacity="0.85" />
      <Rect x="0" y="1213" width="215" height="30" fill="#3aaeed" />
      <Rect x="18" y="1200" width="136" height="58" rx="18" fill="#39aeec" />
      <Rect x="58" y="1186" width="58" height="32" rx="12" fill="#7cc8f4" />
      <Circle cx="40" cy="1272" r="16" fill="#27408b" /><Circle cx="122" cy="1272" r="16" fill="#27408b" />

      <Rect x="868" y="1030" width="22" height="130" fill="#6cbf3d" transform="rotate(-8 879 1100)" />
      <Rect x="880" y="1030" width="22" height="130" fill="#ef5a67" transform="rotate(10 891 1100)" />
      <Rect x="902" y="1028" width="20" height="130" fill="#3a8fd8" transform="rotate(22 912 1100)" />
      <Rect x="822" y="1140" width="108" height="146" rx="12" fill="#f9cd3a" />
      <Rect x="822" y="1140" width="108" height="14" fill="#f2bb21" />

      <Rect x="81" y="1248" width="805" height="346" rx="173" fill="#f4e8d2" stroke="#b9d1e2" strokeWidth="22" />
      <Path d="M0 1285 C60 1270 108 1320 102 1400 L102 1669 L0 1669 Z" fill="#83c752" />
      <Path d="M0 1388 C95 1372 195 1430 205 1510 C214 1580 168 1640 140 1669 L0 1669 Z" fill="#5fa63f" />
    </Svg>
  );
}

/* ---------- squish on press ---------- */
function Squish({ style, onPress, disabled, children }: any) {
  const s = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(s, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
  return (
    <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.92)} onPressOut={() => to(1)} style={style}>
      <Animated.View style={{ transform: [{ scale: s }] }}>{children}</Animated.View>
    </Pressable>
  );
}

/* ---------- one draggable symbol (+ or −) ---------- */
function DragSymbol({ ch, size, disabled, onDrop }: {
  ch: Sym; size: number; disabled: boolean;
  onDrop: (ch: Sym, x: number, y: number) => Promise<boolean>;
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const dropRef = useRef(onDrop);
  const disRef = useRef(disabled);
  dropRef.current = onDrop;
  disRef.current = disabled;
  const [drag, setDrag] = useState(false);

  const back = () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();

  const pr = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !disRef.current,
    onPanResponderGrant: () => setDrag(true),
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: async (_, g) => {
      setDrag(false);
      const ok = await dropRef.current(ch, g.moveX, g.moveY);
      if (ok) pan.setValue({ x: 0, y: 0 }); else back();
    },
    onPanResponderTerminate: () => { setDrag(false); back(); },
  })).current;

  return (
    <Animated.View
      {...pr.panHandlers}
      style={{
        width: size, height: size, alignItems: 'center', justifyContent: 'center',
        zIndex: drag ? 50 : 1, elevation: drag ? 20 : 0,
        transform: pan.getTranslateTransform(),
      }}
    >
      <Text style={[st.sym, { fontSize: size * 1.05, lineHeight: size * 1.15 }, drag && { color: GREEN }]}>{LABEL[ch]}</Text>
    </Animated.View>
  );
}

const measure = (ref: React.RefObject<any>) =>
  new Promise<{ x: number; y: number; w: number; h: number } | null>((resolve) => {
    const node: any = ref.current;
    if (!node || !node.measureInWindow) return resolve(null);
    node.measureInWindow((x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }));
  });

/* =====================  SCREEN  ===================== */
export default function BTLevel3Screen({ playerId, onHints, onExit, onComplete }: Props) {
  // screen size straight from the window (no onLayout, so it can never be 0)
  const { width: winW, height: winH } = useWindowDimensions();
  const box = { w: winW, h: winH };

  const [data, setData] = useState<Level3Start | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [hints, setHints] = useState(0);
  const [slots, setSlots] = useState<Slots>([null, null]);
  const [fixed, setFixed] = useState<Slots>([null, null]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Level3Answer | null>(null);
  const [riddle, setRiddle] = useState(false);     // red SKIP -> riddle screen
  const [clueOpen, setClueOpen] = useState(false);  // search button -> clue popup
  const [seen, setSeen] = useState(0);              // how many clues are revealed (0, 1, 2)

  const slotsRef = useRef<Slots>([null, null]);
  const fixedRef = useRef<Slots>([null, null]);
  slotsRef.current = slots;
  fixedRef.current = fixed;

  const slotRef0 = useRef<View>(null);
  const slotRef1 = useRef<View>(null);
  const slotRefs = [slotRef0, slotRef1];

  const shake = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0)).current;
  const msgTimer = useRef<any>(null);
  const timers = useRef<any[]>([]);

  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, []);

  const readRevealed = (list: { slot: number; symbol: Sym }[] | undefined): Slots => {
    const f: Slots = [null, null];
    (list || []).forEach((r) => { if (r.slot === 0 || r.slot === 1) f[r.slot] = r.symbol; });
    return f;
  };

  const load = useCallback(() => {
    setLoadErr('');
    setData(null);
    startLevel3(playerId)
      .then((d) => {
        const f = readRevealed(d.revealed);
        setData(d);
        setHints(d.hints);
        setFixed(f);
        setSlots(f);
      })
      .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
  }, [playerId]);

  useEffect(() => {
    load();
    return () => {
      timers.current.forEach(clearTimeout);
      clearTimeout(msgTimer.current);
    };
  }, [load]);

  useEffect(() => {
    if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
  }, [result]);

  useEffect(() => {
    if (data) onHints?.(hints);
  }, [hints, data]);

  const showMsg = (m: string) => {
    setMsg(m);
    clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 2600);
  };

  const shakeRow = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const submit = async (arr: Slots) => {
    if (!data) return;
    setBusy(true);
    try {
      const res = await answerLevel3({ sessionId: data.sessionId, playerId, symbols: arr as Sym[] });
      if (!res.correct) {
        showMsg(res.message || 'Not quite. Try again!');
        shakeRow();
        timers.current.push(setTimeout(() => {
          setSlots(fixedRef.current);
          slotsRef.current = fixedRef.current;
          setBusy(false);
        }, 700));
        return;
      }
      if (typeof res.hints === 'number') setHints(res.hints);
      timers.current.push(setTimeout(() => setResult(res), 700));
    } catch (e: any) {
      showMsg(e.message || 'Network error');
      setSlots(fixedRef.current);
      setBusy(false);
    }
  };

  const handleDrop = async (ch: Sym, px: number, py: number): Promise<boolean> => {
    if (busy || !data || result) return false;

    const rects = await Promise.all(slotRefs.map(measure));
    let best = -1;
    let bestD = Infinity;
    rects.forEach((r, i) => {
      if (!r) return;
      const d = Math.hypot(px - (r.x + r.w / 2), py - (r.y + r.h / 2));
      if (d < bestD) { bestD = d; best = i; }
    });

    const limit = Math.max(60, winW * 0.14);
    if (best < 0 || bestD > limit) return false;
    if (fixedRef.current[best]) return false;

    const next: Slots = [...slotsRef.current];
    next[best] = ch;
    setSlots(next);
    slotsRef.current = next;

    if (next.every(Boolean)) submit(next);
    return true;
  };

  const removeSlot = (i: number) => {
    if (busy || result || fixedRef.current[i]) return;
    setSlots((s) => { const n = [...s]; n[i] = null; return n; });
  };

  const watchVideo = async () => {
    if (busy || result) return;
    setBusy(true);
    try {
      const res = await rewardLevel3(playerId);
      setHints(res.hints);
      showMsg(`+${res.added} coins!`);
    } catch (e: any) {
      showMsg(e.message || 'Reward failed');
    }
    setBusy(false);
  };

  // clues are free: the search button opens the popup and shows Clue 1, Clue 2 needs a tap
  const openClues = () => { setClueOpen(true); if (seen === 0) setSeen(1); };

  // right riddle answer -> free skip, the level is completed and the game moves on
  const riddleSolved = async (): Promise<string> => {
    setRiddle(false);
    setResult({
      success: true, correct: true, completed: true, skipped: true,
      message: 'Level skipped!', score: 0, stars: 0,
    });
    return '';
  };

  /* ---------- loading / error ---------- */
  if (loadErr || !data) {
    return (
      <View style={[st.center, { width: winW, height: winH, backgroundColor: WALL }]}>
        {loadErr ? (
          <>
            <Text style={st.errText}>{loadErr}</Text>
            <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
            <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
          </>
        ) : (
          <>
            <ActivityIndicator color={NAVY} size="large" />
            <Text style={st.loading}>Loading level 3...</Text>
          </>
        )}
      </View>
    );
  }

  /* ---------- skip riddle screen ---------- */
  if (riddle) {
    return (
      <View style={{ width: winW, height: winH }}>
        <BTSkipRiddle hints={hints} onHome={onExit} onBack={() => setRiddle(false)} onSkipped={riddleSolved} />
      </View>
    );
  }

  // scale the 942x1669 design to the window
  const bw = Math.min(box.w, (box.h * DW) / DH), k = bw / DW, bh = (bw * DH) / DW;
  const top0 = (box.h - bh) / 2;
  const P = (v: number) => v * k;
  const A = (x: number, y: number, w: number, h: number): any => ({ position: 'absolute', left: P(x), top: P(y), width: P(w), height: P(h) });

  const [n1, n2, n3] = data.numbers;
  const u = P(112);
  const gap = P(92);
  const numStyle = [st.num, { fontSize: P(112), lineHeight: P(124), minWidth: P(70) }];
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

  const home = (ch: Sym) =>
    slots.includes(ch)
      ? <View style={[st.homeEmpty, { width: u, height: u, borderRadius: u / 2 }]} />
      : <DragSymbol ch={ch} size={u} disabled={busy || !!result} onDrop={handleDrop} />;

  const gapView = (i: number) => (
    <View ref={slotRefs[i]} collapsable={false} style={{ width: gap, height: u, alignItems: 'center', justifyContent: 'center' }}>
      {slots[i] ? (
        <TouchableOpacity activeOpacity={0.8} disabled={!!fixed[i] || busy || !!result} onPress={() => removeSlot(i)}>
          <Text style={[st.sym, { fontSize: u * 1.05, lineHeight: u * 1.15 }]}>{LABEL[slots[i] as Sym]}</Text>
        </TouchableOpacity>
      ) : (
        <View style={[st.slotRing, { width: gap * 0.72, height: gap * 0.72, borderRadius: gap }]} />
      )}
    </View>
  );

  const costPill = (x: number, w: number, icon: any, text: string) => (
    <View style={[A(x, 1527, w, 67), { borderRadius: P(34), backgroundColor: '#875427', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10) }]}>
      {icon}<Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{text}</Text>
    </View>
  );
  const circleBtn = (x: number, bgc: string, bc: string, onPress: any, icon: any) => (
    <Squish style={A(x, 1351, 166, 166)} onPress={onPress}>
      <View style={{ width: P(166), height: P(166), borderRadius: P(83), backgroundColor: bgc, borderWidth: P(14), borderColor: bc, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>{icon}</View>
    </Squish>
  );

  return (
    <View style={{ width: winW, height: winH, backgroundColor: WALL, overflow: 'hidden' }}>
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: top0 + P(1165), bottom: 0, backgroundColor: FLOOR }} />
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: top0 + P(1165), height: P(34), backgroundColor: BASE }} />

      <View style={{ position: 'absolute', left: (box.w - bw) / 2, top: top0, width: bw, height: bh }}>
        <Room w={bw} h={bh} />

        {/* top: home, settings */}
        <Squish style={A(27, 111, 78, 78)} onPress={onExit}><View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: '#fbde74', borderWidth: 2, borderColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' }}><Icon n="home" s={P(42)} /></View></Squish>
        <Squish style={A(119, 111, 78, 78)}><View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: '#fbde74', borderWidth: 2, borderColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' }}><Icon n="gear" s={P(44)} /></View></Squish>

        {/* level sign */}
        <Animated.View style={[A(300, 88, 346, 140), { transform: [{ rotate: swayR }] }]}>
          <View style={{ position: 'absolute', left: P(62), top: 0, width: 2, height: P(48), backgroundColor: '#9a6a3a', transform: [{ rotate: '6deg' }] }} />
          <View style={{ position: 'absolute', right: P(62), top: 0, width: 2, height: P(48), backgroundColor: '#9a6a3a', transform: [{ rotate: '-6deg' }] }} />
          <View style={{ position: 'absolute', left: 0, top: P(42), width: P(346), height: P(98), borderRadius: P(12), backgroundColor: '#bd6b29', borderWidth: P(5), borderColor: '#e0902f', alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10), flexWrap: 'nowrap' }}>
              <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'<'}</Text>
              <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{'LEVEL 3'}</Text>
              <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'>'}</Text>
            </View>
          </View>
          <View style={{ position: 'absolute', left: -P(6), top: P(36), width: P(34), height: P(58), borderRadius: P(20), backgroundColor: '#6cbf3d', transform: [{ rotate: '-30deg' }] }} />
          <View style={{ position: 'absolute', right: -P(6), top: P(36), width: P(34), height: P(58), borderRadius: P(20), backgroundColor: '#6cbf3d', transform: [{ rotate: '30deg' }] }} />
        </Animated.View>

        {/* bulbs counter */}
        <View style={[A(728, 128, 142, 68), { borderRadius: P(34), backgroundColor: '#fff', justifyContent: 'center', paddingRight: P(26), alignItems: 'center', elevation: 4 }]}>
          <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(44), fontWeight: '900', color: INK, includeFontPadding: false }}>{hints}</Text>
        </View>
        <View style={A(852, 118, 56, 56)}><Icon n="bulb" s={P(56)} /></View>

        {/* question pill (2 lines) */}
        <View style={[A(80, 262, 782, 150), { borderRadius: P(60), backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center', elevation: 4 }]}>
          <Text style={{ position: 'absolute', left: P(30), fontFamily: F, fontSize: P(54), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'<'}</Text>
          <Text style={{ position: 'absolute', right: P(30), fontFamily: F, fontSize: P(54), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'>'}</Text>
          <Text numberOfLines={2} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(40), lineHeight: P(52), color: '#17307a', maxWidth: P(620), textAlign: 'center' }}>{data.question}</Text>
        </View>

        {/* the two pictures */}
        <View style={A(66, 440, 380, 494)}><SpotScene side="a" width={P(380)} /></View>
        <View style={A(496, 440, 380, 494)}><SpotScene side="b" width={P(380)} /></View>

        {/* + 1 _ 2 _ 3 − */}
        <Animated.View style={[A(0, 985, 942, 140), { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 10, elevation: 10, transform: [{ translateX: shake }] }]}>
          {home('+')}
          <Text style={numStyle}>{n1}</Text>
          {gapView(0)}
          <Text style={numStyle}>{n2}</Text>
          {gapView(1)}
          <Text style={numStyle}>{n3}</Text>
          {home('-')}
        </Animated.View>

        {/* message line */}
        {!!msg && (
          <View pointerEvents="none" style={[A(60, 1170, 822, 68), { zIndex: 20, elevation: 20, alignItems: 'center', justifyContent: 'center' }]}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: P(34), paddingHorizontal: P(34), paddingVertical: P(8) }}>
              <Text numberOfLines={2} style={{ fontFamily: F, fontSize: P(34), fontWeight: 'bold', color: '#c0392b', textAlign: 'center' }}>{msg}</Text>
            </View>
          </View>
        )}

        {/* clue / video / skip */}
        {circleBtn(143, '#a4d732', '#cff08d', openClues, <Icon n="search" s={P(78)} />)}
        {costPill(152, 150, <Icon n="bulb" s={P(38)} />, String(COST_CLUE))}
        {circleBtn(388, '#f4e8d2', '#fff', watchVideo, <Icon n="film" s={P(92)} />)}
        {costPill(391, 162, <Coin s={P(30)} />, '+' + REWARD)}
        {circleBtn(637, '#ed434d', '#fff', () => setRiddle(true), <Icon n="play" s={P(80)} />)}
        {costPill(645, 151, <Icon n="bulb" s={P(38)} />, String(COST_SKIP))}

        {/* ---- clue popup (free) ---- */}
        {clueOpen && (
          <>
            <Pressable onPress={() => setClueOpen(false)} style={[A(0, 0, DW, DH), { zIndex: 40, elevation: 40, backgroundColor: 'rgba(10,25,60,0.5)' }]} />
            <View style={[A(60, 330, 822, 900), { zIndex: 41, elevation: 41, borderRadius: P(56), backgroundColor: CREAM, borderWidth: P(14), borderColor: '#e0902f' }]}>
              <Text style={{ position: 'absolute', left: 0, right: 0, top: P(34), textAlign: 'center', fontFamily: F, fontSize: P(56), fontWeight: '900', color: NAVY, includeFontPadding: false }}>CLUES</Text>
              <Squish style={A(660, 22, 78, 78)} onPress={() => setClueOpen(false)}>
                <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: '#fbde74', borderWidth: 2, borderColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' }}><Icon n="cross" s={P(40)} /></View>
              </Squish>
              {[[1, 130], [2, 490]].map(([c, y]) => {
                const shown = seen >= c, avail = !shown && seen === c - 1;
                return (
                  <Squish key={'clue' + c} disabled={!avail} onPress={() => setSeen(c)} style={A(36, y, 720, 330)}>
                    <View style={{ width: P(720), height: P(330), borderRadius: P(40), backgroundColor: shown ? '#ffffff' : avail ? '#f6e3b4' : '#e4dccd', borderWidth: P(6), borderColor: shown ? GREEN : avail ? '#ffb629' : '#cfc3ae', flexDirection: 'row', alignItems: 'center', paddingHorizontal: P(28), gap: P(24) }}>
                      <View style={{ width: P(110), height: P(110), borderRadius: P(55), backgroundColor: shown || avail ? '#bd6b29' : '#b7a98f', alignItems: 'center', justifyContent: 'center' }}>
                        {shown || avail
                          ? <Text style={{ fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{c}</Text>
                          : <LockArt s={P(70)} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: shown || avail ? '#bd6b29' : '#8d7f68', includeFontPadding: false }}>{'Clue ' + c}</Text>
                        {shown
                          ? <Text numberOfLines={7} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(32), lineHeight: P(41), color: '#17307a', marginTop: P(6) }}>{CLUES[c - 1]}</Text>
                          : avail
                            ? <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(34), fontWeight: 'bold', color: '#6b4423', marginTop: P(8), includeFontPadding: false }}>Tap to reveal</Text>
                            : <Text numberOfLines={2} style={{ fontFamily: F, fontSize: P(32), fontWeight: 'bold', color: '#8d7f68', marginTop: P(8) }}>{'View Clue ' + (c - 1) + ' first to unlock'}</Text>}
                      </View>
                    </View>
                  </Squish>
                );
              })}
            </View>
          </>
        )}

        {/* ---- level complete ---- */}
        {!!result && (
          <View style={[A(0, 0, DW, DH), { zIndex: 60, elevation: 60, backgroundColor: 'rgba(10,25,60,0.55)', alignItems: 'center', justifyContent: 'center' }]}>
            <Animated.View style={{ width: P(702), alignItems: 'center', backgroundColor: CREAM, borderWidth: P(12), borderColor: '#e0902f', borderRadius: P(56), paddingVertical: P(44), paddingHorizontal: P(30), opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
              <Text style={{ fontFamily: F, fontSize: P(64), fontWeight: '900', color: NAVY }}>Level complete!</Text>
              <Text style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(38), color: '#17307a', textAlign: 'center', marginTop: P(10) }}>{result.message}</Text>
              <View style={{ flexDirection: 'row', gap: P(10), marginTop: P(26) }}>
                {[1, 2, 3].map((c) => <StarIcon key={c} size={P(84)} on={c <= (result.stars || 0)} />)}
              </View>
              {!result.skipped && <Text style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#bd6b29', marginTop: P(18) }}>{'Score ' + result.score}</Text>}
              <TouchableOpacity activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}
                style={{ marginTop: P(34), minWidth: P(320), height: P(104), borderRadius: P(52), backgroundColor: '#a4d732', borderWidth: P(8), borderColor: K, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: F, fontSize: P(54), fontWeight: '900', color: K }}>NEXT</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  loading: { fontFamily: F, fontSize: 18, color: NAVY, marginTop: 12 },
  errText: { fontFamily: F, fontSize: 18, color: NAVY, textAlign: 'center', paddingHorizontal: 24 },
  retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: '#a4d732', borderWidth: 2.5, borderColor: K },
  retryT: { fontFamily: F, fontSize: 20, fontWeight: '800', color: K },
  back: { fontFamily: F, fontSize: 16, color: NAVY, marginTop: 14, textDecorationLine: 'underline' },

  num: { fontFamily: F, fontWeight: '900', color: NAVY, textAlign: 'center', includeFontPadding: false },
  sym: { fontFamily: F, fontWeight: '900', color: ORANGE, textAlign: 'center', includeFontPadding: false },
  homeEmpty: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.25)' },
  slotRing: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.5)', backgroundColor: 'rgba(255,255,255,0.35)' },
});