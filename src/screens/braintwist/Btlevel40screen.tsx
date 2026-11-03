// // // Btlevel40screen.tsx  -  Level 40 screen
// // import React, { useEffect, useState } from 'react';
// // import {
// //   View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
// // } from 'react-native';
// // import Btlevel40art from './Btlevel40art';
// // import { getProgress, submitAnswer, getClue, skipLevel } from './Btlevel40api';

// // const USER_ID = 'user1'; // replace with real logged-in user id
// // const ANSWER_LENGTH = 4;
// // const PAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

// // export default function Btlevel40screen({ navigation }: any) {
// //   const [input, setInput] = useState('');
// //   const [hints, setHints] = useState(0);
// //   const [clue, setClue] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     getProgress(USER_ID)
// //       .then((r) => r.success && setHints(r.hints))
// //       .catch(() => {});
// //   }, []);

// //   const press = async (k: string) => {
// //     if (loading) return;
// //     if (k === 'C') return setInput('');
// //     if (k === '⌫') return setInput((p) => p.slice(0, -1));
// //     if (input.length >= ANSWER_LENGTH) return;

// //     const next = input + k;
// //     setInput(next);

// //     if (next.length === ANSWER_LENGTH) {
// //       try {
// //         setLoading(true);
// //         const res = await submitAnswer(USER_ID, next); // frontend -> backend -> DB
// //         if (res.correct) {
// //           Alert.alert('Correct! 🎉', res.message, [
// //             { text: 'Next Level', onPress: () => navigation?.navigate?.('Btlevel41screen') },
// //           ]);
// //         } else {
// //           Alert.alert('Wrong', res.message);
// //           setInput('');
// //         }
// //       } catch {
// //         Alert.alert('Error', 'Server connect aagala');
// //         setInput('');
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //   };

// //   const onClue = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await getClue(USER_ID);
// //       if (res.success) {
// //         setClue(res.clue || '');
// //         setHints(res.hints ?? hints);
// //       } else {
// //         Alert.alert('Clue', res.message || 'Failed');
// //       }
// //     } catch {
// //       Alert.alert('Error', 'Server connect aagala');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const onSkip = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await skipLevel(USER_ID);
// //       if (res.success) {
// //         setHints(res.hints ?? hints);
// //         navigation?.navigate?.('Btlevel41screen');
// //       } else {
// //         Alert.alert('Skip', res.message || 'Failed');
// //       }
// //     } catch {
// //       Alert.alert('Error', 'Server connect aagala');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {/* top bar */}
// //       <View style={styles.topBar}>
// //         <TouchableOpacity style={styles.roundBtn} onPress={() => navigation?.navigate?.('Home')}>
// //           <Text style={styles.roundTxt}>🏠</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.roundBtn}>
// //           <Text style={styles.roundTxt}>⚙️</Text>
// //         </TouchableOpacity>
// //         <View style={styles.levelBoard}>
// //           <Text style={styles.levelTxt}>LEVEL 40</Text>
// //         </View>
// //         <View style={styles.hintBox}>
// //           <Text style={styles.hintTxt}>{hints}</Text>
// //           <Text>💡</Text>
// //         </View>
// //       </View>

// //       <View style={styles.question}>
// //         <Text style={styles.questionTxt}>Find the secret number 2285.</Text>
// //       </View>

// //       {/* notebook */}
// //       <View style={styles.paper}>
// //         <Btlevel40art />

// //         <View style={styles.slots}>
// //           {Array.from({ length: ANSWER_LENGTH }).map((_, i) => (
// //             <View key={i} style={styles.slot}>
// //               <Text style={styles.slotTxt}>{input[i] ?? ''}</Text>
// //             </View>
// //           ))}
// //         </View>

// //         {!!clue && <Text style={styles.clue}>{clue}</Text>}
// //         {loading && <ActivityIndicator style={{ marginTop: 6 }} />}

// //         <View style={styles.pad}>
// //           {PAD.map((k) => (
// //             <TouchableOpacity key={k} style={styles.key} onPress={() => press(k)}>
// //               <Text style={styles.keyTxt}>{k}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </View>

// //       {/* bottom bar: Clue + Skip */}
// //       <View style={styles.bottomBar}>
// //         <View style={styles.action}>
// //           <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#BDEBFF' }]} onPress={onClue}>
// //             <Text style={styles.actionIcon}>🔍</Text>
// //           </TouchableOpacity>
// //           <View style={styles.label}><Text style={styles.labelTxt}>Clue</Text></View>
// //         </View>
// //         <View style={styles.action}>
// //           <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF6B8E' }]} onPress={onSkip}>
// //             <Text style={styles.actionIcon}>⏭</Text>
// //           </TouchableOpacity>
// //           <View style={styles.label}><Text style={styles.labelTxt}>Skip</Text></View>
// //         </View>
// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#9ED2FF', paddingTop: 30, paddingHorizontal: 12 },
// //   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
// //   roundBtn: {
// //     width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFD800',
// //     borderWidth: 2, borderColor: '#222', alignItems: 'center', justifyContent: 'center', marginRight: 6,
// //   },
// //   roundTxt: { fontSize: 20 },
// //   levelBoard: {
// //     backgroundColor: '#A85A0C', paddingHorizontal: 24, paddingVertical: 6,
// //     borderRadius: 8, borderWidth: 2, borderColor: '#E08A1E',
// //   },
// //   levelTxt: { color: '#fff', fontSize: 22, fontWeight: '900' },
// //   hintBox: {
// //     flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
// //     borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
// //   },
// //   hintTxt: { fontSize: 20, fontWeight: '800', marginRight: 8 },
// //   question: {
// //     alignSelf: 'center', backgroundColor: '#F8EBD3', borderRadius: 20,
// //     paddingHorizontal: 30, paddingVertical: 8, marginTop: 8,
// //   },
// //   questionTxt: { fontSize: 20, fontStyle: 'italic', fontWeight: '800', color: '#16295E' },
// //   paper: {
// //     flex: 1, backgroundColor: '#fff', borderRadius: 10, marginTop: 10,
// //     alignItems: 'center', justifyContent: 'center', paddingVertical: 8,
// //   },
// //   slots: { flexDirection: 'row', marginTop: 14 },
// //   slot: {
// //     width: 44, height: 50, borderBottomWidth: 3, borderColor: '#3B2BF0',
// //     marginHorizontal: 6, alignItems: 'center', justifyContent: 'center',
// //   },
// //   slotTxt: { fontSize: 30, fontWeight: '800', color: '#16295E' },
// //   clue: { marginTop: 8, color: '#A85A0C', fontWeight: '700', textAlign: 'center', paddingHorizontal: 20 },
// //   pad: { flexDirection: 'row', flexWrap: 'wrap', width: 240, marginTop: 10, justifyContent: 'center' },
// //   key: {
// //     width: 70, height: 38, margin: 3, borderRadius: 10, backgroundColor: '#F8EBD3',
// //     borderWidth: 2, borderColor: '#A85A0C', alignItems: 'center', justifyContent: 'center',
// //   },
// //   keyTxt: { fontSize: 18, fontWeight: '800', color: '#16295E' },
// //   bottomBar: {
// //     flexDirection: 'row', justifyContent: 'space-evenly', alignSelf: 'center',
// //     backgroundColor: '#F8EBD3', borderRadius: 40, borderWidth: 4, borderColor: '#8CC6F2',
// //     paddingVertical: 8, paddingHorizontal: 30, marginVertical: 10, width: '70%',
// //   },
// //   action: { alignItems: 'center' },
// //   actionBtn: {
// //     width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: '#fff',
// //     alignItems: 'center', justifyContent: 'center',
// //   },
// //   actionIcon: { fontSize: 26 },
// //   label: { backgroundColor: '#8A4B14', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2, marginTop: 4 },
// //   labelTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
// // });
// // Btlevel40screen.tsx  -  Level 40: find the secret number 2285
// // Props come from BTGameScreen: playerId, hints, setHints, onExit, onComplete
// import React, { useRef, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
// } from 'react-native';
// import Btlevel40art from './Btlevel40art';
// import { submitAnswer, getClue, skipLevel } from './Btlevel40api';

// const ANSWER_LENGTH = 4;
// const PAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

// export default function Btlevel40screen({ playerId, hints, setHints, onExit, onComplete }: any) {
//   const [input, setInput] = useState('');
//   const [clue, setClue] = useState('');
//   const [loading, setLoading] = useState(false);
//   const attempts = useRef(0);
//   const busy = useRef(false);

//   const press = async (k: string) => {
//     if (busy.current) return;
//     if (k === 'C') return setInput('');
//     if (k === '⌫') return setInput((p) => p.slice(0, -1));
//     if (input.length >= ANSWER_LENGTH) return;

//     const next = input + k;
//     setInput(next);

//     if (next.length === ANSWER_LENGTH) {
//       busy.current = true;
//       setLoading(true);
//       attempts.current += 1;
//       try {
//         const res = await submitAnswer(String(playerId), next); // frontend -> backend -> DB
//         if (res.correct) {
//           onComplete?.({ ...res, attempts: attempts.current, skipped: false });
//         } else {
//           Alert.alert('Wrong', res.message || 'Wrong answer, try again.');
//           setInput('');
//         }
//       } catch {
//         attempts.current -= 1;
//         Alert.alert('Error', 'Server connect aagala');
//         setInput('');
//       } finally {
//         busy.current = false;
//         setLoading(false);
//       }
//     }
//   };

//   const onClue = async () => {
//     if (busy.current) return;
//     busy.current = true;
//     setLoading(true);
//     try {
//       const res = await getClue(String(playerId));
//       if (res.success) {
//         setClue(res.clue || '');
//         if (typeof res.hints === 'number') setHints?.(res.hints);
//       } else {
//         Alert.alert('Clue', res.message || 'Failed');
//       }
//     } catch {
//       Alert.alert('Error', 'Server connect aagala');
//     } finally {
//       busy.current = false;
//       setLoading(false);
//     }
//   };

//   const onSkip = async () => {
//     if (busy.current) return;
//     busy.current = true;
//     setLoading(true);
//     try {
//       const res = await skipLevel(String(playerId));
//       if (res.success) {
//         if (typeof res.hints === 'number') setHints?.(res.hints);
//         onComplete?.({ ...res, attempts: Math.max(1, attempts.current), skipped: true });
//       } else {
//         Alert.alert('Skip', res.message || 'Failed');
//       }
//     } catch {
//       Alert.alert('Error', 'Server connect aagala');
//     } finally {
//       busy.current = false;
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* top bar */}
//       <View style={styles.topBar}>
//         <View style={{ flexDirection: 'row' }}>
//           <TouchableOpacity style={styles.roundBtn} onPress={onExit}>
//             <Text style={styles.roundTxt}>🏠</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.roundBtn}>
//             <Text style={styles.roundTxt}>⚙️</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.levelBoard}>
//           <Text style={styles.levelTxt}>LEVEL 40</Text>
//         </View>
//         <View style={styles.hintBox}>
//           <Text style={styles.hintTxt}>{hints}</Text>
//           <Text>💡</Text>
//         </View>
//       </View>

//       <View style={styles.question}>
//         <Text style={styles.questionTxt}>Find the secret number 2285.</Text>
//       </View>

//       {/* notebook */}
//       <View style={styles.paper}>
//         <Btlevel40art />

//         <View style={styles.slots}>
//           {Array.from({ length: ANSWER_LENGTH }).map((_, i) => (
//             <View key={i} style={styles.slot}>
//               <Text style={styles.slotTxt}>{input[i] ?? ''}</Text>
//             </View>
//           ))}
//         </View>

//         {!!clue && <Text style={styles.clue}>{clue}</Text>}
//         {loading && <ActivityIndicator style={{ marginTop: 6 }} />}

//         <View style={styles.pad}>
//           {PAD.map((k) => (
//             <TouchableOpacity key={k} style={styles.key} onPress={() => press(k)}>
//               <Text style={styles.keyTxt}>{k}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* bottom bar: Clue (search) + Skip */}
//       <View style={styles.bottomBar}>
//         <View style={styles.action}>
//           <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#BDEBFF' }]} onPress={onClue}>
//             <Text style={styles.actionIcon}>🔍</Text>
//           </TouchableOpacity>
//           <View style={styles.label}><Text style={styles.labelTxt}>Clue</Text></View>
//         </View>
//         <View style={styles.action}>
//           <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF6B8E' }]} onPress={onSkip}>
//             <Text style={styles.actionIcon}>⏭</Text>
//           </TouchableOpacity>
//           <View style={styles.label}><Text style={styles.labelTxt}>Skip</Text></View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#9ED2FF', paddingTop: 30, paddingHorizontal: 12 },
//   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   roundBtn: {
//     width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFD800',
//     borderWidth: 2, borderColor: '#222', alignItems: 'center', justifyContent: 'center', marginRight: 6,
//   },
//   roundTxt: { fontSize: 20 },
//   levelBoard: {
//     backgroundColor: '#A85A0C', paddingHorizontal: 24, paddingVertical: 6,
//     borderRadius: 8, borderWidth: 2, borderColor: '#E08A1E',
//   },
//   levelTxt: { color: '#fff', fontSize: 22, fontWeight: '900' },
//   hintBox: {
//     flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
//     borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
//   },
//   hintTxt: { fontSize: 20, fontWeight: '800', marginRight: 8 },
//   question: {
//     alignSelf: 'center', backgroundColor: '#F8EBD3', borderRadius: 20,
//     paddingHorizontal: 30, paddingVertical: 8, marginTop: 8,
//   },
//   questionTxt: { fontSize: 20, fontStyle: 'italic', fontWeight: '800', color: '#16295E' },
//   paper: {
//     flex: 1, backgroundColor: '#fff', borderRadius: 10, marginTop: 10,
//     alignItems: 'center', justifyContent: 'center', paddingVertical: 8,
//   },
//   slots: { flexDirection: 'row', marginTop: 14 },
//   slot: {
//     width: 44, height: 50, borderBottomWidth: 3, borderColor: '#3B2BF0',
//     marginHorizontal: 6, alignItems: 'center', justifyContent: 'center',
//   },
//   slotTxt: { fontSize: 30, fontWeight: '800', color: '#16295E' },
//   clue: { marginTop: 8, color: '#A85A0C', fontWeight: '700', textAlign: 'center', paddingHorizontal: 20 },
//   pad: { flexDirection: 'row', flexWrap: 'wrap', width: 240, marginTop: 10, justifyContent: 'center' },
//   key: {
//     width: 70, height: 38, margin: 3, borderRadius: 10, backgroundColor: '#F8EBD3',
//     borderWidth: 2, borderColor: '#A85A0C', alignItems: 'center', justifyContent: 'center',
//   },
//   keyTxt: { fontSize: 18, fontWeight: '800', color: '#16295E' },
//   bottomBar: {
//     flexDirection: 'row', justifyContent: 'space-evenly', alignSelf: 'center',
//     backgroundColor: '#F8EBD3', borderRadius: 40, borderWidth: 4, borderColor: '#8CC6F2',
//     paddingVertical: 8, paddingHorizontal: 30, marginVertical: 10, width: '70%',
//   },
//   action: { alignItems: 'center' },
//   actionBtn: {
//     width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: '#fff',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   actionIcon: { fontSize: 26 },
//   label: { backgroundColor: '#8A4B14', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2, marginTop: 4 },
//   labelTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
// });
// Btlevel40screen.tsx  -  Level 40: find the secret number 2285
// Drag the books to arrange the digits. Props from BTGameScreen: playerId, hints, setHints, onExit, onComplete
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import Btlevel40art from './Btlevel40art';
import { submitAnswer, getClue, skipLevel } from './Btlevel40api';

const CLUE_COST = 25;
const SKIP_COST = 50;

/* ---------- room theme pieces ---------- */
const Leaf = ({ l, b, w, h, r, c }: any) => (
  <View
    style={{
      position: 'absolute', left: l, bottom: b, width: w, height: h,
      borderRadius: h / 2, backgroundColor: c || '#5fae3a', transform: [{ rotate: r + 'deg' }],
    }}
  />
);

function RoomBg() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* wall glow */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '45%', backgroundColor: 'rgba(255,255,255,0.2)' }} />
      {/* window (left) */}
      <View style={{ position: 'absolute', left: -6, top: 70, width: 46, height: 150, backgroundColor: '#f0b878', borderWidth: 4, borderColor: '#e2a35e', borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ flex: 1, backgroundColor: '#8fd3f6' }}>
          <View style={{ position: 'absolute', top: 18, left: 6, width: 30, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.9)' }} />
          <View style={{ position: 'absolute', left: 2, bottom: -10, width: 30, height: 44, borderRadius: 22, backgroundColor: '#7bc65a' }} />
        </View>
      </View>
      {/* globe (right) */}
      <View style={{ position: 'absolute', right: -14, top: 82, width: 46, height: 46, borderRadius: 23, backgroundColor: '#3aa0e0', borderWidth: 3, borderColor: '#2a6fb0' }}>
        <View style={{ position: 'absolute', left: 8, top: 10, width: 18, height: 14, borderRadius: 7, backgroundColor: '#6cc04a' }} />
      </View>
      <View style={{ position: 'absolute', right: 2, top: 128, width: 6, height: 26, backgroundColor: '#2a6fb0' }} />
      {/* bookshelf (right, lower) */}
      <View style={{ position: 'absolute', right: 0, top: 200, width: 26, height: 120, backgroundColor: '#e0a85e', borderLeftWidth: 4, borderColor: '#c98d4d' }}>
        <View style={{ width: 8, height: 44, backgroundColor: '#e86fae', marginTop: 12, marginLeft: 6 }} />
        <View style={{ width: 8, height: 40, backgroundColor: '#3f7fc4', marginTop: 24, marginLeft: 6 }} />
      </View>
      {/* floor */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 190, backgroundColor: '#e9b575' }}>
        {[22, 54, 90, 130].map((t, i) => (
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: t, height: 1.5, backgroundColor: 'rgba(150,90,40,0.18)' }} />
        ))}
      </View>
      {/* books stack (left) */}
      <View style={{ position: 'absolute', left: -6, bottom: 150 }}>
        <View style={{ width: 62, height: 12, borderRadius: 3, backgroundColor: '#3f9ad6', marginBottom: 1 }} />
        <View style={{ width: 70, height: 12, borderRadius: 3, backgroundColor: '#e86fae', marginBottom: 1 }} />
        <View style={{ width: 66, height: 12, borderRadius: 3, backgroundColor: '#f2c14e' }} />
      </View>
      {/* plants (bottom corners) */}
      <View style={{ position: 'absolute', left: -26, bottom: -20, width: 120, height: 160 }}>
        <Leaf l={6} b={0} w={44} h={130} r={-14} c="#6bbb3f" />
        <Leaf l={34} b={0} w={42} h={112} r={18} c="#4f9f34" />
        <Leaf l={18} b={0} w={38} h={146} r={2} c="#7cc94a" />
      </View>
      <View style={{ position: 'absolute', right: -26, bottom: -20, width: 120, height: 160 }}>
        <Leaf l={50} b={0} w={44} h={130} r={14} c="#6bbb3f" />
        <Leaf l={24} b={0} w={42} h={112} r={-18} c="#4f9f34" />
        <Leaf l={40} b={0} w={38} h={146} r={-2} c="#7cc94a" />
      </View>
    </View>
  );
}

const Dashes = ({ flip }: any) => (
  <View style={{ gap: 4, justifyContent: 'center' }}>
    <View style={[styles.dash, { transform: [{ rotate: flip ? '25deg' : '-25deg' }] }]} />
    <View style={[styles.dash, { transform: [{ rotate: flip ? '-25deg' : '25deg' }] }]} />
  </View>
);

export default function Btlevel40screen({ playerId, hints, setHints, onExit, onComplete }: any) {
  const [clue, setClue] = useState('');
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const attempts = useRef(0);
  const busy = useRef(false);
  const shake = useRef(new Animated.Value(0)).current;
  const bal = Number(hints) || 0;

  const flash = (m: string) => {
    setNote(m);
    setTimeout(() => setNote(''), 1600);
  };
  const doShake = () =>
    Animated.sequence(
      [10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))
    ).start();

  // books dropped -> send the arranged number to the backend (backend checks + saves in DB)
  const onArrange = async (digits: string) => {
    if (busy.current || done) return;
    busy.current = true;
    attempts.current += 1;
    try {
      const res = await submitAnswer(String(playerId), digits);
      if (res.correct) {
        setDone(true);
        flash('Correct! 🎉');
        setTimeout(() => onComplete?.({ ...res, attempts: attempts.current, skipped: false }), 1000);
      } else {
        doShake();
        flash('Not quite. Try again!');
      }
    } catch {
      attempts.current -= 1;
      flash('Server connect aagala');
    } finally {
      busy.current = false;
    }
  };

  const onClue = async () => {
    if (busy.current || done) return;
    if (bal < CLUE_COST) return flash('Need ' + CLUE_COST + ' hints. You have ' + bal + '.');
    busy.current = true;
    try {
      const res = await getClue(String(playerId));
      if (res.success) {
        setClue(res.clue || '');
        if (typeof res.hints === 'number') setHints?.(res.hints);
      } else {
        flash(res.message || 'Clue failed');
      }
    } catch {
      flash('Server connect aagala');
    } finally {
      busy.current = false;
    }
  };

  const onSkip = async () => {
    if (busy.current || done) return;
    if (bal < SKIP_COST) return flash('Need ' + SKIP_COST + ' hints. You have ' + bal + '.');
    busy.current = true;
    try {
      const res = await skipLevel(String(playerId));
      if (res.success) {
        setDone(true);
        if (typeof res.hints === 'number') setHints?.(res.hints);
        onComplete?.({ ...res, attempts: Math.max(1, attempts.current), skipped: true });
      } else {
        flash(res.message || 'Skip failed');
      }
    } catch {
      flash('Server connect aagala');
    } finally {
      busy.current = false;
    }
  };

  return (
    <View style={styles.container}>
      <RoomBg />

      {/* top bar */}
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.roundBtn} onPress={onExit}>
            <Text style={styles.roundTxt}>🏠</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundBtn}>
            <Text style={styles.roundTxt}>⚙️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.levelBoard}>
          <Dashes />
          <Text style={styles.levelTxt}>LEVEL 40</Text>
          <Dashes flip />
        </View>
        <View style={styles.hintBox}>
          <Text style={styles.hintTxt}>{hints}</Text>
          <Text style={{ fontSize: 18 }}>💡</Text>
        </View>
      </View>

      {/* question banner */}
      <View style={styles.question}>
        <Dashes />
        <Text style={styles.questionTxt}>Find the secret number 2285.</Text>
        <Dashes flip />
      </View>

      {/* notebook paper */}
      <View style={styles.paper}>
        <View style={styles.holes}>
          {Array.from({ length: 9 }).map((_, i) => (
            <View key={i} style={styles.hole} />
          ))}
        </View>
        {Array.from({ length: 9 }).map((_, i) => (
          <View key={i} style={[styles.ruled, { top: 50 + i * 36 }]} />
        ))}

        <Animated.View style={{ flex: 1, justifyContent: 'center', transform: [{ translateX: shake }] }}>
          <Btlevel40art onArrange={onArrange} locked={done} />
          <Text style={styles.tip}>Drag the books to arrange the number</Text>
        </Animated.View>

        {!!clue && <Text style={styles.clue}>{clue}</Text>}
        {!!note && <Text style={styles.note}>{note}</Text>}
      </View>

      {/* bottom bar: Clue (search) + Skip */}
      <View style={styles.bottomBar}>
        <View style={styles.action}>
          <Text style={styles.cost}>💡 x{CLUE_COST}</Text>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#BDEBFF' }]} onPress={onClue}>
            <Text style={styles.actionIcon}>🔍</Text>
          </TouchableOpacity>
          <View style={styles.label}><Text style={styles.labelTxt}>Clue</Text></View>
        </View>
        <View style={styles.action}>
          <Text style={styles.cost}>💡 x{SKIP_COST}</Text>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF6B8E' }]} onPress={onSkip}>
            <Text style={styles.actionIcon}>⏭</Text>
          </TouchableOpacity>
          <View style={styles.label}><Text style={styles.labelTxt}>Skip</Text></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#9ED2FF', paddingTop: 30, paddingHorizontal: 12, overflow: 'hidden' },
  dash: { width: 10, height: 3, borderRadius: 2, backgroundColor: '#ffc83d' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roundBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFD800',
    borderWidth: 2, borderColor: '#222', alignItems: 'center', justifyContent: 'center', marginRight: 6,
  },
  roundTxt: { fontSize: 20 },
  levelBoard: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#A85A0C',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 3, borderColor: '#D98B3D',
  },
  levelTxt: { color: '#fff', fontSize: 20, fontWeight: '900' },
  hintBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
  },
  hintTxt: { fontSize: 20, fontWeight: '800', marginRight: 8 },
  question: {
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'center', backgroundColor: '#F8EBD3',
    borderRadius: 30, paddingHorizontal: 20, paddingVertical: 10, marginTop: 10, elevation: 4,
  },
  questionTxt: { fontSize: 19, fontStyle: 'italic', fontWeight: '800', color: '#16295E' },
  paper: {
    flex: 1, backgroundColor: '#fff', borderRadius: 10, marginTop: 12, marginBottom: 12,
    overflow: 'hidden', elevation: 5,
  },
  holes: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  hole: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#8CC6F2' },
  ruled: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#E3EEF8' },
  tip: { textAlign: 'center', marginTop: 18, color: '#7a8aa8', fontWeight: '700', fontSize: 14 },
  clue: { textAlign: 'center', color: '#A85A0C', fontWeight: '700', paddingHorizontal: 16, marginBottom: 6 },
  note: { textAlign: 'center', color: '#c0392b', fontWeight: '800', fontSize: 17, marginBottom: 10 },
  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-evenly', alignSelf: 'center',
    backgroundColor: '#F8EBD3', borderRadius: 40, borderWidth: 4, borderColor: '#8CC6F2',
    paddingVertical: 8, paddingHorizontal: 30, marginBottom: 14, width: '78%',
  },
  action: { alignItems: 'center' },
  cost: { fontSize: 13, fontWeight: '800', color: '#16295E', marginBottom: 2 },
  actionBtn: {
    width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  actionIcon: { fontSize: 26 },
  label: { backgroundColor: '#8A4B14', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2, marginTop: 4 },
  labelTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
