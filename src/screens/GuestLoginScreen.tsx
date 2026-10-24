
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

type Props = {
  mode: "player" | "group";
  onContinue: (nickname: string) => void;
  onBack: () => void;
};

export default function GuestLoginScreen({ mode, onContinue, onBack }: Props) {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    const name = nickname.trim();

    if (name.length < 2) {
      setError("Nickname must be at least 2 characters");
      return;
    }
    if (name.length > 15) {
      setError("Nickname can be max 15 characters");
      return;
    }

    setError("");
    setLoading(true);

    // App.tsx (handleGuestEntry) registers the guest and navigates.
    // If it fails, App shows an alert; reset the spinner shortly after.
    onContinue(name);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Background circles */}
      <View style={[styles.circle, styles.circleYellow]} />
      <View style={[styles.circle, styles.circlePurple]} />
      <View style={[styles.circle, styles.circleBlue]} />
      <View style={[styles.circle, styles.circleGreen]} />

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <View style={styles.inner}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Play as</Text>
          <Text style={styles.titleAccent}>Guest</Text>
          <Text style={styles.subtitle}>
            {mode === "player"
              ? "No account needed. Just a nickname."
              : "Enter a nickname to join your group."}
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>👤</Text>
            </View>
            <Text style={styles.cardTitle}>Your nickname</Text>
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Enter a nickname"
              placeholderTextColor="#9AA0D0"
              value={nickname}
              onChangeText={(t) => {
                setNickname(t);
                if (error) setError("");
              }}
              maxLength={15}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
            <Text style={styles.pencil}>✎</Text>
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Text style={styles.hint}>
            ✦ This will be your display name in the game.
          </Text>

          <TouchableOpacity
            style={[styles.continueBtn, loading && { opacity: 0.7 }]}
            onPress={handleContinue}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#1E2A78" />
            ) : (
              <Text style={styles.continueText}>Continue  →</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          {mode === "player"
            ? "Guest progress is saved on this device."
            : "You'll enter a room code on the next screen."}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6EA",
    overflow: "hidden",
  },

  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  // background decoration
  circle: { position: "absolute", borderRadius: 999 },
  circleYellow: { width: 260, height: 260, top: -80, left: -60, backgroundColor: "#FFEFC2" },
  circlePurple: { width: 220, height: 220, top: -40, right: -80, backgroundColor: "#E7E4FA" },
  circleBlue: { width: 240, height: 240, bottom: -60, left: -80, backgroundColor: "#D9ECFF" },
  circleGreen: { width: 260, height: 260, bottom: -90, right: -70, backgroundColor: "#CFEFB8" },

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
  backIcon: { fontSize: 22, color: "#1E2A78", fontWeight: "700" },

  header: { marginBottom: 24 },
  title: { fontSize: 38, fontWeight: "900", color: "#1E2A78" },
  titleAccent: { fontSize: 38, fontWeight: "900", color: "#FF9A1F", marginTop: -6 },
  subtitle: { marginTop: 8, color: "#5A5F9A", fontSize: 14, maxWidth: 240 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#FFC21A",
    padding: 18,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFEFC2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconText: { fontSize: 22 },
  cardTitle: { fontSize: 17, fontWeight: "800", color: "#1E2A78" },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F7FF",
    borderWidth: 2,
    borderColor: "#D9E8FA",
    borderRadius: 28,
    paddingHorizontal: 18,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 17,
    fontWeight: "700",
    color: "#1E2A78",
  },
  pencil: { fontSize: 18, color: "#4DA3FF" },

  error: { color: "#E53935", marginTop: 8, marginLeft: 6, fontSize: 13 },
  hint: { marginTop: 12, marginLeft: 6, color: "#5A5F9A", fontSize: 13 },

  continueBtn: {
    marginTop: 18,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#FFC21A",
    borderBottomWidth: 6,
    borderBottomColor: "#E8A50C",
    alignItems: "center",
    justifyContent: "center",
  },
  continueText: { fontSize: 20, fontWeight: "900", color: "#1E2A78" },

  footer: {
    textAlign: "center",
    marginTop: 18,
    color: "#5A5F9A",
    fontSize: 13,
  },
});
