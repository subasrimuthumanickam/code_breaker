// // // // // // import React from "react";
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   StyleSheet,
// // // // // //   TouchableOpacity,
// // // // // //   TextInput,
// // // // // //   ScrollView,
// // // // // //   SafeAreaView,
// // // // // //   StatusBar,
// // // // // // } from "react-native";
// // // // // // import { LinearGradient } from "expo-linear-gradient";
// // // // // // import { Ionicons } from "@expo/vector-icons";

// // // // // // export type RoomType = "public" | "private";

// // // // // // export interface CreateRoomConfig {
// // // // // //   numberOfPlayers: number;
// // // // // //   roomType: RoomType;
// // // // // //   roomName: string;
// // // // // // }

// // // // // // interface CreateRoomScreenProps {
// // // // // //   onBack: () => void;
// // // // // //   onCreateRoom: (config: CreateRoomConfig) => void;
// // // // // //   onJoinRoom: (code: string) => void;
// // // // // // }

// // // // // // const PLAYER_OPTIONS = [2, 3, 4];

// // // // // // const CreateRoomScreen: React.FC<CreateRoomScreenProps> = ({
// // // // // //   onBack,
// // // // // //   onCreateRoom,
// // // // // //   onJoinRoom,
// // // // // // }) => {
// // // // // //   const [numberOfPlayers, setNumberOfPlayers] = React.useState(3);
// // // // // //   const [roomType, setRoomType] = React.useState<RoomType>("public");
// // // // // //   const [roomName, setRoomName] = React.useState("");
// // // // // //   const [joinCode, setJoinCode] = React.useState("");

// // // // // //   const handleCreate = () => {
// // // // // //     onCreateRoom({
// // // // // //       numberOfPlayers,
// // // // // //       roomType,
// // // // // //       roomName: roomName.trim() || "FunRoom",
// // // // // //     });
// // // // // //   };

// // // // // //   return (
// // // // // //     <LinearGradient colors={["#0B1020", "#141B36", "#0B1020"]} style={styles.flex}>
// // // // // //       <SafeAreaView style={styles.flex}>
// // // // // //         <StatusBar barStyle="light-content" backgroundColor="#0B1020" />

// // // // // //         <View style={styles.topRow}>
// // // // // //           <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
// // // // // //             <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
// // // // // //           </TouchableOpacity>
// // // // // //           <Text style={styles.topTitle}>Create Room</Text>
// // // // // //           <View style={styles.backButton} />
// // // // // //         </View>

// // // // // //         <ScrollView
// // // // // //           contentContainerStyle={styles.scroll}
// // // // // //           showsVerticalScrollIndicator={false}
// // // // // //         >
// // // // // //           {/* Illustration banner */}
// // // // // //           <View style={styles.banner}>
// // // // // //             <View style={styles.avatarPair}>
// // // // // //               <View style={[styles.bannerAvatar, { backgroundColor: "#F97066" }]}>
// // // // // //                 <Ionicons name="person" size={26} color="#FFFFFF" />
// // // // // //               </View>
// // // // // //               <View style={[styles.bannerAvatar, styles.bannerAvatarRight, { backgroundColor: "#3B82F6" }]}>
// // // // // //                 <Ionicons name="person" size={26} color="#FFFFFF" />
// // // // // //               </View>
// // // // // //             </View>
// // // // // //             <Ionicons name="wifi" size={20} color="#7C93FF" style={styles.wifiIcon} />
// // // // // //           </View>

// // // // // //           {/* Number of players */}
// // // // // //           <Text style={styles.sectionLabel}>Number of Players</Text>
// // // // // //           <View style={styles.pillRow}>
// // // // // //             {PLAYER_OPTIONS.map((n) => {
// // // // // //               const active = numberOfPlayers === n;
// // // // // //               return (
// // // // // //                 <TouchableOpacity
// // // // // //                   key={n}
// // // // // //                   style={[styles.pill, active && styles.pillActive]}
// // // // // //                   onPress={() => setNumberOfPlayers(n)}
// // // // // //                   activeOpacity={0.85}
// // // // // //                 >
// // // // // //                   <Text style={[styles.pillText, active && styles.pillTextActive]}>{n}</Text>
// // // // // //                 </TouchableOpacity>
// // // // // //               );
// // // // // //             })}
// // // // // //           </View>

// // // // // //           {/* Room type */}
// // // // // //           <Text style={styles.sectionLabel}>Room Type</Text>
// // // // // //           <View style={styles.pillRow}>
// // // // // //             <TouchableOpacity
// // // // // //               style={[styles.typeButton, roomType === "public" && styles.typeButtonActive]}
// // // // // //               onPress={() => setRoomType("public")}
// // // // // //               activeOpacity={0.85}
// // // // // //             >
// // // // // //               <Ionicons
// // // // // //                 name="globe-outline"
// // // // // //                 size={16}
// // // // // //                 color={roomType === "public" ? "#FFFFFF" : "#9AA5C0"}
// // // // // //               />
// // // // // //               <Text
// // // // // //                 style={[
// // // // // //                   styles.typeButtonText,
// // // // // //                   roomType === "public" && styles.typeButtonTextActive,
// // // // // //                 ]}
// // // // // //               >
// // // // // //                 Public
// // // // // //               </Text>
// // // // // //             </TouchableOpacity>

// // // // // //             <TouchableOpacity
// // // // // //               style={[styles.typeButton, roomType === "private" && styles.typeButtonActive]}
// // // // // //               onPress={() => setRoomType("private")}
// // // // // //               activeOpacity={0.85}
// // // // // //             >
// // // // // //               <Ionicons
// // // // // //                 name="lock-closed-outline"
// // // // // //                 size={16}
// // // // // //                 color={roomType === "private" ? "#FFFFFF" : "#9AA5C0"}
// // // // // //               />
// // // // // //               <Text
// // // // // //                 style={[
// // // // // //                   styles.typeButtonText,
// // // // // //                   roomType === "private" && styles.typeButtonTextActive,
// // // // // //                 ]}
// // // // // //               >
// // // // // //                 Private
// // // // // //               </Text>
// // // // // //             </TouchableOpacity>
// // // // // //           </View>

// // // // // //           {/* Room name */}
// // // // // //           <Text style={styles.sectionLabel}>Room Name (Optional)</Text>
// // // // // //           <TextInput
// // // // // //             style={styles.input}
// // // // // //             placeholder="FunRoom"
// // // // // //             placeholderTextColor="#5A6478"
// // // // // //             value={roomName}
// // // // // //             onChangeText={setRoomName}
// // // // // //           />

// // // // // //           {/* Create Room */}
// // // // // //           <TouchableOpacity activeOpacity={0.88} onPress={handleCreate}>
// // // // // //             <View style={styles.createButton}>
// // // // // //               <Text style={styles.createButtonText}>Create Room</Text>
// // // // // //             </View>
// // // // // //           </TouchableOpacity>

// // // // // //           {/* Divider */}
// // // // // //           <View style={styles.dividerRow}>
// // // // // //             <View style={styles.dividerLine} />
// // // // // //             <Text style={styles.dividerText}>OR</Text>
// // // // // //             <View style={styles.dividerLine} />
// // // // // //           </View>

// // // // // //           {/* Join room */}
// // // // // //           <Text style={styles.sectionLabel}>Join Room</Text>
// // // // // //           <View style={styles.joinRow}>
// // // // // //             <TextInput
// // // // // //               style={[styles.input, styles.joinInput]}
// // // // // //               placeholder="Enter Room Code"
// // // // // //               placeholderTextColor="#5A6478"
// // // // // //               value={joinCode}
// // // // // //               onChangeText={setJoinCode}
// // // // // //               autoCapitalize="characters"
// // // // // //             />
// // // // // //             <TouchableOpacity
// // // // // //               style={styles.joinButton}
// // // // // //               activeOpacity={0.85}
// // // // // //               onPress={() => onJoinRoom(joinCode.trim())}
// // // // // //             >
// // // // // //               <Text style={styles.joinButtonText}>Join</Text>
// // // // // //             </TouchableOpacity>
// // // // // //           </View>
// // // // // //         </ScrollView>
// // // // // //       </SafeAreaView>
// // // // // //     </LinearGradient>
// // // // // //   );
// // // // // // };

// // // // // // export default CreateRoomScreen;

// // // // // // const styles = StyleSheet.create({
// // // // // //   flex: { flex: 1 },
// // // // // //   topRow: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "space-between",
// // // // // //     paddingHorizontal: 20,
// // // // // //     paddingTop: 8,
// // // // // //     paddingBottom: 6,
// // // // // //   },
// // // // // //   backButton: {
// // // // // //     width: 36,
// // // // // //     height: 36,
// // // // // //     borderRadius: 18,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //   },
// // // // // //   topTitle: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: "700",
// // // // // //   },
// // // // // //   scroll: {
// // // // // //     paddingHorizontal: 22,
// // // // // //     paddingBottom: 40,
// // // // // //   },
// // // // // //   banner: {
// // // // // //     height: 130,
// // // // // //     borderRadius: 18,
// // // // // //     backgroundColor: "#141B36",
// // // // // //     marginTop: 8,
// // // // // //     marginBottom: 24,
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //   },
// // // // // //   avatarPair: {
// // // // // //     flexDirection: "row",
// // // // // //   },
// // // // // //   bannerAvatar: {
// // // // // //     width: 56,
// // // // // //     height: 56,
// // // // // //     borderRadius: 28,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //   },
// // // // // //   bannerAvatarRight: {
// // // // // //     marginLeft: -14,
// // // // // //   },
// // // // // //   wifiIcon: {
// // // // // //     marginTop: 10,
// // // // // //   },
// // // // // //   sectionLabel: {
// // // // // //     color: "#9AA5C0",
// // // // // //     fontSize: 12.5,
// // // // // //     fontWeight: "700",
// // // // // //     marginBottom: 10,
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // //   pillRow: {
// // // // // //     flexDirection: "row",
// // // // // //     gap: 12,
// // // // // //     marginBottom: 22,
// // // // // //   },
// // // // // //   pill: {
// // // // // //     width: 52,
// // // // // //     height: 44,
// // // // // //     borderRadius: 12,
// // // // // //     backgroundColor: "#141B36",
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#1E2A4D",
// // // // // //   },
// // // // // //   pillActive: {
// // // // // //     backgroundColor: "#5B3FD6",
// // // // // //     borderColor: "#7C6CF5",
// // // // // //   },
// // // // // //   pillText: {
// // // // // //     color: "#9AA5C0",
// // // // // //     fontWeight: "700",
// // // // // //     fontSize: 15,
// // // // // //   },
// // // // // //   pillTextActive: {
// // // // // //     color: "#FFFFFF",
// // // // // //   },
// // // // // //   typeButton: {
// // // // // //     flex: 1,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     gap: 6,
// // // // // //     height: 44,
// // // // // //     borderRadius: 12,
// // // // // //     backgroundColor: "#141B36",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#1E2A4D",
// // // // // //   },
// // // // // //   typeButtonActive: {
// // // // // //     backgroundColor: "#2C63E0",
// // // // // //     borderColor: "#4D9DFF",
// // // // // //   },
// // // // // //   typeButtonText: {
// // // // // //     color: "#9AA5C0",
// // // // // //     fontWeight: "700",
// // // // // //     fontSize: 13,
// // // // // //   },
// // // // // //   typeButtonTextActive: {
// // // // // //     color: "#FFFFFF",
// // // // // //   },
// // // // // //   input: {
// // // // // //     height: 48,
// // // // // //     borderRadius: 12,
// // // // // //     backgroundColor: "#141B36",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#1E2A4D",
// // // // // //     paddingHorizontal: 16,
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 14,
// // // // // //     marginBottom: 22,
// // // // // //   },
// // // // // //   createButton: {
// // // // // //     height: 52,
// // // // // //     borderRadius: 14,
// // // // // //     backgroundColor: "#5B3FD6",
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //     marginBottom: 22,
// // // // // //   },
// // // // // //   createButtonText: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontWeight: "800",
// // // // // //     fontSize: 15,
// // // // // //   },
// // // // // //   dividerRow: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     gap: 12,
// // // // // //     marginBottom: 22,
// // // // // //   },
// // // // // //   dividerLine: {
// // // // // //     flex: 1,
// // // // // //     height: 1,
// // // // // //     backgroundColor: "#1E2A4D",
// // // // // //   },
// // // // // //   dividerText: {
// // // // // //     color: "#5A6478",
// // // // // //     fontSize: 11,
// // // // // //     fontWeight: "700",
// // // // // //   },
// // // // // //   joinRow: {
// // // // // //     flexDirection: "row",
// // // // // //     gap: 10,
// // // // // //   },
// // // // // //   joinInput: {
// // // // // //     flex: 1,
// // // // // //     marginBottom: 0,
// // // // // //   },
// // // // // //   joinButton: {
// // // // // //     width: 72,
// // // // // //     height: 48,
// // // // // //     borderRadius: 12,
// // // // // //     backgroundColor: "#2C63E0",
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //   },
// // // // // //   joinButtonText: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontWeight: "800",
// // // // // //     fontSize: 14,
// // // // // //   },
// // // // // // });
// // // // // import React from "react";
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   StyleSheet,
// // // // //   TouchableOpacity,
// // // // //   TextInput,
// // // // //   ScrollView,
// // // // //   SafeAreaView,
// // // // //   StatusBar,
// // // // // } from "react-native";
// // // // // import { LinearGradient } from "expo-linear-gradient";
// // // // // import { Ionicons } from "@expo/vector-icons";

// // // // // export type RoomType = "public" | "private";
// // // // // export type WordScrambleDifficulty = "easy" | "medium" | "hard";

// // // // // export interface CreateRoomConfig {
// // // // //   numberOfPlayers: number;
// // // // //   roomType: RoomType;
// // // // //   roomName: string;
// // // // //   difficulty: WordScrambleDifficulty;
// // // // // }

// // // // // interface CreateRoomScreenProps {
// // // // //   onBack: () => void;
// // // // //   onCreateRoom: (config: CreateRoomConfig) => void;
// // // // //   onJoinRoom: (code: string) => void;
// // // // // }

// // // // // const PLAYER_OPTIONS = [2, 3, 4];
// // // // // const DIFFICULTY_OPTIONS: { value: WordScrambleDifficulty; label: string; color: string }[] = [
// // // // //   { value: "easy", label: "Easy", color: "#22C55E" },
// // // // //   { value: "medium", label: "Medium", color: "#F5C518" },
// // // // //   { value: "hard", label: "Hard", color: "#F97066" },
// // // // // ];

// // // // // const CreateRoomScreen: React.FC<CreateRoomScreenProps> = ({
// // // // //   onBack,
// // // // //   onCreateRoom,
// // // // //   onJoinRoom,
// // // // // }) => {
// // // // //   const [numberOfPlayers, setNumberOfPlayers] = React.useState(3);
// // // // //   const [roomType, setRoomType] = React.useState<RoomType>("public");
// // // // //   const [roomName, setRoomName] = React.useState("");
// // // // //   const [joinCode, setJoinCode] = React.useState("");
// // // // //   const [difficulty, setDifficulty] = React.useState<WordScrambleDifficulty>("easy");

// // // // //   const handleCreate = () => {
// // // // //     onCreateRoom({
// // // // //       numberOfPlayers,
// // // // //       roomType,
// // // // //       roomName: roomName.trim() || "FunRoom",
// // // // //       difficulty,
// // // // //     });
// // // // //   };

// // // // //   return (
// // // // //     <LinearGradient colors={["#0B1020", "#141B36", "#0B1020"]} style={styles.flex}>
// // // // //       <SafeAreaView style={styles.flex}>
// // // // //         <StatusBar barStyle="light-content" backgroundColor="#0B1020" />

// // // // //         <View style={styles.topRow}>
// // // // //           <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
// // // // //             <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
// // // // //           </TouchableOpacity>
// // // // //           <Text style={styles.topTitle}>Create Room</Text>
// // // // //           <View style={styles.backButton} />
// // // // //         </View>

// // // // //         <ScrollView
// // // // //           contentContainerStyle={styles.scroll}
// // // // //           showsVerticalScrollIndicator={false}
// // // // //         >
// // // // //           {/* Illustration banner */}
// // // // //           <View style={styles.banner}>
// // // // //             <View style={styles.avatarPair}>
// // // // //               <View style={[styles.bannerAvatar, { backgroundColor: "#F97066" }]}>
// // // // //                 <Ionicons name="person" size={26} color="#FFFFFF" />
// // // // //               </View>
// // // // //               <View style={[styles.bannerAvatar, styles.bannerAvatarRight, { backgroundColor: "#3B82F6" }]}>
// // // // //                 <Ionicons name="person" size={26} color="#FFFFFF" />
// // // // //               </View>
// // // // //             </View>
// // // // //             <Ionicons name="wifi" size={20} color="#7C93FF" style={styles.wifiIcon} />
// // // // //           </View>

// // // // //           {/* Number of players */}
// // // // //           <Text style={styles.sectionLabel}>Number of Players</Text>
// // // // //           <View style={styles.pillRow}>
// // // // //             {PLAYER_OPTIONS.map((n) => {
// // // // //               const active = numberOfPlayers === n;
// // // // //               return (
// // // // //                 <TouchableOpacity
// // // // //                   key={n}
// // // // //                   style={[styles.pill, active && styles.pillActive]}
// // // // //                   onPress={() => setNumberOfPlayers(n)}
// // // // //                   activeOpacity={0.85}
// // // // //                 >
// // // // //                   <Text style={[styles.pillText, active && styles.pillTextActive]}>{n}</Text>
// // // // //                 </TouchableOpacity>
// // // // //               );
// // // // //             })}
// // // // //           </View>

// // // // //           {/* Room type */}
// // // // //           <Text style={styles.sectionLabel}>Room Type</Text>
// // // // //           <View style={styles.pillRow}>
// // // // //             <TouchableOpacity
// // // // //               style={[styles.typeButton, roomType === "public" && styles.typeButtonActive]}
// // // // //               onPress={() => setRoomType("public")}
// // // // //               activeOpacity={0.85}
// // // // //             >
// // // // //               <Ionicons
// // // // //                 name="globe-outline"
// // // // //                 size={16}
// // // // //                 color={roomType === "public" ? "#FFFFFF" : "#9AA5C0"}
// // // // //               />
// // // // //               <Text
// // // // //                 style={[
// // // // //                   styles.typeButtonText,
// // // // //                   roomType === "public" && styles.typeButtonTextActive,
// // // // //                 ]}
// // // // //               >
// // // // //                 Public
// // // // //               </Text>
// // // // //             </TouchableOpacity>

// // // // //             <TouchableOpacity
// // // // //               style={[styles.typeButton, roomType === "private" && styles.typeButtonActive]}
// // // // //               onPress={() => setRoomType("private")}
// // // // //               activeOpacity={0.85}
// // // // //             >
// // // // //               <Ionicons
// // // // //                 name="lock-closed-outline"
// // // // //                 size={16}
// // // // //                 color={roomType === "private" ? "#FFFFFF" : "#9AA5C0"}
// // // // //               />
// // // // //               <Text
// // // // //                 style={[
// // // // //                   styles.typeButtonText,
// // // // //                   roomType === "private" && styles.typeButtonTextActive,
// // // // //                 ]}
// // // // //               >
// // // // //                 Private
// // // // //               </Text>
// // // // //             </TouchableOpacity>
// // // // //           </View>

// // // // //           {/* Difficulty */}
// // // // //           <Text style={styles.sectionLabel}>Difficulty</Text>
// // // // //           <View style={styles.pillRow}>
// // // // //             {DIFFICULTY_OPTIONS.map((opt) => {
// // // // //               const active = difficulty === opt.value;
// // // // //               return (
// // // // //                 <TouchableOpacity
// // // // //                   key={opt.value}
// // // // //                   style={[
// // // // //                     styles.difficultyButton,
// // // // //                     active && { backgroundColor: opt.color + "26", borderColor: opt.color },
// // // // //                   ]}
// // // // //                   onPress={() => setDifficulty(opt.value)}
// // // // //                   activeOpacity={0.85}
// // // // //                 >
// // // // //                   <View style={[styles.difficultyDot, { backgroundColor: opt.color }]} />
// // // // //                   <Text
// // // // //                     style={[
// // // // //                       styles.difficultyButtonText,
// // // // //                       active && { color: opt.color },
// // // // //                     ]}
// // // // //                   >
// // // // //                     {opt.label}
// // // // //                   </Text>
// // // // //                 </TouchableOpacity>
// // // // //               );
// // // // //             })}
// // // // //           </View>

// // // // //           {/* Room name */}
// // // // //           <Text style={styles.sectionLabel}>Room Name (Optional)</Text>
// // // // //           <TextInput
// // // // //             style={styles.input}
// // // // //             placeholder="FunRoom"
// // // // //             placeholderTextColor="#5A6478"
// // // // //             value={roomName}
// // // // //             onChangeText={setRoomName}
// // // // //           />

// // // // //           {/* Create Room */}
// // // // //           <TouchableOpacity activeOpacity={0.88} onPress={handleCreate}>
// // // // //             <View style={styles.createButton}>
// // // // //               <Text style={styles.createButtonText}>Create Room</Text>
// // // // //             </View>
// // // // //           </TouchableOpacity>

// // // // //           {/* Divider */}
// // // // //           <View style={styles.dividerRow}>
// // // // //             <View style={styles.dividerLine} />
// // // // //             <Text style={styles.dividerText}>OR</Text>
// // // // //             <View style={styles.dividerLine} />
// // // // //           </View>

// // // // //           {/* Join room */}
// // // // //           <Text style={styles.sectionLabel}>Join Room</Text>
// // // // //           <View style={styles.joinRow}>
// // // // //             <TextInput
// // // // //               style={[styles.input, styles.joinInput]}
// // // // //               placeholder="Enter Room Code"
// // // // //               placeholderTextColor="#5A6478"
// // // // //               value={joinCode}
// // // // //               onChangeText={setJoinCode}
// // // // //               autoCapitalize="characters"
// // // // //             />
// // // // //             <TouchableOpacity
// // // // //               style={styles.joinButton}
// // // // //               activeOpacity={0.85}
// // // // //               onPress={() => onJoinRoom(joinCode.trim())}
// // // // //             >
// // // // //               <Text style={styles.joinButtonText}>Join</Text>
// // // // //             </TouchableOpacity>
// // // // //           </View>
// // // // //         </ScrollView>
// // // // //       </SafeAreaView>
// // // // //     </LinearGradient>
// // // // //   );
// // // // // };

// // // // // export default CreateRoomScreen;

// // // // // const styles = StyleSheet.create({
// // // // //   flex: { flex: 1 },
// // // // //   topRow: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "space-between",
// // // // //     paddingHorizontal: 20,
// // // // //     paddingTop: 8,
// // // // //     paddingBottom: 6,
// // // // //   },
// // // // //   backButton: {
// // // // //     width: 36,
// // // // //     height: 36,
// // // // //     borderRadius: 18,
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   topTitle: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 16,
// // // // //     fontWeight: "700",
// // // // //   },
// // // // //   scroll: {
// // // // //     paddingHorizontal: 22,
// // // // //     paddingBottom: 40,
// // // // //   },
// // // // //   banner: {
// // // // //     height: 130,
// // // // //     borderRadius: 18,
// // // // //     backgroundColor: "#141B36",
// // // // //     marginTop: 8,
// // // // //     marginBottom: 24,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },
// // // // //   avatarPair: {
// // // // //     flexDirection: "row",
// // // // //   },
// // // // //   bannerAvatar: {
// // // // //     width: 56,
// // // // //     height: 56,
// // // // //     borderRadius: 28,
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   bannerAvatarRight: {
// // // // //     marginLeft: -14,
// // // // //   },
// // // // //   wifiIcon: {
// // // // //     marginTop: 10,
// // // // //   },
// // // // //   sectionLabel: {
// // // // //     color: "#9AA5C0",
// // // // //     fontSize: 12.5,
// // // // //     fontWeight: "700",
// // // // //     marginBottom: 10,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   pillRow: {
// // // // //     flexDirection: "row",
// // // // //     gap: 12,
// // // // //     marginBottom: 22,
// // // // //   },
// // // // //   pill: {
// // // // //     width: 52,
// // // // //     height: 44,
// // // // //     borderRadius: 12,
// // // // //     backgroundColor: "#141B36",
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#1E2A4D",
// // // // //   },
// // // // //   pillActive: {
// // // // //     backgroundColor: "#5B3FD6",
// // // // //     borderColor: "#7C6CF5",
// // // // //   },
// // // // //   pillText: {
// // // // //     color: "#9AA5C0",
// // // // //     fontWeight: "700",
// // // // //     fontSize: 15,
// // // // //   },
// // // // //   pillTextActive: {
// // // // //     color: "#FFFFFF",
// // // // //   },
// // // // //   typeButton: {
// // // // //     flex: 1,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     gap: 6,
// // // // //     height: 44,
// // // // //     borderRadius: 12,
// // // // //     backgroundColor: "#141B36",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#1E2A4D",
// // // // //   },
// // // // //   typeButtonActive: {
// // // // //     backgroundColor: "#2C63E0",
// // // // //     borderColor: "#4D9DFF",
// // // // //   },
// // // // //   typeButtonText: {
// // // // //     color: "#9AA5C0",
// // // // //     fontWeight: "700",
// // // // //     fontSize: 13,
// // // // //   },
// // // // //   typeButtonTextActive: {
// // // // //     color: "#FFFFFF",
// // // // //   },
// // // // //   difficultyButton: {
// // // // //     flex: 1,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     gap: 6,
// // // // //     height: 44,
// // // // //     borderRadius: 12,
// // // // //     backgroundColor: "#141B36",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#1E2A4D",
// // // // //   },
// // // // //   difficultyDot: {
// // // // //     width: 8,
// // // // //     height: 8,
// // // // //     borderRadius: 4,
// // // // //   },
// // // // //   difficultyButtonText: {
// // // // //     color: "#9AA5C0",
// // // // //     fontWeight: "700",
// // // // //     fontSize: 12.5,
// // // // //   },
// // // // //   input: {
// // // // //     height: 48,
// // // // //     borderRadius: 12,
// // // // //     backgroundColor: "#141B36",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#1E2A4D",
// // // // //     paddingHorizontal: 16,
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 14,
// // // // //     marginBottom: 22,
// // // // //   },
// // // // //   createButton: {
// // // // //     height: 52,
// // // // //     borderRadius: 14,
// // // // //     backgroundColor: "#5B3FD6",
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //     marginBottom: 22,
// // // // //   },
// // // // //   createButtonText: {
// // // // //     color: "#FFFFFF",
// // // // //     fontWeight: "800",
// // // // //     fontSize: 15,
// // // // //   },
// // // // //   dividerRow: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 12,
// // // // //     marginBottom: 22,
// // // // //   },
// // // // //   dividerLine: {
// // // // //     flex: 1,
// // // // //     height: 1,
// // // // //     backgroundColor: "#1E2A4D",
// // // // //   },
// // // // //   dividerText: {
// // // // //     color: "#5A6478",
// // // // //     fontSize: 11,
// // // // //     fontWeight: "700",
// // // // //   },
// // // // //   joinRow: {
// // // // //     flexDirection: "row",
// // // // //     gap: 10,
// // // // //   },
// // // // //   joinInput: {
// // // // //     flex: 1,
// // // // //     marginBottom: 0,
// // // // //   },
// // // // //   joinButton: {
// // // // //     width: 72,
// // // // //     height: 48,
// // // // //     borderRadius: 12,
// // // // //     backgroundColor: "#2C63E0",
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   joinButtonText: {
// // // // //     color: "#FFFFFF",
// // // // //     fontWeight: "800",
// // // // //     fontSize: 14,
// // // // //   },
// // // // // });
// // // // import React, { useMemo, useState } from "react";
// // // // import {
// // // //   ScrollView,
// // // //   StyleSheet,
// // // //   Text,
// // // //   TextInput,
// // // //   TouchableOpacity,
// // // //   useWindowDimensions,
// // // //   View,
// // // // } from "react-native";

// // // // export type CreateRoomConfig = {
// // // //   roomName: string;
// // // //   roomType: "public" | "private";
// // // //   numberOfPlayers: number;
// // // //   difficulty: "easy" | "medium" | "hard";
// // // //   rounds: number;
// // // //   timePerRoundSec: number;
// // // // };

// // // // type CreateRoomScreenProps = {
// // // //   onBack: () => void;

// // // //   onCreateRoom: (config: CreateRoomConfig) => void | Promise<void>;

// // // //   onJoinRoom?: (code: string) => void | Promise<void>;

// // // //   onTabHome?: () => void;

// // // //   onTabLeaderboard?: () => void;

// // // //   onTabProfile?: () => void;
// // // // };

// // // // const COLORS = {
// // // //   background: "#FFF9F1",
// // // //   white: "#FFFFFF",

// // // //   navy: "#17233B",
// // // //   navySoft: "#24314A",

// // // //   coral: "#FF665F",
// // // //   coralLight: "#FFF0ED",

// // // //   blue: "#3B82F6",
// // // //   blueLight: "#EEF4FF",

// // // //   green: "#21B47A",
// // // //   greenLight: "#EAF9F2",

// // // //   yellow: "#F7B731",
// // // //   yellowLight: "#FFF6DD",

// // // //   purple: "#5146E5",
// // // //   purpleLight: "#F0EDFF",

// // // //   text: "#17233B",
// // // //   muted: "#718096",
// // // //   border: "#E7E0D6",
// // // //   softBorder: "#EFE9E0",
// // // // };

// // // // export default function CreateRoomScreen({
// // // //   onBack,
// // // //   onCreateRoom,
// // // //   onJoinRoom,
// // // //   onTabHome,
// // // //   onTabLeaderboard,
// // // //   onTabProfile,
// // // // }: CreateRoomScreenProps) {
// // // //   const { width } = useWindowDimensions();

// // // //   const isMobile = width < 600;
// // // //   const isTablet = width >= 600 && width < 1000;
// // // //   const isDesktop = width >= 1000;

// // // //   const [numberOfPlayers, setNumberOfPlayers] = useState(3);

// // // //   const [roomType, setRoomType] =
// // // //     useState<"public" | "private">("private");

// // // //   const [difficulty, setDifficulty] =
// // // //     useState<"easy" | "medium" | "hard">("easy");

// // // //   const [rounds, setRounds] = useState(5);

// // // //   const [timePerRoundSec, setTimePerRoundSec] = useState(20);

// // // //   const [roomName, setRoomName] = useState("");

// // // //   const [activeTab, setActiveTab] = useState<
// // // //     "home" | "rankings" | "profile"
// // // //   >("home");

// // // //   const canDecreasePlayers = numberOfPlayers > 2;
// // // //   const canIncreasePlayers = numberOfPlayers < 8;

// // // //   const difficultyData = useMemo(
// // // //     () => [
// // // //       {
// // // //         id: "easy" as const,
// // // //         title: "Easy",
// // // //         description: "Simple words and more time",
// // // //         color: COLORS.green,
// // // //         background: COLORS.greenLight,
// // // //       },
// // // //       {
// // // //         id: "medium" as const,
// // // //         title: "Medium",
// // // //         description: "Balanced challenge",
// // // //         color: COLORS.yellow,
// // // //         background: COLORS.yellowLight,
// // // //       },
// // // //       {
// // // //         id: "hard" as const,
// // // //         title: "Hard",
// // // //         description: "Tricky words and less time",
// // // //         color: COLORS.coral,
// // // //         background: COLORS.coralLight,
// // // //       },
// // // //     ],
// // // //     []
// // // //   );

// // // //   const handleCreate = async () => {
// // // //     const config: CreateRoomConfig = {
// // // //       roomName: roomName.trim() || "Word Battle",
// // // //       roomType,
// // // //       numberOfPlayers,
// // // //       difficulty,
// // // //       rounds,
// // // //       timePerRoundSec,
// // // //     };

// // // //     await onCreateRoom(config);
// // // //   };

// // // //   const handleTabPress = (
// // // //     tab: "home" | "rankings" | "profile"
// // // //   ) => {
// // // //     setActiveTab(tab);

// // // //     if (tab === "home") {
// // // //       if (onTabHome) {
// // // //         onTabHome();
// // // //       } else {
// // // //         onBack();
// // // //       }
// // // //     }

// // // //     if (tab === "rankings") {
// // // //       if (onTabLeaderboard) {
// // // //         onTabLeaderboard();
// // // //       }
// // // //     }

// // // //     if (tab === "profile") {
// // // //       if (onTabProfile) {
// // // //         onTabProfile();
// // // //       }
// // // //     }
// // // //   };

// // // //   return (
// // // //     <View style={styles.screen}>
// // // //       {/* =====================================================
// // // //           DESKTOP SIDEBAR
// // // //       ====================================================== */}
// // // //       {!isMobile && (
// // // //         <View
// // // //           style={[
// // // //             styles.sidebar,
// // // //             isTablet && styles.sidebarTablet,
// // // //           ]}
// // // //         >
// // // //           {/* Logo */}
// // // //           <View style={styles.brandArea}>
// // // //             <View style={styles.logo}>
// // // //               <Text style={styles.logoText}>WS</Text>
// // // //             </View>

// // // //             {isDesktop && (
// // // //               <View style={styles.brandTextArea}>
// // // //                 <Text style={styles.brandTitle}>
// // // //                   Word <Text style={styles.brandCoral}>Scramble</Text>
// // // //                 </Text>

// // // //                 <Text style={styles.brandSubtitle}>
// // // //                   Think fast. Play smart.
// // // //                 </Text>
// // // //               </View>
// // // //             )}
// // // //           </View>

// // // //           {/* Navigation */}
// // // //           <View style={styles.sideNavigation}>
// // // //             <TouchableOpacity
// // // //               activeOpacity={0.8}
// // // //               onPress={() => handleTabPress("home")}
// // // //               style={[
// // // //                 styles.sideNavItem,
// // // //                 activeTab === "home" && styles.sideNavItemActive,
// // // //               ]}
// // // //             >
// // // //               <View
// // // //                 style={[
// // // //                   styles.sideNavIcon,
// // // //                   activeTab === "home" &&
// // // //                     styles.sideNavIconActive,
// // // //                 ]}
// // // //               >
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.sideNavIconText,
// // // //                     activeTab === "home" &&
// // // //                       styles.sideNavIconTextActive,
// // // //                   ]}
// // // //                 >
// // // //                   ⌂
// // // //                 </Text>
// // // //               </View>

// // // //               {isDesktop && (
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.sideNavText,
// // // //                     activeTab === "home" &&
// // // //                       styles.sideNavTextActive,
// // // //                   ]}
// // // //                 >
// // // //                   Home
// // // //                 </Text>
// // // //               )}
// // // //             </TouchableOpacity>

// // // //             <TouchableOpacity
// // // //               activeOpacity={0.8}
// // // //               onPress={() => handleTabPress("rankings")}
// // // //               style={[
// // // //                 styles.sideNavItem,
// // // //                 activeTab === "rankings" &&
// // // //                   styles.sideNavItemActive,
// // // //               ]}
// // // //             >
// // // //               <View
// // // //                 style={[
// // // //                   styles.sideNavIcon,
// // // //                   activeTab === "rankings" &&
// // // //                     styles.sideNavIconActive,
// // // //                 ]}
// // // //               >
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.sideNavIconText,
// // // //                     activeTab === "rankings" &&
// // // //                       styles.sideNavIconTextActive,
// // // //                   ]}
// // // //                 >
// // // //                   ♜
// // // //                 </Text>
// // // //               </View>

// // // //               {isDesktop && (
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.sideNavText,
// // // //                     activeTab === "rankings" &&
// // // //                       styles.sideNavTextActive,
// // // //                   ]}
// // // //                 >
// // // //                   Rankings
// // // //                 </Text>
// // // //               )}
// // // //             </TouchableOpacity>

// // // //             <TouchableOpacity
// // // //               activeOpacity={0.8}
// // // //               onPress={() => handleTabPress("profile")}
// // // //               style={[
// // // //                 styles.sideNavItem,
// // // //                 activeTab === "profile" &&
// // // //                   styles.sideNavItemActive,
// // // //               ]}
// // // //             >
// // // //               <View
// // // //                 style={[
// // // //                   styles.sideNavIcon,
// // // //                   activeTab === "profile" &&
// // // //                     styles.sideNavIconActive,
// // // //                 ]}
// // // //               >
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.sideNavIconText,
// // // //                     activeTab === "profile" &&
// // // //                       styles.sideNavIconTextActive,
// // // //                   ]}
// // // //                 >
// // // //                   ♟
// // // //                 </Text>
// // // //               </View>

// // // //               {isDesktop && (
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.sideNavText,
// // // //                     activeTab === "profile" &&
// // // //                       styles.sideNavTextActive,
// // // //                   ]}
// // // //                 >
// // // //                   Profile
// // // //                 </Text>
// // // //               )}
// // // //             </TouchableOpacity>
// // // //           </View>

// // // //           {/* Bottom Sidebar Card */}
// // // //           {isDesktop && (
// // // //             <View style={styles.challengeCard}>
// // // //               <View style={styles.challengeIcon}>
// // // //                 <Text style={styles.challengeIconText}>✦</Text>
// // // //               </View>

// // // //               <Text style={styles.challengeTitle}>
// // // //                 Ready for a challenge?
// // // //               </Text>

// // // //               <Text style={styles.challengeDescription}>
// // // //                 Create your own word battle and challenge your friends.
// // // //               </Text>
// // // //             </View>
// // // //           )}
// // // //         </View>
// // // //       )}

// // // //       {/* =====================================================
// // // //           MAIN AREA
// // // //       ====================================================== */}
// // // //       <View style={styles.main}>
// // // //         {/* ===================================================
// // // //             TOP HEADER
// // // //         ==================================================== */}
// // // //         <View
// // // //           style={[
// // // //             styles.header,
// // // //             isMobile && styles.headerMobile,
// // // //             isTablet && styles.headerTablet,
// // // //           ]}
// // // //         >
// // // //           <TouchableOpacity
// // // //             activeOpacity={0.8}
// // // //             onPress={onBack}
// // // //             style={[
// // // //               styles.backButton,
// // // //               isMobile && styles.backButtonMobile,
// // // //             ]}
// // // //           >
// // // //             <Text style={styles.backIcon}>←</Text>
// // // //           </TouchableOpacity>

// // // //           <View style={styles.headerTitleArea}>
// // // //             <Text
// // // //               style={[
// // // //                 styles.headerTitle,
// // // //                 isMobile && styles.headerTitleMobile,
// // // //               ]}
// // // //             >
// // // //               Create Game
// // // //             </Text>

// // // //             <Text style={styles.headerSubtitle}>
// // // //               Set up your word battle
// // // //             </Text>
// // // //           </View>

// // // //           <View style={styles.headerLogo}>
// // // //             <Text style={styles.headerLogoText}>WS</Text>
// // // //           </View>
// // // //         </View>

// // // //         {/* ===================================================
// // // //             SCROLLABLE CONTENT
// // // //         ==================================================== */}
// // // //         <ScrollView
// // // //           style={styles.scroll}
// // // //           contentContainerStyle={[
// // // //             styles.content,
// // // //             isMobile && styles.contentMobile,
// // // //             isTablet && styles.contentTablet,
// // // //           ]}
// // // //           showsVerticalScrollIndicator={false}
// // // //           keyboardShouldPersistTaps="handled"
// // // //           nestedScrollEnabled
// // // //         >
// // // //           {/* =================================================
// // // //               HERO CARD
// // // //           ================================================== */}
// // // //           <View
// // // //             style={[
// // // //               styles.heroCard,
// // // //               isMobile && styles.heroCardMobile,
// // // //             ]}
// // // //           >
// // // //             <View
// // // //               style={[
// // // //                 styles.heroLogo,
// // // //                 isMobile && styles.heroLogoMobile,
// // // //               ]}
// // // //             >
// // // //               <Text style={styles.heroLogoText}>WS</Text>
// // // //             </View>

// // // //             <View style={styles.heroTextArea}>
// // // //               <Text
// // // //                 style={[
// // // //                   styles.heroTitle,
// // // //                   isMobile && styles.heroTitleMobile,
// // // //                 ]}
// // // //               >
// // // //                 Create your word battle
// // // //               </Text>

// // // //               <Text
// // // //                 style={[
// // // //                   styles.heroSubtitle,
// // // //                   isMobile && styles.heroSubtitleMobile,
// // // //                 ]}
// // // //               >
// // // //                 Choose your players, challenge level and game rules.
// // // //               </Text>
// // // //             </View>

// // // //             <View
// // // //               style={[
// // // //                 styles.privateBadge,
// // // //                 isMobile && styles.privateBadgeMobile,
// // // //               ]}
// // // //             >
// // // //               <Text style={styles.privateBadgeText}>
// // // //                 🔒 Private
// // // //               </Text>
// // // //             </View>
// // // //           </View>

// // // //           {/* =================================================
// // // //               GAME MODE
// // // //           ================================================== */}
// // // //           <View style={styles.section}>
// // // //             <Text style={styles.sectionTitle}>Game mode</Text>

// // // //             <Text style={styles.sectionDescription}>
// // // //               Choose how your word battle works
// // // //             </Text>

// // // //             <TouchableOpacity
// // // //               activeOpacity={0.85}
// // // //               style={styles.gameModeCard}
// // // //             >
// // // //               <View style={styles.gameModeIcon}>
// // // //                 <Text style={styles.gameModeIconText}>↝</Text>
// // // //               </View>

// // // //               <View style={styles.gameModeContent}>
// // // //                 <Text style={styles.gameModeTitle}>
// // // //                   Classic Scramble
// // // //                 </Text>

// // // //                 <Text style={styles.gameModeDescription}>
// // // //                   Unscramble the word before the timer runs out.
// // // //                 </Text>
// // // //               </View>

// // // //               <View style={styles.selectedCircle}>
// // // //                 <Text style={styles.selectedCheck}>✓</Text>
// // // //               </View>
// // // //             </TouchableOpacity>
// // // //           </View>

// // // //           {/* =================================================
// // // //               PLAYERS
// // // //           ================================================== */}
// // // //           <View style={styles.section}>
// // // //             <View style={styles.sectionHeaderRow}>
// // // //               <View>
// // // //                 <Text style={styles.sectionTitle}>Players</Text>

// // // //                 <Text style={styles.sectionDescription}>
// // // //                   How many people can join?
// // // //                 </Text>
// // // //               </View>

// // // //               <Text style={styles.playersCount}>
// // // //                 {numberOfPlayers} players
// // // //               </Text>
// // // //             </View>

// // // //             <View
// // // //               style={[
// // // //                 styles.playersCard,
// // // //                 isMobile && styles.playersCardMobile,
// // // //               ]}
// // // //             >
// // // //               <TouchableOpacity
// // // //                 activeOpacity={0.8}
// // // //                 disabled={!canDecreasePlayers}
// // // //                 onPress={() =>
// // // //                   setNumberOfPlayers((value) =>
// // // //                     Math.max(2, value - 1)
// // // //                   )
// // // //                 }
// // // //                 style={[
// // // //                   styles.counterButton,
// // // //                   !canDecreasePlayers &&
// // // //                     styles.counterButtonDisabled,
// // // //                 ]}
// // // //               >
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.counterText,
// // // //                     !canDecreasePlayers &&
// // // //                       styles.counterTextDisabled,
// // // //                   ]}
// // // //                 >
// // // //                   −
// // // //                 </Text>
// // // //               </TouchableOpacity>

// // // //               <View style={styles.playerAvatars}>
// // // //                 {Array.from({
// // // //                   length: Math.min(numberOfPlayers, 4),
// // // //                 }).map((_, index) => {
// // // //                   const avatarColors = [
// // // //                     COLORS.coral,
// // // //                     COLORS.blue,
// // // //                     COLORS.green,
// // // //                     COLORS.yellow,
// // // //                   ];

// // // //                   return (
// // // //                     <View
// // // //                       key={index}
// // // //                       style={[
// // // //                         styles.avatar,
// // // //                         {
// // // //                           backgroundColor:
// // // //                             avatarColors[index],
// // // //                         },
// // // //                       ]}
// // // //                     >
// // // //                       <Text style={styles.avatarText}>
// // // //                         ♟
// // // //                       </Text>
// // // //                     </View>
// // // //                   );
// // // //                 })}

// // // //                 {numberOfPlayers > 4 && (
// // // //                   <View
// // // //                     style={[
// // // //                       styles.avatar,
// // // //                       {
// // // //                         backgroundColor: COLORS.navy,
// // // //                       },
// // // //                     ]}
// // // //                   >
// // // //                     <Text style={styles.avatarText}>
// // // //                       +{numberOfPlayers - 4}
// // // //                     </Text>
// // // //                   </View>
// // // //                 )}
// // // //               </View>

// // // //               <TouchableOpacity
// // // //                 activeOpacity={0.8}
// // // //                 disabled={!canIncreasePlayers}
// // // //                 onPress={() =>
// // // //                   setNumberOfPlayers((value) =>
// // // //                     Math.min(8, value + 1)
// // // //                   )
// // // //                 }
// // // //                 style={[
// // // //                   styles.counterButton,
// // // //                   !canIncreasePlayers &&
// // // //                     styles.counterButtonDisabled,
// // // //                 ]}
// // // //               >
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.counterText,
// // // //                     !canIncreasePlayers &&
// // // //                       styles.counterTextDisabled,
// // // //                   ]}
// // // //                 >
// // // //                   +
// // // //                 </Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </View>

// // // //           {/* =================================================
// // // //               ROOM ACCESS
// // // //           ================================================== */}
// // // //           <View style={styles.section}>
// // // //             <Text style={styles.sectionTitle}>Room access</Text>

// // // //             <Text style={styles.sectionDescription}>
// // // //               Choose who can join your game
// // // //             </Text>

// // // //             <View
// // // //               style={[
// // // //                 styles.accessRow,
// // // //                 isMobile && styles.accessRowMobile,
// // // //               ]}
// // // //             >
// // // //               {/* PUBLIC */}
// // // //               <TouchableOpacity
// // // //                 activeOpacity={0.85}
// // // //                 onPress={() => setRoomType("public")}
// // // //                 style={[
// // // //                   styles.accessCard,
// // // //                   roomType === "public" &&
// // // //                     styles.accessCardPublicSelected,
// // // //                 ]}
// // // //               >
// // // //                 <View
// // // //                   style={[
// // // //                     styles.accessIcon,
// // // //                     {
// // // //                       backgroundColor:
// // // //                         roomType === "public"
// // // //                           ? COLORS.blue
// // // //                           : COLORS.blueLight,
// // // //                     },
// // // //                   ]}
// // // //                 >
// // // //                   <Text
// // // //                     style={[
// // // //                       styles.accessIconText,
// // // //                       {
// // // //                         color:
// // // //                           roomType === "public"
// // // //                             ? COLORS.white
// // // //                             : COLORS.blue,
// // // //                       },
// // // //                     ]}
// // // //                   >
// // // //                     ◎
// // // //                   </Text>
// // // //                 </View>

// // // //                 <View style={styles.accessContent}>
// // // //                   <Text style={styles.accessTitle}>
// // // //                     Public
// // // //                   </Text>

// // // //                   <Text style={styles.accessDescription}>
// // // //                     Anyone can join with the room code.
// // // //                   </Text>
// // // //                 </View>

// // // //                 {roomType === "public" && (
// // // //                   <View style={styles.smallCheck}>
// // // //                     <Text style={styles.smallCheckText}>
// // // //                       ✓
// // // //                     </Text>
// // // //                   </View>
// // // //                 )}
// // // //               </TouchableOpacity>

// // // //               {/* PRIVATE */}
// // // //               <TouchableOpacity
// // // //                 activeOpacity={0.85}
// // // //                 onPress={() => setRoomType("private")}
// // // //                 style={[
// // // //                   styles.accessCard,
// // // //                   roomType === "private" &&
// // // //                     styles.accessCardPrivateSelected,
// // // //                 ]}
// // // //               >
// // // //                 <View
// // // //                   style={[
// // // //                     styles.accessIcon,
// // // //                     {
// // // //                       backgroundColor:
// // // //                         roomType === "private"
// // // //                           ? COLORS.coralLight
// // // //                           : "#F7F3ED",
// // // //                     },
// // // //                   ]}
// // // //                 >
// // // //                   <Text
// // // //                     style={[
// // // //                       styles.accessIconText,
// // // //                       {
// // // //                         color: COLORS.coral,
// // // //                       },
// // // //                     ]}
// // // //                   >
// // // //                     🔒
// // // //                   </Text>
// // // //                 </View>

// // // //                 <View style={styles.accessContent}>
// // // //                   <Text style={styles.accessTitle}>
// // // //                     Private
// // // //                   </Text>

// // // //                   <Text style={styles.accessDescription}>
// // // //                     Only players with the room code can join.
// // // //                   </Text>
// // // //                 </View>

// // // //                 {roomType === "private" && (
// // // //                   <View
// // // //                     style={[
// // // //                       styles.smallCheck,
// // // //                       {
// // // //                         backgroundColor: COLORS.coral,
// // // //                       },
// // // //                     ]}
// // // //                   >
// // // //                     <Text style={styles.smallCheckText}>
// // // //                       ✓
// // // //                     </Text>
// // // //                   </View>
// // // //                 )}
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </View>

// // // //           {/* =================================================
// // // //               DIFFICULTY
// // // //           ================================================== */}
// // // //           <View style={styles.section}>
// // // //             <Text style={styles.sectionTitle}>
// // // //               Challenge level
// // // //             </Text>

// // // //             <Text style={styles.sectionDescription}>
// // // //               Choose how difficult the words should be
// // // //             </Text>

// // // //             <View
// // // //               style={[
// // // //                 styles.difficultyGrid,
// // // //                 isMobile && styles.difficultyGridMobile,
// // // //               ]}
// // // //             >
// // // //               {difficultyData.map((item) => {
// // // //                 const selected = difficulty === item.id;

// // // //                 return (
// // // //                   <TouchableOpacity
// // // //                     key={item.id}
// // // //                     activeOpacity={0.85}
// // // //                     onPress={() => setDifficulty(item.id)}
// // // //                     style={[
// // // //                       styles.difficultyCard,
// // // //                       isMobile &&
// // // //                         styles.difficultyCardMobile,
// // // //                       selected && {
// // // //                         borderColor: item.color,
// // // //                         borderWidth: 1.5,
// // // //                       },
// // // //                     ]}
// // // //                   >
// // // //                     <View
// // // //                       style={[
// // // //                         styles.difficultyDot,
// // // //                         {
// // // //                           backgroundColor: item.color,
// // // //                         },
// // // //                       ]}
// // // //                     />

// // // //                     <View
// // // //                       style={
// // // //                         styles.difficultyContent
// // // //                       }
// // // //                     >
// // // //                       <Text
// // // //                         style={[
// // // //                           styles.difficultyTitle,
// // // //                           selected && {
// // // //                             color: item.color,
// // // //                           },
// // // //                         ]}
// // // //                       >
// // // //                         {item.title}
// // // //                       </Text>

// // // //                       <Text
// // // //                         style={styles.difficultyDescription}
// // // //                       >
// // // //                         {item.description}
// // // //                       </Text>
// // // //                     </View>

// // // //                     {selected && (
// // // //                       <View
// // // //                         style={[
// // // //                           styles.difficultyCheck,
// // // //                           {
// // // //                             backgroundColor: item.color,
// // // //                           },
// // // //                         ]}
// // // //                       >
// // // //                         <Text
// // // //                           style={styles.difficultyCheckText}
// // // //                         >
// // // //                           ✓
// // // //                         </Text>
// // // //                       </View>
// // // //                     )}
// // // //                   </TouchableOpacity>
// // // //                 );
// // // //               })}
// // // //             </View>
// // // //           </View>

// // // //           {/* =================================================
// // // //               MATCH SETTINGS
// // // //           ================================================== */}
// // // //           <View style={styles.section}>
// // // //             <Text style={styles.sectionTitle}>
// // // //               Match settings
// // // //             </Text>

// // // //             <Text style={styles.sectionDescription}>
// // // //               Configure the pace of your game
// // // //             </Text>

// // // //             <View style={styles.settingsCard}>
// // // //               {/* ROUNDS */}
// // // //               <View style={styles.settingRow}>
// // // //                 <View style={styles.settingInfo}>
// // // //                   <View
// // // //                     style={[
// // // //                       styles.settingIcon,
// // // //                       {
// // // //                         backgroundColor:
// // // //                           COLORS.blueLight,
// // // //                       },
// // // //                     ]}
// // // //                   >
// // // //                     <Text
// // // //                       style={[
// // // //                         styles.settingIconText,
// // // //                         {
// // // //                           color: COLORS.blue,
// // // //                         },
// // // //                       ]}
// // // //                     >
// // // //                       ≋
// // // //                     </Text>
// // // //                   </View>

// // // //                   <View style={styles.settingText}>
// // // //                     <Text style={styles.settingTitle}>
// // // //                       Rounds
// // // //                     </Text>

// // // //                     <Text
// // // //                       style={styles.settingDescription}
// // // //                     >
// // // //                       Total rounds in this match
// // // //                     </Text>
// // // //                   </View>
// // // //                 </View>

// // // //                 <View
// // // //                   style={[
// // // //                     styles.optionGroup,
// // // //                     isMobile &&
// // // //                       styles.optionGroupMobile,
// // // //                   ]}
// // // //                 >
// // // //                   {[3, 5, 10].map((value) => {
// // // //                     const selected = rounds === value;

// // // //                     return (
// // // //                       <TouchableOpacity
// // // //                         key={value}
// // // //                         activeOpacity={0.8}
// // // //                         onPress={() =>
// // // //                           setRounds(value)
// // // //                         }
// // // //                         style={[
// // // //                           styles.optionButton,
// // // //                           selected &&
// // // //                             styles.optionButtonSelected,
// // // //                         ]}
// // // //                       >
// // // //                         <Text
// // // //                           style={[
// // // //                             styles.optionText,
// // // //                             selected &&
// // // //                               styles.optionTextSelected,
// // // //                           ]}
// // // //                         >
// // // //                           {value}
// // // //                         </Text>
// // // //                       </TouchableOpacity>
// // // //                     );
// // // //                   })}
// // // //                 </View>
// // // //               </View>

// // // //               <View style={styles.settingDivider} />

// // // //               {/* TIMER */}
// // // //               <View style={styles.settingRow}>
// // // //                 <View style={styles.settingInfo}>
// // // //                   <View
// // // //                     style={[
// // // //                       styles.settingIcon,
// // // //                       {
// // // //                         backgroundColor:
// // // //                           COLORS.yellowLight,
// // // //                       },
// // // //                     ]}
// // // //                   >
// // // //                     <Text
// // // //                       style={[
// // // //                         styles.settingIconText,
// // // //                         {
// // // //                           color: COLORS.yellow,
// // // //                         },
// // // //                       ]}
// // // //                     >
// // // //                       ◷
// // // //                     </Text>
// // // //                   </View>

// // // //                   <View style={styles.settingText}>
// // // //                     <Text style={styles.settingTitle}>
// // // //                       Round timer
// // // //                     </Text>

// // // //                     <Text
// // // //                       style={styles.settingDescription}
// // // //                     >
// // // //                       Time available for each word
// // // //                     </Text>
// // // //                   </View>
// // // //                 </View>

// // // //                 <View
// // // //                   style={[
// // // //                     styles.optionGroup,
// // // //                     isMobile &&
// // // //                       styles.optionGroupMobile,
// // // //                   ]}
// // // //                 >
// // // //                   {[15, 20, 30].map((value) => {
// // // //                     const selected =
// // // //                       timePerRoundSec === value;

// // // //                     return (
// // // //                       <TouchableOpacity
// // // //                         key={value}
// // // //                         activeOpacity={0.8}
// // // //                         onPress={() =>
// // // //                           setTimePerRoundSec(value)
// // // //                         }
// // // //                         style={[
// // // //                           styles.optionButton,
// // // //                           selected &&
// // // //                             styles.optionButtonSelected,
// // // //                         ]}
// // // //                       >
// // // //                         <Text
// // // //                           style={[
// // // //                             styles.optionText,
// // // //                             selected &&
// // // //                               styles.optionTextSelected,
// // // //                           ]}
// // // //                         >
// // // //                           {value}s
// // // //                         </Text>
// // // //                       </TouchableOpacity>
// // // //                     );
// // // //                   })}
// // // //                 </View>
// // // //               </View>
// // // //             </View>
// // // //           </View>

// // // //           {/* =================================================
// // // //               ROOM NAME
// // // //           ================================================== */}
// // // //           <View style={styles.section}>
// // // //             <Text style={styles.sectionTitle}>
// // // //               Room identity
// // // //             </Text>

// // // //             <Text style={styles.sectionDescription}>
// // // //               Give your game a name
// // // //             </Text>

// // // //             <View
// // // //               style={[
// // // //                 styles.inputWrapper,
// // // //                 isMobile &&
// // // //                   styles.inputWrapperMobile,
// // // //               ]}
// // // //             >
// // // //               <TextInput
// // // //                 value={roomName}
// // // //                 onChangeText={setRoomName}
// // // //                 placeholder="Enter room name"
// // // //                 placeholderTextColor="#9AA3B2"
// // // //                 style={[
// // // //                   styles.input,
// // // //                   isMobile && styles.inputMobile,
// // // //                 ]}
// // // //                 maxLength={30}
// // // //               />

// // // //               <Text style={styles.characterCount}>
// // // //                 {roomName.length}/30
// // // //               </Text>
// // // //             </View>
// // // //           </View>

// // // //           {/* =================================================
// // // //               CREATE BUTTON
// // // //           ================================================== */}
// // // //           <TouchableOpacity
// // // //             activeOpacity={0.88}
// // // //             onPress={handleCreate}
// // // //             style={[
// // // //               styles.createButton,
// // // //               isMobile &&
// // // //                 styles.createButtonMobile,
// // // //             ]}
// // // //           >
// // // //             <Text style={styles.createButtonText}>
// // // //               CREATE GAME
// // // //             </Text>

// // // //             <View style={styles.createButtonArrow}>
// // // //               <Text style={styles.createButtonArrowText}>
// // // //                 →
// // // //               </Text>
// // // //             </View>
// // // //           </TouchableOpacity>

// // // //           <Text style={styles.bottomHint}>
// // // //             You can change the room settings before the game starts.
// // // //           </Text>
// // // //         </ScrollView>

// // // //         {/* ===================================================
// // // //             MOBILE BOTTOM NAVIGATION
// // // //         ==================================================== */}
// // // //         {isMobile && (
// // // //           <View style={styles.bottomNavigation}>
// // // //             <TouchableOpacity
// // // //               activeOpacity={0.8}
// // // //               onPress={() => handleTabPress("home")}
// // // //               style={styles.bottomNavItem}
// // // //             >
// // // //               <View
// // // //                 style={[
// // // //                   styles.bottomNavIcon,
// // // //                   activeTab === "home" &&
// // // //                     styles.bottomNavIconActive,
// // // //                 ]}
// // // //               >
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.bottomNavIconText,
// // // //                     activeTab === "home" &&
// // // //                       styles.bottomNavIconTextActive,
// // // //                   ]}
// // // //                 >
// // // //                   ⌂
// // // //                 </Text>
// // // //               </View>

// // // //               <Text
// // // //                 style={[
// // // //                   styles.bottomNavText,
// // // //                   activeTab === "home" &&
// // // //                     styles.bottomNavTextActive,
// // // //                 ]}
// // // //               >
// // // //                 Home
// // // //               </Text>
// // // //             </TouchableOpacity>

// // // //             <TouchableOpacity
// // // //               activeOpacity={0.8}
// // // //               onPress={() =>
// // // //                 handleTabPress("rankings")
// // // //               }
// // // //               style={styles.bottomNavItem}
// // // //             >
// // // //               <View
// // // //                 style={[
// // // //                   styles.bottomNavIcon,
// // // //                   activeTab === "rankings" &&
// // // //                     styles.bottomNavIconActive,
// // // //                 ]}
// // // //               >
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.bottomNavIconText,
// // // //                     activeTab === "rankings" &&
// // // //                       styles.bottomNavIconTextActive,
// // // //                   ]}
// // // //                 >
// // // //                   ♜
// // // //                 </Text>
// // // //               </View>

// // // //               <Text
// // // //                 style={[
// // // //                   styles.bottomNavText,
// // // //                   activeTab === "rankings" &&
// // // //                     styles.bottomNavTextActive,
// // // //                 ]}
// // // //               >
// // // //                 Rankings
// // // //               </Text>
// // // //             </TouchableOpacity>

// // // //             <TouchableOpacity
// // // //               activeOpacity={0.8}
// // // //               onPress={() =>
// // // //                 handleTabPress("profile")
// // // //               }
// // // //               style={styles.bottomNavItem}
// // // //             >
// // // //               <View
// // // //                 style={[
// // // //                   styles.bottomNavIcon,
// // // //                   activeTab === "profile" &&
// // // //                     styles.bottomNavIconActive,
// // // //                 ]}
// // // //               >
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.bottomNavIconText,
// // // //                     activeTab === "profile" &&
// // // //                       styles.bottomNavIconTextActive,
// // // //                   ]}
// // // //                 >
// // // //                   ♟
// // // //                 </Text>
// // // //               </View>

// // // //               <Text
// // // //                 style={[
// // // //                   styles.bottomNavText,
// // // //                   activeTab === "profile" &&
// // // //                     styles.bottomNavTextActive,
// // // //                 ]}
// // // //               >
// // // //                 Profile
// // // //               </Text>
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //         )}
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   // ==========================================================
// // // //   // SCREEN
// // // //   // ==========================================================

// // // //   screen: {
// // // //     flex: 1,
// // // //     flexDirection: "row",
// // // //     backgroundColor: COLORS.background,
// // // //     minHeight: "100%",
// // // //   },

// // // //   // ==========================================================
// // // //   // SIDEBAR
// // // //   // ==========================================================

// // // //   sidebar: {
// // // //     width: 380,
// // // //     backgroundColor: COLORS.white,
// // // //     borderRightWidth: 1,
// // // //     borderRightColor: COLORS.border,
// // // //     paddingHorizontal: 24,
// // // //     paddingTop: 20,
// // // //     paddingBottom: 20,
// // // //     justifyContent: "space-between",
// // // //   },

// // // //   sidebarTablet: {
// // // //     width: 92,
// // // //     paddingHorizontal: 12,
// // // //     alignItems: "center",
// // // //   },

// // // //   brandArea: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 14,
// // // //   },

// // // //   logo: {
// // // //     width: 82,
// // // //     height: 82,
// // // //     borderRadius: 23,
// // // //     backgroundColor: COLORS.navy,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     transform: [{ rotate: "-4deg" }],
// // // //   },

// // // //   logoText: {
// // // //     color: "#FFCC45",
// // // //     fontSize: 24,
// // // //     fontWeight: "900",
// // // //   },

// // // //   brandTextArea: {
// // // //     flex: 1,
// // // //   },

// // // //   brandTitle: {
// // // //     color: COLORS.navy,
// // // //     fontSize: 23,
// // // //     fontWeight: "900",
// // // //   },

// // // //   brandCoral: {
// // // //     color: COLORS.coral,
// // // //   },

// // // //   brandSubtitle: {
// // // //     marginTop: 3,
// // // //     color: COLORS.muted,
// // // //     fontSize: 13,
// // // //     fontWeight: "500",
// // // //   },

// // // //   sideNavigation: {
// // // //     flex: 1,
// // // //     marginTop: 65,
// // // //   },

// // // //   sideNavItem: {
// // // //     minHeight: 64,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     paddingHorizontal: 14,
// // // //     borderRadius: 16,
// // // //     marginBottom: 10,
// // // //     gap: 14,
// // // //   },

// // // //   sideNavItemActive: {
// // // //     backgroundColor: "#F0EDFF",
// // // //   },

// // // //   sideNavIcon: {
// // // //     width: 46,
// // // //     height: 46,
// // // //     borderRadius: 14,
// // // //     backgroundColor: "#F6F2EC",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   sideNavIconActive: {
// // // //     backgroundColor: COLORS.purple,
// // // //   },

// // // //   sideNavIconText: {
// // // //     color: COLORS.navy,
// // // //     fontSize: 23,
// // // //     fontWeight: "700",
// // // //   },

// // // //   sideNavIconTextActive: {
// // // //     color: COLORS.white,
// // // //   },

// // // //   sideNavText: {
// // // //     color: COLORS.navy,
// // // //     fontSize: 17,
// // // //     fontWeight: "700",
// // // //   },

// // // //   sideNavTextActive: {
// // // //     color: COLORS.purple,
// // // //   },

// // // //   challengeCard: {
// // // //     backgroundColor: COLORS.navy,
// // // //     borderRadius: 24,
// // // //     padding: 24,
// // // //     minHeight: 200,
// // // //   },

// // // //   challengeIcon: {
// // // //     width: 56,
// // // //     height: 56,
// // // //     borderRadius: 16,
// // // //     backgroundColor: COLORS.coral,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginBottom: 20,
// // // //   },

// // // //   challengeIconText: {
// // // //     color: COLORS.white,
// // // //     fontSize: 28,
// // // //     fontWeight: "900",
// // // //   },

// // // //   challengeTitle: {
// // // //     color: COLORS.white,
// // // //     fontSize: 16,
// // // //     fontWeight: "900",
// // // //     marginBottom: 8,
// // // //   },

// // // //   challengeDescription: {
// // // //     color: "#D7DDEA",
// // // //     fontSize: 13,
// // // //     lineHeight: 20,
// // // //   },

// // // //   // ==========================================================
// // // //   // MAIN
// // // //   // ==========================================================

// // // //   main: {
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //     backgroundColor: COLORS.background,
// // // //   },

// // // //   // ==========================================================
// // // //   // HEADER
// // // //   // ==========================================================

// // // //   header: {
// // // //     minHeight: 100,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: COLORS.border,
// // // //     backgroundColor: COLORS.background,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     paddingHorizontal: 42,
// // // //     paddingVertical: 12,
// // // //   },

// // // //   headerMobile: {
// // // //     minHeight: 72,
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 8,
// // // //   },

// // // //   headerTablet: {
// // // //     paddingHorizontal: 24,
// // // //   },

// // // //   backButton: {
// // // //     width: 56,
// // // //     height: 56,
// // // //     borderRadius: 17,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     backgroundColor: COLORS.white,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   backButtonMobile: {
// // // //     width: 46,
// // // //     height: 46,
// // // //     borderRadius: 14,
// // // //   },

// // // //   backIcon: {
// // // //     color: COLORS.navy,
// // // //     fontSize: 27,
// // // //     fontWeight: "500",
// // // //     marginTop: -2,
// // // //   },

// // // //   headerTitleArea: {
// // // //     flex: 1,
// // // //     marginLeft: 22,
// // // //   },

// // // //   headerTitle: {
// // // //     color: COLORS.navy,
// // // //     fontSize: 26,
// // // //     fontWeight: "900",
// // // //   },

// // // //   headerTitleMobile: {
// // // //     fontSize: 19,
// // // //   },

// // // //   headerSubtitle: {
// // // //     color: COLORS.muted,
// // // //     fontSize: 14,
// // // //     marginTop: 3,
// // // //   },

// // // //   headerLogo: {
// // // //     width: 58,
// // // //     height: 58,
// // // //     borderRadius: 18,
// // // //     backgroundColor: COLORS.navy,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   headerLogoText: {
// // // //     color: "#FFCC45",
// // // //     fontSize: 18,
// // // //     fontWeight: "900",
// // // //   },

// // // //   // ==========================================================
// // // //   // SCROLL
// // // //   // ==========================================================

// // // //   scroll: {
// // // //     flex: 1,
// // // //   },

// // // //   content: {
// // // //     width: "100%",
// // // //     maxWidth: 1280,
// // // //     alignSelf: "center",
// // // //     paddingHorizontal: 48,
// // // //     paddingTop: 40,
// // // //     paddingBottom: 90,
// // // //   },

// // // //   contentMobile: {
// // // //     paddingHorizontal: 16,
// // // //     paddingTop: 18,
// // // //     paddingBottom: 110,
// // // //   },

// // // //   contentTablet: {
// // // //     paddingHorizontal: 28,
// // // //     paddingTop: 28,
// // // //   },

// // // //   // ==========================================================
// // // //   // HERO
// // // //   // ==========================================================

// // // //   heroCard: {
// // // //     minHeight: 114,
// // // //     backgroundColor: COLORS.white,
// // // //     borderRadius: 24,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     paddingHorizontal: 24,
// // // //     paddingVertical: 20,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     marginBottom: 42,
// // // //   },

// // // //   heroCardMobile: {
// // // //     minHeight: 110,
// // // //     borderRadius: 18,
// // // //     paddingHorizontal: 14,
// // // //     paddingVertical: 14,
// // // //     marginBottom: 28,
// // // //   },

// // // //   heroLogo: {
// // // //     width: 68,
// // // //     height: 68,
// // // //     borderRadius: 20,
// // // //     backgroundColor: COLORS.navy,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 20,
// // // //   },

// // // //   heroLogoMobile: {
// // // //     width: 52,
// // // //     height: 52,
// // // //     borderRadius: 15,
// // // //     marginRight: 12,
// // // //   },

// // // //   heroLogoText: {
// // // //     color: "#FFCC45",
// // // //     fontSize: 20,
// // // //     fontWeight: "900",
// // // //   },

// // // //   heroTextArea: {
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //   },

// // // //   heroTitle: {
// // // //     color: COLORS.navy,
// // // //     fontSize: 21,
// // // //     fontWeight: "900",
// // // //   },

// // // //   heroTitleMobile: {
// // // //     fontSize: 17,
// // // //   },

// // // //   heroSubtitle: {
// // // //     color: COLORS.muted,
// // // //     fontSize: 14,
// // // //     marginTop: 6,
// // // //     lineHeight: 20,
// // // //   },

// // // //   heroSubtitleMobile: {
// // // //     fontSize: 12,
// // // //     lineHeight: 17,
// // // //   },

// // // //   privateBadge: {
// // // //     backgroundColor: COLORS.coralLight,
// // // //     paddingHorizontal: 15,
// // // //     paddingVertical: 10,
// // // //     borderRadius: 13,
// // // //     marginLeft: 14,
// // // //   },

// // // //   privateBadgeMobile: {
// // // //     paddingHorizontal: 10,
// // // //     paddingVertical: 8,
// // // //     borderRadius: 10,
// // // //   },

// // // //   privateBadgeText: {
// // // //     color: COLORS.coral,
// // // //     fontSize: 13,
// // // //     fontWeight: "900",
// // // //   },

// // // //   // ==========================================================
// // // //   // SECTION
// // // //   // ==========================================================

// // // //   section: {
// // // //     marginBottom: 38,
// // // //   },

// // // //   sectionHeaderRow: {
// // // //     flexDirection: "row",
// // // //     alignItems: "flex-end",
// // // //     justifyContent: "space-between",
// // // //     marginBottom: 14,
// // // //   },

// // // //   sectionTitle: {
// // // //     color: COLORS.navy,
// // // //     fontSize: 19,
// // // //     fontWeight: "900",
// // // //     marginBottom: 5,
// // // //   },

// // // //   sectionDescription: {
// // // //     color: COLORS.muted,
// // // //     fontSize: 13,
// // // //     lineHeight: 19,
// // // //   },

// // // //   playersCount: {
// // // //     color: COLORS.coral,
// // // //     fontSize: 14,
// // // //     fontWeight: "900",
// // // //   },

// // // //   // ==========================================================
// // // //   // GAME MODE
// // // //   // ==========================================================

// // // //   gameModeCard: {
// // // //     minHeight: 94,
// // // //     marginTop: 14,
// // // //     borderRadius: 20,
// // // //     borderWidth: 1.5,
// // // //     borderColor: COLORS.coral,
// // // //     backgroundColor: COLORS.white,
// // // //     paddingHorizontal: 18,
// // // //     paddingVertical: 15,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //   },

// // // //   gameModeIcon: {
// // // //     width: 58,
// // // //     height: 58,
// // // //     borderRadius: 17,
// // // //     backgroundColor: COLORS.coralLight,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 16,
// // // //   },

// // // //   gameModeIconText: {
// // // //     color: COLORS.blue,
// // // //     fontSize: 29,
// // // //     fontWeight: "900",
// // // //   },

// // // //   gameModeContent: {
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //   },

// // // //   gameModeTitle: {
// // // //     color: COLORS.navy,
// // // //     fontSize: 16,
// // // //     fontWeight: "900",
// // // //   },

// // // //   gameModeDescription: {
// // // //     color: COLORS.muted,
// // // //     fontSize: 13,
// // // //     marginTop: 5,
// // // //   },

// // // //   selectedCircle: {
// // // //     width: 38,
// // // //     height: 38,
// // // //     borderRadius: 19,
// // // //     backgroundColor: COLORS.coral,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginLeft: 12,
// // // //   },

// // // //   selectedCheck: {
// // // //     color: COLORS.white,
// // // //     fontSize: 21,
// // // //     fontWeight: "900",
// // // //   },

// // // //   // ==========================================================
// // // //   // PLAYERS
// // // //   // ==========================================================

// // // //   playersCard: {
// // // //     minHeight: 92,
// // // //     borderRadius: 20,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     backgroundColor: COLORS.white,
// // // //     paddingHorizontal: 16,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "space-between",
// // // //     marginTop: 14,
// // // //   },

// // // //   playersCardMobile: {
// // // //     minHeight: 82,
// // // //     paddingHorizontal: 10,
// // // //   },

// // // //   counterButton: {
// // // //     width: 56,
// // // //     height: 56,
// // // //     borderRadius: 16,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     backgroundColor: "#FCFAF7",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   counterButtonDisabled: {
// // // //     opacity: 0.4,
// // // //   },

// // // //   counterText: {
// // // //     color: COLORS.navy,
// // // //     fontSize: 27,
// // // //     fontWeight: "500",
// // // //     marginTop: -3,
// // // //   },

// // // //   counterTextDisabled: {
// // // //     color: COLORS.muted,
// // // //   },

// // // //   playerAvatars: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     flex: 1,
// // // //   },

// // // //   avatar: {
// // // //     width: 50,
// // // //     height: 50,
// // // //     borderRadius: 25,
// // // //     borderWidth: 3,
// // // //     borderColor: COLORS.white,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginHorizontal: -3,
// // // //   },

// // // //   avatarText: {
// // // //     color: COLORS.white,
// // // //     fontSize: 19,
// // // //     fontWeight: "900",
// // // //   },

// // // //   // ==========================================================
// // // //   // ACCESS
// // // //   // ==========================================================

// // // //   accessRow: {
// // // //     flexDirection: "row",
// // // //     gap: 14,
// // // //     marginTop: 14,
// // // //   },

// // // //   accessRowMobile: {
// // // //     flexDirection: "column",
// // // //     gap: 10,
// // // //   },

// // // //   accessCard: {
// // // //     flex: 1,
// // // //     minHeight: 102,
// // // //     borderRadius: 20,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     backgroundColor: COLORS.white,
// // // //     padding: 17,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //   },

// // // //   accessCardPublicSelected: {
// // // //     borderColor: COLORS.blue,
// // // //     borderWidth: 1.5,
// // // //   },

// // // //   accessCardPrivateSelected: {
// // // //     borderColor: COLORS.coral,
// // // //     borderWidth: 1.5,
// // // //   },

// // // //   accessIcon: {
// // // //     width: 52,
// // // //     height: 52,
// // // //     borderRadius: 16,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 14,
// // // //   },

// // // //   accessIconText: {
// // // //     fontSize: 22,
// // // //     fontWeight: "900",
// // // //   },

// // // //   accessContent: {
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //   },

// // // //   accessTitle: {
// // // //     color: COLORS.navy,
// // // //     fontSize: 15,
// // // //     fontWeight: "900",
// // // //   },

// // // //   accessDescription: {
// // // //     color: COLORS.muted,
// // // //     fontSize: 12,
// // // //     lineHeight: 17,
// // // //     marginTop: 4,
// // // //   },

// // // //   smallCheck: {
// // // //     width: 28,
// // // //     height: 28,
// // // //     borderRadius: 14,
// // // //     backgroundColor: COLORS.blue,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginLeft: 8,
// // // //   },

// // // //   smallCheckText: {
// // // //     color: COLORS.white,
// // // //     fontSize: 15,
// // // //     fontWeight: "900",
// // // //   },

// // // //   // ==========================================================
// // // //   // DIFFICULTY
// // // //   // ==========================================================

// // // //   difficultyGrid: {
// // // //     flexDirection: "row",
// // // //     gap: 14,
// // // //     marginTop: 14,
// // // //   },

// // // //   difficultyGridMobile: {
// // // //     flexDirection: "column",
// // // //     gap: 10,
// // // //   },

// // // //   difficultyCard: {
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //     minHeight: 104,
// // // //     borderRadius: 20,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     backgroundColor: COLORS.white,
// // // //     paddingHorizontal: 17,
// // // //     paddingVertical: 16,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //   },

// // // //   difficultyCardMobile: {
// // // //     width: "100%",
// // // //     minHeight: 84,
// // // //   },

// // // //   difficultyDot: {
// // // //     width: 13,
// // // //     height: 13,
// // // //     borderRadius: 7,
// // // //     marginRight: 13,
// // // //   },

// // // //   difficultyContent: {
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //   },

// // // //   difficultyTitle: {
// // // //     color: COLORS.navy,
// // // //     fontSize: 15,
// // // //     fontWeight: "900",
// // // //   },

// // // //   difficultyDescription: {
// // // //     color: COLORS.muted,
// // // //     fontSize: 11,
// // // //     marginTop: 4,
// // // //     lineHeight: 16,
// // // //   },

// // // //   difficultyCheck: {
// // // //     width: 30,
// // // //     height: 30,
// // // //     borderRadius: 15,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginLeft: 8,
// // // //   },

// // // //   difficultyCheckText: {
// // // //     color: COLORS.white,
// // // //     fontSize: 16,
// // // //     fontWeight: "900",
// // // //   },

// // // //   // ==========================================================
// // // //   // SETTINGS
// // // //   // ==========================================================

// // // //   settingsCard: {
// // // //     marginTop: 14,
// // // //     borderRadius: 20,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     backgroundColor: COLORS.white,
// // // //     paddingHorizontal: 18,
// // // //     paddingVertical: 5,
// // // //   },

// // // //   settingRow: {
// // // //     minHeight: 100,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "space-between",
// // // //     gap: 18,
// // // //   },

// // // //   settingInfo: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //   },

// // // //   settingIcon: {
// // // //     width: 48,
// // // //     height: 48,
// // // //     borderRadius: 15,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 14,
// // // //   },

// // // //   settingIconText: {
// // // //     fontSize: 23,
// // // //     fontWeight: "900",
// // // //   },

// // // //   settingText: {
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //   },

// // // //   settingTitle: {
// // // //     color: COLORS.navy,
// // // //     fontSize: 15,
// // // //     fontWeight: "900",
// // // //   },

// // // //   settingDescription: {
// // // //     color: COLORS.muted,
// // // //     fontSize: 12,
// // // //     marginTop: 4,
// // // //   },

// // // //   optionGroup: {
// // // //     flexDirection: "row",
// // // //     gap: 7,
// // // //   },

// // // //   optionGroupMobile: {
// // // //     gap: 5,
// // // //   },

// // // //   optionButton: {
// // // //     minWidth: 48,
// // // //     height: 40,
// // // //     paddingHorizontal: 10,
// // // //     borderRadius: 11,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     backgroundColor: "#FCFAF7",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   optionButtonSelected: {
// // // //     backgroundColor: COLORS.navy,
// // // //     borderColor: COLORS.navy,
// // // //   },

// // // //   optionText: {
// // // //     color: COLORS.muted,
// // // //     fontSize: 12,
// // // //     fontWeight: "800",
// // // //   },

// // // //   optionTextSelected: {
// // // //     color: COLORS.white,
// // // //   },

// // // //   settingDivider: {
// // // //     height: 1,
// // // //     backgroundColor: COLORS.softBorder,
// // // //   },

// // // //   // ==========================================================
// // // //   // INPUT
// // // //   // ==========================================================

// // // //   inputWrapper: {
// // // //     height: 62,
// // // //     borderRadius: 17,
// // // //     borderWidth: 1,
// // // //     borderColor: COLORS.border,
// // // //     backgroundColor: COLORS.white,
// // // //     marginTop: 14,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     paddingHorizontal: 16,
// // // //   },

// // // //   inputWrapperMobile: {
// // // //     height: 56,
// // // //     borderRadius: 15,
// // // //     paddingHorizontal: 13,
// // // //   },

// // // //   input: {
// // // //     flex: 1,
// // // //     minWidth: 0,
// // // //     color: COLORS.navy,
// // // //     fontSize: 14,
// // // //     fontWeight: "600",
// // // //     outlineStyle: "none",
// // // //   } as any,

// // // //   inputMobile: {
// // // //     fontSize: 13,
// // // //   },

// // // //   characterCount: {
// // // //     color: COLORS.muted,
// // // //     fontSize: 11,
// // // //     marginLeft: 8,
// // // //   },

// // // //   // ==========================================================
// // // //   // CREATE BUTTON
// // // //   // ==========================================================

// // // //   createButton: {
// // // //     minHeight: 68,
// // // //     borderRadius: 18,
// // // //     backgroundColor: COLORS.coral,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     paddingHorizontal: 18,
// // // //     marginTop: 2,
// // // //     shadowColor: COLORS.coral,
// // // //     shadowOpacity: 0.18,
// // // //     shadowRadius: 12,
// // // //     shadowOffset: {
// // // //       width: 0,
// // // //       height: 5,
// // // //     },
// // // //     elevation: 3,
// // // //   },

// // // //   createButtonMobile: {
// // // //     minHeight: 60,
// // // //     borderRadius: 15,
// // // //   },

// // // //   createButtonText: {
// // // //     color: COLORS.white,
// // // //     fontSize: 15,
// // // //     fontWeight: "900",
// // // //     letterSpacing: 0.5,
// // // //   },

// // // //   createButtonArrow: {
// // // //     width: 36,
// // // //     height: 36,
// // // //     borderRadius: 12,
// // // //     backgroundColor: "rgba(255,255,255,0.20)",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginLeft: 12,
// // // //   },

// // // //   createButtonArrowText: {
// // // //     color: COLORS.white,
// // // //     fontSize: 21,
// // // //     fontWeight: "800",
// // // //   },

// // // //   bottomHint: {
// // // //     textAlign: "center",
// // // //     color: COLORS.muted,
// // // //     fontSize: 11,
// // // //     marginTop: 14,
// // // //   },

// // // //   // ==========================================================
// // // //   // MOBILE BOTTOM NAV
// // // //   // ==========================================================

// // // //   bottomNavigation: {
// // // //     position: "absolute",
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //     height: 76,
// // // //     backgroundColor: COLORS.white,
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: COLORS.border,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "space-around",
// // // //     paddingHorizontal: 8,
// // // //     paddingBottom: 4,
// // // //   },

// // // //   bottomNavItem: {
// // // //     flex: 1,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   bottomNavIcon: {
// // // //     width: 34,
// // // //     height: 34,
// // // //     borderRadius: 11,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     backgroundColor: "#F6F2EC",
// // // //   },

// // // //   bottomNavIconActive: {
// // // //     backgroundColor: COLORS.purple,
// // // //   },

// // // //   bottomNavIconText: {
// // // //     color: COLORS.navy,
// // // //     fontSize: 18,
// // // //     fontWeight: "800",
// // // //   },

// // // //   bottomNavIconTextActive: {
// // // //     color: COLORS.white,
// // // //   },

// // // //   bottomNavText: {
// // // //     color: COLORS.muted,
// // // //     fontSize: 10,
// // // //     fontWeight: "700",
// // // //     marginTop: 3,
// // // //   },

// // // //   bottomNavTextActive: {
// // // //     color: COLORS.purple,
// // // //   },
// // // // });
// // // import React, { useState } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   ScrollView,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   ActivityIndicator,
// // // } from "react-native";
// // // import { Ionicons } from "@expo/vector-icons";

// // // export type CreateRoomConfig = {
// // //   roomName: string;
// // //   roomType: "public" | "private";
// // //   numberOfPlayers: number;
// // //   difficulty: "easy" | "medium" | "hard";
// // //   rounds: number;
// // //   timePerRoundSec: number;
// // // };

// // // type CreateRoomScreenProps = {
// // //   onBack: () => void;
// // //   onCreateRoom: (config: CreateRoomConfig) => void | Promise<void>;
// // //   onJoinRoom?: (code: string) => void | Promise<void>;
// // //   // kept so App.tsx props still type-check (this screen has no tab bar)
// // //   onTabHome?: () => void;
// // //   onTabLeaderboard?: () => void;
// // //   onTabProfile?: () => void;
// // // };

// // // const C = {
// // //   bg: "#FFF9F0",
// // //   ink: "#172033",
// // //   muted: "#7B8491",
// // //   indigo: "#5146E5",
// // //   coral: "#FF6B5A",
// // //   border: "#EEE7DD",
// // //   green: "#21B47A",
// // //   yellow: "#F4B942",
// // // };

// // // const DIFFICULTIES = [
// // //   { id: "easy" as const, label: "Easy", color: C.green },
// // //   { id: "medium" as const, label: "Medium", color: C.yellow },
// // //   { id: "hard" as const, label: "Hard", color: C.coral },
// // // ];

// // // /* ---------- stepper ---------- */

// // // const Stepper: React.FC<{
// // //   value: number;
// // //   min: number;
// // //   max: number;
// // //   step?: number;
// // //   unit?: string;
// // //   onChange: (n: number) => void;
// // // }> = ({ value, min, max, step = 1, unit, onChange }) => {
// // //   const canDec = value > min;
// // //   const canInc = value < max;

// // //   return (
// // //     <View style={s.stepRow}>
// // //       <TouchableOpacity
// // //         activeOpacity={0.8}
// // //         disabled={!canDec}
// // //         onPress={() => onChange(Math.max(min, value - step))}
// // //         style={[s.stepBtn, !canDec && s.stepBtnOff]}
// // //       >
// // //         <Ionicons name="remove" size={22} color={C.ink} />
// // //       </TouchableOpacity>

// // //       <View style={s.stepValueBox}>
// // //         <Text style={s.stepValue}>{value}</Text>
// // //         {unit ? <Text style={s.stepUnit}>{unit}</Text> : null}
// // //       </View>

// // //       <TouchableOpacity
// // //         activeOpacity={0.8}
// // //         disabled={!canInc}
// // //         onPress={() => onChange(Math.min(max, value + step))}
// // //         style={[s.stepBtn, !canInc && s.stepBtnOff]}
// // //       >
// // //         <Ionicons name="add" size={22} color={C.ink} />
// // //       </TouchableOpacity>
// // //     </View>
// // //   );
// // // };

// // // /* ---------- screen ---------- */

// // // export default function CreateRoomScreen({
// // //   onBack,
// // //   onCreateRoom,
// // // }: CreateRoomScreenProps) {
// // //   const [roomName, setRoomName] = useState("");
// // //   const [rounds, setRounds] = useState(5);
// // //   const [timePerRoundSec, setTimePerRoundSec] = useState(20);
// // //   const [numberOfPlayers, setNumberOfPlayers] = useState(4);
// // //   const [difficulty, setDifficulty] =
// // //     useState<"easy" | "medium" | "hard">("easy");
// // //   const [busy, setBusy] = useState(false);

// // //   const handleCreate = async () => {
// // //     if (busy) return;
// // //     setBusy(true);
// // //     try {
// // //       await onCreateRoom({
// // //         roomName: roomName.trim() || "Word Battle",
// // //         roomType: "private",
// // //         numberOfPlayers,
// // //         difficulty,
// // //         rounds,
// // //         timePerRoundSec,
// // //       });
// // //     } finally {
// // //       setBusy(false);
// // //     }
// // //   };

// // //   return (
// // //     <SafeAreaView style={s.safe}>
// // //       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

// // //       <View style={s.header}>
// // //         <TouchableOpacity onPress={onBack} style={s.backBtn} activeOpacity={0.8}>
// // //           <Ionicons name="arrow-back" size={20} color={C.ink} />
// // //         </TouchableOpacity>
// // //         <View style={s.headerText}>
// // //           <Text style={s.title}>Create Room</Text>
// // //           <Text style={s.subtitle}>Set up your game room</Text>
// // //         </View>
// // //         <View style={s.spacer} />
// // //       </View>

// // //       <ScrollView
// // //         contentContainerStyle={s.body}
// // //         keyboardShouldPersistTaps="handled"
// // //         showsVerticalScrollIndicator={false}
// // //       >
// // //         <View style={s.inner}>
// // //           {/* ROOM NAME */}
// // //           <View style={s.card}>
// // //             <Text style={s.label}>ROOM NAME</Text>
// // //             <View style={s.inputWrap}>
// // //               <TextInput
// // //                 value={roomName}
// // //                 onChangeText={setRoomName}
// // //                 placeholder="e.g. Kitty's Room"
// // //                 placeholderTextColor="#A0A6B2"
// // //                 maxLength={30}
// // //                 style={s.input}
// // //               />
// // //               <Text style={s.count}>{roomName.length}/30</Text>
// // //             </View>
// // //           </View>

// // //           {/* ROUNDS */}
// // //           <View style={s.card}>
// // //             <View style={s.labelRow}>
// // //               <Text style={s.label}>ROUNDS</Text>
// // //               <Text style={s.hint}>(1 - 10)</Text>
// // //             </View>
// // //             <Stepper value={rounds} min={1} max={10} onChange={setRounds} />
// // //           </View>

// // //           {/* TIMER */}
// // //           <View style={s.card}>
// // //             <View style={s.labelRow}>
// // //               <Text style={s.label}>TIMER (PER ROUND)</Text>
// // //               <Text style={s.hint}>(10 - 60 seconds)</Text>
// // //             </View>
// // //             <Stepper
// // //               value={timePerRoundSec}
// // //               min={10}
// // //               max={60}
// // //               step={5}
// // //               unit="sec"
// // //               onChange={setTimePerRoundSec}
// // //             />
// // //           </View>

// // //           {/* PLAYERS */}
// // //           <View style={s.card}>
// // //             <View style={s.labelRow}>
// // //               <Text style={s.label}>MAX PLAYERS</Text>
// // //               <Text style={s.hint}>(2 - 8)</Text>
// // //             </View>
// // //             <Stepper
// // //               value={numberOfPlayers}
// // //               min={2}
// // //               max={8}
// // //               onChange={setNumberOfPlayers}
// // //             />
// // //           </View>

// // //           {/* DIFFICULTY */}
// // //           <View style={s.card}>
// // //             <Text style={s.label}>CHALLENGE LEVEL</Text>
// // //             <View style={s.pills}>
// // //               {DIFFICULTIES.map((d) => {
// // //                 const on = difficulty === d.id;
// // //                 return (
// // //                   <TouchableOpacity
// // //                     key={d.id}
// // //                     activeOpacity={0.85}
// // //                     onPress={() => setDifficulty(d.id)}
// // //                     style={[
// // //                       s.pill,
// // //                       on && { borderColor: d.color, backgroundColor: d.color },
// // //                     ]}
// // //                   >
// // //                     <Text style={[s.pillText, on && { color: "#FFF" }]}>
// // //                       {d.label}
// // //                     </Text>
// // //                   </TouchableOpacity>
// // //                 );
// // //               })}
// // //             </View>
// // //           </View>

// // //           {/* CREATE */}
// // //           <TouchableOpacity
// // //             activeOpacity={0.88}
// // //             onPress={handleCreate}
// // //             disabled={busy}
// // //             style={s.createBtn}
// // //           >
// // //             {busy ? (
// // //               <ActivityIndicator color="#FFF" />
// // //             ) : (
// // //               <>
// // //                 <Ionicons name="play" size={18} color="#FFF" />
// // //                 <Text style={s.createText}>CREATE ROOM</Text>
// // //               </>
// // //             )}
// // //           </TouchableOpacity>

// // //           <Text style={s.footer}>
// // //             You can change the room settings before the game starts.
// // //           </Text>
// // //         </View>
// // //       </ScrollView>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // /* ---------- styles ---------- */

// // // const s = StyleSheet.create({
// // //   safe: { flex: 1, backgroundColor: C.bg },
// // //   header: {
// // //     height: 72,
// // //     paddingHorizontal: 16,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //   },
// // //   backBtn: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: "#FFF",
// // //     borderWidth: 1,
// // //     borderColor: C.border,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },
// // //   spacer: { width: 40, height: 40 },
// // //   headerText: { flex: 1, alignItems: "center" },
// // //   title: { color: C.ink, fontSize: 20, fontWeight: "900" },
// // //   subtitle: { color: C.muted, fontSize: 12.5, marginTop: 2 },

// // //   body: { flexGrow: 1, alignItems: "center", padding: 16, paddingBottom: 40 },
// // //   inner: { width: "100%", maxWidth: 440 },

// // //   card: {
// // //     backgroundColor: "#FFF",
// // //     borderRadius: 20,
// // //     borderWidth: 1,
// // //     borderColor: C.border,
// // //     padding: 16,
// // //     marginBottom: 14,
// // //   },
// // //   label: {
// // //     color: C.muted,
// // //     fontSize: 11,
// // //     fontWeight: "800",
// // //     letterSpacing: 1,
// // //   },
// // //   labelRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //     marginBottom: 12,
// // //   },
// // //   hint: { color: "#A0A6B2", fontSize: 11.5, fontWeight: "600" },

// // //   inputWrap: {
// // //     marginTop: 10,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     height: 50,
// // //     backgroundColor: "#F8F5EF",
// // //     borderRadius: 14,
// // //     borderWidth: 1,
// // //     borderColor: C.border,
// // //     paddingHorizontal: 14,
// // //   },
// // //   input: {
// // //     flex: 1,
// // //     minWidth: 0,
// // //     color: C.ink,
// // //     fontSize: 15,
// // //     fontWeight: "700",
// // //   },
// // //   count: { color: C.muted, fontSize: 11, marginLeft: 8 },

// // //   stepRow: { flexDirection: "row", alignItems: "center" },
// // //   stepBtn: {
// // //     width: 48,
// // //     height: 48,
// // //     borderRadius: 14,
// // //     backgroundColor: "#F8F5EF",
// // //     borderWidth: 1,
// // //     borderColor: C.border,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },
// // //   stepBtnOff: { opacity: 0.4 },
// // //   stepValueBox: {
// // //     flex: 1,
// // //     flexDirection: "row",
// // //     alignItems: "baseline",
// // //     justifyContent: "center",
// // //     gap: 6,
// // //   },
// // //   stepValue: { color: C.ink, fontSize: 28, fontWeight: "900" },
// // //   stepUnit: { color: C.muted, fontSize: 13, fontWeight: "700" },

// // //   pills: { flexDirection: "row", gap: 8, marginTop: 12 },
// // //   pill: {
// // //     flex: 1,
// // //     height: 44,
// // //     borderRadius: 13,
// // //     borderWidth: 1.5,
// // //     borderColor: C.border,
// // //     backgroundColor: "#F8F5EF",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },
// // //   pillText: { color: C.ink, fontSize: 13, fontWeight: "800" },

// // //   createBtn: {
// // //     marginTop: 6,
// // //     height: 56,
// // //     borderRadius: 16,
// // //     backgroundColor: C.coral,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     gap: 10,
// // //   },
// // //   createText: {
// // //     color: "#FFF",
// // //     fontSize: 15,
// // //     fontWeight: "900",
// // //     letterSpacing: 0.8,
// // //   },
// // //   footer: {
// // //     textAlign: "center",
// // //     color: C.muted,
// // //     fontSize: 11.5,
// // //     marginTop: 14,
// // //   },
// // // });
// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   StyleSheet,
// //   ScrollView,
// //   SafeAreaView,
// //   StatusBar,
// //   ActivityIndicator,
// // } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";

// // export type CreateRoomConfig = {
// //   roomName: string;
// //   roomType: "public" | "private";
// //   numberOfPlayers: number;
// //   difficulty: "easy" | "medium" | "hard";
// //   rounds: number;
// //   timePerRoundSec: number;
// // };

// // type CreateRoomScreenProps = {
// //   onBack: () => void;
// //   onCreateRoom: (config: CreateRoomConfig) => void | Promise<void>;
// //   onJoinRoom?: (code: string) => void | Promise<void>;
// //   // kept so App.tsx props still type-check (this screen has no tab bar)
// //   onTabHome?: () => void;
// //   onTabLeaderboard?: () => void;
// //   onTabProfile?: () => void;
// // };

// // const C = {
// //   bg: "#FFF9F0",
// //   ink: "#172033",
// //   muted: "#7B8491",
// //   indigo: "#5146E5",
// //   coral: "#FF6B5A",
// //   border: "#EEE7DD",
// //   green: "#21B47A",
// //   yellow: "#F4B942",
// // };

// // const DIFFICULTIES = [
// //   { id: "easy" as const, label: "Easy", color: C.green },
// //   { id: "medium" as const, label: "Medium", color: C.yellow },
// //   { id: "hard" as const, label: "Hard", color: C.coral },
// // ];

// // /* ---------- stepper ---------- */

// // const Stepper: React.FC<{
// //   value: number;
// //   min: number;
// //   max: number;
// //   step?: number;
// //   unit?: string;
// //   onChange: (n: number) => void;
// // }> = ({ value, min, max, step = 1, unit, onChange }) => {
// //   const canDec = value > min;
// //   const canInc = value < max;

// //   return (
// //     <View style={s.stepRow}>
// //       <TouchableOpacity
// //         activeOpacity={0.8}
// //         disabled={!canDec}
// //         onPress={() => onChange(Math.max(min, value - step))}
// //         style={[s.stepBtn, !canDec && s.stepBtnOff]}
// //       >
// //         <Ionicons name="remove" size={22} color={C.ink} />
// //       </TouchableOpacity>

// //       <View style={s.stepValueBox}>
// //         <Text style={s.stepValue}>{value}</Text>
// //         {unit ? <Text style={s.stepUnit}>{unit}</Text> : null}
// //       </View>

// //       <TouchableOpacity
// //         activeOpacity={0.8}
// //         disabled={!canInc}
// //         onPress={() => onChange(Math.min(max, value + step))}
// //         style={[s.stepBtn, !canInc && s.stepBtnOff]}
// //       >
// //         <Ionicons name="add" size={22} color={C.ink} />
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // /* ---------- screen ---------- */

// // export default function CreateRoomScreen({
// //   onBack,
// //   onCreateRoom,
// // }: CreateRoomScreenProps) {
// //   const [roomName, setRoomName] = useState("");
// //   const [rounds, setRounds] = useState(5);
// //   const [timePerRoundSec, setTimePerRoundSec] = useState(20);
// //   const [numberOfPlayers, setNumberOfPlayers] = useState(4);
// //   const [difficulty, setDifficulty] =
// //     useState<"easy" | "medium" | "hard">("easy");
// //   const [busy, setBusy] = useState(false);

// //   const handleCreate = async () => {
// //     if (busy) return;
// //     setBusy(true);
// //     try {
// //       await onCreateRoom({
// //         roomName: roomName.trim() || "Word Battle",
// //         roomType: "private",
// //         numberOfPlayers,
// //         difficulty,
// //         rounds,
// //         timePerRoundSec,
// //       });
// //     } finally {
// //       setBusy(false);
// //     }
// //   };

// //   return (
// //     <SafeAreaView style={s.safe}>
// //       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

// //       <View style={s.header}>
// //         <TouchableOpacity onPress={onBack} style={s.backBtn} activeOpacity={0.8}>
// //           <Ionicons name="arrow-back" size={20} color={C.ink} />
// //         </TouchableOpacity>
// //         <View style={s.headerText}>
// //           <Text style={s.title}>Create Room</Text>
// //           <Text style={s.subtitle}>Set up your game room</Text>
// //         </View>
// //         <View style={s.spacer} />
// //       </View>

// //       <ScrollView
// //         contentContainerStyle={s.body}
// //         keyboardShouldPersistTaps="handled"
// //         showsVerticalScrollIndicator={false}
// //       >
// //         <View style={s.inner}>
// //           {/* ROOM NAME */}
// //           <View style={s.card}>
// //             <Text style={s.label}>ROOM NAME</Text>
// //             <View style={s.inputWrap}>
// //               <TextInput
// //                 value={roomName}
// //                 onChangeText={setRoomName}
// //                 placeholder="e.g. Kitty's Room"
// //                 placeholderTextColor="#A0A6B2"
// //                 maxLength={30}
// //                 style={s.input}
// //               />
// //               <Text style={s.count}>{roomName.length}/30</Text>
// //             </View>
// //           </View>

// //           {/* ROUNDS */}
// //           <View style={s.card}>
// //             <View style={s.labelRow}>
// //               <Text style={s.label}>ROUNDS</Text>
// //               <Text style={s.hint}>(1 - 10)</Text>
// //             </View>
// //             <Stepper value={rounds} min={1} max={10} onChange={setRounds} />
// //           </View>

// //           {/* TIMER */}
// //           <View style={s.card}>
// //             <View style={s.labelRow}>
// //               <Text style={s.label}>TIMER (PER ROUND)</Text>
// //               <Text style={s.hint}>(10 - 60 seconds)</Text>
// //             </View>
// //             <Stepper
// //               value={timePerRoundSec}
// //               min={10}
// //               max={60}
// //               step={5}
// //               unit="sec"
// //               onChange={setTimePerRoundSec}
// //             />
// //           </View>

// //           {/* PLAYERS */}
// //           <View style={s.card}>
// //             <View style={s.labelRow}>
// //               <Text style={s.label}>MAX PLAYERS</Text>
// //               <Text style={s.hint}>(2 - 8)</Text>
// //             </View>
// //             <Stepper
// //               value={numberOfPlayers}
// //               min={2}
// //               max={8}
// //               onChange={setNumberOfPlayers}
// //             />
// //           </View>

// //           {/* DIFFICULTY */}
// //           <View style={s.card}>
// //             <Text style={s.label}>CHALLENGE LEVEL</Text>
// //             <View style={s.pills}>
// //               {DIFFICULTIES.map((d) => {
// //                 const on = difficulty === d.id;
// //                 return (
// //                   <TouchableOpacity
// //                     key={d.id}
// //                     activeOpacity={0.85}
// //                     onPress={() => setDifficulty(d.id)}
// //                     style={[
// //                       s.pill,
// //                       on && { borderColor: d.color, backgroundColor: d.color },
// //                     ]}
// //                   >
// //                     <Text style={[s.pillText, on && { color: "#FFF" }]}>
// //                       {d.label}
// //                     </Text>
// //                   </TouchableOpacity>
// //                 );
// //               })}
// //             </View>
// //           </View>

// //           {/* CREATE */}
// //           <TouchableOpacity
// //             activeOpacity={0.88}
// //             onPress={handleCreate}
// //             disabled={busy}
// //             style={s.createBtn}
// //           >
// //             {busy ? (
// //               <ActivityIndicator color="#FFF" />
// //             ) : (
// //               <>
// //                 <Ionicons name="play" size={18} color="#FFF" />
// //                 <Text style={s.createText}>CREATE ROOM</Text>
// //               </>
// //             )}
// //           </TouchableOpacity>

// //           <Text style={s.footer}>
// //             You can change the room settings before the game starts.
// //           </Text>
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // }

// // /* ---------- styles ---------- */

// // const s = StyleSheet.create({
// //   safe: { flex: 1, backgroundColor: C.bg },
// //   header: {
// //     height: 72,
// //     paddingHorizontal: 16,
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },
// //   backBtn: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: "#FFF",
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   spacer: { width: 40, height: 40 },
// //   headerText: { flex: 1, alignItems: "center" },
// //   title: { color: C.ink, fontSize: 20, fontWeight: "900" },
// //   subtitle: { color: C.muted, fontSize: 12.5, marginTop: 2 },

// //   body: { flexGrow: 1, alignItems: "center", padding: 16, paddingBottom: 40 },
// //   inner: { width: "100%", maxWidth: 440 },

// //   card: {
// //     backgroundColor: "#FFF",
// //     borderRadius: 20,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     padding: 16,
// //     marginBottom: 14,
// //   },
// //   label: {
// //     color: C.muted,
// //     fontSize: 11,
// //     fontWeight: "800",
// //     letterSpacing: 1,
// //   },
// //   labelRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     marginBottom: 12,
// //   },
// //   hint: { color: "#A0A6B2", fontSize: 11.5, fontWeight: "600" },

// //   inputWrap: {
// //     marginTop: 10,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     height: 50,
// //     backgroundColor: "#F8F5EF",
// //     borderRadius: 14,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     paddingHorizontal: 14,
// //   },
// //   input: {
// //     flex: 1,
// //     minWidth: 0,
// //     color: C.ink,
// //     fontSize: 15,
// //     fontWeight: "700",
// //   },
// //   count: { color: C.muted, fontSize: 11, marginLeft: 8 },

// //   stepRow: { flexDirection: "row", alignItems: "center" },
// //   stepBtn: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 14,
// //     backgroundColor: "#F8F5EF",
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   stepBtnOff: { opacity: 0.4 },
// //   stepValueBox: {
// //     flex: 1,
// //     flexDirection: "row",
// //     alignItems: "baseline",
// //     justifyContent: "center",
// //     gap: 6,
// //   },
// //   stepValue: { color: C.ink, fontSize: 28, fontWeight: "900" },
// //   stepUnit: { color: C.muted, fontSize: 13, fontWeight: "700" },

// //   pills: { flexDirection: "row", gap: 8, marginTop: 12 },
// //   pill: {
// //     flex: 1,
// //     height: 44,
// //     borderRadius: 13,
// //     borderWidth: 1.5,
// //     borderColor: C.border,
// //     backgroundColor: "#F8F5EF",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   pillText: { color: C.ink, fontSize: 13, fontWeight: "800" },

// //   createBtn: {
// //     marginTop: 6,
// //     height: 56,
// //     borderRadius: 16,
// //     backgroundColor: C.coral,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 10,
// //   },
// //   createText: {
// //     color: "#FFF",
// //     fontSize: 15,
// //     fontWeight: "900",
// //     letterSpacing: 0.8,
// //   },
// //   footer: {
// //     textAlign: "center",
// //     color: C.muted,
// //     fontSize: 11.5,
// //     marginTop: 14,
// //   },
// // });
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import WordScrambleAnimatedBackground from "../components/WordScrambleAnimatedBackground";

// export type CreateRoomConfig = {
//   roomName: string;
//   roomType: "public" | "private";
//   numberOfPlayers: number;
//   difficulty: "easy" | "medium" | "hard";
//   rounds: number;
//   timePerRoundSec: number;
// };

// type CreateRoomScreenProps = {
//   onBack: () => void;
//   onCreateRoom: (config: CreateRoomConfig) => void | Promise<void>;
//   onJoinRoom?: (code: string) => void | Promise<void>;
//   // kept so App.tsx props still type-check (this screen has no tab bar)
//   onTabHome?: () => void;
//   onTabLeaderboard?: () => void;
//   onTabProfile?: () => void;
// };

// const C = {
//   bg: "#FFF9F0",
//   ink: "#172033",
//   muted: "#7B8491",
//   indigo: "#5146E5",
//   coral: "#FF6B5A",
//   border: "#EEE7DD",
//   green: "#21B47A",
//   yellow: "#F4B942",
// };

// const DIFFICULTIES = [
//   { id: "easy" as const, label: "Easy", color: C.green },
//   { id: "medium" as const, label: "Medium", color: C.yellow },
//   { id: "hard" as const, label: "Hard", color: C.coral },
// ];

// /* ---------- stepper ---------- */

// const Stepper: React.FC<{
//   value: number;
//   min: number;
//   max: number;
//   step?: number;
//   unit?: string;
//   onChange: (n: number) => void;
// }> = ({ value, min, max, step = 1, unit, onChange }) => {
//   const canDec = value > min;
//   const canInc = value < max;

//   return (
//     <View style={s.stepRow}>
//       <TouchableOpacity
//         activeOpacity={0.8}
//         disabled={!canDec}
//         onPress={() => onChange(Math.max(min, value - step))}
//         style={[s.stepBtn, !canDec && s.stepBtnOff]}
//       >
//         <Ionicons name="remove" size={22} color={C.ink} />
//       </TouchableOpacity>

//       <View style={s.stepValueBox}>
//         <Text style={s.stepValue}>{value}</Text>
//         {unit ? <Text style={s.stepUnit}>{unit}</Text> : null}
//       </View>

//       <TouchableOpacity
//         activeOpacity={0.8}
//         disabled={!canInc}
//         onPress={() => onChange(Math.min(max, value + step))}
//         style={[s.stepBtn, !canInc && s.stepBtnOff]}
//       >
//         <Ionicons name="add" size={22} color={C.ink} />
//       </TouchableOpacity>
//     </View>
//   );
// };

// /* ---------- screen ---------- */

// export default function CreateRoomScreen({
//   onBack,
//   onCreateRoom,
// }: CreateRoomScreenProps) {
//   const [roomName, setRoomName] = useState("");
//   const [rounds, setRounds] = useState(5);
//   const [timePerRoundSec, setTimePerRoundSec] = useState(20);
//   const [numberOfPlayers, setNumberOfPlayers] = useState(4);
//   const [difficulty, setDifficulty] =
//     useState<"easy" | "medium" | "hard">("easy");
//   const [busy, setBusy] = useState(false);

//   const handleCreate = async () => {
//     if (busy) return;
//     setBusy(true);
//     try {
//       await onCreateRoom({
//         roomName: roomName.trim() || "Word Battle",
//         roomType: "private",
//         numberOfPlayers,
//         difficulty,
//         rounds,
//         timePerRoundSec,
//       });
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <View style={s.root}>
//       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

//       {/* NEW: animated background - FIRST child, behind everything */}
//       <WordScrambleAnimatedBackground backgroundColor={C.bg} />

//       {/* CHANGED: transparent, so the animation shows through */}
//       <SafeAreaView style={s.safe}>
//         <View style={s.header}>
//           <TouchableOpacity onPress={onBack} style={s.backBtn} activeOpacity={0.8}>
//             <Ionicons name="arrow-back" size={20} color={C.ink} />
//           </TouchableOpacity>
//           <View style={s.headerText}>
//             <Text style={s.title}>Create Room</Text>
//             <Text style={s.subtitle}>Set up your game room</Text>
//           </View>
//           <View style={s.spacer} />
//         </View>

//         <ScrollView
//           contentContainerStyle={s.body}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={s.inner}>
//             {/* ROOM NAME */}
//             <View style={s.card}>
//               <Text style={s.label}>ROOM NAME</Text>
//               <View style={s.inputWrap}>
//                 <TextInput
//                   value={roomName}
//                   onChangeText={setRoomName}
//                   placeholder="e.g. Kitty's Room"
//                   placeholderTextColor="#A0A6B2"
//                   maxLength={30}
//                   style={s.input}
//                 />
//                 <Text style={s.count}>{roomName.length}/30</Text>
//               </View>
//             </View>

//             {/* ROUNDS */}
//             <View style={s.card}>
//               <View style={s.labelRow}>
//                 <Text style={s.label}>ROUNDS</Text>
//                 <Text style={s.hint}>(1 - 10)</Text>
//               </View>
//               <Stepper value={rounds} min={1} max={10} onChange={setRounds} />
//             </View>

//             {/* TIMER */}
//             <View style={s.card}>
//               <View style={s.labelRow}>
//                 <Text style={s.label}>TIMER (PER ROUND)</Text>
//                 <Text style={s.hint}>(10 - 60 seconds)</Text>
//               </View>
//               <Stepper
//                 value={timePerRoundSec}
//                 min={10}
//                 max={60}
//                 step={5}
//                 unit="sec"
//                 onChange={setTimePerRoundSec}
//               />
//             </View>

//             {/* PLAYERS */}
//             <View style={s.card}>
//               <View style={s.labelRow}>
//                 <Text style={s.label}>MAX PLAYERS</Text>
//                 <Text style={s.hint}>(2 - 8)</Text>
//               </View>
//               <Stepper
//                 value={numberOfPlayers}
//                 min={2}
//                 max={8}
//                 onChange={setNumberOfPlayers}
//               />
//             </View>

//             {/* DIFFICULTY */}
//             <View style={s.card}>
//               <Text style={s.label}>CHALLENGE LEVEL</Text>
//               <View style={s.pills}>
//                 {DIFFICULTIES.map((d) => {
//                   const on = difficulty === d.id;
//                   return (
//                     <TouchableOpacity
//                       key={d.id}
//                       activeOpacity={0.85}
//                       onPress={() => setDifficulty(d.id)}
//                       style={[
//                         s.pill,
//                         on && { borderColor: d.color, backgroundColor: d.color },
//                       ]}
//                     >
//                       <Text style={[s.pillText, on && { color: "#FFF" }]}>
//                         {d.label}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>
//             </View>

//             {/* CREATE */}
//             <TouchableOpacity
//               activeOpacity={0.88}
//               onPress={handleCreate}
//               disabled={busy}
//               style={s.createBtn}
//             >
//               {busy ? (
//                 <ActivityIndicator color="#FFF" />
//               ) : (
//                 <>
//                   <Ionicons name="play" size={18} color="#FFF" />
//                   <Text style={s.createText}>CREATE ROOM</Text>
//                 </>
//               )}
//             </TouchableOpacity>

//             <Text style={s.footer}>
//               You can change the room settings before the game starts.
//             </Text>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </View>
//   );
// }

// /* ---------- styles ---------- */

// const s = StyleSheet.create({
//   // NEW: root holds the solid colour + animated background
//   root: { flex: 1, backgroundColor: C.bg },
//   // CHANGED: transparent so the animated background is visible
//   safe: { flex: 1, backgroundColor: "transparent" },
//   header: {
//     height: 72,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#FFF",
//     borderWidth: 1,
//     borderColor: C.border,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   spacer: { width: 40, height: 40 },
//   headerText: { flex: 1, alignItems: "center" },
//   title: { color: C.ink, fontSize: 20, fontWeight: "900" },
//   subtitle: { color: C.muted, fontSize: 12.5, marginTop: 2 },

//   body: { flexGrow: 1, alignItems: "center", padding: 16, paddingBottom: 40 },
//   inner: { width: "100%", maxWidth: 440 },

//   card: {
//     backgroundColor: "#FFF",
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: C.border,
//     padding: 16,
//     marginBottom: 14,
//   },
//   label: {
//     color: C.muted,
//     fontSize: 11,
//     fontWeight: "800",
//     letterSpacing: 1,
//   },
//   labelRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   hint: { color: "#A0A6B2", fontSize: 11.5, fontWeight: "600" },

//   inputWrap: {
//     marginTop: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     height: 50,
//     backgroundColor: "#F8F5EF",
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: C.border,
//     paddingHorizontal: 14,
//   },
//   input: {
//     flex: 1,
//     minWidth: 0,
//     color: C.ink,
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   count: { color: C.muted, fontSize: 11, marginLeft: 8 },

//   stepRow: { flexDirection: "row", alignItems: "center" },
//   stepBtn: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     backgroundColor: "#F8F5EF",
//     borderWidth: 1,
//     borderColor: C.border,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   stepBtnOff: { opacity: 0.4 },
//   stepValueBox: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "baseline",
//     justifyContent: "center",
//     gap: 6,
//   },
//   stepValue: { color: C.ink, fontSize: 28, fontWeight: "900" },
//   stepUnit: { color: C.muted, fontSize: 13, fontWeight: "700" },

//   pills: { flexDirection: "row", gap: 8, marginTop: 12 },
//   pill: {
//     flex: 1,
//     height: 44,
//     borderRadius: 13,
//     borderWidth: 1.5,
//     borderColor: C.border,
//     backgroundColor: "#F8F5EF",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   pillText: { color: C.ink, fontSize: 13, fontWeight: "800" },

//   createBtn: {
//     marginTop: 6,
//     height: 56,
//     borderRadius: 16,
//     backgroundColor: C.coral,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//   },
//   createText: {
//     color: "#FFF",
//     fontSize: 15,
//     fontWeight: "900",
//     letterSpacing: 0.8,
//   },
//   footer: {
//     textAlign: "center",
//     color: C.muted,
//     fontSize: 11.5,
//     marginTop: 14,
//   },
// });
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type CreateRoomConfig = {
  roomName: string;
  roomType: "public" | "private";
  numberOfPlayers: number;
  rounds: number;
  // removed from this screen (backend uses its default). Optional so old code still compiles.
  difficulty?: "easy" | "medium" | "hard";
  timePerRoundSec?: number;
};

type CreateRoomScreenProps = {
  onBack: () => void;
  onCreateRoom: (config: CreateRoomConfig) => void | Promise<void>;
  onJoinRoom?: (code: string) => void | Promise<void>;
  onTabHome?: () => void;
  onTabLeaderboard?: () => void;
  onTabProfile?: () => void;
};

/* ---------- limits (change here) ---------- */
const MIN_ROUNDS = 1;
const MAX_ROUNDS = 50;
const ROUND_PRESETS = [5, 10, 20, 30, 50];
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 8;
const NAME_MAX = 30;

/* ---------- theme (same as Word Scramble home) ---------- */
const T = {
  bg: "#EAF8F2",
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
  danger: "#E5484D",
};

/* ============================================================
   ANIMATION HELPERS
============================================================ */

const Idle: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  kind?: "bob" | "sway";
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

  const transform: any[] =
    kind === "bob"
      ? [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -amount] }) }]
      : [
          {
            rotate: v.interpolate({
              inputRange: [0, 1],
              outputRange: [`${-amount}deg`, `${amount}deg`],
            }),
          },
        ];

  return <Animated.View style={[style, { transform }]}>{children}</Animated.View>;
};

const PressScale: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ children, onPress, disabled, style }) => {
  const s = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={[{ transform: [{ scale: s }] }, style]}>
      <Pressable
        disabled={disabled}
        onPress={onPress}
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

/** Little shake used when a field is invalid. */
function useShake() {
  const x = useRef(new Animated.Value(0)).current;
  const shake = () => {
    x.setValue(0);
    Animated.sequence([
      Animated.timing(x, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(x, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(x, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(x, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };
  return { x, shake };
}

/* ============================================================
   BACKGROUND: rings + floating letter tiles
============================================================ */

const Ring: React.FC<{ cx: number; cy: number; size: number; color: string; opacity: number }> = ({
  cx,
  cy,
  size,
  color,
  opacity,
}) => (
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

const FLOATERS = [
  { ch: "W", left: "6%", top: 110, color: T.teal, delay: 0 },
  { ch: "O", left: "82%", top: 170, color: T.tangerine, delay: 300 },
  { ch: "R", left: "10%", top: 420, color: T.ink, delay: 600 },
  { ch: "D", left: "86%", top: 520, color: T.teal, delay: 900 },
  { ch: "S", left: "74%", top: 760, color: T.tangerine, delay: 450 },
  { ch: "Q", left: "4%", top: 700, color: T.ink, delay: 750 },
] as const;

const Background: React.FC = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Ring cx={330} cy={90} size={150} color={T.teal} opacity={0.2} />
    <Ring cx={330} cy={90} size={250} color={T.teal} opacity={0.13} />
    <Ring cx={20} cy={640} size={190} color={T.tangerine} opacity={0.2} />
    <Ring cx={20} cy={640} size={300} color={T.tangerine} opacity={0.12} />

    {FLOATERS.map((f) => (
      <Idle
        key={f.ch + f.top}
        kind="bob"
        amount={10}
        duration={2200}
        delay={f.delay}
        style={{ position: "absolute", left: f.left as any, top: f.top, opacity: 0.55 }}
      >
        <View style={s.floatTile}>
          <Text style={[s.floatChar, { color: f.color }]}>{f.ch}</Text>
        </View>
      </Idle>
    ))}
  </View>
);

/* ============================================================
   STEPPER (value can be null = not selected yet)
============================================================ */

const Stepper: React.FC<{
  value: number | null;
  min: number;
  max: number;
  onChange: (n: number) => void;
}> = ({ value, min, max, onChange }) => {
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (value === null) return;
    pop.setValue(0.8);
    Animated.spring(pop, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }).start();
  }, [value, pop]);

  const canDec = value !== null && value > min;
  const canInc = value === null || value < max;

  return (
    <View style={s.stepRow}>
      <PressScale
        disabled={!canDec}
        onPress={() => value !== null && onChange(Math.max(min, value - 1))}
      >
        <View style={[s.stepBtn, !canDec && s.stepBtnOff]}>
          <Ionicons name="remove" size={22} color={T.ink} />
        </View>
      </PressScale>

      <Animated.View style={[s.stepValueBox, { transform: [{ scale: pop }] }]}>
        <Text style={[s.stepValue, value === null && s.stepValueEmpty]}>
          {value === null ? "—" : value}
        </Text>
      </Animated.View>

      <PressScale
        disabled={!canInc}
        onPress={() => onChange(value === null ? min : Math.min(max, value + 1))}
      >
        <View style={[s.stepBtn, !canInc && s.stepBtnOff]}>
          <Ionicons name="add" size={22} color={T.ink} />
        </View>
      </PressScale>
    </View>
  );
};

/* ============================================================
   SCREEN
============================================================ */

export default function CreateRoomScreen({ onBack, onCreateRoom }: CreateRoomScreenProps) {
  const [roomName, setRoomName] = useState("");
  const [rounds, setRounds] = useState<number | null>(null); // compulsory: starts empty
  const [numberOfPlayers, setNumberOfPlayers] = useState(4);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);

  const nameShake = useShake();
  const roundsShake = useShake();

  // staggered entrance: header, name, rounds, players, button
  const enters = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(
      110,
      enters.map((e) =>
        Animated.timing(e, {
          toValue: 1,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    ).start();
  }, [enters]);

  const rise = (i: number) => ({
    opacity: enters[i],
    transform: [{ translateY: enters[i].interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }],
  });

  const trimmedName = roomName.trim();
  const nameError = trimmedName.length === 0 ? "Room name is required" : "";
  const roundsError =
    rounds === null
      ? "Please select number of rounds"
      : rounds < MIN_ROUNDS || rounds > MAX_ROUNDS
      ? `Rounds must be ${MIN_ROUNDS} - ${MAX_ROUNDS}`
      : "";

  const handleCreate = async () => {
    if (busy) return;
    setSubmitted(true);
    setServerError("");

    if (nameError || roundsError || rounds === null) {
      if (nameError) nameShake.shake();
      if (roundsError) roundsShake.shake();
      return;
    }

    setBusy(true);
    try {
      await onCreateRoom({
        roomName: trimmedName,
        roomType: "private",
        numberOfPlayers,
        rounds,
      });
    } catch (e: any) {
      setServerError(e?.message || "Could not create room. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />
      <Background />

      <SafeAreaView style={s.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* HEADER */}
          <Animated.View style={[s.header, rise(0)]}>
            <TouchableOpacity onPress={onBack} style={s.backBtn} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={20} color={T.ink} />
            </TouchableOpacity>

            <View style={s.headerText}>
              <Text style={s.title}>
                Create <Text style={s.titleAccent}>Room</Text>
              </Text>
              <Text style={s.subtitle}>Set up your game room</Text>
            </View>

            <Idle kind="sway" amount={8} duration={1300} style={s.headerTile}>
              <Text style={s.headerTileW}>W</Text>
              <Text style={s.headerTileS}>S</Text>
            </Idle>
          </Animated.View>

          <ScrollView
            contentContainerStyle={s.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={s.inner}>
              {/* ROOM NAME */}
              <Animated.View style={rise(1)}>
                <Animated.View
                  style={[
                    s.card,
                    submitted && !!nameError && s.cardError,
                    { transform: [{ translateX: nameShake.x }] },
                  ]}
                >
                  <View style={s.labelRow}>
                    <Text style={s.label}>
                      ROOM NAME <Text style={s.required}>*</Text>
                    </Text>
                    <Text style={s.hint}>
                      {roomName.length}/{NAME_MAX}
                    </Text>
                  </View>

                  <View style={[s.inputWrap, submitted && !!nameError && s.inputWrapError]}>
                    <Ionicons name="home-outline" size={18} color={T.inkFaint} />
                    <TextInput
                      value={roomName}
                      onChangeText={(t) => {
                        setRoomName(t);
                        setServerError("");
                      }}
                      placeholder="e.g. Kitty's Room"
                      placeholderTextColor={T.inkFaint}
                      maxLength={NAME_MAX}
                      style={s.input}
                    />
                  </View>

                  {submitted && !!nameError && <Text style={s.errorText}>{nameError}</Text>}
                </Animated.View>
              </Animated.View>

              {/* ROUNDS */}
              <Animated.View style={rise(2)}>
                <Animated.View
                  style={[
                    s.card,
                    submitted && !!roundsError && s.cardError,
                    { transform: [{ translateX: roundsShake.x }] },
                  ]}
                >
                  <View style={s.labelRow}>
                    <Text style={s.label}>
                      ROUNDS <Text style={s.required}>*</Text>
                    </Text>
                    <Text style={s.hint}>
                      ({MIN_ROUNDS} - {MAX_ROUNDS})
                    </Text>
                  </View>

                  <Stepper value={rounds} min={MIN_ROUNDS} max={MAX_ROUNDS} onChange={setRounds} />

                  <View style={s.chips}>
                    {ROUND_PRESETS.filter((n) => n >= MIN_ROUNDS && n <= MAX_ROUNDS).map((n) => {
                      const on = rounds === n;
                      return (
                        <PressScale key={n} onPress={() => setRounds(n)} style={s.chipWrap}>
                          <View style={[s.chip, on && s.chipOn]}>
                            <Text style={[s.chipText, on && s.chipTextOn]}>{n}</Text>
                          </View>
                        </PressScale>
                      );
                    })}
                  </View>

                  {submitted && !!roundsError && <Text style={s.errorText}>{roundsError}</Text>}
                </Animated.View>
              </Animated.View>

              {/* MAX PLAYERS */}
              <Animated.View style={rise(3)}>
                <View style={s.card}>
                  <View style={s.labelRow}>
                    <Text style={s.label}>MAX PLAYERS</Text>
                    <Text style={s.hint}>
                      ({MIN_PLAYERS} - {MAX_PLAYERS})
                    </Text>
                  </View>
                  <Stepper
                    value={numberOfPlayers}
                    min={MIN_PLAYERS}
                    max={MAX_PLAYERS}
                    onChange={setNumberOfPlayers}
                  />
                </View>
              </Animated.View>

              {/* CREATE */}
              <Animated.View style={rise(4)}>
                {!!serverError && (
                  <View style={s.serverError}>
                    <Ionicons name="alert-circle" size={16} color={T.danger} />
                    <Text style={s.serverErrorText}>{serverError}</Text>
                  </View>
                )}

                <PressScale onPress={handleCreate} disabled={busy}>
                  <View style={s.createBtn}>
                    {busy ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <>
                        <Ionicons name="play" size={18} color="#FFF" />
                        <Text style={s.createText}>CREATE ROOM</Text>
                      </>
                    )}
                  </View>
                </PressScale>

                <Text style={s.footer}>You can change the room settings before the game starts.</Text>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

/* ============================================================
   STYLES
============================================================ */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  safe: { flex: 1, backgroundColor: "transparent" },

  floatTile: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: T.tile,
    borderWidth: 2,
    borderColor: T.tileEdge,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  floatChar: { fontSize: 20, fontWeight: "900" },

  header: {
    height: 76,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1, alignItems: "center" },
  title: { color: T.ink, fontSize: 21, fontWeight: "900" },
  titleAccent: { color: T.teal },
  subtitle: { color: T.inkSoft, fontSize: 12, marginTop: 2, fontWeight: "600" },
  headerTile: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: T.tile,
    borderWidth: 2,
    borderColor: T.tileEdge,
    borderBottomWidth: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTileW: { color: T.teal, fontSize: 15, fontWeight: "900" },
  headerTileS: { color: T.tangerine, fontSize: 15, fontWeight: "900" },

  body: { flexGrow: 1, alignItems: "center", padding: 16, paddingBottom: 40 },
  inner: { width: "100%", maxWidth: 440 },

  card: {
    backgroundColor: T.card,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 5,
    padding: 16,
    marginBottom: 14,
  },
  cardError: { borderColor: T.danger },

  label: { color: T.inkSoft, fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  required: { color: T.danger },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  hint: { color: T.inkFaint, fontSize: 11.5, fontWeight: "700" },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    backgroundColor: "#F3FBF8",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: T.line,
    paddingHorizontal: 14,
    gap: 10,
  },
  inputWrapError: { borderColor: T.danger, backgroundColor: "#FFF5F5" },
  input: { flex: 1, minWidth: 0, color: T.ink, fontSize: 15, fontWeight: "800" },

  errorText: { color: T.danger, fontSize: 12, fontWeight: "700", marginTop: 10 },

  stepRow: { flexDirection: "row", alignItems: "center" },
  stepBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: T.tealPale,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnOff: { opacity: 0.4 },
  stepValueBox: { flex: 1, alignItems: "center", justifyContent: "center" },
  stepValue: { color: T.ink, fontSize: 30, fontWeight: "900" },
  stepValueEmpty: { color: T.inkFaint },

  chips: { flexDirection: "row", gap: 8, marginTop: 14 },
  chipWrap: { flex: 1 },
  chip: {
    height: 40,
    borderRadius: 12,
    backgroundColor: T.tile,
    borderWidth: 1.5,
    borderColor: T.tileEdge,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  chipOn: { backgroundColor: T.teal, borderColor: T.tealDark },
  chipText: { color: T.ink, fontSize: 14, fontWeight: "900" },
  chipTextOn: { color: "#FFF" },

  serverError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF0F0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F7C9CB",
    padding: 12,
    marginBottom: 12,
  },
  serverErrorText: { flex: 1, color: T.danger, fontSize: 12.5, fontWeight: "700" },

  createBtn: {
    height: 58,
    borderRadius: 16,
    backgroundColor: T.tangerine,
    borderBottomWidth: 5,
    borderBottomColor: T.tangerineDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  createText: { color: "#FFF", fontSize: 15, fontWeight: "900", letterSpacing: 0.8 },
  footer: { textAlign: "center", color: T.inkSoft, fontSize: 11.5, marginTop: 14 },
});