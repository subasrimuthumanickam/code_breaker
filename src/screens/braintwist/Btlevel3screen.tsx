// // // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // // import {
// // // // //   View, Text, TouchableOpacity, Animated, StyleSheet, Platform,
// // // // //   ActivityIndicator, useWindowDimensions,
// // // // // } from 'react-native';
// // // // // import {
// // // // //   startLevel3, answerLevel3, hintLevel3, skipLevel3, rewardLevel3,
// // // // //   Level3Start, Level3Answer,
// // // // // } from './Btlevel3api';
// // // // // import { SpotScene, MagnifierIcon, VideoIcon, SkipIcon, CoinIcon } from './Btlevel3art';
// // // // // import { HomeIcon, GearIcon, BulbIcon, StarIcon, ChalkTray } from './Btlevel2art';

// // // // // const FONT: any = Platform.select({ ios: 'Chalkboard SE', android: 'sans-serif-condensed', default: 'sans-serif' });
// // // // // const BOARD = '#1d6a49', FRAME = '#e08a2e', PAGE = '#f4e4c6', LIME = '#a6e22e', CREAM = '#f7f1df', YELLOW = '#ffd33d';
// // // // // const COST_HINT = 25, COST_SKIP = 50, REWARD = 75;

// // // // // type Props = {
// // // // //   playerId: number;
// // // // //   onExit: () => void;
// // // // //   onComplete?: (result: Level3Answer) => void;
// // // // // };

// // // // // export default function BTLevel3Screen({ playerId, onExit, onComplete }: Props) {
// // // // //   const { width, height } = useWindowDimensions();
// // // // //   const bw = Math.min(width, 480);
// // // // //   const pw = Math.min(150, Math.floor((bw - 16 - 18 - 36) / 2));
// // // // //   const ring = Math.min(70, Math.floor((bw - 16 - 24) / 4.6));

// // // // //   const [data, setData] = useState<Level3Start | null>(null);
// // // // //   const [loadErr, setLoadErr] = useState('');
// // // // //   const [hints, setHints] = useState(0);
// // // // //   const [removed, setRemoved] = useState<number[]>([]);
// // // // //   const [picked, setPicked] = useState<number | null>(null);
// // // // //   const [msg, setMsg] = useState('');
// // // // //   const [busy, setBusy] = useState(false);
// // // // //   const [result, setResult] = useState<Level3Answer | null>(null);

// // // // //   const shake = useRef(new Animated.Value(0)).current;
// // // // //   const pop = useRef(new Animated.Value(0)).current;
// // // // //   const msgTimer = useRef<any>(null);
// // // // //   const timers = useRef<any[]>([]);

// // // // //   // 1. open the level (backend creates or resumes the session)
// // // // //   const load = useCallback(() => {
// // // // //     setLoadErr('');
// // // // //     setData(null);
// // // // //     startLevel3(playerId)
// // // // //       .then((d) => {
// // // // //         setData(d);
// // // // //         setHints(d.hints);
// // // // //         setRemoved(d.removed || []);
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

// // // // //   const showMsg = (m: string) => {
// // // // //     setMsg(m);
// // // // //     clearTimeout(msgTimer.current);
// // // // //     msgTimer.current = setTimeout(() => setMsg(''), 2600);
// // // // //   };

// // // // //   const shakeOptions = () => {
// // // // //     Animated.sequence([
// // // // //       Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
// // // // //       Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
// // // // //       Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
// // // // //       Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
// // // // //     ]).start();
// // // // //   };

// // // // //   // 2. player picked a number -> ask the backend
// // // // //   const pick = async (n: number) => {
// // // // //     if (busy || !data || result || removed.includes(n)) return;
// // // // //     setBusy(true);
// // // // //     setPicked(n);
// // // // //     setMsg('');
// // // // //     try {
// // // // //       const res = await answerLevel3({ sessionId: data.sessionId, playerId, picked: n });
// // // // //       if (!res.correct) {
// // // // //         showMsg(res.message || 'Not quite. Look again!');
// // // // //         shakeOptions();
// // // // //         setTimeout(() => setPicked(null), 500);
// // // // //         setBusy(false);
// // // // //         return;
// // // // //       }
// // // // //       if (typeof res.hints === 'number') setHints(res.hints);
// // // // //       timers.current.push(setTimeout(() => setResult(res), 700));
// // // // //     } catch (e: any) {
// // // // //       showMsg(e.message || 'Network error');
// // // // //       setPicked(null);
// // // // //       setBusy(false);
// // // // //     }
// // // // //   };

// // // // //   // 3. magnifier: backend removes one wrong number
// // // // //   const useHint = async () => {
// // // // //     if (busy || !data || result) return;
// // // // //     setBusy(true);
// // // // //     try {
// // // // //       const res = await hintLevel3({ sessionId: data.sessionId, playerId });
// // // // //       setHints(res.hints);
// // // // //       setRemoved(res.removed || []);
// // // // //       if (res.hint.text) showMsg(res.hint.text);
// // // // //     } catch (e: any) {
// // // // //       showMsg(e.message || 'Hint failed');
// // // // //     }
// // // // //     setBusy(false);
// // // // //   };

// // // // //   // 4. video: +75 hints
// // // // //   const watchVideo = async () => {
// // // // //     if (busy || result) return;
// // // // //     setBusy(true);
// // // // //     try {
// // // // //       const res = await rewardLevel3(playerId);
// // // // //       setHints(res.hints);
// // // // //       showMsg(`+${res.added} hints!`);
// // // // //     } catch (e: any) {
// // // // //       showMsg(e.message || 'Reward failed');
// // // // //     }
// // // // //     setBusy(false);
// // // // //   };

// // // // //   // 5. skip level
// // // // //   const skip = async () => {
// // // // //     if (busy || !data || result) return;
// // // // //     setBusy(true);
// // // // //     try {
// // // // //       const res = await skipLevel3({ sessionId: data.sessionId, playerId });
// // // // //       if (typeof res.hints === 'number') setHints(res.hints);
// // // // //       setResult(res);
// // // // //     } catch (e: any) {
// // // // //       showMsg(e.message || 'Skip failed');
// // // // //       setBusy(false);
// // // // //     }
// // // // //   };

// // // // //   /* ---------- loading / error ---------- */

// // // // //   if (loadErr || !data) {
// // // // //     return (
// // // // //       <View style={st.page}>
// // // // //         <View style={[st.frame, { width: bw - 16 }]}>
// // // // //           <View style={[st.board, { alignItems: 'center', justifyContent: 'center' }]}>
// // // // //             {loadErr ? (
// // // // //               <>
// // // // //                 <Text style={st.errText}>{loadErr}</Text>
// // // // //                 <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // // //                 <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // // //               </>
// // // // //             ) : (
// // // // //               <>
// // // // //                 <ActivityIndicator color="#fff" size="large" />
// // // // //                 <Text style={st.loading}>Loading level 3...</Text>
// // // // //               </>
// // // // //             )}
// // // // //           </View>
// // // // //         </View>
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <View style={st.page}>
// // // // //       <View style={[st.frame, { width: bw - 16 }]}>
// // // // //         <View style={st.board}>

// // // // //           {/* header */}
// // // // //           <View style={st.header}>
// // // // //             <View style={st.headLeft}>
// // // // //               <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon /></TouchableOpacity>
// // // // //               <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon /></TouchableOpacity>
// // // // //             </View>
// // // // //             <View style={st.plaque}>
// // // // //               <Text style={st.chev}>‹</Text>
// // // // //               <Text style={st.plaqueT}>LEVEL 3</Text>
// // // // //               <Text style={st.chev}>›</Text>
// // // // //             </View>
// // // // //             <View style={st.pillWrap}>
// // // // //               <View style={st.pill}><Text style={st.pillT}>{hints}</Text></View>
// // // // //               <View style={st.bulb}><BulbIcon size={28} /></View>
// // // // //             </View>
// // // // //           </View>

// // // // //           {/* question */}
// // // // //           <Text style={[st.question, msg ? { color: YELLOW } : null]}>
// // // // //             {msg || data.question}
// // // // //           </Text>

// // // // //           {/* two pictures */}
// // // // //           <View style={st.pictures}>
// // // // //             <SpotScene side="a" width={pw} />
// // // // //             <SpotScene side="b" width={pw} />
// // // // //           </View>

// // // // //           {/* answer options */}
// // // // //           <Animated.View style={[st.optionsRow, { transform: [{ translateX: shake }] }]}>
// // // // //             {data.options.map((n) => {
// // // // //               const gone = removed.includes(n);
// // // // //               const on = picked === n;
// // // // //               return (
// // // // //                 <TouchableOpacity
// // // // //                   key={n}
// // // // //                   activeOpacity={0.8}
// // // // //                   disabled={gone || busy || !!result}
// // // // //                   onPress={() => pick(n)}
// // // // //                   style={{ opacity: gone ? 0.2 : 1 }}
// // // // //                 >
// // // // //                   <View style={[st.optRing, { width: ring, height: ring, borderRadius: ring / 2 }, on && { backgroundColor: LIME }]}>
// // // // //                     <Text style={[st.optNum, { fontSize: ring * 0.6 }, on && { color: '#1b1b1b' }]}>{n}</Text>
// // // // //                   </View>
// // // // //                 </TouchableOpacity>
// // // // //               );
// // // // //             })}
// // // // //           </Animated.View>

// // // // //           <View style={{ flex: 1 }} />

// // // // //           {/* hint / video / skip */}
// // // // //           <View style={st.actions}>
// // // // //             <View style={st.actCol}>
// // // // //               <TouchableOpacity style={[st.act, { backgroundColor: LIME }]} onPress={useHint} activeOpacity={0.85}>
// // // // //                 <MagnifierIcon size={38} />
// // // // //               </TouchableOpacity>
// // // // //               <View style={st.costRow}><BulbIcon size={16} /><Text style={st.costT}>{COST_HINT}</Text></View>
// // // // //             </View>
// // // // //             <View style={st.actCol}>
// // // // //               <TouchableOpacity style={[st.act, { backgroundColor: CREAM }]} onPress={watchVideo} activeOpacity={0.85}>
// // // // //                 <VideoIcon size={40} />
// // // // //               </TouchableOpacity>
// // // // //               <View style={st.costRow}><CoinIcon size={16} /><Text style={st.costT}>+{REWARD}</Text></View>
// // // // //             </View>
// // // // //             <View style={st.actCol}>
// // // // //               <TouchableOpacity style={[st.act, { backgroundColor: '#ee4a55' }]} onPress={skip} activeOpacity={0.85}>
// // // // //                 <SkipIcon size={40} />
// // // // //               </TouchableOpacity>
// // // // //               <View style={st.costRow}><BulbIcon size={16} /><Text style={st.costT}>{COST_SKIP}</Text></View>
// // // // //             </View>
// // // // //           </View>

// // // // //           <ChalkTray />

// // // // //           {/* result card */}
// // // // //           {!!result && (
// // // // //             <View style={st.overlay}>
// // // // //               <Animated.View style={[st.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
// // // // //                 <Text style={st.cardTitle}>Level complete!</Text>
// // // // //                 <Text style={st.cardMsg}>{result.message}</Text>
// // // // //                 <View style={st.stars}>{[1, 2, 3].map((n) => <StarIcon key={n} size={46} on={n <= (result.stars || 0)} />)}</View>
// // // // //                 {!result.skipped && <Text style={st.cardScore}>Score {result.score}</Text>}
// // // // //                 <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}>
// // // // //                   <Text style={st.nextT}>NEXT</Text>
// // // // //                 </TouchableOpacity>
// // // // //               </Animated.View>
// // // // //             </View>
// // // // //           )}
// // // // //         </View>
// // // // //       </View>
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // /* =========================================================
// // // // //    STYLES
// // // // // ========================================================= */

// // // // // const st = StyleSheet.create({
// // // // //   page: { flex: 1, backgroundColor: PAGE, alignItems: 'center' },
// // // // //   frame: {
// // // // //     flex: 1, marginVertical: 8, backgroundColor: FRAME, borderRadius: 22, padding: 9,
// // // // //     shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
// // // // //   },
// // // // //   board: { flex: 1, backgroundColor: BOARD, borderRadius: 14, overflow: 'hidden', paddingTop: 14 },

// // // // //   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
// // // // //   headLeft: { flexDirection: 'row', gap: 8 },
// // // // //   round: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffd83a', borderWidth: 2.5, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
// // // // //   plaque: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#9a5a1c', borderWidth: 3, borderColor: '#c98a3e', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 5 },
// // // // //   plaqueT: { fontFamily: FONT, fontSize: 21, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
// // // // //   chev: { fontSize: 26, fontWeight: '900', color: YELLOW, marginTop: -3 },
// // // // //   pillWrap: { minWidth: 110, height: 44, justifyContent: 'center' },
// // // // //   pill: { height: 36, borderRadius: 18, backgroundColor: '#fff', justifyContent: 'center', paddingLeft: 18, paddingRight: 30 },
// // // // //   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
// // // // //   bulb: { position: 'absolute', right: -4, top: -2 },

// // // // //   question: {
// // // // //     fontFamily: FONT, fontSize: 21, lineHeight: 27, fontStyle: 'italic', fontWeight: '600',
// // // // //     color: '#f1f6ef', textAlign: 'center', paddingHorizontal: 22, marginTop: 16, minHeight: 56,
// // // // //   },
// // // // //   pictures: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 8 },

// // // // //   optionsRow: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 8, marginTop: 18 },
// // // // //   optRing: { borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.65)', alignItems: 'center', justifyContent: 'center' },
// // // // //   optNum: { fontFamily: FONT, fontWeight: '900', color: '#f7f1df' },

// // // // //   actions: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-start', paddingHorizontal: 8, marginBottom: 6 },
// // // // //   actCol: { alignItems: 'center' },
// // // // //   act: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
// // // // //   costRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
// // // // //   costT: { fontFamily: FONT, fontSize: 16, fontWeight: '700', color: '#fff' },

// // // // //   overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
// // // // //   card: { width: '82%', alignItems: 'center', backgroundColor: '#175a3d', borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.8)', borderRadius: 22, padding: 20 },
// // // // //   cardTitle: { fontFamily: FONT, fontSize: 30, fontWeight: '800', color: '#fff' },
// // // // //   cardMsg: { fontFamily: FONT, fontSize: 18, color: '#d8f3e3', textAlign: 'center', marginTop: 6 },
// // // // //   stars: { flexDirection: 'row', gap: 6, marginTop: 14 },
// // // // //   cardScore: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: YELLOW, marginTop: 10 },
// // // // //   next: { marginTop: 18, minWidth: 170, height: 58, borderRadius: 29, backgroundColor: LIME, borderWidth: 3, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
// // // // //   nextT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#1b1b1b' },

// // // // //   loading: { fontFamily: FONT, fontSize: 18, color: '#fff', marginTop: 12 },
// // // // //   errText: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// // // // //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
// // // // //   retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
// // // // //   back: { fontFamily: FONT, fontSize: 16, color: '#d8f3e3', marginTop: 14, textDecorationLine: 'underline' },
// // // // // });
// // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // import {
// // // //   View, Text, TouchableOpacity, Animated, StyleSheet, Platform,
// // // //   ActivityIndicator, useWindowDimensions,
// // // // } from 'react-native';
// // // // import {
// // // //   startLevel3, answerLevel3, hintLevel3, skipLevel3, rewardLevel3,
// // // //   Level3Start, Level3Answer,
// // // // } from './Btlevel3api';
// // // // import { SpotScene, MagnifierIcon, VideoIcon, SkipIcon, CoinIcon } from './Btlevel3art';
// // // // import { HomeIcon, GearIcon, BulbIcon, StarIcon, ChalkTray } from './Btlevel2art';

// // // // const FONT: any = Platform.select({ ios: 'Chalkboard SE', android: 'sans-serif-condensed', default: 'sans-serif' });
// // // // const BOARD = '#1d6a49', FRAME = '#e08a2e', PAGE = '#f4e4c6', LIME = '#a6e22e', CREAM = '#f7f1df', YELLOW = '#ffd33d';
// // // // const COST_HINT = 25, COST_SKIP = 50, REWARD = 75;

// // // // type Props = {
// // // //   playerId: number;
// // // //   onHints?: (h: number) => void;   // keeps the shared hint count (congrats screen) in sync
// // // //   onExit: () => void;
// // // //   onComplete?: (result: Level3Answer) => void;
// // // // };

// // // // export default function BTLevel3Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // // //   const { width } = useWindowDimensions();
// // // //   const bw = Math.min(width, 480);
// // // //   const pw = Math.min(150, Math.floor((bw - 16 - 18 - 36) / 2));
// // // //   const ring = Math.min(70, Math.floor((bw - 16 - 24) / 4.6));

// // // //   const [data, setData] = useState<Level3Start | null>(null);
// // // //   const [loadErr, setLoadErr] = useState('');
// // // //   const [hints, setHints] = useState(0);
// // // //   const [removed, setRemoved] = useState<number[]>([]);
// // // //   const [picked, setPicked] = useState<number | null>(null);
// // // //   const [msg, setMsg] = useState('');
// // // //   const [busy, setBusy] = useState(false);
// // // //   const [result, setResult] = useState<Level3Answer | null>(null);

// // // //   const shake = useRef(new Animated.Value(0)).current;
// // // //   const pop = useRef(new Animated.Value(0)).current;
// // // //   const msgTimer = useRef<any>(null);
// // // //   const timers = useRef<any[]>([]);

// // // //   // 1. open the level (backend creates or resumes the session)
// // // //   const load = useCallback(() => {
// // // //     setLoadErr('');
// // // //     setData(null);
// // // //     startLevel3(playerId)
// // // //       .then((d) => {
// // // //         setData(d);
// // // //         setHints(d.hints);
// // // //         setRemoved(d.removed || []);
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

// // // //   // tell the parent the current hint count (only after the level has loaded)
// // // //   useEffect(() => {
// // // //     if (data) onHints?.(hints);
// // // //   }, [hints, data]);

// // // //   const showMsg = (m: string) => {
// // // //     setMsg(m);
// // // //     clearTimeout(msgTimer.current);
// // // //     msgTimer.current = setTimeout(() => setMsg(''), 2600);
// // // //   };

// // // //   const shakeOptions = () => {
// // // //     Animated.sequence([
// // // //       Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
// // // //       Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
// // // //       Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
// // // //       Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
// // // //     ]).start();
// // // //   };

// // // //   // 2. player picked a number -> ask the backend
// // // //   const pick = async (n: number) => {
// // // //     if (busy || !data || result || removed.includes(n)) return;
// // // //     setBusy(true);
// // // //     setPicked(n);
// // // //     setMsg('');
// // // //     try {
// // // //       const res = await answerLevel3({ sessionId: data.sessionId, playerId, picked: n });
// // // //       if (!res.correct) {
// // // //         showMsg(res.message || 'Not quite. Look again!');
// // // //         shakeOptions();
// // // //         setTimeout(() => setPicked(null), 500);
// // // //         setBusy(false);
// // // //         return;
// // // //       }
// // // //       if (typeof res.hints === 'number') setHints(res.hints);
// // // //       timers.current.push(setTimeout(() => setResult(res), 700));
// // // //     } catch (e: any) {
// // // //       showMsg(e.message || 'Network error');
// // // //       setPicked(null);
// // // //       setBusy(false);
// // // //     }
// // // //   };

// // // //   // 3. magnifier: backend removes one wrong number
// // // //   const useHint = async () => {
// // // //     if (busy || !data || result) return;
// // // //     setBusy(true);
// // // //     try {
// // // //       const res = await hintLevel3({ sessionId: data.sessionId, playerId });
// // // //       setHints(res.hints);
// // // //       setRemoved(res.removed || []);
// // // //       if (res.hint.text) showMsg(res.hint.text);
// // // //     } catch (e: any) {
// // // //       showMsg(e.message || 'Hint failed');
// // // //     }
// // // //     setBusy(false);
// // // //   };

// // // //   // 4. video: +75 hints
// // // //   const watchVideo = async () => {
// // // //     if (busy || result) return;
// // // //     setBusy(true);
// // // //     try {
// // // //       const res = await rewardLevel3(playerId);
// // // //       setHints(res.hints);
// // // //       showMsg(`+${res.added} hints!`);
// // // //     } catch (e: any) {
// // // //       showMsg(e.message || 'Reward failed');
// // // //     }
// // // //     setBusy(false);
// // // //   };

// // // //   // 5. skip level
// // // //   const skip = async () => {
// // // //     if (busy || !data || result) return;
// // // //     setBusy(true);
// // // //     try {
// // // //       const res = await skipLevel3({ sessionId: data.sessionId, playerId });
// // // //       if (typeof res.hints === 'number') setHints(res.hints);
// // // //       setResult(res);
// // // //     } catch (e: any) {
// // // //       showMsg(e.message || 'Skip failed');
// // // //       setBusy(false);
// // // //     }
// // // //   };

// // // //   /* ---------- loading / error ---------- */

// // // //   if (loadErr || !data) {
// // // //     return (
// // // //       <View style={st.page}>
// // // //         <View style={[st.frame, { width: bw - 16 }]}>
// // // //           <View style={[st.board, { alignItems: 'center', justifyContent: 'center' }]}>
// // // //             {loadErr ? (
// // // //               <>
// // // //                 <Text style={st.errText}>{loadErr}</Text>
// // // //                 <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // //                 <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // //               </>
// // // //             ) : (
// // // //               <>
// // // //                 <ActivityIndicator color="#fff" size="large" />
// // // //                 <Text style={st.loading}>Loading level 3...</Text>
// // // //               </>
// // // //             )}
// // // //           </View>
// // // //         </View>
// // // //       </View>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <View style={st.page}>
// // // //       <View style={[st.frame, { width: bw - 16 }]}>
// // // //         <View style={st.board}>

// // // //           {/* header */}
// // // //           <View style={st.header}>
// // // //             <View style={st.headLeft}>
// // // //               <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon /></TouchableOpacity>
// // // //               <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon /></TouchableOpacity>
// // // //             </View>
// // // //             <View style={st.plaque}>
// // // //               <Text style={st.chev}>‹</Text>
// // // //               <Text style={st.plaqueT}>LEVEL 3</Text>
// // // //               <Text style={st.chev}>›</Text>
// // // //             </View>
// // // //             <View style={st.pillWrap}>
// // // //               <View style={st.pill}><Text style={st.pillT}>{hints}</Text></View>
// // // //               <View style={st.bulb}><BulbIcon size={28} /></View>
// // // //             </View>
// // // //           </View>

// // // //           {/* question */}
// // // //           <Text style={[st.question, msg ? { color: YELLOW } : null]}>
// // // //             {msg || data.question}
// // // //           </Text>

// // // //           {/* two pictures */}
// // // //           <View style={st.pictures}>
// // // //             <SpotScene side="a" width={pw} />
// // // //             <SpotScene side="b" width={pw} />
// // // //           </View>

// // // //           {/* answer options */}
// // // //           <Animated.View style={[st.optionsRow, { transform: [{ translateX: shake }] }]}>
// // // //             {data.options.map((n) => {
// // // //               const gone = removed.includes(n);
// // // //               const on = picked === n;
// // // //               return (
// // // //                 <TouchableOpacity
// // // //                   key={n}
// // // //                   activeOpacity={0.8}
// // // //                   disabled={gone || busy || !!result}
// // // //                   onPress={() => pick(n)}
// // // //                   style={{ opacity: gone ? 0.2 : 1 }}
// // // //                 >
// // // //                   <View style={[st.optRing, { width: ring, height: ring, borderRadius: ring / 2 }, on && { backgroundColor: LIME }]}>
// // // //                     <Text style={[st.optNum, { fontSize: ring * 0.6 }, on && { color: '#1b1b1b' }]}>{n}</Text>
// // // //                   </View>
// // // //                 </TouchableOpacity>
// // // //               );
// // // //             })}
// // // //           </Animated.View>

// // // //           <View style={{ flex: 1 }} />

// // // //           {/* hint / video / skip */}
// // // //           <View style={st.actions}>
// // // //             <View style={st.actCol}>
// // // //               <TouchableOpacity style={[st.act, { backgroundColor: LIME }]} onPress={useHint} activeOpacity={0.85}>
// // // //                 <MagnifierIcon size={38} />
// // // //               </TouchableOpacity>
// // // //               <View style={st.costRow}><BulbIcon size={16} /><Text style={st.costT}>{COST_HINT}</Text></View>
// // // //             </View>
// // // //             <View style={st.actCol}>
// // // //               <TouchableOpacity style={[st.act, { backgroundColor: CREAM }]} onPress={watchVideo} activeOpacity={0.85}>
// // // //                 <VideoIcon size={40} />
// // // //               </TouchableOpacity>
// // // //               <View style={st.costRow}><CoinIcon size={16} /><Text style={st.costT}>+{REWARD}</Text></View>
// // // //             </View>
// // // //             <View style={st.actCol}>
// // // //               <TouchableOpacity style={[st.act, { backgroundColor: '#ee4a55' }]} onPress={skip} activeOpacity={0.85}>
// // // //                 <SkipIcon size={40} />
// // // //               </TouchableOpacity>
// // // //               <View style={st.costRow}><BulbIcon size={16} /><Text style={st.costT}>{COST_SKIP}</Text></View>
// // // //             </View>
// // // //           </View>

// // // //           <ChalkTray />

// // // //           {/* result card */}
// // // //           {!!result && (
// // // //             <View style={st.overlay}>
// // // //               <Animated.View style={[st.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
// // // //                 <Text style={st.cardTitle}>Level complete!</Text>
// // // //                 <Text style={st.cardMsg}>{result.message}</Text>
// // // //                 <View style={st.stars}>{[1, 2, 3].map((n) => <StarIcon key={n} size={46} on={n <= (result.stars || 0)} />)}</View>
// // // //                 {!result.skipped && <Text style={st.cardScore}>Score {result.score}</Text>}
// // // //                 <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}>
// // // //                   <Text style={st.nextT}>NEXT</Text>
// // // //                 </TouchableOpacity>
// // // //               </Animated.View>
// // // //             </View>
// // // //           )}
// // // //         </View>
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // }

// // // // /* =========================================================
// // // //    STYLES
// // // // ========================================================= */

// // // // const st = StyleSheet.create({
// // // //   page: { flex: 1, backgroundColor: PAGE, alignItems: 'center' },
// // // //   frame: {
// // // //     flex: 1, marginVertical: 8, backgroundColor: FRAME, borderRadius: 22, padding: 9,
// // // //     shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
// // // //   },
// // // //   board: { flex: 1, backgroundColor: BOARD, borderRadius: 14, overflow: 'hidden', paddingTop: 14 },

// // // //   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
// // // //   headLeft: { flexDirection: 'row', gap: 8 },
// // // //   round: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffd83a', borderWidth: 2.5, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
// // // //   plaque: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#9a5a1c', borderWidth: 3, borderColor: '#c98a3e', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 5 },
// // // //   plaqueT: { fontFamily: FONT, fontSize: 21, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
// // // //   chev: { fontSize: 26, fontWeight: '900', color: YELLOW, marginTop: -3 },
// // // //   pillWrap: { minWidth: 110, height: 44, justifyContent: 'center' },
// // // //   pill: { height: 36, borderRadius: 18, backgroundColor: '#fff', justifyContent: 'center', paddingLeft: 18, paddingRight: 30 },
// // // //   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
// // // //   bulb: { position: 'absolute', right: -4, top: -2 },

// // // //   question: {
// // // //     fontFamily: FONT, fontSize: 21, lineHeight: 27, fontStyle: 'italic', fontWeight: '600',
// // // //     color: '#f1f6ef', textAlign: 'center', paddingHorizontal: 22, marginTop: 16, minHeight: 56,
// // // //   },
// // // //   pictures: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 8 },

// // // //   optionsRow: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 8, marginTop: 18 },
// // // //   optRing: { borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.65)', alignItems: 'center', justifyContent: 'center' },
// // // //   optNum: { fontFamily: FONT, fontWeight: '900', color: '#f7f1df' },

// // // //   actions: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-start', paddingHorizontal: 8, marginBottom: 6 },
// // // //   actCol: { alignItems: 'center' },
// // // //   act: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
// // // //   costRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
// // // //   costT: { fontFamily: FONT, fontSize: 16, fontWeight: '700', color: '#fff' },

// // // //   overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
// // // //   card: { width: '82%', alignItems: 'center', backgroundColor: '#175a3d', borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.8)', borderRadius: 22, padding: 20 },
// // // //   cardTitle: { fontFamily: FONT, fontSize: 30, fontWeight: '800', color: '#fff' },
// // // //   cardMsg: { fontFamily: FONT, fontSize: 18, color: '#d8f3e3', textAlign: 'center', marginTop: 6 },
// // // //   stars: { flexDirection: 'row', gap: 6, marginTop: 14 },
// // // //   cardScore: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: YELLOW, marginTop: 10 },
// // // //   next: { marginTop: 18, minWidth: 170, height: 58, borderRadius: 29, backgroundColor: LIME, borderWidth: 3, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
// // // //   nextT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#1b1b1b' },

// // // //   loading: { fontFamily: FONT, fontSize: 18, color: '#fff', marginTop: 12 },
// // // //   errText: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// // // //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
// // // //   retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
// // // //   back: { fontFamily: FONT, fontSize: 16, color: '#d8f3e3', marginTop: 14, textDecorationLine: 'underline' },
// // // // });
// // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // import {
// // //   View, Text, TouchableOpacity, Animated, PanResponder, StyleSheet, Platform,
// // //   ActivityIndicator, useWindowDimensions,
// // // } from 'react-native';
// // // import {
// // //   startLevel3, answerLevel3, hintLevel3, skipLevel3, rewardLevel3,
// // //   Level3Start, Level3Answer, Sym,
// // // } from './Btlevel3api';
// // // import { SpotScene, MagnifierIcon, VideoIcon, SkipIcon, CoinIcon } from './Btlevel3art';
// // // import { HomeIcon, GearIcon, BulbIcon, StarIcon, ChalkTray } from './Btlevel2art';

// // // const FONT: any = Platform.select({ ios: 'Chalkboard SE', android: 'sans-serif-condensed', default: 'sans-serif' });
// // // const BOARD = '#1d6a49', FRAME = '#e08a2e', PAGE = '#f4e4c6', LIME = '#a6e22e', CREAM = '#f7f1df', YELLOW = '#ffd33d';
// // // const COST_HINT = 25, COST_SKIP = 50, REWARD = 75;

// // // const LABEL: Record<Sym, string> = { '+': '+', '-': '−' };
// // // type Slots = (Sym | null)[];

// // // type Props = {
// // //   playerId: number;
// // //   onHints?: (h: number) => void;   // keeps the shared hint count (congrats screen) in sync
// // //   onExit: () => void;
// // //   onComplete?: (result: Level3Answer) => void;
// // // };

// // // /* ---------------------------------------------------------
// // //    one draggable symbol (+ or −)
// // // --------------------------------------------------------- */

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
// // //     onPanResponderGrant: () => setDrag(true),
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
// // //       <Text style={[st.sym, { fontSize: size * 0.95, lineHeight: size * 1.05 }, drag && { color: LIME }]}>{LABEL[ch]}</Text>
// // //     </Animated.View>
// // //   );
// // // }

// // // const measure = (ref: React.RefObject<any>) =>
// // //   new Promise<{ x: number; y: number; w: number; h: number } | null>((resolve) => {
// // //     const node: any = ref.current;
// // //     if (!node || !node.measureInWindow) return resolve(null);
// // //     node.measureInWindow((x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }));
// // //   });

// // // /* ---------------------------------------------------------
// // //    SCREEN
// // // --------------------------------------------------------- */

// // // export default function BTLevel3Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // //   const { width } = useWindowDimensions();
// // //   const bw = Math.min(width, 480);
// // //   const pw = Math.min(150, Math.floor((bw - 16 - 18 - 36) / 2));
// // //   const u = Math.max(40, Math.min(60, Math.floor((bw - 34 - 16) / 6.6)));   // size of one number / symbol
// // //   const gap = Math.round(u * 0.8);                                          // width of a drop gap

// // //   const [data, setData] = useState<Level3Start | null>(null);
// // //   const [loadErr, setLoadErr] = useState('');
// // //   const [hints, setHints] = useState(0);
// // //   const [slots, setSlots] = useState<Slots>([null, null]);
// // //   const [fixed, setFixed] = useState<Slots>([null, null]);   // slots filled by hints (cannot be removed)
// // //   const [msg, setMsg] = useState('');
// // //   const [busy, setBusy] = useState(false);
// // //   const [result, setResult] = useState<Level3Answer | null>(null);

// // //   const slotsRef = useRef<Slots>([null, null]);
// // //   const fixedRef = useRef<Slots>([null, null]);
// // //   slotsRef.current = slots;
// // //   fixedRef.current = fixed;

// // //   const slotRef0 = useRef<View>(null);
// // //   const slotRef1 = useRef<View>(null);
// // //   const slotRefs = [slotRef0, slotRef1];

// // //   const shake = useRef(new Animated.Value(0)).current;
// // //   const pop = useRef(new Animated.Value(0)).current;
// // //   const msgTimer = useRef<any>(null);
// // //   const timers = useRef<any[]>([]);

// // //   const readRevealed = (list: { slot: number; symbol: Sym }[] | undefined): Slots => {
// // //     const f: Slots = [null, null];
// // //     (list || []).forEach((r) => { if (r.slot === 0 || r.slot === 1) f[r.slot] = r.symbol; });
// // //     return f;
// // //   };

// // //   // 1. open the level (backend creates or resumes the session)
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

// // //   // tell the parent the current hint count (only after the level has loaded)
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

// // //   // 2. both symbols are placed -> ask the backend
// // //   const submit = async (arr: Slots) => {
// // //     if (!data) return;
// // //     setBusy(true);
// // //     try {
// // //       const res = await answerLevel3({ sessionId: data.sessionId, playerId, symbols: arr as Sym[] });
// // //       if (!res.correct) {
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
// // //       timers.current.push(setTimeout(() => setResult(res), 700));   // busy stays true
// // //     } catch (e: any) {
// // //       showMsg(e.message || 'Network error');
// // //       setSlots(fixedRef.current);
// // //       setBusy(false);
// // //     }
// // //   };

// // //   // a symbol was released: which gap is it over?
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

// // //     if (best < 0 || bestD > u * 1.1) return false;
// // //     if (fixedRef.current[best]) return false;

// // //     const next: Slots = [...slotsRef.current];
// // //     next[best] = ch;
// // //     setSlots(next);
// // //     slotsRef.current = next;

// // //     if (next.every(Boolean)) submit(next);
// // //     return true;
// // //   };

// // //   // tap a placed symbol -> it goes back to its home spot
// // //   const removeSlot = (i: number) => {
// // //     if (busy || result || fixedRef.current[i]) return;
// // //     setSlots((s) => { const n = [...s]; n[i] = null; return n; });
// // //   };

// // //   // 3. magnifier: backend places one correct symbol
// // //   const useHint = async () => {
// // //     if (busy || !data || result) return;
// // //     setBusy(true);
// // //     let full: Slots | null = null;
// // //     try {
// // //       const res = await hintLevel3({ sessionId: data.sessionId, playerId });
// // //       setHints(res.hints);
// // //       setFixed(readRevealed(res.revealed));

// // //       if (res.hint.place) {
// // //         const { slot, symbol } = res.hint.place;
// // //         const next: Slots = [...slotsRef.current];
// // //         next.forEach((s, i) => { if (s === symbol && i !== slot) next[i] = null; });
// // //         next[slot] = symbol;
// // //         setSlots(next);
// // //         slotsRef.current = next;
// // //         if (next.every(Boolean)) full = next;
// // //       } else if (res.hint.text) {
// // //         showMsg(res.hint.text);
// // //       }
// // //     } catch (e: any) {
// // //       showMsg(e.message || 'Hint failed');
// // //     }
// // //     setBusy(false);
// // //     if (full) submit(full);
// // //   };

// // //   // 4. video: +75 hints
// // //   const watchVideo = async () => {
// // //     if (busy || result) return;
// // //     setBusy(true);
// // //     try {
// // //       const res = await rewardLevel3(playerId);
// // //       setHints(res.hints);
// // //       showMsg(`+${res.added} hints!`);
// // //     } catch (e: any) {
// // //       showMsg(e.message || 'Reward failed');
// // //     }
// // //     setBusy(false);
// // //   };

// // //   // 5. skip level
// // //   const skip = async () => {
// // //     if (busy || !data || result) return;
// // //     setBusy(true);
// // //     try {
// // //       const res = await skipLevel3({ sessionId: data.sessionId, playerId });
// // //       if (typeof res.hints === 'number') setHints(res.hints);
// // //       setResult(res);
// // //     } catch (e: any) {
// // //       showMsg(e.message || 'Skip failed');
// // //       setBusy(false);
// // //     }
// // //   };

// // //   /* ---------- loading / error ---------- */

// // //   if (loadErr || !data) {
// // //     return (
// // //       <View style={st.page}>
// // //         <View style={[st.frame, { width: bw - 16 }]}>
// // //           <View style={[st.board, { alignItems: 'center', justifyContent: 'center' }]}>
// // //             {loadErr ? (
// // //               <>
// // //                 <Text style={st.errText}>{loadErr}</Text>
// // //                 <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // //                 <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <ActivityIndicator color="#fff" size="large" />
// // //                 <Text style={st.loading}>Loading level 3...</Text>
// // //               </>
// // //             )}
// // //           </View>
// // //         </View>
// // //       </View>
// // //     );
// // //   }

// // //   const [n1, n2, n3] = data.numbers;
// // //   const numStyle = [st.num, { fontSize: u * 0.95, lineHeight: u * 1.05 }];

// // //   // symbol home spot: shows the draggable symbol, or an empty ring once it is placed
// // //   const home = (ch: Sym) =>
// // //     slots.includes(ch)
// // //       ? <View style={[st.homeEmpty, { width: u, height: u, borderRadius: u / 2 }]} />
// // //       : <DragSymbol ch={ch} size={u} disabled={busy || !!result} onDrop={handleDrop} />;

// // //   const gapView = (i: number) => (
// // //     <View ref={slotRefs[i]} collapsable={false} style={{ width: gap, height: u, alignItems: 'center', justifyContent: 'center' }}>
// // //       {slots[i] ? (
// // //         <TouchableOpacity activeOpacity={0.8} disabled={!!fixed[i] || busy || !!result} onPress={() => removeSlot(i)}>
// // //           <Text style={[st.sym, { fontSize: u * 0.95, lineHeight: u * 1.05 }]}>{LABEL[slots[i] as Sym]}</Text>
// // //         </TouchableOpacity>
// // //       ) : (
// // //         <View style={[st.slotRing, { width: gap * 0.7, height: gap * 0.7, borderRadius: gap }]} />
// // //       )}
// // //     </View>
// // //   );

// // //   return (
// // //     <View style={st.page}>
// // //       <View style={[st.frame, { width: bw - 16 }]}>
// // //         <View style={st.board}>

// // //           {/* header */}
// // //           <View style={st.header}>
// // //             <View style={st.headLeft}>
// // //               <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon /></TouchableOpacity>
// // //               <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon /></TouchableOpacity>
// // //             </View>
// // //             <Text style={st.levelT}>LEVEL 3</Text>
// // //             <View style={st.pillWrap}>
// // //               <View style={st.pill}><Text style={st.pillT}>{hints}</Text></View>
// // //               <View style={st.bulb}><BulbIcon size={28} /></View>
// // //             </View>
// // //           </View>

// // //           {/* question */}
// // //           <Text style={[st.question, msg ? { color: YELLOW } : null]}>
// // //             {msg || data.question}
// // //           </Text>

// // //           {/* two pictures */}
// // //           <View style={st.pictures}>
// // //             <SpotScene side="a" width={pw} />
// // //             <SpotScene side="b" width={pw} />
// // //           </View>

// // //           {/*  +  1 _ 2 _ 3  −   : drag + and − into the gaps  */}
// // //           <Animated.View style={[st.mathRow, { transform: [{ translateX: shake }] }]}>
// // //             {home('+')}
// // //             <Text style={numStyle}>{n1}</Text>
// // //             {gapView(0)}
// // //             <Text style={numStyle}>{n2}</Text>
// // //             {gapView(1)}
// // //             <Text style={numStyle}>{n3}</Text>
// // //             {home('-')}
// // //           </Animated.View>

// // //           <View style={{ flex: 1 }} />

// // //           {/* hint / video / skip */}
// // //           <View style={st.actions}>
// // //             <View style={st.actCol}>
// // //               <TouchableOpacity style={[st.act, { backgroundColor: LIME }]} onPress={useHint} activeOpacity={0.85}>
// // //                 <MagnifierIcon size={38} />
// // //               </TouchableOpacity>
// // //               <View style={st.costRow}><BulbIcon size={16} /><Text style={st.costT}>{COST_HINT}</Text></View>
// // //             </View>
// // //             <View style={st.actCol}>
// // //               <TouchableOpacity style={[st.act, { backgroundColor: CREAM }]} onPress={watchVideo} activeOpacity={0.85}>
// // //                 <VideoIcon size={40} />
// // //               </TouchableOpacity>
// // //               <View style={st.costRow}><CoinIcon size={16} /><Text style={st.costT}>+{REWARD}</Text></View>
// // //             </View>
// // //             <View style={st.actCol}>
// // //               <TouchableOpacity style={[st.act, { backgroundColor: '#ee4a55' }]} onPress={skip} activeOpacity={0.85}>
// // //                 <SkipIcon size={40} />
// // //               </TouchableOpacity>
// // //               <View style={st.costRow}><BulbIcon size={16} /><Text style={st.costT}>{COST_SKIP}</Text></View>
// // //             </View>
// // //           </View>

// // //           <ChalkTray />

// // //           {/* result card */}
// // //           {!!result && (
// // //             <View style={st.overlay}>
// // //               <Animated.View style={[st.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
// // //                 <Text style={st.cardTitle}>Level complete!</Text>
// // //                 <Text style={st.cardMsg}>{result.message}</Text>
// // //                 <View style={st.stars}>{[1, 2, 3].map((k) => <StarIcon key={k} size={46} on={k <= (result.stars || 0)} />)}</View>
// // //                 {!result.skipped && <Text style={st.cardScore}>Score {result.score}</Text>}
// // //                 <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}>
// // //                   <Text style={st.nextT}>NEXT</Text>
// // //                 </TouchableOpacity>
// // //               </Animated.View>
// // //             </View>
// // //           )}
// // //         </View>
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // /* =========================================================
// // //    STYLES
// // // ========================================================= */

// // // const st = StyleSheet.create({
// // //   page: { flex: 1, backgroundColor: PAGE, alignItems: 'center' },
// // //   frame: {
// // //     flex: 1, marginVertical: 8, backgroundColor: FRAME, borderRadius: 22, padding: 9,
// // //     shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
// // //   },
// // //   board: { flex: 1, backgroundColor: BOARD, borderRadius: 14, overflow: 'hidden', paddingTop: 14 },

// // //   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
// // //   headLeft: { flexDirection: 'row', gap: 8, minWidth: 110 },
// // //   round: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffd83a', borderWidth: 2.5, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
// // //   levelT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: 1 },
// // //   pillWrap: { minWidth: 110, height: 44, justifyContent: 'center' },
// // //   pill: { height: 36, borderRadius: 18, backgroundColor: '#fff', justifyContent: 'center', paddingLeft: 18, paddingRight: 30 },
// // //   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
// // //   bulb: { position: 'absolute', right: -4, top: -2 },

// // //   question: {
// // //     fontFamily: FONT, fontSize: 21, lineHeight: 27, fontStyle: 'italic', fontWeight: '600',
// // //     color: '#f1f6ef', textAlign: 'center', paddingHorizontal: 22, marginTop: 16, minHeight: 56,
// // //   },
// // //   pictures: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 8 },

// // //   mathRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, zIndex: 10, elevation: 10 },
// // //   num: { fontFamily: FONT, fontWeight: '900', color: CREAM, textAlign: 'center', minWidth: 40 },
// // //   sym: { fontFamily: FONT, fontWeight: '900', color: YELLOW, textAlign: 'center', includeFontPadding: false },
// // //   homeEmpty: { borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.25)' },
// // //   slotRing: { borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.45)' },

// // //   actions: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-start', paddingHorizontal: 8, marginBottom: 6 },
// // //   actCol: { alignItems: 'center' },
// // //   act: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
// // //   costRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
// // //   costT: { fontFamily: FONT, fontSize: 16, fontWeight: '700', color: '#fff' },

// // //   overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
// // //   card: { width: '82%', alignItems: 'center', backgroundColor: '#175a3d', borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.8)', borderRadius: 22, padding: 20 },
// // //   cardTitle: { fontFamily: FONT, fontSize: 30, fontWeight: '800', color: '#fff' },
// // //   cardMsg: { fontFamily: FONT, fontSize: 18, color: '#d8f3e3', textAlign: 'center', marginTop: 6 },
// // //   stars: { flexDirection: 'row', gap: 6, marginTop: 14 },
// // //   cardScore: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: YELLOW, marginTop: 10 },
// // //   next: { marginTop: 18, minWidth: 170, height: 58, borderRadius: 29, backgroundColor: LIME, borderWidth: 3, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
// // //   nextT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#1b1b1b' },

// // //   loading: { fontFamily: FONT, fontSize: 18, color: '#fff', marginTop: 12 },
// // //   errText: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// // //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
// // //   retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
// // //   back: { fontFamily: FONT, fontSize: 16, color: '#d8f3e3', marginTop: 14, textDecorationLine: 'underline' },
// // // });
// // import React from 'react';
// // import {View,StyleSheet} from 'react-native';
// // import Svg,{Circle,Path,Rect,Ellipse,G,Polygon,Line} from 'react-native-svg';

// // const INK='#2f3b52';

// // /* =========================================================
// //    CLUE PICTURE: rain cloud  (viewBox 120 x 135)
// // ========================================================= */

// // const drop=(x:number,y:number,k:number)=>
// //   <Path key={k} transform={`translate(${x} ${y})`} d="M0 -10 C6 -2 8 4 0 9 C-8 4 -6 -2 0 -10 Z" fill="#3b8fd6" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>;

// // export function ClueArt({size=120}:{size?:number}){
// //   const shapes=(fill:string,extra:any={})=><G>
// //     <Circle cx={38} cy={62} r={22} fill={fill} {...extra}/>
// //     <Circle cx={66} cy={44} r={28} fill={fill} {...extra}/>
// //     <Circle cx={94} cy={62} r={20} fill={fill} {...extra}/>
// //     <Rect x={38} y={52} width={56} height={32} rx={14} fill={fill} {...extra}/>
// //   </G>;
// //   return <Svg width={size} height={size*135/120} viewBox="0 0 120 135">
// //     {shapes(INK,{stroke:INK,strokeWidth:7})}
// //     {shapes('#9dbbd6')}
// //     <Path d="M24 56 Q30 44 44 44" stroke="#fff" strokeOpacity={0.6} strokeWidth={4} fill="none" strokeLinecap="round"/>
// //     {drop(32,102,0)}{drop(54,116,1)}{drop(76,100,2)}{drop(98,114,3)}{drop(64,128,4)}
// //   </Svg>;
// // }

// // /* =========================================================
// //    ROOM BACKGROUND (Level 1 style)
// // ========================================================= */

// // export function RoomBackground(){
// //   return <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 450 800" preserveAspectRatio="xMidYMid slice">
// //     {/* wall */}
// //     <Rect x={0} y={0} width={450} height={800} fill="#b9d9f2"/>
// //     <Rect x={0} y={330} width={450} height={220} fill="#a8cdee"/>

// //     {/* window */}
// //     <Rect x={-10} y={60} width={105} height={250} fill="#cfe9fb" stroke="#e8a54b" strokeWidth={8}/>
// //     <Rect x={40} y={60} width={6} height={250} fill="#e8a54b"/>
// //     <Rect x={-10} y={185} width={105} height={6} fill="#e8a54b"/>
// //     <Ellipse cx={20} cy={110} rx={22} ry={12} fill="#fff"/>
// //     <Rect x={-10} y={304} width={140} height={14} fill="#e8a54b"/>
// //     <Ellipse cx={30} cy={270} rx={12} ry={36} fill="#6fbf4a"/>
// //     <Ellipse cx={62} cy={268} rx={10} ry={32} fill="#58ab3c"/>
// //     <Rect x={38} y={288} width={32} height={18} rx={5} fill="#f3e3c3"/>

// //     {/* picture frame */}
// //     <Rect x={342} y={85} width={72} height={80} fill="#a9d3ec" stroke="#8fc0de" strokeWidth={5}/>
// //     <Circle cx={378} cy={125} r={22} fill="#f6a53a"/>
// //     <Circle cx={378} cy={125} r={14} fill="#fbc15e"/>

// //     {/* bookshelf */}
// //     <Ellipse cx={398} cy={268} rx={8} ry={34} fill="#6fbf4a"/>
// //     <Ellipse cx={422} cy={272} rx={8} ry={30} fill="#58ab3c"/>
// //     <Rect x={368} y={300} width={90} height={300} fill="#e0a24f"/>
// //     <Rect x={368} y={392} width={90} height={8} fill="#c98736"/>
// //     <Rect x={368} y={486} width={90} height={8} fill="#c98736"/>
// //     <Rect x={378} y={318} width={12} height={74} fill="#3f9bd6"/>
// //     <Rect x={392} y={326} width={12} height={66} fill="#7a6fd0"/>
// //     <Rect x={406} y={320} width={12} height={72} fill="#f2c14e"/>
// //     <Rect x={380} y={415} width={14} height={71} fill="#3f9bd6"/>
// //     <Rect x={396} y={422} width={12} height={64} fill="#49b39a"/>

// //     {/* floor */}
// //     <Rect x={0} y={548} width={450} height={252} fill="#ecb872"/>
// //     <Rect x={0} y={548} width={450} height={10} fill="#d79a4e"/>

// //     {/* books + plant (left) */}
// //     <Rect x={0} y={505} width={100} height={14} fill="#3f9bd6"/>
// //     <Rect x={0} y={519} width={100} height={14} fill="#ee6fa6"/>
// //     <Rect x={0} y={533} width={100} height={15} fill="#3a8fd0"/>
// //     <Ellipse cx={18} cy={650} rx={28} ry={80} fill="#5cb04a"/>
// //   </Svg>;
// // }

// // /* =========================================================
// //    HEADER ICONS (used by Level 2 AND Level 3)
// // ========================================================= */

// // export function HomeIcon(){
// //   return <Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#1b1b1b" stroke="#1b1b1b" strokeWidth={1.5} strokeLinejoin="round"/></Svg>;
// // }

// // export function GearIcon(){
// //   return <Svg width={22} height={22} viewBox="0 0 24 24">
// //     <Circle cx={12} cy={12} r={8} stroke="#1b1b1b" strokeWidth={4} strokeDasharray="3 3.3" fill="none"/>
// //     <Circle cx={12} cy={12} r={5} fill="none" stroke="#1b1b1b" strokeWidth={2.6}/>
// //   </Svg>;
// // }

// // export function BulbIcon({size=24}:{size?:number}){
// //   return <Svg width={size} height={size} viewBox="0 0 24 24">
// //     <Circle cx={12} cy={10} r={6.5} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
// //     <Rect x={9.5} y={16.5} width={5} height={4} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
// //   </Svg>;
// // }

// // export function StarIcon({size=40,on=true}:{size?:number;on?:boolean}){
// //   const pts=Array.from({length:10},(_,i)=>{
// //     const r=i%2?9:21,a=(-90+i*36)*Math.PI/180;
// //     return `${(24+r*Math.cos(a)).toFixed(1)},${(25+r*Math.sin(a)).toFixed(1)}`;
// //   }).join(' ');
// //   return <Svg width={size} height={size} viewBox="0 0 48 48">
// //     <Polygon points={pts} fill={on?'#ffd33d':'none'} stroke={on?'#f5a800':'rgba(255,255,255,0.5)'} strokeWidth={3} strokeLinejoin="round"/>
// //   </Svg>;
// // }

// // /* =========================================================
// //    CHALK TRAY (Level 3 and other chalkboard levels use this)
// // ========================================================= */

// // export function ChalkTray(){
// //   return <View style={st.tray}>
// //     <View style={st.ledge}/>
// //     <View style={st.eraser}>
// //       <View style={st.eraserTop}/>
// //       <View style={st.eraserBottom}><View style={st.eraserLine}/><View style={st.eraserLine}/></View>
// //     </View>
// //     <View style={[st.chalk,{left:'33%',bottom:12,width:46}]}/>
// //     <View style={[st.chalk,{left:'50%',bottom:14,width:40,transform:[{rotate:'-12deg'}]}]}/>
// //   </View>;
// // }

// // /* =========================================================
// //    EXTRA ICONS (optional)
// // ========================================================= */

// // export function SearchIcon({size=34}:{size?:number}){
// //   return <Svg width={size} height={size} viewBox="0 0 40 40">
// //     <Circle cx={17} cy={17} r={10} fill="none" stroke="#1b1b1b" strokeWidth={4.5}/>
// //     <Line x1={25} y1={25} x2={35} y2={35} stroke="#1b1b1b" strokeWidth={5.5} strokeLinecap="round"/>
// //   </Svg>;
// // }

// // export function VideoIcon({size=34}:{size?:number}){
// //   return <Svg width={size} height={size} viewBox="0 0 40 40">
// //     <Rect x={5} y={7} width={30} height={26} rx={4} fill="#8a5cf0" stroke="#1b1b1b" strokeWidth={3}/>
// //     <Polygon points="16,14 16,26 27,20" fill="#fff"/>
// //   </Svg>;
// // }

// // export function SkipIcon({size=34}:{size?:number}){
// //   return <Svg width={size} height={size} viewBox="0 0 40 40">
// //     <Polygon points="11,7 11,33 32,20" fill="#1b1b1b" stroke="#1b1b1b" strokeWidth={3} strokeLinejoin="round"/>
// //   </Svg>;
// // }

// // const st=StyleSheet.create({
// //   tray:{height:44,width:'100%'},
// //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:20,backgroundColor:'#e08a2e',borderTopWidth:3,borderTopColor:'#f2a64a'},
// //   eraser:{position:'absolute',left:'8%',bottom:12,width:62,height:30},
// //   eraserTop:{height:14,backgroundColor:'#b0702a',borderTopLeftRadius:4,borderTopRightRadius:4},
// //   eraserBottom:{height:16,backgroundColor:'#222',borderBottomLeftRadius:3,borderBottomRightRadius:3,justifyContent:'space-evenly',paddingHorizontal:3},
// //   eraserLine:{height:2,backgroundColor:'#555'},
// //   chalk:{position:'absolute',height:8,borderRadius:4,backgroundColor:'#f6f3ea'},
// // });
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
// import { HomeIcon, GearIcon, BulbIcon, StarIcon, ChalkTray } from './Btlevel2art';

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
  View, Text, TouchableOpacity, Animated, PanResponder, StyleSheet, Platform,
  ActivityIndicator, useWindowDimensions,
} from 'react-native';
import {
  startLevel3, answerLevel3, hintLevel3, skipLevel3, rewardLevel3,
  Level3Start, Level3Answer, Sym,
} from './Btlevel3api';
import { SpotScene, MagnifierIcon, VideoIcon, SkipIcon, CoinIcon } from './Btlevel3art';
import { HomeIcon, GearIcon, BulbIcon, StarIcon } from './Btlevel2art';

const FONT: any = Platform.select({ ios: 'Chalkboard SE', android: 'sans-serif-condensed', default: 'sans-serif' });
const BOARD = '#1d6a49', FRAME = '#e08a2e', PAGE = '#f4e4c6', LIME = '#a6e22e', CREAM = '#f7f1df', YELLOW = '#ffd33d';
const COST_HINT = 25, COST_SKIP = 50, REWARD = 75;

const LABEL: Record<Sym, string> = { '+': '+', '-': '−' };
type Slots = (Sym | null)[];

type Props = {
  playerId: number;
  onHints?: (h: number) => void;
  onExit: () => void;
  onComplete?: (result: Level3Answer) => void;
};

/* ---------------------------------------------------------
   wooden chalk tray (local copy, Level 3 does not depend on Level 2 art)
--------------------------------------------------------- */

function ChalkTray() {
  return (
    <View style={st.tray}>
      <View style={st.ledge} />
      <View style={st.eraser}>
        <View style={st.eraserTop} />
        <View style={st.eraserBottom}><View style={st.eraserLine} /><View style={st.eraserLine} /></View>
      </View>
      <View style={[st.chalk, { left: '33%', bottom: 12, width: 46 }]} />
      <View style={[st.chalk, { left: '50%', bottom: 14, width: 40, transform: [{ rotate: '-12deg' }] }]} />
    </View>
  );
}

/* ---------------------------------------------------------
   one draggable symbol (+ or −)
--------------------------------------------------------- */

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
      <Text style={[st.sym, { fontSize: size * 0.95, lineHeight: size * 1.05 }, drag && { color: LIME }]}>{LABEL[ch]}</Text>
    </Animated.View>
  );
}

const measure = (ref: React.RefObject<any>) =>
  new Promise<{ x: number; y: number; w: number; h: number } | null>((resolve) => {
    const node: any = ref.current;
    if (!node || !node.measureInWindow) return resolve(null);
    node.measureInWindow((x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }));
  });

/* ---------------------------------------------------------
   SCREEN
--------------------------------------------------------- */

export default function BTLevel3Screen({ playerId, onHints, onExit, onComplete }: Props) {
  const { width } = useWindowDimensions();
  const bw = Math.min(width, 480);
  const pw = Math.min(150, Math.floor((bw - 16 - 18 - 36) / 2));
  const u = Math.max(40, Math.min(60, Math.floor((bw - 34 - 16) / 6.6)));
  const gap = Math.round(u * 0.8);

  const [data, setData] = useState<Level3Start | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [hints, setHints] = useState(0);
  const [slots, setSlots] = useState<Slots>([null, null]);
  const [fixed, setFixed] = useState<Slots>([null, null]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Level3Answer | null>(null);

  const slotsRef = useRef<Slots>([null, null]);
  const fixedRef = useRef<Slots>([null, null]);
  slotsRef.current = slots;
  fixedRef.current = fixed;

  const slotRef0 = useRef<View>(null);
  const slotRef1 = useRef<View>(null);
  const slotRefs = [slotRef0, slotRef1];

  const shake = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0)).current;
  const msgTimer = useRef<any>(null);
  const timers = useRef<any[]>([]);

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

    if (best < 0 || bestD > u * 1.1) return false;
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

  const useHint = async () => {
    if (busy || !data || result) return;
    setBusy(true);
    let full: Slots | null = null;
    try {
      const res = await hintLevel3({ sessionId: data.sessionId, playerId });
      setHints(res.hints);
      setFixed(readRevealed(res.revealed));

      if (res.hint.place) {
        const { slot, symbol } = res.hint.place;
        const next: Slots = [...slotsRef.current];
        next.forEach((s, i) => { if (s === symbol && i !== slot) next[i] = null; });
        next[slot] = symbol;
        setSlots(next);
        slotsRef.current = next;
        if (next.every(Boolean)) full = next;
      } else if (res.hint.text) {
        showMsg(res.hint.text);
      }
    } catch (e: any) {
      showMsg(e.message || 'Hint failed');
    }
    setBusy(false);
    if (full) submit(full);
  };

  const watchVideo = async () => {
    if (busy || result) return;
    setBusy(true);
    try {
      const res = await rewardLevel3(playerId);
      setHints(res.hints);
      showMsg(`+${res.added} hints!`);
    } catch (e: any) {
      showMsg(e.message || 'Reward failed');
    }
    setBusy(false);
  };

  const skip = async () => {
    if (busy || !data || result) return;
    setBusy(true);
    try {
      const res = await skipLevel3({ sessionId: data.sessionId, playerId });
      if (typeof res.hints === 'number') setHints(res.hints);
      setResult(res);
    } catch (e: any) {
      showMsg(e.message || 'Skip failed');
      setBusy(false);
    }
  };

  /* ---------- loading / error ---------- */

  if (loadErr || !data) {
    return (
      <View style={st.page}>
        <View style={[st.frame, { width: bw - 16 }]}>
          <View style={[st.board, { alignItems: 'center', justifyContent: 'center' }]}>
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
        </View>
      </View>
    );
  }

  const [n1, n2, n3] = data.numbers;
  const numStyle = [st.num, { fontSize: u * 0.95, lineHeight: u * 1.05 }];

  const home = (ch: Sym) =>
    slots.includes(ch)
      ? <View style={[st.homeEmpty, { width: u, height: u, borderRadius: u / 2 }]} />
      : <DragSymbol ch={ch} size={u} disabled={busy || !!result} onDrop={handleDrop} />;

  const gapView = (i: number) => (
    <View ref={slotRefs[i]} collapsable={false} style={{ width: gap, height: u, alignItems: 'center', justifyContent: 'center' }}>
      {slots[i] ? (
        <TouchableOpacity activeOpacity={0.8} disabled={!!fixed[i] || busy || !!result} onPress={() => removeSlot(i)}>
          <Text style={[st.sym, { fontSize: u * 0.95, lineHeight: u * 1.05 }]}>{LABEL[slots[i] as Sym]}</Text>
        </TouchableOpacity>
      ) : (
        <View style={[st.slotRing, { width: gap * 0.7, height: gap * 0.7, borderRadius: gap }]} />
      )}
    </View>
  );

  return (
    <View style={st.page}>
      <View style={[st.frame, { width: bw - 16 }]}>
        <View style={st.board}>

          <View style={st.header}>
            <View style={st.headLeft}>
              <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon /></TouchableOpacity>
              <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon /></TouchableOpacity>
            </View>
            <Text style={st.levelT}>LEVEL 3</Text>
            <View style={st.pillWrap}>
              <View style={st.pill}><Text style={st.pillT}>{hints}</Text></View>
              <View style={st.bulb}><BulbIcon size={28} /></View>
            </View>
          </View>

          <Text style={[st.question, msg ? { color: YELLOW } : null]}>
            {msg || data.question}
          </Text>

          <View style={st.pictures}>
            <SpotScene side="a" width={pw} />
            <SpotScene side="b" width={pw} />
          </View>

          <Animated.View style={[st.mathRow, { transform: [{ translateX: shake }] }]}>
            {home('+')}
            <Text style={numStyle}>{n1}</Text>
            {gapView(0)}
            <Text style={numStyle}>{n2}</Text>
            {gapView(1)}
            <Text style={numStyle}>{n3}</Text>
            {home('-')}
          </Animated.View>

          <View style={{ flex: 1 }} />

          <View style={st.actions}>
            <View style={st.actCol}>
              <TouchableOpacity style={[st.act, { backgroundColor: LIME }]} onPress={useHint} activeOpacity={0.85}>
                <MagnifierIcon size={38} />
              </TouchableOpacity>
              <View style={st.costRow}><BulbIcon size={16} /><Text style={st.costT}>{COST_HINT}</Text></View>
            </View>
            <View style={st.actCol}>
              <TouchableOpacity style={[st.act, { backgroundColor: CREAM }]} onPress={watchVideo} activeOpacity={0.85}>
                <VideoIcon size={40} />
              </TouchableOpacity>
              <View style={st.costRow}><CoinIcon size={16} /><Text style={st.costT}>+{REWARD}</Text></View>
            </View>
            <View style={st.actCol}>
              <TouchableOpacity style={[st.act, { backgroundColor: '#ee4a55' }]} onPress={skip} activeOpacity={0.85}>
                <SkipIcon size={40} />
              </TouchableOpacity>
              <View style={st.costRow}><BulbIcon size={16} /><Text style={st.costT}>{COST_SKIP}</Text></View>
            </View>
          </View>

          <ChalkTray />

          {!!result && (
            <View style={st.overlay}>
              <Animated.View style={[st.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
                <Text style={st.cardTitle}>Level complete!</Text>
                <Text style={st.cardMsg}>{result.message}</Text>
                <View style={st.stars}>{[1, 2, 3].map((k) => <StarIcon key={k} size={46} on={k <= (result.stars || 0)} />)}</View>
                {!result.skipped && <Text style={st.cardScore}>Score {result.score}</Text>}
                <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={() => (onComplete ? onComplete(result) : onExit())}>
                  <Text style={st.nextT}>NEXT</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const st = StyleSheet.create({
  page: { flex: 1, backgroundColor: PAGE, alignItems: 'center' },
  frame: {
    flex: 1, marginVertical: 8, backgroundColor: FRAME, borderRadius: 22, padding: 9,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
  },
  board: { flex: 1, backgroundColor: BOARD, borderRadius: 14, overflow: 'hidden', paddingTop: 14 },

  tray: { height: 44, width: '100%' },
  ledge: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 20, backgroundColor: '#e08a2e', borderTopWidth: 3, borderTopColor: '#f2a64a' },
  eraser: { position: 'absolute', left: '8%', bottom: 12, width: 62, height: 30 },
  eraserTop: { height: 14, backgroundColor: '#b0702a', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  eraserBottom: { height: 16, backgroundColor: '#222', borderBottomLeftRadius: 3, borderBottomRightRadius: 3, justifyContent: 'space-evenly', paddingHorizontal: 3 },
  eraserLine: { height: 2, backgroundColor: '#555' },
  chalk: { position: 'absolute', height: 8, borderRadius: 4, backgroundColor: '#f6f3ea' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  headLeft: { flexDirection: 'row', gap: 8, minWidth: 110 },
  round: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffd83a', borderWidth: 2.5, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
  levelT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  pillWrap: { minWidth: 110, height: 44, justifyContent: 'center' },
  pill: { height: 36, borderRadius: 18, backgroundColor: '#fff', justifyContent: 'center', paddingLeft: 18, paddingRight: 30 },
  pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
  bulb: { position: 'absolute', right: -4, top: -2 },

  question: {
    fontFamily: FONT, fontSize: 21, lineHeight: 27, fontStyle: 'italic', fontWeight: '600',
    color: '#f1f6ef', textAlign: 'center', paddingHorizontal: 22, marginTop: 16, minHeight: 56,
  },
  pictures: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 8 },

  mathRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, zIndex: 10, elevation: 10 },
  num: { fontFamily: FONT, fontWeight: '900', color: CREAM, textAlign: 'center', minWidth: 40 },
  sym: { fontFamily: FONT, fontWeight: '900', color: YELLOW, textAlign: 'center', includeFontPadding: false },
  homeEmpty: { borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.25)' },
  slotRing: { borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.45)' },

  actions: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-start', paddingHorizontal: 8, marginBottom: 6 },
  actCol: { alignItems: 'center' },
  act: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
  costRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  costT: { fontFamily: FONT, fontSize: 16, fontWeight: '700', color: '#fff' },

  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  card: { width: '82%', alignItems: 'center', backgroundColor: '#175a3d', borderWidth: 3, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.8)', borderRadius: 22, padding: 20 },
  cardTitle: { fontFamily: FONT, fontSize: 30, fontWeight: '800', color: '#fff' },
  cardMsg: { fontFamily: FONT, fontSize: 18, color: '#d8f3e3', textAlign: 'center', marginTop: 6 },
  stars: { flexDirection: 'row', gap: 6, marginTop: 14 },
  cardScore: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: YELLOW, marginTop: 10 },
  next: { marginTop: 18, minWidth: 170, height: 58, borderRadius: 29, backgroundColor: LIME, borderWidth: 3, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
  nextT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#1b1b1b' },

  loading: { fontFamily: FONT, fontSize: 18, color: '#fff', marginTop: 12 },
  errText: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
  retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
  retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
  back: { fontFamily: FONT, fontSize: 16, color: '#d8f3e3', marginTop: 14, textDecorationLine: 'underline' },
});