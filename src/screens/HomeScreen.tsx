
// // import React from "react";
// // import { View, Text, StyleSheet, ScrollView, useWindowDimensions, StyleProp, ViewStyle } from "react-native";
// // import { LinearGradient } from "expo-linear-gradient";
// // import { Ionicons } from "@expo/vector-icons";
// // import { getTheme } from "../theme/theme";
// // import { FadeInUp, Float, Pulse, PressableScale, PopIn } from "../components/motion";
// // import LockAnimation from "../components/LockAnimation";

// // interface HomeScreenProps {
// //   highScore: number;
// //   gamesPlayed?: number;
// //   successRate?: number; // 0–100
// //   playerName?: string;
// //   darkMode: boolean;
// //   onPlay: () => void;
// //   onStats: () => void;
// //   onSettings: () => void;
// //   onProfile?: () => void; // opens the Profile page
// // }

// // /* =====================================================
// //    HOW-TO-PLAY ILLUSTRATION — code window + bulb
// // ===================================================== */
// // const CodeWindowArt: React.FC = () => (
// //   <View style={art.winWrap}>
// //     <View style={art.window}>
// //       <View style={art.winDots}>
// //         <View style={[art.winDot, { backgroundColor: "#F87171" }]} />
// //         <View style={[art.winDot, { backgroundColor: "#FBBF24" }]} />
// //         <View style={[art.winDot, { backgroundColor: "#34D399" }]} />
// //       </View>
// //       <View style={art.winLineRow}>
// //         <View style={[art.winLine, { width: 34, backgroundColor: "#38BDF8" }]} />
// //         <View style={[art.winLine, { width: 22, backgroundColor: "#A855F7" }]} />
// //       </View>
// //       <View style={art.winLineRow}>
// //         <View style={[art.winLine, { width: 52, backgroundColor: "#38BDF8" }]} />
// //         <View style={[art.winLine, { width: 28, backgroundColor: "#8B5CF6" }]} />
// //       </View>
// //       <View style={art.winLineRow}>
// //         <View style={[art.winLine, { width: 40, backgroundColor: "#38BDF8" }]} />
// //         <View style={[art.winLine, { width: 36, backgroundColor: "#EC4899" }]} />
// //       </View>
// //     </View>
// //     <Float y={5} style={art.bulb}>
// //       <Ionicons name="bulb-outline" size={24} color="#FFFFFF" />
// //     </Float>
// //   </View>
// // );

// // const STEPS = [
// //   { n: 1, title: "Read the clue", desc: "Understand the hint and think logically." },
// //   { n: 2, title: "Make your guess", desc: "Enter the correct answer." },
// //   { n: 3, title: "Unlock the code", desc: "Solve all levels and become a master!" },
// // ];

// // const HomeScreen: React.FC<HomeScreenProps> = ({
// //   highScore,
// //   gamesPlayed = 0,
// //   successRate = 0,
// //   playerName = "Player",
// //   darkMode,
// //   onPlay,
// //   onStats,
// //   onSettings,
// //   onProfile,
// // }) => {
// //   const theme = getTheme(darkMode);
// //   const { width } = useWindowDimensions();
// //   const wide = width >= 900;

// //   const encouragement =
// //     successRate >= 70 ? "Great progress!" : successRate >= 40 ? "Nice work!" : "Keep practicing!";

// //   const cardWrap: StyleProp<ViewStyle> = wide ? { flex: 1 } : undefined;

// //   return (
// //     <LinearGradient colors={theme.gradient} style={styles.container}>
// //       {/* ================= TOP BAR ================= */}
// //       <FadeInUp distance={-16} duration={400}>
// //         <View style={[styles.topBar, { paddingTop: wide ? 14 : 44 }]}>
// //           <View style={styles.brandRow}>
// //             <PopIn>
// //               <View style={styles.shieldWrap}>
// //                 <Ionicons name="shield" size={32} color="#7C4DFF" />
// //                 <Ionicons name="code-slash" size={14} color="#FFFFFF" style={styles.shieldInner} />
// //               </View>
// //             </PopIn>
// //             <Text style={styles.topTitle}>Code Breaker</Text>
// //           </View>

// //           {/* Tap the player pill -> Profile page */}
// //           <PressableScale onPress={onProfile ?? onSettings} scaleTo={0.94} style={styles.playerPill}>
// //             <View style={styles.playerAvatar}>
// //               <Ionicons name="person" size={16} color="#FFFFFF" />
// //             </View>
// //             <Text style={styles.playerName} numberOfLines={1}>
// //               {playerName}
// //             </Text>
// //             <Ionicons name="chevron-down" size={14} color="#C4C9F5" />
// //           </PressableScale>
// //         </View>
// //       </FadeInUp>

// //       <ScrollView
// //         contentContainerStyle={[styles.scrollContent, { paddingHorizontal: wide ? 28 : 16 }]}
// //         showsVerticalScrollIndicator={false}
// //       >
// //         {/* ================= HERO ================= */}
// //         <FadeInUp delay={100} duration={500}>
// //           <LinearGradient
// //             colors={["#1A1470", "#2A1B95", "#151055"]}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 1 }}
// //             style={[styles.hero, wide ? styles.heroWide : styles.heroNarrow]}
// //           >
// //             <View style={styles.heroSwoosh} pointerEvents="none" />

// //             <View style={[styles.heroText, wide && { flex: 1 }]}>
// //               <FadeInUp delay={200} style={{ alignSelf: "flex-start" }}>
// //                 <View style={styles.welcomeBadge}>
// //                   <Text style={styles.welcomeText}>👋 Welcome Back!</Text>
// //                 </View>
// //               </FadeInUp>

// //               <FadeInUp delay={300}>
// //                 <Text style={[styles.heroTitle, { fontSize: wide ? 42 : 30 }]}>
// //                   CRACK THE <Text style={{ color: "#A855F7" }}>CODE</Text>
// //                 </Text>
// //               </FadeInUp>

// //               <FadeInUp delay={400}>
// //                 <Text style={styles.heroDesc}>
// //                   Use your logic, solve the clues and unlock the secrets.{"\n"}Are you ready for the challenge?
// //                 </Text>
// //               </FadeInUp>

// //               <FadeInUp delay={500} style={{ alignSelf: "flex-start" }}>
// //                 <Pulse to={1.05}>
// //                   <PressableScale onPress={onPlay} scaleTo={0.94} style={styles.playWrapper}>
// //                     <LinearGradient
// //                       colors={["#5B6CFF", "#A855F7"]}
// //                       start={{ x: 0, y: 0 }}
// //                       end={{ x: 1, y: 0 }}
// //                       style={styles.playButton}
// //                     >
// //                       <Ionicons name="play" size={18} color="#FFFFFF" />
// //                       <Text style={styles.playText}>PLAY GAME</Text>
// //                       <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
// //                     </LinearGradient>
// //                   </PressableScale>
// //                 </Pulse>
// //               </FadeInUp>
// //             </View>

// //             {/* Animated lock: numbers orbit, key opens the lock */}
// //             <FadeInUp delay={350} duration={600} style={wide ? styles.heroArtWide : styles.heroArtNarrow}>
// //               <LockAnimation size={wide ? 300 : 240} />
// //             </FadeInUp>
// //           </LinearGradient>
// //         </FadeInUp>

// //         {/* ================= STAT CARDS ================= */}
// //         <View style={[styles.statsRow, !wide && { flexDirection: "column" }]}>
// //           {/* High Score */}
// //           <FadeInUp delay={600} style={cardWrap}>
// //             <PressableScale
// //               onPress={onStats}
// //               style={[styles.statCard, { backgroundColor: "#2A2119", borderColor: "rgba(245,166,35,0.28)" }]}
// //             >
// //               <View style={[styles.statIcon, { backgroundColor: "#F5A623" }]}>
// //                 <Ionicons name="trophy-outline" size={24} color="#FFFFFF" />
// //               </View>
// //               <View style={styles.statBody}>
// //                 <Text style={styles.statLabel}>High Score</Text>
// //                 <Text style={styles.statValue}>{highScore}</Text>
// //                 <Text style={styles.statHint}>Your best so far</Text>
// //               </View>
// //               <View style={[styles.chevronCircle, { backgroundColor: "rgba(255,255,255,0.08)" }]}>
// //                 <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
// //               </View>
// //             </PressableScale>
// //           </FadeInUp>

// //           {/* Total Games */}
// //           <FadeInUp delay={700} style={cardWrap}>
// //             <PressableScale
// //               onPress={onStats}
// //               style={[styles.statCard, { backgroundColor: "#1B1855", borderColor: "rgba(124,92,255,0.35)" }]}
// //             >
// //               <View style={[styles.statIcon, { backgroundColor: "#7C3AED" }]}>
// //                 <Ionicons name="flash" size={24} color="#FFFFFF" />
// //               </View>
// //               <View style={styles.statBody}>
// //                 <Text style={styles.statLabel}>Total Games</Text>
// //                 <Text style={styles.statValue}>{gamesPlayed}</Text>
// //                 <Text style={styles.statHint}>Keep going!</Text>
// //               </View>
// //               <View style={[styles.chevronCircle, { backgroundColor: "rgba(124,92,255,0.3)" }]}>
// //                 <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
// //               </View>
// //             </PressableScale>
// //           </FadeInUp>

// //           {/* Success Rate */}
// //           <FadeInUp delay={800} style={cardWrap}>
// //             <PressableScale
// //               onPress={onStats}
// //               style={[styles.statCard, { backgroundColor: "#0D3240", borderColor: "rgba(20,184,166,0.35)" }]}
// //             >
// //               <View style={[styles.statIcon, { backgroundColor: "#14B8A6" }]}>
// //                 <Ionicons name="locate" size={24} color="#FFFFFF" />
// //               </View>
// //               <View style={styles.statBody}>
// //                 <Text style={styles.statLabel}>Success Rate</Text>
// //                 <Text style={styles.statValue}>{successRate}%</Text>
// //                 <Text style={styles.statHint}>{encouragement}</Text>
// //               </View>
// //               <View style={[styles.chevronCircle, { backgroundColor: "rgba(20,184,166,0.28)" }]}>
// //                 <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
// //               </View>
// //             </PressableScale>
// //           </FadeInUp>
// //         </View>

// //         {/* ================= HOW TO PLAY ================= */}
// //         <FadeInUp delay={900}>
// //           <View style={[styles.howCard, !wide && { flexDirection: "column", alignItems: "flex-start" }]}>
// //             {wide && (
// //               <>
// //                 <CodeWindowArt />
// //                 <View style={styles.howDivider} />
// //               </>
// //             )}

// //             <View style={{ flex: 1, width: "100%" }}>
// //               <Text style={styles.howTitle}>How to Play?</Text>

// //               <View style={[styles.stepsRow, !wide && { flexDirection: "column", gap: 16 }]}>
// //                 {STEPS.map((s, i) => (
// //                   <React.Fragment key={s.n}>
// //                     <View style={styles.step}>
// //                       <PopIn delay={1000 + i * 150}>
// //                         <View style={styles.stepNum}>
// //                           <Text style={styles.stepNumText}>{s.n}</Text>
// //                         </View>
// //                       </PopIn>
// //                       <View style={{ flex: 1 }}>
// //                         <Text style={styles.stepTitle}>{s.title}</Text>
// //                         <Text style={styles.stepDesc}>{s.desc}</Text>
// //                       </View>
// //                     </View>
// //                     {wide && i < STEPS.length - 1 && (
// //                       <Ionicons name="chevron-forward" size={16} color="#4B5399" style={{ alignSelf: "center" }} />
// //                     )}
// //                   </React.Fragment>
// //                 ))}
// //               </View>
// //             </View>
// //           </View>
// //         </FadeInUp>
// //       </ScrollView>
// //     </LinearGradient>
// //   );
// // };

// // export default HomeScreen;

// // /* ===================================================== */

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     paddingTop: 18,
// //     paddingBottom: 32,
// //     gap: 18,
// //   },

// //   /* ---- top bar ---- */
// //   topBar: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     paddingHorizontal: 20,
// //     paddingBottom: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "rgba(120,130,255,0.15)",
// //   },
// //   brandRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 10,
// //   },
// //   shieldWrap: {
// //     width: 34,
// //     height: 34,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   shieldInner: {
// //     position: "absolute",
// //   },
// //   topTitle: {
// //     color: "#FFFFFF",
// //     fontSize: 18,
// //     fontWeight: "800",
// //   },
// //   playerPill: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //     paddingVertical: 6,
// //     paddingLeft: 6,
// //     paddingRight: 14,
// //     borderRadius: 24,
// //     backgroundColor: "rgba(59,64,180,0.28)",
// //     borderWidth: 1,
// //     borderColor: "rgba(120,130,255,0.2)",
// //     maxWidth: 190,
// //   },
// //   playerAvatar: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     backgroundColor: "#6D4AFF",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   playerName: {
// //     color: "#FFFFFF",
// //     fontSize: 14,
// //     fontWeight: "600",
// //     flexShrink: 1,
// //   },

// //   /* ---- hero ---- */
// //   hero: {
// //     borderRadius: 22,
// //     borderWidth: 1,
// //     borderColor: "rgba(124,92,255,0.3)",
// //     overflow: "hidden",
// //     padding: 28,
// //   },
// //   heroWide: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     minHeight: 250,
// //   },
// //   heroNarrow: {
// //     flexDirection: "column",
// //     alignItems: "flex-start",
// //   },
// //   heroSwoosh: {
// //     position: "absolute",
// //     right: -120,
// //     top: -80,
// //     width: 520,
// //     height: 520,
// //     borderRadius: 260,
// //     backgroundColor: "rgba(109,74,255,0.22)",
// //   },
// //   heroText: {
// //     zIndex: 2,
// //   },
// //   heroArtWide: {
// //     width: 320,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     zIndex: 2,
// //   },
// //   heroArtNarrow: {
// //     alignSelf: "center",
// //     marginTop: 8,
// //     height: 250,
// //     justifyContent: "center",
// //     zIndex: 2,
// //   },
// //   welcomeBadge: {
// //     alignSelf: "flex-start",
// //     backgroundColor: "rgba(109,74,255,0.55)",
// //     paddingVertical: 6,
// //     paddingHorizontal: 14,
// //     borderRadius: 16,
// //   },
// //   welcomeText: {
// //     color: "#FFFFFF",
// //     fontSize: 12.5,
// //     fontWeight: "700",
// //   },
// //   heroTitle: {
// //     color: "#FFFFFF",
// //     fontWeight: "900",
// //     letterSpacing: 0.5,
// //     marginTop: 14,
// //   },
// //   heroDesc: {
// //     color: "#D7DBFF",
// //     fontSize: 15,
// //     lineHeight: 23,
// //     marginTop: 12,
// //     maxWidth: 520,
// //   },
// //   playWrapper: {
// //     alignSelf: "flex-start",
// //     marginTop: 24,
// //     borderRadius: 32,
// //     shadowColor: "#7C4DFF",
// //     shadowOpacity: 0.5,
// //     shadowRadius: 16,
// //     shadowOffset: { width: 0, height: 6 },
// //     elevation: 8,
// //   },
// //   playButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 10,
// //     paddingVertical: 16,
// //     paddingHorizontal: 34,
// //     borderRadius: 32,
// //   },
// //   playText: {
// //     color: "#FFFFFF",
// //     fontSize: 16,
// //     fontWeight: "800",
// //     letterSpacing: 1,
// //   },

// //   /* ---- stats ---- */
// //   statsRow: {
// //     flexDirection: "row",
// //     gap: 16,
// //   },
// //   statCard: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 14,
// //     paddingVertical: 20,
// //     paddingHorizontal: 20,
// //     borderRadius: 18,
// //     borderWidth: 1,
// //   },
// //   statIcon: {
// //     width: 56,
// //     height: 56,
// //     borderRadius: 28,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   statBody: {
// //     flex: 1,
// //   },
// //   statLabel: {
// //     color: "#C9CDEB",
// //     fontSize: 15,
// //   },
// //   statValue: {
// //     color: "#FFFFFF",
// //     fontSize: 24,
// //     fontWeight: "800",
// //     marginTop: 2,
// //   },
// //   statHint: {
// //     color: "#AEB4DA",
// //     fontSize: 12.5,
// //     marginTop: 2,
// //   },
// //   chevronCircle: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 16,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   /* ---- how to play ---- */
// //   howCard: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 20,
// //     padding: 22,
// //     borderRadius: 18,
// //     backgroundColor: "rgba(17,26,74,0.7)",
// //     borderWidth: 1,
// //     borderColor: "rgba(120,130,255,0.2)",
// //   },
// //   howDivider: {
// //     width: 1,
// //     alignSelf: "stretch",
// //     backgroundColor: "rgba(120,130,255,0.2)",
// //   },
// //   howTitle: {
// //     color: "#FFFFFF",
// //     fontSize: 20,
// //     fontWeight: "800",
// //     marginBottom: 16,
// //   },
// //   stepsRow: {
// //     flexDirection: "row",
// //     alignItems: "flex-start",
// //     justifyContent: "space-between",
// //     gap: 14,
// //   },
// //   step: {
// //     flex: 1,
// //     flexDirection: "row",
// //     alignItems: "flex-start",
// //     gap: 12,
// //   },
// //   stepNum: {
// //     width: 38,
// //     height: 38,
// //     borderRadius: 19,
// //     backgroundColor: "#6D4AFF",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   stepNumText: {
// //     color: "#FFFFFF",
// //     fontWeight: "800",
// //     fontSize: 16,
// //   },
// //   stepTitle: {
// //     color: "#FFFFFF",
// //     fontSize: 15,
// //     fontWeight: "700",
// //   },
// //   stepDesc: {
// //     color: "#9AA5D6",
// //     fontSize: 12.5,
// //     lineHeight: 18,
// //     marginTop: 4,
// //   },
// // });

// // /* ===== illustrations ===== */
// // const art = StyleSheet.create({
// //   /* code window */
// //   winWrap: {
// //     width: 150,
// //     height: 110,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   window: {
// //     width: 128,
// //     height: 84,
// //     borderRadius: 10,
// //     backgroundColor: "rgba(40,50,140,0.75)",
// //     borderWidth: 1,
// //     borderColor: "rgba(120,130,255,0.4)",
// //     padding: 8,
// //     gap: 6,
// //     transform: [{ rotate: "-6deg" }],
// //   },
// //   winDots: {
// //     flexDirection: "row",
// //     gap: 4,
// //   },
// //   winDot: {
// //     width: 6,
// //     height: 6,
// //     borderRadius: 3,
// //   },
// //   winLineRow: {
// //     flexDirection: "row",
// //     gap: 5,
// //   },
// //   winLine: {
// //     height: 6,
// //     borderRadius: 3,
// //   },
// //   bulb: {
// //     position: "absolute",
// //     right: 0,
// //     bottom: 0,
// //     width: 46,
// //     height: 46,
// //     borderRadius: 23,
// //     backgroundColor: "#6D4AFF",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 2,
// //     borderColor: "rgba(255,255,255,0.25)",
// //   },
// // });
// import React, { useState } from "react";
// import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import { getTheme } from "../theme/theme";
// import { FadeInUp, Pulse, PressableScale, PopIn } from "../components/motion";
// import LockAnimation from "../components/LockAnimation";
// import HowToPlayModal from "./HowtoPlayModal";

// interface HomeScreenProps {
//   highScore: number;
//   gamesPlayed?: number;
//   successRate?: number; // 0–100
//   playerName?: string;
//   darkMode: boolean;
//   onPlay: () => void;
//   onStats: () => void;
//   onSettings: () => void;
//   onProfile?: () => void; // opens the Profile page
// }

// const HomeScreen: React.FC<HomeScreenProps> = ({
//   playerName = "Player",
//   darkMode,
//   onPlay,
//   onSettings,
//   onProfile,
// }) => {
//   const theme = getTheme(darkMode);
//   const { width } = useWindowDimensions();
//   const wide = width >= 900;
//   const [showHowTo, setShowHowTo] = useState(false);

//   return (
//     <LinearGradient colors={theme.gradient} style={styles.container}>
//       {/* ================= TOP BAR ================= */}
//       <FadeInUp distance={-16} duration={400}>
//         <View style={[styles.topBar, { paddingTop: wide ? 14 : 44 }]}>
//           <View style={styles.brandRow}>
//             <PopIn>
//               <View style={styles.shieldWrap}>
//                 <Ionicons name="shield" size={32} color="#7C4DFF" />
//                 <Ionicons name="code-slash" size={14} color="#FFFFFF" style={styles.shieldInner} />
//               </View>
//             </PopIn>
//             <Text style={styles.topTitle}>Code Breaker</Text>
//           </View>

//           {/* Tap the player pill -> Profile page */}
//           <PressableScale onPress={onProfile ?? onSettings} scaleTo={0.94} style={styles.playerPill}>
//             <View style={styles.playerAvatar}>
//               <Ionicons name="person" size={16} color="#FFFFFF" />
//             </View>
//             <Text style={styles.playerName} numberOfLines={1}>
//               {playerName}
//             </Text>
//             <Ionicons name="chevron-down" size={14} color="#C4C9F5" />
//           </PressableScale>
//         </View>
//       </FadeInUp>

//       <ScrollView
//         contentContainerStyle={[styles.scrollContent, { paddingHorizontal: wide ? 28 : 16 }]}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* ================= HERO ================= */}
//         <FadeInUp delay={100} duration={500}>
//           <LinearGradient
//             colors={["#1A1470", "#2A1B95", "#151055"]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={[styles.hero, wide ? styles.heroWide : styles.heroNarrow]}
//           >
//             <View style={styles.heroSwoosh} pointerEvents="none" />

//             <View style={[styles.heroText, wide && { flex: 1 }]}>
//               <FadeInUp delay={200} style={{ alignSelf: "flex-start" }}>
//                 <View style={styles.welcomeBadge}>
//                   <Text style={styles.welcomeText}>👋 Welcome Back!</Text>
//                 </View>
//               </FadeInUp>

//               <FadeInUp delay={300}>
//                 <Text style={[styles.heroTitle, { fontSize: wide ? 42 : 30 }]}>
//                   CRACK THE <Text style={{ color: "#A855F7" }}>CODE</Text>
//                 </Text>
//               </FadeInUp>

//               <FadeInUp delay={400}>
//                 <Text style={styles.heroDesc}>
//                   Use your logic, solve the clues and unlock the secrets.{"\n"}Are you ready for the challenge?
//                 </Text>
//               </FadeInUp>

//               {/* PLAY GAME + HOW TO PLAY buttons */}
//               <FadeInUp delay={500} style={{ alignSelf: "flex-start" }}>
//                 <View style={styles.buttonsRow}>
//                   <Pulse to={1.05}>
//                     <PressableScale onPress={onPlay} scaleTo={0.94} style={styles.playWrapper}>
//                       <LinearGradient
//                         colors={["#5B6CFF", "#A855F7"]}
//                         start={{ x: 0, y: 0 }}
//                         end={{ x: 1, y: 0 }}
//                         style={styles.playButton}
//                       >
//                         <Ionicons name="play" size={18} color="#FFFFFF" />
//                         <Text style={styles.playText}>PLAY GAME</Text>
//                         <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
//                       </LinearGradient>
//                     </PressableScale>
//                   </Pulse>

//                   <PressableScale
//                     onPress={() => setShowHowTo(true)}
//                     scaleTo={0.94}
//                     style={styles.howButton}
//                   >
//                     <Ionicons name="help-circle-outline" size={20} color="#FFFFFF" />
//                     <Text style={styles.howButtonText}>HOW TO PLAY</Text>
//                   </PressableScale>
//                 </View>
//               </FadeInUp>
//             </View>

//             {/* Animated lock: numbers orbit, key opens the lock */}
//             <FadeInUp delay={350} duration={600} style={wide ? styles.heroArtWide : styles.heroArtNarrow}>
//               <LockAnimation size={wide ? 300 : 240} />
//             </FadeInUp>
//           </LinearGradient>
//         </FadeInUp>
//       </ScrollView>

//       {/* ================= HOW TO PLAY VIDEO ================= */}
//       <HowToPlayModal visible={showHowTo} onClose={() => setShowHowTo(false)} />
//     </LinearGradient>
//   );
// };

// export default HomeScreen;

// /* ===================================================== */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingTop: 18,
//     paddingBottom: 32,
//     gap: 18,
//   },

//   /* ---- top bar ---- */
//   topBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(120,130,255,0.15)",
//   },
//   brandRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   shieldWrap: {
//     width: 34,
//     height: 34,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   shieldInner: {
//     position: "absolute",
//   },
//   topTitle: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "800",
//   },
//   playerPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     paddingVertical: 6,
//     paddingLeft: 6,
//     paddingRight: 14,
//     borderRadius: 24,
//     backgroundColor: "rgba(59,64,180,0.28)",
//     borderWidth: 1,
//     borderColor: "rgba(120,130,255,0.2)",
//     maxWidth: 190,
//   },
//   playerAvatar: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: "#6D4AFF",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   playerName: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "600",
//     flexShrink: 1,
//   },

//   /* ---- hero ---- */
//   hero: {
//     borderRadius: 22,
//     borderWidth: 1,
//     borderColor: "rgba(124,92,255,0.3)",
//     overflow: "hidden",
//     padding: 28,
//   },
//   heroWide: {
//     flexDirection: "row",
//     alignItems: "center",
//     minHeight: 250,
//   },
//   heroNarrow: {
//     flexDirection: "column",
//     alignItems: "flex-start",
//   },
//   heroSwoosh: {
//     position: "absolute",
//     right: -120,
//     top: -80,
//     width: 520,
//     height: 520,
//     borderRadius: 260,
//     backgroundColor: "rgba(109,74,255,0.22)",
//   },
//   heroText: {
//     zIndex: 2,
//   },
//   heroArtWide: {
//     width: 320,
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 2,
//   },
//   heroArtNarrow: {
//     alignSelf: "center",
//     marginTop: 8,
//     height: 250,
//     justifyContent: "center",
//     zIndex: 2,
//   },
//   welcomeBadge: {
//     alignSelf: "flex-start",
//     backgroundColor: "rgba(109,74,255,0.55)",
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     borderRadius: 16,
//   },
//   welcomeText: {
//     color: "#FFFFFF",
//     fontSize: 12.5,
//     fontWeight: "700",
//   },
//   heroTitle: {
//     color: "#FFFFFF",
//     fontWeight: "900",
//     letterSpacing: 0.5,
//     marginTop: 14,
//   },
//   heroDesc: {
//     color: "#D7DBFF",
//     fontSize: 15,
//     lineHeight: 23,
//     marginTop: 12,
//     maxWidth: 520,
//   },

//   /* ---- buttons ---- */
//   buttonsRow: {
//     flexDirection: "column",
//     alignItems: "flex-start",
//     gap: 14,
//     marginTop: 24,
//   },
//   playWrapper: {
//     alignSelf: "flex-start",
//     borderRadius: 32,
//     shadowColor: "#7C4DFF",
//     shadowOpacity: 0.5,
//     shadowRadius: 16,
//     shadowOffset: { width: 0, height: 6 },
//     elevation: 8,
//   },
//   playButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     paddingVertical: 16,
//     paddingHorizontal: 34,
//     borderRadius: 32,
//   },
//   playText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "800",
//     letterSpacing: 1,
//   },
//   howButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     paddingVertical: 13,
//     paddingHorizontal: 26,
//     borderRadius: 32,
//     borderWidth: 1.5,
//     borderColor: "rgba(168,85,247,0.8)",
//     backgroundColor: "rgba(168,85,247,0.15)",
//   },
//   howButtonText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "800",
//     letterSpacing: 1,
//   },
// });
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getTheme } from "../theme/theme";
import { FadeInUp, Pulse, PressableScale, PopIn } from "../components/motion";
import LockAnimation from "../components/LockAnimation";
import HowToPlayModal from "./HowtoPlayModal";

interface HomeScreenProps {
  highScore: number;
  gamesPlayed?: number;
  successRate?: number; // 0–100
  playerName?: string;
  darkMode: boolean;
  onBack?: () => void; // back arrow -> Menu screen
  onPlay: () => void;
  onStats: () => void;
  onSettings: () => void;
  onProfile?: () => void; // opens the Profile page
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  playerName = "Player",
  darkMode,
  onBack,
  onPlay,
  onSettings,
  onProfile,
}) => {
  const theme = getTheme(darkMode);
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <LinearGradient colors={theme.gradient} style={styles.container}>
      {/* ================= TOP BAR ================= */}
      <FadeInUp distance={-16} duration={400}>
        <View style={[styles.topBar, { paddingTop: wide ? 14 : 44 }]}>
          <View style={styles.brandRow}>
            {/* Back arrow -> Menu screen */}
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Back to menu"
              onPress={onBack}
              scaleTo={0.88}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </PressableScale>

            <PopIn>
              <View style={styles.shieldWrap}>
                <Ionicons name="shield" size={32} color="#7C4DFF" />
                <Ionicons name="code-slash" size={14} color="#FFFFFF" style={styles.shieldInner} />
              </View>
            </PopIn>
            <Text style={styles.topTitle} numberOfLines={1}>
              Code Breaker
            </Text>
          </View>

          {/* Tap the player pill -> Profile page */}
          <PressableScale onPress={onProfile ?? onSettings} scaleTo={0.94} style={styles.playerPill}>
            <View style={styles.playerAvatar}>
              <Ionicons name="person" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.playerName} numberOfLines={1}>
              {playerName}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#C4C9F5" />
          </PressableScale>
        </View>
      </FadeInUp>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: wide ? 28 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HERO ================= */}
        <FadeInUp delay={100} duration={500}>
          <LinearGradient
            colors={["#1A1470", "#2A1B95", "#151055"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hero, wide ? styles.heroWide : styles.heroNarrow]}
          >
            <View style={styles.heroSwoosh} pointerEvents="none" />

            <View style={[styles.heroText, wide && { flex: 1 }]}>
              <FadeInUp delay={200} style={{ alignSelf: "flex-start" }}>
                <View style={styles.welcomeBadge}>
                  <Text style={styles.welcomeText}>👋 Welcome Back!</Text>
                </View>
              </FadeInUp>

              <FadeInUp delay={300}>
                <Text style={[styles.heroTitle, { fontSize: wide ? 42 : 30 }]}>
                  CRACK THE <Text style={{ color: "#A855F7" }}>CODE</Text>
                </Text>
              </FadeInUp>

              <FadeInUp delay={400}>
                <Text style={styles.heroDesc}>
                  Use your logic, solve the clues and unlock the secrets.{"\n"}Are you ready for the challenge?
                </Text>
              </FadeInUp>

              {/* PLAY GAME + HOW TO PLAY buttons */}
              <FadeInUp delay={500} style={{ alignSelf: "flex-start" }}>
                <View style={styles.buttonsRow}>
                  <Pulse to={1.05}>
                    <PressableScale onPress={onPlay} scaleTo={0.94} style={styles.playWrapper}>
                      <LinearGradient
                        colors={["#5B6CFF", "#A855F7"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.playButton}
                      >
                        <Ionicons name="play" size={18} color="#FFFFFF" />
                        <Text style={styles.playText}>PLAY GAME</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                      </LinearGradient>
                    </PressableScale>
                  </Pulse>

                  <PressableScale
                    onPress={() => setShowHowTo(true)}
                    scaleTo={0.94}
                    style={styles.howButton}
                  >
                    <Ionicons name="help-circle-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.howButtonText}>HOW TO PLAY</Text>
                  </PressableScale>
                </View>
              </FadeInUp>
            </View>

            {/* Animated lock: numbers orbit, key opens the lock */}
            <FadeInUp delay={350} duration={600} style={wide ? styles.heroArtWide : styles.heroArtNarrow}>
              <LockAnimation size={wide ? 300 : 240} />
            </FadeInUp>
          </LinearGradient>
        </FadeInUp>
      </ScrollView>

      {/* ================= HOW TO PLAY VIDEO ================= */}
      <HowToPlayModal visible={showHowTo} onClose={() => setShowHowTo(false)} />
    </LinearGradient>
  );
};

export default HomeScreen;

/* ===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 18,
    paddingBottom: 32,
    gap: 18,
  },

  /* ---- top bar ---- */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(120,130,255,0.15)",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59,64,180,0.28)",
    borderWidth: 1,
    borderColor: "rgba(120,130,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  shieldWrap: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  shieldInner: {
    position: "absolute",
  },
  topTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    flexShrink: 1,
  },
  playerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 14,
    borderRadius: 24,
    backgroundColor: "rgba(59,64,180,0.28)",
    borderWidth: 1,
    borderColor: "rgba(120,130,255,0.2)",
    maxWidth: 150,
    marginLeft: 8,
  },
  playerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#6D4AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  playerName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },

  /* ---- hero ---- */
  hero: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(124,92,255,0.3)",
    overflow: "hidden",
    padding: 28,
  },
  heroWide: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 250,
  },
  heroNarrow: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  heroSwoosh: {
    position: "absolute",
    right: -120,
    top: -80,
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: "rgba(109,74,255,0.22)",
  },
  heroText: {
    zIndex: 2,
  },
  heroArtWide: {
    width: 320,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  heroArtNarrow: {
    alignSelf: "center",
    marginTop: 8,
    height: 250,
    justifyContent: "center",
    zIndex: 2,
  },
  welcomeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(109,74,255,0.55)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  welcomeText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "700",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    letterSpacing: 0.5,
    marginTop: 14,
  },
  heroDesc: {
    color: "#D7DBFF",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
    maxWidth: 520,
  },

  /* ---- buttons ---- */
  buttonsRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 14,
    marginTop: 24,
  },
  playWrapper: {
    alignSelf: "flex-start",
    borderRadius: 32,
    shadowColor: "#7C4DFF",
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 34,
    borderRadius: 32,
  },
  playText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  howButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 26,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: "rgba(168,85,247,0.8)",
    backgroundColor: "rgba(168,85,247,0.15)",
  },
  howButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
