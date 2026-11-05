
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Animated,
//   PanResponder,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import {
//   bt36Answer,
//   bt36Hint,
//   bt36Reward,
//   bt36Skip,
//   bt36Start,
// } from './Btlevel36api';
// import {
//   BTBulbIcon,
//   BTGiftIcon,
//   BTIconButtonGlyph,
//   BTLamp,
//   BTLevel36Room,
//   BTMagnifierIcon,
//   BTVideoIcon,
// } from './Btlevel36art';

// const HINT_COST = 25;
// const SKIP_COST = 50; // keep in sync with the backend costs
// const REWARD = 75;
// const CORRECT_ANSWER = '36';
// const HIT_MARGIN = 34; // how forgiving the drop area is (px)
// const NAVY = '#10245e';

// type Props = {
//   playerId: any;
//   hints?: any;
//   setHints?: (n: number) => void;
//   onExit?: () => void;
//   onComplete?: (r: any) => void;
// };

// export default function BTLevel36Screen({
//   playerId,
//   hints,
//   setHints,
//   onExit,
//   onComplete,
// }: Props) {
//   const [bulbs, setBulbs] = useState<number | null>(null);
//   const [note, setNote] = useState('');
//   const [hintText, setHintText] = useState('');
//   const [placed, setPlaced] = useState(false); // the 6 now sits next to the 3
//   const [done, setDone] = useState(false);
//   const [dragging, setDragging] = useState(false);

//   const busy = useRef(false);
//   const finished = useRef(false);
//   const pan = useRef(new Animated.ValueXY()).current;
//   const zoneRef = useRef<View>(null);
//   const zoneRect = useRef({ x: 0, y: 0, w: 0, h: 0 });
//   const dropHandler = useRef<(x: number, y: number) => void>(() => {});

//   const bal = Number(hints ?? bulbs ?? 0);

//   const flash = (m: string) => {
//     setNote(m);
//     setTimeout(() => setNote(''), 1800);
//   };

//   const syncBalance = (n: number) => {
//     setBulbs(n);
//     if (setHints) setHints(n);
//   };

//   useEffect(() => {
//     bt36Start(playerId)
//       .then((res) => syncBalance(res.hints))
//       .catch((e: any) => flash(e.message));
//   }, [playerId]);

//   const measureZone = () => {
//     zoneRef.current?.measureInWindow((x, y, w, h) => {
//       zoneRect.current = { x, y, w, h };
//     });
//   };

//   const win = (attempts: number, skipped: boolean) => {
//     if (finished.current) return;
//     finished.current = true;
//     setPlaced(true);
//     setDone(true);
//     setTimeout(() => {
//       if (onComplete) {
//         onComplete({ correct: true, attempts: Math.max(1, attempts), skipped });
//       }
//     }, 1400);
//   };

//   const springBack = () => {
//     Animated.spring(pan, {
//       toValue: { x: 0, y: 0 },
//       useNativeDriver: false,
//       friction: 6,
//     }).start();
//   };

//   // the 6 was dropped on the 3 -> ask the server (accept locally if server is down)
//   const submitPlaced = async () => {
//     if (busy.current || finished.current) return;
//     busy.current = true;
//     setPlaced(true);
//     pan.setValue({ x: 0, y: 0 });
//     try {
//       const res = await bt36Answer(playerId, CORRECT_ANSWER);
//       if (res && typeof res.hints === 'number') syncBalance(res.hints);
//       if (res?.correct) {
//         win(res.attempts ?? 1, false);
//       } else {
//         setPlaced(false);
//         flash('Not quite. Try again!');
//       }
//     } catch (e: any) {
//       win(1, false);
//     } finally {
//       busy.current = false;
//     }
//   };

//   // refreshed every render so it never uses stale state
//   dropHandler.current = (mx: number, my: number) => {
//     setDragging(false);
//     const z = zoneRect.current;
//     const inside =
//       mx >= z.x - HIT_MARGIN &&
//       mx <= z.x + z.w + HIT_MARGIN &&
//       my >= z.y - HIT_MARGIN &&
//       my <= z.y + z.h + HIT_MARGIN;
//     if (inside && !finished.current) {
//       submitPlaced();
//     } else {
//       springBack();
//     }
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !finished.current,
//       onPanResponderGrant: () => {
//         measureZone();
//         setDragging(true);
//         pan.setOffset({ x: 0, y: 0 });
//         pan.setValue({ x: 0, y: 0 });
//       },
//       onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
//         useNativeDriver: false,
//       }),
//       onPanResponderRelease: (_e, g) => dropHandler.current(g.moveX, g.moveY),
//       onPanResponderTerminate: () => {
//         setDragging(false);
//         springBack();
//       },
//     })
//   ).current;

//   const onHint = async () => {
//     if (busy.current || done) return;
//     if (bal < HINT_COST) {
//       flash('Need ' + HINT_COST + ' hints. You have ' + bal + '.');
//       return;
//     }
//     busy.current = true;
//     try {
//       const res = await bt36Hint(playerId);
//       syncBalance(res.hints);
//       setHintText(res.hint.text);
//     } catch (e: any) {
//       flash(e.status === 402 ? 'Not enough hints' : e.message);
//     } finally {
//       busy.current = false;
//     }
//   };

//   const onGift = async () => {
//     if (busy.current || done) return;
//     busy.current = true;
//     try {
//       // TODO: show your rewarded-ad SDK here and call the API only after it finishes
//       const res = await bt36Reward(playerId);
//       syncBalance(res.hints);
//       flash('+' + REWARD + ' hints!');
//     } catch (e: any) {
//       flash(e.message);
//     } finally {
//       busy.current = false;
//     }
//   };

//   const onSkip = async () => {
//     if (busy.current || done) return;
//     if (bal < SKIP_COST) {
//       flash('Need ' + SKIP_COST + ' hints. You have ' + bal + '.');
//       return;
//     }
//     busy.current = true;
//     try {
//       const res = await bt36Skip(playerId);
//       syncBalance(res.hints);
//       win(res.attempts, true);
//     } catch (e: any) {
//       flash(e.status === 402 ? 'Not enough hints' : e.message);
//     } finally {
//       busy.current = false;
//     }
//   };

//   return (
//     <View style={s.root}>
//       <BTLevel36Room />
//       <BTLamp />

//       {/* top bar (raised so the dragged 6 can fly over everything) */}
//       <View style={s.topBar}>
//         <View style={s.roundBtnRow}>
//           <Pressable style={s.roundBtn} onPress={onExit}>
//             <BTIconButtonGlyph glyph={'⌂'} />
//           </Pressable>
//           <Pressable style={s.roundBtn}>
//             <BTIconButtonGlyph glyph={'⚙'} />
//           </Pressable>
//         </View>

//         <View style={s.signWrap}>
//           <View style={[s.string, { left: 24 }]} />
//           <View style={[s.string, { right: 24 }]} />
//           <View style={s.sign}>
//             <Text style={s.arrow}>{'<'}</Text>

//             <View style={s.levelRow}>
//               <Text style={s.signText}>LEVEL 3</Text>

//               {/* the draggable 6 */}
//               <View style={s.zeroSlot}>
//                 <Animated.View
//                   {...panResponder.panHandlers}
//                   style={[
//                     s.zero,
//                     {
//                       opacity: placed ? 0 : 1,
//                       transform: pan.getTranslateTransform(),
//                       zIndex: dragging ? 99 : 1,
//                       elevation: dragging ? 20 : 0,
//                     },
//                   ]}
//                 >
//                   <Text style={s.signText}>6</Text>
//                 </Animated.View>
//               </View>
//             </View>

//             <Text style={s.arrow}>{'>'}</Text>
//           </View>
//         </View>

//         <View style={s.bulbPill}>
//           <Text style={s.bulbText}>{bal}</Text>
//           <View style={s.bulbIcon}>
//             <BTBulbIcon size={26} />
//           </View>
//         </View>
//       </View>

//       {/* notebook card */}
//       <View style={s.card}>
//         <View style={s.rings}>
//           {Array.from({ length: 12 }).map((_, i) => (
//             <View key={i} style={s.ring} />
//           ))}
//         </View>

//         <View style={s.questionPill}>
//           <Text style={s.questionText}>Make this equation correct.</Text>
//         </View>

//         <View style={s.lines}>
//           {Array.from({ length: 6 }).map((_, i) => (
//             <View key={i} style={s.line} />
//           ))}
//         </View>

//         <View style={s.equationRow}>
//           <Text style={s.eq}>X + Y = </Text>
//           <View
//             ref={zoneRef}
//             onLayout={measureZone}
//             style={[s.zone, dragging && s.zoneActive]}
//           >
//             <Text style={s.eq}>3</Text>
//             {placed ? <Text style={s.eq}>6</Text> : null}
//           </View>
//         </View>

//         <Text style={s.hintText}>{hintText}</Text>
//         <Text style={s.messageText}>{note}</Text>

//         {done ? (
//           <View style={s.solvedOverlay}>
//             <Text style={s.solvedTitle}>Correct!</Text>
//             <Text style={s.solvedSub}>X + Y = 36</Text>
//           </View>
//         ) : null}
//       </View>

//       {/* hint / gift / skip */}
//       <View style={s.bar}>
//         <View style={s.acol}>
//           <Pressable style={[s.btn, s.hintBtn]} onPress={onHint}>
//             <BTMagnifierIcon />
//           </Pressable>
//           <View style={s.costPill}>
//             <BTBulbIcon size={14} />
//             <Text style={s.costText}>{HINT_COST}</Text>
//           </View>
//         </View>

//         <View style={s.acol}>
//           <Pressable style={[s.btn, s.giftBtn]} onPress={onGift}>
//             <BTGiftIcon />
//           </Pressable>
//           <View style={s.costPill}>
//             <View style={s.coinDot} />
//             <Text style={s.costText}>{'+' + REWARD}</Text>
//           </View>
//         </View>

//         <View style={s.acol}>
//           <Pressable style={[s.btn, s.videoBtn]} onPress={onSkip}>
//             <BTVideoIcon />
//           </Pressable>
//           <View style={s.costPill}>
//             <BTBulbIcon size={14} />
//             <Text style={s.costText}>{SKIP_COST}</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: '#7fc4f5',
//     paddingTop: 28,
//     paddingHorizontal: 12,
//   },
//   topBar: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     justifyContent: 'space-between',
//     zIndex: 50,
//     elevation: 10,
//   },
//   roundBtnRow: { flexDirection: 'row', gap: 6 },
//   roundBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#ffd23f',
//     borderWidth: 3,
//     borderColor: '#5b3a12',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   signWrap: { alignItems: 'center', paddingTop: 16 },
//   string: {
//     position: 'absolute',
//     top: -8,
//     width: 3,
//     height: 26,
//     backgroundColor: '#b5651d',
//   },
//   sign: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: '#c8702a',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     overflow: 'visible',
//   },
//   levelRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     overflow: 'visible',
//   },
//   signText: { color: '#fff', fontSize: 22, fontWeight: '900' },
//   arrow: { color: '#ffc83d', fontSize: 22, fontWeight: '900' },
//   zeroSlot: { width: 16, height: 30, overflow: 'visible' },
//   zero: {
//     width: 22,
//     height: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     overflow: 'visible',
//   },
//   bulbPill: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     height: 38,
//     minWidth: 80,
//     paddingLeft: 16,
//     paddingRight: 28,
//     justifyContent: 'center',
//     marginTop: 8,
//   },
//   bulbText: { fontSize: 22, fontWeight: '900', color: NAVY },
//   bulbIcon: { position: 'absolute', right: -4, top: 4 },

//   card: {
//     marginTop: 40,
//     alignSelf: 'center',
//     width: '92%',
//     maxWidth: 420,
//     minHeight: 330,
//     backgroundColor: '#fbf6e9',
//     borderRadius: 18,
//     borderWidth: 5,
//     borderColor: '#f0b872',
//     paddingTop: 22,
//     paddingBottom: 18,
//     paddingHorizontal: 14,
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
//   rings: {
//     position: 'absolute',
//     top: 6,
//     left: 10,
//     right: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   ring: {
//     width: 10,
//     height: 16,
//     borderRadius: 5,
//     backgroundColor: '#f0a43a',
//   },
//   questionPill: {
//     marginTop: 16,
//     backgroundColor: '#fbe5b6',
//     borderWidth: 2,
//     borderColor: '#f4a730',
//     borderStyle: 'dashed',
//     borderRadius: 24,
//     paddingHorizontal: 18,
//     paddingVertical: 9,
//   },
//   questionText: { fontSize: 18, fontWeight: '900', color: NAVY },
//   lines: {
//     position: 'absolute',
//     top: 90,
//     left: 14,
//     right: 14,
//   },
//   line: {
//     height: 1.5,
//     backgroundColor: '#d8e6ee',
//     marginBottom: 38,
//   },
//   equationRow: {
//     marginTop: 54,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   eq: { fontSize: 50, fontWeight: '900', color: NAVY, letterSpacing: 1 },
//   zone: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingRight: 28,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   zoneActive: {
//     borderColor: '#f4a730',
//     borderStyle: 'dashed',
//     backgroundColor: 'rgba(244,167,48,0.12)',
//   },
//   hintText: {
//     marginTop: 26,
//     minHeight: 18,
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#5b4a2a',
//     textAlign: 'center',
//   },
//   messageText: {
//     minHeight: 20,
//     fontSize: 15,
//     fontWeight: '800',
//     color: '#c0392b',
//     textAlign: 'center',
//   },
//   solvedOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(251,246,233,0.96)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   solvedTitle: { fontSize: 36, fontWeight: '900', color: '#2fae5b' },
//   solvedSub: { marginTop: 6, fontSize: 28, fontWeight: '900', color: NAVY },

//   bar: {
//     position: 'absolute',
//     left: 24,
//     right: 24,
//     bottom: 22,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'flex-start',
//     backgroundColor: '#f5e8d0',
//     borderWidth: 6,
//     borderColor: '#7cc0f2',
//     borderRadius: 50,
//     paddingVertical: 12,
//   },
//   acol: { alignItems: 'center' },
//   btn: {
//     width: 66,
//     height: 66,
//     borderRadius: 33,
//     borderWidth: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   hintBtn: { backgroundColor: '#a8e22a', borderColor: '#d6f58a' },
//   giftBtn: { backgroundColor: '#ffc83d', borderColor: '#fff3c4' },
//   videoBtn: { backgroundColor: '#a35bd6', borderColor: '#e6d0f7' },
//   costPill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     height: 26,
//     marginTop: 6,
//     paddingHorizontal: 12,
//     borderRadius: 13,
//     backgroundColor: '#6b4423',
//   },
//   costText: { color: '#fff', fontSize: 15, fontWeight: '900' },
//   coinDot: {
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: '#ffc83d',
//   },
// });
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  bt36Answer,
  bt36Hint,
  bt36Reward,
  bt36Skip,
  bt36Start,
} from './Btlevel36api';
import {
  BTBulbIcon,
  BTGiftIcon,
  BTIconButtonGlyph,
  BTLamp,
  BTLevel36Room,
  BTMagnifierIcon,
  BTVideoIcon,
} from './Btlevel36art';

const HINT_COST = 25;
const SKIP_COST = 50; // keep in sync with the backend costs
const REWARD = 75;
const CORRECT_ANSWER = '36';
const HIT_MARGIN = 34; // how forgiving the drop area is (px)
const NAVY = '#10245e';

type Digit = 3 | 6;
type Rect = { x: number; y: number; w: number; h: number };

type Props = {
  playerId: any;
  hints?: any;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onComplete?: (r: any) => void;
};

const hit = (z: Rect, mx: number, my: number) =>
  mx >= z.x - HIT_MARGIN &&
  mx <= z.x + z.w + HIT_MARGIN &&
  my >= z.y - HIT_MARGIN &&
  my <= z.y + z.h + HIT_MARGIN;

const springBack = (pan: Animated.ValueXY) => {
  Animated.spring(pan, {
    toValue: { x: 0, y: 0 },
    useNativeDriver: false,
    friction: 6,
  }).start();
};

export default function BTLevel36Screen({
  playerId,
  hints,
  setHints,
  onExit,
  onComplete,
}: Props) {
  const [bulbs, setBulbs] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [hintText, setHintText] = useState('');
  const [placed3, setPlaced3] = useState(false); // the 3 now sits on X
  const [placed6, setPlaced6] = useState(false); // the 6 now sits on Y
  const [done, setDone] = useState(false);
  const [dragging, setDragging] = useState<0 | 3 | 6>(0);

  const busy = useRef(false);
  const finished = useRef(false);
  const pan3 = useRef(new Animated.ValueXY()).current;
  const pan6 = useRef(new Animated.ValueXY()).current;
  const zoneXRef = useRef<View>(null);
  const zoneYRef = useRef<View>(null);
  const zoneXRect = useRef<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const zoneYRect = useRef<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const dropHandler = useRef<(d: Digit, x: number, y: number) => void>(
    () => {}
  );

  const bal = Number(hints ?? bulbs ?? 0);

  const flash = (m: string) => {
    setNote(m);
    setTimeout(() => setNote(''), 1800);
  };

  const syncBalance = (n: number) => {
    setBulbs(n);
    if (setHints) setHints(n);
  };

  useEffect(() => {
    bt36Start(playerId)
      .then((res) => syncBalance(res.hints))
      .catch((e: any) => flash(e.message));
  }, [playerId]);

  const measureZones = () => {
    zoneXRef.current?.measureInWindow((x, y, w, h) => {
      zoneXRect.current = { x, y, w, h };
    });
    zoneYRef.current?.measureInWindow((x, y, w, h) => {
      zoneYRect.current = { x, y, w, h };
    });
  };

  const win = (attempts: number, skipped: boolean) => {
    if (finished.current) return;
    finished.current = true;
    setPlaced3(true);
    setPlaced6(true);
    setDone(true);
    setTimeout(() => {
      if (onComplete) {
        onComplete({ correct: true, attempts: Math.max(1, attempts), skipped });
      }
    }, 1400);
  };

  // both digits are placed (3 on X, 6 on Y) -> ask the server (accept locally if server is down)
  const submitPlaced = async () => {
    if (busy.current || finished.current) return;
    busy.current = true;
    try {
      const res = await bt36Answer(playerId, CORRECT_ANSWER);
      if (res && typeof res.hints === 'number') syncBalance(res.hints);
      if (res?.correct) {
        win(res.attempts ?? 1, false);
      } else {
        setPlaced3(false);
        setPlaced6(false);
        flash('Not quite. Try again!');
      }
    } catch (e: any) {
      win(1, false);
    } finally {
      busy.current = false;
    }
  };

  useEffect(() => {
    if (placed3 && placed6 && !finished.current) submitPlaced();
  }, [placed3, placed6]);

  // refreshed every render so it never uses stale state
  dropHandler.current = (d: Digit, mx: number, my: number) => {
    setDragging(0);
    const pan = d === 3 ? pan3 : pan6;
    const own = d === 3 ? zoneXRect.current : zoneYRect.current;
    const other = d === 3 ? zoneYRect.current : zoneXRect.current;
    if (!finished.current && hit(own, mx, my)) {
      pan.setValue({ x: 0, y: 0 });
      if (d === 3) setPlaced3(true);
      else setPlaced6(true);
    } else {
      if (!finished.current && hit(other, mx, my)) {
        flash('Try the other letter');
      }
      springBack(pan);
    }
  };

  const makeResponder = (d: Digit, pan: Animated.ValueXY) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => !finished.current,
      onPanResponderGrant: () => {
        measureZones();
        setDragging(d);
        pan.setOffset({ x: 0, y: 0 });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_e, g) => dropHandler.current(d, g.moveX, g.moveY),
      onPanResponderTerminate: () => {
        setDragging(0);
        springBack(pan);
      },
    });

  const resp3 = useRef(makeResponder(3, pan3)).current;
  const resp6 = useRef(makeResponder(6, pan6)).current;

  const onHint = async () => {
    if (busy.current || done) return;
    if (bal < HINT_COST) {
      flash('Need ' + HINT_COST + ' hints. You have ' + bal + '.');
      return;
    }
    busy.current = true;
    try {
      const res = await bt36Hint(playerId);
      syncBalance(res.hints);
      setHintText(res.hint.text);
    } catch (e: any) {
      flash(e.status === 402 ? 'Not enough hints' : e.message);
    } finally {
      busy.current = false;
    }
  };

  const onGift = async () => {
    if (busy.current || done) return;
    busy.current = true;
    try {
      // TODO: show your rewarded-ad SDK here and call the API only after it finishes
      const res = await bt36Reward(playerId);
      syncBalance(res.hints);
      flash('+' + REWARD + ' hints!');
    } catch (e: any) {
      flash(e.message);
    } finally {
      busy.current = false;
    }
  };

  const onSkip = async () => {
    if (busy.current || done) return;
    if (bal < SKIP_COST) {
      flash('Need ' + SKIP_COST + ' hints. You have ' + bal + '.');
      return;
    }
    busy.current = true;
    try {
      const res = await bt36Skip(playerId);
      syncBalance(res.hints);
      win(res.attempts, true);
    } catch (e: any) {
      flash(e.status === 402 ? 'Not enough hints' : e.message);
    } finally {
      busy.current = false;
    }
  };

  // one draggable digit in the top sign
  const renderDigit = (
    d: Digit,
    pan: Animated.ValueXY,
    resp: ReturnType<typeof PanResponder.create>,
    isPlaced: boolean
  ) => (
    <View style={[s.digitSlot, { zIndex: dragging === d ? 99 : 1 }]}>
      <Animated.View
        {...resp.panHandlers}
        hitSlop={{ top: 12, bottom: 12, left: 6, right: 6 }}
        style={[
          s.digit,
          {
            opacity: isPlaced ? 0 : 1,
            transform: pan.getTranslateTransform(),
            zIndex: dragging === d ? 99 : 1,
            elevation: dragging === d ? 20 : 0,
          },
        ]}
      >
        <Text style={s.signText}>{d}</Text>
      </Animated.View>
    </View>
  );

  return (
    <View style={s.root}>
      <BTLevel36Room />
      <BTLamp />

      {/* top bar (raised so the dragged digits can fly over everything) */}
      <View style={s.topBar}>
        <View style={s.roundBtnRow}>
          <Pressable style={s.roundBtn} onPress={onExit}>
            <BTIconButtonGlyph glyph={'⌂'} />
          </Pressable>
          <Pressable style={s.roundBtn}>
            <BTIconButtonGlyph glyph={'⚙'} />
          </Pressable>
        </View>

        <View style={s.signWrap}>
          <View style={[s.string, { left: 24 }]} />
          <View style={[s.string, { right: 24 }]} />
          <View style={s.sign}>
            <Text style={s.arrow}>{'<'}</Text>

            <View style={s.levelRow}>
              <Text style={s.signText}>{'LEVEL '}</Text>

              {/* the draggable 3 and 6 */}
              {renderDigit(3, pan3, resp3, placed3)}
              {renderDigit(6, pan6, resp6, placed6)}
            </View>

            <Text style={s.arrow}>{'>'}</Text>
          </View>
        </View>

        <View style={s.bulbPill}>
          <Text style={s.bulbText}>{bal}</Text>
          <View style={s.bulbIcon}>
            <BTBulbIcon size={26} />
          </View>
        </View>
      </View>

      {/* notebook card */}
      <View style={s.card}>
        <View style={s.rings}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={s.ring} />
          ))}
        </View>

        <View style={s.questionPill}>
          <Text style={s.questionText}>Make this equation correct.</Text>
        </View>

        <View style={s.lines}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={s.line} />
          ))}
        </View>

        <View style={s.equationRow}>
          {/* X: the 3 drops here */}
          <View
            ref={zoneXRef}
            onLayout={measureZones}
            style={[s.zone, dragging !== 0 && s.zoneActive]}
          >
            <Text style={[s.eq, placed3 && s.eqPlaced]}>
              {placed3 ? '3' : 'X'}
            </Text>
          </View>

          <Text style={s.eq}>{' + '}</Text>

          {/* Y: the 6 drops here */}
          <View
            ref={zoneYRef}
            onLayout={measureZones}
            style={[s.zone, dragging !== 0 && s.zoneActive]}
          >
            <Text style={[s.eq, placed6 && s.eqPlaced]}>
              {placed6 ? '6' : 'Y'}
            </Text>
          </View>

          <Text style={s.eq}>{' = 9'}</Text>
        </View>

        <Text style={s.hintText}>{hintText}</Text>
        <Text style={s.messageText}>{note}</Text>

        {done ? (
          <View style={s.solvedOverlay}>
            <Text style={s.solvedTitle}>Correct!</Text>
            <Text style={s.solvedSub}>3 + 6 = 9</Text>
          </View>
        ) : null}
      </View>

      {/* hint / gift / skip */}
      <View style={s.bar}>
        <View style={s.acol}>
          <Pressable style={[s.btn, s.hintBtn]} onPress={onHint}>
            <BTMagnifierIcon />
          </Pressable>
          <View style={s.costPill}>
            <BTBulbIcon size={14} />
            <Text style={s.costText}>{HINT_COST}</Text>
          </View>
        </View>

        <View style={s.acol}>
          <Pressable style={[s.btn, s.giftBtn]} onPress={onGift}>
            <BTGiftIcon />
          </Pressable>
          <View style={s.costPill}>
            <View style={s.coinDot} />
            <Text style={s.costText}>{'+' + REWARD}</Text>
          </View>
        </View>

        <View style={s.acol}>
          <Pressable style={[s.btn, s.videoBtn]} onPress={onSkip}>
            <BTVideoIcon />
          </Pressable>
          <View style={s.costPill}>
            <BTBulbIcon size={14} />
            <Text style={s.costText}>{SKIP_COST}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#7fc4f5',
    paddingTop: 28,
    paddingHorizontal: 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 50,
    elevation: 10,
  },
  roundBtnRow: { flexDirection: 'row', gap: 6 },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffd23f',
    borderWidth: 3,
    borderColor: '#5b3a12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signWrap: { alignItems: 'center', paddingTop: 16 },
  string: {
    position: 'absolute',
    top: -8,
    width: 3,
    height: 26,
    backgroundColor: '#b5651d',
  },
  sign: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#c8702a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    overflow: 'visible',
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
  },
  signText: { color: '#fff', fontSize: 22, fontWeight: '900' },
  arrow: { color: '#ffc83d', fontSize: 22, fontWeight: '900' },
  digitSlot: { width: 15, height: 30, overflow: 'visible' },
  digit: {
    width: 15,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  bulbPill: {
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 38,
    minWidth: 80,
    paddingLeft: 16,
    paddingRight: 28,
    justifyContent: 'center',
    marginTop: 8,
  },
  bulbText: { fontSize: 22, fontWeight: '900', color: NAVY },
  bulbIcon: { position: 'absolute', right: -4, top: 4 },

  card: {
    marginTop: 40,
    alignSelf: 'center',
    width: '92%',
    maxWidth: 420,
    minHeight: 330,
    backgroundColor: '#fbf6e9',
    borderRadius: 18,
    borderWidth: 5,
    borderColor: '#f0b872',
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    overflow: 'hidden',
  },
  rings: {
    position: 'absolute',
    top: 6,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ring: {
    width: 10,
    height: 16,
    borderRadius: 5,
    backgroundColor: '#f0a43a',
  },
  questionPill: {
    marginTop: 16,
    backgroundColor: '#fbe5b6',
    borderWidth: 2,
    borderColor: '#f4a730',
    borderStyle: 'dashed',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  questionText: { fontSize: 18, fontWeight: '900', color: NAVY },
  lines: {
    position: 'absolute',
    top: 90,
    left: 14,
    right: 14,
  },
  line: {
    height: 1.5,
    backgroundColor: '#d8e6ee',
    marginBottom: 38,
  },
  equationRow: {
    marginTop: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eq: { fontSize: 50, fontWeight: '900', color: NAVY, letterSpacing: 1 },
  eqPlaced: { color: '#2fae5b' },
  zone: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  zoneActive: {
    borderColor: '#f4a730',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(244,167,48,0.12)',
  },
  hintText: {
    marginTop: 26,
    minHeight: 18,
    fontSize: 14,
    fontWeight: '700',
    color: '#5b4a2a',
    textAlign: 'center',
  },
  messageText: {
    minHeight: 20,
    fontSize: 15,
    fontWeight: '800',
    color: '#c0392b',
    textAlign: 'center',
  },
  solvedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(251,246,233,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solvedTitle: { fontSize: 36, fontWeight: '900', color: '#2fae5b' },
  solvedSub: { marginTop: 6, fontSize: 28, fontWeight: '900', color: NAVY },

  bar: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    backgroundColor: '#f5e8d0',
    borderWidth: 6,
    borderColor: '#7cc0f2',
    borderRadius: 50,
    paddingVertical: 12,
  },
  acol: { alignItems: 'center' },
  btn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBtn: { backgroundColor: '#a8e22a', borderColor: '#d6f58a' },
  giftBtn: { backgroundColor: '#ffc83d', borderColor: '#fff3c4' },
  videoBtn: { backgroundColor: '#a35bd6', borderColor: '#e6d0f7' },
  costPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 26,
    marginTop: 6,
    paddingHorizontal: 12,
    borderRadius: 13,
    backgroundColor: '#6b4423',
  },
  costText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  coinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffc83d',
  },
});
