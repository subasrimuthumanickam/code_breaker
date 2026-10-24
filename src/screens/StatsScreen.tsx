
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getTheme } from "../theme/theme";

export interface StatsData {
  highScore: number;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  avgAttempts: number;
}

interface StatsScreenProps {
  stats: StatsData;
  darkMode: boolean;
  onBack: () => void;
}

const StatsScreen: React.FC<StatsScreenProps> = ({ stats, darkMode, onBack }) => {
  const theme = getTheme(darkMode);

  // Defensive fallbacks — backend can return null/undefined for these
  // (e.g. AVG() in MySQL returns NULL when no games have been played yet)
  const highScore = stats?.highScore ?? 0;
  const gamesPlayed = stats?.gamesPlayed ?? 0;
  const gamesWon = stats?.gamesWon ?? 0;
  const currentStreak = stats?.currentStreak ?? 0;
  const bestStreak = stats?.bestStreak ?? 0;
  const avgAttempts = Number(stats?.avgAttempts) || 0;

  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

  const StatRow: React.FC<{ icon: any; iconSet?: "ion" | "mci"; label: string; value: string | number }> = ({
    icon,
    iconSet = "ion",
    label,
    value,
  }) => (
    <View style={[styles.statRow, { borderBottomColor: theme.border }]}>
      <View style={styles.statIconWrap}>
        {iconSet === "ion" ? (
          <Ionicons name={icon} size={18} color={theme.accent} />
        ) : (
          <MaterialCommunityIcons name={icon} size={18} color={theme.accent} />
        )}
      </View>
      <Text style={[styles.statLabel, { color: darkMode ? "#D1D5DB" : "#374151" }]}>{label}</Text>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
    </View>
  );

  return (
    <LinearGradient colors={theme.gradient} style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.cardBg }]} onPress={onBack}>
          <Ionicons name="chevron-back" size={22} color={theme.subtext} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: theme.text }]}>Your Stats</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: theme.cardBg }]}>
          <Ionicons name="trophy" size={26} color="#F5C518" />
          <Text style={[styles.heroValue, { color: theme.text }]}>{highScore}</Text>
          <Text style={[styles.heroLabel, { color: theme.subtext }]}>High Score</Text>
        </View>

        <View style={styles.grid}>
          <View style={[styles.gridCard, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.gridValue, { color: theme.text }]}>{gamesPlayed}</Text>
            <Text style={[styles.gridLabel, { color: theme.subtext }]}>Games Played</Text>
          </View>
          <View style={[styles.gridCard, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.gridValue, { color: theme.text }]}>{winRate}%</Text>
            <Text style={[styles.gridLabel, { color: theme.subtext }]}>Win Rate</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
          <StatRow icon="checkmark-circle" label="Games Won" value={gamesWon} />
          <StatRow icon="flame" label="Current Streak" value={currentStreak} />
          <StatRow icon="ribbon" label="Best Streak" value={bestStreak} />
          <StatRow
            icon="brain"
            iconSet="mci"
            label="Avg. Attempts"
            value={avgAttempts.toFixed(1)}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 32 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  topTitle: { fontSize: 17, fontWeight: "700" },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  content: { paddingTop: 24, paddingBottom: 24 },
  heroCard: {
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 16,
  },
  heroValue: { fontSize: 32, fontWeight: "800", marginTop: 8 },
  heroLabel: { fontSize: 13, marginTop: 4 },
  grid: { flexDirection: "row", gap: 12, marginBottom: 16 },
  gridCard: {
    flex: 1,
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 18,
  },
  gridValue: { fontSize: 22, fontWeight: "800" },
  gridLabel: { fontSize: 12, marginTop: 4 },
  card: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statIconWrap: { width: 28 },
  statLabel: { flex: 1, fontSize: 14 },
  statValue: { fontSize: 15, fontWeight: "700" },
});