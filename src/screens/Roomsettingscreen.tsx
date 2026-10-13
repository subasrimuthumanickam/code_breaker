// // // // // // import React from "react";
// // // // // // import { View, Text, StyleSheet, TouchableOpacity, Share, SafeAreaView, StatusBar } from "react-native";
// // // // // // import { LinearGradient } from "expo-linear-gradient";
// // // // // // import { Ionicons } from "@expo/vector-icons";
// // // // // // import { WordScrambleRoom } from "../api/Wordscrambleapi";

// // // // // // interface RoomSettingsScreenProps {
// // // // // //   room: WordScrambleRoom;
// // // // // //   totalRounds: number;
// // // // // //   timePerRoundSec: number;
// // // // // //   onBack: () => void;
// // // // // //   onLeaveRoom: () => void;
// // // // // // }

// // // // // // const RoomSettingsScreen: React.FC<RoomSettingsScreenProps> = ({
// // // // // //   room,
// // // // // //   totalRounds,
// // // // // //   timePerRoundSec,
// // // // // //   onBack,
// // // // // //   onLeaveRoom,
// // // // // // }) => {
// // // // // //   const handleShare = () => {
// // // // // //     Share.share({ message: `Join my Word Scramble room! Code: ${room.roomCode}` });
// // // // // //   };

// // // // // //   const InfoRow: React.FC<{ icon: any; label: string; value: string }> = ({ icon, label, value }) => (
// // // // // //     <View style={styles.infoRow}>
// // // // // //       <View style={styles.infoLeft}>
// // // // // //         <Ionicons name={icon} size={16} color="#9AA5C0" />
// // // // // //         <Text style={styles.infoLabel}>{label}</Text>
// // // // // //       </View>
// // // // // //       <View style={styles.infoRight}>
// // // // // //         <Text style={styles.infoValue}>{value}</Text>
// // // // // //         <Ionicons name="chevron-forward" size={16} color="#5A6478" />
// // // // // //       </View>
// // // // // //     </View>
// // // // // //   );

// // // // // //   return (
// // // // // //     <LinearGradient colors={["#0B1020", "#141B36", "#0B1020"]} style={styles.flex}>
// // // // // //       <SafeAreaView style={styles.flex}>
// // // // // //         <StatusBar barStyle="light-content" backgroundColor="#0B1020" />

// // // // // //         <View style={styles.topRow}>
// // // // // //           <TouchableOpacity onPress={onBack}>
// // // // // //             <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
// // // // // //           </TouchableOpacity>
// // // // // //           <Text style={styles.topTitle}>Room {room.roomCode}</Text>
// // // // // //           <Ionicons name="copy-outline" size={18} color="#9AA5C0" />
// // // // // //         </View>

// // // // // //         <Text style={styles.playersCount}>Players: {room.players.length} / {room.maxPlayers}</Text>

// // // // // //         <View style={styles.card}>
// // // // // //           <InfoRow icon="globe-outline" label="Room Type" value={room.roomType === "public" ? "Public" : "Private"} />
// // // // // //           <InfoRow icon="game-controller-outline" label="Game Type" value="Word Scramble" />
// // // // // //           <InfoRow icon="repeat-outline" label="Rounds" value={`${totalRounds} Rounds`} />
// // // // // //           <InfoRow icon="time-outline" label="Time per Round" value={`${timePerRoundSec} Seconds`} />
// // // // // //         </View>

// // // // // //         <Text style={styles.sectionLabel}>Invite Friends</Text>
// // // // // //         <View style={styles.inviteCard}>
// // // // // //           <View style={styles.inviteLeft}>
// // // // // //             <Ionicons name="link-outline" size={16} color="#9AA5C0" />
// // // // // //             <Text style={styles.inviteLabel}>Share Room Code</Text>
// // // // // //           </View>
// // // // // //           <View style={styles.inviteRight}>
// // // // // //             <Text style={styles.inviteCode}>{room.roomCode}</Text>
// // // // // //             <TouchableOpacity onPress={handleShare}>
// // // // // //               <Ionicons name="share-social-outline" size={16} color="#9AA5C0" />
// // // // // //             </TouchableOpacity>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         <TouchableOpacity style={styles.leaveButton} activeOpacity={0.88} onPress={onLeaveRoom}>
// // // // // //           <Text style={styles.leaveButtonText}>Leave Room</Text>
// // // // // //         </TouchableOpacity>
// // // // // //       </SafeAreaView>
// // // // // //     </LinearGradient>
// // // // // //   );
// // // // // // };

// // // // // // export default RoomSettingsScreen;

// // // // // // const styles = StyleSheet.create({
// // // // // //   flex: { flex: 1 },
// // // // // //   topRow: {
// // // // // //     flexDirection: "row",
// // // // // //     justifyContent: "space-between",
// // // // // //     alignItems: "center",
// // // // // //     paddingHorizontal: 20,
// // // // // //     paddingTop: 8,
// // // // // //     paddingBottom: 4,
// // // // // //   },
// // // // // //   topTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
// // // // // //   playersCount: { color: "#9AA5C0", fontSize: 12, paddingHorizontal: 20, marginTop: 4, marginBottom: 18 },
// // // // // //   card: {
// // // // // //     marginHorizontal: 20,
// // // // // //     backgroundColor: "#141B36",
// // // // // //     borderRadius: 16,
// // // // // //     paddingHorizontal: 16,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#1E2A4D",
// // // // // //   },
// // // // // //   infoRow: {
// // // // // //     flexDirection: "row",
// // // // // //     justifyContent: "space-between",
// // // // // //     alignItems: "center",
// // // // // //     paddingVertical: 14,
// // // // // //     borderBottomWidth: StyleSheet.hairlineWidth,
// // // // // //     borderBottomColor: "#1E2A4D",
// // // // // //   },
// // // // // //   infoLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
// // // // // //   infoLabel: { color: "#E2E8F5", fontSize: 13.5 },
// // // // // //   infoRight: { flexDirection: "row", alignItems: "center", gap: 6 },
// // // // // //   infoValue: { color: "#9AA5C0", fontSize: 13 },
// // // // // //   sectionLabel: {
// // // // // //     color: "#9AA5C0",
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: "700",
// // // // // //     paddingHorizontal: 20,
// // // // // //     marginTop: 22,
// // // // // //     marginBottom: 10,
// // // // // //   },
// // // // // //   inviteCard: {
// // // // // //     flexDirection: "row",
// // // // // //     justifyContent: "space-between",
// // // // // //     alignItems: "center",
// // // // // //     marginHorizontal: 20,
// // // // // //     backgroundColor: "#141B36",
// // // // // //     borderRadius: 14,
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 14,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#1E2A4D",
// // // // // //   },
// // // // // //   inviteLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
// // // // // //   inviteLabel: { color: "#E2E8F5", fontSize: 13 },
// // // // // //   inviteRight: { flexDirection: "row", alignItems: "center", gap: 10 },
// // // // // //   inviteCode: { color: "#FFFFFF", fontWeight: "800", fontSize: 14, letterSpacing: 1 },
// // // // // //   leaveButton: {
// // // // // //     marginHorizontal: 20,
// // // // // //     marginTop: "auto",
// // // // // //     marginBottom: 30,
// // // // // //     height: 52,
// // // // // //     borderRadius: 14,
// // // // // //     backgroundColor: "#E5484D",
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //   },
// // // // // //   leaveButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
// // // // // // });
// // // // // import React, { useState } from "react";
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   StyleSheet,
// // // // //   TouchableOpacity,
// // // // //   Share,
// // // // //   SafeAreaView,
// // // // //   StatusBar,
// // // // //   Modal,
// // // // //   ScrollView,
// // // // //   ActivityIndicator,
// // // // // } from "react-native";
// // // // // import { LinearGradient } from "expo-linear-gradient";
// // // // // import { Ionicons } from "@expo/vector-icons";
// // // // // import { WordScrambleRoom, updateRoomSettings } from "../api/Wordscrambleapi";

// // // // // interface RoomSettingsScreenProps {
// // // // //   room: WordScrambleRoom;
// // // // //   playerName: string; // current logged-in player, to check host status
// // // // //   onBack: () => void;
// // // // //   onLeaveRoom: () => void;
// // // // //   onRoomUpdated: (room: WordScrambleRoom) => void; // parent refreshes room state
// // // // // }

// // // // // const ROUND_OPTIONS = [5, 10, 15, 20];
// // // // // const TIME_OPTIONS = [10, 15, 20, 30, 45, 60];

// // // // // type EditingField = "rounds" | "time" | null;

// // // // // const RoomSettingsScreen: React.FC<RoomSettingsScreenProps> = ({
// // // // //   room,
// // // // //   playerName,
// // // // //   onBack,
// // // // //   onLeaveRoom,
// // // // //   onRoomUpdated,
// // // // // }) => {
// // // // //   const [editing, setEditing] = useState<EditingField>(null);
// // // // //   const [saving, setSaving] = useState(false);
// // // // //   const [error, setError] = useState<string | null>(null);

// // // // //   const isHost = room.hostPlayerName === playerName;
// // // // //   const canEdit = isHost && room.status === "waiting";

// // // // //   const handleShare = () => {
// // // // //     Share.share({ message: `Join my Word Scramble room! Code: ${room.roomCode}` });
// // // // //   };

// // // // //   const applySetting = async (field: EditingField, value: number) => {
// // // // //     if (!field) return;
// // // // //     setSaving(true);
// // // // //     setError(null);
// // // // //     try {
// // // // //       const updated = await updateRoomSettings(room.roomCode, playerName, {
// // // // //         totalRounds: field === "rounds" ? value : room.totalRounds,
// // // // //         timePerRoundSec: field === "time" ? value : room.timePerRoundSec,
// // // // //       });
// // // // //       onRoomUpdated(updated);
// // // // //       setEditing(null);
// // // // //     } catch (err: any) {
// // // // //       setError(err.message || "Could not update settings");
// // // // //     } finally {
// // // // //       setSaving(false);
// // // // //     }
// // // // //   };

// // // // //   const InfoRow: React.FC<{
// // // // //     icon: any;
// // // // //     label: string;
// // // // //     value: string;
// // // // //     onPress?: () => void;
// // // // //   }> = ({ icon, label, value, onPress }) => (
// // // // //     <TouchableOpacity
// // // // //       style={styles.infoRow}
// // // // //       disabled={!onPress}
// // // // //       activeOpacity={onPress ? 0.7 : 1}
// // // // //       onPress={onPress}
// // // // //     >
// // // // //       <View style={styles.infoLeft}>
// // // // //         <Ionicons name={icon} size={16} color="#9AA5C0" />
// // // // //         <Text style={styles.infoLabel}>{label}</Text>
// // // // //       </View>
// // // // //       <View style={styles.infoRight}>
// // // // //         <Text style={styles.infoValue}>{value}</Text>
// // // // //         {onPress ? <Ionicons name="chevron-forward" size={16} color="#5A6478" /> : null}
// // // // //       </View>
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   return (
// // // // //     <LinearGradient colors={["#0B1020", "#141B36", "#0B1020"]} style={styles.flex}>
// // // // //       <SafeAreaView style={styles.flex}>
// // // // //         <StatusBar barStyle="light-content" backgroundColor="#0B1020" />

// // // // //         <View style={styles.topRow}>
// // // // //           <TouchableOpacity onPress={onBack}>
// // // // //             <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
// // // // //           </TouchableOpacity>
// // // // //           <Text style={styles.topTitle}>Room {room.roomCode}</Text>
// // // // //           <Ionicons name="copy-outline" size={18} color="#9AA5C0" />
// // // // //         </View>

// // // // //         <Text style={styles.playersCount}>
// // // // //           Players: {room.players.length} / {room.maxPlayers}
// // // // //         </Text>

// // // // //         {!isHost && (
// // // // //           <View style={styles.hostNotice}>
// // // // //             <Ionicons name="lock-closed-outline" size={13} color="#9AA5C0" />
// // // // //             <Text style={styles.hostNoticeText}>Only the host can change room settings</Text>
// // // // //           </View>
// // // // //         )}

// // // // //         {error && <Text style={styles.errorText}>{error}</Text>}

// // // // //         <View style={styles.card}>
// // // // //           <InfoRow icon="globe-outline" label="Room Type" value={room.roomType === "public" ? "Public" : "Private"} />
// // // // //           <InfoRow icon="game-controller-outline" label="Game Type" value="Word Scramble" />
// // // // //           <InfoRow
// // // // //             icon="repeat-outline"
// // // // //             label="Rounds"
// // // // //             value={`${room.totalRounds} Rounds`}
// // // // //             onPress={canEdit ? () => setEditing("rounds") : undefined}
// // // // //           />
// // // // //           <InfoRow
// // // // //             icon="time-outline"
// // // // //             label="Time per Round"
// // // // //             value={`${room.timePerRoundSec} Seconds`}
// // // // //             onPress={canEdit ? () => setEditing("time") : undefined}
// // // // //           />
// // // // //         </View>

// // // // //         <Text style={styles.sectionLabel}>Invite Friends</Text>
// // // // //         <View style={styles.inviteCard}>
// // // // //           <View style={styles.inviteLeft}>
// // // // //             <Ionicons name="link-outline" size={16} color="#9AA5C0" />
// // // // //             <Text style={styles.inviteLabel}>Share Room Code</Text>
// // // // //           </View>
// // // // //           <View style={styles.inviteRight}>
// // // // //             <Text style={styles.inviteCode}>{room.roomCode}</Text>
// // // // //             <TouchableOpacity onPress={handleShare}>
// // // // //               <Ionicons name="share-social-outline" size={16} color="#9AA5C0" />
// // // // //             </TouchableOpacity>
// // // // //           </View>
// // // // //         </View>

// // // // //         <TouchableOpacity style={styles.leaveButton} activeOpacity={0.88} onPress={onLeaveRoom}>
// // // // //           <Text style={styles.leaveButtonText}>Leave Room</Text>
// // // // //         </TouchableOpacity>

// // // // //         {/* ---- Bottom sheet: pick Rounds or Time ---- */}
// // // // //         <Modal transparent visible={editing !== null} animationType="slide" onRequestClose={() => setEditing(null)}>
// // // // //           <View style={styles.sheetOverlay}>
// // // // //             <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setEditing(null)} />
// // // // //             <View style={styles.sheet}>
// // // // //               <View style={styles.sheetHandle} />
// // // // //               <Text style={styles.sheetTitle}>
// // // // //                 {editing === "rounds" ? "Select Rounds" : "Select Time per Round"}
// // // // //               </Text>

// // // // //               <ScrollView contentContainerStyle={styles.chipsWrap}>
// // // // //                 {(editing === "rounds" ? ROUND_OPTIONS : TIME_OPTIONS).map((opt) => {
// // // // //                   const current = editing === "rounds" ? room.totalRounds : room.timePerRoundSec;
// // // // //                   const selected = opt === current;
// // // // //                   return (
// // // // //                     <TouchableOpacity
// // // // //                       key={opt}
// // // // //                       style={[styles.chip, selected && styles.chipSelected]}
// // // // //                       disabled={saving}
// // // // //                       onPress={() => applySetting(editing, opt)}
// // // // //                     >
// // // // //                       {saving && selected ? (
// // // // //                         <ActivityIndicator size="small" color="#FFFFFF" />
// // // // //                       ) : (
// // // // //                         <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
// // // // //                           {editing === "rounds" ? `${opt} Rounds` : `${opt}s`}
// // // // //                         </Text>
// // // // //                       )}
// // // // //                     </TouchableOpacity>
// // // // //                   );
// // // // //                 })}
// // // // //               </ScrollView>
// // // // //             </View>
// // // // //           </View>
// // // // //         </Modal>
// // // // //       </SafeAreaView>
// // // // //     </LinearGradient>
// // // // //   );
// // // // // };

// // // // // export default RoomSettingsScreen;

// // // // // const styles = StyleSheet.create({
// // // // //   flex: { flex: 1 },
// // // // //   topRow: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     alignItems: "center",
// // // // //     paddingHorizontal: 20,
// // // // //     paddingTop: 8,
// // // // //     paddingBottom: 4,
// // // // //   },
// // // // //   topTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
// // // // //   playersCount: { color: "#9AA5C0", fontSize: 12, paddingHorizontal: 20, marginTop: 4, marginBottom: 8 },
// // // // //   hostNotice: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 6,
// // // // //     marginHorizontal: 20,
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   hostNoticeText: { color: "#9AA5C0", fontSize: 11.5 },
// // // // //   errorText: { color: "#F87171", fontSize: 12, paddingHorizontal: 20, marginBottom: 8 },
// // // // //   card: {
// // // // //     marginHorizontal: 20,
// // // // //     backgroundColor: "#141B36",
// // // // //     borderRadius: 16,
// // // // //     paddingHorizontal: 16,
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#1E2A4D",
// // // // //   },
// // // // //   infoRow: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     alignItems: "center",
// // // // //     paddingVertical: 14,
// // // // //     borderBottomWidth: StyleSheet.hairlineWidth,
// // // // //     borderBottomColor: "#1E2A4D",
// // // // //   },
// // // // //   infoLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
// // // // //   infoLabel: { color: "#E2E8F5", fontSize: 13.5 },
// // // // //   infoRight: { flexDirection: "row", alignItems: "center", gap: 6 },
// // // // //   infoValue: { color: "#9AA5C0", fontSize: 13 },
// // // // //   sectionLabel: {
// // // // //     color: "#9AA5C0",
// // // // //     fontSize: 12,
// // // // //     fontWeight: "700",
// // // // //     paddingHorizontal: 20,
// // // // //     marginTop: 22,
// // // // //     marginBottom: 10,
// // // // //   },
// // // // //   inviteCard: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     alignItems: "center",
// // // // //     marginHorizontal: 20,
// // // // //     backgroundColor: "#141B36",
// // // // //     borderRadius: 14,
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 14,
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#1E2A4D",
// // // // //   },
// // // // //   inviteLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
// // // // //   inviteLabel: { color: "#E2E8F5", fontSize: 13 },
// // // // //   inviteRight: { flexDirection: "row", alignItems: "center", gap: 10 },
// // // // //   inviteCode: { color: "#FFFFFF", fontWeight: "800", fontSize: 14, letterSpacing: 1 },
// // // // //   leaveButton: {
// // // // //     marginHorizontal: 20,
// // // // //     marginTop: "auto",
// // // // //     marginBottom: 30,
// // // // //     height: 52,
// // // // //     borderRadius: 14,
// // // // //     backgroundColor: "#E5484D",
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   leaveButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },

// // // // //   // bottom sheet
// // // // //   sheetOverlay: { flex: 1, justifyContent: "flex-end" },
// // // // //   // sheetBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
// // // // //   sheetBackdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" },
// // // // //   sheet: {
// // // // //     backgroundColor: "#141B36",
// // // // //     borderTopLeftRadius: 24,
// // // // //     borderTopRightRadius: 24,
// // // // //     paddingTop: 10,
// // // // //     paddingHorizontal: 20,
// // // // //     paddingBottom: 30,
// // // // //     maxHeight: "50%",
// // // // //   },
// // // // //   sheetHandle: {
// // // // //     width: 40,
// // // // //     height: 4,
// // // // //     borderRadius: 2,
// // // // //     backgroundColor: "#3A4568",
// // // // //     alignSelf: "center",
// // // // //     marginBottom: 14,
// // // // //   },
// // // // //   sheetTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 16, marginBottom: 16, textAlign: "center" },
// // // // //   chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center", paddingBottom: 10 },
// // // // //   chip: {
// // // // //     paddingVertical: 12,
// // // // //     paddingHorizontal: 20,
// // // // //     borderRadius: 14,
// // // // //     backgroundColor: "#1E2A4D",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#2C3A63",
// // // // //     minWidth: 90,
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   chipSelected: { backgroundColor: "#6C5CE7", borderColor: "#6C5CE7" },
// // // // //   chipText: { color: "#E2E8F5", fontWeight: "700", fontSize: 13 },
// // // // //   chipTextSelected: { color: "#FFFFFF" },
// // // // // });
// // // // import React, { useState } from "react";
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   StyleSheet,
// // // //   TouchableOpacity,
// // // //   Share,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // //   Modal,
// // // //   ScrollView,
// // // //   ActivityIndicator,
// // // // } from "react-native";
// // // // import { LinearGradient } from "expo-linear-gradient";
// // // // import { Ionicons } from "@expo/vector-icons";
// // // // import { WordScrambleRoom, updateRoomSettings } from "../api/Wordscrambleapi";

// // // // // TEMP FIX: WordScrambleRoom (from Wordscrambleapi) doesn't declare
// // // // // `timePerRoundSec`. Extending it locally so this screen compiles.
// // // // // Best fix: add `timePerRoundSec: number;` directly to WordScrambleRoom
// // // // // in Wordscrambleapi.ts, then remove this type + revert room prop below.
// // // // type RoomWithTiming = WordScrambleRoom & { timePerRoundSec: number };

// // // // interface RoomSettingsScreenProps {
// // // //   room: RoomWithTiming;
// // // //   playerName: string; // current logged-in player, to check host status
// // // //   onBack: () => void;
// // // //   onLeaveRoom: () => void;
// // // //   onRoomUpdated: (room: RoomWithTiming) => void; // parent refreshes room state
// // // // }

// // // // const ROUND_OPTIONS = [5, 10, 15, 20];
// // // // const TIME_OPTIONS = [10, 15, 20, 30, 45, 60];

// // // // type EditingField = "rounds" | "time" | null;

// // // // const RoomSettingsScreen: React.FC<RoomSettingsScreenProps> = ({
// // // //   room,
// // // //   playerName,
// // // //   onBack,
// // // //   onLeaveRoom,
// // // //   onRoomUpdated,
// // // // }) => {
// // // //   const [editing, setEditing] = useState<EditingField>(null);
// // // //   const [saving, setSaving] = useState(false);
// // // //   const [error, setError] = useState<string | null>(null);

// // // //   const isHost = room.hostPlayerName === playerName;
// // // //   const canEdit = isHost && room.status === "waiting";

// // // //   const handleShare = () => {
// // // //     Share.share({ message: `Join my Word Scramble room! Code: ${room.roomCode}` });
// // // //   };

// // // //   const applySetting = async (field: EditingField, value: number) => {
// // // //     if (!field) return;
// // // //     setSaving(true);
// // // //     setError(null);
// // // //     try {
// // // //       const updated = await updateRoomSettings(room.roomCode, playerName, {
// // // //         totalRounds: field === "rounds" ? value : room.totalRounds,
// // // //         timePerRoundSec: field === "time" ? value : room.timePerRoundSec,
// // // //       });
// // // //       onRoomUpdated(updated as RoomWithTiming);
// // // //       setEditing(null);
// // // //     } catch (err: any) {
// // // //       setError(err.message || "Could not update settings");
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   };

// // // //   const InfoRow: React.FC<{
// // // //     icon: any;
// // // //     label: string;
// // // //     value: string;
// // // //     onPress?: () => void;
// // // //   }> = ({ icon, label, value, onPress }) => (
// // // //     <TouchableOpacity
// // // //       style={styles.infoRow}
// // // //       disabled={!onPress}
// // // //       activeOpacity={onPress ? 0.7 : 1}
// // // //       onPress={onPress}
// // // //     >
// // // //       <View style={styles.infoLeft}>
// // // //         <Ionicons name={icon} size={16} color="#9AA5C0" />
// // // //         <Text style={styles.infoLabel}>{label}</Text>
// // // //       </View>
// // // //       <View style={styles.infoRight}>
// // // //         <Text style={styles.infoValue}>{value}</Text>
// // // //         {onPress ? <Ionicons name="chevron-forward" size={16} color="#5A6478" /> : null}
// // // //       </View>
// // // //     </TouchableOpacity>
// // // //   );

// // // //   return (
// // // //     <LinearGradient colors={["#0B1020", "#141B36", "#0B1020"]} style={styles.flex}>
// // // //       <SafeAreaView style={styles.flex}>
// // // //         <StatusBar barStyle="light-content" backgroundColor="#0B1020" />

// // // //         <View style={styles.topRow}>
// // // //           <TouchableOpacity onPress={onBack}>
// // // //             <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
// // // //           </TouchableOpacity>
// // // //           <Text style={styles.topTitle}>Room {room.roomCode}</Text>
// // // //           <Ionicons name="copy-outline" size={18} color="#9AA5C0" />
// // // //         </View>

// // // //         <Text style={styles.playersCount}>
// // // //           Players: {room.players.length} / {room.maxPlayers}
// // // //         </Text>

// // // //         {!isHost && (
// // // //           <View style={styles.hostNotice}>
// // // //             <Ionicons name="lock-closed-outline" size={13} color="#9AA5C0" />
// // // //             <Text style={styles.hostNoticeText}>Only the host can change room settings</Text>
// // // //           </View>
// // // //         )}

// // // //         {error && <Text style={styles.errorText}>{error}</Text>}

// // // //         <View style={styles.card}>
// // // //           <InfoRow icon="globe-outline" label="Room Type" value={room.roomType === "public" ? "Public" : "Private"} />
// // // //           <InfoRow icon="game-controller-outline" label="Game Type" value="Word Scramble" />
// // // //           <InfoRow
// // // //             icon="repeat-outline"
// // // //             label="Rounds"
// // // //             value={`${room.totalRounds} Rounds`}
// // // //             onPress={canEdit ? () => setEditing("rounds") : undefined}
// // // //           />
// // // //           <InfoRow
// // // //             icon="time-outline"
// // // //             label="Time per Round"
// // // //             value={`${room.timePerRoundSec} Seconds`}
// // // //             onPress={canEdit ? () => setEditing("time") : undefined}
// // // //           />
// // // //         </View>

// // // //         <Text style={styles.sectionLabel}>Invite Friends</Text>
// // // //         <View style={styles.inviteCard}>
// // // //           <View style={styles.inviteLeft}>
// // // //             <Ionicons name="link-outline" size={16} color="#9AA5C0" />
// // // //             <Text style={styles.inviteLabel}>Share Room Code</Text>
// // // //           </View>
// // // //           <View style={styles.inviteRight}>
// // // //             <Text style={styles.inviteCode}>{room.roomCode}</Text>
// // // //             <TouchableOpacity onPress={handleShare}>
// // // //               <Ionicons name="share-social-outline" size={16} color="#9AA5C0" />
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //         </View>

// // // //         <TouchableOpacity style={styles.leaveButton} activeOpacity={0.88} onPress={onLeaveRoom}>
// // // //           <Text style={styles.leaveButtonText}>Leave Room</Text>
// // // //         </TouchableOpacity>

// // // //         {/* ---- Bottom sheet: pick Rounds or Time ---- */}
// // // //         <Modal transparent visible={editing !== null} animationType="slide" onRequestClose={() => setEditing(null)}>
// // // //           <View style={styles.sheetOverlay}>
// // // //             <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setEditing(null)} />
// // // //             <View style={styles.sheet}>
// // // //               <View style={styles.sheetHandle} />
// // // //               <Text style={styles.sheetTitle}>
// // // //                 {editing === "rounds" ? "Select Rounds" : "Select Time per Round"}
// // // //               </Text>

// // // //               <ScrollView contentContainerStyle={styles.chipsWrap}>
// // // //                 {(editing === "rounds" ? ROUND_OPTIONS : TIME_OPTIONS).map((opt) => {
// // // //                   const current = editing === "rounds" ? room.totalRounds : room.timePerRoundSec;
// // // //                   const selected = opt === current;
// // // //                   return (
// // // //                     <TouchableOpacity
// // // //                       key={opt}
// // // //                       style={[styles.chip, selected && styles.chipSelected]}
// // // //                       disabled={saving}
// // // //                       onPress={() => applySetting(editing, opt)}
// // // //                     >
// // // //                       {saving && selected ? (
// // // //                         <ActivityIndicator size="small" color="#FFFFFF" />
// // // //                       ) : (
// // // //                         <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
// // // //                           {editing === "rounds" ? `${opt} Rounds` : `${opt}s`}
// // // //                         </Text>
// // // //                       )}
// // // //                     </TouchableOpacity>
// // // //                   );
// // // //                 })}
// // // //               </ScrollView>
// // // //             </View>
// // // //           </View>
// // // //         </Modal>
// // // //       </SafeAreaView>
// // // //     </LinearGradient>
// // // //   );
// // // // };

// // // // export default RoomSettingsScreen;

// // // // const styles = StyleSheet.create({
// // // //   flex: { flex: 1 },
// // // //   topRow: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //     paddingHorizontal: 20,
// // // //     paddingTop: 8,
// // // //     paddingBottom: 4,
// // // //   },
// // // //   topTitle: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
// // // //   playersCount: { color: "#9AA5C0", fontSize: 12, paddingHorizontal: 20, marginTop: 4, marginBottom: 8 },
// // // //   hostNotice: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 6,
// // // //     marginHorizontal: 20,
// // // //     marginBottom: 12,
// // // //   },
// // // //   hostNoticeText: { color: "#9AA5C0", fontSize: 11.5 },
// // // //   errorText: { color: "#F87171", fontSize: 12, paddingHorizontal: 20, marginBottom: 8 },
// // // //   card: {
// // // //     marginHorizontal: 20,
// // // //     backgroundColor: "#141B36",
// // // //     borderRadius: 16,
// // // //     paddingHorizontal: 16,
// // // //     borderWidth: 1,
// // // //     borderColor: "#1E2A4D",
// // // //   },
// // // //   infoRow: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //     paddingVertical: 14,
// // // //     borderBottomWidth: StyleSheet.hairlineWidth,
// // // //     borderBottomColor: "#1E2A4D",
// // // //   },
// // // //   infoLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
// // // //   infoLabel: { color: "#E2E8F5", fontSize: 13.5 },
// // // //   infoRight: { flexDirection: "row", alignItems: "center", gap: 6 },
// // // //   infoValue: { color: "#9AA5C0", fontSize: 13 },
// // // //   sectionLabel: {
// // // //     color: "#9AA5C0",
// // // //     fontSize: 12,
// // // //     fontWeight: "700",
// // // //     paddingHorizontal: 20,
// // // //     marginTop: 22,
// // // //     marginBottom: 10,
// // // //   },
// // // //   inviteCard: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //     marginHorizontal: 20,
// // // //     backgroundColor: "#141B36",
// // // //     borderRadius: 14,
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 14,
// // // //     borderWidth: 1,
// // // //     borderColor: "#1E2A4D",
// // // //   },
// // // //   inviteLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
// // // //   inviteLabel: { color: "#E2E8F5", fontSize: 13 },
// // // //   inviteRight: { flexDirection: "row", alignItems: "center", gap: 10 },
// // // //   inviteCode: { color: "#FFFFFF", fontWeight: "800", fontSize: 14, letterSpacing: 1 },
// // // //   leaveButton: {
// // // //     marginHorizontal: 20,
// // // //     marginTop: "auto",
// // // //     marginBottom: 30,
// // // //     height: 52,
// // // //     borderRadius: 14,
// // // //     backgroundColor: "#E5484D",
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //   },
// // // //   leaveButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },

// // // //   // bottom sheet
// // // //   sheetOverlay: { flex: 1, justifyContent: "flex-end" },
// // // //   sheetBackdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" },
// // // //   sheet: {
// // // //     backgroundColor: "#141B36",
// // // //     borderTopLeftRadius: 24,
// // // //     borderTopRightRadius: 24,
// // // //     paddingTop: 10,
// // // //     paddingHorizontal: 20,
// // // //     paddingBottom: 30,
// // // //     maxHeight: "50%",
// // // //   },
// // // //   sheetHandle: {
// // // //     width: 40,
// // // //     height: 4,
// // // //     borderRadius: 2,
// // // //     backgroundColor: "#3A4568",
// // // //     alignSelf: "center",
// // // //     marginBottom: 14,
// // // //   },
// // // //   sheetTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 16, marginBottom: 16, textAlign: "center" },
// // // //   chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center", paddingBottom: 10 },
// // // //   chip: {
// // // //     paddingVertical: 12,
// // // //     paddingHorizontal: 20,
// // // //     borderRadius: 14,
// // // //     backgroundColor: "#1E2A4D",
// // // //     borderWidth: 1,
// // // //     borderColor: "#2C3A63",
// // // //     minWidth: 90,
// // // //     alignItems: "center",
// // // //   },
// // // //   chipSelected: { backgroundColor: "#6C5CE7", borderColor: "#6C5CE7" },
// // // //   chipText: { color: "#E2E8F5", fontWeight: "700", fontSize: 13 },
// // // //   chipTextSelected: { color: "#FFFFFF" },
// // // // });
// // // import React, { useState } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   Share,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   Modal,
// // //   ScrollView,
// // //   ActivityIndicator,
// // //   useWindowDimensions,
// // //   Platform,
// // // } from "react-native";
// // // import { Ionicons } from "@expo/vector-icons";
// // // import { WordScrambleRoom, updateRoomSettings } from "../api/Wordscrambleapi";

// // // type RoomWithTiming = WordScrambleRoom & { timePerRoundSec: number };

// // // interface RoomSettingsScreenProps {
// // //   room: RoomWithTiming;
// // //   playerName: string;
// // //   onBack: () => void;
// // //   onLeaveRoom: () => void;
// // //   onRoomUpdated: (room: RoomWithTiming) => void;
// // // }

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
// // //   red: "#E5484D",
// // //   redSoft: "#FDECEC",
// // //   grey: "#8A93A6",
// // //   greySoft: "#F1EEF0",
// // //   green: "#22B573",
// // //   greenSoft: "#E3F6EC",
// // //   dark: "#171B2E",
// // //   yellow: "#F2B640",
// // // };

// // // const TILE_COLORS = [C.coral, C.indigo, "#F0566A", C.green];

// // // const ROUND_OPTIONS = [5, 10, 15, 20];
// // // const TIME_OPTIONS = [10, 15, 20, 30, 45, 60];

// // // type EditingField = "rounds" | "time" | null;

// // // const RoomSettingsScreen: React.FC<RoomSettingsScreenProps> = ({
// // //   room,
// // //   playerName,
// // //   onBack,
// // //   onLeaveRoom,
// // //   onRoomUpdated,
// // // }) => {
// // //   const { width } = useWindowDimensions();
// // //   const wide = width >= 700;

// // //   const [editing, setEditing] = useState<EditingField>(null);
// // //   const [saving, setSaving] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [copied, setCopied] = useState(false);
// // //   const [confirmLeave, setConfirmLeave] = useState(false);
// // //   const [leaving, setLeaving] = useState(false);

// // //   const isHost = room.hostPlayerName === playerName;
// // //   const canEdit = isHost && room.status === "waiting";
// // //   const fillPct = room.maxPlayers > 0 ? Math.min(100, (room.players.length / room.maxPlayers) * 100) : 0;

// // //   const handleShare = () => {
// // //     Share.share({ message: `Join my Word Scramble room! Code: ${room.roomCode}` });
// // //   };

// // //   const handleCopy = async () => {
// // //     try {
// // //       const nav: any = typeof navigator !== "undefined" ? navigator : null;
// // //       if (Platform.OS === "web" && nav?.clipboard?.writeText) {
// // //         await nav.clipboard.writeText(room.roomCode);
// // //         setCopied(true);
// // //         setTimeout(() => setCopied(false), 1600);
// // //         return;
// // //       }
// // //       await Share.share({ message: room.roomCode });
// // //     } catch {
// // //       // ignore
// // //     }
// // //   };

// // //   const applySetting = async (field: EditingField, value: number) => {
// // //     if (!field) return;
// // //     setSaving(true);
// // //     setError(null);
// // //     try {
// // //       const updated = await updateRoomSettings(room.roomCode, playerName, {
// // //         totalRounds: field === "rounds" ? value : room.totalRounds,
// // //         timePerRoundSec: field === "time" ? value : room.timePerRoundSec,
// // //       });
// // //       onRoomUpdated(updated as RoomWithTiming);
// // //       setEditing(null);
// // //     } catch (err: any) {
// // //       setError(err.message || "Could not update settings");
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   const handleConfirmLeave = async () => {
// // //     setLeaving(true);
// // //     try {
// // //       await onLeaveRoom();
// // //     } finally {
// // //       setLeaving(false);
// // //       setConfirmLeave(false);
// // //     }
// // //   };

// // //   return (
// // //     <View style={styles.flex}>
// // //       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
// // //       <SafeAreaView style={styles.flex}>
// // //         {/* ---- top bar ---- */}
// // //         <View style={styles.topRow}>
// // //           <TouchableOpacity onPress={onBack} style={styles.roundButton} activeOpacity={0.8}>
// // //             <Ionicons name="chevron-back" size={20} color={C.text} />
// // //           </TouchableOpacity>
// // //           <View style={{ flex: 1 }}>
// // //             <Text style={styles.topTitle}>Room Settings</Text>
// // //             <Text style={styles.topSub}>Manage your word battle</Text>
// // //           </View>
// // //           <View style={[styles.statusPill, { backgroundColor: room.status === "waiting" ? C.greenSoft : C.indigoSoft }]}>
// // //             <View style={[styles.statusDot, { backgroundColor: room.status === "waiting" ? C.green : C.indigo }]} />
// // //             <Text style={[styles.statusText, { color: room.status === "waiting" ? C.green : C.indigo }]}>
// // //               {room.status === "waiting" ? "Waiting" : room.status}
// // //             </Text>
// // //           </View>
// // //         </View>

// // //         <ScrollView
// // //           contentContainerStyle={[styles.scroll, { paddingHorizontal: wide ? 32 : 16 }]}
// // //           showsVerticalScrollIndicator={false}
// // //         >
// // //           {error && (
// // //             <View style={styles.errorBanner}>
// // //               <Ionicons name="alert-circle-outline" size={14} color={C.red} />
// // //               <Text style={styles.errorText}>{error}</Text>
// // //             </View>
// // //           )}

// // //           {/* ---- hero: big code tiles, like the W-O-R-D tiles on Home ---- */}
// // //           <View style={styles.heroSection}>
// // //             <Text style={styles.eyebrow}>ROOM CODE</Text>
// // //             <Text style={[styles.heroTitle, !wide && styles.heroTitlePhone]}>Share this code</Text>
// // //             <Text style={styles.heroTitleAccent}>to invite friends</Text>

// // //             <View style={styles.tilesRow}>
// // //               {room.roomCode.split("").map((ch, i) => (
// // //                 <View key={i} style={[styles.tile, { backgroundColor: TILE_COLORS[i % TILE_COLORS.length] }]}>
// // //                   <Text style={styles.tileText}>{ch}</Text>
// // //                 </View>
// // //               ))}
// // //             </View>

// // //             <View style={styles.heroActionsRow}>
// // //               <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.88}>
// // //                 <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color="#FFFFFF" />
// // //                 <Text style={styles.copyBtnText}>{copied ? "Copied!" : "Copy code"}</Text>
// // //               </TouchableOpacity>
// // //               <TouchableOpacity style={styles.shareIconBtn} onPress={handleShare} activeOpacity={0.85}>
// // //                 <Ionicons name="share-social-outline" size={17} color={C.indigo} />
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>

// // //           {/* ---- players progress card ---- */}
// // //           <View style={styles.progressCard}>
// // //             <View style={styles.progressRow}>
// // //               <View style={styles.progressLeft}>
// // //                 <View style={styles.progressIconWrap}>
// // //                   <Ionicons name="people" size={16} color="#FFFFFF" />
// // //                 </View>
// // //                 <View>
// // //                   <Text style={styles.progressTitle}>Players joined</Text>
// // //                   <Text style={styles.progressSub}>Waiting for the room to fill up</Text>
// // //                 </View>
// // //               </View>
// // //               <Text style={styles.progressCount}>{room.players.length}/{room.maxPlayers}</Text>
// // //             </View>
// // //             <View style={styles.progressTrack}>
// // //               <View style={[styles.progressFill, { width: `${fillPct}%` }]} />
// // //             </View>
// // //           </View>

// // //           {!isHost && (
// // //             <View style={styles.hostNotice}>
// // //               <Ionicons name="lock-closed-outline" size={13} color={C.sub} />
// // //               <Text style={styles.hostNoticeText}>Only the host can change room settings</Text>
// // //             </View>
// // //           )}

// // //           {/* ---- Rounds / Time — 2-column colorful cards, like Create/Join Room ---- */}
// // //           <View style={styles.sectionHeadRow}>
// // //             <View>
// // //               <Text style={styles.sectionTitle}>Game Settings</Text>
// // //               <Text style={styles.sectionSub}>Rounds and timing for this room</Text>
// // //             </View>
// // //           </View>

// // //           <View style={[styles.twoColRow, !wide && styles.twoColRowPhone]}>
// // //             <TouchableOpacity
// // //               style={[styles.settingCard, styles.settingCardCoral, wide && { flex: 1 }]}
// // //               activeOpacity={canEdit ? 0.85 : 1}
// // //               disabled={!canEdit}
// // //               onPress={() => setEditing("rounds")}
// // //             >
// // //               <View style={styles.settingIconWrap}>
// // //                 <Ionicons name="repeat" size={18} color="#FFFFFF" />
// // //               </View>
// // //               <Text style={styles.settingValue}>{room.totalRounds} Rounds</Text>
// // //               <Text style={styles.settingLabel}>Total rounds this game</Text>
// // //               {canEdit ? (
// // //                 <View style={styles.settingArrow}>
// // //                   <Ionicons name="arrow-forward" size={14} color={C.coral} />
// // //                 </View>
// // //               ) : null}
// // //             </TouchableOpacity>

// // //             <TouchableOpacity
// // //               style={[styles.settingCard, styles.settingCardIndigo, wide && { flex: 1 }]}
// // //               activeOpacity={canEdit ? 0.85 : 1}
// // //               disabled={!canEdit}
// // //               onPress={() => setEditing("time")}
// // //             >
// // //               <View style={[styles.settingIconWrap, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
// // //                 <Ionicons name="time" size={18} color="#FFFFFF" />
// // //               </View>
// // //               <Text style={[styles.settingValue, { color: "#FFFFFF" }]}>{room.timePerRoundSec}s per round</Text>
// // //               <Text style={[styles.settingLabel, { color: "rgba(255,255,255,0.75)" }]}>Timer for each word</Text>
// // //               {canEdit ? (
// // //                 <View style={[styles.settingArrow, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
// // //                   <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
// // //                 </View>
// // //               ) : null}
// // //             </TouchableOpacity>
// // //           </View>

// // //           {/* ---- Room Type / Game Type pills ---- */}
// // //           <View style={styles.pillsRow}>
// // //             <View style={styles.infoPill}>
// // //               <Ionicons name="globe-outline" size={14} color={C.indigo} />
// // //               <Text style={styles.infoPillText}>{room.roomType === "public" ? "Public room" : "Private room"}</Text>
// // //             </View>
// // //             <View style={styles.infoPill}>
// // //               <Ionicons name="game-controller-outline" size={14} color={C.indigo} />
// // //               <Text style={styles.infoPillText}>Word Scramble</Text>
// // //             </View>
// // //           </View>

// // //           {/* ---- Invite — dark banner, like Daily Challenge ---- */}
// // //           <TouchableOpacity style={styles.darkBanner} activeOpacity={0.9} onPress={handleShare}>
// // //             <View style={styles.darkBannerLeft}>
// // //               <View style={styles.darkBannerIconWrap}>
// // //                 <Ionicons name="person-add" size={18} color={C.dark} />
// // //               </View>
// // //               <View>
// // //                 <Text style={styles.darkBannerTitle}>Bring your friends in</Text>
// // //                 <Text style={styles.darkBannerSub}>Tap to share the room code</Text>
// // //               </View>
// // //             </View>
// // //             <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
// // //           </TouchableOpacity>

// // //           {/* ---- Leave room ---- */}
// // //           <TouchableOpacity
// // //             style={styles.leaveButton}
// // //             activeOpacity={0.88}
// // //             onPress={() => setConfirmLeave(true)}
// // //           >
// // //             <Ionicons name="exit-outline" size={17} color="#FFFFFF" />
// // //             <Text style={styles.leaveButtonText}>Leave Room</Text>
// // //           </TouchableOpacity>
// // //         </ScrollView>

// // //         {/* ---- Bottom sheet: pick Rounds or Time ---- */}
// // //         <Modal transparent visible={editing !== null} animationType="slide" onRequestClose={() => setEditing(null)}>
// // //           <View style={styles.sheetOverlay}>
// // //             <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setEditing(null)} />
// // //             <View style={styles.sheet}>
// // //               <View style={styles.sheetHandle} />
// // //               <Text style={styles.sheetTitle}>
// // //                 {editing === "rounds" ? "Select Rounds" : "Select Time per Round"}
// // //               </Text>

// // //               <ScrollView contentContainerStyle={styles.chipsWrap}>
// // //                 {(editing === "rounds" ? ROUND_OPTIONS : TIME_OPTIONS).map((opt) => {
// // //                   const current = editing === "rounds" ? room.totalRounds : room.timePerRoundSec;
// // //                   const selected = opt === current;
// // //                   return (
// // //                     <TouchableOpacity
// // //                       key={opt}
// // //                       style={[styles.chip, selected && styles.chipSelected]}
// // //                       disabled={saving}
// // //                       onPress={() => applySetting(editing, opt)}
// // //                       activeOpacity={0.85}
// // //                     >
// // //                       {saving && selected ? (
// // //                         <ActivityIndicator size="small" color="#FFFFFF" />
// // //                       ) : (
// // //                         <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
// // //                           {editing === "rounds" ? `${opt} Rounds` : `${opt}s`}
// // //                         </Text>
// // //                       )}
// // //                     </TouchableOpacity>
// // //                   );
// // //                 })}
// // //               </ScrollView>
// // //             </View>
// // //           </View>
// // //         </Modal>

// // //         {/* ---- Confirm leave ---- */}
// // //         <Modal transparent visible={confirmLeave} animationType="fade" onRequestClose={() => setConfirmLeave(false)}>
// // //           <View style={styles.confirmOverlay}>
// // //             <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => !leaving && setConfirmLeave(false)} />
// // //             <View style={styles.confirmCard}>
// // //               <View style={styles.confirmIconWrap}>
// // //                 <Ionicons name="exit-outline" size={22} color={C.red} />
// // //               </View>
// // //               <Text style={styles.confirmTitle}>Leave this room?</Text>
// // //               <Text style={styles.confirmSub}>
// // //                 {isHost
// // //                   ? "You're the host — leaving may end the room for everyone."
// // //                   : "You can rejoin later with the room code."}
// // //               </Text>
// // //               <View style={styles.confirmActions}>
// // //                 <TouchableOpacity
// // //                   style={styles.confirmCancel}
// // //                   onPress={() => setConfirmLeave(false)}
// // //                   disabled={leaving}
// // //                   activeOpacity={0.8}
// // //                 >
// // //                   <Text style={styles.confirmCancelText}>Cancel</Text>
// // //                 </TouchableOpacity>
// // //                 <TouchableOpacity
// // //                   style={styles.confirmLeaveBtn}
// // //                   onPress={handleConfirmLeave}
// // //                   disabled={leaving}
// // //                   activeOpacity={0.88}
// // //                 >
// // //                   {leaving ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.confirmLeaveText}>Leave</Text>}
// // //                 </TouchableOpacity>
// // //               </View>
// // //             </View>
// // //           </View>
// // //         </Modal>
// // //       </SafeAreaView>
// // //     </View>
// // //   );
// // // };

// // // export default RoomSettingsScreen;

// // // const styles = StyleSheet.create({
// // //   flex: { flex: 1, backgroundColor: C.bg },

// // //   topRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 12,
// // //     paddingHorizontal: 20,
// // //     paddingTop: 8,
// // //     paddingBottom: 14,
// // //   },
// // //   roundButton: {
// // //     width: 38,
// // //     height: 38,
// // //     borderRadius: 19,
// // //     backgroundColor: C.card,
// // //     borderWidth: 1,
// // //     borderColor: C.border,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   topTitle: { color: C.text, fontWeight: "900", fontSize: 17 },
// // //   topSub: { color: C.sub, fontSize: 12, marginTop: 1 },

// // //   statusPill: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 6,
// // //     paddingVertical: 6,
// // //     paddingHorizontal: 12,
// // //     borderRadius: 12,
// // //   },
// // //   statusDot: { width: 6, height: 6, borderRadius: 3 },
// // //   statusText: { fontSize: 11.5, fontWeight: "800" },

// // //   scroll: { paddingTop: 4, paddingBottom: 44 },

// // //   errorBanner: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 8,
// // //     backgroundColor: C.redSoft,
// // //     borderRadius: 12,
// // //     paddingVertical: 10,
// // //     paddingHorizontal: 12,
// // //     marginBottom: 14,
// // //   },
// // //   errorText: { color: C.red, fontSize: 12.5, flex: 1 },

// // //   /* ---- hero ---- */
// // //   heroSection: { marginBottom: 22 },
// // //   eyebrow: {
// // //     color: C.coral,
// // //     fontSize: 12,
// // //     fontWeight: "800",
// // //     letterSpacing: 1.5,
// // //     marginBottom: 6,
// // //   },
// // //   heroTitle: { color: C.text, fontSize: 30, fontWeight: "900", lineHeight: 36 },
// // //   heroTitlePhone: { fontSize: 26, lineHeight: 32 },
// // //   heroTitleAccent: { color: C.indigo, fontSize: 30, fontWeight: "900", lineHeight: 36 },

// // //   tilesRow: {
// // //     flexDirection: "row",
// // //     gap: 10,
// // //     marginTop: 22,
// // //     marginBottom: 20,
// // //     flexWrap: "wrap",
// // //   },
// // //   tile: {
// // //     width: 52,
// // //     height: 52,
// // //     borderRadius: 15,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     shadowOpacity: 0.25,
// // //     shadowRadius: 8,
// // //     shadowOffset: { width: 0, height: 5 },
// // //     elevation: 3,
// // //   },
// // //   tileText: { color: "#FFFFFF", fontSize: 24, fontWeight: "900" },

// // //   heroActionsRow: { flexDirection: "row", alignItems: "center", gap: 10 },
// // //   copyBtn: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 8,
// // //     backgroundColor: C.indigo,
// // //     paddingVertical: 13,
// // //     paddingHorizontal: 22,
// // //     borderRadius: 14,
// // //   },
// // //   copyBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
// // //   shareIconBtn: {
// // //     width: 46,
// // //     height: 46,
// // //     borderRadius: 14,
// // //     backgroundColor: C.indigoSoft,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },

// // //   /* ---- progress card ---- */
// // //   progressCard: {
// // //     backgroundColor: C.card,
// // //     borderRadius: 20,
// // //     borderWidth: 1,
// // //     borderColor: C.border,
// // //     padding: 18,
// // //     marginBottom: 16,
// // //   },
// // //   progressRow: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 12,
// // //   },
// // //   progressLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
// // //   progressIconWrap: {
// // //     width: 34,
// // //     height: 34,
// // //     borderRadius: 11,
// // //     backgroundColor: C.indigo,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   progressTitle: { color: C.text, fontSize: 14, fontWeight: "800" },
// // //   progressSub: { color: C.sub, fontSize: 11.5, marginTop: 1 },
// // //   progressCount: { color: C.text, fontSize: 15, fontWeight: "900" },
// // //   progressTrack: { height: 8, borderRadius: 4, backgroundColor: C.greySoft, overflow: "hidden" },
// // //   progressFill: { height: "100%", borderRadius: 4, backgroundColor: C.indigo },

// // //   hostNotice: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 22 },
// // //   hostNoticeText: { color: C.sub, fontSize: 12 },

// // //   /* ---- section head ---- */
// // //   sectionHeadRow: { marginBottom: 14 },
// // //   sectionTitle: { color: C.text, fontSize: 18, fontWeight: "900" },
// // //   sectionSub: { color: C.sub, fontSize: 12.5, marginTop: 2 },

// // //   /* ---- two-column setting cards (mirrors Create/Join Room) ---- */
// // //   twoColRow: { flexDirection: "row", gap: 14, marginBottom: 18 },
// // //   twoColRowPhone: { flexDirection: "column" },
// // //   settingCard: {
// // //     borderRadius: 20,
// // //     padding: 18,
// // //     minHeight: 130,
// // //     justifyContent: "space-between",
// // //   },
// // //   settingCardCoral: {
// // //     backgroundColor: C.coralSoft,
// // //   },
// // //   settingCardIndigo: {
// // //     backgroundColor: C.indigo,
// // //   },
// // //   settingIconWrap: {
// // //     width: 34,
// // //     height: 34,
// // //     borderRadius: 11,
// // //     backgroundColor: C.coral,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     marginBottom: 12,
// // //   },
// // //   settingValue: { color: C.text, fontSize: 16, fontWeight: "900" },
// // //   settingLabel: { color: C.sub, fontSize: 11.5, marginTop: 3 },
// // //   settingArrow: {
// // //     position: "absolute",
// // //     top: 16,
// // //     right: 16,
// // //     width: 26,
// // //     height: 26,
// // //     borderRadius: 13,
// // //     backgroundColor: "rgba(255,107,87,0.15)",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },

// // //   /* ---- info pills ---- */
// // //   pillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 22 },
// // //   infoPill: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 7,
// // //     backgroundColor: C.indigoSoft,
// // //     paddingVertical: 8,
// // //     paddingHorizontal: 14,
// // //     borderRadius: 12,
// // //   },
// // //   infoPillText: { color: C.indigo, fontSize: 12.5, fontWeight: "700" },

// // //   /* ---- dark invite banner ---- */
// // //   darkBanner: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     backgroundColor: C.dark,
// // //     borderRadius: 18,
// // //     paddingVertical: 16,
// // //     paddingHorizontal: 18,
// // //     marginBottom: 20,
// // //   },
// // //   darkBannerLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
// // //   darkBannerIconWrap: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 11,
// // //     backgroundColor: C.yellow,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   darkBannerTitle: { color: "#FFFFFF", fontSize: 14.5, fontWeight: "800" },
// // //   darkBannerSub: { color: "rgba(255,255,255,0.55)", fontSize: 11.5, marginTop: 2 },

// // //   /* ---- leave ---- */
// // //   leaveButton: {
// // //     flexDirection: "row",
// // //     gap: 8,
// // //     height: 56,
// // //     borderRadius: 16,
// // //     backgroundColor: C.red,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     shadowColor: C.red,
// // //     shadowOpacity: 0.25,
// // //     shadowRadius: 12,
// // //     shadowOffset: { width: 0, height: 6 },
// // //     elevation: 4,
// // //   },
// // //   leaveButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },

// // //   /* ---- sheets ---- */
// // //   sheetOverlay: { flex: 1, justifyContent: "flex-end" },
// // //   sheetBackdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(20,27,52,0.4)" },
// // //   sheet: {
// // //     backgroundColor: C.card,
// // //     borderTopLeftRadius: 24,
// // //     borderTopRightRadius: 24,
// // //     paddingTop: 10,
// // //     paddingHorizontal: 20,
// // //     paddingBottom: 30,
// // //     maxHeight: "50%",
// // //   },
// // //   sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: "center", marginBottom: 14 },
// // //   sheetTitle: { color: C.text, fontWeight: "800", fontSize: 16, marginBottom: 16, textAlign: "center" },
// // //   chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center", paddingBottom: 10 },
// // //   chip: {
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 20,
// // //     borderRadius: 14,
// // //     backgroundColor: C.greySoft,
// // //     borderWidth: 1,
// // //     borderColor: C.border,
// // //     minWidth: 90,
// // //     alignItems: "center",
// // //   },
// // //   chipSelected: { backgroundColor: C.indigo, borderColor: C.indigo },
// // //   chipText: { color: C.text, fontWeight: "700", fontSize: 13 },
// // //   chipTextSelected: { color: "#FFFFFF" },

// // //   confirmOverlay: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
// // //   confirmCard: { width: "100%", maxWidth: 340, backgroundColor: C.card, borderRadius: 22, padding: 24, alignItems: "center" },
// // //   confirmIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.redSoft, justifyContent: "center", alignItems: "center", marginBottom: 14 },
// // //   confirmTitle: { color: C.text, fontWeight: "800", fontSize: 16, marginBottom: 6 },
// // //   confirmSub: { color: C.sub, fontSize: 12.5, textAlign: "center", lineHeight: 18, marginBottom: 20 },
// // //   confirmActions: { flexDirection: "row", gap: 10, width: "100%" },
// // //   confirmCancel: { flex: 1, height: 46, borderRadius: 13, backgroundColor: C.greySoft, justifyContent: "center", alignItems: "center" },
// // //   confirmCancelText: { color: C.text, fontWeight: "700", fontSize: 13.5 },
// // //   confirmLeaveBtn: { flex: 1, height: 46, borderRadius: 13, backgroundColor: C.red, justifyContent: "center", alignItems: "center" },
// // //   confirmLeaveText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13.5 },
// // // });
// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Share,
// //   SafeAreaView,
// //   StatusBar,
// //   Modal,
// //   ScrollView,
// //   ActivityIndicator,
// //   useWindowDimensions,
// //   Platform,
// // } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";
// // import { WordScrambleRoom, updateRoomSettings } from "../api/Wordscrambleapi";

// // type RoomWithTiming = WordScrambleRoom & { timePerRoundSec: number };

// // interface RoomSettingsScreenProps {
// //   room: RoomWithTiming;
// //   playerName: string;
// //   onBack: () => void;
// //   onLeaveRoom: () => void;
// //   onRoomUpdated: (room: RoomWithTiming) => void;
// // }

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
// //   red: "#E5484D",
// //   redSoft: "#FDECEC",
// //   grey: "#8A93A6",
// //   greySoft: "#F1EEF0",
// //   green: "#22B573",
// //   greenSoft: "#E3F6EC",
// //   dark: "#171B2E",
// //   yellow: "#F2B640",
// // };

// // const TILE_COLORS = [C.coral, C.indigo, "#F0566A", C.green];

// // const ROUND_OPTIONS = [5, 10, 15, 20];
// // const TIME_OPTIONS = [10, 15, 20, 30, 45, 60];

// // type EditingField = "rounds" | "time" | null;

// // const RoomSettingsScreen: React.FC<RoomSettingsScreenProps> = ({
// //   room,
// //   playerName,
// //   onBack,
// //   onLeaveRoom,
// //   onRoomUpdated,
// // }) => {
// //   const { width } = useWindowDimensions();
// //   const wide = width >= 700;

// //   const [editing, setEditing] = useState<EditingField>(null);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [copied, setCopied] = useState(false);
// //   const [confirmLeave, setConfirmLeave] = useState(false);
// //   const [leaving, setLeaving] = useState(false);

// //   const isHost = room.hostPlayerName === playerName;
// //   const canEdit = isHost && room.status === "waiting";
// //   const fillPct = room.maxPlayers > 0 ? Math.min(100, (room.players.length / room.maxPlayers) * 100) : 0;

// //   const handleShare = () => {
// //     Share.share({ message: `Join my Word Scramble room! Code: ${room.roomCode}` });
// //   };

// //   const handleCopy = async () => {
// //     try {
// //       const nav: any = typeof navigator !== "undefined" ? navigator : null;
// //       if (Platform.OS === "web" && nav?.clipboard?.writeText) {
// //         await nav.clipboard.writeText(room.roomCode);
// //         setCopied(true);
// //         setTimeout(() => setCopied(false), 1600);
// //         return;
// //       }
// //       await Share.share({ message: room.roomCode });
// //     } catch {
// //       // ignore
// //     }
// //   };

// //   const applySetting = async (field: EditingField, value: number) => {
// //     if (!field) return;
// //     setSaving(true);
// //     setError(null);
// //     try {
// //       const updated = await updateRoomSettings(room.roomCode, playerName, {
// //         totalRounds: field === "rounds" ? value : room.totalRounds,
// //         timePerRoundSec: field === "time" ? value : room.timePerRoundSec,
// //       });
// //       onRoomUpdated(updated as RoomWithTiming);
// //       setEditing(null);
// //     } catch (err: any) {
// //       setError(err.message || "Could not update settings");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const handleConfirmLeave = async () => {
// //     setLeaving(true);
// //     try {
// //       await onLeaveRoom();
// //     } finally {
// //       setLeaving(false);
// //       setConfirmLeave(false);
// //     }
// //   };

// //   return (
// //     <View style={styles.flex}>
// //       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
// //       <SafeAreaView style={styles.flex}>
// //         {/* ---- top bar ---- */}
// //         <View style={styles.topBarOuter}>
// //           <View style={[styles.topRow, styles.page]}>
// //             <TouchableOpacity onPress={onBack} style={styles.roundButton} activeOpacity={0.8}>
// //               <Ionicons name="chevron-back" size={20} color={C.text} />
// //             </TouchableOpacity>
// //             <View style={{ flex: 1 }}>
// //               <Text style={styles.topTitle}>Room Settings</Text>
// //               <Text style={styles.topSub}>Manage your word battle</Text>
// //             </View>
// //             <View style={[styles.statusPill, { backgroundColor: room.status === "waiting" ? C.greenSoft : C.indigoSoft }]}>
// //               <View style={[styles.statusDot, { backgroundColor: room.status === "waiting" ? C.green : C.indigo }]} />
// //               <Text style={[styles.statusText, { color: room.status === "waiting" ? C.green : C.indigo }]}>
// //                 {room.status === "waiting" ? "Waiting" : room.status}
// //               </Text>
// //             </View>
// //           </View>
// //         </View>

// //         <ScrollView
// //           contentContainerStyle={[styles.scroll, { paddingHorizontal: wide ? 32 : 16 }]}
// //           showsVerticalScrollIndicator={false}
// //         >
// //           {/* FIX: this content used to stretch to whatever the outer screen
// //               width was, with no cap — that's why the two Game Settings cards
// //               blew up into huge, mostly-empty slabs on a wide/desktop
// //               viewport. Capping it at a sensible max width and centering it
// //               keeps the cards a proper, structured size no matter how wide
// //               the screen is. */}
// //           <View style={styles.page}>
// //             {error && (
// //               <View style={styles.errorBanner}>
// //                 <Ionicons name="alert-circle-outline" size={14} color={C.red} />
// //                 <Text style={styles.errorText}>{error}</Text>
// //               </View>
// //             )}

// //             {/* ---- hero: big code tiles, like the W-O-R-D tiles on Home ---- */}
// //             <View style={styles.heroSection}>
// //               <Text style={styles.eyebrow}>ROOM CODE</Text>
// //               <Text style={[styles.heroTitle, !wide && styles.heroTitlePhone]}>Share this code</Text>
// //               <Text style={styles.heroTitleAccent}>to invite friends</Text>

// //               <View style={styles.tilesRow}>
// //                 {room.roomCode.split("").map((ch, i) => (
// //                   <View key={i} style={[styles.tile, { backgroundColor: TILE_COLORS[i % TILE_COLORS.length] }]}>
// //                     <Text style={styles.tileText}>{ch}</Text>
// //                   </View>
// //                 ))}
// //               </View>

// //               <View style={styles.heroActionsRow}>
// //                 <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.88}>
// //                   <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color="#FFFFFF" />
// //                   <Text style={styles.copyBtnText}>{copied ? "Copied!" : "Copy code"}</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity style={styles.shareIconBtn} onPress={handleShare} activeOpacity={0.85}>
// //                   <Ionicons name="share-social-outline" size={17} color={C.indigo} />
// //                 </TouchableOpacity>
// //               </View>
// //             </View>

// //             {/* ---- players progress card ---- */}
// //             <View style={styles.progressCard}>
// //               <View style={styles.progressRow}>
// //                 <View style={styles.progressLeft}>
// //                   <View style={styles.progressIconWrap}>
// //                     <Ionicons name="people" size={16} color="#FFFFFF" />
// //                   </View>
// //                   <View>
// //                     <Text style={styles.progressTitle}>Players joined</Text>
// //                     <Text style={styles.progressSub}>Waiting for the room to fill up</Text>
// //                   </View>
// //                 </View>
// //                 <Text style={styles.progressCount}>{room.players.length}/{room.maxPlayers}</Text>
// //               </View>
// //               <View style={styles.progressTrack}>
// //                 <View style={[styles.progressFill, { width: `${fillPct}%` }]} />
// //               </View>
// //             </View>

// //             {!isHost && (
// //               <View style={styles.hostNotice}>
// //                 <Ionicons name="lock-closed-outline" size={13} color={C.sub} />
// //                 <Text style={styles.hostNoticeText}>Only the host can change room settings</Text>
// //               </View>
// //             )}

// //             {/* ---- Rounds / Time — 2-column colorful cards, like Create/Join Room ---- */}
// //             <View style={styles.sectionHeadRow}>
// //               <View>
// //                 <Text style={styles.sectionTitle}>Game Settings</Text>
// //                 <Text style={styles.sectionSub}>Rounds and timing for this room</Text>
// //               </View>
// //             </View>

// //             {/* FIX: Rounds/Timer used to be the only two items in this row,
// //                 so on a wide screen each one stretched to fill half the full
// //                 width and ended up looking like an oversized, mostly-empty
// //                 slab. Room Type and Game Type (previously tiny pills below)
// //                 now join the same grid as equal-sized cards, so four modest
// //                 cards fill the row edge to edge instead of two giant ones —
// //                 and flexWrap lets them reflow onto more rows on narrow
// //                 screens without needing a separate "phone" layout. */}
// //             <View style={styles.settingsGrid}>
// //               <TouchableOpacity
// //                 style={[styles.settingCard, styles.settingCardCoral]}
// //                 activeOpacity={canEdit ? 0.85 : 1}
// //                 disabled={!canEdit}
// //                 onPress={() => setEditing("rounds")}
// //               >
// //                 <View style={styles.settingIconWrap}>
// //                   <Ionicons name="repeat" size={18} color="#FFFFFF" />
// //                 </View>
// //                 <Text style={styles.settingValue}>{room.totalRounds} Rounds</Text>
// //                 <Text style={styles.settingLabel}>Total rounds this game</Text>
// //                 {canEdit ? (
// //                   <View style={styles.settingArrow}>
// //                     <Ionicons name="arrow-forward" size={14} color={C.coral} />
// //                   </View>
// //                 ) : null}
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={[styles.settingCard, styles.settingCardIndigo]}
// //                 activeOpacity={canEdit ? 0.85 : 1}
// //                 disabled={!canEdit}
// //                 onPress={() => setEditing("time")}
// //               >
// //                 <View style={[styles.settingIconWrap, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
// //                   <Ionicons name="time" size={18} color="#FFFFFF" />
// //                 </View>
// //                 <Text style={[styles.settingValue, { color: "#FFFFFF" }]}>{room.timePerRoundSec}s per round</Text>
// //                 <Text style={[styles.settingLabel, { color: "rgba(255,255,255,0.75)" }]}>Timer for each word</Text>
// //                 {canEdit ? (
// //                   <View style={[styles.settingArrow, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
// //                     <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
// //                   </View>
// //                 ) : null}
// //               </TouchableOpacity>

// //               <View style={[styles.settingCard, styles.settingCardSoft]}>
// //                 <View style={[styles.settingIconWrap, { backgroundColor: C.indigo }]}>
// //                   <Ionicons name="globe-outline" size={18} color="#FFFFFF" />
// //                 </View>
// //                 <Text style={styles.settingValue}>{room.roomType === "public" ? "Public room" : "Private room"}</Text>
// //                 <Text style={styles.settingLabel}>Who can join</Text>
// //               </View>

// //               <View style={[styles.settingCard, styles.settingCardSoft]}>
// //                 <View style={[styles.settingIconWrap, { backgroundColor: C.indigo }]}>
// //                   <Ionicons name="game-controller-outline" size={18} color="#FFFFFF" />
// //                 </View>
// //                 <Text style={styles.settingValue}>Word Scramble</Text>
// //                 <Text style={styles.settingLabel}>Game mode</Text>
// //               </View>
// //             </View>

// //             {/* FIX: on a wide screen, the invite banner and Leave Room
// //                 button used to each stretch full-width on their own line —
// //                 a single short button spanning the whole desktop width looks
// //                 oversized. Placing them side by side on wide screens keeps
// //                 each one a normal button width while the row together still
// //                 fills the full space, no side gap. They stay stacked full
// //                 width on phone, where that's the natural button size. */}
// //             <View style={[styles.bottomActionsRow, !wide && styles.bottomActionsRowPhone]}>
// //               <TouchableOpacity
// //                 style={[styles.darkBanner, wide && styles.bottomActionFlex]}
// //                 activeOpacity={0.9}
// //                 onPress={handleShare}
// //               >
// //                 <View style={styles.darkBannerLeft}>
// //                   <View style={styles.darkBannerIconWrap}>
// //                     <Ionicons name="person-add" size={18} color={C.dark} />
// //                   </View>
// //                   <View>
// //                     <Text style={styles.darkBannerTitle}>Bring your friends in</Text>
// //                     <Text style={styles.darkBannerSub}>Tap to share the room code</Text>
// //                   </View>
// //                 </View>
// //                 <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={[styles.leaveButton, wide && styles.bottomActionFlex]}
// //                 activeOpacity={0.88}
// //                 onPress={() => setConfirmLeave(true)}
// //               >
// //                 <Ionicons name="exit-outline" size={17} color="#FFFFFF" />
// //                 <Text style={styles.leaveButtonText}>Leave Room</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </ScrollView>

// //         {/* ---- Bottom sheet: pick Rounds or Time ---- */}
// //         <Modal transparent visible={editing !== null} animationType="slide" onRequestClose={() => setEditing(null)}>
// //           <View style={styles.sheetOverlay}>
// //             <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setEditing(null)} />
// //             <View style={styles.sheet}>
// //               <View style={styles.sheetHandle} />
// //               <Text style={styles.sheetTitle}>
// //                 {editing === "rounds" ? "Select Rounds" : "Select Time per Round"}
// //               </Text>

// //               <ScrollView contentContainerStyle={styles.chipsWrap}>
// //                 {(editing === "rounds" ? ROUND_OPTIONS : TIME_OPTIONS).map((opt) => {
// //                   const current = editing === "rounds" ? room.totalRounds : room.timePerRoundSec;
// //                   const selected = opt === current;
// //                   return (
// //                     <TouchableOpacity
// //                       key={opt}
// //                       style={[styles.chip, selected && styles.chipSelected]}
// //                       disabled={saving}
// //                       onPress={() => applySetting(editing, opt)}
// //                       activeOpacity={0.85}
// //                     >
// //                       {saving && selected ? (
// //                         <ActivityIndicator size="small" color="#FFFFFF" />
// //                       ) : (
// //                         <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
// //                           {editing === "rounds" ? `${opt} Rounds` : `${opt}s`}
// //                         </Text>
// //                       )}
// //                     </TouchableOpacity>
// //                   );
// //                 })}
// //               </ScrollView>
// //             </View>
// //           </View>
// //         </Modal>

// //         {/* ---- Confirm leave ---- */}
// //         <Modal transparent visible={confirmLeave} animationType="fade" onRequestClose={() => setConfirmLeave(false)}>
// //           <View style={styles.confirmOverlay}>
// //             <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => !leaving && setConfirmLeave(false)} />
// //             <View style={styles.confirmCard}>
// //               <View style={styles.confirmIconWrap}>
// //                 <Ionicons name="exit-outline" size={22} color={C.red} />
// //               </View>
// //               <Text style={styles.confirmTitle}>Leave this room?</Text>
// //               <Text style={styles.confirmSub}>
// //                 {isHost
// //                   ? "You're the host — leaving may end the room for everyone."
// //                   : "You can rejoin later with the room code."}
// //               </Text>
// //               <View style={styles.confirmActions}>
// //                 <TouchableOpacity
// //                   style={styles.confirmCancel}
// //                   onPress={() => setConfirmLeave(false)}
// //                   disabled={leaving}
// //                   activeOpacity={0.8}
// //                 >
// //                   <Text style={styles.confirmCancelText}>Cancel</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   style={styles.confirmLeaveBtn}
// //                   onPress={handleConfirmLeave}
// //                   disabled={leaving}
// //                   activeOpacity={0.88}
// //                 >
// //                   {leaving ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.confirmLeaveText}>Leave</Text>}
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           </View>
// //         </Modal>
// //       </SafeAreaView>
// //     </View>
// //   );
// // };

// // export default RoomSettingsScreen;

// // const styles = StyleSheet.create({
// //   flex: { flex: 1, backgroundColor: C.bg },

// //   // FIX: this used to cap the page at maxWidth: 640, which is what left the
// //   // empty gutters down the sides. Full width now — the settings grid below
// //   // handles keeping individual cards a sane size, instead of the page cap
// //   // doing it (which just moved the empty space from inside the cards to
// //   // outside them).
// //   page: {
// //     width: "100%",
// //   },

// //   topBarOuter: {
// //     paddingHorizontal: 20,
// //     paddingTop: 8,
// //     paddingBottom: 14,
// //   },
// //   topRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 12,
// //   },
// //   roundButton: {
// //     width: 38,
// //     height: 38,
// //     borderRadius: 19,
// //     backgroundColor: C.card,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   topTitle: { color: C.text, fontWeight: "900", fontSize: 17 },
// //   topSub: { color: C.sub, fontSize: 12, marginTop: 1 },

// //   statusPill: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //     paddingVertical: 6,
// //     paddingHorizontal: 12,
// //     borderRadius: 12,
// //   },
// //   statusDot: { width: 6, height: 6, borderRadius: 3 },
// //   statusText: { fontSize: 11.5, fontWeight: "800" },

// //   scroll: { paddingTop: 4, paddingBottom: 20 },

// //   errorBanner: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //     backgroundColor: C.redSoft,
// //     borderRadius: 12,
// //     paddingVertical: 10,
// //     paddingHorizontal: 12,
// //     marginBottom: 14,
// //   },
// //   errorText: { color: C.red, fontSize: 12.5, flex: 1 },

// //   /* ---- hero ---- */
// //   heroSection: { marginBottom: 22 },
// //   eyebrow: {
// //     color: C.coral,
// //     fontSize: 12,
// //     fontWeight: "800",
// //     letterSpacing: 1.5,
// //     marginBottom: 6,
// //   },
// //   heroTitle: { color: C.text, fontSize: 30, fontWeight: "900", lineHeight: 36 },
// //   heroTitlePhone: { fontSize: 26, lineHeight: 32 },
// //   heroTitleAccent: { color: C.indigo, fontSize: 30, fontWeight: "900", lineHeight: 36 },

// //   tilesRow: {
// //     flexDirection: "row",
// //     gap: 10,
// //     marginTop: 22,
// //     marginBottom: 20,
// //     flexWrap: "wrap",
// //   },
// //   tile: {
// //     width: 52,
// //     height: 52,
// //     borderRadius: 15,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     shadowOpacity: 0.25,
// //     shadowRadius: 8,
// //     shadowOffset: { width: 0, height: 5 },
// //     elevation: 3,
// //   },
// //   tileText: { color: "#FFFFFF", fontSize: 24, fontWeight: "900" },

// //   heroActionsRow: { flexDirection: "row", alignItems: "center", gap: 10 },
// //   copyBtn: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //     backgroundColor: C.indigo,
// //     paddingVertical: 13,
// //     paddingHorizontal: 22,
// //     borderRadius: 14,
// //   },
// //   copyBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
// //   shareIconBtn: {
// //     width: 46,
// //     height: 46,
// //     borderRadius: 14,
// //     backgroundColor: C.indigoSoft,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   /* ---- progress card ---- */
// //   progressCard: {
// //     backgroundColor: C.card,
// //     borderRadius: 20,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     padding: 18,
// //     marginBottom: 16,
// //   },
// //   progressRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 12,
// //   },
// //   progressLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
// //   progressIconWrap: {
// //     width: 34,
// //     height: 34,
// //     borderRadius: 11,
// //     backgroundColor: C.indigo,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   progressTitle: { color: C.text, fontSize: 14, fontWeight: "800" },
// //   progressSub: { color: C.sub, fontSize: 11.5, marginTop: 1 },
// //   progressCount: { color: C.text, fontSize: 15, fontWeight: "900" },
// //   progressTrack: { height: 8, borderRadius: 4, backgroundColor: C.greySoft, overflow: "hidden" },
// //   progressFill: { height: "100%", borderRadius: 4, backgroundColor: C.indigo },

// //   hostNotice: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 22 },
// //   hostNoticeText: { color: C.sub, fontSize: 12 },

// //   /* ---- section head ---- */
// //   sectionHeadRow: { marginBottom: 14 },
// //   sectionTitle: { color: C.text, fontSize: 18, fontWeight: "900" },
// //   sectionSub: { color: C.sub, fontSize: 12.5, marginTop: 2 },

// //   /* ---- settings grid: fills the full row width with same-sized cards
// //      instead of stretching 1-2 cards into oversized slabs. Each card grows
// //      to share the row evenly but is capped at maxWidth, and wraps onto a
// //      new row once there's no more space. ---- */
// //   settingsGrid: {
// //     flexDirection: "row",
// //     flexWrap: "wrap",
// //     gap: 14,
// //     marginBottom: 18,
// //   },
// //   settingCard: {
// //     flexGrow: 1,
// //     flexBasis: 220,
// //     maxWidth: 320,
// //     borderRadius: 20,
// //     padding: 18,
// //     minHeight: 130,
// //     justifyContent: "space-between",
// //   },
// //   settingCardCoral: {
// //     backgroundColor: C.coralSoft,
// //   },
// //   settingCardIndigo: {
// //     backgroundColor: C.indigo,
// //   },
// //   settingCardSoft: {
// //     backgroundColor: C.card,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //   },
// //   settingIconWrap: {
// //     width: 34,
// //     height: 34,
// //     borderRadius: 11,
// //     backgroundColor: C.coral,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginBottom: 12,
// //   },
// //   settingValue: { color: C.text, fontSize: 16, fontWeight: "900" },
// //   settingLabel: { color: C.sub, fontSize: 11.5, marginTop: 3 },
// //   settingArrow: {
// //     position: "absolute",
// //     top: 16,
// //     right: 16,
// //     width: 26,
// //     height: 26,
// //     borderRadius: 13,
// //     backgroundColor: "rgba(255,107,87,0.15)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   /* ---- bottom actions: banner + leave button share one row on wide
// //      screens so neither has to stretch full-width alone ---- */
// //   bottomActionsRow: {
// //     flexDirection: "row",
// //     alignItems: "stretch",
// //     gap: 14,
// //   },
// //   bottomActionsRowPhone: {
// //     flexDirection: "column",
// //   },
// //   bottomActionFlex: {
// //     flex: 1,
// //   },

// //   /* ---- dark invite banner ---- */
// //   darkBanner: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     backgroundColor: C.dark,
// //     borderRadius: 18,
// //     paddingVertical: 16,
// //     paddingHorizontal: 18,
// //   },
// //   darkBannerLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
// //   darkBannerIconWrap: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 11,
// //     backgroundColor: C.yellow,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   darkBannerTitle: { color: "#FFFFFF", fontSize: 14.5, fontWeight: "800" },
// //   darkBannerSub: { color: "rgba(255,255,255,0.55)", fontSize: 11.5, marginTop: 2 },

// //   /* ---- leave ---- */
// //   leaveButton: {
// //     flexDirection: "row",
// //     gap: 8,
// //     height: 56,
// //     borderRadius: 16,
// //     backgroundColor: C.red,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     shadowColor: C.red,
// //     shadowOpacity: 0.25,
// //     shadowRadius: 12,
// //     shadowOffset: { width: 0, height: 6 },
// //     elevation: 4,
// //   },
// //   leaveButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },

// //   /* ---- sheets ---- */
// //   sheetOverlay: { flex: 1, justifyContent: "flex-end" },
// //   sheetBackdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(20,27,52,0.4)" },
// //   sheet: {
// //     backgroundColor: C.card,
// //     borderTopLeftRadius: 24,
// //     borderTopRightRadius: 24,
// //     paddingTop: 10,
// //     paddingHorizontal: 20,
// //     paddingBottom: 30,
// //     maxHeight: "50%",
// //   },
// //   sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: "center", marginBottom: 14 },
// //   sheetTitle: { color: C.text, fontWeight: "800", fontSize: 16, marginBottom: 16, textAlign: "center" },
// //   chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center", paddingBottom: 10 },
// //   chip: {
// //     paddingVertical: 12,
// //     paddingHorizontal: 20,
// //     borderRadius: 14,
// //     backgroundColor: C.greySoft,
// //     borderWidth: 1,
// //     borderColor: C.border,
// //     minWidth: 90,
// //     alignItems: "center",
// //   },
// //   chipSelected: { backgroundColor: C.indigo, borderColor: C.indigo },
// //   chipText: { color: C.text, fontWeight: "700", fontSize: 13 },
// //   chipTextSelected: { color: "#FFFFFF" },

// //   confirmOverlay: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
// //   confirmCard: { width: "100%", maxWidth: 340, backgroundColor: C.card, borderRadius: 22, padding: 24, alignItems: "center" },
// //   confirmIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.redSoft, justifyContent: "center", alignItems: "center", marginBottom: 14 },
// //   confirmTitle: { color: C.text, fontWeight: "800", fontSize: 16, marginBottom: 6 },
// //   confirmSub: { color: C.sub, fontSize: 12.5, textAlign: "center", lineHeight: 18, marginBottom: 20 },
// //   confirmActions: { flexDirection: "row", gap: 10, width: "100%" },
// //   confirmCancel: { flex: 1, height: 46, borderRadius: 13, backgroundColor: C.greySoft, justifyContent: "center", alignItems: "center" },
// //   confirmCancelText: { color: C.text, fontWeight: "700", fontSize: 13.5 },
// //   confirmLeaveBtn: { flex: 1, height: 46, borderRadius: 13, backgroundColor: C.red, justifyContent: "center", alignItems: "center" },
// //   confirmLeaveText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13.5 },
// // });
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Share,
//   SafeAreaView,
//   StatusBar,
//   Modal,
//   ScrollView,
//   ActivityIndicator,
//   useWindowDimensions,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { WordScrambleRoom, updateRoomSettings } from "../api/Wordscrambleapi";

// type RoomWithTiming = WordScrambleRoom & { timePerRoundSec: number };

// interface RoomSettingsScreenProps {
//   room: RoomWithTiming;
//   playerName: string;
//   onBack: () => void;
//   onLeaveRoom: () => void;
//   onRoomUpdated: (room: RoomWithTiming) => void;
// }

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
//   red: "#E5484D",
//   redSoft: "#FDECEC",
//   grey: "#8A93A6",
//   greySoft: "#F1EEF0",
//   green: "#22B573",
//   greenSoft: "#E3F6EC",
//   dark: "#171B2E",
//   yellow: "#F2B640",
// };

// const TILE_COLORS = [C.coral, C.indigo, "#F0566A", C.green];

// const ROUND_OPTIONS = [5, 10, 15, 20];
// const TIME_OPTIONS = [10, 15, 20, 30, 45, 60];

// type EditingField = "rounds" | "time" | null;

// const RoomSettingsScreen: React.FC<RoomSettingsScreenProps> = ({
//   room,
//   playerName,
//   onBack,
//   onLeaveRoom,
//   onRoomUpdated,
// }) => {
//   const { width } = useWindowDimensions();
//   const wide = width >= 700;

//   const [editing, setEditing] = useState<EditingField>(null);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [copied, setCopied] = useState(false);
//   const [confirmLeave, setConfirmLeave] = useState(false);
//   const [leaving, setLeaving] = useState(false);

//   // FIX: WordScrambleRoom has no `hostPlayerName` field — the host is
//   // identified via the `is_host` flag on the matching entry in `players`.
//   const isHost = room.players.some(
//     (p) => p.is_host && p.player_name === playerName
//   );
//   const canEdit = isHost && room.status === "waiting";
//   const fillPct = room.maxPlayers > 0 ? Math.min(100, (room.players.length / room.maxPlayers) * 100) : 0;

//   const handleShare = () => {
//     Share.share({ message: `Join my Word Scramble room! Code: ${room.roomCode}` });
//   };

//   const handleCopy = async () => {
//     try {
//       const nav: any = typeof navigator !== "undefined" ? navigator : null;
//       if (Platform.OS === "web" && nav?.clipboard?.writeText) {
//         await nav.clipboard.writeText(room.roomCode);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 1600);
//         return;
//       }
//       await Share.share({ message: room.roomCode });
//     } catch {
//       // ignore
//     }
//   };

//   const applySetting = async (field: EditingField, value: number) => {
//     if (!field) return;
//     setSaving(true);
//     setError(null);
//     try {
//       const updated = await updateRoomSettings(room.roomCode, playerName, {
//         totalRounds: field === "rounds" ? value : room.totalRounds,
//         timePerRoundSec: field === "time" ? value : room.timePerRoundSec,
//       });
//       onRoomUpdated(updated as RoomWithTiming);
//       setEditing(null);
//     } catch (err: any) {
//       setError(err.message || "Could not update settings");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleConfirmLeave = async () => {
//     setLeaving(true);
//     try {
//       await onLeaveRoom();
//     } finally {
//       setLeaving(false);
//       setConfirmLeave(false);
//     }
//   };

//   return (
//     <View style={styles.flex}>
//       <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
//       <SafeAreaView style={styles.flex}>
//         {/* ---- top bar ---- */}
//         <View style={styles.topBarOuter}>
//           <View style={[styles.topRow, styles.page]}>
//             <TouchableOpacity onPress={onBack} style={styles.roundButton} activeOpacity={0.8}>
//               <Ionicons name="chevron-back" size={20} color={C.text} />
//             </TouchableOpacity>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.topTitle}>Room Settings</Text>
//               <Text style={styles.topSub}>Manage your word battle</Text>
//             </View>
//             <View style={[styles.statusPill, { backgroundColor: room.status === "waiting" ? C.greenSoft : C.indigoSoft }]}>
//               <View style={[styles.statusDot, { backgroundColor: room.status === "waiting" ? C.green : C.indigo }]} />
//               <Text style={[styles.statusText, { color: room.status === "waiting" ? C.green : C.indigo }]}>
//                 {room.status === "waiting" ? "Waiting" : room.status}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <ScrollView
//           contentContainerStyle={[styles.scroll, { paddingHorizontal: wide ? 32 : 16 }]}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.page}>
//             {error && (
//               <View style={styles.errorBanner}>
//                 <Ionicons name="alert-circle-outline" size={14} color={C.red} />
//                 <Text style={styles.errorText}>{error}</Text>
//               </View>
//             )}

//             {/* ---- hero: big code tiles, like the W-O-R-D tiles on Home ---- */}
//             <View style={styles.heroSection}>
//               <Text style={styles.eyebrow}>ROOM CODE</Text>
//               <Text style={[styles.heroTitle, !wide && styles.heroTitlePhone]}>Share this code</Text>
//               <Text style={styles.heroTitleAccent}>to invite friends</Text>

//               <View style={styles.tilesRow}>
//                 {room.roomCode.split("").map((ch, i) => (
//                   <View key={i} style={[styles.tile, { backgroundColor: TILE_COLORS[i % TILE_COLORS.length] }]}>
//                     <Text style={styles.tileText}>{ch}</Text>
//                   </View>
//                 ))}
//               </View>

//               <View style={styles.heroActionsRow}>
//                 <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.88}>
//                   <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color="#FFFFFF" />
//                   <Text style={styles.copyBtnText}>{copied ? "Copied!" : "Copy code"}</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.shareIconBtn} onPress={handleShare} activeOpacity={0.85}>
//                   <Ionicons name="share-social-outline" size={17} color={C.indigo} />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* ---- players progress card ---- */}
//             <View style={styles.progressCard}>
//               <View style={styles.progressRow}>
//                 <View style={styles.progressLeft}>
//                   <View style={styles.progressIconWrap}>
//                     <Ionicons name="people" size={16} color="#FFFFFF" />
//                   </View>
//                   <View>
//                     <Text style={styles.progressTitle}>Players joined</Text>
//                     <Text style={styles.progressSub}>Waiting for the room to fill up</Text>
//                   </View>
//                 </View>
//                 <Text style={styles.progressCount}>{room.players.length}/{room.maxPlayers}</Text>
//               </View>
//               <View style={styles.progressTrack}>
//                 <View style={[styles.progressFill, { width: `${fillPct}%` }]} />
//               </View>
//             </View>

//             {!isHost && (
//               <View style={styles.hostNotice}>
//                 <Ionicons name="lock-closed-outline" size={13} color={C.sub} />
//                 <Text style={styles.hostNoticeText}>Only the host can change room settings</Text>
//               </View>
//             )}

//             {/* ---- Rounds / Time — 2-column colorful cards, like Create/Join Room ---- */}
//             <View style={styles.sectionHeadRow}>
//               <View>
//                 <Text style={styles.sectionTitle}>Game Settings</Text>
//                 <Text style={styles.sectionSub}>Rounds and timing for this room</Text>
//               </View>
//             </View>

//             <View style={styles.settingsGrid}>
//               <TouchableOpacity
//                 style={[styles.settingCard, styles.settingCardCoral]}
//                 activeOpacity={canEdit ? 0.85 : 1}
//                 disabled={!canEdit}
//                 onPress={() => setEditing("rounds")}
//               >
//                 <View style={styles.settingIconWrap}>
//                   <Ionicons name="repeat" size={18} color="#FFFFFF" />
//                 </View>
//                 <Text style={styles.settingValue}>{room.totalRounds} Rounds</Text>
//                 <Text style={styles.settingLabel}>Total rounds this game</Text>
//                 {canEdit ? (
//                   <View style={styles.settingArrow}>
//                     <Ionicons name="arrow-forward" size={14} color={C.coral} />
//                   </View>
//                 ) : null}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.settingCard, styles.settingCardIndigo]}
//                 activeOpacity={canEdit ? 0.85 : 1}
//                 disabled={!canEdit}
//                 onPress={() => setEditing("time")}
//               >
//                 <View style={[styles.settingIconWrap, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
//                   <Ionicons name="time" size={18} color="#FFFFFF" />
//                 </View>
//                 <Text style={[styles.settingValue, { color: "#FFFFFF" }]}>{room.timePerRoundSec}s per round</Text>
//                 <Text style={[styles.settingLabel, { color: "rgba(255,255,255,0.75)" }]}>Timer for each word</Text>
//                 {canEdit ? (
//                   <View style={[styles.settingArrow, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
//                     <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
//                   </View>
//                 ) : null}
//               </TouchableOpacity>

//               <View style={[styles.settingCard, styles.settingCardSoft]}>
//                 <View style={[styles.settingIconWrap, { backgroundColor: C.indigo }]}>
//                   <Ionicons name="globe-outline" size={18} color="#FFFFFF" />
//                 </View>
//                 <Text style={styles.settingValue}>{room.roomType === "public" ? "Public room" : "Private room"}</Text>
//                 <Text style={styles.settingLabel}>Who can join</Text>
//               </View>

//               <View style={[styles.settingCard, styles.settingCardSoft]}>
//                 <View style={[styles.settingIconWrap, { backgroundColor: C.indigo }]}>
//                   <Ionicons name="game-controller-outline" size={18} color="#FFFFFF" />
//                 </View>
//                 <Text style={styles.settingValue}>Word Scramble</Text>
//                 <Text style={styles.settingLabel}>Game mode</Text>
//               </View>
//             </View>

//             <View style={[styles.bottomActionsRow, !wide && styles.bottomActionsRowPhone]}>
//               <TouchableOpacity
//                 style={[styles.darkBanner, wide && styles.bottomActionFlex]}
//                 activeOpacity={0.9}
//                 onPress={handleShare}
//               >
//                 <View style={styles.darkBannerLeft}>
//                   <View style={styles.darkBannerIconWrap}>
//                     <Ionicons name="person-add" size={18} color={C.dark} />
//                   </View>
//                   <View>
//                     <Text style={styles.darkBannerTitle}>Bring your friends in</Text>
//                     <Text style={styles.darkBannerSub}>Tap to share the room code</Text>
//                   </View>
//                 </View>
//                 <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.leaveButton, wide && styles.bottomActionFlex]}
//                 activeOpacity={0.88}
//                 onPress={() => setConfirmLeave(true)}
//               >
//                 <Ionicons name="exit-outline" size={17} color="#FFFFFF" />
//                 <Text style={styles.leaveButtonText}>Leave Room</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>

//         {/* ---- Bottom sheet: pick Rounds or Time ---- */}
//         <Modal transparent visible={editing !== null} animationType="slide" onRequestClose={() => setEditing(null)}>
//           <View style={styles.sheetOverlay}>
//             <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setEditing(null)} />
//             <View style={styles.sheet}>
//               <View style={styles.sheetHandle} />
//               <Text style={styles.sheetTitle}>
//                 {editing === "rounds" ? "Select Rounds" : "Select Time per Round"}
//               </Text>

//               <ScrollView contentContainerStyle={styles.chipsWrap}>
//                 {(editing === "rounds" ? ROUND_OPTIONS : TIME_OPTIONS).map((opt) => {
//                   const current = editing === "rounds" ? room.totalRounds : room.timePerRoundSec;
//                   const selected = opt === current;
//                   return (
//                     <TouchableOpacity
//                       key={opt}
//                       style={[styles.chip, selected && styles.chipSelected]}
//                       disabled={saving}
//                       onPress={() => applySetting(editing, opt)}
//                       activeOpacity={0.85}
//                     >
//                       {saving && selected ? (
//                         <ActivityIndicator size="small" color="#FFFFFF" />
//                       ) : (
//                         <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
//                           {editing === "rounds" ? `${opt} Rounds` : `${opt}s`}
//                         </Text>
//                       )}
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           </View>
//         </Modal>

//         {/* ---- Confirm leave ---- */}
//         <Modal transparent visible={confirmLeave} animationType="fade" onRequestClose={() => setConfirmLeave(false)}>
//           <View style={styles.confirmOverlay}>
//             <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => !leaving && setConfirmLeave(false)} />
//             <View style={styles.confirmCard}>
//               <View style={styles.confirmIconWrap}>
//                 <Ionicons name="exit-outline" size={22} color={C.red} />
//               </View>
//               <Text style={styles.confirmTitle}>Leave this room?</Text>
//               <Text style={styles.confirmSub}>
//                 {isHost
//                   ? "You're the host — leaving may end the room for everyone."
//                   : "You can rejoin later with the room code."}
//               </Text>
//               <View style={styles.confirmActions}>
//                 <TouchableOpacity
//                   style={styles.confirmCancel}
//                   onPress={() => setConfirmLeave(false)}
//                   disabled={leaving}
//                   activeOpacity={0.8}
//                 >
//                   <Text style={styles.confirmCancelText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.confirmLeaveBtn}
//                   onPress={handleConfirmLeave}
//                   disabled={leaving}
//                   activeOpacity={0.88}
//                 >
//                   {leaving ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.confirmLeaveText}>Leave</Text>}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </SafeAreaView>
//     </View>
//   );
// };

// export default RoomSettingsScreen;

// const styles = StyleSheet.create({
//   flex: { flex: 1, backgroundColor: C.bg },

//   page: {
//     width: "100%",
//   },

//   topBarOuter: {
//     paddingHorizontal: 20,
//     paddingTop: 8,
//     paddingBottom: 14,
//   },
//   topRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   roundButton: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: C.card,
//     borderWidth: 1,
//     borderColor: C.border,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   topTitle: { color: C.text, fontWeight: "900", fontSize: 17 },
//   topSub: { color: C.sub, fontSize: 12, marginTop: 1 },

//   statusPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//   },
//   statusDot: { width: 6, height: 6, borderRadius: 3 },
//   statusText: { fontSize: 11.5, fontWeight: "800" },

//   scroll: { paddingTop: 4, paddingBottom: 20 },

//   errorBanner: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: C.redSoft,
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     marginBottom: 14,
//   },
//   errorText: { color: C.red, fontSize: 12.5, flex: 1 },

//   /* ---- hero ---- */
//   heroSection: { marginBottom: 22 },
//   eyebrow: {
//     color: C.coral,
//     fontSize: 12,
//     fontWeight: "800",
//     letterSpacing: 1.5,
//     marginBottom: 6,
//   },
//   heroTitle: { color: C.text, fontSize: 30, fontWeight: "900", lineHeight: 36 },
//   heroTitlePhone: { fontSize: 26, lineHeight: 32 },
//   heroTitleAccent: { color: C.indigo, fontSize: 30, fontWeight: "900", lineHeight: 36 },

//   tilesRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 22,
//     marginBottom: 20,
//     flexWrap: "wrap",
//   },
//   tile: {
//     width: 52,
//     height: 52,
//     borderRadius: 15,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 5 },
//     elevation: 3,
//   },
//   tileText: { color: "#FFFFFF", fontSize: 24, fontWeight: "900" },

//   heroActionsRow: { flexDirection: "row", alignItems: "center", gap: 10 },
//   copyBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: C.indigo,
//     paddingVertical: 13,
//     paddingHorizontal: 22,
//     borderRadius: 14,
//   },
//   copyBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
//   shareIconBtn: {
//     width: 46,
//     height: 46,
//     borderRadius: 14,
//     backgroundColor: C.indigoSoft,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   /* ---- progress card ---- */
//   progressCard: {
//     backgroundColor: C.card,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: C.border,
//     padding: 18,
//     marginBottom: 16,
//   },
//   progressRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   progressLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
//   progressIconWrap: {
//     width: 34,
//     height: 34,
//     borderRadius: 11,
//     backgroundColor: C.indigo,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   progressTitle: { color: C.text, fontSize: 14, fontWeight: "800" },
//   progressSub: { color: C.sub, fontSize: 11.5, marginTop: 1 },
//   progressCount: { color: C.text, fontSize: 15, fontWeight: "900" },
//   progressTrack: { height: 8, borderRadius: 4, backgroundColor: C.greySoft, overflow: "hidden" },
//   progressFill: { height: "100%", borderRadius: 4, backgroundColor: C.indigo },

//   hostNotice: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 22 },
//   hostNoticeText: { color: C.sub, fontSize: 12 },

//   /* ---- section head ---- */
//   sectionHeadRow: { marginBottom: 14 },
//   sectionTitle: { color: C.text, fontSize: 18, fontWeight: "900" },
//   sectionSub: { color: C.sub, fontSize: 12.5, marginTop: 2 },

//   settingsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 14,
//     marginBottom: 18,
//   },
//   settingCard: {
//     flexGrow: 1,
//     flexBasis: 220,
//     maxWidth: 320,
//     borderRadius: 20,
//     padding: 18,
//     minHeight: 130,
//     justifyContent: "space-between",
//   },
//   settingCardCoral: {
//     backgroundColor: C.coralSoft,
//   },
//   settingCardIndigo: {
//     backgroundColor: C.indigo,
//   },
//   settingCardSoft: {
//     backgroundColor: C.card,
//     borderWidth: 1,
//     borderColor: C.border,
//   },
//   settingIconWrap: {
//     width: 34,
//     height: 34,
//     borderRadius: 11,
//     backgroundColor: C.coral,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   settingValue: { color: C.text, fontSize: 16, fontWeight: "900" },
//   settingLabel: { color: C.sub, fontSize: 11.5, marginTop: 3 },
//   settingArrow: {
//     position: "absolute",
//     top: 16,
//     right: 16,
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//     backgroundColor: "rgba(255,107,87,0.15)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   bottomActionsRow: {
//     flexDirection: "row",
//     alignItems: "stretch",
//     gap: 14,
//   },
//   bottomActionsRowPhone: {
//     flexDirection: "column",
//   },
//   bottomActionFlex: {
//     flex: 1,
//   },

//   /* ---- dark invite banner ---- */
//   darkBanner: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: C.dark,
//     borderRadius: 18,
//     paddingVertical: 16,
//     paddingHorizontal: 18,
//   },
//   darkBannerLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
//   darkBannerIconWrap: {
//     width: 36,
//     height: 36,
//     borderRadius: 11,
//     backgroundColor: C.yellow,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   darkBannerTitle: { color: "#FFFFFF", fontSize: 14.5, fontWeight: "800" },
//   darkBannerSub: { color: "rgba(255,255,255,0.55)", fontSize: 11.5, marginTop: 2 },

//   /* ---- leave ---- */
//   leaveButton: {
//     flexDirection: "row",
//     gap: 8,
//     height: 56,
//     borderRadius: 16,
//     backgroundColor: C.red,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: C.red,
//     shadowOpacity: 0.25,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 6 },
//     elevation: 4,
//   },
//   leaveButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },

//   /* ---- sheets ---- */
//   sheetOverlay: { flex: 1, justifyContent: "flex-end" },
//   sheetBackdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(20,27,52,0.4)" },
//   sheet: {
//     backgroundColor: C.card,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingTop: 10,
//     paddingHorizontal: 20,
//     paddingBottom: 30,
//     maxHeight: "50%",
//   },
//   sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: "center", marginBottom: 14 },
//   sheetTitle: { color: C.text, fontWeight: "800", fontSize: 16, marginBottom: 16, textAlign: "center" },
//   chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center", paddingBottom: 10 },
//   chip: {
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 14,
//     backgroundColor: C.greySoft,
//     borderWidth: 1,
//     borderColor: C.border,
//     minWidth: 90,
//     alignItems: "center",
//   },
//   chipSelected: { backgroundColor: C.indigo, borderColor: C.indigo },
//   chipText: { color: C.text, fontWeight: "700", fontSize: 13 },
//   chipTextSelected: { color: "#FFFFFF" },

//   confirmOverlay: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
//   confirmCard: { width: "100%", maxWidth: 340, backgroundColor: C.card, borderRadius: 22, padding: 24, alignItems: "center" },
//   confirmIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.redSoft, justifyContent: "center", alignItems: "center", marginBottom: 14 },
//   confirmTitle: { color: C.text, fontWeight: "800", fontSize: 16, marginBottom: 6 },
//   confirmSub: { color: C.sub, fontSize: 12.5, textAlign: "center", lineHeight: 18, marginBottom: 20 },
//   confirmActions: { flexDirection: "row", gap: 10, width: "100%" },
//   confirmCancel: { flex: 1, height: 46, borderRadius: 13, backgroundColor: C.greySoft, justifyContent: "center", alignItems: "center" },
//   confirmCancelText: { color: C.text, fontWeight: "700", fontSize: 13.5 },
//   confirmLeaveBtn: { flex: 1, height: 46, borderRadius: 13, backgroundColor: C.red, justifyContent: "center", alignItems: "center" },
//   confirmLeaveText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13.5 },
// });
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WordScrambleRoom, updateRoomSettings } from "../api/Wordscrambleapi";

type RoomWithTiming = WordScrambleRoom & { timePerRoundSec: number };

interface RoomSettingsScreenProps {
  room: RoomWithTiming;
  playerName: string;
  onBack: () => void;
  onLeaveRoom: () => void;
  onRoomUpdated: (room: RoomWithTiming) => void;
}

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
  red: "#E5484D",
  redSoft: "#FDECEC",
  grey: "#8A93A6",
  greySoft: "#F1EEF0",
  green: "#22B573",
  greenSoft: "#E3F6EC",
  dark: "#171B2E",
  yellow: "#F2B640",
};

const TILE_COLORS = [C.coral, C.indigo, "#F0566A", C.green];

// CHANGED: rounds are 1 - 50 (timer option removed)
const MIN_ROUNDS = 1;
const MAX_ROUNDS = 50;
const ROUND_PRESETS = [5, 10, 20, 30, 50];

const RoomSettingsScreen: React.FC<RoomSettingsScreenProps> = ({
  room,
  playerName,
  onBack,
  onLeaveRoom,
  onRoomUpdated,
}) => {
  const { width } = useWindowDimensions();
  const wide = width >= 700;

  const [editingRounds, setEditingRounds] = useState(false);
  const [draftRounds, setDraftRounds] = useState<number>(room.totalRounds);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // FIX: WordScrambleRoom has no `hostPlayerName` field — the host is
  // identified via the `is_host` flag on the matching entry in `players`.
  const isHost = room.players.some(
    (p) => p.is_host && p.player_name === playerName
  );
  const canEdit = isHost && room.status === "waiting";
  const fillPct = room.maxPlayers > 0 ? Math.min(100, (room.players.length / room.maxPlayers) * 100) : 0;

  const handleShare = () => {
    Share.share({ message: `Join my Word Scramble room! Code: ${room.roomCode}` });
  };

  const handleCopy = async () => {
    try {
      const nav: any = typeof navigator !== "undefined" ? navigator : null;
      if (Platform.OS === "web" && nav?.clipboard?.writeText) {
        await nav.clipboard.writeText(room.roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
        return;
      }
      await Share.share({ message: room.roomCode });
    } catch {
      // ignore
    }
  };

  const openRoundsSheet = () => {
    setDraftRounds(room.totalRounds);
    setError(null);
    setEditingRounds(true);
  };

  const saveRounds = async () => {
    if (draftRounds < MIN_ROUNDS || draftRounds > MAX_ROUNDS) {
      setError(`Rounds must be ${MIN_ROUNDS} - ${MAX_ROUNDS}`);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const updated = await updateRoomSettings(room.roomCode, playerName, {
        totalRounds: draftRounds,
        // timer is no longer editable; keep whatever the room already has
        timePerRoundSec: room.timePerRoundSec,
      });
      onRoomUpdated(updated as RoomWithTiming);
      setEditingRounds(false);
    } catch (err: any) {
      setError(err.message || "Could not update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmLeave = async () => {
    setLeaving(true);
    try {
      await onLeaveRoom();
    } finally {
      setLeaving(false);
      setConfirmLeave(false);
    }
  };

  const canDec = draftRounds > MIN_ROUNDS;
  const canInc = draftRounds < MAX_ROUNDS;

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <SafeAreaView style={styles.flex}>
        {/* ---- top bar ---- */}
        <View style={styles.topBarOuter}>
          <View style={[styles.topRow, styles.page]}>
            <TouchableOpacity onPress={onBack} style={styles.roundButton} activeOpacity={0.8}>
              <Ionicons name="chevron-back" size={20} color={C.text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.topTitle}>Room Settings</Text>
              <Text style={styles.topSub}>Manage your word battle</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: room.status === "waiting" ? C.greenSoft : C.indigoSoft }]}>
              <View style={[styles.statusDot, { backgroundColor: room.status === "waiting" ? C.green : C.indigo }]} />
              <Text style={[styles.statusText, { color: room.status === "waiting" ? C.green : C.indigo }]}>
                {room.status === "waiting" ? "Waiting" : room.status}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingHorizontal: wide ? 32 : 16 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.page}>
            {error && !editingRounds && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={14} color={C.red} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* ---- hero: big code tiles, like the W-O-R-D tiles on Home ---- */}
            <View style={styles.heroSection}>
              <Text style={styles.eyebrow}>ROOM CODE</Text>
              <Text style={[styles.heroTitle, !wide && styles.heroTitlePhone]}>Share this code</Text>
              <Text style={styles.heroTitleAccent}>to invite friends</Text>

              <View style={styles.tilesRow}>
                {room.roomCode.split("").map((ch, i) => (
                  <View key={i} style={[styles.tile, { backgroundColor: TILE_COLORS[i % TILE_COLORS.length] }]}>
                    <Text style={styles.tileText}>{ch}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.heroActionsRow}>
                <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.88}>
                  <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color="#FFFFFF" />
                  <Text style={styles.copyBtnText}>{copied ? "Copied!" : "Copy code"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareIconBtn} onPress={handleShare} activeOpacity={0.85}>
                  <Ionicons name="share-social-outline" size={17} color={C.indigo} />
                </TouchableOpacity>
              </View>
            </View>

            {/* ---- players progress card ---- */}
            <View style={styles.progressCard}>
              <View style={styles.progressRow}>
                <View style={styles.progressLeft}>
                  <View style={styles.progressIconWrap}>
                    <Ionicons name="people" size={16} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={styles.progressTitle}>Players joined</Text>
                    <Text style={styles.progressSub}>Waiting for the room to fill up</Text>
                  </View>
                </View>
                <Text style={styles.progressCount}>{room.players.length}/{room.maxPlayers}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${fillPct}%` }]} />
              </View>
            </View>

            {!isHost && (
              <View style={styles.hostNotice}>
                <Ionicons name="lock-closed-outline" size={13} color={C.sub} />
                <Text style={styles.hostNoticeText}>Only the host can change room settings</Text>
              </View>
            )}

            {/* ---- Game settings ---- */}
            <View style={styles.sectionHeadRow}>
              <View>
                <Text style={styles.sectionTitle}>Game Settings</Text>
                <Text style={styles.sectionSub}>Rounds for this room</Text>
              </View>
            </View>

            <View style={styles.settingsGrid}>
              {/* ROUNDS (editable by host) */}
              <TouchableOpacity
                style={[styles.settingCard, styles.settingCardCoral]}
                activeOpacity={canEdit ? 0.85 : 1}
                disabled={!canEdit}
                onPress={openRoundsSheet}
              >
                <View style={styles.settingIconWrap}>
                  <Ionicons name="repeat" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.settingValue}>{room.totalRounds} Rounds</Text>
                <Text style={styles.settingLabel}>Total rounds this game</Text>
                {canEdit ? (
                  <View style={styles.settingArrow}>
                    <Ionicons name="arrow-forward" size={14} color={C.coral} />
                  </View>
                ) : null}
              </TouchableOpacity>

              {/* CHANGED: timer is no longer a setting -> info card */}
              <View style={[styles.settingCard, styles.settingCardIndigo]}>
                <View style={[styles.settingIconWrap, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
                  <Ionicons name="time" size={18} color="#FFFFFF" />
                </View>
                <Text style={[styles.settingValue, { color: "#FFFFFF" }]}>Auto timer</Text>
                <Text style={[styles.settingLabel, { color: "rgba(255,255,255,0.75)" }]}>
                  Time adjusts for each round
                </Text>
              </View>

              <View style={[styles.settingCard, styles.settingCardSoft]}>
                <View style={[styles.settingIconWrap, { backgroundColor: C.indigo }]}>
                  <Ionicons name="globe-outline" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.settingValue}>{room.roomType === "public" ? "Public room" : "Private room"}</Text>
                <Text style={styles.settingLabel}>Who can join</Text>
              </View>

              <View style={[styles.settingCard, styles.settingCardSoft]}>
                <View style={[styles.settingIconWrap, { backgroundColor: C.indigo }]}>
                  <Ionicons name="game-controller-outline" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.settingValue}>Word Scramble</Text>
                <Text style={styles.settingLabel}>Game mode</Text>
              </View>
            </View>

            <View style={[styles.bottomActionsRow, !wide && styles.bottomActionsRowPhone]}>
              <TouchableOpacity
                style={[styles.darkBanner, wide && styles.bottomActionFlex]}
                activeOpacity={0.9}
                onPress={handleShare}
              >
                <View style={styles.darkBannerLeft}>
                  <View style={styles.darkBannerIconWrap}>
                    <Ionicons name="person-add" size={18} color={C.dark} />
                  </View>
                  <View>
                    <Text style={styles.darkBannerTitle}>Bring your friends in</Text>
                    <Text style={styles.darkBannerSub}>Tap to share the room code</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.leaveButton, wide && styles.bottomActionFlex]}
                activeOpacity={0.88}
                onPress={() => setConfirmLeave(true)}
              >
                <Ionicons name="exit-outline" size={17} color="#FFFFFF" />
                <Text style={styles.leaveButtonText}>Leave Room</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* ---- Bottom sheet: pick Rounds (1 - 50) ---- */}
        <Modal
          transparent
          visible={editingRounds}
          animationType="slide"
          onRequestClose={() => setEditingRounds(false)}
        >
          <View style={styles.sheetOverlay}>
            <TouchableOpacity
              style={styles.sheetBackdrop}
              activeOpacity={1}
              onPress={() => !saving && setEditingRounds(false)}
            />
            <View style={styles.sheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Select Rounds</Text>
              <Text style={styles.sheetHint}>
                {MIN_ROUNDS} - {MAX_ROUNDS} rounds
              </Text>

              {/* stepper */}
              <View style={styles.stepRow}>
                <TouchableOpacity
                  style={[styles.stepBtn, !canDec && styles.stepBtnOff]}
                  disabled={!canDec || saving}
                  onPress={() => setDraftRounds((n) => Math.max(MIN_ROUNDS, n - 1))}
                  activeOpacity={0.8}
                >
                  <Ionicons name="remove" size={22} color={C.text} />
                </TouchableOpacity>

                <Text style={styles.stepValue}>{draftRounds}</Text>

                <TouchableOpacity
                  style={[styles.stepBtn, !canInc && styles.stepBtnOff]}
                  disabled={!canInc || saving}
                  onPress={() => setDraftRounds((n) => Math.min(MAX_ROUNDS, n + 1))}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={22} color={C.text} />
                </TouchableOpacity>
              </View>

              {/* quick picks */}
              <View style={styles.chipsWrap}>
                {ROUND_PRESETS.map((opt) => {
                  const selected = opt === draftRounds;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.chip, selected && styles.chipSelected]}
                      disabled={saving}
                      onPress={() => setDraftRounds(opt)}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {error && (
                <View style={[styles.errorBanner, { marginTop: 14, marginBottom: 0 }]}>
                  <Ionicons name="alert-circle-outline" size={14} color={C.red} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={saveRounds}
                disabled={saving}
                activeOpacity={0.88}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ---- Confirm leave ---- */}
        <Modal transparent visible={confirmLeave} animationType="fade" onRequestClose={() => setConfirmLeave(false)}>
          <View style={styles.confirmOverlay}>
            <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => !leaving && setConfirmLeave(false)} />
            <View style={styles.confirmCard}>
              <View style={styles.confirmIconWrap}>
                <Ionicons name="exit-outline" size={22} color={C.red} />
              </View>
              <Text style={styles.confirmTitle}>Leave this room?</Text>
              <Text style={styles.confirmSub}>
                {isHost
                  ? "You're the host — leaving may end the room for everyone."
                  : "You can rejoin later with the room code."}
              </Text>
              <View style={styles.confirmActions}>
                <TouchableOpacity
                  style={styles.confirmCancel}
                  onPress={() => setConfirmLeave(false)}
                  disabled={leaving}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmLeaveBtn}
                  onPress={handleConfirmLeave}
                  disabled={leaving}
                  activeOpacity={0.88}
                >
                  {leaving ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.confirmLeaveText}>Leave</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default RoomSettingsScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: C.bg },

  page: {
    width: "100%",
  },

  topBarOuter: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  roundButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: "center",
    alignItems: "center",
  },
  topTitle: { color: C.text, fontWeight: "900", fontSize: 17 },
  topSub: { color: C.sub, fontSize: 12, marginTop: 1 },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11.5, fontWeight: "800" },

  scroll: { paddingTop: 4, paddingBottom: 20 },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.redSoft,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  errorText: { color: C.red, fontSize: 12.5, flex: 1 },

  /* ---- hero ---- */
  heroSection: { marginBottom: 22 },
  eyebrow: {
    color: C.coral,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  heroTitle: { color: C.text, fontSize: 30, fontWeight: "900", lineHeight: 36 },
  heroTitlePhone: { fontSize: 26, lineHeight: 32 },
  heroTitleAccent: { color: C.indigo, fontSize: 30, fontWeight: "900", lineHeight: 36 },

  tilesRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  tile: {
    width: 52,
    height: 52,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  tileText: { color: "#FFFFFF", fontSize: 24, fontWeight: "900" },

  heroActionsRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.indigo,
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  copyBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  shareIconBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: C.indigoSoft,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---- progress card ---- */
  progressCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 18,
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  progressIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: C.indigo,
    justifyContent: "center",
    alignItems: "center",
  },
  progressTitle: { color: C.text, fontSize: 14, fontWeight: "800" },
  progressSub: { color: C.sub, fontSize: 11.5, marginTop: 1 },
  progressCount: { color: C.text, fontSize: 15, fontWeight: "900" },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: C.greySoft, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4, backgroundColor: C.indigo },

  hostNotice: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 22 },
  hostNoticeText: { color: C.sub, fontSize: 12 },

  /* ---- section head ---- */
  sectionHeadRow: { marginBottom: 14 },
  sectionTitle: { color: C.text, fontSize: 18, fontWeight: "900" },
  sectionSub: { color: C.sub, fontSize: 12.5, marginTop: 2 },

  settingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 18,
  },
  settingCard: {
    flexGrow: 1,
    flexBasis: 220,
    maxWidth: 320,
    borderRadius: 20,
    padding: 18,
    minHeight: 130,
    justifyContent: "space-between",
  },
  settingCardCoral: {
    backgroundColor: C.coralSoft,
  },
  settingCardIndigo: {
    backgroundColor: C.indigo,
  },
  settingCardSoft: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  settingIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: C.coral,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  settingValue: { color: C.text, fontSize: 16, fontWeight: "900" },
  settingLabel: { color: C.sub, fontSize: 11.5, marginTop: 3 },
  settingArrow: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,107,87,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomActionsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 14,
  },
  bottomActionsRowPhone: {
    flexDirection: "column",
  },
  bottomActionFlex: {
    flex: 1,
  },

  /* ---- dark invite banner ---- */
  darkBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: C.dark,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  darkBannerLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  darkBannerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: C.yellow,
    justifyContent: "center",
    alignItems: "center",
  },
  darkBannerTitle: { color: "#FFFFFF", fontSize: 14.5, fontWeight: "800" },
  darkBannerSub: { color: "rgba(255,255,255,0.55)", fontSize: 11.5, marginTop: 2 },

  /* ---- leave ---- */
  leaveButton: {
    flexDirection: "row",
    gap: 8,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.red,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: C.red,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  leaveButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },

  /* ---- sheets ---- */
  sheetOverlay: { flex: 1, justifyContent: "flex-end" },
  sheetBackdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(20,27,52,0.4)" },
  sheet: {
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: "center", marginBottom: 14 },
  sheetTitle: { color: C.text, fontWeight: "800", fontSize: 16, textAlign: "center" },
  sheetHint: { color: C.sub, fontSize: 12, textAlign: "center", marginTop: 4, marginBottom: 18 },

  stepRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  stepBtn: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: C.greySoft,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: "center",
    alignItems: "center",
  },
  stepBtnOff: { opacity: 0.4 },
  stepValue: {
    flex: 1,
    textAlign: "center",
    color: C.text,
    fontSize: 34,
    fontWeight: "900",
  },

  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" },
  chip: {
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: C.greySoft,
    borderWidth: 1,
    borderColor: C.border,
    minWidth: 64,
    alignItems: "center",
  },
  chipSelected: { backgroundColor: C.indigo, borderColor: C.indigo },
  chipText: { color: C.text, fontWeight: "700", fontSize: 13 },
  chipTextSelected: { color: "#FFFFFF" },

  saveBtn: {
    marginTop: 20,
    height: 52,
    borderRadius: 15,
    backgroundColor: C.coral,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 15, letterSpacing: 0.5 },

  confirmOverlay: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
  confirmCard: { width: "100%", maxWidth: 340, backgroundColor: C.card, borderRadius: 22, padding: 24, alignItems: "center" },
  confirmIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.redSoft, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  confirmTitle: { color: C.text, fontWeight: "800", fontSize: 16, marginBottom: 6 },
  confirmSub: { color: C.sub, fontSize: 12.5, textAlign: "center", lineHeight: 18, marginBottom: 20 },
  confirmActions: { flexDirection: "row", gap: 10, width: "100%" },
  confirmCancel: { flex: 1, height: 46, borderRadius: 13, backgroundColor: C.greySoft, justifyContent: "center", alignItems: "center" },
  confirmCancelText: { color: C.text, fontWeight: "700", fontSize: 13.5 },
  confirmLeaveBtn: { flex: 1, height: 46, borderRadius: 13, backgroundColor: C.red, justifyContent: "center", alignItems: "center" },
  confirmLeaveText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13.5 },
});