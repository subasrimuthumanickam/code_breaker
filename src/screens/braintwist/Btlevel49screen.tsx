
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator, Animated, Pressable, StyleSheet, Text, useWindowDimensions, View,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import {
//   fetchLevel49Info, Level49Info, requestLevel49Clue, requestLevel49Skip, submitLevel49Answer,
// } from './Btlevel49api';
// import { COLORS, LevelSign, RoomBackground, TPicture } from './Btlevel49art';

// type Props = {
//   playerId: string;
//   hints: number;
//   setHints: (n: number) => void;
//   onExit: () => void;
//   onComplete: (info?: { skipped?: boolean; reward?: number }) => void;
// };

// const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

// export default function BTLevel49Screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
//   const { width: W, height: H } = useWindowDimensions();
//   // everything scales with screen height so keyboard + mat always fit
//   const u = Math.max(0.62, Math.min(1, H / 820));
//   const keyW = Math.floor((W - 44) / 10) - 4;
//   const keyH = Math.round(46 * u);
//   const boxW = Math.min(64, Math.floor((W - 56) / 5));

//   const [info, setInfo] = useState<Level49Info | null>(null);
//   const [letters, setLetters] = useState<string[]>([]);
//   const [locked, setLocked] = useState<number[]>([]);
//   const [status, setStatus] = useState<'' | 'ok' | 'bad'>('');
//   const [msg, setMsg] = useState('');
//   const [busy, setBusy] = useState(false);
//   const [loadErr, setLoadErr] = useState('');
//   const [attempt, setAttempt] = useState(0);
//   const shake = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     setLoadErr('');
//     fetchLevel49Info(playerId)
//       .then((d) => {
//         if (!d || !d.ok || !d.length || !Array.isArray(d.rows)) throw new Error(d?.error || 'Bad level data');
//         setInfo(d);
//         setLetters(Array(d.length).fill(''));
//       })
//       .catch((e: any) => setLoadErr(e?.name === 'AbortError' ? 'Server timeout' : e?.message || 'Server connect aagala'));
//   }, [playerId, attempt]);

//   const doShake = () =>
//     Animated.sequence([
//       Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
//       Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
//       Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
//       Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
//     ]).start();

//   const flash = (m: string) => {
//     setMsg(m);
//     setTimeout(() => setMsg(''), 1400);
//   };

//   const check = useCallback(
//     async (arr: string[], lockedNow: number[]) => {
//       setBusy(true);
//       try {
//         const r = await submitLevel49Answer(playerId, arr.join(''));
//         if (r.correct) {
//           setStatus('ok');
//           setMsg('✅ Correct!');
//           setHints(hints + (r.reward || 0));
//           setTimeout(() => onComplete({ reward: r.reward }), 1200);
//         } else {
//           setStatus('bad');
//           setMsg('❌ Wrong! Try again');
//           doShake();
//           setTimeout(() => {
//             setLetters((prev) => prev.map((c, i) => (lockedNow.includes(i) ? c : '')));
//             setStatus('');
//             setMsg('');
//           }, 1100);
//         }
//       } catch {
//         flash('Network error');
//       } finally {
//         setBusy(false);
//       }
//     },
//     [playerId, hints, onComplete, setHints]
//   );

//   const onKey = (k: string) => {
//     if (!info || busy || status === 'ok') return;
//     const idx = letters.findIndex((c) => !c);
//     if (idx === -1) return;
//     const next = [...letters];
//     next[idx] = k;
//     setLetters(next);
//     if (next.every(Boolean)) check(next, locked);
//   };

//   const onBack = () => {
//     if (busy || status === 'ok') return;
//     for (let i = letters.length - 1; i >= 0; i--) {
//       if (letters[i] && !locked.includes(i)) {
//         const next = [...letters];
//         next[i] = '';
//         setLetters(next);
//         return;
//       }
//     }
//   };

//   const onClue = async () => {
//     if (!info || busy || status === 'ok') return;
//     if (hints < info.clueCost) return flash('Hints madhiri illa');
//     try {
//       const r = await requestLevel49Clue(playerId, hints, locked);
//       if (r.ok && r.index !== undefined && r.letter) {
//         setHints(hints - (r.cost || 0));
//         const nextLocked = [...locked, r.index];
//         setLocked(nextLocked);
//         const next = [...letters];
//         next[r.index] = r.letter;
//         setLetters(next);
//         if (next.every(Boolean)) check(next, nextLocked);
//       } else if (r.error === 'not_enough_hints') flash('Hints madhiri illa');
//     } catch {
//       flash('Network error');
//     }
//   };

//   const onSkip = async () => {
//     if (!info || busy || status === 'ok') return;
//     if (hints < info.skipCost) return flash('Hints madhiri illa');
//     try {
//       const r = await requestLevel49Skip(playerId, hints);
//       if (r.ok) {
//         setHints(hints - (r.cost || 0));
//         onComplete({ skipped: true });
//       }
//     } catch {
//       flash('Network error');
//     }
//   };

//   if (!info) {
//     return (
//       <View style={[st.root, st.center]}>
//         <RoomBackground width={W} height={H} />
//         {!loadErr ? (
//           <ActivityIndicator size="large" color={COLORS.navy} />
//         ) : (
//           <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
//             <Text style={[st.msg, { height: undefined, fontSize: 18 }]}>{loadErr}</Text>
//             <Pressable style={st.retry} onPress={() => setAttempt((a) => a + 1)}>
//               <Text style={st.retryText}>Retry</Text>
//             </Pressable>
//             <Pressable style={{ marginTop: 16 }} onPress={onExit}>
//               <Text style={st.msg}>Home</Text>
//             </Pressable>
//           </View>
//         )}
//       </View>
//     );
//   }

//   const boxStyle = (i: number) => [
//     st.box,
//     { width: boxW, height: Math.round(boxW * 1.05) },
//     locked.includes(i) && st.boxLocked,
//     status === 'ok' && st.boxOk,
//     status === 'bad' && st.boxBad,
//   ];

//   return (
//     <View style={st.root}>
//       <RoomBackground width={W} height={H} />

//       {/* top bar */}
//       <View style={st.topBar}>
//         <View style={st.topLeft}>
//           <Pressable style={st.roundBtn} onPress={onExit}>
//             <Ionicons name="home" size={20} color="#222" />
//           </Pressable>
//           <Pressable style={st.roundBtn}>
//             <Ionicons name="settings-sharp" size={20} color="#222" />
//           </Pressable>
//         </View>
//         <LevelSign level={49} />
//         <View style={st.hintPill}>
//           <Text style={st.hintText}>{hints}</Text>
//           <Ionicons name="bulb" size={22} color="#F5B800" />
//         </View>
//       </View>

//       {/* question */}
//       <View style={st.question}>
//         <Text style={st.arrowQ}>‹</Text>
//         <Text style={[st.questionText, { fontSize: Math.round(20 * Math.max(u, 0.85)) }]}>{info.question}</Text>
//         <Text style={st.arrowQ}>›</Text>
//       </View>

//       {/* picture */}
//       <TPicture rows={info.rows} u={u} />

//       {/* answer boxes */}
//       <Animated.View style={[st.boxes, { transform: [{ translateX: shake }] }]}>
//         {letters.map((c, i) => (
//           <View key={i} style={boxStyle(i)}>
//             <Text style={st.boxText}>{c}</Text>
//           </View>
//         ))}
//       </Animated.View>
//       <Text
//         style={[
//           st.msg,
//           status === 'ok' && st.msgOk,
//           status === 'bad' && st.msgBad,
//         ]}
//       >
//         {msg}
//       </Text>

//       {/* keyboard */}
//       <View style={st.keyboard}>
//         {KEY_ROWS.map((row, r) => (
//           <View key={r} style={st.keyRow}>
//             {row.split('').map((k) => (
//               <Pressable
//                 key={k}
//                 onPress={() => onKey(k)}
//                 style={({ pressed }) => [st.key, { width: keyW, height: keyH }, pressed && st.keyActive]}
//               >
//                 <Text style={st.keyText}>{k}</Text>
//               </Pressable>
//             ))}
//             {r === 2 && (
//               <Pressable style={[st.key, st.keyDel, { width: keyW * 1.5, height: keyH }]} onPress={onBack}>
//                 <Ionicons name="backspace-outline" size={22} color="#fff" />
//               </Pressable>
//             )}
//           </View>
//         ))}
//       </View>

//       {/* bottom mat: search (clue) + skip icons */}
//       <View style={st.matWrap}>
//         <View style={[st.mat, { height: Math.round(98 * Math.max(u, 0.8)) }]}>
//           <View style={st.matItem}>
//             <Pressable style={[st.circle, { backgroundColor: COLORS.green, borderColor: COLORS.greenRing }]} onPress={onClue}>
//               <Ionicons name="search" size={32} color="#1D2B15" />
//             </Pressable>
//             <View style={st.cost}>
//               <Ionicons name="bulb" size={13} color={COLORS.yellow} />
//               <Text style={st.costText}>{info.clueCost}</Text>
//             </View>
//           </View>
//           <View style={st.matItem}>
//             <Pressable style={[st.circle, { backgroundColor: COLORS.red, borderColor: '#fff' }]} onPress={onSkip}>
//               <Ionicons name="play" size={30} color="#fff" />
//             </Pressable>
//             <View style={st.cost}>
//               <Ionicons name="bulb" size={13} color={COLORS.yellow} />
//               <Text style={st.costText}>{info.skipCost}</Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const st = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#E3F3FC', overflow: 'hidden' },
//   center: { alignItems: 'center', justifyContent: 'center' },
//   topBar: {
//     flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
//     paddingTop: 22, paddingHorizontal: 10,
//   },
//   topLeft: { flexDirection: 'row', width: 92, marginTop: 8 },
//   roundBtn: {
//     width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.yellow,
//     borderWidth: 2, borderColor: '#222', alignItems: 'center', justifyContent: 'center', marginRight: 6,
//   },
//   hintPill: {
//     flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20,
//     paddingHorizontal: 12, paddingVertical: 4, marginTop: 12, minWidth: 80, justifyContent: 'center',
//   },
//   hintText: { fontSize: 20, fontWeight: '900', color: '#111', marginRight: 4 },
//   question: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     backgroundColor: COLORS.cream, borderRadius: 26, marginHorizontal: 14, marginTop: 10, marginBottom: 8,
//     paddingVertical: 6, paddingHorizontal: 14,
//   },
//   questionText: { flex: 1, fontStyle: 'italic', color: COLORS.navy, textAlign: 'center', fontFamily: 'serif' },
//   arrowQ: { color: '#F5A623', fontSize: 28, fontWeight: '900', marginTop: -4 },
//   boxes: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
//   box: {
//     borderRadius: 12, backgroundColor: COLORS.cream, borderWidth: 3, borderColor: COLORS.navy,
//     marginHorizontal: 4, alignItems: 'center', justifyContent: 'center',
//   },
//   boxLocked: { backgroundColor: '#D8F2B0', borderColor: '#5E9B1E' },
//   boxOk: { backgroundColor: '#B9F29A', borderColor: '#2E9E1E' },
//   boxBad: { backgroundColor: '#FFC9C9', borderColor: '#D83A3A' },
//   boxText: { fontSize: 30, fontWeight: '900', color: COLORS.navy },
//   msg: { textAlign: 'center', height: 26, marginTop: 2, fontWeight: '800', fontSize: 16, color: COLORS.navy },
//   msgOk: { color: '#1E8E1E', fontSize: 22, fontWeight: '900' },
//   msgBad: { color: '#D83A3A', fontSize: 22, fontWeight: '900' },
//   keyboard: {
//     marginHorizontal: 8, paddingVertical: 6, paddingHorizontal: 2,
//     backgroundColor: 'rgba(245,233,211,0.9)', borderRadius: 18, borderWidth: 3, borderColor: COLORS.matBorder,
//   },
//   keyRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 3 },
//   key: {
//     marginHorizontal: 2, borderRadius: 9, backgroundColor: '#fff',
//     alignItems: 'center', justifyContent: 'center', borderBottomWidth: 3, borderBottomColor: COLORS.keyBorder,
//   },
//   keyActive: { backgroundColor: COLORS.yellow },
//   keyDel: { backgroundColor: '#F0527A', borderBottomColor: '#B93158' },
//   keyText: { fontSize: 20, fontWeight: '900', color: COLORS.navy },
//   matWrap: { position: 'absolute', left: 0, right: 0, bottom: 10, alignItems: 'center' },
//   mat: {
//     width: '78%', backgroundColor: COLORS.mat, borderRadius: 60, borderWidth: 6, borderColor: COLORS.matBorder,
//     flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center',
//   },
//   matItem: { alignItems: 'center' },
//   circle: {
//     width: 62, height: 62, borderRadius: 31, borderWidth: 5, alignItems: 'center', justifyContent: 'center',
//     elevation: 4,
//   },
//   cost: {
//     flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.brown, borderRadius: 12,
//     paddingHorizontal: 10, paddingVertical: 2, marginTop: -8,
//   },
//   costText: { color: '#fff', fontWeight: '800', marginLeft: 3, fontSize: 14 },
//   retry: { marginTop: 14, backgroundColor: COLORS.green, borderRadius: 24, paddingHorizontal: 28, paddingVertical: 10 },
//   retryText: { color: '#1D2B15', fontWeight: '900', fontSize: 20 },
// });
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Animated, Pressable, StyleSheet, Text, useWindowDimensions, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchLevel49Info, Level49Info, requestLevel49Clue, requestLevel49Skip, submitLevel49Answer,
} from './Btlevel49api';
import { COLORS, LevelSign, RoomBackground, TPicture } from './Btlevel49art';

type Props = {
  playerId: string;
  hints: number;
  setHints: (n: number) => void;
  onExit: () => void;
  onComplete: (info?: { skipped?: boolean; reward?: number }) => void;
};

const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

// question shown on top (this replaces the question that comes from the server)
const QUESTION_TEXT = 'Find the word in this picture!';

export default function BTLevel49Screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  // everything scales with screen height so keyboard + mat always fit
  const u = Math.max(0.62, Math.min(1, H / 820));
  const keyW = Math.floor((W - 44) / 10) - 4;
  const keyH = Math.round(46 * u);
  const boxW = Math.min(64, Math.floor((W - 56) / 5));

  const [info, setInfo] = useState<Level49Info | null>(null);
  const [letters, setLetters] = useState<string[]>([]);
  const [locked, setLocked] = useState<number[]>([]);
  const [status, setStatus] = useState<'' | 'ok' | 'bad'>('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [loadErr, setLoadErr] = useState('');
  const [attempt, setAttempt] = useState(0);
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLoadErr('');
    fetchLevel49Info(playerId)
      .then((d) => {
        if (!d || !d.ok || !d.length || !Array.isArray(d.rows)) throw new Error(d?.error || 'Bad level data');
        setInfo(d);
        setLetters(Array(d.length).fill(''));
      })
      .catch((e: any) => setLoadErr(e?.name === 'AbortError' ? 'Server timeout' : e?.message || 'Server connect aagala'));
  }, [playerId, attempt]);

  const doShake = () =>
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();

  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(''), 1400);
  };

  const check = useCallback(
    async (arr: string[], lockedNow: number[]) => {
      setBusy(true);
      try {
        const r = await submitLevel49Answer(playerId, arr.join(''));
        if (r.correct) {
          setStatus('ok');
          setMsg('✅ Correct!');
          setHints(hints + (r.reward || 0));
          setTimeout(() => onComplete({ reward: r.reward }), 1200);
        } else {
          setStatus('bad');
          setMsg('❌ Wrong! Try again');
          doShake();
          setTimeout(() => {
            setLetters((prev) => prev.map((c, i) => (lockedNow.includes(i) ? c : '')));
            setStatus('');
            setMsg('');
          }, 1100);
        }
      } catch {
        flash('Network error');
      } finally {
        setBusy(false);
      }
    },
    [playerId, hints, onComplete, setHints]
  );

  const onKey = (k: string) => {
    if (!info || busy || status === 'ok') return;
    const idx = letters.findIndex((c) => !c);
    if (idx === -1) return;
    const next = [...letters];
    next[idx] = k;
    setLetters(next);
    if (next.every(Boolean)) check(next, locked);
  };

  const onBack = () => {
    if (busy || status === 'ok') return;
    for (let i = letters.length - 1; i >= 0; i--) {
      if (letters[i] && !locked.includes(i)) {
        const next = [...letters];
        next[i] = '';
        setLetters(next);
        return;
      }
    }
  };

  const onClue = async () => {
    if (!info || busy || status === 'ok') return;
    if (hints < info.clueCost) return flash('Hints madhiri illa');
    try {
      const r = await requestLevel49Clue(playerId, hints, locked);
      if (r.ok && r.index !== undefined && r.letter) {
        setHints(hints - (r.cost || 0));
        const nextLocked = [...locked, r.index];
        setLocked(nextLocked);
        const next = [...letters];
        next[r.index] = r.letter;
        setLetters(next);
        if (next.every(Boolean)) check(next, nextLocked);
      } else if (r.error === 'not_enough_hints') flash('Hints madhiri illa');
    } catch {
      flash('Network error');
    }
  };

  const onSkip = async () => {
    if (!info || busy || status === 'ok') return;
    if (hints < info.skipCost) return flash('Hints madhiri illa');
    try {
      const r = await requestLevel49Skip(playerId, hints);
      if (r.ok) {
        setHints(hints - (r.cost || 0));
        onComplete({ skipped: true });
      }
    } catch {
      flash('Network error');
    }
  };

  if (!info) {
    return (
      <View style={[st.root, st.center]}>
        <RoomBackground width={W} height={H} />
        {!loadErr ? (
          <ActivityIndicator size="large" color={COLORS.navy} />
        ) : (
          <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
            <Text style={[st.msg, { height: undefined, fontSize: 18 }]}>{loadErr}</Text>
            <Pressable style={st.retry} onPress={() => setAttempt((a) => a + 1)}>
              <Text style={st.retryText}>Retry</Text>
            </Pressable>
            <Pressable style={{ marginTop: 16 }} onPress={onExit}>
              <Text style={st.msg}>Home</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  const boxStyle = (i: number) => [
    st.box,
    { width: boxW, height: Math.round(boxW * 1.05) },
    locked.includes(i) && st.boxLocked,
    status === 'ok' && st.boxOk,
    status === 'bad' && st.boxBad,
  ];

  return (
    <View style={st.root}>
      <RoomBackground width={W} height={H} />

      {/* top bar */}
      <View style={st.topBar}>
        <View style={st.topLeft}>
          <Pressable style={st.roundBtn} onPress={onExit}>
            <Ionicons name="home" size={20} color="#222" />
          </Pressable>
          <Pressable style={st.roundBtn}>
            <Ionicons name="settings-sharp" size={20} color="#222" />
          </Pressable>
        </View>
        <LevelSign level={49} />
        <View style={st.hintPill}>
          <Text style={st.hintText}>{hints}</Text>
          <Ionicons name="bulb" size={22} color="#F5B800" />
        </View>
      </View>

      {/* question */}
      <View style={st.question}>
        <Text style={st.arrowQ}>‹</Text>
        <Text style={[st.questionText, { fontSize: Math.round(20 * Math.max(u, 0.85)) }]}>{QUESTION_TEXT}</Text>
        <Text style={st.arrowQ}>›</Text>
      </View>

      {/* picture */}
      <TPicture rows={info.rows} u={u} />

      {/* answer boxes */}
      <Animated.View style={[st.boxes, { transform: [{ translateX: shake }] }]}>
        {letters.map((c, i) => (
          <View key={i} style={boxStyle(i)}>
            <Text style={st.boxText}>{c}</Text>
          </View>
        ))}
      </Animated.View>
      <Text
        style={[
          st.msg,
          status === 'ok' && st.msgOk,
          status === 'bad' && st.msgBad,
        ]}
      >
        {msg}
      </Text>

      {/* keyboard */}
      <View style={st.keyboard}>
        {KEY_ROWS.map((row, r) => (
          <View key={r} style={st.keyRow}>
            {row.split('').map((k) => (
              <Pressable
                key={k}
                onPress={() => onKey(k)}
                style={({ pressed }) => [st.key, { width: keyW, height: keyH }, pressed && st.keyActive]}
              >
                <Text style={st.keyText}>{k}</Text>
              </Pressable>
            ))}
            {r === 2 && (
              <Pressable style={[st.key, st.keyDel, { width: keyW * 1.5, height: keyH }]} onPress={onBack}>
                <Ionicons name="backspace-outline" size={22} color="#fff" />
              </Pressable>
            )}
          </View>
        ))}
      </View>

      {/* bottom mat: search (clue) + skip icons */}
      <View style={st.matWrap}>
        <View style={[st.mat, { height: Math.round(98 * Math.max(u, 0.8)) }]}>
          <View style={st.matItem}>
            <Pressable style={[st.circle, { backgroundColor: COLORS.green, borderColor: COLORS.greenRing }]} onPress={onClue}>
              <Ionicons name="search" size={32} color="#1D2B15" />
            </Pressable>
            <View style={st.cost}>
              <Ionicons name="bulb" size={13} color={COLORS.yellow} />
              <Text style={st.costText}>{info.clueCost}</Text>
            </View>
          </View>
          <View style={st.matItem}>
            <Pressable style={[st.circle, { backgroundColor: COLORS.red, borderColor: '#fff' }]} onPress={onSkip}>
              <Ionicons name="play" size={30} color="#fff" />
            </Pressable>
            <View style={st.cost}>
              <Ionicons name="bulb" size={13} color={COLORS.yellow} />
              <Text style={st.costText}>{info.skipCost}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#E3F3FC', overflow: 'hidden' },
  center: { alignItems: 'center', justifyContent: 'center' },
  topBar: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingTop: 22, paddingHorizontal: 10,
  },
  topLeft: { flexDirection: 'row', width: 92, marginTop: 8 },
  roundBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.yellow,
    borderWidth: 2, borderColor: '#222', alignItems: 'center', justifyContent: 'center', marginRight: 6,
  },
  hintPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4, marginTop: 12, minWidth: 80, justifyContent: 'center',
  },
  hintText: { fontSize: 20, fontWeight: '900', color: '#111', marginRight: 4 },
  question: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.cream, borderRadius: 26, marginHorizontal: 14, marginTop: 10, marginBottom: 8,
    paddingVertical: 6, paddingHorizontal: 14,
  },
  questionText: { flex: 1, fontStyle: 'italic', color: COLORS.navy, textAlign: 'center', fontFamily: 'serif' },
  arrowQ: { color: '#F5A623', fontSize: 28, fontWeight: '900', marginTop: -4 },
  boxes: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  box: {
    borderRadius: 12, backgroundColor: COLORS.cream, borderWidth: 3, borderColor: COLORS.navy,
    marginHorizontal: 4, alignItems: 'center', justifyContent: 'center',
  },
  boxLocked: { backgroundColor: '#D8F2B0', borderColor: '#5E9B1E' },
  boxOk: { backgroundColor: '#B9F29A', borderColor: '#2E9E1E' },
  boxBad: { backgroundColor: '#FFC9C9', borderColor: '#D83A3A' },
  boxText: { fontSize: 30, fontWeight: '900', color: COLORS.navy },
  msg: { textAlign: 'center', height: 26, marginTop: 2, fontWeight: '800', fontSize: 16, color: COLORS.navy },
  msgOk: { color: '#1E8E1E', fontSize: 22, fontWeight: '900' },
  msgBad: { color: '#D83A3A', fontSize: 22, fontWeight: '900' },
  keyboard: {
    marginHorizontal: 8, paddingVertical: 6, paddingHorizontal: 2,
    backgroundColor: 'rgba(245,233,211,0.9)', borderRadius: 18, borderWidth: 3, borderColor: COLORS.matBorder,
  },
  keyRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 3 },
  key: {
    marginHorizontal: 2, borderRadius: 9, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', borderBottomWidth: 3, borderBottomColor: COLORS.keyBorder,
  },
  keyActive: { backgroundColor: COLORS.yellow },
  keyDel: { backgroundColor: '#F0527A', borderBottomColor: '#B93158' },
  keyText: { fontSize: 20, fontWeight: '900', color: COLORS.navy },
  matWrap: { position: 'absolute', left: 0, right: 0, bottom: 10, alignItems: 'center' },
  mat: {
    width: '78%', backgroundColor: COLORS.mat, borderRadius: 60, borderWidth: 6, borderColor: COLORS.matBorder,
    flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center',
  },
  matItem: { alignItems: 'center' },
  circle: {
    width: 62, height: 62, borderRadius: 31, borderWidth: 5, alignItems: 'center', justifyContent: 'center',
    elevation: 4,
  },
  cost: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.brown, borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 2, marginTop: -8,
  },
  costText: { color: '#fff', fontWeight: '800', marginLeft: 3, fontSize: 14 },
  retry: { marginTop: 14, backgroundColor: COLORS.green, borderRadius: 24, paddingHorizontal: 28, paddingVertical: 10 },
  retryText: { color: '#1D2B15', fontWeight: '900', fontSize: 20 },
});
