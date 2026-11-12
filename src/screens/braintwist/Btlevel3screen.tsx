

// // // // // // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // // // // // import {
// // // // // // // //   View, Text, Animated, PanResponder, Pressable, StyleSheet, Platform, Easing,
// // // // // // // //   ActivityIndicator, TouchableOpacity, useWindowDimensions,
// // // // // // // // } from 'react-native';
// // // // // // // // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // // // // // // // import { startLevel3, answerLevel3, rewardLevel3, Level3Start, Level3Answer, Sym } from './Btlevel3api';
// // // // // // // // import { SpotScene } from './Btlevel3art';
// // // // // // // // import { StarIcon } from './Btlevel2art';
// // // // // // // // import { F, INK, Coin } from './BTShared';
// // // // // // // // import { Icon } from './Art';
// // // // // // // // import BTSkipRiddle from './BTSkipRiddle';
// // // // // // // // import { play } from './BTSound';

// // // // // // // // /**
// // // // // // // //  * Level 3 - spot the differences, put + and − between 1 2 3.
// // // // // // // //  * Layout copied from Level 1 (942 x 1669 design grid, same room, same clue popup, same skip riddle).
// // // // // // // //  * No pencil / eraser on this screen.
// // // // // // // //  * Size comes from useWindowDimensions (works with or without a Stage wrapper).
// // // // // // // //  */

// // // // // // // // const NAVY = '#132f70', CREAM = '#faf0e2', K = '#1d1d1d', ORANGE = '#f5a623', GREEN = '#3ec75a';
// // // // // // // // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });
// // // // // // // // const DW = 942, DH = 1669;
// // // // // // // // const WALL = '#abd1f1', FLOOR = '#f0bb75', BASE = '#f1bebf';
// // // // // // // // const COST_CLUE = 25, COST_SKIP = 50, REWARD = 75; // only shown on the pills

// // // // // // // // // only one clue now
// // // // // // // // const CLUE_TEXT = 'Sometimes, the smallest changes can make the biggest difference. Look closely at what’s missing between the numbers!';

// // // // // // // // const LABEL: Record<Sym, string> = { '+': '+', '-': '−' };
// // // // // // // // type Slots = (Sym | null)[];

// // // // // // // // type Props = {
// // // // // // // //   playerId: number;
// // // // // // // //   onHints?: (h: number) => void;
// // // // // // // //   onExit: () => void;
// // // // // // // //   onComplete?: (result: Level3Answer) => void;
// // // // // // // // };

// // // // // // // // /* ---------- the room (same scene as Level 1) ---------- */
// // // // // // // // function Room({ w, h }: any) {
// // // // // // // //   return (
// // // // // // // //     <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{ position: 'absolute', left: 0, top: 0 }}>
// // // // // // // //       <Defs><LinearGradient id="l3wall" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#abd1f1" /><Stop offset="1" stopColor="#b1d3ef" /></LinearGradient></Defs>
// // // // // // // //       <Rect width={DW} height={DH} fill="url(#l3wall)" />
// // // // // // // //       <Polygon points="250,0 430,0 150,1170 0,1170" fill="#fff" opacity="0.10" />
// // // // // // // //       <Polygon points="520,0 640,0 420,1170 330,1170" fill="#fff" opacity="0.07" />
// // // // // // // //       <Rect x="0" y="1165" width={DW} height="34" fill={BASE} />
// // // // // // // //       <Rect x="0" y="1199" width={DW} height={DH - 1199} fill={FLOOR} />
// // // // // // // //       {[0, 1, 2, 3, 4, 5].map(i => <Rect key={i} x={i * 170 - 20} y="1199" width="3" height={DH - 1199} fill="#e6a85f" opacity="0.5" />)}

// // // // // // // //       <Rect x="0" y="128" width="205" height="512" fill="#e8a55a" />
// // // // // // // //       <Rect x="0" y="140" width="190" height="488" fill="#97d9f9" />
// // // // // // // //       <Rect x="0" y="372" width="205" height="14" fill="#e8a55a" />
// // // // // // // //       <G fill="#fff"><Ellipse cx="165" cy="215" rx="28" ry="20" /><Ellipse cx="140" cy="230" rx="26" ry="16" /><Ellipse cx="10" cy="345" rx="22" ry="16" /></G>
// // // // // // // //       <Rect x="0" y="610" width="245" height="38" fill="#f0be76" />
// // // // // // // //       <Rect x="0" y="640" width="245" height="8" fill="#d99a4e" opacity="0.5" />
// // // // // // // //       <Ellipse cx="85" cy="520" rx="46" ry="92" fill="#6cbf3d" />
// // // // // // // //       <Ellipse cx="150" cy="500" rx="38" ry="84" fill="#7fcf4b" transform="rotate(14 150 500)" />
// // // // // // // //       <Ellipse cx="45" cy="540" rx="34" ry="64" fill="#5fae38" transform="rotate(-14 45 540)" />
// // // // // // // //       <Rect x="68" y="548" width="106" height="68" rx="16" fill="#f4eadc" />
// // // // // // // //       <Circle cx="102" cy="578" r="5" fill="#6b4423" /><Circle cx="140" cy="578" r="5" fill="#6b4423" />

// // // // // // // //       <Rect x="708" y="182" width="162" height="181" fill="#c8e4f3" stroke="#a9d1ea" strokeWidth="5" />
// // // // // // // //       <Circle cx="790" cy="267" r="56" fill="#f9cf6a" opacity="0.7" />
// // // // // // // //       <Circle cx="790" cy="267" r="42" fill="#f5a63e" />

// // // // // // // //       <Rect x="775" y="632" width="167" height="533" fill="#e9ab5e" />
// // // // // // // //       <Rect x="790" y="646" width="152" height="505" fill="#dc9d4f" />
// // // // // // // //       <Rect x="775" y="800" width="167" height="12" fill="#f0bb75" />
// // // // // // // //       <Rect x="775" y="980" width="167" height="12" fill="#f0bb75" />
// // // // // // // //       <Rect x="805" y="690" width="30" height="110" fill="#38aeea" />
// // // // // // // //       <Rect x="835" y="672" width="26" height="128" fill="#f8d04c" />
// // // // // // // //       <Rect x="862" y="692" width="30" height="108" fill="#8a63da" />
// // // // // // // //       <Rect x="805" y="872" width="30" height="106" fill="#5b86d6" />
// // // // // // // //       <Rect x="835" y="858" width="26" height="120" fill="#4db8b4" />
// // // // // // // //       <Circle cx="826" cy="1030" r="20" fill="#c98a4b" /><Circle cx="884" cy="1030" r="20" fill="#c98a4b" /><Circle cx="855" cy="1070" r="42" fill="#c98a4b" />
// // // // // // // //       <Rect x="838" y="522" width="26" height="110" rx="13" fill="#6cbf3d" transform="rotate(-6 851 580)" />
// // // // // // // //       <Rect x="872" y="568" width="30" height="80" rx="15" fill="#5fae38" transform="rotate(26 887 608)" />

// // // // // // // //       <Rect x="0" y="1095" width="195" height="37" fill="#39abea" />
// // // // // // // //       <Rect x="0" y="1132" width="205" height="42" fill="#ef69b0" />
// // // // // // // //       <Rect x="0" y="1175" width="208" height="38" fill="#f9d04c" />
// // // // // // // //       <Rect x="150" y="1185" width="50" height="14" fill="#fff" opacity="0.85" />
// // // // // // // //       <Rect x="0" y="1213" width="215" height="30" fill="#3aaeed" />
// // // // // // // //       <Rect x="18" y="1200" width="136" height="58" rx="18" fill="#39aeec" />
// // // // // // // //       <Rect x="58" y="1186" width="58" height="32" rx="12" fill="#7cc8f4" />
// // // // // // // //       <Circle cx="40" cy="1272" r="16" fill="#27408b" /><Circle cx="122" cy="1272" r="16" fill="#27408b" />

// // // // // // // //       <Rect x="868" y="1030" width="22" height="130" fill="#6cbf3d" transform="rotate(-8 879 1100)" />
// // // // // // // //       <Rect x="880" y="1030" width="22" height="130" fill="#ef5a67" transform="rotate(10 891 1100)" />
// // // // // // // //       <Rect x="902" y="1028" width="20" height="130" fill="#3a8fd8" transform="rotate(22 912 1100)" />
// // // // // // // //       <Rect x="822" y="1140" width="108" height="146" rx="12" fill="#f9cd3a" />
// // // // // // // //       <Rect x="822" y="1140" width="108" height="14" fill="#f2bb21" />

// // // // // // // //       <Rect x="81" y="1248" width="805" height="346" rx="173" fill="#f4e8d2" stroke="#b9d1e2" strokeWidth="22" />
// // // // // // // //       <Path d="M0 1285 C60 1270 108 1320 102 1400 L102 1669 L0 1669 Z" fill="#83c752" />
// // // // // // // //       <Path d="M0 1388 C95 1372 195 1430 205 1510 C214 1580 168 1640 140 1669 L0 1669 Z" fill="#5fa63f" />
// // // // // // // //     </Svg>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // /* ---------- squish on press ---------- */
// // // // // // // // function Squish({ style, onPress, disabled, children }: any) {
// // // // // // // //   const s = useRef(new Animated.Value(1)).current;
// // // // // // // //   const to = (v: number) => Animated.spring(s, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
// // // // // // // //   return (
// // // // // // // //     <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.92)} onPressOut={() => to(1)} style={style}>
// // // // // // // //       <Animated.View style={{ transform: [{ scale: s }] }}>{children}</Animated.View>
// // // // // // // //     </Pressable>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // /* ---------- one draggable symbol (+ or −) ---------- */
// // // // // // // // function DragSymbol({ ch, size, disabled, onDrop }: {
// // // // // // // //   ch: Sym; size: number; disabled: boolean;
// // // // // // // //   onDrop: (ch: Sym, x: number, y: number) => Promise<boolean>;
// // // // // // // // }) {
// // // // // // // //   const pan = useRef(new Animated.ValueXY()).current;
// // // // // // // //   const dropRef = useRef(onDrop);
// // // // // // // //   const disRef = useRef(disabled);
// // // // // // // //   dropRef.current = onDrop;
// // // // // // // //   disRef.current = disabled;
// // // // // // // //   const [drag, setDrag] = useState(false);

// // // // // // // //   const back = () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();

// // // // // // // //   const pr = useRef(PanResponder.create({
// // // // // // // //     onStartShouldSetPanResponder: () => !disRef.current,
// // // // // // // //     onPanResponderGrant: () => { setDrag(true); play('drag'); },
// // // // // // // //     onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
// // // // // // // //     onPanResponderRelease: async (_, g) => {
// // // // // // // //       setDrag(false);
// // // // // // // //       const ok = await dropRef.current(ch, g.moveX, g.moveY);
// // // // // // // //       if (ok) pan.setValue({ x: 0, y: 0 }); else back();
// // // // // // // //     },
// // // // // // // //     onPanResponderTerminate: () => { setDrag(false); back(); },
// // // // // // // //   })).current;

// // // // // // // //   return (
// // // // // // // //     <Animated.View
// // // // // // // //       {...pr.panHandlers}
// // // // // // // //       style={{
// // // // // // // //         width: size, height: size, alignItems: 'center', justifyContent: 'center',
// // // // // // // //         zIndex: drag ? 50 : 1, elevation: drag ? 20 : 0,
// // // // // // // //         transform: pan.getTranslateTransform(),
// // // // // // // //       }}
// // // // // // // //     >
// // // // // // // //       <Text style={[st.sym, { fontSize: size * 1.05, lineHeight: size * 1.15 }, drag && { color: GREEN }]}>{LABEL[ch]}</Text>
// // // // // // // //     </Animated.View>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // const measure = (ref: React.RefObject<any>) =>
// // // // // // // //   new Promise<{ x: number; y: number; w: number; h: number } | null>((resolve) => {
// // // // // // // //     const node: any = ref.current;
// // // // // // // //     if (!node || !node.measureInWindow) return resolve(null);
// // // // // // // //     node.measureInWindow((x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }));
// // // // // // // //   });

// // // // // // // // /* =====================  SCREEN  ===================== */
// // // // // // // // export default function BTLevel3Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // // // // // // //   // screen size straight from the window (no onLayout, so it can never be 0)
// // // // // // // //   const { width: winW, height: winH } = useWindowDimensions();
// // // // // // // //   const box = { w: winW, h: winH };

// // // // // // // //   const [data, setData] = useState<Level3Start | null>(null);
// // // // // // // //   const [loadErr, setLoadErr] = useState('');
// // // // // // // //   const [hints, setHints] = useState(0);
// // // // // // // //   const [slots, setSlots] = useState<Slots>([null, null]);
// // // // // // // //   const [fixed, setFixed] = useState<Slots>([null, null]);
// // // // // // // //   const [msg, setMsg] = useState('');
// // // // // // // //   const [busy, setBusy] = useState(false);
// // // // // // // //   const [result, setResult] = useState<Level3Answer | null>(null);
// // // // // // // //   const [riddle, setRiddle] = useState(false);     // red SKIP -> riddle screen
// // // // // // // //   const [clueOpen, setClueOpen] = useState(false);  // search button -> clue popup

// // // // // // // //   const slotsRef = useRef<Slots>([null, null]);
// // // // // // // //   const fixedRef = useRef<Slots>([null, null]);
// // // // // // // //   slotsRef.current = slots;
// // // // // // // //   fixedRef.current = fixed;

// // // // // // // //   const slotRef0 = useRef<View>(null);
// // // // // // // //   const slotRef1 = useRef<View>(null);
// // // // // // // //   const slotRefs = [slotRef0, slotRef1];

// // // // // // // //   const shake = useRef(new Animated.Value(0)).current;
// // // // // // // //   const sway = useRef(new Animated.Value(0)).current;
// // // // // // // //   const pop = useRef(new Animated.Value(0)).current;
// // // // // // // //   const msgTimer = useRef<any>(null);
// // // // // // // //   const timers = useRef<any[]>([]);

// // // // // // // //   useEffect(() => {
// // // // // // // //     const a = Animated.loop(Animated.sequence([
// // // // // // // //       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // // // // //       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // // // // //     ]));
// // // // // // // //     a.start();
// // // // // // // //     return () => a.stop();
// // // // // // // //   }, []);

// // // // // // // //   const readRevealed = (list: { slot: number; symbol: Sym }[] | undefined): Slots => {
// // // // // // // //     const f: Slots = [null, null];
// // // // // // // //     (list || []).forEach((r) => { if (r.slot === 0 || r.slot === 1) f[r.slot] = r.symbol; });
// // // // // // // //     return f;
// // // // // // // //   };

// // // // // // // //   const load = useCallback(() => {
// // // // // // // //     setLoadErr('');
// // // // // // // //     setData(null);
// // // // // // // //     startLevel3(playerId)
// // // // // // // //       .then((d) => {
// // // // // // // //         const f = readRevealed(d.revealed);
// // // // // // // //         setData(d);
// // // // // // // //         setHints(d.hints);
// // // // // // // //         setFixed(f);
// // // // // // // //         setSlots(f);
// // // // // // // //       })
// // // // // // // //       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
// // // // // // // //   }, [playerId]);

// // // // // // // //   useEffect(() => {
// // // // // // // //     load();
// // // // // // // //     return () => {
// // // // // // // //       timers.current.forEach(clearTimeout);
// // // // // // // //       clearTimeout(msgTimer.current);
// // // // // // // //     };
// // // // // // // //   }, [load]);

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
// // // // // // // //   }, [result]);

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (data) onHints?.(hints);
// // // // // // // //   }, [hints, data]);

// // // // // // // //   const showMsg = (m: string) => {
// // // // // // // //     setMsg(m);
// // // // // // // //     clearTimeout(msgTimer.current);
// // // // // // // //     msgTimer.current = setTimeout(() => setMsg(''), 2600);
// // // // // // // //   };

// // // // // // // //   const shakeRow = () => {
// // // // // // // //     Animated.sequence([
// // // // // // // //       Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
// // // // // // // //       Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
// // // // // // // //       Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
// // // // // // // //       Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
// // // // // // // //     ]).start();
// // // // // // // //   };

// // // // // // // //   const submit = async (arr: Slots) => {
// // // // // // // //     if (!data) return;
// // // // // // // //     setBusy(true);
// // // // // // // //     try {
// // // // // // // //       const res = await answerLevel3({ sessionId: data.sessionId, playerId, symbols: arr as Sym[] });
// // // // // // // //       if (!res.correct) {
// // // // // // // //         play('wrong');
// // // // // // // //         showMsg(res.message || 'Not quite. Try again!');
// // // // // // // //         shakeRow();
// // // // // // // //         timers.current.push(setTimeout(() => {
// // // // // // // //           setSlots(fixedRef.current);
// // // // // // // //           slotsRef.current = fixedRef.current;
// // // // // // // //           setBusy(false);
// // // // // // // //         }, 700));
// // // // // // // //         return;
// // // // // // // //       }
// // // // // // // //       if (typeof res.hints === 'number') setHints(res.hints);
// // // // // // // //       play('correct');
// // // // // // // //       timers.current.push(setTimeout(() => setResult(res), 700));
// // // // // // // //     } catch (e: any) {
// // // // // // // //       showMsg(e.message || 'Network error');
// // // // // // // //       setSlots(fixedRef.current);
// // // // // // // //       setBusy(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleDrop = async (ch: Sym, px: number, py: number): Promise<boolean> => {
// // // // // // // //     if (busy || !data || result) return false;

// // // // // // // //     const rects = await Promise.all(slotRefs.map(measure));
// // // // // // // //     let best = -1;
// // // // // // // //     let bestD = Infinity;
// // // // // // // //     rects.forEach((r, i) => {
// // // // // // // //       if (!r) return;
// // // // // // // //       const d = Math.hypot(px - (r.x + r.w / 2), py - (r.y + r.h / 2));
// // // // // // // //       if (d < bestD) { bestD = d; best = i; }
// // // // // // // //     });

// // // // // // // //     const limit = Math.max(60, winW * 0.14);
// // // // // // // //     if (best < 0 || bestD > limit) return false;
// // // // // // // //     if (fixedRef.current[best]) return false;

// // // // // // // //     const next: Slots = [...slotsRef.current];
// // // // // // // //     next[best] = ch;
// // // // // // // //     setSlots(next);
// // // // // // // //     slotsRef.current = next;

// // // // // // // //     if (next.every(Boolean)) submit(next);
// // // // // // // //     return true;
// // // // // // // //   };

// // // // // // // //   const removeSlot = (i: number) => {
// // // // // // // //     if (busy || result || fixedRef.current[i]) return;
// // // // // // // //     setSlots((s) => { const n = [...s]; n[i] = null; return n; });
// // // // // // // //   };

// // // // // // // //   const watchVideo = async () => {
// // // // // // // //     if (busy || result) return;
// // // // // // // //     setBusy(true);
// // // // // // // //     try {
// // // // // // // //       const res = await rewardLevel3(playerId);
// // // // // // // //       setHints(res.hints);
// // // // // // // //       showMsg(`+${res.added} coins!`);
// // // // // // // //     } catch (e: any) {
// // // // // // // //       showMsg(e.message || 'Reward failed');
// // // // // // // //     }
// // // // // // // //     setBusy(false);
// // // // // // // //   };

// // // // // // // //   // clue is free: the search button just opens the popup
// // // // // // // //   const openClues = () => { play('clue'); setClueOpen(true); };

// // // // // // // //   // right riddle answer -> free skip, the level is completed and the game moves on
// // // // // // // //   const riddleSolved = async (): Promise<string> => {
// // // // // // // //     setRiddle(false);
// // // // // // // //     setResult({
// // // // // // // //       success: true, correct: true, completed: true, skipped: true,
// // // // // // // //       message: 'Level skipped!', score: 0, stars: 0,
// // // // // // // //     });
// // // // // // // //     return '';
// // // // // // // //   };

// // // // // // // //   /* ---------- loading / error ---------- */
// // // // // // // //   if (loadErr || !data) {
// // // // // // // //     return (
// // // // // // // //       <View style={[st.center, { width: winW, height: winH, backgroundColor: WALL }]}>
// // // // // // // //         {loadErr ? (
// // // // // // // //           <>
// // // // // // // //             <Text style={st.errText}>{loadErr}</Text>
// // // // // // // //             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // // // // // //             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // // // // // //           </>
// // // // // // // //         ) : (
// // // // // // // //           <>
// // // // // // // //             <ActivityIndicator color={NAVY} size="large" />
// // // // // // // //             <Text style={st.loading}>Loading level 3...</Text>
// // // // // // // //           </>
// // // // // // // //         )}
// // // // // // // //       </View>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   /* ---------- skip riddle screen ---------- */
// // // // // // // //   if (riddle) {
// // // // // // // //     return (
// // // // // // // //       <View style={{ width: winW, height: winH }}>
// // // // // // // //         <BTSkipRiddle hints={hints} onHome={onExit} onBack={() => setRiddle(false)} onSkipped={riddleSolved} />
// // // // // // // //       </View>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   // scale the 942x1669 design to the window
// // // // // // // //   const bw = Math.min(box.w, (box.h * DW) / DH), k = bw / DW, bh = (bw * DH) / DW;
// // // // // // // //   const top0 = (box.h - bh) / 2;
// // // // // // // //   const P = (v: number) => v * k;
// // // // // // // //   const A = (x: number, y: number, w: number, h: number): any => ({ position: 'absolute', left: P(x), top: P(y), width: P(w), height: P(h) });

// // // // // // // //   const [n1, n2, n3] = data.numbers;
// // // // // // // //   const u = P(112);
// // // // // // // //   const gap = P(92);
// // // // // // // //   const numStyle = [st.num, { fontSize: P(112), lineHeight: P(124), minWidth: P(70) }];
// // // // // // // //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// // // // // // // //   const home = (ch: Sym) =>
// // // // // // // //     slots.includes(ch)
// // // // // // // //       ? <View style={[st.homeEmpty, { width: u, height: u, borderRadius: u / 2 }]} />
// // // // // // // //       : <DragSymbol ch={ch} size={u} disabled={busy || !!result} onDrop={handleDrop} />;

// // // // // // // //   const gapView = (i: number) => (
// // // // // // // //     <View ref={slotRefs[i]} collapsable={false} style={{ width: gap, height: u, alignItems: 'center', justifyContent: 'center' }}>
// // // // // // // //       {slots[i] ? (
// // // // // // // //         <TouchableOpacity activeOpacity={0.8} disabled={!!fixed[i] || busy || !!result} onPress={() => removeSlot(i)}>
// // // // // // // //           <Text style={[st.sym, { fontSize: u * 1.05, lineHeight: u * 1.15 }]}>{LABEL[slots[i] as Sym]}</Text>
// // // // // // // //         </TouchableOpacity>
// // // // // // // //       ) : (
// // // // // // // //         <View style={[st.slotRing, { width: gap * 0.72, height: gap * 0.72, borderRadius: gap }]} />
// // // // // // // //       )}
// // // // // // // //     </View>
// // // // // // // //   );

// // // // // // // //   const costPill = (x: number, w: number, icon: any, text: string) => (
// // // // // // // //     <View style={[A(x, 1527, w, 67), { borderRadius: P(34), backgroundColor: '#875427', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10) }]}>
// // // // // // // //       {icon}<Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{text}</Text>
// // // // // // // //     </View>
// // // // // // // //   );
// // // // // // // //   const circleBtn = (x: number, bgc: string, bc: string, onPress: any, icon: any) => (
// // // // // // // //     <Squish style={A(x, 1351, 166, 166)} onPress={onPress}>
// // // // // // // //       <View style={{ width: P(166), height: P(166), borderRadius: P(83), backgroundColor: bgc, borderWidth: P(14), borderColor: bc, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>{icon}</View>
// // // // // // // //     </Squish>
// // // // // // // //   );

// // // // // // // //   return (
// // // // // // // //     <View style={{ width: winW, height: winH, backgroundColor: WALL, overflow: 'hidden' }}>
// // // // // // // //       <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: top0 + P(1165), bottom: 0, backgroundColor: FLOOR }} />
// // // // // // // //       <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: top0 + P(1165), height: P(34), backgroundColor: BASE }} />

// // // // // // // //       <View style={{ position: 'absolute', left: (box.w - bw) / 2, top: top0, width: bw, height: bh }}>
// // // // // // // //         <Room w={bw} h={bh} />

// // // // // // // //         {/* top: home, settings */}
// // // // // // // //         <Squish style={A(27, 111, 78, 78)} onPress={onExit}><View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: '#fbde74', borderWidth: 2, borderColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' }}><Icon n="home" s={P(42)} /></View></Squish>
// // // // // // // //         <Squish style={A(119, 111, 78, 78)}><View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: '#fbde74', borderWidth: 2, borderColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' }}><Icon n="gear" s={P(44)} /></View></Squish>

// // // // // // // //         {/* level sign */}
// // // // // // // //         <Animated.View style={[A(300, 88, 346, 140), { transform: [{ rotate: swayR }] }]}>
// // // // // // // //           <View style={{ position: 'absolute', left: P(62), top: 0, width: 2, height: P(48), backgroundColor: '#9a6a3a', transform: [{ rotate: '6deg' }] }} />
// // // // // // // //           <View style={{ position: 'absolute', right: P(62), top: 0, width: 2, height: P(48), backgroundColor: '#9a6a3a', transform: [{ rotate: '-6deg' }] }} />
// // // // // // // //           <View style={{ position: 'absolute', left: 0, top: P(42), width: P(346), height: P(98), borderRadius: P(12), backgroundColor: '#bd6b29', borderWidth: P(5), borderColor: '#e0902f', alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
// // // // // // // //             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10), flexWrap: 'nowrap' }}>
// // // // // // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'<'}</Text>
// // // // // // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{'LEVEL 3'}</Text>
// // // // // // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'>'}</Text>
// // // // // // // //             </View>
// // // // // // // //           </View>
// // // // // // // //           <View style={{ position: 'absolute', left: -P(6), top: P(36), width: P(34), height: P(58), borderRadius: P(20), backgroundColor: '#6cbf3d', transform: [{ rotate: '-30deg' }] }} />
// // // // // // // //           <View style={{ position: 'absolute', right: -P(6), top: P(36), width: P(34), height: P(58), borderRadius: P(20), backgroundColor: '#6cbf3d', transform: [{ rotate: '30deg' }] }} />
// // // // // // // //         </Animated.View>

// // // // // // // //         {/* bulbs counter */}
// // // // // // // //         <View style={[A(728, 128, 142, 68), { borderRadius: P(34), backgroundColor: '#fff', justifyContent: 'center', paddingRight: P(26), alignItems: 'center', elevation: 4 }]}>
// // // // // // // //           <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(44), fontWeight: '900', color: INK, includeFontPadding: false }}>{hints}</Text>
// // // // // // // //         </View>
// // // // // // // //         <View style={A(852, 118, 56, 56)}><Icon n="bulb" s={P(56)} /></View>

// // // // // // // //         {/* question pill (2 lines) */}
// // // // // // // //         <View style={[A(80, 262, 782, 150), { borderRadius: P(60), backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center', elevation: 4 }]}>
// // // // // // // //           <Text style={{ position: 'absolute', left: P(30), fontFamily: F, fontSize: P(54), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'<'}</Text>
// // // // // // // //           <Text style={{ position: 'absolute', right: P(30), fontFamily: F, fontSize: P(54), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'>'}</Text>
// // // // // // // //           <Text numberOfLines={2} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(40), lineHeight: P(52), color: '#17307a', maxWidth: P(620), textAlign: 'center' }}>{data.question}</Text>
// // // // // // // //         </View>

// // // // // // // //         {/* the two pictures */}
// // // // // // // //         <View style={A(66, 440, 380, 494)}><SpotScene side="a" width={P(380)} /></View>
// // // // // // // //         <View style={A(496, 440, 380, 494)}><SpotScene side="b" width={P(380)} /></View>

// // // // // // // //         {/* + 1 _ 2 _ 3 − */}
// // // // // // // //         <Animated.View style={[A(0, 985, 942, 140), { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 10, elevation: 10, transform: [{ translateX: shake }] }]}>
// // // // // // // //           {home('+')}
// // // // // // // //           <Text style={numStyle}>{n1}</Text>
// // // // // // // //           {gapView(0)}
// // // // // // // //           <Text style={numStyle}>{n2}</Text>
// // // // // // // //           {gapView(1)}
// // // // // // // //           <Text style={numStyle}>{n3}</Text>
// // // // // // // //           {home('-')}
// // // // // // // //         </Animated.View>

// // // // // // // //         {/* message line */}
// // // // // // // //         {!!msg && (
// // // // // // // //           <View pointerEvents="none" style={[A(60, 1170, 822, 68), { zIndex: 20, elevation: 20, alignItems: 'center', justifyContent: 'center' }]}>
// // // // // // // //             <View style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: P(34), paddingHorizontal: P(34), paddingVertical: P(8) }}>
// // // // // // // //               <Text numberOfLines={2} style={{ fontFamily: F, fontSize: P(34), fontWeight: 'bold', color: '#c0392b', textAlign: 'center' }}>{msg}</Text>
// // // // // // // //             </View>
// // // // // // // //           </View>
// // // // // // // //         )}

// // // // // // // //         {/* clue / video / skip */}
// // // // // // // //         {circleBtn(143, '#a4d732', '#cff08d', openClues, <Icon n="search" s={P(78)} />)}
// // // // // // // //         {costPill(152, 150, <Icon n="bulb" s={P(38)} />, String(COST_CLUE))}
// // // // // // // //         {circleBtn(388, '#f4e8d2', '#fff', watchVideo, <Icon n="film" s={P(92)} />)}
// // // // // // // //         {costPill(391, 162, <Coin s={P(30)} />, '+' + REWARD)}
// // // // // // // //         {circleBtn(637, '#ed434d', '#fff', () => setRiddle(true), <Icon n="play" s={P(80)} />)}
// // // // // // // //         {costPill(645, 151, <Icon n="bulb" s={P(38)} />, String(COST_SKIP))}

// // // // // // // //         {/* ---- clue popup (free, one clue only) ---- */}
// // // // // // // //         {clueOpen && (
// // // // // // // //           <>
// // // // // // // //             <Pressable onPress={() => setClueOpen(false)} style={[A(0, 0, DW, DH), { zIndex: 40, elevation: 40, backgroundColor: 'rgba(10,25,60,0.5)' }]} />
// // // // // // // //             <View style={[A(60, 430, 822, 560), { zIndex: 41, elevation: 41, borderRadius: P(56), backgroundColor: CREAM, borderWidth: P(14), borderColor: '#e0902f' }]}>
// // // // // // // //               <Text style={{ position: 'absolute', left: 0, right: 0, top: P(34), textAlign: 'center', fontFamily: F, fontSize: P(56), fontWeight: '900', color: NAVY, includeFontPadding: false }}>CLUES</Text>
// // // // // // // //               <Squish style={A(660, 22, 78, 78)} onPress={() => setClueOpen(false)}>
// // // // // // // //                 <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: '#fbde74', borderWidth: 2, borderColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' }}><Icon n="cross" s={P(40)} /></View>
// // // // // // // //               </Squish>

// // // // // // // //               <View style={[A(36, 130, 720, 330), { borderRadius: P(40), backgroundColor: '#ffffff', borderWidth: P(6), borderColor: GREEN, flexDirection: 'row', alignItems: 'center', paddingHorizontal: P(28), gap: P(24) }]}>
// // // // // // // //                 <View style={{ width: P(110), height: P(110), borderRadius: P(55), backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' }}>
// // // // // // // //                   <Text style={{ fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#fff', includeFontPadding: false }}>1</Text>
// // // // // // // //                 </View>
// // // // // // // //                 <View style={{ flex: 1 }}>
// // // // // // // //                   <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#bd6b29', includeFontPadding: false }}>Clue 1</Text>
// // // // // // // //                   <Text numberOfLines={7} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(32), lineHeight: P(41), color: '#17307a', marginTop: P(6) }}>{CLUE_TEXT}</Text>
// // // // // // // //                 </View>
// // // // // // // //               </View>
// // // // // // // //             </View>
// // // // // // // //           </>
// // // // // // // //         )}

// // // // // // // //         {/* ---- level complete ---- */}
// // // // // // // //         {!!result && (
// // // // // // // //           <View style={[A(0, 0, DW, DH), { zIndex: 60, elevation: 60, backgroundColor: 'rgba(10,25,60,0.55)', alignItems: 'center', justifyContent: 'center' }]}>
// // // // // // // //             <Animated.View style={{ width: P(702), alignItems: 'center', backgroundColor: CREAM, borderWidth: P(12), borderColor: '#e0902f', borderRadius: P(56), paddingVertical: P(44), paddingHorizontal: P(30), opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
// // // // // // // //               <Text style={{ fontFamily: F, fontSize: P(64), fontWeight: '900', color: NAVY }}>Level complete!</Text>
// // // // // // // //               <Text style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(38), color: '#17307a', textAlign: 'center', marginTop: P(10) }}>{result.message}</Text>
// // // // // // // //               <View style={{ flexDirection: 'row', gap: P(10), marginTop: P(26) }}>
// // // // // // // //                 {[1, 2, 3].map((c) => <StarIcon key={c} size={P(84)} on={c <= (result.stars || 0)} />)}
// // // // // // // //               </View>
// // // // // // // //               {!result.skipped && <Text style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#bd6b29', marginTop: P(18) }}>{'Score ' + result.score}</Text>}
// // // // // // // //               <TouchableOpacity activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}
// // // // // // // //                 style={{ marginTop: P(34), minWidth: P(320), height: P(104), borderRadius: P(52), backgroundColor: '#a4d732', borderWidth: P(8), borderColor: K, alignItems: 'center', justifyContent: 'center' }}>
// // // // // // // //                 <Text style={{ fontFamily: F, fontSize: P(54), fontWeight: '900', color: K }}>NEXT</Text>
// // // // // // // //               </TouchableOpacity>
// // // // // // // //             </Animated.View>
// // // // // // // //           </View>
// // // // // // // //         )}
// // // // // // // //       </View>
// // // // // // // //     </View>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // const st = StyleSheet.create({
// // // // // // // //   center: { alignItems: 'center', justifyContent: 'center' },
// // // // // // // //   loading: { fontFamily: F, fontSize: 18, color: NAVY, marginTop: 12 },
// // // // // // // //   errText: { fontFamily: F, fontSize: 18, color: NAVY, textAlign: 'center', paddingHorizontal: 24 },
// // // // // // // //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: '#a4d732', borderWidth: 2.5, borderColor: K },
// // // // // // // //   retryT: { fontFamily: F, fontSize: 20, fontWeight: '800', color: K },
// // // // // // // //   back: { fontFamily: F, fontSize: 16, color: NAVY, marginTop: 14, textDecorationLine: 'underline' },

// // // // // // // //   num: { fontFamily: F, fontWeight: '900', color: NAVY, textAlign: 'center', includeFontPadding: false },
// // // // // // // //   sym: { fontFamily: F, fontWeight: '900', color: ORANGE, textAlign: 'center', includeFontPadding: false },
// // // // // // // //   homeEmpty: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.25)' },
// // // // // // // //   slotRing: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.5)', backgroundColor: 'rgba(255,255,255,0.35)' },
// // // // // // // // });
// // // // // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // // // // import {
// // // // // // //   View, Text, Animated, PanResponder, Pressable, StyleSheet, Platform, Easing,
// // // // // // //   ActivityIndicator, TouchableOpacity, useWindowDimensions,
// // // // // // // } from 'react-native';
// // // // // // // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // // // // // // import { startLevel3, answerLevel3, rewardLevel3, Level3Start, Level3Answer, Sym } from './Btlevel3api';
// // // // // // // import { SpotScene } from './Btlevel3art';
// // // // // // // import { StarIcon } from './Btlevel2art';
// // // // // // // import { F, INK, Coin } from './BTShared';
// // // // // // // import { Icon } from './Art';
// // // // // // // import BTSkipRiddle from './BTSkipRiddle';
// // // // // // // import { play } from './BTSound';

// // // // // // // /**
// // // // // // //  * Level 3 - spot the differences, put + and − between 1 2 3.
// // // // // // //  * GARDEN THEME: blue sky, trees, fence, meadow, wooden signs and wooden bottom bar.
// // // // // // //  * No pencil / eraser on this screen.
// // // // // // //  */

// // // // // // // const NAVY = '#132f70', CREAM = '#faf0e2', K = '#1d1d1d', ORANGE = '#f5a623', GREEN = '#3ec75a';
// // // // // // // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });
// // // // // // // const DW = 942, DH = 1669;
// // // // // // // const SKY = '#5cc0f5', GRASS = '#74d13c';
// // // // // // // const WOOD = '#eba24e', WOOD_D = '#c2782c', WOOD_DD = '#8f5a1f';
// // // // // // // const COST_CLUE = 25, COST_SKIP = 50, REWARD = 75; // only shown on the pills

// // // // // // // // only one clue now
// // // // // // // const CLUE_TEXT = 'Sometimes, the smallest changes can make the biggest difference. Look closely at what’s missing between the numbers!';

// // // // // // // const LABEL: Record<Sym, string> = { '+': '+', '-': '−' };
// // // // // // // type Slots = (Sym | null)[];

// // // // // // // type Props = {
// // // // // // //   playerId: number;
// // // // // // //   onHints?: (h: number) => void;
// // // // // // //   onExit: () => void;
// // // // // // //   onComplete?: (result: Level3Answer) => void;
// // // // // // // };

// // // // // // // /* ---------- the garden scene ---------- */
// // // // // // // function Flower({ x, y, s = 1 }: any) {
// // // // // // //   return (
// // // // // // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // // // // //       {[0, 72, 144, 216, 288].map(a => (
// // // // // // //         <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
// // // // // // //       ))}
// // // // // // //       <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
// // // // // // //     </G>
// // // // // // //   );
// // // // // // // }

// // // // // // // function Tuft({ x, y }: any) {
// // // // // // //   return (
// // // // // // //     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
// // // // // // //       <Polygon points="-14,0 -8,-34 -2,0" />
// // // // // // //       <Polygon points="-4,0 4,-44 12,0" />
// // // // // // //       <Polygon points="8,0 18,-30 24,0" />
// // // // // // //     </G>
// // // // // // //   );
// // // // // // // }

// // // // // // // function Garden({ w, h }: any) {
// // // // // // //   return (
// // // // // // //     <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{ position: 'absolute', left: 0, top: 0 }}>
// // // // // // //       <Defs>
// // // // // // //         <LinearGradient id="g3sky" x1="0" y1="0" x2="0" y2="1">
// // // // // // //           <Stop offset="0" stopColor="#4fbaf7" />
// // // // // // //           <Stop offset="1" stopColor="#a8dcf8" />
// // // // // // //         </LinearGradient>
// // // // // // //         <LinearGradient id="g3grass" x1="0" y1="0" x2="0" y2="1">
// // // // // // //           <Stop offset="0" stopColor="#7ed63f" />
// // // // // // //           <Stop offset="1" stopColor="#6cc934" />
// // // // // // //         </LinearGradient>
// // // // // // //       </Defs>
// // // // // // //       <Rect width={DW} height={DH} fill="url(#g3sky)" />

// // // // // // //       {/* trees top corners */}
// // // // // // //       <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// // // // // // //       <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// // // // // // //       <Ellipse cx="860" cy="0" rx="190" ry="95" fill="#58b843" />
// // // // // // //       <Ellipse cx="800" cy="-20" rx="140" ry="85" fill="#66c64a" />

// // // // // // //       {/* clouds */}
// // // // // // //       <G fill="#fff" opacity="0.95">
// // // // // // //         <Ellipse cx="870" cy="215" rx="70" ry="26" /><Ellipse cx="845" cy="198" rx="40" ry="26" />
// // // // // // //         <Ellipse cx="40" cy="375" rx="62" ry="24" /><Ellipse cx="22" cy="360" rx="34" ry="22" />
// // // // // // //         <Ellipse cx="35" cy="985" rx="64" ry="26" /><Ellipse cx="60" cy="970" rx="34" ry="22" />
// // // // // // //       </G>

// // // // // // //       {/* bush on the left edge */}
// // // // // // //       <Ellipse cx="14" cy="520" rx="40" ry="90" fill="#6cbf3d" />
// // // // // // //       <Ellipse cx="926" cy="590" rx="30" ry="70" fill="#5fae38" />

// // // // // // //       {/* bookshelf (right) */}
// // // // // // //       <Rect x="775" y="620" width="167" height="545" fill="#e9ab5e" />
// // // // // // //       <Rect x="790" y="636" width="152" height="515" fill="#dc9d4f" />
// // // // // // //       <Rect x="775" y="800" width="167" height="12" fill="#f0bb75" />
// // // // // // //       <Rect x="775" y="950" width="167" height="12" fill="#f0bb75" />
// // // // // // //       <Rect x="895" y="676" width="30" height="110" fill="#8a63da" />
// // // // // // //       <Rect x="805" y="925" width="30" height="25" fill="#5b86d6" />
// // // // // // //       <Rect x="840" y="925" width="26" height="25" fill="#4db8b4" />
// // // // // // //       <Circle cx="826" cy="1030" r="18" fill="#c98a4b" /><Circle cx="884" cy="1030" r="18" fill="#c98a4b" /><Circle cx="855" cy="1065" r="40" fill="#c98a4b" />
// // // // // // //       <Rect x="868" y="1000" width="20" height="130" fill="#6cbf3d" transform="rotate(-8 879 1070)" />
// // // // // // //       <Rect x="882" y="1000" width="20" height="130" fill="#ef5a67" transform="rotate(10 891 1070)" />
// // // // // // //       <Rect x="904" y="998" width="18" height="130" fill="#8a63da" transform="rotate(22 912 1070)" />
// // // // // // //       <Rect x="850" y="1120" width="100" height="70" rx="10" fill="#f9cd3a" />

// // // // // // //       {/* hills behind fence */}
// // // // // // //       <Ellipse cx="120" cy="1190" rx="230" ry="130" fill="#5fb832" />
// // // // // // //       <Ellipse cx="470" cy="1215" rx="330" ry="110" fill="#6cc13a" />
// // // // // // //       <Ellipse cx="860" cy="1190" rx="220" ry="125" fill="#5fb832" />

// // // // // // //       {/* fence */}
// // // // // // //       <Rect x="0" y="1160" width={DW} height="22" fill="#e9b266" stroke="#c98a3e" strokeWidth="3" />
// // // // // // //       <Rect x="0" y="1208" width={DW} height="16" fill="#e9b266" stroke="#c98a3e" strokeWidth="3" />
// // // // // // //       {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
// // // // // // //         const x = 130 + i * 90;
// // // // // // //         return (
// // // // // // //           <G key={i}>
// // // // // // //             <Polygon points={`${x},1130 ${x + 33},1100 ${x + 66},1130`} fill="#eeb96d" stroke="#c98a3e" strokeWidth="3" />
// // // // // // //             <Rect x={x} y="1130" width="66" height="105" fill="#eeb96d" stroke="#c98a3e" strokeWidth="3" />
// // // // // // //             <Circle cx={x + 33} cy="1160" r="5" fill="#8f5a1f" />
// // // // // // //           </G>
// // // // // // //         );
// // // // // // //       })}

// // // // // // //       {/* toy bus (left) */}
// // // // // // //       <Rect x="0" y="1135" width="150" height="40" fill="#ef69b0" />
// // // // // // //       <Rect x="0" y="1175" width="155" height="34" fill="#f9d04c" />
// // // // // // //       <Rect x="0" y="1205" width="160" height="26" fill="#3aaeed" />
// // // // // // //       <Rect x="14" y="1212" width="120" height="48" rx="16" fill="#39aeec" />
// // // // // // //       <Rect x="50" y="1200" width="50" height="28" rx="10" fill="#7cc8f4" />
// // // // // // //       <Circle cx="34" cy="1268" r="15" fill="#27408b" /><Circle cx="96" cy="1268" r="15" fill="#27408b" />

// // // // // // //       {/* front meadow */}
// // // // // // //       <Path d={`M0 1285 C140 1215 300 1250 470 1240 C650 1228 800 1200 ${DW} 1180 L${DW} ${DH} L0 ${DH} Z`} fill="url(#g3grass)" />
// // // // // // //       <Path d={`M0 1300 C40 1280 80 1310 80 1380 L80 1500 L0 1500 Z`} fill="#5fb832" />

// // // // // // //       {/* rocks */}
// // // // // // //       <Ellipse cx="62" cy="1545" rx="68" ry="40" fill="#9b9b9b" />
// // // // // // //       <Ellipse cx="55" cy="1535" rx="50" ry="26" fill="#b4b4b4" />
// // // // // // //       <Ellipse cx="880" cy="1545" rx="68" ry="40" fill="#9b9b9b" />
// // // // // // //       <Ellipse cx="888" cy="1535" rx="50" ry="26" fill="#b4b4b4" />

// // // // // // //       {/* wooden bottom bar */}
// // // // // // //       <Rect x="72" y="1272" width="800" height="322" rx="100" fill="#eaa24f" stroke="#c2782c" strokeWidth="12" />
// // // // // // //       <Rect x="92" y="1292" width="760" height="282" rx="84" fill="none" stroke="#f5c07c" strokeWidth="4" opacity="0.8" />
// // // // // // //       <Path d="M130 1300 L800 1296 M120 1580 L820 1576" stroke="#c98a3e" strokeWidth="3" opacity="0.5" fill="none" />
// // // // // // //       <Circle cx="130" cy="1325" r="9" fill="#8f5a1f" /><Circle cx="814" cy="1325" r="9" fill="#8f5a1f" />
// // // // // // //       <Circle cx="124" cy="1502" r="9" fill="#8f5a1f" /><Circle cx="820" cy="1502" r="9" fill="#8f5a1f" />

// // // // // // //       {/* grass tufts + flowers */}
// // // // // // //       <Tuft x="905" y="1325" /><Tuft x="910" y="1450" /><Tuft x="20" y="1440" />
// // // // // // //       <Tuft x="100" y="1660" /><Tuft x="340" y="1660" /><Tuft x="580" y="1660" /><Tuft x="820" y="1660" />
// // // // // // //       <Flower x="866" y="1208" s={0.9} />
// // // // // // //       <Flower x="200" y="1590" s={0.95} />
// // // // // // //       <Flower x="735" y="1585" s={0.95} />
// // // // // // //     </Svg>
// // // // // // //   );
// // // // // // // }

// // // // // // // /* ---------- small chain for hanging signs ---------- */
// // // // // // // function Chain({ x, y, h, k }: any) {
// // // // // // //   return (
// // // // // // //     <View pointerEvents="none" style={{ position: 'absolute', left: x * k, top: y * k, width: 12 * k, height: h * k, borderRadius: 6 * k, backgroundColor: '#9a9a9a', borderWidth: Math.max(2, 3 * k), borderColor: '#4f4f4f' }} />
// // // // // // //   );
// // // // // // // }

// // // // // // // /* ---------- double arrow (skip icon) ---------- */
// // // // // // // function DoubleArrow({ s }: { s: number }) {
// // // // // // //   return (
// // // // // // //     <Svg width={s} height={s} viewBox="0 0 100 100">
// // // // // // //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // // // // // //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // // // // // //     </Svg>
// // // // // // //   );
// // // // // // // }

// // // // // // // /* ---------- squish on press ---------- */
// // // // // // // function Squish({ style, onPress, disabled, children }: any) {
// // // // // // //   const s = useRef(new Animated.Value(1)).current;
// // // // // // //   const to = (v: number) => Animated.spring(s, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
// // // // // // //   return (
// // // // // // //     <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.92)} onPressOut={() => to(1)} style={style}>
// // // // // // //       <Animated.View style={{ transform: [{ scale: s }] }}>{children}</Animated.View>
// // // // // // //     </Pressable>
// // // // // // //   );
// // // // // // // }

// // // // // // // /* ---------- one draggable symbol (+ or −) ---------- */
// // // // // // // function DragSymbol({ ch, size, disabled, onDrop }: {
// // // // // // //   ch: Sym; size: number; disabled: boolean;
// // // // // // //   onDrop: (ch: Sym, x: number, y: number) => Promise<boolean>;
// // // // // // // }) {
// // // // // // //   const pan = useRef(new Animated.ValueXY()).current;
// // // // // // //   const dropRef = useRef(onDrop);
// // // // // // //   const disRef = useRef(disabled);
// // // // // // //   dropRef.current = onDrop;
// // // // // // //   disRef.current = disabled;
// // // // // // //   const [drag, setDrag] = useState(false);

// // // // // // //   const back = () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();

// // // // // // //   const pr = useRef(PanResponder.create({
// // // // // // //     onStartShouldSetPanResponder: () => !disRef.current,
// // // // // // //     onPanResponderGrant: () => { setDrag(true); play('drag'); },
// // // // // // //     onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
// // // // // // //     onPanResponderRelease: async (_, g) => {
// // // // // // //       setDrag(false);
// // // // // // //       const ok = await dropRef.current(ch, g.moveX, g.moveY);
// // // // // // //       if (ok) pan.setValue({ x: 0, y: 0 }); else back();
// // // // // // //     },
// // // // // // //     onPanResponderTerminate: () => { setDrag(false); back(); },
// // // // // // //   })).current;

// // // // // // //   return (
// // // // // // //     <Animated.View
// // // // // // //       {...pr.panHandlers}
// // // // // // //       style={{
// // // // // // //         width: size, height: size, alignItems: 'center', justifyContent: 'center',
// // // // // // //         zIndex: drag ? 50 : 1, elevation: drag ? 20 : 0,
// // // // // // //         transform: pan.getTranslateTransform(),
// // // // // // //       }}
// // // // // // //     >
// // // // // // //       <Text style={[st.sym, { fontSize: size * 1.05, lineHeight: size * 1.15 }, drag && { color: GREEN }]}>{LABEL[ch]}</Text>
// // // // // // //     </Animated.View>
// // // // // // //   );
// // // // // // // }

// // // // // // // const measure = (ref: React.RefObject<any>) =>
// // // // // // //   new Promise<{ x: number; y: number; w: number; h: number } | null>((resolve) => {
// // // // // // //     const node: any = ref.current;
// // // // // // //     if (!node || !node.measureInWindow) return resolve(null);
// // // // // // //     node.measureInWindow((x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }));
// // // // // // //   });

// // // // // // // /* =====================  SCREEN  ===================== */
// // // // // // // export default function BTLevel3Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // // // // // //   const { width: winW, height: winH } = useWindowDimensions();
// // // // // // //   const box = { w: winW, h: winH };

// // // // // // //   const [data, setData] = useState<Level3Start | null>(null);
// // // // // // //   const [loadErr, setLoadErr] = useState('');
// // // // // // //   const [hints, setHints] = useState(0);
// // // // // // //   const [slots, setSlots] = useState<Slots>([null, null]);
// // // // // // //   const [fixed, setFixed] = useState<Slots>([null, null]);
// // // // // // //   const [msg, setMsg] = useState('');
// // // // // // //   const [busy, setBusy] = useState(false);
// // // // // // //   const [result, setResult] = useState<Level3Answer | null>(null);
// // // // // // //   const [riddle, setRiddle] = useState(false);
// // // // // // //   const [clueOpen, setClueOpen] = useState(false);

// // // // // // //   const slotsRef = useRef<Slots>([null, null]);
// // // // // // //   const fixedRef = useRef<Slots>([null, null]);
// // // // // // //   slotsRef.current = slots;
// // // // // // //   fixedRef.current = fixed;

// // // // // // //   const slotRef0 = useRef<View>(null);
// // // // // // //   const slotRef1 = useRef<View>(null);
// // // // // // //   const slotRefs = [slotRef0, slotRef1];

// // // // // // //   const shake = useRef(new Animated.Value(0)).current;
// // // // // // //   const sway = useRef(new Animated.Value(0)).current;
// // // // // // //   const pop = useRef(new Animated.Value(0)).current;
// // // // // // //   const msgTimer = useRef<any>(null);
// // // // // // //   const timers = useRef<any[]>([]);

// // // // // // //   useEffect(() => {
// // // // // // //     const a = Animated.loop(Animated.sequence([
// // // // // // //       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // // // //       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // // // //     ]));
// // // // // // //     a.start();
// // // // // // //     return () => a.stop();
// // // // // // //   }, []);

// // // // // // //   const readRevealed = (list: { slot: number; symbol: Sym }[] | undefined): Slots => {
// // // // // // //     const f: Slots = [null, null];
// // // // // // //     (list || []).forEach((r) => { if (r.slot === 0 || r.slot === 1) f[r.slot] = r.symbol; });
// // // // // // //     return f;
// // // // // // //   };

// // // // // // //   const load = useCallback(() => {
// // // // // // //     setLoadErr('');
// // // // // // //     setData(null);
// // // // // // //     startLevel3(playerId)
// // // // // // //       .then((d) => {
// // // // // // //         const f = readRevealed(d.revealed);
// // // // // // //         setData(d);
// // // // // // //         setHints(d.hints);
// // // // // // //         setFixed(f);
// // // // // // //         setSlots(f);
// // // // // // //       })
// // // // // // //       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
// // // // // // //   }, [playerId]);

// // // // // // //   useEffect(() => {
// // // // // // //     load();
// // // // // // //     return () => {
// // // // // // //       timers.current.forEach(clearTimeout);
// // // // // // //       clearTimeout(msgTimer.current);
// // // // // // //     };
// // // // // // //   }, [load]);

// // // // // // //   useEffect(() => {
// // // // // // //     if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
// // // // // // //   }, [result]);

// // // // // // //   useEffect(() => {
// // // // // // //     if (data) onHints?.(hints);
// // // // // // //   }, [hints, data]);

// // // // // // //   const showMsg = (m: string) => {
// // // // // // //     setMsg(m);
// // // // // // //     clearTimeout(msgTimer.current);
// // // // // // //     msgTimer.current = setTimeout(() => setMsg(''), 2600);
// // // // // // //   };

// // // // // // //   const shakeRow = () => {
// // // // // // //     Animated.sequence([
// // // // // // //       Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
// // // // // // //       Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
// // // // // // //       Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
// // // // // // //       Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
// // // // // // //     ]).start();
// // // // // // //   };

// // // // // // //   const submit = async (arr: Slots) => {
// // // // // // //     if (!data) return;
// // // // // // //     setBusy(true);
// // // // // // //     try {
// // // // // // //       const res = await answerLevel3({ sessionId: data.sessionId, playerId, symbols: arr as Sym[] });
// // // // // // //       if (!res.correct) {
// // // // // // //         play('wrong');
// // // // // // //         showMsg(res.message || 'Not quite. Try again!');
// // // // // // //         shakeRow();
// // // // // // //         timers.current.push(setTimeout(() => {
// // // // // // //           setSlots(fixedRef.current);
// // // // // // //           slotsRef.current = fixedRef.current;
// // // // // // //           setBusy(false);
// // // // // // //         }, 700));
// // // // // // //         return;
// // // // // // //       }
// // // // // // //       if (typeof res.hints === 'number') setHints(res.hints);
// // // // // // //       play('correct');
// // // // // // //       timers.current.push(setTimeout(() => setResult(res), 700));
// // // // // // //     } catch (e: any) {
// // // // // // //       showMsg(e.message || 'Network error');
// // // // // // //       setSlots(fixedRef.current);
// // // // // // //       setBusy(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleDrop = async (ch: Sym, px: number, py: number): Promise<boolean> => {
// // // // // // //     if (busy || !data || result) return false;

// // // // // // //     const rects = await Promise.all(slotRefs.map(measure));
// // // // // // //     let best = -1;
// // // // // // //     let bestD = Infinity;
// // // // // // //     rects.forEach((r, i) => {
// // // // // // //       if (!r) return;
// // // // // // //       const d = Math.hypot(px - (r.x + r.w / 2), py - (r.y + r.h / 2));
// // // // // // //       if (d < bestD) { bestD = d; best = i; }
// // // // // // //     });

// // // // // // //     const limit = Math.max(60, winW * 0.14);
// // // // // // //     if (best < 0 || bestD > limit) return false;
// // // // // // //     if (fixedRef.current[best]) return false;

// // // // // // //     const next: Slots = [...slotsRef.current];
// // // // // // //     next[best] = ch;
// // // // // // //     setSlots(next);
// // // // // // //     slotsRef.current = next;

// // // // // // //     if (next.every(Boolean)) submit(next);
// // // // // // //     return true;
// // // // // // //   };

// // // // // // //   const removeSlot = (i: number) => {
// // // // // // //     if (busy || result || fixedRef.current[i]) return;
// // // // // // //     setSlots((s) => { const n = [...s]; n[i] = null; return n; });
// // // // // // //   };

// // // // // // //   const watchVideo = async () => {
// // // // // // //     if (busy || result) return;
// // // // // // //     setBusy(true);
// // // // // // //     try {
// // // // // // //       const res = await rewardLevel3(playerId);
// // // // // // //       setHints(res.hints);
// // // // // // //       showMsg(`+${res.added} coins!`);
// // // // // // //     } catch (e: any) {
// // // // // // //       showMsg(e.message || 'Reward failed');
// // // // // // //     }
// // // // // // //     setBusy(false);
// // // // // // //   };

// // // // // // //   const openClues = () => { play('clue'); setClueOpen(true); };

// // // // // // //   const riddleSolved = async (): Promise<string> => {
// // // // // // //     setRiddle(false);
// // // // // // //     setResult({
// // // // // // //       success: true, correct: true, completed: true, skipped: true,
// // // // // // //       message: 'Level skipped!', score: 0, stars: 0,
// // // // // // //     });
// // // // // // //     return '';
// // // // // // //   };

// // // // // // //   /* ---------- loading / error ---------- */
// // // // // // //   if (loadErr || !data) {
// // // // // // //     return (
// // // // // // //       <View style={[st.center, { width: winW, height: winH, backgroundColor: SKY }]}>
// // // // // // //         {loadErr ? (
// // // // // // //           <>
// // // // // // //             <Text style={st.errText}>{loadErr}</Text>
// // // // // // //             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // // // // //             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // // // // //           </>
// // // // // // //         ) : (
// // // // // // //           <>
// // // // // // //             <ActivityIndicator color="#fff" size="large" />
// // // // // // //             <Text style={st.loading}>Loading level 3...</Text>
// // // // // // //           </>
// // // // // // //         )}
// // // // // // //       </View>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   /* ---------- skip riddle screen ---------- */
// // // // // // //   if (riddle) {
// // // // // // //     return (
// // // // // // //       <View style={{ width: winW, height: winH }}>
// // // // // // //         <BTSkipRiddle hints={hints} onHome={onExit} onBack={() => setRiddle(false)} onSkipped={riddleSolved} />
// // // // // // //       </View>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   // scale the 942x1669 design to the window
// // // // // // //   const bw = Math.min(box.w, (box.h * DW) / DH), k = bw / DW, bh = (bw * DH) / DW;
// // // // // // //   const top0 = (box.h - bh) / 2;
// // // // // // //   const P = (v: number) => v * k;
// // // // // // //   const A = (x: number, y: number, w: number, h: number): any => ({ position: 'absolute', left: P(x), top: P(y), width: P(w), height: P(h) });

// // // // // // //   const [n1, n2, n3] = data.numbers;
// // // // // // //   const u = P(112);
// // // // // // //   const gap = P(92);
// // // // // // //   const numStyle = [st.num, { fontSize: P(112), lineHeight: P(124), minWidth: P(70) }];
// // // // // // //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// // // // // // //   const home = (ch: Sym) =>
// // // // // // //     slots.includes(ch)
// // // // // // //       ? <View style={[st.homeEmpty, { width: u, height: u, borderRadius: u / 2 }]} />
// // // // // // //       : <DragSymbol ch={ch} size={u} disabled={busy || !!result} onDrop={handleDrop} />;

// // // // // // //   const gapView = (i: number) => (
// // // // // // //     <View ref={slotRefs[i]} collapsable={false} style={{ width: gap, height: u, alignItems: 'center', justifyContent: 'center' }}>
// // // // // // //       {slots[i] ? (
// // // // // // //         <TouchableOpacity activeOpacity={0.8} disabled={!!fixed[i] || busy || !!result} onPress={() => removeSlot(i)}>
// // // // // // //           <Text style={[st.sym, { fontSize: u * 1.05, lineHeight: u * 1.15 }]}>{LABEL[slots[i] as Sym]}</Text>
// // // // // // //         </TouchableOpacity>
// // // // // // //       ) : (
// // // // // // //         <View style={[st.slotRing, { width: gap * 0.72, height: gap * 0.72, borderRadius: gap }]} />
// // // // // // //       )}
// // // // // // //     </View>
// // // // // // //   );

// // // // // // //   const costPill = (x: number, w: number, icon: any, text: string) => (
// // // // // // //     <View style={[A(x, 1527, w, 67), { borderRadius: P(34), backgroundColor: '#6b4423', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10) }]}>
// // // // // // //       {icon}<Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{text}</Text>
// // // // // // //     </View>
// // // // // // //   );
// // // // // // //   const circleBtn = (x: number, bgc: string, bc: string, onPress: any, icon: any) => (
// // // // // // //     <Squish style={A(x, 1351, 166, 166)} onPress={onPress}>
// // // // // // //       <View style={{ width: P(166), height: P(166), borderRadius: P(83), backgroundColor: bgc, borderWidth: P(14), borderColor: bc, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>{icon}</View>
// // // // // // //     </Squish>
// // // // // // //   );
// // // // // // //   const woodBtn = (x: number, onPress: any, icon: any) => (
// // // // // // //     <Squish style={A(x, 111, 78, 78)} onPress={onPress}>
// // // // // // //       <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: WOOD, borderWidth: P(5), borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', elevation: 4 }}>{icon}</View>
// // // // // // //     </Squish>
// // // // // // //   );

// // // // // // //   return (
// // // // // // //     <View style={{ width: winW, height: winH, backgroundColor: SKY, overflow: 'hidden' }}>
// // // // // // //       {/* grass fill if the window is taller than the design */}
// // // // // // //       <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: top0 + P(1500), bottom: 0, backgroundColor: GRASS }} />

// // // // // // //       <View style={{ position: 'absolute', left: (box.w - bw) / 2, top: top0, width: bw, height: bh }}>
// // // // // // //         <Garden w={bw} h={bh} />

// // // // // // //         {/* top: home, settings */}
// // // // // // //         {woodBtn(27, onExit, <Icon n="home" s={P(42)} />)}
// // // // // // //         {woodBtn(119, undefined, <Icon n="gear" s={P(44)} />)}

// // // // // // //         {/* level sign (hangs on chains) */}
// // // // // // //         <Animated.View style={[A(300, 70, 346, 160), { transform: [{ rotate: swayR }] }]}>
// // // // // // //           <Chain x={52} y={0} h={50} k={k} />
// // // // // // //           <Chain x={282} y={0} h={50} k={k} />
// // // // // // //           <View style={{ position: 'absolute', left: 0, top: P(42), width: P(346), height: P(98), borderRadius: P(10), backgroundColor: '#bd6b29', borderWidth: P(6), borderColor: WOOD_DD, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
// // // // // // //             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10), flexWrap: 'nowrap' }}>
// // // // // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'<'}</Text>
// // // // // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{'LEVEL 3'}</Text>
// // // // // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'>'}</Text>
// // // // // // //             </View>
// // // // // // //           </View>
// // // // // // //         </Animated.View>

// // // // // // //         {/* bulbs counter */}
// // // // // // //         <View style={[A(728, 128, 142, 68), { borderRadius: P(34), backgroundColor: CREAM, borderWidth: P(4), borderColor: '#e6c690', justifyContent: 'center', paddingRight: P(26), alignItems: 'center', elevation: 4 }]}>
// // // // // // //           <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(44), fontWeight: '900', color: INK, includeFontPadding: false }}>{hints}</Text>
// // // // // // //         </View>
// // // // // // //         <View style={A(852, 118, 56, 56)}><Icon n="bulb" s={P(56)} /></View>

// // // // // // //         {/* question pill (2 lines) */}
// // // // // // //         <View style={[A(40, 262, 862, 150), { borderRadius: P(70), backgroundColor: CREAM, borderWidth: P(4), borderColor: '#ead2a4', alignItems: 'center', justifyContent: 'center', elevation: 4 }]}>
// // // // // // //           <Text style={{ position: 'absolute', left: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'<'}</Text>
// // // // // // //           <Text style={{ position: 'absolute', right: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'>'}</Text>
// // // // // // //           <Text numberOfLines={2} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(40), lineHeight: P(52), color: '#17307a', maxWidth: P(640), textAlign: 'center' }}>{data.question}</Text>
// // // // // // //         </View>

// // // // // // //         {/* wooden frames behind the two pictures */}
// // // // // // //         <View pointerEvents="none" style={[A(52, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />
// // // // // // //         <View pointerEvents="none" style={[A(482, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />

// // // // // // //         {/* the two pictures */}
// // // // // // //         <View style={A(66, 440, 380, 494)}><SpotScene side="a" width={P(380)} /></View>
// // // // // // //         <View style={A(496, 440, 380, 494)}><SpotScene side="b" width={P(380)} /></View>

// // // // // // //         {/* + 1 _ 2 _ 3 − */}
// // // // // // //         <Animated.View style={[A(0, 985, 942, 140), { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 10, elevation: 10, transform: [{ translateX: shake }] }]}>
// // // // // // //           {home('+')}
// // // // // // //           <Text style={numStyle}>{n1}</Text>
// // // // // // //           {gapView(0)}
// // // // // // //           <Text style={numStyle}>{n2}</Text>
// // // // // // //           {gapView(1)}
// // // // // // //           <Text style={numStyle}>{n3}</Text>
// // // // // // //           {home('-')}
// // // // // // //         </Animated.View>

// // // // // // //         {/* message line */}
// // // // // // //         {!!msg && (
// // // // // // //           <View pointerEvents="none" style={[A(60, 1170, 822, 68), { zIndex: 20, elevation: 20, alignItems: 'center', justifyContent: 'center' }]}>
// // // // // // //             <View style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: P(34), paddingHorizontal: P(34), paddingVertical: P(8) }}>
// // // // // // //               <Text numberOfLines={2} style={{ fontFamily: F, fontSize: P(34), fontWeight: 'bold', color: '#c0392b', textAlign: 'center' }}>{msg}</Text>
// // // // // // //             </View>
// // // // // // //           </View>
// // // // // // //         )}

// // // // // // //         {/* clue / video / skip */}
// // // // // // //         {circleBtn(143, '#a4e02a', '#f4f1dc', openClues, <Icon n="search" s={P(78)} />)}
// // // // // // //         {costPill(152, 150, <Icon n="bulb" s={P(38)} />, String(COST_CLUE))}
// // // // // // //         {circleBtn(388, '#f7ebd4', '#fbf3e3', watchVideo, <Icon n="film" s={P(92)} />)}
// // // // // // //         {costPill(391, 162, <Coin s={P(30)} />, '+' + REWARD)}
// // // // // // //         {circleBtn(637, '#f0434d', '#fbf3e3', () => setRiddle(true), <DoubleArrow s={P(86)} />)}
// // // // // // //         {costPill(645, 151, <Icon n="bulb" s={P(38)} />, String(COST_SKIP))}

// // // // // // //         {/* ---- clue popup (free, one clue only) ---- */}
// // // // // // //         {clueOpen && (
// // // // // // //           <>
// // // // // // //             <Pressable onPress={() => setClueOpen(false)} style={[A(0, 0, DW, DH), { zIndex: 40, elevation: 40, backgroundColor: 'rgba(10,25,60,0.5)' }]} />
// // // // // // //             <View style={[A(60, 430, 822, 560), { zIndex: 41, elevation: 41, borderRadius: P(56), backgroundColor: CREAM, borderWidth: P(14), borderColor: WOOD_D }]}>
// // // // // // //               <Text style={{ position: 'absolute', left: 0, right: 0, top: P(34), textAlign: 'center', fontFamily: F, fontSize: P(56), fontWeight: '900', color: NAVY, includeFontPadding: false }}>CLUES</Text>
// // // // // // //               <Squish style={A(660, 22, 78, 78)} onPress={() => setClueOpen(false)}>
// // // // // // //                 <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: WOOD, borderWidth: P(5), borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center' }}><Icon n="cross" s={P(40)} /></View>
// // // // // // //               </Squish>

// // // // // // //               <View style={[A(36, 130, 720, 330), { borderRadius: P(40), backgroundColor: '#ffffff', borderWidth: P(6), borderColor: GREEN, flexDirection: 'row', alignItems: 'center', paddingHorizontal: P(28), gap: P(24) }]}>
// // // // // // //                 <View style={{ width: P(110), height: P(110), borderRadius: P(55), backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' }}>
// // // // // // //                   <Text style={{ fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#fff', includeFontPadding: false }}>1</Text>
// // // // // // //                 </View>
// // // // // // //                 <View style={{ flex: 1 }}>
// // // // // // //                   <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#bd6b29', includeFontPadding: false }}>Clue 1</Text>
// // // // // // //                   <Text numberOfLines={7} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(32), lineHeight: P(41), color: '#17307a', marginTop: P(6) }}>{CLUE_TEXT}</Text>
// // // // // // //                 </View>
// // // // // // //               </View>
// // // // // // //             </View>
// // // // // // //           </>
// // // // // // //         )}

// // // // // // //         {/* ---- level complete ---- */}
// // // // // // //         {!!result && (
// // // // // // //           <View style={[A(0, 0, DW, DH), { zIndex: 60, elevation: 60, backgroundColor: 'rgba(10,25,60,0.55)', alignItems: 'center', justifyContent: 'center' }]}>
// // // // // // //             <Animated.View style={{ width: P(702), alignItems: 'center', backgroundColor: CREAM, borderWidth: P(12), borderColor: WOOD_D, borderRadius: P(56), paddingVertical: P(44), paddingHorizontal: P(30), opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
// // // // // // //               <Text style={{ fontFamily: F, fontSize: P(64), fontWeight: '900', color: NAVY }}>Level complete!</Text>
// // // // // // //               <Text style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(38), color: '#17307a', textAlign: 'center', marginTop: P(10) }}>{result.message}</Text>
// // // // // // //               <View style={{ flexDirection: 'row', gap: P(10), marginTop: P(26) }}>
// // // // // // //                 {[1, 2, 3].map((c) => <StarIcon key={c} size={P(84)} on={c <= (result.stars || 0)} />)}
// // // // // // //               </View>
// // // // // // //               {!result.skipped && <Text style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#bd6b29', marginTop: P(18) }}>{'Score ' + result.score}</Text>}
// // // // // // //               <TouchableOpacity activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}
// // // // // // //                 style={{ marginTop: P(34), minWidth: P(320), height: P(104), borderRadius: P(52), backgroundColor: '#a4d732', borderWidth: P(8), borderColor: K, alignItems: 'center', justifyContent: 'center' }}>
// // // // // // //                 <Text style={{ fontFamily: F, fontSize: P(54), fontWeight: '900', color: K }}>NEXT</Text>
// // // // // // //               </TouchableOpacity>
// // // // // // //             </Animated.View>
// // // // // // //           </View>
// // // // // // //         )}
// // // // // // //       </View>
// // // // // // //     </View>
// // // // // // //   );
// // // // // // // }

// // // // // // // const st = StyleSheet.create({
// // // // // // //   center: { alignItems: 'center', justifyContent: 'center' },
// // // // // // //   loading: { fontFamily: F, fontSize: 18, color: '#fff', marginTop: 12 },
// // // // // // //   errText: { fontFamily: F, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// // // // // // //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: '#a4d732', borderWidth: 2.5, borderColor: K },
// // // // // // //   retryT: { fontFamily: F, fontSize: 20, fontWeight: '800', color: K },
// // // // // // //   back: { fontFamily: F, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },

// // // // // // //   num: { fontFamily: F, fontWeight: '900', color: NAVY, textAlign: 'center', includeFontPadding: false },
// // // // // // //   sym: { fontFamily: F, fontWeight: '900', color: ORANGE, textAlign: 'center', includeFontPadding: false },
// // // // // // //   homeEmpty: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.25)' },
// // // // // // //   slotRing: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.5)', backgroundColor: 'rgba(255,255,255,0.35)' },
// // // // // // // });
// // // // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // // // import {
// // // // // //   View, Text, Animated, PanResponder, Pressable, StyleSheet, Platform, Easing,
// // // // // //   ActivityIndicator, TouchableOpacity, useWindowDimensions,
// // // // // // } from 'react-native';
// // // // // // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // // // // // import { startLevel3, answerLevel3, rewardLevel3, Level3Start, Level3Answer, Sym } from './Btlevel3api';
// // // // // // import { SpotScene } from './Btlevel3art';
// // // // // // import { StarIcon } from './Btlevel2art';
// // // // // // import { F, INK, Coin } from './BTShared';
// // // // // // import { Icon } from './Art';
// // // // // // import BTSkipRiddle from './BTSkipRiddle';
// // // // // // import { play } from './BTSound';

// // // // // // /**
// // // // // //  * Level 3 - spot the differences, put + and − between 1 2 3.
// // // // // //  * GARDEN THEME (matches Level 1): blue sky, trees, fence, sprout, bookshelf, meadow, wide wooden bottom bar.
// // // // // //  * No pencil / eraser on this screen.
// // // // // //  */

// // // // // // const NAVY = '#132f70', CREAM = '#faf0e2', K = '#1d1d1d', ORANGE = '#f5a623', GREEN = '#3ec75a';
// // // // // // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });
// // // // // // const DW = 942, DH = 1669;
// // // // // // const SKY = '#5cc0f5', GRASS = '#74d13c';
// // // // // // const WOOD = '#eba24e', WOOD_D = '#c2782c', WOOD_DD = '#8f5a1f';
// // // // // // const COST_CLUE = 25, COST_SKIP = 50, REWARD = 75; // only shown on the pills

// // // // // // // only one clue now
// // // // // // const CLUE_TEXT = 'Sometimes, the smallest changes can make the biggest difference. Look closely at what’s missing between the numbers!';

// // // // // // const LABEL: Record<Sym, string> = { '+': '+', '-': '−' };
// // // // // // type Slots = (Sym | null)[];

// // // // // // type Props = {
// // // // // //   playerId: number;
// // // // // //   onHints?: (h: number) => void;
// // // // // //   onExit: () => void;
// // // // // //   onComplete?: (result: Level3Answer) => void;
// // // // // // };

// // // // // // /* ---------- the garden scene ---------- */
// // // // // // function Flower({ x, y, s = 1 }: any) {
// // // // // //   return (
// // // // // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // // // //       {[0, 72, 144, 216, 288].map(a => (
// // // // // //         <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
// // // // // //       ))}
// // // // // //       <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
// // // // // //     </G>
// // // // // //   );
// // // // // // }

// // // // // // function Tuft({ x, y }: any) {
// // // // // //   return (
// // // // // //     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
// // // // // //       <Polygon points="-14,0 -8,-34 -2,0" />
// // // // // //       <Polygon points="-4,0 4,-44 12,0" />
// // // // // //       <Polygon points="8,0 18,-30 24,0" />
// // // // // //     </G>
// // // // // //   );
// // // // // // }

// // // // // // function Cloud({ x, y, s = 1 }: any) {
// // // // // //   return (
// // // // // //     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
// // // // // //       <Ellipse cx="0" cy="0" rx="70" ry="26" />
// // // // // //       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
// // // // // //       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
// // // // // //     </G>
// // // // // //   );
// // // // // // }

// // // // // // function Garden({ w, h }: any) {
// // // // // //   return (
// // // // // //     <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{ position: 'absolute', left: 0, top: 0 }}>
// // // // // //       <Defs>
// // // // // //         <LinearGradient id="g3sky" x1="0" y1="0" x2="0" y2="1">
// // // // // //           <Stop offset="0" stopColor="#46b6f3" />
// // // // // //           <Stop offset="1" stopColor="#c2e8fb" />
// // // // // //         </LinearGradient>
// // // // // //         <LinearGradient id="g3grass" x1="0" y1="0" x2="0" y2="1">
// // // // // //           <Stop offset="0" stopColor="#7ed63f" />
// // // // // //           <Stop offset="1" stopColor="#6cc934" />
// // // // // //         </LinearGradient>
// // // // // //         <LinearGradient id="g3wood" x1="0" y1="0" x2="0" y2="1">
// // // // // //           <Stop offset="0" stopColor="#f0a850" />
// // // // // //           <Stop offset="1" stopColor="#e69a3f" />
// // // // // //         </LinearGradient>
// // // // // //       </Defs>
// // // // // //       <Rect width={DW} height={DH} fill="url(#g3sky)" />

// // // // // //       {/* trees top corners */}
// // // // // //       <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// // // // // //       <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// // // // // //       <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
// // // // // //       <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />

// // // // // //       {/* clouds */}
// // // // // //       <Cloud x={850} y={245} s={1} />
// // // // // //       <Cloud x={50} y={985} s={0.9} />
// // // // // //       <Cloud x={880} y={1000} s={0.6} />

// // // // // //       {/* rolling hills */}
// // // // // //       <Ellipse cx="150" cy="1160" rx="300" ry="150" fill="#9ad95f" />
// // // // // //       <Ellipse cx="640" cy="1210" rx="420" ry="120" fill="#6cc13a" />
// // // // // //       <Ellipse cx="900" cy="1170" rx="200" ry="110" fill="#5fb832" />

// // // // // //       {/* fence: pickets first, rails in front */}
// // // // // //       {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
// // // // // //         const x = -10 + i * 90;
// // // // // //         return (
// // // // // //           <G key={i}>
// // // // // //             <Polygon points={`${x},1130 ${x + 33},1098 ${x + 66},1130`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // // // // //             <Rect x={x} y="1130" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // // // // //           </G>
// // // // // //         );
// // // // // //       })}
// // // // // //       <Rect x="0" y="1160" width={DW} height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
// // // // // //       <Rect x="0" y="1208" width={DW} height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

// // // // // //       {/* bookshelf (right) with potted plant */}
// // // // // //       <G>
// // // // // //         <Rect x="845" y="590" width="80" height="18" rx="4" fill="#e8903a" />
// // // // // //         <Polygon points="852,608 918,608 910,650 860,650" fill="#f0a050" />
// // // // // //         <G fill="#4cb04a">
// // // // // //           <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(-28 885 598)" />
// // // // // //           <Ellipse cx="885" cy="540" rx="20" ry="62" fill="#3a9a3c" />
// // // // // //           <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(28 885 598)" />
// // // // // //         </G>
// // // // // //         <Rect x="780" y="650" width="162" height="575" fill="#eaa24f" />
// // // // // //         <Rect x="796" y="666" width="146" height="545" fill="#dc9d4f" />
// // // // // //         <Rect x="780" y="840" width="162" height="16" fill="#f2b866" />
// // // // // //         <Rect x="780" y="1030" width="162" height="16" fill="#f2b866" />
// // // // // //         <Rect x="780" y="650" width="162" height="16" fill="#f2b866" />
// // // // // //         {/* row 1 */}
// // // // // //         <Rect x="810" y="710" width="36" height="130" fill="#2a9d9d" />
// // // // // //         <Rect x="850" y="690" width="34" height="150" fill="#f06ba8" />
// // // // // //         <Rect x="888" y="715" width="40" height="125" fill="#8a63da" />
// // // // // //         {/* row 2 */}
// // // // // //         <Rect x="805" y="915" width="30" height="115" fill="#e5484d" />
// // // // // //         <Rect x="840" y="890" width="24" height="140" fill="#3b82e0" />
// // // // // //         <Rect x="868" y="910" width="38" height="120" fill="#4caf50" />
// // // // // //         {/* row 3 */}
// // // // // //         <Rect x="810" y="1095" width="34" height="120" fill="#f5c518" />
// // // // // //         <Rect x="848" y="1065" width="40" height="150" fill="#2c6fdc" />
// // // // // //       </G>

// // // // // //       {/* sprout friend (left, from Level 1) */}
// // // // // //       <G>
// // // // // //         <G fill="#5cb85c">
// // // // // //           <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(-25 70 1198)" />
// // // // // //           <Ellipse cx="70" cy="1140" rx="22" ry="62" fill="#6cc56a" />
// // // // // //           <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(25 70 1198)" />
// // // // // //         </G>
// // // // // //         <Rect x="10" y="1195" width="120" height="78" rx="36" fill="#fdf1ea" />
// // // // // //         <Ellipse cx="38" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
// // // // // //         <Ellipse cx="102" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
// // // // // //         <Circle cx="55" cy="1230" r="4.5" fill="#3a2a2a" />
// // // // // //         <Circle cx="85" cy="1230" r="4.5" fill="#3a2a2a" />
// // // // // //         <Path d="M62 1243 Q70 1251 78 1243" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// // // // // //       </G>

// // // // // //       {/* front meadow */}
// // // // // //       <Path d={`M0 1285 C140 1230 300 1255 470 1245 C650 1233 800 1205 ${DW} 1185 L${DW} ${DH} L0 ${DH} Z`} fill="url(#g3grass)" />
// // // // // //       <Ellipse cx="300" cy="1330" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

// // // // // //       {/* stones */}
// // // // // //       <Ellipse cx="62" cy="1545" rx="68" ry="40" fill="#9b9b9b" />
// // // // // //       <Ellipse cx="55" cy="1535" rx="50" ry="26" fill="#b4b4b4" />
// // // // // //       <Ellipse cx="880" cy="1545" rx="68" ry="40" fill="#9b9b9b" />
// // // // // //       <Ellipse cx="888" cy="1535" rx="50" ry="26" fill="#b4b4b4" />

// // // // // //       {/* wooden bottom bar (wide, like Level 1) */}
// // // // // //       <Rect x="30" y="1290" width="882" height="312" rx="92" fill="url(#g3wood)" stroke="#c2782c" strokeWidth="12" />
// // // // // //       <Rect x="52" y="1312" width="838" height="268" rx="76" fill="none" stroke="#f5c07c" strokeWidth="4" opacity="0.8" />
// // // // // //       <Path d="M110 1330 C300 1322 600 1338 840 1326 M100 1445 C320 1452 620 1436 850 1448 M110 1565 C300 1558 600 1572 840 1562" stroke="#c98a3e" strokeWidth="3" opacity="0.4" fill="none" />
// // // // // //       <Circle cx="92" cy="1350" r="9" fill="#8f5a1f" /><Circle cx="850" cy="1350" r="9" fill="#8f5a1f" />
// // // // // //       <Circle cx="92" cy="1540" r="9" fill="#8f5a1f" /><Circle cx="850" cy="1540" r="9" fill="#8f5a1f" />

// // // // // //       {/* grass tufts + flowers */}
// // // // // //       <Tuft x="905" y="1325" /><Tuft x="910" y="1450" /><Tuft x="20" y="1440" />
// // // // // //       <Tuft x="100" y="1660" /><Tuft x="340" y="1660" /><Tuft x="580" y="1660" /><Tuft x="820" y="1660" />
// // // // // //       <Flower x="885" y="1215" s={0.8} />
// // // // // //       <Flower x="200" y="1625" s={0.95} />
// // // // // //       <Flower x="735" y="1625" s={0.95} />
// // // // // //     </Svg>
// // // // // //   );
// // // // // // }

// // // // // // /* ---------- thin link chain for hanging signs (Level 1 style) ---------- */
// // // // // // function Chain({ x, y, h, k }: any) {
// // // // // //   const n = Math.max(2, Math.round(h / 14));
// // // // // //   return (
// // // // // //     <Svg pointerEvents="none" width={12 * k} height={h * k} viewBox={`0 0 12 ${h}`} style={{ position: 'absolute', left: x * k, top: y * k }}>
// // // // // //       {Array.from({ length: n }).map((_, i) => (
// // // // // //         <Ellipse key={i} cx="6" cy={7 + i * (h / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// // // // // //       ))}
// // // // // //     </Svg>
// // // // // //   );
// // // // // // }

// // // // // // /* ---------- double arrow (skip icon) ---------- */
// // // // // // function DoubleArrow({ s }: { s: number }) {
// // // // // //   return (
// // // // // //     <Svg width={s} height={s} viewBox="0 0 100 100">
// // // // // //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // // // // //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // // // // //     </Svg>
// // // // // //   );
// // // // // // }

// // // // // // /* ---------- squish on press ---------- */
// // // // // // function Squish({ style, onPress, disabled, children }: any) {
// // // // // //   const s = useRef(new Animated.Value(1)).current;
// // // // // //   const to = (v: number) => Animated.spring(s, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
// // // // // //   return (
// // // // // //     <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.92)} onPressOut={() => to(1)} style={style}>
// // // // // //       <Animated.View style={{ transform: [{ scale: s }] }}>{children}</Animated.View>
// // // // // //     </Pressable>
// // // // // //   );
// // // // // // }

// // // // // // /* ---------- one draggable symbol (+ or −) ---------- */
// // // // // // function DragSymbol({ ch, size, disabled, onDrop }: {
// // // // // //   ch: Sym; size: number; disabled: boolean;
// // // // // //   onDrop: (ch: Sym, x: number, y: number) => Promise<boolean>;
// // // // // // }) {
// // // // // //   const pan = useRef(new Animated.ValueXY()).current;
// // // // // //   const dropRef = useRef(onDrop);
// // // // // //   const disRef = useRef(disabled);
// // // // // //   dropRef.current = onDrop;
// // // // // //   disRef.current = disabled;
// // // // // //   const [drag, setDrag] = useState(false);

// // // // // //   const back = () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();

// // // // // //   const pr = useRef(PanResponder.create({
// // // // // //     onStartShouldSetPanResponder: () => !disRef.current,
// // // // // //     onPanResponderGrant: () => { setDrag(true); play('drag'); },
// // // // // //     onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
// // // // // //     onPanResponderRelease: async (_, g) => {
// // // // // //       setDrag(false);
// // // // // //       const ok = await dropRef.current(ch, g.moveX, g.moveY);
// // // // // //       if (ok) pan.setValue({ x: 0, y: 0 }); else back();
// // // // // //     },
// // // // // //     onPanResponderTerminate: () => { setDrag(false); back(); },
// // // // // //   })).current;

// // // // // //   return (
// // // // // //     <Animated.View
// // // // // //       {...pr.panHandlers}
// // // // // //       style={{
// // // // // //         width: size, height: size, alignItems: 'center', justifyContent: 'center',
// // // // // //         zIndex: drag ? 50 : 1, elevation: drag ? 20 : 0,
// // // // // //         transform: pan.getTranslateTransform(),
// // // // // //       }}
// // // // // //     >
// // // // // //       <Text style={[st.sym, { fontSize: size * 1.05, lineHeight: size * 1.15 }, drag && { color: GREEN }]}>{LABEL[ch]}</Text>
// // // // // //     </Animated.View>
// // // // // //   );
// // // // // // }

// // // // // // const measure = (ref: React.RefObject<any>) =>
// // // // // //   new Promise<{ x: number; y: number; w: number; h: number } | null>((resolve) => {
// // // // // //     const node: any = ref.current;
// // // // // //     if (!node || !node.measureInWindow) return resolve(null);
// // // // // //     node.measureInWindow((x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }));
// // // // // //   });

// // // // // // /* =====================  SCREEN  ===================== */
// // // // // // export default function BTLevel3Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // // // // //   const { width: winW, height: winH } = useWindowDimensions();
// // // // // //   const box = { w: winW, h: winH };

// // // // // //   const [data, setData] = useState<Level3Start | null>(null);
// // // // // //   const [loadErr, setLoadErr] = useState('');
// // // // // //   const [hints, setHints] = useState(0);
// // // // // //   const [slots, setSlots] = useState<Slots>([null, null]);
// // // // // //   const [fixed, setFixed] = useState<Slots>([null, null]);
// // // // // //   const [msg, setMsg] = useState('');
// // // // // //   const [busy, setBusy] = useState(false);
// // // // // //   const [result, setResult] = useState<Level3Answer | null>(null);
// // // // // //   const [riddle, setRiddle] = useState(false);
// // // // // //   const [clueOpen, setClueOpen] = useState(false);

// // // // // //   const slotsRef = useRef<Slots>([null, null]);
// // // // // //   const fixedRef = useRef<Slots>([null, null]);
// // // // // //   slotsRef.current = slots;
// // // // // //   fixedRef.current = fixed;

// // // // // //   const slotRef0 = useRef<View>(null);
// // // // // //   const slotRef1 = useRef<View>(null);
// // // // // //   const slotRefs = [slotRef0, slotRef1];

// // // // // //   const shake = useRef(new Animated.Value(0)).current;
// // // // // //   const sway = useRef(new Animated.Value(0)).current;
// // // // // //   const pop = useRef(new Animated.Value(0)).current;
// // // // // //   const msgTimer = useRef<any>(null);
// // // // // //   const timers = useRef<any[]>([]);

// // // // // //   useEffect(() => {
// // // // // //     const a = Animated.loop(Animated.sequence([
// // // // // //       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // // //       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // // //     ]));
// // // // // //     a.start();
// // // // // //     return () => a.stop();
// // // // // //   }, []);

// // // // // //   const readRevealed = (list: { slot: number; symbol: Sym }[] | undefined): Slots => {
// // // // // //     const f: Slots = [null, null];
// // // // // //     (list || []).forEach((r) => { if (r.slot === 0 || r.slot === 1) f[r.slot] = r.symbol; });
// // // // // //     return f;
// // // // // //   };

// // // // // //   const load = useCallback(() => {
// // // // // //     setLoadErr('');
// // // // // //     setData(null);
// // // // // //     startLevel3(playerId)
// // // // // //       .then((d) => {
// // // // // //         const f = readRevealed(d.revealed);
// // // // // //         setData(d);
// // // // // //         setHints(d.hints);
// // // // // //         setFixed(f);
// // // // // //         setSlots(f);
// // // // // //       })
// // // // // //       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
// // // // // //   }, [playerId]);

// // // // // //   useEffect(() => {
// // // // // //     load();
// // // // // //     return () => {
// // // // // //       timers.current.forEach(clearTimeout);
// // // // // //       clearTimeout(msgTimer.current);
// // // // // //     };
// // // // // //   }, [load]);

// // // // // //   useEffect(() => {
// // // // // //     if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
// // // // // //   }, [result]);

// // // // // //   useEffect(() => {
// // // // // //     if (data) onHints?.(hints);
// // // // // //   }, [hints, data]);

// // // // // //   const showMsg = (m: string) => {
// // // // // //     setMsg(m);
// // // // // //     clearTimeout(msgTimer.current);
// // // // // //     msgTimer.current = setTimeout(() => setMsg(''), 2600);
// // // // // //   };

// // // // // //   const shakeRow = () => {
// // // // // //     Animated.sequence([
// // // // // //       Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
// // // // // //       Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
// // // // // //       Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
// // // // // //       Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
// // // // // //     ]).start();
// // // // // //   };

// // // // // //   const submit = async (arr: Slots) => {
// // // // // //     if (!data) return;
// // // // // //     setBusy(true);
// // // // // //     try {
// // // // // //       const res = await answerLevel3({ sessionId: data.sessionId, playerId, symbols: arr as Sym[] });
// // // // // //       if (!res.correct) {
// // // // // //         play('wrong');
// // // // // //         showMsg(res.message || 'Not quite. Try again!');
// // // // // //         shakeRow();
// // // // // //         timers.current.push(setTimeout(() => {
// // // // // //           setSlots(fixedRef.current);
// // // // // //           slotsRef.current = fixedRef.current;
// // // // // //           setBusy(false);
// // // // // //         }, 700));
// // // // // //         return;
// // // // // //       }
// // // // // //       if (typeof res.hints === 'number') setHints(res.hints);
// // // // // //       play('correct');
// // // // // //       timers.current.push(setTimeout(() => setResult(res), 700));
// // // // // //     } catch (e: any) {
// // // // // //       showMsg(e.message || 'Network error');
// // // // // //       setSlots(fixedRef.current);
// // // // // //       setBusy(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleDrop = async (ch: Sym, px: number, py: number): Promise<boolean> => {
// // // // // //     if (busy || !data || result) return false;

// // // // // //     const rects = await Promise.all(slotRefs.map(measure));
// // // // // //     let best = -1;
// // // // // //     let bestD = Infinity;
// // // // // //     rects.forEach((r, i) => {
// // // // // //       if (!r) return;
// // // // // //       const d = Math.hypot(px - (r.x + r.w / 2), py - (r.y + r.h / 2));
// // // // // //       if (d < bestD) { bestD = d; best = i; }
// // // // // //     });

// // // // // //     const limit = Math.max(60, winW * 0.14);
// // // // // //     if (best < 0 || bestD > limit) return false;
// // // // // //     if (fixedRef.current[best]) return false;

// // // // // //     const next: Slots = [...slotsRef.current];
// // // // // //     next[best] = ch;
// // // // // //     setSlots(next);
// // // // // //     slotsRef.current = next;

// // // // // //     if (next.every(Boolean)) submit(next);
// // // // // //     return true;
// // // // // //   };

// // // // // //   const removeSlot = (i: number) => {
// // // // // //     if (busy || result || fixedRef.current[i]) return;
// // // // // //     setSlots((s) => { const n = [...s]; n[i] = null; return n; });
// // // // // //   };

// // // // // //   const watchVideo = async () => {
// // // // // //     if (busy || result) return;
// // // // // //     setBusy(true);
// // // // // //     try {
// // // // // //       const res = await rewardLevel3(playerId);
// // // // // //       setHints(res.hints);
// // // // // //       showMsg(`+${res.added} coins!`);
// // // // // //     } catch (e: any) {
// // // // // //       showMsg(e.message || 'Reward failed');
// // // // // //     }
// // // // // //     setBusy(false);
// // // // // //   };

// // // // // //   const openClues = () => { play('clue'); setClueOpen(true); };

// // // // // //   const riddleSolved = async (): Promise<string> => {
// // // // // //     setRiddle(false);
// // // // // //     setResult({
// // // // // //       success: true, correct: true, completed: true, skipped: true,
// // // // // //       message: 'Level skipped!', score: 0, stars: 0,
// // // // // //     });
// // // // // //     return '';
// // // // // //   };

// // // // // //   /* ---------- loading / error ---------- */
// // // // // //   if (loadErr || !data) {
// // // // // //     return (
// // // // // //       <View style={[st.center, { width: winW, height: winH, backgroundColor: SKY }]}>
// // // // // //         {loadErr ? (
// // // // // //           <>
// // // // // //             <Text style={st.errText}>{loadErr}</Text>
// // // // // //             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // // // //             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // // // //           </>
// // // // // //         ) : (
// // // // // //           <>
// // // // // //             <ActivityIndicator color="#fff" size="large" />
// // // // // //             <Text style={st.loading}>Loading level 3...</Text>
// // // // // //           </>
// // // // // //         )}
// // // // // //       </View>
// // // // // //     );
// // // // // //   }

// // // // // //   /* ---------- skip riddle screen ---------- */
// // // // // //   if (riddle) {
// // // // // //     return (
// // // // // //       <View style={{ width: winW, height: winH }}>
// // // // // //         <BTSkipRiddle hints={hints} onHome={onExit} onBack={() => setRiddle(false)} onSkipped={riddleSolved} />
// // // // // //       </View>
// // // // // //     );
// // // // // //   }

// // // // // //   // scale the 942x1669 design to the window
// // // // // //   const bw = Math.min(box.w, (box.h * DW) / DH), k = bw / DW, bh = (bw * DH) / DW;
// // // // // //   const top0 = (box.h - bh) / 2;
// // // // // //   const P = (v: number) => v * k;
// // // // // //   const A = (x: number, y: number, w: number, h: number): any => ({ position: 'absolute', left: P(x), top: P(y), width: P(w), height: P(h) });

// // // // // //   const [n1, n2, n3] = data.numbers;
// // // // // //   const u = P(112);
// // // // // //   const gap = P(92);
// // // // // //   const numStyle = [st.num, { fontSize: P(112), lineHeight: P(124), minWidth: P(70) }];
// // // // // //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// // // // // //   const home = (ch: Sym) =>
// // // // // //     slots.includes(ch)
// // // // // //       ? <View style={[st.homeEmpty, { width: u, height: u, borderRadius: u / 2 }]} />
// // // // // //       : <DragSymbol ch={ch} size={u} disabled={busy || !!result} onDrop={handleDrop} />;

// // // // // //   const gapView = (i: number) => (
// // // // // //     <View ref={slotRefs[i]} collapsable={false} style={{ width: gap, height: u, alignItems: 'center', justifyContent: 'center' }}>
// // // // // //       {slots[i] ? (
// // // // // //         <TouchableOpacity activeOpacity={0.8} disabled={!!fixed[i] || busy || !!result} onPress={() => removeSlot(i)}>
// // // // // //           <Text style={[st.sym, { fontSize: u * 1.05, lineHeight: u * 1.15 }]}>{LABEL[slots[i] as Sym]}</Text>
// // // // // //         </TouchableOpacity>
// // // // // //       ) : (
// // // // // //         <View style={[st.slotRing, { width: gap * 0.72, height: gap * 0.72, borderRadius: gap }]} />
// // // // // //       )}
// // // // // //     </View>
// // // // // //   );

// // // // // //   const costPill = (x: number, w: number, icon: any, text: string) => (
// // // // // //     <View style={[A(x, 1527, w, 67), { borderRadius: P(34), backgroundColor: '#6b4423', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10) }]}>
// // // // // //       {icon}<Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{text}</Text>
// // // // // //     </View>
// // // // // //   );
// // // // // //   const circleBtn = (x: number, bgc: string, bc: string, onPress: any, icon: any) => (
// // // // // //     <Squish style={A(x, 1351, 166, 166)} onPress={onPress}>
// // // // // //       <View style={{ width: P(166), height: P(166), borderRadius: P(83), backgroundColor: bgc, borderWidth: P(14), borderColor: bc, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>{icon}</View>
// // // // // //     </Squish>
// // // // // //   );
// // // // // //   // yellow round buttons (home / settings), Level 1 style
// // // // // //   const woodBtn = (x: number, onPress: any, icon: any) => (
// // // // // //     <Squish style={A(x, 111, 78, 78)} onPress={onPress}>
// // // // // //       <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: '#fbc02d', borderWidth: P(5), borderColor: '#d98e1c', alignItems: 'center', justifyContent: 'center', elevation: 4 }}>{icon}</View>
// // // // // //     </Squish>
// // // // // //   );

// // // // // //   return (
// // // // // //     <View style={{ width: winW, height: winH, backgroundColor: SKY, overflow: 'hidden' }}>
// // // // // //       {/* grass fill if the window is taller than the design */}
// // // // // //       <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: top0 + P(1500), bottom: 0, backgroundColor: GRASS }} />

// // // // // //       <View style={{ position: 'absolute', left: (box.w - bw) / 2, top: top0, width: bw, height: bh }}>
// // // // // //         <Garden w={bw} h={bh} />

// // // // // //         {/* top: home, settings */}
// // // // // //         {woodBtn(27, onExit, <Icon n="home" s={P(42)} />)}
// // // // // //         {woodBtn(119, undefined, <Icon n="gear" s={P(44)} />)}

// // // // // //         {/* level sign (hangs on chains) */}
// // // // // //         <Animated.View style={[A(300, 70, 346, 160), { transform: [{ rotate: swayR }] }]}>
// // // // // //           <Chain x={52} y={0} h={50} k={k} />
// // // // // //           <Chain x={282} y={0} h={50} k={k} />
// // // // // //           <View style={{ position: 'absolute', left: 0, top: P(42), width: P(346), height: P(98), borderRadius: P(10), backgroundColor: '#bd6b29', borderWidth: P(6), borderColor: WOOD_DD, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
// // // // // //             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10), flexWrap: 'nowrap' }}>
// // // // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'<'}</Text>
// // // // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{'LEVEL 3'}</Text>
// // // // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'>'}</Text>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </Animated.View>

// // // // // //         {/* bulbs counter (dashed cloud pill) */}
// // // // // //         <View style={[A(728, 128, 142, 64), { borderRadius: P(32), backgroundColor: CREAM, borderWidth: P(3), borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingRight: P(26), alignItems: 'center', elevation: 4 }]}>
// // // // // //           <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(44), fontWeight: '900', color: INK, includeFontPadding: false }}>{hints}</Text>
// // // // // //         </View>
// // // // // //         <View style={A(846, 108, 68, 68)}><Icon n="bulb" s={P(68)} /></View>

// // // // // //         {/* question pill (2 lines) */}
// // // // // //         <View style={[A(40, 262, 862, 150), { borderRadius: P(70), backgroundColor: CREAM, borderWidth: P(4), borderColor: '#ead2a4', alignItems: 'center', justifyContent: 'center', elevation: 4 }]}>
// // // // // //           <Text style={{ position: 'absolute', left: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'<'}</Text>
// // // // // //           <Text style={{ position: 'absolute', right: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'>'}</Text>
// // // // // //           <Text numberOfLines={2} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(40), lineHeight: P(52), color: '#17307a', maxWidth: P(640), textAlign: 'center' }}>{data.question}</Text>
// // // // // //         </View>

// // // // // //         {/* wooden frames behind the two pictures */}
// // // // // //         <View pointerEvents="none" style={[A(52, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />
// // // // // //         <View pointerEvents="none" style={[A(482, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />

// // // // // //         {/* the two pictures */}
// // // // // //         <View style={A(66, 440, 380, 494)}><SpotScene side="a" width={P(380)} /></View>
// // // // // //         <View style={A(496, 440, 380, 494)}><SpotScene side="b" width={P(380)} /></View>

// // // // // //         {/* + 1 _ 2 _ 3 − */}
// // // // // //         <Animated.View style={[A(0, 985, 942, 140), { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 10, elevation: 10, transform: [{ translateX: shake }] }]}>
// // // // // //           {home('+')}
// // // // // //           <Text style={numStyle}>{n1}</Text>
// // // // // //           {gapView(0)}
// // // // // //           <Text style={numStyle}>{n2}</Text>
// // // // // //           {gapView(1)}
// // // // // //           <Text style={numStyle}>{n3}</Text>
// // // // // //           {home('-')}
// // // // // //         </Animated.View>

// // // // // //         {/* message line */}
// // // // // //         {!!msg && (
// // // // // //           <View pointerEvents="none" style={[A(60, 1170, 822, 68), { zIndex: 20, elevation: 20, alignItems: 'center', justifyContent: 'center' }]}>
// // // // // //             <View style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: P(34), paddingHorizontal: P(34), paddingVertical: P(8) }}>
// // // // // //               <Text numberOfLines={2} style={{ fontFamily: F, fontSize: P(34), fontWeight: 'bold', color: '#c0392b', textAlign: 'center' }}>{msg}</Text>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         )}

// // // // // //         {/* clue / video / skip */}
// // // // // //         {circleBtn(143, '#a4e02a', '#f4f1dc', openClues, <Icon n="search" s={P(78)} />)}
// // // // // //         {costPill(152, 150, <Icon n="bulb" s={P(38)} />, String(COST_CLUE))}
// // // // // //         {circleBtn(388, '#f7ebd4', '#fbf3e3', watchVideo, <Icon n="film" s={P(92)} />)}
// // // // // //         {costPill(391, 162, <Coin s={P(30)} />, '+' + REWARD)}
// // // // // //         {circleBtn(637, '#f0434d', '#fbf3e3', () => setRiddle(true), <DoubleArrow s={P(86)} />)}
// // // // // //         {costPill(645, 151, <Icon n="bulb" s={P(38)} />, String(COST_SKIP))}

// // // // // //         {/* ---- clue popup (free, one clue only) ---- */}
// // // // // //         {clueOpen && (
// // // // // //           <>
// // // // // //             <Pressable onPress={() => setClueOpen(false)} style={[A(0, 0, DW, DH), { zIndex: 40, elevation: 40, backgroundColor: 'rgba(10,25,60,0.5)' }]} />
// // // // // //             <View style={[A(60, 430, 822, 560), { zIndex: 41, elevation: 41, borderRadius: P(56), backgroundColor: CREAM, borderWidth: P(14), borderColor: WOOD_D }]}>
// // // // // //               <Text style={{ position: 'absolute', left: 0, right: 0, top: P(34), textAlign: 'center', fontFamily: F, fontSize: P(56), fontWeight: '900', color: NAVY, includeFontPadding: false }}>CLUES</Text>
// // // // // //               <Squish style={A(660, 22, 78, 78)} onPress={() => setClueOpen(false)}>
// // // // // //                 <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: WOOD, borderWidth: P(5), borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center' }}><Icon n="cross" s={P(40)} /></View>
// // // // // //               </Squish>

// // // // // //               <View style={[A(36, 130, 720, 330), { borderRadius: P(40), backgroundColor: '#ffffff', borderWidth: P(6), borderColor: GREEN, flexDirection: 'row', alignItems: 'center', paddingHorizontal: P(28), gap: P(24) }]}>
// // // // // //                 <View style={{ width: P(110), height: P(110), borderRadius: P(55), backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' }}>
// // // // // //                   <Text style={{ fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#fff', includeFontPadding: false }}>1</Text>
// // // // // //                 </View>
// // // // // //                 <View style={{ flex: 1 }}>
// // // // // //                   <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#bd6b29', includeFontPadding: false }}>Clue 1</Text>
// // // // // //                   <Text numberOfLines={7} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(32), lineHeight: P(41), color: '#17307a', marginTop: P(6) }}>{CLUE_TEXT}</Text>
// // // // // //                 </View>
// // // // // //               </View>
// // // // // //             </View>
// // // // // //           </>
// // // // // //         )}

// // // // // //         {/* ---- level complete ---- */}
// // // // // //         {!!result && (
// // // // // //           <View style={[A(0, 0, DW, DH), { zIndex: 60, elevation: 60, backgroundColor: 'rgba(10,25,60,0.55)', alignItems: 'center', justifyContent: 'center' }]}>
// // // // // //             <Animated.View style={{ width: P(702), alignItems: 'center', backgroundColor: CREAM, borderWidth: P(12), borderColor: WOOD_D, borderRadius: P(56), paddingVertical: P(44), paddingHorizontal: P(30), opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
// // // // // //               <Text style={{ fontFamily: F, fontSize: P(64), fontWeight: '900', color: NAVY }}>Level complete!</Text>
// // // // // //               <Text style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(38), color: '#17307a', textAlign: 'center', marginTop: P(10) }}>{result.message}</Text>
// // // // // //               <View style={{ flexDirection: 'row', gap: P(10), marginTop: P(26) }}>
// // // // // //                 {[1, 2, 3].map((c) => <StarIcon key={c} size={P(84)} on={c <= (result.stars || 0)} />)}
// // // // // //               </View>
// // // // // //               {!result.skipped && <Text style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#bd6b29', marginTop: P(18) }}>{'Score ' + result.score}</Text>}
// // // // // //               <TouchableOpacity activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}
// // // // // //                 style={{ marginTop: P(34), minWidth: P(320), height: P(104), borderRadius: P(52), backgroundColor: '#a4d732', borderWidth: P(8), borderColor: K, alignItems: 'center', justifyContent: 'center' }}>
// // // // // //                 <Text style={{ fontFamily: F, fontSize: P(54), fontWeight: '900', color: K }}>NEXT</Text>
// // // // // //               </TouchableOpacity>
// // // // // //             </Animated.View>
// // // // // //           </View>
// // // // // //         )}
// // // // // //       </View>
// // // // // //     </View>
// // // // // //   );
// // // // // // }

// // // // // // const st = StyleSheet.create({
// // // // // //   center: { alignItems: 'center', justifyContent: 'center' },
// // // // // //   loading: { fontFamily: F, fontSize: 18, color: '#fff', marginTop: 12 },
// // // // // //   errText: { fontFamily: F, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// // // // // //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: '#a4d732', borderWidth: 2.5, borderColor: K },
// // // // // //   retryT: { fontFamily: F, fontSize: 20, fontWeight: '800', color: K },
// // // // // //   back: { fontFamily: F, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },

// // // // // //   num: { fontFamily: F, fontWeight: '900', color: NAVY, textAlign: 'center', includeFontPadding: false },
// // // // // //   sym: { fontFamily: F, fontWeight: '900', color: ORANGE, textAlign: 'center', includeFontPadding: false },
// // // // // //   homeEmpty: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.25)' },
// // // // // //   slotRing: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.5)', backgroundColor: 'rgba(255,255,255,0.35)' },
// // // // // // });
// // // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // // import {
// // // // //   View, Text, Animated, PanResponder, Pressable, StyleSheet, Platform, Easing,
// // // // //   ActivityIndicator, TouchableOpacity, useWindowDimensions,
// // // // // } from 'react-native';
// // // // // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // // // // import { startLevel3, answerLevel3, rewardLevel3, Level3Start, Level3Answer, Sym } from './Btlevel3api';
// // // // // import { SpotScene } from './Btlevel3art';
// // // // // import { StarIcon } from './Btlevel2art';
// // // // // import { F, INK, Coin } from './BTShared';
// // // // // import { Icon } from './Art';
// // // // // import BTSkipRiddle from './BTSkipRiddle';
// // // // // import { play } from './BTSound';

// // // // // /**
// // // // //  * Level 3 - spot the differences, put + and − between 1 2 3.
// // // // //  * GARDEN THEME (matches Level 1): blue sky, trees, fence, sprout, bookshelf, meadow, wide wooden bottom bar.
// // // // //  * No pencil / eraser on this screen.
// // // // //  */

// // // // // const NAVY = '#132f70', CREAM = '#faf0e2', K = '#1d1d1d', ORANGE = '#f5a623', GREEN = '#3ec75a';
// // // // // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });
// // // // // const DW = 942, DH = 1669;
// // // // // const SKY = '#5cc0f5', GRASS = '#74d13c';
// // // // // const WOOD = '#eba24e', WOOD_D = '#c2782c', WOOD_DD = '#8f5a1f';
// // // // // const COST_CLUE = 25, COST_SKIP = 50, REWARD = 75; // only shown on the pills

// // // // // // only one clue now
// // // // // const CLUE_TEXT = 'Sometimes, the smallest changes can make the biggest difference. Look closely at what’s missing between the numbers!';

// // // // // const LABEL: Record<Sym, string> = { '+': '+', '-': '−' };
// // // // // type Slots = (Sym | null)[];

// // // // // type Props = {
// // // // //   playerId: number;
// // // // //   onHints?: (h: number) => void;
// // // // //   onExit: () => void;
// // // // //   onComplete?: (result: Level3Answer) => void;
// // // // // };

// // // // // /* ---------- the garden scene ---------- */
// // // // // function Flower({ x, y, s = 1 }: any) {
// // // // //   return (
// // // // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // // //       {[0, 72, 144, 216, 288].map(a => (
// // // // //         <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
// // // // //       ))}
// // // // //       <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
// // // // //     </G>
// // // // //   );
// // // // // }

// // // // // function Tuft({ x, y }: any) {
// // // // //   return (
// // // // //     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
// // // // //       <Polygon points="-14,0 -8,-34 -2,0" />
// // // // //       <Polygon points="-4,0 4,-44 12,0" />
// // // // //       <Polygon points="8,0 18,-30 24,0" />
// // // // //     </G>
// // // // //   );
// // // // // }

// // // // // function Cloud({ x, y, s = 1 }: any) {
// // // // //   return (
// // // // //     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
// // // // //       <Ellipse cx="0" cy="0" rx="70" ry="26" />
// // // // //       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
// // // // //       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
// // // // //     </G>
// // // // //   );
// // // // // }

// // // // // function Garden({ w, h }: any) {
// // // // //   return (
// // // // //     <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{ position: 'absolute', left: 0, top: 0 }}>
// // // // //       <Defs>
// // // // //         <LinearGradient id="g3sky" x1="0" y1="0" x2="0" y2="1">
// // // // //           <Stop offset="0" stopColor="#46b6f3" />
// // // // //           <Stop offset="1" stopColor="#c2e8fb" />
// // // // //         </LinearGradient>
// // // // //         <LinearGradient id="g3grass" x1="0" y1="0" x2="0" y2="1">
// // // // //           <Stop offset="0" stopColor="#7ed63f" />
// // // // //           <Stop offset="1" stopColor="#6cc934" />
// // // // //         </LinearGradient>
// // // // //         <LinearGradient id="g3wood" x1="0" y1="0" x2="0" y2="1">
// // // // //           <Stop offset="0" stopColor="#f0a850" />
// // // // //           <Stop offset="1" stopColor="#e69a3f" />
// // // // //         </LinearGradient>
// // // // //       </Defs>
// // // // //       <Rect width={DW} height={DH} fill="url(#g3sky)" />

// // // // //       {/* trees top corners */}
// // // // //       <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// // // // //       <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// // // // //       <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
// // // // //       <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />

// // // // //       {/* clouds */}
// // // // //       <Cloud x={850} y={245} s={1} />
// // // // //       <Cloud x={50} y={985} s={0.9} />
// // // // //       <Cloud x={880} y={1000} s={0.6} />

// // // // //       {/* rolling hills */}
// // // // //       <Ellipse cx="150" cy="1160" rx="300" ry="150" fill="#9ad95f" />
// // // // //       <Ellipse cx="640" cy="1210" rx="420" ry="120" fill="#6cc13a" />
// // // // //       <Ellipse cx="900" cy="1170" rx="200" ry="110" fill="#5fb832" />

// // // // //       {/* fence: pickets first, rails in front */}
// // // // //       {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
// // // // //         const x = -10 + i * 90;
// // // // //         return (
// // // // //           <G key={i}>
// // // // //             <Polygon points={`${x},1130 ${x + 33},1098 ${x + 66},1130`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // // // //             <Rect x={x} y="1130" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // // // //           </G>
// // // // //         );
// // // // //       })}
// // // // //       <Rect x="0" y="1160" width={DW} height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
// // // // //       <Rect x="0" y="1208" width={DW} height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

// // // // //       {/* bookshelf (right) with potted plant */}
// // // // //       <G>
// // // // //         <Rect x="845" y="590" width="80" height="18" rx="4" fill="#e8903a" />
// // // // //         <Polygon points="852,608 918,608 910,650 860,650" fill="#f0a050" />
// // // // //         <G fill="#4cb04a">
// // // // //           <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(-28 885 598)" />
// // // // //           <Ellipse cx="885" cy="540" rx="20" ry="62" fill="#3a9a3c" />
// // // // //           <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(28 885 598)" />
// // // // //         </G>
// // // // //         <Rect x="780" y="650" width="162" height="575" fill="#eaa24f" />
// // // // //         <Rect x="796" y="666" width="146" height="545" fill="#dc9d4f" />
// // // // //         <Rect x="780" y="840" width="162" height="16" fill="#f2b866" />
// // // // //         <Rect x="780" y="1030" width="162" height="16" fill="#f2b866" />
// // // // //         <Rect x="780" y="650" width="162" height="16" fill="#f2b866" />
// // // // //         {/* row 1 */}
// // // // //         <Rect x="810" y="710" width="36" height="130" fill="#2a9d9d" />
// // // // //         <Rect x="850" y="690" width="34" height="150" fill="#f06ba8" />
// // // // //         <Rect x="888" y="715" width="40" height="125" fill="#8a63da" />
// // // // //         {/* row 2 */}
// // // // //         <Rect x="805" y="915" width="30" height="115" fill="#e5484d" />
// // // // //         <Rect x="840" y="890" width="24" height="140" fill="#3b82e0" />
// // // // //         <Rect x="868" y="910" width="38" height="120" fill="#4caf50" />
// // // // //         {/* row 3 */}
// // // // //         <Rect x="810" y="1095" width="34" height="120" fill="#f5c518" />
// // // // //         <Rect x="848" y="1065" width="40" height="150" fill="#2c6fdc" />
// // // // //       </G>

// // // // //       {/* sprout friend (left, from Level 1) */}
// // // // //       <G>
// // // // //         <G fill="#5cb85c">
// // // // //           <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(-25 70 1198)" />
// // // // //           <Ellipse cx="70" cy="1140" rx="22" ry="62" fill="#6cc56a" />
// // // // //           <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(25 70 1198)" />
// // // // //         </G>
// // // // //         <Rect x="10" y="1195" width="120" height="78" rx="36" fill="#fdf1ea" />
// // // // //         <Ellipse cx="38" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
// // // // //         <Ellipse cx="102" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
// // // // //         <Circle cx="55" cy="1230" r="4.5" fill="#3a2a2a" />
// // // // //         <Circle cx="85" cy="1230" r="4.5" fill="#3a2a2a" />
// // // // //         <Path d="M62 1243 Q70 1251 78 1243" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// // // // //       </G>

// // // // //       {/* front meadow */}
// // // // //       <Path d={`M0 1285 C140 1230 300 1255 470 1245 C650 1233 800 1205 ${DW} 1185 L${DW} ${DH} L0 ${DH} Z`} fill="#74d13c" />
// // // // //       <Ellipse cx="300" cy="1330" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

// // // // //       {/* stones */}
// // // // //       <Ellipse cx="62" cy="1545" rx="68" ry="40" fill="#9b9b9b" />
// // // // //       <Ellipse cx="55" cy="1535" rx="50" ry="26" fill="#b4b4b4" />
// // // // //       <Ellipse cx="880" cy="1545" rx="68" ry="40" fill="#9b9b9b" />
// // // // //       <Ellipse cx="888" cy="1535" rx="50" ry="26" fill="#b4b4b4" />

// // // // //       {/* wooden bottom bar (wide, like Level 1) */}
// // // // //       <Rect x="28" y="1290" width="886" height="312" rx="92" fill="#eaa24f" stroke="#c2782c" strokeWidth="12" />
// // // // //       <Path d="M70 1340 C300 1332 620 1346 872 1334 M60 1445 C320 1452 640 1436 882 1448 M70 1555 C300 1548 620 1562 872 1552" stroke="#d58f3a" strokeWidth="5" opacity="0.7" fill="none" strokeLinecap="round" />
// // // // //       <Path d="M110 1318 C320 1312 620 1324 832 1314" stroke="#f5c07c" strokeWidth="4" opacity="0.8" fill="none" strokeLinecap="round" />
// // // // //       <Circle cx="82" cy="1335" r="9" fill="#8f5a1f" /><Circle cx="860" cy="1335" r="9" fill="#8f5a1f" />
// // // // //       <Circle cx="82" cy="1556" r="9" fill="#8f5a1f" /><Circle cx="860" cy="1556" r="9" fill="#8f5a1f" />

// // // // //       {/* grass tufts + flowers */}
// // // // //       <Tuft x="905" y="1325" /><Tuft x="910" y="1450" /><Tuft x="20" y="1440" />
// // // // //       <Tuft x="100" y="1660" /><Tuft x="340" y="1660" /><Tuft x="580" y="1660" /><Tuft x="820" y="1660" />
// // // // //       <Flower x="885" y="1215" s={0.8} />
// // // // //       <Flower x="200" y="1625" s={0.95} />
// // // // //       <Flower x="735" y="1625" s={0.95} />
// // // // //     </Svg>
// // // // //   );
// // // // // }

// // // // // /* ---------- thin link chain for hanging signs (Level 1 style) ---------- */
// // // // // function Chain({ x, y, h, k }: any) {
// // // // //   const n = Math.max(2, Math.round(h / 14));
// // // // //   return (
// // // // //     <Svg pointerEvents="none" width={12 * k} height={h * k} viewBox={`0 0 12 ${h}`} style={{ position: 'absolute', left: x * k, top: y * k }}>
// // // // //       {Array.from({ length: n }).map((_, i) => (
// // // // //         <Ellipse key={i} cx="6" cy={7 + i * (h / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// // // // //       ))}
// // // // //     </Svg>
// // // // //   );
// // // // // }

// // // // // /* ---------- double arrow (skip icon) ---------- */
// // // // // function DoubleArrow({ s }: { s: number }) {
// // // // //   return (
// // // // //     <Svg width={s} height={s} viewBox="0 0 100 100">
// // // // //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // // // //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // // // //     </Svg>
// // // // //   );
// // // // // }

// // // // // /* ---------- squish on press ---------- */
// // // // // function Squish({ style, onPress, disabled, children }: any) {
// // // // //   const s = useRef(new Animated.Value(1)).current;
// // // // //   const to = (v: number) => Animated.spring(s, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
// // // // //   return (
// // // // //     <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.92)} onPressOut={() => to(1)} style={style}>
// // // // //       <Animated.View style={{ transform: [{ scale: s }] }}>{children}</Animated.View>
// // // // //     </Pressable>
// // // // //   );
// // // // // }

// // // // // /* ---------- one draggable symbol (+ or −) ---------- */
// // // // // function DragSymbol({ ch, size, disabled, onDrop }: {
// // // // //   ch: Sym; size: number; disabled: boolean;
// // // // //   onDrop: (ch: Sym, x: number, y: number) => Promise<boolean>;
// // // // // }) {
// // // // //   const pan = useRef(new Animated.ValueXY()).current;
// // // // //   const dropRef = useRef(onDrop);
// // // // //   const disRef = useRef(disabled);
// // // // //   dropRef.current = onDrop;
// // // // //   disRef.current = disabled;
// // // // //   const [drag, setDrag] = useState(false);

// // // // //   const back = () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();

// // // // //   const pr = useRef(PanResponder.create({
// // // // //     onStartShouldSetPanResponder: () => !disRef.current,
// // // // //     onPanResponderGrant: () => { setDrag(true); play('drag'); },
// // // // //     onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
// // // // //     onPanResponderRelease: async (_, g) => {
// // // // //       setDrag(false);
// // // // //       const ok = await dropRef.current(ch, g.moveX, g.moveY);
// // // // //       if (ok) pan.setValue({ x: 0, y: 0 }); else back();
// // // // //     },
// // // // //     onPanResponderTerminate: () => { setDrag(false); back(); },
// // // // //   })).current;

// // // // //   return (
// // // // //     <Animated.View
// // // // //       {...pr.panHandlers}
// // // // //       style={{
// // // // //         width: size, height: size, alignItems: 'center', justifyContent: 'center',
// // // // //         zIndex: drag ? 50 : 1, elevation: drag ? 20 : 0,
// // // // //         transform: pan.getTranslateTransform(),
// // // // //       }}
// // // // //     >
// // // // //       <Text style={[st.sym, { fontSize: size * 1.05, lineHeight: size * 1.15 }, drag && { color: GREEN }]}>{LABEL[ch]}</Text>
// // // // //     </Animated.View>
// // // // //   );
// // // // // }

// // // // // const measure = (ref: React.RefObject<any>) =>
// // // // //   new Promise<{ x: number; y: number; w: number; h: number } | null>((resolve) => {
// // // // //     const node: any = ref.current;
// // // // //     if (!node || !node.measureInWindow) return resolve(null);
// // // // //     node.measureInWindow((x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }));
// // // // //   });

// // // // // /* =====================  SCREEN  ===================== */
// // // // // export default function BTLevel3Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // // // //   const { width: winW, height: winH } = useWindowDimensions();
// // // // //   const box = { w: winW, h: winH };

// // // // //   const [data, setData] = useState<Level3Start | null>(null);
// // // // //   const [loadErr, setLoadErr] = useState('');
// // // // //   const [hints, setHints] = useState(0);
// // // // //   const [slots, setSlots] = useState<Slots>([null, null]);
// // // // //   const [fixed, setFixed] = useState<Slots>([null, null]);
// // // // //   const [msg, setMsg] = useState('');
// // // // //   const [busy, setBusy] = useState(false);
// // // // //   const [result, setResult] = useState<Level3Answer | null>(null);
// // // // //   const [riddle, setRiddle] = useState(false);
// // // // //   const [clueOpen, setClueOpen] = useState(false);

// // // // //   const slotsRef = useRef<Slots>([null, null]);
// // // // //   const fixedRef = useRef<Slots>([null, null]);
// // // // //   slotsRef.current = slots;
// // // // //   fixedRef.current = fixed;

// // // // //   const slotRef0 = useRef<View>(null);
// // // // //   const slotRef1 = useRef<View>(null);
// // // // //   const slotRefs = [slotRef0, slotRef1];

// // // // //   const shake = useRef(new Animated.Value(0)).current;
// // // // //   const sway = useRef(new Animated.Value(0)).current;
// // // // //   const pop = useRef(new Animated.Value(0)).current;
// // // // //   const msgTimer = useRef<any>(null);
// // // // //   const timers = useRef<any[]>([]);

// // // // //   useEffect(() => {
// // // // //     const a = Animated.loop(Animated.sequence([
// // // // //       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // //       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // //     ]));
// // // // //     a.start();
// // // // //     return () => a.stop();
// // // // //   }, []);

// // // // //   const readRevealed = (list: { slot: number; symbol: Sym }[] | undefined): Slots => {
// // // // //     const f: Slots = [null, null];
// // // // //     (list || []).forEach((r) => { if (r.slot === 0 || r.slot === 1) f[r.slot] = r.symbol; });
// // // // //     return f;
// // // // //   };

// // // // //   const load = useCallback(() => {
// // // // //     setLoadErr('');
// // // // //     setData(null);
// // // // //     startLevel3(playerId)
// // // // //       .then((d) => {
// // // // //         const f = readRevealed(d.revealed);
// // // // //         setData(d);
// // // // //         setHints(d.hints);
// // // // //         setFixed(f);
// // // // //         setSlots(f);
// // // // //       })
// // // // //       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
// // // // //   }, [playerId]);

// // // // //   useEffect(() => {
// // // // //     load();
// // // // //     return () => {
// // // // //       timers.current.forEach(clearTimeout);
// // // // //       clearTimeout(msgTimer.current);
// // // // //     };
// // // // //   }, [load]);

// // // // //   useEffect(() => {
// // // // //     if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
// // // // //   }, [result]);

// // // // //   useEffect(() => {
// // // // //     if (data) onHints?.(hints);
// // // // //   }, [hints, data]);

// // // // //   const showMsg = (m: string) => {
// // // // //     setMsg(m);
// // // // //     clearTimeout(msgTimer.current);
// // // // //     msgTimer.current = setTimeout(() => setMsg(''), 2600);
// // // // //   };

// // // // //   const shakeRow = () => {
// // // // //     Animated.sequence([
// // // // //       Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
// // // // //       Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
// // // // //       Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
// // // // //       Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
// // // // //     ]).start();
// // // // //   };

// // // // //   const submit = async (arr: Slots) => {
// // // // //     if (!data) return;
// // // // //     setBusy(true);
// // // // //     try {
// // // // //       const res = await answerLevel3({ sessionId: data.sessionId, playerId, symbols: arr as Sym[] });
// // // // //       if (!res.correct) {
// // // // //         play('wrong');
// // // // //         showMsg(res.message || 'Not quite. Try again!');
// // // // //         shakeRow();
// // // // //         timers.current.push(setTimeout(() => {
// // // // //           setSlots(fixedRef.current);
// // // // //           slotsRef.current = fixedRef.current;
// // // // //           setBusy(false);
// // // // //         }, 700));
// // // // //         return;
// // // // //       }
// // // // //       if (typeof res.hints === 'number') setHints(res.hints);
// // // // //       play('correct');
// // // // //       timers.current.push(setTimeout(() => setResult(res), 700));
// // // // //     } catch (e: any) {
// // // // //       showMsg(e.message || 'Network error');
// // // // //       setSlots(fixedRef.current);
// // // // //       setBusy(false);
// // // // //     }
// // // // //   };

// // // // //   const handleDrop = async (ch: Sym, px: number, py: number): Promise<boolean> => {
// // // // //     if (busy || !data || result) return false;

// // // // //     const rects = await Promise.all(slotRefs.map(measure));
// // // // //     let best = -1;
// // // // //     let bestD = Infinity;
// // // // //     rects.forEach((r, i) => {
// // // // //       if (!r) return;
// // // // //       const d = Math.hypot(px - (r.x + r.w / 2), py - (r.y + r.h / 2));
// // // // //       if (d < bestD) { bestD = d; best = i; }
// // // // //     });

// // // // //     const limit = Math.max(60, winW * 0.14);
// // // // //     if (best < 0 || bestD > limit) return false;
// // // // //     if (fixedRef.current[best]) return false;

// // // // //     const next: Slots = [...slotsRef.current];
// // // // //     next[best] = ch;
// // // // //     setSlots(next);
// // // // //     slotsRef.current = next;

// // // // //     if (next.every(Boolean)) submit(next);
// // // // //     return true;
// // // // //   };

// // // // //   const removeSlot = (i: number) => {
// // // // //     if (busy || result || fixedRef.current[i]) return;
// // // // //     setSlots((s) => { const n = [...s]; n[i] = null; return n; });
// // // // //   };

// // // // //   const watchVideo = async () => {
// // // // //     if (busy || result) return;
// // // // //     setBusy(true);
// // // // //     try {
// // // // //       const res = await rewardLevel3(playerId);
// // // // //       setHints(res.hints);
// // // // //       showMsg(`+${res.added} coins!`);
// // // // //     } catch (e: any) {
// // // // //       showMsg(e.message || 'Reward failed');
// // // // //     }
// // // // //     setBusy(false);
// // // // //   };

// // // // //   const openClues = () => { play('clue'); setClueOpen(true); };

// // // // //   const riddleSolved = async (): Promise<string> => {
// // // // //     setRiddle(false);
// // // // //     setResult({
// // // // //       success: true, correct: true, completed: true, skipped: true,
// // // // //       message: 'Level skipped!', score: 0, stars: 0,
// // // // //     });
// // // // //     return '';
// // // // //   };

// // // // //   /* ---------- loading / error ---------- */
// // // // //   if (loadErr || !data) {
// // // // //     return (
// // // // //       <View style={[st.center, { width: winW, height: winH, backgroundColor: SKY }]}>
// // // // //         {loadErr ? (
// // // // //           <>
// // // // //             <Text style={st.errText}>{loadErr}</Text>
// // // // //             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // // //             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // // //           </>
// // // // //         ) : (
// // // // //           <>
// // // // //             <ActivityIndicator color="#fff" size="large" />
// // // // //             <Text style={st.loading}>Loading level 3...</Text>
// // // // //           </>
// // // // //         )}
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   /* ---------- skip riddle screen ---------- */
// // // // //   if (riddle) {
// // // // //     return (
// // // // //       <View style={{ width: winW, height: winH }}>
// // // // //         <BTSkipRiddle hints={hints} onHome={onExit} onBack={() => setRiddle(false)} onSkipped={riddleSolved} />
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   // scale the 942x1669 design to the window
// // // // //   const bw = Math.min(box.w, (box.h * DW) / DH), k = bw / DW, bh = (bw * DH) / DW;
// // // // //   const top0 = (box.h - bh) / 2;
// // // // //   const P = (v: number) => v * k;
// // // // //   const A = (x: number, y: number, w: number, h: number): any => ({ position: 'absolute', left: P(x), top: P(y), width: P(w), height: P(h) });

// // // // //   const [n1, n2, n3] = data.numbers;
// // // // //   const u = P(112);
// // // // //   const gap = P(92);
// // // // //   const numStyle = [st.num, { fontSize: P(112), lineHeight: P(124), minWidth: P(70) }];
// // // // //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// // // // //   const home = (ch: Sym) =>
// // // // //     slots.includes(ch)
// // // // //       ? <View style={[st.homeEmpty, { width: u, height: u, borderRadius: u / 2 }]} />
// // // // //       : <DragSymbol ch={ch} size={u} disabled={busy || !!result} onDrop={handleDrop} />;

// // // // //   const gapView = (i: number) => (
// // // // //     <View ref={slotRefs[i]} collapsable={false} style={{ width: gap, height: u, alignItems: 'center', justifyContent: 'center' }}>
// // // // //       {slots[i] ? (
// // // // //         <TouchableOpacity activeOpacity={0.8} disabled={!!fixed[i] || busy || !!result} onPress={() => removeSlot(i)}>
// // // // //           <Text style={[st.sym, { fontSize: u * 1.05, lineHeight: u * 1.15 }]}>{LABEL[slots[i] as Sym]}</Text>
// // // // //         </TouchableOpacity>
// // // // //       ) : (
// // // // //         <View style={[st.slotRing, { width: gap * 0.72, height: gap * 0.72, borderRadius: gap }]} />
// // // // //       )}
// // // // //     </View>
// // // // //   );

// // // // //   const costPill = (x: number, w: number, icon: any, text: string) => (
// // // // //     <View style={[A(x, 1527, w, 67), { borderRadius: P(34), backgroundColor: '#6b4423', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10) }]}>
// // // // //       {icon}<Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{text}</Text>
// // // // //     </View>
// // // // //   );
// // // // //   const circleBtn = (x: number, bgc: string, bc: string, onPress: any, icon: any) => (
// // // // //     <Squish style={A(x, 1351, 166, 166)} onPress={onPress}>
// // // // //       <View style={{ width: P(166), height: P(166), borderRadius: P(83), backgroundColor: bgc, borderWidth: P(14), borderColor: bc, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>{icon}</View>
// // // // //     </Squish>
// // // // //   );
// // // // //   // yellow round buttons (home / settings), Level 1 style
// // // // //   const woodBtn = (x: number, onPress: any, icon: any) => (
// // // // //     <Squish style={A(x, 111, 78, 78)} onPress={onPress}>
// // // // //       <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: '#fbc02d', borderWidth: P(5), borderColor: '#d98e1c', alignItems: 'center', justifyContent: 'center', elevation: 4 }}>{icon}</View>
// // // // //     </Squish>
// // // // //   );

// // // // //   return (
// // // // //     <View style={{ width: winW, height: winH, backgroundColor: SKY, overflow: 'hidden' }}>
// // // // //       {/* grass fill if the window is taller than the design */}
// // // // //       <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: top0 + P(1500), bottom: 0, backgroundColor: GRASS }} />

// // // // //       <View style={{ position: 'absolute', left: (box.w - bw) / 2, top: top0, width: bw, height: bh }}>
// // // // //         <Garden w={bw} h={bh} />

// // // // //         {/* top: home, settings */}
// // // // //         {woodBtn(27, onExit, <Icon n="home" s={P(42)} />)}
// // // // //         {woodBtn(119, undefined, <Icon n="gear" s={P(44)} />)}

// // // // //         {/* level sign (hangs on chains) */}
// // // // //         <Animated.View style={[A(300, 70, 346, 160), { transform: [{ rotate: swayR }] }]}>
// // // // //           <Chain x={52} y={0} h={50} k={k} />
// // // // //           <Chain x={282} y={0} h={50} k={k} />
// // // // //           <View style={{ position: 'absolute', left: 0, top: P(42), width: P(346), height: P(98), borderRadius: P(10), backgroundColor: '#bd6b29', borderWidth: P(6), borderColor: WOOD_DD, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
// // // // //             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10), flexWrap: 'nowrap' }}>
// // // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'<'}</Text>
// // // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{'LEVEL 3'}</Text>
// // // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'>'}</Text>
// // // // //             </View>
// // // // //           </View>
// // // // //         </Animated.View>

// // // // //         {/* bulbs counter (dashed cloud pill) */}
// // // // //         <View style={[A(728, 128, 142, 64), { borderRadius: P(32), backgroundColor: CREAM, borderWidth: P(3), borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingRight: P(26), alignItems: 'center', elevation: 4 }]}>
// // // // //           <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(44), fontWeight: '900', color: INK, includeFontPadding: false }}>{hints}</Text>
// // // // //         </View>
// // // // //         <View style={A(846, 108, 68, 68)}><Icon n="bulb" s={P(68)} /></View>

// // // // //         {/* question pill (2 lines) */}
// // // // //         <View style={[A(40, 262, 862, 150), { borderRadius: P(70), backgroundColor: CREAM, borderWidth: P(4), borderColor: '#ead2a4', alignItems: 'center', justifyContent: 'center', elevation: 4 }]}>
// // // // //           <Text style={{ position: 'absolute', left: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'<'}</Text>
// // // // //           <Text style={{ position: 'absolute', right: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'>'}</Text>
// // // // //           <Text numberOfLines={2} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(40), lineHeight: P(52), color: '#17307a', maxWidth: P(640), textAlign: 'center' }}>{data.question}</Text>
// // // // //         </View>

// // // // //         {/* wooden frames behind the two pictures */}
// // // // //         <View pointerEvents="none" style={[A(52, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />
// // // // //         <View pointerEvents="none" style={[A(482, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />

// // // // //         {/* the two pictures */}
// // // // //         <View style={A(66, 440, 380, 494)}><SpotScene side="a" width={P(380)} /></View>
// // // // //         <View style={A(496, 440, 380, 494)}><SpotScene side="b" width={P(380)} /></View>

// // // // //         {/* + 1 _ 2 _ 3 − */}
// // // // //         <Animated.View style={[A(0, 985, 942, 140), { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 10, elevation: 10, transform: [{ translateX: shake }] }]}>
// // // // //           {home('+')}
// // // // //           <Text style={numStyle}>{n1}</Text>
// // // // //           {gapView(0)}
// // // // //           <Text style={numStyle}>{n2}</Text>
// // // // //           {gapView(1)}
// // // // //           <Text style={numStyle}>{n3}</Text>
// // // // //           {home('-')}
// // // // //         </Animated.View>

// // // // //         {/* message line */}
// // // // //         {!!msg && (
// // // // //           <View pointerEvents="none" style={[A(60, 1170, 822, 68), { zIndex: 20, elevation: 20, alignItems: 'center', justifyContent: 'center' }]}>
// // // // //             <View style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: P(34), paddingHorizontal: P(34), paddingVertical: P(8) }}>
// // // // //               <Text numberOfLines={2} style={{ fontFamily: F, fontSize: P(34), fontWeight: 'bold', color: '#c0392b', textAlign: 'center' }}>{msg}</Text>
// // // // //             </View>
// // // // //           </View>
// // // // //         )}

// // // // //         {/* clue / video / skip */}
// // // // //         {circleBtn(143, '#a4e02a', '#f4f1dc', openClues, <Icon n="search" s={P(78)} />)}
// // // // //         {costPill(152, 150, <Icon n="bulb" s={P(38)} />, String(COST_CLUE))}
// // // // //         {circleBtn(388, '#f7ebd4', '#fbf3e3', watchVideo, <Icon n="film" s={P(92)} />)}
// // // // //         {costPill(391, 162, <Coin s={P(30)} />, '+' + REWARD)}
// // // // //         {circleBtn(637, '#f0434d', '#fbf3e3', () => setRiddle(true), <DoubleArrow s={P(86)} />)}
// // // // //         {costPill(645, 151, <Icon n="bulb" s={P(38)} />, String(COST_SKIP))}

// // // // //         {/* ---- clue popup (free, one clue only) ---- */}
// // // // //         {clueOpen && (
// // // // //           <>
// // // // //             <Pressable onPress={() => setClueOpen(false)} style={[A(0, 0, DW, DH), { zIndex: 40, elevation: 40, backgroundColor: 'rgba(10,25,60,0.5)' }]} />
// // // // //             <View style={[A(60, 430, 822, 560), { zIndex: 41, elevation: 41, borderRadius: P(56), backgroundColor: CREAM, borderWidth: P(14), borderColor: WOOD_D }]}>
// // // // //               <Text style={{ position: 'absolute', left: 0, right: 0, top: P(34), textAlign: 'center', fontFamily: F, fontSize: P(56), fontWeight: '900', color: NAVY, includeFontPadding: false }}>CLUES</Text>
// // // // //               <Squish style={A(660, 22, 78, 78)} onPress={() => setClueOpen(false)}>
// // // // //                 <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: WOOD, borderWidth: P(5), borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center' }}><Icon n="cross" s={P(40)} /></View>
// // // // //               </Squish>

// // // // //               <View style={[A(36, 130, 720, 330), { borderRadius: P(40), backgroundColor: '#ffffff', borderWidth: P(6), borderColor: GREEN, flexDirection: 'row', alignItems: 'center', paddingHorizontal: P(28), gap: P(24) }]}>
// // // // //                 <View style={{ width: P(110), height: P(110), borderRadius: P(55), backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' }}>
// // // // //                   <Text style={{ fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#fff', includeFontPadding: false }}>1</Text>
// // // // //                 </View>
// // // // //                 <View style={{ flex: 1 }}>
// // // // //                   <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#bd6b29', includeFontPadding: false }}>Clue 1</Text>
// // // // //                   <Text numberOfLines={7} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(32), lineHeight: P(41), color: '#17307a', marginTop: P(6) }}>{CLUE_TEXT}</Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //             </View>
// // // // //           </>
// // // // //         )}

// // // // //         {/* ---- level complete ---- */}
// // // // //         {!!result && (
// // // // //           <View style={[A(0, 0, DW, DH), { zIndex: 60, elevation: 60, backgroundColor: 'rgba(10,25,60,0.55)', alignItems: 'center', justifyContent: 'center' }]}>
// // // // //             <Animated.View style={{ width: P(702), alignItems: 'center', backgroundColor: CREAM, borderWidth: P(12), borderColor: WOOD_D, borderRadius: P(56), paddingVertical: P(44), paddingHorizontal: P(30), opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
// // // // //               <Text style={{ fontFamily: F, fontSize: P(64), fontWeight: '900', color: NAVY }}>Level complete!</Text>
// // // // //               <Text style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(38), color: '#17307a', textAlign: 'center', marginTop: P(10) }}>{result.message}</Text>
// // // // //               <View style={{ flexDirection: 'row', gap: P(10), marginTop: P(26) }}>
// // // // //                 {[1, 2, 3].map((c) => <StarIcon key={c} size={P(84)} on={c <= (result.stars || 0)} />)}
// // // // //               </View>
// // // // //               {!result.skipped && <Text style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#bd6b29', marginTop: P(18) }}>{'Score ' + result.score}</Text>}
// // // // //               <TouchableOpacity activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}
// // // // //                 style={{ marginTop: P(34), minWidth: P(320), height: P(104), borderRadius: P(52), backgroundColor: '#a4d732', borderWidth: P(8), borderColor: K, alignItems: 'center', justifyContent: 'center' }}>
// // // // //                 <Text style={{ fontFamily: F, fontSize: P(54), fontWeight: '900', color: K }}>NEXT</Text>
// // // // //               </TouchableOpacity>
// // // // //             </Animated.View>
// // // // //           </View>
// // // // //         )}
// // // // //       </View>
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const st = StyleSheet.create({
// // // // //   center: { alignItems: 'center', justifyContent: 'center' },
// // // // //   loading: { fontFamily: F, fontSize: 18, color: '#fff', marginTop: 12 },
// // // // //   errText: { fontFamily: F, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// // // // //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: '#a4d732', borderWidth: 2.5, borderColor: K },
// // // // //   retryT: { fontFamily: F, fontSize: 20, fontWeight: '800', color: K },
// // // // //   back: { fontFamily: F, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },

// // // // //   num: { fontFamily: F, fontWeight: '900', color: NAVY, textAlign: 'center', includeFontPadding: false },
// // // // //   sym: { fontFamily: F, fontWeight: '900', color: ORANGE, textAlign: 'center', includeFontPadding: false },
// // // // //   homeEmpty: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.25)' },
// // // // //   slotRing: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.5)', backgroundColor: 'rgba(255,255,255,0.35)' },
// // // // // });
// // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // import {
// // // //   View, Text, Animated, PanResponder, Pressable, StyleSheet, Platform, Easing,
// // // //   ActivityIndicator, TouchableOpacity, useWindowDimensions,
// // // // } from 'react-native';
// // // // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // // // import { startLevel3, answerLevel3, rewardLevel3, Level3Start, Level3Answer, Sym } from './Btlevel3api';
// // // // import { SpotScene } from './Btlevel3art';
// // // // import { StarIcon } from './Btlevel2art';
// // // // import { F, INK, Coin } from './BTShared';
// // // // import { Icon } from './Art';
// // // // import BTSkipRiddle from './BTSkipRiddle';
// // // // import { play } from './BTSound';
// // // // import { fetchClue } from './Btclueapi';

// // // // /**
// // // //  * Level 3 - spot the differences, put + and − between 1 2 3.
// // // //  * GARDEN THEME (matches Level 1): blue sky, trees, fence, sprout, bookshelf, meadow, wide wooden bottom bar.
// // // //  * No pencil / eraser on this screen.
// // // //  * Clue: frontend -> POST /api/braintwist/clue (level 3) -> backend reads clue + saves the view in MySQL -> JSON back.
// // // //  */

// // // // const NAVY = '#132f70', CREAM = '#faf0e2', K = '#1d1d1d', ORANGE = '#f5a623', GREEN = '#3ec75a';
// // // // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });
// // // // const DW = 942, DH = 1669;
// // // // const SKY = '#5cc0f5', GRASS = '#74d13c';
// // // // const WOOD = '#eba24e', WOOD_D = '#c2782c', WOOD_DD = '#8f5a1f';
// // // // const COST_CLUE = 25, COST_SKIP = 50, REWARD = 75; // only shown on the pills

// // // // const CLUE_ERR_TEXT = 'Could not load the clue. Tap to try again.';

// // // // const LABEL: Record<Sym, string> = { '+': '+', '-': '−' };
// // // // type Slots = (Sym | null)[];

// // // // type Props = {
// // // //   playerId: number;
// // // //   onHints?: (h: number) => void;
// // // //   onExit: () => void;
// // // //   onComplete?: (result: Level3Answer) => void;
// // // // };

// // // // /* ---------- the garden scene ---------- */
// // // // function Flower({ x, y, s = 1 }: any) {
// // // //   return (
// // // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // //       {[0, 72, 144, 216, 288].map(a => (
// // // //         <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
// // // //       ))}
// // // //       <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
// // // //     </G>
// // // //   );
// // // // }

// // // // function Tuft({ x, y }: any) {
// // // //   return (
// // // //     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
// // // //       <Polygon points="-14,0 -8,-34 -2,0" />
// // // //       <Polygon points="-4,0 4,-44 12,0" />
// // // //       <Polygon points="8,0 18,-30 24,0" />
// // // //     </G>
// // // //   );
// // // // }

// // // // function Cloud({ x, y, s = 1 }: any) {
// // // //   return (
// // // //     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
// // // //       <Ellipse cx="0" cy="0" rx="70" ry="26" />
// // // //       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
// // // //       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
// // // //     </G>
// // // //   );
// // // // }

// // // // function Garden({ w, h }: any) {
// // // //   return (
// // // //     <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{ position: 'absolute', left: 0, top: 0 }}>
// // // //       <Defs>
// // // //         <LinearGradient id="g3sky" x1="0" y1="0" x2="0" y2="1">
// // // //           <Stop offset="0" stopColor="#46b6f3" />
// // // //           <Stop offset="1" stopColor="#c2e8fb" />
// // // //         </LinearGradient>
// // // //         <LinearGradient id="g3grass" x1="0" y1="0" x2="0" y2="1">
// // // //           <Stop offset="0" stopColor="#7ed63f" />
// // // //           <Stop offset="1" stopColor="#6cc934" />
// // // //         </LinearGradient>
// // // //         <LinearGradient id="g3wood" x1="0" y1="0" x2="0" y2="1">
// // // //           <Stop offset="0" stopColor="#f0a850" />
// // // //           <Stop offset="1" stopColor="#e69a3f" />
// // // //         </LinearGradient>
// // // //       </Defs>
// // // //       <Rect width={DW} height={DH} fill="url(#g3sky)" />

// // // //       {/* trees top corners */}
// // // //       <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// // // //       <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// // // //       <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
// // // //       <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />

// // // //       {/* clouds */}
// // // //       <Cloud x={850} y={245} s={1} />
// // // //       <Cloud x={50} y={985} s={0.9} />
// // // //       <Cloud x={880} y={1000} s={0.6} />

// // // //       {/* rolling hills */}
// // // //       <Ellipse cx="150" cy="1160" rx="300" ry="150" fill="#9ad95f" />
// // // //       <Ellipse cx="640" cy="1210" rx="420" ry="120" fill="#6cc13a" />
// // // //       <Ellipse cx="900" cy="1170" rx="200" ry="110" fill="#5fb832" />

// // // //       {/* fence: pickets first, rails in front */}
// // // //       {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
// // // //         const x = -10 + i * 90;
// // // //         return (
// // // //           <G key={i}>
// // // //             <Polygon points={`${x},1130 ${x + 33},1098 ${x + 66},1130`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // // //             <Rect x={x} y="1130" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // // //           </G>
// // // //         );
// // // //       })}
// // // //       <Rect x="0" y="1160" width={DW} height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
// // // //       <Rect x="0" y="1208" width={DW} height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

// // // //       {/* bookshelf (right) with potted plant */}
// // // //       <G>
// // // //         <Rect x="845" y="590" width="80" height="18" rx="4" fill="#e8903a" />
// // // //         <Polygon points="852,608 918,608 910,650 860,650" fill="#f0a050" />
// // // //         <G fill="#4cb04a">
// // // //           <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(-28 885 598)" />
// // // //           <Ellipse cx="885" cy="540" rx="20" ry="62" fill="#3a9a3c" />
// // // //           <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(28 885 598)" />
// // // //         </G>
// // // //         <Rect x="780" y="650" width="162" height="575" fill="#eaa24f" />
// // // //         <Rect x="796" y="666" width="146" height="545" fill="#dc9d4f" />
// // // //         <Rect x="780" y="840" width="162" height="16" fill="#f2b866" />
// // // //         <Rect x="780" y="1030" width="162" height="16" fill="#f2b866" />
// // // //         <Rect x="780" y="650" width="162" height="16" fill="#f2b866" />
// // // //         {/* row 1 */}
// // // //         <Rect x="810" y="710" width="36" height="130" fill="#2a9d9d" />
// // // //         <Rect x="850" y="690" width="34" height="150" fill="#f06ba8" />
// // // //         <Rect x="888" y="715" width="40" height="125" fill="#8a63da" />
// // // //         {/* row 2 */}
// // // //         <Rect x="805" y="915" width="30" height="115" fill="#e5484d" />
// // // //         <Rect x="840" y="890" width="24" height="140" fill="#3b82e0" />
// // // //         <Rect x="868" y="910" width="38" height="120" fill="#4caf50" />
// // // //         {/* row 3 */}
// // // //         <Rect x="810" y="1095" width="34" height="120" fill="#f5c518" />
// // // //         <Rect x="848" y="1065" width="40" height="150" fill="#2c6fdc" />
// // // //       </G>

// // // //       {/* sprout friend (left, from Level 1) */}
// // // //       <G>
// // // //         <G fill="#5cb85c">
// // // //           <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(-25 70 1198)" />
// // // //           <Ellipse cx="70" cy="1140" rx="22" ry="62" fill="#6cc56a" />
// // // //           <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(25 70 1198)" />
// // // //         </G>
// // // //         <Rect x="10" y="1195" width="120" height="78" rx="36" fill="#fdf1ea" />
// // // //         <Ellipse cx="38" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
// // // //         <Ellipse cx="102" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
// // // //         <Circle cx="55" cy="1230" r="4.5" fill="#3a2a2a" />
// // // //         <Circle cx="85" cy="1230" r="4.5" fill="#3a2a2a" />
// // // //         <Path d="M62 1243 Q70 1251 78 1243" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// // // //       </G>

// // // //       {/* front meadow */}
// // // //       <Path d={`M0 1285 C140 1230 300 1255 470 1245 C650 1233 800 1205 ${DW} 1185 L${DW} ${DH} L0 ${DH} Z`} fill="#74d13c" />
// // // //       <Ellipse cx="300" cy="1330" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

// // // //       {/* stones */}
// // // //       <Ellipse cx="62" cy="1545" rx="68" ry="40" fill="#9b9b9b" />
// // // //       <Ellipse cx="55" cy="1535" rx="50" ry="26" fill="#b4b4b4" />
// // // //       <Ellipse cx="880" cy="1545" rx="68" ry="40" fill="#9b9b9b" />
// // // //       <Ellipse cx="888" cy="1535" rx="50" ry="26" fill="#b4b4b4" />

// // // //       {/* wooden bottom bar (wide, like Level 1) */}
// // // //       <Rect x="28" y="1290" width="886" height="312" rx="92" fill="#eaa24f" stroke="#c2782c" strokeWidth="12" />
// // // //       <Path d="M70 1340 C300 1332 620 1346 872 1334 M60 1445 C320 1452 640 1436 882 1448 M70 1555 C300 1548 620 1562 872 1552" stroke="#d58f3a" strokeWidth="5" opacity="0.7" fill="none" strokeLinecap="round" />
// // // //       <Path d="M110 1318 C320 1312 620 1324 832 1314" stroke="#f5c07c" strokeWidth="4" opacity="0.8" fill="none" strokeLinecap="round" />
// // // //       <Circle cx="82" cy="1335" r="9" fill="#8f5a1f" /><Circle cx="860" cy="1335" r="9" fill="#8f5a1f" />
// // // //       <Circle cx="82" cy="1556" r="9" fill="#8f5a1f" /><Circle cx="860" cy="1556" r="9" fill="#8f5a1f" />

// // // //       {/* grass tufts + flowers */}
// // // //       <Tuft x="905" y="1325" /><Tuft x="910" y="1450" /><Tuft x="20" y="1440" />
// // // //       <Tuft x="100" y="1660" /><Tuft x="340" y="1660" /><Tuft x="580" y="1660" /><Tuft x="820" y="1660" />
// // // //       <Flower x="885" y="1215" s={0.8} />
// // // //       <Flower x="200" y="1625" s={0.95} />
// // // //       <Flower x="735" y="1625" s={0.95} />
// // // //     </Svg>
// // // //   );
// // // // }

// // // // /* ---------- thin link chain for hanging signs (Level 1 style) ---------- */
// // // // function Chain({ x, y, h, k }: any) {
// // // //   const n = Math.max(2, Math.round(h / 14));
// // // //   return (
// // // //     <Svg pointerEvents="none" width={12 * k} height={h * k} viewBox={`0 0 12 ${h}`} style={{ position: 'absolute', left: x * k, top: y * k }}>
// // // //       {Array.from({ length: n }).map((_, i) => (
// // // //         <Ellipse key={i} cx="6" cy={7 + i * (h / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// // // //       ))}
// // // //     </Svg>
// // // //   );
// // // // }

// // // // /* ---------- double arrow (skip icon) ---------- */
// // // // function DoubleArrow({ s }: { s: number }) {
// // // //   return (
// // // //     <Svg width={s} height={s} viewBox="0 0 100 100">
// // // //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // // //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // // //     </Svg>
// // // //   );
// // // // }

// // // // /* ---------- squish on press ---------- */
// // // // function Squish({ style, onPress, disabled, children }: any) {
// // // //   const s = useRef(new Animated.Value(1)).current;
// // // //   const to = (v: number) => Animated.spring(s, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
// // // //   return (
// // // //     <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.92)} onPressOut={() => to(1)} style={style}>
// // // //       <Animated.View style={{ transform: [{ scale: s }] }}>{children}</Animated.View>
// // // //     </Pressable>
// // // //   );
// // // // }

// // // // /* ---------- one draggable symbol (+ or −) ---------- */
// // // // function DragSymbol({ ch, size, disabled, onDrop }: {
// // // //   ch: Sym; size: number; disabled: boolean;
// // // //   onDrop: (ch: Sym, x: number, y: number) => Promise<boolean>;
// // // // }) {
// // // //   const pan = useRef(new Animated.ValueXY()).current;
// // // //   const dropRef = useRef(onDrop);
// // // //   const disRef = useRef(disabled);
// // // //   dropRef.current = onDrop;
// // // //   disRef.current = disabled;
// // // //   const [drag, setDrag] = useState(false);

// // // //   const back = () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();

// // // //   const pr = useRef(PanResponder.create({
// // // //     onStartShouldSetPanResponder: () => !disRef.current,
// // // //     onPanResponderGrant: () => { setDrag(true); play('drag'); },
// // // //     onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
// // // //     onPanResponderRelease: async (_, g) => {
// // // //       setDrag(false);
// // // //       const ok = await dropRef.current(ch, g.moveX, g.moveY);
// // // //       if (ok) pan.setValue({ x: 0, y: 0 }); else back();
// // // //     },
// // // //     onPanResponderTerminate: () => { setDrag(false); back(); },
// // // //   })).current;

// // // //   return (
// // // //     <Animated.View
// // // //       {...pr.panHandlers}
// // // //       style={{
// // // //         width: size, height: size, alignItems: 'center', justifyContent: 'center',
// // // //         zIndex: drag ? 50 : 1, elevation: drag ? 20 : 0,
// // // //         transform: pan.getTranslateTransform(),
// // // //       }}
// // // //     >
// // // //       <Text style={[st.sym, { fontSize: size * 1.05, lineHeight: size * 1.15 }, drag && { color: GREEN }]}>{LABEL[ch]}</Text>
// // // //     </Animated.View>
// // // //   );
// // // // }

// // // // const measure = (ref: React.RefObject<any>) =>
// // // //   new Promise<{ x: number; y: number; w: number; h: number } | null>((resolve) => {
// // // //     const node: any = ref.current;
// // // //     if (!node || !node.measureInWindow) return resolve(null);
// // // //     node.measureInWindow((x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }));
// // // //   });

// // // // /* =====================  SCREEN  ===================== */
// // // // export default function BTLevel3Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // // //   const { width: winW, height: winH } = useWindowDimensions();
// // // //   const box = { w: winW, h: winH };

// // // //   const [data, setData] = useState<Level3Start | null>(null);
// // // //   const [loadErr, setLoadErr] = useState('');
// // // //   const [hints, setHints] = useState(0);
// // // //   const [slots, setSlots] = useState<Slots>([null, null]);
// // // //   const [fixed, setFixed] = useState<Slots>([null, null]);
// // // //   const [msg, setMsg] = useState('');
// // // //   const [busy, setBusy] = useState(false);
// // // //   const [result, setResult] = useState<Level3Answer | null>(null);
// // // //   const [riddle, setRiddle] = useState(false);
// // // //   const [clueOpen, setClueOpen] = useState(false);
// // // //   const [clueText, setClueText] = useState('');
// // // //   const [clueBusy, setClueBusy] = useState(false);
// // // //   const [clueErr, setClueErr] = useState(false);

// // // //   const slotsRef = useRef<Slots>([null, null]);
// // // //   const fixedRef = useRef<Slots>([null, null]);
// // // //   slotsRef.current = slots;
// // // //   fixedRef.current = fixed;

// // // //   const slotRef0 = useRef<View>(null);
// // // //   const slotRef1 = useRef<View>(null);
// // // //   const slotRefs = [slotRef0, slotRef1];

// // // //   const shake = useRef(new Animated.Value(0)).current;
// // // //   const sway = useRef(new Animated.Value(0)).current;
// // // //   const pop = useRef(new Animated.Value(0)).current;
// // // //   const msgTimer = useRef<any>(null);
// // // //   const timers = useRef<any[]>([]);

// // // //   useEffect(() => {
// // // //     const a = Animated.loop(Animated.sequence([
// // // //       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // //       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // //     ]));
// // // //     a.start();
// // // //     return () => a.stop();
// // // //   }, []);

// // // //   const readRevealed = (list: { slot: number; symbol: Sym }[] | undefined): Slots => {
// // // //     const f: Slots = [null, null];
// // // //     (list || []).forEach((r) => { if (r.slot === 0 || r.slot === 1) f[r.slot] = r.symbol; });
// // // //     return f;
// // // //   };

// // // //   const load = useCallback(() => {
// // // //     setLoadErr('');
// // // //     setData(null);
// // // //     startLevel3(playerId)
// // // //       .then((d) => {
// // // //         const f = readRevealed(d.revealed);
// // // //         setData(d);
// // // //         setHints(d.hints);
// // // //         setFixed(f);
// // // //         setSlots(f);
// // // //       })
// // // //       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
// // // //   }, [playerId]);

// // // //   useEffect(() => {
// // // //     load();
// // // //     return () => {
// // // //       timers.current.forEach(clearTimeout);
// // // //       clearTimeout(msgTimer.current);
// // // //     };
// // // //   }, [load]);

// // // //   useEffect(() => {
// // // //     if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
// // // //   }, [result]);

// // // //   useEffect(() => {
// // // //     if (data) onHints?.(hints);
// // // //   }, [hints, data]);

// // // //   const showMsg = (m: string) => {
// // // //     setMsg(m);
// // // //     clearTimeout(msgTimer.current);
// // // //     msgTimer.current = setTimeout(() => setMsg(''), 2600);
// // // //   };

// // // //   const shakeRow = () => {
// // // //     Animated.sequence([
// // // //       Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
// // // //       Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
// // // //       Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
// // // //       Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
// // // //     ]).start();
// // // //   };

// // // //   const submit = async (arr: Slots) => {
// // // //     if (!data) return;
// // // //     setBusy(true);
// // // //     try {
// // // //       const res = await answerLevel3({ sessionId: data.sessionId, playerId, symbols: arr as Sym[] });
// // // //       if (!res.correct) {
// // // //         play('wrong');
// // // //         showMsg(res.message || 'Not quite. Try again!');
// // // //         shakeRow();
// // // //         timers.current.push(setTimeout(() => {
// // // //           setSlots(fixedRef.current);
// // // //           slotsRef.current = fixedRef.current;
// // // //           setBusy(false);
// // // //         }, 700));
// // // //         return;
// // // //       }
// // // //       if (typeof res.hints === 'number') setHints(res.hints);
// // // //       play('correct');
// // // //       timers.current.push(setTimeout(() => setResult(res), 700));
// // // //     } catch (e: any) {
// // // //       showMsg(e.message || 'Network error');
// // // //       setSlots(fixedRef.current);
// // // //       setBusy(false);
// // // //     }
// // // //   };

// // // //   const handleDrop = async (ch: Sym, px: number, py: number): Promise<boolean> => {
// // // //     if (busy || !data || result) return false;

// // // //     const rects = await Promise.all(slotRefs.map(measure));
// // // //     let best = -1;
// // // //     let bestD = Infinity;
// // // //     rects.forEach((r, i) => {
// // // //       if (!r) return;
// // // //       const d = Math.hypot(px - (r.x + r.w / 2), py - (r.y + r.h / 2));
// // // //       if (d < bestD) { bestD = d; best = i; }
// // // //     });

// // // //     const limit = Math.max(60, winW * 0.14);
// // // //     if (best < 0 || bestD > limit) return false;
// // // //     if (fixedRef.current[best]) return false;

// // // //     const next: Slots = [...slotsRef.current];
// // // //     next[best] = ch;
// // // //     setSlots(next);
// // // //     slotsRef.current = next;

// // // //     if (next.every(Boolean)) submit(next);
// // // //     return true;
// // // //   };

// // // //   const removeSlot = (i: number) => {
// // // //     if (busy || result || fixedRef.current[i]) return;
// // // //     setSlots((s) => { const n = [...s]; n[i] = null; return n; });
// // // //   };

// // // //   const watchVideo = async () => {
// // // //     if (busy || result) return;
// // // //     setBusy(true);
// // // //     try {
// // // //       const res = await rewardLevel3(playerId);
// // // //       setHints(res.hints);
// // // //       showMsg(`+${res.added} coins!`);
// // // //     } catch (e: any) {
// // // //       showMsg(e.message || 'Reward failed');
// // // //     }
// // // //     setBusy(false);
// // // //   };

// // // //   // clue: frontend -> POST /api/braintwist/clue (level 3) -> backend reads clue + saves the view in MySQL -> JSON back (free)
// // // //   const loadClue = async () => {
// // // //     if (clueBusy) return;
// // // //     setClueBusy(true);
// // // //     setClueErr(false);
// // // //     const r = await fetchClue(playerId, 3);
// // // //     if (r.success && r.clue) setClueText(r.clue);
// // // //     else setClueErr(true);
// // // //     setClueBusy(false);
// // // //   };

// // // //   const openClues = () => {
// // // //     play('clue');
// // // //     setClueOpen(true);
// // // //     if (!clueText) loadClue();
// // // //   };

// // // //   const riddleSolved = async (): Promise<string> => {
// // // //     setRiddle(false);
// // // //     setResult({
// // // //       success: true, correct: true, completed: true, skipped: true,
// // // //       message: 'Level skipped!', score: 0, stars: 0,
// // // //     });
// // // //     return '';
// // // //   };

// // // //   /* ---------- loading / error ---------- */
// // // //   if (loadErr || !data) {
// // // //     return (
// // // //       <View style={[st.center, { width: winW, height: winH, backgroundColor: SKY }]}>
// // // //         {loadErr ? (
// // // //           <>
// // // //             <Text style={st.errText}>{loadErr}</Text>
// // // //             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // //             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // //           </>
// // // //         ) : (
// // // //           <>
// // // //             <ActivityIndicator color="#fff" size="large" />
// // // //             <Text style={st.loading}>Loading level 3...</Text>
// // // //           </>
// // // //         )}
// // // //       </View>
// // // //     );
// // // //   }

// // // //   /* ---------- skip riddle screen ---------- */
// // // //   if (riddle) {
// // // //     return (
// // // //       <View style={{ width: winW, height: winH }}>
// // // //         <BTSkipRiddle hints={hints} onHome={onExit} onBack={() => setRiddle(false)} onSkipped={riddleSolved} />
// // // //       </View>
// // // //     );
// // // //   }

// // // //   // scale the 942x1669 design to the window
// // // //   const bw = Math.min(box.w, (box.h * DW) / DH), k = bw / DW, bh = (bw * DH) / DW;
// // // //   const top0 = (box.h - bh) / 2;
// // // //   const P = (v: number) => v * k;
// // // //   const A = (x: number, y: number, w: number, h: number): any => ({ position: 'absolute', left: P(x), top: P(y), width: P(w), height: P(h) });

// // // //   const [n1, n2, n3] = data.numbers;
// // // //   const u = P(112);
// // // //   const gap = P(92);
// // // //   const numStyle = [st.num, { fontSize: P(112), lineHeight: P(124), minWidth: P(70) }];
// // // //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// // // //   const home = (ch: Sym) =>
// // // //     slots.includes(ch)
// // // //       ? <View style={[st.homeEmpty, { width: u, height: u, borderRadius: u / 2 }]} />
// // // //       : <DragSymbol ch={ch} size={u} disabled={busy || !!result} onDrop={handleDrop} />;

// // // //   const gapView = (i: number) => (
// // // //     <View ref={slotRefs[i]} collapsable={false} style={{ width: gap, height: u, alignItems: 'center', justifyContent: 'center' }}>
// // // //       {slots[i] ? (
// // // //         <TouchableOpacity activeOpacity={0.8} disabled={!!fixed[i] || busy || !!result} onPress={() => removeSlot(i)}>
// // // //           <Text style={[st.sym, { fontSize: u * 1.05, lineHeight: u * 1.15 }]}>{LABEL[slots[i] as Sym]}</Text>
// // // //         </TouchableOpacity>
// // // //       ) : (
// // // //         <View style={[st.slotRing, { width: gap * 0.72, height: gap * 0.72, borderRadius: gap }]} />
// // // //       )}
// // // //     </View>
// // // //   );

// // // //   const costPill = (x: number, w: number, icon: any, text: string) => (
// // // //     <View style={[A(x, 1527, w, 67), { borderRadius: P(34), backgroundColor: '#6b4423', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10) }]}>
// // // //       {icon}<Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{text}</Text>
// // // //     </View>
// // // //   );
// // // //   const circleBtn = (x: number, bgc: string, bc: string, onPress: any, icon: any) => (
// // // //     <Squish style={A(x, 1351, 166, 166)} onPress={onPress}>
// // // //       <View style={{ width: P(166), height: P(166), borderRadius: P(83), backgroundColor: bgc, borderWidth: P(14), borderColor: bc, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>{icon}</View>
// // // //     </Squish>
// // // //   );
// // // //   // yellow round buttons (home / settings), Level 1 style
// // // //   const woodBtn = (x: number, onPress: any, icon: any) => (
// // // //     <Squish style={A(x, 111, 78, 78)} onPress={onPress}>
// // // //       <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: '#fbc02d', borderWidth: P(5), borderColor: '#d98e1c', alignItems: 'center', justifyContent: 'center', elevation: 4 }}>{icon}</View>
// // // //     </Squish>
// // // //   );

// // // //   return (
// // // //     <View style={{ width: winW, height: winH, backgroundColor: SKY, overflow: 'hidden' }}>
// // // //       {/* grass fill if the window is taller than the design */}
// // // //       <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: top0 + P(1500), bottom: 0, backgroundColor: GRASS }} />

// // // //       <View style={{ position: 'absolute', left: (box.w - bw) / 2, top: top0, width: bw, height: bh }}>
// // // //         <Garden w={bw} h={bh} />

// // // //         {/* top: home, settings */}
// // // //         {woodBtn(27, onExit, <Icon n="home" s={P(42)} />)}
// // // //         {woodBtn(119, undefined, <Icon n="gear" s={P(44)} />)}

// // // //         {/* level sign (hangs on chains) */}
// // // //         <Animated.View style={[A(300, 70, 346, 160), { transform: [{ rotate: swayR }] }]}>
// // // //           <Chain x={52} y={0} h={50} k={k} />
// // // //           <Chain x={282} y={0} h={50} k={k} />
// // // //           <View style={{ position: 'absolute', left: 0, top: P(42), width: P(346), height: P(98), borderRadius: P(10), backgroundColor: '#bd6b29', borderWidth: P(6), borderColor: WOOD_DD, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
// // // //             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10), flexWrap: 'nowrap' }}>
// // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'<'}</Text>
// // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{'LEVEL 3'}</Text>
// // // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'>'}</Text>
// // // //             </View>
// // // //           </View>
// // // //         </Animated.View>

// // // //         {/* bulbs counter (dashed cloud pill) */}
// // // //         <View style={[A(728, 128, 142, 64), { borderRadius: P(32), backgroundColor: CREAM, borderWidth: P(3), borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingRight: P(26), alignItems: 'center', elevation: 4 }]}>
// // // //           <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(44), fontWeight: '900', color: INK, includeFontPadding: false }}>{hints}</Text>
// // // //         </View>
// // // //         <View style={A(846, 108, 68, 68)}><Icon n="bulb" s={P(68)} /></View>

// // // //         {/* question pill (2 lines) */}
// // // //         <View style={[A(40, 262, 862, 150), { borderRadius: P(70), backgroundColor: CREAM, borderWidth: P(4), borderColor: '#ead2a4', alignItems: 'center', justifyContent: 'center', elevation: 4 }]}>
// // // //           <Text style={{ position: 'absolute', left: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'<'}</Text>
// // // //           <Text style={{ position: 'absolute', right: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'>'}</Text>
// // // //           <Text numberOfLines={2} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(40), lineHeight: P(52), color: '#17307a', maxWidth: P(640), textAlign: 'center' }}>{data.question}</Text>
// // // //         </View>

// // // //         {/* wooden frames behind the two pictures */}
// // // //         <View pointerEvents="none" style={[A(52, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />
// // // //         <View pointerEvents="none" style={[A(482, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />

// // // //         {/* the two pictures */}
// // // //         <View style={A(66, 440, 380, 494)}><SpotScene side="a" width={P(380)} /></View>
// // // //         <View style={A(496, 440, 380, 494)}><SpotScene side="b" width={P(380)} /></View>

// // // //         {/* + 1 _ 2 _ 3 − */}
// // // //         <Animated.View style={[A(0, 985, 942, 140), { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 10, elevation: 10, transform: [{ translateX: shake }] }]}>
// // // //           {home('+')}
// // // //           <Text style={numStyle}>{n1}</Text>
// // // //           {gapView(0)}
// // // //           <Text style={numStyle}>{n2}</Text>
// // // //           {gapView(1)}
// // // //           <Text style={numStyle}>{n3}</Text>
// // // //           {home('-')}
// // // //         </Animated.View>

// // // //         {/* message line */}
// // // //         {!!msg && (
// // // //           <View pointerEvents="none" style={[A(60, 1170, 822, 68), { zIndex: 20, elevation: 20, alignItems: 'center', justifyContent: 'center' }]}>
// // // //             <View style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: P(34), paddingHorizontal: P(34), paddingVertical: P(8) }}>
// // // //               <Text numberOfLines={2} style={{ fontFamily: F, fontSize: P(34), fontWeight: 'bold', color: '#c0392b', textAlign: 'center' }}>{msg}</Text>
// // // //             </View>
// // // //           </View>
// // // //         )}

// // // //         {/* clue / video / skip */}
// // // //         {circleBtn(143, '#a4e02a', '#f4f1dc', openClues, <Icon n="search" s={P(78)} />)}
// // // //         {costPill(152, 150, <Icon n="bulb" s={P(38)} />, String(COST_CLUE))}
// // // //         {circleBtn(388, '#f7ebd4', '#fbf3e3', watchVideo, <Icon n="film" s={P(92)} />)}
// // // //         {costPill(391, 162, <Coin s={P(30)} />, '+' + REWARD)}
// // // //         {circleBtn(637, '#f0434d', '#fbf3e3', () => setRiddle(true), <DoubleArrow s={P(86)} />)}
// // // //         {costPill(645, 151, <Icon n="bulb" s={P(38)} />, String(COST_SKIP))}

// // // //         {/* ---- clue popup (one clue, loaded from the backend) ---- */}
// // // //         {clueOpen && (
// // // //           <>
// // // //             <Pressable onPress={() => setClueOpen(false)} style={[A(0, 0, DW, DH), { zIndex: 40, elevation: 40, backgroundColor: 'rgba(10,25,60,0.5)' }]} />
// // // //             <View style={[A(60, 430, 822, 560), { zIndex: 41, elevation: 41, borderRadius: P(56), backgroundColor: CREAM, borderWidth: P(14), borderColor: WOOD_D }]}>
// // // //               <Text style={{ position: 'absolute', left: 0, right: 0, top: P(34), textAlign: 'center', fontFamily: F, fontSize: P(56), fontWeight: '900', color: NAVY, includeFontPadding: false }}>CLUES</Text>
// // // //               <Squish style={A(660, 22, 78, 78)} onPress={() => setClueOpen(false)}>
// // // //                 <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: WOOD, borderWidth: P(5), borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center' }}><Icon n="cross" s={P(40)} /></View>
// // // //               </Squish>

// // // //               <Squish style={A(36, 130, 720, 330)} disabled={!clueErr || clueBusy} onPress={loadClue}>
// // // //                 <View style={{ width: P(720), height: P(330), borderRadius: P(40), backgroundColor: '#ffffff', borderWidth: P(6), borderColor: GREEN, flexDirection: 'row', alignItems: 'center', paddingHorizontal: P(28), gap: P(24) }}>
// // // //                   <View style={{ width: P(110), height: P(110), borderRadius: P(55), backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' }}>
// // // //                     <Text style={{ fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#fff', includeFontPadding: false }}>1</Text>
// // // //                   </View>
// // // //                   <View style={{ flex: 1 }}>
// // // //                     <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#bd6b29', includeFontPadding: false }}>Clue 1</Text>
// // // //                     <Text numberOfLines={7} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(32), lineHeight: P(41), color: clueErr && !clueBusy ? '#c0392b' : '#17307a', marginTop: P(6) }}>
// // // //                       {clueBusy ? 'Loading clue...' : clueErr ? CLUE_ERR_TEXT : clueText}
// // // //                     </Text>
// // // //                   </View>
// // // //                 </View>
// // // //               </Squish>
// // // //             </View>
// // // //           </>
// // // //         )}

// // // //         {/* ---- level complete ---- */}
// // // //         {!!result && (
// // // //           <View style={[A(0, 0, DW, DH), { zIndex: 60, elevation: 60, backgroundColor: 'rgba(10,25,60,0.55)', alignItems: 'center', justifyContent: 'center' }]}>
// // // //             <Animated.View style={{ width: P(702), alignItems: 'center', backgroundColor: CREAM, borderWidth: P(12), borderColor: WOOD_D, borderRadius: P(56), paddingVertical: P(44), paddingHorizontal: P(30), opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
// // // //               <Text style={{ fontFamily: F, fontSize: P(64), fontWeight: '900', color: NAVY }}>Level complete!</Text>
// // // //               <Text style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(38), color: '#17307a', textAlign: 'center', marginTop: P(10) }}>{result.message}</Text>
// // // //               <View style={{ flexDirection: 'row', gap: P(10), marginTop: P(26) }}>
// // // //                 {[1, 2, 3].map((c) => <StarIcon key={c} size={P(84)} on={c <= (result.stars || 0)} />)}
// // // //               </View>
// // // //               {!result.skipped && <Text style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#bd6b29', marginTop: P(18) }}>{'Score ' + result.score}</Text>}
// // // //               <TouchableOpacity activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}
// // // //                 style={{ marginTop: P(34), minWidth: P(320), height: P(104), borderRadius: P(52), backgroundColor: '#a4d732', borderWidth: P(8), borderColor: K, alignItems: 'center', justifyContent: 'center' }}>
// // // //                 <Text style={{ fontFamily: F, fontSize: P(54), fontWeight: '900', color: K }}>NEXT</Text>
// // // //               </TouchableOpacity>
// // // //             </Animated.View>
// // // //           </View>
// // // //         )}
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // }

// // // // const st = StyleSheet.create({
// // // //   center: { alignItems: 'center', justifyContent: 'center' },
// // // //   loading: { fontFamily: F, fontSize: 18, color: '#fff', marginTop: 12 },
// // // //   errText: { fontFamily: F, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// // // //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: '#a4d732', borderWidth: 2.5, borderColor: K },
// // // //   retryT: { fontFamily: F, fontSize: 20, fontWeight: '800', color: K },
// // // //   back: { fontFamily: F, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },

// // // //   num: { fontFamily: F, fontWeight: '900', color: NAVY, textAlign: 'center', includeFontPadding: false },
// // // //   sym: { fontFamily: F, fontWeight: '900', color: ORANGE, textAlign: 'center', includeFontPadding: false },
// // // //   homeEmpty: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.25)' },
// // // //   slotRing: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.5)', backgroundColor: 'rgba(255,255,255,0.35)' },
// // // // });
// // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // import {
// // //   View, Text, Animated, PanResponder, Pressable, StyleSheet, Platform, Easing,
// // //   ActivityIndicator, TouchableOpacity, useWindowDimensions,
// // // } from 'react-native';
// // // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // // import { startLevel3, answerLevel3, rewardLevel3, clueLevel3, Level3Start, Level3Answer, Sym } from './Btlevel3api';
// // // import { SpotScene } from './Btlevel3art';
// // // import { StarIcon } from './Btlevel2art';
// // // import { F, INK, Coin } from './BTShared';
// // // import { Icon } from './Art';
// // // import BTSkipRiddle from './BTSkipRiddle';
// // // import { play } from './BTSound';

// // // /**
// // //  * Level 3 - spot the differences, put + and − between 1 2 3.
// // //  * GARDEN THEME (matches Level 1): blue sky, trees, fence, sprout, bookshelf, meadow, wide wooden bottom bar.
// // //  * No pencil / eraser on this screen.
// // //  * Clue: frontend -> POST /level3/clue -> backend saves the view in MySQL -> JSON back.
// // //  */

// // // const NAVY = '#132f70', CREAM = '#faf0e2', K = '#1d1d1d', ORANGE = '#f5a623', GREEN = '#3ec75a';
// // // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });
// // // const DW = 942, DH = 1669;
// // // const SKY = '#5cc0f5', GRASS = '#74d13c';
// // // const WOOD = '#eba24e', WOOD_D = '#c2782c', WOOD_DD = '#8f5a1f';
// // // const COST_CLUE = 25, COST_SKIP = 50, REWARD = 75; // only shown on the pills

// // // const CLUE_ERR_TEXT = 'Could not load the clue. Tap to try again.';

// // // const LABEL: Record<Sym, string> = { '+': '+', '-': '−' };
// // // type Slots = (Sym | null)[];

// // // type Props = {
// // //   playerId: number;
// // //   onHints?: (h: number) => void;
// // //   onExit: () => void;
// // //   onComplete?: (result: Level3Answer) => void;
// // // };

// // // /* ---------- the garden scene ---------- */
// // // function Flower({ x, y, s = 1 }: any) {
// // //   return (
// // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // //       {[0, 72, 144, 216, 288].map(a => (
// // //         <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
// // //       ))}
// // //       <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
// // //     </G>
// // //   );
// // // }

// // // function Tuft({ x, y }: any) {
// // //   return (
// // //     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
// // //       <Polygon points="-14,0 -8,-34 -2,0" />
// // //       <Polygon points="-4,0 4,-44 12,0" />
// // //       <Polygon points="8,0 18,-30 24,0" />
// // //     </G>
// // //   );
// // // }

// // // function Cloud({ x, y, s = 1 }: any) {
// // //   return (
// // //     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
// // //       <Ellipse cx="0" cy="0" rx="70" ry="26" />
// // //       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
// // //       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
// // //     </G>
// // //   );
// // // }

// // // function Garden({ w, h }: any) {
// // //   return (
// // //     <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{ position: 'absolute', left: 0, top: 0 }}>
// // //       <Defs>
// // //         <LinearGradient id="g3sky" x1="0" y1="0" x2="0" y2="1">
// // //           <Stop offset="0" stopColor="#46b6f3" />
// // //           <Stop offset="1" stopColor="#c2e8fb" />
// // //         </LinearGradient>
// // //         <LinearGradient id="g3grass" x1="0" y1="0" x2="0" y2="1">
// // //           <Stop offset="0" stopColor="#7ed63f" />
// // //           <Stop offset="1" stopColor="#6cc934" />
// // //         </LinearGradient>
// // //         <LinearGradient id="g3wood" x1="0" y1="0" x2="0" y2="1">
// // //           <Stop offset="0" stopColor="#f0a850" />
// // //           <Stop offset="1" stopColor="#e69a3f" />
// // //         </LinearGradient>
// // //       </Defs>
// // //       <Rect width={DW} height={DH} fill="url(#g3sky)" />

// // //       {/* trees top corners */}
// // //       <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// // //       <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// // //       <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
// // //       <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />

// // //       {/* clouds */}
// // //       <Cloud x={850} y={245} s={1} />
// // //       <Cloud x={50} y={985} s={0.9} />
// // //       <Cloud x={880} y={1000} s={0.6} />

// // //       {/* rolling hills */}
// // //       <Ellipse cx="150" cy="1160" rx="300" ry="150" fill="#9ad95f" />
// // //       <Ellipse cx="640" cy="1210" rx="420" ry="120" fill="#6cc13a" />
// // //       <Ellipse cx="900" cy="1170" rx="200" ry="110" fill="#5fb832" />

// // //       {/* fence: pickets first, rails in front */}
// // //       {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
// // //         const x = -10 + i * 90;
// // //         return (
// // //           <G key={i}>
// // //             <Polygon points={`${x},1130 ${x + 33},1098 ${x + 66},1130`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // //             <Rect x={x} y="1130" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // //           </G>
// // //         );
// // //       })}
// // //       <Rect x="0" y="1160" width={DW} height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
// // //       <Rect x="0" y="1208" width={DW} height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

// // //       {/* bookshelf (right) with potted plant */}
// // //       <G>
// // //         <Rect x="845" y="590" width="80" height="18" rx="4" fill="#e8903a" />
// // //         <Polygon points="852,608 918,608 910,650 860,650" fill="#f0a050" />
// // //         <G fill="#4cb04a">
// // //           <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(-28 885 598)" />
// // //           <Ellipse cx="885" cy="540" rx="20" ry="62" fill="#3a9a3c" />
// // //           <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(28 885 598)" />
// // //         </G>
// // //         <Rect x="780" y="650" width="162" height="575" fill="#eaa24f" />
// // //         <Rect x="796" y="666" width="146" height="545" fill="#dc9d4f" />
// // //         <Rect x="780" y="840" width="162" height="16" fill="#f2b866" />
// // //         <Rect x="780" y="1030" width="162" height="16" fill="#f2b866" />
// // //         <Rect x="780" y="650" width="162" height="16" fill="#f2b866" />
// // //         {/* row 1 */}
// // //         <Rect x="810" y="710" width="36" height="130" fill="#2a9d9d" />
// // //         <Rect x="850" y="690" width="34" height="150" fill="#f06ba8" />
// // //         <Rect x="888" y="715" width="40" height="125" fill="#8a63da" />
// // //         {/* row 2 */}
// // //         <Rect x="805" y="915" width="30" height="115" fill="#e5484d" />
// // //         <Rect x="840" y="890" width="24" height="140" fill="#3b82e0" />
// // //         <Rect x="868" y="910" width="38" height="120" fill="#4caf50" />
// // //         {/* row 3 */}
// // //         <Rect x="810" y="1095" width="34" height="120" fill="#f5c518" />
// // //         <Rect x="848" y="1065" width="40" height="150" fill="#2c6fdc" />
// // //       </G>

// // //       {/* sprout friend (left, from Level 1) */}
// // //       <G>
// // //         <G fill="#5cb85c">
// // //           <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(-25 70 1198)" />
// // //           <Ellipse cx="70" cy="1140" rx="22" ry="62" fill="#6cc56a" />
// // //           <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(25 70 1198)" />
// // //         </G>
// // //         <Rect x="10" y="1195" width="120" height="78" rx="36" fill="#fdf1ea" />
// // //         <Ellipse cx="38" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
// // //         <Ellipse cx="102" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
// // //         <Circle cx="55" cy="1230" r="4.5" fill="#3a2a2a" />
// // //         <Circle cx="85" cy="1230" r="4.5" fill="#3a2a2a" />
// // //         <Path d="M62 1243 Q70 1251 78 1243" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// // //       </G>

// // //       {/* front meadow */}
// // //       <Path d={`M0 1285 C140 1230 300 1255 470 1245 C650 1233 800 1205 ${DW} 1185 L${DW} ${DH} L0 ${DH} Z`} fill="#74d13c" />
// // //       <Ellipse cx="300" cy="1330" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

// // //       {/* stones */}
// // //       <Ellipse cx="62" cy="1545" rx="68" ry="40" fill="#9b9b9b" />
// // //       <Ellipse cx="55" cy="1535" rx="50" ry="26" fill="#b4b4b4" />
// // //       <Ellipse cx="880" cy="1545" rx="68" ry="40" fill="#9b9b9b" />
// // //       <Ellipse cx="888" cy="1535" rx="50" ry="26" fill="#b4b4b4" />

// // //       {/* wooden bottom bar (wide, like Level 1) */}
// // //       <Rect x="28" y="1290" width="886" height="312" rx="92" fill="#eaa24f" stroke="#c2782c" strokeWidth="12" />
// // //       <Path d="M70 1340 C300 1332 620 1346 872 1334 M60 1445 C320 1452 640 1436 882 1448 M70 1555 C300 1548 620 1562 872 1552" stroke="#d58f3a" strokeWidth="5" opacity="0.7" fill="none" strokeLinecap="round" />
// // //       <Path d="M110 1318 C320 1312 620 1324 832 1314" stroke="#f5c07c" strokeWidth="4" opacity="0.8" fill="none" strokeLinecap="round" />
// // //       <Circle cx="82" cy="1335" r="9" fill="#8f5a1f" /><Circle cx="860" cy="1335" r="9" fill="#8f5a1f" />
// // //       <Circle cx="82" cy="1556" r="9" fill="#8f5a1f" /><Circle cx="860" cy="1556" r="9" fill="#8f5a1f" />

// // //       {/* grass tufts + flowers */}
// // //       <Tuft x="905" y="1325" /><Tuft x="910" y="1450" /><Tuft x="20" y="1440" />
// // //       <Tuft x="100" y="1660" /><Tuft x="340" y="1660" /><Tuft x="580" y="1660" /><Tuft x="820" y="1660" />
// // //       <Flower x="885" y="1215" s={0.8} />
// // //       <Flower x="200" y="1625" s={0.95} />
// // //       <Flower x="735" y="1625" s={0.95} />
// // //     </Svg>
// // //   );
// // // }

// // // /* ---------- thin link chain for hanging signs (Level 1 style) ---------- */
// // // function Chain({ x, y, h, k }: any) {
// // //   const n = Math.max(2, Math.round(h / 14));
// // //   return (
// // //     <Svg pointerEvents="none" width={12 * k} height={h * k} viewBox={`0 0 12 ${h}`} style={{ position: 'absolute', left: x * k, top: y * k }}>
// // //       {Array.from({ length: n }).map((_, i) => (
// // //         <Ellipse key={i} cx="6" cy={7 + i * (h / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// // //       ))}
// // //     </Svg>
// // //   );
// // // }

// // // /* ---------- double arrow (skip icon) ---------- */
// // // function DoubleArrow({ s }: { s: number }) {
// // //   return (
// // //     <Svg width={s} height={s} viewBox="0 0 100 100">
// // //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // //     </Svg>
// // //   );
// // // }

// // // /* ---------- squish on press ---------- */
// // // function Squish({ style, onPress, disabled, children }: any) {
// // //   const s = useRef(new Animated.Value(1)).current;
// // //   const to = (v: number) => Animated.spring(s, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
// // //   return (
// // //     <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.92)} onPressOut={() => to(1)} style={style}>
// // //       <Animated.View style={{ transform: [{ scale: s }] }}>{children}</Animated.View>
// // //     </Pressable>
// // //   );
// // // }

// // // /* ---------- one draggable symbol (+ or −) ---------- */
// // // function DragSymbol({ ch, size, disabled, onDrop }: {
// // //   ch: Sym; size: number; disabled: boolean;
// // //   onDrop: (ch: Sym, x: number, y: number) => Promise<boolean>;
// // // }) {
// // //   const pan = useRef(new Animated.ValueXY()).current;
// // //   const dropRef = useRef(onDrop);
// // //   const disRef = useRef(disabled);
// // //   dropRef.current = onDrop;
// // //   disRef.current = disabled;
// // //   const [drag, setDrag] = useState(false);

// // //   const back = () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();

// // //   const pr = useRef(PanResponder.create({
// // //     onStartShouldSetPanResponder: () => !disRef.current,
// // //     onPanResponderGrant: () => { setDrag(true); play('drag'); },
// // //     onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
// // //     onPanResponderRelease: async (_, g) => {
// // //       setDrag(false);
// // //       const ok = await dropRef.current(ch, g.moveX, g.moveY);
// // //       if (ok) pan.setValue({ x: 0, y: 0 }); else back();
// // //     },
// // //     onPanResponderTerminate: () => { setDrag(false); back(); },
// // //   })).current;

// // //   return (
// // //     <Animated.View
// // //       {...pr.panHandlers}
// // //       style={{
// // //         width: size, height: size, alignItems: 'center', justifyContent: 'center',
// // //         zIndex: drag ? 50 : 1, elevation: drag ? 20 : 0,
// // //         transform: pan.getTranslateTransform(),
// // //       }}
// // //     >
// // //       <Text style={[st.sym, { fontSize: size * 1.05, lineHeight: size * 1.15 }, drag && { color: GREEN }]}>{LABEL[ch]}</Text>
// // //     </Animated.View>
// // //   );
// // // }

// // // const measure = (ref: React.RefObject<any>) =>
// // //   new Promise<{ x: number; y: number; w: number; h: number } | null>((resolve) => {
// // //     const node: any = ref.current;
// // //     if (!node || !node.measureInWindow) return resolve(null);
// // //     node.measureInWindow((x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }));
// // //   });

// // // /* =====================  SCREEN  ===================== */
// // // export default function BTLevel3Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // //   const { width: winW, height: winH } = useWindowDimensions();
// // //   const box = { w: winW, h: winH };

// // //   const [data, setData] = useState<Level3Start | null>(null);
// // //   const [loadErr, setLoadErr] = useState('');
// // //   const [hints, setHints] = useState(0);
// // //   const [slots, setSlots] = useState<Slots>([null, null]);
// // //   const [fixed, setFixed] = useState<Slots>([null, null]);
// // //   const [msg, setMsg] = useState('');
// // //   const [busy, setBusy] = useState(false);
// // //   const [result, setResult] = useState<Level3Answer | null>(null);
// // //   const [riddle, setRiddle] = useState(false);
// // //   const [clueOpen, setClueOpen] = useState(false);
// // //   const [clueText, setClueText] = useState('');
// // //   const [clueBusy, setClueBusy] = useState(false);
// // //   const [clueErr, setClueErr] = useState(false);

// // //   const slotsRef = useRef<Slots>([null, null]);
// // //   const fixedRef = useRef<Slots>([null, null]);
// // //   slotsRef.current = slots;
// // //   fixedRef.current = fixed;

// // //   const slotRef0 = useRef<View>(null);
// // //   const slotRef1 = useRef<View>(null);
// // //   const slotRefs = [slotRef0, slotRef1];

// // //   const shake = useRef(new Animated.Value(0)).current;
// // //   const sway = useRef(new Animated.Value(0)).current;
// // //   const pop = useRef(new Animated.Value(0)).current;
// // //   const msgTimer = useRef<any>(null);
// // //   const timers = useRef<any[]>([]);

// // //   useEffect(() => {
// // //     const a = Animated.loop(Animated.sequence([
// // //       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // //       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // //     ]));
// // //     a.start();
// // //     return () => a.stop();
// // //   }, []);

// // //   const readRevealed = (list: { slot: number; symbol: Sym }[] | undefined): Slots => {
// // //     const f: Slots = [null, null];
// // //     (list || []).forEach((r) => { if (r.slot === 0 || r.slot === 1) f[r.slot] = r.symbol; });
// // //     return f;
// // //   };

// // //   const load = useCallback(() => {
// // //     setLoadErr('');
// // //     setData(null);
// // //     startLevel3(playerId)
// // //       .then((d) => {
// // //         const f = readRevealed(d.revealed);
// // //         setData(d);
// // //         setHints(d.hints);
// // //         setFixed(f);
// // //         setSlots(f);
// // //       })
// // //       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
// // //   }, [playerId]);

// // //   useEffect(() => {
// // //     load();
// // //     return () => {
// // //       timers.current.forEach(clearTimeout);
// // //       clearTimeout(msgTimer.current);
// // //     };
// // //   }, [load]);

// // //   useEffect(() => {
// // //     if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
// // //   }, [result]);

// // //   useEffect(() => {
// // //     if (data) onHints?.(hints);
// // //   }, [hints, data]);

// // //   const showMsg = (m: string) => {
// // //     setMsg(m);
// // //     clearTimeout(msgTimer.current);
// // //     msgTimer.current = setTimeout(() => setMsg(''), 2600);
// // //   };

// // //   const shakeRow = () => {
// // //     Animated.sequence([
// // //       Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
// // //       Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
// // //       Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
// // //       Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
// // //     ]).start();
// // //   };

// // //   const submit = async (arr: Slots) => {
// // //     if (!data) return;
// // //     setBusy(true);
// // //     try {
// // //       const res = await answerLevel3({ sessionId: data.sessionId, playerId, symbols: arr as Sym[] });
// // //       if (!res.correct) {
// // //         play('wrong');
// // //         showMsg(res.message || 'Not quite. Try again!');
// // //         shakeRow();
// // //         timers.current.push(setTimeout(() => {
// // //           setSlots(fixedRef.current);
// // //           slotsRef.current = fixedRef.current;
// // //           setBusy(false);
// // //         }, 700));
// // //         return;
// // //       }
// // //       if (typeof res.hints === 'number') setHints(res.hints);
// // //       play('correct');
// // //       timers.current.push(setTimeout(() => setResult(res), 700));
// // //     } catch (e: any) {
// // //       showMsg(e.message || 'Network error');
// // //       setSlots(fixedRef.current);
// // //       setBusy(false);
// // //     }
// // //   };

// // //   const handleDrop = async (ch: Sym, px: number, py: number): Promise<boolean> => {
// // //     if (busy || !data || result) return false;

// // //     const rects = await Promise.all(slotRefs.map(measure));
// // //     let best = -1;
// // //     let bestD = Infinity;
// // //     rects.forEach((r, i) => {
// // //       if (!r) return;
// // //       const d = Math.hypot(px - (r.x + r.w / 2), py - (r.y + r.h / 2));
// // //       if (d < bestD) { bestD = d; best = i; }
// // //     });

// // //     const limit = Math.max(60, winW * 0.14);
// // //     if (best < 0 || bestD > limit) return false;
// // //     if (fixedRef.current[best]) return false;

// // //     const next: Slots = [...slotsRef.current];
// // //     next[best] = ch;
// // //     setSlots(next);
// // //     slotsRef.current = next;

// // //     if (next.every(Boolean)) submit(next);
// // //     return true;
// // //   };

// // //   const removeSlot = (i: number) => {
// // //     if (busy || result || fixedRef.current[i]) return;
// // //     setSlots((s) => { const n = [...s]; n[i] = null; return n; });
// // //   };

// // //   const watchVideo = async () => {
// // //     if (busy || result) return;
// // //     setBusy(true);
// // //     try {
// // //       const res = await rewardLevel3(playerId);
// // //       setHints(res.hints);
// // //       showMsg(`+${res.added} coins!`);
// // //     } catch (e: any) {
// // //       showMsg(e.message || 'Reward failed');
// // //     }
// // //     setBusy(false);
// // //   };

// // //   // clue: frontend -> POST /level3/clue -> backend saves the view in MySQL -> JSON back (free)
// // //   const loadClue = async () => {
// // //     if (clueBusy || !data) return;
// // //     setClueBusy(true);
// // //     setClueErr(false);
// // //     try {
// // //       const r = await clueLevel3({ sessionId: data.sessionId, playerId });
// // //       if (r.clue) setClueText(r.clue);
// // //       else setClueErr(true);
// // //     } catch {
// // //       setClueErr(true);
// // //     }
// // //     setClueBusy(false);
// // //   };

// // //   const openClues = () => {
// // //     play('clue');
// // //     setClueOpen(true);
// // //     if (!clueText) loadClue();
// // //   };

// // //   const riddleSolved = async (): Promise<string> => {
// // //     setRiddle(false);
// // //     setResult({
// // //       success: true, correct: true, completed: true, skipped: true,
// // //       message: 'Level skipped!', score: 0, stars: 0,
// // //     });
// // //     return '';
// // //   };

// // //   /* ---------- loading / error ---------- */
// // //   if (loadErr || !data) {
// // //     return (
// // //       <View style={[st.center, { width: winW, height: winH, backgroundColor: SKY }]}>
// // //         {loadErr ? (
// // //           <>
// // //             <Text style={st.errText}>{loadErr}</Text>
// // //             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // //             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // //           </>
// // //         ) : (
// // //           <>
// // //             <ActivityIndicator color="#fff" size="large" />
// // //             <Text style={st.loading}>Loading level 3...</Text>
// // //           </>
// // //         )}
// // //       </View>
// // //     );
// // //   }

// // //   /* ---------- skip riddle screen ---------- */
// // //   if (riddle) {
// // //     return (
// // //       <View style={{ width: winW, height: winH }}>
// // //         <BTSkipRiddle hints={hints} onHome={onExit} onBack={() => setRiddle(false)} onSkipped={riddleSolved} />
// // //       </View>
// // //     );
// // //   }

// // //   // scale the 942x1669 design to the window
// // //   const bw = Math.min(box.w, (box.h * DW) / DH), k = bw / DW, bh = (bw * DH) / DW;
// // //   const top0 = (box.h - bh) / 2;
// // //   const P = (v: number) => v * k;
// // //   const A = (x: number, y: number, w: number, h: number): any => ({ position: 'absolute', left: P(x), top: P(y), width: P(w), height: P(h) });

// // //   const [n1, n2, n3] = data.numbers;
// // //   const u = P(112);
// // //   const gap = P(92);
// // //   const numStyle = [st.num, { fontSize: P(112), lineHeight: P(124), minWidth: P(70) }];
// // //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// // //   const home = (ch: Sym) =>
// // //     slots.includes(ch)
// // //       ? <View style={[st.homeEmpty, { width: u, height: u, borderRadius: u / 2 }]} />
// // //       : <DragSymbol ch={ch} size={u} disabled={busy || !!result} onDrop={handleDrop} />;

// // //   const gapView = (i: number) => (
// // //     <View ref={slotRefs[i]} collapsable={false} style={{ width: gap, height: u, alignItems: 'center', justifyContent: 'center' }}>
// // //       {slots[i] ? (
// // //         <TouchableOpacity activeOpacity={0.8} disabled={!!fixed[i] || busy || !!result} onPress={() => removeSlot(i)}>
// // //           <Text style={[st.sym, { fontSize: u * 1.05, lineHeight: u * 1.15 }]}>{LABEL[slots[i] as Sym]}</Text>
// // //         </TouchableOpacity>
// // //       ) : (
// // //         <View style={[st.slotRing, { width: gap * 0.72, height: gap * 0.72, borderRadius: gap }]} />
// // //       )}
// // //     </View>
// // //   );

// // //   const costPill = (x: number, w: number, icon: any, text: string) => (
// // //     <View style={[A(x, 1527, w, 67), { borderRadius: P(34), backgroundColor: '#6b4423', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10) }]}>
// // //       {icon}<Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{text}</Text>
// // //     </View>
// // //   );
// // //   const circleBtn = (x: number, bgc: string, bc: string, onPress: any, icon: any) => (
// // //     <Squish style={A(x, 1351, 166, 166)} onPress={onPress}>
// // //       <View style={{ width: P(166), height: P(166), borderRadius: P(83), backgroundColor: bgc, borderWidth: P(14), borderColor: bc, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>{icon}</View>
// // //     </Squish>
// // //   );
// // //   // yellow round buttons (home / settings), Level 1 style
// // //   const woodBtn = (x: number, onPress: any, icon: any) => (
// // //     <Squish style={A(x, 111, 78, 78)} onPress={onPress}>
// // //       <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: '#fbc02d', borderWidth: P(5), borderColor: '#d98e1c', alignItems: 'center', justifyContent: 'center', elevation: 4 }}>{icon}</View>
// // //     </Squish>
// // //   );

// // //   return (
// // //     <View style={{ width: winW, height: winH, backgroundColor: SKY, overflow: 'hidden' }}>
// // //       {/* grass fill if the window is taller than the design */}
// // //       <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: top0 + P(1500), bottom: 0, backgroundColor: GRASS }} />

// // //       <View style={{ position: 'absolute', left: (box.w - bw) / 2, top: top0, width: bw, height: bh }}>
// // //         <Garden w={bw} h={bh} />

// // //         {/* top: home, settings */}
// // //         {woodBtn(27, onExit, <Icon n="home" s={P(42)} />)}
// // //         {woodBtn(119, undefined, <Icon n="gear" s={P(44)} />)}

// // //         {/* level sign (hangs on chains) */}
// // //         <Animated.View style={[A(300, 70, 346, 160), { transform: [{ rotate: swayR }] }]}>
// // //           <Chain x={52} y={0} h={50} k={k} />
// // //           <Chain x={282} y={0} h={50} k={k} />
// // //           <View style={{ position: 'absolute', left: 0, top: P(42), width: P(346), height: P(98), borderRadius: P(10), backgroundColor: '#bd6b29', borderWidth: P(6), borderColor: WOOD_DD, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
// // //             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10), flexWrap: 'nowrap' }}>
// // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'<'}</Text>
// // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{'LEVEL 3'}</Text>
// // //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'>'}</Text>
// // //             </View>
// // //           </View>
// // //         </Animated.View>

// // //         {/* bulbs counter (dashed cloud pill) */}
// // //         <View style={[A(728, 128, 142, 64), { borderRadius: P(32), backgroundColor: CREAM, borderWidth: P(3), borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingRight: P(26), alignItems: 'center', elevation: 4 }]}>
// // //           <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(44), fontWeight: '900', color: INK, includeFontPadding: false }}>{hints}</Text>
// // //         </View>
// // //         <View style={A(846, 108, 68, 68)}><Icon n="bulb" s={P(68)} /></View>

// // //         {/* question pill (2 lines) */}
// // //         <View style={[A(40, 262, 862, 150), { borderRadius: P(70), backgroundColor: CREAM, borderWidth: P(4), borderColor: '#ead2a4', alignItems: 'center', justifyContent: 'center', elevation: 4 }]}>
// // //           <Text style={{ position: 'absolute', left: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'<'}</Text>
// // //           <Text style={{ position: 'absolute', right: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'>'}</Text>
// // //           <Text numberOfLines={2} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(40), lineHeight: P(52), color: '#17307a', maxWidth: P(640), textAlign: 'center' }}>{data.question}</Text>
// // //         </View>

// // //         {/* wooden frames behind the two pictures */}
// // //         <View pointerEvents="none" style={[A(52, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />
// // //         <View pointerEvents="none" style={[A(482, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />

// // //         {/* the two pictures */}
// // //         <View style={A(66, 440, 380, 494)}><SpotScene side="a" width={P(380)} /></View>
// // //         <View style={A(496, 440, 380, 494)}><SpotScene side="b" width={P(380)} /></View>

// // //         {/* + 1 _ 2 _ 3 − */}
// // //         <Animated.View style={[A(0, 985, 942, 140), { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 10, elevation: 10, transform: [{ translateX: shake }] }]}>
// // //           {home('+')}
// // //           <Text style={numStyle}>{n1}</Text>
// // //           {gapView(0)}
// // //           <Text style={numStyle}>{n2}</Text>
// // //           {gapView(1)}
// // //           <Text style={numStyle}>{n3}</Text>
// // //           {home('-')}
// // //         </Animated.View>

// // //         {/* message line */}
// // //         {!!msg && (
// // //           <View pointerEvents="none" style={[A(60, 1170, 822, 68), { zIndex: 20, elevation: 20, alignItems: 'center', justifyContent: 'center' }]}>
// // //             <View style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: P(34), paddingHorizontal: P(34), paddingVertical: P(8) }}>
// // //               <Text numberOfLines={2} style={{ fontFamily: F, fontSize: P(34), fontWeight: 'bold', color: '#c0392b', textAlign: 'center' }}>{msg}</Text>
// // //             </View>
// // //           </View>
// // //         )}

// // //         {/* clue / video / skip */}
// // //         {circleBtn(143, '#a4e02a', '#f4f1dc', openClues, <Icon n="search" s={P(78)} />)}
// // //         {costPill(152, 150, <Icon n="bulb" s={P(38)} />, String(COST_CLUE))}
// // //         {circleBtn(388, '#f7ebd4', '#fbf3e3', watchVideo, <Icon n="film" s={P(92)} />)}
// // //         {costPill(391, 162, <Coin s={P(30)} />, '+' + REWARD)}
// // //         {circleBtn(637, '#f0434d', '#fbf3e3', () => setRiddle(true), <DoubleArrow s={P(86)} />)}
// // //         {costPill(645, 151, <Icon n="bulb" s={P(38)} />, String(COST_SKIP))}

// // //         {/* ---- clue popup (one clue, loaded from the backend) ---- */}
// // //         {clueOpen && (
// // //           <>
// // //             <Pressable onPress={() => setClueOpen(false)} style={[A(0, 0, DW, DH), { zIndex: 40, elevation: 40, backgroundColor: 'rgba(10,25,60,0.5)' }]} />
// // //             <View style={[A(60, 430, 822, 560), { zIndex: 41, elevation: 41, borderRadius: P(56), backgroundColor: CREAM, borderWidth: P(14), borderColor: WOOD_D }]}>
// // //               <Text style={{ position: 'absolute', left: 0, right: 0, top: P(34), textAlign: 'center', fontFamily: F, fontSize: P(56), fontWeight: '900', color: NAVY, includeFontPadding: false }}>CLUES</Text>
// // //               <Squish style={A(660, 22, 78, 78)} onPress={() => setClueOpen(false)}>
// // //                 <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: WOOD, borderWidth: P(5), borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center' }}><Icon n="cross" s={P(40)} /></View>
// // //               </Squish>

// // //               <Squish style={A(36, 130, 720, 330)} disabled={!clueErr || clueBusy} onPress={loadClue}>
// // //                 <View style={{ width: P(720), height: P(330), borderRadius: P(40), backgroundColor: '#ffffff', borderWidth: P(6), borderColor: GREEN, flexDirection: 'row', alignItems: 'center', paddingHorizontal: P(28), gap: P(24) }}>
// // //                   <View style={{ width: P(110), height: P(110), borderRadius: P(55), backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' }}>
// // //                     <Text style={{ fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#fff', includeFontPadding: false }}>1</Text>
// // //                   </View>
// // //                   <View style={{ flex: 1 }}>
// // //                     <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#bd6b29', includeFontPadding: false }}>Clue 1</Text>
// // //                     <Text numberOfLines={7} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(32), lineHeight: P(41), color: clueErr && !clueBusy ? '#c0392b' : '#17307a', marginTop: P(6) }}>
// // //                       {clueBusy ? 'Loading clue...' : clueErr ? CLUE_ERR_TEXT : clueText}
// // //                     </Text>
// // //                   </View>
// // //                 </View>
// // //               </Squish>
// // //             </View>
// // //           </>
// // //         )}

// // //         {/* ---- level complete ---- */}
// // //         {!!result && (
// // //           <View style={[A(0, 0, DW, DH), { zIndex: 60, elevation: 60, backgroundColor: 'rgba(10,25,60,0.55)', alignItems: 'center', justifyContent: 'center' }]}>
// // //             <Animated.View style={{ width: P(702), alignItems: 'center', backgroundColor: CREAM, borderWidth: P(12), borderColor: WOOD_D, borderRadius: P(56), paddingVertical: P(44), paddingHorizontal: P(30), opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
// // //               <Text style={{ fontFamily: F, fontSize: P(64), fontWeight: '900', color: NAVY }}>Level complete!</Text>
// // //               <Text style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(38), color: '#17307a', textAlign: 'center', marginTop: P(10) }}>{result.message}</Text>
// // //               <View style={{ flexDirection: 'row', gap: P(10), marginTop: P(26) }}>
// // //                 {[1, 2, 3].map((c) => <StarIcon key={c} size={P(84)} on={c <= (result.stars || 0)} />)}
// // //               </View>
// // //               {!result.skipped && <Text style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#bd6b29', marginTop: P(18) }}>{'Score ' + result.score}</Text>}
// // //               <TouchableOpacity activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}
// // //                 style={{ marginTop: P(34), minWidth: P(320), height: P(104), borderRadius: P(52), backgroundColor: '#a4d732', borderWidth: P(8), borderColor: K, alignItems: 'center', justifyContent: 'center' }}>
// // //                 <Text style={{ fontFamily: F, fontSize: P(54), fontWeight: '900', color: K }}>NEXT</Text>
// // //               </TouchableOpacity>
// // //             </Animated.View>
// // //           </View>
// // //         )}
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // const st = StyleSheet.create({
// // //   center: { alignItems: 'center', justifyContent: 'center' },
// // //   loading: { fontFamily: F, fontSize: 18, color: '#fff', marginTop: 12 },
// // //   errText: { fontFamily: F, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// // //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: '#a4d732', borderWidth: 2.5, borderColor: K },
// // //   retryT: { fontFamily: F, fontSize: 20, fontWeight: '800', color: K },
// // //   back: { fontFamily: F, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },

// // //   num: { fontFamily: F, fontWeight: '900', color: NAVY, textAlign: 'center', includeFontPadding: false },
// // //   sym: { fontFamily: F, fontWeight: '900', color: ORANGE, textAlign: 'center', includeFontPadding: false },
// // //   homeEmpty: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.25)' },
// // //   slotRing: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.5)', backgroundColor: 'rgba(255,255,255,0.35)' },
// // // });
// // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // import {
// //   View, Text, Animated, PanResponder, Pressable, StyleSheet, Platform, Easing,
// //   ActivityIndicator, TouchableOpacity, useWindowDimensions,
// // } from 'react-native';
// // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // import { startLevel3, answerLevel3, rewardLevel3, clueLevel3, Level3Start, Level3Answer, Sym } from './Btlevel3api';
// // import { SpotScene } from './Btlevel3art';
// // import { StarIcon } from './Btlevel2art';
// // import { F, INK, Coin } from './BTShared';
// // import { Icon } from './Art';
// // import BTSkipRiddle from './BTSkipRiddle';
// // import { play } from './BTSound';

// // /**
// //  * Level 3 - spot the differences, put + and − between 1 2 3.
// //  * GARDEN THEME (matches Level 1): blue sky, trees, fence, sprout, bookshelf, meadow, wide wooden bottom bar.
// //  * No pencil / eraser on this screen.
// //  * Clue: frontend -> POST /level3/clue -> backend saves the view in MySQL -> JSON back.
// //  */

// // const NAVY = '#132f70', CREAM = '#faf0e2', K = '#1d1d1d', ORANGE = '#f5a623', GREEN = '#3ec75a';
// // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });
// // const DW = 942, DH = 1669;
// // const SKY = '#5cc0f5', GRASS = '#74d13c';
// // const WOOD = '#eba24e', WOOD_D = '#c2782c', WOOD_DD = '#8f5a1f';
// // const COST_CLUE = 25, COST_SKIP = 50, REWARD = 75; // only shown on the pills

// // // shown if the server cannot be reached, so the player always sees the clue
// // const CLUE_FALLBACK =
// //   'Sometimes the smallest changes make the biggest difference. Look closely at the numbers and follow the signs.';

// // const LABEL: Record<Sym, string> = { '+': '+', '-': '−' };
// // type Slots = (Sym | null)[];

// // type Props = {
// //   playerId: number;
// //   onHints?: (h: number) => void;
// //   onExit: () => void;
// //   onComplete?: (result: Level3Answer) => void;
// // };

// // /* ---------- the garden scene ---------- */
// // function Flower({ x, y, s = 1 }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// //       {[0, 72, 144, 216, 288].map(a => (
// //         <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
// //       ))}
// //       <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
// //     </G>
// //   );
// // }

// // function Tuft({ x, y }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
// //       <Polygon points="-14,0 -8,-34 -2,0" />
// //       <Polygon points="-4,0 4,-44 12,0" />
// //       <Polygon points="8,0 18,-30 24,0" />
// //     </G>
// //   );
// // }

// // function Cloud({ x, y, s = 1 }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
// //       <Ellipse cx="0" cy="0" rx="70" ry="26" />
// //       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
// //       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
// //     </G>
// //   );
// // }

// // function Garden({ w, h }: any) {
// //   return (
// //     <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{ position: 'absolute', left: 0, top: 0 }}>
// //       <Defs>
// //         <LinearGradient id="g3sky" x1="0" y1="0" x2="0" y2="1">
// //           <Stop offset="0" stopColor="#46b6f3" />
// //           <Stop offset="1" stopColor="#c2e8fb" />
// //         </LinearGradient>
// //         <LinearGradient id="g3grass" x1="0" y1="0" x2="0" y2="1">
// //           <Stop offset="0" stopColor="#7ed63f" />
// //           <Stop offset="1" stopColor="#6cc934" />
// //         </LinearGradient>
// //         <LinearGradient id="g3wood" x1="0" y1="0" x2="0" y2="1">
// //           <Stop offset="0" stopColor="#f0a850" />
// //           <Stop offset="1" stopColor="#e69a3f" />
// //         </LinearGradient>
// //       </Defs>
// //       <Rect width={DW} height={DH} fill="url(#g3sky)" />

// //       {/* trees top corners */}
// //       <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// //       <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// //       <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
// //       <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />

// //       {/* clouds */}
// //       <Cloud x={850} y={245} s={1} />
// //       <Cloud x={50} y={985} s={0.9} />
// //       <Cloud x={880} y={1000} s={0.6} />

// //       {/* rolling hills */}
// //       <Ellipse cx="150" cy="1160" rx="300" ry="150" fill="#9ad95f" />
// //       <Ellipse cx="640" cy="1210" rx="420" ry="120" fill="#6cc13a" />
// //       <Ellipse cx="900" cy="1170" rx="200" ry="110" fill="#5fb832" />

// //       {/* fence: pickets first, rails in front */}
// //       {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
// //         const x = -10 + i * 90;
// //         return (
// //           <G key={i}>
// //             <Polygon points={`${x},1130 ${x + 33},1098 ${x + 66},1130`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// //             <Rect x={x} y="1130" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// //           </G>
// //         );
// //       })}
// //       <Rect x="0" y="1160" width={DW} height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
// //       <Rect x="0" y="1208" width={DW} height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

// //       {/* bookshelf (right) with potted plant */}
// //       <G>
// //         <Rect x="845" y="590" width="80" height="18" rx="4" fill="#e8903a" />
// //         <Polygon points="852,608 918,608 910,650 860,650" fill="#f0a050" />
// //         <G fill="#4cb04a">
// //           <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(-28 885 598)" />
// //           <Ellipse cx="885" cy="540" rx="20" ry="62" fill="#3a9a3c" />
// //           <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(28 885 598)" />
// //         </G>
// //         <Rect x="780" y="650" width="162" height="575" fill="#eaa24f" />
// //         <Rect x="796" y="666" width="146" height="545" fill="#dc9d4f" />
// //         <Rect x="780" y="840" width="162" height="16" fill="#f2b866" />
// //         <Rect x="780" y="1030" width="162" height="16" fill="#f2b866" />
// //         <Rect x="780" y="650" width="162" height="16" fill="#f2b866" />
// //         {/* row 1 */}
// //         <Rect x="810" y="710" width="36" height="130" fill="#2a9d9d" />
// //         <Rect x="850" y="690" width="34" height="150" fill="#f06ba8" />
// //         <Rect x="888" y="715" width="40" height="125" fill="#8a63da" />
// //         {/* row 2 */}
// //         <Rect x="805" y="915" width="30" height="115" fill="#e5484d" />
// //         <Rect x="840" y="890" width="24" height="140" fill="#3b82e0" />
// //         <Rect x="868" y="910" width="38" height="120" fill="#4caf50" />
// //         {/* row 3 */}
// //         <Rect x="810" y="1095" width="34" height="120" fill="#f5c518" />
// //         <Rect x="848" y="1065" width="40" height="150" fill="#2c6fdc" />
// //       </G>

// //       {/* sprout friend (left, from Level 1) */}
// //       <G>
// //         <G fill="#5cb85c">
// //           <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(-25 70 1198)" />
// //           <Ellipse cx="70" cy="1140" rx="22" ry="62" fill="#6cc56a" />
// //           <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(25 70 1198)" />
// //         </G>
// //         <Rect x="10" y="1195" width="120" height="78" rx="36" fill="#fdf1ea" />
// //         <Ellipse cx="38" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
// //         <Ellipse cx="102" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
// //         <Circle cx="55" cy="1230" r="4.5" fill="#3a2a2a" />
// //         <Circle cx="85" cy="1230" r="4.5" fill="#3a2a2a" />
// //         <Path d="M62 1243 Q70 1251 78 1243" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// //       </G>

// //       {/* front meadow */}
// //       <Path d={`M0 1285 C140 1230 300 1255 470 1245 C650 1233 800 1205 ${DW} 1185 L${DW} ${DH} L0 ${DH} Z`} fill="#74d13c" />
// //       <Ellipse cx="300" cy="1330" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

// //       {/* stones */}
// //       <Ellipse cx="62" cy="1545" rx="68" ry="40" fill="#9b9b9b" />
// //       <Ellipse cx="55" cy="1535" rx="50" ry="26" fill="#b4b4b4" />
// //       <Ellipse cx="880" cy="1545" rx="68" ry="40" fill="#9b9b9b" />
// //       <Ellipse cx="888" cy="1535" rx="50" ry="26" fill="#b4b4b4" />

// //       {/* wooden bottom bar (wide, like Level 1) */}
// //       <Rect x="28" y="1290" width="886" height="312" rx="92" fill="#eaa24f" stroke="#c2782c" strokeWidth="12" />
// //       <Path d="M70 1340 C300 1332 620 1346 872 1334 M60 1445 C320 1452 640 1436 882 1448 M70 1555 C300 1548 620 1562 872 1552" stroke="#d58f3a" strokeWidth="5" opacity="0.7" fill="none" strokeLinecap="round" />
// //       <Path d="M110 1318 C320 1312 620 1324 832 1314" stroke="#f5c07c" strokeWidth="4" opacity="0.8" fill="none" strokeLinecap="round" />
// //       <Circle cx="82" cy="1335" r="9" fill="#8f5a1f" /><Circle cx="860" cy="1335" r="9" fill="#8f5a1f" />
// //       <Circle cx="82" cy="1556" r="9" fill="#8f5a1f" /><Circle cx="860" cy="1556" r="9" fill="#8f5a1f" />

// //       {/* grass tufts + flowers */}
// //       <Tuft x="905" y="1325" /><Tuft x="910" y="1450" /><Tuft x="20" y="1440" />
// //       <Tuft x="100" y="1660" /><Tuft x="340" y="1660" /><Tuft x="580" y="1660" /><Tuft x="820" y="1660" />
// //       <Flower x="885" y="1215" s={0.8} />
// //       <Flower x="200" y="1625" s={0.95} />
// //       <Flower x="735" y="1625" s={0.95} />
// //     </Svg>
// //   );
// // }

// // /* ---------- thin link chain for hanging signs (Level 1 style) ---------- */
// // function Chain({ x, y, h, k }: any) {
// //   const n = Math.max(2, Math.round(h / 14));
// //   return (
// //     <Svg pointerEvents="none" width={12 * k} height={h * k} viewBox={`0 0 12 ${h}`} style={{ position: 'absolute', left: x * k, top: y * k }}>
// //       {Array.from({ length: n }).map((_, i) => (
// //         <Ellipse key={i} cx="6" cy={7 + i * (h / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// //       ))}
// //     </Svg>
// //   );
// // }

// // /* ---------- double arrow (skip icon) ---------- */
// // function DoubleArrow({ s }: { s: number }) {
// //   return (
// //     <Svg width={s} height={s} viewBox="0 0 100 100">
// //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// //     </Svg>
// //   );
// // }

// // /* ---------- squish on press ---------- */
// // function Squish({ style, onPress, disabled, children }: any) {
// //   const s = useRef(new Animated.Value(1)).current;
// //   const to = (v: number) => Animated.spring(s, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
// //   return (
// //     <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.92)} onPressOut={() => to(1)} style={style}>
// //       <Animated.View style={{ transform: [{ scale: s }] }}>{children}</Animated.View>
// //     </Pressable>
// //   );
// // }

// // /* ---------- one draggable symbol (+ or −) ---------- */
// // function DragSymbol({ ch, size, disabled, onDrop }: {
// //   ch: Sym; size: number; disabled: boolean;
// //   onDrop: (ch: Sym, x: number, y: number) => Promise<boolean>;
// // }) {
// //   const pan = useRef(new Animated.ValueXY()).current;
// //   const dropRef = useRef(onDrop);
// //   const disRef = useRef(disabled);
// //   dropRef.current = onDrop;
// //   disRef.current = disabled;
// //   const [drag, setDrag] = useState(false);

// //   const back = () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();

// //   const pr = useRef(PanResponder.create({
// //     onStartShouldSetPanResponder: () => !disRef.current,
// //     onPanResponderGrant: () => { setDrag(true); play('drag'); },
// //     onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
// //     onPanResponderRelease: async (_, g) => {
// //       setDrag(false);
// //       const ok = await dropRef.current(ch, g.moveX, g.moveY);
// //       if (ok) pan.setValue({ x: 0, y: 0 }); else back();
// //     },
// //     onPanResponderTerminate: () => { setDrag(false); back(); },
// //   })).current;

// //   return (
// //     <Animated.View
// //       {...pr.panHandlers}
// //       style={{
// //         width: size, height: size, alignItems: 'center', justifyContent: 'center',
// //         zIndex: drag ? 50 : 1, elevation: drag ? 20 : 0,
// //         transform: pan.getTranslateTransform(),
// //       }}
// //     >
// //       <Text style={[st.sym, { fontSize: size * 1.05, lineHeight: size * 1.15 }, drag && { color: GREEN }]}>{LABEL[ch]}</Text>
// //     </Animated.View>
// //   );
// // }

// // const measure = (ref: React.RefObject<any>) =>
// //   new Promise<{ x: number; y: number; w: number; h: number } | null>((resolve) => {
// //     const node: any = ref.current;
// //     if (!node || !node.measureInWindow) return resolve(null);
// //     node.measureInWindow((x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }));
// //   });

// // /* =====================  SCREEN  ===================== */
// // export default function BTLevel3Screen({ playerId, onHints, onExit, onComplete }: Props) {
// //   const { width: winW, height: winH } = useWindowDimensions();
// //   const box = { w: winW, h: winH };

// //   const [data, setData] = useState<Level3Start | null>(null);
// //   const [loadErr, setLoadErr] = useState('');
// //   const [hints, setHints] = useState(0);
// //   const [slots, setSlots] = useState<Slots>([null, null]);
// //   const [fixed, setFixed] = useState<Slots>([null, null]);
// //   const [msg, setMsg] = useState('');
// //   const [busy, setBusy] = useState(false);
// //   const [result, setResult] = useState<Level3Answer | null>(null);
// //   const [riddle, setRiddle] = useState(false);
// //   const [clueOpen, setClueOpen] = useState(false);
// //   const [clueText, setClueText] = useState('');
// //   const [clueBusy, setClueBusy] = useState(false);

// //   const slotsRef = useRef<Slots>([null, null]);
// //   const fixedRef = useRef<Slots>([null, null]);
// //   slotsRef.current = slots;
// //   fixedRef.current = fixed;

// //   const slotRef0 = useRef<View>(null);
// //   const slotRef1 = useRef<View>(null);
// //   const slotRefs = [slotRef0, slotRef1];

// //   const shake = useRef(new Animated.Value(0)).current;
// //   const sway = useRef(new Animated.Value(0)).current;
// //   const pop = useRef(new Animated.Value(0)).current;
// //   const msgTimer = useRef<any>(null);
// //   const timers = useRef<any[]>([]);

// //   useEffect(() => {
// //     const a = Animated.loop(Animated.sequence([
// //       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //     ]));
// //     a.start();
// //     return () => a.stop();
// //   }, []);

// //   const readRevealed = (list: { slot: number; symbol: Sym }[] | undefined): Slots => {
// //     const f: Slots = [null, null];
// //     (list || []).forEach((r) => { if (r.slot === 0 || r.slot === 1) f[r.slot] = r.symbol; });
// //     return f;
// //   };

// //   const load = useCallback(() => {
// //     setLoadErr('');
// //     setData(null);
// //     startLevel3(playerId)
// //       .then((d) => {
// //         const f = readRevealed(d.revealed);
// //         setData(d);
// //         setHints(d.hints);
// //         setFixed(f);
// //         setSlots(f);
// //       })
// //       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
// //   }, [playerId]);

// //   useEffect(() => {
// //     load();
// //     return () => {
// //       timers.current.forEach(clearTimeout);
// //       clearTimeout(msgTimer.current);
// //     };
// //   }, [load]);

// //   useEffect(() => {
// //     if (result) Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
// //   }, [result]);

// //   useEffect(() => {
// //     if (data) onHints?.(hints);
// //   }, [hints, data]);

// //   const showMsg = (m: string) => {
// //     setMsg(m);
// //     clearTimeout(msgTimer.current);
// //     msgTimer.current = setTimeout(() => setMsg(''), 2600);
// //   };

// //   const shakeRow = () => {
// //     Animated.sequence([
// //       Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
// //       Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
// //       Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
// //       Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
// //     ]).start();
// //   };

// //   const submit = async (arr: Slots) => {
// //     if (!data) return;
// //     setBusy(true);
// //     try {
// //       const res = await answerLevel3({ sessionId: data.sessionId, playerId, symbols: arr as Sym[] });
// //       if (!res.correct) {
// //         play('wrong');
// //         showMsg(res.message || 'Not quite. Try again!');
// //         shakeRow();
// //         timers.current.push(setTimeout(() => {
// //           setSlots(fixedRef.current);
// //           slotsRef.current = fixedRef.current;
// //           setBusy(false);
// //         }, 700));
// //         return;
// //       }
// //       if (typeof res.hints === 'number') setHints(res.hints);
// //       play('correct');
// //       timers.current.push(setTimeout(() => setResult(res), 700));
// //     } catch (e: any) {
// //       showMsg(e.message || 'Network error');
// //       setSlots(fixedRef.current);
// //       setBusy(false);
// //     }
// //   };

// //   const handleDrop = async (ch: Sym, px: number, py: number): Promise<boolean> => {
// //     if (busy || !data || result) return false;

// //     const rects = await Promise.all(slotRefs.map(measure));
// //     let best = -1;
// //     let bestD = Infinity;
// //     rects.forEach((r, i) => {
// //       if (!r) return;
// //       const d = Math.hypot(px - (r.x + r.w / 2), py - (r.y + r.h / 2));
// //       if (d < bestD) { bestD = d; best = i; }
// //     });

// //     const limit = Math.max(60, winW * 0.14);
// //     if (best < 0 || bestD > limit) return false;
// //     if (fixedRef.current[best]) return false;

// //     const next: Slots = [...slotsRef.current];
// //     next[best] = ch;
// //     setSlots(next);
// //     slotsRef.current = next;

// //     if (next.every(Boolean)) submit(next);
// //     return true;
// //   };

// //   const removeSlot = (i: number) => {
// //     if (busy || result || fixedRef.current[i]) return;
// //     setSlots((s) => { const n = [...s]; n[i] = null; return n; });
// //   };

// //   const watchVideo = async () => {
// //     if (busy || result) return;
// //     setBusy(true);
// //     try {
// //       const res = await rewardLevel3(playerId);
// //       setHints(res.hints);
// //       showMsg(`+${res.added} coins!`);
// //     } catch (e: any) {
// //       showMsg(e.message || 'Reward failed');
// //     }
// //     setBusy(false);
// //   };

// //   // clue: frontend -> POST /level3/clue -> backend saves the view in MySQL -> JSON back (free).
// //   // If the request fails the player still sees the clue, and the console shows the real reason.
// //   const loadClue = async () => {
// //     if (clueBusy) return;
// //     setClueBusy(true);
// //     try {
// //       if (!data) throw new Error('level not loaded');
// //       const r = await clueLevel3({ sessionId: data.sessionId, playerId });
// //       setClueText(r.clue || CLUE_FALLBACK);
// //     } catch (e: any) {
// //       console.warn('[L3 clue error]', e?.message);
// //       setClueText(CLUE_FALLBACK);
// //     }
// //     setClueBusy(false);
// //   };

// //   const openClues = () => {
// //     play('clue');
// //     setClueOpen(true);
// //     if (!clueText) loadClue();
// //   };

// //   const riddleSolved = async (): Promise<string> => {
// //     setRiddle(false);
// //     setResult({
// //       success: true, correct: true, completed: true, skipped: true,
// //       message: 'Level skipped!', score: 0, stars: 0,
// //     });
// //     return '';
// //   };

// //   /* ---------- loading / error ---------- */
// //   if (loadErr || !data) {
// //     return (
// //       <View style={[st.center, { width: winW, height: winH, backgroundColor: SKY }]}>
// //         {loadErr ? (
// //           <>
// //             <Text style={st.errText}>{loadErr}</Text>
// //             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// //             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// //           </>
// //         ) : (
// //           <>
// //             <ActivityIndicator color="#fff" size="large" />
// //             <Text style={st.loading}>Loading level 3...</Text>
// //           </>
// //         )}
// //       </View>
// //     );
// //   }

// //   /* ---------- skip riddle screen ---------- */
// //   if (riddle) {
// //     return (
// //       <View style={{ width: winW, height: winH }}>
// //         <BTSkipRiddle hints={hints} onHome={onExit} onBack={() => setRiddle(false)} onSkipped={riddleSolved} />
// //       </View>
// //     );
// //   }

// //   // scale the 942x1669 design to the window
// //   const bw = Math.min(box.w, (box.h * DW) / DH), k = bw / DW, bh = (bw * DH) / DW;
// //   const top0 = (box.h - bh) / 2;
// //   const P = (v: number) => v * k;
// //   const A = (x: number, y: number, w: number, h: number): any => ({ position: 'absolute', left: P(x), top: P(y), width: P(w), height: P(h) });

// //   const [n1, n2, n3] = data.numbers;
// //   const u = P(112);
// //   const gap = P(92);
// //   const numStyle = [st.num, { fontSize: P(112), lineHeight: P(124), minWidth: P(70) }];
// //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// //   const home = (ch: Sym) =>
// //     slots.includes(ch)
// //       ? <View style={[st.homeEmpty, { width: u, height: u, borderRadius: u / 2 }]} />
// //       : <DragSymbol ch={ch} size={u} disabled={busy || !!result} onDrop={handleDrop} />;

// //   const gapView = (i: number) => (
// //     <View ref={slotRefs[i]} collapsable={false} style={{ width: gap, height: u, alignItems: 'center', justifyContent: 'center' }}>
// //       {slots[i] ? (
// //         <TouchableOpacity activeOpacity={0.8} disabled={!!fixed[i] || busy || !!result} onPress={() => removeSlot(i)}>
// //           <Text style={[st.sym, { fontSize: u * 1.05, lineHeight: u * 1.15 }]}>{LABEL[slots[i] as Sym]}</Text>
// //         </TouchableOpacity>
// //       ) : (
// //         <View style={[st.slotRing, { width: gap * 0.72, height: gap * 0.72, borderRadius: gap }]} />
// //       )}
// //     </View>
// //   );

// //   const costPill = (x: number, w: number, icon: any, text: string) => (
// //     <View style={[A(x, 1527, w, 67), { borderRadius: P(34), backgroundColor: '#6b4423', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10) }]}>
// //       {icon}<Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{text}</Text>
// //     </View>
// //   );
// //   const circleBtn = (x: number, bgc: string, bc: string, onPress: any, icon: any) => (
// //     <Squish style={A(x, 1351, 166, 166)} onPress={onPress}>
// //       <View style={{ width: P(166), height: P(166), borderRadius: P(83), backgroundColor: bgc, borderWidth: P(14), borderColor: bc, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>{icon}</View>
// //     </Squish>
// //   );
// //   // yellow round buttons (home / settings), Level 1 style
// //   const woodBtn = (x: number, onPress: any, icon: any) => (
// //     <Squish style={A(x, 111, 78, 78)} onPress={onPress}>
// //       <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: '#fbc02d', borderWidth: P(5), borderColor: '#d98e1c', alignItems: 'center', justifyContent: 'center', elevation: 4 }}>{icon}</View>
// //     </Squish>
// //   );

// //   return (
// //     <View style={{ width: winW, height: winH, backgroundColor: SKY, overflow: 'hidden' }}>
// //       {/* grass fill if the window is taller than the design */}
// //       <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: top0 + P(1500), bottom: 0, backgroundColor: GRASS }} />

// //       <View style={{ position: 'absolute', left: (box.w - bw) / 2, top: top0, width: bw, height: bh }}>
// //         <Garden w={bw} h={bh} />

// //         {/* top: home, settings */}
// //         {woodBtn(27, onExit, <Icon n="home" s={P(42)} />)}
// //         {woodBtn(119, undefined, <Icon n="gear" s={P(44)} />)}

// //         {/* level sign (hangs on chains) */}
// //         <Animated.View style={[A(300, 70, 346, 160), { transform: [{ rotate: swayR }] }]}>
// //           <Chain x={52} y={0} h={50} k={k} />
// //           <Chain x={282} y={0} h={50} k={k} />
// //           <View style={{ position: 'absolute', left: 0, top: P(42), width: P(346), height: P(98), borderRadius: P(10), backgroundColor: '#bd6b29', borderWidth: P(6), borderColor: WOOD_DD, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
// //             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10), flexWrap: 'nowrap' }}>
// //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'<'}</Text>
// //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{'LEVEL 3'}</Text>
// //               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'>'}</Text>
// //             </View>
// //           </View>
// //         </Animated.View>

// //         {/* bulbs counter (dashed cloud pill) */}
// //         <View style={[A(728, 128, 142, 64), { borderRadius: P(32), backgroundColor: CREAM, borderWidth: P(3), borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingRight: P(26), alignItems: 'center', elevation: 4 }]}>
// //           <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(44), fontWeight: '900', color: INK, includeFontPadding: false }}>{hints}</Text>
// //         </View>
// //         <View style={A(846, 108, 68, 68)}><Icon n="bulb" s={P(68)} /></View>

// //         {/* question pill (2 lines) */}
// //         <View style={[A(40, 262, 862, 150), { borderRadius: P(70), backgroundColor: CREAM, borderWidth: P(4), borderColor: '#ead2a4', alignItems: 'center', justifyContent: 'center', elevation: 4 }]}>
// //           <Text style={{ position: 'absolute', left: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'<'}</Text>
// //           <Text style={{ position: 'absolute', right: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'>'}</Text>
// //           <Text numberOfLines={2} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(40), lineHeight: P(52), color: '#17307a', maxWidth: P(640), textAlign: 'center' }}>{data.question}</Text>
// //         </View>

// //         {/* wooden frames behind the two pictures */}
// //         <View pointerEvents="none" style={[A(52, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />
// //         <View pointerEvents="none" style={[A(482, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />

// //         {/* the two pictures */}
// //         <View style={A(66, 440, 380, 494)}><SpotScene side="a" width={P(380)} /></View>
// //         <View style={A(496, 440, 380, 494)}><SpotScene side="b" width={P(380)} /></View>

// //         {/* + 1 _ 2 _ 3 − */}
// //         <Animated.View style={[A(0, 985, 942, 140), { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 10, elevation: 10, transform: [{ translateX: shake }] }]}>
// //           {home('+')}
// //           <Text style={numStyle}>{n1}</Text>
// //           {gapView(0)}
// //           <Text style={numStyle}>{n2}</Text>
// //           {gapView(1)}
// //           <Text style={numStyle}>{n3}</Text>
// //           {home('-')}
// //         </Animated.View>

// //         {/* message line */}
// //         {!!msg && (
// //           <View pointerEvents="none" style={[A(60, 1170, 822, 68), { zIndex: 20, elevation: 20, alignItems: 'center', justifyContent: 'center' }]}>
// //             <View style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: P(34), paddingHorizontal: P(34), paddingVertical: P(8) }}>
// //               <Text numberOfLines={2} style={{ fontFamily: F, fontSize: P(34), fontWeight: 'bold', color: '#c0392b', textAlign: 'center' }}>{msg}</Text>
// //             </View>
// //           </View>
// //         )}

// //         {/* clue / video / skip */}
// //         {circleBtn(143, '#a4e02a', '#f4f1dc', openClues, <Icon n="search" s={P(78)} />)}
// //         {costPill(152, 150, <Icon n="bulb" s={P(38)} />, String(COST_CLUE))}
// //         {circleBtn(388, '#f7ebd4', '#fbf3e3', watchVideo, <Icon n="film" s={P(92)} />)}
// //         {costPill(391, 162, <Coin s={P(30)} />, '+' + REWARD)}
// //         {circleBtn(637, '#f0434d', '#fbf3e3', () => setRiddle(true), <DoubleArrow s={P(86)} />)}
// //         {costPill(645, 151, <Icon n="bulb" s={P(38)} />, String(COST_SKIP))}

// //         {/* ---- clue popup (one clue, loaded from the backend) ---- */}
// //         {clueOpen && (
// //           <>
// //             <Pressable onPress={() => setClueOpen(false)} style={[A(0, 0, DW, DH), { zIndex: 40, elevation: 40, backgroundColor: 'rgba(10,25,60,0.5)' }]} />
// //             <View style={[A(60, 430, 822, 560), { zIndex: 41, elevation: 41, borderRadius: P(56), backgroundColor: CREAM, borderWidth: P(14), borderColor: WOOD_D }]}>
// //               <Text style={{ position: 'absolute', left: 0, right: 0, top: P(34), textAlign: 'center', fontFamily: F, fontSize: P(56), fontWeight: '900', color: NAVY, includeFontPadding: false }}>CLUES</Text>
// //               <Squish style={A(660, 22, 78, 78)} onPress={() => setClueOpen(false)}>
// //                 <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: WOOD, borderWidth: P(5), borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center' }}><Icon n="cross" s={P(40)} /></View>
// //               </Squish>

// //               <View style={[A(36, 130, 720, 330), { borderRadius: P(40), backgroundColor: '#ffffff', borderWidth: P(6), borderColor: GREEN, flexDirection: 'row', alignItems: 'center', paddingHorizontal: P(28), gap: P(24) }]}>
// //                 <View style={{ width: P(110), height: P(110), borderRadius: P(55), backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' }}>
// //                   <Text style={{ fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#fff', includeFontPadding: false }}>1</Text>
// //                 </View>
// //                 <View style={{ flex: 1 }}>
// //                   <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#bd6b29', includeFontPadding: false }}>Clue 1</Text>
// //                   <Text numberOfLines={7} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(32), lineHeight: P(41), color: '#17307a', marginTop: P(6) }}>
// //                     {clueBusy ? 'Loading clue...' : clueText}
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>
// //           </>
// //         )}

// //         {/* ---- level complete ---- */}
// //         {!!result && (
// //           <View style={[A(0, 0, DW, DH), { zIndex: 60, elevation: 60, backgroundColor: 'rgba(10,25,60,0.55)', alignItems: 'center', justifyContent: 'center' }]}>
// //             <Animated.View style={{ width: P(702), alignItems: 'center', backgroundColor: CREAM, borderWidth: P(12), borderColor: WOOD_D, borderRadius: P(56), paddingVertical: P(44), paddingHorizontal: P(30), opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
// //               <Text style={{ fontFamily: F, fontSize: P(64), fontWeight: '900', color: NAVY }}>Level complete!</Text>
// //               <Text style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(38), color: '#17307a', textAlign: 'center', marginTop: P(10) }}>{result.message}</Text>
// //               <View style={{ flexDirection: 'row', gap: P(10), marginTop: P(26) }}>
// //                 {[1, 2, 3].map((c) => <StarIcon key={c} size={P(84)} on={c <= (result.stars || 0)} />)}
// //               </View>
// //               {!result.skipped && <Text style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#bd6b29', marginTop: P(18) }}>{'Score ' + result.score}</Text>}
// //               <TouchableOpacity activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}
// //                 style={{ marginTop: P(34), minWidth: P(320), height: P(104), borderRadius: P(52), backgroundColor: '#a4d732', borderWidth: P(8), borderColor: K, alignItems: 'center', justifyContent: 'center' }}>
// //                 <Text style={{ fontFamily: F, fontSize: P(54), fontWeight: '900', color: K }}>NEXT</Text>
// //               </TouchableOpacity>
// //             </Animated.View>
// //           </View>
// //         )}
// //       </View>
// //     </View>
// //   );
// // }

// // const st = StyleSheet.create({
// //   center: { alignItems: 'center', justifyContent: 'center' },
// //   loading: { fontFamily: F, fontSize: 18, color: '#fff', marginTop: 12 },
// //   errText: { fontFamily: F, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: '#a4d732', borderWidth: 2.5, borderColor: K },
// //   retryT: { fontFamily: F, fontSize: 20, fontWeight: '800', color: K },
// //   back: { fontFamily: F, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },

// //   num: { fontFamily: F, fontWeight: '900', color: NAVY, textAlign: 'center', includeFontPadding: false },
// //   sym: { fontFamily: F, fontWeight: '900', color: ORANGE, textAlign: 'center', includeFontPadding: false },
// //   homeEmpty: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.25)' },
// //   slotRing: { borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(19,47,112,0.5)', backgroundColor: 'rgba(255,255,255,0.35)' },
// // });
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View, Text, Animated, PanResponder, Pressable, StyleSheet, Platform, Easing,
//   ActivityIndicator, TouchableOpacity, useWindowDimensions,
// } from 'react-native';
// import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// import { startLevel3, answerLevel3, rewardLevel3, clueLevel3, Level3Start, Level3Answer, Sym } from './Btlevel3api';
// import { SpotScene } from './Btlevel3art';
// import { StarIcon } from './Btlevel2art';
// import { F, INK, Coin } from './BTShared';
// import { Icon } from './Art';
// import BTSkipRiddle from './BTSkipRiddle';
// import { play } from './BTSound';

// /**
//  * Level 3 - spot the differences, put + and − between 1 2 3.
//  * GARDEN THEME (matches Level 1): blue sky, trees, fence, sprout, bookshelf, meadow, compact wooden bottom bar.
//  * Clue: frontend -> POST /level3/clue -> backend saves the view in MySQL -> JSON back.
//  */

// const NAVY = '#132f70', CREAM = '#faf0e2', K = '#1d1d1d', GREEN = '#3ec75a';
// const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });
// const DW = 942, DH = 1669;
// const SKY = '#5cc0f5', GRASS = '#74d13c';
// const WOOD = '#eba24e', WOOD_D = '#c2782c', WOOD_DD = '#8f5a1f';
// const COST_CLUE = 25, COST_SKIP = 50, REWARD = 75; // only shown on the pills

// // compact bottom bar (same look as Level 1)
// const BAR_Y = 1330, BAR_H = 272;
// const BTN = 150, BTN_Y = 1372;
// const PILL_Y = 1532, PILL_H = 58;

// // shown if the server cannot be reached, so the player always sees the clue
// const CLUE_FALLBACK =
//   'Sometimes the smallest changes make the biggest difference. Look closely at the numbers and follow the signs.';

// const LABEL: Record<Sym, string> = { '+': '+', '-': '−' };
// type Slots = (Sym | null)[];

// type Props = {
//   playerId: number;
//   onHints?: (h: number) => void;
//   onExit: () => void;
//   onComplete?: (result: Level3Answer) => void;
// };

// /* ---------- the garden scene ---------- */
// function Flower({ x, y, s = 1 }: any) {
//   return (
//     <G transform={`translate(${x} ${y}) scale(${s})`}>
//       {[0, 72, 144, 216, 288].map(a => (
//         <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
//       ))}
//       <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
//     </G>
//   );
// }

// function Tuft({ x, y }: any) {
//   return (
//     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
//       <Polygon points="-14,0 -8,-34 -2,0" />
//       <Polygon points="-4,0 4,-44 12,0" />
//       <Polygon points="8,0 18,-30 24,0" />
//     </G>
//   );
// }

// function Cloud({ x, y, s = 1 }: any) {
//   return (
//     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
//       <Ellipse cx="0" cy="0" rx="70" ry="26" />
//       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
//       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
//     </G>
//   );
// }

// function Garden({ w, h }: any) {
//   return (
//     <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{ position: 'absolute', left: 0, top: 0 }}>
//       <Defs>
//         <LinearGradient id="g3sky" x1="0" y1="0" x2="0" y2="1">
//           <Stop offset="0" stopColor="#46b6f3" />
//           <Stop offset="1" stopColor="#c2e8fb" />
//         </LinearGradient>
//       </Defs>
//       <Rect width={DW} height={DH} fill="url(#g3sky)" />

//       {/* trees top corners */}
//       <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
//       <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
//       <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
//       <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />

//       {/* clouds */}
//       <Cloud x={850} y={245} s={1} />
//       <Cloud x={50} y={985} s={0.9} />
//       <Cloud x={880} y={1000} s={0.6} />

//       {/* rolling hills */}
//       <Ellipse cx="150" cy="1160" rx="300" ry="150" fill="#9ad95f" />
//       <Ellipse cx="640" cy="1210" rx="420" ry="120" fill="#6cc13a" />
//       <Ellipse cx="900" cy="1170" rx="200" ry="110" fill="#5fb832" />

//       {/* fence: pickets first, rails in front */}
//       {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
//         const x = -10 + i * 90;
//         return (
//           <G key={i}>
//             <Polygon points={`${x},1130 ${x + 33},1098 ${x + 66},1130`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
//             <Rect x={x} y="1130" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
//           </G>
//         );
//       })}
//       <Rect x="0" y="1160" width={DW} height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
//       <Rect x="0" y="1208" width={DW} height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

//       {/* bookshelf (right) with potted plant */}
//       <G>
//         <Rect x="845" y="590" width="80" height="18" rx="4" fill="#e8903a" />
//         <Polygon points="852,608 918,608 910,650 860,650" fill="#f0a050" />
//         <G fill="#4cb04a">
//           <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(-28 885 598)" />
//           <Ellipse cx="885" cy="540" rx="20" ry="62" fill="#3a9a3c" />
//           <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(28 885 598)" />
//         </G>
//         <Rect x="780" y="650" width="162" height="575" fill="#eaa24f" />
//         <Rect x="796" y="666" width="146" height="545" fill="#dc9d4f" />
//         <Rect x="780" y="840" width="162" height="16" fill="#f2b866" />
//         <Rect x="780" y="1030" width="162" height="16" fill="#f2b866" />
//         <Rect x="780" y="650" width="162" height="16" fill="#f2b866" />
//         {/* row 1 */}
//         <Rect x="810" y="710" width="36" height="130" fill="#2a9d9d" />
//         <Rect x="850" y="690" width="34" height="150" fill="#f06ba8" />
//         <Rect x="888" y="715" width="40" height="125" fill="#8a63da" />
//         {/* row 2 */}
//         <Rect x="805" y="915" width="30" height="115" fill="#e5484d" />
//         <Rect x="840" y="890" width="24" height="140" fill="#3b82e0" />
//         <Rect x="868" y="910" width="38" height="120" fill="#4caf50" />
//         {/* row 3 */}
//         <Rect x="810" y="1095" width="34" height="120" fill="#f5c518" />
//         <Rect x="848" y="1065" width="40" height="150" fill="#2c6fdc" />
//       </G>

//       {/* sprout friend (left, from Level 1) */}
//       <G>
//         <G fill="#5cb85c">
//           <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(-25 70 1198)" />
//           <Ellipse cx="70" cy="1140" rx="22" ry="62" fill="#6cc56a" />
//           <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(25 70 1198)" />
//         </G>
//         <Rect x="10" y="1195" width="120" height="78" rx="36" fill="#fdf1ea" />
//         <Ellipse cx="38" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
//         <Ellipse cx="102" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
//         <Circle cx="55" cy="1230" r="4.5" fill="#3a2a2a" />
//         <Circle cx="85" cy="1230" r="4.5" fill="#3a2a2a" />
//         <Path d="M62 1243 Q70 1251 78 1243" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
//       </G>

//       {/* front meadow */}
//       <Path d={`M0 1285 C140 1230 300 1255 470 1245 C650 1233 800 1205 ${DW} 1185 L${DW} ${DH} L0 ${DH} Z`} fill="#74d13c" />
//       <Ellipse cx="300" cy="1330" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

//       {/* stones */}
//       <Ellipse cx="50" cy="1585" rx="68" ry="38" fill="#9b9b9b" />
//       <Ellipse cx="43" cy="1575" rx="50" ry="25" fill="#b4b4b4" />
//       <Ellipse cx="892" cy="1585" rx="68" ry="38" fill="#9b9b9b" />
//       <Ellipse cx="900" cy="1575" rx="50" ry="25" fill="#b4b4b4" />

//       {/* compact wooden bottom bar (like Level 1) */}
//       <Rect x="36" y={BAR_Y} width="870" height={BAR_H} rx="84" fill="#eaa24f" stroke="#c2782c" strokeWidth="10" />
//       <Path d={`M90 ${BAR_Y + 30} C300 ${BAR_Y + 24} 620 ${BAR_Y + 36} 852 ${BAR_Y + 28} M90 ${BAR_Y + BAR_H - 30} C320 ${BAR_Y + BAR_H - 22} 640 ${BAR_Y + BAR_H - 36} 852 ${BAR_Y + BAR_H - 26}`} stroke="#d58f3a" strokeWidth="4" opacity="0.7" fill="none" strokeLinecap="round" />
//       <Path d={`M120 ${BAR_Y + 16} C320 ${BAR_Y + 10} 620 ${BAR_Y + 22} 822 ${BAR_Y + 14}`} stroke="#f5c07c" strokeWidth="3" opacity="0.8" fill="none" strokeLinecap="round" />
//       <Circle cx="82" cy={BAR_Y + 42} r="8" fill="#8f5a1f" /><Circle cx="860" cy={BAR_Y + 42} r="8" fill="#8f5a1f" />
//       <Circle cx="82" cy={BAR_Y + BAR_H - 42} r="8" fill="#8f5a1f" /><Circle cx="860" cy={BAR_Y + BAR_H - 42} r="8" fill="#8f5a1f" />

//       {/* grass tufts + flowers */}
//       <Tuft x="905" y="1325" /><Tuft x="910" y="1450" /><Tuft x="20" y="1440" />
//       <Tuft x="100" y="1660" /><Tuft x="340" y="1660" /><Tuft x="580" y="1660" /><Tuft x="820" y="1660" />
//       <Flower x="885" y="1215" s={0.8} />
//       <Flower x="200" y="1642" s={0.9} />
//       <Flower x="735" y="1642" s={0.9} />
//     </Svg>
//   );
// }

// /* ---------- thin link chain for hanging signs (Level 1 style) ---------- */
// function Chain({ x, y, h, k }: any) {
//   const n = Math.max(2, Math.round(h / 14));
//   return (
//     <Svg pointerEvents="none" width={12 * k} height={h * k} viewBox={`0 0 12 ${h}`} style={{ position: 'absolute', left: x * k, top: y * k }}>
//       {Array.from({ length: n }).map((_, i) => (
//         <Ellipse key={i} cx="6" cy={7 + i * (h / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
//       ))}
//     </Svg>
//   );
// }

// /* ---------- double arrow (skip icon) ---------- */
// function DoubleArrow({ s }: { s: number }) {
//   return (
//     <Svg width={s} height={s} viewBox="0 0 100 100">
//       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
//       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
//     </Svg>
//   );
// }

// /* ---------- squish on press ---------- */
// function Squish({ style, onPress, disabled, children }: any) {
//   const s = useRef(new Animated.Value(1)).current;
//   const to = (v: number) => Animated.spring(s, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
//   return (
//     <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.92)} onPressOut={() => to(1)} style={style}>
//       <Animated.View style={{ transform: [{ scale: s }] }}>{children}</Animated.View>
//     </Pressable>
//   );
// }

// /* ---------- one draggable symbol (+ or −) ---------- */
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
//     onPanResponderGrant: () => { setDrag(true); play('drag'); },
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
//       <Text style={[st.sym, { fontSize: size * 1.05, lineHeight: size * 1.15 }, drag && { color: GREEN }]}>{LABEL[ch]}</Text>
//     </Animated.View>
//   );
// }

// const measure = (ref: React.RefObject<any>) =>
//   new Promise<{ x: number; y: number; w: number; h: number } | null>((resolve) => {
//     const node: any = ref.current;
//     if (!node || !node.measureInWindow) return resolve(null);
//     node.measureInWindow((x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }));
//   });

// /* =====================  SCREEN  ===================== */
// export default function BTLevel3Screen({ playerId, onHints, onExit, onComplete }: Props) {
//   const { width: winW, height: winH } = useWindowDimensions();
//   const box = { w: winW, h: winH };

//   const [data, setData] = useState<Level3Start | null>(null);
//   const [loadErr, setLoadErr] = useState('');
//   const [hints, setHints] = useState(0);
//   const [slots, setSlots] = useState<Slots>([null, null]);
//   const [fixed, setFixed] = useState<Slots>([null, null]);
//   const [msg, setMsg] = useState('');
//   const [busy, setBusy] = useState(false);
//   const [result, setResult] = useState<Level3Answer | null>(null);
//   const [riddle, setRiddle] = useState(false);
//   const [clueOpen, setClueOpen] = useState(false);
//   const [clueText, setClueText] = useState('');
//   const [clueBusy, setClueBusy] = useState(false);

//   const slotsRef = useRef<Slots>([null, null]);
//   const fixedRef = useRef<Slots>([null, null]);
//   slotsRef.current = slots;
//   fixedRef.current = fixed;

//   const slotRef0 = useRef<View>(null);
//   const slotRef1 = useRef<View>(null);
//   const slotRefs = [slotRef0, slotRef1];

//   const shake = useRef(new Animated.Value(0)).current;
//   const sway = useRef(new Animated.Value(0)).current;
//   const pop = useRef(new Animated.Value(0)).current;
//   const msgTimer = useRef<any>(null);
//   const timers = useRef<any[]>([]);

//   useEffect(() => {
//     const a = Animated.loop(Animated.sequence([
//       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//     ]));
//     a.start();
//     return () => a.stop();
//   }, []);

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
//         play('wrong');
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
//       play('correct');
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

//     const limit = Math.max(60, winW * 0.14);
//     if (best < 0 || bestD > limit) return false;
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

//   const watchVideo = async () => {
//     if (busy || result) return;
//     setBusy(true);
//     try {
//       const res = await rewardLevel3(playerId);
//       setHints(res.hints);
//       showMsg(`+${res.added} coins!`);
//     } catch (e: any) {
//       showMsg(e.message || 'Reward failed');
//     }
//     setBusy(false);
//   };

//   // clue: frontend -> POST /level3/clue -> backend saves the view in MySQL -> JSON back (free).
//   // If the request fails the player still sees the clue, and the console shows the real reason.
//   const loadClue = async () => {
//     if (clueBusy) return;
//     setClueBusy(true);
//     try {
//       if (!data) throw new Error('level not loaded');
//       const r = await clueLevel3({ sessionId: data.sessionId, playerId });
//       setClueText(r.clue || CLUE_FALLBACK);
//     } catch (e: any) {
//       console.warn('[L3 clue error]', e?.message);
//       setClueText(CLUE_FALLBACK);
//     }
//     setClueBusy(false);
//   };

//   const openClues = () => {
//     play('clue');
//     setClueOpen(true);
//     if (!clueText) loadClue();
//   };

//   const riddleSolved = async (): Promise<string> => {
//     setRiddle(false);
//     setResult({
//       success: true, correct: true, completed: true, skipped: true,
//       message: 'Level skipped!', score: 0, stars: 0,
//     });
//     return '';
//   };

//   /* ---------- loading / error ---------- */
//   if (loadErr || !data) {
//     return (
//       <View style={[st.center, { width: winW, height: winH, backgroundColor: SKY }]}>
//         {loadErr ? (
//           <>
//             <Text style={st.errText}>{loadErr}</Text>
//             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
//             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
//           </>
//         ) : (
//           <>
//             <ActivityIndicator color="#fff" size="large" />
//             <Text style={st.loading}>Loading level 3...</Text>
//           </>
//         )}
//       </View>
//     );
//   }

//   /* ---------- skip riddle screen ---------- */
//   if (riddle) {
//     return (
//       <View style={{ width: winW, height: winH }}>
//         <BTSkipRiddle hints={hints} onHome={onExit} onBack={() => setRiddle(false)} onSkipped={riddleSolved} />
//       </View>
//     );
//   }

//   // scale the 942x1669 design to the window
//   const bw = Math.min(box.w, (box.h * DW) / DH), k = bw / DW, bh = (bw * DH) / DW;
//   const top0 = (box.h - bh) / 2;
//   const P = (v: number) => v * k;
//   const A = (x: number, y: number, w: number, h: number): any => ({ position: 'absolute', left: P(x), top: P(y), width: P(w), height: P(h) });

//   const [n1, n2, n3] = data.numbers;
//   const u = P(112);
//   const gap = P(92);
//   const numStyle = [st.num, { fontSize: P(112), lineHeight: P(124), minWidth: P(70) }];
//   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

//   // empty spot where the symbol waited: invisible now (no dashed circle)
//   const home = (ch: Sym) =>
//     slots.includes(ch)
//       ? <View style={{ width: u, height: u }} />
//       : <DragSymbol ch={ch} size={u} disabled={busy || !!result} onDrop={handleDrop} />;

//   // gap between two numbers: no circle, but still an invisible drop target
//   const gapView = (i: number) => (
//     <View ref={slotRefs[i]} collapsable={false} style={{ width: gap, height: u, alignItems: 'center', justifyContent: 'center' }}>
//       {slots[i] ? (
//         <TouchableOpacity activeOpacity={0.8} disabled={!!fixed[i] || busy || !!result} onPress={() => removeSlot(i)}>
//           <Text style={[st.sym, { fontSize: u * 1.05, lineHeight: u * 1.15 }]}>{LABEL[slots[i] as Sym]}</Text>
//         </TouchableOpacity>
//       ) : null}
//     </View>
//   );

//   const costPill = (cx: number, w: number, icon: any, text: string) => (
//     <View style={[A(cx - w / 2, PILL_Y, w, PILL_H), { borderRadius: P(PILL_H / 2), backgroundColor: '#6b4423', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(8) }]}>
//       {icon}<Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(34), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{text}</Text>
//     </View>
//   );
//   const circleBtn = (cx: number, bgc: string, bc: string, onPress: any, icon: any) => (
//     <Squish style={A(cx - BTN / 2, BTN_Y, BTN, BTN)} onPress={onPress}>
//       <View style={{ width: P(BTN), height: P(BTN), borderRadius: P(BTN / 2), backgroundColor: bgc, borderWidth: P(12), borderColor: bc, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>{icon}</View>
//     </Squish>
//   );
//   // yellow round buttons (home / settings), Level 1 style
//   const woodBtn = (x: number, onPress: any, icon: any) => (
//     <Squish style={A(x, 111, 78, 78)} onPress={onPress}>
//       <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: '#fbc02d', borderWidth: P(5), borderColor: '#d98e1c', alignItems: 'center', justifyContent: 'center', elevation: 4 }}>{icon}</View>
//     </Squish>
//   );

//   return (
//     <View style={{ width: winW, height: winH, backgroundColor: SKY, overflow: 'hidden' }}>
//       {/* grass fill if the window is taller than the design */}
//       <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: top0 + P(1500), bottom: 0, backgroundColor: GRASS }} />

//       <View style={{ position: 'absolute', left: (box.w - bw) / 2, top: top0, width: bw, height: bh }}>
//         <Garden w={bw} h={bh} />

//         {/* top: home, settings */}
//         {woodBtn(27, onExit, <Icon n="home" s={P(42)} />)}
//         {woodBtn(119, undefined, <Icon n="gear" s={P(44)} />)}

//         {/* level sign (hangs on chains) */}
//         <Animated.View style={[A(300, 70, 346, 160), { transform: [{ rotate: swayR }] }]}>
//           <Chain x={52} y={0} h={50} k={k} />
//           <Chain x={282} y={0} h={50} k={k} />
//           <View style={{ position: 'absolute', left: 0, top: P(42), width: P(346), height: P(98), borderRadius: P(10), backgroundColor: '#bd6b29', borderWidth: P(6), borderColor: WOOD_DD, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
//             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10), flexWrap: 'nowrap' }}>
//               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'<'}</Text>
//               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{'LEVEL 3'}</Text>
//               <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'>'}</Text>
//             </View>
//           </View>
//         </Animated.View>

//         {/* bulbs counter (dashed cloud pill) */}
//         <View style={[A(728, 128, 142, 64), { borderRadius: P(32), backgroundColor: CREAM, borderWidth: P(3), borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingRight: P(26), alignItems: 'center', elevation: 4 }]}>
//           <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(44), fontWeight: '900', color: INK, includeFontPadding: false }}>{hints}</Text>
//         </View>
//         <View style={A(846, 108, 68, 68)}><Icon n="bulb" s={P(68)} /></View>

//         {/* question pill (2 lines) */}
//         <View style={[A(40, 262, 862, 150), { borderRadius: P(70), backgroundColor: CREAM, borderWidth: P(4), borderColor: '#ead2a4', alignItems: 'center', justifyContent: 'center', elevation: 4 }]}>
//           <Text style={{ position: 'absolute', left: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'<'}</Text>
//           <Text style={{ position: 'absolute', right: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'>'}</Text>
//           <Text numberOfLines={2} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(40), lineHeight: P(52), color: '#17307a', maxWidth: P(640), textAlign: 'center' }}>{data.question}</Text>
//         </View>

//         {/* wooden frames behind the two pictures */}
//         <View pointerEvents="none" style={[A(52, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />
//         <View pointerEvents="none" style={[A(482, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />

//         {/* the two pictures */}
//         <View style={A(66, 440, 380, 494)}><SpotScene side="a" width={P(380)} /></View>
//         <View style={A(496, 440, 380, 494)}><SpotScene side="b" width={P(380)} /></View>

//         {/* + 1 _ 2 _ 3 − */}
//         <Animated.View style={[A(0, 985, 942, 140), { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 10, elevation: 10, transform: [{ translateX: shake }] }]}>
//           {home('+')}
//           <Text style={numStyle}>{n1}</Text>
//           {gapView(0)}
//           <Text style={numStyle}>{n2}</Text>
//           {gapView(1)}
//           <Text style={numStyle}>{n3}</Text>
//           {home('-')}
//         </Animated.View>

//         {/* message line */}
//         {!!msg && (
//           <View pointerEvents="none" style={[A(60, 1170, 822, 68), { zIndex: 20, elevation: 20, alignItems: 'center', justifyContent: 'center' }]}>
//             <View style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: P(34), paddingHorizontal: P(34), paddingVertical: P(8) }}>
//               <Text numberOfLines={2} style={{ fontFamily: F, fontSize: P(34), fontWeight: 'bold', color: '#c0392b', textAlign: 'center' }}>{msg}</Text>
//             </View>
//           </View>
//         )}

//         {/* clue / video / skip (compact bar, like Level 1) */}
//         {circleBtn(230, '#a4e02a', '#f4f1dc', openClues, <Icon n="search" s={P(70)} />)}
//         {costPill(230, 150, <Icon n="bulb" s={P(34)} />, String(COST_CLUE))}
//         {circleBtn(471, '#f7ebd4', '#fbf3e3', watchVideo, <Icon n="film" s={P(82)} />)}
//         {costPill(471, 162, <Coin s={P(28)} />, '+' + REWARD)}
//         {circleBtn(712, '#f0434d', '#fbf3e3', () => setRiddle(true), <DoubleArrow s={P(76)} />)}
//         {costPill(712, 151, <Icon n="bulb" s={P(34)} />, String(COST_SKIP))}

//         {/* ---- clue popup (one clue, loaded from the backend) ---- */}
//         {clueOpen && (
//           <>
//             <Pressable onPress={() => setClueOpen(false)} style={[A(0, 0, DW, DH), { zIndex: 40, elevation: 40, backgroundColor: 'rgba(10,25,60,0.5)' }]} />
//             <View style={[A(60, 430, 822, 560), { zIndex: 41, elevation: 41, borderRadius: P(56), backgroundColor: CREAM, borderWidth: P(14), borderColor: WOOD_D }]}>
//               <Text style={{ position: 'absolute', left: 0, right: 0, top: P(34), textAlign: 'center', fontFamily: F, fontSize: P(56), fontWeight: '900', color: NAVY, includeFontPadding: false }}>HINTS</Text>
//               <Squish style={A(660, 22, 78, 78)} onPress={() => setClueOpen(false)}>
//                 <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: WOOD, borderWidth: P(5), borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center' }}><Icon n="cross" s={P(40)} /></View>
//               </Squish>

//               <View style={[A(36, 130, 720, 330), { borderRadius: P(40), backgroundColor: '#ffffff', borderWidth: P(6), borderColor: GREEN, flexDirection: 'row', alignItems: 'center', paddingHorizontal: P(28), gap: P(24) }]}>
//                 <View style={{ width: P(110), height: P(110), borderRadius: P(55), backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' }}>
//                   <Text style={{ fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#fff', includeFontPadding: false }}>1</Text>
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#bd6b29', includeFontPadding: false }}>Hint 1</Text>
//                   <Text numberOfLines={7} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(32), lineHeight: P(41), color: '#17307a', marginTop: P(6) }}>
//                     {clueBusy ? 'Loading clue...' : clueText}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </>
//         )}

//         {/* ---- level complete ---- */}
//         {!!result && (
//           <View style={[A(0, 0, DW, DH), { zIndex: 60, elevation: 60, backgroundColor: 'rgba(10,25,60,0.55)', alignItems: 'center', justifyContent: 'center' }]}>
//             <Animated.View style={{ width: P(702), alignItems: 'center', backgroundColor: CREAM, borderWidth: P(12), borderColor: WOOD_D, borderRadius: P(56), paddingVertical: P(44), paddingHorizontal: P(30), opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
//               <Text style={{ fontFamily: F, fontSize: P(64), fontWeight: '900', color: NAVY }}>Level complete!</Text>
//               <Text style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(38), color: '#17307a', textAlign: 'center', marginTop: P(10) }}>{result.message}</Text>
//               <View style={{ flexDirection: 'row', gap: P(10), marginTop: P(26) }}>
//                 {[1, 2, 3].map((c) => <StarIcon key={c} size={P(84)} on={c <= (result.stars || 0)} />)}
//               </View>
//               {!result.skipped && <Text style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#bd6b29', marginTop: P(18) }}>{'Score ' + result.score}</Text>}
//               <TouchableOpacity activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}
//                 style={{ marginTop: P(34), minWidth: P(320), height: P(104), borderRadius: P(52), backgroundColor: '#a4d732', borderWidth: P(8), borderColor: K, alignItems: 'center', justifyContent: 'center' }}>
//                 <Text style={{ fontFamily: F, fontSize: P(54), fontWeight: '900', color: K }}>NEXT</Text>
//               </TouchableOpacity>
//             </Animated.View>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// }

// const st = StyleSheet.create({
//   center: { alignItems: 'center', justifyContent: 'center' },
//   loading: { fontFamily: F, fontSize: 18, color: '#fff', marginTop: 12 },
//   errText: { fontFamily: F, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
//   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: '#a4d732', borderWidth: 2.5, borderColor: K },
//   retryT: { fontFamily: F, fontSize: 20, fontWeight: '800', color: K },
//   back: { fontFamily: F, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },

//   num: { fontFamily: F, fontWeight: '900', color: NAVY, textAlign: 'center', includeFontPadding: false },
//   // + and − are now dark blue, same as the numbers
//   sym: { fontFamily: F, fontWeight: '900', color: NAVY, textAlign: 'center', includeFontPadding: false },
// });
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, Animated, PanResponder, Pressable, StyleSheet, Platform, Easing,
  ActivityIndicator, TouchableOpacity, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { startLevel3, answerLevel3, rewardLevel3, clueLevel3, Level3Start, Level3Answer, Sym } from './Btlevel3api';
import { SpotScene } from './Btlevel3art';
import { F, INK, Coin } from './BTShared';
import { Icon } from './Art';
import BTSkipRiddle from './BTSkipRiddle';
import { play } from './BTSound';

/**
 * Level 3 - spot the differences, put + and − between 1 2 3.
 * GARDEN THEME (matches Level 1): blue sky, trees, fence, sprout, bookshelf, meadow, compact wooden bottom bar.
 * Clue: frontend -> POST /level3/clue -> backend saves the view in MySQL -> JSON back.
 * After a correct answer (or a skip) the screen goes straight to the next level: no "Level complete" modal.
 */

const NAVY = '#132f70', CREAM = '#faf0e2', K = '#1d1d1d', GREEN = '#3ec75a';
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });
const DW = 942, DH = 1669;
const SKY = '#5cc0f5', GRASS = '#74d13c';
const WOOD = '#eba24e', WOOD_D = '#c2782c', WOOD_DD = '#8f5a1f';
const COST_CLUE = 25, COST_SKIP = 50, REWARD = 75; // only shown on the pills

// compact bottom bar (same look as Level 1)
const BAR_Y = 1330, BAR_H = 272;
const BTN = 150, BTN_Y = 1372;
const PILL_Y = 1532, PILL_H = 58;

// shown if the server cannot be reached, so the player always sees the clue
const CLUE_FALLBACK =
  'Sometimes the smallest changes make the biggest difference. Look closely at the numbers and follow the signs.';

const LABEL: Record<Sym, string> = { '+': '+', '-': '−' };
type Slots = (Sym | null)[];

type Props = {
  playerId: number;
  onHints?: (h: number) => void;
  onExit: () => void;
  onComplete?: (result: Level3Answer) => void;
};

/* ---------- the garden scene ---------- */
function Flower({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map(a => (
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

function Garden({ w, h }: any) {
  return (
    <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <Defs>
        <LinearGradient id="g3sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#46b6f3" />
          <Stop offset="1" stopColor="#c2e8fb" />
        </LinearGradient>
      </Defs>
      <Rect width={DW} height={DH} fill="url(#g3sky)" />

      {/* trees top corners */}
      <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
      <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
      <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
      <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />

      {/* clouds */}
      <Cloud x={850} y={245} s={1} />
      <Cloud x={50} y={985} s={0.9} />
      <Cloud x={880} y={1000} s={0.6} />

      {/* rolling hills */}
      <Ellipse cx="150" cy="1160" rx="300" ry="150" fill="#9ad95f" />
      <Ellipse cx="640" cy="1210" rx="420" ry="120" fill="#6cc13a" />
      <Ellipse cx="900" cy="1170" rx="200" ry="110" fill="#5fb832" />

      {/* fence: pickets first, rails in front */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
        const x = -10 + i * 90;
        return (
          <G key={i}>
            <Polygon points={`${x},1130 ${x + 33},1098 ${x + 66},1130`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
            <Rect x={x} y="1130" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
          </G>
        );
      })}
      <Rect x="0" y="1160" width={DW} height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
      <Rect x="0" y="1208" width={DW} height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

      {/* bookshelf (right) with potted plant */}
      <G>
        <Rect x="845" y="590" width="80" height="18" rx="4" fill="#e8903a" />
        <Polygon points="852,608 918,608 910,650 860,650" fill="#f0a050" />
        <G fill="#4cb04a">
          <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(-28 885 598)" />
          <Ellipse cx="885" cy="540" rx="20" ry="62" fill="#3a9a3c" />
          <Ellipse cx="885" cy="545" rx="20" ry="58" transform="rotate(28 885 598)" />
        </G>
        <Rect x="780" y="650" width="162" height="575" fill="#eaa24f" />
        <Rect x="796" y="666" width="146" height="545" fill="#dc9d4f" />
        <Rect x="780" y="840" width="162" height="16" fill="#f2b866" />
        <Rect x="780" y="1030" width="162" height="16" fill="#f2b866" />
        <Rect x="780" y="650" width="162" height="16" fill="#f2b866" />
        {/* row 1 */}
        <Rect x="810" y="710" width="36" height="130" fill="#2a9d9d" />
        <Rect x="850" y="690" width="34" height="150" fill="#f06ba8" />
        <Rect x="888" y="715" width="40" height="125" fill="#8a63da" />
        {/* row 2 */}
        <Rect x="805" y="915" width="30" height="115" fill="#e5484d" />
        <Rect x="840" y="890" width="24" height="140" fill="#3b82e0" />
        <Rect x="868" y="910" width="38" height="120" fill="#4caf50" />
        {/* row 3 */}
        <Rect x="810" y="1095" width="34" height="120" fill="#f5c518" />
        <Rect x="848" y="1065" width="40" height="150" fill="#2c6fdc" />
      </G>

      {/* sprout friend (left, from Level 1) */}
      <G>
        <G fill="#5cb85c">
          <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(-25 70 1198)" />
          <Ellipse cx="70" cy="1140" rx="22" ry="62" fill="#6cc56a" />
          <Ellipse cx="70" cy="1140" rx="20" ry="56" transform="rotate(25 70 1198)" />
        </G>
        <Rect x="10" y="1195" width="120" height="78" rx="36" fill="#fdf1ea" />
        <Ellipse cx="38" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
        <Ellipse cx="102" cy="1240" rx="11" ry="7" fill="#f6a5ae" />
        <Circle cx="55" cy="1230" r="4.5" fill="#3a2a2a" />
        <Circle cx="85" cy="1230" r="4.5" fill="#3a2a2a" />
        <Path d="M62 1243 Q70 1251 78 1243" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </G>

      {/* front meadow */}
      <Path d={`M0 1285 C140 1230 300 1255 470 1245 C650 1233 800 1205 ${DW} 1185 L${DW} ${DH} L0 ${DH} Z`} fill="#74d13c" />
      <Ellipse cx="300" cy="1330" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

      {/* stones */}
      <Ellipse cx="50" cy="1585" rx="68" ry="38" fill="#9b9b9b" />
      <Ellipse cx="43" cy="1575" rx="50" ry="25" fill="#b4b4b4" />
      <Ellipse cx="892" cy="1585" rx="68" ry="38" fill="#9b9b9b" />
      <Ellipse cx="900" cy="1575" rx="50" ry="25" fill="#b4b4b4" />

      {/* compact wooden bottom bar (like Level 1) */}
      <Rect x="36" y={BAR_Y} width="870" height={BAR_H} rx="84" fill="#eaa24f" stroke="#c2782c" strokeWidth="10" />
      <Path d={`M90 ${BAR_Y + 30} C300 ${BAR_Y + 24} 620 ${BAR_Y + 36} 852 ${BAR_Y + 28} M90 ${BAR_Y + BAR_H - 30} C320 ${BAR_Y + BAR_H - 22} 640 ${BAR_Y + BAR_H - 36} 852 ${BAR_Y + BAR_H - 26}`} stroke="#d58f3a" strokeWidth="4" opacity="0.7" fill="none" strokeLinecap="round" />
      <Path d={`M120 ${BAR_Y + 16} C320 ${BAR_Y + 10} 620 ${BAR_Y + 22} 822 ${BAR_Y + 14}`} stroke="#f5c07c" strokeWidth="3" opacity="0.8" fill="none" strokeLinecap="round" />
      <Circle cx="82" cy={BAR_Y + 42} r="8" fill="#8f5a1f" /><Circle cx="860" cy={BAR_Y + 42} r="8" fill="#8f5a1f" />
      <Circle cx="82" cy={BAR_Y + BAR_H - 42} r="8" fill="#8f5a1f" /><Circle cx="860" cy={BAR_Y + BAR_H - 42} r="8" fill="#8f5a1f" />

      {/* grass tufts + flowers */}
      <Tuft x="905" y="1325" /><Tuft x="910" y="1450" /><Tuft x="20" y="1440" />
      <Tuft x="100" y="1660" /><Tuft x="340" y="1660" /><Tuft x="580" y="1660" /><Tuft x="820" y="1660" />
      <Flower x="885" y="1215" s={0.8} />
      <Flower x="200" y="1642" s={0.9} />
      <Flower x="735" y="1642" s={0.9} />
    </Svg>
  );
}

/* ---------- thin link chain for hanging signs (Level 1 style) ---------- */
function Chain({ x, y, h, k }: any) {
  const n = Math.max(2, Math.round(h / 14));
  return (
    <Svg pointerEvents="none" width={12 * k} height={h * k} viewBox={`0 0 12 ${h}`} style={{ position: 'absolute', left: x * k, top: y * k }}>
      {Array.from({ length: n }).map((_, i) => (
        <Ellipse key={i} cx="6" cy={7 + i * (h / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
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
    onPanResponderGrant: () => { setDrag(true); play('drag'); },
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
  const { width: winW, height: winH } = useWindowDimensions();
  const box = { w: winW, h: winH };

  const [data, setData] = useState<Level3Start | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [hints, setHints] = useState(0);
  const [slots, setSlots] = useState<Slots>([null, null]);
  const [fixed, setFixed] = useState<Slots>([null, null]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Level3Answer | null>(null); // only used to lock the board while we leave
  const [riddle, setRiddle] = useState(false);
  const [clueOpen, setClueOpen] = useState(false);
  const [clueText, setClueText] = useState('');
  const [clueBusy, setClueBusy] = useState(false);

  const slotsRef = useRef<Slots>([null, null]);
  const fixedRef = useRef<Slots>([null, null]);
  slotsRef.current = slots;
  fixedRef.current = fixed;

  const slotRef0 = useRef<View>(null);
  const slotRef1 = useRef<View>(null);
  const slotRefs = [slotRef0, slotRef1];

  const shake = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
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

  // go straight on to the next level (no "Level complete" modal)
  const finish = (res: Level3Answer) => {
    setResult(res); // keeps the board locked while we leave
    timers.current.push(setTimeout(() => (onComplete ? onComplete(res) : onExit()), 700));
  };

  const submit = async (arr: Slots) => {
    if (!data) return;
    setBusy(true);
    try {
      const res = await answerLevel3({ sessionId: data.sessionId, playerId, symbols: arr as Sym[] });
      if (!res.correct) {
        play('wrong');
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
      play('correct');
      finish(res);
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

  // clue: frontend -> POST /level3/clue -> backend saves the view in MySQL -> JSON back (free).
  // If the request fails the player still sees the clue, and the console shows the real reason.
  const loadClue = async () => {
    if (clueBusy) return;
    setClueBusy(true);
    try {
      if (!data) throw new Error('level not loaded');
      const r = await clueLevel3({ sessionId: data.sessionId, playerId });
      setClueText(r.clue || CLUE_FALLBACK);
    } catch (e: any) {
      console.warn('[L3 clue error]', e?.message);
      setClueText(CLUE_FALLBACK);
    }
    setClueBusy(false);
  };

  const openClues = () => {
    play('clue');
    setClueOpen(true);
    if (!clueText) loadClue();
  };

  // skip riddle solved: go straight on to the next level (no modal)
  const riddleSolved = async (): Promise<string> => {
    setRiddle(false);
    const res: Level3Answer = {
      success: true, correct: true, completed: true, skipped: true,
      message: 'Level skipped!', score: 0, stars: 0,
    };
    setResult(res);
    onComplete ? onComplete(res) : onExit();
    return '';
  };

  /* ---------- loading / error ---------- */
  if (loadErr || !data) {
    return (
      <View style={[st.center, { width: winW, height: winH, backgroundColor: SKY }]}>
        {loadErr ? (
          <>
            <Text style={st.errText}>{loadErr}</Text>
            <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
            <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
          </>
        ) : (
          <>
            <ActivityIndicator color="#fff" size="large" />
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

  // empty spot where the symbol waited: invisible now (no dashed circle)
  const home = (ch: Sym) =>
    slots.includes(ch)
      ? <View style={{ width: u, height: u }} />
      : <DragSymbol ch={ch} size={u} disabled={busy || !!result} onDrop={handleDrop} />;

  // gap between two numbers: no circle, but still an invisible drop target
  const gapView = (i: number) => (
    <View ref={slotRefs[i]} collapsable={false} style={{ width: gap, height: u, alignItems: 'center', justifyContent: 'center' }}>
      {slots[i] ? (
        <TouchableOpacity activeOpacity={0.8} disabled={!!fixed[i] || busy || !!result} onPress={() => removeSlot(i)}>
          <Text style={[st.sym, { fontSize: u * 1.05, lineHeight: u * 1.15 }]}>{LABEL[slots[i] as Sym]}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const costPill = (cx: number, w: number, icon: any, text: string) => (
    <View style={[A(cx - w / 2, PILL_Y, w, PILL_H), { borderRadius: P(PILL_H / 2), backgroundColor: '#6b4423', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(8) }]}>
      {icon}<Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(34), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{text}</Text>
    </View>
  );
  const circleBtn = (cx: number, bgc: string, bc: string, onPress: any, icon: any) => (
    <Squish style={A(cx - BTN / 2, BTN_Y, BTN, BTN)} onPress={onPress}>
      <View style={{ width: P(BTN), height: P(BTN), borderRadius: P(BTN / 2), backgroundColor: bgc, borderWidth: P(12), borderColor: bc, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>{icon}</View>
    </Squish>
  );
  // yellow round buttons (home / settings), Level 1 style
  const woodBtn = (x: number, onPress: any, icon: any) => (
    <Squish style={A(x, 111, 78, 78)} onPress={onPress}>
      <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: '#fbc02d', borderWidth: P(5), borderColor: '#d98e1c', alignItems: 'center', justifyContent: 'center', elevation: 4 }}>{icon}</View>
    </Squish>
  );

  return (
    <View style={{ width: winW, height: winH, backgroundColor: SKY, overflow: 'hidden' }}>
      {/* grass fill if the window is taller than the design */}
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: top0 + P(1500), bottom: 0, backgroundColor: GRASS }} />

      <View style={{ position: 'absolute', left: (box.w - bw) / 2, top: top0, width: bw, height: bh }}>
        <Garden w={bw} h={bh} />

        {/* top: home, settings */}
        {woodBtn(27, onExit, <Icon n="home" s={P(42)} />)}
        {woodBtn(119, undefined, <Icon n="gear" s={P(44)} />)}

        {/* level sign (hangs on chains) */}
        <Animated.View style={[A(300, 70, 346, 160), { transform: [{ rotate: swayR }] }]}>
          <Chain x={52} y={0} h={50} k={k} />
          <Chain x={282} y={0} h={50} k={k} />
          <View style={{ position: 'absolute', left: 0, top: P(42), width: P(346), height: P(98), borderRadius: P(10), backgroundColor: '#bd6b29', borderWidth: P(6), borderColor: WOOD_DD, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: P(10), flexWrap: 'nowrap' }}>
              <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'<'}</Text>
              <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#fff', includeFontPadding: false }}>{'LEVEL 3'}</Text>
              <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(46), fontWeight: '900', color: '#ffc533', includeFontPadding: false }}>{'>'}</Text>
            </View>
          </View>
        </Animated.View>

        {/* bulbs counter (dashed cloud pill) */}
        <View style={[A(728, 128, 142, 64), { borderRadius: P(32), backgroundColor: CREAM, borderWidth: P(3), borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingRight: P(26), alignItems: 'center', elevation: 4 }]}>
          <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(44), fontWeight: '900', color: INK, includeFontPadding: false }}>{hints}</Text>
        </View>
        <View style={A(846, 108, 68, 68)}><Icon n="bulb" s={P(68)} /></View>

        {/* question pill (2 lines) */}
        <View style={[A(40, 262, 862, 150), { borderRadius: P(70), backgroundColor: CREAM, borderWidth: P(4), borderColor: '#ead2a4', alignItems: 'center', justifyContent: 'center', elevation: 4 }]}>
          <Text style={{ position: 'absolute', left: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'<'}</Text>
          <Text style={{ position: 'absolute', right: P(30), fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#ffb629', includeFontPadding: false }}>{'>'}</Text>
          <Text numberOfLines={2} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(40), lineHeight: P(52), color: '#17307a', maxWidth: P(640), textAlign: 'center' }}>{data.question}</Text>
        </View>

        {/* wooden frames behind the two pictures */}
        <View pointerEvents="none" style={[A(52, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />
        <View pointerEvents="none" style={[A(482, 428, 408, 518), { borderRadius: P(14), backgroundColor: '#f1b25a', borderWidth: P(8), borderColor: '#cf8a33' }]} />

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

        {/* clue / video / skip (compact bar, like Level 1) */}
        {circleBtn(230, '#a4e02a', '#f4f1dc', openClues, <Icon n="search" s={P(70)} />)}
        {costPill(230, 150, <Icon n="bulb" s={P(34)} />, String(COST_CLUE))}
        {circleBtn(471, '#f7ebd4', '#fbf3e3', watchVideo, <Icon n="film" s={P(82)} />)}
        {costPill(471, 162, <Coin s={P(28)} />, '+' + REWARD)}
        {circleBtn(712, '#f0434d', '#fbf3e3', () => setRiddle(true), <DoubleArrow s={P(76)} />)}
        {costPill(712, 151, <Icon n="bulb" s={P(34)} />, String(COST_SKIP))}

        {/* ---- clue popup (one clue, loaded from the backend) ---- */}
        {clueOpen && (
          <>
            <Pressable onPress={() => setClueOpen(false)} style={[A(0, 0, DW, DH), { zIndex: 40, elevation: 40, backgroundColor: 'rgba(10,25,60,0.5)' }]} />
            <View style={[A(60, 430, 822, 560), { zIndex: 41, elevation: 41, borderRadius: P(56), backgroundColor: CREAM, borderWidth: P(14), borderColor: WOOD_D }]}>
              <Text style={{ position: 'absolute', left: 0, right: 0, top: P(34), textAlign: 'center', fontFamily: F, fontSize: P(56), fontWeight: '900', color: NAVY, includeFontPadding: false }}>HINTS</Text>
              <Squish style={A(660, 22, 78, 78)} onPress={() => setClueOpen(false)}>
                <View style={{ width: P(78), height: P(78), borderRadius: P(39), backgroundColor: WOOD, borderWidth: P(5), borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center' }}><Icon n="cross" s={P(40)} /></View>
              </Squish>

              <View style={[A(36, 130, 720, 330), { borderRadius: P(40), backgroundColor: '#ffffff', borderWidth: P(6), borderColor: GREEN, flexDirection: 'row', alignItems: 'center', paddingHorizontal: P(28), gap: P(24) }]}>
                <View style={{ width: P(110), height: P(110), borderRadius: P(55), backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: F, fontSize: P(60), fontWeight: '900', color: '#fff', includeFontPadding: false }}>1</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontFamily: F, fontSize: P(38), fontWeight: '900', color: '#bd6b29', includeFontPadding: false }}>Hint 1</Text>
                  <Text numberOfLines={7} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: P(32), lineHeight: P(41), color: '#17307a', marginTop: P(6) }}>
                    {clueBusy ? 'Loading clue...' : clueText}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  loading: { fontFamily: F, fontSize: 18, color: '#fff', marginTop: 12 },
  errText: { fontFamily: F, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
  retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: '#a4d732', borderWidth: 2.5, borderColor: K },
  retryT: { fontFamily: F, fontSize: 20, fontWeight: '800', color: K },
  back: { fontFamily: F, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },

  num: { fontFamily: F, fontWeight: '900', color: NAVY, textAlign: 'center', includeFontPadding: false },
  // + and − are now dark blue, same as the numbers
  sym: { fontFamily: F, fontWeight: '900', color: NAVY, textAlign: 'center', includeFontPadding: false },
});
