
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Difficulty } from "../types/game";
import { API_BASE_URL } from "../api/api";
import { FadeInUp, PopIn, PressableScale, useShake } from "../components/motion";
import { feedback } from "../utils/feedback";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface Badge {
  emoji: string;
  label: string;
}

interface WinPayload {
  score: number; // stars earned this round
  attemptsUsed: number;
  timeTakenSec: number;
  secretCode: number[];
  badge: Badge;
}

interface LosePayload {
  score: number;
  secretCode: number[];
}

interface GameScreenProps {
  difficulty: Difficulty;
  darkMode: boolean;
  onBack: () => void; // back arrow -> Level screen
  onExitToMenu?: () => void; // Exit dialog "Yes" -> Home / menu screen
  onWin?: (result: WinPayload) => void;
  onLose?: (result: LosePayload) => void;
  playerId?: string; // pass your logged-in user id; falls back to "guest"
  level?: number; // which level (1-10) to start with; comes from the Level Map screen
}

interface LevelConfig {
  level: number;
  slots: number;
  colors: number;
  allowRepeats: boolean;
  maxGuesses: number;
}

interface HistoryRow {
  guess: number[];
  exact: number; // green dot  - right colour, right slot
  misplaced: number; // ring   - right colour, wrong slot
}

type Phase = "playing" | "won" | "lost";

type PendingResult =
  | { type: "win"; payload: WinPayload }
  | { type: "lose"; payload: LosePayload }
  | null;

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

const PURPLE = "#7C3AED";
const PURPLE_SOFT = "#C4B5FD";
const GREEN = "#22C55E";
const YELLOW = "#F5C518";
const RED = "#F87171";

// Tile colours stay distinct (that is how you tell the digits apart); everything around them is purple.
const TILE_COLORS: Record<number, string> = {
  1: "#EF4444",
  2: "#3B82F6",
  3: "#FACC15",
  4: "#06B6D4",
  5: "#22C55E",
  6: "#F97316",
  7: "#EC4899",
  8: "#A855F7",
};

const getPalette = (dark: boolean) =>
  dark
    ? {
        bgGradient: ["#0B0520", "#130A30", "#1A0E3F"] as [string, string, string],
        pill: "rgba(139,92,246,0.14)",
        pillBorder: "rgba(167,139,250,0.35)",
        text: "#FFFFFF",
        subtext: "#B4A7E8",
        button: "rgba(139,92,246,0.18)",
        buttonBorder: "rgba(167,139,250,0.3)",
        sheet: "#160C38",
      }
    : {
        bgGradient: ["#F6F1FF", "#EFE7FF", "#E7DBFF"] as [string, string, string],
        pill: "#FFFFFF",
        pillBorder: "rgba(124,58,237,0.22)",
        text: "#1E1147",
        subtext: "#6B5CA8",
        button: "rgba(124,58,237,0.10)",
        buttonBorder: "rgba(124,58,237,0.22)",
        sheet: "#FFFFFF",
      };

const getBadge = (stars: number): Badge => {
  if (stars >= 3) return { emoji: "🏆", label: "Gold — Codebreaker Elite" };
  if (stars === 2) return { emoji: "🥈", label: "Silver — Sharp Solver" };
  return { emoji: "🥉", label: "Bronze — Code Cracked" };
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

const GameScreen: React.FC<GameScreenProps> = ({
  difficulty,
  darkMode,
  onBack,
  onExitToMenu,
  onWin,
  onLose,
  playerId = "guest",
  level,
}) => {
  const c = getPalette(darkMode);
  const styles = useMemo(() => makeStyles(c), [darkMode]);

  // ---- server-driven game state ----
  const [cfg, setCfg] = useState<LevelConfig | null>(null);
  const [totalLevels, setTotalLevels] = useState(1);
  const [gameId, setGameId] = useState<string | null>(null);
  const gameIdRef = useRef<string | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [possible, setPossible] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  // ---- UI state ----
  const [current, setCurrent] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [locked, setLocked] = useState(false); // round finished, waiting to show result
  const [phase, setPhase] = useState<Phase>("playing");
  const [secret, setSecret] = useState<number[]>([]);
  const [starsEarned, setStarsEarned] = useState(0);
  const [boardW, setBoardW] = useState(340);
  const [exitOpen, setExitOpen] = useState(false); // exit confirm dialog

  const pendingResultRef = useRef<PendingResult>(null);
  const startedAtRef = useRef(Date.now());
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const overlayScale = useRef(new Animated.Value(0.4)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // shake for the current row when something goes wrong
  const { x: shakeX, shake } = useShake();

  const playOverlayAnimation = () => {
    overlayScale.setValue(0.4);
    overlayOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(overlayScale, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    return () => {
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, []);

  /* ---------------- API: start a game ---------------- */

  const startGame = useCallback(
    async (levelOverride?: number) => {
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      setLoading(true);
      setLoadError(null);
      setInlineError(null);
      setPhase("playing");
      setLocked(false);
      setExitOpen(false);
      setHistory([]);
      setCurrent([]);
      setSecret([]);
      setStarsEarned(0);
      pendingResultRef.current = null;
      startedAtRef.current = Date.now();

      try {
        const res = await fetch(`${API_BASE_URL}/games/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ difficulty, level: levelOverride, playerId }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Failed to start game (${res.status})`);

        setGameId(data.gameId);
        gameIdRef.current = data.gameId;
        setCfg({
          level: data.level,
          slots: data.slots,
          colors: data.colors,
          allowRepeats: !!data.allowRepeats,
          maxGuesses: data.maxGuesses,
        });
        setTotalLevels(data.totalLevels ?? 1);
        setPossible(data.possibleCodes ?? 0);
        setTotalStars(data.totalStars ?? 0);
        setLoading(false);
      } catch (err: any) {
        setLoadError(err.message || "Could not reach the server");
        setLoading(false);
      }
    },
    [difficulty, playerId]
  );

  useEffect(() => {
    startGame(level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, level]);

  /* ---------------- API: submit a guess ---------------- */

  const revealResult = (
    status: "won" | "lost",
    stars: number,
    secretCode: number[],
    attemptsUsed: number
  ) => {
    setLocked(true);
    finishTimerRef.current = setTimeout(() => {
      setSecret(secretCode);
      setStarsEarned(stars);
      if (status === "won") {
        pendingResultRef.current = {
          type: "win",
          payload: {
            score: stars,
            attemptsUsed,
            timeTakenSec: Math.round((Date.now() - startedAtRef.current) / 1000),
            secretCode,
            badge: getBadge(stars),
          },
        };
      } else {
        pendingResultRef.current = { type: "lose", payload: { score: 0, secretCode } };
      }
      setPhase(status);
      feedback(status === "won" ? "win" : "wrong"); // sound + haptic for the result screen
      playOverlayAnimation();
    }, 900); // let the player see the last row's feedback first
  };

  const submitGuess = async () => {
    if (!cfg || current.length !== cfg.slots) return;
    if (phase !== "playing" || locked || submittingRef.current) return;
    const id = gameIdRef.current;
    if (!id) return;

    submittingRef.current = true;
    setSubmitting(true);
    setInlineError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/games/${id}/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess: current }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 409) {
        // Backend says this game is already finished.
        revealResult(
          data.status === "won" ? "won" : "lost",
          data.stars ?? 0,
          data.secretCode ?? [],
          data.guessesUsed ?? history.length
        );
        return;
      }
      if (!res.ok) throw new Error(data.error || `Guess failed (${res.status})`);

      const exact = data.feedback?.exact ?? 0;
      const misplaced = data.feedback?.misplaced ?? 0;

      setHistory((prev) => [
        ...prev,
        {
          guess: data.guess ?? current,
          exact,
          misplaced,
        },
      ]);
      setPossible(data.possibleCodes ?? 0);
      setTotalStars(data.totalStars ?? totalStars);
      setCurrent([]);

      // ---- sound + haptic for this guess ----
      // (when the game ends, the win / lose sound plays on the result screen instead)
      const finished = data.status === "won" || data.status === "lost";
      if (!finished) {
        const prevBestExact = history.reduce((m, r) => Math.max(m, r.exact), 0);
        if (exact > prevBestExact) feedback("combo"); // green count went up
        else if (exact > 0 || misplaced > 0) feedback("correct"); // some clue hit
        else feedback("wrong"); // nothing matched
      }

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);

      if (finished) {
        revealResult(data.status, data.stars ?? 0, data.secretCode ?? [], data.guessesUsed);
      }
    } catch (err: any) {
      setInlineError(err.message || "Could not submit guess");
      feedback("wrong");
      shake();
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  /* ---------------- input handlers ---------------- */

  const inputsDisabled = phase !== "playing" || locked || submitting || loading;

  const handleTile = (digit: number) => {
    if (!cfg || inputsDisabled) return;
    if (current.length >= cfg.slots) return;
    if (!cfg.allowRepeats && current.includes(digit)) return;
    feedback("tap");
    setCurrent((prev) => [...prev, digit]);
  };

  const handleUndo = () => {
    if (inputsDisabled) return;
    feedback("tap");
    setCurrent((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (inputsDisabled) return;
    feedback("tap");
    setCurrent([]);
  };

  const handleBackToMenu = () => {
    if (pendingResultRef.current?.type === "win") {
      onWin?.(pendingResultRef.current.payload);
    } else if (pendingResultRef.current?.type === "lose") {
      onLose?.(pendingResultRef.current.payload);
    }
    onBack();
  };

  // "Yes" on the exit dialog -> Home / menu screen (falls back to onBack if not provided)
  const handleExitYes = () => {
    setExitOpen(false);
    (onExitToMenu ?? onBack)();
  };

  const handleNextLevel = () => {
    // after the last level, go back to level 1 (all levels are open once everything is won)
    const next = cfg ? (cfg.level >= totalLevels ? 1 : cfg.level + 1) : undefined;
    startGame(next);
  };

  const handleTryAgain = () => startGame(cfg?.level);

  /* ---------------- small render helpers ---------------- */

  const renderStars = (count: number, size: number, keyPrefix: string, animate = false, baseDelay = 0) => (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {[1, 2, 3].map((n) => {
        const icon = (
          <Ionicons
            name={n <= count ? "star" : "star-outline"}
            size={size}
            color={n <= count ? YELLOW : "rgba(196,181,253,0.45)"}
          />
        );
        return animate ? (
          <PopIn key={`${keyPrefix}-${n}`} delay={baseDelay + n * 200}>
            {icon}
          </PopIn>
        ) : (
          <View key={`${keyPrefix}-${n}`}>{icon}</View>
        );
      })}
    </View>
  );

  const renderTile = (digit: number, size: number, key?: string | number) => (
    <View
      key={key}
      style={[styles.tile, { width: size, height: size, borderRadius: size * 0.26, backgroundColor: TILE_COLORS[digit] }]}
    >
      <Text style={[styles.tileText, { fontSize: size * 0.42 }]}>{digit}</Text>
    </View>
  );

  const renderFeedback = (exact: number, misplaced: number, compact = false) => (
    <PopIn delay={250}>
      <View style={[styles.fbWrap, compact && styles.fbWrapCompact]}>
        <View style={[styles.fbDot, compact && styles.fbDotCompact, exact === 0 && styles.fbDotOff]} />
        <Text style={[styles.fbNum, compact && styles.fbNumCompact, exact === 0 && styles.fbNumOff]}>{exact}</Text>
        <View style={[styles.fbRing, compact && styles.fbRingCompact, misplaced === 0 && styles.fbRingOff]} />
        <Text style={[styles.fbNum, compact && styles.fbNumCompact, misplaced === 0 && styles.fbNumOff]}>{misplaced}</Text>
      </View>
    </PopIn>
  );

  /* ================================================================ */
  /* Screens                                                           */
  /* ================================================================ */

  if (loading) {
    return (
      <LinearGradient colors={c.bgGradient} style={[styles.root, styles.centerFill]}>
        <ActivityIndicator size="large" color={PURPLE} />
        <Text style={styles.loadingText}>Preparing your code…</Text>
      </LinearGradient>
    );
  }

  if (loadError || !cfg) {
    return (
      <LinearGradient colors={c.bgGradient} style={[styles.root, styles.centerFill]}>
        <PopIn>
          <View style={styles.errorIconWrap}>
            <Ionicons name="cloud-offline-outline" size={32} color={RED} />
          </View>
        </PopIn>
        <FadeInUp delay={100}>
          <Text style={styles.errorTitle}>Couldn't start the game</Text>
        </FadeInUp>
        <FadeInUp delay={200}>
          <Text style={styles.errorText}>{loadError ?? "Something went wrong"}</Text>
        </FadeInUp>
        <PressableScale style={styles.secondaryFilled} onPress={() => startGame(cfg?.level)}>
          <Text style={styles.secondaryFilledText}>Try again</Text>
        </PressableScale>
        <PressableScale style={styles.textButton} onPress={onBack}>
          <Text style={[styles.textButtonText, { color: c.subtext }]}>Go back</Text>
        </PressableScale>
      </LinearGradient>
    );
  }

  if (phase === "won") {
    const isLast = cfg.level >= totalLevels;
    const badge = getBadge(starsEarned);
    return (
      <LinearGradient colors={c.bgGradient} style={[styles.root, styles.centerFill]}>
        <Animated.View style={[styles.resultWrap, { opacity: overlayOpacity, transform: [{ scale: overlayScale }] }]}>
          <LinearGradient colors={["#2A1B6B", "#3B1D8F", "#1A0E45"]} style={styles.resultCard}>
            <PopIn delay={150}>
              <View style={styles.resultBadgeWrap}>
                <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
              </View>
            </PopIn>
            <FadeInUp delay={250} distance={16}>
              <Text style={styles.resultTitle}>
                CODE <Text style={{ color: "#A855F7" }}>CRACKED</Text>
              </Text>
            </FadeInUp>
            <View style={{ marginTop: 12 }}>{renderStars(starsEarned, 30, "win", true, 350)}</View>
            <FadeInUp delay={1000} distance={10} style={styles.badgeChip}>
              <Text style={styles.badgeChipText}>{badge.label}</Text>
            </FadeInUp>

            <FadeInUp delay={1100} distance={14} style={styles.summaryRowWrap}>
              <View style={styles.summaryCell}>
                <Text style={styles.summaryValue}>
                  {history.length}/{cfg.maxGuesses}
                </Text>
                <Text style={styles.summaryLabel}>Guesses used</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryCell}>
                <Text style={styles.summaryValue}>{totalStars}</Text>
                <Text style={styles.summaryLabel}>Total stars</Text>
              </View>
            </FadeInUp>

            <PressableScale containerStyle={styles.stretch} style={styles.primaryButton} onPress={handleNextLevel}>
              <Text style={styles.primaryButtonText}>{isLast ? "Play again" : `Level ${cfg.level + 1}`}</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </PressableScale>

            <PressableScale style={styles.textButton} onPress={handleBackToMenu}>
              <Text style={styles.textButtonText}>Back to menu</Text>
            </PressableScale>
          </LinearGradient>
        </Animated.View>
      </LinearGradient>
    );
  }

  if (phase === "lost") {
    // 7-slot codes must fit inside the result card
    const revealSize = Math.min(50, Math.floor((330 - (Math.max(secret.length, 1) - 1) * 8) / Math.max(secret.length, 1)));
    return (
      <LinearGradient colors={c.bgGradient} style={[styles.root, styles.centerFill]}>
        <Animated.View style={[styles.resultWrap, { opacity: overlayOpacity, transform: [{ scale: overlayScale }] }]}>
          <LinearGradient colors={["#3A1B4F", "#2A1670", "#1A0E45"]} style={styles.resultCard}>
            <PopIn delay={150}>
              <View style={[styles.resultBadgeWrap, { backgroundColor: "rgba(248,113,113,0.15)" }]}>
                <Ionicons name="close" size={42} color={RED} />
              </View>
            </PopIn>
            <FadeInUp delay={250} distance={16}>
              <Text style={styles.resultTitle}>
                OUT OF <Text style={{ color: RED }}>GUESSES</Text>
              </Text>
            </FadeInUp>
            <FadeInUp delay={350} distance={10}>
              <Text style={styles.wrongSubtext}>The secret code was</Text>
            </FadeInUp>

            <View style={styles.codeRevealRow}>
              {secret.map((d, i) => (
                <PopIn key={i} delay={500 + i * 180}>
                  {renderTile(d, revealSize)}
                </PopIn>
              ))}
            </View>

            <PressableScale containerStyle={styles.stretch} style={styles.primaryButton} onPress={handleTryAgain}>
              <Text style={styles.primaryButtonText}>Try again</Text>
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
            </PressableScale>

            <PressableScale style={styles.textButton} onPress={handleBackToMenu}>
              <Text style={styles.textButtonText}>Back to menu</Text>
            </PressableScale>
          </LinearGradient>
        </Animated.View>
      </LinearGradient>
    );
  }

  /* ---------------- playing screen ---------------- */

  const guessesLeft = cfg.maxGuesses - history.length;
  const showCurrentRow = !locked && history.length < cfg.maxGuesses;

  // Tile size adapts to the board width so 3, 4 and 5 slot levels all fit.
  // 5+ slots (levels 21-50) use a compact feedback column + tighter gaps so 7 tiles still fit.
  const compact = cfg.slots >= 5;
  const FB_W = compact ? 72 : 92;
  const IDX_W = 20;
  const tileGap = cfg.slots >= 6 ? 4 : cfg.slots === 5 ? 6 : 8;
  const dividerMargin = compact ? 8 : 12;
  const available = boardW - 32 - IDX_W - FB_W - 1 - dividerMargin * 2;
  const tileSize = Math.max(24, Math.min(64, Math.floor((available - (cfg.slots - 1) * tileGap) / cfg.slots)));
  const paletteSize = cfg.colors <= 5 ? 58 : cfg.colors <= 6 ? 52 : 46;
  const digits = Array.from({ length: cfg.colors }, (_, i) => i + 1);
  const nextEmptyIndex = current.length;
  const checkDisabled = inputsDisabled || current.length !== cfg.slots;

  return (
    <LinearGradient colors={c.bgGradient} style={styles.root}>
      <View style={styles.column}>
        {/* Top bar */}
        <FadeInUp distance={-14} duration={350}>
          <View style={styles.topBar}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Back to levels"
              scaleTo={0.88}
              style={styles.closeButton}
              onPress={onBack}
            >
              <Ionicons name="arrow-back" size={24} color={c.text} />
            </PressableScale>
            <View style={styles.levelPill}>
              <Text style={styles.levelPillText}>
                Level <Text style={{ color: PURPLE }}>{cfg.level}</Text>
              </Text>
            </View>
            <Text style={styles.starsText}>
              Stars <Text style={{ color: PURPLE }}>{totalStars}</Text>
            </Text>
            <View style={{ flex: 1 }} />
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Close"
              scaleTo={0.88}
              style={styles.closeButton}
              onPress={() => setExitOpen(true)}
            >
              <Ionicons name="close" size={26} color={c.text} />
            </PressableScale>
          </View>
        </FadeInUp>

        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info chips */}
          <FadeInUp delay={80}>
            <View style={styles.chipRow}>
              <View style={[styles.chip, styles.chipStrong]}>
                <Text style={styles.chipStrongText}>
                  Codes still possible <Text style={{ color: YELLOW }}>{possible}</Text>
                </Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  Guesses left <Text style={{ color: RED }}>{guessesLeft}</Text>
                </Text>
              </View>
            </View>
          </FadeInUp>
          <FadeInUp delay={160}>
            <View style={styles.chipRow}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  <Text style={{ color: PURPLE }}>{cfg.slots}</Text> slots
                </Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{cfg.allowRepeats ? "Repeats allowed" : "No repeats"}</Text>
              </View>
            </View>
          </FadeInUp>

          {/* Board */}
          <FadeInUp delay={240} style={styles.boardWrap}>
            <View style={styles.board} onLayout={(e) => setBoardW(e.nativeEvent.layout.width)}>
              {history.map((row, idx) => (
                <FadeInUp key={idx} distance={16} duration={300} style={styles.boardRow}>
                  <Text style={styles.rowIndex}>{idx + 1}</Text>
                  <View style={[styles.rowTiles, { gap: tileGap }]}>{row.guess.map((d, i) => renderTile(d, tileSize, i))}</View>
                  <View style={[styles.rowDivider, { height: tileSize, marginHorizontal: dividerMargin }]} />
                  {renderFeedback(row.exact, row.misplaced, compact)}
                </FadeInUp>
              ))}

              {showCurrentRow && (
                <Animated.View style={[styles.boardRow, { transform: [{ translateX: shakeX }] }]}>
                  <Text style={styles.rowIndex}>{history.length + 1}</Text>
                  <View style={[styles.rowTiles, { gap: tileGap }]}>
                    {Array.from({ length: cfg.slots }).map((_, i) => {
                      const d = current[i];
                      if (d !== undefined) {
                        return (
                          <PopIn key={`${i}-${d}`}>{renderTile(d, tileSize)}</PopIn>
                        );
                      }
                      return (
                        <View
                          key={`empty-${i}`}
                          style={[
                            styles.emptySlot,
                            { width: tileSize, height: tileSize, borderRadius: tileSize * 0.26 },
                            i === nextEmptyIndex && styles.emptySlotNext,
                          ]}
                        />
                      );
                    })}
                  </View>
                  <View style={[styles.rowDivider, { height: tileSize, marginHorizontal: dividerMargin }]} />
                  <View style={[styles.fbWrap, compact && styles.fbWrapCompact]}>
                    <Text style={styles.fbQuestion}>?</Text>
                  </View>
                </Animated.View>
              )}
            </View>
          </FadeInUp>

          {/* Legend */}
          <Text style={styles.legendText}>
            <Text style={{ color: GREEN }}>●</Text> right colour in the right slot{"   "}
            <Text style={{ color: YELLOW }}>○</Text> right colour, wrong slot.{" "}
            <Text style={styles.legendStrong}>The counts never say which slot.</Text>
          </Text>

          {inlineError ? (
            <FadeInUp distance={8} duration={250}>
              <View style={styles.inlineErrorBox}>
                <Ionicons name="alert-circle-outline" size={14} color={RED} />
                <Text style={styles.inlineErrorText}>{inlineError}</Text>
              </View>
            </FadeInUp>
          ) : null}

          {/* Tile palette (the numpad) */}
          <View style={[styles.palette, { gap: cfg.colors > 6 ? 10 : 14 }]}>
            {digits.map((d, i) => {
              const used = !cfg.allowRepeats && current.includes(d);
              return (
                <FadeInUp key={d} delay={320 + i * 70} distance={18} duration={350}>
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityLabel={`Digit ${d}`}
                    disabled={inputsDisabled || used}
                    onPress={() => handleTile(d)}
                    scaleTo={0.82}
                    style={[
                      styles.paletteTile,
                      {
                        width: paletteSize,
                        height: paletteSize,
                        backgroundColor: TILE_COLORS[d],
                        opacity: used ? 0.3 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.tileText, { fontSize: paletteSize * 0.4 }]}>{d}</Text>
                  </PressableScale>
                </FadeInUp>
              );
            })}
          </View>

          {/* Actions */}
          <FadeInUp delay={600} style={styles.actionRow}>
            <PressableScale
              onPress={submitGuess}
              disabled={checkDisabled}
              scaleTo={0.94}
              containerStyle={{ flex: 1.5 }}
              style={[styles.checkButton, checkDisabled && styles.checkButtonDisabled]}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.checkButtonText}>Check</Text>
              )}
            </PressableScale>
            <PressableScale
              onPress={handleUndo}
              disabled={inputsDisabled || current.length === 0}
              containerStyle={{ flex: 1 }}
              style={[styles.smallButton, current.length === 0 && { opacity: 0.5 }]}
            >
              <Text style={styles.smallButtonText}>Undo</Text>
            </PressableScale>
            <PressableScale
              onPress={handleClear}
              disabled={inputsDisabled || current.length === 0}
              containerStyle={{ flex: 1 }}
              style={[styles.smallButton, current.length === 0 && { opacity: 0.5 }]}
            >
              <Text style={styles.smallButtonText}>Clear</Text>
            </PressableScale>
          </FadeInUp>
        </ScrollView>
      </View>

      {/* Exit confirm dialog */}
      <Modal visible={exitOpen} transparent animationType="fade" onRequestClose={() => setExitOpen(false)}>
        <View style={styles.exitBackdrop}>
          <View style={styles.exitCard}>
            <View style={styles.exitIconWrap}>
              <Ionicons name="exit-outline" size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.exitTitle}>Exit Game?</Text>
            <Text style={styles.exitMsg}>Are you sure you want to exit?</Text>

            <View style={styles.exitRow}>
              <Pressable style={[styles.exitBtn, styles.exitNo]} onPress={() => setExitOpen(false)}>
                <Text style={styles.exitNoText}>No</Text>
              </Pressable>
              <Pressable style={[styles.exitBtn, styles.exitYes]} onPress={handleExitYes}>
                <Text style={styles.exitYesText}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default GameScreen;

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const makeStyles = (c: ReturnType<typeof getPalette>) =>
  StyleSheet.create({
    root: { flex: 1 },
    column: { flex: 1, width: "100%", maxWidth: 560, alignSelf: "center", paddingTop: 16 },
    stretch: { alignSelf: "stretch" },
    centerFill: { justifyContent: "center", alignItems: "center", gap: 12, paddingHorizontal: 24 },
    loadingText: { fontSize: 13, color: c.subtext },

    errorIconWrap: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: "rgba(248,113,113,0.14)",
      justifyContent: "center",
      alignItems: "center",
    },
    errorTitle: { fontSize: 18, fontWeight: "800", color: c.text },
    errorText: { color: RED, fontSize: 13, textAlign: "center", paddingHorizontal: 24 },
    secondaryFilled: {
      marginTop: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 14,
      backgroundColor: PURPLE,
    },
    secondaryFilledText: { fontWeight: "700", color: "#FFFFFF" },

    topBar: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 18 },
    levelPill: {
      backgroundColor: c.pill,
      borderWidth: 1,
      borderColor: c.pillBorder,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 26,
    },
    levelPillText: { fontSize: 17, fontWeight: "800", color: c.text },
    starsText: { fontSize: 17, fontWeight: "600", color: c.text },
    closeButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: c.pill,
      borderWidth: 1.5,
      borderColor: c.pillBorder,
      justifyContent: "center",
      alignItems: "center",
    },

    scrollContent: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 36, alignItems: "center", gap: 12 },

    chipRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
    chip: {
      backgroundColor: c.pill,
      borderWidth: 1,
      borderColor: c.pillBorder,
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 24,
    },
    chipText: { fontSize: 14, fontWeight: "800", color: c.text },
    chipStrong: { backgroundColor: "#3B1D8F", borderColor: "#3B1D8F" },
    chipStrongText: { fontSize: 14, fontWeight: "800", color: "#FFFFFF" },

    boardWrap: { alignSelf: "stretch", marginTop: 6 },
    board: {
      alignSelf: "stretch",
      backgroundColor: "#1B1046",
      borderRadius: 26,
      borderWidth: 1,
      borderColor: "rgba(167,139,250,0.25)",
      padding: 16,
    },
    boardRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    rowIndex: { width: 20, fontSize: 14, fontWeight: "800", color: "rgba(196,181,253,0.55)" },
    rowTiles: { flexDirection: "row", gap: 8 },
    rowDivider: { width: 1, marginHorizontal: 12, backgroundColor: "rgba(196,181,253,0.2)" },

    tile: {
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 3,
    },
    tileText: { color: "#FFFFFF", fontWeight: "900" },
    emptySlot: {
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: "rgba(196,181,253,0.28)",
      backgroundColor: "rgba(255,255,255,0.03)",
    },
    emptySlotNext: { borderColor: PURPLE_SOFT, backgroundColor: "rgba(139,92,246,0.15)" },

    fbWrap: { width: 92, flexDirection: "row", alignItems: "center", gap: 6 },
    fbDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: GREEN },
    fbDotOff: { backgroundColor: "rgba(167,139,250,0.25)" },
    fbRing: { width: 16, height: 16, borderRadius: 8, borderWidth: 3, borderColor: YELLOW, marginLeft: 6 },
    fbRingOff: { borderColor: "rgba(245,197,24,0.3)" },
    fbNum: { fontSize: 20, fontWeight: "900", color: "#FFFFFF", minWidth: 14 },
    fbNumOff: { color: "rgba(196,181,253,0.45)" },
    fbWrapCompact: { width: 72, gap: 3 },
    fbDotCompact: { width: 12, height: 12, borderRadius: 6 },
    fbRingCompact: { width: 12, height: 12, borderRadius: 6, borderWidth: 2.5, marginLeft: 2 },
    fbNumCompact: { fontSize: 16, minWidth: 10 },
    fbQuestion: { flex: 1, textAlign: "center", fontSize: 22, fontWeight: "900", color: "rgba(196,181,253,0.45)" },

    legendText: { textAlign: "center", fontSize: 14.5, lineHeight: 22, fontWeight: "600", color: c.subtext, paddingHorizontal: 8 },
    legendStrong: { color: PURPLE, fontWeight: "800" },

    inlineErrorBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(248,113,113,0.12)",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
    },
    inlineErrorText: { color: RED, fontSize: 12.5, flexShrink: 1 },

    palette: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 14, marginTop: 6 },
    paletteTile: {
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: "rgba(255,255,255,0.55)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      elevation: 4,
    },

    actionRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 14, alignSelf: "stretch" },
    checkButton: {
      height: 56,
      borderRadius: 18,
      backgroundColor: PURPLE,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: PURPLE,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 6,
    },
    checkButtonDisabled: { opacity: 0.4, shadowOpacity: 0 },
    checkButtonText: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
    smallButton: {
      height: 56,
      borderRadius: 18,
      backgroundColor: c.button,
      borderWidth: 1,
      borderColor: c.buttonBorder,
      justifyContent: "center",
      alignItems: "center",
    },
    smallButtonText: { color: c.text, fontSize: 19, fontWeight: "800" },

    resultWrap: { width: "100%", maxWidth: 420 },
    resultCard: {
      alignItems: "center",
      borderRadius: 26,
      padding: 26,
      borderWidth: 1,
      borderColor: "rgba(160,150,255,0.28)",
      overflow: "hidden",
    },
    resultBadgeWrap: {
      width: 92,
      height: 92,
      borderRadius: 28,
      backgroundColor: "rgba(255,255,255,0.1)",
      justifyContent: "center",
      alignItems: "center",
    },
    badgeEmoji: { fontSize: 52 },
    resultTitle: { marginTop: 16, fontSize: 26, fontWeight: "900", color: "#FFFFFF", letterSpacing: 0.5, textAlign: "center" },
    badgeChip: { marginTop: 12, backgroundColor: "rgba(245,197,24,0.15)", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 14 },
    badgeChipText: { color: YELLOW, fontSize: 13, fontWeight: "700", textAlign: "center" },
    wrongSubtext: { marginTop: 8, fontSize: 13, color: "#B4A7E8" },
    codeRevealRow: { flexDirection: "row", gap: 8, marginTop: 14 },
    summaryRowWrap: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 22,
      alignSelf: "stretch",
      backgroundColor: "rgba(6,4,24,0.35)",
      borderRadius: 16,
      paddingVertical: 14,
    },
    summaryCell: { flex: 1, alignItems: "center" },
    summaryDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.12)" },
    summaryValue: { fontSize: 22, fontWeight: "900", color: "#FFFFFF" },
    summaryLabel: { marginTop: 2, fontSize: 11.5, color: "#B4A7E8" },
    primaryButton: {
      marginTop: 22,
      alignSelf: "stretch",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      backgroundColor: PURPLE,
      paddingVertical: 15,
      borderRadius: 16,
      shadowColor: PURPLE,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 8,
    },
    primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
    textButton: { marginTop: 10, paddingVertical: 10, paddingHorizontal: 16 },
    textButtonText: { color: "#C4B5FD", fontSize: 14, fontWeight: "600" },

    // ---- exit confirm dialog ----
    exitBackdrop: {
      flex: 1,
      backgroundColor: "rgba(5,3,20,0.75)",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    exitCard: {
      width: "100%",
      maxWidth: 340,
      backgroundColor: c.sheet,
      borderRadius: 24,
      borderWidth: 1.5,
      borderColor: c.pillBorder,
      padding: 22,
      alignItems: "center",
    },
    exitIconWrap: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: RED,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    exitTitle: { color: c.text, fontSize: 22, fontWeight: "900", marginBottom: 6 },
    exitMsg: { color: c.subtext, fontSize: 15, textAlign: "center", marginBottom: 20 },
    exitRow: { flexDirection: "row", gap: 12, width: "100%" },
    exitBtn: { flex: 1, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
    exitNo: { backgroundColor: c.button, borderWidth: 1.5, borderColor: c.buttonBorder },
    exitYes: { backgroundColor: RED, borderBottomWidth: 4, borderBottomColor: "#DC2626" },
    exitNoText: { color: c.text, fontSize: 16, fontWeight: "800" },
    exitYesText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  });
