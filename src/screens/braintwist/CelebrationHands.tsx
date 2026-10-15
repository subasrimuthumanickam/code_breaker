// // // // import React, { useEffect, useRef, useState } from "react";

// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   StyleSheet,
// // // //   Animated,
// // // //   Easing,
// // // //   LayoutChangeEvent,
// // // //   StyleProp,
// // // //   ViewStyle,
// // // // } from "react-native";

// // // // import Svg, { G, Rect, Path, Line, Circle, Ellipse } from "react-native-svg";

// // // // /* =========================================================
// // // //    DOODLE STYLE
// // // // ========================================================= */

// // // // const INK = "#1D1D1D";
// // // // const PAPER = "#FFFFFF";
// // // // const SW = 2.6;

// // // // const stroke = {
// // // //   stroke: INK,
// // // //   strokeWidth: SW,
// // // //   strokeLinecap: "round" as const,
// // // //   strokeLinejoin: "round" as const,
// // // // };

// // // // type SleeveKind = "stripes" | "dots" | "plain";

// // // // /* =========================================================
// // // //    SLEEVE (striped / polka dot cuff)
// // // //    local coords: x 4..40, y 60..140
// // // // ========================================================= */

// // // // const edge = (y: number) => {
// // // //   const t = (y - 60) / 80;
// // // //   return { l: 8 - 4 * t, r: 36 + 4 * t };
// // // // };

// // // // function Sleeve({ kind }: { kind: SleeveKind }) {
// // // //   const stripeYs = [86, 97, 108, 119, 130];

// // // //   const dotRows = [
// // // //     { y: 88, xs: [14, 28] },
// // // //     { y: 104, xs: [21, 34] },
// // // //     { y: 120, xs: [14, 28] },
// // // //     { y: 136, xs: [21, 34] },
// // // //   ];

// // // //   return (
// // // //     <G>
// // // //       <Path
// // // //         d="M8 60 L36 60 L40 140 L4 140 Z"
// // // //         fill={PAPER}
// // // //         {...stroke}
// // // //       />

// // // //       {/* cuff line */}
// // // //       <Line x1={edge(72).l} y1={72} x2={edge(72).r} y2={72} {...stroke} />

// // // //       {kind === "stripes" &&
// // // //         stripeYs.map((y) => (
// // // //           <Line
// // // //             key={y}
// // // //             x1={edge(y).l}
// // // //             y1={y}
// // // //             x2={edge(y).r}
// // // //             y2={y}
// // // //             {...stroke}
// // // //           />
// // // //         ))}

// // // //       {kind === "dots" &&
// // // //         dotRows.map((row) =>
// // // //           row.xs.map((x) => (
// // // //             <Circle key={`${row.y}-${x}`} cx={x} cy={row.y} r={2.8} fill={INK} />
// // // //           ))
// // // //         )}
// // // //     </G>
// // // //   );
// // // // }

// // // // /* =========================================================
// // // //    OPEN HAND (palm facing forward)
// // // //    local coords: x 0..44, y 0..140, pivot at bottom (22,140)
// // // // ========================================================= */

// // // // function Hand({ sleeve }: { sleeve: SleeveKind }) {
// // // //   return (
// // // //     <G>
// // // //       <Sleeve kind={sleeve} />

// // // //       {/* thumb */}
// // // //       <Rect
// // // //         x={-2}
// // // //         y={38}
// // // //         width={10}
// // // //         height={26}
// // // //         rx={5}
// // // //         fill={PAPER}
// // // //         transform="rotate(-30 4 62)"
// // // //         {...stroke}
// // // //       />

// // // //       {/* fingers: index, middle, ring, pinky */}
// // // //       <Rect x={5} y={9} width={8} height={40} rx={4} fill={PAPER} {...stroke} />
// // // //       <Rect x={13.5} y={0} width={8} height={48} rx={4} fill={PAPER} {...stroke} />
// // // //       <Rect x={22} y={7} width={8} height={42} rx={4} fill={PAPER} {...stroke} />
// // // //       <Rect x={30.5} y={17} width={8} height={34} rx={4} fill={PAPER} {...stroke} />

// // // //       {/* palm */}
// // // //       <Path
// // // //         d="M5 40 H38.5 V50 Q38.5 67 22 67 Q5 67 5 50 Z"
// // // //         fill={PAPER}
// // // //         {...stroke}
// // // //       />
// // // //     </G>
// // // //   );
// // // // }

// // // // /* =========================================================
// // // //    FINGERTIP (just the oval tip + nail)
// // // // ========================================================= */

// // // // function FingerTip({ sleeve }: { sleeve: SleeveKind }) {
// // // //   return (
// // // //     <G>
// // // //       <Sleeve kind={sleeve} />

// // // //       <Ellipse cx={22} cy={44} rx={17} ry={29} fill={PAPER} {...stroke} />

// // // //       {/* nail curve */}
// // // //       <Path d="M13 40 Q16 24 26 24" fill="none" {...stroke} />
// // // //     </G>
// // // //   );
// // // // }

// // // // /* =========================================================
// // // //    MAIN ART COMPONENT
// // // // ========================================================= */

// // // // type HandsProps = {
// // // //   variant?: "clap" | "tips";
// // // //   width?: number;
// // // // };

// // // // export function CelebrationHands({ variant = "clap", width = 320 }: HandsProps) {
// // // //   const height = (width * 150) / 320;

// // // //   if (variant === "tips") {
// // // //     const cols = [
// // // //       { cx: 58, rot: -6, sleeve: "stripes" as SleeveKind },
// // // //       { cx: 160, rot: 0, sleeve: "dots" as SleeveKind },
// // // //       { cx: 262, rot: 6, sleeve: "stripes" as SleeveKind },
// // // //     ];

// // // //     return (
// // // //       <Svg width={width} height={height} viewBox="0 0 320 150">
// // // //         <G transform="translate(0 14)">
// // // //           {cols.map((c) => (
// // // //             <G
// // // //               key={c.cx}
// // // //               transform={`translate(${c.cx - 22} 0) rotate(${c.rot} 22 140)`}
// // // //             >
// // // //               <FingerTip sleeve={c.sleeve} />
// // // //             </G>
// // // //           ))}
// // // //         </G>
// // // //       </Svg>
// // // //     );
// // // //   }

// // // //   const hands = [
// // // //     { x: 46, y: 24, rot: -14, sleeve: "stripes" as SleeveKind },
// // // //     { x: 92, y: 10, rot: -7, sleeve: "stripes" as SleeveKind },
// // // //     { x: 138, y: 0, rot: 0, sleeve: "dots" as SleeveKind },
// // // //     { x: 184, y: 10, rot: 7, sleeve: "stripes" as SleeveKind },
// // // //     { x: 230, y: 24, rot: 14, sleeve: "stripes" as SleeveKind },
// // // //   ];

// // // //   // little "clap" lines around the hands
// // // //   const marks = [
// // // //     [125, 22, 117, 13],
// // // //     [137, 14, 134, 4],
// // // //     [183, 22, 191, 13],
// // // //     [171, 14, 174, 4],
// // // //     [72, 42, 64, 35],
// // // //     [248, 42, 256, 35],
// // // //   ];

// // // //   return (
// // // //     <Svg width={width} height={height} viewBox="0 0 320 150">
// // // //       {marks.map((m, i) => (
// // // //         <Line key={i} x1={m[0]} y1={m[1]} x2={m[2]} y2={m[3]} {...stroke} />
// // // //       ))}

// // // //       <G transform="translate(0 26)">
// // // //         {hands.map((h) => (
// // // //           <G
// // // //             key={h.x}
// // // //             transform={`translate(${h.x} ${h.y}) rotate(${h.rot} 22 140)`}
// // // //           >
// // // //             <Hand sleeve={h.sleeve} />
// // // //           </G>
// // // //         ))}
// // // //       </G>
// // // //     </Svg>
// // // //   );
// // // // }

// // // // /* =========================================================
// // // //    CONFETTI (falls once from the top)
// // // // ========================================================= */

// // // // const CONFETTI_COLORS = ["#FF6B6B", "#FFD54F", "#B5E655", "#6EE3F5", "#D3A8FF"];

// // // // type Piece = {
// // // //   x: number;
// // // //   size: number;
// // // //   color: string;
// // // //   delay: number;
// // // //   duration: number;
// // // //   rotation: number;
// // // //   anim: Animated.Value;
// // // // };

// // // // export function Confetti({ count = 38 }: { count?: number }) {
// // // //   const [height, setHeight] = useState(600);

// // // //   const pieces = useRef<Piece[]>(
// // // //     Array.from({ length: count }, (_, i) => ({
// // // //       x: Math.random() * 94,
// // // //       size: 8 + Math.random() * 10,
// // // //       color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
// // // //       delay: Math.random() * 500,
// // // //       duration: 1800 + Math.random() * 1400,
// // // //       rotation: Math.random() * 360,
// // // //       anim: new Animated.Value(0),
// // // //     }))
// // // //   ).current;

// // // //   useEffect(() => {
// // // //     pieces.forEach((p) => {
// // // //       Animated.timing(p.anim, {
// // // //         toValue: 1,
// // // //         duration: p.duration,
// // // //         delay: p.delay,
// // // //         easing: Easing.out(Easing.quad),
// // // //         useNativeDriver: true,
// // // //       }).start();
// // // //     });
// // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // //   }, []);

// // // //   const onLayout = (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height);

// // // //   return (
// // // //     <View
// // // //       pointerEvents="none"
// // // //       style={StyleSheet.absoluteFill}
// // // //       onLayout={onLayout}
// // // //     >
// // // //       {pieces.map((p, i) => {
// // // //         const translateY = p.anim.interpolate({
// // // //           inputRange: [0, 1],
// // // //           outputRange: [-30, height * 0.9],
// // // //         });

// // // //         const opacity = p.anim.interpolate({
// // // //           inputRange: [0, 0.1, 0.8, 1],
// // // //           outputRange: [0, 1, 1, 0],
// // // //         });

// // // //         const rotate = p.anim.interpolate({
// // // //           inputRange: [0, 1],
// // // //           outputRange: [`${p.rotation}deg`, `${p.rotation + 360}deg`],
// // // //         });

// // // //         return (
// // // //           <Animated.View
// // // //             key={i}
// // // //             style={{
// // // //               position: "absolute",
// // // //               top: 0,
// // // //               left: `${p.x}%`,
// // // //               width: p.size,
// // // //               height: p.size * 0.55,
// // // //               backgroundColor: p.color,
// // // //               opacity,
// // // //               transform: [{ translateY }, { rotate }],
// // // //             }}
// // // //           />
// // // //         );
// // // //       })}
// // // //     </View>
// // // //   );
// // // // }

// // // // /* =========================================================
// // // //    LEVEL COMPLETE VIEW
// // // //    message + green button + hands + confetti
// // // // ========================================================= */

// // // // type LevelCompleteProps = {
// // // //   message: string;
// // // //   buttonLabel?: string; // "NEXT" or "DONE"
// // // //   onPress: () => void;
// // // //   variant?: "clap" | "tips";
// // // //   style?: StyleProp<ViewStyle>;
// // // // };

// // // // export function LevelComplete({
// // // //   message,
// // // //   buttonLabel = "NEXT",
// // // //   onPress,
// // // //   variant = "clap",
// // // //   style,
// // // // }: LevelCompleteProps) {
// // // //   const handsSlide = useRef(new Animated.Value(140)).current;
// // // //   const buttonScale = useRef(new Animated.Value(0.6)).current;

// // // //   useEffect(() => {
// // // //     Animated.parallel([
// // // //       Animated.spring(handsSlide, {
// // // //         toValue: 0,
// // // //         friction: 6,
// // // //         tension: 40,
// // // //         useNativeDriver: true,
// // // //       }),
// // // //       Animated.spring(buttonScale, {
// // // //         toValue: 1,
// // // //         friction: 5,
// // // //         delay: 150,
// // // //         useNativeDriver: true,
// // // //       }),
// // // //     ]).start();
// // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // //   }, []);

// // // //   return (
// // // //     <View style={[styles.wrap, style]}>
// // // //       <Confetti />

// // // //       <View style={styles.center}>
// // // //         <Text style={styles.message}>{message.toUpperCase()}</Text>

// // // //         <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
// // // //           <TouchableOpacity
// // // //             style={styles.button}
// // // //             onPress={onPress}
// // // //             activeOpacity={0.85}
// // // //           >
// // // //             <Text style={styles.buttonText}>{buttonLabel}</Text>
// // // //           </TouchableOpacity>
// // // //         </Animated.View>
// // // //       </View>

// // // //       <Animated.View
// // // //         style={[styles.hands, { transform: [{ translateY: handsSlide }] }]}
// // // //       >
// // // //         <CelebrationHands variant={variant} width={320} />
// // // //       </Animated.View>
// // // //     </View>
// // // //   );
// // // // }

// // // // /* =========================================================
// // // //    STYLES
// // // // ========================================================= */

// // // // const styles = StyleSheet.create({
// // // //   wrap: {
// // // //     flex: 1,
// // // //     overflow: "hidden",
// // // //   },

// // // //   center: {
// // // //     flex: 1,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     paddingHorizontal: 28,
// // // //     paddingBottom: 90,
// // // //   },

// // // //   message: {
// // // //     color: INK,
// // // //     fontSize: 26,
// // // //     fontWeight: "900",
// // // //     textAlign: "center",
// // // //     lineHeight: 32,
// // // //     marginBottom: 34,
// // // //   },

// // // //   button: {
// // // //     minWidth: 210,
// // // //     height: 78,
// // // //     paddingHorizontal: 30,
// // // //     borderRadius: 28,
// // // //     backgroundColor: "#C6F24E",
// // // //     borderWidth: 3,
// // // //     borderColor: INK,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   buttonText: {
// // // //     color: INK,
// // // //     fontSize: 36,
// // // //     fontWeight: "900",
// // // //     letterSpacing: 0.5,
// // // //   },

// // // //   hands: {
// // // //     position: "absolute",
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: -4,
// // // //     alignItems: "center",
// // // //   },
// // // // });

// // // // export default CelebrationHands;
// // // import React, { useEffect, useRef } from "react";

// // // import { View, Animated, Easing } from "react-native";

// // // import Svg, { G, Rect, Path, Line, Circle, Ellipse } from "react-native-svg";

// // // /* =========================================================
// // //    DOODLE STYLE
// // // ========================================================= */

// // // const INK = "#1D1D1D";
// // // const PAPER = "#FFFFFF";
// // // const SW = 2.6;

// // // const stroke = {
// // //   stroke: INK,
// // //   strokeWidth: SW,
// // //   strokeLinecap: "round" as const,
// // //   strokeLinejoin: "round" as const,
// // // };

// // // type SleeveKind = "stripes" | "dots" | "plain";

// // // /* =========================================================
// // //    SLEEVE (striped / polka dot cuff)
// // //    local coords: x 4..40, y 60..140
// // // ========================================================= */

// // // const edge = (y: number) => {
// // //   const t = (y - 60) / 80;
// // //   return { l: 8 - 4 * t, r: 36 + 4 * t };
// // // };

// // // function Sleeve({ kind }: { kind: SleeveKind }) {
// // //   const stripeYs = [86, 97, 108, 119, 130];

// // //   const dotRows = [
// // //     { y: 88, xs: [14, 28] },
// // //     { y: 104, xs: [21, 34] },
// // //     { y: 120, xs: [14, 28] },
// // //     { y: 136, xs: [21, 34] },
// // //   ];

// // //   return (
// // //     <G>
// // //       <Path d="M8 60 L36 60 L40 140 L4 140 Z" fill={PAPER} {...stroke} />

// // //       <Line x1={edge(72).l} y1={72} x2={edge(72).r} y2={72} {...stroke} />

// // //       {kind === "stripes" &&
// // //         stripeYs.map((y) => (
// // //           <Line
// // //             key={y}
// // //             x1={edge(y).l}
// // //             y1={y}
// // //             x2={edge(y).r}
// // //             y2={y}
// // //             {...stroke}
// // //           />
// // //         ))}

// // //       {kind === "dots" &&
// // //         dotRows.map((row) =>
// // //           row.xs.map((x) => (
// // //             <Circle key={`${row.y}-${x}`} cx={x} cy={row.y} r={2.8} fill={INK} />
// // //           ))
// // //         )}
// // //     </G>
// // //   );
// // // }

// // // /* =========================================================
// // //    SHAPES
// // // ========================================================= */

// // // function OpenHand({ sleeve }: { sleeve: SleeveKind }) {
// // //   return (
// // //     <G>
// // //       <Sleeve kind={sleeve} />

// // //       <Rect
// // //         x={-2}
// // //         y={38}
// // //         width={10}
// // //         height={26}
// // //         rx={5}
// // //         fill={PAPER}
// // //         transform="rotate(-30 4 62)"
// // //         {...stroke}
// // //       />

// // //       <Rect x={5} y={9} width={8} height={40} rx={4} fill={PAPER} {...stroke} />
// // //       <Rect x={13.5} y={0} width={8} height={48} rx={4} fill={PAPER} {...stroke} />
// // //       <Rect x={22} y={7} width={8} height={42} rx={4} fill={PAPER} {...stroke} />
// // //       <Rect x={30.5} y={17} width={8} height={34} rx={4} fill={PAPER} {...stroke} />

// // //       <Path
// // //         d="M5 40 H38.5 V50 Q38.5 67 22 67 Q5 67 5 50 Z"
// // //         fill={PAPER}
// // //         {...stroke}
// // //       />
// // //     </G>
// // //   );
// // // }

// // // function FingerTip({ sleeve }: { sleeve: SleeveKind }) {
// // //   return (
// // //     <G>
// // //       <Sleeve kind={sleeve} />

// // //       <Ellipse cx={22} cy={44} rx={17} ry={29} fill={PAPER} {...stroke} />

// // //       <Path d="M13 40 Q16 24 26 24" fill="none" {...stroke} />
// // //     </G>
// // //   );
// // // }

// // // /* one hand = one small svg (so each hand can animate on its own) */

// // // const HW = 64;
// // // const HH = 140;

// // // function HandSvg({
// // //   tip,
// // //   sleeve,
// // //   w,
// // //   h,
// // // }: {
// // //   tip: boolean;
// // //   sleeve: SleeveKind;
// // //   w: number;
// // //   h: number;
// // // }) {
// // //   return (
// // //     <Svg width={w} height={h} viewBox={`-12 0 ${HW} ${HH}`}>
// // //       {tip ? <FingerTip sleeve={sleeve} /> : <OpenHand sleeve={sleeve} />}
// // //     </Svg>
// // //   );
// // // }

// // // /* =========================================================
// // //    CELEBRATION HANDS (animated)
// // //    clap -> 5 hands slide up, then keep clapping
// // //    tips -> 3 fingertips slide up, then wiggle like a wave
// // // ========================================================= */

// // // type HandsProps = {
// // //   variant?: "clap" | "tips";
// // //   width?: number;
// // // };

// // // type Item = {
// // //   cx: number;
// // //   top: number;
// // //   rot: number;
// // //   dir: number;
// // //   sleeve: SleeveKind;
// // // };

// // // const CLAP_ITEMS: Item[] = [
// // //   { cx: 68, top: 56, rot: -14, dir: 1, sleeve: "stripes" },
// // //   { cx: 114, top: 40, rot: -7, dir: 1, sleeve: "stripes" },
// // //   { cx: 160, top: 26, rot: 0, dir: 0, sleeve: "dots" },
// // //   { cx: 206, top: 40, rot: 7, dir: -1, sleeve: "stripes" },
// // //   { cx: 252, top: 56, rot: 14, dir: -1, sleeve: "stripes" },
// // // ];

// // // const TIP_ITEMS: Item[] = [
// // //   { cx: 58, top: 12, rot: -6, dir: 1, sleeve: "stripes" },
// // //   { cx: 160, top: 12, rot: 0, dir: -1, sleeve: "dots" },
// // //   { cx: 262, top: 12, rot: 6, dir: 1, sleeve: "stripes" },
// // // ];

// // // const MARKS = [
// // //   [125, 22, 117, 13],
// // //   [137, 14, 134, 4],
// // //   [183, 22, 191, 13],
// // //   [171, 14, 174, 4],
// // //   [72, 42, 64, 35],
// // //   [248, 42, 256, 35],
// // // ];

// // // export function CelebrationHands({ variant = "clap", width = 320 }: HandsProps) {
// // //   const s = width / 320;
// // //   const H = 150 * s;
// // //   const hw = HW * s;
// // //   const hh = HH * s;

// // //   const isClap = variant === "clap";
// // //   const items = isClap ? CLAP_ITEMS : TIP_ITEMS;

// // //   const enter = useRef(
// // //     Array.from({ length: 5 }, () => new Animated.Value(0))
// // //   ).current;

// // //   const c = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     const intro = Animated.stagger(
// // //       90,
// // //       enter.map((v) =>
// // //         Animated.spring(v, {
// // //           toValue: 1,
// // //           friction: 6,
// // //           tension: 50,
// // //           useNativeDriver: true,
// // //         })
// // //       )
// // //     );

// // //     intro.start();

// // //     const dur = isClap ? 300 : 550;

// // //     const loop = Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(c, {
// // //           toValue: 1,
// // //           duration: dur,
// // //           easing: Easing.inOut(Easing.quad),
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(c, {
// // //           toValue: 0,
// // //           duration: dur,
// // //           easing: Easing.inOut(Easing.quad),
// // //           useNativeDriver: true,
// // //         }),
// // //       ])
// // //     );

// // //     const timer = setTimeout(() => loop.start(), 600);

// // //     return () => {
// // //       clearTimeout(timer);
// // //       loop.stop();
// // //       intro.stop();
// // //     };
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [variant]);

// // //   const marksOpacity = c.interpolate({
// // //     inputRange: [0, 0.6, 1],
// // //     outputRange: [0, 0, 1],
// // //   });

// // //   return (
// // //     <View style={{ width, height: H, overflow: "hidden" }}>
// // //       {isClap && (
// // //         <Animated.View
// // //           pointerEvents="none"
// // //           style={{ position: "absolute", left: 0, top: 0, opacity: marksOpacity }}
// // //         >
// // //           <Svg width={width} height={H} viewBox="0 0 320 150">
// // //             {MARKS.map((m, i) => (
// // //               <Line key={i} x1={m[0]} y1={m[1]} x2={m[2]} y2={m[3]} {...stroke} />
// // //             ))}
// // //           </Svg>
// // //         </Animated.View>
// // //       )}

// // //       {items.map((it, i) => {
// // //         const amp = isClap ? 10 : 6;

// // //         const rotate = c.interpolate({
// // //           inputRange: [0, 1],
// // //           outputRange: [`${it.rot}deg`, `${it.rot + it.dir * amp}deg`],
// // //         });

// // //         const lift = enter[i].interpolate({
// // //           inputRange: [0, 1],
// // //           outputRange: [hh + 30, 0],
// // //         });

// // //         const bounce = c.interpolate({
// // //           inputRange: [0, 1],
// // //           outputRange: [0, isClap ? -5 * s : 0],
// // //         });

// // //         // rotate around the bottom of the hand (the "arm" pivot)
// // //         const style: any = {
// // //           position: "absolute",
// // //           left: it.cx * s - hw / 2,
// // //           top: it.top * s,
// // //           width: hw,
// // //           height: hh,
// // //           transform: [
// // //             { translateY: lift },
// // //             { translateY: bounce },
// // //             { translateY: hh / 2 },
// // //             { rotate },
// // //             { translateY: -hh / 2 },
// // //           ],
// // //         };

// // //         return (
// // //           <Animated.View key={i} style={style}>
// // //             <HandSvg tip={!isClap} sleeve={it.sleeve} w={hw} h={hh} />
// // //           </Animated.View>
// // //         );
// // //       })}
// // //     </View>
// // //   );
// // // }

// // // /* =========================================================
// // //    POINTER HAND (the hint hand in the levels)
// // //    lifts up, taps down and a ripple appears under the finger
// // // ========================================================= */

// // // export function PointerHand({ w = 70 }: { w?: number }) {
// // //   const k = w / 70;
// // //   const h = 110 * k;

// // //   const p = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     const loop = Animated.loop(
// // //       Animated.timing(p, {
// // //         toValue: 1,
// // //         duration: 1100,
// // //         easing: Easing.linear,
// // //         useNativeDriver: true,
// // //       })
// // //     );

// // //     loop.start();

// // //     return () => loop.stop();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, []);

// // //   const translateY = p.interpolate({
// // //     inputRange: [0, 0.5, 0.68, 1],
// // //     outputRange: [0, -16 * k, 3 * k, 0],
// // //   });

// // //   const scale = p.interpolate({
// // //     inputRange: [0, 0.5, 0.68, 1],
// // //     outputRange: [1, 1, 0.94, 1],
// // //   });

// // //   const ringScale = p.interpolate({
// // //     inputRange: [0, 0.66, 1],
// // //     outputRange: [0.2, 0.2, 1.6],
// // //   });

// // //   const ringOpacity = p.interpolate({
// // //     inputRange: [0, 0.66, 0.7, 1],
// // //     outputRange: [0, 0, 0.75, 0],
// // //   });

// // //   const ring = 34 * k;

// // //   return (
// // //     <View style={{ width: w, height: h }}>
// // //       {/* tap ripple at the fingertip */}
// // //       <Animated.View
// // //         pointerEvents="none"
// // //         style={{
// // //           position: "absolute",
// // //           left: 35 * k - ring / 2,
// // //           top: 6 * k - ring / 2,
// // //           width: ring,
// // //           height: ring,
// // //           borderRadius: ring / 2,
// // //           borderWidth: 2.5,
// // //           borderColor: INK,
// // //           opacity: ringOpacity,
// // //           transform: [{ scale: ringScale }],
// // //         }}
// // //       />

// // //       <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
// // //         <Svg width={w} height={h} viewBox="0 0 70 110">
// // //           {/* sleeve */}
// // //           <Path d="M20 82 L50 82 L54 110 L16 110 Z" fill={PAPER} {...stroke} />
// // //           <Line x1={19.5} y1={90} x2={50.5} y2={90} {...stroke} />
// // //           <Line x1={18.5} y1={98} x2={51.5} y2={98} {...stroke} />
// // //           <Line x1={17.5} y1={106} x2={52.5} y2={106} {...stroke} />

// // //           {/* fist */}
// // //           <Path
// // //             d="M16 48 H54 V66 Q54 84 35 84 Q16 84 16 66 Z"
// // //             fill={PAPER}
// // //             {...stroke}
// // //           />

// // //           {/* thumb */}
// // //           <Rect
// // //             x={13}
// // //             y={56}
// // //             width={17}
// // //             height={12}
// // //             rx={6}
// // //             fill={PAPER}
// // //             transform="rotate(-20 21 62)"
// // //             {...stroke}
// // //           />

// // //           {/* curled fingers */}
// // //           <Rect x={38} y={52} width={18} height={9} rx={4.5} fill={PAPER} {...stroke} />
// // //           <Rect x={38} y={62} width={18} height={9} rx={4.5} fill={PAPER} {...stroke} />
// // //           <Rect x={38} y={72} width={17} height={9} rx={4.5} fill={PAPER} {...stroke} />

// // //           {/* pointing index finger */}
// // //           <Rect x={29} y={4} width={12} height={52} rx={6} fill={PAPER} {...stroke} />
// // //           <Path d="M33 15 Q35 9 38 11" fill="none" {...stroke} />
// // //         </Svg>
// // //       </Animated.View>
// // //     </View>
// // //   );
// // // }

// // // export default CelebrationHands;
// // import React, { useEffect, useRef } from "react";

// // import { View, Animated, Easing, Image } from "react-native";

// // import Svg, { G, Rect, Path, Line, Circle, Ellipse } from "react-native-svg";

// // /* =========================================================
// //    DOODLE STYLE
// // ========================================================= */

// // const INK = "#1D1D1D";
// // const PAPER = "#FFFFFF";
// // const SW = 2.6;

// // const stroke = {
// //   stroke: INK,
// //   strokeWidth: SW,
// //   strokeLinecap: "round" as const,
// //   strokeLinejoin: "round" as const,
// // };

// // type SleeveKind = "stripes" | "dots" | "plain";

// // /* =========================================================
// //    SLEEVE (striped / polka dot cuff)
// //    local coords: x 4..40, y 60..140
// // ========================================================= */

// // const edge = (y: number) => {
// //   const t = (y - 60) / 80;
// //   return { l: 8 - 4 * t, r: 36 + 4 * t };
// // };

// // function Sleeve({ kind }: { kind: SleeveKind }) {
// //   const stripeYs = [86, 97, 108, 119, 130];

// //   const dotRows = [
// //     { y: 88, xs: [14, 28] },
// //     { y: 104, xs: [21, 34] },
// //     { y: 120, xs: [14, 28] },
// //     { y: 136, xs: [21, 34] },
// //   ];

// //   return (
// //     <G>
// //       <Path d="M8 60 L36 60 L40 140 L4 140 Z" fill={PAPER} {...stroke} />

// //       <Line x1={edge(72).l} y1={72} x2={edge(72).r} y2={72} {...stroke} />

// //       {kind === "stripes" &&
// //         stripeYs.map((y) => (
// //           <Line
// //             key={y}
// //             x1={edge(y).l}
// //             y1={y}
// //             x2={edge(y).r}
// //             y2={y}
// //             {...stroke}
// //           />
// //         ))}

// //       {kind === "dots" &&
// //         dotRows.map((row) =>
// //           row.xs.map((x) => (
// //             <Circle key={`${row.y}-${x}`} cx={x} cy={row.y} r={2.8} fill={INK} />
// //           ))
// //         )}
// //     </G>
// //   );
// // }

// // /* =========================================================
// //    SHAPES
// // ========================================================= */

// // function OpenHand({ sleeve }: { sleeve: SleeveKind }) {
// //   return (
// //     <G>
// //       <Sleeve kind={sleeve} />

// //       <Rect
// //         x={-2}
// //         y={38}
// //         width={10}
// //         height={26}
// //         rx={5}
// //         fill={PAPER}
// //         transform="rotate(-30 4 62)"
// //         {...stroke}
// //       />

// //       <Rect x={5} y={9} width={8} height={40} rx={4} fill={PAPER} {...stroke} />
// //       <Rect x={13.5} y={0} width={8} height={48} rx={4} fill={PAPER} {...stroke} />
// //       <Rect x={22} y={7} width={8} height={42} rx={4} fill={PAPER} {...stroke} />
// //       <Rect x={30.5} y={17} width={8} height={34} rx={4} fill={PAPER} {...stroke} />

// //       <Path
// //         d="M5 40 H38.5 V50 Q38.5 67 22 67 Q5 67 5 50 Z"
// //         fill={PAPER}
// //         {...stroke}
// //       />
// //     </G>
// //   );
// // }

// // function FingerTip({ sleeve }: { sleeve: SleeveKind }) {
// //   return (
// //     <G>
// //       <Sleeve kind={sleeve} />

// //       <Ellipse cx={22} cy={44} rx={17} ry={29} fill={PAPER} {...stroke} />

// //       <Path d="M13 40 Q16 24 26 24" fill="none" {...stroke} />
// //     </G>
// //   );
// // }

// // /* one hand = one small svg (so each hand can animate on its own) */

// // const HW = 64;
// // const HH = 140;

// // function HandSvg({
// //   tip,
// //   sleeve,
// //   w,
// //   h,
// // }: {
// //   tip: boolean;
// //   sleeve: SleeveKind;
// //   w: number;
// //   h: number;
// // }) {
// //   return (
// //     <Svg width={w} height={h} viewBox={`-12 0 ${HW} ${HH}`}>
// //       {tip ? <FingerTip sleeve={sleeve} /> : <OpenHand sleeve={sleeve} />}
// //     </Svg>
// //   );
// // }

// // /* =========================================================
// //    CELEBRATION HANDS (animated)
// //    clap -> 5 hands slide up, then keep clapping
// //    tips -> 3 fingertips slide up, then wiggle like a wave
// // ========================================================= */

// // type HandsProps = {
// //   variant?: "clap" | "tips";
// //   width?: number;
// // };

// // type Item = {
// //   cx: number;
// //   top: number;
// //   rot: number;
// //   dir: number;
// //   sleeve: SleeveKind;
// // };

// // const CLAP_ITEMS: Item[] = [
// //   { cx: 68, top: 56, rot: -14, dir: 1, sleeve: "stripes" },
// //   { cx: 114, top: 40, rot: -7, dir: 1, sleeve: "stripes" },
// //   { cx: 160, top: 26, rot: 0, dir: 0, sleeve: "dots" },
// //   { cx: 206, top: 40, rot: 7, dir: -1, sleeve: "stripes" },
// //   { cx: 252, top: 56, rot: 14, dir: -1, sleeve: "stripes" },
// // ];

// // const TIP_ITEMS: Item[] = [
// //   { cx: 58, top: 12, rot: -6, dir: 1, sleeve: "stripes" },
// //   { cx: 160, top: 12, rot: 0, dir: -1, sleeve: "dots" },
// //   { cx: 262, top: 12, rot: 6, dir: 1, sleeve: "stripes" },
// // ];

// // const MARKS = [
// //   [125, 22, 117, 13],
// //   [137, 14, 134, 4],
// //   [183, 22, 191, 13],
// //   [171, 14, 174, 4],
// //   [72, 42, 64, 35],
// //   [248, 42, 256, 35],
// // ];

// // export function CelebrationHands({ variant = "clap", width = 320 }: HandsProps) {
// //   const s = width / 320;
// //   const H = 150 * s;
// //   const hw = HW * s;
// //   const hh = HH * s;

// //   const isClap = variant === "clap";
// //   const items = isClap ? CLAP_ITEMS : TIP_ITEMS;

// //   const enter = useRef(
// //     Array.from({ length: 5 }, () => new Animated.Value(0))
// //   ).current;

// //   const c = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     const intro = Animated.stagger(
// //       90,
// //       enter.map((v) =>
// //         Animated.spring(v, {
// //           toValue: 1,
// //           friction: 6,
// //           tension: 50,
// //           useNativeDriver: true,
// //         })
// //       )
// //     );

// //     intro.start();

// //     const dur = isClap ? 300 : 550;

// //     const loop = Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(c, {
// //           toValue: 1,
// //           duration: dur,
// //           easing: Easing.inOut(Easing.quad),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(c, {
// //           toValue: 0,
// //           duration: dur,
// //           easing: Easing.inOut(Easing.quad),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     );

// //     const timer = setTimeout(() => loop.start(), 600);

// //     return () => {
// //       clearTimeout(timer);
// //       loop.stop();
// //       intro.stop();
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [variant]);

// //   const marksOpacity = c.interpolate({
// //     inputRange: [0, 0.6, 1],
// //     outputRange: [0, 0, 1],
// //   });

// //   return (
// //     <View style={{ width, height: H, overflow: "hidden" }}>
// //       {isClap && (
// //         <Animated.View
// //           pointerEvents="none"
// //           style={{ position: "absolute", left: 0, top: 0, opacity: marksOpacity }}
// //         >
// //           <Svg width={width} height={H} viewBox="0 0 320 150">
// //             {MARKS.map((m, i) => (
// //               <Line key={i} x1={m[0]} y1={m[1]} x2={m[2]} y2={m[3]} {...stroke} />
// //             ))}
// //           </Svg>
// //         </Animated.View>
// //       )}

// //       {items.map((it, i) => {
// //         const amp = isClap ? 10 : 6;

// //         const rotate = c.interpolate({
// //           inputRange: [0, 1],
// //           outputRange: [`${it.rot}deg`, `${it.rot + it.dir * amp}deg`],
// //         });

// //         const lift = enter[i].interpolate({
// //           inputRange: [0, 1],
// //           outputRange: [hh + 30, 0],
// //         });

// //         const bounce = c.interpolate({
// //           inputRange: [0, 1],
// //           outputRange: [0, isClap ? -5 * s : 0],
// //         });

// //         // rotate around the bottom of the hand (the "arm" pivot)
// //         const style: any = {
// //           position: "absolute",
// //           left: it.cx * s - hw / 2,
// //           top: it.top * s,
// //           width: hw,
// //           height: hh,
// //           transform: [
// //             { translateY: lift },
// //             { translateY: bounce },
// //             { translateY: hh / 2 },
// //             { rotate },
// //             { translateY: -hh / 2 },
// //           ],
// //         };

// //         return (
// //           <Animated.View key={i} style={style}>
// //             <HandSvg tip={!isClap} sleeve={it.sleeve} w={hw} h={hh} />
// //           </Animated.View>
// //         );
// //       })}
// //     </View>
// //   );
// // }

// // /* =========================================================
// //    POINTER HAND (the hint hand in the levels)
// //    REAL hand photo (pointer_hand.png) - lifts up, taps down
// //    and a ripple appears under the fingertip
// //    PNG size 258 x 597, fingertip at about (35%, 3%)
// // ========================================================= */

// // const HAND_IMG = require("../../../assets/pointer_hand.png");
// // const HAND_RATIO = 597 / 258;

// // export function PointerHand({ w = 70 }: { w?: number }) {
// //   const k = w / 70;
// //   const h = w * HAND_RATIO;

// //   const p = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     const loop = Animated.loop(
// //       Animated.timing(p, {
// //         toValue: 1,
// //         duration: 1100,
// //         easing: Easing.linear,
// //         useNativeDriver: true,
// //       })
// //     );

// //     loop.start();

// //     return () => loop.stop();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const translateY = p.interpolate({
// //     inputRange: [0, 0.5, 0.68, 1],
// //     outputRange: [0, -16 * k, 3 * k, 0],
// //   });

// //   const scale = p.interpolate({
// //     inputRange: [0, 0.5, 0.68, 1],
// //     outputRange: [1, 1, 0.97, 1],
// //   });

// //   const ringScale = p.interpolate({
// //     inputRange: [0, 0.66, 1],
// //     outputRange: [0.2, 0.2, 1.6],
// //   });

// //   const ringOpacity = p.interpolate({
// //     inputRange: [0, 0.66, 0.7, 1],
// //     outputRange: [0, 0, 0.75, 0],
// //   });

// //   const ring = 34 * k;

// //   return (
// //     <View style={{ width: w, height: h }}>
// //       {/* tap ripple at the fingertip */}
// //       <Animated.View
// //         pointerEvents="none"
// //         style={{
// //           position: "absolute",
// //           left: w * 0.35 - ring / 2,
// //           top: h * 0.02 - ring / 2,
// //           width: ring,
// //           height: ring,
// //           borderRadius: ring / 2,
// //           borderWidth: 2.5,
// //           borderColor: INK,
// //           opacity: ringOpacity,
// //           transform: [{ scale: ringScale }],
// //         }}
// //       />

// //       <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
// //         <Image source={HAND_IMG} style={{ width: w, height: h }} resizeMode="contain" />
// //       </Animated.View>
// //     </View>
// //   );
// // }

// // export default CelebrationHands;
// import React, { useEffect, useRef } from "react";

// import { View, Animated, Easing, Image } from "react-native";

// const INK = "#1D1D1D";

// /* =========================================================
//    IMAGES  (both files live in  code-breaker/assets/ )
//    celebration_hands.png : 870 x 472  (3 pairs of clapping hands)
//    pointer_hand.png      : 258 x 597  (pointing finger hint hand)
// ========================================================= */

// const CLAP_IMG = require("../../../assets/celebration_hands.png");
// const HAND_IMG = require("../../../assets/pointer_hand.png");

// const CLAP_RATIO = 472 / 870;
// const HAND_RATIO = 597 / 258;

// /* =========================================================
//    CELEBRATION HANDS (animated)
//    slides up from the bottom, then keeps clapping
//    (small bounce + sway). Same image for "clap" and "tips".
// ========================================================= */

// type HandsProps = {
//   variant?: "clap" | "tips";
//   width?: number;
// };

// export function CelebrationHands({ variant = "clap", width = 320 }: HandsProps) {
//   const h = width * CLAP_RATIO;

//   const enter = useRef(new Animated.Value(0)).current;
//   const c = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const intro = Animated.spring(enter, {
//       toValue: 1,
//       friction: 6,
//       tension: 50,
//       useNativeDriver: true,
//     });

//     intro.start();

//     const dur = variant === "clap" ? 320 : 550;

//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(c, {
//           toValue: 1,
//           duration: dur,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         }),
//         Animated.timing(c, {
//           toValue: 0,
//           duration: dur,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         }),
//       ])
//     );

//     const timer = setTimeout(() => loop.start(), 600);

//     return () => {
//       clearTimeout(timer);
//       loop.stop();
//       intro.stop();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [variant]);

//   const lift = enter.interpolate({
//     inputRange: [0, 1],
//     outputRange: [h + 20, 0],
//   });

//   const bounce = c.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -8],
//   });

//   const sway = c.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["-1.5deg", "1.5deg"],
//   });

//   return (
//     <View style={{ width, height: h, overflow: "hidden" }}>
//       <Animated.View
//         style={{
//           width,
//           height: h,
//           transform: [
//             { translateY: lift },
//             { translateY: bounce },
//             { translateY: h / 2 },
//             { rotate: sway },
//             { translateY: -h / 2 },
//           ],
//         }}
//       >
//         <Image
//           source={CLAP_IMG}
//           style={{ width, height: h }}
//           resizeMode="contain"
//         />
//       </Animated.View>
//     </View>
//   );
// }

// /* =========================================================
//    POINTER HAND (the hint hand in the levels)
//    REAL hand photo - lifts up, taps down and a ripple
//    appears under the fingertip
// ========================================================= */

// export function PointerHand({ w = 70 }: { w?: number }) {
//   const k = w / 70;
//   const h = w * HAND_RATIO;

//   const p = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.timing(p, {
//         toValue: 1,
//         duration: 1100,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     );

//     loop.start();

//     return () => loop.stop();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const translateY = p.interpolate({
//     inputRange: [0, 0.5, 0.68, 1],
//     outputRange: [0, -16 * k, 3 * k, 0],
//   });

//   const scale = p.interpolate({
//     inputRange: [0, 0.5, 0.68, 1],
//     outputRange: [1, 1, 0.97, 1],
//   });

//   const ringScale = p.interpolate({
//     inputRange: [0, 0.66, 1],
//     outputRange: [0.2, 0.2, 1.6],
//   });

//   const ringOpacity = p.interpolate({
//     inputRange: [0, 0.66, 0.7, 1],
//     outputRange: [0, 0, 0.75, 0],
//   });

//   const ring = 34 * k;

//   return (
//     <View style={{ width: w, height: h }}>
//       {/* tap ripple at the fingertip */}
//       <Animated.View
//         pointerEvents="none"
//         style={{
//           position: "absolute",
//           left: w * 0.35 - ring / 2,
//           top: h * 0.02 - ring / 2,
//           width: ring,
//           height: ring,
//           borderRadius: ring / 2,
//           borderWidth: 2.5,
//           borderColor: INK,
//           opacity: ringOpacity,
//           transform: [{ scale: ringScale }],
//         }}
//       />

//       <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
//         <Image source={HAND_IMG} style={{ width: w, height: h }} resizeMode="contain" />
//       </Animated.View>
//     </View>
//   );
// }

// export default CelebrationHands;
import React, { useEffect, useRef } from "react";

import { View, Animated, Easing, Image, Dimensions, StyleSheet } from "react-native";

import Svg, { Line } from "react-native-svg";

const INK = "#1D1D1D";
const SCREEN = Dimensions.get("window");

/* =========================================================
   IMAGES  (all files live in  code-breaker/assets/ )
   pointer_hand.png        : 258 x 597  (pointing finger hint hand)
   clap/clap_*.png         : 870 x 472 each (same canvas, stacked)
     clap_base  -> arms + cuffs (never moves)
     clap_b1/b2/b5 -> back hands   (left pair / middle pair / right pair)
     clap_f1/f3/f6 -> front hands  (left pair / middle pair / right pair)
========================================================= */

const HAND_IMG = require("../../../assets/pointer_hand.png");
const HAND_RATIO = 597 / 258;

const CW = 870; // clap canvas width
const CH = 472; // clap canvas height
const HEAD = 90; // empty space above the hands for the clap lines

const BASE_IMG = require("../../../assets/clap_base.png");

// px,py = wrist pivot (in 870x472 canvas), sg = which way the hand opens (+ clockwise)
const LAYERS = [
  { img: require("../../../assets/clap_b1.png"), px: 145, py: 270, sg: -1, pair: 0 },
  { img: require("../../../assets/clap_b2.png"), px: 402, py: 258, sg: 1, pair: 1 },
  { img: require("../../../assets/clap_b5.png"), px: 655, py: 292, sg: -1, pair: 2 },
  { img: require("../../../assets/clap_f1.png"), px: 240, py: 268, sg: 1, pair: 0 },
  { img: require("../../../assets/clap_f3.png"), px: 448, py: 268, sg: -1, pair: 1 },
  { img: require("../../../assets/clap_f6.png"), px: 757, py: 302, sg: 1, pair: 2 },
];

// little "clap" tick lines above every pair  [x1,y1,x2,y2]  (canvas coords, y can be negative)
const MARKS = [
  [
    [172, 0, 152, -20],
    [200, -12, 192, -42],
    [232, -14, 240, -44],
    [262, 6, 284, -14],
  ],
  [
    [392, -6, 372, -26],
    [420, -18, 414, -48],
    [452, -18, 460, -48],
    [484, -4, 506, -22],
  ],
  [
    [690, 22, 670, 2],
    [718, 8, 710, -22],
    [750, 8, 758, -22],
    [782, 28, 804, 8],
  ],
];

const AMP = 5; // degrees the hands open

/* =========================================================
   CELEBRATION HANDS (animated)
   hands slide up from the bottom, then every pair keeps
   clapping (open -> snap shut) with small lines at the clap
========================================================= */

type HandsProps = {
  variant?: "clap" | "tips";
  width?: number;
};

export function CelebrationHands({ variant = "clap", width = 320 }: HandsProps) {
  const s = width / CW;
  const hh = CH * s;
  const total = (CH + HEAD) * s;

  const enter = useRef(new Animated.Value(0)).current;
  const cv = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const intro = Animated.spring(enter, {
      toValue: 1,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    });
    intro.start();

    const slow = variant === "tips" ? 1.8 : 1;
    const delays = [0, 130, 70];

    const loops = cv.map((v) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, {
            toValue: 1,
            duration: 280 * slow,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: 110 * slow,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(90 * slow),
        ])
      )
    );

    const timers = loops.map((l, i) => setTimeout(() => l.start(), 700 + delays[i]));

    return () => {
      timers.forEach(clearTimeout);
      loops.forEach((l) => l.stop());
      intro.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const lift = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [total + 20, 0],
  });

  const fill = { position: "absolute" as const, left: 0, top: HEAD * s, width, height: hh };

  return (
    <View style={{ width, height: total, overflow: "hidden" }}>
      <Animated.View style={{ width, height: total, transform: [{ translateY: lift }] }}>
        {/* clap lines (visible only when the hands are shut) */}
        {MARKS.map((pair, i) => (
          <Animated.View
            key={"m" + i}
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              opacity: cv[i].interpolate({ inputRange: [0, 0.25, 1], outputRange: [1, 0, 0] }),
            }}
          >
            <Svg width={width} height={total} viewBox={`0 ${-HEAD} ${CW} ${CH + HEAD}`}>
              {pair.map((m, j) => (
                <Line
                  key={j}
                  x1={m[0]}
                  y1={m[1]}
                  x2={m[2]}
                  y2={m[3]}
                  stroke={INK}
                  strokeWidth={8}
                  strokeLinecap="round"
                />
              ))}
            </Svg>
          </Animated.View>
        ))}

        {/* hands: back hands first, front hands on top */}
        {LAYERS.map((L, i) => {
          const dx = L.px * s - width / 2;
          const dy = L.py * s - hh / 2;
          const rotate = cv[L.pair].interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", `${L.sg * AMP}deg`],
          });
          return (
            <Animated.View
              key={i}
              style={[
                fill,
                {
                  transform: [
                    { translateX: dx },
                    { translateY: dy },
                    { rotate },
                    { translateX: -dx },
                    { translateY: -dy },
                  ],
                },
              ]}
            >
              <Image source={L.img} style={{ width, height: hh }} resizeMode="contain" />
            </Animated.View>
          );
        })}

        {/* arms + cuffs, always still, drawn last so the wrists look joined */}
        <View style={fill}>
          <Image source={BASE_IMG} style={{ width, height: hh }} resizeMode="contain" />
        </View>
      </Animated.View>
    </View>
  );
}

/* =========================================================
   CONFETTI (coloured paper falling from the top)
   pieces flutter left/right, flip and spin while they fall
========================================================= */

const COL = ["#d9b3f5", "#ffe27a", "#8ff0fa", "#c5f158", "#ff6b6b"];
const N = 70;

export function Confetti() {
  const W = SCREEN.width;
  const Hs = SCREEN.height;

  const p = useRef(
    Array.from({ length: N }, (_, i) => {
      const big = Math.random() < 0.3;
      return {
        v: new Animated.Value(0),
        x: W * 0.15 + Math.random() * W * 0.7,
        c: COL[i % COL.length],
        w: big ? 16 + Math.random() * 10 : 8 + Math.random() * 8,
        h: big ? 9 + Math.random() * 6 : 5 + Math.random() * 6,
        d: 2800 + Math.random() * 2400,
        delay: Math.random() * 900,
        sway: 14 + Math.random() * 26,
        drift: (Math.random() - 0.5) * 160,
        spin: (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 720),
        r0: Math.random() * 360,
      };
    })
  ).current;

  useEffect(() => {
    const anims = p.map((o) =>
      Animated.timing(o.v, {
        toValue: 1,
        duration: o.d,
        delay: o.delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {p.map((o, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            left: o.x,
            top: -30,
            width: o.w,
            height: o.h,
            backgroundColor: o.c,
            opacity: o.v.interpolate({
              inputRange: [0, 0.02, 0.85, 1],
              outputRange: [0, 1, 1, 0],
            }),
            transform: [
              { translateY: o.v.interpolate({ inputRange: [0, 1], outputRange: [0, Hs * 0.95] }) },
              {
                translateX: o.v.interpolate({
                  inputRange: [0, 0.25, 0.5, 0.75, 1],
                  outputRange: [
                    0,
                    o.sway + o.drift * 0.25,
                    o.drift * 0.5,
                    -o.sway + o.drift * 0.75,
                    o.drift,
                  ],
                }),
              },
              {
                rotate: o.v.interpolate({
                  inputRange: [0, 1],
                  outputRange: [o.r0 + "deg", o.r0 + o.spin + "deg"],
                }),
              },
              {
                scaleY: o.v.interpolate({
                  inputRange: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
                  outputRange: [1, 0.25, 1, 0.25, 1, 0.25, 1, 0.25],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}

/* =========================================================
   POINTER HAND (the hint hand in the levels)
   REAL hand photo - lifts up, taps down and a ripple
   appears under the fingertip
========================================================= */

export function PointerHand({ w = 70 }: { w?: number }) {
  const k = w / 70;
  const h = w * HAND_RATIO;

  const p = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(p, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    loop.start();

    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = p.interpolate({
    inputRange: [0, 0.5, 0.68, 1],
    outputRange: [0, -16 * k, 3 * k, 0],
  });

  const scale = p.interpolate({
    inputRange: [0, 0.5, 0.68, 1],
    outputRange: [1, 1, 0.97, 1],
  });

  const ringScale = p.interpolate({
    inputRange: [0, 0.66, 1],
    outputRange: [0.2, 0.2, 1.6],
  });

  const ringOpacity = p.interpolate({
    inputRange: [0, 0.66, 0.7, 1],
    outputRange: [0, 0, 0.75, 0],
  });

  const ring = 34 * k;

  return (
    <View style={{ width: w, height: h }}>
      {/* tap ripple at the fingertip */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: w * 0.35 - ring / 2,
          top: h * 0.02 - ring / 2,
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          borderWidth: 2.5,
          borderColor: INK,
          opacity: ringOpacity,
          transform: [{ scale: ringScale }],
        }}
      />

      <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
        <Image source={HAND_IMG} style={{ width: w, height: h }} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

export default CelebrationHands;
