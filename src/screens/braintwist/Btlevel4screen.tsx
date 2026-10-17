// // // // // // src/screens/braintwist/Btlevel4screen.tsx
// // // // // //
// // // // // // TEMPORARY Level 4 screen.
// // // // // // It only exists so the import in BTGameScreen.tsx works (the real file was never created).
// // // // // // The real chalkboard Level 4 game replaces this file later.
// // // // // //
// // // // // // Props are the same ones BTGameScreen.tsx already passes:
// // // // // //   playerId, onHints, onExit, onComplete

// // // // // import React from 'react';
// // // // // import {View,Text,TouchableOpacity,StyleSheet,Platform} from 'react-native';
// // // // // import {Stage} from './BTShared';

// // // // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // // // // type Props={
// // // // //   playerId:number;
// // // // //   onHints?:(hints:number)=>void;
// // // // //   onExit:()=>void;
// // // // //   onComplete:(result:any)=>void;
// // // // // };

// // // // // export default function BTLevel4Screen({onExit,onComplete}:Props){
// // // // //   return <Stage bg="#f4e4c6">
// // // // //     <View style={st.frame}>
// // // // //       <View style={st.board}>
// // // // //         <Text style={st.level}>LEVEL 4</Text>
// // // // //         <Text style={st.title}>Coming soon</Text>
// // // // //         <Text style={st.text}>This level is being built.</Text>

// // // // //         <TouchableOpacity style={st.back} activeOpacity={0.85} onPress={onExit}>
// // // // //           <Text style={st.backT}>Back</Text>
// // // // //         </TouchableOpacity>

// // // // //         {/* temporary: lets you test level 5 while level 4 is not ready */}
// // // // //         <TouchableOpacity activeOpacity={0.85}
// // // // //           onPress={()=>onComplete({attempts:1,skipped:true,message:'Level skipped'})}>
// // // // //           <Text style={st.skip}>Skip level (temporary)</Text>
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //     </View>
// // // // //   </Stage>;
// // // // // }

// // // // // const st=StyleSheet.create({
// // // // //   frame:{flex:1,margin:8,backgroundColor:'#e08a2e',borderRadius:22,padding:9},
// // // // //   board:{flex:1,backgroundColor:'#1d6a49',borderRadius:14,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // // // //   level:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:'#ffd33d',letterSpacing:1},
// // // // //   title:{fontFamily:FONT,fontSize:38,fontWeight:'700',color:'#fff',marginTop:8},
// // // // //   text:{fontFamily:FONT,fontSize:18,color:'#d8f3e3',marginTop:8,textAlign:'center'},
// // // // //   back:{marginTop:28,minWidth:160,height:54,borderRadius:27,backgroundColor:'#a6e22e',borderWidth:3,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
// // // // //   backT:{fontFamily:FONT,fontSize:24,fontWeight:'900',color:'#1b1b1b'},
// // // // //   skip:{fontFamily:FONT,fontSize:15,color:'#d8f3e3',marginTop:18,textDecorationLine:'underline'},
// // // // // });
// // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // import {
// // // //   ActivityIndicator,
// // // //   Animated,
// // // //   Easing,
// // // //   Platform,
// // // //   ScrollView,
// // // //   StyleSheet,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   View,
// // // //   useWindowDimensions,
// // // // } from 'react-native';
// // // // import { Stage } from './BTShared';
// // // // import { Board, Fish, Girl, Pool, Rays, Splash } from './Btlevel4art';
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

// // // // const MIN_LEVEL = 25; // keeps the fish inside the water
// // // // const MAX_LEVEL = 100;
// // // // const STEP = 1.2; // water % per tick while holding
// // // // const TICK_MS = 50;

// // // // export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // // //   const { width } = useWindowDimensions();

// // // //   // ---------- scene geometry ----------
// // // //   const W = Math.min(width - 56, 340);
// // // //   const H = Math.round(W * 1.06);
// // // //   const gw = 34;
// // // //   const gh = Math.round(gw * (88 / 48));
// // // //   const bw = Math.round(W * 0.42);
// // // //   const boardTop = Math.round(H * 0.3);
// // // //   const pw = Math.round(W * 0.64);
// // // //   const ph = Math.round(H * 0.36);
// // // //   const poolLeft = Math.round((W - pw) / 2);
// // // //   const poolTop = H - 14 - ph;
// // // //   const girlLeft = W - bw + 8;
// // // //   const girlTop = boardTop + 4 - gh; // feet on the board
// // // //   const startCx = girlLeft + gw / 2;
// // // //   const startCy = girlTop + gh / 2;

// // // //   // ---------- state ----------
// // // //   const [phase, setPhase] = useState<Phase>('loading');
// // // //   const [sessionId, setSessionId] = useState<number | null>(null);
// // // //   const [question, setQuestion] = useState('She must do a dive jump successfully.');
// // // //   const [hints, setHints] = useState(0);
// // // //   const [hintLine, setHintLine] = useState<number | null>(null);
// // // //   const [level, setLevel] = useState(MIN_LEVEL);
// // // //   const [msg, setMsg] = useState('');
// // // //   const [error, setError] = useState('');
// // // //   const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
// // // //   const [caughtAt, setCaughtAt] = useState<{ left: number; top: number } | null>(null);
// // // //   const [result, setResult] = useState<Level4Answer | null>(null);
// // // //   const [confirmSkip, setConfirmSkip] = useState(false);

// // // //   const gx = useRef(new Animated.Value(0)).current;
// // // //   const gy = useRef(new Animated.Value(0)).current;
// // // //   const grot = useRef(new Animated.Value(0)).current;
// // // //   const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
// // // //   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

// // // //   const stopHold = useCallback(() => {
// // // //     if (holdRef.current) {
// // // //       clearInterval(holdRef.current);
// // // //       holdRef.current = null;
// // // //     }
// // // //   }, []);

// // // //   useEffect(
// // // //     () => () => {
// // // //       stopHold();
// // // //       if (resetTimer.current) clearTimeout(resetTimer.current);
// // // //     },
// // // //     [stopHold],
// // // //   );

// // // //   // ---------- raise / drain the water ----------
// // // //   const startHold = (delta: number) => {
// // // //     if (phase !== 'idle' || holdRef.current) return;
// // // //     setMsg('');
// // // //     setConfirmSkip(false);
// // // //     holdRef.current = setInterval(() => {
// // // //       setLevel((l) => Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, l + delta)));
// // // //     }, TICK_MS);
// // // //   };

// // // //   // ---------- dive animation (girl jumps by herself) ----------
// // // //   const dive = (outcome: string, lvl: number) =>
// // // //     new Promise<void>((resolve) => {
// // // //       const poolBottom = poolTop + ph;
// // // //       const surface = poolTop + ph * (1 - lvl / 100);
// // // //       let cy: number;
// // // //       if (outcome === 'splash') cy = poolBottom - gh / 2 - 6;
// // // //       else if (outcome === 'too_shallow') cy = surface - gh / 2 + 10;
// // // //       else cy = poolBottom - gh / 2 - 2;

// // // //       const dx = W / 2 - startCx;
// // // //       const dy = cy - startCy;

// // // //       Animated.parallel([
// // // //         Animated.timing(gx, { toValue: dx, duration: 800, easing: Easing.linear, useNativeDriver: false }),
// // // //         Animated.sequence([
// // // //           Animated.timing(gy, { toValue: -26, duration: 250, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// // // //           Animated.timing(gy, { toValue: dy, duration: 550, easing: Easing.in(Easing.quad), useNativeDriver: false }),
// // // //         ]),
// // // //         Animated.timing(grot, { toValue: 1, duration: 800, delay: 120, easing: Easing.linear, useNativeDriver: false }),
// // // //       ]).start(() => {
// // // //         setSplash({ left: W / 2 - 28, top: surface - 30 });
// // // //         if (outcome === 'splash') setCaughtAt({ left: W / 2 + 8, top: cy - 12 });
// // // //         setTimeout(() => {
// // // //           setSplash(null);
// // // //           resolve();
// // // //         }, 700);
// // // //       });
// // // //     });

// // // //   const resetScene = useCallback(() => {
// // // //     gx.setValue(0);
// // // //     gy.setValue(0);
// // // //     grot.setValue(0);
// // // //     setSplash(null);
// // // //     setCaughtAt(null);
// // // //     setPhase('idle');
// // // //   }, [gx, gy, grot]);

// // // //   // ---------- JUMP: frontend -> backend -> MySQL -> JSON -> animate ----------
// // // //   const onJump = async () => {
// // // //     if (phase !== 'idle' || !sessionId) return;
// // // //     stopHold();
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
// // // //         setMsg(r.message || 'Try again!');
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
// // // //   const caught = phase === 'won';

// // // //   // ---------- render ----------
// // // //   if (phase === 'loading' || phase === 'error') {
// // // //     return (
// // // //       <Stage bg="#f4e4c6">
// // // //         <View style={st.frame}>
// // // //           <View style={[st.board, { justifyContent: 'center' }]}>
// // // //             {phase === 'loading' ? (
// // // //               <ActivityIndicator size="large" color="#ffd33d" />
// // // //             ) : (
// // // //               <>
// // // //                 <Text style={st.errText}>{error}</Text>
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

// // // //   return (
// // // //     <Stage bg="#f4e4c6">
// // // //       <View style={st.frame}>
// // // //         <View style={st.board}>
// // // //           {/* top bar */}
// // // //           <View style={st.topBar}>
// // // //             <TouchableOpacity style={st.round} activeOpacity={0.85} onPress={onExit} disabled={phase === 'jumping' || phase === 'sending'}>
// // // //               <Text style={st.roundT}>⚙</Text>
// // // //             </TouchableOpacity>
// // // //             <Text style={st.level}>LEVEL 4</Text>
// // // //             <View style={st.pill}>
// // // //               <Text style={st.pillT}>{hints}</Text>
// // // //               <Text style={st.pillIcon}>💡</Text>
// // // //             </View>
// // // //           </View>

// // // //           <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>
// // // //             <Text style={st.question}>{question}</Text>

// // // //             {/* scene */}
// // // //             <View style={[st.scene, { width: W, height: H }]}>
// // // //               <View style={StyleSheet.absoluteFill}>
// // // //                 <Rays w={W} h={H} />
// // // //               </View>

// // // //               <View style={{ position: 'absolute', left: W - bw, top: boardTop }}>
// // // //                 <Board w={bw} />
// // // //               </View>

// // // //               <View style={{ position: 'absolute', left: poolLeft, top: poolTop }}>
// // // //                 <Pool w={pw} h={ph} level={level} hintLevel={hintLine} fishHidden={caught} />
// // // //               </View>

// // // //               {caughtAt && (
// // // //                 <View style={{ position: 'absolute', left: caughtAt.left, top: caughtAt.top }}>
// // // //                   <Fish w={30} />
// // // //                 </View>
// // // //               )}

// // // //               <Animated.View
// // // //                 style={{
// // // //                   position: 'absolute',
// // // //                   left: girlLeft,
// // // //                   top: girlTop,
// // // //                   width: gw,
// // // //                   height: gh,
// // // //                   transform: [
// // // //                     { translateX: gx },
// // // //                     { translateY: gy },
// // // //                     { rotate: grot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) },
// // // //                   ],
// // // //                 }}
// // // //               >
// // // //                 <Girl w={gw} />
// // // //               </Animated.View>

// // // //               {splash && (
// // // //                 <View style={{ position: 'absolute', left: splash.left, top: splash.top }}>
// // // //                   <Splash w={56} />
// // // //                 </View>
// // // //               )}
// // // //             </View>

// // // //             {/* water controls */}
// // // //             <View style={st.row}>
// // // //               <TouchableOpacity
// // // //                 style={[st.ctrl, busy && st.off]}
// // // //                 disabled={busy}
// // // //                 activeOpacity={0.85}
// // // //                 onPressIn={() => startHold(-STEP)}
// // // //                 onPressOut={stopHold}
// // // //               >
// // // //                 <Text style={st.ctrlT}>Drain</Text>
// // // //               </TouchableOpacity>
// // // //               <TouchableOpacity
// // // //                 style={[st.ctrl, st.ctrlBlue, busy && st.off]}
// // // //                 disabled={busy}
// // // //                 activeOpacity={0.85}
// // // //                 onPressIn={() => startHold(STEP)}
// // // //                 onPressOut={stopHold}
// // // //               >
// // // //                 <Text style={st.ctrlT}>Hold to raise water</Text>
// // // //               </TouchableOpacity>
// // // //             </View>

// // // //             <TouchableOpacity style={[st.primary, busy && st.off]} disabled={busy} activeOpacity={0.85} onPress={onJump}>
// // // //               {phase === 'sending' ? <ActivityIndicator color="#1b1b1b" /> : <Text style={st.primaryT}>JUMP</Text>}
// // // //             </TouchableOpacity>

// // // //             <Text style={st.msg}>{msg || ' '}</Text>
// // // //           </ScrollView>

// // // //           {/* bottom bar */}
// // // //           <View style={st.bottomBar}>
// // // //             <TouchableOpacity style={[st.round, busy && st.off]} activeOpacity={0.85} onPress={onHint} disabled={busy}>
// // // //               <Text style={st.roundT}>🔍</Text>
// // // //               <Text style={st.cost}>25</Text>
// // // //             </TouchableOpacity>
// // // //             <View style={{ flexDirection: 'row', gap: 12 }}>
// // // //               <TouchableOpacity style={[st.round, busy && st.off]} activeOpacity={0.85} onPress={onReward} disabled={busy}>
// // // //                 <Text style={st.roundT}>🎬</Text>
// // // //                 <Text style={st.cost}>+75</Text>
// // // //               </TouchableOpacity>
// // // //               <TouchableOpacity
// // // //                 style={[st.round, st.roundRed, busy && st.off]}
// // // //                 activeOpacity={0.85}
// // // //                 onPress={onSkip}
// // // //                 disabled={busy}
// // // //               >
// // // //                 <Text style={st.roundT}>⏭</Text>
// // // //                 <Text style={st.cost}>50</Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </View>
// // // //         </View>

// // // //         {/* win card */}
// // // //         {phase === 'won' && result && (
// // // //           <View style={st.overlay}>
// // // //             <View style={st.card}>
// // // //               <Text style={st.cardTitle}>{result.message || 'She caught the fish!'}</Text>
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
// // // //   frame: { flex: 1, margin: 8, backgroundColor: '#e08a2e', borderRadius: 22, padding: 9 },
// // // //   board: { flex: 1, backgroundColor: '#1d6a49', borderRadius: 14, paddingTop: 10 },
// // // //   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
// // // //   level: { fontFamily: FONT, fontSize: 22, fontWeight: '800', color: '#ffd33d', letterSpacing: 1 },
// // // //   pill: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 4,
// // // //     height: 34,
// // // //     paddingHorizontal: 12,
// // // //     borderRadius: 17,
// // // //     backgroundColor: '#fff',
// // // //     borderWidth: 2,
// // // //     borderColor: '#1b1b1b',
// // // //   },
// // // //   pillT: { fontFamily: FONT, fontSize: 16, fontWeight: '900', color: '#1b1b1b' },
// // // //   pillIcon: { fontSize: 16 },
// // // //   scroll: { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8 },
// // // //   question: { fontFamily: FONT, fontSize: 17, color: '#fff', textAlign: 'center', marginBottom: 10 },
// // // //   scene: { backgroundColor: '#7fb9c9', borderRadius: 14, overflow: 'hidden' },
// // // //   row: { flexDirection: 'row', gap: 10, marginTop: 12 },
// // // //   ctrl: {
// // // //     height: 42,
// // // //     paddingHorizontal: 16,
// // // //     borderRadius: 21,
// // // //     backgroundColor: '#fff',
// // // //     borderWidth: 2.5,
// // // //     borderColor: '#1b1b1b',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   ctrlBlue: { backgroundColor: '#8ee0ff' },
// // // //   ctrlT: { fontFamily: FONT, fontSize: 16, fontWeight: '800', color: '#1b1b1b' },
// // // //   primary: {
// // // //     marginTop: 12,
// // // //     minWidth: 160,
// // // //     height: 54,
// // // //     borderRadius: 27,
// // // //     backgroundColor: '#a6e22e',
// // // //     borderWidth: 3,
// // // //     borderColor: '#1b1b1b',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   primaryT: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: '#1b1b1b' },
// // // //   off: { opacity: 0.5 },
// // // //   msg: { fontFamily: FONT, fontSize: 15, color: '#d8f3e3', marginTop: 10, textAlign: 'center', minHeight: 20 },
// // // //   bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 10 },
// // // //   round: {
// // // //     width: 46,
// // // //     height: 46,
// // // //     borderRadius: 23,
// // // //     backgroundColor: '#a6e22e',
// // // //     borderWidth: 2.5,
// // // //     borderColor: '#1b1b1b',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   roundRed: { backgroundColor: '#ff6b6b' },
// // // //   roundT: { fontSize: 20, color: '#1b1b1b' },
// // // //   cost: {
// // // //     position: 'absolute',
// // // //     right: -6,
// // // //     bottom: -6,
// // // //     fontFamily: FONT,
// // // //     fontSize: 11,
// // // //     fontWeight: '900',
// // // //     color: '#1b1b1b',
// // // //     backgroundColor: '#ffd33d',
// // // //     borderRadius: 8,
// // // //     paddingHorizontal: 4,
// // // //     overflow: 'hidden',
// // // //   },
// // // //   errText: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// // // //   link: { fontFamily: FONT, fontSize: 16, color: '#d8f3e3', marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },
// // // //   overlay: {
// // // //     ...StyleSheet.absoluteFillObject,
// // // //     backgroundColor: 'rgba(0,0,0,0.55)',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     padding: 24,
// // // //     borderRadius: 22,
// // // //   },
// // // //   card: {
// // // //     width: '100%',
// // // //     maxWidth: 340,
// // // //     backgroundColor: '#1d6a49',
// // // //     borderColor: '#e08a2e',
// // // //     borderWidth: 8,
// // // //     borderRadius: 24,
// // // //     padding: 22,
// // // //     alignItems: 'center',
// // // //   },
// // // //   cardTitle: { fontFamily: FONT, fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center' },
// // // //   stars: { fontSize: 36, color: '#ffd33d', marginTop: 8 },
// // // //   cardText: { fontFamily: FONT, fontSize: 17, color: '#d8f3e3', marginTop: 6, textAlign: 'center' },
// // // // });
// // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // import {
// // //   ActivityIndicator,
// // //   Animated,
// // //   Easing,
// // //   Platform,
// // //   ScrollView,
// // //   StyleSheet,
// // //   Text,
// // //   TouchableOpacity,
// // //   View,
// // //   useWindowDimensions,
// // // } from 'react-native';
// // // import { Stage } from './BTShared';
// // // import { Board, Fish, Girl, Pool, Rays, Splash } from './Btlevel4art';
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

// // // const MIN_LEVEL = 25; // keeps the fish inside the water
// // // const MAX_LEVEL = 100;
// // // const STEP = 1.2; // water % per tick while holding
// // // const TICK_MS = 50;

// // // export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
// // //   const { width } = useWindowDimensions();

// // //   // ---------- scene geometry ----------
// // //   const W = Math.min(width - 56, 340);
// // //   const H = Math.round(W * 1.06);
// // //   const gw = 34;
// // //   const gh = Math.round(gw * (88 / 48));
// // //   const bw = Math.round(W * 0.42);
// // //   const boardTop = Math.round(H * 0.3);
// // //   const pw = Math.round(W * 0.64);
// // //   const ph = Math.round(H * 0.36);
// // //   const poolLeft = Math.round((W - pw) / 2);
// // //   const poolTop = H - 14 - ph;
// // //   const girlLeft = W - bw + 8;
// // //   const girlTop = boardTop + 4 - gh; // feet on the board
// // //   const startCx = girlLeft + gw / 2;
// // //   const startCy = girlTop + gh / 2;

// // //   // ---------- state ----------
// // //   const [phase, setPhase] = useState<Phase>('loading');
// // //   const [sessionId, setSessionId] = useState<number | null>(null);
// // //   const [question, setQuestion] = useState('She must do a dive jump successfully.');
// // //   const [hints, setHints] = useState(0);
// // //   const [hintLine, setHintLine] = useState<number | null>(null);
// // //   const [level, setLevel] = useState(MIN_LEVEL);
// // //   const [msg, setMsg] = useState('');
// // //   const [error, setError] = useState('');
// // //   const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
// // //   const [caughtAt, setCaughtAt] = useState<{ left: number; top: number } | null>(null);
// // //   const [result, setResult] = useState<Level4Answer | null>(null);
// // //   const [confirmSkip, setConfirmSkip] = useState(false);

// // //   const gx = useRef(new Animated.Value(0)).current;
// // //   const gy = useRef(new Animated.Value(0)).current;
// // //   const grot = useRef(new Animated.Value(0)).current;
// // //   const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
// // //   const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

// // //   const stopHold = useCallback(() => {
// // //     if (holdRef.current) {
// // //       clearInterval(holdRef.current);
// // //       holdRef.current = null;
// // //     }
// // //   }, []);

// // //   useEffect(
// // //     () => () => {
// // //       stopHold();
// // //       if (resetTimer.current) clearTimeout(resetTimer.current);
// // //     },
// // //     [stopHold],
// // //   );

// // //   // ---------- raise / drain the water ----------
// // //   const startHold = (delta: number) => {
// // //     if (phase !== 'idle' || holdRef.current) return;
// // //     setMsg('');
// // //     setConfirmSkip(false);
// // //     holdRef.current = setInterval(() => {
// // //       setLevel((l) => Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, l + delta)));
// // //     }, TICK_MS);
// // //   };

// // //   // ---------- dive animation (girl jumps by herself) ----------
// // //   const dive = (outcome: string, lvl: number) =>
// // //     new Promise<void>((resolve) => {
// // //       const poolBottom = poolTop + ph;
// // //       const surface = poolTop + ph * (1 - lvl / 100);
// // //       let cy: number;
// // //       if (outcome === 'splash') cy = poolBottom - gh / 2 - 6;
// // //       else if (outcome === 'too_shallow') cy = surface - gh / 2 + 10;
// // //       else cy = poolBottom - gh / 2 - 2;

// // //       const dx = W / 2 - startCx;
// // //       const dy = cy - startCy;

// // //       Animated.parallel([
// // //         Animated.timing(gx, { toValue: dx, duration: 800, easing: Easing.linear, useNativeDriver: false }),
// // //         Animated.sequence([
// // //           Animated.timing(gy, { toValue: -26, duration: 250, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// // //           Animated.timing(gy, { toValue: dy, duration: 550, easing: Easing.in(Easing.quad), useNativeDriver: false }),
// // //         ]),
// // //         Animated.timing(grot, { toValue: 1, duration: 800, delay: 120, easing: Easing.linear, useNativeDriver: false }),
// // //       ]).start(() => {
// // //         setSplash({ left: W / 2 - 28, top: surface - 30 });
// // //         if (outcome === 'splash') setCaughtAt({ left: W / 2 + 8, top: cy - 12 });
// // //         setTimeout(() => {
// // //           setSplash(null);
// // //           resolve();
// // //         }, 700);
// // //       });
// // //     });

// // //   const resetScene = useCallback(() => {
// // //     gx.setValue(0);
// // //     gy.setValue(0);
// // //     grot.setValue(0);
// // //     setSplash(null);
// // //     setCaughtAt(null);
// // //     setPhase('idle');
// // //   }, [gx, gy, grot]);

// // //   // ---------- JUMP: frontend -> backend -> MySQL -> JSON -> animate ----------
// // //   const onJump = async () => {
// // //     if (phase !== 'idle' || !sessionId) return;
// // //     stopHold();
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
// // //         setMsg(r.message || 'Try again!');
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
// // //       setMsg(r.hint?.text || 'Raise the water up to the line.');
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
// // //   const caught = phase === 'won';

// // //   // ---------- render ----------
// // //   if (phase === 'loading' || phase === 'error') {
// // //     return (
// // //       <Stage bg="#f4e4c6">
// // //         <View style={st.frame}>
// // //           <View style={[st.board, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }]}>
// // //             <Text style={[st.level, { marginBottom: 16 }]}>LEVEL 4</Text>
// // //             {phase === 'loading' ? (
// // //               <ActivityIndicator size="large" color="#ffd33d" />
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

// // //   return (
// // //     <Stage bg="#f4e4c6">
// // //       <View style={st.frame}>
// // //         <View style={st.board}>
// // //           {/* top bar */}
// // //           <View style={st.topBar}>
// // //             <TouchableOpacity style={st.round} activeOpacity={0.85} onPress={onExit} disabled={phase === 'jumping' || phase === 'sending'}>
// // //               <Text style={st.roundT}>⚙</Text>
// // //             </TouchableOpacity>
// // //             <Text style={st.level}>LEVEL 4</Text>
// // //             <View style={st.pill}>
// // //               <Text style={st.pillT}>{hints}</Text>
// // //               <Text style={st.pillIcon}>💡</Text>
// // //             </View>
// // //           </View>

// // //           <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>
// // //             <Text style={st.question}>{question}</Text>

// // //             {/* scene */}
// // //             <View style={[st.scene, { width: W, height: H }]}>
// // //               <View style={StyleSheet.absoluteFill}>
// // //                 <Rays w={W} h={H} />
// // //               </View>

// // //               <View style={{ position: 'absolute', left: W - bw, top: boardTop }}>
// // //                 <Board w={bw} />
// // //               </View>

// // //               <View style={{ position: 'absolute', left: poolLeft, top: poolTop }}>
// // //                 <Pool w={pw} h={ph} level={level} hintLevel={hintLine} fishHidden={caught} />
// // //               </View>

// // //               {caughtAt && (
// // //                 <View style={{ position: 'absolute', left: caughtAt.left, top: caughtAt.top }}>
// // //                   <Fish w={30} />
// // //                 </View>
// // //               )}

// // //               <Animated.View
// // //                 style={{
// // //                   position: 'absolute',
// // //                   left: girlLeft,
// // //                   top: girlTop,
// // //                   width: gw,
// // //                   height: gh,
// // //                   transform: [
// // //                     { translateX: gx },
// // //                     { translateY: gy },
// // //                     { rotate: grot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) },
// // //                   ],
// // //                 }}
// // //               >
// // //                 <Girl w={gw} />
// // //               </Animated.View>

// // //               {splash && (
// // //                 <View style={{ position: 'absolute', left: splash.left, top: splash.top }}>
// // //                   <Splash w={56} />
// // //                 </View>
// // //               )}
// // //             </View>

// // //             {/* water controls */}
// // //             <View style={st.row}>
// // //               <TouchableOpacity
// // //                 style={[st.ctrl, busy && st.off]}
// // //                 disabled={busy}
// // //                 activeOpacity={0.85}
// // //                 onPressIn={() => startHold(-STEP)}
// // //                 onPressOut={stopHold}
// // //               >
// // //                 <Text style={st.ctrlT}>Drain</Text>
// // //               </TouchableOpacity>
// // //               <TouchableOpacity
// // //                 style={[st.ctrl, st.ctrlBlue, busy && st.off]}
// // //                 disabled={busy}
// // //                 activeOpacity={0.85}
// // //                 onPressIn={() => startHold(STEP)}
// // //                 onPressOut={stopHold}
// // //               >
// // //                 <Text style={st.ctrlT}>Hold to raise water</Text>
// // //               </TouchableOpacity>
// // //             </View>

// // //             <TouchableOpacity style={[st.primary, busy && st.off]} disabled={busy} activeOpacity={0.85} onPress={onJump}>
// // //               {phase === 'sending' ? <ActivityIndicator color="#1b1b1b" /> : <Text style={st.primaryT}>JUMP</Text>}
// // //             </TouchableOpacity>

// // //             <Text style={st.msg}>{msg || ' '}</Text>
// // //           </ScrollView>

// // //           {/* bottom bar */}
// // //           <View style={st.bottomBar}>
// // //             <TouchableOpacity style={[st.round, busy && st.off]} activeOpacity={0.85} onPress={onHint} disabled={busy}>
// // //               <Text style={st.roundT}>🔍</Text>
// // //               <Text style={st.cost}>25</Text>
// // //             </TouchableOpacity>
// // //             <View style={{ flexDirection: 'row', gap: 12 }}>
// // //               <TouchableOpacity style={[st.round, busy && st.off]} activeOpacity={0.85} onPress={onReward} disabled={busy}>
// // //                 <Text style={st.roundT}>🎬</Text>
// // //                 <Text style={st.cost}>+75</Text>
// // //               </TouchableOpacity>
// // //               <TouchableOpacity
// // //                 style={[st.round, st.roundRed, busy && st.off]}
// // //                 activeOpacity={0.85}
// // //                 onPress={onSkip}
// // //                 disabled={busy}
// // //               >
// // //                 <Text style={st.roundT}>⏭</Text>
// // //                 <Text style={st.cost}>50</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* win card */}
// // //         {phase === 'won' && result && (
// // //           <View style={st.overlay}>
// // //             <View style={st.card}>
// // //               <Text style={st.cardTitle}>{result.message || 'She caught the fish!'}</Text>
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
// // //   frame: { flex: 1, margin: 8, backgroundColor: '#e08a2e', borderRadius: 22, padding: 9 },
// // //   board: { flex: 1, backgroundColor: '#1d6a49', borderRadius: 14, paddingTop: 10 },
// // //   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
// // //   level: { fontFamily: FONT, fontSize: 22, fontWeight: '800', color: '#ffd33d', letterSpacing: 1 },
// // //   pill: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 4,
// // //     height: 34,
// // //     paddingHorizontal: 12,
// // //     borderRadius: 17,
// // //     backgroundColor: '#fff',
// // //     borderWidth: 2,
// // //     borderColor: '#1b1b1b',
// // //   },
// // //   pillT: { fontFamily: FONT, fontSize: 16, fontWeight: '900', color: '#1b1b1b' },
// // //   pillIcon: { fontSize: 16 },
// // //   scroll: { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8 },
// // //   question: { fontFamily: FONT, fontSize: 17, color: '#fff', textAlign: 'center', marginBottom: 10 },
// // //   scene: { backgroundColor: '#7fb9c9', borderRadius: 14, overflow: 'hidden' },
// // //   row: { flexDirection: 'row', gap: 10, marginTop: 12 },
// // //   ctrl: {
// // //     height: 42,
// // //     paddingHorizontal: 16,
// // //     borderRadius: 21,
// // //     backgroundColor: '#fff',
// // //     borderWidth: 2.5,
// // //     borderColor: '#1b1b1b',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   ctrlBlue: { backgroundColor: '#8ee0ff' },
// // //   ctrlT: { fontFamily: FONT, fontSize: 16, fontWeight: '800', color: '#1b1b1b' },
// // //   primary: {
// // //     marginTop: 12,
// // //     minWidth: 160,
// // //     height: 54,
// // //     borderRadius: 27,
// // //     backgroundColor: '#a6e22e',
// // //     borderWidth: 3,
// // //     borderColor: '#1b1b1b',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   primaryT: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: '#1b1b1b' },
// // //   off: { opacity: 0.5 },
// // //   msg: { fontFamily: FONT, fontSize: 15, color: '#d8f3e3', marginTop: 10, textAlign: 'center', minHeight: 20 },
// // //   bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 10 },
// // //   round: {
// // //     width: 46,
// // //     height: 46,
// // //     borderRadius: 23,
// // //     backgroundColor: '#a6e22e',
// // //     borderWidth: 2.5,
// // //     borderColor: '#1b1b1b',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   roundRed: { backgroundColor: '#ff6b6b' },
// // //   roundT: { fontSize: 20, color: '#1b1b1b' },
// // //   cost: {
// // //     position: 'absolute',
// // //     right: -6,
// // //     bottom: -6,
// // //     fontFamily: FONT,
// // //     fontSize: 11,
// // //     fontWeight: '900',
// // //     color: '#1b1b1b',
// // //     backgroundColor: '#ffd33d',
// // //     borderRadius: 8,
// // //     paddingHorizontal: 4,
// // //     overflow: 'hidden',
// // //   },
// // //   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
// // //   errDetail: { fontFamily: FONT, fontSize: 14, color: '#d8f3e3', textAlign: 'center', marginTop: 6 },
// // //   link: { fontFamily: FONT, fontSize: 16, color: '#d8f3e3', marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },
// // //   overlay: {
// // //     ...StyleSheet.absoluteFillObject,
// // //     backgroundColor: 'rgba(0,0,0,0.55)',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     padding: 24,
// // //     borderRadius: 22,
// // //   },
// // //   card: {
// // //     width: '100%',
// // //     maxWidth: 340,
// // //     backgroundColor: '#1d6a49',
// // //     borderColor: '#e08a2e',
// // //     borderWidth: 8,
// // //     borderRadius: 24,
// // //     padding: 22,
// // //     alignItems: 'center',
// // //   },
// // //   cardTitle: { fontFamily: FONT, fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center' },
// // //   stars: { fontSize: 36, color: '#ffd33d', marginTop: 8 },
// // //   cardText: { fontFamily: FONT, fontSize: 17, color: '#d8f3e3', marginTop: 6, textAlign: 'center' },
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
// // import { Backdrop, Board, Girl, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
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

// // const START_LEVEL = 10;
// // const HOW_TO = 'Drag up on the pool to raise the water, then press JUMP.';

// // export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
// //   const { width, height } = useWindowDimensions();

// //   // ---------- scene geometry ----------
// //   const W = Math.min(width - 56, 340);
// //   const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 340));

// //   const pw = Math.round(W * 0.6);
// //   const ph = Math.round(H * 0.36);
// //   const ry = poolRy(pw);
// //   const poolLeft = Math.round((W - pw) / 2);
// //   const poolTop = H - 8 - ph;
// //   const floorY = poolTop + ph - ry; // centre of the pool floor

// //   const bw = Math.round(W * 0.46);
// //   const bh = Math.round(bw * 0.3);
// //   const boardLeft = W - bw;
// //   const boardTop = Math.round(H * 0.3);

// //   const gw = Math.round(W * 0.14);
// //   const gh = Math.round(gw * (88 / 48));
// //   const f = 0.22; // where on the board she stands (0 = tip, 1 = fixed end)
// //   const feetY = boardTop + (bh * (19 - 16 * f)) / 30;
// //   const girlLeft = Math.round(boardLeft + f * bw - gw / 2);
// //   const girlTop = Math.round(feetY - gh);
// //   const startCx = girlLeft + gw / 2;
// //   const startCy = girlTop + gh / 2;

// //   const surfaceOf = (lvl: number) => floorY - ((ph - 2 * ry) * lvl) / 100;

// //   // ---------- state ----------
// //   const [phase, setPhase] = useState<Phase>('loading');
// //   const [sessionId, setSessionId] = useState<number | null>(null);
// //   const [question, setQuestion] = useState('She must do a dive jump successfully.');
// //   const [hints, setHints] = useState(0);
// //   const [hintLine, setHintLine] = useState<number | null>(null);
// //   const [level, setLevel] = useState(START_LEVEL);
// //   const [msg, setMsg] = useState(HOW_TO);
// //   const [error, setError] = useState('');
// //   const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
// //   const [result, setResult] = useState<Level4Answer | null>(null);
// //   const [confirmSkip, setConfirmSkip] = useState(false);
// //   const [touched, setTouched] = useState(false);

// //   const gx = useRef(new Animated.Value(0)).current;
// //   const gy = useRef(new Animated.Value(0)).current;
// //   const grot = useRef(new Animated.Value(0)).current;
// //   const handY = useRef(new Animated.Value(0)).current;
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

// //   // little hand that shows "drag up"
// //   useEffect(() => {
// //     const loop = Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(handY, { toValue: -34, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
// //         Animated.timing(handY, { toValue: 0, duration: 500, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
// //       ]),
// //     );
// //     loop.start();
// //     return () => loop.stop();
// //   }, [handY]);

// //   // ---------- hand gesture: drag on the pool to raise / lower the water ----------
// //   const pan = useRef(
// //     PanResponder.create({
// //       onStartShouldSetPanResponder: () => phaseRef.current === 'idle',
// //       onMoveShouldSetPanResponder: () => phaseRef.current === 'idle',
// //       onPanResponderTerminationRequest: () => false,
// //       onPanResponderGrant: () => {
// //         startLevelRef.current = levelRef.current;
// //         setTouched(true);
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

// //   // ---------- dive + swim animation ----------
// //   const dive = (outcome: string, lvl: number) =>
// //     new Promise<void>((resolve) => {
// //       const surface = surfaceOf(lvl);
// //       const floorCy = floorY - gh / 2;
// //       const won = outcome === 'splash';
// //       const cy = won ? Math.min(surface + gh * 0.3, floorCy) : floorCy;
// //       const dx = W / 2 - startCx;
// //       const dy = cy - startCy;

// //       Animated.parallel([
// //         Animated.timing(gx, { toValue: dx, duration: 800, easing: Easing.linear, useNativeDriver: false }),
// //         Animated.sequence([
// //           Animated.timing(gy, { toValue: -30, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: false }),
// //           Animated.timing(gy, { toValue: dy, duration: 540, easing: Easing.in(Easing.quad), useNativeDriver: false }),
// //         ]),
// //         Animated.timing(grot, { toValue: 1, duration: 800, delay: 100, easing: Easing.linear, useNativeDriver: false }),
// //       ]).start(() => {
// //         setSplash({ left: W / 2 - 28, top: surface - 30 });
// //         setTimeout(() => setSplash(null), 650);

// //         if (!won) {
// //           setTimeout(resolve, 700);
// //           return;
// //         }

// //         // she swims left, turns, swims right
// //         const midY = (surface + floorY) / 2;
// //         const dyMid = midY - startCy;
// //         const amp = Math.max(20, pw / 2 - gh / 2 - 10);
// //         Animated.sequence([
// //           Animated.parallel([
// //             Animated.timing(grot, { toValue: 2, duration: 300, useNativeDriver: false }),
// //             Animated.timing(gy, { toValue: dyMid, duration: 300, useNativeDriver: false }),
// //             Animated.timing(gx, { toValue: dx - amp, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// //           ]),
// //           Animated.parallel([
// //             Animated.timing(grot, { toValue: 3, duration: 300, useNativeDriver: false }),
// //             Animated.timing(gx, { toValue: dx + amp, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// //           ]),
// //           Animated.timing(gx, { toValue: dx, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
// //         ]).start(() => resolve());
// //       });
// //     });

// //   const resetScene = useCallback(() => {
// //     gx.setValue(0);
// //     gy.setValue(0);
// //     grot.setValue(0);
// //     setSplash(null);
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
// //         setMsg(r.message || 'Try again!');
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
// //       setMsg(r.hint?.text || 'Raise the water up to the line.');
// //       applyHints(r.hints);
// //     } catch (e: any) {
// //       setMsg(e?.message || 'Could not get the hint.');
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

// //   // ---------- loading / error ----------
// //   if (phase === 'loading' || phase === 'error') {
// //     return (
// //       <Stage bg="#f4e4c6">
// //         <View style={st.frame}>
// //           <View style={[st.board, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }]}>
// //             <Text style={[st.level, { marginBottom: 16 }]}>LEVEL 4</Text>
// //             {phase === 'loading' ? (
// //               <ActivityIndicator size="large" color="#ffd33d" />
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
// //     <Stage bg="#f4e4c6">
// //       <View style={st.frame}>
// //         <View style={st.board}>
// //           {/* top bar */}
// //           <View style={st.topBar}>
// //             <TouchableOpacity
// //               style={st.round}
// //               activeOpacity={0.85}
// //               onPress={onExit}
// //               disabled={phase === 'jumping' || phase === 'sending'}
// //             >
// //               <Text style={st.roundT}>⚙</Text>
// //             </TouchableOpacity>
// //             <Text style={st.level}>LEVEL 4</Text>
// //             <View style={st.pill}>
// //               <Text style={st.pillT}>{hints}</Text>
// //               <Text style={st.pillIcon}>💡</Text>
// //             </View>
// //           </View>

// //           <View style={st.center}>
// //             <Text style={st.question}>{question}</Text>

// //             {/* scene */}
// //             <View style={[st.scene, { width: W, height: H }]}>
// //               <View style={StyleSheet.absoluteFill}>
// //                 <Backdrop w={W} h={H} />
// //               </View>

// //               <View style={{ position: 'absolute', left: boardLeft, top: boardTop }}>
// //                 <Board w={bw} h={bh} />
// //               </View>

// //               <View style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// //                 <Pool w={pw} h={ph} level={level} hintLevel={hintLine} />
// //               </View>

// //               <Animated.View
// //                 style={{
// //                   position: 'absolute',
// //                   left: girlLeft,
// //                   top: girlTop,
// //                   width: gw,
// //                   height: gh,
// //                   transform: [
// //                     { translateX: gx },
// //                     { translateY: gy },
// //                     {
// //                       rotate: grot.interpolate({
// //                         inputRange: [0, 1, 2, 3],
// //                         outputRange: ['0deg', '180deg', '270deg', '450deg'],
// //                       }),
// //                     },
// //                   ],
// //                 }}
// //               >
// //                 <Girl w={gw} />
// //               </Animated.View>

// //               {/* water in front of her, so she looks like she is under the water */}
// //               <View pointerEvents="none" style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
// //                 <PoolWater w={pw} h={ph} level={level} />
// //               </View>

// //               {splash && (
// //                 <View pointerEvents="none" style={{ position: 'absolute', left: splash.left, top: splash.top }}>
// //                   <Splash w={56} />
// //                 </View>
// //               )}

// //               {/* drag-up hand hint */}
// //               {!touched && phase === 'idle' && (
// //                 <Animated.Text
// //                   pointerEvents="none"
// //                   style={{
// //                     position: 'absolute',
// //                     left: W / 2 - 14,
// //                     top: poolTop + ph * 0.45,
// //                     fontSize: 30,
// //                     transform: [{ translateY: handY }],
// //                   }}
// //                 >
// //                   👆
// //                 </Animated.Text>
// //               )}

// //               {/* gesture area over the pool */}
// //               <View
// //                 {...pan.panHandlers}
// //                 style={[
// //                   {
// //                     position: 'absolute',
// //                     left: poolLeft - 24,
// //                     top: poolTop - 40,
// //                     width: pw + 48,
// //                     height: ph + 56,
// //                   },
// //                   webTouch,
// //                 ]}
// //               />
// //             </View>

// //             <TouchableOpacity
// //               style={[st.primary, busy && st.off]}
// //               disabled={busy}
// //               activeOpacity={0.85}
// //               onPress={onJump}
// //             >
// //               {phase === 'sending' ? <ActivityIndicator color="#1b1b1b" /> : <Text style={st.primaryT}>JUMP</Text>}
// //             </TouchableOpacity>

// //             <Text style={st.msg}>{msg || ' '}</Text>
// //           </View>

// //           {/* bottom bar */}
// //           <View style={st.bottomBar}>
// //             <TouchableOpacity style={[st.round, busy && st.off]} activeOpacity={0.85} onPress={onHint} disabled={busy}>
// //               <Text style={st.roundT}>🔍</Text>
// //               <Text style={st.cost}>25</Text>
// //             </TouchableOpacity>
// //             <View style={{ flexDirection: 'row', gap: 12 }}>
// //               <TouchableOpacity style={[st.round, busy && st.off]} activeOpacity={0.85} onPress={onReward} disabled={busy}>
// //                 <Text style={st.roundT}>🎬</Text>
// //                 <Text style={st.cost}>+75</Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity
// //                 style={[st.round, st.roundRed, busy && st.off]}
// //                 activeOpacity={0.85}
// //                 onPress={onSkip}
// //                 disabled={busy}
// //               >
// //                 <Text style={st.roundT}>⏭</Text>
// //                 <Text style={st.cost}>50</Text>
// //               </TouchableOpacity>
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
// //   frame: { flex: 1, margin: 8, backgroundColor: '#e08a2e', borderRadius: 22, padding: 9 },
// //   board: { flex: 1, backgroundColor: '#1d6a49', borderRadius: 14, paddingTop: 10 },
// //   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
// //   level: { fontFamily: FONT, fontSize: 22, fontWeight: '800', color: '#ffd33d', letterSpacing: 1 },
// //   pill: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 4,
// //     height: 34,
// //     paddingHorizontal: 12,
// //     borderRadius: 17,
// //     backgroundColor: '#fff',
// //     borderWidth: 2,
// //     borderColor: '#1b1b1b',
// //   },
// //   pillT: { fontFamily: FONT, fontSize: 16, fontWeight: '900', color: '#1b1b1b' },
// //   pillIcon: { fontSize: 16 },
// //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
// //   question: { fontFamily: FONT, fontSize: 17, color: '#fff', textAlign: 'center', marginBottom: 10 },
// //   scene: { backgroundColor: '#e9f1f3', borderRadius: 6, overflow: 'hidden' },
// //   primary: {
// //     marginTop: 14,
// //     minWidth: 160,
// //     height: 54,
// //     borderRadius: 27,
// //     backgroundColor: '#a6e22e',
// //     borderWidth: 3,
// //     borderColor: '#1b1b1b',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   primaryT: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: '#1b1b1b' },
// //   off: { opacity: 0.5 },
// //   msg: { fontFamily: FONT, fontSize: 15, color: '#d8f3e3', marginTop: 10, textAlign: 'center', minHeight: 20 },
// //   bottomBar: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingHorizontal: 18,
// //     paddingVertical: 10,
// //   },
// //   round: {
// //     width: 46,
// //     height: 46,
// //     borderRadius: 23,
// //     backgroundColor: '#a6e22e',
// //     borderWidth: 2.5,
// //     borderColor: '#1b1b1b',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   roundRed: { backgroundColor: '#ff6b6b' },
// //   roundT: { fontSize: 20, color: '#1b1b1b' },
// //   cost: {
// //     position: 'absolute',
// //     right: -6,
// //     bottom: -6,
// //     fontFamily: FONT,
// //     fontSize: 11,
// //     fontWeight: '900',
// //     color: '#1b1b1b',
// //     backgroundColor: '#ffd33d',
// //     borderRadius: 8,
// //     paddingHorizontal: 4,
// //     overflow: 'hidden',
// //   },
// //   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
// //   errDetail: { fontFamily: FONT, fontSize: 14, color: '#d8f3e3', textAlign: 'center', marginTop: 6 },
// //   link: { fontFamily: FONT, fontSize: 16, color: '#d8f3e3', marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },
// //   overlay: {
// //     ...StyleSheet.absoluteFillObject,
// //     backgroundColor: 'rgba(0,0,0,0.55)',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 24,
// //     borderRadius: 22,
// //   },
// //   card: {
// //     width: '100%',
// //     maxWidth: 340,
// //     backgroundColor: '#1d6a49',
// //     borderColor: '#e08a2e',
// //     borderWidth: 8,
// //     borderRadius: 24,
// //     padding: 22,
// //     alignItems: 'center',
// //   },
// //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center' },
// //   stars: { fontSize: 36, color: '#ffd33d', marginTop: 8 },
// //   cardText: { fontFamily: FONT, fontSize: 17, color: '#d8f3e3', marginTop: 6, textAlign: 'center' },
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
// import { Backdrop, Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
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
// const HOW_TO = 'Drag up on the water to raise it, then press JUMP.';

// export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
//   const { width, height } = useWindowDimensions();

//   // ---------- scene geometry ----------
//   const W = Math.min(width - 56, 340);
//   const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 340));

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
//   const [msg, setMsg] = useState(HOW_TO);
//   const [error, setError] = useState('');
//   const [splash, setSplash] = useState<{ left: number; top: number } | null>(null);
//   const [result, setResult] = useState<Level4Answer | null>(null);
//   const [confirmSkip, setConfirmSkip] = useState(false);

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
//         setMsg(r.message || 'Try again!');
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
//       setMsg(r.hint?.text || 'Raise the water up to the line.');
//       applyHints(r.hints);
//     } catch (e: any) {
//       setMsg(e?.message || 'Could not get the hint.');
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

//   // ---------- loading / error ----------
//   if (phase === 'loading' || phase === 'error') {
//     return (
//       <Stage bg="#f4e4c6">
//         <View style={st.frame}>
//           <View style={[st.board, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }]}>
//             <Text style={[st.level, { marginBottom: 16 }]}>LEVEL 4</Text>
//             {phase === 'loading' ? (
//               <ActivityIndicator size="large" color="#ffd33d" />
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
//     <Stage bg="#f4e4c6">
//       <View style={st.frame}>
//         <View style={st.board}>
//           {/* top bar */}
//           <View style={st.topBar}>
//             <TouchableOpacity
//               style={st.round}
//               activeOpacity={0.85}
//               onPress={onExit}
//               disabled={phase === 'jumping' || phase === 'sending'}
//             >
//               <Text style={st.roundT}>⚙</Text>
//             </TouchableOpacity>
//             <Text style={st.level}>LEVEL 4</Text>
//             <View style={st.pill}>
//               <Text style={st.pillT}>{hints}</Text>
//               <Text style={st.pillIcon}>💡</Text>
//             </View>
//           </View>

//           <View style={st.center}>
//             <Text style={st.question}>{question}</Text>

//             {/* scene */}
//             <View style={[st.scene, { width: W, height: H }]}>
//               <View style={StyleSheet.absoluteFill}>
//                 <Backdrop w={W} h={H} />
//               </View>

//               <View style={{ position: 'absolute', left: boardLeft, top: boardTop }}>
//                 <Board w={bw} h={bh} />
//               </View>

//               <View style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
//                 <Pool w={pw} h={ph} level={level} hintLevel={hintLine} />
//               </View>

//               <Animated.View
//                 style={{
//                   position: 'absolute',
//                   left: girlLeft,
//                   top: girlTop,
//                   width: gw,
//                   height: gh,
//                   transform: [
//                     { translateX: gx },
//                     { translateY: gy },
//                     {
//                       rotate: grot.interpolate({
//                         inputRange: [0, 1, 2, 3],
//                         outputRange: ['0deg', '-180deg', '-270deg', '-90deg'],
//                       }),
//                     },
//                   ],
//                 }}
//               >
//                 <Girl w={gw} pose={pose} />
//               </Animated.View>

//               {/* water in front of her, so she looks like she is under the water */}
//               <View pointerEvents="none" style={{ position: 'absolute', left: poolLeft - 3, top: poolTop - 3 }}>
//                 <PoolWater w={pw} h={ph} level={level} />
//               </View>

//               {splash && (
//                 <View pointerEvents="none" style={{ position: 'absolute', left: splash.left, top: splash.top }}>
//                   <Splash w={56} />
//                 </View>
//               )}

//               {/* gesture area over the water column */}
//               <View
//                 {...pan.panHandlers}
//                 style={[
//                   {
//                     position: 'absolute',
//                     left: poolLeft - 24,
//                     top: poolTop - 40,
//                     width: pw + 48,
//                     height: ph + 56,
//                   },
//                   webTouch,
//                 ]}
//               />
//             </View>

//             <TouchableOpacity
//               style={[st.primary, busy && st.off]}
//               disabled={busy}
//               activeOpacity={0.85}
//               onPress={onJump}
//             >
//               {phase === 'sending' ? <ActivityIndicator color="#1b1b1b" /> : <Text style={st.primaryT}>JUMP</Text>}
//             </TouchableOpacity>

//             <Text style={st.msg}>{msg || ' '}</Text>
//           </View>

//           {/* bottom bar */}
//           <View style={st.bottomBar}>
//             <TouchableOpacity style={[st.round, busy && st.off]} activeOpacity={0.85} onPress={onHint} disabled={busy}>
//               <Text style={st.roundT}>🔍</Text>
//               <Text style={st.cost}>25</Text>
//             </TouchableOpacity>
//             <View style={{ flexDirection: 'row', gap: 12 }}>
//               <TouchableOpacity style={[st.round, busy && st.off]} activeOpacity={0.85} onPress={onReward} disabled={busy}>
//                 <Text style={st.roundT}>🎬</Text>
//                 <Text style={st.cost}>+75</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[st.round, st.roundRed, busy && st.off]}
//                 activeOpacity={0.85}
//                 onPress={onSkip}
//                 disabled={busy}
//               >
//                 <Text style={st.roundT}>⏭</Text>
//                 <Text style={st.cost}>50</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

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
//   frame: { flex: 1, margin: 8, backgroundColor: '#e08a2e', borderRadius: 22, padding: 9 },
//   board: { flex: 1, backgroundColor: '#1d6a49', borderRadius: 14, paddingTop: 10 },
//   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
//   level: { fontFamily: FONT, fontSize: 22, fontWeight: '800', color: '#ffd33d', letterSpacing: 1 },
//   pill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     height: 34,
//     paddingHorizontal: 12,
//     borderRadius: 17,
//     backgroundColor: '#fff',
//     borderWidth: 2,
//     borderColor: '#1b1b1b',
//   },
//   pillT: { fontFamily: FONT, fontSize: 16, fontWeight: '900', color: '#1b1b1b' },
//   pillIcon: { fontSize: 16 },
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
//   question: { fontFamily: FONT, fontSize: 17, color: '#fff', textAlign: 'center', marginBottom: 10 },
//   scene: { backgroundColor: '#e9f1f3', borderRadius: 6, overflow: 'hidden' },
//   primary: {
//     marginTop: 14,
//     minWidth: 160,
//     height: 54,
//     borderRadius: 27,
//     backgroundColor: '#a6e22e',
//     borderWidth: 3,
//     borderColor: '#1b1b1b',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   primaryT: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: '#1b1b1b' },
//   off: { opacity: 0.5 },
//   msg: { fontFamily: FONT, fontSize: 15, color: '#d8f3e3', marginTop: 10, textAlign: 'center', minHeight: 20 },
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//   },
//   round: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     backgroundColor: '#a6e22e',
//     borderWidth: 2.5,
//     borderColor: '#1b1b1b',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   roundRed: { backgroundColor: '#ff6b6b' },
//   roundT: { fontSize: 20, color: '#1b1b1b' },
//   cost: {
//     position: 'absolute',
//     right: -6,
//     bottom: -6,
//     fontFamily: FONT,
//     fontSize: 11,
//     fontWeight: '900',
//     color: '#1b1b1b',
//     backgroundColor: '#ffd33d',
//     borderRadius: 8,
//     paddingHorizontal: 4,
//     overflow: 'hidden',
//   },
//   errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
//   errDetail: { fontFamily: FONT, fontSize: 14, color: '#d8f3e3', textAlign: 'center', marginTop: 6 },
//   link: { fontFamily: FONT, fontSize: 16, color: '#d8f3e3', marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.55)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 24,
//     borderRadius: 22,
//   },
//   card: {
//     width: '100%',
//     maxWidth: 340,
//     backgroundColor: '#1d6a49',
//     borderColor: '#e08a2e',
//     borderWidth: 8,
//     borderRadius: 24,
//     padding: 22,
//     alignItems: 'center',
//   },
//   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center' },
//   stars: { fontSize: 36, color: '#ffd33d', marginTop: 8 },
//   cardText: { fontFamily: FONT, fontSize: 17, color: '#d8f3e3', marginTop: 6, textAlign: 'center' },
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
import { Backdrop, Board, Girl, GirlPose, Pool, PoolWater, Splash, poolRy } from './Btlevel4art';
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

export default function BTLevel4Screen({ playerId, onHints, onExit, onComplete }: Props) {
  const { width, height } = useWindowDimensions();

  // ---------- scene geometry ----------
  const W = Math.min(width - 56, 340);
  const H = Math.max(250, Math.min(Math.round(W * 1.08), height - 340));

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
      setMsg(r.hint?.text || 'Raise the water up to the line.');
      applyHints(r.hints);
    } catch (e: any) {
      setMsg(e?.message || 'Could not get the hint.');
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

  // ---------- loading / error ----------
  if (phase === 'loading' || phase === 'error') {
    return (
      <Stage bg="#f4e4c6">
        <View style={st.frame}>
          <View style={[st.board, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }]}>
            <Text style={[st.level, { marginBottom: 16 }]}>LEVEL 4</Text>
            {phase === 'loading' ? (
              <ActivityIndicator size="large" color="#ffd33d" />
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
    <Stage bg="#f4e4c6">
      <View style={st.frame}>
        <View style={st.board}>
          {/* top bar */}
          <View style={st.topBar}>
            <TouchableOpacity
              style={st.round}
              activeOpacity={0.85}
              onPress={onExit}
              disabled={phase === 'jumping' || phase === 'sending'}
            >
              <Text style={st.roundT}>⚙</Text>
            </TouchableOpacity>
            <Text style={st.level}>LEVEL 4</Text>
            <View style={st.pill}>
              <Text style={st.pillT}>{hints}</Text>
              <Text style={st.pillIcon}>💡</Text>
            </View>
          </View>

          <View style={st.center}>
            <Text style={st.question}>{question}</Text>

            {/* scene */}
            <View style={[st.scene, { width: W, height: H }]}>
              <View style={StyleSheet.absoluteFill}>
                <Backdrop w={W} h={H} />
              </View>

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
              {phase === 'sending' ? <ActivityIndicator color="#1b1b1b" /> : <Text style={st.primaryT}>JUMP</Text>}
            </TouchableOpacity>

            <Text style={st.msg}>{msg || ' '}</Text>
          </View>

          {/* bottom bar */}
          <View style={st.bottomBar}>
            <TouchableOpacity style={[st.round, busy && st.off]} activeOpacity={0.85} onPress={onHint} disabled={busy}>
              <Text style={st.roundT}>🔍</Text>
              <Text style={st.cost}>25</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={[st.round, busy && st.off]} activeOpacity={0.85} onPress={onReward} disabled={busy}>
                <Text style={st.roundT}>🎬</Text>
                <Text style={st.cost}>+75</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[st.round, st.roundRed, busy && st.off]}
                activeOpacity={0.85}
                onPress={onSkip}
                disabled={busy}
              >
                <Text style={st.roundT}>⏭</Text>
                <Text style={st.cost}>50</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

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
  frame: { flex: 1, margin: 8, backgroundColor: '#e08a2e', borderRadius: 22, padding: 9 },
  board: { flex: 1, backgroundColor: '#1d6a49', borderRadius: 14, paddingTop: 10 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  level: { fontFamily: FONT, fontSize: 22, fontWeight: '800', color: '#ffd33d', letterSpacing: 1 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1b1b1b',
  },
  pillT: { fontFamily: FONT, fontSize: 16, fontWeight: '900', color: '#1b1b1b' },
  pillIcon: { fontSize: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  question: { fontFamily: FONT, fontSize: 17, color: '#fff', textAlign: 'center', marginBottom: 10 },
  scene: { backgroundColor: '#e9f1f3', borderRadius: 6, overflow: 'hidden' },
  primary: {
    marginTop: 14,
    minWidth: 160,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#a6e22e',
    borderWidth: 3,
    borderColor: '#1b1b1b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryT: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: '#1b1b1b' },
  off: { opacity: 0.5 },
  msg: { fontFamily: FONT, fontSize: 15, color: '#d8f3e3', marginTop: 10, textAlign: 'center', minHeight: 20 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  round: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#a6e22e',
    borderWidth: 2.5,
    borderColor: '#1b1b1b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundRed: { backgroundColor: '#ff6b6b' },
  roundT: { fontSize: 20, color: '#1b1b1b' },
  cost: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    fontFamily: FONT,
    fontSize: 11,
    fontWeight: '900',
    color: '#1b1b1b',
    backgroundColor: '#ffd33d',
    borderRadius: 8,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  errText: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
  errDetail: { fontFamily: FONT, fontSize: 14, color: '#d8f3e3', textAlign: 'center', marginTop: 6 },
  link: { fontFamily: FONT, fontSize: 16, color: '#d8f3e3', marginTop: 18, textDecorationLine: 'underline', textAlign: 'center' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 22,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#1d6a49',
    borderColor: '#e08a2e',
    borderWidth: 8,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
  },
  cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center' },
  stars: { fontSize: 36, color: '#ffd33d', marginTop: 8 },
  cardText: { fontFamily: FONT, fontSize: 17, color: '#d8f3e3', marginTop: 6, textAlign: 'center' },
});
