// // import React, { useEffect, useRef, useState } from "react";
// // import { View, Text, Pressable, StyleSheet, Animated, Easing, ActivityIndicator } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";

// // import { claimSkipReward, SkipClaimResponse } from "../api/skipRoundApi";
// // import SparkleBurst from "./SparkleBurst";
// // import { playSound } from "../utils/sound";

// // interface Props {
// //   playerName: string;
// //   /** unique id of this finished set (we use the last round's id) */
// //   setKey: string;
// //   totalRounds: number;
// //   /** shown only if the backend can't compute stars */
// //   fallbackStars: number;
// //   onClose: () => void;
// //   onViewResults: () => void;
// //   onContinue: () => void;
// // }

// // const C = {
// //   indigo: "#4F46E5",
// //   indigoDark: "#2B2A8C",
// //   indigoSoft: "#EEF0FF",
// //   border: "#DAD8F5",
// //   text: "#141B34",
// //   gold: "#F2B640",
// //   coral: "#FF3B7F",
// // };

// // // "Great Job!" popup shown after ALL rounds are complete.
// // // Data comes from the backend (POST /api/skip/claim), nothing is hardcoded.
// // const GameCompleteModal: React.FC<Props> = ({
// //   playerName,
// //   setKey,
// //   totalRounds,
// //   fallbackStars,
// //   onClose,
// //   onViewResults,
// //   onContinue,
// // }) => {
// //   const [data, setData] = useState<SkipClaimResponse | null>(null);
// //   const [error, setError] = useState(false);

// //   const pop = useRef(new Animated.Value(0)).current;
// //   const bob = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     let cancelled = false;
// //     claimSkipReward(playerName, setKey, totalRounds, fallbackStars)
// //       .then((res) => {
// //         if (cancelled) return;
// //         if (res?.success) {
// //           setData(res);
// //           playSound(res.awarded ? "jackpot" : "win");
// //         } else setError(true);
// //       })
// //       .catch(() => !cancelled && setError(true));
// //     return () => {
// //       cancelled = true;
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   useEffect(() => {
// //     Animated.spring(pop, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(bob, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
// //         Animated.timing(bob, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
// //       ])
// //     ).start();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const stats = data?.stats;
// //   const skips = data?.skips ?? 0;

// //   return (
// //     <View style={s.backdrop}>
// //       <Animated.View style={[s.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }] }]}>
// //         {/* trophy */}
// //         <Animated.View style={[s.trophyWrap, { transform: [{ translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }] }]}>
// //           <View style={s.glow} />
// //           <Text style={s.trophy}>🏆</Text>
// //           <SparkleBurst size={90} />
// //         </Animated.View>

// //         <Pressable style={s.close} onPress={onClose} hitSlop={10}>
// //           <Ionicons name="close" size={24} color="#8B7CF6" />
// //         </Pressable>

// //         <Text style={s.title}>Great Job!</Text>
// //         <Text style={s.sub}>You completed all {totalRounds} rounds! 🎉</Text>

// //         {!data && !error ? (
// //           <ActivityIndicator style={{ marginVertical: 40 }} color={C.indigo} />
// //         ) : error ? (
// //           <Text style={s.error}>Couldn't load your summary.</Text>
// //         ) : (
// //           <>
// //             <View style={s.statsRow}>
// //               <View style={s.stat}>
// //                 <View style={s.statTop}>
// //                   <Text style={s.statIcon}>⭐</Text>
// //                   <Text style={s.statValue}>
// //                     {stats?.roundsCompleted} / {stats?.totalRounds}
// //                   </Text>
// //                 </View>
// //                 <Text style={s.statLabel}>Rounds Completed</Text>
// //               </View>
// //               <View style={s.divider} />
// //               <View style={s.stat}>
// //                 <View style={s.statTop}>
// //                   <Text style={s.statIcon}>🪙</Text>
// //                   <Text style={s.statValue}>{stats?.starsEarned}</Text>
// //                 </View>
// //                 <Text style={s.statLabel}>Total Stars Earned</Text>
// //               </View>
// //             </View>

// //             {data?.awarded ? (
// //               <Text style={s.rewardNote}>🎁 You earned +{data.reward} Skip Round!</Text>
// //             ) : null}

// //             <Pressable style={s.primaryBtn} onPress={onViewResults}>
// //               <Ionicons name="stats-chart" size={20} color="#FFFFFF" />
// //               <Text style={s.primaryText}>View Results</Text>
// //             </Pressable>

// //             <View style={s.orRow}>
// //               <View style={s.line} />
// //               <Text style={s.orText}>Or</Text>
// //               <View style={s.line} />
// //             </View>

// //             <Pressable style={s.skipBtn} onPress={onContinue}>
// //               <Ionicons name="play-forward" size={22} color={C.indigo} />
// //               <Text style={s.skipText}>Skip Round</Text>
// //               {skips > 0 ? (
// //                 <View style={s.badge}>
// //                   <Text style={s.badgeText}>{skips}</Text>
// //                 </View>
// //               ) : null}
// //             </Pressable>
// //           </>
// //         )}
// //       </Animated.View>
// //     </View>
// //   );
// // };

// // const s = StyleSheet.create({
// //   backdrop: {
// //     position: "absolute",
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: "rgba(20,27,52,0.72)",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     paddingHorizontal: 18,
// //     zIndex: 60,
// //   },
// //   card: {
// //     width: "100%",
// //     maxWidth: 380,
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 28,
// //     borderWidth: 1.5,
// //     borderColor: "#C9C3FA",
// //     paddingHorizontal: 22,
// //     paddingBottom: 24,
// //     paddingTop: 70,
// //     alignItems: "center",
// //     marginTop: 50,
// //   },
// //   trophyWrap: { position: "absolute", top: -62, alignItems: "center", justifyContent: "center", width: 140, height: 120 },
// //   glow: { position: "absolute", width: 120, height: 120, borderRadius: 60, backgroundColor: "#FFE9A6", opacity: 0.6 },
// //   trophy: { fontSize: 84 },
// //   close: { position: "absolute", top: 16, right: 16 },
// //   title: { fontSize: 38, fontWeight: "900", color: C.indigoDark, marginTop: 6 },
// //   sub: { marginTop: 8, fontSize: 16, fontWeight: "700", color: C.indigoDark, textAlign: "center" },
// //   error: { marginVertical: 30, color: "#F0566A", fontWeight: "700" },

// //   statsRow: {
// //     marginTop: 20,
// //     width: "100%",
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: C.indigoSoft,
// //     borderRadius: 18,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     paddingVertical: 16,
// //   },
// //   stat: { flex: 1, alignItems: "center" },
// //   statTop: { flexDirection: "row", alignItems: "center", gap: 8 },
// //   statIcon: { fontSize: 26 },
// //   statValue: { fontSize: 26, fontWeight: "900", color: C.indigoDark },
// //   statLabel: { marginTop: 4, fontSize: 12.5, fontWeight: "600", color: C.indigoDark },
// //   divider: { width: 1, height: 44, backgroundColor: C.border },

// //   rewardNote: { marginTop: 14, fontSize: 14, fontWeight: "800", color: "#8A6A1D" },

// //   primaryBtn: {
// //     marginTop: 18,
// //     width: "88%",
// //     height: 54,
// //     borderRadius: 27,
// //     backgroundColor: "#6D4BF0",
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 10,
// //     shadowColor: "#6D4BF0",
// //     shadowOpacity: 0.35,
// //     shadowRadius: 10,
// //     shadowOffset: { width: 0, height: 6 },
// //     elevation: 6,
// //   },
// //   primaryText: { color: "#FFFFFF", fontSize: 19, fontWeight: "900" },

// //   orRow: { marginTop: 14, flexDirection: "row", alignItems: "center", width: "80%", gap: 10 },
// //   line: { flex: 1, height: 1, backgroundColor: C.border },
// //   orText: { color: C.indigoDark, fontWeight: "700" },

// //   skipBtn: {
// //     marginTop: 14,
// //     width: "62%",
// //     height: 50,
// //     borderRadius: 25,
// //     backgroundColor: "#F1EFFF",
// //     borderWidth: 1.5,
// //     borderColor: "#C9C3FA",
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 8,
// //   },
// //   skipText: { color: C.indigo, fontSize: 17, fontWeight: "900" },
// //   badge: {
// //     position: "absolute",
// //     top: -8,
// //     right: 4,
// //     minWidth: 22,
// //     height: 22,
// //     paddingHorizontal: 5,
// //     borderRadius: 11,
// //     backgroundColor: C.coral,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   badgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
// // });

// // export default GameCompleteModal;
// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   Pressable,
//   StyleSheet,
//   Animated,
//   Easing,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// import {
//   claimSkipReward,
//   SkipClaimResponse,
// } from "../api/SkipRoundapi";

// import SparkleBurst from "../components/SparkleBurst";
// import { playSound } from "../utils/sound";

// interface Props {
//   playerName: string;
//   setKey: string;
//   totalRounds: number;
//   fallbackStars: number;
//   onClose: () => void;
//   onViewResults: () => void;
//   onContinue: () => void;
// }

// const C = {
//   indigo: "#4F46E5",
//   indigoDark: "#2B2A8C",
//   indigoSoft: "#EEF0FF",
//   border: "#DAD8F5",
//   text: "#141B34",
//   gold: "#F2B640",
//   coral: "#FF3B7F",
// };

// const GameCompleteModal: React.FC<Props> = ({
//   playerName,
//   setKey,
//   totalRounds,
//   fallbackStars,
//   onClose,
//   onViewResults,
//   onContinue,
// }) => {
//   const [data, setData] = useState<SkipClaimResponse | null>(null);
//   const [error, setError] = useState(false);

//   const pop = useRef(new Animated.Value(0)).current;
//   const bob = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     let cancelled = false;

//     claimSkipReward(
//       playerName,
//       setKey,
//       totalRounds,
//       fallbackStars
//     )
//       .then((res: SkipClaimResponse) => {
//         if (cancelled) return;

//         if (res?.success) {
//           setData(res);

//           playSound(res.awarded ? "jackpot" : "win");
//         } else {
//           setError(true);
//         }
//       })
//       .catch(() => {
//         if (!cancelled) {
//           setError(true);
//         }
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, [playerName, setKey, totalRounds, fallbackStars]);

//   useEffect(() => {
//     Animated.spring(pop, {
//       toValue: 1,
//       friction: 5,
//       tension: 80,
//       useNativeDriver: true,
//     }).start();

//     const animation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(bob, {
//           toValue: 1,
//           duration: 900,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         }),
//         Animated.timing(bob, {
//           toValue: 0,
//           duration: 900,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         }),
//       ])
//     );

//     animation.start();

//     return () => {
//       animation.stop();
//     };
//   }, [bob, pop]);

//   const stats = data?.stats;
//   const skips = data?.skips ?? 0;

//   return (
//     <View style={s.backdrop}>
//       <Animated.View
//         style={[
//           s.card,
//           {
//             opacity: pop,
//             transform: [
//               {
//                 scale: pop.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [0.7, 1],
//                 }),
//               },
//             ],
//           },
//         ]}
//       >
//         {/* Trophy */}
//         <Animated.View
//           style={[
//             s.trophyWrap,
//             {
//               transform: [
//                 {
//                   translateY: bob.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: [0, -6],
//                   }),
//                 },
//               ],
//             },
//           ]}
//         >
//           <View style={s.glow} />

//           <Text style={s.trophy}>🏆</Text>

//           <SparkleBurst size={90} />
//         </Animated.View>

//         {/* Close */}
//         <Pressable
//           style={s.close}
//           onPress={onClose}
//           hitSlop={10}
//         >
//           <Ionicons
//             name="close"
//             size={24}
//             color="#8B7CF6"
//           />
//         </Pressable>

//         <Text style={s.title}>Great Job!</Text>

//         <Text style={s.sub}>
//           You completed all {totalRounds} rounds! 🎉
//         </Text>

//         {/* Loading */}
//         {!data && !error ? (
//           <ActivityIndicator
//             style={{ marginVertical: 40 }}
//             color={C.indigo}
//             size="large"
//           />
//         ) : error ? (
//           <Text style={s.error}>
//             Couldn't load your summary.
//           </Text>
//         ) : (
//           <>
//             {/* Stats */}
//             <View style={s.statsRow}>
//               <View style={s.stat}>
//                 <View style={s.statTop}>
//                   <Text style={s.statIcon}>⭐</Text>

//                   <Text style={s.statValue}>
//                     {stats?.roundsCompleted ?? totalRounds} /{" "}
//                     {stats?.totalRounds ?? totalRounds}
//                   </Text>
//                 </View>

//                 <Text style={s.statLabel}>
//                   Rounds Completed
//                 </Text>
//               </View>

//               <View style={s.divider} />

//               <View style={s.stat}>
//                 <View style={s.statTop}>
//                   <Text style={s.statIcon}>🪙</Text>

//                   <Text style={s.statValue}>
//                     {stats?.starsEarned ?? fallbackStars}
//                   </Text>
//                 </View>

//                 <Text style={s.statLabel}>
//                   Total Stars Earned
//                 </Text>
//               </View>
//             </View>

//             {/* Skip Reward */}
//             {data?.awarded ? (
//               <Text style={s.rewardNote}>
//                 🎁 You earned +{data.reward ?? 1} Skip Round!
//               </Text>
//             ) : null}

//             {/* View Results */}
//             <Pressable
//               style={s.primaryBtn}
//               onPress={onViewResults}
//             >
//               <Ionicons
//                 name="stats-chart"
//                 size={20}
//                 color="#FFFFFF"
//               />

//               <Text style={s.primaryText}>
//                 View Results
//               </Text>
//             </Pressable>

//             {/* OR */}
//             <View style={s.orRow}>
//               <View style={s.line} />

//               <Text style={s.orText}>Or</Text>

//               <View style={s.line} />
//             </View>

//             {/* Skip Round */}
//             <Pressable
//               style={s.skipBtn}
//               onPress={onContinue}
//             >
//               <Ionicons
//                 name="play-forward"
//                 size={22}
//                 color={C.indigo}
//               />

//               <Text style={s.skipText}>
//                 Skip Round
//               </Text>

//               {skips > 0 ? (
//                 <View style={s.badge}>
//                   <Text style={s.badgeText}>
//                     {skips}
//                   </Text>
//                 </View>
//               ) : null}
//             </Pressable>
//           </>
//         )}
//       </Animated.View>
//     </View>
//   );
// };

// const s = StyleSheet.create({
//   backdrop: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,

//     backgroundColor: "rgba(20,27,52,0.72)",

//     alignItems: "center",
//     justifyContent: "center",

//     paddingHorizontal: 18,

//     zIndex: 60,
//   },

//   card: {
//     width: "100%",
//     maxWidth: 380,

//     backgroundColor: "#FFFFFF",

//     borderRadius: 28,

//     borderWidth: 1.5,
//     borderColor: "#C9C3FA",

//     paddingHorizontal: 22,
//     paddingBottom: 24,
//     paddingTop: 70,

//     alignItems: "center",

//     marginTop: 50,
//   },

//   trophyWrap: {
//     position: "absolute",

//     top: -62,

//     alignItems: "center",
//     justifyContent: "center",

//     width: 140,
//     height: 120,
//   },

//   glow: {
//     position: "absolute",

//     width: 120,
//     height: 120,

//     borderRadius: 60,

//     backgroundColor: "#FFE9A6",

//     opacity: 0.6,
//   },

//   trophy: {
//     fontSize: 84,
//   },

//   close: {
//     position: "absolute",

//     top: 16,
//     right: 16,
//   },

//   title: {
//     fontSize: 38,

//     fontWeight: "900",

//     color: C.indigoDark,

//     marginTop: 6,
//   },

//   sub: {
//     marginTop: 8,

//     fontSize: 16,

//     fontWeight: "700",

//     color: C.indigoDark,

//     textAlign: "center",
//   },

//   error: {
//     marginVertical: 30,

//     color: "#F0566A",

//     fontWeight: "700",

//     textAlign: "center",
//   },

//   statsRow: {
//     marginTop: 20,

//     width: "100%",

//     flexDirection: "row",

//     alignItems: "center",

//     backgroundColor: C.indigoSoft,

//     borderRadius: 18,

//     borderWidth: 1,

//     borderColor: C.border,

//     paddingVertical: 16,
//   },

//   stat: {
//     flex: 1,

//     alignItems: "center",
//   },

//   statTop: {
//     flexDirection: "row",

//     alignItems: "center",

//     gap: 8,
//   },

//   statIcon: {
//     fontSize: 26,
//   },

//   statValue: {
//     fontSize: 26,

//     fontWeight: "900",

//     color: C.indigoDark,
//   },

//   statLabel: {
//     marginTop: 4,

//     fontSize: 12.5,

//     fontWeight: "600",

//     color: C.indigoDark,

//     textAlign: "center",
//   },

//   divider: {
//     width: 1,

//     height: 44,

//     backgroundColor: C.border,
//   },

//   rewardNote: {
//     marginTop: 14,

//     fontSize: 14,

//     fontWeight: "800",

//     color: "#8A6A1D",

//     textAlign: "center",
//   },

//   primaryBtn: {
//     marginTop: 18,

//     width: "88%",

//     height: 54,

//     borderRadius: 27,

//     backgroundColor: "#6D4BF0",

//     flexDirection: "row",

//     alignItems: "center",

//     justifyContent: "center",

//     gap: 10,

//     shadowColor: "#6D4BF0",

//     shadowOpacity: 0.35,

//     shadowRadius: 10,

//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },

//     elevation: 6,
//   },

//   primaryText: {
//     color: "#FFFFFF",

//     fontSize: 19,

//     fontWeight: "900",
//   },

//   orRow: {
//     marginTop: 14,

//     flexDirection: "row",

//     alignItems: "center",

//     width: "80%",

//     gap: 10,
//   },

//   line: {
//     flex: 1,

//     height: 1,

//     backgroundColor: C.border,
//   },

//   orText: {
//     color: C.indigoDark,

//     fontWeight: "700",
//   },

//   skipBtn: {
//     marginTop: 14,

//     width: "62%",

//     height: 50,

//     borderRadius: 25,

//     backgroundColor: "#F1EFFF",

//     borderWidth: 1.5,

//     borderColor: "#C9C3FA",

//     flexDirection: "row",

//     alignItems: "center",

//     justifyContent: "center",

//     gap: 8,
//   },

//   skipText: {
//     color: C.indigo,

//     fontSize: 17,

//     fontWeight: "900",
//   },

//   badge: {
//     position: "absolute",

//     top: -8,

//     right: 4,

//     minWidth: 22,

//     height: 22,

//     paddingHorizontal: 5,

//     borderRadius: 11,

//     backgroundColor: C.coral,

//     alignItems: "center",

//     justifyContent: "center",
//   },

//   badgeText: {
//     color: "#FFFFFF",

//     fontSize: 12,

//     fontWeight: "900",
//   },
// });

// export default GameCompleteModal;
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  claimSkipReward,
  consumeSkip,
  SkipClaimResponse,
} from "../api/SkipRoundapi";

import SparkleBurst from "../components/SparkleBurst";
import { playSound } from "../utils/sound";

interface Props {
  playerName: string;
  setKey: string;
  totalRounds: number;
  fallbackStars: number;
  onClose: () => void;
  onViewResults: () => void;
  // CHANGED: was onContinue. Called ONLY after a skip token was really spent.
  // The parent then jumps to round (totalRounds + 2): round +1 is skipped.
  onSkipRound: () => void;
}

const C = {
  indigo: "#4F46E5",
  indigoDark: "#2B2A8C",
  indigoSoft: "#EEF0FF",
  border: "#DAD8F5",
  coral: "#FF3B7F",
};

const GameCompleteModal: React.FC<Props> = ({
  playerName,
  setKey,
  totalRounds,
  fallbackStars,
  onClose,
  onViewResults,
  onSkipRound,
}) => {
  const [data, setData] = useState<SkipClaimResponse | null>(null);
  const [error, setError] = useState(false);
  const [skipsOverride, setSkipsOverride] = useState<number | null>(null);
  const [skipBusy, setSkipBusy] = useState(false);
  const [skipError, setSkipError] = useState<string | null>(null);

  const pop = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;

    claimSkipReward(playerName, setKey, totalRounds, fallbackStars)
      .then((res: SkipClaimResponse) => {
        if (cancelled) return;
        if (res?.success) {
          setData(res);
          playSound(res.awarded ? "jackpot" : "win");
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [playerName, setKey, totalRounds, fallbackStars]);

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [bob, pop]);

  const stats = data?.stats;
  const skips = skipsOverride ?? data?.skips ?? 0;
  const canSkip = skips > 0 && !skipBusy;

  // Spend ONE skip token, then ask the parent to jump ahead.
  // Backend: POST /api/skip/use with roundId "after-<setKey>" (one skip per set).
  const handleSkip = async () => {
    if (!canSkip) return;
    setSkipBusy(true);
    setSkipError(null);
    try {
      const res = await consumeSkip(playerName, `after-${setKey}`, totalRounds + 1);

      // "Round already skipped" = the token was spent on an earlier tap -> just continue
      if (res?.success || res?.message === "Round already skipped") {
        if (typeof res?.skips === "number") setSkipsOverride(res.skips);
        playSound("whoosh");
        onSkipRound();
        return;
      }
      if (typeof res?.skips === "number") setSkipsOverride(res.skips);
      setSkipError(res?.insufficient ? "No skips left" : res?.message ?? "Couldn't skip");
    } catch {
      setSkipError("Network error");
    } finally {
      setSkipBusy(false);
    }
  };

  return (
    <View style={s.backdrop}>
      <Animated.View
        style={[
          s.card,
          {
            opacity: pop,
            transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
          },
        ]}
      >
        <Animated.View
          style={[
            s.trophyWrap,
            { transform: [{ translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }] },
          ]}
        >
          <View style={s.glow} />
          <Text style={s.trophy}>🏆</Text>
          <SparkleBurst size={90} />
        </Animated.View>

        <Pressable style={s.close} onPress={onClose} hitSlop={10}>
          <Ionicons name="close" size={24} color="#8B7CF6" />
        </Pressable>

        <Text style={s.title}>Great Job!</Text>
        <Text style={s.sub}>You completed all {totalRounds} rounds! 🎉</Text>

        {!data && !error ? (
          <ActivityIndicator style={{ marginVertical: 40 }} color={C.indigo} size="large" />
        ) : error ? (
          <Text style={s.error}>Couldn't load your summary.</Text>
        ) : (
          <>
            <View style={s.statsRow}>
              <View style={s.stat}>
                <View style={s.statTop}>
                  <Text style={s.statIcon}>⭐</Text>
                  <Text style={s.statValue}>
                    {stats?.roundsCompleted ?? totalRounds} / {stats?.totalRounds ?? totalRounds}
                  </Text>
                </View>
                <Text style={s.statLabel}>Rounds Completed</Text>
              </View>

              <View style={s.divider} />

              <View style={s.stat}>
                <View style={s.statTop}>
                  <Text style={s.statIcon}>🪙</Text>
                  <Text style={s.statValue}>{stats?.starsEarned ?? fallbackStars}</Text>
                </View>
                <Text style={s.statLabel}>Total Stars Earned</Text>
              </View>
            </View>

            {data?.awarded ? (
              <Text style={s.rewardNote}>🎁 You earned +{data.reward ?? 1} Skip Round!</Text>
            ) : null}

            <Pressable style={s.primaryBtn} onPress={onViewResults}>
              <Ionicons name="stats-chart" size={20} color="#FFFFFF" />
              <Text style={s.primaryText}>View Results</Text>
            </Pressable>

            <View style={s.orRow}>
              <View style={s.line} />
              <Text style={s.orText}>Or</Text>
              <View style={s.line} />
            </View>

            <Pressable
              style={[s.skipBtn, !canSkip && { opacity: 0.45 }]}
              onPress={handleSkip}
              disabled={!canSkip}
            >
              {skipBusy ? (
                <ActivityIndicator color={C.indigo} />
              ) : (
                <>
                  <Ionicons name="play-forward" size={22} color={C.indigo} />
                  <Text style={s.skipText}>Skip Round</Text>
                </>
              )}
              {skips > 0 ? (
                <View style={s.badge}>
                  <Text style={s.badgeText}>{skips}</Text>
                </View>
              ) : null}
            </Pressable>

            {skipError ? <Text style={s.skipError}>{skipError}</Text> : null}
          </>
        )}
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(20,27,52,0.72)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    zIndex: 60,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#C9C3FA",
    paddingHorizontal: 22,
    paddingBottom: 24,
    paddingTop: 70,
    alignItems: "center",
    marginTop: 50,
  },
  trophyWrap: { position: "absolute", top: -62, alignItems: "center", justifyContent: "center", width: 140, height: 120 },
  glow: { position: "absolute", width: 120, height: 120, borderRadius: 60, backgroundColor: "#FFE9A6", opacity: 0.6 },
  trophy: { fontSize: 84 },
  close: { position: "absolute", top: 16, right: 16 },
  title: { fontSize: 38, fontWeight: "900", color: C.indigoDark, marginTop: 6 },
  sub: { marginTop: 8, fontSize: 16, fontWeight: "700", color: C.indigoDark, textAlign: "center" },
  error: { marginVertical: 30, color: "#F0566A", fontWeight: "700", textAlign: "center" },
  statsRow: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.indigoSoft,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 16,
  },
  stat: { flex: 1, alignItems: "center" },
  statTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  statIcon: { fontSize: 26 },
  statValue: { fontSize: 26, fontWeight: "900", color: C.indigoDark },
  statLabel: { marginTop: 4, fontSize: 12.5, fontWeight: "600", color: C.indigoDark, textAlign: "center" },
  divider: { width: 1, height: 44, backgroundColor: C.border },
  rewardNote: { marginTop: 14, fontSize: 14, fontWeight: "800", color: "#8A6A1D", textAlign: "center" },
  primaryBtn: {
    marginTop: 18,
    width: "88%",
    height: 54,
    borderRadius: 27,
    backgroundColor: "#6D4BF0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#6D4BF0",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  primaryText: { color: "#FFFFFF", fontSize: 19, fontWeight: "900" },
  orRow: { marginTop: 14, flexDirection: "row", alignItems: "center", width: "80%", gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: C.border },
  orText: { color: C.indigoDark, fontWeight: "700" },
  skipBtn: {
    marginTop: 14,
    width: "62%",
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F1EFFF",
    borderWidth: 1.5,
    borderColor: "#C9C3FA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  skipText: { color: C.indigo, fontSize: 17, fontWeight: "900" },
  skipError: { marginTop: 8, color: "#F0566A", fontWeight: "700", fontSize: 13 },
  badge: {
    position: "absolute",
    top: -8,
    right: 4,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 5,
    borderRadius: 11,
    backgroundColor: C.coral,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
});

export default GameCompleteModal;
