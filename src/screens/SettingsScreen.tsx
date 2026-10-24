
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AnimatedSwitch from "../components/AnimatedSwitch";
import { FadeInUp, Float, PopIn, PressableScale, useShake } from "../components/motion";
import { haptic, previewHaptic, previewSound } from "../utils/feedback";

export interface SettingsData {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  darkMode: boolean;
}

interface SettingsScreenProps {
  settings: SettingsData;
  onChange: (settings: SettingsData) => void;
  onBack: () => void;
  onResetStats: () => void;
  playerName?: string;
}

/* =====================================================
   DESIGN TOKENS
===================================================== */
const PURPLE = "#8B5CF6";
const SKY = "#38BDF8";
const AMBER = "#FBBF24";
const RED = "#F87171";
const GREEN = "#34D399";

const getPalette = (dark: boolean) =>
  dark
    ? {
        bgGradient: ["#060A20", "#0A0F2E", "#0C1236"] as [string, string, string],
        heroColors: ["#2A1B6B", "#1B1F6E", "#0F1550"] as [string, string, string],
        card: "rgba(20,27,84,0.55)",
        border: "rgba(120,130,255,0.18)",
        divider: "rgba(120,130,255,0.14)",
        text: "#FFFFFF",
        subtext: "#8FA0D8",
        chip: "rgba(255,255,255,0.07)",
        switchOff: "#2E3570",
      }
    : {
        bgGradient: ["#F3F4FF", "#ECEEFF", "#E6E9FF"] as [string, string, string],
        heroColors: ["#7C5CFF", "#6D4AFF", "#4F46E5"] as [string, string, string],
        card: "rgba(255,255,255,0.92)",
        border: "rgba(99,102,241,0.18)",
        divider: "rgba(99,102,241,0.14)",
        text: "#141A4A",
        subtext: "#5B6499",
        chip: "rgba(99,102,241,0.09)",
        switchOff: "#C7CBEA",
      };

type Palette = ReturnType<typeof getPalette>;

/* =====================================================
   Small animated helpers
===================================================== */

/* Icon circle: pops in, and bounces every time `value` flips */
const IconBubble: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  value: boolean;
  delay: number;
  style: StyleProp<ViewStyle>;
}> = ({ icon, tint, value, delay, style }) => {
  const bounce = useRef(new Animated.Value(1)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    Animated.sequence([
      Animated.timing(bounce, { toValue: 1.3, duration: 110, useNativeDriver: true }),
      Animated.spring(bounce, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }),
    ]).start();
  }, [value]);

  return (
    <PopIn delay={delay}>
      <Animated.View style={[style, { backgroundColor: tint, transform: [{ scale: bounce }] }]}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
      </Animated.View>
    </PopIn>
  );
};

/* Slow endless rotation (settings gear) */
const Spin: React.FC<{ children: React.ReactNode; duration?: number }> = ({ children, duration = 14000 }) => {
  const r = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(r, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View
      style={{ transform: [{ rotate: r.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }] }}
    >
      {children}
    </Animated.View>
  );
};

/* A floating icon tile in the hero art */
const FloatTile: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  borderColor: string;
  rotate: string;
  pos: StyleProp<ViewStyle>;
  delay: number;
  tileStyle: StyleProp<ViewStyle>;
}> = ({ icon, iconColor, borderColor, rotate, pos, delay, tileStyle }) => (
  <Float delay={delay} y={8} style={[{ position: "absolute", zIndex: 2 }, pos]}>
    <View style={[tileStyle, { borderColor, transform: [{ rotate }] }]}>
      <Ionicons name={icon} size={20} color={iconColor} />
    </View>
  </Float>
);

/* =====================================================
   One toggle card — defined OUTSIDE the screen so it
   doesn't remount (and lose animation) on every render
===================================================== */
interface ToggleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  label: string;
  hint: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  wide: boolean;
  delay: number;
  c: Palette;
  styles: ReturnType<typeof makeStyles>;
}

const ToggleCard: React.FC<ToggleCardProps> = ({
  icon,
  tint,
  label,
  hint,
  value,
  onValueChange,
  wide,
  delay,
  c,
  styles,
}) => (
  <FadeInUp delay={delay} style={wide ? styles.flex1 : undefined}>
    <View
      style={[
        styles.toggleCard,
        wide && { flex: 1 },
        { backgroundColor: tint + "1A", borderColor: value ? tint + "88" : c.border },
      ]}
    >
      <View style={styles.toggleTop}>
        <IconBubble icon={icon} tint={tint} value={value} delay={delay + 150} style={styles.iconCircle} />
        <AnimatedSwitch value={value} onValueChange={onValueChange} offColor={c.switchOff} />
      </View>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Text style={styles.toggleHint}>{hint}</Text>

      {/* key={value} -> the chip pops again every time it flips */}
      <PopIn key={String(value)} style={{ alignSelf: "flex-start", marginTop: 12 }}>
        <View style={[styles.statusPill, { backgroundColor: value ? tint + "33" : c.chip }]}>
          <View style={[styles.statusDot, { backgroundColor: value ? tint : c.subtext }]} />
          <Text style={[styles.statusText, { color: value ? tint : c.subtext }]}>{value ? "On" : "Off"}</Text>
        </View>
      </PopIn>
    </View>
  </FadeInUp>
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onChange,
  onBack,
  onResetStats,
  playerName = "Player",
}) => {
  const c = getPalette(settings.darkMode);
  const styles = useMemo(() => makeStyles(c), [settings.darkMode]);

  // measured width of the screen area (sidebar excluded) -> desktop layout switch
  const { width: winWidth } = useWindowDimensions();
  const [layoutW, setLayoutW] = useState<number | null>(null);
  const wide = (layoutW ?? winWidth) >= 860;

  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const { x: confirmShakeX, shake: shakeConfirm } = useShake();

  const update = (patch: Partial<SettingsData>) => {
    // instant preview so the player can feel / hear what they just switched on
    if (patch.soundEnabled === true) previewSound();
    if (patch.hapticsEnabled === true) previewHaptic();
    if (patch.darkMode !== undefined) haptic("tap");
    onChange({ ...settings, ...patch });
  };

  const openConfirm = () => {
    setResetDone(false);
    setConfirmReset(true);
    setTimeout(shakeConfirm, 250); // warning shake right after it appears
  };

  const handleConfirmReset = () => {
    onResetStats();
    setConfirmReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <LinearGradient
      colors={c.bgGradient}
      style={styles.container}
      onLayout={(e) => setLayoutW(e.nativeEvent.layout.width)}
    >
      {/* ================= HEADER ================= */}
      <FadeInUp distance={-14} duration={350}>
        <View style={[styles.header, { paddingTop: wide ? 14 : 44, paddingHorizontal: wide ? 32 : 20 }]}>
          <View style={styles.headerLeft}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Back"
              scaleTo={0.88}
              style={styles.backButton}
              onPress={onBack}
            >
              <Ionicons name="arrow-back" size={22} color={c.text} />
            </PressableScale>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Settings</Text>
              <Text style={styles.headerSub} numberOfLines={1}>
                Customize your game experience
              </Text>
            </View>
          </View>

          <PopIn delay={200}>
            <View style={styles.playerPill}>
              <View style={styles.playerAvatar}>
                <Ionicons name="person" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.playerName} numberOfLines={1}>
                {playerName}
              </Text>
              <Ionicons name="chevron-down" size={14} color={c.subtext} />
            </View>
          </PopIn>
        </View>
      </FadeInUp>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: wide ? 32 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stack}>
          {/* ================= HERO ================= */}
          <FadeInUp delay={100} duration={500}>
            <LinearGradient
              colors={c.heroColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.hero, wide && styles.heroWide]}
            >
              <View style={styles.heroLeft}>
                <PopIn delay={250} style={{ alignSelf: "flex-start" }}>
                  <View style={styles.heroBadge}>
                    <Ionicons name="options" size={12} color="#FFFFFF" />
                    <Text style={styles.heroBadgeText}>Personalize</Text>
                  </View>
                </PopIn>
                <FadeInUp delay={300}>
                  <Text style={[styles.heroTitle, wide && styles.heroTitleWide]}>
                    MAKE IT <Text style={{ color: "#C4B5FD" }}>YOURS</Text>
                  </Text>
                </FadeInUp>
                <FadeInUp delay={400}>
                  <Text style={styles.heroSub}>
                    Sound, haptics and theme in one place. Changes apply as soon as you flip a switch.
                  </Text>
                </FadeInUp>
              </View>

              {/* Hero art: full size on wide screens, scaled down on mobile */}
              <FadeInUp delay={350} duration={600}>
                <View style={wide ? undefined : styles.heroArtMobileWrap}>
                  <View style={[styles.heroArt, !wide && styles.heroArtMobile]}>
                    <View style={styles.heroGlow} />
                    <FloatTile
                      icon="volume-high"
                      iconColor="#DDD6FE"
                      borderColor={PURPLE}
                      rotate="-12deg"
                      pos={{ top: 12, left: 34 }}
                      delay={0}
                      tileStyle={styles.floatTile}
                    />
                    <FloatTile
                      icon="phone-portrait"
                      iconColor="#BAE6FD"
                      borderColor={SKY}
                      rotate="10deg"
                      pos={{ top: 4, right: 36 }}
                      delay={500}
                      tileStyle={styles.floatTile}
                    />
                    <FloatTile
                      icon="moon"
                      iconColor="#FDE68A"
                      borderColor={AMBER}
                      rotate="-9deg"
                      pos={{ bottom: 8, right: 44 }}
                      delay={1000}
                      tileStyle={styles.floatTile}
                    />
                    <Float y={6}>
                      <LinearGradient colors={["#C4B5FF", "#7C5CFF"]} style={styles.heroIconBody}>
                        <Spin>
                          <Ionicons name="settings" size={52} color="#FFFFFF" />
                        </Spin>
                      </LinearGradient>
                    </Float>
                  </View>
                </View>
              </FadeInUp>
            </LinearGradient>
          </FadeInUp>

          {/* ================= PREFERENCES ================= */}
          <View style={wide ? styles.rowWrap : styles.colWrap}>
            <ToggleCard
              icon={settings.soundEnabled ? "volume-high" : "volume-mute"}
              tint="#A78BFA"
              label="Sound Effects"
              hint="Play sounds for guesses, wins and combos"
              value={settings.soundEnabled}
              onValueChange={(v) => update({ soundEnabled: v })}
              wide={wide}
              delay={300}
              c={c}
              styles={styles}
            />
            <ToggleCard
              icon="phone-portrait"
              tint="#38BDF8"
              label="Haptic Feedback"
              hint="Feel a small vibration when you tap"
              value={settings.hapticsEnabled}
              onValueChange={(v) => update({ hapticsEnabled: v })}
              wide={wide}
              delay={420}
              c={c}
              styles={styles}
            />
            <ToggleCard
              icon={settings.darkMode ? "moon" : "sunny"}
              tint="#FBBF24"
              label="Dark Mode"
              hint="Easier on the eyes in low light"
              value={settings.darkMode}
              onValueChange={(v) => update({ darkMode: v })}
              wide={wide}
              delay={540}
              c={c}
              styles={styles}
            />
          </View>

          {/* ================= DATA + ABOUT ================= */}
          <View style={[wide ? styles.rowWrapTop : styles.colWrap]}>
            {/* ---- data ---- */}
            <FadeInUp delay={660} style={wide ? styles.flex1 : undefined}>
              <View style={[styles.panel, { borderColor: "rgba(248,113,113,0.3)" }]}>
                <View style={styles.panelHeader}>
                  <PopIn delay={760}>
                    <View style={[styles.iconCircleSm, { backgroundColor: "rgba(248,113,113,0.18)" }]}>
                      <Ionicons name="server-outline" size={18} color={RED} />
                    </View>
                  </PopIn>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.panelTitle}>Data</Text>
                    <Text style={styles.panelSub}>Manage what is saved on this device</Text>
                  </View>
                </View>

                {!confirmReset ? (
                  <PressableScale scaleTo={0.97} style={styles.resetRow} onPress={openConfirm}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.rowLabel, { color: RED }]}>Reset Stats</Text>
                      <Text style={styles.rowHint}>Clear your high score, streaks and game history</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={c.subtext} />
                  </PressableScale>
                ) : (
                  <FadeInUp distance={12} duration={300}>
                    <Animated.View style={[styles.confirmBox, { transform: [{ translateX: confirmShakeX }] }]}>
                      <View style={styles.confirmHead}>
                        <Ionicons name="warning" size={20} color={AMBER} />
                        <Text style={styles.confirmTitle}>Reset all stats?</Text>
                      </View>
                      <Text style={styles.confirmText}>
                        This permanently clears your high score, streaks and games played. It cannot be undone.
                      </Text>
                      <View style={styles.confirmButtons}>
                        <PressableScale style={styles.cancelButton} onPress={() => setConfirmReset(false)}>
                          <Text style={styles.cancelText}>Cancel</Text>
                        </PressableScale>
                        <PressableScale style={styles.resetButton} onPress={handleConfirmReset}>
                          <Ionicons name="trash" size={16} color="#FFFFFF" />
                          <Text style={styles.resetText}>Yes, reset</Text>
                        </PressableScale>
                      </View>
                    </Animated.View>
                  </FadeInUp>
                )}

                {resetDone && (
                  <PopIn style={{ alignSelf: "flex-start" }}>
                    <View style={styles.doneBox}>
                      <Ionicons name="checkmark-circle" size={16} color={GREEN} />
                      <Text style={styles.doneText}>Stats reset</Text>
                    </View>
                  </PopIn>
                )}
              </View>
            </FadeInUp>

            {/* ---- about ---- */}
            <FadeInUp delay={780} style={wide ? styles.flex1 : undefined}>
              <View style={styles.panel}>
                <View style={styles.panelHeader}>
                  <PopIn delay={880}>
                    <View style={[styles.iconCircleSm, { backgroundColor: "rgba(139,92,246,0.22)" }]}>
                      <Ionicons name="information-circle-outline" size={20} color="#C4B5FD" />
                    </View>
                  </PopIn>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.panelTitle}>About</Text>
                    <Text style={styles.panelSub}>App and player details</Text>
                  </View>
                </View>

                <View style={styles.aboutRow}>
                  <Float y={4}>
                    <View style={styles.aboutShield}>
                      <Ionicons name="shield" size={40} color="#7C4DFF" />
                      <Ionicons name="code-slash" size={16} color="#FFFFFF" style={{ position: "absolute" }} />
                    </View>
                  </Float>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowLabel}>
                      Code <Text style={{ color: "#A855F7" }}>Breaker</Text>
                    </Text>
                    <Text style={styles.rowHint}>Think · Guess · Unlock</Text>
                  </View>
                  <PopIn delay={950}>
                    <View style={styles.versionPill}>
                      <Text style={styles.versionText}>v1.0.0</Text>
                    </View>
                  </PopIn>
                </View>

                <View style={styles.divider} />

                <View style={styles.aboutRow}>
                  <View style={[styles.iconCircleSm, { backgroundColor: "#6D4AFF" }]}>
                    <Ionicons name="person" size={16} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowHint}>Playing as</Text>
                    <Text style={styles.rowLabel}>{playerName}</Text>
                  </View>
                </View>
              </View>
            </FadeInUp>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SettingsScreen;

/* =====================================================
   STYLES
===================================================== */
const makeStyles = (c: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    flex1: {
      flex: 1,
      minWidth: 0,
    },

    /* ---- header ---- */
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 12,
      gap: 12,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      flex: 1,
      minWidth: 0,
    },
    headerTextWrap: {
      flexShrink: 1,
      minWidth: 0,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.chip,
      borderWidth: 1,
      borderColor: c.border,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      color: c.text,
      fontSize: 18,
      fontWeight: "800",
    },
    headerSub: {
      color: c.subtext,
      fontSize: 12.5,
      marginTop: 2,
    },
    playerPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 6,
      paddingLeft: 6,
      paddingRight: 14,
      borderRadius: 24,
      backgroundColor: c.chip,
      borderWidth: 1,
      borderColor: c.border,
      flexShrink: 0,
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
      color: c.text,
      fontSize: 14,
      fontWeight: "700",
      maxWidth: 90,
    },

    /* ---- layout ---- */
    scrollContent: {
      paddingTop: 8,
      paddingBottom: 40,
    },
    stack: {
      width: "100%",
      gap: 16,
    },
    rowWrap: {
      flexDirection: "row",
      gap: 16,
    },
    rowWrapTop: {
      flexDirection: "row",
      gap: 16,
      alignItems: "flex-start",
    },
    colWrap: {
      gap: 12,
    },

    /* ---- hero ---- */
    hero: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 22,
      padding: 20,
      borderWidth: 1,
      borderColor: "rgba(160,150,255,0.25)",
      overflow: "hidden",
    },
    heroWide: {
      justifyContent: "space-between",
      paddingVertical: 24,
      paddingHorizontal: 32,
      minHeight: 180,
      borderRadius: 24,
    },
    heroLeft: {
      flex: 1,
      paddingRight: 16,
    },
    heroBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 5,
      backgroundColor: "rgba(255,255,255,0.16)",
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
      marginBottom: 10,
    },
    heroBadgeText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "700",
    },
    heroTitle: {
      fontSize: 26,
      fontWeight: "900",
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
    heroTitleWide: {
      fontSize: 42,
    },
    heroSub: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 21,
      color: "rgba(255,255,255,0.8)",
      maxWidth: 520,
    },
    heroArt: {
      width: 300,
      height: 160,
      justifyContent: "center",
      alignItems: "center",
    },
    /* mobile: reserve a small 110x90 slot, draw the 300x160 art
       centered inside it and scale it down so layout stays small */
    heroArtMobileWrap: {
      width: 110,
      height: 90,
      justifyContent: "center",
      alignItems: "center",
    },
    heroArtMobile: {
      position: "absolute",
      left: -95, // (110 - 300) / 2
      top: -35, // (90 - 160) / 2
      transform: [{ scale: 0.4 }],
    },
    heroGlow: {
      position: "absolute",
      width: 170,
      height: 170,
      borderRadius: 85,
      backgroundColor: "rgba(255,255,255,0.07)",
    },
    heroIconBody: {
      width: 96,
      height: 96,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      transform: [{ rotate: "6deg" }],
      shadowColor: "#6D4AFF",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 18,
      elevation: 12,
    },
    floatTile: {
      width: 46,
      height: 46,
      borderRadius: 13,
      borderWidth: 1.5,
      backgroundColor: "rgba(10,15,60,0.7)",
      justifyContent: "center",
      alignItems: "center",
    },

    /* ---- toggle cards ---- */
    toggleCard: {
      borderRadius: 20,
      borderWidth: 1,
      padding: 18,
      gap: 4,
    },
    toggleTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    toggleLabel: {
      color: c.text,
      fontSize: 17,
      fontWeight: "800",
    },
    toggleHint: {
      color: c.subtext,
      fontSize: 12.5,
      lineHeight: 18,
    },
    statusPill: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "700",
    },

    /* ---- panels ---- */
    panel: {
      borderRadius: 20,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      padding: 18,
    },
    panelHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 14,
    },
    iconCircleSm: {
      width: 38,
      height: 38,
      borderRadius: 19,
      justifyContent: "center",
      alignItems: "center",
    },
    panelTitle: {
      color: c.text,
      fontSize: 16,
      fontWeight: "800",
    },
    panelSub: {
      color: c.subtext,
      fontSize: 12,
      marginTop: 1,
    },
    rowLabel: {
      color: c.text,
      fontSize: 16,
      fontWeight: "700",
    },
    rowHint: {
      color: c.subtext,
      fontSize: 12.5,
      marginTop: 3,
    },
    resetRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: 14,
      backgroundColor: "rgba(248,113,113,0.1)",
      borderWidth: 1,
      borderColor: "rgba(248,113,113,0.3)",
    },
    divider: {
      height: 1,
      backgroundColor: c.divider,
      marginVertical: 14,
    },
    aboutRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    aboutShield: {
      width: 44,
      height: 44,
      justifyContent: "center",
      alignItems: "center",
    },
    versionPill: {
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: "rgba(124,58,237,0.22)",
      borderWidth: 1,
      borderColor: "rgba(124,58,237,0.5)",
    },
    versionText: {
      color: "#C4B5FD",
      fontSize: 12.5,
      fontWeight: "700",
    },

    /* ---- reset confirm ---- */
    confirmBox: {
      gap: 10,
      padding: 14,
      borderRadius: 14,
      backgroundColor: "rgba(251,191,36,0.08)",
      borderWidth: 1,
      borderColor: "rgba(251,191,36,0.3)",
    },
    confirmHead: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    confirmTitle: {
      color: c.text,
      fontSize: 16,
      fontWeight: "800",
    },
    confirmText: {
      color: c.subtext,
      fontSize: 13,
      lineHeight: 19,
    },
    confirmButtons: {
      flexDirection: "row",
      gap: 10,
      marginTop: 6,
    },
    cancelButton: {
      paddingVertical: 12,
      paddingHorizontal: 22,
      borderRadius: 14,
      backgroundColor: c.chip,
      borderWidth: 1,
      borderColor: c.border,
    },
    cancelText: {
      color: c.text,
      fontWeight: "700",
      fontSize: 14,
    },
    resetButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 22,
      borderRadius: 14,
      backgroundColor: "#E5484D",
    },
    resetText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 14,
    },
    doneBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 12,
    },
    doneText: {
      color: GREEN,
      fontSize: 13,
      fontWeight: "600",
    },
  });
