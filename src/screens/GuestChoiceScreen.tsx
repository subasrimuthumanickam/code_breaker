
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
