
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   PanResponder,
//   Platform,
//   Pressable,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import * as api from './api'; // same api.ts used by BTGameScreen (api.skip)
// import { getLevel43Config, Level43Config, submitLevel43Drop } from './Btlevel43api';
// import { Banana, BarbedWire, Monkey, RoomBg, THEME } from './Btlevel43art';

// type Props = {
//   playerId: string | number;
//   hints?: number;
//   setHints?: (n: number) => void;
//   onExit?: () => void;
//   onComplete?: (r: any) => void;
// };

// type Box = { x: number; y: number; w: number; h: number };

// const SKIP_COST = 50;
// const MIN_DRAG = 30; // ignore tiny moves, they are not a "feed" attempt
// const PAD = 14; // extra touch area around a target

// // Alert.alert does nothing on web, so use window.alert there
// const notify = (title: string, msg?: string) => {
//   if (Platform.OS === 'web') {
//     // eslint-disable-next-line no-alert
//     window.alert(msg ? `${title}\n${msg}` : title);
//   } else {
//     Alert.alert(title, msg);
//   }
// };

// const inside = (b: Box | null, x: number, y: number, pad = PAD) =>
//   !!b && x >= b.x - pad && x <= b.x + b.w + pad && y >= b.y - pad && y <= b.y + b.h + pad;

// const measure = (ref: React.RefObject<any>): Promise<Box | null> =>
//   new Promise((resolve) => {
//     const node = ref.current;
//     if (!node || !node.measureInWindow) return resolve(null);
//     node.measureInWindow((x: number, y: number, w: number, h: number) =>
//       resolve(w > 0 && h > 0 ? { x, y, w, h } : null)
//     );
//   });

// export default function Btlevel43screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
//   const userId = String(playerId);
//   const bal = Number(hints) || 0;

//   const [config, setConfig] = useState<Level43Config | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState('');
//   const [reloadKey, setReloadKey] = useState(0);
//   const [solved, setSolved] = useState(false);
//   const [note, setNote] = useState('');

//   const pan = useRef(new Animated.ValueXY()).current;
//   const shake = useRef(new Animated.Value(0)).current;
//   const busy = useRef(false);
//   const lastResult = useRef<any>(null);
//   const configRef = useRef<Level43Config | null>(null);
//   const solvedRef = useRef(false);
//   const dropRef = useRef<(dx: number, dy: number, moveX: number, moveY: number) => void>(() => {});

//   // real on-screen positions
//   const wordRef = useRef<View>(null); // the word "monkey" inside the question  -> CORRECT target
//   const monkeyRef = useRef<View>(null); // the drawn monkey at the bottom         -> WRONG target
//   const bananaRef = useRef<any>(null);
//   const bananaStart = useRef<Box | null>(null);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       setLoading(true);
//       setLoadError('');
//       try {
//         const c = await getLevel43Config(userId);
//         if (!alive) return;
//         configRef.current = c;
//         setConfig(c);
//       } catch (e: any) {
//         if (!alive) return;
//         setLoadError(e?.message || 'Could not load level');
//       } finally {
//         if (alive) setLoading(false);
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, [userId, reloadKey]);

//   const flash = (m: string) => {
//     setNote(m);
//     setTimeout(() => setNote(''), 1800);
//   };

//   const doShake = () =>
//     Animated.sequence(
//       [10, -10, 6, -6, 0].map((v) =>
//         Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true })
//       )
//     ).start();

//   const springBack = () =>
//     Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();

//   // called when the finger is released. Latest closure is stored in dropRef.
//   dropRef.current = async (dx: number, dy: number, moveX: number, moveY: number) => {
//     const c = configRef.current;
//     if (!c || solvedRef.current || busy.current) return;
//     if (Math.hypot(dx, dy) < MIN_DRAG) {
//       springBack();
//       return;
//     }

//     busy.current = true;
//     try {
//       const [word, monkey] = await Promise.all([measure(wordRef), measure(monkeyRef)]);
//       const start = bananaStart.current;

//       // where the bananas ended up (centre) and where the finger is, in screen coordinates
//       const bx = start ? start.x + start.w / 2 + dx : -1;
//       const by = start ? start.y + start.h / 2 + dy : -1;
//       const hitWord = inside(word, bx, by) || inside(word, moveX, moveY);
//       const hitMonkey = inside(monkey, bx, by, 0) || inside(monkey, moveX, moveY, 0);

//       const target = hitWord ? 'monkey_word' : hitMonkey ? 'monkey_image' : 'none';
//       const res = await submitLevel43Drop(userId, 'banana', target, bx, by);

//       if (res.correct) {
//         solvedRef.current = true;
//         lastResult.current = res;
//         // snap the bananas onto the word "monkey"
//         const tx = word && start ? word.x + word.w / 2 - (start.x + start.w / 2) : dx;
//         const ty = word && start ? word.y + word.h / 2 - (start.y + start.h / 2) : dy;
//         Animated.timing(pan, {
//           toValue: { x: tx, y: ty },
//           duration: 350,
//           useNativeDriver: false,
//         }).start();
//         setSolved(true);
//         setTimeout(() => onComplete?.({ ...res, skipped: false }), 1600);
//       } else {
//         doShake();
//         flash(res.message);
//         springBack();
//       }
//     } catch (e: any) {
//       flash('Network error');
//       springBack();
//     } finally {
//       busy.current = false;
//     }
//   };

//   const responder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !solvedRef.current,
//       onPanResponderGrant: () => {
//         measure(bananaRef).then((b) => {
//           bananaStart.current = b;
//         });
//         pan.extractOffset();
//       },
//       onPanResponderMove: (_e, g) => pan.setValue({ x: g.dx, y: g.dy }),
//       onPanResponderRelease: (_e, g) => {
//         pan.flattenOffset();
//         dropRef.current(g.dx, g.dy, g.moveX, g.moveY);
//       },
//       onPanResponderTerminate: () => {
//         pan.flattenOffset();
//         springBack();
//       },
//     })
//   ).current;

//   const handleClue = () =>
//     notify('Clue 💡', 'Read the question again. Where is the word "monkey"? 😉');

//   const handleSkip = async () => {
//     if (busy.current || solvedRef.current) return;
//     if (bal < SKIP_COST) {
//       notify('Not enough hints', `Need ${SKIP_COST} hints. You have ${bal}.`);
//       return;
//     }
//     busy.current = true;
//     try {
//       const r: any = await api.skip(43, playerId as any);
//       setHints?.(typeof r?.hints === 'number' ? r.hints : bal - SKIP_COST);
//       onComplete?.({ ...r, skipped: true, attempts: 1 });
//     } catch (e: any) {
//       notify('Error', e?.status === 402 ? 'Not enough hints' : 'Network error');
//     } finally {
//       busy.current = false;
//     }
//   };

//   // 1) still loading
//   if (loading) {
//     return (
//       <View style={[styles.root, styles.center]}>
//         <RoomBg />
//         <ActivityIndicator size="large" color={THEME.navy} />
//       </View>
//     );
//   }

//   // 2) failed to load -> show the reason + retry (no more endless spinner)
//   if (!config) {
//     return (
//       <View style={[styles.root, styles.center]}>
//         <RoomBg />
//         <View style={styles.errBox}>
//           <Text style={styles.errTitle}>Cannot load Level 43</Text>
//           <Text style={styles.errMsg}>{loadError || 'Check the backend is running.'}</Text>
//           <Pressable style={styles.errBtn} onPress={() => setReloadKey((k) => k + 1)}>
//             <Text style={styles.errBtnTxt}>RETRY</Text>
//           </Pressable>
//           <Pressable style={[styles.errBtn, { backgroundColor: THEME.yellow }]} onPress={() => onExit?.()}>
//             <Text style={styles.errBtnTxt}>BACK</Text>
//           </Pressable>
//         </View>
//       </View>
//     );
//   }

//   const L = config.layout;
//   const words = config.question.split(' ');
//   const isTarget = (w: string) => /^monkey/i.test(w.replace(/[^a-z]/gi, ''));

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
//           <Text style={styles.signTxt}>LEVEL 43</Text>
//         </View>
//         <View style={styles.bulbPill}>
//           <Text style={styles.bulbTxt}>{bal}</Text>
//           <Text>💡</Text>
//         </View>
//       </View>

//       {/* question text. every word is its own box, so we can find the word "monkey" on screen */}
//       <View style={styles.questionPill} pointerEvents="none">
//         <View style={styles.wordsRow}>
//           {words.map((w, i) =>
//             isTarget(w) ? (
//               <View key={i} ref={wordRef} collapsable={false} style={styles.wordBox}>
//                 <Text style={[styles.questionTxt, solved && styles.wordDone]}>{w}</Text>
//               </View>
//             ) : (
//               <View key={i} style={styles.wordBox}>
//                 <Text style={styles.questionTxt}>{w}</Text>
//               </View>
//             )
//           )}
//         </View>
//       </View>

//       {/* notebook card */}
//       <View style={styles.paper}>
//         <View style={styles.holes}>
//           {Array.from({ length: 8 }).map((_, i) => (
//             <View key={i} style={styles.hole} />
//           ))}
//         </View>

//         <Animated.View style={{ transform: [{ translateX: shake }] }}>
//           <View style={{ width: L.area.w, height: L.area.h }}>
//             {/* barbed wire in the middle (unchanged) */}
//             <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: L.wire.y }}>
//               <BarbedWire w={L.area.w} h={L.wire.h} />
//             </View>

//             {/* drawn monkey at the bottom (this is the WRONG place) */}
//             <View
//               ref={monkeyRef}
//               collapsable={false}
//               pointerEvents="none"
//               style={{ position: 'absolute', left: L.monkey.x, top: L.monkey.y, width: L.monkey.w, height: L.monkey.h }}
//             >
//               <Monkey w={L.monkey.w} h={L.monkey.h} happy={solved} />
//             </View>

//             {/* draggable bananas at the top */}
//             <Animated.View
//               ref={bananaRef}
//               collapsable={false}
//               {...responder.panHandlers}
//               style={{
//                 position: 'absolute',
//                 left: L.banana.x,
//                 top: L.banana.y,
//                 width: L.banana.w,
//                 height: L.banana.h,
//                 zIndex: 20,
//                 elevation: 20,
//                 transform: pan.getTranslateTransform(),
//               }}
//             >
//               <Banana w={L.banana.w} h={L.banana.h} />
//             </Animated.View>
//           </View>
//         </Animated.View>

//         <Text style={styles.note}>{note}</Text>
//       </View>

//       {/* bottom bar: Clue + Skip only */}
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
//             <Text style={styles.modalTitle}>Yummy! 🍌</Text>
//             <Text style={styles.modalSub}>You found the real "monkey"!</Text>
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

//   errBox: {
//     width: '80%', backgroundColor: THEME.pill, borderRadius: 22, padding: 22, alignItems: 'center',
//     borderWidth: 4, borderColor: THEME.sign,
//   },
//   errTitle: { fontSize: 22, fontWeight: '900', color: THEME.navy },
//   errMsg: { fontSize: 14, color: THEME.navy, marginVertical: 10, textAlign: 'center' },
//   errBtn: {
//     marginTop: 8, backgroundColor: THEME.green, borderRadius: 18, paddingHorizontal: 28, paddingVertical: 10,
//     borderWidth: 3, borderColor: THEME.navy,
//   },
//   errBtnTxt: { fontWeight: '900', color: THEME.navy, fontSize: 16 },

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
//     borderRadius: 28, paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 16,
//     elevation: 4, zIndex: 1,
//   },
//   wordsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
//   wordBox: { paddingHorizontal: 3, paddingVertical: 1 },
//   questionTxt: { color: THEME.navy, fontWeight: '900', fontSize: 19, textAlign: 'center' },
//   wordDone: { color: '#2e8b2e' },

//   paper: {
//     flex: 1,
//     marginTop: 12,
//     marginHorizontal: 14,
//     backgroundColor: THEME.paper,
//     borderRadius: 14,
//     paddingBottom: 8,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     elevation: 4,
//     zIndex: 5, // so the bananas can be dragged up over the question text
//   },
//   holes: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: -8, marginBottom: 6 },
//   hole: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#BCD8F0' },
//   note: { height: 22, fontWeight: '900', fontSize: 16, color: '#c0392b' },

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
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path, Ellipse } from 'react-native-svg';
import * as api from './api'; // same api.ts used by BTGameScreen (api.skip)
import { getLevel43Config, Level43Config, submitLevel43Drop } from './Btlevel43api';
import { Banana, BarbedWire, Monkey, RoomBg, THEME } from './Btlevel43art';

type Props = {
  playerId: string | number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onComplete?: (r: any) => void;
};

type Box = { x: number; y: number; w: number; h: number };

const SKIP_COST = 50;
const MIN_DRAG = 30; // ignore tiny moves, they are not a "feed" attempt
const PAD = 14; // extra touch area around a target

// tree branch above the bananas: BRANCH_DROP moves the branch down (+) or up (-) from the top of the bananas
const BRANCH_DROP = 2;

// Alert.alert does nothing on web, so use window.alert there
const notify = (title: string, msg?: string) => {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(msg ? `${title}\n${msg}` : title);
  } else {
    Alert.alert(title, msg);
  }
};

const inside = (b: Box | null, x: number, y: number, pad = PAD) =>
  !!b && x >= b.x - pad && x <= b.x + b.w + pad && y >= b.y - pad && y <= b.y + b.h + pad;

const measure = (ref: React.RefObject<any>): Promise<Box | null> =>
  new Promise((resolve) => {
    const node = ref.current;
    if (!node || !node.measureInWindow) return resolve(null);
    node.measureInWindow((x: number, y: number, w: number, h: number) =>
      resolve(w > 0 && h > 0 ? { x, y, w, h } : null)
    );
  });

/* ---------- tree branch: the bananas hang from this ---------- */
const TreeBranch = ({ w, cx, y }: { w: number; cx: number; y: number }) => {
  const h = y + 46;
  const d = `M ${w + 6} ${y - 8} Q ${cx + 60} ${y + 8} ${cx} ${y} Q ${cx - 60} ${y - 8} ${w * 0.08} ${y + 4}`;
  const dLight = `M ${w + 6} ${y - 12} Q ${cx + 60} ${y + 4} ${cx} ${y - 4} Q ${cx - 60} ${y - 12} ${w * 0.08} ${y}`;
  const leaf = (key: string, x: number, yy: number, rot: number, k = 1) => (
    <Ellipse
      key={key}
      cx={x}
      cy={yy}
      rx={15 * k}
      ry={7 * k}
      fill="#5fbf4a"
      stroke="#2f8a2f"
      strokeWidth={2}
      transform={`rotate(${rot} ${x} ${yy})`}
    />
  );
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {/* branch */}
      <Path d={d} stroke="#6b3f17" strokeWidth={16} strokeLinecap="round" fill="none" />
      <Path d={dLight} stroke="#9a6330" strokeWidth={4} strokeLinecap="round" fill="none" />
      {/* leaves */}
      {leaf('l1', cx + 58, y + 12, 25)}
      {leaf('l2', cx + 92, y + 4, -20, 1.1)}
      {leaf('l3', cx - 58, y + 5, -25)}
      {leaf('l4', cx - 92, y + 9, 20, 1.1)}
      {leaf('l5', cx + 40, y - 11, -50, 0.9)}
      {leaf('l6', cx - 38, y - 12, 50, 0.9)}
      {leaf('l7', w - 28, y + 2, 15)}
      {leaf('l8', w * 0.14, y + 16, -15, 0.9)}
    </Svg>
  );
};

export default function Btlevel43screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
  const userId = String(playerId);
  const bal = Number(hints) || 0;

  const [config, setConfig] = useState<Level43Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [solved, setSolved] = useState(false);
  const [note, setNote] = useState('');

  const pan = useRef(new Animated.ValueXY()).current;
  const shake = useRef(new Animated.Value(0)).current;
  const busy = useRef(false);
  const lastResult = useRef<any>(null);
  const configRef = useRef<Level43Config | null>(null);
  const solvedRef = useRef(false);
  const dropRef = useRef<(dx: number, dy: number, moveX: number, moveY: number) => void>(() => {});

  // real on-screen positions
  const wordRef = useRef<View>(null); // the word "monkey" inside the question  -> CORRECT target
  const monkeyRef = useRef<View>(null); // the drawn monkey at the bottom         -> WRONG target
  const bananaRef = useRef<any>(null);
  const bananaStart = useRef<Box | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setLoadError('');
      try {
        const c = await getLevel43Config(userId);
        if (!alive) return;
        configRef.current = c;
        setConfig(c);
      } catch (e: any) {
        if (!alive) return;
        setLoadError(e?.message || 'Could not load level');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId, reloadKey]);

  const flash = (m: string) => {
    setNote(m);
    setTimeout(() => setNote(''), 1800);
  };

  const doShake = () =>
    Animated.sequence(
      [10, -10, 6, -6, 0].map((v) =>
        Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true })
      )
    ).start();

  const springBack = () =>
    Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();

  // called when the finger is released. Latest closure is stored in dropRef.
  dropRef.current = async (dx: number, dy: number, moveX: number, moveY: number) => {
    const c = configRef.current;
    if (!c || solvedRef.current || busy.current) return;
    if (Math.hypot(dx, dy) < MIN_DRAG) {
      springBack();
      return;
    }

    busy.current = true;
    try {
      const [word, monkey] = await Promise.all([measure(wordRef), measure(monkeyRef)]);
      const start = bananaStart.current;

      // where the bananas ended up (centre) and where the finger is, in screen coordinates
      const bx = start ? start.x + start.w / 2 + dx : -1;
      const by = start ? start.y + start.h / 2 + dy : -1;
      const hitWord = inside(word, bx, by) || inside(word, moveX, moveY);
      const hitMonkey = inside(monkey, bx, by, 0) || inside(monkey, moveX, moveY, 0);

      const target = hitWord ? 'monkey_word' : hitMonkey ? 'monkey_image' : 'none';
      const res = await submitLevel43Drop(userId, 'banana', target, bx, by);

      if (res.correct) {
        solvedRef.current = true;
        lastResult.current = res;
        // snap the bananas onto the word "monkey"
        const tx = word && start ? word.x + word.w / 2 - (start.x + start.w / 2) : dx;
        const ty = word && start ? word.y + word.h / 2 - (start.y + start.h / 2) : dy;
        Animated.timing(pan, {
          toValue: { x: tx, y: ty },
          duration: 350,
          useNativeDriver: false,
        }).start();
        setSolved(true);
        setTimeout(() => onComplete?.({ ...res, skipped: false }), 1600);
      } else {
        doShake();
        flash(res.message);
        springBack();
      }
    } catch (e: any) {
      flash('Network error');
      springBack();
    } finally {
      busy.current = false;
    }
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !solvedRef.current,
      onPanResponderGrant: () => {
        measure(bananaRef).then((b) => {
          bananaStart.current = b;
        });
        pan.extractOffset();
      },
      onPanResponderMove: (_e, g) => pan.setValue({ x: g.dx, y: g.dy }),
      onPanResponderRelease: (_e, g) => {
        pan.flattenOffset();
        dropRef.current(g.dx, g.dy, g.moveX, g.moveY);
      },
      onPanResponderTerminate: () => {
        pan.flattenOffset();
        springBack();
      },
    })
  ).current;

  const handleClue = () =>
    notify('Clue 💡', 'Read the question again. Where is the word "monkey"? 😉');

  const handleSkip = async () => {
    if (busy.current || solvedRef.current) return;
    if (bal < SKIP_COST) {
      notify('Not enough hints', `Need ${SKIP_COST} hints. You have ${bal}.`);
      return;
    }
    busy.current = true;
    try {
      const r: any = await api.skip(43, playerId as any);
      setHints?.(typeof r?.hints === 'number' ? r.hints : bal - SKIP_COST);
      onComplete?.({ ...r, skipped: true, attempts: 1 });
    } catch (e: any) {
      notify('Error', e?.status === 402 ? 'Not enough hints' : 'Network error');
    } finally {
      busy.current = false;
    }
  };

  // 1) still loading
  if (loading) {
    return (
      <View style={[styles.root, styles.center]}>
        <RoomBg />
        <ActivityIndicator size="large" color={THEME.navy} />
      </View>
    );
  }

  // 2) failed to load -> show the reason + retry (no more endless spinner)
  if (!config) {
    return (
      <View style={[styles.root, styles.center]}>
        <RoomBg />
        <View style={styles.errBox}>
          <Text style={styles.errTitle}>Cannot load Level 43</Text>
          <Text style={styles.errMsg}>{loadError || 'Check the backend is running.'}</Text>
          <Pressable style={styles.errBtn} onPress={() => setReloadKey((k) => k + 1)}>
            <Text style={styles.errBtnTxt}>RETRY</Text>
          </Pressable>
          <Pressable style={[styles.errBtn, { backgroundColor: THEME.yellow }]} onPress={() => onExit?.()}>
            <Text style={styles.errBtnTxt}>BACK</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const L = config.layout;
  const words = config.question.split(' ');
  const isTarget = (w: string) => /^monkey/i.test(w.replace(/[^a-z]/gi, ''));
  const branchY = Math.max(12, L.banana.y + BRANCH_DROP);
  const branchCx = L.banana.x + L.banana.w / 2;

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
          <Text style={styles.signTxt}>LEVEL 43</Text>
        </View>
        <View style={styles.bulbPill}>
          <Text style={styles.bulbTxt}>{bal}</Text>
          <Text>💡</Text>
        </View>
      </View>

      {/* question text. every word is its own box, so we can find the word "monkey" on screen */}
      <View style={styles.questionPill} pointerEvents="none">
        <View style={styles.wordsRow}>
          {words.map((w, i) =>
            isTarget(w) ? (
              <View key={i} ref={wordRef} collapsable={false} style={styles.wordBox}>
                <Text style={[styles.questionTxt, solved && styles.wordDone]}>{w}</Text>
              </View>
            ) : (
              <View key={i} style={styles.wordBox}>
                <Text style={styles.questionTxt}>{w}</Text>
              </View>
            )
          )}
        </View>
      </View>

      {/* notebook card */}
      <View style={styles.paper}>
        <View style={styles.holes}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={styles.hole} />
          ))}
        </View>

        <Animated.View style={{ transform: [{ translateX: shake }] }}>
          <View style={{ width: L.area.w, height: L.area.h }}>
            {/* tree branch at the top: the bananas hang from it */}
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, zIndex: 5 }}>
              <TreeBranch w={L.area.w} cx={branchCx} y={branchY} />
            </View>

            {/* barbed wire in the middle (unchanged) */}
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: L.wire.y }}>
              <BarbedWire w={L.area.w} h={L.wire.h} />
            </View>

            {/* drawn monkey at the bottom (this is the WRONG place) */}
            <View
              ref={monkeyRef}
              collapsable={false}
              pointerEvents="none"
              style={{ position: 'absolute', left: L.monkey.x, top: L.monkey.y, width: L.monkey.w, height: L.monkey.h }}
            >
              <Monkey w={L.monkey.w} h={L.monkey.h} happy={solved} />
            </View>

            {/* draggable bananas, hanging from the branch */}
            <Animated.View
              ref={bananaRef}
              collapsable={false}
              {...responder.panHandlers}
              style={{
                position: 'absolute',
                left: L.banana.x,
                top: L.banana.y,
                width: L.banana.w,
                height: L.banana.h,
                zIndex: 20,
                elevation: 20,
                transform: pan.getTranslateTransform(),
              }}
            >
              <Banana w={L.banana.w} h={L.banana.h} />
            </Animated.View>
          </View>
        </Animated.View>

        <Text style={styles.note}>{note}</Text>
      </View>

      {/* bottom bar: Clue + Skip only */}
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
            <Text style={styles.modalTitle}>Yummy! 🍌</Text>
            <Text style={styles.modalSub}>You found the real "monkey"!</Text>
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

  errBox: {
    width: '80%', backgroundColor: THEME.pill, borderRadius: 22, padding: 22, alignItems: 'center',
    borderWidth: 4, borderColor: THEME.sign,
  },
  errTitle: { fontSize: 22, fontWeight: '900', color: THEME.navy },
  errMsg: { fontSize: 14, color: THEME.navy, marginVertical: 10, textAlign: 'center' },
  errBtn: {
    marginTop: 8, backgroundColor: THEME.green, borderRadius: 18, paddingHorizontal: 28, paddingVertical: 10,
    borderWidth: 3, borderColor: THEME.navy,
  },
  errBtnTxt: { fontWeight: '900', color: THEME.navy, fontSize: 16 },

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
    borderRadius: 28, paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 16,
    elevation: 4, zIndex: 1,
  },
  wordsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  wordBox: { paddingHorizontal: 3, paddingVertical: 1 },
  questionTxt: { color: THEME.navy, fontWeight: '900', fontSize: 19, textAlign: 'center' },
  wordDone: { color: '#2e8b2e' },

  paper: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 14,
    backgroundColor: THEME.paper,
    borderRadius: 14,
    paddingBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    zIndex: 5, // so the bananas can be dragged up over the question text
  },
  holes: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: -8, marginBottom: 6 },
  hole: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#BCD8F0' },
  note: { height: 22, fontWeight: '900', fontSize: 16, color: '#c0392b' },

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
