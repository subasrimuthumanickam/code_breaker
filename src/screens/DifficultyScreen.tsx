
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Difficulty, DIFFICULTY_CONFIG } from "../types/game";
import { getTheme } from "../theme/theme";
import { API_BASE_URL } from "../api/api";
import { getDeviceId } from "../utils/deviceId";

interface DifficultyScreenProps {
  onSelect: (difficulty: Difficulty) => void;
  onBack: () => void;
  darkMode: boolean;
  playerName?: string;
}

const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard", "extreme"];

type ProgressEntry = {
  roundsCompleted: number;
  roundsTotal: number;
  completed: boolean;
  unlocked: boolean;
};

type ProgressMap = Record<Difficulty, ProgressEntry>;

const FALLBACK_PROGRESS: ProgressMap = DIFFICULTY_ORDER.reduce((acc, id, i) => {
  acc[id] = {
    roundsCompleted: 0,
    roundsTotal: DIFFICULTY_CONFIG[id].rounds,
    completed: false,
    unlocked: i === 0,
  };
  return acc;
}, {} as ProgressMap);

/* per-level look: circle color + icon shown when the level is unlocked */
const LEVEL_STYLE: Record<
  Difficulty,
  { circle: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  easy: { circle: "#16A34A", icon: "leaf" },
  medium: { circle: "#B7791F", icon: "flame" },
  hard: { circle: "#E5484D", icon: "skull" },
  extreme: { circle: "#7C3AED", icon: "rocket" },
};


const LockArt: React.FC = () => (
  <View style={art.wrap}>
    <View style={art.glow} />
    <View style={art.plate} />

    <Ionicons name="sparkles" size={12} color="#A78BFA" style={{ position: "absolute", left: 6, top: 60 }} />
    <Ionicons name="sparkles" size={14} color="#A78BFA" style={{ position: "absolute", right: 2, top: 70 }} />

    <View style={[art.tile, { left: 34, top: 12, transform: [{ rotate: "-8deg" }] }]}>
      <Text style={art.tileText}>7</Text>
    </View>
    <View style={[art.tile, { right: 30, top: 8, transform: [{ rotate: "10deg" }] }]}>
      <Text style={art.tileText}>3</Text>
    </View>
    <View style={[art.tile, { left: 20, bottom: 14, transform: [{ rotate: "-10deg" }] }]}>
      <Text style={art.tileText}>9</Text>
    </View>
    <View style={[art.tile, { right: 18, bottom: 18, transform: [{ rotate: "12deg" }] }]}>
      <Text style={art.tileText}>5</Text>
    </View>

    <View style={art.lockGroup}>
      <View style={art.shackle} />
      <LinearGradient colors={["#D8CCFF", "#8B5CF6"]} style={art.body}>
        <View style={art.keyCircle} />
        <View style={art.keyStem} />
      </LinearGradient>
    </View>
  </View>
);

const DifficultyScreen: React.FC<DifficultyScreenProps> = ({
  onSelect,
  onBack,
  darkMode,
  playerName = "Player",
}) => {
  const theme = getTheme(darkMode);
  const { width } = useWindowDimensions();
  const wide = width >= 900;

  const [progress, setProgress] = useState<ProgressMap>(FALLBACK_PROGRESS);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const deviceId = await getDeviceId();
        const res = await fetch(`${API_BASE_URL}/progress/${deviceId}`);
        if (!res.ok) throw new Error(`Failed to load progress (${res.status})`);
        const data = await res.json();
        if (!cancelled) setProgress(data);
      } catch (err) {
        console.warn("Failed to load progress, defaulting to easy-only:", err);
        if (!cancelled) setProgress(FALLBACK_PROGRESS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelect = (id: Difficulty) => {
    if (selecting) return;
    if (!progress[id]?.unlocked) return;
    setSelecting(true);
    onSelect(id);
  };

  if (loading) {
    return (
      <LinearGradient colors={theme.gradient} style={[styles.container, styles.centerFill]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={theme.gradient} style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={[styles.header, { paddingTop: wide ? 14 : 44 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Select Level</Text>
            <Text style={styles.headerSub}>Choose a level and start cracking the code!</Text>
          </View>
        </View>

        <View style={styles.playerPill}>
          <View style={styles.playerAvatar}>
            <Ionicons name="person" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.playerName}>{playerName}</Text>
          <Ionicons name="chevron-down" size={14} color="#C4C9F5" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: wide ? 28 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HERO ================= */}
        <LinearGradient
          colors={["#1A1470", "#2A1B95", "#151055"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroSwoosh} pointerEvents="none" />

          <View style={{ flex: 1, zIndex: 2 }}>
            <View style={styles.badgePill}>
              <Ionicons name="trophy" size={14} color="#FFFFFF" />
              <Text style={styles.badgeText}>Challenge Yourself</Text>
            </View>

            <Text style={[styles.heroTitle, { fontSize: wide ? 38 : 28 }]}>
              SELECT <Text style={{ color: "#A855F7" }}>LEVEL</Text>
            </Text>

            <Text style={styles.heroDesc}>
              Different difficulty levels, bigger challenges, more rewards!
            </Text>
          </View>

          {wide && (
            <View style={styles.heroArt}>
              <LockArt />
            </View>
          )}
        </LinearGradient>

        {/* ================= LEVEL CARDS ================= */}
        <View style={styles.list}>
          {DIFFICULTY_ORDER.map((id) => {
            const opt = DIFFICULTY_CONFIG[id];
            const p = progress[id];
            const locked = !p.unlocked;
            const look = LEVEL_STYLE[id];
            const idx = DIFFICULTY_ORDER.indexOf(id);
            const prevLabel = idx > 0 ? DIFFICULTY_CONFIG[DIFFICULTY_ORDER[idx - 1]].label : null;

            const content = (
              <>
                <View style={[styles.levelCircle, { backgroundColor: look.circle }]}>
                  <Ionicons name={locked ? "lock-closed" : look.icon} size={24} color="#FFFFFF" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.levelLabel, { color: locked ? "#8C95D6" : "#FFFFFF" }]}>
                    {opt.label}
                  </Text>
                  <Text style={[styles.levelDetail, { color: locked ? "#7F88C9" : "#D7DBFF" }]}>
                    {locked
                      ? `Complete ${prevLabel} to unlock`
                      : `${opt.codeLength} Digit • ${opt.maxAttempts} Attempts • ${p.roundsCompleted}/${p.roundsTotal} Rounds • ${opt.timeLimitSec}s`}
                  </Text>
                </View>

                {locked ? (
                  <View style={[styles.trailCircle, { backgroundColor: "rgba(120,130,255,0.15)" }]}>
                    <Ionicons name="lock-closed" size={16} color="#8C95D6" />
                  </View>
                ) : (
                  <View style={[styles.trailCircle, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
                    <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                  </View>
                )}
              </>
            );

            return (
              <TouchableOpacity
                key={id}
                onPress={() => handleSelect(id)}
                activeOpacity={locked ? 1 : 0.85}
                disabled={locked || selecting}
              >
                {locked ? (
                  <View style={[styles.levelCard, styles.levelCardLocked]}>{content}</View>
                ) : (
                  <LinearGradient
                    colors={["#0C3A44", "#0B2A4E"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.levelCard, { borderColor: "#14B8A6" }]}
                  >
                    {content}
                  </LinearGradient>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default DifficultyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerFill: {
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---- header ---- */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
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
    backgroundColor: "rgba(59,64,180,0.3)",
    borderWidth: 1,
    borderColor: "rgba(120,130,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  headerSub: {
    color: "#AEB4DA",
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
    backgroundColor: "rgba(59,64,180,0.28)",
    borderWidth: 1,
    borderColor: "rgba(120,130,255,0.2)",
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
    fontWeight: "700",
  },

  scrollContent: {
    paddingTop: 12,
    paddingBottom: 40,
    gap: 18,
  },

  /* ---- hero ---- */
  hero: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(124,92,255,0.3)",
    overflow: "hidden",
    paddingVertical: 22,
    paddingHorizontal: 28,
    minHeight: 190,
  },
  heroSwoosh: {
    position: "absolute",
    right: -100,
    top: -120,
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: "rgba(109,74,255,0.2)",
  },
  heroArt: {
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(109,74,255,0.6)",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    marginTop: 12,
    letterSpacing: 0.5,
  },
  heroDesc: {
    color: "#C9CDF5",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    marginTop: 8,
    maxWidth: 460,
  },

  /* ---- level cards ---- */
  list: {
    gap: 14,
  },
  levelCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
  },
  levelCardLocked: {
    backgroundColor: "rgba(30,35,100,0.32)",
    borderColor: "rgba(120,130,255,0.2)",
  },
  levelCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
  },
  levelLabel: {
    fontSize: 20,
    fontWeight: "800",
  },
  levelDetail: {
    fontSize: 14,
    marginTop: 4,
  },
  trailCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
});

/* ===== lock illustration ===== */
const art = StyleSheet.create({
  wrap: {
    width: 300,
    height: 170,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(139,92,246,0.2)",
  },
  plate: {
    position: "absolute",
    width: 140,
    height: 130,
    borderRadius: 30,
    backgroundColor: "rgba(40,60,170,0.35)",
    borderWidth: 1,
    borderColor: "rgba(120,140,255,0.3)",
  },
  tile: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#5B7CFF",
    backgroundColor: "rgba(20,30,110,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  tileText: {
    color: "#DDE6FF",
    fontSize: 26,
    fontWeight: "800",
  },
  lockGroup: {
    position: "absolute",
    left: 100,
    top: 18,
    width: 100,
    alignItems: "center",
    transform: [{ rotate: "6deg" }],
  },
  shackle: {
    width: 56,
    height: 58,
    borderWidth: 12,
    borderBottomWidth: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderColor: "#A5B4FC",
  },
  body: {
    width: 100,
    height: 86,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -2,
  },
  keyCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#3B1FA3",
  },
  keyStem: {
    width: 7,
    height: 18,
    borderRadius: 3,
    backgroundColor: "#3B1FA3",
    marginTop: -2,
  },
});
