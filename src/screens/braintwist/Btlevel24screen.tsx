// // // // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // // // import {
// // // // // //   View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator, Alert,
// // // // // // } from 'react-native';
// // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // import { Level24Background, WoodPlate } from './Btlevel24art';
// // // // // // import { startLevel24, answerLevel24, Level24Option } from './Btlevel24api';

// // // // // // const LEVEL = 24;
// // // // // // const BADGE_COLORS: Record<string, string> = { A: '#e8456b', B: '#2f8ff0', C: '#f5a30c' };

// // // // // // type Props = {
// // // // // //   navigation?: any;
// // // // // //   token?: string;      // pass the auth token the same way your other levels do
// // // // // //   hints?: number;
// // // // // // };

// // // // // // export default function Btlevel24screen({ navigation, token, hints = 0 }: Props) {
// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [sessionId, setSessionId] = useState<number | null>(null);
// // // // // //   const [question, setQuestion] = useState('');
// // // // // //   const [options, setOptions] = useState<Level24Option[]>([]);
// // // // // //   const [picked, setPicked] = useState<string | null>(null);
// // // // // //   const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle');
// // // // // //   const busy = useRef(false);
// // // // // //   const shake = useRef(new Animated.Value(0)).current;

// // // // // //   const load = useCallback(async () => {
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       const data = await startLevel24(token);
// // // // // //       setSessionId(data.sessionId);
// // // // // //       setQuestion(data.question);
// // // // // //       setOptions(data.options);
// // // // // //     } catch (e) {
// // // // // //       Alert.alert('Error', 'Could not load the level. Check your connection.');
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   }, [token]);

// // // // // //   useEffect(() => { load(); }, [load]);

// // // // // //   const doShake = () => {
// // // // // //     shake.setValue(0);
// // // // // //     Animated.sequence([
// // // // // //       Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
// // // // // //       Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
// // // // // //       Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
// // // // // //       Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
// // // // // //     ]).start();
// // // // // //   };

// // // // // //   const onPick = async (id: string) => {
// // // // // //     if (busy.current || sessionId == null || status === 'right') return;
// // // // // //     busy.current = true;
// // // // // //     setPicked(id);
// // // // // //     try {
// // // // // //       const res = await answerLevel24(sessionId, id, token);
// // // // // //       if (res.correct) {
// // // // // //         setStatus('right');
// // // // // //         // TODO: call your progressApi here (same as level 23) to unlock level 25
// // // // // //         setTimeout(() => navigation?.navigate?.('BTLevelMapScreen'), 1200);
// // // // // //       } else {
// // // // // //         setStatus('wrong');
// // // // // //         doShake();
// // // // // //         setTimeout(() => { setStatus('idle'); setPicked(null); }, 800);
// // // // // //       }
// // // // // //     } catch {
// // // // // //       Alert.alert('Error', 'Could not submit your answer.');
// // // // // //       setPicked(null);
// // // // // //     } finally {
// // // // // //       busy.current = false;
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <View style={styles.root}>
// // // // // //       <Level24Background />
// // // // // //       <SafeAreaView style={styles.safe}>
// // // // // //         {/* top bar */}
// // // // // //         <View style={styles.topBar}>
// // // // // //           <View style={styles.row}>
// // // // // //             <TouchableOpacity style={styles.roundBtn} onPress={() => navigation?.navigate?.('Home')}>
// // // // // //               <Text style={styles.roundTxt}>🏠</Text>
// // // // // //             </TouchableOpacity>
// // // // // //             <TouchableOpacity style={[styles.roundBtn, { marginLeft: 8 }]} onPress={() => navigation?.navigate?.('Settings')}>
// // // // // //               <Text style={styles.roundTxt}>⚙️</Text>
// // // // // //             </TouchableOpacity>
// // // // // //           </View>
// // // // // //           <View style={styles.hintPill}>
// // // // // //             <Text style={styles.hintBulb}>💡</Text>
// // // // // //             <Text style={styles.hintNum}>{hints}</Text>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         {/* level sign */}
// // // // // //         <View style={styles.signWrap}>
// // // // // //           <View style={styles.rope} /><View style={[styles.rope, { right: 40, left: undefined }]} />
// // // // // //           <WoodPlate style={styles.sign}>
// // // // // //             <Text style={styles.signTxt}>LEVEL {LEVEL}</Text>
// // // // // //           </WoodPlate>
// // // // // //         </View>

// // // // // //         {loading ? (
// // // // // //           <ActivityIndicator size="large" color="#8a4f1d" style={{ marginTop: 60 }} />
// // // // // //         ) : (
// // // // // //           <Animated.View style={{ transform: [{ translateX: shake }], flex: 1 }}>
// // // // // //             {/* question frame */}
// // // // // //             <WoodPlate style={styles.frame}>
// // // // // //               <View style={styles.paper}>
// // // // // //                 <Text style={styles.question}>{question}</Text>
// // // // // //               </View>
// // // // // //             </WoodPlate>

// // // // // //             {/* options */}
// // // // // //             <View style={styles.options}>
// // // // // //               {options.map((o) => {
// // // // // //                 const isPicked = picked === o.id;
// // // // // //                 const bg =
// // // // // //                   isPicked && status === 'right' ? '#c8f2c2'
// // // // // //                   : isPicked && status === 'wrong' ? '#ffc9c9'
// // // // // //                   : '#fdf3df';
// // // // // //                 return (
// // // // // //                   <TouchableOpacity
// // // // // //                     key={o.id}
// // // // // //                     activeOpacity={0.85}
// // // // // //                     style={[styles.option, { backgroundColor: bg }]}
// // // // // //                     onPress={() => onPick(o.id)}
// // // // // //                   >
// // // // // //                     <View style={[styles.badge, { backgroundColor: BADGE_COLORS[o.id] }]}>
// // // // // //                       <Text style={styles.badgeTxt}>{o.id}</Text>
// // // // // //                     </View>
// // // // // //                     <Text style={styles.optTxt}>{o.text}</Text>
// // // // // //                   </TouchableOpacity>
// // // // // //                 );
// // // // // //               })}
// // // // // //             </View>
// // // // // //           </Animated.View>
// // // // // //         )}
// // // // // //       </SafeAreaView>
// // // // // //     </View>
// // // // // //   );
// // // // // // }

// // // // // // const styles = StyleSheet.create({
// // // // // //   root: { flex: 1, backgroundColor: '#fdebc8' },
// // // // // //   safe: { flex: 1, paddingHorizontal: 16 },
// // // // // //   row: { flexDirection: 'row' },
// // // // // //   topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
// // // // // //   roundBtn: {
// // // // // //     width: 44, height: 44, borderRadius: 22, backgroundColor: '#fbc45a',
// // // // // //     borderWidth: 3, borderColor: '#a8601f', alignItems: 'center', justifyContent: 'center',
// // // // // //   },
// // // // // //   roundTxt: { fontSize: 20 },
// // // // // //   hintPill: {
// // // // // //     flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff6e6',
// // // // // //     borderRadius: 22, borderWidth: 2, borderColor: '#e1b878',
// // // // // //     paddingHorizontal: 16, paddingVertical: 6, minWidth: 90, justifyContent: 'space-between',
// // // // // //   },
// // // // // //   hintBulb: { fontSize: 20 },
// // // // // //   hintNum: { fontSize: 20, fontWeight: '800', color: '#5a3a1a' },

// // // // // //   signWrap: { alignItems: 'center', marginTop: -6 },
// // // // // //   rope: { position: 'absolute', top: -30, left: 40, width: 3, height: 40, backgroundColor: '#8a5a2b' },
// // // // // //   sign: { paddingHorizontal: 34, paddingVertical: 10, marginTop: 8 },
// // // // // //   signTxt: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 1,
// // // // // //     textShadowColor: '#7a3f10', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 2 },

// // // // // //   frame: { marginTop: 22, padding: 10, borderRadius: 18 },
// // // // // //   paper: { backgroundColor: '#fdf1d8', borderRadius: 12, paddingVertical: 28, paddingHorizontal: 18 },
// // // // // //   question: { fontSize: 22, lineHeight: 32, textAlign: 'center', color: '#3a2412', fontWeight: '700' },

// // // // // //   options: { marginTop: 22 },
// // // // // //   option: {
// // // // // //     flexDirection: 'row', alignItems: 'center', borderRadius: 30, borderWidth: 3,
// // // // // //     borderColor: '#7a4a22', paddingVertical: 12, paddingHorizontal: 14, marginBottom: 14,
// // // // // //     shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 3 }, elevation: 4,
// // // // // //   },
// // // // // //   badge: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
// // // // // //     borderWidth: 2, borderColor: 'rgba(255,255,255,0.7)' },
// // // // // //   badgeTxt: { color: '#fff', fontSize: 24, fontWeight: '900' },
// // // // // //   optTxt: { flex: 1, textAlign: 'center', fontSize: 24, fontWeight: '800', color: '#3a2412', marginRight: 52 },
// // // // // // });
// // // // // import React, { useEffect, useRef, useState } from 'react';
// // // // // import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';
// // // // // import { startLevel24, answerLevel24 } from './Btlevel24api';

// // // // // // Put the picture at: src/screens/braintwist/assets/level24bg.png
// // // // // const BG = require('./assets/level24bg.png');

// // // // // // The picture is 812 x 1459. All positions below are in picture pixels.
// // // // // const IW = 812;
// // // // // const IH = 1459;

// // // // // const PILLS = [
// // // // //   { id: 'A', x: 140, y: 697, w: 548, h: 129 },
// // // // //   { id: 'B', x: 140, y: 850, w: 548, h: 130 },
// // // // //   { id: 'C', x: 140, y: 1003, w: 548, h: 132 },
// // // // // ];
// // // // // const HOME = { x: 26, y: 75, w: 80, h: 80 };
// // // // // const HINT_NUM = { x: 700, y: 92, w: 72, h: 48 }; // covers the baked-in "0"

// // // // // type Props = {
// // // // //   playerId: number | string;
// // // // //   hints: number;
// // // // //   setHints?: (n: number) => void;
// // // // //   onExit: () => void;
// // // // //   onComplete: (r: any) => void;
// // // // // };

// // // // // export default function BTLevel24Screen({ playerId, hints, onExit, onComplete }: Props) {
// // // // //   const [box, setBox] = useState({ w: 0, h: 0 });
// // // // //   const [picked, setPicked] = useState<string | null>(null);
// // // // //   const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle');
// // // // //   const [err, setErr] = useState('');
// // // // //   const sessionRef = useRef<number | null>(null);
// // // // //   const busy = useRef(false);
// // // // //   const shake = useRef(new Animated.Value(0)).current;

// // // // //   const ensureSession = async () => {
// // // // //     if (sessionRef.current != null) return sessionRef.current;
// // // // //     const d = await startLevel24(playerId);
// // // // //     sessionRef.current = d.sessionId;
// // // // //     return d.sessionId;
// // // // //   };

// // // // //   useEffect(() => { ensureSession().catch(() => {}); }, [playerId]);

// // // // //   const doShake = () =>
// // // // //     Animated.sequence([10, -10, 6, -6, 0].map((v) =>
// // // // //       Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }),
// // // // //     )).start();

// // // // //   const flash = (m: string) => { setErr(m); setTimeout(() => setErr(''), 1500); };

// // // // //   const onPick = async (id: string) => {
// // // // //     if (busy.current || status === 'right') return;
// // // // //     busy.current = true;
// // // // //     setPicked(id);
// // // // //     try {
// // // // //       const sid = await ensureSession();
// // // // //       const r = await answerLevel24(playerId, sid, id);
// // // // //       if (r.correct) {
// // // // //         setStatus('right');
// // // // //         setTimeout(() => onComplete({ ...r, skipped: false }), 1000);
// // // // //       } else {
// // // // //         setStatus('wrong');
// // // // //         doShake();
// // // // //         setTimeout(() => { setStatus('idle'); setPicked(null); }, 800);
// // // // //       }
// // // // //     } catch {
// // // // //       flash('Network error');
// // // // //       setPicked(null);
// // // // //     } finally {
// // // // //       busy.current = false;
// // // // //     }
// // // // //   };

// // // // //   // "cover" fit: picture fills the whole screen without stretching
// // // // //   const scale = box.w ? Math.max(box.w / IW, box.h / IH) : 1;
// // // // //   const offX = (box.w - IW * scale) / 2;
// // // // //   const offY = (box.h - IH * scale) / 2;
// // // // //   const R = (r: { x: number; y: number; w: number; h: number }) => ({
// // // // //     position: 'absolute' as const,
// // // // //     left: offX + r.x * scale,
// // // // //     top: offY + r.y * scale,
// // // // //     width: r.w * scale,
// // // // //     height: r.h * scale,
// // // // //   });

// // // // //   const onLayout = (e: LayoutChangeEvent) =>
// // // // //     setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

// // // // //   return (
// // // // //     <View style={s.root} onLayout={onLayout}>
// // // // //       {box.w > 0 && (
// // // // //         <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: shake }] }]}>
// // // // //           <Image
// // // // //             source={BG}
// // // // //             style={{ position: 'absolute', left: offX, top: offY, width: IW * scale, height: IH * scale }}
// // // // //           />

// // // // //           {/* live hint number drawn over the baked-in 0 */}
// // // // //           <View style={[R(HINT_NUM), s.hintCover]}>
// // // // //             <Text style={[s.hintTxt, { fontSize: 30 * scale }]}>{hints}</Text>
// // // // //           </View>

// // // // //           {/* home button */}
// // // // //           <TouchableOpacity style={R(HOME)} onPress={onExit} />

// // // // //           {/* answer buttons */}
// // // // //           {PILLS.map((p) => {
// // // // //             const isPicked = picked === p.id;
// // // // //             const bg =
// // // // //               isPicked && status === 'right' ? 'rgba(120,220,110,0.55)'
// // // // //               : isPicked && status === 'wrong' ? 'rgba(255,90,90,0.45)'
// // // // //               : 'transparent';
// // // // //             return (
// // // // //               <TouchableOpacity
// // // // //                 key={p.id}
// // // // //                 activeOpacity={0.7}
// // // // //                 style={[R(p), { borderRadius: 40 * scale, backgroundColor: bg }]}
// // // // //                 onPress={() => onPick(p.id)}
// // // // //               />
// // // // //             );
// // // // //           })}

// // // // //           {!!err && <Text style={s.err}>{err}</Text>}
// // // // //         </Animated.View>
// // // // //       )}
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const s = StyleSheet.create({
// // // // //   root: { flex: 1, backgroundColor: '#fdebc8', overflow: 'hidden' },
// // // // //   hintCover: { backgroundColor: 'rgb(252,240,222)', alignItems: 'flex-start', justifyContent: 'center' },
// // // // //   hintTxt: { fontWeight: '800', color: '#3a2412' },
// // // // //   err: { position: 'absolute', bottom: 24, alignSelf: 'center', color: '#c0392b', fontSize: 17, fontWeight: 'bold' },
// // // // // });
// // // // import React, { useEffect, useRef, useState } from 'react';
// // // // import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
// // // // import Svg, {
// // // //   Defs, LinearGradient, Stop, Rect, Ellipse, Circle, Path, G,
// // // // } from 'react-native-svg';
// // // // import { F } from './BTShared';
// // // // import { startLevel24, answerLevel24 } from './Btlevel24api';

// // // // const QUESTION =
// // // //   'When I was 4 years old, my younger sister was half my age. If I am now 20 years old, how old is my younger sister?';
// // // // const OPTIONS = [
// // // //   { id: 'A', text: '10 years', color: '#e8456b' },
// // // //   { id: 'B', text: '16 years', color: '#2f8ff0' },
// // // //   { id: 'C', text: '18 years', color: '#f5a30c' },
// // // // ];

// // // // const WOOD = '#d98b3d';
// // // // const WOOD_DARK = '#8a4f1d';
// // // // const INK = '#3a2412';

// // // // /* ---------- small drawing pieces ---------- */
// // // // const Leaf = ({ x, y, r = 0, s = 1, c = '#4caf50' }: any) => (
// // // //   <G transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
// // // //     <Path d="M0 0 C 14 -18, 36 -8, 32 12 C 16 18, 4 12, 0 0 Z" fill={c} />
// // // //     <Path d="M2 2 C 12 -3, 22 -1, 30 9" stroke="#2e7d32" strokeWidth={1.5} fill="none" />
// // // //   </G>
// // // // );

// // // // const Plant = ({ x, y, s = 1, pot = '#f3d9cf' }: any) => (
// // // //   <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // //     <Leaf x={0} y={0} r={-70} />
// // // //     <Leaf x={0} y={0} r={-30} s={1.2} c="#5cbb55" />
// // // //     <Leaf x={0} y={0} r={10} s={1.1} />
// // // //     <Leaf x={0} y={0} r={-110} s={1.1} c="#5cbb55" />
// // // //     <Leaf x={0} y={0} r={-150} />
// // // //     <Leaf x={0} y={0} r={-90} s={1.4} c="#3f9d4a" />
// // // //     <Path d="M-26 0 L26 0 L20 46 L-20 46 Z" fill={pot} />
// // // //     <Rect x={-28} y={-4} width={56} height={8} rx={4} fill="#ecc9bb" />
// // // //   </G>
// // // // );

// // // // const Flower = ({ x, y, s = 1 }: any) => (
// // // //   <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // //     {[0, 72, 144, 216, 288].map((a) => (
// // // //       <Ellipse key={a} cx={0} cy={-6} rx={4} ry={6} fill="#fff" transform={`rotate(${a})`} />
// // // //     ))}
// // // //     <Circle cx={0} cy={0} r={3} fill="#f5b041" />
// // // //   </G>
// // // // );

// // // // const Book = ({ x, y, w, h, c }: any) => <Rect x={x} y={y} width={w} height={h} rx={3} fill={c} />;

// // // // /* ---------- full room background ---------- */
// // // // const Room = () => (
// // // //   <View style={StyleSheet.absoluteFill} pointerEvents="none">
// // // //     <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
// // // //       <Defs>
// // // //         <LinearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
// // // //           <Stop offset="0" stopColor="#fbe7bf" />
// // // //           <Stop offset="1" stopColor="#f3cd8d" />
// // // //         </LinearGradient>
// // // //         <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
// // // //           <Stop offset="0" stopColor="#7cc7f2" />
// // // //           <Stop offset="1" stopColor="#cdeeff" />
// // // //         </LinearGradient>
// // // //         <LinearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
// // // //           <Stop offset="0" stopColor="#f5c176" />
// // // //           <Stop offset="1" stopColor="#e5a14d" />
// // // //         </LinearGradient>
// // // //       </Defs>

// // // //       <Rect width={400} height={800} fill="url(#wall)" />
// // // //       <Rect y={625} width={400} height={175} fill="url(#floor)" />
// // // //       <Rect y={618} width={400} height={10} fill="#e9b88b" />

// // // //       {/* window */}
// // // //       <Rect x={-10} y={20} width={84} height={300} fill="#e2a15b" />
// // // //       <Rect x={-4} y={28} width={72} height={284} fill="url(#sky)" />
// // // //       <Ellipse cx={22} cy={90} rx={26} ry={13} fill="#fff" opacity={0.9} />
// // // //       <Ellipse cx={46} cy={98} rx={20} ry={10} fill="#fff" opacity={0.9} />
// // // //       <Circle cx={10} cy={230} r={40} fill="#6dbb4f" />
// // // //       <Circle cx={48} cy={250} r={34} fill="#58a845" />
// // // //       <Circle cx={20} cy={285} r={36} fill="#7ccb5a" />
// // // //       <Rect x={-4} y={150} width={72} height={5} fill="#e2a15b" />
// // // //       <Rect x={-10} y={312} width={96} height={10} fill="#e9b370" />

// // // //       {/* left plants + table */}
// // // //       <Plant x={22} y={310} s={1.15} />
// // // //       <Plant x={28} y={470} s={1.6} />
// // // //       <Rect x={-6} y={500} width={70} height={10} rx={3} fill="#d9894a" />
// // // //       <Rect x={4} y={510} width={8} height={90} fill="#c47a3d" />
// // // //       <Rect x={52} y={510} width={8} height={90} fill="#c47a3d" />

// // // //       {/* right bookshelf */}
// // // //       <Rect x={366} y={20} width={44} height={595} fill="#e9b672" />
// // // //       <Rect x={366} y={20} width={4} height={595} fill="#cf9650" />
// // // //       <Rect x={366} y={170} width={44} height={6} fill="#cf9650" />
// // // //       <Rect x={366} y={300} width={44} height={6} fill="#cf9650" />
// // // //       <Rect x={366} y={420} width={44} height={6} fill="#cf9650" />
// // // //       <Book x={374} y={100} w={11} h={68} c="#a97fd6" />
// // // //       <Book x={386} y={106} w={11} h={62} c="#69b57b" />
// // // //       <Book x={374} y={240} w={11} h={58} c="#ec6f9a" />
// // // //       <Book x={386} y={246} w={11} h={52} c="#4a8ae0" />
// // // //       <Book x={374} y={350} w={12} h={68} c="#4a8ae0" />
// // // //       <Book x={387} y={356} w={11} h={62} c="#58b27a" />
// // // //       {/* cat pot */}
// // // //       <Rect x={370} y={190} width={34} height={28} rx={9} fill="#fbeee6" />
// // // //       <Circle cx={380} cy={203} r={1.8} fill="#6b4a3a" />
// // // //       <Circle cx={394} cy={203} r={1.8} fill="#6b4a3a" />
// // // //       <Plant x={388} y={560} s={0.8} pot="#e8a56a" />

// // // //       {/* bottom decor */}
// // // //       <Ellipse cx={215} cy={742} rx={200} ry={52} fill="#f4a3b4" />
// // // //       <Ellipse cx={215} cy={742} rx={168} ry={40} fill="#f8bccb" />
// // // //       <Flower x={170} y={742} />
// // // //       <Flower x={260} y={730} />
// // // //       <Flower x={215} y={758} s={0.8} />
// // // //       <Rect x={290} y={740} width={120} height={14} rx={4} fill="#c47a3d" />
// // // //       <Rect x={-6} y={650} width={72} height={26} rx={4} fill="#3fb07e" />
// // // //       <Rect x={-10} y={676} width={80} height={26} rx={4} fill="#ec6f9a" />
// // // //       <Rect x={-4} y={702} width={70} height={26} rx={4} fill="#3f7fd6" />
// // // //       <Plant x={22} y={800} s={1.5} />
// // // //       <Plant x={382} y={768} s={1.1} />
// // // //       <Flower x={380} y={744} s={1.4} />
// // // //     </Svg>
// // // //   </View>
// // // // );

// // // // /* ---------- corner vine for the frame and sign ---------- */
// // // // const Vine = ({ flip = false }: { flip?: boolean }) => (
// // // //   <Svg width={90} height={60} viewBox="0 0 90 60" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
// // // //     <Path d="M2 52 C 22 40, 44 40, 84 8" stroke="#3f8f3f" strokeWidth={3} fill="none" />
// // // //     <Leaf x={20} y={44} r={-35} s={0.9} />
// // // //     <Leaf x={34} y={38} r={-120} s={0.8} c="#5cbb55" />
// // // //     <Leaf x={50} y={30} r={-30} s={0.9} />
// // // //     <Leaf x={62} y={22} r={-110} s={0.8} c="#5cbb55" />
// // // //     <Leaf x={76} y={12} r={-40} s={0.9} />
// // // //     <Flower x={36} y={36} s={1.1} />
// // // //   </Svg>
// // // // );

// // // // /* ---------- little icons ---------- */
// // // // const HomeIcon = () => (
// // // //   <Svg width={24} height={24} viewBox="0 0 24 24">
// // // //     <Path d="M12 3 L2 12 H5 V21 H10 V15 H14 V21 H19 V12 H22 Z" fill={INK} />
// // // //   </Svg>
// // // // );
// // // // const GearIcon = () => (
// // // //   <Svg width={26} height={26} viewBox="0 0 24 24">
// // // //     <Circle cx={12} cy={12} r={8} stroke={INK} strokeWidth={4} strokeDasharray="3.1 3.1" fill="none" />
// // // //     <Circle cx={12} cy={12} r={6.5} fill={INK} />
// // // //     <Circle cx={12} cy={12} r={2.8} fill="#fbc45a" />
// // // //   </Svg>
// // // // );
// // // // const Bulb = () => (
// // // //   <Svg width={26} height={30} viewBox="0 0 24 28">
// // // //     <Path d="M12 2 C6 2 3 6 3 10 C3 14 6 15 7 19 H17 C18 15 21 14 21 10 C21 6 18 2 12 2 Z" fill="#ffd23f" stroke="#e0a81f" strokeWidth={1.5} />
// // // //     <Rect x={8} y={20} width={8} height={3} rx={1.5} fill="#8d8d8d" />
// // // //     <Rect x={9} y={24} width={6} height={3} rx={1.5} fill="#6f6f6f" />
// // // //   </Svg>
// // // // );

// // // // /* =====================  SCREEN  ===================== */
// // // // type Props = {
// // // //   playerId: number | string;
// // // //   hints: number;
// // // //   setHints?: (n: number) => void;
// // // //   onExit: () => void;
// // // //   onComplete: (r: any) => void;
// // // // };

// // // // export default function BTLevel24Screen({ playerId, hints, onExit, onComplete }: Props) {
// // // //   const [picked, setPicked] = useState<string | null>(null);
// // // //   const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle');
// // // //   const [err, setErr] = useState('');
// // // //   const sessionRef = useRef<number | null>(null);
// // // //   const busy = useRef(false);
// // // //   const shake = useRef(new Animated.Value(0)).current;
// // // //   const pop = useRef(new Animated.Value(0)).current;

// // // //   const ensureSession = async () => {
// // // //     if (sessionRef.current != null) return sessionRef.current;
// // // //     const d = await startLevel24(playerId);
// // // //     sessionRef.current = d.sessionId;
// // // //     return d.sessionId;
// // // //   };

// // // //   useEffect(() => {
// // // //     ensureSession().catch(() => {});
// // // //     Animated.spring(pop, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
// // // //   }, [playerId]);

// // // //   const doShake = () =>
// // // //     Animated.sequence([10, -10, 6, -6, 0].map((v) =>
// // // //       Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }),
// // // //     )).start();

// // // //   const flash = (m: string) => { setErr(m); setTimeout(() => setErr(''), 1500); };

// // // //   const onPick = async (id: string) => {
// // // //     if (busy.current || status === 'right') return;
// // // //     busy.current = true;
// // // //     setPicked(id);
// // // //     try {
// // // //       const sid = await ensureSession();
// // // //       const r = await answerLevel24(playerId, sid, id);
// // // //       if (r.correct) {
// // // //         setStatus('right');
// // // //         setTimeout(() => onComplete({ ...r, skipped: false }), 1000);
// // // //       } else {
// // // //         setStatus('wrong');
// // // //         doShake();
// // // //         setTimeout(() => { setStatus('idle'); setPicked(null); }, 800);
// // // //       }
// // // //     } catch {
// // // //       flash('Network error');
// // // //       setPicked(null);
// // // //     } finally {
// // // //       busy.current = false;
// // // //     }
// // // //   };

// // // //   return (
// // // //     <View style={s.root}>
// // // //       <Room />
// // // //       <View style={s.content}>
// // // //         {/* top bar */}
// // // //         <View style={s.topBar}>
// // // //           <View style={s.row}>
// // // //             <TouchableOpacity style={s.roundBtn} onPress={onExit}><HomeIcon /></TouchableOpacity>
// // // //             <TouchableOpacity style={[s.roundBtn, { marginLeft: 8 }]}><GearIcon /></TouchableOpacity>
// // // //           </View>
// // // //           <View style={s.hintPill}>
// // // //             <Bulb />
// // // //             <Text style={s.hintNum}>{hints}</Text>
// // // //           </View>
// // // //         </View>

// // // //         {/* hanging level sign */}
// // // //         <View style={s.signWrap}>
// // // //           <View style={[s.rope, { left: '30%' }]} />
// // // //           <View style={[s.rope, { right: '30%' }]} />
// // // //           <View style={s.sign}>
// // // //             <Text style={s.signTxt}>LEVEL 24</Text>
// // // //             <View style={{ position: 'absolute', left: -6, top: -14 }}><Vine /></View>
// // // //             <View style={{ position: 'absolute', right: -6, top: -14 }}><Vine flip /></View>
// // // //           </View>
// // // //         </View>

// // // //         <Animated.View style={{ flex: 1, transform: [{ translateX: shake }] }}>
// // // //           {/* question frame */}
// // // //           <Animated.View style={[s.frame, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }]}>
// // // //             <View style={s.paper}>
// // // //               <Text style={s.question}>{QUESTION}</Text>
// // // //             </View>
// // // //             <View style={{ position: 'absolute', left: -12, top: -26 }}><Vine /></View>
// // // //             <View style={{ position: 'absolute', right: -12, top: -26 }}><Vine flip /></View>
// // // //             <View style={{ position: 'absolute', left: -12, bottom: -22, transform: [{ scaleY: -1 }] }}><Vine /></View>
// // // //             <View style={{ position: 'absolute', right: -12, bottom: -22, transform: [{ scaleY: -1 }] }}><Vine flip /></View>
// // // //           </Animated.View>

// // // //           {/* options */}
// // // //           <View style={s.options}>
// // // //             {OPTIONS.map((o) => {
// // // //               const p = picked === o.id;
// // // //               const bg = p && status === 'right' ? '#c8f2c2' : p && status === 'wrong' ? '#ffc9c9' : '#fdf3df';
// // // //               return (
// // // //                 <TouchableOpacity key={o.id} activeOpacity={0.85} style={[s.option, { backgroundColor: bg }]} onPress={() => onPick(o.id)}>
// // // //                   <View style={s.dashed} pointerEvents="none" />
// // // //                   <View style={[s.badge, { backgroundColor: o.color }]}>
// // // //                     <View style={s.shine} />
// // // //                     <Text style={s.badgeTxt}>{o.id}</Text>
// // // //                   </View>
// // // //                   <Text style={s.optTxt}>{o.text}</Text>
// // // //                 </TouchableOpacity>
// // // //               );
// // // //             })}
// // // //           </View>
// // // //         </Animated.View>

// // // //         {!!err && <Text style={s.err}>{err}</Text>}
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // }

// // // // const s = StyleSheet.create({
// // // //   root: { flex: 1, backgroundColor: '#fbe7bf', overflow: 'hidden' },
// // // //   content: { flex: 1, paddingHorizontal: 16, paddingTop: 34 },
// // // //   row: { flexDirection: 'row' },
// // // //   topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 },
// // // //   roundBtn: {
// // // //     width: 46, height: 46, borderRadius: 23, backgroundColor: '#fbc45a',
// // // //     borderWidth: 3, borderColor: '#7a4a22', alignItems: 'center', justifyContent: 'center',
// // // //   },
// // // //   hintPill: {
// // // //     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
// // // //     backgroundColor: '#fff6e6', borderRadius: 24, borderWidth: 2.5, borderColor: '#e1b878',
// // // //     paddingHorizontal: 14, height: 46, minWidth: 96,
// // // //   },
// // // //   hintNum: { fontFamily: F, fontSize: 22, fontWeight: '800', color: INK, marginLeft: 10 },

// // // //   signWrap: { alignItems: 'center', marginTop: -34, zIndex: 4 },
// // // //   rope: { position: 'absolute', top: -10, width: 3, height: 36, backgroundColor: '#8a5a2b' },
// // // //   sign: {
// // // //     marginTop: 18, paddingHorizontal: 40, paddingVertical: 10, borderRadius: 12,
// // // //     backgroundColor: '#d98b3d', borderWidth: 3, borderColor: '#a8601f',
// // // //     elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
// // // //   },
// // // //   signTxt: {
// // // //     fontFamily: F, color: '#fff3d6', fontSize: 28, fontWeight: '900', letterSpacing: 1,
// // // //     textShadowColor: '#7a3f10', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 2,
// // // //   },

// // // //   frame: {
// // // //     marginTop: 38, padding: 10, borderRadius: 18,
// // // //     backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_DARK,
// // // //     elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 4 },
// // // //   },
// // // //   paper: {
// // // //     backgroundColor: '#fdf1d8', borderRadius: 12, borderWidth: 2, borderColor: '#b9763a',
// // // //     paddingVertical: 30, paddingHorizontal: 20,
// // // //   },
// // // //   question: { fontFamily: F, fontSize: 24, lineHeight: 34, textAlign: 'center', color: INK, fontWeight: '700' },

// // // //   options: { marginTop: 26 },
// // // //   option: {
// // // //     flexDirection: 'row', alignItems: 'center', borderRadius: 32, borderWidth: 3, borderColor: '#6b4423',
// // // //     paddingVertical: 10, paddingHorizontal: 12, marginBottom: 14, minHeight: 74,
// // // //     elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
// // // //   },
// // // //   dashed: {
// // // //     position: 'absolute', left: 5, right: 5, top: 5, bottom: 5, borderRadius: 26,
// // // //     borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d9bd92',
// // // //   },
// // // //   badge: {
// // // //     width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
// // // //     borderWidth: 3, borderColor: 'rgba(255,255,255,0.85)',
// // // //   },
// // // //   shine: { position: 'absolute', top: 5, left: 9, width: 14, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.45)' },
// // // //   badgeTxt: { fontFamily: F, color: '#fff', fontSize: 28, fontWeight: '900' },
// // // //   optTxt: { flex: 1, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: '800', color: INK, marginRight: 56 },
// // // //   err: { position: 'absolute', bottom: 24, alignSelf: 'center', color: '#c0392b', fontSize: 17, fontWeight: 'bold' },
// // // // });
// // // import React, { useEffect, useRef, useState } from 'react';
// // // import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
// // // import Svg, {
// // //   Defs, LinearGradient, Stop, Rect, Ellipse, Circle, Path, G,
// // // } from 'react-native-svg';
// // // import { F } from './BTShared';
// // // import { startLevel24, answerLevel24 } from './Btlevel24api';

// // // const QUESTION =
// // //   'When I was 4 years old, my younger sister was half my age. If I am now 20 years old, how old is my younger sister?';
// // // const OPTIONS = [
// // //   { id: 'A', text: '10 years', color: '#e8456b' },
// // //   { id: 'B', text: '16 years', color: '#2f8ff0' },
// // //   { id: 'C', text: '18 years', color: '#f5a30c' },
// // // ];

// // // const WOOD = '#d98b3d';
// // // const WOOD_DARK = '#8a4f1d';
// // // const INK = '#3a2412';

// // // /* ---------- small drawing pieces ---------- */
// // // const Leaf = ({ x, y, r = 0, s = 1, c = '#4caf50' }: any) => (
// // //   <G transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
// // //     <Path d="M0 0 C 14 -18, 36 -8, 32 12 C 16 18, 4 12, 0 0 Z" fill={c} />
// // //     <Path d="M2 2 C 12 -3, 22 -1, 30 9" stroke="#2e7d32" strokeWidth={1.5} fill="none" />
// // //   </G>
// // // );

// // // const Plant = ({ x, y, s = 1, pot = '#f3d9cf' }: any) => (
// // //   <G transform={`translate(${x} ${y}) scale(${s})`}>
// // //     <Leaf x={0} y={0} r={-70} />
// // //     <Leaf x={0} y={0} r={-30} s={1.2} c="#5cbb55" />
// // //     <Leaf x={0} y={0} r={10} s={1.1} />
// // //     <Leaf x={0} y={0} r={-110} s={1.1} c="#5cbb55" />
// // //     <Leaf x={0} y={0} r={-150} />
// // //     <Leaf x={0} y={0} r={-90} s={1.4} c="#3f9d4a" />
// // //     <Path d="M-26 0 L26 0 L20 46 L-20 46 Z" fill={pot} />
// // //     <Rect x={-28} y={-4} width={56} height={8} rx={4} fill="#ecc9bb" />
// // //   </G>
// // // );

// // // const Flower = ({ x, y, s = 1 }: any) => (
// // //   <G transform={`translate(${x} ${y}) scale(${s})`}>
// // //     {[0, 72, 144, 216, 288].map((a) => (
// // //       <Ellipse key={a} cx={0} cy={-6} rx={4} ry={6} fill="#fff" transform={`rotate(${a})`} />
// // //     ))}
// // //     <Circle cx={0} cy={0} r={3} fill="#f5b041" />
// // //   </G>
// // // );

// // // const Book = ({ x, y, w, h, c }: any) => <Rect x={x} y={y} width={w} height={h} rx={3} fill={c} />;

// // // /* ---------- full room background ---------- */
// // // const Room = () => (
// // //   <View style={StyleSheet.absoluteFill} pointerEvents="none">
// // //     <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
// // //       <Defs>
// // //         <LinearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
// // //           <Stop offset="0" stopColor="#fbe7bf" />
// // //           <Stop offset="1" stopColor="#f3cd8d" />
// // //         </LinearGradient>
// // //         <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
// // //           <Stop offset="0" stopColor="#7cc7f2" />
// // //           <Stop offset="1" stopColor="#cdeeff" />
// // //         </LinearGradient>
// // //         <LinearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
// // //           <Stop offset="0" stopColor="#f5c176" />
// // //           <Stop offset="1" stopColor="#e5a14d" />
// // //         </LinearGradient>
// // //       </Defs>

// // //       <Rect width={400} height={800} fill="url(#wall)" />
// // //       <Rect y={625} width={400} height={175} fill="url(#floor)" />
// // //       <Rect y={618} width={400} height={10} fill="#e9b88b" />

// // //       {/* window */}
// // //       <Rect x={-10} y={20} width={84} height={300} fill="#e2a15b" />
// // //       <Rect x={-4} y={28} width={72} height={284} fill="url(#sky)" />
// // //       <Ellipse cx={22} cy={90} rx={26} ry={13} fill="#fff" opacity={0.9} />
// // //       <Ellipse cx={46} cy={98} rx={20} ry={10} fill="#fff" opacity={0.9} />
// // //       <Circle cx={10} cy={230} r={40} fill="#6dbb4f" />
// // //       <Circle cx={48} cy={250} r={34} fill="#58a845" />
// // //       <Circle cx={20} cy={285} r={36} fill="#7ccb5a" />
// // //       <Rect x={-4} y={150} width={72} height={5} fill="#e2a15b" />
// // //       <Rect x={-10} y={312} width={96} height={10} fill="#e9b370" />

// // //       {/* left plants + table */}
// // //       <Plant x={22} y={310} s={1.15} />
// // //       <Plant x={28} y={470} s={1.6} />
// // //       <Rect x={-6} y={500} width={70} height={10} rx={3} fill="#d9894a" />
// // //       <Rect x={4} y={510} width={8} height={90} fill="#c47a3d" />
// // //       <Rect x={52} y={510} width={8} height={90} fill="#c47a3d" />

// // //       {/* right bookshelf */}
// // //       <Rect x={366} y={20} width={44} height={595} fill="#e9b672" />
// // //       <Rect x={366} y={20} width={4} height={595} fill="#cf9650" />
// // //       <Rect x={366} y={170} width={44} height={6} fill="#cf9650" />
// // //       <Rect x={366} y={300} width={44} height={6} fill="#cf9650" />
// // //       <Rect x={366} y={420} width={44} height={6} fill="#cf9650" />
// // //       <Book x={374} y={100} w={11} h={68} c="#a97fd6" />
// // //       <Book x={386} y={106} w={11} h={62} c="#69b57b" />
// // //       <Book x={374} y={240} w={11} h={58} c="#ec6f9a" />
// // //       <Book x={386} y={246} w={11} h={52} c="#4a8ae0" />
// // //       <Book x={374} y={350} w={12} h={68} c="#4a8ae0" />
// // //       <Book x={387} y={356} w={11} h={62} c="#58b27a" />
// // //       {/* cat pot */}
// // //       <Rect x={370} y={190} width={34} height={28} rx={9} fill="#fbeee6" />
// // //       <Circle cx={380} cy={203} r={1.8} fill="#6b4a3a" />
// // //       <Circle cx={394} cy={203} r={1.8} fill="#6b4a3a" />
// // //       <Plant x={388} y={560} s={0.8} pot="#e8a56a" />

// // //       {/* bottom decor */}
// // //       <Ellipse cx={215} cy={742} rx={200} ry={52} fill="#f4a3b4" />
// // //       <Ellipse cx={215} cy={742} rx={168} ry={40} fill="#f8bccb" />
// // //       <Flower x={170} y={742} />
// // //       <Flower x={260} y={730} />
// // //       <Flower x={215} y={758} s={0.8} />
// // //       <Rect x={290} y={740} width={120} height={14} rx={4} fill="#c47a3d" />
// // //       <Rect x={-6} y={650} width={72} height={26} rx={4} fill="#3fb07e" />
// // //       <Rect x={-10} y={676} width={80} height={26} rx={4} fill="#ec6f9a" />
// // //       <Rect x={-4} y={702} width={70} height={26} rx={4} fill="#3f7fd6" />
// // //       <Plant x={22} y={800} s={1.5} />
// // //       <Plant x={382} y={768} s={1.1} />
// // //       <Flower x={380} y={744} s={1.4} />
// // //     </Svg>
// // //   </View>
// // // );

// // // /* ---------- corner vine for the frame and sign ---------- */
// // // const Vine = ({ flip = false, w = 90 }: { flip?: boolean; w?: number }) => (
// // //   <Svg width={w} height={(w * 60) / 90} viewBox="0 0 90 60" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
// // //     <Path d="M2 52 C 22 40, 44 40, 84 8" stroke="#3f8f3f" strokeWidth={3} fill="none" />
// // //     <Leaf x={20} y={44} r={-35} s={0.9} />
// // //     <Leaf x={34} y={38} r={-120} s={0.8} c="#5cbb55" />
// // //     <Leaf x={50} y={30} r={-30} s={0.9} />
// // //     <Leaf x={62} y={22} r={-110} s={0.8} c="#5cbb55" />
// // //     <Leaf x={76} y={12} r={-40} s={0.9} />
// // //     <Flower x={36} y={36} s={1.1} />
// // //   </Svg>
// // // );

// // // /* ---------- little icons ---------- */
// // // const HomeIcon = () => (
// // //   <Svg width={24} height={24} viewBox="0 0 24 24">
// // //     <Path d="M12 3 L2 12 H5 V21 H10 V15 H14 V21 H19 V12 H22 Z" fill={INK} />
// // //   </Svg>
// // // );
// // // const GearIcon = () => (
// // //   <Svg width={26} height={26} viewBox="0 0 24 24">
// // //     <Circle cx={12} cy={12} r={8} stroke={INK} strokeWidth={4} strokeDasharray="3.1 3.1" fill="none" />
// // //     <Circle cx={12} cy={12} r={6.5} fill={INK} />
// // //     <Circle cx={12} cy={12} r={2.8} fill="#fbc45a" />
// // //   </Svg>
// // // );
// // // const Bulb = () => (
// // //   <Svg width={26} height={30} viewBox="0 0 24 28">
// // //     <Path d="M12 2 C6 2 3 6 3 10 C3 14 6 15 7 19 H17 C18 15 21 14 21 10 C21 6 18 2 12 2 Z" fill="#ffd23f" stroke="#e0a81f" strokeWidth={1.5} />
// // //     <Rect x={8} y={20} width={8} height={3} rx={1.5} fill="#8d8d8d" />
// // //     <Rect x={9} y={24} width={6} height={3} rx={1.5} fill="#6f6f6f" />
// // //   </Svg>
// // // );

// // // /* =====================  SCREEN  ===================== */
// // // type Props = {
// // //   playerId: number | string;
// // //   hints: number;
// // //   setHints?: (n: number) => void;
// // //   onExit: () => void;
// // //   onComplete: (r: any) => void;
// // // };

// // // export default function BTLevel24Screen({ playerId, hints, onExit, onComplete }: Props) {
// // //   const [picked, setPicked] = useState<string | null>(null);
// // //   const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle');
// // //   const [err, setErr] = useState('');
// // //   const sessionRef = useRef<number | null>(null);
// // //   const busy = useRef(false);
// // //   const shake = useRef(new Animated.Value(0)).current;
// // //   const pop = useRef(new Animated.Value(0)).current;

// // //   const ensureSession = async () => {
// // //     if (sessionRef.current != null) return sessionRef.current;
// // //     const d = await startLevel24(playerId);
// // //     sessionRef.current = d.sessionId;
// // //     return d.sessionId;
// // //   };

// // //   useEffect(() => {
// // //     ensureSession().catch(() => {});
// // //     Animated.spring(pop, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
// // //   }, [playerId]);

// // //   const doShake = () =>
// // //     Animated.sequence([10, -10, 6, -6, 0].map((v) =>
// // //       Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }),
// // //     )).start();

// // //   const flash = (m: string) => { setErr(m); setTimeout(() => setErr(''), 1500); };

// // //   const onPick = async (id: string) => {
// // //     if (busy.current || status === 'right') return;
// // //     busy.current = true;
// // //     setPicked(id);
// // //     try {
// // //       const sid = await ensureSession();
// // //       const r = await answerLevel24(playerId, sid, id);
// // //       if (r.correct) {
// // //         setStatus('right');
// // //         setTimeout(() => onComplete({ ...r, skipped: false }), 1000);
// // //       } else {
// // //         setStatus('wrong');
// // //         doShake();
// // //         setTimeout(() => { setStatus('idle'); setPicked(null); }, 800);
// // //       }
// // //     } catch {
// // //       flash('Network error');
// // //       setPicked(null);
// // //     } finally {
// // //       busy.current = false;
// // //     }
// // //   };

// // //   return (
// // //     <View style={s.root}>
// // //       <Room />
// // //       <View style={s.content}>
// // //         {/* top bar */}
// // //         <View style={s.topBar}>
// // //           <View style={s.row}>
// // //             <TouchableOpacity style={s.roundBtn} onPress={onExit}><HomeIcon /></TouchableOpacity>
// // //             <TouchableOpacity style={[s.roundBtn, { marginLeft: 8 }]}><GearIcon /></TouchableOpacity>
// // //           </View>
// // //           <View style={s.hintPill}>
// // //             <Bulb />
// // //             <Text style={s.hintNum}>{hints}</Text>
// // //           </View>
// // //         </View>

// // //         {/* hanging level sign */}
// // //         <View style={s.signWrap}>
// // //           <View style={[s.rope, { left: '30%' }]} />
// // //           <View style={[s.rope, { right: '30%' }]} />
// // //           <View style={s.sign}>
// // //             <Text style={s.signTxt}>LEVEL 24</Text>
// // //             <View style={{ position: 'absolute', left: -22, top: -16 }}><Vine w={48} /></View>
// // //             <View style={{ position: 'absolute', right: -22, top: -16 }}><Vine w={48} flip /></View>
// // //           </View>
// // //         </View>

// // //         <Animated.View style={{ flex: 1, transform: [{ translateX: shake }] }}>
// // //           {/* question frame */}
// // //           <Animated.View style={[s.frame, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }]}>
// // //             <View style={s.paper}>
// // //               <Text style={s.question}>{QUESTION}</Text>
// // //             </View>
// // //             <View style={{ position: 'absolute', left: -12, top: -26 }}><Vine /></View>
// // //             <View style={{ position: 'absolute', right: -12, top: -26 }}><Vine flip /></View>
// // //             <View style={{ position: 'absolute', left: -12, bottom: -22, transform: [{ scaleY: -1 }] }}><Vine /></View>
// // //             <View style={{ position: 'absolute', right: -12, bottom: -22, transform: [{ scaleY: -1 }] }}><Vine flip /></View>
// // //           </Animated.View>

// // //           {/* options */}
// // //           <View style={s.options}>
// // //             {OPTIONS.map((o) => {
// // //               const p = picked === o.id;
// // //               const bg = p && status === 'right' ? '#c8f2c2' : p && status === 'wrong' ? '#ffc9c9' : '#fdf3df';
// // //               return (
// // //                 <TouchableOpacity key={o.id} activeOpacity={0.85} style={[s.option, { backgroundColor: bg }]} onPress={() => onPick(o.id)}>
// // //                   <View style={s.dashed} pointerEvents="none" />
// // //                   <View style={[s.badge, { backgroundColor: o.color }]}>
// // //                     <View style={s.shine} />
// // //                     <Text style={s.badgeTxt}>{o.id}</Text>
// // //                   </View>
// // //                   <Text style={s.optTxt}>{o.text}</Text>
// // //                 </TouchableOpacity>
// // //               );
// // //             })}
// // //           </View>
// // //         </Animated.View>

// // //         {!!err && <Text style={s.err}>{err}</Text>}
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // const s = StyleSheet.create({
// // //   root: { flex: 1, backgroundColor: '#fbe7bf', overflow: 'hidden' },
// // //   content: { flex: 1, paddingHorizontal: 16, paddingTop: 30, paddingBottom: 14 },
// // //   row: { flexDirection: 'row' },
// // //   topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 },
// // //   roundBtn: {
// // //     width: 46, height: 46, borderRadius: 23, backgroundColor: '#fbc45a',
// // //     borderWidth: 3, borderColor: '#7a4a22', alignItems: 'center', justifyContent: 'center',
// // //   },
// // //   hintPill: {
// // //     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
// // //     backgroundColor: '#fff6e6', borderRadius: 24, borderWidth: 2.5, borderColor: '#e1b878',
// // //     paddingHorizontal: 14, height: 46, minWidth: 96,
// // //   },
// // //   hintNum: { fontFamily: F, fontSize: 22, fontWeight: '800', color: INK, marginLeft: 10 },

// // //   signWrap: { alignItems: 'center', marginTop: -34, zIndex: 4 },
// // //   rope: { position: 'absolute', top: -10, width: 3, height: 36, backgroundColor: '#8a5a2b' },
// // //   sign: {
// // //     marginTop: 18, paddingHorizontal: 40, paddingVertical: 6, borderRadius: 12,
// // //     backgroundColor: '#d98b3d', borderWidth: 3, borderColor: '#a8601f',
// // //     elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
// // //   },
// // //   signTxt: {
// // //     fontFamily: F, color: '#fff3d6', fontSize: 28, fontWeight: '900', letterSpacing: 1,
// // //     textShadowColor: '#7a3f10', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 2,
// // //   },

// // //   frame: {
// // //     flex: 1, marginTop: 30, padding: 8, borderRadius: 18,
// // //     backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_DARK,
// // //     elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 4 },
// // //   },
// // //   paper: {
// // //     backgroundColor: '#fdf1d8', borderRadius: 12, borderWidth: 2, borderColor: '#b9763a',
// // //     flex: 1, justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 18,
// // //   },
// // //   question: { fontFamily: F, fontSize: 22, lineHeight: 30, textAlign: 'center', color: INK, fontWeight: '700' },

// // //   options: { flex: 1.5, marginTop: 24, justifyContent: 'space-between' },
// // //   option: {
// // //     flexDirection: 'row', alignItems: 'center', borderRadius: 32, borderWidth: 3, borderColor: '#6b4423',
// // //     paddingVertical: 4, paddingHorizontal: 12, flex: 1, maxHeight: 84, marginBottom: 10,
// // //     elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
// // //   },
// // //   dashed: {
// // //     position: 'absolute', left: 5, right: 5, top: 5, bottom: 5, borderRadius: 26,
// // //     borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d9bd92',
// // //   },
// // //   badge: {
// // //     width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
// // //     borderWidth: 3, borderColor: 'rgba(255,255,255,0.85)',
// // //   },
// // //   shine: { position: 'absolute', top: 5, left: 9, width: 14, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.45)' },
// // //   badgeTxt: { fontFamily: F, color: '#fff', fontSize: 28, fontWeight: '900' },
// // //   optTxt: { flex: 1, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: '800', color: INK, marginRight: 52 },
// // //   err: { position: 'absolute', bottom: 24, alignSelf: 'center', color: '#c0392b', fontSize: 17, fontWeight: 'bold' },
// // // });
// // import React, { useEffect, useRef, useState } from 'react';
// // import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
// // import Svg, {
// //   Defs, LinearGradient, Stop, Rect, Ellipse, Circle, Path, G,
// // } from 'react-native-svg';
// // import { F } from './BTShared';
// // import * as api from './api';
// // import { startLevel24, answerLevel24 } from './Btlevel24api';

// // const QUESTION =
// //   'When I was 4 years old, my younger sister was half my age. If I am now 20 years old, how old is my younger sister?';
// // const OPTIONS = [
// //   { id: 'A', text: '10 years', color: '#e8456b' },
// //   { id: 'B', text: '16 years', color: '#2f8ff0' },
// //   { id: 'C', text: '18 years', color: '#f5a30c' },
// // ];

// // const WOOD = '#d98b3d';
// // const WOOD_DARK = '#8a4f1d';
// // const INK = '#3a2412';
// // const HINT_COST = 25;
// // const SKIP_COST = 50;

// // /* ---------- small drawing pieces ---------- */
// // const Leaf = ({ x, y, r = 0, s = 1, c = '#4caf50' }: any) => (
// //   <G transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
// //     <Path d="M0 0 C 14 -18, 36 -8, 32 12 C 16 18, 4 12, 0 0 Z" fill={c} />
// //     <Path d="M2 2 C 12 -3, 22 -1, 30 9" stroke="#2e7d32" strokeWidth={1.5} fill="none" />
// //   </G>
// // );

// // const Plant = ({ x, y, s = 1, pot = '#f3d9cf' }: any) => (
// //   <G transform={`translate(${x} ${y}) scale(${s})`}>
// //     <Leaf x={0} y={0} r={-70} />
// //     <Leaf x={0} y={0} r={-30} s={1.2} c="#5cbb55" />
// //     <Leaf x={0} y={0} r={10} s={1.1} />
// //     <Leaf x={0} y={0} r={-110} s={1.1} c="#5cbb55" />
// //     <Leaf x={0} y={0} r={-150} />
// //     <Leaf x={0} y={0} r={-90} s={1.4} c="#3f9d4a" />
// //     <Path d="M-26 0 L26 0 L20 46 L-20 46 Z" fill={pot} />
// //     <Rect x={-28} y={-4} width={56} height={8} rx={4} fill="#ecc9bb" />
// //   </G>
// // );

// // const Flower = ({ x, y, s = 1 }: any) => (
// //   <G transform={`translate(${x} ${y}) scale(${s})`}>
// //     {[0, 72, 144, 216, 288].map((a) => (
// //       <Ellipse key={a} cx={0} cy={-6} rx={4} ry={6} fill="#fff" transform={`rotate(${a})`} />
// //     ))}
// //     <Circle cx={0} cy={0} r={3} fill="#f5b041" />
// //   </G>
// // );

// // const Book = ({ x, y, w, h, c }: any) => <Rect x={x} y={y} width={w} height={h} rx={3} fill={c} />;

// // /* ---------- full room background ---------- */
// // const Room = () => (
// //   <View style={StyleSheet.absoluteFill} pointerEvents="none">
// //     <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
// //       <Defs>
// //         <LinearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
// //           <Stop offset="0" stopColor="#fbe7bf" />
// //           <Stop offset="1" stopColor="#f3cd8d" />
// //         </LinearGradient>
// //         <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
// //           <Stop offset="0" stopColor="#7cc7f2" />
// //           <Stop offset="1" stopColor="#cdeeff" />
// //         </LinearGradient>
// //         <LinearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
// //           <Stop offset="0" stopColor="#f5c176" />
// //           <Stop offset="1" stopColor="#e5a14d" />
// //         </LinearGradient>
// //       </Defs>

// //       <Rect width={400} height={800} fill="url(#wall)" />
// //       <Rect y={625} width={400} height={175} fill="url(#floor)" />
// //       <Rect y={618} width={400} height={10} fill="#e9b88b" />

// //       {/* window */}
// //       <Rect x={-10} y={20} width={84} height={300} fill="#e2a15b" />
// //       <Rect x={-4} y={28} width={72} height={284} fill="url(#sky)" />
// //       <Ellipse cx={22} cy={90} rx={26} ry={13} fill="#fff" opacity={0.9} />
// //       <Ellipse cx={46} cy={98} rx={20} ry={10} fill="#fff" opacity={0.9} />
// //       <Circle cx={10} cy={230} r={40} fill="#6dbb4f" />
// //       <Circle cx={48} cy={250} r={34} fill="#58a845" />
// //       <Circle cx={20} cy={285} r={36} fill="#7ccb5a" />
// //       <Rect x={-4} y={150} width={72} height={5} fill="#e2a15b" />
// //       <Rect x={-10} y={312} width={96} height={10} fill="#e9b370" />

// //       {/* left plants + table */}
// //       <Plant x={22} y={310} s={1.15} />
// //       <Plant x={28} y={470} s={1.6} />
// //       <Rect x={-6} y={500} width={70} height={10} rx={3} fill="#d9894a" />
// //       <Rect x={4} y={510} width={8} height={90} fill="#c47a3d" />
// //       <Rect x={52} y={510} width={8} height={90} fill="#c47a3d" />

// //       {/* right bookshelf */}
// //       <Rect x={366} y={20} width={44} height={595} fill="#e9b672" />
// //       <Rect x={366} y={20} width={4} height={595} fill="#cf9650" />
// //       <Rect x={366} y={170} width={44} height={6} fill="#cf9650" />
// //       <Rect x={366} y={300} width={44} height={6} fill="#cf9650" />
// //       <Rect x={366} y={420} width={44} height={6} fill="#cf9650" />
// //       <Book x={374} y={100} w={11} h={68} c="#a97fd6" />
// //       <Book x={386} y={106} w={11} h={62} c="#69b57b" />
// //       <Book x={374} y={240} w={11} h={58} c="#ec6f9a" />
// //       <Book x={386} y={246} w={11} h={52} c="#4a8ae0" />
// //       <Book x={374} y={350} w={12} h={68} c="#4a8ae0" />
// //       <Book x={387} y={356} w={11} h={62} c="#58b27a" />
// //       {/* cat pot */}
// //       <Rect x={370} y={190} width={34} height={28} rx={9} fill="#fbeee6" />
// //       <Circle cx={380} cy={203} r={1.8} fill="#6b4a3a" />
// //       <Circle cx={394} cy={203} r={1.8} fill="#6b4a3a" />
// //       <Plant x={388} y={560} s={0.8} pot="#e8a56a" />

// //       {/* bottom decor */}
// //       <Ellipse cx={215} cy={742} rx={200} ry={52} fill="#f4a3b4" />
// //       <Ellipse cx={215} cy={742} rx={168} ry={40} fill="#f8bccb" />
// //       <Flower x={170} y={742} />
// //       <Flower x={260} y={730} />
// //       <Flower x={215} y={758} s={0.8} />
// //       <Rect x={290} y={740} width={120} height={14} rx={4} fill="#c47a3d" />
// //       <Rect x={-6} y={650} width={72} height={26} rx={4} fill="#3fb07e" />
// //       <Rect x={-10} y={676} width={80} height={26} rx={4} fill="#ec6f9a" />
// //       <Rect x={-4} y={702} width={70} height={26} rx={4} fill="#3f7fd6" />
// //       <Plant x={22} y={800} s={1.5} />
// //       <Plant x={382} y={768} s={1.1} />
// //       <Flower x={380} y={744} s={1.4} />
// //     </Svg>
// //   </View>
// // );

// // /* ---------- corner vine for the frame and sign ---------- */
// // const Vine = ({ flip = false, w = 90 }: { flip?: boolean; w?: number }) => (
// //   <Svg width={w} height={(w * 60) / 90} viewBox="0 0 90 60" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
// //     <Path d="M2 52 C 22 40, 44 40, 84 8" stroke="#3f8f3f" strokeWidth={3} fill="none" />
// //     <Leaf x={20} y={44} r={-35} s={0.9} />
// //     <Leaf x={34} y={38} r={-120} s={0.8} c="#5cbb55" />
// //     <Leaf x={50} y={30} r={-30} s={0.9} />
// //     <Leaf x={62} y={22} r={-110} s={0.8} c="#5cbb55" />
// //     <Leaf x={76} y={12} r={-40} s={0.9} />
// //     <Flower x={36} y={36} s={1.1} />
// //   </Svg>
// // );

// // /* ---------- little icons ---------- */
// // const HomeIcon = () => (
// //   <Svg width={24} height={24} viewBox="0 0 24 24">
// //     <Path d="M12 3 L2 12 H5 V21 H10 V15 H14 V21 H19 V12 H22 Z" fill={INK} />
// //   </Svg>
// // );
// // const GearIcon = () => (
// //   <Svg width={26} height={26} viewBox="0 0 24 24">
// //     <Circle cx={12} cy={12} r={8} stroke={INK} strokeWidth={4} strokeDasharray="3.1 3.1" fill="none" />
// //     <Circle cx={12} cy={12} r={6.5} fill={INK} />
// //     <Circle cx={12} cy={12} r={2.8} fill="#fbc45a" />
// //   </Svg>
// // );
// // const Bulb = ({ k = 1 }: { k?: number }) => (
// //   <Svg width={26 * k} height={30 * k} viewBox="0 0 24 28">
// //     <Path d="M12 2 C6 2 3 6 3 10 C3 14 6 15 7 19 H17 C18 15 21 14 21 10 C21 6 18 2 12 2 Z" fill="#ffd23f" stroke="#e0a81f" strokeWidth={1.5} />
// //     <Rect x={8} y={20} width={8} height={3} rx={1.5} fill="#8d8d8d" />
// //     <Rect x={9} y={24} width={6} height={3} rx={1.5} fill="#6f6f6f" />
// //   </Svg>
// // );

// // const SearchIcon = () => (
// //   <Svg width={38} height={38} viewBox="0 0 24 24">
// //     <Circle cx={10} cy={10} r={6.5} stroke="#1d2b2b" strokeWidth={2.8} fill="rgba(255,255,255,0.15)" />
// //     <Path d="M15 15 L21 21" stroke="#1d2b2b" strokeWidth={3.4} strokeLinecap="round" />
// //   </Svg>
// // );
// // const FilmIcon = () => (
// //   <Svg width={40} height={40} viewBox="0 0 24 24">
// //     <Rect x={2} y={4} width={20} height={16} rx={2} fill="#3a3350" />
// //     <Rect x={4} y={6} width={16} height={12} rx={1} fill="#9b6be0" />
// //     <Path d="M10 9 L15 12 L10 15 Z" fill="#1f1830" />
// //   </Svg>
// // );
// // const PlayIcon = () => (
// //   <Svg width={36} height={36} viewBox="0 0 24 24">
// //     <Path d="M7 4 L20 12 L7 20 Z" fill="#222" />
// //   </Svg>
// // );
// // const CoinIcon = () => (
// //   <Svg width={18} height={18} viewBox="0 0 24 24">
// //     <Circle cx={12} cy={12} r={10} fill="#ffc300" stroke="#e09b00" strokeWidth={2} />
// //     <Circle cx={12} cy={12} r={5} fill="#ffdf5a" />
// //   </Svg>
// // );

// // /* =====================  SCREEN  ===================== */
// // type Props = {
// //   playerId: number | string;
// //   hints: number;
// //   setHints?: (n: number) => void;
// //   onExit: () => void;
// //   onComplete: (r: any) => void;
// // };

// // export default function BTLevel24Screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
// //   const [picked, setPicked] = useState<string | null>(null);
// //   const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle');
// //   const [err, setErr] = useState('');
// //   const [hidden, setHidden] = useState<string[]>([]);
// //   const actBusy = useRef(false);
// //   const sessionRef = useRef<number | null>(null);
// //   const busy = useRef(false);
// //   const shake = useRef(new Animated.Value(0)).current;
// //   const pop = useRef(new Animated.Value(0)).current;

// //   const ensureSession = async () => {
// //     if (sessionRef.current != null) return sessionRef.current;
// //     const d = await startLevel24(playerId);
// //     sessionRef.current = d.sessionId;
// //     return d.sessionId;
// //   };

// //   useEffect(() => {
// //     ensureSession().catch(() => {});
// //     Animated.spring(pop, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
// //   }, [playerId]);

// //   const doShake = () =>
// //     Animated.sequence([10, -10, 6, -6, 0].map((v) =>
// //       Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }),
// //     )).start();

// //   const flash = (m: string) => { setErr(m); setTimeout(() => setErr(''), 1500); };

// //   // ---- hint: hides one wrong option (costs HINT_COST) ----
// //   const useHint = async () => {
// //     if (actBusy.current || status === 'right') return;
// //     if (hints < HINT_COST) { flash('Need ' + HINT_COST + ' hints. You have ' + hints + '.'); return; }
// //     const wrong = OPTIONS.filter((o) => o.id !== 'C' && !hidden.includes(o.id));
// //     if (!wrong.length) { flash('Only one answer left!'); return; }
// //     actBusy.current = true;
// //     try {
// //       const r = await (api as any).hint(24, playerId, []);
// //       if (typeof r?.hints === 'number') setHints?.(r.hints);
// //       setHidden((h) => [...h, wrong[0].id]);
// //     } catch (e: any) {
// //       flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
// //     } finally { actBusy.current = false; }
// //   };

// //   // ---- video reward: +75 coins ----
// //   const watchVideo = async () => {
// //     if (actBusy.current) return;
// //     actBusy.current = true;
// //     try {
// //       const r = await (api as any).reward(playerId, 'video');
// //       if (typeof r?.hints === 'number') setHints?.(r.hints);
// //     } catch {} finally { actBusy.current = false; }
// //   };

// //   // ---- skip level (costs SKIP_COST) ----
// //   const skipLevel = async () => {
// //     if (actBusy.current || status === 'right') return;
// //     if (hints < SKIP_COST) { flash('Need ' + SKIP_COST + ' hints. You have ' + hints + '.'); return; }
// //     actBusy.current = true;
// //     try {
// //       const r = await (api as any).skip(24, playerId);
// //       setHints?.(typeof r?.hints === 'number' ? r.hints : hints - SKIP_COST);
// //       setStatus('right');
// //       setTimeout(() => onComplete({ ...r, skipped: true }), 600);
// //     } catch (e: any) {
// //       flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
// //     } finally { actBusy.current = false; }
// //   };

// //   const onPick = async (id: string) => {
// //     if (busy.current || status === 'right') return;
// //     busy.current = true;
// //     setPicked(id);
// //     try {
// //       const sid = await ensureSession();
// //       const r = await answerLevel24(playerId, sid, id);
// //       if (r.correct) {
// //         setStatus('right');
// //         setTimeout(() => onComplete({ ...r, skipped: false }), 1000);
// //       } else {
// //         setStatus('wrong');
// //         doShake();
// //         setTimeout(() => { setStatus('idle'); setPicked(null); }, 800);
// //       }
// //     } catch {
// //       flash('Network error');
// //       setPicked(null);
// //     } finally {
// //       busy.current = false;
// //     }
// //   };

// //   return (
// //     <View style={s.root}>
// //       <Room />
// //       <View style={s.content}>
// //         {/* top bar */}
// //         <View style={s.topBar}>
// //           <View style={s.row}>
// //             <TouchableOpacity style={s.roundBtn} onPress={onExit}><HomeIcon /></TouchableOpacity>
// //             <TouchableOpacity style={[s.roundBtn, { marginLeft: 8 }]}><GearIcon /></TouchableOpacity>
// //           </View>
// //           <View style={s.hintPill}>
// //             <Bulb />
// //             <Text style={s.hintNum}>{hints}</Text>
// //           </View>
// //         </View>

// //         {/* hanging level sign */}
// //         <View style={s.signWrap}>
// //           <View style={[s.rope, { left: '30%' }]} />
// //           <View style={[s.rope, { right: '30%' }]} />
// //           <View style={s.sign}>
// //             <Text style={s.signTxt}>LEVEL 24</Text>
// //             <View style={{ position: 'absolute', left: -22, top: -16 }}><Vine w={48} /></View>
// //             <View style={{ position: 'absolute', right: -22, top: -16 }}><Vine w={48} flip /></View>
// //           </View>
// //         </View>

// //         <Animated.View style={{ flex: 1, transform: [{ translateX: shake }] }}>
// //           {/* question frame */}
// //           <Animated.View style={[s.frame, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }]}>
// //             <View style={s.paper}>
// //               <Text style={s.question}>{QUESTION}</Text>
// //             </View>
// //             <View style={{ position: 'absolute', left: -12, top: -26 }}><Vine /></View>
// //             <View style={{ position: 'absolute', right: -12, top: -26 }}><Vine flip /></View>
// //             <View style={{ position: 'absolute', left: -12, bottom: -22, transform: [{ scaleY: -1 }] }}><Vine /></View>
// //             <View style={{ position: 'absolute', right: -12, bottom: -22, transform: [{ scaleY: -1 }] }}><Vine flip /></View>
// //           </Animated.View>

// //           {/* options */}
// //           <View style={s.options}>
// //             {OPTIONS.map((o) => {
// //               const p = picked === o.id;
// //               const bg = p && status === 'right' ? '#c8f2c2' : p && status === 'wrong' ? '#ffc9c9' : '#fdf3df';
// //               return (
// //                 <TouchableOpacity key={o.id} activeOpacity={0.85} disabled={hidden.includes(o.id)} style={[s.option, { backgroundColor: bg, opacity: hidden.includes(o.id) ? 0.2 : 1 }]} onPress={() => onPick(o.id)}>
// //                   <View style={s.dashed} pointerEvents="none" />
// //                   <View style={[s.badge, { backgroundColor: o.color }]}>
// //                     <View style={s.shine} />
// //                     <Text style={s.badgeTxt}>{o.id}</Text>
// //                   </View>
// //                   <Text style={s.optTxt}>{o.text}</Text>
// //                 </TouchableOpacity>
// //               );
// //             })}
// //           </View>
// //         </Animated.View>

// //         {/* hint / video / skip bar */}
// //         <View style={s.bar}>
// //           <View style={s.acol}>
// //             <TouchableOpacity activeOpacity={0.8} style={[s.btn, s.hintBtn]} onPress={useHint}><SearchIcon /></TouchableOpacity>
// //             <View style={s.lblRow}><Bulb k={0.5} /><Text style={s.lbl}>{HINT_COST}</Text></View>
// //           </View>
// //           <View style={s.acol}>
// //             <TouchableOpacity activeOpacity={0.8} style={[s.btn, s.videoBtn]} onPress={watchVideo}><FilmIcon /></TouchableOpacity>
// //             <View style={s.lblRow}><CoinIcon /><Text style={s.lbl}>+75</Text></View>
// //           </View>
// //           <View style={s.acol}>
// //             <TouchableOpacity activeOpacity={0.8} style={[s.btn, s.skipBtn]} onPress={skipLevel}><PlayIcon /></TouchableOpacity>
// //             <View style={s.lblRow}><Bulb k={0.5} /><Text style={s.lbl}>{SKIP_COST}</Text></View>
// //           </View>
// //         </View>

// //         {!!err && <Text style={s.err}>{err}</Text>}
// //       </View>
// //     </View>
// //   );
// // }

// // const s = StyleSheet.create({
// //   root: { flex: 1, backgroundColor: '#fbe7bf', overflow: 'hidden' },
// //   content: { flex: 1, paddingHorizontal: 16, paddingTop: 30, paddingBottom: 14 },
// //   row: { flexDirection: 'row' },
// //   topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 },
// //   roundBtn: {
// //     width: 46, height: 46, borderRadius: 23, backgroundColor: '#fbc45a',
// //     borderWidth: 3, borderColor: '#7a4a22', alignItems: 'center', justifyContent: 'center',
// //   },
// //   hintPill: {
// //     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
// //     backgroundColor: '#fff6e6', borderRadius: 24, borderWidth: 2.5, borderColor: '#e1b878',
// //     paddingHorizontal: 14, height: 46, minWidth: 96,
// //   },
// //   hintNum: { fontFamily: F, fontSize: 22, fontWeight: '800', color: INK, marginLeft: 10 },

// //   signWrap: { alignItems: 'center', marginTop: -34, zIndex: 4 },
// //   rope: { position: 'absolute', top: -10, width: 3, height: 36, backgroundColor: '#8a5a2b' },
// //   sign: {
// //     marginTop: 18, paddingHorizontal: 40, paddingVertical: 6, borderRadius: 12,
// //     backgroundColor: '#d98b3d', borderWidth: 3, borderColor: '#a8601f',
// //     elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
// //   },
// //   signTxt: {
// //     fontFamily: F, color: '#fff3d6', fontSize: 28, fontWeight: '900', letterSpacing: 1,
// //     textShadowColor: '#7a3f10', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 2,
// //   },

// //   frame: {
// //     flex: 1, marginTop: 30, padding: 8, borderRadius: 18,
// //     backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_DARK,
// //     elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 4 },
// //   },
// //   paper: {
// //     backgroundColor: '#fdf1d8', borderRadius: 12, borderWidth: 2, borderColor: '#b9763a',
// //     flex: 1, justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 18,
// //   },
// //   question: { fontFamily: F, fontSize: 22, lineHeight: 30, textAlign: 'center', color: INK, fontWeight: '700' },

// //   options: { flex: 1.5, marginTop: 22, justifyContent: 'space-between' },
// //   option: {
// //     flexDirection: 'row', alignItems: 'center', borderRadius: 32, borderWidth: 3, borderColor: '#6b4423',
// //     paddingVertical: 4, paddingHorizontal: 12, flex: 1, maxHeight: 70, marginBottom: 8,
// //     elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
// //   },
// //   dashed: {
// //     position: 'absolute', left: 5, right: 5, top: 5, bottom: 5, borderRadius: 26,
// //     borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d9bd92',
// //   },
// //   badge: {
// //     width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
// //     borderWidth: 3, borderColor: 'rgba(255,255,255,0.85)',
// //   },
// //   shine: { position: 'absolute', top: 5, left: 9, width: 14, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.45)' },
// //   badgeTxt: { fontFamily: F, color: '#fff', fontSize: 28, fontWeight: '900' },
// //   optTxt: { flex: 1, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: '800', color: INK, marginRight: 52 },
// //   bar: {
// //     flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
// //     backgroundColor: '#fdf5e6', borderRadius: 38, borderWidth: 6, borderColor: '#b9d6ee',
// //     paddingVertical: 8, paddingHorizontal: 10, marginTop: 4,
// //   },
// //   acol: { alignItems: 'center' },
// //   btn: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', borderWidth: 4, elevation: 4 },
// //   hintBtn: { backgroundColor: '#a8e22a', borderColor: '#d6f58a' },
// //   videoBtn: { backgroundColor: '#f3efe2', borderColor: '#fff' },
// //   skipBtn: { backgroundColor: '#f0484f', borderColor: '#fff' },
// //   lblRow: {
// //     flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 26, minWidth: 66, marginTop: 5,
// //     paddingHorizontal: 10, borderRadius: 13, backgroundColor: '#6b4423',
// //   },
// //   lbl: { fontFamily: F, fontSize: 15, fontWeight: 'bold', color: '#fff', marginLeft: 4 },
// //   err: { position: 'absolute', bottom: 150, alignSelf: 'center', color: '#c0392b', fontSize: 17, fontWeight: 'bold' },
// // });
// import React, { useRef, useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
// import Svg, {
//   Defs, LinearGradient, Stop, Rect, Ellipse, Circle, Path, G,
// } from 'react-native-svg';
// import { F } from './BTShared';
// import * as api from './api';
// import { answerLevel24 } from './Btlevel24api';

// const QUESTION =
//   'When I was 4 years old, my younger sister was half my age. If I am now 20 years old, how old is my younger sister?';

// // one unique colour theme per option (pink / blue / gold)
// const OPTIONS = [
//   { id: 'A', text: '10 years', main: '#e8456b', light: '#f58aa6', bg: '#fdeaec', border: '#f06b8a', dash: '#f4a0b4' },
//   { id: 'B', text: '16 years', main: '#2f8ff0', light: '#79bdf8', bg: '#eaf4fb', border: '#3b8fe8', dash: '#9cc8f0' },
//   { id: 'C', text: '18 years', main: '#f5a30c', light: '#fbc94f', bg: '#fdf1d3', border: '#f5b92e', dash: '#f0cf80' },
// ];

// const WOOD = '#d98b3d';
// const WOOD_DARK = '#8a4f1d';
// const INK = '#3a2412';
// const HINT_COST = 25;
// const SKIP_COST = 50;

// /* ---------- drawing pieces ---------- */
// const Leaf = ({ x, y, r = 0, s = 1, c = '#4caf50' }: any) => (
//   <G transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
//     <Path d="M0 0 C 14 -18, 36 -8, 32 12 C 16 18, 4 12, 0 0 Z" fill={c} />
//     <Path d="M2 2 C 12 -3, 22 -1, 30 9" stroke="#2e7d32" strokeWidth={1.5} fill="none" />
//   </G>
// );

// const Plant = ({ x, y, s = 1, pot = '#f3d9cf' }: any) => (
//   <G transform={`translate(${x} ${y}) scale(${s})`}>
//     <Leaf x={0} y={0} r={-70} />
//     <Leaf x={0} y={0} r={-30} s={1.2} c="#5cbb55" />
//     <Leaf x={0} y={0} r={10} s={1.1} />
//     <Leaf x={0} y={0} r={-110} s={1.1} c="#5cbb55" />
//     <Leaf x={0} y={0} r={-150} />
//     <Leaf x={0} y={0} r={-90} s={1.4} c="#3f9d4a" />
//     <Path d="M-26 0 L26 0 L20 46 L-20 46 Z" fill={pot} />
//     <Rect x={-28} y={-4} width={56} height={8} rx={4} fill="#ecc9bb" />
//   </G>
// );

// const Flower = ({ x, y, s = 1 }: any) => (
//   <G transform={`translate(${x} ${y}) scale(${s})`}>
//     {[0, 72, 144, 216, 288].map((a) => (
//       <Ellipse key={a} cx={0} cy={-6} rx={4} ry={6} fill="#fff" transform={`rotate(${a})`} />
//     ))}
//     <Circle cx={0} cy={0} r={3} fill="#f5b041" />
//   </G>
// );

// const Book = ({ x, y, w, h, c }: any) => <Rect x={x} y={y} width={w} height={h} rx={3} fill={c} />;

// /* ---------- room background ---------- */
// const Room = () => (
//   <View style={StyleSheet.absoluteFill} pointerEvents="none">
//     <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
//       <Defs>
//         <LinearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
//           <Stop offset="0" stopColor="#fbe7bf" />
//           <Stop offset="1" stopColor="#f3cd8d" />
//         </LinearGradient>
//         <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
//           <Stop offset="0" stopColor="#7cc7f2" />
//           <Stop offset="1" stopColor="#cdeeff" />
//         </LinearGradient>
//         <LinearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
//           <Stop offset="0" stopColor="#f5c176" />
//           <Stop offset="1" stopColor="#e5a14d" />
//         </LinearGradient>
//       </Defs>
//       <Rect width={400} height={800} fill="url(#wall)" />
//       <Rect y={625} width={400} height={175} fill="url(#floor)" />
//       <Rect y={618} width={400} height={10} fill="#e9b88b" />
//       <Rect x={-10} y={20} width={84} height={300} fill="#e2a15b" />
//       <Rect x={-4} y={28} width={72} height={284} fill="url(#sky)" />
//       <Ellipse cx={22} cy={90} rx={26} ry={13} fill="#fff" opacity={0.9} />
//       <Ellipse cx={46} cy={98} rx={20} ry={10} fill="#fff" opacity={0.9} />
//       <Circle cx={10} cy={230} r={40} fill="#6dbb4f" />
//       <Circle cx={48} cy={250} r={34} fill="#58a845" />
//       <Circle cx={20} cy={285} r={36} fill="#7ccb5a" />
//       <Rect x={-4} y={150} width={72} height={5} fill="#e2a15b" />
//       <Rect x={-10} y={312} width={96} height={10} fill="#e9b370" />
//       <Plant x={22} y={310} s={1.15} />
//       <Plant x={28} y={470} s={1.6} />
//       <Rect x={-6} y={500} width={70} height={10} rx={3} fill="#d9894a" />
//       <Rect x={4} y={510} width={8} height={90} fill="#c47a3d" />
//       <Rect x={52} y={510} width={8} height={90} fill="#c47a3d" />
//       <Rect x={366} y={20} width={44} height={595} fill="#e9b672" />
//       <Rect x={366} y={20} width={4} height={595} fill="#cf9650" />
//       <Rect x={366} y={170} width={44} height={6} fill="#cf9650" />
//       <Rect x={366} y={300} width={44} height={6} fill="#cf9650" />
//       <Rect x={366} y={420} width={44} height={6} fill="#cf9650" />
//       <Book x={374} y={100} w={11} h={68} c="#a97fd6" />
//       <Book x={386} y={106} w={11} h={62} c="#69b57b" />
//       <Book x={374} y={240} w={11} h={58} c="#ec6f9a" />
//       <Book x={386} y={246} w={11} h={52} c="#4a8ae0" />
//       <Book x={374} y={350} w={12} h={68} c="#4a8ae0" />
//       <Book x={387} y={356} w={11} h={62} c="#58b27a" />
//       <Rect x={370} y={190} width={34} height={28} rx={9} fill="#fbeee6" />
//       <Circle cx={380} cy={203} r={1.8} fill="#6b4a3a" />
//       <Circle cx={394} cy={203} r={1.8} fill="#6b4a3a" />
//       <Plant x={388} y={560} s={0.8} pot="#e8a56a" />
//       <Ellipse cx={215} cy={742} rx={200} ry={52} fill="#f4a3b4" />
//       <Ellipse cx={215} cy={742} rx={168} ry={40} fill="#f8bccb" />
//       <Flower x={170} y={742} />
//       <Flower x={260} y={730} />
//       <Flower x={215} y={758} s={0.8} />
//       <Rect x={290} y={740} width={120} height={14} rx={4} fill="#c47a3d" />
//       <Rect x={-6} y={650} width={72} height={26} rx={4} fill="#3fb07e" />
//       <Rect x={-10} y={676} width={80} height={26} rx={4} fill="#ec6f9a" />
//       <Rect x={-4} y={702} width={70} height={26} rx={4} fill="#3f7fd6" />
//       <Plant x={22} y={800} s={1.5} />
//       <Plant x={382} y={768} s={1.1} />
//       <Flower x={380} y={744} s={1.4} />
//     </Svg>
//   </View>
// );

// /* ---------- flower + leaves sprig (frame corners / sign) ---------- */
// const Sprig = ({ w = 62, flipX = false, flipY = false }: { w?: number; flipX?: boolean; flipY?: boolean }) => (
//   <Svg
//     width={w}
//     height={(w * 50) / 62}
//     viewBox="0 0 62 50"
//     style={{ transform: [{ scaleX: flipX ? -1 : 1 }, { scaleY: flipY ? -1 : 1 }] }}
//   >
//     <Leaf x={30} y={30} r={-150} s={1.1} c="#4caf50" />
//     <Leaf x={30} y={30} r={-20} s={1.1} c="#3f9d4a" />
//     <Leaf x={30} y={30} r={100} s={1.0} c="#5cbb55" />
//     <Flower x={26} y={26} s={1.6} />
//   </Svg>
// );

// /* ---------- scalloped letter badge ---------- */
// const Badge = ({ id, main, light }: { id: string; main: string; light: string }) => (
//   <View style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center' }}>
//     <Svg width={60} height={60} viewBox="0 0 60 60" style={{ position: 'absolute' }}>
//       {Array.from({ length: 12 }).map((_, i) => {
//         const a = (i * 30 * Math.PI) / 180;
//         return <Circle key={i} cx={30 + 23 * Math.cos(a)} cy={30 + 23 * Math.sin(a)} r={7} fill={light} />;
//       })}
//       <Circle cx={30} cy={30} r={21} fill={main} stroke="#fff" strokeWidth={2.5} />
//       <Ellipse cx={22} cy={20} rx={7} ry={4} fill="rgba(255,255,255,0.4)" />
//     </Svg>
//     <Text style={s.badgeTxt}>{id}</Text>
//   </View>
// );

// /* ---------- icons ---------- */
// const HomeIcon = () => (
//   <Svg width={24} height={24} viewBox="0 0 24 24">
//     <Path d="M12 3 L2 12 H5 V21 H10 V15 H14 V21 H19 V12 H22 Z" fill={INK} />
//   </Svg>
// );
// const GearIcon = () => (
//   <Svg width={26} height={26} viewBox="0 0 24 24">
//     <Circle cx={12} cy={12} r={8} stroke={INK} strokeWidth={4} strokeDasharray="3.1 3.1" fill="none" />
//     <Circle cx={12} cy={12} r={6.5} fill={INK} />
//     <Circle cx={12} cy={12} r={2.8} fill="#fbc45a" />
//   </Svg>
// );
// const Bulb = ({ k = 1 }: { k?: number }) => (
//   <Svg width={26 * k} height={30 * k} viewBox="0 0 24 28">
//     <Path d="M12 2 C6 2 3 6 3 10 C3 14 6 15 7 19 H17 C18 15 21 14 21 10 C21 6 18 2 12 2 Z" fill="#ffd23f" stroke="#e0a81f" strokeWidth={1.5} />
//     <Rect x={8} y={20} width={8} height={3} rx={1.5} fill="#8d8d8d" />
//     <Rect x={9} y={24} width={6} height={3} rx={1.5} fill="#6f6f6f" />
//   </Svg>
// );
// const SearchIcon = () => (
//   <Svg width={38} height={38} viewBox="0 0 24 24">
//     <Circle cx={10} cy={10} r={6.5} stroke="#1d2b2b" strokeWidth={2.8} fill="rgba(255,255,255,0.15)" />
//     <Path d="M15 15 L21 21" stroke="#1d2b2b" strokeWidth={3.4} strokeLinecap="round" />
//   </Svg>
// );
// const FilmIcon = () => (
//   <Svg width={40} height={40} viewBox="0 0 24 24">
//     <Rect x={2} y={4} width={20} height={16} rx={2} fill="#3a3350" />
//     <Rect x={4} y={6} width={16} height={12} rx={1} fill="#9b6be0" />
//     <Path d="M10 9 L15 12 L10 15 Z" fill="#1f1830" />
//   </Svg>
// );
// const PlayIcon = () => (
//   <Svg width={36} height={36} viewBox="0 0 24 24">
//     <Path d="M7 4 L20 12 L7 20 Z" fill="#222" />
//   </Svg>
// );
// const CoinIcon = () => (
//   <Svg width={18} height={18} viewBox="0 0 24 24">
//     <Circle cx={12} cy={12} r={10} fill="#ffc300" stroke="#e09b00" strokeWidth={2} />
//     <Circle cx={12} cy={12} r={5} fill="#ffdf5a" />
//   </Svg>
// );

// /* =====================  SCREEN  ===================== */
// type Props = {
//   playerId: number | string;
//   hints: number;
//   setHints?: (n: number) => void;
//   onExit: () => void;
//   onComplete: (r: any) => void;
// };

// export default function BTLevel24Screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
//   const [picked, setPicked] = useState<string | null>(null);
//   const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle');
//   const [err, setErr] = useState('');
//   const [hidden, setHidden] = useState<string[]>([]);
//   const busy = useRef(false);
//   const actBusy = useRef(false);
//   const tries = useRef(0);
//   const shake = useRef(new Animated.Value(0)).current;
//   const pop = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.spring(pop, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
//   }, []);

//   const doShake = () =>
//     Animated.sequence([10, -10, 6, -6, 0].map((v) =>
//       Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }),
//     )).start();

//   const flash = (m: string) => { setErr(m); setTimeout(() => setErr(''), 1800); };

//   const onPick = async (id: string) => {
//     if (busy.current || status === 'right') return;
//     busy.current = true;
//     setPicked(id);
//     tries.current += 1;
//     try {
//       const r = await answerLevel24(playerId, id, tries.current);
//       if (r.correct) {
//         setStatus('right');
//         setTimeout(() => onComplete({ ...r, skipped: false }), 1000);
//       } else {
//         setStatus('wrong');
//         doShake();
//         setTimeout(() => { setStatus('idle'); setPicked(null); }, 800);
//       }
//     } catch (e: any) {
//       tries.current -= 1;
//       flash(e?.message || 'Network error');
//       setPicked(null);
//     } finally {
//       busy.current = false;
//     }
//   };

//   const useHint = async () => {
//     if (actBusy.current || status === 'right') return;
//     if (hints < HINT_COST) { flash('Need ' + HINT_COST + ' hints. You have ' + hints + '.'); return; }
//     const wrong = OPTIONS.filter((o) => o.id !== 'C' && !hidden.includes(o.id));
//     if (!wrong.length) { flash('Only one answer left!'); return; }
//     actBusy.current = true;
//     try {
//       const r = await (api as any).hint(24, playerId, []);
//       if (typeof r?.hints === 'number') setHints?.(r.hints);
//       setHidden((h) => [...h, wrong[0].id]);
//     } catch (e: any) {
//       flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
//     } finally { actBusy.current = false; }
//   };

//   const watchVideo = async () => {
//     if (actBusy.current) return;
//     actBusy.current = true;
//     try {
//       const r = await (api as any).reward(playerId, 'video');
//       if (typeof r?.hints === 'number') setHints?.(r.hints);
//     } catch {} finally { actBusy.current = false; }
//   };

//   const skipLevel = async () => {
//     if (actBusy.current || status === 'right') return;
//     if (hints < SKIP_COST) { flash('Need ' + SKIP_COST + ' hints. You have ' + hints + '.'); return; }
//     actBusy.current = true;
//     try {
//       const r = await (api as any).skip(24, playerId);
//       setHints?.(typeof r?.hints === 'number' ? r.hints : hints - SKIP_COST);
//       setStatus('right');
//       setTimeout(() => onComplete({ ...r, skipped: true }), 600);
//     } catch (e: any) {
//       flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
//     } finally { actBusy.current = false; }
//   };

//   return (
//     <View style={s.root}>
//       <Room />
//       <View style={s.content}>
//         {/* top bar */}
//         <View style={s.topBar}>
//           <View style={s.row}>
//             <TouchableOpacity style={s.roundBtn} onPress={onExit}><HomeIcon /></TouchableOpacity>
//             <TouchableOpacity style={[s.roundBtn, { marginLeft: 8 }]}><GearIcon /></TouchableOpacity>
//           </View>
//           <View style={s.hintPill}>
//             <Bulb />
//             <Text style={s.hintNum}>{hints}</Text>
//           </View>
//         </View>

//         {/* hanging level sign */}
//         <View style={s.signWrap}>
//           <View style={[s.rope, { left: '30%' }]} />
//           <View style={[s.rope, { right: '30%' }]} />
//           <View style={s.sign}>
//             <Text style={s.signTxt}>LEVEL 24</Text>
//             <View style={{ position: 'absolute', left: -16, top: -18 }}><Sprig w={44} /></View>
//             <View style={{ position: 'absolute', right: -16, top: -18 }}><Sprig w={44} flipX /></View>
//           </View>
//         </View>

//         <Animated.View style={{ flex: 1, transform: [{ translateX: shake }] }}>
//           {/* question frame */}
//           <Animated.View style={[s.frame, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }]}>
//             <View style={s.paper}>
//               <Text style={s.question}>{QUESTION}</Text>
//             </View>
//             <View style={{ position: 'absolute', left: -16, top: -22 }}><Sprig w={56} /></View>
//             <View style={{ position: 'absolute', right: -4, top: -12 }}><Sprig w={30} flipX /></View>
//             <View style={{ position: 'absolute', left: -12, bottom: -16 }}><Sprig w={50} flipY /></View>
//             <View style={{ position: 'absolute', right: -14, bottom: -18 }}><Sprig w={52} flipX flipY /></View>
//           </Animated.View>

//           {/* options - unique design for each */}
//           <View style={s.options}>
//             {OPTIONS.map((o) => {
//               const p = picked === o.id;
//               const isRight = p && status === 'right';
//               const isWrong = p && status === 'wrong';
//               const bg = isRight ? '#d4f5cd' : isWrong ? '#ffd0d0' : o.bg;
//               const gone = hidden.includes(o.id);
//               return (
//                 <TouchableOpacity
//                   key={o.id}
//                   activeOpacity={0.85}
//                   disabled={gone}
//                   style={[s.option, { backgroundColor: bg, borderColor: o.border, opacity: gone ? 0.2 : 1 }]}
//                   onPress={() => onPick(o.id)}
//                 >
//                   {/* curved colour cap on the right */}
//                   <View style={s.clip} pointerEvents="none">
//                     <View style={[s.cap, { backgroundColor: o.main }]} />
//                   </View>
//                   <View style={[s.dashed, { borderColor: o.dash }]} pointerEvents="none" />

//                   <View style={{ position: 'absolute', left: -6, bottom: -8 }} pointerEvents="none">
//                     <Svg width={26} height={26} viewBox="0 0 26 26">
//                       <Leaf x={4} y={22} r={-60} s={0.7} />
//                       <Leaf x={6} y={24} r={-10} s={0.6} c="#3f9d4a" />
//                     </Svg>
//                   </View>

//                   <Badge id={o.id} main={o.main} light={o.light} />
//                   <Text style={s.optTxt}>{isRight ? o.text + ' ✓' : o.text}</Text>

//                   <View style={s.sprigR} pointerEvents="none">
//                     <Svg width={36} height={36} viewBox="0 0 36 36">
//                       <Path d="M12 34 C14 24, 16 18, 20 12" stroke="#3f8f3f" strokeWidth={2.5} fill="none" />
//                       <Leaf x={14} y={26} r={-30} s={0.6} />
//                       <Flower x={21} y={11} s={1.1} />
//                     </Svg>
//                   </View>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </Animated.View>

//         {/* hint / video / skip bar */}
//         <View style={s.bar}>
//           <View style={s.acol}>
//             <TouchableOpacity activeOpacity={0.8} style={[s.btn, s.hintBtn]} onPress={useHint}><SearchIcon /></TouchableOpacity>
//             <View style={s.lblRow}><Bulb k={0.5} /><Text style={s.lbl}>{HINT_COST}</Text></View>
//           </View>
//           <View style={s.acol}>
//             <TouchableOpacity activeOpacity={0.8} style={[s.btn, s.videoBtn]} onPress={watchVideo}><FilmIcon /></TouchableOpacity>
//             <View style={s.lblRow}><CoinIcon /><Text style={s.lbl}>+75</Text></View>
//           </View>
//           <View style={s.acol}>
//             <TouchableOpacity activeOpacity={0.8} style={[s.btn, s.skipBtn]} onPress={skipLevel}><PlayIcon /></TouchableOpacity>
//             <View style={s.lblRow}><Bulb k={0.5} /><Text style={s.lbl}>{SKIP_COST}</Text></View>
//           </View>
//         </View>

//         {!!err && <Text style={s.err}>{err}</Text>}
//       </View>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#fbe7bf', overflow: 'hidden' },
//   content: { flex: 1, paddingHorizontal: 16, paddingTop: 30, paddingBottom: 14 },
//   row: { flexDirection: 'row' },
//   topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 },
//   roundBtn: {
//     width: 46, height: 46, borderRadius: 23, backgroundColor: '#fbc45a',
//     borderWidth: 3, borderColor: '#7a4a22', alignItems: 'center', justifyContent: 'center',
//   },
//   hintPill: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     backgroundColor: '#fff6e6', borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', borderColor: '#d9b070',
//     paddingHorizontal: 14, height: 46, minWidth: 96,
//   },
//   hintNum: { fontFamily: F, fontSize: 22, fontWeight: '800', color: INK, marginLeft: 10 },

//   signWrap: { alignItems: 'center', marginTop: -34, zIndex: 4 },
//   rope: { position: 'absolute', top: -10, width: 3, height: 36, backgroundColor: '#8a5a2b' },
//   sign: {
//     marginTop: 18, paddingHorizontal: 40, paddingVertical: 6, borderRadius: 12,
//     backgroundColor: '#d98b3d', borderWidth: 3, borderColor: '#a8601f',
//     elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
//   },
//   signTxt: {
//     fontFamily: F, color: '#fff3d6', fontSize: 28, fontWeight: '900', letterSpacing: 1,
//     textShadowColor: '#7a3f10', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 2,
//   },

//   frame: {
//     flex: 1, marginTop: 30, padding: 8, borderRadius: 18,
//     backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_DARK,
//     elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 4 },
//   },
//   paper: {
//     flex: 1, justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 18,
//     backgroundColor: '#fdf1d8', borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d9a874',
//   },
//   question: { fontFamily: F, fontSize: 22, lineHeight: 30, textAlign: 'center', color: INK, fontWeight: '700' },

//   options: { flex: 1.5, marginTop: 22, justifyContent: 'space-between' },
//   option: {
//     flexDirection: 'row', alignItems: 'center', borderRadius: 34, borderWidth: 3,
//     paddingVertical: 4, paddingHorizontal: 10, flex: 1, maxHeight: 74, marginBottom: 8,
//     elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
//   },
//   clip: { ...StyleSheet.absoluteFillObject, borderRadius: 30, overflow: 'hidden' },
//   cap: {
//     position: 'absolute', right: -14, top: -4, bottom: -4, width: 74,
//     borderTopLeftRadius: 40, borderBottomLeftRadius: 40,
//   },
//   dashed: {
//     position: 'absolute', left: 6, right: 6, top: 6, bottom: 6, borderRadius: 26,
//     borderWidth: 1.2, borderStyle: 'dashed',
//   },
//   badgeTxt: { position: 'absolute', fontFamily: F, color: '#fff', fontSize: 26, fontWeight: '900' },
//   optTxt: { flex: 1, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: '800', color: INK, marginRight: 40 },
//   sprigR: { position: 'absolute', right: 10, top: 14 },

//   bar: {
//     flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
//     backgroundColor: '#fdf5e6', borderRadius: 38, borderWidth: 6, borderColor: '#b9d6ee',
//     paddingVertical: 8, paddingHorizontal: 10, marginTop: 4,
//   },
//   acol: { alignItems: 'center' },
//   btn: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', borderWidth: 4, elevation: 4 },
//   hintBtn: { backgroundColor: '#a8e22a', borderColor: '#d6f58a' },
//   videoBtn: { backgroundColor: '#f3efe2', borderColor: '#fff' },
//   skipBtn: { backgroundColor: '#f0484f', borderColor: '#fff' },
//   lblRow: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 26, minWidth: 66, marginTop: 5,
//     paddingHorizontal: 10, borderRadius: 13, backgroundColor: '#6b4423',
//   },
//   lbl: { fontFamily: F, fontSize: 15, fontWeight: 'bold', color: '#fff', marginLeft: 4 },
//   err: { position: 'absolute', bottom: 150, alignSelf: 'center', color: '#c0392b', fontSize: 17, fontWeight: 'bold' },
// });
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, Rect, Ellipse, Circle, Path, G,
} from 'react-native-svg';
import { F } from './BTShared';
import * as api from './api';
import { answerLevel24 } from './Btlevel24api';

const QUESTION =
  'When I was 4 years old, my younger sister was half my age. If I am now 20 years old, how old is my younger sister?';

// one unique colour theme per option (pink / blue / gold)
const OPTIONS = [
  { id: 'A', text: '10 years', main: '#e8456b', light: '#f58aa6', bg: '#fdeaec', border: '#f06b8a', dash: '#f4a0b4' },
  { id: 'B', text: '16 years', main: '#2f8ff0', light: '#79bdf8', bg: '#eaf4fb', border: '#3b8fe8', dash: '#9cc8f0' },
  { id: 'C', text: '18 years', main: '#f5a30c', light: '#fbc94f', bg: '#fdf1d3', border: '#f5b92e', dash: '#f0cf80' },
];

const WOOD = '#d98b3d';
const WOOD_DARK = '#8a4f1d';
const INK = '#3a2412';
const HINT_COST = 25;
const SKIP_COST = 50;

/* ---------- drawing pieces ---------- */
const Leaf = ({ x, y, r = 0, s = 1, c = '#4caf50' }: any) => (
  <G transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <Path d="M0 0 C 14 -18, 36 -8, 32 12 C 16 18, 4 12, 0 0 Z" fill={c} />
    <Path d="M2 2 C 12 -3, 22 -1, 30 9" stroke="#2e7d32" strokeWidth={1.5} fill="none" />
  </G>
);

const Plant = ({ x, y, s = 1, pot = '#f3d9cf' }: any) => (
  <G transform={`translate(${x} ${y}) scale(${s})`}>
    <Leaf x={0} y={0} r={-70} />
    <Leaf x={0} y={0} r={-30} s={1.2} c="#5cbb55" />
    <Leaf x={0} y={0} r={10} s={1.1} />
    <Leaf x={0} y={0} r={-110} s={1.1} c="#5cbb55" />
    <Leaf x={0} y={0} r={-150} />
    <Leaf x={0} y={0} r={-90} s={1.4} c="#3f9d4a" />
    <Path d="M-26 0 L26 0 L20 46 L-20 46 Z" fill={pot} />
    <Rect x={-28} y={-4} width={56} height={8} rx={4} fill="#ecc9bb" />
  </G>
);

const Flower = ({ x, y, s = 1 }: any) => (
  <G transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 72, 144, 216, 288].map((a) => (
      <Ellipse key={a} cx={0} cy={-6} rx={4} ry={6} fill="#fff" transform={`rotate(${a})`} />
    ))}
    <Circle cx={0} cy={0} r={3} fill="#f5b041" />
  </G>
);

const Book = ({ x, y, w, h, c }: any) => <Rect x={x} y={y} width={w} height={h} rx={3} fill={c} />;

/* ---------- room background ---------- */
const Room = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#fbe7bf" />
          <Stop offset="1" stopColor="#f3cd8d" />
        </LinearGradient>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#7cc7f2" />
          <Stop offset="1" stopColor="#cdeeff" />
        </LinearGradient>
        <LinearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#f5c176" />
          <Stop offset="1" stopColor="#e5a14d" />
        </LinearGradient>
      </Defs>
      <Rect width={400} height={800} fill="url(#wall)" />
      <Rect y={625} width={400} height={175} fill="url(#floor)" />
      <Rect y={618} width={400} height={10} fill="#e9b88b" />
      <Rect x={-10} y={20} width={84} height={300} fill="#e2a15b" />
      <Rect x={-4} y={28} width={72} height={284} fill="url(#sky)" />
      <Ellipse cx={22} cy={90} rx={26} ry={13} fill="#fff" opacity={0.9} />
      <Ellipse cx={46} cy={98} rx={20} ry={10} fill="#fff" opacity={0.9} />
      <Circle cx={10} cy={230} r={40} fill="#6dbb4f" />
      <Circle cx={48} cy={250} r={34} fill="#58a845" />
      <Circle cx={20} cy={285} r={36} fill="#7ccb5a" />
      <Rect x={-4} y={150} width={72} height={5} fill="#e2a15b" />
      <Rect x={-10} y={312} width={96} height={10} fill="#e9b370" />
      <Plant x={22} y={310} s={1.15} />
      <Plant x={28} y={470} s={1.6} />
      <Rect x={-6} y={500} width={70} height={10} rx={3} fill="#d9894a" />
      <Rect x={4} y={510} width={8} height={90} fill="#c47a3d" />
      <Rect x={52} y={510} width={8} height={90} fill="#c47a3d" />
      <Rect x={366} y={20} width={44} height={595} fill="#e9b672" />
      <Rect x={366} y={20} width={4} height={595} fill="#cf9650" />
      <Rect x={366} y={170} width={44} height={6} fill="#cf9650" />
      <Rect x={366} y={300} width={44} height={6} fill="#cf9650" />
      <Rect x={366} y={420} width={44} height={6} fill="#cf9650" />
      <Book x={374} y={100} w={11} h={68} c="#a97fd6" />
      <Book x={386} y={106} w={11} h={62} c="#69b57b" />
      <Book x={374} y={240} w={11} h={58} c="#ec6f9a" />
      <Book x={386} y={246} w={11} h={52} c="#4a8ae0" />
      <Book x={374} y={350} w={12} h={68} c="#4a8ae0" />
      <Book x={387} y={356} w={11} h={62} c="#58b27a" />
      <Rect x={370} y={190} width={34} height={28} rx={9} fill="#fbeee6" />
      <Circle cx={380} cy={203} r={1.8} fill="#6b4a3a" />
      <Circle cx={394} cy={203} r={1.8} fill="#6b4a3a" />
      <Plant x={388} y={560} s={0.8} pot="#e8a56a" />
      <Ellipse cx={215} cy={742} rx={200} ry={52} fill="#f4a3b4" />
      <Ellipse cx={215} cy={742} rx={168} ry={40} fill="#f8bccb" />
      <Flower x={170} y={742} />
      <Flower x={260} y={730} />
      <Flower x={215} y={758} s={0.8} />
      <Rect x={290} y={740} width={120} height={14} rx={4} fill="#c47a3d" />
      <Rect x={-6} y={650} width={72} height={26} rx={4} fill="#3fb07e" />
      <Rect x={-10} y={676} width={80} height={26} rx={4} fill="#ec6f9a" />
      <Rect x={-4} y={702} width={70} height={26} rx={4} fill="#3f7fd6" />
      <Plant x={22} y={800} s={1.5} />
      <Plant x={382} y={768} s={1.1} />
      <Flower x={380} y={744} s={1.4} />
    </Svg>
  </View>
);

/* ---------- flower + leaves sprig (frame corners / sign) ---------- */
const Sprig = ({ w = 62, flipX = false, flipY = false }: { w?: number; flipX?: boolean; flipY?: boolean }) => (
  <Svg
    width={w}
    height={(w * 50) / 62}
    viewBox="0 0 62 50"
    style={{ transform: [{ scaleX: flipX ? -1 : 1 }, { scaleY: flipY ? -1 : 1 }] }}
  >
    <Leaf x={30} y={30} r={-150} s={1.1} c="#4caf50" />
    <Leaf x={30} y={30} r={-20} s={1.1} c="#3f9d4a" />
    <Leaf x={30} y={30} r={100} s={1.0} c="#5cbb55" />
    <Flower x={26} y={26} s={1.6} />
  </Svg>
);

/* ---------- scalloped letter badge ---------- */
const Badge = ({ id, main, light }: { id: string; main: string; light: string }) => (
  <View style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={60} height={60} viewBox="0 0 60 60" style={{ position: 'absolute' }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return <Circle key={i} cx={30 + 23 * Math.cos(a)} cy={30 + 23 * Math.sin(a)} r={7} fill={light} />;
      })}
      <Circle cx={30} cy={30} r={21} fill={main} stroke="#fff" strokeWidth={2.5} />
      <Ellipse cx={22} cy={20} rx={7} ry={4} fill="rgba(255,255,255,0.4)" />
    </Svg>
    <Text style={s.badgeTxt}>{id}</Text>
  </View>
);

/* ---------- icons ---------- */
const HomeIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path d="M12 3 L2 12 H5 V21 H10 V15 H14 V21 H19 V12 H22 Z" fill={INK} />
  </Svg>
);
const GearIcon = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={8} stroke={INK} strokeWidth={4} strokeDasharray="3.1 3.1" fill="none" />
    <Circle cx={12} cy={12} r={6.5} fill={INK} />
    <Circle cx={12} cy={12} r={2.8} fill="#fbc45a" />
  </Svg>
);
const Bulb = ({ k = 1 }: { k?: number }) => (
  <Svg width={26 * k} height={30 * k} viewBox="0 0 24 28">
    <Path d="M12 2 C6 2 3 6 3 10 C3 14 6 15 7 19 H17 C18 15 21 14 21 10 C21 6 18 2 12 2 Z" fill="#ffd23f" stroke="#e0a81f" strokeWidth={1.5} />
    <Rect x={8} y={20} width={8} height={3} rx={1.5} fill="#8d8d8d" />
    <Rect x={9} y={24} width={6} height={3} rx={1.5} fill="#6f6f6f" />
  </Svg>
);
const SearchIcon = () => (
  <Svg width={38} height={38} viewBox="0 0 24 24">
    <Circle cx={10} cy={10} r={6.5} stroke="#1d2b2b" strokeWidth={2.8} fill="rgba(255,255,255,0.15)" />
    <Path d="M15 15 L21 21" stroke="#1d2b2b" strokeWidth={3.4} strokeLinecap="round" />
  </Svg>
);
const FilmIcon = () => (
  <Svg width={40} height={40} viewBox="0 0 24 24">
    <Rect x={2} y={4} width={20} height={16} rx={2} fill="#3a3350" />
    <Rect x={4} y={6} width={16} height={12} rx={1} fill="#9b6be0" />
    <Path d="M10 9 L15 12 L10 15 Z" fill="#1f1830" />
  </Svg>
);
const PlayIcon = () => (
  <Svg width={36} height={36} viewBox="0 0 24 24">
    <Path d="M7 4 L20 12 L7 20 Z" fill="#222" />
  </Svg>
);
const CoinIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={10} fill="#ffc300" stroke="#e09b00" strokeWidth={2} />
    <Circle cx={12} cy={12} r={5} fill="#ffdf5a" />
  </Svg>
);

/* =====================  SCREEN  ===================== */
type Props = {
  playerId: number | string;
  hints: number;
  setHints?: (n: number) => void;
  onExit: () => void;
  onComplete: (r: any) => void;
};

export default function BTLevel24Screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle');
  const [err, setErr] = useState('');
  const [hidden, setHidden] = useState<string[]>([]);
  const busy = useRef(false);
  const actBusy = useRef(false);
  const tries = useRef(0);
  const shake = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
  }, []);

  const doShake = () =>
    Animated.sequence([10, -10, 6, -6, 0].map((v) =>
      Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }),
    )).start();

  const flash = (m: string) => { setErr(m); setTimeout(() => setErr(''), 1800); };

  const onPick = async (id: string) => {
    if (busy.current || status === 'right') return;
    busy.current = true;
    setPicked(id);
    tries.current += 1;
    try {
      const r = await answerLevel24(playerId, id, tries.current);
      if (r.correct) {
        setStatus('right');
        setTimeout(() => onComplete({ ...r, skipped: false }), 1000);
      } else {
        setStatus('wrong');
        doShake();
        setTimeout(() => { setStatus('idle'); setPicked(null); }, 800);
      }
    } catch (e: any) {
      tries.current -= 1;
      flash(e?.message || 'Network error');
      setPicked(null);
    } finally {
      busy.current = false;
    }
  };

  const useHint = async () => {
    if (actBusy.current || status === 'right') return;
    if (hints < HINT_COST) { flash('Need ' + HINT_COST + ' hints. You have ' + hints + '.'); return; }
    const wrong = OPTIONS.filter((o) => o.id !== 'C' && !hidden.includes(o.id));
    if (!wrong.length) { flash('Only one answer left!'); return; }
    actBusy.current = true;
    try {
      const r = await (api as any).hint(24, playerId, []);
      if (typeof r?.hints === 'number') setHints?.(r.hints);
      setHidden((h) => [...h, wrong[0].id]);
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
    } finally { actBusy.current = false; }
  };

  const watchVideo = async () => {
    if (actBusy.current) return;
    actBusy.current = true;
    try {
      const r = await (api as any).reward(playerId, 'video');
      if (typeof r?.hints === 'number') setHints?.(r.hints);
    } catch {} finally { actBusy.current = false; }
  };

  const skipLevel = async () => {
    if (actBusy.current || status === 'right') return;
    if (hints < SKIP_COST) { flash('Need ' + SKIP_COST + ' hints. You have ' + hints + '.'); return; }
    actBusy.current = true;
    try {
      const r = await (api as any).skip(24, playerId);
      setHints?.(typeof r?.hints === 'number' ? r.hints : hints - SKIP_COST);
      setStatus('right');
      setTimeout(() => onComplete({ ...r, skipped: true }), 600);
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
    } finally { actBusy.current = false; }
  };

  return (
    <View style={s.root}>
      <Room />
      <View style={s.content}>
        {/* top bar */}
        <View style={s.topBar}>
          <View style={s.row}>
            <TouchableOpacity style={s.roundBtn} onPress={onExit}><HomeIcon /></TouchableOpacity>
            <TouchableOpacity style={[s.roundBtn, { marginLeft: 8 }]}><GearIcon /></TouchableOpacity>
          </View>
          <View style={s.hintPill}>
            <Bulb />
            <Text style={s.hintNum}>{hints}</Text>
          </View>
        </View>

        {/* hanging level sign */}
        <View style={s.signWrap}>
          <View style={[s.rope, { left: '30%' }]} />
          <View style={[s.rope, { right: '30%' }]} />
          <View style={s.sign}>
            <Text style={s.signTxt}>LEVEL 24</Text>
            <View style={{ position: 'absolute', left: -16, top: -18 }}><Sprig w={44} /></View>
            <View style={{ position: 'absolute', right: -16, top: -18 }}><Sprig w={44} flipX /></View>
          </View>
        </View>

        <Animated.View style={{ flex: 1, transform: [{ translateX: shake }] }}>
          {/* question frame */}
          <Animated.View style={[s.frame, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }]}>
            <View style={s.paper}>
              <Text style={s.question}>{QUESTION}</Text>
            </View>
            <View style={{ position: 'absolute', left: -16, top: -22 }}><Sprig w={56} /></View>
            <View style={{ position: 'absolute', right: -4, top: -12 }}><Sprig w={30} flipX /></View>
            <View style={{ position: 'absolute', left: -12, bottom: -16 }}><Sprig w={50} flipY /></View>
            <View style={{ position: 'absolute', right: -14, bottom: -18 }}><Sprig w={52} flipX flipY /></View>
          </Animated.View>

          {/* options - unique design for each */}
          <View style={s.options}>
            {OPTIONS.map((o) => {
              const p = picked === o.id;
              const isRight = p && status === 'right';
              const isWrong = p && status === 'wrong';
              const bg = isRight ? '#d4f5cd' : isWrong ? '#ffd0d0' : o.bg;
              const gone = hidden.includes(o.id);
              return (
                <TouchableOpacity
                  key={o.id}
                  activeOpacity={0.85}
                  disabled={gone}
                  style={[s.option, { backgroundColor: bg, borderColor: o.border, opacity: gone ? 0.2 : 1 }]}
                  onPress={() => onPick(o.id)}
                >
                  {/* curved colour cap on the right */}
                  <View style={s.clip} pointerEvents="none">
                    <View style={[s.cap, { backgroundColor: o.main }]} />
                  </View>
                  <View style={[s.dashed, { borderColor: o.dash }]} pointerEvents="none" />

                  <View style={{ position: 'absolute', left: -6, bottom: -8 }} pointerEvents="none">
                    <Svg width={26} height={26} viewBox="0 0 26 26">
                      <Leaf x={4} y={22} r={-60} s={0.7} />
                      <Leaf x={6} y={24} r={-10} s={0.6} c="#3f9d4a" />
                    </Svg>
                  </View>

                  <Badge id={o.id} main={o.main} light={o.light} />
                  <Text style={s.optTxt}>{isRight ? o.text + ' ✓' : o.text}</Text>

                  <View style={s.sprigR} pointerEvents="none">
                    <Svg width={36} height={36} viewBox="0 0 36 36">
                      <Path d="M12 34 C14 24, 16 18, 20 12" stroke="#3f8f3f" strokeWidth={2.5} fill="none" />
                      <Leaf x={14} y={26} r={-30} s={0.6} />
                      <Flower x={21} y={11} s={1.1} />
                    </Svg>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* hint / video / skip bar */}
        <View style={s.bar}>
          <View style={s.acol}>
            <TouchableOpacity activeOpacity={0.8} style={[s.btn, s.hintBtn]} onPress={useHint}><SearchIcon /></TouchableOpacity>
            <View style={s.lblRow}><Bulb k={0.5} /><Text style={s.lbl}>{HINT_COST}</Text></View>
          </View>
          <View style={s.acol}>
            <TouchableOpacity activeOpacity={0.8} style={[s.btn, s.videoBtn]} onPress={watchVideo}><FilmIcon /></TouchableOpacity>
            <View style={s.lblRow}><CoinIcon /><Text style={s.lbl}>+75</Text></View>
          </View>
          <View style={s.acol}>
            <TouchableOpacity activeOpacity={0.8} style={[s.btn, s.skipBtn]} onPress={skipLevel}><PlayIcon /></TouchableOpacity>
            <View style={s.lblRow}><Bulb k={0.5} /><Text style={s.lbl}>{SKIP_COST}</Text></View>
          </View>
        </View>

        {!!err && <Text style={s.err}>{err}</Text>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fbe7bf', overflow: 'hidden' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 30, paddingBottom: 14 },
  row: { flexDirection: 'row' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 },
  roundBtn: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#fbc45a',
    borderWidth: 3, borderColor: '#7a4a22', alignItems: 'center', justifyContent: 'center',
  },
  hintPill: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff6e6', borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', borderColor: '#d9b070',
    paddingHorizontal: 14, height: 46, minWidth: 96,
  },
  hintNum: { fontFamily: F, fontSize: 22, fontWeight: '800', color: INK, marginLeft: 10 },

  signWrap: { alignItems: 'center', marginTop: -34, zIndex: 4 },
  rope: { position: 'absolute', top: -10, width: 3, height: 36, backgroundColor: '#8a5a2b' },
  sign: {
    marginTop: 18, paddingHorizontal: 40, paddingVertical: 6, borderRadius: 12,
    backgroundColor: '#d98b3d', borderWidth: 3, borderColor: '#a8601f',
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
  },
  signTxt: {
    fontFamily: F, color: '#fff3d6', fontSize: 28, fontWeight: '900', letterSpacing: 1,
    textShadowColor: '#7a3f10', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 2,
  },

  frame: {
    flex: 1, marginTop: 30, padding: 8, borderRadius: 18,
    backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_DARK,
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 4 },
  },
  paper: {
    flex: 1, justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 18,
    backgroundColor: '#fdf1d8', borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d9a874',
  },
  question: { fontFamily: F, fontSize: 22, lineHeight: 30, textAlign: 'center', color: INK, fontWeight: '700' },

  options: { flex: 1.5, marginTop: 22, justifyContent: 'space-between' },
  option: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 34, borderWidth: 3,
    paddingVertical: 4, paddingHorizontal: 10, flex: 1, maxHeight: 74, marginBottom: 8,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
  },
  clip: { ...StyleSheet.absoluteFillObject, borderRadius: 30, overflow: 'hidden' },
  cap: {
    position: 'absolute', right: -14, top: -4, bottom: -4, width: 74,
    borderTopLeftRadius: 40, borderBottomLeftRadius: 40,
  },
  dashed: {
    position: 'absolute', left: 6, right: 6, top: 6, bottom: 6, borderRadius: 26,
    borderWidth: 1.2, borderStyle: 'dashed',
  },
  badgeTxt: { position: 'absolute', fontFamily: F, color: '#fff', fontSize: 26, fontWeight: '900' },
  optTxt: { flex: 1, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: '800', color: INK, marginRight: 40 },
  sprigR: { position: 'absolute', right: 10, top: 14 },

  bar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#fdf5e6', borderRadius: 38, borderWidth: 6, borderColor: '#b9d6ee',
    paddingVertical: 8, paddingHorizontal: 10, marginTop: 4,
  },
  acol: { alignItems: 'center' },
  btn: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', borderWidth: 4, elevation: 4 },
  hintBtn: { backgroundColor: '#a8e22a', borderColor: '#d6f58a' },
  videoBtn: { backgroundColor: '#f3efe2', borderColor: '#fff' },
  skipBtn: { backgroundColor: '#f0484f', borderColor: '#fff' },
  lblRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 26, minWidth: 66, marginTop: 5,
    paddingHorizontal: 10, borderRadius: 13, backgroundColor: '#6b4423',
  },
  lbl: { fontFamily: F, fontSize: 15, fontWeight: 'bold', color: '#fff', marginLeft: 4 },
  err: { position: 'absolute', bottom: 140, alignSelf: 'center', color: '#c0392b', fontSize: 15, fontWeight: 'bold', backgroundColor: '#fff6e6', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 4, overflow: 'hidden', textAlign: 'center' },
});
