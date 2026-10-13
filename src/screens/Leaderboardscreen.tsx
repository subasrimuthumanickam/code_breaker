// // // import React, { useEffect, useState } from "react";
// // // import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from "react-native";
// // // import { LinearGradient } from "expo-linear-gradient";
// // // import { Ionicons } from "@expo/vector-icons";
// // // import { fetchLeaderboard } from "../api/Wordscrambleapi";

// // // interface LeaderboardScreenProps {
// // //   currentPlayerName: string;
// // //   onBack: () => void;
// // // }

// // // interface LeaderboardEntry {
// // //   rank: number;
// // //   name: string;
// // //   score: number;
// // // }

// // // const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ currentPlayerName, onBack }) => {
// // //   const [tab, setTab] = useState<"global" | "friends">("global");
// // //   const [players, setPlayers] = useState<LeaderboardEntry[]>([]);

// // //   useEffect(() => {
// // //     fetchLeaderboard()
// // //       .then(setPlayers)
// // //       .catch((err) => console.warn("Leaderboard failed:", err));
// // //   }, []);

// // //   return (
// // //     <LinearGradient colors={["#0B1020", "#141B36", "#0B1020"]} style={styles.flex}>
// // //       <SafeAreaView style={styles.flex}>
// // //         <StatusBar barStyle="light-content" backgroundColor="#0B1020" />

// // //         <View style={styles.topRow}>
// // //           <TouchableOpacity onPress={onBack}>
// // //             <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
// // //           </TouchableOpacity>
// // //           <Text style={styles.topTitle}>Leaderboard</Text>
// // //           <View style={{ width: 22 }} />
// // //         </View>

// // //         <View style={styles.tabRow}>
// // //           <TouchableOpacity
// // //             style={[styles.tabButton, tab === "global" && styles.tabButtonActive]}
// // //             onPress={() => setTab("global")}
// // //           >
// // //             <Text style={[styles.tabText, tab === "global" && styles.tabTextActive]}>Global</Text>
// // //           </TouchableOpacity>
// // //           <TouchableOpacity
// // //             style={[styles.tabButton, tab === "friends" && styles.tabButtonActive]}
// // //             onPress={() => setTab("friends")}
// // //           >
// // //             <Text style={[styles.tabText, tab === "friends" && styles.tabTextActive]}>Friends</Text>
// // //           </TouchableOpacity>
// // //         </View>

// // //         {tab === "friends" ? (
// // //           <Text style={styles.emptyText}>
// // //             Friends leaderboard needs login — coming soon.
// // //           </Text>
// // //         ) : (
// // //           <FlatList
// // //             data={players}
// // //             keyExtractor={(item) => String(item.rank)}
// // //             contentContainerStyle={styles.list}
// // //             renderItem={({ item }) => {
// // //               const isMe = item.name === currentPlayerName;
// // //               return (
// // //                 <View style={[styles.row, isMe && styles.rowMine]}>
// // //                   <Text style={styles.rank}>#{item.rank}</Text>
// // //                   <View style={styles.avatar}>
// // //                     <Ionicons name="person" size={14} color="#FFFFFF" />
// // //                   </View>
// // //                   <Text style={styles.name}>{item.name}</Text>
// // //                   <Text style={styles.score}>{item.score}</Text>
// // //                 </View>
// // //               );
// // //             }}
// // //           />
// // //         )}
// // //       </SafeAreaView>
// // //     </LinearGradient>
// // //   );
// // // };

// // // export default LeaderboardScreen;

// // // const styles = StyleSheet.create({
// // //   flex: { flex: 1 },
// // //   topRow: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     paddingHorizontal: 20,
// // //     paddingTop: 8,
// // //     paddingBottom: 16,
// // //   },
// // //   topTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
// // //   tabRow: {
// // //     flexDirection: "row",
// // //     marginHorizontal: 20,
// // //     backgroundColor: "#141B36",
// // //     borderRadius: 12,
// // //     padding: 4,
// // //     marginBottom: 16,
// // //   },
// // //   tabButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
// // //   tabButtonActive: { backgroundColor: "#5B3FD6" },
// // //   tabText: { color: "#9AA5C0", fontWeight: "700", fontSize: 13 },
// // //   tabTextActive: { color: "#FFFFFF" },
// // //   emptyText: { color: "#5A6478", textAlign: "center", marginTop: 40, paddingHorizontal: 30 },
// // //   list: { paddingHorizontal: 20, gap: 10, paddingBottom: 24 },
// // //   row: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 12,
// // //     backgroundColor: "#141B36",
// // //     borderRadius: 14,
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 14,
// // //   },
// // //   rowMine: { borderWidth: 1, borderColor: "#5B3FD6" },
// // //   rank: { width: 32, color: "#9AA5C0", fontWeight: "700", fontSize: 13 },
// // //   avatar: {
// // //     width: 28,
// // //     height: 28,
// // //     borderRadius: 14,
// // //     backgroundColor: "#3B82F6",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   name: { flex: 1, color: "#E2E8F5", fontWeight: "700", fontSize: 13.5 },
// // //   score: { color: "#F5C518", fontWeight: "800", fontSize: 13.5 },
// // // });
// // import React, { useCallback, useEffect, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   RefreshControl,
// //   ActivityIndicator,
// // } from "react-native";
// // import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// // import { fetchScorecard, ScorecardEntry } from "../api/Wordscrambleapi";

// // interface LeaderboardScreenProps {
// //   currentPlayerName: string;
// //   onBack: () => void;
// // }

// // /* how often the board refreshes itself (live update) */
// // const REFRESH_MS = 5000;

// // const T = {
// //   bg: "#EAF8F2",
// //   ink: "#0F3D3E",
// //   inkSoft: "#4F7476",
// //   inkFaint: "#8FB0AE",
// //   teal: "#14A38B",
// //   tealDark: "#0C7F6B",
// //   tealPale: "#D2F2E8",
// //   line: "#CBE8DE",
// //   card: "#FFFFFF",
// //   gold: "#F5A623",
// //   goldDark: "#B8741A",
// //   goldPale: "#FFF4D6",
// //   goldEdge: "#F6E2A8",
// //   tile: "#FFF6DF",
// //   tileEdge: "#E2CD9C",
// //   coral: "#FF8A3D",
// // };

// // const AVATAR_COLORS = [
// //   "#14A38B",
// //   "#FF8A3D",
// //   "#A78BFA",
// //   "#6FCFB0",
// //   "#4FA3E0",
// //   "#F4879F",
// //   "#9B7FE8",
// // ];

// // const MEDAL: Record<number, { bg: string; fg: string }> = {
// //   1: { bg: "#F5A623", fg: "#FFFFFF" },
// //   2: { bg: "#A9B8C6", fg: "#FFFFFF" },
// //   3: { bg: "#D9814A", fg: "#FFFFFF" },
// // };

// // const ordinal = (n: number) => {
// //   const s = ["th", "st", "nd", "rd"];
// //   const v = n % 100;
// //   return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
// // };

// // const Coin: React.FC<{ size?: number }> = ({ size = 22 }) => (
// //   <View
// //     style={{
// //       width: size,
// //       height: size,
// //       borderRadius: size / 2,
// //       backgroundColor: T.gold,
// //       borderWidth: 2,
// //       borderColor: "#FFD36B",
// //       alignItems: "center",
// //       justifyContent: "center",
// //     }}
// //   >
// //     <Text style={{ color: "#FFFFFF", fontSize: size * 0.55, fontWeight: "900" }}>$</Text>
// //   </View>
// // );

// // const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
// //   currentPlayerName,
// //   onBack,
// // }) => {
// //   const [players, setPlayers] = useState<ScorecardEntry[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [error, setError] = useState(false);
// //   const inFlight = useRef(false);

// //   const load = useCallback(async () => {
// //     if (inFlight.current) return;
// //     inFlight.current = true;

// //     try {
// //       const data = await fetchScorecard();
// //       setPlayers(data);
// //       setError(false);
// //     } catch (err) {
// //       console.warn("Scorecard failed:", err);
// //       setError(true);
// //     } finally {
// //       inFlight.current = false;
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   }, []);

// //   // first load + live auto refresh
// //   useEffect(() => {
// //     load();

// //     const id = setInterval(load, REFRESH_MS);

// //     return () => clearInterval(id);
// //   }, [load]);

// //   const winner = players[0];

// //   return (
// //     <View style={styles.root}>
// //       <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

// //       {/* soft background rings */}
// //       <View pointerEvents="none" style={[styles.ring, styles.ringTop]} />
// //       <View pointerEvents="none" style={[styles.ring, styles.ringTop2]} />

// //       <SafeAreaView style={styles.flex}>
// //         {/* ---------- header (no coins total, no bell) ---------- */}
// //         <View style={styles.header}>
// //           <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
// //             <Ionicons name="arrow-back" size={22} color={T.ink} />
// //           </TouchableOpacity>

// //           <View style={styles.logo}>
// //             <Text style={styles.logoW}>W</Text>
// //             <Text style={styles.logoS}>S</Text>
// //           </View>

// //           <View style={styles.flex}>
// //             <Text style={styles.brand}>Word Scramble</Text>
// //             <Text style={styles.brandSub}>Think fast. Play smart.</Text>
// //           </View>
// //         </View>

// //         <ScrollView
// //           contentContainerStyle={styles.scroll}
// //           showsVerticalScrollIndicator={false}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={() => {
// //                 setRefreshing(true);
// //                 load();
// //               }}
// //               tintColor={T.teal}
// //               colors={[T.teal]}
// //             />
// //           }
// //         >
// //           {loading ? (
// //             <View style={styles.center}>
// //               <ActivityIndicator size="large" color={T.teal} />
// //             </View>
// //           ) : (
// //             <>
// //               {error ? (
// //                 <View style={styles.errorBanner}>
// //                   <Ionicons name="cloud-offline-outline" size={16} color={T.coral} />
// //                   <Text style={styles.errorText}>Can't reach the server. Retrying…</Text>
// //                 </View>
// //               ) : null}

// //               {/* ---------- winner card ---------- */}
// //               {winner ? (
// //                 <View style={styles.winnerCard}>
// //                   <View style={styles.winnerTop}>
// //                     <View style={styles.crownMedal}>
// //                       <MaterialCommunityIcons name="crown" size={34} color="#FFFFFF" />
// //                     </View>

// //                     <View style={styles.flex}>
// //                       <View style={styles.winnerLabelRow}>
// //                         <MaterialCommunityIcons name="crown" size={16} color={T.gold} />
// //                         <Text style={styles.winnerLabel}>Winner</Text>
// //                       </View>

// //                       <View style={styles.winnerPlayer}>
// //                         <View
// //                           style={[
// //                             styles.winnerAvatar,
// //                             { backgroundColor: winner.avatarColor || AVATAR_COLORS[0] },
// //                           ]}
// //                         >
// //                           <Ionicons name="person" size={24} color="#FFFFFF" />
// //                         </View>

// //                         <View style={styles.flex}>
// //                           <Text style={styles.winnerName} numberOfLines={1}>
// //                             {winner.name}
// //                           </Text>
// //                           <View style={styles.placePill}>
// //                             <Text style={styles.placeText}>1st Place</Text>
// //                           </View>
// //                         </View>
// //                       </View>
// //                     </View>
// //                   </View>

// //                   <View style={styles.winnerStats}>
// //                     <View style={styles.winnerStat}>
// //                       <View style={styles.statLabelRow}>
// //                         <Ionicons name="book" size={14} color={T.tealDark} />
// //                         <Text style={styles.statLabel}>Words Found</Text>
// //                       </View>
// //                       <Text style={styles.statValue}>{winner.wordsFound}</Text>
// //                     </View>

// //                     <View style={styles.statDivider} />

// //                     <View style={styles.winnerStat}>
// //                       <View style={styles.statLabelRow}>
// //                         <Coin size={16} />
// //                         <Text style={styles.statLabel}>Coins Earned</Text>
// //                       </View>
// //                       <Text style={[styles.statValue, { color: T.goldDark }]}>
// //                         {winner.coinsEarned}
// //                       </Text>
// //                     </View>
// //                   </View>
// //                 </View>
// //               ) : null}

// //               {/* ---------- table ---------- */}
// //               <View style={styles.tableCard}>
// //                 <View style={styles.tableHead}>
// //                   <Text style={[styles.headText, styles.colRank]}>#</Text>
// //                   <Text style={[styles.headText, styles.colPlayer]}>Player</Text>

// //                   <View style={[styles.colWords, styles.headCell]}>
// //                     <Ionicons name="book" size={13} color={T.tealDark} />
// //                     <Text style={styles.headText}>Words</Text>
// //                   </View>

// //                   <View style={[styles.colCoins, styles.headCell]}>
// //                     <Coin size={14} />
// //                     <Text style={styles.headText}>Coins</Text>
// //                   </View>
// //                 </View>

// //                 {players.length === 0 ? (
// //                   <View style={styles.empty}>
// //                     <Ionicons name="trophy-outline" size={30} color={T.inkFaint} />
// //                     <Text style={styles.emptyText}>No players yet</Text>
// //                   </View>
// //                 ) : (
// //                   players.map((p, index) => {
// //                     const isMe = p.name === currentPlayerName;
// //                     const medal = MEDAL[p.rank];
// //                     const avatar =
// //                       p.avatarColor || AVATAR_COLORS[index % AVATAR_COLORS.length];

// //                     return (
// //                       <View
// //                         key={`${p.rank}-${p.name}`}
// //                         style={[
// //                           styles.row,
// //                           p.rank === 1 && styles.rowFirst,
// //                           isMe && styles.rowMe,
// //                         ]}
// //                       >
// //                         <View style={styles.colRank}>
// //                           <View
// //                             style={[
// //                               styles.rankBadge,
// //                               medal && { backgroundColor: medal.bg },
// //                             ]}
// //                           >
// //                             <Text
// //                               style={[
// //                                 styles.rankText,
// //                                 medal && { color: medal.fg },
// //                               ]}
// //                             >
// //                               {p.rank}
// //                             </Text>
// //                           </View>
// //                         </View>

// //                         <View style={[styles.colPlayer, styles.playerCell]}>
// //                           <View style={[styles.avatar, { backgroundColor: avatar }]}>
// //                             <Ionicons name="person" size={18} color="#FFFFFF" />
// //                           </View>

// //                           <View style={styles.flex}>
// //                             <Text style={styles.name} numberOfLines={1}>
// //                               {p.name}
// //                             </Text>
// //                             {isMe ? <Text style={styles.you}>That's you</Text> : null}
// //                           </View>
// //                         </View>

// //                         <View style={[styles.colWords, styles.valueCell]}>
// //                           <Ionicons name="book" size={15} color={T.tealDark} />
// //                           <Text style={styles.wordsValue}>{p.wordsFound}</Text>
// //                         </View>

// //                         <View style={[styles.colCoins, styles.valueCell]}>
// //                           <Coin size={18} />
// //                           <Text style={styles.coinsValue}>{p.coinsEarned}</Text>
// //                         </View>
// //                       </View>
// //                     );
// //                   })
// //                 )}
// //               </View>

// //               <View style={{ height: 24 }} />
// //             </>
// //           )}
// //         </ScrollView>
// //       </SafeAreaView>
// //     </View>
// //   );
// // };

// // export default LeaderboardScreen;

// // /* =========================================================
// //    STYLES
// // ========================================================= */

// // const styles = StyleSheet.create({
// //   root: { flex: 1, backgroundColor: T.bg },
// //   flex: { flex: 1, minWidth: 0 },

// //   ring: {
// //     position: "absolute",
// //     borderWidth: 2,
// //     borderColor: T.teal,
// //     borderRadius: 999,
// //   },
// //   ringTop: { width: 260, height: 260, top: -90, right: -90, opacity: 0.14 },
// //   ringTop2: { width: 380, height: 380, top: -150, right: -150, opacity: 0.09 },

// //   /* header */
// //   header: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingHorizontal: 16,
// //     paddingTop: 10,
// //     paddingBottom: 12,
// //     gap: 10,
// //   },
// //   backBtn: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 14,
// //     backgroundColor: T.card,
// //     borderWidth: 1.5,
// //     borderColor: T.line,
// //     borderBottomWidth: 4,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   logo: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 13,
// //     backgroundColor: T.tile,
// //     borderWidth: 2,
// //     borderColor: T.tileEdge,
// //     borderBottomWidth: 4,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     flexDirection: "row",
// //   },
// //   logoW: { color: T.teal, fontSize: 20, fontWeight: "900" },
// //   logoS: { color: T.coral, fontSize: 20, fontWeight: "900" },
// //   brand: { color: T.ink, fontSize: 19, fontWeight: "900" },
// //   brandSub: { color: T.inkSoft, fontSize: 11, marginTop: 2, fontWeight: "600" },

// //   scroll: { paddingHorizontal: 16, paddingBottom: 20 },
// //   center: { paddingVertical: 80, alignItems: "center" },

// //   errorBanner: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //     paddingVertical: 10,
// //     paddingHorizontal: 14,
// //     borderRadius: 14,
// //     backgroundColor: "#FFE8D6",
// //     marginBottom: 12,
// //   },
// //   errorText: { color: "#DB6A1C", fontSize: 13, fontWeight: "700" },

// //   /* winner card */
// //   winnerCard: {
// //     backgroundColor: T.goldPale,
// //     borderRadius: 24,
// //     borderWidth: 1.5,
// //     borderColor: T.goldEdge,
// //     padding: 16,
// //     marginBottom: 16,
// //   },
// //   winnerTop: { flexDirection: "row", alignItems: "center", gap: 14 },
// //   crownMedal: {
// //     width: 76,
// //     height: 76,
// //     borderRadius: 38,
// //     backgroundColor: T.gold,
// //     borderWidth: 4,
// //     borderColor: "#FFD36B",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   winnerLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
// //   winnerLabel: { color: T.gold, fontSize: 15, fontWeight: "900" },
// //   winnerPlayer: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
// //   winnerAvatar: {
// //     width: 46,
// //     height: 46,
// //     borderRadius: 23,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   winnerName: { color: T.ink, fontSize: 22, fontWeight: "900" },
// //   placePill: {
// //     alignSelf: "flex-start",
// //     backgroundColor: "#FBE3A2",
// //     borderRadius: 999,
// //     paddingVertical: 3,
// //     paddingHorizontal: 10,
// //     marginTop: 4,
// //   },
// //   placeText: { color: T.goldDark, fontSize: 12, fontWeight: "800" },

// //   winnerStats: {
// //     flexDirection: "row",
// //     marginTop: 14,
// //     backgroundColor: "rgba(255,255,255,0.65)",
// //     borderRadius: 16,
// //     paddingVertical: 12,
// //   },
// //   winnerStat: { flex: 1, alignItems: "center" },
// //   statLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
// //   statLabel: { color: T.inkSoft, fontSize: 12, fontWeight: "700" },
// //   statValue: { color: T.ink, fontSize: 26, fontWeight: "900", marginTop: 4 },
// //   statDivider: { width: 1, backgroundColor: T.goldEdge, marginVertical: 4 },

// //   /* table */
// //   tableCard: {
// //     backgroundColor: "rgba(255,255,255,0.7)",
// //     borderRadius: 24,
// //     borderWidth: 1.5,
// //     borderColor: T.line,
// //     padding: 10,
// //   },
// //   tableHead: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: T.tealPale,
// //     borderRadius: 14,
// //     paddingVertical: 12,
// //     paddingHorizontal: 10,
// //     marginBottom: 8,
// //   },
// //   headText: { color: T.tealDark, fontSize: 12.5, fontWeight: "800" },
// //   headCell: { flexDirection: "row", alignItems: "center", gap: 5 },

// //   colRank: { width: 42 },
// //   colPlayer: { flex: 1, minWidth: 0 },
// //   colWords: { width: 78, justifyContent: "center" },
// //   colCoins: { width: 78, justifyContent: "center" },

// //   row: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: T.card,
// //     borderRadius: 16,
// //     borderWidth: 1.5,
// //     borderColor: "#E7F1EC",
// //     paddingVertical: 10,
// //     paddingHorizontal: 10,
// //     marginBottom: 8,
// //   },
// //   rowFirst: { backgroundColor: "#F2FBF7" },
// //   rowMe: { borderColor: T.teal, backgroundColor: "#EAF8F2" },

// //   rankBadge: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     backgroundColor: "#E4F1EC",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   rankText: { color: T.tealDark, fontSize: 13, fontWeight: "900" },

// //   playerCell: { flexDirection: "row", alignItems: "center", gap: 10 },
// //   avatar: {
// //     width: 38,
// //     height: 38,
// //     borderRadius: 19,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   name: { color: T.ink, fontSize: 15, fontWeight: "800" },
// //   you: { color: T.inkSoft, fontSize: 11, marginTop: 1 },

// //   valueCell: { flexDirection: "row", alignItems: "center", gap: 6 },
// //   wordsValue: { color: T.tealDark, fontSize: 16, fontWeight: "900" },
// //   coinsValue: { color: "#C97A12", fontSize: 16, fontWeight: "900" },

// //   empty: { alignItems: "center", paddingVertical: 40, gap: 8 },
// //   emptyText: { color: T.inkSoft, fontSize: 13, fontWeight: "600" },
// // });
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   RefreshControl,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// import { fetchScorecard, ScorecardEntry } from "../api/Wordscrambleapi";

// interface LeaderboardScreenProps {
//   currentPlayerName: string;
//   onBack: () => void;
// }

// /* how often the board refreshes itself (live update) */
// const REFRESH_MS = 5000;

// const T = {
//   bg: "#EAF8F2",
//   ink: "#0F3D3E",
//   inkSoft: "#4F7476",
//   inkFaint: "#8FB0AE",
//   teal: "#14A38B",
//   tealDark: "#0C7F6B",
//   tealPale: "#D2F2E8",
//   line: "#CBE8DE",
//   card: "#FFFFFF",
//   gold: "#F5A623",
//   goldDark: "#B8741A",
//   goldPale: "#FFF4D6",
//   goldEdge: "#F6E2A8",
//   tile: "#FFF6DF",
//   tileEdge: "#E2CD9C",
//   coral: "#FF8A3D",
// };

// const AVATAR_COLORS = [
//   "#14A38B",
//   "#FF8A3D",
//   "#A78BFA",
//   "#6FCFB0",
//   "#4FA3E0",
//   "#F4879F",
//   "#9B7FE8",
// ];

// /* star colour per place */
// const STAR_COLOR: Record<number, string> = {
//   1: "#F5A623", // gold
//   2: "#A9B8C6", // silver
//   3: "#D9814A", // bronze
// };

// /**
//  * Rank shown as stars:
//  *   1st place = 1 star, 2nd place = 2 stars, 3rd place = 3 stars ...
//  * Above 5 stars it shows one star + "x N" so the row never overflows.
//  */
// const RankStars: React.FC<{ rank: number; size?: number }> = ({
//   rank,
//   size = 12,
// }) => {
//   const color = STAR_COLOR[rank] || T.teal;

//   if (rank > 5) {
//     return (
//       <View style={styles.starRow}>
//         <Ionicons name="star" size={size} color={color} />
//         <Text style={[styles.starMore, { color }]}>x{rank}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.starRow}>
//       {Array.from({ length: Math.max(rank, 1) }).map((_, i) => (
//         <Ionicons key={i} name="star" size={size} color={color} />
//       ))}
//     </View>
//   );
// };

// const Coin: React.FC<{ size?: number }> = ({ size = 22 }) => (
//   <View
//     style={{
//       width: size,
//       height: size,
//       borderRadius: size / 2,
//       backgroundColor: T.gold,
//       borderWidth: 2,
//       borderColor: "#FFD36B",
//       alignItems: "center",
//       justifyContent: "center",
//     }}
//   >
//     <Text style={{ color: "#FFFFFF", fontSize: size * 0.55, fontWeight: "900" }}>$</Text>
//   </View>
// );

// const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
//   currentPlayerName,
//   onBack,
// }) => {
//   const [players, setPlayers] = useState<ScorecardEntry[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(false);
//   const inFlight = useRef(false);

//   const load = useCallback(async () => {
//     if (inFlight.current) return;
//     inFlight.current = true;

//     try {
//       // backend already returns players sorted by WORDS FOUND (most first)
//       const data = await fetchScorecard();
//       setPlayers(data);
//       setError(false);
//     } catch (err) {
//       console.warn("Scorecard failed:", err);
//       setError(true);
//     } finally {
//       inFlight.current = false;
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   // first load + live auto refresh
//   useEffect(() => {
//     load();

//     const id = setInterval(load, REFRESH_MS);

//     return () => clearInterval(id);
//   }, [load]);

//   // Winner = rank 1 with at least one word found (decided by the backend)
//   const winner = players.find((p) => p.isWinner) ?? null;

//   return (
//     <View style={styles.root}>
//       <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

//       {/* soft background rings */}
//       <View pointerEvents="none" style={[styles.ring, styles.ringTop]} />
//       <View pointerEvents="none" style={[styles.ring, styles.ringTop2]} />

//       <SafeAreaView style={styles.flex}>
//         {/* ---------- header ---------- */}
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
//             <Ionicons name="arrow-back" size={22} color={T.ink} />
//           </TouchableOpacity>

//           <View style={styles.logo}>
//             <Text style={styles.logoW}>W</Text>
//             <Text style={styles.logoS}>S</Text>
//           </View>

//           <View style={styles.flex}>
//             <Text style={styles.brand}>Word Scramble</Text>
//             <Text style={styles.brandSub}>Think fast. Play smart.</Text>
//           </View>
//         </View>

//         <ScrollView
//           contentContainerStyle={styles.scroll}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={() => {
//                 setRefreshing(true);
//                 load();
//               }}
//               tintColor={T.teal}
//               colors={[T.teal]}
//             />
//           }
//         >
//           {loading ? (
//             <View style={styles.center}>
//               <ActivityIndicator size="large" color={T.teal} />
//             </View>
//           ) : (
//             <>
//               {error ? (
//                 <View style={styles.errorBanner}>
//                   <Ionicons name="cloud-offline-outline" size={16} color={T.coral} />
//                   <Text style={styles.errorText}>Can't reach the server. Retrying…</Text>
//                 </View>
//               ) : null}

//               {/* ---------- winner card ---------- */}
//               {winner ? (
//                 <View style={styles.winnerCard}>
//                   <View style={styles.winnerTop}>
//                     <View style={styles.crownMedal}>
//                       <MaterialCommunityIcons name="crown" size={34} color="#FFFFFF" />
//                     </View>

//                     <View style={styles.flex}>
//                       <View style={styles.winnerLabelRow}>
//                         <MaterialCommunityIcons name="crown" size={16} color={T.gold} />
//                         <Text style={styles.winnerLabel}>Winner</Text>
//                       </View>

//                       <View style={styles.winnerPlayer}>
//                         <View
//                           style={[
//                             styles.winnerAvatar,
//                             { backgroundColor: winner.avatarColor || AVATAR_COLORS[0] },
//                           ]}
//                         >
//                           <Ionicons name="person" size={24} color="#FFFFFF" />
//                         </View>

//                         <View style={styles.flex}>
//                           <Text style={styles.winnerName} numberOfLines={1}>
//                             {winner.name}
//                           </Text>
//                           <View style={styles.placePill}>
//                             <RankStars rank={winner.rank} size={14} />
//                           </View>
//                         </View>
//                       </View>
//                     </View>
//                   </View>

//                   <View style={styles.winnerStats}>
//                     <View style={styles.winnerStat}>
//                       <View style={styles.statLabelRow}>
//                         <Ionicons name="book" size={14} color={T.tealDark} />
//                         <Text style={styles.statLabel}>Words Found</Text>
//                       </View>
//                       <Text style={styles.statValue}>{winner.wordsFound}</Text>
//                     </View>

//                     <View style={styles.statDivider} />

//                     <View style={styles.winnerStat}>
//                       <View style={styles.statLabelRow}>
//                         <Coin size={16} />
//                         <Text style={styles.statLabel}>Coins Earned</Text>
//                       </View>
//                       <Text style={[styles.statValue, { color: T.goldDark }]}>
//                         {winner.coinsEarned}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               ) : players.length > 0 ? (
//                 <View style={styles.noWinner}>
//                   <MaterialCommunityIcons name="crown-outline" size={22} color={T.inkFaint} />
//                   <Text style={styles.noWinnerText}>
//                     No winner yet. Find words to take the lead!
//                   </Text>
//                 </View>
//               ) : null}

//               {/* ---------- table ---------- */}
//               <View style={styles.tableCard}>
//                 <View style={styles.tableHead}>
//                   <Text style={[styles.headText, styles.colRank]}>Rank</Text>
//                   <Text style={[styles.headText, styles.colPlayer]}>Player</Text>

//                   <View style={[styles.colWords, styles.headCell]}>
//                     <Ionicons name="book" size={13} color={T.tealDark} />
//                     <Text style={styles.headText}>Words</Text>
//                   </View>

//                   <View style={[styles.colCoins, styles.headCell]}>
//                     <Coin size={14} />
//                     <Text style={styles.headText}>Coins</Text>
//                   </View>
//                 </View>

//                 {players.length === 0 ? (
//                   <View style={styles.empty}>
//                     <Ionicons name="trophy-outline" size={30} color={T.inkFaint} />
//                     <Text style={styles.emptyText}>No players yet</Text>
//                   </View>
//                 ) : (
//                   players.map((p, index) => {
//                     const isMe = p.name === currentPlayerName;
//                     const avatar =
//                       p.avatarColor || AVATAR_COLORS[index % AVATAR_COLORS.length];

//                     return (
//                       <View
//                         key={`${p.rank}-${p.name}`}
//                         style={[
//                           styles.row,
//                           p.isWinner && styles.rowFirst,
//                           isMe && styles.rowMe,
//                         ]}
//                       >
//                         {/* rank as stars */}
//                         <View style={styles.colRank}>
//                           <RankStars rank={p.rank} size={12} />
//                         </View>

//                         <View style={[styles.colPlayer, styles.playerCell]}>
//                           <View style={[styles.avatar, { backgroundColor: avatar }]}>
//                             <Ionicons name="person" size={18} color="#FFFFFF" />
//                           </View>

//                           <View style={styles.flex}>
//                             <Text style={styles.name} numberOfLines={1}>
//                               {p.name}
//                             </Text>
//                             {isMe ? <Text style={styles.you}>That's you</Text> : null}
//                           </View>
//                         </View>

//                         <View style={[styles.colWords, styles.valueCell]}>
//                           <Ionicons name="book" size={15} color={T.tealDark} />
//                           <Text style={styles.wordsValue}>{p.wordsFound}</Text>
//                         </View>

//                         <View style={[styles.colCoins, styles.valueCell]}>
//                           <Coin size={18} />
//                           <Text style={styles.coinsValue}>{p.coinsEarned}</Text>
//                         </View>
//                       </View>
//                     );
//                   })
//                 )}
//               </View>

//               <View style={{ height: 24 }} />
//             </>
//           )}
//         </ScrollView>
//       </SafeAreaView>
//     </View>
//   );
// };

// export default LeaderboardScreen;

// /* =========================================================
//    STYLES
// ========================================================= */

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: T.bg },
//   flex: { flex: 1, minWidth: 0 },

//   ring: {
//     position: "absolute",
//     borderWidth: 2,
//     borderColor: T.teal,
//     borderRadius: 999,
//   },
//   ringTop: { width: 260, height: 260, top: -90, right: -90, opacity: 0.14 },
//   ringTop2: { width: 380, height: 380, top: -150, right: -150, opacity: 0.09 },

//   /* stars */
//   starRow: { flexDirection: "row", alignItems: "center", gap: 1 },
//   starMore: { fontSize: 12, fontWeight: "900", marginLeft: 2 },

//   /* header */
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingTop: 10,
//     paddingBottom: 12,
//     gap: 10,
//   },
//   backBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     backgroundColor: T.card,
//     borderWidth: 1.5,
//     borderColor: T.line,
//     borderBottomWidth: 4,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logo: {
//     width: 48,
//     height: 48,
//     borderRadius: 13,
//     backgroundColor: T.tile,
//     borderWidth: 2,
//     borderColor: T.tileEdge,
//     borderBottomWidth: 4,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//   },
//   logoW: { color: T.teal, fontSize: 20, fontWeight: "900" },
//   logoS: { color: T.coral, fontSize: 20, fontWeight: "900" },
//   brand: { color: T.ink, fontSize: 19, fontWeight: "900" },
//   brandSub: { color: T.inkSoft, fontSize: 11, marginTop: 2, fontWeight: "600" },

//   scroll: { paddingHorizontal: 16, paddingBottom: 20 },
//   center: { paddingVertical: 80, alignItems: "center" },

//   errorBanner: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 14,
//     backgroundColor: "#FFE8D6",
//     marginBottom: 12,
//   },
//   errorText: { color: "#DB6A1C", fontSize: 13, fontWeight: "700" },

//   /* winner card */
//   winnerCard: {
//     backgroundColor: T.goldPale,
//     borderRadius: 24,
//     borderWidth: 1.5,
//     borderColor: T.goldEdge,
//     padding: 16,
//     marginBottom: 16,
//   },
//   winnerTop: { flexDirection: "row", alignItems: "center", gap: 14 },
//   crownMedal: {
//     width: 76,
//     height: 76,
//     borderRadius: 38,
//     backgroundColor: T.gold,
//     borderWidth: 4,
//     borderColor: "#FFD36B",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   winnerLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
//   winnerLabel: { color: T.gold, fontSize: 15, fontWeight: "900" },
//   winnerPlayer: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
//   winnerAvatar: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   winnerName: { color: T.ink, fontSize: 22, fontWeight: "900" },
//   placePill: {
//     alignSelf: "flex-start",
//     backgroundColor: "#FBE3A2",
//     borderRadius: 999,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     marginTop: 4,
//   },

//   winnerStats: {
//     flexDirection: "row",
//     marginTop: 14,
//     backgroundColor: "rgba(255,255,255,0.65)",
//     borderRadius: 16,
//     paddingVertical: 12,
//   },
//   winnerStat: { flex: 1, alignItems: "center" },
//   statLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
//   statLabel: { color: T.inkSoft, fontSize: 12, fontWeight: "700" },
//   statValue: { color: T.ink, fontSize: 26, fontWeight: "900", marginTop: 4 },
//   statDivider: { width: 1, backgroundColor: T.goldEdge, marginVertical: 4 },

//   noWinner: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     backgroundColor: "rgba(255,255,255,0.7)",
//     borderRadius: 18,
//     borderWidth: 1.5,
//     borderColor: T.line,
//     padding: 14,
//     marginBottom: 16,
//   },
//   noWinnerText: { color: T.inkSoft, fontSize: 13, fontWeight: "700", flex: 1 },

//   /* table */
//   tableCard: {
//     backgroundColor: "rgba(255,255,255,0.7)",
//     borderRadius: 24,
//     borderWidth: 1.5,
//     borderColor: T.line,
//     padding: 10,
//   },
//   tableHead: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: T.tealPale,
//     borderRadius: 14,
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     marginBottom: 8,
//   },
//   headText: { color: T.tealDark, fontSize: 12.5, fontWeight: "800" },
//   headCell: { flexDirection: "row", alignItems: "center", gap: 5 },

//   colRank: { width: 64, justifyContent: "center" },
//   colPlayer: { flex: 1, minWidth: 0 },
//   colWords: { width: 70, justifyContent: "center" },
//   colCoins: { width: 70, justifyContent: "center" },

//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: T.card,
//     borderRadius: 16,
//     borderWidth: 1.5,
//     borderColor: "#E7F1EC",
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     marginBottom: 8,
//   },
//   rowFirst: { backgroundColor: "#F2FBF7" },
//   rowMe: { borderColor: T.teal, backgroundColor: "#EAF8F2" },

//   playerCell: { flexDirection: "row", alignItems: "center", gap: 10 },
//   avatar: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   name: { color: T.ink, fontSize: 15, fontWeight: "800" },
//   you: { color: T.inkSoft, fontSize: 11, marginTop: 1 },

//   valueCell: { flexDirection: "row", alignItems: "center", gap: 6 },
//   wordsValue: { color: T.tealDark, fontSize: 16, fontWeight: "900" },
//   coinsValue: { color: "#C97A12", fontSize: 16, fontWeight: "900" },

//   empty: { alignItems: "center", paddingVertical: 40, gap: 8 },
//   emptyText: { color: T.inkSoft, fontSize: 13, fontWeight: "600" },
// });
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { fetchScorecard, ScorecardEntry } from "../api/Wordscrambleapi";

interface LeaderboardScreenProps {
  currentPlayerName: string;
  onBack: () => void;
}

/* how often the board refreshes itself (live update) */
const REFRESH_MS = 3000;

const T = {
  bg: "#EAF8F2",
  ink: "#0F3D3E",
  inkSoft: "#4F7476",
  inkFaint: "#8FB0AE",
  teal: "#14A38B",
  tealDark: "#0C7F6B",
  tealPale: "#D2F2E8",
  line: "#CBE8DE",
  card: "#FFFFFF",
  gold: "#F5A623",
  goldDark: "#B8741A",
  goldPale: "#FFF4D6",
  goldEdge: "#F6E2A8",
  tile: "#FFF6DF",
  tileEdge: "#E2CD9C",
  coral: "#FF8A3D",
};

const AVATAR_COLORS = [
  "#14A38B",
  "#FF8A3D",
  "#A78BFA",
  "#6FCFB0",
  "#4FA3E0",
  "#F4879F",
  "#9B7FE8",
];

/* star colour per place */
const STAR_COLOR: Record<number, string> = {
  1: "#F5A623", // gold
  2: "#A9B8C6", // silver
  3: "#D9814A", // bronze
};

/**
 * Rank shown as stars:
 *   1st place = 1 star, 2nd place = 2 stars, 3rd place = 3 stars ...
 * Above 5 stars it shows one star + "x N" so the row never overflows.
 */
const RankStars: React.FC<{ rank: number; size?: number }> = ({
  rank,
  size = 12,
}) => {
  const color = STAR_COLOR[rank] || T.teal;

  if (rank > 5) {
    return (
      <View style={styles.starRow}>
        <Ionicons name="star" size={size} color={color} />
        <Text style={[styles.starMore, { color }]}>x{rank}</Text>
      </View>
    );
  }

  return (
    <View style={styles.starRow}>
      {Array.from({ length: Math.max(rank, 1) }).map((_, i) => (
        <Ionicons key={i} name="star" size={size} color={color} />
      ))}
    </View>
  );
};

const Coin: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: T.gold,
      borderWidth: 2,
      borderColor: "#FFD36B",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Text style={{ color: "#FFFFFF", fontSize: size * 0.55, fontWeight: "900" }}>$</Text>
  </View>
);

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  currentPlayerName,
  onBack,
}) => {
  const [players, setPlayers] = useState<ScorecardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const inFlight = useRef(false);

  const load = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;

    try {
      // frontend request -> backend reads the DB -> JSON response
      // backend already returns players ranked by WORDS FOUND (most first)
      const data = await fetchScorecard();
      setPlayers(data);
      setError(false);
    } catch (err) {
      console.warn("Scorecard failed:", err);
      setError(true);
    } finally {
      inFlight.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // first load + live auto refresh
  useEffect(() => {
    load();

    const id = setInterval(load, REFRESH_MS);

    return () => clearInterval(id);
  }, [load]);

  // Winner = rank 1 with at least one word found (decided by the backend)
  const winner = players.find((p) => p.isWinner) ?? null;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      {/* soft background rings */}
      <View pointerEvents="none" style={[styles.ring, styles.ringTop]} />
      <View pointerEvents="none" style={[styles.ring, styles.ringTop2]} />

      <SafeAreaView style={styles.flex}>
        {/* ---------- header ---------- */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={22} color={T.ink} />
          </TouchableOpacity>

          <View style={styles.logo}>
            <Text style={styles.logoW}>W</Text>
            <Text style={styles.logoS}>S</Text>
          </View>

          <View style={styles.flex}>
            <Text style={styles.brand}>Word Scramble</Text>
            <Text style={styles.brandSub}>Think fast. Play smart.</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              tintColor={T.teal}
              colors={[T.teal]}
            />
          }
        >
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={T.teal} />
            </View>
          ) : (
            <>
              {error ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="cloud-offline-outline" size={16} color={T.coral} />
                  <Text style={styles.errorText}>Can't reach the server. Retrying…</Text>
                </View>
              ) : null}

              {/* ---------- winner card ---------- */}
              {winner ? (
                <View style={styles.winnerCard}>
                  <View style={styles.winnerTop}>
                    <View style={styles.crownMedal}>
                      <MaterialCommunityIcons name="crown" size={34} color="#FFFFFF" />
                    </View>

                    <View style={styles.flex}>
                      <View style={styles.winnerLabelRow}>
                        <MaterialCommunityIcons name="crown" size={16} color={T.gold} />
                        <Text style={styles.winnerLabel}>Winner</Text>
                      </View>

                      <View style={styles.winnerPlayer}>
                        <View
                          style={[
                            styles.winnerAvatar,
                            { backgroundColor: winner.avatarColor || AVATAR_COLORS[0] },
                          ]}
                        >
                          <Ionicons name="person" size={24} color="#FFFFFF" />
                        </View>

                        <View style={styles.flex}>
                          <Text style={styles.winnerName} numberOfLines={1}>
                            {winner.name}
                          </Text>

                          {/* rank stars + trophy cup beside them */}
                          <View style={styles.placePill}>
                            <RankStars rank={winner.rank} size={14} />
                            <MaterialCommunityIcons
                              name="trophy"
                              size={18}
                              color={T.gold}
                              style={styles.placeCup}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.winnerStats}>
                    <View style={styles.winnerStat}>
                      <View style={styles.statLabelRow}>
                        <Ionicons name="book" size={14} color={T.tealDark} />
                        <Text style={styles.statLabel}>Words Found</Text>
                      </View>
                      <Text style={styles.statValue}>{winner.wordsFound}</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.winnerStat}>
                      <View style={styles.statLabelRow}>
                        <Coin size={16} />
                        <Text style={styles.statLabel}>Coins Earned</Text>
                      </View>
                      <Text style={[styles.statValue, { color: T.goldDark }]}>
                        {winner.coinsEarned}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : players.length > 0 ? (
                <View style={styles.noWinner}>
                  <MaterialCommunityIcons name="crown-outline" size={22} color={T.inkFaint} />
                  <Text style={styles.noWinnerText}>
                    No winner yet. Find words to take the lead!
                  </Text>
                </View>
              ) : null}

              {/* ---------- table: Player | Words | Coins | Rank ---------- */}
              <View style={styles.tableCard}>
                <View style={styles.tableHead}>
                  <Text style={[styles.headText, styles.colPlayer]}>Player</Text>

                  <View style={[styles.colWords, styles.headCell]}>
                    <Ionicons name="book" size={13} color={T.tealDark} />
                    <Text style={styles.headText}>Words</Text>
                  </View>

                  <View style={[styles.colCoins, styles.headCell]}>
                    <Coin size={14} />
                    <Text style={styles.headText}>Coins</Text>
                  </View>

                  <Text style={[styles.headText, styles.colRank, styles.rankHeadText]}>
                    Rank
                  </Text>
                </View>

                {players.length === 0 ? (
                  <View style={styles.empty}>
                    <Ionicons name="trophy-outline" size={30} color={T.inkFaint} />
                    <Text style={styles.emptyText}>No players yet</Text>
                  </View>
                ) : (
                  players.map((p, index) => {
                    const isMe = p.name === currentPlayerName;
                    const avatar =
                      p.avatarColor || AVATAR_COLORS[index % AVATAR_COLORS.length];

                    return (
                      <View
                        key={`${p.rank}-${p.name}`}
                        style={[
                          styles.row,
                          p.isWinner && styles.rowFirst,
                          isMe && styles.rowMe,
                        ]}
                      >
                        <View style={[styles.colPlayer, styles.playerCell]}>
                          <View style={[styles.avatar, { backgroundColor: avatar }]}>
                            <Ionicons name="person" size={18} color="#FFFFFF" />
                          </View>

                          <View style={styles.flex}>
                            <Text style={styles.name} numberOfLines={1}>
                              {p.name}
                            </Text>
                            {isMe ? <Text style={styles.you}>That's you</Text> : null}
                          </View>
                        </View>

                        <View style={[styles.colWords, styles.valueCell]}>
                          <Ionicons name="book" size={15} color={T.tealDark} />
                          <Text style={styles.wordsValue}>{p.wordsFound}</Text>
                        </View>

                        <View style={[styles.colCoins, styles.valueCell]}>
                          <Coin size={18} />
                          <Text style={styles.coinsValue}>{p.coinsEarned}</Text>
                        </View>

                        {/* rank as stars, now on the right side after Coins */}
                        <View style={[styles.colRank, styles.rankCell]}>
                          <RankStars rank={p.rank} size={12} />
                        </View>
                      </View>
                    );
                  })
                )}
              </View>

              <View style={{ height: 24 }} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default LeaderboardScreen;

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  flex: { flex: 1, minWidth: 0 },

  ring: {
    position: "absolute",
    borderWidth: 2,
    borderColor: T.teal,
    borderRadius: 999,
  },
  ringTop: { width: 260, height: 260, top: -90, right: -90, opacity: 0.14 },
  ringTop2: { width: 380, height: 380, top: -150, right: -150, opacity: 0.09 },

  /* stars */
  starRow: { flexDirection: "row", alignItems: "center", gap: 1 },
  starMore: { fontSize: 12, fontWeight: "900", marginLeft: 2 },

  /* header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: T.card,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: T.tile,
    borderWidth: 2,
    borderColor: T.tileEdge,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  logoW: { color: T.teal, fontSize: 20, fontWeight: "900" },
  logoS: { color: T.coral, fontSize: 20, fontWeight: "900" },
  brand: { color: T.ink, fontSize: 19, fontWeight: "900" },
  brandSub: { color: T.inkSoft, fontSize: 11, marginTop: 2, fontWeight: "600" },

  scroll: { paddingHorizontal: 16, paddingBottom: 20 },
  center: { paddingVertical: 80, alignItems: "center" },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#FFE8D6",
    marginBottom: 12,
  },
  errorText: { color: "#DB6A1C", fontSize: 13, fontWeight: "700" },

  /* winner card */
  winnerCard: {
    backgroundColor: T.goldPale,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: T.goldEdge,
    padding: 16,
    marginBottom: 16,
  },
  winnerTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  crownMedal: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: T.gold,
    borderWidth: 4,
    borderColor: "#FFD36B",
    alignItems: "center",
    justifyContent: "center",
  },
  winnerLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  winnerLabel: { color: T.gold, fontSize: 15, fontWeight: "900" },
  winnerPlayer: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  winnerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  winnerName: { color: T.ink, fontSize: 22, fontWeight: "900" },
  /* stars + trophy sit side by side in this pill */
  placePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBE3A2",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  placeCup: { marginLeft: 8 },

  winnerStats: {
    flexDirection: "row",
    marginTop: 14,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 16,
    paddingVertical: 12,
  },
  winnerStat: { flex: 1, alignItems: "center" },
  statLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statLabel: { color: T.inkSoft, fontSize: 12, fontWeight: "700" },
  statValue: { color: T.ink, fontSize: 26, fontWeight: "900", marginTop: 4 },
  statDivider: { width: 1, backgroundColor: T.goldEdge, marginVertical: 4 },

  noWinner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: T.line,
    padding: 14,
    marginBottom: 16,
  },
  noWinnerText: { color: T.inkSoft, fontSize: 13, fontWeight: "700", flex: 1 },

  /* table */
  tableCard: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: T.line,
    padding: 10,
  },
  tableHead: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.tealPale,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  headText: { color: T.tealDark, fontSize: 12.5, fontWeight: "800" },
  headCell: { flexDirection: "row", alignItems: "center", gap: 4 },
  rankHeadText: { textAlign: "right" },

  /* column order: Player | Words | Coins | Rank */
  colPlayer: { flex: 1, minWidth: 0 },
  colWords: { width: 60, justifyContent: "center" },
  colCoins: { width: 60, justifyContent: "center" },
  colRank: { width: 56, justifyContent: "center" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E7F1EC",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  rowFirst: { backgroundColor: "#F2FBF7" },
  rowMe: { borderColor: T.teal, backgroundColor: "#EAF8F2" },

  playerCell: { flexDirection: "row", alignItems: "center", gap: 8 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { color: T.ink, fontSize: 14, fontWeight: "800" },
  you: { color: T.inkSoft, fontSize: 11, marginTop: 1 },

  valueCell: { flexDirection: "row", alignItems: "center", gap: 4 },
  rankCell: { alignItems: "flex-end" },
  wordsValue: { color: T.tealDark, fontSize: 15, fontWeight: "900" },
  coinsValue: { color: "#C97A12", fontSize: 15, fontWeight: "900" },

  empty: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyText: { color: T.inkSoft, fontSize: 13, fontWeight: "600" },
});
