
import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  Animated,
  Easing,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

/* =========================================================
   TYPES
========================================================= */

type GameId =
  | "word-cipher"
  | "code-breaker"
  | "memory-grid"
  | "pattern-hacker"
  | "word-scramble"
  | "brain-twist";

type GameItem = {
  id: GameId;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  accent: string;
  ready: boolean;
  difficulty: string;
  players: string;
};

type Props = {
  onSelectGame: (id: GameId) => void;
  onOpenProfile?: () => void;
  bestScore?: number;
  streak?: number;
};

const WIDE_BREAKPOINT = 900;

/* =========================================================
   THEME
========================================================= */

const COLORS = {
  cream: "#FFF8E8",
  creamLight: "#FFFDF6",
  creamDark: "#F8EBCB",

  navy: "#202A63",
  navyLight: "#33418A",

  yellow: "#FFBF24",
  yellowDark: "#F3A900",

  blue: "#48B8F5",
  blueDark: "#2299DE",

  pink: "#F58BB8",
  pinkLight: "#FFE1ED",

  green: "#36C99B",
  greenLight: "#DDF8ED",

  orange: "#FF8E2B",

  purple: "#7167E8",
  purpleLight: "#EAE8FF",

  text: "#202A63",
  textLight: "#717897",
  muted: "#A0A4B9",

  white: "#FFFFFF",
};

/* =========================================================
   STYLES (declared BEFORE GAMES)
========================================================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  scroll: { flex: 1, backgroundColor: COLORS.cream },
  scrollContent: { alignItems: "center", paddingBottom: 30 },
  content: { width: "100%" },

  /* DECORATIONS */
  floatingCircle: { position: "absolute", borderRadius: 999, opacity: 0.55 },
  floatingPuzzle: { position: "absolute", opacity: 0.85 },
  star: { position: "absolute" },

  /* HEADER */
  headerWrap: {
    width: "100%",
    backgroundColor: COLORS.creamLight,
    borderBottomWidth: 1,
    borderBottomColor: "#F1E6C9",
    zIndex: 10,
  },
  header: {
    width: "100%",
    alignSelf: "center",
    minHeight: 76,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: { flexDirection: "row", alignItems: "center" },
  logoAnimated: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: COLORS.yellow,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    shadowColor: COLORS.yellowDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
  brand: { color: COLORS.navy, fontSize: 19, fontWeight: "900", letterSpacing: 0.3 },
  brandAccent: { color: COLORS.blueDark },
  brandSub: { marginTop: 2, color: COLORS.pink, fontSize: 8, letterSpacing: 1.7, fontWeight: "900" },
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#E9DFC6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 3,
  },
  navLinks: { flexDirection: "row", alignItems: "center", gap: 7 },
  navLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 10,
    paddingHorizontal: 17,
    borderRadius: 14,
  },
  navLinkActive: { backgroundColor: COLORS.yellow },
  navLinkText: { color: COLORS.textLight, fontSize: 14, fontWeight: "700" },
  navLinkTextActive: { color: COLORS.navy, fontWeight: "900" },

  /* HERO */
  hero: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: COLORS.cream,
    paddingTop: 28,
    paddingBottom: 28,
  },
  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.pink,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 22,
    shadowColor: COLORS.pink,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  heroBadgeText: { color: COLORS.white, fontSize: 9, fontWeight: "900", letterSpacing: 0.8 },
  heroTitle: {
    color: COLORS.navy,
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "900",
    marginTop: 13,
    letterSpacing: -0.5,
  },
  heroTitleAccent: { color: COLORS.blueDark },
  heroDescription: {
    color: COLORS.textLight,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
    maxWidth: 550,
  },
  heroUnderline: {
    width: 82,
    height: 5,
    borderRadius: 4,
    backgroundColor: COLORS.yellow,
    marginTop: 13,
  },

  /* SECTION */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { color: COLORS.navy, fontSize: 18, fontWeight: "900" },
  gameCount: { color: COLORS.muted, fontSize: 9, fontWeight: "800", letterSpacing: 1 },

  /* GAMES */
  gameList: { gap: 11 },
  gameListWide: { flexDirection: "row", flexWrap: "wrap", gap: 15 },
  gameCard: {
    minHeight: 110,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#EEE6D4",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
  },
  gameCardWide: {
    flexGrow: 1,
    flexBasis: "46%",
    minHeight: 126,
    padding: 18,
    borderRadius: 20,
  },
  lockedCard: { opacity: 0.63 },
  gameIcon: {
    width: 51,
    height: 51,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  gameContent: { flex: 1 },
  gameTitleRow: { flexDirection: "row", alignItems: "center" },
  gameTitle: { color: COLORS.navy, fontSize: 15, fontWeight: "900" },
  statusDot: { width: 7, height: 7, borderRadius: 5, marginLeft: 7 },
  comingSoonBadge: {
    marginLeft: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#F2EFE5",
  },
  comingSoonText: { color: COLORS.muted, fontSize: 7, fontWeight: "900", letterSpacing: 0.5 },
  gameSubtitle: { color: COLORS.textLight, fontSize: 11, marginTop: 3, fontWeight: "600" },
  gameDescription: { color: "#9A9FB1", fontSize: 9.5, lineHeight: 14, marginTop: 5 },
  metaRow: { flexDirection: "row", marginTop: 7, gap: 13 },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaText: { color: "#8E94A7", fontSize: 9, marginLeft: 4 },
  arrowButton: {
    width: 33,
    height: 33,
    borderRadius: 11,
    backgroundColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  /* PROGRESS (wide screen sidebar) */
  progressCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#EEE5D2",
    borderRadius: 21,
    padding: 18,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  progressTitle: { color: COLORS.navy, fontSize: 17, fontWeight: "900", marginBottom: 8 },
  progressRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  progressDivider: { borderTopWidth: 1, borderTopColor: "#F0E9D9" },
  progressIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.purpleLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  progressLabel: { flex: 1, color: COLORS.textLight, fontSize: 14, fontWeight: "600" },
  progressValue: { color: COLORS.navy, fontSize: 20, fontWeight: "900" },
  progressBtn: {
    marginTop: 8,
    height: 45,
    borderRadius: 14,
    backgroundColor: COLORS.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  progressBtnText: { color: COLORS.white, fontSize: 14, fontWeight: "900" },

  /* FOOTER */
  footerCard: {
    marginTop: 18,
    borderRadius: 17,
    padding: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#EEE5D2",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  footerIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: COLORS.pinkLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  footerText: { flex: 1 },
  footerTitle: { color: COLORS.navy, fontSize: 12, fontWeight: "900" },
  footerSubtitle: { color: COLORS.muted, fontSize: 9.5, marginTop: 3 },

  /* SIDEBAR */
  wideRow: { flexDirection: "row", alignItems: "flex-start", gap: 28 },
  sidebar: { width: 300, gap: 16 },

  /* BOTTOM NAV */
  bottomNavWrap: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#EDE4D2",
    backgroundColor: COLORS.creamLight,
  },
  bottomNav: {
    width: "100%",
    alignSelf: "center",
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 35,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  navText: { color: "#85899D", fontSize: 10, fontWeight: "700", marginTop: 4 },
  navTextActive: { color: COLORS.blueDark, fontWeight: "900" },
});

/* =========================================================
   GAMES
========================================================= */

const GAMES: GameItem[] = [
  {
    id: "code-breaker",
    title: "Code Breaker",
    subtitle: "Crack the secret code",
    description: "Use clues and logic to find the hidden number.",
    icon: <Ionicons name="lock-closed" size={25} color={COLORS.purple} />,
    iconBg: COLORS.purpleLight,
    accent: COLORS.purple,
    ready: true,
    difficulty: "Easy",
    players: "1 Player",
  },
  {
    id: "word-scramble",
    title: "Word Scramble",
    subtitle: "Unscramble the words",
    description: "Challenge your friends and solve words quickly.",
    icon: <MaterialCommunityIcons name="shuffle-variant" size={27} color={COLORS.orange} />,
    iconBg: "#FFF0D8",
    accent: COLORS.orange,
    ready: true,
    difficulty: "Medium",
    players: "Multiplayer",
  },
  {
    id: "brain-twist",
    title: "Brain Twist",
    subtitle: "Twist your mind",
    description: "Solve tricky logic puzzles and spot the liars before you run out of lives.",
    icon: <MaterialCommunityIcons name="brain" size={27} color={COLORS.pink} />,
    iconBg: COLORS.pinkLight,
    accent: COLORS.pink,
    ready: true,
    difficulty: "Medium",
    players: "1 Player",
  },
  {
    id: "memory-grid",
    title: "Memory Grid",
    subtitle: "Test your memory",
    description: "Remember positions and recall them correctly.",
    icon: <Ionicons name="grid" size={25} color={COLORS.green} />,
    iconBg: COLORS.greenLight,
    accent: COLORS.green,
    ready: false,
    difficulty: "Medium",
    players: "1 Player",
  },
  {
    id: "pattern-hacker",
    title: "Pattern Hacker",
    subtitle: "Find the missing pattern",
    description: "Observe the sequence and solve the missing part.",
    icon: <MaterialCommunityIcons name="graph-outline" size={26} color={COLORS.blueDark} />,
    iconBg: "#DFF4FF",
    accent: COLORS.blueDark,
    ready: false,
    difficulty: "Hard",
    players: "1 Player",
  },
  {
    id: "word-cipher",
    title: "Word Cipher",
    subtitle: "Decode the hidden word",
    description: "Break the encrypted word using clever clues.",
    icon: <Text style={{ color: COLORS.white, fontSize: 17, fontWeight: "900" }}>Aa</Text>,
    iconBg: COLORS.pink,
    accent: COLORS.pink,
    ready: false,
    difficulty: "Hard",
    players: "1 Player",
  },
];

/* =========================================================
   GAME CARD (own component so its hooks are valid)
========================================================= */

function GameCard({
  game,
  index,
  wide,
  onOpen,
}: {
  game: GameItem;
  index: number;
  wide: boolean;
  onOpen: (g: GameItem) => void;
}) {
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        delay: 250 + index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(cardTranslate, {
        toValue: 0,
        friction: 7,
        tension: 50,
        delay: 250 + index * 100,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pressIn = () => {
    if (!game.ready) return;
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: cardOpacity,
        transform: [{ translateY: cardTranslate }, { scale }],
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onOpen(game)}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[styles.gameCard, wide && styles.gameCardWide, !game.ready && styles.lockedCard]}
      >
        <View style={[styles.gameIcon, { backgroundColor: game.iconBg }]}>{game.icon}</View>

        <View style={styles.gameContent}>
          <View style={styles.gameTitleRow}>
            <Text style={[styles.gameTitle, wide && { fontSize: 17 }]}>{game.title}</Text>

            {game.ready ? (
              <View style={[styles.statusDot, { backgroundColor: game.accent }]} />
            ) : (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>SOON</Text>
              </View>
            )}
          </View>

          <Text style={[styles.gameSubtitle, wide && { fontSize: 13 }]}>{game.subtitle}</Text>

          <Text
            style={[styles.gameDescription, wide && { fontSize: 12, lineHeight: 17 }]}
            numberOfLines={2}
          >
            {game.description}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="flash-outline" size={13} color={COLORS.muted} />
              <Text style={styles.metaText}>{game.difficulty}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons
                name={game.players === "Multiplayer" ? "people-outline" : "person-outline"}
                size={13}
                color={COLORS.muted}
              />
              <Text style={styles.metaText}>{game.players}</Text>
            </View>
          </View>
        </View>

        {game.ready ? (
          <View style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={18} color={COLORS.navy} />
          </View>
        ) : (
          <Ionicons name="lock-closed-outline" size={17} color={COLORS.muted} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function MenuScreen({
  onSelectGame,
  onOpenProfile,
  bestScore = 0,
  streak = 0,
}: Props) {
  const { width } = useWindowDimensions();

  const wide = width >= WIDE_BREAKPOINT;
  const maxContent = wide ? 1080 : 560;

  const [activeTab, setActiveTab] = useState<"home" | "games">("home");

  const scrollRef = useRef<ScrollView>(null);
  const gamesY = useRef(0);

  /* ANIMATION VALUES */

  const pageOpacity = useRef(new Animated.Value(0)).current;
  const pageTranslate = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const badgeScale = useRef(new Animated.Value(1)).current;

  const floatingOne = useRef(new Animated.Value(0)).current;
  const floatingTwo = useRef(new Animated.Value(0)).current;
  const floatingThree = useRef(new Animated.Value(0)).current;

  const readyCount = GAMES.filter((game) => game.ready).length;

  /* START ANIMATIONS */

  useEffect(() => {
    Animated.parallel([
      Animated.timing(pageOpacity, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(pageTranslate, {
        toValue: 0,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();

    const loop = (v: Animated.Value, to: number, ms: number, ease = true) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, {
            toValue: to,
            duration: ms,
            ...(ease ? { easing: Easing.inOut(Easing.ease) } : {}),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: v === badgeScale || v === logoScale ? 1 : 0,
            duration: ms,
            ...(ease ? { easing: Easing.inOut(Easing.ease) } : {}),
            useNativeDriver: true,
          }),
        ])
      ).start();

    loop(logoScale, 1.08, 1000);
    loop(badgeScale, 1.05, 900, false);
    loop(floatingOne, -12, 1800);
    loop(floatingTwo, 14, 2100);
    loop(floatingThree, -9, 1600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* NAVIGATION */

  const goHome = () => {
    setActiveTab("home");
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const goGames = () => {
    setActiveTab("games");
    scrollRef.current?.scrollTo({ y: Math.max(0, gamesY.current - 10), animated: true });
  };

  const openGame = (game: GameItem) => {
    if (!game.ready) return;

    onSelectGame(game.id);
  };

  /* WELCOME */

  const welcome = (
    <Animated.View
      style={[
        styles.hero,
        { opacity: pageOpacity, transform: [{ translateY: pageTranslate }] },
      ]}
    >
      <Animated.View
        style={[
          styles.floatingCircle,
          {
            width: 110,
            height: 110,
            backgroundColor: COLORS.yellow,
            right: -50,
            top: 8,
            transform: [{ translateY: floatingOne }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.floatingCircle,
          {
            width: 75,
            height: 75,
            backgroundColor: COLORS.pink,
            right: 80,
            bottom: 10,
            transform: [{ translateY: floatingTwo }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.floatingCircle,
          {
            width: 48,
            height: 48,
            backgroundColor: COLORS.blue,
            left: -20,
            top: 35,
            transform: [{ translateY: floatingThree }],
          },
        ]}
      />

      <Animated.Text
        style={[
          styles.star,
          {
            color: COLORS.yellowDark,
            fontSize: 25,
            right: 28,
            top: 80,
            transform: [
              {
                rotate: floatingThree.interpolate({
                  inputRange: [-9, 0],
                  outputRange: ["-10deg", "10deg"],
                }),
              },
            ],
          },
        ]}
      >
        ✦
      </Animated.Text>

      <Animated.Text
        style={[
          styles.star,
          {
            color: COLORS.pink,
            fontSize: 20,
            right: 130,
            top: 20,
            transform: [{ translateY: floatingOne }],
          },
        ]}
      >
        ✦
      </Animated.Text>

      <Animated.View style={{ transform: [{ scale: badgeScale }] }}>
        <View style={styles.heroBadge}>
          <MaterialCommunityIcons name="brain" size={15} color={COLORS.white} />
          <Text style={styles.heroBadgeText}>LET'S PLAY</Text>
        </View>
      </Animated.View>

      <Text style={styles.heroTitle}>
        Choose your <Text style={styles.heroTitleAccent}>challenge</Text>
      </Text>

      <Text style={styles.heroDescription}>
        Train your memory, logic and problem-solving skills with fun interactive games.
      </Text>

      <View style={styles.heroUnderline} />
    </Animated.View>
  );

  /* ALL GAMES */

  const allGames = (
    <>
      <View
        style={styles.sectionHeader}
        onLayout={(event) => {
          gamesY.current = event.nativeEvent.layout.y;
        }}
      >
        <Text style={[styles.sectionTitle, wide && { fontSize: 22 }]}>All Games</Text>
        <Text style={styles.gameCount}>{GAMES.length} GAMES</Text>
      </View>

      <View style={[styles.gameList, wide && styles.gameListWide]}>
        {GAMES.map((game, i) => (
          <GameCard key={game.id} game={game} index={i} wide={wide} onOpen={openGame} />
        ))}
      </View>
    </>
  );

  /* FOOTER */

  const footerCard = (
    <View style={styles.footerCard}>
      <Animated.View
        style={{
          transform: [
            {
              rotate: floatingThree.interpolate({
                inputRange: [-9, 0],
                outputRange: ["-8deg", "8deg"],
              }),
            },
          ],
        }}
      >
        <View style={styles.footerIcon}>
          <MaterialCommunityIcons name="brain" size={22} color={COLORS.pink} />
        </View>
      </Animated.View>

      <View style={styles.footerText}>
        <Text style={styles.footerTitle}>Train your mind</Text>
        <Text style={styles.footerSubtitle}>New challenges will be added regularly.</Text>
      </View>
    </View>
  );

  /* PROGRESS (wide screen sidebar only) */

  const progressCard = (
    <View style={styles.progressCard}>
      <Text style={styles.progressTitle}>Your Progress</Text>

      <View style={styles.progressRow}>
        <View style={styles.progressIcon}>
          <Ionicons name="game-controller-outline" size={20} color={COLORS.purple} />
        </View>
        <Text style={styles.progressLabel}>Games</Text>
        <Text style={styles.progressValue}>{readyCount}</Text>
      </View>

      <View style={[styles.progressRow, styles.progressDivider]}>
        <View style={[styles.progressIcon, { backgroundColor: "#FFF0C9" }]}>
          <Ionicons name="trophy-outline" size={20} color={COLORS.yellowDark} />
        </View>
        <Text style={styles.progressLabel}>Best Score</Text>
        <Text style={styles.progressValue}>{bestScore}</Text>
      </View>

      <View style={[styles.progressRow, styles.progressDivider]}>
        <View style={[styles.progressIcon, { backgroundColor: COLORS.greenLight }]}>
          <Ionicons name="flame-outline" size={20} color={COLORS.green} />
        </View>
        <Text style={styles.progressLabel}>Streak</Text>
        <Text style={styles.progressValue}>{streak}</Text>
      </View>

      <TouchableOpacity style={styles.progressBtn} onPress={onOpenProfile} activeOpacity={0.85}>
        <Ionicons name="person-outline" size={17} color={COLORS.white} />
        <Text style={styles.progressBtnText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );

  /* MAIN */

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.creamLight} />

      {/* HEADER */}

      <View style={styles.headerWrap}>
        <View style={[styles.header, { maxWidth: maxContent }]}>
          <View style={styles.brandRow}>
            <Animated.View style={{ transform: [{ scale: logoScale }] }}>
              <View style={styles.logoAnimated}>
                <MaterialCommunityIcons name="brain" size={26} color={COLORS.white} />
              </View>
            </Animated.View>

            <View>
              <Text style={styles.brand}>
                MIND <Text style={styles.brandAccent}>GAMES</Text>
              </Text>
              <Text style={styles.brandSub}>THINK • SOLVE • PLAY</Text>
            </View>
          </View>

          {/* DESKTOP NAV */}

          {wide && (
            <View style={styles.navLinks}>
              <TouchableOpacity
                style={[styles.navLink, activeTab === "home" && styles.navLinkActive]}
                onPress={goHome}
              >
                <Ionicons
                  name={activeTab === "home" ? "home" : "home-outline"}
                  size={20}
                  color={activeTab === "home" ? COLORS.navy : COLORS.textLight}
                />
                <Text style={[styles.navLinkText, activeTab === "home" && styles.navLinkTextActive]}>
                  Home
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navLink, activeTab === "games" && styles.navLinkActive]}
                onPress={goGames}
              >
                <Ionicons
                  name={activeTab === "games" ? "game-controller" : "game-controller-outline"}
                  size={20}
                  color={activeTab === "games" ? COLORS.navy : COLORS.textLight}
                />
                <Text style={[styles.navLinkText, activeTab === "games" && styles.navLinkTextActive]}>
                  Games
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navLink} onPress={onOpenProfile}>
                <Ionicons name="person-outline" size={20} color={COLORS.textLight} />
                <Text style={styles.navLinkText}>Profile</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* PROFILE */}

          <TouchableOpacity style={styles.profileButton} onPress={onOpenProfile}>
            <Ionicons name="person-outline" size={19} color={COLORS.navy} />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.content,
            {
              maxWidth: maxContent,
              paddingHorizontal: wide ? 24 : 18,
              paddingTop: wide ? 20 : 0,
            },
          ]}
        >
          {wide ? (
            <View style={styles.wideRow}>
              <View style={{ flex: 1, minWidth: 0 }}>
                {welcome}
                {allGames}
              </View>

              <View style={styles.sidebar}>
                {progressCard}
                {footerCard}
              </View>
            </View>
          ) : (
            <>
              {welcome}
              {allGames}
              {footerCard}
            </>
          )}

          <View style={{ height: 25 }} />
        </View>
      </ScrollView>

      {/* MOBILE NAV */}

      {!wide && (
        <View style={styles.bottomNavWrap}>
          <View style={[styles.bottomNav, { maxWidth: maxContent }]}>
            <TouchableOpacity style={styles.navItem} onPress={goHome}>
              <Ionicons
                name={activeTab === "home" ? "home" : "home-outline"}
                size={22}
                color={activeTab === "home" ? COLORS.blueDark : "#85899D"}
              />
              <Text style={[styles.navText, activeTab === "home" && styles.navTextActive]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={goGames}>
              <Ionicons
                name={activeTab === "games" ? "game-controller" : "game-controller-outline"}
                size={22}
                color={activeTab === "games" ? COLORS.blueDark : "#85899D"}
              />
              <Text style={[styles.navText, activeTab === "games" && styles.navTextActive]}>Games</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={onOpenProfile}>
              <Ionicons name="person-outline" size={22} color="#85899D" />
              <Text style={styles.navText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}