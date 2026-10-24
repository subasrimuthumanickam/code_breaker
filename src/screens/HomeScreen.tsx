
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getTheme } from "../theme/theme";
import { FadeInUp, Pulse, PressableScale, PopIn } from "../components/motion";
import LockAnimation from "../components/LockAnimation";
import HowToPlayModal from "./HowtoPlayModal";

interface HomeScreenProps {
  highScore: number;
  gamesPlayed?: number;
  successRate?: number; // 0–100
  playerName?: string;
  darkMode: boolean;
  onBack?: () => void; // back arrow -> Menu screen
  onPlay: () => void;
  onStats: () => void;
  onSettings: () => void;
  onProfile?: () => void; // opens the Profile page
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  playerName = "Player",
  darkMode,
  onBack,
  onPlay,
  onSettings,
  onProfile,
}) => {
  const theme = getTheme(darkMode);
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <LinearGradient colors={theme.gradient} style={styles.container}>
      {/* ================= TOP BAR ================= */}
      <FadeInUp distance={-16} duration={400}>
        <View style={[styles.topBar, { paddingTop: wide ? 14 : 44 }]}>
          <View style={styles.brandRow}>
            {/* Back arrow -> Menu screen */}
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Back to menu"
              onPress={onBack}
              scaleTo={0.88}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </PressableScale>

            <PopIn>
              <View style={styles.shieldWrap}>
                <Ionicons name="shield" size={32} color="#7C4DFF" />
                <Ionicons name="code-slash" size={14} color="#FFFFFF" style={styles.shieldInner} />
              </View>
            </PopIn>
            <Text style={styles.topTitle} numberOfLines={1}>
              Code Breaker
            </Text>
          </View>

          {/* Tap the player pill -> Profile page */}
          <PressableScale onPress={onProfile ?? onSettings} scaleTo={0.94} style={styles.playerPill}>
            <View style={styles.playerAvatar}>
              <Ionicons name="person" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.playerName} numberOfLines={1}>
              {playerName}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#C4C9F5" />
          </PressableScale>
        </View>
      </FadeInUp>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: wide ? 28 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HERO ================= */}
        <FadeInUp delay={100} duration={500}>
          <LinearGradient
            colors={["#1A1470", "#2A1B95", "#151055"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hero, wide ? styles.heroWide : styles.heroNarrow]}
          >
            <View style={styles.heroSwoosh} pointerEvents="none" />

            <View style={[styles.heroText, wide && { flex: 1 }]}>
              <FadeInUp delay={200} style={{ alignSelf: "flex-start" }}>
                <View style={styles.welcomeBadge}>
                  <Text style={styles.welcomeText}>👋 Welcome Back!</Text>
                </View>
              </FadeInUp>

              <FadeInUp delay={300}>
                <Text style={[styles.heroTitle, { fontSize: wide ? 42 : 30 }]}>
                  CRACK THE <Text style={{ color: "#A855F7" }}>CODE</Text>
                </Text>
              </FadeInUp>

              <FadeInUp delay={400}>
                <Text style={styles.heroDesc}>
                  Use your logic, solve the clues and unlock the secrets.{"\n"}Are you ready for the challenge?
                </Text>
              </FadeInUp>

              {/* PLAY GAME + HOW TO PLAY buttons */}
              <FadeInUp delay={500} style={{ alignSelf: "flex-start" }}>
                <View style={styles.buttonsRow}>
                  <Pulse to={1.05}>
                    <PressableScale onPress={onPlay} scaleTo={0.94} style={styles.playWrapper}>
                      <LinearGradient
                        colors={["#5B6CFF", "#A855F7"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.playButton}
                      >
                        <Ionicons name="play" size={18} color="#FFFFFF" />
                        <Text style={styles.playText}>PLAY GAME</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                      </LinearGradient>
                    </PressableScale>
                  </Pulse>

                  <PressableScale
                    onPress={() => setShowHowTo(true)}
                    scaleTo={0.94}
                    style={styles.howButton}
                  >
                    <Ionicons name="help-circle-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.howButtonText}>HOW TO PLAY</Text>
                  </PressableScale>
                </View>
              </FadeInUp>
            </View>

            {/* Animated lock: numbers orbit, key opens the lock */}
            <FadeInUp delay={350} duration={600} style={wide ? styles.heroArtWide : styles.heroArtNarrow}>
              <LockAnimation size={wide ? 300 : 240} />
            </FadeInUp>
          </LinearGradient>
        </FadeInUp>
      </ScrollView>

      {/* ================= HOW TO PLAY VIDEO ================= */}
      <HowToPlayModal visible={showHowTo} onClose={() => setShowHowTo(false)} />
    </LinearGradient>
  );
};

export default HomeScreen;

/* ===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 18,
    paddingBottom: 32,
    gap: 18,
  },

  /* ---- top bar ---- */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(120,130,255,0.15)",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59,64,180,0.28)",
    borderWidth: 1,
    borderColor: "rgba(120,130,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  shieldWrap: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  shieldInner: {
    position: "absolute",
  },
  topTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    flexShrink: 1,
  },
  playerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 14,
    borderRadius: 24,
    backgroundColor: "rgba(59,64,180,0.28)",
    borderWidth: 1,
    borderColor: "rgba(120,130,255,0.2)",
    maxWidth: 150,
    marginLeft: 8,
  },
  playerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#6D4AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  playerName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },

  /* ---- hero ---- */
  hero: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(124,92,255,0.3)",
    overflow: "hidden",
    padding: 28,
  },
  heroWide: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 250,
  },
  heroNarrow: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  heroSwoosh: {
    position: "absolute",
    right: -120,
    top: -80,
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: "rgba(109,74,255,0.22)",
  },
  heroText: {
    zIndex: 2,
  },
  heroArtWide: {
    width: 320,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  heroArtNarrow: {
    alignSelf: "center",
    marginTop: 8,
    height: 250,
    justifyContent: "center",
    zIndex: 2,
  },
  welcomeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(109,74,255,0.55)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  welcomeText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "700",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    letterSpacing: 0.5,
    marginTop: 14,
  },
  heroDesc: {
    color: "#D7DBFF",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
    maxWidth: 520,
  },

  /* ---- buttons ---- */
  buttonsRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 14,
    marginTop: 24,
  },
  playWrapper: {
    alignSelf: "flex-start",
    borderRadius: 32,
    shadowColor: "#7C4DFF",
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 34,
    borderRadius: 32,
  },
  playText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  howButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 26,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: "rgba(168,85,247,0.8)",
    backgroundColor: "rgba(168,85,247,0.15)",
  },
  howButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
