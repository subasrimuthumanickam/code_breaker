import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { WsProfile } from "../api/wsProfileApi";

export type WsNavKey = "home" | "rankings" | "profile";

const C = {
  bg: "#FFF8F1",
  side: "#FFFCF8",
  card: "#FFFFFF",
  border: "#F1E7DC",
  text: "#141B34",
  sub: "#6B7280",
  navLabel: "#4B5568",
  indigo: "#4F46E5",
  indigoSoft: "#EEF0FF",
  coral: "#FF6B57",
  yellow: "#F2B640",
  navy: "#1A2238",
};

interface NavItem {
  key: WsNavKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}

const ITEMS: NavItem[] = [
  { key: "home", label: "Home", icon: "home-outline", iconActive: "home" },
  { key: "rankings", label: "Rankings", icon: "trophy-outline", iconActive: "trophy" },
  { key: "profile", label: "Profile", icon: "person-outline", iconActive: "person" },
];

interface Props {
  active: WsNavKey;
  onNavigate: (key: WsNavKey) => void;
  profile: WsProfile | null; // comes from the backend
  children: React.ReactNode;
}

const WIDE = 900;

/** Text for the dark card at the bottom of the sidebar — built from real backend data. */
const profileCardText = (profile: WsProfile | null) => {
  if (!profile) return { title: "Word Scramble", sub: "Loading your profile…" };
  const parts: string[] = [];
  if (profile.rank != null) parts.push(`Rank #${profile.rank}`);
  if (typeof profile.wins === "number") parts.push(`${profile.wins} ${profile.wins === 1 ? "win" : "wins"}`);
  return {
    title: `Hi, ${profile.name}!`,
    sub: parts.length ? parts.join(" • ") : "Play a game to get ranked",
  };
};

const WordScrambleShell: React.FC<Props> = ({ active, onNavigate, profile, children }) => {
  const { width } = useWindowDimensions();
  const wide = width >= WIDE;
  const card = profileCardText(profile);

  /* ================= PHONE: bottom tab bar ================= */
  if (!wide) {
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
                <View style={[styles.tabIconWrap, isActive && styles.tabIconWrapActive]}>
                  <Ionicons
                    name={isActive ? item.iconActive : item.icon}
                    size={20}
                    color={isActive ? C.indigo : "#8A93A6"}
                  />
                </View>
                <Text style={[styles.tabLabel, { color: isActive ? C.indigo : "#8A93A6" }]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  /* ================= WIDE: sidebar ================= */
  return (
    <View style={styles.rowRoot}>
      <View style={styles.sidebar}>
        {/* brand */}
        <View style={styles.brandRow}>
          <View style={styles.logoTile}>
            <Text style={styles.logoText}>
              <Text style={{ color: C.yellow }}>W</Text>
              <Text style={{ color: C.coral }}>S</Text>
            </Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>
              Word <Text style={{ color: C.coral }}>Scramble</Text>
            </Text>
            <Text style={styles.brandTag}>Think fast. Play smart.</Text>
          </View>
        </View>

        {/* nav */}
        <View style={styles.navList}>
          {ITEMS.map((item) => {
            const isActive = item.key === active;
            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.8}
                onPress={() => onNavigate(item.key)}
                style={[styles.navItem, isActive && styles.navItemActive]}
              >
                {isActive ? (
                  <View style={styles.navIconActive}>
                    <Ionicons name={item.iconActive} size={19} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={styles.navIcon}>
                    <Ionicons name={item.icon} size={21} color="#6B7488" />
                  </View>
                )}
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ flex: 1 }} />

        {/* profile card — real data */}
        <View style={styles.promoCard}>
          <View style={styles.promoIcon}>
            <Ionicons name="sparkles" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.promoTitle} numberOfLines={1}>
            {card.title}
          </Text>
          <Text style={styles.promoSub}>{card.sub}</Text>
        </View>
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default WordScrambleShell;

const styles = StyleSheet.create({
  rowRoot: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: C.bg,
  },
  colRoot: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    flex: 1,
    backgroundColor: C.bg,
  },

  /* ---- sidebar ---- */
  sidebar: {
    width: 270,
    backgroundColor: C.side,
    borderRightWidth: 1,
    borderRightColor: C.border,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 20,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 34,
  },
  logoTile: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: C.navy,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-4deg" }],
  },
  logoText: {
    fontSize: 22,
    fontWeight: "900",
  },
  brandTitle: {
    color: C.text,
    fontSize: 19,
    fontWeight: "900",
  },
  brandTag: {
    color: C.sub,
    fontSize: 12,
    marginTop: 2,
  },
  navList: {
    gap: 8,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  navItemActive: {
    backgroundColor: "#ECE9FF",
  },
  navIcon: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  navIconActive: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.indigo,
    justifyContent: "center",
    alignItems: "center",
  },
  navLabel: {
    color: C.navLabel,
    fontSize: 16,
    fontWeight: "700",
  },
  navLabelActive: {
    color: C.indigo,
    fontWeight: "800",
  },
  promoCard: {
    backgroundColor: C.navy,
    borderRadius: 22,
    padding: 18,
    gap: 4,
  },
  promoIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: C.coral,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  promoTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  promoSub: {
    color: "#B7BED2",
    fontSize: 12.5,
    lineHeight: 18,
  },

  /* ---- bottom bar (phone) ---- */
  bottomBar: {
    flexDirection: "row",
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 8,
    paddingBottom: 14,
    shadowColor: "#B8A48C",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  tabIconWrap: {
    width: 52,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  tabIconWrapActive: {
    backgroundColor: C.indigoSoft,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
});
