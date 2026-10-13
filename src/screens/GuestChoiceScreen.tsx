// // import React from "react";
// // import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// // type Props = {
// //   onCreatePlayer: () => void;
// //   onJoinGroup: () => void;
// //   onBack: () => void;
// // };

// // export default function GuestChoiceScreen({ onCreatePlayer, onJoinGroup, onBack }: Props) {
// //   return (
// //     <View style={s.container}>
// //       <TouchableOpacity style={s.back} onPress={onBack}>
// //         <Text style={{ fontSize: 22 }}>←</Text>
// //       </TouchableOpacity>

// //       <Text style={s.title}>Play as <Text style={s.accent}>Guest</Text></Text>
// //       <Text style={s.sub}>Choose how you want to play</Text>

// //       <TouchableOpacity style={[s.btn, s.yellow]} onPress={onCreatePlayer}>
// //         <Text style={s.btnText}>Create as Player  →</Text>
// //       </TouchableOpacity>

// //       <TouchableOpacity style={[s.btn, s.blue]} onPress={onJoinGroup}>
// //         <Text style={s.btnText}>Join as Group  →</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // }

// // const s = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#FFF6EA", padding: 24, justifyContent: "center" },
// //   back: { position: "absolute", top: 40, left: 20, width: 44, height: 44, borderRadius: 22,
// //           backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
// //   title: { fontSize: 34, fontWeight: "800", color: "#1E2A78" },
// //   accent: { color: "#FF9A1F" },
// //   sub: { color: "#5A5F9A", marginBottom: 32, marginTop: 4 },
// //   btn: { height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 18 },
// //   yellow: { backgroundColor: "#FFC21A" },
// //   blue: { backgroundColor: "#7CC4FF" },
// //   btnText: { fontSize: 18, fontWeight: "800", color: "#1E2A78" },
// // });
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from "react-native";

// type Props = {
//   mode: "player" | "group";
//   onContinue: (nickname: string) => void;
//   onBack: () => void;
//   // Optional: guest-ah DB-la save panna venum na (player mode-la mattum run aagum)
//   registerGuest?: (nickname: string) => Promise<void>;
// };

// export default function GuestLoginScreen({
//   mode,
//   onContinue,
//   onBack,
//   registerGuest,
// }: Props) {
//   const [nickname, setNickname] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleContinue = async () => {
//     const name = nickname.trim();

//     if (name.length < 2) {
//       setError("Nickname must be at least 2 characters");
//       return;
//     }
//     if (name.length > 15) {
//       setError("Nickname can be max 15 characters");
//       return;
//     }

//     setError("");

//     try {
//       setLoading(true);
//       // Player mode-la mattum guest-ah backend-la register pannum
//       if (mode === "player" && registerGuest) {
//         await registerGuest(name);
//       }
//       onContinue(name);
//     } catch (e: any) {
//       setError(e?.message || "Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       {/* Background circles */}
//       <View style={[styles.circle, styles.circleYellow]} />
//       <View style={[styles.circle, styles.circlePurple]} />
//       <View style={[styles.circle, styles.circleBlue]} />
//       <View style={[styles.circle, styles.circleGreen]} />

//       {/* Back button */}
//       <TouchableOpacity style={styles.backBtn} onPress={onBack}>
//         <Text style={styles.backIcon}>←</Text>
//       </TouchableOpacity>

//       {/* Title */}
//       <View style={styles.header}>
//         <Text style={styles.title}>Play as</Text>
//         <Text style={styles.titleAccent}>Guest</Text>
//         <Text style={styles.subtitle}>
//           {mode === "player"
//             ? "No account needed. Just a nickname."
//             : "Enter a nickname to join your group."}
//         </Text>
//       </View>

//       {/* Card */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.iconBox}>
//             <Text style={styles.iconText}>👤</Text>
//           </View>
//           <Text style={styles.cardTitle}>Your nickname</Text>
//         </View>

//         <View style={styles.inputWrap}>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter a nickname"
//             placeholderTextColor="#9AA0D0"
//             value={nickname}
//             onChangeText={(t) => {
//               setNickname(t);
//               if (error) setError("");
//             }}
//             maxLength={15}
//             autoCapitalize="words"
//             autoCorrect={false}
//             returnKeyType="done"
//             onSubmitEditing={handleContinue}
//           />
//           <Text style={styles.pencil}>✎</Text>
//         </View>

//         {!!error && <Text style={styles.error}>{error}</Text>}

//         <Text style={styles.hint}>
//           ✦ This will be your display name in the game.
//         </Text>

//         <TouchableOpacity
//           style={[styles.continueBtn, loading && { opacity: 0.7 }]}
//           onPress={handleContinue}
//           disabled={loading}
//           activeOpacity={0.85}
//         >
//           {loading ? (
//             <ActivityIndicator color="#1E2A78" />
//           ) : (
//             <Text style={styles.continueText}>Continue  →</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.footer}>
//         {mode === "player"
//           ? "Guest progress is saved on this device."
//           : "You'll enter a room code on the next screen."}
//       </Text>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF6EA",
//     paddingHorizontal: 22,
//     justifyContent: "center",
//     overflow: "hidden",
//   },

//   // background decoration
//   circle: { position: "absolute", borderRadius: 999 },
//   circleYellow: { width: 260, height: 260, top: -80, left: -60, backgroundColor: "#FFEFC2" },
//   circlePurple: { width: 220, height: 220, top: -40, right: -80, backgroundColor: "#E7E4FA" },
//   circleBlue: { width: 240, height: 240, bottom: -60, left: -80, backgroundColor: "#D9ECFF" },
//   circleGreen: { width: 260, height: 260, bottom: -90, right: -70, backgroundColor: "#CFEFB8" },

//   backBtn: {
//     position: "absolute",
//     top: 40,
//     left: 20,
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   backIcon: { fontSize: 22, color: "#1E2A78", fontWeight: "700" },

//   header: { marginBottom: 24 },
//   title: { fontSize: 38, fontWeight: "900", color: "#1E2A78" },
//   titleAccent: { fontSize: 38, fontWeight: "900", color: "#FF9A1F", marginTop: -6 },
//   subtitle: { marginTop: 8, color: "#5A5F9A", fontSize: 14, maxWidth: 220 },

//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 28,
//     borderWidth: 2,
//     borderColor: "#FFC21A",
//     padding: 18,
//   },
//   cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
//   iconBox: {
//     width: 52,
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: "#FFEFC2",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 14,
//   },
//   iconText: { fontSize: 22 },
//   cardTitle: { fontSize: 17, fontWeight: "800", color: "#1E2A78" },

//   inputWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F2F7FF",
//     borderWidth: 2,
//     borderColor: "#D9E8FA",
//     borderRadius: 28,
//     paddingHorizontal: 18,
//   },
//   input: {
//     flex: 1,
//     height: 56,
//     fontSize: 17,
//     fontWeight: "700",
//     color: "#1E2A78",
//   },
//   pencil: { fontSize: 18, color: "#4DA3FF" },

//   error: { color: "#E53935", marginTop: 8, marginLeft: 6, fontSize: 13 },
//   hint: { marginTop: 12, marginLeft: 6, color: "#5A5F9A", fontSize: 13 },

//   continueBtn: {
//     marginTop: 18,
//     height: 62,
//     borderRadius: 31,
//     backgroundColor: "#FFC21A",
//     borderBottomWidth: 6,
//     borderBottomColor: "#E8A50C",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   continueText: { fontSize: 20, fontWeight: "900", color: "#1E2A78" },

//   footer: {
//     textAlign: "center",
//     marginTop: 18,
//     color: "#5A5F9A",
//     fontSize: 13,
//   },
// });
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  onCreatePlayer: () => void;
  onJoinGroup: () => void;
  onBack: () => void;
};

const NAVY = "#1E2A78";

export default function GuestChoiceScreen({
  onCreatePlayer,
  onJoinGroup,
  onBack,
}: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      {/* background circles */}
      <View style={[styles.circle, styles.circleYellow]} />
      <View style={[styles.circle, styles.circlePurple]} />
      <View style={[styles.circle, styles.circleBlue]} />
      <View style={[styles.circle, styles.circleGreen]} />

      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={NAVY} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Play as</Text>
        <Text style={styles.titleAccent}>Guest</Text>
        <Text style={styles.sub}>Choose how you want to play</Text>

        <TouchableOpacity
          style={[styles.btn, styles.yellow]}
          onPress={onCreatePlayer}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#FFF6DD" }]}>
            <MaterialCommunityIcons name="account" size={26} color={NAVY} />
          </View>
          <Text style={styles.btnText}>Create as Player</Text>
          <MaterialCommunityIcons name="arrow-right" size={26} color={NAVY} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.blue]}
          onPress={onJoinGroup}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#F2FAFF" }]}>
            <MaterialCommunityIcons
              name="account-group"
              size={26}
              color={NAVY}
            />
          </View>
          <Text style={styles.btnText}>Join as Group</Text>
          <MaterialCommunityIcons name="arrow-right" size={26} color={NAVY} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF6EA",
    overflow: "hidden",
  },

  circle: { position: "absolute", borderRadius: 999 },
  circleYellow: {
    width: 260,
    height: 260,
    top: -80,
    left: -60,
    backgroundColor: "#FFEFC2",
  },
  circlePurple: {
    width: 220,
    height: 220,
    top: -40,
    right: -80,
    backgroundColor: "#E7E4FA",
  },
  circleBlue: {
    width: 240,
    height: 240,
    bottom: -60,
    left: -80,
    backgroundColor: "#D9ECFF",
  },
  circleGreen: {
    width: 260,
    height: 260,
    bottom: -90,
    right: -70,
    backgroundColor: "#CFEFB8",
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 5,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  title: { fontSize: 38, fontWeight: "900", color: NAVY },
  titleAccent: {
    fontSize: 38,
    fontWeight: "900",
    color: "#FF9A1F",
    marginTop: -6,
  },
  sub: { color: "#5A5F9A", marginTop: 6, marginBottom: 32, fontSize: 15 },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 68,
    borderRadius: 34,
    paddingHorizontal: 12,
    marginBottom: 18,
    borderWidth: 3,
    borderBottomWidth: 6,
  },
  yellow: {
    backgroundColor: "#FFC21A",
    borderColor: "#FFB300",
    borderBottomColor: "#E8A50C",
  },
  blue: {
    backgroundColor: "#8ED0FF",
    borderColor: "#3AA7FF",
    borderBottomColor: "#2386E8",
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: NAVY,
  },
});
