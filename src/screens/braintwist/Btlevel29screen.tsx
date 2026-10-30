// // // Btlevel29screen.tsx
// // import React, { useEffect, useState, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   StyleSheet,
// //   ActivityIndicator,
// //   Modal,
// //   Alert,
// //   KeyboardAvoidingView,
// //   Platform,
// // } from 'react-native';
// // import { ParkingRow } from './Btlevel29art';
// // import {
// //   fetchLevel29,
// //   submitLevel29Answer,
// //   fetchLevel29Hint,
// //   skipLevel29,
// //   Level29Puzzle,
// // } from './Btlevel29api';

// // interface Props {
// //   navigation?: any;
// //   userId?: string;
// //   hints?: number;                          // bulb count (95)
// //   onHintsChange?: (value: number) => void; // update bulb count in parent
// //   onNextLevel?: (level: number) => void;   // go to level 30
// // }

// // const Btlevel29screen: React.FC<Props> = ({
// //   navigation,
// //   userId = 'guest',
// //   hints = 95,
// //   onHintsChange,
// //   onNextLevel,
// // }) => {
// //   const [puzzle, setPuzzle] = useState<Level29Puzzle | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [answer, setAnswer] = useState('');
// //   const [bulbs, setBulbs] = useState(hints);
// //   const [hintText, setHintText] = useState('');
// //   const [showHint, setShowHint] = useState(false);
// //   const [message, setMessage] = useState('');
// //   const [solved, setSolved] = useState(false);

// //   const updateBulbs = useCallback(
// //     (v: number) => {
// //       setBulbs(v);
// //       onHintsChange?.(v);
// //     },
// //     [onHintsChange]
// //   );

// //   const goNext = (level: number) => {
// //     if (onNextLevel) onNextLevel(level);
// //     else navigation?.navigate?.(`BTLevel${level}`);
// //   };

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const data = await fetchLevel29(userId);
// //         setPuzzle(data);
// //         setSolved(data.progress.solved);
// //       } catch (e) {
// //         setError('Server connect aagala. Marubadi try pannunga.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();
// //   }, [userId]);

// //   const handleCheck = async () => {
// //     if (!answer.trim()) return;
// //     try {
// //       const res = await submitLevel29Answer(userId, answer.trim());
// //       setMessage(res.message);
// //       if (res.correct) {
// //         setSolved(true);
// //         setTimeout(() => goNext(res.nextLevel ?? 30), 1200);
// //       }
// //     } catch {
// //       setMessage('Network error!');
// //     }
// //   };

// //   const handleHint = async () => {
// //     if (!puzzle) return;
// //     if (bulbs < puzzle.hintCost) {
// //       Alert.alert('Not enough bulbs', 'Video paathu coins sambaadinga!');
// //       return;
// //     }
// //     try {
// //       const res = await fetchLevel29Hint(userId);
// //       updateBulbs(bulbs - res.cost);
// //       setHintText(res.hint);
// //       setShowHint(true);
// //     } catch {
// //       setMessage('Hint load aagala');
// //     }
// //   };

// //   const handleVideo = () => {
// //     if (!puzzle) return;
// //     // TODO: ad SDK inga connect pannunga; reward kudukkum bodhu:
// //     updateBulbs(bulbs + puzzle.videoReward);
// //   };

// //   const handleSkip = async () => {
// //     if (!puzzle) return;
// //     if (bulbs < puzzle.skipCost) {
// //       Alert.alert('Not enough bulbs', 'Skip panna 50 bulbs venum.');
// //       return;
// //     }
// //     try {
// //       const res = await skipLevel29(userId);
// //       updateBulbs(bulbs - res.cost);
// //       goNext(res.nextLevel);
// //     } catch {
// //       setMessage('Skip aagala');
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <View style={styles.center}>
// //         <ActivityIndicator size="large" color="#F28C28" />
// //       </View>
// //     );
// //   }

// //   if (error || !puzzle) {
// //     return (
// //       <View style={styles.center}>
// //         <Text style={styles.errorText}>{error || 'No data'}</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <KeyboardAvoidingView
// //       style={styles.container}
// //       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
// //     >
// //       {/* Top bar */}
// //       <View style={styles.topBar}>
// //         <View style={styles.topLeft}>
// //           <TouchableOpacity style={styles.roundBtn} onPress={() => navigation?.goBack?.()}>
// //             <Text style={styles.roundIcon}>🏠</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.roundBtn}>
// //             <Text style={styles.roundIcon}>⚙️</Text>
// //           </TouchableOpacity>
// //         </View>
// //         <View style={styles.levelBadge}>
// //           <Text style={styles.levelText}>LEVEL 29</Text>
// //         </View>
// //         <View style={styles.bulbPill}>
// //           <Text style={styles.bulbText}>{bulbs}</Text>
// //           <Text style={{ fontSize: 18 }}>💡</Text>
// //         </View>
// //       </View>

// //       {/* Notebook card */}
// //       <View style={styles.card}>
// //         <View style={styles.questionPill}>
// //           <Text style={styles.questionText}>{puzzle.question}</Text>
// //         </View>

// //         <ParkingRow spots={puzzle.spots} />

// //         <View style={styles.answerRow}>
// //           <TextInput
// //             style={styles.input}
// //             value={answer}
// //             onChangeText={(t) => setAnswer(t.replace(/[^0-9]/g, '').slice(0, 3))}
// //             keyboardType="number-pad"
// //             placeholder="??"
// //             placeholderTextColor="#B9B2A0"
// //             editable={!solved}
// //           />
// //           <TouchableOpacity
// //             style={[styles.checkBtn, solved && { opacity: 0.5 }]}
// //             onPress={handleCheck}
// //             disabled={solved}
// //           >
// //             <Text style={styles.checkText}>CHECK</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {!!message && (
// //           <Text style={[styles.message, solved && { color: '#2E9E4F' }]}>{message}</Text>
// //         )}
// //       </View>

// //       {/* Bottom bar: hint / video / skip */}
// //       <View style={styles.bottomBar}>
// //         <View style={styles.actionWrap}>
// //           <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#7CC043' }]} onPress={handleHint}>
// //             <Text style={styles.actionIcon}>🔍</Text>
// //           </TouchableOpacity>
// //           <View style={styles.costPill}>
// //             <Text style={styles.costText}>💡 {puzzle.hintCost}</Text>
// //           </View>
// //         </View>

// //         <View style={styles.actionWrap}>
// //           <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fff' }]} onPress={handleVideo}>
// //             <Text style={styles.actionIcon}>▶️</Text>
// //           </TouchableOpacity>
// //           <View style={styles.costPill}>
// //             <Text style={styles.costText}>🪙 +{puzzle.videoReward}</Text>
// //           </View>
// //         </View>

// //         <View style={styles.actionWrap}>
// //           <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F0345B' }]} onPress={handleSkip}>
// //             <Text style={styles.actionIcon}>⏩</Text>
// //           </TouchableOpacity>
// //           <View style={styles.costPill}>
// //             <Text style={styles.costText}>💡 {puzzle.skipCost}</Text>
// //           </View>
// //         </View>
// //       </View>

// //       {/* Hint modal */}
// //       <Modal visible={showHint} transparent animationType="fade" onRequestClose={() => setShowHint(false)}>
// //         <View style={styles.modalBg}>
// //           <View style={styles.modalCard}>
// //             <Text style={styles.modalTitle}>CLUE</Text>
// //             <Text style={styles.modalText}>{hintText}</Text>
// //             <TouchableOpacity style={styles.checkBtn} onPress={() => setShowHint(false)}>
// //               <Text style={styles.checkText}>OK</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>
// //     </KeyboardAvoidingView>
// //   );
// // };

// // export default Btlevel29screen;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#8EC9F5', paddingTop: 40, paddingHorizontal: 14 },
// //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#8EC9F5' },
// //   errorText: { fontSize: 16, color: '#1F2A5C', fontWeight: '700' },

// //   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
// //   topLeft: { flexDirection: 'row', gap: 8 },
// //   roundBtn: {
// //     width: 42,
// //     height: 42,
// //     borderRadius: 21,
// //     backgroundColor: '#FFD43B',
// //     borderWidth: 2,
// //     borderColor: '#C98A12',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   roundIcon: { fontSize: 18 },
// //   levelBadge: {
// //     backgroundColor: '#C8742B',
// //     paddingHorizontal: 18,
// //     paddingVertical: 8,
// //     borderRadius: 18,
// //     borderWidth: 2,
// //     borderColor: '#A85A1C',
// //   },
// //   levelText: { color: '#fff', fontSize: 20, fontWeight: '900' },
// //   bulbPill: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 6,
// //     backgroundColor: '#fff',
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 20,
// //   },
// //   bulbText: { fontSize: 18, fontWeight: '800', color: '#111' },

// //   card: {
// //     marginTop: 22,
// //     backgroundColor: '#FBF4E4',
// //     borderRadius: 14,
// //     padding: 16,
// //     borderTopWidth: 10,
// //     borderTopColor: '#E9DDC2',
// //   },
// //   questionPill: {
// //     alignSelf: 'center',
// //     backgroundColor: '#FFF0B8',
// //     borderWidth: 2,
// //     borderColor: '#F3C14B',
// //     borderRadius: 24,
// //     paddingHorizontal: 18,
// //     paddingVertical: 8,
// //   },
// //   questionText: { fontSize: 17, fontWeight: '800', color: '#1F2A5C', textAlign: 'center' },

// //   answerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 18 },
// //   input: {
// //     width: 90,
// //     height: 48,
// //     borderWidth: 3,
// //     borderColor: '#F3C14B',
// //     borderRadius: 12,
// //     backgroundColor: '#fff',
// //     textAlign: 'center',
// //     fontSize: 24,
// //     fontWeight: '800',
// //     color: '#1F2A5C',
// //   },
// //   checkBtn: {
// //     backgroundColor: '#7CC043',
// //     paddingHorizontal: 22,
// //     paddingVertical: 12,
// //     borderRadius: 14,
// //   },
// //   checkText: { color: '#fff', fontWeight: '900', fontSize: 16 },
// //   message: { textAlign: 'center', marginTop: 10, fontWeight: '800', color: '#D8383A', fontSize: 15 },

// //   bottomBar: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     alignItems: 'flex-start',
// //     marginTop: 16,
// //     alignSelf: 'center',
// //     width: '85%',
// //     backgroundColor: '#EFE5D3',
// //     borderRadius: 40,
// //     borderWidth: 4,
// //     borderColor: '#9CCBF0',
// //     paddingVertical: 12,
// //   },
// //   actionWrap: { alignItems: 'center' },
// //   actionBtn: {
// //     width: 56,
// //     height: 56,
// //     borderRadius: 28,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     elevation: 3,
// //   },
// //   actionIcon: { fontSize: 24 },
// //   costPill: {
// //     marginTop: 6,
// //     backgroundColor: '#4A2A1A',
// //     paddingHorizontal: 10,
// //     paddingVertical: 3,
// //     borderRadius: 12,
// //   },
// //   costText: { color: '#fff', fontWeight: '800', fontSize: 14 },

// //   modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
// //   modalCard: {
// //     width: '80%',
// //     backgroundColor: '#FBF4E4',
// //     borderRadius: 18,
// //     padding: 22,
// //     alignItems: 'center',
// //     gap: 12,
// //   },
// //   modalTitle: { fontSize: 22, fontWeight: '900', color: '#C8742B' },
// //   modalText: { fontSize: 16, fontWeight: '700', color: '#1F2A5C', textAlign: 'center' },
// // });
// // Btlevel29screen.tsx
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Modal,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { ParkingRow } from './Btlevel29art';
// import {
//   startLevel29,
//   answerLevel29,
//   hintLevel29,
//   skipLevel29,
//   rewardLevel29,
//   Level29Data,
//   BASE_URL,
// } from './Btlevel29api';

// interface Props {
//   playerId: any;
//   hints: number;
//   setHints?: (v: number) => void;
//   onHints?: (v: number) => void;
//   onExit?: () => void;
//   onComplete?: (r: any) => void;
// }

// const NAVY = '#1F2A5C';

// const Btlevel29screen: React.FC<Props> = ({ playerId, hints, setHints, onHints, onExit, onComplete }) => {
//   const [data, setData] = useState<Level29Data | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [answer, setAnswer] = useState('');
//   const [note, setNote] = useState('');
//   const [solved, setSolved] = useState(false);
//   const [clue, setClue] = useState('');
//   const [showClue, setShowClue] = useState(false);
//   const busy = useRef(false);
//   const shake = useRef(new Animated.Value(0)).current;

//   const updateHints = (v: number) => {
//     setHints?.(v);
//     onHints?.(v);
//   };

//   const flash = (m: string) => {
//     setNote(m);
//     setTimeout(() => setNote(''), 1600);
//   };

//   const doShake = () =>
//     Animated.sequence(
//       [10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))
//     ).start();

//   const load = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const d = await startLevel29(playerId);
//       setData(d);
//       setSolved(d.progress.solved);
//       if (typeof d.hints === 'number') updateHints(d.hints);
//     } catch (e: any) {
//       console.log('[Level29] load failed:', e?.url || BASE_URL, e?.message);
//       setError('Server connect aagala.\n' + (e?.url || BASE_URL) + '\n' + (e?.message || ''));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, [playerId]);

//   const check = async () => {
//     if (!answer || solved || busy.current) return;
//     busy.current = true;
//     try {
//       const r = await answerLevel29(playerId, answer);
//       if (r.correct) {
//         setSolved(true);
//         flash('Correct! 🎉');
//         setTimeout(() => onComplete?.({ correct: true, attempts: r.attempts, skipped: false }), 1000);
//       } else {
//         doShake();
//         flash('Not quite. Try again!');
//         setAnswer('');
//       }
//     } catch (e: any) {
//       flash('Network error');
//     } finally {
//       busy.current = false;
//     }
//   };

//   const hint = async () => {
//     if (!data || busy.current || solved) return;
//     if ((Number(hints) || 0) < data.hintCost) {
//       flash(`Need ${data.hintCost} hints. You have ${Number(hints) || 0}.`);
//       return;
//     }
//     busy.current = true;
//     try {
//       const r = await hintLevel29(playerId);
//       updateHints(r.hints);
//       setClue(r.hint.text);
//       setShowClue(true);
//     } catch (e: any) {
//       flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
//     } finally {
//       busy.current = false;
//     }
//   };

//   const video = async () => {
//     if (busy.current) return;
//     busy.current = true;
//     try {
//       // TODO: ad SDK inga; reward kudukkum bodhu mattum indha call
//       const r = await rewardLevel29(playerId);
//       updateHints(r.hints);
//     } catch (e) {
//       flash('Network error');
//     } finally {
//       busy.current = false;
//     }
//   };

//   const skip = async () => {
//     if (!data || busy.current || solved) return;
//     if ((Number(hints) || 0) < data.skipCost) {
//       flash(`Need ${data.skipCost} hints. You have ${Number(hints) || 0}.`);
//       return;
//     }
//     busy.current = true;
//     try {
//       const r = await skipLevel29(playerId);
//       updateHints(r.hints);
//       setSolved(true);
//       onComplete?.({ skipped: true, attempts: r.attempts });
//     } catch (e: any) {
//       flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
//     } finally {
//       busy.current = false;
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#F28C28" />
//       </View>
//     );
//   }

//   if (error || !data) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>{error || 'No data'}</Text>
//         <TouchableOpacity style={[styles.checkBtn, { marginTop: 16 }]} onPress={load}>
//           <Text style={styles.checkText}>RETRY</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.checkBtn, { marginTop: 10, backgroundColor: '#F28C28' }]} onPress={onExit}>
//           <Text style={styles.checkText}>HOME</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//       <View style={styles.topBar}>
//         <View style={styles.topLeft}>
//           <TouchableOpacity style={styles.roundBtn} onPress={onExit}>
//             <Text style={styles.roundIcon}>🏠</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.roundBtn}>
//             <Text style={styles.roundIcon}>⚙️</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.levelBadge}>
//           <Text style={styles.levelText}>LEVEL 29</Text>
//         </View>
//         <View style={styles.bulbPill}>
//           <Text style={styles.bulbText}>{Number(hints) || 0}</Text>
//           <Text style={{ fontSize: 18 }}>💡</Text>
//         </View>
//       </View>

//       <Animated.View style={[styles.card, { transform: [{ translateX: shake }] }]}>
//         <View style={styles.questionPill}>
//           <Text style={styles.questionText}>{data.question}</Text>
//         </View>

//         <ParkingRow spots={data.spots} />

//         <View style={styles.answerRow}>
//           <TextInput
//             style={styles.input}
//             value={answer}
//             onChangeText={(t) => setAnswer(t.replace(/[^0-9]/g, '').slice(0, 3))}
//             keyboardType="number-pad"
//             placeholder="??"
//             placeholderTextColor="#B9B2A0"
//             editable={!solved}
//             onSubmitEditing={check}
//           />
//           <TouchableOpacity style={[styles.checkBtn, solved && { opacity: 0.5 }]} onPress={check} disabled={solved}>
//             <Text style={styles.checkText}>CHECK</Text>
//           </TouchableOpacity>
//         </View>

//         {!!note && <Text style={[styles.message, solved && { color: '#2E9E4F' }]}>{note}</Text>}
//       </Animated.View>

//       <View style={styles.bottomBar}>
//         <View style={styles.actionWrap}>
//           <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#7CC043' }]} onPress={hint}>
//             <Text style={styles.actionIcon}>🔍</Text>
//           </TouchableOpacity>
//           <View style={styles.costPill}>
//             <Text style={styles.costText}>💡 {data.hintCost}</Text>
//           </View>
//         </View>
//         <View style={styles.actionWrap}>
//           <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fff' }]} onPress={video}>
//             <Text style={styles.actionIcon}>▶️</Text>
//           </TouchableOpacity>
//           <View style={styles.costPill}>
//             <Text style={styles.costText}>🪙 +{data.videoReward}</Text>
//           </View>
//         </View>
//         <View style={styles.actionWrap}>
//           <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F0345B' }]} onPress={skip}>
//             <Text style={styles.actionIcon}>⏩</Text>
//           </TouchableOpacity>
//           <View style={styles.costPill}>
//             <Text style={styles.costText}>💡 {data.skipCost}</Text>
//           </View>
//         </View>
//       </View>

//       <Modal visible={showClue} transparent animationType="fade" onRequestClose={() => setShowClue(false)}>
//         <View style={styles.modalBg}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>CLUE</Text>
//             <Text style={styles.modalText}>{clue}</Text>
//             <TouchableOpacity style={styles.checkBtn} onPress={() => setShowClue(false)}>
//               <Text style={styles.checkText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// };

// export default Btlevel29screen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#8EC9F5', paddingTop: 40, paddingHorizontal: 14 },
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#8EC9F5', padding: 20 },
//   errorText: { fontSize: 15, color: NAVY, fontWeight: '700', textAlign: 'center' },

//   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   topLeft: { flexDirection: 'row', gap: 8 },
//   roundBtn: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: '#FFD43B',
//     borderWidth: 2,
//     borderColor: '#C98A12',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   roundIcon: { fontSize: 18 },
//   levelBadge: {
//     backgroundColor: '#C8742B',
//     paddingHorizontal: 18,
//     paddingVertical: 8,
//     borderRadius: 18,
//     borderWidth: 2,
//     borderColor: '#A85A1C',
//   },
//   levelText: { color: '#fff', fontSize: 20, fontWeight: '900' },
//   bulbPill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     backgroundColor: '#fff',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   bulbText: { fontSize: 18, fontWeight: '800', color: '#111' },

//   card: {
//     marginTop: 22,
//     backgroundColor: '#FBF4E4',
//     borderRadius: 14,
//     padding: 16,
//     borderTopWidth: 10,
//     borderTopColor: '#E9DDC2',
//   },
//   questionPill: {
//     alignSelf: 'center',
//     backgroundColor: '#FFF0B8',
//     borderWidth: 2,
//     borderColor: '#F3C14B',
//     borderRadius: 24,
//     paddingHorizontal: 18,
//     paddingVertical: 8,
//   },
//   questionText: { fontSize: 17, fontWeight: '800', color: NAVY, textAlign: 'center' },

//   answerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 18 },
//   input: {
//     width: 90,
//     height: 48,
//     borderWidth: 3,
//     borderColor: '#F3C14B',
//     borderRadius: 12,
//     backgroundColor: '#fff',
//     textAlign: 'center',
//     fontSize: 24,
//     fontWeight: '800',
//     color: NAVY,
//   },
//   checkBtn: { backgroundColor: '#7CC043', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 14 },
//   checkText: { color: '#fff', fontWeight: '900', fontSize: 16 },
//   message: { textAlign: 'center', marginTop: 10, fontWeight: '800', color: '#D8383A', fontSize: 15 },

//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'flex-start',
//     marginTop: 16,
//     alignSelf: 'center',
//     width: '85%',
//     backgroundColor: '#EFE5D3',
//     borderRadius: 40,
//     borderWidth: 4,
//     borderColor: '#9CCBF0',
//     paddingVertical: 12,
//   },
//   actionWrap: { alignItems: 'center' },
//   actionBtn: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 3 },
//   actionIcon: { fontSize: 24 },
//   costPill: { marginTop: 6, backgroundColor: '#4A2A1A', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
//   costText: { color: '#fff', fontWeight: '800', fontSize: 14 },

//   modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
//   modalCard: { width: '80%', backgroundColor: '#FBF4E4', borderRadius: 18, padding: 22, alignItems: 'center', gap: 12 },
//   modalTitle: { fontSize: 22, fontWeight: '900', color: '#C8742B' },
//   modalText: { fontSize: 16, fontWeight: '700', color: NAVY, textAlign: 'center' },
// });
// Btlevel29screen.tsx - Level 29 (car parking spot number) with the Level 1 cozy room theme
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Icon } from './Art';
import { F, INK, Stage, Coin, loop } from './BTShared';
import { RoomBg, ParkingRow } from './Btlevel29art';
import {
  startLevel29,
  answerLevel29,
  hintLevel29,
  skipLevel29,
  rewardLevel29,
  Level29Data,
  BASE_URL,
} from './Btlevel29api';

interface Props {
  playerId: any;
  hints: number;
  setHints?: (v: number) => void;
  onHints?: (v: number) => void;
  onExit?: () => void;
  onComplete?: (r: any) => void;
}

const NAVY = '#10245e';
const CREAM = '#fbf6e9';
const SKY = '#9fc6ea';

// round top-left buttons (home / gear)
const Round = ({ n, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={s.round}>
    <Icon n={n} s={16} />
  </TouchableOpacity>
);

// pops in on mount, squishes when pressed (same feel as Level 1 buttons)
function PopTouch({ inner, onPress, delay = 0, children }: any) {
  const e = useRef(new Animated.Value(0)).current,
    sc = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([Animated.delay(delay), Animated.spring(e, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true })]).start();
  }, []);
  const to = (v: number) => Animated.spring(sc, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.88)} onPressOut={() => to(1)}>
      <Animated.View style={[inner, { opacity: e, transform: [{ scale: Animated.multiply(e, sc) }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

const Btlevel29screen: React.FC<Props> = ({ playerId, hints, setHints, onHints, onExit, onComplete }) => {
  const [data, setData] = useState<Level29Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState('');
  const [note, setNote] = useState('');
  const [solved, setSolved] = useState(false);
  const [clue, setClue] = useState('');
  const [showClue, setShowClue] = useState(false);
  const busy = useRef(false);
  const shake = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const qIn = useRef(new Animated.Value(0)).current;

  const updateHints = (v: number) => {
    setHints?.(v);
    onHints?.(v);
  };

  const flash = (m: string) => {
    setNote(m);
    setTimeout(() => setNote(''), 1600);
  };

  const doShake = () =>
    Animated.sequence([10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const d = await startLevel29(playerId);
      setData(d);
      setSolved(d.progress.solved);
      if (typeof d.hints === 'number') updateHints(d.hints);
    } catch (e: any) {
      console.log('[Level29] load failed:', e?.url || BASE_URL, e?.message);
      setError('Server connect aagala.\n' + (e?.url || BASE_URL) + '\n' + (e?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [playerId]);

  useEffect(() => {
    loop(sway, 1800);
    loop(pulse, 900);
  }, []);

  useEffect(() => {
    if (data) Animated.spring(qIn, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
  }, [!!data]);

  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] }),
    pulseS = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.09] }),
    qY = qIn.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

  const check = async () => {
    if (!answer || solved || busy.current) return;
    busy.current = true;
    try {
      const r = await answerLevel29(playerId, answer);
      if (r.correct) {
        setSolved(true);
        flash('Correct! 🎉');
        setTimeout(() => onComplete?.({ correct: true, attempts: r.attempts, skipped: false }), 1000);
      } else {
        doShake();
        flash('Not quite. Try again!');
        setAnswer('');
      }
    } catch (e: any) {
      flash('Network error');
    } finally {
      busy.current = false;
    }
  };

  const hint = async () => {
    if (!data || busy.current || solved) return;
    if ((Number(hints) || 0) < data.hintCost) {
      flash(`Need ${data.hintCost} hints. You have ${Number(hints) || 0}.`);
      return;
    }
    busy.current = true;
    try {
      const r = await hintLevel29(playerId);
      updateHints(r.hints);
      setClue(r.hint.text);
      setShowClue(true);
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
    } finally {
      busy.current = false;
    }
  };

  const video = async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      // TODO: ad SDK inga; reward kudukkum bodhu mattum indha call
      const r = await rewardLevel29(playerId);
      updateHints(r.hints);
    } catch (e) {
      flash('Network error');
    } finally {
      busy.current = false;
    }
  };

  const skip = async () => {
    if (!data || busy.current || solved) return;
    if ((Number(hints) || 0) < data.skipCost) {
      flash(`Need ${data.skipCost} hints. You have ${Number(hints) || 0}.`);
      return;
    }
    busy.current = true;
    try {
      const r = await skipLevel29(playerId);
      updateHints(r.hints);
      setSolved(true);
      onComplete?.({ skipped: true, attempts: r.attempts });
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
    } finally {
      busy.current = false;
    }
  };

  if (loading) {
    return (
      <Stage bg={SKY}>
        <View style={s.wall}>
          <RoomBg />
          <View style={[s.board, { justifyContent: 'center' }]}>
            <ActivityIndicator size="large" color="#F28C28" />
          </View>
        </View>
      </Stage>
    );
  }

  if (error || !data) {
    return (
      <Stage bg={SKY}>
        <View style={s.wall}>
          <RoomBg />
          <View style={[s.board, { justifyContent: 'center', paddingHorizontal: 20 }]}>
            <Text style={s.errorText}>{error || 'No data'}</Text>
            <TouchableOpacity style={[s.checkBtn, { marginTop: 16 }]} onPress={load}>
              <Text style={s.checkText}>RETRY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.checkBtn, { marginTop: 10, backgroundColor: '#F28C28' }]} onPress={onExit}>
              <Text style={s.checkText}>HOME</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Stage>
    );
  }

  return (
    <Stage bg={SKY}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.wall}>
          <RoomBg />
          <View style={s.board}>
            {/* top bar */}
            <View style={s.top}>
              <View style={s.topL}>
                <Round n="home" onPress={onExit} />
                <Round n="gear" />
              </View>
              <Animated.View style={[s.signWrap, { transform: [{ rotate: swayR }] }]}>
                <View style={[s.string, { left: 26, transform: [{ rotate: '12deg' }] }]} />
                <View style={[s.string, { right: 26, transform: [{ rotate: '-12deg' }] }]} />
                <View style={s.sign}>
                  <View style={[s.leafTop, { left: -8, transform: [{ rotate: '-30deg' }] }]} />
                  <View style={[s.leafTop, { right: -8, transform: [{ rotate: '30deg' }] }]} />
                  <View style={s.dashes}>
                    <View style={[s.dash, { transform: [{ rotate: '-25deg' }] }]} />
                    <View style={[s.dash, { transform: [{ rotate: '25deg' }] }]} />
                  </View>
                  <Text style={s.signt}>LEVEL 29</Text>
                  <View style={s.dashes}>
                    <View style={[s.dash, { transform: [{ rotate: '25deg' }] }]} />
                    <View style={[s.dash, { transform: [{ rotate: '-25deg' }] }]} />
                  </View>
                </View>
              </Animated.View>
              <View style={s.topR}>
                <View style={s.bpill}>
                  <Text style={s.bpt}>{Number(hints) || 0}</Text>
                  <View style={{ position: 'absolute', right: -14, top: -10 }}>
                    <Icon n="bulb" s={34} />
                  </View>
                </View>
              </View>
            </View>

            {/* question banner */}
            <Animated.View style={[s.qWrap, { opacity: qIn, transform: [{ translateY: qY }] }]}>
              <View style={s.dashes}>
                <View style={[s.dash, { transform: [{ rotate: '-25deg' }] }]} />
                <View style={[s.dash, { transform: [{ rotate: '25deg' }] }]} />
              </View>
              <Text style={s.q}>{data.question}</Text>
              <View style={s.dashes}>
                <View style={[s.dash, { transform: [{ rotate: '25deg' }] }]} />
                <View style={[s.dash, { transform: [{ rotate: '-25deg' }] }]} />
              </View>
            </Animated.View>

            {/* parking row + answer */}
            <Animated.View style={[s.card, { transform: [{ translateX: shake }] }]}>
              <ParkingRow spots={data.spots} />
              <View style={s.answerRow}>
                <TextInput
                  style={s.input}
                  value={answer}
                  onChangeText={(t) => setAnswer(t.replace(/[^0-9]/g, '').slice(0, 3))}
                  keyboardType="number-pad"
                  placeholder="??"
                  placeholderTextColor="#B9B2A0"
                  editable={!solved}
                  onSubmitEditing={check}
                />
                <TouchableOpacity style={[s.checkBtn, solved && { opacity: 0.5 }]} onPress={check} disabled={solved}>
                  <Text style={s.checkText}>CHECK</Text>
                </TouchableOpacity>
              </View>
              {!!note && <Text style={[s.message, solved && { color: '#2E9E4F' }]}>{note}</Text>}
            </Animated.View>

            {/* hint / video / skip */}
            <View style={s.actions}>
              <View style={s.acol}>
                <Animated.View style={{ transform: [{ scale: pulseS }] }}>
                  <PopTouch inner={s.hintBtn} onPress={hint}>
                    <Icon n="search" s={34} />
                  </PopTouch>
                </Animated.View>
                <View style={s.lblRow}>
                  <Icon n="bulb" s={14} />
                  <Text style={s.lbl}>{data.hintCost}</Text>
                </View>
              </View>
              <View style={s.acol}>
                <PopTouch inner={s.videoBtn} onPress={video}>
                  <Icon n="film" s={40} />
                </PopTouch>
                <View style={s.lblRow}>
                  <Coin s={12} />
                  <Text style={s.lbl}>+{data.videoReward}</Text>
                </View>
              </View>
              <View style={s.acol}>
                <PopTouch inner={s.skipBtn} onPress={skip}>
                  <Icon n="play" s={36} />
                </PopTouch>
                <View style={s.lblRow}>
                  <Icon n="bulb" s={14} />
                  <Text style={s.lbl}>{data.skipCost}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* clue modal */}
        <Modal visible={showClue} transparent animationType="fade" onRequestClose={() => setShowClue(false)}>
          <View style={s.modalBg}>
            <View style={s.modalCard}>
              <Text style={s.modalTitle}>CLUE</Text>
              <Text style={s.modalText}>{clue}</Text>
              <TouchableOpacity style={s.checkBtn} onPress={() => setShowClue(false)}>
                <Text style={s.checkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Stage>
  );
};

export default Btlevel29screen;

const s = StyleSheet.create({
  wall: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
  board: { flex: 1, alignItems: 'center', paddingTop: 30 },
  errorText: { fontFamily: F, fontSize: 16, color: NAVY, fontWeight: 'bold', textAlign: 'center' },

  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 8, width: '100%' },
  topL: { flexDirection: 'row', gap: 6, minWidth: 80, marginTop: 10 },
  topR: { minWidth: 80, alignItems: 'flex-end', marginTop: 14, paddingRight: 14 },
  round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ffe27a', borderWidth: 2, borderColor: INK, alignItems: 'center', justifyContent: 'center' },

  signWrap: { alignItems: 'center', paddingTop: 14 },
  string: { position: 'absolute', top: -6, width: 2, height: 22, backgroundColor: '#9a6a3a' },
  sign: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#a8601f', borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 } },
  leafTop: { position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: '#5fae3a' },
  signt: { fontFamily: F, fontSize: 22, fontWeight: 'bold', color: '#fff' },
  dashes: { gap: 4, justifyContent: 'center' },
  dash: { width: 10, height: 3, borderRadius: 2, backgroundColor: '#ffc83d' },

  bpill: { backgroundColor: '#fff', borderRadius: 16, height: 30, minWidth: 58, paddingLeft: 12, paddingRight: 18, justifyContent: 'center', borderWidth: 2, borderColor: '#e6e6e6' },
  bpt: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK },

  qWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 30, paddingHorizontal: 22, paddingVertical: 10, marginTop: 22, maxWidth: '92%', elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  q: { fontFamily: F, fontSize: 20, fontWeight: 'bold', color: NAVY, textAlign: 'center', flexShrink: 1 },

  card: { width: '92%', maxWidth: 380, marginTop: 18, backgroundColor: CREAM, borderRadius: 18, paddingHorizontal: 12, paddingTop: 4, paddingBottom: 14, elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  answerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 14 },
  input: { width: 90, height: 48, borderWidth: 3, borderColor: '#F3C14B', borderRadius: 12, backgroundColor: '#fff', textAlign: 'center', fontSize: 24, fontWeight: '800', color: NAVY },
  checkBtn: { backgroundColor: '#7CC043', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 14 },
  checkText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  message: { textAlign: 'center', marginTop: 10, fontFamily: F, fontWeight: 'bold', color: '#D8383A', fontSize: 16 },

  actions: { position: 'absolute', left: 0, right: 0, bottom: 34, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 34 },
  acol: { alignItems: 'center' },
  lblRow: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 26, marginTop: 6, paddingHorizontal: 12, borderRadius: 13, backgroundColor: '#6b4423' },
  lbl: { fontFamily: F, fontSize: 15, fontWeight: 'bold', color: '#fff' },
  hintBtn: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#a8e22a', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  videoBtn: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#f3efe2', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  skipBtn: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#f0484f', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { width: '80%', backgroundColor: CREAM, borderRadius: 18, padding: 22, alignItems: 'center', gap: 12 },
  modalTitle: { fontFamily: F, fontSize: 22, fontWeight: '900', color: '#C8742B' },
  modalText: { fontFamily: F, fontSize: 16, fontWeight: 'bold', color: NAVY, textAlign: 'center' },
});