
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../api/api";
import { FadeInUp, Float, PopIn, Pulse, PressableScale, useShake } from "../components/motion";

interface LevelInfo {
  level: number;
  slots: number;
  colors: number;
  maxGuesses: number;
  bestStars: number;
  unlocked: boolean; // playable right now
  completed?: boolean;
}

interface LevelMapScreenProps {
  darkMode: boolean;
  playerId?: string; // your logged-in user id; falls back to "guest"
  onBack: () => void;
  onSelect: (level: number) => void;
}

const PURPLE = "#7C3AED";
const GREEN = "#22C55E";
const YELLOW = "#F5C518";
const RED = "#F87171";
const GAP = 12;
const PER_GROUP = 10; // every 10 levels = a new difficulty group

// number of possible codes with no repeats = colors * (colors-1) * ... (slots terms)
const countCodes = (colors: number, slots: number) => {
  let r = 1;
  for (let i = 0; i < slots; i++) r *= colors - i;
  return r;
};

const getPalette = (dark: boolean) =>
  dark
    ? {
        bgGradient: ["#0B0520", "#130A30", "#1A0E3F"] as [string, string, string],
        card: "rgba(139,92,246,0.10)",
        cardBorder: "rgba(167,139,250,0.28)",
        text: "#FFFFFF",
        subtext: "#B4A7E8",
        cell: "rgba(139,92,246,0.16)",
        cellBorder: "rgba(167,139,250,0.3)",
        chip: "rgba(139,92,246,0.18)",
      }
    : {
        bgGradient: ["#F6F1FF", "#EFE7FF", "#E7DBFF"] as [string, string, string],
        card: "#FFFFFF",
        cardBorder: "rgba(124,58,237,0.22)",
        text: "#1E1147",
        subtext: "#6B5CA8",
        cell: "rgba(124,58,237,0.08)",
        cellBorder: "rgba(124,58,237,0.22)",
        chip: "rgba(124,58,237,0.10)",
      };

/* ---------------------------------------------------------------
   One level cell
   - playable  : number, tap to play (pulses when it is your next level)
   - done      : green tick + stars, closed until all levels are won
   - locked    : lock icon, shakes when tapped
---------------------------------------------------------------- */
interface LevelCellProps {
  lv: LevelInfo;
  isNext: boolean;
  onSelect: (level: number) => void;
  styles: ReturnType<typeof makeStyles>;
  subtext: string;
  baseDelay: number;
}

const LevelCell: React.FC<LevelCellProps> = ({ lv, isNext, onSelect, styles, subtext, baseDelay }) => {
  const { x, shake } = useShake();
  const done = !lv.unlocked && lv.bestStars > 0;

  const body = (
    <Animated.View style={{ transform: [{ translateX: x }] }}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={
          lv.unlocked
            ? `Play level ${lv.level}`
            : done
            ? `Level ${lv.level} completed`
            : `Level ${lv.level} locked`
        }
        onPress={() => (lv.unlocked ? onSelect(lv.level) : shake())}
        style={[
          styles.cell,
          isNext && styles.cellNext,
          done && { opacity: 0.75 },
          !lv.unlocked && !done && { opacity: 0.4 },
        ]}
      >
        {lv.unlocked ? (
          <Text style={styles.cellNumber}>{lv.level}</Text>
        ) : done ? (
          <Ionicons name="checkmark-circle" size={26} color={GREEN} style={{ marginVertical: 3 }} />
        ) : (
          <Ionicons name="lock-closed" size={24} color={subtext} style={{ marginVertical: 4 }} />
        )}
        <Text style={styles.cellMeta}>{lv.maxGuesses} guesses</Text>
        <View style={{ flexDirection: "row", gap: 3 }}>
          {[1, 2, 3].map((n) => (
            <PopIn key={n} delay={baseDelay + 250 + n * 120}>
              <Ionicons
                name={n <= lv.bestStars ? "star" : "star-outline"}
                size={15}
                color={n <= lv.bestStars ? YELLOW : "rgba(196,181,253,0.45)"}
              />
            </PopIn>
          ))}
        </View>
      </PressableScale>
    </Animated.View>
  );

  return isNext ? <Pulse to={1.04}>{body}</Pulse> : body;
};

const LevelMapScreen: React.FC<LevelMapScreenProps> = ({
  darkMode,
  playerId = "guest",
  onBack,
  onSelect,
}) => {
  const c = getPalette(darkMode);
  const styles = useMemo(() => makeStyles(c), [darkMode]);

  const [levels, setLevels] = useState<LevelInfo[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [allCompleted, setAllCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState(360);

  const scrollRef = useRef<ScrollView>(null);
  const cardY = useRef(0);
  const groupY = useRef<Record<number, number>>({});
  const didScroll = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/games/progress/${encodeURIComponent(playerId)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Could not load levels (${res.status})`);
      setLevels(data.levels ?? []);
      setTotalStars(data.totalStars ?? 0);
      setAllCompleted(!!data.allCompleted);
    } catch (err: any) {
      setError(err.message || "Could not reach the server");
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    load();
  }, [load]);

  // Layout: 5 columns on wide screens, 3 columns on phones.
  const cols = width >= 640 ? 5 : 3;
  const cellWidth = cols === 5 ? "18%" : "30%";

  const narrow = width < 640;
  const nextLevel = levels.find((l) => l.unlocked && l.bestStars === 0)?.level;
  const focus = levels.find((l) => l.level === nextLevel) ?? levels.find((l) => l.unlocked) ?? levels[0];
  const maxStars = levels.length * 3;

  // split the 50 levels into groups of 10
  const groups: LevelInfo[][] = [];
  for (let i = 0; i < levels.length; i += PER_GROUP) groups.push(levels.slice(i, i + PER_GROUP));

  // scroll once to the group that holds the level you should play next
  useEffect(() => {
    if (loading || didScroll.current || !levels.length) return;
    const target = nextLevel ?? 1;
    const g = Math.floor((target - 1) / PER_GROUP);
    if (g === 0) {
      didScroll.current = true;
      return;
    }
    didScroll.current = true;
    const t = setTimeout(() => {
      // 70 ~ card padding + "Level Map" header height
      const y = cardY.current + 70 + (groupY.current[g] ?? 0);
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
    }, 700);
    return () => clearTimeout(t);
  }, [loading, levels, nextLevel]);

  const heroText = focus
    ? `Level ${focus.level}: ${focus.colors} pins, ${focus.slots} places and ${countCodes(
        focus.colors,
        focus.slots
      ).toLocaleString()} possible codes. Crack them all and collect the stars!`
    : "Crack the code and collect the stars!";

  return (
    <LinearGradient colors={c.bgGradient} style={styles.root} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {/* Header */}
      <FadeInUp distance={-14} duration={350}>
        <View style={[styles.header, narrow && { paddingRight: 160 }]}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            scaleTo={0.88}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={20} color={c.text} />
          </PressableScale>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Select Level</Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              Pick a level and start cracking the code!
            </Text>
          </View>
        </View>
      </FadeInUp>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <FadeInUp delay={100}>
          <LinearGradient
            colors={darkMode ? ["#2A1B6B", "#1B1F6E", "#0F1550"] : ["#7C5CFF", "#6D4AFF", "#4F46E5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.heroBadge}>
                <Ionicons name="trophy" size={12} color="#FFFFFF" />
                <Text style={styles.heroBadgeText}>Challenge Yourself</Text>
              </View>
              <Text style={styles.heroTitle}>
                SELECT <Text style={{ color: "#C4B5FD" }}>LEVEL</Text>
              </Text>
              <Text style={styles.heroSub}>{heroText}</Text>
            </View>
            <Float y={6}>
              <LinearGradient colors={["#B9A4FF", "#6D4AFF"]} style={styles.lockBody}>
                <Ionicons name="lock-closed" size={30} color="#FFFFFF" />
              </LinearGradient>
            </Float>
          </LinearGradient>
        </FadeInUp>

        {/* Level Map */}
        <View onLayout={(e) => (cardY.current = e.nativeEvent.layout.y)}>
          <FadeInUp delay={250}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Level Map</Text>
                <View style={styles.starsChip}>
                  <Ionicons name="star" size={14} color={YELLOW} />
                  <Text style={styles.starsChipText}>
                    {totalStars}
                    {maxStars > 0 ? ` / ${maxStars}` : ""}
                  </Text>
                </View>
              </View>

              {allCompleted ? (
                <View style={styles.allDoneBanner}>
                  <Ionicons name="ribbon" size={18} color={YELLOW} />
                  <Text style={styles.allDoneText}>All levels cracked! Every level is open to replay.</Text>
                </View>
              ) : null}

              {loading ? (
                <ActivityIndicator color={PURPLE} style={{ marginVertical: 40 }} />
              ) : error ? (
                <View style={styles.errorBox}>
                  <Ionicons name="cloud-offline-outline" size={28} color={RED} />
                  <Text style={styles.errorText}>{error}</Text>
                  <PressableScale onPress={load} style={styles.retryButton}>
                    <Ionicons name="refresh" size={16} color="#FFFFFF" />
                    <Text style={styles.retryText}>Try again</Text>
                  </PressableScale>
                </View>
              ) : (
                <View style={{ gap: 22 }}>
                  {groups.map((group, g) => {
                    const first = group[0];
                    const last = group[group.length - 1];
                    return (
                      <View
                        key={g}
                        onLayout={(e) => {
                          groupY.current[g] = e.nativeEvent.layout.y;
                        }}
                      >
                        <View style={styles.groupHeader}>
                          <Text style={styles.groupTitle}>
                            Levels {first.level}–{last.level}
                          </Text>
                          <View style={styles.groupChip}>
                            <Text style={styles.groupChipText}>
                              {first.colors} pins · {first.slots} places
                            </Text>
                          </View>
                        </View>
                        <View style={styles.grid}>
                          {group.map((lv, idx) => (
                            <FadeInUp key={lv.level} delay={idx * 50} duration={400} style={{ width: cellWidth }}>
                              <LevelCell
                                lv={lv}
                                isNext={lv.level === nextLevel}
                                onSelect={onSelect}
                                styles={styles}
                                subtext={c.subtext}
                                baseDelay={idx * 50}
                              />
                            </FadeInUp>
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              <Text style={styles.footNote}>
                Play the levels in order. Each win unlocks the next one. Finish all {levels.length || 50} levels to
                replay any level. Fewer guesses = more stars.
              </Text>
            </View>
          </FadeInUp>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default LevelMapScreen;

const makeStyles = (c: ReturnType<typeof getPalette>) =>
  StyleSheet.create({
    root: { flex: 1 },

    header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 10 },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.chip,
      borderWidth: 1,
      borderColor: c.cardBorder,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: { fontSize: 18, fontWeight: "800", color: c.text },
    headerSub: { fontSize: 12.5, color: c.subtext, marginTop: 2 },

    scrollContent: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 32, gap: 16 },

    hero: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: "rgba(160,150,255,0.25)",
      overflow: "hidden",
    },
    heroBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 5,
      backgroundColor: "rgba(255,255,255,0.16)",
      paddingVertical: 5,
      paddingHorizontal: 11,
      borderRadius: 14,
      marginBottom: 10,
    },
    heroBadgeText: { color: "#FFFFFF", fontSize: 11.5, fontWeight: "700" },
    heroTitle: { fontSize: 30, fontWeight: "900", color: "#FFFFFF", letterSpacing: 0.5 },
    heroSub: { marginTop: 6, fontSize: 13, lineHeight: 19, color: "rgba(255,255,255,0.8)" },
    lockBody: {
      width: 68,
      height: 68,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      transform: [{ rotate: "6deg" }],
      shadowColor: "#6D4AFF",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 14,
      elevation: 10,
    },

    card: {
      backgroundColor: c.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.cardBorder,
      padding: 16,
    },
    cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
    cardTitle: { fontSize: 20, fontWeight: "900", color: c.text },
    starsChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: c.chip,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
    },
    starsChipText: { fontSize: 14, fontWeight: "800", color: c.text },

    allDoneBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: "rgba(245,197,24,0.14)",
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginBottom: 16,
    },
    allDoneText: { flex: 1, color: YELLOW, fontSize: 12.5, fontWeight: "700" },

    groupHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    groupTitle: { fontSize: 15, fontWeight: "800", color: c.text },
    groupChip: {
      backgroundColor: c.chip,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
    },
    groupChipText: { fontSize: 11.5, fontWeight: "700", color: c.subtext },

    grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: GAP },
    cell: {
      alignItems: "center",
      gap: 6,
      paddingVertical: 14,
      paddingHorizontal: 4,
      borderRadius: 18,
      backgroundColor: c.cell,
      borderWidth: 1,
      borderColor: c.cellBorder,
    },
    cellNext: {
      borderColor: PURPLE,
      borderWidth: 2,
      shadowColor: PURPLE,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
    },
    cellNumber: { fontSize: 28, fontWeight: "900", color: c.text },
    cellMeta: { fontSize: 11, color: c.subtext, textAlign: "center" },

    footNote: { marginTop: 18, fontSize: 12.5, lineHeight: 18, color: c.subtext, textAlign: "center" },

    errorBox: { alignItems: "center", gap: 10, paddingVertical: 24 },
    errorText: { color: RED, fontSize: 13, textAlign: "center" },
    retryButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: PURPLE,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 14,
      marginTop: 4,
    },
    retryText: { color: "#FFFFFF", fontWeight: "800" },
  });
