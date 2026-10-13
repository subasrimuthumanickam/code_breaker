// import React, { useEffect, useState } from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// type Props = {
//   visible: boolean;
//   defaultName?: string;
//   onClose: () => void;
//   /** roomCode is null when the guest wants to create a new room */
//   onSubmit: (nickname: string, roomCode: string | null) => void;
// };

// export const randomGuestName = () =>
//   `Guest${Math.floor(1000 + Math.random() * 9000)}`;

// export default function GuestPlayModal({
//   visible,
//   defaultName,
//   onClose,
//   onSubmit,
// }: Props) {
//   const [nickname, setNickname] = useState(defaultName || randomGuestName());
//   const [code, setCode] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (visible) {
//       setNickname(defaultName || randomGuestName());
//       setCode("");
//       setError(null);
//     }
//   }, [visible, defaultName]);

//   const cleanName = () => nickname.trim().replace(/\s+/g, " ");

//   const validateName = (): string | null => {
//     const n = cleanName();
//     if (n.length < 2 || n.length > 20) {
//       setError("Nickname must be 2-20 characters.");
//       return null;
//     }
//     return n;
//   };

//   const handleJoin = () => {
//     const n = validateName();
//     if (!n) return;
//     if (code.trim().length !== 4) {
//       setError("Enter the 4-digit room code.");
//       return;
//     }
//     setError(null);
//     onSubmit(n, code.trim());
//   };

//   const handleCreate = () => {
//     const n = validateName();
//     if (!n) return;
//     setError(null);
//     onSubmit(n, null);
//   };

//   return (
//     <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
//       <KeyboardAvoidingView
//         style={styles.backdrop}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <View style={styles.card}>
//           <View style={styles.headRow}>
//             <View style={styles.headIcon}>
//               <Ionicons name="person-outline" size={22} color="#FF6B5B" />
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.title}>Play as Guest</Text>
//               <Text style={styles.subtitle}>No account needed. Just pick a nickname.</Text>
//             </View>
//             <TouchableOpacity onPress={onClose} hitSlop={10}>
//               <Ionicons name="close" size={22} color="#8B93A7" />
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.label}>NICKNAME</Text>
//           <View style={styles.inputRow}>
//             <TextInput
//               value={nickname}
//               onChangeText={setNickname}
//               maxLength={20}
//               placeholder="Your nickname"
//               placeholderTextColor="#A0A7B8"
//               style={styles.input}
//             />
//             <TouchableOpacity
//               style={styles.shuffleBtn}
//               onPress={() => setNickname(randomGuestName())}
//               activeOpacity={0.8}
//             >
//               <Ionicons name="shuffle" size={18} color="#4F46E5" />
//             </TouchableOpacity>
//           </View>

//           <Text style={[styles.label, { marginTop: 14 }]}>ROOM CODE (to join a friend)</Text>
//           <TextInput
//             value={code}
//             onChangeText={(t) => setCode(t.replace(/[^0-9]/g, "").slice(0, 4))}
//             keyboardType="number-pad"
//             maxLength={4}
//             placeholder="1234"
//             placeholderTextColor="#A0A7B8"
//             style={[styles.input, styles.codeInput]}
//           />

//           {error ? <Text style={styles.error}>{error}</Text> : null}

//           <TouchableOpacity style={styles.primaryBtn} onPress={handleJoin} activeOpacity={0.85}>
//             <Text style={styles.primaryText}>JOIN ROOM</Text>
//             <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
//           </TouchableOpacity>

//           <View style={styles.orRow}>
//             <View style={styles.line} />
//             <Text style={styles.orText}>or</Text>
//             <View style={styles.line} />
//           </View>

//           <TouchableOpacity style={styles.secondaryBtn} onPress={handleCreate} activeOpacity={0.85}>
//             <Ionicons name="add" size={18} color="#FF6B5B" />
//             <Text style={styles.secondaryText}>Create a room and share the code</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: "rgba(23,33,58,0.55)",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   card: {
//     width: "100%",
//     maxWidth: 420,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 24,
//     padding: 20,
//   },
//   headRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18 },
//   headIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     backgroundColor: "#FFEDEA",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: { fontSize: 19, fontWeight: "800", color: "#17213A" },
//   subtitle: { fontSize: 12, color: "#8B93A7", marginTop: 2 },

//   label: { fontSize: 10, fontWeight: "800", color: "#8B93A7", letterSpacing: 1.2, marginBottom: 6 },
//   inputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
//   input: {
//     flex: 1,
//     height: 48,
//     borderRadius: 14,
//     paddingHorizontal: 14,
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#17213A",
//     backgroundColor: "#F4F5FA",
//     borderWidth: 1,
//     borderColor: "#E6E8F2",
//   },
//   codeInput: { flex: 0, width: "100%", letterSpacing: 8, textAlign: "center", fontSize: 20 },
//   shuffleBtn: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     backgroundColor: "#EEF0FF",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   error: { color: "#E11D48", fontSize: 12, marginTop: 10 },

//   primaryBtn: {
//     marginTop: 16,
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: "#4F46E5",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   primaryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900", letterSpacing: 0.8 },

//   orRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 14 },
//   line: { flex: 1, height: 1, backgroundColor: "#E6E8F2" },
//   orText: { color: "#A0A7B8", fontSize: 12 },

//   secondaryBtn: {
//     height: 50,
//     borderRadius: 16,
//     backgroundColor: "#FFEDEA",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   secondaryText: { color: "#FF6B5B", fontSize: 13, fontWeight: "800" },
// });
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GuestPlayModalProps {
  visible: boolean;
  defaultName?: string;
  onClose: () => void;
  /** code is null when the guest wants to create a room instead */
  onSubmit: (nickname: string, code: string | null) => void;
}

const randomGuestName = () => `Guest${Math.floor(1000 + Math.random() * 9000)}`;

const GuestPlayModal: React.FC<GuestPlayModalProps> = ({
  visible,
  defaultName,
  onClose,
  onSubmit,
}) => {
  const { width } = useWindowDimensions();
  const compact = width < 380;

  const [nickname, setNickname] = useState(defaultName || randomGuestName());
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setNickname(defaultName || randomGuestName());
      setCode("");
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const validName = (): string | null => {
    const n = nickname.trim();
    if (n.length < 2) {
      setError("Nickname must be at least 2 characters.");
      return null;
    }
    if (n.length > 16) {
      setError("Nickname can be at most 16 characters.");
      return null;
    }
    setError(null);
    return n;
  };

  const handleJoin = () => {
    const n = validName();
    if (!n) return;
    const c = code.trim();
    if (!c) {
      setError("Enter a room code, or create a room below.");
      return;
    }
    onSubmit(n, c);
  };

  const handleCreate = () => {
    const n = validName();
    if (!n) return;
    onSubmit(n, null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <View style={styles.backdrop} />
        </Pressable>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, compact && styles.cardCompact]}>
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <Ionicons name="person" size={20} color="#FF6B5A" />
              </View>

              <View style={styles.headerText}>
                <Text style={styles.title}>Play as Guest</Text>
                <Text style={styles.subtitle}>
                  No account needed. Just pick a nickname.
                </Text>
              </View>

              <TouchableOpacity onPress={onClose} hitSlop={10}>
                <Ionicons name="close" size={24} color="#7B8491" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>NICKNAME</Text>
            <View style={styles.row}>
              <TextInput
                value={nickname}
                onChangeText={(t) => {
                  setNickname(t);
                  setError(null);
                }}
                placeholder="Your nickname"
                placeholderTextColor="#A0A6B2"
                maxLength={16}
                autoCorrect={false}
                style={[styles.input, styles.flex]}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setNickname(randomGuestName())}
                style={styles.shuffleBtn}
              >
                <Ionicons name="shuffle" size={20} color="#5146E5" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { marginTop: 16 }]}>
              ROOM CODE (to join a friend)
            </Text>
            <TextInput
              value={code}
              onChangeText={(t) => {
                setCode(t);
                setError(null);
              }}
              placeholder="1 2 3 4"
              placeholderTextColor="#A0A6B2"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={8}
              style={[styles.input, styles.codeInput]}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleJoin}
              style={styles.joinBtn}
            >
              <Text style={styles.joinText}>JOIN ROOM</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.orRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCreate}
              style={styles.createBtn}
            >
              <Ionicons name="add" size={18} color="#FF6B5A" />
              <Text style={styles.createText}>
                Create a room and share the code
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default GuestPlayModal;

const styles = StyleSheet.create({
  root: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: "rgba(23,32,51,0.55)" },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
  },
  cardCompact: { padding: 16, borderRadius: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#FFEDEA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: { flex: 1, minWidth: 0, marginRight: 8 },
  title: { color: "#172033", fontSize: 19, fontWeight: "900" },
  subtitle: { color: "#7B8491", fontSize: 12, marginTop: 2 },
  label: {
    color: "#7B8491",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 7,
  },
  row: { flexDirection: "row", alignItems: "center" },
  flex: { flex: 1, minWidth: 0 },
  input: {
    height: 48,
    backgroundColor: "#F3F4FB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7F5",
    paddingHorizontal: 14,
    color: "#172033",
    fontSize: 16,
    fontWeight: "800",
  },
  codeInput: {
    textAlign: "center",
    letterSpacing: 4,
    fontSize: 18,
  },
  shuffleBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEEBFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  error: {
    color: "#E11D48",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
  },
  joinBtn: {
    marginTop: 18,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#5146E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  joinText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  orRow: { flexDirection: "row", alignItems: "center", marginVertical: 14 },
  line: { flex: 1, height: 1, backgroundColor: "#ECEEF5" },
  orText: { color: "#9AA1AE", fontSize: 12, marginHorizontal: 10 },
  createBtn: {
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: "#FFEDEA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    gap: 6,
  },
  createText: {
    color: "#FF6B5A",
    fontSize: 13,
    fontWeight: "800",
    flexShrink: 1,
    textAlign: "center",
  },
});
