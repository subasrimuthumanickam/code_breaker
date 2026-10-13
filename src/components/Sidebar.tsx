import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export type NavKey = "home" | "levels" | "settings" | "help";

interface NavItem {
  key: NavKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}

const ITEMS: NavItem[] = [
  { key: "home", label: "Home", icon: "home-outline", iconActive: "home" },
  { key: "levels", label: "Levels", icon: "lock-closed-outline", iconActive: "lock-closed" },
  { key: "settings", label: "Settings", icon: "settings-outline", iconActive: "settings" },
  { key: "help", label: "Help", icon: "help-circle-outline", iconActive: "help-circle" },
];

interface ShellProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  children: React.ReactNode;
}

const WIDE_BREAKPOINT = 768;

/**
 * Wraps a screen with:
 *  - a left sidebar on wide screens (web / tablet)
 *  - a bottom tab bar on phones
 */
const CodeBreakerShell: React.FC<ShellProps> = ({ active, onNavigate, children }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;

  if (isWide) {
    return (
      <View style={styles.rowRoot}>
        <View style={styles.sidebar}>
          {/* brand */}
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Ionicons name="shield-checkmark" size={26} color="#A78BFA" />
            </View>
            <View>
              <Text style={styles.brandTitle}>
                Code <Text style={{ color: "#A855F7" }}>Breaker</Text>
              </Text>
              <Text style={styles.brandTag}>Think · Guess · Unlock</Text>
            </View>
          </View>

          {/* nav */}
          <View style={styles.navList}>
            {ITEMS.map((item) => {
              const isActive = item.key === active;
              const content = (
                <>
                  <Ionicons
                    name={isActive ? item.iconActive : item.icon}
                    size={20}
                    color={isActive ? "#FFFFFF" : "#8C95D6"}
                  />
                  <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
                </>
              );
              return (
                <TouchableOpacity key={item.key} activeOpacity={0.8} onPress={() => onNavigate(item.key)}>
                  {isActive ? (
                    <LinearGradient
                      colors={["#4F35E8", "#3B40B4"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.navItem}
                    >
                      {content}
                    </LinearGradient>
                  ) : (
                    <View style={styles.navItem}>{content}</View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ flex: 1 }} />

          {/* tagline card */}
          <View style={styles.taglineCard}>
            <Ionicons name="lock-closed" size={22} color="#8B5CF6" />
            <Text style={styles.taglineText}>Small digits...</Text>
            <Text style={styles.taglineText}>Big secrets...</Text>
            <Text style={styles.taglineText}>Can you crack it?</Text>
          </View>
        </View>

        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  // ---------- phone: bottom tabs ----------
  return (
    <View style={styles.colRoot}>
      <View style={styles.content}>{children}</View>
      <View style={styles.bottomBar}>
        {ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.tab}
              activeOpacity={0.8}
              onPress={() => onNavigate(item.key)}
            >
              <Ionicons
                name={isActive ? item.iconActive : item.icon}
                size={22}
                color={isActive ? "#A855F7" : "#6B74B8"}
              />
              <Text style={[styles.tabLabel, { color: isActive ? "#A855F7" : "#6B74B8" }]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CodeBreakerShell;

const styles = StyleSheet.create({
  rowRoot: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#050A24",
  },
  colRoot: {
    flex: 1,
    backgroundColor: "#050A24",
  },
  content: {
    flex: 1,
  },

  /* ===== sidebar ===== */
  sidebar: {
    width: 220,
    backgroundColor: "#070C2E",
    borderRightWidth: 1,
    borderRightColor: "rgba(120,130,255,0.18)",
    paddingHorizontal: 14,
    paddingTop: 20,
    paddingBottom: 20,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(139,92,246,0.18)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  brandTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  brandTag: {
    color: "#8C95D6",
    fontSize: 10.5,
    marginTop: 2,
  },
  navList: {
    gap: 6,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  navLabel: {
    color: "#8C95D6",
    fontSize: 15,
    fontWeight: "600",
  },
  navLabelActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  taglineCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(59,64,180,0.18)",
    borderWidth: 1,
    borderColor: "rgba(120,130,255,0.22)",
    gap: 2,
  },
  taglineText: {
    color: "#C4C9F5",
    fontSize: 12,
    lineHeight: 17,
  },

  /* ===== bottom tab bar (phone) ===== */
  bottomBar: {
    flexDirection: "row",
    backgroundColor: "#070C2E",
    borderTopWidth: 1,
    borderTopColor: "rgba(120,130,255,0.18)",
    paddingTop: 8,
    paddingBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: "600",
  },
});
