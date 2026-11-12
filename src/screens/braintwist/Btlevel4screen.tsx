

// // // // // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // // // // import {
// // // // // // //   ActivityIndicator,
// // // // // // //   Animated,
// // // // // // //   Easing,
// // // // // // //   PanResponder,
// // // // // // //   Platform,
// // // // // // //   StyleSheet,
// // // // // // //   Text,
// // // // // // //   TouchableOpacity,
// // // // // // //   View,
// // // // // // //   useWindowDimensions,
// // // // // // // } from 'react-native';
// // // // // // // import { Stage } from './BTShared';
// // // // // // // import { Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
// // // // // // // import { RoomBackground, THEME } from './Btlevel4Theme';
// // // // // // // import { play } from './BTSound';
// // // // // // // import {
// // // // // // //   Level4Answer,
// // // // // // //   hintLevel4,
// // // // // // //   jumpLevel4,
// // // // // // //   rewardLevel4,
// // // // // // //   skipLevel4,
// // // // // // //   startLevel4,
// // // // // // // } from './Btlevel4api';

// // // // // // // const FONT: any = Platform.select({ ios: 'Chalkboard SE', android: 'sans-serif-condensed', default: 'sans-serif' });

// // // // // // // type Props = {
// // // // // // //   playerId: number;
// // // // // // //   onHints?: (hints: number) => void;
// // // // // // //   onExit: () => void;
// // // // // // //   onComplete: (result: any) => void;
// // // // // // // };

// // // // // // // type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// // // // // // // // the cylinder starts as a short column of water (like level 9)
// // // // // // // const START_LEVEL = 22;

// // // // // // // // clues shown in the CLUES popup when the magnifier is tapped
// // // // // // // const CLUE_1 = "Don't make her jump higher… make the water come closer!";
// // // // // // // const CLUE_2 = 'Drag the water up to the yellow line, then press JUMP.';

// // // // // // // export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // // // // // //   const { width, height } = useWindowDimensions();

// // // // // // //   // ---------- scene geometry ----------
// // // // // // //   const W = Math.min(width - 56, 340);
// // // // // // //   const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 400));

// // // // // // //   const pw = Math.round(W * 0.6);
// // // // // // //   const ph = Math.round(H * 0.42); // height of the tallest water column
// // // // // // //   const ry = poolRy(pw);
// // // // // // //   const poolLeft = Math.round((W - pw) / 2);
// // // // // // //   const poolTop = H - 8 - ph;
// // // // // // //   const floorY = poolTop + ph - ry; // centre of the cylinder base

// // // // // // //   const bw = Math.round(W * 0.46);
// // // // // // //   const bh = Math.round(bw * 0.3);
// // // // // // //   const boardLeft = W - bw;
// // // // // // //   const boardTop = Math.round(H * 0.28);

// // // // // // //   const gw = Math.round(W * 0.14);
// // // // // // //   const gh = Math.round(gw * (88 / 48));
// // // // // // //   const f = 0.22; // where on the board she stands (0 = tip, 1 = fixed end)
// // // // // // //   const feetY = boardTop + (bh * (19 - 16 * f)) / 30;
// // // // // // //   const girlLeft = Math.round(boardLeft + f * bw - gw / 2);
// // // // // // //   const girlTop = Math.round(feetY - gh);
// // // // // // //   const startCx = girlLeft + gw / 2;
// // // // // // //   const startCy = girlTop + gh / 2;

// // // // // // //   // y of the water surface (centre of the top ellipse) for a level
// // // // // // //   const surfaceOf = (lvl: number) => floorY - ((ph - 2 * ry) * lvl) / 100;

// // // // // // //   // ---------- state ----------
// // // // // // //   const [phase, setPhase] = useState<Phase>('loading');
// // // // // // //   const [sessionId, setSessionId] = useState<number | null>(null);
// // // // // // //   const [question, setQuestion] = useState('She must do a dive jump successfully.');
// // // // // // //   const [hints, setHints] = useState(0);
// // // // // // //   const [hintLine, setHintLine] = useState<number | null>(null);
// // // // // // //   const [level, setLevel] = useState(START_LEVEL);
// // // // // // //   const [pose, setPose] = useState<GirlPose>('stand');
// // // // // // //   const [msg, setMsg] = useState('');
// // // // // // //   const [error, setError] = useState('');
// // // // // // //   const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
// // // // // // //   const [result, setResult] = useState<Level4Answer | null>(null);
// // // // // // //   const [confirmSkip, setConfirmSkip] = useState(false);
// // // // // // //   const [clueOpen, setClueOpen] = useState(false);
// // // // // // //   const [clue2Shown, setClue2Shown] = useState(false);

// // // // // // //   const gx = useRef(new Animated.Value(0)).current;
// // // // // // //   const gy = useRef(new Animated.Value(0)).current;
// // // // // // //   const grot = useRef(new Animated.Value(0)).current;
// // // // // // //   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

// // // // // // //   // refs so the gesture handler always sees the latest values
// // // // // // //   const levelRef = useRef(level);
// // // // // // //   levelRef.current = level;
// // // // // // //   const phaseRef = useRef<Phase>(phase);
// // // // // // //   phaseRef.current = phase;
// // // // // // //   const phRef = useRef(ph);
// // // // // // //   phRef.current = ph;
// // // // // // //   const startLevelRef = useRef(START_LEVEL);

// // // // // // //   const applyHints = useCallback(
// // // // // // //     (h?: number) => {
// // // // // // //       if (typeof h === 'number') {
// // // // // // //         setHints(h);
// // // // // // //         onHints?.(h);
// // // // // // //       }
// // // // // // //     },
// // // // // // //     [onHints],
// // // // // // //   );

// // // // // // //   // ---------- open level: frontend -> backend -> DB session ----------
// // // // // // //   const open = useCallback(async () => {
// // // // // // //     setPhase('loading');
// // // // // // //     setError('');
// // // // // // //     try {
// // // // // // //       const r = await startLevel4(playerId);
// // // // // // //       setSessionId(r.sessionId);
// // // // // // //       if (r.question) setQuestion(r.question);
// // // // // // //       setHintLine(r.hintLevel ?? null);
// // // // // // //       applyHints(r.hints);
// // // // // // //       setPhase('idle');
// // // // // // //     } catch (e: any) {
// // // // // // //       setError(e?.message || 'Could not open the level.');
// // // // // // //       setPhase('error');
// // // // // // //     }
// // // // // // //   }, [playerId, applyHints]);

// // // // // // //   useEffect(() => {
// // // // // // //     open();
// // // // // // //   }, [open]);

// // // // // // //   useEffect(() => () => {
// // // // // // //     if (resetTimer.current) clearTimeout(resetTimer.current);
// // // // // // //   }, []);

// // // // // // //   // ---------- hand gesture: drag on the water to raise / lower it ----------
// // // // // // //   const pan = useRef(
// // // // // // //     PanResponder.create({
// // // // // // //       onStartShouldSetPanResponder: () => phaseRef.current === 'idle',
// // // // // // //       onMoveShouldSetPanResponder: () => phaseRef.current === 'idle',
// // // // // // //       onPanResponderTerminationRequest: () => false,
// // // // // // //       onPanResponderGrant: () => {
// // // // // // //         startLevelRef.current = levelRef.current;
// // // // // // //         setMsg('');
// // // // // // //         setConfirmSkip(false);
// // // // // // //       },
// // // // // // //       onPanResponderMove: (_e, g) => {
// // // // // // //         if (phaseRef.current !== 'idle') return;
// // // // // // //         const next = startLevelRef.current - (g.dy / (phRef.current * 0.8)) * 100;
// // // // // // //         setLevel(Math.max(0, Math.min(100, next)));
// // // // // // //       },
// // // // // // //     }),
// // // // // // //   ).current;

// // // // // // //   // ---------- dive (head first, like a real diver) + swim ----------
// // // // // // //   const dive = (outcome: string, lvl: number) =>
// // // // // // //     new Promise<void>((resolve) => {
// // // // // // //       const surface = surfaceOf(lvl);
// // // // // // //       const floorCy = floorY - gh / 2;
// // // // // // //       const won = outcome === 'splash';
// // // // // // //       const entryCy = Math.min(surface - gh / 2 + 4, floorCy); // hands touch the water
// // // // // // //       const finalCy = won ? Math.min(surface + gh * 0.3, floorCy) : floorCy;
// // // // // // //       const dx = W / 2 - startCx;
// // // // // // //       const dyEntry = entryCy - startCy;
// // // // // // //       const dyFinal = finalCy - startCy;

// // // // // // //       setPose('dive');

// // // // // // //       Animated.parallel([
// // // // // // //         // forward travel
// // // // // // //         Animated.timing(gx, { toValue: dx, duration: 760, easing: Easing.linear, useNativeDriver: false }),
// // // // // // //         // up, then down to the water, then deeper
// // // // // // //         Animated.sequence([
// // // // // // //           Animated.timing(gy, { toValue: -34, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// // // // // // //           Animated.timing(gy, { toValue: dyEntry, duration: 380, easing: Easing.in(Easing.quad), useNativeDriver: false }),
// // // // // // //           Animated.timing(gy, { toValue: dyFinal, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// // // // // // //         ]),
// // // // // // //         // rotates forward, head first (counter-clockwise), ends pointing straight down
// // // // // // //         Animated.timing(grot, { toValue: 1, duration: 760, delay: 80, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
// // // // // // //       ]).start(() => {
// // // // // // //         if (!won) {
// // // // // // //           setTimeout(resolve, 600);
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         // she swims right, turns, swims left, then comes back to the middle
// // // // // // //         const midY = (surface + floorY) / 2;
// // // // // // //         const dyMid = midY - startCy;
// // // // // // //         const amp = Math.max(20, pw / 2 - gh / 2 - 10);
// // // // // // //         Animated.sequence([
// // // // // // //           Animated.parallel([
// // // // // // //             Animated.timing(grot, { toValue: 2, duration: 350, useNativeDriver: false }),
// // // // // // //             Animated.timing(gy, { toValue: dyMid, duration: 350, useNativeDriver: false }),
// // // // // // //             Animated.timing(gx, { toValue: dx + amp, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // // // // // //           ]),
// // // // // // //           Animated.parallel([
// // // // // // //             Animated.timing(grot, { toValue: 3, duration: 400, useNativeDriver: false }),
// // // // // // //             Animated.timing(gx, { toValue: dx - amp, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // // // // // //           ]),
// // // // // // //           Animated.timing(gx, { toValue: dx, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // // // // // //         ]).start(() => resolve());
// // // // // // //       });

// // // // // // //       // splash at the moment she enters the water
// // // // // // //       setTimeout(() => {
// // // // // // //         setSplash({ left: W / 2 - 28, top: surface - 30 });
// // // // // // //         setTimeout(() => setSplash(null), 650);
// // // // // // //       }, 690);
// // // // // // //     });

// // // // // // //   const resetScene = useCallback(() => {
// // // // // // //     gx.setValue(0);
// // // // // // //     gy.setValue(0);
// // // // // // //     grot.setValue(0);
// // // // // // //     setSplash(null);
// // // // // // //     setPose('stand');
// // // // // // //     setPhase('idle');
// // // // // // //   }, [gx, gy, grot]);

// // // // // // //   // ---------- JUMP: frontend -> backend -> MySQL -> JSON -> animate ----------
// // // // // // //   const onJump = async () => {
// // // // // // //     if (phase !== 'idle' || !sessionId) return;
// // // // // // //     setMsg('');
// // // // // // //     setConfirmSkip(false);
// // // // // // //     setPhase('sending');
// // // // // // //     const lvl = Math.round(level);
// // // // // // //     try {
// // // // // // //       const r = await jumpLevel4({ sessionId, playerId, waterLevel: lvl });
// // // // // // //       setPhase('jumping');
// // // // // // //       play('btn');
// // // // // // //       await dive(r.outcome || 'hit_bottom', lvl);
// // // // // // //       applyHints(r.hints);
// // // // // // //       if (r.correct) {
// // // // // // //         play('correct');
// // // // // // //         setResult(r);
// // // // // // //         setPhase('won');
// // // // // // //       } else {
// // // // // // //         play('wrong');
// // // // // // //         setMsg('');
// // // // // // //         setPhase('failed');
// // // // // // //         resetTimer.current = setTimeout(resetScene, 1600);
// // // // // // //       }
// // // // // // //     } catch (e: any) {
// // // // // // //       setMsg(e?.message || 'Could not reach the server.');
// // // // // // //       setPhase('idle');
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // ---------- magnifier: show the water line (25 hints) ----------
// // // // // // //   const onHint = async () => {
// // // // // // //     if (phase !== 'idle' || !sessionId) return;
// // // // // // //     setConfirmSkip(false);
// // // // // // //     try {
// // // // // // //       const r = await hintLevel4({ sessionId, playerId });
// // // // // // //       setHintLine(r.hint?.level ?? null);
// // // // // // //       setMsg('');
// // // // // // //       setClue2Shown(false);
// // // // // // //       play('clue');
// // // // // // //       setClueOpen(true);
// // // // // // //       applyHints(r.hints);
// // // // // // //     } catch (e: any) {
// // // // // // //       const m = String(e?.message || '');
// // // // // // //       setMsg(/not enough/i.test(m) ? 'Not enough hints! Tap 🎬 for +75 hints.' : m || 'Could not get the hint.');
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // ---------- video reward (+75 hints) ----------
// // // // // // //   const onReward = async () => {
// // // // // // //     if (phase !== 'idle') return;
// // // // // // //     setConfirmSkip(false);
// // // // // // //     try {
// // // // // // //       const r = await rewardLevel4(playerId);
// // // // // // //       setMsg(`+${r.added} hints`);
// // // // // // //       applyHints(r.hints);
// // // // // // //     } catch (e: any) {
// // // // // // //       setMsg(e?.message || 'Reward failed.');
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // ---------- skip (50 hints, tap twice) ----------
// // // // // // //   const onSkip = async () => {
// // // // // // //     if (phase !== 'idle' || !sessionId) return;
// // // // // // //     if (!confirmSkip) {
// // // // // // //       setConfirmSkip(true);
// // // // // // //       setMsg('Skip costs 50 hints. Tap skip again to confirm.');
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     try {
// // // // // // //       const r = await skipLevel4({ sessionId, playerId });
// // // // // // //       applyHints(r.hints);
// // // // // // //       onComplete(r);
// // // // // // //     } catch (e: any) {
// // // // // // //       setConfirmSkip(false);
// // // // // // //       setMsg(e?.message || 'Could not skip.');
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const busy = phase !== 'idle';

// // // // // // //   // ---------- shared header (home, wooden sign, hints pill) ----------
// // // // // // //   const header = (
// // // // // // //     <View style={st.topBar}>
// // // // // // //       <TouchableOpacity
// // // // // // //         style={st.homeBtn}
// // // // // // //         activeOpacity={0.85}
// // // // // // //         onPress={onExit}
// // // // // // //         disabled={phase === 'jumping' || phase === 'sending'}
// // // // // // //       >
// // // // // // //         <Text style={st.homeT}>🏠</Text>
// // // // // // //       </TouchableOpacity>

// // // // // // //       <View style={st.signWrap}>
// // // // // // //         <View style={[st.string, { left: 22 }]} />
// // // // // // //         <View style={[st.string, { right: 22 }]} />
// // // // // // //         <View style={st.sign}>
// // // // // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // // // // //           <Text style={st.signT}>LEVEL 4</Text>
// // // // // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // // // // //         </View>
// // // // // // //         <View style={[st.leaf, { left: -6, transform: [{ rotate: '-30deg' }] }]} />
// // // // // // //         <View style={[st.leaf, { right: -6, transform: [{ rotate: '30deg' }] }]} />
// // // // // // //       </View>

// // // // // // //       <View style={st.pill}>
// // // // // // //         <Text style={st.pillT}>{hints}</Text>
// // // // // // //         <Text style={st.pillIcon}>💡</Text>
// // // // // // //       </View>
// // // // // // //     </View>
// // // // // // //   );

// // // // // // //   // ---------- loading / error ----------
// // // // // // //   if (phase === 'loading' || phase === 'error') {
// // // // // // //     return (
// // // // // // //       <Stage bg="#bddaee">
// // // // // // //         <View style={st.root}>
// // // // // // //           <RoomBackground />
// // // // // // //           {header}
// // // // // // //           <View style={st.centerMsg}>
// // // // // // //             {phase === 'loading' ? (
// // // // // // //               <ActivityIndicator size="large" color={THEME.orange} />
// // // // // // //             ) : (
// // // // // // //               <>
// // // // // // //                 <Text style={st.errText}>Could not open the level.</Text>
// // // // // // //                 <Text style={st.errDetail}>{error}</Text>
// // // // // // //                 <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={open}>
// // // // // // //                   <Text style={st.primaryT}>Retry</Text>
// // // // // // //                 </TouchableOpacity>
// // // // // // //                 <TouchableOpacity activeOpacity={0.85} onPress={onExit}>
// // // // // // //                   <Text style={st.link}>Back</Text>
// // // // // // //                 </TouchableOpacity>
// // // // // // //               </>
// // // // // // //             )}
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //       </Stage>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'ns-resize' } : {};

// // // // // // //   // ---------- game ----------
// // // // // // //   return (
// // // // // // //     <Stage bg="#bddaee">
// // // // // // //       <View style={st.root}>
// // // // // // //         <RoomBackground />

// // // // // // //         {header}

// // // // // // //         <View style={st.center}>
// // // // // // //           {/* question pill (same style as level 1) */}
// // // // // // //           <View style={st.qPill}>
// // // // // // //             <Text style={st.qArrow}>{'<'}</Text>
// // // // // // //             <Text style={st.question}>{question}</Text>
// // // // // // //             <Text style={st.qArrow}>{'>'}</Text>
// // // // // // //           </View>

// // // // // // //           {/* scene (transparent: the room is behind it) */}
// // // // // // //           <View style={[st.scene, { width: W, height: H }]}>
// // // // // // //             <View style={{ position: 'absolute', left: boardLeft, top: boardTop }}>
// // // // // // //               <Board w={bw} h={bh} />
// // // // // // //             </View>

// // // // // // //             <View style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// // // // // // //               <Pool w={pw} h={ph} level={level} hintLevel={hintLine} />
// // // // // // //             </View>

// // // // // // //             <Animated.View
// // // // // // //               style={{
// // // // // // //                 position: 'absolute',
// // // // // // //                 left: girlLeft,
// // // // // // //                 top: girlTop,
// // // // // // //                 width: gw,
// // // // // // //                 height: gh,
// // // // // // //                 transform: [
// // // // // // //                   { translateX: gx },
// // // // // // //                   { translateY: gy },
// // // // // // //                   {
// // // // // // //                     rotate: grot.interpolate({
// // // // // // //                       inputRange: [0, 1, 2, 3],
// // // // // // //                       outputRange: ['0deg', '-180deg', '-270deg', '-90deg'],
// // // // // // //                     }),
// // // // // // //                   },
// // // // // // //                 ],
// // // // // // //               }}
// // // // // // //             >
// // // // // // //               <Girl w={gw} pose={pose} />
// // // // // // //             </Animated.View>

// // // // // // //             {/* water in front of her, so she looks like she is under the water */}
// // // // // // //             <View pointerEvents="none" style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// // // // // // //               <PoolWater w={pw} h={ph} level={level} />
// // // // // // //             </View>

// // // // // // //             {splash && (
// // // // // // //               <View pointerEvents="none" style={{ position: 'absolute', left: splash.left, top: splash.top }}>
// // // // // // //                 <Splash w={56} />
// // // // // // //               </View>
// // // // // // //             )}

// // // // // // //             {/* gesture area over the water column */}
// // // // // // //             <View
// // // // // // //               {...pan.panHandlers}
// // // // // // //               style={[
// // // // // // //                 {
// // // // // // //                   position: 'absolute',
// // // // // // //                   left: poolLeft - 24,
// // // // // // //                   top: poolTop - 40,
// // // // // // //                   width: pw + 48,
// // // // // // //                   height: ph + 56,
// // // // // // //                 },
// // // // // // //                 webTouch,
// // // // // // //               ]}
// // // // // // //             />
// // // // // // //           </View>

// // // // // // //           <TouchableOpacity
// // // // // // //             style={[st.primary, busy && st.off]}
// // // // // // //             disabled={busy}
// // // // // // //             activeOpacity={0.85}
// // // // // // //             onPress={onJump}
// // // // // // //           >
// // // // // // //             {phase === 'sending' ? <ActivityIndicator color={THEME.navy} /> : <Text style={st.primaryT}>JUMP</Text>}
// // // // // // //           </TouchableOpacity>

// // // // // // //           <Text style={st.msg}>{msg || ' '}</Text>
// // // // // // //         </View>

// // // // // // //         {/* bottom rounded panel (same as level 1) */}
// // // // // // //         <View style={st.panel}>
// // // // // // //           <View style={st.btnCol}>
// // // // // // //             <TouchableOpacity
// // // // // // //               style={[st.ringGreen, busy && st.off]}
// // // // // // //               activeOpacity={0.85}
// // // // // // //               onPress={onHint}
// // // // // // //               disabled={busy}
// // // // // // //             >
// // // // // // //               <View style={st.circleGreen}>
// // // // // // //                 <Text style={st.btnIcon}>🔍</Text>
// // // // // // //               </View>
// // // // // // //             </TouchableOpacity>
// // // // // // //             <View style={st.badge}>
// // // // // // //               <Text style={st.badgeIcon}>💡</Text>
// // // // // // //               <Text style={st.badgeT}>25</Text>
// // // // // // //             </View>
// // // // // // //           </View>

// // // // // // //           <View style={st.btnCol}>
// // // // // // //             <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onReward} disabled={busy}>
// // // // // // //               <Text style={st.btnIcon}>🎬</Text>
// // // // // // //             </TouchableOpacity>
// // // // // // //             <View style={st.badge}>
// // // // // // //               <Text style={st.badgeIcon}>🪙</Text>
// // // // // // //               <Text style={st.badgeT}>+75</Text>
// // // // // // //             </View>
// // // // // // //           </View>

// // // // // // //           <View style={st.btnCol}>
// // // // // // //             <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onSkip} disabled={busy}>
// // // // // // //               <View style={st.circleRed}>
// // // // // // //                 <Text style={st.skipIcon}>▶</Text>
// // // // // // //               </View>
// // // // // // //             </TouchableOpacity>
// // // // // // //             <View style={st.badge}>
// // // // // // //               <Text style={st.badgeIcon}>💡</Text>
// // // // // // //               <Text style={st.badgeT}>50</Text>
// // // // // // //             </View>
// // // // // // //           </View>
// // // // // // //         </View>

// // // // // // //         {/* CLUES popup (only from the magnifier) */}
// // // // // // //         {clueOpen && (
// // // // // // //           <View style={st.overlay}>
// // // // // // //             <View style={st.clueCard}>
// // // // // // //               <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => setClueOpen(false)}>
// // // // // // //                 <Text style={st.closeT}>✕</Text>
// // // // // // //               </TouchableOpacity>
// // // // // // //               <Text style={st.clueTitle}>CLUES</Text>

// // // // // // //               <View style={[st.clueRow, st.clueRowOpen]}>
// // // // // // //                 <View style={st.clueNum}>
// // // // // // //                   <Text style={st.clueNumT}>1</Text>
// // // // // // //                 </View>
// // // // // // //                 <View style={{ flex: 1 }}>
// // // // // // //                   <Text style={st.clueHead}>Clue 1</Text>
// // // // // // //                   <Text style={st.clueBody}>{CLUE_1}</Text>
// // // // // // //                 </View>
// // // // // // //               </View>

// // // // // // //               <TouchableOpacity
// // // // // // //                 activeOpacity={0.9}
// // // // // // //                 onPress={() => setClue2Shown(true)}
// // // // // // //                 style={[st.clueRow, clue2Shown ? st.clueRowOpen : st.clueRowLocked]}
// // // // // // //               >
// // // // // // //                 <View style={st.clueNum}>
// // // // // // //                   <Text style={st.clueNumT}>2</Text>
// // // // // // //                 </View>
// // // // // // //                 <View style={{ flex: 1 }}>
// // // // // // //                   <Text style={st.clueHead}>Clue 2</Text>
// // // // // // //                   <Text style={clue2Shown ? st.clueBody : st.clueTap}>{clue2Shown ? CLUE_2 : 'Tap to reveal'}</Text>
// // // // // // //                 </View>
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>
// // // // // // //           </View>
// // // // // // //         )}

// // // // // // //         {/* win card */}
// // // // // // //         {phase === 'won' && result && (
// // // // // // //           <View style={st.overlay}>
// // // // // // //             <View style={st.card}>
// // // // // // //               <Text style={st.cardTitle}>Perfect dive!</Text>
// // // // // // //               <Text style={st.cardText}>She swam across the pool.</Text>
// // // // // // //               <Text style={st.stars}>
// // // // // // //                 {'★'.repeat(result.stars || 0)}
// // // // // // //                 {'☆'.repeat(3 - (result.stars || 0))}
// // // // // // //               </Text>
// // // // // // //               <Text style={st.cardText}>Score: {result.score ?? 0}</Text>
// // // // // // //               {result.progressSaved === false && <Text style={st.cardText}>Progress could not be saved.</Text>}
// // // // // // //               <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={() => onComplete(result)}>
// // // // // // //                 <Text style={st.primaryT}>Next level</Text>
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>
// // // // // // //           </View>
// // // // // // //         )}
// // // // // // //       </View>
// // // // // // //     </Stage>
// // // // // // //   );
// // // // // // // }

// // // // // // // const st = StyleSheet.create({
// // // // // // //   root: { flex: 1, backgroundColor: '#bddaee', overflow: 'hidden' },

// // // // // // //   // top
// // // // // // //   topBar: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     paddingHorizontal: 12,
// // // // // // //     paddingTop: 14,
// // // // // // //   },
// // // // // // //   homeBtn: {
// // // // // // //     width: 40,
// // // // // // //     height: 40,
// // // // // // //     borderRadius: 20,
// // // // // // //     backgroundColor: THEME.yellow,
// // // // // // //     borderWidth: 2.5,
// // // // // // //     borderColor: THEME.yellowBorder,
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //   },
// // // // // // //   homeT: { fontSize: 18 },
// // // // // // //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 12 },
// // // // // // //   string: { position: 'absolute', top: 0, width: 2, height: 14, backgroundColor: '#7a5a3a' },
// // // // // // //   sign: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     gap: 8,
// // // // // // //     paddingHorizontal: 18,
// // // // // // //     height: 44,
// // // // // // //     borderRadius: 8,
// // // // // // //     backgroundColor: THEME.wood,
// // // // // // //     borderWidth: 3,
// // // // // // //     borderColor: THEME.woodDark,
// // // // // // //   },
// // // // // // //   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: THEME.cream, letterSpacing: 1 },
// // // // // // //   signArrow: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#ffd35c' },
// // // // // // //   leaf: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: 4,
// // // // // // //     width: 22,
// // // // // // //     height: 12,
// // // // // // //     borderRadius: 8,
// // // // // // //     backgroundColor: '#6cbf4a',
// // // // // // //   },
// // // // // // //   pill: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     gap: 4,
// // // // // // //     height: 34,
// // // // // // //     minWidth: 64,
// // // // // // //     justifyContent: 'center',
// // // // // // //     paddingHorizontal: 12,
// // // // // // //     borderRadius: 17,
// // // // // // //     backgroundColor: '#fff',
// // // // // // //   },
// // // // // // //   pillT: { fontFamily: FONT, fontSize: 18, fontWeight: '900', color: '#1b1b1b' },
// // // // // // //   pillIcon: { fontSize: 16 },

// // // // // // //   // centre
// // // // // // //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 128 },
// // // // // // //   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
// // // // // // //   qPill: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     gap: 10,
// // // // // // //     backgroundColor: THEME.cream,
// // // // // // //     borderRadius: 24,
// // // // // // //     paddingVertical: 8,
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     marginBottom: 10,
// // // // // // //     maxWidth: 360,
// // // // // // //   },
// // // // // // //   qArrow: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: THEME.orange },
// // // // // // //   question: { flexShrink: 1, fontFamily: FONT, fontSize: 16, fontStyle: 'italic', color: THEME.navy, textAlign: 'center' },
// // // // // // //   scene: { backgroundColor: 'transparent' },

// // // // // // //   primary: {
// // // // // // //     marginTop: 12,
// // // // // // //     minWidth: 160,
// // // // // // //     height: 52,
// // // // // // //     borderRadius: 26,
// // // // // // //     backgroundColor: THEME.green,
// // // // // // //     borderWidth: 3,
// // // // // // //     borderColor: THEME.greenRing,
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //   },
// // // // // // //   primaryT: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: THEME.navy },
// // // // // // //   off: { opacity: 0.5 },
// // // // // // //   msg: {
// // // // // // //     fontFamily: FONT,
// // // // // // //     fontSize: 15,
// // // // // // //     fontStyle: 'italic',
// // // // // // //     fontWeight: '700',
// // // // // // //     color: THEME.navy,
// // // // // // //     marginTop: 8,
// // // // // // //     textAlign: 'center',
// // // // // // //     minHeight: 20,
// // // // // // //     paddingHorizontal: 12,
// // // // // // //   },

// // // // // // //   // bottom panel
// // // // // // //   panel: {
// // // // // // //     position: 'absolute',
// // // // // // //     left: 16,
// // // // // // //     right: 16,
// // // // // // //     bottom: 14,
// // // // // // //     height: 112,
// // // // // // //     borderRadius: 56,
// // // // // // //     backgroundColor: THEME.panel,
// // // // // // //     borderWidth: 8,
// // // // // // //     borderColor: THEME.panelBorder,
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'flex-start',
// // // // // // //     justifyContent: 'space-around',
// // // // // // //     paddingTop: 8,
// // // // // // //   },
// // // // // // //   btnCol: { alignItems: 'center' },
// // // // // // //   ringGreen: {
// // // // // // //     width: 62,
// // // // // // //     height: 62,
// // // // // // //     borderRadius: 31,
// // // // // // //     backgroundColor: THEME.greenRing,
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //   },
// // // // // // //   circleGreen: {
// // // // // // //     width: 52,
// // // // // // //     height: 52,
// // // // // // //     borderRadius: 26,
// // // // // // //     backgroundColor: THEME.green,
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //   },
// // // // // // //   ringWhite: {
// // // // // // //     width: 62,
// // // // // // //     height: 62,
// // // // // // //     borderRadius: 31,
// // // // // // //     backgroundColor: '#fff',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //   },
// // // // // // //   circleRed: {
// // // // // // //     width: 50,
// // // // // // //     height: 50,
// // // // // // //     borderRadius: 25,
// // // // // // //     backgroundColor: THEME.red,
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //   },
// // // // // // //   btnIcon: { fontSize: 26 },
// // // // // // //   skipIcon: { fontSize: 22, color: '#1b1b1b' },
// // // // // // //   badge: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     gap: 3,
// // // // // // //     marginTop: 4,
// // // // // // //     paddingHorizontal: 10,
// // // // // // //     height: 22,
// // // // // // //     borderRadius: 11,
// // // // // // //     backgroundColor: THEME.badge,
// // // // // // //   },
// // // // // // //   badgeIcon: { fontSize: 11 },
// // // // // // //   badgeT: { fontFamily: FONT, fontSize: 13, fontWeight: '900', color: '#fff' },

// // // // // // //   // error
// // // // // // //   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: THEME.navy, textAlign: 'center' },
// // // // // // //   errDetail: { fontFamily: FONT, fontSize: 14, color: THEME.navy, textAlign: 'center', marginTop: 6 },
// // // // // // //   link: { fontFamily: FONT, fontSize: 16, color: THEME.navy, marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },

// // // // // // //   // clues popup
// // // // // // //   clueCard: {
// // // // // // //     width: '100%',
// // // // // // //     maxWidth: 360,
// // // // // // //     backgroundColor: '#f9efdf',
// // // // // // //     borderColor: '#e8912e',
// // // // // // //     borderWidth: 6,
// // // // // // //     borderRadius: 28,
// // // // // // //     paddingHorizontal: 18,
// // // // // // //     paddingTop: 18,
// // // // // // //     paddingBottom: 22,
// // // // // // //   },
// // // // // // //   clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: THEME.navy, textAlign: 'center', marginBottom: 14 },
// // // // // // //   closeBtn: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: -4,
// // // // // // //     right: -4,
// // // // // // //     width: 38,
// // // // // // //     height: 38,
// // // // // // //     borderRadius: 19,
// // // // // // //     backgroundColor: THEME.yellow,
// // // // // // //     borderWidth: 3,
// // // // // // //     borderColor: '#e8912e',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //     zIndex: 2,
// // // // // // //   },
// // // // // // //   closeT: { fontSize: 18, fontWeight: '900', color: '#ee4558' },
// // // // // // //   clueRow: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     gap: 14,
// // // // // // //     borderRadius: 22,
// // // // // // //     borderWidth: 2.5,
// // // // // // //     paddingVertical: 14,
// // // // // // //     paddingHorizontal: 14,
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   clueRowOpen: { backgroundColor: '#fff', borderColor: '#3ec45a' },
// // // // // // //   clueRowLocked: { backgroundColor: '#f8e3ae', borderColor: '#f3b73a' },
// // // // // // //   clueNum: {
// // // // // // //     width: 52,
// // // // // // //     height: 52,
// // // // // // //     borderRadius: 26,
// // // // // // //     backgroundColor: '#c0702b',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //   },
// // // // // // //   clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
// // // // // // //   clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#c0702b' },
// // // // // // //   clueBody: { fontFamily: FONT, fontSize: 16, fontStyle: 'italic', color: THEME.navy, marginTop: 2 },
// // // // // // //   clueTap: { fontFamily: FONT, fontSize: 15, fontWeight: '800', color: '#7a4a2a', marginTop: 2 },

// // // // // // //   // win card
// // // // // // //   overlay: {
// // // // // // //     ...StyleSheet.absoluteFill,
// // // // // // //     backgroundColor: 'rgba(0,0,0,0.45)',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //     padding: 24,
// // // // // // //   },
// // // // // // //   card: {
// // // // // // //     width: '100%',
// // // // // // //     maxWidth: 340,
// // // // // // //     backgroundColor: THEME.panel,
// // // // // // //     borderColor: THEME.panelBorder,
// // // // // // //     borderWidth: 8,
// // // // // // //     borderRadius: 28,
// // // // // // //     padding: 22,
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: THEME.navy, textAlign: 'center' },
// // // // // // //   stars: { fontSize: 36, color: THEME.orange, marginTop: 8 },
// // // // // // //   cardText: { fontFamily: FONT, fontSize: 17, color: THEME.navy, marginTop: 6, textAlign: 'center' },
// // // // // // // });
// // // // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // // // import {
// // // // // //   ActivityIndicator,
// // // // // //   Animated,
// // // // // //   Easing,
// // // // // //   PanResponder,
// // // // // //   Platform,
// // // // // //   StyleSheet,
// // // // // //   Text,
// // // // // //   TouchableOpacity,
// // // // // //   View,
// // // // // //   useWindowDimensions,
// // // // // // } from 'react-native';
// // // // // // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // // // // // import { Stage } from './BTShared';
// // // // // // import { Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
// // // // // // import { play } from './BTSound';
// // // // // // import {
// // // // // //   Level4Answer,
// // // // // //   hintLevel4,
// // // // // //   jumpLevel4,
// // // // // //   rewardLevel4,
// // // // // //   skipLevel4,
// // // // // //   startLevel4,
// // // // // // } from './Btlevel4api';

// // // // // // const FONT: any = Platform.select({ ios: 'Chalkboard SE', android: 'sans-serif-condensed', default: 'sans-serif' });
// // // // // // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// // // // // // /* garden palette */
// // // // // // const NAVY = '#13235b';
// // // // // // const SKY = '#5cc0f5';
// // // // // // const CREAM = '#faf0e2';
// // // // // // const CREAM_BORDER = '#ead2a4';
// // // // // // const WOOD = '#eba24e';
// // // // // // const WOOD_D = '#c2782c';
// // // // // // const WOOD_DD = '#8f5a1f';
// // // // // // const LIME = '#a4e02a';
// // // // // // const LIME_RING = '#f4f1dc';
// // // // // // const RED = '#f0434d';
// // // // // // const YELLOW_ARROW = '#ffb629';
// // // // // // const BADGE = '#6b4423';

// // // // // // type Props = {
// // // // // //   playerId: number;
// // // // // //   onHints?: (hints: number) => void;
// // // // // //   onExit: () => void;
// // // // // //   onComplete: (result: any) => void;
// // // // // // };

// // // // // // type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// // // // // // // the cylinder starts as a short column of water (like level 9)
// // // // // // const START_LEVEL = 22;

// // // // // // // clues shown in the CLUES popup when the magnifier is tapped
// // // // // // const CLUE_1 = "Don't make her jump higher… make the water come closer!";
// // // // // // const CLUE_2 = 'Drag the water up to the yellow line, then press JUMP.';

// // // // // // /* ---------- garden background ---------- */
// // // // // // function Flower({ x, y, s = 1 }: any) {
// // // // // //   return (
// // // // // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // // // //       {[0, 72, 144, 216, 288].map((a) => (
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
// // // // // //     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.95">
// // // // // //       <Ellipse cx="0" cy="0" rx="80" ry="28" />
// // // // // //       <Ellipse cx="-24" cy="-22" rx="42" ry="30" />
// // // // // //       <Ellipse cx="22" cy="-30" rx="38" ry="30" />
// // // // // //     </G>
// // // // // //   );
// // // // // // }

// // // // // // function Rock({ x, y, s = 1 }: any) {
// // // // // //   return (
// // // // // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // // // //       <Ellipse cx="0" cy="0" rx="68" ry="40" fill="#9b9b9b" />
// // // // // //       <Ellipse cx="-6" cy="-10" rx="50" ry="26" fill="#b6b6b6" />
// // // // // //     </G>
// // // // // //   );
// // // // // // }

// // // // // // function Garden() {
// // // // // //   return (
// // // // // //     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// // // // // //       {/* top: trees, clouds, left wooden post with the plant */}
// // // // // //       <Svg
// // // // // //         width="100%"
// // // // // //         height="100%"
// // // // // //         viewBox="0 0 942 760"
// // // // // //         style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 760 }}
// // // // // //       >
// // // // // //         <Defs>
// // // // // //           <LinearGradient id="g4sky" x1="0" y1="0" x2="0" y2="1">
// // // // // //             <Stop offset="0" stopColor="#4fbaf7" />
// // // // // //             <Stop offset="1" stopColor="#9fd9f8" />
// // // // // //           </LinearGradient>
// // // // // //         </Defs>
// // // // // //         <Rect width="942" height="760" fill="url(#g4sky)" />

// // // // // //         {/* trees in the top corners */}
// // // // // //         <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// // // // // //         <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// // // // // //         <Ellipse cx="860" cy="0" rx="190" ry="95" fill="#58b843" />
// // // // // //         <Ellipse cx="800" cy="-20" rx="140" ry="85" fill="#66c64a" />

// // // // // //         {/* clouds */}
// // // // // //         <Cloud x={870} y={230} s={0.9} />
// // // // // //         <Cloud x={50} y={380} s={0.8} />
// // // // // //         <Cloud x={390} y={525} s={1} />
// // // // // //         <Cloud x={850} y={415} s={0.9} />
// // // // // //         <Cloud x={75} y={745} s={0.8} />

// // // // // //         {/* wooden post + plank + plant (left) */}
// // // // // //         <Rect x="198" y="140" width="26" height="500" fill="#e9ab5e" />
// // // // // //         <Rect x="0" y="378" width="205" height="16" fill="#e9ab5e" />
// // // // // //         <Rect x="0" y="610" width="258" height="44" fill="#f0bb75" />
// // // // // //         <Rect x="0" y="646" width="258" height="8" fill="#d99a4e" opacity="0.6" />
// // // // // //         <Ellipse cx="85" cy="520" rx="46" ry="92" fill="#6cbf3d" />
// // // // // //         <Ellipse cx="150" cy="500" rx="38" ry="84" fill="#7fcf4b" transform="rotate(14 150 500)" />
// // // // // //         <Ellipse cx="45" cy="540" rx="34" ry="64" fill="#5fae38" transform="rotate(-14 45 540)" />
// // // // // //         <Rect x="68" y="548" width="106" height="68" rx="16" fill="#f4eadc" />
// // // // // //         <Circle cx="102" cy="578" r="5" fill="#6b4423" />
// // // // // //         <Circle cx="140" cy="578" r="5" fill="#6b4423" />
// // // // // //         <Path d="M114 590 Q121 598 128 590" stroke="#6b4423" strokeWidth="4" fill="none" strokeLinecap="round" />
// // // // // //       </Svg>

// // // // // //       {/* bottom: bush, fence, bookshelf, meadow, rocks, flowers */}
// // // // // //       <Svg
// // // // // //         width="100%"
// // // // // //         height="100%"
// // // // // //         viewBox="0 0 942 1000"
// // // // // //         style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1000 }}
// // // // // //       >
// // // // // //         {/* bush left + hills behind the fence */}
// // // // // //         <Ellipse cx="60" cy="400" rx="130" ry="150" fill="#4ea83a" />
// // // // // //         <Ellipse cx="120" cy="450" rx="130" ry="110" fill="#5bb83f" />
// // // // // //         <Ellipse cx="470" cy="520" rx="340" ry="100" fill="#6cc13a" />
// // // // // //         <Ellipse cx="860" cy="500" rx="200" ry="100" fill="#5fb832" />

// // // // // //         {/* fence */}
// // // // // //         <Rect x="0" y="440" width="942" height="22" fill="#e9b266" stroke="#c98a3e" strokeWidth="3" />
// // // // // //         <Rect x="0" y="490" width="942" height="18" fill="#e9b266" stroke="#c98a3e" strokeWidth="3" />
// // // // // //         {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
// // // // // //           const x = -20 + i * 98;
// // // // // //           return (
// // // // // //             <G key={i}>
// // // // // //               <Polygon points={`${x},400 ${x + 35},368 ${x + 70},400`} fill="#eeb96d" stroke="#c98a3e" strokeWidth="3" />
// // // // // //               <Rect x={x} y="400" width="70" height="150" fill="#eeb96d" stroke="#c98a3e" strokeWidth="3" />
// // // // // //               <Circle cx={x + 35} cy="430" r="5" fill="#8f5a1f" />
// // // // // //             </G>
// // // // // //           );
// // // // // //         })}

// // // // // //         {/* bookshelf (right) */}
// // // // // //         <Rect x="795" y="0" width="147" height="560" fill="#e9ab5e" />
// // // // // //         <Rect x="810" y="14" width="132" height="530" fill="#dc9d4f" />
// // // // // //         <Rect x="795" y="160" width="147" height="12" fill="#f0bb75" />
// // // // // //         <Rect x="795" y="300" width="147" height="12" fill="#f0bb75" />
// // // // // //         <Rect x="795" y="545" width="147" height="14" fill="#f0bb75" />
// // // // // //         <Rect x="830" y="50" width="28" height="110" fill="#38aeea" />
// // // // // //         <Rect x="860" y="68" width="28" height="92" fill="#f8d04c" />
// // // // // //         <Rect x="890" y="52" width="30" height="108" fill="#8a63da" />
// // // // // //         <Rect x="920" y="68" width="22" height="92" fill="#ef4b4b" />
// // // // // //         <Rect x="830" y="205" width="30" height="95" fill="#3a5ed6" />
// // // // // //         <Rect x="862" y="188" width="28" height="112" fill="#34c48a" />
// // // // // //         <Circle cx="850" cy="345" r="18" fill="#c98a4b" />
// // // // // //         <Circle cx="908" cy="345" r="18" fill="#c98a4b" />
// // // // // //         <Circle cx="879" cy="385" r="42" fill="#c98a4b" />

// // // // // //         {/* front meadow */}
// // // // // //         <Path d="M0 560 C140 520 300 540 470 535 C650 528 800 515 942 520 L942 1000 L0 1000 Z" fill="#74d13c" />
// // // // // //         <Path d="M0 600 C40 585 70 610 70 660 L70 760 L0 760 Z" fill="#62bd34" />

// // // // // //         {/* rocks */}
// // // // // //         <Rock x={62} y={800} s={0.95} />
// // // // // //         <Rock x={885} y={810} s={0.95} />

// // // // // //         {/* grass tufts + flowers */}
// // // // // //         <Tuft x={25} y={690} /><Tuft x={910} y={690} /><Tuft x={925} y={810} />
// // // // // //         <Tuft x={110} y={985} /><Tuft x={340} y={985} /><Tuft x={580} y={985} /><Tuft x={830} y={985} />
// // // // // //         <Tuft x={210} y={600} /><Tuft x={740} y={605} />
// // // // // //         <Flower x={75} y={600} s={0.9} />
// // // // // //         <Flower x={870} y={590} s={0.9} />
// // // // // //         <Flower x={885} y={690} s={0.85} />
// // // // // //         <Flower x={190} y={950} s={0.95} />
// // // // // //         <Flower x={745} y={940} s={0.95} />
// // // // // //       </Svg>
// // // // // //     </View>
// // // // // //   );
// // // // // // }

// // // // // // export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // // // // //   const { width, height } = useWindowDimensions();

// // // // // //   // ---------- scene geometry ----------
// // // // // //   const W = Math.min(width - 56, 340);
// // // // // //   const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 400));

// // // // // //   const pw = Math.round(W * 0.6);
// // // // // //   const ph = Math.round(H * 0.42); // height of the tallest water column
// // // // // //   const ry = poolRy(pw);
// // // // // //   const poolLeft = Math.round((W - pw) / 2);
// // // // // //   const poolTop = H - 8 - ph;
// // // // // //   const floorY = poolTop + ph - ry; // centre of the cylinder base

// // // // // //   const bw = Math.round(W * 0.46);
// // // // // //   const bh = Math.round(bw * 0.3);
// // // // // //   const boardLeft = W - bw;
// // // // // //   const boardTop = Math.round(H * 0.28);

// // // // // //   const gw = Math.round(W * 0.14);
// // // // // //   const gh = Math.round(gw * (88 / 48));
// // // // // //   const f = 0.22; // where on the board she stands (0 = tip, 1 = fixed end)
// // // // // //   const feetY = boardTop + (bh * (19 - 16 * f)) / 30;
// // // // // //   const girlLeft = Math.round(boardLeft + f * bw - gw / 2);
// // // // // //   const girlTop = Math.round(feetY - gh);
// // // // // //   const startCx = girlLeft + gw / 2;
// // // // // //   const startCy = girlTop + gh / 2;

// // // // // //   // y of the water surface (centre of the top ellipse) for a level
// // // // // //   const surfaceOf = (lvl: number) => floorY - ((ph - 2 * ry) * lvl) / 100;

// // // // // //   // ---------- state ----------
// // // // // //   const [phase, setPhase] = useState<Phase>('loading');
// // // // // //   const [sessionId, setSessionId] = useState<number | null>(null);
// // // // // //   const [question, setQuestion] = useState('She must do a dive jump successfully.');
// // // // // //   const [hints, setHints] = useState(0);
// // // // // //   const [hintLine, setHintLine] = useState<number | null>(null);
// // // // // //   const [level, setLevel] = useState(START_LEVEL);
// // // // // //   const [pose, setPose] = useState<GirlPose>('stand');
// // // // // //   const [msg, setMsg] = useState('');
// // // // // //   const [error, setError] = useState('');
// // // // // //   const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
// // // // // //   const [result, setResult] = useState<Level4Answer | null>(null);
// // // // // //   const [confirmSkip, setConfirmSkip] = useState(false);
// // // // // //   const [clueOpen, setClueOpen] = useState(false);
// // // // // //   const [clue2Shown, setClue2Shown] = useState(false);

// // // // // //   const gx = useRef(new Animated.Value(0)).current;
// // // // // //   const gy = useRef(new Animated.Value(0)).current;
// // // // // //   const grot = useRef(new Animated.Value(0)).current;
// // // // // //   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

// // // // // //   // refs so the gesture handler always sees the latest values
// // // // // //   const levelRef = useRef(level);
// // // // // //   levelRef.current = level;
// // // // // //   const phaseRef = useRef<Phase>(phase);
// // // // // //   phaseRef.current = phase;
// // // // // //   const phRef = useRef(ph);
// // // // // //   phRef.current = ph;
// // // // // //   const startLevelRef = useRef(START_LEVEL);

// // // // // //   const applyHints = useCallback(
// // // // // //     (h?: number) => {
// // // // // //       if (typeof h === 'number') {
// // // // // //         setHints(h);
// // // // // //         onHints?.(h);
// // // // // //       }
// // // // // //     },
// // // // // //     [onHints],
// // // // // //   );

// // // // // //   // ---------- open level: frontend -> backend -> DB session ----------
// // // // // //   const open = useCallback(async () => {
// // // // // //     setPhase('loading');
// // // // // //     setError('');
// // // // // //     try {
// // // // // //       const r = await startLevel4(playerId);
// // // // // //       setSessionId(r.sessionId);
// // // // // //       if (r.question) setQuestion(r.question);
// // // // // //       setHintLine(r.hintLevel ?? null);
// // // // // //       applyHints(r.hints);
// // // // // //       setPhase('idle');
// // // // // //     } catch (e: any) {
// // // // // //       setError(e?.message || 'Could not open the level.');
// // // // // //       setPhase('error');
// // // // // //     }
// // // // // //   }, [playerId, applyHints]);

// // // // // //   useEffect(() => {
// // // // // //     open();
// // // // // //   }, [open]);

// // // // // //   useEffect(() => () => {
// // // // // //     if (resetTimer.current) clearTimeout(resetTimer.current);
// // // // // //   }, []);

// // // // // //   // ---------- hand gesture: drag on the water to raise / lower it ----------
// // // // // //   const pan = useRef(
// // // // // //     PanResponder.create({
// // // // // //       onStartShouldSetPanResponder: () => phaseRef.current === 'idle',
// // // // // //       onMoveShouldSetPanResponder: () => phaseRef.current === 'idle',
// // // // // //       onPanResponderTerminationRequest: () => false,
// // // // // //       onPanResponderGrant: () => {
// // // // // //         startLevelRef.current = levelRef.current;
// // // // // //         setMsg('');
// // // // // //         setConfirmSkip(false);
// // // // // //       },
// // // // // //       onPanResponderMove: (_e, g) => {
// // // // // //         if (phaseRef.current !== 'idle') return;
// // // // // //         const next = startLevelRef.current - (g.dy / (phRef.current * 0.8)) * 100;
// // // // // //         setLevel(Math.max(0, Math.min(100, next)));
// // // // // //       },
// // // // // //     }),
// // // // // //   ).current;

// // // // // //   // ---------- dive (head first, like a real diver) + swim ----------
// // // // // //   const dive = (outcome: string, lvl: number) =>
// // // // // //     new Promise<void>((resolve) => {
// // // // // //       const surface = surfaceOf(lvl);
// // // // // //       const floorCy = floorY - gh / 2;
// // // // // //       const won = outcome === 'splash';
// // // // // //       const entryCy = Math.min(surface - gh / 2 + 4, floorCy); // hands touch the water
// // // // // //       const finalCy = won ? Math.min(surface + gh * 0.3, floorCy) : floorCy;
// // // // // //       const dx = W / 2 - startCx;
// // // // // //       const dyEntry = entryCy - startCy;
// // // // // //       const dyFinal = finalCy - startCy;

// // // // // //       setPose('dive');

// // // // // //       Animated.parallel([
// // // // // //         // forward travel
// // // // // //         Animated.timing(gx, { toValue: dx, duration: 760, easing: Easing.linear, useNativeDriver: false }),
// // // // // //         // up, then down to the water, then deeper
// // // // // //         Animated.sequence([
// // // // // //           Animated.timing(gy, { toValue: -34, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// // // // // //           Animated.timing(gy, { toValue: dyEntry, duration: 380, easing: Easing.in(Easing.quad), useNativeDriver: false }),
// // // // // //           Animated.timing(gy, { toValue: dyFinal, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// // // // // //         ]),
// // // // // //         // rotates forward, head first (counter-clockwise), ends pointing straight down
// // // // // //         Animated.timing(grot, { toValue: 1, duration: 760, delay: 80, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
// // // // // //       ]).start(() => {
// // // // // //         if (!won) {
// // // // // //           setTimeout(resolve, 600);
// // // // // //           return;
// // // // // //         }

// // // // // //         // she swims right, turns, swims left, then comes back to the middle
// // // // // //         const midY = (surface + floorY) / 2;
// // // // // //         const dyMid = midY - startCy;
// // // // // //         const amp = Math.max(20, pw / 2 - gh / 2 - 10);
// // // // // //         Animated.sequence([
// // // // // //           Animated.parallel([
// // // // // //             Animated.timing(grot, { toValue: 2, duration: 350, useNativeDriver: false }),
// // // // // //             Animated.timing(gy, { toValue: dyMid, duration: 350, useNativeDriver: false }),
// // // // // //             Animated.timing(gx, { toValue: dx + amp, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // // // // //           ]),
// // // // // //           Animated.parallel([
// // // // // //             Animated.timing(grot, { toValue: 3, duration: 400, useNativeDriver: false }),
// // // // // //             Animated.timing(gx, { toValue: dx - amp, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // // // // //           ]),
// // // // // //           Animated.timing(gx, { toValue: dx, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// // // // // //         ]).start(() => resolve());
// // // // // //       });

// // // // // //       // splash at the moment she enters the water
// // // // // //       setTimeout(() => {
// // // // // //         setSplash({ left: W / 2 - 28, top: surface - 30 });
// // // // // //         setTimeout(() => setSplash(null), 650);
// // // // // //       }, 690);
// // // // // //     });

// // // // // //   const resetScene = useCallback(() => {
// // // // // //     gx.setValue(0);
// // // // // //     gy.setValue(0);
// // // // // //     grot.setValue(0);
// // // // // //     setSplash(null);
// // // // // //     setPose('stand');
// // // // // //     setPhase('idle');
// // // // // //   }, [gx, gy, grot]);

// // // // // //   // ---------- JUMP: frontend -> backend -> MySQL -> JSON -> animate ----------
// // // // // //   const onJump = async () => {
// // // // // //     if (phase !== 'idle' || !sessionId) return;
// // // // // //     setMsg('');
// // // // // //     setConfirmSkip(false);
// // // // // //     setPhase('sending');
// // // // // //     const lvl = Math.round(level);
// // // // // //     try {
// // // // // //       const r = await jumpLevel4({ sessionId, playerId, waterLevel: lvl });
// // // // // //       setPhase('jumping');
// // // // // //       play('btn');
// // // // // //       await dive(r.outcome || 'hit_bottom', lvl);
// // // // // //       applyHints(r.hints);
// // // // // //       if (r.correct) {
// // // // // //         play('correct');
// // // // // //         setResult(r);
// // // // // //         setPhase('won');
// // // // // //       } else {
// // // // // //         play('wrong');
// // // // // //         setMsg('');
// // // // // //         setPhase('failed');
// // // // // //         resetTimer.current = setTimeout(resetScene, 1600);
// // // // // //       }
// // // // // //     } catch (e: any) {
// // // // // //       setMsg(e?.message || 'Could not reach the server.');
// // // // // //       setPhase('idle');
// // // // // //     }
// // // // // //   };

// // // // // //   // ---------- magnifier: show the water line (25 hints) ----------
// // // // // //   const onHint = async () => {
// // // // // //     if (phase !== 'idle' || !sessionId) return;
// // // // // //     setConfirmSkip(false);
// // // // // //     try {
// // // // // //       const r = await hintLevel4({ sessionId, playerId });
// // // // // //       setHintLine(r.hint?.level ?? null);
// // // // // //       setMsg('');
// // // // // //       setClue2Shown(false);
// // // // // //       play('clue');
// // // // // //       setClueOpen(true);
// // // // // //       applyHints(r.hints);
// // // // // //     } catch (e: any) {
// // // // // //       const m = String(e?.message || '');
// // // // // //       setMsg(/not enough/i.test(m) ? 'Not enough hints! Tap 🎬 for +75 hints.' : m || 'Could not get the hint.');
// // // // // //     }
// // // // // //   };

// // // // // //   // ---------- video reward (+75 hints) ----------
// // // // // //   const onReward = async () => {
// // // // // //     if (phase !== 'idle') return;
// // // // // //     setConfirmSkip(false);
// // // // // //     try {
// // // // // //       const r = await rewardLevel4(playerId);
// // // // // //       setMsg(`+${r.added} hints`);
// // // // // //       applyHints(r.hints);
// // // // // //     } catch (e: any) {
// // // // // //       setMsg(e?.message || 'Reward failed.');
// // // // // //     }
// // // // // //   };

// // // // // //   // ---------- skip (50 hints, tap twice) ----------
// // // // // //   const onSkip = async () => {
// // // // // //     if (phase !== 'idle' || !sessionId) return;
// // // // // //     if (!confirmSkip) {
// // // // // //       setConfirmSkip(true);
// // // // // //       setMsg('Skip costs 50 hints. Tap skip again to confirm.');
// // // // // //       return;
// // // // // //     }
// // // // // //     try {
// // // // // //       const r = await skipLevel4({ sessionId, playerId });
// // // // // //       applyHints(r.hints);
// // // // // //       onComplete(r);
// // // // // //     } catch (e: any) {
// // // // // //       setConfirmSkip(false);
// // // // // //       setMsg(e?.message || 'Could not skip.');
// // // // // //     }
// // // // // //   };

// // // // // //   const busy = phase !== 'idle';

// // // // // //   // ---------- shared header (home, settings, hanging sign, hints pill) ----------
// // // // // //   const header = (
// // // // // //     <View style={st.topBar}>
// // // // // //       <View style={st.leftBtns}>
// // // // // //         <TouchableOpacity
// // // // // //           style={st.woodBtn}
// // // // // //           activeOpacity={0.85}
// // // // // //           onPress={onExit}
// // // // // //           disabled={phase === 'jumping' || phase === 'sending'}
// // // // // //         >
// // // // // //           <Text style={st.woodBtnT}>🏠</Text>
// // // // // //         </TouchableOpacity>
// // // // // //         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
// // // // // //           <Text style={st.woodBtnT}>⚙️</Text>
// // // // // //         </TouchableOpacity>
// // // // // //       </View>

// // // // // //       <View style={st.signWrap}>
// // // // // //         <View style={[st.chain, { left: 22 }]} />
// // // // // //         <View style={[st.chain, { right: 22 }]} />
// // // // // //         <View style={st.sign}>
// // // // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // // // //           <Text style={st.signT}>LEVEL 4</Text>
// // // // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // // // //         </View>
// // // // // //       </View>

// // // // // //       <View style={st.pillWrap}>
// // // // // //         <View style={st.pill}>
// // // // // //           <Text style={st.pillT}>{hints}</Text>
// // // // // //         </View>
// // // // // //         <Text style={st.pillIcon}>💡</Text>
// // // // // //       </View>
// // // // // //     </View>
// // // // // //   );

// // // // // //   // ---------- loading / error ----------
// // // // // //   if (phase === 'loading' || phase === 'error') {
// // // // // //     return (
// // // // // //       <Stage bg={SKY}>
// // // // // //         <View style={st.root}>
// // // // // //           <Garden />
// // // // // //           {header}
// // // // // //           <View style={st.centerMsg}>
// // // // // //             {phase === 'loading' ? (
// // // // // //               <ActivityIndicator size="large" color="#fff" />
// // // // // //             ) : (
// // // // // //               <>
// // // // // //                 <Text style={st.errText}>Could not open the level.</Text>
// // // // // //                 <Text style={st.errDetail}>{error}</Text>
// // // // // //                 <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={open}>
// // // // // //                   <Text style={st.primaryT}>Retry</Text>
// // // // // //                 </TouchableOpacity>
// // // // // //                 <TouchableOpacity activeOpacity={0.85} onPress={onExit}>
// // // // // //                   <Text style={st.link}>Back</Text>
// // // // // //                 </TouchableOpacity>
// // // // // //               </>
// // // // // //             )}
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </Stage>
// // // // // //     );
// // // // // //   }

// // // // // //   const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'ns-resize' } : {};

// // // // // //   // ---------- game ----------
// // // // // //   return (
// // // // // //     <Stage bg={SKY}>
// // // // // //       <View style={st.root}>
// // // // // //         <Garden />

// // // // // //         {header}

// // // // // //         <View style={st.center}>
// // // // // //           {/* question pill */}
// // // // // //           <View style={st.qPill}>
// // // // // //             <Text style={st.qArrow}>{'<'}</Text>
// // // // // //             <Text style={st.question}>{question}</Text>
// // // // // //             <Text style={st.qArrow}>{'>'}</Text>
// // // // // //           </View>

// // // // // //           {/* scene (transparent: the garden is behind it) */}
// // // // // //           <View style={[st.scene, { width: W, height: H }]}>
// // // // // //             <View style={{ position: 'absolute', left: boardLeft, top: boardTop }}>
// // // // // //               <Board w={bw} h={bh} />
// // // // // //             </View>

// // // // // //             <View style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// // // // // //               <Pool w={pw} h={ph} level={level} hintLevel={hintLine} />
// // // // // //             </View>

// // // // // //             <Animated.View
// // // // // //               style={{
// // // // // //                 position: 'absolute',
// // // // // //                 left: girlLeft,
// // // // // //                 top: girlTop,
// // // // // //                 width: gw,
// // // // // //                 height: gh,
// // // // // //                 transform: [
// // // // // //                   { translateX: gx },
// // // // // //                   { translateY: gy },
// // // // // //                   {
// // // // // //                     rotate: grot.interpolate({
// // // // // //                       inputRange: [0, 1, 2, 3],
// // // // // //                       outputRange: ['0deg', '-180deg', '-270deg', '-90deg'],
// // // // // //                     }),
// // // // // //                   },
// // // // // //                 ],
// // // // // //               }}
// // // // // //             >
// // // // // //               <Girl w={gw} pose={pose} />
// // // // // //             </Animated.View>

// // // // // //             {/* water in front of her, so she looks like she is under the water */}
// // // // // //             <View pointerEvents="none" style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// // // // // //               <PoolWater w={pw} h={ph} level={level} />
// // // // // //             </View>

// // // // // //             {splash && (
// // // // // //               <View pointerEvents="none" style={{ position: 'absolute', left: splash.left, top: splash.top }}>
// // // // // //                 <Splash w={56} />
// // // // // //               </View>
// // // // // //             )}

// // // // // //             {/* gesture area over the water column */}
// // // // // //             <View
// // // // // //               {...pan.panHandlers}
// // // // // //               style={[
// // // // // //                 {
// // // // // //                   position: 'absolute',
// // // // // //                   left: poolLeft - 24,
// // // // // //                   top: poolTop - 40,
// // // // // //                   width: pw + 48,
// // // // // //                   height: ph + 56,
// // // // // //                 },
// // // // // //                 webTouch,
// // // // // //               ]}
// // // // // //             />
// // // // // //           </View>

// // // // // //           <TouchableOpacity
// // // // // //             style={[st.primary, busy && st.off]}
// // // // // //             disabled={busy}
// // // // // //             activeOpacity={0.85}
// // // // // //             onPress={onJump}
// // // // // //           >
// // // // // //             {phase === 'sending' ? <ActivityIndicator color={NAVY} /> : <Text style={st.primaryT}>JUMP</Text>}
// // // // // //           </TouchableOpacity>

// // // // // //           <Text style={st.msg}>{msg || ' '}</Text>
// // // // // //         </View>

// // // // // //         {/* bottom wooden panel */}
// // // // // //         <View style={st.panel}>
// // // // // //           <View style={[st.screw, { left: 14, top: 14 }]} />
// // // // // //           <View style={[st.screw, { right: 14, top: 14 }]} />
// // // // // //           <View style={[st.screw, { left: 14, bottom: 14 }]} />
// // // // // //           <View style={[st.screw, { right: 14, bottom: 14 }]} />

// // // // // //           <View style={st.btnCol}>
// // // // // //             <TouchableOpacity
// // // // // //               style={[st.ringGreen, busy && st.off]}
// // // // // //               activeOpacity={0.85}
// // // // // //               onPress={onHint}
// // // // // //               disabled={busy}
// // // // // //             >
// // // // // //               <View style={st.circleGreen}>
// // // // // //                 <Text style={st.btnIcon}>🔍</Text>
// // // // // //               </View>
// // // // // //             </TouchableOpacity>
// // // // // //             <View style={st.badge}>
// // // // // //               <Text style={st.badgeIcon}>💡</Text>
// // // // // //               <Text style={st.badgeT}>25</Text>
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           <View style={st.btnCol}>
// // // // // //             <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onReward} disabled={busy}>
// // // // // //               <Text style={st.btnIcon}>🎬</Text>
// // // // // //             </TouchableOpacity>
// // // // // //             <View style={st.badge}>
// // // // // //               <Text style={st.badgeIcon}>🪙</Text>
// // // // // //               <Text style={st.badgeT}>+75</Text>
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           <View style={st.btnCol}>
// // // // // //             <TouchableOpacity style={[st.ringWhite, busy && st.off]} activeOpacity={0.85} onPress={onSkip} disabled={busy}>
// // // // // //               <View style={st.circleRed}>
// // // // // //                 <Text style={st.skipIcon}>⏩</Text>
// // // // // //               </View>
// // // // // //             </TouchableOpacity>
// // // // // //             <View style={st.badge}>
// // // // // //               <Text style={st.badgeIcon}>💡</Text>
// // // // // //               <Text style={st.badgeT}>50</Text>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         {/* CLUES popup (only from the magnifier) */}
// // // // // //         {clueOpen && (
// // // // // //           <View style={st.overlay}>
// // // // // //             <View style={st.clueCard}>
// // // // // //               <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => setClueOpen(false)}>
// // // // // //                 <Text style={st.closeT}>✕</Text>
// // // // // //               </TouchableOpacity>
// // // // // //               <Text style={st.clueTitle}>CLUES</Text>

// // // // // //               <View style={[st.clueRow, st.clueRowOpen]}>
// // // // // //                 <View style={st.clueNum}>
// // // // // //                   <Text style={st.clueNumT}>1</Text>
// // // // // //                 </View>
// // // // // //                 <View style={{ flex: 1 }}>
// // // // // //                   <Text style={st.clueHead}>Clue 1</Text>
// // // // // //                   <Text style={st.clueBody}>{CLUE_1}</Text>
// // // // // //                 </View>
// // // // // //               </View>

// // // // // //               <TouchableOpacity
// // // // // //                 activeOpacity={0.9}
// // // // // //                 onPress={() => setClue2Shown(true)}
// // // // // //                 style={[st.clueRow, clue2Shown ? st.clueRowOpen : st.clueRowLocked]}
// // // // // //               >
// // // // // //                 <View style={st.clueNum}>
// // // // // //                   <Text style={st.clueNumT}>2</Text>
// // // // // //                 </View>
// // // // // //                 <View style={{ flex: 1 }}>
// // // // // //                   <Text style={st.clueHead}>Clue 2</Text>
// // // // // //                   <Text style={clue2Shown ? st.clueBody : st.clueTap}>{clue2Shown ? CLUE_2 : 'Tap to reveal'}</Text>
// // // // // //                 </View>
// // // // // //               </TouchableOpacity>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         )}

// // // // // //         {/* win card */}
// // // // // //         {phase === 'won' && result && (
// // // // // //           <View style={st.overlay}>
// // // // // //             <View style={st.card}>
// // // // // //               <Text style={st.cardTitle}>Perfect dive!</Text>
// // // // // //               <Text style={st.cardText}>She swam across the pool.</Text>
// // // // // //               <Text style={st.stars}>
// // // // // //                 {'★'.repeat(result.stars || 0)}
// // // // // //                 {'☆'.repeat(3 - (result.stars || 0))}
// // // // // //               </Text>
// // // // // //               <Text style={st.cardText}>Score: {result.score ?? 0}</Text>
// // // // // //               {result.progressSaved === false && <Text style={st.cardText}>Progress could not be saved.</Text>}
// // // // // //               <TouchableOpacity style={st.primary} activeOpacity={0.85} onPress={() => onComplete(result)}>
// // // // // //                 <Text style={st.primaryT}>Next level</Text>
// // // // // //               </TouchableOpacity>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         )}
// // // // // //       </View>
// // // // // //     </Stage>
// // // // // //   );
// // // // // // }

// // // // // // const st = StyleSheet.create({
// // // // // //   root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

// // // // // //   // top
// // // // // //   topBar: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'space-between',
// // // // // //     paddingHorizontal: 12,
// // // // // //     paddingTop: 14,
// // // // // //   },
// // // // // //   leftBtns: { flexDirection: 'row', gap: 8 },
// // // // // //   woodBtn: {
// // // // // //     width: 42,
// // // // // //     height: 42,
// // // // // //     borderRadius: 21,
// // // // // //     backgroundColor: WOOD,
// // // // // //     borderWidth: 3,
// // // // // //     borderColor: WOOD_D,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     elevation: 3,
// // // // // //   },
// // // // // //   woodBtnT: { fontSize: 18 },
// // // // // //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
// // // // // //   chain: {
// // // // // //     position: 'absolute',
// // // // // //     top: -4,
// // // // // //     width: 7,
// // // // // //     height: 20,
// // // // // //     borderRadius: 3,
// // // // // //     backgroundColor: '#8a8a8a',
// // // // // //     borderWidth: 1.5,
// // // // // //     borderColor: '#4d4d4d',
// // // // // //   },
// // // // // //   sign: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 8,
// // // // // //     paddingHorizontal: 16,
// // // // // //     height: 44,
// // // // // //     borderRadius: 6,
// // // // // //     backgroundColor: '#b8692a',
// // // // // //     borderWidth: 3,
// // // // // //     borderColor: WOOD_DD,
// // // // // //     elevation: 3,
// // // // // //   },
// // // // // //   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
// // // // // //   signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
// // // // // //   pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
// // // // // //   pill: {
// // // // // //     height: 34,
// // // // // //     borderRadius: 17,
// // // // // //     backgroundColor: CREAM,
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: '#e6c690',
// // // // // //     justifyContent: 'center',
// // // // // //     paddingLeft: 18,
// // // // // //     paddingRight: 30,
// // // // // //   },
// // // // // //   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
// // // // // //   pillIcon: { position: 'absolute', right: -2, top: -4, fontSize: 24 },

// // // // // //   // centre
// // // // // //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 128 },
// // // // // //   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
// // // // // //   qPill: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 10,
// // // // // //     backgroundColor: CREAM,
// // // // // //     borderRadius: 28,
// // // // // //     borderWidth: 3,
// // // // // //     borderColor: CREAM_BORDER,
// // // // // //     paddingVertical: 8,
// // // // // //     paddingHorizontal: 18,
// // // // // //     marginBottom: 10,
// // // // // //     maxWidth: 400,
// // // // // //     elevation: 3,
// // // // // //   },
// // // // // //   qArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: YELLOW_ARROW },
// // // // // //   question: { flexShrink: 1, fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: NAVY, textAlign: 'center' },
// // // // // //   scene: { backgroundColor: 'transparent' },

// // // // // //   primary: {
// // // // // //     marginTop: 12,
// // // // // //     minWidth: 180,
// // // // // //     height: 54,
// // // // // //     borderRadius: 27,
// // // // // //     backgroundColor: '#8fe62d',
// // // // // //     borderWidth: 4,
// // // // // //     borderColor: '#d6f58a',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     elevation: 4,
// // // // // //   },
// // // // // //   primaryT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },
// // // // // //   off: { opacity: 0.5 },
// // // // // //   msg: {
// // // // // //     fontFamily: FONT,
// // // // // //     fontSize: 15,
// // // // // //     fontStyle: 'italic',
// // // // // //     fontWeight: '800',
// // // // // //     color: '#fff',
// // // // // //     marginTop: 8,
// // // // // //     textAlign: 'center',
// // // // // //     minHeight: 20,
// // // // // //     paddingHorizontal: 12,
// // // // // //   },

// // // // // //   // bottom wooden panel
// // // // // //   panel: {
// // // // // //     position: 'absolute',
// // // // // //     left: 14,
// // // // // //     right: 14,
// // // // // //     bottom: 14,
// // // // // //     height: 118,
// // // // // //     borderRadius: 44,
// // // // // //     backgroundColor: WOOD,
// // // // // //     borderWidth: 6,
// // // // // //     borderColor: WOOD_D,
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'flex-start',
// // // // // //     justifyContent: 'space-around',
// // // // // //     paddingTop: 8,
// // // // // //     elevation: 6,
// // // // // //   },
// // // // // //   screw: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: WOOD_DD },
// // // // // //   btnCol: { alignItems: 'center' },
// // // // // //   ringGreen: {
// // // // // //     width: 64,
// // // // // //     height: 64,
// // // // // //     borderRadius: 32,
// // // // // //     backgroundColor: LIME_RING,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //   },
// // // // // //   circleGreen: {
// // // // // //     width: 54,
// // // // // //     height: 54,
// // // // // //     borderRadius: 27,
// // // // // //     backgroundColor: LIME,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //   },
// // // // // //   ringWhite: {
// // // // // //     width: 64,
// // // // // //     height: 64,
// // // // // //     borderRadius: 32,
// // // // // //     backgroundColor: '#f7ebd4',
// // // // // //     borderWidth: 3,
// // // // // //     borderColor: '#fbf3e3',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //   },
// // // // // //   circleRed: {
// // // // // //     width: 56,
// // // // // //     height: 56,
// // // // // //     borderRadius: 28,
// // // // // //     backgroundColor: RED,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //   },
// // // // // //   btnIcon: { fontSize: 26 },
// // // // // //   skipIcon: { fontSize: 22 },
// // // // // //   badge: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 3,
// // // // // //     marginTop: 5,
// // // // // //     paddingHorizontal: 12,
// // // // // //     height: 24,
// // // // // //     borderRadius: 12,
// // // // // //     backgroundColor: BADGE,
// // // // // //   },
// // // // // //   badgeIcon: { fontSize: 12 },
// // // // // //   badgeT: { fontFamily: FONT, fontSize: 14, fontWeight: '900', color: '#fff' },

// // // // // //   // error
// // // // // //   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
// // // // // //   errDetail: { fontFamily: FONT, fontSize: 14, color: '#fff', textAlign: 'center', marginTop: 6 },
// // // // // //   link: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },

// // // // // //   // clues popup
// // // // // //   clueCard: {
// // // // // //     width: '100%',
// // // // // //     maxWidth: 360,
// // // // // //     backgroundColor: CREAM,
// // // // // //     borderColor: WOOD_D,
// // // // // //     borderWidth: 6,
// // // // // //     borderRadius: 28,
// // // // // //     paddingHorizontal: 18,
// // // // // //     paddingTop: 18,
// // // // // //     paddingBottom: 22,
// // // // // //   },
// // // // // //   clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
// // // // // //   closeBtn: {
// // // // // //     position: 'absolute',
// // // // // //     top: -4,
// // // // // //     right: -4,
// // // // // //     width: 38,
// // // // // //     height: 38,
// // // // // //     borderRadius: 19,
// // // // // //     backgroundColor: WOOD,
// // // // // //     borderWidth: 3,
// // // // // //     borderColor: WOOD_D,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     zIndex: 2,
// // // // // //   },
// // // // // //   closeT: { fontSize: 18, fontWeight: '900', color: '#e5383b' },
// // // // // //   clueRow: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     gap: 14,
// // // // // //     borderRadius: 22,
// // // // // //     borderWidth: 2.5,
// // // // // //     paddingVertical: 14,
// // // // // //     paddingHorizontal: 14,
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   clueRowOpen: { backgroundColor: '#fff', borderColor: '#3ec45a' },
// // // // // //   clueRowLocked: { backgroundColor: '#f8e3ae', borderColor: '#f3b73a' },
// // // // // //   clueNum: {
// // // // // //     width: 52,
// // // // // //     height: 52,
// // // // // //     borderRadius: 26,
// // // // // //     backgroundColor: '#c0702b',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //   },
// // // // // //   clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
// // // // // //   clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#c0702b' },
// // // // // //   clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: NAVY, marginTop: 2 },
// // // // // //   clueTap: { fontFamily: FONT, fontSize: 15, fontWeight: '800', color: '#7a4a2a', marginTop: 2 },

// // // // // //   // win card
// // // // // //   overlay: {
// // // // // //     ...StyleSheet.absoluteFillObject,
// // // // // //     backgroundColor: 'rgba(10,25,60,0.5)',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     padding: 24,
// // // // // //   },
// // // // // //   card: {
// // // // // //     width: '100%',
// // // // // //     maxWidth: 340,
// // // // // //     backgroundColor: CREAM,
// // // // // //     borderColor: WOOD_D,
// // // // // //     borderWidth: 8,
// // // // // //     borderRadius: 28,
// // // // // //     padding: 22,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: NAVY, textAlign: 'center' },
// // // // // //   stars: { fontSize: 36, color: YELLOW_ARROW, marginTop: 8 },
// // // // // //   cardText: { fontFamily: FONT, fontSize: 17, color: NAVY, marginTop: 6, textAlign: 'center' },
// // // // // // });
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
// // // // // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // // // // import { Stage, F, Coin } from './BTShared';
// // // // // import { Icon } from './Art';
// // // // // import { Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
// // // // // import { play } from './BTSound';
// // // // // import {
// // // // //   Level4Answer,
// // // // //   hintLevel4,
// // // // //   jumpLevel4,
// // // // //   rewardLevel4,
// // // // //   skipLevel4,
// // // // //   startLevel4,
// // // // // } from './Btlevel4api';

// // // // // const FONT: any = F;
// // // // // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// // // // // /* garden palette (same as Level 3) */
// // // // // const NAVY = '#13235b';
// // // // // const SKY = '#5cc0f5';
// // // // // const CREAM = '#faf0e2';
// // // // // const CREAM_BORDER = '#ead2a4';
// // // // // const WOOD = '#eba24e';
// // // // // const WOOD_D = '#c2782c';
// // // // // const WOOD_DD = '#8f5a1f';
// // // // // const LIME = '#a4e02a';
// // // // // const LIME_RING = '#f4f1dc';
// // // // // const RED = '#f0434d';
// // // // // const YELLOW_ARROW = '#ffb629';
// // // // // const BADGE = '#6b4423';
// // // // // const YEL_BTN = '#fbc02d';
// // // // // const YEL_BTN_D = '#d98e1c';

// // // // // type Props = {
// // // // //   playerId: number;
// // // // //   onHints?: (hints: number) => void;
// // // // //   onExit: () => void;
// // // // //   onComplete: (result: any) => void;
// // // // // };

// // // // // type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// // // // // // the cylinder starts as a short column of water (like level 9)
// // // // // const START_LEVEL = 22;

// // // // // // clues shown in the CLUES popup when the magnifier is tapped
// // // // // const CLUE_1 = "Don't make her jump higher… make the water come closer!";
// // // // // const CLUE_2 = 'Drag the water up to the yellow line, then press JUMP.';

// // // // // /* ---------- garden background ---------- */
// // // // // function Flower({ x, y, s = 1 }: any) {
// // // // //   return (
// // // // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // // //       {[0, 72, 144, 216, 288].map((a) => (
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

// // // // // function Rock({ x, y, s = 1 }: any) {
// // // // //   return (
// // // // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // // //       <Ellipse cx="0" cy="0" rx="68" ry="40" fill="#9b9b9b" />
// // // // //       <Ellipse cx="-6" cy="-10" rx="50" ry="26" fill="#b4b4b4" />
// // // // //     </G>
// // // // //   );
// // // // // }

// // // // // /* sprout friend (same as Level 3), local coords: body at 0..120 x 55..133 */
// // // // // function Sprout({ x, y, s = 1 }: any) {
// // // // //   return (
// // // // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // // //       <G fill="#5cb85c">
// // // // //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
// // // // //         <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
// // // // //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
// // // // //       </G>
// // // // //       <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
// // // // //       <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// // // // //       <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// // // // //       <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
// // // // //       <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
// // // // //       <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// // // // //     </G>
// // // // //   );
// // // // // }

// // // // // function Garden() {
// // // // //   return (
// // // // //     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// // // // //       {/* top: sky, trees, clouds */}
// // // // //       <Svg
// // // // //         width="100%"
// // // // //         height="100%"
// // // // //         viewBox="0 0 942 760"
// // // // //         style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 760 }}
// // // // //       >
// // // // //         <Defs>
// // // // //           <LinearGradient id="g4sky" x1="0" y1="0" x2="0" y2="1">
// // // // //             <Stop offset="0" stopColor="#46b6f3" />
// // // // //             <Stop offset="1" stopColor="#c2e8fb" />
// // // // //           </LinearGradient>
// // // // //         </Defs>
// // // // //         <Rect width="942" height="760" fill="url(#g4sky)" />

// // // // //         {/* trees in the top corners */}
// // // // //         <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// // // // //         <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// // // // //         <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
// // // // //         <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />

// // // // //         {/* clouds */}
// // // // //         <Cloud x={850} y={245} s={1} />
// // // // //         <Cloud x={50} y={385} s={0.9} />
// // // // //         <Cloud x={400} y={525} s={1} />
// // // // //         <Cloud x={870} y={430} s={0.7} />
// // // // //         <Cloud x={75} y={745} s={0.8} />
// // // // //       </Svg>

// // // // //       {/* bottom: hills, fence, bookshelf, sprout, meadow, rocks, flowers */}
// // // // //       <Svg
// // // // //         width="100%"
// // // // //         height="100%"
// // // // //         viewBox="0 0 942 1000"
// // // // //         style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1000 }}
// // // // //       >
// // // // //         {/* rolling hills behind the fence */}
// // // // //         <Ellipse cx="150" cy="440" rx="300" ry="150" fill="#9ad95f" />
// // // // //         <Ellipse cx="640" cy="520" rx="420" ry="120" fill="#6cc13a" />
// // // // //         <Ellipse cx="900" cy="490" rx="200" ry="110" fill="#5fb832" />

// // // // //         {/* fence: pickets first, rails in front */}
// // // // //         {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
// // // // //           const x = -20 + i * 98;
// // // // //           return (
// // // // //             <G key={i}>
// // // // //               <Polygon points={`${x},400 ${x + 35},368 ${x + 70},400`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // // // //               <Rect x={x} y="400" width="70" height="150" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // // // //             </G>
// // // // //           );
// // // // //         })}
// // // // //         <Rect x="0" y="440" width="942" height="22" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
// // // // //         <Rect x="0" y="490" width="942" height="18" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

// // // // //         {/* bookshelf (right) */}
// // // // //         <Rect x="795" y="0" width="147" height="560" fill="#eaa24f" />
// // // // //         <Rect x="810" y="14" width="132" height="530" fill="#dc9d4f" />
// // // // //         <Rect x="795" y="160" width="147" height="14" fill="#f2b866" />
// // // // //         <Rect x="795" y="330" width="147" height="14" fill="#f2b866" />
// // // // //         <Rect x="795" y="545" width="147" height="14" fill="#f2b866" />
// // // // //         {/* row 1 */}
// // // // //         <Rect x="830" y="44" width="34" height="116" fill="#2a9d9d" />
// // // // //         <Rect x="868" y="24" width="32" height="136" fill="#f06ba8" />
// // // // //         <Rect x="904" y="48" width="38" height="112" fill="#8a63da" />
// // // // //         {/* row 2 */}
// // // // //         <Rect x="826" y="226" width="30" height="104" fill="#e5484d" />
// // // // //         <Rect x="860" y="204" width="24" height="126" fill="#3b82e0" />
// // // // //         <Rect x="888" y="224" width="36" height="106" fill="#4caf50" />
// // // // //         {/* row 3 */}
// // // // //         <Rect x="830" y="410" width="34" height="135" fill="#f5c518" />
// // // // //         <Rect x="868" y="380" width="40" height="165" fill="#2c6fdc" />

// // // // //         {/* sprout friend (left) */}
// // // // //         <Sprout x={10} y={470} s={1} />

// // // // //         {/* front meadow */}
// // // // //         <Path d="M0 560 C140 520 300 540 470 535 C650 528 800 515 942 520 L942 1000 L0 1000 Z" fill="#74d13c" />
// // // // //         <Ellipse cx="300" cy="610" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

// // // // //         {/* rocks */}
// // // // //         <Rock x={62} y={800} s={0.95} />
// // // // //         <Rock x={885} y={810} s={0.95} />

// // // // //         {/* grass tufts + flowers */}
// // // // //         <Tuft x={25} y={690} /><Tuft x={910} y={690} /><Tuft x={925} y={810} />
// // // // //         <Tuft x={110} y={985} /><Tuft x={340} y={985} /><Tuft x={580} y={985} /><Tuft x={830} y={985} />
// // // // //         <Tuft x={210} y={600} /><Tuft x={740} y={605} />
// // // // //         <Flower x={870} y={590} s={0.9} />
// // // // //         <Flower x={885} y={690} s={0.85} />
// // // // //         <Flower x={190} y={950} s={0.95} />
// // // // //         <Flower x={745} y={940} s={0.95} />
// // // // //       </Svg>
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // /* ---------- thin link chain for the hanging sign (same as Level 3) ---------- */
// // // // // function Chain({ h = 28, style }: { h?: number; style?: any }) {
// // // // //   const n = Math.max(2, Math.round(h / 8));
// // // // //   return (
// // // // //     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
// // // // //       {Array.from({ length: n }).map((_, i) => (
// // // // //         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// // // // //       ))}
// // // // //     </Svg>
// // // // //   );
// // // // // }

// // // // // /* ---------- double arrow (skip icon, same as Level 3) ---------- */
// // // // // function DoubleArrow({ s }: { s: number }) {
// // // // //   return (
// // // // //     <Svg width={s} height={s} viewBox="0 0 100 100">
// // // // //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // // // //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // // // //     </Svg>
// // // // //   );
// // // // // }

// // // // // export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // // // //   const { width, height } = useWindowDimensions();

// // // // //   // ---------- scene geometry ----------
// // // // //   const W = Math.min(width - 56, 340);
// // // // //   const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 420));

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
// // // // //   const [clueOpen, setClueOpen] = useState(false);
// // // // //   const [clue2Shown, setClue2Shown] = useState(false);

// // // // //   const gx = useRef(new Animated.Value(0)).current;
// // // // //   const gy = useRef(new Animated.Value(0)).current;
// // // // //   const grot = useRef(new Animated.Value(0)).current;
// // // // //   const sway = useRef(new Animated.Value(0)).current;
// // // // //   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

// // // // //   // refs so the gesture handler always sees the latest values
// // // // //   const levelRef = useRef(level);
// // // // //   levelRef.current = level;
// // // // //   const phaseRef = useRef<Phase>(phase);
// // // // //   phaseRef.current = phase;
// // // // //   const phRef = useRef(ph);
// // // // //   phRef.current = ph;
// // // // //   const startLevelRef = useRef(START_LEVEL);

// // // // //   // hanging sign sways gently (same as Level 3)
// // // // //   useEffect(() => {
// // // // //     const a = Animated.loop(
// // // // //       Animated.sequence([
// // // // //         Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // //         Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // //       ]),
// // // // //     );
// // // // //     a.start();
// // // // //     return () => a.stop();
// // // // //   }, [sway]);
// // // // //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

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
// // // // //       play('btn');
// // // // //       await dive(r.outcome || 'hit_bottom', lvl);
// // // // //       applyHints(r.hints);
// // // // //       if (r.correct) {
// // // // //         play('correct');
// // // // //         setResult(r);
// // // // //         setPhase('won');
// // // // //       } else {
// // // // //         play('wrong');
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
// // // // //       setMsg('');
// // // // //       setClue2Shown(false);
// // // // //       play('clue');
// // // // //       setClueOpen(true);
// // // // //       applyHints(r.hints);
// // // // //     } catch (e: any) {
// // // // //       const m = String(e?.message || '');
// // // // //       setMsg(/not enough/i.test(m) ? 'Not enough hints! Tap the video button for +75 hints.' : m || 'Could not get the hint.');
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

// // // // //   // ---------- shared header (home, settings, hanging sign, hints pill) ----------
// // // // //   const header = (
// // // // //     <View style={st.topBar}>
// // // // //       <View style={st.leftBtns}>
// // // // //         <TouchableOpacity
// // // // //           style={st.woodBtn}
// // // // //           activeOpacity={0.85}
// // // // //           onPress={onExit}
// // // // //           disabled={phase === 'jumping' || phase === 'sending'}
// // // // //         >
// // // // //           <Icon n="home" s={20} />
// // // // //         </TouchableOpacity>
// // // // //         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
// // // // //           <Icon n="gear" s={21} />
// // // // //         </TouchableOpacity>
// // // // //       </View>

// // // // //       <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
// // // // //         <Chain h={30} style={{ left: 24, top: -6 }} />
// // // // //         <Chain h={30} style={{ right: 24, top: -6 }} />
// // // // //         <View style={st.sign}>
// // // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // // //           <Text style={st.signT}>LEVEL 4</Text>
// // // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // // //         </View>
// // // // //       </Animated.View>

// // // // //       <View style={st.pillWrap}>
// // // // //         <View style={st.pill}>
// // // // //           <Text style={st.pillT}>{hints}</Text>
// // // // //         </View>
// // // // //         <View style={st.pillIcon}>
// // // // //           <Icon n="bulb" s={34} />
// // // // //         </View>
// // // // //       </View>
// // // // //     </View>
// // // // //   );

// // // // //   // ---------- loading / error ----------
// // // // //   if (phase === 'loading' || phase === 'error') {
// // // // //     return (
// // // // //       <Stage bg={SKY}>
// // // // //         <View style={st.root}>
// // // // //           <Garden />
// // // // //           {header}
// // // // //           <View style={st.centerMsg}>
// // // // //             {phase === 'loading' ? (
// // // // //               <ActivityIndicator size="large" color="#fff" />
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
// // // // //     <Stage bg={SKY}>
// // // // //       <View style={st.root}>
// // // // //         <Garden />

// // // // //         {header}

// // // // //         <View style={st.center}>
// // // // //           {/* question pill */}
// // // // //           <View style={st.qPill}>
// // // // //             <Text style={st.qArrow}>{'<'}</Text>
// // // // //             <Text style={st.question}>{question}</Text>
// // // // //             <Text style={st.qArrow}>{'>'}</Text>
// // // // //           </View>

// // // // //           {/* scene (transparent: the garden is behind it) */}
// // // // //           <View style={[st.scene, { width: W, height: H }]}>
// // // // //             <View style={{ position: 'absolute', left: boardLeft, top: boardTop }}>
// // // // //               <Board w={bw} h={bh} />
// // // // //             </View>

// // // // //             <View style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// // // // //               <Pool w={pw} h={ph} level={level} hintLevel={hintLine} />
// // // // //             </View>

// // // // //             <Animated.View
// // // // //               style={{
// // // // //                 position: 'absolute',
// // // // //                 left: girlLeft,
// // // // //                 top: girlTop,
// // // // //                 width: gw,
// // // // //                 height: gh,
// // // // //                 transform: [
// // // // //                   { translateX: gx },
// // // // //                   { translateY: gy },
// // // // //                   {
// // // // //                     rotate: grot.interpolate({
// // // // //                       inputRange: [0, 1, 2, 3],
// // // // //                       outputRange: ['0deg', '-180deg', '-270deg', '-90deg'],
// // // // //                     }),
// // // // //                   },
// // // // //                 ],
// // // // //               }}
// // // // //             >
// // // // //               <Girl w={gw} pose={pose} />
// // // // //             </Animated.View>

// // // // //             {/* water in front of her, so she looks like she is under the water */}
// // // // //             <View pointerEvents="none" style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// // // // //               <PoolWater w={pw} h={ph} level={level} />
// // // // //             </View>

// // // // //             {splash && (
// // // // //               <View pointerEvents="none" style={{ position: 'absolute', left: splash.left, top: splash.top }}>
// // // // //                 <Splash w={56} />
// // // // //               </View>
// // // // //             )}

// // // // //             {/* gesture area over the water column */}
// // // // //             <View
// // // // //               {...pan.panHandlers}
// // // // //               style={[
// // // // //                 {
// // // // //                   position: 'absolute',
// // // // //                   left: poolLeft - 24,
// // // // //                   top: poolTop - 40,
// // // // //                   width: pw + 48,
// // // // //                   height: ph + 56,
// // // // //                 },
// // // // //                 webTouch,
// // // // //               ]}
// // // // //             />
// // // // //           </View>

// // // // //           <TouchableOpacity
// // // // //             style={[st.primary, busy && st.off]}
// // // // //             disabled={busy}
// // // // //             activeOpacity={0.85}
// // // // //             onPress={onJump}
// // // // //           >
// // // // //             {phase === 'sending' ? <ActivityIndicator color={NAVY} /> : <Text style={st.primaryT}>JUMP</Text>}
// // // // //           </TouchableOpacity>

// // // // //           <Text style={st.msg}>{msg || ' '}</Text>
// // // // //         </View>

// // // // //         {/* bottom wooden panel (same as Level 3) */}
// // // // //         <View style={st.panel}>
// // // // //           <View style={[st.plank, { top: 18, left: 34, right: 34 }]} />
// // // // //           <View style={[st.plank, { top: 76, left: 26, right: 26 }]} />
// // // // //           <View style={[st.plank, { bottom: 16, left: 34, right: 34 }]} />
// // // // //           <View style={[st.screw, { left: 16, top: 16 }]} />
// // // // //           <View style={[st.screw, { right: 16, top: 16 }]} />
// // // // //           <View style={[st.screw, { left: 16, bottom: 16 }]} />
// // // // //           <View style={[st.screw, { right: 16, bottom: 16 }]} />

// // // // //           <View style={st.btnCol}>
// // // // //             <TouchableOpacity
// // // // //               style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }, busy && st.off]}
// // // // //               activeOpacity={0.85}
// // // // //               onPress={onHint}
// // // // //               disabled={busy}
// // // // //             >
// // // // //               <Icon n="search" s={40} />
// // // // //             </TouchableOpacity>
// // // // //             <View style={st.badge}>
// // // // //               <Icon n="bulb" s={19} />
// // // // //               <Text style={st.badgeT}>25</Text>
// // // // //             </View>
// // // // //           </View>

// // // // //           <View style={st.btnCol}>
// // // // //             <TouchableOpacity
// // // // //               style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }, busy && st.off]}
// // // // //               activeOpacity={0.85}
// // // // //               onPress={onReward}
// // // // //               disabled={busy}
// // // // //             >
// // // // //               <Icon n="film" s={46} />
// // // // //             </TouchableOpacity>
// // // // //             <View style={st.badge}>
// // // // //               <Coin s={15} />
// // // // //               <Text style={st.badgeT}>+75</Text>
// // // // //             </View>
// // // // //           </View>

// // // // //           <View style={st.btnCol}>
// // // // //             <TouchableOpacity
// // // // //               style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }, busy && st.off]}
// // // // //               activeOpacity={0.85}
// // // // //               onPress={onSkip}
// // // // //               disabled={busy}
// // // // //             >
// // // // //               <DoubleArrow s={42} />
// // // // //             </TouchableOpacity>
// // // // //             <View style={st.badge}>
// // // // //               <Icon n="bulb" s={19} />
// // // // //               <Text style={st.badgeT}>50</Text>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* CLUES popup (only from the magnifier) */}
// // // // //         {clueOpen && (
// // // // //           <View style={st.overlay}>
// // // // //             <View style={st.clueCard}>
// // // // //               <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => setClueOpen(false)}>
// // // // //                 <Icon n="cross" s={20} />
// // // // //               </TouchableOpacity>
// // // // //               <Text style={st.clueTitle}>CLUES</Text>

// // // // //               <View style={[st.clueRow, st.clueRowOpen]}>
// // // // //                 <View style={st.clueNum}>
// // // // //                   <Text style={st.clueNumT}>1</Text>
// // // // //                 </View>
// // // // //                 <View style={{ flex: 1 }}>
// // // // //                   <Text style={st.clueHead}>Clue 1</Text>
// // // // //                   <Text style={st.clueBody}>{CLUE_1}</Text>
// // // // //                 </View>
// // // // //               </View>

// // // // //               <TouchableOpacity
// // // // //                 activeOpacity={0.9}
// // // // //                 onPress={() => setClue2Shown(true)}
// // // // //                 style={[st.clueRow, clue2Shown ? st.clueRowOpen : st.clueRowLocked]}
// // // // //               >
// // // // //                 <View style={st.clueNum}>
// // // // //                   <Text style={st.clueNumT}>2</Text>
// // // // //                 </View>
// // // // //                 <View style={{ flex: 1 }}>
// // // // //                   <Text style={st.clueHead}>Clue 2</Text>
// // // // //                   <Text style={clue2Shown ? st.clueBody : st.clueTap}>{clue2Shown ? CLUE_2 : 'Tap to reveal'}</Text>
// // // // //                 </View>
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </View>
// // // // //         )}

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
// // // // //   root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

// // // // //   // top
// // // // //   topBar: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingHorizontal: 12,
// // // // //     paddingTop: 14,
// // // // //   },
// // // // //   leftBtns: { flexDirection: 'row', gap: 8 },
// // // // //   woodBtn: {
// // // // //     width: 40,
// // // // //     height: 40,
// // // // //     borderRadius: 20,
// // // // //     backgroundColor: YEL_BTN,
// // // // //     borderWidth: 2.5,
// // // // //     borderColor: YEL_BTN_D,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     elevation: 3,
// // // // //   },
// // // // //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
// // // // //   sign: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 8,
// // // // //     paddingHorizontal: 16,
// // // // //     height: 44,
// // // // //     borderRadius: 6,
// // // // //     backgroundColor: '#bd6b29',
// // // // //     borderWidth: 3,
// // // // //     borderColor: WOOD_DD,
// // // // //     elevation: 3,
// // // // //   },
// // // // //   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
// // // // //   signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
// // // // //   pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
// // // // //   pill: {
// // // // //     height: 32,
// // // // //     borderRadius: 16,
// // // // //     backgroundColor: CREAM,
// // // // //     borderWidth: 1.5,
// // // // //     borderStyle: 'dashed',
// // // // //     borderColor: '#d8c8a8',
// // // // //     justifyContent: 'center',
// // // // //     paddingLeft: 18,
// // // // //     paddingRight: 30,
// // // // //     elevation: 3,
// // // // //   },
// // // // //   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
// // // // //   pillIcon: { position: 'absolute', right: -6, top: -4 },

// // // // //   // centre
// // // // //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 170 },
// // // // //   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
// // // // //   qPill: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 10,
// // // // //     backgroundColor: CREAM,
// // // // //     borderRadius: 32,
// // // // //     borderWidth: 2.5,
// // // // //     borderColor: CREAM_BORDER,
// // // // //     paddingVertical: 10,
// // // // //     paddingHorizontal: 18,
// // // // //     marginBottom: 10,
// // // // //     maxWidth: 400,
// // // // //     elevation: 3,
// // // // //   },
// // // // //   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: YELLOW_ARROW },
// // // // //   question: { flexShrink: 1, fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },
// // // // //   scene: { backgroundColor: 'transparent' },

// // // // //   primary: {
// // // // //     marginTop: 12,
// // // // //     minWidth: 180,
// // // // //     height: 54,
// // // // //     borderRadius: 27,
// // // // //     backgroundColor: '#8fe62d',
// // // // //     borderWidth: 4,
// // // // //     borderColor: '#d6f58a',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     elevation: 4,
// // // // //   },
// // // // //   primaryT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },
// // // // //   off: { opacity: 0.5 },
// // // // //   msg: {
// // // // //     fontFamily: FONT,
// // // // //     fontSize: 15,
// // // // //     fontStyle: 'italic',
// // // // //     fontWeight: '800',
// // // // //     color: '#fff',
// // // // //     marginTop: 8,
// // // // //     textAlign: 'center',
// // // // //     minHeight: 20,
// // // // //     paddingHorizontal: 12,
// // // // //   },

// // // // //   // bottom wooden panel (solid wood, plank lines, corner rivets)
// // // // //   panel: {
// // // // //     position: 'absolute',
// // // // //     left: 14,
// // // // //     right: 14,
// // // // //     bottom: 18,
// // // // //     height: 148,
// // // // //     borderRadius: 46,
// // // // //     backgroundColor: WOOD,
// // // // //     borderWidth: 6,
// // // // //     borderColor: WOOD_D,
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'flex-start',
// // // // //     justifyContent: 'space-around',
// // // // //     paddingTop: 20,
// // // // //     elevation: 6,
// // // // //   },
// // // // //   plank: { position: 'absolute', height: 2.5, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
// // // // //   screw: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: WOOD_DD },
// // // // //   btnCol: { alignItems: 'center' },
// // // // //   circleBtn: {
// // // // //     width: 80,
// // // // //     height: 80,
// // // // //     borderRadius: 40,
// // // // //     borderWidth: 7,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     elevation: 6,
// // // // //   },
// // // // //   badge: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     gap: 4,
// // // // //     marginTop: 8,
// // // // //     minWidth: 76,
// // // // //     paddingHorizontal: 12,
// // // // //     height: 32,
// // // // //     borderRadius: 16,
// // // // //     backgroundColor: BADGE,
// // // // //   },
// // // // //   badgeT: { fontFamily: FONT, fontSize: 17, fontWeight: '900', color: '#fff' },

// // // // //   // error
// // // // //   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
// // // // //   errDetail: { fontFamily: FONT, fontSize: 14, color: '#fff', textAlign: 'center', marginTop: 6 },
// // // // //   link: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },

// // // // //   // clues popup
// // // // //   clueCard: {
// // // // //     width: '100%',
// // // // //     maxWidth: 360,
// // // // //     backgroundColor: CREAM,
// // // // //     borderColor: WOOD_D,
// // // // //     borderWidth: 6,
// // // // //     borderRadius: 28,
// // // // //     paddingHorizontal: 18,
// // // // //     paddingTop: 18,
// // // // //     paddingBottom: 22,
// // // // //   },
// // // // //   clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
// // // // //   closeBtn: {
// // // // //     position: 'absolute',
// // // // //     top: -4,
// // // // //     right: -4,
// // // // //     width: 38,
// // // // //     height: 38,
// // // // //     borderRadius: 19,
// // // // //     backgroundColor: WOOD,
// // // // //     borderWidth: 3,
// // // // //     borderColor: WOOD_D,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     zIndex: 2,
// // // // //   },
// // // // //   clueRow: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 14,
// // // // //     borderRadius: 22,
// // // // //     borderWidth: 2.5,
// // // // //     paddingVertical: 14,
// // // // //     paddingHorizontal: 14,
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   clueRowOpen: { backgroundColor: '#fff', borderColor: '#3ec45a' },
// // // // //   clueRowLocked: { backgroundColor: '#f8e3ae', borderColor: '#f3b73a' },
// // // // //   clueNum: {
// // // // //     width: 52,
// // // // //     height: 52,
// // // // //     borderRadius: 26,
// // // // //     backgroundColor: '#bd6b29',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
// // // // //   clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
// // // // //   clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },
// // // // //   clueTap: { fontFamily: FONT, fontSize: 15, fontWeight: '800', color: '#7a4a2a', marginTop: 2 },

// // // // //   // win card
// // // // //   overlay: {
// // // // //     ...StyleSheet.absoluteFillObject,
// // // // //     backgroundColor: 'rgba(10,25,60,0.5)',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     padding: 24,
// // // // //   },
// // // // //   card: {
// // // // //     width: '100%',
// // // // //     maxWidth: 340,
// // // // //     backgroundColor: CREAM,
// // // // //     borderColor: WOOD_D,
// // // // //     borderWidth: 8,
// // // // //     borderRadius: 28,
// // // // //     padding: 22,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: NAVY, textAlign: 'center' },
// // // // //   stars: { fontSize: 36, color: YELLOW_ARROW, marginTop: 8 },
// // // // //   cardText: { fontFamily: FONT, fontSize: 17, color: NAVY, marginTop: 6, textAlign: 'center' },
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
// // // // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // // // import { Stage, F, Coin } from './BTShared';
// // // // import { Icon } from './Art';
// // // // import { Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
// // // // import { play } from './BTSound';
// // // // import {
// // // //   Level4Answer,
// // // //   hintLevel4,
// // // //   jumpLevel4,
// // // //   rewardLevel4,
// // // //   skipLevel4,
// // // //   startLevel4,
// // // // } from './Btlevel4api';

// // // // const FONT: any = F;
// // // // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// // // // /* garden palette (same as Level 3) */
// // // // const NAVY = '#13235b';
// // // // const SKY = '#5cc0f5';
// // // // const CREAM = '#faf0e2';
// // // // const CREAM_BORDER = '#ead2a4';
// // // // const WOOD = '#eba24e';
// // // // const WOOD_D = '#c2782c';
// // // // const WOOD_DD = '#8f5a1f';
// // // // const LIME = '#a4e02a';
// // // // const LIME_RING = '#f4f1dc';
// // // // const RED = '#f0434d';
// // // // const YELLOW_ARROW = '#ffb629';
// // // // const BADGE = '#6b4423';
// // // // const YEL_BTN = '#fbc02d';
// // // // const YEL_BTN_D = '#d98e1c';

// // // // type Props = {
// // // //   playerId: number;
// // // //   onHints?: (hints: number) => void;
// // // //   onExit: () => void;
// // // //   onComplete: (result: any) => void;
// // // // };

// // // // type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// // // // // the cylinder starts as a short column of water (like level 9)
// // // // const START_LEVEL = 22;

// // // // // clues shown in the CLUES popup when the magnifier is tapped
// // // // const CLUE_1 = "Don't make her jump higher… make the water come closer!";
// // // // const CLUE_2 = 'Drag the water up to the yellow line, then press JUMP.';

// // // // /* ---------- garden background ---------- */
// // // // function Flower({ x, y, s = 1 }: any) {
// // // //   return (
// // // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // //       {[0, 72, 144, 216, 288].map((a) => (
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

// // // // /* sprout friend (same as Level 3), local coords: body at 0..120 x 55..133 */
// // // // function Sprout({ x, y, s = 1 }: any) {
// // // //   return (
// // // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // //       <G fill="#5cb85c">
// // // //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
// // // //         <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
// // // //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
// // // //       </G>
// // // //       <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
// // // //       <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// // // //       <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// // // //       <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
// // // //       <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
// // // //       <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// // // //     </G>
// // // //   );
// // // // }

// // // // function Garden() {
// // // //   return (
// // // //     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// // // //       {/* full-height sky (stretches to any screen, so no plain blue strip anywhere) */}
// // // //       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
// // // //         <Defs>
// // // //           <LinearGradient id="g4sky" x1="0" y1="0" x2="0" y2="1">
// // // //             <Stop offset="0" stopColor="#46b6f3" />
// // // //             <Stop offset="1" stopColor="#c2e8fb" />
// // // //           </LinearGradient>
// // // //         </Defs>
// // // //         <Rect width="10" height="10" fill="url(#g4sky)" />
// // // //       </Svg>

// // // //       {/* trees + cloud, pinned to the top */}
// // // //       <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
// // // //         <Svg width="100%" height="100%" viewBox="0 0 942 330">
// // // //           <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// // // //           <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// // // //           <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
// // // //           <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
// // // //           <Cloud x={850} y={245} s={1} />
// // // //         </Svg>
// // // //       </View>

// // // //       {/* ground (Level 3 scene), pinned to the bottom: hills, fence, bookshelf, sprout, meadow to the very edge */}
// // // //       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
// // // //         <Svg width="100%" height="100%" viewBox="0 0 942 1269">
// // // //           {/* clouds */}
// // // //           <Cloud x={50} y={585} s={0.9} />
// // // //           <Cloud x={880} y={600} s={0.6} />

// // // //           {/* rolling hills */}
// // // //           <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
// // // //           <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
// // // //           <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

// // // //           {/* fence: pickets first, rails in front */}
// // // //           {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
// // // //             const x = -10 + i * 90;
// // // //             return (
// // // //               <G key={i}>
// // // //                 <Polygon points={`${x},730 ${x + 33},698 ${x + 66},730`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // // //                 <Rect x={x} y="730" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // // //               </G>
// // // //             );
// // // //           })}
// // // //           <Rect x="0" y="760" width="942" height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
// // // //           <Rect x="0" y="808" width="942" height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

// // // //           {/* bookshelf (right) with potted plant */}
// // // //           <G>
// // // //             <Rect x="845" y="190" width="80" height="18" rx="4" fill="#e8903a" />
// // // //             <Polygon points="852,208 918,208 910,250 860,250" fill="#f0a050" />
// // // //             <G fill="#4cb04a">
// // // //               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(-28 885 198)" />
// // // //               <Ellipse cx="885" cy="140" rx="20" ry="62" fill="#3a9a3c" />
// // // //               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(28 885 198)" />
// // // //             </G>
// // // //             <Rect x="780" y="250" width="162" height="575" fill="#eaa24f" />
// // // //             <Rect x="796" y="266" width="146" height="545" fill="#dc9d4f" />
// // // //             <Rect x="780" y="440" width="162" height="16" fill="#f2b866" />
// // // //             <Rect x="780" y="630" width="162" height="16" fill="#f2b866" />
// // // //             <Rect x="780" y="250" width="162" height="16" fill="#f2b866" />
// // // //             <Rect x="810" y="310" width="36" height="130" fill="#2a9d9d" />
// // // //             <Rect x="850" y="290" width="34" height="150" fill="#f06ba8" />
// // // //             <Rect x="888" y="315" width="40" height="125" fill="#8a63da" />
// // // //             <Rect x="805" y="515" width="30" height="115" fill="#e5484d" />
// // // //             <Rect x="840" y="490" width="24" height="140" fill="#3b82e0" />
// // // //             <Rect x="868" y="510" width="38" height="120" fill="#4caf50" />
// // // //             <Rect x="810" y="695" width="34" height="120" fill="#f5c518" />
// // // //             <Rect x="848" y="665" width="40" height="150" fill="#2c6fdc" />
// // // //           </G>

// // // //           {/* sprout friend (left) */}
// // // //           <Sprout x={10} y={740} s={1} />

// // // //           {/* front meadow, runs to the bottom edge */}
// // // //           <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
// // // //           <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

// // // //           {/* stones */}
// // // //           <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// // // //           <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
// // // //           <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// // // //           <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

// // // //           {/* grass tufts + flowers */}
// // // //           <Tuft x="905" y="925" /><Tuft x="910" y="1050" /><Tuft x="20" y="1040" />
// // // //           <Tuft x="100" y="1260" /><Tuft x="340" y="1260" /><Tuft x="580" y="1260" /><Tuft x="820" y="1260" />
// // // //           <Flower x="885" y="815" s={0.8} />
// // // //           <Flower x="200" y="1225" s={0.95} />
// // // //           <Flower x="735" y="1225" s={0.95} />
// // // //         </Svg>
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // }

// // // // /* ---------- thin link chain for the hanging sign (same as Level 3) ---------- */
// // // // function Chain({ h = 28, style }: { h?: number; style?: any }) {
// // // //   const n = Math.max(2, Math.round(h / 8));
// // // //   return (
// // // //     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
// // // //       {Array.from({ length: n }).map((_, i) => (
// // // //         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// // // //       ))}
// // // //     </Svg>
// // // //   );
// // // // }

// // // // /* ---------- double arrow (skip icon, same as Level 3) ---------- */
// // // // function DoubleArrow({ s }: { s: number }) {
// // // //   return (
// // // //     <Svg width={s} height={s} viewBox="0 0 100 100">
// // // //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // // //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // // //     </Svg>
// // // //   );
// // // // }

// // // // export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // // //   const { width, height } = useWindowDimensions();

// // // //   // ---------- scene geometry ----------
// // // //   const W = Math.min(width - 56, 340);
// // // //   const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 420));

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
// // // //   const [clueOpen, setClueOpen] = useState(false);
// // // //   const [clue2Shown, setClue2Shown] = useState(false);

// // // //   const gx = useRef(new Animated.Value(0)).current;
// // // //   const gy = useRef(new Animated.Value(0)).current;
// // // //   const grot = useRef(new Animated.Value(0)).current;
// // // //   const sway = useRef(new Animated.Value(0)).current;
// // // //   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

// // // //   // refs so the gesture handler always sees the latest values
// // // //   const levelRef = useRef(level);
// // // //   levelRef.current = level;
// // // //   const phaseRef = useRef<Phase>(phase);
// // // //   phaseRef.current = phase;
// // // //   const phRef = useRef(ph);
// // // //   phRef.current = ph;
// // // //   const startLevelRef = useRef(START_LEVEL);

// // // //   // hanging sign sways gently (same as Level 3)
// // // //   useEffect(() => {
// // // //     const a = Animated.loop(
// // // //       Animated.sequence([
// // // //         Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // //         Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // //       ]),
// // // //     );
// // // //     a.start();
// // // //     return () => a.stop();
// // // //   }, [sway]);
// // // //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

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
// // // //       play('btn');
// // // //       await dive(r.outcome || 'hit_bottom', lvl);
// // // //       applyHints(r.hints);
// // // //       if (r.correct) {
// // // //         play('correct');
// // // //         setResult(r);
// // // //         setPhase('won');
// // // //       } else {
// // // //         play('wrong');
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
// // // //       setMsg('');
// // // //       setClue2Shown(false);
// // // //       play('clue');
// // // //       setClueOpen(true);
// // // //       applyHints(r.hints);
// // // //     } catch (e: any) {
// // // //       const m = String(e?.message || '');
// // // //       setMsg(/not enough/i.test(m) ? 'Not enough hints! Tap the video button for +75 hints.' : m || 'Could not get the hint.');
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

// // // //   // ---------- shared header (home, settings, hanging sign, hints pill) ----------
// // // //   const header = (
// // // //     <View style={st.topBar}>
// // // //       <View style={st.leftBtns}>
// // // //         <TouchableOpacity
// // // //           style={st.woodBtn}
// // // //           activeOpacity={0.85}
// // // //           onPress={onExit}
// // // //           disabled={phase === 'jumping' || phase === 'sending'}
// // // //         >
// // // //           <Icon n="home" s={20} />
// // // //         </TouchableOpacity>
// // // //         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
// // // //           <Icon n="gear" s={21} />
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
// // // //         <Chain h={30} style={{ left: 24, top: -6 }} />
// // // //         <Chain h={30} style={{ right: 24, top: -6 }} />
// // // //         <View style={st.sign}>
// // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // //           <Text style={st.signT}>LEVEL 4</Text>
// // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // //         </View>
// // // //       </Animated.View>

// // // //       <View style={st.pillWrap}>
// // // //         <View style={st.pill}>
// // // //           <Text style={st.pillT}>{hints}</Text>
// // // //         </View>
// // // //         <View style={st.pillIcon}>
// // // //           <Icon n="bulb" s={34} />
// // // //         </View>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   // ---------- loading / error ----------
// // // //   if (phase === 'loading' || phase === 'error') {
// // // //     return (
// // // //       <Stage bg={SKY}>
// // // //         <View style={st.root}>
// // // //           <Garden />
// // // //           {header}
// // // //           <View style={st.centerMsg}>
// // // //             {phase === 'loading' ? (
// // // //               <ActivityIndicator size="large" color="#fff" />
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
// // // //     <Stage bg={SKY}>
// // // //       <View style={st.root}>
// // // //         <Garden />

// // // //         {header}

// // // //         <View style={st.center}>
// // // //           {/* question pill */}
// // // //           <View style={st.qPill}>
// // // //             <Text style={st.qArrow}>{'<'}</Text>
// // // //             <Text style={st.question}>{question}</Text>
// // // //             <Text style={st.qArrow}>{'>'}</Text>
// // // //           </View>

// // // //           {/* scene (transparent: the garden is behind it) */}
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
// // // //             {phase === 'sending' ? <ActivityIndicator color={NAVY} /> : <Text style={st.primaryT}>JUMP</Text>}
// // // //           </TouchableOpacity>

// // // //           <Text style={st.msg}>{msg || ' '}</Text>
// // // //         </View>

// // // //         {/* bottom wooden panel (same as Level 3) */}
// // // //         <View style={st.panel}>
// // // //           <View style={[st.plank, { top: 18, left: 34, right: 34 }]} />
// // // //           <View style={[st.plank, { top: 76, left: 26, right: 26 }]} />
// // // //           <View style={[st.plank, { bottom: 16, left: 34, right: 34 }]} />
// // // //           <View style={[st.screw, { left: 16, top: 16 }]} />
// // // //           <View style={[st.screw, { right: 16, top: 16 }]} />
// // // //           <View style={[st.screw, { left: 16, bottom: 16 }]} />
// // // //           <View style={[st.screw, { right: 16, bottom: 16 }]} />

// // // //           <View style={st.btnCol}>
// // // //             <TouchableOpacity
// // // //               style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }, busy && st.off]}
// // // //               activeOpacity={0.85}
// // // //               onPress={onHint}
// // // //               disabled={busy}
// // // //             >
// // // //               <Icon n="search" s={40} />
// // // //             </TouchableOpacity>
// // // //             <View style={st.badge}>
// // // //               <Icon n="bulb" s={19} />
// // // //               <Text style={st.badgeT}>25</Text>
// // // //             </View>
// // // //           </View>

// // // //           <View style={st.btnCol}>
// // // //             <TouchableOpacity
// // // //               style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }, busy && st.off]}
// // // //               activeOpacity={0.85}
// // // //               onPress={onReward}
// // // //               disabled={busy}
// // // //             >
// // // //               <Icon n="film" s={46} />
// // // //             </TouchableOpacity>
// // // //             <View style={st.badge}>
// // // //               <Coin s={15} />
// // // //               <Text style={st.badgeT}>+75</Text>
// // // //             </View>
// // // //           </View>

// // // //           <View style={st.btnCol}>
// // // //             <TouchableOpacity
// // // //               style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }, busy && st.off]}
// // // //               activeOpacity={0.85}
// // // //               onPress={onSkip}
// // // //               disabled={busy}
// // // //             >
// // // //               <DoubleArrow s={42} />
// // // //             </TouchableOpacity>
// // // //             <View style={st.badge}>
// // // //               <Icon n="bulb" s={19} />
// // // //               <Text style={st.badgeT}>50</Text>
// // // //             </View>
// // // //           </View>
// // // //         </View>

// // // //         {/* CLUES popup (only from the magnifier) */}
// // // //         {clueOpen && (
// // // //           <View style={st.overlay}>
// // // //             <View style={st.clueCard}>
// // // //               <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => setClueOpen(false)}>
// // // //                 <Icon n="cross" s={20} />
// // // //               </TouchableOpacity>
// // // //               <Text style={st.clueTitle}>CLUES</Text>

// // // //               <View style={[st.clueRow, st.clueRowOpen]}>
// // // //                 <View style={st.clueNum}>
// // // //                   <Text style={st.clueNumT}>1</Text>
// // // //                 </View>
// // // //                 <View style={{ flex: 1 }}>
// // // //                   <Text style={st.clueHead}>Clue 1</Text>
// // // //                   <Text style={st.clueBody}>{CLUE_1}</Text>
// // // //                 </View>
// // // //               </View>

// // // //               <TouchableOpacity
// // // //                 activeOpacity={0.9}
// // // //                 onPress={() => setClue2Shown(true)}
// // // //                 style={[st.clueRow, clue2Shown ? st.clueRowOpen : st.clueRowLocked]}
// // // //               >
// // // //                 <View style={st.clueNum}>
// // // //                   <Text style={st.clueNumT}>2</Text>
// // // //                 </View>
// // // //                 <View style={{ flex: 1 }}>
// // // //                   <Text style={st.clueHead}>Clue 2</Text>
// // // //                   <Text style={clue2Shown ? st.clueBody : st.clueTap}>{clue2Shown ? CLUE_2 : 'Tap to reveal'}</Text>
// // // //                 </View>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </View>
// // // //         )}

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
// // // //   root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

// // // //   // top
// // // //   topBar: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     paddingHorizontal: 12,
// // // //     paddingTop: 14,
// // // //   },
// // // //   leftBtns: { flexDirection: 'row', gap: 8 },
// // // //   woodBtn: {
// // // //     width: 40,
// // // //     height: 40,
// // // //     borderRadius: 20,
// // // //     backgroundColor: YEL_BTN,
// // // //     borderWidth: 2.5,
// // // //     borderColor: YEL_BTN_D,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     elevation: 3,
// // // //   },
// // // //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
// // // //   sign: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 8,
// // // //     paddingHorizontal: 16,
// // // //     height: 44,
// // // //     borderRadius: 6,
// // // //     backgroundColor: '#bd6b29',
// // // //     borderWidth: 3,
// // // //     borderColor: WOOD_DD,
// // // //     elevation: 3,
// // // //   },
// // // //   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
// // // //   signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
// // // //   pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
// // // //   pill: {
// // // //     height: 32,
// // // //     borderRadius: 16,
// // // //     backgroundColor: CREAM,
// // // //     borderWidth: 1.5,
// // // //     borderStyle: 'dashed',
// // // //     borderColor: '#d8c8a8',
// // // //     justifyContent: 'center',
// // // //     paddingLeft: 18,
// // // //     paddingRight: 30,
// // // //     elevation: 3,
// // // //   },
// // // //   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
// // // //   pillIcon: { position: 'absolute', right: -6, top: -4 },

// // // //   // centre
// // // //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 170 },
// // // //   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
// // // //   qPill: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 10,
// // // //     backgroundColor: CREAM,
// // // //     borderRadius: 32,
// // // //     borderWidth: 2.5,
// // // //     borderColor: CREAM_BORDER,
// // // //     paddingVertical: 10,
// // // //     paddingHorizontal: 18,
// // // //     marginBottom: 10,
// // // //     maxWidth: 400,
// // // //     elevation: 3,
// // // //   },
// // // //   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: YELLOW_ARROW },
// // // //   question: { flexShrink: 1, fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },
// // // //   scene: { backgroundColor: 'transparent' },

// // // //   primary: {
// // // //     marginTop: 12,
// // // //     minWidth: 180,
// // // //     height: 54,
// // // //     borderRadius: 27,
// // // //     backgroundColor: '#8fe62d',
// // // //     borderWidth: 4,
// // // //     borderColor: '#d6f58a',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     elevation: 4,
// // // //   },
// // // //   primaryT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },
// // // //   off: { opacity: 0.5 },
// // // //   msg: {
// // // //     fontFamily: FONT,
// // // //     fontSize: 15,
// // // //     fontStyle: 'italic',
// // // //     fontWeight: '800',
// // // //     color: '#fff',
// // // //     marginTop: 8,
// // // //     textAlign: 'center',
// // // //     minHeight: 20,
// // // //     paddingHorizontal: 12,
// // // //   },

// // // //   // bottom wooden panel (solid wood, plank lines, corner rivets)
// // // //   panel: {
// // // //     position: 'absolute',
// // // //     left: 14,
// // // //     right: 14,
// // // //     bottom: 18,
// // // //     height: 148,
// // // //     borderRadius: 46,
// // // //     backgroundColor: WOOD,
// // // //     borderWidth: 6,
// // // //     borderColor: WOOD_D,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'flex-start',
// // // //     justifyContent: 'space-around',
// // // //     paddingTop: 20,
// // // //     elevation: 6,
// // // //   },
// // // //   plank: { position: 'absolute', height: 2.5, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
// // // //   screw: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: WOOD_DD },
// // // //   btnCol: { alignItems: 'center' },
// // // //   circleBtn: {
// // // //     width: 80,
// // // //     height: 80,
// // // //     borderRadius: 40,
// // // //     borderWidth: 7,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     elevation: 6,
// // // //   },
// // // //   badge: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     gap: 4,
// // // //     marginTop: 8,
// // // //     minWidth: 76,
// // // //     paddingHorizontal: 12,
// // // //     height: 32,
// // // //     borderRadius: 16,
// // // //     backgroundColor: BADGE,
// // // //   },
// // // //   badgeT: { fontFamily: FONT, fontSize: 17, fontWeight: '900', color: '#fff' },

// // // //   // error
// // // //   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
// // // //   errDetail: { fontFamily: FONT, fontSize: 14, color: '#fff', textAlign: 'center', marginTop: 6 },
// // // //   link: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },

// // // //   // clues popup
// // // //   clueCard: {
// // // //     width: '100%',
// // // //     maxWidth: 360,
// // // //     backgroundColor: CREAM,
// // // //     borderColor: WOOD_D,
// // // //     borderWidth: 6,
// // // //     borderRadius: 28,
// // // //     paddingHorizontal: 18,
// // // //     paddingTop: 18,
// // // //     paddingBottom: 22,
// // // //   },
// // // //   clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
// // // //   closeBtn: {
// // // //     position: 'absolute',
// // // //     top: -4,
// // // //     right: -4,
// // // //     width: 38,
// // // //     height: 38,
// // // //     borderRadius: 19,
// // // //     backgroundColor: WOOD,
// // // //     borderWidth: 3,
// // // //     borderColor: WOOD_D,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     zIndex: 2,
// // // //   },
// // // //   clueRow: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 14,
// // // //     borderRadius: 22,
// // // //     borderWidth: 2.5,
// // // //     paddingVertical: 14,
// // // //     paddingHorizontal: 14,
// // // //     marginBottom: 12,
// // // //   },
// // // //   clueRowOpen: { backgroundColor: '#fff', borderColor: '#3ec45a' },
// // // //   clueRowLocked: { backgroundColor: '#f8e3ae', borderColor: '#f3b73a' },
// // // //   clueNum: {
// // // //     width: 52,
// // // //     height: 52,
// // // //     borderRadius: 26,
// // // //     backgroundColor: '#bd6b29',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
// // // //   clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
// // // //   clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },
// // // //   clueTap: { fontFamily: FONT, fontSize: 15, fontWeight: '800', color: '#7a4a2a', marginTop: 2 },

// // // //   // win card
// // // //   overlay: {
// // // //     ...StyleSheet.absoluteFillObject,
// // // //     backgroundColor: 'rgba(10,25,60,0.5)',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     padding: 24,
// // // //   },
// // // //   card: {
// // // //     width: '100%',
// // // //     maxWidth: 340,
// // // //     backgroundColor: CREAM,
// // // //     borderColor: WOOD_D,
// // // //     borderWidth: 8,
// // // //     borderRadius: 28,
// // // //     padding: 22,
// // // //     alignItems: 'center',
// // // //   },
// // // //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: NAVY, textAlign: 'center' },
// // // //   stars: { fontSize: 36, color: YELLOW_ARROW, marginTop: 8 },
// // // //   cardText: { fontFamily: FONT, fontSize: 17, color: NAVY, marginTop: 6, textAlign: 'center' },
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
// // // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // // import { Stage, F, Coin } from './BTShared';
// // // import { Icon } from './Art';
// // // import { Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
// // // import { play } from './BTSound';
// // // import {
// // //   Level4Answer,
// // //   hintLevel4,
// // //   jumpLevel4,
// // //   rewardLevel4,
// // //   skipLevel4,
// // //   startLevel4,
// // // } from './Btlevel4api';

// // // const FONT: any = F;
// // // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// // // /* garden palette (same as Level 3) */
// // // const NAVY = '#13235b';
// // // const SKY = '#5cc0f5';
// // // const CREAM = '#faf0e2';
// // // const CREAM_BORDER = '#ead2a4';
// // // const WOOD = '#eba24e';
// // // const WOOD_D = '#c2782c';
// // // const WOOD_DD = '#8f5a1f';
// // // const LIME = '#a4e02a';
// // // const LIME_RING = '#f4f1dc';
// // // const RED = '#f0434d';
// // // const YELLOW_ARROW = '#ffb629';
// // // const BADGE = '#6b4423';
// // // const YEL_BTN = '#fbc02d';
// // // const YEL_BTN_D = '#d98e1c';

// // // type Props = {
// // //   playerId: number;
// // //   onHints?: (hints: number) => void;
// // //   onExit: () => void;
// // //   onComplete: (result: any) => void;
// // // };

// // // type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// // // // the cylinder starts as a short column of water (like level 9)
// // // const START_LEVEL = 22;

// // // // fallback text only; the real hint text comes from the backend JSON
// // // const HINT_FALLBACK = 'Drag the water up to the yellow line, then press JUMP.';

// // // /* ---------- garden background ---------- */
// // // function Flower({ x, y, s = 1 }: any) {
// // //   return (
// // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // //       {[0, 72, 144, 216, 288].map((a) => (
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

// // // /* sprout friend (same as Level 3), local coords: body at 0..120 x 55..133 */
// // // function Sprout({ x, y, s = 1 }: any) {
// // //   return (
// // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // //       <G fill="#5cb85c">
// // //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
// // //         <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
// // //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
// // //       </G>
// // //       <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
// // //       <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// // //       <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// // //       <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
// // //       <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
// // //       <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// // //     </G>
// // //   );
// // // }

// // // function Garden() {
// // //   return (
// // //     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// // //       {/* full-height sky (stretches to any screen, so no plain blue strip anywhere) */}
// // //       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
// // //         <Defs>
// // //           <LinearGradient id="g4sky" x1="0" y1="0" x2="0" y2="1">
// // //             <Stop offset="0" stopColor="#46b6f3" />
// // //             <Stop offset="1" stopColor="#c2e8fb" />
// // //           </LinearGradient>
// // //         </Defs>
// // //         <Rect width="10" height="10" fill="url(#g4sky)" />
// // //       </Svg>

// // //       {/* trees + cloud, pinned to the top */}
// // //       <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
// // //         <Svg width="100%" height="100%" viewBox="0 0 942 330">
// // //           <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// // //           <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// // //           <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
// // //           <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
// // //           <Cloud x={850} y={245} s={1} />
// // //         </Svg>
// // //       </View>

// // //       {/* ground (Level 3 scene), pinned to the bottom: hills, fence, bookshelf, sprout, meadow to the very edge */}
// // //       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
// // //         <Svg width="100%" height="100%" viewBox="0 0 942 1269">
// // //           {/* clouds */}
// // //           <Cloud x={50} y={585} s={0.9} />
// // //           <Cloud x={880} y={600} s={0.6} />

// // //           {/* rolling hills */}
// // //           <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
// // //           <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
// // //           <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

// // //           {/* fence: pickets first, rails in front */}
// // //           {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
// // //             const x = -10 + i * 90;
// // //             return (
// // //               <G key={i}>
// // //                 <Polygon points={`${x},730 ${x + 33},698 ${x + 66},730`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // //                 <Rect x={x} y="730" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // //               </G>
// // //             );
// // //           })}
// // //           <Rect x="0" y="760" width="942" height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
// // //           <Rect x="0" y="808" width="942" height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

// // //           {/* bookshelf (right) with potted plant */}
// // //           <G>
// // //             <Rect x="845" y="190" width="80" height="18" rx="4" fill="#e8903a" />
// // //             <Polygon points="852,208 918,208 910,250 860,250" fill="#f0a050" />
// // //             <G fill="#4cb04a">
// // //               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(-28 885 198)" />
// // //               <Ellipse cx="885" cy="140" rx="20" ry="62" fill="#3a9a3c" />
// // //               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(28 885 198)" />
// // //             </G>
// // //             <Rect x="780" y="250" width="162" height="575" fill="#eaa24f" />
// // //             <Rect x="796" y="266" width="146" height="545" fill="#dc9d4f" />
// // //             <Rect x="780" y="440" width="162" height="16" fill="#f2b866" />
// // //             <Rect x="780" y="630" width="162" height="16" fill="#f2b866" />
// // //             <Rect x="780" y="250" width="162" height="16" fill="#f2b866" />
// // //             <Rect x="810" y="310" width="36" height="130" fill="#2a9d9d" />
// // //             <Rect x="850" y="290" width="34" height="150" fill="#f06ba8" />
// // //             <Rect x="888" y="315" width="40" height="125" fill="#8a63da" />
// // //             <Rect x="805" y="515" width="30" height="115" fill="#e5484d" />
// // //             <Rect x="840" y="490" width="24" height="140" fill="#3b82e0" />
// // //             <Rect x="868" y="510" width="38" height="120" fill="#4caf50" />
// // //             <Rect x="810" y="695" width="34" height="120" fill="#f5c518" />
// // //             <Rect x="848" y="665" width="40" height="150" fill="#2c6fdc" />
// // //           </G>

// // //           {/* sprout friend (left) */}
// // //           <Sprout x={10} y={740} s={1} />

// // //           {/* front meadow, runs to the bottom edge */}
// // //           <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
// // //           <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

// // //           {/* stones */}
// // //           <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// // //           <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
// // //           <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// // //           <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

// // //           {/* grass tufts + flowers */}
// // //           <Tuft x="905" y="925" /><Tuft x="910" y="1050" /><Tuft x="20" y="1040" />
// // //           <Tuft x="100" y="1260" /><Tuft x="340" y="1260" /><Tuft x="580" y="1260" /><Tuft x="820" y="1260" />
// // //           <Flower x="885" y="815" s={0.8} />
// // //           <Flower x="200" y="1225" s={0.95} />
// // //           <Flower x="735" y="1225" s={0.95} />
// // //         </Svg>
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // /* ---------- thin link chain for the hanging sign (same as Level 3) ---------- */
// // // function Chain({ h = 28, style }: { h?: number; style?: any }) {
// // //   const n = Math.max(2, Math.round(h / 8));
// // //   return (
// // //     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
// // //       {Array.from({ length: n }).map((_, i) => (
// // //         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// // //       ))}
// // //     </Svg>
// // //   );
// // // }

// // // /* ---------- double arrow (skip icon, same as Level 3) ---------- */
// // // function DoubleArrow({ s }: { s: number }) {
// // //   return (
// // //     <Svg width={s} height={s} viewBox="0 0 100 100">
// // //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // //     </Svg>
// // //   );
// // // }

// // // export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // //   const { width, height } = useWindowDimensions();

// // //   // ---------- scene geometry ----------
// // //   const W = Math.min(width - 56, 340);
// // //   const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 420));

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
// // //   const [clueOpen, setClueOpen] = useState(false);
// // //   const [hintText, setHintText] = useState('');

// // //   const gx = useRef(new Animated.Value(0)).current;
// // //   const gy = useRef(new Animated.Value(0)).current;
// // //   const grot = useRef(new Animated.Value(0)).current;
// // //   const sway = useRef(new Animated.Value(0)).current;
// // //   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

// // //   // refs so the gesture handler always sees the latest values
// // //   const levelRef = useRef(level);
// // //   levelRef.current = level;
// // //   const phaseRef = useRef<Phase>(phase);
// // //   phaseRef.current = phase;
// // //   const phRef = useRef(ph);
// // //   phRef.current = ph;
// // //   const startLevelRef = useRef(START_LEVEL);

// // //   // hanging sign sways gently (same as Level 3)
// // //   useEffect(() => {
// // //     const a = Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // //         Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // //       ]),
// // //     );
// // //     a.start();
// // //     return () => a.stop();
// // //   }, [sway]);
// // //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

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
// // //       play('btn');
// // //       await dive(r.outcome || 'hit_bottom', lvl);
// // //       applyHints(r.hints);
// // //       if (r.correct) {
// // //         play('correct');
// // //         setResult(r);
// // //         setPhase('won');
// // //       } else {
// // //         play('wrong');
// // //         setMsg('');
// // //         setPhase('failed');
// // //         resetTimer.current = setTimeout(resetScene, 1600);
// // //       }
// // //     } catch (e: any) {
// // //       setMsg(e?.message || 'Could not reach the server.');
// // //       setPhase('idle');
// // //     }
// // //   };

// // //   // ---------- magnifier: frontend -> backend -> MySQL -> JSON -> HINT popup (25 hints) ----------
// // //   const onHint = async () => {
// // //     if (phase !== 'idle' || !sessionId) return;
// // //     setConfirmSkip(false);
// // //     try {
// // //       const r = await hintLevel4({ sessionId, playerId });
// // //       setHintLine(r.hint?.level ?? null);
// // //       setHintText(r.hint?.text || HINT_FALLBACK); // text comes from the backend
// // //       setMsg('');
// // //       play('clue');
// // //       setClueOpen(true);
// // //       applyHints(r.hints);
// // //     } catch (e: any) {
// // //       const m = String(e?.message || '');
// // //       setMsg(/not enough/i.test(m) ? 'Not enough hints! Tap the video button for +75 hints.' : m || 'Could not get the hint.');
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

// // //   // ---------- shared header (home, settings, hanging sign, hints pill) ----------
// // //   const header = (
// // //     <View style={st.topBar}>
// // //       <View style={st.leftBtns}>
// // //         <TouchableOpacity
// // //           style={st.woodBtn}
// // //           activeOpacity={0.85}
// // //           onPress={onExit}
// // //           disabled={phase === 'jumping' || phase === 'sending'}
// // //         >
// // //           <Icon n="home" s={20} />
// // //         </TouchableOpacity>
// // //         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
// // //           <Icon n="gear" s={21} />
// // //         </TouchableOpacity>
// // //       </View>

// // //       <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
// // //         <Chain h={30} style={{ left: 24, top: -6 }} />
// // //         <Chain h={30} style={{ right: 24, top: -6 }} />
// // //         <View style={st.sign}>
// // //           <Text style={st.signArrow}>{'<'}</Text>
// // //           <Text style={st.signT}>LEVEL 4</Text>
// // //           <Text style={st.signArrow}>{'>'}</Text>
// // //         </View>
// // //       </Animated.View>

// // //       <View style={st.pillWrap}>
// // //         <View style={st.pill}>
// // //           <Text style={st.pillT}>{hints}</Text>
// // //         </View>
// // //         <View style={st.pillIcon}>
// // //           <Icon n="bulb" s={34} />
// // //         </View>
// // //       </View>
// // //     </View>
// // //   );

// // //   // ---------- loading / error ----------
// // //   if (phase === 'loading' || phase === 'error') {
// // //     return (
// // //       <Stage bg={SKY}>
// // //         <View style={st.root}>
// // //           <Garden />
// // //           {header}
// // //           <View style={st.centerMsg}>
// // //             {phase === 'loading' ? (
// // //               <ActivityIndicator size="large" color="#fff" />
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
// // //     <Stage bg={SKY}>
// // //       <View style={st.root}>
// // //         <Garden />

// // //         {header}

// // //         <View style={st.center}>
// // //           {/* question pill */}
// // //           <View style={st.qPill}>
// // //             <Text style={st.qArrow}>{'<'}</Text>
// // //             <Text style={st.question}>{question}</Text>
// // //             <Text style={st.qArrow}>{'>'}</Text>
// // //           </View>

// // //           {/* scene (transparent: the garden is behind it) */}
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
// // //             {phase === 'sending' ? <ActivityIndicator color={NAVY} /> : <Text style={st.primaryT}>JUMP</Text>}
// // //           </TouchableOpacity>

// // //           <Text style={st.msg}>{msg || ' '}</Text>
// // //         </View>

// // //         {/* bottom wooden panel (same as Level 3) */}
// // //         <View style={st.panel}>
// // //           <View style={[st.plank, { top: 18, left: 34, right: 34 }]} />
// // //           <View style={[st.plank, { top: 76, left: 26, right: 26 }]} />
// // //           <View style={[st.plank, { bottom: 16, left: 34, right: 34 }]} />
// // //           <View style={[st.screw, { left: 16, top: 16 }]} />
// // //           <View style={[st.screw, { right: 16, top: 16 }]} />
// // //           <View style={[st.screw, { left: 16, bottom: 16 }]} />
// // //           <View style={[st.screw, { right: 16, bottom: 16 }]} />

// // //           <View style={st.btnCol}>
// // //             <TouchableOpacity
// // //               style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }, busy && st.off]}
// // //               activeOpacity={0.85}
// // //               onPress={onHint}
// // //               disabled={busy}
// // //             >
// // //               <Icon n="search" s={40} />
// // //             </TouchableOpacity>
// // //             <View style={st.badge}>
// // //               <Icon n="bulb" s={19} />
// // //               <Text style={st.badgeT}>25</Text>
// // //             </View>
// // //           </View>

// // //           <View style={st.btnCol}>
// // //             <TouchableOpacity
// // //               style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }, busy && st.off]}
// // //               activeOpacity={0.85}
// // //               onPress={onReward}
// // //               disabled={busy}
// // //             >
// // //               <Icon n="film" s={46} />
// // //             </TouchableOpacity>
// // //             <View style={st.badge}>
// // //               <Coin s={15} />
// // //               <Text style={st.badgeT}>+75</Text>
// // //             </View>
// // //           </View>

// // //           <View style={st.btnCol}>
// // //             <TouchableOpacity
// // //               style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }, busy && st.off]}
// // //               activeOpacity={0.85}
// // //               onPress={onSkip}
// // //               disabled={busy}
// // //             >
// // //               <DoubleArrow s={42} />
// // //             </TouchableOpacity>
// // //             <View style={st.badge}>
// // //               <Icon n="bulb" s={19} />
// // //               <Text style={st.badgeT}>50</Text>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* HINT popup (small, only from the magnifier) */}
// // //         {clueOpen && (
// // //           <View style={st.overlay}>
// // //             <View style={st.hintCard}>
// // //               <TouchableOpacity style={st.hintClose} activeOpacity={0.85} onPress={() => setClueOpen(false)}>
// // //                 <Icon n="cross" s={16} />
// // //               </TouchableOpacity>
// // //               <Text style={st.hintTitle}>HINT</Text>

// // //               <View style={st.hintRow}>
// // //                 <View style={st.hintNum}>
// // //                   <Text style={st.hintNumT}>2</Text>
// // //                 </View>
// // //                 <Text style={st.hintBody}>{hintText}</Text>
// // //               </View>
// // //             </View>
// // //           </View>
// // //         )}

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
// // //   root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

// // //   // top
// // //   topBar: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 12,
// // //     paddingTop: 14,
// // //   },
// // //   leftBtns: { flexDirection: 'row', gap: 8 },
// // //   woodBtn: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: YEL_BTN,
// // //     borderWidth: 2.5,
// // //     borderColor: YEL_BTN_D,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     elevation: 3,
// // //   },
// // //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
// // //   sign: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 8,
// // //     paddingHorizontal: 16,
// // //     height: 44,
// // //     borderRadius: 6,
// // //     backgroundColor: '#bd6b29',
// // //     borderWidth: 3,
// // //     borderColor: WOOD_DD,
// // //     elevation: 3,
// // //   },
// // //   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
// // //   signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
// // //   pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
// // //   pill: {
// // //     height: 32,
// // //     borderRadius: 16,
// // //     backgroundColor: CREAM,
// // //     borderWidth: 1.5,
// // //     borderStyle: 'dashed',
// // //     borderColor: '#d8c8a8',
// // //     justifyContent: 'center',
// // //     paddingLeft: 18,
// // //     paddingRight: 30,
// // //     elevation: 3,
// // //   },
// // //   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
// // //   pillIcon: { position: 'absolute', right: -6, top: -4 },

// // //   // centre
// // //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 170 },
// // //   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
// // //   qPill: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 10,
// // //     backgroundColor: CREAM,
// // //     borderRadius: 32,
// // //     borderWidth: 2.5,
// // //     borderColor: CREAM_BORDER,
// // //     paddingVertical: 10,
// // //     paddingHorizontal: 18,
// // //     marginBottom: 10,
// // //     maxWidth: 400,
// // //     elevation: 3,
// // //   },
// // //   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: YELLOW_ARROW },
// // //   question: { flexShrink: 1, fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },
// // //   scene: { backgroundColor: 'transparent' },

// // //   primary: {
// // //     marginTop: 12,
// // //     minWidth: 180,
// // //     height: 54,
// // //     borderRadius: 27,
// // //     backgroundColor: '#8fe62d',
// // //     borderWidth: 4,
// // //     borderColor: '#d6f58a',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     elevation: 4,
// // //   },
// // //   primaryT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },
// // //   off: { opacity: 0.5 },
// // //   msg: {
// // //     fontFamily: FONT,
// // //     fontSize: 15,
// // //     fontStyle: 'italic',
// // //     fontWeight: '800',
// // //     color: '#fff',
// // //     marginTop: 8,
// // //     textAlign: 'center',
// // //     minHeight: 20,
// // //     paddingHorizontal: 12,
// // //   },

// // //   // bottom wooden panel (solid wood, plank lines, corner rivets)
// // //   panel: {
// // //     position: 'absolute',
// // //     left: 14,
// // //     right: 14,
// // //     bottom: 18,
// // //     height: 148,
// // //     borderRadius: 46,
// // //     backgroundColor: WOOD,
// // //     borderWidth: 6,
// // //     borderColor: WOOD_D,
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-start',
// // //     justifyContent: 'space-around',
// // //     paddingTop: 20,
// // //     elevation: 6,
// // //   },
// // //   plank: { position: 'absolute', height: 2.5, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
// // //   screw: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: WOOD_DD },
// // //   btnCol: { alignItems: 'center' },
// // //   circleBtn: {
// // //     width: 80,
// // //     height: 80,
// // //     borderRadius: 40,
// // //     borderWidth: 7,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     elevation: 6,
// // //   },
// // //   badge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     gap: 4,
// // //     marginTop: 8,
// // //     minWidth: 76,
// // //     paddingHorizontal: 12,
// // //     height: 32,
// // //     borderRadius: 16,
// // //     backgroundColor: BADGE,
// // //   },
// // //   badgeT: { fontFamily: FONT, fontSize: 17, fontWeight: '900', color: '#fff' },

// // //   // error
// // //   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
// // //   errDetail: { fontFamily: FONT, fontSize: 14, color: '#fff', textAlign: 'center', marginTop: 6 },
// // //   link: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },

// // //   // small hint popup (like level 3)
// // //   hintCard: {
// // //     width: '78%',
// // //     maxWidth: 290,
// // //     backgroundColor: CREAM,
// // //     borderColor: WOOD_D,
// // //     borderWidth: 5,
// // //     borderRadius: 22,
// // //     paddingHorizontal: 14,
// // //     paddingTop: 14,
// // //     paddingBottom: 14,
// // //   },
// // //   hintTitle: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 10 },
// // //   hintClose: {
// // //     position: 'absolute',
// // //     top: -6,
// // //     right: -6,
// // //     width: 30,
// // //     height: 30,
// // //     borderRadius: 15,
// // //     backgroundColor: WOOD,
// // //     borderWidth: 2.5,
// // //     borderColor: WOOD_D,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     zIndex: 2,
// // //   },
// // //   hintRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 10,
// // //     backgroundColor: '#fff',
// // //     borderColor: '#3ec45a',
// // //     borderWidth: 2,
// // //     borderRadius: 16,
// // //     paddingVertical: 10,
// // //     paddingHorizontal: 10,
// // //   },
// // //   hintNum: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
// // //   hintNumT: { fontFamily: FONT, fontSize: 19, fontWeight: '900', color: '#fff' },
// // //   hintBody: { flex: 1, fontFamily: SERIF, fontSize: 14, fontStyle: 'italic', color: '#17307a' },

// // //   // overlay + win card
// // //   overlay: {
// // //     ...StyleSheet.absoluteFillObject,
// // //     backgroundColor: 'rgba(10,25,60,0.5)',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     padding: 24,
// // //   },
// // //   card: {
// // //     width: '100%',
// // //     maxWidth: 340,
// // //     backgroundColor: CREAM,
// // //     borderColor: WOOD_D,
// // //     borderWidth: 8,
// // //     borderRadius: 28,
// // //     padding: 22,
// // //     alignItems: 'center',
// // //   },
// // //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: NAVY, textAlign: 'center' },
// // //   stars: { fontSize: 36, color: YELLOW_ARROW, marginTop: 8 },
// // //   cardText: { fontFamily: FONT, fontSize: 17, color: NAVY, marginTop: 6, textAlign: 'center' },
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
// // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // import { Stage, F, Coin } from './BTShared';
// // import { Icon } from './Art';
// // import { Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
// // import { play } from './BTSound';
// // import {
// //   Level4Answer,
// //   hintLevel4,
// //   jumpLevel4,
// //   rewardLevel4,
// //   skipLevel4,
// //   startLevel4,
// // } from './Btlevel4api';

// // const FONT: any = F;
// // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// // /* garden palette (same as Level 3) */
// // const NAVY = '#13235b';
// // const SKY = '#5cc0f5';
// // const CREAM = '#faf0e2';
// // const CREAM_BORDER = '#ead2a4';
// // const WOOD = '#eba24e';
// // const WOOD_D = '#c2782c';
// // const WOOD_DD = '#8f5a1f';
// // const LIME = '#a4e02a';
// // const LIME_RING = '#f4f1dc';
// // const RED = '#f0434d';
// // const YELLOW_ARROW = '#ffb629';
// // const BADGE = '#6b4423';
// // const YEL_BTN = '#fbc02d';
// // const YEL_BTN_D = '#d98e1c';

// // type Props = {
// //   playerId: number;
// //   onHints?: (hints: number) => void;
// //   onExit: () => void;
// //   onComplete: (result: any) => void;
// // };

// // type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// // // the cylinder starts as a short column of water (like level 9)
// // const START_LEVEL = 22;

// // // fallback text only; the real question / hint text comes from the backend JSON
// // const QUESTION_FALLBACK = 'The pool is almost empty. Fill it with water so she can dive safely.';
// // const HINT_FALLBACK = 'The pool is too empty. Drag the water up to the yellow line, then press JUMP.';

// // /* ---------- garden background ---------- */
// // function Flower({ x, y, s = 1 }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// //       {[0, 72, 144, 216, 288].map((a) => (
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

// // /* sprout friend (same as Level 3), local coords: body at 0..120 x 55..133 */
// // function Sprout({ x, y, s = 1 }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// //       <G fill="#5cb85c">
// //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
// //         <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
// //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
// //       </G>
// //       <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
// //       <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// //       <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// //       <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
// //       <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
// //       <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// //     </G>
// //   );
// // }

// // function Garden() {
// //   return (
// //     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// //       {/* full-height sky (stretches to any screen, so no plain blue strip anywhere) */}
// //       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
// //         <Defs>
// //           <LinearGradient id="g4sky" x1="0" y1="0" x2="0" y2="1">
// //             <Stop offset="0" stopColor="#46b6f3" />
// //             <Stop offset="1" stopColor="#c2e8fb" />
// //           </LinearGradient>
// //         </Defs>
// //         <Rect width="10" height="10" fill="url(#g4sky)" />
// //       </Svg>

// //       {/* trees + cloud, pinned to the top */}
// //       <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
// //         <Svg width="100%" height="100%" viewBox="0 0 942 330">
// //           <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// //           <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// //           <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
// //           <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
// //           <Cloud x={850} y={245} s={1} />
// //         </Svg>
// //       </View>

// //       {/* ground (Level 3 scene), pinned to the bottom: hills, fence, bookshelf, sprout, meadow to the very edge */}
// //       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
// //         <Svg width="100%" height="100%" viewBox="0 0 942 1269">
// //           {/* clouds */}
// //           <Cloud x={50} y={585} s={0.9} />
// //           <Cloud x={880} y={600} s={0.6} />

// //           {/* rolling hills */}
// //           <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
// //           <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
// //           <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

// //           {/* fence: pickets first, rails in front */}
// //           {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
// //             const x = -10 + i * 90;
// //             return (
// //               <G key={i}>
// //                 <Polygon points={`${x},730 ${x + 33},698 ${x + 66},730`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// //                 <Rect x={x} y="730" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// //               </G>
// //             );
// //           })}
// //           <Rect x="0" y="760" width="942" height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
// //           <Rect x="0" y="808" width="942" height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

// //           {/* bookshelf (right) with potted plant */}
// //           <G>
// //             <Rect x="845" y="190" width="80" height="18" rx="4" fill="#e8903a" />
// //             <Polygon points="852,208 918,208 910,250 860,250" fill="#f0a050" />
// //             <G fill="#4cb04a">
// //               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(-28 885 198)" />
// //               <Ellipse cx="885" cy="140" rx="20" ry="62" fill="#3a9a3c" />
// //               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(28 885 198)" />
// //             </G>
// //             <Rect x="780" y="250" width="162" height="575" fill="#eaa24f" />
// //             <Rect x="796" y="266" width="146" height="545" fill="#dc9d4f" />
// //             <Rect x="780" y="440" width="162" height="16" fill="#f2b866" />
// //             <Rect x="780" y="630" width="162" height="16" fill="#f2b866" />
// //             <Rect x="780" y="250" width="162" height="16" fill="#f2b866" />
// //             <Rect x="810" y="310" width="36" height="130" fill="#2a9d9d" />
// //             <Rect x="850" y="290" width="34" height="150" fill="#f06ba8" />
// //             <Rect x="888" y="315" width="40" height="125" fill="#8a63da" />
// //             <Rect x="805" y="515" width="30" height="115" fill="#e5484d" />
// //             <Rect x="840" y="490" width="24" height="140" fill="#3b82e0" />
// //             <Rect x="868" y="510" width="38" height="120" fill="#4caf50" />
// //             <Rect x="810" y="695" width="34" height="120" fill="#f5c518" />
// //             <Rect x="848" y="665" width="40" height="150" fill="#2c6fdc" />
// //           </G>

// //           {/* sprout friend (left) */}
// //           <Sprout x={10} y={740} s={1} />

// //           {/* front meadow, runs to the bottom edge */}
// //           <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
// //           <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

// //           {/* stones */}
// //           <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// //           <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
// //           <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// //           <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

// //           {/* grass tufts + flowers */}
// //           <Tuft x="905" y="925" /><Tuft x="910" y="1050" /><Tuft x="20" y="1040" />
// //           <Tuft x="100" y="1260" /><Tuft x="340" y="1260" /><Tuft x="580" y="1260" /><Tuft x="820" y="1260" />
// //           <Flower x="885" y="815" s={0.8} />
// //           <Flower x="200" y="1225" s={0.95} />
// //           <Flower x="735" y="1225" s={0.95} />
// //         </Svg>
// //       </View>
// //     </View>
// //   );
// // }

// // /* ---------- thin link chain for the hanging sign (same as Level 3) ---------- */
// // function Chain({ h = 28, style }: { h?: number; style?: any }) {
// //   const n = Math.max(2, Math.round(h / 8));
// //   return (
// //     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
// //       {Array.from({ length: n }).map((_, i) => (
// //         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// //       ))}
// //     </Svg>
// //   );
// // }

// // /* ---------- double arrow (skip icon, same as Level 3) ---------- */
// // function DoubleArrow({ s }: { s: number }) {
// //   return (
// //     <Svg width={s} height={s} viewBox="0 0 100 100">
// //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// //     </Svg>
// //   );
// // }

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
// //   const [question, setQuestion] = useState(QUESTION_FALLBACK);
// //   const [hints, setHints] = useState(0);
// //   const [hintLine, setHintLine] = useState<number | null>(null);
// //   const [level, setLevel] = useState(START_LEVEL);
// //   const [pose, setPose] = useState<GirlPose>('stand');
// //   const [msg, setMsg] = useState('');
// //   const [error, setError] = useState('');
// //   const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
// //   const [result, setResult] = useState<Level4Answer | null>(null);
// //   const [confirmSkip, setConfirmSkip] = useState(false);
// //   const [clueOpen, setClueOpen] = useState(false);
// //   const [hintText, setHintText] = useState('');
// //   const [hintStep, setHintStep] = useState(1);

// //   const gx = useRef(new Animated.Value(0)).current;
// //   const gy = useRef(new Animated.Value(0)).current;
// //   const grot = useRef(new Animated.Value(0)).current;
// //   const sway = useRef(new Animated.Value(0)).current;
// //   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

// //   // refs so the gesture handler always sees the latest values
// //   const levelRef = useRef(level);
// //   levelRef.current = level;
// //   const phaseRef = useRef<Phase>(phase);
// //   phaseRef.current = phase;
// //   const phRef = useRef(ph);
// //   phRef.current = ph;
// //   const startLevelRef = useRef(START_LEVEL);

// //   // hanging sign sways gently (same as Level 3)
// //   useEffect(() => {
// //     const a = Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //         Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //       ]),
// //     );
// //     a.start();
// //     return () => a.stop();
// //   }, [sway]);
// //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

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
// //       play('btn');
// //       await dive(r.outcome || 'hit_bottom', lvl);
// //       applyHints(r.hints);
// //       if (r.correct) {
// //         play('correct');
// //         setResult(r);
// //         setPhase('won');
// //       } else {
// //         play('wrong');
// //         setMsg(r.message || '');
// //         setPhase('failed');
// //         resetTimer.current = setTimeout(resetScene, 1600);
// //       }
// //     } catch (e: any) {
// //       setMsg(e?.message || 'Could not reach the server.');
// //       setPhase('idle');
// //     }
// //   };

// //   // ---------- magnifier: frontend -> backend -> MySQL -> JSON -> HINT popup (25 hints) ----------
// //   const onHint = async () => {
// //     if (phase !== 'idle' || !sessionId) return;
// //     setConfirmSkip(false);
// //     try {
// //       const r = await hintLevel4({ sessionId, playerId });
// //       setHintLine(r.hint?.level ?? null);
// //       setHintStep(r.hint?.step ?? 1); // number comes from the backend
// //       setHintText(r.hint?.text || HINT_FALLBACK); // text comes from the backend
// //       setMsg('');
// //       play('clue');
// //       setClueOpen(true);
// //       applyHints(r.hints);
// //     } catch (e: any) {
// //       const m = String(e?.message || '');
// //       setMsg(m || 'Could not get the hint.');
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

// //   // ---------- shared header (home, settings, hanging sign, hints pill) ----------
// //   const header = (
// //     <View style={st.topBar}>
// //       <View style={st.leftBtns}>
// //         <TouchableOpacity
// //           style={st.woodBtn}
// //           activeOpacity={0.85}
// //           onPress={onExit}
// //           disabled={phase === 'jumping' || phase === 'sending'}
// //         >
// //           <Icon n="home" s={20} />
// //         </TouchableOpacity>
// //         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
// //           <Icon n="gear" s={21} />
// //         </TouchableOpacity>
// //       </View>

// //       <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
// //         <Chain h={30} style={{ left: 24, top: -6 }} />
// //         <Chain h={30} style={{ right: 24, top: -6 }} />
// //         <View style={st.sign}>
// //           <Text style={st.signArrow}>{'<'}</Text>
// //           <Text style={st.signT}>LEVEL 4</Text>
// //           <Text style={st.signArrow}>{'>'}</Text>
// //         </View>
// //       </Animated.View>

// //       <View style={st.pillWrap}>
// //         <View style={st.pill}>
// //           <Text style={st.pillT}>{hints}</Text>
// //         </View>
// //         <View style={st.pillIcon}>
// //           <Icon n="bulb" s={34} />
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   // ---------- loading / error ----------
// //   if (phase === 'loading' || phase === 'error') {
// //     return (
// //       <Stage bg={SKY}>
// //         <View style={st.root}>
// //           <Garden />
// //           {header}
// //           <View style={st.centerMsg}>
// //             {phase === 'loading' ? (
// //               <ActivityIndicator size="large" color="#fff" />
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
// //     <Stage bg={SKY}>
// //       <View style={st.root}>
// //         <Garden />

// //         {header}

// //         <View style={st.center}>
// //           {/* question pill */}
// //           <View style={st.qPill}>
// //             <Text style={st.qArrow}>{'<'}</Text>
// //             <Text style={st.question}>{question}</Text>
// //             <Text style={st.qArrow}>{'>'}</Text>
// //           </View>

// //           {/* scene (transparent: the garden is behind it) */}
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
// //             {phase === 'sending' ? <ActivityIndicator color={NAVY} /> : <Text style={st.primaryT}>JUMP</Text>}
// //           </TouchableOpacity>

// //           <Text style={st.msg}>{msg || ' '}</Text>
// //         </View>

// //         {/* bottom wooden panel (smaller, same look as Level 3) */}
// //         <View style={st.panel}>
// //           <View style={[st.plank, { top: 14, left: 30, right: 30 }]} />
// //           <View style={[st.plank, { top: 60, left: 24, right: 24 }]} />
// //           <View style={[st.plank, { bottom: 12, left: 30, right: 30 }]} />
// //           <View style={[st.screw, { left: 12, top: 12 }]} />
// //           <View style={[st.screw, { right: 12, top: 12 }]} />
// //           <View style={[st.screw, { left: 12, bottom: 12 }]} />
// //           <View style={[st.screw, { right: 12, bottom: 12 }]} />

// //           <View style={st.btnCol}>
// //             <TouchableOpacity
// //               style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }, busy && st.off]}
// //               activeOpacity={0.85}
// //               onPress={onHint}
// //               disabled={busy}
// //             >
// //               <Icon n="search" s={30} />
// //             </TouchableOpacity>
// //             <View style={st.badge}>
// //               <Icon n="bulb" s={14} />
// //               <Text style={st.badgeT}>25</Text>
// //             </View>
// //           </View>

// //           <View style={st.btnCol}>
// //             <TouchableOpacity
// //               style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }, busy && st.off]}
// //               activeOpacity={0.85}
// //               onPress={onReward}
// //               disabled={busy}
// //             >
// //               <Icon n="film" s={34} />
// //             </TouchableOpacity>
// //             <View style={st.badge}>
// //               <Coin s={12} />
// //               <Text style={st.badgeT}>+75</Text>
// //             </View>
// //           </View>

// //           <View style={st.btnCol}>
// //             <TouchableOpacity
// //               style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }, busy && st.off]}
// //               activeOpacity={0.85}
// //               onPress={onSkip}
// //               disabled={busy}
// //             >
// //               <DoubleArrow s={32} />
// //             </TouchableOpacity>
// //             <View style={st.badge}>
// //               <Icon n="bulb" s={14} />
// //               <Text style={st.badgeT}>50</Text>
// //             </View>
// //           </View>
// //         </View>

// //         {/* HINT popup (clue board size, only from the magnifier) */}
// //         {clueOpen && (
// //           <View style={st.overlay}>
// //             <View style={st.hintCard}>
// //               <TouchableOpacity style={st.hintClose} activeOpacity={0.85} onPress={() => setClueOpen(false)}>
// //                 <Icon n="cross" s={16} />
// //               </TouchableOpacity>
// //               <Text style={st.hintTitle}>HINT</Text>

// //               <View style={st.hintRow}>
// //                 <View style={st.hintNum}>
// //                   <Text style={st.hintNumT}>{hintStep}</Text>
// //                 </View>
// //                 <Text style={st.hintBody}>{hintText}</Text>
// //               </View>
// //             </View>
// //           </View>
// //         )}

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
// //   root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

// //   // top
// //   topBar: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 12,
// //     paddingTop: 14,
// //   },
// //   leftBtns: { flexDirection: 'row', gap: 8 },
// //   woodBtn: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: YEL_BTN,
// //     borderWidth: 2.5,
// //     borderColor: YEL_BTN_D,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     elevation: 3,
// //   },
// //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
// //   sign: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //     paddingHorizontal: 16,
// //     height: 44,
// //     borderRadius: 6,
// //     backgroundColor: '#bd6b29',
// //     borderWidth: 3,
// //     borderColor: WOOD_DD,
// //     elevation: 3,
// //   },
// //   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
// //   signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
// //   pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
// //   pill: {
// //     height: 32,
// //     borderRadius: 16,
// //     backgroundColor: CREAM,
// //     borderWidth: 1.5,
// //     borderStyle: 'dashed',
// //     borderColor: '#d8c8a8',
// //     justifyContent: 'center',
// //     paddingLeft: 18,
// //     paddingRight: 30,
// //     elevation: 3,
// //   },
// //   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
// //   pillIcon: { position: 'absolute', right: -6, top: -4 },

// //   // centre (less bottom padding because the panel is smaller now)
// //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 140 },
// //   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
// //   qPill: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 10,
// //     backgroundColor: CREAM,
// //     borderRadius: 32,
// //     borderWidth: 2.5,
// //     borderColor: CREAM_BORDER,
// //     paddingVertical: 10,
// //     paddingHorizontal: 18,
// //     marginBottom: 10,
// //     maxWidth: 400,
// //     elevation: 3,
// //   },
// //   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: YELLOW_ARROW },
// //   question: { flexShrink: 1, fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },
// //   scene: { backgroundColor: 'transparent' },

// //   primary: {
// //     marginTop: 12,
// //     minWidth: 180,
// //     height: 54,
// //     borderRadius: 27,
// //     backgroundColor: '#8fe62d',
// //     borderWidth: 4,
// //     borderColor: '#d6f58a',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     elevation: 4,
// //   },
// //   primaryT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },
// //   off: { opacity: 0.5 },
// //   msg: {
// //     fontFamily: FONT,
// //     fontSize: 15,
// //     fontStyle: 'italic',
// //     fontWeight: '800',
// //     color: '#fff',
// //     marginTop: 8,
// //     textAlign: 'center',
// //     minHeight: 20,
// //     paddingHorizontal: 12,
// //   },

// //   // bottom wooden panel (smaller: solid wood, plank lines, corner rivets)
// //   panel: {
// //     position: 'absolute',
// //     left: 14,
// //     right: 14,
// //     bottom: 14,
// //     height: 118,
// //     borderRadius: 38,
// //     backgroundColor: WOOD,
// //     borderWidth: 5,
// //     borderColor: WOOD_D,
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //     justifyContent: 'space-around',
// //     paddingTop: 14,
// //     elevation: 6,
// //   },
// //   plank: { position: 'absolute', height: 2, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
// //   screw: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: WOOD_DD },
// //   btnCol: { alignItems: 'center' },
// //   circleBtn: {
// //     width: 62,
// //     height: 62,
// //     borderRadius: 31,
// //     borderWidth: 5,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     elevation: 5,
// //   },
// //   badge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     gap: 3,
// //     marginTop: 6,
// //     minWidth: 62,
// //     paddingHorizontal: 10,
// //     height: 26,
// //     borderRadius: 13,
// //     backgroundColor: BADGE,
// //   },
// //   badgeT: { fontFamily: FONT, fontSize: 14, fontWeight: '900', color: '#fff' },

// //   // error
// //   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
// //   errDetail: { fontFamily: FONT, fontSize: 14, color: '#fff', textAlign: 'center', marginTop: 6 },
// //   link: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },

// //   // hint popup (clue board size, bigger than before)
// //   hintCard: {
// //     width: '90%',
// //     maxWidth: 360,
// //     backgroundColor: CREAM,
// //     borderColor: WOOD_D,
// //     borderWidth: 6,
// //     borderRadius: 26,
// //     paddingHorizontal: 18,
// //     paddingTop: 20,
// //     paddingBottom: 22,
// //   },
// //   hintTitle: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
// //   hintClose: {
// //     position: 'absolute',
// //     top: -10,
// //     right: -10,
// //     width: 34,
// //     height: 34,
// //     borderRadius: 17,
// //     backgroundColor: WOOD,
// //     borderWidth: 3,
// //     borderColor: WOOD_D,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     zIndex: 2,
// //   },
// //   hintRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //     backgroundColor: '#fff',
// //     borderColor: '#3ec45a',
// //     borderWidth: 2.5,
// //     borderRadius: 18,
// //     paddingVertical: 16,
// //     paddingHorizontal: 14,
// //     minHeight: 90,
// //   },
// //   hintNum: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
// //   hintNumT: { fontFamily: FONT, fontSize: 21, fontWeight: '900', color: '#fff' },
// //   hintBody: { flex: 1, fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a' },

// //   // overlay + win card
// //   overlay: {
// //     ...StyleSheet.absoluteFillObject,
// //     backgroundColor: 'rgba(10,25,60,0.5)',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 24,
// //   },
// //   card: {
// //     width: '100%',
// //     maxWidth: 340,
// //     backgroundColor: CREAM,
// //     borderColor: WOOD_D,
// //     borderWidth: 8,
// //     borderRadius: 28,
// //     padding: 22,
// //     alignItems: 'center',
// //   },
// //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: NAVY, textAlign: 'center' },
// //   stars: { fontSize: 36, color: YELLOW_ARROW, marginTop: 8 },
// //   cardText: { fontFamily: FONT, fontSize: 17, color: NAVY, marginTop: 6, textAlign: 'center' },
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
// import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// import { Stage, F, Coin } from './BTShared';
// import { Icon } from './Art';
// import { Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
// import { play } from './BTSound';
// import {
//   Level4Answer,
//   hintLevel4,
//   jumpLevel4,
//   rewardLevel4,
//   skipLevel4,
//   startLevel4,
// } from './Btlevel4api';

// const FONT: any = F;
// const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// /* garden palette (same as Level 3) */
// const NAVY = '#13235b';
// const SKY = '#5cc0f5';
// const CREAM = '#faf0e2';
// const CREAM_BORDER = '#ead2a4';
// const WOOD = '#eba24e';
// const WOOD_D = '#c2782c';
// const WOOD_DD = '#8f5a1f';
// const LIME = '#a4e02a';
// const LIME_RING = '#f4f1dc';
// const RED = '#f0434d';
// const YELLOW_ARROW = '#ffb629';
// const BADGE = '#6b4423';
// const YEL_BTN = '#fbc02d';
// const YEL_BTN_D = '#d98e1c';

// type Props = {
//   playerId: number;
//   onHints?: (hints: number) => void;
//   onExit: () => void;
//   onComplete: (result: any) => void;
// };

// type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// // the cylinder starts as a short column of water (like level 9)
// const START_LEVEL = 22;

// // fallback text only; the real question / hint text comes from the backend JSON
// const QUESTION_FALLBACK = 'Help her make a safe jump into the pool!';
// const HINT_FALLBACK = 'Drag the water up to the yellow line, then tap JUMP to help her dive safely!';

// /* ---------- garden background ---------- */
// function Flower({ x, y, s = 1 }: any) {
//   return (
//     <G transform={`translate(${x} ${y}) scale(${s})`}>
//       {[0, 72, 144, 216, 288].map((a) => (
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

// /* sprout friend (same as Level 3), local coords: body at 0..120 x 55..133 */
// function Sprout({ x, y, s = 1 }: any) {
//   return (
//     <G transform={`translate(${x} ${y}) scale(${s})`}>
//       <G fill="#5cb85c">
//         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
//         <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
//         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
//       </G>
//       <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
//       <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
//       <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
//       <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
//       <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
//       <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
//     </G>
//   );
// }

// function Garden() {
//   return (
//     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
//       {/* full-height sky (stretches to any screen, so no plain blue strip anywhere) */}
//       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
//         <Defs>
//           <LinearGradient id="g4sky" x1="0" y1="0" x2="0" y2="1">
//             <Stop offset="0" stopColor="#46b6f3" />
//             <Stop offset="1" stopColor="#c2e8fb" />
//           </LinearGradient>
//         </Defs>
//         <Rect width="10" height="10" fill="url(#g4sky)" />
//       </Svg>

//       {/* trees + cloud, pinned to the top */}
//       <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
//         <Svg width="100%" height="100%" viewBox="0 0 942 330">
//           <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
//           <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
//           <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
//           <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
//           <Cloud x={850} y={245} s={1} />
//         </Svg>
//       </View>

//       {/* ground (Level 3 scene), pinned to the bottom: hills, fence, bookshelf, sprout, meadow to the very edge */}
//       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
//         <Svg width="100%" height="100%" viewBox="0 0 942 1269">
//           {/* clouds */}
//           <Cloud x={50} y={585} s={0.9} />
//           <Cloud x={880} y={600} s={0.6} />

//           {/* rolling hills */}
//           <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
//           <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
//           <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

//           {/* fence: pickets first, rails in front */}
//           {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
//             const x = -10 + i * 90;
//             return (
//               <G key={i}>
//                 <Polygon points={`${x},730 ${x + 33},698 ${x + 66},730`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
//                 <Rect x={x} y="730" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
//               </G>
//             );
//           })}
//           <Rect x="0" y="760" width="942" height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
//           <Rect x="0" y="808" width="942" height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

//           {/* bookshelf (right) with potted plant */}
//           <G>
//             <Rect x="845" y="190" width="80" height="18" rx="4" fill="#e8903a" />
//             <Polygon points="852,208 918,208 910,250 860,250" fill="#f0a050" />
//             <G fill="#4cb04a">
//               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(-28 885 198)" />
//               <Ellipse cx="885" cy="140" rx="20" ry="62" fill="#3a9a3c" />
//               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(28 885 198)" />
//             </G>
//             <Rect x="780" y="250" width="162" height="575" fill="#eaa24f" />
//             <Rect x="796" y="266" width="146" height="545" fill="#dc9d4f" />
//             <Rect x="780" y="440" width="162" height="16" fill="#f2b866" />
//             <Rect x="780" y="630" width="162" height="16" fill="#f2b866" />
//             <Rect x="780" y="250" width="162" height="16" fill="#f2b866" />
//             <Rect x="810" y="310" width="36" height="130" fill="#2a9d9d" />
//             <Rect x="850" y="290" width="34" height="150" fill="#f06ba8" />
//             <Rect x="888" y="315" width="40" height="125" fill="#8a63da" />
//             <Rect x="805" y="515" width="30" height="115" fill="#e5484d" />
//             <Rect x="840" y="490" width="24" height="140" fill="#3b82e0" />
//             <Rect x="868" y="510" width="38" height="120" fill="#4caf50" />
//             <Rect x="810" y="695" width="34" height="120" fill="#f5c518" />
//             <Rect x="848" y="665" width="40" height="150" fill="#2c6fdc" />
//           </G>

//           {/* sprout friend (left) */}
//           <Sprout x={10} y={740} s={1} />

//           {/* front meadow, runs to the bottom edge */}
//           <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
//           <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

//           {/* stones */}
//           <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
//           <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
//           <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
//           <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

//           {/* grass tufts + flowers */}
//           <Tuft x="905" y="925" /><Tuft x="910" y="1050" /><Tuft x="20" y="1040" />
//           <Tuft x="100" y="1260" /><Tuft x="340" y="1260" /><Tuft x="580" y="1260" /><Tuft x="820" y="1260" />
//           <Flower x="885" y="815" s={0.8} />
//           <Flower x="200" y="1225" s={0.95} />
//           <Flower x="735" y="1225" s={0.95} />
//         </Svg>
//       </View>
//     </View>
//   );
// }

// /* ---------- thin link chain for the hanging sign (same as Level 3) ---------- */
// function Chain({ h = 28, style }: { h?: number; style?: any }) {
//   const n = Math.max(2, Math.round(h / 8));
//   return (
//     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
//       {Array.from({ length: n }).map((_, i) => (
//         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
//       ))}
//     </Svg>
//   );
// }

// /* ---------- double arrow (skip icon, same as Level 3) ---------- */
// function DoubleArrow({ s }: { s: number }) {
//   return (
//     <Svg width={s} height={s} viewBox="0 0 100 100">
//       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
//       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
//     </Svg>
//   );
// }

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
//   const [question, setQuestion] = useState(QUESTION_FALLBACK);
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
//   const [hintText, setHintText] = useState('');
//   const [hintStep, setHintStep] = useState(1);

//   const gx = useRef(new Animated.Value(0)).current;
//   const gy = useRef(new Animated.Value(0)).current;
//   const grot = useRef(new Animated.Value(0)).current;
//   const sway = useRef(new Animated.Value(0)).current;
//   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // refs so the gesture handler always sees the latest values
//   const levelRef = useRef(level);
//   levelRef.current = level;
//   const phaseRef = useRef<Phase>(phase);
//   phaseRef.current = phase;
//   const phRef = useRef(ph);
//   phRef.current = ph;
//   const startLevelRef = useRef(START_LEVEL);

//   // hanging sign sways gently (same as Level 3)
//   useEffect(() => {
//     const a = Animated.loop(
//       Animated.sequence([
//         Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//         Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//       ]),
//     );
//     a.start();
//     return () => a.stop();
//   }, [sway]);
//   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

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
//       play('btn');
//       await dive(r.outcome || 'hit_bottom', lvl);
//       applyHints(r.hints);
//       if (r.correct) {
//         play('correct');
//         setResult(r);
//         setPhase('won');
//       } else {
//         play('wrong');
//         setMsg(r.message || '');
//         setPhase('failed');
//         resetTimer.current = setTimeout(resetScene, 1600);
//       }
//     } catch (e: any) {
//       setMsg(e?.message || 'Could not reach the server.');
//       setPhase('idle');
//     }
//   };

//   // ---------- magnifier: FREE. frontend -> backend -> MySQL -> JSON -> HINT popup ----------
//   const onHint = async () => {
//     if (phase !== 'idle' || !sessionId) return;
//     setConfirmSkip(false);
//     try {
//       const r = await hintLevel4({ sessionId, playerId });
//       setHintLine(r.hint?.level ?? null); // yellow line on the water
//       setHintStep(r.hint?.step ?? 1); // number comes from the backend
//       setHintText(r.hint?.text || HINT_FALLBACK); // text comes from the backend
//       setMsg('');
//       play('clue');
//       setClueOpen(true);
//       applyHints(r.hints);
//     } catch (e: any) {
//       const m = String(e?.message || '');
//       setMsg(m || 'Could not get the hint.');
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

//   // ---------- shared header (home, settings, hanging sign, hints pill) ----------
//   const header = (
//     <View style={st.topBar}>
//       <View style={st.leftBtns}>
//         <TouchableOpacity
//           style={st.woodBtn}
//           activeOpacity={0.85}
//           onPress={onExit}
//           disabled={phase === 'jumping' || phase === 'sending'}
//         >
//           <Icon n="home" s={20} />
//         </TouchableOpacity>
//         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
//           <Icon n="gear" s={21} />
//         </TouchableOpacity>
//       </View>

//       <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
//         <Chain h={30} style={{ left: 24, top: -6 }} />
//         <Chain h={30} style={{ right: 24, top: -6 }} />
//         <View style={st.sign}>
//           <Text style={st.signArrow}>{'<'}</Text>
//           <Text style={st.signT}>LEVEL 4</Text>
//           <Text style={st.signArrow}>{'>'}</Text>
//         </View>
//       </Animated.View>

//       <View style={st.pillWrap}>
//         <View style={st.pill}>
//           <Text style={st.pillT}>{hints}</Text>
//         </View>
//         <View style={st.pillIcon}>
//           <Icon n="bulb" s={34} />
//         </View>
//       </View>
//     </View>
//   );

//   // ---------- loading / error ----------
//   if (phase === 'loading' || phase === 'error') {
//     return (
//       <Stage bg={SKY}>
//         <View style={st.root}>
//           <Garden />
//           {header}
//           <View style={st.centerMsg}>
//             {phase === 'loading' ? (
//               <ActivityIndicator size="large" color="#fff" />
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
//     <Stage bg={SKY}>
//       <View style={st.root}>
//         <Garden />

//         {header}

//         <View style={st.center}>
//           {/* question pill */}
//           <View style={st.qPill}>
//             <Text style={st.qArrow}>{'<'}</Text>
//             <Text style={st.question}>{question}</Text>
//             <Text style={st.qArrow}>{'>'}</Text>
//           </View>

//           {/* scene (transparent: the garden is behind it) */}
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
//             {phase === 'sending' ? <ActivityIndicator color={NAVY} /> : <Text style={st.primaryT}>JUMP</Text>}
//           </TouchableOpacity>

//           <Text style={st.msg}>{msg || ' '}</Text>
//         </View>

//         {/* bottom wooden panel (smaller, same look as Level 3) */}
//         <View style={st.panel}>
//           <View style={[st.plank, { top: 14, left: 30, right: 30 }]} />
//           <View style={[st.plank, { top: 60, left: 24, right: 24 }]} />
//           <View style={[st.plank, { bottom: 12, left: 30, right: 30 }]} />
//           <View style={[st.screw, { left: 12, top: 12 }]} />
//           <View style={[st.screw, { right: 12, top: 12 }]} />
//           <View style={[st.screw, { left: 12, bottom: 12 }]} />
//           <View style={[st.screw, { right: 12, bottom: 12 }]} />

//           <View style={st.btnCol}>
//             <TouchableOpacity
//               style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }, busy && st.off]}
//               activeOpacity={0.85}
//               onPress={onHint}
//               disabled={busy}
//             >
//               <Icon n="search" s={30} />
//             </TouchableOpacity>
//             {/* the clue is free: no hints or coins are needed */}
//             <View style={st.badge}>
//               <Text style={st.badgeT}>FREE</Text>
//             </View>
//           </View>

//           <View style={st.btnCol}>
//             <TouchableOpacity
//               style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }, busy && st.off]}
//               activeOpacity={0.85}
//               onPress={onReward}
//               disabled={busy}
//             >
//               <Icon n="film" s={34} />
//             </TouchableOpacity>
//             <View style={st.badge}>
//               <Coin s={12} />
//               <Text style={st.badgeT}>+75</Text>
//             </View>
//           </View>

//           <View style={st.btnCol}>
//             <TouchableOpacity
//               style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }, busy && st.off]}
//               activeOpacity={0.85}
//               onPress={onSkip}
//               disabled={busy}
//             >
//               <DoubleArrow s={32} />
//             </TouchableOpacity>
//             <View style={st.badge}>
//               <Icon n="bulb" s={14} />
//               <Text style={st.badgeT}>50</Text>
//             </View>
//           </View>
//         </View>

//         {/* HINT popup (clue board size, only from the magnifier) */}
//         {clueOpen && (
//           <View style={st.overlay}>
//             <View style={st.hintCard}>
//               <TouchableOpacity style={st.hintClose} activeOpacity={0.85} onPress={() => setClueOpen(false)}>
//                 <Icon n="cross" s={16} />
//               </TouchableOpacity>
//               <Text style={st.hintTitle}>HINT</Text>

//               <View style={st.hintRow}>
//                 <View style={st.hintNum}>
//                   <Text style={st.hintNumT}>{hintStep}</Text>
//                 </View>
//                 <Text style={st.hintBody}>{hintText}</Text>
//               </View>
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
//   root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

//   // top
//   topBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 12,
//     paddingTop: 14,
//   },
//   leftBtns: { flexDirection: 'row', gap: 8 },
//   woodBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: YEL_BTN,
//     borderWidth: 2.5,
//     borderColor: YEL_BTN_D,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 3,
//   },
//   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
//   sign: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     paddingHorizontal: 16,
//     height: 44,
//     borderRadius: 6,
//     backgroundColor: '#bd6b29',
//     borderWidth: 3,
//     borderColor: WOOD_DD,
//     elevation: 3,
//   },
//   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
//   signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
//   pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
//   pill: {
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: CREAM,
//     borderWidth: 1.5,
//     borderStyle: 'dashed',
//     borderColor: '#d8c8a8',
//     justifyContent: 'center',
//     paddingLeft: 18,
//     paddingRight: 30,
//     elevation: 3,
//   },
//   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
//   pillIcon: { position: 'absolute', right: -6, top: -4 },

//   // centre (less bottom padding because the panel is smaller now)
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 140 },
//   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
//   qPill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     backgroundColor: CREAM,
//     borderRadius: 32,
//     borderWidth: 2.5,
//     borderColor: CREAM_BORDER,
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     marginBottom: 10,
//     maxWidth: 400,
//     elevation: 3,
//   },
//   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: YELLOW_ARROW },
//   question: { flexShrink: 1, fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },
//   scene: { backgroundColor: 'transparent' },

//   primary: {
//     marginTop: 12,
//     minWidth: 180,
//     height: 54,
//     borderRadius: 27,
//     backgroundColor: '#8fe62d',
//     borderWidth: 4,
//     borderColor: '#d6f58a',
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 4,
//   },
//   primaryT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },
//   off: { opacity: 0.5 },
//   msg: {
//     fontFamily: FONT,
//     fontSize: 15,
//     fontStyle: 'italic',
//     fontWeight: '800',
//     color: '#fff',
//     marginTop: 8,
//     textAlign: 'center',
//     minHeight: 20,
//     paddingHorizontal: 12,
//   },

//   // bottom wooden panel (smaller: solid wood, plank lines, corner rivets)
//   panel: {
//     position: 'absolute',
//     left: 14,
//     right: 14,
//     bottom: 14,
//     height: 118,
//     borderRadius: 38,
//     backgroundColor: WOOD,
//     borderWidth: 5,
//     borderColor: WOOD_D,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     justifyContent: 'space-around',
//     paddingTop: 14,
//     elevation: 6,
//   },
//   plank: { position: 'absolute', height: 2, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
//   screw: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: WOOD_DD },
//   btnCol: { alignItems: 'center' },
//   circleBtn: {
//     width: 62,
//     height: 62,
//     borderRadius: 31,
//     borderWidth: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 5,
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 3,
//     marginTop: 6,
//     minWidth: 62,
//     paddingHorizontal: 10,
//     height: 26,
//     borderRadius: 13,
//     backgroundColor: BADGE,
//   },
//   badgeT: { fontFamily: FONT, fontSize: 14, fontWeight: '900', color: '#fff' },

//   // error
//   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
//   errDetail: { fontFamily: FONT, fontSize: 14, color: '#fff', textAlign: 'center', marginTop: 6 },
//   link: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },

//   // hint popup (clue board size, bigger than before)
//   hintCard: {
//     width: '90%',
//     maxWidth: 360,
//     backgroundColor: CREAM,
//     borderColor: WOOD_D,
//     borderWidth: 6,
//     borderRadius: 26,
//     paddingHorizontal: 18,
//     paddingTop: 20,
//     paddingBottom: 22,
//   },
//   hintTitle: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
//   hintClose: {
//     position: 'absolute',
//     top: -10,
//     right: -10,
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     backgroundColor: WOOD,
//     borderWidth: 3,
//     borderColor: WOOD_D,
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 2,
//   },
//   hintRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     backgroundColor: '#fff',
//     borderColor: '#3ec45a',
//     borderWidth: 2.5,
//     borderRadius: 18,
//     paddingVertical: 16,
//     paddingHorizontal: 14,
//     minHeight: 90,
//   },
//   hintNum: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
//   hintNumT: { fontFamily: FONT, fontSize: 21, fontWeight: '900', color: '#fff' },
//   hintBody: { flex: 1, fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a' },

//   // overlay + win card
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(10,25,60,0.5)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 24,
//   },
//   card: {
//     width: '100%',
//     maxWidth: 340,
//     backgroundColor: CREAM,
//     borderColor: WOOD_D,
//     borderWidth: 8,
//     borderRadius: 28,
//     padding: 22,
//     alignItems: 'center',
//   },
//   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: NAVY, textAlign: 'center' },
//   stars: { fontSize: 36, color: YELLOW_ARROW, marginTop: 8 },
//   cardText: { fontFamily: FONT, fontSize: 17, color: NAVY, marginTop: 6, textAlign: 'center' },
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
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Stage, F, Coin } from './BTShared';
import { Icon } from './Art';
import { Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
import { play } from './BTSound';
import {
  hintLevel4,
  jumpLevel4,
  rewardLevel4,
  skipLevel4,
  startLevel4,
} from './Btlevel4api';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

/* garden palette (same as Level 3) */
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
const YELLOW_ARROW = '#ffb629';
const BADGE = '#6b4423';
const YEL_BTN = '#fbc02d';
const YEL_BTN_D = '#d98e1c';

type Props = {
  playerId: number;
  onHints?: (hints: number) => void;
  onExit: () => void;
  onComplete: (result: any) => void;
};

type Phase = 'loading' | 'error' | 'idle' | 'sending' | 'jumping' | 'failed' | 'won';

// the cylinder starts as a short column of water (like level 9)
const START_LEVEL = 22;

// fallback text only; the real question / hint text comes from the backend JSON
const QUESTION_FALLBACK = 'Help her make a safe jump into the pool!';
const HINT_FALLBACK = 'Drag the water up to the yellow line, then tap JUMP to help her dive safely!';

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
  const [question, setQuestion] = useState(QUESTION_FALLBACK);
  const [hints, setHints] = useState(0);
  const [hintLine, setHintLine] = useState<number | null>(null);
  const [level, setLevel] = useState(START_LEVEL);
  const [pose, setPose] = useState<GirlPose>('stand');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [clueOpen, setClueOpen] = useState(false);
  const [hintText, setHintText] = useState('');
  const [hintStep, setHintStep] = useState(1);

  const gx = useRef(new Animated.Value(0)).current;
  const gy = useRef(new Animated.Value(0)).current;
  const grot = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // refs so the gesture handler always sees the latest values
  const levelRef = useRef(level);
  levelRef.current = level;
  const phaseRef = useRef<Phase>(phase);
  phaseRef.current = phase;
  const phRef = useRef(ph);
  phRef.current = ph;
  const startLevelRef = useRef(START_LEVEL);

  // hanging sign sways gently (same as Level 3)
  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    a.start();
    return () => a.stop();
  }, [sway]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

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
    if (finishTimer.current) clearTimeout(finishTimer.current);
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
      play('btn');
      await dive(r.outcome || 'hit_bottom', lvl);
      applyHints(r.hints);
      if (r.correct) {
        // perfect dive: no win modal, go straight on to the next level
        play('correct');
        setPhase('won'); // keeps every button locked while we leave
        finishTimer.current = setTimeout(() => onComplete(r), 500);
      } else {
        play('wrong');
        setMsg(r.message || '');
        setPhase('failed');
        resetTimer.current = setTimeout(resetScene, 1600);
      }
    } catch (e: any) {
      setMsg(e?.message || 'Could not reach the server.');
      setPhase('idle');
    }
  };

  // ---------- magnifier: FREE. frontend -> backend -> MySQL -> JSON -> HINT popup ----------
  const onHint = async () => {
    if (phase !== 'idle' || !sessionId) return;
    setConfirmSkip(false);
    try {
      const r = await hintLevel4({ sessionId, playerId });
      setHintLine(r.hint?.level ?? null); // yellow line on the water
      setHintStep(r.hint?.step ?? 1); // number comes from the backend
      setHintText(r.hint?.text || HINT_FALLBACK); // text comes from the backend
      setMsg('');
      play('clue');
      setClueOpen(true);
      applyHints(r.hints);
    } catch (e: any) {
      const m = String(e?.message || '');
      setMsg(m || 'Could not get the hint.');
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

  // ---------- shared header (home, settings, hanging sign, hints pill) ----------
  const header = (
    <View style={st.topBar}>
      <View style={st.leftBtns}>
        <TouchableOpacity
          style={st.woodBtn}
          activeOpacity={0.85}
          onPress={onExit}
          disabled={phase === 'jumping' || phase === 'sending'}
        >
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
          <Text style={st.signT}>LEVEL 4</Text>
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

  // ---------- loading / error ----------
  if (phase === 'loading' || phase === 'error') {
    return (
      <Stage bg={SKY}>
        <View style={st.root}>
          <Garden />
          {header}
          <View style={st.centerMsg}>
            {phase === 'loading' ? (
              <ActivityIndicator size="large" color="#fff" />
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
    <Stage bg={SKY}>
      <View style={st.root}>
        <Garden />

        {header}

        <View style={st.center}>
          {/* question pill */}
          <View style={st.qPill}>
            <Text style={st.qArrow}>{'<'}</Text>
            <Text style={st.question}>{question}</Text>
            <Text style={st.qArrow}>{'>'}</Text>
          </View>

          {/* scene (transparent: the garden is behind it) */}
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
            {phase === 'sending' ? <ActivityIndicator color={NAVY} /> : <Text style={st.primaryT}>JUMP</Text>}
          </TouchableOpacity>

          <Text style={st.msg}>{msg || ' '}</Text>
        </View>

        {/* bottom wooden panel (smaller, same look as Level 3) */}
        <View style={st.panel}>
          <View style={[st.plank, { top: 14, left: 30, right: 30 }]} />
          <View style={[st.plank, { top: 60, left: 24, right: 24 }]} />
          <View style={[st.plank, { bottom: 12, left: 30, right: 30 }]} />
          <View style={[st.screw, { left: 12, top: 12 }]} />
          <View style={[st.screw, { right: 12, top: 12 }]} />
          <View style={[st.screw, { left: 12, bottom: 12 }]} />
          <View style={[st.screw, { right: 12, bottom: 12 }]} />

          <View style={st.btnCol}>
            <TouchableOpacity
              style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }, busy && st.off]}
              activeOpacity={0.85}
              onPress={onHint}
              disabled={busy}
            >
              <Icon n="search" s={30} />
            </TouchableOpacity>
            {/* the clue is free: no hints or coins are needed */}
            <View style={st.badge}>
              <Text style={st.badgeT}>FREE</Text>
            </View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity
              style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }, busy && st.off]}
              activeOpacity={0.85}
              onPress={onReward}
              disabled={busy}
            >
              <Icon n="film" s={34} />
            </TouchableOpacity>
            <View style={st.badge}>
              <Coin s={12} />
              <Text style={st.badgeT}>+75</Text>
            </View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity
              style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }, busy && st.off]}
              activeOpacity={0.85}
              onPress={onSkip}
              disabled={busy}
            >
              <DoubleArrow s={32} />
            </TouchableOpacity>
            <View style={st.badge}>
              <Icon n="bulb" s={14} />
              <Text style={st.badgeT}>50</Text>
            </View>
          </View>
        </View>

        {/* HINT popup (clue board size, only from the magnifier) */}
        {clueOpen && (
          <View style={st.overlay}>
            <View style={st.hintCard}>
              <TouchableOpacity style={st.hintClose} activeOpacity={0.85} onPress={() => setClueOpen(false)}>
                <Icon n="cross" s={16} />
              </TouchableOpacity>
              <Text style={st.hintTitle}>HINT</Text>

              <View style={st.hintRow}>
                <View style={st.hintNum}>
                  <Text style={st.hintNumT}>{hintStep}</Text>
                </View>
                <Text style={st.hintBody}>{hintText}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </Stage>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

  // top
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 14,
  },
  leftBtns: { flexDirection: 'row', gap: 8 },
  woodBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: YEL_BTN,
    borderWidth: 2.5,
    borderColor: YEL_BTN_D,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
  sign: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#bd6b29',
    borderWidth: 3,
    borderColor: WOOD_DD,
    elevation: 3,
  },
  signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
  pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
  pill: {
    height: 32,
    borderRadius: 16,
    backgroundColor: CREAM,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#d8c8a8',
    justifyContent: 'center',
    paddingLeft: 18,
    paddingRight: 30,
    elevation: 3,
  },
  pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
  pillIcon: { position: 'absolute', right: -6, top: -4 },

  // centre (less bottom padding because the panel is smaller now)
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 140 },
  centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  qPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: CREAM,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: CREAM_BORDER,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginBottom: 10,
    maxWidth: 400,
    elevation: 3,
  },
  qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: YELLOW_ARROW },
  question: { flexShrink: 1, fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },
  scene: { backgroundColor: 'transparent' },

  primary: {
    marginTop: 12,
    minWidth: 180,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#8fe62d',
    borderWidth: 4,
    borderColor: '#d6f58a',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  primaryT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },
  off: { opacity: 0.5 },
  msg: {
    fontFamily: FONT,
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
    minHeight: 20,
    paddingHorizontal: 12,
  },

  // bottom wooden panel (smaller: solid wood, plank lines, corner rivets)
  panel: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    height: 118,
    borderRadius: 38,
    backgroundColor: WOOD,
    borderWidth: 5,
    borderColor: WOOD_D,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: 14,
    elevation: 6,
  },
  plank: { position: 'absolute', height: 2, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
  screw: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: WOOD_DD },
  btnCol: { alignItems: 'center' },
  circleBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    marginTop: 6,
    minWidth: 62,
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 13,
    backgroundColor: BADGE,
  },
  badgeT: { fontFamily: FONT, fontSize: 14, fontWeight: '900', color: '#fff' },

  // error
  errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
  errDetail: { fontFamily: FONT, fontSize: 14, color: '#fff', textAlign: 'center', marginTop: 6 },
  link: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },

  // hint popup (clue board size, bigger than before)
  hintCard: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: CREAM,
    borderColor: WOOD_D,
    borderWidth: 6,
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 22,
  },
  hintTitle: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
  hintClose: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: WOOD,
    borderWidth: 3,
    borderColor: WOOD_D,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderColor: '#3ec45a',
    borderWidth: 2.5,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    minHeight: 90,
  },
  hintNum: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
  hintNumT: { fontFamily: FONT, fontSize: 21, fontWeight: '900', color: '#fff' },
  hintBody: { flex: 1, fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a' },

  // overlay (used by the hint popup)
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,25,60,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
