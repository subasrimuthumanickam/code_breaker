// // Btlevel30screen.tsx - Level 30: translate the pictures into words (type the answer)
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   StyleSheet,
//   ActivityIndicator,
//   Modal,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { Icon } from './Art';
// import { F, INK, Stage, loop } from './BTShared';
// import { RoomBg } from './Btlevel29art';
// import { PicturePanel, GoatCloud, Stars } from './Btlevel30art';
// import {
//   startLevel30,
//   answerLevel30,
//   hintLevel30,
//   skipLevel30,
//   Level30Data,
//   BASE_URL,
// } from './Btlevel30api';

// interface Props {
//   playerId: any;
//   hints: number;
//   setHints?: (v: number) => void;
//   onHints?: (v: number) => void;
//   onExit?: () => void;
//   onComplete?: (r: any) => void;
// }

// const NAVY = '#10245e';
// const CREAM = '#fbf6e9';
// const SKY = '#9fc6ea';

// const Round = ({ n, onPress }: any) => (
//   <TouchableOpacity onPress={onPress} style={s.round}>
//     <Icon n={n} s={16} />
//   </TouchableOpacity>
// );

// // pops in on mount, squishes when pressed
// function PopTouch({ inner, onPress, delay = 0, children }: any) {
//   const e = useRef(new Animated.Value(0)).current,
//     sc = useRef(new Animated.Value(1)).current;
//   useEffect(() => {
//     Animated.sequence([Animated.delay(delay), Animated.spring(e, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true })]).start();
//   }, []);
//   const to = (v: number) => Animated.spring(sc, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
//   return (
//     <Pressable onPress={onPress} onPressIn={() => to(0.88)} onPressOut={() => to(1)}>
//       <Animated.View style={[inner, { opacity: e, transform: [{ scale: Animated.multiply(e, sc) }] }]}>{children}</Animated.View>
//     </Pressable>
//   );
// }

// const Btlevel30screen: React.FC<Props> = ({ playerId, hints, setHints, onHints, onExit, onComplete }) => {
//   const [data, setData] = useState<Level30Data | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [answer, setAnswer] = useState('');
//   const [note, setNote] = useState('');
//   const [solved, setSolved] = useState(false);
//   const [clue, setClue] = useState('');
//   const [showClue, setShowClue] = useState(false);
//   const busy = useRef(false);
//   const shake = useRef(new Animated.Value(0)).current;
//   const sway = useRef(new Animated.Value(0)).current;
//   const qIn = useRef(new Animated.Value(0)).current;

//   const updateHints = (v: number) => {
//     setHints?.(v);
//     onHints?.(v);
//   };

//   const flash = (m: string) => {
//     setNote(m);
//     setTimeout(() => setNote(''), 1600);
//   };

//   const doShake = () =>
//     Animated.sequence([10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

//   const load = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const d = await startLevel30(playerId);
//       setData(d);
//       setSolved(d.progress.solved);
//       if (typeof d.hints === 'number') updateHints(d.hints);
//     } catch (e: any) {
//       console.log('[Level30] load failed:', e?.url || BASE_URL, e?.message);
//       setError('Server connect aagala.\n' + (e?.url || BASE_URL) + '\n' + (e?.message || ''));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, [playerId]);

//   useEffect(() => {
//     loop(sway, 1800);
//   }, []);

//   useEffect(() => {
//     if (data) Animated.spring(qIn, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
//   }, [!!data]);

//   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] }),
//     qY = qIn.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

//   const check = async () => {
//     const text = answer.trim();
//     if (!text || solved || busy.current) return;
//     busy.current = true;
//     try {
//       const r = await answerLevel30(playerId, text);
//       if (r.correct) {
//         setSolved(true);
//         flash('Correct! 🎉');
//         setTimeout(() => onComplete?.({ correct: true, attempts: r.attempts, skipped: false }), 1100);
//       } else {
//         doShake();
//         flash('Not quite. Try again!');
//       }
//     } catch (e: any) {
//       flash('Network error');
//     } finally {
//       busy.current = false;
//     }
//   };

//   const clueBtn = async () => {
//     if (!data || busy.current || solved) return;
//     if ((Number(hints) || 0) < data.hintCost) {
//       flash(`Need ${data.hintCost} hints. You have ${Number(hints) || 0}.`);
//       return;
//     }
//     busy.current = true;
//     try {
//       const r = await hintLevel30(playerId);
//       updateHints(r.hints);
//       setClue(r.hint.text);
//       setShowClue(true);
//     } catch (e: any) {
//       flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
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
//       const r = await skipLevel30(playerId);
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
//       <Stage bg={SKY}>
//         <View style={s.wall}>
//           <RoomBg />
//           <View style={[s.board, { justifyContent: 'center' }]}>
//             <ActivityIndicator size="large" color="#F28C28" />
//           </View>
//         </View>
//       </Stage>
//     );
//   }

//   if (error || !data) {
//     return (
//       <Stage bg={SKY}>
//         <View style={s.wall}>
//           <RoomBg />
//           <View style={[s.board, { justifyContent: 'center', paddingHorizontal: 20 }]}>
//             <Text style={s.errorText}>{error || 'No data'}</Text>
//             <TouchableOpacity style={[s.checkBtn, { marginTop: 16 }]} onPress={load}>
//               <Text style={s.checkText}>RETRY</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[s.checkBtn, { marginTop: 10, backgroundColor: '#F28C28' }]} onPress={onExit}>
//               <Text style={s.checkText}>HOME</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Stage>
//     );
//   }

//   return (
//     <Stage bg={SKY}>
//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//         <View style={s.wall}>
//           <RoomBg />
//           <Stars />
//           <View style={s.board}>
//             {/* top bar */}
//             <View style={s.top}>
//               <View style={s.topL}>
//                 <Round n="home" onPress={onExit} />
//                 <Round n="gear" />
//               </View>
//               <Animated.View style={[s.signWrap, { transform: [{ rotate: swayR }] }]}>
//                 <View style={[s.string, { left: 26, transform: [{ rotate: '12deg' }] }]} />
//                 <View style={[s.string, { right: 26, transform: [{ rotate: '-12deg' }] }]} />
//                 <View style={s.sign}>
//                   <View style={[s.leafTop, { left: -8, transform: [{ rotate: '-30deg' }] }]} />
//                   <View style={[s.leafTop, { right: -8, transform: [{ rotate: '30deg' }] }]} />
//                   <Text style={s.arrow}>{'<'}</Text>
//                   <Text style={s.signt}>LEVEL 30</Text>
//                   <Text style={s.arrow}>{'>'}</Text>
//                 </View>
//               </Animated.View>
//               <View style={s.topR}>
//                 <View style={s.bpill}>
//                   <Text style={s.bpt}>{Number(hints) || 0}</Text>
//                   <View style={{ position: 'absolute', right: -14, top: -10 }}>
//                     <Icon n="bulb" s={34} />
//                   </View>
//                 </View>
//               </View>
//             </View>

//             {/* question banner (dashed) */}
//             <Animated.View style={[s.qWrap, { opacity: qIn, transform: [{ translateY: qY }] }]}>
//               <Text style={s.q}>{data.question}</Text>
//             </Animated.View>

//             {/* pictures + answer box */}
//             <Animated.View style={{ width: '100%', alignItems: 'center', marginTop: 16, transform: [{ translateX: shake }] }}>
//               <PicturePanel pieces={data.pieces} />

//               <View style={s.answerRow}>
//                 <TextInput
//                   style={s.input}
//                   value={answer}
//                   onChangeText={setAnswer}
//                   placeholder="Type your answer..."
//                   placeholderTextColor="#B9B2A0"
//                   autoCapitalize="sentences"
//                   autoCorrect={false}
//                   returnKeyType="done"
//                   editable={!solved}
//                   onSubmitEditing={check}
//                 />
//                 <TouchableOpacity style={[s.checkBtn, (solved || !answer.trim()) && { opacity: 0.5 }]} onPress={check} disabled={solved}>
//                   <Text style={s.checkText}>CHECK</Text>
//                 </TouchableOpacity>
//               </View>
//               {!!note && <Text style={[s.message, solved && { color: '#2E9E4F' }]}>{note}</Text>}
//             </Animated.View>

//             {/* goat on the cloud (bottom middle) */}
//             <View style={s.goatPos} pointerEvents="none">
//               <GoatCloud />
//             </View>

//             {/* Clue / Skip */}
//             <View style={s.actions} pointerEvents="box-none">
//               <View style={s.acol}>
//                 <PopTouch inner={s.clueBtn} onPress={clueBtn}>
//                   <Icon n="bulb" s={42} />
//                 </PopTouch>
//                 <View style={s.lblPill}>
//                   <Text style={s.lbl}>Clue</Text>
//                 </View>
//                 <Text style={s.cost}>💡 {data.hintCost}</Text>
//               </View>
//               <View style={s.acol}>
//                 <PopTouch inner={s.skipBtn} onPress={skip}>
//                   <Icon n="play" s={38} />
//                 </PopTouch>
//                 <View style={s.lblPill}>
//                   <Text style={s.lbl}>Skip</Text>
//                 </View>
//                 <Text style={s.cost}>💡 {data.skipCost}</Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* clue modal */}
//         <Modal visible={showClue} transparent animationType="fade" onRequestClose={() => setShowClue(false)}>
//           <View style={s.modalBg}>
//             <View style={s.modalCard}>
//               <Text style={s.modalTitle}>CLUE</Text>
//               <Text style={s.modalText}>{clue}</Text>
//               <TouchableOpacity style={s.checkBtn} onPress={() => setShowClue(false)}>
//                 <Text style={s.checkText}>OK</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </KeyboardAvoidingView>
//     </Stage>
//   );
// };

// export default Btlevel30screen;

// const s = StyleSheet.create({
//   wall: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
//   board: { flex: 1, alignItems: 'center', paddingTop: 30 },
//   errorText: { fontFamily: F, fontSize: 16, color: NAVY, fontWeight: 'bold', textAlign: 'center' },

//   top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 8, width: '100%' },
//   topL: { flexDirection: 'row', gap: 6, minWidth: 80, marginTop: 10 },
//   topR: { minWidth: 80, alignItems: 'flex-end', marginTop: 14, paddingRight: 14 },
//   round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ffe27a', borderWidth: 2, borderColor: INK, alignItems: 'center', justifyContent: 'center' },

//   signWrap: { alignItems: 'center', paddingTop: 14 },
//   string: { position: 'absolute', top: -6, width: 2, height: 22, backgroundColor: '#9a6a3a' },
//   sign: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#c8742b', borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 } },
//   leafTop: { position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: '#5fae3a' },
//   signt: { fontFamily: F, fontSize: 22, fontWeight: 'bold', color: '#fff' },
//   arrow: { fontFamily: F, fontSize: 20, fontWeight: '900', color: '#ffc83d' },

//   bpill: { backgroundColor: '#fff', borderRadius: 16, height: 30, minWidth: 58, paddingLeft: 12, paddingRight: 18, justifyContent: 'center', borderWidth: 2, borderColor: '#e6e6e6' },
//   bpt: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK },

//   qWrap: { backgroundColor: '#f3ece0', borderRadius: 30, borderWidth: 2, borderStyle: 'dashed', borderColor: '#e8c48a', paddingHorizontal: 22, paddingVertical: 12, marginTop: 22, maxWidth: '92%', elevation: 3 },
//   q: { fontSize: 20, fontStyle: 'italic', fontWeight: 'bold', color: NAVY, textAlign: 'center' },

//   answerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, width: '94%', maxWidth: 400 },
//   input: { flex: 1, height: 50, borderWidth: 3, borderColor: '#F3C14B', borderRadius: 14, backgroundColor: '#fff', paddingHorizontal: 14, fontSize: 18, fontWeight: '700', color: NAVY },
//   checkBtn: { backgroundColor: '#7CC043', paddingHorizontal: 18, paddingVertical: 13, borderRadius: 14 },
//   checkText: { color: '#fff', fontWeight: '900', fontSize: 16 },
//   message: { textAlign: 'center', marginTop: 10, fontFamily: F, fontWeight: 'bold', color: '#D8383A', fontSize: 16 },

//   goatPos: { position: 'absolute', bottom: 70, alignSelf: 'center' },

//   actions: { position: 'absolute', left: 0, right: 0, bottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 34 },
//   acol: { alignItems: 'center' },
//   clueBtn: { width: 74, height: 74, borderRadius: 37, backgroundColor: '#8bd131', borderWidth: 5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   skipBtn: { width: 74, height: 74, borderRadius: 37, backgroundColor: '#2f7ff0', borderWidth: 5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   lblPill: { marginTop: -10, backgroundColor: '#7b4a22', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 3, borderWidth: 2, borderColor: '#a8672f' },
//   lbl: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: '#fff' },
//   cost: { fontFamily: F, fontSize: 13, fontWeight: 'bold', color: '#6b4423', marginTop: 2 },

//   modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
//   modalCard: { width: '80%', backgroundColor: CREAM, borderRadius: 18, padding: 22, alignItems: 'center', gap: 12 },
//   modalTitle: { fontFamily: F, fontSize: 22, fontWeight: '900', color: '#C8742B' },
//   modalText: { fontFamily: F, fontSize: 16, fontWeight: 'bold', color: NAVY, textAlign: 'center' },
// });
// Btlevel30screen.tsx - Level 30: translate the pictures into words (type the answer)
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Icon } from './Art';
import { F, INK, Stage, Coin, loop } from './BTShared';
import { RoomBg } from './Btlevel29art';
import { PicturePanel, GoatCloud, Stars } from './Btlevel30art';
import {
  startLevel30,
  answerLevel30,
  hintLevel30,
  skipLevel30,
  rewardLevel30,
  Level30Data,
  BASE_URL,
} from './Btlevel30api';

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
const ORANGE = '#e8912e';

const Round = ({ n, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={s.round}>
    <Icon n={n} s={16} />
  </TouchableOpacity>
);

const Btlevel30screen: React.FC<Props> = ({ playerId, hints, setHints, onHints, onExit, onComplete }) => {
  const [data, setData] = useState<Level30Data | null>(null);
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
  const qIn = useRef(new Animated.Value(0)).current;

  const updateHints = (v: number) => {
    setHints?.(v);
    onHints?.(v);
  };

  const flash = (m: string) => {
    setNote(m);
    setTimeout(() => setNote(''), 1800);
  };

  const doShake = () =>
    Animated.sequence([10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const d = await startLevel30(playerId);
      setData(d);
      setSolved(d.progress.solved);
      if (typeof d.hints === 'number') updateHints(d.hints);
    } catch (e: any) {
      console.log('[Level30] load failed:', e?.url || BASE_URL, e?.message);
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
  }, []);

  useEffect(() => {
    if (data) Animated.spring(qIn, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
  }, [!!data]);

  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] }),
    qY = qIn.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

  // CHECK: send the typed answer to the backend
  const check = async () => {
    const text = answer.trim();
    if (!text || solved || busy.current) return;
    busy.current = true;
    try {
      const r = await answerLevel30(playerId, text);
      if (r.correct) {
        setSolved(true);
        flash('Correct! 🎉');
        setTimeout(() => onComplete?.({ correct: true, attempts: r.attempts, skipped: false }), 1100);
      } else {
        doShake();
        flash('Not quite. Try again!');
      }
    } catch (e: any) {
      flash('Network error');
    } finally {
      busy.current = false;
    }
  };

  // search icon: the backend sends the clue, the CLUES popup opens
  const clueBtn = async () => {
    if (!data || busy.current || solved) return;
    if ((Number(hints) || 0) < data.hintCost) {
      flash(`Need ${data.hintCost} hints. You have ${Number(hints) || 0}.`);
      return;
    }
    busy.current = true;
    try {
      const r = await hintLevel30(playerId);
      updateHints(r.hints);
      setClue(r.hint.text);
      setShowClue(true);
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
    } finally {
      busy.current = false;
    }
  };

  // video icon: +75 hints
  const reward = async () => {
    if (busy.current || solved) return;
    busy.current = true;
    try {
      const r = await rewardLevel30(playerId);
      updateHints(r.hints);
      flash('+' + r.added + ' hints');
    } catch (e: any) {
      flash('Network error');
    } finally {
      busy.current = false;
    }
  };

  // skip icon
  const skip = async () => {
    if (!data || busy.current || solved) return;
    if ((Number(hints) || 0) < data.skipCost) {
      flash(`Need ${data.skipCost} hints. You have ${Number(hints) || 0}.`);
      return;
    }
    busy.current = true;
    try {
      const r = await skipLevel30(playerId);
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
            <TouchableOpacity style={[s.checkBtn, { marginTop: 10, backgroundColor: ORANGE }]} onPress={onExit}>
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
                  <Text style={s.arrow}>{'<'}</Text>
                  <Text style={s.signt}>LEVEL 30</Text>
                  <Text style={s.arrow}>{'>'}</Text>
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

            {/* question pill (same as level 1) */}
            <Animated.View style={[s.qWrap, { opacity: qIn, transform: [{ translateY: qY }] }]}>
              <Text style={[s.qArrow]}>{'<'}</Text>
              <Text style={[s.q, !!note && { color: '#c0392b' }]}>{note || data.question}</Text>
              <Text style={[s.qArrow]}>{'>'}</Text>
            </Animated.View>

            {/* orange panel with the pictures + the answer box */}
            <Animated.View style={{ width: '100%', alignItems: 'center', marginTop: 14, transform: [{ translateX: shake }] }}>
              <PicturePanel pieces={data.pieces} />

              <View style={s.answerRow}>
                <TextInput
                  style={s.input}
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="Type your answer..."
                  placeholderTextColor="#B9B2A0"
                  autoCapitalize="sentences"
                  autoCorrect={false}
                  returnKeyType="done"
                  editable={!solved}
                  onSubmitEditing={check}
                />
                <TouchableOpacity style={[s.checkBtn, (solved || !answer.trim()) && { opacity: 0.5 }]} onPress={check} disabled={solved}>
                  <Text style={s.checkText}>CHECK</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* confused goat on the pink cloud + stars (between the answer box and the bottom panel) */}
            <View style={s.goatArea} pointerEvents="none">
              <Stars />
              <GoatCloud />
            </View>
          </View>

          {/* bottom rounded panel (same as level 1): search / video / skip */}
          <View style={s.panel}>
            <View style={s.btnCol}>
              <TouchableOpacity style={s.ringGreen} activeOpacity={0.85} onPress={clueBtn}>
                <View style={s.circleGreen}>
                  <Icon n="search" s={32} />
                </View>
              </TouchableOpacity>
              <View style={s.badge}>
                <Icon n="bulb" s={13} />
                <Text style={s.badgeT}>{data.hintCost}</Text>
              </View>
            </View>

            <View style={s.btnCol}>
              <TouchableOpacity style={s.ringWhite} activeOpacity={0.85} onPress={reward}>
                <Icon n="film" s={36} />
              </TouchableOpacity>
              <View style={s.badge}>
                <Coin s={12} />
                <Text style={s.badgeT}>+{data.videoReward}</Text>
              </View>
            </View>

            <View style={s.btnCol}>
              <TouchableOpacity style={s.ringWhite} activeOpacity={0.85} onPress={skip}>
                <View style={s.circleRed}>
                  <Icon n="play" s={30} />
                </View>
              </TouchableOpacity>
              <View style={s.badge}>
                <Icon n="bulb" s={13} />
                <Text style={s.badgeT}>{data.skipCost}</Text>
              </View>
            </View>
          </View>

          {/* CLUES popup (only from the search icon) */}
          {showClue && (
            <View style={s.overlay}>
              <View style={s.clueCard}>
                <TouchableOpacity style={s.closeBtn} activeOpacity={0.85} onPress={() => setShowClue(false)}>
                  <Text style={s.closeT}>✕</Text>
                </TouchableOpacity>
                <Text style={s.clueTitle}>CLUES</Text>
                <View style={s.clueRow}>
                  <View style={s.clueNum}>
                    <Text style={s.clueNumT}>1</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.clueHead}>Clue 1</Text>
                    <Text style={s.clueBody}>{clue}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Stage>
  );
};

export default Btlevel30screen;

const s = StyleSheet.create({
  wall: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
  board: { flex: 1, alignItems: 'center', paddingTop: 30, paddingBottom: 134 },
  errorText: { fontFamily: F, fontSize: 16, color: NAVY, fontWeight: 'bold', textAlign: 'center' },

  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 8, width: '100%' },
  topL: { flexDirection: 'row', gap: 6, minWidth: 80, marginTop: 10 },
  topR: { minWidth: 80, alignItems: 'flex-end', marginTop: 14, paddingRight: 14 },
  round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ffe27a', borderWidth: 2, borderColor: INK, alignItems: 'center', justifyContent: 'center' },

  signWrap: { alignItems: 'center', paddingTop: 14 },
  string: { position: 'absolute', top: -6, width: 2, height: 22, backgroundColor: '#9a6a3a' },
  sign: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#c8742b', borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 } },
  leafTop: { position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: '#5fae3a' },
  signt: { fontFamily: F, fontSize: 22, fontWeight: 'bold', color: '#fff' },
  arrow: { fontFamily: F, fontSize: 20, fontWeight: '900', color: '#ffc83d' },

  bpill: { backgroundColor: '#fff', borderRadius: 16, height: 30, minWidth: 58, paddingLeft: 12, paddingRight: 18, justifyContent: 'center', borderWidth: 2, borderColor: '#e6e6e6' },
  bpt: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK },

  qWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 26, paddingVertical: 9, paddingHorizontal: 18, marginTop: 20, maxWidth: '92%', elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  qArrow: { fontFamily: F, fontSize: 20, fontWeight: '900', color: '#f5a623' },
  q: { flexShrink: 1, fontFamily: F, fontSize: 19, fontStyle: 'italic', fontWeight: 'bold', color: NAVY, textAlign: 'center' },

  answerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, width: '94%', maxWidth: 380 },
  input: { flex: 1, height: 50, borderWidth: 3, borderColor: '#F3C14B', borderRadius: 14, backgroundColor: '#fff', paddingHorizontal: 14, fontSize: 18, fontWeight: '700', color: NAVY },
  checkBtn: { backgroundColor: '#7CC043', paddingHorizontal: 18, paddingVertical: 13, borderRadius: 14 },
  checkText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  goatArea: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },

  panel: { position: 'absolute', left: 16, right: 16, bottom: 14, height: 112, borderRadius: 56, backgroundColor: '#f8e9cf', borderWidth: 8, borderColor: '#b5d3ea', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 8 },
  btnCol: { alignItems: 'center' },
  ringGreen: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#c5f158', alignItems: 'center', justifyContent: 'center' },
  circleGreen: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#a3d92a', alignItems: 'center', justifyContent: 'center' },
  ringWhite: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  circleRed: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ee4558', alignItems: 'center', justifyContent: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4, paddingHorizontal: 10, height: 22, borderRadius: 11, backgroundColor: '#7b4a22' },
  badgeT: { fontFamily: F, fontSize: 13, fontWeight: '900', color: '#fff' },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  clueCard: { width: '86%', maxWidth: 360, backgroundColor: '#f9efdf', borderColor: ORANGE, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
  clueTitle: { fontFamily: F, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
  closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: '#ffe27a', borderWidth: 3, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  closeT: { fontSize: 18, fontWeight: '900', color: '#ee4558' },
  clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12, backgroundColor: '#fff', borderColor: '#3ec45a' },
  clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#c0702b', alignItems: 'center', justifyContent: 'center' },
  clueNumT: { fontFamily: F, fontSize: 28, fontWeight: '900', color: '#fff' },
  clueHead: { fontFamily: F, fontSize: 20, fontWeight: '900', color: '#c0702b' },
  clueBody: { fontFamily: F, fontSize: 16, fontStyle: 'italic', color: NAVY, marginTop: 2 },
});
