
// // // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // // import {
// // // // //   ActivityIndicator,
// // // // //   Animated,
// // // // //   Easing,
// // // // //   PanResponder,
// // // // //   Platform,
// // // // //   StyleSheet,
// // // // //   Text,
// // // // //   TouchableOpacity,
// // // // //   View,
// // // // //   useWindowDimensions,
// // // // // } from 'react-native';
// // // // // import { Stage } from './BTShared';
// // // // // import { Backdrop, Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
// // // // // import {
// // // // //   Level4Answer,
// // // // //   hintLevel4,
// // // // //   jumpLevel4,
// // // // //   rewardLevel4,
// // // // //   skipLevel4,
// // // // //   startLevel4,
// // // // // } from './Btlevel4api';

// // // // // const FONT: any = Platform.select({ ios: 'Chalkboard SE', android: 'sans-serif-condensed', default: 'sans-serif' });

// // // // // type Props = {
// // // // //   playerId: number;
// // // // //   onHints?: (hints: number) => void;
// // // // //   onExit: () => void;
// // // // //   onComplete: (result: any) => void;
// // // // // };

// // // // // type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// // // // // // the cylinder starts as a short column of water (like level 9)
// // // // // const START_LEVEL = 22;

// // // // // export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // // // //   const { width, height } = useWindowDimensions();

// // // // //   // ---------- scene geometry ----------
// // // // //   const W = Math.min(width - 56, 340);
// // // // //   const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 340));

// // // // //   const pw = Math.round(W * 0.6);
// // // // //   const ph = Math.round(H * 0.42); // height of the tallest water column
// // // // //   const ry = poolRy(pw);
// // // // //   const poolLeft = Math.round((W - pw) / 2);
// // // // //   const poolTop = H - 8 - ph;
// // // // //   const floorY = poolTop + ph - ry; // centre of the cylinder base

// // // // //   const bw = Math.round(W * 0.46);
// // // // //   const bh = Math.round(bw * 0.3);
// // // // //   const boardLeft = W - bw;
// // // // //   const boardTop = Math.round(H * 0.28);

// // // // //   const gw = Math.round(W * 0.14);
// // // // //   const gh = Math.round(gw * (88 / 48));
// // // // //   const f = 0.22; // where on the board she stands (0 = tip, 1 = fixed end)
// // // // //   const feetY = boardTop + (bh * (19 - 16 * f)) / 30;
// // // // //   const girlLeft = Math.round(boardLeft + f * bw - gw / 2);
// // // // //   const girlTop = Math.round(feetY - gh);
// // // // //   const startCx = girlLeft + gw / 2;
// // // // //   const startCy = girlTop + gh / 2;

// // // // //   // y of the water surface (centre of the top ellipse) for a level
// // // // //   const surfaceOf = (lvl: number) => floorY - ((ph - 2 * ry) * lvl) / 100;

// // // // //   // ---------- state ----------
// // // // //   const [phase, setPhase] = useState<Phase>('loading');
// // // // //   const [sessionId, setSessionId] = useState<number | null>(null);
// // // // //   const [question, setQuestion] = useState('She must do a dive jump successfully.');
// // // // //   const [hints, setHints] = useState(0);
// // // // //   const [hintLine, setHintLine] = useState<number | null>(null);
// // // // //   const [level, setLevel] = useState(START_LEVEL);
// // // // //   const [pose, setPose] = useState<GirlPose>('stand');
// // // // //   const [msg, setMsg] = useState('');
// // // // //   const [error, setError] = useState('');
// // // // //   const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
// // // // //   const [result, setResult] = useState<Level4Answer | null>(null);
// // // // //   const [confirmSkip, setConfirmSkip] = useState(false);

// // // // //   const gx = useRef(new Animated.Value(0)).current;
// // // // //   const gy = useRef(new Animated.Value(0)).current;
// // // // //   const grot = useRef(new Animated.Value(0)).current;
// // // // //   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

// // // // //   // refs so the gesture handler always sees the latest values
// // // // //   const levelRef = useRef(level);
// // // // //   levelRef.current = level;
// // // // //   const phaseRef = useRef<Phase>(phase);
// // // // //   phaseRef.current = phase;
// // // // //   const phRef = useRef(ph);
// // // // //   phRef.current = ph;
// // // // //   const startLevelRef = useRef(START_LEVEL);

// // // // //   const applyHints = useCallback(
// // // // //     (h?: number) => {
// // // // //       if (typeof h === 'number') {
// // // // //         setHints(h);
// // // // //         onHints?.(h);
// // // // //       }
// // // // //     },
// // // // //     [onHints],
// // // // //   );

// // // // //   // ---------- open level: frontend -> backend -> DB session ----------
// // // // //   const open = useCallback(async () => {
// // // // //     setPhase('loading');
// // // // //     setError('');
// // // // //     try {
// // // // //       const r = await startLevel4(playerId);
// // // // //       setSessionId(r.sessionId);
// // // // //       if (r.question) setQuestion(r.question);
// // // // //       setHintLine(r.hintLevel ?? null);
// // // // //       applyHints(r.hints);
// // // // //       setPhase('idle');
// // // // //     } catch (e: any) {
// // // // //       setError(e?.message || 'Could not open the level.');
// // // // //       setPhase('error');
// // // // //     }
// // // // //   }, [playerId, applyHints]);

// // // // //   useEffect(() => {
// // // // //     open();
// // // // //   }, [open]);

// // // // //   useEffect(() => () => {
// // // // //     if (resetTimer.current) clearTimeout(resetTimer.current);
// // // // //   }, []);

// // // // //   // ---------- hand gesture: drag on the water to raise / lower it ----------
// // // // //   const pan = useRef(
// // // // //     PanResponder.create({
// // // // //       onStartShouldSetPanResponder: () => phaseRef.current === 'idle',
// // // // //       onMoveShouldSetPanResponder: () => phaseRef.current === 'idle',
// // // // //       onPanResponderTerminationRequest: () => false,
// // // // //       onPanResponderGrant: () => {
// // // // //         startLevelRef.current = levelRef.current;
// // // // //         setMsg('');
// // // // //         setConfirmSkip(false);
// // // // //       },
// // // // //       onPanResponderMove: (_e, g) => {
// // // // //         if (phaseRef.current !== 'idle') return;
// // // // //         const next = startLevelRef.current - (g.dy / (phRef.current * 0.8)) * 100;
// // // // //         setLevel(Math.max(0, Math.min(100, next)));
// // // // //       },
// // // // //     }),
// // // // //   ).current;

// // // // //   // ---------- dive (head first, like a real diver) + swim ----------
// // // // //   const dive = (outcome: string, lvl: number) =>
// // // // //     new Promise<void>((resolve) => {
// // // // //       const surface = surfaceOf(lvl);
// // // // //       const floorCy = floorY - gh / 2;
// // // // //       const won = outcome === 'splash';
// // // // //       const entryCy = Math.min(surface - gh / 2 + 4, floorCy); // hands touch the water
// // // // //       const finalCy = won ? Math.min(surface + gh * 0.3, floorCy) : floorCy;
// // // // //       const dx = W / 2 - startCx;
// // // // //       const dyEntry = entryCy - startCy;
// // // // //       const dyFinal = finalCy - startCy;

// // // // //       setPose('dive');

// // // // //       Animated.parallel([
// // // // //         // forward travel
// // // // //         Animated.timing(gx, { toValue: dx, duration: 760, easing: Easing.linear, useNativeDriver: false }),
// // // // //         // up, then down to the water, then deeper
// // // // //         Animated.sequence([
// // // // //           Animated.timing(gy, { toValue: -34, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// // // // //           Animated.timing(gy, { toValue: dyEntry, duration: 380, easing: Easing.in(Easing.quad), useNativeDriver: false }),
// // // // //           Animated.timing(gy, { toValue: dyFinal, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// // // // //         ]),
// // // // //         // rotates forward, head first (counter-clockwise), ends pointing straight down
// // // // //         Animated.timing(grot, { toValue: 1, duration: 760, delay: 80, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
// // // // //       ]).start(() => {
// // // // //         if (!won) {
// // // // //           setTimeout(resolve, 600);
// // // // //           return;
// // // // //         }

// // // // //         // she swims right, turns, swims left, then comes back to the middle
// // // // //         const midY = (surface + floorY) / 2;
// // // // //         const dyMid = midY - startCy;
// // // // //         const amp = Math.max(20, pw / 2 - gh / 2 - 10);
// // // // //         Animated.sequence([
// // // // //           Animated.parallel([
// // // // //             Animated.timing(grot, { toValue: 2, duration: 350, useNativeDriver: false }),
// // // // //             Animated.timing(gy, { toValue: dyMid, duration: 350, useNativeDriver: false }),
// // // // //             Animated.timing(gx, { toValue: dx + amp, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // // // //           ]),
// // // // //           Animated.parallel([
// // // // //             Animated.timing(grot, { toValue: 3, duration: 400, useNativeDriver: false }),
// // // // //             Animated.timing(gx, { toValue: dx - amp, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // // // //           ]),
// // // // //           Animated.timing(gx, { toValue: dx, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // // // //         ]).start(() => resolve());
// // // // //       });

// // // // //       // splash at the moment she enters the water
// // // // //       setTimeout(() => {
// // // // //         setSplash({ left: W / 2 - 28, top: surface - 30 });
// // // // //         setTimeout(() => setSplash(null), 650);
// // // // //       }, 690);
// // // // //     });

// // // // //   const resetScene = useCallback(() => {
// // // // //     gx.setValue(0);
// // // // //     gy.setValue(0);
// // // // //     grot.setValue(0);
// // // // //     setSplash(null);
// // // // //     setPose('stand');
// // // // //     setPhase('idle');
// // // // //   }, [gx, gy, grot]);

// // // // //   // ---------- JUMP: frontend -> backend -> MySQL -> JSON -> animate ----------
// // // // //   const onJump = async () => {
// // // // //     if (phase !== 'idle' || !sessionId) return;
// // // // //     setMsg('');
// // // // //     setConfirmSkip(false);
// // // // //     setPhase('sending');
// // // // //     const lvl = Math.round(level);
// // // // //     try {
// // // // //       const r = await jumpLevel4({ sessionId, playerId, waterLevel: lvl });
// // // // //       setPhase('jumping');
// // // // //       await dive(r.outcome || 'hit_bottom', lvl);
// // // // //       applyHints(r.hints);
// // // // //       if (r.correct) {
// // // // //         setResult(r);
// // // // //         setPhase('won');
// // // // //       } else {
// // // // //         setMsg('');
// // // // //         setPhase('failed');
// // // // //         resetTimer.current = setTimeout(resetScene, 1600);
// // // // //       }
// // // // //     } catch (e: any) {
// // // // //       setMsg(e?.message || 'Could not reach the server.');
// // // // //       setPhase('idle');
// // // // //     }
// // // // //   };

// // // // //   // ---------- magnifier: show the water line (25 hints) ----------
// // // // //   const onHint = async () => {
// // // // //     if (phase !== 'idle' || !sessionId) return;
// // // // //     setConfirmSkip(false);
// // // // //     try {
// // // // //       const r = await hintLevel4({ sessionId, playerId });
// // // // //       setHintLine(r.hint?.level ?? null);
// // // // //       setMsg(r.hint?.text || 'Raise the water up to the line.');
// // // // //       applyHints(r.hints);
// // // // //     } catch (e: any) {
// // // // //       setMsg(e?.message || 'Could not get the hint.');
// // // // //     }
// // // // //   };

// // // // //   // ---------- video reward (+75 hints) ----------
// // // // //   const onReward = async () => {
// // // // //     if (phase !== 'idle') return;
// // // // //     setConfirmSkip(false);
// // // // //     try {
// // // // //       const r = await rewardLevel4(playerId);
// // // // //       setMsg(`+${r.added} hints`);
// // // // //       applyHints(r.hints);
// // // // //     } catch (e: any) {
// // // // //       setMsg(e?.message || 'Reward failed.');
// // // // //     }
// // // // //   };

// // // // //   // ---------- skip (50 hints, tap twice) ----------
// // // // //   const onSkip = async () => {
// // // // //     if (phase !== 'idle' || !sessionId) return;
// // // // //     if (!confirmSkip) {
// // // // //       setConfirmSkip(true);
// // // // //       setMsg('Skip costs 50 hints. Tap skip again to confirm.');
// // // // //       return;
// // // // //     }
// // // // //     try {
// // // // //       const r = await skipLevel4({ sessionId, playerId });
// // // // //       applyHints(r.hints);
// // // // //       onComplete(r);
// // // // //     } catch (e: any) {
// // // // //       setConfirmSkip(false);
// // // // //       setMsg(e?.message || 'Could not skip.');
// // // // //     }
// // // // //   };

// // // // //   const busy = phase !== 'idle';

// // // // //   // ---------- loading / error ----------
// // // // //   if (phase === 'loading' || phase === 'error') {
// // // // //     return (
// // // // //       <Stage bg="#f4e4c6">
// // // // //         <View style={st.frame}>
// // // // //           <View style={[st.board, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }]}>
// // // // //             <Text style={[st.level, { marginBottom: 16 }]}>LEVEL 4</Text>
// // // // //             {phase === 'loading' ? (
// // // // //               <ActivityIndicator size="large" color="#ffd33d" />
// // // // //             ) : (
// // // // //               <>
// // // // //                 <Text style={st.errText}>Could not open the level.</Text>
// // // // //                 <Text style={st.errDetail}>{error}</Text>
// // // // //                 <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={open}>
// // // // //                   <Text style={st.primaryT}>Retry</Text>
// // // // //                 </TouchableOpacity>
// // // // //                 <TouchableOpacity activeOpacity={0.85} onPress={onExit}>
// // // // //                   <Text style={st.link}>Back</Text>
// // // // //                 </TouchableOpacity>
// // // // //               </>
// // // // //             )}
// // // // //           </View>
// // // // //         </View>
// // // // //       </Stage>
// // // // //     );
// // // // //   }

// // // // //   const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'ns-resize' } : {};

// // // // //   // ---------- game ----------
// // // // //   return (
// // // // //     <Stage bg="#f4e4c6">
// // // // //       <View style={st.frame}>
// // // // //         <View style={st.board}>
// // // // //           {/* top bar */}
// // // // //           <View style={st.topBar}>
// // // // //             <TouchableOpacity
// // // // //               style={st.round}
// // // // //               activeOpacity={0.85}
// // // // //               onPress={onExit}
// // // // //               disabled={phase === 'jumping' || phase === 'sending'}
// // // // //             >
// // // // //               <Text style={st.roundT}>⚙</Text>
// // // // //             </TouchableOpacity>
// // // // //             <Text style={st.level}>LEVEL 4</Text>
// // // // //             <View style={st.pill}>
// // // // //               <Text style={st.pillT}>{hints}</Text>
// // // // //               <Text style={st.pillIcon}>💡</Text>
// // // // //             </View>
// // // // //           </View>

// // // // //           <View style={st.center}>
// // // // //             <Text style={st.question}>{question}</Text>

// // // // //             {/* scene */}
// // // // //             <View style={[st.scene, { width: W, height: H }]}>
// // // // //               <View style={StyleSheet.absoluteFill}>
// // // // //                 <Backdrop w={W} h={H} />
// // // // //               </View>

// // // // //               <View style={{ position: 'absolute', left: boardLeft, top: boardTop }}>
// // // // //                 <Board w={bw} h={bh} />
// // // // //               </View>

// // // // //               <View style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// // // // //                 <Pool w={pw} h={ph} level={level} hintLevel={hintLine} />
// // // // //               </View>

// // // // //               <Animated.View
// // // // //                 style={{
// // // // //                   position: 'absolute',
// // // // //                   left: girlLeft,
// // // // //                   top: girlTop,
// // // // //                   width: gw,
// // // // //                   height: gh,
// // // // //                   transform: [
// // // // //                     { translateX: gx },
// // // // //                     { translateY: gy },
// // // // //                     {
// // // // //                       rotate: grot.interpolate({
// // // // //                         inputRange: [0, 1, 2, 3],
// // // // //                         outputRange: ['0deg', '-180deg', '-270deg', '-90deg'],
// // // // //                       }),
// // // // //                     },
// // // // //                   ],
// // // // //                 }}
// // // // //               >
// // // // //                 <Girl w={gw} pose={pose} />
// // // // //               </Animated.View>

// // // // //               {/* water in front of her, so she looks like she is under the water */}
// // // // //               <View pointerEvents="none" style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// // // // //                 <PoolWater w={pw} h={ph} level={level} />
// // // // //               </View>

// // // // //               {splash && (
// // // // //                 <View pointerEvents="none" style={{ position: 'absolute', left: splash.left, top: splash.top }}>
// // // // //                   <Splash w={56} />
// // // // //                 </View>
// // // // //               )}

// // // // //               {/* gesture area over the water column */}
// // // // //               <View
// // // // //                 {...pan.panHandlers}
// // // // //                 style={[
// // // // //                   {
// // // // //                     position: 'absolute',
// // // // //                     left: poolLeft - 24,
// // // // //                     top: poolTop - 40,
// // // // //                     width: pw + 48,
// // // // //                     height: ph + 56,
// // // // //                   },
// // // // //                   webTouch,
// // // // //                 ]}
// // // // //               />
// // // // //             </View>

// // // // //             <TouchableOpacity
// // // // //               style={[st.primary, busy && st.off]}
// // // // //               disabled={busy}
// // // // //               activeOpacity={0.85}
// // // // //               onPress={onJump}
// // // // //             >
// // // // //               {phase === 'sending' ? <ActivityIndicator color="#1b1b1b" /> : <Text style={st.primaryT}>JUMP</Text>}
// // // // //             </TouchableOpacity>

// // // // //             <Text style={st.msg}>{msg || ' '}</Text>
// // // // //           </View>

// // // // //           {/* bottom bar */}
// // // // //           <View style={st.bottomBar}>
// // // // //             <TouchableOpacity style={[st.round, busy && st.off]} activeOpacity={0.85} onPress={onHint} disabled={busy}>
// // // // //               <Text style={st.roundT}>🔍</Text>
// // // // //               <Text style={st.cost}>25</Text>
// // // // //             </TouchableOpacity>
// // // // //             <View style={{ flexDirection: 'row', gap: 12 }}>
// // // // //               <TouchableOpacity style={[st.round, busy && st.off]} activeOpacity={0.85} onPress={onReward} disabled={busy}>
// // // // //                 <Text style={st.roundT}>🎬</Text>
// // // // //                 <Text style={st.cost}>+75</Text>
// // // // //               </TouchableOpacity>
// // // // //               <TouchableOpacity
// // // // //                 style={[st.round, st.roundRed, busy && st.off]}
// // // // //                 activeOpacity={0.85}
// // // // //                 onPress={onSkip}
// // // // //                 disabled={busy}
// // // // //               >
// // // // //                 <Text style={st.roundT}>⏭</Text>
// // // // //                 <Text style={st.cost}>50</Text>
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* win card */}
// // // // //         {phase === 'won' && result && (
// // // // //           <View style={st.overlay}>
// // // // //             <View style={st.card}>
// // // // //               <Text style={st.cardTitle}>Perfect dive!</Text>
// // // // //               <Text style={st.cardText}>She swam across the pool.</Text>
// // // // //               <Text style={st.stars}>
// // // // //                 {'★'.repeat(result.stars || 0)}
// // // // //                 {'☆'.repeat(3 - (result.stars || 0))}
// // // // //               </Text>
// // // // //               <Text style={st.cardText}>Score: {result.score ?? 0}</Text>
// // // // //               {result.progressSaved === false && <Text style={st.cardText}>Progress could not be saved.</Text>}
// // // // //               <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={() => onComplete(result)}>
// // // // //                 <Text style={st.primaryT}>Next level</Text>
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </View>
// // // // //         )}
// // // // //       </View>
// // // // //     </Stage>
// // // // //   );
// // // // // }

// // // // // const st = StyleSheet.create({
// // // // //   frame: { flex: 1, margin: 8, backgroundColor: '#e08a2e', borderRadius: 22, padding: 9 },
// // // // //   board: { flex: 1, backgroundColor: '#1d6a49', borderRadius: 14, paddingTop: 10 },
// // // // //   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
// // // // //   level: { fontFamily: FONT, fontSize: 22, fontWeight: '800', color: '#ffd33d', letterSpacing: 1 },
// // // // //   pill: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 4,
// // // // //     height: 34,
// // // // //     paddingHorizontal: 12,
// // // // //     borderRadius: 17,
// // // // //     backgroundColor: '#fff',
// // // // //     borderWidth: 2,
// // // // //     borderColor: '#1b1b1b',
// // // // //   },
// // // // //   pillT: { fontFamily: FONT, fontSize: 16, fontWeight: '900', color: '#1b1b1b' },
// // // // //   pillIcon: { fontSize: 16 },
// // // // //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
// // // // //   question: { fontFamily: FONT, fontSize: 17, color: '#fff', textAlign: 'center', marginBottom: 10 },
// // // // //   scene: { backgroundColor: '#e9f1f3', borderRadius: 6, overflow: 'hidden' },
// // // // //   primary: {
// // // // //     marginTop: 14,
// // // // //     minWidth: 160,
// // // // //     height: 54,
// // // // //     borderRadius: 27,
// // // // //     backgroundColor: '#a6e22e',
// // // // //     borderWidth: 3,
// // // // //     borderColor: '#1b1b1b',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   primaryT: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: '#1b1b1b' },
// // // // //   off: { opacity: 0.5 },
// // // // //   msg: { fontFamily: FONT, fontSize: 15, color: '#d8f3e3', marginTop: 10, textAlign: 'center', minHeight: 20 },
// // // // //   bottomBar: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 18,
// // // // //     paddingVertical: 10,
// // // // //   },
// // // // //   round: {
// // // // //     width: 46,
// // // // //     height: 46,
// // // // //     borderRadius: 23,
// // // // //     backgroundColor: '#a6e22e',
// // // // //     borderWidth: 2.5,
// // // // //     borderColor: '#1b1b1b',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   roundRed: { backgroundColor: '#ff6b6b' },
// // // // //   roundT: { fontSize: 20, color: '#1b1b1b' },
// // // // //   cost: {
// // // // //     position: 'absolute',
// // // // //     right: -6,
// // // // //     bottom: -6,
// // // // //     fontFamily: FONT,
// // // // //     fontSize: 11,
// // // // //     fontWeight: '900',
// // // // //     color: '#1b1b1b',
// // // // //     backgroundColor: '#ffd33d',
// // // // //     borderRadius: 8,
// // // // //     paddingHorizontal: 4,
// // // // //     overflow: 'hidden',
// // // // //   },
// // // // //   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
// // // // //   errDetail: { fontFamily: FONT, fontSize: 14, color: '#d8f3e3', textAlign: 'center', marginTop: 6 },
// // // // //   link: { fontFamily: FONT, fontSize: 16, color: '#d8f3e3', marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },
// // // // //   overlay: {
// // // // //     ...StyleSheet.absoluteFillObject,
// // // // //     backgroundColor: 'rgba(0,0,0,0.55)',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     padding: 24,
// // // // //     borderRadius: 22,
// // // // //   },
// // // // //   card: {
// // // // //     width: '100%',
// // // // //     maxWidth: 340,
// // // // //     backgroundColor: '#1d6a49',
// // // // //     borderColor: '#e08a2e',
// // // // //     borderWidth: 8,
// // // // //     borderRadius: 24,
// // // // //     padding: 22,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center' },
// // // // //   stars: { fontSize: 36, color: '#ffd33d', marginTop: 8 },
// // // // //   cardText: { fontFamily: FONT, fontSize: 17, color: '#d8f3e3', marginTop: 6, textAlign: 'center' },
// // // // // });
// // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // import {
// // // //   ActivityIndicator,
// // // //   Animated,
// // // //   Easing,
// // // //   PanResponder,
// // // //   Platform,
// // // //   StyleSheet,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   View,
// // // //   useWindowDimensions,
// // // // } from 'react-native';
// // // // import { Stage } from './BTShared';
// // // // import { Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
// // // // import { RoomBackground, THEME } from './Btlevel4Theme';
// // // // import {
// // // //   Level4Answer,
// // // //   hintLevel4,
// // // //   jumpLevel4,
// // // //   rewardLevel4,
// // // //   skipLevel4,
// // // //   startLevel4,
// // // // } from './Btlevel4api';

// // // // const FONT: any = Platform.select({ ios: 'Chalkboard SE', android: 'sans-serif-condensed', default: 'sans-serif' });

// // // // type Props = {
// // // //   playerId: number;
// // // //   onHints?: (hints: number) => void;
// // // //   onExit: () => void;
// // // //   onComplete: (result: any) => void;
// // // // };

// // // // type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// // // // // the cylinder starts as a short column of water (like level 9)
// // // // const START_LEVEL = 22;

// // // // export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // // //   const { width, height } = useWindowDimensions();

// // // //   // ---------- scene geometry ----------
// // // //   const W = Math.min(width - 56, 340);
// // // //   const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 400));

// // // //   const pw = Math.round(W * 0.6);
// // // //   const ph = Math.round(H * 0.42); // height of the tallest water column
// // // //   const ry = poolRy(pw);
// // // //   const poolLeft = Math.round((W - pw) / 2);
// // // //   const poolTop = H - 8 - ph;
// // // //   const floorY = poolTop + ph - ry; // centre of the cylinder base

// // // //   const bw = Math.round(W * 0.46);
// // // //   const bh = Math.round(bw * 0.3);
// // // //   const boardLeft = W - bw;
// // // //   const boardTop = Math.round(H * 0.28);

// // // //   const gw = Math.round(W * 0.14);
// // // //   const gh = Math.round(gw * (88 / 48));
// // // //   const f = 0.22; // where on the board she stands (0 = tip, 1 = fixed end)
// // // //   const feetY = boardTop + (bh * (19 - 16 * f)) / 30;
// // // //   const girlLeft = Math.round(boardLeft + f * bw - gw / 2);
// // // //   const girlTop = Math.round(feetY - gh);
// // // //   const startCx = girlLeft + gw / 2;
// // // //   const startCy = girlTop + gh / 2;

// // // //   // y of the water surface (centre of the top ellipse) for a level
// // // //   const surfaceOf = (lvl: number) => floorY - ((ph - 2 * ry) * lvl) / 100;

// // // //   // ---------- state ----------
// // // //   const [phase, setPhase] = useState<Phase>('loading');
// // // //   const [sessionId, setSessionId] = useState<number | null>(null);
// // // //   const [question, setQuestion] = useState('She must do a dive jump successfully.');
// // // //   const [hints, setHints] = useState(0);
// // // //   const [hintLine, setHintLine] = useState<number | null>(null);
// // // //   const [level, setLevel] = useState(START_LEVEL);
// // // //   const [pose, setPose] = useState<GirlPose>('stand');
// // // //   const [msg, setMsg] = useState('');
// // // //   const [error, setError] = useState('');
// // // //   const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
// // // //   const [result, setResult] = useState<Level4Answer | null>(null);
// // // //   const [confirmSkip, setConfirmSkip] = useState(false);

// // // //   const gx = useRef(new Animated.Value(0)).current;
// // // //   const gy = useRef(new Animated.Value(0)).current;
// // // //   const grot = useRef(new Animated.Value(0)).current;
// // // //   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

// // // //   // refs so the gesture handler always sees the latest values
// // // //   const levelRef = useRef(level);
// // // //   levelRef.current = level;
// // // //   const phaseRef = useRef<Phase>(phase);
// // // //   phaseRef.current = phase;
// // // //   const phRef = useRef(ph);
// // // //   phRef.current = ph;
// // // //   const startLevelRef = useRef(START_LEVEL);

// // // //   const applyHints = useCallback(
// // // //     (h?: number) => {
// // // //       if (typeof h === 'number') {
// // // //         setHints(h);
// // // //         onHints?.(h);
// // // //       }
// // // //     },
// // // //     [onHints],
// // // //   );

// // // //   // ---------- open level: frontend -> backend -> DB session ----------
// // // //   const open = useCallback(async () => {
// // // //     setPhase('loading');
// // // //     setError('');
// // // //     try {
// // // //       const r = await startLevel4(playerId);
// // // //       setSessionId(r.sessionId);
// // // //       if (r.question) setQuestion(r.question);
// // // //       setHintLine(r.hintLevel ?? null);
// // // //       applyHints(r.hints);
// // // //       setPhase('idle');
// // // //     } catch (e: any) {
// // // //       setError(e?.message || 'Could not open the level.');
// // // //       setPhase('error');
// // // //     }
// // // //   }, [playerId, applyHints]);

// // // //   useEffect(() => {
// // // //     open();
// // // //   }, [open]);

// // // //   useEffect(() => () => {
// // // //     if (resetTimer.current) clearTimeout(resetTimer.current);
// // // //   }, []);

// // // //   // ---------- hand gesture: drag on the water to raise / lower it ----------
// // // //   const pan = useRef(
// // // //     PanResponder.create({
// // // //       onStartShouldSetPanResponder: () => phaseRef.current === 'idle',
// // // //       onMoveShouldSetPanResponder: () => phaseRef.current === 'idle',
// // // //       onPanResponderTerminationRequest: () => false,
// // // //       onPanResponderGrant: () => {
// // // //         startLevelRef.current = levelRef.current;
// // // //         setMsg('');
// // // //         setConfirmSkip(false);
// // // //       },
// // // //       onPanResponderMove: (_e, g) => {
// // // //         if (phaseRef.current !== 'idle') return;
// // // //         const next = startLevelRef.current - (g.dy / (phRef.current * 0.8)) * 100;
// // // //         setLevel(Math.max(0, Math.min(100, next)));
// // // //       },
// // // //     }),
// // // //   ).current;

// // // //   // ---------- dive (head first, like a real diver) + swim ----------
// // // //   const dive = (outcome: string, lvl: number) =>
// // // //     new Promise<void>((resolve) => {
// // // //       const surface = surfaceOf(lvl);
// // // //       const floorCy = floorY - gh / 2;
// // // //       const won = outcome === 'splash';
// // // //       const entryCy = Math.min(surface - gh / 2 + 4, floorCy); // hands touch the water
// // // //       const finalCy = won ? Math.min(surface + gh * 0.3, floorCy) : floorCy;
// // // //       const dx = W / 2 - startCx;
// // // //       const dyEntry = entryCy - startCy;
// // // //       const dyFinal = finalCy - startCy;

// // // //       setPose('dive');

// // // //       Animated.parallel([
// // // //         // forward travel
// // // //         Animated.timing(gx, { toValue: dx, duration: 760, easing: Easing.linear, useNativeDriver: false }),
// // // //         // up, then down to the water, then deeper
// // // //         Animated.sequence([
// // // //           Animated.timing(gy, { toValue: -34, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// // // //           Animated.timing(gy, { toValue: dyEntry, duration: 380, easing: Easing.in(Easing.quad), useNativeDriver: false }),
// // // //           Animated.timing(gy, { toValue: dyFinal, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// // // //         ]),
// // // //         // rotates forward, head first (counter-clockwise), ends pointing straight down
// // // //         Animated.timing(grot, { toValue: 1, duration: 760, delay: 80, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
// // // //       ]).start(() => {
// // // //         if (!won) {
// // // //           setTimeout(resolve, 600);
// // // //           return;
// // // //         }

// // // //         // she swims right, turns, swims left, then comes back to the middle
// // // //         const midY = (surface + floorY) / 2;
// // // //         const dyMid = midY - startCy;
// // // //         const amp = Math.max(20, pw / 2 - gh / 2 - 10);
// // // //         Animated.sequence([
// // // //           Animated.parallel([
// // // //             Animated.timing(grot, { toValue: 2, duration: 350, useNativeDriver: false }),
// // // //             Animated.timing(gy, { toValue: dyMid, duration: 350, useNativeDriver: false }),
// // // //             Animated.timing(gx, { toValue: dx + amp, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // // //           ]),
// // // //           Animated.parallel([
// // // //             Animated.timing(grot, { toValue: 3, duration: 400, useNativeDriver: false }),
// // // //             Animated.timing(gx, { toValue: dx - amp, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // // //           ]),
// // // //           Animated.timing(gx, { toValue: dx, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // // //         ]).start(() => resolve());
// // // //       });

// // // //       // splash at the moment she enters the water
// // // //       setTimeout(() => {
// // // //         setSplash({ left: W / 2 - 28, top: surface - 30 });
// // // //         setTimeout(() => setSplash(null), 650);
// // // //       }, 690);
// // // //     });

// // // //   const resetScene = useCallback(() => {
// // // //     gx.setValue(0);
// // // //     gy.setValue(0);
// // // //     grot.setValue(0);
// // // //     setSplash(null);
// // // //     setPose('stand');
// // // //     setPhase('idle');
// // // //   }, [gx, gy, grot]);

// // // //   // ---------- JUMP: frontend -> backend -> MySQL -> JSON -> animate ----------
// // // //   const onJump = async () => {
// // // //     if (phase !== 'idle' || !sessionId) return;
// // // //     setMsg('');
// // // //     setConfirmSkip(false);
// // // //     setPhase('sending');
// // // //     const lvl = Math.round(level);
// // // //     try {
// // // //       const r = await jumpLevel4({ sessionId, playerId, waterLevel: lvl });
// // // //       setPhase('jumping');
// // // //       await dive(r.outcome || 'hit_bottom', lvl);
// // // //       applyHints(r.hints);
// // // //       if (r.correct) {
// // // //         setResult(r);
// // // //         setPhase('won');
// // // //       } else {
// // // //         setMsg('');
// // // //         setPhase('failed');
// // // //         resetTimer.current = setTimeout(resetScene, 1600);
// // // //       }
// // // //     } catch (e: any) {
// // // //       setMsg(e?.message || 'Could not reach the server.');
// // // //       setPhase('idle');
// // // //     }
// // // //   };

// // // //   // ---------- magnifier: show the water line (25 hints) ----------
// // // //   const onHint = async () => {
// // // //     if (phase !== 'idle' || !sessionId) return;
// // // //     setConfirmSkip(false);
// // // //     try {
// // // //       const r = await hintLevel4({ sessionId, playerId });
// // // //       setHintLine(r.hint?.level ?? null);
// // // //       setMsg(r.hint?.text || 'Raise the water up to the line.');
// // // //       applyHints(r.hints);
// // // //     } catch (e: any) {
// // // //       setMsg(e?.message || 'Could not get the hint.');
// // // //     }
// // // //   };

// // // //   // ---------- video reward (+75 hints) ----------
// // // //   const onReward = async () => {
// // // //     if (phase !== 'idle') return;
// // // //     setConfirmSkip(false);
// // // //     try {
// // // //       const r = await rewardLevel4(playerId);
// // // //       setMsg(`+${r.added} hints`);
// // // //       applyHints(r.hints);
// // // //     } catch (e: any) {
// // // //       setMsg(e?.message || 'Reward failed.');
// // // //     }
// // // //   };

// // // //   // ---------- skip (50 hints, tap twice) ----------
// // // //   const onSkip = async () => {
// // // //     if (phase !== 'idle' || !sessionId) return;
// // // //     if (!confirmSkip) {
// // // //       setConfirmSkip(true);
// // // //       setMsg('Skip costs 50 hints. Tap skip again to confirm.');
// // // //       return;
// // // //     }
// // // //     try {
// // // //       const r = await skipLevel4({ sessionId, playerId });
// // // //       applyHints(r.hints);
// // // //       onComplete(r);
// // // //     } catch (e: any) {
// // // //       setConfirmSkip(false);
// // // //       setMsg(e?.message || 'Could not skip.');
// // // //     }
// // // //   };

// // // //   const busy = phase !== 'idle';

// // // //   // ---------- shared header (home, wooden sign, hints pill) ----------
// // // //   const header = (
// // // //     <View style={st.topBar}>
// // // //       <TouchableOpacity
// // // //         style={st.homeBtn}
// // // //         activeOpacity={0.85}
// // // //         onPress={onExit}
// // // //         disabled={phase === 'jumping' || phase === 'sending'}
// // // //       >
// // // //         <Text style={st.homeT}>🏠</Text>
// // // //       </TouchableOpacity>

// // // //       <View style={st.signWrap}>
// // // //         <View style={[st.string, { left: 22 }]} />
// // // //         <View style={[st.string, { right: 22 }]} />
// // // //         <View style={st.sign}>
// // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // //           <Text style={st.signT}>LEVEL 4</Text>
// // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // //         </View>
// // // //         <View style={[st.leaf, { left: -6, transform: [{ rotate: '-30deg' }] }]} />
// // // //         <View style={[st.leaf, { right: -6, transform: [{ rotate: '30deg' }] }]} />
// // // //       </View>

// // // //       <View style={st.pill}>
// // // //         <Text style={st.pillT}>{hints}</Text>
// // // //         <Text style={st.pillIcon}>💡</Text>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   // ---------- loading / error ----------
// // // //   if (phase === 'loading' || phase === 'error') {
// // // //     return (
// // // //       <Stage bg="#bddaee">
// // // //         <View style={st.root}>
// // // //           <RoomBackground />
// // // //           {header}
// // // //           <View style={st.centerMsg}>
// // // //             {phase === 'loading' ? (
// // // //               <ActivityIndicator size="large" color={THEME.orange} />
// // // //             ) : (
// // // //               <>
// // // //                 <Text style={st.errText}>Could not open the level.</Text>
// // // //                 <Text style={st.errDetail}>{error}</Text>
// // // //                 <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={open}>
// // // //                   <Text style={st.primaryT}>Retry</Text>
// // // //                 </TouchableOpacity>
// // // //                 <TouchableOpacity activeOpacity={0.85} onPress={onExit}>
// // // //                   <Text style={st.link}>Back</Text>
// // // //                 </TouchableOpacity>
// // // //               </>
// // // //             )}
// // // //           </View>
// // // //         </View>
// // // //       </Stage>
// // // //     );
// // // //   }

// // // //   const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'ns-resize' } : {};

// // // //   // ---------- game ----------
// // // //   return (
// // // //     <Stage bg="#bddaee">
// // // //       <View style={st.root}>
// // // //         <RoomBackground />

// // // //         {header}

// // // //         <View style={st.center}>
// // // //           {/* question pill (same style as level 1) */}
// // // //           <View style={st.qPill}>
// // // //             <Text style={st.qArrow}>{'<'}</Text>
// // // //             <Text style={st.question}>{question}</Text>
// // // //             <Text style={st.qArrow}>{'>'}</Text>
// // // //           </View>

// // // //           {/* scene (transparent: the room is behind it) */}
// // // //           <View style={[st.scene, { width: W, height: H }]}>
// // // //             <View style={{ position: 'absolute', left: boardLeft, top: boardTop }}>
// // // //               <Board w={bw} h={bh} />
// // // //             </View>

// // // //             <View style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// // // //               <Pool w={pw} h={ph} level={level} hintLevel={hintLine} />
// // // //             </View>

// // // //             <Animated.View
// // // //               style={{
// // // //                 position: 'absolute',
// // // //                 left: girlLeft,
// // // //                 top: girlTop,
// // // //                 width: gw,
// // // //                 height: gh,
// // // //                 transform: [
// // // //                   { translateX: gx },
// // // //                   { translateY: gy },
// // // //                   {
// // // //                     rotate: grot.interpolate({
// // // //                       inputRange: [0, 1, 2, 3],
// // // //                       outputRange: ['0deg', '-180deg', '-270deg', '-90deg'],
// // // //                     }),
// // // //                   },
// // // //                 ],
// // // //               }}
// // // //             >
// // // //               <Girl w={gw} pose={pose} />
// // // //             </Animated.View>

// // // //             {/* water in front of her, so she looks like she is under the water */}
// // // //             <View pointerEvents="none" style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// // // //               <PoolWater w={pw} h={ph} level={level} />
// // // //             </View>

// // // //             {splash && (
// // // //               <View pointerEvents="none" style={{ position: 'absolute', left: splash.left, top: splash.top }}>
// // // //                 <Splash w={56} />
// // // //               </View>
// // // //             )}

// // // //             {/* gesture area over the water column */}
// // // //             <View
// // // //               {...pan.panHandlers}
// // // //               style={[
// // // //                 {
// // // //                   position: 'absolute',
// // // //                   left: poolLeft - 24,
// // // //                   top: poolTop - 40,
// // // //                   width: pw + 48,
// // // //                   height: ph + 56,
// // // //                 },
// // // //                 webTouch,
// // // //               ]}
// // // //             />
// // // //           </View>

// // // //           <TouchableOpacity
// // // //             style={[st.primary, busy && st.off]}
// // // //             disabled={busy}
// // // //             activeOpacity={0.85}
// // // //             onPress={onJump}
// // // //           >
// // // //             {phase === 'sending' ? <ActivityIndicator color={THEME.navy} /> : <Text style={st.primaryT}>JUMP</Text>}
// // // //           </TouchableOpacity>

// // // //           <Text style={st.msg}>{msg || ' '}</Text>
// // // //         </View>

// // // //         {/* bottom rounded panel (same as level 1) */}
// // // //         <View style={st.panel}>
// // // //           <View style={st.btnCol}>
// // // //             <TouchableOpacity
// // // //               style={[st.ringGreen, busy && st.off]}
// // // //               activeOpacity={0.85}
// // // //               onPress={onHint}
// // // //               disabled={busy}
// // // //             >
// // // //               <View style={st.circleGreen}>
// // // //                 <Text style={st.btnIcon}>🔍</Text>
// // // //               </View>
// // // //             </TouchableOpacity>
// // // //             <View style={st.badge}>
// // // //               <Text style={st.badgeIcon}>💡</Text>
// // // //               <Text style={st.badgeT}>25</Text>
// // // //             </View>
// // // //           </View>

// // // //           <View style={st.btnCol}>
// // // //             <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onReward} disabled={busy}>
// // // //               <Text style={st.btnIcon}>🎬</Text>
// // // //             </TouchableOpacity>
// // // //             <View style={st.badge}>
// // // //               <Text style={st.badgeIcon}>🪙</Text>
// // // //               <Text style={st.badgeT}>+75</Text>
// // // //             </View>
// // // //           </View>

// // // //           <View style={st.btnCol}>
// // // //             <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onSkip} disabled={busy}>
// // // //               <View style={st.circleRed}>
// // // //                 <Text style={st.skipIcon}>▶</Text>
// // // //               </View>
// // // //             </TouchableOpacity>
// // // //             <View style={st.badge}>
// // // //               <Text style={st.badgeIcon}>💡</Text>
// // // //               <Text style={st.badgeT}>50</Text>
// // // //             </View>
// // // //           </View>
// // // //         </View>

// // // //         {/* win card */}
// // // //         {phase === 'won' && result && (
// // // //           <View style={st.overlay}>
// // // //             <View style={st.card}>
// // // //               <Text style={st.cardTitle}>Perfect dive!</Text>
// // // //               <Text style={st.cardText}>She swam across the pool.</Text>
// // // //               <Text style={st.stars}>
// // // //                 {'★'.repeat(result.stars || 0)}
// // // //                 {'☆'.repeat(3 - (result.stars || 0))}
// // // //               </Text>
// // // //               <Text style={st.cardText}>Score: {result.score ?? 0}</Text>
// // // //               {result.progressSaved === false && <Text style={st.cardText}>Progress could not be saved.</Text>}
// // // //               <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={() => onComplete(result)}>
// // // //                 <Text style={st.primaryT}>Next level</Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </View>
// // // //         )}
// // // //       </View>
// // // //     </Stage>
// // // //   );
// // // // }

// // // // const st = StyleSheet.create({
// // // //   root: { flex: 1, backgroundColor: '#bddaee', overflow: 'hidden' },

// // // //   // top
// // // //   topBar: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     paddingHorizontal: 12,
// // // //     paddingTop: 14,
// // // //   },
// // // //   homeBtn: {
// // // //     width: 40,
// // // //     height: 40,
// // // //     borderRadius: 20,
// // // //     backgroundColor: THEME.yellow,
// // // //     borderWidth: 2.5,
// // // //     borderColor: THEME.yellowBorder,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   homeT: { fontSize: 18 },
// // // //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 12 },
// // // //   string: { position: 'absolute', top: 0, width: 2, height: 14, backgroundColor: '#7a5a3a' },
// // // //   sign: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 8,
// // // //     paddingHorizontal: 18,
// // // //     height: 44,
// // // //     borderRadius: 8,
// // // //     backgroundColor: THEME.wood,
// // // //     borderWidth: 3,
// // // //     borderColor: THEME.woodDark,
// // // //   },
// // // //   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: THEME.cream, letterSpacing: 1 },
// // // //   signArrow: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#ffd35c' },
// // // //   leaf: {
// // // //     position: 'absolute',
// // // //     top: 4,
// // // //     width: 22,
// // // //     height: 12,
// // // //     borderRadius: 8,
// // // //     backgroundColor: '#6cbf4a',
// // // //   },
// // // //   pill: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 4,
// // // //     height: 34,
// // // //     minWidth: 64,
// // // //     justifyContent: 'center',
// // // //     paddingHorizontal: 12,
// // // //     borderRadius: 17,
// // // //     backgroundColor: '#fff',
// // // //   },
// // // //   pillT: { fontFamily: FONT, fontSize: 18, fontWeight: '900', color: '#1b1b1b' },
// // // //   pillIcon: { fontSize: 16 },

// // // //   // centre
// // // //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 128 },
// // // //   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
// // // //   qPill: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 10,
// // // //     backgroundColor: THEME.cream,
// // // //     borderRadius: 24,
// // // //     paddingVertical: 8,
// // // //     paddingHorizontal: 16,
// // // //     marginBottom: 10,
// // // //     maxWidth: 360,
// // // //   },
// // // //   qArrow: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: THEME.orange },
// // // //   question: { flexShrink: 1, fontFamily: FONT, fontSize: 16, fontStyle: 'italic', color: THEME.navy, textAlign: 'center' },
// // // //   scene: { backgroundColor: 'transparent' },

// // // //   primary: {
// // // //     marginTop: 12,
// // // //     minWidth: 160,
// // // //     height: 52,
// // // //     borderRadius: 26,
// // // //     backgroundColor: THEME.green,
// // // //     borderWidth: 3,
// // // //     borderColor: THEME.greenRing,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   primaryT: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: THEME.navy },
// // // //   off: { opacity: 0.5 },
// // // //   msg: { fontFamily: FONT, fontSize: 15, color: THEME.navy, marginTop: 8, textAlign: 'center', minHeight: 20 },

// // // //   // bottom panel
// // // //   panel: {
// // // //     position: 'absolute',
// // // //     left: 16,
// // // //     right: 16,
// // // //     bottom: 14,
// // // //     height: 112,
// // // //     borderRadius: 56,
// // // //     backgroundColor: THEME.panel,
// // // //     borderWidth: 8,
// // // //     borderColor: THEME.panelBorder,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'flex-start',
// // // //     justifyContent: 'space-around',
// // // //     paddingTop: 8,
// // // //   },
// // // //   btnCol: { alignItems: 'center' },
// // // //   ringGreen: {
// // // //     width: 62,
// // // //     height: 62,
// // // //     borderRadius: 31,
// // // //     backgroundColor: THEME.greenRing,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   circleGreen: {
// // // //     width: 52,
// // // //     height: 52,
// // // //     borderRadius: 26,
// // // //     backgroundColor: THEME.green,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   ringWhite: {
// // // //     width: 62,
// // // //     height: 62,
// // // //     borderRadius: 31,
// // // //     backgroundColor: '#fff',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   circleRed: {
// // // //     width: 50,
// // // //     height: 50,
// // // //     borderRadius: 25,
// // // //     backgroundColor: THEME.red,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   btnIcon: { fontSize: 26 },
// // // //   skipIcon: { fontSize: 22, color: '#1b1b1b' },
// // // //   badge: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 3,
// // // //     marginTop: 4,
// // // //     paddingHorizontal: 10,
// // // //     height: 22,
// // // //     borderRadius: 11,
// // // //     backgroundColor: THEME.badge,
// // // //   },
// // // //   badgeIcon: { fontSize: 11 },
// // // //   badgeT: { fontFamily: FONT, fontSize: 13, fontWeight: '900', color: '#fff' },

// // // //   // error
// // // //   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: THEME.navy, textAlign: 'center' },
// // // //   errDetail: { fontFamily: FONT, fontSize: 14, color: THEME.navy, textAlign: 'center', marginTop: 6 },
// // // //   link: { fontFamily: FONT, fontSize: 16, color: THEME.navy, marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },

// // // //   // win card
// // // //   overlay: {
// // // //     ...StyleSheet.absoluteFillObject,
// // // //     backgroundColor: 'rgba(0,0,0,0.45)',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     padding: 24,
// // // //   },
// // // //   card: {
// // // //     width: '100%',
// // // //     maxWidth: 340,
// // // //     backgroundColor: THEME.panel,
// // // //     borderColor: THEME.panelBorder,
// // // //     borderWidth: 8,
// // // //     borderRadius: 28,
// // // //     padding: 22,
// // // //     alignItems: 'center',
// // // //   },
// // // //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: THEME.navy, textAlign: 'center' },
// // // //   stars: { fontSize: 36, color: THEME.orange, marginTop: 8 },
// // // //   cardText: { fontFamily: FONT, fontSize: 17, color: THEME.navy, marginTop: 6, textAlign: 'center' },
// // // // });
// // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // import {
// // //   ActivityIndicator,
// // //   Animated,
// // //   Easing,
// // //   PanResponder,
// // //   Platform,
// // //   StyleSheet,
// // //   Text,
// // //   TouchableOpacity,
// // //   View,
// // //   useWindowDimensions,
// // // } from 'react-native';
// // // import { Stage } from './BTShared';
// // // import { Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
// // // import { RoomBackground, THEME } from './Btlevel4Theme';
// // // import {
// // //   Level4Answer,
// // //   hintLevel4,
// // //   jumpLevel4,
// // //   rewardLevel4,
// // //   skipLevel4,
// // //   startLevel4,
// // // } from './Btlevel4api';

// // // const FONT: any = Platform.select({ ios: 'Chalkboard SE', android: 'sans-serif-condensed', default: 'sans-serif' });

// // // type Props = {
// // //   playerId: number;
// // //   onHints?: (hints: number) => void;
// // //   onExit: () => void;
// // //   onComplete: (result: any) => void;
// // // };

// // // type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// // // // the cylinder starts as a short column of water (like level 9)
// // // const START_LEVEL = 22;

// // // // clue shown when the magnifier is tapped
// // // const CLUE = "Don't make her jump higher… make the water come closer!";

// // // export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // //   const { width, height } = useWindowDimensions();

// // //   // ---------- scene geometry ----------
// // //   const W = Math.min(width - 56, 340);
// // //   const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 400));

// // //   const pw = Math.round(W * 0.6);
// // //   const ph = Math.round(H * 0.42); // height of the tallest water column
// // //   const ry = poolRy(pw);
// // //   const poolLeft = Math.round((W - pw) / 2);
// // //   const poolTop = H - 8 - ph;
// // //   const floorY = poolTop + ph - ry; // centre of the cylinder base

// // //   const bw = Math.round(W * 0.46);
// // //   const bh = Math.round(bw * 0.3);
// // //   const boardLeft = W - bw;
// // //   const boardTop = Math.round(H * 0.28);

// // //   const gw = Math.round(W * 0.14);
// // //   const gh = Math.round(gw * (88 / 48));
// // //   const f = 0.22; // where on the board she stands (0 = tip, 1 = fixed end)
// // //   const feetY = boardTop + (bh * (19 - 16 * f)) / 30;
// // //   const girlLeft = Math.round(boardLeft + f * bw - gw / 2);
// // //   const girlTop = Math.round(feetY - gh);
// // //   const startCx = girlLeft + gw / 2;
// // //   const startCy = girlTop + gh / 2;

// // //   // y of the water surface (centre of the top ellipse) for a level
// // //   const surfaceOf = (lvl: number) => floorY - ((ph - 2 * ry) * lvl) / 100;

// // //   // ---------- state ----------
// // //   const [phase, setPhase] = useState<Phase>('loading');
// // //   const [sessionId, setSessionId] = useState<number | null>(null);
// // //   const [question, setQuestion] = useState('She must do a dive jump successfully.');
// // //   const [hints, setHints] = useState(0);
// // //   const [hintLine, setHintLine] = useState<number | null>(null);
// // //   const [level, setLevel] = useState(START_LEVEL);
// // //   const [pose, setPose] = useState<GirlPose>('stand');
// // //   const [msg, setMsg] = useState('');
// // //   const [error, setError] = useState('');
// // //   const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
// // //   const [result, setResult] = useState<Level4Answer | null>(null);
// // //   const [confirmSkip, setConfirmSkip] = useState(false);

// // //   const gx = useRef(new Animated.Value(0)).current;
// // //   const gy = useRef(new Animated.Value(0)).current;
// // //   const grot = useRef(new Animated.Value(0)).current;
// // //   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

// // //   // refs so the gesture handler always sees the latest values
// // //   const levelRef = useRef(level);
// // //   levelRef.current = level;
// // //   const phaseRef = useRef<Phase>(phase);
// // //   phaseRef.current = phase;
// // //   const phRef = useRef(ph);
// // //   phRef.current = ph;
// // //   const startLevelRef = useRef(START_LEVEL);

// // //   const applyHints = useCallback(
// // //     (h?: number) => {
// // //       if (typeof h === 'number') {
// // //         setHints(h);
// // //         onHints?.(h);
// // //       }
// // //     },
// // //     [onHints],
// // //   );

// // //   // ---------- open level: frontend -> backend -> DB session ----------
// // //   const open = useCallback(async () => {
// // //     setPhase('loading');
// // //     setError('');
// // //     try {
// // //       const r = await startLevel4(playerId);
// // //       setSessionId(r.sessionId);
// // //       if (r.question) setQuestion(r.question);
// // //       setHintLine(r.hintLevel ?? null);
// // //       applyHints(r.hints);
// // //       setPhase('idle');
// // //     } catch (e: any) {
// // //       setError(e?.message || 'Could not open the level.');
// // //       setPhase('error');
// // //     }
// // //   }, [playerId, applyHints]);

// // //   useEffect(() => {
// // //     open();
// // //   }, [open]);

// // //   useEffect(() => () => {
// // //     if (resetTimer.current) clearTimeout(resetTimer.current);
// // //   }, []);

// // //   // ---------- hand gesture: drag on the water to raise / lower it ----------
// // //   const pan = useRef(
// // //     PanResponder.create({
// // //       onStartShouldSetPanResponder: () => phaseRef.current === 'idle',
// // //       onMoveShouldSetPanResponder: () => phaseRef.current === 'idle',
// // //       onPanResponderTerminationRequest: () => false,
// // //       onPanResponderGrant: () => {
// // //         startLevelRef.current = levelRef.current;
// // //         setMsg('');
// // //         setConfirmSkip(false);
// // //       },
// // //       onPanResponderMove: (_e, g) => {
// // //         if (phaseRef.current !== 'idle') return;
// // //         const next = startLevelRef.current - (g.dy / (phRef.current * 0.8)) * 100;
// // //         setLevel(Math.max(0, Math.min(100, next)));
// // //       },
// // //     }),
// // //   ).current;

// // //   // ---------- dive (head first, like a real diver) + swim ----------
// // //   const dive = (outcome: string, lvl: number) =>
// // //     new Promise<void>((resolve) => {
// // //       const surface = surfaceOf(lvl);
// // //       const floorCy = floorY - gh / 2;
// // //       const won = outcome === 'splash';
// // //       const entryCy = Math.min(surface - gh / 2 + 4, floorCy); // hands touch the water
// // //       const finalCy = won ? Math.min(surface + gh * 0.3, floorCy) : floorCy;
// // //       const dx = W / 2 - startCx;
// // //       const dyEntry = entryCy - startCy;
// // //       const dyFinal = finalCy - startCy;

// // //       setPose('dive');

// // //       Animated.parallel([
// // //         // forward travel
// // //         Animated.timing(gx, { toValue: dx, duration: 760, easing: Easing.linear, useNativeDriver: false }),
// // //         // up, then down to the water, then deeper
// // //         Animated.sequence([
// // //           Animated.timing(gy, { toValue: -34, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// // //           Animated.timing(gy, { toValue: dyEntry, duration: 380, easing: Easing.in(Easing.quad), useNativeDriver: false }),
// // //           Animated.timing(gy, { toValue: dyFinal, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// // //         ]),
// // //         // rotates forward, head first (counter-clockwise), ends pointing straight down
// // //         Animated.timing(grot, { toValue: 1, duration: 760, delay: 80, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
// // //       ]).start(() => {
// // //         if (!won) {
// // //           setTimeout(resolve, 600);
// // //           return;
// // //         }

// // //         // she swims right, turns, swims left, then comes back to the middle
// // //         const midY = (surface + floorY) / 2;
// // //         const dyMid = midY - startCy;
// // //         const amp = Math.max(20, pw / 2 - gh / 2 - 10);
// // //         Animated.sequence([
// // //           Animated.parallel([
// // //             Animated.timing(grot, { toValue: 2, duration: 350, useNativeDriver: false }),
// // //             Animated.timing(gy, { toValue: dyMid, duration: 350, useNativeDriver: false }),
// // //             Animated.timing(gx, { toValue: dx + amp, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // //           ]),
// // //           Animated.parallel([
// // //             Animated.timing(grot, { toValue: 3, duration: 400, useNativeDriver: false }),
// // //             Animated.timing(gx, { toValue: dx - amp, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // //           ]),
// // //           Animated.timing(gx, { toValue: dx, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // //         ]).start(() => resolve());
// // //       });

// // //       // splash at the moment she enters the water
// // //       setTimeout(() => {
// // //         setSplash({ left: W / 2 - 28, top: surface - 30 });
// // //         setTimeout(() => setSplash(null), 650);
// // //       }, 690);
// // //     });

// // //   const resetScene = useCallback(() => {
// // //     gx.setValue(0);
// // //     gy.setValue(0);
// // //     grot.setValue(0);
// // //     setSplash(null);
// // //     setPose('stand');
// // //     setPhase('idle');
// // //   }, [gx, gy, grot]);

// // //   // ---------- JUMP: frontend -> backend -> MySQL -> JSON -> animate ----------
// // //   const onJump = async () => {
// // //     if (phase !== 'idle' || !sessionId) return;
// // //     setMsg('');
// // //     setConfirmSkip(false);
// // //     setPhase('sending');
// // //     const lvl = Math.round(level);
// // //     try {
// // //       const r = await jumpLevel4({ sessionId, playerId, waterLevel: lvl });
// // //       setPhase('jumping');
// // //       await dive(r.outcome || 'hit_bottom', lvl);
// // //       applyHints(r.hints);
// // //       if (r.correct) {
// // //         setResult(r);
// // //         setPhase('won');
// // //       } else {
// // //         setMsg('');
// // //         setPhase('failed');
// // //         resetTimer.current = setTimeout(resetScene, 1600);
// // //       }
// // //     } catch (e: any) {
// // //       setMsg(e?.message || 'Could not reach the server.');
// // //       setPhase('idle');
// // //     }
// // //   };

// // //   // ---------- magnifier: show the water line (25 hints) ----------
// // //   const onHint = async () => {
// // //     if (phase !== 'idle' || !sessionId) return;
// // //     setConfirmSkip(false);
// // //     try {
// // //       const r = await hintLevel4({ sessionId, playerId });
// // //       setHintLine(r.hint?.level ?? null);
// // //       setMsg(CLUE);
// // //       applyHints(r.hints);
// // //     } catch (e: any) {
// // //       setMsg(e?.message || 'Could not get the hint.');
// // //     }
// // //   };

// // //   // ---------- video reward (+75 hints) ----------
// // //   const onReward = async () => {
// // //     if (phase !== 'idle') return;
// // //     setConfirmSkip(false);
// // //     try {
// // //       const r = await rewardLevel4(playerId);
// // //       setMsg(`+${r.added} hints`);
// // //       applyHints(r.hints);
// // //     } catch (e: any) {
// // //       setMsg(e?.message || 'Reward failed.');
// // //     }
// // //   };

// // //   // ---------- skip (50 hints, tap twice) ----------
// // //   const onSkip = async () => {
// // //     if (phase !== 'idle' || !sessionId) return;
// // //     if (!confirmSkip) {
// // //       setConfirmSkip(true);
// // //       setMsg('Skip costs 50 hints. Tap skip again to confirm.');
// // //       return;
// // //     }
// // //     try {
// // //       const r = await skipLevel4({ sessionId, playerId });
// // //       applyHints(r.hints);
// // //       onComplete(r);
// // //     } catch (e: any) {
// // //       setConfirmSkip(false);
// // //       setMsg(e?.message || 'Could not skip.');
// // //     }
// // //   };

// // //   const busy = phase !== 'idle';

// // //   // ---------- shared header (home, wooden sign, hints pill) ----------
// // //   const header = (
// // //     <View style={st.topBar}>
// // //       <TouchableOpacity
// // //         style={st.homeBtn}
// // //         activeOpacity={0.85}
// // //         onPress={onExit}
// // //         disabled={phase === 'jumping' || phase === 'sending'}
// // //       >
// // //         <Text style={st.homeT}>🏠</Text>
// // //       </TouchableOpacity>

// // //       <View style={st.signWrap}>
// // //         <View style={[st.string, { left: 22 }]} />
// // //         <View style={[st.string, { right: 22 }]} />
// // //         <View style={st.sign}>
// // //           <Text style={st.signArrow}>{'<'}</Text>
// // //           <Text style={st.signT}>LEVEL 4</Text>
// // //           <Text style={st.signArrow}>{'>'}</Text>
// // //         </View>
// // //         <View style={[st.leaf, { left: -6, transform: [{ rotate: '-30deg' }] }]} />
// // //         <View style={[st.leaf, { right: -6, transform: [{ rotate: '30deg' }] }]} />
// // //       </View>

// // //       <View style={st.pill}>
// // //         <Text style={st.pillT}>{hints}</Text>
// // //         <Text style={st.pillIcon}>💡</Text>
// // //       </View>
// // //     </View>
// // //   );

// // //   // ---------- loading / error ----------
// // //   if (phase === 'loading' || phase === 'error') {
// // //     return (
// // //       <Stage bg="#bddaee">
// // //         <View style={st.root}>
// // //           <RoomBackground />
// // //           {header}
// // //           <View style={st.centerMsg}>
// // //             {phase === 'loading' ? (
// // //               <ActivityIndicator size="large" color={THEME.orange} />
// // //             ) : (
// // //               <>
// // //                 <Text style={st.errText}>Could not open the level.</Text>
// // //                 <Text style={st.errDetail}>{error}</Text>
// // //                 <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={open}>
// // //                   <Text style={st.primaryT}>Retry</Text>
// // //                 </TouchableOpacity>
// // //                 <TouchableOpacity activeOpacity={0.85} onPress={onExit}>
// // //                   <Text style={st.link}>Back</Text>
// // //                 </TouchableOpacity>
// // //               </>
// // //             )}
// // //           </View>
// // //         </View>
// // //       </Stage>
// // //     );
// // //   }

// // //   const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'ns-resize' } : {};

// // //   // ---------- game ----------
// // //   return (
// // //     <Stage bg="#bddaee">
// // //       <View style={st.root}>
// // //         <RoomBackground />

// // //         {header}

// // //         <View style={st.center}>
// // //           {/* question pill (same style as level 1) */}
// // //           <View style={st.qPill}>
// // //             <Text style={st.qArrow}>{'<'}</Text>
// // //             <Text style={st.question}>{question}</Text>
// // //             <Text style={st.qArrow}>{'>'}</Text>
// // //           </View>

// // //           {/* scene (transparent: the room is behind it) */}
// // //           <View style={[st.scene, { width: W, height: H }]}>
// // //             <View style={{ position: 'absolute', left: boardLeft, top: boardTop }}>
// // //               <Board w={bw} h={bh} />
// // //             </View>

// // //             <View style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// // //               <Pool w={pw} h={ph} level={level} hintLevel={hintLine} />
// // //             </View>

// // //             <Animated.View
// // //               style={{
// // //                 position: 'absolute',
// // //                 left: girlLeft,
// // //                 top: girlTop,
// // //                 width: gw,
// // //                 height: gh,
// // //                 transform: [
// // //                   { translateX: gx },
// // //                   { translateY: gy },
// // //                   {
// // //                     rotate: grot.interpolate({
// // //                       inputRange: [0, 1, 2, 3],
// // //                       outputRange: ['0deg', '-180deg', '-270deg', '-90deg'],
// // //                     }),
// // //                   },
// // //                 ],
// // //               }}
// // //             >
// // //               <Girl w={gw} pose={pose} />
// // //             </Animated.View>

// // //             {/* water in front of her, so she looks like she is under the water */}
// // //             <View pointerEvents="none" style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// // //               <PoolWater w={pw} h={ph} level={level} />
// // //             </View>

// // //             {splash && (
// // //               <View pointerEvents="none" style={{ position: 'absolute', left: splash.left, top: splash.top }}>
// // //                 <Splash w={56} />
// // //               </View>
// // //             )}

// // //             {/* gesture area over the water column */}
// // //             <View
// // //               {...pan.panHandlers}
// // //               style={[
// // //                 {
// // //                   position: 'absolute',
// // //                   left: poolLeft - 24,
// // //                   top: poolTop - 40,
// // //                   width: pw + 48,
// // //                   height: ph + 56,
// // //                 },
// // //                 webTouch,
// // //               ]}
// // //             />
// // //           </View>

// // //           <TouchableOpacity
// // //             style={[st.primary, busy && st.off]}
// // //             disabled={busy}
// // //             activeOpacity={0.85}
// // //             onPress={onJump}
// // //           >
// // //             {phase === 'sending' ? <ActivityIndicator color={THEME.navy} /> : <Text style={st.primaryT}>JUMP</Text>}
// // //           </TouchableOpacity>

// // //           <Text style={st.msg}>{msg || ' '}</Text>
// // //         </View>

// // //         {/* bottom rounded panel (same as level 1) */}
// // //         <View style={st.panel}>
// // //           <View style={st.btnCol}>
// // //             <TouchableOpacity
// // //               style={[st.ringGreen, busy && st.off]}
// // //               activeOpacity={0.85}
// // //               onPress={onHint}
// // //               disabled={busy}
// // //             >
// // //               <View style={st.circleGreen}>
// // //                 <Text style={st.btnIcon}>🔍</Text>
// // //               </View>
// // //             </TouchableOpacity>
// // //             <View style={st.badge}>
// // //               <Text style={st.badgeIcon}>💡</Text>
// // //               <Text style={st.badgeT}>25</Text>
// // //             </View>
// // //           </View>

// // //           <View style={st.btnCol}>
// // //             <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onReward} disabled={busy}>
// // //               <Text style={st.btnIcon}>🎬</Text>
// // //             </TouchableOpacity>
// // //             <View style={st.badge}>
// // //               <Text style={st.badgeIcon}>🪙</Text>
// // //               <Text style={st.badgeT}>+75</Text>
// // //             </View>
// // //           </View>

// // //           <View style={st.btnCol}>
// // //             <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onSkip} disabled={busy}>
// // //               <View style={st.circleRed}>
// // //                 <Text style={st.skipIcon}>▶</Text>
// // //               </View>
// // //             </TouchableOpacity>
// // //             <View style={st.badge}>
// // //               <Text style={st.badgeIcon}>💡</Text>
// // //               <Text style={st.badgeT}>50</Text>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* win card */}
// // //         {phase === 'won' && result && (
// // //           <View style={st.overlay}>
// // //             <View style={st.card}>
// // //               <Text style={st.cardTitle}>Perfect dive!</Text>
// // //               <Text style={st.cardText}>She swam across the pool.</Text>
// // //               <Text style={st.stars}>
// // //                 {'★'.repeat(result.stars || 0)}
// // //                 {'☆'.repeat(3 - (result.stars || 0))}
// // //               </Text>
// // //               <Text style={st.cardText}>Score: {result.score ?? 0}</Text>
// // //               {result.progressSaved === false && <Text style={st.cardText}>Progress could not be saved.</Text>}
// // //               <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={() => onComplete(result)}>
// // //                 <Text style={st.primaryT}>Next level</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         )}
// // //       </View>
// // //     </Stage>
// // //   );
// // // }

// // // const st = StyleSheet.create({
// // //   root: { flex: 1, backgroundColor: '#bddaee', overflow: 'hidden' },

// // //   // top
// // //   topBar: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 12,
// // //     paddingTop: 14,
// // //   },
// // //   homeBtn: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: THEME.yellow,
// // //     borderWidth: 2.5,
// // //     borderColor: THEME.yellowBorder,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   homeT: { fontSize: 18 },
// // //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 12 },
// // //   string: { position: 'absolute', top: 0, width: 2, height: 14, backgroundColor: '#7a5a3a' },
// // //   sign: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 8,
// // //     paddingHorizontal: 18,
// // //     height: 44,
// // //     borderRadius: 8,
// // //     backgroundColor: THEME.wood,
// // //     borderWidth: 3,
// // //     borderColor: THEME.woodDark,
// // //   },
// // //   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: THEME.cream, letterSpacing: 1 },
// // //   signArrow: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#ffd35c' },
// // //   leaf: {
// // //     position: 'absolute',
// // //     top: 4,
// // //     width: 22,
// // //     height: 12,
// // //     borderRadius: 8,
// // //     backgroundColor: '#6cbf4a',
// // //   },
// // //   pill: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 4,
// // //     height: 34,
// // //     minWidth: 64,
// // //     justifyContent: 'center',
// // //     paddingHorizontal: 12,
// // //     borderRadius: 17,
// // //     backgroundColor: '#fff',
// // //   },
// // //   pillT: { fontFamily: FONT, fontSize: 18, fontWeight: '900', color: '#1b1b1b' },
// // //   pillIcon: { fontSize: 16 },

// // //   // centre
// // //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 128 },
// // //   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
// // //   qPill: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 10,
// // //     backgroundColor: THEME.cream,
// // //     borderRadius: 24,
// // //     paddingVertical: 8,
// // //     paddingHorizontal: 16,
// // //     marginBottom: 10,
// // //     maxWidth: 360,
// // //   },
// // //   qArrow: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: THEME.orange },
// // //   question: { flexShrink: 1, fontFamily: FONT, fontSize: 16, fontStyle: 'italic', color: THEME.navy, textAlign: 'center' },
// // //   scene: { backgroundColor: 'transparent' },

// // //   primary: {
// // //     marginTop: 12,
// // //     minWidth: 160,
// // //     height: 52,
// // //     borderRadius: 26,
// // //     backgroundColor: THEME.green,
// // //     borderWidth: 3,
// // //     borderColor: THEME.greenRing,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   primaryT: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: THEME.navy },
// // //   off: { opacity: 0.5 },
// // //   msg: {
// // //     fontFamily: FONT,
// // //     fontSize: 15,
// // //     fontStyle: 'italic',
// // //     fontWeight: '700',
// // //     color: THEME.navy,
// // //     marginTop: 8,
// // //     textAlign: 'center',
// // //     minHeight: 20,
// // //     paddingHorizontal: 12,
// // //   },

// // //   // bottom panel
// // //   panel: {
// // //     position: 'absolute',
// // //     left: 16,
// // //     right: 16,
// // //     bottom: 14,
// // //     height: 112,
// // //     borderRadius: 56,
// // //     backgroundColor: THEME.panel,
// // //     borderWidth: 8,
// // //     borderColor: THEME.panelBorder,
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-start',
// // //     justifyContent: 'space-around',
// // //     paddingTop: 8,
// // //   },
// // //   btnCol: { alignItems: 'center' },
// // //   ringGreen: {
// // //     width: 62,
// // //     height: 62,
// // //     borderRadius: 31,
// // //     backgroundColor: THEME.greenRing,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   circleGreen: {
// // //     width: 52,
// // //     height: 52,
// // //     borderRadius: 26,
// // //     backgroundColor: THEME.green,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   ringWhite: {
// // //     width: 62,
// // //     height: 62,
// // //     borderRadius: 31,
// // //     backgroundColor: '#fff',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   circleRed: {
// // //     width: 50,
// // //     height: 50,
// // //     borderRadius: 25,
// // //     backgroundColor: THEME.red,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   btnIcon: { fontSize: 26 },
// // //   skipIcon: { fontSize: 22, color: '#1b1b1b' },
// // //   badge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 3,
// // //     marginTop: 4,
// // //     paddingHorizontal: 10,
// // //     height: 22,
// // //     borderRadius: 11,
// // //     backgroundColor: THEME.badge,
// // //   },
// // //   badgeIcon: { fontSize: 11 },
// // //   badgeT: { fontFamily: FONT, fontSize: 13, fontWeight: '900', color: '#fff' },

// // //   // error
// // //   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: THEME.navy, textAlign: 'center' },
// // //   errDetail: { fontFamily: FONT, fontSize: 14, color: THEME.navy, textAlign: 'center', marginTop: 6 },
// // //   link: { fontFamily: FONT, fontSize: 16, color: THEME.navy, marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },

// // //   // win card
// // //   overlay: {
// // //     ...StyleSheet.absoluteFillObject,
// // //     backgroundColor: 'rgba(0,0,0,0.45)',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     padding: 24,
// // //   },
// // //   card: {
// // //     width: '100%',
// // //     maxWidth: 340,
// // //     backgroundColor: THEME.panel,
// // //     borderColor: THEME.panelBorder,
// // //     borderWidth: 8,
// // //     borderRadius: 28,
// // //     padding: 22,
// // //     alignItems: 'center',
// // //   },
// // //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: THEME.navy, textAlign: 'center' },
// // //   stars: { fontSize: 36, color: THEME.orange, marginTop: 8 },
// // //   cardText: { fontFamily: FONT, fontSize: 17, color: THEME.navy, marginTop: 6, textAlign: 'center' },
// // // });
// // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // import {
// //   ActivityIndicator,
// //   Animated,
// //   Easing,
// //   PanResponder,
// //   Platform,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// //   useWindowDimensions,
// // } from 'react-native';
// // import { Stage } from './BTShared';
// // import { Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
// // import { RoomBackground, THEME } from './Btlevel4Theme';
// // import {
// //   Level4Answer,
// //   hintLevel4,
// //   jumpLevel4,
// //   rewardLevel4,
// //   skipLevel4,
// //   startLevel4,
// // } from './Btlevel4api';

// // const FONT: any = Platform.select({ ios: 'Chalkboard SE', android: 'sans-serif-condensed', default: 'sans-serif' });

// // type Props = {
// //   playerId: number;
// //   onHints?: (hints: number) => void;
// //   onExit: () => void;
// //   onComplete: (result: any) => void;
// // };

// // type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// // // the cylinder starts as a short column of water (like level 9)
// // const START_LEVEL = 22;

// // // clue shown when the magnifier is tapped
// // const CLUE = "Don't make her jump higher… make the water come closer!";

// // export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
// //   const { width, height } = useWindowDimensions();

// //   // ---------- scene geometry ----------
// //   const W = Math.min(width - 56, 340);
// //   const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 400));

// //   const pw = Math.round(W * 0.6);
// //   const ph = Math.round(H * 0.42); // height of the tallest water column
// //   const ry = poolRy(pw);
// //   const poolLeft = Math.round((W - pw) / 2);
// //   const poolTop = H - 8 - ph;
// //   const floorY = poolTop + ph - ry; // centre of the cylinder base

// //   const bw = Math.round(W * 0.46);
// //   const bh = Math.round(bw * 0.3);
// //   const boardLeft = W - bw;
// //   const boardTop = Math.round(H * 0.28);

// //   const gw = Math.round(W * 0.14);
// //   const gh = Math.round(gw * (88 / 48));
// //   const f = 0.22; // where on the board she stands (0 = tip, 1 = fixed end)
// //   const feetY = boardTop + (bh * (19 - 16 * f)) / 30;
// //   const girlLeft = Math.round(boardLeft + f * bw - gw / 2);
// //   const girlTop = Math.round(feetY - gh);
// //   const startCx = girlLeft + gw / 2;
// //   const startCy = girlTop + gh / 2;

// //   // y of the water surface (centre of the top ellipse) for a level
// //   const surfaceOf = (lvl: number) => floorY - ((ph - 2 * ry) * lvl) / 100;

// //   // ---------- state ----------
// //   const [phase, setPhase] = useState<Phase>('loading');
// //   const [sessionId, setSessionId] = useState<number | null>(null);
// //   const [question, setQuestion] = useState('She must do a dive jump successfully.');
// //   const [hints, setHints] = useState(0);
// //   const [hintLine, setHintLine] = useState<number | null>(null);
// //   const [level, setLevel] = useState(START_LEVEL);
// //   const [pose, setPose] = useState<GirlPose>('stand');
// //   const [msg, setMsg] = useState('');
// //   const [error, setError] = useState('');
// //   const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
// //   const [result, setResult] = useState<Level4Answer | null>(null);
// //   const [confirmSkip, setConfirmSkip] = useState(false);

// //   const gx = useRef(new Animated.Value(0)).current;
// //   const gy = useRef(new Animated.Value(0)).current;
// //   const grot = useRef(new Animated.Value(0)).current;
// //   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

// //   // refs so the gesture handler always sees the latest values
// //   const levelRef = useRef(level);
// //   levelRef.current = level;
// //   const phaseRef = useRef<Phase>(phase);
// //   phaseRef.current = phase;
// //   const phRef = useRef(ph);
// //   phRef.current = ph;
// //   const startLevelRef = useRef(START_LEVEL);

// //   const applyHints = useCallback(
// //     (h?: number) => {
// //       if (typeof h === 'number') {
// //         setHints(h);
// //         onHints?.(h);
// //       }
// //     },
// //     [onHints],
// //   );

// //   // ---------- open level: frontend -> backend -> DB session ----------
// //   const open = useCallback(async () => {
// //     setPhase('loading');
// //     setError('');
// //     try {
// //       const r = await startLevel4(playerId);
// //       setSessionId(r.sessionId);
// //       if (r.question) setQuestion(r.question);
// //       setHintLine(r.hintLevel ?? null);
// //       applyHints(r.hints);
// //       setPhase('idle');
// //     } catch (e: any) {
// //       setError(e?.message || 'Could not open the level.');
// //       setPhase('error');
// //     }
// //   }, [playerId, applyHints]);

// //   useEffect(() => {
// //     open();
// //   }, [open]);

// //   useEffect(() => () => {
// //     if (resetTimer.current) clearTimeout(resetTimer.current);
// //   }, []);

// //   // ---------- hand gesture: drag on the water to raise / lower it ----------
// //   const pan = useRef(
// //     PanResponder.create({
// //       onStartShouldSetPanResponder: () => phaseRef.current === 'idle',
// //       onMoveShouldSetPanResponder: () => phaseRef.current === 'idle',
// //       onPanResponderTerminationRequest: () => false,
// //       onPanResponderGrant: () => {
// //         startLevelRef.current = levelRef.current;
// //         setMsg('');
// //         setConfirmSkip(false);
// //       },
// //       onPanResponderMove: (_e, g) => {
// //         if (phaseRef.current !== 'idle') return;
// //         const next = startLevelRef.current - (g.dy / (phRef.current * 0.8)) * 100;
// //         setLevel(Math.max(0, Math.min(100, next)));
// //       },
// //     }),
// //   ).current;

// //   // ---------- dive (head first, like a real diver) + swim ----------
// //   const dive = (outcome: string, lvl: number) =>
// //     new Promise<void>((resolve) => {
// //       const surface = surfaceOf(lvl);
// //       const floorCy = floorY - gh / 2;
// //       const won = outcome === 'splash';
// //       const entryCy = Math.min(surface - gh / 2 + 4, floorCy); // hands touch the water
// //       const finalCy = won ? Math.min(surface + gh * 0.3, floorCy) : floorCy;
// //       const dx = W / 2 - startCx;
// //       const dyEntry = entryCy - startCy;
// //       const dyFinal = finalCy - startCy;

// //       setPose('dive');

// //       Animated.parallel([
// //         // forward travel
// //         Animated.timing(gx, { toValue: dx, duration: 760, easing: Easing.linear, useNativeDriver: false }),
// //         // up, then down to the water, then deeper
// //         Animated.sequence([
// //           Animated.timing(gy, { toValue: -34, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// //           Animated.timing(gy, { toValue: dyEntry, duration: 380, easing: Easing.in(Easing.quad), useNativeDriver: false }),
// //           Animated.timing(gy, { toValue: dyFinal, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// //         ]),
// //         // rotates forward, head first (counter-clockwise), ends pointing straight down
// //         Animated.timing(grot, { toValue: 1, duration: 760, delay: 80, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
// //       ]).start(() => {
// //         if (!won) {
// //           setTimeout(resolve, 600);
// //           return;
// //         }

// //         // she swims right, turns, swims left, then comes back to the middle
// //         const midY = (surface + floorY) / 2;
// //         const dyMid = midY - startCy;
// //         const amp = Math.max(20, pw / 2 - gh / 2 - 10);
// //         Animated.sequence([
// //           Animated.parallel([
// //             Animated.timing(grot, { toValue: 2, duration: 350, useNativeDriver: false }),
// //             Animated.timing(gy, { toValue: dyMid, duration: 350, useNativeDriver: false }),
// //             Animated.timing(gx, { toValue: dx + amp, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// //           ]),
// //           Animated.parallel([
// //             Animated.timing(grot, { toValue: 3, duration: 400, useNativeDriver: false }),
// //             Animated.timing(gx, { toValue: dx - amp, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// //           ]),
// //           Animated.timing(gx, { toValue: dx, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// //         ]).start(() => resolve());
// //       });

// //       // splash at the moment she enters the water
// //       setTimeout(() => {
// //         setSplash({ left: W / 2 - 28, top: surface - 30 });
// //         setTimeout(() => setSplash(null), 650);
// //       }, 690);
// //     });

// //   const resetScene = useCallback(() => {
// //     gx.setValue(0);
// //     gy.setValue(0);
// //     grot.setValue(0);
// //     setSplash(null);
// //     setPose('stand');
// //     setPhase('idle');
// //   }, [gx, gy, grot]);

// //   // ---------- JUMP: frontend -> backend -> MySQL -> JSON -> animate ----------
// //   const onJump = async () => {
// //     if (phase !== 'idle' || !sessionId) return;
// //     setMsg('');
// //     setConfirmSkip(false);
// //     setPhase('sending');
// //     const lvl = Math.round(level);
// //     try {
// //       const r = await jumpLevel4({ sessionId, playerId, waterLevel: lvl });
// //       setPhase('jumping');
// //       await dive(r.outcome || 'hit_bottom', lvl);
// //       applyHints(r.hints);
// //       if (r.correct) {
// //         setResult(r);
// //         setPhase('won');
// //       } else {
// //         setMsg('');
// //         setPhase('failed');
// //         resetTimer.current = setTimeout(resetScene, 1600);
// //       }
// //     } catch (e: any) {
// //       setMsg(e?.message || 'Could not reach the server.');
// //       setPhase('idle');
// //     }
// //   };

// //   // ---------- magnifier: show the water line (25 hints) ----------
// //   const onHint = async () => {
// //     if (phase !== 'idle' || !sessionId) return;
// //     setConfirmSkip(false);
// //     try {
// //       const r = await hintLevel4({ sessionId, playerId });
// //       setHintLine(r.hint?.level ?? null);
// //       setMsg(CLUE);
// //       applyHints(r.hints);
// //     } catch (e: any) {
// //       const m = String(e?.message || '');
// //       setMsg(/not enough/i.test(m) ? 'Not enough hints! Tap 🎬 for +75 hints.' : m || 'Could not get the hint.');
// //     }
// //   };

// //   // ---------- video reward (+75 hints) ----------
// //   const onReward = async () => {
// //     if (phase !== 'idle') return;
// //     setConfirmSkip(false);
// //     try {
// //       const r = await rewardLevel4(playerId);
// //       setMsg(`+${r.added} hints`);
// //       applyHints(r.hints);
// //     } catch (e: any) {
// //       setMsg(e?.message || 'Reward failed.');
// //     }
// //   };

// //   // ---------- skip (50 hints, tap twice) ----------
// //   const onSkip = async () => {
// //     if (phase !== 'idle' || !sessionId) return;
// //     if (!confirmSkip) {
// //       setConfirmSkip(true);
// //       setMsg('Skip costs 50 hints. Tap skip again to confirm.');
// //       return;
// //     }
// //     try {
// //       const r = await skipLevel4({ sessionId, playerId });
// //       applyHints(r.hints);
// //       onComplete(r);
// //     } catch (e: any) {
// //       setConfirmSkip(false);
// //       setMsg(e?.message || 'Could not skip.');
// //     }
// //   };

// //   const busy = phase !== 'idle';

// //   // ---------- shared header (home, wooden sign, hints pill) ----------
// //   const header = (
// //     <View style={st.topBar}>
// //       <TouchableOpacity
// //         style={st.homeBtn}
// //         activeOpacity={0.85}
// //         onPress={onExit}
// //         disabled={phase === 'jumping' || phase === 'sending'}
// //       >
// //         <Text style={st.homeT}>🏠</Text>
// //       </TouchableOpacity>

// //       <View style={st.signWrap}>
// //         <View style={[st.string, { left: 22 }]} />
// //         <View style={[st.string, { right: 22 }]} />
// //         <View style={st.sign}>
// //           <Text style={st.signArrow}>{'<'}</Text>
// //           <Text style={st.signT}>LEVEL 4</Text>
// //           <Text style={st.signArrow}>{'>'}</Text>
// //         </View>
// //         <View style={[st.leaf, { left: -6, transform: [{ rotate: '-30deg' }] }]} />
// //         <View style={[st.leaf, { right: -6, transform: [{ rotate: '30deg' }] }]} />
// //       </View>

// //       <View style={st.pill}>
// //         <Text style={st.pillT}>{hints}</Text>
// //         <Text style={st.pillIcon}>💡</Text>
// //       </View>
// //     </View>
// //   );

// //   // ---------- loading / error ----------
// //   if (phase === 'loading' || phase === 'error') {
// //     return (
// //       <Stage bg="#bddaee">
// //         <View style={st.root}>
// //           <RoomBackground />
// //           {header}
// //           <View style={st.centerMsg}>
// //             {phase === 'loading' ? (
// //               <ActivityIndicator size="large" color={THEME.orange} />
// //             ) : (
// //               <>
// //                 <Text style={st.errText}>Could not open the level.</Text>
// //                 <Text style={st.errDetail}>{error}</Text>
// //                 <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={open}>
// //                   <Text style={st.primaryT}>Retry</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity activeOpacity={0.85} onPress={onExit}>
// //                   <Text style={st.link}>Back</Text>
// //                 </TouchableOpacity>
// //               </>
// //             )}
// //           </View>
// //         </View>
// //       </Stage>
// //     );
// //   }

// //   const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'ns-resize' } : {};

// //   // ---------- game ----------
// //   return (
// //     <Stage bg="#bddaee">
// //       <View style={st.root}>
// //         <RoomBackground />

// //         {header}

// //         <View style={st.center}>
// //           {/* question pill (same style as level 1) */}
// //           <View style={st.qPill}>
// //             <Text style={st.qArrow}>{'<'}</Text>
// //             <Text style={st.question}>{question}</Text>
// //             <Text style={st.qArrow}>{'>'}</Text>
// //           </View>

// //           {/* scene (transparent: the room is behind it) */}
// //           <View style={[st.scene, { width: W, height: H }]}>
// //             <View style={{ position: 'absolute', left: boardLeft, top: boardTop }}>
// //               <Board w={bw} h={bh} />
// //             </View>

// //             <View style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// //               <Pool w={pw} h={ph} level={level} hintLevel={hintLine} />
// //             </View>

// //             <Animated.View
// //               style={{
// //                 position: 'absolute',
// //                 left: girlLeft,
// //                 top: girlTop,
// //                 width: gw,
// //                 height: gh,
// //                 transform: [
// //                   { translateX: gx },
// //                   { translateY: gy },
// //                   {
// //                     rotate: grot.interpolate({
// //                       inputRange: [0, 1, 2, 3],
// //                       outputRange: ['0deg', '-180deg', '-270deg', '-90deg'],
// //                     }),
// //                   },
// //                 ],
// //               }}
// //             >
// //               <Girl w={gw} pose={pose} />
// //             </Animated.View>

// //             {/* water in front of her, so she looks like she is under the water */}
// //             <View pointerEvents="none" style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// //               <PoolWater w={pw} h={ph} level={level} />
// //             </View>

// //             {splash && (
// //               <View pointerEvents="none" style={{ position: 'absolute', left: splash.left, top: splash.top }}>
// //                 <Splash w={56} />
// //               </View>
// //             )}

// //             {/* gesture area over the water column */}
// //             <View
// //               {...pan.panHandlers}
// //               style={[
// //                 {
// //                   position: 'absolute',
// //                   left: poolLeft - 24,
// //                   top: poolTop - 40,
// //                   width: pw + 48,
// //                   height: ph + 56,
// //                 },
// //                 webTouch,
// //               ]}
// //             />
// //           </View>

// //           <TouchableOpacity
// //             style={[st.primary, busy && st.off]}
// //             disabled={busy}
// //             activeOpacity={0.85}
// //             onPress={onJump}
// //           >
// //             {phase === 'sending' ? <ActivityIndicator color={THEME.navy} /> : <Text style={st.primaryT}>JUMP</Text>}
// //           </TouchableOpacity>

// //           <Text style={st.msg}>{msg || ' '}</Text>
// //         </View>

// //         {/* bottom rounded panel (same as level 1) */}
// //         <View style={st.panel}>
// //           <View style={st.btnCol}>
// //             <TouchableOpacity
// //               style={[st.ringGreen, busy && st.off]}
// //               activeOpacity={0.85}
// //               onPress={onHint}
// //               disabled={busy}
// //             >
// //               <View style={st.circleGreen}>
// //                 <Text style={st.btnIcon}>🔍</Text>
// //               </View>
// //             </TouchableOpacity>
// //             <View style={st.badge}>
// //               <Text style={st.badgeIcon}>💡</Text>
// //               <Text style={st.badgeT}>25</Text>
// //             </View>
// //           </View>

// //           <View style={st.btnCol}>
// //             <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onReward} disabled={busy}>
// //               <Text style={st.btnIcon}>🎬</Text>
// //             </TouchableOpacity>
// //             <View style={st.badge}>
// //               <Text style={st.badgeIcon}>🪙</Text>
// //               <Text style={st.badgeT}>+75</Text>
// //             </View>
// //           </View>

// //           <View style={st.btnCol}>
// //             <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onSkip} disabled={busy}>
// //               <View style={st.circleRed}>
// //                 <Text style={st.skipIcon}>▶</Text>
// //               </View>
// //             </TouchableOpacity>
// //             <View style={st.badge}>
// //               <Text style={st.badgeIcon}>💡</Text>
// //               <Text style={st.badgeT}>50</Text>
// //             </View>
// //           </View>
// //         </View>

// //         {/* win card */}
// //         {phase === 'won' && result && (
// //           <View style={st.overlay}>
// //             <View style={st.card}>
// //               <Text style={st.cardTitle}>Perfect dive!</Text>
// //               <Text style={st.cardText}>She swam across the pool.</Text>
// //               <Text style={st.stars}>
// //                 {'★'.repeat(result.stars || 0)}
// //                 {'☆'.repeat(3 - (result.stars || 0))}
// //               </Text>
// //               <Text style={st.cardText}>Score: {result.score ?? 0}</Text>
// //               {result.progressSaved === false && <Text style={st.cardText}>Progress could not be saved.</Text>}
// //               <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={() => onComplete(result)}>
// //                 <Text style={st.primaryT}>Next level</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         )}
// //       </View>
// //     </Stage>
// //   );
// // }

// // const st = StyleSheet.create({
// //   root: { flex: 1, backgroundColor: '#bddaee', overflow: 'hidden' },

// //   // top
// //   topBar: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 12,
// //     paddingTop: 14,
// //   },
// //   homeBtn: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: THEME.yellow,
// //     borderWidth: 2.5,
// //     borderColor: THEME.yellowBorder,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   homeT: { fontSize: 18 },
// //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 12 },
// //   string: { position: 'absolute', top: 0, width: 2, height: 14, backgroundColor: '#7a5a3a' },
// //   sign: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //     paddingHorizontal: 18,
// //     height: 44,
// //     borderRadius: 8,
// //     backgroundColor: THEME.wood,
// //     borderWidth: 3,
// //     borderColor: THEME.woodDark,
// //   },
// //   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: THEME.cream, letterSpacing: 1 },
// //   signArrow: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#ffd35c' },
// //   leaf: {
// //     position: 'absolute',
// //     top: 4,
// //     width: 22,
// //     height: 12,
// //     borderRadius: 8,
// //     backgroundColor: '#6cbf4a',
// //   },
// //   pill: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 4,
// //     height: 34,
// //     minWidth: 64,
// //     justifyContent: 'center',
// //     paddingHorizontal: 12,
// //     borderRadius: 17,
// //     backgroundColor: '#fff',
// //   },
// //   pillT: { fontFamily: FONT, fontSize: 18, fontWeight: '900', color: '#1b1b1b' },
// //   pillIcon: { fontSize: 16 },

// //   // centre
// //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 128 },
// //   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
// //   qPill: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 10,
// //     backgroundColor: THEME.cream,
// //     borderRadius: 24,
// //     paddingVertical: 8,
// //     paddingHorizontal: 16,
// //     marginBottom: 10,
// //     maxWidth: 360,
// //   },
// //   qArrow: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: THEME.orange },
// //   question: { flexShrink: 1, fontFamily: FONT, fontSize: 16, fontStyle: 'italic', color: THEME.navy, textAlign: 'center' },
// //   scene: { backgroundColor: 'transparent' },

// //   primary: {
// //     marginTop: 12,
// //     minWidth: 160,
// //     height: 52,
// //     borderRadius: 26,
// //     backgroundColor: THEME.green,
// //     borderWidth: 3,
// //     borderColor: THEME.greenRing,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   primaryT: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: THEME.navy },
// //   off: { opacity: 0.5 },
// //   msg: {
// //     fontFamily: FONT,
// //     fontSize: 15,
// //     fontStyle: 'italic',
// //     fontWeight: '700',
// //     color: THEME.navy,
// //     marginTop: 8,
// //     textAlign: 'center',
// //     minHeight: 20,
// //     paddingHorizontal: 12,
// //   },

// //   // bottom panel
// //   panel: {
// //     position: 'absolute',
// //     left: 16,
// //     right: 16,
// //     bottom: 14,
// //     height: 112,
// //     borderRadius: 56,
// //     backgroundColor: THEME.panel,
// //     borderWidth: 8,
// //     borderColor: THEME.panelBorder,
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //     justifyContent: 'space-around',
// //     paddingTop: 8,
// //   },
// //   btnCol: { alignItems: 'center' },
// //   ringGreen: {
// //     width: 62,
// //     height: 62,
// //     borderRadius: 31,
// //     backgroundColor: THEME.greenRing,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   circleGreen: {
// //     width: 52,
// //     height: 52,
// //     borderRadius: 26,
// //     backgroundColor: THEME.green,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   ringWhite: {
// //     width: 62,
// //     height: 62,
// //     borderRadius: 31,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   circleRed: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     backgroundColor: THEME.red,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   btnIcon: { fontSize: 26 },
// //   skipIcon: { fontSize: 22, color: '#1b1b1b' },
// //   badge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 3,
// //     marginTop: 4,
// //     paddingHorizontal: 10,
// //     height: 22,
// //     borderRadius: 11,
// //     backgroundColor: THEME.badge,
// //   },
// //   badgeIcon: { fontSize: 11 },
// //   badgeT: { fontFamily: FONT, fontSize: 13, fontWeight: '900', color: '#fff' },

// //   // error
// //   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: THEME.navy, textAlign: 'center' },
// //   errDetail: { fontFamily: FONT, fontSize: 14, color: THEME.navy, textAlign: 'center', marginTop: 6 },
// //   link: { fontFamily: FONT, fontSize: 16, color: THEME.navy, marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },

// //   // win card
// //   overlay: {
// //     ...StyleSheet.absoluteFillObject,
// //     backgroundColor: 'rgba(0,0,0,0.45)',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 24,
// //   },
// //   card: {
// //     width: '100%',
// //     maxWidth: 340,
// //     backgroundColor: THEME.panel,
// //     borderColor: THEME.panelBorder,
// //     borderWidth: 8,
// //     borderRadius: 28,
// //     padding: 22,
// //     alignItems: 'center',
// //   },
// //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: THEME.navy, textAlign: 'center' },
// //   stars: { fontSize: 36, color: THEME.orange, marginTop: 8 },
// //   cardText: { fontFamily: FONT, fontSize: 17, color: THEME.navy, marginTop: 6, textAlign: 'center' },
// // });
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Animated,
//   Easing,
//   PanResponder,
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   useWindowDimensions,
// } from 'react-native';
// import { Stage } from './BTShared';
// import { Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
// import { RoomBackground, THEME } from './Btlevel4Theme';
// import {
//   Level4Answer,
//   hintLevel4,
//   jumpLevel4,
//   rewardLevel4,
//   skipLevel4,
//   startLevel4,
// } from './Btlevel4api';

// const FONT: any = Platform.select({ ios: 'Chalkboard SE', android: 'sans-serif-condensed', default: 'sans-serif' });

// type Props = {
//   playerId: number;
//   onHints?: (hints: number) => void;
//   onExit: () => void;
//   onComplete: (result: any) => void;
// };

// type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// // the cylinder starts as a short column of water (like level 9)
// const START_LEVEL = 22;

// // clues shown in the CLUES popup when the magnifier is tapped
// const CLUE_1 = "Don't make her jump higher… make the water come closer!";
// const CLUE_2 = 'Drag the water up to the yellow line, then press JUMP.';

// export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
//   const { width, height } = useWindowDimensions();

//   // ---------- scene geometry ----------
//   const W = Math.min(width - 56, 340);
//   const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 400));

//   const pw = Math.round(W * 0.6);
//   const ph = Math.round(H * 0.42); // height of the tallest water column
//   const ry = poolRy(pw);
//   const poolLeft = Math.round((W - pw) / 2);
//   const poolTop = H - 8 - ph;
//   const floorY = poolTop + ph - ry; // centre of the cylinder base

//   const bw = Math.round(W * 0.46);
//   const bh = Math.round(bw * 0.3);
//   const boardLeft = W - bw;
//   const boardTop = Math.round(H * 0.28);

//   const gw = Math.round(W * 0.14);
//   const gh = Math.round(gw * (88 / 48));
//   const f = 0.22; // where on the board she stands (0 = tip, 1 = fixed end)
//   const feetY = boardTop + (bh * (19 - 16 * f)) / 30;
//   const girlLeft = Math.round(boardLeft + f * bw - gw / 2);
//   const girlTop = Math.round(feetY - gh);
//   const startCx = girlLeft + gw / 2;
//   const startCy = girlTop + gh / 2;

//   // y of the water surface (centre of the top ellipse) for a level
//   const surfaceOf = (lvl: number) => floorY - ((ph - 2 * ry) * lvl) / 100;

//   // ---------- state ----------
//   const [phase, setPhase] = useState<Phase>('loading');
//   const [sessionId, setSessionId] = useState<number | null>(null);
//   const [question, setQuestion] = useState('She must do a dive jump successfully.');
//   const [hints, setHints] = useState(0);
//   const [hintLine, setHintLine] = useState<number | null>(null);
//   const [level, setLevel] = useState(START_LEVEL);
//   const [pose, setPose] = useState<GirlPose>('stand');
//   const [msg, setMsg] = useState('');
//   const [error, setError] = useState('');
//   const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
//   const [result, setResult] = useState<Level4Answer | null>(null);
//   const [confirmSkip, setConfirmSkip] = useState(false);
//   const [clueOpen, setClueOpen] = useState(false);
//   const [clue2Shown, setClue2Shown] = useState(false);

//   const gx = useRef(new Animated.Value(0)).current;
//   const gy = useRef(new Animated.Value(0)).current;
//   const grot = useRef(new Animated.Value(0)).current;
//   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // refs so the gesture handler always sees the latest values
//   const levelRef = useRef(level);
//   levelRef.current = level;
//   const phaseRef = useRef<Phase>(phase);
//   phaseRef.current = phase;
//   const phRef = useRef(ph);
//   phRef.current = ph;
//   const startLevelRef = useRef(START_LEVEL);

//   const applyHints = useCallback(
//     (h?: number) => {
//       if (typeof h === 'number') {
//         setHints(h);
//         onHints?.(h);
//       }
//     },
//     [onHints],
//   );

//   // ---------- open level: frontend -> backend -> DB session ----------
//   const open = useCallback(async () => {
//     setPhase('loading');
//     setError('');
//     try {
//       const r = await startLevel4(playerId);
//       setSessionId(r.sessionId);
//       if (r.question) setQuestion(r.question);
//       setHintLine(r.hintLevel ?? null);
//       applyHints(r.hints);
//       setPhase('idle');
//     } catch (e: any) {
//       setError(e?.message || 'Could not open the level.');
//       setPhase('error');
//     }
//   }, [playerId, applyHints]);

//   useEffect(() => {
//     open();
//   }, [open]);

//   useEffect(() => () => {
//     if (resetTimer.current) clearTimeout(resetTimer.current);
//   }, []);

//   // ---------- hand gesture: drag on the water to raise / lower it ----------
//   const pan = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => phaseRef.current === 'idle',
//       onMoveShouldSetPanResponder: () => phaseRef.current === 'idle',
//       onPanResponderTerminationRequest: () => false,
//       onPanResponderGrant: () => {
//         startLevelRef.current = levelRef.current;
//         setMsg('');
//         setConfirmSkip(false);
//       },
//       onPanResponderMove: (_e, g) => {
//         if (phaseRef.current !== 'idle') return;
//         const next = startLevelRef.current - (g.dy / (phRef.current * 0.8)) * 100;
//         setLevel(Math.max(0, Math.min(100, next)));
//       },
//     }),
//   ).current;

//   // ---------- dive (head first, like a real diver) + swim ----------
//   const dive = (outcome: string, lvl: number) =>
//     new Promise<void>((resolve) => {
//       const surface = surfaceOf(lvl);
//       const floorCy = floorY - gh / 2;
//       const won = outcome === 'splash';
//       const entryCy = Math.min(surface - gh / 2 + 4, floorCy); // hands touch the water
//       const finalCy = won ? Math.min(surface + gh * 0.3, floorCy) : floorCy;
//       const dx = W / 2 - startCx;
//       const dyEntry = entryCy - startCy;
//       const dyFinal = finalCy - startCy;

//       setPose('dive');

//       Animated.parallel([
//         // forward travel
//         Animated.timing(gx, { toValue: dx, duration: 760, easing: Easing.linear, useNativeDriver: false }),
//         // up, then down to the water, then deeper
//         Animated.sequence([
//           Animated.timing(gy, { toValue: -34, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
//           Animated.timing(gy, { toValue: dyEntry, duration: 380, easing: Easing.in(Easing.quad), useNativeDriver: false }),
//           Animated.timing(gy, { toValue: dyFinal, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
//         ]),
//         // rotates forward, head first (counter-clockwise), ends pointing straight down
//         Animated.timing(grot, { toValue: 1, duration: 760, delay: 80, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
//       ]).start(() => {
//         if (!won) {
//           setTimeout(resolve, 600);
//           return;
//         }

//         // she swims right, turns, swims left, then comes back to the middle
//         const midY = (surface + floorY) / 2;
//         const dyMid = midY - startCy;
//         const amp = Math.max(20, pw / 2 - gh / 2 - 10);
//         Animated.sequence([
//           Animated.parallel([
//             Animated.timing(grot, { toValue: 2, duration: 350, useNativeDriver: false }),
//             Animated.timing(gy, { toValue: dyMid, duration: 350, useNativeDriver: false }),
//             Animated.timing(gx, { toValue: dx + amp, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
//           ]),
//           Animated.parallel([
//             Animated.timing(grot, { toValue: 3, duration: 400, useNativeDriver: false }),
//             Animated.timing(gx, { toValue: dx - amp, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
//           ]),
//           Animated.timing(gx, { toValue: dx, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
//         ]).start(() => resolve());
//       });

//       // splash at the moment she enters the water
//       setTimeout(() => {
//         setSplash({ left: W / 2 - 28, top: surface - 30 });
//         setTimeout(() => setSplash(null), 650);
//       }, 690);
//     });

//   const resetScene = useCallback(() => {
//     gx.setValue(0);
//     gy.setValue(0);
//     grot.setValue(0);
//     setSplash(null);
//     setPose('stand');
//     setPhase('idle');
//   }, [gx, gy, grot]);

//   // ---------- JUMP: frontend -> backend -> MySQL -> JSON -> animate ----------
//   const onJump = async () => {
//     if (phase !== 'idle' || !sessionId) return;
//     setMsg('');
//     setConfirmSkip(false);
//     setPhase('sending');
//     const lvl = Math.round(level);
//     try {
//       const r = await jumpLevel4({ sessionId, playerId, waterLevel: lvl });
//       setPhase('jumping');
//       await dive(r.outcome || 'hit_bottom', lvl);
//       applyHints(r.hints);
//       if (r.correct) {
//         setResult(r);
//         setPhase('won');
//       } else {
//         setMsg('');
//         setPhase('failed');
//         resetTimer.current = setTimeout(resetScene, 1600);
//       }
//     } catch (e: any) {
//       setMsg(e?.message || 'Could not reach the server.');
//       setPhase('idle');
//     }
//   };

//   // ---------- magnifier: show the water line (25 hints) ----------
//   const onHint = async () => {
//     if (phase !== 'idle' || !sessionId) return;
//     setConfirmSkip(false);
//     try {
//       const r = await hintLevel4({ sessionId, playerId });
//       setHintLine(r.hint?.level ?? null);
//       setMsg('');
//       setClue2Shown(false);
//       setClueOpen(true);
//       applyHints(r.hints);
//     } catch (e: any) {
//       const m = String(e?.message || '');
//       setMsg(/not enough/i.test(m) ? 'Not enough hints! Tap 🎬 for +75 hints.' : m || 'Could not get the hint.');
//     }
//   };

//   // ---------- video reward (+75 hints) ----------
//   const onReward = async () => {
//     if (phase !== 'idle') return;
//     setConfirmSkip(false);
//     try {
//       const r = await rewardLevel4(playerId);
//       setMsg(`+${r.added} hints`);
//       applyHints(r.hints);
//     } catch (e: any) {
//       setMsg(e?.message || 'Reward failed.');
//     }
//   };

//   // ---------- skip (50 hints, tap twice) ----------
//   const onSkip = async () => {
//     if (phase !== 'idle' || !sessionId) return;
//     if (!confirmSkip) {
//       setConfirmSkip(true);
//       setMsg('Skip costs 50 hints. Tap skip again to confirm.');
//       return;
//     }
//     try {
//       const r = await skipLevel4({ sessionId, playerId });
//       applyHints(r.hints);
//       onComplete(r);
//     } catch (e: any) {
//       setConfirmSkip(false);
//       setMsg(e?.message || 'Could not skip.');
//     }
//   };

//   const busy = phase !== 'idle';

//   // ---------- shared header (home, wooden sign, hints pill) ----------
//   const header = (
//     <View style={st.topBar}>
//       <TouchableOpacity
//         style={st.homeBtn}
//         activeOpacity={0.85}
//         onPress={onExit}
//         disabled={phase === 'jumping' || phase === 'sending'}
//       >
//         <Text style={st.homeT}>🏠</Text>
//       </TouchableOpacity>

//       <View style={st.signWrap}>
//         <View style={[st.string, { left: 22 }]} />
//         <View style={[st.string, { right: 22 }]} />
//         <View style={st.sign}>
//           <Text style={st.signArrow}>{'<'}</Text>
//           <Text style={st.signT}>LEVEL 4</Text>
//           <Text style={st.signArrow}>{'>'}</Text>
//         </View>
//         <View style={[st.leaf, { left: -6, transform: [{ rotate: '-30deg' }] }]} />
//         <View style={[st.leaf, { right: -6, transform: [{ rotate: '30deg' }] }]} />
//       </View>

//       <View style={st.pill}>
//         <Text style={st.pillT}>{hints}</Text>
//         <Text style={st.pillIcon}>💡</Text>
//       </View>
//     </View>
//   );

//   // ---------- loading / error ----------
//   if (phase === 'loading' || phase === 'error') {
//     return (
//       <Stage bg="#bddaee">
//         <View style={st.root}>
//           <RoomBackground />
//           {header}
//           <View style={st.centerMsg}>
//             {phase === 'loading' ? (
//               <ActivityIndicator size="large" color={THEME.orange} />
//             ) : (
//               <>
//                 <Text style={st.errText}>Could not open the level.</Text>
//                 <Text style={st.errDetail}>{error}</Text>
//                 <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={open}>
//                   <Text style={st.primaryT}>Retry</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity activeOpacity={0.85} onPress={onExit}>
//                   <Text style={st.link}>Back</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Stage>
//     );
//   }

//   const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'ns-resize' } : {};

//   // ---------- game ----------
//   return (
//     <Stage bg="#bddaee">
//       <View style={st.root}>
//         <RoomBackground />

//         {header}

//         <View style={st.center}>
//           {/* question pill (same style as level 1) */}
//           <View style={st.qPill}>
//             <Text style={st.qArrow}>{'<'}</Text>
//             <Text style={st.question}>{question}</Text>
//             <Text style={st.qArrow}>{'>'}</Text>
//           </View>

//           {/* scene (transparent: the room is behind it) */}
//           <View style={[st.scene, { width: W, height: H }]}>
//             <View style={{ position: 'absolute', left: boardLeft, top: boardTop }}>
//               <Board w={bw} h={bh} />
//             </View>

//             <View style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
//               <Pool w={pw} h={ph} level={level} hintLevel={hintLine} />
//             </View>

//             <Animated.View
//               style={{
//                 position: 'absolute',
//                 left: girlLeft,
//                 top: girlTop,
//                 width: gw,
//                 height: gh,
//                 transform: [
//                   { translateX: gx },
//                   { translateY: gy },
//                   {
//                     rotate: grot.interpolate({
//                       inputRange: [0, 1, 2, 3],
//                       outputRange: ['0deg', '-180deg', '-270deg', '-90deg'],
//                     }),
//                   },
//                 ],
//               }}
//             >
//               <Girl w={gw} pose={pose} />
//             </Animated.View>

//             {/* water in front of her, so she looks like she is under the water */}
//             <View pointerEvents="none" style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
//               <PoolWater w={pw} h={ph} level={level} />
//             </View>

//             {splash && (
//               <View pointerEvents="none" style={{ position: 'absolute', left: splash.left, top: splash.top }}>
//                 <Splash w={56} />
//               </View>
//             )}

//             {/* gesture area over the water column */}
//             <View
//               {...pan.panHandlers}
//               style={[
//                 {
//                   position: 'absolute',
//                   left: poolLeft - 24,
//                   top: poolTop - 40,
//                   width: pw + 48,
//                   height: ph + 56,
//                 },
//                 webTouch,
//               ]}
//             />
//           </View>

//           <TouchableOpacity
//             style={[st.primary, busy && st.off]}
//             disabled={busy}
//             activeOpacity={0.85}
//             onPress={onJump}
//           >
//             {phase === 'sending' ? <ActivityIndicator color={THEME.navy} /> : <Text style={st.primaryT}>JUMP</Text>}
//           </TouchableOpacity>

//           <Text style={st.msg}>{msg || ' '}</Text>
//         </View>

//         {/* bottom rounded panel (same as level 1) */}
//         <View style={st.panel}>
//           <View style={st.btnCol}>
//             <TouchableOpacity
//               style={[st.ringGreen, busy && st.off]}
//               activeOpacity={0.85}
//               onPress={onHint}
//               disabled={busy}
//             >
//               <View style={st.circleGreen}>
//                 <Text style={st.btnIcon}>🔍</Text>
//               </View>
//             </TouchableOpacity>
//             <View style={st.badge}>
//               <Text style={st.badgeIcon}>💡</Text>
//               <Text style={st.badgeT}>25</Text>
//             </View>
//           </View>

//           <View style={st.btnCol}>
//             <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onReward} disabled={busy}>
//               <Text style={st.btnIcon}>🎬</Text>
//             </TouchableOpacity>
//             <View style={st.badge}>
//               <Text style={st.badgeIcon}>🪙</Text>
//               <Text style={st.badgeT}>+75</Text>
//             </View>
//           </View>

//           <View style={st.btnCol}>
//             <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onSkip} disabled={busy}>
//               <View style={st.circleRed}>
//                 <Text style={st.skipIcon}>▶</Text>
//               </View>
//             </TouchableOpacity>
//             <View style={st.badge}>
//               <Text style={st.badgeIcon}>💡</Text>
//               <Text style={st.badgeT}>50</Text>
//             </View>
//           </View>
//         </View>

//         {/* CLUES popup (only from the magnifier) */}
//         {clueOpen && (
//           <View style={st.overlay}>
//             <View style={st.clueCard}>
//               <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => setClueOpen(false)}>
//                 <Text style={st.closeT}>✕</Text>
//               </TouchableOpacity>
//               <Text style={st.clueTitle}>CLUES</Text>

//               <View style={[st.clueRow, st.clueRowOpen]}>
//                 <View style={st.clueNum}>
//                   <Text style={st.clueNumT}>1</Text>
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={st.clueHead}>Clue 1</Text>
//                   <Text style={st.clueBody}>{CLUE_1}</Text>
//                 </View>
//               </View>

//               <TouchableOpacity
//                 activeOpacity={0.9}
//                 onPress={() => setClue2Shown(true)}
//                 style={[st.clueRow, clue2Shown ? st.clueRowOpen : st.clueRowLocked]}
//               >
//                 <View style={st.clueNum}>
//                   <Text style={st.clueNumT}>2</Text>
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={st.clueHead}>Clue 2</Text>
//                   <Text style={clue2Shown ? st.clueBody : st.clueTap}>{clue2Shown ? CLUE_2 : 'Tap to reveal'}</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}

//         {/* win card */}
//         {phase === 'won' && result && (
//           <View style={st.overlay}>
//             <View style={st.card}>
//               <Text style={st.cardTitle}>Perfect dive!</Text>
//               <Text style={st.cardText}>She swam across the pool.</Text>
//               <Text style={st.stars}>
//                 {'★'.repeat(result.stars || 0)}
//                 {'☆'.repeat(3 - (result.stars || 0))}
//               </Text>
//               <Text style={st.cardText}>Score: {result.score ?? 0}</Text>
//               {result.progressSaved === false && <Text style={st.cardText}>Progress could not be saved.</Text>}
//               <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={() => onComplete(result)}>
//                 <Text style={st.primaryT}>Next level</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       </View>
//     </Stage>
//   );
// }

// const st = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#bddaee', overflow: 'hidden' },

//   // top
//   topBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 12,
//     paddingTop: 14,
//   },
//   homeBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: THEME.yellow,
//     borderWidth: 2.5,
//     borderColor: THEME.yellowBorder,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   homeT: { fontSize: 18 },
//   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 12 },
//   string: { position: 'absolute', top: 0, width: 2, height: 14, backgroundColor: '#7a5a3a' },
//   sign: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     paddingHorizontal: 18,
//     height: 44,
//     borderRadius: 8,
//     backgroundColor: THEME.wood,
//     borderWidth: 3,
//     borderColor: THEME.woodDark,
//   },
//   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: THEME.cream, letterSpacing: 1 },
//   signArrow: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#ffd35c' },
//   leaf: {
//     position: 'absolute',
//     top: 4,
//     width: 22,
//     height: 12,
//     borderRadius: 8,
//     backgroundColor: '#6cbf4a',
//   },
//   pill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     height: 34,
//     minWidth: 64,
//     justifyContent: 'center',
//     paddingHorizontal: 12,
//     borderRadius: 17,
//     backgroundColor: '#fff',
//   },
//   pillT: { fontFamily: FONT, fontSize: 18, fontWeight: '900', color: '#1b1b1b' },
//   pillIcon: { fontSize: 16 },

//   // centre
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 128 },
//   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
//   qPill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     backgroundColor: THEME.cream,
//     borderRadius: 24,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     marginBottom: 10,
//     maxWidth: 360,
//   },
//   qArrow: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: THEME.orange },
//   question: { flexShrink: 1, fontFamily: FONT, fontSize: 16, fontStyle: 'italic', color: THEME.navy, textAlign: 'center' },
//   scene: { backgroundColor: 'transparent' },

//   primary: {
//     marginTop: 12,
//     minWidth: 160,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: THEME.green,
//     borderWidth: 3,
//     borderColor: THEME.greenRing,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   primaryT: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: THEME.navy },
//   off: { opacity: 0.5 },
//   msg: {
//     fontFamily: FONT,
//     fontSize: 15,
//     fontStyle: 'italic',
//     fontWeight: '700',
//     color: THEME.navy,
//     marginTop: 8,
//     textAlign: 'center',
//     minHeight: 20,
//     paddingHorizontal: 12,
//   },

//   // bottom panel
//   panel: {
//     position: 'absolute',
//     left: 16,
//     right: 16,
//     bottom: 14,
//     height: 112,
//     borderRadius: 56,
//     backgroundColor: THEME.panel,
//     borderWidth: 8,
//     borderColor: THEME.panelBorder,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     justifyContent: 'space-around',
//     paddingTop: 8,
//   },
//   btnCol: { alignItems: 'center' },
//   ringGreen: {
//     width: 62,
//     height: 62,
//     borderRadius: 31,
//     backgroundColor: THEME.greenRing,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   circleGreen: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: THEME.green,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   ringWhite: {
//     width: 62,
//     height: 62,
//     borderRadius: 31,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   circleRed: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: THEME.red,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   btnIcon: { fontSize: 26 },
//   skipIcon: { fontSize: 22, color: '#1b1b1b' },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 3,
//     marginTop: 4,
//     paddingHorizontal: 10,
//     height: 22,
//     borderRadius: 11,
//     backgroundColor: THEME.badge,
//   },
//   badgeIcon: { fontSize: 11 },
//   badgeT: { fontFamily: FONT, fontSize: 13, fontWeight: '900', color: '#fff' },

//   // error
//   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: THEME.navy, textAlign: 'center' },
//   errDetail: { fontFamily: FONT, fontSize: 14, color: THEME.navy, textAlign: 'center', marginTop: 6 },
//   link: { fontFamily: FONT, fontSize: 16, color: THEME.navy, marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },

//   // clues popup
//   clueCard: {
//     width: '100%',
//     maxWidth: 360,
//     backgroundColor: '#f9efdf',
//     borderColor: '#e8912e',
//     borderWidth: 6,
//     borderRadius: 28,
//     paddingHorizontal: 18,
//     paddingTop: 18,
//     paddingBottom: 22,
//   },
//   clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: THEME.navy, textAlign: 'center', marginBottom: 14 },
//   closeBtn: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: THEME.yellow,
//     borderWidth: 3,
//     borderColor: '#e8912e',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 2,
//   },
//   closeT: { fontSize: 18, fontWeight: '900', color: '#ee4558' },
//   clueRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 14,
//     borderRadius: 22,
//     borderWidth: 2.5,
//     paddingVertical: 14,
//     paddingHorizontal: 14,
//     marginBottom: 12,
//   },
//   clueRowOpen: { backgroundColor: '#fff', borderColor: '#3ec45a' },
//   clueRowLocked: { backgroundColor: '#f8e3ae', borderColor: '#f3b73a' },
//   clueNum: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: '#c0702b',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
//   clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#c0702b' },
//   clueBody: { fontFamily: FONT, fontSize: 16, fontStyle: 'italic', color: THEME.navy, marginTop: 2 },
//   clueTap: { fontFamily: FONT, fontSize: 15, fontWeight: '800', color: '#7a4a2a', marginTop: 2 },

//   // win card
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.45)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 24,
//   },
//   card: {
//     width: '100%',
//     maxWidth: 340,
//     backgroundColor: THEME.panel,
//     borderColor: THEME.panelBorder,
//     borderWidth: 8,
//     borderRadius: 28,
//     padding: 22,
//     alignItems: 'center',
//   },
//   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: THEME.navy, textAlign: 'center' },
//   stars: { fontSize: 36, color: THEME.orange, marginTop: 8 },
//   cardText: { fontFamily: FONT, fontSize: 17, color: THEME.navy, marginTop: 6, textAlign: 'center' },
// });
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Stage } from './BTShared';
import { Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
import { RoomBackground, THEME } from './Btlevel4Theme';
import {
  Level4Answer,
  hintLevel4,
  jumpLevel4,
  rewardLevel4,
  skipLevel4,
  startLevel4,
} from './Btlevel4api';

const FONT: any = Platform.select({ ios: 'Chalkboard SE', android: 'sans-serif-condensed', default: 'sans-serif' });

type Props = {
  playerId: number;
  onHints?: (hints: number) => void;
  onExit: () => void;
  onComplete: (result: any) => void;
};

type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// the cylinder starts as a short column of water (like level 9)
const START_LEVEL = 22;

// clues shown in the CLUES popup when the magnifier is tapped
const CLUE_1 = "Don't make her jump higher… make the water come closer!";
const CLUE_2 = 'Drag the water up to the yellow line, then press JUMP.';

export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
  const { width, height } = useWindowDimensions();

  // ---------- scene geometry ----------
  const W = Math.min(width - 56, 340);
  const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 400));

  const pw = Math.round(W * 0.6);
  const ph = Math.round(H * 0.42); // height of the tallest water column
  const ry = poolRy(pw);
  const poolLeft = Math.round((W - pw) / 2);
  const poolTop = H - 8 - ph;
  const floorY = poolTop + ph - ry; // centre of the cylinder base

  const bw = Math.round(W * 0.46);
  const bh = Math.round(bw * 0.3);
  const boardLeft = W - bw;
  const boardTop = Math.round(H * 0.28);

  const gw = Math.round(W * 0.14);
  const gh = Math.round(gw * (88 / 48));
  const f = 0.22; // where on the board she stands (0 = tip, 1 = fixed end)
  const feetY = boardTop + (bh * (19 - 16 * f)) / 30;
  const girlLeft = Math.round(boardLeft + f * bw - gw / 2);
  const girlTop = Math.round(feetY - gh);
  const startCx = girlLeft + gw / 2;
  const startCy = girlTop + gh / 2;

  // y of the water surface (centre of the top ellipse) for a level
  const surfaceOf = (lvl: number) => floorY - ((ph - 2 * ry) * lvl) / 100;

  // ---------- state ----------
  const [phase, setPhase] = useState<Phase>('loading');
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [question, setQuestion] = useState('She must do a dive jump successfully.');
  const [hints, setHints] = useState(0);
  const [hintLine, setHintLine] = useState<number | null>(null);
  const [level, setLevel] = useState(START_LEVEL);
  const [pose, setPose] = useState<GirlPose>('stand');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
  const [result, setResult] = useState<Level4Answer | null>(null);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [clueOpen, setClueOpen] = useState(false);
  const [clue2Shown, setClue2Shown] = useState(false);

  const gx = useRef(new Animated.Value(0)).current;
  const gy = useRef(new Animated.Value(0)).current;
  const grot = useRef(new Animated.Value(0)).current;
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // refs so the gesture handler always sees the latest values
  const levelRef = useRef(level);
  levelRef.current = level;
  const phaseRef = useRef<Phase>(phase);
  phaseRef.current = phase;
  const phRef = useRef(ph);
  phRef.current = ph;
  const startLevelRef = useRef(START_LEVEL);

  const applyHints = useCallback(
    (h?: number) => {
      if (typeof h === 'number') {
        setHints(h);
        onHints?.(h);
      }
    },
    [onHints],
  );

  // ---------- open level: frontend -> backend -> DB session ----------
  const open = useCallback(async () => {
    setPhase('loading');
    setError('');
    try {
      const r = await startLevel4(playerId);
      setSessionId(r.sessionId);
      if (r.question) setQuestion(r.question);
      setHintLine(r.hintLevel ?? null);
      applyHints(r.hints);
      setPhase('idle');
    } catch (e: any) {
      setError(e?.message || 'Could not open the level.');
      setPhase('error');
    }
  }, [playerId, applyHints]);

  useEffect(() => {
    open();
  }, [open]);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  // ---------- hand gesture: drag on the water to raise / lower it ----------
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => phaseRef.current === 'idle',
      onMoveShouldSetPanResponder: () => phaseRef.current === 'idle',
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        startLevelRef.current = levelRef.current;
        setMsg('');
        setConfirmSkip(false);
      },
      onPanResponderMove: (_e, g) => {
        if (phaseRef.current !== 'idle') return;
        const next = startLevelRef.current - (g.dy / (phRef.current * 0.8)) * 100;
        setLevel(Math.max(0, Math.min(100, next)));
      },
    }),
  ).current;

  // ---------- dive (head first, like a real diver) + swim ----------
  const dive = (outcome: string, lvl: number) =>
    new Promise<void>((resolve) => {
      const surface = surfaceOf(lvl);
      const floorCy = floorY - gh / 2;
      const won = outcome === 'splash';
      const entryCy = Math.min(surface - gh / 2 + 4, floorCy); // hands touch the water
      const finalCy = won ? Math.min(surface + gh * 0.3, floorCy) : floorCy;
      const dx = W / 2 - startCx;
      const dyEntry = entryCy - startCy;
      const dyFinal = finalCy - startCy;

      setPose('dive');

      Animated.parallel([
        // forward travel
        Animated.timing(gx, { toValue: dx, duration: 760, easing: Easing.linear, useNativeDriver: false }),
        // up, then down to the water, then deeper
        Animated.sequence([
          Animated.timing(gy, { toValue: -34, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
          Animated.timing(gy, { toValue: dyEntry, duration: 380, easing: Easing.in(Easing.quad), useNativeDriver: false }),
          Animated.timing(gy, { toValue: dyFinal, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        ]),
        // rotates forward, head first (counter-clockwise), ends pointing straight down
        Animated.timing(grot, { toValue: 1, duration: 760, delay: 80, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ]).start(() => {
        if (!won) {
          setTimeout(resolve, 600);
          return;
        }

        // she swims right, turns, swims left, then comes back to the middle
        const midY = (surface + floorY) / 2;
        const dyMid = midY - startCy;
        const amp = Math.max(20, pw / 2 - gh / 2 - 10);
        Animated.sequence([
          Animated.parallel([
            Animated.timing(grot, { toValue: 2, duration: 350, useNativeDriver: false }),
            Animated.timing(gy, { toValue: dyMid, duration: 350, useNativeDriver: false }),
            Animated.timing(gx, { toValue: dx + amp, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
          ]),
          Animated.parallel([
            Animated.timing(grot, { toValue: 3, duration: 400, useNativeDriver: false }),
            Animated.timing(gx, { toValue: dx - amp, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
          ]),
          Animated.timing(gx, { toValue: dx, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        ]).start(() => resolve());
      });

      // splash at the moment she enters the water
      setTimeout(() => {
        setSplash({ left: W / 2 - 28, top: surface - 30 });
        setTimeout(() => setSplash(null), 650);
      }, 690);
    });

  const resetScene = useCallback(() => {
    gx.setValue(0);
    gy.setValue(0);
    grot.setValue(0);
    setSplash(null);
    setPose('stand');
    setPhase('idle');
  }, [gx, gy, grot]);

  // ---------- JUMP: frontend -> backend -> MySQL -> JSON -> animate ----------
  const onJump = async () => {
    if (phase !== 'idle' || !sessionId) return;
    setMsg('');
    setConfirmSkip(false);
    setPhase('sending');
    const lvl = Math.round(level);
    try {
      const r = await jumpLevel4({ sessionId, playerId, waterLevel: lvl });
      setPhase('jumping');
      await dive(r.outcome || 'hit_bottom', lvl);
      applyHints(r.hints);
      if (r.correct) {
        setResult(r);
        setPhase('won');
      } else {
        setMsg('');
        setPhase('failed');
        resetTimer.current = setTimeout(resetScene, 1600);
      }
    } catch (e: any) {
      setMsg(e?.message || 'Could not reach the server.');
      setPhase('idle');
    }
  };

  // ---------- magnifier: show the water line (25 hints) ----------
  const onHint = async () => {
    if (phase !== 'idle' || !sessionId) return;
    setConfirmSkip(false);
    try {
      const r = await hintLevel4({ sessionId, playerId });
      setHintLine(r.hint?.level ?? null);
      setMsg('');
      setClue2Shown(false);
      setClueOpen(true);
      applyHints(r.hints);
    } catch (e: any) {
      const m = String(e?.message || '');
      setMsg(/not enough/i.test(m) ? 'Not enough hints! Tap 🎬 for +75 hints.' : m || 'Could not get the hint.');
    }
  };

  // ---------- video reward (+75 hints) ----------
  const onReward = async () => {
    if (phase !== 'idle') return;
    setConfirmSkip(false);
    try {
      const r = await rewardLevel4(playerId);
      setMsg(`+${r.added} hints`);
      applyHints(r.hints);
    } catch (e: any) {
      setMsg(e?.message || 'Reward failed.');
    }
  };

  // ---------- skip (50 hints, tap twice) ----------
  const onSkip = async () => {
    if (phase !== 'idle' || !sessionId) return;
    if (!confirmSkip) {
      setConfirmSkip(true);
      setMsg('Skip costs 50 hints. Tap skip again to confirm.');
      return;
    }
    try {
      const r = await skipLevel4({ sessionId, playerId });
      applyHints(r.hints);
      onComplete(r);
    } catch (e: any) {
      setConfirmSkip(false);
      setMsg(e?.message || 'Could not skip.');
    }
  };

  const busy = phase !== 'idle';

  // ---------- shared header (home, wooden sign, hints pill) ----------
  const header = (
    <View style={st.topBar}>
      <TouchableOpacity
        style={st.homeBtn}
        activeOpacity={0.85}
        onPress={onExit}
        disabled={phase === 'jumping' || phase === 'sending'}
      >
        <Text style={st.homeT}>🏠</Text>
      </TouchableOpacity>

      <View style={st.signWrap}>
        <View style={[st.string, { left: 22 }]} />
        <View style={[st.string, { right: 22 }]} />
        <View style={st.sign}>
          <Text style={st.signArrow}>{'<'}</Text>
          <Text style={st.signT}>LEVEL 4</Text>
          <Text style={st.signArrow}>{'>'}</Text>
        </View>
        <View style={[st.leaf, { left: -6, transform: [{ rotate: '-30deg' }] }]} />
        <View style={[st.leaf, { right: -6, transform: [{ rotate: '30deg' }] }]} />
      </View>

      <View style={st.pill}>
        <Text style={st.pillT}>{hints}</Text>
        <Text style={st.pillIcon}>💡</Text>
      </View>
    </View>
  );

  // ---------- loading / error ----------
  if (phase === 'loading' || phase === 'error') {
    return (
      <Stage bg="#bddaee">
        <View style={st.root}>
          <RoomBackground />
          {header}
          <View style={st.centerMsg}>
            {phase === 'loading' ? (
              <ActivityIndicator size="large" color={THEME.orange} />
            ) : (
              <>
                <Text style={st.errText}>Could not open the level.</Text>
                <Text style={st.errDetail}>{error}</Text>
                <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={open}>
                  <Text style={st.primaryT}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85} onPress={onExit}>
                  <Text style={st.link}>Back</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Stage>
    );
  }

  const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'ns-resize' } : {};

  // ---------- game ----------
  return (
    <Stage bg="#bddaee">
      <View style={st.root}>
        <RoomBackground />

        {header}

        <View style={st.center}>
          {/* question pill (same style as level 1) */}
          <View style={st.qPill}>
            <Text style={st.qArrow}>{'<'}</Text>
            <Text style={st.question}>{question}</Text>
            <Text style={st.qArrow}>{'>'}</Text>
          </View>

          {/* scene (transparent: the room is behind it) */}
          <View style={[st.scene, { width: W, height: H }]}>
            <View style={{ position: 'absolute', left: boardLeft, top: boardTop }}>
              <Board w={bw} h={bh} />
            </View>

            <View style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
              <Pool w={pw} h={ph} level={level} hintLevel={hintLine} />
            </View>

            <Animated.View
              style={{
                position: 'absolute',
                left: girlLeft,
                top: girlTop,
                width: gw,
                height: gh,
                transform: [
                  { translateX: gx },
                  { translateY: gy },
                  {
                    rotate: grot.interpolate({
                      inputRange: [0, 1, 2, 3],
                      outputRange: ['0deg', '-180deg', '-270deg', '-90deg'],
                    }),
                  },
                ],
              }}
            >
              <Girl w={gw} pose={pose} />
            </Animated.View>

            {/* water in front of her, so she looks like she is under the water */}
            <View pointerEvents="none" style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
              <PoolWater w={pw} h={ph} level={level} />
            </View>

            {splash && (
              <View pointerEvents="none" style={{ position: 'absolute', left: splash.left, top: splash.top }}>
                <Splash w={56} />
              </View>
            )}

            {/* gesture area over the water column */}
            <View
              {...pan.panHandlers}
              style={[
                {
                  position: 'absolute',
                  left: poolLeft - 24,
                  top: poolTop - 40,
                  width: pw + 48,
                  height: ph + 56,
                },
                webTouch,
              ]}
            />
          </View>

          <TouchableOpacity
            style={[st.primary, busy && st.off]}
            disabled={busy}
            activeOpacity={0.85}
            onPress={onJump}
          >
            {phase === 'sending' ? <ActivityIndicator color={THEME.navy} /> : <Text style={st.primaryT}>JUMP</Text>}
          </TouchableOpacity>

          <Text style={st.msg}>{msg || ' '}</Text>
        </View>

        {/* bottom rounded panel (same as level 1) */}
        <View style={st.panel}>
          <View style={st.btnCol}>
            <TouchableOpacity
              style={[st.ringGreen, busy && st.off]}
              activeOpacity={0.85}
              onPress={onHint}
              disabled={busy}
            >
              <View style={st.circleGreen}>
                <Text style={st.btnIcon}>🔍</Text>
              </View>
            </TouchableOpacity>
            <View style={st.badge}>
              <Text style={st.badgeIcon}>💡</Text>
              <Text style={st.badgeT}>25</Text>
            </View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onReward} disabled={busy}>
              <Text style={st.btnIcon}>🎬</Text>
            </TouchableOpacity>
            <View style={st.badge}>
              <Text style={st.badgeIcon}>🪙</Text>
              <Text style={st.badgeT}>+75</Text>
            </View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onSkip} disabled={busy}>
              <View style={st.circleRed}>
                <Text style={st.skipIcon}>▶</Text>
              </View>
            </TouchableOpacity>
            <View style={st.badge}>
              <Text style={st.badgeIcon}>💡</Text>
              <Text style={st.badgeT}>50</Text>
            </View>
          </View>
        </View>

        {/* CLUES popup (only from the magnifier) */}
        {clueOpen && (
          <View style={st.overlay}>
            <View style={st.clueCard}>
              <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => setClueOpen(false)}>
                <Text style={st.closeT}>✕</Text>
              </TouchableOpacity>
              <Text style={st.clueTitle}>CLUES</Text>

              <View style={[st.clueRow, st.clueRowOpen]}>
                <View style={st.clueNum}>
                  <Text style={st.clueNumT}>1</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={st.clueHead}>Clue 1</Text>
                  <Text style={st.clueBody}>{CLUE_1}</Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setClue2Shown(true)}
                style={[st.clueRow, clue2Shown ? st.clueRowOpen : st.clueRowLocked]}
              >
                <View style={st.clueNum}>
                  <Text style={st.clueNumT}>2</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={st.clueHead}>Clue 2</Text>
                  <Text style={clue2Shown ? st.clueBody : st.clueTap}>{clue2Shown ? CLUE_2 : 'Tap to reveal'}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* win card */}
        {phase === 'won' && result && (
          <View style={st.overlay}>
            <View style={st.card}>
              <Text style={st.cardTitle}>Perfect dive!</Text>
              <Text style={st.cardText}>She swam across the pool.</Text>
              <Text style={st.stars}>
                {'★'.repeat(result.stars || 0)}
                {'☆'.repeat(3 - (result.stars || 0))}
              </Text>
              <Text style={st.cardText}>Score: {result.score ?? 0}</Text>
              {result.progressSaved === false && <Text style={st.cardText}>Progress could not be saved.</Text>}
              <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={() => onComplete(result)}>
                <Text style={st.primaryT}>Next level</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Stage>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#bddaee', overflow: 'hidden' },

  // top
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 14,
  },
  homeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.yellow,
    borderWidth: 2.5,
    borderColor: THEME.yellowBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeT: { fontSize: 18 },
  signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 12 },
  string: { position: 'absolute', top: 0, width: 2, height: 14, backgroundColor: '#7a5a3a' },
  sign: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 8,
    backgroundColor: THEME.wood,
    borderWidth: 3,
    borderColor: THEME.woodDark,
  },
  signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: THEME.cream, letterSpacing: 1 },
  signArrow: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#ffd35c' },
  leaf: {
    position: 'absolute',
    top: 4,
    width: 22,
    height: 12,
    borderRadius: 8,
    backgroundColor: '#6cbf4a',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 34,
    minWidth: 64,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: '#fff',
  },
  pillT: { fontFamily: FONT, fontSize: 18, fontWeight: '900', color: '#1b1b1b' },
  pillIcon: { fontSize: 16 },

  // centre
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 128 },
  centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  qPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: THEME.cream,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
    maxWidth: 360,
  },
  qArrow: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: THEME.orange },
  question: { flexShrink: 1, fontFamily: FONT, fontSize: 16, fontStyle: 'italic', color: THEME.navy, textAlign: 'center' },
  scene: { backgroundColor: 'transparent' },

  primary: {
    marginTop: 12,
    minWidth: 160,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.green,
    borderWidth: 3,
    borderColor: THEME.greenRing,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryT: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: THEME.navy },
  off: { opacity: 0.5 },
  msg: {
    fontFamily: FONT,
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: '700',
    color: THEME.navy,
    marginTop: 8,
    textAlign: 'center',
    minHeight: 20,
    paddingHorizontal: 12,
  },

  // bottom panel
  panel: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
    height: 112,
    borderRadius: 56,
    backgroundColor: THEME.panel,
    borderWidth: 8,
    borderColor: THEME.panelBorder,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  btnCol: { alignItems: 'center' },
  ringGreen: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: THEME.greenRing,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleGreen: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWhite: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleRed: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: THEME.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: { fontSize: 26 },
  skipIcon: { fontSize: 22, color: '#1b1b1b' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
    paddingHorizontal: 10,
    height: 22,
    borderRadius: 11,
    backgroundColor: THEME.badge,
  },
  badgeIcon: { fontSize: 11 },
  badgeT: { fontFamily: FONT, fontSize: 13, fontWeight: '900', color: '#fff' },

  // error
  errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: THEME.navy, textAlign: 'center' },
  errDetail: { fontFamily: FONT, fontSize: 14, color: THEME.navy, textAlign: 'center', marginTop: 6 },
  link: { fontFamily: FONT, fontSize: 16, color: THEME.navy, marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },

  // clues popup
  clueCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#f9efdf',
    borderColor: '#e8912e',
    borderWidth: 6,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
  },
  clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: THEME.navy, textAlign: 'center', marginBottom: 14 },
  closeBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.yellow,
    borderWidth: 3,
    borderColor: '#e8912e',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  closeT: { fontSize: 18, fontWeight: '900', color: '#ee4558' },
  clueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 22,
    borderWidth: 2.5,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  clueRowOpen: { backgroundColor: '#fff', borderColor: '#3ec45a' },
  clueRowLocked: { backgroundColor: '#f8e3ae', borderColor: '#f3b73a' },
  clueNum: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#c0702b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
  clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#c0702b' },
  clueBody: { fontFamily: FONT, fontSize: 16, fontStyle: 'italic', color: THEME.navy, marginTop: 2 },
  clueTap: { fontFamily: FONT, fontSize: 15, fontWeight: '800', color: '#7a4a2a', marginTop: 2 },

  // win card
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: THEME.panel,
    borderColor: THEME.panelBorder,
    borderWidth: 8,
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
  },
  cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: THEME.navy, textAlign: 'center' },
  stars: { fontSize: 36, color: THEME.orange, marginTop: 8 },
  cardText: { fontFamily: FONT, fontSize: 17, color: THEME.navy, marginTop: 6, textAlign: 'center' },
});
