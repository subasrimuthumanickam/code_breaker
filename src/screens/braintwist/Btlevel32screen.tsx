// // // // src/screens/braintwist/Btlevel32screen.tsx
// // // import React, { useCallback, useEffect, useState } from "react";
// // // import { FishArt } from "./Btlevel32art";
// // // import {
// // //   Level32Session,
// // //   OptionLetter,
// // //   startLevel32,
// // //   submitLevel32Answer,
// // // } from "./Btlevel32api";

// // // const LETTERS: OptionLetter[] = ["A", "B", "C", "D"];

// // // interface Props {
// // //   playerId?: number;
// // //   onComplete?: () => void; // call to move to the next level
// // //   onHome?: () => void;
// // // }

// // // const getPlayerId = (): number => {
// // //   try {
// // //     return Number(localStorage.getItem("player_id")) || 3;
// // //   } catch {
// // //     return 3;
// // //   }
// // // };

// // // const Btlevel32screen: React.FC<Props> = ({ playerId, onComplete, onHome }) => {
// // //   const pid = playerId ?? getPlayerId();
// // //   const [session, setSession] = useState<Level32Session | null>(null);
// // //   const [picked, setPicked] = useState<OptionLetter | null>(null);
// // //   const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [busy, setBusy] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const load = useCallback(async () => {
// // //     setLoading(true);
// // //     setError(null);
// // //     setPicked(null);
// // //     setFeedback(null);
// // //     try {
// // //       setSession(await startLevel32(pid));
// // //     } catch (e: any) {
// // //       setError(e.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [pid]);

// // //   useEffect(() => {
// // //     load();
// // //   }, [load]);

// // //   const choose = async (letter: OptionLetter) => {
// // //     if (!session || busy || feedback?.ok) return;
// // //     setPicked(letter);
// // //     setBusy(true);
// // //     try {
// // //       const r = await submitLevel32Answer(session.sessionId, pid, letter);
// // //       setFeedback({ ok: r.isCorrect, text: r.message });
// // //     } catch (e: any) {
// // //       setError(e.message);
// // //     } finally {
// // //       setBusy(false);
// // //     }
// // //   };

// // //   const solved = feedback?.ok === true;

// // //   return (
// // //     <div style={S.page}>
// // //       <div style={S.top}>
// // //         <button style={S.round} onClick={onHome} aria-label="Home">⌂</button>
// // //         <div style={S.sign}>{session?.title ?? "Level 32"}</div>
// // //         <div style={{ width: 48 }} />
// // //       </div>

// // //       <div style={S.prompt}>{session?.instruction ?? "Find the Correct Shadow"}</div>

// // //       <div style={S.stage}>
// // //         {loading && <p style={S.note}>Loading puzzle…</p>}
// // //         {!loading && session && <FishArt variant={session.targetVariant} size={300} />}
// // //         {error && (
// // //           <div style={S.note}>
// // //             {error} <button style={S.link} onClick={load}>Try again</button>
// // //           </div>
// // //         )}
// // //       </div>

// // //       <div style={S.grid}>
// // //         {session?.options.map((v, i) => {
// // //           const letter = LETTERS[i];
// // //           const isPicked = picked === letter;
// // //           const border = isPicked ? (feedback ? (feedback.ok ? "#3aa655" : "#d9534f") : "#f0a030") : "#e3b887";
// // //           return (
// // //             <button
// // //               key={letter}
// // //               onClick={() => choose(letter)}
// // //               disabled={busy || solved}
// // //               style={{ ...S.option, borderColor: border }}
// // //               aria-label={`Option ${letter}`}
// // //             >
// // //               <span style={S.badge}>{letter}</span>
// // //               <FishArt variant={v} shadow size={170} />
// // //             </button>
// // //           );
// // //         })}
// // //       </div>

// // //       <div style={S.footer}>
// // //         {feedback && (
// // //           <span style={{ ...S.msg, color: feedback.ok ? "#2f8a47" : "#b8433f" }}>{feedback.text}</span>
// // //         )}
// // //         {feedback && !solved && <button style={S.cta} onClick={() => { setPicked(null); setFeedback(null); }}>Try again</button>}
// // //         {solved && <button style={S.cta} onClick={onComplete}>Next level</button>}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // const S: Record<string, React.CSSProperties> = {
// // //   page: { minHeight: "100vh", background: "#a9d6f5", padding: 16, fontFamily: "'Baloo 2', 'Nunito', system-ui, sans-serif", boxSizing: "border-box" },
// // //   top: { display: "flex", justifyContent: "space-between", alignItems: "center" },
// // //   round: { width: 48, height: 48, borderRadius: "50%", border: "3px solid #c98a1a", background: "#ffcf4a", fontSize: 22, cursor: "pointer" },
// // //   sign: { background: "#b8742f", color: "#fff", padding: "8px 28px", borderRadius: 10, fontWeight: 800, fontSize: 24, border: "3px solid #8f5622" },
// // //   prompt: { maxWidth: 520, margin: "14px auto", textAlign: "center", background: "#fdf2df", border: "2px dashed #d9a062", borderRadius: 30, padding: "10px 16px", color: "#1d2b6b", fontSize: 24, fontWeight: 700 },
// // //   stage: { maxWidth: 520, minHeight: 250, margin: "0 auto 16px", background: "#fdf2df", border: "2px dashed #d9a062", borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" },
// // //   grid: { maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 },
// // //   option: { position: "relative", background: "#fdf2df", border: "3px dashed", borderRadius: 22, padding: "26px 8px 8px", cursor: "pointer", display: "flex", justifyContent: "center" },
// // //   badge: { position: "absolute", top: -14, left: -6, width: 38, height: 38, borderRadius: "50%", background: "#ffcf4a", border: "3px solid #b8742f", display: "grid", placeItems: "center", fontWeight: 800, color: "#1d2b53" },
// // //   footer: { maxWidth: 520, margin: "18px auto 0", textAlign: "center", display: "flex", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap" },
// // //   msg: { fontWeight: 800, fontSize: 18 },
// // //   cta: { background: "#f28c28", color: "#fff", border: "none", borderRadius: 14, padding: "10px 22px", fontWeight: 800, fontSize: 18, cursor: "pointer" },
// // //   note: { color: "#5a4630", fontWeight: 600 },
// // //   link: { background: "none", border: "none", color: "#1d4fb3", textDecoration: "underline", cursor: "pointer", fontWeight: 700 },
// // // };

// // // export default Btlevel32screen;
// // import React, {useEffect, useRef, useState} from 'react';
// // import {View, Text, TouchableOpacity, Animated, StyleSheet} from 'react-native';
// // import {F, INK, Stage} from './BTShared';
// // import {Icon} from './Art';
// // import {Fish} from './Btlevel32art';
// // import * as api from './Btlevel32api';

// // const SKY = '#9fc6ea', NAVY = '#10245e', CREAM = '#fbf6e9';
// // const LETTERS: api.Letter[] = ['A', 'B', 'C', 'D'];

// // export default function BTLevel32Screen({playerId, hints, onExit, onComplete}: any) {
// //   const [lv, setLv] = useState<api.L32Start | null>(null);
// //   const [pick, setPick] = useState<api.Letter | null>(null);
// //   const [ok, setOk] = useState<boolean | null>(null);
// //   const [note, setNote] = useState('');
// //   const [busy, setBusy] = useState(false);
// //   const shake = useRef(new Animated.Value(0)).current;

// //   const flash = (m: string) => { setNote(m); setTimeout(() => setNote(''), 1500); };
// //   const doShake = () =>
// //     Animated.sequence([10, -10, 6, -6, 0].map(v =>
// //       Animated.timing(shake, {toValue: v, duration: 55, useNativeDriver: true}))).start();

// //   const load = () => {
// //     api.start(playerId).then(setLv).catch(() => flash('Cannot load level 32'));
// //   };
// //   useEffect(load, []);

// //   const choose = async (l: api.Letter) => {
// //     if (!lv || busy || ok) return;
// //     setBusy(true);
// //     setPick(l);
// //     try {
// //       const r = await api.answer(lv.sessionId, playerId, l);
// //       if (r.correct) {
// //         setOk(true);
// //         setTimeout(() => onComplete({...r, skipped: false}), 1000);
// //       } else {
// //         setOk(false);
// //         doShake();
// //         flash('Not quite. Try again!');
// //         setTimeout(() => { setPick(null); setOk(null); }, 800);
// //       }
// //     } catch {
// //       setPick(null);
// //       flash('Network error');
// //     } finally {
// //       setBusy(false);
// //     }
// //   };

// //   return (
// //     <Stage bg={SKY}>
// //       <View style={s.wall}>
// //         <View style={s.top}>
// //           <TouchableOpacity onPress={onExit} style={s.round}><Icon n="home" s={16} /></TouchableOpacity>
// //           <View style={s.sign}><Text style={s.signt}>LEVEL 32</Text></View>
// //           <View style={s.pill}><Text style={s.pt}>{hints}</Text><Icon n="bulb" s={18} /></View>
// //         </View>

// //         <View style={s.q}><Text style={s.qt}>{lv?.question || 'Loading...'}</Text></View>

// //         <View style={s.card}>{lv && <Fish w={260} v={lv.target} />}</View>

// //         <Animated.View style={[s.grid, {transform: [{translateX: shake}]}]}>
// //           {lv?.options.map((v, i) => {
// //             const l = LETTERS[i];
// //             const mine = pick === l;
// //             const border = mine ? (ok === true ? '#3aa655' : ok === false ? '#d9534f' : '#f0a030') : '#e3b887';
// //             return (
// //               <TouchableOpacity key={l} disabled={busy || ok === true} onPress={() => choose(l)}
// //                 style={[s.opt, {borderColor: border}]}>
// //                 <View style={s.badge}><Text style={s.bt}>{l}</Text></View>
// //                 <Fish w={130} v={v} shadow />
// //               </TouchableOpacity>
// //             );
// //           })}
// //         </Animated.View>

// //         {!lv && !!note && (
// //           <TouchableOpacity onPress={load}><Text style={s.retry}>Tap to retry</Text></TouchableOpacity>
// //         )}
// //         {!!note && <Text style={s.note}>{note}</Text>}
// //       </View>
// //     </Stage>
// //   );
// // }

// // const s = StyleSheet.create({
// //   wall: {flex: 1, alignItems: 'center', paddingTop: 34, paddingHorizontal: 12},
// //   top: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'},
// //   round: {width: 34, height: 34, borderRadius: 17, backgroundColor: '#ffe27a', borderWidth: 2, borderColor: INK, alignItems: 'center', justifyContent: 'center'},
// //   sign: {backgroundColor: '#a8601f', borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 4},
// //   signt: {fontFamily: F, fontSize: 22, fontWeight: 'bold', color: '#fff'},
// //   pill: {flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', borderRadius: 16, height: 30, paddingHorizontal: 10, borderWidth: 2, borderColor: '#e6e6e6'},
// //   pt: {fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK},
// //   q: {backgroundColor: CREAM, borderRadius: 30, paddingHorizontal: 22, paddingVertical: 10, marginTop: 18},
// //   qt: {fontFamily: F, fontSize: 24, fontWeight: 'bold', color: NAVY, textAlign: 'center'},
// //   card: {width: '100%', maxWidth: 340, height: 220, marginTop: 14, backgroundColor: CREAM, borderRadius: 26, borderWidth: 2, borderStyle: 'dashed', borderColor: '#d9a062', alignItems: 'center', justifyContent: 'center'},
// //   grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 22, width: '100%', maxWidth: 340},
// //   opt: {width: '47%', height: 120, backgroundColor: CREAM, borderRadius: 20, borderWidth: 3, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center'},
// //   badge: {position: 'absolute', top: -12, left: -6, width: 32, height: 32, borderRadius: 16, backgroundColor: '#ffcf4a', borderWidth: 3, borderColor: '#b8742f', alignItems: 'center', justifyContent: 'center'},
// //   bt: {fontFamily: F, fontWeight: 'bold', fontSize: 16, color: NAVY},
// //   note: {position: 'absolute', bottom: 16, fontFamily: F, fontSize: 17, fontWeight: 'bold', color: '#c0392b'},
// //   retry: {marginTop: 12, fontFamily: F, fontSize: 18, fontWeight: 'bold', color: '#1d4fb3', textDecorationLine: 'underline'},
// // });
// // src/screens/braintwist/Btlevel32screen.tsx - level 32: find the correct shadow (bird)
// import React, {useEffect, useRef, useState} from 'react';
// import {View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView, useWindowDimensions} from 'react-native';
// import {F, INK, Stage} from './BTShared';
// import {Icon} from './Art';
// import {Bird} from './Btlevel32art';
// import * as api from './Btlevel32api';

// const SKY = '#9fc6ea', NAVY = '#10245e', CREAM = '#fbf6e9', WOOD = '#e9b575';
// const LETTERS: api.Letter[] = ['A', 'B', 'C', 'D'];

// /* cozy room behind everything (window, lamp, shelf, books, plant) */
// const Room = ({wide}: {wide: boolean}) => (
//   <View pointerEvents="none" style={StyleSheet.absoluteFill}>
//     <View style={{position: 'absolute', left: 0, right: 0, top: 0, height: '62%', backgroundColor: 'rgba(255,255,255,0.18)'}} />
//     {/* lamp */}
//     <View style={{position: 'absolute', top: 0, right: wide ? '16%' : 70, alignItems: 'center'}}>
//       <View style={{width: 2, height: 38, backgroundColor: '#555'}} />
//       <View style={{width: 64, height: 24, borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: '#2f7fd1'}} />
//       <View style={{width: 26, height: 10, borderBottomLeftRadius: 13, borderBottomRightRadius: 13, backgroundColor: '#ffe9a8'}} />
//     </View>
//     {wide && (
//       <>
//         {/* window */}
//         <View style={{position: 'absolute', left: -4, top: 80, width: 92, height: 210, backgroundColor: '#f0b878', borderWidth: 5, borderColor: '#e2a35e', borderRadius: 4, overflow: 'hidden'}}>
//           <View style={{flex: 1, backgroundColor: '#8fd3f6', overflow: 'hidden'}}>
//             <View style={{position: 'absolute', top: 30, left: 12, width: 50, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.9)'}} />
//             <View style={{position: 'absolute', left: 6, bottom: -14, width: 46, height: 62, borderRadius: 30, backgroundColor: '#7bc65a'}} />
//             <View style={{position: 'absolute', left: 40, bottom: -20, width: 50, height: 70, borderRadius: 35, backgroundColor: '#62b24a'}} />
//           </View>
//         </View>
//         {/* sun frames */}
//         <View style={{position: 'absolute', right: '8%', top: 40, width: 62, height: 70, backgroundColor: '#cfe6f3', borderWidth: 3, borderColor: '#bcd7e8', alignItems: 'center', justifyContent: 'center'}}>
//           <View style={{width: 30, height: 30, borderRadius: 15, backgroundColor: '#f6a43c', borderWidth: 4, borderColor: '#f7c36a'}} />
//         </View>
//         <View style={{position: 'absolute', right: '15%', top: 130, width: 56, height: 62, backgroundColor: '#cfe6f3', borderWidth: 3, borderColor: '#bcd7e8', alignItems: 'center', justifyContent: 'center'}}>
//           <View style={{width: 26, height: 26, borderRadius: 13, backgroundColor: '#f6a43c', borderWidth: 4, borderColor: '#f7c36a'}} />
//         </View>
//         {/* bookshelf with plant */}
//         <View style={{position: 'absolute', right: 0, top: 230, width: 130, height: 150, backgroundColor: '#e0a85e', borderLeftWidth: 5, borderTopWidth: 5, borderColor: '#c98d4d'}}>
//           <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 12, borderBottomWidth: 5, borderColor: '#c98d4d'}}>
//             {[[14, 60, '#2f95d6'], [14, 56, '#f6dc82'], [14, 62, '#9b6bd0']].map((b: any, i) => (
//               <View key={i} style={{width: b[0], height: b[1], backgroundColor: b[2], marginRight: 2}} />
//             ))}
//           </View>
//         </View>
//         <View style={{position: 'absolute', right: 20, top: 150, width: 64, height: 40, borderRadius: 6, backgroundColor: '#f5c63a'}} />
//         {/* books left */}
//         <View style={{position: 'absolute', left: -6, top: 330}}>
//           {[['#3f9ad6', 110], ['#e86fae', 118], ['#f2c14e', 112], ['#4b7fc4', 104]].map((b: any, i) => (
//             <View key={i} style={{width: b[1], height: 20, borderRadius: 3, backgroundColor: b[0], marginBottom: 2}} />
//           ))}
//         </View>
//       </>
//     )}
//   </View>
// );

// export default function BTLevel32Screen({playerId, hints, onExit, onComplete}: any) {
//   const {width: W, height: H} = useWindowDimensions();
//   const wide = W >= 700;
//   const cols = wide ? 4 : 2;
//   const gap = 12, pad = 14;
//   const rowW = Math.min(W, 980);
//   const optW = Math.min(230, (rowW - pad * 2 - gap * (cols - 1)) / cols);
//   const optH = optW * 0.92;
//   const mainBird = Math.max(180, Math.min(wide ? 340 : 300, W - 90, (H * 0.3) / 0.867));

//   const [lv, setLv] = useState<api.L32Start | null>(null);
//   const [pick, setPick] = useState<api.Letter | null>(null);
//   const [ok, setOk] = useState<boolean | null>(null);
//   const [note, setNote] = useState('');
//   const [busy, setBusy] = useState(false);
//   const shake = useRef(new Animated.Value(0)).current;

//   const flash = (m: string) => { setNote(m); setTimeout(() => setNote(''), 1600); };
//   const doShake = () =>
//     Animated.sequence([10, -10, 6, -6, 0].map(v =>
//       Animated.timing(shake, {toValue: v, duration: 55, useNativeDriver: true}))).start();

//   const load = () => {
//     api.start(playerId).then(setLv).catch(() => flash('Cannot load level 32'));
//   };
//   useEffect(load, []);

//   const choose = async (l: api.Letter) => {
//     if (!lv || busy || ok) return;
//     setBusy(true);
//     setPick(l);
//     try {
//       const r = await api.answer(lv.sessionId, playerId, l);
//       if (r.correct) {
//         setOk(true);
//         setTimeout(() => onComplete({...r, skipped: false}), 1000);
//       } else {
//         setOk(false);
//         doShake();
//         flash('Not quite. Try again!');
//         setTimeout(() => { setPick(null); setOk(null); }, 800);
//       }
//     } catch {
//       setPick(null);
//       flash('Network error');
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <Stage bg={SKY}>
//       <View style={{flex: 1}}>
//         <Room wide={wide} />
//         <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}} showsVerticalScrollIndicator={false}>
//           <View style={{alignItems: 'center', paddingTop: 30, paddingHorizontal: pad}}>
//             {/* top bar */}
//             <View style={s.top}>
//               <View style={{flexDirection: 'row', gap: 8}}>
//                 <TouchableOpacity onPress={onExit} style={s.round}><Icon n="home" s={20} /></TouchableOpacity>
//                 <View style={s.round}><Icon n="gear" s={20} /></View>
//               </View>
//               <View style={s.sign}>
//                 <View style={[s.leafTop, {left: -8, transform: [{rotate: '-30deg'}]}]} />
//                 <View style={[s.leafTop, {right: -8, transform: [{rotate: '30deg'}]}]} />
//                 <Text style={s.chev}>‹</Text>
//                 <Text style={s.signt}>LEVEL 32</Text>
//                 <Text style={s.chev}>›</Text>
//               </View>
//               <View style={s.pill}><Text style={s.pt}>{hints}</Text><Icon n="bulb" s={22} /></View>
//             </View>

//             {/* question */}
//             <View style={s.q}><Text style={s.qt}>{lv?.question || 'Loading...'}</Text></View>

//             {/* colour bird */}
//             <View style={[s.card, {width: Math.min(mainBird + 80, rowW - pad * 2)}]}>
//               {lv && <Bird w={mainBird} v={lv.target} />}
//             </View>
//           </View>

//           {/* shadow options on the wooden shelf */}
//           <View style={s.wood}>
//             <View style={s.pinkStrip} />
//             <Animated.View style={[s.grid, {width: rowW - pad * 2, gap, transform: [{translateX: shake}]}]}>
//               {lv?.options.map((v, i) => {
//                 const l = LETTERS[i];
//                 const mine = pick === l;
//                 const border = mine ? (ok === true ? '#3aa655' : ok === false ? '#d9534f' : '#f0a030') : '#e0b88a';
//                 return (
//                   <TouchableOpacity key={l} disabled={busy || ok === true} onPress={() => choose(l)}
//                     style={[s.opt, {width: optW, height: optH, borderColor: border}]}>
//                     <View style={s.badge}><Text style={s.bt}>{l}</Text></View>
//                     <Bird w={optW * 0.84} v={v} shadow />
//                   </TouchableOpacity>
//                 );
//               })}
//             </Animated.View>
//             {!lv && !!note && (
//               <TouchableOpacity onPress={load}><Text style={s.retry}>Tap to retry</Text></TouchableOpacity>
//             )}
//             {!!note && <Text style={s.note}>{note}</Text>}
//           </View>
//         </ScrollView>
//       </View>
//     </Stage>
//   );
// }

// const s = StyleSheet.create({
//   top: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 980},
//   round: {width: 46, height: 46, borderRadius: 23, backgroundColor: '#ffd24a', borderWidth: 3, borderColor: '#c98a1a', alignItems: 'center', justifyContent: 'center'},
//   sign: {flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#a8601f', borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 4},
//   leafTop: {position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: '#5fae3a'},
//   chev: {fontFamily: F, fontSize: 24, fontWeight: 'bold', color: '#ffc83d'},
//   signt: {fontFamily: F, fontSize: 24, fontWeight: 'bold', color: '#fff'},
//   pill: {flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', borderRadius: 18, height: 34, paddingHorizontal: 12, borderWidth: 2, borderColor: '#e6e6e6'},
//   pt: {fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK},
//   q: {backgroundColor: CREAM, borderRadius: 34, paddingHorizontal: 30, paddingVertical: 10, marginTop: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: '#d9a062'},
//   qt: {fontFamily: F, fontSize: 26, fontWeight: 'bold', color: NAVY, textAlign: 'center'},
//   card: {marginTop: 14, backgroundColor: CREAM, borderRadius: 30, borderWidth: 2, borderStyle: 'dashed', borderColor: '#d9a062', alignItems: 'center', justifyContent: 'center', paddingVertical: 14},
//   wood: {marginTop: 18, backgroundColor: WOOD, paddingTop: 34, paddingBottom: 22, alignItems: 'center'},
//   pinkStrip: {position: 'absolute', top: 0, left: 0, right: 0, height: 12, backgroundColor: '#e8b8b0'},
//   grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},
//   opt: {backgroundColor: CREAM, borderRadius: 22, borderWidth: 3, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center'},
//   badge: {position: 'absolute', top: -16, left: -6, width: 38, height: 38, borderRadius: 19, backgroundColor: '#ffd24a', borderWidth: 3, borderColor: '#b8742f', alignItems: 'center', justifyContent: 'center'},
//   bt: {fontFamily: F, fontWeight: 'bold', fontSize: 20, color: NAVY},
//   note: {marginTop: 12, fontFamily: F, fontSize: 18, fontWeight: 'bold', color: '#c0392b'},
//   retry: {marginTop: 12, fontFamily: F, fontSize: 18, fontWeight: 'bold', color: '#1d4fb3', textDecorationLine: 'underline'},
// });
// src/screens/braintwist/Btlevel32screen.tsx
// Level 32 - drag the coloured bird onto its matching shadow. Mat at the bottom: hint / video / skip.
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, Pressable, Animated, PanResponder, StyleSheet, useWindowDimensions} from 'react-native';
import {F, INK, Stage, Coin} from './BTShared';
import {Icon} from './Art';
import {Bird} from './Btlevel32art';
import * as api from './Btlevel32api';
import * as mainApi from './api';

const SKY = '#9fc6ea', NAVY = '#10245e', CREAM = '#fbf6e9', WOOD = '#e9b575';
const HINT_COST = 25, SKIP_COST = 50; // same as the backend
const LETTERS: api.Letter[] = ['A', 'B', 'C', 'D'];

const measure = (ref: any) =>
  new Promise<any>(res => {
    if (!ref) return res(null);
    ref.measureInWindow((x: number, y: number, w: number, h: number) => res({x, y, w, h}));
  });

/* cozy room behind everything */
const Room = ({wide}: {wide: boolean}) => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <View style={{position: 'absolute', left: 0, right: 0, top: 0, height: '60%', backgroundColor: 'rgba(255,255,255,0.18)'}} />
    <View style={{position: 'absolute', top: 0, right: wide ? '16%' : 56, alignItems: 'center'}}>
      <View style={{width: 2, height: 34, backgroundColor: '#555'}} />
      <View style={{width: 60, height: 22, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#2f7fd1'}} />
      <View style={{width: 24, height: 9, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, backgroundColor: '#ffe9a8'}} />
    </View>
    {/* window */}
    <View style={{position: 'absolute', left: -4, top: 120, width: 82, height: 190, backgroundColor: '#f0b878', borderWidth: 5, borderColor: '#e2a35e', borderRadius: 4, overflow: 'hidden'}}>
      <View style={{flex: 1, backgroundColor: '#8fd3f6', overflow: 'hidden'}}>
        <View style={{position: 'absolute', top: 26, left: 10, width: 46, height: 15, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.9)'}} />
        <View style={{position: 'absolute', left: 4, bottom: -14, width: 42, height: 58, borderRadius: 30, backgroundColor: '#7bc65a'}} />
        <View style={{position: 'absolute', left: 34, bottom: -20, width: 46, height: 66, borderRadius: 33, backgroundColor: '#62b24a'}} />
      </View>
    </View>
    {/* bookshelf */}
    <View style={{position: 'absolute', right: 0, top: 210, width: wide ? 130 : 66, height: 150, backgroundColor: '#e0a85e', borderLeftWidth: 5, borderTopWidth: 5, borderColor: '#c98d4d'}}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 8, borderBottomWidth: 5, borderColor: '#c98d4d'}}>
        {[[12, 56, '#2f95d6'], [12, 52, '#f6dc82'], [12, 58, '#9b6bd0']].map((b: any, i) => (
          <View key={i} style={{width: b[0], height: b[1], backgroundColor: b[2], marginRight: 2}} />
        ))}
      </View>
    </View>
    {wide && (
      <>
        <View style={{position: 'absolute', right: '8%', top: 40, width: 62, height: 70, backgroundColor: '#cfe6f3', borderWidth: 3, borderColor: '#bcd7e8', alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 30, height: 30, borderRadius: 15, backgroundColor: '#f6a43c', borderWidth: 4, borderColor: '#f7c36a'}} />
        </View>
      </>
    )}
  </View>
);

export default function BTLevel32Screen({playerId, hints, setHints, onExit, onComplete}: any) {
  const {width: W, height: H} = useWindowDimensions();
  const wide = W >= 700;
  const gap = 12, pad = 14;
  const rowW = Math.min(W, 980);
  const cols = wide ? 4 : 2;
  const optW = Math.min(230, (rowW - pad * 2 - gap * (cols - 1)) / cols);

  const topH = 80, bannerH = 60, matH = 132, woodPad = 30;
  const R = Math.max(250, H - topH - bannerH - matH - 70);
  const cardH = wide ? R * 0.6 : R * 0.42;
  const optAreaH = R - cardH;
  const optH = Math.max(86, Math.min(200, wide ? optAreaH - woodPad : (optAreaH - woodPad - gap) / 2));
  const mainBird = Math.max(150, Math.min(wide ? 340 : 300, W - 90, (cardH - 20) / 0.867));
  const optBird = Math.min(optW * 0.84, (optH - 12) / 0.867);

  const [lv, setLv] = useState<api.L32Start | null>(null);
  const [pick, setPick] = useState<api.Letter | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  const sc = useRef(new Animated.Value(1)).current;
  const optRefs = useRef<any[]>([]);
  const birdRef = useRef<any>(null);
  const startRect = useRef<any>(null);
  const latest = useRef<any>({});
  const bal = Number(hints) || 0;

  const flash = (m: string) => { setNote(m); setTimeout(() => setNote(''), 1600); };
  const doShake = () =>
    Animated.sequence([10, -10, 6, -6, 0].map(v =>
      Animated.timing(shake, {toValue: v, duration: 55, useNativeDriver: true}))).start();
  const back = () =>
    Animated.parallel([
      Animated.spring(pan, {toValue: {x: 0, y: 0}, useNativeDriver: false}),
      Animated.spring(sc, {toValue: 1, useNativeDriver: false}),
    ]).start();

  const load = () => {
    api.start(playerId).then(setLv).catch(() => flash('Cannot load level 32'));
  };
  useEffect(load, []);

  // the bird was dropped on option "l"
  const choose = async (l: api.Letter) => {
    if (!lv || busy || ok) { back(); return; }
    setBusy(true);
    setPick(l);
    try {
      const r = await api.answer(lv.sessionId, playerId, l);
      if (r.correct) {
        setOk(true);
        setTimeout(() => onComplete({...r, skipped: false}), 1000);
      } else {
        setOk(false);
        doShake();
        flash('Not quite. Try again!');
        setTimeout(() => { setPick(null); setOk(null); back(); }, 800);
      }
    } catch {
      setPick(null);
      flash('Network error');
      back();
    } finally {
      setBusy(false);
    }
  };
  latest.current = {lv, busy, ok, hidden, choose};

  const drop = async (px: number, py: number) => {
    const L = latest.current;
    let hit = -1, rect: any = null;
    for (let i = 0; i < 4; i++) {
      if (L.hidden.includes(LETTERS[i])) continue;
      const r = await measure(optRefs.current[i]);
      if (r && px >= r.x - 8 && px <= r.x + r.w + 8 && py >= r.y - 8 && py <= r.y + r.h + 8) { hit = i; rect = r; break; }
    }
    if (hit < 0) { back(); return; }
    const s0 = startRect.current;
    if (s0 && rect) {
      Animated.timing(pan, {
        toValue: {x: rect.x + rect.w / 2 - (s0.x + s0.w / 2), y: rect.y + rect.h / 2 - (s0.y + s0.h / 2)},
        duration: 150, useNativeDriver: false,
      }).start();
    }
    L.choose(LETTERS[hit]);
  };

  const pr = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !!latest.current.lv && !latest.current.busy && !latest.current.ok,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: async () => {
      Animated.spring(sc, {toValue: 0.7, useNativeDriver: false}).start();
      startRect.current = await measure(birdRef.current);
    },
    onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver: false}),
    onPanResponderRelease: (_, g) => drop(g.moveX, g.moveY),
    onPanResponderTerminate: () => back(),
  })).current;

  /* ---- hint / video / skip ---- */
  const hint = async () => {
    if (busy || ok || !lv) return;
    if (bal < HINT_COST) { flash('Need ' + HINT_COST + ' hints. You have ' + bal + '.'); return; }
    if (hidden.length >= 2) { flash('Two shadows are left. Pick one!'); return; }
    setBusy(true);
    try {
      const r = await api.hint(lv.sessionId, playerId, hidden);
      setHints && setHints(r.hints);
      setHidden(h => [...h, r.remove]);
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : e?.message || 'Network error');
    } finally { setBusy(false); }
  };
  const video = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const r = await (mainApi as any).reward(playerId, 'video');
      setHints && setHints(r.hints);
    } catch {} finally { setBusy(false); }
  };
  const skip = async () => {
    if (busy || ok || !lv) return;
    if (bal < SKIP_COST) { flash('Need ' + SKIP_COST + ' hints. You have ' + bal + '.'); return; }
    setBusy(true);
    try {
      const r = await api.skip(lv.sessionId, playerId);
      setHints && setHints(r.hints);
      setOk(true);
      setTimeout(() => onComplete({success: true, skipped: true, attempts: 1}), 700);
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : e?.message || 'Network error');
    } finally { setBusy(false); }
  };

  return (
    <Stage bg={SKY}>
      <View style={{flex: 1}}>
        <Room wide={wide} />

        {/* top part: sits above the shelf so the dragged bird is never hidden */}
        <View style={{alignItems: 'center', paddingTop: 30, paddingHorizontal: pad, zIndex: 10, elevation: 10}}>
          <View style={s.top}>
            <View style={{flexDirection: 'row', gap: 8}}>
              <TouchableOpacity onPress={onExit} style={s.round}><Icon n="home" s={20} /></TouchableOpacity>
              <View style={s.round}><Icon n="gear" s={20} /></View>
            </View>
            <View style={s.sign}>
              <View style={[s.leafTop, {left: -8, transform: [{rotate: '-30deg'}]}]} />
              <View style={[s.leafTop, {right: -8, transform: [{rotate: '30deg'}]}]} />
              <Text style={s.chev}>‹</Text>
              <Text style={s.signt}>LEVEL 32</Text>
              <Text style={s.chev}>›</Text>
            </View>
            <View style={s.pill}><Text style={s.pt}>{hints}</Text><Icon n="bulb" s={22} /></View>
          </View>

          <View style={s.q}><Text style={s.qt}>{lv?.question || 'Loading...'}</Text></View>

          <View style={[s.card, {width: Math.min(mainBird + 80, rowW - pad * 2), height: cardH}]}>
            {lv && (
              <Animated.View ref={birdRef} {...pr.panHandlers}
                style={{zIndex: 20, elevation: 20, transform: [...pan.getTranslateTransform(), {scale: sc}]}}>
                <Bird w={mainBird} v={lv.target} />
              </Animated.View>
            )}
          </View>
          {lv && !ok && <Text style={s.dragHint}>Drag the bird onto its shadow</Text>}
        </View>

        <View style={{flex: 1}} />

        {/* shelf with the shadows + mat with the buttons */}
        <View style={s.wood}>
          <View style={s.pinkStrip} />
          <Animated.View style={[s.grid, {width: rowW - pad * 2, gap, transform: [{translateX: shake}]}]}>
            {lv?.options.map((v, i) => {
              const l = LETTERS[i];
              const mine = pick === l;
              const gone = hidden.includes(l);
              const border = mine ? (ok === true ? '#3aa655' : ok === false ? '#d9534f' : '#f0a030') : '#e0b88a';
              return (
                <View key={l} ref={(r: any) => { optRefs.current[i] = r; }} collapsable={false}
                  style={[s.opt, {width: optW, height: optH, borderColor: border, opacity: gone ? 0.2 : 1}]}>
                  <View style={s.badge}><Text style={s.bt}>{l}</Text></View>
                  <Bird w={optBird} v={v} shadow />
                </View>
              );
            })}
          </Animated.View>

          <View style={s.mat}>
            <View style={s.acol}>
              <Pressable onPress={hint} style={[s.btn, {backgroundColor: '#a8e22a', borderColor: '#d6f58a'}]}><Icon n="search" s={32} /></Pressable>
              <View style={s.lblRow}><Icon n="bulb" s={14} /><Text style={s.lbl}>{HINT_COST}</Text></View>
            </View>
            <View style={s.acol}>
              <Pressable onPress={video} style={[s.btn, {backgroundColor: '#f3efe2', borderColor: '#fff'}]}><Icon n="film" s={38} /></Pressable>
              <View style={s.lblRow}><Coin s={12} /><Text style={s.lbl}>+75</Text></View>
            </View>
            <View style={s.acol}>
              <Pressable onPress={skip} style={[s.btn, {backgroundColor: '#f0484f', borderColor: '#fff'}]}><Icon n="play" s={34} /></Pressable>
              <View style={s.lblRow}><Icon n="bulb" s={14} /><Text style={s.lbl}>{SKIP_COST}</Text></View>
            </View>
          </View>
          {!!note && <Text style={s.note}>{note}</Text>}
          {!lv && !!note && (
            <TouchableOpacity onPress={load}><Text style={s.retry}>Tap to retry</Text></TouchableOpacity>
          )}
        </View>
      </View>
    </Stage>
  );
}

const s = StyleSheet.create({
  top: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 980},
  round: {width: 46, height: 46, borderRadius: 23, backgroundColor: '#ffd24a', borderWidth: 3, borderColor: '#c98a1a', alignItems: 'center', justifyContent: 'center'},
  sign: {flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#a8601f', borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 4},
  leafTop: {position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: '#5fae3a'},
  chev: {fontFamily: F, fontSize: 24, fontWeight: 'bold', color: '#ffc83d'},
  signt: {fontFamily: F, fontSize: 24, fontWeight: 'bold', color: '#fff'},
  pill: {flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', borderRadius: 18, height: 34, paddingHorizontal: 12, borderWidth: 2, borderColor: '#e6e6e6'},
  pt: {fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK},
  q: {backgroundColor: CREAM, borderRadius: 34, paddingHorizontal: 30, paddingVertical: 10, marginTop: 14, borderWidth: 2, borderStyle: 'dashed', borderColor: '#d9a062'},
  qt: {fontFamily: F, fontSize: 24, fontWeight: 'bold', color: NAVY, textAlign: 'center'},
  card: {marginTop: 12, backgroundColor: CREAM, borderRadius: 30, borderWidth: 2, borderStyle: 'dashed', borderColor: '#d9a062', alignItems: 'center', justifyContent: 'center'},
  dragHint: {marginTop: 6, fontFamily: F, fontSize: 15, fontWeight: 'bold', color: NAVY, opacity: 0.7},
  wood: {backgroundColor: WOOD, paddingTop: 30, paddingBottom: 14, alignItems: 'center', zIndex: 1},
  pinkStrip: {position: 'absolute', top: 0, left: 0, right: 0, height: 12, backgroundColor: '#e8b8b0'},
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},
  opt: {backgroundColor: CREAM, borderRadius: 22, borderWidth: 3, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center'},
  badge: {position: 'absolute', top: -16, left: -6, width: 38, height: 38, borderRadius: 19, backgroundColor: '#ffd24a', borderWidth: 3, borderColor: '#b8742f', alignItems: 'center', justifyContent: 'center'},
  bt: {fontFamily: F, fontWeight: 'bold', fontSize: 20, color: NAVY},
  mat: {flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 30, marginTop: 16, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 60, borderWidth: 10, borderColor: 'rgba(143,190,235,0.6)', backgroundColor: '#f6e8cc'},
  acol: {alignItems: 'center'},
  btn: {width: 62, height: 62, borderRadius: 31, borderWidth: 4, alignItems: 'center', justifyContent: 'center', elevation: 6},
  lblRow: {flexDirection: 'row', alignItems: 'center', gap: 4, height: 24, marginTop: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#6b4423'},
  lbl: {fontFamily: F, fontSize: 15, fontWeight: 'bold', color: '#fff'},
  note: {marginTop: 8, fontFamily: F, fontSize: 17, fontWeight: 'bold', color: '#c0392b'},
  retry: {marginTop: 6, fontFamily: F, fontSize: 18, fontWeight: 'bold', color: '#1d4fb3', textDecorationLine: 'underline'},
});
