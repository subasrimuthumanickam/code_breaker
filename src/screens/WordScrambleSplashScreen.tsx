// // import React, { useEffect, useRef } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Animated,
// //   Easing,
// //   SafeAreaView,
// //   StatusBar,
// //   useWindowDimensions,
// // } from "react-native";

// // /* =====================================================
// //    THEME — matches Wordscramblehomescreen.tsx palette
// // ===================================================== */
// // const C = {
// //   bg: "#FFF9F0",
// //   navy: "#172033",
// //   coral: "#FF6B5A",
// //   indigo: "#5146E5",
// //   yellow: "#F4B942",
// //   blue: "#3B82F6",
// //   green: "#26B67A",
// //   sub: "#7B8491",
// // };

// // const LETTERS = [
// //   { char: "W", color: C.yellow, rotate: "-6deg" },
// //   { char: "O", color: C.blue, rotate: "6deg" },
// //   { char: "R", color: C.coral, rotate: "-4deg" },
// //   { char: "D", color: C.green, rotate: "5deg" },
// // ];

// // export interface WordScrambleSplashScreenProps {
// //   /** Called once the splash animation has finished playing. */
// //   onFinish?: () => void;
// //   /** Total time (ms) the splash stays on screen before onFinish fires. Default 2200ms. */
// //   durationMs?: number;
// // }

// // /* -----------------------------------------------------
// //    One soft, slow-drifting colour blob used to give the
// //    background life without distracting from the logo.
// // ----------------------------------------------------- */
// // const Blob: React.FC<{
// //   color: string;
// //   size: number;
// //   startX: number;
// //   startY: number;
// //   driftX: number;
// //   driftY: number;
// //   duration: number;
// //   opacity?: number;
// // }> = ({ color, size, startX, startY, driftX, driftY, duration, opacity = 0.16 }) => {
// //   const anim = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     const loop = Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(anim, {
// //           toValue: 1,
// //           duration,
// //           easing: Easing.inOut(Easing.sin),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(anim, {
// //           toValue: 0,
// //           duration,
// //           easing: Easing.inOut(Easing.sin),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     );
// //     loop.start();
// //     return () => loop.stop();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, driftX] });
// //   const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, driftY] });
// //   const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });

// //   return (
// //     <Animated.View
// //       pointerEvents="none"
// //       style={{
// //         position: "absolute",
// //         left: startX,
// //         top: startY,
// //         width: size,
// //         height: size,
// //         borderRadius: size / 2,
// //         backgroundColor: color,
// //         opacity,
// //         transform: [{ translateX }, { translateY }, { scale }],
// //       }}
// //     />
// //   );
// // };

// // /* -----------------------------------------------------
// //    A single letter tile that floats gently in place and
// //    fades/rotates in on mount, staggered by `delay`.
// // ----------------------------------------------------- */
// // const FloatingLetter: React.FC<{
// //   char: string;
// //   color: string;
// //   baseRotate: string;
// //   left: number;
// //   top: number;
// //   delay: number;
// //   size?: number;
// // }> = ({ char, color, baseRotate, left, top, delay, size = 54 }) => {
// //   const enter = useRef(new Animated.Value(0)).current;
// //   const bob = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     Animated.sequence([
// //       Animated.delay(delay),
// //       Animated.spring(enter, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
// //     ]).start();

// //     const bobLoop = Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(bob, {
// //           toValue: 1,
// //           duration: 1800 + Math.random() * 700,
// //           easing: Easing.inOut(Easing.sin),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(bob, {
// //           toValue: 0,
// //           duration: 1800 + Math.random() * 700,
// //           easing: Easing.inOut(Easing.sin),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     );
// //     const t = setTimeout(() => bobLoop.start(), delay);
// //     return () => {
// //       clearTimeout(t);
// //       bobLoop.stop();
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
// //   const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
// //   const opacity = enter;

// //   return (
// //     <Animated.View
// //       pointerEvents="none"
// //       style={{
// //         position: "absolute",
// //         left,
// //         top,
// //         width: size,
// //         height: size,
// //         borderRadius: size * 0.26,
// //         backgroundColor: color,
// //         alignItems: "center",
// //         justifyContent: "center",
// //         opacity,
// //         shadowColor: "#000",
// //         shadowOffset: { width: 0, height: 4 },
// //         shadowOpacity: 0.12,
// //         shadowRadius: 6,
// //         elevation: 3,
// //         transform: [{ translateY }, { scale }, { rotate: baseRotate }],
// //       }}
// //     >
// //       <Text style={{ color: "#FFFFFF", fontSize: size * 0.42, fontWeight: "900" }}>{char}</Text>
// //     </Animated.View>
// //   );
// // };

// // const WordScrambleSplashScreen: React.FC<WordScrambleSplashScreenProps> = ({
// //   onFinish,
// //   durationMs = 2200,
// // }) => {
// //   const { width, height } = useWindowDimensions();

// //   const logoScale = useRef(new Animated.Value(0.3)).current;
// //   const logoOpacity = useRef(new Animated.Value(0)).current;
// //   const logoRotate = useRef(new Animated.Value(-8)).current;
// //   const brandOpacity = useRef(new Animated.Value(0)).current;
// //   const brandTranslate = useRef(new Animated.Value(14)).current;
// //   const dot1 = useRef(new Animated.Value(0.3)).current;
// //   const dot2 = useRef(new Animated.Value(0.3)).current;
// //   const dot3 = useRef(new Animated.Value(0.3)).current;

// //   useEffect(() => {
// //     Animated.sequence([
// //       Animated.parallel([
// //         Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
// //         Animated.timing(logoOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
// //         Animated.spring(logoRotate, { toValue: 0, friction: 6, tension: 60, useNativeDriver: true }),
// //       ]),
// //       Animated.parallel([
// //         Animated.timing(brandOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
// //         Animated.timing(brandTranslate, {
// //           toValue: 0,
// //           duration: 380,
// //           easing: Easing.out(Easing.cubic),
// //           useNativeDriver: true,
// //         }),
// //       ]),
// //     ]).start();

// //     const pulse = (val: Animated.Value, delay: number) =>
// //       Animated.loop(
// //         Animated.sequence([
// //           Animated.delay(delay),
// //           Animated.timing(val, { toValue: 1, duration: 420, useNativeDriver: true }),
// //           Animated.timing(val, { toValue: 0.3, duration: 420, useNativeDriver: true }),
// //         ])
// //       );
// //     const l1 = pulse(dot1, 0);
// //     const l2 = pulse(dot2, 140);
// //     const l3 = pulse(dot3, 280);
// //     l1.start();
// //     l2.start();
// //     l3.start();

// //     const t = setTimeout(() => {
// //       onFinish?.();
// //     }, durationMs);

// //     return () => {
// //       clearTimeout(t);
// //       l1.stop();
// //       l2.stop();
// //       l3.stop();
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const rotateInterpolated = logoRotate.interpolate({
// //     inputRange: [-8, 0],
// //     outputRange: ["-8deg", "0deg"],
// //   });

// //   return (
// //     <View style={styles.flex}>
// //       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
// //       <SafeAreaView style={styles.flex}>
// //         <View style={styles.root}>
// //           {/* ---- animated backdrop ---- */}
// //           <Blob color={C.indigo} size={340} startX={-90} startY={-70} driftX={40} driftY={30} duration={4200} />
// //           <Blob color={C.coral} size={260} startX={width - 170} startY={height * 0.12} driftX={-30} driftY={40} duration={3600} />
// //           <Blob color={C.yellow} size={220} startX={width * 0.55} startY={height - 220} driftX={30} driftY={-30} duration={5000} opacity={0.18} />
// //           <Blob color={C.green} size={200} startX={-60} startY={height - 180} driftX={35} driftY={-25} duration={4700} opacity={0.14} />

// //           <FloatingLetter char="W" color={C.yellow} baseRotate="-8deg" left={width * 0.14} top={height * 0.2} delay={120} />
// //           <FloatingLetter char="O" color={C.blue} baseRotate="7deg" left={width * 0.72} top={height * 0.18} delay={260} />
// //           <FloatingLetter char="R" color={C.coral} baseRotate="-5deg" left={width * 0.68} top={height * 0.68} delay={400} />
// //           <FloatingLetter char="D" color={C.green} baseRotate="6deg" left={width * 0.12} top={height * 0.66} delay={540} />

// //           {/* ---- centre logo ---- */}
// //           <View style={styles.center}>
// //             <Animated.View
// //               style={[
// //                 styles.logoBadge,
// //                 {
// //                   opacity: logoOpacity,
// //                   transform: [{ scale: logoScale }, { rotate: rotateInterpolated }],
// //                 },
// //               ]}
// //             >
// //               <Text style={styles.logoW}>W</Text>
// //               <Text style={styles.logoS}>S</Text>
// //             </Animated.View>

// //             <Animated.View
// //               style={{
// //                 opacity: brandOpacity,
// //                 transform: [{ translateY: brandTranslate }],
// //                 alignItems: "center",
// //               }}
// //             >
// //               <Text style={styles.brandTitle}>
// //                 Word <Text style={styles.brandAccent}>Scramble</Text>
// //               </Text>
// //               <Text style={styles.brandSubtitle}>Think fast. Play smart.</Text>
// //             </Animated.View>

// //             <View style={styles.dotsRow}>
// //               <Animated.View style={[styles.dot, { opacity: dot1 }]} />
// //               <Animated.View style={[styles.dot, { opacity: dot2 }]} />
// //               <Animated.View style={[styles.dot, { opacity: dot3 }]} />
// //             </View>
// //           </View>
// //         </View>
// //       </SafeAreaView>
// //     </View>
// //   );
// // };

// // export default WordScrambleSplashScreen;

// // const styles = StyleSheet.create({
// //   flex: { flex: 1, backgroundColor: C.bg },
// //   root: { flex: 1, backgroundColor: C.bg, overflow: "hidden" },
// //   center: {
// //     flex: 1,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 14,
// //   },
// //   logoBadge: {
// //     width: 96,
// //     height: 96,
// //     borderRadius: 28,
// //     backgroundColor: C.navy,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     flexDirection: "row",
// //     marginBottom: 6,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 10 },
// //     shadowOpacity: 0.18,
// //     shadowRadius: 18,
// //     elevation: 8,
// //   },
// //   logoW: { color: C.yellow, fontSize: 34, fontWeight: "900" },
// //   logoS: { color: C.coral, fontSize: 34, fontWeight: "900" },
// //   brandTitle: { color: C.navy, fontSize: 26, fontWeight: "900" },
// //   brandAccent: { color: C.coral },
// //   brandSubtitle: { color: C.sub, fontSize: 13, fontWeight: "600", marginTop: 4 },
// //   dotsRow: { flexDirection: "row", gap: 8, marginTop: 22 },
// //   dot: {
// //     width: 9,
// //     height: 9,
// //     borderRadius: 5,
// //     backgroundColor: C.indigo,
// //   },
// // });
// import React, { useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   Easing,
//   SafeAreaView,
//   StatusBar,
//   useWindowDimensions,
// } from "react-native";
// // NOTE: adjust this relative path to match where you place the shared file
// import WordScrambleAnimatedBackground from "../components/WordScrambleAnimatedBackground";

// /* =====================================================
//    THEME — matches Wordscramblehomescreen.tsx palette
// ===================================================== */
// const C = {
//   bg: "#FFF9F0",
//   navy: "#172033",
//   coral: "#FF6B5A",
//   indigo: "#5146E5",
//   yellow: "#F4B942",
//   blue: "#3B82F6",
//   green: "#26B67A",
//   sub: "#7B8491",
// };

// const LETTERS = [
//   { char: "W", color: C.yellow, rotate: "-6deg" },
//   { char: "O", color: C.blue, rotate: "6deg" },
//   { char: "R", color: C.coral, rotate: "-4deg" },
//   { char: "D", color: C.green, rotate: "5deg" },
// ];

// export interface WordScrambleSplashScreenProps {
//   /** Called once the splash animation has finished playing. */
//   onFinish?: () => void;
//   /** Total time (ms) the splash stays on screen before onFinish fires. Default 2200ms. */
//   durationMs?: number;
// }

// /* -----------------------------------------------------
//    A single letter tile that floats gently in place and
//    fades/rotates in on mount, staggered by `delay`.
// ----------------------------------------------------- */
// const FloatingLetter: React.FC<{
//   char: string;
//   color: string;
//   baseRotate: string;
//   left: number;
//   top: number;
//   delay: number;
//   size?: number;
// }> = ({ char, color, baseRotate, left, top, delay, size = 54 }) => {
//   const enter = useRef(new Animated.Value(0)).current;
//   const bob = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.sequence([
//       Animated.delay(delay),
//       Animated.spring(enter, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
//     ]).start();

//     const bobLoop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(bob, {
//           toValue: 1,
//           duration: 1800 + Math.random() * 700,
//           easing: Easing.inOut(Easing.sin),
//           useNativeDriver: true,
//         }),
//         Animated.timing(bob, {
//           toValue: 0,
//           duration: 1800 + Math.random() * 700,
//           easing: Easing.inOut(Easing.sin),
//           useNativeDriver: true,
//         }),
//       ])
//     );
//     const t = setTimeout(() => bobLoop.start(), delay);
//     return () => {
//       clearTimeout(t);
//       bobLoop.stop();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
//   const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
//   const opacity = enter;

//   return (
//     <Animated.View
//       pointerEvents="none"
//       style={{
//         position: "absolute",
//         left,
//         top,
//         width: size,
//         height: size,
//         borderRadius: size * 0.26,
//         backgroundColor: color,
//         alignItems: "center",
//         justifyContent: "center",
//         opacity,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.12,
//         shadowRadius: 6,
//         elevation: 3,
//         transform: [{ translateY }, { scale }, { rotate: baseRotate }],
//       }}
//     >
//       <Text style={{ color: "#FFFFFF", fontSize: size * 0.42, fontWeight: "900" }}>{char}</Text>
//     </Animated.View>
//   );
// };

// const WordScrambleSplashScreen: React.FC<WordScrambleSplashScreenProps> = ({
//   onFinish,
//   durationMs = 2200,
// }) => {
//   const { width, height } = useWindowDimensions();

//   const logoScale = useRef(new Animated.Value(0.3)).current;
//   const logoOpacity = useRef(new Animated.Value(0)).current;
//   const logoRotate = useRef(new Animated.Value(-8)).current;
//   const brandOpacity = useRef(new Animated.Value(0)).current;
//   const brandTranslate = useRef(new Animated.Value(14)).current;
//   const dot1 = useRef(new Animated.Value(0.3)).current;
//   const dot2 = useRef(new Animated.Value(0.3)).current;
//   const dot3 = useRef(new Animated.Value(0.3)).current;

//   useEffect(() => {
//     Animated.sequence([
//       Animated.parallel([
//         Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
//         Animated.timing(logoOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
//         Animated.spring(logoRotate, { toValue: 0, friction: 6, tension: 60, useNativeDriver: true }),
//       ]),
//       Animated.parallel([
//         Animated.timing(brandOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
//         Animated.timing(brandTranslate, {
//           toValue: 0,
//           duration: 380,
//           easing: Easing.out(Easing.cubic),
//           useNativeDriver: true,
//         }),
//       ]),
//     ]).start();

//     const pulse = (val: Animated.Value, delay: number) =>
//       Animated.loop(
//         Animated.sequence([
//           Animated.delay(delay),
//           Animated.timing(val, { toValue: 1, duration: 420, useNativeDriver: true }),
//           Animated.timing(val, { toValue: 0.3, duration: 420, useNativeDriver: true }),
//         ])
//       );
//     const l1 = pulse(dot1, 0);
//     const l2 = pulse(dot2, 140);
//     const l3 = pulse(dot3, 280);
//     l1.start();
//     l2.start();
//     l3.start();

//     const t = setTimeout(() => {
//       onFinish?.();
//     }, durationMs);

//     return () => {
//       clearTimeout(t);
//       l1.stop();
//       l2.stop();
//       l3.stop();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const rotateInterpolated = logoRotate.interpolate({
//     inputRange: [-8, 0],
//     outputRange: ["-8deg", "0deg"],
//   });

//   return (
//     <View style={styles.flex}>
//       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
//       <SafeAreaView style={styles.flex}>
//         <View style={styles.root}>
//           {/* ---- shared animated backdrop (blobs + sparkles + ghost letters) ---- */}
//           <WordScrambleAnimatedBackground backgroundColor={C.bg} />

//           <FloatingLetter char="W" color={C.yellow} baseRotate="-8deg" left={width * 0.14} top={height * 0.2} delay={120} />
//           <FloatingLetter char="O" color={C.blue} baseRotate="7deg" left={width * 0.72} top={height * 0.18} delay={260} />
//           <FloatingLetter char="R" color={C.coral} baseRotate="-5deg" left={width * 0.68} top={height * 0.68} delay={400} />
//           <FloatingLetter char="D" color={C.green} baseRotate="6deg" left={width * 0.12} top={height * 0.66} delay={540} />

//           {/* ---- centre logo ---- */}
//           <View style={styles.center}>
//             <Animated.View
//               style={[
//                 styles.logoBadge,
//                 {
//                   opacity: logoOpacity,
//                   transform: [{ scale: logoScale }, { rotate: rotateInterpolated }],
//                 },
//               ]}
//             >
//               <Text style={styles.logoW}>W</Text>
//               <Text style={styles.logoS}>S</Text>
//             </Animated.View>

//             <Animated.View
//               style={{
//                 opacity: brandOpacity,
//                 transform: [{ translateY: brandTranslate }],
//                 alignItems: "center",
//               }}
//             >
//               <Text style={styles.brandTitle}>
//                 Word <Text style={styles.brandAccent}>Scramble</Text>
//               </Text>
//               <Text style={styles.brandSubtitle}>Think fast. Play smart.</Text>
//             </Animated.View>

//             <View style={styles.dotsRow}>
//               <Animated.View style={[styles.dot, { opacity: dot1 }]} />
//               <Animated.View style={[styles.dot, { opacity: dot2 }]} />
//               <Animated.View style={[styles.dot, { opacity: dot3 }]} />
//             </View>
//           </View>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// };

// export default WordScrambleSplashScreen;

// const styles = StyleSheet.create({
//   flex: { flex: 1, backgroundColor: C.bg },
//   root: { flex: 1, backgroundColor: C.bg, overflow: "hidden" },
//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 14,
//   },
//   logoBadge: {
//     width: 96,
//     height: 96,
//     borderRadius: 28,
//     backgroundColor: C.navy,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     marginBottom: 6,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.18,
//     shadowRadius: 18,
//     elevation: 8,
//   },
//   logoW: { color: C.yellow, fontSize: 34, fontWeight: "900" },
//   logoS: { color: C.coral, fontSize: 34, fontWeight: "900" },
//   brandTitle: { color: C.navy, fontSize: 26, fontWeight: "900" },
//   brandAccent: { color: C.coral },
//   brandSubtitle: { color: C.sub, fontSize: 13, fontWeight: "600", marginTop: 4 },
//   dotsRow: { flexDirection: "row", gap: 8, marginTop: 22 },
//   dot: {
//     width: 9,
//     height: 9,
//     borderRadius: 5,
//     backgroundColor: C.indigo,
//   },
// });
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from "react-native";

/* =====================================================
   THEME — matches Word Scramble home screen (mint / teal / tangerine)
===================================================== */
const C = {
  bg: "#D9F5E8",
  bgSoft: "#C6EEDC",
  ring: "#A9E0CC",
  ink: "#0E3B3C",
  teal: "#14A38B",
  tealDark: "#0E7F6D",
  orange: "#FF8A3D",
  tile: "#FFF3D6",
  tileBorder: "#E8D39A",
  tileEdge: "#D9BF7A",
  sub: "#4F7A74",
};

export interface WordScrambleSplashScreenProps {
  /** Called once the splash animation has finished playing. */
  onFinish?: () => void;
  /** Total time (ms) the splash stays on screen before onFinish fires. Default 2200ms. */
  durationMs?: number;
}

/* -----------------------------------------------------
   Pulsing ring for the background
----------------------------------------------------- */
const Ring: React.FC<{
  size: number;
  left: number;
  top: number;
  delay?: number;
}> = ({ size, left, top, delay = 0 }) => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.25] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: C.ring,
        opacity,
        transform: [{ scale }],
      }}
    />
  );
};

/* -----------------------------------------------------
   Cream letter tile (same look as home screen tiles).
   Floats gently + springs in on mount, staggered by `delay`.
----------------------------------------------------- */
const FloatingTile: React.FC<{
  char: string;
  points: number;
  letterColor: string;
  baseRotate: string;
  left: number;
  top: number;
  delay: number;
  size?: number;
}> = ({ char, points, letterColor, baseRotate, left, top, delay, size = 58 }) => {
  const enter = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(enter, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
    ]).start();

    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 1800 + Math.random() * 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1800 + Math.random() * 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    const t = setTimeout(() => bobLoop.start(), delay);
    return () => {
      clearTimeout(t);
      bobLoop.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        top,
        opacity: enter,
        transform: [{ translateY }, { scale }, { rotate: baseRotate }],
      }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.24,
          backgroundColor: C.tile,
          borderWidth: 2,
          borderColor: C.tileBorder,
          borderBottomWidth: 5,
          borderBottomColor: C.tileEdge,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#0E3B3C",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.14,
          shadowRadius: 7,
          elevation: 4,
        }}
      >
        <Text style={{ color: letterColor, fontSize: size * 0.46, fontWeight: "900" }}>{char}</Text>
        <Text
          style={{
            position: "absolute",
            right: 7,
            bottom: 4,
            color: C.sub,
            fontSize: size * 0.17,
            fontWeight: "800",
          }}
        >
          {points}
        </Text>
      </View>
    </Animated.View>
  );
};

const WordScrambleSplashScreen: React.FC<WordScrambleSplashScreenProps> = ({
  onFinish,
  durationMs = 2200,
}) => {
  const { width, height } = useWindowDimensions();

  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(-8)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslate = useRef(new Animated.Value(14)).current;
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.spring(logoRotate, { toValue: 0, friction: 6, tension: 60, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(brandOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(brandTranslate, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const pulse = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0.3, duration: 420, useNativeDriver: true }),
        ])
      );
    const l1 = pulse(dot1, 0);
    const l2 = pulse(dot2, 140);
    const l3 = pulse(dot3, 280);
    l1.start();
    l2.start();
    l3.start();

    const t = setTimeout(() => {
      onFinish?.();
    }, durationMs);

    return () => {
      clearTimeout(t);
      l1.stop();
      l2.stop();
      l3.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rotateInterpolated = logoRotate.interpolate({
    inputRange: [-8, 0],
    outputRange: ["-8deg", "0deg"],
  });

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <SafeAreaView style={styles.flex}>
        <View style={styles.root}>
          {/* ---- mint backdrop: soft circles + pulsing rings ---- */}
          <View
            pointerEvents="none"
            style={[
              styles.softCircle,
              { width: width * 0.9, height: width * 0.9, borderRadius: width * 0.45, left: -width * 0.35, top: -width * 0.25 },
            ]}
          />
          <View
            pointerEvents="none"
            style={[
              styles.softCircle,
              { width: width * 0.7, height: width * 0.7, borderRadius: width * 0.35, right: -width * 0.3, bottom: -width * 0.15 },
            ]}
          />
          <Ring size={width * 0.8} left={width * 0.1} top={height * 0.5 - width * 0.4} delay={0} />
          <Ring size={width * 1.15} left={-width * 0.075} top={height * 0.5 - width * 0.575} delay={500} />
          <Ring size={width * 1.5} left={-width * 0.25} top={height * 0.5 - width * 0.75} delay={1000} />

          {/* ---- floating tiles ---- */}
          <FloatingTile char="W" points={4} letterColor={C.ink} baseRotate="-8deg" left={width * 0.12} top={height * 0.19} delay={120} />
          <FloatingTile char="O" points={1} letterColor={C.orange} baseRotate="7deg" left={width * 0.70} top={height * 0.17} delay={260} />
          <FloatingTile char="R" points={1} letterColor={C.ink} baseRotate="-5deg" left={width * 0.68} top={height * 0.68} delay={400} />
          <FloatingTile char="D" points={2} letterColor={C.teal} baseRotate="6deg" left={width * 0.12} top={height * 0.66} delay={540} />

          {/* ---- centre logo ---- */}
          <View style={styles.center}>
            <Animated.View
              style={[
                styles.logoBadge,
                {
                  opacity: logoOpacity,
                  transform: [{ scale: logoScale }, { rotate: rotateInterpolated }],
                },
              ]}
            >
              <Text style={styles.logoW}>W</Text>
              <Text style={styles.logoS}>S</Text>
            </Animated.View>

            <Animated.View
              style={{
                opacity: brandOpacity,
                transform: [{ translateY: brandTranslate }],
                alignItems: "center",
              }}
            >
              <Text style={styles.brandTitle}>
                Word <Text style={styles.brandAccent}>Scramble</Text>
              </Text>
              <Text style={styles.brandSubtitle}>Think fast. Play smart.</Text>
            </Animated.View>

            <View style={styles.dotsRow}>
              <Animated.View style={[styles.dot, { opacity: dot1 }]} />
              <Animated.View style={[styles.dot, { opacity: dot2 }]} />
              <Animated.View style={[styles.dot, { opacity: dot3 }]} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WordScrambleSplashScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: C.bg },
  root: { flex: 1, backgroundColor: C.bg, overflow: "hidden" },
  softCircle: {
    position: "absolute",
    backgroundColor: C.bgSoft,
    opacity: 0.7,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  logoBadge: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: C.tile,
    borderWidth: 2.5,
    borderColor: C.tileBorder,
    borderBottomWidth: 6,
    borderBottomColor: C.tileEdge,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 6,
    shadowColor: "#0E3B3C",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  logoW: { color: C.teal, fontSize: 36, fontWeight: "900" },
  logoS: { color: C.orange, fontSize: 36, fontWeight: "900" },
  brandTitle: { color: C.ink, fontSize: 28, fontWeight: "900" },
  brandAccent: { color: C.teal },
  brandSubtitle: { color: C.sub, fontSize: 13, fontWeight: "600", marginTop: 4 },
  dotsRow: { flexDirection: "row", gap: 8, marginTop: 22 },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.teal,
  },
});