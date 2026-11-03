// // // // // Btlevel40art.tsx  -  books artwork with overlapping blue digits
// // // // import React from 'react';
// // // // import { View, Text, StyleSheet } from 'react-native';

// // // // const BOOKS = [
// // // //   { color: '#D6B8DE', width: 46, height: 130, digit: '2' },
// // // //   { color: '#5E7F3F', width: 34, height: 136, digit: '8' },
// // // //   { color: '#E04A3A', width: 56, height: 136, digit: '5' },
// // // //   { color: '#F7DC8A', width: 50, height: 136, digit: '2' },
// // // //   { color: '#6FC7B5', width: 42, height: 128, digit: '' },
// // // // ];

// // // // export default function Btlevel40art() {
// // // //   return (
// // // //     <View style={styles.row}>
// // // //       {BOOKS.map((b, i) => (
// // // //         <View
// // // //           key={i}
// // // //           style={[styles.book, { backgroundColor: b.color, width: b.width, height: b.height }]}
// // // //         >
// // // //           <View style={styles.stripe} />
// // // //           <Text style={styles.digit}>{b.digit}</Text>
// // // //           <View style={[styles.stripe, { bottom: 18, top: undefined }]} />
// // // //         </View>
// // // //       ))}
// // // //     </View>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
// // // //   book: {
// // // //     borderWidth: 3,
// // // //     borderColor: '#1a1a1a',
// // // //     borderRadius: 6,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginHorizontal: -2,
// // // //   },
// // // //   stripe: { position: 'absolute', top: 24, left: 0, right: 0, height: 3, backgroundColor: '#1a1a1a55' },
// // // //   digit: { fontSize: 54, fontWeight: '900', color: '#3B2BF0', opacity: 0.85 },
// // // // });
// // // // Btlevel40art.tsx  -  5 books with overlapping blue digits. Drag a book left/right to re-order.
// // // // onArrange(digits) is called after every drop that changed the order (digits = what the books read left -> right)
// // // import React, { useRef, useState } from 'react';
// // // import { View, Text, Animated, PanResponder, StyleSheet } from 'react-native';

// // // const BOOKS = [
// // //   { id: 0, color: '#D6B8DE', w: 64, h: 150, digit: '2' },
// // //   { id: 1, color: '#5E7F3F', w: 52, h: 160, digit: '8' },
// // //   { id: 2, color: '#E04A3A', w: 66, h: 160, digit: '5' },
// // //   { id: 3, color: '#F7DC8A', w: 62, h: 162, digit: '2' },
// // //   { id: 4, color: '#6FC7B5', w: 56, h: 148, digit: '' }, // blank book
// // // ];
// // // const SLOT = 58;
// // // const INITIAL = [1, 3, 2, 4, 0]; // starts jumbled (reads 8 2 5 2)
// // // const MAX_X = SLOT * (BOOKS.length - 1);

// // // export default function Btlevel40art({ onArrange, locked }: { onArrange?: (d: string) => void; locked?: boolean }) {
// // //   const [order, setOrder] = useState<number[]>(INITIAL);
// // //   const [dragId, setDragId] = useState<number | null>(null);
// // //   const orderR = useRef<number[]>(INITIAL);
// // //   const lockedR = useRef(false);
// // //   lockedR.current = !!locked;
// // //   const cbR = useRef(onArrange);
// // //   cbR.current = onArrange;
// // //   const startX = useRef(0);

// // //   const xs = useRef(BOOKS.map((b) => new Animated.Value(INITIAL.indexOf(b.id) * SLOT))).current;

// // //   const snap = (next: number[]) =>
// // //     next.forEach((id, idx) =>
// // //       Animated.spring(xs[id], { toValue: idx * SLOT, friction: 7, useNativeDriver: false }).start()
// // //     );

// // //   const responders = useRef(
// // //     BOOKS.map((b) =>
// // //       PanResponder.create({
// // //         onStartShouldSetPanResponder: () => !lockedR.current,
// // //         onMoveShouldSetPanResponder: () => !lockedR.current,
// // //         onPanResponderGrant: () => {
// // //           startX.current = orderR.current.indexOf(b.id) * SLOT;
// // //           setDragId(b.id);
// // //         },
// // //         onPanResponderMove: (_, g) => {
// // //           xs[b.id].setValue(Math.max(0, Math.min(MAX_X, startX.current + g.dx)));
// // //         },
// // //         onPanResponderRelease: (_, g) => {
// // //           const from = orderR.current.indexOf(b.id);
// // //           const to = Math.max(0, Math.min(BOOKS.length - 1, Math.round((startX.current + g.dx) / SLOT)));
// // //           const next = orderR.current.filter((i) => i !== b.id);
// // //           next.splice(to, 0, b.id);
// // //           orderR.current = next;
// // //           setOrder(next);
// // //           setDragId(null);
// // //           snap(next);
// // //           if (from !== to) cbR.current?.(next.map((id) => BOOKS[id].digit).join(''));
// // //         },
// // //         onPanResponderTerminate: () => {
// // //           setDragId(null);
// // //           snap(orderR.current);
// // //         },
// // //       })
// // //     )
// // //   ).current;

// // //   return (
// // //     <View style={styles.wrap}>
// // //       {BOOKS.map((b) => {
// // //         const z = dragId === b.id ? 50 : order.indexOf(b.id) + 1;
// // //         return (
// // //           <Animated.View
// // //             key={b.id}
// // //             {...responders[b.id].panHandlers}
// // //             style={[
// // //               styles.book,
// // //               {
// // //                 width: b.w,
// // //                 height: b.h,
// // //                 backgroundColor: b.color,
// // //                 zIndex: z,
// // //                 elevation: z,
// // //                 transform: [{ translateX: xs[b.id] }, { scale: dragId === b.id ? 1.06 : 1 }],
// // //               },
// // //             ]}
// // //           >
// // //             <View style={[styles.stripe, { top: 22 }]} />
// // //             <View style={[styles.stripe, { bottom: 26 }]} />
// // //             {!!b.digit && <Text style={styles.digit}>{b.digit}</Text>}
// // //           </Animated.View>
// // //         );
// // //       })}
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   wrap: { width: SLOT * 4 + 70, height: 170, alignSelf: 'center' },
// // //   book: {
// // //     position: 'absolute',
// // //     bottom: 0,
// // //     left: 0,
// // //     borderWidth: 3,
// // //     borderColor: '#1a1a1a',
// // //     borderRadius: 7,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   stripe: { position: 'absolute', left: 0, right: 0, height: 4, backgroundColor: 'rgba(0,0,0,0.35)' },
// // //   digit: {
// // //     position: 'absolute',
// // //     left: -14,
// // //     right: -14,
// // //     textAlign: 'center',
// // //     fontSize: 78,
// // //     fontWeight: '900',
// // //     color: '#3B2BF0',
// // //     opacity: 0.88,
// // //     includeFontPadding: false,
// // //   },
// // // });
// // // Btlevel40art.tsx  -  5 books with overlapping blue digits. Drag a book left/right to re-order.
// // // onArrange(digits) is called after every drop that changed the order (digits = what the books read left -> right)
// // import React, { useEffect, useRef, useState } from 'react';
// // import { View, Text, Animated, PanResponder, StyleSheet } from 'react-native';

// // const BOOKS = [
// //   { id: 0, color: '#D6B8DE', w: 64, h: 150, digit: '2' },
// //   { id: 1, color: '#5E7F3F', w: 52, h: 160, digit: '8' },
// //   { id: 2, color: '#E04A3A', w: 66, h: 160, digit: '5' },
// //   { id: 3, color: '#F7DC8A', w: 62, h: 162, digit: '2' },
// //   { id: 4, color: '#6FC7B5', w: 56, h: 148, digit: '' }, // blank book
// // ];
// // const TILT = ['-6deg', '5deg', '-4deg', '7deg', '0deg']; // hand-drawn tilt per book
// // const SLOT = 58;
// // const INITIAL = [1, 3, 2, 4, 0]; // starts jumbled (reads 8 2 5 2)
// // const MAX_X = SLOT * (BOOKS.length - 1);

// // export default function Btlevel40art({ onArrange, locked }: { onArrange?: (d: string) => void; locked?: boolean }) {
// //   const [order, setOrder] = useState<number[]>(INITIAL);
// //   const [dragId, setDragId] = useState<number | null>(null);
// //   const orderR = useRef<number[]>(INITIAL);
// //   const lockedR = useRef(false);
// //   lockedR.current = !!locked;
// //   const cbR = useRef(onArrange);
// //   cbR.current = onArrange;
// //   const startX = useRef(0);

// //   // digits start MIRRORED (flipped like in a mirror); they flip to normal when the number is solved
// //   const flip = useRef(new Animated.Value(0)).current;
// //   useEffect(() => {
// //     Animated.timing(flip, { toValue: locked ? 1 : 0, duration: 500, useNativeDriver: true }).start();
// //   }, [locked]);
// //   const scaleX = flip.interpolate({ inputRange: [0, 1], outputRange: [-1, 1] });

// //   const xs = useRef(BOOKS.map((b) => new Animated.Value(INITIAL.indexOf(b.id) * SLOT))).current;

// //   const snap = (next: number[]) =>
// //     next.forEach((id, idx) =>
// //       Animated.spring(xs[id], { toValue: idx * SLOT, friction: 7, useNativeDriver: false }).start()
// //     );

// //   const responders = useRef(
// //     BOOKS.map((b) =>
// //       PanResponder.create({
// //         onStartShouldSetPanResponder: () => !lockedR.current,
// //         onMoveShouldSetPanResponder: () => !lockedR.current,
// //         onPanResponderGrant: () => {
// //           startX.current = orderR.current.indexOf(b.id) * SLOT;
// //           setDragId(b.id);
// //         },
// //         onPanResponderMove: (_, g) => {
// //           xs[b.id].setValue(Math.max(0, Math.min(MAX_X, startX.current + g.dx)));
// //         },
// //         onPanResponderRelease: (_, g) => {
// //           const from = orderR.current.indexOf(b.id);
// //           const to = Math.max(0, Math.min(BOOKS.length - 1, Math.round((startX.current + g.dx) / SLOT)));
// //           const next = orderR.current.filter((i) => i !== b.id);
// //           next.splice(to, 0, b.id);
// //           orderR.current = next;
// //           setOrder(next);
// //           setDragId(null);
// //           snap(next);
// //           if (from !== to) cbR.current?.(next.map((id) => BOOKS[id].digit).join(''));
// //         },
// //         onPanResponderTerminate: () => {
// //           setDragId(null);
// //           snap(orderR.current);
// //         },
// //       })
// //     )
// //   ).current;

// //   return (
// //     <View style={styles.wrap}>
// //       {BOOKS.map((b) => {
// //         const z = dragId === b.id ? 50 : order.indexOf(b.id) + 1;
// //         return (
// //           <Animated.View
// //             key={b.id}
// //             {...responders[b.id].panHandlers}
// //             style={[
// //               styles.book,
// //               {
// //                 width: b.w,
// //                 height: b.h,
// //                 backgroundColor: b.color,
// //                 zIndex: z,
// //                 elevation: z,
// //                 transform: [{ translateX: xs[b.id] }, { scale: dragId === b.id ? 1.06 : 1 }],
// //               },
// //             ]}
// //           >
// //             <View style={[styles.stripe, { top: 22 }]} />
// //             <View style={[styles.stripe, { bottom: 26 }]} />
// //             {!!b.digit && (
// //               <Animated.Text
// //                 style={[styles.digit, { transform: [{ scaleX }, { rotate: TILT[b.id] }] }]}
// //               >
// //                 {b.digit}
// //               </Animated.Text>
// //             )}
// //           </Animated.View>
// //         );
// //       })}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   wrap: { width: SLOT * 4 + 70, height: 170, alignSelf: 'center' },
// //   book: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     borderWidth: 3,
// //     borderColor: '#1a1a1a',
// //     borderRadius: 7,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   stripe: { position: 'absolute', left: 0, right: 0, height: 4, backgroundColor: 'rgba(0,0,0,0.35)' },
// //   digit: {
// //     position: 'absolute',
// //     left: -14,
// //     right: -14,
// //     textAlign: 'center',
// //     fontSize: 78,
// //     fontWeight: '900',
// //     color: '#3B2BF0',
// //     opacity: 0.88,
// //     includeFontPadding: false,
// //   },
// // });
// // Btlevel40art.tsx  -  5 books, each one shows a SLICE of the blue number "2285" (like the reference image).
// // At the start the books are in the wrong order, so the slices look like a jumbled scribble.
// // Drag the books left/right: when they are in the right order the slices join up and read 2285.
// // onArrange(answer) is called after every drop that changed the order.
// import React, { useRef, useState } from 'react';
// import { View, Text, Animated, PanResponder, StyleSheet } from 'react-native';

// const SECRET = '2285';
// const SLOT = 50;
// const COUNT = 5;
// const STRIP_W = SLOT * COUNT; // 250
// const MAX_X = SLOT * (COUNT - 1);
// const DIGIT_X = [32, 95, 158, 221]; // centre of each digit on the 250px strip
// const BLUE = '#3B2BF0';

// // slice = the slot (0..4) where this book must stand so the number lines up.
// // Array order = the starting order on the shelf (purple, green, red, yellow, teal like the reference).
// const BOOKS = [
//   { id: 0, color: '#C9A9D6', w: 56, h: 168, slice: 2 },
//   { id: 1, color: '#5E7F3F', w: 44, h: 176, slice: 0 },
//   { id: 2, color: '#DD4A38', w: 58, h: 160, slice: 4 },
//   { id: 3, color: '#F9D56E', w: 54, h: 172, slice: 1 },
//   { id: 4, color: '#6FC7B5', w: 48, h: 164, slice: 3 },
// ];
// const INITIAL = [0, 1, 2, 3, 4];

// const isSolved = (order: number[]) => order.every((id, idx) => BOOKS[id].slice === idx);

// export default function Btlevel40art({ onArrange, locked }: { onArrange?: (answer: string) => void; locked?: boolean }) {
//   const [order, setOrder] = useState<number[]>(INITIAL);
//   const [dragId, setDragId] = useState<number | null>(null);
//   const orderR = useRef<number[]>(INITIAL);
//   const lockedR = useRef(false);
//   lockedR.current = !!locked;
//   const cbR = useRef(onArrange);
//   cbR.current = onArrange;
//   const startX = useRef(0);

//   const xs = useRef(BOOKS.map((b) => new Animated.Value(INITIAL.indexOf(b.id) * SLOT))).current;

//   const snap = (next: number[]) =>
//     next.forEach((id, idx) =>
//       Animated.spring(xs[id], { toValue: idx * SLOT, friction: 7, useNativeDriver: false }).start()
//     );

//   const responders = useRef(
//     BOOKS.map((b) =>
//       PanResponder.create({
//         onStartShouldSetPanResponder: () => !lockedR.current,
//         onMoveShouldSetPanResponder: () => !lockedR.current,
//         onPanResponderGrant: () => {
//           startX.current = orderR.current.indexOf(b.id) * SLOT;
//           setDragId(b.id);
//         },
//         onPanResponderMove: (_, g) => {
//           xs[b.id].setValue(Math.max(0, Math.min(MAX_X, startX.current + g.dx)));
//         },
//         onPanResponderRelease: (_, g) => {
//           const from = orderR.current.indexOf(b.id);
//           const to = Math.max(0, Math.min(COUNT - 1, Math.round((startX.current + g.dx) / SLOT)));
//           const next = orderR.current.filter((i) => i !== b.id);
//           next.splice(to, 0, b.id);
//           orderR.current = next;
//           setOrder(next);
//           setDragId(null);
//           snap(next);
//           if (from !== to) {
//             // solved -> the number the books now read; otherwise a different number (backend says "wrong")
//             const answer = isSolved(next) ? SECRET : next.map((id) => BOOKS[id].slice).join('');
//             cbR.current?.(answer);
//           }
//         },
//         onPanResponderTerminate: () => {
//           setDragId(null);
//           snap(orderR.current);
//         },
//       })
//     )
//   ).current;

//   return (
//     <View style={styles.wrap}>
//       {BOOKS.map((b) => {
//         const z = dragId === b.id ? 50 : order.indexOf(b.id) + 1;
//         const offset = -b.slice * SLOT; // which part of the number strip this book shows
//         return (
//           <Animated.View
//             key={b.id}
//             {...responders[b.id].panHandlers}
//             style={[
//               styles.book,
//               {
//                 width: b.w,
//                 height: b.h,
//                 backgroundColor: b.color,
//                 zIndex: z,
//                 elevation: z,
//                 transform: [{ translateX: xs[b.id] }, { scale: dragId === b.id ? 1.05 : 1 }],
//               },
//             ]}
//           >
//             {/* clipped window: only this book's slice of the number is visible */}
//             <View style={styles.clip}>
//               {/* pale lower band + lines (like the reference books) */}
//               <View style={styles.band} />
//               <View style={[styles.line, { bottom: 40 }]} />
//               <View style={[styles.line, { bottom: 28 }]} />

//               <View style={[styles.strip, { left: offset, bottom: 14 }]}>
//                 {SECRET.split('').map((d, i) => (
//                   <Text key={i} style={[styles.digit, { left: DIGIT_X[i] - 36 }]}>
//                     {d}
//                   </Text>
//                 ))}
//               </View>
//             </View>
//           </Animated.View>
//         );
//       })}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrap: { width: SLOT * 4 + 62, height: 180, alignSelf: 'center' },
//   book: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     borderWidth: 4,
//     borderColor: '#141414',
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   clip: { flex: 1, overflow: 'hidden' },
//   band: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: 52,
//     backgroundColor: 'rgba(255,255,255,0.38)',
//   },
//   line: { position: 'absolute', left: 0, right: 0, height: 4, backgroundColor: '#141414' },
//   strip: { position: 'absolute', width: STRIP_W, height: 130 },
//   digit: {
//     position: 'absolute',
//     top: 0,
//     width: 72,
//     textAlign: 'center',
//     fontSize: 104,
//     lineHeight: 120,
//     fontWeight: '400',
//     color: BLUE,
//     includeFontPadding: false,
//   },
// });
// Btlevel40art.tsx  -  NO image needed, everything is drawn with code.
// 5 books, each one shows a slice of the blue number "2285". At the start the books are in the wrong
// order so the number looks like a jumbled scribble (like the reference). Drag a book: it lifts and
// rotates (tilts) while you move it. Arrange the books correctly and the slices join up into 2285.
import React, { useRef, useState } from 'react';
import { View, Text, Animated, PanResponder, StyleSheet } from 'react-native';

const SECRET = '2285';
const SLOT = 52;
const COUNT = 5;
const STRIP_W = SLOT * COUNT; // 260
const MAX_X = SLOT * (COUNT - 1);
const DIGIT_X = [34, 99, 164, 229]; // centre of each digit on the strip
const BLUE = '#3B2BF0';

// slice = the slot (0..4) where this book must stand so the number lines up.
// Array order = starting order on the shelf (purple, green, red, yellow, teal), all in the wrong place.
const BOOKS = [
  { id: 0, color: '#C9A9D6', w: 58, h: 168, slice: 2 },
  { id: 1, color: '#5E7F3F', w: 46, h: 176, slice: 0 },
  { id: 2, color: '#DD4A38', w: 60, h: 160, slice: 4 },
  { id: 3, color: '#F9D56E', w: 56, h: 172, slice: 1 },
  { id: 4, color: '#6FC7B5', w: 50, h: 164, slice: 3 },
];
const INITIAL = [0, 1, 2, 3, 4];

const isSolved = (order: number[]) => order.every((id, idx) => BOOKS[id].slice === idx);

export default function Btlevel40art({ onArrange, locked }: { onArrange?: (answer: string) => void; locked?: boolean }) {
  const [order, setOrder] = useState<number[]>(INITIAL);
  const [dragId, setDragId] = useState<number | null>(null);
  const orderR = useRef<number[]>(INITIAL);
  const lockedR = useRef(false);
  lockedR.current = !!locked;
  const cbR = useRef(onArrange);
  cbR.current = onArrange;
  const startX = useRef(0);

  const xs = useRef(BOOKS.map((b) => new Animated.Value(INITIAL.indexOf(b.id) * SLOT))).current;
  const rots = useRef(BOOKS.map(() => new Animated.Value(0))).current; // tilt (degrees) while dragging
  const lifts = useRef(BOOKS.map(() => new Animated.Value(0))).current; // lift while dragging

  const snap = (next: number[]) =>
    next.forEach((id, idx) =>
      Animated.spring(xs[id], { toValue: idx * SLOT, friction: 7, useNativeDriver: false }).start()
    );
  const settle = (id: number) => {
    Animated.spring(rots[id], { toValue: 0, friction: 4, useNativeDriver: false }).start();
    Animated.spring(lifts[id], { toValue: 0, friction: 6, useNativeDriver: false }).start();
  };

  const responders = useRef(
    BOOKS.map((b) =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !lockedR.current,
        onMoveShouldSetPanResponder: () => !lockedR.current,
        onPanResponderGrant: () => {
          startX.current = orderR.current.indexOf(b.id) * SLOT;
          setDragId(b.id);
          Animated.spring(lifts[b.id], { toValue: 1, friction: 6, useNativeDriver: false }).start();
        },
        onPanResponderMove: (_, g) => {
          xs[b.id].setValue(Math.max(0, Math.min(MAX_X, startX.current + g.dx)));
          rots[b.id].setValue(Math.max(-16, Math.min(16, g.dx / 8))); // rotate while dragging
        },
        onPanResponderRelease: (_, g) => {
          const from = orderR.current.indexOf(b.id);
          const to = Math.max(0, Math.min(COUNT - 1, Math.round((startX.current + g.dx) / SLOT)));
          const next = orderR.current.filter((i) => i !== b.id);
          next.splice(to, 0, b.id);
          orderR.current = next;
          setOrder(next);
          setDragId(null);
          snap(next);
          settle(b.id);
          if (from !== to) {
            // solved -> 2285 ; otherwise some other number (backend says "wrong")
            const answer = isSolved(next) ? SECRET : next.map((id) => BOOKS[id].slice).join('');
            cbR.current?.(answer);
          }
        },
        onPanResponderTerminate: () => {
          setDragId(null);
          snap(orderR.current);
          settle(b.id);
        },
      })
    )
  ).current;

  return (
    <View style={styles.wrap}>
      {BOOKS.map((b) => {
        const z = dragId === b.id ? 50 : order.indexOf(b.id) + 1;
        const offset = -b.slice * SLOT; // which part of the number this book shows
        return (
          <Animated.View
            key={b.id}
            {...responders[b.id].panHandlers}
            style={[
              styles.book,
              {
                width: b.w,
                height: b.h,
                backgroundColor: b.color,
                zIndex: z,
                elevation: z,
                transform: [
                  { translateX: xs[b.id] },
                  { translateY: lifts[b.id].interpolate({ inputRange: [0, 1], outputRange: [0, -14] }) },
                  { rotate: rots[b.id].interpolate({ inputRange: [-16, 16], outputRange: ['-16deg', '16deg'] }) },
                ],
              },
            ]}
          >
            <View style={styles.clip}>
              <View style={styles.band} />
              <View style={[styles.line, { bottom: 40 }]} />
              <View style={[styles.line, { bottom: 28 }]} />
              <View style={[styles.strip, { left: offset, bottom: 14 }]}>
                {SECRET.split('').map((d, i) => (
                  <Text key={i} style={[styles.digit, { left: DIGIT_X[i] - 36 }]}>
                    {d}
                  </Text>
                ))}
              </View>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: SLOT * 4 + 64, height: 196, alignSelf: 'center' },
  book: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderWidth: 4,
    borderColor: '#141414',
    borderRadius: 8,
    overflow: 'hidden',
  },
  clip: { flex: 1, overflow: 'hidden' },
  band: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 52, backgroundColor: 'rgba(255,255,255,0.38)' },
  line: { position: 'absolute', left: 0, right: 0, height: 4, backgroundColor: '#141414' },
  strip: { position: 'absolute', width: STRIP_W, height: 130 },
  digit: {
    position: 'absolute',
    top: 0,
    width: 72,
    textAlign: 'center',
    fontSize: 104,
    lineHeight: 120,
    fontWeight: '400',
    color: BLUE,
    includeFontPadding: false,
  },
});

