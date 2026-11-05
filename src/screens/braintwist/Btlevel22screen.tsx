
// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, Pressable, Animated, StyleSheet, ActivityIndicator } from 'react-native';
// import * as api from './api'; // same helpers the other levels use (hint / skip / reward)
// import { F, INK, Stage, Coin, loop } from './BTShared';
// import { Icon } from './Art';
// import { startLevel22, submitLevel22Answer } from './Btlevel22api';
// import { Level22Room, RoadScene } from './Btlevel22art';

// const NAVY = '#10245e';
// const CREAM = '#fbf6e9';
// const SKY = '#9fc6ea';
// const LEVEL = 22;
// const HINT_COST = 25;
// const SKIP_COST = 50;

// type Props = {
//   playerId: number;
//   hints?: number;
//   setHints?: (n: number) => void;
//   onExit?: () => void;
//   onComplete?: (r: any) => void;
// };

// // pops in on mount, squishes when pressed
// function PopTouch({ inner, onPress, disabled, delay = 0, children }: any) {
//   const e = useRef(new Animated.Value(0)).current;
//   const sc = useRef(new Animated.Value(1)).current;
//   useEffect(() => {
//     Animated.sequence([
//       Animated.delay(delay),
//       Animated.spring(e, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
//     ]).start();
//   }, []);
//   const to = (v: number) =>
//     Animated.spring(sc, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
//   return (
//     <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.88)} onPressOut={() => to(1)}>
//       <Animated.View style={[inner, { opacity: e, transform: [{ scale: Animated.multiply(e, sc) }] }]}>
//         {children}
//       </Animated.View>
//     </Pressable>
//   );
// }

// export default function Btlevel22screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
//   const bal = Number(hints) || 0;

//   const [loading, setLoading] = useState(true);
//   const [sessionId, setSessionId] = useState<number | null>(null);
//   const [question, setQuestion] = useState('');
//   const [options, setOptions] = useState<string[]>([]);
//   const [selected, setSelected] = useState<string | null>(null);
//   const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
//   const [note, setNote] = useState('');

//   const busy = useRef(false);
//   const done = useRef(false);
//   const shake = useRef(new Animated.Value(0)).current;
//   const sway = useRef(new Animated.Value(0)).current;
//   const pulse = useRef(new Animated.Value(0)).current;

//   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });
//   const pulseS = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.09] });

//   const flash = (m: string, ms = 2200) => {
//     setNote(m);
//     setTimeout(() => setNote(''), ms);
//   };
//   const doShake = () =>
//     Animated.sequence(
//       [10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))
//     ).start();

//   const start = async () => {
//     setLoading(true);
//     setNote('');
//     try {
//       const data = await startLevel22(playerId);
//       if (data.success) {
//         setSessionId(data.sessionId);
//         setQuestion(data.question.text);
//         setOptions(data.question.options);
//       } else {
//         setNote(data.error || 'Cannot load level 22');
//       }
//     } catch (e) {
//       console.log('[L22] start failed:', e);
//       setNote('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     start();
//     loop(sway, 1800);
//     loop(pulse, 900);
//   }, [playerId]);

//   // ---- answer ----
//   const onPick = async (answer: string) => {
//     if (!sessionId || busy.current || done.current) return;
//     busy.current = true;
//     setSelected(answer);
//     try {
//       const data = await submitLevel22Answer(playerId, sessionId, answer);
//       if (data.success) {
//         if (data.correct) {
//           done.current = true;
//           setResult('correct');
//           setTimeout(
//             () => onComplete?.({ attempts: data.attempts || 1, skipped: false, correct: true }),
//             1200
//           );
//         } else {
//           setResult('wrong');
//           doShake();
//           flash('Not quite. Try again!', 1200);
//           setTimeout(() => {
//             setResult(null);
//             setSelected(null);
//           }, 900);
//         }
//       } else {
//         flash(data.error || data.message || 'Something went wrong');
//       }
//     } catch (e) {
//       console.log('[L22] answer failed:', e);
//       flash('Network error');
//     } finally {
//       busy.current = false;
//     }
//   };

//   // ---- hint / video / skip (same costs as the other levels) ----
//   const hint = async () => {
//     if (busy.current || done.current) return;
//     if (bal < HINT_COST) {
//       flash('Need ' + HINT_COST + ' hints. You have ' + bal + '.');
//       return;
//     }
//     busy.current = true;
//     try {
//       const r: any = await api.hint(LEVEL, playerId, []);
//       if (typeof r?.hints === 'number') setHints?.(r.hints);
//       flash(
//         r?.hint?.text || 'Thief has a 30 km head start. Police gain 15 km every hour.',
//         3500
//       );
//     } catch (e: any) {
//       flash(e?.status === 402 ? 'Not enough hints' : 'Hint not available');
//     } finally {
//       busy.current = false;
//     }
//   };

//   const video = async () => {
//     if (busy.current) return;
//     busy.current = true;
//     try {
//       const r: any = await api.reward(playerId, 'video');
//       if (typeof r?.hints === 'number') setHints?.(r.hints);
//     } catch (e) {
//     } finally {
//       busy.current = false;
//     }
//   };

//   const skip = async () => {
//     if (busy.current || done.current) return;
//     if (bal < SKIP_COST) {
//       flash('Need ' + SKIP_COST + ' hints. You have ' + bal + '.');
//       return;
//     }
//     busy.current = true;
//     try {
//       const r: any = await api.skip(LEVEL, playerId);
//       setHints?.(typeof r?.hints === 'number' ? r.hints : bal - SKIP_COST);
//       done.current = true;
//       onComplete?.({ attempts: 1, skipped: true });
//     } catch (e: any) {
//       flash(e?.status === 402 ? 'Not enough hints' : 'Skip not available');
//     } finally {
//       busy.current = false;
//     }
//   };

//   return (
//     <Stage bg={SKY}>
//       <View style={st.wall}>
//         <Level22Room />

//         <View style={st.board}>
//           {/* top bar */}
//           <View style={st.top}>
//             <View style={st.topL}>
//               <TouchableOpacity style={st.round} onPress={onExit}>
//                 <Icon n="home" s={16} />
//               </TouchableOpacity>
//               <TouchableOpacity style={st.round}>
//                 <Icon n="gear" s={16} />
//               </TouchableOpacity>
//             </View>

//             <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
//               <View style={[st.string, { left: 26, transform: [{ rotate: '12deg' }] }]} />
//               <View style={[st.string, { right: 26, transform: [{ rotate: '-12deg' }] }]} />
//               <View style={st.sign}>
//                 <View style={[st.leafTop, { left: -8, transform: [{ rotate: '-30deg' }] }]} />
//                 <View style={[st.leafTop, { right: -8, transform: [{ rotate: '30deg' }] }]} />
//                 <View style={st.dashes}>
//                   <View style={[st.dash, { transform: [{ rotate: '-25deg' }] }]} />
//                   <View style={[st.dash, { transform: [{ rotate: '25deg' }] }]} />
//                 </View>
//                 <Text style={st.signt}>{'LEVEL ' + LEVEL}</Text>
//                 <View style={st.dashes}>
//                   <View style={[st.dash, { transform: [{ rotate: '25deg' }] }]} />
//                   <View style={[st.dash, { transform: [{ rotate: '-25deg' }] }]} />
//                 </View>
//               </View>
//             </Animated.View>

//             <View style={st.topR}>
//               <View style={st.bpill}>
//                 <Text style={st.bpt}>{hints ?? 0}</Text>
//                 <View style={{ position: 'absolute', right: -14, top: -10 }}>
//                   <Icon n="bulb" s={34} />
//                 </View>
//               </View>
//             </View>
//           </View>

//           {/* question banner */}
//           <View style={st.qWrap}>
//             {loading ? (
//               <ActivityIndicator color={NAVY} />
//             ) : (
//               <Text style={st.q}>{question || 'Could not load the question.'}</Text>
//             )}
//           </View>

//           {!loading && !sessionId && (
//             <TouchableOpacity style={st.retry} onPress={start}>
//               <Text style={st.retryT}>Tap to retry</Text>
//             </TouchableOpacity>
//           )}

//           {/* scene + answers */}
//           <Animated.View style={{ width: '100%', alignItems: 'center', transform: [{ translateX: shake }] }}>
//             <View style={{ marginTop: 6, width: '100%' }}>
//               <RoadScene />
//             </View>

//             <View style={st.grid}>
//               {options.map((opt, i) => (
//                 <PopTouch key={opt} delay={i * 90} disabled={result === 'correct'} onPress={() => onPick(opt)}>
//                   <View
//                     style={[
//                       st.pill,
//                       selected === opt && result === 'correct' && { backgroundColor: '#b6ef63' },
//                       selected === opt && result === 'wrong' && { backgroundColor: '#f5a3a3' },
//                     ]}
//                   >
//                     <Text style={st.opt}>{opt}</Text>
//                   </View>
//                 </PopTouch>
//               ))}
//             </View>
//           </Animated.View>

//           {/* hint / video / skip bar */}
//           <View style={st.barWrap}>
//             <View style={st.bar}>
//               <View style={st.acol}>
//                 <Animated.View style={{ transform: [{ scale: pulseS }] }}>
//                   <PopTouch inner={st.hintBtn} onPress={hint}>
//                     <Icon n="search" s={34} />
//                   </PopTouch>
//                 </Animated.View>
//                 <View style={st.lblRow}>
//                   <Icon n="bulb" s={14} />
//                   <Text style={st.lbl}>{HINT_COST}</Text>
//                 </View>
//               </View>
//               <View style={st.acol}>
//                 <PopTouch inner={st.videoBtn} onPress={video}>
//                   <Icon n="film" s={40} />
//                 </PopTouch>
//                 <View style={st.lblRow}>
//                   <Coin s={12} />
//                   <Text style={st.lbl}>+75</Text>
//                 </View>
//               </View>
//               <View style={st.acol}>
//                 <PopTouch inner={st.skipBtn} onPress={skip}>
//                   <Icon n="play" s={36} />
//                 </PopTouch>
//                 <View style={st.lblRow}>
//                   <Icon n="bulb" s={14} />
//                   <Text style={st.lbl}>{SKIP_COST}</Text>
//                 </View>
//               </View>
//             </View>
//           </View>

//           {!!note && <Text style={st.note}>{note}</Text>}
//         </View>
//       </View>
//     </Stage>
//   );
// }

// const st = StyleSheet.create({
//   wall: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
//   board: { flex: 1, alignItems: 'center', paddingTop: 14 },

//   top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 8, width: '100%' },
//   topL: { flexDirection: 'row', gap: 6, minWidth: 80, marginTop: 10 },
//   topR: { minWidth: 80, alignItems: 'flex-end', marginTop: 14, paddingRight: 14 },
//   round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ffe27a', borderWidth: 2, borderColor: INK, alignItems: 'center', justifyContent: 'center' },

//   signWrap: { alignItems: 'center', paddingTop: 14 },
//   string: { position: 'absolute', top: -6, width: 2, height: 22, backgroundColor: '#9a6a3a' },
//   sign: {
//     flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#a8601f',
//     borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
//     elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
//   },
//   leafTop: { position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: '#5fae3a' },
//   signt: { fontFamily: F, fontSize: 22, fontWeight: 'bold', color: '#fff' },
//   dashes: { gap: 4, justifyContent: 'center' },
//   dash: { width: 10, height: 3, borderRadius: 2, backgroundColor: '#ffc83d' },

//   bpill: { backgroundColor: '#fff', borderRadius: 16, height: 30, minWidth: 58, paddingLeft: 12, paddingRight: 18, justifyContent: 'center', borderWidth: 2, borderColor: '#e6e6e6' },
//   bpt: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK },

//   qWrap: {
//     backgroundColor: CREAM, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 8,
//     marginTop: 6, marginHorizontal: 14, elevation: 4,
//     shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
//   },
//   q: { fontFamily: F, fontSize: 13, fontStyle: 'italic', fontWeight: '600', color: NAVY, textAlign: 'center' },
//   retry: { marginTop: 8, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 6 },
//   retryT: { fontFamily: F, fontWeight: 'bold', color: NAVY },

//   grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 12, width: 290 },
//   pill: {
//     width: 140, height: 50, borderRadius: 25, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center',
//     borderWidth: 3, borderColor: '#fff', elevation: 4,
//     shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
//   },
//   opt: { fontFamily: F, fontSize: 22, fontWeight: '900', color: NAVY },

//   barWrap: { position: 'absolute', left: 14, right: 14, bottom: 8 },
//   bar: {
//     flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 30,
//     backgroundColor: CREAM, borderRadius: 40, borderWidth: 5, borderColor: '#a9cdea',
//     paddingTop: 10, paddingBottom: 8,
//   },
//   acol: { alignItems: 'center' },
//   lblRow: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 24, marginTop: 4, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#6b4423' },
//   lbl: { fontFamily: F, fontSize: 14, fontWeight: 'bold', color: '#fff' },
//   hintBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#a8e22a', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   videoBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f3efe2', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   skipBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f0484f', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },

//   note: { position: 'absolute', bottom: 150, alignSelf: 'center', fontFamily: F, fontSize: 16, fontWeight: 'bold', color: '#c0392b', textAlign: 'center', paddingHorizontal: 20 },
// });
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, Animated, StyleSheet, ActivityIndicator } from 'react-native';
import * as api from './api'; // same helpers the other levels use (hint / skip / reward)
import { F, INK, Stage, Coin, loop } from './BTShared';
import { Icon } from './Art';
import { startLevel22, submitLevel22Answer } from './Btlevel22api';
import { Level22Room, ApplesGame } from './Btlevel22art';

const NAVY = '#10245e';
const CREAM = '#fbf6e9';
const SKY = '#9fc6ea';
const LEVEL = 22;
const HINT_COST = 25;
const SKIP_COST = 50;

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onComplete?: (r: any) => void;
};

// pops in on mount, squishes when pressed
function PopTouch({ inner, onPress, disabled, delay = 0, children }: any) {
  const e = useRef(new Animated.Value(0)).current;
  const sc = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(e, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
    ]).start();
  }, []);
  const to = (v: number) =>
    Animated.spring(sc, { toValue: v, friction: 5, tension: 220, useNativeDriver: true }).start();
  return (
    <Pressable disabled={disabled} onPress={onPress} onPressIn={() => to(0.88)} onPressOut={() => to(1)}>
      <Animated.View style={[inner, { opacity: e, transform: [{ scale: Animated.multiply(e, sc) }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function Btlevel22screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
  const bal = Number(hints) || 0;

  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [note, setNote] = useState('');
  const [resetKey, setResetKey] = useState(0); // changing it rebuilds the apples game

  const busy = useRef(false);
  const done = useRef(false);
  const shake = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });
  const pulseS = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.09] });

  const flash = (m: string, ms = 2200) => {
    setNote(m);
    setTimeout(() => setNote(''), ms);
  };
  const doShake = () =>
    Animated.sequence(
      [10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))
    ).start();

  const start = async () => {
    setLoading(true);
    setNote('');
    try {
      const data = await startLevel22(playerId);
      if (data.success) {
        setSessionId(data.sessionId);
        setQuestion(data.question.text);
      } else {
        setNote(data.error || 'Cannot load level 22');
      }
    } catch (e) {
      console.log('[L22] start failed:', e);
      setNote('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    start();
    loop(sway, 1800);
    loop(pulse, 900);
  }, [playerId]);

  // ---- the game finished: send the moves, the server decides ----
  const onFinish = async (moves: string[]) => {
    if (!sessionId || busy.current || done.current) return;
    busy.current = true;
    try {
      const data = await submitLevel22Answer(playerId, sessionId, moves);
      if (data.success && data.correct) {
        done.current = true;
        setResult('correct');
        flash('Perfect! Nobody left the plate empty.', 1500);
        setTimeout(
          () => onComplete?.({ attempts: data.attempts || 1, skipped: false, correct: true }),
          1300
        );
      } else {
        setResult('wrong');
        doShake();
        flash(data.success ? data.explanation || 'Not quite. Try again!' : data.error || 'Something went wrong', 1800);
        setTimeout(() => {
          setResult(null);
          setResetKey((k) => k + 1);
        }, 1100);
      }
    } catch (e) {
      console.log('[L22] answer failed:', e);
      flash('Network error');
      setTimeout(() => setResetKey((k) => k + 1), 1100);
    } finally {
      busy.current = false;
    }
  };

  // ---- hint / video / skip (same costs as the other levels) ----
  const hint = async () => {
    if (busy.current || done.current) return;
    if (bal < HINT_COST) {
      flash('Need ' + HINT_COST + ' hints. You have ' + bal + '.');
      return;
    }
    busy.current = true;
    try {
      const r: any = await api.hint(LEVEL, playerId, []);
      if (typeof r?.hints === 'number') setHints?.(r.hints);
      flash(
        r?.hint?.text || 'The plate must never be empty. Think about the last apple...',
        3500
      );
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Hint not available');
    } finally {
      busy.current = false;
    }
  };

  const video = async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      const r: any = await api.reward(playerId, 'video');
      if (typeof r?.hints === 'number') setHints?.(r.hints);
    } catch (e) {
    } finally {
      busy.current = false;
    }
  };

  const skip = async () => {
    if (busy.current || done.current) return;
    if (bal < SKIP_COST) {
      flash('Need ' + SKIP_COST + ' hints. You have ' + bal + '.');
      return;
    }
    busy.current = true;
    try {
      const r: any = await api.skip(LEVEL, playerId);
      setHints?.(typeof r?.hints === 'number' ? r.hints : bal - SKIP_COST);
      done.current = true;
      onComplete?.({ attempts: 1, skipped: true });
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Skip not available');
    } finally {
      busy.current = false;
    }
  };

  const frame =
    result === 'correct' ? '#6cc644' : result === 'wrong' ? '#e74c3c' : 'transparent';

  return (
    <Stage bg={SKY}>
      <View style={st.wall}>
        <Level22Room />

        <View style={st.board}>
          {/* top bar */}
          <View style={st.top}>
            <View style={st.topL}>
              <TouchableOpacity style={st.round} onPress={onExit}>
                <Icon n="home" s={16} />
              </TouchableOpacity>
              <TouchableOpacity style={st.round}>
                <Icon n="gear" s={16} />
              </TouchableOpacity>
            </View>

            <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
              <View style={[st.string, { left: 26, transform: [{ rotate: '12deg' }] }]} />
              <View style={[st.string, { right: 26, transform: [{ rotate: '-12deg' }] }]} />
              <View style={st.sign}>
                <View style={[st.leafTop, { left: -8, transform: [{ rotate: '-30deg' }] }]} />
                <View style={[st.leafTop, { right: -8, transform: [{ rotate: '30deg' }] }]} />
                <View style={st.dashes}>
                  <View style={[st.dash, { transform: [{ rotate: '-25deg' }] }]} />
                  <View style={[st.dash, { transform: [{ rotate: '25deg' }] }]} />
                </View>
                <Text style={st.signt}>{'LEVEL ' + LEVEL}</Text>
                <View style={st.dashes}>
                  <View style={[st.dash, { transform: [{ rotate: '25deg' }] }]} />
                  <View style={[st.dash, { transform: [{ rotate: '-25deg' }] }]} />
                </View>
              </View>
            </Animated.View>

            <View style={st.topR}>
              <View style={st.bpill}>
                <Text style={st.bpt}>{hints ?? 0}</Text>
                <View style={{ position: 'absolute', right: -14, top: -10 }}>
                  <Icon n="bulb" s={34} />
                </View>
              </View>
            </View>
          </View>

          {/* question banner */}
          <View style={st.qWrap}>
            {loading ? (
              <ActivityIndicator color={NAVY} />
            ) : (
              <Text style={st.q}>{question || 'Could not load the question.'}</Text>
            )}
          </View>

          {!loading && !sessionId && (
            <TouchableOpacity style={st.retry} onPress={start}>
              <Text style={st.retryT}>Tap to retry</Text>
            </TouchableOpacity>
          )}

          {/* kids + apples + plate */}
          {!!sessionId && (
            <Animated.View style={{ marginTop: 14, alignItems: 'center', transform: [{ translateX: shake }] }}>
              <View style={[st.frame, { borderColor: frame }]}>
                <ApplesGame key={resetKey} onFinish={onFinish} />
              </View>
            </Animated.View>
          )}

          {/* hint / video / skip bar */}
          <View style={st.barWrap}>
            <View style={st.bar}>
              <View style={st.acol}>
                <Animated.View style={{ transform: [{ scale: pulseS }] }}>
                  <PopTouch inner={st.hintBtn} onPress={hint}>
                    <Icon n="search" s={34} />
                  </PopTouch>
                </Animated.View>
                <View style={st.lblRow}>
                  <Icon n="bulb" s={14} />
                  <Text style={st.lbl}>{HINT_COST}</Text>
                </View>
              </View>
              <View style={st.acol}>
                <PopTouch inner={st.videoBtn} onPress={video}>
                  <Icon n="film" s={40} />
                </PopTouch>
                <View style={st.lblRow}>
                  <Coin s={12} />
                  <Text style={st.lbl}>+75</Text>
                </View>
              </View>
              <View style={st.acol}>
                <PopTouch inner={st.skipBtn} onPress={skip}>
                  <Icon n="play" s={36} />
                </PopTouch>
                <View style={st.lblRow}>
                  <Icon n="bulb" s={14} />
                  <Text style={st.lbl}>{SKIP_COST}</Text>
                </View>
              </View>
            </View>
          </View>

          {!!note && <Text style={st.note}>{note}</Text>}
        </View>
      </View>
    </Stage>
  );
}

const st = StyleSheet.create({
  wall: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
  board: { flex: 1, alignItems: 'center', paddingTop: 14 },

  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 8, width: '100%' },
  topL: { flexDirection: 'row', gap: 6, minWidth: 80, marginTop: 10 },
  topR: { minWidth: 80, alignItems: 'flex-end', marginTop: 14, paddingRight: 14 },
  round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ffe27a', borderWidth: 2, borderColor: INK, alignItems: 'center', justifyContent: 'center' },

  signWrap: { alignItems: 'center', paddingTop: 14 },
  string: { position: 'absolute', top: -6, width: 2, height: 22, backgroundColor: '#9a6a3a' },
  sign: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#a8601f',
    borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
  },
  leafTop: { position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: '#5fae3a' },
  signt: { fontFamily: F, fontSize: 22, fontWeight: 'bold', color: '#fff' },
  dashes: { gap: 4, justifyContent: 'center' },
  dash: { width: 10, height: 3, borderRadius: 2, backgroundColor: '#ffc83d' },

  bpill: { backgroundColor: '#fff', borderRadius: 16, height: 30, minWidth: 58, paddingLeft: 12, paddingRight: 18, justifyContent: 'center', borderWidth: 2, borderColor: '#e6e6e6' },
  bpt: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK },

  qWrap: {
    backgroundColor: CREAM, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 8,
    marginTop: 6, marginHorizontal: 14, elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  q: { fontFamily: F, fontSize: 16, fontStyle: 'italic', fontWeight: '600', color: NAVY, textAlign: 'center' },
  retry: { marginTop: 8, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 6 },
  retryT: { fontFamily: F, fontWeight: 'bold', color: NAVY },

  frame: { borderWidth: 3, borderRadius: 26, padding: 0 },

  barWrap: { position: 'absolute', left: 14, right: 14, bottom: 8 },
  bar: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 30,
    backgroundColor: CREAM, borderRadius: 40, borderWidth: 5, borderColor: '#a9cdea',
    paddingTop: 10, paddingBottom: 8,
  },
  acol: { alignItems: 'center' },
  lblRow: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 24, marginTop: 4, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#6b4423' },
  lbl: { fontFamily: F, fontSize: 14, fontWeight: 'bold', color: '#fff' },
  hintBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#a8e22a', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  videoBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f3efe2', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  skipBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f0484f', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },

  note: { position: 'absolute', bottom: 150, alignSelf: 'center', fontFamily: F, fontSize: 16, fontWeight: 'bold', color: '#c0392b', textAlign: 'center', paddingHorizontal: 20 },
});
