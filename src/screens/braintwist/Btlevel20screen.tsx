// // // // src/screens/braintwist/Btlevel20screen.tsx

// // // import React, { useCallback, useEffect, useState } from 'react';
// // // import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
// // // import { C, Level20Room, Vine } from './Btlevel20art';
// // // import { Level20Option, startLevel20, submitLevel20Answer } from './Btlevel20api';

// // // type Props = {
// // //   navigation?: any;           // TODO: match the navigation type used by Btlevel19screen.tsx
// // //   bulbs?: number;             // TODO: feed from your shared bulb/coin state (BTShared)
// // //   onHint?: () => void;        // search button, costs 25 bulbs
// // //   onWatchAd?: () => void;     // video button, +75 coins
// // //   onSkip?: () => void;        // play button, costs 50 bulbs
// // // };

// // // type Status = 'loading' | 'ready' | 'checking' | 'wrong' | 'correct' | 'error';
// // // const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

// // // export default function Btlevel20screen({ navigation, bulbs = 50, onHint, onWatchAd, onSkip }: Props) {
// // //   const [status, setStatus] = useState<Status>('loading');
// // //   const [sessionId, setSessionId] = useState<number | null>(null);
// // //   const [text, setText] = useState('');
// // //   const [options, setOptions] = useState<Level20Option[]>([]);
// // //   const [picked, setPicked] = useState<string | null>(null);
// // //   const [explanation, setExplanation] = useState('');
// // //   const [error, setError] = useState('');

// // //   const load = useCallback(async () => {
// // //     setStatus('loading');
// // //     try {
// // //       const data = await startLevel20();       // frontend -> backend -> MySQL session
// // //       setSessionId(data.sessionId);
// // //       setText(data.question.text);
// // //       setOptions(data.question.options);
// // //       setPicked(null);
// // //       setStatus('ready');
// // //     } catch (e: any) {
// // //       setError(e.message || 'Could not load the level');
// // //       setStatus('error');
// // //     }
// // //   }, []);

// // //   useEffect(() => { load(); }, [load]);

// // //   const choose = async (key: string) => {
// // //     if (sessionId == null || status === 'checking' || status === 'correct') return;
// // //     setPicked(key);
// // //     setStatus('checking');
// // //     try {
// // //       const res = await submitLevel20Answer(sessionId, key); // backend saves attempt, replies JSON
// // //       if (res.correct) {
// // //         setExplanation(res.explanation || '');
// // //         setStatus('correct');
// // //       } else {
// // //         setStatus('wrong');
// // //       }
// // //     } catch (e: any) {
// // //       setError(e.message || 'Could not check your answer');
// // //       setStatus('error');
// // //     }
// // //   };

// // //   const goNext = () => navigation?.navigate?.('BTLevelMap'); // TODO: your map / next-level route
// // //   const showGame = ['ready', 'checking', 'wrong', 'correct'].includes(status);

// // //   return (
// // //     <Level20Room>
// // //       {/* top-left buttons */}
// // //       <View style={s.topLeft}>
// // //         <Pressable style={s.round} onPress={() => navigation?.navigate?.('Home')}>
// // //           <Text style={s.roundGlyph}>⌂</Text>
// // //         </Pressable>
// // //         <Pressable style={s.round} onPress={() => navigation?.navigate?.('Settings')}>
// // //           <Text style={s.roundGlyph}>⚙</Text>
// // //         </Pressable>
// // //       </View>

// // //       {/* hanging level sign */}
// // //       <View style={s.signWrap}>
// // //         <View style={s.string} /><View style={[s.string, { right: 28, left: undefined }]} />
// // //         <View style={s.sign}>
// // //           <Vine style={{ left: -14, top: -22, transform: [{ rotate: '-70deg' }] }} />
// // //           <Vine style={{ right: -14, top: -22, transform: [{ rotate: '70deg' }] }} />
// // //           <Text style={s.arrow}>{'<'}</Text>
// // //           <Text style={s.signText}>LEVEL 20</Text>
// // //           <Text style={s.arrow}>{'>'}</Text>
// // //         </View>
// // //       </View>

// // //       {/* bulb counter */}
// // //       <View style={s.bulbPill}>
// // //         <Text style={s.bulbNum}>{bulbs}</Text>
// // //         <Text style={s.bulbIcon}>💡</Text>
// // //       </View>

// // //       {status === 'loading' && <ActivityIndicator size="large" color={C.woodDark} style={s.loader} />}

// // //       {status === 'error' && (
// // //         <View style={s.errBox}>
// // //           <Text style={s.errText}>{error}</Text>
// // //           <Pressable style={s.retry} onPress={load}><Text style={s.retryText}>Try again</Text></Pressable>
// // //         </View>
// // //       )}

// // //       {showGame && (
// // //         <>
// // //           {/* question board */}
// // //           <View style={s.board}>
// // //             <Vine style={{ left: -22, top: -20, transform: [{ rotate: '-20deg' }] }} />
// // //             <Vine style={{ right: -20, top: 40, transform: [{ rotate: '20deg' }] }} />
// // //             <Text style={s.alarm}>⏰</Text>
// // //             <Text style={s.question}>{text}</Text>
// // //           </View>

// // //           {/* options */}
// // //           <View style={s.grid}>
// // //             {options.map(o => {
// // //               const isPicked = picked === o.key;
// // //               const tint = isPicked && status === 'correct' ? s.right : isPicked && status === 'wrong' ? s.wrong : null;
// // //               return (
// // //                 <Pressable
// // //                   key={o.key}
// // //                   style={s.ring}
// // //                   onPress={() => choose(o.key)}
// // //                   disabled={status === 'checking' || status === 'correct'}
// // //                 >
// // //                   <View style={[s.disc, tint]}>
// // //                     <Text style={s.num}>{o.label}</Text>
// // //                   </View>
// // //                 </Pressable>
// // //               );
// // //             })}
// // //           </View>

// // //           {status === 'wrong' && <Text style={s.wrongNote}>Not quite. Count the gaps between strikes.</Text>}

// // //           {status === 'correct' && (
// // //             <View style={s.win}>
// // //               <Text style={s.winTitle}>Correct!</Text>
// // //               <Text style={s.winText}>{explanation}</Text>
// // //               <Pressable style={s.next} onPress={goNext}><Text style={s.nextText}>Continue</Text></Pressable>
// // //             </View>
// // //           )}
// // //         </>
// // //       )}

// // //       {/* bottom action bar */}
// // //       <View style={s.bar}>
// // //         <View style={s.action}>
// // //           <Pressable style={[s.actBtn, s.hintBtn]} onPress={onHint}><Text style={s.actGlyph}>🔍</Text></Pressable>
// // //           <View style={s.cost}><Text style={s.costIcon}>💡</Text><Text style={s.costText}>25</Text></View>
// // //         </View>
// // //         <View style={s.action}>
// // //           <Pressable style={[s.actBtn, s.videoBtn]} onPress={onWatchAd}>
// // //             <View style={s.videoBox}><Text style={s.videoPlay}>▶</Text></View>
// // //           </Pressable>
// // //           <View style={s.cost}><View style={s.coin} /><Text style={s.costText}>+75</Text></View>
// // //         </View>
// // //         <View style={s.action}>
// // //           <Pressable style={[s.actBtn, s.skipBtn]} onPress={onSkip}><Text style={s.skipGlyph}>▶</Text></Pressable>
// // //           <View style={s.cost}><Text style={s.costIcon}>💡</Text><Text style={s.costText}>50</Text></View>
// // //         </View>
// // //       </View>
// // //     </Level20Room>
// // //   );
// // // }

// // // const D = 88;       // option disc size
// // // const RING = D + 22;

// // // const s = StyleSheet.create({
// // //   topLeft: { position: 'absolute', top: '5.5%', left: 14, flexDirection: 'row', gap: 10 },
// // //   round: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.gold, borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
// // //   roundGlyph: { fontSize: 24, color: C.ink, fontWeight: '900' },

// // //   signWrap: { position: 'absolute', top: '4.2%', alignSelf: 'center', alignItems: 'center' },
// // //   string: { position: 'absolute', top: -14, left: 28, width: 2, height: 22, backgroundColor: '#6B4A2B' },
// // //   sign: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.woodDark, borderRadius: 8, borderWidth: 3, borderColor: '#C57A3A', paddingHorizontal: 12, paddingVertical: 8, marginTop: 8 },
// // //   signText: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginHorizontal: 6 },
// // //   arrow: { color: '#F5A623', fontSize: 24, fontWeight: '900' },

// // //   bulbPill: { position: 'absolute', top: '6%', right: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 22, paddingHorizontal: 16, height: 40 },
// // //   bulbNum: { fontSize: 22, fontWeight: '900', color: '#111', marginRight: 10 },
// // //   bulbIcon: { fontSize: 20 },

// // //   loader: { position: 'absolute', top: '40%', alignSelf: 'center' },
// // //   errBox: { position: 'absolute', top: '36%', alignSelf: 'center', alignItems: 'center', paddingHorizontal: 30 },
// // //   errText: { color: C.ink, fontSize: 16, textAlign: 'center' },
// // //   retry: { backgroundColor: C.gold, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 22, marginTop: 12, borderWidth: 2, borderColor: C.ink },
// // //   retryText: { color: C.ink, fontWeight: '800', fontSize: 16 },

// // //   board: { position: 'absolute', top: '17%', left: '20%', width: '61%', backgroundColor: C.cream, borderRadius: 16, borderWidth: 6, borderColor: C.wood, paddingTop: 6, paddingBottom: 16, paddingHorizontal: 14, alignItems: 'center' },
// // //   alarm: { fontSize: 38 },
// // //   question: { fontFamily: SERIF, fontStyle: 'italic', fontSize: 20, lineHeight: 28, color: C.navy, textAlign: 'center', marginTop: 4 },

// // //   grid: { position: 'absolute', top: '40.5%', alignSelf: 'center', width: RING * 2 + 24, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 6 },
// // //   ring: { width: RING, height: RING, borderRadius: RING / 2, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
// // //   disc: { width: D, height: D, borderRadius: D / 2, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
// // //   num: { fontSize: 46, fontWeight: '900', color: C.navy },
// // //   right: { backgroundColor: '#BFE3A8' },
// // //   wrong: { backgroundColor: '#F4B7AE' },
// // //   wrongNote: { position: 'absolute', top: '67%', alignSelf: 'center', color: '#8A2A1D', fontSize: 15, fontWeight: '700' },

// // //   win: { position: 'absolute', top: '60%', left: '12%', right: '12%', backgroundColor: C.cream, borderRadius: 18, borderWidth: 4, borderColor: C.wood, padding: 14, alignItems: 'center' },
// // //   winTitle: { color: '#2F6B17', fontSize: 22, fontWeight: '900' },
// // //   winText: { color: C.ink, textAlign: 'center', marginTop: 4, fontSize: 15, lineHeight: 21 },
// // //   next: { backgroundColor: '#9ADB1E', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 32, marginTop: 10, borderWidth: 2, borderColor: C.ink },
// // //   nextText: { color: C.ink, fontSize: 17, fontWeight: '900' },

// // //   bar: { position: 'absolute', bottom: '3.5%', left: '6%', right: '6%', height: 128, backgroundColor: C.cream, borderRadius: 64, borderWidth: 8, borderColor: '#B7D3E8', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 6 },
// // //   action: { alignItems: 'center' },
// // //   actBtn: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', borderWidth: 5 },
// // //   hintBtn: { backgroundColor: '#9ADB1E', borderColor: '#C9EE8F' },
// // //   videoBtn: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, elevation: 3 },
// // //   skipBtn: { backgroundColor: '#EF3E4F', borderColor: '#FFFFFF' },
// // //   actGlyph: { fontSize: 28 },
// // //   videoBox: { width: 34, height: 30, backgroundColor: '#B075F0', borderWidth: 3, borderColor: '#3B2A55', borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
// // //   videoPlay: { color: '#fff', fontSize: 12 },
// // //   skipGlyph: { color: C.ink, fontSize: 28, marginLeft: 3 },
// // //   cost: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7B4A24', borderRadius: 16, paddingHorizontal: 12, height: 30, marginTop: 6 },
// // //   costIcon: { fontSize: 13, marginRight: 4 },
// // //   costText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
// // //   coin: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#F5B400', marginRight: 4 },
// // // });
// // // src/screens/braintwist/Btlevel20screen.tsx
// // // Props match levels 11-19: playerId, hints, setHints, onExit, onComplete

// // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
// // import * as api from './api';
// // import { C, Level20Room, Vine } from './Btlevel20art';
// // import { Level20Option, startLevel20, submitLevel20Answer } from './Btlevel20api';

// // type Props = {
// //   playerId: number;
// //   hints?: number;
// //   setHints?: (n: number) => void;
// //   onExit: () => void;
// //   onComplete: (r: any) => void;
// // };

// // type Status = 'loading' | 'ready' | 'checking' | 'wrong' | 'correct' | 'error';
// // const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

// // export default function Btlevel20screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
// //   const [status, setStatus] = useState<Status>('loading');
// //   const [sessionId, setSessionId] = useState<number | null>(null);
// //   const [text, setText] = useState('');
// //   const [options, setOptions] = useState<Level20Option[]>([]);
// //   const [picked, setPicked] = useState<string | null>(null);
// //   const [explanation, setExplanation] = useState('');
// //   const [error, setError] = useState('');
// //   const [note, setNote] = useState('');
// //   const busy = useRef(false);

// //   const flash = (m: string) => { setNote(m); setTimeout(() => setNote(''), 1500); };

// //   const load = useCallback(async () => {
// //     setStatus('loading');
// //     try {
// //       const data = await startLevel20(playerId);   // frontend -> backend -> MySQL session
// //       setSessionId(data.sessionId);
// //       setText(data.question.text);
// //       setOptions(data.question.options);
// //       setPicked(null);
// //       setStatus('ready');
// //     } catch (e: any) {
// //       setError(e?.message || 'Cannot load level 20');
// //       setStatus('error');
// //     }
// //   }, [playerId]);

// //   useEffect(() => { load(); }, [load]);

// //   const choose = async (key: string) => {
// //     if (sessionId == null || busy.current || status === 'correct') return;
// //     busy.current = true;
// //     setPicked(key);
// //     setStatus('checking');
// //     try {
// //       const res = await submitLevel20Answer(playerId, sessionId, key); // backend saves + replies JSON
// //       if (res.correct) {
// //         setExplanation(res.explanation || '');
// //         setStatus('correct');
// //         setTimeout(() => onComplete({ attempts: res.attempts ?? 1, skipped: false }), 1600);
// //       } else {
// //         setStatus('wrong');
// //         setTimeout(() => { setPicked(null); setStatus('ready'); }, 900);
// //       }
// //     } catch (e: any) {
// //       setError(e?.message || 'Could not check your answer');
// //       setStatus('error');
// //     } finally {
// //       busy.current = false;
// //     }
// //   };

// //   const watchVideo = async () => {
// //     if (busy.current) return;
// //     busy.current = true;
// //     try { const r = await api.reward(playerId, 'video'); setHints?.(r.hints); }
// //     catch (e) { flash('Network error'); }
// //     finally { busy.current = false; }
// //   };

// //   // TODO: hint (25) and skip (50) need the level 20 hint/skip endpoints, like levels 11-19
// //   const hint = () => flash('Hint is not ready yet');
// //   const skip = () => flash('Skip is not ready yet');

// //   const showGame = ['ready', 'checking', 'wrong', 'correct'].includes(status);

// //   return (
// //     <Level20Room>
// //       <View style={s.topLeft}>
// //         <Pressable style={s.round} onPress={onExit}><Text style={s.roundGlyph}>⌂</Text></Pressable>
// //         <Pressable style={s.round}><Text style={s.roundGlyph}>⚙</Text></Pressable>
// //       </View>

// //       <View style={s.signWrap}>
// //         <View style={[s.string, { left: 26 }]} /><View style={[s.string, { right: 26 }]} />
// //         <View style={s.sign}>
// //           <Vine style={{ left: -14, top: -22, transform: [{ rotate: '-70deg' }] }} />
// //           <Vine style={{ right: -14, top: -22, transform: [{ rotate: '70deg' }] }} />
// //           <Text style={s.arrow}>{'<'}</Text>
// //           <Text style={s.signText}>LEVEL 20</Text>
// //           <Text style={s.arrow}>{'>'}</Text>
// //         </View>
// //       </View>

// //       <View style={s.bulbPill}>
// //         <Text style={s.bulbNum}>{hints}</Text>
// //         <Text style={s.bulbIcon}>💡</Text>
// //       </View>

// //       {status === 'loading' && <ActivityIndicator size="large" color={C.woodDark} style={s.loader} />}

// //       {status === 'error' && (
// //         <View style={s.errBox}>
// //           <Text style={s.errText}>{error}</Text>
// //           <Pressable style={s.retry} onPress={load}><Text style={s.retryText}>Try again</Text></Pressable>
// //         </View>
// //       )}

// //       {showGame && (
// //         <>
// //           <View style={s.board}>
// //             <Vine style={{ left: -22, top: -20, transform: [{ rotate: '-20deg' }] }} />
// //             <Vine style={{ right: -20, top: 40, transform: [{ rotate: '20deg' }] }} />
// //             <Text style={s.alarm}>⏰</Text>
// //             <Text style={s.question}>{text}</Text>
// //           </View>

// //           <View style={s.grid}>
// //             {options.map(o => {
// //               const isPicked = picked === o.key;
// //               const tint = isPicked && status === 'correct' ? s.right : isPicked && status === 'wrong' ? s.wrong : null;
// //               return (
// //                 <Pressable key={o.key} style={s.ring} onPress={() => choose(o.key)}
// //                   disabled={status === 'checking' || status === 'correct'}>
// //                   <View style={[s.disc, tint]}><Text style={s.num}>{o.label}</Text></View>
// //                 </Pressable>
// //               );
// //             })}
// //           </View>

// //           {status === 'correct' && !!explanation && (
// //             <View style={s.win}>
// //               <Text style={s.winTitle}>Correct!</Text>
// //               <Text style={s.winText}>{explanation}</Text>
// //             </View>
// //           )}
// //         </>
// //       )}

// //       {!!note && <Text style={s.note}>{note}</Text>}

// //       <View style={s.bar}>
// //         <View style={s.action}>
// //           <Pressable style={[s.actBtn, s.hintBtn]} onPress={hint}><Text style={s.actGlyph}>🔍</Text></Pressable>
// //           <View style={s.cost}><Text style={s.costIcon}>💡</Text><Text style={s.costText}>25</Text></View>
// //         </View>
// //         <View style={s.action}>
// //           <Pressable style={[s.actBtn, s.videoBtn]} onPress={watchVideo}>
// //             <View style={s.videoBox}><Text style={s.videoPlay}>▶</Text></View>
// //           </Pressable>
// //           <View style={s.cost}><View style={s.coin} /><Text style={s.costText}>+75</Text></View>
// //         </View>
// //         <View style={s.action}>
// //           <Pressable style={[s.actBtn, s.skipBtn]} onPress={skip}><Text style={s.skipGlyph}>▶</Text></Pressable>
// //           <View style={s.cost}><Text style={s.costIcon}>💡</Text><Text style={s.costText}>50</Text></View>
// //         </View>
// //       </View>
// //     </Level20Room>
// //   );
// // }

// // const D = 88;
// // const RING = D + 22;

// // const s = StyleSheet.create({
// //   topLeft: { position: 'absolute', top: '5.5%', left: 14, flexDirection: 'row', gap: 10 },
// //   round: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.gold, borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
// //   roundGlyph: { fontSize: 24, color: C.ink, fontWeight: '900' },

// //   signWrap: { position: 'absolute', top: '4.2%', alignSelf: 'center', alignItems: 'center' },
// //   string: { position: 'absolute', top: -14, width: 2, height: 22, backgroundColor: '#6B4A2B' },
// //   sign: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.woodDark, borderRadius: 8, borderWidth: 3, borderColor: '#C57A3A', paddingHorizontal: 12, paddingVertical: 8, marginTop: 8 },
// //   signText: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginHorizontal: 6 },
// //   arrow: { color: '#F5A623', fontSize: 24, fontWeight: '900' },

// //   bulbPill: { position: 'absolute', top: '6%', right: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 22, paddingHorizontal: 16, height: 40 },
// //   bulbNum: { fontSize: 22, fontWeight: '900', color: '#111', marginRight: 10 },
// //   bulbIcon: { fontSize: 20 },

// //   loader: { position: 'absolute', top: '40%', alignSelf: 'center' },
// //   errBox: { position: 'absolute', top: '36%', alignSelf: 'center', alignItems: 'center', paddingHorizontal: 30 },
// //   errText: { color: C.ink, fontSize: 16, textAlign: 'center' },
// //   retry: { backgroundColor: C.gold, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 22, marginTop: 12, borderWidth: 2, borderColor: C.ink },
// //   retryText: { color: C.ink, fontWeight: '800', fontSize: 16 },

// //   board: { position: 'absolute', top: '17%', left: '20%', width: '61%', backgroundColor: C.cream, borderRadius: 16, borderWidth: 6, borderColor: C.wood, paddingTop: 6, paddingBottom: 16, paddingHorizontal: 14, alignItems: 'center' },
// //   alarm: { fontSize: 38 },
// //   question: { fontFamily: SERIF, fontStyle: 'italic', fontSize: 20, lineHeight: 28, color: C.navy, textAlign: 'center', marginTop: 4 },

// //   grid: { position: 'absolute', top: '40.5%', alignSelf: 'center', width: RING * 2 + 24, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 6 },
// //   ring: { width: RING, height: RING, borderRadius: RING / 2, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
// //   disc: { width: D, height: D, borderRadius: D / 2, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
// //   num: { fontSize: 46, fontWeight: '900', color: C.navy },
// //   right: { backgroundColor: '#BFE3A8' },
// //   wrong: { backgroundColor: '#F4B7AE' },

// //   win: { position: 'absolute', top: '70%', left: '12%', right: '12%', backgroundColor: C.cream, borderRadius: 18, borderWidth: 4, borderColor: C.wood, padding: 12, alignItems: 'center' },
// //   winTitle: { color: '#2F6B17', fontSize: 20, fontWeight: '900' },
// //   winText: { color: C.ink, textAlign: 'center', marginTop: 4, fontSize: 14, lineHeight: 20 },
// //   note: { position: 'absolute', bottom: 160, alignSelf: 'center', color: '#c0392b', fontSize: 16, fontWeight: '800' },

// //   bar: { position: 'absolute', bottom: '3.5%', left: '6%', right: '6%', height: 128, backgroundColor: C.cream, borderRadius: 64, borderWidth: 8, borderColor: '#B7D3E8', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 6 },
// //   action: { alignItems: 'center' },
// //   actBtn: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', borderWidth: 5 },
// //   hintBtn: { backgroundColor: '#9ADB1E', borderColor: '#C9EE8F' },
// //   videoBtn: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, elevation: 3 },
// //   skipBtn: { backgroundColor: '#EF3E4F', borderColor: '#FFFFFF' },
// //   actGlyph: { fontSize: 28 },
// //   videoBox: { width: 34, height: 30, backgroundColor: '#B075F0', borderWidth: 3, borderColor: '#3B2A55', borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
// //   videoPlay: { color: '#fff', fontSize: 12 },
// //   skipGlyph: { color: C.ink, fontSize: 28, marginLeft: 3 },
// //   cost: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7B4A24', borderRadius: 16, paddingHorizontal: 12, height: 30, marginTop: 6 },
// //   costIcon: { fontSize: 13, marginRight: 4 },
// //   costText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
// //   coin: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#F5B400', marginRight: 4 },
// // });
// // src/screens/braintwist/Btlevel20screen.tsx
// // Props match levels 11-19: playerId, hints, setHints, onExit, onComplete

// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
// import * as api from './api';
// import { C, Level20Room, Vine } from './Btlevel20art';
// import { Level20Option, startLevel20, submitLevel20Answer } from './Btlevel20api';

// type Props = {
//   playerId: number;
//   hints?: number;
//   setHints?: (n: number) => void;
//   onExit: () => void;
//   onComplete: (r: any) => void;
// };

// type Status = 'loading' | 'ready' | 'checking' | 'wrong' | 'correct' | 'error';
// const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

// export default function Btlevel20screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
//   const [status, setStatus] = useState<Status>('loading');
//   const [sessionId, setSessionId] = useState<number | null>(null);
//   const [text, setText] = useState('');
//   const [options, setOptions] = useState<Level20Option[]>([]);
//   const [picked, setPicked] = useState<string | null>(null);
//   const [explanation, setExplanation] = useState('');
//   const [error, setError] = useState('');
//   const [note, setNote] = useState('');
//   const busy = useRef(false);

//   const flash = (m: string) => { setNote(m); setTimeout(() => setNote(''), 1500); };

//   const load = useCallback(async () => {
//     setStatus('loading');
//     try {
//       const data = await startLevel20(playerId);   // frontend -> backend -> MySQL session
//       setSessionId(data.sessionId);
//       setText(data.question.text);
//       setOptions(data.question.options);
//       setPicked(null);
//       setStatus('ready');
//     } catch (e: any) {
//       setError(e?.message || 'Cannot load level 20');
//       setStatus('error');
//     }
//   }, [playerId]);

//   useEffect(() => { load(); }, [load]);

//   const choose = async (key: string) => {
//     if (sessionId == null || busy.current || status === 'correct') return;
//     busy.current = true;
//     setPicked(key);
//     setStatus('checking');
//     try {
//       const res = await submitLevel20Answer(playerId, sessionId, key); // backend saves + replies JSON
//       if (res.correct) {
//         setExplanation(res.explanation || '');
//         setStatus('correct');
//         setTimeout(() => onComplete({ attempts: res.attempts ?? 1, skipped: false }), 1600);
//       } else {
//         setStatus('wrong');
//         setTimeout(() => { setPicked(null); setStatus('ready'); }, 900);
//       }
//     } catch (e: any) {
//       setError(e?.message || 'Could not check your answer');
//       setStatus('error');
//     } finally {
//       busy.current = false;
//     }
//   };

//   const watchVideo = async () => {
//     if (busy.current) return;
//     busy.current = true;
//     try { const r = await api.reward(playerId, 'video'); setHints?.(r.hints); }
//     catch (e) { flash('Network error'); }
//     finally { busy.current = false; }
//   };

//   // TODO: hint (25) and skip (50) need the level 20 hint/skip endpoints, like levels 11-19
//   const hint = () => flash('Hint is not ready yet');
//   const skip = () => flash('Skip is not ready yet');

//   const showGame = ['ready', 'checking', 'wrong', 'correct'].includes(status);

//   return (
//     <Level20Room>
//       <View style={s.topLeft}>
//         <Pressable style={s.round} onPress={onExit}><Text style={s.roundGlyph}>⌂</Text></Pressable>
//         <Pressable style={s.round}><Text style={s.roundGlyph}>⚙</Text></Pressable>
//       </View>

//       <View style={s.signWrap}>
//         <View style={[s.string, { left: 26 }]} /><View style={[s.string, { right: 26 }]} />
//         <View style={s.sign}>
//           <Vine style={{ left: -14, top: -22, transform: [{ rotate: '-70deg' }] }} />
//           <Vine style={{ right: -14, top: -22, transform: [{ rotate: '70deg' }] }} />
//           <Text style={s.arrow}>{'<'}</Text>
//           <Text style={s.signText}>LEVEL 20</Text>
//           <Text style={s.arrow}>{'>'}</Text>
//         </View>
//       </View>

//       <View style={s.bulbPill}>
//         <Text style={s.bulbNum}>{hints}</Text>
//         <Text style={s.bulbIcon}>💡</Text>
//       </View>

//       {status === 'loading' && <ActivityIndicator size="large" color={C.woodDark} style={s.loader} />}

//       {status === 'error' && (
//         <View style={s.errBox}>
//           <Text style={s.errText}>{error}</Text>
//           <Pressable style={s.retry} onPress={load}><Text style={s.retryText}>Try again</Text></Pressable>
//         </View>
//       )}

//       {showGame && (
//         <>
//           <View style={s.board}>
//             <Vine style={{ left: -22, top: -20, transform: [{ rotate: '-20deg' }] }} />
//             <Vine style={{ right: -20, top: 40, transform: [{ rotate: '20deg' }] }} />
//             <Text style={s.alarm}>⏰</Text>
//             <Text style={s.question}>{text}</Text>
//           </View>

//           <View style={s.grid}>
//             {options.map(o => {
//               const isPicked = picked === o.key;
//               const tint = isPicked && status === 'correct' ? s.right : isPicked && status === 'wrong' ? s.wrong : null;
//               return (
//                 <Pressable key={o.key} style={s.ring} onPress={() => choose(o.key)}
//                   disabled={status === 'checking' || status === 'correct'}>
//                   <View style={[s.disc, tint]}><Text style={s.num}>{o.label}</Text></View>
//                 </Pressable>
//               );
//             })}
//           </View>

//           {status === 'correct' && !!explanation && (
//             <View style={s.win}>
//               <Text style={s.winTitle}>Correct!</Text>
//               <Text style={s.winText}>{explanation}</Text>
//             </View>
//           )}
//         </>
//       )}

//       {!!note && <Text style={s.note}>{note}</Text>}

//       <View style={s.bar}>
//         <View style={s.action}>
//           <Pressable style={[s.actBtn, s.hintBtn]} onPress={hint}><Text style={s.actGlyph}>🔍</Text></Pressable>
//           <View style={s.cost}><Text style={s.costIcon}>💡</Text><Text style={s.costText}>25</Text></View>
//         </View>
//         <View style={s.action}>
//           <Pressable style={[s.actBtn, s.videoBtn]} onPress={watchVideo}>
//             <View style={s.videoBox}><Text style={s.videoPlay}>▶</Text></View>
//           </Pressable>
//           <View style={s.cost}><View style={s.coin} /><Text style={s.costText}>+75</Text></View>
//         </View>
//         <View style={s.action}>
//           <Pressable style={[s.actBtn, s.skipBtn]} onPress={skip}><Text style={s.skipGlyph}>▶</Text></Pressable>
//           <View style={s.cost}><Text style={s.costIcon}>💡</Text><Text style={s.costText}>50</Text></View>
//         </View>
//       </View>
//     </Level20Room>
//   );
// }

// const D = 88;
// const RING = D + 22;

// const s = StyleSheet.create({
//   topLeft: { position: 'absolute', top: '5.8%', left: 10, flexDirection: 'row', gap: 6 },
//   round: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.gold, borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
//   roundGlyph: { fontSize: 20, color: C.ink, fontWeight: '900' },

//   signWrap: { position: 'absolute', top: '4.2%', alignSelf: 'center', alignItems: 'center' },
//   string: { position: 'absolute', top: -14, width: 2, height: 22, backgroundColor: '#6B4A2B' },
//   sign: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.woodDark, borderRadius: 8, borderWidth: 3, borderColor: '#C57A3A', paddingHorizontal: 8, paddingVertical: 6, marginTop: 8 },
//   signText: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginHorizontal: 4 },
//   arrow: { color: '#F5A623', fontSize: 20, fontWeight: '900' },

//   bulbPill: { position: 'absolute', top: '6%', right: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 22, paddingHorizontal: 16, height: 40 },
//   bulbNum: { fontSize: 22, fontWeight: '900', color: '#111', marginRight: 10 },
//   bulbIcon: { fontSize: 20 },

//   loader: { position: 'absolute', top: '40%', alignSelf: 'center' },
//   errBox: { position: 'absolute', top: '36%', alignSelf: 'center', alignItems: 'center', paddingHorizontal: 30 },
//   errText: { color: C.ink, fontSize: 16, textAlign: 'center' },
//   retry: { backgroundColor: C.gold, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 22, marginTop: 12, borderWidth: 2, borderColor: C.ink },
//   retryText: { color: C.ink, fontWeight: '800', fontSize: 16 },

//   board: { position: 'absolute', top: '17%', left: '20%', width: '61%', backgroundColor: C.cream, borderRadius: 16, borderWidth: 6, borderColor: C.wood, paddingTop: 6, paddingBottom: 16, paddingHorizontal: 14, alignItems: 'center' },
//   alarm: { fontSize: 38 },
//   question: { fontFamily: SERIF, fontStyle: 'italic', fontSize: 20, lineHeight: 28, color: C.navy, textAlign: 'center', marginTop: 4 },

//   grid: { position: 'absolute', top: '40.5%', alignSelf: 'center', width: RING * 2 + 24, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 6 },
//   ring: { width: RING, height: RING, borderRadius: RING / 2, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
//   disc: { width: D, height: D, borderRadius: D / 2, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
//   num: { fontSize: 46, fontWeight: '900', color: C.navy },
//   right: { backgroundColor: '#BFE3A8' },
//   wrong: { backgroundColor: '#F4B7AE' },

//   win: { position: 'absolute', top: '70%', left: '12%', right: '12%', backgroundColor: C.cream, borderRadius: 18, borderWidth: 4, borderColor: C.wood, padding: 12, alignItems: 'center' },
//   winTitle: { color: '#2F6B17', fontSize: 20, fontWeight: '900' },
//   winText: { color: C.ink, textAlign: 'center', marginTop: 4, fontSize: 14, lineHeight: 20 },
//   note: { position: 'absolute', bottom: 160, alignSelf: 'center', color: '#c0392b', fontSize: 16, fontWeight: '800' },

//   bar: { position: 'absolute', bottom: '3.5%', left: '6%', right: '6%', height: 128, backgroundColor: C.cream, borderRadius: 64, borderWidth: 8, borderColor: '#B7D3E8', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 6 },
//   action: { alignItems: 'center' },
//   actBtn: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', borderWidth: 5 },
//   hintBtn: { backgroundColor: '#9ADB1E', borderColor: '#C9EE8F' },
//   videoBtn: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, elevation: 3 },
//   skipBtn: { backgroundColor: '#EF3E4F', borderColor: '#FFFFFF' },
//   actGlyph: { fontSize: 28 },
//   videoBox: { width: 34, height: 30, backgroundColor: '#B075F0', borderWidth: 3, borderColor: '#3B2A55', borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
//   videoPlay: { color: '#fff', fontSize: 12 },
//   skipGlyph: { color: C.ink, fontSize: 28, marginLeft: 3 },
//   cost: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7B4A24', borderRadius: 16, paddingHorizontal: 12, height: 30, marginTop: 6 },
//   costIcon: { fontSize: 13, marginRight: 4 },
//   costText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
//   coin: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#F5B400', marginRight: 4 },
// });
// src/screens/braintwist/Btlevel20screen.tsx
// Props match levels 11-19: playerId, hints, setHints, onExit, onComplete

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as api from './api';
import { C, Level20Room, Vine } from './Btlevel20art';
import { Level20Option, startLevel20, submitLevel20Answer } from './Btlevel20api';

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit: () => void;
  onComplete: (r: any) => void;
};

type Status = 'loading' | 'ready' | 'checking' | 'wrong' | 'correct' | 'error';
const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

export default function Btlevel20screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
  const [status, setStatus] = useState<Status>('loading');
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [options, setOptions] = useState<Level20Option[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const busy = useRef(false);

  const flash = (m: string) => { setNote(m); setTimeout(() => setNote(''), 1500); };

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await startLevel20(playerId);   // frontend -> backend -> MySQL session
      setSessionId(data.sessionId);
      setText(data.question.text);
      setOptions(data.question.options);
      setPicked(null);
      setStatus('ready');
    } catch (e: any) {
      setError(e?.message || 'Cannot load level 20');
      setStatus('error');
    }
  }, [playerId]);

  useEffect(() => { load(); }, [load]);

  const choose = async (key: string) => {
    if (sessionId == null || busy.current || status === 'correct') return;
    busy.current = true;
    setPicked(key);
    setStatus('checking');
    try {
      const res = await submitLevel20Answer(playerId, sessionId, key); // backend saves + replies JSON
      if (res.correct) {
        setExplanation(res.explanation || '');
        setStatus('correct');
        setTimeout(() => onComplete({ attempts: res.attempts ?? 1, skipped: false }), 1600);
      } else {
        setStatus('wrong');
        setTimeout(() => { setPicked(null); setStatus('ready'); }, 900);
      }
    } catch (e: any) {
      setError(e?.message || 'Could not check your answer');
      setStatus('error');
    } finally {
      busy.current = false;
    }
  };

  const watchVideo = async () => {
    if (busy.current) return;
    busy.current = true;
    try { const r = await api.reward(playerId, 'video'); setHints?.(r.hints); }
    catch (e) { flash('Network error'); }
    finally { busy.current = false; }
  };

  // TODO: hint (25) and skip (50) need the level 20 hint/skip endpoints, like levels 11-19
  const hint = () => flash('Hint is not ready yet');
  const skip = () => flash('Skip is not ready yet');

  const showGame = ['ready', 'checking', 'wrong', 'correct'].includes(status);

  return (
    <Level20Room>
      <View style={s.topLeft}>
        <Pressable style={s.round} onPress={onExit}><Text style={s.roundGlyph}>⌂</Text></Pressable>
        <Pressable style={s.round}><Text style={s.roundGlyph}>⚙</Text></Pressable>
      </View>

      <View style={s.signWrap}>
        <View style={[s.string, { left: 26 }]} /><View style={[s.string, { right: 26 }]} />
        <View style={s.sign}>
          <Vine style={{ left: -14, top: -22, transform: [{ rotate: '-70deg' }] }} />
          <Vine style={{ right: -14, top: -22, transform: [{ rotate: '70deg' }] }} />
          <Text style={s.arrow}>{'<'}</Text>
          <Text style={s.signText}>LEVEL 20</Text>
          <Text style={s.arrow}>{'>'}</Text>
        </View>
      </View>

      <View style={s.bulbPill}>
        <Text style={s.bulbNum}>{hints}</Text>
        <Text style={s.bulbIcon}>💡</Text>
      </View>

      {status === 'loading' && <ActivityIndicator size="large" color={C.woodDark} style={s.loader} />}

      {status === 'error' && (
        <View style={s.errBox}>
          <Text style={s.errText}>{error}</Text>
          <Pressable style={s.retry} onPress={load}><Text style={s.retryText}>Try again</Text></Pressable>
        </View>
      )}

      {showGame && (
        <View style={s.content}>
          <View style={s.board}>
            <Vine style={{ left: -22, top: -20, transform: [{ rotate: '-20deg' }] }} />
            <Vine style={{ right: -20, top: 40, transform: [{ rotate: '20deg' }] }} />
            <Text style={s.alarm}>⏰</Text>
            <Text style={s.question}>{text}</Text>
          </View>

          <View style={s.grid}>
            {options.map(o => {
              const isPicked = picked === o.key;
              const tint = isPicked && status === 'correct' ? s.right : isPicked && status === 'wrong' ? s.wrong : null;
              return (
                <Pressable key={o.key} style={s.ring} onPress={() => choose(o.key)}
                  disabled={status === 'checking' || status === 'correct'}>
                  <View style={[s.disc, tint]}><Text style={s.num}>{o.label}</Text></View>
                </Pressable>
              );
            })}
          </View>

          {status === 'correct' && !!explanation && (
            <View style={s.win}>
              <Text style={s.winTitle}>Correct!</Text>
              <Text style={s.winText}>{explanation}</Text>
            </View>
          )}
        </View>
      )}

      {!!note && <Text style={s.note}>{note}</Text>}

      <View style={s.bar}>
        <View style={s.action}>
          <Pressable style={[s.actBtn, s.hintBtn]} onPress={hint}><Text style={s.actGlyph}>🔍</Text></Pressable>
          <View style={s.cost}><Text style={s.costIcon}>💡</Text><Text style={s.costText}>25</Text></View>
        </View>
        <View style={s.action}>
          <Pressable style={[s.actBtn, s.videoBtn]} onPress={watchVideo}>
            <View style={s.videoBox}><Text style={s.videoPlay}>▶</Text></View>
          </Pressable>
          <View style={s.cost}><View style={s.coin} /><Text style={s.costText}>+75</Text></View>
        </View>
        <View style={s.action}>
          <Pressable style={[s.actBtn, s.skipBtn]} onPress={skip}><Text style={s.skipGlyph}>▶</Text></Pressable>
          <View style={s.cost}><Text style={s.costIcon}>💡</Text><Text style={s.costText}>50</Text></View>
        </View>
      </View>
    </Level20Room>
  );
}

const D = 88;
const RING = D + 22;

const s = StyleSheet.create({
  content: { position: 'absolute', top: '15%', left: 0, right: 0, alignItems: 'center' },
  topLeft: { position: 'absolute', top: '5.8%', left: 10, flexDirection: 'row', gap: 6 },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.gold, borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  roundGlyph: { fontSize: 20, color: C.ink, fontWeight: '900' },

  signWrap: { position: 'absolute', top: '4.2%', alignSelf: 'center', alignItems: 'center' },
  string: { position: 'absolute', top: -14, width: 2, height: 22, backgroundColor: '#6B4A2B' },
  sign: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.woodDark, borderRadius: 8, borderWidth: 3, borderColor: '#C57A3A', paddingHorizontal: 8, paddingVertical: 6, marginTop: 8 },
  signText: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginHorizontal: 4 },
  arrow: { color: '#F5A623', fontSize: 20, fontWeight: '900' },

  bulbPill: { position: 'absolute', top: '6%', right: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 22, paddingHorizontal: 16, height: 40 },
  bulbNum: { fontSize: 22, fontWeight: '900', color: '#111', marginRight: 10 },
  bulbIcon: { fontSize: 20 },

  loader: { position: 'absolute', top: '40%', alignSelf: 'center' },
  errBox: { position: 'absolute', top: '36%', alignSelf: 'center', alignItems: 'center', paddingHorizontal: 30 },
  errText: { color: C.ink, fontSize: 16, textAlign: 'center' },
  retry: { backgroundColor: C.gold, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 22, marginTop: 12, borderWidth: 2, borderColor: C.ink },
  retryText: { color: C.ink, fontWeight: '800', fontSize: 16 },

  board: { width: '78%', backgroundColor: C.cream, borderRadius: 16, borderWidth: 6, borderColor: C.wood, paddingTop: 6, paddingBottom: 16, paddingHorizontal: 14, alignItems: 'center' },
  alarm: { fontSize: 38 },
  question: { fontFamily: SERIF, fontStyle: 'italic', fontSize: 18, lineHeight: 26, color: C.navy, textAlign: 'center', marginTop: 4 },

  grid: { marginTop: 22, width: RING * 2 + 24, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 6 },
  ring: { width: RING, height: RING, borderRadius: RING / 2, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  disc: { width: D, height: D, borderRadius: D / 2, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  num: { fontSize: 46, fontWeight: '900', color: C.navy },
  right: { backgroundColor: '#BFE3A8' },
  wrong: { backgroundColor: '#F4B7AE' },

  win: { marginTop: 12, width: '78%', backgroundColor: C.cream, borderRadius: 18, borderWidth: 4, borderColor: C.wood, padding: 12, alignItems: 'center' },
  winTitle: { color: '#2F6B17', fontSize: 20, fontWeight: '900' },
  winText: { color: C.ink, textAlign: 'center', marginTop: 4, fontSize: 14, lineHeight: 20 },
  note: { position: 'absolute', bottom: 160, alignSelf: 'center', color: '#c0392b', fontSize: 16, fontWeight: '800' },

  bar: { position: 'absolute', bottom: '3.5%', left: '6%', right: '6%', height: 128, backgroundColor: C.cream, borderRadius: 64, borderWidth: 8, borderColor: '#B7D3E8', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 6 },
  action: { alignItems: 'center' },
  actBtn: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', borderWidth: 5 },
  hintBtn: { backgroundColor: '#9ADB1E', borderColor: '#C9EE8F' },
  videoBtn: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, elevation: 3 },
  skipBtn: { backgroundColor: '#EF3E4F', borderColor: '#FFFFFF' },
  actGlyph: { fontSize: 28 },
  videoBox: { width: 34, height: 30, backgroundColor: '#B075F0', borderWidth: 3, borderColor: '#3B2A55', borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  videoPlay: { color: '#fff', fontSize: 12 },
  skipGlyph: { color: C.ink, fontSize: 28, marginLeft: 3 },
  cost: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7B4A24', borderRadius: 16, paddingHorizontal: 12, height: 30, marginTop: 6 },
  costIcon: { fontSize: 13, marginRight: 4 },
  costText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  coin: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#F5B400', marginRight: 4 },
});
