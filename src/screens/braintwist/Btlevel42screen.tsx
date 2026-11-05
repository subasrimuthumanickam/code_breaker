
// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   PanResponder,
//   Pressable,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import * as api from './api';
// import {
//   getLevel42Config,
//   Level42Config,
//   SliceConfig,
//   submitLevel42Answer,
// } from './Btlevel42api';
// import { PizzaSlice, THEME } from './Btlevel42art';

// type Props = {
//   playerId: string | number;
//   hints?: number;
//   setHints?: (n: number) => void;
//   onExit?: () => void;
//   onComplete?: (r: any) => void;
// };

// const SKIP_COST = 50;
// const SCALE = 0.85;
// const AREA_W = 300;
// const AREA_H = 230;
// const DRAG_THRESHOLD = 20;

// /* ---------- cozy room background (same theme as other levels) ---------- */
// const RoomBg = () => (
//   <View pointerEvents="none" style={StyleSheet.absoluteFill}>
//     <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '45%', backgroundColor: 'rgba(255,255,255,0.22)' }} />
//     {/* window */}
//     <View style={{ position: 'absolute', left: -4, top: '8%', width: 76, height: 170, backgroundColor: '#f0b878', borderWidth: 5, borderColor: '#e2a35e', borderRadius: 4, overflow: 'hidden' }}>
//       <View style={{ flex: 1, backgroundColor: '#8fd3f6' }}>
//         <View style={{ position: 'absolute', top: 24, left: 8, width: 44, height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.9)' }} />
//         <View style={{ position: 'absolute', left: 6, bottom: -14, width: 44, height: 60, borderRadius: 30, backgroundColor: '#7bc65a' }} />
//       </View>
//       <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 4, backgroundColor: '#e2a35e' }} />
//     </View>
//     {/* picture frame */}
//     <View style={{ position: 'absolute', right: '7%', top: '9%', width: 60, height: 68, backgroundColor: '#cfe6f3', borderWidth: 4, borderColor: '#8fc3d8' }}>
//       <View style={{ alignSelf: 'center', marginTop: 12, width: 30, height: 30, borderRadius: 15, backgroundColor: '#f6a43c', borderWidth: 4, borderColor: '#f7c36a' }} />
//     </View>
//     {/* bookshelf */}
//     <View style={{ position: 'absolute', right: 0, top: '40%', width: 54, height: '26%', backgroundColor: '#e0a85e', borderLeftWidth: 5, borderTopWidth: 5, borderColor: '#c98d4d' }}>
//       <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 6, borderBottomWidth: 5, borderColor: '#c98d4d' }}>
//         <View style={{ width: 10, height: 38, backgroundColor: '#58a6c8', marginRight: 1 }} />
//         <View style={{ width: 9, height: 44, backgroundColor: '#f2c14e', marginRight: 1 }} />
//         <View style={{ width: 10, height: 36, backgroundColor: '#7b6bd0' }} />
//       </View>
//     </View>
//     {/* floor */}
//     <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '28%', backgroundColor: '#e9b575' }} />
//     <View style={{ position: 'absolute', left: 0, right: 0, bottom: '28%', height: 12, backgroundColor: '#e8b8b0' }} />
//   </View>
// );

// /* ---------- draggable top slice ---------- */
// const DraggableSlice = ({
//   slice,
//   active,
//   onGrab,
//   onMoved,
// }: {
//   slice: SliceConfig;
//   active: boolean;
//   onGrab: (id: number) => void;
//   onMoved: (id: number) => void;
// }) => {
//   const pan = useRef(new Animated.ValueXY()).current;
//   const moved = useRef(false);

//   const responder = useMemo(
//     () =>
//       PanResponder.create({
//         onStartShouldSetPanResponder: () => true,
//         onPanResponderGrant: () => {
//           pan.extractOffset();
//           onGrab(slice.id);
//         },
//         onPanResponderMove: (e, g) => {
//           pan.setValue({ x: g.dx, y: g.dy });
//           if (!moved.current && Math.hypot(g.dx, g.dy) > DRAG_THRESHOLD) {
//             moved.current = true;
//             onMoved(slice.id);
//           }
//         },
//         onPanResponderRelease: () => pan.flattenOffset(),
//         onPanResponderTerminate: () => pan.flattenOffset(),
//       }),
//     [pan, slice.id, onGrab, onMoved]
//   );

//   return (
//     <Animated.View
//       {...responder.panHandlers}
//       style={{
//         position: 'absolute',
//         left: slice.x,
//         top: slice.y,
//         zIndex: active ? 50 : 10,
//         elevation: active ? 50 : 10,
//         transform: [...pan.getTranslateTransform(), { rotate: `${slice.rot}deg` }],
//       }}
//     >
//       <PizzaSlice size={SCALE} />
//     </Animated.View>
//   );
// };

// /* ---------- screen ---------- */
// export default function Btlevel42screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
//   const userId = String(playerId);
//   const bal = Number(hints) || 0;

//   const [config, setConfig] = useState<Level42Config | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [count, setCount] = useState(0);
//   const [submitting, setSubmitting] = useState(false);
//   const [solved, setSolved] = useState(false);
//   const [wrong, setWrong] = useState(false);
//   const [activeId, setActiveId] = useState<number | null>(null);
//   const movedIds = useRef<Set<number>>(new Set());
//   const busy = useRef(false);
//   const lastResult = useRef<any>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         setConfig(await getLevel42Config(userId));
//       } catch (e: any) {
//         Alert.alert('Error', e.message || 'Could not load level');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [userId]);

//   const onGrab = useCallback((id: number) => setActiveId(id), []);
//   const onMoved = useCallback((id: number) => {
//     movedIds.current.add(id);
//   }, []);

//   const handleSubmit = async () => {
//     if (submitting || solved) return;
//     setSubmitting(true);
//     try {
//       const res = await submitLevel42Answer(userId, count, movedIds.current.size);
//       if (res.correct) {
//         lastResult.current = res;
//         setSolved(true);
//         setTimeout(() => onComplete?.({ ...res, skipped: false }), 1500);
//       } else {
//         setWrong(true);
//         setTimeout(() => setWrong(false), 900);
//       }
//     } catch (e: any) {
//       Alert.alert('Error', e.message || 'Submit failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleClue = () =>
//     Alert.alert('Clue 💡', 'Some slices are hiding under other slices. Try dragging them!');

//   const handleSkip = async () => {
//     if (busy.current || solved) return;
//     if (bal < SKIP_COST) {
//       Alert.alert('Not enough hints', `Need ${SKIP_COST} hints. You have ${bal}.`);
//       return;
//     }
//     busy.current = true;
//     try {
//       const r: any = await api.skip(42, playerId as any);
//       setHints?.(typeof r?.hints === 'number' ? r.hints : bal - SKIP_COST);
//       onComplete?.({ ...r, skipped: true, attempts: 1 });
//     } catch (e: any) {
//       Alert.alert('Error', e?.status === 402 ? 'Not enough hints' : 'Network error');
//     } finally {
//       busy.current = false;
//     }
//   };

//   if (loading || !config) {
//     return (
//       <View style={[styles.root, styles.center]}>
//         <RoomBg />
//         <ActivityIndicator size="large" color={THEME.navy} />
//       </View>
//     );
//   }

//   const hiddenSlices = config.slices.filter((s) => s.hasHidden);

//   return (
//     <SafeAreaView style={styles.root}>
//       <RoomBg />

//       {/* header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Pressable style={styles.roundBtn} onPress={() => onExit?.()}>
//             <Text style={styles.roundTxt}>🏠</Text>
//           </Pressable>
//           <Pressable style={styles.roundBtn}>
//             <Text style={styles.roundTxt}>⚙️</Text>
//           </Pressable>
//         </View>
//         <View style={styles.sign}>
//           <Text style={styles.signTxt}>LEVEL 42</Text>
//         </View>
//         <View style={styles.bulbPill}>
//           <Text style={styles.bulbTxt}>{bal}</Text>
//           <Text>💡</Text>
//         </View>
//       </View>

//       {/* question */}
//       <View style={styles.questionPill}>
//         <Text style={styles.questionTxt}>{config.question}</Text>
//       </View>

//       {/* notebook card */}
//       <View style={styles.paper}>
//         <View style={styles.holes}>
//           {Array.from({ length: 8 }).map((_, i) => (
//             <View key={i} style={styles.hole} />
//           ))}
//         </View>

//         <View style={styles.playArea}>
//           {/* hidden slices: EXACT same position + rotation + size as the top slice, so fully covered */}
//           {hiddenSlices.map((s) => (
//             <View
//               key={`h${s.id}`}
//               style={{
//                 position: 'absolute',
//                 left: s.x,
//                 top: s.y,
//                 zIndex: 1,
//                 elevation: 1,
//                 transform: [{ rotate: `${s.rot}deg` }],
//               }}
//             >
//               <PizzaSlice size={SCALE} />
//             </View>
//           ))}

//           {config.slices.map((s) => (
//             <DraggableSlice
//               key={s.id}
//               slice={s}
//               active={activeId === s.id}
//               onGrab={onGrab}
//               onMoved={onMoved}
//             />
//           ))}
//         </View>

//         {/* counter */}
//         <View style={styles.counterRow}>
//           <Pressable style={styles.counterBtn} onPress={() => setCount((c) => Math.max(0, c - 1))}>
//             <Text style={styles.counterBtnTxt}>−</Text>
//           </Pressable>
//           <Text style={[styles.counterVal, wrong && { color: THEME.red }]}>
//             {wrong ? '✗' : solved ? '✓' : count}
//           </Text>
//           <Pressable style={styles.counterBtn} onPress={() => setCount((c) => Math.min(99, c + 1))}>
//             <Text style={styles.counterBtnTxt}>+</Text>
//           </Pressable>
//         </View>

//         <Pressable
//           style={[styles.submitBtn, (submitting || solved) && { opacity: 0.6 }]}
//           onPress={handleSubmit}
//           disabled={submitting || solved}
//         >
//           {submitting ? (
//             <ActivityIndicator color={THEME.navy} />
//           ) : (
//             <Text style={styles.submitTxt}>SUBMIT</Text>
//           )}
//         </Pressable>
//       </View>

//       {/* bottom bar: Clue + Skip (in normal flow, never covers the counter) */}
//       <View style={styles.bottomBar}>
//         <View style={styles.actionCol}>
//           <Pressable style={[styles.actionBtn, { backgroundColor: THEME.green }]} onPress={handleClue}>
//             <Text style={styles.actionIcon}>🔍</Text>
//           </Pressable>
//           <View style={styles.label}>
//             <Text style={styles.labelTxt}>Clue</Text>
//           </View>
//         </View>
//         <View style={styles.actionCol}>
//           <Pressable style={[styles.actionBtn, { backgroundColor: THEME.red }]} onPress={handleSkip}>
//             <Text style={[styles.actionIcon, { color: '#fff' }]}>▶</Text>
//           </Pressable>
//           <View style={styles.label}>
//             <Text style={styles.labelTxt}>💡 {SKIP_COST}</Text>
//           </View>
//         </View>
//       </View>

//       {solved && (
//         <View style={styles.overlay}>
//           <View style={styles.modal}>
//             <Text style={styles.modalTitle}>Correct! 🍕</Text>
//             <Text style={styles.modalSub}>Total slices: {count}</Text>
//             <Pressable
//               style={styles.nextBtn}
//               onPress={() => onComplete?.({ ...lastResult.current, skipped: false })}
//             >
//               <Text style={styles.nextTxt}>NEXT LEVEL</Text>
//             </Pressable>
//           </View>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: THEME.bg, overflow: 'hidden' },
//   center: { alignItems: 'center', justifyContent: 'center' },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 14,
//     paddingTop: 12,
//   },
//   headerLeft: { flexDirection: 'row', gap: 8 },
//   roundBtn: {
//     width: 44, height: 44, borderRadius: 22,
//     backgroundColor: THEME.yellow, borderWidth: 3, borderColor: THEME.navy,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   roundTxt: { fontSize: 19 },
//   sign: {
//     backgroundColor: THEME.sign, borderColor: '#d98b3d', borderWidth: 3,
//     borderRadius: 8, paddingHorizontal: 16, paddingVertical: 7,
//   },
//   signTxt: { color: '#fff', fontWeight: '900', fontSize: 19 },
//   bulbPill: {
//     flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff',
//     borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
//   },
//   bulbTxt: { fontWeight: '900', fontSize: 18, color: THEME.navy },

//   questionPill: {
//     alignSelf: 'center', marginTop: 12, backgroundColor: THEME.pill,
//     borderRadius: 28, paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 16,
//     elevation: 4,
//   },
//   questionTxt: { color: THEME.navy, fontWeight: '900', fontSize: 19, textAlign: 'center' },

//   paper: {
//     flex: 1,
//     marginTop: 12,
//     marginHorizontal: 14,
//     backgroundColor: THEME.paper,
//     borderRadius: 14,
//     paddingBottom: 12,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     elevation: 4,
//   },
//   holes: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: -8 },
//   hole: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#BCD8F0' },
//   playArea: { width: AREA_W, height: AREA_H },

//   counterRow: { flexDirection: 'row', alignItems: 'center', gap: 28 },
//   counterBtn: {
//     width: 42, height: 42, borderRadius: 21, backgroundColor: '#4E9BC4',
//     borderWidth: 2, borderColor: THEME.navy, alignItems: 'center', justifyContent: 'center',
//   },
//   counterBtnTxt: { color: THEME.navy, fontSize: 26, fontWeight: '900', marginTop: -2 },
//   counterVal: { fontSize: 32, fontWeight: '900', color: THEME.navy, minWidth: 50, textAlign: 'center' },
//   submitBtn: {
//     paddingHorizontal: 30, paddingVertical: 9, borderRadius: 20,
//     borderWidth: 3, borderColor: THEME.navy, backgroundColor: '#fff',
//   },
//   submitTxt: { fontWeight: '900', fontSize: 18, color: THEME.navy },

//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     backgroundColor: THEME.pill,
//     borderRadius: 32,
//     borderWidth: 5,
//     borderColor: '#9CC4E8',
//     paddingVertical: 8,
//     marginHorizontal: 40,
//     marginTop: 10,
//     marginBottom: 14,
//   },
//   actionCol: { alignItems: 'center' },
//   actionBtn: {
//     width: 54, height: 54, borderRadius: 27, borderWidth: 4, borderColor: '#fff',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   actionIcon: { fontSize: 24 },
//   label: {
//     marginTop: 4, backgroundColor: THEME.brown, borderRadius: 14,
//     paddingHorizontal: 14, paddingVertical: 2,
//   },
//   labelTxt: { color: '#fff', fontWeight: '900', fontSize: 13 },

//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.55)',
//     alignItems: 'center', justifyContent: 'center', zIndex: 999,
//   },
//   modal: {
//     backgroundColor: THEME.pill, borderRadius: 22, padding: 26, alignItems: 'center',
//     borderWidth: 4, borderColor: THEME.sign, width: '80%',
//   },
//   modalTitle: { fontSize: 28, fontWeight: '900', color: THEME.navy },
//   modalSub: { fontSize: 16, color: THEME.navy, marginVertical: 10 },
//   nextBtn: {
//     backgroundColor: THEME.green, borderRadius: 20, paddingHorizontal: 26, paddingVertical: 12,
//     borderWidth: 3, borderColor: THEME.navy,
//   },
//   nextTxt: { fontWeight: '900', color: THEME.navy, fontSize: 16 },
// });
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  PanResponder,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as api from './api';
import {
  getLevel42Config,
  Level42Config,
  SliceConfig,
  submitLevel42Answer,
} from './Btlevel42api';
import { PizzaSlice, THEME } from './Btlevel42art';

type Props = {
  playerId: string | number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onComplete?: (r: any) => void;
};

const SKIP_COST = 50;
const SCALE = 0.85;
const AREA_W = 300;
const AREA_H = 230;
const DRAG_THRESHOLD = 20;

/* ---------- ring layout (like the reference picture) ----------
   Slices stand in a circle, tips pointing to the centre and crusts
   pointing outwards. Tune these 4 numbers if you want a different look. */
const SLICE_W = 78;     // visible width of one slice at SCALE
const SLICE_H = 92;     // visible height of one slice at SCALE
const RING_R = 58;      // distance from the centre to the middle of each slice
const RING_START = 180; // angle of the first slice (180 = bottom, 0 = top)

const layoutRing = (list: SliceConfig[]): SliceConfig[] => {
  const n = list.length || 1;
  return list.map((s, i) => {
    const phi = RING_START + (i * 360) / n; // degrees, clockwise from the top
    const rad = (phi * Math.PI) / 180;
    const cx = AREA_W / 2 + RING_R * Math.sin(rad);
    const cy = AREA_H / 2 - RING_R * Math.cos(rad);
    return { ...s, x: cx - SLICE_W / 2, y: cy - SLICE_H / 2, rot: phi };
  });
};

/* ---------- cozy room background (same theme as other levels) ---------- */
const RoomBg = () => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '45%', backgroundColor: 'rgba(255,255,255,0.22)' }} />
    {/* window */}
    <View style={{ position: 'absolute', left: -4, top: '8%', width: 76, height: 170, backgroundColor: '#f0b878', borderWidth: 5, borderColor: '#e2a35e', borderRadius: 4, overflow: 'hidden' }}>
      <View style={{ flex: 1, backgroundColor: '#8fd3f6' }}>
        <View style={{ position: 'absolute', top: 24, left: 8, width: 44, height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.9)' }} />
        <View style={{ position: 'absolute', left: 6, bottom: -14, width: 44, height: 60, borderRadius: 30, backgroundColor: '#7bc65a' }} />
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 4, backgroundColor: '#e2a35e' }} />
    </View>
    {/* picture frame */}
    <View style={{ position: 'absolute', right: '7%', top: '9%', width: 60, height: 68, backgroundColor: '#cfe6f3', borderWidth: 4, borderColor: '#8fc3d8' }}>
      <View style={{ alignSelf: 'center', marginTop: 12, width: 30, height: 30, borderRadius: 15, backgroundColor: '#f6a43c', borderWidth: 4, borderColor: '#f7c36a' }} />
    </View>
    {/* bookshelf */}
    <View style={{ position: 'absolute', right: 0, top: '40%', width: 54, height: '26%', backgroundColor: '#e0a85e', borderLeftWidth: 5, borderTopWidth: 5, borderColor: '#c98d4d' }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 6, borderBottomWidth: 5, borderColor: '#c98d4d' }}>
        <View style={{ width: 10, height: 38, backgroundColor: '#58a6c8', marginRight: 1 }} />
        <View style={{ width: 9, height: 44, backgroundColor: '#f2c14e', marginRight: 1 }} />
        <View style={{ width: 10, height: 36, backgroundColor: '#7b6bd0' }} />
      </View>
    </View>
    {/* floor */}
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '28%', backgroundColor: '#e9b575' }} />
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: '28%', height: 12, backgroundColor: '#e8b8b0' }} />
  </View>
);

/* ---------- draggable top slice ---------- */
const DraggableSlice = ({
  slice,
  active,
  onGrab,
  onMoved,
}: {
  slice: SliceConfig;
  active: boolean;
  onGrab: (id: number) => void;
  onMoved: (id: number) => void;
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const moved = useRef(false);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.extractOffset();
          onGrab(slice.id);
        },
        onPanResponderMove: (e, g) => {
          pan.setValue({ x: g.dx, y: g.dy });
          if (!moved.current && Math.hypot(g.dx, g.dy) > DRAG_THRESHOLD) {
            moved.current = true;
            onMoved(slice.id);
          }
        },
        onPanResponderRelease: () => pan.flattenOffset(),
        onPanResponderTerminate: () => pan.flattenOffset(),
      }),
    [pan, slice.id, onGrab, onMoved]
  );

  return (
    <Animated.View
      {...responder.panHandlers}
      style={{
        position: 'absolute',
        left: slice.x,
        top: slice.y,
        zIndex: active ? 50 : 10,
        elevation: active ? 50 : 10,
        transform: [...pan.getTranslateTransform(), { rotate: `${slice.rot}deg` }],
      }}
    >
      <PizzaSlice size={SCALE} />
    </Animated.View>
  );
};

/* ---------- screen ---------- */
export default function Btlevel42screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
  const userId = String(playerId);
  const bal = Number(hints) || 0;

  const [config, setConfig] = useState<Level42Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const movedIds = useRef<Set<number>>(new Set());
  const busy = useRef(false);
  const lastResult = useRef<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setConfig(await getLevel42Config(userId));
      } catch (e: any) {
        Alert.alert('Error', e.message || 'Could not load level');
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const onGrab = useCallback((id: number) => setActiveId(id), []);
  const onMoved = useCallback((id: number) => {
    movedIds.current.add(id);
  }, []);

  const handleSubmit = async () => {
    if (submitting || solved) return;
    setSubmitting(true);
    try {
      const res = await submitLevel42Answer(userId, count, movedIds.current.size);
      if (res.correct) {
        lastResult.current = res;
        setSolved(true);
        setTimeout(() => onComplete?.({ ...res, skipped: false }), 1500);
      } else {
        setWrong(true);
        setTimeout(() => setWrong(false), 900);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClue = () =>
    Alert.alert('Clue 💡', 'Some slices are hiding under other slices. Try dragging them!');

  const handleSkip = async () => {
    if (busy.current || solved) return;
    if (bal < SKIP_COST) {
      Alert.alert('Not enough hints', `Need ${SKIP_COST} hints. You have ${bal}.`);
      return;
    }
    busy.current = true;
    try {
      const r: any = await api.skip(42, playerId as any);
      setHints?.(typeof r?.hints === 'number' ? r.hints : bal - SKIP_COST);
      onComplete?.({ ...r, skipped: true, attempts: 1 });
    } catch (e: any) {
      Alert.alert('Error', e?.status === 402 ? 'Not enough hints' : 'Network error');
    } finally {
      busy.current = false;
    }
  };

  if (loading || !config) {
    return (
      <View style={[styles.root, styles.center]}>
        <RoomBg />
        <ActivityIndicator size="large" color={THEME.navy} />
      </View>
    );
  }

  // slices are placed in a ring (positions from the server are replaced by the ring layout)
  const ringSlices = layoutRing(config.slices);
  const hiddenSlices = ringSlices.filter((s) => s.hasHidden);

  return (
    <SafeAreaView style={styles.root}>
      <RoomBg />

      {/* header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.roundBtn} onPress={() => onExit?.()}>
            <Text style={styles.roundTxt}>🏠</Text>
          </Pressable>
          <Pressable style={styles.roundBtn}>
            <Text style={styles.roundTxt}>⚙️</Text>
          </Pressable>
        </View>
        <View style={styles.sign}>
          <Text style={styles.signTxt}>LEVEL 42</Text>
        </View>
        <View style={styles.bulbPill}>
          <Text style={styles.bulbTxt}>{bal}</Text>
          <Text>💡</Text>
        </View>
      </View>

      {/* question */}
      <View style={styles.questionPill}>
        <Text style={styles.questionTxt}>{config.question}</Text>
      </View>

      {/* notebook card */}
      <View style={styles.paper}>
        <View style={styles.holes}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={styles.hole} />
          ))}
        </View>

        <View style={styles.playArea}>
          {/* hidden slices: EXACT same position + rotation + size as the top slice, so fully covered */}
          {hiddenSlices.map((s) => (
            <View
              key={`h${s.id}`}
              style={{
                position: 'absolute',
                left: s.x,
                top: s.y,
                zIndex: 1,
                elevation: 1,
                transform: [{ rotate: `${s.rot}deg` }],
              }}
            >
              <PizzaSlice size={SCALE} />
            </View>
          ))}

          {ringSlices.map((s) => (
            <DraggableSlice
              key={s.id}
              slice={s}
              active={activeId === s.id}
              onGrab={onGrab}
              onMoved={onMoved}
            />
          ))}
        </View>

        {/* counter */}
        <View style={styles.counterRow}>
          <Pressable style={styles.counterBtn} onPress={() => setCount((c) => Math.max(0, c - 1))}>
            <Text style={styles.counterBtnTxt}>−</Text>
          </Pressable>
          <Text style={[styles.counterVal, wrong && { color: THEME.red }]}>
            {wrong ? '✗' : solved ? '✓' : count}
          </Text>
          <Pressable style={styles.counterBtn} onPress={() => setCount((c) => Math.min(99, c + 1))}>
            <Text style={styles.counterBtnTxt}>+</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.submitBtn, (submitting || solved) && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={submitting || solved}
        >
          {submitting ? (
            <ActivityIndicator color={THEME.navy} />
          ) : (
            <Text style={styles.submitTxt}>SUBMIT</Text>
          )}
        </Pressable>
      </View>

      {/* bottom bar: Clue + Skip (in normal flow, never covers the counter) */}
      <View style={styles.bottomBar}>
        <View style={styles.actionCol}>
          <Pressable style={[styles.actionBtn, { backgroundColor: THEME.green }]} onPress={handleClue}>
            <Text style={styles.actionIcon}>🔍</Text>
          </Pressable>
          <View style={styles.label}>
            <Text style={styles.labelTxt}>Clue</Text>
          </View>
        </View>
        <View style={styles.actionCol}>
          <Pressable style={[styles.actionBtn, { backgroundColor: THEME.red }]} onPress={handleSkip}>
            <Text style={[styles.actionIcon, { color: '#fff' }]}>▶</Text>
          </Pressable>
          <View style={styles.label}>
            <Text style={styles.labelTxt}>💡 {SKIP_COST}</Text>
          </View>
        </View>
      </View>

      {solved && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Correct! 🍕</Text>
            <Text style={styles.modalSub}>Total slices: {count}</Text>
            <Pressable
              style={styles.nextBtn}
              onPress={() => onComplete?.({ ...lastResult.current, skipped: false })}
            >
              <Text style={styles.nextTxt}>NEXT LEVEL</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.bg, overflow: 'hidden' },
  center: { alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  headerLeft: { flexDirection: 'row', gap: 8 },
  roundBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: THEME.yellow, borderWidth: 3, borderColor: THEME.navy,
    alignItems: 'center', justifyContent: 'center',
  },
  roundTxt: { fontSize: 19 },
  sign: {
    backgroundColor: THEME.sign, borderColor: '#d98b3d', borderWidth: 3,
    borderRadius: 8, paddingHorizontal: 16, paddingVertical: 7,
  },
  signTxt: { color: '#fff', fontWeight: '900', fontSize: 19 },
  bulbPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  bulbTxt: { fontWeight: '900', fontSize: 18, color: THEME.navy },

  questionPill: {
    alignSelf: 'center', marginTop: 12, backgroundColor: THEME.pill,
    borderRadius: 28, paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 16,
    elevation: 4,
  },
  questionTxt: { color: THEME.navy, fontWeight: '900', fontSize: 19, textAlign: 'center' },

  paper: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 14,
    backgroundColor: THEME.paper,
    borderRadius: 14,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  holes: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: -8 },
  hole: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#BCD8F0' },
  playArea: { width: AREA_W, height: AREA_H },

  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 28 },
  counterBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: '#4E9BC4',
    borderWidth: 2, borderColor: THEME.navy, alignItems: 'center', justifyContent: 'center',
  },
  counterBtnTxt: { color: THEME.navy, fontSize: 26, fontWeight: '900', marginTop: -2 },
  counterVal: { fontSize: 32, fontWeight: '900', color: THEME.navy, minWidth: 50, textAlign: 'center' },
  submitBtn: {
    paddingHorizontal: 30, paddingVertical: 9, borderRadius: 20,
    borderWidth: 3, borderColor: THEME.navy, backgroundColor: '#fff',
  },
  submitTxt: { fontWeight: '900', fontSize: 18, color: THEME.navy },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: THEME.pill,
    borderRadius: 32,
    borderWidth: 5,
    borderColor: '#9CC4E8',
    paddingVertical: 8,
    marginHorizontal: 40,
    marginTop: 10,
    marginBottom: 14,
  },
  actionCol: { alignItems: 'center' },
  actionBtn: {
    width: 54, height: 54, borderRadius: 27, borderWidth: 4, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  actionIcon: { fontSize: 24 },
  label: {
    marginTop: 4, backgroundColor: THEME.brown, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 2,
  },
  labelTxt: { color: '#fff', fontWeight: '900', fontSize: 13 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center', zIndex: 999,
  },
  modal: {
    backgroundColor: THEME.pill, borderRadius: 22, padding: 26, alignItems: 'center',
    borderWidth: 4, borderColor: THEME.sign, width: '80%',
  },
  modalTitle: { fontSize: 28, fontWeight: '900', color: THEME.navy },
  modalSub: { fontSize: 16, color: THEME.navy, marginVertical: 10 },
  nextBtn: {
    backgroundColor: THEME.green, borderRadius: 20, paddingHorizontal: 26, paddingVertical: 12,
    borderWidth: 3, borderColor: THEME.navy,
  },
  nextTxt: { fontWeight: '900', color: THEME.navy, fontSize: 16 },
});
