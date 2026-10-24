import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { DIFFICULTY_CONFIG } from "../types/game";

interface HelpScreenProps {
  onBack: () => void;
  // Optional — shows a "Play game" button in the hero when provided
  onPlay?: () => void;
  darkMode?: boolean;
  playerName?: string;
}


const GREEN = "#22C55E";
const YELLOW = "#F5C518";
const GREY = "#4B5563";
const PURPLE = "#8B5CF6";
const SKY = "#38BDF8";

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
        body: "#C7CEF2",
        chip: "rgba(255,255,255,0.07)",
      }
    : {
        bgGradient: ["#F3F4FF", "#ECEEFF", "#E6E9FF"] as [string, string, string],
        heroColors: ["#7C5CFF", "#6D4AFF", "#4F46E5"] as [string, string, string],
        card: "rgba(255,255,255,0.92)",
        border: "rgba(99,102,241,0.18)",
        divider: "rgba(99,102,241,0.14)",
        text: "#141A4A",
        subtext: "#5B6499",
        body: "#3B4373",
        chip: "rgba(99,102,241,0.09)",
      };

type Palette = ReturnType<typeof getPalette>;

/* =====================================================
   CONTENT
===================================================== */
const STEPS: { n: number; icon: keyof typeof Ionicons.glyphMap; tint: string; title: string; text: string }[] = [
  {
    n: 1,
    icon: "search",
    tint: "#7C3AED",
    title: "Read the clue",
    text: "Every guess comes back with a colour for each digit. Use them to narrow things down.",
  },
  {
    n: 2,
    icon: "keypad",
    tint: "#0EA5E9",
    title: "Make your guess",
    text: "Tap digits on the keypad. Your guess is sent as soon as the last slot is filled.",
  },
  {
    n: 3,
    icon: "lock-open",
    tint: "#16A34A",
    title: "Unlock the code",
    text: "Get every digit in the right place before your attempts or the timer run out.",
  },
];

const TIPS: { icon: keyof typeof Ionicons.glyphMap; tint: string; title: string; text: string }[] = [
  {
    icon: "layers-outline",
    tint: "#A78BFA",
    title: "No repeats",
    text: "No two digits repeat in the code, so a digit you have placed is never used twice.",
  },
  {
    icon: "color-palette-outline",
    tint: SKY,
    title: "Trust the keypad",
    text: "Keys turn green, yellow or grey as you learn more. Grey keys can be ruled out.",
  },
  {
    icon: "time-outline",
    tint: "#F87171",
    title: "Watch the clock",
    text: "The timer turns red for the last 10 seconds. Guess with purpose when it does.",
  },
  {
    icon: "flame-outline",
    tint: "#FBBF24",
    title: "Build combos",
    text: "A guess with more digits in the right place than any earlier guess starts a combo.",
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Can a digit appear twice in the code?",
    a: "No. Every digit in the secret code is different, so you can rule a digit out once it comes back grey.",
  },
  {
    q: "What happens when time runs out?",
    a: "The round ends and the secret code is shown. You can try again or go back to the menu.",
  },
  {
    q: "How do I earn Gold, Silver or Bronze?",
    a: "Badges depend on how many attempts you use. Cracking the code with 40% or fewer of your attempts earns Gold, up to 70% earns Silver, and anything more earns Bronze.",
  },
  {
    q: "How do I unlock the next level?",
    a: "Complete the level before it. Locked levels tell you which one to finish first.",
  },
  {
    q: "How do I reset my stats?",
    a: "Open Settings, find the Data section and choose Reset Stats. This clears your high score and game history.",
  },
];

/* =====================================================
   SMALL BUILDING BLOCK: a coloured digit tile
===================================================== */
const ClueTile: React.FC<{ digit: string; color: string; textColor: string }> = ({ digit, color, textColor }) => (
  <View style={[tileStyles.tile, { backgroundColor: color + "33", borderColor: color }]}>
    <Text style={[tileStyles.tileText, { color: textColor }]}>{digit}</Text>
  </View>
);

const tileStyles = StyleSheet.create({
  tile: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  tileText: {
    fontSize: 22,
    fontWeight: "900",
  },
});

const HelpScreen: React.FC<HelpScreenProps> = ({ onBack, onPlay, darkMode = true, playerName = "Player" }) => {
  const c = getPalette(darkMode);
  const styles = useMemo(() => makeStyles(c), [darkMode]);

  // measured width of the screen area (sidebar excluded) -> desktop layout switch
  const { width: winWidth } = useWindowDimensions();
  const [layoutW, setLayoutW] = useState<number | null>(null);
  const wide = (layoutW ?? winWidth) >= 860;

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const levels = Object.entries(DIFFICULTY_CONFIG);

  const greyText = darkMode ? "#9CA3AF" : "#6B7280";

  /* ---------- clue example ---------- */
  const cluesCard = (
    <View style={[styles.card, wide && styles.flexGrow]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircleSm, { backgroundColor: "rgba(56,189,248,0.2)" }]}>
          <Ionicons name="sparkles" size={18} color={SKY} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Reading the clues</Text>
          <Text style={styles.cardSub}>Say the secret code is 4 2 7 and you guess 4 7 1</Text>
        </View>
      </View>

      <View style={styles.exampleRow}>
        <ClueTile digit="4" color={GREEN} textColor={GREEN} />
        <ClueTile digit="7" color={YELLOW} textColor={YELLOW} />
        <ClueTile digit="1" color={GREY} textColor={greyText} />
      </View>

      <View style={styles.clueLine}>
        <Ionicons name="checkmark-circle" size={18} color={GREEN} />
        <Text style={styles.clueLineText}>
          <Text style={styles.clueStrong}>Green.</Text> 4 is in the code and in the right place.
        </Text>
      </View>
      <View style={styles.clueLine}>
        <Ionicons name="swap-horizontal" size={18} color={YELLOW} />
        <Text style={styles.clueLineText}>
          <Text style={styles.clueStrong}>Yellow.</Text> 7 is in the code but in the wrong place.
        </Text>
      </View>
      <View style={styles.clueLine}>
        <Ionicons name="close-circle" size={18} color={greyText} />
        <Text style={styles.clueLineText}>
          <Text style={styles.clueStrong}>Grey.</Text> 1 is not in the code at all.
        </Text>
      </View>
    </View>
  );

  /* ---------- levels ---------- */
  const levelsCard = (
    <View style={[styles.card, wide && styles.flexGrow]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircleSm, { backgroundColor: "rgba(245,197,24,0.2)" }]}>
          <Ionicons name="podium-outline" size={18} color={YELLOW} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Levels</Text>
          <Text style={styles.cardSub}>Finish a level to unlock the next one</Text>
        </View>
      </View>

      {levels.map(([key, cfg], i) => (
        <View key={key} style={[styles.levelRow, i < levels.length - 1 && styles.levelDivider]}>
          <View style={[styles.levelDot, { backgroundColor: cfg.color }]}>
            <Text style={styles.levelDotText}>{cfg.codeLength}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.levelName, { color: cfg.color }]}>{cfg.label}</Text>
            <Text style={styles.levelMeta}>
              {cfg.codeLength} digits · {cfg.maxAttempts} attempts · {cfg.timeLimitSec}s
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  /* ---------- tips ---------- */
  const tipsCard = (
    <View style={[styles.card, wide && styles.flexGrow]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircleSm, { backgroundColor: "rgba(124,58,237,0.25)" }]}>
          <Ionicons name="bulb-outline" size={18} color="#C4B5FD" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Tips from the vault</Text>
          <Text style={styles.cardSub}>Small habits that crack codes faster</Text>
        </View>
      </View>

      {TIPS.map((t, i) => (
        <View key={t.title} style={[styles.tipRow, i < TIPS.length - 1 && styles.levelDivider]}>
          <View style={[styles.tipIcon, { backgroundColor: t.tint + "26" }]}>
            <Ionicons name={t.icon} size={20} color={t.tint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>{t.title}</Text>
            <Text style={styles.tipText}>{t.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  /* ---------- FAQ ---------- */
  const faqCard = (
    <View style={[styles.card, wide && styles.flexGrow]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircleSm, { backgroundColor: "rgba(34,197,94,0.2)" }]}>
          <Ionicons name="help-circle-outline" size={20} color={GREEN} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Common questions</Text>
          <Text style={styles.cardSub}>Tap a question to see the answer</Text>
        </View>
      </View>

      {FAQ.map((item, i) => {
        const open = openFaq === i;
        return (
          <View key={item.q} style={[styles.faqItem, i < FAQ.length - 1 && styles.levelDivider]}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              style={({ pressed }) => [styles.faqQuestionRow, pressed && { opacity: 0.8 }]}
              onPress={() => setOpenFaq(open ? null : i)}
            >
              <Text style={[styles.faqQuestion, open && { color: "#C4B5FD" }]}>{item.q}</Text>
              <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={open ? "#C4B5FD" : c.subtext} />
            </Pressable>
            {open && <Text style={styles.faqAnswer}>{item.a}</Text>}
          </View>
        );
      })}
    </View>
  );

  return (
    <LinearGradient
      colors={c.bgGradient}
      style={styles.container}
      onLayout={(e) => setLayoutW(e.nativeEvent.layout.width)}
    >
      {/* ================= HEADER ================= */}
      <View style={[styles.header, { paddingTop: wide ? 14 : 44, paddingHorizontal: wide ? 32 : 20 }]}>
        <View style={styles.headerLeft}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            onPress={onBack}
          >
            <Ionicons name="arrow-back" size={22} color={c.text} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Help</Text>
            <Text style={styles.headerSub}>Learn how to play and get unstuck</Text>
          </View>
        </View>

        <View style={styles.playerPill}>
          <View style={styles.playerAvatar}>
            <Ionicons name="person" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.playerName}>{playerName}</Text>
          <Ionicons name="chevron-down" size={14} color={c.subtext} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: wide ? 32 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stack}>
          {/* ================= HERO ================= */}
          <LinearGradient
            colors={c.heroColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hero, wide && styles.heroWide]}
          >
            <View style={styles.heroLeft}>
              <View style={styles.heroBadge}>
                <Ionicons name="help-buoy" size={12} color="#FFFFFF" />
                <Text style={styles.heroBadgeText}>Help Center</Text>
              </View>
              <Text style={[styles.heroTitle, wide && styles.heroTitleWide]}>
                HOW TO <Text style={{ color: "#C4B5FD" }}>PLAY</Text>
              </Text>
              <Text style={styles.heroSub}>
                Learn the clues, pick up a few tips and crack every level. It takes about a minute to read.
              </Text>

              {onPlay && (
                <Pressable onPress={onPlay} style={({ pressed }) => [styles.playWrap, pressed && styles.pressed]}>
                  <LinearGradient
                    colors={["#4F46E5", "#A855F7"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.playButton}
                  >
                    <Ionicons name="play" size={16} color="#FFFFFF" />
                    <Text style={styles.playText}>PLAY GAME</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </LinearGradient>
                </Pressable>
              )}
            </View>

            {wide && (
              <View style={styles.heroArt}>
                <View style={styles.heroGlow} />
                <View style={[styles.floatTile, { top: 12, left: 30, transform: [{ rotate: "-12deg" }], borderColor: GREEN }]}>
                  <Text style={styles.floatTileText}>4</Text>
                </View>
                <View style={[styles.floatTile, { top: 4, right: 34, transform: [{ rotate: "10deg" }], borderColor: YELLOW }]}>
                  <Text style={styles.floatTileText}>7</Text>
                </View>
                <View style={[styles.floatTile, { bottom: 10, left: 48, transform: [{ rotate: "8deg" }], borderColor: GREY }]}>
                  <Text style={styles.floatTileText}>1</Text>
                </View>
                <View style={[styles.floatTile, { bottom: 6, right: 40, transform: [{ rotate: "-9deg" }], borderColor: SKY }]}>
                  <Text style={styles.floatTileText}>?</Text>
                </View>
                <LinearGradient colors={["#C4B5FF", "#7C5CFF"]} style={styles.heroIconBody}>
                  <Ionicons name="help" size={56} color="#FFFFFF" />
                </LinearGradient>
              </View>
            )}
          </LinearGradient>

          {/* ================= 3 STEPS ================= */}
          <View style={wide ? styles.rowWrap : styles.colWrap}>
            {STEPS.map((s) => (
              <View
                key={s.n}
                style={[
                  styles.stepCard,
                  wide && styles.flex1,
                  { backgroundColor: s.tint + "1A", borderColor: s.tint + "66" },
                ]}
              >
                <View style={[styles.stepIcon, { backgroundColor: s.tint }]}>
                  <Ionicons name={s.icon} size={22} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>
                    {s.n}. {s.title}
                  </Text>
                  <Text style={styles.stepText}>{s.text}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ================= CLUES + LEVELS ================= */}
          {wide ? (
            <View style={styles.rowWrapTop}>
              <View style={styles.colGrow}>{cluesCard}</View>
              <View style={styles.colShrink}>{levelsCard}</View>
            </View>
          ) : (
            <>
              {cluesCard}
              {levelsCard}
            </>
          )}

          {/* ================= TIPS + FAQ ================= */}
          {wide ? (
            <View style={styles.rowWrapTop}>
              <View style={styles.colShrink}>{tipsCard}</View>
              <View style={styles.colGrow}>{faqCard}</View>
            </View>
          ) : (
            <>
              {tipsCard}
              {faqCard}
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default HelpScreen;

/* =====================================================
   STYLES
===================================================== */
const makeStyles = (c: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    pressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    flex1: {
      flex: 1,
      minWidth: 0,
    },
    flexGrow: {
      alignSelf: "stretch",
    },
    colGrow: {
      flex: 1.2,
      minWidth: 0,
    },
    colShrink: {
      flex: 1,
      minWidth: 0,
    },

    /* ---- header ---- */
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 12,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      flexShrink: 1,
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
      paddingVertical: 26,
      paddingHorizontal: 32,
      minHeight: 200,
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
      fontSize: 44,
    },
    heroSub: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 21,
      color: "rgba(255,255,255,0.8)",
      maxWidth: 520,
    },
    playWrap: {
      alignSelf: "flex-start",
      marginTop: 18,
    },
    playButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 14,
      paddingHorizontal: 26,
      borderRadius: 28,
      shadowColor: "#6D4AFF",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    playText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "900",
      letterSpacing: 1,
    },
    heroArt: {
      width: 300,
      height: 170,
      justifyContent: "center",
      alignItems: "center",
    },
    heroGlow: {
      position: "absolute",
      width: 176,
      height: 176,
      borderRadius: 88,
      backgroundColor: "rgba(255,255,255,0.07)",
    },
    heroIconBody: {
      width: 100,
      height: 100,
      borderRadius: 30,
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
      position: "absolute",
      width: 46,
      height: 46,
      borderRadius: 13,
      borderWidth: 1.5,
      backgroundColor: "rgba(10,15,60,0.7)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
    },
    floatTileText: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "900",
    },

    /* ---- steps ---- */
    stepCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 14,
      padding: 18,
      borderRadius: 20,
      borderWidth: 1,
    },
    stepIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    stepTitle: {
      color: c.text,
      fontSize: 16,
      fontWeight: "800",
    },
    stepText: {
      color: c.body,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 4,
    },

    /* ---- generic card ---- */
    card: {
      backgroundColor: c.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      padding: 18,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    },
    iconCircleSm: {
      width: 38,
      height: 38,
      borderRadius: 19,
      justifyContent: "center",
      alignItems: "center",
    },
    cardTitle: {
      color: c.text,
      fontSize: 16,
      fontWeight: "800",
    },
    cardSub: {
      color: c.subtext,
      fontSize: 12,
      marginTop: 1,
    },

    /* ---- clues example ---- */
    exampleRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    clueLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 6,
    },
    clueLineText: {
      color: c.body,
      fontSize: 13.5,
      flexShrink: 1,
    },
    clueStrong: {
      color: c.text,
      fontWeight: "800",
    },

    /* ---- levels ---- */
    levelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingVertical: 12,
    },
    levelDivider: {
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
    },
    levelDot: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    levelDotText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "900",
    },
    levelName: {
      fontSize: 15,
      fontWeight: "800",
    },
    levelMeta: {
      color: c.subtext,
      fontSize: 12.5,
      marginTop: 2,
    },

    /* ---- tips ---- */
    tipRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 14,
      paddingVertical: 12,
    },
    tipIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    tipTitle: {
      color: c.text,
      fontSize: 14.5,
      fontWeight: "800",
    },
    tipText: {
      color: c.body,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 3,
    },

    /* ---- faq ---- */
    faqItem: {
      paddingVertical: 4,
    },
    faqQuestionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      paddingVertical: 12,
    },
    faqQuestion: {
      flex: 1,
      color: c.text,
      fontSize: 14.5,
      fontWeight: "700",
    },
    faqAnswer: {
      color: c.body,
      fontSize: 13.5,
      lineHeight: 20,
      paddingBottom: 12,
      paddingRight: 24,
    },
  });
