
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface TopPlayer {
  rank: number;
  name: string;
  score: number;
  avatarColor: string;
}

interface WordScrambleHomeScreenProps {
  topPlayers: TopPlayer[];

  onPlayOnline: () => void;
  onViewAllPlayers: () => void;

  // no longer used on this screen (kept optional so App.tsx still compiles)
  onCreateRoom?: () => void;
  onJoinRoom?: (code: string) => void;

  onGuestPlay?: () => void;

  /**
   * Parent must pass this function.
   * Navigates from Word Scramble Home back to the Cyber Mind main menu.
   */
  onBack: () => void;

  onTabHome: () => void;
  onTabLeaderboard: () => void;
  onTabProfile: () => void;
}

/* ============================================================
   THEME  (mint paper + deep teal ink + tangerine, scrabble tiles)
============================================================ */

const T = {
  bg: "#EAF8F2",
  bgDeep: "#D6F1E7",
  ink: "#0F3D3E",
  inkSoft: "#4F7476",
  inkFaint: "#8FB0AE",
  teal: "#14A38B",
  tealDark: "#0C7F6B",
  tealPale: "#D2F2E8",
  tangerine: "#FF8A3D",
  tangerineDark: "#DB6A1C",
  tangerinePale: "#FFE8D6",
  lemon: "#FFD84D",
  tile: "#FFF6DF",
  tileEdge: "#E2CD9C",
  card: "#FFFFFF",
  line: "#CBE8DE",
  white: "#FFFFFF",
};

/* ============================================================
   SMALL ANIMATION HELPERS
============================================================ */

/** Endless idle motion: bob (up/down), pulse (scale) or sway (rotate). */
const Idle: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  kind?: "bob" | "pulse" | "sway";
  duration?: number;
  delay?: number;
  amount?: number;
}> = ({ children, style, kind = "bob", duration = 1800, delay = 0, amount = 6 }) => {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v, duration, delay]);

  let transform: any[] = [];
  if (kind === "bob") {
    transform = [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -amount] }) }];
  } else if (kind === "pulse") {
    transform = [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1 + amount / 50] }) }];
  } else {
    transform = [
      {
        rotate: v.interpolate({
          inputRange: [0, 1],
          outputRange: [`${-amount}deg`, `${amount}deg`],
        }),
      },
    ];
  }

  return <Animated.View style={[style, { transform }]}>{children}</Animated.View>;
};

/** Press feedback: squishes down then springs back. */
const PressScale: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}> = ({ children, onPress, style, accessibilityLabel }) => {
  const s = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={[{ transform: [{ scale: s }] }, style]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPressIn={() =>
          Animated.spring(s, { toValue: 0.94, friction: 8, tension: 220, useNativeDriver: true }).start()
        }
        onPressOut={() =>
          Animated.spring(s, { toValue: 1, friction: 3, tension: 140, useNativeDriver: true }).start()
        }
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

/** Bell that rings every few seconds. */
const BellRing: React.FC<{ size?: number }> = ({ size = 20 }) => {
  const r = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(3200),
        Animated.timing(r, { toValue: 1, duration: 90, useNativeDriver: true }),
        Animated.timing(r, { toValue: -1, duration: 130, useNativeDriver: true }),
        Animated.timing(r, { toValue: 1, duration: 130, useNativeDriver: true }),
        Animated.timing(r, { toValue: -1, duration: 130, useNativeDriver: true }),
        Animated.timing(r, { toValue: 0, duration: 90, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [r]);

  const rotate = r.interpolate({ inputRange: [-1, 1], outputRange: ["-16deg", "16deg"] });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Ionicons name="notifications-outline" size={size} color={T.ink} />
    </Animated.View>
  );
};

/* ============================================================
   BACKGROUND: calm, static concentric rings (no motion)
============================================================ */

const Ring: React.FC<{
  cx: number;
  cy: number;
  size: number;
  color: string;
  opacity: number;
}> = ({ cx, cy, size, color, opacity }) => (
  <View
    pointerEvents="none"
    style={{
      position: "absolute",
      left: cx - size / 2,
      top: cy - size / 2,
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: color,
      opacity,
    }}
  />
);

const RoundBackground: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* top-right */}
    <Ring cx={width * 0.92} cy={90} size={150} color={T.teal} opacity={0.2} />
    <Ring cx={width * 0.92} cy={90} size={250} color={T.teal} opacity={0.14} />
    <Ring cx={width * 0.92} cy={90} size={350} color={T.teal} opacity={0.09} />

    {/* bottom-left */}
    <Ring cx={width * 0.06} cy={height * 0.86} size={170} color={T.tangerine} opacity={0.22} />
    <Ring cx={width * 0.06} cy={height * 0.86} size={280} color={T.tangerine} opacity={0.14} />
    <Ring cx={width * 0.06} cy={height * 0.86} size={390} color={T.tangerine} opacity={0.08} />
  </View>
);

/* ============================================================
   HERO: tiles that shuffle themselves, then snap into WORD
============================================================ */

const HERO_TILES = [
  { char: "W", pts: 4, color: T.teal },
  { char: "O", pts: 1, color: T.tangerine },
  { char: "R", pts: 1, color: T.ink },
  { char: "D", pts: 2, color: T.teal },
];
// slot index each tile (W,O,R,D) sits in, per step. First = solved.
const HERO_ORDERS = [
  [0, 1, 2, 3],
  [2, 0, 3, 1],
  [1, 3, 0, 2],
  [3, 2, 1, 0],
  [2, 3, 1, 0],
];
const TILE = 56;
const TILE_GAP = 10;
const STRIDE = TILE + TILE_GAP;

const ScrambleTiles: React.FC = () => {
  const xs = useRef(HERO_TILES.map((_, i) => new Animated.Value(i * STRIDE))).current;
  const pop = useRef(new Animated.Value(0)).current;
  const hop = useRef(HERO_TILES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    let step = 0;

    const apply = (order: number[]) => {
      Animated.stagger(
        70,
        xs.map((x, i) =>
          Animated.parallel([
            Animated.spring(x, {
              toValue: order[i] * STRIDE,
              friction: 6,
              tension: 90,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(hop[i], { toValue: 1, duration: 140, useNativeDriver: true }),
              Animated.timing(hop[i], { toValue: 0, duration: 220, useNativeDriver: true }),
            ]),
          ])
        )
      ).start();
    };

    const tick = () => {
      if (!alive) return;
      step = (step + 1) % HERO_ORDERS.length;
      apply(HERO_ORDERS[step]);

      if (step === 0) {
        // solved: celebrate, then hold
        timer = setTimeout(() => {
          Animated.sequence([
            Animated.timing(pop, { toValue: 1, duration: 160, useNativeDriver: true }),
            Animated.spring(pop, { toValue: 0, friction: 3, tension: 120, useNativeDriver: true }),
          ]).start();
        }, 520);
        timer = setTimeout(tick, 3000);
      } else {
        timer = setTimeout(tick, step === 1 ? 900 : 750);
      }
    };

    timer = setTimeout(tick, 1600);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [xs, hop, pop]);

  const popScale = pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });

  return (
    <View style={styles.scrambleBox}>
      {HERO_TILES.map((t, i) => {
        const lift = hop[i].interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
        return (
          <Animated.View
            key={t.char}
            style={[
              styles.heroTile,
              { transform: [{ translateX: xs[i] }, { translateY: lift }, { scale: popScale }] },
            ]}
          >
            <Text style={[styles.heroTileChar, { color: t.color }]}>{t.char}</Text>
            <Text style={styles.heroTilePts}>{t.pts}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

/* ============================================================
   LEADERBOARD ROW (slides in)
============================================================ */

const PlayerRow: React.FC<{ player: TopPlayer; index: number; last: boolean }> = ({
  player,
  index,
  last,
}) => {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 480,
      delay: 900 + index * 130,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [v, index]);

  return (
    <Animated.View
      style={[
        styles.playerRow,
        last && styles.lastPlayerRow,
        {
          opacity: v,
          transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [46, 0] }) }],
        },
      ]}
    >
      <View
        style={[
          styles.rankCircle,
          player.rank === 1 && styles.rankFirst,
          player.rank === 2 && styles.rankSecond,
          player.rank === 3 && styles.rankThird,
        ]}
      >
        <Text style={styles.rankText}>{player.rank}</Text>
      </View>

      <View style={[styles.playerAvatar, { backgroundColor: player.avatarColor || T.teal }]}>
        <Ionicons name="person" size={17} color="#FFFFFF" />
      </View>

      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.name}</Text>
        {player.rank === 1 && <Text style={styles.topPlayerLabel}>Top player</Text>}
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreNumber}>{player.score}</Text>
        <Text style={styles.scoreLabel}>pts</Text>
      </View>
    </Animated.View>
  );
};

/* ============================================================
   MAIN SCREEN
============================================================ */

const WordScrambleHomeScreen: React.FC<WordScrambleHomeScreenProps> = ({
  topPlayers,
  onPlayOnline,
  onViewAllPlayers,
  onGuestPlay,
  onBack,
  onTabHome,
  onTabLeaderboard,
  onTabProfile,
}) => {
  const { width, height } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  // staggered entrance for the 5 content blocks
  const enters = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(
      120,
      enters.map((e) =>
        Animated.timing(e, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    ).start();

    Animated.timing(progress, {
      toValue: 0.6, // 3 / 5 rounds
      duration: 1100,
      delay: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [enters, progress]);

  const rise = (i: number) => ({
    opacity: enters[i],
    transform: [
      { translateY: enters[i].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
    ],
  });

  // Single Player -> guest nickname flow (falls back to online flow)
  const handleSinglePlayer = () => {
    if (onGuestPlay) {
      onGuestPlay();
    } else {
      onPlayOnline();
    }
  };

  // Multiplayer -> online flow
  const handleMultiplayer = () => {
    onPlayOnline();
  };

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      <RoundBackground width={width} height={height} />

      <View style={styles.root}>
        {/* ==================================================
            SIDEBAR
        ================================================== */}

        {!isMobile && (
          <View style={[styles.sidebar, isTablet && styles.sidebarTablet]}>
            <View style={styles.sidebarBrand}>
              <View style={styles.sidebarLogo}>
                <Text style={styles.logoW}>W</Text>
                <Text style={styles.logoS}>S</Text>
              </View>

              <View>
                <Text style={styles.sidebarBrandTitle}>
                  Word
                  <Text style={styles.sidebarBrandAccent}> Scramble</Text>
                </Text>
                <Text style={styles.sidebarBrandSubtitle}>Think fast. Play smart.</Text>
              </View>
            </View>

            <View style={styles.sidebarNavigation}>
              <TouchableOpacity
                style={[styles.sidebarNavItem, styles.sidebarNavActive]}
                onPress={onTabHome}
                activeOpacity={0.8}
              >
                <View style={styles.sidebarActiveIcon}>
                  <Ionicons name="home" size={21} color="#FFFFFF" />
                </View>
                <Text style={styles.sidebarActiveText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sidebarNavItem} onPress={onTabLeaderboard} activeOpacity={0.8}>
                <Ionicons name="trophy-outline" size={22} color={T.inkSoft} />
                <Text style={styles.sidebarText}>Rankings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sidebarNavItem} onPress={onTabProfile} activeOpacity={0.8}>
                <Ionicons name="person-outline" size={22} color={T.inkSoft} />
                <Text style={styles.sidebarText}>Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sidebarBottomCard}>
              <Idle kind="sway" amount={8} duration={1400} style={styles.sidebarBottomIcon}>
                <Ionicons name="sparkles" size={21} color="#FFFFFF" />
              </Idle>
              <Text style={styles.sidebarBottomTitle}>Ready for a challenge?</Text>
              <Text style={styles.sidebarBottomText}>
                Unscramble words and climb the rankings.
              </Text>
            </View>
          </View>
        )}

        {/* ==================================================
            MAIN
        ================================================== */}

        <View style={[styles.main, !isMobile && styles.mainDesktop]}>
          {/* MOBILE HEADER */}

          {isMobile && (
            <View style={styles.mobileHeader}>
              <View style={styles.mobileHeaderLeft}>
                <TouchableOpacity
                  style={styles.headerBackButton}
                  activeOpacity={0.75}
                  onPress={onBack}
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                >
                  <Ionicons name="arrow-back" size={22} color={T.ink} />
                </TouchableOpacity>

                <View style={styles.mobileLogo}>
                  <Text style={styles.logoW}>W</Text>
                  <Text style={styles.logoS}>S</Text>
                </View>

                <View>
                  <Text style={styles.mobileBrandTitle}>
                    Word
                    <Text style={styles.mobileBrandAccent}> Scramble</Text>
                  </Text>
                  <Text style={styles.mobileBrandSubtitle}>Think fast. Play smart.</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.mobileNotification} activeOpacity={0.8}>
                <BellRing />
              </TouchableOpacity>
            </View>
          )}

          {/* DESKTOP HEADER */}

          {!isMobile && (
            <View style={styles.desktopTopHeader}>
              <View style={styles.desktopHeaderLeft}>
                <TouchableOpacity
                  style={styles.headerBackButton}
                  activeOpacity={0.75}
                  onPress={onBack}
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                >
                  <Ionicons name="arrow-back" size={21} color={T.ink} />
                </TouchableOpacity>

                <View>
                  <Text style={styles.desktopWelcome}>Welcome back!</Text>
                  <Text style={styles.desktopWelcomeSub}>Ready to play?</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.desktopNotification}>
                <BellRing />
              </TouchableOpacity>
            </View>
          )}

          {/* CONTENT */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              isMobile && styles.scrollContentMobile,
              isTablet && styles.scrollContentTablet,
            ]}
          >
            {/* HERO */}

            <Animated.View style={[styles.heroSection, isMobile && styles.heroMobile, rise(0)]}>
              <View style={styles.heroPill}>
                <Ionicons name="flash" size={12} color={T.tangerineDark} />
                <Text style={styles.smallGreeting}>Ready to play?</Text>
              </View>

              <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
                Unscramble.
                {"\n"}
                <Text style={styles.heroAccent}>Outsmart.</Text>
              </Text>

              <Text style={[styles.heroDescription, isMobile && styles.heroDescriptionMobile]}>
                Arrange the letters, find the hidden word, and race against your friends.
              </Text>
            </Animated.View>

            {/* SHUFFLING TILES */}

            <Animated.View style={[styles.lettersContainer, isMobile && styles.lettersMobile, rise(1)]}>
              <ScrambleTiles />
            </Animated.View>

            {/* CHOOSE YOUR MODE */}

            <Animated.View style={[styles.modeCard, isMobile && styles.modeCardMobile, rise(2)]}>
              <View style={styles.modeHeader}>
                <View style={styles.modeHeaderIcon}>
                  <Ionicons name="game-controller" size={26} color="#FFFFFF" />
                </View>

                <View style={styles.modeHeaderInfo}>
                  <Text style={styles.modeHeaderTitle}>Choose your mode</Text>
                  <Text style={styles.modeHeaderText}>Play your way and enjoy the game!</Text>
                </View>
              </View>

              <View style={styles.modeRow}>
                {/* SINGLE PLAYER */}

                <View style={[styles.modeBox, styles.modeBoxSingle]}>
                  <View style={styles.modeIconWrap}>
                    <Idle kind="pulse" amount={7} duration={1200}>
                      <View style={[styles.modeIconCircle, styles.singleCircle]}>
                        <Ionicons name="person" size={26} color="#FFFFFF" />
                      </View>
                    </Idle>
                  </View>

                  <Text style={styles.modeTitle}>Single Player</Text>
                  <Text style={styles.modeText}>Challenge yourself and improve your skills.</Text>

                  <PressScale
                    onPress={handleSinglePlayer}
                    style={styles.modeButtonWrap}
                    accessibilityLabel="Play single player"
                  >
                    <View style={[styles.modeButton, styles.singleButton]}>
                      <Text style={styles.modeButtonText}>Play now</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </View>
                  </PressScale>
                </View>

                {/* MULTIPLAYER */}

                <View style={[styles.modeBox, styles.modeBoxMulti]}>
                  <View style={styles.modeIconWrap}>
                    <View style={styles.multiIcons}>
                      <Idle kind="bob" amount={5} duration={900}>
                        <View style={[styles.multiPerson, styles.multiPersonTeal]}>
                          <Ionicons name="person" size={18} color="#FFFFFF" />
                        </View>
                      </Idle>
                      <Idle kind="bob" amount={5} duration={900} delay={450}>
                        <View style={[styles.multiPerson, styles.multiPersonOrange]}>
                          <Ionicons name="person" size={18} color="#FFFFFF" />
                        </View>
                      </Idle>
                    </View>
                  </View>

                  <Text style={styles.modeTitle}>Multiplayer</Text>
                  <Text style={styles.modeText}>Play with your friends and compete together.</Text>

                  <PressScale
                    onPress={handleMultiplayer}
                    style={styles.modeButtonWrap}
                    accessibilityLabel="Play multiplayer"
                  >
                    <View style={[styles.modeButton, styles.multiButton]}>
                      <Text style={styles.modeButtonText}>Play now</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </View>
                  </PressScale>
                </View>
              </View>
            </Animated.View>

            {/* DAILY CHALLENGE */}

            <Animated.View style={[styles.challengeCard, isMobile && styles.challengeCardMobile, rise(3)]}>
              <View style={styles.challengeTop}>
                <View style={styles.challengeLeft}>
                  <Idle kind="sway" amount={9} duration={1300} style={styles.challengeIcon}>
                    <Ionicons name="trophy" size={22} color={T.ink} />
                  </Idle>

                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeTitle}>Daily challenge</Text>
                    <Text style={styles.challengeText}>Solve today's puzzle</Text>
                  </View>
                </View>

                <View style={styles.challengeProgress}>
                  <Text style={styles.progressNumber}>3/5</Text>
                  <Text style={styles.progressText}>rounds</Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: barWidth }]} />
              </View>
            </Animated.View>

            {/* LEADERBOARD */}

            <Animated.View style={[styles.leaderHeader, rise(4)]}>
              <View>
                <Text style={styles.sectionTitle}>Top players</Text>
                <Text style={styles.sectionSubtitle}>Today's leaderboard</Text>
              </View>

              <TouchableOpacity activeOpacity={0.7} onPress={onViewAllPlayers}>
                <Text style={styles.viewAll}>View all</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.leaderboardCard, rise(4)]}>
              {topPlayers.length === 0 ? (
                <View style={styles.emptyLeaderboard}>
                  <Idle kind="bob" amount={6} duration={1100}>
                    <Ionicons name="trophy-outline" size={28} color={T.inkFaint} />
                  </Idle>
                  <Text style={styles.emptyText}>No players yet</Text>
                </View>
              ) : (
                topPlayers.map((player, index) => (
                  <PlayerRow
                    key={`${player.rank}-${player.name}`}
                    player={player}
                    index={index}
                    last={index === topPlayers.length - 1}
                  />
                ))
              )}
            </Animated.View>

            <View style={{ height: isMobile ? 90 : 40 }} />
          </ScrollView>

          {/* MOBILE BOTTOM NAV */}

          {isMobile && (
            <View style={styles.bottomNav}>
              <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabHome}>
                <Idle kind="bob" amount={3} duration={1000} style={styles.activeNavIcon}>
                  <Ionicons name="home" size={20} color="#FFFFFF" />
                </Idle>
                <Text style={styles.activeNavText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabLeaderboard}>
                <Ionicons name="trophy-outline" size={21} color={T.inkFaint} />
                <Text style={styles.navText}>Rankings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onTabProfile}>
                <Ionicons name="person-outline" size={21} color={T.inkFaint} />
                <Text style={styles.navText}>Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WordScrambleHomeScreen;

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: T.bg,
  },

  root: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
  },

  /* SIDEBAR */

  sidebar: {
    width: 292,
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRightWidth: 1.5,
    borderRightColor: T.line,
    paddingHorizontal: 19,
    paddingTop: 22,
    paddingBottom: 18,
    justifyContent: "space-between",
  },

  sidebarTablet: {
    width: 245,
  },

  sidebarBrand: {
    flexDirection: "row",
    alignItems: "center",
  },

  sidebarLogo: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: T.tile,
    borderWidth: 2,
    borderColor: T.tileEdge,
    borderBottomWidth: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginRight: 11,
  },

  logoW: {
    color: T.teal,
    fontSize: 21,
    fontWeight: "900",
  },

  logoS: {
    color: T.tangerine,
    fontSize: 21,
    fontWeight: "900",
  },

  sidebarBrandTitle: {
    color: T.ink,
    fontSize: 19,
    fontWeight: "900",
  },

  sidebarBrandAccent: {
    color: T.teal,
  },

  sidebarBrandSubtitle: {
    color: T.inkSoft,
    fontSize: 10.5,
    fontWeight: "600",
    marginTop: 2,
  },

  sidebarNavigation: {
    marginTop: 50,
    flex: 1,
  },

  sidebarNavItem: {
    height: 58,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 7,
  },

  sidebarNavActive: {
    backgroundColor: T.tealPale,
  },

  sidebarActiveIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.teal,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  sidebarActiveText: {
    color: T.tealDark,
    fontSize: 15,
    fontWeight: "900",
  },

  sidebarText: {
    color: T.inkSoft,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 16,
  },

  sidebarBottomCard: {
    backgroundColor: T.ink,
    borderRadius: 19,
    padding: 17,
    minHeight: 137,
  },

  sidebarBottomIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: T.tangerine,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },

  sidebarBottomTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  sidebarBottomText: {
    color: "#A9CFCB",
    fontSize: 10.5,
    lineHeight: 17,
    marginTop: 5,
  },

  /* MAIN */

  main: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "transparent",
  },

  mainDesktop: {
    overflow: "hidden",
  },

  /* HEADER */

  mobileHeader: {
    height: 76,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },

  mobileHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  headerBackButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: T.white,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  mobileLogo: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: T.tile,
    borderWidth: 2,
    borderColor: T.tileEdge,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginRight: 10,
  },

  mobileBrandTitle: {
    color: T.ink,
    fontSize: 17,
    fontWeight: "900",
  },

  mobileBrandAccent: {
    color: T.teal,
  },

  mobileBrandSubtitle: {
    color: T.inkSoft,
    fontSize: 9.5,
    marginTop: 2,
    fontWeight: "600",
  },

  mobileNotification: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.white,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  desktopTopHeader: {
    height: 76,
    paddingHorizontal: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  desktopHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  desktopWelcome: {
    color: T.ink,
    fontSize: 16,
    fontWeight: "900",
  },

  desktopWelcomeSub: {
    color: T.inkSoft,
    fontSize: 11,
    marginTop: 3,
  },

  desktopNotification: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: T.white,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  /* SCROLL */

  scrollContent: {
    paddingHorizontal: 34,
    paddingTop: 15,
  },

  scrollContentTablet: {
    paddingHorizontal: 25,
  },

  scrollContentMobile: {
    paddingHorizontal: 17,
    paddingTop: 5,
  },

  /* HERO */

  heroSection: {
    marginTop: 7,
  },

  heroMobile: {
    marginTop: 5,
  },

  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: T.tangerinePale,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
    gap: 4,
  },

  smallGreeting: {
    color: T.tangerineDark,
    fontSize: 12,
    fontWeight: "800",
  },

  heroTitle: {
    color: T.ink,
    fontSize: 45,
    lineHeight: 48,
    fontWeight: "900",
    letterSpacing: -1.2,
  },

  heroTitleMobile: {
    fontSize: 37,
    lineHeight: 40,
    letterSpacing: -1,
  },

  heroAccent: {
    color: T.teal,
  },

  heroDescription: {
    color: T.inkSoft,
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 390,
  },

  heroDescriptionMobile: {
    fontSize: 12.5,
    lineHeight: 18,
    maxWidth: 310,
  },

  /* SHUFFLING TILES */

  lettersContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
    marginBottom: 25,
    paddingTop: 18, // room for the hop
  },

  lettersMobile: {
    marginTop: 22,
    marginBottom: 20,
  },

  scrambleBox: {
    width: TILE * 4 + TILE_GAP * 3,
    height: TILE,
  },

  heroTile: {
    position: "absolute",
    left: 0,
    top: 0,
    width: TILE,
    height: TILE,
    borderRadius: 13,
    backgroundColor: T.tile,
    borderWidth: 2,
    borderColor: T.tileEdge,
    borderBottomWidth: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  heroTileChar: {
    fontSize: 27,
    fontWeight: "900",
  },

  heroTilePts: {
    position: "absolute",
    right: 6,
    bottom: 3,
    fontSize: 9,
    fontWeight: "800",
    color: T.inkSoft,
  },

  /* CHOOSE YOUR MODE */

  modeCard: {
    backgroundColor: T.card,
    borderRadius: 24,
    padding: 14,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 5,
    alignSelf: "stretch",
  },

  modeCardMobile: {
    padding: 12,
    borderRadius: 22,
  },

  modeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  modeHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: T.teal,
    borderBottomWidth: 4,
    borderBottomColor: T.tealDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  modeHeaderInfo: {
    flex: 1,
    minWidth: 0,
  },

  modeHeaderTitle: {
    color: T.ink,
    fontSize: 16,
    fontWeight: "900",
  },

  modeHeaderText: {
    color: T.inkSoft,
    fontSize: 11.5,
    marginTop: 3,
  },

  modeRow: {
    flexDirection: "row",
    gap: 10,
  },

  modeBox: {
    flex: 1,
    minWidth: 0,
    borderRadius: 18,
    padding: 10,
    alignItems: "center",
    borderWidth: 1.5,
  },

  modeBoxSingle: {
    backgroundColor: T.tealPale,
    borderColor: "#B5E6D8",
  },

  modeBoxMulti: {
    backgroundColor: T.tangerinePale,
    borderColor: "#FFD2B3",
  },

  modeIconWrap: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 6,
  },

  modeIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  singleCircle: {
    backgroundColor: T.teal,
  },

  multiIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  multiPerson: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  multiPersonTeal: {
    backgroundColor: T.teal,
  },

  multiPersonOrange: {
    backgroundColor: T.tangerine,
  },

  modeTitle: {
    color: T.ink,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  modeText: {
    color: T.inkSoft,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 12,
    minHeight: 32,
  },

  modeButtonWrap: {
    alignSelf: "stretch",
  },

  modeButton: {
    height: 44,
    alignSelf: "stretch",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderBottomWidth: 4,
  },

  singleButton: {
    backgroundColor: T.teal,
    borderBottomColor: T.tealDark,
  },

  multiButton: {
    backgroundColor: T.tangerine,
    borderBottomColor: T.tangerineDark,
  },

  modeButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  /* SECTIONS */

  sectionTitle: {
    color: T.ink,
    fontSize: 17,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: T.inkSoft,
    fontSize: 11,
    marginTop: 3,
  },

  /* CHALLENGE */

  challengeCard: {
    marginTop: 22,
    borderRadius: 18,
    backgroundColor: T.ink,
    padding: 15,
  },

  challengeCardMobile: {
    marginTop: 18,
    padding: 14,
  },

  challengeTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  challengeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },

  challengeIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: T.lemon,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  challengeInfo: {
    flex: 1,
    minWidth: 0,
  },

  challengeTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  challengeText: {
    color: "#A9CFCB",
    fontSize: 10.5,
    marginTop: 3,
  },

  challengeProgress: {
    alignItems: "flex-end",
    marginLeft: 10,
  },

  progressNumber: {
    color: T.lemon,
    fontSize: 17,
    fontWeight: "900",
  },

  progressText: {
    color: "#7FB0AB",
    fontSize: 9,
    marginTop: 1,
  },

  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.14)",
    marginTop: 14,
    overflow: "hidden",
  },

  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: T.lemon,
  },

  /* LEADERBOARD */

  leaderHeader: {
    marginTop: 27,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewAll: {
    color: T.tealDark,
    fontSize: 12,
    fontWeight: "800",
  },

  leaderboardCard: {
    backgroundColor: T.card,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 5,
    paddingHorizontal: 13,
    overflow: "hidden",
  },

  playerRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E4F3EE",
  },

  lastPlayerRow: {
    borderBottomWidth: 0,
  },

  rankCircle: {
    width: 27,
    height: 27,
    borderRadius: 8,
    backgroundColor: "#EAF1EF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  rankFirst: {
    backgroundColor: "#FFEFA6",
  },

  rankSecond: {
    backgroundColor: "#E3E9E8",
  },

  rankThird: {
    backgroundColor: "#FFD9BE",
  },

  rankText: {
    color: T.ink,
    fontSize: 11,
    fontWeight: "900",
  },

  playerAvatar: {
    width: 37,
    height: 37,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  playerInfo: {
    flex: 1,
    minWidth: 0,
  },

  playerName: {
    color: T.ink,
    fontSize: 13,
    fontWeight: "800",
  },

  topPlayerLabel: {
    color: T.tangerineDark,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 2,
  },

  scoreContainer: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  scoreNumber: {
    color: T.ink,
    fontSize: 14,
    fontWeight: "900",
  },

  scoreLabel: {
    color: T.inkFaint,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 1,
  },

  emptyLeaderboard: {
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: T.inkSoft,
    fontSize: 11,
    marginTop: 7,
  },

  /* BOTTOM NAV */

  bottomNav: {
    height: 70,
    backgroundColor: T.white,
    borderTopWidth: 1.5,
    borderTopColor: T.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 4,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  activeNavIcon: {
    width: 37,
    height: 32,
    borderRadius: 11,
    backgroundColor: T.teal,
    alignItems: "center",
    justifyContent: "center",
  },

  activeNavText: {
    color: T.tealDark,
    fontSize: 9.5,
    fontWeight: "900",
    marginTop: 3,
  },

  navText: {
    color: T.inkFaint,
    fontSize: 9.5,
    fontWeight: "700",
    marginTop: 4,
  },
});
