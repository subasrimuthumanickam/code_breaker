
// // import React, { useEffect, useRef } from "react";
// // import { View, Text, StyleSheet, Animated } from "react-native";
// // import { LinearGradient } from "expo-linear-gradient";
// // import { Ionicons } from "@expo/vector-icons";

// // interface SplashScreenProps {
// //   onFinish: () => void;
// // }

// // const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
// //   const scaleAnim = useRef(new Animated.Value(0.6)).current;
// //   const fadeAnim = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     Animated.parallel([
// //       Animated.spring(scaleAnim, {
// //         toValue: 1,
// //         friction: 5,
// //         tension: 60,
// //         useNativeDriver: true,
// //       }),
// //       Animated.timing(fadeAnim, {
// //         toValue: 1,
// //         duration: 600,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();

// //     const timer = setTimeout(onFinish, 2000);
// //     return () => clearTimeout(timer);
// //   }, [onFinish]);

// //   return (
// //     <LinearGradient colors={["#0F1226", "#171B3A", "#0B0E1F"]} style={styles.container}>
// //       <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim, alignItems: "center" }}>
// //         <LinearGradient colors={["#8B7CF6", "#6C5CE7"]} style={styles.logoBadge}>
// //           <Ionicons name="lock-closed" size={40} color="#FFFFFF" />
// //         </LinearGradient>

// //         <Text style={styles.title}>CODE BREAKER</Text>
// //         <Text style={styles.subtitle}>Crack The Code</Text>

// //         <View style={styles.loadingRow}>
// //           <View style={styles.dot} />
// //           <View style={[styles.dot, styles.dotDelay1]} />
// //           <View style={[styles.dot, styles.dotDelay2]} />
// //         </View>
// //       </Animated.View>
// //     </LinearGradient>
// //   );
// // };

// // export default SplashScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   logoBadge: {
// //     width: 96,
// //     height: 96,
// //     borderRadius: 48,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginBottom: 28,
// //     shadowColor: "#6C5CE7",
// //     shadowOpacity: 0.6,
// //     shadowRadius: 20,
// //     shadowOffset: { width: 0, height: 8 },
// //     elevation: 10,
// //   },
// //   title: {
// //     color: "#FFFFFF",
// //     fontSize: 30,
// //     fontWeight: "800",
// //     letterSpacing: 3,
// //   },
// //   subtitle: {
// //     color: "#A5B4FC",
// //     fontSize: 16,
// //     marginTop: 10,
// //   },
// //   loadingRow: {
// //     flexDirection: "row",
// //     marginTop: 40,
// //     gap: 8,
// //   },
// //   dot: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: "#6C5CE7",
// //     opacity: 0.4,
// //   },
// //   dotDelay1: {
// //     opacity: 0.7,
// //   },
// //   dotDelay2: {
// //     opacity: 1,
// //   },
// // });
// import React, { useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   Easing,
//   StatusBar,
//   Dimensions,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";

// interface SplashScreenProps {
//   onFinish: () => void;
// }

// const { width, height } = Dimensions.get("window");

// const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
//   // Main animations
//   const logoScale = useRef(new Animated.Value(0.65)).current;
//   const logoOpacity = useRef(new Animated.Value(0)).current;

//   const titleOpacity = useRef(new Animated.Value(0)).current;
//   const titleTranslate = useRef(new Animated.Value(18)).current;

//   const subtitleOpacity = useRef(new Animated.Value(0)).current;
//   const subtitleTranslate = useRef(new Animated.Value(12)).current;

//   const dotsOpacity = useRef(new Animated.Value(0)).current;

//   // Glow animation
//   const glowScale = useRef(new Animated.Value(0.85)).current;
//   const glowOpacity = useRef(new Animated.Value(0.35)).current;

//   // Loading dots
//   const dot1 = useRef(new Animated.Value(0.35)).current;
//   const dot2 = useRef(new Animated.Value(0.35)).current;
//   const dot3 = useRef(new Animated.Value(0.35)).current;

//   useEffect(() => {
//     // --------------------------------
//     // Logo entrance
//     // --------------------------------
//     Animated.parallel([
//       Animated.spring(logoScale, {
//         toValue: 1,
//         friction: 6,
//         tension: 55,
//         useNativeDriver: true,
//       }),

//       Animated.timing(logoOpacity, {
//         toValue: 1,
//         duration: 500,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // --------------------------------
//     // Logo glow pulse
//     // --------------------------------
//     Animated.loop(
//       Animated.sequence([
//         Animated.parallel([
//           Animated.timing(glowScale, {
//             toValue: 1.08,
//             duration: 1200,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),
//           Animated.timing(glowOpacity, {
//             toValue: 0.6,
//             duration: 1200,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),
//         ]),

//         Animated.parallel([
//           Animated.timing(glowScale, {
//             toValue: 0.9,
//             duration: 1200,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),
//           Animated.timing(glowOpacity, {
//             toValue: 0.25,
//             duration: 1200,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),
//         ]),
//       ])
//     ).start();

//     // --------------------------------
//     // Title animation
//     // --------------------------------
//     Animated.sequence([
//       Animated.delay(250),

//       Animated.parallel([
//         Animated.timing(titleOpacity, {
//           toValue: 1,
//           duration: 500,
//           easing: Easing.out(Easing.ease),
//           useNativeDriver: true,
//         }),

//         Animated.timing(titleTranslate, {
//           toValue: 0,
//           duration: 500,
//           easing: Easing.out(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ]),
//     ]).start();

//     // --------------------------------
//     // Subtitle animation
//     // --------------------------------
//     Animated.sequence([
//       Animated.delay(450),

//       Animated.parallel([
//         Animated.timing(subtitleOpacity, {
//           toValue: 1,
//           duration: 500,
//           easing: Easing.out(Easing.ease),
//           useNativeDriver: true,
//         }),

//         Animated.timing(subtitleTranslate, {
//           toValue: 0,
//           duration: 500,
//           easing: Easing.out(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ]),
//     ]).start();

//     // --------------------------------
//     // Loading dots
//     // --------------------------------
//     Animated.sequence([
//       Animated.delay(700),

//       Animated.timing(dotsOpacity, {
//         toValue: 1,
//         duration: 350,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // --------------------------------
//     // Dot animation loop
//     // --------------------------------
//     const animateDot = (
//       value: Animated.Value,
//       delay: number
//     ) => {
//       Animated.loop(
//         Animated.sequence([
//           Animated.delay(delay),

//           Animated.timing(value, {
//             toValue: 1,
//             duration: 350,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),

//           Animated.timing(value, {
//             toValue: 0.35,
//             duration: 350,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),

//           Animated.delay(500),
//         ])
//       ).start();
//     };

//     animateDot(dot1, 0);
//     animateDot(dot2, 150);
//     animateDot(dot3, 300);

//     // --------------------------------
//     // Finish splash
//     // --------------------------------
//     const timer = setTimeout(() => {
//       onFinish();
//     }, 2600);

//     return () => {
//       clearTimeout(timer);
//     };
//   }, [onFinish]);

//   return (
//     <View style={styles.root}>
//       <StatusBar
//         hidden={true}
//         translucent
//         backgroundColor="transparent"
//       />

//       {/* Background */}
//       <LinearGradient
//         colors={[
//           "#11142B",
//           "#151938",
//           "#101329",
//           "#090C1D",
//         ]}
//         locations={[0, 0.35, 0.7, 1]}
//         style={styles.container}
//       >
//         {/* Subtle background glow - top */}
//         <View style={styles.topGlow} />

//         {/* Subtle background glow - center */}
//         <View style={styles.centerGlow} />

//         <View style={styles.content}>
//           {/* =========================
//               LOGO
//           ========================== */}

//           <Animated.View
//             style={[
//               styles.logoWrapper,
//               {
//                 opacity: logoOpacity,
//                 transform: [{ scale: logoScale }],
//               },
//             ]}
//           >
//             {/* Animated outer glow */}
//             <Animated.View
//               style={[
//                 styles.glowCircle,
//                 {
//                   opacity: glowOpacity,
//                   transform: [{ scale: glowScale }],
//                 },
//               ]}
//             />

//             {/* Logo shadow */}
//             <View style={styles.logoShadow} />

//             {/* Logo */}
//             <LinearGradient
//               colors={[
//                 "#9284FF",
//                 "#7B6CF0",
//                 "#6757DF",
//               ]}
//               start={{ x: 0.2, y: 0 }}
//               end={{ x: 0.8, y: 1 }}
//               style={styles.logoBadge}
//             >
//               <Ionicons
//                 name="lock-closed"
//                 size={42}
//                 color="#FFFFFF"
//               />
//             </LinearGradient>
//           </Animated.View>

//           {/* =========================
//               TITLE
//           ========================== */}

//           <Animated.View
//             style={{
//               opacity: titleOpacity,
//               transform: [
//                 {
//                   translateY: titleTranslate,
//                 },
//               ],
//             }}
//           >
//             <Text style={styles.title}>
//               CODE BREAKER
//             </Text>
//           </Animated.View>

//           {/* =========================
//               SUBTITLE
//           ========================== */}

//           <Animated.View
//             style={{
//               opacity: subtitleOpacity,
//               transform: [
//                 {
//                   translateY: subtitleTranslate,
//                 },
//               ],
//             }}
//           >
//             <Text style={styles.subtitle}>
//               Crack The Code
//             </Text>
//           </Animated.View>

//           {/* =========================
//               LOADING
//           ========================== */}

//           <Animated.View
//             style={[
//               styles.loadingContainer,
//               {
//                 opacity: dotsOpacity,
//               },
//             ]}
//           >
//             <Animated.View
//               style={[
//                 styles.dot,
//                 {
//                   opacity: dot1,
//                 },
//               ]}
//             />

//             <Animated.View
//               style={[
//                 styles.dot,
//                 {
//                   opacity: dot2,
//                 },
//               ]}
//             />

//             <Animated.View
//               style={[
//                 styles.dot,
//                 {
//                   opacity: dot3,
//                 },
//               ]}
//             />
//           </Animated.View>
//         </View>

//         {/* Bottom subtle line */}
//         <View style={styles.bottomFade} />
//       </LinearGradient>
//     </View>
//   );
// };

// export default SplashScreen;

// /* =========================================================
//    STYLES
// ========================================================= */

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: "#0B0E1F",
//   },

//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//   },

//   content: {
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   /* =========================
//      BACKGROUND GLOWS
//   ========================== */

//   topGlow: {
//     position: "absolute",
//     width: width * 0.8,
//     height: width * 0.8,
//     borderRadius: width,
//     backgroundColor: "#5548C8",
//     opacity: 0.055,
//     top: -height * 0.38,
//     left: width * 0.1,
//   },

//   centerGlow: {
//     position: "absolute",
//     width: width * 0.75,
//     height: width * 0.75,
//     borderRadius: width,
//     backgroundColor: "#6C5CE7",
//     opacity: 0.035,
//     top: height * 0.22,
//     left: width * 0.125,
//   },

//   /* =========================
//      LOGO
//   ========================== */

//   logoWrapper: {
//     width: 116,
//     height: 116,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 28,
//   },

//   glowCircle: {
//     position: "absolute",
//     width: 108,
//     height: 108,
//     borderRadius: 54,
//     backgroundColor: "#7667F2",
//   },

//   logoShadow: {
//     position: "absolute",
//     width: 98,
//     height: 98,
//     borderRadius: 49,
//     backgroundColor: "#6255D8",
//     opacity: 0.35,

//     shadowColor: "#7163F1",
//     shadowOpacity: 0.8,
//     shadowRadius: 30,
//     shadowOffset: {
//       width: 0,
//       height: 12,
//     },

//     elevation: 15,
//   },

//   logoBadge: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     justifyContent: "center",
//     alignItems: "center",

//     shadowColor: "#7668F3",
//     shadowOpacity: 0.75,
//     shadowRadius: 24,
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },

//     elevation: 18,
//   },

//   /* =========================
//      TITLE
//   ========================== */

//   title: {
//     color: "#FFFFFF",
//     fontSize: width < 380 ? 26 : 30,
//     fontWeight: "900",
//     letterSpacing: 3.5,
//     textAlign: "center",

//     // Android/iOS subtle shadow
//     textShadowColor: "rgba(255,255,255,0.08)",
//     textShadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     textShadowRadius: 4,
//   },

//   /* =========================
//      SUBTITLE
//   ========================== */

//   subtitle: {
//     color: "#A9A5FF",
//     fontSize: width < 380 ? 15 : 16,
//     fontWeight: "500",
//     letterSpacing: 0.2,
//     marginTop: 10,
//     textAlign: "center",
//   },

//   /* =========================
//      LOADING DOTS
//   ========================== */

//   loadingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 42,
//     height: 12,
//   },

//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#7565EE",
//     marginHorizontal: 4,

//     shadowColor: "#7667F2",
//     shadowOpacity: 0.5,
//     shadowRadius: 5,
//     shadowOffset: {
//       width: 0,
//       height: 0,
//     },
//   },

//   /* =========================
//      BOTTOM
//   ========================== */

//   bottomFade: {
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//     height: 80,
//     backgroundColor: "rgba(0,0,0,0.08)",
//   },
// });
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get("window");

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Main animations
  const logoScale = useRef(new Animated.Value(0.65)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(18)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslate = useRef(new Animated.Value(12)).current;

  const dotsOpacity = useRef(new Animated.Value(0)).current;

  // Glow animation
  const glowScale = useRef(new Animated.Value(0.85)).current;
  const glowOpacity = useRef(new Animated.Value(0.35)).current;

  // Loading dots
  const dot1 = useRef(new Animated.Value(0.35)).current;
  const dot2 = useRef(new Animated.Value(0.35)).current;
  const dot3 = useRef(new Animated.Value(0.35)).current;

  // FIX: always call the LATEST onFinish without re-running the effect.
  // App.tsx passes an inline arrow, so its identity changes on every App
  // re-render (e.g. when Settings are refreshed). With [onFinish] in the
  // dependency array the timer restarted and later pushed the user to Home.
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  useEffect(() => {
    // --------------------------------
    // Logo entrance
    // --------------------------------
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 55,
        useNativeDriver: true,
      }),

      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // --------------------------------
    // Logo glow pulse
    // --------------------------------
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 1.08,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.6,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 0.9,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.25,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    glowLoop.start();

    // --------------------------------
    // Title animation
    // --------------------------------
    Animated.sequence([
      Animated.delay(250),

      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(titleTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // --------------------------------
    // Subtitle animation
    // --------------------------------
    Animated.sequence([
      Animated.delay(450),

      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(subtitleTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // --------------------------------
    // Loading dots
    // --------------------------------
    Animated.sequence([
      Animated.delay(700),

      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    // --------------------------------
    // Dot animation loop
    // --------------------------------
    const dotLoops: Animated.CompositeAnimation[] = [];

    const animateDot = (value: Animated.Value, delay: number) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),

          Animated.timing(value, {
            toValue: 1,
            duration: 350,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.timing(value, {
            toValue: 0.35,
            duration: 350,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.delay(500),
        ])
      );
      dotLoops.push(loop);
      loop.start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);

    // --------------------------------
    // Finish splash
    // --------------------------------
    const timer = setTimeout(() => {
      finishRef.current();
    }, 2600);

    return () => {
      clearTimeout(timer);
      glowLoop.stop();
      dotLoops.forEach((l) => l.stop());
    };
  }, []); // run once only

  return (
    <View style={styles.root}>
      <StatusBar hidden={true} translucent backgroundColor="transparent" />

      {/* Background */}
      <LinearGradient
        colors={["#11142B", "#151938", "#101329", "#090C1D"]}
        locations={[0, 0.35, 0.7, 1]}
        style={styles.container}
      >
        {/* Subtle background glow - top */}
        <View style={styles.topGlow} />

        {/* Subtle background glow - center */}
        <View style={styles.centerGlow} />

        <View style={styles.content}>
          {/* =========================
              LOGO
          ========================== */}

          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            {/* Animated outer glow */}
            <Animated.View
              style={[
                styles.glowCircle,
                {
                  opacity: glowOpacity,
                  transform: [{ scale: glowScale }],
                },
              ]}
            />

            {/* Logo shadow */}
            <View style={styles.logoShadow} />

            {/* Logo */}
            <LinearGradient
              colors={["#9284FF", "#7B6CF0", "#6757DF"]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={styles.logoBadge}
            >
              <Ionicons name="lock-closed" size={42} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>

          {/* =========================
              TITLE
          ========================== */}

          <Animated.View
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslate }],
            }}
          >
            <Text style={styles.title}>CODE BREAKER</Text>
          </Animated.View>

          {/* =========================
              SUBTITLE
          ========================== */}

          <Animated.View
            style={{
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslate }],
            }}
          >
            <Text style={styles.subtitle}>Crack The Code</Text>
          </Animated.View>

          {/* =========================
              LOADING
          ========================== */}

          <Animated.View style={[styles.loadingContainer, { opacity: dotsOpacity }]}>
            <Animated.View style={[styles.dot, { opacity: dot1 }]} />
            <Animated.View style={[styles.dot, { opacity: dot2 }]} />
            <Animated.View style={[styles.dot, { opacity: dot3 }]} />
          </Animated.View>
        </View>

        {/* Bottom subtle line */}
        <View style={styles.bottomFade} />
      </LinearGradient>
    </View>
  );
};

export default SplashScreen;

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0B0E1F",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  /* BACKGROUND GLOWS */

  topGlow: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width,
    backgroundColor: "#5548C8",
    opacity: 0.055,
    top: -height * 0.38,
    left: width * 0.1,
  },

  centerGlow: {
    position: "absolute",
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width,
    backgroundColor: "#6C5CE7",
    opacity: 0.035,
    top: height * 0.22,
    left: width * 0.125,
  },

  /* LOGO */

  logoWrapper: {
    width: 116,
    height: 116,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },

  glowCircle: {
    position: "absolute",
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: "#7667F2",
  },

  logoShadow: {
    position: "absolute",
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: "#6255D8",
    opacity: 0.35,

    shadowColor: "#7163F1",
    shadowOpacity: 0.8,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },

    elevation: 15,
  },

  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#7668F3",
    shadowOpacity: 0.75,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },

    elevation: 18,
  },

  /* TITLE */

  title: {
    color: "#FFFFFF",
    fontSize: width < 380 ? 26 : 30,
    fontWeight: "900",
    letterSpacing: 3.5,
    textAlign: "center",

    textShadowColor: "rgba(255,255,255,0.08)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  /* SUBTITLE */

  subtitle: {
    color: "#A9A5FF",
    fontSize: width < 380 ? 15 : 16,
    fontWeight: "500",
    letterSpacing: 0.2,
    marginTop: 10,
    textAlign: "center",
  },

  /* LOADING DOTS */

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 42,
    height: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7565EE",
    marginHorizontal: 4,

    shadowColor: "#7667F2",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },

  /* BOTTOM */

  bottomFade: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
});
