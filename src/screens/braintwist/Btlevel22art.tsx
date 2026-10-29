// // // import React from 'react';
// // // import { View, Text, StyleSheet } from 'react-native';

// // // function Wheel() {
// // //   return (
// // //     <View style={styles.wheel}>
// // //       <View style={styles.wheelHub} />
// // //     </View>
// // //   );
// // // }

// // // function ThiefCar() {
// // //   return (
// // //     <View style={styles.carWrap}>
// // //       <View style={[styles.roof, { backgroundColor: '#d62828' }]}>
// // //         <View style={styles.window} />
// // //         <View style={styles.window} />
// // //       </View>
// // //       <View style={[styles.body, { backgroundColor: '#e63946' }]}>
// // //         <View style={styles.headlight} />
// // //       </View>
// // //       <View style={styles.wheelsRow}>
// // //         <Wheel />
// // //         <Wheel />
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // function PoliceCar() {
// // //   return (
// // //     <View style={styles.carWrap}>
// // //       <View style={styles.sirenRow}>
// // //         <View style={[styles.siren, { backgroundColor: '#1d4ed8' }]} />
// // //         <View style={[styles.siren, { backgroundColor: '#ef4444' }]} />
// // //       </View>
// // //       <View style={[styles.roof, { backgroundColor: '#1f2937' }]}>
// // //         <View style={styles.window} />
// // //         <View style={styles.window} />
// // //       </View>
// // //       <View style={[styles.body, { backgroundColor: '#111827' }]}>
// // //         <View style={styles.policeDoor}>
// // //           <Text style={styles.policeText}>POLICE</Text>
// // //         </View>
// // //         <View style={styles.headlight} />
// // //       </View>
// // //       <View style={styles.wheelsRow}>
// // //         <Wheel />
// // //         <Wheel />
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // export default function Btlevel22art() {
// // //   return (
// // //     <View style={styles.scene}>
// // //       {/* Info sign board */}
// // //       <View style={styles.sign}>
// // //         <View style={styles.signRow}>
// // //           <Text style={styles.signEmoji}>🦹</Text>
// // //           <View>
// // //             <Text style={styles.signTime}>2:00 PM</Text>
// // //             <Text style={styles.signSpeed}>60 km/h</Text>
// // //           </View>
// // //           <Text style={styles.signEmoji}>🚗</Text>
// // //         </View>
// // //         <View style={styles.signDivider} />
// // //         <View style={styles.signRow}>
// // //           <Text style={styles.signEmoji}>👮</Text>
// // //           <View>
// // //             <Text style={styles.signTime}>2:30 PM</Text>
// // //             <Text style={styles.signSpeed}>75 km/h</Text>
// // //           </View>
// // //           <Text style={styles.signEmoji}>🚓</Text>
// // //         </View>
// // //       </View>

// // //       {/* Road with both cars */}
// // //       <View style={styles.road}>
// // //         <View style={styles.cars}>
// // //           <ThiefCar />
// // //           <PoliceCar />
// // //         </View>
// // //         <View style={styles.laneLine} />
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   scene: {
// // //     backgroundColor: '#8ecbf5',
// // //     borderRadius: 20,
// // //     overflow: 'hidden',
// // //     marginBottom: 16,
// // //     paddingTop: 12,
// // //   },
// // //   sign: {
// // //     alignSelf: 'flex-end',
// // //     marginRight: 12,
// // //     backgroundColor: '#f3dcae',
// // //     borderWidth: 3,
// // //     borderColor: '#b07a3c',
// // //     borderRadius: 10,
// // //     paddingVertical: 6,
// // //     paddingHorizontal: 10,
// // //   },
// // //   signRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// // //   signEmoji: { fontSize: 24 },
// // //   signTime: { fontWeight: 'bold', fontSize: 14, color: '#3a2a12' },
// // //   signSpeed: { fontWeight: '600', fontSize: 14, color: '#3a2a12' },
// // //   signDivider: { height: 1, backgroundColor: '#b07a3c', marginVertical: 4 },

// // //   road: {
// // //     marginTop: 16,
// // //     backgroundColor: '#5b6470',
// // //     paddingTop: 20,
// // //     paddingBottom: 14,
// // //   },
// // //   cars: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-around',
// // //     alignItems: 'flex-end',
// // //   },
// // //   laneLine: {
// // //     height: 4,
// // //     backgroundColor: '#ffffff',
// // //     marginTop: 12,
// // //     marginHorizontal: 30,
// // //     borderRadius: 2,
// // //   },

// // //   carWrap: { alignItems: 'center' },
// // //   roof: {
// // //     width: 62,
// // //     height: 24,
// // //     borderTopLeftRadius: 16,
// // //     borderTopRightRadius: 16,
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-evenly',
// // //     alignItems: 'center',
// // //   },
// // //   window: { width: 22, height: 14, backgroundColor: '#bfe3f7', borderRadius: 4 },
// // //   body: {
// // //     width: 100,
// // //     height: 32,
// // //     borderRadius: 10,
// // //     justifyContent: 'center',
// // //   },
// // //   headlight: {
// // //     position: 'absolute',
// // //     right: 6,
// // //     top: 8,
// // //     width: 14,
// // //     height: 10,
// // //     borderRadius: 5,
// // //     backgroundColor: '#ffe66d',
// // //   },
// // //   policeDoor: {
// // //     alignSelf: 'center',
// // //     backgroundColor: '#fff',
// // //     paddingHorizontal: 4,
// // //     borderRadius: 3,
// // //   },
// // //   policeText: { fontSize: 9, fontWeight: '900', color: '#111827' },
// // //   sirenRow: { flexDirection: 'row', gap: 2, marginBottom: -2 },
// // //   siren: { width: 20, height: 8, borderRadius: 3 },

// // //   wheelsRow: {
// // //     width: 88,
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     marginTop: -10,
// // //   },
// // //   wheel: {
// // //     width: 24,
// // //     height: 24,
// // //     borderRadius: 12,
// // //     backgroundColor: '#1b1b1b',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   wheelHub: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c8ccd2' },
// // // });
// // import React from 'react';
// // import { View, Text, StyleSheet } from 'react-native';

// // function Wheel() {
// //   return (
// //     <View style={styles.wheel}>
// //       <View style={styles.wheelHub} />
// //     </View>
// //   );
// // }

// // function ThiefCar() {
// //   return (
// //     <View style={styles.carWrap}>
// //       <View style={[styles.roof, { backgroundColor: '#d62828' }]}>
// //         <View style={styles.window} />
// //         <View style={styles.window} />
// //       </View>
// //       <View style={[styles.body, { backgroundColor: '#e63946' }]}>
// //         <View style={styles.headlight} />
// //       </View>
// //       <View style={styles.wheelsRow}>
// //         <Wheel />
// //         <Wheel />
// //       </View>
// //     </View>
// //   );
// // }

// // function PoliceCar() {
// //   return (
// //     <View style={styles.carWrap}>
// //       <View style={styles.sirenRow}>
// //         <View style={[styles.siren, { backgroundColor: '#1d4ed8' }]} />
// //         <View style={[styles.siren, { backgroundColor: '#ef4444' }]} />
// //       </View>
// //       <View style={[styles.roof, { backgroundColor: '#1f2937' }]}>
// //         <View style={styles.window} />
// //         <View style={styles.window} />
// //       </View>
// //       <View style={[styles.body, { backgroundColor: '#111827' }]}>
// //         <View style={styles.policeDoor}>
// //           <Text style={styles.policeText}>POLICE</Text>
// //         </View>
// //         <View style={styles.headlight} />
// //       </View>
// //       <View style={styles.wheelsRow}>
// //         <Wheel />
// //         <Wheel />
// //       </View>
// //     </View>
// //   );
// // }

// // export default function Btlevel22art() {
// //   return (
// //     <View style={styles.scene}>
// //       <View style={styles.sign}>
// //         <View style={styles.signRow}>
// //           <Text style={styles.signEmoji}>🦹</Text>
// //           <View>
// //             <Text style={styles.signTime}>2:00 PM</Text>
// //             <Text style={styles.signSpeed}>60 km/h</Text>
// //           </View>
// //           <Text style={styles.signEmoji}>🚗</Text>
// //         </View>
// //         <View style={styles.signDivider} />
// //         <View style={styles.signRow}>
// //           <Text style={styles.signEmoji}>👮</Text>
// //           <View>
// //             <Text style={styles.signTime}>2:30 PM</Text>
// //             <Text style={styles.signSpeed}>75 km/h</Text>
// //           </View>
// //           <Text style={styles.signEmoji}>🚓</Text>
// //         </View>
// //       </View>

// //       <View style={styles.road}>
// //         <View style={styles.cars}>
// //           <ThiefCar />
// //           <PoliceCar />
// //         </View>
// //         <View style={styles.laneLine} />
// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   scene: {
// //     backgroundColor: '#8ecbf5',
// //     borderRadius: 20,
// //     overflow: 'hidden',
// //     marginBottom: 16,
// //     paddingTop: 12,
// //   },
// //   sign: {
// //     alignSelf: 'flex-end',
// //     marginRight: 12,
// //     backgroundColor: '#f3dcae',
// //     borderWidth: 3,
// //     borderColor: '#b07a3c',
// //     borderRadius: 10,
// //     paddingVertical: 6,
// //     paddingHorizontal: 10,
// //   },
// //   signRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// //   signEmoji: { fontSize: 24 },
// //   signTime: { fontWeight: 'bold', fontSize: 14, color: '#3a2a12' },
// //   signSpeed: { fontWeight: '600', fontSize: 14, color: '#3a2a12' },
// //   signDivider: { height: 1, backgroundColor: '#b07a3c', marginVertical: 4 },

// //   road: {
// //     marginTop: 16,
// //     backgroundColor: '#5b6470',
// //     paddingTop: 20,
// //     paddingBottom: 14,
// //   },
// //   cars: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     alignItems: 'flex-end',
// //   },
// //   laneLine: {
// //     height: 4,
// //     backgroundColor: '#ffffff',
// //     marginTop: 12,
// //     marginHorizontal: 30,
// //     borderRadius: 2,
// //   },

// //   carWrap: { alignItems: 'center' },
// //   roof: {
// //     width: 62,
// //     height: 24,
// //     borderTopLeftRadius: 16,
// //     borderTopRightRadius: 16,
// //     flexDirection: 'row',
// //     justifyContent: 'space-evenly',
// //     alignItems: 'center',
// //   },
// //   window: { width: 22, height: 14, backgroundColor: '#bfe3f7', borderRadius: 4 },
// //   body: { width: 100, height: 32, borderRadius: 10, justifyContent: 'center' },
// //   headlight: {
// //     position: 'absolute',
// //     right: 6,
// //     top: 8,
// //     width: 14,
// //     height: 10,
// //     borderRadius: 5,
// //     backgroundColor: '#ffe66d',
// //   },
// //   policeDoor: {
// //     alignSelf: 'center',
// //     backgroundColor: '#fff',
// //     paddingHorizontal: 4,
// //     borderRadius: 3,
// //   },
// //   policeText: { fontSize: 9, fontWeight: '900', color: '#111827' },
// //   sirenRow: { flexDirection: 'row', gap: 2, marginBottom: -2 },
// //   siren: { width: 20, height: 8, borderRadius: 3 },

// //   wheelsRow: {
// //     width: 88,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginTop: -10,
// //   },
// //   wheel: {
// //     width: 24,
// //     height: 24,
// //     borderRadius: 12,
// //     backgroundColor: '#1b1b1b',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   wheelHub: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c8ccd2' },
// // });
// import React, { useEffect, useRef } from 'react';
// import { View, Text, Animated, PanResponder, StyleSheet, Easing } from 'react-native';
// import Svg, { Rect, Path, Polygon, Line } from 'react-native-svg';

// /* ======================= cozy room background ======================= */
// const yoyo = (v: Animated.Value, ms: number) =>
//   Animated.loop(
//     Animated.sequence([
//       Animated.timing(v, { toValue: 1, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//       Animated.timing(v, { toValue: 0, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//     ])
//   ).start();

// const Leaf = ({ l, b, w, h, r, c }: any) => (
//   <View
//     style={{
//       position: 'absolute', left: l, bottom: b, width: w, height: h,
//       borderRadius: h / 2, backgroundColor: c || '#5fae3a', transform: [{ rotate: r + 'deg' }],
//     }}
//   />
// );

// export function Level22Room() {
//   const beam = useRef(new Animated.Value(0)).current;
//   const cl = useRef(new Animated.Value(0)).current;
//   const sw = useRef(new Animated.Value(0)).current;
//   const sw2 = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     yoyo(beam, 3600);
//     yoyo(sw, 2400);
//     yoyo(sw2, 3000);
//     Animated.loop(
//       Animated.timing(cl, { toValue: 1, duration: 26000, easing: Easing.linear, useNativeDriver: true })
//     ).start();
//   }, []);

//   const bo = beam.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] });
//   const bx = beam.interpolate({ inputRange: [0, 1], outputRange: [-14, 14] });
//   const cx = cl.interpolate({ inputRange: [0, 1], outputRange: [-50, 90] });
//   const plantR = sw.interpolate({ inputRange: [0, 1], outputRange: ['-3deg', '3deg'] });
//   const plantR2 = sw2.interpolate({ inputRange: [0, 1], outputRange: ['2.5deg', '-2.5deg'] });

//   const books = (arr: any[]) =>
//     arr.map((b, i) => (
//       <View key={i} style={{ width: b[0], height: b[1], backgroundColor: b[2], borderRadius: 2, marginRight: 1 }} />
//     ));

//   return (
//     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
//       {/* wall */}
//       <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '45%', backgroundColor: 'rgba(255,255,255,0.22)' }} />
//       <View style={{ position: 'absolute', left: 0, right: 0, top: '45%', height: '30%', backgroundColor: 'rgba(255,255,255,0.08)' }} />

//       {/* picture frame */}
//       <View style={{ position: 'absolute', right: '7%', top: '11%', width: 66, height: 74, backgroundColor: '#cfe6f3', borderWidth: 4, borderColor: '#8fc3d8' }}>
//         <View style={{ alignSelf: 'center', marginTop: 14, width: 34, height: 34, borderRadius: 17, backgroundColor: '#f6a43c', borderWidth: 4, borderColor: '#f7c36a' }} />
//       </View>

//       {/* window */}
//       <View style={{ position: 'absolute', left: -4, top: '8%', width: 82, height: 200, backgroundColor: '#f0b878', borderWidth: 5, borderColor: '#e2a35e', borderRadius: 4, overflow: 'hidden' }}>
//         <View style={{ flex: 1, backgroundColor: '#8fd3f6', overflow: 'hidden' }}>
//           <Animated.View style={{ position: 'absolute', top: 24, transform: [{ translateX: cx }] }}>
//             <View style={{ width: 50, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.9)' }} />
//             <View style={{ position: 'absolute', left: 10, top: -9, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.9)' }} />
//           </Animated.View>
//           <Animated.View style={{ position: 'absolute', top: 76, transform: [{ translateX: cx.interpolate({ inputRange: [-50, 90], outputRange: [60, -60] }) }] }}>
//             <View style={{ width: 36, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.75)' }} />
//           </Animated.View>
//           <View style={{ position: 'absolute', left: 6, bottom: -14, width: 44, height: 60, borderRadius: 30, backgroundColor: '#7bc65a' }} />
//           <View style={{ position: 'absolute', left: 36, bottom: -20, width: 50, height: 70, borderRadius: 35, backgroundColor: '#62b24a' }} />
//         </View>
//         <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 4, backgroundColor: '#e2a35e' }} />
//       </View>

//       {/* window sill + plant */}
//       <View style={{ position: 'absolute', left: 0, top: '8%', marginTop: 196, width: 96, height: 14, backgroundColor: '#e9b370', borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />
//       <Animated.View style={{ position: 'absolute', left: 10, top: '8%', marginTop: 132, width: 70, height: 66, transform: [{ rotate: plantR }] }}>
//         <Leaf l={6} b={24} w={20} h={50} r={-28} />
//         <Leaf l={22} b={24} w={22} h={60} r={-4} c="#4f9f34" />
//         <Leaf l={40} b={24} w={20} h={48} r={26} />
//         <View style={{ position: 'absolute', left: 14, bottom: 0, width: 40, height: 28, borderRadius: 8, backgroundColor: '#f5ead8' }}>
//           <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 9 }}>
//             <View style={s.eye} />
//             <View style={s.eye} />
//           </View>
//         </View>
//       </Animated.View>

//       {/* sunbeams */}
//       <Animated.View style={{ position: 'absolute', top: '-6%', left: '14%', width: 96, height: '82%', backgroundColor: 'rgba(255,255,255,0.16)', opacity: bo, transform: [{ translateX: bx }, { rotate: '-17deg' }] }} />
//       <Animated.View style={{ position: 'absolute', top: '-6%', left: '34%', width: 64, height: '80%', backgroundColor: 'rgba(255,255,255,0.12)', opacity: bo.interpolate({ inputRange: [0.45, 1], outputRange: [1, 0.5] }), transform: [{ translateX: bx }, { rotate: '-17deg' }] }} />
//       <Animated.View style={{ position: 'absolute', top: '-6%', left: '54%', width: 110, height: '78%', backgroundColor: 'rgba(255,255,255,0.10)', opacity: bo, transform: [{ translateX: bx }, { rotate: '-17deg' }] }} />

//       {/* bookshelf (right) */}
//       <View style={{ position: 'absolute', right: 0, top: '38%', width: 70, height: '31%', backgroundColor: '#e0a85e', borderLeftWidth: 5, borderTopWidth: 5, borderColor: '#c98d4d' }}>
//         <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 8, borderBottomWidth: 5, borderColor: '#c98d4d' }}>
//           {books([[12, 46, '#58a6c8'], [10, 52, '#f2c14e'], [12, 44, '#7b6bd0']])}
//         </View>
//         <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 8, borderBottomWidth: 5, borderColor: '#c98d4d' }}>
//           {books([[12, 40, '#3f7fc4'], [10, 46, '#59b3a0']])}
//         </View>
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
//           <View style={{ width: 44, height: 34, borderRadius: 16, backgroundColor: '#b9763a' }} />
//           <View style={{ position: 'absolute', top: 6, left: 10, width: 14, height: 14, borderRadius: 7, backgroundColor: '#b9763a' }} />
//           <View style={{ position: 'absolute', top: 6, right: 14, width: 14, height: 14, borderRadius: 7, backgroundColor: '#b9763a' }} />
//           <View style={{ position: 'absolute', top: 20, width: 20, height: 14, borderRadius: 8, backgroundColor: '#f0cfa0' }} />
//         </View>
//       </View>

//       {/* hanging vine */}
//       <Animated.View style={{ position: 'absolute', right: 2, top: '30%', width: 50, height: 80, transform: [{ rotate: plantR2 }] }}>
//         <Leaf l={6} b={8} w={14} h={30} r={-20} />
//         <Leaf l={22} b={20} w={14} h={32} r={18} c="#4f9f34" />
//         <Leaf l={10} b={42} w={14} h={30} r={-10} />
//       </Animated.View>

//       {/* floor */}
//       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '31%', backgroundColor: '#e9b575' }}>
//         {[18, 46, 78, 112, 150].map((t, i) => (
//           <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: t, height: 1.5, backgroundColor: 'rgba(150,90,40,0.18)' }} />
//         ))}
//       </View>
//       <View style={{ position: 'absolute', left: 0, right: 0, bottom: '31%', height: 14, backgroundColor: '#e8b8b0' }} />

//       {/* books stack + toy car (left) */}
//       <View style={{ position: 'absolute', left: -6, bottom: '27%' }}>
//         <View style={{ width: 84, height: 16, borderRadius: 3, backgroundColor: '#3f9ad6', marginBottom: 1 }} />
//         <View style={{ width: 92, height: 16, borderRadius: 3, backgroundColor: '#e86fae', marginBottom: 1, marginLeft: -4 }} />
//         <View style={{ width: 88, height: 16, borderRadius: 3, backgroundColor: '#f2c14e', marginBottom: 1 }} />
//         <View style={{ width: 80, height: 14, borderRadius: 3, backgroundColor: '#4b7fc4' }} />
//       </View>
//       <View style={{ position: 'absolute', left: 6, bottom: '25%', width: 54, height: 24, borderRadius: 10, backgroundColor: '#3aa0e0' }}>
//         <View style={{ position: 'absolute', left: 14, top: -10, width: 24, height: 14, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#7cc7f0' }} />
//         <View style={{ position: 'absolute', left: 6, bottom: -6, width: 12, height: 12, borderRadius: 6, backgroundColor: '#2d4a6b' }} />
//         <View style={{ position: 'absolute', right: 6, bottom: -6, width: 12, height: 12, borderRadius: 6, backgroundColor: '#2d4a6b' }} />
//       </View>

//       {/* pencil cup (right) */}
//       <View style={{ position: 'absolute', right: 6, bottom: '24%', width: 44, height: 58, borderRadius: 6, backgroundColor: '#f5c63a', borderWidth: 2, borderColor: '#e0a81f' }} />
//       <View style={{ position: 'absolute', right: 22, bottom: '24%', marginBottom: 54, width: 6, height: 46, backgroundColor: '#e86f6f', transform: [{ rotate: '-10deg' }] }} />
//       <View style={{ position: 'absolute', right: 14, bottom: '24%', marginBottom: 54, width: 6, height: 50, backgroundColor: '#3f7fc4', transform: [{ rotate: '-22deg' }] }} />
//       <View style={{ position: 'absolute', right: 30, bottom: '24%', marginBottom: 54, width: 6, height: 44, backgroundColor: '#5fae3a', transform: [{ rotate: '8deg' }] }} />
//     </View>
//   );
// }

// /* ======================= draggable eraser + pencil ======================= */
// export const Eraser = ({ w }: { w: number }) => (
//   <Svg width={w} height={w * 0.62} viewBox="0 0 100 62">
//     <Rect x="4" y="8" width="92" height="46" rx="12" fill="#f4f4f0" stroke="#d9d9d4" strokeWidth="2" />
//     <Path d="M4 20 Q4 8 16 8 H70 L52 54 H16 Q4 54 4 42 Z" fill="#2ab4d9" />
//     <Path d="M12 15 H60" stroke="#8fe0f2" strokeWidth="3" strokeLinecap="round" />
//   </Svg>
// );

// export const Pencil = ({ w }: { w: number }) => (
//   <Svg width={w} height={w * 0.2} viewBox="0 0 150 30">
//     <Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke="#c9985a" strokeWidth="1" />
//     <Polygon points="2,15 10,11.5 10,18.5" fill="#333" />
//     <Rect x="26" y="4" width="84" height="22" fill="#2fa86f" />
//     <Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2" />
//     <Line x1="28" y1="19" x2="108" y2="19" stroke="#1f7a4e" strokeWidth="2" />
//     <Rect x="110" y="3" width="26" height="24" fill="#9a9a9a" />
//     <Line x1="116" y1="3" x2="116" y2="27" stroke="#6f6f6f" strokeWidth="2" />
//     <Line x1="124" y1="3" x2="124" y2="27" stroke="#6f6f6f" strokeWidth="2" />
//     <Rect x="136" y="6" width="12" height="18" rx="6" fill="#f4f2ea" />
//   </Svg>
// );

// export function FreeDrag({ children }: any) {
//   const pan = useRef(new Animated.ValueXY()).current;
//   const pr = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         pan.extractOffset();
//       },
//       onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
//       onPanResponderRelease: () => {
//         pan.flattenOffset();
//       },
//     })
//   ).current;
//   return (
//     <Animated.View {...pr.panHandlers} style={{ transform: pan.getTranslateTransform() }}>
//       {children}
//     </Animated.View>
//   );
// }

// /* ======================= road scene (cars + sign board) ======================= */
// function Wheel() {
//   return (
//     <View style={s.wheel}>
//       <View style={s.wheelHub} />
//     </View>
//   );
// }

// function ThiefCar() {
//   return (
//     <View style={s.carWrap}>
//       <View style={[s.roof, { backgroundColor: '#d62828' }]}>
//         <View style={s.window} />
//         <View style={s.window} />
//       </View>
//       <View style={[s.body, { backgroundColor: '#e63946' }]}>
//         <View style={s.headlight} />
//       </View>
//       <View style={s.wheelsRow}>
//         <Wheel />
//         <Wheel />
//       </View>
//     </View>
//   );
// }

// function PoliceCar() {
//   return (
//     <View style={s.carWrap}>
//       <View style={s.sirenRow}>
//         <View style={[s.siren, { backgroundColor: '#1d4ed8' }]} />
//         <View style={[s.siren, { backgroundColor: '#ef4444' }]} />
//       </View>
//       <View style={[s.roof, { backgroundColor: '#1f2937' }]}>
//         <View style={s.window} />
//         <View style={s.window} />
//       </View>
//       <View style={[s.body, { backgroundColor: '#111827' }]}>
//         <View style={s.policeDoor}>
//           <Text style={s.policeText}>POLICE</Text>
//         </View>
//         <View style={s.headlight} />
//       </View>
//       <View style={s.wheelsRow}>
//         <Wheel />
//         <Wheel />
//       </View>
//     </View>
//   );
// }

// export function RoadScene() {
//   return (
//     <View style={s.scene}>
//       <View style={s.sign}>
//         <View style={s.signRow}>
//           <Text style={s.signEmoji}>🦹</Text>
//           <View>
//             <Text style={s.signTime}>2:00 PM</Text>
//             <Text style={s.signSpeed}>60 km/h</Text>
//           </View>
//           <Text style={s.signEmoji}>🚗</Text>
//         </View>
//         <View style={s.signDivider} />
//         <View style={s.signRow}>
//           <Text style={s.signEmoji}>👮</Text>
//           <View>
//             <Text style={s.signTime}>2:30 PM</Text>
//             <Text style={s.signSpeed}>75 km/h</Text>
//           </View>
//           <Text style={s.signEmoji}>🚓</Text>
//         </View>
//       </View>

//       <View style={s.road}>
//         <View style={s.cars}>
//           <ThiefCar />
//           <PoliceCar />
//         </View>
//         <View style={s.laneLine} />
//       </View>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   eye: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#5b3a29' },

//   scene: { width: '100%', paddingHorizontal: 14 },
//   sign: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#f3dcae',
//     borderWidth: 3,
//     borderColor: '#b07a3c',
//     borderRadius: 10,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     marginBottom: 6,
//   },
//   signRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   signEmoji: { fontSize: 20 },
//   signTime: { fontWeight: 'bold', fontSize: 13, color: '#3a2a12' },
//   signSpeed: { fontWeight: '600', fontSize: 13, color: '#3a2a12' },
//   signDivider: { height: 1, backgroundColor: '#b07a3c', marginVertical: 3 },

//   road: { backgroundColor: '#5b6470', borderRadius: 18, paddingTop: 14, paddingBottom: 10 },
//   cars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
//   laneLine: { height: 4, backgroundColor: '#fff', marginTop: 8, marginHorizontal: 24, borderRadius: 2 },

//   carWrap: { alignItems: 'center' },
//   roof: {
//     width: 52, height: 20, borderTopLeftRadius: 14, borderTopRightRadius: 14,
//     flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center',
//   },
//   window: { width: 18, height: 12, backgroundColor: '#bfe3f7', borderRadius: 3 },
//   body: { width: 86, height: 28, borderRadius: 9, justifyContent: 'center' },
//   headlight: { position: 'absolute', right: 5, top: 7, width: 12, height: 9, borderRadius: 4, backgroundColor: '#ffe66d' },
//   policeDoor: { alignSelf: 'center', backgroundColor: '#fff', paddingHorizontal: 4, borderRadius: 3 },
//   policeText: { fontSize: 8, fontWeight: '900', color: '#111827' },
//   sirenRow: { flexDirection: 'row', gap: 2, marginBottom: -2 },
//   siren: { width: 17, height: 7, borderRadius: 3 },
//   wheelsRow: { width: 74, flexDirection: 'row', justifyContent: 'space-between', marginTop: -9 },
//   wheel: { width: 21, height: 21, borderRadius: 11, backgroundColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
//   wheelHub: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#c8ccd2' },
// });
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, PanResponder, StyleSheet, Easing } from 'react-native';
import Svg, { Rect, Path, Polygon, Line } from 'react-native-svg';

/* ======================= cozy room background ======================= */
const yoyo = (v: Animated.Value, ms: number) =>
  Animated.loop(
    Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])
  ).start();

const Leaf = ({ l, b, w, h, r, c }: any) => (
  <View
    style={{
      position: 'absolute', left: l, bottom: b, width: w, height: h,
      borderRadius: h / 2, backgroundColor: c || '#5fae3a', transform: [{ rotate: r + 'deg' }],
    }}
  />
);

export function Level22Room() {
  const beam = useRef(new Animated.Value(0)).current;
  const cl = useRef(new Animated.Value(0)).current;
  const sw = useRef(new Animated.Value(0)).current;
  const sw2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    yoyo(beam, 3600);
    yoyo(sw, 2400);
    yoyo(sw2, 3000);
    Animated.loop(
      Animated.timing(cl, { toValue: 1, duration: 26000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  const bo = beam.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] });
  const bx = beam.interpolate({ inputRange: [0, 1], outputRange: [-14, 14] });
  const cx = cl.interpolate({ inputRange: [0, 1], outputRange: [-50, 90] });
  const plantR = sw.interpolate({ inputRange: [0, 1], outputRange: ['-3deg', '3deg'] });
  const plantR2 = sw2.interpolate({ inputRange: [0, 1], outputRange: ['2.5deg', '-2.5deg'] });

  const books = (arr: any[]) =>
    arr.map((b, i) => (
      <View key={i} style={{ width: b[0], height: b[1], backgroundColor: b[2], borderRadius: 2, marginRight: 1 }} />
    ));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* wall */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '45%', backgroundColor: 'rgba(255,255,255,0.22)' }} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: '45%', height: '30%', backgroundColor: 'rgba(255,255,255,0.08)' }} />

      {/* picture frame */}
      <View style={{ position: 'absolute', right: '7%', top: '11%', width: 66, height: 74, backgroundColor: '#cfe6f3', borderWidth: 4, borderColor: '#8fc3d8' }}>
        <View style={{ alignSelf: 'center', marginTop: 14, width: 34, height: 34, borderRadius: 17, backgroundColor: '#f6a43c', borderWidth: 4, borderColor: '#f7c36a' }} />
      </View>

      {/* window */}
      <View style={{ position: 'absolute', left: -4, top: '8%', width: 82, height: 200, backgroundColor: '#f0b878', borderWidth: 5, borderColor: '#e2a35e', borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ flex: 1, backgroundColor: '#8fd3f6', overflow: 'hidden' }}>
          <Animated.View style={{ position: 'absolute', top: 24, transform: [{ translateX: cx }] }}>
            <View style={{ width: 50, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.9)' }} />
            <View style={{ position: 'absolute', left: 10, top: -9, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.9)' }} />
          </Animated.View>
          <Animated.View style={{ position: 'absolute', top: 76, transform: [{ translateX: cx.interpolate({ inputRange: [-50, 90], outputRange: [60, -60] }) }] }}>
            <View style={{ width: 36, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.75)' }} />
          </Animated.View>
          <View style={{ position: 'absolute', left: 6, bottom: -14, width: 44, height: 60, borderRadius: 30, backgroundColor: '#7bc65a' }} />
          <View style={{ position: 'absolute', left: 36, bottom: -20, width: 50, height: 70, borderRadius: 35, backgroundColor: '#62b24a' }} />
        </View>
        <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 4, backgroundColor: '#e2a35e' }} />
      </View>

      {/* window sill + plant */}
      <View style={{ position: 'absolute', left: 0, top: '8%', marginTop: 196, width: 96, height: 14, backgroundColor: '#e9b370', borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />
      <Animated.View style={{ position: 'absolute', left: 10, top: '8%', marginTop: 132, width: 70, height: 66, transform: [{ rotate: plantR }] }}>
        <Leaf l={6} b={24} w={20} h={50} r={-28} />
        <Leaf l={22} b={24} w={22} h={60} r={-4} c="#4f9f34" />
        <Leaf l={40} b={24} w={20} h={48} r={26} />
        <View style={{ position: 'absolute', left: 14, bottom: 0, width: 40, height: 28, borderRadius: 8, backgroundColor: '#f5ead8' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 9 }}>
            <View style={s.eye} />
            <View style={s.eye} />
          </View>
        </View>
      </Animated.View>

      {/* sunbeams */}
      <Animated.View style={{ position: 'absolute', top: '-6%', left: '14%', width: 96, height: '82%', backgroundColor: 'rgba(255,255,255,0.16)', opacity: bo, transform: [{ translateX: bx }, { rotate: '-17deg' }] }} />
      <Animated.View style={{ position: 'absolute', top: '-6%', left: '34%', width: 64, height: '80%', backgroundColor: 'rgba(255,255,255,0.12)', opacity: bo.interpolate({ inputRange: [0.45, 1], outputRange: [1, 0.5] }), transform: [{ translateX: bx }, { rotate: '-17deg' }] }} />
      <Animated.View style={{ position: 'absolute', top: '-6%', left: '54%', width: 110, height: '78%', backgroundColor: 'rgba(255,255,255,0.10)', opacity: bo, transform: [{ translateX: bx }, { rotate: '-17deg' }] }} />

      {/* bookshelf (right) */}
      <View style={{ position: 'absolute', right: 0, top: '38%', width: 70, height: '31%', backgroundColor: '#e0a85e', borderLeftWidth: 5, borderTopWidth: 5, borderColor: '#c98d4d' }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 8, borderBottomWidth: 5, borderColor: '#c98d4d' }}>
          {books([[12, 46, '#58a6c8'], [10, 52, '#f2c14e'], [12, 44, '#7b6bd0']])}
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 8, borderBottomWidth: 5, borderColor: '#c98d4d' }}>
          {books([[12, 40, '#3f7fc4'], [10, 46, '#59b3a0']])}
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
          <View style={{ width: 44, height: 34, borderRadius: 16, backgroundColor: '#b9763a' }} />
          <View style={{ position: 'absolute', top: 6, left: 10, width: 14, height: 14, borderRadius: 7, backgroundColor: '#b9763a' }} />
          <View style={{ position: 'absolute', top: 6, right: 14, width: 14, height: 14, borderRadius: 7, backgroundColor: '#b9763a' }} />
          <View style={{ position: 'absolute', top: 20, width: 20, height: 14, borderRadius: 8, backgroundColor: '#f0cfa0' }} />
        </View>
      </View>

      {/* hanging vine */}
      <Animated.View style={{ position: 'absolute', right: 2, top: '30%', width: 50, height: 80, transform: [{ rotate: plantR2 }] }}>
        <Leaf l={6} b={8} w={14} h={30} r={-20} />
        <Leaf l={22} b={20} w={14} h={32} r={18} c="#4f9f34" />
        <Leaf l={10} b={42} w={14} h={30} r={-10} />
      </Animated.View>

      {/* floor */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '31%', backgroundColor: '#e9b575' }}>
        {[18, 46, 78, 112, 150].map((t, i) => (
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: t, height: 1.5, backgroundColor: 'rgba(150,90,40,0.18)' }} />
        ))}
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: '31%', height: 14, backgroundColor: '#e8b8b0' }} />

      {/* books stack + toy car (left) */}
      <View style={{ position: 'absolute', left: -6, bottom: '27%' }}>
        <View style={{ width: 84, height: 16, borderRadius: 3, backgroundColor: '#3f9ad6', marginBottom: 1 }} />
        <View style={{ width: 92, height: 16, borderRadius: 3, backgroundColor: '#e86fae', marginBottom: 1, marginLeft: -4 }} />
        <View style={{ width: 88, height: 16, borderRadius: 3, backgroundColor: '#f2c14e', marginBottom: 1 }} />
        <View style={{ width: 80, height: 14, borderRadius: 3, backgroundColor: '#4b7fc4' }} />
      </View>
      <View style={{ position: 'absolute', left: 6, bottom: '25%', width: 54, height: 24, borderRadius: 10, backgroundColor: '#3aa0e0' }}>
        <View style={{ position: 'absolute', left: 14, top: -10, width: 24, height: 14, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#7cc7f0' }} />
        <View style={{ position: 'absolute', left: 6, bottom: -6, width: 12, height: 12, borderRadius: 6, backgroundColor: '#2d4a6b' }} />
        <View style={{ position: 'absolute', right: 6, bottom: -6, width: 12, height: 12, borderRadius: 6, backgroundColor: '#2d4a6b' }} />
      </View>

      {/* pencil cup (right) */}
      <View style={{ position: 'absolute', right: 6, bottom: '24%', width: 44, height: 58, borderRadius: 6, backgroundColor: '#f5c63a', borderWidth: 2, borderColor: '#e0a81f' }} />
      <View style={{ position: 'absolute', right: 22, bottom: '24%', marginBottom: 54, width: 6, height: 46, backgroundColor: '#e86f6f', transform: [{ rotate: '-10deg' }] }} />
      <View style={{ position: 'absolute', right: 14, bottom: '24%', marginBottom: 54, width: 6, height: 50, backgroundColor: '#3f7fc4', transform: [{ rotate: '-22deg' }] }} />
      <View style={{ position: 'absolute', right: 30, bottom: '24%', marginBottom: 54, width: 6, height: 44, backgroundColor: '#5fae3a', transform: [{ rotate: '8deg' }] }} />
    </View>
  );
}

/* ======================= draggable eraser + pencil ======================= */
export const Eraser = ({ w }: { w: number }) => (
  <Svg width={w} height={w * 0.62} viewBox="0 0 100 62">
    <Rect x="4" y="8" width="92" height="46" rx="12" fill="#f4f4f0" stroke="#d9d9d4" strokeWidth="2" />
    <Path d="M4 20 Q4 8 16 8 H70 L52 54 H16 Q4 54 4 42 Z" fill="#2ab4d9" />
    <Path d="M12 15 H60" stroke="#8fe0f2" strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

export const Pencil = ({ w }: { w: number }) => (
  <Svg width={w} height={w * 0.2} viewBox="0 0 150 30">
    <Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke="#c9985a" strokeWidth="1" />
    <Polygon points="2,15 10,11.5 10,18.5" fill="#333" />
    <Rect x="26" y="4" width="84" height="22" fill="#2fa86f" />
    <Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2" />
    <Line x1="28" y1="19" x2="108" y2="19" stroke="#1f7a4e" strokeWidth="2" />
    <Rect x="110" y="3" width="26" height="24" fill="#9a9a9a" />
    <Line x1="116" y1="3" x2="116" y2="27" stroke="#6f6f6f" strokeWidth="2" />
    <Line x1="124" y1="3" x2="124" y2="27" stroke="#6f6f6f" strokeWidth="2" />
    <Rect x="136" y="6" width="12" height="18" rx="6" fill="#f4f2ea" />
  </Svg>
);

export function FreeDrag({ children }: any) {
  const pan = useRef(new Animated.ValueXY()).current;
  const pr = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;
  return (
    <Animated.View {...pr.panHandlers} style={{ transform: pan.getTranslateTransform() }}>
      {children}
    </Animated.View>
  );
}

/* ======================= road scene (cars + sign board) ======================= */
function Wheel() {
  return (
    <View style={s.wheel}>
      <View style={s.wheelHub} />
    </View>
  );
}

function ThiefCar() {
  return (
    <View style={s.carWrap}>
      <View style={[s.roof, { backgroundColor: '#d62828' }]}>
        <View style={s.window} />
        <View style={s.window} />
      </View>
      <View style={[s.body, { backgroundColor: '#e63946' }]}>
        <View style={s.headlight} />
      </View>
      <View style={s.wheelsRow}>
        <Wheel />
        <Wheel />
      </View>
    </View>
  );
}

function PoliceCar() {
  return (
    <View style={s.carWrap}>
      <View style={s.sirenRow}>
        <View style={[s.siren, { backgroundColor: '#1d4ed8' }]} />
        <View style={[s.siren, { backgroundColor: '#ef4444' }]} />
      </View>
      <View style={[s.roof, { backgroundColor: '#1f2937' }]}>
        <View style={s.window} />
        <View style={s.window} />
      </View>
      <View style={[s.body, { backgroundColor: '#111827' }]}>
        <View style={s.policeDoor}>
          <Text style={s.policeText}>POLICE</Text>
        </View>
        <View style={s.headlight} />
      </View>
      <View style={s.wheelsRow}>
        <Wheel />
        <Wheel />
      </View>
    </View>
  );
}

export function RoadScene() {
  return (
    <View style={s.scene}>
      <View style={s.sign}>
        <View style={s.signRow}>
          <Text style={s.signEmoji}>🦹</Text>
          <View>
            <Text style={s.signTime}>2:00 PM</Text>
            <Text style={s.signSpeed}>60 km/h</Text>
          </View>
          <Text style={s.signEmoji}>🚗</Text>
        </View>
        <View style={s.signDivider} />
        <View style={s.signRow}>
          <Text style={s.signEmoji}>👮</Text>
          <View>
            <Text style={s.signTime}>2:30 PM</Text>
            <Text style={s.signSpeed}>75 km/h</Text>
          </View>
          <Text style={s.signEmoji}>🚓</Text>
        </View>
      </View>

      <View style={s.road}>
        <View style={s.cars}>
          <ThiefCar />
          <PoliceCar />
        </View>
        <View style={s.laneLine} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  eye: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#5b3a29' },

  scene: { width: '100%', paddingHorizontal: 14 },
  sign: {
    alignSelf: 'flex-end',
    backgroundColor: '#f3dcae',
    borderWidth: 3,
    borderColor: '#b07a3c',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  signRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  signEmoji: { fontSize: 16 },
  signTime: { fontWeight: 'bold', fontSize: 12, color: '#3a2a12' },
  signSpeed: { fontWeight: '600', fontSize: 12, color: '#3a2a12' },
  signDivider: { height: 1, backgroundColor: '#b07a3c', marginVertical: 2 },

  road: { backgroundColor: '#5b6470', borderRadius: 18, paddingTop: 8, paddingBottom: 8 },
  cars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  laneLine: { height: 4, backgroundColor: '#fff', marginTop: 6, marginHorizontal: 24, borderRadius: 2 },

  carWrap: { alignItems: 'center' },
  roof: {
    width: 52, height: 20, borderTopLeftRadius: 14, borderTopRightRadius: 14,
    flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center',
  },
  window: { width: 18, height: 12, backgroundColor: '#bfe3f7', borderRadius: 3 },
  body: { width: 86, height: 28, borderRadius: 9, justifyContent: 'center' },
  headlight: { position: 'absolute', right: 5, top: 7, width: 12, height: 9, borderRadius: 4, backgroundColor: '#ffe66d' },
  policeDoor: { alignSelf: 'center', backgroundColor: '#fff', paddingHorizontal: 4, borderRadius: 3 },
  policeText: { fontSize: 8, fontWeight: '900', color: '#111827' },
  sirenRow: { flexDirection: 'row', gap: 2, marginBottom: -2 },
  siren: { width: 17, height: 7, borderRadius: 3 },
  wheelsRow: { width: 74, flexDirection: 'row', justifyContent: 'space-between', marginTop: -9 },
  wheel: { width: 21, height: 21, borderRadius: 11, backgroundColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
  wheelHub: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#c8ccd2' },
});
