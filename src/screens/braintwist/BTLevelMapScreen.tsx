
// // // // // import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// // // // // import {
// // // // //   View, Text, TouchableOpacity, Image, ScrollView, Animated,
// // // // //   StyleSheet, ActivityIndicator, useWindowDimensions,
// // // // // } from 'react-native';
// // // // // import { useFocusEffect } from '@react-navigation/native';
// // // // // import { getMap, openLevel, LevelMap, MapLevel } from './mapApi';

// // // // // const BG = require('../../../assets/levels_map.jpg');
// // // // // const RATIO = 1536 / 1024;

// // // // // // part of the picture (top) that is hidden: it holds the baked "LEVELS" banner.
// // // // // // if the castle flag of level 41 gets cut, make this smaller (e.g. 0.07)
// // // // // const CROP = 0.085;
// // // // // const HEADER_H = 64; // space for the fixed header on top of the scroll content

// // // // // // levels 1..41 : positions on the picture  [x, y, size]  (fractions of the picture)
// // // // // const POS: [number, number, number][] = [
// // // // //   [0.5010, 0.8711, 0.1152],
// // // // //   [0.6543, 0.8255, 0.0879],
// // // // //   [0.5264, 0.7852, 0.0918],
// // // // //   [0.3779, 0.7721, 0.0889],
// // // // //   [0.3613, 0.7142, 0.0811],
// // // // //   [0.4834, 0.6641, 0.0762],
// // // // //   [0.6133, 0.6576, 0.0742],
// // // // //   [0.7285, 0.6777, 0.0742],
// // // // //   [0.3193, 0.5788, 0.0771],
// // // // //   [0.4521, 0.5840, 0.0742],
// // // // //   [0.5723, 0.5898, 0.0723],
// // // // //   [0.6992, 0.5983, 0.0752],
// // // // //   [0.8105, 0.5762, 0.0762],
// // // // //   [0.7500, 0.5169, 0.0762],
// // // // //   [0.6240, 0.5091, 0.0752],
// // // // //   [0.4863, 0.5182, 0.0752],
// // // // //   [0.3438, 0.5156, 0.0762],
// // // // //   [0.2910, 0.4701, 0.0801],
// // // // //   [0.3975, 0.4271, 0.0771],
// // // // //   [0.5342, 0.4323, 0.0771],
// // // // //   [0.6650, 0.4382, 0.0752],
// // // // //   [0.7812, 0.4290, 0.0771],
// // // // //   [0.7383, 0.3724, 0.0762],
// // // // //   [0.6006, 0.3652, 0.0762],
// // // // //   [0.4512, 0.3704, 0.0752],
// // // // //   [0.2969, 0.3783, 0.0732],
// // // // //   [0.2373, 0.3307, 0.0732],
// // // // //   [0.3486, 0.3125, 0.0723],
// // // // //   [0.4668, 0.3086, 0.0732],
// // // // //   [0.5938, 0.3073, 0.0742],
// // // // //   [0.7275, 0.2982, 0.0742],
// // // // //   [0.7061, 0.2428, 0.0732],
// // // // //   [0.5850, 0.2448, 0.0723],
// // // // //   [0.4570, 0.2461, 0.0723],
// // // // //   [0.3281, 0.2480, 0.0723],
// // // // //   [0.2363, 0.2194, 0.0723],
// // // // //   [0.3262, 0.1764, 0.0713],
// // // // //   [0.4375, 0.1699, 0.0713],
// // // // //   [0.5469, 0.1777, 0.0723],
// // // // //   [0.6543, 0.1777, 0.0732],
// // // // //   [0.7637, 0.1432, 0.0977],
// // // // // ];

// // // // // // levels 42..50 : "Sky Path" section above the picture  [x, y, size]
// // // // // // x, y are fractions of the section (y = 0 top ... 1 bottom, 42 is at the bottom near level 41)
// // // // // const EXT_POS: [number, number, number][] = [
// // // // //   [0.62, 0.92, 0.0770], // 42
// // // // //   [0.44, 0.85, 0.0770], // 43
// // // // //   [0.26, 0.77, 0.0770], // 44
// // // // //   [0.38, 0.66, 0.0770], // 45
// // // // //   [0.57, 0.59, 0.0770], // 46
// // // // //   [0.75, 0.50, 0.0770], // 47
// // // // //   [0.60, 0.37, 0.0770], // 48
// // // // //   [0.42, 0.29, 0.0770], // 49
// // // // //   [0.50, 0.12, 0.1050], // 50 (big, castle)
// // // // // ];
// // // // // const EXT_H_RATIO = 1.35; // section height = width * this
// // // // // const CLOUDS: [number, number, number][] = [ // x, y, scale
// // // // //   [0.10, 0.06, 1.0], [0.72, 0.20, 0.8], [0.12, 0.42, 0.7], [0.80, 0.70, 0.9], [0.08, 0.88, 0.8],
// // // // // ];

// // // // // type Props = { playerId: number; onBack: () => void; onPlay: (n: number) => void };

// // // // // export default function BTLevelMapScreen({ playerId, onBack, onPlay }: Props) {
// // // // //   const { width, height } = useWindowDimensions();
// // // // //   const W = Math.min(width, 460);
// // // // //   const H = W * RATIO;           // full picture height
// // // // //   const E = W * EXT_H_RATIO;     // sky section height
// // // // //   const imgH = H * (1 - CROP);   // visible part of the picture
// // // // //   const imgTop = HEADER_H + E;   // where the picture starts in the scroll content
// // // // //   const contentH = imgTop + imgH;

// // // // //   const [map, setMap] = useState<LevelMap | null>(null);
// // // // //   const [toast, setToast] = useState('');
// // // // //   const [busy, setBusy] = useState(false);
// // // // //   const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
// // // // //   const scroller = useRef<ScrollView>(null);
// // // // //   const pulse = useRef(new Animated.Value(0)).current;

// // // // //   // centre + size of every bubble (index 0 = level 1) in scroll-content pixels
// // // // //   const centers = useMemo(() => {
// // // // //     const a: { x: number; y: number; s: number }[] = [];
// // // // //     POS.forEach(([fx, fy, fs]) => a.push({ x: fx * W, y: imgTop + fy * H - CROP * H, s: fs * W }));
// // // // //     EXT_POS.forEach(([fx, fy, fs]) => a.push({ x: fx * W, y: HEADER_H + fy * E, s: fs * W }));
// // // // //     return a;
// // // // //   }, [W, H, E, imgTop]);

// // // // //   // dotted path from level 41 up to level 50
// // // // //   const pathDots = useMemo(() => {
// // // // //     const pts = [centers[40], ...centers.slice(41)];
// // // // //     const dots: { x: number; y: number }[] = [];
// // // // //     for (let i = 0; i < pts.length - 1; i++) {
// // // // //       for (let k = 1; k <= 5; k++) {
// // // // //         const t = k / 6;
// // // // //         dots.push({ x: pts[i].x + (pts[i + 1].x - pts[i].x) * t, y: pts[i].y + (pts[i + 1].y - pts[i].y) * t });
// // // // //       }
// // // // //     }
// // // // //     return dots;
// // // // //   }, [centers]);

// // // // //   useEffect(() => {
// // // // //     const loop = Animated.loop(
// // // // //       Animated.sequence([
// // // // //         Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
// // // // //         Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
// // // // //       ])
// // // // //     );
// // // // //     loop.start();
// // // // //     return () => loop.stop();
// // // // //   }, [pulse]);

// // // // //   const showToast = (m: string) => {
// // // // //     setToast(m);
// // // // //     if (timer.current) clearTimeout(timer.current);
// // // // //     timer.current = setTimeout(() => setToast(''), 2400);
// // // // //   };

// // // // //   useFocusEffect(
// // // // //     useCallback(() => {
// // // // //       let alive = true;
// // // // //       getMap(playerId)
// // // // //         .then((m) => {
// // // // //           if (!alive) return;
// // // // //           setMap(m);
// // // // //           const idx = Math.min(Math.max(m.currentLevel, 1), centers.length) - 1;
// // // // //           setTimeout(() => {
// // // // //             scroller.current?.scrollTo({ y: Math.max(0, centers[idx].y - height * 0.45), animated: false });
// // // // //           }, 80);
// // // // //         })
// // // // //         .catch((e: any) => alive && showToast(e.message || 'Could not load levels'));
// // // // //       return () => { alive = false; };
// // // // //     }, [playerId, centers, height])
// // // // //   );

// // // // //   // no level is locked: any built level can be opened
// // // // //   const tap = async (l: MapLevel) => {
// // // // //     if (busy) return;
// // // // //     if (l.status === 'soon') return showToast('Coming soon!');
// // // // //     setBusy(true);
// // // // //     try {
// // // // //       await openLevel(playerId, l.n); // backend confirms
// // // // //       onPlay(l.n);
// // // // //     } catch (e: any) {
// // // // //       showToast(e.message || 'Cannot open level');
// // // // //       if (e.map) setMap(e.map);
// // // // //     } finally {
// // // // //       setBusy(false);
// // // // //     }
// // // // //   };

// // // // //   if (!map) {
// // // // //     return (
// // // // //       <View style={[st.root, { justifyContent: 'center', alignItems: 'center' }]}>
// // // // //         <ActivityIndicator size="large" color="#fff" />
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   const visible = map.levels.slice(0, centers.length);
// // // // //   const earned = map.levels.reduce((sum, l) => sum + (l.stars || 0), 0);
// // // // //   const maxStars = Math.max(1, map.total) * 3;

// // // // //   const bubble = (l: MapLevel, i: number) => {
// // // // //     const c = centers[i];
// // // // //     const S = Math.max(36, c.s * 1.12);
// // // // //     const bodyH = S * 0.8;
// // // // //     const soon = l.status === 'soon';
// // // // //     const done = l.status === 'completed';
// // // // //     const cur = l.status === 'current';
// // // // //     const last = i === centers.length - 1; // level 50

// // // // //     let bg = '#1f9d3a';
// // // // //     let edge = '#0f6b22';
// // // // //     if (soon) { bg = '#5f8f66'; edge = '#3f6a46'; }
// // // // //     if (last && !soon) { bg = '#ffb300'; edge = '#c77f00'; }
// // // // //     if (cur) { bg = '#ff9a1f'; edge = '#c2610a'; }

// // // // //     const scale = cur
// // // // //       ? pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] })
// // // // //       : 1;

// // // // //     return (
// // // // //       <TouchableOpacity
// // // // //         key={l.n}
// // // // //         activeOpacity={0.85}
// // // // //         onPress={() => tap(l)}
// // // // //         hitSlop={{ top: 8, bottom: 14, left: 8, right: 8 }}
// // // // //         style={{
// // // // //           position: 'absolute',
// // // // //           width: S,
// // // // //           height: bodyH + S * 0.3,
// // // // //           left: c.x - S / 2,
// // // // //           top: c.y - bodyH / 2,
// // // // //         }}
// // // // //       >
// // // // //         <Animated.View
// // // // //           style={{
// // // // //             width: S,
// // // // //             height: bodyH,
// // // // //             borderRadius: S * 0.4,
// // // // //             backgroundColor: bg,
// // // // //             borderWidth: 3,
// // // // //             borderColor: '#fffbe6',
// // // // //             borderBottomWidth: 5,
// // // // //             borderBottomColor: edge,
// // // // //             alignItems: 'center',
// // // // //             justifyContent: 'center',
// // // // //             opacity: soon ? 0.85 : 1,
// // // // //             transform: [{ scale }],
// // // // //             shadowColor: '#000',
// // // // //             shadowOpacity: 0.3,
// // // // //             shadowRadius: 3,
// // // // //             shadowOffset: { width: 0, height: 2 },
// // // // //             elevation: 4,
// // // // //           }}
// // // // //         >
// // // // //           <Text style={[st.num, { fontSize: S * 0.42 }]}>{l.n}</Text>
// // // // //         </Animated.View>

// // // // //         {done && (
// // // // //           <View style={[st.starRow, { top: bodyH - 3 }]}>
// // // // //             {[0, 1, 2].map((s) => (
// // // // //               <Text key={s} style={{ fontSize: S * 0.28, color: s < l.stars ? '#ffd23f' : '#ffffff88' }}>★</Text>
// // // // //             ))}
// // // // //           </View>
// // // // //         )}
// // // // //       </TouchableOpacity>
// // // // //     );
// // // // //   };

// // // // //   const c50 = centers[centers.length - 1];

// // // // //   return (
// // // // //     <View style={st.root}>
// // // // //       <ScrollView
// // // // //         ref={scroller}
// // // // //         contentContainerStyle={{ alignItems: 'center' }}
// // // // //         showsVerticalScrollIndicator={false}
// // // // //       >
// // // // //         <View style={{ width: W, height: contentH, backgroundColor: '#8fd4f5' }}>
// // // // //           {/* sky section (levels 42-50) */}
// // // // //           <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: imgTop, backgroundColor: '#8fd4f5' }} />
// // // // //           <View style={{ position: 'absolute', left: 0, right: 0, top: imgTop * 0.45, height: imgTop * 0.55, backgroundColor: '#a9e0f8' }} />
// // // // //           {CLOUDS.map(([fx, fy, sc], i) => (
// // // // //             <View key={i} style={{ position: 'absolute', left: fx * W, top: HEADER_H + fy * E, opacity: 0.9 }}>
// // // // //               <View style={{ width: 90 * sc, height: 30 * sc, borderRadius: 20 * sc, backgroundColor: '#fff' }} />
// // // // //               <View style={{ position: 'absolute', left: 14 * sc, top: -14 * sc, width: 40 * sc, height: 40 * sc, borderRadius: 20 * sc, backgroundColor: '#fff' }} />
// // // // //               <View style={{ position: 'absolute', left: 42 * sc, top: -8 * sc, width: 34 * sc, height: 34 * sc, borderRadius: 17 * sc, backgroundColor: '#fff' }} />
// // // // //             </View>
// // // // //           ))}

// // // // //           {/* dotted path 41 -> 50 */}
// // // // //           {pathDots.map((d, i) => (
// // // // //             <View key={i} style={{ position: 'absolute', left: d.x - 4, top: d.y - 4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#fffbe6', opacity: 0.95 }} />
// // // // //           ))}

// // // // //           {/* castle above level 50 */}
// // // // //           <Text style={{ position: 'absolute', left: c50.x - 30, top: c50.y - c50.s * 1.15 - 34, fontSize: 52 }}>🏰</Text>

// // // // //           {/* the map picture (top part with the old banner is cropped away) */}
// // // // //           <View style={{ position: 'absolute', left: 0, top: imgTop, width: W, height: imgH, overflow: 'hidden' }}>
// // // // //             <Image source={BG} resizeMode="stretch" style={{ position: 'absolute', left: 0, top: -CROP * H, width: W, height: H }} />
// // // // //           </View>

// // // // //           {/* level bubbles 1..50 */}
// // // // //           {visible.map((l, i) => bubble(l, i))}
// // // // //         </View>
// // // // //       </ScrollView>

// // // // //       {/* fixed header (replaces the banner that was drawn inside the picture) */}
// // // // //       <View style={st.header} pointerEvents="box-none">
// // // // //         <TouchableOpacity onPress={onBack} activeOpacity={0.8} style={st.backBtn}>
// // // // //           <Text style={st.backTxt}>←</Text>
// // // // //         </TouchableOpacity>
// // // // //         <View style={st.title}>
// // // // //           <Text style={st.titleTxt}>LEVELS</Text>
// // // // //         </View>
// // // // //         <View style={st.badge}>
// // // // //           <Text style={st.badgeStar}>★</Text>
// // // // //           <Text style={st.badgeT}>{earned}/{maxStars}</Text>
// // // // //         </View>
// // // // //       </View>

// // // // //       {/* toast */}
// // // // //       {!!toast && (
// // // // //         <View style={[st.toast, { top: HEADER_H + 8, width: W * 0.84, alignSelf: 'center' }]}>
// // // // //           <Text style={st.toastT}>{toast}</Text>
// // // // //         </View>
// // // // //       )}
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const st = StyleSheet.create({
// // // // //   root: { flex: 1, backgroundColor: '#8fd4f5' },
// // // // //   header: {
// // // // //     position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H,
// // // // //     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
// // // // //     paddingHorizontal: 12, paddingTop: 6, zIndex: 10,
// // // // //   },
// // // // //   backBtn: {
// // // // //     width: 46, height: 46, borderRadius: 23, backgroundColor: '#e8741c',
// // // // //     borderWidth: 3, borderColor: '#8a3f0c', alignItems: 'center', justifyContent: 'center',
// // // // //   },
// // // // //   backTxt: { color: '#fff', fontSize: 26, fontWeight: '900', marginTop: -2 },
// // // // //   title: {
// // // // //     backgroundColor: '#a85a1c', borderWidth: 3, borderColor: '#6b3510', borderRadius: 14,
// // // // //     paddingHorizontal: 24, paddingVertical: 6,
// // // // //   },
// // // // //   titleTxt: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
// // // // //   badge: {
// // // // //     flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
// // // // //     backgroundColor: '#a85a1c', borderWidth: 3, borderColor: '#6b3510', borderRadius: 12,
// // // // //     paddingHorizontal: 10, height: 40,
// // // // //   },
// // // // //   badgeStar: { color: '#ffd23f', fontSize: 20, fontWeight: '900' },
// // // // //   badgeT: { color: '#fff', fontSize: 16, fontWeight: '900' },
// // // // //   toast: {
// // // // //     position: 'absolute', paddingVertical: 10, borderRadius: 30,
// // // // //     backgroundColor: 'rgba(45,25,10,0.92)', borderWidth: 2, borderColor: '#8a6a45', zIndex: 20,
// // // // //   },
// // // // //   toastT: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
// // // // //   num: {
// // // // //     color: '#fff', fontWeight: '900',
// // // // //     textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 1,
// // // // //   },
// // // // //   starRow: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
// // // // // });
// // // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // // import {
// // // //   View, Text, TouchableOpacity, Animated, Easing,
// // // //   StyleSheet, ActivityIndicator, useWindowDimensions,
// // // // } from 'react-native';
// // // // import Svg, { Rect, Circle, Ellipse, G, Polygon, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
// // // // import { useFocusEffect } from '@react-navigation/native';
// // // // import { getMap, openLevel, LevelMap, MapLevel } from './mapApi';

// // // // /* palette (same as the game screens) */
// // // // const NAVY = '#13235b';
// // // // const CREAM = '#faf0e2';
// // // // const WOOD = '#eba24e';
// // // // const WOOD_D = '#c2782c';
// // // // const WOOD_DD = '#8f5a1f';
// // // // const SIGN = '#bd6b29';
// // // // const YEL = '#fbc02d';
// // // // const YEL_D = '#d98e1c';

// // // // const ROW_H = 54;
// // // // const ROW_GAP = 12;
// // // // const ROW = ROW_H + ROW_GAP;
// // // // const HEADER_H = 112;
// // // // const PER_PAGE = 5;
// // // // const MAX_LEVEL = 50;

// // // // // vertical centre of the 5th row (arrow buttons are placed beside it)
// // // // const ARROW_SIZE = 58;
// // // // const ARROW_TOP = HEADER_H + 8 + 4 * ROW + ROW_H / 2 - ARROW_SIZE / 2;

// // // // type Props = { playerId: number; onBack: () => void; onPlay: (n: number) => void };

// // // // /* ---------- small drawings ---------- */
// // // // function Cloud({ x, y, s = 1 }: any) {
// // // //   return (
// // // //     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
// // // //       <Ellipse cx="0" cy="0" rx="70" ry="26" />
// // // //       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
// // // //       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
// // // //     </G>
// // // //   );
// // // // }

// // // // function Chain({ h = 30, style }: { h?: number; style?: any }) {
// // // //   const n = Math.max(2, Math.round(h / 8));
// // // //   return (
// // // //     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
// // // //       {Array.from({ length: n }).map((_, i) => (
// // // //         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// // // //       ))}
// // // //     </Svg>
// // // //   );
// // // // }

// // // // function HomeIcon({ s = 20 }: { s?: number }) {
// // // //   return (
// // // //     <Svg width={s} height={s} viewBox="0 0 24 24">
// // // //       <Path d="M12 3 L2 12 H5 V21 H10 V15 H14 V21 H19 V12 H22 Z" fill={NAVY} stroke={NAVY} strokeWidth="1.5" strokeLinejoin="round" />
// // // //     </Svg>
// // // //   );
// // // // }

// // // // function GearIcon({ s = 21 }: { s?: number }) {
// // // //   const teeth = [0, 45, 90, 135, 180, 225, 270, 315];
// // // //   return (
// // // //     <Svg width={s} height={s} viewBox="0 0 24 24">
// // // //       <G transform="translate(12 12)">
// // // //         {teeth.map((a) => (
// // // //           <Rect key={a} x="-2" y="-11" width="4" height="6" rx="1" fill={NAVY} transform={`rotate(${a})`} />
// // // //         ))}
// // // //         <Circle r="7.5" fill={NAVY} />
// // // //         <Circle r="3" fill={YEL} />
// // // //       </G>
// // // //     </Svg>
// // // //   );
// // // // }

// // // // function ArrowIcon({ s = 28, dir = 'right' }: { s?: number; dir?: 'left' | 'right' }) {
// // // //   const pts = dir === 'right' ? '25,12 88,50 25,88' : '75,12 12,50 75,88';
// // // //   return (
// // // //     <Svg width={s} height={s} viewBox="0 0 100 100">
// // // //       <Polygon points={pts} fill={NAVY} stroke={NAVY} strokeWidth="8" strokeLinejoin="round" />
// // // //     </Svg>
// // // //   );
// // // // }

// // // // function Cat() {
// // // //   return (
// // // //     <Svg width={96} height={96} viewBox="0 0 100 100">
// // // //       <Polygon points="14,38 18,10 38,26" fill="#fdf1ea" />
// // // //       <Polygon points="19,32 21,18 31,27" fill="#f6a5ae" />
// // // //       <Polygon points="86,38 82,10 62,26" fill="#fdf1ea" />
// // // //       <Rect x="10" y="24" width="80" height="62" rx="30" fill="#fdf1ea" />
// // // //       <Circle cx="34" cy="52" r="4.5" fill="#3a2a2a" />
// // // //       <Circle cx="66" cy="52" r="4.5" fill="#3a2a2a" />
// // // //       <Ellipse cx="22" cy="63" rx="9" ry="6" fill="#f6a5ae" />
// // // //       <Ellipse cx="78" cy="63" rx="9" ry="6" fill="#f6a5ae" />
// // // //       <Path d="M43 62 Q50 72 57 62" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// // // //     </Svg>
// // // //   );
// // // // }

// // // // function Flower({ x, y, s = 1 }: any) {
// // // //   return (
// // // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // // //       {[0, 72, 144, 216, 288].map((a) => (
// // // //         <Ellipse key={a} cx="0" cy="-9" rx="6" ry="8" fill="#fff" transform={`rotate(${a})`} />
// // // //       ))}
// // // //       <Circle cx="0" cy="0" r="5" fill="#ffd33d" />
// // // //     </G>
// // // //   );
// // // // }

// // // // /* ---------- background (sky, clouds, bookshelf, fence, grass) ---------- */
// // // // function Background({ W, height }: { W: number; height: number }) {
// // // //   const pickets = Math.ceil(W / 46) + 1;
// // // //   return (
// // // //     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// // // //       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
// // // //         <Defs>
// // // //           <LinearGradient id="mapSky" x1="0" y1="0" x2="0" y2="1">
// // // //             <Stop offset="0" stopColor="#3fb2f7" />
// // // //             <Stop offset="1" stopColor="#bfe6fb" />
// // // //           </LinearGradient>
// // // //         </Defs>
// // // //         <Rect width="10" height="10" fill="url(#mapSky)" />
// // // //       </Svg>

// // // //       {/* top bushes */}
// // // //       <Svg width={W} height={90} viewBox="0 0 400 90" style={{ position: 'absolute', top: 0, left: 0 }}>
// // // //         <Ellipse cx="20" cy="0" rx="90" ry="55" fill="#4aae3a" />
// // // //         <Ellipse cx="60" cy="-8" rx="70" ry="50" fill="#5bbb43" />
// // // //         <Ellipse cx="390" cy="0" rx="100" ry="55" fill="#58b843" />
// // // //         <Ellipse cx="350" cy="-8" rx="70" ry="48" fill="#66c64a" />
// // // //       </Svg>

// // // //       {/* clouds */}
// // // //       <Svg width={W} height={height} viewBox={`0 0 ${W} ${height}`} style={{ position: 'absolute', top: 0, left: 0 }}>
// // // //         <Cloud x={W * 0.14} y={height * 0.34} s={0.55} />
// // // //         <Cloud x={W * 0.86} y={height * 0.2} s={0.5} />
// // // //         <Cloud x={W * 0.08} y={height * 0.6} s={0.4} />
// // // //         <Cloud x={W * 0.9} y={height * 0.5} s={0.35} />
// // // //       </Svg>

// // // //       {/* bookshelf on the right */}
// // // //       <View style={{ position: 'absolute', right: 0, top: height * 0.45, width: 70 }}>
// // // //         <View style={{ alignItems: 'center', marginBottom: -2 }}>
// // // //           <Svg width={60} height={70} viewBox="0 0 60 70">
// // // //             <G fill="#4cb04a">
// // // //               <Ellipse cx="30" cy="28" rx="9" ry="26" transform="rotate(-28 30 50)" />
// // // //               <Ellipse cx="30" cy="24" rx="9" ry="28" fill="#3a9a3c" />
// // // //               <Ellipse cx="30" cy="28" rx="9" ry="26" transform="rotate(28 30 50)" />
// // // //             </G>
// // // //             <Rect x="12" y="52" width="36" height="9" rx="2" fill="#e8903a" />
// // // //             <Polygon points="15,61 45,61 42,70 18,70" fill="#f0a050" />
// // // //           </Svg>
// // // //         </View>
// // // //         <View style={{ height: 330, backgroundColor: '#eaa24f', borderTopLeftRadius: 4, borderBottomLeftRadius: 4, paddingLeft: 8 }}>
// // // //           <View style={{ height: 8, backgroundColor: '#f2b866' }} />
// // // //           <View style={{ height: 92, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingLeft: 6 }}>
// // // //             <View style={{ width: 14, height: 72, backgroundColor: '#2a9d9d' }} />
// // // //             <View style={{ width: 13, height: 84, backgroundColor: '#f06ba8' }} />
// // // //             <View style={{ width: 15, height: 70, backgroundColor: '#8a63da' }} />
// // // //           </View>
// // // //           <View style={{ height: 8, backgroundColor: '#f2b866' }} />
// // // //           <View style={{ height: 92, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingLeft: 6 }}>
// // // //             <View style={{ width: 13, height: 70, backgroundColor: '#e5484d' }} />
// // // //             <View style={{ width: 11, height: 82, backgroundColor: '#3b82e0' }} />
// // // //             <View style={{ width: 16, height: 72, backgroundColor: '#4caf50' }} />
// // // //           </View>
// // // //           <View style={{ height: 8, backgroundColor: '#f2b866' }} />
// // // //           <View style={{ height: 92, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingLeft: 6 }}>
// // // //             <View style={{ width: 14, height: 66, backgroundColor: '#f5c518' }} />
// // // //             <View style={{ width: 15, height: 80, backgroundColor: '#2c6fdc' }} />
// // // //             <View style={{ width: 13, height: 60, backgroundColor: '#f08a2c' }} />
// // // //           </View>
// // // //         </View>
// // // //       </View>

// // // //       {/* grass + fence */}
// // // //       <Svg width={W} height={160} viewBox={`0 0 ${W} 160`} style={{ position: 'absolute', left: 0, bottom: 0 }}>
// // // //         <Ellipse cx={W * 0.25} cy="40" rx={W * 0.6} ry="40" fill="#8fd94a" />
// // // //         <Ellipse cx={W * 0.8} cy="46" rx={W * 0.6} ry="36" fill="#6cc13a" />
// // // //         {Array.from({ length: pickets }).map((_, i) => {
// // // //           const x = i * 46 - 8;
// // // //           return (
// // // //             <G key={i}>
// // // //               <Polygon points={`${x},34 ${x + 15},18 ${x + 30},34`} fill="#f0b563" stroke="#c98a3e" strokeWidth="2" />
// // // //               <Rect x={x} y="34" width="30" height="56" fill="#f0b563" stroke="#c98a3e" strokeWidth="2" />
// // // //             </G>
// // // //           );
// // // //         })}
// // // //         <Rect x="0" y="48" width={W} height="9" fill="#f4c27a" stroke="#c98a3e" strokeWidth="2" />
// // // //         <Rect x="0" y="72" width={W} height="9" fill="#f4c27a" stroke="#c98a3e" strokeWidth="2" />
// // // //         <Path d={`M0 92 C ${W * 0.3} 78 ${W * 0.7} 78 ${W} 90 L ${W} 160 L 0 160 Z`} fill="#7dd33f" />
// // // //         <Flower x={W * 0.12} y="132" s={1.2} />
// // // //         <Flower x={W * 0.42} y="142" s={1} />
// // // //         <Flower x={W * 0.74} y="136" s={1.1} />
// // // //         <Flower x={W * 0.93} y="148" s={0.9} />
// // // //       </Svg>

// // // //       {/* cat */}
// // // //       <View style={{ position: 'absolute', left: 4, bottom: 52 }}>
// // // //         <Cat />
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // }

// // // // /* =========================================================
// // // //    SCREEN
// // // // ========================================================= */

// // // // export default function BTLevelMapScreen({ playerId, onBack, onPlay }: Props) {
// // // //   const { width, height } = useWindowDimensions();
// // // //   const W = Math.min(width, 460);

// // // //   const [map, setMap] = useState<LevelMap | null>(null);
// // // //   const [page, setPage] = useState(0); // 0 = levels 1-5, 1 = levels 6-10, ...
// // // //   const [toast, setToast] = useState('');
// // // //   const [busy, setBusy] = useState(false);
// // // //   const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
// // // //   const pulse = useRef(new Animated.Value(0)).current;
// // // //   const sway = useRef(new Animated.Value(0)).current;

// // // //   useEffect(() => {
// // // //     const p = Animated.loop(
// // // //       Animated.sequence([
// // // //         Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
// // // //         Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
// // // //       ])
// // // //     );
// // // //     const s = Animated.loop(
// // // //       Animated.sequence([
// // // //         Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // //         Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // //       ])
// // // //     );
// // // //     p.start(); s.start();
// // // //     return () => { p.stop(); s.stop(); };
// // // //   }, [pulse, sway]);
// // // //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// // // //   const showToast = (m: string) => {
// // // //     setToast(m);
// // // //     if (timer.current) clearTimeout(timer.current);
// // // //     timer.current = setTimeout(() => setToast(''), 2400);
// // // //   };

// // // //   useFocusEffect(
// // // //     useCallback(() => {
// // // //       let alive = true;
// // // //       getMap(playerId)
// // // //         .then((m) => { if (alive) setMap(m); })
// // // //         .catch((e: any) => alive && showToast(e.message || 'Could not load levels'));
// // // //       return () => { alive = false; };
// // // //     }, [playerId])
// // // //   );

// // // //   // no level is locked: any built level can be opened
// // // //   const tap = async (l: MapLevel) => {
// // // //     if (busy) return;
// // // //     if (l.status === 'soon') return showToast('Coming soon!');
// // // //     setBusy(true);
// // // //     try {
// // // //       await openLevel(playerId, l.n); // backend confirms
// // // //       onPlay(l.n);
// // // //     } catch (e: any) {
// // // //       showToast(e.message || 'Cannot open level');
// // // //       if (e.map) setMap(e.map);
// // // //     } finally {
// // // //       setBusy(false);
// // // //     }
// // // //   };

// // // //   if (!map) {
// // // //     return (
// // // //       <View style={[st.root, { justifyContent: 'center', alignItems: 'center' }]}>
// // // //         <ActivityIndicator size="large" color="#fff" />
// // // //       </View>
// // // //     );
// // // //   }

// // // //   const all = map.levels.slice(0, MAX_LEVEL);
// // // //   const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
// // // //   const shown = all.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
// // // //   const first = page * PER_PAGE + 1;
// // // //   const last = Math.min(first + PER_PAGE - 1, all.length);
// // // //   const hasNext = page < pages - 1;
// // // //   const hasPrev = page > 0;

// // // //   const earned = map.levels.reduce((sum, l) => sum + (l.stars || 0), 0);
// // // //   const maxStars = Math.max(1, map.total) * 3;

// // // //   const row = (l: MapLevel) => {
// // // //     const soon = l.status === 'soon';
// // // //     const done = l.status === 'completed';
// // // //     const cur = l.status === 'current';
// // // //     const scale = cur ? pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }) : 1;

// // // //     return (
// // // //       <TouchableOpacity key={l.n} activeOpacity={0.85} onPress={() => tap(l)} style={{ marginBottom: ROW_GAP }}>
// // // //         <Animated.View style={[st.pillOuter, soon && { opacity: 0.6 }, { transform: [{ scale }] }]}>
// // // //           <View style={[st.pillInner, cur && { backgroundColor: '#fbd34a' }]}>
// // // //             <Text style={st.pillT}>LEVEL {l.n}</Text>
// // // //             {done && (
// // // //               <View style={st.starRow}>
// // // //                 {[0, 1, 2].map((s) => (
// // // //                   <Text key={s} style={{ fontSize: 13, color: s < l.stars ? '#f5a500' : '#d9c9a8' }}>★</Text>
// // // //                 ))}
// // // //               </View>
// // // //             )}
// // // //           </View>
// // // //         </Animated.View>
// // // //       </TouchableOpacity>
// // // //     );
// // // //   };

// // // //   return (
// // // //     <View style={st.root}>
// // // //       <View style={{ width: W, flex: 1, alignSelf: 'center' }}>
// // // //         <Background W={W} height={height} />

// // // //         {/* 5 levels of the current page */}
// // // //         <View style={{ paddingTop: HEADER_H + 8, alignItems: 'center' }}>
// // // //           <View style={{ width: Math.min(W * 0.66, 300) }}>
// // // //             {shown.map((l) => row(l))}
// // // //           </View>
// // // //         </View>

// // // //         {/* header */}
// // // //         <View style={st.header} pointerEvents="box-none">
// // // //           <View style={st.leftBtns}>
// // // //             <TouchableOpacity style={st.roundBtn} activeOpacity={0.85} onPress={onBack}>
// // // //               <HomeIcon s={20} />
// // // //             </TouchableOpacity>
// // // //             <TouchableOpacity style={st.roundBtn} activeOpacity={0.85}>
// // // //               <GearIcon s={21} />
// // // //             </TouchableOpacity>
// // // //           </View>

// // // //           <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
// // // //             <Chain h={30} style={{ left: 24, top: -6 }} />
// // // //             <Chain h={30} style={{ right: 24, top: -6 }} />
// // // //             <View style={st.sign}>
// // // //               <Text style={st.signArrow}>{'<'}</Text>
// // // //               <Text style={st.signT}>LEVELS</Text>
// // // //               <Text style={st.signArrow}>{'>'}</Text>
// // // //             </View>
// // // //           </Animated.View>

// // // //           <View style={st.pill}>
// // // //             <Text style={st.pillStar}>★</Text>
// // // //             <Text style={st.pillCount} numberOfLines={1}>{earned}/{maxStars}</Text>
// // // //           </View>
// // // //         </View>

// // // //         {/* previous page arrow (left, beside level 5) */}
// // // //         {hasPrev && (
// // // //           <TouchableOpacity style={[st.arrowBtn, { left: 8 }]} activeOpacity={0.85} onPress={() => setPage(page - 1)}>
// // // //             <ArrowIcon s={26} dir="left" />
// // // //           </TouchableOpacity>
// // // //         )}

// // // //         {/* next page arrow (right, beside level 5) */}
// // // //         {hasNext && (
// // // //           <TouchableOpacity style={[st.arrowBtn, { right: 8 }]} activeOpacity={0.85} onPress={() => setPage(page + 1)}>
// // // //             <ArrowIcon s={26} dir="right" />
// // // //           </TouchableOpacity>
// // // //         )}

// // // //         {/* page label */}
// // // //         <View style={st.pageLabel} pointerEvents="none">
// // // //           <Text style={st.pageLabelT}>{first} - {last}</Text>
// // // //         </View>

// // // //         {/* toast */}
// // // //         {!!toast && (
// // // //           <View style={[st.toast, { top: HEADER_H + 6, width: W * 0.84, alignSelf: 'center' }]}>
// // // //             <Text style={st.toastT}>{toast}</Text>
// // // //           </View>
// // // //         )}
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // }

// // // // const st = StyleSheet.create({
// // // //   root: { flex: 1, backgroundColor: '#3fb2f7' },

// // // //   header: {
// // // //     position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H,
// // // //     flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
// // // //     paddingHorizontal: 12, paddingTop: 14, zIndex: 10,
// // // //   },
// // // //   leftBtns: { flexDirection: 'row', gap: 8 },
// // // //   roundBtn: {
// // // //     width: 40, height: 40, borderRadius: 20, backgroundColor: YEL, borderWidth: 2.5, borderColor: YEL_D,
// // // //     alignItems: 'center', justifyContent: 'center', elevation: 3,
// // // //   },
// // // //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
// // // //   sign: {
// // // //     flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, height: 46,
// // // //     borderRadius: 8, backgroundColor: SIGN, borderWidth: 3, borderColor: WOOD_DD, elevation: 3,
// // // //   },
// // // //   signT: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
// // // //   signArrow: { fontSize: 24, fontWeight: '900', color: '#ffc533' },
// // // //   pill: {
// // // //     flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
// // // //     height: 30, minWidth: 66, paddingHorizontal: 10, borderRadius: 15, marginTop: 6,
// // // //     backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', elevation: 3,
// // // //   },
// // // //   pillStar: { color: '#f5a500', fontSize: 15, fontWeight: '900' },
// // // //   pillCount: { color: '#1b1b1b', fontSize: 14, fontWeight: '900' },

// // // //   // level pills
// // // //   pillOuter: {
// // // //     height: ROW_H, borderRadius: ROW_H / 2, backgroundColor: WOOD_D, padding: 4,
// // // //     shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 4,
// // // //   },
// // // //   pillInner: {
// // // //     flex: 1, borderRadius: ROW_H / 2, backgroundColor: CREAM, borderWidth: 2, borderColor: '#f3c77c',
// // // //     alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
// // // //   },
// // // //   pillT: { fontSize: 22, fontWeight: '900', color: NAVY, letterSpacing: 0.5 },
// // // //   starRow: { position: 'absolute', right: 16, flexDirection: 'row' },

// // // //   // page arrows (beside level 5)
// // // //   arrowBtn: {
// // // //     position: 'absolute', top: ARROW_TOP, width: ARROW_SIZE, height: ARROW_SIZE, borderRadius: ARROW_SIZE / 2,
// // // //     backgroundColor: CREAM, borderWidth: 5, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center',
// // // //     elevation: 8, zIndex: 12,
// // // //     shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
// // // //   },

// // // //   // page label (bottom centre)
// // // //   pageLabel: {
// // // //     position: 'absolute', bottom: 28, alignSelf: 'center', height: 30, paddingHorizontal: 16, borderRadius: 15,
// // // //     backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8',
// // // //     alignItems: 'center', justifyContent: 'center', elevation: 3, zIndex: 12,
// // // //   },
// // // //   pageLabelT: { color: NAVY, fontSize: 14, fontWeight: '900' },

// // // //   toast: {
// // // //     position: 'absolute', paddingVertical: 10, borderRadius: 30,
// // // //     backgroundColor: 'rgba(45,25,10,0.92)', borderWidth: 2, borderColor: '#8a6a45', zIndex: 20,
// // // //   },
// // // //   toastT: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
// // // // });
// // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // import {
// // //   View, Text, TouchableOpacity, Animated, Easing,
// // //   StyleSheet, ActivityIndicator, useWindowDimensions,
// // // } from 'react-native';
// // // import Svg, { Rect, Circle, Ellipse, G, Polygon, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
// // // import { useFocusEffect } from '@react-navigation/native';
// // // import { Icon } from './Art';
// // // import { getMap, openLevel, LevelMap, MapLevel } from './mapApi';

// // // /* palette */
// // // const NAVY = '#13235b';
// // // const CREAM = '#faf0e2';
// // // const CREAM_IN = '#fbeedb';
// // // const WOOD_D = '#c2782c';
// // // const WOOD_DD = '#8f5a1f';
// // // const SIGN = '#bd6b29';
// // // const YEL = '#fbc02d';
// // // const YEL_D = '#d98e1c';
// // // const GOLD = '#fdd23a';

// // // const ROW_H = 62;
// // // const ROW_GAP = 8;
// // // const ROW = ROW_H + ROW_GAP;
// // // const HEADER_H = 100;
// // // const ROWS_TOP = HEADER_H + 16;
// // // const PER_PAGE = 5;
// // // const MAX_LEVEL = 50;
// // // const BTN = 66;

// // // type Props = { playerId: number; hints?: number; onBack: () => void; onPlay: (n: number) => void };

// // // /* ---------- small drawings ---------- */
// // // function Cloud({ x, y, s = 1 }: any) {
// // //   return (
// // //     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
// // //       <Ellipse cx="0" cy="0" rx="70" ry="26" />
// // //       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
// // //       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
// // //     </G>
// // //   );
// // // }

// // // function Chain({ h = 30, style }: { h?: number; style?: any }) {
// // //   const n = Math.max(2, Math.round(h / 8));
// // //   return (
// // //     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
// // //       {Array.from({ length: n }).map((_, i) => (
// // //         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// // //       ))}
// // //     </Svg>
// // //   );
// // // }

// // // function HomeIcon({ s = 22 }: { s?: number }) {
// // //   return (
// // //     <Svg width={s} height={s} viewBox="0 0 24 24">
// // //       <Path d="M12 3 L2 12 H5 V21 H10 V15 H14 V21 H19 V12 H22 Z" fill={NAVY} stroke={NAVY} strokeWidth="1.5" strokeLinejoin="round" />
// // //     </Svg>
// // //   );
// // // }

// // // function GearIcon({ s = 23 }: { s?: number }) {
// // //   const teeth = [0, 45, 90, 135, 180, 225, 270, 315];
// // //   return (
// // //     <Svg width={s} height={s} viewBox="0 0 24 24">
// // //       <G transform="translate(12 12)">
// // //         {teeth.map((a) => (
// // //           <Rect key={a} x="-2" y="-11" width="4" height="6" rx="1" fill={NAVY} transform={`rotate(${a})`} />
// // //         ))}
// // //         <Circle r="7.5" fill={NAVY} />
// // //         <Circle r="3" fill={YEL} />
// // //       </G>
// // //     </Svg>
// // //   );
// // // }

// // // function ArrowIcon({ s = 28, dir = 'right' }: { s?: number; dir?: 'left' | 'right' }) {
// // //   const pts = dir === 'right' ? '25,12 88,50 25,88' : '75,12 12,50 75,88';
// // //   return (
// // //     <Svg width={s} height={s} viewBox="0 0 100 100">
// // //       <Polygon points={pts} fill={NAVY} stroke={NAVY} strokeWidth="8" strokeLinejoin="round" />
// // //     </Svg>
// // //   );
// // // }

// // // /* yellow "shine" marks beside the current level */
// // // function Sparkle({ flip }: { flip?: boolean }) {
// // //   return (
// // //     <Svg width={34} height={34} viewBox="0 0 34 34" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
// // //       <Polygon points="6,4 14,2 20,14 12,16" fill={GOLD} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
// // //       <Polygon points="2,22 18,20 18,28 2,30" fill={GOLD} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
// // //     </Svg>
// // //   );
// // // }

// // // function Cat() {
// // //   return (
// // //     <Svg width={104} height={104} viewBox="0 0 100 100">
// // //       <Polygon points="14,38 18,10 38,26" fill="#fdf1ea" />
// // //       <Polygon points="19,32 21,18 31,27" fill="#f6a5ae" />
// // //       <Polygon points="86,38 82,10 62,26" fill="#fdf1ea" />
// // //       <Rect x="10" y="24" width="80" height="62" rx="30" fill="#fdf1ea" />
// // //       <Circle cx="34" cy="52" r="4.5" fill="#3a2a2a" />
// // //       <Circle cx="66" cy="52" r="4.5" fill="#3a2a2a" />
// // //       <Ellipse cx="22" cy="63" rx="9" ry="6" fill="#f6a5ae" />
// // //       <Ellipse cx="78" cy="63" rx="9" ry="6" fill="#f6a5ae" />
// // //       <Path d="M43 62 Q50 72 57 62" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// // //     </Svg>
// // //   );
// // // }

// // // function Flower({ x, y, s = 1 }: any) {
// // //   return (
// // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // //       {[0, 72, 144, 216, 288].map((a) => (
// // //         <Ellipse key={a} cx="0" cy="-9" rx="6" ry="8" fill="#fff" transform={`rotate(${a})`} />
// // //       ))}
// // //       <Circle cx="0" cy="0" r="5" fill="#ffd33d" />
// // //     </G>
// // //   );
// // // }

// // // function Tuft({ x, y }: any) {
// // //   return (
// // //     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
// // //       <Polygon points="-8,0 -4,-16 0,0" />
// // //       <Polygon points="-2,0 3,-22 8,0" />
// // //       <Polygon points="5,0 10,-14 14,0" />
// // //     </G>
// // //   );
// // // }

// // // /* ---------- background ---------- */
// // // function Background({ W, height }: { W: number; height: number }) {
// // //   const fenceY = ROWS_TOP + 4 * ROW + 6;      // fence starts behind level 5
// // //   const pickets = Math.ceil(W / 46) + 1;
// // //   const grassH = Math.max(120, height - fenceY - 10);
// // //   return (
// // //     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// // //       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
// // //         <Defs>
// // //           <LinearGradient id="mapSky" x1="0" y1="0" x2="0" y2="1">
// // //             <Stop offset="0" stopColor="#3fb2f7" />
// // //             <Stop offset="1" stopColor="#bfe6fb" />
// // //           </LinearGradient>
// // //         </Defs>
// // //         <Rect width="10" height="10" fill="url(#mapSky)" />
// // //       </Svg>

// // //       {/* top-left / top-right foliage */}
// // //       <Svg width={W} height={110} viewBox="0 0 400 110" style={{ position: 'absolute', top: 0, left: 0 }}>
// // //         <Ellipse cx="20" cy="10" rx="110" ry="62" fill="#4aae3a" />
// // //         <Ellipse cx="70" cy="-6" rx="80" ry="55" fill="#5bbb43" />
// // //         <Ellipse cx="395" cy="8" rx="110" ry="60" fill="#58b843" />
// // //         <Ellipse cx="340" cy="-8" rx="80" ry="52" fill="#66c64a" />
// // //       </Svg>

// // //       {/* clouds */}
// // //       <Svg width={W} height={height} viewBox={`0 0 ${W} ${height}`} style={{ position: 'absolute', top: 0, left: 0 }}>
// // //         <Cloud x={W * 0.14} y={height * 0.3} s={0.55} />
// // //         <Cloud x={W * 0.88} y={height * 0.2} s={0.42} />
// // //         <Cloud x={W * 0.9} y={height * 0.42} s={0.38} />
// // //         <Cloud x={W * 0.1} y={height * 0.5} s={0.4} />
// // //       </Svg>

// // //       {/* big bushes on the left, behind the cat */}
// // //       <Svg width={120} height={200} viewBox="0 0 120 200" style={{ position: 'absolute', left: 0, top: fenceY - 150 }}>
// // //         <Ellipse cx="22" cy="110" rx="26" ry="90" fill="#46ad33" />
// // //         <Ellipse cx="60" cy="130" rx="24" ry="66" fill="#5cbb3c" />
// // //         <Ellipse cx="14" cy="160" rx="40" ry="40" fill="#4fb12c" />
// // //       </Svg>

// // //       {/* bookshelf + plant on the right */}
// // //       <View style={{ position: 'absolute', right: 0, top: ROWS_TOP + 2 * ROW, width: 74 }}>
// // //         <View style={{ alignItems: 'center', marginBottom: -2 }}>
// // //           <Svg width={64} height={74} viewBox="0 0 60 70">
// // //             <G fill="#4cb04a">
// // //               <Ellipse cx="30" cy="28" rx="9" ry="26" transform="rotate(-28 30 50)" />
// // //               <Ellipse cx="30" cy="24" rx="9" ry="28" fill="#3a9a3c" />
// // //               <Ellipse cx="30" cy="28" rx="9" ry="26" transform="rotate(28 30 50)" />
// // //             </G>
// // //             <Rect x="12" y="52" width="36" height="9" rx="2" fill="#e8903a" />
// // //             <Polygon points="15,61 45,61 42,70 18,70" fill="#f0a050" />
// // //           </Svg>
// // //         </View>
// // //         <View style={{ height: 300, backgroundColor: '#eaa24f', borderTopLeftRadius: 4, borderBottomLeftRadius: 4, paddingLeft: 8 }}>
// // //           <View style={{ height: 8, backgroundColor: '#f2b866' }} />
// // //           <View style={{ height: 84, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingLeft: 6 }}>
// // //             <View style={{ width: 14, height: 66, backgroundColor: '#2a9d9d' }} />
// // //             <View style={{ width: 13, height: 78, backgroundColor: '#f06ba8' }} />
// // //             <View style={{ width: 15, height: 64, backgroundColor: '#8a63da' }} />
// // //           </View>
// // //           <View style={{ height: 8, backgroundColor: '#f2b866' }} />
// // //           <View style={{ height: 84, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingLeft: 6 }}>
// // //             <View style={{ width: 13, height: 64, backgroundColor: '#e5484d' }} />
// // //             <View style={{ width: 11, height: 74, backgroundColor: '#3b82e0' }} />
// // //             <View style={{ width: 16, height: 66, backgroundColor: '#4caf50' }} />
// // //           </View>
// // //           <View style={{ height: 8, backgroundColor: '#f2b866' }} />
// // //           <View style={{ height: 84, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingLeft: 6 }}>
// // //             <View style={{ width: 14, height: 60, backgroundColor: '#f5c518' }} />
// // //             <View style={{ width: 15, height: 74, backgroundColor: '#2c6fdc' }} />
// // //             <View style={{ width: 13, height: 56, backgroundColor: '#f08a2c' }} />
// // //           </View>
// // //         </View>
// // //       </View>

// // //       {/* fence + grass */}
// // //       <Svg width={W} height={grassH + 80} viewBox={`0 0 ${W} ${grassH + 80}`} style={{ position: 'absolute', left: 0, top: fenceY - 20 }}>
// // //         {Array.from({ length: pickets }).map((_, i) => {
// // //           const x = i * 46 - 8;
// // //           return (
// // //             <G key={i}>
// // //               <Polygon points={`${x},20 ${x + 15},4 ${x + 30},20`} fill="#f0b563" stroke="#c98a3e" strokeWidth="2" />
// // //               <Rect x={x} y="20" width="30" height="70" fill="#f0b563" stroke="#c98a3e" strokeWidth="2" />
// // //               <Circle cx={x + 15} cy="34" r="2" fill="#a86a2a" />
// // //               <Circle cx={x + 15} cy="76" r="2" fill="#a86a2a" />
// // //             </G>
// // //           );
// // //         })}
// // //         <Rect x="0" y="36" width={W} height="9" fill="#f4c27a" stroke="#c98a3e" strokeWidth="2" />
// // //         <Rect x="0" y="62" width={W} height="9" fill="#f4c27a" stroke="#c98a3e" strokeWidth="2" />
// // //         <Path d={`M0 82 C ${W * 0.25} 66 ${W * 0.7} 62 ${W} 78 L ${W} ${grassH + 80} L 0 ${grassH + 80} Z`} fill="#8fe03a" />
// // //         <Path d={`M0 110 C ${W * 0.3} 96 ${W * 0.7} 100 ${W} 106 L ${W} ${grassH + 80} L 0 ${grassH + 80} Z`} fill="#7dd33f" />
// // //         <Tuft x={W * 0.3} y="116" />
// // //         <Tuft x={W * 0.62} y="124" />
// // //         <Tuft x={W * 0.5} y="150" />
// // //         <Flower x={W * 0.12} y="140" s={1.3} />
// // //         <Flower x={W * 0.44} y="132" s={1} />
// // //         <Flower x={W * 0.76} y="146" s={1.2} />
// // //         <Flower x={W * 0.9} y="128" s={0.9} />
// // //       </Svg>

// // //       {/* cat peeking from the left bush */}
// // //       <View style={{ position: 'absolute', left: 2, top: fenceY - 36 }}>
// // //         <Cat />
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // /* =========================================================
// // //    SCREEN
// // // ========================================================= */

// // // export default function BTLevelMapScreen({ playerId, hints, onBack, onPlay }: Props) {
// // //   const { width, height } = useWindowDimensions();
// // //   const W = Math.min(width, 460);

// // //   const [map, setMap] = useState<LevelMap | null>(null);
// // //   const [page, setPage] = useState(0);
// // //   const [toast, setToast] = useState('');
// // //   const [busy, setBusy] = useState(false);
// // //   const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
// // //   const pulse = useRef(new Animated.Value(0)).current;
// // //   const sway = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     const p = Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
// // //         Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
// // //       ])
// // //     );
// // //     const s = Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // //         Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // //       ])
// // //     );
// // //     p.start(); s.start();
// // //     return () => { p.stop(); s.stop(); };
// // //   }, [pulse, sway]);
// // //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// // //   const showToast = (m: string) => {
// // //     setToast(m);
// // //     if (timer.current) clearTimeout(timer.current);
// // //     timer.current = setTimeout(() => setToast(''), 2400);
// // //   };

// // //   useFocusEffect(
// // //     useCallback(() => {
// // //       let alive = true;
// // //       getMap(playerId)
// // //         .then((m) => { if (alive) setMap(m); })
// // //         .catch((e: any) => alive && showToast(e.message || 'Could not load levels'));
// // //       return () => { alive = false; };
// // //     }, [playerId])
// // //   );

// // //   const tap = async (l: MapLevel) => {
// // //     if (busy) return;
// // //     if (l.status === 'soon') return showToast('Coming soon!');
// // //     setBusy(true);
// // //     try {
// // //       await openLevel(playerId, l.n);
// // //       onPlay(l.n);
// // //     } catch (e: any) {
// // //       showToast(e.message || 'Cannot open level');
// // //       if (e.map) setMap(e.map);
// // //     } finally {
// // //       setBusy(false);
// // //     }
// // //   };

// // //   if (!map) {
// // //     return (
// // //       <View style={[st.root, { justifyContent: 'center', alignItems: 'center' }]}>
// // //         <ActivityIndicator size="large" color="#fff" />
// // //       </View>
// // //     );
// // //   }

// // //   const all = map.levels.slice(0, MAX_LEVEL);
// // //   const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
// // //   const shown = all.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
// // //   const first = page * PER_PAGE + 1;
// // //   const last = Math.min(first + PER_PAGE - 1, all.length);
// // //   const hasNext = page < pages - 1;
// // //   const hasPrev = page > 0;

// // //   const earned = map.levels.reduce((sum, l) => sum + (l.stars || 0), 0);
// // //   const counter = typeof hints === 'number' ? hints : earned;
// // //   const pillW = Math.min(W * 0.62, 280);

// // //   const row = (l: MapLevel) => {
// // //     const soon = l.status === 'soon';
// // //     const done = l.status === 'completed';
// // //     const cur = l.status === 'current';
// // //     const scale = cur ? pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }) : 1;

// // //     return (
// // //       <View key={l.n} style={{ height: ROW_H, marginBottom: ROW_GAP, justifyContent: 'center' }}>
// // //         {cur && (
// // //           <>
// // //             <View style={{ position: 'absolute', left: -38, top: 2 }} pointerEvents="none"><Sparkle /></View>
// // //             <View style={{ position: 'absolute', right: -38, top: 2 }} pointerEvents="none"><Sparkle flip /></View>
// // //           </>
// // //         )}
// // //         <TouchableOpacity activeOpacity={0.85} onPress={() => tap(l)}>
// // //           <Animated.View style={[st.pillOuter, soon && { opacity: 0.6 }, { transform: [{ scale }] }]}>
// // //             <View style={[st.pillInner, cur && { backgroundColor: GOLD }]}>
// // //               <View style={st.gloss} pointerEvents="none" />
// // //               <Text style={st.pillT}>LEVEL {l.n}</Text>
// // //               {done && (
// // //                 <View style={st.starRow}>
// // //                   {[0, 1, 2].map((s) => (
// // //                     <Text key={s} style={{ fontSize: 13, color: s < l.stars ? '#f5a500' : '#d9c9a8' }}>★</Text>
// // //                   ))}
// // //                 </View>
// // //               )}
// // //             </View>
// // //           </Animated.View>
// // //         </TouchableOpacity>
// // //       </View>
// // //     );
// // //   };

// // //   return (
// // //     <View style={st.root}>
// // //       <View style={{ width: W, flex: 1, alignSelf: 'center' }}>
// // //         <Background W={W} height={height} />

// // //         {/* 5 levels of the current page */}
// // //         <View style={{ paddingTop: ROWS_TOP, alignItems: 'center' }}>
// // //           <View style={{ width: pillW }}>
// // //             {shown.map((l) => row(l))}
// // //           </View>
// // //         </View>

// // //         {/* header */}
// // //         <View style={st.header} pointerEvents="box-none">
// // //           <View style={st.leftBtns}>
// // //             <TouchableOpacity style={st.roundBtn} activeOpacity={0.85} onPress={onBack}>
// // //               <HomeIcon s={22} />
// // //             </TouchableOpacity>
// // //             <TouchableOpacity style={st.roundBtn} activeOpacity={0.85}>
// // //               <GearIcon s={23} />
// // //             </TouchableOpacity>
// // //           </View>

// // //           <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
// // //             <Chain h={30} style={{ left: 24, top: -6 }} />
// // //             <Chain h={30} style={{ right: 24, top: -6 }} />
// // //             <View style={st.sign}>
// // //               <Text style={st.signArrow}>{'<'}</Text>
// // //               <Text style={st.signT}>LEVELS</Text>
// // //               <Text style={st.signArrow}>{'>'}</Text>
// // //             </View>
// // //           </Animated.View>

// // //           <View style={st.counterWrap}>
// // //             <View style={st.counter}>
// // //               <Text style={st.counterT} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{counter}</Text>
// // //             </View>
// // //             <View style={st.counterIcon}>
// // //               <Icon n="bulb" s={32} />
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* previous page (bottom left) */}
// // //         {hasPrev && (
// // //           <TouchableOpacity style={[st.playBtn, { left: 14 }]} activeOpacity={0.85} onPress={() => setPage(page - 1)}>
// // //             <ArrowIcon s={30} dir="left" />
// // //           </TouchableOpacity>
// // //         )}

// // //         {/* next page (bottom right, like the design) */}
// // //         {hasNext && (
// // //           <TouchableOpacity style={[st.playBtn, { right: 14 }]} activeOpacity={0.85} onPress={() => setPage(page + 1)}>
// // //             <ArrowIcon s={30} dir="right" />
// // //           </TouchableOpacity>
// // //         )}

// // //         {/* page label */}
// // //         <View style={st.pageLabel} pointerEvents="none">
// // //           <Text style={st.pageLabelT}>{first} - {last}</Text>
// // //         </View>

// // //         {!!toast && (
// // //           <View style={[st.toast, { top: HEADER_H + 4, width: W * 0.84, alignSelf: 'center' }]}>
// // //             <Text style={st.toastT}>{toast}</Text>
// // //           </View>
// // //         )}
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // const st = StyleSheet.create({
// // //   root: { flex: 1, backgroundColor: '#3fb2f7' },

// // //   header: {
// // //     position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H,
// // //     flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
// // //     paddingHorizontal: 12, paddingTop: 14, zIndex: 10,
// // //   },
// // //   leftBtns: { flexDirection: 'row', gap: 8 },
// // //   roundBtn: {
// // //     width: 44, height: 44, borderRadius: 22, backgroundColor: YEL, borderWidth: 3, borderColor: YEL_D,
// // //     alignItems: 'center', justifyContent: 'center', elevation: 3,
// // //   },
// // //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 10 },
// // //   sign: {
// // //     flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, height: 48,
// // //     borderRadius: 8, backgroundColor: SIGN, borderWidth: 3, borderColor: WOOD_DD, elevation: 3,
// // //   },
// // //   signT: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
// // //   signArrow: { fontSize: 24, fontWeight: '900', color: '#ffc533' },

// // //   // hint counter (cream pill + bulb, like the design)
// // //   counterWrap: { width: 74, height: 40, marginTop: 4, justifyContent: 'center' },
// // //   counter: {
// // //     width: 62, height: 30, borderRadius: 15, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed',
// // //     borderColor: '#d8c8a8', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 12, paddingRight: 6, elevation: 3,
// // //   },
// // //   counterT: { fontSize: 17, fontWeight: '900', color: NAVY, width: 36 },
// // //   counterIcon: { position: 'absolute', right: 0, top: -2 },

// // //   // level pills
// // //   pillOuter: {
// // //     height: ROW_H, borderRadius: ROW_H / 2, backgroundColor: WOOD_D, padding: 4,
// // //     shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 4,
// // //   },
// // //   pillInner: {
// // //     flex: 1, borderRadius: ROW_H / 2, backgroundColor: CREAM_IN, borderWidth: 2, borderColor: '#f3b95e',
// // //     alignItems: 'center', justifyContent: 'center', flexDirection: 'row', overflow: 'hidden',
// // //   },
// // //   gloss: {
// // //     position: 'absolute', top: 3, left: 14, right: 14, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.55)',
// // //   },
// // //   pillT: { fontSize: 24, fontWeight: '900', color: NAVY, letterSpacing: 0.5 },
// // //   starRow: { position: 'absolute', right: 16, flexDirection: 'row' },

// // //   // page buttons (bottom corners)
// // //   playBtn: {
// // //     position: 'absolute', bottom: 22, width: BTN, height: BTN, borderRadius: BTN / 2,
// // //     backgroundColor: CREAM, borderWidth: 5, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center',
// // //     elevation: 8, zIndex: 12,
// // //     shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
// // //   },

// // //   pageLabel: {
// // //     position: 'absolute', bottom: 40, alignSelf: 'center', height: 30, paddingHorizontal: 16, borderRadius: 15,
// // //     backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8',
// // //     alignItems: 'center', justifyContent: 'center', elevation: 3, zIndex: 12,
// // //   },
// // //   pageLabelT: { color: NAVY, fontSize: 14, fontWeight: '900' },

// // //   toast: {
// // //     position: 'absolute', paddingVertical: 10, borderRadius: 30,
// // //     backgroundColor: 'rgba(45,25,10,0.92)', borderWidth: 2, borderColor: '#8a6a45', zIndex: 20,
// // //   },
// // //   toastT: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
// // // });
// // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // import {
// //   View, Text, TouchableOpacity, Animated, Easing,
// //   StyleSheet, ActivityIndicator, useWindowDimensions,
// // } from 'react-native';
// // import Svg, { Rect, Circle, Ellipse, G, Polygon, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
// // import { useFocusEffect } from '@react-navigation/native';
// // import { Icon } from './Art';
// // import { getMap, openLevel, LevelMap, MapLevel } from './mapApi';

// // /* palette */
// // const NAVY = '#13235b';
// // const CREAM = '#faf0e2';
// // const CREAM_IN = '#fbeedb';
// // const WOOD_D = '#c2782c';
// // const WOOD_DD = '#8f5a1f';
// // const SIGN = '#bd6b29';
// // const YEL = '#fbc02d';
// // const YEL_D = '#d98e1c';
// // const GOLD = '#fdd23a';

// // const HEADER_H = 100;
// // const ROWS_TOP = HEADER_H + 10;
// // const PER_PAGE = 5;
// // const MAX_LEVEL = 50;
// // const BTN = 66;

// // type Props = { playerId: number; hints?: number; onBack: () => void; onPlay: (n: number) => void };

// // /* ---------- small drawings ---------- */
// // function Cloud({ x, y, s = 1 }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
// //       <Ellipse cx="0" cy="0" rx="70" ry="26" />
// //       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
// //       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
// //     </G>
// //   );
// // }

// // function Chain({ h = 30, style }: { h?: number; style?: any }) {
// //   const n = Math.max(2, Math.round(h / 8));
// //   return (
// //     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
// //       {Array.from({ length: n }).map((_, i) => (
// //         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// //       ))}
// //     </Svg>
// //   );
// // }

// // function HomeIcon({ s = 22 }: { s?: number }) {
// //   return (
// //     <Svg width={s} height={s} viewBox="0 0 24 24">
// //       <Path d="M12 3 L2 12 H5 V21 H10 V15 H14 V21 H19 V12 H22 Z" fill={NAVY} stroke={NAVY} strokeWidth="1.5" strokeLinejoin="round" />
// //     </Svg>
// //   );
// // }

// // function GearIcon({ s = 23 }: { s?: number }) {
// //   const teeth = [0, 45, 90, 135, 180, 225, 270, 315];
// //   return (
// //     <Svg width={s} height={s} viewBox="0 0 24 24">
// //       <G transform="translate(12 12)">
// //         {teeth.map((a) => (
// //           <Rect key={a} x="-2" y="-11" width="4" height="6" rx="1" fill={NAVY} transform={`rotate(${a})`} />
// //         ))}
// //         <Circle r="7.5" fill={NAVY} />
// //         <Circle r="3" fill={YEL} />
// //       </G>
// //     </Svg>
// //   );
// // }

// // function ArrowIcon({ s = 28, dir = 'right' }: { s?: number; dir?: 'left' | 'right' }) {
// //   const pts = dir === 'right' ? '25,12 88,50 25,88' : '75,12 12,50 75,88';
// //   return (
// //     <Svg width={s} height={s} viewBox="0 0 100 100">
// //       <Polygon points={pts} fill={NAVY} stroke={NAVY} strokeWidth="8" strokeLinejoin="round" />
// //     </Svg>
// //   );
// // }

// // function Sparkle({ flip }: { flip?: boolean }) {
// //   return (
// //     <Svg width={34} height={34} viewBox="0 0 34 34" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
// //       <Polygon points="6,4 14,2 20,14 12,16" fill={GOLD} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
// //       <Polygon points="2,22 18,20 18,28 2,30" fill={GOLD} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
// //     </Svg>
// //   );
// // }

// // function Cat() {
// //   return (
// //     <Svg width={104} height={104} viewBox="0 0 100 100">
// //       <Polygon points="14,38 18,10 38,26" fill="#fdf1ea" />
// //       <Polygon points="19,32 21,18 31,27" fill="#f6a5ae" />
// //       <Polygon points="86,38 82,10 62,26" fill="#fdf1ea" />
// //       <Rect x="10" y="24" width="80" height="62" rx="30" fill="#fdf1ea" />
// //       <Circle cx="34" cy="52" r="4.5" fill="#3a2a2a" />
// //       <Circle cx="66" cy="52" r="4.5" fill="#3a2a2a" />
// //       <Ellipse cx="22" cy="63" rx="9" ry="6" fill="#f6a5ae" />
// //       <Ellipse cx="78" cy="63" rx="9" ry="6" fill="#f6a5ae" />
// //       <Path d="M43 62 Q50 72 57 62" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// //     </Svg>
// //   );
// // }

// // function Flower({ x, y, s = 1 }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// //       {[0, 72, 144, 216, 288].map((a) => (
// //         <Ellipse key={a} cx="0" cy="-9" rx="6" ry="8" fill="#fff" transform={`rotate(${a})`} />
// //       ))}
// //       <Circle cx="0" cy="0" r="5" fill="#ffd33d" />
// //     </G>
// //   );
// // }

// // function Tuft({ x, y }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
// //       <Polygon points="-8,0 -4,-16 0,0" />
// //       <Polygon points="-2,0 3,-22 8,0" />
// //       <Polygon points="5,0 10,-14 14,0" />
// //     </G>
// //   );
// // }

// // /* ---------- background (everything is positioned from groundTop / rowH) ---------- */
// // function Background({ W, H, groundTop, fenceTop }: { W: number; H: number; groundTop: number; fenceTop: number }) {
// //   const pickets = Math.ceil(W / 46) + 1;
// //   const fh = groundTop - fenceTop + 6;        // fence height
// //   const gTop = groundTop - 16;                // grass svg top
// //   const gH = H - gTop;                        // grass svg height
// //   const shelfTop = groundTop - 350;

// //   return (
// //     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// //       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
// //         <Defs>
// //           <LinearGradient id="mapSky" x1="0" y1="0" x2="0" y2="1">
// //             <Stop offset="0" stopColor="#3fb2f7" />
// //             <Stop offset="1" stopColor="#bfe6fb" />
// //           </LinearGradient>
// //         </Defs>
// //         <Rect width="10" height="10" fill="url(#mapSky)" />
// //       </Svg>

// //       {/* top foliage */}
// //       <Svg width={W} height={110} viewBox="0 0 400 110" style={{ position: 'absolute', top: 0, left: 0 }}>
// //         <Ellipse cx="20" cy="10" rx="110" ry="62" fill="#4aae3a" />
// //         <Ellipse cx="70" cy="-6" rx="80" ry="55" fill="#5bbb43" />
// //         <Ellipse cx="395" cy="8" rx="110" ry="60" fill="#58b843" />
// //         <Ellipse cx="340" cy="-8" rx="80" ry="52" fill="#66c64a" />
// //       </Svg>

// //       {/* clouds */}
// //       <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', top: 0, left: 0 }}>
// //         <Cloud x={W * 0.14} y={H * 0.3} s={0.55} />
// //         <Cloud x={W * 0.88} y={H * 0.2} s={0.42} />
// //         <Cloud x={W * 0.9} y={H * 0.42} s={0.38} />
// //         <Cloud x={W * 0.1} y={H * 0.5} s={0.4} />
// //       </Svg>

// //       {/* fence (behind level 5, down to the grass) */}
// //       <Svg width={W} height={fh} viewBox={`0 0 ${W} ${fh}`} style={{ position: 'absolute', left: 0, top: fenceTop }}>
// //         {Array.from({ length: pickets }).map((_, i) => {
// //           const x = i * 46 - 8;
// //           return (
// //             <G key={i}>
// //               <Polygon points={`${x},16 ${x + 15},0 ${x + 30},16`} fill="#f0b563" stroke="#c98a3e" strokeWidth="2" />
// //               <Rect x={x} y="16" width="30" height={fh} fill="#f0b563" stroke="#c98a3e" strokeWidth="2" />
// //               <Circle cx={x + 15} cy={fh * 0.3} r="2" fill="#a86a2a" />
// //               <Circle cx={x + 15} cy={fh * 0.78} r="2" fill="#a86a2a" />
// //             </G>
// //           );
// //         })}
// //         <Rect x="0" y={fh * 0.28} width={W} height="8" fill="#f4c27a" stroke="#c98a3e" strokeWidth="2" />
// //         <Rect x="0" y={fh * 0.62} width={W} height="8" fill="#f4c27a" stroke="#c98a3e" strokeWidth="2" />
// //       </Svg>

// //       {/* bushes on the left (behind the cat) */}
// //       <Svg width={120} height={190} viewBox="0 0 120 190" style={{ position: 'absolute', left: 0, top: groundTop - 176 }}>
// //         <Ellipse cx="22" cy="100" rx="26" ry="88" fill="#46ad33" />
// //         <Ellipse cx="62" cy="130" rx="24" ry="62" fill="#5cbb3c" />
// //         <Ellipse cx="14" cy="165" rx="40" ry="34" fill="#4fb12c" />
// //       </Svg>

// //       {/* bookshelf + plant on the right */}
// //       <View style={{ position: 'absolute', right: 0, top: shelfTop, width: 74 }}>
// //         <View style={{ alignItems: 'center', marginBottom: -2 }}>
// //           <Svg width={64} height={74} viewBox="0 0 60 70">
// //             <G fill="#4cb04a">
// //               <Ellipse cx="30" cy="28" rx="9" ry="26" transform="rotate(-28 30 50)" />
// //               <Ellipse cx="30" cy="24" rx="9" ry="28" fill="#3a9a3c" />
// //               <Ellipse cx="30" cy="28" rx="9" ry="26" transform="rotate(28 30 50)" />
// //             </G>
// //             <Rect x="12" y="52" width="36" height="9" rx="2" fill="#e8903a" />
// //             <Polygon points="15,61 45,61 42,70 18,70" fill="#f0a050" />
// //           </Svg>
// //         </View>
// //         <View style={{ height: 276, backgroundColor: '#eaa24f', borderTopLeftRadius: 4, borderBottomLeftRadius: 4, paddingLeft: 8 }}>
// //           <View style={{ height: 8, backgroundColor: '#f2b866' }} />
// //           <View style={{ height: 76, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingLeft: 6 }}>
// //             <View style={{ width: 14, height: 60, backgroundColor: '#2a9d9d' }} />
// //             <View style={{ width: 13, height: 72, backgroundColor: '#f06ba8' }} />
// //             <View style={{ width: 15, height: 58, backgroundColor: '#8a63da' }} />
// //           </View>
// //           <View style={{ height: 8, backgroundColor: '#f2b866' }} />
// //           <View style={{ height: 76, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingLeft: 6 }}>
// //             <View style={{ width: 13, height: 58, backgroundColor: '#e5484d' }} />
// //             <View style={{ width: 11, height: 68, backgroundColor: '#3b82e0' }} />
// //             <View style={{ width: 16, height: 60, backgroundColor: '#4caf50' }} />
// //           </View>
// //           <View style={{ height: 8, backgroundColor: '#f2b866' }} />
// //           <View style={{ height: 76, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingLeft: 6 }}>
// //             <View style={{ width: 14, height: 54, backgroundColor: '#f5c518' }} />
// //             <View style={{ width: 15, height: 68, backgroundColor: '#2c6fdc' }} />
// //             <View style={{ width: 13, height: 50, backgroundColor: '#f08a2c' }} />
// //           </View>
// //         </View>
// //       </View>

// //       {/* cat peeking from the bush (the grass covers its bottom) */}
// //       <View style={{ position: 'absolute', left: 2, top: groundTop - 92 }}>
// //         <Cat />
// //       </View>

// //       {/* short grass strip at the bottom */}
// //       <Svg width={W} height={gH} viewBox={`0 0 ${W} ${gH}`} style={{ position: 'absolute', left: 0, top: gTop }}>
// //         <Path d={`M0 18 C ${W * 0.25} 2 ${W * 0.7} 4 ${W} 14 L ${W} ${gH} L 0 ${gH} Z`} fill="#8fe03a" />
// //         <Path d={`M0 ${gH * 0.5} C ${W * 0.3} ${gH * 0.42} ${W * 0.7} ${gH * 0.46} ${W} ${gH * 0.44} L ${W} ${gH} L 0 ${gH} Z`} fill="#7dd33f" />
// //         <Tuft x={W * 0.3} y={gH * 0.55} />
// //         <Tuft x={W * 0.62} y={gH * 0.45} />
// //         <Tuft x={W * 0.52} y={gH * 0.85} />
// //         <Flower x={W * 0.12} y={gH * 0.8} s={1.2} />
// //         <Flower x={W * 0.4} y={gH * 0.62} s={0.95} />
// //         <Flower x={W * 0.78} y={gH * 0.78} s={1.1} />
// //         <Flower x={W * 0.9} y={gH * 0.5} s={0.85} />
// //       </Svg>
// //     </View>
// //   );
// // }

// // /* =========================================================
// //    SCREEN
// // ========================================================= */

// // export default function BTLevelMapScreen({ playerId, hints, onBack, onPlay }: Props) {
// //   const { width, height } = useWindowDimensions();
// //   const W = Math.min(width, 460);
// //   const H = height;

// //   /* layout: level 5 ends right above a short grass strip (like the design) */
// //   const groundH = Math.max(100, Math.min(125, H * 0.15));
// //   const groundTop = H - groundH;                 // where the grass starts
// //   const rowsBottom = groundTop + 6;              // level 5 bottom (slightly over the grass)
// //   const free = rowsBottom - ROWS_TOP;
// //   const rowH = Math.max(52, Math.min(84, (free / PER_PAGE) * 0.88));
// //   const gap = Math.max(4, (free - PER_PAGE * rowH) / (PER_PAGE - 1));
// //   const l5Top = ROWS_TOP + 4 * (rowH + gap);
// //   const fenceTop = l5Top + rowH * 0.1;

// //   const [map, setMap] = useState<LevelMap | null>(null);
// //   const [page, setPage] = useState(0);
// //   const [toast, setToast] = useState('');
// //   const [busy, setBusy] = useState(false);
// //   const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
// //   const pulse = useRef(new Animated.Value(0)).current;
// //   const sway = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     const p = Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
// //         Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
// //       ])
// //     );
// //     const s = Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //         Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //       ])
// //     );
// //     p.start(); s.start();
// //     return () => { p.stop(); s.stop(); };
// //   }, [pulse, sway]);
// //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// //   const showToast = (m: string) => {
// //     setToast(m);
// //     if (timer.current) clearTimeout(timer.current);
// //     timer.current = setTimeout(() => setToast(''), 2400);
// //   };

// //   useFocusEffect(
// //     useCallback(() => {
// //       let alive = true;
// //       getMap(playerId)
// //         .then((m) => { if (alive) setMap(m); })
// //         .catch((e: any) => alive && showToast(e.message || 'Could not load levels'));
// //       return () => { alive = false; };
// //     }, [playerId])
// //   );

// //   const tap = async (l: MapLevel) => {
// //     if (busy) return;
// //     if (l.status === 'soon') return showToast('Coming soon!');
// //     setBusy(true);
// //     try {
// //       await openLevel(playerId, l.n);
// //       onPlay(l.n);
// //     } catch (e: any) {
// //       showToast(e.message || 'Cannot open level');
// //       if (e.map) setMap(e.map);
// //     } finally {
// //       setBusy(false);
// //     }
// //   };

// //   if (!map) {
// //     return (
// //       <View style={[st.root, { justifyContent: 'center', alignItems: 'center' }]}>
// //         <ActivityIndicator size="large" color="#fff" />
// //       </View>
// //     );
// //   }

// //   const all = map.levels.slice(0, MAX_LEVEL);
// //   const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
// //   const shown = all.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
// //   const first = page * PER_PAGE + 1;
// //   const last = Math.min(first + PER_PAGE - 1, all.length);
// //   const hasNext = page < pages - 1;
// //   const hasPrev = page > 0;

// //   const earned = map.levels.reduce((sum, l) => sum + (l.stars || 0), 0);
// //   const counter = typeof hints === 'number' ? hints : earned;
// //   const pillW = Math.min(W * 0.62, 280);

// //   const row = (l: MapLevel) => {
// //     const soon = l.status === 'soon';
// //     const done = l.status === 'completed';
// //     const cur = l.status === 'current';
// //     const scale = cur ? pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }) : 1;

// //     return (
// //       <View key={l.n} style={{ height: rowH, marginBottom: gap, justifyContent: 'center' }}>
// //         {cur && (
// //           <>
// //             <View style={{ position: 'absolute', left: -38, top: 2 }} pointerEvents="none"><Sparkle /></View>
// //             <View style={{ position: 'absolute', right: -38, top: 2 }} pointerEvents="none"><Sparkle flip /></View>
// //           </>
// //         )}
// //         <TouchableOpacity activeOpacity={0.85} onPress={() => tap(l)}>
// //           <Animated.View style={[st.pillOuter, { height: rowH, borderRadius: rowH / 2 }, soon && { opacity: 0.6 }, { transform: [{ scale }] }]}>
// //             <View style={[st.pillInner, { borderRadius: rowH / 2 }, cur && { backgroundColor: GOLD }]}>
// //               <View style={st.gloss} pointerEvents="none" />
// //               <Text style={[st.pillT, { fontSize: Math.round(rowH * 0.38) }]}>LEVEL {l.n}</Text>
// //               {done && (
// //                 <View style={st.starRow}>
// //                   {[0, 1, 2].map((s) => (
// //                     <Text key={s} style={{ fontSize: 13, color: s < l.stars ? '#f5a500' : '#d9c9a8' }}>★</Text>
// //                   ))}
// //                 </View>
// //               )}
// //             </View>
// //           </Animated.View>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   };

// //   return (
// //     <View style={st.root}>
// //       <View style={{ width: W, flex: 1, alignSelf: 'center' }}>
// //         <Background W={W} H={H} groundTop={groundTop} fenceTop={fenceTop} />

// //         {/* 5 levels of the current page */}
// //         <View style={{ paddingTop: ROWS_TOP, alignItems: 'center' }}>
// //           <View style={{ width: pillW }}>
// //             {shown.map((l) => row(l))}
// //           </View>
// //         </View>

// //         {/* header */}
// //         <View style={st.header} pointerEvents="box-none">
// //           <View style={st.leftBtns}>
// //             <TouchableOpacity style={st.roundBtn} activeOpacity={0.85} onPress={onBack}>
// //               <HomeIcon s={22} />
// //             </TouchableOpacity>
// //             <TouchableOpacity style={st.roundBtn} activeOpacity={0.85}>
// //               <GearIcon s={23} />
// //             </TouchableOpacity>
// //           </View>

// //           <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
// //             <Chain h={30} style={{ left: 24, top: -6 }} />
// //             <Chain h={30} style={{ right: 24, top: -6 }} />
// //             <View style={st.sign}>
// //               <Text style={st.signArrow}>{'<'}</Text>
// //               <Text style={st.signT}>LEVELS</Text>
// //               <Text style={st.signArrow}>{'>'}</Text>
// //             </View>
// //           </Animated.View>

// //           <View style={st.counterWrap}>
// //             <View style={st.counter}>
// //               <Text style={st.counterT} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{counter}</Text>
// //             </View>
// //             <View style={st.counterIcon}>
// //               <Icon n="bulb" s={32} />
// //             </View>
// //           </View>
// //         </View>

// //         {/* previous page (bottom left) */}
// //         {hasPrev && (
// //           <TouchableOpacity style={[st.playBtn, { left: 14 }]} activeOpacity={0.85} onPress={() => setPage(page - 1)}>
// //             <ArrowIcon s={30} dir="left" />
// //           </TouchableOpacity>
// //         )}

// //         {/* next page (bottom right, like the design) */}
// //         {hasNext && (
// //           <TouchableOpacity style={[st.playBtn, { right: 14 }]} activeOpacity={0.85} onPress={() => setPage(page + 1)}>
// //             <ArrowIcon s={30} dir="right" />
// //           </TouchableOpacity>
// //         )}

// //         {/* page label */}
// //         <View style={st.pageLabel} pointerEvents="none">
// //           <Text style={st.pageLabelT}>{first} - {last}</Text>
// //         </View>

// //         {!!toast && (
// //           <View style={[st.toast, { top: HEADER_H + 4, width: W * 0.84, alignSelf: 'center' }]}>
// //             <Text style={st.toastT}>{toast}</Text>
// //           </View>
// //         )}
// //       </View>
// //     </View>
// //   );
// // }

// // const st = StyleSheet.create({
// //   root: { flex: 1, backgroundColor: '#3fb2f7' },

// //   header: {
// //     position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H,
// //     flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
// //     paddingHorizontal: 12, paddingTop: 14, zIndex: 10,
// //   },
// //   leftBtns: { flexDirection: 'row', gap: 8 },
// //   roundBtn: {
// //     width: 44, height: 44, borderRadius: 22, backgroundColor: YEL, borderWidth: 3, borderColor: YEL_D,
// //     alignItems: 'center', justifyContent: 'center', elevation: 3,
// //   },
// //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 10 },
// //   sign: {
// //     flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, height: 48,
// //     borderRadius: 8, backgroundColor: SIGN, borderWidth: 3, borderColor: WOOD_DD, elevation: 3,
// //   },
// //   signT: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
// //   signArrow: { fontSize: 24, fontWeight: '900', color: '#ffc533' },

// //   // hint counter (cream pill + bulb)
// //   counterWrap: { width: 74, height: 40, marginTop: 4, justifyContent: 'center' },
// //   counter: {
// //     width: 62, height: 30, borderRadius: 15, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed',
// //     borderColor: '#d8c8a8', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 12, paddingRight: 6, elevation: 3,
// //   },
// //   counterT: { fontSize: 17, fontWeight: '900', color: NAVY, width: 36 },
// //   counterIcon: { position: 'absolute', right: 0, top: -2 },

// //   // level pills (height / radius are set inline from rowH)
// //   pillOuter: {
// //     backgroundColor: WOOD_D, padding: 4,
// //     shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 4,
// //   },
// //   pillInner: {
// //     flex: 1, backgroundColor: CREAM_IN, borderWidth: 2, borderColor: '#f3b95e',
// //     alignItems: 'center', justifyContent: 'center', flexDirection: 'row', overflow: 'hidden',
// //   },
// //   gloss: {
// //     position: 'absolute', top: 3, left: 14, right: 14, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.55)',
// //   },
// //   pillT: { fontWeight: '900', color: NAVY, letterSpacing: 0.5 },
// //   starRow: { position: 'absolute', right: 16, flexDirection: 'row' },

// //   // page buttons (bottom corners, on the grass)
// //   playBtn: {
// //     position: 'absolute', bottom: 20, width: BTN, height: BTN, borderRadius: BTN / 2,
// //     backgroundColor: CREAM, borderWidth: 5, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center',
// //     elevation: 8, zIndex: 12,
// //     shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
// //   },

// //   pageLabel: {
// //     position: 'absolute', bottom: 38, alignSelf: 'center', height: 30, paddingHorizontal: 16, borderRadius: 15,
// //     backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8',
// //     alignItems: 'center', justifyContent: 'center', elevation: 3, zIndex: 12,
// //   },
// //   pageLabelT: { color: NAVY, fontSize: 14, fontWeight: '900' },

// //   toast: {
// //     position: 'absolute', paddingVertical: 10, borderRadius: 30,
// //     backgroundColor: 'rgba(45,25,10,0.92)', borderWidth: 2, borderColor: '#8a6a45', zIndex: 20,
// //   },
// //   toastT: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
// // });
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, Animated, Easing,
//   StyleSheet, ActivityIndicator, useWindowDimensions,
// } from 'react-native';
// import Svg, { Rect, Circle, Ellipse, G, Polygon, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
// import { useFocusEffect } from '@react-navigation/native';
// import { Icon } from './Art';
// import { getMap, openLevel, LevelMap, MapLevel } from './mapApi';

// /* palette */
// const NAVY = '#13235b';
// const CREAM = '#faf0e2';
// const CREAM_IN = '#fbeedb';
// const WOOD_D = '#c2782c';
// const WOOD_DD = '#8f5a1f';
// const SIGN = '#bd6b29';
// const YEL = '#fbc02d';
// const YEL_D = '#d98e1c';
// const GOLD = '#fdd23a';

// const HEADER_H = 100;
// const ROWS_TOP = HEADER_H + 10;
// const PER_PAGE = 5;
// const MAX_LEVEL = 50;
// const BTN = 66;

// type Props = { playerId: number; hints?: number; onBack: () => void; onPlay: (n: number) => void };

// /* ---------- small drawings ---------- */
// function Cloud({ x, y, s = 1 }: any) {
//   return (
//     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
//       <Ellipse cx="0" cy="0" rx="70" ry="26" />
//       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
//       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
//     </G>
//   );
// }

// function Chain({ h = 30, style }: { h?: number; style?: any }) {
//   const n = Math.max(2, Math.round(h / 8));
//   return (
//     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
//       {Array.from({ length: n }).map((_, i) => (
//         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
//       ))}
//     </Svg>
//   );
// }

// function HomeIcon({ s = 22 }: { s?: number }) {
//   return (
//     <Svg width={s} height={s} viewBox="0 0 24 24">
//       <Path d="M12 3 L2 12 H5 V21 H10 V15 H14 V21 H19 V12 H22 Z" fill={NAVY} stroke={NAVY} strokeWidth="1.5" strokeLinejoin="round" />
//     </Svg>
//   );
// }

// function GearIcon({ s = 23 }: { s?: number }) {
//   const teeth = [0, 45, 90, 135, 180, 225, 270, 315];
//   return (
//     <Svg width={s} height={s} viewBox="0 0 24 24">
//       <G transform="translate(12 12)">
//         {teeth.map((a) => (
//           <Rect key={a} x="-2" y="-11" width="4" height="6" rx="1" fill={NAVY} transform={`rotate(${a})`} />
//         ))}
//         <Circle r="7.5" fill={NAVY} />
//         <Circle r="3" fill={YEL} />
//       </G>
//     </Svg>
//   );
// }

// function ArrowIcon({ s = 28, dir = 'right' }: { s?: number; dir?: 'left' | 'right' }) {
//   const pts = dir === 'right' ? '25,12 88,50 25,88' : '75,12 12,50 75,88';
//   return (
//     <Svg width={s} height={s} viewBox="0 0 100 100">
//       <Polygon points={pts} fill={NAVY} stroke={NAVY} strokeWidth="8" strokeLinejoin="round" />
//     </Svg>
//   );
// }

// function Sparkle({ flip }: { flip?: boolean }) {
//   return (
//     <Svg width={34} height={34} viewBox="0 0 34 34" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
//       <Polygon points="6,4 14,2 20,14 12,16" fill={GOLD} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
//       <Polygon points="2,22 18,20 18,28 2,30" fill={GOLD} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
//     </Svg>
//   );
// }

// function Cat({ size = 92 }: { size?: number }) {
//   return (
//     <Svg width={size} height={size} viewBox="0 0 100 100">
//       <Polygon points="14,38 18,10 38,26" fill="#fdf1ea" />
//       <Polygon points="19,32 21,18 31,27" fill="#f6a5ae" />
//       <Polygon points="86,38 82,10 62,26" fill="#fdf1ea" />
//       <Rect x="10" y="24" width="80" height="70" rx="32" fill="#fdf1ea" />
//       <Circle cx="34" cy="52" r="4.5" fill="#3a2a2a" />
//       <Circle cx="66" cy="52" r="4.5" fill="#3a2a2a" />
//       <Ellipse cx="22" cy="63" rx="9" ry="6" fill="#f6a5ae" />
//       <Ellipse cx="78" cy="63" rx="9" ry="6" fill="#f6a5ae" />
//       <Path d="M43 62 Q50 72 57 62" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
//     </Svg>
//   );
// }

// function Flower({ x, y, s = 1 }: any) {
//   return (
//     <G transform={`translate(${x} ${y}) scale(${s})`}>
//       {[0, 72, 144, 216, 288].map((a) => (
//         <Ellipse key={a} cx="0" cy="-9" rx="6" ry="8" fill="#fff" transform={`rotate(${a})`} />
//       ))}
//       <Circle cx="0" cy="0" r="5" fill="#ffd33d" />
//     </G>
//   );
// }

// function Tuft({ x, y }: any) {
//   return (
//     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
//       <Polygon points="-8,0 -4,-16 0,0" />
//       <Polygon points="-2,0 3,-22 8,0" />
//       <Polygon points="5,0 10,-14 14,0" />
//     </G>
//   );
// }

// /* ---------- background ---------- */
// function Background({ W, H, groundTop, fenceTop }: { W: number; H: number; groundTop: number; fenceTop: number }) {
//   const pickets = Math.ceil(W / 46) + 1;
//   const fh = groundTop - fenceTop + 6;
//   const gTop = groundTop - 16;
//   const gH = H - gTop;
//   const shelfTop = groundTop - 350;
//   const catSize = Math.min(92, W * 0.21);

//   return (
//     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
//       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
//         <Defs>
//           <LinearGradient id="mapSky" x1="0" y1="0" x2="0" y2="1">
//             <Stop offset="0" stopColor="#3fb2f7" />
//             <Stop offset="1" stopColor="#bfe6fb" />
//           </LinearGradient>
//         </Defs>
//         <Rect width="10" height="10" fill="url(#mapSky)" />
//       </Svg>

//       {/* top foliage */}
//       <Svg width={W} height={110} viewBox="0 0 400 110" style={{ position: 'absolute', top: 0, left: 0 }}>
//         <Ellipse cx="20" cy="10" rx="110" ry="62" fill="#4aae3a" />
//         <Ellipse cx="70" cy="-6" rx="80" ry="55" fill="#5bbb43" />
//         <Ellipse cx="395" cy="8" rx="110" ry="60" fill="#58b843" />
//         <Ellipse cx="340" cy="-8" rx="80" ry="52" fill="#66c64a" />
//       </Svg>

//       {/* clouds */}
//       <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', top: 0, left: 0 }}>
//         <Cloud x={W * 0.14} y={H * 0.3} s={0.55} />
//         <Cloud x={W * 0.88} y={H * 0.2} s={0.42} />
//         <Cloud x={W * 0.9} y={H * 0.42} s={0.38} />
//         <Cloud x={W * 0.1} y={H * 0.5} s={0.4} />
//       </Svg>

//       {/* fence */}
//       <Svg width={W} height={fh} viewBox={`0 0 ${W} ${fh}`} style={{ position: 'absolute', left: 0, top: fenceTop }}>
//         {Array.from({ length: pickets }).map((_, i) => {
//           const x = i * 46 - 8;
//           return (
//             <G key={i}>
//               <Polygon points={`${x},16 ${x + 15},0 ${x + 30},16`} fill="#f0b563" stroke="#c98a3e" strokeWidth="2" />
//               <Rect x={x} y="16" width="30" height={fh} fill="#f0b563" stroke="#c98a3e" strokeWidth="2" />
//               <Circle cx={x + 15} cy={fh * 0.3} r="2" fill="#a86a2a" />
//               <Circle cx={x + 15} cy={fh * 0.78} r="2" fill="#a86a2a" />
//             </G>
//           );
//         })}
//         <Rect x="0" y={fh * 0.28} width={W} height="8" fill="#f4c27a" stroke="#c98a3e" strokeWidth="2" />
//         <Rect x="0" y={fh * 0.62} width={W} height="8" fill="#f4c27a" stroke="#c98a3e" strokeWidth="2" />
//       </Svg>

//       {/* tall bushes on the left (behind the cat) */}
//       <Svg width={120} height={190} viewBox="0 0 120 190" style={{ position: 'absolute', left: 0, top: groundTop - 176 }}>
//         <Ellipse cx="22" cy="100" rx="26" ry="88" fill="#46ad33" />
//         <Ellipse cx="62" cy="130" rx="24" ry="62" fill="#5cbb3c" />
//       </Svg>

//       {/* bookshelf + plant on the right */}
//       <View style={{ position: 'absolute', right: 0, top: shelfTop, width: 74 }}>
//         <View style={{ alignItems: 'center', marginBottom: -2 }}>
//           <Svg width={64} height={74} viewBox="0 0 60 70">
//             <G fill="#4cb04a">
//               <Ellipse cx="30" cy="28" rx="9" ry="26" transform="rotate(-28 30 50)" />
//               <Ellipse cx="30" cy="24" rx="9" ry="28" fill="#3a9a3c" />
//               <Ellipse cx="30" cy="28" rx="9" ry="26" transform="rotate(28 30 50)" />
//             </G>
//             <Rect x="12" y="52" width="36" height="9" rx="2" fill="#e8903a" />
//             <Polygon points="15,61 45,61 42,70 18,70" fill="#f0a050" />
//           </Svg>
//         </View>
//         <View style={{ height: 276, backgroundColor: '#eaa24f', borderTopLeftRadius: 4, borderBottomLeftRadius: 4, paddingLeft: 8 }}>
//           <View style={{ height: 8, backgroundColor: '#f2b866' }} />
//           <View style={{ height: 76, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingLeft: 6 }}>
//             <View style={{ width: 14, height: 60, backgroundColor: '#2a9d9d' }} />
//             <View style={{ width: 13, height: 72, backgroundColor: '#f06ba8' }} />
//             <View style={{ width: 15, height: 58, backgroundColor: '#8a63da' }} />
//           </View>
//           <View style={{ height: 8, backgroundColor: '#f2b866' }} />
//           <View style={{ height: 76, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingLeft: 6 }}>
//             <View style={{ width: 13, height: 58, backgroundColor: '#e5484d' }} />
//             <View style={{ width: 11, height: 68, backgroundColor: '#3b82e0' }} />
//             <View style={{ width: 16, height: 60, backgroundColor: '#4caf50' }} />
//           </View>
//           <View style={{ height: 8, backgroundColor: '#f2b866' }} />
//           <View style={{ height: 76, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingLeft: 6 }}>
//             <View style={{ width: 14, height: 54, backgroundColor: '#f5c518' }} />
//             <View style={{ width: 15, height: 68, backgroundColor: '#2c6fdc' }} />
//             <View style={{ width: 13, height: 50, backgroundColor: '#f08a2c' }} />
//           </View>
//         </View>
//       </View>

//       {/* cat peeking over the front bush (left of the level pills) */}
//       <View style={{ position: 'absolute', left: 2, top: groundTop - catSize * 0.85 }}>
//         <Cat size={catSize} />
//       </View>

//       {/* front bush that hides the cat's body */}
//       <Svg width={110} height={60} viewBox="0 0 110 60" style={{ position: 'absolute', left: 0, top: groundTop - 30 }}>
//         <Ellipse cx="38" cy="38" rx="50" ry="28" fill="#4fb12c" />
//         <Ellipse cx="82" cy="44" rx="34" ry="22" fill="#5cbb3c" />
//       </Svg>

//       {/* grass strip at the bottom */}
//       <Svg width={W} height={gH} viewBox={`0 0 ${W} ${gH}`} style={{ position: 'absolute', left: 0, top: gTop }}>
//         <Path d={`M0 18 C ${W * 0.25} 2 ${W * 0.7} 4 ${W} 14 L ${W} ${gH} L 0 ${gH} Z`} fill="#8fe03a" />
//         <Path d={`M0 ${gH * 0.5} C ${W * 0.3} ${gH * 0.42} ${W * 0.7} ${gH * 0.46} ${W} ${gH * 0.44} L ${W} ${gH} L 0 ${gH} Z`} fill="#7dd33f" />
//         <Tuft x={W * 0.3} y={gH * 0.55} />
//         <Tuft x={W * 0.62} y={gH * 0.45} />
//         <Tuft x={W * 0.52} y={gH * 0.85} />
//         <Flower x={W * 0.12} y={gH * 0.8} s={1.2} />
//         <Flower x={W * 0.4} y={gH * 0.62} s={0.95} />
//         <Flower x={W * 0.78} y={gH * 0.78} s={1.1} />
//         <Flower x={W * 0.9} y={gH * 0.5} s={0.85} />
//       </Svg>
//     </View>
//   );
// }

// /* =========================================================
//    SCREEN
// ========================================================= */

// export default function BTLevelMapScreen({ playerId, hints, onBack, onPlay }: Props) {
//   const { width, height } = useWindowDimensions();
//   const W = Math.min(width, 460);
//   const H = height;

//   /* layout: level 5 ends right above a short grass strip (like the design) */
//   const groundH = Math.max(100, Math.min(125, H * 0.15));
//   const groundTop = H - groundH;
//   const rowsBottom = groundTop + 6;
//   const free = rowsBottom - ROWS_TOP;
//   const rowH = Math.max(52, Math.min(74, (free / PER_PAGE) * 0.88));
//   const gap = Math.max(4, (free - PER_PAGE * rowH) / (PER_PAGE - 1));
//   const l5Top = ROWS_TOP + 4 * (rowH + gap);
//   const fenceTop = l5Top + rowH * 0.1;

//   const [map, setMap] = useState<LevelMap | null>(null);
//   const [page, setPage] = useState(0);
//   const [toast, setToast] = useState('');
//   const [busy, setBusy] = useState(false);
//   const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const pulse = useRef(new Animated.Value(0)).current;
//   const sway = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const p = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
//         Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
//       ])
//     );
//     const s = Animated.loop(
//       Animated.sequence([
//         Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//         Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//       ])
//     );
//     p.start(); s.start();
//     return () => { p.stop(); s.stop(); };
//   }, [pulse, sway]);
//   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

//   const showToast = (m: string) => {
//     setToast(m);
//     if (timer.current) clearTimeout(timer.current);
//     timer.current = setTimeout(() => setToast(''), 2400);
//   };

//   useFocusEffect(
//     useCallback(() => {
//       let alive = true;
//       getMap(playerId)
//         .then((m) => { if (alive) setMap(m); })
//         .catch((e: any) => alive && showToast(e.message || 'Could not load levels'));
//       return () => { alive = false; };
//     }, [playerId])
//   );

//   const tap = async (l: MapLevel) => {
//     if (busy) return;
//     if (l.status === 'soon') return showToast('Coming soon!');
//     setBusy(true);
//     try {
//       await openLevel(playerId, l.n);
//       onPlay(l.n);
//     } catch (e: any) {
//       showToast(e.message || 'Cannot open level');
//       if (e.map) setMap(e.map);
//     } finally {
//       setBusy(false);
//     }
//   };

//   if (!map) {
//     return (
//       <View style={[st.root, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color="#fff" />
//       </View>
//     );
//   }

//   const all = map.levels.slice(0, MAX_LEVEL);
//   const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
//   const shown = all.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
//   const hasNext = page < pages - 1;
//   const hasPrev = page > 0;

//   const earned = map.levels.reduce((sum, l) => sum + (l.stars || 0), 0);
//   const counter = typeof hints === 'number' ? hints : earned;
//   const pillW = Math.min(W * 0.54, 250);

//   const row = (l: MapLevel) => {
//     const soon = l.status === 'soon';
//     const done = l.status === 'completed';
//     const cur = l.status === 'current';
//     const scale = cur ? pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }) : 1;

//     return (
//       <View key={l.n} style={{ height: rowH, marginBottom: gap, justifyContent: 'center' }}>
//         {cur && (
//           <>
//             <View style={{ position: 'absolute', left: -38, top: 2 }} pointerEvents="none"><Sparkle /></View>
//             <View style={{ position: 'absolute', right: -38, top: 2 }} pointerEvents="none"><Sparkle flip /></View>
//           </>
//         )}
//         <TouchableOpacity activeOpacity={0.85} onPress={() => tap(l)}>
//           <Animated.View style={[st.pillOuter, { height: rowH, borderRadius: rowH / 2 }, soon && { opacity: 0.6 }, { transform: [{ scale }] }]}>
//             <View style={[st.pillInner, { borderRadius: rowH / 2 }, cur && { backgroundColor: GOLD }]}>
//               <View style={st.gloss} pointerEvents="none" />
//               <Text style={[st.pillT, { fontSize: Math.round(rowH * 0.36), marginTop: done ? -8 : 0 }]}>LEVEL {l.n}</Text>
//               {done && (
//                 <View style={st.starRow} pointerEvents="none">
//                   {[0, 1, 2].map((s) => (
//                     <Text key={s} style={{ fontSize: 11, color: s < l.stars ? '#f5a500' : '#d9c9a8' }}>★</Text>
//                   ))}
//                 </View>
//               )}
//             </View>
//           </Animated.View>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <View style={st.root}>
//       <View style={{ width: W, flex: 1, alignSelf: 'center' }}>
//         <Background W={W} H={H} groundTop={groundTop} fenceTop={fenceTop} />

//         {/* 5 levels of the current page */}
//         <View style={{ paddingTop: ROWS_TOP, alignItems: 'center' }}>
//           <View style={{ width: pillW }}>
//             {shown.map((l) => row(l))}
//           </View>
//         </View>

//         {/* header */}
//         <View style={st.header} pointerEvents="box-none">
//           <View style={st.leftBtns}>
//             <TouchableOpacity style={st.roundBtn} activeOpacity={0.85} onPress={onBack}>
//               <HomeIcon s={22} />
//             </TouchableOpacity>
//             <TouchableOpacity style={st.roundBtn} activeOpacity={0.85}>
//               <GearIcon s={23} />
//             </TouchableOpacity>
//           </View>

//           <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
//             <Chain h={30} style={{ left: 24, top: -6 }} />
//             <Chain h={30} style={{ right: 24, top: -6 }} />
//             <View style={st.sign}>
//               <Text style={st.signArrow}>{'<'}</Text>
//               <Text style={st.signT}>LEVELS</Text>
//               <Text style={st.signArrow}>{'>'}</Text>
//             </View>
//           </Animated.View>

//           <View style={st.counterWrap}>
//             <View style={st.counter}>
//               <Text style={st.counterT} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{counter}</Text>
//             </View>
//             <View style={st.counterIcon}>
//               <Icon n="bulb" s={32} />
//             </View>
//           </View>
//         </View>

//         {/* previous page (bottom left) */}
//         {hasPrev && (
//           <TouchableOpacity style={[st.playBtn, { left: 14 }]} activeOpacity={0.85} onPress={() => setPage(page - 1)}>
//             <ArrowIcon s={30} dir="left" />
//           </TouchableOpacity>
//         )}

//         {/* next page (bottom right, like the design) */}
//         {hasNext && (
//           <TouchableOpacity style={[st.playBtn, { right: 14 }]} activeOpacity={0.85} onPress={() => setPage(page + 1)}>
//             <ArrowIcon s={30} dir="right" />
//           </TouchableOpacity>
//         )}

//         {!!toast && (
//           <View style={[st.toast, { top: HEADER_H + 4, width: W * 0.84, alignSelf: 'center' }]}>
//             <Text style={st.toastT}>{toast}</Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// }

// const st = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#3fb2f7' },

//   header: {
//     position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H,
//     flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
//     paddingHorizontal: 12, paddingTop: 14, zIndex: 10,
//   },
//   leftBtns: { flexDirection: 'row', gap: 8 },
//   roundBtn: {
//     width: 44, height: 44, borderRadius: 22, backgroundColor: YEL, borderWidth: 3, borderColor: YEL_D,
//     alignItems: 'center', justifyContent: 'center', elevation: 3,
//   },
//   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 10 },
//   sign: {
//     flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, height: 48,
//     borderRadius: 8, backgroundColor: SIGN, borderWidth: 3, borderColor: WOOD_DD, elevation: 3,
//   },
//   signT: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
//   signArrow: { fontSize: 24, fontWeight: '900', color: '#ffc533' },

//   // hint counter (cream pill + bulb)
//   counterWrap: { width: 74, height: 40, marginTop: 4, justifyContent: 'center' },
//   counter: {
//     width: 62, height: 30, borderRadius: 15, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed',
//     borderColor: '#d8c8a8', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 12, paddingRight: 6, elevation: 3,
//   },
//   counterT: { fontSize: 17, fontWeight: '900', color: NAVY, width: 36 },
//   counterIcon: { position: 'absolute', right: 0, top: -2 },

//   // level pills (height / radius are set inline from rowH)
//   pillOuter: {
//     backgroundColor: WOOD_D, padding: 4,
//     shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 4,
//   },
//   pillInner: {
//     flex: 1, backgroundColor: CREAM_IN, borderWidth: 2, borderColor: '#f3b95e',
//     alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
//   },
//   gloss: {
//     position: 'absolute', top: 3, left: 14, right: 14, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.55)',
//   },
//   pillT: { fontWeight: '900', color: NAVY, letterSpacing: 0.5 },
//   starRow: { position: 'absolute', bottom: 3, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },

//   // page buttons (bottom corners, on the grass)
//   playBtn: {
//     position: 'absolute', bottom: 20, width: BTN, height: BTN, borderRadius: BTN / 2,
//     backgroundColor: CREAM, borderWidth: 5, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center',
//     elevation: 8, zIndex: 12,
//     shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
//   },

//   toast: {
//     position: 'absolute', paddingVertical: 10, borderRadius: 30,
//     backgroundColor: 'rgba(45,25,10,0.92)', borderWidth: 2, borderColor: '#8a6a45', zIndex: 20,
//   },
//   toastT: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
// });
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing,
  StyleSheet, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Circle, Ellipse, G, Polygon, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from './Art';
import { getMap, openLevel, LevelMap, MapLevel } from './mapApi';

/* palette */
const NAVY = '#13235b';
const CREAM = '#faf0e2';
const CREAM_IN = '#fbeedb';
const WOOD_D = '#c2782c';
const WOOD_DD = '#8f5a1f';
const SIGN = '#bd6b29';
const YEL = '#fbc02d';
const YEL_D = '#d98e1c';
const GOLD = '#fdd23a';

const HEADER_H = 100;
const ROWS_TOP = HEADER_H + 10;
const PER_PAGE = 5;
const MAX_LEVEL = 50;
const BTN = 66;

type Props = { playerId: number; hints?: number; onBack: () => void; onPlay: (n: number) => void };

/* ---------- small drawings ---------- */
function Chain({ h = 30, style }: { h?: number; style?: any }) {
  const n = Math.max(2, Math.round(h / 8));
  return (
    <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
      {Array.from({ length: n }).map((_, i) => (
        <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
      ))}
    </Svg>
  );
}

function HomeIcon({ s = 22 }: { s?: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      <Path d="M12 3 L2 12 H5 V21 H10 V15 H14 V21 H19 V12 H22 Z" fill={NAVY} stroke={NAVY} strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  );
}

function GearIcon({ s = 23 }: { s?: number }) {
  const teeth = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      <G transform="translate(12 12)">
        {teeth.map((a) => (
          <Rect key={a} x="-2" y="-11" width="4" height="6" rx="1" fill={NAVY} transform={`rotate(${a})`} />
        ))}
        <Circle r="7.5" fill={NAVY} />
        <Circle r="3" fill={YEL} />
      </G>
    </Svg>
  );
}

function ArrowIcon({ s = 28, dir = 'right' }: { s?: number; dir?: 'left' | 'right' }) {
  const pts = dir === 'right' ? '25,12 88,50 25,88' : '75,12 12,50 75,88';
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      <Polygon points={pts} fill={NAVY} stroke={NAVY} strokeWidth="8" strokeLinejoin="round" />
    </Svg>
  );
}

function Sparkle({ flip }: { flip?: boolean }) {
  return (
    <Svg width={34} height={34} viewBox="0 0 34 34" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
      <Polygon points="6,4 14,2 20,14 12,16" fill={GOLD} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      <Polygon points="2,22 18,20 18,28 2,30" fill={GOLD} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  );
}

/* full sitting cat - head, body, tail, paws all visible (viewBox 100 x 120) */
function Cat({ width = 80 }: { width?: number }) {
  const height = width * 1.2;
  const FUR = '#fdf1ea';
  const EDGE = '#e3c9bb';
  return (
    <Svg width={width} height={height} viewBox="0 0 100 120">
      {/* tail */}
      <Path d="M74 108 C 100 108 100 76 86 72" stroke={EDGE} strokeWidth="12" fill="none" strokeLinecap="round" />
      <Path d="M74 108 C 100 108 100 76 86 72" stroke={FUR} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* body */}
      <Ellipse cx="50" cy="92" rx="27" ry="26" fill={FUR} stroke={EDGE} strokeWidth="2" />
      <Ellipse cx="50" cy="98" rx="14" ry="16" fill="#fff" opacity={0.7} />
      {/* paws */}
      <Ellipse cx="39" cy="115" rx="10" ry="5.5" fill={FUR} stroke={EDGE} strokeWidth="2" />
      <Ellipse cx="61" cy="115" rx="10" ry="5.5" fill={FUR} stroke={EDGE} strokeWidth="2" />
      {/* ears */}
      <Polygon points="14,44 16,10 40,28" fill={FUR} stroke={EDGE} strokeWidth="2" strokeLinejoin="round" />
      <Polygon points="19,38 20,19 32,28" fill="#f6a5ae" />
      <Polygon points="86,44 84,10 60,28" fill={FUR} stroke={EDGE} strokeWidth="2" strokeLinejoin="round" />
      <Polygon points="81,38 80,19 68,28" fill="#f6a5ae" />
      {/* head */}
      <Ellipse cx="50" cy="52" rx="38" ry="31" fill={FUR} stroke={EDGE} strokeWidth="2" />
      {/* eyes */}
      <Circle cx="34" cy="50" r="5" fill="#3a2a2a" />
      <Circle cx="66" cy="50" r="5" fill="#3a2a2a" />
      <Circle cx="35.8" cy="48.2" r="1.7" fill="#fff" />
      <Circle cx="67.8" cy="48.2" r="1.7" fill="#fff" />
      {/* cheeks */}
      <Ellipse cx="23" cy="63" rx="8" ry="5.5" fill="#f6a5ae" />
      <Ellipse cx="77" cy="63" rx="8" ry="5.5" fill="#f6a5ae" />
      {/* nose + mouth */}
      <Polygon points="46,58 54,58 50,63" fill="#f08a99" />
      <Path d="M50 63 Q45 70 40 66 M50 63 Q55 70 60 66" stroke="#3a2a2a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* whiskers */}
      <Path d="M8 56 L24 59 M8 66 L24 64 M92 56 L76 59 M92 66 L76 64" stroke="#b9a094" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function Star({ x, y, s = 1, o = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <Polygon points="0,-6 1.6,-1.6 6,0 1.6,1.6 0,6 -1.6,1.6 -6,0 -1.6,-1.6" fill="#fff6c8" />
    </G>
  );
}

function PuzzlePiece({ x, y, r = 0, s = 1, c = '#ff8fb1' }: any) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={0.9}>
      <Rect x="-12" y="-12" width="24" height="24" rx="3" fill={c} />
      <Circle cx="12" cy="0" r="6" fill={c} />
      <Circle cx="0" cy="-12" r="6" fill={c} />
      <Circle cx="-12" cy="0" r="4.5" fill="#5b2a9e" />
      <Rect x="-8" y="-8" width="10" height="5" rx="2.5" fill="#fff" opacity={0.35} />
    </G>
  );
}

function Cloud({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff" opacity={0.22}>
      <Ellipse cx="0" cy="0" rx="70" ry="26" />
      <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
      <Ellipse cx="22" cy="-12" rx="30" ry="22" />
    </G>
  );
}

function Flower({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <Ellipse key={a} cx="0" cy="-9" rx="6" ry="8" fill="#ffe3f1" transform={`rotate(${a})`} />
      ))}
      <Circle cx="0" cy="0" r="5" fill="#ffd33d" />
    </G>
  );
}

function Tuft({ x, y }: any) {
  return (
    <G transform={`translate(${x} ${y})`} fill="#2f9e6a">
      <Polygon points="-8,0 -4,-16 0,0" />
      <Polygon points="-2,0 3,-22 8,0" />
      <Polygon points="5,0 10,-14 14,0" />
    </G>
  );
}

/* ---------- background : "Dream Night Puzzle Land" ---------- */
function Background({ W, H, groundTop }: { W: number; H: number; groundTop: number }) {
  const gTop = groundTop - 16;
  const gH = H - gTop;

  const stars = [
    [0.12, 0.05, 1.1], [0.3, 0.1, 0.7], [0.55, 0.04, 0.9], [0.72, 0.12, 0.7], [0.93, 0.07, 1],
    [0.06, 0.24, 0.7], [0.94, 0.3, 0.8], [0.08, 0.42, 0.9], [0.92, 0.5, 0.7], [0.5, 0.2, 0.6],
  ];
  const pieces = [
    { x: W * 0.09, y: H * 0.22, r: -18, s: 1.1, c: '#ff8fb1' },
    { x: W * 0.92, y: H * 0.26, r: 20, s: 0.95, c: '#6fe3d6' },
    { x: W * 0.07, y: H * 0.44, r: 12, s: 0.8, c: '#ffd36b' },
    { x: W * 0.93, y: H * 0.47, r: -14, s: 1, c: '#b69bff' },
  ];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* twilight sky */}
      <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="mapSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#1b1464" />
            <Stop offset="0.4" stopColor="#4a2a9a" />
            <Stop offset="0.72" stopColor="#b6529f" />
            <Stop offset="1" stopColor="#ffb38a" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#mapSky)" />
      </Svg>

      {/* stars, moon, clouds, floating puzzle pieces */}
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', top: 0, left: 0 }}>
        {stars.map((s, i) => (
          <Star key={i} x={W * s[0]} y={H * s[1]} s={s[2]} o={0.9} />
        ))}

        {/* crescent moon (behind header, top-right area below counter) */}
        <G transform={`translate(${W * 0.86} ${H * 0.14})`}>
          <Circle r="30" fill="#ffe9a8" opacity={0.15} />
          <Path d="M0 -20 A20 20 0 1 0 0 20 A15 15 0 1 1 0 -20 Z" fill="#ffe9a8" />
        </G>

        <Cloud x={W * 0.18} y={H * 0.34} s={0.5} />
        <Cloud x={W * 0.85} y={H * 0.38} s={0.42} />
        <Cloud x={W * 0.15} y={H * 0.56} s={0.4} />

        {pieces.map((p, i) => (
          <PuzzlePiece key={i} {...p} />
        ))}
      </Svg>

      {/* glowing lamp post on the right */}
      <Svg width={70} height={190} viewBox="0 0 70 190" style={{ position: 'absolute', right: 6, top: groundTop - 176 }}>
        <Circle cx="35" cy="26" r="30" fill="#ffe27a" opacity={0.18} />
        <Circle cx="35" cy="26" r="20" fill="#ffe27a" opacity={0.25} />
        <Rect x="32" y="40" width="6" height="140" rx="3" fill="#3b2a73" />
        <Rect x="24" y="170" width="22" height="10" rx="3" fill="#2c1f5a" />
        <Circle cx="35" cy="26" r="11" fill="#ffe27a" />
        <Circle cx="31" cy="22" r="3.5" fill="#fff" opacity={0.8} />
        <Rect x="28" y="36" width="14" height="6" rx="2" fill="#3b2a73" />
      </Svg>

      {/* rolling hills + grass */}
      <Svg width={W} height={gH} viewBox={`0 0 ${W} ${gH}`} style={{ position: 'absolute', left: 0, top: gTop }}>
        <Path d={`M0 22 C ${W * 0.2} -14 ${W * 0.5} 6 ${W * 0.75} -8 C ${W * 0.9} -16 ${W} 0 ${W} 6 L ${W} ${gH} L 0 ${gH} Z`} fill="#6a4bb5" />
        <Path d={`M0 ${gH * 0.3} C ${W * 0.25} ${gH * 0.06} ${W * 0.6} ${gH * 0.3} ${W} ${gH * 0.14} L ${W} ${gH} L 0 ${gH} Z`} fill="#2fa39a" />
        <Path d={`M0 ${gH * 0.5} C ${W * 0.3} ${gH * 0.36} ${W * 0.7} ${gH * 0.5} ${W} ${gH * 0.4} L ${W} ${gH} L 0 ${gH} Z`} fill="#46c47a" />
        <Tuft x={W * 0.34} y={gH * 0.7} />
        <Tuft x={W * 0.64} y={gH * 0.62} />
        <Tuft x={W * 0.52} y={gH * 0.92} />
        <Flower x={W * 0.3} y={gH * 0.88} s={0.95} />
        <Flower x={W * 0.7} y={gH * 0.84} s={1.05} />
        <Flower x={W * 0.9} y={gH * 0.66} s={0.85} />
      </Svg>
    </View>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevelMapScreen({ playerId, hints, onBack, onPlay }: Props) {
  const { width, height } = useWindowDimensions();
  const W = Math.min(width, 460);
  const H = height;

  /* layout: level 5 ends right above a short grass strip */
  const groundH = Math.max(100, Math.min(125, H * 0.15));
  const groundTop = H - groundH;
  const rowsBottom = groundTop + 6;
  const free = rowsBottom - ROWS_TOP;
  const rowH = Math.max(52, Math.min(74, (free / PER_PAGE) * 0.88));
  const gap = Math.max(4, (free - PER_PAGE * rowH) / (PER_PAGE - 1));

  const [map, setMap] = useState<LevelMap | null>(null);
  const [page, setPage] = useState(0);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulse = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const p = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );
    const s = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    p.start(); s.start();
    return () => { p.stop(); s.stop(); };
  }, [pulse, sway]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

  const showToast = (m: string) => {
    setToast(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2400);
  };

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      getMap(playerId)
        .then((m) => { if (alive) setMap(m); })
        .catch((e: any) => alive && showToast(e.message || 'Could not load levels'));
      return () => { alive = false; };
    }, [playerId])
  );

  const tap = async (l: MapLevel) => {
    if (busy) return;
    if (l.status === 'soon') return showToast('Coming soon!');
    setBusy(true);
    try {
      await openLevel(playerId, l.n);
      onPlay(l.n);
    } catch (e: any) {
      showToast(e.message || 'Cannot open level');
      if (e.map) setMap(e.map);
    } finally {
      setBusy(false);
    }
  };

  if (!map) {
    return (
      <View style={[st.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const all = map.levels.slice(0, MAX_LEVEL);
  const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const shown = all.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const hasNext = page < pages - 1;
  const hasPrev = page > 0;

  const earned = map.levels.reduce((sum, l) => sum + (l.stars || 0), 0);
  const counter = typeof hints === 'number' ? hints : earned;
  const pillW = Math.min(W * 0.54, 250);

  /* cat sits fully visible on the grass, left of the pills, above the prev button */
  const sideSpace = (W - pillW) / 2;
  const catW = Math.max(56, Math.min(80, sideSpace - 12));
  const catH = catW * 1.2;
  const catTop = groundTop + 12 - catH;

  const row = (l: MapLevel) => {
    const soon = l.status === 'soon';
    const done = l.status === 'completed';
    const cur = l.status === 'current';
    const scale = cur ? pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }) : 1;

    return (
      <View key={l.n} style={{ height: rowH, marginBottom: gap, justifyContent: 'center' }}>
        {cur && (
          <>
            <View style={{ position: 'absolute', left: -38, top: 2 }} pointerEvents="none"><Sparkle /></View>
            <View style={{ position: 'absolute', right: -38, top: 2 }} pointerEvents="none"><Sparkle flip /></View>
          </>
        )}
        <TouchableOpacity activeOpacity={0.85} onPress={() => tap(l)}>
          <Animated.View style={[st.pillOuter, { height: rowH, borderRadius: rowH / 2 }, soon && { opacity: 0.6 }, { transform: [{ scale }] }]}>
            <View style={[st.pillInner, { borderRadius: rowH / 2 }, cur && { backgroundColor: GOLD }]}>
              <View style={st.gloss} pointerEvents="none" />
              <Text style={[st.pillT, { fontSize: Math.round(rowH * 0.36), marginTop: done ? -8 : 0 }]}>LEVEL {l.n}</Text>
              {done && (
                <View style={st.starRow} pointerEvents="none">
                  {[0, 1, 2].map((s) => (
                    <Text key={s} style={{ fontSize: 11, color: s < l.stars ? '#f5a500' : '#d9c9a8' }}>★</Text>
                  ))}
                </View>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={st.root}>
      <View style={{ width: W, flex: 1, alignSelf: 'center' }}>
        <Background W={W} H={H} groundTop={groundTop} />

        {/* full cat on the grass (drawn after the background so nothing hides it) */}
        <View pointerEvents="none" style={{ position: 'absolute', left: 6, top: catTop }}>
          <Cat width={catW} />
        </View>

        {/* 5 levels of the current page */}
        <View style={{ paddingTop: ROWS_TOP, alignItems: 'center' }}>
          <View style={{ width: pillW }}>
            {shown.map((l) => row(l))}
          </View>
        </View>

        {/* header */}
        <View style={st.header} pointerEvents="box-none">
          <View style={st.leftBtns}>
            <TouchableOpacity style={st.roundBtn} activeOpacity={0.85} onPress={onBack}>
              <HomeIcon s={22} />
            </TouchableOpacity>
            <TouchableOpacity style={st.roundBtn} activeOpacity={0.85}>
              <GearIcon s={23} />
            </TouchableOpacity>
          </View>

          <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
            <Chain h={30} style={{ left: 24, top: -6 }} />
            <Chain h={30} style={{ right: 24, top: -6 }} />
            <View style={st.sign}>
              <Text style={st.signArrow}>{'<'}</Text>
              <Text style={st.signT}>LEVELS</Text>
              <Text style={st.signArrow}>{'>'}</Text>
            </View>
          </Animated.View>

          <View style={st.counterWrap}>
            <View style={st.counter}>
              <Text style={st.counterT} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{counter}</Text>
            </View>
            <View style={st.counterIcon}>
              <Icon n="bulb" s={32} />
            </View>
          </View>
        </View>

        {/* previous page (bottom left) */}
        {hasPrev && (
          <TouchableOpacity style={[st.playBtn, { left: 14 }]} activeOpacity={0.85} onPress={() => setPage(page - 1)}>
            <ArrowIcon s={30} dir="left" />
          </TouchableOpacity>
        )}

        {/* next page (bottom right) */}
        {hasNext && (
          <TouchableOpacity style={[st.playBtn, { right: 14 }]} activeOpacity={0.85} onPress={() => setPage(page + 1)}>
            <ArrowIcon s={30} dir="right" />
          </TouchableOpacity>
        )}

        {!!toast && (
          <View style={[st.toast, { top: HEADER_H + 4, width: W * 0.84, alignSelf: 'center' }]}>
            <Text style={st.toastT}>{toast}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1b1464' },

  header: {
    position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H,
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingTop: 14, zIndex: 10,
  },
  leftBtns: { flexDirection: 'row', gap: 8 },
  roundBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: YEL, borderWidth: 3, borderColor: YEL_D,
    alignItems: 'center', justifyContent: 'center', elevation: 3,
  },
  signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 10 },
  sign: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, height: 48,
    borderRadius: 8, backgroundColor: SIGN, borderWidth: 3, borderColor: WOOD_DD, elevation: 3,
  },
  signT: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  signArrow: { fontSize: 24, fontWeight: '900', color: '#ffc533' },

  // hint counter (cream pill + bulb)
  counterWrap: { width: 74, height: 40, marginTop: 4, justifyContent: 'center' },
  counter: {
    width: 62, height: 30, borderRadius: 15, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed',
    borderColor: '#d8c8a8', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 12, paddingRight: 6, elevation: 3,
  },
  counterT: { fontSize: 17, fontWeight: '900', color: NAVY, width: 36 },
  counterIcon: { position: 'absolute', right: 0, top: -2 },

  // level pills (height / radius are set inline from rowH)
  pillOuter: {
    backgroundColor: WOOD_D, padding: 4,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  pillInner: {
    flex: 1, backgroundColor: CREAM_IN, borderWidth: 2, borderColor: '#f3b95e',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  gloss: {
    position: 'absolute', top: 3, left: 14, right: 14, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.55)',
  },
  pillT: { fontWeight: '900', color: NAVY, letterSpacing: 0.5 },
  starRow: { position: 'absolute', bottom: 3, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },

  // page buttons (bottom corners, on the grass)
  playBtn: {
    position: 'absolute', bottom: 20, width: BTN, height: BTN, borderRadius: BTN / 2,
    backgroundColor: CREAM, borderWidth: 5, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center',
    elevation: 8, zIndex: 12,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 3 },
  },

  toast: {
    position: 'absolute', paddingVertical: 10, borderRadius: 30,
    backgroundColor: 'rgba(45,25,10,0.92)', borderWidth: 2, borderColor: '#8a6a45', zIndex: 20,
  },
  toastT: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
});