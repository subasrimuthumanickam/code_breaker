// // // // // // // // // // // // // import React from "react";
// // // // // // // // // // // // // import {
// // // // // // // // // // // // //   View,
// // // // // // // // // // // // //   Text,
// // // // // // // // // // // // //   StyleSheet,
// // // // // // // // // // // // //   TouchableOpacity,
// // // // // // // // // // // // //   TextInput,
// // // // // // // // // // // // //   ScrollView,
// // // // // // // // // // // // //   SafeAreaView,
// // // // // // // // // // // // //   StatusBar,
// // // // // // // // // // // // // } from "react-native";
// // // // // // // // // // // // // import { LinearGradient } from "expo-linear-gradient";
// // // // // // // // // // // // // import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// // // // // // // // // // // // // export interface TopPlayer {
// // // // // // // // // // // // //   rank: number;
// // // // // // // // // // // // //   name: string;
// // // // // // // // // // // // //   score: number;
// // // // // // // // // // // // //   avatarColor: string;
// // // // // // // // // // // // // }

// // // // // // // // // // // // // interface WordScrambleHomeScreenProps {
// // // // // // // // // // // // //   topPlayers: TopPlayer[];
// // // // // // // // // // // // //   onPlayOnline: () => void;
// // // // // // // // // // // // //   onCreateRoom: () => void;
// // // // // // // // // // // // //   onJoinRoom: (code: string) => void;
// // // // // // // // // // // // //   onViewAllPlayers: () => void;
// // // // // // // // // // // // //   onTabHome: () => void;
// // // // // // // // // // // // //   onTabLeaderboard: () => void;
// // // // // // // // // // // // //   onTabProfile: () => void;
// // // // // // // // // // // // // }

// // // // // // // // // // // // // const WordScrambleHomeScreen: React.FC<WordScrambleHomeScreenProps> = ({
// // // // // // // // // // // // //   topPlayers,
// // // // // // // // // // // // //   onPlayOnline,
// // // // // // // // // // // // //   onCreateRoom,
// // // // // // // // // // // // //   onJoinRoom,
// // // // // // // // // // // // //   onViewAllPlayers,
// // // // // // // // // // // // //   onTabHome,
// // // // // // // // // // // // //   onTabLeaderboard,
// // // // // // // // // // // // //   onTabProfile,
// // // // // // // // // // // // // }) => {
// // // // // // // // // // // // //   const [joinCode, setJoinCode] = React.useState("");

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <LinearGradient colors={["#0B1020", "#141B36", "#0B1020"]} style={styles.flex}>
// // // // // // // // // // // // //       <SafeAreaView style={styles.flex}>
// // // // // // // // // // // // //         <StatusBar barStyle="light-content" backgroundColor="#0B1020" />

// // // // // // // // // // // // //         <ScrollView
// // // // // // // // // // // // //           contentContainerStyle={styles.scroll}
// // // // // // // // // // // // //           showsVerticalScrollIndicator={false}
// // // // // // // // // // // // //         >
// // // // // // // // // // // // //           {/* Logo row */}
// // // // // // // // // // // // //           <View style={styles.logoRow}>
// // // // // // // // // // // // //             <View style={[styles.tileIcon, { backgroundColor: "#3B82F6" }]}>
// // // // // // // // // // // // //               <Text style={styles.tileIconText}>W</Text>
// // // // // // // // // // // // //             </View>
// // // // // // // // // // // // //             <View style={[styles.tileIcon, { backgroundColor: "#F5C518" }]}>
// // // // // // // // // // // // //               <Ionicons name="ribbon" size={20} color="#3A2F0F" />
// // // // // // // // // // // // //             </View>
// // // // // // // // // // // // //             <View style={[styles.tileIcon, { backgroundColor: "#7C6CF5" }]}>
// // // // // // // // // // // // //               <Text style={styles.tileIconText}>A</Text>
// // // // // // // // // // // // //             </View>
// // // // // // // // // // // // //             <View style={[styles.tileIcon, { backgroundColor: "#F97066" }]}>
// // // // // // // // // // // // //               <Text style={styles.tileIconText}>R</Text>
// // // // // // // // // // // // //             </View>
// // // // // // // // // // // // //             <View style={[styles.tileIcon, { backgroundColor: "#2BC98A" }]}>
// // // // // // // // // // // // //               <Text style={styles.tileIconText}>D</Text>
// // // // // // // // // // // // //             </View>
// // // // // // // // // // // // //           </View>

// // // // // // // // // // // // //           <Text style={styles.title}>WORD SCRAMBLE</Text>
// // // // // // // // // // // // //           <Text style={styles.subtitle}>Multiplayer Word Game</Text>
// // // // // // // // // // // // //           <Text style={styles.blurb}>
// // // // // // // // // // // // //             Unscramble words • Beat your friends{"\n"}Climb the leaderboard
// // // // // // // // // // // // //           </Text>

// // // // // // // // // // // // //           {/* Play Online */}
// // // // // // // // // // // // //           <TouchableOpacity activeOpacity={0.88} onPress={onPlayOnline}>
// // // // // // // // // // // // //             <LinearGradient
// // // // // // // // // // // // //               colors={["#F5C518", "#F0A93D"]}
// // // // // // // // // // // // //               start={{ x: 0, y: 0 }}
// // // // // // // // // // // // //               end={{ x: 1, y: 0 }}
// // // // // // // // // // // // //               style={styles.playOnlineButton}
// // // // // // // // // // // // //             >
// // // // // // // // // // // // //               <Ionicons name="people" size={18} color="#241A00" />
// // // // // // // // // // // // //               <Text style={styles.playOnlineText}>Play Online</Text>
// // // // // // // // // // // // //             </LinearGradient>
// // // // // // // // // // // // //           </TouchableOpacity>

// // // // // // // // // // // // //           {/* Create / Join */}
// // // // // // // // // // // // //           <View style={styles.rowButtons}>
// // // // // // // // // // // // //             <TouchableOpacity
// // // // // // // // // // // // //               style={[styles.halfButton, styles.createButton]}
// // // // // // // // // // // // //               activeOpacity={0.85}
// // // // // // // // // // // // //               onPress={onCreateRoom}
// // // // // // // // // // // // //             >
// // // // // // // // // // // // //               <Ionicons name="add" size={18} color="#FFFFFF" />
// // // // // // // // // // // // //               <Text style={styles.halfButtonText}>Create Room</Text>
// // // // // // // // // // // // //             </TouchableOpacity>

// // // // // // // // // // // // //             <TouchableOpacity
// // // // // // // // // // // // //               style={[styles.halfButton, styles.joinButton]}
// // // // // // // // // // // // //               activeOpacity={0.85}
// // // // // // // // // // // // //               onPress={() => onJoinRoom(joinCode)}
// // // // // // // // // // // // //             >
// // // // // // // // // // // // //               <Ionicons name="search" size={16} color="#FFFFFF" />
// // // // // // // // // // // // //               <Text style={styles.halfButtonText}>Join Room</Text>
// // // // // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // // // // //           </View>

// // // // // // // // // // // // //           {/* Top Players card */}
// // // // // // // // // // // // //           <View style={styles.topPlayersCard}>
// // // // // // // // // // // // //             <View style={styles.topPlayersHeader}>
// // // // // // // // // // // // //               <Text style={styles.topPlayersTitle}>Top Players</Text>
// // // // // // // // // // // // //               <TouchableOpacity onPress={onViewAllPlayers}>
// // // // // // // // // // // // //                 <Text style={styles.viewAll}>View All ›</Text>
// // // // // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // // // // //             </View>

// // // // // // // // // // // // //             {topPlayers.map((p) => (
// // // // // // // // // // // // //               <View key={p.rank} style={styles.playerRow}>
// // // // // // // // // // // // //                 <Text style={styles.rankEmoji}>
// // // // // // // // // // // // //                   {p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : "🥉"}
// // // // // // // // // // // // //                 </Text>
// // // // // // // // // // // // //                 <View style={[styles.avatar, { backgroundColor: p.avatarColor }]}>
// // // // // // // // // // // // //                   <Ionicons name="person" size={16} color="#FFFFFF" />
// // // // // // // // // // // // //                 </View>
// // // // // // // // // // // // //                 <Text style={styles.playerName}>{p.name}</Text>
// // // // // // // // // // // // //                 <Text style={styles.playerScore}>{p.score}</Text>
// // // // // // // // // // // // //               </View>
// // // // // // // // // // // // //             ))}
// // // // // // // // // // // // //           </View>
// // // // // // // // // // // // //         </ScrollView>

// // // // // // // // // // // // //         {/* Bottom tabs */}
// // // // // // // // // // // // //         <View style={styles.tabBar}>
// // // // // // // // // // // // //           <TouchableOpacity style={styles.tabItem} onPress={onTabHome}>
// // // // // // // // // // // // //             <Ionicons name="home" size={20} color="#4D9DFF" />
// // // // // // // // // // // // //             <Text style={[styles.tabLabel, styles.tabLabelActive]}>Home</Text>
// // // // // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // // // // //           <TouchableOpacity style={styles.tabItem} onPress={onTabLeaderboard}>
// // // // // // // // // // // // //             <MaterialCommunityIcons name="trophy-outline" size={20} color="#5A6478" />
// // // // // // // // // // // // //             <Text style={styles.tabLabel}>Leaderboard</Text>
// // // // // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // // // // //           <TouchableOpacity style={styles.tabItem} onPress={onTabProfile}>
// // // // // // // // // // // // //             <Ionicons name="person-outline" size={20} color="#5A6478" />
// // // // // // // // // // // // //             <Text style={styles.tabLabel}>Profile</Text>
// // // // // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // // // // //         </View>
// // // // // // // // // // // // //       </SafeAreaView>
// // // // // // // // // // // // //     </LinearGradient>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // };

// // // // // // // // // // // // // export default WordScrambleHomeScreen;

// // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // //   flex: { flex: 1 },
// // // // // // // // // // // // //   scroll: {
// // // // // // // // // // // // //     paddingHorizontal: 22,
// // // // // // // // // // // // //     paddingTop: 24,
// // // // // // // // // // // // //     paddingBottom: 20,
// // // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   logoRow: {
// // // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // // //     gap: 8,
// // // // // // // // // // // // //     marginBottom: 14,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   tileIcon: {
// // // // // // // // // // // // //     width: 34,
// // // // // // // // // // // // //     height: 34,
// // // // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   tileIconText: {
// // // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   title: {
// // // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // // //     fontSize: 26,
// // // // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // // // //     letterSpacing: 1,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   subtitle: {
// // // // // // // // // // // // //     color: "#9AA5C0",
// // // // // // // // // // // // //     fontSize: 13,
// // // // // // // // // // // // //     marginTop: 6,
// // // // // // // // // // // // //     fontWeight: "600",
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   blurb: {
// // // // // // // // // // // // //     color: "#6E7A90",
// // // // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // // // //     textAlign: "center",
// // // // // // // // // // // // //     marginTop: 10,
// // // // // // // // // // // // //     lineHeight: 18,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   playOnlineButton: {
// // // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // // //     gap: 8,
// // // // // // // // // // // // //     width: 280,
// // // // // // // // // // // // //     height: 52,
// // // // // // // // // // // // //     borderRadius: 14,
// // // // // // // // // // // // //     marginTop: 26,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   playOnlineText: {
// // // // // // // // // // // // //     color: "#241A00",
// // // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // // //     fontSize: 15,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   rowButtons: {
// // // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // // //     gap: 12,
// // // // // // // // // // // // //     marginTop: 14,
// // // // // // // // // // // // //     width: 280,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   halfButton: {
// // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // // //     gap: 6,
// // // // // // // // // // // // //     height: 46,
// // // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   createButton: {
// // // // // // // // // // // // //     backgroundColor: "#5B3FD6",
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   joinButton: {
// // // // // // // // // // // // //     backgroundColor: "#2C63E0",
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   halfButtonText: {
// // // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // // //     fontWeight: "700",
// // // // // // // // // // // // //     fontSize: 12.5,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   topPlayersCard: {
// // // // // // // // // // // // //     width: "100%",
// // // // // // // // // // // // //     backgroundColor: "#111834",
// // // // // // // // // // // // //     borderRadius: 16,
// // // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // // //     marginTop: 28,
// // // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // // //     borderColor: "#1E2A4D",
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   topPlayersHeader: {
// // // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   topPlayersTitle: {
// // // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   viewAll: {
// // // // // // // // // // // // //     color: "#7C93FF",
// // // // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // // // //     fontWeight: "600",
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   playerRow: {
// // // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // // //     gap: 10,
// // // // // // // // // // // // //     paddingVertical: 8,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   rankEmoji: {
// // // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // // //     width: 22,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   avatar: {
// // // // // // // // // // // // //     width: 28,
// // // // // // // // // // // // //     height: 28,
// // // // // // // // // // // // //     borderRadius: 14,
// // // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   playerName: {
// // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // //     color: "#E2E8F5",
// // // // // // // // // // // // //     fontSize: 13.5,
// // // // // // // // // // // // //     fontWeight: "600",
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   playerScore: {
// // // // // // // // // // // // //     color: "#F5C518",
// // // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // // //     fontSize: 13.5,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   tabBar: {
// // // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // // // // //     borderTopColor: "#131C30",
// // // // // // // // // // // // //     backgroundColor: "#0B1020",
// // // // // // // // // // // // //     paddingVertical: 10,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   tabItem: {
// // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // // //     gap: 4,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   tabLabel: {
// // // // // // // // // // // // //     fontSize: 10.5,
// // // // // // // // // // // // //     color: "#5A6478",
// // // // // // // // // // // // //     fontWeight: "600",
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   tabLabelActive: {
// // // // // // // // // // // // //     color: "#4D9DFF",
// // // // // // // // // // // // //   },
// // // // // // // // // // // // // });
// // // // // // // // // // // // import React from "react";
// // // // // // // // // // // // import {
// // // // // // // // // // // //   View,
// // // // // // // // // // // //   Text,
// // // // // // // // // // // //   StyleSheet,
// // // // // // // // // // // //   TouchableOpacity,
// // // // // // // // // // // //   TextInput,
// // // // // // // // // // // //   ScrollView,
// // // // // // // // // // // //   SafeAreaView,
// // // // // // // // // // // //   StatusBar,
// // // // // // // // // // // //   useWindowDimensions,
// // // // // // // // // // // // } from "react-native";
// // // // // // // // // // // // import { LinearGradient } from "expo-linear-gradient";
// // // // // // // // // // // // import {
// // // // // // // // // // // //   Ionicons,
// // // // // // // // // // // //   MaterialCommunityIcons,
// // // // // // // // // // // // } from "@expo/vector-icons";

// // // // // // // // // // // // export interface TopPlayer {
// // // // // // // // // // // //   rank: number;
// // // // // // // // // // // //   name: string;
// // // // // // // // // // // //   score: number;
// // // // // // // // // // // //   avatarColor: string;
// // // // // // // // // // // // }

// // // // // // // // // // // // interface WordScrambleHomeScreenProps {
// // // // // // // // // // // //   topPlayers: TopPlayer[];
// // // // // // // // // // // //   onPlayOnline: () => void;
// // // // // // // // // // // //   onCreateRoom: () => void;
// // // // // // // // // // // //   onJoinRoom: (code: string) => void;
// // // // // // // // // // // //   onViewAllPlayers: () => void;
// // // // // // // // // // // //   onTabHome: () => void;
// // // // // // // // // // // //   onTabLeaderboard: () => void;
// // // // // // // // // // // //   onTabProfile: () => void;
// // // // // // // // // // // // }

// // // // // // // // // // // // const WordScrambleHomeScreen: React.FC<
// // // // // // // // // // // //   WordScrambleHomeScreenProps
// // // // // // // // // // // // > = ({
// // // // // // // // // // // //   topPlayers,
// // // // // // // // // // // //   onPlayOnline,
// // // // // // // // // // // //   onCreateRoom,
// // // // // // // // // // // //   onJoinRoom,
// // // // // // // // // // // //   onViewAllPlayers,
// // // // // // // // // // // //   onTabHome,
// // // // // // // // // // // //   onTabLeaderboard,
// // // // // // // // // // // //   onTabProfile,
// // // // // // // // // // // // }) => {
// // // // // // // // // // // //   const { width } = useWindowDimensions();

// // // // // // // // // // // //   const isDesktop = width >= 900;
// // // // // // // // // // // //   const isTablet = width >= 600 && width < 900;

// // // // // // // // // // // //   const [joinCode, setJoinCode] = React.useState("");

// // // // // // // // // // // //   const handleJoinRoom = () => {
// // // // // // // // // // // //     const code = joinCode.trim().toUpperCase();

// // // // // // // // // // // //     if (!code) {
// // // // // // // // // // // //       return;
// // // // // // // // // // // //     }

// // // // // // // // // // // //     onJoinRoom(code);
// // // // // // // // // // // //   };

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <LinearGradient
// // // // // // // // // // // //       colors={["#070B18", "#0D142A", "#080C1A"]}
// // // // // // // // // // // //       style={styles.flex}
// // // // // // // // // // // //     >
// // // // // // // // // // // //       <SafeAreaView style={styles.flex}>
// // // // // // // // // // // //         <StatusBar
// // // // // // // // // // // //           barStyle="light-content"
// // // // // // // // // // // //           backgroundColor="#070B18"
// // // // // // // // // // // //         />

// // // // // // // // // // // //         <View style={styles.appContainer}>

// // // // // // // // // // // //           {/* ================================================= */}
// // // // // // // // // // // //           {/* DESKTOP SIDEBAR */}
// // // // // // // // // // // //           {/* ================================================= */}

// // // // // // // // // // // //           {isDesktop && (
// // // // // // // // // // // //             <View style={styles.sidebar}>

// // // // // // // // // // // //               <View style={styles.brandArea}>
// // // // // // // // // // // //                 <View style={styles.brandLogo}>
// // // // // // // // // // // //                   <MaterialCommunityIcons
// // // // // // // // // // // //                     name="alphabetical-variant"
// // // // // // // // // // // //                     size={28}
// // // // // // // // // // // //                     color="#FFFFFF"
// // // // // // // // // // // //                   />
// // // // // // // // // // // //                 </View>

// // // // // // // // // // // //                 <View>
// // // // // // // // // // // //                   <Text style={styles.brandTitle}>
// // // // // // // // // // // //                     Word<Text style={styles.brandPurple}>Scramble</Text>
// // // // // // // // // // // //                   </Text>

// // // // // // // // // // // //                   <Text style={styles.brandSubtitle}>
// // // // // // // // // // // //                     Think · Unscramble · Win
// // // // // // // // // // // //                   </Text>
// // // // // // // // // // // //                 </View>
// // // // // // // // // // // //               </View>

// // // // // // // // // // // //               <View style={styles.sidebarMenu}>

// // // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // // //                   style={[
// // // // // // // // // // // //                     styles.sidebarItem,
// // // // // // // // // // // //                     styles.sidebarItemActive,
// // // // // // // // // // // //                   ]}
// // // // // // // // // // // //                   onPress={onTabHome}
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                   <Ionicons
// // // // // // // // // // // //                     name="home"
// // // // // // // // // // // //                     size={21}
// // // // // // // // // // // //                     color="#FFFFFF"
// // // // // // // // // // // //                   />

// // // // // // // // // // // //                   <Text style={styles.sidebarItemTextActive}>
// // // // // // // // // // // //                     Home
// // // // // // // // // // // //                   </Text>
// // // // // // // // // // // //                 </TouchableOpacity>

// // // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // // //                   style={styles.sidebarItem}
// // // // // // // // // // // //                   onPress={onTabLeaderboard}
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                   <MaterialCommunityIcons
// // // // // // // // // // // //                     name="trophy-outline"
// // // // // // // // // // // //                     size={22}
// // // // // // // // // // // //                     color="#8994AF"
// // // // // // // // // // // //                   />

// // // // // // // // // // // //                   <Text style={styles.sidebarItemText}>
// // // // // // // // // // // //                     Leaderboard
// // // // // // // // // // // //                   </Text>
// // // // // // // // // // // //                 </TouchableOpacity>

// // // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // // //                   style={styles.sidebarItem}
// // // // // // // // // // // //                   onPress={onTabProfile}
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                   <Ionicons
// // // // // // // // // // // //                     name="person-outline"
// // // // // // // // // // // //                     size={21}
// // // // // // // // // // // //                     color="#8994AF"
// // // // // // // // // // // //                   />

// // // // // // // // // // // //                   <Text style={styles.sidebarItemText}>
// // // // // // // // // // // //                     Profile
// // // // // // // // // // // //                   </Text>
// // // // // // // // // // // //                 </TouchableOpacity>

// // // // // // // // // // // //                 <TouchableOpacity style={styles.sidebarItem}>
// // // // // // // // // // // //                   <Ionicons
// // // // // // // // // // // //                     name="settings-outline"
// // // // // // // // // // // //                     size={21}
// // // // // // // // // // // //                     color="#8994AF"
// // // // // // // // // // // //                   />

// // // // // // // // // // // //                   <Text style={styles.sidebarItemText}>
// // // // // // // // // // // //                     Settings
// // // // // // // // // // // //                   </Text>
// // // // // // // // // // // //                 </TouchableOpacity>

// // // // // // // // // // // //               </View>

// // // // // // // // // // // //               <View style={styles.sidebarBottomCard}>
// // // // // // // // // // // //                 <View style={styles.smallIconCircle}>
// // // // // // // // // // // //                   <Ionicons
// // // // // // // // // // // //                     name="game-controller"
// // // // // // // // // // // //                     size={19}
// // // // // // // // // // // //                     color="#A78BFA"
// // // // // // // // // // // //                   />
// // // // // // // // // // // //                 </View>

// // // // // // // // // // // //                 <Text style={styles.sidebarBottomTitle}>
// // // // // // // // // // // //                   Ready to play?
// // // // // // // // // // // //                 </Text>

// // // // // // // // // // // //                 <Text style={styles.sidebarBottomText}>
// // // // // // // // // // // //                   Challenge friends and climb the leaderboard.
// // // // // // // // // // // //                 </Text>

// // // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // // //                   style={styles.sidebarPlayButton}
// // // // // // // // // // // //                   onPress={onPlayOnline}
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                   <Text style={styles.sidebarPlayText}>
// // // // // // // // // // // //                     Start Playing
// // // // // // // // // // // //                   </Text>

// // // // // // // // // // // //                   <Ionicons
// // // // // // // // // // // //                     name="arrow-forward"
// // // // // // // // // // // //                     size={16}
// // // // // // // // // // // //                     color="#FFFFFF"
// // // // // // // // // // // //                   />
// // // // // // // // // // // //                 </TouchableOpacity>
// // // // // // // // // // // //               </View>

// // // // // // // // // // // //             </View>
// // // // // // // // // // // //           )}

// // // // // // // // // // // //           {/* ================================================= */}
// // // // // // // // // // // //           {/* MAIN AREA */}
// // // // // // // // // // // //           {/* ================================================= */}

// // // // // // // // // // // //           <View style={styles.mainArea}>

// // // // // // // // // // // //             {/* ================================================= */}
// // // // // // // // // // // //             {/* TOP HEADER */}
// // // // // // // // // // // //             {/* ================================================= */}

// // // // // // // // // // // //             <View style={styles.topHeader}>

// // // // // // // // // // // //               {!isDesktop && (
// // // // // // // // // // // //                 <View style={styles.mobileBrand}>
// // // // // // // // // // // //                   <View style={styles.mobileLogo}>
// // // // // // // // // // // //                     <MaterialCommunityIcons
// // // // // // // // // // // //                       name="alphabetical-variant"
// // // // // // // // // // // //                       size={21}
// // // // // // // // // // // //                       color="#FFFFFF"
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                   </View>

// // // // // // // // // // // //                   <View>
// // // // // // // // // // // //                     <Text style={styles.mobileBrandTitle}>
// // // // // // // // // // // //                       Word
// // // // // // // // // // // //                       <Text style={styles.brandPurple}>
// // // // // // // // // // // //                         Scramble
// // // // // // // // // // // //                       </Text>
// // // // // // // // // // // //                     </Text>

// // // // // // // // // // // //                     <Text style={styles.mobileBrandSubtitle}>
// // // // // // // // // // // //                       Think · Unscramble · Win
// // // // // // // // // // // //                     </Text>
// // // // // // // // // // // //                   </View>
// // // // // // // // // // // //                 </View>
// // // // // // // // // // // //               )}

// // // // // // // // // // // //               {isDesktop && (
// // // // // // // // // // // //                 <View>
// // // // // // // // // // // //                   <Text style={styles.headerTitle}>
// // // // // // // // // // // //                     Home
// // // // // // // // // // // //                   </Text>

// // // // // // // // // // // //                   <Text style={styles.headerSubtitle}>
// // // // // // // // // // // //                     Welcome back! Ready for your next challenge?
// // // // // // // // // // // //                   </Text>
// // // // // // // // // // // //                 </View>
// // // // // // // // // // // //               )}

// // // // // // // // // // // //               <View style={styles.headerRight}>

// // // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // // //                   style={styles.notificationButton}
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                   <Ionicons
// // // // // // // // // // // //                     name="notifications-outline"
// // // // // // // // // // // //                     size={21}
// // // // // // // // // // // //                     color="#AEB8D0"
// // // // // // // // // // // //                   />

// // // // // // // // // // // //                   <View style={styles.notificationDot} />
// // // // // // // // // // // //                 </TouchableOpacity>

// // // // // // // // // // // //                 <TouchableOpacity style={styles.profileButton}>
// // // // // // // // // // // //                   <View style={styles.profileAvatar}>
// // // // // // // // // // // //                     <Ionicons
// // // // // // // // // // // //                       name="person"
// // // // // // // // // // // //                       size={17}
// // // // // // // // // // // //                       color="#FFFFFF"
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                   </View>

// // // // // // // // // // // //                   {isDesktop && (
// // // // // // // // // // // //                     <>
// // // // // // // // // // // //                       <Text style={styles.profileName}>
// // // // // // // // // // // //                         Player
// // // // // // // // // // // //                       </Text>

// // // // // // // // // // // //                       <Ionicons
// // // // // // // // // // // //                         name="chevron-down"
// // // // // // // // // // // //                         size={16}
// // // // // // // // // // // //                         color="#8E99B5"
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                     </>
// // // // // // // // // // // //                   )}
// // // // // // // // // // // //                 </TouchableOpacity>

// // // // // // // // // // // //               </View>
// // // // // // // // // // // //             </View>

// // // // // // // // // // // //             <ScrollView
// // // // // // // // // // // //               showsVerticalScrollIndicator={false}
// // // // // // // // // // // //               contentContainerStyle={[
// // // // // // // // // // // //                 styles.scrollContent,
// // // // // // // // // // // //                 isDesktop && styles.desktopScrollContent,
// // // // // // // // // // // //               ]}
// // // // // // // // // // // //             >

// // // // // // // // // // // //               {/* ================================================= */}
// // // // // // // // // // // //               {/* HERO */}
// // // // // // // // // // // //               {/* ================================================= */}

// // // // // // // // // // // //               <View
// // // // // // // // // // // //                 style={[
// // // // // // // // // // // //                   styles.heroCard,
// // // // // // // // // // // //                   !isDesktop && styles.heroCardMobile,
// // // // // // // // // // // //                 ]}
// // // // // // // // // // // //               >

// // // // // // // // // // // //                 <View style={styles.heroLeft}>

// // // // // // // // // // // //                   <View style={styles.heroBadge}>
// // // // // // // // // // // //                     <Ionicons
// // // // // // // // // // // //                       name="sparkles"
// // // // // // // // // // // //                       size={14}
// // // // // // // // // // // //                       color="#F8C94A"
// // // // // // // // // // // //                     />

// // // // // // // // // // // //                     <Text style={styles.heroBadgeText}>
// // // // // // // // // // // //                       MULTIPLAYER WORD GAME
// // // // // // // // // // // //                     </Text>
// // // // // // // // // // // //                   </View>

// // // // // // // // // // // //                   <Text style={styles.heroTitle}>
// // // // // // // // // // // //                     Unscramble.
// // // // // // // // // // // //                     {"\n"}
// // // // // // // // // // // //                     <Text style={styles.heroTitlePurple}>
// // // // // // // // // // // //                       Compete. Win.
// // // // // // // // // // // //                     </Text>
// // // // // // // // // // // //                   </Text>

// // // // // // // // // // // //                   <Text style={styles.heroDescription}>
// // // // // // // // // // // //                     Unscramble words, challenge your friends,
// // // // // // // // // // // //                     and climb the leaderboard.
// // // // // // // // // // // //                   </Text>

// // // // // // // // // // // //                   <TouchableOpacity
// // // // // // // // // // // //                     activeOpacity={0.88}
// // // // // // // // // // // //                     onPress={onPlayOnline}
// // // // // // // // // // // //                   >
// // // // // // // // // // // //                     <LinearGradient
// // // // // // // // // // // //                       colors={[
// // // // // // // // // // // //                         "#F8C52E",
// // // // // // // // // // // //                         "#F29E38",
// // // // // // // // // // // //                       ]}
// // // // // // // // // // // //                       start={{ x: 0, y: 0 }}
// // // // // // // // // // // //                       end={{ x: 1, y: 0 }}
// // // // // // // // // // // //                       style={styles.mainPlayButton}
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       <Ionicons
// // // // // // // // // // // //                         name="people"
// // // // // // // // // // // //                         size={19}
// // // // // // // // // // // //                         color="#211900"
// // // // // // // // // // // //                       />

// // // // // // // // // // // //                       <Text style={styles.mainPlayButtonText}>
// // // // // // // // // // // //                         Play Online
// // // // // // // // // // // //                       </Text>

// // // // // // // // // // // //                       <Ionicons
// // // // // // // // // // // //                         name="arrow-forward"
// // // // // // // // // // // //                         size={18}
// // // // // // // // // // // //                         color="#211900"
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                     </LinearGradient>
// // // // // // // // // // // //                   </TouchableOpacity>

// // // // // // // // // // // //                 </View>

// // // // // // // // // // // //                 {/* Decorative word tiles */}

// // // // // // // // // // // //                 {isDesktop && (
// // // // // // // // // // // //                   <View style={styles.heroGraphic}>

// // // // // // // // // // // //                     <View
// // // // // // // // // // // //                       style={[
// // // // // // // // // // // //                         styles.letterTile,
// // // // // // // // // // // //                         styles.tileBlue,
// // // // // // // // // // // //                         styles.tileOne,
// // // // // // // // // // // //                       ]}
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       <Text style={styles.letterText}>
// // // // // // // // // // // //                         W
// // // // // // // // // // // //                       </Text>
// // // // // // // // // // // //                     </View>

// // // // // // // // // // // //                     <View
// // // // // // // // // // // //                       style={[
// // // // // // // // // // // //                         styles.letterTile,
// // // // // // // // // // // //                         styles.tilePurple,
// // // // // // // // // // // //                         styles.tileTwo,
// // // // // // // // // // // //                       ]}
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       <Text style={styles.letterText}>
// // // // // // // // // // // //                         O
// // // // // // // // // // // //                       </Text>
// // // // // // // // // // // //                     </View>

// // // // // // // // // // // //                     <View
// // // // // // // // // // // //                       style={[
// // // // // // // // // // // //                         styles.letterTile,
// // // // // // // // // // // //                         styles.tileYellow,
// // // // // // // // // // // //                         styles.tileThree,
// // // // // // // // // // // //                       ]}
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       <Text style={styles.letterTextDark}>
// // // // // // // // // // // //                         R
// // // // // // // // // // // //                       </Text>
// // // // // // // // // // // //                     </View>

// // // // // // // // // // // //                     <View
// // // // // // // // // // // //                       style={[
// // // // // // // // // // // //                         styles.letterTile,
// // // // // // // // // // // //                         styles.tilePink,
// // // // // // // // // // // //                         styles.tileFour,
// // // // // // // // // // // //                       ]}
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       <Text style={styles.letterText}>
// // // // // // // // // // // //                         D
// // // // // // // // // // // //                       </Text>
// // // // // // // // // // // //                     </View>

// // // // // // // // // // // //                     <View style={styles.heroLock}>
// // // // // // // // // // // //                       <Ionicons
// // // // // // // // // // // //                         name="lock-closed"
// // // // // // // // // // // //                         size={34}
// // // // // // // // // // // //                         color="#FFFFFF"
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                     </View>

// // // // // // // // // // // //                   </View>
// // // // // // // // // // // //                 )}

// // // // // // // // // // // //               </View>

// // // // // // // // // // // //               {/* ================================================= */}
// // // // // // // // // // // //               {/* QUICK ACTIONS */}
// // // // // // // // // // // //               {/* ================================================= */}

// // // // // // // // // // // //               <View style={styles.sectionHeader}>
// // // // // // // // // // // //                 <View>
// // // // // // // // // // // //                   <Text style={styles.sectionTitle}>
// // // // // // // // // // // //                     Quick Play
// // // // // // // // // // // //                   </Text>

// // // // // // // // // // // //                   <Text style={styles.sectionSubtitle}>
// // // // // // // // // // // //                     Choose how you want to play
// // // // // // // // // // // //                   </Text>
// // // // // // // // // // // //                 </View>
// // // // // // // // // // // //               </View>

// // // // // // // // // // // //               <View
// // // // // // // // // // // //                 style={[
// // // // // // // // // // // //                   styles.actionGrid,
// // // // // // // // // // // //                   !isDesktop && styles.actionGridMobile,
// // // // // // // // // // // //                 ]}
// // // // // // // // // // // //               >

// // // // // // // // // // // //                 {/* Create Room */}

// // // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // // //                   activeOpacity={0.85}
// // // // // // // // // // // //                   onPress={onCreateRoom}
// // // // // // // // // // // //                   style={[
// // // // // // // // // // // //                     styles.actionCard,
// // // // // // // // // // // //                     styles.createCard,
// // // // // // // // // // // //                   ]}
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                   <View
// // // // // // // // // // // //                     style={[
// // // // // // // // // // // //                       styles.actionIcon,
// // // // // // // // // // // //                       {
// // // // // // // // // // // //                         backgroundColor: "#5B43D6",
// // // // // // // // // // // //                       },
// // // // // // // // // // // //                     ]}
// // // // // // // // // // // //                   >
// // // // // // // // // // // //                     <Ionicons
// // // // // // // // // // // //                       name="add"
// // // // // // // // // // // //                       size={24}
// // // // // // // // // // // //                       color="#FFFFFF"
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                   </View>

// // // // // // // // // // // //                   <View style={styles.actionContent}>
// // // // // // // // // // // //                     <Text style={styles.actionTitle}>
// // // // // // // // // // // //                       Create Room
// // // // // // // // // // // //                     </Text>

// // // // // // // // // // // //                     <Text style={styles.actionDescription}>
// // // // // // // // // // // //                       Start a private game with friends
// // // // // // // // // // // //                     </Text>
// // // // // // // // // // // //                   </View>

// // // // // // // // // // // //                   <Ionicons
// // // // // // // // // // // //                     name="chevron-forward"
// // // // // // // // // // // //                     size={20}
// // // // // // // // // // // //                     color="#7F8AAA"
// // // // // // // // // // // //                   />
// // // // // // // // // // // //                 </TouchableOpacity>

// // // // // // // // // // // //                 {/* Join Room */}

// // // // // // // // // // // //                 <View
// // // // // // // // // // // //                   style={[
// // // // // // // // // // // //                     styles.actionCard,
// // // // // // // // // // // //                     styles.joinCard,
// // // // // // // // // // // //                   ]}
// // // // // // // // // // // //                 >

// // // // // // // // // // // //                   <View
// // // // // // // // // // // //                     style={[
// // // // // // // // // // // //                       styles.actionIcon,
// // // // // // // // // // // //                       {
// // // // // // // // // // // //                         backgroundColor: "#2767DD",
// // // // // // // // // // // //                       },
// // // // // // // // // // // //                     ]}
// // // // // // // // // // // //                   >
// // // // // // // // // // // //                     <Ionicons
// // // // // // // // // // // //                       name="enter-outline"
// // // // // // // // // // // //                       size={23}
// // // // // // // // // // // //                       color="#FFFFFF"
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                   </View>

// // // // // // // // // // // //                   <View style={styles.actionContent}>

// // // // // // // // // // // //                     <Text style={styles.actionTitle}>
// // // // // // // // // // // //                       Join Room
// // // // // // // // // // // //                     </Text>

// // // // // // // // // // // //                     <Text style={styles.actionDescription}>
// // // // // // // // // // // //                       Enter a room code to join
// // // // // // // // // // // //                     </Text>

// // // // // // // // // // // //                     <View style={styles.codeRow}>

// // // // // // // // // // // //                       <TextInput
// // // // // // // // // // // //                         value={joinCode}
// // // // // // // // // // // //                         onChangeText={(value) =>
// // // // // // // // // // // //                           setJoinCode(
// // // // // // // // // // // //                             value
// // // // // // // // // // // //                               .toUpperCase()
// // // // // // // // // // // //                               .replace(/[^A-Z0-9]/g, "")
// // // // // // // // // // // //                               .slice(0, 6)
// // // // // // // // // // // //                           )
// // // // // // // // // // // //                         }
// // // // // // // // // // // //                         placeholder="ROOM CODE"
// // // // // // // // // // // //                         placeholderTextColor="#66718D"
// // // // // // // // // // // //                         autoCapitalize="characters"
// // // // // // // // // // // //                         maxLength={6}
// // // // // // // // // // // //                         style={styles.codeInput}
// // // // // // // // // // // //                       />

// // // // // // // // // // // //                       <TouchableOpacity
// // // // // // // // // // // //                         style={styles.joinSmallButton}
// // // // // // // // // // // //                         onPress={handleJoinRoom}
// // // // // // // // // // // //                       >
// // // // // // // // // // // //                         <Text style={styles.joinSmallButtonText}>
// // // // // // // // // // // //                           Join
// // // // // // // // // // // //                         </Text>
// // // // // // // // // // // //                       </TouchableOpacity>

// // // // // // // // // // // //                     </View>

// // // // // // // // // // // //                   </View>

// // // // // // // // // // // //                 </View>

// // // // // // // // // // // //               </View>

// // // // // // // // // // // //               {/* ================================================= */}
// // // // // // // // // // // //               {/* GAME STATS */}
// // // // // // // // // // // //               {/* ================================================= */}

// // // // // // // // // // // //               <View style={styles.statsRow}>

// // // // // // // // // // // //                 <View style={styles.statCard}>
// // // // // // // // // // // //                   <View
// // // // // // // // // // // //                     style={[
// // // // // // // // // // // //                       styles.statIcon,
// // // // // // // // // // // //                       { backgroundColor: "#172F5D" },
// // // // // // // // // // // //                     ]}
// // // // // // // // // // // //                   >
// // // // // // // // // // // //                     <Ionicons
// // // // // // // // // // // //                       name="people-outline"
// // // // // // // // // // // //                       size={20}
// // // // // // // // // // // //                       color="#4D9DFF"
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                   </View>

// // // // // // // // // // // //                   <View>
// // // // // // // // // // // //                     <Text style={styles.statValue}>
// // // // // // // // // // // //                       1.2K+
// // // // // // // // // // // //                     </Text>

// // // // // // // // // // // //                     <Text style={styles.statLabel}>
// // // // // // // // // // // //                       Players Online
// // // // // // // // // // // //                     </Text>
// // // // // // // // // // // //                   </View>
// // // // // // // // // // // //                 </View>

// // // // // // // // // // // //                 <View style={styles.statCard}>
// // // // // // // // // // // //                   <View
// // // // // // // // // // // //                     style={[
// // // // // // // // // // // //                       styles.statIcon,
// // // // // // // // // // // //                       { backgroundColor: "#322752" },
// // // // // // // // // // // //                     ]}
// // // // // // // // // // // //                   >
// // // // // // // // // // // //                     <Ionicons
// // // // // // // // // // // //                       name="game-controller-outline"
// // // // // // // // // // // //                       size={20}
// // // // // // // // // // // //                       color="#A78BFA"
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                   </View>

// // // // // // // // // // // //                   <View>
// // // // // // // // // // // //                     <Text style={styles.statValue}>
// // // // // // // // // // // //                       856
// // // // // // // // // // // //                     </Text>

// // // // // // // // // // // //                     <Text style={styles.statLabel}>
// // // // // // // // // // // //                       Games Today
// // // // // // // // // // // //                     </Text>
// // // // // // // // // // // //                   </View>
// // // // // // // // // // // //                 </View>

// // // // // // // // // // // //                 <View style={styles.statCard}>
// // // // // // // // // // // //                   <View
// // // // // // // // // // // //                     style={[
// // // // // // // // // // // //                       styles.statIcon,
// // // // // // // // // // // //                       { backgroundColor: "#4B3A19" },
// // // // // // // // // // // //                     ]}
// // // // // // // // // // // //                   >
// // // // // // // // // // // //                     <Ionicons
// // // // // // // // // // // //                       name="trophy-outline"
// // // // // // // // // // // //                       size={20}
// // // // // // // // // // // //                       color="#F8C52E"
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                   </View>

// // // // // // // // // // // //                   <View>
// // // // // // // // // // // //                     <Text style={styles.statValue}>
// // // // // // // // // // // //                       610
// // // // // // // // // // // //                     </Text>

// // // // // // // // // // // //                     <Text style={styles.statLabel}>
// // // // // // // // // // // //                       Your Best Score
// // // // // // // // // // // //                     </Text>
// // // // // // // // // // // //                   </View>
// // // // // // // // // // // //                 </View>

// // // // // // // // // // // //               </View>

// // // // // // // // // // // //               {/* ================================================= */}
// // // // // // // // // // // //               {/* TOP PLAYERS */}
// // // // // // // // // // // //               {/* ================================================= */}

// // // // // // // // // // // //               <View style={styles.leaderboardCard}>

// // // // // // // // // // // //                 <View style={styles.leaderboardHeader}>

// // // // // // // // // // // //                   <View>
// // // // // // // // // // // //                     <Text style={styles.leaderboardTitle}>
// // // // // // // // // // // //                       Top Players
// // // // // // // // // // // //                     </Text>

// // // // // // // // // // // //                     <Text style={styles.leaderboardSubtitle}>
// // // // // // // // // // // //                       Players leading the board
// // // // // // // // // // // //                     </Text>
// // // // // // // // // // // //                   </View>

// // // // // // // // // // // //                   <TouchableOpacity
// // // // // // // // // // // //                     onPress={onViewAllPlayers}
// // // // // // // // // // // //                     style={styles.viewAllButton}
// // // // // // // // // // // //                   >
// // // // // // // // // // // //                     <Text style={styles.viewAllText}>
// // // // // // // // // // // //                       View All
// // // // // // // // // // // //                     </Text>

// // // // // // // // // // // //                     <Ionicons
// // // // // // // // // // // //                       name="arrow-forward"
// // // // // // // // // // // //                       size={15}
// // // // // // // // // // // //                       color="#829BFF"
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                   </TouchableOpacity>

// // // // // // // // // // // //                 </View>

// // // // // // // // // // // //                 {topPlayers.slice(0, 5).map((p, index) => (

// // // // // // // // // // // //                   <View
// // // // // // // // // // // //                     key={`${p.name}-${p.rank}`}
// // // // // // // // // // // //                     style={[
// // // // // // // // // // // //                       styles.playerRow,
// // // // // // // // // // // //                       index === 0 &&
// // // // // // // // // // // //                         styles.firstPlayerRow,
// // // // // // // // // // // //                     ]}
// // // // // // // // // // // //                   >

// // // // // // // // // // // //                     <View style={styles.rankContainer}>
// // // // // // // // // // // //                       {p.rank === 1 ? (
// // // // // // // // // // // //                         <Text style={styles.rankMedal}>
// // // // // // // // // // // //                           🥇
// // // // // // // // // // // //                         </Text>
// // // // // // // // // // // //                       ) : p.rank === 2 ? (
// // // // // // // // // // // //                         <Text style={styles.rankMedal}>
// // // // // // // // // // // //                           🥈
// // // // // // // // // // // //                         </Text>
// // // // // // // // // // // //                       ) : p.rank === 3 ? (
// // // // // // // // // // // //                         <Text style={styles.rankMedal}>
// // // // // // // // // // // //                           🥉
// // // // // // // // // // // //                         </Text>
// // // // // // // // // // // //                       ) : (
// // // // // // // // // // // //                         <Text style={styles.rankNumber}>
// // // // // // // // // // // //                           {p.rank}
// // // // // // // // // // // //                         </Text>
// // // // // // // // // // // //                       )}
// // // // // // // // // // // //                     </View>

// // // // // // // // // // // //                     <View
// // // // // // // // // // // //                       style={[
// // // // // // // // // // // //                         styles.avatar,
// // // // // // // // // // // //                         {
// // // // // // // // // // // //                           backgroundColor:
// // // // // // // // // // // //                             p.avatarColor || "#5B43D6",
// // // // // // // // // // // //                         },
// // // // // // // // // // // //                       ]}
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       <Ionicons
// // // // // // // // // // // //                         name="person"
// // // // // // // // // // // //                         size={17}
// // // // // // // // // // // //                         color="#FFFFFF"
// // // // // // // // // // // //                       />
// // // // // // // // // // // //                     </View>

// // // // // // // // // // // //                     <View style={styles.playerInfo}>
// // // // // // // // // // // //                       <Text style={styles.playerName}>
// // // // // // // // // // // //                         {p.name}
// // // // // // // // // // // //                       </Text>

// // // // // // // // // // // //                       <Text style={styles.playerLevel}>
// // // // // // // // // // // //                         Level {Math.max(1, 10 - p.rank)}
// // // // // // // // // // // //                       </Text>
// // // // // // // // // // // //                     </View>

// // // // // // // // // // // //                     <View style={styles.scoreContainer}>
// // // // // // // // // // // //                       <Text style={styles.playerScore}>
// // // // // // // // // // // //                         {p.score}
// // // // // // // // // // // //                       </Text>

// // // // // // // // // // // //                       <Text style={styles.pointsText}>
// // // // // // // // // // // //                         pts
// // // // // // // // // // // //                       </Text>
// // // // // // // // // // // //                     </View>

// // // // // // // // // // // //                   </View>

// // // // // // // // // // // //                 ))}

// // // // // // // // // // // //               </View>

// // // // // // // // // // // //               {/* ================================================= */}
// // // // // // // // // // // //               {/* HOW TO PLAY */}
// // // // // // // // // // // //               {/* ================================================= */}

// // // // // // // // // // // //               <View style={styles.howToCard}>

// // // // // // // // // // // //                 <View style={styles.howToIcon}>
// // // // // // // // // // // //                   <Ionicons
// // // // // // // // // // // //                     name="bulb-outline"
// // // // // // // // // // // //                     size={24}
// // // // // // // // // // // //                     color="#F8C52E"
// // // // // // // // // // // //                   />
// // // // // // // // // // // //                 </View>

// // // // // // // // // // // //                 <View style={styles.howToContent}>
// // // // // // // // // // // //                   <Text style={styles.howToTitle}>
// // // // // // // // // // // //                     How to play
// // // // // // // // // // // //                   </Text>

// // // // // // // // // // // //                   <Text style={styles.howToText}>
// // // // // // // // // // // //                     Unscramble the letters before the timer runs
// // // // // // // // // // // //                     out. Score more points by answering quickly.
// // // // // // // // // // // //                   </Text>
// // // // // // // // // // // //                 </View>

// // // // // // // // // // // //                 <Ionicons
// // // // // // // // // // // //                   name="chevron-forward"
// // // // // // // // // // // //                   size={20}
// // // // // // // // // // // //                   color="#65718C"
// // // // // // // // // // // //                 />

// // // // // // // // // // // //               </View>

// // // // // // // // // // // //             </ScrollView>

// // // // // // // // // // // //             {/* ================================================= */}
// // // // // // // // // // // //             {/* MOBILE BOTTOM NAVIGATION */}
// // // // // // // // // // // //             {/* ================================================= */}

// // // // // // // // // // // //             {!isDesktop && (
// // // // // // // // // // // //               <View style={styles.bottomTabBar}>

// // // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // // //                   style={styles.bottomTab}
// // // // // // // // // // // //                   onPress={onTabHome}
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                   <View style={styles.activeTabIcon}>
// // // // // // // // // // // //                     <Ionicons
// // // // // // // // // // // //                       name="home"
// // // // // // // // // // // //                       size={20}
// // // // // // // // // // // //                       color="#FFFFFF"
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                   </View>

// // // // // // // // // // // //                   <Text style={styles.activeTabText}>
// // // // // // // // // // // //                     Home
// // // // // // // // // // // //                   </Text>
// // // // // // // // // // // //                 </TouchableOpacity>

// // // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // // //                   style={styles.bottomTab}
// // // // // // // // // // // //                   onPress={onTabLeaderboard}
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                   <Ionicons
// // // // // // // // // // // //                     name="trophy-outline"
// // // // // // // // // // // //                     size={21}
// // // // // // // // // // // //                     color="#65718C"
// // // // // // // // // // // //                   />

// // // // // // // // // // // //                   <Text style={styles.bottomTabText}>
// // // // // // // // // // // //                     Leaderboard
// // // // // // // // // // // //                   </Text>
// // // // // // // // // // // //                 </TouchableOpacity>

// // // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // // //                   style={styles.bottomTab}
// // // // // // // // // // // //                   onPress={onTabProfile}
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                   <Ionicons
// // // // // // // // // // // //                     name="person-outline"
// // // // // // // // // // // //                     size={21}
// // // // // // // // // // // //                     color="#65718C"
// // // // // // // // // // // //                   />

// // // // // // // // // // // //                   <Text style={styles.bottomTabText}>
// // // // // // // // // // // //                     Profile
// // // // // // // // // // // //                   </Text>
// // // // // // // // // // // //                 </TouchableOpacity>

// // // // // // // // // // // //               </View>
// // // // // // // // // // // //             )}

// // // // // // // // // // // //           </View>

// // // // // // // // // // // //         </View>
// // // // // // // // // // // //       </SafeAreaView>
// // // // // // // // // // // //     </LinearGradient>
// // // // // // // // // // // //   );
// // // // // // // // // // // // };

// // // // // // // // // // // // export default WordScrambleHomeScreen;

// // // // // // // // // // // // /* ========================================================= */
// // // // // // // // // // // // /* STYLES */
// // // // // // // // // // // // /* ========================================================= */

// // // // // // // // // // // // const styles = StyleSheet.create({

// // // // // // // // // // // //   flex: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   appContainer: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   /* ======================================================= */
// // // // // // // // // // // //   /* SIDEBAR */
// // // // // // // // // // // //   /* ======================================================= */

// // // // // // // // // // // //   sidebar: {
// // // // // // // // // // // //     width: 245,
// // // // // // // // // // // //     backgroundColor: "#080D20",
// // // // // // // // // // // //     borderRightWidth: 1,
// // // // // // // // // // // //     borderRightColor: "#1B2542",
// // // // // // // // // // // //     paddingHorizontal: 17,
// // // // // // // // // // // //     paddingTop: 25,
// // // // // // // // // // // //     paddingBottom: 20,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   brandArea: {
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     gap: 11,
// // // // // // // // // // // //     paddingHorizontal: 7,
// // // // // // // // // // // //     marginBottom: 45,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   brandLogo: {
// // // // // // // // // // // //     width: 47,
// // // // // // // // // // // //     height: 47,
// // // // // // // // // // // //     borderRadius: 14,
// // // // // // // // // // // //     backgroundColor: "#5B43D6",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // //     borderColor: "#806EFF",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   brandTitle: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 17,
// // // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   brandPurple: {
// // // // // // // // // // // //     color: "#A78BFA",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   brandSubtitle: {
// // // // // // // // // // // //     color: "#687592",
// // // // // // // // // // // //     fontSize: 9.5,
// // // // // // // // // // // //     marginTop: 3,
// // // // // // // // // // // //     fontWeight: "600",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   sidebarMenu: {
// // // // // // // // // // // //     gap: 8,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   sidebarItem: {
// // // // // // // // // // // //     height: 50,
// // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     paddingHorizontal: 15,
// // // // // // // // // // // //     gap: 13,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   sidebarItemActive: {
// // // // // // // // // // // //     backgroundColor: "#4E3BCB",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   sidebarItemText: {
// // // // // // // // // // // //     color: "#8994AF",
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     fontWeight: "600",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   sidebarItemTextActive: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   sidebarBottomCard: {
// // // // // // // // // // // //     marginTop: "auto",
// // // // // // // // // // // //     borderRadius: 17,
// // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // //     backgroundColor: "#101936",
// // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // //     borderColor: "#27345D",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   smallIconCircle: {
// // // // // // // // // // // //     width: 38,
// // // // // // // // // // // //     height: 38,
// // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // //     backgroundColor: "#29204E",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   sidebarBottomTitle: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // //     fontSize: 13,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   sidebarBottomText: {
// // // // // // // // // // // //     color: "#77839F",
// // // // // // // // // // // //     fontSize: 10.5,
// // // // // // // // // // // //     lineHeight: 16,
// // // // // // // // // // // //     marginTop: 5,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   sidebarPlayButton: {
// // // // // // // // // // // //     height: 38,
// // // // // // // // // // // //     borderRadius: 10,
// // // // // // // // // // // //     marginTop: 14,
// // // // // // // // // // // //     backgroundColor: "#5B43D6",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     gap: 7,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   sidebarPlayText: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 11,
// // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   /* ======================================================= */
// // // // // // // // // // // //   /* MAIN */
// // // // // // // // // // // //   /* ======================================================= */

// // // // // // // // // // // //   mainArea: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //     minWidth: 0,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   topHeader: {
// // // // // // // // // // // //     height: 76,
// // // // // // // // // // // //     paddingHorizontal: 30,
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // // // //     borderBottomColor: "#131C32",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   headerTitle: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 20,
// // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   headerSubtitle: {
// // // // // // // // // // // //     color: "#697590",
// // // // // // // // // // // //     fontSize: 11,
// // // // // // // // // // // //     marginTop: 3,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   headerRight: {
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     gap: 12,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   notificationButton: {
// // // // // // // // // // // //     width: 40,
// // // // // // // // // // // //     height: 40,
// // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // //     backgroundColor: "#111A34",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // //     borderColor: "#202B4B",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   notificationDot: {
// // // // // // // // // // // //     position: "absolute",
// // // // // // // // // // // //     width: 6,
// // // // // // // // // // // //     height: 6,
// // // // // // // // // // // //     borderRadius: 3,
// // // // // // // // // // // //     backgroundColor: "#F97066",
// // // // // // // // // // // //     top: 9,
// // // // // // // // // // // //     right: 10,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   profileButton: {
// // // // // // // // // // // //     height: 42,
// // // // // // // // // // // //     paddingHorizontal: 8,
// // // // // // // // // // // //     paddingRight: 12,
// // // // // // // // // // // //     borderRadius: 22,
// // // // // // // // // // // //     backgroundColor: "#121B3A",
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     gap: 8,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   profileAvatar: {
// // // // // // // // // // // //     width: 32,
// // // // // // // // // // // //     height: 32,
// // // // // // // // // // // //     borderRadius: 16,
// // // // // // // // // // // //     backgroundColor: "#6C4DE8",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   profileName: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // // //     fontWeight: "700",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   /* ======================================================= */
// // // // // // // // // // // //   /* MOBILE HEADER */
// // // // // // // // // // // //   /* ======================================================= */

// // // // // // // // // // // //   mobileBrand: {
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     gap: 9,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   mobileLogo: {
// // // // // // // // // // // //     width: 38,
// // // // // // // // // // // //     height: 38,
// // // // // // // // // // // //     borderRadius: 11,
// // // // // // // // // // // //     backgroundColor: "#5B43D6",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   mobileBrandTitle: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 15,
// // // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   mobileBrandSubtitle: {
// // // // // // // // // // // //     color: "#687592",
// // // // // // // // // // // //     fontSize: 8.5,
// // // // // // // // // // // //     marginTop: 2,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   /* ======================================================= */
// // // // // // // // // // // //   /* SCROLL */
// // // // // // // // // // // //   /* ======================================================= */

// // // // // // // // // // // //   scrollContent: {
// // // // // // // // // // // //     paddingHorizontal: 22,
// // // // // // // // // // // //     paddingTop: 25,
// // // // // // // // // // // //     paddingBottom: 35,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   desktopScrollContent: {
// // // // // // // // // // // //     maxWidth: 1250,
// // // // // // // // // // // //     width: "100%",
// // // // // // // // // // // //     alignSelf: "center",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   /* ======================================================= */
// // // // // // // // // // // //   /* HERO */
// // // // // // // // // // // //   /* ======================================================= */

// // // // // // // // // // // //   heroCard: {
// // // // // // // // // // // //     minHeight: 290,
// // // // // // // // // // // //     borderRadius: 24,
// // // // // // // // // // // //     overflow: "hidden",
// // // // // // // // // // // //     backgroundColor: "#111A46",
// // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // //     borderColor: "#29398A",
// // // // // // // // // // // //     paddingHorizontal: 38,
// // // // // // // // // // // //     paddingVertical: 32,
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   heroCardMobile: {
// // // // // // // // // // // //     minHeight: 350,
// // // // // // // // // // // //     paddingHorizontal: 22,
// // // // // // // // // // // //     paddingVertical: 25,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   heroLeft: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //     maxWidth: 570,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   heroBadge: {
// // // // // // // // // // // //     alignSelf: "flex-start",
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     gap: 6,
// // // // // // // // // // // //     backgroundColor: "#292B77",
// // // // // // // // // // // //     borderRadius: 20,
// // // // // // // // // // // //     paddingHorizontal: 12,
// // // // // // // // // // // //     paddingVertical: 7,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   heroBadgeText: {
// // // // // // // // // // // //     color: "#D7D7FF",
// // // // // // // // // // // //     fontSize: 9.5,
// // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // //     letterSpacing: 0.5,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   heroTitle: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 38,
// // // // // // // // // // // //     lineHeight: 45,
// // // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // // //     marginTop: 20,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   heroTitlePurple: {
// // // // // // // // // // // //     color: "#A78BFA",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   heroDescription: {
// // // // // // // // // // // //     color: "#8D99B7",
// // // // // // // // // // // //     fontSize: 13,
// // // // // // // // // // // //     lineHeight: 20,
// // // // // // // // // // // //     marginTop: 10,
// // // // // // // // // // // //     maxWidth: 440,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   mainPlayButton: {
// // // // // // // // // // // //     marginTop: 23,
// // // // // // // // // // // //     height: 50,
// // // // // // // // // // // //     paddingHorizontal: 20,
// // // // // // // // // // // //     borderRadius: 13,
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     alignSelf: "flex-start",
// // // // // // // // // // // //     gap: 9,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   mainPlayButtonText: {
// // // // // // // // // // // //     color: "#211900",
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   heroGraphic: {
// // // // // // // // // // // //     width: 350,
// // // // // // // // // // // //     position: "relative",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   letterTile: {
// // // // // // // // // // // //     width: 58,
// // // // // // // // // // // //     height: 58,
// // // // // // // // // // // //     borderRadius: 14,
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     position: "absolute",
// // // // // // // // // // // //     transform: [{ rotate: "-10deg" }],
// // // // // // // // // // // //   },

// // // // // // // // // // // //   tileOne: {
// // // // // // // // // // // //     top: 20,
// // // // // // // // // // // //     left: 35,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   tileTwo: {
// // // // // // // // // // // //     top: 70,
// // // // // // // // // // // //     left: 110,
// // // // // // // // // // // //     transform: [{ rotate: "8deg" }],
// // // // // // // // // // // //   },

// // // // // // // // // // // //   tileThree: {
// // // // // // // // // // // //     top: 25,
// // // // // // // // // // // //     right: 35,
// // // // // // // // // // // //     transform: [{ rotate: "12deg" }],
// // // // // // // // // // // //   },

// // // // // // // // // // // //   tileFour: {
// // // // // // // // // // // //     bottom: 30,
// // // // // // // // // // // //     right: 75,
// // // // // // // // // // // //     transform: [{ rotate: "-7deg" }],
// // // // // // // // // // // //   },

// // // // // // // // // // // //   tileBlue: {
// // // // // // // // // // // //     backgroundColor: "#347FE9",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   tilePurple: {
// // // // // // // // // // // //     backgroundColor: "#795CE7",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   tileYellow: {
// // // // // // // // // // // //     backgroundColor: "#F4C52E",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   tilePink: {
// // // // // // // // // // // //     backgroundColor: "#F46B72",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   letterText: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 25,
// // // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   letterTextDark: {
// // // // // // // // // // // //     color: "#201900",
// // // // // // // // // // // //     fontSize: 25,
// // // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   heroLock: {
// // // // // // // // // // // //     width: 100,
// // // // // // // // // // // //     height: 100,
// // // // // // // // // // // //     borderRadius: 30,
// // // // // // // // // // // //     backgroundColor: "#5C44D8",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     borderWidth: 2,
// // // // // // // // // // // //     borderColor: "#8873FF",
// // // // // // // // // // // //     shadowColor: "#785DFF",
// // // // // // // // // // // //     shadowOpacity: 0.4,
// // // // // // // // // // // //     shadowRadius: 25,
// // // // // // // // // // // //     elevation: 10,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   /* ======================================================= */
// // // // // // // // // // // //   /* SECTION */
// // // // // // // // // // // //   /* ======================================================= */

// // // // // // // // // // // //   sectionHeader: {
// // // // // // // // // // // //     marginTop: 28,
// // // // // // // // // // // //     marginBottom: 14,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   sectionTitle: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 18,
// // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   sectionSubtitle: {
// // // // // // // // // // // //     color: "#697590",
// // // // // // // // // // // //     fontSize: 11,
// // // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   /* ======================================================= */
// // // // // // // // // // // //   /* ACTIONS */
// // // // // // // // // // // //   /* ======================================================= */

// // // // // // // // // // // //   actionGrid: {
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     gap: 15,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   actionGridMobile: {
// // // // // // // // // // // //     flexDirection: "column",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   actionCard: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //     minHeight: 105,
// // // // // // // // // // // //     borderRadius: 17,
// // // // // // // // // // // //     padding: 17,
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   createCard: {
// // // // // // // // // // // //     backgroundColor: "#121936",
// // // // // // // // // // // //     borderColor: "#2B3B70",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   joinCard: {
// // // // // // // // // // // //     backgroundColor: "#121936",
// // // // // // // // // // // //     borderColor: "#2B3B70",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   actionIcon: {
// // // // // // // // // // // //     width: 48,
// // // // // // // // // // // //     height: 48,
// // // // // // // // // // // //     borderRadius: 14,
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     marginRight: 13,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   actionContent: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   actionTitle: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   actionDescription: {
// // // // // // // // // // // //     color: "#6F7B97",
// // // // // // // // // // // //     fontSize: 10.5,
// // // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // // //     lineHeight: 15,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   codeRow: {
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     gap: 7,
// // // // // // // // // // // //     marginTop: 9,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   codeInput: {
// // // // // // // // // // // //     width: 115,
// // // // // // // // // // // //     height: 32,
// // // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // // //     backgroundColor: "#090F22",
// // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // //     borderColor: "#293656",
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     paddingHorizontal: 10,
// // // // // // // // // // // //     fontSize: 10,
// // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // //     letterSpacing: 1,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   joinSmallButton: {
// // // // // // // // // // // //     height: 32,
// // // // // // // // // // // //     paddingHorizontal: 13,
// // // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // // //     backgroundColor: "#2865D8",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   joinSmallButtonText: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 10,
// // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   /* ======================================================= */
// // // // // // // // // // // //   /* STATS */
// // // // // // // // // // // //   /* ======================================================= */

// // // // // // // // // // // //   statsRow: {
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     gap: 14,
// // // // // // // // // // // //     marginTop: 16,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   statCard: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //     minHeight: 76,
// // // // // // // // // // // //     backgroundColor: "#10172E",
// // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // //     borderColor: "#1D2948",
// // // // // // // // // // // //     borderRadius: 15,
// // // // // // // // // // // //     padding: 13,
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     gap: 10,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   statIcon: {
// // // // // // // // // // // //     width: 40,
// // // // // // // // // // // //     height: 40,
// // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   statValue: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 15,
// // // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   statLabel: {
// // // // // // // // // // // //     color: "#66728E",
// // // // // // // // // // // //     fontSize: 9.5,
// // // // // // // // // // // //     marginTop: 3,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   /* ======================================================= */
// // // // // // // // // // // //   /* LEADERBOARD */
// // // // // // // // // // // //   /* ======================================================= */

// // // // // // // // // // // //   leaderboardCard: {
// // // // // // // // // // // //     backgroundColor: "#10172E",
// // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // //     borderColor: "#1D2948",
// // // // // // // // // // // //     borderRadius: 19,
// // // // // // // // // // // //     marginTop: 16,
// // // // // // // // // // // //     padding: 19,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   leaderboardHeader: {
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     marginBottom: 8,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   leaderboardTitle: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   leaderboardSubtitle: {
// // // // // // // // // // // //     color: "#687590",
// // // // // // // // // // // //     fontSize: 10.5,
// // // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   viewAllButton: {
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     gap: 5,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   viewAllText: {
// // // // // // // // // // // //     color: "#829BFF",
// // // // // // // // // // // //     fontSize: 11,
// // // // // // // // // // // //     fontWeight: "700",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   playerRow: {
// // // // // // // // // // // //     minHeight: 55,
// // // // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // // // //     borderTopColor: "#1A2540",
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     paddingVertical: 8,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   firstPlayerRow: {
// // // // // // // // // // // //     backgroundColor: "#121D39",
// // // // // // // // // // // //     borderRadius: 11,
// // // // // // // // // // // //     paddingHorizontal: 9,
// // // // // // // // // // // //     marginTop: 5,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   rankContainer: {
// // // // // // // // // // // //     width: 36,
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   rankMedal: {
// // // // // // // // // // // //     fontSize: 18,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   rankNumber: {
// // // // // // // // // // // //     color: "#67738F",
// // // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   avatar: {
// // // // // // // // // // // //     width: 34,
// // // // // // // // // // // //     height: 34,
// // // // // // // // // // // //     borderRadius: 17,
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   playerInfo: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //     marginLeft: 11,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   playerName: {
// // // // // // // // // // // //     color: "#E7EBF5",
// // // // // // // // // // // //     fontSize: 12.5,
// // // // // // // // // // // //     fontWeight: "700",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   playerLevel: {
// // // // // // // // // // // //     color: "#65718B",
// // // // // // // // // // // //     fontSize: 9.5,
// // // // // // // // // // // //     marginTop: 3,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   scoreContainer: {
// // // // // // // // // // // //     alignItems: "flex-end",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   playerScore: {
// // // // // // // // // // // //     color: "#F8C52E",
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   pointsText: {
// // // // // // // // // // // //     color: "#606C86",
// // // // // // // // // // // //     fontSize: 8.5,
// // // // // // // // // // // //     marginTop: 2,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   /* ======================================================= */
// // // // // // // // // // // //   /* HOW TO PLAY */
// // // // // // // // // // // //   /* ======================================================= */

// // // // // // // // // // // //   howToCard: {
// // // // // // // // // // // //     marginTop: 16,
// // // // // // // // // // // //     minHeight: 78,
// // // // // // // // // // // //     backgroundColor: "#111936",
// // // // // // // // // // // //     borderRadius: 16,
// // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // //     borderColor: "#26345B",
// // // // // // // // // // // //     padding: 14,
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   howToIcon: {
// // // // // // // // // // // //     width: 43,
// // // // // // // // // // // //     height: 43,
// // // // // // // // // // // //     borderRadius: 13,
// // // // // // // // // // // //     backgroundColor: "#332A16",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     marginRight: 12,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   howToContent: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   howToTitle: {
// // // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // // //     fontSize: 13,
// // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   howToText: {
// // // // // // // // // // // //     color: "#707C97",
// // // // // // // // // // // //     fontSize: 10,
// // // // // // // // // // // //     lineHeight: 15,
// // // // // // // // // // // //     marginTop: 3,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   /* ======================================================= */
// // // // // // // // // // // //   /* MOBILE BOTTOM NAV */
// // // // // // // // // // // //   /* ======================================================= */

// // // // // // // // // // // //   bottomTabBar: {
// // // // // // // // // // // //     height: 66,
// // // // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // // // //     borderTopColor: "#1A243E",
// // // // // // // // // // // //     backgroundColor: "#080D1D",
// // // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // // //     paddingBottom: 4,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   bottomTab: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //     gap: 3,
// // // // // // // // // // // //   },

// // // // // // // // // // // //   activeTabIcon: {
// // // // // // // // // // // //     width: 34,
// // // // // // // // // // // //     height: 30,
// // // // // // // // // // // //     borderRadius: 10,
// // // // // // // // // // // //     backgroundColor: "#4E3BCB",
// // // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   activeTabText: {
// // // // // // // // // // // //     color: "#A78BFA",
// // // // // // // // // // // //     fontSize: 9,
// // // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // // //   },

// // // // // // // // // // // //   bottomTabText: {
// // // // // // // // // // // //     color: "#65718C",
// // // // // // // // // // // //     fontSize: 9,
// // // // // // // // // // // //     fontWeight: "600",
// // // // // // // // // // // //   },
// // // // // // // // // // // // });
// // // // // // // // // // // import React from "react";
// // // // // // // // // // // import {
// // // // // // // // // // //   View,
// // // // // // // // // // //   Text,
// // // // // // // // // // //   StyleSheet,
// // // // // // // // // // //   TouchableOpacity,
// // // // // // // // // // //   TextInput,
// // // // // // // // // // //   ScrollView,
// // // // // // // // // // //   SafeAreaView,
// // // // // // // // // // //   StatusBar,
// // // // // // // // // // // } from "react-native";
// // // // // // // // // // // import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// // // // // // // // // // // export interface TopPlayer {
// // // // // // // // // // //   rank: number;
// // // // // // // // // // //   name: string;
// // // // // // // // // // //   score: number;
// // // // // // // // // // //   avatarColor: string;
// // // // // // // // // // // }

// // // // // // // // // // // interface WordScrambleHomeScreenProps {
// // // // // // // // // // //   topPlayers: TopPlayer[];

// // // // // // // // // // //   onPlayOnline: () => void;
// // // // // // // // // // //   onCreateRoom: () => void;
// // // // // // // // // // //   onJoinRoom: (code: string) => void;
// // // // // // // // // // //   onViewAllPlayers: () => void;

// // // // // // // // // // //   onTabHome: () => void;
// // // // // // // // // // //   onTabLeaderboard: () => void;
// // // // // // // // // // //   onTabProfile: () => void;
// // // // // // // // // // // }

// // // // // // // // // // // const WordScrambleHomeScreen: React.FC<WordScrambleHomeScreenProps> = ({
// // // // // // // // // // //   topPlayers,
// // // // // // // // // // //   onPlayOnline,
// // // // // // // // // // //   onCreateRoom,
// // // // // // // // // // //   onJoinRoom,
// // // // // // // // // // //   onViewAllPlayers,
// // // // // // // // // // //   onTabHome,
// // // // // // // // // // //   onTabLeaderboard,
// // // // // // // // // // //   onTabProfile,
// // // // // // // // // // // }) => {
// // // // // // // // // // //   const [joinCode, setJoinCode] = React.useState("");

// // // // // // // // // // //   const handleJoinRoom = () => {
// // // // // // // // // // //     const code = joinCode.trim();

// // // // // // // // // // //     if (!code) {
// // // // // // // // // // //       return;
// // // // // // // // // // //     }

// // // // // // // // // // //     onJoinRoom(code);
// // // // // // // // // // //   };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // // // // // // //       <StatusBar
// // // // // // // // // // //         barStyle="dark-content"
// // // // // // // // // // //         backgroundColor="#FFF9F0"
// // // // // // // // // // //       />

// // // // // // // // // // //       <View style={styles.container}>

// // // // // // // // // // //         {/* ================= TOP HEADER ================= */}

// // // // // // // // // // //         <View style={styles.header}>

// // // // // // // // // // //           <View style={styles.brandArea}>

// // // // // // // // // // //             <View style={styles.wordLogo}>
// // // // // // // // // // //               <Text style={styles.logoW}>W</Text>
// // // // // // // // // // //               <Text style={styles.logoS}>S</Text>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <View>
// // // // // // // // // // //               <Text style={styles.brandTitle}>
// // // // // // // // // // //                 Word<span style={styles.fakeSpan}> </span>
// // // // // // // // // // //                 <Text style={styles.brandTitleAccent}>
// // // // // // // // // // //                   Scramble
// // // // // // // // // // //                 </Text>
// // // // // // // // // // //               </Text>

// // // // // // // // // // //               <Text style={styles.brandSubtitle}>
// // // // // // // // // // //                 Think fast. Play smart.
// // // // // // // // // // //               </Text>
// // // // // // // // // // //             </View>

// // // // // // // // // // //           </View>

// // // // // // // // // // //           <TouchableOpacity
// // // // // // // // // // //             activeOpacity={0.8}
// // // // // // // // // // //             style={styles.notificationButton}
// // // // // // // // // // //           >
// // // // // // // // // // //             <Ionicons
// // // // // // // // // // //               name="notifications-outline"
// // // // // // // // // // //               size={21}
// // // // // // // // // // //               color="#263238"
// // // // // // // // // // //             />
// // // // // // // // // // //           </TouchableOpacity>

// // // // // // // // // // //         </View>

// // // // // // // // // // //         {/* ================= CONTENT ================= */}

// // // // // // // // // // //         <ScrollView
// // // // // // // // // // //           showsVerticalScrollIndicator={false}
// // // // // // // // // // //           contentContainerStyle={styles.scrollContent}
// // // // // // // // // // //         >

// // // // // // // // // // //           {/* ================= HERO ================= */}

// // // // // // // // // // //           <View style={styles.heroSection}>

// // // // // // // // // // //             <Text style={styles.smallGreeting}>
// // // // // // // // // // //               READY TO PLAY?
// // // // // // // // // // //             </Text>

// // // // // // // // // // //             <Text style={styles.heroTitle}>
// // // // // // // // // // //               Unscramble.
// // // // // // // // // // //               {"\n"}
// // // // // // // // // // //               <Text style={styles.heroAccent}>
// // // // // // // // // // //                 Outsmart.
// // // // // // // // // // //               </Text>
// // // // // // // // // // //             </Text>

// // // // // // // // // // //             <Text style={styles.heroDescription}>
// // // // // // // // // // //               Arrange the letters, find the hidden word,
// // // // // // // // // // //               and race against your friends.
// // // // // // // // // // //             </Text>

// // // // // // // // // // //           </View>

// // // // // // // // // // //           {/* ================= LETTER DISPLAY ================= */}

// // // // // // // // // // //           <View style={styles.lettersContainer}>

// // // // // // // // // // //             <View
// // // // // // // // // // //               style={[
// // // // // // // // // // //                 styles.letterTile,
// // // // // // // // // // //                 styles.tileYellow,
// // // // // // // // // // //                 styles.tileRotateLeft,
// // // // // // // // // // //               ]}
// // // // // // // // // // //             >
// // // // // // // // // // //               <Text style={styles.letterText}>W</Text>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <View
// // // // // // // // // // //               style={[
// // // // // // // // // // //                 styles.letterTile,
// // // // // // // // // // //                 styles.tileBlue,
// // // // // // // // // // //                 styles.tileRotateRight,
// // // // // // // // // // //               ]}
// // // // // // // // // // //             >
// // // // // // // // // // //               <Text style={styles.letterText}>O</Text>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <View
// // // // // // // // // // //               style={[
// // // // // // // // // // //                 styles.letterTile,
// // // // // // // // // // //                 styles.tilePink,
// // // // // // // // // // //               ]}
// // // // // // // // // // //             >
// // // // // // // // // // //               <Text style={styles.letterText}>R</Text>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <View
// // // // // // // // // // //               style={[
// // // // // // // // // // //                 styles.letterTile,
// // // // // // // // // // //                 styles.tileGreen,
// // // // // // // // // // //                 styles.tileRotateLeft,
// // // // // // // // // // //               ]}
// // // // // // // // // // //             >
// // // // // // // // // // //               <Text style={styles.letterText}>D</Text>
// // // // // // // // // // //             </View>

// // // // // // // // // // //           </View>

// // // // // // // // // // //           {/* ================= MAIN PLAY CARD ================= */}

// // // // // // // // // // //           <View style={styles.playCard}>

// // // // // // // // // // //             <View style={styles.playCardTop}>

// // // // // // // // // // //               <View style={styles.lightningCircle}>
// // // // // // // // // // //                 <Ionicons
// // // // // // // // // // //                   name="flash"
// // // // // // // // // // //                   size={21}
// // // // // // // // // // //                   color="#FFFFFF"
// // // // // // // // // // //                 />
// // // // // // // // // // //               </View>

// // // // // // // // // // //               <View style={{ flex: 1 }}>
// // // // // // // // // // //                 <Text style={styles.playCardTitle}>
// // // // // // // // // // //                   Quick Match
// // // // // // // // // // //                 </Text>

// // // // // // // // // // //                 <Text style={styles.playCardDescription}>
// // // // // // // // // // //                   Jump into a live word battle
// // // // // // // // // // //                 </Text>
// // // // // // // // // // //               </View>

// // // // // // // // // // //               <View style={styles.playersBadge}>
// // // // // // // // // // //                 <Ionicons
// // // // // // // // // // //                   name="people-outline"
// // // // // // // // // // //                   size={14}
// // // // // // // // // // //                   color="#3949AB"
// // // // // // // // // // //                 />

// // // // // // // // // // //                 <Text style={styles.playersBadgeText}>
// // // // // // // // // // //                   2–8
// // // // // // // // // // //                 </Text>
// // // // // // // // // // //               </View>

// // // // // // // // // // //             </View>

// // // // // // // // // // //             <TouchableOpacity
// // // // // // // // // // //               activeOpacity={0.88}
// // // // // // // // // // //               onPress={onPlayOnline}
// // // // // // // // // // //               style={styles.playButton}
// // // // // // // // // // //             >
// // // // // // // // // // //               <Text style={styles.playButtonText}>
// // // // // // // // // // //                 PLAY ONLINE
// // // // // // // // // // //               </Text>

// // // // // // // // // // //               <View style={styles.playArrow}>
// // // // // // // // // // //                 <Ionicons
// // // // // // // // // // //                   name="arrow-forward"
// // // // // // // // // // //                   size={19}
// // // // // // // // // // //                   color="#FFFFFF"
// // // // // // // // // // //                 />
// // // // // // // // // // //               </View>
// // // // // // // // // // //             </TouchableOpacity>

// // // // // // // // // // //           </View>

// // // // // // // // // // //           {/* ================= ROOM SECTION ================= */}

// // // // // // // // // // //           <View style={styles.sectionHeader}>

// // // // // // // // // // //             <View>
// // // // // // // // // // //               <Text style={styles.sectionTitle}>
// // // // // // // // // // //                 Play with friends
// // // // // // // // // // //               </Text>

// // // // // // // // // // //               <Text style={styles.sectionSubtitle}>
// // // // // // // // // // //                 Create or join a private room
// // // // // // // // // // //               </Text>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <Ionicons
// // // // // // // // // // //               name="people-circle-outline"
// // // // // // // // // // //               size={28}
// // // // // // // // // // //               color="#FF6B5A"
// // // // // // // // // // //             />

// // // // // // // // // // //           </View>

// // // // // // // // // // //           <View style={styles.roomContainer}>

// // // // // // // // // // //             {/* CREATE ROOM */}

// // // // // // // // // // //             <TouchableOpacity
// // // // // // // // // // //               activeOpacity={0.85}
// // // // // // // // // // //               onPress={onCreateRoom}
// // // // // // // // // // //               style={styles.createRoomCard}
// // // // // // // // // // //             >

// // // // // // // // // // //               <View style={styles.roomIconCreate}>
// // // // // // // // // // //                 <Ionicons
// // // // // // // // // // //                   name="add"
// // // // // // // // // // //                   size={24}
// // // // // // // // // // //                   color="#FFFFFF"
// // // // // // // // // // //                 />
// // // // // // // // // // //               </View>

// // // // // // // // // // //               <Text style={styles.roomCardTitle}>
// // // // // // // // // // //                 Create Room
// // // // // // // // // // //               </Text>

// // // // // // // // // // //               <Text style={styles.roomCardText}>
// // // // // // // // // // //                 Start a new game
// // // // // // // // // // //               </Text>

// // // // // // // // // // //               <View style={styles.roomArrow}>
// // // // // // // // // // //                 <Ionicons
// // // // // // // // // // //                   name="arrow-forward"
// // // // // // // // // // //                   size={16}
// // // // // // // // // // //                   color="#FF6B5A"
// // // // // // // // // // //                 />
// // // // // // // // // // //               </View>

// // // // // // // // // // //             </TouchableOpacity>

// // // // // // // // // // //             {/* JOIN ROOM */}

// // // // // // // // // // //             <View style={styles.joinRoomCard}>

// // // // // // // // // // //               <View style={styles.roomIconJoin}>
// // // // // // // // // // //                 <Ionicons
// // // // // // // // // // //                   name="enter-outline"
// // // // // // // // // // //                   size={22}
// // // // // // // // // // //                   color="#FFFFFF"
// // // // // // // // // // //                 />
// // // // // // // // // // //               </View>

// // // // // // // // // // //               <Text style={styles.roomCardTitle}>
// // // // // // // // // // //                 Join Room
// // // // // // // // // // //               </Text>

// // // // // // // // // // //               <Text style={styles.roomCardText}>
// // // // // // // // // // //                 Enter room code
// // // // // // // // // // //               </Text>

// // // // // // // // // // //               <View style={styles.joinInputRow}>

// // // // // // // // // // //                 <TextInput
// // // // // // // // // // //                   value={joinCode}
// // // // // // // // // // //                   onChangeText={setJoinCode}
// // // // // // // // // // //                   placeholder="ROOM CODE"
// // // // // // // // // // //                   placeholderTextColor="#9A9A9A"
// // // // // // // // // // //                   autoCapitalize="characters"
// // // // // // // // // // //                   maxLength={8}
// // // // // // // // // // //                   style={styles.joinInput}
// // // // // // // // // // //                 />

// // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // //                   activeOpacity={0.8}
// // // // // // // // // // //                   onPress={handleJoinRoom}
// // // // // // // // // // //                   style={styles.joinButton}
// // // // // // // // // // //                 >
// // // // // // // // // // //                   <Ionicons
// // // // // // // // // // //                     name="arrow-forward"
// // // // // // // // // // //                     size={18}
// // // // // // // // // // //                     color="#FFFFFF"
// // // // // // // // // // //                   />
// // // // // // // // // // //                 </TouchableOpacity>

// // // // // // // // // // //               </View>

// // // // // // // // // // //             </View>

// // // // // // // // // // //           </View>

// // // // // // // // // // //           {/* ================= DAILY CHALLENGE ================= */}

// // // // // // // // // // //           <View style={styles.challengeCard}>

// // // // // // // // // // //             <View style={styles.challengeLeft}>

// // // // // // // // // // //               <View style={styles.challengeIcon}>
// // // // // // // // // // //                 <Ionicons
// // // // // // // // // // //                   name="trophy"
// // // // // // // // // // //                   size={23}
// // // // // // // // // // //                   color="#FFFFFF"
// // // // // // // // // // //                 />
// // // // // // // // // // //               </View>

// // // // // // // // // // //               <View>
// // // // // // // // // // //                 <Text style={styles.challengeTitle}>
// // // // // // // // // // //                   Daily Challenge
// // // // // // // // // // //                 </Text>

// // // // // // // // // // //                 <Text style={styles.challengeText}>
// // // // // // // // // // //                   Solve today's puzzle
// // // // // // // // // // //                 </Text>
// // // // // // // // // // //               </View>

// // // // // // // // // // //             </View>

// // // // // // // // // // //             <View style={styles.challengeProgress}>

// // // // // // // // // // //               <Text style={styles.progressNumber}>
// // // // // // // // // // //                 3/5
// // // // // // // // // // //               </Text>

// // // // // // // // // // //               <Text style={styles.progressText}>
// // // // // // // // // // //                 rounds
// // // // // // // // // // //               </Text>

// // // // // // // // // // //             </View>

// // // // // // // // // // //           </View>

// // // // // // // // // // //           {/* ================= LEADERBOARD ================= */}

// // // // // // // // // // //           <View style={styles.leaderHeader}>

// // // // // // // // // // //             <View>
// // // // // // // // // // //               <Text style={styles.sectionTitle}>
// // // // // // // // // // //                 Top Players
// // // // // // // // // // //               </Text>

// // // // // // // // // // //               <Text style={styles.sectionSubtitle}>
// // // // // // // // // // //                 Today's leaderboard
// // // // // // // // // // //               </Text>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <TouchableOpacity
// // // // // // // // // // //               activeOpacity={0.7}
// // // // // // // // // // //               onPress={onViewAllPlayers}
// // // // // // // // // // //             >
// // // // // // // // // // //               <Text style={styles.viewAll}>
// // // // // // // // // // //                 View all
// // // // // // // // // // //               </Text>
// // // // // // // // // // //             </TouchableOpacity>

// // // // // // // // // // //           </View>

// // // // // // // // // // //           <View style={styles.leaderboardCard}>

// // // // // // // // // // //             {topPlayers.length === 0 ? (

// // // // // // // // // // //               <View style={styles.emptyLeaderboard}>

// // // // // // // // // // //                 <Ionicons
// // // // // // // // // // //                   name="trophy-outline"
// // // // // // // // // // //                   size={28}
// // // // // // // // // // //                   color="#B0B0B0"
// // // // // // // // // // //                 />

// // // // // // // // // // //                 <Text style={styles.emptyText}>
// // // // // // // // // // //                   No players yet
// // // // // // // // // // //                 </Text>

// // // // // // // // // // //               </View>

// // // // // // // // // // //             ) : (

// // // // // // // // // // //               topPlayers.map((player, index) => (

// // // // // // // // // // //                 <View
// // // // // // // // // // //                   key={`${player.rank}-${player.name}`}
// // // // // // // // // // //                   style={[
// // // // // // // // // // //                     styles.playerRow,
// // // // // // // // // // //                     index === topPlayers.length - 1 &&
// // // // // // // // // // //                       styles.lastPlayerRow,
// // // // // // // // // // //                   ]}
// // // // // // // // // // //                 >

// // // // // // // // // // //                   {/* RANK */}

// // // // // // // // // // //                   <View
// // // // // // // // // // //                     style={[
// // // // // // // // // // //                       styles.rankCircle,
// // // // // // // // // // //                       player.rank === 1 &&
// // // // // // // // // // //                         styles.rankFirst,
// // // // // // // // // // //                       player.rank === 2 &&
// // // // // // // // // // //                         styles.rankSecond,
// // // // // // // // // // //                       player.rank === 3 &&
// // // // // // // // // // //                         styles.rankThird,
// // // // // // // // // // //                     ]}
// // // // // // // // // // //                   >
// // // // // // // // // // //                     <Text style={styles.rankText}>
// // // // // // // // // // //                       {player.rank}
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                   </View>

// // // // // // // // // // //                   {/* AVATAR */}

// // // // // // // // // // //                   <View
// // // // // // // // // // //                     style={[
// // // // // // // // // // //                       styles.playerAvatar,
// // // // // // // // // // //                       {
// // // // // // // // // // //                         backgroundColor:
// // // // // // // // // // //                           player.avatarColor || "#FF6B5A",
// // // // // // // // // // //                       },
// // // // // // // // // // //                     ]}
// // // // // // // // // // //                   >
// // // // // // // // // // //                     <Ionicons
// // // // // // // // // // //                       name="person"
// // // // // // // // // // //                       size={17}
// // // // // // // // // // //                       color="#FFFFFF"
// // // // // // // // // // //                     />
// // // // // // // // // // //                   </View>

// // // // // // // // // // //                   {/* NAME */}

// // // // // // // // // // //                   <View style={styles.playerInfo}>

// // // // // // // // // // //                     <Text style={styles.playerName}>
// // // // // // // // // // //                       {player.name}
// // // // // // // // // // //                     </Text>

// // // // // // // // // // //                     {player.rank === 1 && (
// // // // // // // // // // //                       <Text style={styles.topPlayerLabel}>
// // // // // // // // // // //                         TOP PLAYER
// // // // // // // // // // //                       </Text>
// // // // // // // // // // //                     )}

// // // // // // // // // // //                   </View>

// // // // // // // // // // //                   {/* SCORE */}

// // // // // // // // // // //                   <View style={styles.scoreContainer}>

// // // // // // // // // // //                     <Text style={styles.scoreNumber}>
// // // // // // // // // // //                       {player.score}
// // // // // // // // // // //                     </Text>

// // // // // // // // // // //                     <Text style={styles.scoreLabel}>
// // // // // // // // // // //                       PTS
// // // // // // // // // // //                     </Text>

// // // // // // // // // // //                   </View>

// // // // // // // // // // //                 </View>

// // // // // // // // // // //               ))

// // // // // // // // // // //             )}

// // // // // // // // // // //           </View>

// // // // // // // // // // //           {/* Bottom spacing */}

// // // // // // // // // // //           <View style={{ height: 100 }} />

// // // // // // // // // // //         </ScrollView>

// // // // // // // // // // //         {/* ================= BOTTOM NAV ================= */}

// // // // // // // // // // //         <View style={styles.bottomNav}>

// // // // // // // // // // //           <TouchableOpacity
// // // // // // // // // // //             style={styles.navItem}
// // // // // // // // // // //             activeOpacity={0.8}
// // // // // // // // // // //             onPress={onTabHome}
// // // // // // // // // // //           >

// // // // // // // // // // //             <View style={styles.activeNavIcon}>
// // // // // // // // // // //               <Ionicons
// // // // // // // // // // //                 name="home"
// // // // // // // // // // //                 size={20}
// // // // // // // // // // //                 color="#FFFFFF"
// // // // // // // // // // //               />
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <Text style={styles.activeNavText}>
// // // // // // // // // // //               Home
// // // // // // // // // // //             </Text>

// // // // // // // // // // //           </TouchableOpacity>

// // // // // // // // // // //           <TouchableOpacity
// // // // // // // // // // //             style={styles.navItem}
// // // // // // // // // // //             activeOpacity={0.8}
// // // // // // // // // // //             onPress={onTabLeaderboard}
// // // // // // // // // // //           >

// // // // // // // // // // //             <Ionicons
// // // // // // // // // // //               name="trophy-outline"
// // // // // // // // // // //               size={21}
// // // // // // // // // // //               color="#8C8C8C"
// // // // // // // // // // //             />

// // // // // // // // // // //             <Text style={styles.navText}>
// // // // // // // // // // //               Rankings
// // // // // // // // // // //             </Text>

// // // // // // // // // // //           </TouchableOpacity>

// // // // // // // // // // //           <TouchableOpacity
// // // // // // // // // // //             style={styles.navItem}
// // // // // // // // // // //             activeOpacity={0.8}
// // // // // // // // // // //             onPress={onTabProfile}
// // // // // // // // // // //           >

// // // // // // // // // // //             <Ionicons
// // // // // // // // // // //               name="person-outline"
// // // // // // // // // // //               size={21}
// // // // // // // // // // //               color="#8C8C8C"
// // // // // // // // // // //             />

// // // // // // // // // // //             <Text style={styles.navText}>
// // // // // // // // // // //               Profile
// // // // // // // // // // //             </Text>

// // // // // // // // // // //           </TouchableOpacity>

// // // // // // // // // // //         </View>

// // // // // // // // // // //       </View>
// // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // export default WordScrambleHomeScreen;

// // // // // // // // // // // /* =========================================================
// // // // // // // // // // //    STYLES
// // // // // // // // // // // ========================================================= */

// // // // // // // // // // // const styles = StyleSheet.create({

// // // // // // // // // // //   safeArea: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     backgroundColor: "#FFF9F0",
// // // // // // // // // // //   },

// // // // // // // // // // //   container: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     backgroundColor: "#FFF9F0",
// // // // // // // // // // //   },

// // // // // // // // // // //   /* ================= HEADER ================= */

// // // // // // // // // // //   header: {
// // // // // // // // // // //     height: 76,
// // // // // // // // // // //     paddingHorizontal: 20,
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // // //     backgroundColor: "#FFF9F0",
// // // // // // // // // // //   },

// // // // // // // // // // //   brandArea: {
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //   },

// // // // // // // // // // //   wordLogo: {
// // // // // // // // // // //     width: 46,
// // // // // // // // // // //     height: 46,
// // // // // // // // // // //     borderRadius: 14,
// // // // // // // // // // //     backgroundColor: "#1E293B",
// // // // // // // // // // //     marginRight: 11,
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     transform: [{ rotate: "-5deg" }],
// // // // // // // // // // //   },

// // // // // // // // // // //   logoW: {
// // // // // // // // // // //     color: "#FFD166",
// // // // // // // // // // //     fontSize: 18,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //   },

// // // // // // // // // // //   logoS: {
// // // // // // // // // // //     color: "#FF6B5A",
// // // // // // // // // // //     fontSize: 18,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //   },

// // // // // // // // // // //   brandTitle: {
// // // // // // // // // // //     color: "#172033",
// // // // // // // // // // //     fontSize: 18,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //   },

// // // // // // // // // // //   fakeSpan: {
// // // // // // // // // // //     color: "#172033",
// // // // // // // // // // //   },

// // // // // // // // // // //   brandTitleAccent: {
// // // // // // // // // // //     color: "#FF6B5A",
// // // // // // // // // // //   },

// // // // // // // // // // //   brandSubtitle: {
// // // // // // // // // // //     marginTop: 2,
// // // // // // // // // // //     color: "#858B96",
// // // // // // // // // // //     fontSize: 10.5,
// // // // // // // // // // //     fontWeight: "600",
// // // // // // // // // // //   },

// // // // // // // // // // //   notificationButton: {
// // // // // // // // // // //     width: 42,
// // // // // // // // // // //     height: 42,
// // // // // // // // // // //     borderRadius: 21,
// // // // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: "#EFE7DC",
// // // // // // // // // // //   },

// // // // // // // // // // //   /* ================= SCROLL ================= */

// // // // // // // // // // //   scrollContent: {
// // // // // // // // // // //     paddingHorizontal: 18,
// // // // // // // // // // //     paddingTop: 8,
// // // // // // // // // // //   },

// // // // // // // // // // //   /* ================= HERO ================= */

// // // // // // // // // // //   heroSection: {
// // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // //   },

// // // // // // // // // // //   smallGreeting: {
// // // // // // // // // // //     color: "#FF6B5A",
// // // // // // // // // // //     fontSize: 11,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //     letterSpacing: 1.4,
// // // // // // // // // // //     marginBottom: 5,
// // // // // // // // // // //   },

// // // // // // // // // // //   heroTitle: {
// // // // // // // // // // //     color: "#172033",
// // // // // // // // // // //     fontSize: 36,
// // // // // // // // // // //     lineHeight: 39,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //     letterSpacing: -1,
// // // // // // // // // // //   },

// // // // // // // // // // //   heroAccent: {
// // // // // // // // // // //     color: "#4F46E5",
// // // // // // // // // // //   },

// // // // // // // // // // //   heroDescription: {
// // // // // // // // // // //     color: "#747B88",
// // // // // // // // // // //     fontSize: 13,
// // // // // // // // // // //     lineHeight: 19,
// // // // // // // // // // //     marginTop: 9,
// // // // // // // // // // //     maxWidth: 320,
// // // // // // // // // // //   },

// // // // // // // // // // //   /* ================= LETTERS ================= */

// // // // // // // // // // //   lettersContainer: {
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //     marginTop: 21,
// // // // // // // // // // //     marginBottom: 22,
// // // // // // // // // // //     gap: 8,
// // // // // // // // // // //   },

// // // // // // // // // // //   letterTile: {
// // // // // // // // // // //     width: 52,
// // // // // // // // // // //     height: 52,
// // // // // // // // // // //     borderRadius: 13,
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //     shadowColor: "#000",
// // // // // // // // // // //     shadowOffset: {
// // // // // // // // // // //       width: 0,
// // // // // // // // // // //       height: 4,
// // // // // // // // // // //     },
// // // // // // // // // // //     shadowOpacity: 0.12,
// // // // // // // // // // //     shadowRadius: 6,
// // // // // // // // // // //     elevation: 3,
// // // // // // // // // // //   },

// // // // // // // // // // //   letterText: {
// // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // //     fontSize: 23,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //   },

// // // // // // // // // // //   tileYellow: {
// // // // // // // // // // //     backgroundColor: "#F4B942",
// // // // // // // // // // //   },

// // // // // // // // // // //   tileBlue: {
// // // // // // // // // // //     backgroundColor: "#3B82F6",
// // // // // // // // // // //   },

// // // // // // // // // // //   tilePink: {
// // // // // // // // // // //     backgroundColor: "#F15B6C",
// // // // // // // // // // //   },

// // // // // // // // // // //   tileGreen: {
// // // // // // // // // // //     backgroundColor: "#26B67A",
// // // // // // // // // // //   },

// // // // // // // // // // //   tileRotateLeft: {
// // // // // // // // // // //     transform: [{ rotate: "-6deg" }],
// // // // // // // // // // //   },

// // // // // // // // // // //   tileRotateRight: {
// // // // // // // // // // //     transform: [{ rotate: "6deg" }],
// // // // // // // // // // //   },

// // // // // // // // // // //   /* ================= PLAY CARD ================= */

// // // // // // // // // // //   playCard: {
// // // // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // // // //     borderRadius: 22,
// // // // // // // // // // //     padding: 17,
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: "#EEE7DD",
// // // // // // // // // // //     shadowColor: "#000",
// // // // // // // // // // //     shadowOffset: {
// // // // // // // // // // //       width: 0,
// // // // // // // // // // //       height: 7,
// // // // // // // // // // //     },
// // // // // // // // // // //     shadowOpacity: 0.07,
// // // // // // // // // // //     shadowRadius: 14,
// // // // // // // // // // //     elevation: 3,
// // // // // // // // // // //   },

// // // // // // // // // // //   playCardTop: {
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     marginBottom: 16,
// // // // // // // // // // //   },

// // // // // // // // // // //   lightningCircle: {
// // // // // // // // // // //     width: 43,
// // // // // // // // // // //     height: 43,
// // // // // // // // // // //     borderRadius: 14,
// // // // // // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //     marginRight: 12,
// // // // // // // // // // //   },

// // // // // // // // // // //   playCardTitle: {
// // // // // // // // // // //     color: "#172033",
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //   },

// // // // // // // // // // //   playCardDescription: {
// // // // // // // // // // //     color: "#8A909A",
// // // // // // // // // // //     fontSize: 11.5,
// // // // // // // // // // //     marginTop: 3,
// // // // // // // // // // //   },

// // // // // // // // // // //   playersBadge: {
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     gap: 4,
// // // // // // // // // // //     backgroundColor: "#EEF1FF",
// // // // // // // // // // //     paddingHorizontal: 9,
// // // // // // // // // // //     paddingVertical: 6,
// // // // // // // // // // //     borderRadius: 10,
// // // // // // // // // // //   },

// // // // // // // // // // //   playersBadgeText: {
// // // // // // // // // // //     color: "#3949AB",
// // // // // // // // // // //     fontSize: 10,
// // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // //   },

// // // // // // // // // // //   playButton: {
// // // // // // // // // // //     height: 53,
// // // // // // // // // // //     borderRadius: 15,
// // // // // // // // // // //     backgroundColor: "#4F46E5",
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //   },

// // // // // // // // // // //   playButtonText: {
// // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //     letterSpacing: 0.8,
// // // // // // // // // // //   },

// // // // // // // // // // //   playArrow: {
// // // // // // // // // // //     width: 29,
// // // // // // // // // // //     height: 29,
// // // // // // // // // // //     borderRadius: 10,
// // // // // // // // // // //     backgroundColor: "rgba(255,255,255,0.18)",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //     marginLeft: 12,
// // // // // // // // // // //   },

// // // // // // // // // // //   /* ================= SECTION ================= */

// // // // // // // // // // //   sectionHeader: {
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // // //     marginTop: 27,
// // // // // // // // // // //     marginBottom: 13,
// // // // // // // // // // //   },

// // // // // // // // // // //   sectionTitle: {
// // // // // // // // // // //     color: "#172033",
// // // // // // // // // // //     fontSize: 17,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //   },

// // // // // // // // // // //   sectionSubtitle: {
// // // // // // // // // // //     color: "#9297A0",
// // // // // // // // // // //     fontSize: 11,
// // // // // // // // // // //     marginTop: 3,
// // // // // // // // // // //   },

// // // // // // // // // // //   /* ================= ROOM ================= */

// // // // // // // // // // //   roomContainer: {
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     gap: 11,
// // // // // // // // // // //   },

// // // // // // // // // // //   createRoomCard: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     minHeight: 157,
// // // // // // // // // // //     borderRadius: 19,
// // // // // // // // // // //     backgroundColor: "#FFF0EB",
// // // // // // // // // // //     padding: 14,
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: "#FFE0D8",
// // // // // // // // // // //   },

// // // // // // // // // // //   joinRoomCard: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     minHeight: 157,
// // // // // // // // // // //     borderRadius: 19,
// // // // // // // // // // //     backgroundColor: "#EEF0FF",
// // // // // // // // // // //     padding: 14,
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: "#DDE1FF",
// // // // // // // // // // //   },

// // // // // // // // // // //   roomIconCreate: {
// // // // // // // // // // //     width: 38,
// // // // // // // // // // //     height: 38,
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //     marginBottom: 10,
// // // // // // // // // // //   },

// // // // // // // // // // //   roomIconJoin: {
// // // // // // // // // // //     width: 38,
// // // // // // // // // // //     height: 38,
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     backgroundColor: "#4F46E5",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //     marginBottom: 10,
// // // // // // // // // // //   },

// // // // // // // // // // //   roomCardTitle: {
// // // // // // // // // // //     color: "#172033",
// // // // // // // // // // //     fontSize: 13,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //   },

// // // // // // // // // // //   roomCardText: {
// // // // // // // // // // //     color: "#858B96",
// // // // // // // // // // //     fontSize: 10.5,
// // // // // // // // // // //     marginTop: 3,
// // // // // // // // // // //   },

// // // // // // // // // // //   roomArrow: {
// // // // // // // // // // //     position: "absolute",
// // // // // // // // // // //     right: 13,
// // // // // // // // // // //     top: 17,
// // // // // // // // // // //   },

// // // // // // // // // // //   joinInputRow: {
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     marginTop: 10,
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //   },

// // // // // // // // // // //   joinInput: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     height: 34,
// // // // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // // // //     borderRadius: 9,
// // // // // // // // // // //     paddingHorizontal: 8,
// // // // // // // // // // //     color: "#172033",
// // // // // // // // // // //     fontSize: 9,
// // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: "#DDE1FF",
// // // // // // // // // // //   },

// // // // // // // // // // //   joinButton: {
// // // // // // // // // // //     width: 34,
// // // // // // // // // // //     height: 34,
// // // // // // // // // // //     borderRadius: 9,
// // // // // // // // // // //     backgroundColor: "#4F46E5",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //     marginLeft: 5,
// // // // // // // // // // //   },

// // // // // // // // // // //   /* ================= DAILY CHALLENGE ================= */

// // // // // // // // // // //   challengeCard: {
// // // // // // // // // // //     marginTop: 22,
// // // // // // // // // // //     borderRadius: 18,
// // // // // // // // // // //     backgroundColor: "#172033",
// // // // // // // // // // //     padding: 15,
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // // //   },

// // // // // // // // // // //   challengeLeft: {
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //   },

// // // // // // // // // // //   challengeIcon: {
// // // // // // // // // // //     width: 42,
// // // // // // // // // // //     height: 42,
// // // // // // // // // // //     borderRadius: 13,
// // // // // // // // // // //     backgroundColor: "#F4B942",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //     marginRight: 11,
// // // // // // // // // // //   },

// // // // // // // // // // //   challengeTitle: {
// // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // //     fontSize: 13,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //   },

// // // // // // // // // // //   challengeText: {
// // // // // // // // // // //     color: "#AAB1C0",
// // // // // // // // // // //     fontSize: 10.5,
// // // // // // // // // // //     marginTop: 3,
// // // // // // // // // // //   },

// // // // // // // // // // //   challengeProgress: {
// // // // // // // // // // //     alignItems: "flex-end",
// // // // // // // // // // //   },

// // // // // // // // // // //   progressNumber: {
// // // // // // // // // // //     color: "#FFD166",
// // // // // // // // // // //     fontSize: 17,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //   },

// // // // // // // // // // //   progressText: {
// // // // // // // // // // //     color: "#8E97A9",
// // // // // // // // // // //     fontSize: 9,
// // // // // // // // // // //     marginTop: 1,
// // // // // // // // // // //   },

// // // // // // // // // // //   /* ================= LEADERBOARD ================= */

// // // // // // // // // // //   leaderHeader: {
// // // // // // // // // // //     marginTop: 27,
// // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //   },

// // // // // // // // // // //   viewAll: {
// // // // // // // // // // //     color: "#4F46E5",
// // // // // // // // // // //     fontSize: 11,
// // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // //   },

// // // // // // // // // // //   leaderboardCard: {
// // // // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // // // //     borderRadius: 19,
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: "#EEE7DD",
// // // // // // // // // // //     paddingHorizontal: 13,
// // // // // // // // // // //     overflow: "hidden",
// // // // // // // // // // //   },

// // // // // // // // // // //   playerRow: {
// // // // // // // // // // //     minHeight: 64,
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // // //     borderBottomColor: "#F1EEE8",
// // // // // // // // // // //   },

// // // // // // // // // // //   lastPlayerRow: {
// // // // // // // // // // //     borderBottomWidth: 0,
// // // // // // // // // // //   },

// // // // // // // // // // //   rankCircle: {
// // // // // // // // // // //     width: 27,
// // // // // // // // // // //     height: 27,
// // // // // // // // // // //     borderRadius: 9,
// // // // // // // // // // //     backgroundColor: "#F0F0F0",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //     marginRight: 9,
// // // // // // // // // // //   },

// // // // // // // // // // //   rankFirst: {
// // // // // // // // // // //     backgroundColor: "#FFF0B8",
// // // // // // // // // // //   },

// // // // // // // // // // //   rankSecond: {
// // // // // // // // // // //     backgroundColor: "#E8E8E8",
// // // // // // // // // // //   },

// // // // // // // // // // //   rankThird: {
// // // // // // // // // // //     backgroundColor: "#F5D6C7",
// // // // // // // // // // //   },

// // // // // // // // // // //   rankText: {
// // // // // // // // // // //     color: "#59606C",
// // // // // // // // // // //     fontSize: 11,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //   },

// // // // // // // // // // //   playerAvatar: {
// // // // // // // // // // //     width: 37,
// // // // // // // // // // //     height: 37,
// // // // // // // // // // //     borderRadius: 13,
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //     marginRight: 10,
// // // // // // // // // // //   },

// // // // // // // // // // //   playerInfo: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //   },

// // // // // // // // // // //   playerName: {
// // // // // // // // // // //     color: "#202838",
// // // // // // // // // // //     fontSize: 13,
// // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // //   },

// // // // // // // // // // //   topPlayerLabel: {
// // // // // // // // // // //     color: "#FF6B5A",
// // // // // // // // // // //     fontSize: 8,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //     marginTop: 2,
// // // // // // // // // // //     letterSpacing: 0.6,
// // // // // // // // // // //   },

// // // // // // // // // // //   scoreContainer: {
// // // // // // // // // // //     alignItems: "flex-end",
// // // // // // // // // // //   },

// // // // // // // // // // //   scoreNumber: {
// // // // // // // // // // //     color: "#172033",
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //   },

// // // // // // // // // // //   scoreLabel: {
// // // // // // // // // // //     color: "#9CA1AA",
// // // // // // // // // // //     fontSize: 7,
// // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // //     marginTop: 1,
// // // // // // // // // // //   },

// // // // // // // // // // //   emptyLeaderboard: {
// // // // // // // // // // //     height: 110,
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //   },

// // // // // // // // // // //   emptyText: {
// // // // // // // // // // //     color: "#9A9A9A",
// // // // // // // // // // //     fontSize: 11,
// // // // // // // // // // //     marginTop: 7,
// // // // // // // // // // //   },

// // // // // // // // // // //   /* ================= BOTTOM NAV ================= */

// // // // // // // // // // //   bottomNav: {
// // // // // // // // // // //     height: 72,
// // // // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // // //     borderTopColor: "#EEE7DD",
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "space-around",
// // // // // // // // // // //     paddingBottom: 5,
// // // // // // // // // // //   },

// // // // // // // // // // //   navItem: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //   },

// // // // // // // // // // //   activeNavIcon: {
// // // // // // // // // // //     width: 37,
// // // // // // // // // // //     height: 32,
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     backgroundColor: "#4F46E5",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //   },

// // // // // // // // // // //   activeNavText: {
// // // // // // // // // // //     color: "#4F46E5",
// // // // // // // // // // //     fontSize: 9.5,
// // // // // // // // // // //     fontWeight: "900",
// // // // // // // // // // //     marginTop: 3,
// // // // // // // // // // //   },

// // // // // // // // // // //   navText: {
// // // // // // // // // // //     color: "#8C8C8C",
// // // // // // // // // // //     fontSize: 9.5,
// // // // // // // // // // //     fontWeight: "700",
// // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // //   },
// // // // // // // // // // // });
// // // // // // // // // // import React from "react";
// // // // // // // // // // import {
// // // // // // // // // //   View,
// // // // // // // // // //   Text,
// // // // // // // // // //   StyleSheet,
// // // // // // // // // //   TouchableOpacity,
// // // // // // // // // //   TextInput,
// // // // // // // // // //   ScrollView,
// // // // // // // // // //   SafeAreaView,
// // // // // // // // // //   StatusBar,
// // // // // // // // // //   useWindowDimensions,
// // // // // // // // // // } from "react-native";
// // // // // // // // // // import { Ionicons } from "@expo/vector-icons";

// // // // // // // // // // export interface TopPlayer {
// // // // // // // // // //   rank: number;
// // // // // // // // // //   name: string;
// // // // // // // // // //   score: number;
// // // // // // // // // //   avatarColor: string;
// // // // // // // // // // }

// // // // // // // // // // interface WordScrambleHomeScreenProps {
// // // // // // // // // //   topPlayers: TopPlayer[];

// // // // // // // // // //   onPlayOnline: () => void;
// // // // // // // // // //   onCreateRoom: () => void;
// // // // // // // // // //   onJoinRoom: (code: string) => void;
// // // // // // // // // //   onViewAllPlayers: () => void;

// // // // // // // // // //   onTabHome: () => void;
// // // // // // // // // //   onTabLeaderboard: () => void;
// // // // // // // // // //   onTabProfile: () => void;
// // // // // // // // // // }

// // // // // // // // // // const WordScrambleHomeScreen: React.FC<
// // // // // // // // // //   WordScrambleHomeScreenProps
// // // // // // // // // // > = ({
// // // // // // // // // //   topPlayers,
// // // // // // // // // //   onPlayOnline,
// // // // // // // // // //   onCreateRoom,
// // // // // // // // // //   onJoinRoom,
// // // // // // // // // //   onViewAllPlayers,
// // // // // // // // // //   onTabHome,
// // // // // // // // // //   onTabLeaderboard,
// // // // // // // // // //   onTabProfile,
// // // // // // // // // // }) => {
// // // // // // // // // //   const { width } = useWindowDimensions();

// // // // // // // // // //   const isMobile = width < 768;
// // // // // // // // // //   const isTablet = width >= 768 && width < 1100;

// // // // // // // // // //   const [joinCode, setJoinCode] = React.useState("");

// // // // // // // // // //   const handleJoinRoom = () => {
// // // // // // // // // //     const code = joinCode.trim();

// // // // // // // // // //     if (!code) {
// // // // // // // // // //       return;
// // // // // // // // // //     }

// // // // // // // // // //     onJoinRoom(code);
// // // // // // // // // //   };

// // // // // // // // // //   return (
// // // // // // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // // // // // //       <StatusBar
// // // // // // // // // //         barStyle="dark-content"
// // // // // // // // // //         backgroundColor="#FFF9F0"
// // // // // // // // // //       />

// // // // // // // // // //       <View style={styles.root}>

// // // // // // // // // //         {/* =====================================================
// // // // // // // // // //             DESKTOP SIDEBAR
// // // // // // // // // //         ===================================================== */}

// // // // // // // // // //         {!isMobile && (
// // // // // // // // // //           <View
// // // // // // // // // //             style={[
// // // // // // // // // //               styles.sidebar,
// // // // // // // // // //               isTablet && styles.sidebarTablet,
// // // // // // // // // //             ]}
// // // // // // // // // //           >
// // // // // // // // // //             {/* Brand */}

// // // // // // // // // //             <View style={styles.sidebarBrand}>
// // // // // // // // // //               <View style={styles.sidebarLogo}>
// // // // // // // // // //                 <Text style={styles.logoW}>W</Text>
// // // // // // // // // //                 <Text style={styles.logoS}>S</Text>
// // // // // // // // // //               </View>

// // // // // // // // // //               <View>
// // // // // // // // // //                 <Text style={styles.sidebarBrandTitle}>
// // // // // // // // // //                   Word
// // // // // // // // // //                   <Text style={styles.sidebarBrandAccent}>
// // // // // // // // // //                     {" "}Scramble
// // // // // // // // // //                   </Text>
// // // // // // // // // //                 </Text>

// // // // // // // // // //                 <Text style={styles.sidebarBrandSubtitle}>
// // // // // // // // // //                   Think fast. Play smart.
// // // // // // // // // //                 </Text>
// // // // // // // // // //               </View>
// // // // // // // // // //             </View>

// // // // // // // // // //             {/* Sidebar Navigation */}

// // // // // // // // // //             <View style={styles.sidebarNavigation}>

// // // // // // // // // //               <TouchableOpacity
// // // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // // //                 style={[
// // // // // // // // // //                   styles.sidebarNavItem,
// // // // // // // // // //                   styles.sidebarNavActive,
// // // // // // // // // //                 ]}
// // // // // // // // // //                 onPress={onTabHome}
// // // // // // // // // //               >
// // // // // // // // // //                 <View style={styles.sidebarActiveIcon}>
// // // // // // // // // //                   <Ionicons
// // // // // // // // // //                     name="home"
// // // // // // // // // //                     size={21}
// // // // // // // // // //                     color="#FFFFFF"
// // // // // // // // // //                   />
// // // // // // // // // //                 </View>

// // // // // // // // // //                 <Text style={styles.sidebarActiveText}>
// // // // // // // // // //                   Home
// // // // // // // // // //                 </Text>
// // // // // // // // // //               </TouchableOpacity>

// // // // // // // // // //               <TouchableOpacity
// // // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // // //                 style={styles.sidebarNavItem}
// // // // // // // // // //                 onPress={onTabLeaderboard}
// // // // // // // // // //               >
// // // // // // // // // //                 <Ionicons
// // // // // // // // // //                   name="trophy-outline"
// // // // // // // // // //                   size={22}
// // // // // // // // // //                   color="#657084"
// // // // // // // // // //                 />

// // // // // // // // // //                 <Text style={styles.sidebarText}>
// // // // // // // // // //                   Rankings
// // // // // // // // // //                 </Text>
// // // // // // // // // //               </TouchableOpacity>

// // // // // // // // // //               <TouchableOpacity
// // // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // // //                 style={styles.sidebarNavItem}
// // // // // // // // // //                 onPress={onTabProfile}
// // // // // // // // // //               >
// // // // // // // // // //                 <Ionicons
// // // // // // // // // //                   name="person-outline"
// // // // // // // // // //                   size={22}
// // // // // // // // // //                   color="#657084"
// // // // // // // // // //                 />

// // // // // // // // // //                 <Text style={styles.sidebarText}>
// // // // // // // // // //                   Profile
// // // // // // // // // //                 </Text>
// // // // // // // // // //               </TouchableOpacity>

// // // // // // // // // //             </View>

// // // // // // // // // //             {/* Sidebar Bottom Card */}

// // // // // // // // // //             <View style={styles.sidebarBottomCard}>
// // // // // // // // // //               <View style={styles.sidebarBottomIcon}>
// // // // // // // // // //                 <Ionicons
// // // // // // // // // //                   name="sparkles"
// // // // // // // // // //                   size={21}
// // // // // // // // // //                   color="#FFFFFF"
// // // // // // // // // //                 />
// // // // // // // // // //               </View>

// // // // // // // // // //               <Text style={styles.sidebarBottomTitle}>
// // // // // // // // // //                 Ready for a challenge?
// // // // // // // // // //               </Text>

// // // // // // // // // //               <Text style={styles.sidebarBottomText}>
// // // // // // // // // //                 Unscramble words and climb the rankings.
// // // // // // // // // //               </Text>
// // // // // // // // // //             </View>
// // // // // // // // // //           </View>
// // // // // // // // // //         )}

// // // // // // // // // //         {/* =====================================================
// // // // // // // // // //             MAIN CONTENT
// // // // // // // // // //         ===================================================== */}

// // // // // // // // // //         <View
// // // // // // // // // //           style={[
// // // // // // // // // //             styles.main,
// // // // // // // // // //             !isMobile && styles.mainDesktop,
// // // // // // // // // //           ]}
// // // // // // // // // //         >

// // // // // // // // // //           {/* ===================================================
// // // // // // // // // //               MOBILE HEADER
// // // // // // // // // //           =================================================== */}

// // // // // // // // // //           {isMobile && (
// // // // // // // // // //             <View style={styles.mobileHeader}>

// // // // // // // // // //               <View style={styles.mobileBrand}>
// // // // // // // // // //                 <View style={styles.mobileLogo}>
// // // // // // // // // //                   <Text style={styles.logoW}>W</Text>
// // // // // // // // // //                   <Text style={styles.logoS}>S</Text>
// // // // // // // // // //                 </View>

// // // // // // // // // //                 <View>
// // // // // // // // // //                   <Text style={styles.mobileBrandTitle}>
// // // // // // // // // //                     Word
// // // // // // // // // //                     <Text style={styles.mobileBrandAccent}>
// // // // // // // // // //                       {" "}Scramble
// // // // // // // // // //                     </Text>
// // // // // // // // // //                   </Text>

// // // // // // // // // //                   <Text style={styles.mobileBrandSubtitle}>
// // // // // // // // // //                     Think fast. Play smart.
// // // // // // // // // //                   </Text>
// // // // // // // // // //                 </View>
// // // // // // // // // //               </View>

// // // // // // // // // //               <TouchableOpacity
// // // // // // // // // //                 style={styles.mobileNotification}
// // // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // // //               >
// // // // // // // // // //                 <Ionicons
// // // // // // // // // //                   name="notifications-outline"
// // // // // // // // // //                   size={20}
// // // // // // // // // //                   color="#172033"
// // // // // // // // // //                 />
// // // // // // // // // //               </TouchableOpacity>

// // // // // // // // // //             </View>
// // // // // // // // // //           )}

// // // // // // // // // //           {/* ===================================================
// // // // // // // // // //               DESKTOP HEADER
// // // // // // // // // //           =================================================== */}

// // // // // // // // // //           {!isMobile && (
// // // // // // // // // //             <View style={styles.desktopTopHeader}>

// // // // // // // // // //               <View>
// // // // // // // // // //                 <Text style={styles.desktopWelcome}>
// // // // // // // // // //                   Welcome back!
// // // // // // // // // //                 </Text>

// // // // // // // // // //                 <Text style={styles.desktopWelcomeSub}>
// // // // // // // // // //                   Ready to play?
// // // // // // // // // //                 </Text>
// // // // // // // // // //               </View>

// // // // // // // // // //               <TouchableOpacity
// // // // // // // // // //                 style={styles.desktopNotification}
// // // // // // // // // //               >
// // // // // // // // // //                 <Ionicons
// // // // // // // // // //                   name="notifications-outline"
// // // // // // // // // //                   size={20}
// // // // // // // // // //                   color="#172033"
// // // // // // // // // //                 />
// // // // // // // // // //               </TouchableOpacity>

// // // // // // // // // //             </View>
// // // // // // // // // //           )}

// // // // // // // // // //           {/* ===================================================
// // // // // // // // // //               SCROLL CONTENT
// // // // // // // // // //           =================================================== */}

// // // // // // // // // //           <ScrollView
// // // // // // // // // //             showsVerticalScrollIndicator={false}
// // // // // // // // // //             horizontal={false}
// // // // // // // // // //             contentContainerStyle={[
// // // // // // // // // //               styles.scrollContent,
// // // // // // // // // //               isMobile && styles.scrollContentMobile,
// // // // // // // // // //               isTablet && styles.scrollContentTablet,
// // // // // // // // // //             ]}
// // // // // // // // // //           >

// // // // // // // // // //             {/* =================================================
// // // // // // // // // //                 HERO
// // // // // // // // // //             ================================================= */}

// // // // // // // // // //             <View
// // // // // // // // // //               style={[
// // // // // // // // // //                 styles.heroSection,
// // // // // // // // // //                 isMobile && styles.heroMobile,
// // // // // // // // // //               ]}
// // // // // // // // // //             >

// // // // // // // // // //               <Text style={styles.smallGreeting}>
// // // // // // // // // //                 READY TO PLAY?
// // // // // // // // // //               </Text>

// // // // // // // // // //               <Text
// // // // // // // // // //                 style={[
// // // // // // // // // //                   styles.heroTitle,
// // // // // // // // // //                   isMobile && styles.heroTitleMobile,
// // // // // // // // // //                 ]}
// // // // // // // // // //               >
// // // // // // // // // //                 Unscramble.
// // // // // // // // // //                 {"\n"}

// // // // // // // // // //                 <Text style={styles.heroAccent}>
// // // // // // // // // //                   Outsmart.
// // // // // // // // // //                 </Text>
// // // // // // // // // //               </Text>

// // // // // // // // // //               <Text
// // // // // // // // // //                 style={[
// // // // // // // // // //                   styles.heroDescription,
// // // // // // // // // //                   isMobile && styles.heroDescriptionMobile,
// // // // // // // // // //                 ]}
// // // // // // // // // //               >
// // // // // // // // // //                 Arrange the letters, find the hidden word,
// // // // // // // // // //                 and race against your friends.
// // // // // // // // // //               </Text>

// // // // // // // // // //             </View>

// // // // // // // // // //             {/* =================================================
// // // // // // // // // //                 WORD LETTERS
// // // // // // // // // //             ================================================= */}

// // // // // // // // // //             <View
// // // // // // // // // //               style={[
// // // // // // // // // //                 styles.lettersContainer,
// // // // // // // // // //                 isMobile && styles.lettersMobile,
// // // // // // // // // //               ]}
// // // // // // // // // //             >

// // // // // // // // // //               <View
// // // // // // // // // //                 style={[
// // // // // // // // // //                   styles.letterTile,
// // // // // // // // // //                   styles.tileYellow,
// // // // // // // // // //                   styles.tileRotateLeft,
// // // // // // // // // //                 ]}
// // // // // // // // // //               >
// // // // // // // // // //                 <Text style={styles.letterText}>W</Text>
// // // // // // // // // //               </View>

// // // // // // // // // //               <View
// // // // // // // // // //                 style={[
// // // // // // // // // //                   styles.letterTile,
// // // // // // // // // //                   styles.tileBlue,
// // // // // // // // // //                   styles.tileRotateRight,
// // // // // // // // // //                 ]}
// // // // // // // // // //               >
// // // // // // // // // //                 <Text style={styles.letterText}>O</Text>
// // // // // // // // // //               </View>

// // // // // // // // // //               <View
// // // // // // // // // //                 style={[
// // // // // // // // // //                   styles.letterTile,
// // // // // // // // // //                   styles.tilePink,
// // // // // // // // // //                 ]}
// // // // // // // // // //               >
// // // // // // // // // //                 <Text style={styles.letterText}>R</Text>
// // // // // // // // // //               </View>

// // // // // // // // // //               <View
// // // // // // // // // //                 style={[
// // // // // // // // // //                   styles.letterTile,
// // // // // // // // // //                   styles.tileGreen,
// // // // // // // // // //                   styles.tileRotateLeft,
// // // // // // // // // //                 ]}
// // // // // // // // // //               >
// // // // // // // // // //                 <Text style={styles.letterText}>D</Text>
// // // // // // // // // //               </View>

// // // // // // // // // //             </View>

// // // // // // // // // //             {/* =================================================
// // // // // // // // // //                 QUICK MATCH
// // // // // // // // // //             ================================================= */}

// // // // // // // // // //             <View
// // // // // // // // // //               style={[
// // // // // // // // // //                 styles.playCard,
// // // // // // // // // //                 isMobile && styles.playCardMobile,
// // // // // // // // // //               ]}
// // // // // // // // // //             >

// // // // // // // // // //               <View style={styles.playCardTop}>

// // // // // // // // // //                 <View style={styles.lightningCircle}>
// // // // // // // // // //                   <Ionicons
// // // // // // // // // //                     name="flash"
// // // // // // // // // //                     size={21}
// // // // // // // // // //                     color="#FFFFFF"
// // // // // // // // // //                   />
// // // // // // // // // //                 </View>

// // // // // // // // // //                 <View style={styles.playInfo}>
// // // // // // // // // //                   <Text style={styles.playCardTitle}>
// // // // // // // // // //                     Quick Match
// // // // // // // // // //                   </Text>

// // // // // // // // // //                   <Text style={styles.playCardDescription}>
// // // // // // // // // //                     Jump into a live word battle
// // // // // // // // // //                   </Text>
// // // // // // // // // //                 </View>

// // // // // // // // // //                 <View style={styles.playersBadge}>
// // // // // // // // // //                   <Ionicons
// // // // // // // // // //                     name="people-outline"
// // // // // // // // // //                     size={14}
// // // // // // // // // //                     color="#3949AB"
// // // // // // // // // //                   />

// // // // // // // // // //                   <Text style={styles.playersBadgeText}>
// // // // // // // // // //                     2–8
// // // // // // // // // //                   </Text>
// // // // // // // // // //                 </View>

// // // // // // // // // //               </View>

// // // // // // // // // //               {/* IMPORTANT:
// // // // // // // // // //                   Button no longer full screen.
// // // // // // // // // //                   Desktop = 320px
// // // // // // // // // //                   Mobile = 230px
// // // // // // // // // //               */}

// // // // // // // // // //               <TouchableOpacity
// // // // // // // // // //                 activeOpacity={0.88}
// // // // // // // // // //                 onPress={onPlayOnline}
// // // // // // // // // //                 style={[
// // // // // // // // // //                   styles.playButton,
// // // // // // // // // //                   isMobile && styles.playButtonMobile,
// // // // // // // // // //                 ]}
// // // // // // // // // //               >
// // // // // // // // // //                 <Text style={styles.playButtonText}>
// // // // // // // // // //                   PLAY ONLINE
// // // // // // // // // //                 </Text>

// // // // // // // // // //                 <View style={styles.playArrow}>
// // // // // // // // // //                   <Ionicons
// // // // // // // // // //                     name="arrow-forward"
// // // // // // // // // //                     size={18}
// // // // // // // // // //                     color="#FFFFFF"
// // // // // // // // // //                   />
// // // // // // // // // //                 </View>
// // // // // // // // // //               </TouchableOpacity>

// // // // // // // // // //             </View>

// // // // // // // // // //             {/* =================================================
// // // // // // // // // //                 PLAY WITH FRIENDS
// // // // // // // // // //             ================================================= */}

// // // // // // // // // //             <View style={styles.sectionHeader}>

// // // // // // // // // //               <View>
// // // // // // // // // //                 <Text style={styles.sectionTitle}>
// // // // // // // // // //                   Play with friends
// // // // // // // // // //                 </Text>

// // // // // // // // // //                 <Text style={styles.sectionSubtitle}>
// // // // // // // // // //                   Create or join a private room
// // // // // // // // // //                 </Text>
// // // // // // // // // //               </View>

// // // // // // // // // //               <Ionicons
// // // // // // // // // //                 name="people-circle-outline"
// // // // // // // // // //                 size={28}
// // // // // // // // // //                 color="#FF6B5A"
// // // // // // // // // //               />

// // // // // // // // // //             </View>

// // // // // // // // // //             {/* =================================================
// // // // // // // // // //                 ROOM CARDS
// // // // // // // // // //             ================================================= */}

// // // // // // // // // //             <View
// // // // // // // // // //               style={[
// // // // // // // // // //                 styles.roomContainer,
// // // // // // // // // //                 isMobile && styles.roomContainerMobile,
// // // // // // // // // //               ]}
// // // // // // // // // //             >

// // // // // // // // // //               {/* CREATE ROOM */}

// // // // // // // // // //               <TouchableOpacity
// // // // // // // // // //                 activeOpacity={0.85}
// // // // // // // // // //                 onPress={onCreateRoom}
// // // // // // // // // //                 style={[
// // // // // // // // // //                   styles.createRoomCard,
// // // // // // // // // //                   isMobile && styles.roomCardMobile,
// // // // // // // // // //                 ]}
// // // // // // // // // //               >

// // // // // // // // // //                 <View style={styles.roomIconCreate}>
// // // // // // // // // //                   <Ionicons
// // // // // // // // // //                     name="add"
// // // // // // // // // //                     size={24}
// // // // // // // // // //                     color="#FFFFFF"
// // // // // // // // // //                   />
// // // // // // // // // //                 </View>

// // // // // // // // // //                 <Text style={styles.roomCardTitle}>
// // // // // // // // // //                   Create Room
// // // // // // // // // //                 </Text>

// // // // // // // // // //                 <Text style={styles.roomCardText}>
// // // // // // // // // //                   Start a new game
// // // // // // // // // //                 </Text>

// // // // // // // // // //                 <View style={styles.roomArrow}>
// // // // // // // // // //                   <Ionicons
// // // // // // // // // //                     name="arrow-forward"
// // // // // // // // // //                     size={17}
// // // // // // // // // //                     color="#FF6B5A"
// // // // // // // // // //                   />
// // // // // // // // // //                 </View>

// // // // // // // // // //               </TouchableOpacity>

// // // // // // // // // //               {/* JOIN ROOM */}

// // // // // // // // // //               <View
// // // // // // // // // //                 style={[
// // // // // // // // // //                   styles.joinRoomCard,
// // // // // // // // // //                   isMobile && styles.roomCardMobile,
// // // // // // // // // //                 ]}
// // // // // // // // // //               >

// // // // // // // // // //                 <View style={styles.roomIconJoin}>
// // // // // // // // // //                   <Ionicons
// // // // // // // // // //                     name="enter-outline"
// // // // // // // // // //                     size={22}
// // // // // // // // // //                     color="#FFFFFF"
// // // // // // // // // //                   />
// // // // // // // // // //                 </View>

// // // // // // // // // //                 <Text style={styles.roomCardTitle}>
// // // // // // // // // //                   Join Room
// // // // // // // // // //                 </Text>

// // // // // // // // // //                 <Text style={styles.roomCardText}>
// // // // // // // // // //                   Enter room code
// // // // // // // // // //                 </Text>

// // // // // // // // // //                 <View style={styles.joinInputRow}>

// // // // // // // // // //                   <TextInput
// // // // // // // // // //                     value={joinCode}
// // // // // // // // // //                     onChangeText={setJoinCode}
// // // // // // // // // //                     placeholder="ROOM CODE"
// // // // // // // // // //                     placeholderTextColor="#9A9A9A"
// // // // // // // // // //                     autoCapitalize="characters"
// // // // // // // // // //                     maxLength={8}
// // // // // // // // // //                     style={styles.joinInput}
// // // // // // // // // //                   />

// // // // // // // // // //                   <TouchableOpacity
// // // // // // // // // //                     activeOpacity={0.8}
// // // // // // // // // //                     onPress={handleJoinRoom}
// // // // // // // // // //                     style={styles.joinButton}
// // // // // // // // // //                   >
// // // // // // // // // //                     <Ionicons
// // // // // // // // // //                       name="arrow-forward"
// // // // // // // // // //                       size={18}
// // // // // // // // // //                       color="#FFFFFF"
// // // // // // // // // //                     />
// // // // // // // // // //                   </TouchableOpacity>

// // // // // // // // // //                 </View>

// // // // // // // // // //               </View>

// // // // // // // // // //             </View>

// // // // // // // // // //             {/* =================================================
// // // // // // // // // //                 DAILY CHALLENGE
// // // // // // // // // //             ================================================= */}

// // // // // // // // // //             <View
// // // // // // // // // //               style={[
// // // // // // // // // //                 styles.challengeCard,
// // // // // // // // // //                 isMobile && styles.challengeCardMobile,
// // // // // // // // // //               ]}
// // // // // // // // // //             >

// // // // // // // // // //               <View style={styles.challengeLeft}>

// // // // // // // // // //                 <View style={styles.challengeIcon}>
// // // // // // // // // //                   <Ionicons
// // // // // // // // // //                     name="trophy"
// // // // // // // // // //                     size={22}
// // // // // // // // // //                     color="#FFFFFF"
// // // // // // // // // //                   />
// // // // // // // // // //                 </View>

// // // // // // // // // //                 <View style={styles.challengeInfo}>
// // // // // // // // // //                   <Text style={styles.challengeTitle}>
// // // // // // // // // //                     Daily Challenge
// // // // // // // // // //                   </Text>

// // // // // // // // // //                   <Text style={styles.challengeText}>
// // // // // // // // // //                     Solve today's puzzle
// // // // // // // // // //                   </Text>
// // // // // // // // // //                 </View>

// // // // // // // // // //               </View>

// // // // // // // // // //               <View style={styles.challengeProgress}>
// // // // // // // // // //                 <Text style={styles.progressNumber}>
// // // // // // // // // //                   3/5
// // // // // // // // // //                 </Text>

// // // // // // // // // //                 <Text style={styles.progressText}>
// // // // // // // // // //                   rounds
// // // // // // // // // //                 </Text>
// // // // // // // // // //               </View>

// // // // // // // // // //             </View>

// // // // // // // // // //             {/* =================================================
// // // // // // // // // //                 LEADERBOARD
// // // // // // // // // //             ================================================= */}

// // // // // // // // // //             <View style={styles.leaderHeader}>

// // // // // // // // // //               <View>
// // // // // // // // // //                 <Text style={styles.sectionTitle}>
// // // // // // // // // //                   Top Players
// // // // // // // // // //                 </Text>

// // // // // // // // // //                 <Text style={styles.sectionSubtitle}>
// // // // // // // // // //                   Today's leaderboard
// // // // // // // // // //                 </Text>
// // // // // // // // // //               </View>

// // // // // // // // // //               <TouchableOpacity
// // // // // // // // // //                 activeOpacity={0.7}
// // // // // // // // // //                 onPress={onViewAllPlayers}
// // // // // // // // // //               >
// // // // // // // // // //                 <Text style={styles.viewAll}>
// // // // // // // // // //                   View all
// // // // // // // // // //                 </Text>
// // // // // // // // // //               </TouchableOpacity>

// // // // // // // // // //             </View>

// // // // // // // // // //             <View style={styles.leaderboardCard}>

// // // // // // // // // //               {topPlayers.length === 0 ? (

// // // // // // // // // //                 <View style={styles.emptyLeaderboard}>

// // // // // // // // // //                   <Ionicons
// // // // // // // // // //                     name="trophy-outline"
// // // // // // // // // //                     size={28}
// // // // // // // // // //                     color="#B0B0B0"
// // // // // // // // // //                   />

// // // // // // // // // //                   <Text style={styles.emptyText}>
// // // // // // // // // //                     No players yet
// // // // // // // // // //                   </Text>

// // // // // // // // // //                 </View>

// // // // // // // // // //               ) : (

// // // // // // // // // //                 topPlayers.map((player, index) => (

// // // // // // // // // //                   <View
// // // // // // // // // //                     key={`${player.rank}-${player.name}`}
// // // // // // // // // //                     style={[
// // // // // // // // // //                       styles.playerRow,
// // // // // // // // // //                       index === topPlayers.length - 1 &&
// // // // // // // // // //                         styles.lastPlayerRow,
// // // // // // // // // //                     ]}
// // // // // // // // // //                   >

// // // // // // // // // //                     <View
// // // // // // // // // //                       style={[
// // // // // // // // // //                         styles.rankCircle,
// // // // // // // // // //                         player.rank === 1 &&
// // // // // // // // // //                           styles.rankFirst,
// // // // // // // // // //                         player.rank === 2 &&
// // // // // // // // // //                           styles.rankSecond,
// // // // // // // // // //                         player.rank === 3 &&
// // // // // // // // // //                           styles.rankThird,
// // // // // // // // // //                       ]}
// // // // // // // // // //                     >
// // // // // // // // // //                       <Text style={styles.rankText}>
// // // // // // // // // //                         {player.rank}
// // // // // // // // // //                       </Text>
// // // // // // // // // //                     </View>

// // // // // // // // // //                     <View
// // // // // // // // // //                       style={[
// // // // // // // // // //                         styles.playerAvatar,
// // // // // // // // // //                         {
// // // // // // // // // //                           backgroundColor:
// // // // // // // // // //                             player.avatarColor || "#FF6B5A",
// // // // // // // // // //                         },
// // // // // // // // // //                       ]}
// // // // // // // // // //                     >
// // // // // // // // // //                       <Ionicons
// // // // // // // // // //                         name="person"
// // // // // // // // // //                         size={17}
// // // // // // // // // //                         color="#FFFFFF"
// // // // // // // // // //                       />
// // // // // // // // // //                     </View>

// // // // // // // // // //                     <View style={styles.playerInfo}>

// // // // // // // // // //                       <Text style={styles.playerName}>
// // // // // // // // // //                         {player.name}
// // // // // // // // // //                       </Text>

// // // // // // // // // //                       {player.rank === 1 && (
// // // // // // // // // //                         <Text style={styles.topPlayerLabel}>
// // // // // // // // // //                           TOP PLAYER
// // // // // // // // // //                         </Text>
// // // // // // // // // //                       )}

// // // // // // // // // //                     </View>

// // // // // // // // // //                     <View style={styles.scoreContainer}>

// // // // // // // // // //                       <Text style={styles.scoreNumber}>
// // // // // // // // // //                         {player.score}
// // // // // // // // // //                       </Text>

// // // // // // // // // //                       <Text style={styles.scoreLabel}>
// // // // // // // // // //                         PTS
// // // // // // // // // //                       </Text>

// // // // // // // // // //                     </View>

// // // // // // // // // //                   </View>

// // // // // // // // // //                 ))

// // // // // // // // // //               )}

// // // // // // // // // //             </View>

// // // // // // // // // //             <View style={{ height: isMobile ? 90 : 40 }} />

// // // // // // // // // //           </ScrollView>

// // // // // // // // // //           {/* =================================================
// // // // // // // // // //               MOBILE BOTTOM NAV
// // // // // // // // // //           ================================================= */}

// // // // // // // // // //           {isMobile && (
// // // // // // // // // //             <View style={styles.bottomNav}>

// // // // // // // // // //               <TouchableOpacity
// // // // // // // // // //                 style={styles.navItem}
// // // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // // //                 onPress={onTabHome}
// // // // // // // // // //               >
// // // // // // // // // //                 <View style={styles.activeNavIcon}>
// // // // // // // // // //                   <Ionicons
// // // // // // // // // //                     name="home"
// // // // // // // // // //                     size={20}
// // // // // // // // // //                     color="#FFFFFF"
// // // // // // // // // //                   />
// // // // // // // // // //                 </View>

// // // // // // // // // //                 <Text style={styles.activeNavText}>
// // // // // // // // // //                   Home
// // // // // // // // // //                 </Text>
// // // // // // // // // //               </TouchableOpacity>

// // // // // // // // // //               <TouchableOpacity
// // // // // // // // // //                 style={styles.navItem}
// // // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // // //                 onPress={onTabLeaderboard}
// // // // // // // // // //               >
// // // // // // // // // //                 <Ionicons
// // // // // // // // // //                   name="trophy-outline"
// // // // // // // // // //                   size={21}
// // // // // // // // // //                   color="#8C8C8C"
// // // // // // // // // //                 />

// // // // // // // // // //                 <Text style={styles.navText}>
// // // // // // // // // //                   Rankings
// // // // // // // // // //                 </Text>
// // // // // // // // // //               </TouchableOpacity>

// // // // // // // // // //               <TouchableOpacity
// // // // // // // // // //                 style={styles.navItem}
// // // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // // //                 onPress={onTabProfile}
// // // // // // // // // //               >
// // // // // // // // // //                 <Ionicons
// // // // // // // // // //                   name="person-outline"
// // // // // // // // // //                   size={21}
// // // // // // // // // //                   color="#8C8C8C"
// // // // // // // // // //                 />

// // // // // // // // // //                 <Text style={styles.navText}>
// // // // // // // // // //                   Profile
// // // // // // // // // //                 </Text>
// // // // // // // // // //               </TouchableOpacity>

// // // // // // // // // //             </View>
// // // // // // // // // //           )}

// // // // // // // // // //         </View>
// // // // // // // // // //       </View>
// // // // // // // // // //     </SafeAreaView>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default WordScrambleHomeScreen;

// // // // // // // // // // /* ============================================================
// // // // // // // // // //    STYLES
// // // // // // // // // // ============================================================ */

// // // // // // // // // // const styles = StyleSheet.create({

// // // // // // // // // //   safeArea: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     backgroundColor: "#FFF9F0",
// // // // // // // // // //   },

// // // // // // // // // //   root: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     backgroundColor: "#FFF9F0",
// // // // // // // // // //   },

// // // // // // // // // //   /* ==========================================================
// // // // // // // // // //      SIDEBAR
// // // // // // // // // //   ========================================================== */

// // // // // // // // // //   sidebar: {
// // // // // // // // // //     width: 292,
// // // // // // // // // //     backgroundColor: "#FFFDF9",
// // // // // // // // // //     borderRightWidth: 1,
// // // // // // // // // //     borderRightColor: "#EDE5D9",
// // // // // // // // // //     paddingHorizontal: 19,
// // // // // // // // // //     paddingTop: 22,
// // // // // // // // // //     paddingBottom: 18,
// // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // //   },

// // // // // // // // // //   sidebarTablet: {
// // // // // // // // // //     width: 245,
// // // // // // // // // //   },

// // // // // // // // // //   sidebarBrand: {
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //   },

// // // // // // // // // //   sidebarLogo: {
// // // // // // // // // //     width: 58,
// // // // // // // // // //     height: 58,
// // // // // // // // // //     borderRadius: 17,
// // // // // // // // // //     backgroundColor: "#172033",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     marginRight: 11,
// // // // // // // // // //     transform: [{ rotate: "-5deg" }],
// // // // // // // // // //   },

// // // // // // // // // //   logoW: {
// // // // // // // // // //     color: "#FFD166",
// // // // // // // // // //     fontSize: 21,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   logoS: {
// // // // // // // // // //     color: "#FF6B5A",
// // // // // // // // // //     fontSize: 21,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   sidebarBrandTitle: {
// // // // // // // // // //     color: "#172033",
// // // // // // // // // //     fontSize: 19,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   sidebarBrandAccent: {
// // // // // // // // // //     color: "#FF6B5A",
// // // // // // // // // //   },

// // // // // // // // // //   sidebarBrandSubtitle: {
// // // // // // // // // //     color: "#7B8491",
// // // // // // // // // //     fontSize: 10.5,
// // // // // // // // // //     fontWeight: "600",
// // // // // // // // // //     marginTop: 2,
// // // // // // // // // //   },

// // // // // // // // // //   sidebarNavigation: {
// // // // // // // // // //     marginTop: 50,
// // // // // // // // // //     flex: 1,
// // // // // // // // // //   },

// // // // // // // // // //   sidebarNavItem: {
// // // // // // // // // //     height: 58,
// // // // // // // // // //     borderRadius: 15,
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     paddingHorizontal: 15,
// // // // // // // // // //     marginBottom: 7,
// // // // // // // // // //   },

// // // // // // // // // //   sidebarNavActive: {
// // // // // // // // // //     backgroundColor: "#EEE9FF",
// // // // // // // // // //   },

// // // // // // // // // //   sidebarActiveIcon: {
// // // // // // // // // //     width: 40,
// // // // // // // // // //     height: 40,
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     marginRight: 11,
// // // // // // // // // //   },

// // // // // // // // // //   sidebarActiveText: {
// // // // // // // // // //     color: "#5146E5",
// // // // // // // // // //     fontSize: 15,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   sidebarText: {
// // // // // // // // // //     color: "#596579",
// // // // // // // // // //     fontSize: 15,
// // // // // // // // // //     fontWeight: "700",
// // // // // // // // // //     marginLeft: 16,
// // // // // // // // // //   },

// // // // // // // // // //   sidebarBottomCard: {
// // // // // // // // // //     backgroundColor: "#172033",
// // // // // // // // // //     borderRadius: 19,
// // // // // // // // // //     padding: 17,
// // // // // // // // // //     minHeight: 137,
// // // // // // // // // //   },

// // // // // // // // // //   sidebarBottomIcon: {
// // // // // // // // // //     width: 43,
// // // // // // // // // //     height: 43,
// // // // // // // // // //     borderRadius: 13,
// // // // // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     marginBottom: 11,
// // // // // // // // // //   },

// // // // // // // // // //   sidebarBottomTitle: {
// // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // //     fontSize: 13,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   sidebarBottomText: {
// // // // // // // // // //     color: "#AEB7C7",
// // // // // // // // // //     fontSize: 10.5,
// // // // // // // // // //     lineHeight: 17,
// // // // // // // // // //     marginTop: 5,
// // // // // // // // // //   },

// // // // // // // // // //   /* ==========================================================
// // // // // // // // // //      MAIN
// // // // // // // // // //   ========================================================== */

// // // // // // // // // //   main: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     minWidth: 0,
// // // // // // // // // //     backgroundColor: "#FFF9F0",
// // // // // // // // // //   },

// // // // // // // // // //   mainDesktop: {
// // // // // // // // // //     overflow: "hidden",
// // // // // // // // // //   },



// // // // // // // // // //   desktopTopHeader: {
// // // // // // // // // //     height: 76,
// // // // // // // // // //     paddingHorizontal: 34,
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // //   },

// // // // // // // // // //   desktopWelcome: {
// // // // // // // // // //     color: "#172033",
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   desktopWelcomeSub: {
// // // // // // // // // //     color: "#9299A4",
// // // // // // // // // //     fontSize: 11,
// // // // // // // // // //     marginTop: 3,
// // // // // // // // // //   },

// // // // // // // // // //   desktopNotification: {
// // // // // // // // // //     width: 44,
// // // // // // // // // //     height: 44,
// // // // // // // // // //     borderRadius: 22,
// // // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: "#EDE5D9",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //   },

// // // // // // // // // //   /* ==========================================================
// // // // // // // // // //      MOBILE HEADER
// // // // // // // // // //   ========================================================== */

// // // // // // // // // //   mobileHeader: {
// // // // // // // // // //     height: 76,
// // // // // // // // // //     paddingHorizontal: 17,
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // //     backgroundColor: "#FFF9F0",
// // // // // // // // // //   },

// // // // // // // // // //   mobileBrand: {
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //   },

// // // // // // // // // //   mobileLogo: {
// // // // // // // // // //     width: 45,
// // // // // // // // // //     height: 45,
// // // // // // // // // //     borderRadius: 14,
// // // // // // // // // //     backgroundColor: "#172033",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     marginRight: 10,
// // // // // // // // // //     transform: [{ rotate: "-5deg" }],
// // // // // // // // // //   },

// // // // // // // // // //   mobileBrandTitle: {
// // // // // // // // // //     color: "#172033",
// // // // // // // // // //     fontSize: 17,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   mobileBrandAccent: {
// // // // // // // // // //     color: "#FF6B5A",
// // // // // // // // // //   },

// // // // // // // // // //   mobileBrandSubtitle: {
// // // // // // // // // //     color: "#7B8491",
// // // // // // // // // //     fontSize: 9.5,
// // // // // // // // // //     marginTop: 2,
// // // // // // // // // //     fontWeight: "600",
// // // // // // // // // //   },

// // // // // // // // // //   mobileNotification: {
// // // // // // // // // //     width: 40,
// // // // // // // // // //     height: 40,
// // // // // // // // // //     borderRadius: 20,
// // // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: "#EDE5D9",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //   },

 

// // // // // // // // // //   scrollContent: {
// // // // // // // // // //     paddingHorizontal: 34,
// // // // // // // // // //     paddingTop: 15,
// // // // // // // // // //   },

// // // // // // // // // //   scrollContentTablet: {
// // // // // // // // // //     paddingHorizontal: 25,
// // // // // // // // // //   },

// // // // // // // // // //   scrollContentMobile: {
// // // // // // // // // //     paddingHorizontal: 17,
// // // // // // // // // //     paddingTop: 5,
// // // // // // // // // //   },

// // // // // // // // // //   /* ==========================================================
// // // // // // // // // //      HERO
// // // // // // // // // //   ========================================================== */

// // // // // // // // // //   heroSection: {
// // // // // // // // // //     marginTop: 7,
// // // // // // // // // //   },

// // // // // // // // // //   heroMobile: {
// // // // // // // // // //     marginTop: 5,
// // // // // // // // // //   },

// // // // // // // // // //   smallGreeting: {
// // // // // // // // // //     color: "#FF6B5A",
// // // // // // // // // //     fontSize: 11,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //     letterSpacing: 1.4,
// // // // // // // // // //     marginBottom: 6,
// // // // // // // // // //   },

// // // // // // // // // //   heroTitle: {
// // // // // // // // // //     color: "#172033",
// // // // // // // // // //     fontSize: 45,
// // // // // // // // // //     lineHeight: 48,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //     letterSpacing: -1.5,
// // // // // // // // // //   },

// // // // // // // // // //   heroTitleMobile: {
// // // // // // // // // //     fontSize: 37,
// // // // // // // // // //     lineHeight: 40,
// // // // // // // // // //     letterSpacing: -1,
// // // // // // // // // //   },

// // // // // // // // // //   heroAccent: {
// // // // // // // // // //     color: "#5146E5",
// // // // // // // // // //   },

// // // // // // // // // //   heroDescription: {
// // // // // // // // // //     color: "#7A8290",
// // // // // // // // // //     fontSize: 13.5,
// // // // // // // // // //     lineHeight: 20,
// // // // // // // // // //     marginTop: 10,
// // // // // // // // // //     maxWidth: 390,
// // // // // // // // // //   },

// // // // // // // // // //   heroDescriptionMobile: {
// // // // // // // // // //     fontSize: 12.5,
// // // // // // // // // //     lineHeight: 18,
// // // // // // // // // //     maxWidth: 310,
// // // // // // // // // //   },

 

// // // // // // // // // //   lettersContainer: {
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     marginTop: 24,
// // // // // // // // // //     marginBottom: 25,
// // // // // // // // // //     gap: 9,
// // // // // // // // // //   },

// // // // // // // // // //   lettersMobile: {
// // // // // // // // // //     marginTop: 21,
// // // // // // // // // //     marginBottom: 20,
// // // // // // // // // //   },

// // // // // // // // // //   letterTile: {
// // // // // // // // // //     width: 54,
// // // // // // // // // //     height: 54,
// // // // // // // // // //     borderRadius: 14,
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     shadowColor: "#000000",
// // // // // // // // // //     shadowOffset: {
// // // // // // // // // //       width: 0,
// // // // // // // // // //       height: 4,
// // // // // // // // // //     },
// // // // // // // // // //     shadowOpacity: 0.12,
// // // // // // // // // //     shadowRadius: 6,
// // // // // // // // // //     elevation: 3,
// // // // // // // // // //   },

// // // // // // // // // //   letterText: {
// // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // //     fontSize: 23,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   tileYellow: {
// // // // // // // // // //     backgroundColor: "#F4B942",
// // // // // // // // // //   },

// // // // // // // // // //   tileBlue: {
// // // // // // // // // //     backgroundColor: "#3B82F6",
// // // // // // // // // //   },

// // // // // // // // // //   tilePink: {
// // // // // // // // // //     backgroundColor: "#F15B6C",
// // // // // // // // // //   },

// // // // // // // // // //   tileGreen: {
// // // // // // // // // //     backgroundColor: "#26B67A",
// // // // // // // // // //   },

// // // // // // // // // //   tileRotateLeft: {
// // // // // // // // // //     transform: [{ rotate: "-6deg" }],
// // // // // // // // // //   },

// // // // // // // // // //   tileRotateRight: {
// // // // // // // // // //     transform: [{ rotate: "6deg" }],
// // // // // // // // // //   },

// // // // // // // // // //   /* ==========================================================
// // // // // // // // // //      PLAY CARD
// // // // // // // // // //   ========================================================== */

// // // // // // // // // //   playCard: {
// // // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // // //     borderRadius: 22,
// // // // // // // // // //     padding: 17,
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: "#EEE7DD",
// // // // // // // // // //     shadowColor: "#000000",
// // // // // // // // // //     shadowOffset: {
// // // // // // // // // //       width: 0,
// // // // // // // // // //       height: 6,
// // // // // // // // // //     },
// // // // // // // // // //     shadowOpacity: 0.07,
// // // // // // // // // //     shadowRadius: 14,
// // // // // // // // // //     elevation: 3,
// // // // // // // // // //     alignSelf: "stretch",
// // // // // // // // // //   },

// // // // // // // // // //   playCardMobile: {
// // // // // // // // // //     padding: 15,
// // // // // // // // // //     borderRadius: 19,
// // // // // // // // // //   },

// // // // // // // // // //   playCardTop: {
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     marginBottom: 16,
// // // // // // // // // //   },

// // // // // // // // // //   lightningCircle: {
// // // // // // // // // //     width: 43,
// // // // // // // // // //     height: 43,
// // // // // // // // // //     borderRadius: 14,
// // // // // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     marginRight: 12,
// // // // // // // // // //   },

// // // // // // // // // //   playInfo: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     minWidth: 0,
// // // // // // // // // //   },

// // // // // // // // // //   playCardTitle: {
// // // // // // // // // //     color: "#172033",
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   playCardDescription: {
// // // // // // // // // //     color: "#8A909A",
// // // // // // // // // //     fontSize: 11.5,
// // // // // // // // // //     marginTop: 3,
// // // // // // // // // //   },

// // // // // // // // // //   playersBadge: {
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     gap: 4,
// // // // // // // // // //     backgroundColor: "#EEF1FF",
// // // // // // // // // //     paddingHorizontal: 9,
// // // // // // // // // //     paddingVertical: 6,
// // // // // // // // // //     borderRadius: 10,
// // // // // // // // // //   },

// // // // // // // // // //   playersBadgeText: {
// // // // // // // // // //     color: "#3949AB",
// // // // // // // // // //     fontSize: 10,
// // // // // // // // // //     fontWeight: "800",
// // // // // // // // // //   },



// // // // // // // // // //   playButton: {
// // // // // // // // // //     height: 53,
// // // // // // // // // //     width: 320,
// // // // // // // // // //     maxWidth: "100%",
// // // // // // // // // //     borderRadius: 15,
// // // // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     alignSelf: "center",
// // // // // // // // // //   },

// // // // // // // // // //   playButtonMobile: {
// // // // // // // // // //     width: 230,
// // // // // // // // // //     height: 49,
// // // // // // // // // //     borderRadius: 14,
// // // // // // // // // //   },

// // // // // // // // // //   playButtonText: {
// // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //     letterSpacing: 0.8,
// // // // // // // // // //   },

// // // // // // // // // //   playArrow: {
// // // // // // // // // //     width: 29,
// // // // // // // // // //     height: 29,
// // // // // // // // // //     borderRadius: 10,
// // // // // // // // // //     backgroundColor: "rgba(255,255,255,0.18)",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     marginLeft: 12,
// // // // // // // // // //   },


// // // // // // // // // //   sectionHeader: {
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // //     marginTop: 27,
// // // // // // // // // //     marginBottom: 13,
// // // // // // // // // //   },

// // // // // // // // // //   sectionTitle: {
// // // // // // // // // //     color: "#172033",
// // // // // // // // // //     fontSize: 17,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   sectionSubtitle: {
// // // // // // // // // //     color: "#9297A0",
// // // // // // // // // //     fontSize: 11,
// // // // // // // // // //     marginTop: 3,
// // // // // // // // // //   },

// // // // // // // // // //   /* ==========================================================
// // // // // // // // // //      ROOM CARDS
// // // // // // // // // //   ========================================================== */

// // // // // // // // // //   roomContainer: {
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     gap: 12,
// // // // // // // // // //   },

// // // // // // // // // //   roomContainerMobile: {
// // // // // // // // // //     flexDirection: "column",
// // // // // // // // // //   },

// // // // // // // // // //   createRoomCard: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     minHeight: 157,
// // // // // // // // // //     borderRadius: 19,
// // // // // // // // // //     backgroundColor: "#FFF0EB",
// // // // // // // // // //     padding: 14,
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: "#FFE0D8",
// // // // // // // // // //   },

// // // // // // // // // //   joinRoomCard: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     minHeight: 157,
// // // // // // // // // //     borderRadius: 19,
// // // // // // // // // //     backgroundColor: "#EEF0FF",
// // // // // // // // // //     padding: 14,
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: "#DDE1FF",
// // // // // // // // // //   },

// // // // // // // // // //   roomCardMobile: {
// // // // // // // // // //     width: "100%",
// // // // // // // // // //     flex: 0,
// // // // // // // // // //     minHeight: 145,
// // // // // // // // // //   },

// // // // // // // // // //   roomIconCreate: {
// // // // // // // // // //     width: 38,
// // // // // // // // // //     height: 38,
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     marginBottom: 10,
// // // // // // // // // //   },

// // // // // // // // // //   roomIconJoin: {
// // // // // // // // // //     width: 38,
// // // // // // // // // //     height: 38,
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     marginBottom: 10,
// // // // // // // // // //   },

// // // // // // // // // //   roomCardTitle: {
// // // // // // // // // //     color: "#172033",
// // // // // // // // // //     fontSize: 13,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   roomCardText: {
// // // // // // // // // //     color: "#858B96",
// // // // // // // // // //     fontSize: 10.5,
// // // // // // // // // //     marginTop: 3,
// // // // // // // // // //   },

// // // // // // // // // //   roomArrow: {
// // // // // // // // // //     position: "absolute",
// // // // // // // // // //     right: 13,
// // // // // // // // // //     top: 17,
// // // // // // // // // //   },

// // // // // // // // // //   joinInputRow: {
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     marginTop: 10,
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //   },

// // // // // // // // // //   joinInput: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     minWidth: 0,
// // // // // // // // // //     height: 36,
// // // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // // //     borderRadius: 9,
// // // // // // // // // //     paddingHorizontal: 9,
// // // // // // // // // //     color: "#172033",
// // // // // // // // // //     fontSize: 10,
// // // // // // // // // //     fontWeight: "800",
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: "#DDE1FF",
// // // // // // // // // //   },

// // // // // // // // // //   joinButton: {
// // // // // // // // // //     width: 36,
// // // // // // // // // //     height: 36,
// // // // // // // // // //     borderRadius: 9,
// // // // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     marginLeft: 5,
// // // // // // // // // //   },

 

// // // // // // // // // //   challengeCard: {
// // // // // // // // // //     marginTop: 22,
// // // // // // // // // //     borderRadius: 18,
// // // // // // // // // //     backgroundColor: "#172033",
// // // // // // // // // //     padding: 15,
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // //   },

// // // // // // // // // //   challengeCardMobile: {
// // // // // // // // // //     marginTop: 18,
// // // // // // // // // //     padding: 14,
// // // // // // // // // //   },

// // // // // // // // // //   challengeLeft: {
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     minWidth: 0,
// // // // // // // // // //   },

// // // // // // // // // //   challengeIcon: {
// // // // // // // // // //     width: 42,
// // // // // // // // // //     height: 42,
// // // // // // // // // //     borderRadius: 13,
// // // // // // // // // //     backgroundColor: "#F4B942",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     marginRight: 11,
// // // // // // // // // //   },

// // // // // // // // // //   challengeInfo: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     minWidth: 0,
// // // // // // // // // //   },

// // // // // // // // // //   challengeTitle: {
// // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // //     fontSize: 13,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   challengeText: {
// // // // // // // // // //     color: "#AAB1C0",
// // // // // // // // // //     fontSize: 10.5,
// // // // // // // // // //     marginTop: 3,
// // // // // // // // // //   },

// // // // // // // // // //   challengeProgress: {
// // // // // // // // // //     alignItems: "flex-end",
// // // // // // // // // //     marginLeft: 10,
// // // // // // // // // //   },

// // // // // // // // // //   progressNumber: {
// // // // // // // // // //     color: "#FFD166",
// // // // // // // // // //     fontSize: 17,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   progressText: {
// // // // // // // // // //     color: "#8E97A9",
// // // // // // // // // //     fontSize: 9,
// // // // // // // // // //     marginTop: 1,
// // // // // // // // // //   },

// // // // // // // // // //   /* ==========================================================
// // // // // // // // // //      LEADERBOARD
// // // // // // // // // //   ========================================================== */

// // // // // // // // // //   leaderHeader: {
// // // // // // // // // //     marginTop: 27,
// // // // // // // // // //     marginBottom: 12,
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     justifyContent: "space-between",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //   },

// // // // // // // // // //   viewAll: {
// // // // // // // // // //     color: "#5146E5",
// // // // // // // // // //     fontSize: 11,
// // // // // // // // // //     fontWeight: "800",
// // // // // // // // // //   },

// // // // // // // // // //   leaderboardCard: {
// // // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // // //     borderRadius: 19,
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: "#EEE7DD",
// // // // // // // // // //     paddingHorizontal: 13,
// // // // // // // // // //     overflow: "hidden",
// // // // // // // // // //   },

// // // // // // // // // //   playerRow: {
// // // // // // // // // //     minHeight: 64,
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // //     borderBottomColor: "#F1EEE8",
// // // // // // // // // //   },

// // // // // // // // // //   lastPlayerRow: {
// // // // // // // // // //     borderBottomWidth: 0,
// // // // // // // // // //   },

// // // // // // // // // //   rankCircle: {
// // // // // // // // // //     width: 27,
// // // // // // // // // //     height: 27,
// // // // // // // // // //     borderRadius: 9,
// // // // // // // // // //     backgroundColor: "#F0F0F0",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     marginRight: 9,
// // // // // // // // // //   },

// // // // // // // // // //   rankFirst: {
// // // // // // // // // //     backgroundColor: "#FFF0B8",
// // // // // // // // // //   },

// // // // // // // // // //   rankSecond: {
// // // // // // // // // //     backgroundColor: "#E8E8E8",
// // // // // // // // // //   },

// // // // // // // // // //   rankThird: {
// // // // // // // // // //     backgroundColor: "#F5D6C7",
// // // // // // // // // //   },

// // // // // // // // // //   rankText: {
// // // // // // // // // //     color: "#59606C",
// // // // // // // // // //     fontSize: 11,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   playerAvatar: {
// // // // // // // // // //     width: 37,
// // // // // // // // // //     height: 37,
// // // // // // // // // //     borderRadius: 13,
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     marginRight: 10,
// // // // // // // // // //   },

// // // // // // // // // //   playerInfo: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     minWidth: 0,
// // // // // // // // // //   },

// // // // // // // // // //   playerName: {
// // // // // // // // // //     color: "#202838",
// // // // // // // // // //     fontSize: 13,
// // // // // // // // // //     fontWeight: "800",
// // // // // // // // // //   },

// // // // // // // // // //   topPlayerLabel: {
// // // // // // // // // //     color: "#FF6B5A",
// // // // // // // // // //     fontSize: 8,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //     marginTop: 2,
// // // // // // // // // //     letterSpacing: 0.6,
// // // // // // // // // //   },

// // // // // // // // // //   scoreContainer: {
// // // // // // // // // //     alignItems: "flex-end",
// // // // // // // // // //     marginLeft: 8,
// // // // // // // // // //   },

// // // // // // // // // //   scoreNumber: {
// // // // // // // // // //     color: "#172033",
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //   },

// // // // // // // // // //   scoreLabel: {
// // // // // // // // // //     color: "#9CA1AA",
// // // // // // // // // //     fontSize: 7,
// // // // // // // // // //     fontWeight: "800",
// // // // // // // // // //     marginTop: 1,
// // // // // // // // // //   },

// // // // // // // // // //   emptyLeaderboard: {
// // // // // // // // // //     height: 110,
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //   },

// // // // // // // // // //   emptyText: {
// // // // // // // // // //     color: "#9A9A9A",
// // // // // // // // // //     fontSize: 11,
// // // // // // // // // //     marginTop: 7,
// // // // // // // // // //   },

// // // // // // // // // //   /* ==========================================================
// // // // // // // // // //      MOBILE BOTTOM NAV
// // // // // // // // // //   ========================================================== */

// // // // // // // // // //   bottomNav: {
// // // // // // // // // //     height: 70,
// // // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // //     borderTopColor: "#EEE7DD",
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "space-around",
// // // // // // // // // //     paddingBottom: 4,
// // // // // // // // // //   },

// // // // // // // // // //   navItem: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //   },

// // // // // // // // // //   activeNavIcon: {
// // // // // // // // // //     width: 37,
// // // // // // // // // //     height: 32,
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //   },

// // // // // // // // // //   activeNavText: {
// // // // // // // // // //     color: "#5146E5",
// // // // // // // // // //     fontSize: 9.5,
// // // // // // // // // //     fontWeight: "900",
// // // // // // // // // //     marginTop: 3,
// // // // // // // // // //   },

// // // // // // // // // //   navText: {
// // // // // // // // // //     color: "#8C8C8C",
// // // // // // // // // //     fontSize: 9.5,
// // // // // // // // // //     fontWeight: "700",
// // // // // // // // // //     marginTop: 4,
// // // // // // // // // //   },
// // // // // // // // // // });
// // // // // // // // // import React, { useEffect, useRef } from "react";
// // // // // // // // // import {
// // // // // // // // //   View,
// // // // // // // // //   Text,
// // // // // // // // //   StyleSheet,
// // // // // // // // //   TouchableOpacity,
// // // // // // // // //   TextInput,
// // // // // // // // //   ScrollView,
// // // // // // // // //   SafeAreaView,
// // // // // // // // //   StatusBar,
// // // // // // // // //   useWindowDimensions,
// // // // // // // // //   Animated,
// // // // // // // // //   Easing,
// // // // // // // // // } from "react-native";
// // // // // // // // // import { Ionicons } from "@expo/vector-icons";

// // // // // // // // // export interface TopPlayer {
// // // // // // // // //   rank: number;
// // // // // // // // //   name: string;
// // // // // // // // //   score: number;
// // // // // // // // //   avatarColor: string;
// // // // // // // // // }

// // // // // // // // // interface WordScrambleHomeScreenProps {
// // // // // // // // //   topPlayers: TopPlayer[];

// // // // // // // // //   onPlayOnline: () => void;
// // // // // // // // //   onCreateRoom: () => void;
// // // // // // // // //   onJoinRoom: (code: string) => void;
// // // // // // // // //   onViewAllPlayers: () => void;

// // // // // // // // //   onTabHome: () => void;
// // // // // // // // //   onTabLeaderboard: () => void;
// // // // // // // // //   onTabProfile: () => void;
// // // // // // // // // }

// // // // // // // // // /* =====================================================
// // // // // // // // //    NEW: ambient animated backdrop for the home screen.
// // // // // // // // //    Slow-drifting colour blobs + a few faint floating
// // // // // // // // //    letter tiles, all `pointerEvents="none"` so they never
// // // // // // // // //    block taps on the real UI sitting above them.
// // // // // // // // // ===================================================== */
// // // // // // // // // const BG = {
// // // // // // // // //   indigo: "#5146E5",
// // // // // // // // //   coral: "#FF6B5A",
// // // // // // // // //   yellow: "#F4B942",
// // // // // // // // //   blue: "#3B82F6",
// // // // // // // // //   green: "#26B67A",
// // // // // // // // // };

// // // // // // // // // const BgBlob: React.FC<{
// // // // // // // // //   color: string;
// // // // // // // // //   size: number;
// // // // // // // // //   left: number;
// // // // // // // // //   top: number;
// // // // // // // // //   driftX: number;
// // // // // // // // //   driftY: number;
// // // // // // // // //   duration: number;
// // // // // // // // //   opacity?: number;
// // // // // // // // // }> = ({ color, size, left, top, driftX, driftY, duration, opacity = 0.1 }) => {
// // // // // // // // //   const anim = useRef(new Animated.Value(0)).current;

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const loop = Animated.loop(
// // // // // // // // //       Animated.sequence([
// // // // // // // // //         Animated.timing(anim, {
// // // // // // // // //           toValue: 1,
// // // // // // // // //           duration,
// // // // // // // // //           easing: Easing.inOut(Easing.sin),
// // // // // // // // //           useNativeDriver: true,
// // // // // // // // //         }),
// // // // // // // // //         Animated.timing(anim, {
// // // // // // // // //           toValue: 0,
// // // // // // // // //           duration,
// // // // // // // // //           easing: Easing.inOut(Easing.sin),
// // // // // // // // //           useNativeDriver: true,
// // // // // // // // //         }),
// // // // // // // // //       ])
// // // // // // // // //     );
// // // // // // // // //     loop.start();
// // // // // // // // //     return () => loop.stop();
// // // // // // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // // // // //   }, []);

// // // // // // // // //   const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, driftX] });
// // // // // // // // //   const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, driftY] });
// // // // // // // // //   const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });

// // // // // // // // //   return (
// // // // // // // // //     <Animated.View
// // // // // // // // //       pointerEvents="none"
// // // // // // // // //       style={{
// // // // // // // // //         position: "absolute",
// // // // // // // // //         left,
// // // // // // // // //         top,
// // // // // // // // //         width: size,
// // // // // // // // //         height: size,
// // // // // // // // //         borderRadius: size / 2,
// // // // // // // // //         backgroundColor: color,
// // // // // // // // //         opacity,
// // // // // // // // //         transform: [{ translateX }, { translateY }, { scale }],
// // // // // // // // //       }}
// // // // // // // // //     />
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // const BgLetter: React.FC<{
// // // // // // // // //   char: string;
// // // // // // // // //   color: string;
// // // // // // // // //   left: number;
// // // // // // // // //   top: number;
// // // // // // // // //   rotate: string;
// // // // // // // // //   duration?: number;
// // // // // // // // // }> = ({ char, color, left, top, rotate, duration = 2600 }) => {
// // // // // // // // //   const bob = useRef(new Animated.Value(0)).current;

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const loop = Animated.loop(
// // // // // // // // //       Animated.sequence([
// // // // // // // // //         Animated.timing(bob, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // // // // // //         Animated.timing(bob, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // // // // // //       ])
// // // // // // // // //     );
// // // // // // // // //     loop.start();
// // // // // // // // //     return () => loop.stop();
// // // // // // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // // // // //   }, []);

// // // // // // // // //   const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

// // // // // // // // //   return (
// // // // // // // // //     <Animated.View
// // // // // // // // //       pointerEvents="none"
// // // // // // // // //       style={{
// // // // // // // // //         position: "absolute",
// // // // // // // // //         left,
// // // // // // // // //         top,
// // // // // // // // //         width: 40,
// // // // // // // // //         height: 40,
// // // // // // // // //         borderRadius: 11,
// // // // // // // // //         backgroundColor: color,
// // // // // // // // //         alignItems: "center",
// // // // // // // // //         justifyContent: "center",
// // // // // // // // //         opacity: 0.1,
// // // // // // // // //         transform: [{ translateY }, { rotate }],
// // // // // // // // //       }}
// // // // // // // // //     >
// // // // // // // // //       <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "900" }}>{char}</Text>
// // // // // // // // //     </Animated.View>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // /** Full ambient background: a handful of drifting blobs + faint floating letters. */
// // // // // // // // // const AnimatedHomeBackground: React.FC<{ width: number; height: number }> = ({ width, height }) => {
// // // // // // // // //   return (
// // // // // // // // //     <View style={StyleSheet.absoluteFill} pointerEvents="none">
// // // // // // // // //       <BgBlob color={BG.indigo} size={300} left={-80} top={-60} driftX={35} driftY={25} duration={5200} opacity={0.09} />
// // // // // // // // //       <BgBlob color={BG.coral} size={240} left={width - 160} top={40} driftX={-25} driftY={35} duration={4600} opacity={0.1} />
// // // // // // // // //       <BgBlob color={BG.yellow} size={210} left={width * 0.4} top={height * 0.45} driftX={30} driftY={-20} duration={6000} opacity={0.08} />
// // // // // // // // //       <BgBlob color={BG.green} size={220} left={-70} top={height * 0.6} driftX={30} driftY={-30} duration={5400} opacity={0.08} />
// // // // // // // // //       <BgBlob color={BG.blue} size={180} left={width - 120} top={height * 0.75} driftX={-25} driftY={-20} duration={4900} opacity={0.09} />

// // // // // // // // //       <BgLetter char="W" color={BG.yellow} left={width * 0.08} top={height * 0.15} rotate="-8deg" duration={2400} />
// // // // // // // // //       <BgLetter char="O" color={BG.blue} left={width * 0.82} top={height * 0.22} rotate="7deg" duration={2800} />
// // // // // // // // //       <BgLetter char="R" color={BG.coral} left={width * 0.85} top={height * 0.58} rotate="-6deg" duration={2600} />
// // // // // // // // //       <BgLetter char="D" color={BG.green} left={width * 0.06} top={height * 0.72} rotate="5deg" duration={3000} />
// // // // // // // // //     </View>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // const WordScrambleHomeScreen: React.FC<
// // // // // // // // //   WordScrambleHomeScreenProps
// // // // // // // // // > = ({
// // // // // // // // //   topPlayers,
// // // // // // // // //   onPlayOnline,
// // // // // // // // //   onCreateRoom,
// // // // // // // // //   onJoinRoom,
// // // // // // // // //   onViewAllPlayers,
// // // // // // // // //   onTabHome,
// // // // // // // // //   onTabLeaderboard,
// // // // // // // // //   onTabProfile,
// // // // // // // // // }) => {
// // // // // // // // //   const { width, height } = useWindowDimensions();

// // // // // // // // //   const isMobile = width < 768;
// // // // // // // // //   const isTablet = width >= 768 && width < 1100;

// // // // // // // // //   const [joinCode, setJoinCode] = React.useState("");

// // // // // // // // //   const handleJoinRoom = () => {
// // // // // // // // //     const code = joinCode.trim();

// // // // // // // // //     if (!code) {
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     onJoinRoom(code);
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // // // // //       <StatusBar
// // // // // // // // //         barStyle="dark-content"
// // // // // // // // //         backgroundColor="#FFF9F0"
// // // // // // // // //       />

// // // // // // // // //       {/* NEW: ambient animated backdrop, sits behind the whole screen */}
// // // // // // // // //       <AnimatedHomeBackground width={width} height={height} />

// // // // // // // // //       <View style={styles.root}>

// // // // // // // // //         {/* =====================================================
// // // // // // // // //             DESKTOP SIDEBAR
// // // // // // // // //         ===================================================== */}

// // // // // // // // //         {!isMobile && (
// // // // // // // // //           <View
// // // // // // // // //             style={[
// // // // // // // // //               styles.sidebar,
// // // // // // // // //               isTablet && styles.sidebarTablet,
// // // // // // // // //             ]}
// // // // // // // // //           >
// // // // // // // // //             {/* Brand */}

// // // // // // // // //             <View style={styles.sidebarBrand}>
// // // // // // // // //               <View style={styles.sidebarLogo}>
// // // // // // // // //                 <Text style={styles.logoW}>W</Text>
// // // // // // // // //                 <Text style={styles.logoS}>S</Text>
// // // // // // // // //               </View>

// // // // // // // // //               <View>
// // // // // // // // //                 <Text style={styles.sidebarBrandTitle}>
// // // // // // // // //                   Word
// // // // // // // // //                   <Text style={styles.sidebarBrandAccent}>
// // // // // // // // //                     {" "}Scramble
// // // // // // // // //                   </Text>
// // // // // // // // //                 </Text>

// // // // // // // // //                 <Text style={styles.sidebarBrandSubtitle}>
// // // // // // // // //                   Think fast. Play smart.
// // // // // // // // //                 </Text>
// // // // // // // // //               </View>
// // // // // // // // //             </View>

// // // // // // // // //             {/* Sidebar Navigation */}

// // // // // // // // //             <View style={styles.sidebarNavigation}>

// // // // // // // // //               <TouchableOpacity
// // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // //                 style={[
// // // // // // // // //                   styles.sidebarNavItem,
// // // // // // // // //                   styles.sidebarNavActive,
// // // // // // // // //                 ]}
// // // // // // // // //                 onPress={onTabHome}
// // // // // // // // //               >
// // // // // // // // //                 <View style={styles.sidebarActiveIcon}>
// // // // // // // // //                   <Ionicons
// // // // // // // // //                     name="home"
// // // // // // // // //                     size={21}
// // // // // // // // //                     color="#FFFFFF"
// // // // // // // // //                   />
// // // // // // // // //                 </View>

// // // // // // // // //                 <Text style={styles.sidebarActiveText}>
// // // // // // // // //                   Home
// // // // // // // // //                 </Text>
// // // // // // // // //               </TouchableOpacity>

// // // // // // // // //               <TouchableOpacity
// // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // //                 style={styles.sidebarNavItem}
// // // // // // // // //                 onPress={onTabLeaderboard}
// // // // // // // // //               >
// // // // // // // // //                 <Ionicons
// // // // // // // // //                   name="trophy-outline"
// // // // // // // // //                   size={22}
// // // // // // // // //                   color="#657084"
// // // // // // // // //                 />

// // // // // // // // //                 <Text style={styles.sidebarText}>
// // // // // // // // //                   Rankings
// // // // // // // // //                 </Text>
// // // // // // // // //               </TouchableOpacity>

// // // // // // // // //               <TouchableOpacity
// // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // //                 style={styles.sidebarNavItem}
// // // // // // // // //                 onPress={onTabProfile}
// // // // // // // // //               >
// // // // // // // // //                 <Ionicons
// // // // // // // // //                   name="person-outline"
// // // // // // // // //                   size={22}
// // // // // // // // //                   color="#657084"
// // // // // // // // //                 />

// // // // // // // // //                 <Text style={styles.sidebarText}>
// // // // // // // // //                   Profile
// // // // // // // // //                 </Text>
// // // // // // // // //               </TouchableOpacity>

// // // // // // // // //             </View>

// // // // // // // // //             {/* Sidebar Bottom Card */}

// // // // // // // // //             <View style={styles.sidebarBottomCard}>
// // // // // // // // //               <View style={styles.sidebarBottomIcon}>
// // // // // // // // //                 <Ionicons
// // // // // // // // //                   name="sparkles"
// // // // // // // // //                   size={21}
// // // // // // // // //                   color="#FFFFFF"
// // // // // // // // //                 />
// // // // // // // // //               </View>

// // // // // // // // //               <Text style={styles.sidebarBottomTitle}>
// // // // // // // // //                 Ready for a challenge?
// // // // // // // // //               </Text>

// // // // // // // // //               <Text style={styles.sidebarBottomText}>
// // // // // // // // //                 Unscramble words and climb the rankings.
// // // // // // // // //               </Text>
// // // // // // // // //             </View>
// // // // // // // // //           </View>
// // // // // // // // //         )}

// // // // // // // // //         {/* =====================================================
// // // // // // // // //             MAIN CONTENT
// // // // // // // // //         ===================================================== */}

// // // // // // // // //         <View
// // // // // // // // //           style={[
// // // // // // // // //             styles.main,
// // // // // // // // //             !isMobile && styles.mainDesktop,
// // // // // // // // //           ]}
// // // // // // // // //         >

// // // // // // // // //           {/* ===================================================
// // // // // // // // //               MOBILE HEADER
// // // // // // // // //           =================================================== */}

// // // // // // // // //           {isMobile && (
// // // // // // // // //             <View style={styles.mobileHeader}>

// // // // // // // // //               <View style={styles.mobileBrand}>
// // // // // // // // //                 <View style={styles.mobileLogo}>
// // // // // // // // //                   <Text style={styles.logoW}>W</Text>
// // // // // // // // //                   <Text style={styles.logoS}>S</Text>
// // // // // // // // //                 </View>

// // // // // // // // //                 <View>
// // // // // // // // //                   <Text style={styles.mobileBrandTitle}>
// // // // // // // // //                     Word
// // // // // // // // //                     <Text style={styles.mobileBrandAccent}>
// // // // // // // // //                       {" "}Scramble
// // // // // // // // //                     </Text>
// // // // // // // // //                   </Text>

// // // // // // // // //                   <Text style={styles.mobileBrandSubtitle}>
// // // // // // // // //                     Think fast. Play smart.
// // // // // // // // //                   </Text>
// // // // // // // // //                 </View>
// // // // // // // // //               </View>

// // // // // // // // //               <TouchableOpacity
// // // // // // // // //                 style={styles.mobileNotification}
// // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // //               >
// // // // // // // // //                 <Ionicons
// // // // // // // // //                   name="notifications-outline"
// // // // // // // // //                   size={20}
// // // // // // // // //                   color="#172033"
// // // // // // // // //                 />
// // // // // // // // //               </TouchableOpacity>

// // // // // // // // //             </View>
// // // // // // // // //           )}

// // // // // // // // //           {/* ===================================================
// // // // // // // // //               DESKTOP HEADER
// // // // // // // // //           =================================================== */}

// // // // // // // // //           {!isMobile && (
// // // // // // // // //             <View style={styles.desktopTopHeader}>

// // // // // // // // //               <View>
// // // // // // // // //                 <Text style={styles.desktopWelcome}>
// // // // // // // // //                   Welcome back!
// // // // // // // // //                 </Text>

// // // // // // // // //                 <Text style={styles.desktopWelcomeSub}>
// // // // // // // // //                   Ready to play?
// // // // // // // // //                 </Text>
// // // // // // // // //               </View>

// // // // // // // // //               <TouchableOpacity
// // // // // // // // //                 style={styles.desktopNotification}
// // // // // // // // //               >
// // // // // // // // //                 <Ionicons
// // // // // // // // //                   name="notifications-outline"
// // // // // // // // //                   size={20}
// // // // // // // // //                   color="#172033"
// // // // // // // // //                 />
// // // // // // // // //               </TouchableOpacity>

// // // // // // // // //             </View>
// // // // // // // // //           )}

// // // // // // // // //           {/* ===================================================
// // // // // // // // //               SCROLL CONTENT
// // // // // // // // //           =================================================== */}

// // // // // // // // //           <ScrollView
// // // // // // // // //             showsVerticalScrollIndicator={false}
// // // // // // // // //             horizontal={false}
// // // // // // // // //             contentContainerStyle={[
// // // // // // // // //               styles.scrollContent,
// // // // // // // // //               isMobile && styles.scrollContentMobile,
// // // // // // // // //               isTablet && styles.scrollContentTablet,
// // // // // // // // //             ]}
// // // // // // // // //           >

// // // // // // // // //             {/* =================================================
// // // // // // // // //                 HERO
// // // // // // // // //             ================================================= */}

// // // // // // // // //             <View
// // // // // // // // //               style={[
// // // // // // // // //                 styles.heroSection,
// // // // // // // // //                 isMobile && styles.heroMobile,
// // // // // // // // //               ]}
// // // // // // // // //             >

// // // // // // // // //               <Text style={styles.smallGreeting}>
// // // // // // // // //                 READY TO PLAY?
// // // // // // // // //               </Text>

// // // // // // // // //               <Text
// // // // // // // // //                 style={[
// // // // // // // // //                   styles.heroTitle,
// // // // // // // // //                   isMobile && styles.heroTitleMobile,
// // // // // // // // //                 ]}
// // // // // // // // //               >
// // // // // // // // //                 Unscramble.
// // // // // // // // //                 {"\n"}

// // // // // // // // //                 <Text style={styles.heroAccent}>
// // // // // // // // //                   Outsmart.
// // // // // // // // //                 </Text>
// // // // // // // // //               </Text>

// // // // // // // // //               <Text
// // // // // // // // //                 style={[
// // // // // // // // //                   styles.heroDescription,
// // // // // // // // //                   isMobile && styles.heroDescriptionMobile,
// // // // // // // // //                 ]}
// // // // // // // // //               >
// // // // // // // // //                 Arrange the letters, find the hidden word,
// // // // // // // // //                 and race against your friends.
// // // // // // // // //               </Text>

// // // // // // // // //             </View>

// // // // // // // // //             {/* =================================================
// // // // // // // // //                 WORD LETTERS
// // // // // // // // //             ================================================= */}

// // // // // // // // //             <View
// // // // // // // // //               style={[
// // // // // // // // //                 styles.lettersContainer,
// // // // // // // // //                 isMobile && styles.lettersMobile,
// // // // // // // // //               ]}
// // // // // // // // //             >

// // // // // // // // //               <View
// // // // // // // // //                 style={[
// // // // // // // // //                   styles.letterTile,
// // // // // // // // //                   styles.tileYellow,
// // // // // // // // //                   styles.tileRotateLeft,
// // // // // // // // //                 ]}
// // // // // // // // //               >
// // // // // // // // //                 <Text style={styles.letterText}>W</Text>
// // // // // // // // //               </View>

// // // // // // // // //               <View
// // // // // // // // //                 style={[
// // // // // // // // //                   styles.letterTile,
// // // // // // // // //                   styles.tileBlue,
// // // // // // // // //                   styles.tileRotateRight,
// // // // // // // // //                 ]}
// // // // // // // // //               >
// // // // // // // // //                 <Text style={styles.letterText}>O</Text>
// // // // // // // // //               </View>

// // // // // // // // //               <View
// // // // // // // // //                 style={[
// // // // // // // // //                   styles.letterTile,
// // // // // // // // //                   styles.tilePink,
// // // // // // // // //                 ]}
// // // // // // // // //               >
// // // // // // // // //                 <Text style={styles.letterText}>R</Text>
// // // // // // // // //               </View>

// // // // // // // // //               <View
// // // // // // // // //                 style={[
// // // // // // // // //                   styles.letterTile,
// // // // // // // // //                   styles.tileGreen,
// // // // // // // // //                   styles.tileRotateLeft,
// // // // // // // // //                 ]}
// // // // // // // // //               >
// // // // // // // // //                 <Text style={styles.letterText}>D</Text>
// // // // // // // // //               </View>

// // // // // // // // //             </View>

// // // // // // // // //             {/* =================================================
// // // // // // // // //                 QUICK MATCH
// // // // // // // // //             ================================================= */}

// // // // // // // // //             <View
// // // // // // // // //               style={[
// // // // // // // // //                 styles.playCard,
// // // // // // // // //                 isMobile && styles.playCardMobile,
// // // // // // // // //               ]}
// // // // // // // // //             >

// // // // // // // // //               <View style={styles.playCardTop}>

// // // // // // // // //                 <View style={styles.lightningCircle}>
// // // // // // // // //                   <Ionicons
// // // // // // // // //                     name="flash"
// // // // // // // // //                     size={21}
// // // // // // // // //                     color="#FFFFFF"
// // // // // // // // //                   />
// // // // // // // // //                 </View>

// // // // // // // // //                 <View style={styles.playInfo}>
// // // // // // // // //                   <Text style={styles.playCardTitle}>
// // // // // // // // //                     Quick Match
// // // // // // // // //                   </Text>

// // // // // // // // //                   <Text style={styles.playCardDescription}>
// // // // // // // // //                     Jump into a live word battle
// // // // // // // // //                   </Text>
// // // // // // // // //                 </View>

// // // // // // // // //                 <View style={styles.playersBadge}>
// // // // // // // // //                   <Ionicons
// // // // // // // // //                     name="people-outline"
// // // // // // // // //                     size={14}
// // // // // // // // //                     color="#3949AB"
// // // // // // // // //                   />

// // // // // // // // //                   <Text style={styles.playersBadgeText}>
// // // // // // // // //                     2–8
// // // // // // // // //                   </Text>
// // // // // // // // //                 </View>

// // // // // // // // //               </View>

// // // // // // // // //               {/* IMPORTANT:
// // // // // // // // //                   Button no longer full screen.
// // // // // // // // //                   Desktop = 320px
// // // // // // // // //                   Mobile = 230px
// // // // // // // // //               */}

// // // // // // // // //               <TouchableOpacity
// // // // // // // // //                 activeOpacity={0.88}
// // // // // // // // //                 onPress={onPlayOnline}
// // // // // // // // //                 style={[
// // // // // // // // //                   styles.playButton,
// // // // // // // // //                   isMobile && styles.playButtonMobile,
// // // // // // // // //                 ]}
// // // // // // // // //               >
// // // // // // // // //                 <Text style={styles.playButtonText}>
// // // // // // // // //                   PLAY ONLINE
// // // // // // // // //                 </Text>

// // // // // // // // //                 <View style={styles.playArrow}>
// // // // // // // // //                   <Ionicons
// // // // // // // // //                     name="arrow-forward"
// // // // // // // // //                     size={18}
// // // // // // // // //                     color="#FFFFFF"
// // // // // // // // //                   />
// // // // // // // // //                 </View>
// // // // // // // // //               </TouchableOpacity>

// // // // // // // // //             </View>

// // // // // // // // //             {/* =================================================
// // // // // // // // //                 PLAY WITH FRIENDS
// // // // // // // // //             ================================================= */}

// // // // // // // // //             <View style={styles.sectionHeader}>

// // // // // // // // //               <View>
// // // // // // // // //                 <Text style={styles.sectionTitle}>
// // // // // // // // //                   Play with friends
// // // // // // // // //                 </Text>

// // // // // // // // //                 <Text style={styles.sectionSubtitle}>
// // // // // // // // //                   Create or join a private room
// // // // // // // // //                 </Text>
// // // // // // // // //               </View>

// // // // // // // // //               <Ionicons
// // // // // // // // //                 name="people-circle-outline"
// // // // // // // // //                 size={28}
// // // // // // // // //                 color="#FF6B5A"
// // // // // // // // //               />

// // // // // // // // //             </View>

// // // // // // // // //             {/* =================================================
// // // // // // // // //                 ROOM CARDS
// // // // // // // // //             ================================================= */}

// // // // // // // // //             <View
// // // // // // // // //               style={[
// // // // // // // // //                 styles.roomContainer,
// // // // // // // // //                 isMobile && styles.roomContainerMobile,
// // // // // // // // //               ]}
// // // // // // // // //             >

// // // // // // // // //               {/* CREATE ROOM */}

// // // // // // // // //               <TouchableOpacity
// // // // // // // // //                 activeOpacity={0.85}
// // // // // // // // //                 onPress={onCreateRoom}
// // // // // // // // //                 style={[
// // // // // // // // //                   styles.createRoomCard,
// // // // // // // // //                   isMobile && styles.roomCardMobile,
// // // // // // // // //                 ]}
// // // // // // // // //               >

// // // // // // // // //                 <View style={styles.roomIconCreate}>
// // // // // // // // //                   <Ionicons
// // // // // // // // //                     name="add"
// // // // // // // // //                     size={24}
// // // // // // // // //                     color="#FFFFFF"
// // // // // // // // //                   />
// // // // // // // // //                 </View>

// // // // // // // // //                 <Text style={styles.roomCardTitle}>
// // // // // // // // //                   Create Room
// // // // // // // // //                 </Text>

// // // // // // // // //                 <Text style={styles.roomCardText}>
// // // // // // // // //                   Start a new game
// // // // // // // // //                 </Text>

// // // // // // // // //                 <View style={styles.roomArrow}>
// // // // // // // // //                   <Ionicons
// // // // // // // // //                     name="arrow-forward"
// // // // // // // // //                     size={17}
// // // // // // // // //                     color="#FF6B5A"
// // // // // // // // //                   />
// // // // // // // // //                 </View>

// // // // // // // // //               </TouchableOpacity>

// // // // // // // // //               {/* JOIN ROOM */}

// // // // // // // // //               <View
// // // // // // // // //                 style={[
// // // // // // // // //                   styles.joinRoomCard,
// // // // // // // // //                   isMobile && styles.roomCardMobile,
// // // // // // // // //                 ]}
// // // // // // // // //               >

// // // // // // // // //                 <View style={styles.roomIconJoin}>
// // // // // // // // //                   <Ionicons
// // // // // // // // //                     name="enter-outline"
// // // // // // // // //                     size={22}
// // // // // // // // //                     color="#FFFFFF"
// // // // // // // // //                   />
// // // // // // // // //                 </View>

// // // // // // // // //                 <Text style={styles.roomCardTitle}>
// // // // // // // // //                   Join Room
// // // // // // // // //                 </Text>

// // // // // // // // //                 <Text style={styles.roomCardText}>
// // // // // // // // //                   Enter room code
// // // // // // // // //                 </Text>

// // // // // // // // //                 <View style={styles.joinInputRow}>

// // // // // // // // //                   <TextInput
// // // // // // // // //                     value={joinCode}
// // // // // // // // //                     onChangeText={setJoinCode}
// // // // // // // // //                     placeholder="ROOM CODE"
// // // // // // // // //                     placeholderTextColor="#9A9A9A"
// // // // // // // // //                     autoCapitalize="characters"
// // // // // // // // //                     maxLength={8}
// // // // // // // // //                     style={styles.joinInput}
// // // // // // // // //                   />

// // // // // // // // //                   <TouchableOpacity
// // // // // // // // //                     activeOpacity={0.8}
// // // // // // // // //                     onPress={handleJoinRoom}
// // // // // // // // //                     style={styles.joinButton}
// // // // // // // // //                   >
// // // // // // // // //                     <Ionicons
// // // // // // // // //                       name="arrow-forward"
// // // // // // // // //                       size={18}
// // // // // // // // //                       color="#FFFFFF"
// // // // // // // // //                     />
// // // // // // // // //                   </TouchableOpacity>

// // // // // // // // //                 </View>

// // // // // // // // //               </View>

// // // // // // // // //             </View>

// // // // // // // // //             {/* =================================================
// // // // // // // // //                 DAILY CHALLENGE
// // // // // // // // //             ================================================= */}

// // // // // // // // //             <View
// // // // // // // // //               style={[
// // // // // // // // //                 styles.challengeCard,
// // // // // // // // //                 isMobile && styles.challengeCardMobile,
// // // // // // // // //               ]}
// // // // // // // // //             >

// // // // // // // // //               <View style={styles.challengeLeft}>

// // // // // // // // //                 <View style={styles.challengeIcon}>
// // // // // // // // //                   <Ionicons
// // // // // // // // //                     name="trophy"
// // // // // // // // //                     size={22}
// // // // // // // // //                     color="#FFFFFF"
// // // // // // // // //                   />
// // // // // // // // //                 </View>

// // // // // // // // //                 <View style={styles.challengeInfo}>
// // // // // // // // //                   <Text style={styles.challengeTitle}>
// // // // // // // // //                     Daily Challenge
// // // // // // // // //                   </Text>

// // // // // // // // //                   <Text style={styles.challengeText}>
// // // // // // // // //                     Solve today's puzzle
// // // // // // // // //                   </Text>
// // // // // // // // //                 </View>

// // // // // // // // //               </View>

// // // // // // // // //               <View style={styles.challengeProgress}>
// // // // // // // // //                 <Text style={styles.progressNumber}>
// // // // // // // // //                   3/5
// // // // // // // // //                 </Text>

// // // // // // // // //                 <Text style={styles.progressText}>
// // // // // // // // //                   rounds
// // // // // // // // //                 </Text>
// // // // // // // // //               </View>

// // // // // // // // //             </View>

// // // // // // // // //             {/* =================================================
// // // // // // // // //                 LEADERBOARD
// // // // // // // // //             ================================================= */}

// // // // // // // // //             <View style={styles.leaderHeader}>

// // // // // // // // //               <View>
// // // // // // // // //                 <Text style={styles.sectionTitle}>
// // // // // // // // //                   Top Players
// // // // // // // // //                 </Text>

// // // // // // // // //                 <Text style={styles.sectionSubtitle}>
// // // // // // // // //                   Today's leaderboard
// // // // // // // // //                 </Text>
// // // // // // // // //               </View>

// // // // // // // // //               <TouchableOpacity
// // // // // // // // //                 activeOpacity={0.7}
// // // // // // // // //                 onPress={onViewAllPlayers}
// // // // // // // // //               >
// // // // // // // // //                 <Text style={styles.viewAll}>
// // // // // // // // //                   View all
// // // // // // // // //                 </Text>
// // // // // // // // //               </TouchableOpacity>

// // // // // // // // //             </View>

// // // // // // // // //             <View style={styles.leaderboardCard}>

// // // // // // // // //               {topPlayers.length === 0 ? (

// // // // // // // // //                 <View style={styles.emptyLeaderboard}>

// // // // // // // // //                   <Ionicons
// // // // // // // // //                     name="trophy-outline"
// // // // // // // // //                     size={28}
// // // // // // // // //                     color="#B0B0B0"
// // // // // // // // //                   />

// // // // // // // // //                   <Text style={styles.emptyText}>
// // // // // // // // //                     No players yet
// // // // // // // // //                   </Text>

// // // // // // // // //                 </View>

// // // // // // // // //               ) : (

// // // // // // // // //                 topPlayers.map((player, index) => (

// // // // // // // // //                   <View
// // // // // // // // //                     key={`${player.rank}-${player.name}`}
// // // // // // // // //                     style={[
// // // // // // // // //                       styles.playerRow,
// // // // // // // // //                       index === topPlayers.length - 1 &&
// // // // // // // // //                         styles.lastPlayerRow,
// // // // // // // // //                     ]}
// // // // // // // // //                   >

// // // // // // // // //                     <View
// // // // // // // // //                       style={[
// // // // // // // // //                         styles.rankCircle,
// // // // // // // // //                         player.rank === 1 &&
// // // // // // // // //                           styles.rankFirst,
// // // // // // // // //                         player.rank === 2 &&
// // // // // // // // //                           styles.rankSecond,
// // // // // // // // //                         player.rank === 3 &&
// // // // // // // // //                           styles.rankThird,
// // // // // // // // //                       ]}
// // // // // // // // //                     >
// // // // // // // // //                       <Text style={styles.rankText}>
// // // // // // // // //                         {player.rank}
// // // // // // // // //                       </Text>
// // // // // // // // //                     </View>

// // // // // // // // //                     <View
// // // // // // // // //                       style={[
// // // // // // // // //                         styles.playerAvatar,
// // // // // // // // //                         {
// // // // // // // // //                           backgroundColor:
// // // // // // // // //                             player.avatarColor || "#FF6B5A",
// // // // // // // // //                         },
// // // // // // // // //                       ]}
// // // // // // // // //                     >
// // // // // // // // //                       <Ionicons
// // // // // // // // //                         name="person"
// // // // // // // // //                         size={17}
// // // // // // // // //                         color="#FFFFFF"
// // // // // // // // //                       />
// // // // // // // // //                     </View>

// // // // // // // // //                     <View style={styles.playerInfo}>

// // // // // // // // //                       <Text style={styles.playerName}>
// // // // // // // // //                         {player.name}
// // // // // // // // //                       </Text>

// // // // // // // // //                       {player.rank === 1 && (
// // // // // // // // //                         <Text style={styles.topPlayerLabel}>
// // // // // // // // //                           TOP PLAYER
// // // // // // // // //                         </Text>
// // // // // // // // //                       )}

// // // // // // // // //                     </View>

// // // // // // // // //                     <View style={styles.scoreContainer}>

// // // // // // // // //                       <Text style={styles.scoreNumber}>
// // // // // // // // //                         {player.score}
// // // // // // // // //                       </Text>

// // // // // // // // //                       <Text style={styles.scoreLabel}>
// // // // // // // // //                         PTS
// // // // // // // // //                       </Text>

// // // // // // // // //                     </View>

// // // // // // // // //                   </View>

// // // // // // // // //                 ))

// // // // // // // // //               )}

// // // // // // // // //             </View>

// // // // // // // // //             <View style={{ height: isMobile ? 90 : 40 }} />

// // // // // // // // //           </ScrollView>

// // // // // // // // //           {/* =================================================
// // // // // // // // //               MOBILE BOTTOM NAV
// // // // // // // // //           ================================================= */}

// // // // // // // // //           {isMobile && (
// // // // // // // // //             <View style={styles.bottomNav}>

// // // // // // // // //               <TouchableOpacity
// // // // // // // // //                 style={styles.navItem}
// // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // //                 onPress={onTabHome}
// // // // // // // // //               >
// // // // // // // // //                 <View style={styles.activeNavIcon}>
// // // // // // // // //                   <Ionicons
// // // // // // // // //                     name="home"
// // // // // // // // //                     size={20}
// // // // // // // // //                     color="#FFFFFF"
// // // // // // // // //                   />
// // // // // // // // //                 </View>

// // // // // // // // //                 <Text style={styles.activeNavText}>
// // // // // // // // //                   Home
// // // // // // // // //                 </Text>
// // // // // // // // //               </TouchableOpacity>

// // // // // // // // //               <TouchableOpacity
// // // // // // // // //                 style={styles.navItem}
// // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // //                 onPress={onTabLeaderboard}
// // // // // // // // //               >
// // // // // // // // //                 <Ionicons
// // // // // // // // //                   name="trophy-outline"
// // // // // // // // //                   size={21}
// // // // // // // // //                   color="#8C8C8C"
// // // // // // // // //                 />

// // // // // // // // //                 <Text style={styles.navText}>
// // // // // // // // //                   Rankings
// // // // // // // // //                 </Text>
// // // // // // // // //               </TouchableOpacity>

// // // // // // // // //               <TouchableOpacity
// // // // // // // // //                 style={styles.navItem}
// // // // // // // // //                 activeOpacity={0.8}
// // // // // // // // //                 onPress={onTabProfile}
// // // // // // // // //               >
// // // // // // // // //                 <Ionicons
// // // // // // // // //                   name="person-outline"
// // // // // // // // //                   size={21}
// // // // // // // // //                   color="#8C8C8C"
// // // // // // // // //                 />

// // // // // // // // //                 <Text style={styles.navText}>
// // // // // // // // //                   Profile
// // // // // // // // //                 </Text>
// // // // // // // // //               </TouchableOpacity>

// // // // // // // // //             </View>
// // // // // // // // //           )}

// // // // // // // // //         </View>
// // // // // // // // //       </View>
// // // // // // // // //     </SafeAreaView>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default WordScrambleHomeScreen;

// // // // // // // // // /* ============================================================
// // // // // // // // //    STYLES
// // // // // // // // // ============================================================ */

// // // // // // // // // const styles = StyleSheet.create({

// // // // // // // // //   safeArea: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     backgroundColor: "#FFF9F0",
// // // // // // // // //   },

// // // // // // // // //   root: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     // CHANGED: transparent so the AnimatedHomeBackground behind it (which
// // // // // // // // //     // sits on safeArea, one level up) shows through the gaps between the
// // // // // // // // //     // sidebar/main content instead of being covered by a solid colour.
// // // // // // // // //     backgroundColor: "transparent",
// // // // // // // // //   },

// // // // // // // // //   /* ==========================================================
// // // // // // // // //      SIDEBAR
// // // // // // // // //   ========================================================== */

// // // // // // // // //   sidebar: {
// // // // // // // // //     width: 292,
// // // // // // // // //     // CHANGED: was a fully opaque "#FFFDF9" — now a near-opaque version of
// // // // // // // // //     // the same colour so the ambient background is *very* faintly visible
// // // // // // // // //     // behind the nav without hurting legibility of its text/icons.
// // // // // // // // //     backgroundColor: "rgba(255,253,249,0.97)",
// // // // // // // // //     borderRightWidth: 1,
// // // // // // // // //     borderRightColor: "#EDE5D9",
// // // // // // // // //     paddingHorizontal: 19,
// // // // // // // // //     paddingTop: 22,
// // // // // // // // //     paddingBottom: 18,
// // // // // // // // //     justifyContent: "space-between",
// // // // // // // // //   },

// // // // // // // // //   sidebarTablet: {
// // // // // // // // //     width: 245,
// // // // // // // // //   },

// // // // // // // // //   sidebarBrand: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //   },

// // // // // // // // //   sidebarLogo: {
// // // // // // // // //     width: 58,
// // // // // // // // //     height: 58,
// // // // // // // // //     borderRadius: 17,
// // // // // // // // //     backgroundColor: "#172033",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     marginRight: 11,
// // // // // // // // //     transform: [{ rotate: "-5deg" }],
// // // // // // // // //   },

// // // // // // // // //   logoW: {
// // // // // // // // //     color: "#FFD166",
// // // // // // // // //     fontSize: 21,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   logoS: {
// // // // // // // // //     color: "#FF6B5A",
// // // // // // // // //     fontSize: 21,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   sidebarBrandTitle: {
// // // // // // // // //     color: "#172033",
// // // // // // // // //     fontSize: 19,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   sidebarBrandAccent: {
// // // // // // // // //     color: "#FF6B5A",
// // // // // // // // //   },

// // // // // // // // //   sidebarBrandSubtitle: {
// // // // // // // // //     color: "#7B8491",
// // // // // // // // //     fontSize: 10.5,
// // // // // // // // //     fontWeight: "600",
// // // // // // // // //     marginTop: 2,
// // // // // // // // //   },

// // // // // // // // //   sidebarNavigation: {
// // // // // // // // //     marginTop: 50,
// // // // // // // // //     flex: 1,
// // // // // // // // //   },

// // // // // // // // //   sidebarNavItem: {
// // // // // // // // //     height: 58,
// // // // // // // // //     borderRadius: 15,
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     paddingHorizontal: 15,
// // // // // // // // //     marginBottom: 7,
// // // // // // // // //   },

// // // // // // // // //   sidebarNavActive: {
// // // // // // // // //     backgroundColor: "#EEE9FF",
// // // // // // // // //   },

// // // // // // // // //   sidebarActiveIcon: {
// // // // // // // // //     width: 40,
// // // // // // // // //     height: 40,
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     marginRight: 11,
// // // // // // // // //   },

// // // // // // // // //   sidebarActiveText: {
// // // // // // // // //     color: "#5146E5",
// // // // // // // // //     fontSize: 15,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   sidebarText: {
// // // // // // // // //     color: "#596579",
// // // // // // // // //     fontSize: 15,
// // // // // // // // //     fontWeight: "700",
// // // // // // // // //     marginLeft: 16,
// // // // // // // // //   },

// // // // // // // // //   sidebarBottomCard: {
// // // // // // // // //     backgroundColor: "#172033",
// // // // // // // // //     borderRadius: 19,
// // // // // // // // //     padding: 17,
// // // // // // // // //     minHeight: 137,
// // // // // // // // //   },

// // // // // // // // //   sidebarBottomIcon: {
// // // // // // // // //     width: 43,
// // // // // // // // //     height: 43,
// // // // // // // // //     borderRadius: 13,
// // // // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     marginBottom: 11,
// // // // // // // // //   },

// // // // // // // // //   sidebarBottomTitle: {
// // // // // // // // //     color: "#FFFFFF",
// // // // // // // // //     fontSize: 13,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   sidebarBottomText: {
// // // // // // // // //     color: "#AEB7C7",
// // // // // // // // //     fontSize: 10.5,
// // // // // // // // //     lineHeight: 17,
// // // // // // // // //     marginTop: 5,
// // // // // // // // //   },

  

// // // // // // // // //   main: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     minWidth: 0,
    
// // // // // // // // //     backgroundColor: "transparent",
// // // // // // // // //   },

// // // // // // // // //   mainDesktop: {
// // // // // // // // //     overflow: "hidden",
// // // // // // // // //   },



// // // // // // // // //   desktopTopHeader: {
// // // // // // // // //     height: 76,
// // // // // // // // //     paddingHorizontal: 34,
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "space-between",
// // // // // // // // //   },

// // // // // // // // //   desktopWelcome: {
// // // // // // // // //     color: "#172033",
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   desktopWelcomeSub: {
// // // // // // // // //     color: "#9299A4",
// // // // // // // // //     fontSize: 11,
// // // // // // // // //     marginTop: 3,
// // // // // // // // //   },

// // // // // // // // //   desktopNotification: {
// // // // // // // // //     width: 44,
// // // // // // // // //     height: 44,
// // // // // // // // //     borderRadius: 22,
// // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: "#EDE5D9",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //   },

// // // // // // // // //   /* ==========================================================
// // // // // // // // //      MOBILE HEADER
// // // // // // // // //   ========================================================== */

// // // // // // // // //   mobileHeader: {
// // // // // // // // //     height: 76,
// // // // // // // // //     paddingHorizontal: 17,
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "space-between",
// // // // // // // // //     // CHANGED: transparent so the animated backdrop shows through here too
// // // // // // // // //     backgroundColor: "transparent",
// // // // // // // // //   },

// // // // // // // // //   mobileBrand: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //   },

// // // // // // // // //   mobileLogo: {
// // // // // // // // //     width: 45,
// // // // // // // // //     height: 45,
// // // // // // // // //     borderRadius: 14,
// // // // // // // // //     backgroundColor: "#172033",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     marginRight: 10,
// // // // // // // // //     transform: [{ rotate: "-5deg" }],
// // // // // // // // //   },

// // // // // // // // //   mobileBrandTitle: {
// // // // // // // // //     color: "#172033",
// // // // // // // // //     fontSize: 17,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   mobileBrandAccent: {
// // // // // // // // //     color: "#FF6B5A",
// // // // // // // // //   },

// // // // // // // // //   mobileBrandSubtitle: {
// // // // // // // // //     color: "#7B8491",
// // // // // // // // //     fontSize: 9.5,
// // // // // // // // //     marginTop: 2,
// // // // // // // // //     fontWeight: "600",
// // // // // // // // //   },

// // // // // // // // //   mobileNotification: {
// // // // // // // // //     width: 40,
// // // // // // // // //     height: 40,
// // // // // // // // //     borderRadius: 20,
// // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: "#EDE5D9",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //   },

 

// // // // // // // // //   scrollContent: {
// // // // // // // // //     paddingHorizontal: 34,
// // // // // // // // //     paddingTop: 15,
// // // // // // // // //   },

// // // // // // // // //   scrollContentTablet: {
// // // // // // // // //     paddingHorizontal: 25,
// // // // // // // // //   },

// // // // // // // // //   scrollContentMobile: {
// // // // // // // // //     paddingHorizontal: 17,
// // // // // // // // //     paddingTop: 5,
// // // // // // // // //   },

// // // // // // // // //   /* ==========================================================
// // // // // // // // //      HERO
// // // // // // // // //   ========================================================== */

// // // // // // // // //   heroSection: {
// // // // // // // // //     marginTop: 7,
// // // // // // // // //   },

// // // // // // // // //   heroMobile: {
// // // // // // // // //     marginTop: 5,
// // // // // // // // //   },

// // // // // // // // //   smallGreeting: {
// // // // // // // // //     color: "#FF6B5A",
// // // // // // // // //     fontSize: 11,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //     letterSpacing: 1.4,
// // // // // // // // //     marginBottom: 6,
// // // // // // // // //   },

// // // // // // // // //   heroTitle: {
// // // // // // // // //     color: "#172033",
// // // // // // // // //     fontSize: 45,
// // // // // // // // //     lineHeight: 48,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //     letterSpacing: -1.5,
// // // // // // // // //   },

// // // // // // // // //   heroTitleMobile: {
// // // // // // // // //     fontSize: 37,
// // // // // // // // //     lineHeight: 40,
// // // // // // // // //     letterSpacing: -1,
// // // // // // // // //   },

// // // // // // // // //   heroAccent: {
// // // // // // // // //     color: "#5146E5",
// // // // // // // // //   },

// // // // // // // // //   heroDescription: {
// // // // // // // // //     color: "#7A8290",
// // // // // // // // //     fontSize: 13.5,
// // // // // // // // //     lineHeight: 20,
// // // // // // // // //     marginTop: 10,
// // // // // // // // //     maxWidth: 390,
// // // // // // // // //   },

// // // // // // // // //   heroDescriptionMobile: {
// // // // // // // // //     fontSize: 12.5,
// // // // // // // // //     lineHeight: 18,
// // // // // // // // //     maxWidth: 310,
// // // // // // // // //   },

 

// // // // // // // // //   lettersContainer: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     marginTop: 24,
// // // // // // // // //     marginBottom: 25,
// // // // // // // // //     gap: 9,
// // // // // // // // //   },

// // // // // // // // //   lettersMobile: {
// // // // // // // // //     marginTop: 21,
// // // // // // // // //     marginBottom: 20,
// // // // // // // // //   },

// // // // // // // // //   letterTile: {
// // // // // // // // //     width: 54,
// // // // // // // // //     height: 54,
// // // // // // // // //     borderRadius: 14,
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     shadowColor: "#000000",
// // // // // // // // //     shadowOffset: {
// // // // // // // // //       width: 0,
// // // // // // // // //       height: 4,
// // // // // // // // //     },
// // // // // // // // //     shadowOpacity: 0.12,
// // // // // // // // //     shadowRadius: 6,
// // // // // // // // //     elevation: 3,
// // // // // // // // //   },

// // // // // // // // //   letterText: {
// // // // // // // // //     color: "#FFFFFF",
// // // // // // // // //     fontSize: 23,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   tileYellow: {
// // // // // // // // //     backgroundColor: "#F4B942",
// // // // // // // // //   },

// // // // // // // // //   tileBlue: {
// // // // // // // // //     backgroundColor: "#3B82F6",
// // // // // // // // //   },

// // // // // // // // //   tilePink: {
// // // // // // // // //     backgroundColor: "#F15B6C",
// // // // // // // // //   },

// // // // // // // // //   tileGreen: {
// // // // // // // // //     backgroundColor: "#26B67A",
// // // // // // // // //   },

// // // // // // // // //   tileRotateLeft: {
// // // // // // // // //     transform: [{ rotate: "-6deg" }],
// // // // // // // // //   },

// // // // // // // // //   tileRotateRight: {
// // // // // // // // //     transform: [{ rotate: "6deg" }],
// // // // // // // // //   },

// // // // // // // // //   /* ==========================================================
// // // // // // // // //      PLAY CARD
// // // // // // // // //   ========================================================== */

// // // // // // // // //   playCard: {
// // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // //     borderRadius: 22,
// // // // // // // // //     padding: 17,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: "#EEE7DD",
// // // // // // // // //     shadowColor: "#000000",
// // // // // // // // //     shadowOffset: {
// // // // // // // // //       width: 0,
// // // // // // // // //       height: 6,
// // // // // // // // //     },
// // // // // // // // //     shadowOpacity: 0.07,
// // // // // // // // //     shadowRadius: 14,
// // // // // // // // //     elevation: 3,
// // // // // // // // //     alignSelf: "stretch",
// // // // // // // // //   },

// // // // // // // // //   playCardMobile: {
// // // // // // // // //     padding: 15,
// // // // // // // // //     borderRadius: 19,
// // // // // // // // //   },

// // // // // // // // //   playCardTop: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     marginBottom: 16,
// // // // // // // // //   },

// // // // // // // // //   lightningCircle: {
// // // // // // // // //     width: 43,
// // // // // // // // //     height: 43,
// // // // // // // // //     borderRadius: 14,
// // // // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     marginRight: 12,
// // // // // // // // //   },

// // // // // // // // //   playInfo: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     minWidth: 0,
// // // // // // // // //   },

// // // // // // // // //   playCardTitle: {
// // // // // // // // //     color: "#172033",
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   playCardDescription: {
// // // // // // // // //     color: "#8A909A",
// // // // // // // // //     fontSize: 11.5,
// // // // // // // // //     marginTop: 3,
// // // // // // // // //   },

// // // // // // // // //   playersBadge: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     gap: 4,
// // // // // // // // //     backgroundColor: "#EEF1FF",
// // // // // // // // //     paddingHorizontal: 9,
// // // // // // // // //     paddingVertical: 6,
// // // // // // // // //     borderRadius: 10,
// // // // // // // // //   },

// // // // // // // // //   playersBadgeText: {
// // // // // // // // //     color: "#3949AB",
// // // // // // // // //     fontSize: 10,
// // // // // // // // //     fontWeight: "800",
// // // // // // // // //   },



// // // // // // // // //   playButton: {
// // // // // // // // //     height: 53,
// // // // // // // // //     width: 320,
// // // // // // // // //     maxWidth: "100%",
// // // // // // // // //     borderRadius: 15,
// // // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     alignSelf: "center",
// // // // // // // // //   },

// // // // // // // // //   playButtonMobile: {
// // // // // // // // //     width: 230,
// // // // // // // // //     height: 49,
// // // // // // // // //     borderRadius: 14,
// // // // // // // // //   },

// // // // // // // // //   playButtonText: {
// // // // // // // // //     color: "#FFFFFF",
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //     letterSpacing: 0.8,
// // // // // // // // //   },

// // // // // // // // //   playArrow: {
// // // // // // // // //     width: 29,
// // // // // // // // //     height: 29,
// // // // // // // // //     borderRadius: 10,
// // // // // // // // //     backgroundColor: "rgba(255,255,255,0.18)",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     marginLeft: 12,
// // // // // // // // //   },


// // // // // // // // //   sectionHeader: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "space-between",
// // // // // // // // //     marginTop: 27,
// // // // // // // // //     marginBottom: 13,
// // // // // // // // //   },

// // // // // // // // //   sectionTitle: {
// // // // // // // // //     color: "#172033",
// // // // // // // // //     fontSize: 17,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   sectionSubtitle: {
// // // // // // // // //     color: "#9297A0",
// // // // // // // // //     fontSize: 11,
// // // // // // // // //     marginTop: 3,
// // // // // // // // //   },

// // // // // // // // //   /* ==========================================================
// // // // // // // // //      ROOM CARDS
// // // // // // // // //   ========================================================== */

// // // // // // // // //   roomContainer: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     gap: 12,
// // // // // // // // //   },

// // // // // // // // //   roomContainerMobile: {
// // // // // // // // //     flexDirection: "column",
// // // // // // // // //   },

// // // // // // // // //   createRoomCard: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     minHeight: 157,
// // // // // // // // //     borderRadius: 19,
// // // // // // // // //     backgroundColor: "#FFF0EB",
// // // // // // // // //     padding: 14,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: "#FFE0D8",
// // // // // // // // //   },

// // // // // // // // //   joinRoomCard: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     minHeight: 157,
// // // // // // // // //     borderRadius: 19,
// // // // // // // // //     backgroundColor: "#EEF0FF",
// // // // // // // // //     padding: 14,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: "#DDE1FF",
// // // // // // // // //   },

// // // // // // // // //   roomCardMobile: {
// // // // // // // // //     width: "100%",
// // // // // // // // //     flex: 0,
// // // // // // // // //     minHeight: 145,
// // // // // // // // //   },

// // // // // // // // //   roomIconCreate: {
// // // // // // // // //     width: 38,
// // // // // // // // //     height: 38,
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     marginBottom: 10,
// // // // // // // // //   },

// // // // // // // // //   roomIconJoin: {
// // // // // // // // //     width: 38,
// // // // // // // // //     height: 38,
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     marginBottom: 10,
// // // // // // // // //   },

// // // // // // // // //   roomCardTitle: {
// // // // // // // // //     color: "#172033",
// // // // // // // // //     fontSize: 13,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   roomCardText: {
// // // // // // // // //     color: "#858B96",
// // // // // // // // //     fontSize: 10.5,
// // // // // // // // //     marginTop: 3,
// // // // // // // // //   },

// // // // // // // // //   roomArrow: {
// // // // // // // // //     position: "absolute",
// // // // // // // // //     right: 13,
// // // // // // // // //     top: 17,
// // // // // // // // //   },

// // // // // // // // //   joinInputRow: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     marginTop: 10,
// // // // // // // // //     alignItems: "center",
// // // // // // // // //   },

// // // // // // // // //   joinInput: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     minWidth: 0,
// // // // // // // // //     height: 36,
// // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // //     borderRadius: 9,
// // // // // // // // //     paddingHorizontal: 9,
// // // // // // // // //     color: "#172033",
// // // // // // // // //     fontSize: 10,
// // // // // // // // //     fontWeight: "800",
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: "#DDE1FF",
// // // // // // // // //   },

// // // // // // // // //   joinButton: {
// // // // // // // // //     width: 36,
// // // // // // // // //     height: 36,
// // // // // // // // //     borderRadius: 9,
// // // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     marginLeft: 5,
// // // // // // // // //   },

 

// // // // // // // // //   challengeCard: {
// // // // // // // // //     marginTop: 22,
// // // // // // // // //     borderRadius: 18,
// // // // // // // // //     backgroundColor: "#172033",
// // // // // // // // //     padding: 15,
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "space-between",
// // // // // // // // //   },

// // // // // // // // //   challengeCardMobile: {
// // // // // // // // //     marginTop: 18,
// // // // // // // // //     padding: 14,
// // // // // // // // //   },

// // // // // // // // //   challengeLeft: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     flex: 1,
// // // // // // // // //     minWidth: 0,
// // // // // // // // //   },

// // // // // // // // //   challengeIcon: {
// // // // // // // // //     width: 42,
// // // // // // // // //     height: 42,
// // // // // // // // //     borderRadius: 13,
// // // // // // // // //     backgroundColor: "#F4B942",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     marginRight: 11,
// // // // // // // // //   },

// // // // // // // // //   challengeInfo: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     minWidth: 0,
// // // // // // // // //   },

// // // // // // // // //   challengeTitle: {
// // // // // // // // //     color: "#FFFFFF",
// // // // // // // // //     fontSize: 13,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   challengeText: {
// // // // // // // // //     color: "#AAB1C0",
// // // // // // // // //     fontSize: 10.5,
// // // // // // // // //     marginTop: 3,
// // // // // // // // //   },

// // // // // // // // //   challengeProgress: {
// // // // // // // // //     alignItems: "flex-end",
// // // // // // // // //     marginLeft: 10,
// // // // // // // // //   },

// // // // // // // // //   progressNumber: {
// // // // // // // // //     color: "#FFD166",
// // // // // // // // //     fontSize: 17,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   progressText: {
// // // // // // // // //     color: "#8E97A9",
// // // // // // // // //     fontSize: 9,
// // // // // // // // //     marginTop: 1,
// // // // // // // // //   },

// // // // // // // // //   /* ==========================================================
// // // // // // // // //      LEADERBOARD
// // // // // // // // //   ========================================================== */

// // // // // // // // //   leaderHeader: {
// // // // // // // // //     marginTop: 27,
// // // // // // // // //     marginBottom: 12,
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     justifyContent: "space-between",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //   },

// // // // // // // // //   viewAll: {
// // // // // // // // //     color: "#5146E5",
// // // // // // // // //     fontSize: 11,
// // // // // // // // //     fontWeight: "800",
// // // // // // // // //   },

// // // // // // // // //   leaderboardCard: {
// // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // //     borderRadius: 19,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: "#EEE7DD",
// // // // // // // // //     paddingHorizontal: 13,
// // // // // // // // //     overflow: "hidden",
// // // // // // // // //   },

// // // // // // // // //   playerRow: {
// // // // // // // // //     minHeight: 64,
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: "#F1EEE8",
// // // // // // // // //   },

// // // // // // // // //   lastPlayerRow: {
// // // // // // // // //     borderBottomWidth: 0,
// // // // // // // // //   },

// // // // // // // // //   rankCircle: {
// // // // // // // // //     width: 27,
// // // // // // // // //     height: 27,
// // // // // // // // //     borderRadius: 9,
// // // // // // // // //     backgroundColor: "#F0F0F0",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     marginRight: 9,
// // // // // // // // //   },

// // // // // // // // //   rankFirst: {
// // // // // // // // //     backgroundColor: "#FFF0B8",
// // // // // // // // //   },

// // // // // // // // //   rankSecond: {
// // // // // // // // //     backgroundColor: "#E8E8E8",
// // // // // // // // //   },

// // // // // // // // //   rankThird: {
// // // // // // // // //     backgroundColor: "#F5D6C7",
// // // // // // // // //   },

// // // // // // // // //   rankText: {
// // // // // // // // //     color: "#59606C",
// // // // // // // // //     fontSize: 11,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   playerAvatar: {
// // // // // // // // //     width: 37,
// // // // // // // // //     height: 37,
// // // // // // // // //     borderRadius: 13,
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     marginRight: 10,
// // // // // // // // //   },

// // // // // // // // //   playerInfo: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     minWidth: 0,
// // // // // // // // //   },

// // // // // // // // //   playerName: {
// // // // // // // // //     color: "#202838",
// // // // // // // // //     fontSize: 13,
// // // // // // // // //     fontWeight: "800",
// // // // // // // // //   },

// // // // // // // // //   topPlayerLabel: {
// // // // // // // // //     color: "#FF6B5A",
// // // // // // // // //     fontSize: 8,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //     marginTop: 2,
// // // // // // // // //     letterSpacing: 0.6,
// // // // // // // // //   },

// // // // // // // // //   scoreContainer: {
// // // // // // // // //     alignItems: "flex-end",
// // // // // // // // //     marginLeft: 8,
// // // // // // // // //   },

// // // // // // // // //   scoreNumber: {
// // // // // // // // //     color: "#172033",
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //   },

// // // // // // // // //   scoreLabel: {
// // // // // // // // //     color: "#9CA1AA",
// // // // // // // // //     fontSize: 7,
// // // // // // // // //     fontWeight: "800",
// // // // // // // // //     marginTop: 1,
// // // // // // // // //   },

// // // // // // // // //   emptyLeaderboard: {
// // // // // // // // //     height: 110,
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //   },

// // // // // // // // //   emptyText: {
// // // // // // // // //     color: "#9A9A9A",
// // // // // // // // //     fontSize: 11,
// // // // // // // // //     marginTop: 7,
// // // // // // // // //   },

// // // // // // // // //   /* ==========================================================
// // // // // // // // //      MOBILE BOTTOM NAV
// // // // // // // // //   ========================================================== */

// // // // // // // // //   bottomNav: {
// // // // // // // // //     height: 70,
// // // // // // // // //     // CHANGED: kept solid white (was already) — the bottom nav is a fixed
// // // // // // // // //     // control bar, so it stays fully opaque for legibility while the
// // // // // // // // //     // animated backdrop shows through everywhere else above it.
// // // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // // //     borderTopWidth: 1,
// // // // // // // // //     borderTopColor: "#EEE7DD",
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "space-around",
// // // // // // // // //     paddingBottom: 4,
// // // // // // // // //   },

// // // // // // // // //   navItem: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //   },

// // // // // // // // //   activeNavIcon: {
// // // // // // // // //     width: 37,
// // // // // // // // //     height: 32,
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //   },

// // // // // // // // //   activeNavText: {
// // // // // // // // //     color: "#5146E5",
// // // // // // // // //     fontSize: 9.5,
// // // // // // // // //     fontWeight: "900",
// // // // // // // // //     marginTop: 3,
// // // // // // // // //   },

// // // // // // // // //   navText: {
// // // // // // // // //     color: "#8C8C8C",
// // // // // // // // //     fontSize: 9.5,
// // // // // // // // //     fontWeight: "700",
// // // // // // // // //     marginTop: 4,
// // // // // // // // //   },
// // // // // // // // // });
// // // // // // // // import React, { useEffect, useRef } from "react";
// // // // // // // // import {
// // // // // // // //   View,
// // // // // // // //   Text,
// // // // // // // //   StyleSheet,
// // // // // // // //   TouchableOpacity,
// // // // // // // //   TextInput,
// // // // // // // //   ScrollView,
// // // // // // // //   SafeAreaView,
// // // // // // // //   StatusBar,
// // // // // // // //   useWindowDimensions,
// // // // // // // //   Animated,
// // // // // // // //   Easing,
// // // // // // // // } from "react-native";
// // // // // // // // import { Ionicons } from "@expo/vector-icons";

// // // // // // // // export interface TopPlayer {
// // // // // // // //   rank: number;
// // // // // // // //   name: string;
// // // // // // // //   score: number;
// // // // // // // //   avatarColor: string;
// // // // // // // // }

// // // // // // // // interface WordScrambleHomeScreenProps {
// // // // // // // //   topPlayers: TopPlayer[];

// // // // // // // //   onPlayOnline: () => void;
// // // // // // // //   onCreateRoom: () => void;
// // // // // // // //   onJoinRoom: (code: string) => void;
// // // // // // // //   onViewAllPlayers: () => void;

// // // // // // // //   // GUEST: opens the guest play modal (nickname + room code, no login)
// // // // // // // //   onGuestPlay?: () => void;

// // // // // // // //   onTabHome: () => void;
// // // // // // // //   onTabLeaderboard: () => void;
// // // // // // // //   onTabProfile: () => void;
// // // // // // // // }

// // // // // // // // /* =====================================================
// // // // // // // //    NEW: ambient animated backdrop for the home screen.
// // // // // // // //    Slow-drifting colour blobs + a few faint floating
// // // // // // // //    letter tiles, all `pointerEvents="none"` so they never
// // // // // // // //    block taps on the real UI sitting above them.
// // // // // // // // ===================================================== */
// // // // // // // // const BG = {
// // // // // // // //   indigo: "#5146E5",
// // // // // // // //   coral: "#FF6B5A",
// // // // // // // //   yellow: "#F4B942",
// // // // // // // //   blue: "#3B82F6",
// // // // // // // //   green: "#26B67A",
// // // // // // // // };

// // // // // // // // const BgBlob: React.FC<{
// // // // // // // //   color: string;
// // // // // // // //   size: number;
// // // // // // // //   left: number;
// // // // // // // //   top: number;
// // // // // // // //   driftX: number;
// // // // // // // //   driftY: number;
// // // // // // // //   duration: number;
// // // // // // // //   opacity?: number;
// // // // // // // // }> = ({ color, size, left, top, driftX, driftY, duration, opacity = 0.1 }) => {
// // // // // // // //   const anim = useRef(new Animated.Value(0)).current;

// // // // // // // //   useEffect(() => {
// // // // // // // //     const loop = Animated.loop(
// // // // // // // //       Animated.sequence([
// // // // // // // //         Animated.timing(anim, {
// // // // // // // //           toValue: 1,
// // // // // // // //           duration,
// // // // // // // //           easing: Easing.inOut(Easing.sin),
// // // // // // // //           useNativeDriver: true,
// // // // // // // //         }),
// // // // // // // //         Animated.timing(anim, {
// // // // // // // //           toValue: 0,
// // // // // // // //           duration,
// // // // // // // //           easing: Easing.inOut(Easing.sin),
// // // // // // // //           useNativeDriver: true,
// // // // // // // //         }),
// // // // // // // //       ])
// // // // // // // //     );
// // // // // // // //     loop.start();
// // // // // // // //     return () => loop.stop();
// // // // // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // // // //   }, []);

// // // // // // // //   const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, driftX] });
// // // // // // // //   const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, driftY] });
// // // // // // // //   const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });

// // // // // // // //   return (
// // // // // // // //     <Animated.View
// // // // // // // //       pointerEvents="none"
// // // // // // // //       style={{
// // // // // // // //         position: "absolute",
// // // // // // // //         left,
// // // // // // // //         top,
// // // // // // // //         width: size,
// // // // // // // //         height: size,
// // // // // // // //         borderRadius: size / 2,
// // // // // // // //         backgroundColor: color,
// // // // // // // //         opacity,
// // // // // // // //         transform: [{ translateX }, { translateY }, { scale }],
// // // // // // // //       }}
// // // // // // // //     />
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const BgLetter: React.FC<{
// // // // // // // //   char: string;
// // // // // // // //   color: string;
// // // // // // // //   left: number;
// // // // // // // //   top: number;
// // // // // // // //   rotate: string;
// // // // // // // //   duration?: number;
// // // // // // // // }> = ({ char, color, left, top, rotate, duration = 2600 }) => {
// // // // // // // //   const bob = useRef(new Animated.Value(0)).current;

// // // // // // // //   useEffect(() => {
// // // // // // // //     const loop = Animated.loop(
// // // // // // // //       Animated.sequence([
// // // // // // // //         Animated.timing(bob, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // // // // //         Animated.timing(bob, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // // // // //       ])
// // // // // // // //     );
// // // // // // // //     loop.start();
// // // // // // // //     return () => loop.stop();
// // // // // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // // // //   }, []);

// // // // // // // //   const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

// // // // // // // //   return (
// // // // // // // //     <Animated.View
// // // // // // // //       pointerEvents="none"
// // // // // // // //       style={{
// // // // // // // //         position: "absolute",
// // // // // // // //         left,
// // // // // // // //         top,
// // // // // // // //         width: 40,
// // // // // // // //         height: 40,
// // // // // // // //         borderRadius: 11,
// // // // // // // //         backgroundColor: color,
// // // // // // // //         alignItems: "center",
// // // // // // // //         justifyContent: "center",
// // // // // // // //         opacity: 0.1,
// // // // // // // //         transform: [{ translateY }, { rotate }],
// // // // // // // //       }}
// // // // // // // //     >
// // // // // // // //       <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "900" }}>{char}</Text>
// // // // // // // //     </Animated.View>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // /** Full ambient background: a handful of drifting blobs + faint floating letters. */
// // // // // // // // const AnimatedHomeBackground: React.FC<{ width: number; height: number }> = ({ width, height }) => {
// // // // // // // //   return (
// // // // // // // //     <View style={StyleSheet.absoluteFill} pointerEvents="none">
// // // // // // // //       <BgBlob color={BG.indigo} size={300} left={-80} top={-60} driftX={35} driftY={25} duration={5200} opacity={0.09} />
// // // // // // // //       <BgBlob color={BG.coral} size={240} left={width - 160} top={40} driftX={-25} driftY={35} duration={4600} opacity={0.1} />
// // // // // // // //       <BgBlob color={BG.yellow} size={210} left={width * 0.4} top={height * 0.45} driftX={30} driftY={-20} duration={6000} opacity={0.08} />
// // // // // // // //       <BgBlob color={BG.green} size={220} left={-70} top={height * 0.6} driftX={30} driftY={-30} duration={5400} opacity={0.08} />
// // // // // // // //       <BgBlob color={BG.blue} size={180} left={width - 120} top={height * 0.75} driftX={-25} driftY={-20} duration={4900} opacity={0.09} />

// // // // // // // //       <BgLetter char="W" color={BG.yellow} left={width * 0.08} top={height * 0.15} rotate="-8deg" duration={2400} />
// // // // // // // //       <BgLetter char="O" color={BG.blue} left={width * 0.82} top={height * 0.22} rotate="7deg" duration={2800} />
// // // // // // // //       <BgLetter char="R" color={BG.coral} left={width * 0.85} top={height * 0.58} rotate="-6deg" duration={2600} />
// // // // // // // //       <BgLetter char="D" color={BG.green} left={width * 0.06} top={height * 0.72} rotate="5deg" duration={3000} />
// // // // // // // //     </View>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const WordScrambleHomeScreen: React.FC<WordScrambleHomeScreenProps> = ({
// // // // // // // //   topPlayers,
// // // // // // // //   onPlayOnline,
// // // // // // // //   onCreateRoom,
// // // // // // // //   onJoinRoom,
// // // // // // // //   onViewAllPlayers,
// // // // // // // //   onGuestPlay, // GUEST
// // // // // // // //   onTabHome,
// // // // // // // //   onTabLeaderboard,
// // // // // // // //   onTabProfile,
// // // // // // // // }) => {
// // // // // // // //   const { width, height } = useWindowDimensions();

// // // // // // // //   const isMobile = width < 768;
// // // // // // // //   const isTablet = width >= 768 && width < 1100;

// // // // // // // //   const [joinCode, setJoinCode] = React.useState("");

// // // // // // // //   const handleJoinRoom = () => {
// // // // // // // //     const code = joinCode.trim();

// // // // // // // //     if (!code) {
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     onJoinRoom(code);
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#FFF9F0" />

// // // // // // // //       {/* NEW: ambient animated backdrop, sits behind the whole screen */}
// // // // // // // //       <AnimatedHomeBackground width={width} height={height} />

// // // // // // // //       <View style={styles.root}>
// // // // // // // //         {/* =====================================================
// // // // // // // //             DESKTOP SIDEBAR
// // // // // // // //         ===================================================== */}

// // // // // // // //         {!isMobile && (
// // // // // // // //           <View style={[styles.sidebar, isTablet && styles.sidebarTablet]}>
// // // // // // // //             {/* Brand */}

// // // // // // // //             <View style={styles.sidebarBrand}>
// // // // // // // //               <View style={styles.sidebarLogo}>
// // // // // // // //                 <Text style={styles.logoW}>W</Text>
// // // // // // // //                 <Text style={styles.logoS}>S</Text>
// // // // // // // //               </View>

// // // // // // // //               <View>
// // // // // // // //                 <Text style={styles.sidebarBrandTitle}>
// // // // // // // //                   Word
// // // // // // // //                   <Text style={styles.sidebarBrandAccent}> Scramble</Text>
// // // // // // // //                 </Text>

// // // // // // // //                 <Text style={styles.sidebarBrandSubtitle}>
// // // // // // // //                   Think fast. Play smart.
// // // // // // // //                 </Text>
// // // // // // // //               </View>
// // // // // // // //             </View>

// // // // // // // //             {/* Sidebar Navigation */}

// // // // // // // //             <View style={styles.sidebarNavigation}>
// // // // // // // //               <TouchableOpacity
// // // // // // // //                 activeOpacity={0.8}
// // // // // // // //                 style={[styles.sidebarNavItem, styles.sidebarNavActive]}
// // // // // // // //                 onPress={onTabHome}
// // // // // // // //               >
// // // // // // // //                 <View style={styles.sidebarActiveIcon}>
// // // // // // // //                   <Ionicons name="home" size={21} color="#FFFFFF" />
// // // // // // // //                 </View>

// // // // // // // //                 <Text style={styles.sidebarActiveText}>Home</Text>
// // // // // // // //               </TouchableOpacity>

// // // // // // // //               <TouchableOpacity
// // // // // // // //                 activeOpacity={0.8}
// // // // // // // //                 style={styles.sidebarNavItem}
// // // // // // // //                 onPress={onTabLeaderboard}
// // // // // // // //               >
// // // // // // // //                 <Ionicons name="trophy-outline" size={22} color="#657084" />

// // // // // // // //                 <Text style={styles.sidebarText}>Rankings</Text>
// // // // // // // //               </TouchableOpacity>

// // // // // // // //               <TouchableOpacity
// // // // // // // //                 activeOpacity={0.8}
// // // // // // // //                 style={styles.sidebarNavItem}
// // // // // // // //                 onPress={onTabProfile}
// // // // // // // //               >
// // // // // // // //                 <Ionicons name="person-outline" size={22} color="#657084" />

// // // // // // // //                 <Text style={styles.sidebarText}>Profile</Text>
// // // // // // // //               </TouchableOpacity>
// // // // // // // //             </View>

// // // // // // // //             {/* Sidebar Bottom Card */}

// // // // // // // //             <View style={styles.sidebarBottomCard}>
// // // // // // // //               <View style={styles.sidebarBottomIcon}>
// // // // // // // //                 <Ionicons name="sparkles" size={21} color="#FFFFFF" />
// // // // // // // //               </View>

// // // // // // // //               <Text style={styles.sidebarBottomTitle}>
// // // // // // // //                 Ready for a challenge?
// // // // // // // //               </Text>

// // // // // // // //               <Text style={styles.sidebarBottomText}>
// // // // // // // //                 Unscramble words and climb the rankings.
// // // // // // // //               </Text>
// // // // // // // //             </View>
// // // // // // // //           </View>
// // // // // // // //         )}

// // // // // // // //         {/* =====================================================
// // // // // // // //             MAIN CONTENT
// // // // // // // //         ===================================================== */}

// // // // // // // //         <View style={[styles.main, !isMobile && styles.mainDesktop]}>
// // // // // // // //           {/* ===================================================
// // // // // // // //               MOBILE HEADER
// // // // // // // //           =================================================== */}

// // // // // // // //           {isMobile && (
// // // // // // // //             <View style={styles.mobileHeader}>
// // // // // // // //               <View style={styles.mobileBrand}>
// // // // // // // //                 <View style={styles.mobileLogo}>
// // // // // // // //                   <Text style={styles.logoW}>W</Text>
// // // // // // // //                   <Text style={styles.logoS}>S</Text>
// // // // // // // //                 </View>

// // // // // // // //                 <View>
// // // // // // // //                   <Text style={styles.mobileBrandTitle}>
// // // // // // // //                     Word
// // // // // // // //                     <Text style={styles.mobileBrandAccent}> Scramble</Text>
// // // // // // // //                   </Text>

// // // // // // // //                   <Text style={styles.mobileBrandSubtitle}>
// // // // // // // //                     Think fast. Play smart.
// // // // // // // //                   </Text>
// // // // // // // //                 </View>
// // // // // // // //               </View>

// // // // // // // //               <TouchableOpacity
// // // // // // // //                 style={styles.mobileNotification}
// // // // // // // //                 activeOpacity={0.8}
// // // // // // // //               >
// // // // // // // //                 <Ionicons
// // // // // // // //                   name="notifications-outline"
// // // // // // // //                   size={20}
// // // // // // // //                   color="#172033"
// // // // // // // //                 />
// // // // // // // //               </TouchableOpacity>
// // // // // // // //             </View>
// // // // // // // //           )}

// // // // // // // //           {/* ===================================================
// // // // // // // //               DESKTOP HEADER
// // // // // // // //           =================================================== */}

// // // // // // // //           {!isMobile && (
// // // // // // // //             <View style={styles.desktopTopHeader}>
// // // // // // // //               <View>
// // // // // // // //                 <Text style={styles.desktopWelcome}>Welcome back!</Text>

// // // // // // // //                 <Text style={styles.desktopWelcomeSub}>Ready to play?</Text>
// // // // // // // //               </View>

// // // // // // // //               <TouchableOpacity style={styles.desktopNotification}>
// // // // // // // //                 <Ionicons
// // // // // // // //                   name="notifications-outline"
// // // // // // // //                   size={20}
// // // // // // // //                   color="#172033"
// // // // // // // //                 />
// // // // // // // //               </TouchableOpacity>
// // // // // // // //             </View>
// // // // // // // //           )}

// // // // // // // //           {/* ===================================================
// // // // // // // //               SCROLL CONTENT
// // // // // // // //           =================================================== */}

// // // // // // // //           <ScrollView
// // // // // // // //             showsVerticalScrollIndicator={false}
// // // // // // // //             horizontal={false}
// // // // // // // //             contentContainerStyle={[
// // // // // // // //               styles.scrollContent,
// // // // // // // //               isMobile && styles.scrollContentMobile,
// // // // // // // //               isTablet && styles.scrollContentTablet,
// // // // // // // //             ]}
// // // // // // // //           >
// // // // // // // //             {/* =================================================
// // // // // // // //                 HERO
// // // // // // // //             ================================================= */}

// // // // // // // //             <View style={[styles.heroSection, isMobile && styles.heroMobile]}>
// // // // // // // //               <Text style={styles.smallGreeting}>READY TO PLAY?</Text>

// // // // // // // //               <Text
// // // // // // // //                 style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}
// // // // // // // //               >
// // // // // // // //                 Unscramble.
// // // // // // // //                 {"\n"}

// // // // // // // //                 <Text style={styles.heroAccent}>Outsmart.</Text>
// // // // // // // //               </Text>

// // // // // // // //               <Text
// // // // // // // //                 style={[
// // // // // // // //                   styles.heroDescription,
// // // // // // // //                   isMobile && styles.heroDescriptionMobile,
// // // // // // // //                 ]}
// // // // // // // //               >
// // // // // // // //                 Arrange the letters, find the hidden word,
// // // // // // // //                 and race against your friends.
// // // // // // // //               </Text>
// // // // // // // //             </View>

// // // // // // // //             {/* =================================================
// // // // // // // //                 WORD LETTERS
// // // // // // // //             ================================================= */}

// // // // // // // //             <View
// // // // // // // //               style={[
// // // // // // // //                 styles.lettersContainer,
// // // // // // // //                 isMobile && styles.lettersMobile,
// // // // // // // //               ]}
// // // // // // // //             >
// // // // // // // //               <View
// // // // // // // //                 style={[
// // // // // // // //                   styles.letterTile,
// // // // // // // //                   styles.tileYellow,
// // // // // // // //                   styles.tileRotateLeft,
// // // // // // // //                 ]}
// // // // // // // //               >
// // // // // // // //                 <Text style={styles.letterText}>W</Text>
// // // // // // // //               </View>

// // // // // // // //               <View
// // // // // // // //                 style={[
// // // // // // // //                   styles.letterTile,
// // // // // // // //                   styles.tileBlue,
// // // // // // // //                   styles.tileRotateRight,
// // // // // // // //                 ]}
// // // // // // // //               >
// // // // // // // //                 <Text style={styles.letterText}>O</Text>
// // // // // // // //               </View>

// // // // // // // //               <View style={[styles.letterTile, styles.tilePink]}>
// // // // // // // //                 <Text style={styles.letterText}>R</Text>
// // // // // // // //               </View>

// // // // // // // //               <View
// // // // // // // //                 style={[
// // // // // // // //                   styles.letterTile,
// // // // // // // //                   styles.tileGreen,
// // // // // // // //                   styles.tileRotateLeft,
// // // // // // // //                 ]}
// // // // // // // //               >
// // // // // // // //                 <Text style={styles.letterText}>D</Text>
// // // // // // // //               </View>
// // // // // // // //             </View>

// // // // // // // //             {/* =================================================
// // // // // // // //                 QUICK MATCH
// // // // // // // //             ================================================= */}

// // // // // // // //             <View style={[styles.playCard, isMobile && styles.playCardMobile]}>
// // // // // // // //               <View style={styles.playCardTop}>
// // // // // // // //                 <View style={styles.lightningCircle}>
// // // // // // // //                   <Ionicons name="flash" size={21} color="#FFFFFF" />
// // // // // // // //                 </View>

// // // // // // // //                 <View style={styles.playInfo}>
// // // // // // // //                   <Text style={styles.playCardTitle}>Quick Match</Text>

// // // // // // // //                   <Text style={styles.playCardDescription}>
// // // // // // // //                     Jump into a live word battle
// // // // // // // //                   </Text>
// // // // // // // //                 </View>

// // // // // // // //                 <View style={styles.playersBadge}>
// // // // // // // //                   <Ionicons name="people-outline" size={14} color="#3949AB" />

// // // // // // // //                   <Text style={styles.playersBadgeText}>2–8</Text>
// // // // // // // //                 </View>
// // // // // // // //               </View>

// // // // // // // //               {/* IMPORTANT:
// // // // // // // //                   Button no longer full screen.
// // // // // // // //                   Desktop = 320px
// // // // // // // //                   Mobile = 230px
// // // // // // // //               */}

// // // // // // // //               <TouchableOpacity
// // // // // // // //                 activeOpacity={0.88}
// // // // // // // //                 onPress={onPlayOnline}
// // // // // // // //                 style={[styles.playButton, isMobile && styles.playButtonMobile]}
// // // // // // // //               >
// // // // // // // //                 <Text style={styles.playButtonText}>PLAY ONLINE</Text>

// // // // // // // //                 <View style={styles.playArrow}>
// // // // // // // //                   <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
// // // // // // // //                 </View>
// // // // // // // //               </TouchableOpacity>

// // // // // // // //               {/* GUEST: play without an account, just a nickname */}
// // // // // // // //               {onGuestPlay && (
// // // // // // // //                 <TouchableOpacity
// // // // // // // //                   activeOpacity={0.85}
// // // // // // // //                   onPress={onGuestPlay}
// // // // // // // //                   style={[
// // // // // // // //                     styles.guestButton,
// // // // // // // //                     isMobile && styles.guestButtonMobile,
// // // // // // // //                   ]}
// // // // // // // //                 >
// // // // // // // //                   <Ionicons name="person-outline" size={18} color="#FF6B5A" />

// // // // // // // //                   <Text style={styles.guestButtonText}>PLAY AS GUEST</Text>
// // // // // // // //                 </TouchableOpacity>
// // // // // // // //               )}
// // // // // // // //             </View>

// // // // // // // //             {/* =================================================
// // // // // // // //                 PLAY WITH FRIENDS
// // // // // // // //             ================================================= */}

// // // // // // // //             <View style={styles.sectionHeader}>
// // // // // // // //               <View>
// // // // // // // //                 <Text style={styles.sectionTitle}>Play with friends</Text>

// // // // // // // //                 <Text style={styles.sectionSubtitle}>
// // // // // // // //                   Create or join a private room
// // // // // // // //                 </Text>
// // // // // // // //               </View>

// // // // // // // //               <Ionicons
// // // // // // // //                 name="people-circle-outline"
// // // // // // // //                 size={28}
// // // // // // // //                 color="#FF6B5A"
// // // // // // // //               />
// // // // // // // //             </View>

// // // // // // // //             {/* =================================================
// // // // // // // //                 ROOM CARDS
// // // // // // // //             ================================================= */}

// // // // // // // //             <View
// // // // // // // //               style={[
// // // // // // // //                 styles.roomContainer,
// // // // // // // //                 isMobile && styles.roomContainerMobile,
// // // // // // // //               ]}
// // // // // // // //             >
// // // // // // // //               {/* CREATE ROOM */}

// // // // // // // //               <TouchableOpacity
// // // // // // // //                 activeOpacity={0.85}
// // // // // // // //                 onPress={onCreateRoom}
// // // // // // // //                 style={[
// // // // // // // //                   styles.createRoomCard,
// // // // // // // //                   isMobile && styles.roomCardMobile,
// // // // // // // //                 ]}
// // // // // // // //               >
// // // // // // // //                 <View style={styles.roomIconCreate}>
// // // // // // // //                   <Ionicons name="add" size={24} color="#FFFFFF" />
// // // // // // // //                 </View>

// // // // // // // //                 <Text style={styles.roomCardTitle}>Create Room</Text>

// // // // // // // //                 <Text style={styles.roomCardText}>Start a new game</Text>

// // // // // // // //                 <View style={styles.roomArrow}>
// // // // // // // //                   <Ionicons name="arrow-forward" size={17} color="#FF6B5A" />
// // // // // // // //                 </View>
// // // // // // // //               </TouchableOpacity>

// // // // // // // //               {/* JOIN ROOM */}

// // // // // // // //               <View
// // // // // // // //                 style={[styles.joinRoomCard, isMobile && styles.roomCardMobile]}
// // // // // // // //               >
// // // // // // // //                 <View style={styles.roomIconJoin}>
// // // // // // // //                   <Ionicons name="enter-outline" size={22} color="#FFFFFF" />
// // // // // // // //                 </View>

// // // // // // // //                 <Text style={styles.roomCardTitle}>Join Room</Text>

// // // // // // // //                 <Text style={styles.roomCardText}>Enter room code</Text>

// // // // // // // //                 <View style={styles.joinInputRow}>
// // // // // // // //                   <TextInput
// // // // // // // //                     value={joinCode}
// // // // // // // //                     onChangeText={setJoinCode}
// // // // // // // //                     placeholder="ROOM CODE"
// // // // // // // //                     placeholderTextColor="#9A9A9A"
// // // // // // // //                     autoCapitalize="characters"
// // // // // // // //                     maxLength={8}
// // // // // // // //                     style={styles.joinInput}
// // // // // // // //                   />

// // // // // // // //                   <TouchableOpacity
// // // // // // // //                     activeOpacity={0.8}
// // // // // // // //                     onPress={handleJoinRoom}
// // // // // // // //                     style={styles.joinButton}
// // // // // // // //                   >
// // // // // // // //                     <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
// // // // // // // //                   </TouchableOpacity>
// // // // // // // //                 </View>
// // // // // // // //               </View>
// // // // // // // //             </View>

// // // // // // // //             {/* =================================================
// // // // // // // //                 DAILY CHALLENGE
// // // // // // // //             ================================================= */}

// // // // // // // //             <View
// // // // // // // //               style={[
// // // // // // // //                 styles.challengeCard,
// // // // // // // //                 isMobile && styles.challengeCardMobile,
// // // // // // // //               ]}
// // // // // // // //             >
// // // // // // // //               <View style={styles.challengeLeft}>
// // // // // // // //                 <View style={styles.challengeIcon}>
// // // // // // // //                   <Ionicons name="trophy" size={22} color="#FFFFFF" />
// // // // // // // //                 </View>

// // // // // // // //                 <View style={styles.challengeInfo}>
// // // // // // // //                   <Text style={styles.challengeTitle}>Daily Challenge</Text>

// // // // // // // //                   <Text style={styles.challengeText}>
// // // // // // // //                     Solve today's puzzle
// // // // // // // //                   </Text>
// // // // // // // //                 </View>
// // // // // // // //               </View>

// // // // // // // //               <View style={styles.challengeProgress}>
// // // // // // // //                 <Text style={styles.progressNumber}>3/5</Text>

// // // // // // // //                 <Text style={styles.progressText}>rounds</Text>
// // // // // // // //               </View>
// // // // // // // //             </View>

// // // // // // // //             {/* =================================================
// // // // // // // //                 LEADERBOARD
// // // // // // // //             ================================================= */}

// // // // // // // //             <View style={styles.leaderHeader}>
// // // // // // // //               <View>
// // // // // // // //                 <Text style={styles.sectionTitle}>Top Players</Text>

// // // // // // // //                 <Text style={styles.sectionSubtitle}>Today's leaderboard</Text>
// // // // // // // //               </View>

// // // // // // // //               <TouchableOpacity activeOpacity={0.7} onPress={onViewAllPlayers}>
// // // // // // // //                 <Text style={styles.viewAll}>View all</Text>
// // // // // // // //               </TouchableOpacity>
// // // // // // // //             </View>

// // // // // // // //             <View style={styles.leaderboardCard}>
// // // // // // // //               {topPlayers.length === 0 ? (
// // // // // // // //                 <View style={styles.emptyLeaderboard}>
// // // // // // // //                   <Ionicons name="trophy-outline" size={28} color="#B0B0B0" />

// // // // // // // //                   <Text style={styles.emptyText}>No players yet</Text>
// // // // // // // //                 </View>
// // // // // // // //               ) : (
// // // // // // // //                 topPlayers.map((player, index) => (
// // // // // // // //                   <View
// // // // // // // //                     key={`${player.rank}-${player.name}`}
// // // // // // // //                     style={[
// // // // // // // //                       styles.playerRow,
// // // // // // // //                       index === topPlayers.length - 1 && styles.lastPlayerRow,
// // // // // // // //                     ]}
// // // // // // // //                   >
// // // // // // // //                     <View
// // // // // // // //                       style={[
// // // // // // // //                         styles.rankCircle,
// // // // // // // //                         player.rank === 1 && styles.rankFirst,
// // // // // // // //                         player.rank === 2 && styles.rankSecond,
// // // // // // // //                         player.rank === 3 && styles.rankThird,
// // // // // // // //                       ]}
// // // // // // // //                     >
// // // // // // // //                       <Text style={styles.rankText}>{player.rank}</Text>
// // // // // // // //                     </View>

// // // // // // // //                     <View
// // // // // // // //                       style={[
// // // // // // // //                         styles.playerAvatar,
// // // // // // // //                         {
// // // // // // // //                           backgroundColor: player.avatarColor || "#FF6B5A",
// // // // // // // //                         },
// // // // // // // //                       ]}
// // // // // // // //                     >
// // // // // // // //                       <Ionicons name="person" size={17} color="#FFFFFF" />
// // // // // // // //                     </View>

// // // // // // // //                     <View style={styles.playerInfo}>
// // // // // // // //                       <Text style={styles.playerName}>{player.name}</Text>

// // // // // // // //                       {player.rank === 1 && (
// // // // // // // //                         <Text style={styles.topPlayerLabel}>TOP PLAYER</Text>
// // // // // // // //                       )}
// // // // // // // //                     </View>

// // // // // // // //                     <View style={styles.scoreContainer}>
// // // // // // // //                       <Text style={styles.scoreNumber}>{player.score}</Text>

// // // // // // // //                       <Text style={styles.scoreLabel}>PTS</Text>
// // // // // // // //                     </View>
// // // // // // // //                   </View>
// // // // // // // //                 ))
// // // // // // // //               )}
// // // // // // // //             </View>

// // // // // // // //             <View style={{ height: isMobile ? 90 : 40 }} />
// // // // // // // //           </ScrollView>

// // // // // // // //           {/* =================================================
// // // // // // // //               MOBILE BOTTOM NAV
// // // // // // // //           ================================================= */}

// // // // // // // //           {isMobile && (
// // // // // // // //             <View style={styles.bottomNav}>
// // // // // // // //               <TouchableOpacity
// // // // // // // //                 style={styles.navItem}
// // // // // // // //                 activeOpacity={0.8}
// // // // // // // //                 onPress={onTabHome}
// // // // // // // //               >
// // // // // // // //                 <View style={styles.activeNavIcon}>
// // // // // // // //                   <Ionicons name="home" size={20} color="#FFFFFF" />
// // // // // // // //                 </View>

// // // // // // // //                 <Text style={styles.activeNavText}>Home</Text>
// // // // // // // //               </TouchableOpacity>

// // // // // // // //               <TouchableOpacity
// // // // // // // //                 style={styles.navItem}
// // // // // // // //                 activeOpacity={0.8}
// // // // // // // //                 onPress={onTabLeaderboard}
// // // // // // // //               >
// // // // // // // //                 <Ionicons name="trophy-outline" size={21} color="#8C8C8C" />

// // // // // // // //                 <Text style={styles.navText}>Rankings</Text>
// // // // // // // //               </TouchableOpacity>

// // // // // // // //               <TouchableOpacity
// // // // // // // //                 style={styles.navItem}
// // // // // // // //                 activeOpacity={0.8}
// // // // // // // //                 onPress={onTabProfile}
// // // // // // // //               >
// // // // // // // //                 <Ionicons name="person-outline" size={21} color="#8C8C8C" />

// // // // // // // //                 <Text style={styles.navText}>Profile</Text>
// // // // // // // //               </TouchableOpacity>
// // // // // // // //             </View>
// // // // // // // //           )}
// // // // // // // //         </View>
// // // // // // // //       </View>
// // // // // // // //     </SafeAreaView>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default WordScrambleHomeScreen;

// // // // // // // // /* ============================================================
// // // // // // // //    STYLES
// // // // // // // // ============================================================ */

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   safeArea: {
// // // // // // // //     flex: 1,
// // // // // // // //     backgroundColor: "#FFF9F0",
// // // // // // // //   },

// // // // // // // //   root: {
// // // // // // // //     flex: 1,
// // // // // // // //     flexDirection: "row",
// // // // // // // //     // CHANGED: transparent so the AnimatedHomeBackground behind it (which
// // // // // // // //     // sits on safeArea, one level up) shows through the gaps between the
// // // // // // // //     // sidebar/main content instead of being covered by a solid colour.
// // // // // // // //     backgroundColor: "transparent",
// // // // // // // //   },

// // // // // // // //   /* ==========================================================
// // // // // // // //      SIDEBAR
// // // // // // // //   ========================================================== */

// // // // // // // //   sidebar: {
// // // // // // // //     width: 292,
// // // // // // // //     // CHANGED: was a fully opaque "#FFFDF9" — now a near-opaque version of
// // // // // // // //     // the same colour so the ambient background is *very* faintly visible
// // // // // // // //     // behind the nav without hurting legibility of its text/icons.
// // // // // // // //     backgroundColor: "rgba(255,253,249,0.97)",
// // // // // // // //     borderRightWidth: 1,
// // // // // // // //     borderRightColor: "#EDE5D9",
// // // // // // // //     paddingHorizontal: 19,
// // // // // // // //     paddingTop: 22,
// // // // // // // //     paddingBottom: 18,
// // // // // // // //     justifyContent: "space-between",
// // // // // // // //   },

// // // // // // // //   sidebarTablet: {
// // // // // // // //     width: 245,
// // // // // // // //   },

// // // // // // // //   sidebarBrand: {
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //   },

// // // // // // // //   sidebarLogo: {
// // // // // // // //     width: 58,
// // // // // // // //     height: 58,
// // // // // // // //     borderRadius: 17,
// // // // // // // //     backgroundColor: "#172033",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     flexDirection: "row",
// // // // // // // //     marginRight: 11,
// // // // // // // //     transform: [{ rotate: "-5deg" }],
// // // // // // // //   },

// // // // // // // //   logoW: {
// // // // // // // //     color: "#FFD166",
// // // // // // // //     fontSize: 21,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   logoS: {
// // // // // // // //     color: "#FF6B5A",
// // // // // // // //     fontSize: 21,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   sidebarBrandTitle: {
// // // // // // // //     color: "#172033",
// // // // // // // //     fontSize: 19,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   sidebarBrandAccent: {
// // // // // // // //     color: "#FF6B5A",
// // // // // // // //   },

// // // // // // // //   sidebarBrandSubtitle: {
// // // // // // // //     color: "#7B8491",
// // // // // // // //     fontSize: 10.5,
// // // // // // // //     fontWeight: "600",
// // // // // // // //     marginTop: 2,
// // // // // // // //   },

// // // // // // // //   sidebarNavigation: {
// // // // // // // //     marginTop: 50,
// // // // // // // //     flex: 1,
// // // // // // // //   },

// // // // // // // //   sidebarNavItem: {
// // // // // // // //     height: 58,
// // // // // // // //     borderRadius: 15,
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     paddingHorizontal: 15,
// // // // // // // //     marginBottom: 7,
// // // // // // // //   },

// // // // // // // //   sidebarNavActive: {
// // // // // // // //     backgroundColor: "#EEE9FF",
// // // // // // // //   },

// // // // // // // //   sidebarActiveIcon: {
// // // // // // // //     width: 40,
// // // // // // // //     height: 40,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     marginRight: 11,
// // // // // // // //   },

// // // // // // // //   sidebarActiveText: {
// // // // // // // //     color: "#5146E5",
// // // // // // // //     fontSize: 15,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   sidebarText: {
// // // // // // // //     color: "#596579",
// // // // // // // //     fontSize: 15,
// // // // // // // //     fontWeight: "700",
// // // // // // // //     marginLeft: 16,
// // // // // // // //   },

// // // // // // // //   sidebarBottomCard: {
// // // // // // // //     backgroundColor: "#172033",
// // // // // // // //     borderRadius: 19,
// // // // // // // //     padding: 17,
// // // // // // // //     minHeight: 137,
// // // // // // // //   },

// // // // // // // //   sidebarBottomIcon: {
// // // // // // // //     width: 43,
// // // // // // // //     height: 43,
// // // // // // // //     borderRadius: 13,
// // // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     marginBottom: 11,
// // // // // // // //   },

// // // // // // // //   sidebarBottomTitle: {
// // // // // // // //     color: "#FFFFFF",
// // // // // // // //     fontSize: 13,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   sidebarBottomText: {
// // // // // // // //     color: "#AEB7C7",
// // // // // // // //     fontSize: 10.5,
// // // // // // // //     lineHeight: 17,
// // // // // // // //     marginTop: 5,
// // // // // // // //   },

// // // // // // // //   main: {
// // // // // // // //     flex: 1,
// // // // // // // //     minWidth: 0,

// // // // // // // //     backgroundColor: "transparent",
// // // // // // // //   },

// // // // // // // //   mainDesktop: {
// // // // // // // //     overflow: "hidden",
// // // // // // // //   },

// // // // // // // //   desktopTopHeader: {
// // // // // // // //     height: 76,
// // // // // // // //     paddingHorizontal: 34,
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "space-between",
// // // // // // // //   },

// // // // // // // //   desktopWelcome: {
// // // // // // // //     color: "#172033",
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   desktopWelcomeSub: {
// // // // // // // //     color: "#9299A4",
// // // // // // // //     fontSize: 11,
// // // // // // // //     marginTop: 3,
// // // // // // // //   },

// // // // // // // //   desktopNotification: {
// // // // // // // //     width: 44,
// // // // // // // //     height: 44,
// // // // // // // //     borderRadius: 22,
// // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: "#EDE5D9",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //   },

// // // // // // // //   /* ==========================================================
// // // // // // // //      MOBILE HEADER
// // // // // // // //   ========================================================== */

// // // // // // // //   mobileHeader: {
// // // // // // // //     height: 76,
// // // // // // // //     paddingHorizontal: 17,
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "space-between",
// // // // // // // //     // CHANGED: transparent so the animated backdrop shows through here too
// // // // // // // //     backgroundColor: "transparent",
// // // // // // // //   },

// // // // // // // //   mobileBrand: {
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //   },

// // // // // // // //   mobileLogo: {
// // // // // // // //     width: 45,
// // // // // // // //     height: 45,
// // // // // // // //     borderRadius: 14,
// // // // // // // //     backgroundColor: "#172033",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     flexDirection: "row",
// // // // // // // //     marginRight: 10,
// // // // // // // //     transform: [{ rotate: "-5deg" }],
// // // // // // // //   },

// // // // // // // //   mobileBrandTitle: {
// // // // // // // //     color: "#172033",
// // // // // // // //     fontSize: 17,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   mobileBrandAccent: {
// // // // // // // //     color: "#FF6B5A",
// // // // // // // //   },

// // // // // // // //   mobileBrandSubtitle: {
// // // // // // // //     color: "#7B8491",
// // // // // // // //     fontSize: 9.5,
// // // // // // // //     marginTop: 2,
// // // // // // // //     fontWeight: "600",
// // // // // // // //   },

// // // // // // // //   mobileNotification: {
// // // // // // // //     width: 40,
// // // // // // // //     height: 40,
// // // // // // // //     borderRadius: 20,
// // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: "#EDE5D9",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //   },

// // // // // // // //   scrollContent: {
// // // // // // // //     paddingHorizontal: 34,
// // // // // // // //     paddingTop: 15,
// // // // // // // //   },

// // // // // // // //   scrollContentTablet: {
// // // // // // // //     paddingHorizontal: 25,
// // // // // // // //   },

// // // // // // // //   scrollContentMobile: {
// // // // // // // //     paddingHorizontal: 17,
// // // // // // // //     paddingTop: 5,
// // // // // // // //   },

// // // // // // // //   /* ==========================================================
// // // // // // // //      HERO
// // // // // // // //   ========================================================== */

// // // // // // // //   heroSection: {
// // // // // // // //     marginTop: 7,
// // // // // // // //   },

// // // // // // // //   heroMobile: {
// // // // // // // //     marginTop: 5,
// // // // // // // //   },

// // // // // // // //   smallGreeting: {
// // // // // // // //     color: "#FF6B5A",
// // // // // // // //     fontSize: 11,
// // // // // // // //     fontWeight: "900",
// // // // // // // //     letterSpacing: 1.4,
// // // // // // // //     marginBottom: 6,
// // // // // // // //   },

// // // // // // // //   heroTitle: {
// // // // // // // //     color: "#172033",
// // // // // // // //     fontSize: 45,
// // // // // // // //     lineHeight: 48,
// // // // // // // //     fontWeight: "900",
// // // // // // // //     letterSpacing: -1.5,
// // // // // // // //   },

// // // // // // // //   heroTitleMobile: {
// // // // // // // //     fontSize: 37,
// // // // // // // //     lineHeight: 40,
// // // // // // // //     letterSpacing: -1,
// // // // // // // //   },

// // // // // // // //   heroAccent: {
// // // // // // // //     color: "#5146E5",
// // // // // // // //   },

// // // // // // // //   heroDescription: {
// // // // // // // //     color: "#7A8290",
// // // // // // // //     fontSize: 13.5,
// // // // // // // //     lineHeight: 20,
// // // // // // // //     marginTop: 10,
// // // // // // // //     maxWidth: 390,
// // // // // // // //   },

// // // // // // // //   heroDescriptionMobile: {
// // // // // // // //     fontSize: 12.5,
// // // // // // // //     lineHeight: 18,
// // // // // // // //     maxWidth: 310,
// // // // // // // //   },

// // // // // // // //   lettersContainer: {
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     marginTop: 24,
// // // // // // // //     marginBottom: 25,
// // // // // // // //     gap: 9,
// // // // // // // //   },

// // // // // // // //   lettersMobile: {
// // // // // // // //     marginTop: 21,
// // // // // // // //     marginBottom: 20,
// // // // // // // //   },

// // // // // // // //   letterTile: {
// // // // // // // //     width: 54,
// // // // // // // //     height: 54,
// // // // // // // //     borderRadius: 14,
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     shadowColor: "#000000",
// // // // // // // //     shadowOffset: {
// // // // // // // //       width: 0,
// // // // // // // //       height: 4,
// // // // // // // //     },
// // // // // // // //     shadowOpacity: 0.12,
// // // // // // // //     shadowRadius: 6,
// // // // // // // //     elevation: 3,
// // // // // // // //   },

// // // // // // // //   letterText: {
// // // // // // // //     color: "#FFFFFF",
// // // // // // // //     fontSize: 23,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   tileYellow: {
// // // // // // // //     backgroundColor: "#F4B942",
// // // // // // // //   },

// // // // // // // //   tileBlue: {
// // // // // // // //     backgroundColor: "#3B82F6",
// // // // // // // //   },

// // // // // // // //   tilePink: {
// // // // // // // //     backgroundColor: "#F15B6C",
// // // // // // // //   },

// // // // // // // //   tileGreen: {
// // // // // // // //     backgroundColor: "#26B67A",
// // // // // // // //   },

// // // // // // // //   tileRotateLeft: {
// // // // // // // //     transform: [{ rotate: "-6deg" }],
// // // // // // // //   },

// // // // // // // //   tileRotateRight: {
// // // // // // // //     transform: [{ rotate: "6deg" }],
// // // // // // // //   },

// // // // // // // //   /* ==========================================================
// // // // // // // //      PLAY CARD
// // // // // // // //   ========================================================== */

// // // // // // // //   playCard: {
// // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // //     borderRadius: 22,
// // // // // // // //     padding: 17,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: "#EEE7DD",
// // // // // // // //     shadowColor: "#000000",
// // // // // // // //     shadowOffset: {
// // // // // // // //       width: 0,
// // // // // // // //       height: 6,
// // // // // // // //     },
// // // // // // // //     shadowOpacity: 0.07,
// // // // // // // //     shadowRadius: 14,
// // // // // // // //     elevation: 3,
// // // // // // // //     alignSelf: "stretch",
// // // // // // // //   },

// // // // // // // //   playCardMobile: {
// // // // // // // //     padding: 15,
// // // // // // // //     borderRadius: 19,
// // // // // // // //   },

// // // // // // // //   playCardTop: {
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     marginBottom: 16,
// // // // // // // //   },

// // // // // // // //   lightningCircle: {
// // // // // // // //     width: 43,
// // // // // // // //     height: 43,
// // // // // // // //     borderRadius: 14,
// // // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     marginRight: 12,
// // // // // // // //   },

// // // // // // // //   playInfo: {
// // // // // // // //     flex: 1,
// // // // // // // //     minWidth: 0,
// // // // // // // //   },

// // // // // // // //   playCardTitle: {
// // // // // // // //     color: "#172033",
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   playCardDescription: {
// // // // // // // //     color: "#8A909A",
// // // // // // // //     fontSize: 11.5,
// // // // // // // //     marginTop: 3,
// // // // // // // //   },

// // // // // // // //   playersBadge: {
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     gap: 4,
// // // // // // // //     backgroundColor: "#EEF1FF",
// // // // // // // //     paddingHorizontal: 9,
// // // // // // // //     paddingVertical: 6,
// // // // // // // //     borderRadius: 10,
// // // // // // // //   },

// // // // // // // //   playersBadgeText: {
// // // // // // // //     color: "#3949AB",
// // // // // // // //     fontSize: 10,
// // // // // // // //     fontWeight: "800",
// // // // // // // //   },

// // // // // // // //   playButton: {
// // // // // // // //     height: 53,
// // // // // // // //     width: 320,
// // // // // // // //     maxWidth: "100%",
// // // // // // // //     borderRadius: 15,
// // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     alignSelf: "center",
// // // // // // // //   },

// // // // // // // //   playButtonMobile: {
// // // // // // // //     width: 230,
// // // // // // // //     height: 49,
// // // // // // // //     borderRadius: 14,
// // // // // // // //   },

// // // // // // // //   playButtonText: {
// // // // // // // //     color: "#FFFFFF",
// // // // // // // //     fontSize: 14,
// // // // // // // //     fontWeight: "900",
// // // // // // // //     letterSpacing: 0.8,
// // // // // // // //   },

// // // // // // // //   playArrow: {
// // // // // // // //     width: 29,
// // // // // // // //     height: 29,
// // // // // // // //     borderRadius: 10,
// // // // // // // //     backgroundColor: "rgba(255,255,255,0.18)",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     marginLeft: 12,
// // // // // // // //   },

// // // // // // // //   /* GUEST button (same width as PLAY ONLINE) */

// // // // // // // //   guestButton: {
// // // // // // // //     marginTop: 10,
// // // // // // // //     height: 48,
// // // // // // // //     width: 320,
// // // // // // // //     maxWidth: "100%",
// // // // // // // //     borderRadius: 15,
// // // // // // // //     backgroundColor: "#FFEDEA",
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: "#FFD9D1",
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     alignSelf: "center",
// // // // // // // //     gap: 8,
// // // // // // // //   },

// // // // // // // //   guestButtonMobile: {
// // // // // // // //     width: 230,
// // // // // // // //     height: 45,
// // // // // // // //     borderRadius: 14,
// // // // // // // //   },

// // // // // // // //   guestButtonText: {
// // // // // // // //     color: "#FF6B5A",
// // // // // // // //     fontSize: 13,
// // // // // // // //     fontWeight: "900",
// // // // // // // //     letterSpacing: 0.8,
// // // // // // // //   },

// // // // // // // //   sectionHeader: {
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "space-between",
// // // // // // // //     marginTop: 27,
// // // // // // // //     marginBottom: 13,
// // // // // // // //   },

// // // // // // // //   sectionTitle: {
// // // // // // // //     color: "#172033",
// // // // // // // //     fontSize: 17,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   sectionSubtitle: {
// // // // // // // //     color: "#9297A0",
// // // // // // // //     fontSize: 11,
// // // // // // // //     marginTop: 3,
// // // // // // // //   },

// // // // // // // //   /* ==========================================================
// // // // // // // //      ROOM CARDS
// // // // // // // //   ========================================================== */

// // // // // // // //   roomContainer: {
// // // // // // // //     flexDirection: "row",
// // // // // // // //     gap: 12,
// // // // // // // //   },

// // // // // // // //   roomContainerMobile: {
// // // // // // // //     flexDirection: "column",
// // // // // // // //   },

// // // // // // // //   createRoomCard: {
// // // // // // // //     flex: 1,
// // // // // // // //     minHeight: 157,
// // // // // // // //     borderRadius: 19,
// // // // // // // //     backgroundColor: "#FFF0EB",
// // // // // // // //     padding: 14,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: "#FFE0D8",
// // // // // // // //   },

// // // // // // // //   joinRoomCard: {
// // // // // // // //     flex: 1,
// // // // // // // //     minHeight: 157,
// // // // // // // //     borderRadius: 19,
// // // // // // // //     backgroundColor: "#EEF0FF",
// // // // // // // //     padding: 14,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: "#DDE1FF",
// // // // // // // //   },

// // // // // // // //   roomCardMobile: {
// // // // // // // //     width: "100%",
// // // // // // // //     flex: 0,
// // // // // // // //     minHeight: 145,
// // // // // // // //   },

// // // // // // // //   roomIconCreate: {
// // // // // // // //     width: 38,
// // // // // // // //     height: 38,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     marginBottom: 10,
// // // // // // // //   },

// // // // // // // //   roomIconJoin: {
// // // // // // // //     width: 38,
// // // // // // // //     height: 38,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     marginBottom: 10,
// // // // // // // //   },

// // // // // // // //   roomCardTitle: {
// // // // // // // //     color: "#172033",
// // // // // // // //     fontSize: 13,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   roomCardText: {
// // // // // // // //     color: "#858B96",
// // // // // // // //     fontSize: 10.5,
// // // // // // // //     marginTop: 3,
// // // // // // // //   },

// // // // // // // //   roomArrow: {
// // // // // // // //     position: "absolute",
// // // // // // // //     right: 13,
// // // // // // // //     top: 17,
// // // // // // // //   },

// // // // // // // //   joinInputRow: {
// // // // // // // //     flexDirection: "row",
// // // // // // // //     marginTop: 10,
// // // // // // // //     alignItems: "center",
// // // // // // // //   },

// // // // // // // //   joinInput: {
// // // // // // // //     flex: 1,
// // // // // // // //     minWidth: 0,
// // // // // // // //     height: 36,
// // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // //     borderRadius: 9,
// // // // // // // //     paddingHorizontal: 9,
// // // // // // // //     color: "#172033",
// // // // // // // //     fontSize: 10,
// // // // // // // //     fontWeight: "800",
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: "#DDE1FF",
// // // // // // // //   },

// // // // // // // //   joinButton: {
// // // // // // // //     width: 36,
// // // // // // // //     height: 36,
// // // // // // // //     borderRadius: 9,
// // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     marginLeft: 5,
// // // // // // // //   },

// // // // // // // //   challengeCard: {
// // // // // // // //     marginTop: 22,
// // // // // // // //     borderRadius: 18,
// // // // // // // //     backgroundColor: "#172033",
// // // // // // // //     padding: 15,
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "space-between",
// // // // // // // //   },

// // // // // // // //   challengeCardMobile: {
// // // // // // // //     marginTop: 18,
// // // // // // // //     padding: 14,
// // // // // // // //   },

// // // // // // // //   challengeLeft: {
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     flex: 1,
// // // // // // // //     minWidth: 0,
// // // // // // // //   },

// // // // // // // //   challengeIcon: {
// // // // // // // //     width: 42,
// // // // // // // //     height: 42,
// // // // // // // //     borderRadius: 13,
// // // // // // // //     backgroundColor: "#F4B942",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     marginRight: 11,
// // // // // // // //   },

// // // // // // // //   challengeInfo: {
// // // // // // // //     flex: 1,
// // // // // // // //     minWidth: 0,
// // // // // // // //   },

// // // // // // // //   challengeTitle: {
// // // // // // // //     color: "#FFFFFF",
// // // // // // // //     fontSize: 13,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   challengeText: {
// // // // // // // //     color: "#AAB1C0",
// // // // // // // //     fontSize: 10.5,
// // // // // // // //     marginTop: 3,
// // // // // // // //   },

// // // // // // // //   challengeProgress: {
// // // // // // // //     alignItems: "flex-end",
// // // // // // // //     marginLeft: 10,
// // // // // // // //   },

// // // // // // // //   progressNumber: {
// // // // // // // //     color: "#FFD166",
// // // // // // // //     fontSize: 17,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   progressText: {
// // // // // // // //     color: "#8E97A9",
// // // // // // // //     fontSize: 9,
// // // // // // // //     marginTop: 1,
// // // // // // // //   },

// // // // // // // //   /* ==========================================================
// // // // // // // //      LEADERBOARD
// // // // // // // //   ========================================================== */

// // // // // // // //   leaderHeader: {
// // // // // // // //     marginTop: 27,
// // // // // // // //     marginBottom: 12,
// // // // // // // //     flexDirection: "row",
// // // // // // // //     justifyContent: "space-between",
// // // // // // // //     alignItems: "center",
// // // // // // // //   },

// // // // // // // //   viewAll: {
// // // // // // // //     color: "#5146E5",
// // // // // // // //     fontSize: 11,
// // // // // // // //     fontWeight: "800",
// // // // // // // //   },

// // // // // // // //   leaderboardCard: {
// // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // //     borderRadius: 19,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: "#EEE7DD",
// // // // // // // //     paddingHorizontal: 13,
// // // // // // // //     overflow: "hidden",
// // // // // // // //   },

// // // // // // // //   playerRow: {
// // // // // // // //     minHeight: 64,
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: "#F1EEE8",
// // // // // // // //   },

// // // // // // // //   lastPlayerRow: {
// // // // // // // //     borderBottomWidth: 0,
// // // // // // // //   },

// // // // // // // //   rankCircle: {
// // // // // // // //     width: 27,
// // // // // // // //     height: 27,
// // // // // // // //     borderRadius: 9,
// // // // // // // //     backgroundColor: "#F0F0F0",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     marginRight: 9,
// // // // // // // //   },

// // // // // // // //   rankFirst: {
// // // // // // // //     backgroundColor: "#FFF0B8",
// // // // // // // //   },

// // // // // // // //   rankSecond: {
// // // // // // // //     backgroundColor: "#E8E8E8",
// // // // // // // //   },

// // // // // // // //   rankThird: {
// // // // // // // //     backgroundColor: "#F5D6C7",
// // // // // // // //   },

// // // // // // // //   rankText: {
// // // // // // // //     color: "#59606C",
// // // // // // // //     fontSize: 11,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   playerAvatar: {
// // // // // // // //     width: 37,
// // // // // // // //     height: 37,
// // // // // // // //     borderRadius: 13,
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     marginRight: 10,
// // // // // // // //   },

// // // // // // // //   playerInfo: {
// // // // // // // //     flex: 1,
// // // // // // // //     minWidth: 0,
// // // // // // // //   },

// // // // // // // //   playerName: {
// // // // // // // //     color: "#202838",
// // // // // // // //     fontSize: 13,
// // // // // // // //     fontWeight: "800",
// // // // // // // //   },

// // // // // // // //   topPlayerLabel: {
// // // // // // // //     color: "#FF6B5A",
// // // // // // // //     fontSize: 8,
// // // // // // // //     fontWeight: "900",
// // // // // // // //     marginTop: 2,
// // // // // // // //     letterSpacing: 0.6,
// // // // // // // //   },

// // // // // // // //   scoreContainer: {
// // // // // // // //     alignItems: "flex-end",
// // // // // // // //     marginLeft: 8,
// // // // // // // //   },

// // // // // // // //   scoreNumber: {
// // // // // // // //     color: "#172033",
// // // // // // // //     fontSize: 14,
// // // // // // // //     fontWeight: "900",
// // // // // // // //   },

// // // // // // // //   scoreLabel: {
// // // // // // // //     color: "#9CA1AA",
// // // // // // // //     fontSize: 7,
// // // // // // // //     fontWeight: "800",
// // // // // // // //     marginTop: 1,
// // // // // // // //   },

// // // // // // // //   emptyLeaderboard: {
// // // // // // // //     height: 110,
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //   },

// // // // // // // //   emptyText: {
// // // // // // // //     color: "#9A9A9A",
// // // // // // // //     fontSize: 11,
// // // // // // // //     marginTop: 7,
// // // // // // // //   },

// // // // // // // //   /* ==========================================================
// // // // // // // //      MOBILE BOTTOM NAV
// // // // // // // //   ========================================================== */

// // // // // // // //   bottomNav: {
// // // // // // // //     height: 70,
// // // // // // // //     // CHANGED: kept solid white (was already) — the bottom nav is a fixed
// // // // // // // //     // control bar, so it stays fully opaque for legibility while the
// // // // // // // //     // animated backdrop shows through everywhere else above it.
// // // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // // //     borderTopWidth: 1,
// // // // // // // //     borderTopColor: "#EEE7DD",
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "space-around",
// // // // // // // //     paddingBottom: 4,
// // // // // // // //   },

// // // // // // // //   navItem: {
// // // // // // // //     flex: 1,
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //   },

// // // // // // // //   activeNavIcon: {
// // // // // // // //     width: 37,
// // // // // // // //     height: 32,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     backgroundColor: "#5146E5",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //   },

// // // // // // // //   activeNavText: {
// // // // // // // //     color: "#5146E5",
// // // // // // // //     fontSize: 9.5,
// // // // // // // //     fontWeight: "900",
// // // // // // // //     marginTop: 3,
// // // // // // // //   },

// // // // // // // //   navText: {
// // // // // // // //     color: "#8C8C8C",
// // // // // // // //     fontSize: 9.5,
// // // // // // // //     fontWeight: "700",
// // // // // // // //     marginTop: 4,
// // // // // // // //   },
// // // // // // // // });
// // // // // // // import React, { useEffect, useRef } from "react";
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   StyleSheet,
// // // // // // //   TouchableOpacity,
// // // // // // //   TextInput,
// // // // // // //   ScrollView,
// // // // // // //   SafeAreaView,
// // // // // // //   StatusBar,
// // // // // // //   useWindowDimensions,
// // // // // // //   Animated,
// // // // // // //   Easing,
// // // // // // // } from "react-native";
// // // // // // // import { Ionicons } from "@expo/vector-icons";

// // // // // // // export interface TopPlayer {
// // // // // // //   rank: number;
// // // // // // //   name: string;
// // // // // // //   score: number;
// // // // // // //   avatarColor: string;
// // // // // // // }

// // // // // // // interface WordScrambleHomeScreenProps {
// // // // // // //   topPlayers: TopPlayer[];

// // // // // // //   onPlayOnline: () => void;
// // // // // // //   onCreateRoom: () => void;
// // // // // // //   onJoinRoom: (code: string) => void;
// // // // // // //   onViewAllPlayers: () => void;

// // // // // // //   // GUEST: opens the guest play modal (nickname + room code, no login)
// // // // // // //   onGuestPlay?: () => void;

// // // // // // //   // BACK: goes back to the main Menu screen (Cyber Mind)
// // // // // // //   onBack?: () => void;

// // // // // // //   onTabHome: () => void;
// // // // // // //   onTabLeaderboard: () => void;
// // // // // // //   onTabProfile: () => void;
// // // // // // // }

// // // // // // // /* =====================================================
// // // // // // //    NEW: ambient animated backdrop for the home screen.
// // // // // // //    Slow-drifting colour blobs + a few faint floating
// // // // // // //    letter tiles, all `pointerEvents="none"` so they never
// // // // // // //    block taps on the real UI sitting above them.
// // // // // // // ===================================================== */
// // // // // // // const BG = {
// // // // // // //   indigo: "#5146E5",
// // // // // // //   coral: "#FF6B5A",
// // // // // // //   yellow: "#F4B942",
// // // // // // //   blue: "#3B82F6",
// // // // // // //   green: "#26B67A",
// // // // // // // };

// // // // // // // const BgBlob: React.FC<{
// // // // // // //   color: string;
// // // // // // //   size: number;
// // // // // // //   left: number;
// // // // // // //   top: number;
// // // // // // //   driftX: number;
// // // // // // //   driftY: number;
// // // // // // //   duration: number;
// // // // // // //   opacity?: number;
// // // // // // // }> = ({ color, size, left, top, driftX, driftY, duration, opacity = 0.1 }) => {
// // // // // // //   const anim = useRef(new Animated.Value(0)).current;

// // // // // // //   useEffect(() => {
// // // // // // //     const loop = Animated.loop(
// // // // // // //       Animated.sequence([
// // // // // // //         Animated.timing(anim, {
// // // // // // //           toValue: 1,
// // // // // // //           duration,
// // // // // // //           easing: Easing.inOut(Easing.sin),
// // // // // // //           useNativeDriver: true,
// // // // // // //         }),
// // // // // // //         Animated.timing(anim, {
// // // // // // //           toValue: 0,
// // // // // // //           duration,
// // // // // // //           easing: Easing.inOut(Easing.sin),
// // // // // // //           useNativeDriver: true,
// // // // // // //         }),
// // // // // // //       ])
// // // // // // //     );
// // // // // // //     loop.start();
// // // // // // //     return () => loop.stop();
// // // // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // // //   }, []);

// // // // // // //   const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, driftX] });
// // // // // // //   const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, driftY] });
// // // // // // //   const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });

// // // // // // //   return (
// // // // // // //     <Animated.View
// // // // // // //       pointerEvents="none"
// // // // // // //       style={{
// // // // // // //         position: "absolute",
// // // // // // //         left,
// // // // // // //         top,
// // // // // // //         width: size,
// // // // // // //         height: size,
// // // // // // //         borderRadius: size / 2,
// // // // // // //         backgroundColor: color,
// // // // // // //         opacity,
// // // // // // //         transform: [{ translateX }, { translateY }, { scale }],
// // // // // // //       }}
// // // // // // //     />
// // // // // // //   );
// // // // // // // };

// // // // // // // const BgLetter: React.FC<{
// // // // // // //   char: string;
// // // // // // //   color: string;
// // // // // // //   left: number;
// // // // // // //   top: number;
// // // // // // //   rotate: string;
// // // // // // //   duration?: number;
// // // // // // // }> = ({ char, color, left, top, rotate, duration = 2600 }) => {
// // // // // // //   const bob = useRef(new Animated.Value(0)).current;

// // // // // // //   useEffect(() => {
// // // // // // //     const loop = Animated.loop(
// // // // // // //       Animated.sequence([
// // // // // // //         Animated.timing(bob, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // // // //         Animated.timing(bob, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // // // // // //       ])
// // // // // // //     );
// // // // // // //     loop.start();
// // // // // // //     return () => loop.stop();
// // // // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // // //   }, []);

// // // // // // //   const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

// // // // // // //   return (
// // // // // // //     <Animated.View
// // // // // // //       pointerEvents="none"
// // // // // // //       style={{
// // // // // // //         position: "absolute",
// // // // // // //         left,
// // // // // // //         top,
// // // // // // //         width: 40,
// // // // // // //         height: 40,
// // // // // // //         borderRadius: 11,
// // // // // // //         backgroundColor: color,
// // // // // // //         alignItems: "center",
// // // // // // //         justifyContent: "center",
// // // // // // //         opacity: 0.1,
// // // // // // //         transform: [{ translateY }, { rotate }],
// // // // // // //       }}
// // // // // // //     >
// // // // // // //       <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "900" }}>{char}</Text>
// // // // // // //     </Animated.View>
// // // // // // //   );
// // // // // // // };

// // // // // // // /** Full ambient background: a handful of drifting blobs + faint floating letters. */
// // // // // // // const AnimatedHomeBackground: React.FC<{ width: number; height: number }> = ({ width, height }) => {
// // // // // // //   return (
// // // // // // //     <View style={StyleSheet.absoluteFill} pointerEvents="none">
// // // // // // //       <BgBlob color={BG.indigo} size={300} left={-80} top={-60} driftX={35} driftY={25} duration={5200} opacity={0.09} />
// // // // // // //       <BgBlob color={BG.coral} size={240} left={width - 160} top={40} driftX={-25} driftY={35} duration={4600} opacity={0.1} />
// // // // // // //       <BgBlob color={BG.yellow} size={210} left={width * 0.4} top={height * 0.45} driftX={30} driftY={-20} duration={6000} opacity={0.08} />
// // // // // // //       <BgBlob color={BG.green} size={220} left={-70} top={height * 0.6} driftX={30} driftY={-30} duration={5400} opacity={0.08} />
// // // // // // //       <BgBlob color={BG.blue} size={180} left={width - 120} top={height * 0.75} driftX={-25} driftY={-20} duration={4900} opacity={0.09} />

// // // // // // //       <BgLetter char="W" color={BG.yellow} left={width * 0.08} top={height * 0.15} rotate="-8deg" duration={2400} />
// // // // // // //       <BgLetter char="O" color={BG.blue} left={width * 0.82} top={height * 0.22} rotate="7deg" duration={2800} />
// // // // // // //       <BgLetter char="R" color={BG.coral} left={width * 0.85} top={height * 0.58} rotate="-6deg" duration={2600} />
// // // // // // //       <BgLetter char="D" color={BG.green} left={width * 0.06} top={height * 0.72} rotate="5deg" duration={3000} />
// // // // // // //     </View>
// // // // // // //   );
// // // // // // // };

// // // // // // // const WordScrambleHomeScreen: React.FC<WordScrambleHomeScreenProps> = ({
// // // // // // //   topPlayers,
// // // // // // //   onPlayOnline,
// // // // // // //   onCreateRoom,
// // // // // // //   onJoinRoom,
// // // // // // //   onViewAllPlayers,
// // // // // // //   onGuestPlay, // GUEST
// // // // // // //   onBack, // BACK
// // // // // // //   onTabHome,
// // // // // // //   onTabLeaderboard,
// // // // // // //   onTabProfile,
// // // // // // // }) => {
// // // // // // //   const { width, height } = useWindowDimensions();

// // // // // // //   const isMobile = width < 768;
// // // // // // //   const isTablet = width >= 768 && width < 1100;

// // // // // // //   const [joinCode, setJoinCode] = React.useState("");

// // // // // // //   const handleJoinRoom = () => {
// // // // // // //     const code = joinCode.trim();

// // // // // // //     if (!code) {
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     onJoinRoom(code);
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#FFF9F0" />

// // // // // // //       {/* NEW: ambient animated backdrop, sits behind the whole screen */}
// // // // // // //       <AnimatedHomeBackground width={width} height={height} />

// // // // // // //       <View style={styles.root}>
// // // // // // //         {/* =====================================================
// // // // // // //             DESKTOP SIDEBAR
// // // // // // //         ===================================================== */}

// // // // // // //         {!isMobile && (
// // // // // // //           <View style={[styles.sidebar, isTablet && styles.sidebarTablet]}>
// // // // // // //             {/* Brand */}

// // // // // // //             <View style={styles.sidebarBrand}>
// // // // // // //               <View style={styles.sidebarLogo}>
// // // // // // //                 <Text style={styles.logoW}>W</Text>
// // // // // // //                 <Text style={styles.logoS}>S</Text>
// // // // // // //               </View>

// // // // // // //               <View>
// // // // // // //                 <Text style={styles.sidebarBrandTitle}>
// // // // // // //                   Word
// // // // // // //                   <Text style={styles.sidebarBrandAccent}> Scramble</Text>
// // // // // // //                 </Text>

// // // // // // //                 <Text style={styles.sidebarBrandSubtitle}>
// // // // // // //                   Think fast. Play smart.
// // // // // // //                 </Text>
// // // // // // //               </View>
// // // // // // //             </View>

// // // // // // //             {/* Sidebar Navigation */}

// // // // // // //             <View style={styles.sidebarNavigation}>
// // // // // // //               <TouchableOpacity
// // // // // // //                 activeOpacity={0.8}
// // // // // // //                 style={[styles.sidebarNavItem, styles.sidebarNavActive]}
// // // // // // //                 onPress={onTabHome}
// // // // // // //               >
// // // // // // //                 <View style={styles.sidebarActiveIcon}>
// // // // // // //                   <Ionicons name="home" size={21} color="#FFFFFF" />
// // // // // // //                 </View>

// // // // // // //                 <Text style={styles.sidebarActiveText}>Home</Text>
// // // // // // //               </TouchableOpacity>

// // // // // // //               <TouchableOpacity
// // // // // // //                 activeOpacity={0.8}
// // // // // // //                 style={styles.sidebarNavItem}
// // // // // // //                 onPress={onTabLeaderboard}
// // // // // // //               >
// // // // // // //                 <Ionicons name="trophy-outline" size={22} color="#657084" />

// // // // // // //                 <Text style={styles.sidebarText}>Rankings</Text>
// // // // // // //               </TouchableOpacity>

// // // // // // //               <TouchableOpacity
// // // // // // //                 activeOpacity={0.8}
// // // // // // //                 style={styles.sidebarNavItem}
// // // // // // //                 onPress={onTabProfile}
// // // // // // //               >
// // // // // // //                 <Ionicons name="person-outline" size={22} color="#657084" />

// // // // // // //                 <Text style={styles.sidebarText}>Profile</Text>
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>

// // // // // // //             {/* Sidebar Bottom Card */}

// // // // // // //             <View style={styles.sidebarBottomCard}>
// // // // // // //               <View style={styles.sidebarBottomIcon}>
// // // // // // //                 <Ionicons name="sparkles" size={21} color="#FFFFFF" />
// // // // // // //               </View>

// // // // // // //               <Text style={styles.sidebarBottomTitle}>
// // // // // // //                 Ready for a challenge?
// // // // // // //               </Text>

// // // // // // //               <Text style={styles.sidebarBottomText}>
// // // // // // //                 Unscramble words and climb the rankings.
// // // // // // //               </Text>
// // // // // // //             </View>
// // // // // // //           </View>
// // // // // // //         )}

// // // // // // //         {/* =====================================================
// // // // // // //             MAIN CONTENT
// // // // // // //         ===================================================== */}

// // // // // // //         <View style={[styles.main, !isMobile && styles.mainDesktop]}>
// // // // // // //           {/* ===================================================
// // // // // // //               MOBILE HEADER
// // // // // // //           =================================================== */}

// // // // // // //           {isMobile && (
// // // // // // //             <View style={styles.mobileHeader}>
// // // // // // //               <View style={styles.mobileBrand}>
// // // // // // //                 {/* BACK: returns to the main Menu */}
// // // // // // //                 {onBack && (
// // // // // // //                   <TouchableOpacity
// // // // // // //                     style={styles.backButton}
// // // // // // //                     activeOpacity={0.8}
// // // // // // //                     onPress={onBack}
// // // // // // //                     accessibilityRole="button"
// // // // // // //                     accessibilityLabel="Back to menu"
// // // // // // //                   >
// // // // // // //                     <Ionicons name="arrow-back" size={20} color="#172033" />
// // // // // // //                   </TouchableOpacity>
// // // // // // //                 )}

// // // // // // //                 <View style={styles.mobileLogo}>
// // // // // // //                   <Text style={styles.logoW}>W</Text>
// // // // // // //                   <Text style={styles.logoS}>S</Text>
// // // // // // //                 </View>

// // // // // // //                 <View>
// // // // // // //                   <Text style={styles.mobileBrandTitle}>
// // // // // // //                     Word
// // // // // // //                     <Text style={styles.mobileBrandAccent}> Scramble</Text>
// // // // // // //                   </Text>

// // // // // // //                   <Text style={styles.mobileBrandSubtitle}>
// // // // // // //                     Think fast. Play smart.
// // // // // // //                   </Text>
// // // // // // //                 </View>
// // // // // // //               </View>

// // // // // // //               <TouchableOpacity
// // // // // // //                 style={styles.mobileNotification}
// // // // // // //                 activeOpacity={0.8}
// // // // // // //               >
// // // // // // //                 <Ionicons
// // // // // // //                   name="notifications-outline"
// // // // // // //                   size={20}
// // // // // // //                   color="#172033"
// // // // // // //                 />
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>
// // // // // // //           )}

// // // // // // //           {/* ===================================================
// // // // // // //               DESKTOP HEADER
// // // // // // //           =================================================== */}

// // // // // // //           {!isMobile && (
// // // // // // //             <View style={styles.desktopTopHeader}>
// // // // // // //               <View style={styles.desktopHeaderLeft}>
// // // // // // //                 {/* BACK: returns to the main Menu */}
// // // // // // //                 {onBack && (
// // // // // // //                   <TouchableOpacity
// // // // // // //                     style={styles.backButton}
// // // // // // //                     activeOpacity={0.8}
// // // // // // //                     onPress={onBack}
// // // // // // //                     accessibilityRole="button"
// // // // // // //                     accessibilityLabel="Back to menu"
// // // // // // //                   >
// // // // // // //                     <Ionicons name="arrow-back" size={20} color="#172033" />
// // // // // // //                   </TouchableOpacity>
// // // // // // //                 )}

// // // // // // //                 <View>
// // // // // // //                   <Text style={styles.desktopWelcome}>Welcome back!</Text>

// // // // // // //                   <Text style={styles.desktopWelcomeSub}>Ready to play?</Text>
// // // // // // //                 </View>
// // // // // // //               </View>

// // // // // // //               <TouchableOpacity style={styles.desktopNotification}>
// // // // // // //                 <Ionicons
// // // // // // //                   name="notifications-outline"
// // // // // // //                   size={20}
// // // // // // //                   color="#172033"
// // // // // // //                 />
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>
// // // // // // //           )}

// // // // // // //           {/* ===================================================
// // // // // // //               SCROLL CONTENT
// // // // // // //           =================================================== */}

// // // // // // //           <ScrollView
// // // // // // //             showsVerticalScrollIndicator={false}
// // // // // // //             horizontal={false}
// // // // // // //             contentContainerStyle={[
// // // // // // //               styles.scrollContent,
// // // // // // //               isMobile && styles.scrollContentMobile,
// // // // // // //               isTablet && styles.scrollContentTablet,
// // // // // // //             ]}
// // // // // // //           >
// // // // // // //             {/* =================================================
// // // // // // //                 HERO
// // // // // // //             ================================================= */}

// // // // // // //             <View style={[styles.heroSection, isMobile && styles.heroMobile]}>
// // // // // // //               <Text style={styles.smallGreeting}>READY TO PLAY?</Text>

// // // // // // //               <Text
// // // // // // //                 style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}
// // // // // // //               >
// // // // // // //                 Unscramble.
// // // // // // //                 {"\n"}

// // // // // // //                 <Text style={styles.heroAccent}>Outsmart.</Text>
// // // // // // //               </Text>

// // // // // // //               <Text
// // // // // // //                 style={[
// // // // // // //                   styles.heroDescription,
// // // // // // //                   isMobile && styles.heroDescriptionMobile,
// // // // // // //                 ]}
// // // // // // //               >
// // // // // // //                 Arrange the letters, find the hidden word,
// // // // // // //                 and race against your friends.
// // // // // // //               </Text>
// // // // // // //             </View>

// // // // // // //             {/* =================================================
// // // // // // //                 WORD LETTERS
// // // // // // //             ================================================= */}

// // // // // // //             <View
// // // // // // //               style={[
// // // // // // //                 styles.lettersContainer,
// // // // // // //                 isMobile && styles.lettersMobile,
// // // // // // //               ]}
// // // // // // //             >
// // // // // // //               <View
// // // // // // //                 style={[
// // // // // // //                   styles.letterTile,
// // // // // // //                   styles.tileYellow,
// // // // // // //                   styles.tileRotateLeft,
// // // // // // //                 ]}
// // // // // // //               >
// // // // // // //                 <Text style={styles.letterText}>W</Text>
// // // // // // //               </View>

// // // // // // //               <View
// // // // // // //                 style={[
// // // // // // //                   styles.letterTile,
// // // // // // //                   styles.tileBlue,
// // // // // // //                   styles.tileRotateRight,
// // // // // // //                 ]}
// // // // // // //               >
// // // // // // //                 <Text style={styles.letterText}>O</Text>
// // // // // // //               </View>

// // // // // // //               <View style={[styles.letterTile, styles.tilePink]}>
// // // // // // //                 <Text style={styles.letterText}>R</Text>
// // // // // // //               </View>

// // // // // // //               <View
// // // // // // //                 style={[
// // // // // // //                   styles.letterTile,
// // // // // // //                   styles.tileGreen,
// // // // // // //                   styles.tileRotateLeft,
// // // // // // //                 ]}
// // // // // // //               >
// // // // // // //                 <Text style={styles.letterText}>D</Text>
// // // // // // //               </View>
// // // // // // //             </View>

// // // // // // //             {/* =================================================
// // // // // // //                 QUICK MATCH
// // // // // // //             ================================================= */}

// // // // // // //             <View style={[styles.playCard, isMobile && styles.playCardMobile]}>
// // // // // // //               <View style={styles.playCardTop}>
// // // // // // //                 <View style={styles.lightningCircle}>
// // // // // // //                   <Ionicons name="flash" size={21} color="#FFFFFF" />
// // // // // // //                 </View>

// // // // // // //                 <View style={styles.playInfo}>
// // // // // // //                   <Text style={styles.playCardTitle}>Quick Match</Text>

// // // // // // //                   <Text style={styles.playCardDescription}>
// // // // // // //                     Jump into a live word battle
// // // // // // //                   </Text>
// // // // // // //                 </View>

// // // // // // //                 <View style={styles.playersBadge}>
// // // // // // //                   <Ionicons name="people-outline" size={14} color="#3949AB" />

// // // // // // //                   <Text style={styles.playersBadgeText}>2–8</Text>
// // // // // // //                 </View>
// // // // // // //               </View>

// // // // // // //               {/* IMPORTANT:
// // // // // // //                   Button no longer full screen.
// // // // // // //                   Desktop = 320px
// // // // // // //                   Mobile = 230px
// // // // // // //               */}

// // // // // // //               <TouchableOpacity
// // // // // // //                 activeOpacity={0.88}
// // // // // // //                 onPress={onPlayOnline}
// // // // // // //                 style={[styles.playButton, isMobile && styles.playButtonMobile]}
// // // // // // //               >
// // // // // // //                 <Text style={styles.playButtonText}>PLAY ONLINE</Text>

// // // // // // //                 <View style={styles.playArrow}>
// // // // // // //                   <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
// // // // // // //                 </View>
// // // // // // //               </TouchableOpacity>

// // // // // // //               {/* GUEST: play without an account, just a nickname */}
// // // // // // //               {onGuestPlay && (
// // // // // // //                 <TouchableOpacity
// // // // // // //                   activeOpacity={0.85}
// // // // // // //                   onPress={onGuestPlay}
// // // // // // //                   style={[
// // // // // // //                     styles.guestButton,
// // // // // // //                     isMobile && styles.guestButtonMobile,
// // // // // // //                   ]}
// // // // // // //                 >
// // // // // // //                   <Ionicons name="person-outline" size={18} color="#FF6B5A" />

// // // // // // //                   <Text style={styles.guestButtonText}>PLAY AS GUEST</Text>
// // // // // // //                 </TouchableOpacity>
// // // // // // //               )}
// // // // // // //             </View>

// // // // // // //             {/* =================================================
// // // // // // //                 PLAY WITH FRIENDS
// // // // // // //             ================================================= */}

// // // // // // //             <View style={styles.sectionHeader}>
// // // // // // //               <View>
// // // // // // //                 <Text style={styles.sectionTitle}>Play with friends</Text>

// // // // // // //                 <Text style={styles.sectionSubtitle}>
// // // // // // //                   Create or join a private room
// // // // // // //                 </Text>
// // // // // // //               </View>

// // // // // // //               <Ionicons
// // // // // // //                 name="people-circle-outline"
// // // // // // //                 size={28}
// // // // // // //                 color="#FF6B5A"
// // // // // // //               />
// // // // // // //             </View>

// // // // // // //             {/* =================================================
// // // // // // //                 ROOM CARDS
// // // // // // //             ================================================= */}

// // // // // // //             <View
// // // // // // //               style={[
// // // // // // //                 styles.roomContainer,
// // // // // // //                 isMobile && styles.roomContainerMobile,
// // // // // // //               ]}
// // // // // // //             >
// // // // // // //               {/* CREATE ROOM */}

// // // // // // //               <TouchableOpacity
// // // // // // //                 activeOpacity={0.85}
// // // // // // //                 onPress={onCreateRoom}
// // // // // // //                 style={[
// // // // // // //                   styles.createRoomCard,
// // // // // // //                   isMobile && styles.roomCardMobile,
// // // // // // //                 ]}
// // // // // // //               >
// // // // // // //                 <View style={styles.roomIconCreate}>
// // // // // // //                   <Ionicons name="add" size={24} color="#FFFFFF" />
// // // // // // //                 </View>

// // // // // // //                 <Text style={styles.roomCardTitle}>Create Room</Text>

// // // // // // //                 <Text style={styles.roomCardText}>Start a new game</Text>

// // // // // // //                 <View style={styles.roomArrow}>
// // // // // // //                   <Ionicons name="arrow-forward" size={17} color="#FF6B5A" />
// // // // // // //                 </View>
// // // // // // //               </TouchableOpacity>

// // // // // // //               {/* JOIN ROOM */}

// // // // // // //               <View
// // // // // // //                 style={[styles.joinRoomCard, isMobile && styles.roomCardMobile]}
// // // // // // //               >
// // // // // // //                 <View style={styles.roomIconJoin}>
// // // // // // //                   <Ionicons name="enter-outline" size={22} color="#FFFFFF" />
// // // // // // //                 </View>

// // // // // // //                 <Text style={styles.roomCardTitle}>Join Room</Text>

// // // // // // //                 <Text style={styles.roomCardText}>Enter room code</Text>

// // // // // // //                 <View style={styles.joinInputRow}>
// // // // // // //                   <TextInput
// // // // // // //                     value={joinCode}
// // // // // // //                     onChangeText={setJoinCode}
// // // // // // //                     placeholder="ROOM CODE"
// // // // // // //                     placeholderTextColor="#9A9A9A"
// // // // // // //                     autoCapitalize="characters"
// // // // // // //                     maxLength={8}
// // // // // // //                     style={styles.joinInput}
// // // // // // //                   />

// // // // // // //                   <TouchableOpacity
// // // // // // //                     activeOpacity={0.8}
// // // // // // //                     onPress={handleJoinRoom}
// // // // // // //                     style={styles.joinButton}
// // // // // // //                   >
// // // // // // //                     <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
// // // // // // //                   </TouchableOpacity>
// // // // // // //                 </View>
// // // // // // //               </View>
// // // // // // //             </View>

// // // // // // //             {/* =================================================
// // // // // // //                 DAILY CHALLENGE
// // // // // // //             ================================================= */}

// // // // // // //             <View
// // // // // // //               style={[
// // // // // // //                 styles.challengeCard,
// // // // // // //                 isMobile && styles.challengeCardMobile,
// // // // // // //               ]}
// // // // // // //             >
// // // // // // //               <View style={styles.challengeLeft}>
// // // // // // //                 <View style={styles.challengeIcon}>
// // // // // // //                   <Ionicons name="trophy" size={22} color="#FFFFFF" />
// // // // // // //                 </View>

// // // // // // //                 <View style={styles.challengeInfo}>
// // // // // // //                   <Text style={styles.challengeTitle}>Daily Challenge</Text>

// // // // // // //                   <Text style={styles.challengeText}>
// // // // // // //                     Solve today's puzzle
// // // // // // //                   </Text>
// // // // // // //                 </View>
// // // // // // //               </View>

// // // // // // //               <View style={styles.challengeProgress}>
// // // // // // //                 <Text style={styles.progressNumber}>3/5</Text>

// // // // // // //                 <Text style={styles.progressText}>rounds</Text>
// // // // // // //               </View>
// // // // // // //             </View>

// // // // // // //             {/* =================================================
// // // // // // //                 LEADERBOARD
// // // // // // //             ================================================= */}

// // // // // // //             <View style={styles.leaderHeader}>
// // // // // // //               <View>
// // // // // // //                 <Text style={styles.sectionTitle}>Top Players</Text>

// // // // // // //                 <Text style={styles.sectionSubtitle}>Today's leaderboard</Text>
// // // // // // //               </View>

// // // // // // //               <TouchableOpacity activeOpacity={0.7} onPress={onViewAllPlayers}>
// // // // // // //                 <Text style={styles.viewAll}>View all</Text>
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>

// // // // // // //             <View style={styles.leaderboardCard}>
// // // // // // //               {topPlayers.length === 0 ? (
// // // // // // //                 <View style={styles.emptyLeaderboard}>
// // // // // // //                   <Ionicons name="trophy-outline" size={28} color="#B0B0B0" />

// // // // // // //                   <Text style={styles.emptyText}>No players yet</Text>
// // // // // // //                 </View>
// // // // // // //               ) : (
// // // // // // //                 topPlayers.map((player, index) => (
// // // // // // //                   <View
// // // // // // //                     key={`${player.rank}-${player.name}`}
// // // // // // //                     style={[
// // // // // // //                       styles.playerRow,
// // // // // // //                       index === topPlayers.length - 1 && styles.lastPlayerRow,
// // // // // // //                     ]}
// // // // // // //                   >
// // // // // // //                     <View
// // // // // // //                       style={[
// // // // // // //                         styles.rankCircle,
// // // // // // //                         player.rank === 1 && styles.rankFirst,
// // // // // // //                         player.rank === 2 && styles.rankSecond,
// // // // // // //                         player.rank === 3 && styles.rankThird,
// // // // // // //                       ]}
// // // // // // //                     >
// // // // // // //                       <Text style={styles.rankText}>{player.rank}</Text>
// // // // // // //                     </View>

// // // // // // //                     <View
// // // // // // //                       style={[
// // // // // // //                         styles.playerAvatar,
// // // // // // //                         {
// // // // // // //                           backgroundColor: player.avatarColor || "#FF6B5A",
// // // // // // //                         },
// // // // // // //                       ]}
// // // // // // //                     >
// // // // // // //                       <Ionicons name="person" size={17} color="#FFFFFF" />
// // // // // // //                     </View>

// // // // // // //                     <View style={styles.playerInfo}>
// // // // // // //                       <Text style={styles.playerName}>{player.name}</Text>

// // // // // // //                       {player.rank === 1 && (
// // // // // // //                         <Text style={styles.topPlayerLabel}>TOP PLAYER</Text>
// // // // // // //                       )}
// // // // // // //                     </View>

// // // // // // //                     <View style={styles.scoreContainer}>
// // // // // // //                       <Text style={styles.scoreNumber}>{player.score}</Text>

// // // // // // //                       <Text style={styles.scoreLabel}>PTS</Text>
// // // // // // //                     </View>
// // // // // // //                   </View>
// // // // // // //                 ))
// // // // // // //               )}
// // // // // // //             </View>

// // // // // // //             <View style={{ height: isMobile ? 90 : 40 }} />
// // // // // // //           </ScrollView>

// // // // // // //           {/* =================================================
// // // // // // //               MOBILE BOTTOM NAV
// // // // // // //           ================================================= */}

// // // // // // //           {isMobile && (
// // // // // // //             <View style={styles.bottomNav}>
// // // // // // //               <TouchableOpacity
// // // // // // //                 style={styles.navItem}
// // // // // // //                 activeOpacity={0.8}
// // // // // // //                 onPress={onTabHome}
// // // // // // //               >
// // // // // // //                 <View style={styles.activeNavIcon}>
// // // // // // //                   <Ionicons name="home" size={20} color="#FFFFFF" />
// // // // // // //                 </View>

// // // // // // //                 <Text style={styles.activeNavText}>Home</Text>
// // // // // // //               </TouchableOpacity>

// // // // // // //               <TouchableOpacity
// // // // // // //                 style={styles.navItem}
// // // // // // //                 activeOpacity={0.8}
// // // // // // //                 onPress={onTabLeaderboard}
// // // // // // //               >
// // // // // // //                 <Ionicons name="trophy-outline" size={21} color="#8C8C8C" />

// // // // // // //                 <Text style={styles.navText}>Rankings</Text>
// // // // // // //               </TouchableOpacity>

// // // // // // //               <TouchableOpacity
// // // // // // //                 style={styles.navItem}
// // // // // // //                 activeOpacity={0.8}
// // // // // // //                 onPress={onTabProfile}
// // // // // // //               >
// // // // // // //                 <Ionicons name="person-outline" size={21} color="#8C8C8C" />

// // // // // // //                 <Text style={styles.navText}>Profile</Text>
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>
// // // // // // //           )}
// // // // // // //         </View>
// // // // // // //       </View>
// // // // // // //     </SafeAreaView>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default WordScrambleHomeScreen;

// // // // // // // /* ============================================================
// // // // // // //    STYLES
// // // // // // // ============================================================ */

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   safeArea: {
// // // // // // //     flex: 1,
// // // // // // //     backgroundColor: "#FFF9F0",
// // // // // // //   },

// // // // // // //   root: {
// // // // // // //     flex: 1,
// // // // // // //     flexDirection: "row",
// // // // // // //     // CHANGED: transparent so the AnimatedHomeBackground behind it (which
// // // // // // //     // sits on safeArea, one level up) shows through the gaps between the
// // // // // // //     // sidebar/main content instead of being covered by a solid colour.
// // // // // // //     backgroundColor: "transparent",
// // // // // // //   },

// // // // // // //   /* ==========================================================
// // // // // // //      SIDEBAR
// // // // // // //   ========================================================== */

// // // // // // //   sidebar: {
// // // // // // //     width: 292,
// // // // // // //     // CHANGED: was a fully opaque "#FFFDF9" — now a near-opaque version of
// // // // // // //     // the same colour so the ambient background is *very* faintly visible
// // // // // // //     // behind the nav without hurting legibility of its text/icons.
// // // // // // //     backgroundColor: "rgba(255,253,249,0.97)",
// // // // // // //     borderRightWidth: 1,
// // // // // // //     borderRightColor: "#EDE5D9",
// // // // // // //     paddingHorizontal: 19,
// // // // // // //     paddingTop: 22,
// // // // // // //     paddingBottom: 18,
// // // // // // //     justifyContent: "space-between",
// // // // // // //   },

// // // // // // //   sidebarTablet: {
// // // // // // //     width: 245,
// // // // // // //   },

// // // // // // //   sidebarBrand: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //   },

// // // // // // //   sidebarLogo: {
// // // // // // //     width: 58,
// // // // // // //     height: 58,
// // // // // // //     borderRadius: 17,
// // // // // // //     backgroundColor: "#172033",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     flexDirection: "row",
// // // // // // //     marginRight: 11,
// // // // // // //     transform: [{ rotate: "-5deg" }],
// // // // // // //   },

// // // // // // //   logoW: {
// // // // // // //     color: "#FFD166",
// // // // // // //     fontSize: 21,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   logoS: {
// // // // // // //     color: "#FF6B5A",
// // // // // // //     fontSize: 21,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   sidebarBrandTitle: {
// // // // // // //     color: "#172033",
// // // // // // //     fontSize: 19,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   sidebarBrandAccent: {
// // // // // // //     color: "#FF6B5A",
// // // // // // //   },

// // // // // // //   sidebarBrandSubtitle: {
// // // // // // //     color: "#7B8491",
// // // // // // //     fontSize: 10.5,
// // // // // // //     fontWeight: "600",
// // // // // // //     marginTop: 2,
// // // // // // //   },

// // // // // // //   sidebarNavigation: {
// // // // // // //     marginTop: 50,
// // // // // // //     flex: 1,
// // // // // // //   },

// // // // // // //   sidebarNavItem: {
// // // // // // //     height: 58,
// // // // // // //     borderRadius: 15,
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     paddingHorizontal: 15,
// // // // // // //     marginBottom: 7,
// // // // // // //   },

// // // // // // //   sidebarNavActive: {
// // // // // // //     backgroundColor: "#EEE9FF",
// // // // // // //   },

// // // // // // //   sidebarActiveIcon: {
// // // // // // //     width: 40,
// // // // // // //     height: 40,
// // // // // // //     borderRadius: 12,
// // // // // // //     backgroundColor: "#5146E5",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     marginRight: 11,
// // // // // // //   },

// // // // // // //   sidebarActiveText: {
// // // // // // //     color: "#5146E5",
// // // // // // //     fontSize: 15,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   sidebarText: {
// // // // // // //     color: "#596579",
// // // // // // //     fontSize: 15,
// // // // // // //     fontWeight: "700",
// // // // // // //     marginLeft: 16,
// // // // // // //   },

// // // // // // //   sidebarBottomCard: {
// // // // // // //     backgroundColor: "#172033",
// // // // // // //     borderRadius: 19,
// // // // // // //     padding: 17,
// // // // // // //     minHeight: 137,
// // // // // // //   },

// // // // // // //   sidebarBottomIcon: {
// // // // // // //     width: 43,
// // // // // // //     height: 43,
// // // // // // //     borderRadius: 13,
// // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     marginBottom: 11,
// // // // // // //   },

// // // // // // //   sidebarBottomTitle: {
// // // // // // //     color: "#FFFFFF",
// // // // // // //     fontSize: 13,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   sidebarBottomText: {
// // // // // // //     color: "#AEB7C7",
// // // // // // //     fontSize: 10.5,
// // // // // // //     lineHeight: 17,
// // // // // // //     marginTop: 5,
// // // // // // //   },

// // // // // // //   main: {
// // // // // // //     flex: 1,
// // // // // // //     minWidth: 0,

// // // // // // //     backgroundColor: "transparent",
// // // // // // //   },

// // // // // // //   mainDesktop: {
// // // // // // //     overflow: "hidden",
// // // // // // //   },

// // // // // // //   desktopTopHeader: {
// // // // // // //     height: 76,
// // // // // // //     paddingHorizontal: 34,
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "space-between",
// // // // // // //   },

// // // // // // //   desktopHeaderLeft: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //   },

// // // // // // //   /* BACK button (round, same look as the notification button) */
// // // // // // //   backButton: {
// // // // // // //     width: 40,
// // // // // // //     height: 40,
// // // // // // //     borderRadius: 20,
// // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: "#EDE5D9",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     marginRight: 10,
// // // // // // //   },

// // // // // // //   desktopWelcome: {
// // // // // // //     color: "#172033",
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   desktopWelcomeSub: {
// // // // // // //     color: "#9299A4",
// // // // // // //     fontSize: 11,
// // // // // // //     marginTop: 3,
// // // // // // //   },

// // // // // // //   desktopNotification: {
// // // // // // //     width: 44,
// // // // // // //     height: 44,
// // // // // // //     borderRadius: 22,
// // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: "#EDE5D9",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //   },

// // // // // // //   /* ==========================================================
// // // // // // //      MOBILE HEADER
// // // // // // //   ========================================================== */

// // // // // // //   mobileHeader: {
// // // // // // //     height: 76,
// // // // // // //     paddingHorizontal: 17,
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "space-between",
// // // // // // //     // CHANGED: transparent so the animated backdrop shows through here too
// // // // // // //     backgroundColor: "transparent",
// // // // // // //   },

// // // // // // //   mobileBrand: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //   },

// // // // // // //   mobileLogo: {
// // // // // // //     width: 45,
// // // // // // //     height: 45,
// // // // // // //     borderRadius: 14,
// // // // // // //     backgroundColor: "#172033",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     flexDirection: "row",
// // // // // // //     marginRight: 10,
// // // // // // //     transform: [{ rotate: "-5deg" }],
// // // // // // //   },

// // // // // // //   mobileBrandTitle: {
// // // // // // //     color: "#172033",
// // // // // // //     fontSize: 17,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   mobileBrandAccent: {
// // // // // // //     color: "#FF6B5A",
// // // // // // //   },

// // // // // // //   mobileBrandSubtitle: {
// // // // // // //     color: "#7B8491",
// // // // // // //     fontSize: 9.5,
// // // // // // //     marginTop: 2,
// // // // // // //     fontWeight: "600",
// // // // // // //   },

// // // // // // //   mobileNotification: {
// // // // // // //     width: 40,
// // // // // // //     height: 40,
// // // // // // //     borderRadius: 20,
// // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: "#EDE5D9",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //   },

// // // // // // //   scrollContent: {
// // // // // // //     paddingHorizontal: 34,
// // // // // // //     paddingTop: 15,
// // // // // // //   },

// // // // // // //   scrollContentTablet: {
// // // // // // //     paddingHorizontal: 25,
// // // // // // //   },

// // // // // // //   scrollContentMobile: {
// // // // // // //     paddingHorizontal: 17,
// // // // // // //     paddingTop: 5,
// // // // // // //   },

// // // // // // //   /* ==========================================================
// // // // // // //      HERO
// // // // // // //   ========================================================== */

// // // // // // //   heroSection: {
// // // // // // //     marginTop: 7,
// // // // // // //   },

// // // // // // //   heroMobile: {
// // // // // // //     marginTop: 5,
// // // // // // //   },

// // // // // // //   smallGreeting: {
// // // // // // //     color: "#FF6B5A",
// // // // // // //     fontSize: 11,
// // // // // // //     fontWeight: "900",
// // // // // // //     letterSpacing: 1.4,
// // // // // // //     marginBottom: 6,
// // // // // // //   },

// // // // // // //   heroTitle: {
// // // // // // //     color: "#172033",
// // // // // // //     fontSize: 45,
// // // // // // //     lineHeight: 48,
// // // // // // //     fontWeight: "900",
// // // // // // //     letterSpacing: -1.5,
// // // // // // //   },

// // // // // // //   heroTitleMobile: {
// // // // // // //     fontSize: 37,
// // // // // // //     lineHeight: 40,
// // // // // // //     letterSpacing: -1,
// // // // // // //   },

// // // // // // //   heroAccent: {
// // // // // // //     color: "#5146E5",
// // // // // // //   },

// // // // // // //   heroDescription: {
// // // // // // //     color: "#7A8290",
// // // // // // //     fontSize: 13.5,
// // // // // // //     lineHeight: 20,
// // // // // // //     marginTop: 10,
// // // // // // //     maxWidth: 390,
// // // // // // //   },

// // // // // // //   heroDescriptionMobile: {
// // // // // // //     fontSize: 12.5,
// // // // // // //     lineHeight: 18,
// // // // // // //     maxWidth: 310,
// // // // // // //   },

// // // // // // //   lettersContainer: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     marginTop: 24,
// // // // // // //     marginBottom: 25,
// // // // // // //     gap: 9,
// // // // // // //   },

// // // // // // //   lettersMobile: {
// // // // // // //     marginTop: 21,
// // // // // // //     marginBottom: 20,
// // // // // // //   },

// // // // // // //   letterTile: {
// // // // // // //     width: 54,
// // // // // // //     height: 54,
// // // // // // //     borderRadius: 14,
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     shadowColor: "#000000",
// // // // // // //     shadowOffset: {
// // // // // // //       width: 0,
// // // // // // //       height: 4,
// // // // // // //     },
// // // // // // //     shadowOpacity: 0.12,
// // // // // // //     shadowRadius: 6,
// // // // // // //     elevation: 3,
// // // // // // //   },

// // // // // // //   letterText: {
// // // // // // //     color: "#FFFFFF",
// // // // // // //     fontSize: 23,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   tileYellow: {
// // // // // // //     backgroundColor: "#F4B942",
// // // // // // //   },

// // // // // // //   tileBlue: {
// // // // // // //     backgroundColor: "#3B82F6",
// // // // // // //   },

// // // // // // //   tilePink: {
// // // // // // //     backgroundColor: "#F15B6C",
// // // // // // //   },

// // // // // // //   tileGreen: {
// // // // // // //     backgroundColor: "#26B67A",
// // // // // // //   },

// // // // // // //   tileRotateLeft: {
// // // // // // //     transform: [{ rotate: "-6deg" }],
// // // // // // //   },

// // // // // // //   tileRotateRight: {
// // // // // // //     transform: [{ rotate: "6deg" }],
// // // // // // //   },

// // // // // // //   /* ==========================================================
// // // // // // //      PLAY CARD
// // // // // // //   ========================================================== */

// // // // // // //   playCard: {
// // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // //     borderRadius: 22,
// // // // // // //     padding: 17,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: "#EEE7DD",
// // // // // // //     shadowColor: "#000000",
// // // // // // //     shadowOffset: {
// // // // // // //       width: 0,
// // // // // // //       height: 6,
// // // // // // //     },
// // // // // // //     shadowOpacity: 0.07,
// // // // // // //     shadowRadius: 14,
// // // // // // //     elevation: 3,
// // // // // // //     alignSelf: "stretch",
// // // // // // //   },

// // // // // // //   playCardMobile: {
// // // // // // //     padding: 15,
// // // // // // //     borderRadius: 19,
// // // // // // //   },

// // // // // // //   playCardTop: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     marginBottom: 16,
// // // // // // //   },

// // // // // // //   lightningCircle: {
// // // // // // //     width: 43,
// // // // // // //     height: 43,
// // // // // // //     borderRadius: 14,
// // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     marginRight: 12,
// // // // // // //   },

// // // // // // //   playInfo: {
// // // // // // //     flex: 1,
// // // // // // //     minWidth: 0,
// // // // // // //   },

// // // // // // //   playCardTitle: {
// // // // // // //     color: "#172033",
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   playCardDescription: {
// // // // // // //     color: "#8A909A",
// // // // // // //     fontSize: 11.5,
// // // // // // //     marginTop: 3,
// // // // // // //   },

// // // // // // //   playersBadge: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     gap: 4,
// // // // // // //     backgroundColor: "#EEF1FF",
// // // // // // //     paddingHorizontal: 9,
// // // // // // //     paddingVertical: 6,
// // // // // // //     borderRadius: 10,
// // // // // // //   },

// // // // // // //   playersBadgeText: {
// // // // // // //     color: "#3949AB",
// // // // // // //     fontSize: 10,
// // // // // // //     fontWeight: "800",
// // // // // // //   },

// // // // // // //   playButton: {
// // // // // // //     height: 53,
// // // // // // //     width: 320,
// // // // // // //     maxWidth: "100%",
// // // // // // //     borderRadius: 15,
// // // // // // //     backgroundColor: "#5146E5",
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     alignSelf: "center",
// // // // // // //   },

// // // // // // //   playButtonMobile: {
// // // // // // //     width: 230,
// // // // // // //     height: 49,
// // // // // // //     borderRadius: 14,
// // // // // // //   },

// // // // // // //   playButtonText: {
// // // // // // //     color: "#FFFFFF",
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: "900",
// // // // // // //     letterSpacing: 0.8,
// // // // // // //   },

// // // // // // //   playArrow: {
// // // // // // //     width: 29,
// // // // // // //     height: 29,
// // // // // // //     borderRadius: 10,
// // // // // // //     backgroundColor: "rgba(255,255,255,0.18)",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     marginLeft: 12,
// // // // // // //   },

// // // // // // //   /* GUEST button (same width as PLAY ONLINE) */

// // // // // // //   guestButton: {
// // // // // // //     marginTop: 10,
// // // // // // //     height: 48,
// // // // // // //     width: 320,
// // // // // // //     maxWidth: "100%",
// // // // // // //     borderRadius: 15,
// // // // // // //     backgroundColor: "#FFEDEA",
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: "#FFD9D1",
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     alignSelf: "center",
// // // // // // //     gap: 8,
// // // // // // //   },

// // // // // // //   guestButtonMobile: {
// // // // // // //     width: 230,
// // // // // // //     height: 45,
// // // // // // //     borderRadius: 14,
// // // // // // //   },

// // // // // // //   guestButtonText: {
// // // // // // //     color: "#FF6B5A",
// // // // // // //     fontSize: 13,
// // // // // // //     fontWeight: "900",
// // // // // // //     letterSpacing: 0.8,
// // // // // // //   },

// // // // // // //   sectionHeader: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "space-between",
// // // // // // //     marginTop: 27,
// // // // // // //     marginBottom: 13,
// // // // // // //   },

// // // // // // //   sectionTitle: {
// // // // // // //     color: "#172033",
// // // // // // //     fontSize: 17,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   sectionSubtitle: {
// // // // // // //     color: "#9297A0",
// // // // // // //     fontSize: 11,
// // // // // // //     marginTop: 3,
// // // // // // //   },

// // // // // // //   /* ==========================================================
// // // // // // //      ROOM CARDS
// // // // // // //   ========================================================== */

// // // // // // //   roomContainer: {
// // // // // // //     flexDirection: "row",
// // // // // // //     gap: 12,
// // // // // // //   },

// // // // // // //   roomContainerMobile: {
// // // // // // //     flexDirection: "column",
// // // // // // //   },

// // // // // // //   createRoomCard: {
// // // // // // //     flex: 1,
// // // // // // //     minHeight: 157,
// // // // // // //     borderRadius: 19,
// // // // // // //     backgroundColor: "#FFF0EB",
// // // // // // //     padding: 14,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: "#FFE0D8",
// // // // // // //   },

// // // // // // //   joinRoomCard: {
// // // // // // //     flex: 1,
// // // // // // //     minHeight: 157,
// // // // // // //     borderRadius: 19,
// // // // // // //     backgroundColor: "#EEF0FF",
// // // // // // //     padding: 14,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: "#DDE1FF",
// // // // // // //   },

// // // // // // //   roomCardMobile: {
// // // // // // //     width: "100%",
// // // // // // //     flex: 0,
// // // // // // //     minHeight: 145,
// // // // // // //   },

// // // // // // //   roomIconCreate: {
// // // // // // //     width: 38,
// // // // // // //     height: 38,
// // // // // // //     borderRadius: 12,
// // // // // // //     backgroundColor: "#FF6B5A",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     marginBottom: 10,
// // // // // // //   },

// // // // // // //   roomIconJoin: {
// // // // // // //     width: 38,
// // // // // // //     height: 38,
// // // // // // //     borderRadius: 12,
// // // // // // //     backgroundColor: "#5146E5",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     marginBottom: 10,
// // // // // // //   },

// // // // // // //   roomCardTitle: {
// // // // // // //     color: "#172033",
// // // // // // //     fontSize: 13,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   roomCardText: {
// // // // // // //     color: "#858B96",
// // // // // // //     fontSize: 10.5,
// // // // // // //     marginTop: 3,
// // // // // // //   },

// // // // // // //   roomArrow: {
// // // // // // //     position: "absolute",
// // // // // // //     right: 13,
// // // // // // //     top: 17,
// // // // // // //   },

// // // // // // //   joinInputRow: {
// // // // // // //     flexDirection: "row",
// // // // // // //     marginTop: 10,
// // // // // // //     alignItems: "center",
// // // // // // //   },

// // // // // // //   joinInput: {
// // // // // // //     flex: 1,
// // // // // // //     minWidth: 0,
// // // // // // //     height: 36,
// // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // //     borderRadius: 9,
// // // // // // //     paddingHorizontal: 9,
// // // // // // //     color: "#172033",
// // // // // // //     fontSize: 10,
// // // // // // //     fontWeight: "800",
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: "#DDE1FF",
// // // // // // //   },

// // // // // // //   joinButton: {
// // // // // // //     width: 36,
// // // // // // //     height: 36,
// // // // // // //     borderRadius: 9,
// // // // // // //     backgroundColor: "#5146E5",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     marginLeft: 5,
// // // // // // //   },

// // // // // // //   challengeCard: {
// // // // // // //     marginTop: 22,
// // // // // // //     borderRadius: 18,
// // // // // // //     backgroundColor: "#172033",
// // // // // // //     padding: 15,
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "space-between",
// // // // // // //   },

// // // // // // //   challengeCardMobile: {
// // // // // // //     marginTop: 18,
// // // // // // //     padding: 14,
// // // // // // //   },

// // // // // // //   challengeLeft: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     flex: 1,
// // // // // // //     minWidth: 0,
// // // // // // //   },

// // // // // // //   challengeIcon: {
// // // // // // //     width: 42,
// // // // // // //     height: 42,
// // // // // // //     borderRadius: 13,
// // // // // // //     backgroundColor: "#F4B942",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     marginRight: 11,
// // // // // // //   },

// // // // // // //   challengeInfo: {
// // // // // // //     flex: 1,
// // // // // // //     minWidth: 0,
// // // // // // //   },

// // // // // // //   challengeTitle: {
// // // // // // //     color: "#FFFFFF",
// // // // // // //     fontSize: 13,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   challengeText: {
// // // // // // //     color: "#AAB1C0",
// // // // // // //     fontSize: 10.5,
// // // // // // //     marginTop: 3,
// // // // // // //   },

// // // // // // //   challengeProgress: {
// // // // // // //     alignItems: "flex-end",
// // // // // // //     marginLeft: 10,
// // // // // // //   },

// // // // // // //   progressNumber: {
// // // // // // //     color: "#FFD166",
// // // // // // //     fontSize: 17,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   progressText: {
// // // // // // //     color: "#8E97A9",
// // // // // // //     fontSize: 9,
// // // // // // //     marginTop: 1,
// // // // // // //   },

// // // // // // //   /* ==========================================================
// // // // // // //      LEADERBOARD
// // // // // // //   ========================================================== */

// // // // // // //   leaderHeader: {
// // // // // // //     marginTop: 27,
// // // // // // //     marginBottom: 12,
// // // // // // //     flexDirection: "row",
// // // // // // //     justifyContent: "space-between",
// // // // // // //     alignItems: "center",
// // // // // // //   },

// // // // // // //   viewAll: {
// // // // // // //     color: "#5146E5",
// // // // // // //     fontSize: 11,
// // // // // // //     fontWeight: "800",
// // // // // // //   },

// // // // // // //   leaderboardCard: {
// // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // //     borderRadius: 19,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: "#EEE7DD",
// // // // // // //     paddingHorizontal: 13,
// // // // // // //     overflow: "hidden",
// // // // // // //   },

// // // // // // //   playerRow: {
// // // // // // //     minHeight: 64,
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: "#F1EEE8",
// // // // // // //   },

// // // // // // //   lastPlayerRow: {
// // // // // // //     borderBottomWidth: 0,
// // // // // // //   },

// // // // // // //   rankCircle: {
// // // // // // //     width: 27,
// // // // // // //     height: 27,
// // // // // // //     borderRadius: 9,
// // // // // // //     backgroundColor: "#F0F0F0",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     marginRight: 9,
// // // // // // //   },

// // // // // // //   rankFirst: {
// // // // // // //     backgroundColor: "#FFF0B8",
// // // // // // //   },

// // // // // // //   rankSecond: {
// // // // // // //     backgroundColor: "#E8E8E8",
// // // // // // //   },

// // // // // // //   rankThird: {
// // // // // // //     backgroundColor: "#F5D6C7",
// // // // // // //   },

// // // // // // //   rankText: {
// // // // // // //     color: "#59606C",
// // // // // // //     fontSize: 11,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   playerAvatar: {
// // // // // // //     width: 37,
// // // // // // //     height: 37,
// // // // // // //     borderRadius: 13,
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     marginRight: 10,
// // // // // // //   },

// // // // // // //   playerInfo: {
// // // // // // //     flex: 1,
// // // // // // //     minWidth: 0,
// // // // // // //   },

// // // // // // //   playerName: {
// // // // // // //     color: "#202838",
// // // // // // //     fontSize: 13,
// // // // // // //     fontWeight: "800",
// // // // // // //   },

// // // // // // //   topPlayerLabel: {
// // // // // // //     color: "#FF6B5A",
// // // // // // //     fontSize: 8,
// // // // // // //     fontWeight: "900",
// // // // // // //     marginTop: 2,
// // // // // // //     letterSpacing: 0.6,
// // // // // // //   },

// // // // // // //   scoreContainer: {
// // // // // // //     alignItems: "flex-end",
// // // // // // //     marginLeft: 8,
// // // // // // //   },

// // // // // // //   scoreNumber: {
// // // // // // //     color: "#172033",
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: "900",
// // // // // // //   },

// // // // // // //   scoreLabel: {
// // // // // // //     color: "#9CA1AA",
// // // // // // //     fontSize: 7,
// // // // // // //     fontWeight: "800",
// // // // // // //     marginTop: 1,
// // // // // // //   },

// // // // // // //   emptyLeaderboard: {
// // // // // // //     height: 110,
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //   },

// // // // // // //   emptyText: {
// // // // // // //     color: "#9A9A9A",
// // // // // // //     fontSize: 11,
// // // // // // //     marginTop: 7,
// // // // // // //   },

// // // // // // //   /* ==========================================================
// // // // // // //      MOBILE BOTTOM NAV
// // // // // // //   ========================================================== */

// // // // // // //   bottomNav: {
// // // // // // //     height: 70,
// // // // // // //     // CHANGED: kept solid white (was already) — the bottom nav is a fixed
// // // // // // //     // control bar, so it stays fully opaque for legibility while the
// // // // // // //     // animated backdrop shows through everywhere else above it.
// // // // // // //     backgroundColor: "#FFFFFF",
// // // // // // //     borderTopWidth: 1,
// // // // // // //     borderTopColor: "#EEE7DD",
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "space-around",
// // // // // // //     paddingBottom: 4,
// // // // // // //   },

// // // // // // //   navItem: {
// // // // // // //     flex: 1,
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //   },

// // // // // // //   activeNavIcon: {
// // // // // // //     width: 37,
// // // // // // //     height: 32,
// // // // // // //     borderRadius: 12,
// // // // // // //     backgroundColor: "#5146E5",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //   },

// // // // // // //   activeNavText: {
// // // // // // //     color: "#5146E5",
// // // // // // //     fontSize: 9.5,
// // // // // // //     fontWeight: "900",
// // // // // // //     marginTop: 3,
// // // // // // //   },

// // // // // // //   navText: {
// // // // // // //     color: "#8C8C8C",
// // // // // // //     fontSize: 9.5,
// // // // // // //     fontWeight: "700",
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // // });
// // // // // // import React, { useEffect, useRef, useState } from "react";
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   StyleSheet,
// // // // // //   TouchableOpacity,
// // // // // //   TextInput,
// // // // // //   ScrollView,
// // // // // //   SafeAreaView,
// // // // // //   StatusBar,
// // // // // //   useWindowDimensions,
// // // // // //   Animated,
// // // // // //   Easing,
// // // // // // } from "react-native";
// // // // // // import { Ionicons } from "@expo/vector-icons";

// // // // // // export interface TopPlayer {
// // // // // //   rank: number;
// // // // // //   name: string;
// // // // // //   score: number;
// // // // // //   avatarColor: string;
// // // // // // }

// // // // // // interface WordScrambleHomeScreenProps {
// // // // // //   topPlayers: TopPlayer[];

// // // // // //   onPlayOnline: () => void;
// // // // // //   onCreateRoom: () => void;
// // // // // //   onJoinRoom: (code: string) => void;
// // // // // //   onViewAllPlayers: () => void;

// // // // // //   onGuestPlay?: () => void;

// // // // // //   /**
// // // // // //    * IMPORTANT:
// // // // // //    * Parent must pass this function.
// // // // // //    * This will navigate from Word Scramble Home
// // // // // //    * back to the Cyber Mind main menu.
// // // // // //    */
// // // // // //   onBack: () => void;

// // // // // //   onTabHome: () => void;
// // // // // //   onTabLeaderboard: () => void;
// // // // // //   onTabProfile: () => void;
// // // // // // };

// // // // // // /* ============================================================
// // // // // //    COLORS
// // // // // // ============================================================ */

// // // // // // const BG = {
// // // // // //   indigo: "#5146E5",
// // // // // //   coral: "#FF6B5A",
// // // // // //   yellow: "#F4B942",
// // // // // //   blue: "#3B82F6",
// // // // // //   green: "#26B67A",
// // // // // // };

// // // // // // /* ============================================================
// // // // // //    BACKGROUND BLOB
// // // // // // ============================================================ */

// // // // // // const BgBlob: React.FC<{
// // // // // //   color: string;
// // // // // //   size: number;
// // // // // //   left: number;
// // // // // //   top: number;
// // // // // //   driftX: number;
// // // // // //   driftY: number;
// // // // // //   duration: number;
// // // // // //   opacity?: number;
// // // // // // }> = ({
// // // // // //   color,
// // // // // //   size,
// // // // // //   left,
// // // // // //   top,
// // // // // //   driftX,
// // // // // //   driftY,
// // // // // //   duration,
// // // // // //   opacity = 0.1,
// // // // // // }) => {
// // // // // //   const anim = useRef(new Animated.Value(0)).current;

// // // // // //   useEffect(() => {
// // // // // //     const loop = Animated.loop(
// // // // // //       Animated.sequence([
// // // // // //         Animated.timing(anim, {
// // // // // //           toValue: 1,
// // // // // //           duration,
// // // // // //           easing: Easing.inOut(Easing.sin),
// // // // // //           useNativeDriver: true,
// // // // // //         }),
// // // // // //         Animated.timing(anim, {
// // // // // //           toValue: 0,
// // // // // //           duration,
// // // // // //           easing: Easing.inOut(Easing.sin),
// // // // // //           useNativeDriver: true,
// // // // // //         }),
// // // // // //       ])
// // // // // //     );

// // // // // //     loop.start();

// // // // // //     return () => loop.stop();
// // // // // //   }, [anim, duration]);

// // // // // //   const translateX = anim.interpolate({
// // // // // //     inputRange: [0, 1],
// // // // // //     outputRange: [0, driftX],
// // // // // //   });

// // // // // //   const translateY = anim.interpolate({
// // // // // //     inputRange: [0, 1],
// // // // // //     outputRange: [0, driftY],
// // // // // //   });

// // // // // //   const scale = anim.interpolate({
// // // // // //     inputRange: [0, 1],
// // // // // //     outputRange: [1, 1.1],
// // // // // //   });

// // // // // //   return (
// // // // // //     <Animated.View
// // // // // //       pointerEvents="none"
// // // // // //       style={{
// // // // // //         position: "absolute",
// // // // // //         left,
// // // // // //         top,
// // // // // //         width: size,
// // // // // //         height: size,
// // // // // //         borderRadius: size / 2,
// // // // // //         backgroundColor: color,
// // // // // //         opacity,
// // // // // //         transform: [{ translateX }, { translateY }, { scale }],
// // // // // //       }}
// // // // // //     />
// // // // // //   );
// // // // // // };

// // // // // // /* ============================================================
// // // // // //    BACKGROUND LETTER
// // // // // // ============================================================ */

// // // // // // const BgLetter: React.FC<{
// // // // // //   char: string;
// // // // // //   color: string;
// // // // // //   left: number;
// // // // // //   top: number;
// // // // // //   rotate: string;
// // // // // //   duration?: number;
// // // // // // }> = ({
// // // // // //   char,
// // // // // //   color,
// // // // // //   left,
// // // // // //   top,
// // // // // //   rotate,
// // // // // //   duration = 2600,
// // // // // // }) => {
// // // // // //   const bob = useRef(new Animated.Value(0)).current;

// // // // // //   useEffect(() => {
// // // // // //     const loop = Animated.loop(
// // // // // //       Animated.sequence([
// // // // // //         Animated.timing(bob, {
// // // // // //           toValue: 1,
// // // // // //           duration,
// // // // // //           easing: Easing.inOut(Easing.sin),
// // // // // //           useNativeDriver: true,
// // // // // //         }),
// // // // // //         Animated.timing(bob, {
// // // // // //           toValue: 0,
// // // // // //           duration,
// // // // // //           easing: Easing.inOut(Easing.sin),
// // // // // //           useNativeDriver: true,
// // // // // //         }),
// // // // // //       ])
// // // // // //     );

// // // // // //     loop.start();

// // // // // //     return () => loop.stop();
// // // // // //   }, [bob, duration]);

// // // // // //   const translateY = bob.interpolate({
// // // // // //     inputRange: [0, 1],
// // // // // //     outputRange: [0, -12],
// // // // // //   });

// // // // // //   return (
// // // // // //     <Animated.View
// // // // // //       pointerEvents="none"
// // // // // //       style={{
// // // // // //         position: "absolute",
// // // // // //         left,
// // // // // //         top,
// // // // // //         width: 40,
// // // // // //         height: 40,
// // // // // //         borderRadius: 11,
// // // // // //         backgroundColor: color,
// // // // // //         alignItems: "center",
// // // // // //         justifyContent: "center",
// // // // // //         opacity: 0.1,
// // // // // //         transform: [{ translateY }, { rotate }],
// // // // // //       }}
// // // // // //     >
// // // // // //       <Text
// // // // // //         style={{
// // // // // //           color: "#FFFFFF",
// // // // // //           fontSize: 17,
// // // // // //           fontWeight: "900",
// // // // // //         }}
// // // // // //       >
// // // // // //         {char}
// // // // // //       </Text>
// // // // // //     </Animated.View>
// // // // // //   );
// // // // // // };

// // // // // // /* ============================================================
// // // // // //    ANIMATED BACKGROUND
// // // // // // ============================================================ */

// // // // // // const AnimatedHomeBackground: React.FC<{
// // // // // //   width: number;
// // // // // //   height: number;
// // // // // // }> = ({ width, height }) => {
// // // // // //   return (
// // // // // //     <View
// // // // // //       style={StyleSheet.absoluteFill}
// // // // // //       pointerEvents="none"
// // // // // //     >
// // // // // //       <BgBlob
// // // // // //         color={BG.indigo}
// // // // // //         size={300}
// // // // // //         left={-80}
// // // // // //         top={-60}
// // // // // //         driftX={35}
// // // // // //         driftY={25}
// // // // // //         duration={5200}
// // // // // //         opacity={0.09}
// // // // // //       />

// // // // // //       <BgBlob
// // // // // //         color={BG.coral}
// // // // // //         size={240}
// // // // // //         left={width - 160}
// // // // // //         top={40}
// // // // // //         driftX={-25}
// // // // // //         driftY={35}
// // // // // //         duration={4600}
// // // // // //         opacity={0.1}
// // // // // //       />

// // // // // //       <BgBlob
// // // // // //         color={BG.yellow}
// // // // // //         size={210}
// // // // // //         left={width * 0.4}
// // // // // //         top={height * 0.45}
// // // // // //         driftX={30}
// // // // // //         driftY={-20}
// // // // // //         duration={6000}
// // // // // //         opacity={0.08}
// // // // // //       />

// // // // // //       <BgBlob
// // // // // //         color={BG.green}
// // // // // //         size={220}
// // // // // //         left={-70}
// // // // // //         top={height * 0.6}
// // // // // //         driftX={30}
// // // // // //         driftY={-30}
// // // // // //         duration={5400}
// // // // // //         opacity={0.08}
// // // // // //       />

// // // // // //       <BgBlob
// // // // // //         color={BG.blue}
// // // // // //         size={180}
// // // // // //         left={width - 120}
// // // // // //         top={height * 0.75}
// // // // // //         driftX={-25}
// // // // // //         driftY={-20}
// // // // // //         duration={4900}
// // // // // //         opacity={0.09}
// // // // // //       />

// // // // // //       <BgLetter
// // // // // //         char="W"
// // // // // //         color={BG.yellow}
// // // // // //         left={width * 0.08}
// // // // // //         top={height * 0.15}
// // // // // //         rotate="-8deg"
// // // // // //       />

// // // // // //       <BgLetter
// // // // // //         char="O"
// // // // // //         color={BG.blue}
// // // // // //         left={width * 0.82}
// // // // // //         top={height * 0.22}
// // // // // //         rotate="7deg"
// // // // // //       />

// // // // // //       <BgLetter
// // // // // //         char="R"
// // // // // //         color={BG.coral}
// // // // // //         left={width * 0.85}
// // // // // //         top={height * 0.58}
// // // // // //         rotate="-6deg"
// // // // // //       />

// // // // // //       <BgLetter
// // // // // //         char="D"
// // // // // //         color={BG.green}
// // // // // //         left={width * 0.06}
// // // // // //         top={height * 0.72}
// // // // // //         rotate="5deg"
// // // // // //       />
// // // // // //     </View>
// // // // // //   );
// // // // // // };

// // // // // // /* ============================================================
// // // // // //    MAIN SCREEN
// // // // // // ============================================================ */

// // // // // // const WordScrambleHomeScreen: React.FC<
// // // // // //   WordScrambleHomeScreenProps
// // // // // // > = ({
// // // // // //   topPlayers,
// // // // // //   onPlayOnline,
// // // // // //   onCreateRoom,
// // // // // //   onJoinRoom,
// // // // // //   onViewAllPlayers,
// // // // // //   onGuestPlay,
// // // // // //   onBack,
// // // // // //   onTabHome,
// // // // // //   onTabLeaderboard,
// // // // // //   onTabProfile,
// // // // // // }) => {
// // // // // //   const { width, height } = useWindowDimensions();

// // // // // //   const isMobile = width < 768;
// // // // // //   const isTablet = width >= 768 && width < 1100;

// // // // // //   const [joinCode, setJoinCode] = useState("");

// // // // // //   const handleJoinRoom = () => {
// // // // // //     const code = joinCode.trim();

// // // // // //     if (!code) {
// // // // // //       return;
// // // // // //     }

// // // // // //     onJoinRoom(code);
// // // // // //   };

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // //       <StatusBar
// // // // // //         barStyle="dark-content"
// // // // // //         backgroundColor="#FFF9F0"
// // // // // //       />

// // // // // //       <AnimatedHomeBackground
// // // // // //         width={width}
// // // // // //         height={height}
// // // // // //       />

// // // // // //       <View style={styles.root}>

// // // // // //         {/* ==================================================
// // // // // //             SIDEBAR
// // // // // //         ================================================== */}

// // // // // //         {!isMobile && (
// // // // // //           <View
// // // // // //             style={[
// // // // // //               styles.sidebar,
// // // // // //               isTablet && styles.sidebarTablet,
// // // // // //             ]}
// // // // // //           >
// // // // // //             <View style={styles.sidebarBrand}>

// // // // // //               <View style={styles.sidebarLogo}>
// // // // // //                 <Text style={styles.logoW}>W</Text>
// // // // // //                 <Text style={styles.logoS}>S</Text>
// // // // // //               </View>

// // // // // //               <View>
// // // // // //                 <Text style={styles.sidebarBrandTitle}>
// // // // // //                   Word
// // // // // //                   <Text style={styles.sidebarBrandAccent}>
// // // // // //                     {" "}Scramble
// // // // // //                   </Text>
// // // // // //                 </Text>

// // // // // //                 <Text style={styles.sidebarBrandSubtitle}>
// // // // // //                   Think fast. Play smart.
// // // // // //                 </Text>
// // // // // //               </View>
// // // // // //             </View>

// // // // // //             <View style={styles.sidebarNavigation}>

// // // // // //               <TouchableOpacity
// // // // // //                 style={[
// // // // // //                   styles.sidebarNavItem,
// // // // // //                   styles.sidebarNavActive,
// // // // // //                 ]}
// // // // // //                 onPress={onTabHome}
// // // // // //                 activeOpacity={0.8}
// // // // // //               >
// // // // // //                 <View style={styles.sidebarActiveIcon}>
// // // // // //                   <Ionicons
// // // // // //                     name="home"
// // // // // //                     size={21}
// // // // // //                     color="#FFFFFF"
// // // // // //                   />
// // // // // //                 </View>

// // // // // //                 <Text style={styles.sidebarActiveText}>
// // // // // //                   Home
// // // // // //                 </Text>
// // // // // //               </TouchableOpacity>

// // // // // //               <TouchableOpacity
// // // // // //                 style={styles.sidebarNavItem}
// // // // // //                 onPress={onTabLeaderboard}
// // // // // //                 activeOpacity={0.8}
// // // // // //               >
// // // // // //                 <Ionicons
// // // // // //                   name="trophy-outline"
// // // // // //                   size={22}
// // // // // //                   color="#657084"
// // // // // //                 />

// // // // // //                 <Text style={styles.sidebarText}>
// // // // // //                   Rankings
// // // // // //                 </Text>
// // // // // //               </TouchableOpacity>

// // // // // //               <TouchableOpacity
// // // // // //                 style={styles.sidebarNavItem}
// // // // // //                 onPress={onTabProfile}
// // // // // //                 activeOpacity={0.8}
// // // // // //               >
// // // // // //                 <Ionicons
// // // // // //                   name="person-outline"
// // // // // //                   size={22}
// // // // // //                   color="#657084"
// // // // // //                 />

// // // // // //                 <Text style={styles.sidebarText}>
// // // // // //                   Profile
// // // // // //                 </Text>
// // // // // //               </TouchableOpacity>
// // // // // //             </View>

// // // // // //             <View style={styles.sidebarBottomCard}>

// // // // // //               <View style={styles.sidebarBottomIcon}>
// // // // // //                 <Ionicons
// // // // // //                   name="sparkles"
// // // // // //                   size={21}
// // // // // //                   color="#FFFFFF"
// // // // // //                 />
// // // // // //               </View>

// // // // // //               <Text style={styles.sidebarBottomTitle}>
// // // // // //                 Ready for a challenge?
// // // // // //               </Text>

// // // // // //               <Text style={styles.sidebarBottomText}>
// // // // // //                 Unscramble words and climb the rankings.
// // // // // //               </Text>

// // // // // //             </View>
// // // // // //           </View>
// // // // // //         )}

// // // // // //         {/* ==================================================
// // // // // //             MAIN
// // // // // //         ================================================== */}

// // // // // //         <View
// // // // // //           style={[
// // // // // //             styles.main,
// // // // // //             !isMobile && styles.mainDesktop,
// // // // // //           ]}
// // // // // //         >

// // // // // //           {/* ==================================================
// // // // // //               MOBILE HEADER
// // // // // //           ================================================== */}

// // // // // //           {isMobile && (
// // // // // //             <View style={styles.mobileHeader}>

// // // // // //               <View style={styles.mobileHeaderLeft}>

// // // // // //                 {/* ==========================================
// // // // // //                     BACK BUTTON
// // // // // //                     IMPORTANT: ALWAYS VISIBLE
// // // // // //                 ========================================== */}

// // // // // //                 <TouchableOpacity
// // // // // //                   style={styles.headerBackButton}
// // // // // //                   activeOpacity={0.75}
// // // // // //                   onPress={onBack}
// // // // // //                   accessibilityRole="button"
// // // // // //                   accessibilityLabel="Go back"
// // // // // //                 >
// // // // // //                   <Ionicons
// // // // // //                     name="arrow-back"
// // // // // //                     size={22}
// // // // // //                     color="#172033"
// // // // // //                   />
// // // // // //                 </TouchableOpacity>

// // // // // //                 {/* LOGO */}

// // // // // //                 <View style={styles.mobileLogo}>
// // // // // //                   <Text style={styles.logoW}>W</Text>
// // // // // //                   <Text style={styles.logoS}>S</Text>
// // // // // //                 </View>

// // // // // //                 <View>
// // // // // //                   <Text style={styles.mobileBrandTitle}>
// // // // // //                     Word
// // // // // //                     <Text style={styles.mobileBrandAccent}>
// // // // // //                       {" "}Scramble
// // // // // //                     </Text>
// // // // // //                   </Text>

// // // // // //                   <Text style={styles.mobileBrandSubtitle}>
// // // // // //                     Think fast. Play smart.
// // // // // //                   </Text>
// // // // // //                 </View>

// // // // // //               </View>

// // // // // //               <TouchableOpacity
// // // // // //                 style={styles.mobileNotification}
// // // // // //                 activeOpacity={0.8}
// // // // // //               >
// // // // // //                 <Ionicons
// // // // // //                   name="notifications-outline"
// // // // // //                   size={20}
// // // // // //                   color="#172033"
// // // // // //                 />
// // // // // //               </TouchableOpacity>

// // // // // //             </View>
// // // // // //           )}

// // // // // //           {/* ==================================================
// // // // // //               DESKTOP HEADER
// // // // // //           ================================================== */}

// // // // // //           {!isMobile && (
// // // // // //             <View style={styles.desktopTopHeader}>

// // // // // //               <View style={styles.desktopHeaderLeft}>

// // // // // //                 {/* BACK BUTTON */}

// // // // // //                 <TouchableOpacity
// // // // // //                   style={styles.headerBackButton}
// // // // // //                   activeOpacity={0.75}
// // // // // //                   onPress={onBack}
// // // // // //                   accessibilityRole="button"
// // // // // //                   accessibilityLabel="Go back"
// // // // // //                 >
// // // // // //                   <Ionicons
// // // // // //                     name="arrow-back"
// // // // // //                     size={21}
// // // // // //                     color="#172033"
// // // // // //                   />
// // // // // //                 </TouchableOpacity>

// // // // // //                 <View>
// // // // // //                   <Text style={styles.desktopWelcome}>
// // // // // //                     Welcome back!
// // // // // //                   </Text>

// // // // // //                   <Text style={styles.desktopWelcomeSub}>
// // // // // //                     Ready to play?
// // // // // //                   </Text>
// // // // // //                 </View>

// // // // // //               </View>

// // // // // //               <TouchableOpacity
// // // // // //                 style={styles.desktopNotification}
// // // // // //               >
// // // // // //                 <Ionicons
// // // // // //                   name="notifications-outline"
// // // // // //                   size={20}
// // // // // //                   color="#172033"
// // // // // //                 />
// // // // // //               </TouchableOpacity>

// // // // // //             </View>
// // // // // //           )}

// // // // // //           {/* ==================================================
// // // // // //               CONTENT
// // // // // //           ================================================== */}

// // // // // //           <ScrollView
// // // // // //             showsVerticalScrollIndicator={false}
// // // // // //             contentContainerStyle={[
// // // // // //               styles.scrollContent,
// // // // // //               isMobile && styles.scrollContentMobile,
// // // // // //               isTablet && styles.scrollContentTablet,
// // // // // //             ]}
// // // // // //           >

// // // // // //             {/* HERO */}

// // // // // //             <View
// // // // // //               style={[
// // // // // //                 styles.heroSection,
// // // // // //                 isMobile && styles.heroMobile,
// // // // // //               ]}
// // // // // //             >

// // // // // //               <Text style={styles.smallGreeting}>
// // // // // //                 READY TO PLAY?
// // // // // //               </Text>

// // // // // //               <Text
// // // // // //                 style={[
// // // // // //                   styles.heroTitle,
// // // // // //                   isMobile && styles.heroTitleMobile,
// // // // // //                 ]}
// // // // // //               >
// // // // // //                 Unscramble.
// // // // // //                 {"\n"}
// // // // // //                 <Text style={styles.heroAccent}>
// // // // // //                   Outsmart.
// // // // // //                 </Text>
// // // // // //               </Text>

// // // // // //               <Text
// // // // // //                 style={[
// // // // // //                   styles.heroDescription,
// // // // // //                   isMobile &&
// // // // // //                     styles.heroDescriptionMobile,
// // // // // //                 ]}
// // // // // //               >
// // // // // //                 Arrange the letters, find the hidden word,
// // // // // //                 and race against your friends.
// // // // // //               </Text>

// // // // // //             </View>

// // // // // //             {/* LETTERS */}

// // // // // //             <View
// // // // // //               style={[
// // // // // //                 styles.lettersContainer,
// // // // // //                 isMobile && styles.lettersMobile,
// // // // // //               ]}
// // // // // //             >

// // // // // //               <View
// // // // // //                 style={[
// // // // // //                   styles.letterTile,
// // // // // //                   styles.tileYellow,
// // // // // //                   styles.tileRotateLeft,
// // // // // //                 ]}
// // // // // //               >
// // // // // //                 <Text style={styles.letterText}>W</Text>
// // // // // //               </View>

// // // // // //               <View
// // // // // //                 style={[
// // // // // //                   styles.letterTile,
// // // // // //                   styles.tileBlue,
// // // // // //                   styles.tileRotateRight,
// // // // // //                 ]}
// // // // // //               >
// // // // // //                 <Text style={styles.letterText}>O</Text>
// // // // // //               </View>

// // // // // //               <View
// // // // // //                 style={[
// // // // // //                   styles.letterTile,
// // // // // //                   styles.tilePink,
// // // // // //                 ]}
// // // // // //               >
// // // // // //                 <Text style={styles.letterText}>R</Text>
// // // // // //               </View>

// // // // // //               <View
// // // // // //                 style={[
// // // // // //                   styles.letterTile,
// // // // // //                   styles.tileGreen,
// // // // // //                   styles.tileRotateLeft,
// // // // // //                 ]}
// // // // // //               >
// // // // // //                 <Text style={styles.letterText}>D</Text>
// // // // // //               </View>

// // // // // //             </View>

// // // // // //             {/* QUICK MATCH */}

// // // // // //             <View
// // // // // //               style={[
// // // // // //                 styles.playCard,
// // // // // //                 isMobile && styles.playCardMobile,
// // // // // //               ]}
// // // // // //             >

// // // // // //               <View style={styles.playCardTop}>

// // // // // //                 <View style={styles.lightningCircle}>
// // // // // //                   <Ionicons
// // // // // //                     name="flash"
// // // // // //                     size={21}
// // // // // //                     color="#FFFFFF"
// // // // // //                   />
// // // // // //                 </View>

// // // // // //                 <View style={styles.playInfo}>
// // // // // //                   <Text style={styles.playCardTitle}>
// // // // // //                     Quick Match
// // // // // //                   </Text>

// // // // // //                   <Text style={styles.playCardDescription}>
// // // // // //                     Jump into a live word battle
// // // // // //                   </Text>
// // // // // //                 </View>

// // // // // //                 <View style={styles.playersBadge}>
// // // // // //                   <Ionicons
// // // // // //                     name="people-outline"
// // // // // //                     size={14}
// // // // // //                     color="#3949AB"
// // // // // //                   />

// // // // // //                   <Text style={styles.playersBadgeText}>
// // // // // //                     2–8
// // // // // //                   </Text>
// // // // // //                 </View>

// // // // // //               </View>

// // // // // //               <TouchableOpacity
// // // // // //                 activeOpacity={0.88}
// // // // // //                 onPress={onPlayOnline}
// // // // // //                 style={[
// // // // // //                   styles.playButton,
// // // // // //                   isMobile &&
// // // // // //                     styles.playButtonMobile,
// // // // // //                 ]}
// // // // // //               >
// // // // // //                 <Text style={styles.playButtonText}>
// // // // // //                   PLAY ONLINE
// // // // // //                 </Text>

// // // // // //                 <View style={styles.playArrow}>
// // // // // //                   <Ionicons
// // // // // //                     name="arrow-forward"
// // // // // //                     size={18}
// // // // // //                     color="#FFFFFF"
// // // // // //                   />
// // // // // //                 </View>
// // // // // //               </TouchableOpacity>

// // // // // //               {onGuestPlay && (
// // // // // //                 <TouchableOpacity
// // // // // //                   activeOpacity={0.85}
// // // // // //                   onPress={onGuestPlay}
// // // // // //                   style={[
// // // // // //                     styles.guestButton,
// // // // // //                     isMobile &&
// // // // // //                       styles.guestButtonMobile,
// // // // // //                   ]}
// // // // // //                 >
// // // // // //                   <Ionicons
// // // // // //                     name="person-outline"
// // // // // //                     size={18}
// // // // // //                     color="#FF6B5A"
// // // // // //                   />

// // // // // //                   <Text style={styles.guestButtonText}>
// // // // // //                     PLAY AS GUEST
// // // // // //                   </Text>
// // // // // //                 </TouchableOpacity>
// // // // // //               )}

// // // // // //             </View>

// // // // // //             {/* PLAY WITH FRIENDS */}

// // // // // //             <View style={styles.sectionHeader}>

// // // // // //               <View>
// // // // // //                 <Text style={styles.sectionTitle}>
// // // // // //                   Play with friends
// // // // // //                 </Text>

// // // // // //                 <Text style={styles.sectionSubtitle}>
// // // // // //                   Create or join a private room
// // // // // //                 </Text>
// // // // // //               </View>

// // // // // //               <Ionicons
// // // // // //                 name="people-circle-outline"
// // // // // //                 size={28}
// // // // // //                 color="#FF6B5A"
// // // // // //               />

// // // // // //             </View>

// // // // // //             {/* ROOMS */}

// // // // // //             <View
// // // // // //               style={[
// // // // // //                 styles.roomContainer,
// // // // // //                 isMobile &&
// // // // // //                   styles.roomContainerMobile,
// // // // // //               ]}
// // // // // //             >

// // // // // //               {/* CREATE */}

// // // // // //               <TouchableOpacity
// // // // // //                 activeOpacity={0.85}
// // // // // //                 onPress={onCreateRoom}
// // // // // //                 style={[
// // // // // //                   styles.createRoomCard,
// // // // // //                   isMobile &&
// // // // // //                     styles.roomCardMobile,
// // // // // //                 ]}
// // // // // //               >

// // // // // //                 <View style={styles.roomIconCreate}>
// // // // // //                   <Ionicons
// // // // // //                     name="add"
// // // // // //                     size={24}
// // // // // //                     color="#FFFFFF"
// // // // // //                   />
// // // // // //                 </View>

// // // // // //                 <Text style={styles.roomCardTitle}>
// // // // // //                   Create Room
// // // // // //                 </Text>

// // // // // //                 <Text style={styles.roomCardText}>
// // // // // //                   Start a new game
// // // // // //                 </Text>

// // // // // //                 <View style={styles.roomArrow}>
// // // // // //                   <Ionicons
// // // // // //                     name="arrow-forward"
// // // // // //                     size={17}
// // // // // //                     color="#FF6B5A"
// // // // // //                   />
// // // // // //                 </View>

// // // // // //               </TouchableOpacity>

// // // // // //               {/* JOIN */}

// // // // // //               <View
// // // // // //                 style={[
// // // // // //                   styles.joinRoomCard,
// // // // // //                   isMobile &&
// // // // // //                     styles.roomCardMobile,
// // // // // //                 ]}
// // // // // //               >

// // // // // //                 <View style={styles.roomIconJoin}>
// // // // // //                   <Ionicons
// // // // // //                     name="enter-outline"
// // // // // //                     size={22}
// // // // // //                     color="#FFFFFF"
// // // // // //                   />
// // // // // //                 </View>

// // // // // //                 <Text style={styles.roomCardTitle}>
// // // // // //                   Join Room
// // // // // //                 </Text>

// // // // // //                 <Text style={styles.roomCardText}>
// // // // // //                   Enter room code
// // // // // //                 </Text>

// // // // // //                 <View style={styles.joinInputRow}>

// // // // // //                   <TextInput
// // // // // //                     value={joinCode}
// // // // // //                     onChangeText={setJoinCode}
// // // // // //                     placeholder="ROOM CODE"
// // // // // //                     placeholderTextColor="#9A9A9A"
// // // // // //                     autoCapitalize="characters"
// // // // // //                     maxLength={8}
// // // // // //                     style={styles.joinInput}
// // // // // //                   />

// // // // // //                   <TouchableOpacity
// // // // // //                     activeOpacity={0.8}
// // // // // //                     onPress={handleJoinRoom}
// // // // // //                     style={styles.joinButton}
// // // // // //                   >
// // // // // //                     <Ionicons
// // // // // //                       name="arrow-forward"
// // // // // //                       size={18}
// // // // // //                       color="#FFFFFF"
// // // // // //                     />
// // // // // //                   </TouchableOpacity>

// // // // // //                 </View>

// // // // // //               </View>

// // // // // //             </View>

// // // // // //             {/* DAILY CHALLENGE */}

// // // // // //             <View
// // // // // //               style={[
// // // // // //                 styles.challengeCard,
// // // // // //                 isMobile &&
// // // // // //                   styles.challengeCardMobile,
// // // // // //               ]}
// // // // // //             >

// // // // // //               <View style={styles.challengeLeft}>

// // // // // //                 <View style={styles.challengeIcon}>
// // // // // //                   <Ionicons
// // // // // //                     name="trophy"
// // // // // //                     size={22}
// // // // // //                     color="#FFFFFF"
// // // // // //                   />
// // // // // //                 </View>

// // // // // //                 <View style={styles.challengeInfo}>
// // // // // //                   <Text style={styles.challengeTitle}>
// // // // // //                     Daily Challenge
// // // // // //                   </Text>

// // // // // //                   <Text style={styles.challengeText}>
// // // // // //                     Solve today's puzzle
// // // // // //                   </Text>
// // // // // //                 </View>

// // // // // //               </View>

// // // // // //               <View style={styles.challengeProgress}>
// // // // // //                 <Text style={styles.progressNumber}>
// // // // // //                   3/5
// // // // // //                 </Text>

// // // // // //                 <Text style={styles.progressText}>
// // // // // //                   rounds
// // // // // //                 </Text>
// // // // // //               </View>

// // // // // //             </View>

// // // // // //             {/* LEADERBOARD */}

// // // // // //             <View style={styles.leaderHeader}>

// // // // // //               <View>
// // // // // //                 <Text style={styles.sectionTitle}>
// // // // // //                   Top Players
// // // // // //                 </Text>

// // // // // //                 <Text style={styles.sectionSubtitle}>
// // // // // //                   Today's leaderboard
// // // // // //                 </Text>
// // // // // //               </View>

// // // // // //               <TouchableOpacity
// // // // // //                 activeOpacity={0.7}
// // // // // //                 onPress={onViewAllPlayers}
// // // // // //               >
// // // // // //                 <Text style={styles.viewAll}>
// // // // // //                   View all
// // // // // //                 </Text>
// // // // // //               </TouchableOpacity>

// // // // // //             </View>

// // // // // //             <View style={styles.leaderboardCard}>

// // // // // //               {topPlayers.length === 0 ? (
// // // // // //                 <View style={styles.emptyLeaderboard}>

// // // // // //                   <Ionicons
// // // // // //                     name="trophy-outline"
// // // // // //                     size={28}
// // // // // //                     color="#B0B0B0"
// // // // // //                   />

// // // // // //                   <Text style={styles.emptyText}>
// // // // // //                     No players yet
// // // // // //                   </Text>

// // // // // //                 </View>
// // // // // //               ) : (
// // // // // //                 topPlayers.map((player, index) => (
// // // // // //                   <View
// // // // // //                     key={`${player.rank}-${player.name}`}
// // // // // //                     style={[
// // // // // //                       styles.playerRow,
// // // // // //                       index ===
// // // // // //                         topPlayers.length - 1 &&
// // // // // //                         styles.lastPlayerRow,
// // // // // //                     ]}
// // // // // //                   >

// // // // // //                     <View
// // // // // //                       style={[
// // // // // //                         styles.rankCircle,
// // // // // //                         player.rank === 1 &&
// // // // // //                           styles.rankFirst,
// // // // // //                         player.rank === 2 &&
// // // // // //                           styles.rankSecond,
// // // // // //                         player.rank === 3 &&
// // // // // //                           styles.rankThird,
// // // // // //                       ]}
// // // // // //                     >
// // // // // //                       <Text style={styles.rankText}>
// // // // // //                         {player.rank}
// // // // // //                       </Text>
// // // // // //                     </View>

// // // // // //                     <View
// // // // // //                       style={[
// // // // // //                         styles.playerAvatar,
// // // // // //                         {
// // // // // //                           backgroundColor:
// // // // // //                             player.avatarColor ||
// // // // // //                             "#FF6B5A",
// // // // // //                         },
// // // // // //                       ]}
// // // // // //                     >
// // // // // //                       <Ionicons
// // // // // //                         name="person"
// // // // // //                         size={17}
// // // // // //                         color="#FFFFFF"
// // // // // //                       />
// // // // // //                     </View>

// // // // // //                     <View style={styles.playerInfo}>

// // // // // //                       <Text style={styles.playerName}>
// // // // // //                         {player.name}
// // // // // //                       </Text>

// // // // // //                       {player.rank === 1 && (
// // // // // //                         <Text style={styles.topPlayerLabel}>
// // // // // //                           TOP PLAYER
// // // // // //                         </Text>
// // // // // //                       )}

// // // // // //                     </View>

// // // // // //                     <View style={styles.scoreContainer}>

// // // // // //                       <Text style={styles.scoreNumber}>
// // // // // //                         {player.score}
// // // // // //                       </Text>

// // // // // //                       <Text style={styles.scoreLabel}>
// // // // // //                         PTS
// // // // // //                       </Text>

// // // // // //                     </View>

// // // // // //                   </View>
// // // // // //                 ))
// // // // // //               )}

// // // // // //             </View>

// // // // // //             <View
// // // // // //               style={{
// // // // // //                 height: isMobile ? 90 : 40,
// // // // // //               }}
// // // // // //             />

// // // // // //           </ScrollView>

// // // // // //           {/* ==================================================
// // // // // //               MOBILE BOTTOM NAV
// // // // // //           ================================================== */}

// // // // // //           {isMobile && (
// // // // // //             <View style={styles.bottomNav}>

// // // // // //               <TouchableOpacity
// // // // // //                 style={styles.navItem}
// // // // // //                 activeOpacity={0.8}
// // // // // //                 onPress={onTabHome}
// // // // // //               >
// // // // // //                 <View style={styles.activeNavIcon}>
// // // // // //                   <Ionicons
// // // // // //                     name="home"
// // // // // //                     size={20}
// // // // // //                     color="#FFFFFF"
// // // // // //                   />
// // // // // //                 </View>

// // // // // //                 <Text style={styles.activeNavText}>
// // // // // //                   Home
// // // // // //                 </Text>
// // // // // //               </TouchableOpacity>

// // // // // //               <TouchableOpacity
// // // // // //                 style={styles.navItem}
// // // // // //                 activeOpacity={0.8}
// // // // // //                 onPress={onTabLeaderboard}
// // // // // //               >
// // // // // //                 <Ionicons
// // // // // //                   name="trophy-outline"
// // // // // //                   size={21}
// // // // // //                   color="#8C8C8C"
// // // // // //                 />

// // // // // //                 <Text style={styles.navText}>
// // // // // //                   Rankings
// // // // // //                 </Text>
// // // // // //               </TouchableOpacity>

// // // // // //               <TouchableOpacity
// // // // // //                 style={styles.navItem}
// // // // // //                 activeOpacity={0.8}
// // // // // //                 onPress={onTabProfile}
// // // // // //               >
// // // // // //                 <Ionicons
// // // // // //                   name="person-outline"
// // // // // //                   size={21}
// // // // // //                   color="#8C8C8C"
// // // // // //                 />

// // // // // //                 <Text style={styles.navText}>
// // // // // //                   Profile
// // // // // //                 </Text>
// // // // // //               </TouchableOpacity>

// // // // // //             </View>
// // // // // //           )}

// // // // // //         </View>
// // // // // //       </View>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // export default WordScrambleHomeScreen;

// // // // // // /* ============================================================
// // // // // //    STYLES
// // // // // // ============================================================ */

// // // // // // const styles = StyleSheet.create({

// // // // // //   safeArea: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: "#FFF9F0",
// // // // // //   },

// // // // // //   root: {
// // // // // //     flex: 1,
// // // // // //     flexDirection: "row",
// // // // // //     backgroundColor: "transparent",
// // // // // //   },

// // // // // //   /* ==========================================================
// // // // // //      SIDEBAR
// // // // // //   ========================================================== */

// // // // // //   sidebar: {
// // // // // //     width: 292,
// // // // // //     backgroundColor: "rgba(255,253,249,0.97)",
// // // // // //     borderRightWidth: 1,
// // // // // //     borderRightColor: "#EDE5D9",
// // // // // //     paddingHorizontal: 19,
// // // // // //     paddingTop: 22,
// // // // // //     paddingBottom: 18,
// // // // // //     justifyContent: "space-between",
// // // // // //   },

// // // // // //   sidebarTablet: {
// // // // // //     width: 245,
// // // // // //   },

// // // // // //   sidebarBrand: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //   },

// // // // // //   sidebarLogo: {
// // // // // //     width: 58,
// // // // // //     height: 58,
// // // // // //     borderRadius: 17,
// // // // // //     backgroundColor: "#172033",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     flexDirection: "row",
// // // // // //     marginRight: 11,
// // // // // //     transform: [{ rotate: "-5deg" }],
// // // // // //   },

// // // // // //   logoW: {
// // // // // //     color: "#FFD166",
// // // // // //     fontSize: 21,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   logoS: {
// // // // // //     color: "#FF6B5A",
// // // // // //     fontSize: 21,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   sidebarBrandTitle: {
// // // // // //     color: "#172033",
// // // // // //     fontSize: 19,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   sidebarBrandAccent: {
// // // // // //     color: "#FF6B5A",
// // // // // //   },

// // // // // //   sidebarBrandSubtitle: {
// // // // // //     color: "#7B8491",
// // // // // //     fontSize: 10.5,
// // // // // //     fontWeight: "600",
// // // // // //     marginTop: 2,
// // // // // //   },

// // // // // //   sidebarNavigation: {
// // // // // //     marginTop: 50,
// // // // // //     flex: 1,
// // // // // //   },

// // // // // //   sidebarNavItem: {
// // // // // //     height: 58,
// // // // // //     borderRadius: 15,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     paddingHorizontal: 15,
// // // // // //     marginBottom: 7,
// // // // // //   },

// // // // // //   sidebarNavActive: {
// // // // // //     backgroundColor: "#EEE9FF",
// // // // // //   },

// // // // // //   sidebarActiveIcon: {
// // // // // //     width: 40,
// // // // // //     height: 40,
// // // // // //     borderRadius: 12,
// // // // // //     backgroundColor: "#5146E5",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginRight: 11,
// // // // // //   },

// // // // // //   sidebarActiveText: {
// // // // // //     color: "#5146E5",
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   sidebarText: {
// // // // // //     color: "#596579",
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: "700",
// // // // // //     marginLeft: 16,
// // // // // //   },

// // // // // //   sidebarBottomCard: {
// // // // // //     backgroundColor: "#172033",
// // // // // //     borderRadius: 19,
// // // // // //     padding: 17,
// // // // // //     minHeight: 137,
// // // // // //   },

// // // // // //   sidebarBottomIcon: {
// // // // // //     width: 43,
// // // // // //     height: 43,
// // // // // //     borderRadius: 13,
// // // // // //     backgroundColor: "#FF6B5A",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginBottom: 11,
// // // // // //   },

// // // // // //   sidebarBottomTitle: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   sidebarBottomText: {
// // // // // //     color: "#AEB7C7",
// // // // // //     fontSize: 10.5,
// // // // // //     lineHeight: 17,
// // // // // //     marginTop: 5,
// // // // // //   },

// // // // // //   /* ==========================================================
// // // // // //      MAIN
// // // // // //   ========================================================== */

// // // // // //   main: {
// // // // // //     flex: 1,
// // // // // //     minWidth: 0,
// // // // // //     backgroundColor: "transparent",
// // // // // //   },

// // // // // //   mainDesktop: {
// // // // // //     overflow: "hidden",
// // // // // //   },

// // // // // //   /* ==========================================================
// // // // // //      HEADER
// // // // // //   ========================================================== */

// // // // // //   mobileHeader: {
// // // // // //     height: 76,
// // // // // //     paddingHorizontal: 17,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "space-between",
// // // // // //     backgroundColor: "transparent",
// // // // // //   },

// // // // // //   mobileHeaderLeft: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     flex: 1,
// // // // // //   },

// // // // // //   /*
// // // // // //    * THIS IS THE NEW BACK BUTTON
// // // // // //    * Same style as your 3rd image.
// // // // // //    */

// // // // // //   headerBackButton: {
// // // // // //     width: 42,
// // // // // //     height: 42,
// // // // // //     borderRadius: 21,
// // // // // //     backgroundColor: "#FFFFFF",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#E7DFD5",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginRight: 10,

// // // // // //     shadowColor: "#000000",
// // // // // //     shadowOffset: {
// // // // // //       width: 0,
// // // // // //       height: 2,
// // // // // //     },
// // // // // //     shadowOpacity: 0.06,
// // // // // //     shadowRadius: 5,
// // // // // //     elevation: 2,
// // // // // //   },

// // // // // //   mobileLogo: {
// // // // // //     width: 45,
// // // // // //     height: 45,
// // // // // //     borderRadius: 14,
// // // // // //     backgroundColor: "#172033",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     flexDirection: "row",
// // // // // //     marginRight: 10,
// // // // // //     transform: [{ rotate: "-5deg" }],
// // // // // //   },

// // // // // //   mobileBrandTitle: {
// // // // // //     color: "#172033",
// // // // // //     fontSize: 17,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   mobileBrandAccent: {
// // // // // //     color: "#FF6B5A",
// // // // // //   },

// // // // // //   mobileBrandSubtitle: {
// // // // // //     color: "#7B8491",
// // // // // //     fontSize: 9.5,
// // // // // //     marginTop: 2,
// // // // // //     fontWeight: "600",
// // // // // //   },

// // // // // //   mobileNotification: {
// // // // // //     width: 40,
// // // // // //     height: 40,
// // // // // //     borderRadius: 20,
// // // // // //     backgroundColor: "#FFFFFF",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#EDE5D9",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //   },

// // // // // //   desktopTopHeader: {
// // // // // //     height: 76,
// // // // // //     paddingHorizontal: 34,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "space-between",
// // // // // //   },

// // // // // //   desktopHeaderLeft: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //   },

// // // // // //   desktopWelcome: {
// // // // // //     color: "#172033",
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   desktopWelcomeSub: {
// // // // // //     color: "#9299A4",
// // // // // //     fontSize: 11,
// // // // // //     marginTop: 3,
// // // // // //   },

// // // // // //   desktopNotification: {
// // // // // //     width: 44,
// // // // // //     height: 44,
// // // // // //     borderRadius: 22,
// // // // // //     backgroundColor: "#FFFFFF",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#EDE5D9",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //   },

// // // // // //   /* ==========================================================
// // // // // //      SCROLL
// // // // // //   ========================================================== */

// // // // // //   scrollContent: {
// // // // // //     paddingHorizontal: 34,
// // // // // //     paddingTop: 15,
// // // // // //   },

// // // // // //   scrollContentTablet: {
// // // // // //     paddingHorizontal: 25,
// // // // // //   },

// // // // // //   scrollContentMobile: {
// // // // // //     paddingHorizontal: 17,
// // // // // //     paddingTop: 5,
// // // // // //   },

// // // // // //   /* ==========================================================
// // // // // //      HERO
// // // // // //   ========================================================== */

// // // // // //   heroSection: {
// // // // // //     marginTop: 7,
// // // // // //   },

// // // // // //   heroMobile: {
// // // // // //     marginTop: 5,
// // // // // //   },

// // // // // //   smallGreeting: {
// // // // // //     color: "#FF6B5A",
// // // // // //     fontSize: 11,
// // // // // //     fontWeight: "900",
// // // // // //     letterSpacing: 1.4,
// // // // // //     marginBottom: 6,
// // // // // //   },

// // // // // //   heroTitle: {
// // // // // //     color: "#172033",
// // // // // //     fontSize: 45,
// // // // // //     lineHeight: 48,
// // // // // //     fontWeight: "900",
// // // // // //     letterSpacing: -1.5,
// // // // // //   },

// // // // // //   heroTitleMobile: {
// // // // // //     fontSize: 37,
// // // // // //     lineHeight: 40,
// // // // // //     letterSpacing: -1,
// // // // // //   },

// // // // // //   heroAccent: {
// // // // // //     color: "#5146E5",
// // // // // //   },

// // // // // //   heroDescription: {
// // // // // //     color: "#7A8290",
// // // // // //     fontSize: 13.5,
// // // // // //     lineHeight: 20,
// // // // // //     marginTop: 10,
// // // // // //     maxWidth: 390,
// // // // // //   },

// // // // // //   heroDescriptionMobile: {
// // // // // //     fontSize: 12.5,
// // // // // //     lineHeight: 18,
// // // // // //     maxWidth: 310,
// // // // // //   },

// // // // // //   /* ==========================================================
// // // // // //      LETTERS
// // // // // //   ========================================================== */

// // // // // //   lettersContainer: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginTop: 24,
// // // // // //     marginBottom: 25,
// // // // // //     gap: 9,
// // // // // //   },

// // // // // //   lettersMobile: {
// // // // // //     marginTop: 21,
// // // // // //     marginBottom: 20,
// // // // // //   },

// // // // // //   letterTile: {
// // // // // //     width: 54,
// // // // // //     height: 54,
// // // // // //     borderRadius: 14,
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",

// // // // // //     shadowColor: "#000000",
// // // // // //     shadowOffset: {
// // // // // //       width: 0,
// // // // // //       height: 4,
// // // // // //     },
// // // // // //     shadowOpacity: 0.12,
// // // // // //     shadowRadius: 6,
// // // // // //     elevation: 3,
// // // // // //   },

// // // // // //   letterText: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 23,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   tileYellow: {
// // // // // //     backgroundColor: "#F4B942",
// // // // // //   },

// // // // // //   tileBlue: {
// // // // // //     backgroundColor: "#3B82F6",
// // // // // //   },

// // // // // //   tilePink: {
// // // // // //     backgroundColor: "#F15B6C",
// // // // // //   },

// // // // // //   tileGreen: {
// // // // // //     backgroundColor: "#26B67A",
// // // // // //   },

// // // // // //   tileRotateLeft: {
// // // // // //     transform: [{ rotate: "-6deg" }],
// // // // // //   },

// // // // // //   tileRotateRight: {
// // // // // //     transform: [{ rotate: "6deg" }],
// // // // // //   },

// // // // // //   /* ==========================================================
// // // // // //      PLAY CARD
// // // // // //   ========================================================== */

// // // // // //   playCard: {
// // // // // //     backgroundColor: "#FFFFFF",
// // // // // //     borderRadius: 22,
// // // // // //     padding: 17,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#EEE7DD",

// // // // // //     shadowColor: "#000000",
// // // // // //     shadowOffset: {
// // // // // //       width: 0,
// // // // // //       height: 6,
// // // // // //     },
// // // // // //     shadowOpacity: 0.07,
// // // // // //     shadowRadius: 14,
// // // // // //     elevation: 3,

// // // // // //     alignSelf: "stretch",
// // // // // //   },

// // // // // //   playCardMobile: {
// // // // // //     padding: 15,
// // // // // //     borderRadius: 19,
// // // // // //   },

// // // // // //   playCardTop: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     marginBottom: 16,
// // // // // //   },

// // // // // //   lightningCircle: {
// // // // // //     width: 43,
// // // // // //     height: 43,
// // // // // //     borderRadius: 14,
// // // // // //     backgroundColor: "#FF6B5A",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginRight: 12,
// // // // // //   },

// // // // // //   playInfo: {
// // // // // //     flex: 1,
// // // // // //     minWidth: 0,
// // // // // //   },

// // // // // //   playCardTitle: {
// // // // // //     color: "#172033",
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   playCardDescription: {
// // // // // //     color: "#8A909A",
// // // // // //     fontSize: 11.5,
// // // // // //     marginTop: 3,
// // // // // //   },

// // // // // //   playersBadge: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     gap: 4,
// // // // // //     backgroundColor: "#EEF1FF",
// // // // // //     paddingHorizontal: 9,
// // // // // //     paddingVertical: 6,
// // // // // //     borderRadius: 10,
// // // // // //   },

// // // // // //   playersBadgeText: {
// // // // // //     color: "#3949AB",
// // // // // //     fontSize: 10,
// // // // // //     fontWeight: "800",
// // // // // //   },

// // // // // //   playButton: {
// // // // // //     height: 53,
// // // // // //     width: 320,
// // // // // //     maxWidth: "100%",
// // // // // //     borderRadius: 15,
// // // // // //     backgroundColor: "#5146E5",
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     alignSelf: "center",
// // // // // //   },

// // // // // //   playButtonMobile: {
// // // // // //     width: 230,
// // // // // //     height: 49,
// // // // // //     borderRadius: 14,
// // // // // //   },

// // // // // //   playButtonText: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: "900",
// // // // // //     letterSpacing: 0.8,
// // // // // //   },

// // // // // //   playArrow: {
// // // // // //     width: 29,
// // // // // //     height: 29,
// // // // // //     borderRadius: 10,
// // // // // //     backgroundColor: "rgba(255,255,255,0.18)",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginLeft: 12,
// // // // // //   },

// // // // // //   guestButton: {
// // // // // //     marginTop: 10,
// // // // // //     height: 48,
// // // // // //     width: 320,
// // // // // //     maxWidth: "100%",
// // // // // //     borderRadius: 15,
// // // // // //     backgroundColor: "#FFEDEA",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#FFD9D1",
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     alignSelf: "center",
// // // // // //     gap: 8,
// // // // // //   },

// // // // // //   guestButtonMobile: {
// // // // // //     width: 230,
// // // // // //     height: 45,
// // // // // //     borderRadius: 14,
// // // // // //   },

// // // // // //   guestButtonText: {
// // // // // //     color: "#FF6B5A",
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: "900",
// // // // // //     letterSpacing: 0.8,
// // // // // //   },

// // // // // //   /* ==========================================================
// // // // // //      SECTIONS
// // // // // //   ========================================================== */

// // // // // //   sectionHeader: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "space-between",
// // // // // //     marginTop: 27,
// // // // // //     marginBottom: 13,
// // // // // //   },

// // // // // //   sectionTitle: {
// // // // // //     color: "#172033",
// // // // // //     fontSize: 17,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   sectionSubtitle: {
// // // // // //     color: "#9297A0",
// // // // // //     fontSize: 11,
// // // // // //     marginTop: 3,
// // // // // //   },

// // // // // //   /* ==========================================================
// // // // // //      ROOM CARDS
// // // // // //   ========================================================== */

// // // // // //   roomContainer: {
// // // // // //     flexDirection: "row",
// // // // // //     gap: 12,
// // // // // //   },

// // // // // //   roomContainerMobile: {
// // // // // //     flexDirection: "column",
// // // // // //   },

// // // // // //   createRoomCard: {
// // // // // //     flex: 1,
// // // // // //     minHeight: 157,
// // // // // //     borderRadius: 19,
// // // // // //     backgroundColor: "#FFF0EB",
// // // // // //     padding: 14,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#FFE0D8",
// // // // // //   },

// // // // // //   joinRoomCard: {
// // // // // //     flex: 1,
// // // // // //     minHeight: 157,
// // // // // //     borderRadius: 19,
// // // // // //     backgroundColor: "#EEF0FF",
// // // // // //     padding: 14,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#DDE1FF",
// // // // // //   },

// // // // // //   roomCardMobile: {
// // // // // //     width: "100%",
// // // // // //     flex: 0,
// // // // // //     minHeight: 145,
// // // // // //   },

// // // // // //   roomIconCreate: {
// // // // // //     width: 38,
// // // // // //     height: 38,
// // // // // //     borderRadius: 12,
// // // // // //     backgroundColor: "#FF6B5A",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginBottom: 10,
// // // // // //   },

// // // // // //   roomIconJoin: {
// // // // // //     width: 38,
// // // // // //     height: 38,
// // // // // //     borderRadius: 12,
// // // // // //     backgroundColor: "#5146E5",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginBottom: 10,
// // // // // //   },

// // // // // //   roomCardTitle: {
// // // // // //     color: "#172033",
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   roomCardText: {
// // // // // //     color: "#858B96",
// // // // // //     fontSize: 10.5,
// // // // // //     marginTop: 3,
// // // // // //   },

// // // // // //   roomArrow: {
// // // // // //     position: "absolute",
// // // // // //     right: 13,
// // // // // //     top: 17,
// // // // // //   },

// // // // // //   joinInputRow: {
// // // // // //     flexDirection: "row",
// // // // // //     marginTop: 10,
// // // // // //     alignItems: "center",
// // // // // //   },

// // // // // //   joinInput: {
// // // // // //     flex: 1,
// // // // // //     minWidth: 0,
// // // // // //     height: 36,
// // // // // //     backgroundColor: "#FFFFFF",
// // // // // //     borderRadius: 9,
// // // // // //     paddingHorizontal: 9,
// // // // // //     color: "#172033",
// // // // // //     fontSize: 10,
// // // // // //     fontWeight: "800",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#DDE1FF",
// // // // // //   },

// // // // // //   joinButton: {
// // // // // //     width: 36,
// // // // // //     height: 36,
// // // // // //     borderRadius: 9,
// // // // // //     backgroundColor: "#5146E5",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginLeft: 5,
// // // // // //   },

// // // // // //   /* ==========================================================
// // // // // //      CHALLENGE
// // // // // //   ========================================================== */

// // // // // //   challengeCard: {
// // // // // //     marginTop: 22,
// // // // // //     borderRadius: 18,
// // // // // //     backgroundColor: "#172033",
// // // // // //     padding: 15,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "space-between",
// // // // // //   },

// // // // // //   challengeCardMobile: {
// // // // // //     marginTop: 18,
// // // // // //     padding: 14,
// // // // // //   },

// // // // // //   challengeLeft: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     flex: 1,
// // // // // //     minWidth: 0,
// // // // // //   },

// // // // // //   challengeIcon: {
// // // // // //     width: 42,
// // // // // //     height: 42,
// // // // // //     borderRadius: 13,
// // // // // //     backgroundColor: "#F4B942",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginRight: 11,
// // // // // //   },

// // // // // //   challengeInfo: {
// // // // // //     flex: 1,
// // // // // //     minWidth: 0,
// // // // // //   },

// // // // // //   challengeTitle: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   challengeText: {
// // // // // //     color: "#AAB1C0",
// // // // // //     fontSize: 10.5,
// // // // // //     marginTop: 3,
// // // // // //   },

// // // // // //   challengeProgress: {
// // // // // //     alignItems: "flex-end",
// // // // // //     marginLeft: 10,
// // // // // //   },

// // // // // //   progressNumber: {
// // // // // //     color: "#FFD166",
// // // // // //     fontSize: 17,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   progressText: {
// // // // // //     color: "#8E97A9",
// // // // // //     fontSize: 9,
// // // // // //     marginTop: 1,
// // // // // //   },

// // // // // //   /* ==========================================================
// // // // // //      LEADERBOARD
// // // // // //   ========================================================== */

// // // // // //   leaderHeader: {
// // // // // //     marginTop: 27,
// // // // // //     marginBottom: 12,
// // // // // //     flexDirection: "row",
// // // // // //     justifyContent: "space-between",
// // // // // //     alignItems: "center",
// // // // // //   },

// // // // // //   viewAll: {
// // // // // //     color: "#5146E5",
// // // // // //     fontSize: 11,
// // // // // //     fontWeight: "800",
// // // // // //   },

// // // // // //   leaderboardCard: {
// // // // // //     backgroundColor: "#FFFFFF",
// // // // // //     borderRadius: 19,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#EEE7DD",
// // // // // //     paddingHorizontal: 13,
// // // // // //     overflow: "hidden",
// // // // // //   },

// // // // // //   playerRow: {
// // // // // //     minHeight: 64,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: "#F1EEE8",
// // // // // //   },

// // // // // //   lastPlayerRow: {
// // // // // //     borderBottomWidth: 0,
// // // // // //   },

// // // // // //   rankCircle: {
// // // // // //     width: 27,
// // // // // //     height: 27,
// // // // // //     borderRadius: 9,
// // // // // //     backgroundColor: "#F0F0F0",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginRight: 9,
// // // // // //   },

// // // // // //   rankFirst: {
// // // // // //     backgroundColor: "#FFF0B8",
// // // // // //   },

// // // // // //   rankSecond: {
// // // // // //     backgroundColor: "#E8E8E8",
// // // // // //   },

// // // // // //   rankThird: {
// // // // // //     backgroundColor: "#F5D6C7",
// // // // // //   },

// // // // // //   rankText: {
// // // // // //     color: "#59606C",
// // // // // //     fontSize: 11,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   playerAvatar: {
// // // // // //     width: 37,
// // // // // //     height: 37,
// // // // // //     borderRadius: 13,
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginRight: 10,
// // // // // //   },

// // // // // //   playerInfo: {
// // // // // //     flex: 1,
// // // // // //     minWidth: 0,
// // // // // //   },

// // // // // //   playerName: {
// // // // // //     color: "#202838",
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: "800",
// // // // // //   },

// // // // // //   topPlayerLabel: {
// // // // // //     color: "#FF6B5A",
// // // // // //     fontSize: 8,
// // // // // //     fontWeight: "900",
// // // // // //     marginTop: 2,
// // // // // //     letterSpacing: 0.6,
// // // // // //   },

// // // // // //   scoreContainer: {
// // // // // //     alignItems: "flex-end",
// // // // // //     marginLeft: 8,
// // // // // //   },

// // // // // //   scoreNumber: {
// // // // // //     color: "#172033",
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: "900",
// // // // // //   },

// // // // // //   scoreLabel: {
// // // // // //     color: "#9CA1AA",
// // // // // //     fontSize: 7,
// // // // // //     fontWeight: "800",
// // // // // //     marginTop: 1,
// // // // // //   },

// // // // // //   emptyLeaderboard: {
// // // // // //     height: 110,
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //   },

// // // // // //   emptyText: {
// // // // // //     color: "#9A9A9A",
// // // // // //     fontSize: 11,
// // // // // //     marginTop: 7,
// // // // // //   },

// // // // // //   /* ==========================================================
// // // // // //      BOTTOM NAV
// // // // // //   ========================================================== */

// // // // // //   bottomNav: {
// // // // // //     height: 70,
// // // // // //     backgroundColor: "#FFFFFF",
// // // // // //     borderTopWidth: 1,
// // // // // //     borderTopColor: "#EEE7DD",
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "space-around",
// // // // // //     paddingBottom: 4,
// // // // // //   },

// // // // // //   navItem: {
// // // // // //     flex: 1,
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //   },

// // // // // //   activeNavIcon: {
// // // // // //     width: 37,
// // // // // //     height: 32,
// // // // // //     borderRadius: 12,
// // // // // //     backgroundColor: "#5146E5",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //   },

// // // // // //   activeNavText: {
// // // // // //     color: "#5146E5",
// // // // // //     fontSize: 9.5,
// // // // // //     fontWeight: "900",
// // // // // //     marginTop: 3,
// // // // // //   },

// // // // // //   navText: {
// // // // // //     color: "#8C8C8C",
// // // // // //     fontSize: 9.5,
// // // // // //     fontWeight: "700",
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // // });
// // // // // import React, { useEffect, useRef } from "react";
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   StyleSheet,
// // // // //   TouchableOpacity,
// // // // //   ScrollView,
// // // // //   SafeAreaView,
// // // // //   StatusBar,
// // // // //   useWindowDimensions,
// // // // //   Animated,
// // // // //   Easing,
// // // // // } from "react-native";
// // // // // import { Ionicons } from "@expo/vector-icons";

// // // // // export interface TopPlayer {
// // // // //   rank: number;
// // // // //   name: string;
// // // // //   score: number;
// // // // //   avatarColor: string;
// // // // // }

// // // // // interface WordScrambleHomeScreenProps {
// // // // //   topPlayers: TopPlayer[];

// // // // //   onPlayOnline: () => void;
// // // // //   onViewAllPlayers: () => void;

// // // // //   // no longer used on this screen (kept optional so App.tsx still compiles)
// // // // //   onCreateRoom?: () => void;
// // // // //   onJoinRoom?: (code: string) => void;

// // // // //   onGuestPlay?: () => void;

// // // // //   /**
// // // // //    * Parent must pass this function.
// // // // //    * Navigates from Word Scramble Home back to the Cyber Mind main menu.
// // // // //    */
// // // // //   onBack: () => void;

// // // // //   onTabHome: () => void;
// // // // //   onTabLeaderboard: () => void;
// // // // //   onTabProfile: () => void;
// // // // // }

// // // // // /* ============================================================
// // // // //    COLORS
// // // // // ============================================================ */

// // // // // const BG = {
// // // // //   indigo: "#5146E5",
// // // // //   coral: "#FF6B5A",
// // // // //   yellow: "#F4B942",
// // // // //   blue: "#3B82F6",
// // // // //   green: "#26B67A",
// // // // // };

// // // // // /* ============================================================
// // // // //    BACKGROUND BLOB
// // // // // ============================================================ */

// // // // // const BgBlob: React.FC<{
// // // // //   color: string;
// // // // //   size: number;
// // // // //   left: number;
// // // // //   top: number;
// // // // //   driftX: number;
// // // // //   driftY: number;
// // // // //   duration: number;
// // // // //   opacity?: number;
// // // // // }> = ({
// // // // //   color,
// // // // //   size,
// // // // //   left,
// // // // //   top,
// // // // //   driftX,
// // // // //   driftY,
// // // // //   duration,
// // // // //   opacity = 0.1,
// // // // // }) => {
// // // // //   const anim = useRef(new Animated.Value(0)).current;

// // // // //   useEffect(() => {
// // // // //     const loop = Animated.loop(
// // // // //       Animated.sequence([
// // // // //         Animated.timing(anim, {
// // // // //           toValue: 1,
// // // // //           duration,
// // // // //           easing: Easing.inOut(Easing.sin),
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //         Animated.timing(anim, {
// // // // //           toValue: 0,
// // // // //           duration,
// // // // //           easing: Easing.inOut(Easing.sin),
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //       ])
// // // // //     );

// // // // //     loop.start();

// // // // //     return () => loop.stop();
// // // // //   }, [anim, duration]);

// // // // //   const translateX = anim.interpolate({
// // // // //     inputRange: [0, 1],
// // // // //     outputRange: [0, driftX],
// // // // //   });

// // // // //   const translateY = anim.interpolate({
// // // // //     inputRange: [0, 1],
// // // // //     outputRange: [0, driftY],
// // // // //   });

// // // // //   const scale = anim.interpolate({
// // // // //     inputRange: [0, 1],
// // // // //     outputRange: [1, 1.1],
// // // // //   });

// // // // //   return (
// // // // //     <Animated.View
// // // // //       pointerEvents="none"
// // // // //       style={{
// // // // //         position: "absolute",
// // // // //         left,
// // // // //         top,
// // // // //         width: size,
// // // // //         height: size,
// // // // //         borderRadius: size / 2,
// // // // //         backgroundColor: color,
// // // // //         opacity,
// // // // //         transform: [{ translateX }, { translateY }, { scale }],
// // // // //       }}
// // // // //     />
// // // // //   );
// // // // // };

// // // // // /* ============================================================
// // // // //    BACKGROUND LETTER
// // // // // ============================================================ */

// // // // // const BgLetter: React.FC<{
// // // // //   char: string;
// // // // //   color: string;
// // // // //   left: number;
// // // // //   top: number;
// // // // //   rotate: string;
// // // // //   duration?: number;
// // // // // }> = ({ char, color, left, top, rotate, duration = 2600 }) => {
// // // // //   const bob = useRef(new Animated.Value(0)).current;

// // // // //   useEffect(() => {
// // // // //     const loop = Animated.loop(
// // // // //       Animated.sequence([
// // // // //         Animated.timing(bob, {
// // // // //           toValue: 1,
// // // // //           duration,
// // // // //           easing: Easing.inOut(Easing.sin),
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //         Animated.timing(bob, {
// // // // //           toValue: 0,
// // // // //           duration,
// // // // //           easing: Easing.inOut(Easing.sin),
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //       ])
// // // // //     );

// // // // //     loop.start();

// // // // //     return () => loop.stop();
// // // // //   }, [bob, duration]);

// // // // //   const translateY = bob.interpolate({
// // // // //     inputRange: [0, 1],
// // // // //     outputRange: [0, -12],
// // // // //   });

// // // // //   return (
// // // // //     <Animated.View
// // // // //       pointerEvents="none"
// // // // //       style={{
// // // // //         position: "absolute",
// // // // //         left,
// // // // //         top,
// // // // //         width: 40,
// // // // //         height: 40,
// // // // //         borderRadius: 11,
// // // // //         backgroundColor: color,
// // // // //         alignItems: "center",
// // // // //         justifyContent: "center",
// // // // //         opacity: 0.1,
// // // // //         transform: [{ translateY }, { rotate }],
// // // // //       }}
// // // // //     >
// // // // //       <Text
// // // // //         style={{
// // // // //           color: "#FFFFFF",
// // // // //           fontSize: 17,
// // // // //           fontWeight: "900",
// // // // //         }}
// // // // //       >
// // // // //         {char}
// // // // //       </Text>
// // // // //     </Animated.View>
// // // // //   );
// // // // // };

// // // // // /* ============================================================
// // // // //    ANIMATED BACKGROUND
// // // // // ============================================================ */

// // // // // const AnimatedHomeBackground: React.FC<{
// // // // //   width: number;
// // // // //   height: number;
// // // // // }> = ({ width, height }) => {
// // // // //   return (
// // // // //     <View style={StyleSheet.absoluteFill} pointerEvents="none">
// // // // //       <BgBlob
// // // // //         color={BG.indigo}
// // // // //         size={300}
// // // // //         left={-80}
// // // // //         top={-60}
// // // // //         driftX={35}
// // // // //         driftY={25}
// // // // //         duration={5200}
// // // // //         opacity={0.09}
// // // // //       />

// // // // //       <BgBlob
// // // // //         color={BG.coral}
// // // // //         size={240}
// // // // //         left={width - 160}
// // // // //         top={40}
// // // // //         driftX={-25}
// // // // //         driftY={35}
// // // // //         duration={4600}
// // // // //         opacity={0.1}
// // // // //       />

// // // // //       <BgBlob
// // // // //         color={BG.yellow}
// // // // //         size={210}
// // // // //         left={width * 0.4}
// // // // //         top={height * 0.45}
// // // // //         driftX={30}
// // // // //         driftY={-20}
// // // // //         duration={6000}
// // // // //         opacity={0.08}
// // // // //       />

// // // // //       <BgBlob
// // // // //         color={BG.green}
// // // // //         size={220}
// // // // //         left={-70}
// // // // //         top={height * 0.6}
// // // // //         driftX={30}
// // // // //         driftY={-30}
// // // // //         duration={5400}
// // // // //         opacity={0.08}
// // // // //       />

// // // // //       <BgBlob
// // // // //         color={BG.blue}
// // // // //         size={180}
// // // // //         left={width - 120}
// // // // //         top={height * 0.75}
// // // // //         driftX={-25}
// // // // //         driftY={-20}
// // // // //         duration={4900}
// // // // //         opacity={0.09}
// // // // //       />

// // // // //       <BgLetter
// // // // //         char="W"
// // // // //         color={BG.yellow}
// // // // //         left={width * 0.08}
// // // // //         top={height * 0.15}
// // // // //         rotate="-8deg"
// // // // //       />

// // // // //       <BgLetter
// // // // //         char="O"
// // // // //         color={BG.blue}
// // // // //         left={width * 0.82}
// // // // //         top={height * 0.22}
// // // // //         rotate="7deg"
// // // // //       />

// // // // //       <BgLetter
// // // // //         char="R"
// // // // //         color={BG.coral}
// // // // //         left={width * 0.85}
// // // // //         top={height * 0.58}
// // // // //         rotate="-6deg"
// // // // //       />

// // // // //       <BgLetter
// // // // //         char="D"
// // // // //         color={BG.green}
// // // // //         left={width * 0.06}
// // // // //         top={height * 0.72}
// // // // //         rotate="5deg"
// // // // //       />
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // /* ============================================================
// // // // //    MAIN SCREEN
// // // // // ============================================================ */

// // // // // const WordScrambleHomeScreen: React.FC<WordScrambleHomeScreenProps> = ({
// // // // //   topPlayers,
// // // // //   onPlayOnline,
// // // // //   onViewAllPlayers,
// // // // //   onGuestPlay,
// // // // //   onBack,
// // // // //   onTabHome,
// // // // //   onTabLeaderboard,
// // // // //   onTabProfile,
// // // // // }) => {
// // // // //   const { width, height } = useWindowDimensions();

// // // // //   const isMobile = width < 768;
// // // // //   const isTablet = width >= 768 && width < 1100;

// // // // //   // Single Player -> guest nickname flow (falls back to online flow)
// // // // //   const handleSinglePlayer = () => {
// // // // //     if (onGuestPlay) {
// // // // //       onGuestPlay();
// // // // //     } else {
// // // // //       onPlayOnline();
// // // // //     }
// // // // //   };

// // // // //   // Multiplayer -> online flow
// // // // //   const handleMultiplayer = () => {
// // // // //     onPlayOnline();
// // // // //   };

// // // // //   return (
// // // // //     <SafeAreaView style={styles.safeArea}>
// // // // //       <StatusBar barStyle="dark-content" backgroundColor="#FFF9F0" />

// // // // //       <AnimatedHomeBackground width={width} height={height} />

// // // // //       <View style={styles.root}>
// // // // //         {/* ==================================================
// // // // //             SIDEBAR
// // // // //         ================================================== */}

// // // // //         {!isMobile && (
// // // // //           <View style={[styles.sidebar, isTablet && styles.sidebarTablet]}>
// // // // //             <View style={styles.sidebarBrand}>
// // // // //               <View style={styles.sidebarLogo}>
// // // // //                 <Text style={styles.logoW}>W</Text>
// // // // //                 <Text style={styles.logoS}>S</Text>
// // // // //               </View>

// // // // //               <View>
// // // // //                 <Text style={styles.sidebarBrandTitle}>
// // // // //                   Word
// // // // //                   <Text style={styles.sidebarBrandAccent}> Scramble</Text>
// // // // //                 </Text>

// // // // //                 <Text style={styles.sidebarBrandSubtitle}>
// // // // //                   Think fast. Play smart.
// // // // //                 </Text>
// // // // //               </View>
// // // // //             </View>

// // // // //             <View style={styles.sidebarNavigation}>
// // // // //               <TouchableOpacity
// // // // //                 style={[styles.sidebarNavItem, styles.sidebarNavActive]}
// // // // //                 onPress={onTabHome}
// // // // //                 activeOpacity={0.8}
// // // // //               >
// // // // //                 <View style={styles.sidebarActiveIcon}>
// // // // //                   <Ionicons name="home" size={21} color="#FFFFFF" />
// // // // //                 </View>

// // // // //                 <Text style={styles.sidebarActiveText}>Home</Text>
// // // // //               </TouchableOpacity>

// // // // //               <TouchableOpacity
// // // // //                 style={styles.sidebarNavItem}
// // // // //                 onPress={onTabLeaderboard}
// // // // //                 activeOpacity={0.8}
// // // // //               >
// // // // //                 <Ionicons name="trophy-outline" size={22} color="#657084" />

// // // // //                 <Text style={styles.sidebarText}>Rankings</Text>
// // // // //               </TouchableOpacity>

// // // // //               <TouchableOpacity
// // // // //                 style={styles.sidebarNavItem}
// // // // //                 onPress={onTabProfile}
// // // // //                 activeOpacity={0.8}
// // // // //               >
// // // // //                 <Ionicons name="person-outline" size={22} color="#657084" />

// // // // //                 <Text style={styles.sidebarText}>Profile</Text>
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.sidebarBottomCard}>
// // // // //               <View style={styles.sidebarBottomIcon}>
// // // // //                 <Ionicons name="sparkles" size={21} color="#FFFFFF" />
// // // // //               </View>

// // // // //               <Text style={styles.sidebarBottomTitle}>
// // // // //                 Ready for a challenge?
// // // // //               </Text>

// // // // //               <Text style={styles.sidebarBottomText}>
// // // // //                 Unscramble words and climb the rankings.
// // // // //               </Text>
// // // // //             </View>
// // // // //           </View>
// // // // //         )}

// // // // //         {/* ==================================================
// // // // //             MAIN
// // // // //         ================================================== */}

// // // // //         <View style={[styles.main, !isMobile && styles.mainDesktop]}>
// // // // //           {/* MOBILE HEADER */}

// // // // //           {isMobile && (
// // // // //             <View style={styles.mobileHeader}>
// // // // //               <View style={styles.mobileHeaderLeft}>
// // // // //                 <TouchableOpacity
// // // // //                   style={styles.headerBackButton}
// // // // //                   activeOpacity={0.75}
// // // // //                   onPress={onBack}
// // // // //                   accessibilityRole="button"
// // // // //                   accessibilityLabel="Go back"
// // // // //                 >
// // // // //                   <Ionicons name="arrow-back" size={22} color="#172033" />
// // // // //                 </TouchableOpacity>

// // // // //                 <View style={styles.mobileLogo}>
// // // // //                   <Text style={styles.logoW}>W</Text>
// // // // //                   <Text style={styles.logoS}>S</Text>
// // // // //                 </View>

// // // // //                 <View>
// // // // //                   <Text style={styles.mobileBrandTitle}>
// // // // //                     Word
// // // // //                     <Text style={styles.mobileBrandAccent}> Scramble</Text>
// // // // //                   </Text>

// // // // //                   <Text style={styles.mobileBrandSubtitle}>
// // // // //                     Think fast. Play smart.
// // // // //                   </Text>
// // // // //                 </View>
// // // // //               </View>

// // // // //               <TouchableOpacity
// // // // //                 style={styles.mobileNotification}
// // // // //                 activeOpacity={0.8}
// // // // //               >
// // // // //                 <Ionicons
// // // // //                   name="notifications-outline"
// // // // //                   size={20}
// // // // //                   color="#172033"
// // // // //                 />
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           )}

// // // // //           {/* DESKTOP HEADER */}

// // // // //           {!isMobile && (
// // // // //             <View style={styles.desktopTopHeader}>
// // // // //               <View style={styles.desktopHeaderLeft}>
// // // // //                 <TouchableOpacity
// // // // //                   style={styles.headerBackButton}
// // // // //                   activeOpacity={0.75}
// // // // //                   onPress={onBack}
// // // // //                   accessibilityRole="button"
// // // // //                   accessibilityLabel="Go back"
// // // // //                 >
// // // // //                   <Ionicons name="arrow-back" size={21} color="#172033" />
// // // // //                 </TouchableOpacity>

// // // // //                 <View>
// // // // //                   <Text style={styles.desktopWelcome}>Welcome back!</Text>

// // // // //                   <Text style={styles.desktopWelcomeSub}>Ready to play?</Text>
// // // // //                 </View>
// // // // //               </View>

// // // // //               <TouchableOpacity style={styles.desktopNotification}>
// // // // //                 <Ionicons
// // // // //                   name="notifications-outline"
// // // // //                   size={20}
// // // // //                   color="#172033"
// // // // //                 />
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           )}

// // // // //           {/* CONTENT */}

// // // // //           <ScrollView
// // // // //             showsVerticalScrollIndicator={false}
// // // // //             contentContainerStyle={[
// // // // //               styles.scrollContent,
// // // // //               isMobile && styles.scrollContentMobile,
// // // // //               isTablet && styles.scrollContentTablet,
// // // // //             ]}
// // // // //           >
// // // // //             {/* HERO */}

// // // // //             <View style={[styles.heroSection, isMobile && styles.heroMobile]}>
// // // // //               <Text style={styles.smallGreeting}>READY TO PLAY?</Text>

// // // // //               <Text
// // // // //                 style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}
// // // // //               >
// // // // //                 Unscramble.
// // // // //                 {"\n"}
// // // // //                 <Text style={styles.heroAccent}>Outsmart.</Text>
// // // // //               </Text>

// // // // //               <Text
// // // // //                 style={[
// // // // //                   styles.heroDescription,
// // // // //                   isMobile && styles.heroDescriptionMobile,
// // // // //                 ]}
// // // // //               >
// // // // //                 Arrange the letters, find the hidden word, and race against your
// // // // //                 friends.
// // // // //               </Text>
// // // // //             </View>

// // // // //             {/* LETTERS */}

// // // // //             <View
// // // // //               style={[
// // // // //                 styles.lettersContainer,
// // // // //                 isMobile && styles.lettersMobile,
// // // // //               ]}
// // // // //             >
// // // // //               <View
// // // // //                 style={[
// // // // //                   styles.letterTile,
// // // // //                   styles.tileYellow,
// // // // //                   styles.tileRotateLeft,
// // // // //                 ]}
// // // // //               >
// // // // //                 <Text style={styles.letterText}>W</Text>
// // // // //               </View>

// // // // //               <View
// // // // //                 style={[
// // // // //                   styles.letterTile,
// // // // //                   styles.tileBlue,
// // // // //                   styles.tileRotateRight,
// // // // //                 ]}
// // // // //               >
// // // // //                 <Text style={styles.letterText}>O</Text>
// // // // //               </View>

// // // // //               <View style={[styles.letterTile, styles.tilePink]}>
// // // // //                 <Text style={styles.letterText}>R</Text>
// // // // //               </View>

// // // // //               <View
// // // // //                 style={[
// // // // //                   styles.letterTile,
// // // // //                   styles.tileGreen,
// // // // //                   styles.tileRotateLeft,
// // // // //                 ]}
// // // // //               >
// // // // //                 <Text style={styles.letterText}>D</Text>
// // // // //               </View>
// // // // //             </View>

// // // // //             {/* CHOOSE YOUR MODE */}

// // // // //             <View
// // // // //               style={[styles.modeCard, isMobile && styles.modeCardMobile]}
// // // // //             >
// // // // //               <View style={styles.modeHeader}>
// // // // //                 <View style={styles.modeHeaderIcon}>
// // // // //                   <Ionicons name="game-controller" size={26} color="#FFFFFF" />
// // // // //                 </View>

// // // // //                 <View style={styles.modeHeaderInfo}>
// // // // //                   <Text style={styles.modeHeaderTitle}>Choose Your Mode</Text>

// // // // //                   <Text style={styles.modeHeaderText}>
// // // // //                     Play your way and enjoy the game!
// // // // //                   </Text>
// // // // //                 </View>
// // // // //               </View>

// // // // //               <View style={styles.modeRow}>
// // // // //                 {/* SINGLE PLAYER */}

// // // // //                 <View style={[styles.modeBox, styles.modeBoxSingle]}>
// // // // //                   <View style={styles.modeIconWrap}>
// // // // //                     <View style={[styles.modeIconCircle, styles.singleCircle]}>
// // // // //                       <Ionicons name="person" size={26} color="#FFFFFF" />
// // // // //                     </View>
// // // // //                   </View>

// // // // //                   <Text style={styles.modeTitle}>Single Player</Text>

// // // // //                   <Text style={styles.modeText}>
// // // // //                     Challenge yourself and improve your skills.
// // // // //                   </Text>

// // // // //                   <TouchableOpacity
// // // // //                     activeOpacity={0.88}
// // // // //                     onPress={handleSinglePlayer}
// // // // //                     style={[styles.modeButton, styles.singleButton]}
// // // // //                   >
// // // // //                     <Text style={styles.modeButtonText}>PLAY NOW</Text>

// // // // //                     <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
// // // // //                   </TouchableOpacity>
// // // // //                 </View>

// // // // //                 {/* MULTIPLAYER */}

// // // // //                 <View style={[styles.modeBox, styles.modeBoxMulti]}>
// // // // //                   <View style={styles.modeIconWrap}>
// // // // //                     <View style={styles.multiIcons}>
// // // // //                       <View
// // // // //                         style={[styles.multiPerson, styles.multiPersonBlue]}
// // // // //                       >
// // // // //                         <Ionicons name="person" size={18} color="#FFFFFF" />
// // // // //                       </View>

// // // // //                       <View
// // // // //                         style={[styles.multiPerson, styles.multiPersonRed]}
// // // // //                       >
// // // // //                         <Ionicons name="person" size={18} color="#FFFFFF" />
// // // // //                       </View>
// // // // //                     </View>
// // // // //                   </View>

// // // // //                   <Text style={styles.modeTitle}>Multiplayer</Text>

// // // // //                   <Text style={styles.modeText}>
// // // // //                     Play with your friends and compete together.
// // // // //                   </Text>

// // // // //                   <TouchableOpacity
// // // // //                     activeOpacity={0.88}
// // // // //                     onPress={handleMultiplayer}
// // // // //                     style={[styles.modeButton, styles.multiButton]}
// // // // //                   >
// // // // //                     <Text style={styles.modeButtonText}>PLAY NOW</Text>

// // // // //                     <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
// // // // //                   </TouchableOpacity>
// // // // //                 </View>
// // // // //               </View>
// // // // //             </View>

// // // // //             {/* DAILY CHALLENGE */}

// // // // //             <View
// // // // //               style={[
// // // // //                 styles.challengeCard,
// // // // //                 isMobile && styles.challengeCardMobile,
// // // // //               ]}
// // // // //             >
// // // // //               <View style={styles.challengeLeft}>
// // // // //                 <View style={styles.challengeIcon}>
// // // // //                   <Ionicons name="trophy" size={22} color="#FFFFFF" />
// // // // //                 </View>

// // // // //                 <View style={styles.challengeInfo}>
// // // // //                   <Text style={styles.challengeTitle}>Daily Challenge</Text>

// // // // //                   <Text style={styles.challengeText}>
// // // // //                     Solve today's puzzle
// // // // //                   </Text>
// // // // //                 </View>
// // // // //               </View>

// // // // //               <View style={styles.challengeProgress}>
// // // // //                 <Text style={styles.progressNumber}>3/5</Text>

// // // // //                 <Text style={styles.progressText}>rounds</Text>
// // // // //               </View>
// // // // //             </View>

// // // // //             {/* LEADERBOARD */}

// // // // //             <View style={styles.leaderHeader}>
// // // // //               <View>
// // // // //                 <Text style={styles.sectionTitle}>Top Players</Text>

// // // // //                 <Text style={styles.sectionSubtitle}>Today's leaderboard</Text>
// // // // //               </View>

// // // // //               <TouchableOpacity activeOpacity={0.7} onPress={onViewAllPlayers}>
// // // // //                 <Text style={styles.viewAll}>View all</Text>
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.leaderboardCard}>
// // // // //               {topPlayers.length === 0 ? (
// // // // //                 <View style={styles.emptyLeaderboard}>
// // // // //                   <Ionicons name="trophy-outline" size={28} color="#B0B0B0" />

// // // // //                   <Text style={styles.emptyText}>No players yet</Text>
// // // // //                 </View>
// // // // //               ) : (
// // // // //                 topPlayers.map((player, index) => (
// // // // //                   <View
// // // // //                     key={`${player.rank}-${player.name}`}
// // // // //                     style={[
// // // // //                       styles.playerRow,
// // // // //                       index === topPlayers.length - 1 && styles.lastPlayerRow,
// // // // //                     ]}
// // // // //                   >
// // // // //                     <View
// // // // //                       style={[
// // // // //                         styles.rankCircle,
// // // // //                         player.rank === 1 && styles.rankFirst,
// // // // //                         player.rank === 2 && styles.rankSecond,
// // // // //                         player.rank === 3 && styles.rankThird,
// // // // //                       ]}
// // // // //                     >
// // // // //                       <Text style={styles.rankText}>{player.rank}</Text>
// // // // //                     </View>

// // // // //                     <View
// // // // //                       style={[
// // // // //                         styles.playerAvatar,
// // // // //                         {
// // // // //                           backgroundColor: player.avatarColor || "#FF6B5A",
// // // // //                         },
// // // // //                       ]}
// // // // //                     >
// // // // //                       <Ionicons name="person" size={17} color="#FFFFFF" />
// // // // //                     </View>

// // // // //                     <View style={styles.playerInfo}>
// // // // //                       <Text style={styles.playerName}>{player.name}</Text>

// // // // //                       {player.rank === 1 && (
// // // // //                         <Text style={styles.topPlayerLabel}>TOP PLAYER</Text>
// // // // //                       )}
// // // // //                     </View>

// // // // //                     <View style={styles.scoreContainer}>
// // // // //                       <Text style={styles.scoreNumber}>{player.score}</Text>

// // // // //                       <Text style={styles.scoreLabel}>PTS</Text>
// // // // //                     </View>
// // // // //                   </View>
// // // // //                 ))
// // // // //               )}
// // // // //             </View>

// // // // //             <View style={{ height: isMobile ? 90 : 40 }} />
// // // // //           </ScrollView>

// // // // //           {/* MOBILE BOTTOM NAV */}

// // // // //           {isMobile && (
// // // // //             <View style={styles.bottomNav}>
// // // // //               <TouchableOpacity
// // // // //                 style={styles.navItem}
// // // // //                 activeOpacity={0.8}
// // // // //                 onPress={onTabHome}
// // // // //               >
// // // // //                 <View style={styles.activeNavIcon}>
// // // // //                   <Ionicons name="home" size={20} color="#FFFFFF" />
// // // // //                 </View>

// // // // //                 <Text style={styles.activeNavText}>Home</Text>
// // // // //               </TouchableOpacity>

// // // // //               <TouchableOpacity
// // // // //                 style={styles.navItem}
// // // // //                 activeOpacity={0.8}
// // // // //                 onPress={onTabLeaderboard}
// // // // //               >
// // // // //                 <Ionicons name="trophy-outline" size={21} color="#8C8C8C" />

// // // // //                 <Text style={styles.navText}>Rankings</Text>
// // // // //               </TouchableOpacity>

// // // // //               <TouchableOpacity
// // // // //                 style={styles.navItem}
// // // // //                 activeOpacity={0.8}
// // // // //                 onPress={onTabProfile}
// // // // //               >
// // // // //                 <Ionicons name="person-outline" size={21} color="#8C8C8C" />

// // // // //                 <Text style={styles.navText}>Profile</Text>
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           )}
// // // // //         </View>
// // // // //       </View>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // export default WordScrambleHomeScreen;

// // // // // /* ============================================================
// // // // //    STYLES
// // // // // ============================================================ */

// // // // // const styles = StyleSheet.create({
// // // // //   safeArea: {
// // // // //     flex: 1,
// // // // //     backgroundColor: "#FFF9F0",
// // // // //   },

// // // // //   root: {
// // // // //     flex: 1,
// // // // //     flexDirection: "row",
// // // // //     backgroundColor: "transparent",
// // // // //   },

// // // // //   /* SIDEBAR */

// // // // //   sidebar: {
// // // // //     width: 292,
// // // // //     backgroundColor: "rgba(255,253,249,0.97)",
// // // // //     borderRightWidth: 1,
// // // // //     borderRightColor: "#EDE5D9",
// // // // //     paddingHorizontal: 19,
// // // // //     paddingTop: 22,
// // // // //     paddingBottom: 18,
// // // // //     justifyContent: "space-between",
// // // // //   },

// // // // //   sidebarTablet: {
// // // // //     width: 245,
// // // // //   },

// // // // //   sidebarBrand: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //   },

// // // // //   sidebarLogo: {
// // // // //     width: 58,
// // // // //     height: 58,
// // // // //     borderRadius: 17,
// // // // //     backgroundColor: "#172033",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     flexDirection: "row",
// // // // //     marginRight: 11,
// // // // //     transform: [{ rotate: "-5deg" }],
// // // // //   },

// // // // //   logoW: {
// // // // //     color: "#FFD166",
// // // // //     fontSize: 21,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   logoS: {
// // // // //     color: "#FF6B5A",
// // // // //     fontSize: 21,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   sidebarBrandTitle: {
// // // // //     color: "#172033",
// // // // //     fontSize: 19,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   sidebarBrandAccent: {
// // // // //     color: "#FF6B5A",
// // // // //   },

// // // // //   sidebarBrandSubtitle: {
// // // // //     color: "#7B8491",
// // // // //     fontSize: 10.5,
// // // // //     fontWeight: "600",
// // // // //     marginTop: 2,
// // // // //   },

// // // // //   sidebarNavigation: {
// // // // //     marginTop: 50,
// // // // //     flex: 1,
// // // // //   },

// // // // //   sidebarNavItem: {
// // // // //     height: 58,
// // // // //     borderRadius: 15,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     paddingHorizontal: 15,
// // // // //     marginBottom: 7,
// // // // //   },

// // // // //   sidebarNavActive: {
// // // // //     backgroundColor: "#EEE9FF",
// // // // //   },

// // // // //   sidebarActiveIcon: {
// // // // //     width: 40,
// // // // //     height: 40,
// // // // //     borderRadius: 12,
// // // // //     backgroundColor: "#5146E5",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginRight: 11,
// // // // //   },

// // // // //   sidebarActiveText: {
// // // // //     color: "#5146E5",
// // // // //     fontSize: 15,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   sidebarText: {
// // // // //     color: "#596579",
// // // // //     fontSize: 15,
// // // // //     fontWeight: "700",
// // // // //     marginLeft: 16,
// // // // //   },

// // // // //   sidebarBottomCard: {
// // // // //     backgroundColor: "#172033",
// // // // //     borderRadius: 19,
// // // // //     padding: 17,
// // // // //     minHeight: 137,
// // // // //   },

// // // // //   sidebarBottomIcon: {
// // // // //     width: 43,
// // // // //     height: 43,
// // // // //     borderRadius: 13,
// // // // //     backgroundColor: "#FF6B5A",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginBottom: 11,
// // // // //   },

// // // // //   sidebarBottomTitle: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 13,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   sidebarBottomText: {
// // // // //     color: "#AEB7C7",
// // // // //     fontSize: 10.5,
// // // // //     lineHeight: 17,
// // // // //     marginTop: 5,
// // // // //   },

// // // // //   /* MAIN */

// // // // //   main: {
// // // // //     flex: 1,
// // // // //     minWidth: 0,
// // // // //     backgroundColor: "transparent",
// // // // //   },

// // // // //   mainDesktop: {
// // // // //     overflow: "hidden",
// // // // //   },

// // // // //   /* HEADER */

// // // // //   mobileHeader: {
// // // // //     height: 76,
// // // // //     paddingHorizontal: 17,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "space-between",
// // // // //     backgroundColor: "transparent",
// // // // //   },

// // // // //   mobileHeaderLeft: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     flex: 1,
// // // // //   },

// // // // //   headerBackButton: {
// // // // //     width: 42,
// // // // //     height: 42,
// // // // //     borderRadius: 21,
// // // // //     backgroundColor: "#FFFFFF",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#E7DFD5",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginRight: 10,

// // // // //     shadowColor: "#000000",
// // // // //     shadowOffset: {
// // // // //       width: 0,
// // // // //       height: 2,
// // // // //     },
// // // // //     shadowOpacity: 0.06,
// // // // //     shadowRadius: 5,
// // // // //     elevation: 2,
// // // // //   },

// // // // //   mobileLogo: {
// // // // //     width: 45,
// // // // //     height: 45,
// // // // //     borderRadius: 14,
// // // // //     backgroundColor: "#172033",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     flexDirection: "row",
// // // // //     marginRight: 10,
// // // // //     transform: [{ rotate: "-5deg" }],
// // // // //   },

// // // // //   mobileBrandTitle: {
// // // // //     color: "#172033",
// // // // //     fontSize: 17,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   mobileBrandAccent: {
// // // // //     color: "#FF6B5A",
// // // // //   },

// // // // //   mobileBrandSubtitle: {
// // // // //     color: "#7B8491",
// // // // //     fontSize: 9.5,
// // // // //     marginTop: 2,
// // // // //     fontWeight: "600",
// // // // //   },

// // // // //   mobileNotification: {
// // // // //     width: 40,
// // // // //     height: 40,
// // // // //     borderRadius: 20,
// // // // //     backgroundColor: "#FFFFFF",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#EDE5D9",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },

// // // // //   desktopTopHeader: {
// // // // //     height: 76,
// // // // //     paddingHorizontal: 34,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "space-between",
// // // // //   },

// // // // //   desktopHeaderLeft: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //   },

// // // // //   desktopWelcome: {
// // // // //     color: "#172033",
// // // // //     fontSize: 16,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   desktopWelcomeSub: {
// // // // //     color: "#9299A4",
// // // // //     fontSize: 11,
// // // // //     marginTop: 3,
// // // // //   },

// // // // //   desktopNotification: {
// // // // //     width: 44,
// // // // //     height: 44,
// // // // //     borderRadius: 22,
// // // // //     backgroundColor: "#FFFFFF",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#EDE5D9",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },

// // // // //   /* SCROLL */

// // // // //   scrollContent: {
// // // // //     paddingHorizontal: 34,
// // // // //     paddingTop: 15,
// // // // //   },

// // // // //   scrollContentTablet: {
// // // // //     paddingHorizontal: 25,
// // // // //   },

// // // // //   scrollContentMobile: {
// // // // //     paddingHorizontal: 17,
// // // // //     paddingTop: 5,
// // // // //   },

// // // // //   /* HERO */

// // // // //   heroSection: {
// // // // //     marginTop: 7,
// // // // //   },

// // // // //   heroMobile: {
// // // // //     marginTop: 5,
// // // // //   },

// // // // //   smallGreeting: {
// // // // //     color: "#FF6B5A",
// // // // //     fontSize: 11,
// // // // //     fontWeight: "900",
// // // // //     letterSpacing: 1.4,
// // // // //     marginBottom: 6,
// // // // //   },

// // // // //   heroTitle: {
// // // // //     color: "#172033",
// // // // //     fontSize: 45,
// // // // //     lineHeight: 48,
// // // // //     fontWeight: "900",
// // // // //     letterSpacing: -1.5,
// // // // //   },

// // // // //   heroTitleMobile: {
// // // // //     fontSize: 37,
// // // // //     lineHeight: 40,
// // // // //     letterSpacing: -1,
// // // // //   },

// // // // //   heroAccent: {
// // // // //     color: "#5146E5",
// // // // //   },

// // // // //   heroDescription: {
// // // // //     color: "#7A8290",
// // // // //     fontSize: 13.5,
// // // // //     lineHeight: 20,
// // // // //     marginTop: 10,
// // // // //     maxWidth: 390,
// // // // //   },

// // // // //   heroDescriptionMobile: {
// // // // //     fontSize: 12.5,
// // // // //     lineHeight: 18,
// // // // //     maxWidth: 310,
// // // // //   },

// // // // //   /* LETTERS */

// // // // //   lettersContainer: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginTop: 24,
// // // // //     marginBottom: 25,
// // // // //     gap: 9,
// // // // //   },

// // // // //   lettersMobile: {
// // // // //     marginTop: 21,
// // // // //     marginBottom: 20,
// // // // //   },

// // // // //   letterTile: {
// // // // //     width: 54,
// // // // //     height: 54,
// // // // //     borderRadius: 14,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",

// // // // //     shadowColor: "#000000",
// // // // //     shadowOffset: {
// // // // //       width: 0,
// // // // //       height: 4,
// // // // //     },
// // // // //     shadowOpacity: 0.12,
// // // // //     shadowRadius: 6,
// // // // //     elevation: 3,
// // // // //   },

// // // // //   letterText: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 23,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   tileYellow: {
// // // // //     backgroundColor: "#F4B942",
// // // // //   },

// // // // //   tileBlue: {
// // // // //     backgroundColor: "#3B82F6",
// // // // //   },

// // // // //   tilePink: {
// // // // //     backgroundColor: "#F15B6C",
// // // // //   },

// // // // //   tileGreen: {
// // // // //     backgroundColor: "#26B67A",
// // // // //   },

// // // // //   tileRotateLeft: {
// // // // //     transform: [{ rotate: "-6deg" }],
// // // // //   },

// // // // //   tileRotateRight: {
// // // // //     transform: [{ rotate: "6deg" }],
// // // // //   },

// // // // //   /* CHOOSE YOUR MODE */

// // // // //   modeCard: {
// // // // //     backgroundColor: "#FFFFFF",
// // // // //     borderRadius: 24,
// // // // //     padding: 14,
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#EEE7DD",
// // // // //     alignSelf: "stretch",

// // // // //     shadowColor: "#000000",
// // // // //     shadowOffset: {
// // // // //       width: 0,
// // // // //       height: 6,
// // // // //     },
// // // // //     shadowOpacity: 0.07,
// // // // //     shadowRadius: 14,
// // // // //     elevation: 3,
// // // // //   },

// // // // //   modeCardMobile: {
// // // // //     padding: 12,
// // // // //     borderRadius: 22,
// // // // //   },

// // // // //   modeHeader: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     marginBottom: 14,
// // // // //   },

// // // // //   modeHeaderIcon: {
// // // // //     width: 50,
// // // // //     height: 50,
// // // // //     borderRadius: 16,
// // // // //     backgroundColor: "#5146E5",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginRight: 12,
// // // // //   },

// // // // //   modeHeaderInfo: {
// // // // //     flex: 1,
// // // // //     minWidth: 0,
// // // // //   },

// // // // //   modeHeaderTitle: {
// // // // //     color: "#172033",
// // // // //     fontSize: 16,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   modeHeaderText: {
// // // // //     color: "#8A909A",
// // // // //     fontSize: 11.5,
// // // // //     marginTop: 3,
// // // // //   },

// // // // //   modeRow: {
// // // // //     flexDirection: "row",
// // // // //     gap: 10,
// // // // //   },

// // // // //   modeBox: {
// // // // //     flex: 1,
// // // // //     minWidth: 0,
// // // // //     borderRadius: 18,
// // // // //     padding: 10,
// // // // //     alignItems: "center",
// // // // //     borderWidth: 1,
// // // // //   },

// // // // //   modeBoxSingle: {
// // // // //     backgroundColor: "#EEEDFF",
// // // // //     borderColor: "#E0DEFF",
// // // // //   },

// // // // //   modeBoxMulti: {
// // // // //     backgroundColor: "#FFEFEA",
// // // // //     borderColor: "#FFDFD6",
// // // // //   },

// // // // //   modeIconWrap: {
// // // // //     height: 56,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginTop: 4,
// // // // //     marginBottom: 6,
// // // // //   },

// // // // //   modeIconCircle: {
// // // // //     width: 50,
// // // // //     height: 50,
// // // // //     borderRadius: 25,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },

// // // // //   singleCircle: {
// // // // //     backgroundColor: "#6D5BFF",
// // // // //   },

// // // // //   multiIcons: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 4,
// // // // //   },

// // // // //   multiPerson: {
// // // // //     width: 38,
// // // // //     height: 38,
// // // // //     borderRadius: 19,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },

// // // // //   multiPersonBlue: {
// // // // //     backgroundColor: "#5B54E8",
// // // // //   },

// // // // //   multiPersonRed: {
// // // // //     backgroundColor: "#F25C54",
// // // // //   },

// // // // //   modeTitle: {
// // // // //     color: "#172033",
// // // // //     fontSize: 15,
// // // // //     fontWeight: "900",
// // // // //     textAlign: "center",
// // // // //   },

// // // // //   modeText: {
// // // // //     color: "#7A8290",
// // // // //     fontSize: 11,
// // // // //     lineHeight: 16,
// // // // //     textAlign: "center",
// // // // //     marginTop: 5,
// // // // //     marginBottom: 12,
// // // // //     minHeight: 32,
// // // // //   },

// // // // //   modeButton: {
// // // // //     height: 42,
// // // // //     alignSelf: "stretch",
// // // // //     borderRadius: 21,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     gap: 6,
// // // // //   },

// // // // //   singleButton: {
// // // // //     backgroundColor: "#6358E8",
// // // // //   },

// // // // //   multiButton: {
// // // // //     backgroundColor: "#FF6B54",
// // // // //   },

// // // // //   modeButtonText: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 12,
// // // // //     fontWeight: "900",
// // // // //     letterSpacing: 0.6,
// // // // //   },

// // // // //   /* SECTIONS */

// // // // //   sectionTitle: {
// // // // //     color: "#172033",
// // // // //     fontSize: 17,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   sectionSubtitle: {
// // // // //     color: "#9297A0",
// // // // //     fontSize: 11,
// // // // //     marginTop: 3,
// // // // //   },

// // // // //   /* CHALLENGE */

// // // // //   challengeCard: {
// // // // //     marginTop: 22,
// // // // //     borderRadius: 18,
// // // // //     backgroundColor: "#172033",
// // // // //     padding: 15,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "space-between",
// // // // //   },

// // // // //   challengeCardMobile: {
// // // // //     marginTop: 18,
// // // // //     padding: 14,
// // // // //   },

// // // // //   challengeLeft: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     flex: 1,
// // // // //     minWidth: 0,
// // // // //   },

// // // // //   challengeIcon: {
// // // // //     width: 42,
// // // // //     height: 42,
// // // // //     borderRadius: 13,
// // // // //     backgroundColor: "#F4B942",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginRight: 11,
// // // // //   },

// // // // //   challengeInfo: {
// // // // //     flex: 1,
// // // // //     minWidth: 0,
// // // // //   },

// // // // //   challengeTitle: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 13,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   challengeText: {
// // // // //     color: "#AAB1C0",
// // // // //     fontSize: 10.5,
// // // // //     marginTop: 3,
// // // // //   },

// // // // //   challengeProgress: {
// // // // //     alignItems: "flex-end",
// // // // //     marginLeft: 10,
// // // // //   },

// // // // //   progressNumber: {
// // // // //     color: "#FFD166",
// // // // //     fontSize: 17,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   progressText: {
// // // // //     color: "#8E97A9",
// // // // //     fontSize: 9,
// // // // //     marginTop: 1,
// // // // //   },

// // // // //   /* LEADERBOARD */

// // // // //   leaderHeader: {
// // // // //     marginTop: 27,
// // // // //     marginBottom: 12,
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     alignItems: "center",
// // // // //   },

// // // // //   viewAll: {
// // // // //     color: "#5146E5",
// // // // //     fontSize: 11,
// // // // //     fontWeight: "800",
// // // // //   },

// // // // //   leaderboardCard: {
// // // // //     backgroundColor: "#FFFFFF",
// // // // //     borderRadius: 19,
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#EEE7DD",
// // // // //     paddingHorizontal: 13,
// // // // //     overflow: "hidden",
// // // // //   },

// // // // //   playerRow: {
// // // // //     minHeight: 64,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: "#F1EEE8",
// // // // //   },

// // // // //   lastPlayerRow: {
// // // // //     borderBottomWidth: 0,
// // // // //   },

// // // // //   rankCircle: {
// // // // //     width: 27,
// // // // //     height: 27,
// // // // //     borderRadius: 9,
// // // // //     backgroundColor: "#F0F0F0",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginRight: 9,
// // // // //   },

// // // // //   rankFirst: {
// // // // //     backgroundColor: "#FFF0B8",
// // // // //   },

// // // // //   rankSecond: {
// // // // //     backgroundColor: "#E8E8E8",
// // // // //   },

// // // // //   rankThird: {
// // // // //     backgroundColor: "#F5D6C7",
// // // // //   },

// // // // //   rankText: {
// // // // //     color: "#59606C",
// // // // //     fontSize: 11,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   playerAvatar: {
// // // // //     width: 37,
// // // // //     height: 37,
// // // // //     borderRadius: 13,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginRight: 10,
// // // // //   },

// // // // //   playerInfo: {
// // // // //     flex: 1,
// // // // //     minWidth: 0,
// // // // //   },

// // // // //   playerName: {
// // // // //     color: "#202838",
// // // // //     fontSize: 13,
// // // // //     fontWeight: "800",
// // // // //   },

// // // // //   topPlayerLabel: {
// // // // //     color: "#FF6B5A",
// // // // //     fontSize: 8,
// // // // //     fontWeight: "900",
// // // // //     marginTop: 2,
// // // // //     letterSpacing: 0.6,
// // // // //   },

// // // // //   scoreContainer: {
// // // // //     alignItems: "flex-end",
// // // // //     marginLeft: 8,
// // // // //   },

// // // // //   scoreNumber: {
// // // // //     color: "#172033",
// // // // //     fontSize: 14,
// // // // //     fontWeight: "900",
// // // // //   },

// // // // //   scoreLabel: {
// // // // //     color: "#9CA1AA",
// // // // //     fontSize: 7,
// // // // //     fontWeight: "800",
// // // // //     marginTop: 1,
// // // // //   },

// // // // //   emptyLeaderboard: {
// // // // //     height: 110,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },

// // // // //   emptyText: {
// // // // //     color: "#9A9A9A",
// // // // //     fontSize: 11,
// // // // //     marginTop: 7,
// // // // //   },

// // // // //   /* BOTTOM NAV */

// // // // //   bottomNav: {
// // // // //     height: 70,
// // // // //     backgroundColor: "#FFFFFF",
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: "#EEE7DD",
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "space-around",
// // // // //     paddingBottom: 4,
// // // // //   },

// // // // //   navItem: {
// // // // //     flex: 1,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },

// // // // //   activeNavIcon: {
// // // // //     width: 37,
// // // // //     height: 32,
// // // // //     borderRadius: 12,
// // // // //     backgroundColor: "#5146E5",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },

// // // // //   activeNavText: {
// // // // //     color: "#5146E5",
// // // // //     fontSize: 9.5,
// // // // //     fontWeight: "900",
// // // // //     marginTop: 3,
// // // // //   },

// // // // //   navText: {
// // // // //     color: "#8C8C8C",
// // // // //     fontSize: 9.5,
// // // // //     fontWeight: "700",
// // // // //     marginTop: 4,
// // // // //   },
// // // // // });
// // // // import React, { useEffect, useRef } from "react";
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   StyleSheet,
// // // //   TouchableOpacity,
// // // //   Pressable,
// // // //   ScrollView,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // //   useWindowDimensions,
// // // //   Animated,
// // // //   Easing,
// // // //   StyleProp,
// // // //   ViewStyle,
// // // // } from "react-native";
// // // // import { Ionicons } from "@expo/vector-icons";

// // // // export interface TopPlayer {
// // // //   rank: number;
// // // //   name: string;
// // // //   score: number;
// // // //   avatarColor: string;
// // // // }

// // // // interface WordScrambleHomeScreenProps {
// // // //   topPlayers: TopPlayer[];

// // // //   onPlayOnline: () => void;
// // // //   onViewAllPlayers: () => void;

// // // //   // no longer used on this screen (kept optional so App.tsx still compiles)
// // // //   onCreateRoom?: () => void;
// // // //   onJoinRoom?: (code: string) => void;

// // // //   onGuestPlay?: () => void;

// // // //   /**
// // // //    * Parent must pass this function.
// // // //    * Navigates from Word Scramble Home back to the Cyber Mind main menu.
// // // //    */
// // // //   onBack: () => void;

// // // //   onTabHome: () => void;
// // // //   onTabLeaderboard: () => void;
// // // //   onTabProfile: () => void;
// // // // }

// // // // /* ============================================================
// // // //    THEME  (mint paper + deep teal ink + tangerine, scrabble tiles)
// // // // ============================================================ */

// // // // const T = {
// // // //   bg: "#EAF8F2",
// // // //   bgDeep: "#D6F1E7",
// // // //   ink: "#0F3D3E",
// // // //   inkSoft: "#4F7476",
// // // //   inkFaint: "#8FB0AE",
// // // //   teal: "#14A38B",
// // // //   tealDark: "#0C7F6B",
// // // //   tealPale: "#D2F2E8",
// // // //   tangerine: "#FF8A3D",
// // // //   tangerineDark: "#DB6A1C",
// // // //   tangerinePale: "#FFE8D6",
// // // //   lemon: "#FFD84D",
// // // //   tile: "#FFF6DF",
// // // //   tileEdge: "#E2CD9C",
// // // //   card: "#FFFFFF",
// // // //   line: "#CBE8DE",
// // // //   white: "#FFFFFF",
// // // // };

// // // // /* ============================================================
// // // //    SMALL ANIMATION HELPERS
// // // // ============================================================ */

// // // // /** Endless idle motion: bob (up/down), pulse (scale) or sway (rotate). */
// // // // const Idle: React.FC<{
// // // //   children: React.ReactNode;
// // // //   style?: StyleProp<ViewStyle>;
// // // //   kind?: "bob" | "pulse" | "sway";
// // // //   duration?: number;
// // // //   delay?: number;
// // // //   amount?: number;
// // // // }> = ({ children, style, kind = "bob", duration = 1800, delay = 0, amount = 6 }) => {
// // // //   const v = useRef(new Animated.Value(0)).current;

// // // //   useEffect(() => {
// // // //     const loop = Animated.loop(
// // // //       Animated.sequence([
// // // //         Animated.timing(v, {
// // // //           toValue: 1,
// // // //           duration,
// // // //           delay,
// // // //           easing: Easing.inOut(Easing.quad),
// // // //           useNativeDriver: true,
// // // //         }),
// // // //         Animated.timing(v, {
// // // //           toValue: 0,
// // // //           duration,
// // // //           easing: Easing.inOut(Easing.quad),
// // // //           useNativeDriver: true,
// // // //         }),
// // // //       ])
// // // //     );
// // // //     loop.start();
// // // //     return () => loop.stop();
// // // //   }, [v, duration, delay]);

// // // //   let transform: any[] = [];
// // // //   if (kind === "bob") {
// // // //     transform = [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -amount] }) }];
// // // //   } else if (kind === "pulse") {
// // // //     transform = [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1 + amount / 50] }) }];
// // // //   } else {
// // // //     transform = [
// // // //       {
// // // //         rotate: v.interpolate({
// // // //           inputRange: [0, 1],
// // // //           outputRange: [`${-amount}deg`, `${amount}deg`],
// // // //         }),
// // // //       },
// // // //     ];
// // // //   }

// // // //   return <Animated.View style={[style, { transform }]}>{children}</Animated.View>;
// // // // };

// // // // /** Press feedback: squishes down then springs back. */
// // // // const PressScale: React.FC<{
// // // //   children: React.ReactNode;
// // // //   onPress?: () => void;
// // // //   style?: StyleProp<ViewStyle>;
// // // //   accessibilityLabel?: string;
// // // // }> = ({ children, onPress, style, accessibilityLabel }) => {
// // // //   const s = useRef(new Animated.Value(1)).current;

// // // //   return (
// // // //     <Animated.View style={[{ transform: [{ scale: s }] }, style]}>
// // // //       <Pressable
// // // //         onPress={onPress}
// // // //         accessibilityRole="button"
// // // //         accessibilityLabel={accessibilityLabel}
// // // //         onPressIn={() =>
// // // //           Animated.spring(s, { toValue: 0.94, friction: 8, tension: 220, useNativeDriver: true }).start()
// // // //         }
// // // //         onPressOut={() =>
// // // //           Animated.spring(s, { toValue: 1, friction: 3, tension: 140, useNativeDriver: true }).start()
// // // //         }
// // // //       >
// // // //         {children}
// // // //       </Pressable>
// // // //     </Animated.View>
// // // //   );
// // // // };

// // // // /** Bell that rings every few seconds. */
// // // // const BellRing: React.FC<{ size?: number }> = ({ size = 20 }) => {
// // // //   const r = useRef(new Animated.Value(0)).current;

// // // //   useEffect(() => {
// // // //     const loop = Animated.loop(
// // // //       Animated.sequence([
// // // //         Animated.delay(3200),
// // // //         Animated.timing(r, { toValue: 1, duration: 90, useNativeDriver: true }),
// // // //         Animated.timing(r, { toValue: -1, duration: 130, useNativeDriver: true }),
// // // //         Animated.timing(r, { toValue: 1, duration: 130, useNativeDriver: true }),
// // // //         Animated.timing(r, { toValue: -1, duration: 130, useNativeDriver: true }),
// // // //         Animated.timing(r, { toValue: 0, duration: 90, useNativeDriver: true }),
// // // //       ])
// // // //     );
// // // //     loop.start();
// // // //     return () => loop.stop();
// // // //   }, [r]);

// // // //   const rotate = r.interpolate({ inputRange: [-1, 1], outputRange: ["-16deg", "16deg"] });

// // // //   return (
// // // //     <Animated.View style={{ transform: [{ rotate }] }}>
// // // //       <Ionicons name="notifications-outline" size={size} color={T.ink} />
// // // //     </Animated.View>
// // // //   );
// // // // };

// // // // /* ============================================================
// // // //    BACKGROUND: letters slowly falling like tiles being dealt
// // // // ============================================================ */

// // // // const FallingLetter: React.FC<{
// // // //   char: string;
// // // //   left: number;
// // // //   height: number;
// // // //   duration: number;
// // // //   start: number; // 0..1 starting progress
// // // //   color: string;
// // // //   size?: number;
// // // // }> = ({ char, left, height, duration, start, color, size = 40 }) => {
// // // //   const v = useRef(new Animated.Value(start)).current;

// // // //   useEffect(() => {
// // // //     let alive = true;

// // // //     const run = (from: number) => {
// // // //       v.setValue(from);
// // // //       Animated.timing(v, {
// // // //         toValue: 1,
// // // //         duration: duration * (1 - from),
// // // //         easing: Easing.linear,
// // // //         useNativeDriver: true,
// // // //       }).start(({ finished }) => {
// // // //         if (finished && alive) run(0);
// // // //       });
// // // //     };

// // // //     run(start);

// // // //     return () => {
// // // //       alive = false;
// // // //       v.stopAnimation();
// // // //     };
// // // //   }, [v, duration, start]);

// // // //   const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [-70, height + 20] });
// // // //   const rotate = v.interpolate({ inputRange: [0, 1], outputRange: ["-14deg", "16deg"] });
// // // //   const opacity = v.interpolate({
// // // //     inputRange: [0, 0.12, 0.85, 1],
// // // //     outputRange: [0, 0.3, 0.3, 0],
// // // //   });

// // // //   return (
// // // //     <Animated.View
// // // //       pointerEvents="none"
// // // //       style={{
// // // //         position: "absolute",
// // // //         left,
// // // //         top: 0,
// // // //         width: size,
// // // //         height: size,
// // // //         borderRadius: 10,
// // // //         backgroundColor: T.tile,
// // // //         borderWidth: 1.5,
// // // //         borderColor: T.tileEdge,
// // // //         alignItems: "center",
// // // //         justifyContent: "center",
// // // //         opacity,
// // // //         transform: [{ translateY }, { rotate }],
// // // //       }}
// // // //     >
// // // //       <Text style={{ color, fontSize: size * 0.48, fontWeight: "900" }}>{char}</Text>
// // // //     </Animated.View>
// // // //   );
// // // // };

// // // // const FallingBackground: React.FC<{ width: number; height: number }> = ({ width, height }) => {
// // // //   const items = [
// // // //     { char: "S", left: 0.06, duration: 16000, start: 0.1, color: T.teal },
// // // //     { char: "C", left: 0.2, duration: 21000, start: 0.55, color: T.tangerine },
// // // //     { char: "R", left: 0.36, duration: 18000, start: 0.8, color: T.ink },
// // // //     { char: "A", left: 0.52, duration: 23000, start: 0.3, color: T.teal },
// // // //     { char: "M", left: 0.68, duration: 17000, start: 0.65, color: T.tangerine },
// // // //     { char: "B", left: 0.82, duration: 20000, start: 0.15, color: T.ink },
// // // //     { char: "L", left: 0.92, duration: 24000, start: 0.45, color: T.teal },
// // // //   ];

// // // //   return (
// // // //     <View style={StyleSheet.absoluteFill} pointerEvents="none">
// // // //       <View style={styles.bgBandTop} />
// // // //       <View style={styles.bgBandBottom} />
// // // //       {items.map((it) => (
// // // //         <FallingLetter
// // // //           key={it.char}
// // // //           char={it.char}
// // // //           left={Math.max(0, it.left * width - 20)}
// // // //           height={height}
// // // //           duration={it.duration}
// // // //           start={it.start}
// // // //           color={it.color}
// // // //         />
// // // //       ))}
// // // //     </View>
// // // //   );
// // // // };

// // // // /* ============================================================
// // // //    HERO: tiles that shuffle themselves, then snap into WORD
// // // // ============================================================ */

// // // // const HERO_TILES = [
// // // //   { char: "W", pts: 4, color: T.teal },
// // // //   { char: "O", pts: 1, color: T.tangerine },
// // // //   { char: "R", pts: 1, color: T.ink },
// // // //   { char: "D", pts: 2, color: T.teal },
// // // // ];
// // // // // slot index each tile (W,O,R,D) sits in, per step. First = solved.
// // // // const HERO_ORDERS = [
// // // //   [0, 1, 2, 3],
// // // //   [2, 0, 3, 1],
// // // //   [1, 3, 0, 2],
// // // //   [3, 2, 1, 0],
// // // //   [2, 3, 1, 0],
// // // // ];
// // // // const TILE = 56;
// // // // const TILE_GAP = 10;
// // // // const STRIDE = TILE + TILE_GAP;

// // // // const ScrambleTiles: React.FC = () => {
// // // //   const xs = useRef(HERO_TILES.map((_, i) => new Animated.Value(i * STRIDE))).current;
// // // //   const pop = useRef(new Animated.Value(0)).current;
// // // //   const hop = useRef(HERO_TILES.map(() => new Animated.Value(0))).current;

// // // //   useEffect(() => {
// // // //     let alive = true;
// // // //     let timer: ReturnType<typeof setTimeout>;
// // // //     let step = 0;

// // // //     const apply = (order: number[]) => {
// // // //       Animated.stagger(
// // // //         70,
// // // //         xs.map((x, i) =>
// // // //           Animated.parallel([
// // // //             Animated.spring(x, {
// // // //               toValue: order[i] * STRIDE,
// // // //               friction: 6,
// // // //               tension: 90,
// // // //               useNativeDriver: true,
// // // //             }),
// // // //             Animated.sequence([
// // // //               Animated.timing(hop[i], { toValue: 1, duration: 140, useNativeDriver: true }),
// // // //               Animated.timing(hop[i], { toValue: 0, duration: 220, useNativeDriver: true }),
// // // //             ]),
// // // //           ])
// // // //         )
// // // //       ).start();
// // // //     };

// // // //     const tick = () => {
// // // //       if (!alive) return;
// // // //       step = (step + 1) % HERO_ORDERS.length;
// // // //       apply(HERO_ORDERS[step]);

// // // //       if (step === 0) {
// // // //         // solved: celebrate, then hold
// // // //         timer = setTimeout(() => {
// // // //           Animated.sequence([
// // // //             Animated.timing(pop, { toValue: 1, duration: 160, useNativeDriver: true }),
// // // //             Animated.spring(pop, { toValue: 0, friction: 3, tension: 120, useNativeDriver: true }),
// // // //           ]).start();
// // // //         }, 520);
// // // //         timer = setTimeout(tick, 3000);
// // // //       } else {
// // // //         timer = setTimeout(tick, step === 1 ? 900 : 750);
// // // //       }
// // // //     };

// // // //     timer = setTimeout(tick, 1600);

// // // //     return () => {
// // // //       alive = false;
// // // //       clearTimeout(timer);
// // // //     };
// // // //   }, [xs, hop, pop]);

// // // //   const popScale = pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });

// // // //   return (
// // // //     <View style={styles.scrambleBox}>
// // // //       {HERO_TILES.map((t, i) => {
// // // //         const lift = hop[i].interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
// // // //         return (
// // // //           <Animated.View
// // // //             key={t.char}
// // // //             style={[
// // // //               styles.heroTile,
// // // //               { transform: [{ translateX: xs[i] }, { translateY: lift }, { scale: popScale }] },
// // // //             ]}
// // // //           >
// // // //             <Text style={[styles.heroTileChar, { color: t.color }]}>{t.char}</Text>
// // // //             <Text style={styles.heroTilePts}>{t.pts}</Text>
// // // //           </Animated.View>
// // // //         );
// // // //       })}
// // // //     </View>
// // // //   );
// // // // };

// // // // /* ============================================================
// // // //    LEADERBOARD ROW (slides in)
// // // // ============================================================ */

// // // // const PlayerRow: React.FC<{ player: TopPlayer; index: number; last: boolean }> = ({
// // // //   player,
// // // //   index,
// // // //   last,
// // // // }) => {
// // // //   const v = useRef(new Animated.Value(0)).current;

// // // //   useEffect(() => {
// // // //     Animated.timing(v, {
// // // //       toValue: 1,
// // // //       duration: 480,
// // // //       delay: 900 + index * 130,
// // // //       easing: Easing.out(Easing.cubic),
// // // //       useNativeDriver: true,
// // // //     }).start();
// // // //   }, [v, index]);

// // // //   return (
// // // //     <Animated.View
// // // //       style={[
// // // //         styles.playerRow,
// // // //         last && styles.lastPlayerRow,
// // // //         {
// // // //           opacity: v,
// // // //           transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [46, 0] }) }],
// // // //         },
// // // //       ]}
// // // //     >
// // // //       <View
// // // //         style={[
// // // //           styles.rankCircle,
// // // //           player.rank === 1 && styles.rankFirst,
// // // //           player.rank === 2 && styles.rankSecond,
// // // //           player.rank === 3 && styles.rankThird,
// // // //         ]}
// // // //       >
// // // //         <Text style={styles.rankText}>{player.rank}</Text>
// // // //       </View>

// // // //       <View style={[styles.playerAvatar, { backgroundColor: player.avatarColor || T.teal }]}>
// // // //         <Ionicons name="person" size={17} color="#FFFFFF" />
// // // //       </View>

// // // //       <View style={styles.playerInfo}>
// // // //         <Text style={styles.playerName}>{player.name}</Text>
// // // //         {player.rank === 1 && <Text style={styles.topPlayerLabel}>Top player</Text>}
// // // //       </View>

// // // //       <View style={styles.scoreContainer}>
// // // //         <Text style={styles.scoreNumber}>{player.score}</Text>
// // // //         <Text style={styles.scoreLabel}>pts</Text>
// // // //       </View>
// // // //     </Animated.View>
// // // //   );
// // // // };

// // // // /* ============================================================
// // // //    MAIN SCREEN
// // // // ============================================================ */

// // // // const WordScrambleHomeScreen: React.FC<WordScrambleHomeScreenProps> = ({
// // // //   topPlayers,
// // // //   onPlayOnline,
// // // //   onViewAllPlayers,
// // // //   onGuestPlay,
// // // //   onBack,
// // // //   onTabHome,
// // // //   onTabLeaderboard,
// // // //   onTabProfile,
// // // // }) => {
// // // //   const { width, height } = useWindowDimensions();

// // // //   const isMobile = width < 768;
// // // //   const isTablet = width >= 768 && width < 1100;

// // // //   // staggered entrance for the 5 content blocks
// // // //   const enters = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
// // // //   const progress = useRef(new Animated.Value(0)).current;

// // // //   useEffect(() => {
// // // //     Animated.stagger(
// // // //       120,
// // // //       enters.map((e) =>
// // // //         Animated.timing(e, {
// // // //           toValue: 1,
// // // //           duration: 520,
// // // //           easing: Easing.out(Easing.cubic),
// // // //           useNativeDriver: true,
// // // //         })
// // // //       )
// // // //     ).start();

// // // //     Animated.timing(progress, {
// // // //       toValue: 0.6, // 3 / 5 rounds
// // // //       duration: 1100,
// // // //       delay: 900,
// // // //       easing: Easing.out(Easing.cubic),
// // // //       useNativeDriver: false,
// // // //     }).start();
// // // //   }, [enters, progress]);

// // // //   const rise = (i: number) => ({
// // // //     opacity: enters[i],
// // // //     transform: [
// // // //       { translateY: enters[i].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
// // // //     ],
// // // //   });

// // // //   // Single Player -> guest nickname flow (falls back to online flow)
// // // //   const handleSinglePlayer = () => {
// // // //     if (onGuestPlay) {
// // // //       onGuestPlay();
// // // //     } else {
// // // //       onPlayOnline();
// // // //     }
// // // //   };

// // // //   // Multiplayer -> online flow
// // // //   const handleMultiplayer = () => {
// // // //     onPlayOnline();
// // // //   };

// // // //   const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

// // // //   return (
// // // //     <SafeAreaView style={styles.safeArea}>
// // // //       <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

// // // //       <FallingBackground width={width} height={height} />

// // // //       <View style={styles.root}>
// // // //         {/* ==================================================
// // // //             SIDEBAR
// // // //         ================================================== */}

// // // //         {!isMobile && (
// // // //           <View style={[styles.sidebar, isTablet && styles.sidebarTablet]}>
// // // //             <View style={styles.sidebarBrand}>
// // // //               <View style={styles.sidebarLogo}>
// // // //                 <Text style={styles.logoW}>W</Text>
// // // //                 <Text style={styles.logoS}>S</Text>
// // // //               </View>

// // // //               <View>
// // // //                 <Text style={styles.sidebarBrandTitle}>
// // // //                   Word
// // // //                   <Text style={styles.sidebarBrandAccent}> Scramble</Text>
// // // //                 </Text>
// // // //                 <Text style={styles.sidebarBrandSubtitle}>Think fast. Play smart.</Text>
// // // //               </View>
// // // //             </View>

// // // //             <View style={styles.sidebarNavigation}>
// // // //               <TouchableOpacity
// // // //                 style={[styles.sidebarNavItem, styles.sidebarNavActive]}
// // // //                 onPress={onTabHome}
// // // //                 activeOpacity={0.8}
// // // //               >
// // // //                 <View style={styles.sidebarActiveIcon}>
// // // //                   <Ionicons name="home" size={21} color="#FFFFFF" />
// // // //                 </View>
// // // //                 <Text style={styles.sidebarActiveText}>Home</Text>
// // // //               </TouchableOpacity>

// // // //               <TouchableOpacity style={styles.sidebarNavItem} onPress={onTabLeaderboard} activeOpacity={0.8}>
// // // //                 <Ionicons name="trophy-outline" size={22} color={T.inkSoft} />
// // // //                 <Text style={styles.sidebarText}>Rankings</Text>
// // // //               </TouchableOpacity>

// // // //               <TouchableOpacity style={styles.sidebarNavItem} onPress={onTabProfile} activeOpacity={0.8}>
// // // //                 <Ionicons name="person-outline" size={22} color={T.inkSoft} />
// // // //                 <Text style={styles.sidebarText}>Profile</Text>
// // // //               </TouchableOpacity>
// // // //             </View>

// // // //             <View style={styles.sidebarBottomCard}>
// // // //               <Idle kind="sway" amount={8} duration={1400} style={styles.sidebarBottomIcon}>
// // // //                 <Ionicons name="sparkles" size={21} color="#FFFFFF" />
// // // //               </Idle>
// // // //               <Text style={styles.sidebarBottomTitle}>Ready for a challenge?</Text>
// // // //               <Text style={styles.sidebarBottomText}>
// // // //                 Unscramble words and climb the rankings.
// // // //               </Text>
// // // //             </View>
// // // //           </View>
// // // //         )}

// // // //         {/* ==================================================
// // // //             MAIN
// // // //         ================================================== */}

// // // //         <View style={[styles.main, !isMobile && styles.mainDesktop]}>
// // // //           {/* MOBILE HEADER */}

// // // //           {isMobile && (
// // // //             <View style={styles.mobileHeader}>
// // // //               <View style={styles.mobileHeaderLeft}>
// // // //                 <TouchableOpacity
// // // //                   style={styles.headerBackButton}
// // // //                   activeOpacity={0.75}
// // // //                   onPress={onBack}
// // // //                   accessibilityRole="button"
// // // //                   accessibilityLabel="Go back"
// // // //                 >
// // // //                   <Ionicons name="arrow-back" size={22} color={T.ink} />
// // // //                 </TouchableOpacity>

// // // //                 <View style={styles.mobileLogo}>
// // // //                   <Text style={styles.logoW}>W</Text>
// // // //                   <Text style={styles.logoS}>S</Text>
// // // //                 </View>

// // // //                 <View>
// // // //                   <Text style={styles.mobileBrandTitle}>
// // // //                     Word
// // // //                     <Text style={styles.mobileBrandAccent}> Scramble</Text>
// // // //                   </Text>
// // // //                   <Text style={styles.mobileBrandSubtitle}>Think fast. Play smart.</Text>
// // // //                 </View>
// // // //               </View>

// // // //               <TouchableOpacity style={styles.mobileNotification} activeOpacity={0.8}>
// // // //                 <BellRing />
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           )}

// // // //           {/* DESKTOP HEADER */}

// // // //           {!isMobile && (
// // // //             <View style={styles.desktopTopHeader}>
// // // //               <View style={styles.desktopHeaderLeft}>
// // // //                 <TouchableOpacity
// // // //                   style={styles.headerBackButton}
// // // //                   activeOpacity={0.75}
// // // //                   onPress={onBack}
// // // //                   accessibilityRole="button"
// // // //                   accessibilityLabel="Go back"
// // // //                 >
// // // //                   <Ionicons name="arrow-back" size={21} color={T.ink} />
// // // //                 </TouchableOpacity>

// // // //                 <View>
// // // //                   <Text style={styles.desktopWelcome}>Welcome back!</Text>
// // // //                   <Text style={styles.desktopWelcomeSub}>Ready to play?</Text>
// // // //                 </View>
// // // //               </View>

// // // //               <TouchableOpacity style={styles.desktopNotification}>
// // // //                 <BellRing />
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           )}

// // // //           {/* CONTENT */}

// // // //           <ScrollView
// // // //             showsVerticalScrollIndicator={false}
// // // //             contentContainerStyle={[
// // // //               styles.scrollContent,
// // // //               isMobile && styles.scrollContentMobile,
// // // //               isTablet && styles.scrollContentTablet,
// // // //             ]}
// // // //           >
// // // //             {/* HERO */}

// // // //             <Animated.View style={[styles.heroSection, isMobile && styles.heroMobile, rise(0)]}>
// // // //               <View style={styles.heroPill}>
// // // //                 <Ionicons name="flash" size={12} color={T.tangerineDark} />
// // // //                 <Text style={styles.smallGreeting}>Ready to play?</Text>
// // // //               </View>

// // // //               <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
// // // //                 Unscramble.
// // // //                 {"\n"}
// // // //                 <Text style={styles.heroAccent}>Outsmart.</Text>
// // // //               </Text>

// // // //               <Text style={[styles.heroDescription, isMobile && styles.heroDescriptionMobile]}>
// // // //                 Arrange the letters, find the hidden word, and race against your friends.
// // // //               </Text>
// // // //             </Animated.View>

// // // //             {/* SHUFFLING TILES */}

// // // //             <Animated.View style={[styles.lettersContainer, isMobile && styles.lettersMobile, rise(1)]}>
// // // //               <ScrambleTiles />
// // // //             </Animated.View>

// // // //             {/* CHOOSE YOUR MODE */}

// // // //             <Animated.View style={[styles.modeCard, isMobile && styles.modeCardMobile, rise(2)]}>
// // // //               <View style={styles.modeHeader}>
// // // //                 <View style={styles.modeHeaderIcon}>
// // // //                   <Ionicons name="game-controller" size={26} color="#FFFFFF" />
// // // //                 </View>

// // // //                 <View style={styles.modeHeaderInfo}>
// // // //                   <Text style={styles.modeHeaderTitle}>Choose your mode</Text>
// // // //                   <Text style={styles.modeHeaderText}>Play your way and enjoy the game!</Text>
// // // //                 </View>
// // // //               </View>

// // // //               <View style={styles.modeRow}>
// // // //                 {/* SINGLE PLAYER */}

// // // //                 <View style={[styles.modeBox, styles.modeBoxSingle]}>
// // // //                   <View style={styles.modeIconWrap}>
// // // //                     <Idle kind="pulse" amount={7} duration={1200}>
// // // //                       <View style={[styles.modeIconCircle, styles.singleCircle]}>
// // // //                         <Ionicons name="person" size={26} color="#FFFFFF" />
// // // //                       </View>
// // // //                     </Idle>
// // // //                   </View>

// // // //                   <Text style={styles.modeTitle}>Single Player</Text>
// // // //                   <Text style={styles.modeText}>Challenge yourself and improve your skills.</Text>

// // // //                   <PressScale
// // // //                     onPress={handleSinglePlayer}
// // // //                     style={styles.modeButtonWrap}
// // // //                     accessibilityLabel="Play single player"
// // // //                   >
// // // //                     <View style={[styles.modeButton, styles.singleButton]}>
// // // //                       <Text style={styles.modeButtonText}>Play now</Text>
// // // //                       <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
// // // //                     </View>
// // // //                   </PressScale>
// // // //                 </View>

// // // //                 {/* MULTIPLAYER */}

// // // //                 <View style={[styles.modeBox, styles.modeBoxMulti]}>
// // // //                   <View style={styles.modeIconWrap}>
// // // //                     <View style={styles.multiIcons}>
// // // //                       <Idle kind="bob" amount={5} duration={900}>
// // // //                         <View style={[styles.multiPerson, styles.multiPersonTeal]}>
// // // //                           <Ionicons name="person" size={18} color="#FFFFFF" />
// // // //                         </View>
// // // //                       </Idle>
// // // //                       <Idle kind="bob" amount={5} duration={900} delay={450}>
// // // //                         <View style={[styles.multiPerson, styles.multiPersonOrange]}>
// // // //                           <Ionicons name="person" size={18} color="#FFFFFF" />
// // // //                         </View>
// // // //                       </Idle>
// // // //                     </View>
// // // //                   </View>

// // // //                   <Text style={styles.modeTitle}>Multiplayer</Text>
// // // //                   <Text style={styles.modeText}>Play with your friends and compete together.</Text>

// // // //                   <PressScale
// // // //                     onPress={handleMultiplayer}
// // // //                     style={styles.modeButtonWrap}
// // // //                     accessibilityLabel="Play multiplayer"
// // // //                   >
// // // //                     <View style={[styles.modeButton, styles.multiButton]}>
// // // //                       <Text style={styles.modeButtonText}>Play now</Text>
// // // //                       <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
// // // //                     </View>
// // // //                   </PressScale>
// // // //                 </View>
// // // //               </View>
// // // //             </Animated.View>

// // // //             {/* DAILY CHALLENGE */}

// // // //             <Animated.View style={[styles.challengeCard, isMobile && styles.challengeCardMobile, rise(3)]}>
// // // //               <View style={styles.challengeTop}>
// // // //                 <View style={styles.challengeLeft}>
// // // //                   <Idle kind="sway" amount={9} duration={1300} style={styles.challengeIcon}>
// // // //                     <Ionicons name="trophy" size={22} color={T.ink} />
// // // //                   </Idle>

// // // //                   <View style={styles.challengeInfo}>
// // // //                     <Text style={styles.challengeTitle}>Daily challenge</Text>
// // // //                     <Text style={styles.challengeText}>Solve today's puzzle</Text>
// // // //                   </View>
// // // //                 </View>

// // // //                 <View style={styles.challengeProgress}>
// // // //                   <Text style={styles.progressNumber}>3/5</Text>
// // // //                   <Text style={styles.progressText}>rounds</Text>
// // // //                 </View>
// // // //               </View>

// // // //               <View style={styles.progressTrack}>
// // // //                 <Animated.View style={[styles.progressFill, { width: barWidth }]} />
// // // //               </View>
// // // //             </Animated.View>

// // // //             {/* LEADERBOARD */}

// // // //             <Animated.View style={[styles.leaderHeader, rise(4)]}>
// // // //               <View>
// // // //                 <Text style={styles.sectionTitle}>Top players</Text>
// // // //                 <Text style={styles.sectionSubtitle}>Today's leaderboard</Text>
// // // //               </View>

// // // //               <TouchableOpacity activeOpacity={0.7} onPress={onViewAllPlayers}>
// // // //                 <Text style={styles.viewAll}>View all</Text>
// // // //               </TouchableOpacity>
// // // //             </Animated.View>

// // // //             <Animated.View style={[styles.leaderboardCard, rise(4)]}>
// // // //               {topPlayers.length === 0 ? (
// // // //                 <View style={styles.emptyLeaderboard}>
// // // //                   <Idle kind="bob" amount={6} duration={1100}>
// // // //                     <Ionicons name="trophy-outline" size={28} color={T.inkFaint} />
// // // //                   </Idle>
// // // //                   <Text style={styles.emptyText}>No players yet</Text>
// // // //                 </View>
// // // //               ) : (
// // // //                 topPlayers.map((player, index) => (
// // // //                   <PlayerRow
// // // //                     key={`${player.rank}-${player.name}`}
// // // //                     player={player}
// // // //                     index={index}
// // // //                     last={index === topPlayers.length - 1}
// // // //                   />
// // // //                 ))
// // // //               )}
// // // //             </Animated.View>

// // // //             <View style={{ height: isMobile ? 90 : 40 }} />
// // // //           </ScrollView>

// // // //           {/* MOBILE BOTTOM NAV */}

// // // //           {isMobile && (
// // // //             <View style={styles.bottomNav}>
// // // //               <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabHome}>
// // // //                 <Idle kind="bob" amount={3} duration={1000} style={styles.activeNavIcon}>
// // // //                   <Ionicons name="home" size={20} color="#FFFFFF" />
// // // //                 </Idle>
// // // //                 <Text style={styles.activeNavText}>Home</Text>
// // // //               </TouchableOpacity>

// // // //               <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabLeaderboard}>
// // // //                 <Ionicons name="trophy-outline" size={21} color={T.inkFaint} />
// // // //                 <Text style={styles.navText}>Rankings</Text>
// // // //               </TouchableOpacity>

// // // //               <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabProfile}>
// // // //                 <Ionicons name="person-outline" size={21} color={T.inkFaint} />
// // // //                 <Text style={styles.navText}>Profile</Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           )}
// // // //         </View>
// // // //       </View>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // export default WordScrambleHomeScreen;

// // // // /* ============================================================
// // // //    STYLES
// // // // ============================================================ */

// // // // const styles = StyleSheet.create({
// // // //   safeArea: {
// // // //     flex: 1,
// // // //     backgroundColor: T.bg,
// // // //   },

// // // //   root: {
// // // //     flex: 1,
// // // //     flexDirection: "row",
// // // //     backgroundColor: "transparent",
// // // //   },

// // // //   /* background bands */
// // // //   bgBandTop: {
// // // //     position: "absolute",
// // // //     top: -120,
// // // //     left: -60,
// // // //     right: -60,
// // // //     height: 260,
// // // //     backgroundColor: T.bgDeep,
// // // //     borderBottomLeftRadius: 260,
// // // //     borderBottomRightRadius: 260,
// // // //   },
// // // //   bgBandBottom: {
// // // //     position: "absolute",
// // // //     bottom: -140,
// // // //     left: -80,
// // // //     width: 340,
// // // //     height: 300,
// // // //     borderRadius: 150,
// // // //     backgroundColor: T.tangerinePale,
// // // //     opacity: 0.7,
// // // //   },

// // // //   /* SIDEBAR */

// // // //   sidebar: {
// // // //     width: 292,
// // // //     backgroundColor: "rgba(255,255,255,0.88)",
// // // //     borderRightWidth: 1.5,
// // // //     borderRightColor: T.line,
// // // //     paddingHorizontal: 19,
// // // //     paddingTop: 22,
// // // //     paddingBottom: 18,
// // // //     justifyContent: "space-between",
// // // //   },

// // // //   sidebarTablet: {
// // // //     width: 245,
// // // //   },

// // // //   sidebarBrand: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //   },

// // // //   sidebarLogo: {
// // // //     width: 58,
// // // //     height: 58,
// // // //     borderRadius: 14,
// // // //     backgroundColor: T.tile,
// // // //     borderWidth: 2,
// // // //     borderColor: T.tileEdge,
// // // //     borderBottomWidth: 5,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     flexDirection: "row",
// // // //     marginRight: 11,
// // // //   },

// // // //   logoW: {
// // // //     color: T.teal,
// // // //     fontSize: 21,
// // // //     fontWeight: "900",
// // // //   },

// // // //   logoS: {
// // // //     color: T.tangerine,
// // // //     fontSize: 21,
// // // //     fontWeight: "900",
// // // //   },

// // // //   sidebarBrandTitle: {
// // // //     color: T.ink,
// // // //     fontSize: 19,
// // // //     fontWeight: "900",
// // // //   },

// // // //   sidebarBrandAccent: {
// // // //     color: T.teal,
// // // //   },

// // // //   sidebarBrandSubtitle: {
// // // //     color: T.inkSoft,
// // // //     fontSize: 10.5,
// // // //     fontWeight: "600",
// // // //     marginTop: 2,
// // // //   },

// // // //   sidebarNavigation: {
// // // //     marginTop: 50,
// // // //     flex: 1,
// // // //   },

// // // //   sidebarNavItem: {
// // // //     height: 58,
// // // //     borderRadius: 15,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     paddingHorizontal: 15,
// // // //     marginBottom: 7,
// // // //   },

// // // //   sidebarNavActive: {
// // // //     backgroundColor: T.tealPale,
// // // //   },

// // // //   sidebarActiveIcon: {
// // // //     width: 40,
// // // //     height: 40,
// // // //     borderRadius: 12,
// // // //     backgroundColor: T.teal,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 11,
// // // //   },

// // // //   sidebarActiveText: {
// // // //     color: T.tealDark,
// // // //     fontSize: 15,
// // // //     fontWeight: "900",
// // // //   },

// // // //   sidebarText: {
// // // //     color: T.inkSoft,
// // // //     fontSize: 15,
// // // //     fontWeight: "700",
// // // //     marginLeft: 16,
// // // //   },

// // // //   sidebarBottomCard: {
// // // //     backgroundColor: T.ink,
// // // //     borderRadius: 19,
// // // //     padding: 17,
// // // //     minHeight: 137,
// // // //   },

// // // //   sidebarBottomIcon: {
// // // //     width: 43,
// // // //     height: 43,
// // // //     borderRadius: 13,
// // // //     backgroundColor: T.tangerine,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginBottom: 11,
// // // //   },

// // // //   sidebarBottomTitle: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 13,
// // // //     fontWeight: "900",
// // // //   },

// // // //   sidebarBottomText: {
// // // //     color: "#A9CFCB",
// // // //     fontSize: 10.5,
// // // //     lineHeight: 17,
// // // //     marginTop: 5,
// // // //   },

// // // //   /* MAIN */

// // // //   main: {
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //     backgroundColor: "transparent",
// // // //   },

// // // //   mainDesktop: {
// // // //     overflow: "hidden",
// // // //   },

// // // //   /* HEADER */

// // // //   mobileHeader: {
// // // //     height: 76,
// // // //     paddingHorizontal: 17,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "space-between",
// // // //     backgroundColor: "transparent",
// // // //   },

// // // //   mobileHeaderLeft: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     flex: 1,
// // // //   },

// // // //   headerBackButton: {
// // // //     width: 42,
// // // //     height: 42,
// // // //     borderRadius: 12,
// // // //     backgroundColor: T.white,
// // // //     borderWidth: 1.5,
// // // //     borderColor: T.line,
// // // //     borderBottomWidth: 4,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 10,
// // // //   },

// // // //   mobileLogo: {
// // // //     width: 45,
// // // //     height: 45,
// // // //     borderRadius: 12,
// // // //     backgroundColor: T.tile,
// // // //     borderWidth: 2,
// // // //     borderColor: T.tileEdge,
// // // //     borderBottomWidth: 4,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     flexDirection: "row",
// // // //     marginRight: 10,
// // // //   },

// // // //   mobileBrandTitle: {
// // // //     color: T.ink,
// // // //     fontSize: 17,
// // // //     fontWeight: "900",
// // // //   },

// // // //   mobileBrandAccent: {
// // // //     color: T.teal,
// // // //   },

// // // //   mobileBrandSubtitle: {
// // // //     color: T.inkSoft,
// // // //     fontSize: 9.5,
// // // //     marginTop: 2,
// // // //     fontWeight: "600",
// // // //   },

// // // //   mobileNotification: {
// // // //     width: 40,
// // // //     height: 40,
// // // //     borderRadius: 12,
// // // //     backgroundColor: T.white,
// // // //     borderWidth: 1.5,
// // // //     borderColor: T.line,
// // // //     borderBottomWidth: 4,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   desktopTopHeader: {
// // // //     height: 76,
// // // //     paddingHorizontal: 34,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "space-between",
// // // //   },

// // // //   desktopHeaderLeft: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //   },

// // // //   desktopWelcome: {
// // // //     color: T.ink,
// // // //     fontSize: 16,
// // // //     fontWeight: "900",
// // // //   },

// // // //   desktopWelcomeSub: {
// // // //     color: T.inkSoft,
// // // //     fontSize: 11,
// // // //     marginTop: 3,
// // // //   },

// // // //   desktopNotification: {
// // // //     width: 44,
// // // //     height: 44,
// // // //     borderRadius: 13,
// // // //     backgroundColor: T.white,
// // // //     borderWidth: 1.5,
// // // //     borderColor: T.line,
// // // //     borderBottomWidth: 4,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   /* SCROLL */

// // // //   scrollContent: {
// // // //     paddingHorizontal: 34,
// // // //     paddingTop: 15,
// // // //   },

// // // //   scrollContentTablet: {
// // // //     paddingHorizontal: 25,
// // // //   },

// // // //   scrollContentMobile: {
// // // //     paddingHorizontal: 17,
// // // //     paddingTop: 5,
// // // //   },

// // // //   /* HERO */

// // // //   heroSection: {
// // // //     marginTop: 7,
// // // //   },

// // // //   heroMobile: {
// // // //     marginTop: 5,
// // // //   },

// // // //   heroPill: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     alignSelf: "flex-start",
// // // //     backgroundColor: T.tangerinePale,
// // // //     borderRadius: 999,
// // // //     paddingVertical: 4,
// // // //     paddingHorizontal: 10,
// // // //     marginBottom: 10,
// // // //     gap: 4,
// // // //   },

// // // //   smallGreeting: {
// // // //     color: T.tangerineDark,
// // // //     fontSize: 12,
// // // //     fontWeight: "800",
// // // //   },

// // // //   heroTitle: {
// // // //     color: T.ink,
// // // //     fontSize: 45,
// // // //     lineHeight: 48,
// // // //     fontWeight: "900",
// // // //     letterSpacing: -1.2,
// // // //   },

// // // //   heroTitleMobile: {
// // // //     fontSize: 37,
// // // //     lineHeight: 40,
// // // //     letterSpacing: -1,
// // // //   },

// // // //   heroAccent: {
// // // //     color: T.teal,
// // // //   },

// // // //   heroDescription: {
// // // //     color: T.inkSoft,
// // // //     fontSize: 13.5,
// // // //     lineHeight: 20,
// // // //     marginTop: 10,
// // // //     maxWidth: 390,
// // // //   },

// // // //   heroDescriptionMobile: {
// // // //     fontSize: 12.5,
// // // //     lineHeight: 18,
// // // //     maxWidth: 310,
// // // //   },

// // // //   /* SHUFFLING TILES */

// // // //   lettersContainer: {
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginTop: 26,
// // // //     marginBottom: 25,
// // // //     paddingTop: 18, // room for the hop
// // // //   },

// // // //   lettersMobile: {
// // // //     marginTop: 22,
// // // //     marginBottom: 20,
// // // //   },

// // // //   scrambleBox: {
// // // //     width: TILE * 4 + TILE_GAP * 3,
// // // //     height: TILE,
// // // //   },

// // // //   heroTile: {
// // // //     position: "absolute",
// // // //     left: 0,
// // // //     top: 0,
// // // //     width: TILE,
// // // //     height: TILE,
// // // //     borderRadius: 13,
// // // //     backgroundColor: T.tile,
// // // //     borderWidth: 2,
// // // //     borderColor: T.tileEdge,
// // // //     borderBottomWidth: 6,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   heroTileChar: {
// // // //     fontSize: 27,
// // // //     fontWeight: "900",
// // // //   },

// // // //   heroTilePts: {
// // // //     position: "absolute",
// // // //     right: 6,
// // // //     bottom: 3,
// // // //     fontSize: 9,
// // // //     fontWeight: "800",
// // // //     color: T.inkSoft,
// // // //   },

// // // //   /* CHOOSE YOUR MODE */

// // // //   modeCard: {
// // // //     backgroundColor: T.card,
// // // //     borderRadius: 24,
// // // //     padding: 14,
// // // //     borderWidth: 1.5,
// // // //     borderColor: T.line,
// // // //     borderBottomWidth: 5,
// // // //     alignSelf: "stretch",
// // // //   },

// // // //   modeCardMobile: {
// // // //     padding: 12,
// // // //     borderRadius: 22,
// // // //   },

// // // //   modeHeader: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     marginBottom: 14,
// // // //   },

// // // //   modeHeaderIcon: {
// // // //     width: 50,
// // // //     height: 50,
// // // //     borderRadius: 14,
// // // //     backgroundColor: T.teal,
// // // //     borderBottomWidth: 4,
// // // //     borderBottomColor: T.tealDark,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 12,
// // // //   },

// // // //   modeHeaderInfo: {
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //   },

// // // //   modeHeaderTitle: {
// // // //     color: T.ink,
// // // //     fontSize: 16,
// // // //     fontWeight: "900",
// // // //   },

// // // //   modeHeaderText: {
// // // //     color: T.inkSoft,
// // // //     fontSize: 11.5,
// // // //     marginTop: 3,
// // // //   },

// // // //   modeRow: {
// // // //     flexDirection: "row",
// // // //     gap: 10,
// // // //   },

// // // //   modeBox: {
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //     borderRadius: 18,
// // // //     padding: 10,
// // // //     alignItems: "center",
// // // //     borderWidth: 1.5,
// // // //   },

// // // //   modeBoxSingle: {
// // // //     backgroundColor: T.tealPale,
// // // //     borderColor: "#B5E6D8",
// // // //   },

// // // //   modeBoxMulti: {
// // // //     backgroundColor: T.tangerinePale,
// // // //     borderColor: "#FFD2B3",
// // // //   },

// // // //   modeIconWrap: {
// // // //     height: 56,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginTop: 4,
// // // //     marginBottom: 6,
// // // //   },

// // // //   modeIconCircle: {
// // // //     width: 50,
// // // //     height: 50,
// // // //     borderRadius: 25,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   singleCircle: {
// // // //     backgroundColor: T.teal,
// // // //   },

// // // //   multiIcons: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 4,
// // // //   },

// // // //   multiPerson: {
// // // //     width: 38,
// // // //     height: 38,
// // // //     borderRadius: 19,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   multiPersonTeal: {
// // // //     backgroundColor: T.teal,
// // // //   },

// // // //   multiPersonOrange: {
// // // //     backgroundColor: T.tangerine,
// // // //   },

// // // //   modeTitle: {
// // // //     color: T.ink,
// // // //     fontSize: 15,
// // // //     fontWeight: "900",
// // // //     textAlign: "center",
// // // //   },

// // // //   modeText: {
// // // //     color: T.inkSoft,
// // // //     fontSize: 11,
// // // //     lineHeight: 16,
// // // //     textAlign: "center",
// // // //     marginTop: 5,
// // // //     marginBottom: 12,
// // // //     minHeight: 32,
// // // //   },

// // // //   modeButtonWrap: {
// // // //     alignSelf: "stretch",
// // // //   },

// // // //   modeButton: {
// // // //     height: 44,
// // // //     alignSelf: "stretch",
// // // //     borderRadius: 14,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     gap: 6,
// // // //     borderBottomWidth: 4,
// // // //   },

// // // //   singleButton: {
// // // //     backgroundColor: T.teal,
// // // //     borderBottomColor: T.tealDark,
// // // //   },

// // // //   multiButton: {
// // // //     backgroundColor: T.tangerine,
// // // //     borderBottomColor: T.tangerineDark,
// // // //   },

// // // //   modeButtonText: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 13,
// // // //     fontWeight: "900",
// // // //   },

// // // //   /* SECTIONS */

// // // //   sectionTitle: {
// // // //     color: T.ink,
// // // //     fontSize: 17,
// // // //     fontWeight: "900",
// // // //   },

// // // //   sectionSubtitle: {
// // // //     color: T.inkSoft,
// // // //     fontSize: 11,
// // // //     marginTop: 3,
// // // //   },

// // // //   /* CHALLENGE */

// // // //   challengeCard: {
// // // //     marginTop: 22,
// // // //     borderRadius: 18,
// // // //     backgroundColor: T.ink,
// // // //     padding: 15,
// // // //   },

// // // //   challengeCardMobile: {
// // // //     marginTop: 18,
// // // //     padding: 14,
// // // //   },

// // // //   challengeTop: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "space-between",
// // // //   },

// // // //   challengeLeft: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //   },

// // // //   challengeIcon: {
// // // //     width: 42,
// // // //     height: 42,
// // // //     borderRadius: 13,
// // // //     backgroundColor: T.lemon,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 11,
// // // //   },

// // // //   challengeInfo: {
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //   },

// // // //   challengeTitle: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 13,
// // // //     fontWeight: "900",
// // // //   },

// // // //   challengeText: {
// // // //     color: "#A9CFCB",
// // // //     fontSize: 10.5,
// // // //     marginTop: 3,
// // // //   },

// // // //   challengeProgress: {
// // // //     alignItems: "flex-end",
// // // //     marginLeft: 10,
// // // //   },

// // // //   progressNumber: {
// // // //     color: T.lemon,
// // // //     fontSize: 17,
// // // //     fontWeight: "900",
// // // //   },

// // // //   progressText: {
// // // //     color: "#7FB0AB",
// // // //     fontSize: 9,
// // // //     marginTop: 1,
// // // //   },

// // // //   progressTrack: {
// // // //     height: 8,
// // // //     borderRadius: 4,
// // // //     backgroundColor: "rgba(255,255,255,0.14)",
// // // //     marginTop: 14,
// // // //     overflow: "hidden",
// // // //   },

// // // //   progressFill: {
// // // //     height: 8,
// // // //     borderRadius: 4,
// // // //     backgroundColor: T.lemon,
// // // //   },

// // // //   /* LEADERBOARD */

// // // //   leaderHeader: {
// // // //     marginTop: 27,
// // // //     marginBottom: 12,
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //   },

// // // //   viewAll: {
// // // //     color: T.tealDark,
// // // //     fontSize: 12,
// // // //     fontWeight: "800",
// // // //   },

// // // //   leaderboardCard: {
// // // //     backgroundColor: T.card,
// // // //     borderRadius: 19,
// // // //     borderWidth: 1.5,
// // // //     borderColor: T.line,
// // // //     borderBottomWidth: 5,
// // // //     paddingHorizontal: 13,
// // // //     overflow: "hidden",
// // // //   },

// // // //   playerRow: {
// // // //     minHeight: 64,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: "#E4F3EE",
// // // //   },

// // // //   lastPlayerRow: {
// // // //     borderBottomWidth: 0,
// // // //   },

// // // //   rankCircle: {
// // // //     width: 27,
// // // //     height: 27,
// // // //     borderRadius: 8,
// // // //     backgroundColor: "#EAF1EF",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 9,
// // // //   },

// // // //   rankFirst: {
// // // //     backgroundColor: "#FFEFA6",
// // // //   },

// // // //   rankSecond: {
// // // //     backgroundColor: "#E3E9E8",
// // // //   },

// // // //   rankThird: {
// // // //     backgroundColor: "#FFD9BE",
// // // //   },

// // // //   rankText: {
// // // //     color: T.ink,
// // // //     fontSize: 11,
// // // //     fontWeight: "900",
// // // //   },

// // // //   playerAvatar: {
// // // //     width: 37,
// // // //     height: 37,
// // // //     borderRadius: 13,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 10,
// // // //   },

// // // //   playerInfo: {
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //   },

// // // //   playerName: {
// // // //     color: T.ink,
// // // //     fontSize: 13,
// // // //     fontWeight: "800",
// // // //   },

// // // //   topPlayerLabel: {
// // // //     color: T.tangerineDark,
// // // //     fontSize: 10,
// // // //     fontWeight: "800",
// // // //     marginTop: 2,
// // // //   },

// // // //   scoreContainer: {
// // // //     alignItems: "flex-end",
// // // //     marginLeft: 8,
// // // //   },

// // // //   scoreNumber: {
// // // //     color: T.ink,
// // // //     fontSize: 14,
// // // //     fontWeight: "900",
// // // //   },

// // // //   scoreLabel: {
// // // //     color: T.inkFaint,
// // // //     fontSize: 9,
// // // //     fontWeight: "800",
// // // //     marginTop: 1,
// // // //   },

// // // //   emptyLeaderboard: {
// // // //     height: 110,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   emptyText: {
// // // //     color: T.inkSoft,
// // // //     fontSize: 11,
// // // //     marginTop: 7,
// // // //   },

// // // //   /* BOTTOM NAV */

// // // //   bottomNav: {
// // // //     height: 70,
// // // //     backgroundColor: T.white,
// // // //     borderTopWidth: 1.5,
// // // //     borderTopColor: T.line,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "space-around",
// // // //     paddingBottom: 4,
// // // //   },

// // // //   navItem: {
// // // //     flex: 1,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   activeNavIcon: {
// // // //     width: 37,
// // // //     height: 32,
// // // //     borderRadius: 11,
// // // //     backgroundColor: T.teal,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   activeNavText: {
// // // //     color: T.tealDark,
// // // //     fontSize: 9.5,
// // // //     fontWeight: "900",
// // // //     marginTop: 3,
// // // //   },

// // // //   navText: {
// // // //     color: T.inkFaint,
// // // //     fontSize: 9.5,
// // // //     fontWeight: "700",
// // // //     marginTop: 4,
// // // //   },
// // // // });
// // // import React, { useEffect, useRef } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   Pressable,
// // //   ScrollView,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   useWindowDimensions,
// // //   Animated,
// // //   Easing,
// // //   StyleProp,
// // //   ViewStyle,
// // // } from "react-native";
// // // import { Ionicons } from "@expo/vector-icons";

// // // export interface TopPlayer {
// // //   rank: number;
// // //   name: string;
// // //   score: number;
// // //   avatarColor: string;
// // // }

// // // interface WordScrambleHomeScreenProps {
// // //   topPlayers: TopPlayer[];

// // //   onPlayOnline: () => void;
// // //   onViewAllPlayers: () => void;

// // //   // no longer used on this screen (kept optional so App.tsx still compiles)
// // //   onCreateRoom?: () => void;
// // //   onJoinRoom?: (code: string) => void;

// // //   onGuestPlay?: () => void;

// // //   /**
// // //    * Parent must pass this function.
// // //    * Navigates from Word Scramble Home back to the Cyber Mind main menu.
// // //    */
// // //   onBack: () => void;

// // //   onTabHome: () => void;
// // //   onTabLeaderboard: () => void;
// // //   onTabProfile: () => void;
// // // }

// // // /* ============================================================
// // //    THEME  (mint paper + deep teal ink + tangerine, scrabble tiles)
// // // ============================================================ */

// // // const T = {
// // //   bg: "#EAF8F2",
// // //   bgDeep: "#D6F1E7",
// // //   ink: "#0F3D3E",
// // //   inkSoft: "#4F7476",
// // //   inkFaint: "#8FB0AE",
// // //   teal: "#14A38B",
// // //   tealDark: "#0C7F6B",
// // //   tealPale: "#D2F2E8",
// // //   tangerine: "#FF8A3D",
// // //   tangerineDark: "#DB6A1C",
// // //   tangerinePale: "#FFE8D6",
// // //   lemon: "#FFD84D",
// // //   tile: "#FFF6DF",
// // //   tileEdge: "#E2CD9C",
// // //   card: "#FFFFFF",
// // //   line: "#CBE8DE",
// // //   white: "#FFFFFF",
// // // };

// // // /* ============================================================
// // //    SMALL ANIMATION HELPERS
// // // ============================================================ */

// // // /** Endless idle motion: bob (up/down), pulse (scale) or sway (rotate). */
// // // const Idle: React.FC<{
// // //   children: React.ReactNode;
// // //   style?: StyleProp<ViewStyle>;
// // //   kind?: "bob" | "pulse" | "sway";
// // //   duration?: number;
// // //   delay?: number;
// // //   amount?: number;
// // // }> = ({ children, style, kind = "bob", duration = 1800, delay = 0, amount = 6 }) => {
// // //   const v = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     const loop = Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(v, {
// // //           toValue: 1,
// // //           duration,
// // //           delay,
// // //           easing: Easing.inOut(Easing.quad),
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(v, {
// // //           toValue: 0,
// // //           duration,
// // //           easing: Easing.inOut(Easing.quad),
// // //           useNativeDriver: true,
// // //         }),
// // //       ])
// // //     );
// // //     loop.start();
// // //     return () => loop.stop();
// // //   }, [v, duration, delay]);

// // //   let transform: any[] = [];
// // //   if (kind === "bob") {
// // //     transform = [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -amount] }) }];
// // //   } else if (kind === "pulse") {
// // //     transform = [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1 + amount / 50] }) }];
// // //   } else {
// // //     transform = [
// // //       {
// // //         rotate: v.interpolate({
// // //           inputRange: [0, 1],
// // //           outputRange: [`${-amount}deg`, `${amount}deg`],
// // //         }),
// // //       },
// // //     ];
// // //   }

// // //   return <Animated.View style={[style, { transform }]}>{children}</Animated.View>;
// // // };

// // // /** Press feedback: squishes down then springs back. */
// // // const PressScale: React.FC<{
// // //   children: React.ReactNode;
// // //   onPress?: () => void;
// // //   style?: StyleProp<ViewStyle>;
// // //   accessibilityLabel?: string;
// // // }> = ({ children, onPress, style, accessibilityLabel }) => {
// // //   const s = useRef(new Animated.Value(1)).current;

// // //   return (
// // //     <Animated.View style={[{ transform: [{ scale: s }] }, style]}>
// // //       <Pressable
// // //         onPress={onPress}
// // //         accessibilityRole="button"
// // //         accessibilityLabel={accessibilityLabel}
// // //         onPressIn={() =>
// // //           Animated.spring(s, { toValue: 0.94, friction: 8, tension: 220, useNativeDriver: true }).start()
// // //         }
// // //         onPressOut={() =>
// // //           Animated.spring(s, { toValue: 1, friction: 3, tension: 140, useNativeDriver: true }).start()
// // //         }
// // //       >
// // //         {children}
// // //       </Pressable>
// // //     </Animated.View>
// // //   );
// // // };

// // // /** Bell that rings every few seconds. */
// // // const BellRing: React.FC<{ size?: number }> = ({ size = 20 }) => {
// // //   const r = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     const loop = Animated.loop(
// // //       Animated.sequence([
// // //         Animated.delay(3200),
// // //         Animated.timing(r, { toValue: 1, duration: 90, useNativeDriver: true }),
// // //         Animated.timing(r, { toValue: -1, duration: 130, useNativeDriver: true }),
// // //         Animated.timing(r, { toValue: 1, duration: 130, useNativeDriver: true }),
// // //         Animated.timing(r, { toValue: -1, duration: 130, useNativeDriver: true }),
// // //         Animated.timing(r, { toValue: 0, duration: 90, useNativeDriver: true }),
// // //       ])
// // //     );
// // //     loop.start();
// // //     return () => loop.stop();
// // //   }, [r]);

// // //   const rotate = r.interpolate({ inputRange: [-1, 1], outputRange: ["-16deg", "16deg"] });

// // //   return (
// // //     <Animated.View style={{ transform: [{ rotate }] }}>
// // //       <Ionicons name="notifications-outline" size={size} color={T.ink} />
// // //     </Animated.View>
// // //   );
// // // };

// // // /* ============================================================
// // //    BACKGROUND: letters slowly falling like tiles being dealt
// // // ============================================================ */

// // // const FallingLetter: React.FC<{
// // //   char: string;
// // //   left: number;
// // //   height: number;
// // //   duration: number;
// // //   start: number; // 0..1 starting progress
// // //   color: string;
// // //   size?: number;
// // // }> = ({ char, left, height, duration, start, color, size = 40 }) => {
// // //   const v = useRef(new Animated.Value(start)).current;

// // //   useEffect(() => {
// // //     let alive = true;

// // //     const run = (from: number) => {
// // //       v.setValue(from);
// // //       Animated.timing(v, {
// // //         toValue: 1,
// // //         duration: duration * (1 - from),
// // //         easing: Easing.linear,
// // //         useNativeDriver: true,
// // //       }).start(({ finished }) => {
// // //         if (finished && alive) run(0);
// // //       });
// // //     };

// // //     run(start);

// // //     return () => {
// // //       alive = false;
// // //       v.stopAnimation();
// // //     };
// // //   }, [v, duration, start]);

// // //   const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [-70, height + 20] });
// // //   const rotate = v.interpolate({ inputRange: [0, 1], outputRange: ["-14deg", "16deg"] });
// // //   const opacity = v.interpolate({
// // //     inputRange: [0, 0.12, 0.85, 1],
// // //     outputRange: [0, 0.3, 0.3, 0],
// // //   });

// // //   return (
// // //     <Animated.View
// // //       pointerEvents="none"
// // //       style={{
// // //         position: "absolute",
// // //         left,
// // //         top: 0,
// // //         width: size,
// // //         height: size,
// // //         borderRadius: 10,
// // //         backgroundColor: T.tile,
// // //         borderWidth: 1.5,
// // //         borderColor: T.tileEdge,
// // //         alignItems: "center",
// // //         justifyContent: "center",
// // //         opacity,
// // //         transform: [{ translateY }, { rotate }],
// // //       }}
// // //     >
// // //       <Text style={{ color, fontSize: size * 0.48, fontWeight: "900" }}>{char}</Text>
// // //     </Animated.View>
// // //   );
// // // };

// // // /** Faint Scrabble-board grid with a few glowing bonus squares. */
// // // const CELL = 44;

// // // const BonusSquare: React.FC<{
// // //   c: number;
// // //   r: number;
// // //   label: string;
// // //   bg: string;
// // //   fg: string;
// // //   delay: number;
// // // }> = ({ c, r, label, bg, fg, delay }) => {
// // //   const v = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     const loop = Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(v, { toValue: 1, duration: 1800, delay, useNativeDriver: true }),
// // //         Animated.timing(v, { toValue: 0, duration: 1800, useNativeDriver: true }),
// // //       ])
// // //     );
// // //     loop.start();
// // //     return () => loop.stop();
// // //   }, [v, delay]);

// // //   return (
// // //     <Animated.View
// // //       style={{
// // //         position: "absolute",
// // //         left: c * CELL + 2,
// // //         top: r * CELL + 2,
// // //         width: CELL - 3,
// // //         height: CELL - 3,
// // //         borderRadius: 5,
// // //         backgroundColor: bg,
// // //         alignItems: "center",
// // //         justifyContent: "center",
// // //         opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.95] }),
// // //       }}
// // //     >
// // //       <Text style={{ color: fg, fontSize: 11, fontWeight: "900" }}>{label}</Text>
// // //     </Animated.View>
// // //   );
// // // };

// // // const BoardGrid: React.FC<{ width: number; height: number }> = ({ width, height }) => {
// // //   const cols = Math.ceil(width / CELL) + 1;
// // //   const rows = Math.ceil(height / CELL) + 1;

// // //   return (
// // //     <View style={StyleSheet.absoluteFill} pointerEvents="none">
// // //       {Array.from({ length: rows }).map((_, r) => (
// // //         <View key={`h${r}`} style={[styles.gridLineH, { top: r * CELL }]} />
// // //       ))}
// // //       {Array.from({ length: cols }).map((_, c) => (
// // //         <View key={`v${c}`} style={[styles.gridLineV, { left: c * CELL }]} />
// // //       ))}

// // //       <BonusSquare c={1} r={3} label="3W" bg={T.tangerinePale} fg={T.tangerineDark} delay={0} />
// // //       <BonusSquare c={Math.max(2, cols - 3)} r={6} label="2L" bg={T.tealPale} fg={T.tealDark} delay={600} />
// // //       <BonusSquare c={2} r={Math.max(8, Math.floor(rows * 0.6))} label="2W" bg={T.tangerinePale} fg={T.tangerineDark} delay={1200} />
// // //       <BonusSquare c={Math.max(1, cols - 2)} r={Math.max(10, Math.floor(rows * 0.8))} label="3L" bg={T.tealPale} fg={T.tealDark} delay={300} />
// // //     </View>
// // //   );
// // // };

// // // const FallingBackground: React.FC<{ width: number; height: number }> = ({ width, height }) => {
// // //   const items = [
// // //     { char: "S", left: 0.06, duration: 16000, start: 0.1, color: T.teal },
// // //     { char: "C", left: 0.2, duration: 21000, start: 0.55, color: T.tangerine },
// // //     { char: "R", left: 0.36, duration: 18000, start: 0.8, color: T.ink },
// // //     { char: "A", left: 0.52, duration: 23000, start: 0.3, color: T.teal },
// // //     { char: "M", left: 0.68, duration: 17000, start: 0.65, color: T.tangerine },
// // //     { char: "B", left: 0.82, duration: 20000, start: 0.15, color: T.ink },
// // //     { char: "L", left: 0.92, duration: 24000, start: 0.45, color: T.teal },
// // //   ];

// // //   return (
// // //     <View style={StyleSheet.absoluteFill} pointerEvents="none">
// // //       <BoardGrid width={width} height={height} />
// // //       {items.map((it) => (
// // //         <FallingLetter
// // //           key={it.char}
// // //           char={it.char}
// // //           left={Math.max(0, it.left * width - 20)}
// // //           height={height}
// // //           duration={it.duration}
// // //           start={it.start}
// // //           color={it.color}
// // //         />
// // //       ))}
// // //     </View>
// // //   );
// // // };

// // // /* ============================================================
// // //    HERO: tiles that shuffle themselves, then snap into WORD
// // // ============================================================ */

// // // const HERO_TILES = [
// // //   { char: "W", pts: 4, color: T.teal },
// // //   { char: "O", pts: 1, color: T.tangerine },
// // //   { char: "R", pts: 1, color: T.ink },
// // //   { char: "D", pts: 2, color: T.teal },
// // // ];
// // // // slot index each tile (W,O,R,D) sits in, per step. First = solved.
// // // const HERO_ORDERS = [
// // //   [0, 1, 2, 3],
// // //   [2, 0, 3, 1],
// // //   [1, 3, 0, 2],
// // //   [3, 2, 1, 0],
// // //   [2, 3, 1, 0],
// // // ];
// // // const TILE = 56;
// // // const TILE_GAP = 10;
// // // const STRIDE = TILE + TILE_GAP;

// // // const ScrambleTiles: React.FC = () => {
// // //   const xs = useRef(HERO_TILES.map((_, i) => new Animated.Value(i * STRIDE))).current;
// // //   const pop = useRef(new Animated.Value(0)).current;
// // //   const hop = useRef(HERO_TILES.map(() => new Animated.Value(0))).current;

// // //   useEffect(() => {
// // //     let alive = true;
// // //     let timer: ReturnType<typeof setTimeout>;
// // //     let step = 0;

// // //     const apply = (order: number[]) => {
// // //       Animated.stagger(
// // //         70,
// // //         xs.map((x, i) =>
// // //           Animated.parallel([
// // //             Animated.spring(x, {
// // //               toValue: order[i] * STRIDE,
// // //               friction: 6,
// // //               tension: 90,
// // //               useNativeDriver: true,
// // //             }),
// // //             Animated.sequence([
// // //               Animated.timing(hop[i], { toValue: 1, duration: 140, useNativeDriver: true }),
// // //               Animated.timing(hop[i], { toValue: 0, duration: 220, useNativeDriver: true }),
// // //             ]),
// // //           ])
// // //         )
// // //       ).start();
// // //     };

// // //     const tick = () => {
// // //       if (!alive) return;
// // //       step = (step + 1) % HERO_ORDERS.length;
// // //       apply(HERO_ORDERS[step]);

// // //       if (step === 0) {
// // //         // solved: celebrate, then hold
// // //         timer = setTimeout(() => {
// // //           Animated.sequence([
// // //             Animated.timing(pop, { toValue: 1, duration: 160, useNativeDriver: true }),
// // //             Animated.spring(pop, { toValue: 0, friction: 3, tension: 120, useNativeDriver: true }),
// // //           ]).start();
// // //         }, 520);
// // //         timer = setTimeout(tick, 3000);
// // //       } else {
// // //         timer = setTimeout(tick, step === 1 ? 900 : 750);
// // //       }
// // //     };

// // //     timer = setTimeout(tick, 1600);

// // //     return () => {
// // //       alive = false;
// // //       clearTimeout(timer);
// // //     };
// // //   }, [xs, hop, pop]);

// // //   const popScale = pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });

// // //   return (
// // //     <View style={styles.scrambleBox}>
// // //       {HERO_TILES.map((t, i) => {
// // //         const lift = hop[i].interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
// // //         return (
// // //           <Animated.View
// // //             key={t.char}
// // //             style={[
// // //               styles.heroTile,
// // //               { transform: [{ translateX: xs[i] }, { translateY: lift }, { scale: popScale }] },
// // //             ]}
// // //           >
// // //             <Text style={[styles.heroTileChar, { color: t.color }]}>{t.char}</Text>
// // //             <Text style={styles.heroTilePts}>{t.pts}</Text>
// // //           </Animated.View>
// // //         );
// // //       })}
// // //     </View>
// // //   );
// // // };

// // // /* ============================================================
// // //    LEADERBOARD ROW (slides in)
// // // ============================================================ */

// // // const PlayerRow: React.FC<{ player: TopPlayer; index: number; last: boolean }> = ({
// // //   player,
// // //   index,
// // //   last,
// // // }) => {
// // //   const v = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     Animated.timing(v, {
// // //       toValue: 1,
// // //       duration: 480,
// // //       delay: 900 + index * 130,
// // //       easing: Easing.out(Easing.cubic),
// // //       useNativeDriver: true,
// // //     }).start();
// // //   }, [v, index]);

// // //   return (
// // //     <Animated.View
// // //       style={[
// // //         styles.playerRow,
// // //         last && styles.lastPlayerRow,
// // //         {
// // //           opacity: v,
// // //           transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [46, 0] }) }],
// // //         },
// // //       ]}
// // //     >
// // //       <View
// // //         style={[
// // //           styles.rankCircle,
// // //           player.rank === 1 && styles.rankFirst,
// // //           player.rank === 2 && styles.rankSecond,
// // //           player.rank === 3 && styles.rankThird,
// // //         ]}
// // //       >
// // //         <Text style={styles.rankText}>{player.rank}</Text>
// // //       </View>

// // //       <View style={[styles.playerAvatar, { backgroundColor: player.avatarColor || T.teal }]}>
// // //         <Ionicons name="person" size={17} color="#FFFFFF" />
// // //       </View>

// // //       <View style={styles.playerInfo}>
// // //         <Text style={styles.playerName}>{player.name}</Text>
// // //         {player.rank === 1 && <Text style={styles.topPlayerLabel}>Top player</Text>}
// // //       </View>

// // //       <View style={styles.scoreContainer}>
// // //         <Text style={styles.scoreNumber}>{player.score}</Text>
// // //         <Text style={styles.scoreLabel}>pts</Text>
// // //       </View>
// // //     </Animated.View>
// // //   );
// // // };

// // // /* ============================================================
// // //    MAIN SCREEN
// // // ============================================================ */

// // // const WordScrambleHomeScreen: React.FC<WordScrambleHomeScreenProps> = ({
// // //   topPlayers,
// // //   onPlayOnline,
// // //   onViewAllPlayers,
// // //   onGuestPlay,
// // //   onBack,
// // //   onTabHome,
// // //   onTabLeaderboard,
// // //   onTabProfile,
// // // }) => {
// // //   const { width, height } = useWindowDimensions();

// // //   const isMobile = width < 768;
// // //   const isTablet = width >= 768 && width < 1100;

// // //   // staggered entrance for the 5 content blocks
// // //   const enters = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
// // //   const progress = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     Animated.stagger(
// // //       120,
// // //       enters.map((e) =>
// // //         Animated.timing(e, {
// // //           toValue: 1,
// // //           duration: 520,
// // //           easing: Easing.out(Easing.cubic),
// // //           useNativeDriver: true,
// // //         })
// // //       )
// // //     ).start();

// // //     Animated.timing(progress, {
// // //       toValue: 0.6, // 3 / 5 rounds
// // //       duration: 1100,
// // //       delay: 900,
// // //       easing: Easing.out(Easing.cubic),
// // //       useNativeDriver: false,
// // //     }).start();
// // //   }, [enters, progress]);

// // //   const rise = (i: number) => ({
// // //     opacity: enters[i],
// // //     transform: [
// // //       { translateY: enters[i].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
// // //     ],
// // //   });

// // //   // Single Player -> guest nickname flow (falls back to online flow)
// // //   const handleSinglePlayer = () => {
// // //     if (onGuestPlay) {
// // //       onGuestPlay();
// // //     } else {
// // //       onPlayOnline();
// // //     }
// // //   };

// // //   // Multiplayer -> online flow
// // //   const handleMultiplayer = () => {
// // //     onPlayOnline();
// // //   };

// // //   const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

// // //   return (
// // //     <SafeAreaView style={styles.safeArea}>
// // //       <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

// // //       <FallingBackground width={width} height={height} />

// // //       <View style={styles.root}>
// // //         {/* ==================================================
// // //             SIDEBAR
// // //         ================================================== */}

// // //         {!isMobile && (
// // //           <View style={[styles.sidebar, isTablet && styles.sidebarTablet]}>
// // //             <View style={styles.sidebarBrand}>
// // //               <View style={styles.sidebarLogo}>
// // //                 <Text style={styles.logoW}>W</Text>
// // //                 <Text style={styles.logoS}>S</Text>
// // //               </View>

// // //               <View>
// // //                 <Text style={styles.sidebarBrandTitle}>
// // //                   Word
// // //                   <Text style={styles.sidebarBrandAccent}> Scramble</Text>
// // //                 </Text>
// // //                 <Text style={styles.sidebarBrandSubtitle}>Think fast. Play smart.</Text>
// // //               </View>
// // //             </View>

// // //             <View style={styles.sidebarNavigation}>
// // //               <TouchableOpacity
// // //                 style={[styles.sidebarNavItem, styles.sidebarNavActive]}
// // //                 onPress={onTabHome}
// // //                 activeOpacity={0.8}
// // //               >
// // //                 <View style={styles.sidebarActiveIcon}>
// // //                   <Ionicons name="home" size={21} color="#FFFFFF" />
// // //                 </View>
// // //                 <Text style={styles.sidebarActiveText}>Home</Text>
// // //               </TouchableOpacity>

// // //               <TouchableOpacity style={styles.sidebarNavItem} onPress={onTabLeaderboard} activeOpacity={0.8}>
// // //                 <Ionicons name="trophy-outline" size={22} color={T.inkSoft} />
// // //                 <Text style={styles.sidebarText}>Rankings</Text>
// // //               </TouchableOpacity>

// // //               <TouchableOpacity style={styles.sidebarNavItem} onPress={onTabProfile} activeOpacity={0.8}>
// // //                 <Ionicons name="person-outline" size={22} color={T.inkSoft} />
// // //                 <Text style={styles.sidebarText}>Profile</Text>
// // //               </TouchableOpacity>
// // //             </View>

// // //             <View style={styles.sidebarBottomCard}>
// // //               <Idle kind="sway" amount={8} duration={1400} style={styles.sidebarBottomIcon}>
// // //                 <Ionicons name="sparkles" size={21} color="#FFFFFF" />
// // //               </Idle>
// // //               <Text style={styles.sidebarBottomTitle}>Ready for a challenge?</Text>
// // //               <Text style={styles.sidebarBottomText}>
// // //                 Unscramble words and climb the rankings.
// // //               </Text>
// // //             </View>
// // //           </View>
// // //         )}

// // //         {/* ==================================================
// // //             MAIN
// // //         ================================================== */}

// // //         <View style={[styles.main, !isMobile && styles.mainDesktop]}>
// // //           {/* MOBILE HEADER */}

// // //           {isMobile && (
// // //             <View style={styles.mobileHeader}>
// // //               <View style={styles.mobileHeaderLeft}>
// // //                 <TouchableOpacity
// // //                   style={styles.headerBackButton}
// // //                   activeOpacity={0.75}
// // //                   onPress={onBack}
// // //                   accessibilityRole="button"
// // //                   accessibilityLabel="Go back"
// // //                 >
// // //                   <Ionicons name="arrow-back" size={22} color={T.ink} />
// // //                 </TouchableOpacity>

// // //                 <View style={styles.mobileLogo}>
// // //                   <Text style={styles.logoW}>W</Text>
// // //                   <Text style={styles.logoS}>S</Text>
// // //                 </View>

// // //                 <View>
// // //                   <Text style={styles.mobileBrandTitle}>
// // //                     Word
// // //                     <Text style={styles.mobileBrandAccent}> Scramble</Text>
// // //                   </Text>
// // //                   <Text style={styles.mobileBrandSubtitle}>Think fast. Play smart.</Text>
// // //                 </View>
// // //               </View>

// // //               <TouchableOpacity style={styles.mobileNotification} activeOpacity={0.8}>
// // //                 <BellRing />
// // //               </TouchableOpacity>
// // //             </View>
// // //           )}

// // //           {/* DESKTOP HEADER */}

// // //           {!isMobile && (
// // //             <View style={styles.desktopTopHeader}>
// // //               <View style={styles.desktopHeaderLeft}>
// // //                 <TouchableOpacity
// // //                   style={styles.headerBackButton}
// // //                   activeOpacity={0.75}
// // //                   onPress={onBack}
// // //                   accessibilityRole="button"
// // //                   accessibilityLabel="Go back"
// // //                 >
// // //                   <Ionicons name="arrow-back" size={21} color={T.ink} />
// // //                 </TouchableOpacity>

// // //                 <View>
// // //                   <Text style={styles.desktopWelcome}>Welcome back!</Text>
// // //                   <Text style={styles.desktopWelcomeSub}>Ready to play?</Text>
// // //                 </View>
// // //               </View>

// // //               <TouchableOpacity style={styles.desktopNotification}>
// // //                 <BellRing />
// // //               </TouchableOpacity>
// // //             </View>
// // //           )}

// // //           {/* CONTENT */}

// // //           <ScrollView
// // //             showsVerticalScrollIndicator={false}
// // //             contentContainerStyle={[
// // //               styles.scrollContent,
// // //               isMobile && styles.scrollContentMobile,
// // //               isTablet && styles.scrollContentTablet,
// // //             ]}
// // //           >
// // //             {/* HERO */}

// // //             <Animated.View style={[styles.heroSection, isMobile && styles.heroMobile, rise(0)]}>
// // //               <View style={styles.heroPill}>
// // //                 <Ionicons name="flash" size={12} color={T.tangerineDark} />
// // //                 <Text style={styles.smallGreeting}>Ready to play?</Text>
// // //               </View>

// // //               <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
// // //                 Unscramble.
// // //                 {"\n"}
// // //                 <Text style={styles.heroAccent}>Outsmart.</Text>
// // //               </Text>

// // //               <Text style={[styles.heroDescription, isMobile && styles.heroDescriptionMobile]}>
// // //                 Arrange the letters, find the hidden word, and race against your friends.
// // //               </Text>
// // //             </Animated.View>

// // //             {/* SHUFFLING TILES */}

// // //             <Animated.View style={[styles.lettersContainer, isMobile && styles.lettersMobile, rise(1)]}>
// // //               <ScrambleTiles />
// // //             </Animated.View>

// // //             {/* CHOOSE YOUR MODE */}

// // //             <Animated.View style={[styles.modeCard, isMobile && styles.modeCardMobile, rise(2)]}>
// // //               <View style={styles.modeHeader}>
// // //                 <View style={styles.modeHeaderIcon}>
// // //                   <Ionicons name="game-controller" size={26} color="#FFFFFF" />
// // //                 </View>

// // //                 <View style={styles.modeHeaderInfo}>
// // //                   <Text style={styles.modeHeaderTitle}>Choose your mode</Text>
// // //                   <Text style={styles.modeHeaderText}>Play your way and enjoy the game!</Text>
// // //                 </View>
// // //               </View>

// // //               <View style={styles.modeRow}>
// // //                 {/* SINGLE PLAYER */}

// // //                 <View style={[styles.modeBox, styles.modeBoxSingle]}>
// // //                   <View style={styles.modeIconWrap}>
// // //                     <Idle kind="pulse" amount={7} duration={1200}>
// // //                       <View style={[styles.modeIconCircle, styles.singleCircle]}>
// // //                         <Ionicons name="person" size={26} color="#FFFFFF" />
// // //                       </View>
// // //                     </Idle>
// // //                   </View>

// // //                   <Text style={styles.modeTitle}>Single Player</Text>
// // //                   <Text style={styles.modeText}>Challenge yourself and improve your skills.</Text>

// // //                   <PressScale
// // //                     onPress={handleSinglePlayer}
// // //                     style={styles.modeButtonWrap}
// // //                     accessibilityLabel="Play single player"
// // //                   >
// // //                     <View style={[styles.modeButton, styles.singleButton]}>
// // //                       <Text style={styles.modeButtonText}>Play now</Text>
// // //                       <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
// // //                     </View>
// // //                   </PressScale>
// // //                 </View>

// // //                 {/* MULTIPLAYER */}

// // //                 <View style={[styles.modeBox, styles.modeBoxMulti]}>
// // //                   <View style={styles.modeIconWrap}>
// // //                     <View style={styles.multiIcons}>
// // //                       <Idle kind="bob" amount={5} duration={900}>
// // //                         <View style={[styles.multiPerson, styles.multiPersonTeal]}>
// // //                           <Ionicons name="person" size={18} color="#FFFFFF" />
// // //                         </View>
// // //                       </Idle>
// // //                       <Idle kind="bob" amount={5} duration={900} delay={450}>
// // //                         <View style={[styles.multiPerson, styles.multiPersonOrange]}>
// // //                           <Ionicons name="person" size={18} color="#FFFFFF" />
// // //                         </View>
// // //                       </Idle>
// // //                     </View>
// // //                   </View>

// // //                   <Text style={styles.modeTitle}>Multiplayer</Text>
// // //                   <Text style={styles.modeText}>Play with your friends and compete together.</Text>

// // //                   <PressScale
// // //                     onPress={handleMultiplayer}
// // //                     style={styles.modeButtonWrap}
// // //                     accessibilityLabel="Play multiplayer"
// // //                   >
// // //                     <View style={[styles.modeButton, styles.multiButton]}>
// // //                       <Text style={styles.modeButtonText}>Play now</Text>
// // //                       <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
// // //                     </View>
// // //                   </PressScale>
// // //                 </View>
// // //               </View>
// // //             </Animated.View>

// // //             {/* DAILY CHALLENGE */}

// // //             <Animated.View style={[styles.challengeCard, isMobile && styles.challengeCardMobile, rise(3)]}>
// // //               <View style={styles.challengeTop}>
// // //                 <View style={styles.challengeLeft}>
// // //                   <Idle kind="sway" amount={9} duration={1300} style={styles.challengeIcon}>
// // //                     <Ionicons name="trophy" size={22} color={T.ink} />
// // //                   </Idle>

// // //                   <View style={styles.challengeInfo}>
// // //                     <Text style={styles.challengeTitle}>Daily challenge</Text>
// // //                     <Text style={styles.challengeText}>Solve today's puzzle</Text>
// // //                   </View>
// // //                 </View>

// // //                 <View style={styles.challengeProgress}>
// // //                   <Text style={styles.progressNumber}>3/5</Text>
// // //                   <Text style={styles.progressText}>rounds</Text>
// // //                 </View>
// // //               </View>

// // //               <View style={styles.progressTrack}>
// // //                 <Animated.View style={[styles.progressFill, { width: barWidth }]} />
// // //               </View>
// // //             </Animated.View>

// // //             {/* LEADERBOARD */}

// // //             <Animated.View style={[styles.leaderHeader, rise(4)]}>
// // //               <View>
// // //                 <Text style={styles.sectionTitle}>Top players</Text>
// // //                 <Text style={styles.sectionSubtitle}>Today's leaderboard</Text>
// // //               </View>

// // //               <TouchableOpacity activeOpacity={0.7} onPress={onViewAllPlayers}>
// // //                 <Text style={styles.viewAll}>View all</Text>
// // //               </TouchableOpacity>
// // //             </Animated.View>

// // //             <Animated.View style={[styles.leaderboardCard, rise(4)]}>
// // //               {topPlayers.length === 0 ? (
// // //                 <View style={styles.emptyLeaderboard}>
// // //                   <Idle kind="bob" amount={6} duration={1100}>
// // //                     <Ionicons name="trophy-outline" size={28} color={T.inkFaint} />
// // //                   </Idle>
// // //                   <Text style={styles.emptyText}>No players yet</Text>
// // //                 </View>
// // //               ) : (
// // //                 topPlayers.map((player, index) => (
// // //                   <PlayerRow
// // //                     key={`${player.rank}-${player.name}`}
// // //                     player={player}
// // //                     index={index}
// // //                     last={index === topPlayers.length - 1}
// // //                   />
// // //                 ))
// // //               )}
// // //             </Animated.View>

// // //             <View style={{ height: isMobile ? 90 : 40 }} />
// // //           </ScrollView>

// // //           {/* MOBILE BOTTOM NAV */}

// // //           {isMobile && (
// // //             <View style={styles.bottomNav}>
// // //               <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabHome}>
// // //                 <Idle kind="bob" amount={3} duration={1000} style={styles.activeNavIcon}>
// // //                   <Ionicons name="home" size={20} color="#FFFFFF" />
// // //                 </Idle>
// // //                 <Text style={styles.activeNavText}>Home</Text>
// // //               </TouchableOpacity>

// // //               <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabLeaderboard}>
// // //                 <Ionicons name="trophy-outline" size={21} color={T.inkFaint} />
// // //                 <Text style={styles.navText}>Rankings</Text>
// // //               </TouchableOpacity>

// // //               <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabProfile}>
// // //                 <Ionicons name="person-outline" size={21} color={T.inkFaint} />
// // //                 <Text style={styles.navText}>Profile</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           )}
// // //         </View>
// // //       </View>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // export default WordScrambleHomeScreen;

// // // /* ============================================================
// // //    STYLES
// // // ============================================================ */

// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //     backgroundColor: T.bg,
// // //   },

// // //   root: {
// // //     flex: 1,
// // //     flexDirection: "row",
// // //     backgroundColor: "transparent",
// // //   },

// // //   /* board grid */
// // //   gridLineH: {
// // //     position: "absolute",
// // //     left: 0,
// // //     right: 0,
// // //     height: 1,
// // //     backgroundColor: "#CFEADF",
// // //     opacity: 0.7,
// // //   },
// // //   gridLineV: {
// // //     position: "absolute",
// // //     top: 0,
// // //     bottom: 0,
// // //     width: 1,
// // //     backgroundColor: "#CFEADF",
// // //     opacity: 0.7,
// // //   },

// // //   /* SIDEBAR */

// // //   sidebar: {
// // //     width: 292,
// // //     backgroundColor: "rgba(255,255,255,0.88)",
// // //     borderRightWidth: 1.5,
// // //     borderRightColor: T.line,
// // //     paddingHorizontal: 19,
// // //     paddingTop: 22,
// // //     paddingBottom: 18,
// // //     justifyContent: "space-between",
// // //   },

// // //   sidebarTablet: {
// // //     width: 245,
// // //   },

// // //   sidebarBrand: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //   },

// // //   sidebarLogo: {
// // //     width: 58,
// // //     height: 58,
// // //     borderRadius: 14,
// // //     backgroundColor: T.tile,
// // //     borderWidth: 2,
// // //     borderColor: T.tileEdge,
// // //     borderBottomWidth: 5,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     flexDirection: "row",
// // //     marginRight: 11,
// // //   },

// // //   logoW: {
// // //     color: T.teal,
// // //     fontSize: 21,
// // //     fontWeight: "900",
// // //   },

// // //   logoS: {
// // //     color: T.tangerine,
// // //     fontSize: 21,
// // //     fontWeight: "900",
// // //   },

// // //   sidebarBrandTitle: {
// // //     color: T.ink,
// // //     fontSize: 19,
// // //     fontWeight: "900",
// // //   },

// // //   sidebarBrandAccent: {
// // //     color: T.teal,
// // //   },

// // //   sidebarBrandSubtitle: {
// // //     color: T.inkSoft,
// // //     fontSize: 10.5,
// // //     fontWeight: "600",
// // //     marginTop: 2,
// // //   },

// // //   sidebarNavigation: {
// // //     marginTop: 50,
// // //     flex: 1,
// // //   },

// // //   sidebarNavItem: {
// // //     height: 58,
// // //     borderRadius: 15,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     paddingHorizontal: 15,
// // //     marginBottom: 7,
// // //   },

// // //   sidebarNavActive: {
// // //     backgroundColor: T.tealPale,
// // //   },

// // //   sidebarActiveIcon: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 12,
// // //     backgroundColor: T.teal,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginRight: 11,
// // //   },

// // //   sidebarActiveText: {
// // //     color: T.tealDark,
// // //     fontSize: 15,
// // //     fontWeight: "900",
// // //   },

// // //   sidebarText: {
// // //     color: T.inkSoft,
// // //     fontSize: 15,
// // //     fontWeight: "700",
// // //     marginLeft: 16,
// // //   },

// // //   sidebarBottomCard: {
// // //     backgroundColor: T.ink,
// // //     borderRadius: 19,
// // //     padding: 17,
// // //     minHeight: 137,
// // //   },

// // //   sidebarBottomIcon: {
// // //     width: 43,
// // //     height: 43,
// // //     borderRadius: 13,
// // //     backgroundColor: T.tangerine,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginBottom: 11,
// // //   },

// // //   sidebarBottomTitle: {
// // //     color: "#FFFFFF",
// // //     fontSize: 13,
// // //     fontWeight: "900",
// // //   },

// // //   sidebarBottomText: {
// // //     color: "#A9CFCB",
// // //     fontSize: 10.5,
// // //     lineHeight: 17,
// // //     marginTop: 5,
// // //   },

// // //   /* MAIN */

// // //   main: {
// // //     flex: 1,
// // //     minWidth: 0,
// // //     backgroundColor: "transparent",
// // //   },

// // //   mainDesktop: {
// // //     overflow: "hidden",
// // //   },

// // //   /* HEADER */

// // //   mobileHeader: {
// // //     height: 76,
// // //     paddingHorizontal: 17,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //     backgroundColor: "transparent",
// // //   },

// // //   mobileHeaderLeft: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     flex: 1,
// // //   },

// // //   headerBackButton: {
// // //     width: 42,
// // //     height: 42,
// // //     borderRadius: 12,
// // //     backgroundColor: T.white,
// // //     borderWidth: 1.5,
// // //     borderColor: T.line,
// // //     borderBottomWidth: 4,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginRight: 10,
// // //   },

// // //   mobileLogo: {
// // //     width: 45,
// // //     height: 45,
// // //     borderRadius: 12,
// // //     backgroundColor: T.tile,
// // //     borderWidth: 2,
// // //     borderColor: T.tileEdge,
// // //     borderBottomWidth: 4,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     flexDirection: "row",
// // //     marginRight: 10,
// // //   },

// // //   mobileBrandTitle: {
// // //     color: T.ink,
// // //     fontSize: 17,
// // //     fontWeight: "900",
// // //   },

// // //   mobileBrandAccent: {
// // //     color: T.teal,
// // //   },

// // //   mobileBrandSubtitle: {
// // //     color: T.inkSoft,
// // //     fontSize: 9.5,
// // //     marginTop: 2,
// // //     fontWeight: "600",
// // //   },

// // //   mobileNotification: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 12,
// // //     backgroundColor: T.white,
// // //     borderWidth: 1.5,
// // //     borderColor: T.line,
// // //     borderBottomWidth: 4,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },

// // //   desktopTopHeader: {
// // //     height: 76,
// // //     paddingHorizontal: 34,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //   },

// // //   desktopHeaderLeft: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //   },

// // //   desktopWelcome: {
// // //     color: T.ink,
// // //     fontSize: 16,
// // //     fontWeight: "900",
// // //   },

// // //   desktopWelcomeSub: {
// // //     color: T.inkSoft,
// // //     fontSize: 11,
// // //     marginTop: 3,
// // //   },

// // //   desktopNotification: {
// // //     width: 44,
// // //     height: 44,
// // //     borderRadius: 13,
// // //     backgroundColor: T.white,
// // //     borderWidth: 1.5,
// // //     borderColor: T.line,
// // //     borderBottomWidth: 4,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },

// // //   /* SCROLL */

// // //   scrollContent: {
// // //     paddingHorizontal: 34,
// // //     paddingTop: 15,
// // //   },

// // //   scrollContentTablet: {
// // //     paddingHorizontal: 25,
// // //   },

// // //   scrollContentMobile: {
// // //     paddingHorizontal: 17,
// // //     paddingTop: 5,
// // //   },

// // //   /* HERO */

// // //   heroSection: {
// // //     marginTop: 7,
// // //   },

// // //   heroMobile: {
// // //     marginTop: 5,
// // //   },

// // //   heroPill: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     alignSelf: "flex-start",
// // //     backgroundColor: T.tangerinePale,
// // //     borderRadius: 999,
// // //     paddingVertical: 4,
// // //     paddingHorizontal: 10,
// // //     marginBottom: 10,
// // //     gap: 4,
// // //   },

// // //   smallGreeting: {
// // //     color: T.tangerineDark,
// // //     fontSize: 12,
// // //     fontWeight: "800",
// // //   },

// // //   heroTitle: {
// // //     color: T.ink,
// // //     fontSize: 45,
// // //     lineHeight: 48,
// // //     fontWeight: "900",
// // //     letterSpacing: -1.2,
// // //   },

// // //   heroTitleMobile: {
// // //     fontSize: 37,
// // //     lineHeight: 40,
// // //     letterSpacing: -1,
// // //   },

// // //   heroAccent: {
// // //     color: T.teal,
// // //   },

// // //   heroDescription: {
// // //     color: T.inkSoft,
// // //     fontSize: 13.5,
// // //     lineHeight: 20,
// // //     marginTop: 10,
// // //     maxWidth: 390,
// // //   },

// // //   heroDescriptionMobile: {
// // //     fontSize: 12.5,
// // //     lineHeight: 18,
// // //     maxWidth: 310,
// // //   },

// // //   /* SHUFFLING TILES */

// // //   lettersContainer: {
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginTop: 26,
// // //     marginBottom: 25,
// // //     paddingTop: 18, // room for the hop
// // //   },

// // //   lettersMobile: {
// // //     marginTop: 22,
// // //     marginBottom: 20,
// // //   },

// // //   scrambleBox: {
// // //     width: TILE * 4 + TILE_GAP * 3,
// // //     height: TILE,
// // //   },

// // //   heroTile: {
// // //     position: "absolute",
// // //     left: 0,
// // //     top: 0,
// // //     width: TILE,
// // //     height: TILE,
// // //     borderRadius: 13,
// // //     backgroundColor: T.tile,
// // //     borderWidth: 2,
// // //     borderColor: T.tileEdge,
// // //     borderBottomWidth: 6,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },

// // //   heroTileChar: {
// // //     fontSize: 27,
// // //     fontWeight: "900",
// // //   },

// // //   heroTilePts: {
// // //     position: "absolute",
// // //     right: 6,
// // //     bottom: 3,
// // //     fontSize: 9,
// // //     fontWeight: "800",
// // //     color: T.inkSoft,
// // //   },

// // //   /* CHOOSE YOUR MODE */

// // //   modeCard: {
// // //     backgroundColor: T.card,
// // //     borderRadius: 24,
// // //     padding: 14,
// // //     borderWidth: 1.5,
// // //     borderColor: T.line,
// // //     borderBottomWidth: 5,
// // //     alignSelf: "stretch",
// // //   },

// // //   modeCardMobile: {
// // //     padding: 12,
// // //     borderRadius: 22,
// // //   },

// // //   modeHeader: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     marginBottom: 14,
// // //   },

// // //   modeHeaderIcon: {
// // //     width: 50,
// // //     height: 50,
// // //     borderRadius: 14,
// // //     backgroundColor: T.teal,
// // //     borderBottomWidth: 4,
// // //     borderBottomColor: T.tealDark,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginRight: 12,
// // //   },

// // //   modeHeaderInfo: {
// // //     flex: 1,
// // //     minWidth: 0,
// // //   },

// // //   modeHeaderTitle: {
// // //     color: T.ink,
// // //     fontSize: 16,
// // //     fontWeight: "900",
// // //   },

// // //   modeHeaderText: {
// // //     color: T.inkSoft,
// // //     fontSize: 11.5,
// // //     marginTop: 3,
// // //   },

// // //   modeRow: {
// // //     flexDirection: "row",
// // //     gap: 10,
// // //   },

// // //   modeBox: {
// // //     flex: 1,
// // //     minWidth: 0,
// // //     borderRadius: 18,
// // //     padding: 10,
// // //     alignItems: "center",
// // //     borderWidth: 1.5,
// // //   },

// // //   modeBoxSingle: {
// // //     backgroundColor: T.tealPale,
// // //     borderColor: "#B5E6D8",
// // //   },

// // //   modeBoxMulti: {
// // //     backgroundColor: T.tangerinePale,
// // //     borderColor: "#FFD2B3",
// // //   },

// // //   modeIconWrap: {
// // //     height: 56,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginTop: 4,
// // //     marginBottom: 6,
// // //   },

// // //   modeIconCircle: {
// // //     width: 50,
// // //     height: 50,
// // //     borderRadius: 25,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },

// // //   singleCircle: {
// // //     backgroundColor: T.teal,
// // //   },

// // //   multiIcons: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 4,
// // //   },

// // //   multiPerson: {
// // //     width: 38,
// // //     height: 38,
// // //     borderRadius: 19,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },

// // //   multiPersonTeal: {
// // //     backgroundColor: T.teal,
// // //   },

// // //   multiPersonOrange: {
// // //     backgroundColor: T.tangerine,
// // //   },

// // //   modeTitle: {
// // //     color: T.ink,
// // //     fontSize: 15,
// // //     fontWeight: "900",
// // //     textAlign: "center",
// // //   },

// // //   modeText: {
// // //     color: T.inkSoft,
// // //     fontSize: 11,
// // //     lineHeight: 16,
// // //     textAlign: "center",
// // //     marginTop: 5,
// // //     marginBottom: 12,
// // //     minHeight: 32,
// // //   },

// // //   modeButtonWrap: {
// // //     alignSelf: "stretch",
// // //   },

// // //   modeButton: {
// // //     height: 44,
// // //     alignSelf: "stretch",
// // //     borderRadius: 14,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     gap: 6,
// // //     borderBottomWidth: 4,
// // //   },

// // //   singleButton: {
// // //     backgroundColor: T.teal,
// // //     borderBottomColor: T.tealDark,
// // //   },

// // //   multiButton: {
// // //     backgroundColor: T.tangerine,
// // //     borderBottomColor: T.tangerineDark,
// // //   },

// // //   modeButtonText: {
// // //     color: "#FFFFFF",
// // //     fontSize: 13,
// // //     fontWeight: "900",
// // //   },

// // //   /* SECTIONS */

// // //   sectionTitle: {
// // //     color: T.ink,
// // //     fontSize: 17,
// // //     fontWeight: "900",
// // //   },

// // //   sectionSubtitle: {
// // //     color: T.inkSoft,
// // //     fontSize: 11,
// // //     marginTop: 3,
// // //   },

// // //   /* CHALLENGE */

// // //   challengeCard: {
// // //     marginTop: 22,
// // //     borderRadius: 18,
// // //     backgroundColor: T.ink,
// // //     padding: 15,
// // //   },

// // //   challengeCardMobile: {
// // //     marginTop: 18,
// // //     padding: 14,
// // //   },

// // //   challengeTop: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //   },

// // //   challengeLeft: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     flex: 1,
// // //     minWidth: 0,
// // //   },

// // //   challengeIcon: {
// // //     width: 42,
// // //     height: 42,
// // //     borderRadius: 13,
// // //     backgroundColor: T.lemon,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginRight: 11,
// // //   },

// // //   challengeInfo: {
// // //     flex: 1,
// // //     minWidth: 0,
// // //   },

// // //   challengeTitle: {
// // //     color: "#FFFFFF",
// // //     fontSize: 13,
// // //     fontWeight: "900",
// // //   },

// // //   challengeText: {
// // //     color: "#A9CFCB",
// // //     fontSize: 10.5,
// // //     marginTop: 3,
// // //   },

// // //   challengeProgress: {
// // //     alignItems: "flex-end",
// // //     marginLeft: 10,
// // //   },

// // //   progressNumber: {
// // //     color: T.lemon,
// // //     fontSize: 17,
// // //     fontWeight: "900",
// // //   },

// // //   progressText: {
// // //     color: "#7FB0AB",
// // //     fontSize: 9,
// // //     marginTop: 1,
// // //   },

// // //   progressTrack: {
// // //     height: 8,
// // //     borderRadius: 4,
// // //     backgroundColor: "rgba(255,255,255,0.14)",
// // //     marginTop: 14,
// // //     overflow: "hidden",
// // //   },

// // //   progressFill: {
// // //     height: 8,
// // //     borderRadius: 4,
// // //     backgroundColor: T.lemon,
// // //   },

// // //   /* LEADERBOARD */

// // //   leaderHeader: {
// // //     marginTop: 27,
// // //     marginBottom: 12,
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //   },

// // //   viewAll: {
// // //     color: T.tealDark,
// // //     fontSize: 12,
// // //     fontWeight: "800",
// // //   },

// // //   leaderboardCard: {
// // //     backgroundColor: T.card,
// // //     borderRadius: 19,
// // //     borderWidth: 1.5,
// // //     borderColor: T.line,
// // //     borderBottomWidth: 5,
// // //     paddingHorizontal: 13,
// // //     overflow: "hidden",
// // //   },

// // //   playerRow: {
// // //     minHeight: 64,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: "#E4F3EE",
// // //   },

// // //   lastPlayerRow: {
// // //     borderBottomWidth: 0,
// // //   },

// // //   rankCircle: {
// // //     width: 27,
// // //     height: 27,
// // //     borderRadius: 8,
// // //     backgroundColor: "#EAF1EF",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginRight: 9,
// // //   },

// // //   rankFirst: {
// // //     backgroundColor: "#FFEFA6",
// // //   },

// // //   rankSecond: {
// // //     backgroundColor: "#E3E9E8",
// // //   },

// // //   rankThird: {
// // //     backgroundColor: "#FFD9BE",
// // //   },

// // //   rankText: {
// // //     color: T.ink,
// // //     fontSize: 11,
// // //     fontWeight: "900",
// // //   },

// // //   playerAvatar: {
// // //     width: 37,
// // //     height: 37,
// // //     borderRadius: 13,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginRight: 10,
// // //   },

// // //   playerInfo: {
// // //     flex: 1,
// // //     minWidth: 0,
// // //   },

// // //   playerName: {
// // //     color: T.ink,
// // //     fontSize: 13,
// // //     fontWeight: "800",
// // //   },

// // //   topPlayerLabel: {
// // //     color: T.tangerineDark,
// // //     fontSize: 10,
// // //     fontWeight: "800",
// // //     marginTop: 2,
// // //   },

// // //   scoreContainer: {
// // //     alignItems: "flex-end",
// // //     marginLeft: 8,
// // //   },

// // //   scoreNumber: {
// // //     color: T.ink,
// // //     fontSize: 14,
// // //     fontWeight: "900",
// // //   },

// // //   scoreLabel: {
// // //     color: T.inkFaint,
// // //     fontSize: 9,
// // //     fontWeight: "800",
// // //     marginTop: 1,
// // //   },

// // //   emptyLeaderboard: {
// // //     height: 110,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },

// // //   emptyText: {
// // //     color: T.inkSoft,
// // //     fontSize: 11,
// // //     marginTop: 7,
// // //   },

// // //   /* BOTTOM NAV */

// // //   bottomNav: {
// // //     height: 70,
// // //     backgroundColor: T.white,
// // //     borderTopWidth: 1.5,
// // //     borderTopColor: T.line,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-around",
// // //     paddingBottom: 4,
// // //   },

// // //   navItem: {
// // //     flex: 1,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },

// // //   activeNavIcon: {
// // //     width: 37,
// // //     height: 32,
// // //     borderRadius: 11,
// // //     backgroundColor: T.teal,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },

// // //   activeNavText: {
// // //     color: T.tealDark,
// // //     fontSize: 9.5,
// // //     fontWeight: "900",
// // //     marginTop: 3,
// // //   },

// // //   navText: {
// // //     color: T.inkFaint,
// // //     fontSize: 9.5,
// // //     fontWeight: "700",
// // //     marginTop: 4,
// // //   },
// // // });

// // import React, { useEffect, useRef } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Pressable,
// //   ScrollView,
// //   SafeAreaView,
// //   StatusBar,
// //   useWindowDimensions,
// //   Animated,
// //   Easing,
// //   StyleProp,
// //   ViewStyle,
// // } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";

// // export interface TopPlayer {
// //   rank: number;
// //   name: string;
// //   score: number;
// //   avatarColor: string;
// // }

// // interface WordScrambleHomeScreenProps {
// //   topPlayers: TopPlayer[];

// //   onPlayOnline: () => void;
// //   onViewAllPlayers: () => void;

// //   // no longer used on this screen (kept optional so App.tsx still compiles)
// //   onCreateRoom?: () => void;
// //   onJoinRoom?: (code: string) => void;

// //   onGuestPlay?: () => void;

// //   /**
// //    * Parent must pass this function.
// //    * Navigates from Word Scramble Home back to the Cyber Mind main menu.
// //    */
// //   onBack: () => void;

// //   onTabHome: () => void;
// //   onTabLeaderboard: () => void;
// //   onTabProfile: () => void;
// // }

// // /* ============================================================
// //    THEME  (mint paper + deep teal ink + tangerine, scrabble tiles)
// // ============================================================ */

// // const T = {
// //   bg: "#EAF8F2",
// //   bgDeep: "#D6F1E7",
// //   ink: "#0F3D3E",
// //   inkSoft: "#4F7476",
// //   inkFaint: "#8FB0AE",
// //   teal: "#14A38B",
// //   tealDark: "#0C7F6B",
// //   tealPale: "#D2F2E8",
// //   tangerine: "#FF8A3D",
// //   tangerineDark: "#DB6A1C",
// //   tangerinePale: "#FFE8D6",
// //   lemon: "#FFD84D",
// //   tile: "#FFF6DF",
// //   tileEdge: "#E2CD9C",
// //   card: "#FFFFFF",
// //   line: "#CBE8DE",
// //   white: "#FFFFFF",
// // };

// // /* ============================================================
// //    SMALL ANIMATION HELPERS
// // ============================================================ */

// // /** Endless idle motion: bob (up/down), pulse (scale) or sway (rotate). */
// // const Idle: React.FC<{
// //   children: React.ReactNode;
// //   style?: StyleProp<ViewStyle>;
// //   kind?: "bob" | "pulse" | "sway";
// //   duration?: number;
// //   delay?: number;
// //   amount?: number;
// // }> = ({ children, style, kind = "bob", duration = 1800, delay = 0, amount = 6 }) => {
// //   const v = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     const loop = Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(v, {
// //           toValue: 1,
// //           duration,
// //           delay,
// //           easing: Easing.inOut(Easing.quad),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(v, {
// //           toValue: 0,
// //           duration,
// //           easing: Easing.inOut(Easing.quad),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     );
// //     loop.start();
// //     return () => loop.stop();
// //   }, [v, duration, delay]);

// //   let transform: any[] = [];
// //   if (kind === "bob") {
// //     transform = [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -amount] }) }];
// //   } else if (kind === "pulse") {
// //     transform = [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1 + amount / 50] }) }];
// //   } else {
// //     transform = [
// //       {
// //         rotate: v.interpolate({
// //           inputRange: [0, 1],
// //           outputRange: [`${-amount}deg`, `${amount}deg`],
// //         }),
// //       },
// //     ];
// //   }

// //   return <Animated.View style={[style, { transform }]}>{children}</Animated.View>;
// // };

// // /** Press feedback: squishes down then springs back. */
// // const PressScale: React.FC<{
// //   children: React.ReactNode;
// //   onPress?: () => void;
// //   style?: StyleProp<ViewStyle>;
// //   accessibilityLabel?: string;
// // }> = ({ children, onPress, style, accessibilityLabel }) => {
// //   const s = useRef(new Animated.Value(1)).current;

// //   return (
// //     <Animated.View style={[{ transform: [{ scale: s }] }, style]}>
// //       <Pressable
// //         onPress={onPress}
// //         accessibilityRole="button"
// //         accessibilityLabel={accessibilityLabel}
// //         onPressIn={() =>
// //           Animated.spring(s, { toValue: 0.94, friction: 8, tension: 220, useNativeDriver: true }).start()
// //         }
// //         onPressOut={() =>
// //           Animated.spring(s, { toValue: 1, friction: 3, tension: 140, useNativeDriver: true }).start()
// //         }
// //       >
// //         {children}
// //       </Pressable>
// //     </Animated.View>
// //   );
// // };

// // /** Bell that rings every few seconds. */
// // const BellRing: React.FC<{ size?: number }> = ({ size = 20 }) => {
// //   const r = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     const loop = Animated.loop(
// //       Animated.sequence([
// //         Animated.delay(3200),
// //         Animated.timing(r, { toValue: 1, duration: 90, useNativeDriver: true }),
// //         Animated.timing(r, { toValue: -1, duration: 130, useNativeDriver: true }),
// //         Animated.timing(r, { toValue: 1, duration: 130, useNativeDriver: true }),
// //         Animated.timing(r, { toValue: -1, duration: 130, useNativeDriver: true }),
// //         Animated.timing(r, { toValue: 0, duration: 90, useNativeDriver: true }),
// //       ])
// //     );
// //     loop.start();
// //     return () => loop.stop();
// //   }, [r]);

// //   const rotate = r.interpolate({ inputRange: [-1, 1], outputRange: ["-16deg", "16deg"] });

// //   return (
// //     <Animated.View style={{ transform: [{ rotate }] }}>
// //       <Ionicons name="notifications-outline" size={size} color={T.ink} />
// //     </Animated.View>
// //   );
// // };

// // /* ============================================================
// //    HERO: tiles that shuffle themselves, then snap into WORD
// // ============================================================ */

// // const HERO_TILES = [
// //   { char: "W", pts: 4, color: T.teal },
// //   { char: "O", pts: 1, color: T.tangerine },
// //   { char: "R", pts: 1, color: T.ink },
// //   { char: "D", pts: 2, color: T.teal },
// // ];
// // // slot index each tile (W,O,R,D) sits in, per step. First = solved.
// // const HERO_ORDERS = [
// //   [0, 1, 2, 3],
// //   [2, 0, 3, 1],
// //   [1, 3, 0, 2],
// //   [3, 2, 1, 0],
// //   [2, 3, 1, 0],
// // ];
// // const TILE = 56;
// // const TILE_GAP = 10;
// // const STRIDE = TILE + TILE_GAP;

// // const ScrambleTiles: React.FC = () => {
// //   const xs = useRef(HERO_TILES.map((_, i) => new Animated.Value(i * STRIDE))).current;
// //   const pop = useRef(new Animated.Value(0)).current;
// //   const hop = useRef(HERO_TILES.map(() => new Animated.Value(0))).current;

// //   useEffect(() => {
// //     let alive = true;
// //     let timer: ReturnType<typeof setTimeout>;
// //     let step = 0;

// //     const apply = (order: number[]) => {
// //       Animated.stagger(
// //         70,
// //         xs.map((x, i) =>
// //           Animated.parallel([
// //             Animated.spring(x, {
// //               toValue: order[i] * STRIDE,
// //               friction: 6,
// //               tension: 90,
// //               useNativeDriver: true,
// //             }),
// //             Animated.sequence([
// //               Animated.timing(hop[i], { toValue: 1, duration: 140, useNativeDriver: true }),
// //               Animated.timing(hop[i], { toValue: 0, duration: 220, useNativeDriver: true }),
// //             ]),
// //           ])
// //         )
// //       ).start();
// //     };

// //     const tick = () => {
// //       if (!alive) return;
// //       step = (step + 1) % HERO_ORDERS.length;
// //       apply(HERO_ORDERS[step]);

// //       if (step === 0) {
// //         // solved: celebrate, then hold
// //         timer = setTimeout(() => {
// //           Animated.sequence([
// //             Animated.timing(pop, { toValue: 1, duration: 160, useNativeDriver: true }),
// //             Animated.spring(pop, { toValue: 0, friction: 3, tension: 120, useNativeDriver: true }),
// //           ]).start();
// //         }, 520);
// //         timer = setTimeout(tick, 3000);
// //       } else {
// //         timer = setTimeout(tick, step === 1 ? 900 : 750);
// //       }
// //     };

// //     timer = setTimeout(tick, 1600);

// //     return () => {
// //       alive = false;
// //       clearTimeout(timer);
// //     };
// //   }, [xs, hop, pop]);

// //   const popScale = pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });

// //   return (
// //     <View style={styles.scrambleBox}>
// //       {HERO_TILES.map((t, i) => {
// //         const lift = hop[i].interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
// //         return (
// //           <Animated.View
// //             key={t.char}
// //             style={[
// //               styles.heroTile,
// //               { transform: [{ translateX: xs[i] }, { translateY: lift }, { scale: popScale }] },
// //             ]}
// //           >
// //             <Text style={[styles.heroTileChar, { color: t.color }]}>{t.char}</Text>
// //             <Text style={styles.heroTilePts}>{t.pts}</Text>
// //           </Animated.View>
// //         );
// //       })}
// //     </View>
// //   );
// // };

// // /* ============================================================
// //    LEADERBOARD ROW (slides in)
// // ============================================================ */

// // const PlayerRow: React.FC<{ player: TopPlayer; index: number; last: boolean }> = ({
// //   player,
// //   index,
// //   last,
// // }) => {
// //   const v = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     Animated.timing(v, {
// //       toValue: 1,
// //       duration: 480,
// //       delay: 900 + index * 130,
// //       easing: Easing.out(Easing.cubic),
// //       useNativeDriver: true,
// //     }).start();
// //   }, [v, index]);

// //   return (
// //     <Animated.View
// //       style={[
// //         styles.playerRow,
// //         last && styles.lastPlayerRow,
// //         {
// //           opacity: v,
// //           transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [46, 0] }) }],
// //         },
// //       ]}
// //     >
// //       <View
// //         style={[
// //           styles.rankCircle,
// //           player.rank === 1 && styles.rankFirst,
// //           player.rank === 2 && styles.rankSecond,
// //           player.rank === 3 && styles.rankThird,
// //         ]}
// //       >
// //         <Text style={styles.rankText}>{player.rank}</Text>
// //       </View>

// //       <View style={[styles.playerAvatar, { backgroundColor: player.avatarColor || T.teal }]}>
// //         <Ionicons name="person" size={17} color="#FFFFFF" />
// //       </View>

// //       <View style={styles.playerInfo}>
// //         <Text style={styles.playerName}>{player.name}</Text>
// //         {player.rank === 1 && <Text style={styles.topPlayerLabel}>Top player</Text>}
// //       </View>

// //       <View style={styles.scoreContainer}>
// //         <Text style={styles.scoreNumber}>{player.score}</Text>
// //         <Text style={styles.scoreLabel}>pts</Text>
// //       </View>
// //     </Animated.View>
// //   );
// // };

// // /* ============================================================
// //    MAIN SCREEN
// // ============================================================ */

// // const WordScrambleHomeScreen: React.FC<WordScrambleHomeScreenProps> = ({
// //   topPlayers,
// //   onPlayOnline,
// //   onViewAllPlayers,
// //   onGuestPlay,
// //   onBack,
// //   onTabHome,
// //   onTabLeaderboard,
// //   onTabProfile,
// // }) => {
// //   const { width } = useWindowDimensions();

// //   const isMobile = width < 768;
// //   const isTablet = width >= 768 && width < 1100;

// //   // staggered entrance for the 5 content blocks
// //   const enters = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
// //   const progress = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     Animated.stagger(
// //       120,
// //       enters.map((e) =>
// //         Animated.timing(e, {
// //           toValue: 1,
// //           duration: 520,
// //           easing: Easing.out(Easing.cubic),
// //           useNativeDriver: true,
// //         })
// //       )
// //     ).start();

// //     Animated.timing(progress, {
// //       toValue: 0.6, // 3 / 5 rounds
// //       duration: 1100,
// //       delay: 900,
// //       easing: Easing.out(Easing.cubic),
// //       useNativeDriver: false,
// //     }).start();
// //   }, [enters, progress]);

// //   const rise = (i: number) => ({
// //     opacity: enters[i],
// //     transform: [
// //       { translateY: enters[i].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
// //     ],
// //   });

// //   // Single Player -> guest nickname flow (falls back to online flow)
// //   const handleSinglePlayer = () => {
// //     if (onGuestPlay) {
// //       onGuestPlay();
// //     } else {
// //       onPlayOnline();
// //     }
// //   };

// //   // Multiplayer -> online flow
// //   const handleMultiplayer = () => {
// //     onPlayOnline();
// //   };

// //   const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

// //       <View style={styles.root}>
// //         {/* ==================================================
// //             SIDEBAR
// //         ================================================== */}

// //         {!isMobile && (
// //           <View style={[styles.sidebar, isTablet && styles.sidebarTablet]}>
// //             <View style={styles.sidebarBrand}>
// //               <View style={styles.sidebarLogo}>
// //                 <Text style={styles.logoW}>W</Text>
// //                 <Text style={styles.logoS}>S</Text>
// //               </View>

// //               <View>
// //                 <Text style={styles.sidebarBrandTitle}>
// //                   Word
// //                   <Text style={styles.sidebarBrandAccent}> Scramble</Text>
// //                 </Text>
// //                 <Text style={styles.sidebarBrandSubtitle}>Think fast. Play smart.</Text>
// //               </View>
// //             </View>

// //             <View style={styles.sidebarNavigation}>
// //               <TouchableOpacity
// //                 style={[styles.sidebarNavItem, styles.sidebarNavActive]}
// //                 onPress={onTabHome}
// //                 activeOpacity={0.8}
// //               >
// //                 <View style={styles.sidebarActiveIcon}>
// //                   <Ionicons name="home" size={21} color="#FFFFFF" />
// //                 </View>
// //                 <Text style={styles.sidebarActiveText}>Home</Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity style={styles.sidebarNavItem} onPress={onTabLeaderboard} activeOpacity={0.8}>
// //                 <Ionicons name="trophy-outline" size={22} color={T.inkSoft} />
// //                 <Text style={styles.sidebarText}>Rankings</Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity style={styles.sidebarNavItem} onPress={onTabProfile} activeOpacity={0.8}>
// //                 <Ionicons name="person-outline" size={22} color={T.inkSoft} />
// //                 <Text style={styles.sidebarText}>Profile</Text>
// //               </TouchableOpacity>
// //             </View>

// //             <View style={styles.sidebarBottomCard}>
// //               <Idle kind="sway" amount={8} duration={1400} style={styles.sidebarBottomIcon}>
// //                 <Ionicons name="sparkles" size={21} color="#FFFFFF" />
// //               </Idle>
// //               <Text style={styles.sidebarBottomTitle}>Ready for a challenge?</Text>
// //               <Text style={styles.sidebarBottomText}>
// //                 Unscramble words and climb the rankings.
// //               </Text>
// //             </View>
// //           </View>
// //         )}

// //         {/* ==================================================
// //             MAIN
// //         ================================================== */}

// //         <View style={[styles.main, !isMobile && styles.mainDesktop]}>
// //           {/* MOBILE HEADER */}

// //           {isMobile && (
// //             <View style={styles.mobileHeader}>
// //               <View style={styles.mobileHeaderLeft}>
// //                 <TouchableOpacity
// //                   style={styles.headerBackButton}
// //                   activeOpacity={0.75}
// //                   onPress={onBack}
// //                   accessibilityRole="button"
// //                   accessibilityLabel="Go back"
// //                 >
// //                   <Ionicons name="arrow-back" size={22} color={T.ink} />
// //                 </TouchableOpacity>

// //                 <View style={styles.mobileLogo}>
// //                   <Text style={styles.logoW}>W</Text>
// //                   <Text style={styles.logoS}>S</Text>
// //                 </View>

// //                 <View>
// //                   <Text style={styles.mobileBrandTitle}>
// //                     Word
// //                     <Text style={styles.mobileBrandAccent}> Scramble</Text>
// //                   </Text>
// //                   <Text style={styles.mobileBrandSubtitle}>Think fast. Play smart.</Text>
// //                 </View>
// //               </View>

// //               <TouchableOpacity style={styles.mobileNotification} activeOpacity={0.8}>
// //                 <BellRing />
// //               </TouchableOpacity>
// //             </View>
// //           )}

// //           {/* DESKTOP HEADER */}

// //           {!isMobile && (
// //             <View style={styles.desktopTopHeader}>
// //               <View style={styles.desktopHeaderLeft}>
// //                 <TouchableOpacity
// //                   style={styles.headerBackButton}
// //                   activeOpacity={0.75}
// //                   onPress={onBack}
// //                   accessibilityRole="button"
// //                   accessibilityLabel="Go back"
// //                 >
// //                   <Ionicons name="arrow-back" size={21} color={T.ink} />
// //                 </TouchableOpacity>

// //                 <View>
// //                   <Text style={styles.desktopWelcome}>Welcome back!</Text>
// //                   <Text style={styles.desktopWelcomeSub}>Ready to play?</Text>
// //                 </View>
// //               </View>

// //               <TouchableOpacity style={styles.desktopNotification}>
// //                 <BellRing />
// //               </TouchableOpacity>
// //             </View>
// //           )}

// //           {/* CONTENT */}

// //           <ScrollView
// //             showsVerticalScrollIndicator={false}
// //             contentContainerStyle={[
// //               styles.scrollContent,
// //               isMobile && styles.scrollContentMobile,
// //               isTablet && styles.scrollContentTablet,
// //             ]}
// //           >
// //             {/* HERO */}

// //             <Animated.View style={[styles.heroSection, isMobile && styles.heroMobile, rise(0)]}>
// //               <View style={styles.heroPill}>
// //                 <Ionicons name="flash" size={12} color={T.tangerineDark} />
// //                 <Text style={styles.smallGreeting}>Ready to play?</Text>
// //               </View>

// //               <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
// //                 Unscramble.
// //                 {"\n"}
// //                 <Text style={styles.heroAccent}>Outsmart.</Text>
// //               </Text>

// //               <Text style={[styles.heroDescription, isMobile && styles.heroDescriptionMobile]}>
// //                 Arrange the letters, find the hidden word, and race against your friends.
// //               </Text>
// //             </Animated.View>

// //             {/* SHUFFLING TILES */}

// //             <Animated.View style={[styles.lettersContainer, isMobile && styles.lettersMobile, rise(1)]}>
// //               <ScrambleTiles />
// //             </Animated.View>

// //             {/* CHOOSE YOUR MODE */}

// //             <Animated.View style={[styles.modeCard, isMobile && styles.modeCardMobile, rise(2)]}>
// //               <View style={styles.modeHeader}>
// //                 <View style={styles.modeHeaderIcon}>
// //                   <Ionicons name="game-controller" size={26} color="#FFFFFF" />
// //                 </View>

// //                 <View style={styles.modeHeaderInfo}>
// //                   <Text style={styles.modeHeaderTitle}>Choose your mode</Text>
// //                   <Text style={styles.modeHeaderText}>Play your way and enjoy the game!</Text>
// //                 </View>
// //               </View>

// //               <View style={styles.modeRow}>
// //                 {/* SINGLE PLAYER */}

// //                 <View style={[styles.modeBox, styles.modeBoxSingle]}>
// //                   <View style={styles.modeIconWrap}>
// //                     <Idle kind="pulse" amount={7} duration={1200}>
// //                       <View style={[styles.modeIconCircle, styles.singleCircle]}>
// //                         <Ionicons name="person" size={26} color="#FFFFFF" />
// //                       </View>
// //                     </Idle>
// //                   </View>

// //                   <Text style={styles.modeTitle}>Single Player</Text>
// //                   <Text style={styles.modeText}>Challenge yourself and improve your skills.</Text>

// //                   <PressScale
// //                     onPress={handleSinglePlayer}
// //                     style={styles.modeButtonWrap}
// //                     accessibilityLabel="Play single player"
// //                   >
// //                     <View style={[styles.modeButton, styles.singleButton]}>
// //                       <Text style={styles.modeButtonText}>Play now</Text>
// //                       <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
// //                     </View>
// //                   </PressScale>
// //                 </View>

// //                 {/* MULTIPLAYER */}

// //                 <View style={[styles.modeBox, styles.modeBoxMulti]}>
// //                   <View style={styles.modeIconWrap}>
// //                     <View style={styles.multiIcons}>
// //                       <Idle kind="bob" amount={5} duration={900}>
// //                         <View style={[styles.multiPerson, styles.multiPersonTeal]}>
// //                           <Ionicons name="person" size={18} color="#FFFFFF" />
// //                         </View>
// //                       </Idle>
// //                       <Idle kind="bob" amount={5} duration={900} delay={450}>
// //                         <View style={[styles.multiPerson, styles.multiPersonOrange]}>
// //                           <Ionicons name="person" size={18} color="#FFFFFF" />
// //                         </View>
// //                       </Idle>
// //                     </View>
// //                   </View>

// //                   <Text style={styles.modeTitle}>Multiplayer</Text>
// //                   <Text style={styles.modeText}>Play with your friends and compete together.</Text>

// //                   <PressScale
// //                     onPress={handleMultiplayer}
// //                     style={styles.modeButtonWrap}
// //                     accessibilityLabel="Play multiplayer"
// //                   >
// //                     <View style={[styles.modeButton, styles.multiButton]}>
// //                       <Text style={styles.modeButtonText}>Play now</Text>
// //                       <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
// //                     </View>
// //                   </PressScale>
// //                 </View>
// //               </View>
// //             </Animated.View>

// //             {/* DAILY CHALLENGE */}

// //             <Animated.View style={[styles.challengeCard, isMobile && styles.challengeCardMobile, rise(3)]}>
// //               <View style={styles.challengeTop}>
// //                 <View style={styles.challengeLeft}>
// //                   <Idle kind="sway" amount={9} duration={1300} style={styles.challengeIcon}>
// //                     <Ionicons name="trophy" size={22} color={T.ink} />
// //                   </Idle>

// //                   <View style={styles.challengeInfo}>
// //                     <Text style={styles.challengeTitle}>Daily challenge</Text>
// //                     <Text style={styles.challengeText}>Solve today's puzzle</Text>
// //                   </View>
// //                 </View>

// //                 <View style={styles.challengeProgress}>
// //                   <Text style={styles.progressNumber}>3/5</Text>
// //                   <Text style={styles.progressText}>rounds</Text>
// //                 </View>
// //               </View>

// //               <View style={styles.progressTrack}>
// //                 <Animated.View style={[styles.progressFill, { width: barWidth }]} />
// //               </View>
// //             </Animated.View>

// //             {/* LEADERBOARD */}

// //             <Animated.View style={[styles.leaderHeader, rise(4)]}>
// //               <View>
// //                 <Text style={styles.sectionTitle}>Top players</Text>
// //                 <Text style={styles.sectionSubtitle}>Today's leaderboard</Text>
// //               </View>

// //               <TouchableOpacity activeOpacity={0.7} onPress={onViewAllPlayers}>
// //                 <Text style={styles.viewAll}>View all</Text>
// //               </TouchableOpacity>
// //             </Animated.View>

// //             <Animated.View style={[styles.leaderboardCard, rise(4)]}>
// //               {topPlayers.length === 0 ? (
// //                 <View style={styles.emptyLeaderboard}>
// //                   <Idle kind="bob" amount={6} duration={1100}>
// //                     <Ionicons name="trophy-outline" size={28} color={T.inkFaint} />
// //                   </Idle>
// //                   <Text style={styles.emptyText}>No players yet</Text>
// //                 </View>
// //               ) : (
// //                 topPlayers.map((player, index) => (
// //                   <PlayerRow
// //                     key={`${player.rank}-${player.name}`}
// //                     player={player}
// //                     index={index}
// //                     last={index === topPlayers.length - 1}
// //                   />
// //                 ))
// //               )}
// //             </Animated.View>

// //             <View style={{ height: isMobile ? 90 : 40 }} />
// //           </ScrollView>

// //           {/* MOBILE BOTTOM NAV */}

// //           {isMobile && (
// //             <View style={styles.bottomNav}>
// //               <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabHome}>
// //                 <Idle kind="bob" amount={3} duration={1000} style={styles.activeNavIcon}>
// //                   <Ionicons name="home" size={20} color="#FFFFFF" />
// //                 </Idle>
// //                 <Text style={styles.activeNavText}>Home</Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabLeaderboard}>
// //                 <Ionicons name="trophy-outline" size={21} color={T.inkFaint} />
// //                 <Text style={styles.navText}>Rankings</Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabProfile}>
// //                 <Ionicons name="person-outline" size={21} color={T.inkFaint} />
// //                 <Text style={styles.navText}>Profile</Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //         </View>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // export default WordScrambleHomeScreen;

// // /* ============================================================
// //    STYLES
// // ============================================================ */

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: T.bg,
// //   },

// //   root: {
// //     flex: 1,
// //     flexDirection: "row",
// //     backgroundColor: "transparent",
// //   },

// //   /* SIDEBAR */

// //   sidebar: {
// //     width: 292,
// //     backgroundColor: "rgba(255,255,255,0.88)",
// //     borderRightWidth: 1.5,
// //     borderRightColor: T.line,
// //     paddingHorizontal: 19,
// //     paddingTop: 22,
// //     paddingBottom: 18,
// //     justifyContent: "space-between",
// //   },

// //   sidebarTablet: {
// //     width: 245,
// //   },

// //   sidebarBrand: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   sidebarLogo: {
// //     width: 58,
// //     height: 58,
// //     borderRadius: 14,
// //     backgroundColor: T.tile,
// //     borderWidth: 2,
// //     borderColor: T.tileEdge,
// //     borderBottomWidth: 5,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     flexDirection: "row",
// //     marginRight: 11,
// //   },

// //   logoW: {
// //     color: T.teal,
// //     fontSize: 21,
// //     fontWeight: "900",
// //   },

// //   logoS: {
// //     color: T.tangerine,
// //     fontSize: 21,
// //     fontWeight: "900",
// //   },

// //   sidebarBrandTitle: {
// //     color: T.ink,
// //     fontSize: 19,
// //     fontWeight: "900",
// //   },

// //   sidebarBrandAccent: {
// //     color: T.teal,
// //   },

// //   sidebarBrandSubtitle: {
// //     color: T.inkSoft,
// //     fontSize: 10.5,
// //     fontWeight: "600",
// //     marginTop: 2,
// //   },

// //   sidebarNavigation: {
// //     marginTop: 50,
// //     flex: 1,
// //   },

// //   sidebarNavItem: {
// //     height: 58,
// //     borderRadius: 15,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingHorizontal: 15,
// //     marginBottom: 7,
// //   },

// //   sidebarNavActive: {
// //     backgroundColor: T.tealPale,
// //   },

// //   sidebarActiveIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 12,
// //     backgroundColor: T.teal,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 11,
// //   },

// //   sidebarActiveText: {
// //     color: T.tealDark,
// //     fontSize: 15,
// //     fontWeight: "900",
// //   },

// //   sidebarText: {
// //     color: T.inkSoft,
// //     fontSize: 15,
// //     fontWeight: "700",
// //     marginLeft: 16,
// //   },

// //   sidebarBottomCard: {
// //     backgroundColor: T.ink,
// //     borderRadius: 19,
// //     padding: 17,
// //     minHeight: 137,
// //   },

// //   sidebarBottomIcon: {
// //     width: 43,
// //     height: 43,
// //     borderRadius: 13,
// //     backgroundColor: T.tangerine,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: 11,
// //   },

// //   sidebarBottomTitle: {
// //     color: "#FFFFFF",
// //     fontSize: 13,
// //     fontWeight: "900",
// //   },

// //   sidebarBottomText: {
// //     color: "#A9CFCB",
// //     fontSize: 10.5,
// //     lineHeight: 17,
// //     marginTop: 5,
// //   },

// //   /* MAIN */

// //   main: {
// //     flex: 1,
// //     minWidth: 0,
// //     backgroundColor: "transparent",
// //   },

// //   mainDesktop: {
// //     overflow: "hidden",
// //   },

// //   /* HEADER */

// //   mobileHeader: {
// //     height: 76,
// //     paddingHorizontal: 17,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     backgroundColor: "transparent",
// //   },

// //   mobileHeaderLeft: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     flex: 1,
// //   },

// //   headerBackButton: {
// //     width: 42,
// //     height: 42,
// //     borderRadius: 12,
// //     backgroundColor: T.white,
// //     borderWidth: 1.5,
// //     borderColor: T.line,
// //     borderBottomWidth: 4,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 10,
// //   },

// //   mobileLogo: {
// //     width: 45,
// //     height: 45,
// //     borderRadius: 12,
// //     backgroundColor: T.tile,
// //     borderWidth: 2,
// //     borderColor: T.tileEdge,
// //     borderBottomWidth: 4,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     flexDirection: "row",
// //     marginRight: 10,
// //   },

// //   mobileBrandTitle: {
// //     color: T.ink,
// //     fontSize: 17,
// //     fontWeight: "900",
// //   },

// //   mobileBrandAccent: {
// //     color: T.teal,
// //   },

// //   mobileBrandSubtitle: {
// //     color: T.inkSoft,
// //     fontSize: 9.5,
// //     marginTop: 2,
// //     fontWeight: "600",
// //   },

// //   mobileNotification: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 12,
// //     backgroundColor: T.white,
// //     borderWidth: 1.5,
// //     borderColor: T.line,
// //     borderBottomWidth: 4,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   desktopTopHeader: {
// //     height: 76,
// //     paddingHorizontal: 34,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //   },

// //   desktopHeaderLeft: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   desktopWelcome: {
// //     color: T.ink,
// //     fontSize: 16,
// //     fontWeight: "900",
// //   },

// //   desktopWelcomeSub: {
// //     color: T.inkSoft,
// //     fontSize: 11,
// //     marginTop: 3,
// //   },

// //   desktopNotification: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 13,
// //     backgroundColor: T.white,
// //     borderWidth: 1.5,
// //     borderColor: T.line,
// //     borderBottomWidth: 4,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   /* SCROLL */

// //   scrollContent: {
// //     paddingHorizontal: 34,
// //     paddingTop: 15,
// //   },

// //   scrollContentTablet: {
// //     paddingHorizontal: 25,
// //   },

// //   scrollContentMobile: {
// //     paddingHorizontal: 17,
// //     paddingTop: 5,
// //   },

// //   /* HERO */

// //   heroSection: {
// //     marginTop: 7,
// //   },

// //   heroMobile: {
// //     marginTop: 5,
// //   },

// //   heroPill: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     alignSelf: "flex-start",
// //     backgroundColor: T.tangerinePale,
// //     borderRadius: 999,
// //     paddingVertical: 4,
// //     paddingHorizontal: 10,
// //     marginBottom: 10,
// //     gap: 4,
// //   },

// //   smallGreeting: {
// //     color: T.tangerineDark,
// //     fontSize: 12,
// //     fontWeight: "800",
// //   },

// //   heroTitle: {
// //     color: T.ink,
// //     fontSize: 45,
// //     lineHeight: 48,
// //     fontWeight: "900",
// //     letterSpacing: -1.2,
// //   },

// //   heroTitleMobile: {
// //     fontSize: 37,
// //     lineHeight: 40,
// //     letterSpacing: -1,
// //   },

// //   heroAccent: {
// //     color: T.teal,
// //   },

// //   heroDescription: {
// //     color: T.inkSoft,
// //     fontSize: 13.5,
// //     lineHeight: 20,
// //     marginTop: 10,
// //     maxWidth: 390,
// //   },

// //   heroDescriptionMobile: {
// //     fontSize: 12.5,
// //     lineHeight: 18,
// //     maxWidth: 310,
// //   },

// //   /* SHUFFLING TILES */

// //   lettersContainer: {
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginTop: 26,
// //     marginBottom: 25,
// //     paddingTop: 18, // room for the hop
// //   },

// //   lettersMobile: {
// //     marginTop: 22,
// //     marginBottom: 20,
// //   },

// //   scrambleBox: {
// //     width: TILE * 4 + TILE_GAP * 3,
// //     height: TILE,
// //   },

// //   heroTile: {
// //     position: "absolute",
// //     left: 0,
// //     top: 0,
// //     width: TILE,
// //     height: TILE,
// //     borderRadius: 13,
// //     backgroundColor: T.tile,
// //     borderWidth: 2,
// //     borderColor: T.tileEdge,
// //     borderBottomWidth: 6,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   heroTileChar: {
// //     fontSize: 27,
// //     fontWeight: "900",
// //   },

// //   heroTilePts: {
// //     position: "absolute",
// //     right: 6,
// //     bottom: 3,
// //     fontSize: 9,
// //     fontWeight: "800",
// //     color: T.inkSoft,
// //   },

// //   /* CHOOSE YOUR MODE */

// //   modeCard: {
// //     backgroundColor: T.card,
// //     borderRadius: 24,
// //     padding: 14,
// //     borderWidth: 1.5,
// //     borderColor: T.line,
// //     borderBottomWidth: 5,
// //     alignSelf: "stretch",
// //   },

// //   modeCardMobile: {
// //     padding: 12,
// //     borderRadius: 22,
// //   },

// //   modeHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 14,
// //   },

// //   modeHeaderIcon: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 14,
// //     backgroundColor: T.teal,
// //     borderBottomWidth: 4,
// //     borderBottomColor: T.tealDark,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 12,
// //   },

// //   modeHeaderInfo: {
// //     flex: 1,
// //     minWidth: 0,
// //   },

// //   modeHeaderTitle: {
// //     color: T.ink,
// //     fontSize: 16,
// //     fontWeight: "900",
// //   },

// //   modeHeaderText: {
// //     color: T.inkSoft,
// //     fontSize: 11.5,
// //     marginTop: 3,
// //   },

// //   modeRow: {
// //     flexDirection: "row",
// //     gap: 10,
// //   },

// //   modeBox: {
// //     flex: 1,
// //     minWidth: 0,
// //     borderRadius: 18,
// //     padding: 10,
// //     alignItems: "center",
// //     borderWidth: 1.5,
// //   },

// //   modeBoxSingle: {
// //     backgroundColor: T.tealPale,
// //     borderColor: "#B5E6D8",
// //   },

// //   modeBoxMulti: {
// //     backgroundColor: T.tangerinePale,
// //     borderColor: "#FFD2B3",
// //   },

// //   modeIconWrap: {
// //     height: 56,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginTop: 4,
// //     marginBottom: 6,
// //   },

// //   modeIconCircle: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   singleCircle: {
// //     backgroundColor: T.teal,
// //   },

// //   multiIcons: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 4,
// //   },

// //   multiPerson: {
// //     width: 38,
// //     height: 38,
// //     borderRadius: 19,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   multiPersonTeal: {
// //     backgroundColor: T.teal,
// //   },

// //   multiPersonOrange: {
// //     backgroundColor: T.tangerine,
// //   },

// //   modeTitle: {
// //     color: T.ink,
// //     fontSize: 15,
// //     fontWeight: "900",
// //     textAlign: "center",
// //   },

// //   modeText: {
// //     color: T.inkSoft,
// //     fontSize: 11,
// //     lineHeight: 16,
// //     textAlign: "center",
// //     marginTop: 5,
// //     marginBottom: 12,
// //     minHeight: 32,
// //   },

// //   modeButtonWrap: {
// //     alignSelf: "stretch",
// //   },

// //   modeButton: {
// //     height: 44,
// //     alignSelf: "stretch",
// //     borderRadius: 14,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 6,
// //     borderBottomWidth: 4,
// //   },

// //   singleButton: {
// //     backgroundColor: T.teal,
// //     borderBottomColor: T.tealDark,
// //   },

// //   multiButton: {
// //     backgroundColor: T.tangerine,
// //     borderBottomColor: T.tangerineDark,
// //   },

// //   modeButtonText: {
// //     color: "#FFFFFF",
// //     fontSize: 13,
// //     fontWeight: "900",
// //   },

// //   /* SECTIONS */

// //   sectionTitle: {
// //     color: T.ink,
// //     fontSize: 17,
// //     fontWeight: "900",
// //   },

// //   sectionSubtitle: {
// //     color: T.inkSoft,
// //     fontSize: 11,
// //     marginTop: 3,
// //   },

// //   /* CHALLENGE */

// //   challengeCard: {
// //     marginTop: 22,
// //     borderRadius: 18,
// //     backgroundColor: T.ink,
// //     padding: 15,
// //   },

// //   challengeCardMobile: {
// //     marginTop: 18,
// //     padding: 14,
// //   },

// //   challengeTop: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //   },

// //   challengeLeft: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     flex: 1,
// //     minWidth: 0,
// //   },

// //   challengeIcon: {
// //     width: 42,
// //     height: 42,
// //     borderRadius: 13,
// //     backgroundColor: T.lemon,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 11,
// //   },

// //   challengeInfo: {
// //     flex: 1,
// //     minWidth: 0,
// //   },

// //   challengeTitle: {
// //     color: "#FFFFFF",
// //     fontSize: 13,
// //     fontWeight: "900",
// //   },

// //   challengeText: {
// //     color: "#A9CFCB",
// //     fontSize: 10.5,
// //     marginTop: 3,
// //   },

// //   challengeProgress: {
// //     alignItems: "flex-end",
// //     marginLeft: 10,
// //   },

// //   progressNumber: {
// //     color: T.lemon,
// //     fontSize: 17,
// //     fontWeight: "900",
// //   },

// //   progressText: {
// //     color: "#7FB0AB",
// //     fontSize: 9,
// //     marginTop: 1,
// //   },

// //   progressTrack: {
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: "rgba(255,255,255,0.14)",
// //     marginTop: 14,
// //     overflow: "hidden",
// //   },

// //   progressFill: {
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: T.lemon,
// //   },

// //   /* LEADERBOARD */

// //   leaderHeader: {
// //     marginTop: 27,
// //     marginBottom: 12,
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },

// //   viewAll: {
// //     color: T.tealDark,
// //     fontSize: 12,
// //     fontWeight: "800",
// //   },

// //   leaderboardCard: {
// //     backgroundColor: T.card,
// //     borderRadius: 19,
// //     borderWidth: 1.5,
// //     borderColor: T.line,
// //     borderBottomWidth: 5,
// //     paddingHorizontal: 13,
// //     overflow: "hidden",
// //   },

// //   playerRow: {
// //     minHeight: 64,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#E4F3EE",
// //   },

// //   lastPlayerRow: {
// //     borderBottomWidth: 0,
// //   },

// //   rankCircle: {
// //     width: 27,
// //     height: 27,
// //     borderRadius: 8,
// //     backgroundColor: "#EAF1EF",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 9,
// //   },

// //   rankFirst: {
// //     backgroundColor: "#FFEFA6",
// //   },

// //   rankSecond: {
// //     backgroundColor: "#E3E9E8",
// //   },

// //   rankThird: {
// //     backgroundColor: "#FFD9BE",
// //   },

// //   rankText: {
// //     color: T.ink,
// //     fontSize: 11,
// //     fontWeight: "900",
// //   },

// //   playerAvatar: {
// //     width: 37,
// //     height: 37,
// //     borderRadius: 13,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 10,
// //   },

// //   playerInfo: {
// //     flex: 1,
// //     minWidth: 0,
// //   },

// //   playerName: {
// //     color: T.ink,
// //     fontSize: 13,
// //     fontWeight: "800",
// //   },

// //   topPlayerLabel: {
// //     color: T.tangerineDark,
// //     fontSize: 10,
// //     fontWeight: "800",
// //     marginTop: 2,
// //   },

// //   scoreContainer: {
// //     alignItems: "flex-end",
// //     marginLeft: 8,
// //   },

// //   scoreNumber: {
// //     color: T.ink,
// //     fontSize: 14,
// //     fontWeight: "900",
// //   },

// //   scoreLabel: {
// //     color: T.inkFaint,
// //     fontSize: 9,
// //     fontWeight: "800",
// //     marginTop: 1,
// //   },

// //   emptyLeaderboard: {
// //     height: 110,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   emptyText: {
// //     color: T.inkSoft,
// //     fontSize: 11,
// //     marginTop: 7,
// //   },

// //   /* BOTTOM NAV */

// //   bottomNav: {
// //     height: 70,
// //     backgroundColor: T.white,
// //     borderTopWidth: 1.5,
// //     borderTopColor: T.line,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-around",
// //     paddingBottom: 4,
// //   },

// //   navItem: {
// //     flex: 1,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   activeNavIcon: {
// //     width: 37,
// //     height: 32,
// //     borderRadius: 11,
// //     backgroundColor: T.teal,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   activeNavText: {
// //     color: T.tealDark,
// //     fontSize: 9.5,
// //     fontWeight: "900",
// //     marginTop: 3,
// //   },

// //   navText: {
// //     color: T.inkFaint,
// //     fontSize: 9.5,
// //     fontWeight: "700",
// //     marginTop: 4,
// //   },
// // });
// import React, { useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Pressable,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   useWindowDimensions,
//   Animated,
//   Easing,
//   StyleProp,
//   ViewStyle,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// export interface TopPlayer {
//   rank: number;
//   name: string;
//   score: number;
//   avatarColor: string;
// }

// interface WordScrambleHomeScreenProps {
//   topPlayers: TopPlayer[];

//   onPlayOnline: () => void;
//   onViewAllPlayers: () => void;

//   // no longer used on this screen (kept optional so App.tsx still compiles)
//   onCreateRoom?: () => void;
//   onJoinRoom?: (code: string) => void;

//   onGuestPlay?: () => void;

//   /**
//    * Parent must pass this function.
//    * Navigates from Word Scramble Home back to the Cyber Mind main menu.
//    */
//   onBack: () => void;

//   onTabHome: () => void;
//   onTabLeaderboard: () => void;
//   onTabProfile: () => void;
// }

// /* ============================================================
//    THEME  (mint paper + deep teal ink + tangerine, scrabble tiles)
// ============================================================ */

// const T = {
//   bg: "#EAF8F2",
//   bgDeep: "#D6F1E7",
//   ink: "#0F3D3E",
//   inkSoft: "#4F7476",
//   inkFaint: "#8FB0AE",
//   teal: "#14A38B",
//   tealDark: "#0C7F6B",
//   tealPale: "#D2F2E8",
//   tangerine: "#FF8A3D",
//   tangerineDark: "#DB6A1C",
//   tangerinePale: "#FFE8D6",
//   lemon: "#FFD84D",
//   tile: "#FFF6DF",
//   tileEdge: "#E2CD9C",
//   card: "#FFFFFF",
//   line: "#CBE8DE",
//   white: "#FFFFFF",
// };

// /* ============================================================
//    SMALL ANIMATION HELPERS
// ============================================================ */

// /** Endless idle motion: bob (up/down), pulse (scale) or sway (rotate). */
// const Idle: React.FC<{
//   children: React.ReactNode;
//   style?: StyleProp<ViewStyle>;
//   kind?: "bob" | "pulse" | "sway";
//   duration?: number;
//   delay?: number;
//   amount?: number;
// }> = ({ children, style, kind = "bob", duration = 1800, delay = 0, amount = 6 }) => {
//   const v = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(v, {
//           toValue: 1,
//           duration,
//           delay,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         }),
//         Animated.timing(v, {
//           toValue: 0,
//           duration,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         }),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [v, duration, delay]);

//   let transform: any[] = [];
//   if (kind === "bob") {
//     transform = [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -amount] }) }];
//   } else if (kind === "pulse") {
//     transform = [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1 + amount / 50] }) }];
//   } else {
//     transform = [
//       {
//         rotate: v.interpolate({
//           inputRange: [0, 1],
//           outputRange: [`${-amount}deg`, `${amount}deg`],
//         }),
//       },
//     ];
//   }

//   return <Animated.View style={[style, { transform }]}>{children}</Animated.View>;
// };

// /** Press feedback: squishes down then springs back. */
// const PressScale: React.FC<{
//   children: React.ReactNode;
//   onPress?: () => void;
//   style?: StyleProp<ViewStyle>;
//   accessibilityLabel?: string;
// }> = ({ children, onPress, style, accessibilityLabel }) => {
//   const s = useRef(new Animated.Value(1)).current;

//   return (
//     <Animated.View style={[{ transform: [{ scale: s }] }, style]}>
//       <Pressable
//         onPress={onPress}
//         accessibilityRole="button"
//         accessibilityLabel={accessibilityLabel}
//         onPressIn={() =>
//           Animated.spring(s, { toValue: 0.94, friction: 8, tension: 220, useNativeDriver: true }).start()
//         }
//         onPressOut={() =>
//           Animated.spring(s, { toValue: 1, friction: 3, tension: 140, useNativeDriver: true }).start()
//         }
//       >
//         {children}
//       </Pressable>
//     </Animated.View>
//   );
// };

// /** Bell that rings every few seconds. */
// const BellRing: React.FC<{ size?: number }> = ({ size = 20 }) => {
//   const r = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.delay(3200),
//         Animated.timing(r, { toValue: 1, duration: 90, useNativeDriver: true }),
//         Animated.timing(r, { toValue: -1, duration: 130, useNativeDriver: true }),
//         Animated.timing(r, { toValue: 1, duration: 130, useNativeDriver: true }),
//         Animated.timing(r, { toValue: -1, duration: 130, useNativeDriver: true }),
//         Animated.timing(r, { toValue: 0, duration: 90, useNativeDriver: true }),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [r]);

//   const rotate = r.interpolate({ inputRange: [-1, 1], outputRange: ["-16deg", "16deg"] });

//   return (
//     <Animated.View style={{ transform: [{ rotate }] }}>
//       <Ionicons name="notifications-outline" size={size} color={T.ink} />
//     </Animated.View>
//   );
// };

// /* ============================================================
//    BACKGROUND: ripple rings + rising bubbles (round, but not filled blobs)
// ============================================================ */

// /** 0 -> 1 progress that loops forever, starting part-way through. */
// const useLoopProgress = (duration: number, start: number) => {
//   const v = useRef(new Animated.Value(start)).current;

//   useEffect(() => {
//     let alive = true;

//     const run = (from: number) => {
//       v.setValue(from);
//       Animated.timing(v, {
//         toValue: 1,
//         duration: duration * (1 - from),
//         easing: Easing.linear,
//         useNativeDriver: true,
//       }).start(({ finished }) => {
//         if (finished && alive) run(0);
//       });
//     };

//     run(start);

//     return () => {
//       alive = false;
//       v.stopAnimation();
//     };
//   }, [v, duration, start]);

//   return v;
// };

// /** One outlined ring that expands and fades, like a ripple. */
// const RippleRing: React.FC<{
//   cx: number;
//   cy: number;
//   size: number;
//   color: string;
//   start: number;
// }> = ({ cx, cy, size, color, start }) => {
//   const v = useLoopProgress(7000, start);

//   return (
//     <Animated.View
//       pointerEvents="none"
//       style={{
//         position: "absolute",
//         left: cx - size / 2,
//         top: cy - size / 2,
//         width: size,
//         height: size,
//         borderRadius: size / 2,
//         borderWidth: 2.5,
//         borderColor: color,
//         opacity: v.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.4, 0] }),
//         transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1.7] }) }],
//       }}
//     />
//   );
// };

// /** Small hollow bubble that floats up and sways. */
// const Bubble: React.FC<{
//   left: number;
//   size: number;
//   height: number;
//   duration: number;
//   start: number;
//   color: string;
// }> = ({ left, size, height, duration, start, color }) => {
//   const v = useLoopProgress(duration, start);

//   return (
//     <Animated.View
//       pointerEvents="none"
//       style={{
//         position: "absolute",
//         left,
//         top: 0,
//         width: size,
//         height: size,
//         borderRadius: size / 2,
//         borderWidth: 2,
//         borderColor: color,
//         backgroundColor: "rgba(255,255,255,0.45)",
//         opacity: v.interpolate({
//           inputRange: [0, 0.1, 0.85, 1],
//           outputRange: [0, 0.6, 0.6, 0],
//         }),
//         transform: [
//           { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [height + 30, -70] }) },
//           {
//             translateX: v.interpolate({
//               inputRange: [0, 0.25, 0.5, 0.75, 1],
//               outputRange: [0, 14, 0, -14, 0],
//             }),
//           },
//         ],
//       }}
//     />
//   );
// };

// const RoundBackground: React.FC<{ width: number; height: number }> = ({ width, height }) => {
//   const bubbles = [
//     { left: 0.07, size: 26, duration: 15000, start: 0.1, color: T.teal },
//     { left: 0.22, size: 14, duration: 11000, start: 0.6, color: T.tangerine },
//     { left: 0.38, size: 34, duration: 19000, start: 0.35, color: T.teal },
//     { left: 0.55, size: 18, duration: 13000, start: 0.85, color: T.tangerine },
//     { left: 0.7, size: 28, duration: 17000, start: 0.2, color: T.teal },
//     { left: 0.84, size: 16, duration: 12000, start: 0.5, color: T.tangerine },
//     { left: 0.94, size: 22, duration: 16000, start: 0.75, color: T.teal },
//   ];

//   return (
//     <View style={StyleSheet.absoluteFill} pointerEvents="none">
//       {/* ripples from two corners */}
//       {[0, 0.34, 0.67].map((st, i) => (
//         <RippleRing key={`a${i}`} cx={width * 0.9} cy={110} size={260} color={T.teal} start={st} />
//       ))}
//       {[0.15, 0.49, 0.82].map((st, i) => (
//         <RippleRing
//           key={`b${i}`}
//           cx={width * 0.08}
//           cy={height * 0.82}
//           size={300}
//           color={T.tangerine}
//           start={st}
//         />
//       ))}

//       {bubbles.map((b, i) => (
//         <Bubble
//           key={i}
//           left={b.left * width}
//           size={b.size}
//           height={height}
//           duration={b.duration}
//           start={b.start}
//           color={b.color}
//         />
//       ))}
//     </View>
//   );
// };

// /* ============================================================
//    HERO: tiles that shuffle themselves, then snap into WORD
// ============================================================ */

// const HERO_TILES = [
//   { char: "W", pts: 4, color: T.teal },
//   { char: "O", pts: 1, color: T.tangerine },
//   { char: "R", pts: 1, color: T.ink },
//   { char: "D", pts: 2, color: T.teal },
// ];
// // slot index each tile (W,O,R,D) sits in, per step. First = solved.
// const HERO_ORDERS = [
//   [0, 1, 2, 3],
//   [2, 0, 3, 1],
//   [1, 3, 0, 2],
//   [3, 2, 1, 0],
//   [2, 3, 1, 0],
// ];
// const TILE = 56;
// const TILE_GAP = 10;
// const STRIDE = TILE + TILE_GAP;

// const ScrambleTiles: React.FC = () => {
//   const xs = useRef(HERO_TILES.map((_, i) => new Animated.Value(i * STRIDE))).current;
//   const pop = useRef(new Animated.Value(0)).current;
//   const hop = useRef(HERO_TILES.map(() => new Animated.Value(0))).current;

//   useEffect(() => {
//     let alive = true;
//     let timer: ReturnType<typeof setTimeout>;
//     let step = 0;

//     const apply = (order: number[]) => {
//       Animated.stagger(
//         70,
//         xs.map((x, i) =>
//           Animated.parallel([
//             Animated.spring(x, {
//               toValue: order[i] * STRIDE,
//               friction: 6,
//               tension: 90,
//               useNativeDriver: true,
//             }),
//             Animated.sequence([
//               Animated.timing(hop[i], { toValue: 1, duration: 140, useNativeDriver: true }),
//               Animated.timing(hop[i], { toValue: 0, duration: 220, useNativeDriver: true }),
//             ]),
//           ])
//         )
//       ).start();
//     };

//     const tick = () => {
//       if (!alive) return;
//       step = (step + 1) % HERO_ORDERS.length;
//       apply(HERO_ORDERS[step]);

//       if (step === 0) {
//         // solved: celebrate, then hold
//         timer = setTimeout(() => {
//           Animated.sequence([
//             Animated.timing(pop, { toValue: 1, duration: 160, useNativeDriver: true }),
//             Animated.spring(pop, { toValue: 0, friction: 3, tension: 120, useNativeDriver: true }),
//           ]).start();
//         }, 520);
//         timer = setTimeout(tick, 3000);
//       } else {
//         timer = setTimeout(tick, step === 1 ? 900 : 750);
//       }
//     };

//     timer = setTimeout(tick, 1600);

//     return () => {
//       alive = false;
//       clearTimeout(timer);
//     };
//   }, [xs, hop, pop]);

//   const popScale = pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });

//   return (
//     <View style={styles.scrambleBox}>
//       {HERO_TILES.map((t, i) => {
//         const lift = hop[i].interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
//         return (
//           <Animated.View
//             key={t.char}
//             style={[
//               styles.heroTile,
//               { transform: [{ translateX: xs[i] }, { translateY: lift }, { scale: popScale }] },
//             ]}
//           >
//             <Text style={[styles.heroTileChar, { color: t.color }]}>{t.char}</Text>
//             <Text style={styles.heroTilePts}>{t.pts}</Text>
//           </Animated.View>
//         );
//       })}
//     </View>
//   );
// };

// /* ============================================================
//    LEADERBOARD ROW (slides in)
// ============================================================ */

// const PlayerRow: React.FC<{ player: TopPlayer; index: number; last: boolean }> = ({
//   player,
//   index,
//   last,
// }) => {
//   const v = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.timing(v, {
//       toValue: 1,
//       duration: 480,
//       delay: 900 + index * 130,
//       easing: Easing.out(Easing.cubic),
//       useNativeDriver: true,
//     }).start();
//   }, [v, index]);

//   return (
//     <Animated.View
//       style={[
//         styles.playerRow,
//         last && styles.lastPlayerRow,
//         {
//           opacity: v,
//           transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [46, 0] }) }],
//         },
//       ]}
//     >
//       <View
//         style={[
//           styles.rankCircle,
//           player.rank === 1 && styles.rankFirst,
//           player.rank === 2 && styles.rankSecond,
//           player.rank === 3 && styles.rankThird,
//         ]}
//       >
//         <Text style={styles.rankText}>{player.rank}</Text>
//       </View>

//       <View style={[styles.playerAvatar, { backgroundColor: player.avatarColor || T.teal }]}>
//         <Ionicons name="person" size={17} color="#FFFFFF" />
//       </View>

//       <View style={styles.playerInfo}>
//         <Text style={styles.playerName}>{player.name}</Text>
//         {player.rank === 1 && <Text style={styles.topPlayerLabel}>Top player</Text>}
//       </View>

//       <View style={styles.scoreContainer}>
//         <Text style={styles.scoreNumber}>{player.score}</Text>
//         <Text style={styles.scoreLabel}>pts</Text>
//       </View>
//     </Animated.View>
//   );
// };

// /* ============================================================
//    MAIN SCREEN
// ============================================================ */

// const WordScrambleHomeScreen: React.FC<WordScrambleHomeScreenProps> = ({
//   topPlayers,
//   onPlayOnline,
//   onViewAllPlayers,
//   onGuestPlay,
//   onBack,
//   onTabHome,
//   onTabLeaderboard,
//   onTabProfile,
// }) => {
//   const { width, height } = useWindowDimensions();

//   const isMobile = width < 768;
//   const isTablet = width >= 768 && width < 1100;

//   // staggered entrance for the 5 content blocks
//   const enters = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
//   const progress = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.stagger(
//       120,
//       enters.map((e) =>
//         Animated.timing(e, {
//           toValue: 1,
//           duration: 520,
//           easing: Easing.out(Easing.cubic),
//           useNativeDriver: true,
//         })
//       )
//     ).start();

//     Animated.timing(progress, {
//       toValue: 0.6, // 3 / 5 rounds
//       duration: 1100,
//       delay: 900,
//       easing: Easing.out(Easing.cubic),
//       useNativeDriver: false,
//     }).start();
//   }, [enters, progress]);

//   const rise = (i: number) => ({
//     opacity: enters[i],
//     transform: [
//       { translateY: enters[i].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
//     ],
//   });

//   // Single Player -> guest nickname flow (falls back to online flow)
//   const handleSinglePlayer = () => {
//     if (onGuestPlay) {
//       onGuestPlay();
//     } else {
//       onPlayOnline();
//     }
//   };

//   // Multiplayer -> online flow
//   const handleMultiplayer = () => {
//     onPlayOnline();
//   };

//   const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

//       <RoundBackground width={width} height={height} />

//       <View style={styles.root}>
//         {/* ==================================================
//             SIDEBAR
//         ================================================== */}

//         {!isMobile && (
//           <View style={[styles.sidebar, isTablet && styles.sidebarTablet]}>
//             <View style={styles.sidebarBrand}>
//               <View style={styles.sidebarLogo}>
//                 <Text style={styles.logoW}>W</Text>
//                 <Text style={styles.logoS}>S</Text>
//               </View>

//               <View>
//                 <Text style={styles.sidebarBrandTitle}>
//                   Word
//                   <Text style={styles.sidebarBrandAccent}> Scramble</Text>
//                 </Text>
//                 <Text style={styles.sidebarBrandSubtitle}>Think fast. Play smart.</Text>
//               </View>
//             </View>

//             <View style={styles.sidebarNavigation}>
//               <TouchableOpacity
//                 style={[styles.sidebarNavItem, styles.sidebarNavActive]}
//                 onPress={onTabHome}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.sidebarActiveIcon}>
//                   <Ionicons name="home" size={21} color="#FFFFFF" />
//                 </View>
//                 <Text style={styles.sidebarActiveText}>Home</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.sidebarNavItem} onPress={onTabLeaderboard} activeOpacity={0.8}>
//                 <Ionicons name="trophy-outline" size={22} color={T.inkSoft} />
//                 <Text style={styles.sidebarText}>Rankings</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.sidebarNavItem} onPress={onTabProfile} activeOpacity={0.8}>
//                 <Ionicons name="person-outline" size={22} color={T.inkSoft} />
//                 <Text style={styles.sidebarText}>Profile</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.sidebarBottomCard}>
//               <Idle kind="sway" amount={8} duration={1400} style={styles.sidebarBottomIcon}>
//                 <Ionicons name="sparkles" size={21} color="#FFFFFF" />
//               </Idle>
//               <Text style={styles.sidebarBottomTitle}>Ready for a challenge?</Text>
//               <Text style={styles.sidebarBottomText}>
//                 Unscramble words and climb the rankings.
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* ==================================================
//             MAIN
//         ================================================== */}

//         <View style={[styles.main, !isMobile && styles.mainDesktop]}>
//           {/* MOBILE HEADER */}

//           {isMobile && (
//             <View style={styles.mobileHeader}>
//               <View style={styles.mobileHeaderLeft}>
//                 <TouchableOpacity
//                   style={styles.headerBackButton}
//                   activeOpacity={0.75}
//                   onPress={onBack}
//                   accessibilityRole="button"
//                   accessibilityLabel="Go back"
//                 >
//                   <Ionicons name="arrow-back" size={22} color={T.ink} />
//                 </TouchableOpacity>

//                 <View style={styles.mobileLogo}>
//                   <Text style={styles.logoW}>W</Text>
//                   <Text style={styles.logoS}>S</Text>
//                 </View>

//                 <View>
//                   <Text style={styles.mobileBrandTitle}>
//                     Word
//                     <Text style={styles.mobileBrandAccent}> Scramble</Text>
//                   </Text>
//                   <Text style={styles.mobileBrandSubtitle}>Think fast. Play smart.</Text>
//                 </View>
//               </View>

//               <TouchableOpacity style={styles.mobileNotification} activeOpacity={0.8}>
//                 <BellRing />
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* DESKTOP HEADER */}

//           {!isMobile && (
//             <View style={styles.desktopTopHeader}>
//               <View style={styles.desktopHeaderLeft}>
//                 <TouchableOpacity
//                   style={styles.headerBackButton}
//                   activeOpacity={0.75}
//                   onPress={onBack}
//                   accessibilityRole="button"
//                   accessibilityLabel="Go back"
//                 >
//                   <Ionicons name="arrow-back" size={21} color={T.ink} />
//                 </TouchableOpacity>

//                 <View>
//                   <Text style={styles.desktopWelcome}>Welcome back!</Text>
//                   <Text style={styles.desktopWelcomeSub}>Ready to play?</Text>
//                 </View>
//               </View>

//               <TouchableOpacity style={styles.desktopNotification}>
//                 <BellRing />
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* CONTENT */}

//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={[
//               styles.scrollContent,
//               isMobile && styles.scrollContentMobile,
//               isTablet && styles.scrollContentTablet,
//             ]}
//           >
//             {/* HERO */}

//             <Animated.View style={[styles.heroSection, isMobile && styles.heroMobile, rise(0)]}>
//               <View style={styles.heroPill}>
//                 <Ionicons name="flash" size={12} color={T.tangerineDark} />
//                 <Text style={styles.smallGreeting}>Ready to play?</Text>
//               </View>

//               <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
//                 Unscramble.
//                 {"\n"}
//                 <Text style={styles.heroAccent}>Outsmart.</Text>
//               </Text>

//               <Text style={[styles.heroDescription, isMobile && styles.heroDescriptionMobile]}>
//                 Arrange the letters, find the hidden word, and race against your friends.
//               </Text>
//             </Animated.View>

//             {/* SHUFFLING TILES */}

//             <Animated.View style={[styles.lettersContainer, isMobile && styles.lettersMobile, rise(1)]}>
//               <ScrambleTiles />
//             </Animated.View>

//             {/* CHOOSE YOUR MODE */}

//             <Animated.View style={[styles.modeCard, isMobile && styles.modeCardMobile, rise(2)]}>
//               <View style={styles.modeHeader}>
//                 <View style={styles.modeHeaderIcon}>
//                   <Ionicons name="game-controller" size={26} color="#FFFFFF" />
//                 </View>

//                 <View style={styles.modeHeaderInfo}>
//                   <Text style={styles.modeHeaderTitle}>Choose your mode</Text>
//                   <Text style={styles.modeHeaderText}>Play your way and enjoy the game!</Text>
//                 </View>
//               </View>

//               <View style={styles.modeRow}>
//                 {/* SINGLE PLAYER */}

//                 <View style={[styles.modeBox, styles.modeBoxSingle]}>
//                   <View style={styles.modeIconWrap}>
//                     <Idle kind="pulse" amount={7} duration={1200}>
//                       <View style={[styles.modeIconCircle, styles.singleCircle]}>
//                         <Ionicons name="person" size={26} color="#FFFFFF" />
//                       </View>
//                     </Idle>
//                   </View>

//                   <Text style={styles.modeTitle}>Single Player</Text>
//                   <Text style={styles.modeText}>Challenge yourself and improve your skills.</Text>

//                   <PressScale
//                     onPress={handleSinglePlayer}
//                     style={styles.modeButtonWrap}
//                     accessibilityLabel="Play single player"
//                   >
//                     <View style={[styles.modeButton, styles.singleButton]}>
//                       <Text style={styles.modeButtonText}>Play now</Text>
//                       <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
//                     </View>
//                   </PressScale>
//                 </View>

//                 {/* MULTIPLAYER */}

//                 <View style={[styles.modeBox, styles.modeBoxMulti]}>
//                   <View style={styles.modeIconWrap}>
//                     <View style={styles.multiIcons}>
//                       <Idle kind="bob" amount={5} duration={900}>
//                         <View style={[styles.multiPerson, styles.multiPersonTeal]}>
//                           <Ionicons name="person" size={18} color="#FFFFFF" />
//                         </View>
//                       </Idle>
//                       <Idle kind="bob" amount={5} duration={900} delay={450}>
//                         <View style={[styles.multiPerson, styles.multiPersonOrange]}>
//                           <Ionicons name="person" size={18} color="#FFFFFF" />
//                         </View>
//                       </Idle>
//                     </View>
//                   </View>

//                   <Text style={styles.modeTitle}>Multiplayer</Text>
//                   <Text style={styles.modeText}>Play with your friends and compete together.</Text>

//                   <PressScale
//                     onPress={handleMultiplayer}
//                     style={styles.modeButtonWrap}
//                     accessibilityLabel="Play multiplayer"
//                   >
//                     <View style={[styles.modeButton, styles.multiButton]}>
//                       <Text style={styles.modeButtonText}>Play now</Text>
//                       <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
//                     </View>
//                   </PressScale>
//                 </View>
//               </View>
//             </Animated.View>

//             {/* DAILY CHALLENGE */}

//             <Animated.View style={[styles.challengeCard, isMobile && styles.challengeCardMobile, rise(3)]}>
//               <View style={styles.challengeTop}>
//                 <View style={styles.challengeLeft}>
//                   <Idle kind="sway" amount={9} duration={1300} style={styles.challengeIcon}>
//                     <Ionicons name="trophy" size={22} color={T.ink} />
//                   </Idle>

//                   <View style={styles.challengeInfo}>
//                     <Text style={styles.challengeTitle}>Daily challenge</Text>
//                     <Text style={styles.challengeText}>Solve today's puzzle</Text>
//                   </View>
//                 </View>

//                 <View style={styles.challengeProgress}>
//                   <Text style={styles.progressNumber}>3/5</Text>
//                   <Text style={styles.progressText}>rounds</Text>
//                 </View>
//               </View>

//               <View style={styles.progressTrack}>
//                 <Animated.View style={[styles.progressFill, { width: barWidth }]} />
//               </View>
//             </Animated.View>

//             {/* LEADERBOARD */}

//             <Animated.View style={[styles.leaderHeader, rise(4)]}>
//               <View>
//                 <Text style={styles.sectionTitle}>Top players</Text>
//                 <Text style={styles.sectionSubtitle}>Today's leaderboard</Text>
//               </View>

//               <TouchableOpacity activeOpacity={0.7} onPress={onViewAllPlayers}>
//                 <Text style={styles.viewAll}>View all</Text>
//               </TouchableOpacity>
//             </Animated.View>

//             <Animated.View style={[styles.leaderboardCard, rise(4)]}>
//               {topPlayers.length === 0 ? (
//                 <View style={styles.emptyLeaderboard}>
//                   <Idle kind="bob" amount={6} duration={1100}>
//                     <Ionicons name="trophy-outline" size={28} color={T.inkFaint} />
//                   </Idle>
//                   <Text style={styles.emptyText}>No players yet</Text>
//                 </View>
//               ) : (
//                 topPlayers.map((player, index) => (
//                   <PlayerRow
//                     key={`${player.rank}-${player.name}`}
//                     player={player}
//                     index={index}
//                     last={index === topPlayers.length - 1}
//                   />
//                 ))
//               )}
//             </Animated.View>

//             <View style={{ height: isMobile ? 90 : 40 }} />
//           </ScrollView>

//           {/* MOBILE BOTTOM NAV */}

//           {isMobile && (
//             <View style={styles.bottomNav}>
//               <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabHome}>
//                 <Idle kind="bob" amount={3} duration={1000} style={styles.activeNavIcon}>
//                   <Ionicons name="home" size={20} color="#FFFFFF" />
//                 </Idle>
//                 <Text style={styles.activeNavText}>Home</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabLeaderboard}>
//                 <Ionicons name="trophy-outline" size={21} color={T.inkFaint} />
//                 <Text style={styles.navText}>Rankings</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabProfile}>
//                 <Ionicons name="person-outline" size={21} color={T.inkFaint} />
//                 <Text style={styles.navText}>Profile</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default WordScrambleHomeScreen;

// /* ============================================================
//    STYLES
// ============================================================ */

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: T.bg,
//   },

//   root: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "transparent",
//   },

//   /* SIDEBAR */

//   sidebar: {
//     width: 292,
//     backgroundColor: "rgba(255,255,255,0.88)",
//     borderRightWidth: 1.5,
//     borderRightColor: T.line,
//     paddingHorizontal: 19,
//     paddingTop: 22,
//     paddingBottom: 18,
//     justifyContent: "space-between",
//   },

//   sidebarTablet: {
//     width: 245,
//   },

//   sidebarBrand: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   sidebarLogo: {
//     width: 58,
//     height: 58,
//     borderRadius: 14,
//     backgroundColor: T.tile,
//     borderWidth: 2,
//     borderColor: T.tileEdge,
//     borderBottomWidth: 5,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     marginRight: 11,
//   },

//   logoW: {
//     color: T.teal,
//     fontSize: 21,
//     fontWeight: "900",
//   },

//   logoS: {
//     color: T.tangerine,
//     fontSize: 21,
//     fontWeight: "900",
//   },

//   sidebarBrandTitle: {
//     color: T.ink,
//     fontSize: 19,
//     fontWeight: "900",
//   },

//   sidebarBrandAccent: {
//     color: T.teal,
//   },

//   sidebarBrandSubtitle: {
//     color: T.inkSoft,
//     fontSize: 10.5,
//     fontWeight: "600",
//     marginTop: 2,
//   },

//   sidebarNavigation: {
//     marginTop: 50,
//     flex: 1,
//   },

//   sidebarNavItem: {
//     height: 58,
//     borderRadius: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 15,
//     marginBottom: 7,
//   },

//   sidebarNavActive: {
//     backgroundColor: T.tealPale,
//   },

//   sidebarActiveIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: T.teal,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 11,
//   },

//   sidebarActiveText: {
//     color: T.tealDark,
//     fontSize: 15,
//     fontWeight: "900",
//   },

//   sidebarText: {
//     color: T.inkSoft,
//     fontSize: 15,
//     fontWeight: "700",
//     marginLeft: 16,
//   },

//   sidebarBottomCard: {
//     backgroundColor: T.ink,
//     borderRadius: 19,
//     padding: 17,
//     minHeight: 137,
//   },

//   sidebarBottomIcon: {
//     width: 43,
//     height: 43,
//     borderRadius: 13,
//     backgroundColor: T.tangerine,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 11,
//   },

//   sidebarBottomTitle: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "900",
//   },

//   sidebarBottomText: {
//     color: "#A9CFCB",
//     fontSize: 10.5,
//     lineHeight: 17,
//     marginTop: 5,
//   },

//   /* MAIN */

//   main: {
//     flex: 1,
//     minWidth: 0,
//     backgroundColor: "transparent",
//   },

//   mainDesktop: {
//     overflow: "hidden",
//   },

//   /* HEADER */

//   mobileHeader: {
//     height: 76,
//     paddingHorizontal: 17,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "transparent",
//   },

//   mobileHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },

//   headerBackButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 12,
//     backgroundColor: T.white,
//     borderWidth: 1.5,
//     borderColor: T.line,
//     borderBottomWidth: 4,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },

//   mobileLogo: {
//     width: 45,
//     height: 45,
//     borderRadius: 12,
//     backgroundColor: T.tile,
//     borderWidth: 2,
//     borderColor: T.tileEdge,
//     borderBottomWidth: 4,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     marginRight: 10,
//   },

//   mobileBrandTitle: {
//     color: T.ink,
//     fontSize: 17,
//     fontWeight: "900",
//   },

//   mobileBrandAccent: {
//     color: T.teal,
//   },

//   mobileBrandSubtitle: {
//     color: T.inkSoft,
//     fontSize: 9.5,
//     marginTop: 2,
//     fontWeight: "600",
//   },

//   mobileNotification: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: T.white,
//     borderWidth: 1.5,
//     borderColor: T.line,
//     borderBottomWidth: 4,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   desktopTopHeader: {
//     height: 76,
//     paddingHorizontal: 34,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   desktopHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   desktopWelcome: {
//     color: T.ink,
//     fontSize: 16,
//     fontWeight: "900",
//   },

//   desktopWelcomeSub: {
//     color: T.inkSoft,
//     fontSize: 11,
//     marginTop: 3,
//   },

//   desktopNotification: {
//     width: 44,
//     height: 44,
//     borderRadius: 13,
//     backgroundColor: T.white,
//     borderWidth: 1.5,
//     borderColor: T.line,
//     borderBottomWidth: 4,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   /* SCROLL */

//   scrollContent: {
//     paddingHorizontal: 34,
//     paddingTop: 15,
//   },

//   scrollContentTablet: {
//     paddingHorizontal: 25,
//   },

//   scrollContentMobile: {
//     paddingHorizontal: 17,
//     paddingTop: 5,
//   },

//   /* HERO */

//   heroSection: {
//     marginTop: 7,
//   },

//   heroMobile: {
//     marginTop: 5,
//   },

//   heroPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "flex-start",
//     backgroundColor: T.tangerinePale,
//     borderRadius: 999,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//     gap: 4,
//   },

//   smallGreeting: {
//     color: T.tangerineDark,
//     fontSize: 12,
//     fontWeight: "800",
//   },

//   heroTitle: {
//     color: T.ink,
//     fontSize: 45,
//     lineHeight: 48,
//     fontWeight: "900",
//     letterSpacing: -1.2,
//   },

//   heroTitleMobile: {
//     fontSize: 37,
//     lineHeight: 40,
//     letterSpacing: -1,
//   },

//   heroAccent: {
//     color: T.teal,
//   },

//   heroDescription: {
//     color: T.inkSoft,
//     fontSize: 13.5,
//     lineHeight: 20,
//     marginTop: 10,
//     maxWidth: 390,
//   },

//   heroDescriptionMobile: {
//     fontSize: 12.5,
//     lineHeight: 18,
//     maxWidth: 310,
//   },

//   /* SHUFFLING TILES */

//   lettersContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 26,
//     marginBottom: 25,
//     paddingTop: 18, // room for the hop
//   },

//   lettersMobile: {
//     marginTop: 22,
//     marginBottom: 20,
//   },

//   scrambleBox: {
//     width: TILE * 4 + TILE_GAP * 3,
//     height: TILE,
//   },

//   heroTile: {
//     position: "absolute",
//     left: 0,
//     top: 0,
//     width: TILE,
//     height: TILE,
//     borderRadius: 13,
//     backgroundColor: T.tile,
//     borderWidth: 2,
//     borderColor: T.tileEdge,
//     borderBottomWidth: 6,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   heroTileChar: {
//     fontSize: 27,
//     fontWeight: "900",
//   },

//   heroTilePts: {
//     position: "absolute",
//     right: 6,
//     bottom: 3,
//     fontSize: 9,
//     fontWeight: "800",
//     color: T.inkSoft,
//   },

//   /* CHOOSE YOUR MODE */

//   modeCard: {
//     backgroundColor: T.card,
//     borderRadius: 24,
//     padding: 14,
//     borderWidth: 1.5,
//     borderColor: T.line,
//     borderBottomWidth: 5,
//     alignSelf: "stretch",
//   },

//   modeCardMobile: {
//     padding: 12,
//     borderRadius: 22,
//   },

//   modeHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 14,
//   },

//   modeHeaderIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 14,
//     backgroundColor: T.teal,
//     borderBottomWidth: 4,
//     borderBottomColor: T.tealDark,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },

//   modeHeaderInfo: {
//     flex: 1,
//     minWidth: 0,
//   },

//   modeHeaderTitle: {
//     color: T.ink,
//     fontSize: 16,
//     fontWeight: "900",
//   },

//   modeHeaderText: {
//     color: T.inkSoft,
//     fontSize: 11.5,
//     marginTop: 3,
//   },

//   modeRow: {
//     flexDirection: "row",
//     gap: 10,
//   },

//   modeBox: {
//     flex: 1,
//     minWidth: 0,
//     borderRadius: 18,
//     padding: 10,
//     alignItems: "center",
//     borderWidth: 1.5,
//   },

//   modeBoxSingle: {
//     backgroundColor: T.tealPale,
//     borderColor: "#B5E6D8",
//   },

//   modeBoxMulti: {
//     backgroundColor: T.tangerinePale,
//     borderColor: "#FFD2B3",
//   },

//   modeIconWrap: {
//     height: 56,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 4,
//     marginBottom: 6,
//   },

//   modeIconCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   singleCircle: {
//     backgroundColor: T.teal,
//   },

//   multiIcons: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },

//   multiPerson: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   multiPersonTeal: {
//     backgroundColor: T.teal,
//   },

//   multiPersonOrange: {
//     backgroundColor: T.tangerine,
//   },

//   modeTitle: {
//     color: T.ink,
//     fontSize: 15,
//     fontWeight: "900",
//     textAlign: "center",
//   },

//   modeText: {
//     color: T.inkSoft,
//     fontSize: 11,
//     lineHeight: 16,
//     textAlign: "center",
//     marginTop: 5,
//     marginBottom: 12,
//     minHeight: 32,
//   },

//   modeButtonWrap: {
//     alignSelf: "stretch",
//   },

//   modeButton: {
//     height: 44,
//     alignSelf: "stretch",
//     borderRadius: 14,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//     borderBottomWidth: 4,
//   },

//   singleButton: {
//     backgroundColor: T.teal,
//     borderBottomColor: T.tealDark,
//   },

//   multiButton: {
//     backgroundColor: T.tangerine,
//     borderBottomColor: T.tangerineDark,
//   },

//   modeButtonText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "900",
//   },

//   /* SECTIONS */

//   sectionTitle: {
//     color: T.ink,
//     fontSize: 17,
//     fontWeight: "900",
//   },

//   sectionSubtitle: {
//     color: T.inkSoft,
//     fontSize: 11,
//     marginTop: 3,
//   },

//   /* CHALLENGE */

//   challengeCard: {
//     marginTop: 22,
//     borderRadius: 18,
//     backgroundColor: T.ink,
//     padding: 15,
//   },

//   challengeCardMobile: {
//     marginTop: 18,
//     padding: 14,
//   },

//   challengeTop: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   challengeLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//     minWidth: 0,
//   },

//   challengeIcon: {
//     width: 42,
//     height: 42,
//     borderRadius: 13,
//     backgroundColor: T.lemon,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 11,
//   },

//   challengeInfo: {
//     flex: 1,
//     minWidth: 0,
//   },

//   challengeTitle: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "900",
//   },

//   challengeText: {
//     color: "#A9CFCB",
//     fontSize: 10.5,
//     marginTop: 3,
//   },

//   challengeProgress: {
//     alignItems: "flex-end",
//     marginLeft: 10,
//   },

//   progressNumber: {
//     color: T.lemon,
//     fontSize: 17,
//     fontWeight: "900",
//   },

//   progressText: {
//     color: "#7FB0AB",
//     fontSize: 9,
//     marginTop: 1,
//   },

//   progressTrack: {
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "rgba(255,255,255,0.14)",
//     marginTop: 14,
//     overflow: "hidden",
//   },

//   progressFill: {
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: T.lemon,
//   },

//   /* LEADERBOARD */

//   leaderHeader: {
//     marginTop: 27,
//     marginBottom: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   viewAll: {
//     color: T.tealDark,
//     fontSize: 12,
//     fontWeight: "800",
//   },

//   leaderboardCard: {
//     backgroundColor: T.card,
//     borderRadius: 19,
//     borderWidth: 1.5,
//     borderColor: T.line,
//     borderBottomWidth: 5,
//     paddingHorizontal: 13,
//     overflow: "hidden",
//   },

//   playerRow: {
//     minHeight: 64,
//     flexDirection: "row",
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E4F3EE",
//   },

//   lastPlayerRow: {
//     borderBottomWidth: 0,
//   },

//   rankCircle: {
//     width: 27,
//     height: 27,
//     borderRadius: 8,
//     backgroundColor: "#EAF1EF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 9,
//   },

//   rankFirst: {
//     backgroundColor: "#FFEFA6",
//   },

//   rankSecond: {
//     backgroundColor: "#E3E9E8",
//   },

//   rankThird: {
//     backgroundColor: "#FFD9BE",
//   },

//   rankText: {
//     color: T.ink,
//     fontSize: 11,
//     fontWeight: "900",
//   },

//   playerAvatar: {
//     width: 37,
//     height: 37,
//     borderRadius: 13,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },

//   playerInfo: {
//     flex: 1,
//     minWidth: 0,
//   },

//   playerName: {
//     color: T.ink,
//     fontSize: 13,
//     fontWeight: "800",
//   },

//   topPlayerLabel: {
//     color: T.tangerineDark,
//     fontSize: 10,
//     fontWeight: "800",
//     marginTop: 2,
//   },

//   scoreContainer: {
//     alignItems: "flex-end",
//     marginLeft: 8,
//   },

//   scoreNumber: {
//     color: T.ink,
//     fontSize: 14,
//     fontWeight: "900",
//   },

//   scoreLabel: {
//     color: T.inkFaint,
//     fontSize: 9,
//     fontWeight: "800",
//     marginTop: 1,
//   },

//   emptyLeaderboard: {
//     height: 110,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   emptyText: {
//     color: T.inkSoft,
//     fontSize: 11,
//     marginTop: 7,
//   },

//   /* BOTTOM NAV */

//   bottomNav: {
//     height: 70,
//     backgroundColor: T.white,
//     borderTopWidth: 1.5,
//     borderTopColor: T.line,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-around",
//     paddingBottom: 4,
//   },

//   navItem: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   activeNavIcon: {
//     width: 37,
//     height: 32,
//     borderRadius: 11,
//     backgroundColor: T.teal,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   activeNavText: {
//     color: T.tealDark,
//     fontSize: 9.5,
//     fontWeight: "900",
//     marginTop: 3,
//   },

//   navText: {
//     color: T.inkFaint,
//     fontSize: 9.5,
//     fontWeight: "700",
//     marginTop: 4,
//   },
// });
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface TopPlayer {
  rank: number;
  name: string;
  score: number;
  avatarColor: string;
}

interface WordScrambleHomeScreenProps {
  topPlayers: TopPlayer[];

  onPlayOnline: () => void;
  onViewAllPlayers: () => void;

  // no longer used on this screen (kept optional so App.tsx still compiles)
  onCreateRoom?: () => void;
  onJoinRoom?: (code: string) => void;

  onGuestPlay?: () => void;

  /**
   * Parent must pass this function.
   * Navigates from Word Scramble Home back to the Cyber Mind main menu.
   */
  onBack: () => void;

  onTabHome: () => void;
  onTabLeaderboard: () => void;
  onTabProfile: () => void;
}

/* ============================================================
   THEME  (mint paper + deep teal ink + tangerine, scrabble tiles)
============================================================ */

const T = {
  bg: "#EAF8F2",
  bgDeep: "#D6F1E7",
  ink: "#0F3D3E",
  inkSoft: "#4F7476",
  inkFaint: "#8FB0AE",
  teal: "#14A38B",
  tealDark: "#0C7F6B",
  tealPale: "#D2F2E8",
  tangerine: "#FF8A3D",
  tangerineDark: "#DB6A1C",
  tangerinePale: "#FFE8D6",
  lemon: "#FFD84D",
  tile: "#FFF6DF",
  tileEdge: "#E2CD9C",
  card: "#FFFFFF",
  line: "#CBE8DE",
  white: "#FFFFFF",
};

/* ============================================================
   SMALL ANIMATION HELPERS
============================================================ */

/** Endless idle motion: bob (up/down), pulse (scale) or sway (rotate). */
const Idle: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  kind?: "bob" | "pulse" | "sway";
  duration?: number;
  delay?: number;
  amount?: number;
}> = ({ children, style, kind = "bob", duration = 1800, delay = 0, amount = 6 }) => {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v, duration, delay]);

  let transform: any[] = [];
  if (kind === "bob") {
    transform = [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -amount] }) }];
  } else if (kind === "pulse") {
    transform = [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1 + amount / 50] }) }];
  } else {
    transform = [
      {
        rotate: v.interpolate({
          inputRange: [0, 1],
          outputRange: [`${-amount}deg`, `${amount}deg`],
        }),
      },
    ];
  }

  return <Animated.View style={[style, { transform }]}>{children}</Animated.View>;
};

/** Press feedback: squishes down then springs back. */
const PressScale: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}> = ({ children, onPress, style, accessibilityLabel }) => {
  const s = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={[{ transform: [{ scale: s }] }, style]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPressIn={() =>
          Animated.spring(s, { toValue: 0.94, friction: 8, tension: 220, useNativeDriver: true }).start()
        }
        onPressOut={() =>
          Animated.spring(s, { toValue: 1, friction: 3, tension: 140, useNativeDriver: true }).start()
        }
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

/** Bell that rings every few seconds. */
const BellRing: React.FC<{ size?: number }> = ({ size = 20 }) => {
  const r = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(3200),
        Animated.timing(r, { toValue: 1, duration: 90, useNativeDriver: true }),
        Animated.timing(r, { toValue: -1, duration: 130, useNativeDriver: true }),
        Animated.timing(r, { toValue: 1, duration: 130, useNativeDriver: true }),
        Animated.timing(r, { toValue: -1, duration: 130, useNativeDriver: true }),
        Animated.timing(r, { toValue: 0, duration: 90, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [r]);

  const rotate = r.interpolate({ inputRange: [-1, 1], outputRange: ["-16deg", "16deg"] });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Ionicons name="notifications-outline" size={size} color={T.ink} />
    </Animated.View>
  );
};

/* ============================================================
   BACKGROUND: calm, static concentric rings (no motion)
============================================================ */

const Ring: React.FC<{
  cx: number;
  cy: number;
  size: number;
  color: string;
  opacity: number;
}> = ({ cx, cy, size, color, opacity }) => (
  <View
    pointerEvents="none"
    style={{
      position: "absolute",
      left: cx - size / 2,
      top: cy - size / 2,
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: color,
      opacity,
    }}
  />
);

const RoundBackground: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* top-right */}
    <Ring cx={width * 0.92} cy={90} size={150} color={T.teal} opacity={0.2} />
    <Ring cx={width * 0.92} cy={90} size={250} color={T.teal} opacity={0.14} />
    <Ring cx={width * 0.92} cy={90} size={350} color={T.teal} opacity={0.09} />

    {/* bottom-left */}
    <Ring cx={width * 0.06} cy={height * 0.86} size={170} color={T.tangerine} opacity={0.22} />
    <Ring cx={width * 0.06} cy={height * 0.86} size={280} color={T.tangerine} opacity={0.14} />
    <Ring cx={width * 0.06} cy={height * 0.86} size={390} color={T.tangerine} opacity={0.08} />
  </View>
);

/* ============================================================
   HERO: tiles that shuffle themselves, then snap into WORD
============================================================ */

const HERO_TILES = [
  { char: "W", pts: 4, color: T.teal },
  { char: "O", pts: 1, color: T.tangerine },
  { char: "R", pts: 1, color: T.ink },
  { char: "D", pts: 2, color: T.teal },
];
// slot index each tile (W,O,R,D) sits in, per step. First = solved.
const HERO_ORDERS = [
  [0, 1, 2, 3],
  [2, 0, 3, 1],
  [1, 3, 0, 2],
  [3, 2, 1, 0],
  [2, 3, 1, 0],
];
const TILE = 56;
const TILE_GAP = 10;
const STRIDE = TILE + TILE_GAP;

const ScrambleTiles: React.FC = () => {
  const xs = useRef(HERO_TILES.map((_, i) => new Animated.Value(i * STRIDE))).current;
  const pop = useRef(new Animated.Value(0)).current;
  const hop = useRef(HERO_TILES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    let step = 0;

    const apply = (order: number[]) => {
      Animated.stagger(
        70,
        xs.map((x, i) =>
          Animated.parallel([
            Animated.spring(x, {
              toValue: order[i] * STRIDE,
              friction: 6,
              tension: 90,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(hop[i], { toValue: 1, duration: 140, useNativeDriver: true }),
              Animated.timing(hop[i], { toValue: 0, duration: 220, useNativeDriver: true }),
            ]),
          ])
        )
      ).start();
    };

    const tick = () => {
      if (!alive) return;
      step = (step + 1) % HERO_ORDERS.length;
      apply(HERO_ORDERS[step]);

      if (step === 0) {
        // solved: celebrate, then hold
        timer = setTimeout(() => {
          Animated.sequence([
            Animated.timing(pop, { toValue: 1, duration: 160, useNativeDriver: true }),
            Animated.spring(pop, { toValue: 0, friction: 3, tension: 120, useNativeDriver: true }),
          ]).start();
        }, 520);
        timer = setTimeout(tick, 3000);
      } else {
        timer = setTimeout(tick, step === 1 ? 900 : 750);
      }
    };

    timer = setTimeout(tick, 1600);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [xs, hop, pop]);

  const popScale = pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });

  return (
    <View style={styles.scrambleBox}>
      {HERO_TILES.map((t, i) => {
        const lift = hop[i].interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
        return (
          <Animated.View
            key={t.char}
            style={[
              styles.heroTile,
              { transform: [{ translateX: xs[i] }, { translateY: lift }, { scale: popScale }] },
            ]}
          >
            <Text style={[styles.heroTileChar, { color: t.color }]}>{t.char}</Text>
            <Text style={styles.heroTilePts}>{t.pts}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

/* ============================================================
   LEADERBOARD ROW (slides in)
============================================================ */

const PlayerRow: React.FC<{ player: TopPlayer; index: number; last: boolean }> = ({
  player,
  index,
  last,
}) => {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 480,
      delay: 900 + index * 130,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [v, index]);

  return (
    <Animated.View
      style={[
        styles.playerRow,
        last && styles.lastPlayerRow,
        {
          opacity: v,
          transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [46, 0] }) }],
        },
      ]}
    >
      <View
        style={[
          styles.rankCircle,
          player.rank === 1 && styles.rankFirst,
          player.rank === 2 && styles.rankSecond,
          player.rank === 3 && styles.rankThird,
        ]}
      >
        <Text style={styles.rankText}>{player.rank}</Text>
      </View>

      <View style={[styles.playerAvatar, { backgroundColor: player.avatarColor || T.teal }]}>
        <Ionicons name="person" size={17} color="#FFFFFF" />
      </View>

      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.name}</Text>
        {player.rank === 1 && <Text style={styles.topPlayerLabel}>Top player</Text>}
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreNumber}>{player.score}</Text>
        <Text style={styles.scoreLabel}>pts</Text>
      </View>
    </Animated.View>
  );
};

/* ============================================================
   MAIN SCREEN
============================================================ */

const WordScrambleHomeScreen: React.FC<WordScrambleHomeScreenProps> = ({
  topPlayers,
  onPlayOnline,
  onViewAllPlayers,
  onGuestPlay,
  onBack,
  onTabHome,
  onTabLeaderboard,
  onTabProfile,
}) => {
  const { width, height } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  // staggered entrance for the 5 content blocks
  const enters = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(
      120,
      enters.map((e) =>
        Animated.timing(e, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    ).start();

    Animated.timing(progress, {
      toValue: 0.6, // 3 / 5 rounds
      duration: 1100,
      delay: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [enters, progress]);

  const rise = (i: number) => ({
    opacity: enters[i],
    transform: [
      { translateY: enters[i].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
    ],
  });

  // Single Player -> guest nickname flow (falls back to online flow)
  const handleSinglePlayer = () => {
    if (onGuestPlay) {
      onGuestPlay();
    } else {
      onPlayOnline();
    }
  };

  // Multiplayer -> online flow
  const handleMultiplayer = () => {
    onPlayOnline();
  };

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      <RoundBackground width={width} height={height} />

      <View style={styles.root}>
        {/* ==================================================
            SIDEBAR
        ================================================== */}

        {!isMobile && (
          <View style={[styles.sidebar, isTablet && styles.sidebarTablet]}>
            <View style={styles.sidebarBrand}>
              <View style={styles.sidebarLogo}>
                <Text style={styles.logoW}>W</Text>
                <Text style={styles.logoS}>S</Text>
              </View>

              <View>
                <Text style={styles.sidebarBrandTitle}>
                  Word
                  <Text style={styles.sidebarBrandAccent}> Scramble</Text>
                </Text>
                <Text style={styles.sidebarBrandSubtitle}>Think fast. Play smart.</Text>
              </View>
            </View>

            <View style={styles.sidebarNavigation}>
              <TouchableOpacity
                style={[styles.sidebarNavItem, styles.sidebarNavActive]}
                onPress={onTabHome}
                activeOpacity={0.8}
              >
                <View style={styles.sidebarActiveIcon}>
                  <Ionicons name="home" size={21} color="#FFFFFF" />
                </View>
                <Text style={styles.sidebarActiveText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sidebarNavItem} onPress={onTabLeaderboard} activeOpacity={0.8}>
                <Ionicons name="trophy-outline" size={22} color={T.inkSoft} />
                <Text style={styles.sidebarText}>Rankings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sidebarNavItem} onPress={onTabProfile} activeOpacity={0.8}>
                <Ionicons name="person-outline" size={22} color={T.inkSoft} />
                <Text style={styles.sidebarText}>Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sidebarBottomCard}>
              <Idle kind="sway" amount={8} duration={1400} style={styles.sidebarBottomIcon}>
                <Ionicons name="sparkles" size={21} color="#FFFFFF" />
              </Idle>
              <Text style={styles.sidebarBottomTitle}>Ready for a challenge?</Text>
              <Text style={styles.sidebarBottomText}>
                Unscramble words and climb the rankings.
              </Text>
            </View>
          </View>
        )}

        {/* ==================================================
            MAIN
        ================================================== */}

        <View style={[styles.main, !isMobile && styles.mainDesktop]}>
          {/* MOBILE HEADER */}

          {isMobile && (
            <View style={styles.mobileHeader}>
              <View style={styles.mobileHeaderLeft}>
                <TouchableOpacity
                  style={styles.headerBackButton}
                  activeOpacity={0.75}
                  onPress={onBack}
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                >
                  <Ionicons name="arrow-back" size={22} color={T.ink} />
                </TouchableOpacity>

                <View style={styles.mobileLogo}>
                  <Text style={styles.logoW}>W</Text>
                  <Text style={styles.logoS}>S</Text>
                </View>

                <View>
                  <Text style={styles.mobileBrandTitle}>
                    Word
                    <Text style={styles.mobileBrandAccent}> Scramble</Text>
                  </Text>
                  <Text style={styles.mobileBrandSubtitle}>Think fast. Play smart.</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.mobileNotification} activeOpacity={0.8}>
                <BellRing />
              </TouchableOpacity>
            </View>
          )}

          {/* DESKTOP HEADER */}

          {!isMobile && (
            <View style={styles.desktopTopHeader}>
              <View style={styles.desktopHeaderLeft}>
                <TouchableOpacity
                  style={styles.headerBackButton}
                  activeOpacity={0.75}
                  onPress={onBack}
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                >
                  <Ionicons name="arrow-back" size={21} color={T.ink} />
                </TouchableOpacity>

                <View>
                  <Text style={styles.desktopWelcome}>Welcome back!</Text>
                  <Text style={styles.desktopWelcomeSub}>Ready to play?</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.desktopNotification}>
                <BellRing />
              </TouchableOpacity>
            </View>
          )}

          {/* CONTENT */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              isMobile && styles.scrollContentMobile,
              isTablet && styles.scrollContentTablet,
            ]}
          >
            {/* HERO */}

            <Animated.View style={[styles.heroSection, isMobile && styles.heroMobile, rise(0)]}>
              <View style={styles.heroPill}>
                <Ionicons name="flash" size={12} color={T.tangerineDark} />
                <Text style={styles.smallGreeting}>Ready to play?</Text>
              </View>

              <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
                Unscramble.
                {"\n"}
                <Text style={styles.heroAccent}>Outsmart.</Text>
              </Text>

              <Text style={[styles.heroDescription, isMobile && styles.heroDescriptionMobile]}>
                Arrange the letters, find the hidden word, and race against your friends.
              </Text>
            </Animated.View>

            {/* SHUFFLING TILES */}

            <Animated.View style={[styles.lettersContainer, isMobile && styles.lettersMobile, rise(1)]}>
              <ScrambleTiles />
            </Animated.View>

            {/* CHOOSE YOUR MODE */}

            <Animated.View style={[styles.modeCard, isMobile && styles.modeCardMobile, rise(2)]}>
              <View style={styles.modeHeader}>
                <View style={styles.modeHeaderIcon}>
                  <Ionicons name="game-controller" size={26} color="#FFFFFF" />
                </View>

                <View style={styles.modeHeaderInfo}>
                  <Text style={styles.modeHeaderTitle}>Choose your mode</Text>
                  <Text style={styles.modeHeaderText}>Play your way and enjoy the game!</Text>
                </View>
              </View>

              <View style={styles.modeRow}>
                {/* SINGLE PLAYER */}

                <View style={[styles.modeBox, styles.modeBoxSingle]}>
                  <View style={styles.modeIconWrap}>
                    <Idle kind="pulse" amount={7} duration={1200}>
                      <View style={[styles.modeIconCircle, styles.singleCircle]}>
                        <Ionicons name="person" size={26} color="#FFFFFF" />
                      </View>
                    </Idle>
                  </View>

                  <Text style={styles.modeTitle}>Single Player</Text>
                  <Text style={styles.modeText}>Challenge yourself and improve your skills.</Text>

                  <PressScale
                    onPress={handleSinglePlayer}
                    style={styles.modeButtonWrap}
                    accessibilityLabel="Play single player"
                  >
                    <View style={[styles.modeButton, styles.singleButton]}>
                      <Text style={styles.modeButtonText}>Play now</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </View>
                  </PressScale>
                </View>

                {/* MULTIPLAYER */}

                <View style={[styles.modeBox, styles.modeBoxMulti]}>
                  <View style={styles.modeIconWrap}>
                    <View style={styles.multiIcons}>
                      <Idle kind="bob" amount={5} duration={900}>
                        <View style={[styles.multiPerson, styles.multiPersonTeal]}>
                          <Ionicons name="person" size={18} color="#FFFFFF" />
                        </View>
                      </Idle>
                      <Idle kind="bob" amount={5} duration={900} delay={450}>
                        <View style={[styles.multiPerson, styles.multiPersonOrange]}>
                          <Ionicons name="person" size={18} color="#FFFFFF" />
                        </View>
                      </Idle>
                    </View>
                  </View>

                  <Text style={styles.modeTitle}>Multiplayer</Text>
                  <Text style={styles.modeText}>Play with your friends and compete together.</Text>

                  <PressScale
                    onPress={handleMultiplayer}
                    style={styles.modeButtonWrap}
                    accessibilityLabel="Play multiplayer"
                  >
                    <View style={[styles.modeButton, styles.multiButton]}>
                      <Text style={styles.modeButtonText}>Play now</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </View>
                  </PressScale>
                </View>
              </View>
            </Animated.View>

            {/* DAILY CHALLENGE */}

            <Animated.View style={[styles.challengeCard, isMobile && styles.challengeCardMobile, rise(3)]}>
              <View style={styles.challengeTop}>
                <View style={styles.challengeLeft}>
                  <Idle kind="sway" amount={9} duration={1300} style={styles.challengeIcon}>
                    <Ionicons name="trophy" size={22} color={T.ink} />
                  </Idle>

                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeTitle}>Daily challenge</Text>
                    <Text style={styles.challengeText}>Solve today's puzzle</Text>
                  </View>
                </View>

                <View style={styles.challengeProgress}>
                  <Text style={styles.progressNumber}>3/5</Text>
                  <Text style={styles.progressText}>rounds</Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: barWidth }]} />
              </View>
            </Animated.View>

            {/* LEADERBOARD */}

            <Animated.View style={[styles.leaderHeader, rise(4)]}>
              <View>
                <Text style={styles.sectionTitle}>Top players</Text>
                <Text style={styles.sectionSubtitle}>Today's leaderboard</Text>
              </View>

              <TouchableOpacity activeOpacity={0.7} onPress={onViewAllPlayers}>
                <Text style={styles.viewAll}>View all</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.leaderboardCard, rise(4)]}>
              {topPlayers.length === 0 ? (
                <View style={styles.emptyLeaderboard}>
                  <Idle kind="bob" amount={6} duration={1100}>
                    <Ionicons name="trophy-outline" size={28} color={T.inkFaint} />
                  </Idle>
                  <Text style={styles.emptyText}>No players yet</Text>
                </View>
              ) : (
                topPlayers.map((player, index) => (
                  <PlayerRow
                    key={`${player.rank}-${player.name}`}
                    player={player}
                    index={index}
                    last={index === topPlayers.length - 1}
                  />
                ))
              )}
            </Animated.View>

            <View style={{ height: isMobile ? 90 : 40 }} />
          </ScrollView>

          {/* MOBILE BOTTOM NAV */}

          {isMobile && (
            <View style={styles.bottomNav}>
              <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabHome}>
                <Idle kind="bob" amount={3} duration={1000} style={styles.activeNavIcon}>
                  <Ionicons name="home" size={20} color="#FFFFFF" />
                </Idle>
                <Text style={styles.activeNavText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabLeaderboard}>
                <Ionicons name="trophy-outline" size={21} color={T.inkFaint} />
                <Text style={styles.navText}>Rankings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabProfile}>
                <Ionicons name="person-outline" size={21} color={T.inkFaint} />
                <Text style={styles.navText}>Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WordScrambleHomeScreen;

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: T.bg,
  },

  root: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
  },

  /* SIDEBAR */

  sidebar: {
    width: 292,
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRightWidth: 1.5,
    borderRightColor: T.line,
    paddingHorizontal: 19,
    paddingTop: 22,
    paddingBottom: 18,
    justifyContent: "space-between",
  },

  sidebarTablet: {
    width: 245,
  },

  sidebarBrand: {
    flexDirection: "row",
    alignItems: "center",
  },

  sidebarLogo: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: T.tile,
    borderWidth: 2,
    borderColor: T.tileEdge,
    borderBottomWidth: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginRight: 11,
  },

  logoW: {
    color: T.teal,
    fontSize: 21,
    fontWeight: "900",
  },

  logoS: {
    color: T.tangerine,
    fontSize: 21,
    fontWeight: "900",
  },

  sidebarBrandTitle: {
    color: T.ink,
    fontSize: 19,
    fontWeight: "900",
  },

  sidebarBrandAccent: {
    color: T.teal,
  },

  sidebarBrandSubtitle: {
    color: T.inkSoft,
    fontSize: 10.5,
    fontWeight: "600",
    marginTop: 2,
  },

  sidebarNavigation: {
    marginTop: 50,
    flex: 1,
  },

  sidebarNavItem: {
    height: 58,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 7,
  },

  sidebarNavActive: {
    backgroundColor: T.tealPale,
  },

  sidebarActiveIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.teal,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  sidebarActiveText: {
    color: T.tealDark,
    fontSize: 15,
    fontWeight: "900",
  },

  sidebarText: {
    color: T.inkSoft,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 16,
  },

  sidebarBottomCard: {
    backgroundColor: T.ink,
    borderRadius: 19,
    padding: 17,
    minHeight: 137,
  },

  sidebarBottomIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: T.tangerine,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },

  sidebarBottomTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  sidebarBottomText: {
    color: "#A9CFCB",
    fontSize: 10.5,
    lineHeight: 17,
    marginTop: 5,
  },

  /* MAIN */

  main: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "transparent",
  },

  mainDesktop: {
    overflow: "hidden",
  },

  /* HEADER */

  mobileHeader: {
    height: 76,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },

  mobileHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  headerBackButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: T.white,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  mobileLogo: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: T.tile,
    borderWidth: 2,
    borderColor: T.tileEdge,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginRight: 10,
  },

  mobileBrandTitle: {
    color: T.ink,
    fontSize: 17,
    fontWeight: "900",
  },

  mobileBrandAccent: {
    color: T.teal,
  },

  mobileBrandSubtitle: {
    color: T.inkSoft,
    fontSize: 9.5,
    marginTop: 2,
    fontWeight: "600",
  },

  mobileNotification: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.white,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  desktopTopHeader: {
    height: 76,
    paddingHorizontal: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  desktopHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  desktopWelcome: {
    color: T.ink,
    fontSize: 16,
    fontWeight: "900",
  },

  desktopWelcomeSub: {
    color: T.inkSoft,
    fontSize: 11,
    marginTop: 3,
  },

  desktopNotification: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: T.white,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  /* SCROLL */

  scrollContent: {
    paddingHorizontal: 34,
    paddingTop: 15,
  },

  scrollContentTablet: {
    paddingHorizontal: 25,
  },

  scrollContentMobile: {
    paddingHorizontal: 17,
    paddingTop: 5,
  },

  /* HERO */

  heroSection: {
    marginTop: 7,
  },

  heroMobile: {
    marginTop: 5,
  },

  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: T.tangerinePale,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
    gap: 4,
  },

  smallGreeting: {
    color: T.tangerineDark,
    fontSize: 12,
    fontWeight: "800",
  },

  heroTitle: {
    color: T.ink,
    fontSize: 45,
    lineHeight: 48,
    fontWeight: "900",
    letterSpacing: -1.2,
  },

  heroTitleMobile: {
    fontSize: 37,
    lineHeight: 40,
    letterSpacing: -1,
  },

  heroAccent: {
    color: T.teal,
  },

  heroDescription: {
    color: T.inkSoft,
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 390,
  },

  heroDescriptionMobile: {
    fontSize: 12.5,
    lineHeight: 18,
    maxWidth: 310,
  },

  /* SHUFFLING TILES */

  lettersContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
    marginBottom: 25,
    paddingTop: 18, // room for the hop
  },

  lettersMobile: {
    marginTop: 22,
    marginBottom: 20,
  },

  scrambleBox: {
    width: TILE * 4 + TILE_GAP * 3,
    height: TILE,
  },

  heroTile: {
    position: "absolute",
    left: 0,
    top: 0,
    width: TILE,
    height: TILE,
    borderRadius: 13,
    backgroundColor: T.tile,
    borderWidth: 2,
    borderColor: T.tileEdge,
    borderBottomWidth: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  heroTileChar: {
    fontSize: 27,
    fontWeight: "900",
  },

  heroTilePts: {
    position: "absolute",
    right: 6,
    bottom: 3,
    fontSize: 9,
    fontWeight: "800",
    color: T.inkSoft,
  },

  /* CHOOSE YOUR MODE */

  modeCard: {
    backgroundColor: T.card,
    borderRadius: 24,
    padding: 14,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 5,
    alignSelf: "stretch",
  },

  modeCardMobile: {
    padding: 12,
    borderRadius: 22,
  },

  modeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  modeHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: T.teal,
    borderBottomWidth: 4,
    borderBottomColor: T.tealDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  modeHeaderInfo: {
    flex: 1,
    minWidth: 0,
  },

  modeHeaderTitle: {
    color: T.ink,
    fontSize: 16,
    fontWeight: "900",
  },

  modeHeaderText: {
    color: T.inkSoft,
    fontSize: 11.5,
    marginTop: 3,
  },

  modeRow: {
    flexDirection: "row",
    gap: 10,
  },

  modeBox: {
    flex: 1,
    minWidth: 0,
    borderRadius: 18,
    padding: 10,
    alignItems: "center",
    borderWidth: 1.5,
  },

  modeBoxSingle: {
    backgroundColor: T.tealPale,
    borderColor: "#B5E6D8",
  },

  modeBoxMulti: {
    backgroundColor: T.tangerinePale,
    borderColor: "#FFD2B3",
  },

  modeIconWrap: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 6,
  },

  modeIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  singleCircle: {
    backgroundColor: T.teal,
  },

  multiIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  multiPerson: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  multiPersonTeal: {
    backgroundColor: T.teal,
  },

  multiPersonOrange: {
    backgroundColor: T.tangerine,
  },

  modeTitle: {
    color: T.ink,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  modeText: {
    color: T.inkSoft,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 12,
    minHeight: 32,
  },

  modeButtonWrap: {
    alignSelf: "stretch",
  },

  modeButton: {
    height: 44,
    alignSelf: "stretch",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderBottomWidth: 4,
  },

  singleButton: {
    backgroundColor: T.teal,
    borderBottomColor: T.tealDark,
  },

  multiButton: {
    backgroundColor: T.tangerine,
    borderBottomColor: T.tangerineDark,
  },

  modeButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  /* SECTIONS */

  sectionTitle: {
    color: T.ink,
    fontSize: 17,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: T.inkSoft,
    fontSize: 11,
    marginTop: 3,
  },

  /* CHALLENGE */

  challengeCard: {
    marginTop: 22,
    borderRadius: 18,
    backgroundColor: T.ink,
    padding: 15,
  },

  challengeCardMobile: {
    marginTop: 18,
    padding: 14,
  },

  challengeTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  challengeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },

  challengeIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: T.lemon,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  challengeInfo: {
    flex: 1,
    minWidth: 0,
  },

  challengeTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  challengeText: {
    color: "#A9CFCB",
    fontSize: 10.5,
    marginTop: 3,
  },

  challengeProgress: {
    alignItems: "flex-end",
    marginLeft: 10,
  },

  progressNumber: {
    color: T.lemon,
    fontSize: 17,
    fontWeight: "900",
  },

  progressText: {
    color: "#7FB0AB",
    fontSize: 9,
    marginTop: 1,
  },

  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.14)",
    marginTop: 14,
    overflow: "hidden",
  },

  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: T.lemon,
  },

  /* LEADERBOARD */

  leaderHeader: {
    marginTop: 27,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewAll: {
    color: T.tealDark,
    fontSize: 12,
    fontWeight: "800",
  },

  leaderboardCard: {
    backgroundColor: T.card,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 5,
    paddingHorizontal: 13,
    overflow: "hidden",
  },

  playerRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E4F3EE",
  },

  lastPlayerRow: {
    borderBottomWidth: 0,
  },

  rankCircle: {
    width: 27,
    height: 27,
    borderRadius: 8,
    backgroundColor: "#EAF1EF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  rankFirst: {
    backgroundColor: "#FFEFA6",
  },

  rankSecond: {
    backgroundColor: "#E3E9E8",
  },

  rankThird: {
    backgroundColor: "#FFD9BE",
  },

  rankText: {
    color: T.ink,
    fontSize: 11,
    fontWeight: "900",
  },

  playerAvatar: {
    width: 37,
    height: 37,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  playerInfo: {
    flex: 1,
    minWidth: 0,
  },

  playerName: {
    color: T.ink,
    fontSize: 13,
    fontWeight: "800",
  },

  topPlayerLabel: {
    color: T.tangerineDark,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 2,
  },

  scoreContainer: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  scoreNumber: {
    color: T.ink,
    fontSize: 14,
    fontWeight: "900",
  },

  scoreLabel: {
    color: T.inkFaint,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 1,
  },

  emptyLeaderboard: {
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: T.inkSoft,
    fontSize: 11,
    marginTop: 7,
  },

  /* BOTTOM NAV */

  bottomNav: {
    height: 70,
    backgroundColor: T.white,
    borderTopWidth: 1.5,
    borderTopColor: T.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 4,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  activeNavIcon: {
    width: 37,
    height: 32,
    borderRadius: 11,
    backgroundColor: T.teal,
    alignItems: "center",
    justifyContent: "center",
  },

  activeNavText: {
    color: T.tealDark,
    fontSize: 9.5,
    fontWeight: "900",
    marginTop: 3,
  },

  navText: {
    color: T.inkFaint,
    fontSize: 9.5,
    fontWeight: "700",
    marginTop: 4,
  },
});
