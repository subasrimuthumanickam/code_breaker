// // import React, { useEffect, useRef, useState } from 'react';
// // import { View, Text, TouchableOpacity, Pressable, Animated, StyleSheet } from 'react-native';
// // import * as api from './api'; // same helpers the other levels use (hint / skip / reward)
// // import { F, INK, Stage, Coin, loop } from './BTShared';
// // import { Icon } from './Art';
// // import { Level22Room } from './Btlevel22art'; // the cozy room background used by the other levels
// // import { startLevel23, submitLevel23Answer } from './Btlevel23api';
// // import { Face, FACE_IDS, FACE_LAYOUT } from './Btlevel23art';

// // const NAVY = '#10245e';
// // const CREAM = '#fbf6e9';
// // const SKY = '#9fc6ea';
// // const LEVEL = 23;
// // const HINT_COST = 25;
// // const SKIP_COST = 50;
// // const FACE = 62;
// // const RING = 72;

// // type Props = {
// //   playerId: number;
// //   hints?: number;
// //   setHints?: (n: number) => void;
// //   onExit?: () => void;
// //   onComplete?: (r: any) => void;
// // };

// // // pops in on mount, squishes when pressed
// // function PopTouch({ inner, onPress, disabled, delay = 0, children }: any) {
// //   const e = useRef(new Animated.Value(0)).current;
// //   const sc = useRef(new Animated.Value(1)).current;
// //   useEffect(() => {
// //     Animated.sequence([
// //       Animated.delay(delay),
// //       Animated.spring(e, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
// //     ]).start();
// //   }, []);
// //   const to = (v: number) =>
// //     Animated.spring(sc, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
// //   return (
// //     <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.88)} onPressOut={() => to(1)}>
// //       <Animated.View style={[inner, { opacity: e, transform: [{ scale: Animated.multiply(e, sc) }] }]}>
// //         {children}
// //       </Animated.View>
// //     </Pressable>
// //   );
// // }

// // export default function Btlevel23screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
// //   const bal = Number(hints) || 0;

// //   const [sequence, setSequence] = useState<string[] | null>(null);
// //   const [picked, setPicked] = useState<string[]>([]);
// //   const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
// //   const [hintId, setHintId] = useState<string | null>(null);
// //   const [note, setNote] = useState('');

// //   const busy = useRef(false);
// //   const done = useRef(false);
// //   const session = useRef<Promise<any> | null>(null);
// //   const shake = useRef(new Animated.Value(0)).current;
// //   const sway = useRef(new Animated.Value(0)).current;
// //   const pulse = useRef(new Animated.Value(0)).current;

// //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });
// //   const pulseS = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.09] });

// //   const flash = (m: string, ms = 2200) => {
// //     setNote(m);
// //     setTimeout(() => setNote(''), ms);
// //   };
// //   const doShake = () =>
// //     Animated.sequence(
// //       [10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))
// //     ).start();

// //   // The session is created silently in the background (no loading screen).
// //   // If it fails it is simply retried the next time the player needs it.
// //   const getSession = () => {
// //     if (!session.current) {
// //       session.current = startLevel23(playerId)
// //         .then((d) => {
// //           if (!d.success) throw new Error(d.error || 'start failed');
// //           setSequence(d.sequence);
// //           return d;
// //         })
// //         .catch((e) => {
// //           session.current = null;
// //           throw e;
// //         });
// //     }
// //     return session.current;
// //   };

// //   useEffect(() => {
// //     getSession().catch((e) => {
// //       console.log('[L23] start failed:', e);
// //       flash('Network error');
// //     });
// //     loop(sway, 1800);
// //     loop(pulse, 900);
// //   }, [playerId]);

// //   // ---- tap a face: add to the order, tap again to take it back ----
// //   const onTap = (id: string) => {
// //     if (done.current || result) return;
// //     setHintId(null);
// //     setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
// //   };

// //   // ---- submit the tapped order ----
// //   const onSubmit = async () => {
// //     if (busy.current || done.current || picked.length !== FACE_IDS.length) return;
// //     busy.current = true;
// //     try {
// //       const d = await getSession();
// //       const data = await submitLevel23Answer(playerId, d.sessionId, picked);
// //       if (data.success) {
// //         if (data.correct) {
// //           done.current = true;
// //           setResult('correct');
// //           setTimeout(
// //             () => onComplete?.({ attempts: data.attempts || 1, skipped: false, correct: true }),
// //             1200
// //           );
// //         } else {
// //           setResult('wrong');
// //           doShake();
// //           flash('Not quite. Try again!', 1400);
// //           setTimeout(() => {
// //             setResult(null);
// //             setPicked([]);
// //           }, 1000);
// //         }
// //       } else {
// //         flash(data.error || data.message || 'Something went wrong');
// //       }
// //     } catch (e) {
// //       console.log('[L23] answer failed:', e);
// //       flash('Network error');
// //     } finally {
// //       busy.current = false;
// //     }
// //   };

// //   // ---- hint / video / skip (same costs as the other levels) ----
// //   const hint = async () => {
// //     if (busy.current || done.current) return;
// //     if (!sequence) {
// //       flash('Please wait...');
// //       return;
// //     }
// //     if (bal < HINT_COST) {
// //       flash('Need ' + HINT_COST + ' hints. You have ' + bal + '.');
// //       return;
// //     }
// //     busy.current = true;
// //     try {
// //       const r: any = await api.hint(LEVEL, playerId, []);
// //       if (typeof r?.hints === 'number') setHints?.(r.hints);
// //       const wrongAt = picked.findIndex((id, i) => id !== sequence[i]);
// //       if (wrongAt >= 0) {
// //         flash('Check your order again!', 2500);
// //       } else {
// //         const next = sequence[picked.length];
// //         if (next) {
// //           setHintId(next);
// //           setTimeout(() => setHintId(null), 2500);
// //         }
// //       }
// //     } catch (e: any) {
// //       flash(e?.status === 402 ? 'Not enough hints' : 'Hint not available');
// //     } finally {
// //       busy.current = false;
// //     }
// //   };

// //   const video = async () => {
// //     if (busy.current) return;
// //     busy.current = true;
// //     try {
// //       const r: any = await api.reward(playerId, 'video');
// //       if (typeof r?.hints === 'number') setHints?.(r.hints);
// //     } catch (e) {
// //     } finally {
// //       busy.current = false;
// //     }
// //   };

// //   const skip = async () => {
// //     if (busy.current || done.current) return;
// //     if (bal < SKIP_COST) {
// //       flash('Need ' + SKIP_COST + ' hints. You have ' + bal + '.');
// //       return;
// //     }
// //     busy.current = true;
// //     try {
// //       const r: any = await api.skip(LEVEL, playerId);
// //       setHints?.(typeof r?.hints === 'number' ? r.hints : bal - SKIP_COST);
// //       done.current = true;
// //       onComplete?.({ attempts: 1, skipped: true });
// //     } catch (e: any) {
// //       flash(e?.status === 402 ? 'Not enough hints' : 'Skip not available');
// //     } finally {
// //       busy.current = false;
// //     }
// //   };

// //   const ready = picked.length === FACE_IDS.length && !result;

// //   return (
// //     <Stage bg={SKY}>
// //       <View style={st.wall}>
// //         <Level22Room />

// //         <View style={st.board}>
// //           {/* top bar */}
// //           <View style={st.top}>
// //             <View style={st.topL}>
// //               <TouchableOpacity style={st.round} onPress={onExit}>
// //                 <Icon n="home" s={16} />
// //               </TouchableOpacity>
// //               <TouchableOpacity style={st.round}>
// //                 <Icon n="gear" s={16} />
// //               </TouchableOpacity>
// //             </View>

// //             <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
// //               <View style={[st.string, { left: 26, transform: [{ rotate: '12deg' }] }]} />
// //               <View style={[st.string, { right: 26, transform: [{ rotate: '-12deg' }] }]} />
// //               <View style={st.sign}>
// //                 <View style={[st.leafTop, { left: -8, transform: [{ rotate: '-30deg' }] }]} />
// //                 <View style={[st.leafTop, { right: -8, transform: [{ rotate: '30deg' }] }]} />
// //                 <View style={st.dashes}>
// //                   <View style={[st.dash, { transform: [{ rotate: '-25deg' }] }]} />
// //                   <View style={[st.dash, { transform: [{ rotate: '25deg' }] }]} />
// //                 </View>
// //                 <Text style={st.signt}>{'LEVEL ' + LEVEL}</Text>
// //                 <View style={st.dashes}>
// //                   <View style={[st.dash, { transform: [{ rotate: '25deg' }] }]} />
// //                   <View style={[st.dash, { transform: [{ rotate: '-25deg' }] }]} />
// //                 </View>
// //               </View>
// //             </Animated.View>

// //             <View style={st.topR}>
// //               <View style={st.bpill}>
// //                 <Text style={st.bpt}>{hints ?? 0}</Text>
// //                 <View style={{ position: 'absolute', right: -14, top: -10 }}>
// //                   <Icon n="bulb" s={34} />
// //                 </View>
// //               </View>
// //             </View>
// //           </View>

// //           {/* question banner with the order to follow */}
// //           <View style={st.qWrap}>
// //             <Text style={st.q}>Tap them in order:</Text>
// //             <View style={st.seqRow}>
// //               {sequence ? sequence.map((id) => <Face key={id} id={id} size={24} />) : null}
// //             </View>
// //           </View>

// //           {/* faces */}
// //           <Animated.View style={{ transform: [{ translateX: shake }], marginTop: 18 }}>
// //             <View style={st.stage}>
// //               {FACE_IDS.map((id, i) => {
// //                 const pos = FACE_LAYOUT[id];
// //                 const idx = picked.indexOf(id);
// //                 const isPicked = idx >= 0;
// //                 const isHint = hintId === id;
// //                 return (
// //                   <View key={id} style={{ position: 'absolute', left: pos.x - 5, top: pos.y - 5 }}>
// //                     <PopTouch delay={i * 80} disabled={!!result} onPress={() => onTap(id)}>
// //                       <View
// //                         style={[
// //                           st.ring,
// //                           isPicked && st.ringPicked,
// //                           isHint && st.ringHint,
// //                           result === 'correct' && isPicked && st.ringOk,
// //                           result === 'wrong' && isPicked && st.ringBad,
// //                         ]}
// //                       >
// //                         <Face id={id} size={FACE} />
// //                         {isPicked && (
// //                           <View style={st.badge}>
// //                             <Text style={st.badgeT}>{idx + 1}</Text>
// //                           </View>
// //                         )}
// //                       </View>
// //                     </PopTouch>
// //                   </View>
// //                 );
// //               })}
// //             </View>
// //           </Animated.View>

// //           {/* submit */}
// //           <TouchableOpacity
// //             style={[st.submit, !ready && { opacity: 0.5 }]}
// //             disabled={!ready}
// //             onPress={onSubmit}
// //           >
// //             <Text style={st.submitT}>SUBMIT</Text>
// //           </TouchableOpacity>

// //           {/* hint / video / skip bar */}
// //           <View style={st.barWrap}>
// //             <View style={st.bar}>
// //               <View style={st.acol}>
// //                 <Animated.View style={{ transform: [{ scale: pulseS }] }}>
// //                   <PopTouch inner={st.hintBtn} onPress={hint}>
// //                     <Icon n="search" s={34} />
// //                   </PopTouch>
// //                 </Animated.View>
// //                 <View style={st.lblRow}>
// //                   <Icon n="bulb" s={14} />
// //                   <Text style={st.lbl}>{HINT_COST}</Text>
// //                 </View>
// //               </View>
// //               <View style={st.acol}>
// //                 <PopTouch inner={st.videoBtn} onPress={video}>
// //                   <Icon n="film" s={40} />
// //                 </PopTouch>
// //                 <View style={st.lblRow}>
// //                   <Coin s={12} />
// //                   <Text style={st.lbl}>+75</Text>
// //                 </View>
// //               </View>
// //               <View style={st.acol}>
// //                 <PopTouch inner={st.skipBtn} onPress={skip}>
// //                   <Icon n="play" s={36} />
// //                 </PopTouch>
// //                 <View style={st.lblRow}>
// //                   <Icon n="bulb" s={14} />
// //                   <Text style={st.lbl}>{SKIP_COST}</Text>
// //                 </View>
// //               </View>
// //             </View>
// //           </View>

// //           {!!note && <Text style={st.note}>{note}</Text>}
// //         </View>
// //       </View>
// //     </Stage>
// //   );
// // }

// // const st = StyleSheet.create({
// //   wall: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
// //   board: { flex: 1, alignItems: 'center', paddingTop: 14 },

// //   top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 8, width: '100%' },
// //   topL: { flexDirection: 'row', gap: 6, minWidth: 80, marginTop: 10 },
// //   topR: { minWidth: 80, alignItems: 'flex-end', marginTop: 14, paddingRight: 14 },
// //   round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ffe27a', borderWidth: 2, borderColor: INK, alignItems: 'center', justifyContent: 'center' },

// //   signWrap: { alignItems: 'center', paddingTop: 14 },
// //   string: { position: 'absolute', top: -6, width: 2, height: 22, backgroundColor: '#9a6a3a' },
// //   sign: {
// //     flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#a8601f',
// //     borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
// //     elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
// //   },
// //   leafTop: { position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: '#5fae3a' },
// //   signt: { fontFamily: F, fontSize: 22, fontWeight: 'bold', color: '#fff' },
// //   dashes: { gap: 4, justifyContent: 'center' },
// //   dash: { width: 10, height: 3, borderRadius: 2, backgroundColor: '#ffc83d' },

// //   bpill: { backgroundColor: '#fff', borderRadius: 16, height: 30, minWidth: 58, paddingLeft: 12, paddingRight: 18, justifyContent: 'center', borderWidth: 2, borderColor: '#e6e6e6' },
// //   bpt: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK },

// //   qWrap: {
// //     backgroundColor: CREAM, borderRadius: 24, paddingHorizontal: 22, paddingVertical: 10,
// //     marginTop: 10, alignItems: 'center', elevation: 4,
// //     shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
// //   },
// //   q: { fontFamily: F, fontSize: 20, fontWeight: 'bold', color: NAVY, textAlign: 'center' },
// //   seqRow: { flexDirection: 'row', gap: 4, marginTop: 6, minHeight: 24 },

// //   stage: { width: 290, height: 250 },
// //   ring: {
// //     width: RING, height: RING, borderRadius: RING / 2, alignItems: 'center', justifyContent: 'center',
// //     borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.9)', backgroundColor: 'rgba(255,255,255,0.14)',
// //   },
// //   ringPicked: { borderStyle: 'solid', borderColor: '#fff', borderWidth: 4, backgroundColor: 'rgba(255,255,255,0.35)' },
// //   ringHint: { borderStyle: 'solid', borderColor: '#c5f158', borderWidth: 4, backgroundColor: 'rgba(197,241,88,0.35)' },
// //   ringOk: { borderColor: '#b6ef63', backgroundColor: 'rgba(182,239,99,0.45)' },
// //   ringBad: { borderColor: '#f0484f', backgroundColor: 'rgba(240,72,79,0.30)' },
// //   badge: {
// //     position: 'absolute', top: -4, right: -4, width: 24, height: 24, borderRadius: 12,
// //     backgroundColor: NAVY, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
// //   },
// //   badgeT: { fontFamily: F, fontSize: 13, fontWeight: 'bold', color: '#fff' },

// //   submit: {
// //     marginTop: 12, backgroundColor: '#b6ef63', borderRadius: 26, borderWidth: 3, borderColor: INK,
// //     paddingHorizontal: 30, paddingVertical: 8, elevation: 5,
// //   },
// //   submitT: { fontFamily: F, fontSize: 24, fontWeight: '900', color: INK },

// //   barWrap: { position: 'absolute', left: 14, right: 14, bottom: 8 },
// //   bar: {
// //     flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 30,
// //     backgroundColor: CREAM, borderRadius: 40, borderWidth: 5, borderColor: '#a9cdea',
// //     paddingTop: 10, paddingBottom: 8,
// //   },
// //   acol: { alignItems: 'center' },
// //   lblRow: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 24, marginTop: 4, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#6b4423' },
// //   lbl: { fontFamily: F, fontSize: 14, fontWeight: 'bold', color: '#fff' },
// //   hintBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#a8e22a', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center', elevation: 6 },
// //   videoBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f3efe2', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },
// //   skipBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f0484f', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },

// //   note: { position: 'absolute', bottom: 130, alignSelf: 'center', fontFamily: F, fontSize: 16, fontWeight: 'bold', color: '#c0392b', textAlign: 'center', paddingHorizontal: 20 },
// // });
// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, Pressable, Animated, StyleSheet } from 'react-native';
// import * as api from './api'; // same helpers the other levels use (hint / skip / reward)
// import { F, INK, Stage, Coin, loop } from './BTShared';
// import { Icon } from './Art';
// import { Level22Room } from './Btlevel22art'; // the cozy room background used by the other levels
// import { startLevel23, submitLevel23Answer } from './Btlevel23api';
// import { Face, FACE_IDS, FACE_LAYOUT } from './Btlevel23art';

// const NAVY = '#10245e';
// const CREAM = '#fbf6e9';
// const SKY = '#9fc6ea';
// const LEVEL = 23;
// const HINT_COST = 25;
// const SKIP_COST = 50;
// const FACE = 62;
// const RING = 72;

// type Props = {
//   playerId: number;
//   hints?: number;
//   setHints?: (n: number) => void;
//   onExit?: () => void;
//   onComplete?: (r: any) => void;
// };

// // pops in on mount, squishes when pressed
// function PopTouch({ inner, onPress, disabled, delay = 0, children }: any) {
//   const e = useRef(new Animated.Value(0)).current;
//   const sc = useRef(new Animated.Value(1)).current;
//   useEffect(() => {
//     Animated.sequence([
//       Animated.delay(delay),
//       Animated.spring(e, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
//     ]).start();
//   }, []);
//   const to = (v: number) =>
//     Animated.spring(sc, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
//   return (
//     <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.88)} onPressOut={() => to(1)}>
//       <Animated.View style={[inner, { opacity: e, transform: [{ scale: Animated.multiply(e, sc) }] }]}>
//         {children}
//       </Animated.View>
//     </Pressable>
//   );
// }

// export default function Btlevel23screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
//   const bal = Number(hints) || 0;

//   const [sequence, setSequence] = useState<string[] | null>(null);
//   const [picked, setPicked] = useState<string[]>([]);
//   const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
//   const [hintId, setHintId] = useState<string | null>(null);
//   const [note, setNote] = useState('');

//   const busy = useRef(false);
//   const done = useRef(false);
//   const session = useRef<Promise<any> | null>(null);
//   const shake = useRef(new Animated.Value(0)).current;
//   const sway = useRef(new Animated.Value(0)).current;
//   const pulse = useRef(new Animated.Value(0)).current;

//   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });
//   const pulseS = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.09] });

//   const flash = (m: string, ms = 2200) => {
//     setNote(m);
//     setTimeout(() => setNote(''), ms);
//   };
//   const doShake = () =>
//     Animated.sequence(
//       [10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))
//     ).start();

//   // The session is created silently in the background (no loading screen).
//   // If it fails it is simply retried the next time the player needs it.
//   const getSession = () => {
//     if (!session.current) {
//       session.current = startLevel23(playerId)
//         .then((d) => {
//           if (!d.success) throw new Error(d.error || 'start failed');
//           setSequence(d.sequence);
//           return d;
//         })
//         .catch((e) => {
//           session.current = null;
//           throw e;
//         });
//     }
//     return session.current;
//   };

//   useEffect(() => {
//     getSession().catch((e) => {
//       console.log('[L23] start failed:', e);
//       flash('Network error');
//     });
//     loop(sway, 1800);
//     loop(pulse, 900);
//   }, [playerId]);

//   // ---- tap a face: add to the order, tap again to take it back ----
//   const onTap = (id: string) => {
//     if (done.current || result) return;
//     setHintId(null);
//     setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
//   };

//   // ---- submit the tapped order ----
//   const onSubmit = async () => {
//     if (busy.current || done.current || picked.length !== FACE_IDS.length) return;
//     busy.current = true;
//     try {
//       const d = await getSession();
//       const data = await submitLevel23Answer(playerId, d.sessionId, picked);
//       if (data.success) {
//         if (data.correct) {
//           done.current = true;
//           setResult('correct');
//           setTimeout(
//             () => onComplete?.({ attempts: data.attempts || 1, skipped: false, correct: true }),
//             1200
//           );
//         } else {
//           setResult('wrong');
//           doShake();
//           flash('Not quite. Try again!', 1400);
//           setTimeout(() => {
//             setResult(null);
//             setPicked([]);
//           }, 1000);
//         }
//       } else {
//         flash(data.error || data.message || 'Something went wrong');
//       }
//     } catch (e) {
//       console.log('[L23] answer failed:', e);
//       flash('Network error');
//     } finally {
//       busy.current = false;
//     }
//   };

//   // ---- hint / video / skip (same costs as the other levels) ----
//   const hint = async () => {
//     if (busy.current || done.current) return;
//     if (!sequence) {
//       flash('Please wait...');
//       return;
//     }
//     if (bal < HINT_COST) {
//       flash('Need ' + HINT_COST + ' hints. You have ' + bal + '.');
//       return;
//     }
//     busy.current = true;
//     try {
//       const r: any = await api.hint(LEVEL, playerId, []);
//       if (typeof r?.hints === 'number') setHints?.(r.hints);
//       const wrongAt = picked.findIndex((id, i) => id !== sequence[i]);
//       if (wrongAt >= 0) {
//         flash('Check your order again!', 2500);
//       } else {
//         const next = sequence[picked.length];
//         if (next) {
//           setHintId(next);
//           setTimeout(() => setHintId(null), 2500);
//         }
//       }
//     } catch (e: any) {
//       flash(e?.status === 402 ? 'Not enough hints' : 'Hint not available');
//     } finally {
//       busy.current = false;
//     }
//   };

//   const video = async () => {
//     if (busy.current) return;
//     busy.current = true;
//     try {
//       const r: any = await api.reward(playerId, 'video');
//       if (typeof r?.hints === 'number') setHints?.(r.hints);
//     } catch (e) {
//     } finally {
//       busy.current = false;
//     }
//   };

//   const skip = async () => {
//     if (busy.current || done.current) return;
//     if (bal < SKIP_COST) {
//       flash('Need ' + SKIP_COST + ' hints. You have ' + bal + '.');
//       return;
//     }
//     busy.current = true;
//     try {
//       const r: any = await api.skip(LEVEL, playerId);
//       setHints?.(typeof r?.hints === 'number' ? r.hints : bal - SKIP_COST);
//       done.current = true;
//       onComplete?.({ attempts: 1, skipped: true });
//     } catch (e: any) {
//       flash(e?.status === 402 ? 'Not enough hints' : 'Skip not available');
//     } finally {
//       busy.current = false;
//     }
//   };

//   const ready = picked.length === FACE_IDS.length && !result;

//   return (
//     <Stage bg={SKY}>
//       <View style={st.wall}>
//         <Level22Room />

//         <View style={st.board}>
//           {/* top bar */}
//           <View style={st.top}>
//             <View style={st.topL}>
//               <TouchableOpacity style={st.round} onPress={onExit}>
//                 <Icon n="home" s={16} />
//               </TouchableOpacity>
//               <TouchableOpacity style={st.round}>
//                 <Icon n="gear" s={16} />
//               </TouchableOpacity>
//             </View>

//             <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
//               <View style={[st.string, { left: 26, transform: [{ rotate: '12deg' }] }]} />
//               <View style={[st.string, { right: 26, transform: [{ rotate: '-12deg' }] }]} />
//               <View style={st.sign}>
//                 <View style={[st.leafTop, { left: -8, transform: [{ rotate: '-30deg' }] }]} />
//                 <View style={[st.leafTop, { right: -8, transform: [{ rotate: '30deg' }] }]} />
//                 <View style={st.dashes}>
//                   <View style={[st.dash, { transform: [{ rotate: '-25deg' }] }]} />
//                   <View style={[st.dash, { transform: [{ rotate: '25deg' }] }]} />
//                 </View>
//                 <Text style={st.signt}>{'LEVEL ' + LEVEL}</Text>
//                 <View style={st.dashes}>
//                   <View style={[st.dash, { transform: [{ rotate: '25deg' }] }]} />
//                   <View style={[st.dash, { transform: [{ rotate: '-25deg' }] }]} />
//                 </View>
//               </View>
//             </Animated.View>

//             <View style={st.topR}>
//               <View style={st.bpill}>
//                 <Text style={st.bpt}>{hints ?? 0}</Text>
//                 <View style={{ position: 'absolute', right: -14, top: -10 }}>
//                   <Icon n="bulb" s={34} />
//                 </View>
//               </View>
//             </View>
//           </View>

//           {/* question banner with the order to follow */}
//           <View style={st.qWrap}>
//             <Text style={st.q}>Tap them in order:</Text>
//             <View style={st.seqRow}>
//               {sequence
//                 ? sequence.map((id) => (
//                     // hide the face up here as soon as the player taps it below
//                     <View key={id} style={{ opacity: picked.includes(id) ? 0 : 1 }}>
//                       <Face id={id} size={24} />
//                     </View>
//                   ))
//                 : null}
//             </View>
//           </View>

//           {/* faces */}
//           <Animated.View style={{ transform: [{ translateX: shake }], marginTop: 18 }}>
//             <View style={st.stage}>
//               {FACE_IDS.map((id, i) => {
//                 const pos = FACE_LAYOUT[id];
//                 const idx = picked.indexOf(id);
//                 const isPicked = idx >= 0;
//                 const isHint = hintId === id;
//                 return (
//                   <View key={id} style={{ position: 'absolute', left: pos.x - 5, top: pos.y - 5 }}>
//                     <PopTouch delay={i * 80} disabled={!!result} onPress={() => onTap(id)}>
//                       <View
//                         style={[
//                           st.ring,
//                           isPicked && st.ringPicked,
//                           isHint && st.ringHint,
//                           result === 'correct' && isPicked && st.ringOk,
//                           result === 'wrong' && isPicked && st.ringBad,
//                         ]}
//                       >
//                         <Face id={id} size={FACE} />
//                         {isPicked && (
//                           <View style={st.badge}>
//                             <Text style={st.badgeT}>{idx + 1}</Text>
//                           </View>
//                         )}
//                       </View>
//                     </PopTouch>
//                   </View>
//                 );
//               })}
//             </View>
//           </Animated.View>

//           {/* submit */}
//           <TouchableOpacity
//             style={[st.submit, !ready && { opacity: 0.5 }]}
//             disabled={!ready}
//             onPress={onSubmit}
//           >
//             <Text style={st.submitT}>SUBMIT</Text>
//           </TouchableOpacity>

//           {/* hint / video / skip bar */}
//           <View style={st.barWrap}>
//             <View style={st.bar}>
//               <View style={st.acol}>
//                 <Animated.View style={{ transform: [{ scale: pulseS }] }}>
//                   <PopTouch inner={st.hintBtn} onPress={hint}>
//                     <Icon n="search" s={34} />
//                   </PopTouch>
//                 </Animated.View>
//                 <View style={st.lblRow}>
//                   <Icon n="bulb" s={14} />
//                   <Text style={st.lbl}>{HINT_COST}</Text>
//                 </View>
//               </View>
//               <View style={st.acol}>
//                 <PopTouch inner={st.videoBtn} onPress={video}>
//                   <Icon n="film" s={40} />
//                 </PopTouch>
//                 <View style={st.lblRow}>
//                   <Coin s={12} />
//                   <Text style={st.lbl}>+75</Text>
//                 </View>
//               </View>
//               <View style={st.acol}>
//                 <PopTouch inner={st.skipBtn} onPress={skip}>
//                   <Icon n="play" s={36} />
//                 </PopTouch>
//                 <View style={st.lblRow}>
//                   <Icon n="bulb" s={14} />
//                   <Text style={st.lbl}>{SKIP_COST}</Text>
//                 </View>
//               </View>
//             </View>
//           </View>

//           {!!note && <Text style={st.note}>{note}</Text>}
//         </View>
//       </View>
//     </Stage>
//   );
// }

// const st = StyleSheet.create({
//   wall: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
//   board: { flex: 1, alignItems: 'center', paddingTop: 14 },

//   top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 8, width: '100%' },
//   topL: { flexDirection: 'row', gap: 6, minWidth: 80, marginTop: 10 },
//   topR: { minWidth: 80, alignItems: 'flex-end', marginTop: 14, paddingRight: 14 },
//   round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ffe27a', borderWidth: 2, borderColor: INK, alignItems: 'center', justifyContent: 'center' },

//   signWrap: { alignItems: 'center', paddingTop: 14 },
//   string: { position: 'absolute', top: -6, width: 2, height: 22, backgroundColor: '#9a6a3a' },
//   sign: {
//     flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#a8601f',
//     borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
//     elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
//   },
//   leafTop: { position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: '#5fae3a' },
//   signt: { fontFamily: F, fontSize: 22, fontWeight: 'bold', color: '#fff' },
//   dashes: { gap: 4, justifyContent: 'center' },
//   dash: { width: 10, height: 3, borderRadius: 2, backgroundColor: '#ffc83d' },

//   bpill: { backgroundColor: '#fff', borderRadius: 16, height: 30, minWidth: 58, paddingLeft: 12, paddingRight: 18, justifyContent: 'center', borderWidth: 2, borderColor: '#e6e6e6' },
//   bpt: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK },

//   qWrap: {
//     backgroundColor: CREAM, borderRadius: 24, paddingHorizontal: 22, paddingVertical: 10,
//     marginTop: 10, alignItems: 'center', elevation: 4,
//     shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
//   },
//   q: { fontFamily: F, fontSize: 20, fontWeight: 'bold', color: NAVY, textAlign: 'center' },
//   seqRow: { flexDirection: 'row', gap: 4, marginTop: 6, minHeight: 24 },

//   stage: { width: 290, height: 250 },
//   ring: {
//     width: RING, height: RING, borderRadius: RING / 2, alignItems: 'center', justifyContent: 'center',
//     borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.9)', backgroundColor: 'rgba(255,255,255,0.14)',
//   },
//   ringPicked: { borderStyle: 'solid', borderColor: '#fff', borderWidth: 4, backgroundColor: 'rgba(255,255,255,0.35)' },
//   ringHint: { borderStyle: 'solid', borderColor: '#c5f158', borderWidth: 4, backgroundColor: 'rgba(197,241,88,0.35)' },
//   ringOk: { borderColor: '#b6ef63', backgroundColor: 'rgba(182,239,99,0.45)' },
//   ringBad: { borderColor: '#f0484f', backgroundColor: 'rgba(240,72,79,0.30)' },
//   badge: {
//     position: 'absolute', top: -4, right: -4, width: 24, height: 24, borderRadius: 12,
//     backgroundColor: NAVY, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
//   },
//   badgeT: { fontFamily: F, fontSize: 13, fontWeight: 'bold', color: '#fff' },

//   submit: {
//     marginTop: 12, backgroundColor: '#b6ef63', borderRadius: 26, borderWidth: 3, borderColor: INK,
//     paddingHorizontal: 30, paddingVertical: 8, elevation: 5,
//   },
//   submitT: { fontFamily: F, fontSize: 24, fontWeight: '900', color: INK },

//   barWrap: { position: 'absolute', left: 14, right: 14, bottom: 8 },
//   bar: {
//     flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 30,
//     backgroundColor: CREAM, borderRadius: 40, borderWidth: 5, borderColor: '#a9cdea',
//     paddingTop: 10, paddingBottom: 8,
//   },
//   acol: { alignItems: 'center' },
//   lblRow: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 24, marginTop: 4, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#6b4423' },
//   lbl: { fontFamily: F, fontSize: 14, fontWeight: 'bold', color: '#fff' },
//   hintBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#a8e22a', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   videoBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f3efe2', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   skipBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f0484f', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },

//   note: { position: 'absolute', bottom: 130, alignSelf: 'center', fontFamily: F, fontSize: 16, fontWeight: 'bold', color: '#c0392b', textAlign: 'center', paddingHorizontal: 20 },
// });
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, Animated, StyleSheet } from 'react-native';
import * as api from './api'; // same helpers the other levels use (hint / skip / reward)
import { F, INK, Stage, Coin, loop } from './BTShared';
import { Icon } from './Art';
import { Level22Room } from './Btlevel22art'; // the cozy room background used by the other levels
import { startLevel23, submitLevel23Answer } from './Btlevel23api';
import { Face, FACE_IDS, FACE_LAYOUT } from './Btlevel23art';

const NAVY = '#10245e';
const CREAM = '#fbf6e9';
const SKY = '#9fc6ea';
const LEVEL = 23;
const HINT_COST = 25;
const SKIP_COST = 50;
const FACE = 62;
const RING = 72;

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onComplete?: (r: any) => void;
};

// pops in on mount, squishes when pressed
function PopTouch({ inner, onPress, disabled, delay = 0, children }: any) {
  const e = useRef(new Animated.Value(0)).current;
  const sc = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(e, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
    ]).start();
  }, []);
  const to = (v: number) =>
    Animated.spring(sc, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
  return (
    <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.88)} onPressOut={() => to(1)}>
      <Animated.View style={[inner, { opacity: e, transform: [{ scale: Animated.multiply(e, sc) }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function Btlevel23screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
  const bal = Number(hints) || 0;

  const [sequence, setSequence] = useState<string[] | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [hintId, setHintId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const busy = useRef(false);
  const done = useRef(false);
  const session = useRef<Promise<any> | null>(null);
  const shake = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });
  const pulseS = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.09] });

  const flash = (m: string, ms = 2200) => {
    setNote(m);
    setTimeout(() => setNote(''), ms);
  };
  const doShake = () =>
    Animated.sequence(
      [10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))
    ).start();

  // The session is created silently in the background (no loading screen).
  // If it fails it is simply retried the next time the player needs it.
  const getSession = () => {
    if (!session.current) {
      session.current = startLevel23(playerId)
        .then((d) => {
          if (!d.success) throw new Error(d.error || 'start failed');
          setSequence(d.sequence);
          return d;
        })
        .catch((e) => {
          session.current = null;
          throw e;
        });
    }
    return session.current;
  };

  useEffect(() => {
    getSession().catch((e) => {
      console.log('[L23] start failed:', e);
      flash('Network error');
    });
    loop(sway, 1800);
    loop(pulse, 900);
  }, [playerId]);

  // ---- tap a face: add to the order, tap again to take it back ----
  const onTap = (id: string) => {
    if (done.current || result) return;
    setHintId(null);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  // ---- submit the tapped order ----
  const onSubmit = async () => {
    if (busy.current || done.current || picked.length !== FACE_IDS.length) return;
    busy.current = true;
    try {
      const d = await getSession();
      const data = await submitLevel23Answer(playerId, d.sessionId, picked);
      if (data.success) {
        if (data.correct) {
          done.current = true;
          setResult('correct');
          setTimeout(
            () => onComplete?.({ attempts: data.attempts || 1, skipped: false, correct: true }),
            1200
          );
        } else {
          setResult('wrong');
          doShake();
          flash('Not quite. Try again!', 1400);
          setTimeout(() => {
            setResult(null);
            setPicked([]);
          }, 1000);
        }
      } else {
        flash(data.error || data.message || 'Something went wrong');
      }
    } catch (e) {
      console.log('[L23] answer failed:', e);
      flash('Network error');
    } finally {
      busy.current = false;
    }
  };

  // ---- hint / video / skip (same costs as the other levels) ----
  const hint = async () => {
    if (busy.current || done.current) return;
    if (!sequence) {
      flash('Please wait...');
      return;
    }
    if (bal < HINT_COST) {
      flash('Need ' + HINT_COST + ' hints. You have ' + bal + '.');
      return;
    }
    busy.current = true;
    try {
      const r: any = await api.hint(LEVEL, playerId, []);
      if (typeof r?.hints === 'number') setHints?.(r.hints);
      const wrongAt = picked.findIndex((id, i) => id !== sequence[i]);
      if (wrongAt >= 0) {
        flash('Check your order again!', 2500);
      } else {
        const next = sequence[picked.length];
        if (next) {
          setHintId(next);
          setTimeout(() => setHintId(null), 2500);
        }
      }
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Hint not available');
    } finally {
      busy.current = false;
    }
  };

  const video = async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      const r: any = await api.reward(playerId, 'video');
      if (typeof r?.hints === 'number') setHints?.(r.hints);
    } catch (e) {
    } finally {
      busy.current = false;
    }
  };

  const skip = async () => {
    if (busy.current || done.current) return;
    if (bal < SKIP_COST) {
      flash('Need ' + SKIP_COST + ' hints. You have ' + bal + '.');
      return;
    }
    busy.current = true;
    try {
      const r: any = await api.skip(LEVEL, playerId);
      setHints?.(typeof r?.hints === 'number' ? r.hints : bal - SKIP_COST);
      done.current = true;
      onComplete?.({ attempts: 1, skipped: true });
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Skip not available');
    } finally {
      busy.current = false;
    }
  };

  const ready = picked.length === FACE_IDS.length && !result;

  return (
    <Stage bg={SKY}>
      <View style={st.wall}>
        <Level22Room />

        <View style={st.board}>
          {/* top bar */}
          <View style={st.top}>
            <View style={st.topL}>
              <TouchableOpacity style={st.round} onPress={onExit}>
                <Icon n="home" s={16} />
              </TouchableOpacity>
              <TouchableOpacity style={st.round}>
                <Icon n="gear" s={16} />
              </TouchableOpacity>
            </View>

            <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
              <View style={[st.string, { left: 26, transform: [{ rotate: '12deg' }] }]} />
              <View style={[st.string, { right: 26, transform: [{ rotate: '-12deg' }] }]} />
              <View style={st.sign}>
                <View style={[st.leafTop, { left: -8, transform: [{ rotate: '-30deg' }] }]} />
                <View style={[st.leafTop, { right: -8, transform: [{ rotate: '30deg' }] }]} />
                <View style={st.dashes}>
                  <View style={[st.dash, { transform: [{ rotate: '-25deg' }] }]} />
                  <View style={[st.dash, { transform: [{ rotate: '25deg' }] }]} />
                </View>
                <Text style={st.signt}>{'LEVEL ' + LEVEL}</Text>
                <View style={st.dashes}>
                  <View style={[st.dash, { transform: [{ rotate: '25deg' }] }]} />
                  <View style={[st.dash, { transform: [{ rotate: '-25deg' }] }]} />
                </View>
              </View>
            </Animated.View>

            <View style={st.topR}>
              <View style={st.bpill}>
                <Text style={st.bpt}>{hints ?? 0}</Text>
                <View style={{ position: 'absolute', right: -14, top: -10 }}>
                  <Icon n="bulb" s={34} />
                </View>
              </View>
            </View>
          </View>

          {/* question banner: the whole card hides as soon as the player taps the first face */}
          <View
            style={[st.qWrap, { opacity: picked.length > 0 ? 0 : 1 }]}
            pointerEvents="none"
          >
            <Text style={st.q}>Tap them in order:</Text>
            <View style={st.seqRow}>
              {sequence ? sequence.map((id) => <Face key={id} id={id} size={24} />) : null}
            </View>
          </View>

          {/* faces */}
          <Animated.View style={{ transform: [{ translateX: shake }], marginTop: 18 }}>
            <View style={st.stage}>
              {FACE_IDS.map((id, i) => {
                const pos = FACE_LAYOUT[id];
                const idx = picked.indexOf(id);
                const isPicked = idx >= 0;
                const isHint = hintId === id;
                return (
                  <View key={id} style={{ position: 'absolute', left: pos.x - 5, top: pos.y - 5 }}>
                    <PopTouch delay={i * 80} disabled={!!result} onPress={() => onTap(id)}>
                      <View
                        style={[
                          st.ring,
                          isPicked && st.ringPicked,
                          isHint && st.ringHint,
                          result === 'correct' && isPicked && st.ringOk,
                          result === 'wrong' && isPicked && st.ringBad,
                        ]}
                      >
                        <Face id={id} size={FACE} />
                        {isPicked && (
                          <View style={st.badge}>
                            <Text style={st.badgeT}>{idx + 1}</Text>
                          </View>
                        )}
                      </View>
                    </PopTouch>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          {/* submit */}
          <TouchableOpacity
            style={[st.submit, !ready && { opacity: 0.5 }]}
            disabled={!ready}
            onPress={onSubmit}
          >
            <Text style={st.submitT}>SUBMIT</Text>
          </TouchableOpacity>

          {/* hint / video / skip bar */}
          <View style={st.barWrap}>
            <View style={st.bar}>
              <View style={st.acol}>
                <Animated.View style={{ transform: [{ scale: pulseS }] }}>
                  <PopTouch inner={st.hintBtn} onPress={hint}>
                    <Icon n="search" s={34} />
                  </PopTouch>
                </Animated.View>
                <View style={st.lblRow}>
                  <Icon n="bulb" s={14} />
                  <Text style={st.lbl}>{HINT_COST}</Text>
                </View>
              </View>
              <View style={st.acol}>
                <PopTouch inner={st.videoBtn} onPress={video}>
                  <Icon n="film" s={40} />
                </PopTouch>
                <View style={st.lblRow}>
                  <Coin s={12} />
                  <Text style={st.lbl}>+75</Text>
                </View>
              </View>
              <View style={st.acol}>
                <PopTouch inner={st.skipBtn} onPress={skip}>
                  <Icon n="play" s={36} />
                </PopTouch>
                <View style={st.lblRow}>
                  <Icon n="bulb" s={14} />
                  <Text style={st.lbl}>{SKIP_COST}</Text>
                </View>
              </View>
            </View>
          </View>

          {!!note && <Text style={st.note}>{note}</Text>}
        </View>
      </View>
    </Stage>
  );
}

const st = StyleSheet.create({
  wall: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
  board: { flex: 1, alignItems: 'center', paddingTop: 14 },

  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 8, width: '100%' },
  topL: { flexDirection: 'row', gap: 6, minWidth: 80, marginTop: 10 },
  topR: { minWidth: 80, alignItems: 'flex-end', marginTop: 14, paddingRight: 14 },
  round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ffe27a', borderWidth: 2, borderColor: INK, alignItems: 'center', justifyContent: 'center' },

  signWrap: { alignItems: 'center', paddingTop: 14 },
  string: { position: 'absolute', top: -6, width: 2, height: 22, backgroundColor: '#9a6a3a' },
  sign: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#a8601f',
    borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
  },
  leafTop: { position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: '#5fae3a' },
  signt: { fontFamily: F, fontSize: 22, fontWeight: 'bold', color: '#fff' },
  dashes: { gap: 4, justifyContent: 'center' },
  dash: { width: 10, height: 3, borderRadius: 2, backgroundColor: '#ffc83d' },

  bpill: { backgroundColor: '#fff', borderRadius: 16, height: 30, minWidth: 58, paddingLeft: 12, paddingRight: 18, justifyContent: 'center', borderWidth: 2, borderColor: '#e6e6e6' },
  bpt: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK },

  qWrap: {
    backgroundColor: CREAM, borderRadius: 24, paddingHorizontal: 22, paddingVertical: 10,
    marginTop: 10, alignItems: 'center', elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  q: { fontFamily: F, fontSize: 20, fontWeight: 'bold', color: NAVY, textAlign: 'center' },
  seqRow: { flexDirection: 'row', gap: 4, marginTop: 6, minHeight: 24 },

  stage: { width: 290, height: 250 },
  ring: {
    width: RING, height: RING, borderRadius: RING / 2, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.9)', backgroundColor: 'rgba(255,255,255,0.14)',
  },
  ringPicked: { borderStyle: 'solid', borderColor: '#fff', borderWidth: 4, backgroundColor: 'rgba(255,255,255,0.35)' },
  ringHint: { borderStyle: 'solid', borderColor: '#c5f158', borderWidth: 4, backgroundColor: 'rgba(197,241,88,0.35)' },
  ringOk: { borderColor: '#b6ef63', backgroundColor: 'rgba(182,239,99,0.45)' },
  ringBad: { borderColor: '#f0484f', backgroundColor: 'rgba(240,72,79,0.30)' },
  badge: {
    position: 'absolute', top: -4, right: -4, width: 24, height: 24, borderRadius: 12,
    backgroundColor: NAVY, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  badgeT: { fontFamily: F, fontSize: 13, fontWeight: 'bold', color: '#fff' },

  submit: {
    marginTop: 12, backgroundColor: '#b6ef63', borderRadius: 26, borderWidth: 3, borderColor: INK,
    paddingHorizontal: 30, paddingVertical: 8, elevation: 5,
  },
  submitT: { fontFamily: F, fontSize: 24, fontWeight: '900', color: INK },

  barWrap: { position: 'absolute', left: 14, right: 14, bottom: 8 },
  bar: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 30,
    backgroundColor: CREAM, borderRadius: 40, borderWidth: 5, borderColor: '#a9cdea',
    paddingTop: 10, paddingBottom: 8,
  },
  acol: { alignItems: 'center' },
  lblRow: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 24, marginTop: 4, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#6b4423' },
  lbl: { fontFamily: F, fontSize: 14, fontWeight: 'bold', color: '#fff' },
  hintBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#a8e22a', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  videoBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f3efe2', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  skipBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f0484f', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },

  note: { position: 'absolute', bottom: 130, alignSelf: 'center', fontFamily: F, fontSize: 16, fontWeight: 'bold', color: '#c0392b', textAlign: 'center', paddingHorizontal: 20 },
});