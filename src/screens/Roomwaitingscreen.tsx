// // // // // // // // // import React, { useEffect, useState, useCallback } from "react";
// // // // // // // // // import { View, Text, StyleSheet, TouchableOpacity, FlatList, Share, SafeAreaView, StatusBar } from "react-native";
// // // // // // // // // import { LinearGradient } from "expo-linear-gradient";
// // // // // // // // // import { Ionicons } from "@expo/vector-icons";
// // // // // // // // // import { fetchRoom, WordScrambleRoom } from "../api/Wordscrambleapi";

// // // // // // // // // interface RoomWaitingScreenProps {
// // // // // // // // //   roomCode: string;
// // // // // // // // //   maxPlayers: number;
// // // // // // // // //   onBack: () => void;
// // // // // // // // //   onStartGame: () => void;
// // // // // // // // // }

// // // // // // // // // const RoomWaitingScreen: React.FC<RoomWaitingScreenProps> = ({
// // // // // // // // //   roomCode,
// // // // // // // // //   maxPlayers,
// // // // // // // // //   onBack,
// // // // // // // // //   onStartGame,
// // // // // // // // // }) => {
// // // // // // // // //   const [room, setRoom] = useState<WordScrambleRoom | null>(null);

// // // // // // // // //   const poll = useCallback(async () => {
// // // // // // // // //     try {
// // // // // // // // //       const r = await fetchRoom(roomCode);
// // // // // // // // //       setRoom(r);
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.warn("Room poll failed:", err);
// // // // // // // // //     }
// // // // // // // // //   }, [roomCode]);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     poll();
// // // // // // // // //     const interval = setInterval(poll, 2500); // 👈 simple polling every 2.5s for new players
// // // // // // // // //     return () => clearInterval(interval);
// // // // // // // // //   }, [poll]);

// // // // // // // // //   const handleShare = () => {
// // // // // // // // //     Share.share({ message: `Join my Word Scramble room! Code: ${roomCode}` });
// // // // // // // // //   };

// // // // // // // // //   const players = room?.players || [];

// // // // // // // // //   return (
// // // // // // // // //     <LinearGradient colors={["#0B1020", "#141B36", "#0B1020"]} style={styles.flex}>
// // // // // // // // //       <SafeAreaView style={styles.flex}>
// // // // // // // // //         <StatusBar barStyle="light-content" backgroundColor="#0B1020" />

// // // // // // // // //         <View style={styles.topRow}>
// // // // // // // // //           <TouchableOpacity style={styles.iconButton} onPress={onBack}>
// // // // // // // // //             <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
// // // // // // // // //           </TouchableOpacity>
// // // // // // // // //           <Text style={styles.topTitle}>Room {roomCode}</Text>
// // // // // // // // //           <Ionicons name="copy-outline" size={18} color="#9AA5C0" />
// // // // // // // // //         </View>

// // // // // // // // //         <Text style={styles.waitingText}>Waiting for players...</Text>

// // // // // // // // //         <FlatList
// // // // // // // // //           style={styles.list}
// // // // // // // // //           contentContainerStyle={{ paddingHorizontal: 22, gap: 12 }}
// // // // // // // // //           data={players}
// // // // // // // // //           keyExtractor={(item) => String(item.id)}
// // // // // // // // //           renderItem={({ item }) => (
// // // // // // // // //             <View style={styles.playerRow}>
// // // // // // // // //               <View style={styles.avatar}>
// // // // // // // // //                 <Ionicons name="person" size={16} color="#FFFFFF" />
// // // // // // // // //               </View>
// // // // // // // // //               <Text style={styles.playerName}>{item.player_name}</Text>
// // // // // // // // //               <View style={styles.readyBadge}>
// // // // // // // // //                 <View style={styles.readyDot} />
// // // // // // // // //                 <Text style={styles.readyText}>Ready</Text>
// // // // // // // // //               </View>
// // // // // // // // //             </View>
// // // // // // // // //           )}
// // // // // // // // //           ListFooterComponent={
// // // // // // // // //             players.length < maxPlayers ? (
// // // // // // // // //               <View style={[styles.playerRow, styles.emptyRow]}>
// // // // // // // // //                 <View style={[styles.avatar, { backgroundColor: "#1E2A4D" }]} />
// // // // // // // // //                 <Text style={styles.waitingLabel}>Waiting for player...</Text>
// // // // // // // // //               </View>
// // // // // // // // //             ) : null
// // // // // // // // //           }
// // // // // // // // //         />

// // // // // // // // //         <View style={styles.bottomBlock}>
// // // // // // // // //           <Text style={styles.playersCount}>
// // // // // // // // //             Players: {players.length} / {maxPlayers}
// // // // // // // // //           </Text>

// // // // // // // // //           <TouchableOpacity style={styles.startButton} activeOpacity={0.88} onPress={onStartGame}>
// // // // // // // // //             <Text style={styles.startButtonText}>Start Game</Text>
// // // // // // // // //           </TouchableOpacity>

// // // // // // // // //           <Text style={styles.shareLabel}>Share Room Code</Text>
// // // // // // // // //           <View style={styles.codeRow}>
// // // // // // // // //             <Text style={styles.codeText}>{roomCode}</Text>
// // // // // // // // //           </View>
// // // // // // // // //           <TouchableOpacity onPress={handleShare} style={styles.shareIcon}>
// // // // // // // // //             <Ionicons name="share-social-outline" size={18} color="#9AA5C0" />
// // // // // // // // //           </TouchableOpacity>
// // // // // // // // //         </View>
// // // // // // // // //       </SafeAreaView>
// // // // // // // // //     </LinearGradient>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default RoomWaitingScreen;

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   flex: { flex: 1 },
// // // // // // // // //   topRow: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "space-between",
// // // // // // // // //     paddingHorizontal: 20,
// // // // // // // // //     paddingTop: 8,
// // // // // // // // //     paddingBottom: 16,
// // // // // // // // //   },
// // // // // // // // //   iconButton: { width: 36, height: 36, justifyContent: "center" },
// // // // // // // // //   topTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
// // // // // // // // //   waitingText: {
// // // // // // // // //     color: "#9AA5C0",
// // // // // // // // //     fontSize: 13,
// // // // // // // // //     textAlign: "center",
// // // // // // // // //     marginBottom: 18,
// // // // // // // // //   },
// // // // // // // // //   list: { flexGrow: 0, maxHeight: 260 },
// // // // // // // // //   playerRow: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     gap: 12,
// // // // // // // // //     backgroundColor: "#141B36",
// // // // // // // // //     borderRadius: 14,
// // // // // // // // //     paddingVertical: 12,
// // // // // // // // //     paddingHorizontal: 14,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: "#1E2A4D",
// // // // // // // // //   },
// // // // // // // // //   emptyRow: { opacity: 0.5 },
// // // // // // // // //   avatar: {
// // // // // // // // //     width: 32,
// // // // // // // // //     height: 32,
// // // // // // // // //     borderRadius: 16,
// // // // // // // // //     backgroundColor: "#3B82F6",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //   },
// // // // // // // // //   playerName: { flex: 1, color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
// // // // // // // // //   waitingLabel: { color: "#5A6478", fontSize: 13 },
// // // // // // // // //   readyBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
// // // // // // // // //   readyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#2BC98A" },
// // // // // // // // //   readyText: { color: "#2BC98A", fontSize: 11, fontWeight: "700" },
// // // // // // // // //   bottomBlock: {
// // // // // // // // //     marginTop: "auto",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     paddingHorizontal: 22,
// // // // // // // // //     paddingBottom: 30,
// // // // // // // // //   },
// // // // // // // // //   playersCount: { color: "#9AA5C0", fontSize: 12, marginBottom: 14 },
// // // // // // // // //   startButton: {
// // // // // // // // //     width: "100%",
// // // // // // // // //     height: 52,
// // // // // // // // //     borderRadius: 14,
// // // // // // // // //     backgroundColor: "#5B3FD6",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     marginBottom: 22,
// // // // // // // // //   },
// // // // // // // // //   startButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
// // // // // // // // //   shareLabel: { color: "#5A6478", fontSize: 11, marginBottom: 8 },
// // // // // // // // //   codeRow: {
// // // // // // // // //     backgroundColor: "#141B36",
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     paddingVertical: 12,
// // // // // // // // //     paddingHorizontal: 40,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: "#1E2A4D",
// // // // // // // // //   },
// // // // // // // // //   codeText: { color: "#FFFFFF", fontWeight: "800", fontSize: 20, letterSpacing: 3 },
// // // // // // // // //   shareIcon: { marginTop: 10 },
// // // // // // // // // });
// // // // // // // // import React, { useEffect, useState, useCallback } from "react";
// // // // // // // // import { View, Text, StyleSheet, TouchableOpacity, FlatList, Share, SafeAreaView, StatusBar } from "react-native";
// // // // // // // // import { LinearGradient } from "expo-linear-gradient";
// // // // // // // // import { Ionicons } from "@expo/vector-icons";
// // // // // // // // import { fetchRoom, WordScrambleRoom } from "../api/Wordscrambleapi";

// // // // // // // // interface RoomWaitingScreenProps {
// // // // // // // //   roomCode: string;
// // // // // // // //   maxPlayers: number;
// // // // // // // //   onBack: () => void;
// // // // // // // //   onStartGame: () => void;
// // // // // // // //   onOpenChat: () => void;
// // // // // // // //   onOpenRoomSettings: () => void;
// // // // // // // // }

// // // // // // // // const RoomWaitingScreen: React.FC<RoomWaitingScreenProps> = ({
// // // // // // // //   roomCode,
// // // // // // // //   maxPlayers,
// // // // // // // //   onBack,
// // // // // // // //   onStartGame,
// // // // // // // //   onOpenChat,
// // // // // // // //   onOpenRoomSettings,
// // // // // // // // }) => {
// // // // // // // //   const [room, setRoom] = useState<WordScrambleRoom | null>(null);

// // // // // // // //   const poll = useCallback(async () => {
// // // // // // // //     try {
// // // // // // // //       const r = await fetchRoom(roomCode);
// // // // // // // //       setRoom(r);
// // // // // // // //     } catch (err) {
// // // // // // // //       console.warn("Room poll failed:", err);
// // // // // // // //     }
// // // // // // // //   }, [roomCode]);

// // // // // // // //   useEffect(() => {
// // // // // // // //     poll();
// // // // // // // //     const interval = setInterval(poll, 2500); // 👈 simple polling every 2.5s for new players
// // // // // // // //     return () => clearInterval(interval);
// // // // // // // //   }, [poll]);

// // // // // // // //   const handleShare = () => {
// // // // // // // //     Share.share({ message: `Join my Word Scramble room! Code: ${roomCode}` });
// // // // // // // //   };

// // // // // // // //   const players = room?.players || [];

// // // // // // // //   return (
// // // // // // // //     <LinearGradient colors={["#0B1020", "#141B36", "#0B1020"]} style={styles.flex}>
// // // // // // // //       <SafeAreaView style={styles.flex}>
// // // // // // // //         <StatusBar barStyle="light-content" backgroundColor="#0B1020" />

// // // // // // // //         <View style={styles.topRow}>
// // // // // // // //           <TouchableOpacity style={styles.iconButton} onPress={onBack}>
// // // // // // // //             <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
// // // // // // // //           </TouchableOpacity>
// // // // // // // //           <Text style={styles.topTitle}>Room {roomCode}</Text>
// // // // // // // //           <View style={styles.topRightIcons}>
// // // // // // // //             <TouchableOpacity onPress={onOpenChat} style={styles.topIconButton}>
// // // // // // // //               <Ionicons name="chatbubble-ellipses-outline" size={20} color="#9AA5C0" />
// // // // // // // //             </TouchableOpacity>
// // // // // // // //             <TouchableOpacity onPress={onOpenRoomSettings} style={styles.topIconButton}>
// // // // // // // //               <Ionicons name="settings-outline" size={20} color="#9AA5C0" />
// // // // // // // //             </TouchableOpacity>
// // // // // // // //           </View>
// // // // // // // //         </View>

// // // // // // // //         <Text style={styles.waitingText}>Waiting for players...</Text>

// // // // // // // //         <FlatList
// // // // // // // //           style={styles.list}
// // // // // // // //           contentContainerStyle={{ paddingHorizontal: 22, gap: 12 }}
// // // // // // // //           data={players}
// // // // // // // //           keyExtractor={(item) => String(item.id)}
// // // // // // // //           renderItem={({ item }) => (
// // // // // // // //             <View style={styles.playerRow}>
// // // // // // // //               <View style={styles.avatar}>
// // // // // // // //                 <Ionicons name="person" size={16} color="#FFFFFF" />
// // // // // // // //               </View>
// // // // // // // //               <Text style={styles.playerName}>{item.player_name}</Text>
// // // // // // // //               <View style={styles.readyBadge}>
// // // // // // // //                 <View style={styles.readyDot} />
// // // // // // // //                 <Text style={styles.readyText}>Ready</Text>
// // // // // // // //               </View>
// // // // // // // //             </View>
// // // // // // // //           )}
// // // // // // // //           ListFooterComponent={
// // // // // // // //             players.length < maxPlayers ? (
// // // // // // // //               <View style={[styles.playerRow, styles.emptyRow]}>
// // // // // // // //                 <View style={[styles.avatar, { backgroundColor: "#1E2A4D" }]} />
// // // // // // // //                 <Text style={styles.waitingLabel}>Waiting for player...</Text>
// // // // // // // //               </View>
// // // // // // // //             ) : null
// // // // // // // //           }
// // // // // // // //         />

// // // // // // // //         <View style={styles.bottomBlock}>
// // // // // // // //           <Text style={styles.playersCount}>
// // // // // // // //             Players: {players.length} / {maxPlayers}
// // // // // // // //           </Text>

// // // // // // // //           <TouchableOpacity style={styles.startButton} activeOpacity={0.88} onPress={onStartGame}>
// // // // // // // //             <Text style={styles.startButtonText}>Start Game</Text>
// // // // // // // //           </TouchableOpacity>

// // // // // // // //           <Text style={styles.shareLabel}>Share Room Code</Text>
// // // // // // // //           <View style={styles.codeRow}>
// // // // // // // //             <Text style={styles.codeText}>{roomCode}</Text>
// // // // // // // //           </View>
// // // // // // // //           <TouchableOpacity onPress={handleShare} style={styles.shareIcon}>
// // // // // // // //             <Ionicons name="share-social-outline" size={18} color="#9AA5C0" />
// // // // // // // //           </TouchableOpacity>
// // // // // // // //         </View>
// // // // // // // //       </SafeAreaView>
// // // // // // // //     </LinearGradient>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default RoomWaitingScreen;

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   flex: { flex: 1 },
// // // // // // // //   topRow: {
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "space-between",
// // // // // // // //     paddingHorizontal: 20,
// // // // // // // //     paddingTop: 8,
// // // // // // // //     paddingBottom: 16,
// // // // // // // //   },
// // // // // // // //   iconButton: { width: 36, height: 36, justifyContent: "center" },
// // // // // // // //   topRightIcons: { flexDirection: "row", gap: 14 },
// // // // // // // //   topIconButton: { width: 24, alignItems: "center" },
// // // // // // // //   topTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
// // // // // // // //   waitingText: {
// // // // // // // //     color: "#9AA5C0",
// // // // // // // //     fontSize: 13,
// // // // // // // //     textAlign: "center",
// // // // // // // //     marginBottom: 18,
// // // // // // // //   },
// // // // // // // //   list: { flexGrow: 0, maxHeight: 260 },
// // // // // // // //   playerRow: {
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     gap: 12,
// // // // // // // //     backgroundColor: "#141B36",
// // // // // // // //     borderRadius: 14,
// // // // // // // //     paddingVertical: 12,
// // // // // // // //     paddingHorizontal: 14,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: "#1E2A4D",
// // // // // // // //   },
// // // // // // // //   emptyRow: { opacity: 0.5 },
// // // // // // // //   avatar: {
// // // // // // // //     width: 32,
// // // // // // // //     height: 32,
// // // // // // // //     borderRadius: 16,
// // // // // // // //     backgroundColor: "#3B82F6",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     alignItems: "center",
// // // // // // // //   },
// // // // // // // //   playerName: { flex: 1, color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
// // // // // // // //   waitingLabel: { color: "#5A6478", fontSize: 13 },
// // // // // // // //   readyBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
// // // // // // // //   readyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#2BC98A" },
// // // // // // // //   readyText: { color: "#2BC98A", fontSize: 11, fontWeight: "700" },
// // // // // // // //   bottomBlock: {
// // // // // // // //     marginTop: "auto",
// // // // // // // //     alignItems: "center",
// // // // // // // //     paddingHorizontal: 22,
// // // // // // // //     paddingBottom: 30,
// // // // // // // //   },
// // // // // // // //   playersCount: { color: "#9AA5C0", fontSize: 12, marginBottom: 14 },
// // // // // // // //   startButton: {
// // // // // // // //     width: "100%",
// // // // // // // //     height: 52,
// // // // // // // //     borderRadius: 14,
// // // // // // // //     backgroundColor: "#5B3FD6",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     alignItems: "center",
// // // // // // // //     marginBottom: 22,
// // // // // // // //   },
// // // // // // // //   startButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
// // // // // // // //   shareLabel: { color: "#5A6478", fontSize: 11, marginBottom: 8 },
// // // // // // // //   codeRow: {
// // // // // // // //     backgroundColor: "#141B36",
// // // // // // // //     borderRadius: 12,
// // // // // // // //     paddingVertical: 12,
// // // // // // // //     paddingHorizontal: 40,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: "#1E2A4D",
// // // // // // // //   },
// // // // // // // //   codeText: { color: "#FFFFFF", fontWeight: "800", fontSize: 20, letterSpacing: 3 },
// // // // // // // //   shareIcon: { marginTop: 10 },
// // // // // // // // });
// // // // // // // import React, { useEffect, useState, useCallback, useRef } from "react";
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   StyleSheet,
// // // // // // //   TouchableOpacity,
// // // // // // //   ScrollView,
// // // // // // //   Share,
// // // // // // //   SafeAreaView,
// // // // // // //   StatusBar,
// // // // // // //   Animated,
// // // // // // //   Easing,
// // // // // // //   Platform,
// // // // // // //   useWindowDimensions,
// // // // // // // } from "react-native";
// // // // // // // import { Ionicons } from "@expo/vector-icons";
// // // // // // // import { fetchRoom, WordScrambleRoom } from "../api/Wordscrambleapi";

// // // // // // // interface RoomWaitingScreenProps {
// // // // // // //   roomCode: string;
// // // // // // //   maxPlayers: number;
// // // // // // //   onBack: () => void;
// // // // // // //   onStartGame: () => void;
// // // // // // //   onOpenChat: () => void;
// // // // // // //   onOpenRoomSettings: () => void;
// // // // // // // }

// // // // // // // /* ---------- Word Scramble theme ---------- */
// // // // // // // const C = {
// // // // // // //   bg: "#FFF8F1",
// // // // // // //   card: "#FFFFFF",
// // // // // // //   border: "#F1E7DC",
// // // // // // //   text: "#141B34",
// // // // // // //   sub: "#6B7280",
// // // // // // //   indigo: "#4F46E5",
// // // // // // //   indigoSoft: "#EEF0FF",
// // // // // // //   coral: "#FF6B57",
// // // // // // //   coralSoft: "#FFECE8",
// // // // // // //   yellow: "#F2B640",
// // // // // // //   blue: "#3B82F6",
// // // // // // //   red: "#F0566A",
// // // // // // //   green: "#22B573",
// // // // // // //   greenSoft: "#E3F6EC",
// // // // // // //   navy: "#1A2238",
// // // // // // // };

// // // // // // // const TILE_COLORS = [C.yellow, C.blue, C.red, C.green];
// // // // // // // const TILE_ROTATIONS = ["-6deg", "4deg", "-3deg", "5deg"];
// // // // // // // const AVATAR_COLORS = [C.coral, C.blue, C.green, C.yellow, C.red, C.indigo, "#14B8A6", "#F97316"];

// // // // // // // const RoomWaitingScreen: React.FC<RoomWaitingScreenProps> = ({
// // // // // // //   roomCode,
// // // // // // //   maxPlayers,
// // // // // // //   onBack,
// // // // // // //   onStartGame,
// // // // // // //   onOpenChat,
// // // // // // //   onOpenRoomSettings,
// // // // // // // }) => {
// // // // // // //   const { width } = useWindowDimensions();
// // // // // // //   const wide = width >= 900;

// // // // // // //   const [room, setRoom] = useState<WordScrambleRoom | null>(null);
// // // // // // //   const [copied, setCopied] = useState(false);

// // // // // // //   const poll = useCallback(async () => {
// // // // // // //     try {
// // // // // // //       const r = await fetchRoom(roomCode);
// // // // // // //       setRoom(r);
// // // // // // //     } catch (err) {
// // // // // // //       console.warn("Room poll failed:", err);
// // // // // // //     }
// // // // // // //   }, [roomCode]);

// // // // // // //   useEffect(() => {
// // // // // // //     poll();
// // // // // // //     const interval = setInterval(poll, 2500); // simple polling every 2.5s for new players
// // // // // // //     return () => clearInterval(interval);
// // // // // // //   }, [poll]);

// // // // // // //   /* ---------- pulsing "waiting" dot ---------- */
// // // // // // //   const pulse = useRef(new Animated.Value(0.35)).current;
// // // // // // //   useEffect(() => {
// // // // // // //     const loop = Animated.loop(
// // // // // // //       Animated.sequence([
// // // // // // //         Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // // // // // //         Animated.timing(pulse, { toValue: 0.35, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // // // // // //       ])
// // // // // // //     );
// // // // // // //     loop.start();
// // // // // // //     return () => loop.stop();
// // // // // // //   }, []);

// // // // // // //   const flashCopied = () => {
// // // // // // //     setCopied(true);
// // // // // // //     setTimeout(() => setCopied(false), 2000);
// // // // // // //   };

// // // // // // //   const handleShare = async () => {
// // // // // // //     const message = `Join my Word Scramble room! Code: ${roomCode}`;
// // // // // // //     try {
// // // // // // //       if (Platform.OS === "web") {
// // // // // // //         const nav: any = typeof navigator !== "undefined" ? navigator : null;
// // // // // // //         if (nav?.share) {
// // // // // // //           await nav.share({ text: message });
// // // // // // //           return;
// // // // // // //         }
// // // // // // //         if (nav?.clipboard?.writeText) {
// // // // // // //           await nav.clipboard.writeText(message);
// // // // // // //           flashCopied();
// // // // // // //           return;
// // // // // // //         }
// // // // // // //       }
// // // // // // //       await Share.share({ message });
// // // // // // //     } catch {
// // // // // // //       // user cancelled / unsupported — ignore
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleCopy = async () => {
// // // // // // //     try {
// // // // // // //       const nav: any = typeof navigator !== "undefined" ? navigator : null;
// // // // // // //       if (Platform.OS === "web" && nav?.clipboard?.writeText) {
// // // // // // //         await nav.clipboard.writeText(roomCode);
// // // // // // //         flashCopied();
// // // // // // //         return;
// // // // // // //       }
// // // // // // //       await Share.share({ message: roomCode });
// // // // // // //     } catch {
// // // // // // //       // ignore
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const players = room?.players || [];
// // // // // // //   const emptySlots = Math.max(0, Math.min(maxPlayers - players.length, 8));
// // // // // // //   const fillPct = maxPlayers > 0 ? Math.min(100, (players.length / maxPlayers) * 100) : 0;

// // // // // // //   /* ---------------- pieces ---------------- */

// // // // // // //   const header = (
// // // // // // //     <View style={styles.header}>
// // // // // // //       <TouchableOpacity style={styles.roundButton} onPress={onBack} activeOpacity={0.8}>
// // // // // // //         <Ionicons name="arrow-back" size={20} color={C.text} />
// // // // // // //       </TouchableOpacity>

// // // // // // //       <View style={styles.headerCenter}>
// // // // // // //         <Text style={styles.headerTitle}>Room {roomCode}</Text>
// // // // // // //         <View style={styles.headerSubRow}>
// // // // // // //           <Animated.View style={[styles.liveDot, { opacity: pulse }]} />
// // // // // // //           <Text style={styles.headerSub}>Lobby open</Text>
// // // // // // //         </View>
// // // // // // //       </View>

// // // // // // //       <View style={styles.headerRight}>
// // // // // // //         <TouchableOpacity style={styles.roundButton} onPress={onOpenChat} activeOpacity={0.8}>
// // // // // // //           <Ionicons name="chatbubble-ellipses-outline" size={19} color={C.indigo} />
// // // // // // //         </TouchableOpacity>
// // // // // // //         <TouchableOpacity style={styles.roundButton} onPress={onOpenRoomSettings} activeOpacity={0.8}>
// // // // // // //           <Ionicons name="settings-outline" size={19} color={C.indigo} />
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>
// // // // // // //     </View>
// // // // // // //   );

// // // // // // //   const heading = (
// // // // // // //     <View style={styles.headingBlock}>
// // // // // // //       <Text style={styles.eyebrow}>LOBBY</Text>
// // // // // // //       <Text style={styles.headingTitle}>Waiting for</Text>
// // // // // // //       <Text style={[styles.headingTitle, { color: C.indigo }]}>players…</Text>
// // // // // // //       <Text style={styles.headingSub}>
// // // // // // //         Share the room code with your friends. The game starts when you're ready.
// // // // // // //       </Text>
// // // // // // //     </View>
// // // // // // //   );

// // // // // // //   const playersCard = (
// // // // // // //     <View style={styles.card}>
// // // // // // //       <View style={styles.cardHeadRow}>
// // // // // // //         <View>
// // // // // // //           <Text style={styles.cardTitle}>Players</Text>
// // // // // // //           <Text style={styles.cardSub}>Everyone in this room</Text>
// // // // // // //         </View>
// // // // // // //         <View style={styles.countPill}>
// // // // // // //           <Ionicons name="people-outline" size={14} color={C.indigo} />
// // // // // // //           <Text style={styles.countPillText}>
// // // // // // //             {players.length}/{maxPlayers}
// // // // // // //           </Text>
// // // // // // //         </View>
// // // // // // //       </View>

// // // // // // //       <View style={styles.playerList}>
// // // // // // //         {players.map((p, i) => {
// // // // // // //           const isYou = p.player_name === "You";
// // // // // // //           const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
// // // // // // //           return (
// // // // // // //             <View key={String(p.id)} style={styles.playerRow}>
// // // // // // //               <View style={[styles.avatar, { backgroundColor: color }]}>
// // // // // // //                 <Text style={styles.avatarText}>{(p.player_name || "?").charAt(0).toUpperCase()}</Text>
// // // // // // //               </View>
// // // // // // //               <View style={{ flex: 1 }}>
// // // // // // //                 <Text style={styles.playerName}>{p.player_name}</Text>
// // // // // // //                 {isYou ? <Text style={styles.playerTag}>That's you</Text> : null}
// // // // // // //               </View>
// // // // // // //               <View style={styles.readyBadge}>
// // // // // // //                 <View style={styles.readyDot} />
// // // // // // //                 <Text style={styles.readyText}>Ready</Text>
// // // // // // //               </View>
// // // // // // //             </View>
// // // // // // //           );
// // // // // // //         })}

// // // // // // //         {Array.from({ length: emptySlots }).map((_, i) => (
// // // // // // //           <View key={`empty-${i}`} style={styles.emptyRow}>
// // // // // // //             <View style={styles.emptyAvatar}>
// // // // // // //               <Ionicons name="person-add-outline" size={15} color="#B8AFA5" />
// // // // // // //             </View>
// // // // // // //             <Text style={styles.emptyText}>Waiting for player…</Text>
// // // // // // //             <Animated.View style={[styles.emptyDot, { opacity: pulse }]} />
// // // // // // //           </View>
// // // // // // //         ))}
// // // // // // //       </View>
// // // // // // //     </View>
// // // // // // //   );

// // // // // // //   const codeCard = (
// // // // // // //     <View style={styles.card}>
// // // // // // //       <Text style={styles.cardTitle}>Room code</Text>
// // // // // // //       <Text style={styles.cardSub}>Friends enter this to join</Text>

// // // // // // //       {/* code as colourful letter tiles, like the WORD tiles on the home screen */}
// // // // // // //       <View style={styles.tilesRow}>
// // // // // // //         {roomCode.split("").map((ch, i) => (
// // // // // // //           <View
// // // // // // //             key={i}
// // // // // // //             style={[
// // // // // // //               styles.tile,
// // // // // // //               {
// // // // // // //                 backgroundColor: TILE_COLORS[i % TILE_COLORS.length],
// // // // // // //                 transform: [{ rotate: TILE_ROTATIONS[i % TILE_ROTATIONS.length] }],
// // // // // // //                 shadowColor: TILE_COLORS[i % TILE_COLORS.length],
// // // // // // //               },
// // // // // // //             ]}
// // // // // // //           >
// // // // // // //             <Text style={styles.tileText}>{ch}</Text>
// // // // // // //           </View>
// // // // // // //         ))}
// // // // // // //       </View>

// // // // // // //       <View style={styles.codeActions}>
// // // // // // //         <TouchableOpacity style={styles.softButton} onPress={handleCopy} activeOpacity={0.8}>
// // // // // // //           <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color={C.indigo} />
// // // // // // //           <Text style={styles.softButtonText}>{copied ? "Copied!" : "Copy"}</Text>
// // // // // // //         </TouchableOpacity>
// // // // // // //         <TouchableOpacity style={styles.softButton} onPress={handleShare} activeOpacity={0.8}>
// // // // // // //           <Ionicons name="share-social-outline" size={16} color={C.indigo} />
// // // // // // //           <Text style={styles.softButtonText}>Share</Text>
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>

// // // // // // //       <View style={styles.divider} />

// // // // // // //       <View style={styles.progressHead}>
// // // // // // //         <Text style={styles.progressLabel}>Players joined</Text>
// // // // // // //         <Text style={styles.progressValue}>
// // // // // // //           {players.length} / {maxPlayers}
// // // // // // //         </Text>
// // // // // // //       </View>
// // // // // // //       <View style={styles.progressTrack}>
// // // // // // //         <View style={[styles.progressFill, { width: `${fillPct}%` }]} />
// // // // // // //       </View>

// // // // // // //       <TouchableOpacity style={styles.startWrap} activeOpacity={0.88} onPress={onStartGame}>
// // // // // // //         <View style={styles.startButton}>
// // // // // // //           <Text style={styles.startButtonText}>START GAME</Text>
// // // // // // //           <View style={styles.startArrow}>
// // // // // // //             <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //       </TouchableOpacity>
// // // // // // //     </View>
// // // // // // //   );

// // // // // // //   return (
// // // // // // //     <View style={styles.flex}>
// // // // // // //       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
// // // // // // //       <SafeAreaView style={styles.flex}>
// // // // // // //         <ScrollView
// // // // // // //           contentContainerStyle={[styles.scroll, { paddingHorizontal: wide ? 32 : 18 }]}
// // // // // // //           showsVerticalScrollIndicator={false}
// // // // // // //         >
// // // // // // //           <View style={styles.column}>
// // // // // // //             {header}

// // // // // // //             {wide ? (
// // // // // // //               <View style={styles.wideRow}>
// // // // // // //                 <View style={{ flex: 1, gap: 18 }}>
// // // // // // //                   {heading}
// // // // // // //                   {playersCard}
// // // // // // //                 </View>
// // // // // // //                 <View style={styles.sideCol}>{codeCard}</View>
// // // // // // //               </View>
// // // // // // //             ) : (
// // // // // // //               <View style={{ gap: 18 }}>
// // // // // // //                 {heading}
// // // // // // //                 {codeCard}
// // // // // // //                 {playersCard}
// // // // // // //               </View>
// // // // // // //             )}
// // // // // // //           </View>
// // // // // // //         </ScrollView>
// // // // // // //       </SafeAreaView>
// // // // // // //     </View>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default RoomWaitingScreen;

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   flex: { flex: 1, backgroundColor: C.bg },
// // // // // // //   scroll: {
// // // // // // //     paddingTop: 12,
// // // // // // //     paddingBottom: 40,
// // // // // // //   },
// // // // // // //   column: {
// // // // // // //     width: "100%",
// // // // // // //     maxWidth: 1040,
// // // // // // //     alignSelf: "center",
// // // // // // //   },
// // // // // // //   wideRow: {
// // // // // // //     flexDirection: "row",
// // // // // // //     gap: 24,
// // // // // // //     alignItems: "flex-start",
// // // // // // //   },
// // // // // // //   sideCol: {
// // // // // // //     width: 380,
// // // // // // //     marginTop: 8,
// // // // // // //   },

// // // // // // //   /* ---- header ---- */
// // // // // // //   header: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "space-between",
// // // // // // //     marginBottom: 8,
// // // // // // //   },
// // // // // // //   headerCenter: {
// // // // // // //     alignItems: "center",
// // // // // // //   },
// // // // // // //   headerTitle: {
// // // // // // //     color: C.text,
// // // // // // //     fontSize: 17,
// // // // // // //     fontWeight: "800",
// // // // // // //   },
// // // // // // //   headerSubRow: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     gap: 6,
// // // // // // //     marginTop: 3,
// // // // // // //   },
// // // // // // //   liveDot: {
// // // // // // //     width: 7,
// // // // // // //     height: 7,
// // // // // // //     borderRadius: 4,
// // // // // // //     backgroundColor: C.green,
// // // // // // //   },
// // // // // // //   headerSub: {
// // // // // // //     color: C.sub,
// // // // // // //     fontSize: 12,
// // // // // // //   },
// // // // // // //   headerRight: {
// // // // // // //     flexDirection: "row",
// // // // // // //     gap: 10,
// // // // // // //   },
// // // // // // //   roundButton: {
// // // // // // //     width: 42,
// // // // // // //     height: 42,
// // // // // // //     borderRadius: 21,
// // // // // // //     backgroundColor: C.card,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: C.border,
// // // // // // //     justifyContent: "center",
// // // // // // //     alignItems: "center",
// // // // // // //   },

// // // // // // //   /* ---- heading ---- */
// // // // // // //   headingBlock: {
// // // // // // //     marginTop: 14,
// // // // // // //   },
// // // // // // //   eyebrow: {
// // // // // // //     color: C.coral,
// // // // // // //     fontSize: 12,
// // // // // // //     fontWeight: "800",
// // // // // // //     letterSpacing: 1.5,
// // // // // // //     marginBottom: 6,
// // // // // // //   },
// // // // // // //   headingTitle: {
// // // // // // //     color: C.text,
// // // // // // //     fontSize: 38,
// // // // // // //     fontWeight: "900",
// // // // // // //     lineHeight: 44,
// // // // // // //   },
// // // // // // //   headingSub: {
// // // // // // //     color: C.sub,
// // // // // // //     fontSize: 15,
// // // // // // //     lineHeight: 22,
// // // // // // //     marginTop: 10,
// // // // // // //     maxWidth: 480,
// // // // // // //   },

// // // // // // //   /* ---- cards ---- */
// // // // // // //   card: {
// // // // // // //     backgroundColor: C.card,
// // // // // // //     borderRadius: 24,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: C.border,
// // // // // // //     padding: 22,
// // // // // // //     shadowColor: "#B8A48C",
// // // // // // //     shadowOpacity: 0.12,
// // // // // // //     shadowRadius: 16,
// // // // // // //     shadowOffset: { width: 0, height: 6 },
// // // // // // //     elevation: 2,
// // // // // // //   },
// // // // // // //   cardHeadRow: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "space-between",
// // // // // // //   },
// // // // // // //   cardTitle: {
// // // // // // //     color: C.text,
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: "800",
// // // // // // //   },
// // // // // // //   cardSub: {
// // // // // // //     color: C.sub,
// // // // // // //     fontSize: 12.5,
// // // // // // //     marginTop: 3,
// // // // // // //   },
// // // // // // //   countPill: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     gap: 6,
// // // // // // //     paddingVertical: 6,
// // // // // // //     paddingHorizontal: 12,
// // // // // // //     borderRadius: 14,
// // // // // // //     backgroundColor: C.indigoSoft,
// // // // // // //   },
// // // // // // //   countPillText: {
// // // // // // //     color: C.indigo,
// // // // // // //     fontWeight: "800",
// // // // // // //     fontSize: 13,
// // // // // // //   },

// // // // // // //   /* ---- players ---- */
// // // // // // //   playerList: {
// // // // // // //     marginTop: 16,
// // // // // // //     gap: 10,
// // // // // // //   },
// // // // // // //   playerRow: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     gap: 12,
// // // // // // //     paddingVertical: 12,
// // // // // // //     paddingHorizontal: 14,
// // // // // // //     borderRadius: 16,
// // // // // // //     backgroundColor: "#FFFBF6",
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: C.border,
// // // // // // //   },
// // // // // // //   avatar: {
// // // // // // //     width: 42,
// // // // // // //     height: 42,
// // // // // // //     borderRadius: 21,
// // // // // // //     justifyContent: "center",
// // // // // // //     alignItems: "center",
// // // // // // //   },
// // // // // // //   avatarText: {
// // // // // // //     color: "#FFFFFF",
// // // // // // //     fontSize: 17,
// // // // // // //     fontWeight: "900",
// // // // // // //   },
// // // // // // //   playerName: {
// // // // // // //     color: C.text,
// // // // // // //     fontSize: 15,
// // // // // // //     fontWeight: "800",
// // // // // // //   },
// // // // // // //   playerTag: {
// // // // // // //     color: C.sub,
// // // // // // //     fontSize: 11.5,
// // // // // // //     marginTop: 2,
// // // // // // //   },
// // // // // // //   readyBadge: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     gap: 6,
// // // // // // //     paddingVertical: 5,
// // // // // // //     paddingHorizontal: 11,
// // // // // // //     borderRadius: 12,
// // // // // // //     backgroundColor: C.greenSoft,
// // // // // // //   },
// // // // // // //   readyDot: {
// // // // // // //     width: 7,
// // // // // // //     height: 7,
// // // // // // //     borderRadius: 4,
// // // // // // //     backgroundColor: C.green,
// // // // // // //   },
// // // // // // //   readyText: {
// // // // // // //     color: C.green,
// // // // // // //     fontSize: 12,
// // // // // // //     fontWeight: "800",
// // // // // // //   },
// // // // // // //   emptyRow: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     gap: 12,
// // // // // // //     paddingVertical: 12,
// // // // // // //     paddingHorizontal: 14,
// // // // // // //     borderRadius: 16,
// // // // // // //     borderWidth: 1.5,
// // // // // // //     borderStyle: "dashed",
// // // // // // //     borderColor: "#E6DACB",
// // // // // // //   },
// // // // // // //   emptyAvatar: {
// // // // // // //     width: 42,
// // // // // // //     height: 42,
// // // // // // //     borderRadius: 21,
// // // // // // //     backgroundColor: "#F6EFE6",
// // // // // // //     justifyContent: "center",
// // // // // // //     alignItems: "center",
// // // // // // //   },
// // // // // // //   emptyText: {
// // // // // // //     flex: 1,
// // // // // // //     color: "#A79D92",
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: "600",
// // // // // // //   },
// // // // // // //   emptyDot: {
// // // // // // //     width: 8,
// // // // // // //     height: 8,
// // // // // // //     borderRadius: 4,
// // // // // // //     backgroundColor: C.coral,
// // // // // // //   },

// // // // // // //   /* ---- code card ---- */
// // // // // // //   tilesRow: {
// // // // // // //     flexDirection: "row",
// // // // // // //     justifyContent: "center",
// // // // // // //     gap: 12,
// // // // // // //     marginTop: 22,
// // // // // // //     marginBottom: 20,
// // // // // // //     flexWrap: "wrap",
// // // // // // //   },
// // // // // // //   tile: {
// // // // // // //     width: 58,
// // // // // // //     height: 58,
// // // // // // //     borderRadius: 16,
// // // // // // //     justifyContent: "center",
// // // // // // //     alignItems: "center",
// // // // // // //     shadowOpacity: 0.35,
// // // // // // //     shadowRadius: 10,
// // // // // // //     shadowOffset: { width: 0, height: 6 },
// // // // // // //     elevation: 4,
// // // // // // //   },
// // // // // // //   tileText: {
// // // // // // //     color: "#FFFFFF",
// // // // // // //     fontSize: 28,
// // // // // // //     fontWeight: "900",
// // // // // // //   },
// // // // // // //   codeActions: {
// // // // // // //     flexDirection: "row",
// // // // // // //     gap: 10,
// // // // // // //   },
// // // // // // //   softButton: {
// // // // // // //     flex: 1,
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     gap: 8,
// // // // // // //     paddingVertical: 12,
// // // // // // //     borderRadius: 14,
// // // // // // //     backgroundColor: C.indigoSoft,
// // // // // // //   },
// // // // // // //   softButtonText: {
// // // // // // //     color: C.indigo,
// // // // // // //     fontWeight: "800",
// // // // // // //     fontSize: 14,
// // // // // // //   },
// // // // // // //   divider: {
// // // // // // //     height: 1,
// // // // // // //     backgroundColor: C.border,
// // // // // // //     marginVertical: 20,
// // // // // // //   },
// // // // // // //   progressHead: {
// // // // // // //     flexDirection: "row",
// // // // // // //     justifyContent: "space-between",
// // // // // // //     marginBottom: 8,
// // // // // // //   },
// // // // // // //   progressLabel: {
// // // // // // //     color: C.sub,
// // // // // // //     fontSize: 13,
// // // // // // //   },
// // // // // // //   progressValue: {
// // // // // // //     color: C.text,
// // // // // // //     fontSize: 13,
// // // // // // //     fontWeight: "800",
// // // // // // //   },
// // // // // // //   progressTrack: {
// // // // // // //     height: 8,
// // // // // // //     borderRadius: 4,
// // // // // // //     backgroundColor: "#F1EAE0",
// // // // // // //     overflow: "hidden",
// // // // // // //   },
// // // // // // //   progressFill: {
// // // // // // //     height: "100%",
// // // // // // //     borderRadius: 4,
// // // // // // //     backgroundColor: C.indigo,
// // // // // // //   },
// // // // // // //   startWrap: {
// // // // // // //     marginTop: 20,
// // // // // // //     borderRadius: 18,
// // // // // // //     shadowColor: C.indigo,
// // // // // // //     shadowOpacity: 0.35,
// // // // // // //     shadowRadius: 14,
// // // // // // //     shadowOffset: { width: 0, height: 8 },
// // // // // // //     elevation: 6,
// // // // // // //   },
// // // // // // //   startButton: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     gap: 12,
// // // // // // //     height: 58,
// // // // // // //     borderRadius: 18,
// // // // // // //     backgroundColor: C.indigo,
// // // // // // //   },
// // // // // // //   startButtonText: {
// // // // // // //     color: "#FFFFFF",
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: "900",
// // // // // // //     letterSpacing: 1,
// // // // // // //   },
// // // // // // //   startArrow: {
// // // // // // //     width: 30,
// // // // // // //     height: 30,
// // // // // // //     borderRadius: 10,
// // // // // // //     backgroundColor: "rgba(255,255,255,0.22)",
// // // // // // //     justifyContent: "center",
// // // // // // //     alignItems: "center",
// // // // // // //   },
// // // // // // // });
// // // // // // import React, { useEffect, useState, useCallback, useRef } from "react";
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   StyleSheet,
// // // // // //   TouchableOpacity,
// // // // // //   ScrollView,
// // // // // //   Share,
// // // // // //   SafeAreaView,
// // // // // //   StatusBar,
// // // // // //   Animated,
// // // // // //   Easing,
// // // // // //   Platform,
// // // // // //   ActivityIndicator,
// // // // // //   useWindowDimensions,
// // // // // // } from "react-native";
// // // // // // import { Ionicons } from "@expo/vector-icons";
// // // // // // import { fetchRoom, WordScrambleRoom } from "../api/Wordscrambleapi";
// // // // // // import { setReady, leaveRoom } from "../api/wsProfileApi";

// // // // // // interface RoomWaitingScreenProps {
// // // // // //   roomCode: string;
// // // // // //   maxPlayers: number; // fallback only — the room JSON from the backend wins
// // // // // //   playerName: string; // the logged-in player's name (from backend profile)
// // // // // //   onBack: () => void;
// // // // // //   onStartGame: () => void | Promise<void>;
// // // // // //   onOpenChat: () => void;
// // // // // //   onOpenRoomSettings: () => void;
// // // // // // }

// // // // // // /* ---------- Word Scramble theme ---------- */
// // // // // // const C = {
// // // // // //   bg: "#FFF8F1",
// // // // // //   card: "#FFFFFF",
// // // // // //   border: "#F1E7DC",
// // // // // //   text: "#141B34",
// // // // // //   sub: "#6B7280",
// // // // // //   indigo: "#4F46E5",
// // // // // //   indigoSoft: "#EEF0FF",
// // // // // //   coral: "#FF6B57",
// // // // // //   coralSoft: "#FFECE8",
// // // // // //   yellow: "#F2B640",
// // // // // //   blue: "#3B82F6",
// // // // // //   red: "#F0566A",
// // // // // //   green: "#22B573",
// // // // // //   greenSoft: "#E3F6EC",
// // // // // //   grey: "#8A93A6",
// // // // // //   greySoft: "#F1EEF0",
// // // // // // };

// // // // // // const TILE_COLORS = [C.yellow, C.blue, C.red, C.green];
// // // // // // const TILE_ROTATIONS = ["-6deg", "4deg", "-3deg", "5deg"];
// // // // // // // only used when the backend doesn't send an avatar colour for a player
// // // // // // const FALLBACK_AVATARS = [C.coral, C.blue, C.green, C.yellow, C.red, C.indigo, "#14B8A6", "#F97316"];

// // // // // // /* ---------- backend field helpers (support snake_case + camelCase) ---------- */
// // // // // // const pick = (obj: any, ...keys: string[]) => {
// // // // // //   for (const k of keys) if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
// // // // // //   return undefined;
// // // // // // };

// // // // // // const statusInfo = (status?: string, loaded?: boolean): { label: string; color: string } => {
// // // // // //   if (!loaded) return { label: "Connecting…", color: C.grey };
// // // // // //   switch ((status || "").toLowerCase()) {
// // // // // //     case "waiting":
// // // // // //     case "lobby":
// // // // // //     case "open":
// // // // // //       return { label: "Lobby open", color: C.green };
// // // // // //     case "playing":
// // // // // //     case "in_progress":
// // // // // //     case "started":
// // // // // //       return { label: "Game in progress", color: C.blue };
// // // // // //     case "finished":
// // // // // //     case "ended":
// // // // // //     case "completed":
// // // // // //       return { label: "Game finished", color: C.grey };
// // // // // //     default:
// // // // // //       return { label: status ? status.charAt(0).toUpperCase() + status.slice(1) : "Lobby open", color: C.green };
// // // // // //   }
// // // // // // };

// // // // // // const RoomWaitingScreen: React.FC<RoomWaitingScreenProps> = ({
// // // // // //   roomCode,
// // // // // //   maxPlayers,
// // // // // //   playerName,
// // // // // //   onBack,
// // // // // //   onStartGame,
// // // // // //   onOpenChat,
// // // // // //   onOpenRoomSettings,
// // // // // // }) => {
// // // // // //   const { width } = useWindowDimensions();
// // // // // //   const wide = width >= 900;

// // // // // //   const [room, setRoom] = useState<WordScrambleRoom | null>(null);
// // // // // //   const [connError, setConnError] = useState(false);
// // // // // //   const [copied, setCopied] = useState(false);
// // // // // //   const [starting, setStarting] = useState(false);
// // // // // //   const [togglingReady, setTogglingReady] = useState(false);

// // // // // //   const poll = useCallback(async () => {
// // // // // //     try {
// // // // // //       const r = await fetchRoom(roomCode);
// // // // // //       setRoom(r);
// // // // // //       setConnError(false);
// // // // // //     } catch (err) {
// // // // // //       console.warn("Room poll failed:", err);
// // // // // //       setConnError(true);
// // // // // //     }
// // // // // //   }, [roomCode]);

// // // // // //   // useEffect(() => {
// // // // // //   //   poll();
// // // // // //   //   const interval = setInterval(poll, 2500);
// // // // // //   //   return () => clearInterval(interval);
// // // // // //   // }, [poll]);
// // // // // // useEffect(() => {
// // // // // //     poll();
// // // // // //     if (players.length >= max) return; // room's full — nothing left to wait for, stop hitting the backend
// // // // // //     const interval = setInterval(poll, 2500);
// // // // // //     return () => clearInterval(interval);
// // // // // //   }, [poll, players.length, max]);
// // // // // //   /* ---------- pulsing dot ---------- */
// // // // // //   const pulse = useRef(new Animated.Value(0.35)).current;
// // // // // //   useEffect(() => {
// // // // // //     const loop = Animated.loop(
// // // // // //       Animated.sequence([
// // // // // //         Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // // // // //         Animated.timing(pulse, { toValue: 0.35, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // // // // //       ])
// // // // // //     );
// // // // // //     loop.start();
// // // // // //     return () => loop.stop();
// // // // // //   }, []);

// // // // // //   /* ---------- everything below is derived from the backend JSON ---------- */
// // // // // //   const loaded = room !== null;
// // // // // //   const r: any = room || {};
// // // // // //   const players: any[] = r.players || [];
// // // // // //   const max = Number(pick(r, "maxPlayers", "max_players")) || maxPlayers;
// // // // // //   const minPlayers = Number(pick(r, "minPlayers", "min_players")) || 0;
// // // // // //   const roomName: string | undefined = pick(r, "roomName", "room_name", "name");
// // // // // //   const status = statusInfo(r.status, loaded);

// // // // // //   const me = players.find((p) => p.player_name === playerName);
// // // // // //   const hasReadyField = players.some((p) => typeof pick(p, "is_ready", "isReady") === "boolean");
// // // // // //   const myReady = !!pick(me, "is_ready", "isReady");

// // // // // //   const needMore = Math.max(0, minPlayers - players.length);
// // // // // //   const canStart = loaded && needMore === 0 && !starting;
// // // // // //   const emptySlots = Math.max(0, Math.min(max - players.length, 8));
// // // // // //   const fillPct = max > 0 ? Math.min(100, (players.length / max) * 100) : 0;

// // // // // //   /* ---------- actions ---------- */
// // // // // //   const flashCopied = () => {
// // // // // //     setCopied(true);
// // // // // //     setTimeout(() => setCopied(false), 2000);
// // // // // //   };

// // // // // //   const handleShare = async () => {
// // // // // //     const message = `Join my Word Scramble room! Code: ${roomCode}`;
// // // // // //     try {
// // // // // //       if (Platform.OS === "web") {
// // // // // //         const nav: any = typeof navigator !== "undefined" ? navigator : null;
// // // // // //         if (nav?.share) {
// // // // // //           await nav.share({ text: message });
// // // // // //           return;
// // // // // //         }
// // // // // //         if (nav?.clipboard?.writeText) {
// // // // // //           await nav.clipboard.writeText(message);
// // // // // //           flashCopied();
// // // // // //           return;
// // // // // //         }
// // // // // //       }
// // // // // //       await Share.share({ message });
// // // // // //     } catch {
// // // // // //       // cancelled / unsupported
// // // // // //     }
// // // // // //   };

// // // // // //   const handleCopy = async () => {
// // // // // //     try {
// // // // // //       const nav: any = typeof navigator !== "undefined" ? navigator : null;
// // // // // //       if (Platform.OS === "web" && nav?.clipboard?.writeText) {
// // // // // //         await nav.clipboard.writeText(roomCode);
// // // // // //         flashCopied();
// // // // // //         return;
// // // // // //       }
// // // // // //       await Share.share({ message: roomCode });
// // // // // //     } catch {
// // // // // //       // ignore
// // // // // //     }
// // // // // //   };

// // // // // //   const handleStart = async () => {
// // // // // //     if (!canStart) return;
// // // // // //     setStarting(true);
// // // // // //     try {
// // // // // //       await onStartGame();
// // // // // //     } finally {
// // // // // //       setStarting(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleToggleReady = async () => {
// // // // // //     if (togglingReady || !me) return;
// // // // // //     setTogglingReady(true);
// // // // // //     try {
// // // // // //       await setReady(roomCode, playerName, !myReady);
// // // // // //       await poll();
// // // // // //     } catch (err) {
// // // // // //       console.warn("Ready toggle failed:", err);
// // // // // //     } finally {
// // // // // //       setTogglingReady(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleBack = async () => {
// // // // // //     // tell the server we left so the slot is freed for someone else
// // // // // //     try {
// // // // // //       await leaveRoom(roomCode, playerName);
// // // // // //     } catch {
// // // // // //       // endpoint missing / offline — still go back
// // // // // //     }
// // // // // //     onBack();
// // // // // //   };

// // // // // //   /* ---------------- pieces ---------------- */

// // // // // //   const header = (
// // // // // //     <View style={styles.header}>
// // // // // //       <TouchableOpacity style={styles.roundButton} onPress={handleBack} activeOpacity={0.8}>
// // // // // //         <Ionicons name="arrow-back" size={20} color={C.text} />
// // // // // //       </TouchableOpacity>

// // // // // //       <View style={styles.headerCenter}>
// // // // // //         <Text style={styles.headerTitle} numberOfLines={1}>
// // // // // //           {roomName ? roomName : `Room ${roomCode}`}
// // // // // //         </Text>
// // // // // //         <View style={styles.headerSubRow}>
// // // // // //           <Animated.View style={[styles.liveDot, { backgroundColor: status.color, opacity: pulse }]} />
// // // // // //           <Text style={styles.headerSub}>
// // // // // //             {status.label}
// // // // // //             {roomName ? ` • ${roomCode}` : ""}
// // // // // //           </Text>
// // // // // //         </View>
// // // // // //       </View>

// // // // // //       <View style={styles.headerRight}>
// // // // // //         <TouchableOpacity style={styles.roundButton} onPress={onOpenChat} activeOpacity={0.8}>
// // // // // //           <Ionicons name="chatbubble-ellipses-outline" size={19} color={C.indigo} />
// // // // // //         </TouchableOpacity>
// // // // // //         <TouchableOpacity style={styles.roundButton} onPress={onOpenRoomSettings} activeOpacity={0.8}>
// // // // // //           <Ionicons name="settings-outline" size={19} color={C.indigo} />
// // // // // //         </TouchableOpacity>
// // // // // //       </View>
// // // // // //     </View>
// // // // // //   );

// // // // // //   const errorBanner = connError ? (
// // // // // //     <View style={styles.errorBanner}>
// // // // // //       <Ionicons name="cloud-offline-outline" size={16} color={C.coral} />
// // // // // //       <Text style={styles.errorText}>Can't reach the server. Retrying…</Text>
// // // // // //     </View>
// // // // // //   ) : null;

// // // // // //   const heading = (
// // // // // //     <View style={styles.headingBlock}>
// // // // // //       <Text style={styles.eyebrow}>LOBBY</Text>
// // // // // //       <Text style={[styles.headingTitle, !wide && styles.headingTitlePhone]}>Waiting for</Text>
// // // // // //       <Text style={[styles.headingTitle, !wide && styles.headingTitlePhone, { color: C.indigo }]}>players…</Text>
// // // // // //       <Text style={styles.headingSub}>
// // // // // //         Share the room code with your friends. The game starts when you're ready.
// // // // // //       </Text>
// // // // // //     </View>
// // // // // //   );

// // // // // //   const playersCard = (
// // // // // //     <View style={styles.card}>
// // // // // //       <View style={styles.cardHeadRow}>
// // // // // //         <View>
// // // // // //           <Text style={styles.cardTitle}>Players</Text>
// // // // // //           <Text style={styles.cardSub}>Everyone in this room</Text>
// // // // // //         </View>
// // // // // //         <View style={styles.countPill}>
// // // // // //           <Ionicons name="people-outline" size={14} color={C.indigo} />
// // // // // //           <Text style={styles.countPillText}>
// // // // // //             {players.length}/{max}
// // // // // //           </Text>
// // // // // //         </View>
// // // // // //       </View>

// // // // // //       <View style={styles.playerList}>
// // // // // //         {/* loading skeleton until the first response arrives */}
// // // // // //         {!loaded && !connError
// // // // // //           ? [0, 1].map((i) => (
// // // // // //               <View key={`sk-${i}`} style={[styles.playerRow, { opacity: 0.6 }]}>
// // // // // //                 <View style={[styles.avatar, { backgroundColor: C.greySoft }]} />
// // // // // //                 <View style={{ flex: 1, gap: 6 }}>
// // // // // //                   <View style={[styles.skelLine, { width: "40%" }]} />
// // // // // //                   <View style={[styles.skelLine, { width: "25%", height: 8 }]} />
// // // // // //                 </View>
// // // // // //               </View>
// // // // // //             ))
// // // // // //           : null}

// // // // // //         {players.map((p, i) => {
// // // // // //           const isMe = p.player_name === playerName;
// // // // // //           const isHost = !!pick(p, "is_host", "isHost");
// // // // // //           const readyVal = pick(p, "is_ready", "isReady");
// // // // // //           const color = pick(p, "avatar_color", "avatarColor") || FALLBACK_AVATARS[i % FALLBACK_AVATARS.length];
// // // // // //           return (
// // // // // //             <View key={String(p.id ?? p.player_name)} style={styles.playerRow}>
// // // // // //               <View style={[styles.avatar, { backgroundColor: color }]}>
// // // // // //                 <Text style={styles.avatarText}>{(p.player_name || "?").charAt(0).toUpperCase()}</Text>
// // // // // //               </View>

// // // // // //               <View style={{ flex: 1 }}>
// // // // // //                 <Text style={styles.playerName} numberOfLines={1}>
// // // // // //                   {p.player_name}
// // // // // //                 </Text>
// // // // // //                 {isMe || isHost ? (
// // // // // //                   <Text style={styles.playerTag}>{[isMe ? "That's you" : null, isHost ? "Host" : null].filter(Boolean).join(" • ")}</Text>
// // // // // //                 ) : null}
// // // // // //               </View>

// // // // // //               {typeof readyVal === "boolean" ? (
// // // // // //                 <View style={[styles.badge, { backgroundColor: readyVal ? C.greenSoft : C.greySoft }]}>
// // // // // //                   <View style={[styles.badgeDot, { backgroundColor: readyVal ? C.green : C.grey }]} />
// // // // // //                   <Text style={[styles.badgeText, { color: readyVal ? C.green : C.grey }]}>
// // // // // //                     {readyVal ? "Ready" : "Not ready"}
// // // // // //                   </Text>
// // // // // //                 </View>
// // // // // //               ) : null}
// // // // // //             </View>
// // // // // //           );
// // // // // //         })}

// // // // // //         {loaded
// // // // // //           ? Array.from({ length: emptySlots }).map((_, i) => (
// // // // // //               <View key={`empty-${i}`} style={styles.emptyRow}>
// // // // // //                 <View style={styles.emptyAvatar}>
// // // // // //                   <Ionicons name="person-add-outline" size={15} color="#B8AFA5" />
// // // // // //                 </View>
// // // // // //                 <Text style={styles.emptyText}>Waiting for player…</Text>
// // // // // //                 <Animated.View style={[styles.emptyDot, { opacity: pulse }]} />
// // // // // //               </View>
// // // // // //             ))
// // // // // //           : null}
// // // // // //       </View>
// // // // // //     </View>
// // // // // //   );

// // // // // //   const codeCard = (
// // // // // //     <View style={styles.card}>
// // // // // //       <Text style={styles.cardTitle}>Room code</Text>
// // // // // //       <Text style={styles.cardSub}>Friends enter this to join</Text>

// // // // // //       <View style={styles.tilesRow}>
// // // // // //         {roomCode.split("").map((ch, i) => (
// // // // // //           <View
// // // // // //             key={i}
// // // // // //             style={[
// // // // // //               styles.tile,
// // // // // //               {
// // // // // //                 backgroundColor: TILE_COLORS[i % TILE_COLORS.length],
// // // // // //                 transform: [{ rotate: TILE_ROTATIONS[i % TILE_ROTATIONS.length] }],
// // // // // //                 shadowColor: TILE_COLORS[i % TILE_COLORS.length],
// // // // // //               },
// // // // // //             ]}
// // // // // //           >
// // // // // //             <Text style={styles.tileText}>{ch}</Text>
// // // // // //           </View>
// // // // // //         ))}
// // // // // //       </View>

// // // // // //       <View style={styles.codeActions}>
// // // // // //         <TouchableOpacity style={styles.softButton} onPress={handleCopy} activeOpacity={0.8}>
// // // // // //           <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color={C.indigo} />
// // // // // //           <Text style={styles.softButtonText}>{copied ? "Copied!" : "Copy"}</Text>
// // // // // //         </TouchableOpacity>
// // // // // //         <TouchableOpacity style={styles.softButton} onPress={handleShare} activeOpacity={0.8}>
// // // // // //           <Ionicons name="share-social-outline" size={16} color={C.indigo} />
// // // // // //           <Text style={styles.softButtonText}>Share</Text>
// // // // // //         </TouchableOpacity>
// // // // // //       </View>

// // // // // //       <View style={styles.divider} />

// // // // // //       <View style={styles.progressHead}>
// // // // // //         <Text style={styles.progressLabel}>Players joined</Text>
// // // // // //         <Text style={styles.progressValue}>
// // // // // //           {players.length} / {max}
// // // // // //         </Text>
// // // // // //       </View>
// // // // // //       <View style={styles.progressTrack}>
// // // // // //         <View style={[styles.progressFill, { width: `${fillPct}%` }]} />
// // // // // //       </View>

// // // // // //       {/* ready toggle — only when the backend tracks readiness */}
// // // // // //       {hasReadyField && me ? (
// // // // // //         <TouchableOpacity
// // // // // //           style={[styles.readyToggle, myReady && styles.readyToggleOn]}
// // // // // //           onPress={handleToggleReady}
// // // // // //           activeOpacity={0.85}
// // // // // //           disabled={togglingReady}
// // // // // //         >
// // // // // //           <Ionicons
// // // // // //             name={myReady ? "checkmark-circle" : "ellipse-outline"}
// // // // // //             size={18}
// // // // // //             color={myReady ? C.green : C.indigo}
// // // // // //           />
// // // // // //           <Text style={[styles.readyToggleText, { color: myReady ? C.green : C.indigo }]}>
// // // // // //             {myReady ? "You're ready" : "Mark me as ready"}
// // // // // //           </Text>
// // // // // //         </TouchableOpacity>
// // // // // //       ) : null}

// // // // // //       <TouchableOpacity
// // // // // //         style={[styles.startWrap, !canStart && styles.startWrapDisabled]}
// // // // // //         activeOpacity={0.88}
// // // // // //         onPress={handleStart}
// // // // // //         disabled={!canStart}
// // // // // //       >
// // // // // //         <View style={[styles.startButton, !canStart && styles.startButtonDisabled]}>
// // // // // //           {starting ? (
// // // // // //             <ActivityIndicator color="#FFFFFF" />
// // // // // //           ) : (
// // // // // //             <>
// // // // // //               <Text style={styles.startButtonText}>START GAME</Text>
// // // // // //               <View style={styles.startArrow}>
// // // // // //                 <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
// // // // // //               </View>
// // // // // //             </>
// // // // // //           )}
// // // // // //         </View>
// // // // // //       </TouchableOpacity>

// // // // // //       {needMore > 0 ? (
// // // // // //         <Text style={styles.startHint}>
// // // // // //           Need {needMore} more {needMore === 1 ? "player" : "players"} to start
// // // // // //         </Text>
// // // // // //       ) : null}
// // // // // //     </View>
// // // // // //   );

// // // // // //   return (
// // // // // //     <View style={styles.flex}>
// // // // // //       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
// // // // // //       <SafeAreaView style={styles.flex}>
// // // // // //         <ScrollView
// // // // // //           contentContainerStyle={[
// // // // // //             styles.scroll,
// // // // // //             {
// // // // // //               paddingHorizontal: wide ? 32 : 16,
// // // // // //               paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 8 : 16,
// // // // // //             },
// // // // // //           ]}
// // // // // //           showsVerticalScrollIndicator={false}
// // // // // //         >
// // // // // //           <View style={styles.column}>
// // // // // //             {header}
// // // // // //             {errorBanner}

// // // // // //             {wide ? (
// // // // // //               <View style={styles.wideRow}>
// // // // // //                 <View style={{ flex: 1, gap: 18 }}>
// // // // // //                   {heading}
// // // // // //                   {playersCard}
// // // // // //                 </View>
// // // // // //                 <View style={styles.sideCol}>{codeCard}</View>
// // // // // //               </View>
// // // // // //             ) : (
// // // // // //               <View style={{ gap: 16 }}>
// // // // // //                 {heading}
// // // // // //                 {codeCard}
// // // // // //                 {playersCard}
// // // // // //               </View>
// // // // // //             )}
// // // // // //           </View>
// // // // // //         </ScrollView>
// // // // // //       </SafeAreaView>
// // // // // //     </View>
// // // // // //   );
// // // // // // };

// // // // // // export default RoomWaitingScreen;

// // // // // // const styles = StyleSheet.create({
// // // // // //   flex: { flex: 1, backgroundColor: C.bg },
// // // // // //   scroll: {
// // // // // //     paddingBottom: 32,
// // // // // //   },
// // // // // //   column: {
// // // // // //     width: "100%",
// // // // // //     maxWidth: 1040,
// // // // // //     alignSelf: "center",
// // // // // //   },
// // // // // //   wideRow: {
// // // // // //     flexDirection: "row",
// // // // // //     gap: 24,
// // // // // //     alignItems: "flex-start",
// // // // // //   },
// // // // // //   sideCol: {
// // // // // //     width: 380,
// // // // // //     marginTop: 8,
// // // // // //   },

// // // // // //   /* ---- header ---- */
// // // // // //   header: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "space-between",
// // // // // //     marginBottom: 8,
// // // // // //     gap: 8,
// // // // // //   },
// // // // // //   headerCenter: {
// // // // // //     flex: 1,
// // // // // //     alignItems: "center",
// // // // // //   },
// // // // // //   headerTitle: {
// // // // // //     color: C.text,
// // // // // //     fontSize: 17,
// // // // // //     fontWeight: "800",
// // // // // //   },
// // // // // //   headerSubRow: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     gap: 6,
// // // // // //     marginTop: 3,
// // // // // //   },
// // // // // //   liveDot: {
// // // // // //     width: 7,
// // // // // //     height: 7,
// // // // // //     borderRadius: 4,
// // // // // //   },
// // // // // //   headerSub: {
// // // // // //     color: C.sub,
// // // // // //     fontSize: 12,
// // // // // //   },
// // // // // //   headerRight: {
// // // // // //     flexDirection: "row",
// // // // // //     gap: 8,
// // // // // //   },
// // // // // //   roundButton: {
// // // // // //     width: 42,
// // // // // //     height: 42,
// // // // // //     borderRadius: 21,
// // // // // //     backgroundColor: C.card,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: C.border,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //   },
// // // // // //   errorBanner: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     gap: 8,
// // // // // //     marginTop: 8,
// // // // // //     paddingVertical: 10,
// // // // // //     paddingHorizontal: 14,
// // // // // //     borderRadius: 14,
// // // // // //     backgroundColor: C.coralSoft,
// // // // // //   },
// // // // // //   errorText: {
// // // // // //     color: C.coral,
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: "700",
// // // // // //   },

// // // // // //   /* ---- heading ---- */
// // // // // //   headingBlock: {
// // // // // //     marginTop: 14,
// // // // // //   },
// // // // // //   eyebrow: {
// // // // // //     color: C.coral,
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: "800",
// // // // // //     letterSpacing: 1.5,
// // // // // //     marginBottom: 6,
// // // // // //   },
// // // // // //   headingTitle: {
// // // // // //     color: C.text,
// // // // // //     fontSize: 38,
// // // // // //     fontWeight: "900",
// // // // // //     lineHeight: 44,
// // // // // //   },
// // // // // //   headingTitlePhone: {
// // // // // //     fontSize: 30,
// // // // // //     lineHeight: 36,
// // // // // //   },
// // // // // //   headingSub: {
// // // // // //     color: C.sub,
// // // // // //     fontSize: 15,
// // // // // //     lineHeight: 22,
// // // // // //     marginTop: 10,
// // // // // //     maxWidth: 480,
// // // // // //   },

// // // // // //   /* ---- cards ---- */
// // // // // //   card: {
// // // // // //     backgroundColor: C.card,
// // // // // //     borderRadius: 24,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: C.border,
// // // // // //     padding: 20,
// // // // // //     shadowColor: "#B8A48C",
// // // // // //     shadowOpacity: 0.12,
// // // // // //     shadowRadius: 16,
// // // // // //     shadowOffset: { width: 0, height: 6 },
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   cardHeadRow: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "space-between",
// // // // // //   },
// // // // // //   cardTitle: {
// // // // // //     color: C.text,
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: "800",
// // // // // //   },
// // // // // //   cardSub: {
// // // // // //     color: C.sub,
// // // // // //     fontSize: 12.5,
// // // // // //     marginTop: 3,
// // // // // //   },
// // // // // //   countPill: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     gap: 6,
// // // // // //     paddingVertical: 6,
// // // // // //     paddingHorizontal: 12,
// // // // // //     borderRadius: 14,
// // // // // //     backgroundColor: C.indigoSoft,
// // // // // //   },
// // // // // //   countPillText: {
// // // // // //     color: C.indigo,
// // // // // //     fontWeight: "800",
// // // // // //     fontSize: 13,
// // // // // //   },

// // // // // //   /* ---- players ---- */
// // // // // //   playerList: {
// // // // // //     marginTop: 16,
// // // // // //     gap: 10,
// // // // // //   },
// // // // // //   playerRow: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     gap: 12,
// // // // // //     paddingVertical: 12,
// // // // // //     paddingHorizontal: 14,
// // // // // //     borderRadius: 16,
// // // // // //     backgroundColor: "#FFFBF6",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: C.border,
// // // // // //   },
// // // // // //   avatar: {
// // // // // //     width: 42,
// // // // // //     height: 42,
// // // // // //     borderRadius: 21,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //   },
// // // // // //   avatarText: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 17,
// // // // // //     fontWeight: "900",
// // // // // //   },
// // // // // //   playerName: {
// // // // // //     color: C.text,
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: "800",
// // // // // //   },
// // // // // //   playerTag: {
// // // // // //     color: C.sub,
// // // // // //     fontSize: 11.5,
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   badge: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     gap: 6,
// // // // // //     paddingVertical: 5,
// // // // // //     paddingHorizontal: 11,
// // // // // //     borderRadius: 12,
// // // // // //   },
// // // // // //   badgeDot: {
// // // // // //     width: 7,
// // // // // //     height: 7,
// // // // // //     borderRadius: 4,
// // // // // //   },
// // // // // //   badgeText: {
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: "800",
// // // // // //   },
// // // // // //   skelLine: {
// // // // // //     height: 12,
// // // // // //     borderRadius: 6,
// // // // // //     backgroundColor: C.greySoft,
// // // // // //   },
// // // // // //   emptyRow: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     gap: 12,
// // // // // //     paddingVertical: 12,
// // // // // //     paddingHorizontal: 14,
// // // // // //     borderRadius: 16,
// // // // // //     borderWidth: 1.5,
// // // // // //     borderStyle: "dashed",
// // // // // //     borderColor: "#E6DACB",
// // // // // //   },
// // // // // //   emptyAvatar: {
// // // // // //     width: 42,
// // // // // //     height: 42,
// // // // // //     borderRadius: 21,
// // // // // //     backgroundColor: "#F6EFE6",
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //   },
// // // // // //   emptyText: {
// // // // // //     flex: 1,
// // // // // //     color: "#A79D92",
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: "600",
// // // // // //   },
// // // // // //   emptyDot: {
// // // // // //     width: 8,
// // // // // //     height: 8,
// // // // // //     borderRadius: 4,
// // // // // //     backgroundColor: C.coral,
// // // // // //   },

// // // // // //   /* ---- code card ---- */
// // // // // //   tilesRow: {
// // // // // //     flexDirection: "row",
// // // // // //     justifyContent: "center",
// // // // // //     gap: 10,
// // // // // //     marginTop: 20,
// // // // // //     marginBottom: 18,
// // // // // //     flexWrap: "wrap",
// // // // // //   },
// // // // // //   tile: {
// // // // // //     width: 54,
// // // // // //     height: 54,
// // // // // //     borderRadius: 15,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //     shadowOpacity: 0.35,
// // // // // //     shadowRadius: 10,
// // // // // //     shadowOffset: { width: 0, height: 6 },
// // // // // //     elevation: 4,
// // // // // //   },
// // // // // //   tileText: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 26,
// // // // // //     fontWeight: "900",
// // // // // //   },
// // // // // //   codeActions: {
// // // // // //     flexDirection: "row",
// // // // // //     gap: 10,
// // // // // //   },
// // // // // //   softButton: {
// // // // // //     flex: 1,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     gap: 8,
// // // // // //     paddingVertical: 12,
// // // // // //     borderRadius: 14,
// // // // // //     backgroundColor: C.indigoSoft,
// // // // // //   },
// // // // // //   softButtonText: {
// // // // // //     color: C.indigo,
// // // // // //     fontWeight: "800",
// // // // // //     fontSize: 14,
// // // // // //   },
// // // // // //   divider: {
// // // // // //     height: 1,
// // // // // //     backgroundColor: C.border,
// // // // // //     marginVertical: 18,
// // // // // //   },
// // // // // //   progressHead: {
// // // // // //     flexDirection: "row",
// // // // // //     justifyContent: "space-between",
// // // // // //     marginBottom: 8,
// // // // // //   },
// // // // // //   progressLabel: {
// // // // // //     color: C.sub,
// // // // // //     fontSize: 13,
// // // // // //   },
// // // // // //   progressValue: {
// // // // // //     color: C.text,
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: "800",
// // // // // //   },
// // // // // //   progressTrack: {
// // // // // //     height: 8,
// // // // // //     borderRadius: 4,
// // // // // //     backgroundColor: "#F1EAE0",
// // // // // //     overflow: "hidden",
// // // // // //   },
// // // // // //   progressFill: {
// // // // // //     height: "100%",
// // // // // //     borderRadius: 4,
// // // // // //     backgroundColor: C.indigo,
// // // // // //   },
// // // // // //   readyToggle: {
// // // // // //     marginTop: 16,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     gap: 8,
// // // // // //     paddingVertical: 12,
// // // // // //     borderRadius: 14,
// // // // // //     borderWidth: 1.5,
// // // // // //     borderColor: C.indigo,
// // // // // //     backgroundColor: "#FFFFFF",
// // // // // //   },
// // // // // //   readyToggleOn: {
// // // // // //     borderColor: C.green,
// // // // // //     backgroundColor: C.greenSoft,
// // // // // //   },
// // // // // //   readyToggleText: {
// // // // // //     fontWeight: "800",
// // // // // //     fontSize: 14,
// // // // // //   },
// // // // // //   startWrap: {
// // // // // //     marginTop: 16,
// // // // // //     borderRadius: 18,
// // // // // //     shadowColor: C.indigo,
// // // // // //     shadowOpacity: 0.35,
// // // // // //     shadowRadius: 14,
// // // // // //     shadowOffset: { width: 0, height: 8 },
// // // // // //     elevation: 6,
// // // // // //   },
// // // // // //   startWrapDisabled: {
// // // // // //     shadowOpacity: 0,
// // // // // //     elevation: 0,
// // // // // //   },
// // // // // //   startButton: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     gap: 12,
// // // // // //     height: 58,
// // // // // //     borderRadius: 18,
// // // // // //     backgroundColor: C.indigo,
// // // // // //   },
// // // // // //   startButtonDisabled: {
// // // // // //     backgroundColor: "#B9B6EE",
// // // // // //   },
// // // // // //   startButtonText: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: "900",
// // // // // //     letterSpacing: 1,
// // // // // //   },
// // // // // //   startArrow: {
// // // // // //     width: 30,
// // // // // //     height: 30,
// // // // // //     borderRadius: 10,
// // // // // //     backgroundColor: "rgba(255,255,255,0.22)",
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //   },
// // // // // //   startHint: {
// // // // // //     color: C.sub,
// // // // // //     fontSize: 12.5,
// // // // // //     textAlign: "center",
// // // // // //     marginTop: 10,
// // // // // //   },
// // // // // // });
// // // // // import React, { useEffect, useState, useCallback, useRef } from "react";
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   StyleSheet,
// // // // //   TouchableOpacity,
// // // // //   ScrollView,
// // // // //   Share,
// // // // //   SafeAreaView,
// // // // //   StatusBar,
// // // // //   Animated,
// // // // //   Easing,
// // // // //   Platform,
// // // // //   ActivityIndicator,
// // // // //   useWindowDimensions,
// // // // // } from "react-native";
// // // // // import { Ionicons } from "@expo/vector-icons";
// // // // // import { fetchRoom, WordScrambleRoom } from "../api/Wordscrambleapi";
// // // // // import { setReady, leaveRoom } from "../api/wsProfileApi";

// // // // // interface RoomWaitingScreenProps {
// // // // //   roomCode: string;
// // // // //   maxPlayers: number; // fallback only — the room JSON from the backend wins
// // // // //   playerName: string; // the logged-in player's name (from backend profile)
// // // // //   onBack: () => void;
// // // // //   onStartGame: () => void | Promise<void>;
// // // // //   onOpenChat: () => void;
// // // // //   onOpenRoomSettings: () => void;
// // // // // }

// // // // // /* ---------- Word Scramble theme ---------- */
// // // // // const C = {
// // // // //   bg: "#FFF8F1",
// // // // //   card: "#FFFFFF",
// // // // //   border: "#F1E7DC",
// // // // //   text: "#141B34",
// // // // //   sub: "#6B7280",
// // // // //   indigo: "#4F46E5",
// // // // //   indigoSoft: "#EEF0FF",
// // // // //   coral: "#FF6B57",
// // // // //   coralSoft: "#FFECE8",
// // // // //   yellow: "#F2B640",
// // // // //   blue: "#3B82F6",
// // // // //   red: "#F0566A",
// // // // //   green: "#22B573",
// // // // //   greenSoft: "#E3F6EC",
// // // // //   grey: "#8A93A6",
// // // // //   greySoft: "#F1EEF0",
// // // // // };

// // // // // const TILE_COLORS = [C.yellow, C.blue, C.red, C.green];
// // // // // const TILE_ROTATIONS = ["-6deg", "4deg", "-3deg", "5deg"];
// // // // // // only used when the backend doesn't send an avatar colour for a player
// // // // // const FALLBACK_AVATARS = [C.coral, C.blue, C.green, C.yellow, C.red, C.indigo, "#14B8A6", "#F97316"];

// // // // // /* ---------- backend field helpers (support snake_case + camelCase) ---------- */
// // // // // const pick = (obj: any, ...keys: string[]) => {
// // // // //   for (const k of keys) if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
// // // // //   return undefined;
// // // // // };

// // // // // const statusInfo = (status?: string, loaded?: boolean): { label: string; color: string } => {
// // // // //   if (!loaded) return { label: "Connecting…", color: C.grey };
// // // // //   switch ((status || "").toLowerCase()) {
// // // // //     case "waiting":
// // // // //     case "lobby":
// // // // //     case "open":
// // // // //       return { label: "Lobby open", color: C.green };
// // // // //     case "playing":
// // // // //     case "in_progress":
// // // // //     case "started":
// // // // //       return { label: "Game in progress", color: C.blue };
// // // // //     case "finished":
// // // // //     case "ended":
// // // // //     case "completed":
// // // // //       return { label: "Game finished", color: C.grey };
// // // // //     default:
// // // // //       return { label: status ? status.charAt(0).toUpperCase() + status.slice(1) : "Lobby open", color: C.green };
// // // // //   }
// // // // // };

// // // // // const RoomWaitingScreen: React.FC<RoomWaitingScreenProps> = ({
// // // // //   roomCode,
// // // // //   maxPlayers,
// // // // //   playerName,
// // // // //   onBack,
// // // // //   onStartGame,
// // // // //   onOpenChat,
// // // // //   onOpenRoomSettings,
// // // // // }) => {
// // // // //   const { width } = useWindowDimensions();
// // // // //   const wide = width >= 900;

// // // // //   const [room, setRoom] = useState<WordScrambleRoom | null>(null);
// // // // //   const [connError, setConnError] = useState(false);
// // // // //   const [copied, setCopied] = useState(false);
// // // // //   const [starting, setStarting] = useState(false);
// // // // //   const [togglingReady, setTogglingReady] = useState(false);

// // // // //   const poll = useCallback(async () => {
// // // // //     try {
// // // // //       const r = await fetchRoom(roomCode);
// // // // //       setRoom(r);
// // // // //       setConnError(false);
// // // // //     } catch (err) {
// // // // //       console.warn("Room poll failed:", err);
// // // // //       setConnError(true);
// // // // //     }
// // // // //   }, [roomCode]);

// // // // //   /* ---------- pulsing dot ---------- */
// // // // //   const pulse = useRef(new Animated.Value(0.35)).current;
// // // // //   useEffect(() => {
// // // // //     const loop = Animated.loop(
// // // // //       Animated.sequence([
// // // // //         Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // // // //         Animated.timing(pulse, { toValue: 0.35, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // // // //       ])
// // // // //     );
// // // // //     loop.start();
// // // // //     return () => loop.stop();
// // // // //   }, []);

// // // // //   /* ---------- everything below is derived from the backend JSON ---------- */
// // // // //   const loaded = room !== null;
// // // // //   const r: any = room || {};
// // // // //   const players: any[] = r.players || [];
// // // // //   const max = Number(pick(r, "maxPlayers", "max_players")) || maxPlayers;

// // // // //   // Poll the room every 2.5s so we pick up new players / ready-state changes.
// // // // //   // Stops automatically once the room is full — nothing left to wait for.
// // // // //   useEffect(() => {
// // // // //     poll();
// // // // //     if (players.length >= max) return;
// // // // //     const interval = setInterval(poll, 2500);
// // // // //     return () => clearInterval(interval);
// // // // //   }, [poll, players.length, max]);

// // // // //   const minPlayers = Number(pick(r, "minPlayers", "min_players")) || 0;
// // // // //   const roomName: string | undefined = pick(r, "roomName", "room_name", "name");
// // // // //   const status = statusInfo(r.status, loaded);

// // // // //   const me = players.find((p) => p.player_name === playerName);
// // // // //   const hasReadyField = players.some((p) => typeof pick(p, "is_ready", "isReady") === "boolean");
// // // // //   const myReady = !!pick(me, "is_ready", "isReady");

// // // // //   const needMore = Math.max(0, minPlayers - players.length);
// // // // //   const canStart = loaded && needMore === 0 && !starting;
// // // // //   const emptySlots = Math.max(0, Math.min(max - players.length, 8));
// // // // //   const fillPct = max > 0 ? Math.min(100, (players.length / max) * 100) : 0;

// // // // //   /* ---------- actions ---------- */
// // // // //   const flashCopied = () => {
// // // // //     setCopied(true);
// // // // //     setTimeout(() => setCopied(false), 2000);
// // // // //   };

// // // // //   const handleShare = async () => {
// // // // //     const message = `Join my Word Scramble room! Code: ${roomCode}`;
// // // // //     try {
// // // // //       if (Platform.OS === "web") {
// // // // //         const nav: any = typeof navigator !== "undefined" ? navigator : null;
// // // // //         if (nav?.share) {
// // // // //           await nav.share({ text: message });
// // // // //           return;
// // // // //         }
// // // // //         if (nav?.clipboard?.writeText) {
// // // // //           await nav.clipboard.writeText(message);
// // // // //           flashCopied();
// // // // //           return;
// // // // //         }
// // // // //       }
// // // // //       await Share.share({ message });
// // // // //     } catch {
// // // // //       // cancelled / unsupported
// // // // //     }
// // // // //   };

// // // // //   const handleCopy = async () => {
// // // // //     try {
// // // // //       const nav: any = typeof navigator !== "undefined" ? navigator : null;
// // // // //       if (Platform.OS === "web" && nav?.clipboard?.writeText) {
// // // // //         await nav.clipboard.writeText(roomCode);
// // // // //         flashCopied();
// // // // //         return;
// // // // //       }
// // // // //       await Share.share({ message: roomCode });
// // // // //     } catch {
// // // // //       // ignore
// // // // //     }
// // // // //   };

// // // // //   const handleStart = async () => {
// // // // //     if (!canStart) return;
// // // // //     setStarting(true);
// // // // //     try {
// // // // //       await onStartGame();
// // // // //     } finally {
// // // // //       setStarting(false);
// // // // //     }
// // // // //   };

// // // // //   const handleToggleReady = async () => {
// // // // //     if (togglingReady || !me) return;
// // // // //     setTogglingReady(true);
// // // // //     try {
// // // // //       await setReady(roomCode, playerName, !myReady);
// // // // //       await poll();
// // // // //     } catch (err) {
// // // // //       console.warn("Ready toggle failed:", err);
// // // // //     } finally {
// // // // //       setTogglingReady(false);
// // // // //     }
// // // // //   };

// // // // //   const handleBack = async () => {
// // // // //     // tell the server we left so the slot is freed for someone else
// // // // //     try {
// // // // //       await leaveRoom(roomCode, playerName);
// // // // //     } catch {
// // // // //       // endpoint missing / offline — still go back
// // // // //     }
// // // // //     onBack();
// // // // //   };

// // // // //   /* ---------------- pieces ---------------- */

// // // // //   const header = (
// // // // //     <View style={styles.header}>
// // // // //       <TouchableOpacity style={styles.roundButton} onPress={handleBack} activeOpacity={0.8}>
// // // // //         <Ionicons name="arrow-back" size={20} color={C.text} />
// // // // //       </TouchableOpacity>

// // // // //       <View style={styles.headerCenter}>
// // // // //         <Text style={styles.headerTitle} numberOfLines={1}>
// // // // //           {roomName ? roomName : `Room ${roomCode}`}
// // // // //         </Text>
// // // // //         <View style={styles.headerSubRow}>
// // // // //           <Animated.View style={[styles.liveDot, { backgroundColor: status.color, opacity: pulse }]} />
// // // // //           <Text style={styles.headerSub}>
// // // // //             {status.label}
// // // // //             {roomName ? ` • ${roomCode}` : ""}
// // // // //           </Text>
// // // // //         </View>
// // // // //       </View>

// // // // //       <View style={styles.headerRight}>
// // // // //         <TouchableOpacity style={styles.roundButton} onPress={onOpenChat} activeOpacity={0.8}>
// // // // //           <Ionicons name="chatbubble-ellipses-outline" size={19} color={C.indigo} />
// // // // //         </TouchableOpacity>
// // // // //         <TouchableOpacity style={styles.roundButton} onPress={onOpenRoomSettings} activeOpacity={0.8}>
// // // // //           <Ionicons name="settings-outline" size={19} color={C.indigo} />
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //     </View>
// // // // //   );

// // // // //   const errorBanner = connError ? (
// // // // //     <View style={styles.errorBanner}>
// // // // //       <Ionicons name="cloud-offline-outline" size={16} color={C.coral} />
// // // // //       <Text style={styles.errorText}>Can't reach the server. Retrying…</Text>
// // // // //     </View>
// // // // //   ) : null;

// // // // //   const heading = (
// // // // //     <View style={styles.headingBlock}>
// // // // //       <Text style={styles.eyebrow}>LOBBY</Text>
// // // // //       <Text style={[styles.headingTitle, !wide && styles.headingTitlePhone]}>Waiting for</Text>
// // // // //       <Text style={[styles.headingTitle, !wide && styles.headingTitlePhone, { color: C.indigo }]}>players…</Text>
// // // // //       <Text style={styles.headingSub}>
// // // // //         Share the room code with your friends. The game starts when you're ready.
// // // // //       </Text>
// // // // //     </View>
// // // // //   );

// // // // //   const playersCard = (
// // // // //     <View style={styles.card}>
// // // // //       <View style={styles.cardHeadRow}>
// // // // //         <View>
// // // // //           <Text style={styles.cardTitle}>Players</Text>
// // // // //           <Text style={styles.cardSub}>Everyone in this room</Text>
// // // // //         </View>
// // // // //         <View style={styles.countPill}>
// // // // //           <Ionicons name="people-outline" size={14} color={C.indigo} />
// // // // //           <Text style={styles.countPillText}>
// // // // //             {players.length}/{max}
// // // // //           </Text>
// // // // //         </View>
// // // // //       </View>

// // // // //       <View style={styles.playerList}>
// // // // //         {/* loading skeleton until the first response arrives */}
// // // // //         {!loaded && !connError
// // // // //           ? [0, 1].map((i) => (
// // // // //               <View key={`sk-${i}`} style={[styles.playerRow, { opacity: 0.6 }]}>
// // // // //                 <View style={[styles.avatar, { backgroundColor: C.greySoft }]} />
// // // // //                 <View style={{ flex: 1, gap: 6 }}>
// // // // //                   <View style={[styles.skelLine, { width: "40%" }]} />
// // // // //                   <View style={[styles.skelLine, { width: "25%", height: 8 }]} />
// // // // //                 </View>
// // // // //               </View>
// // // // //             ))
// // // // //           : null}

// // // // //         {players.map((p, i) => {
// // // // //           const isMe = p.player_name === playerName;
// // // // //           const isHost = !!pick(p, "is_host", "isHost");
// // // // //           const readyVal = pick(p, "is_ready", "isReady");
// // // // //           const color = pick(p, "avatar_color", "avatarColor") || FALLBACK_AVATARS[i % FALLBACK_AVATARS.length];
// // // // //           return (
// // // // //             <View key={String(p.id ?? p.player_name)} style={styles.playerRow}>
// // // // //               <View style={[styles.avatar, { backgroundColor: color }]}>
// // // // //                 <Text style={styles.avatarText}>{(p.player_name || "?").charAt(0).toUpperCase()}</Text>
// // // // //               </View>

// // // // //               <View style={{ flex: 1 }}>
// // // // //                 <Text style={styles.playerName} numberOfLines={1}>
// // // // //                   {p.player_name}
// // // // //                 </Text>
// // // // //                 {isMe || isHost ? (
// // // // //                   <Text style={styles.playerTag}>{[isMe ? "That's you" : null, isHost ? "Host" : null].filter(Boolean).join(" • ")}</Text>
// // // // //                 ) : null}
// // // // //               </View>

// // // // //               {typeof readyVal === "boolean" ? (
// // // // //                 <View style={[styles.badge, { backgroundColor: readyVal ? C.greenSoft : C.greySoft }]}>
// // // // //                   <View style={[styles.badgeDot, { backgroundColor: readyVal ? C.green : C.grey }]} />
// // // // //                   <Text style={[styles.badgeText, { color: readyVal ? C.green : C.grey }]}>
// // // // //                     {readyVal ? "Ready" : "Not ready"}
// // // // //                   </Text>
// // // // //                 </View>
// // // // //               ) : null}
// // // // //             </View>
// // // // //           );
// // // // //         })}

// // // // //         {loaded
// // // // //           ? Array.from({ length: emptySlots }).map((_, i) => (
// // // // //               <View key={`empty-${i}`} style={styles.emptyRow}>
// // // // //                 <View style={styles.emptyAvatar}>
// // // // //                   <Ionicons name="person-add-outline" size={15} color="#B8AFA5" />
// // // // //                 </View>
// // // // //                 <Text style={styles.emptyText}>Waiting for player…</Text>
// // // // //                 <Animated.View style={[styles.emptyDot, { opacity: pulse }]} />
// // // // //               </View>
// // // // //             ))
// // // // //           : null}
// // // // //       </View>
// // // // //     </View>
// // // // //   );

// // // // //   const codeCard = (
// // // // //     <View style={styles.card}>
// // // // //       <Text style={styles.cardTitle}>Room code</Text>
// // // // //       <Text style={styles.cardSub}>Friends enter this to join</Text>

// // // // //       <View style={styles.tilesRow}>
// // // // //         {roomCode.split("").map((ch, i) => (
// // // // //           <View
// // // // //             key={i}
// // // // //             style={[
// // // // //               styles.tile,
// // // // //               {
// // // // //                 backgroundColor: TILE_COLORS[i % TILE_COLORS.length],
// // // // //                 transform: [{ rotate: TILE_ROTATIONS[i % TILE_ROTATIONS.length] }],
// // // // //                 shadowColor: TILE_COLORS[i % TILE_COLORS.length],
// // // // //               },
// // // // //             ]}
// // // // //           >
// // // // //             <Text style={styles.tileText}>{ch}</Text>
// // // // //           </View>
// // // // //         ))}
// // // // //       </View>

// // // // //       <View style={styles.codeActions}>
// // // // //         <TouchableOpacity style={styles.softButton} onPress={handleCopy} activeOpacity={0.8}>
// // // // //           <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color={C.indigo} />
// // // // //           <Text style={styles.softButtonText}>{copied ? "Copied!" : "Copy"}</Text>
// // // // //         </TouchableOpacity>
// // // // //         <TouchableOpacity style={styles.softButton} onPress={handleShare} activeOpacity={0.8}>
// // // // //           <Ionicons name="share-social-outline" size={16} color={C.indigo} />
// // // // //           <Text style={styles.softButtonText}>Share</Text>
// // // // //         </TouchableOpacity>
// // // // //       </View>

// // // // //       <View style={styles.divider} />

// // // // //       <View style={styles.progressHead}>
// // // // //         <Text style={styles.progressLabel}>Players joined</Text>
// // // // //         <Text style={styles.progressValue}>
// // // // //           {players.length} / {max}
// // // // //         </Text>
// // // // //       </View>
// // // // //       <View style={styles.progressTrack}>
// // // // //         <View style={[styles.progressFill, { width: `${fillPct}%` }]} />
// // // // //       </View>

// // // // //       {/* ready toggle — only when the backend tracks readiness */}
// // // // //       {hasReadyField && me ? (
// // // // //         <TouchableOpacity
// // // // //           style={[styles.readyToggle, myReady && styles.readyToggleOn]}
// // // // //           onPress={handleToggleReady}
// // // // //           activeOpacity={0.85}
// // // // //           disabled={togglingReady}
// // // // //         >
// // // // //           <Ionicons
// // // // //             name={myReady ? "checkmark-circle" : "ellipse-outline"}
// // // // //             size={18}
// // // // //             color={myReady ? C.green : C.indigo}
// // // // //           />
// // // // //           <Text style={[styles.readyToggleText, { color: myReady ? C.green : C.indigo }]}>
// // // // //             {myReady ? "You're ready" : "Mark me as ready"}
// // // // //           </Text>
// // // // //         </TouchableOpacity>
// // // // //       ) : null}

// // // // //       <TouchableOpacity
// // // // //         style={[styles.startWrap, !canStart && styles.startWrapDisabled]}
// // // // //         activeOpacity={0.88}
// // // // //         onPress={handleStart}
// // // // //         disabled={!canStart}
// // // // //       >
// // // // //         <View style={[styles.startButton, !canStart && styles.startButtonDisabled]}>
// // // // //           {starting ? (
// // // // //             <ActivityIndicator color="#FFFFFF" />
// // // // //           ) : (
// // // // //             <>
// // // // //               <Text style={styles.startButtonText}>START GAME</Text>
// // // // //               <View style={styles.startArrow}>
// // // // //                 <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
// // // // //               </View>
// // // // //             </>
// // // // //           )}
// // // // //         </View>
// // // // //       </TouchableOpacity>

// // // // //       {needMore > 0 ? (
// // // // //         <Text style={styles.startHint}>
// // // // //           Need {needMore} more {needMore === 1 ? "player" : "players"} to start
// // // // //         </Text>
// // // // //       ) : null}
// // // // //     </View>
// // // // //   );

// // // // //   return (
// // // // //     <View style={styles.flex}>
// // // // //       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
// // // // //       <SafeAreaView style={styles.flex}>
// // // // //         <ScrollView
// // // // //           contentContainerStyle={[
// // // // //             styles.scroll,
// // // // //             {
// // // // //               paddingHorizontal: wide ? 32 : 16,
// // // // //               paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 8 : 16,
// // // // //             },
// // // // //           ]}
// // // // //           showsVerticalScrollIndicator={false}
// // // // //         >
// // // // //           <View style={styles.column}>
// // // // //             {header}
// // // // //             {errorBanner}

// // // // //             {wide ? (
// // // // //               <View style={styles.wideRow}>
// // // // //                 <View style={{ flex: 1, gap: 18 }}>
// // // // //                   {heading}
// // // // //                   {playersCard}
// // // // //                 </View>
// // // // //                 <View style={styles.sideCol}>{codeCard}</View>
// // // // //               </View>
// // // // //             ) : (
// // // // //               <View style={{ gap: 16 }}>
// // // // //                 {heading}
// // // // //                 {codeCard}
// // // // //                 {playersCard}
// // // // //               </View>
// // // // //             )}
// // // // //           </View>
// // // // //         </ScrollView>
// // // // //       </SafeAreaView>
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // export default RoomWaitingScreen;

// // // // // const styles = StyleSheet.create({
// // // // //   flex: { flex: 1, backgroundColor: C.bg },
// // // // //   scroll: {
// // // // //     paddingBottom: 32,
// // // // //   },
// // // // //   column: {
// // // // //     width: "100%",
// // // // //     maxWidth: 1040,
// // // // //     alignSelf: "center",
// // // // //   },
// // // // //   wideRow: {
// // // // //     flexDirection: "row",
// // // // //     gap: 24,
// // // // //     alignItems: "flex-start",
// // // // //   },
// // // // //   sideCol: {
// // // // //     width: 380,
// // // // //     marginTop: 8,
// // // // //   },

// // // // //   /* ---- header ---- */
// // // // //   header: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "space-between",
// // // // //     marginBottom: 8,
// // // // //     gap: 8,
// // // // //   },
// // // // //   headerCenter: {
// // // // //     flex: 1,
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   headerTitle: {
// // // // //     color: C.text,
// // // // //     fontSize: 17,
// // // // //     fontWeight: "800",
// // // // //   },
// // // // //   headerSubRow: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 6,
// // // // //     marginTop: 3,
// // // // //   },
// // // // //   liveDot: {
// // // // //     width: 7,
// // // // //     height: 7,
// // // // //     borderRadius: 4,
// // // // //   },
// // // // //   headerSub: {
// // // // //     color: C.sub,
// // // // //     fontSize: 12,
// // // // //   },
// // // // //   headerRight: {
// // // // //     flexDirection: "row",
// // // // //     gap: 8,
// // // // //   },
// // // // //   roundButton: {
// // // // //     width: 42,
// // // // //     height: 42,
// // // // //     borderRadius: 21,
// // // // //     backgroundColor: C.card,
// // // // //     borderWidth: 1,
// // // // //     borderColor: C.border,
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   errorBanner: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 8,
// // // // //     marginTop: 8,
// // // // //     paddingVertical: 10,
// // // // //     paddingHorizontal: 14,
// // // // //     borderRadius: 14,
// // // // //     backgroundColor: C.coralSoft,
// // // // //   },
// // // // //   errorText: {
// // // // //     color: C.coral,
// // // // //     fontSize: 13,
// // // // //     fontWeight: "700",
// // // // //   },

// // // // //   /* ---- heading ---- */
// // // // //   headingBlock: {
// // // // //     marginTop: 14,
// // // // //   },
// // // // //   eyebrow: {
// // // // //     color: C.coral,
// // // // //     fontSize: 12,
// // // // //     fontWeight: "800",
// // // // //     letterSpacing: 1.5,
// // // // //     marginBottom: 6,
// // // // //   },
// // // // //   headingTitle: {
// // // // //     color: C.text,
// // // // //     fontSize: 38,
// // // // //     fontWeight: "900",
// // // // //     lineHeight: 44,
// // // // //   },
// // // // //   headingTitlePhone: {
// // // // //     fontSize: 30,
// // // // //     lineHeight: 36,
// // // // //   },
// // // // //   headingSub: {
// // // // //     color: C.sub,
// // // // //     fontSize: 15,
// // // // //     lineHeight: 22,
// // // // //     marginTop: 10,
// // // // //     maxWidth: 480,
// // // // //   },

// // // // //   /* ---- cards ---- */
// // // // //   card: {
// // // // //     backgroundColor: C.card,
// // // // //     borderRadius: 24,
// // // // //     borderWidth: 1,
// // // // //     borderColor: C.border,
// // // // //     padding: 20,
// // // // //     shadowColor: "#B8A48C",
// // // // //     shadowOpacity: 0.12,
// // // // //     shadowRadius: 16,
// // // // //     shadowOffset: { width: 0, height: 6 },
// // // // //     elevation: 2,
// // // // //   },
// // // // //   cardHeadRow: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "space-between",
// // // // //   },
// // // // //   cardTitle: {
// // // // //     color: C.text,
// // // // //     fontSize: 18,
// // // // //     fontWeight: "800",
// // // // //   },
// // // // //   cardSub: {
// // // // //     color: C.sub,
// // // // //     fontSize: 12.5,
// // // // //     marginTop: 3,
// // // // //   },
// // // // //   countPill: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 6,
// // // // //     paddingVertical: 6,
// // // // //     paddingHorizontal: 12,
// // // // //     borderRadius: 14,
// // // // //     backgroundColor: C.indigoSoft,
// // // // //   },
// // // // //   countPillText: {
// // // // //     color: C.indigo,
// // // // //     fontWeight: "800",
// // // // //     fontSize: 13,
// // // // //   },

// // // // //   /* ---- players ---- */
// // // // //   playerList: {
// // // // //     marginTop: 16,
// // // // //     gap: 10,
// // // // //   },
// // // // //   playerRow: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 12,
// // // // //     paddingVertical: 12,
// // // // //     paddingHorizontal: 14,
// // // // //     borderRadius: 16,
// // // // //     backgroundColor: "#FFFBF6",
// // // // //     borderWidth: 1,
// // // // //     borderColor: C.border,
// // // // //   },
// // // // //   avatar: {
// // // // //     width: 42,
// // // // //     height: 42,
// // // // //     borderRadius: 21,
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   avatarText: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 17,
// // // // //     fontWeight: "900",
// // // // //   },
// // // // //   playerName: {
// // // // //     color: C.text,
// // // // //     fontSize: 15,
// // // // //     fontWeight: "800",
// // // // //   },
// // // // //   playerTag: {
// // // // //     color: C.sub,
// // // // //     fontSize: 11.5,
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   badge: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 6,
// // // // //     paddingVertical: 5,
// // // // //     paddingHorizontal: 11,
// // // // //     borderRadius: 12,
// // // // //   },
// // // // //   badgeDot: {
// // // // //     width: 7,
// // // // //     height: 7,
// // // // //     borderRadius: 4,
// // // // //   },
// // // // //   badgeText: {
// // // // //     fontSize: 12,
// // // // //     fontWeight: "800",
// // // // //   },
// // // // //   skelLine: {
// // // // //     height: 12,
// // // // //     borderRadius: 6,
// // // // //     backgroundColor: C.greySoft,
// // // // //   },
// // // // //   emptyRow: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 12,
// // // // //     paddingVertical: 12,
// // // // //     paddingHorizontal: 14,
// // // // //     borderRadius: 16,
// // // // //     borderWidth: 1.5,
// // // // //     borderStyle: "dashed",
// // // // //     borderColor: "#E6DACB",
// // // // //   },
// // // // //   emptyAvatar: {
// // // // //     width: 42,
// // // // //     height: 42,
// // // // //     borderRadius: 21,
// // // // //     backgroundColor: "#F6EFE6",
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   emptyText: {
// // // // //     flex: 1,
// // // // //     color: "#A79D92",
// // // // //     fontSize: 14,
// // // // //     fontWeight: "600",
// // // // //   },
// // // // //   emptyDot: {
// // // // //     width: 8,
// // // // //     height: 8,
// // // // //     borderRadius: 4,
// // // // //     backgroundColor: C.coral,
// // // // //   },

// // // // //   /* ---- code card ---- */
// // // // //   tilesRow: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "center",
// // // // //     gap: 10,
// // // // //     marginTop: 20,
// // // // //     marginBottom: 18,
// // // // //     flexWrap: "wrap",
// // // // //   },
// // // // //   tile: {
// // // // //     width: 54,
// // // // //     height: 54,
// // // // //     borderRadius: 15,
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //     shadowOpacity: 0.35,
// // // // //     shadowRadius: 10,
// // // // //     shadowOffset: { width: 0, height: 6 },
// // // // //     elevation: 4,
// // // // //   },
// // // // //   tileText: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 26,
// // // // //     fontWeight: "900",
// // // // //   },
// // // // //   codeActions: {
// // // // //     flexDirection: "row",
// // // // //     gap: 10,
// // // // //   },
// // // // //   softButton: {
// // // // //     flex: 1,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     gap: 8,
// // // // //     paddingVertical: 12,
// // // // //     borderRadius: 14,
// // // // //     backgroundColor: C.indigoSoft,
// // // // //   },
// // // // //   softButtonText: {
// // // // //     color: C.indigo,
// // // // //     fontWeight: "800",
// // // // //     fontSize: 14,
// // // // //   },
// // // // //   divider: {
// // // // //     height: 1,
// // // // //     backgroundColor: C.border,
// // // // //     marginVertical: 18,
// // // // //   },
// // // // //   progressHead: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   progressLabel: {
// // // // //     color: C.sub,
// // // // //     fontSize: 13,
// // // // //   },
// // // // //   progressValue: {
// // // // //     color: C.text,
// // // // //     fontSize: 13,
// // // // //     fontWeight: "800",
// // // // //   },
// // // // //   progressTrack: {
// // // // //     height: 8,
// // // // //     borderRadius: 4,
// // // // //     backgroundColor: "#F1EAE0",
// // // // //     overflow: "hidden",
// // // // //   },
// // // // //   progressFill: {
// // // // //     height: "100%",
// // // // //     borderRadius: 4,
// // // // //     backgroundColor: C.indigo,
// // // // //   },
// // // // //   readyToggle: {
// // // // //     marginTop: 16,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     gap: 8,
// // // // //     paddingVertical: 12,
// // // // //     borderRadius: 14,
// // // // //     borderWidth: 1.5,
// // // // //     borderColor: C.indigo,
// // // // //     backgroundColor: "#FFFFFF",
// // // // //   },
// // // // //   readyToggleOn: {
// // // // //     borderColor: C.green,
// // // // //     backgroundColor: C.greenSoft,
// // // // //   },
// // // // //   readyToggleText: {
// // // // //     fontWeight: "800",
// // // // //     fontSize: 14,
// // // // //   },
// // // // //   startWrap: {
// // // // //     marginTop: 16,
// // // // //     borderRadius: 18,
// // // // //     shadowColor: C.indigo,
// // // // //     shadowOpacity: 0.35,
// // // // //     shadowRadius: 14,
// // // // //     shadowOffset: { width: 0, height: 8 },
// // // // //     elevation: 6,
// // // // //   },
// // // // //   startWrapDisabled: {
// // // // //     shadowOpacity: 0,
// // // // //     elevation: 0,
// // // // //   },
// // // // //   startButton: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     gap: 12,
// // // // //     height: 58,
// // // // //     borderRadius: 18,
// // // // //     backgroundColor: C.indigo,
// // // // //   },
// // // // //   startButtonDisabled: {
// // // // //     backgroundColor: "#B9B6EE",
// // // // //   },
// // // // //   startButtonText: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 16,
// // // // //     fontWeight: "900",
// // // // //     letterSpacing: 1,
// // // // //   },
// // // // //   startArrow: {
// // // // //     width: 30,
// // // // //     height: 30,
// // // // //     borderRadius: 10,
// // // // //     backgroundColor: "rgba(255,255,255,0.22)",
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   startHint: {
// // // // //     color: C.sub,
// // // // //     fontSize: 12.5,
// // // // //     textAlign: "center",
// // // // //     marginTop: 10,
// // // // //   },
// // // // // });
// // // // import React, { useEffect, useState, useCallback, useRef } from "react";
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   StyleSheet,
// // // //   TouchableOpacity,
// // // //   ScrollView,
// // // //   Share,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // //   Animated,
// // // //   Easing,
// // // //   Platform,
// // // //   ActivityIndicator,
// // // //   useWindowDimensions,
// // // // } from "react-native";
// // // // import { Ionicons } from "@expo/vector-icons";
// // // // import { fetchRoom, WordScrambleRoom } from "../api/Wordscrambleapi";
// // // // import { setReady, leaveRoom } from "../api/wsProfileApi";

// // // // interface RoomWaitingScreenProps {
// // // //   roomCode: string;
// // // //   maxPlayers: number; // fallback only — the room JSON from the backend wins
// // // //   playerName: string; // the logged-in player's name (from backend profile)
// // // //   onBack: () => void;
// // // //   onStartGame: () => void | Promise<void>;
// // // //   onOpenChat: () => void;
// // // //   onOpenRoomSettings: () => void;
// // // // }

// // // // /* ---------- Word Scramble theme ---------- */
// // // // const C = {
// // // //   bg: "#FFF8F1",
// // // //   card: "#FFFFFF",
// // // //   border: "#F1E7DC",
// // // //   text: "#141B34",
// // // //   sub: "#6B7280",
// // // //   indigo: "#4F46E5",
// // // //   indigoSoft: "#EEF0FF",
// // // //   coral: "#FF6B57",
// // // //   coralSoft: "#FFECE8",
// // // //   yellow: "#F2B640",
// // // //   blue: "#3B82F6",
// // // //   red: "#F0566A",
// // // //   green: "#22B573",
// // // //   greenSoft: "#E3F6EC",
// // // //   grey: "#8A93A6",
// // // //   greySoft: "#F1EEF0",
// // // // };

// // // // const TILE_COLORS = [C.yellow, C.blue, C.red, C.green];
// // // // const TILE_ROTATIONS = ["-6deg", "4deg", "-3deg", "5deg"];
// // // // // only used when the backend doesn't send an avatar colour for a player
// // // // const FALLBACK_AVATARS = [C.coral, C.blue, C.green, C.yellow, C.red, C.indigo, "#14B8A6", "#F97316"];

// // // // /* ---------- backend field helpers (support snake_case + camelCase) ---------- */
// // // // const pick = (obj: any, ...keys: string[]) => {
// // // //   for (const k of keys) if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
// // // //   return undefined;
// // // // };

// // // // const statusInfo = (status?: string, loaded?: boolean): { label: string; color: string } => {
// // // //   if (!loaded) return { label: "Connecting…", color: C.grey };
// // // //   switch ((status || "").toLowerCase()) {
// // // //     case "waiting":
// // // //     case "lobby":
// // // //     case "open":
// // // //       return { label: "Lobby open", color: C.green };
// // // //     case "playing":
// // // //     case "in_progress":
// // // //     case "started":
// // // //       return { label: "Game in progress", color: C.blue };
// // // //     case "finished":
// // // //     case "ended":
// // // //     case "completed":
// // // //       return { label: "Game finished", color: C.grey };
// // // //     default:
// // // //       return { label: status ? status.charAt(0).toUpperCase() + status.slice(1) : "Lobby open", color: C.green };
// // // //   }
// // // // };

// // // // const RoomWaitingScreen: React.FC<RoomWaitingScreenProps> = ({
// // // //   roomCode,
// // // //   maxPlayers,
// // // //   playerName,
// // // //   onBack,
// // // //   onStartGame,
// // // //   onOpenChat,
// // // //   onOpenRoomSettings,
// // // // }) => {
// // // //   const { width } = useWindowDimensions();
// // // //   const wide = width >= 900;

// // // //   const [room, setRoom] = useState<WordScrambleRoom | null>(null);
// // // //   const [connError, setConnError] = useState(false);
// // // //   const [copied, setCopied] = useState(false);
// // // //   const [starting, setStarting] = useState(false);
// // // //   const [togglingReady, setTogglingReady] = useState(false);

// // // //   const poll = useCallback(async () => {
// // // //     try {
// // // //       const r = await fetchRoom(roomCode);
// // // //       setRoom(r);
// // // //       setConnError(false);
// // // //     } catch (err) {
// // // //       console.warn("Room poll failed:", err);
// // // //       setConnError(true);
// // // //     }
// // // //   }, [roomCode]);

// // // //   /* ---------- pulsing dot ---------- */
// // // //   const pulse = useRef(new Animated.Value(0.35)).current;
// // // //   useEffect(() => {
// // // //     const loop = Animated.loop(
// // // //       Animated.sequence([
// // // //         Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // // //         Animated.timing(pulse, { toValue: 0.35, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // // //       ])
// // // //     );
// // // //     loop.start();
// // // //     return () => loop.stop();
// // // //   }, []);

// // // //   /* ---------- everything below is derived from the backend JSON ---------- */
// // // //   const loaded = room !== null;
// // // //   const r: any = room || {};
// // // //   const players: any[] = r.players || [];
// // // //   const max = Number(pick(r, "maxPlayers", "max_players")) || maxPlayers;

// // // //   // Poll the room every 2.5s so we pick up new players / ready-state changes.
// // // //   // Stops automatically once the room is full — nothing left to wait for.
// // // //   useEffect(() => {
// // // //     poll();
// // // //     if (players.length >= max) return;
// // // //     const interval = setInterval(poll, 2500);
// // // //     return () => clearInterval(interval);
// // // //   }, [poll, players.length, max]);

// // // //   const minPlayers = Number(pick(r, "minPlayers", "min_players")) || 0;
// // // //   const roomName: string | undefined = pick(r, "roomName", "room_name", "name");
// // // //   const status = statusInfo(r.status, loaded);

// // // //   const me = players.find((p) => p.player_name === playerName);
// // // //   const hasReadyField = players.some((p) => typeof pick(p, "is_ready", "isReady") === "boolean");
// // // //   const myReady = !!pick(me, "is_ready", "isReady");

// // // //   const needMore = Math.max(0, minPlayers - players.length);
// // // //   const canStart = loaded && needMore === 0 && !starting;
// // // //   const emptySlots = Math.max(0, Math.min(max - players.length, 8));
// // // //   const fillPct = max > 0 ? Math.min(100, (players.length / max) * 100) : 0;

// // // //   /* ---------- actions ---------- */
// // // //   const flashCopied = () => {
// // // //     setCopied(true);
// // // //     setTimeout(() => setCopied(false), 2000);
// // // //   };

// // // //   const handleShare = async () => {
// // // //     const message = `Join my Word Scramble room! Code: ${roomCode}`;
// // // //     try {
// // // //       if (Platform.OS === "web") {
// // // //         const nav: any = typeof navigator !== "undefined" ? navigator : null;
// // // //         if (nav?.share) {
// // // //           await nav.share({ text: message });
// // // //           return;
// // // //         }
// // // //         if (nav?.clipboard?.writeText) {
// // // //           await nav.clipboard.writeText(message);
// // // //           flashCopied();
// // // //           return;
// // // //         }
// // // //       }
// // // //       await Share.share({ message });
// // // //     } catch {
// // // //       // cancelled / unsupported
// // // //     }
// // // //   };

// // // //   const handleCopy = async () => {
// // // //     try {
// // // //       const nav: any = typeof navigator !== "undefined" ? navigator : null;
// // // //       if (Platform.OS === "web" && nav?.clipboard?.writeText) {
// // // //         await nav.clipboard.writeText(roomCode);
// // // //         flashCopied();
// // // //         return;
// // // //       }
// // // //       await Share.share({ message: roomCode });
// // // //     } catch {
// // // //       // ignore
// // // //     }
// // // //   };

// // // //   const handleStart = async () => {
// // // //     if (!canStart) return;
// // // //     setStarting(true);
// // // //     try {
// // // //       await onStartGame();
// // // //     } finally {
// // // //       setStarting(false);
// // // //     }
// // // //   };

// // // //   const handleToggleReady = async () => {
// // // //     if (togglingReady || !me) return;
// // // //     setTogglingReady(true);
// // // //     try {
// // // //       await setReady(roomCode, playerName, !myReady);
// // // //       await poll();
// // // //     } catch (err) {
// // // //       console.warn("Ready toggle failed:", err);
// // // //     } finally {
// // // //       setTogglingReady(false);
// // // //     }
// // // //   };

// // // //   const handleBack = async () => {
// // // //     // tell the server we left so the slot is freed for someone else
// // // //     try {
// // // //       await leaveRoom(roomCode, playerName);
// // // //     } catch {
// // // //       // endpoint missing / offline — still go back
// // // //     }
// // // //     onBack();
// // // //   };

// // // //   /* ---------------- pieces ---------------- */

// // // //   const header = (
// // // //     <View style={styles.header}>
// // // //       <TouchableOpacity style={styles.roundButton} onPress={handleBack} activeOpacity={0.8}>
// // // //         <Ionicons name="arrow-back" size={20} color={C.text} />
// // // //       </TouchableOpacity>

// // // //       <View style={styles.headerCenter}>
// // // //         <Text style={styles.headerTitle} numberOfLines={1}>
// // // //           {roomName ? roomName : `Room ${roomCode}`}
// // // //         </Text>
// // // //         <View style={styles.headerSubRow}>
// // // //           <Animated.View style={[styles.liveDot, { backgroundColor: status.color, opacity: pulse }]} />
// // // //           <Text style={styles.headerSub}>
// // // //             {status.label}
// // // //             {roomName ? ` • ${roomCode}` : ""}
// // // //           </Text>
// // // //         </View>
// // // //       </View>

// // // //       <View style={styles.headerRight}>
// // // //         <TouchableOpacity style={styles.roundButton} onPress={onOpenChat} activeOpacity={0.8}>
// // // //           <Ionicons name="chatbubble-ellipses-outline" size={19} color={C.indigo} />
// // // //         </TouchableOpacity>
// // // //         <TouchableOpacity style={styles.roundButton} onPress={onOpenRoomSettings} activeOpacity={0.8}>
// // // //           <Ionicons name="settings-outline" size={19} color={C.indigo} />
// // // //         </TouchableOpacity>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   const errorBanner = connError ? (
// // // //     <View style={styles.errorBanner}>
// // // //       <Ionicons name="cloud-offline-outline" size={16} color={C.coral} />
// // // //       <Text style={styles.errorText}>Can't reach the server. Retrying…</Text>
// // // //     </View>
// // // //   ) : null;

// // // //   const heading = (
// // // //     <View style={styles.headingBlock}>
// // // //       <Text style={styles.eyebrow}>LOBBY</Text>
// // // //       <Text style={[styles.headingTitle, !wide && styles.headingTitlePhone]}>Waiting for</Text>
// // // //       <Text style={[styles.headingTitle, !wide && styles.headingTitlePhone, { color: C.indigo }]}>players…</Text>
// // // //       <Text style={styles.headingSub}>
// // // //         Share the room code with your friends. The game starts when you're ready.
// // // //       </Text>
// // // //     </View>
// // // //   );

// // // //   const playersCard = (
// // // //     <View style={styles.card}>
// // // //       <View style={styles.cardHeadRow}>
// // // //         <View>
// // // //           <Text style={styles.cardTitle}>Players</Text>
// // // //           <Text style={styles.cardSub}>Everyone in this room</Text>
// // // //         </View>
// // // //         <View style={styles.countPill}>
// // // //           <Ionicons name="people-outline" size={14} color={C.indigo} />
// // // //           <Text style={styles.countPillText}>
// // // //             {players.length}/{max}
// // // //           </Text>
// // // //         </View>
// // // //       </View>

// // // //       <View style={styles.playerList}>
// // // //         {/* loading skeleton until the first response arrives */}
// // // //         {!loaded && !connError
// // // //           ? [0, 1].map((i) => (
// // // //               <View key={`sk-${i}`} style={[styles.playerRow, { opacity: 0.6 }]}>
// // // //                 <View style={[styles.avatar, { backgroundColor: C.greySoft }]} />
// // // //                 <View style={{ flex: 1, gap: 6 }}>
// // // //                   <View style={[styles.skelLine, { width: "40%" }]} />
// // // //                   <View style={[styles.skelLine, { width: "25%", height: 8 }]} />
// // // //                 </View>
// // // //               </View>
// // // //             ))
// // // //           : null}

// // // //         {players.map((p, i) => {
// // // //           const isMe = p.player_name === playerName;
// // // //           const isHost = !!pick(p, "is_host", "isHost");
// // // //           const readyVal = pick(p, "is_ready", "isReady");
// // // //           const color = pick(p, "avatar_color", "avatarColor") || FALLBACK_AVATARS[i % FALLBACK_AVATARS.length];
// // // //           return (
// // // //             <View key={String(p.id ?? p.player_name)} style={styles.playerRow}>
// // // //               <View style={[styles.avatar, { backgroundColor: color }]}>
// // // //                 <Text style={styles.avatarText}>{(p.player_name || "?").charAt(0).toUpperCase()}</Text>
// // // //               </View>

// // // //               <View style={{ flex: 1 }}>
// // // //                 <Text style={styles.playerName} numberOfLines={1}>
// // // //                   {p.player_name}
// // // //                 </Text>
// // // //                 {isMe || isHost ? (
// // // //                   <Text style={styles.playerTag}>{[isMe ? "That's you" : null, isHost ? "Host" : null].filter(Boolean).join(" • ")}</Text>
// // // //                 ) : null}
// // // //               </View>

// // // //               {typeof readyVal === "boolean" ? (
// // // //                 <View style={[styles.badge, { backgroundColor: readyVal ? C.greenSoft : C.greySoft }]}>
// // // //                   <View style={[styles.badgeDot, { backgroundColor: readyVal ? C.green : C.grey }]} />
// // // //                   <Text style={[styles.badgeText, { color: readyVal ? C.green : C.grey }]}>
// // // //                     {readyVal ? "Ready" : "Not ready"}
// // // //                   </Text>
// // // //                 </View>
// // // //               ) : null}
// // // //             </View>
// // // //           );
// // // //         })}

// // // //         {loaded
// // // //           ? Array.from({ length: emptySlots }).map((_, i) => (
// // // //               <View key={`empty-${i}`} style={styles.emptyRow}>
// // // //                 <View style={styles.emptyAvatar}>
// // // //                   <Ionicons name="person-add-outline" size={15} color="#B8AFA5" />
// // // //                 </View>
// // // //                 <Text style={styles.emptyText}>Waiting for player…</Text>
// // // //                 <Animated.View style={[styles.emptyDot, { opacity: pulse }]} />
// // // //               </View>
// // // //             ))
// // // //           : null}
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   const codeCard = (
// // // //     <View style={styles.card}>
// // // //       <Text style={styles.cardTitle}>Room code</Text>
// // // //       <Text style={styles.cardSub}>Friends enter this to join</Text>

// // // //       <View style={styles.tilesRow}>
// // // //         {roomCode.split("").map((ch, i) => (
// // // //           <View
// // // //             key={i}
// // // //             style={[
// // // //               styles.tile,
// // // //               {
// // // //                 backgroundColor: TILE_COLORS[i % TILE_COLORS.length],
// // // //                 transform: [{ rotate: TILE_ROTATIONS[i % TILE_ROTATIONS.length] }],
// // // //                 shadowColor: TILE_COLORS[i % TILE_COLORS.length],
// // // //               },
// // // //             ]}
// // // //           >
// // // //             <Text style={styles.tileText}>{ch}</Text>
// // // //           </View>
// // // //         ))}
// // // //       </View>

// // // //       <View style={styles.codeActions}>
// // // //         <TouchableOpacity style={styles.softButton} onPress={handleCopy} activeOpacity={0.8}>
// // // //           <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color={C.indigo} />
// // // //           <Text style={styles.softButtonText}>{copied ? "Copied!" : "Copy"}</Text>
// // // //         </TouchableOpacity>
// // // //         <TouchableOpacity style={styles.softButton} onPress={handleShare} activeOpacity={0.8}>
// // // //           <Ionicons name="share-social-outline" size={16} color={C.indigo} />
// // // //           <Text style={styles.softButtonText}>Share</Text>
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       <View style={styles.divider} />

// // // //       <View style={styles.progressHead}>
// // // //         <Text style={styles.progressLabel}>Players joined</Text>
// // // //         <Text style={styles.progressValue}>
// // // //           {players.length} / {max}
// // // //         </Text>
// // // //       </View>
// // // //       <View style={styles.progressTrack}>
// // // //         <View style={[styles.progressFill, { width: `${fillPct}%` }]} />
// // // //       </View>

// // // //       {/* ready toggle — only when the backend tracks readiness */}
// // // //       {hasReadyField && me ? (
// // // //         <TouchableOpacity
// // // //           style={[styles.readyToggle, myReady && styles.readyToggleOn]}
// // // //           onPress={handleToggleReady}
// // // //           activeOpacity={0.85}
// // // //           disabled={togglingReady}
// // // //         >
// // // //           <Ionicons
// // // //             name={myReady ? "checkmark-circle" : "ellipse-outline"}
// // // //             size={18}
// // // //             color={myReady ? C.green : C.indigo}
// // // //           />
// // // //           <Text style={[styles.readyToggleText, { color: myReady ? C.green : C.indigo }]}>
// // // //             {myReady ? "You're ready" : "Mark me as ready"}
// // // //           </Text>
// // // //         </TouchableOpacity>
// // // //       ) : null}

// // // //       <TouchableOpacity
// // // //         style={[styles.startWrap, !canStart && styles.startWrapDisabled]}
// // // //         activeOpacity={0.88}
// // // //         onPress={handleStart}
// // // //         disabled={!canStart}
// // // //       >
// // // //         <View style={[styles.startButton, !canStart && styles.startButtonDisabled]}>
// // // //           {starting ? (
// // // //             <ActivityIndicator color="#FFFFFF" />
// // // //           ) : (
// // // //             <>
// // // //               <Text style={styles.startButtonText}>START GAME</Text>
// // // //               <View style={styles.startArrow}>
// // // //                 <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
// // // //               </View>
// // // //             </>
// // // //           )}
// // // //         </View>
// // // //       </TouchableOpacity>

// // // //       {needMore > 0 ? (
// // // //         <Text style={styles.startHint}>
// // // //           Need {needMore} more {needMore === 1 ? "player" : "players"} to start
// // // //         </Text>
// // // //       ) : null}
// // // //     </View>
// // // //   );

// // // //   return (
// // // //     <View style={styles.flex}>
// // // //       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
// // // //       <SafeAreaView style={styles.flex}>
// // // //         <ScrollView
// // // //           contentContainerStyle={[
// // // //             styles.scroll,
// // // //             {
// // // //               paddingHorizontal: wide ? 32 : 16,
// // // //               paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 8 : 16,
// // // //             },
// // // //           ]}
// // // //           showsVerticalScrollIndicator={false}
// // // //         >
// // // //           <View style={styles.column}>
// // // //             {header}
// // // //             {errorBanner}

// // // //             {wide ? (
// // // //               <View style={styles.wideRow}>
// // // //                 <View style={{ flex: 1, gap: 18 }}>
// // // //                   {heading}
// // // //                   {playersCard}
// // // //                 </View>
// // // //                 <View style={styles.sideCol}>{codeCard}</View>
// // // //               </View>
// // // //             ) : (
// // // //               <View style={{ gap: 16 }}>
// // // //                 {heading}
// // // //                 {codeCard}
// // // //                 {playersCard}
// // // //               </View>
// // // //             )}
// // // //           </View>
// // // //         </ScrollView>
// // // //       </SafeAreaView>
// // // //     </View>
// // // //   );
// // // // };

// // // // export default RoomWaitingScreen;

// // // // const styles = StyleSheet.create({
// // // //   flex: { flex: 1, backgroundColor: C.bg },
// // // //   scroll: {
// // // //     paddingBottom: 32,
// // // //   },
// // // //   column: {
// // // //     width: "100%",
// // // //     maxWidth: 1040,
// // // //     alignSelf: "center",
// // // //   },
// // // //   wideRow: {
// // // //     flexDirection: "row",
// // // //     gap: 24,
// // // //     alignItems: "flex-start",
// // // //   },
// // // //   sideCol: {
// // // //     width: 380,
// // // //     marginTop: 8,
// // // //   },

// // // //   /* ---- header ---- */
// // // //   header: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "space-between",
// // // //     marginBottom: 8,
// // // //     gap: 8,
// // // //   },
// // // //   headerCenter: {
// // // //     flex: 1,
// // // //     alignItems: "center",
// // // //   },
// // // //   headerTitle: {
// // // //     color: C.text,
// // // //     fontSize: 17,
// // // //     fontWeight: "800",
// // // //   },
// // // //   headerSubRow: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 6,
// // // //     marginTop: 3,
// // // //   },
// // // //   liveDot: {
// // // //     width: 7,
// // // //     height: 7,
// // // //     borderRadius: 4,
// // // //   },
// // // //   headerSub: {
// // // //     color: C.sub,
// // // //     fontSize: 12,
// // // //   },
// // // //   headerRight: {
// // // //     flexDirection: "row",
// // // //     gap: 8,
// // // //   },
// // // //   roundButton: {
// // // //     width: 42,
// // // //     height: 42,
// // // //     borderRadius: 21,
// // // //     backgroundColor: C.card,
// // // //     borderWidth: 1,
// // // //     borderColor: C.border,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //   },
// // // //   errorBanner: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 8,
// // // //     marginTop: 8,
// // // //     paddingVertical: 10,
// // // //     paddingHorizontal: 14,
// // // //     borderRadius: 14,
// // // //     backgroundColor: C.coralSoft,
// // // //   },
// // // //   errorText: {
// // // //     color: C.coral,
// // // //     fontSize: 13,
// // // //     fontWeight: "700",
// // // //   },

// // // //   /* ---- heading ---- */
// // // //   headingBlock: {
// // // //     marginTop: 14,
// // // //   },
// // // //   eyebrow: {
// // // //     color: C.coral,
// // // //     fontSize: 12,
// // // //     fontWeight: "800",
// // // //     letterSpacing: 1.5,
// // // //     marginBottom: 6,
// // // //   },
// // // //   headingTitle: {
// // // //     color: C.text,
// // // //     fontSize: 38,
// // // //     fontWeight: "900",
// // // //     lineHeight: 44,
// // // //   },
// // // //   headingTitlePhone: {
// // // //     fontSize: 30,
// // // //     lineHeight: 36,
// // // //   },
// // // //   headingSub: {
// // // //     color: C.sub,
// // // //     fontSize: 15,
// // // //     lineHeight: 22,
// // // //     marginTop: 10,
// // // //     maxWidth: 480,
// // // //   },

// // // //   /* ---- cards ---- */
// // // //   card: {
// // // //     backgroundColor: C.card,
// // // //     borderRadius: 24,
// // // //     borderWidth: 1,
// // // //     borderColor: C.border,
// // // //     padding: 20,
// // // //     shadowColor: "#B8A48C",
// // // //     shadowOpacity: 0.12,
// // // //     shadowRadius: 16,
// // // //     shadowOffset: { width: 0, height: 6 },
// // // //     elevation: 2,
// // // //   },
// // // //   cardHeadRow: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "space-between",
// // // //   },
// // // //   cardTitle: {
// // // //     color: C.text,
// // // //     fontSize: 18,
// // // //     fontWeight: "800",
// // // //   },
// // // //   cardSub: {
// // // //     color: C.sub,
// // // //     fontSize: 12.5,
// // // //     marginTop: 3,
// // // //   },
// // // //   countPill: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 6,
// // // //     paddingVertical: 6,
// // // //     paddingHorizontal: 12,
// // // //     borderRadius: 14,
// // // //     backgroundColor: C.indigoSoft,
// // // //   },
// // // //   countPillText: {
// // // //     color: C.indigo,
// // // //     fontWeight: "800",
// // // //     fontSize: 13,
// // // //   },

// // // //   /* ---- players ---- */
// // // //   playerList: {
// // // //     marginTop: 16,
// // // //     gap: 10,
// // // //   },
// // // //   playerRow: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 12,
// // // //     paddingVertical: 12,
// // // //     paddingHorizontal: 14,
// // // //     borderRadius: 16,
// // // //     backgroundColor: "#FFFBF6",
// // // //     borderWidth: 1,
// // // //     borderColor: C.border,
// // // //   },
// // // //   avatar: {
// // // //     width: 42,
// // // //     height: 42,
// // // //     borderRadius: 21,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //   },
// // // //   avatarText: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 17,
// // // //     fontWeight: "900",
// // // //   },
// // // //   playerName: {
// // // //     color: C.text,
// // // //     fontSize: 15,
// // // //     fontWeight: "800",
// // // //   },
// // // //   playerTag: {
// // // //     color: C.sub,
// // // //     fontSize: 11.5,
// // // //     marginTop: 2,
// // // //   },
// // // //   badge: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 6,
// // // //     paddingVertical: 5,
// // // //     paddingHorizontal: 11,
// // // //     borderRadius: 12,
// // // //   },
// // // //   badgeDot: {
// // // //     width: 7,
// // // //     height: 7,
// // // //     borderRadius: 4,
// // // //   },
// // // //   badgeText: {
// // // //     fontSize: 12,
// // // //     fontWeight: "800",
// // // //   },
// // // //   skelLine: {
// // // //     height: 12,
// // // //     borderRadius: 6,
// // // //     backgroundColor: C.greySoft,
// // // //   },
// // // //   emptyRow: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 12,
// // // //     paddingVertical: 12,
// // // //     paddingHorizontal: 14,
// // // //     borderRadius: 16,
// // // //     borderWidth: 1.5,
// // // //     borderStyle: "dashed",
// // // //     borderColor: "#E6DACB",
// // // //   },
// // // //   emptyAvatar: {
// // // //     width: 42,
// // // //     height: 42,
// // // //     borderRadius: 21,
// // // //     backgroundColor: "#F6EFE6",
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //   },
// // // //   emptyText: {
// // // //     flex: 1,
// // // //     color: "#A79D92",
// // // //     fontSize: 14,
// // // //     fontWeight: "600",
// // // //   },
// // // //   emptyDot: {
// // // //     width: 8,
// // // //     height: 8,
// // // //     borderRadius: 4,
// // // //     backgroundColor: C.coral,
// // // //   },

// // // //   /* ---- code card ---- */
// // // //   tilesRow: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "center",
// // // //     gap: 10,
// // // //     marginTop: 20,
// // // //     marginBottom: 18,
// // // //     flexWrap: "wrap",
// // // //   },
// // // //   tile: {
// // // //     width: 54,
// // // //     height: 54,
// // // //     borderRadius: 15,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     shadowOpacity: 0.35,
// // // //     shadowRadius: 10,
// // // //     shadowOffset: { width: 0, height: 6 },
// // // //     elevation: 4,
// // // //   },
// // // //   tileText: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 26,
// // // //     fontWeight: "900",
// // // //   },
// // // //   codeActions: {
// // // //     flexDirection: "row",
// // // //     gap: 10,
// // // //   },
// // // //   softButton: {
// // // //     flex: 1,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     gap: 8,
// // // //     paddingVertical: 12,
// // // //     borderRadius: 14,
// // // //     backgroundColor: C.indigoSoft,
// // // //   },
// // // //   softButtonText: {
// // // //     color: C.indigo,
// // // //     fontWeight: "800",
// // // //     fontSize: 14,
// // // //   },
// // // //   divider: {
// // // //     height: 1,
// // // //     backgroundColor: C.border,
// // // //     marginVertical: 18,
// // // //   },
// // // //   progressHead: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     marginBottom: 8,
// // // //   },
// // // //   progressLabel: {
// // // //     color: C.sub,
// // // //     fontSize: 13,
// // // //   },
// // // //   progressValue: {
// // // //     color: C.text,
// // // //     fontSize: 13,
// // // //     fontWeight: "800",
// // // //   },
// // // //   progressTrack: {
// // // //     height: 8,
// // // //     borderRadius: 4,
// // // //     backgroundColor: "#F1EAE0",
// // // //     overflow: "hidden",
// // // //   },
// // // //   progressFill: {
// // // //     height: "100%",
// // // //     borderRadius: 4,
// // // //     backgroundColor: C.indigo,
// // // //   },
// // // //   readyToggle: {
// // // //     marginTop: 16,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     gap: 8,
// // // //     paddingVertical: 12,
// // // //     borderRadius: 14,
// // // //     borderWidth: 1.5,
// // // //     borderColor: C.indigo,
// // // //     backgroundColor: "#FFFFFF",
// // // //   },
// // // //   readyToggleOn: {
// // // //     borderColor: C.green,
// // // //     backgroundColor: C.greenSoft,
// // // //   },
// // // //   readyToggleText: {
// // // //     fontWeight: "800",
// // // //     fontSize: 14,
// // // //   },
// // // //   startWrap: {
// // // //     marginTop: 16,
// // // //     borderRadius: 18,
// // // //     shadowColor: C.indigo,
// // // //     shadowOpacity: 0.35,
// // // //     shadowRadius: 14,
// // // //     shadowOffset: { width: 0, height: 8 },
// // // //     elevation: 6,
// // // //   },
// // // //   startWrapDisabled: {
// // // //     shadowOpacity: 0,
// // // //     elevation: 0,
// // // //   },
// // // //   startButton: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     gap: 12,
// // // //     height: 58,
// // // //     borderRadius: 18,
// // // //     backgroundColor: C.indigo,
// // // //   },
// // // //   // FIX: previously a near-white pastel (#B9B6EE) that blended into the white
// // // //   // card and looked "hidden" against C.card (#FFFFFF). Kept the real indigo
// // // //   // fill but dimmed with opacity + gave it a visible border, so it still
// // // //   // reads clearly as the Start Game button, just disabled — not invisible.
// // // //   startButtonDisabled: {
// // // //     backgroundColor: C.indigo,
// // // //     opacity: 0.4,
// // // //     borderWidth: 1.5,
// // // //     borderColor: "rgba(79,70,229,0.5)",
// // // //   },
// // // //   startButtonText: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 16,
// // // //     fontWeight: "900",
// // // //     letterSpacing: 1,
// // // //   },
// // // //   startArrow: {
// // // //     width: 30,
// // // //     height: 30,
// // // //     borderRadius: 10,
// // // //     backgroundColor: "rgba(255,255,255,0.22)",
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //   },
// // // //   startHint: {
// // // //     color: C.sub,
// // // //     fontSize: 12.5,
// // // //     textAlign: "center",
// // // //     marginTop: 10,
// // // //   },
// // // // });
// // // import React, { useEffect, useState, useCallback, useRef } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   ScrollView,
// // //   Share,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   Animated,
// // //   Easing,
// // //   Platform,
// // //   ActivityIndicator,
// // //   useWindowDimensions,
// // // } from "react-native";
// // // import { Ionicons } from "@expo/vector-icons";
// // // import { fetchRoom, WordScrambleRoom } from "../api/Wordscrambleapi";
// // // import { setReady, leaveRoom } from "../api/wsProfileApi";

// // // interface RoomWaitingScreenProps {
// // //   roomCode: string;
// // //   maxPlayers: number; // fallback only — the room JSON from the backend wins
// // //   playerName: string; // the logged-in player's name (from backend profile)
// // //   onBack: () => void;
// // //   onStartGame: () => void | Promise<void>;
// // //   onOpenChat: () => void;
// // //   onOpenRoomSettings: () => void;
// // // }

// // // /* ---------- Word Scramble theme ---------- */
// // // const C = {
// // //   bg: "#FFF8F1",
// // //   card: "#FFFFFF",
// // //   border: "#F1E7DC",
// // //   text: "#141B34",
// // //   sub: "#6B7280",
// // //   indigo: "#4F46E5",
// // //   indigoSoft: "#EEF0FF",
// // //   coral: "#FF6B57",
// // //   coralSoft: "#FFECE8",
// // //   yellow: "#F2B640",
// // //   blue: "#3B82F6",
// // //   red: "#F0566A",
// // //   green: "#22B573",
// // //   greenSoft: "#E3F6EC",
// // //   grey: "#8A93A6",
// // //   greySoft: "#F1EEF0",
// // // };

// // // const TILE_COLORS = [C.yellow, C.blue, C.red, C.green];
// // // const TILE_ROTATIONS = ["-6deg", "4deg", "-3deg", "5deg"];
// // // // only used when the backend doesn't send an avatar colour for a player
// // // const FALLBACK_AVATARS = [C.coral, C.blue, C.green, C.yellow, C.red, C.indigo, "#14B8A6", "#F97316"];

// // // /* ---------- backend field helpers (support snake_case + camelCase) ---------- */
// // // const pick = (obj: any, ...keys: string[]) => {
// // //   for (const k of keys) if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
// // //   return undefined;
// // // };

// // // const statusInfo = (status?: string, loaded?: boolean): { label: string; color: string } => {
// // //   if (!loaded) return { label: "Connecting…", color: C.grey };
// // //   switch ((status || "").toLowerCase()) {
// // //     case "waiting":
// // //     case "lobby":
// // //     case "open":
// // //       return { label: "Lobby open", color: C.green };
// // //     case "playing":
// // //     case "in_progress":
// // //     case "started":
// // //       return { label: "Game in progress", color: C.blue };
// // //     case "finished":
// // //     case "ended":
// // //     case "completed":
// // //       return { label: "Game finished", color: C.grey };
// // //     default:
// // //       return { label: status ? status.charAt(0).toUpperCase() + status.slice(1) : "Lobby open", color: C.green };
// // //   }
// // // };

// // // const RoomWaitingScreen: React.FC<RoomWaitingScreenProps> = ({
// // //   roomCode,
// // //   maxPlayers,
// // //   playerName,
// // //   onBack,
// // //   onStartGame,
// // //   onOpenChat,
// // //   onOpenRoomSettings,
// // // }) => {
// // //   const { width } = useWindowDimensions();
// // //   const wide = width >= 900;

// // //   const [room, setRoom] = useState<WordScrambleRoom | null>(null);
// // //   const [connError, setConnError] = useState(false);
// // //   const [copied, setCopied] = useState(false);
// // //   const [starting, setStarting] = useState(false);
// // //   const [togglingReady, setTogglingReady] = useState(false);

// // //   const poll = useCallback(async () => {
// // //     try {
// // //       const r = await fetchRoom(roomCode);
// // //       setRoom(r);
// // //       setConnError(false);
// // //     } catch (err) {
// // //       console.warn("Room poll failed:", err);
// // //       setConnError(true);
// // //     }
// // //   }, [roomCode]);

// // //   /* ---------- pulsing dot ---------- */
// // //   const pulse = useRef(new Animated.Value(0.35)).current;
// // //   useEffect(() => {
// // //     const loop = Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // //         Animated.timing(pulse, { toValue: 0.35, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
// // //       ])
// // //     );
// // //     loop.start();
// // //     return () => loop.stop();
// // //   }, []);

// // //   /* ---------- everything below is derived from the backend JSON ---------- */
// // //   const loaded = room !== null;
// // //   const r: any = room || {};
// // //   const players: any[] = r.players || [];
// // //   const max = Number(pick(r, "maxPlayers", "max_players")) || maxPlayers;

// // //   // Poll the room every 2.5s so we pick up new players / ready-state changes.
// // //   // Stops automatically once the room is full — nothing left to wait for.
// // //   useEffect(() => {
// // //     poll();
// // //     if (players.length >= max) return;
// // //     const interval = setInterval(poll, 2500);
// // //     return () => clearInterval(interval);
// // //   }, [poll, players.length, max]);

// // //   const minPlayers = Number(pick(r, "minPlayers", "min_players")) || 0;
// // //   const roomName: string | undefined = pick(r, "roomName", "room_name", "name");
// // //   const status = statusInfo(r.status, loaded);

// // //   const me = players.find((p) => p.player_name === playerName);
// // //   const hasReadyField = players.some((p) => typeof pick(p, "is_ready", "isReady") === "boolean");
// // //   const myReady = !!pick(me, "is_ready", "isReady");

// // //   const needMore = Math.max(0, minPlayers - players.length);
// // //   const canStart = loaded && needMore === 0 && !starting;
// // //   const emptySlots = Math.max(0, Math.min(max - players.length, 8));
// // //   const fillPct = max > 0 ? Math.min(100, (players.length / max) * 100) : 0;

// // //   /* ---------- actions ---------- */
// // //   const flashCopied = () => {
// // //     setCopied(true);
// // //     setTimeout(() => setCopied(false), 2000);
// // //   };

// // //   const handleShare = async () => {
// // //     const message = `Join my Word Scramble room! Code: ${roomCode}`;
// // //     try {
// // //       if (Platform.OS === "web") {
// // //         const nav: any = typeof navigator !== "undefined" ? navigator : null;
// // //         if (nav?.share) {
// // //           await nav.share({ text: message });
// // //           return;
// // //         }
// // //         if (nav?.clipboard?.writeText) {
// // //           await nav.clipboard.writeText(message);
// // //           flashCopied();
// // //           return;
// // //         }
// // //       }
// // //       await Share.share({ message });
// // //     } catch {
// // //       // cancelled / unsupported
// // //     }
// // //   };

// // //   const handleCopy = async () => {
// // //     try {
// // //       const nav: any = typeof navigator !== "undefined" ? navigator : null;
// // //       if (Platform.OS === "web" && nav?.clipboard?.writeText) {
// // //         await nav.clipboard.writeText(roomCode);
// // //         flashCopied();
// // //         return;
// // //       }
// // //       await Share.share({ message: roomCode });
// // //     } catch {
// // //       // ignore
// // //     }
// // //   };

// // //   const handleStart = async () => {
// // //     if (!canStart) return;
// // //     setStarting(true);
// // //     try {
// // //       await onStartGame();
// // //     } finally {
// // //       setStarting(false);
// // //     }
// // //   };

// // //   const handleToggleReady = async () => {
// // //     if (togglingReady || !me) return;
// // //     setTogglingReady(true);
// // //     try {
// // //       await setReady(roomCode, playerName, !myReady);
// // //       await poll();
// // //     } catch (err) {
// // //       console.warn("Ready toggle failed:", err);
// // //     } finally {
// // //       setTogglingReady(false);
// // //     }
// // //   };

// // //   const handleBack = async () => {
// // //     // tell the server we left so the slot is freed for someone else
// // //     try {
// // //       await leaveRoom(roomCode, playerName);
// // //     } catch {
// // //       // endpoint missing / offline — still go back
// // //     }
// // //     onBack();
// // //   };

// // //   /* ---------------- pieces ---------------- */

// // //   const header = (
// // //     <View style={styles.header}>
// // //       <TouchableOpacity style={styles.roundButton} onPress={handleBack} activeOpacity={0.8}>
// // //         <Ionicons name="arrow-back" size={20} color={C.text} />
// // //       </TouchableOpacity>

// // //       <View style={styles.headerCenter}>
// // //         <Text style={styles.headerTitle} numberOfLines={1}>
// // //           {roomName ? roomName : `Room ${roomCode}`}
// // //         </Text>
// // //         <View style={styles.headerSubRow}>
// // //           <Animated.View style={[styles.liveDot, { backgroundColor: status.color, opacity: pulse }]} />
// // //           <Text style={styles.headerSub}>
// // //             {status.label}
// // //             {roomName ? ` • ${roomCode}` : ""}
// // //           </Text>
// // //         </View>
// // //       </View>

// // //       <View style={styles.headerRight}>
// // //         <TouchableOpacity style={styles.roundButton} onPress={onOpenChat} activeOpacity={0.8}>
// // //           <Ionicons name="chatbubble-ellipses-outline" size={19} color={C.indigo} />
// // //         </TouchableOpacity>
// // //         <TouchableOpacity style={styles.roundButton} onPress={onOpenRoomSettings} activeOpacity={0.8}>
// // //           <Ionicons name="settings-outline" size={19} color={C.indigo} />
// // //         </TouchableOpacity>
// // //       </View>
// // //     </View>
// // //   );

// // //   const errorBanner = connError ? (
// // //     <View style={styles.errorBanner}>
// // //       <Ionicons name="cloud-offline-outline" size={16} color={C.coral} />
// // //       <Text style={styles.errorText}>Can't reach the server. Retrying…</Text>
// // //     </View>
// // //   ) : null;

// // //   const heading = (
// // //     <View style={styles.headingBlock}>
// // //       <Text style={styles.eyebrow}>LOBBY</Text>
// // //       <Text style={[styles.headingTitle, !wide && styles.headingTitlePhone]}>Waiting for</Text>
// // //       <Text style={[styles.headingTitle, !wide && styles.headingTitlePhone, { color: C.indigo }]}>players…</Text>
// // //       <Text style={styles.headingSub}>
// // //         Share the room code with your friends. The game starts when you're ready.
// // //       </Text>
// // //     </View>
// // //   );

// // //   const playersCard = (
// // //     <View style={styles.card}>
// // //       <View style={styles.cardHeadRow}>
// // //         <View>
// // //           <Text style={styles.cardTitle}>Players</Text>
// // //           <Text style={styles.cardSub}>Everyone in this room</Text>
// // //         </View>
// // //         <View style={styles.countPill}>
// // //           <Ionicons name="people-outline" size={14} color={C.indigo} />
// // //           <Text style={styles.countPillText}>
// // //             {players.length}/{max}
// // //           </Text>
// // //         </View>
// // //       </View>

// // //       <View style={styles.playerList}>
// // //         {/* loading skeleton until the first response arrives */}
// // //         {!loaded && !connError
// // //           ? [0, 1].map((i) => (
// // //               <View key={`sk-${i}`} style={[styles.playerRow, { opacity: 0.6 }]}>
// // //                 <View style={[styles.avatar, { backgroundColor: C.greySoft }]} />
// // //                 <View style={{ flex: 1, gap: 6 }}>
// // //                   <View style={[styles.skelLine, { width: "40%" }]} />
// // //                   <View style={[styles.skelLine, { width: "25%", height: 8 }]} />
// // //                 </View>
// // //               </View>
// // //             ))
// // //           : null}

// // //         {players.map((p, i) => {
// // //           const isMe = p.player_name === playerName;
// // //           const isHost = !!pick(p, "is_host", "isHost");
// // //           const readyVal = pick(p, "is_ready", "isReady");
// // //           const color = pick(p, "avatar_color", "avatarColor") || FALLBACK_AVATARS[i % FALLBACK_AVATARS.length];
// // //           return (
// // //             <View key={String(p.id ?? p.player_name)} style={styles.playerRow}>
// // //               <View style={[styles.avatar, { backgroundColor: color }]}>
// // //                 <Text style={styles.avatarText}>{(p.player_name || "?").charAt(0).toUpperCase()}</Text>
// // //               </View>

// // //               <View style={{ flex: 1 }}>
// // //                 <Text style={styles.playerName} numberOfLines={1}>
// // //                   {p.player_name}
// // //                 </Text>
// // //                 {isMe || isHost ? (
// // //                   <Text style={styles.playerTag}>{[isMe ? "That's you" : null, isHost ? "Host" : null].filter(Boolean).join(" • ")}</Text>
// // //                 ) : null}
// // //               </View>

// // //               {typeof readyVal === "boolean" ? (
// // //                 <View style={[styles.badge, { backgroundColor: readyVal ? C.greenSoft : C.greySoft }]}>
// // //                   <View style={[styles.badgeDot, { backgroundColor: readyVal ? C.green : C.grey }]} />
// // //                   <Text style={[styles.badgeText, { color: readyVal ? C.green : C.grey }]}>
// // //                     {readyVal ? "Ready" : "Not ready"}
// // //                   </Text>
// // //                 </View>
// // //               ) : null}
// // //             </View>
// // //           );
// // //         })}

// // //         {loaded
// // //           ? Array.from({ length: emptySlots }).map((_, i) => (
// // //               <View key={`empty-${i}`} style={styles.emptyRow}>
// // //                 <View style={styles.emptyAvatar}>
// // //                   <Ionicons name="person-add-outline" size={15} color="#B8AFA5" />
// // //                 </View>
// // //                 <Text style={styles.emptyText}>Waiting for player…</Text>
// // //                 <Animated.View style={[styles.emptyDot, { opacity: pulse }]} />
// // //               </View>
// // //             ))
// // //           : null}
// // //       </View>
// // //     </View>
// // //   );

// // //   const codeCard = (
// // //     <View style={styles.card}>
// // //       <Text style={styles.cardTitle}>Room code</Text>
// // //       <Text style={styles.cardSub}>Friends enter this to join</Text>

// // //       <View style={styles.tilesRow}>
// // //         {roomCode.split("").map((ch, i) => (
// // //           <View
// // //             key={i}
// // //             style={[
// // //               styles.tile,
// // //               {
// // //                 backgroundColor: TILE_COLORS[i % TILE_COLORS.length],
// // //                 transform: [{ rotate: TILE_ROTATIONS[i % TILE_ROTATIONS.length] }],
// // //                 shadowColor: TILE_COLORS[i % TILE_COLORS.length],
// // //               },
// // //             ]}
// // //           >
// // //             <Text style={styles.tileText}>{ch}</Text>
// // //           </View>
// // //         ))}
// // //       </View>

// // //       <View style={styles.codeActions}>
// // //         <TouchableOpacity style={styles.softButton} onPress={handleCopy} activeOpacity={0.8}>
// // //           <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color={C.indigo} />
// // //           <Text style={styles.softButtonText}>{copied ? "Copied!" : "Copy"}</Text>
// // //         </TouchableOpacity>
// // //         <TouchableOpacity style={styles.softButton} onPress={handleShare} activeOpacity={0.8}>
// // //           <Ionicons name="share-social-outline" size={16} color={C.indigo} />
// // //           <Text style={styles.softButtonText}>Share</Text>
// // //         </TouchableOpacity>
// // //       </View>

// // //       <View style={styles.divider} />

// // //       <View style={styles.progressHead}>
// // //         <Text style={styles.progressLabel}>Players joined</Text>
// // //         <Text style={styles.progressValue}>
// // //           {players.length} / {max}
// // //         </Text>
// // //       </View>
// // //       <View style={styles.progressTrack}>
// // //         <View style={[styles.progressFill, { width: `${fillPct}%` }]} />
// // //       </View>

// // //       {/* ready toggle — only when the backend tracks readiness */}
// // //       {hasReadyField && me ? (
// // //         <TouchableOpacity
// // //           style={[styles.readyToggle, myReady && styles.readyToggleOn]}
// // //           onPress={handleToggleReady}
// // //           activeOpacity={0.85}
// // //           disabled={togglingReady}
// // //         >
// // //           <Ionicons
// // //             name={myReady ? "checkmark-circle" : "ellipse-outline"}
// // //             size={18}
// // //             color={myReady ? C.green : C.indigo}
// // //           />
// // //           <Text style={[styles.readyToggleText, { color: myReady ? C.green : C.indigo }]}>
// // //             {myReady ? "You're ready" : "Mark me as ready"}
// // //           </Text>
// // //         </TouchableOpacity>
// // //       ) : null}

// // //       <TouchableOpacity
// // //         style={[styles.startWrap, !canStart && styles.startWrapDisabled]}
// // //         activeOpacity={0.88}
// // //         onPress={handleStart}
// // //         disabled={!canStart}
// // //       >
// // //         <View style={[styles.startButton, !canStart && styles.startButtonDisabled]}>
// // //           {starting ? (
// // //             <ActivityIndicator color="#FFFFFF" />
// // //           ) : (
// // //             <>
// // //               <Text style={styles.startButtonText}>START GAME</Text>
// // //               <View style={styles.startArrow}>
// // //                 <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
// // //               </View>
// // //             </>
// // //           )}
// // //         </View>
// // //       </TouchableOpacity>

// // //       {needMore > 0 ? (
// // //         <Text style={styles.startHint}>
// // //           Need {needMore} more {needMore === 1 ? "player" : "players"} to start
// // //         </Text>
// // //       ) : null}
// // //     </View>
// // //   );

// // //   return (
// // //     <View style={styles.flex}>
// // //       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
// // //       <SafeAreaView style={styles.flex}>
// // //         <ScrollView
// // //           contentContainerStyle={[
// // //             styles.scroll,
// // //             {
// // //               paddingHorizontal: wide ? 32 : 16,
// // //               paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 8 : 16,
// // //             },
// // //           ]}
// // //           showsVerticalScrollIndicator={false}
// // //         >
// // //           <View style={styles.column}>
// // //             {header}
// // //             {errorBanner}

// // //             {wide ? (
// // //               <View style={styles.wideRow}>
// // //                 <View style={styles.mainCol}>
// // //                   {heading}
// // //                   {playersCard}
// // //                 </View>
// // //                 <View style={styles.sideCol}>{codeCard}</View>
// // //               </View>
// // //             ) : (
// // //               <View style={{ gap: 16 }}>
// // //                 {heading}
// // //                 {codeCard}
// // //                 {playersCard}
// // //               </View>
// // //             )}
// // //           </View>
// // //         </ScrollView>
// // //       </SafeAreaView>
// // //     </View>
// // //   );
// // // };

// // // export default RoomWaitingScreen;

// // // const styles = StyleSheet.create({
// // //   flex: { flex: 1, backgroundColor: C.bg },
// // //   scroll: {
// // //     paddingBottom: 32,
// // //   },
// // //   column: {
// // //     // FIX: this used to be capped at maxWidth: 1040 and centered, which is
// // //     // what left the big empty gutters on the left/right (and the dead gap
// // //     // between the two columns) on wide screens. Room Settings never had a
// // //     // cap, so it always stretched edge to edge. Dropping the cap here makes
// // //     // this screen fill the same way.
// // //     width: "100%",
// // //   },
// // //   wideRow: {
// // //     flexDirection: "row",
// // //     gap: 24,
// // //     alignItems: "flex-start",
// // //   },
// // //   mainCol: {
// // //     flex: 1,
// // //     gap: 18,
// // //     minWidth: 0, // lets long content shrink instead of forcing overflow
// // //   },
// // //   sideCol: {
// // //     // FIX: was a fixed width: 380. On very wide screens that fixed width is
// // //     // what created the leftover empty band next to the room-code card. Give
// // //     // it a flex share instead so both columns grow together and the row
// // //     // fills the full width, while still keeping the card at a sensible size
// // //     // on narrower "wide" layouts via maxWidth.
// // //     flex: 1,
// // //     maxWidth: 420,
// // //     marginTop: 8,
// // //   },

// // //   /* ---- header ---- */
// // //   header: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //     marginBottom: 8,
// // //     gap: 8,
// // //   },
// // //   headerCenter: {
// // //     flex: 1,
// // //     alignItems: "center",
// // //   },
// // //   headerTitle: {
// // //     color: C.text,
// // //     fontSize: 17,
// // //     fontWeight: "800",
// // //   },
// // //   headerSubRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 6,
// // //     marginTop: 3,
// // //   },
// // //   liveDot: {
// // //     width: 7,
// // //     height: 7,
// // //     borderRadius: 4,
// // //   },
// // //   headerSub: {
// // //     color: C.sub,
// // //     fontSize: 12,
// // //   },
// // //   headerRight: {
// // //     flexDirection: "row",
// // //     gap: 8,
// // //   },
// // //   roundButton: {
// // //     width: 42,
// // //     height: 42,
// // //     borderRadius: 21,
// // //     backgroundColor: C.card,
// // //     borderWidth: 1,
// // //     borderColor: C.border,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   errorBanner: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 8,
// // //     marginTop: 8,
// // //     paddingVertical: 10,
// // //     paddingHorizontal: 14,
// // //     borderRadius: 14,
// // //     backgroundColor: C.coralSoft,
// // //   },
// // //   errorText: {
// // //     color: C.coral,
// // //     fontSize: 13,
// // //     fontWeight: "700",
// // //   },

// // //   /* ---- heading ---- */
// // //   headingBlock: {
// // //     marginTop: 14,
// // //   },
// // //   eyebrow: {
// // //     color: C.coral,
// // //     fontSize: 12,
// // //     fontWeight: "800",
// // //     letterSpacing: 1.5,
// // //     marginBottom: 6,
// // //   },
// // //   headingTitle: {
// // //     color: C.text,
// // //     fontSize: 38,
// // //     fontWeight: "900",
// // //     lineHeight: 44,
// // //   },
// // //   headingTitlePhone: {
// // //     fontSize: 30,
// // //     lineHeight: 36,
// // //   },
// // //   headingSub: {
// // //     color: C.sub,
// // //     fontSize: 15,
// // //     lineHeight: 22,
// // //     marginTop: 10,
// // //     maxWidth: 480,
// // //   },

// // //   /* ---- cards ---- */
// // //   card: {
// // //     backgroundColor: C.card,
// // //     borderRadius: 24,
// // //     borderWidth: 1,
// // //     borderColor: C.border,
// // //     padding: 20,
// // //     shadowColor: "#B8A48C",
// // //     shadowOpacity: 0.12,
// // //     shadowRadius: 16,
// // //     shadowOffset: { width: 0, height: 6 },
// // //     elevation: 2,
// // //   },
// // //   cardHeadRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //   },
// // //   cardTitle: {
// // //     color: C.text,
// // //     fontSize: 18,
// // //     fontWeight: "800",
// // //   },
// // //   cardSub: {
// // //     color: C.sub,
// // //     fontSize: 12.5,
// // //     marginTop: 3,
// // //   },
// // //   countPill: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 6,
// // //     paddingVertical: 6,
// // //     paddingHorizontal: 12,
// // //     borderRadius: 14,
// // //     backgroundColor: C.indigoSoft,
// // //   },
// // //   countPillText: {
// // //     color: C.indigo,
// // //     fontWeight: "800",
// // //     fontSize: 13,
// // //   },

// // //   /* ---- players ---- */
// // //   playerList: {
// // //     marginTop: 16,
// // //     gap: 10,
// // //   },
// // //   playerRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 12,
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 14,
// // //     borderRadius: 16,
// // //     backgroundColor: "#FFFBF6",
// // //     borderWidth: 1,
// // //     borderColor: C.border,
// // //   },
// // //   avatar: {
// // //     width: 42,
// // //     height: 42,
// // //     borderRadius: 21,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   avatarText: {
// // //     color: "#FFFFFF",
// // //     fontSize: 17,
// // //     fontWeight: "900",
// // //   },
// // //   playerName: {
// // //     color: C.text,
// // //     fontSize: 15,
// // //     fontWeight: "800",
// // //   },
// // //   playerTag: {
// // //     color: C.sub,
// // //     fontSize: 11.5,
// // //     marginTop: 2,
// // //   },
// // //   badge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 6,
// // //     paddingVertical: 5,
// // //     paddingHorizontal: 11,
// // //     borderRadius: 12,
// // //   },
// // //   badgeDot: {
// // //     width: 7,
// // //     height: 7,
// // //     borderRadius: 4,
// // //   },
// // //   badgeText: {
// // //     fontSize: 12,
// // //     fontWeight: "800",
// // //   },
// // //   skelLine: {
// // //     height: 12,
// // //     borderRadius: 6,
// // //     backgroundColor: C.greySoft,
// // //   },
// // //   emptyRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 12,
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 14,
// // //     borderRadius: 16,
// // //     borderWidth: 1.5,
// // //     borderStyle: "dashed",
// // //     borderColor: "#E6DACB",
// // //   },
// // //   emptyAvatar: {
// // //     width: 42,
// // //     height: 42,
// // //     borderRadius: 21,
// // //     backgroundColor: "#F6EFE6",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   emptyText: {
// // //     flex: 1,
// // //     color: "#A79D92",
// // //     fontSize: 14,
// // //     fontWeight: "600",
// // //   },
// // //   emptyDot: {
// // //     width: 8,
// // //     height: 8,
// // //     borderRadius: 4,
// // //     backgroundColor: C.coral,
// // //   },

// // //   /* ---- code card ---- */
// // //   tilesRow: {
// // //     flexDirection: "row",
// // //     justifyContent: "center",
// // //     gap: 10,
// // //     marginTop: 20,
// // //     marginBottom: 18,
// // //     flexWrap: "wrap",
// // //   },
// // //   tile: {
// // //     width: 54,
// // //     height: 54,
// // //     borderRadius: 15,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     shadowOpacity: 0.35,
// // //     shadowRadius: 10,
// // //     shadowOffset: { width: 0, height: 6 },
// // //     elevation: 4,
// // //   },
// // //   tileText: {
// // //     color: "#FFFFFF",
// // //     fontSize: 26,
// // //     fontWeight: "900",
// // //   },
// // //   codeActions: {
// // //     flexDirection: "row",
// // //     gap: 10,
// // //   },
// // //   softButton: {
// // //     flex: 1,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     gap: 8,
// // //     paddingVertical: 12,
// // //     borderRadius: 14,
// // //     backgroundColor: C.indigoSoft,
// // //   },
// // //   softButtonText: {
// // //     color: C.indigo,
// // //     fontWeight: "800",
// // //     fontSize: 14,
// // //   },
// // //   divider: {
// // //     height: 1,
// // //     backgroundColor: C.border,
// // //     marginVertical: 18,
// // //   },
// // //   progressHead: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     marginBottom: 8,
// // //   },
// // //   progressLabel: {
// // //     color: C.sub,
// // //     fontSize: 13,
// // //   },
// // //   progressValue: {
// // //     color: C.text,
// // //     fontSize: 13,
// // //     fontWeight: "800",
// // //   },
// // //   progressTrack: {
// // //     height: 8,
// // //     borderRadius: 4,
// // //     backgroundColor: "#F1EAE0",
// // //     overflow: "hidden",
// // //   },
// // //   progressFill: {
// // //     height: "100%",
// // //     borderRadius: 4,
// // //     backgroundColor: C.indigo,
// // //   },
// // //   readyToggle: {
// // //     marginTop: 16,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     gap: 8,
// // //     paddingVertical: 12,
// // //     borderRadius: 14,
// // //     borderWidth: 1.5,
// // //     borderColor: C.indigo,
// // //     backgroundColor: "#FFFFFF",
// // //   },
// // //   readyToggleOn: {
// // //     borderColor: C.green,
// // //     backgroundColor: C.greenSoft,
// // //   },
// // //   readyToggleText: {
// // //     fontWeight: "800",
// // //     fontSize: 14,
// // //   },
// // //   startWrap: {
// // //     marginTop: 16,
// // //     borderRadius: 18,
// // //     shadowColor: C.indigo,
// // //     shadowOpacity: 0.35,
// // //     shadowRadius: 14,
// // //     shadowOffset: { width: 0, height: 8 },
// // //     elevation: 6,
// // //   },
// // //   startWrapDisabled: {
// // //     shadowOpacity: 0,
// // //     elevation: 0,
// // //   },
// // //   startButton: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     gap: 12,
// // //     height: 58,
// // //     borderRadius: 18,
// // //     backgroundColor: C.indigo,
// // //   },
// // //   // FIX: previously a near-white pastel (#B9B6EE) that blended into the white
// // //   // card and looked "hidden" against C.card (#FFFFFF). Kept the real indigo
// // //   // fill but dimmed with opacity + gave it a visible border, so it still
// // //   // reads clearly as the Start Game button, just disabled — not invisible.
// // //   startButtonDisabled: {
// // //     backgroundColor: C.indigo,
// // //     opacity: 0.4,
// // //     borderWidth: 1.5,
// // //     borderColor: "rgba(79,70,229,0.5)",
// // //   },
// // //   startButtonText: {
// // //     color: "#FFFFFF",
// // //     fontSize: 16,
// // //     fontWeight: "900",
// // //     letterSpacing: 1,
// // //   },
// // //   startArrow: {
// // //     width: 30,
// // //     height: 30,
// // //     borderRadius: 10,
// // //     backgroundColor: "rgba(255,255,255,0.22)",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   startHint: {
// // //     color: C.sub,
// // //     fontSize: 12.5,
// // //     textAlign: "center",
// // //     marginTop: 10,
// // //   },
// // // });
// // import React, {
// //   useEffect,
// //   useState,
// //   useCallback,
// //   useRef,
// // } from "react";

// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ScrollView,
// //   Share,
// //   SafeAreaView,
// //   StatusBar,
// //   Animated,
// //   Easing,
// //   Platform,
// //   ActivityIndicator,
// //   useWindowDimensions,
// // } from "react-native";

// // import { Ionicons } from "@expo/vector-icons";

// // import {
// //   fetchRoom,
// //   WordScrambleRoom,
// // } from "../api/Wordscrambleapi";

// // import {
// //   setReady,
// //   leaveRoom,
// // } from "../api/wsProfileApi";

// // /* =========================================================
// //    TYPES
// // ========================================================= */

// // interface RoomWaitingScreenProps {
// //   /**
// //    * Backend room object.
// //    *
// //    * This allows:
// //    *
// //    * <RoomWaitingScreen room={room} />
// //    */
// //   room: WordScrambleRoom;

// //   /**
// //    * Optional values.
// //    * These are kept optional so the screen can also work
// //    * when opened from a navigation route.
// //    */
// //   roomCode?: string;
// //   playerName?: string;
// //   maxPlayers?: number;

// //   onBack?: () => void;

// //   onStartGame?: () => void | Promise<void>;

// //   onOpenChat?: () => void;

// //   onOpenRoomSettings?: () => void;
// // }

// // /* =========================================================
// //    THEME
// // ========================================================= */

// // const C = {
// //   bg: "#FFF8F1",
// //   card: "#FFFFFF",
// //   border: "#F1E7DC",

// //   text: "#141B34",
// //   sub: "#6B7280",

// //   indigo: "#4F46E5",
// //   indigoSoft: "#EEF0FF",

// //   coral: "#FF6B57",
// //   coralSoft: "#FFECE8",

// //   yellow: "#F2B640",
// //   blue: "#3B82F6",
// //   red: "#F0566A",
// //   green: "#22B573",

// //   greenSoft: "#E3F6EC",

// //   grey: "#8A93A6",
// //   greySoft: "#F1EEF0",
// // };

// // const TILE_COLORS = [
// //   C.yellow,
// //   C.blue,
// //   C.red,
// //   C.green,
// // ];

// // const TILE_ROTATIONS = [
// //   "-6deg",
// //   "4deg",
// //   "-3deg",
// //   "5deg",
// // ];

// // const FALLBACK_AVATARS = [
// //   C.coral,
// //   C.blue,
// //   C.green,
// //   C.yellow,
// //   C.red,
// //   C.indigo,
// //   "#14B8A6",
// //   "#F97316",
// // ];

// // /* =========================================================
// //    HELPERS
// // ========================================================= */

// // const pick = (
// //   obj: any,
// //   ...keys: string[]
// // ) => {
// //   for (const key of keys) {
// //     if (
// //       obj &&
// //       obj[key] !== undefined &&
// //       obj[key] !== null
// //     ) {
// //       return obj[key];
// //     }
// //   }

// //   return undefined;
// // };

// // const statusInfo = (
// //   status?: string
// // ): {
// //   label: string;
// //   color: string;
// // } => {
// //   switch ((status || "").toLowerCase()) {
// //     case "waiting":
// //     case "lobby":
// //     case "open":
// //       return {
// //         label: "Lobby open",
// //         color: C.green,
// //       };

// //     case "playing":
// //     case "in_progress":
// //     case "started":
// //       return {
// //         label: "Game in progress",
// //         color: C.blue,
// //       };

// //     case "finished":
// //     case "ended":
// //     case "completed":
// //       return {
// //         label: "Game finished",
// //         color: C.grey,
// //       };

// //     default:
// //       return {
// //         label: status
// //           ? status.charAt(0).toUpperCase() +
// //             status.slice(1)
// //           : "Lobby open",
// //         color: C.green,
// //       };
// //   }
// // };

// // /* =========================================================
// //    COMPONENT
// // ========================================================= */

// // const RoomWaitingScreen: React.FC<
// //   RoomWaitingScreenProps
// // > = ({
// //   room: initialRoom,
// //   roomCode: propRoomCode,
// //   playerName: propPlayerName,
// //   maxPlayers: propMaxPlayers,
// //   onBack,
// //   onStartGame,
// //   onOpenChat,
// //   onOpenRoomSettings,
// // }) => {
// //   const { width } = useWindowDimensions();

// //   const wide = width >= 900;

// //   /* -------------------------------------------------------
// //      ROOM STATE
// //   ------------------------------------------------------- */

// //   const [room, setRoom] =
// //     useState<WordScrambleRoom | null>(
// //       initialRoom || null
// //     );

// //   const [connError, setConnError] =
// //     useState(false);

// //   const [copied, setCopied] =
// //     useState(false);

// //   const [starting, setStarting] =
// //     useState(false);

// //   const [togglingReady, setTogglingReady] =
// //     useState(false);

// //   /* -------------------------------------------------------
// //      ROOM DATA
// //   ------------------------------------------------------- */

// //   const r: any = room || {};

// //   const roomCode =
// //     propRoomCode ||
// //     pick(
// //       r,
// //       "roomCode",
// //       "room_code",
// //       "code"
// //     ) ||
// //     "";

// //   const playerName =
// //     propPlayerName ||
// //     pick(
// //       r,
// //       "playerName",
// //       "player_name",
// //       "hostPlayerName",
// //       "host_player_name"
// //     ) ||
// //     "";

// //   const players: any[] =
// //     Array.isArray(r.players)
// //       ? r.players
// //       : [];

// //   const max =
// //     Number(
// //       pick(
// //         r,
// //         "maxPlayers",
// //         "max_players"
// //       )
// //     ) ||
// //     propMaxPlayers ||
// //     2;

// //   const roomName: string | undefined =
// //     pick(
// //       r,
// //       "roomName",
// //       "room_name",
// //       "name"
// //     );

// //   const minPlayers =
// //     Number(
// //       pick(
// //         r,
// //         "minPlayers",
// //         "min_players"
// //       )
// //     ) || 0;

// //   const status = statusInfo(r.status);

// //   /* -------------------------------------------------------
// //      CURRENT PLAYER
// //   ------------------------------------------------------- */

// //   const me = players.find(
// //     (p) =>
// //       pick(
// //         p,
// //         "player_name",
// //         "playerName",
// //         "name"
// //       ) === playerName
// //   );

// //   const hasReadyField =
// //     players.some(
// //       (p) =>
// //         typeof pick(
// //           p,
// //           "is_ready",
// //           "isReady"
// //         ) === "boolean"
// //     );

// //   const myReady =
// //     !!pick(
// //       me,
// //       "is_ready",
// //       "isReady"
// //     );

// //   /* -------------------------------------------------------
// //      PLAYER COUNTS
// //   ------------------------------------------------------- */

// //   const needMore = Math.max(
// //     0,
// //     minPlayers - players.length
// //   );

// //   const canStart =
// //     !!room &&
// //     needMore === 0 &&
// //     !starting;

// //   const emptySlots = Math.max(
// //     0,
// //     Math.min(
// //       max - players.length,
// //       8
// //     )
// //   );

// //   const fillPct =
// //     max > 0
// //       ? Math.min(
// //           100,
// //           (players.length / max) * 100
// //         )
// //       : 0;

// //   /* =======================================================
// //      PULSE ANIMATION
// //   ======================================================= */

// //   const pulse = useRef(
// //     new Animated.Value(0.35)
// //   ).current;

// //   useEffect(() => {
// //     const loop = Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(
// //           pulse,
// //           {
// //             toValue: 1,
// //             duration: 700,
// //             easing: Easing.inOut(
// //               Easing.ease
// //             ),
// //             useNativeDriver: true,
// //           }
// //         ),

// //         Animated.timing(
// //           pulse,
// //           {
// //             toValue: 0.35,
// //             duration: 700,
// //             easing: Easing.inOut(
// //               Easing.ease
// //             ),
// //             useNativeDriver: true,
// //           }
// //         ),
// //       ])
// //     );

// //     loop.start();

// //     return () => {
// //       loop.stop();
// //     };
// //   }, [pulse]);

// //   /* =======================================================
// //      FETCH ROOM
// //   ======================================================= */

// //   const poll = useCallback(
// //     async () => {
// //       if (!roomCode) {
// //         return;
// //       }

// //       try {
// //         const response =
// //           await fetchRoom(roomCode);

// //         setRoom(response.room);

// //         setConnError(false);
// //       } catch (error) {
// //         console.warn(
// //           "Room poll failed:",
// //           error
// //         );

// //         setConnError(true);
// //       }
// //     },
// //     [roomCode]
// //   );

// //   /* =======================================================
// //      ROOM POLLING
// //   ======================================================= */

// //   useEffect(() => {
// //     poll();

// //     if (players.length >= max) {
// //       return;
// //     }

// //     const interval =
// //       setInterval(
// //         poll,
// //         2500
// //       );

// //     return () =>
// //       clearInterval(interval);
// //   }, [
// //     poll,
// //     players.length,
// //     max,
// //   ]);

// //   /* =======================================================
// //      COPY FEEDBACK
// //   ======================================================= */

// //   const flashCopied = () => {
// //     setCopied(true);

// //     setTimeout(() => {
// //       setCopied(false);
// //     }, 2000);
// //   };

// //   /* =======================================================
// //      SHARE ROOM
// //   ======================================================= */

// //   const handleShare = async () => {
// //     const message =
// //       `Join my Word Scramble room! Code: ${roomCode}`;

// //     try {
// //       if (Platform.OS === "web") {
// //         const nav: any =
// //           typeof navigator !== "undefined"
// //             ? navigator
// //             : null;

// //         if (nav?.share) {
// //           await nav.share({
// //             text: message,
// //           });

// //           return;
// //         }

// //         if (
// //           nav?.clipboard?.writeText
// //         ) {
// //           await nav.clipboard.writeText(
// //             message
// //           );

// //           flashCopied();

// //           return;
// //         }
// //       }

// //       await Share.share({
// //         message,
// //       });
// //     } catch {
// //       // user cancelled share
// //     }
// //   };

// //   /* =======================================================
// //      COPY ROOM CODE
// //   ======================================================= */

// //   const handleCopy = async () => {
// //     try {
// //       const nav: any =
// //         typeof navigator !== "undefined"
// //           ? navigator
// //           : null;

// //       if (
// //         Platform.OS === "web" &&
// //         nav?.clipboard?.writeText
// //       ) {
// //         await nav.clipboard.writeText(
// //           roomCode
// //         );

// //         flashCopied();

// //         return;
// //       }

// //       await Share.share({
// //         message: roomCode,
// //       });
// //     } catch {
// //       // ignore
// //     }
// //   };

// //   /* =======================================================
// //      START GAME
// //   ======================================================= */

// //   const handleStart = async () => {
// //     if (!canStart) {
// //       return;
// //     }

// //     if (!onStartGame) {
// //       console.warn(
// //         "onStartGame callback was not provided."
// //       );

// //       return;
// //     }

// //     setStarting(true);

// //     try {
// //       await onStartGame();
// //     } finally {
// //       setStarting(false);
// //     }
// //   };

// //   /* =======================================================
// //      READY
// //   ======================================================= */

// //   const handleToggleReady =
// //     async () => {
// //       if (
// //         togglingReady ||
// //         !me ||
// //         !roomCode ||
// //         !playerName
// //       ) {
// //         return;
// //       }

// //       setTogglingReady(true);

// //       try {
// //         await setReady(
// //           roomCode,
// //           playerName,
// //           !myReady
// //         );

// //         await poll();
// //       } catch (error) {
// //         console.warn(
// //           "Ready toggle failed:",
// //           error
// //         );
// //       } finally {
// //         setTogglingReady(false);
// //       }
// //     };

// //   /* =======================================================
// //      BACK
// //   ======================================================= */

// //   const handleBack =
// //     async () => {
// //       if (
// //         roomCode &&
// //         playerName
// //       ) {
// //         try {
// //           await leaveRoom(
// //             roomCode,
// //             playerName
// //           );
// //         } catch {
// //           // continue back even if API fails
// //         }
// //       }

// //       onBack?.();
// //     };

// //   /* =======================================================
// //      HEADER
// //   ======================================================= */

// //   const header = (
// //     <View style={styles.header}>
// //       <TouchableOpacity
// //         style={styles.roundButton}
// //         onPress={handleBack}
// //         activeOpacity={0.8}
// //       >
// //         <Ionicons
// //           name="arrow-back"
// //           size={20}
// //           color={C.text}
// //         />
// //       </TouchableOpacity>

// //       <View style={styles.headerCenter}>
// //         <Text
// //           style={styles.headerTitle}
// //           numberOfLines={1}
// //         >
// //           {roomName ||
// //             `Room ${roomCode}`}
// //         </Text>

// //         <View
// //           style={styles.headerSubRow}
// //         >
// //           <Animated.View
// //             style={[
// //               styles.liveDot,
// //               {
// //                 backgroundColor:
// //                   status.color,
// //                 opacity: pulse,
// //               },
// //             ]}
// //           />

// //           <Text
// //             style={styles.headerSub}
// //           >
// //             {status.label}

// //             {roomName
// //               ? ` • ${roomCode}`
// //               : ""}
// //           </Text>
// //         </View>
// //       </View>

// //       <View
// //         style={styles.headerRight}
// //       >
// //         <TouchableOpacity
// //           style={styles.roundButton}
// //           onPress={
// //             onOpenChat
// //           }
// //           activeOpacity={0.8}
// //         >
// //           <Ionicons
// //             name="chatbubble-ellipses-outline"
// //             size={19}
// //             color={C.indigo}
// //           />
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={styles.roundButton}
// //           onPress={
// //             onOpenRoomSettings
// //           }
// //           activeOpacity={0.8}
// //         >
// //           <Ionicons
// //             name="settings-outline"
// //             size={19}
// //             color={C.indigo}
// //           />
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );

// //   /* =======================================================
// //      ERROR BANNER
// //   ======================================================= */

// //   const errorBanner =
// //     connError ? (
// //       <View
// //         style={
// //           styles.errorBanner
// //         }
// //       >
// //         <Ionicons
// //           name="cloud-offline-outline"
// //           size={16}
// //           color={C.coral}
// //         />

// //         <Text
// //           style={styles.errorText}
// //         >
// //           Can't reach the server.
// //           Retrying…
// //         </Text>
// //       </View>
// //     ) : null;

// //   /* =======================================================
// //      HEADING
// //   ======================================================= */

// //   const heading = (
// //     <View
// //       style={styles.headingBlock}
// //     >
// //       <Text
// //         style={styles.eyebrow}
// //       >
// //         LOBBY
// //       </Text>

// //       <Text
// //         style={[
// //           styles.headingTitle,
// //           !wide &&
// //             styles.headingTitlePhone,
// //         ]}
// //       >
// //         Waiting for
// //       </Text>

// //       <Text
// //         style={[
// //           styles.headingTitle,
// //           !wide &&
// //             styles.headingTitlePhone,
// //           {
// //             color: C.indigo,
// //           },
// //         ]}
// //       >
// //         players…
// //       </Text>

// //       <Text
// //         style={styles.headingSub}
// //       >
// //         Share the room code with
// //         your friends. The game
// //         starts when you're ready.
// //       </Text>
// //     </View>
// //   );

// //   /* =======================================================
// //      PLAYERS CARD
// //   ======================================================= */

// //   const playersCard = (
// //     <View style={styles.card}>
// //       <View
// //         style={styles.cardHeadRow}
// //       >
// //         <View>
// //           <Text
// //             style={styles.cardTitle}
// //           >
// //             Players
// //           </Text>

// //           <Text
// //             style={styles.cardSub}
// //           >
// //             Everyone in this room
// //           </Text>
// //         </View>

// //         <View
// //           style={styles.countPill}
// //         >
// //           <Ionicons
// //             name="people-outline"
// //             size={14}
// //             color={C.indigo}
// //           />

// //           <Text
// //             style={
// //               styles.countPillText
// //             }
// //           >
// //             {players.length}/{max}
// //           </Text>
// //         </View>
// //       </View>

// //       <View
// //         style={styles.playerList}
// //       >
// //         {!room &&
// //           !connError &&
// //           [0, 1].map((i) => (
// //             <View
// //               key={`sk-${i}`}
// //               style={[
// //                 styles.playerRow,
// //                 {
// //                   opacity: 0.6,
// //                 },
// //               ]}
// //             >
// //               <View
// //                 style={[
// //                   styles.avatar,
// //                   {
// //                     backgroundColor:
// //                       C.greySoft,
// //                   },
// //                 ]}
// //               />

// //               <View
// //                 style={{
// //                   flex: 1,
// //                   gap: 6,
// //                 }}
// //               >
// //                 <View
// //                   style={[
// //                     styles.skelLine,
// //                     {
// //                       width: "40%",
// //                     },
// //                   ]}
// //                 />

// //                 <View
// //                   style={[
// //                     styles.skelLine,
// //                     {
// //                       width: "25%",
// //                       height: 8,
// //                     },
// //                   ]}
// //                 />
// //               </View>
// //             </View>
// //           ))}

// //         {players.map(
// //           (p, i) => {
// //             const currentName =
// //               pick(
// //                 p,
// //                 "player_name",
// //                 "playerName",
// //                 "name"
// //               );

// //             const isMe =
// //               currentName ===
// //               playerName;

// //             const isHost =
// //               !!pick(
// //                 p,
// //                 "is_host",
// //                 "isHost"
// //               );

// //             const readyVal =
// //               pick(
// //                 p,
// //                 "is_ready",
// //                 "isReady"
// //               );

// //             const color =
// //               pick(
// //                 p,
// //                 "avatar_color",
// //                 "avatarColor"
// //               ) ||
// //               FALLBACK_AVATARS[
// //                 i %
// //                   FALLBACK_AVATARS.length
// //               ];

// //             return (
// //               <View
// //                 key={String(
// //                   p.id ??
// //                     currentName ??
// //                     i
// //                 )}
// //                 style={
// //                   styles.playerRow
// //                 }
// //               >
// //                 <View
// //                   style={[
// //                     styles.avatar,
// //                     {
// //                       backgroundColor:
// //                         color,
// //                     },
// //                   ]}
// //                 >
// //                   <Text
// //                     style={
// //                       styles.avatarText
// //                     }
// //                   >
// //                     {(
// //                       currentName ||
// //                       "?"
// //                     )
// //                       .charAt(0)
// //                       .toUpperCase()}
// //                   </Text>
// //                 </View>

// //                 <View
// //                   style={{
// //                     flex: 1,
// //                   }}
// //                 >
// //                   <Text
// //                     style={
// //                       styles.playerName
// //                     }
// //                     numberOfLines={1}
// //                   >
// //                     {currentName ||
// //                       "Player"}
// //                   </Text>

// //                   {isMe ||
// //                   isHost ? (
// //                     <Text
// //                       style={
// //                         styles.playerTag
// //                       }
// //                     >
// //                       {[
// //                         isMe
// //                           ? "That's you"
// //                           : null,

// //                         isHost
// //                           ? "Host"
// //                           : null,
// //                       ]
// //                         .filter(
// //                           Boolean
// //                         )
// //                         .join(" • ")}
// //                     </Text>
// //                   ) : null}
// //                 </View>

// //                 {typeof readyVal ===
// //                 "boolean" ? (
// //                   <View
// //                     style={[
// //                       styles.badge,
// //                       {
// //                         backgroundColor:
// //                           readyVal
// //                             ? C.greenSoft
// //                             : C.greySoft,
// //                       },
// //                     ]}
// //                   >
// //                     <View
// //                       style={[
// //                         styles.badgeDot,
// //                         {
// //                           backgroundColor:
// //                             readyVal
// //                               ? C.green
// //                               : C.grey,
// //                         },
// //                       ]}
// //                     />

// //                     <Text
// //                       style={[
// //                         styles.badgeText,
// //                         {
// //                           color:
// //                             readyVal
// //                               ? C.green
// //                               : C.grey,
// //                         },
// //                       ]}
// //                     >
// //                       {readyVal
// //                         ? "Ready"
// //                         : "Not ready"}
// //                     </Text>
// //                   </View>
// //                 ) : null}
// //               </View>
// //             );
// //           }
// //         )}

// //         {room
// //           ? Array.from({
// //               length: emptySlots,
// //             }).map((_, i) => (
// //               <View
// //                 key={`empty-${i}`}
// //                 style={
// //                   styles.emptyRow
// //                 }
// //               >
// //                 <View
// //                   style={
// //                     styles.emptyAvatar
// //                   }
// //                 >
// //                   <Ionicons
// //                     name="person-add-outline"
// //                     size={15}
// //                     color="#B8AFA5"
// //                   />
// //                 </View>

// //                 <Text
// //                   style={
// //                     styles.emptyText
// //                   }
// //                 >
// //                   Waiting for player…
// //                 </Text>

// //                 <Animated.View
// //                   style={[
// //                     styles.emptyDot,
// //                     {
// //                       opacity: pulse,
// //                     },
// //                   ]}
// //                 />
// //               </View>
// //             ))
// //           : null}
// //       </View>
// //     </View>
// //   );

// //   /* =======================================================
// //      ROOM CODE CARD
// //   ======================================================= */

// //   const codeCard = (
// //     <View style={styles.card}>
// //       <Text
// //         style={styles.cardTitle}
// //       >
// //         Room code
// //       </Text>

// //       <Text
// //         style={styles.cardSub}
// //       >
// //         Friends enter this to join
// //       </Text>

// //       <View
// //         style={styles.tilesRow}
// //       >
// //         {String(roomCode)
// //           .split("")
// //           .map((ch, i) => (
// //             <View
// //               key={i}
// //               style={[
// //                 styles.tile,
// //                 {
// //                   backgroundColor:
// //                     TILE_COLORS[
// //                       i %
// //                         TILE_COLORS.length
// //                     ],

// //                   transform: [
// //                     {
// //                       rotate:
// //                         TILE_ROTATIONS[
// //                           i %
// //                             TILE_ROTATIONS.length
// //                         ],
// //                     },
// //                   ],

// //                   shadowColor:
// //                     TILE_COLORS[
// //                       i %
// //                         TILE_COLORS.length
// //                     ],
// //                 },
// //               ]}
// //             >
// //               <Text
// //                 style={
// //                   styles.tileText
// //                 }
// //               >
// //                 {ch}
// //               </Text>
// //             </View>
// //           ))}
// //       </View>

// //       <View
// //         style={styles.codeActions}
// //       >
// //         <TouchableOpacity
// //           style={
// //             styles.softButton
// //           }
// //           onPress={
// //             handleCopy
// //           }
// //           activeOpacity={0.8}
// //         >
// //           <Ionicons
// //             name={
// //               copied
// //                 ? "checkmark"
// //                 : "copy-outline"
// //             }
// //             size={16}
// //             color={C.indigo}
// //           />

// //           <Text
// //             style={
// //               styles.softButtonText
// //             }
// //           >
// //             {copied
// //               ? "Copied!"
// //               : "Copy"}
// //           </Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={
// //             styles.softButton
// //           }
// //           onPress={
// //             handleShare
// //           }
// //           activeOpacity={0.8}
// //         >
// //           <Ionicons
// //             name="share-social-outline"
// //             size={16}
// //             color={C.indigo}
// //           />

// //           <Text
// //             style={
// //               styles.softButtonText
// //             }
// //           >
// //             Share
// //           </Text>
// //         </TouchableOpacity>
// //       </View>

// //       <View
// //         style={styles.divider}
// //       />

// //       <View
// //         style={styles.progressHead}
// //       >
// //         <Text
// //           style={
// //             styles.progressLabel
// //           }
// //         >
// //           Players joined
// //         </Text>

// //         <Text
// //           style={
// //             styles.progressValue
// //           }
// //         >
// //           {players.length} / {max}
// //         </Text>
// //       </View>

// //       <View
// //         style={styles.progressTrack}
// //       >
// //         <View
// //           style={[
// //             styles.progressFill,
// //             {
// //               width: `${fillPct}%`,
// //             },
// //           ]}
// //         />
// //       </View>

// //       {hasReadyField &&
// //       me ? (
// //         <TouchableOpacity
// //           style={[
// //             styles.readyToggle,
// //             myReady &&
// //               styles.readyToggleOn,
// //           ]}
// //           onPress={
// //             handleToggleReady
// //           }
// //           activeOpacity={0.85}
// //           disabled={
// //             togglingReady
// //           }
// //         >
// //           {togglingReady ? (
// //             <ActivityIndicator
// //               size="small"
// //               color={
// //                 myReady
// //                   ? C.green
// //                   : C.indigo
// //               }
// //             />
// //           ) : (
// //             <Ionicons
// //               name={
// //                 myReady
// //                   ? "checkmark-circle"
// //                   : "ellipse-outline"
// //               }
// //               size={18}
// //               color={
// //                 myReady
// //                   ? C.green
// //                   : C.indigo
// //               }
// //             />
// //           )}

// //           <Text
// //             style={[
// //               styles.readyToggleText,
// //               {
// //                 color:
// //                   myReady
// //                     ? C.green
// //                     : C.indigo,
// //               },
// //             ]}
// //           >
// //             {myReady
// //               ? "You're ready"
// //               : "Mark me as ready"}
// //           </Text>
// //         </TouchableOpacity>
// //       ) : null}

// //       <TouchableOpacity
// //         style={[
// //           styles.startWrap,
// //           !canStart &&
// //             styles.startWrapDisabled,
// //         ]}
// //         activeOpacity={0.88}
// //         onPress={
// //           handleStart
// //         }
// //         disabled={
// //           !canStart
// //         }
// //       >
// //         <View
// //           style={[
// //             styles.startButton,
// //             !canStart &&
// //               styles.startButtonDisabled,
// //           ]}
// //         >
// //           {starting ? (
// //             <ActivityIndicator
// //               color="#FFFFFF"
// //             />
// //           ) : (
// //             <>
// //               <Text
// //                 style={
// //                   styles.startButtonText
// //                 }
// //               >
// //                 START GAME
// //               </Text>

// //               <View
// //                 style={
// //                   styles.startArrow
// //                 }
// //               >
// //                 <Ionicons
// //                   name="arrow-forward"
// //                   size={16}
// //                   color="#FFFFFF"
// //                 />
// //               </View>
// //             </>
// //           )}
// //         </View>
// //       </TouchableOpacity>

// //       {needMore > 0 ? (
// //         <Text
// //           style={
// //             styles.startHint
// //           }
// //         >
// //           Need {needMore} more{" "}
// //           {needMore === 1
// //             ? "player"
// //             : "players"}{" "}
// //           to start
// //         </Text>
// //       ) : null}
// //     </View>
// //   );

// //   /* =======================================================
// //      RETURN
// //   ======================================================= */

// //   return (
// //     <View style={styles.flex}>
// //       <StatusBar
// //         barStyle="dark-content"
// //         backgroundColor={C.bg}
// //       />

// //       <SafeAreaView
// //         style={styles.flex}
// //       >
// //         <ScrollView
// //           contentContainerStyle={[
// //             styles.scroll,
// //             {
// //               paddingHorizontal:
// //                 wide ? 32 : 16,

// //               paddingTop:
// //                 Platform.OS ===
// //                 "android"
// //                   ? (StatusBar.currentHeight ??
// //                       0) + 8
// //                   : 16,
// //             },
// //           ]}
// //           showsVerticalScrollIndicator={
// //             false
// //           }
// //         >
// //           <View
// //             style={styles.column}
// //           >
// //             {header}

// //             {errorBanner}

// //             {wide ? (
// //               <View
// //                 style={
// //                   styles.wideRow
// //                 }
// //               >
// //                 <View
// //                   style={
// //                     styles.mainCol
// //                   }
// //                 >
// //                   {heading}

// //                   {playersCard}
// //                 </View>

// //                 <View
// //                   style={
// //                     styles.sideCol
// //                   }
// //                 >
// //                   {codeCard}
// //                 </View>
// //               </View>
// //             ) : (
// //               <View
// //                 style={{
// //                   gap: 16,
// //                 }}
// //               >
// //                 {heading}

// //                 {codeCard}

// //                 {playersCard}
// //               </View>
// //             )}
// //           </View>
// //         </ScrollView>
// //       </SafeAreaView>
// //     </View>
// //   );
// // };

// // export default RoomWaitingScreen;

// // /* =========================================================
// //    STYLES
// // ========================================================= */

// // const styles = StyleSheet.create({
// //   flex: {
// //     flex: 1,
// //     backgroundColor: C.bg,
// //   },

// //   scroll: {
// //     paddingBottom: 32,
// //   },

// //   column: {
// //     width: "100%",
// //   },

// //   wideRow: {
// //     flexDirection: "row",
// //     gap: 24,
// //     alignItems: "flex-start",
// //   },

// //   mainCol: {
// //     flex: 1,
// //     gap: 18,
// //     minWidth: 0,
// //   },

// //   sideCol: {
// //     flex: 1,
// //     maxWidth: 420,
// //     marginTop: 8,
// //   },

// //   /* HEADER */

// //   header: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     marginBottom: 8,
// //     gap: 8,
// //   },

// //   headerCenter: {
// //     flex: 1,
// //     alignItems: "center",
// //   },

// //   headerTitle: {
// //     color: C.text,
// //     fontSize: 17,
// //     fontWeight: "800",
// //   },

// //   headerSubRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //     marginTop: 3,
// //   },

// //   liveDot: {
// //     width: 7,
// //     height: 7,
// //     borderRadius: 4,
// //   },

// //   headerSub: {
// //     color: C.sub,
// //     fontSize: 12,
// //   },

// //   headerRight: {
// //     flexDirection: "row",
// //     gap: 8,
// //   },

// //   roundButton: {
// //     width: 42,
// //     height: 42,
// //     borderRadius: 21,
// //     backgroundColor: C.card,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   /* ERROR */

// //   errorBanner: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //     marginTop: 8,
// //     paddingVertical: 10,
// //     paddingHorizontal: 14,
// //     borderRadius: 14,
// //     backgroundColor: C.coralSoft,
// //   },

// //   errorText: {
// //     color: C.coral,
// //     fontSize: 13,
// //     fontWeight: "700",
// //   },

// //   /* HEADING */

// //   headingBlock: {
// //     marginTop: 14,
// //   },

// //   eyebrow: {
// //     color: C.coral,
// //     fontSize: 12,
// //     fontWeight: "800",
// //     letterSpacing: 1.5,
// //     marginBottom: 6,
// //   },

// //   headingTitle: {
// //     color: C.text,
// //     fontSize: 38,
// //     fontWeight: "900",
// //     lineHeight: 44,
// //   },

// //   headingTitlePhone: {
// //     fontSize: 30,
// //     lineHeight: 36,
// //   },

// //   headingSub: {
// //     color: C.sub,
// //     fontSize: 15,
// //     lineHeight: 22,
// //     marginTop: 10,
// //     maxWidth: 480,
// //   },

// //   /* CARDS */

// //   card: {
// //     backgroundColor: C.card,
// //     borderRadius: 24,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     padding: 20,

// //     shadowColor: "#B8A48C",
// //     shadowOpacity: 0.12,
// //     shadowRadius: 16,
// //     shadowOffset: {
// //       width: 0,
// //       height: 6,
// //     },

// //     elevation: 2,
// //   },

// //   cardHeadRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //   },

// //   cardTitle: {
// //     color: C.text,
// //     fontSize: 18,
// //     fontWeight: "800",
// //   },

// //   cardSub: {
// //     color: C.sub,
// //     fontSize: 12.5,
// //     marginTop: 3,
// //   },

// //   countPill: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //     paddingVertical: 6,
// //     paddingHorizontal: 12,
// //     borderRadius: 14,
// //     backgroundColor: C.indigoSoft,
// //   },

// //   countPillText: {
// //     color: C.indigo,
// //     fontWeight: "800",
// //     fontSize: 13,
// //   },

// //   /* PLAYERS */

// //   playerList: {
// //     marginTop: 16,
// //     gap: 10,
// //   },

// //   playerRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 12,
// //     paddingVertical: 12,
// //     paddingHorizontal: 14,
// //     borderRadius: 16,
// //     backgroundColor: "#FFFBF6",
// //     borderWidth: 1,
// //     borderColor: C.border,
// //   },

// //   avatar: {
// //     width: 42,
// //     height: 42,
// //     borderRadius: 21,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   avatarText: {
// //     color: "#FFFFFF",
// //     fontSize: 17,
// //     fontWeight: "900",
// //   },

// //   playerName: {
// //     color: C.text,
// //     fontSize: 15,
// //     fontWeight: "800",
// //   },

// //   playerTag: {
// //     color: C.sub,
// //     fontSize: 11.5,
// //     marginTop: 2,
// //   },

// //   badge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //     paddingVertical: 5,
// //     paddingHorizontal: 11,
// //     borderRadius: 12,
// //   },

// //   badgeDot: {
// //     width: 7,
// //     height: 7,
// //     borderRadius: 4,
// //   },

// //   badgeText: {
// //     fontSize: 12,
// //     fontWeight: "800",
// //   },

// //   skelLine: {
// //     height: 12,
// //     borderRadius: 6,
// //     backgroundColor: C.greySoft,
// //   },

// //   emptyRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 12,
// //     paddingVertical: 12,
// //     paddingHorizontal: 14,
// //     borderRadius: 16,
// //     borderWidth: 1.5,
// //     borderStyle: "dashed",
// //     borderColor: "#E6DACB",
// //   },

// //   emptyAvatar: {
// //     width: 42,
// //     height: 42,
// //     borderRadius: 21,
// //     backgroundColor: "#F6EFE6",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   emptyText: {
// //     flex: 1,
// //     color: "#A79D92",
// //     fontSize: 14,
// //     fontWeight: "600",
// //   },

// //   emptyDot: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: C.coral,
// //   },

// //   /* ROOM CODE */

// //   tilesRow: {
// //     flexDirection: "row",
// //     justifyContent: "center",
// //     gap: 10,
// //     marginTop: 20,
// //     marginBottom: 18,
// //     flexWrap: "wrap",
// //   },

// //   tile: {
// //     width: 54,
// //     height: 54,
// //     borderRadius: 15,
// //     justifyContent: "center",
// //     alignItems: "center",

// //     shadowOpacity: 0.35,
// //     shadowRadius: 10,
// //     shadowOffset: {
// //       width: 0,
// //       height: 6,
// //     },

// //     elevation: 4,
// //   },

// //   tileText: {
// //     color: "#FFFFFF",
// //     fontSize: 26,
// //     fontWeight: "900",
// //   },

// //   codeActions: {
// //     flexDirection: "row",
// //     gap: 10,
// //   },

// //   softButton: {
// //     flex: 1,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 8,
// //     paddingVertical: 12,
// //     borderRadius: 14,
// //     backgroundColor: C.indigoSoft,
// //   },

// //   softButtonText: {
// //     color: C.indigo,
// //     fontWeight: "800",
// //     fontSize: 14,
// //   },

// //   divider: {
// //     height: 1,
// //     backgroundColor: C.border,
// //     marginVertical: 18,
// //   },

// //   progressHead: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginBottom: 8,
// //   },

// //   progressLabel: {
// //     color: C.sub,
// //     fontSize: 13,
// //   },

// //   progressValue: {
// //     color: C.text,
// //     fontSize: 13,
// //     fontWeight: "800",
// //   },

// //   progressTrack: {
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: "#F1EAE0",
// //     overflow: "hidden",
// //   },

// //   progressFill: {
// //     height: "100%",
// //     borderRadius: 4,
// //     backgroundColor: C.indigo,
// //   },

// //   /* READY */

// //   readyToggle: {
// //     marginTop: 16,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 8,
// //     paddingVertical: 12,
// //     borderRadius: 14,
// //     borderWidth: 1.5,
// //     borderColor: C.indigo,
// //     backgroundColor: "#FFFFFF",
// //   },

// //   readyToggleOn: {
// //     borderColor: C.green,
// //     backgroundColor: C.greenSoft,
// //   },

// //   readyToggleText: {
// //     fontWeight: "800",
// //     fontSize: 14,
// //   },

// //   /* START */

// //   startWrap: {
// //     marginTop: 16,
// //     borderRadius: 18,

// //     shadowColor: C.indigo,
// //     shadowOpacity: 0.35,
// //     shadowRadius: 14,
// //     shadowOffset: {
// //       width: 0,
// //       height: 8,
// //     },

// //     elevation: 6,
// //   },

// //   startWrapDisabled: {
// //     shadowOpacity: 0,
// //     elevation: 0,
// //   },

// //   startButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 12,
// //     height: 58,
// //     borderRadius: 18,
// //     backgroundColor: C.indigo,
// //   },

// //   startButtonDisabled: {
// //     backgroundColor: C.indigo,
// //     opacity: 0.4,
// //     borderWidth: 1.5,
// //     borderColor:
// //       "rgba(79,70,229,0.5)",
// //   },

// //   startButtonText: {
// //     color: "#FFFFFF",
// //     fontSize: 16,
// //     fontWeight: "900",
// //     letterSpacing: 1,
// //   },

// //   startArrow: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 10,
// //     backgroundColor:
// //       "rgba(255,255,255,0.22)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   startHint: {
// //     color: C.sub,
// //     fontSize: 12.5,
// //     textAlign: "center",
// //     marginTop: 10,
// //   },
// // });
// import React, {
//   useEffect,
//   useState,
//   useCallback,
//   useRef,
// } from "react";

// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Share,
//   SafeAreaView,
//   StatusBar,
//   Animated,
//   Easing,
//   Platform,
//   ActivityIndicator,
//   useWindowDimensions,
// } from "react-native";

// import { Ionicons } from "@expo/vector-icons";

// import { fetchRoom, WordScrambleRoom } from "../api/Wordscrambleapi";

// import { setReady, leaveRoom } from "../api/wsProfileApi";

// import WordScrambleAnimatedBackground from "../components/WordScrambleAnimatedBackground";

// /* =========================================================
//    TYPES
// ========================================================= */

// interface RoomWaitingScreenProps {
//   /**
//    * Backend room object.
//    *
//    * This allows:
//    *
//    * <RoomWaitingScreen room={room} />
//    */
//   room: WordScrambleRoom;

//   /**
//    * Optional values.
//    * These are kept optional so the screen can also work
//    * when opened from a navigation route.
//    */
//   roomCode?: string;
//   playerName?: string;
//   maxPlayers?: number;

//   onBack?: () => void;

//   onStartGame?: () => void | Promise<void>;

//   onOpenChat?: () => void;

//   onOpenRoomSettings?: () => void;
// }

// /* =========================================================
//    THEME
// ========================================================= */

// const C = {
//   bg: "#FFF8F1",
//   card: "#FFFFFF",
//   border: "#F1E7DC",

//   text: "#141B34",
//   sub: "#6B7280",

//   indigo: "#4F46E5",
//   indigoSoft: "#EEF0FF",

//   coral: "#FF6B57",
//   coralSoft: "#FFECE8",

//   yellow: "#F2B640",
//   blue: "#3B82F6",
//   red: "#F0566A",
//   green: "#22B573",

//   greenSoft: "#E3F6EC",

//   grey: "#8A93A6",
//   greySoft: "#F1EEF0",
// };

// const TILE_COLORS = [C.yellow, C.blue, C.red, C.green];

// const TILE_ROTATIONS = ["-6deg", "4deg", "-3deg", "5deg"];

// const FALLBACK_AVATARS = [
//   C.coral,
//   C.blue,
//   C.green,
//   C.yellow,
//   C.red,
//   C.indigo,
//   "#14B8A6",
//   "#F97316",
// ];

// /* =========================================================
//    HELPERS
// ========================================================= */

// const pick = (obj: any, ...keys: string[]) => {
//   for (const key of keys) {
//     if (obj && obj[key] !== undefined && obj[key] !== null) {
//       return obj[key];
//     }
//   }

//   return undefined;
// };

// const statusInfo = (
//   status?: string
// ): {
//   label: string;
//   color: string;
// } => {
//   switch ((status || "").toLowerCase()) {
//     case "waiting":
//     case "lobby":
//     case "open":
//       return { label: "Lobby open", color: C.green };

//     case "playing":
//     case "in_progress":
//     case "started":
//       return { label: "Game in progress", color: C.blue };

//     case "finished":
//     case "ended":
//     case "completed":
//       return { label: "Game finished", color: C.grey };

//     default:
//       return {
//         label: status
//           ? status.charAt(0).toUpperCase() + status.slice(1)
//           : "Lobby open",
//         color: C.green,
//       };
//   }
// };

// /* =========================================================
//    COMPONENT
// ========================================================= */

// const RoomWaitingScreen: React.FC<RoomWaitingScreenProps> = ({
//   room: initialRoom,
//   roomCode: propRoomCode,
//   playerName: propPlayerName,
//   maxPlayers: propMaxPlayers,
//   onBack,
//   onStartGame,
//   onOpenChat,
//   onOpenRoomSettings,
// }) => {
//   const { width } = useWindowDimensions();

//   const wide = width >= 900;

//   /* -------------------------------------------------------
//      ROOM STATE
//   ------------------------------------------------------- */

//   const [room, setRoom] = useState<WordScrambleRoom | null>(
//     initialRoom || null
//   );

//   const [connError, setConnError] = useState(false);

//   const [copied, setCopied] = useState(false);

//   const [starting, setStarting] = useState(false);

//   const [togglingReady, setTogglingReady] = useState(false);

//   /* -------------------------------------------------------
//      ROOM DATA
//   ------------------------------------------------------- */

//   const r: any = room || {};

//   const roomCode =
//     propRoomCode || pick(r, "roomCode", "room_code", "code") || "";

//   const playerName =
//     propPlayerName ||
//     pick(r, "playerName", "player_name", "hostPlayerName", "host_player_name") ||
//     "";

//   const players: any[] = Array.isArray(r.players) ? r.players : [];

//   const max =
//     Number(pick(r, "maxPlayers", "max_players")) || propMaxPlayers || 2;

//   const roomName: string | undefined = pick(r, "roomName", "room_name", "name");

//   const minPlayers = Number(pick(r, "minPlayers", "min_players")) || 0;

//   const status = statusInfo(r.status);

//   /* -------------------------------------------------------
//      CURRENT PLAYER
//   ------------------------------------------------------- */

//   const me = players.find(
//     (p) => pick(p, "player_name", "playerName", "name") === playerName
//   );

//   const hasReadyField = players.some(
//     (p) => typeof pick(p, "is_ready", "isReady") === "boolean"
//   );

//   const myReady = !!pick(me, "is_ready", "isReady");

//   /* -------------------------------------------------------
//      PLAYER COUNTS
//   ------------------------------------------------------- */

//   const needMore = Math.max(0, minPlayers - players.length);

//   const canStart = !!room && needMore === 0 && !starting;

//   const emptySlots = Math.max(0, Math.min(max - players.length, 8));

//   const fillPct = max > 0 ? Math.min(100, (players.length / max) * 100) : 0;

//   /* =======================================================
//      PULSE ANIMATION
//   ======================================================= */

//   const pulse = useRef(new Animated.Value(0.35)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulse, {
//           toValue: 1,
//           duration: 700,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),

//         Animated.timing(pulse, {
//           toValue: 0.35,
//           duration: 700,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     );

//     loop.start();

//     return () => {
//       loop.stop();
//     };
//   }, [pulse]);

//   /* =======================================================
//      FETCH ROOM
//   ======================================================= */

//   const poll = useCallback(async () => {
//     if (!roomCode) {
//       return;
//     }

//     try {
//       const response = await fetchRoom(roomCode);

//       setRoom(response.room);

//       setConnError(false);
//     } catch (error) {
//       console.warn("Room poll failed:", error);

//       setConnError(true);
//     }
//   }, [roomCode]);

//   /* =======================================================
//      ROOM POLLING
//   ======================================================= */

//   useEffect(() => {
//     poll();

//     if (players.length >= max) {
//       return;
//     }

//     const interval = setInterval(poll, 2500);

//     return () => clearInterval(interval);
//   }, [poll, players.length, max]);

//   /* =======================================================
//      COPY FEEDBACK
//   ======================================================= */

//   const flashCopied = () => {
//     setCopied(true);

//     setTimeout(() => {
//       setCopied(false);
//     }, 2000);
//   };

//   /* =======================================================
//      SHARE ROOM
//   ======================================================= */

//   const handleShare = async () => {
//     const message = `Join my Word Scramble room! Code: ${roomCode}`;

//     try {
//       if (Platform.OS === "web") {
//         const nav: any = typeof navigator !== "undefined" ? navigator : null;

//         if (nav?.share) {
//           await nav.share({ text: message });

//           return;
//         }

//         if (nav?.clipboard?.writeText) {
//           await nav.clipboard.writeText(message);

//           flashCopied();

//           return;
//         }
//       }

//       await Share.share({ message });
//     } catch {
//       // user cancelled share
//     }
//   };

//   /* =======================================================
//      COPY ROOM CODE
//   ======================================================= */

//   const handleCopy = async () => {
//     try {
//       const nav: any = typeof navigator !== "undefined" ? navigator : null;

//       if (Platform.OS === "web" && nav?.clipboard?.writeText) {
//         await nav.clipboard.writeText(roomCode);

//         flashCopied();

//         return;
//       }

//       await Share.share({ message: roomCode });
//     } catch {
//       // ignore
//     }
//   };

//   /* =======================================================
//      START GAME
//   ======================================================= */

//   const handleStart = async () => {
//     if (!canStart) {
//       return;
//     }

//     if (!onStartGame) {
//       console.warn("onStartGame callback was not provided.");

//       return;
//     }

//     setStarting(true);

//     try {
//       await onStartGame();
//     } finally {
//       setStarting(false);
//     }
//   };

//   /* =======================================================
//      READY
//   ======================================================= */

//   const handleToggleReady = async () => {
//     if (togglingReady || !me || !roomCode || !playerName) {
//       return;
//     }

//     setTogglingReady(true);

//     try {
//       await setReady(roomCode, playerName, !myReady);

//       await poll();
//     } catch (error) {
//       console.warn("Ready toggle failed:", error);
//     } finally {
//       setTogglingReady(false);
//     }
//   };

//   /* =======================================================
//      BACK
//   ======================================================= */

//   const handleBack = async () => {
//     if (roomCode && playerName) {
//       try {
//         await leaveRoom(roomCode, playerName);
//       } catch {
//         // continue back even if API fails
//       }
//     }

//     onBack?.();
//   };

//   /* =======================================================
//      HEADER
//   ======================================================= */

//   const header = (
//     <View style={styles.header}>
//       <TouchableOpacity
//         style={styles.roundButton}
//         onPress={handleBack}
//         activeOpacity={0.8}
//       >
//         <Ionicons name="arrow-back" size={20} color={C.text} />
//       </TouchableOpacity>

//       <View style={styles.headerCenter}>
//         <Text style={styles.headerTitle} numberOfLines={1}>
//           {roomName || `Room ${roomCode}`}
//         </Text>

//         <View style={styles.headerSubRow}>
//           <Animated.View
//             style={[
//               styles.liveDot,
//               {
//                 backgroundColor: status.color,
//                 opacity: pulse,
//               },
//             ]}
//           />

//           <Text style={styles.headerSub}>
//             {status.label}

//             {roomName ? ` • ${roomCode}` : ""}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.headerRight}>
//         <TouchableOpacity
//           style={styles.roundButton}
//           onPress={onOpenChat}
//           activeOpacity={0.8}
//         >
//           <Ionicons
//             name="chatbubble-ellipses-outline"
//             size={19}
//             color={C.indigo}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.roundButton}
//           onPress={onOpenRoomSettings}
//           activeOpacity={0.8}
//         >
//           <Ionicons name="settings-outline" size={19} color={C.indigo} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   /* =======================================================
//      ERROR BANNER
//   ======================================================= */

//   const errorBanner = connError ? (
//     <View style={styles.errorBanner}>
//       <Ionicons name="cloud-offline-outline" size={16} color={C.coral} />

//       <Text style={styles.errorText}>Can't reach the server. Retrying…</Text>
//     </View>
//   ) : null;

//   /* =======================================================
//      HEADING
//   ======================================================= */

//   const heading = (
//     <View style={styles.headingBlock}>
//       <Text style={styles.eyebrow}>LOBBY</Text>

//       <Text style={[styles.headingTitle, !wide && styles.headingTitlePhone]}>
//         Waiting for
//       </Text>

//       <Text
//         style={[
//           styles.headingTitle,
//           !wide && styles.headingTitlePhone,
//           { color: C.indigo },
//         ]}
//       >
//         players…
//       </Text>

//       <Text style={styles.headingSub}>
//         Share the room code with your friends. The game starts when you're
//         ready.
//       </Text>
//     </View>
//   );

//   /* =======================================================
//      PLAYERS CARD
//   ======================================================= */

//   const playersCard = (
//     <View style={styles.card}>
//       <View style={styles.cardHeadRow}>
//         <View>
//           <Text style={styles.cardTitle}>Players</Text>

//           <Text style={styles.cardSub}>Everyone in this room</Text>
//         </View>

//         <View style={styles.countPill}>
//           <Ionicons name="people-outline" size={14} color={C.indigo} />

//           <Text style={styles.countPillText}>
//             {players.length}/{max}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.playerList}>
//         {!room &&
//           !connError &&
//           [0, 1].map((i) => (
//             <View key={`sk-${i}`} style={[styles.playerRow, { opacity: 0.6 }]}>
//               <View style={[styles.avatar, { backgroundColor: C.greySoft }]} />

//               <View style={{ flex: 1, gap: 6 }}>
//                 <View style={[styles.skelLine, { width: "40%" }]} />

//                 <View style={[styles.skelLine, { width: "25%", height: 8 }]} />
//               </View>
//             </View>
//           ))}

//         {players.map((p, i) => {
//           const currentName = pick(p, "player_name", "playerName", "name");

//           const isMe = currentName === playerName;

//           const isHost = !!pick(p, "is_host", "isHost");

//           const readyVal = pick(p, "is_ready", "isReady");

//           const color =
//             pick(p, "avatar_color", "avatarColor") ||
//             FALLBACK_AVATARS[i % FALLBACK_AVATARS.length];

//           return (
//             <View
//               key={String(p.id ?? currentName ?? i)}
//               style={styles.playerRow}
//             >
//               <View style={[styles.avatar, { backgroundColor: color }]}>
//                 <Text style={styles.avatarText}>
//                   {(currentName || "?").charAt(0).toUpperCase()}
//                 </Text>
//               </View>

//               <View style={{ flex: 1 }}>
//                 <Text style={styles.playerName} numberOfLines={1}>
//                   {currentName || "Player"}
//                 </Text>

//                 {isMe || isHost ? (
//                   <Text style={styles.playerTag}>
//                     {[isMe ? "That's you" : null, isHost ? "Host" : null]
//                       .filter(Boolean)
//                       .join(" • ")}
//                   </Text>
//                 ) : null}
//               </View>

//               {typeof readyVal === "boolean" ? (
//                 <View
//                   style={[
//                     styles.badge,
//                     {
//                       backgroundColor: readyVal ? C.greenSoft : C.greySoft,
//                     },
//                   ]}
//                 >
//                   <View
//                     style={[
//                       styles.badgeDot,
//                       {
//                         backgroundColor: readyVal ? C.green : C.grey,
//                       },
//                     ]}
//                   />

//                   <Text
//                     style={[
//                       styles.badgeText,
//                       {
//                         color: readyVal ? C.green : C.grey,
//                       },
//                     ]}
//                   >
//                     {readyVal ? "Ready" : "Not ready"}
//                   </Text>
//                 </View>
//               ) : null}
//             </View>
//           );
//         })}

//         {room
//           ? Array.from({ length: emptySlots }).map((_, i) => (
//               <View key={`empty-${i}`} style={styles.emptyRow}>
//                 <View style={styles.emptyAvatar}>
//                   <Ionicons
//                     name="person-add-outline"
//                     size={15}
//                     color="#B8AFA5"
//                   />
//                 </View>

//                 <Text style={styles.emptyText}>Waiting for player…</Text>

//                 <Animated.View
//                   style={[styles.emptyDot, { opacity: pulse }]}
//                 />
//               </View>
//             ))
//           : null}
//       </View>
//     </View>
//   );

//   /* =======================================================
//      ROOM CODE CARD
//   ======================================================= */

//   const codeCard = (
//     <View style={styles.card}>
//       <Text style={styles.cardTitle}>Room code</Text>

//       <Text style={styles.cardSub}>Friends enter this to join</Text>

//       <View style={styles.tilesRow}>
//         {String(roomCode)
//           .split("")
//           .map((ch, i) => (
//             <View
//               key={i}
//               style={[
//                 styles.tile,
//                 {
//                   backgroundColor: TILE_COLORS[i % TILE_COLORS.length],

//                   transform: [
//                     {
//                       rotate: TILE_ROTATIONS[i % TILE_ROTATIONS.length],
//                     },
//                   ],

//                   shadowColor: TILE_COLORS[i % TILE_COLORS.length],
//                 },
//               ]}
//             >
//               <Text style={styles.tileText}>{ch}</Text>
//             </View>
//           ))}
//       </View>

//       <View style={styles.codeActions}>
//         <TouchableOpacity
//           style={styles.softButton}
//           onPress={handleCopy}
//           activeOpacity={0.8}
//         >
//           <Ionicons
//             name={copied ? "checkmark" : "copy-outline"}
//             size={16}
//             color={C.indigo}
//           />

//           <Text style={styles.softButtonText}>
//             {copied ? "Copied!" : "Copy"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.softButton}
//           onPress={handleShare}
//           activeOpacity={0.8}
//         >
//           <Ionicons name="share-social-outline" size={16} color={C.indigo} />

//           <Text style={styles.softButtonText}>Share</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.divider} />

//       <View style={styles.progressHead}>
//         <Text style={styles.progressLabel}>Players joined</Text>

//         <Text style={styles.progressValue}>
//           {players.length} / {max}
//         </Text>
//       </View>

//       <View style={styles.progressTrack}>
//         <View style={[styles.progressFill, { width: `${fillPct}%` }]} />
//       </View>

//       {hasReadyField && me ? (
//         <TouchableOpacity
//           style={[styles.readyToggle, myReady && styles.readyToggleOn]}
//           onPress={handleToggleReady}
//           activeOpacity={0.85}
//           disabled={togglingReady}
//         >
//           {togglingReady ? (
//             <ActivityIndicator
//               size="small"
//               color={myReady ? C.green : C.indigo}
//             />
//           ) : (
//             <Ionicons
//               name={myReady ? "checkmark-circle" : "ellipse-outline"}
//               size={18}
//               color={myReady ? C.green : C.indigo}
//             />
//           )}

//           <Text
//             style={[
//               styles.readyToggleText,
//               { color: myReady ? C.green : C.indigo },
//             ]}
//           >
//             {myReady ? "You're ready" : "Mark me as ready"}
//           </Text>
//         </TouchableOpacity>
//       ) : null}

//       <TouchableOpacity
//         style={[styles.startWrap, !canStart && styles.startWrapDisabled]}
//         activeOpacity={0.88}
//         onPress={handleStart}
//         disabled={!canStart}
//       >
//         <View
//           style={[styles.startButton, !canStart && styles.startButtonDisabled]}
//         >
//           {starting ? (
//             <ActivityIndicator color="#FFFFFF" />
//           ) : (
//             <>
//               <Text style={styles.startButtonText}>START GAME</Text>

//               <View style={styles.startArrow}>
//                 <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
//               </View>
//             </>
//           )}
//         </View>
//       </TouchableOpacity>

//       {needMore > 0 ? (
//         <Text style={styles.startHint}>
//           Need {needMore} more {needMore === 1 ? "player" : "players"} to start
//         </Text>
//       ) : null}
//     </View>
//   );

//   /* =======================================================
//      RETURN
//   ======================================================= */

//   return (
//     <View style={styles.flex}>
//       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

//       {/* NEW: animated background - FIRST child, behind everything */}
//       <WordScrambleAnimatedBackground backgroundColor={C.bg} />

//       {/* CHANGED: transparent, so the animation shows through */}
//       <SafeAreaView style={styles.safe}>
//         <ScrollView
//           contentContainerStyle={[
//             styles.scroll,
//             {
//               paddingHorizontal: wide ? 32 : 16,

//               paddingTop:
//                 Platform.OS === "android"
//                   ? (StatusBar.currentHeight ?? 0) + 8
//                   : 16,
//             },
//           ]}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.column}>
//             {header}

//             {errorBanner}

//             {wide ? (
//               <View style={styles.wideRow}>
//                 <View style={styles.mainCol}>
//                   {heading}

//                   {playersCard}
//                 </View>

//                 <View style={styles.sideCol}>{codeCard}</View>
//               </View>
//             ) : (
//               <View style={{ gap: 16 }}>
//                 {heading}

//                 {codeCard}

//                 {playersCard}
//               </View>
//             )}
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </View>
//   );
// };

// export default RoomWaitingScreen;

// /* =========================================================
//    STYLES
// ========================================================= */

// const styles = StyleSheet.create({
//   flex: {
//     flex: 1,
//     backgroundColor: C.bg,
//   },

//   // NEW: must be transparent, otherwise it hides the animated background
//   safe: {
//     flex: 1,
//     backgroundColor: "transparent",
//   },

//   scroll: {
//     paddingBottom: 32,
//   },

//   column: {
//     width: "100%",
//   },

//   wideRow: {
//     flexDirection: "row",
//     gap: 24,
//     alignItems: "flex-start",
//   },

//   mainCol: {
//     flex: 1,
//     gap: 18,
//     minWidth: 0,
//   },

//   sideCol: {
//     flex: 1,
//     maxWidth: 420,
//     marginTop: 8,
//   },

//   /* HEADER */

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 8,
//     gap: 8,
//   },

//   headerCenter: {
//     flex: 1,
//     alignItems: "center",
//   },

//   headerTitle: {
//     color: C.text,
//     fontSize: 17,
//     fontWeight: "800",
//   },

//   headerSubRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginTop: 3,
//   },

//   liveDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//   },

//   headerSub: {
//     color: C.sub,
//     fontSize: 12,
//   },

//   headerRight: {
//     flexDirection: "row",
//     gap: 8,
//   },

//   roundButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: C.card,
//     borderWidth: 1,
//     borderColor: C.border,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   /* ERROR */

//   errorBanner: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginTop: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 14,
//     backgroundColor: C.coralSoft,
//   },

//   errorText: {
//     color: C.coral,
//     fontSize: 13,
//     fontWeight: "700",
//   },

//   /* HEADING */

//   headingBlock: {
//     marginTop: 14,
//   },

//   eyebrow: {
//     color: C.coral,
//     fontSize: 12,
//     fontWeight: "800",
//     letterSpacing: 1.5,
//     marginBottom: 6,
//   },

//   headingTitle: {
//     color: C.text,
//     fontSize: 38,
//     fontWeight: "900",
//     lineHeight: 44,
//   },

//   headingTitlePhone: {
//     fontSize: 30,
//     lineHeight: 36,
//   },

//   headingSub: {
//     color: C.sub,
//     fontSize: 15,
//     lineHeight: 22,
//     marginTop: 10,
//     maxWidth: 480,
//   },

//   /* CARDS */

//   card: {
//     backgroundColor: C.card,
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: C.border,
//     padding: 20,

//     shadowColor: "#B8A48C",
//     shadowOpacity: 0.12,
//     shadowRadius: 16,
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },

//     elevation: 2,
//   },

//   cardHeadRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   cardTitle: {
//     color: C.text,
//     fontSize: 18,
//     fontWeight: "800",
//   },

//   cardSub: {
//     color: C.sub,
//     fontSize: 12.5,
//     marginTop: 3,
//   },

//   countPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 14,
//     backgroundColor: C.indigoSoft,
//   },

//   countPillText: {
//     color: C.indigo,
//     fontWeight: "800",
//     fontSize: 13,
//   },

//   /* PLAYERS */

//   playerList: {
//     marginTop: 16,
//     gap: 10,
//   },

//   playerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     borderRadius: 16,
//     backgroundColor: "#FFFBF6",
//     borderWidth: 1,
//     borderColor: C.border,
//   },

//   avatar: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   avatarText: {
//     color: "#FFFFFF",
//     fontSize: 17,
//     fontWeight: "900",
//   },

//   playerName: {
//     color: C.text,
//     fontSize: 15,
//     fontWeight: "800",
//   },

//   playerTag: {
//     color: C.sub,
//     fontSize: 11.5,
//     marginTop: 2,
//   },

//   badge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 5,
//     paddingHorizontal: 11,
//     borderRadius: 12,
//   },

//   badgeDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//   },

//   badgeText: {
//     fontSize: 12,
//     fontWeight: "800",
//   },

//   skelLine: {
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: C.greySoft,
//   },

//   emptyRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     borderRadius: 16,
//     borderWidth: 1.5,
//     borderStyle: "dashed",
//     borderColor: "#E6DACB",
//   },

//   emptyAvatar: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: "#F6EFE6",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   emptyText: {
//     flex: 1,
//     color: "#A79D92",
//     fontSize: 14,
//     fontWeight: "600",
//   },

//   emptyDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: C.coral,
//   },

//   /* ROOM CODE */

//   tilesRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 10,
//     marginTop: 20,
//     marginBottom: 18,
//     flexWrap: "wrap",
//   },

//   tile: {
//     width: 54,
//     height: 54,
//     borderRadius: 15,
//     justifyContent: "center",
//     alignItems: "center",

//     shadowOpacity: 0.35,
//     shadowRadius: 10,
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },

//     elevation: 4,
//   },

//   tileText: {
//     color: "#FFFFFF",
//     fontSize: 26,
//     fontWeight: "900",
//   },

//   codeActions: {
//     flexDirection: "row",
//     gap: 10,
//   },

//   softButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     paddingVertical: 12,
//     borderRadius: 14,
//     backgroundColor: C.indigoSoft,
//   },

//   softButtonText: {
//     color: C.indigo,
//     fontWeight: "800",
//     fontSize: 14,
//   },

//   divider: {
//     height: 1,
//     backgroundColor: C.border,
//     marginVertical: 18,
//   },

//   progressHead: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },

//   progressLabel: {
//     color: C.sub,
//     fontSize: 13,
//   },

//   progressValue: {
//     color: C.text,
//     fontSize: 13,
//     fontWeight: "800",
//   },

//   progressTrack: {
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#F1EAE0",
//     overflow: "hidden",
//   },

//   progressFill: {
//     height: "100%",
//     borderRadius: 4,
//     backgroundColor: C.indigo,
//   },

//   /* READY */

//   readyToggle: {
//     marginTop: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     paddingVertical: 12,
//     borderRadius: 14,
//     borderWidth: 1.5,
//     borderColor: C.indigo,
//     backgroundColor: "#FFFFFF",
//   },

//   readyToggleOn: {
//     borderColor: C.green,
//     backgroundColor: C.greenSoft,
//   },

//   readyToggleText: {
//     fontWeight: "800",
//     fontSize: 14,
//   },

//   /* START */

//   startWrap: {
//     marginTop: 16,
//     borderRadius: 18,

//     shadowColor: C.indigo,
//     shadowOpacity: 0.35,
//     shadowRadius: 14,
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },

//     elevation: 6,
//   },

//   startWrapDisabled: {
//     shadowOpacity: 0,
//     elevation: 0,
//   },

//   startButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 12,
//     height: 58,
//     borderRadius: 18,
//     backgroundColor: C.indigo,
//   },

//   startButtonDisabled: {
//     backgroundColor: C.indigo,
//     opacity: 0.4,
//     borderWidth: 1.5,
//     borderColor: "rgba(79,70,229,0.5)",
//   },

//   startButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "900",
//     letterSpacing: 1,
//   },

//   startArrow: {
//     width: 30,
//     height: 30,
//     borderRadius: 10,
//     backgroundColor: "rgba(255,255,255,0.22)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   startHint: {
//     color: C.sub,
//     fontSize: 12.5,
//     textAlign: "center",
//     marginTop: 10,
//   },
// });
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { fetchRoom, WordScrambleRoom } from "../api/Wordscrambleapi";

import { setReady, leaveRoom } from "../api/wsProfileApi";

import WordScrambleAnimatedBackground from "../components/WordScrambleAnimatedBackground";

/* =========================================================
   TYPES
========================================================= */

interface RoomWaitingScreenProps {
  /**
   * Backend room object.
   *
   * This allows:
   *
   * <RoomWaitingScreen room={room} />
   */
  room: WordScrambleRoom;

  /**
   * Optional values.
   * These are kept optional so the screen can also work
   * when opened from a navigation route.
   */
  roomCode?: string;
  playerName?: string;
  maxPlayers?: number;

  onBack?: () => void;

  onStartGame?: () => void | Promise<void>;

  onOpenChat?: () => void;

  onOpenRoomSettings?: () => void;
}

/* =========================================================
   THEME
========================================================= */

const C = {
  bg: "#FFF8F1",
  card: "#FFFFFF",
  border: "#F1E7DC",

  text: "#141B34",
  sub: "#6B7280",

  indigo: "#4F46E5",
  indigoSoft: "#EEF0FF",

  coral: "#FF6B57",
  coralSoft: "#FFECE8",

  yellow: "#F2B640",
  blue: "#3B82F6",
  red: "#F0566A",
  green: "#22B573",

  greenSoft: "#E3F6EC",

  grey: "#8A93A6",
  greySoft: "#F1EEF0",
};

const TILE_COLORS = [C.yellow, C.blue, C.red, C.green];

const TILE_ROTATIONS = ["-6deg", "4deg", "-3deg", "5deg"];

const FALLBACK_AVATARS = [
  C.coral,
  C.blue,
  C.green,
  C.yellow,
  C.red,
  C.indigo,
  "#14B8A6",
  "#F97316",
];

/* how often the lobby refreshes itself (so the host sees new players) */
const POLL_MS = 2500;

/* =========================================================
   HELPERS
========================================================= */

const pick = (obj: any, ...keys: string[]) => {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }

  return undefined;
};

const statusInfo = (
  status?: string
): {
  label: string;
  color: string;
} => {
  switch ((status || "").toLowerCase()) {
    case "waiting":
    case "lobby":
    case "open":
      return { label: "Lobby open", color: C.green };

    case "playing":
    case "in_progress":
    case "started":
      return { label: "Game in progress", color: C.blue };

    case "finished":
    case "ended":
    case "completed":
      return { label: "Game finished", color: C.grey };

    default:
      return {
        label: status
          ? status.charAt(0).toUpperCase() + status.slice(1)
          : "Lobby open",
        color: C.green,
      };
  }
};

/* =========================================================
   COMPONENT
========================================================= */

const RoomWaitingScreen: React.FC<RoomWaitingScreenProps> = ({
  room: initialRoom,
  roomCode: propRoomCode,
  playerName: propPlayerName,
  maxPlayers: propMaxPlayers,
  onBack,
  onStartGame,
  onOpenChat,
  onOpenRoomSettings,
}) => {
  const { width } = useWindowDimensions();

  const wide = width >= 900;

  /* -------------------------------------------------------
     ROOM STATE
  ------------------------------------------------------- */

  const [room, setRoom] = useState<WordScrambleRoom | null>(
    initialRoom || null
  );

  const [connError, setConnError] = useState(false);

  const [copied, setCopied] = useState(false);

  const [starting, setStarting] = useState(false);

  const [togglingReady, setTogglingReady] = useState(false);

  /* -------------------------------------------------------
     ROOM DATA
  ------------------------------------------------------- */

  const r: any = room || {};

  const roomCode =
    propRoomCode || pick(r, "roomCode", "room_code", "code") || "";

  const playerName =
    propPlayerName ||
    pick(r, "playerName", "player_name", "hostPlayerName", "host_player_name") ||
    "";

  const players: any[] = Array.isArray(r.players) ? r.players : [];

  const max =
    Number(pick(r, "maxPlayers", "max_players")) || propMaxPlayers || 2;

  const roomName: string | undefined = pick(r, "roomName", "room_name", "name");

  const minPlayers = Number(pick(r, "minPlayers", "min_players")) || 0;

  const status = statusInfo(r.status);

  /* -------------------------------------------------------
     CURRENT PLAYER
  ------------------------------------------------------- */

  const me = players.find(
    (p) => pick(p, "player_name", "playerName", "name") === playerName
  );

  const hasReadyField = players.some(
    (p) => typeof pick(p, "is_ready", "isReady") === "boolean"
  );

  const myReady = !!pick(me, "is_ready", "isReady");

  /* -------------------------------------------------------
     PLAYER COUNTS

     START GAME rule:
       - it stays DISABLED until EVERY seat in the room is filled
         (joined players === max players, e.g. 4 / 4).
       - as soon as one player leaves, it is disabled again.
  ------------------------------------------------------- */

  const joined = players.length;

  // players still missing before the game can start
  const needMore = Math.max(0, Math.max(minPlayers, max) - joined);

  const roomFull = !!room && needMore === 0;

  const canStart = roomFull && !starting;

  const emptySlots = Math.max(0, Math.min(max - joined, 8));

  const fillPct = max > 0 ? Math.min(100, (joined / max) * 100) : 0;

  /* =======================================================
     PULSE ANIMATION
  ======================================================= */

  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [pulse]);

  /* =======================================================
     FETCH ROOM
  ======================================================= */

  const poll = useCallback(async () => {
    if (!roomCode) {
      return;
    }

    try {
      const response = await fetchRoom(roomCode);

      setRoom(response.room);

      setConnError(false);
    } catch (error) {
      console.warn("Room poll failed:", error);

      setConnError(true);
    }
  }, [roomCode]);

  /* =======================================================
     ROOM POLLING

     Keeps polling the whole time the lobby is open, so:
       - the host sees guests join (button enables at full room)
       - the button disables again if somebody leaves
  ======================================================= */

  useEffect(() => {
    poll();

    const interval = setInterval(poll, POLL_MS);

    return () => clearInterval(interval);
  }, [poll]);

  /* =======================================================
     COPY FEEDBACK
  ======================================================= */

  const flashCopied = () => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  /* =======================================================
     SHARE ROOM
  ======================================================= */

  const handleShare = async () => {
    const message = `Join my Word Scramble room! Code: ${roomCode}`;

    try {
      if (Platform.OS === "web") {
        const nav: any = typeof navigator !== "undefined" ? navigator : null;

        if (nav?.share) {
          await nav.share({ text: message });

          return;
        }

        if (nav?.clipboard?.writeText) {
          await nav.clipboard.writeText(message);

          flashCopied();

          return;
        }
      }

      await Share.share({ message });
    } catch {
      // user cancelled share
    }
  };

  /* =======================================================
     COPY ROOM CODE
  ======================================================= */

  const handleCopy = async () => {
    try {
      const nav: any = typeof navigator !== "undefined" ? navigator : null;

      if (Platform.OS === "web" && nav?.clipboard?.writeText) {
        await nav.clipboard.writeText(roomCode);

        flashCopied();

        return;
      }

      await Share.share({ message: roomCode });
    } catch {
      // ignore
    }
  };

  /* =======================================================
     START GAME
  ======================================================= */

  const handleStart = async () => {
    // safety: never start unless every seat is filled
    if (!canStart) {
      return;
    }

    if (!onStartGame) {
      console.warn("onStartGame callback was not provided.");

      return;
    }

    setStarting(true);

    try {
      await onStartGame();
    } finally {
      setStarting(false);
    }
  };

  /* =======================================================
     READY
  ======================================================= */

  const handleToggleReady = async () => {
    if (togglingReady || !me || !roomCode || !playerName) {
      return;
    }

    setTogglingReady(true);

    try {
      await setReady(roomCode, playerName, !myReady);

      await poll();
    } catch (error) {
      console.warn("Ready toggle failed:", error);
    } finally {
      setTogglingReady(false);
    }
  };

  /* =======================================================
     BACK
  ======================================================= */

  const handleBack = async () => {
    if (roomCode && playerName) {
      try {
        await leaveRoom(roomCode, playerName);
      } catch {
        // continue back even if API fails
      }
    }

    onBack?.();
  };

  /* =======================================================
     HEADER
  ======================================================= */

  const header = (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.roundButton}
        onPress={handleBack}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={20} color={C.text} />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {roomName || `Room ${roomCode}`}
        </Text>

        <View style={styles.headerSubRow}>
          <Animated.View
            style={[
              styles.liveDot,
              {
                backgroundColor: status.color,
                opacity: pulse,
              },
            ]}
          />

          <Text style={styles.headerSub}>
            {status.label}

            {roomName ? ` • ${roomCode}` : ""}
          </Text>
        </View>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.roundButton}
          onPress={onOpenChat}
          activeOpacity={0.8}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={19}
            color={C.indigo}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roundButton}
          onPress={onOpenRoomSettings}
          activeOpacity={0.8}
        >
          <Ionicons name="settings-outline" size={19} color={C.indigo} />
        </TouchableOpacity>
      </View>
    </View>
  );

  /* =======================================================
     ERROR BANNER
  ======================================================= */

  const errorBanner = connError ? (
    <View style={styles.errorBanner}>
      <Ionicons name="cloud-offline-outline" size={16} color={C.coral} />

      <Text style={styles.errorText}>Can't reach the server. Retrying…</Text>
    </View>
  ) : null;

  /* =======================================================
     HEADING
  ======================================================= */

  const heading = (
    <View style={styles.headingBlock}>
      <Text style={styles.eyebrow}>LOBBY</Text>

      <Text style={[styles.headingTitle, !wide && styles.headingTitlePhone]}>
        {roomFull ? "Everyone is" : "Waiting for"}
      </Text>

      <Text
        style={[
          styles.headingTitle,
          !wide && styles.headingTitlePhone,
          { color: roomFull ? C.green : C.indigo },
        ]}
      >
        {roomFull ? "here!" : "players…"}
      </Text>

      <Text style={styles.headingSub}>
        {roomFull
          ? "All players have joined. You can start the game now."
          : "Share the room code with your friends. The game can start only after every player has joined."}
      </Text>
    </View>
  );

  /* =======================================================
     PLAYERS CARD
  ======================================================= */

  const playersCard = (
    <View style={styles.card}>
      <View style={styles.cardHeadRow}>
        <View>
          <Text style={styles.cardTitle}>Players</Text>

          <Text style={styles.cardSub}>Everyone in this room</Text>
        </View>

        <View style={styles.countPill}>
          <Ionicons name="people-outline" size={14} color={C.indigo} />

          <Text style={styles.countPillText}>
            {joined}/{max}
          </Text>
        </View>
      </View>

      <View style={styles.playerList}>
        {!room &&
          !connError &&
          [0, 1].map((i) => (
            <View key={`sk-${i}`} style={[styles.playerRow, { opacity: 0.6 }]}>
              <View style={[styles.avatar, { backgroundColor: C.greySoft }]} />

              <View style={{ flex: 1, gap: 6 }}>
                <View style={[styles.skelLine, { width: "40%" }]} />

                <View style={[styles.skelLine, { width: "25%", height: 8 }]} />
              </View>
            </View>
          ))}

        {players.map((p, i) => {
          const currentName = pick(p, "player_name", "playerName", "name");

          const isMe = currentName === playerName;

          const isHost = !!pick(p, "is_host", "isHost");

          const readyVal = pick(p, "is_ready", "isReady");

          const color =
            pick(p, "avatar_color", "avatarColor") ||
            FALLBACK_AVATARS[i % FALLBACK_AVATARS.length];

          return (
            <View
              key={String(p.id ?? currentName ?? i)}
              style={styles.playerRow}
            >
              <View style={[styles.avatar, { backgroundColor: color }]}>
                <Text style={styles.avatarText}>
                  {(currentName || "?").charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.playerName} numberOfLines={1}>
                  {currentName || "Player"}
                </Text>

                {isMe || isHost ? (
                  <Text style={styles.playerTag}>
                    {[isMe ? "That's you" : null, isHost ? "Host" : null]
                      .filter(Boolean)
                      .join(" • ")}
                  </Text>
                ) : null}
              </View>

              {typeof readyVal === "boolean" ? (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: readyVal ? C.greenSoft : C.greySoft,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.badgeDot,
                      {
                        backgroundColor: readyVal ? C.green : C.grey,
                      },
                    ]}
                  />

                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color: readyVal ? C.green : C.grey,
                      },
                    ]}
                  >
                    {readyVal ? "Ready" : "Not ready"}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}

        {room
          ? Array.from({ length: emptySlots }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.emptyRow}>
                <View style={styles.emptyAvatar}>
                  <Ionicons
                    name="person-add-outline"
                    size={15}
                    color="#B8AFA5"
                  />
                </View>

                <Text style={styles.emptyText}>Waiting for player…</Text>

                <Animated.View
                  style={[styles.emptyDot, { opacity: pulse }]}
                />
              </View>
            ))
          : null}
      </View>
    </View>
  );

  /* =======================================================
     ROOM CODE CARD
  ======================================================= */

  const codeCard = (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Room code</Text>

      <Text style={styles.cardSub}>Friends enter this to join</Text>

      <View style={styles.tilesRow}>
        {String(roomCode)
          .split("")
          .map((ch, i) => (
            <View
              key={i}
              style={[
                styles.tile,
                {
                  backgroundColor: TILE_COLORS[i % TILE_COLORS.length],

                  transform: [
                    {
                      rotate: TILE_ROTATIONS[i % TILE_ROTATIONS.length],
                    },
                  ],

                  shadowColor: TILE_COLORS[i % TILE_COLORS.length],
                },
              ]}
            >
              <Text style={styles.tileText}>{ch}</Text>
            </View>
          ))}
      </View>

      <View style={styles.codeActions}>
        <TouchableOpacity
          style={styles.softButton}
          onPress={handleCopy}
          activeOpacity={0.8}
        >
          <Ionicons
            name={copied ? "checkmark" : "copy-outline"}
            size={16}
            color={C.indigo}
          />

          <Text style={styles.softButtonText}>
            {copied ? "Copied!" : "Copy"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.softButton}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Ionicons name="share-social-outline" size={16} color={C.indigo} />

          <Text style={styles.softButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.progressHead}>
        <Text style={styles.progressLabel}>Players joined</Text>

        <Text style={styles.progressValue}>
          {joined} / {max}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${fillPct}%` },
            roomFull && { backgroundColor: C.green },
          ]}
        />
      </View>

      {hasReadyField && me ? (
        <TouchableOpacity
          style={[styles.readyToggle, myReady && styles.readyToggleOn]}
          onPress={handleToggleReady}
          activeOpacity={0.85}
          disabled={togglingReady}
        >
          {togglingReady ? (
            <ActivityIndicator
              size="small"
              color={myReady ? C.green : C.indigo}
            />
          ) : (
            <Ionicons
              name={myReady ? "checkmark-circle" : "ellipse-outline"}
              size={18}
              color={myReady ? C.green : C.indigo}
            />
          )}

          <Text
            style={[
              styles.readyToggleText,
              { color: myReady ? C.green : C.indigo },
            ]}
          >
            {myReady ? "You're ready" : "Mark me as ready"}
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* START GAME: disabled (grey + lock) until every player has joined */}
      <TouchableOpacity
        style={[styles.startWrap, !canStart && styles.startWrapDisabled]}
        activeOpacity={0.88}
        onPress={handleStart}
        disabled={!canStart}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canStart }}
      >
        <View
          style={[styles.startButton, !canStart && styles.startButtonDisabled]}
        >
          {starting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text
                style={[
                  styles.startButtonText,
                  !canStart && styles.startButtonTextDisabled,
                ]}
              >
                START GAME
              </Text>

              <View
                style={[
                  styles.startArrow,
                  !canStart && styles.startArrowDisabled,
                ]}
              >
                <Ionicons
                  name={canStart ? "arrow-forward" : "lock-closed"}
                  size={16}
                  color={canStart ? "#FFFFFF" : "#8A93A6"}
                />
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>

      {needMore > 0 ? (
        <Text style={styles.startHint}>
          Waiting for {needMore} more {needMore === 1 ? "player" : "players"} to
          join ({joined}/{max})
        </Text>
      ) : (
        <Text style={[styles.startHint, { color: C.green }]}>
          All players joined. Ready to start!
        </Text>
      )}
    </View>
  );

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* NEW: animated background - FIRST child, behind everything */}
      <WordScrambleAnimatedBackground backgroundColor={C.bg} />

      {/* CHANGED: transparent, so the animation shows through */}
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingHorizontal: wide ? 32 : 16,

              paddingTop:
                Platform.OS === "android"
                  ? (StatusBar.currentHeight ?? 0) + 8
                  : 16,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.column}>
            {header}

            {errorBanner}

            {wide ? (
              <View style={styles.wideRow}>
                <View style={styles.mainCol}>
                  {heading}

                  {playersCard}
                </View>

                <View style={styles.sideCol}>{codeCard}</View>
              </View>
            ) : (
              <View style={{ gap: 16 }}>
                {heading}

                {codeCard}

                {playersCard}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default RoomWaitingScreen;

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // NEW: must be transparent, otherwise it hides the animated background
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },

  scroll: {
    paddingBottom: 32,
  },

  column: {
    width: "100%",
  },

  wideRow: {
    flexDirection: "row",
    gap: 24,
    alignItems: "flex-start",
  },

  mainCol: {
    flex: 1,
    gap: 18,
    minWidth: 0,
  },

  sideCol: {
    flex: 1,
    maxWidth: 420,
    marginTop: 8,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    color: C.text,
    fontSize: 17,
    fontWeight: "800",
  },

  headerSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  headerSub: {
    color: C.sub,
    fontSize: 12,
  },

  headerRight: {
    flexDirection: "row",
    gap: 8,
  },

  roundButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ERROR */

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: C.coralSoft,
  },

  errorText: {
    color: C.coral,
    fontSize: 13,
    fontWeight: "700",
  },

  /* HEADING */

  headingBlock: {
    marginTop: 14,
  },

  eyebrow: {
    color: C.coral,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 6,
  },

  headingTitle: {
    color: C.text,
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 44,
  },

  headingTitlePhone: {
    fontSize: 30,
    lineHeight: 36,
  },

  headingSub: {
    color: C.sub,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 480,
  },

  /* CARDS */

  card: {
    backgroundColor: C.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,

    shadowColor: "#B8A48C",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 2,
  },

  cardHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: "800",
  },

  cardSub: {
    color: C.sub,
    fontSize: 12.5,
    marginTop: 3,
  },

  countPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: C.indigoSoft,
  },

  countPillText: {
    color: C.indigo,
    fontWeight: "800",
    fontSize: 13,
  },

  /* PLAYERS */

  playerList: {
    marginTop: 16,
    gap: 10,
  },

  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#FFFBF6",
    borderWidth: 1,
    borderColor: C.border,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  playerName: {
    color: C.text,
    fontSize: 15,
    fontWeight: "800",
  },

  playerTag: {
    color: C.sub,
    fontSize: 11.5,
    marginTop: 2,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 12,
  },

  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "800",
  },

  skelLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: C.greySoft,
  },

  emptyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#E6DACB",
  },

  emptyAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F6EFE6",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    flex: 1,
    color: "#A79D92",
    fontSize: 14,
    fontWeight: "600",
  },

  emptyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.coral,
  },

  /* ROOM CODE */

  tilesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
    marginBottom: 18,
    flexWrap: "wrap",
  },

  tile: {
    width: 54,
    height: 54,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",

    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 4,
  },

  tileText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },

  codeActions: {
    flexDirection: "row",
    gap: 10,
  },

  softButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: C.indigoSoft,
  },

  softButtonText: {
    color: C.indigo,
    fontWeight: "800",
    fontSize: 14,
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 18,
  },

  progressHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  progressLabel: {
    color: C.sub,
    fontSize: 13,
  },

  progressValue: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
  },

  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F1EAE0",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: C.indigo,
  },

  /* READY */

  readyToggle: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.indigo,
    backgroundColor: "#FFFFFF",
  },

  readyToggleOn: {
    borderColor: C.green,
    backgroundColor: C.greenSoft,
  },

  readyToggleText: {
    fontWeight: "800",
    fontSize: 14,
  },

  /* START */

  startWrap: {
    marginTop: 16,
    borderRadius: 18,

    shadowColor: C.indigo,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 6,
  },

  startWrapDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },

  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    height: 58,
    borderRadius: 18,
    backgroundColor: C.indigo,
  },

  // clearly greyed-out so the player can see it is locked
  startButtonDisabled: {
    backgroundColor: "#E3E5EE",
    borderWidth: 1.5,
    borderColor: "#D2D6E4",
  },

  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
  },

  startButtonTextDisabled: {
    color: "#8A93A6",
  },

  startArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
  },

  startArrowDisabled: {
    backgroundColor: "rgba(138,147,166,0.18)",
  },

  startHint: {
    color: C.sub,
    fontSize: 12.5,
    textAlign: "center",
    marginTop: 10,
  },
});
