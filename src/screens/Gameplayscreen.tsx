
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { submitAnswer, getRoundState, quitRound } from "../api/Wordscrambleapi";
import * as WsApi from "../api/Wordscrambleapi";
import { generatePuzzle, WSWordSlot } from "../utils/wordConnectEngine";
import { getWordCountForLevel } from "../utils/levelConfig";
import { fetchCoins, spendHintCoins, claimLevelBonus, claimTimeBoost } from "../api/wordscrambleCoinsApi";
// NEW: Lucky Spin shown after every 5th level (needs: npx expo install react-native-svg)
import LuckySpinWheel from "../components/LuckySpinWheel";
import dictionary from "../data/wordlist.json";
// NEW: sparkle animation + sound effects
import SparkleBurst from "../components/SparkleBurst";
import { playSound, playDragTick, loadSounds } from "../utils/sound";
// NEW: Skip Round power-up + "Great Job" completion popup
import GameCompleteModal from "./GameCompleteModal";
import GiftRewardModal from "./GiftRewardModal";
import { fetchSkipStatus, consumeSkip } from "../api/SkipRoundapi";


const serverHint: ((roundId: string, playerName: string) => Promise<any>) | undefined =
  (WsApi as any).requestHint ?? (WsApi as any).useHint;

interface WSRound {
  id: string | number;
  roundNumber: number;
  totalRounds: number;
  timeLimitSec: number;
  scrambled?: string;
  scrambledWord?: string;
  word?: string;
  words?: WSWordSlot[]; // crossword layout from the backend
  letters?: string[]; // wheel letters from the backend
  [key: string]: any;
}

interface Player {
  player_name: string;
  score: number;
  wordsFound?: number; // NEW: words this player has found (from the backend)
}

interface GamePlayScreenProps {
  playerName: string;
  round: WSRound;
  players: Player[];
  livesLeft: number;
  onRoundEnd: (
    answer: string,
    isCorrect: boolean,
    livesLeft: number,
    opts?: { skipAhead?: number }
  ) => void;
  // Called after the player confirms "Yes" on the quit popup.
  // App.tsx should leave the game and open the Menu screen.
  onQuit?: () => void;
}

/* ---------- Word Scramble SPLASH theme (mint green + cream tiles) ---------- */
const C = {
  bg: "#D9F5E8", // mint background (same as the splash screen)
  card: "#FFFDF7", // creamy cards
  border: "#CFE8DC",
  text: "#0E3B3A", // deep teal text
  sub: "#4F7A74",
  indigo: "#0F9D87", // main accent = splash teal (name kept so the rest of the code works)
  indigoSoft: "#D2F0E6",
  coral: "#FF8A3D", // splash orange
  coralSoft: "#FFE9D6",
  gold: "#E8B04A",
  goldSoft: "#FFF0CF",
  green: "#2FBF71",
  greenSoft: "#DDF5E8",
  red: "#F0566A",
  redSoft: "#FDECEF",
  grey: "#7E968F",
  greySoft: "#E5F2EC",
  tileBg: "#FFF3D6", // cream letter tile
  tileBorder: "#E6C984", // golden tile edge
  tileEdge: "#D9B56B", // thick bottom edge of a tile
  previewBg: "#0E3B3A",
};

const TILE_COLORS = [C.coral, C.indigo, "#3B82F6", C.green, C.gold, C.red];
const MAX_HINTS_PER_ROUND = 3;
const HINT_SCORE_PENALTY = 5;
const MIN_WORDS = 3;
const LINE_W = 10;
const BONUS_PER_LETTER = 5;
const BONUSES_PER_FREE_HINT = 3;
const AUTO_NEXT_MS = 3200; // success screen -> next round automatically (0 = wait for the button)
const ROUND_STATE_POLL_MS = 2500; // how often we check what other players have found

// NEW: wheel geometry constants shared by the component and the styles
// (StyleSheet lives outside the component, so it can't see WHEEL_SIZE).
const WHEEL_SIZE_CONST = 220;
const SHUFFLE_BTN_SIZE = 48;

type ToastKind = "found" | "bonus" | "already" | "wrong" | "clue";
const TOAST_BG: Record<ToastKind, string> = {
  found: C.green,
  bonus: C.gold,
  already: "#E8912D",
  wrong: C.red,
  clue: C.indigo,
};

const CONFETTI_COLORS = [C.coral, C.indigo, C.gold, C.green, "#3B82F6", C.red];

/* =====================================================
   SPLASH-STYLE ANIMATED BACKGROUND
   (mint circles + pulsing rings + floating cream tiles)
===================================================== */

// 0 -> 1 -> 0 loop, used by every background animation
const useLoop = (duration: number, delay = 0) => {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    const timer = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return v;
};

// one floating cream letter tile (like W / O / D / R on the splash screen)
const FloatTile: React.FC<{
  letter: string;
  point: number;
  color: string;
  size: number;
  rotate: number;
  duration: number;
  delay: number;
  style: object;
}> = ({ letter, point, color, size, rotate, duration, delay, style }) => {
  const t = useLoop(duration, delay);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size * 0.26,
          backgroundColor: C.tileBg,
          borderWidth: 2,
          borderColor: C.tileBorder,
          borderBottomWidth: 5,
          borderBottomColor: C.tileEdge,
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.92,
          shadowColor: "#8FB5A5",
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        },
        style,
        {
          transform: [
            { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [-7, 7] }) },
            {
              rotate: t.interpolate({
                inputRange: [0, 1],
                outputRange: [`${rotate - 5}deg`, `${rotate + 5}deg`],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.48, fontWeight: "900", color }}>{letter}</Text>
      <Text style={{ position: "absolute", right: size * 0.12, bottom: size * 0.06, fontSize: size * 0.2, fontWeight: "800", color: C.sub }}>
        {point}
      </Text>
    </Animated.View>
  );
};

// big soft circle that drifts slowly
const DriftCircle: React.FC<{
  size: number;
  color: string;
  top: number;
  left: number;
  dx: number;
  dy: number;
  duration: number;
}> = ({ size, color, top, left, dx, dy, duration }) => {
  const t = useLoop(duration);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        transform: [
          { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, dx] }) },
          { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, dy] }) },
        ],
      }}
    />
  );
};

// ripple ring that breathes in and out
const PulseRing: React.FC<{ size: number; top: number; left: number; delay: number }> = ({ size, top, left, delay }) => {
  const t = useLoop(2800, delay);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: "rgba(15,157,135,0.22)",
        opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
        transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1.04] }) }],
      }}
    />
  );
};

const SplashThemeBackground: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const cx = width / 2;
  const cy = height * 0.42;
  const ringSizes = [width * 0.85, width * 1.2, width * 1.6];
  const tileSize = Math.max(40, Math.min(56, width * 0.12));

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: C.bg, overflow: "hidden" }]}>
      {/* big soft circles (top-left / bottom-right like the splash) */}
      <DriftCircle size={width * 0.9} color="#C6EEDB" top={-width * 0.45} left={-width * 0.3} dx={14} dy={10} duration={7000} />
      <DriftCircle size={width * 0.8} color="#C6EEDB" top={height - width * 0.4} left={width * 0.55} dx={-12} dy={-10} duration={8200} />

      {/* concentric ripple rings */}
      {ringSizes.map((s, i) => (
        <PulseRing key={i} size={s} top={cy - s / 2} left={cx - s / 2} delay={i * 450} />
      ))}

      {/* floating cream letter tiles */}
      <FloatTile letter="W" point={4} color={C.text} size={tileSize} rotate={-8} duration={2600} delay={0}
        style={{ left: width * 0.03, top: height * 0.16 }} />
      <FloatTile letter="O" point={1} color={C.coral} size={tileSize} rotate={10} duration={3000} delay={300}
        style={{ right: width * 0.03, top: height * 0.1 }} />
      <FloatTile letter="D" point={2} color={C.indigo} size={tileSize} rotate={-6} duration={2800} delay={600}
        style={{ left: width * 0.02, bottom: height * 0.14 }} />
      <FloatTile letter="R" point={1} color={C.text} size={tileSize} rotate={8} duration={3200} delay={900}
        style={{ right: width * 0.03, bottom: height * 0.2 }} />
    </View>
  );
};

/* Colour-paper burst used on the round-complete screen */
const Confetti: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const pieces = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => ({
        x: Math.random() * width,
        size: 6 + Math.random() * 8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 600,
        dur: 1800 + Math.random() * 1500,
        drift: (Math.random() - 0.5) * 180,
        rot: 360 * (1 + Math.random() * 2),
        round: Math.random() < 0.35,
        anim: new Animated.Value(0),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    pieces.forEach((p) =>
      Animated.timing(p.anim, {
        toValue: 1,
        duration: p.dur,
        delay: p.delay,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: -20,
            width: p.size,
            height: p.round ? p.size : p.size * 1.6,
            borderRadius: p.round ? p.size / 2 : 2,
            backgroundColor: p.color,
            opacity: p.anim.interpolate({ inputRange: [0, 0.08, 0.85, 1], outputRange: [0, 1, 1, 0] }),
            transform: [
              { translateY: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, height + 40] }) },
              { translateX: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, p.drift] }) },
              { rotate: p.anim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", `${p.rot}deg`] }) },
            ],
          }}
        />
      ))}
    </View>
  );
};



const NavSidebar: React.FC<{ active?: "Home" | "Rankings" | "Profile" }> = ({ active = "Home" }) => {
  const items: { label: "Home" | "Rankings" | "Profile"; icon: keyof typeof Ionicons.glyphMap }[] = [
    { label: "Home", icon: "home" },
    { label: "Rankings", icon: "trophy-outline" },
    { label: "Profile", icon: "person-outline" },
  ];

  return (
    <View style={styles.navSidebar}>
      <View style={styles.navBrandRow}>
        <View style={styles.navLogoBadge}>
          <Text style={styles.navLogoText}>WS</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.navBrandTitle} numberOfLines={1}>
            Word <Text style={{ color: C.indigo }}>Scramble</Text>
          </Text>
          <Text style={styles.navBrandSub} numberOfLines={1}>
            Think fast. Play smart.
          </Text>
        </View>
      </View>

      <View style={styles.navItems}>
        {items.map((item) => {
          const isActive = item.label === active;
          return (
            <View key={item.label} style={[styles.navItem, isActive && styles.navItemActive]}>
              <View style={[styles.navIconWrap, isActive && styles.navIconWrapActive]}>
                <Ionicons name={item.icon} size={16} color={isActive ? "#FFFFFF" : C.sub} />
              </View>
              <Text style={[styles.navItemText, isActive && styles.navItemTextActive]}>{item.label}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.navBottomCard}>
        <View style={styles.navBottomIconWrap}>
          <Ionicons name="sparkles" size={20} color="#FFFFFF" />
        </View>
        <Text style={styles.navBottomText}>Keep the streak going!</Text>
      </View>
    </View>
  );
};



const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

// NEW: Fisher-Yates shuffle, used for the initial wheel order of every round.
const shuffleArray = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

type GridCellData = { letter: string; wordIdx: number[] } | null;

const buildGrid = (slots: WSWordSlot[]) => {
  if (slots.length === 0) return [] as GridCellData[][];
  let maxRow = 0;
  let maxCol = 0;
  slots.forEach((w) => {
    const len = w.word.length;
    if (w.direction === "across") {
      maxRow = Math.max(maxRow, w.row);
      maxCol = Math.max(maxCol, w.col + len - 1);
    } else {
      maxRow = Math.max(maxRow, w.row + len - 1);
      maxCol = Math.max(maxCol, w.col);
    }
  });
  const grid: GridCellData[][] = Array.from({ length: maxRow + 1 }, () =>
    Array<GridCellData>(maxCol + 1).fill(null)
  );
  slots.forEach((w, wi) => {
    for (let k = 0; k < w.word.length; k++) {
      const r = w.direction === "across" ? w.row : w.row + k;
      const c = w.direction === "across" ? w.col + k : w.col;
      const letter = w.word[k].toUpperCase();
      if (!grid[r][c]) grid[r][c] = { letter, wordIdx: [wi] };
      else grid[r][c]!.wordIdx.push(wi);
    }
  });
  return grid;
};

const cellKey = (r: number, c: number) => `${r}-${c}`;

const cellsForWord = (w: WSWordSlot) => {
  const cells: { r: number; c: number }[] = [];
  for (let k = 0; k < w.word.length; k++) {
    const r = w.direction === "across" ? w.row : w.row + k;
    const c = w.direction === "across" ? w.col + k : w.col;
    cells.push({ r, c });
  }
  return cells;
};

// A layout is only trusted if it is a real crossword: >= MIN_WORDS words, every
// word >= 3 letters, spellable from the wheel, and no two same-direction words overlap.
const isValidLayout = (slots: WSWordSlot[] | undefined, pool: string[], minWords = MIN_WORDS) => {
  if (!slots || slots.length < minWords) return false;
  const have: Record<string, number> = {};
  pool.forEach((l) => (have[l] = (have[l] || 0) + 1));

  const seen = new Set<string>();
  for (const s of slots) {
    const w = s.word.toUpperCase();
    if (w.length < 3) return false;

    const used: Record<string, number> = {};
    for (const ch of w) {
      used[ch] = (used[ch] || 0) + 1;
      if (used[ch] > (have[ch] || 0)) return false;
    }
    for (let k = 0; k < w.length; k++) {
      const r = s.direction === "across" ? s.row : s.row + k;
      const c = s.direction === "across" ? s.col + k : s.col;
      const id = `${r},${c},${s.direction}`;
      if (seen.has(id)) return false;
      seen.add(id);
    }
  }
  return true;
};



// CHANGED: GridCell now accepts `sparkle` + `onSparkleDone` and renders the
// SparkleBurst (minnal + sparkles) on top of the cell when a hint fills it.
const GridCell: React.FC<{
  letter: string;
  state: "blank" | "revealed" | "found";
  delay: number;
  sparkle?: boolean;
  onSparkleDone?: () => void;
}> = ({ letter, state, delay, sparkle, onSparkleDone }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const prev = useRef(state);

  useEffect(() => {
    if (prev.current !== state && state !== "blank") {
      scale.setValue(0.2);
      opacity.setValue(0);
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, friction: 4, tension: 140, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 140, useNativeDriver: true }),
        ]),
      ]).start();
    }
    prev.current = state;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <View
      style={[
        styles.gridCell,
        state === "blank" && styles.gridCellBlank,
        state === "found" && styles.gridCellFilled,
        state === "revealed" && styles.gridCellRevealed,
      ]}
    >
      {state !== "blank" && (
        <Animated.View style={{ opacity, transform: [{ scale }] }}>
          <Text style={styles.gridLetter}>{letter}</Text>
        </Animated.View>
      )}
      {sparkle ? <SparkleBurst size={34} onDone={onSparkleDone} /> : null}
    </View>
  );
};

/* =====================================================
   MAIN SCREEN
===================================================== */

const GamePlayScreen: React.FC<GamePlayScreenProps> = ({
  playerName,
  round,
  players,
  livesLeft,
  onRoundEnd,
  onQuit,
}) => {
  const { width } = useWindowDimensions();
  const wide = width >= 900;

  // ---- Letter pool ----
  const letters = useMemo(() => {
    const pool =
      round.letters && round.letters.length > 0
        ? round.letters
        : (round.scrambled ?? round.scrambledWord ?? round.word ?? "").toString().split("");
    return pool.map((l) => l.toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.id]);

  // ---- Puzzle layout: trust the backend only if it is a real crossword ----
  const usesBackendLayout = isValidLayout(round.words, letters, 1);

  // How many words the crossword should contain, driven by the level
  // (round.roundNumber). See utils/levelConfig.ts
  //   Level 1–5   -> 2 words
  //   Level 6–15  -> 3 words
  //   Level 16–30 -> 4 words
  //   Level 31–50 -> 5 words
  const wordSlots: WSWordSlot[] = useMemo(() => {
    if (round.words && isValidLayout(round.words, letters, 1)) return round.words;
    const wordCount = getWordCountForLevel(round.roundNumber);
    return generatePuzzle(letters, dictionary as string[], wordCount, round.word);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.id]);

  const grid = useMemo(() => buildGrid(wordSlots), [wordSlots]);

  // CHANGED: the wheel order starts shuffled (not 0,1,2,...) so the letters
  // never appear in the answer order on the very first frame.
  const [letterOrder, setLetterOrder] = useState<number[]>(() =>
    shuffleArray(letters.map((_, i) => i))
  );
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [foundWordIdx, setFoundWordIdx] = useState<Set<number>>(new Set());
  const [lastFoundIdx, setLastFoundIdx] = useState<number | null>(null);
  const [roundScore, setRoundScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [bonusFound, setBonusFound] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ text: string; kind: ToastKind } | null>(null);
  const [timeLeft, setTimeLeft] = useState(round.timeLimitSec);
  const [showSuccess, setShowSuccess] = useState(false);
  // shown when the timer hits 0 instead of silently doing nothing
  const [showTimeUp, setShowTimeUp] = useState(false);
  // pause: true while the quit popup is open (also blocks timer / polling / touches)
  const [paused, setPaused] = useState(false);
  // FIX: locks the page ScrollView while the player drags on the letter wheel (mobile)
  const [scrollLocked, setScrollLocked] = useState(false);
  const [resultLivesLeft, setResultLivesLeft] = useState(livesLeft);

  const [revealedCells, setRevealedCells] = useState<Record<string, boolean>>({});
  const [hintsLeft, setHintsLeft] = useState(MAX_HINTS_PER_ROUND);
  const [hintBusy, setHintBusy] = useState(false);

  // NEW: how many words THIS player has found in the whole game (from the backend)
  const [myWordsFound, setMyWordsFound] = useState(0);

  // NEW: "Are you sure you want to quit?" popup
  const [showQuit, setShowQuit] = useState(false);
  const [quitBusy, setQuitBusy] = useState(false);

  // NEW: cells that should play the sparkle burst right now (hint fills)
  const [sparkleCells, setSparkleCells] = useState<Record<string, boolean>>({});
  const triggerSparkle = (key: string) => {
    playSound("sparkle");
    setSparkleCells((p) => ({ ...p, [key]: true }));
  };
  // NEW: preload sound effects once
  useEffect(() => {
    loadSounds();
  }, []);

  // NEW: Skip Round power-up (count is stored in the DB)
  const [skips, setSkips] = useState(0);
  const [skipBusy, setSkipBusy] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  // NEW: coin wallet (source of truth is the backend DB)
  const [coins, setCoins] = useState(0);
  const [hintTokens, setHintTokens] = useState(0);
  const [roundReward, setRoundReward] = useState(0);
  const [roundThreeGift, setRoundThreeGift] = useState(0);
  const [giftClosed, setGiftClosed] = useState(false);
  const [claimDone, setClaimDone] = useState(false);
  const [levelBonus, setLevelBonus] = useState(0); // 5-level bonus shown on success screen
  const [showSpin, setShowSpin] = useState(false);
  const [spinDone, setSpinDone] = useState(false);

  // Live scoreboard. Seeded from the `players` prop, then kept in sync by
  // the round-state poll below so everyone's score updates without a
  // parent-screen refresh.
  const [livePlayers, setLivePlayers] = useState<Player[]>(players);

  const shakeX = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.4)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const giftOpenScale = useRef(new Animated.Value(0.35)).current;
  // separate animated values for the time's-up overlay
  const timeUpScale = useRef(new Animated.Value(0.4)).current;
  const timeUpOpacity = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const barPulse = useRef(new Animated.Value(1)).current;
  const advancedRef = useRef(false);

  // ---- Multiplayer sync (polling, no sockets) ----
  const pollInFlightRef = useRef(false);
  const knownFoundWordsRef = useRef<Set<string>>(new Set());

  const dictSet = useMemo(() => new Set((dictionary as string[]).map((w) => String(w).toLowerCase())), []);

  const longestUnsolvedLen = useMemo(() => {
    const remaining = wordSlots.filter((_, i) => !foundWordIdx.has(i));
    return remaining.reduce((max, w) => Math.max(max, w.word.length), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foundWordIdx, wordSlots]);

  const allFound = wordSlots.length > 0 && foundWordIdx.size === wordSlots.length;

  // NEW: last round of the set -> "Great Job" popup
  // (declared BEFORE isSpinLevel because isSpinLevel depends on it)
  const isFinalLevel = round.totalRounds > 0 && round.roundNumber === round.totalRounds;
  // CHANGED: levels 5, 10, 15... end with a Lucky Spin, EXCEPT the final level
  // (round 10) -> there it goes straight to Finish -> Great Job popup (Skip).
  const isSpinLevel = round.roundNumber > 0 && round.roundNumber % 5 === 0 && !isFinalLevel;

  // ---- Wheel geometry ----
  const WHEEL_SIZE = WHEEL_SIZE_CONST;
  const TILE_SIZE = 58;
  const center = WHEEL_SIZE / 2;
  const radius = letters.length <= 6 ? 78 : 92;

  const tilePosition = (slotIndex: number, total: number) => {
    const angle = (2 * Math.PI * slotIndex) / total - Math.PI / 2;
    return {
      left: center + radius * Math.cos(angle) - TILE_SIZE / 2,
      top: center + radius * Math.sin(angle) - TILE_SIZE / 2,
    };
  };

  // CHANGED: initial animated positions follow the (shuffled) letterOrder,
  // so tile `letterIndex` sits at the circle slot it occupies in letterOrder.
  const tileAnim = useRef<Animated.ValueXY[]>([]);
  if (tileAnim.current.length !== letters.length) {
    tileAnim.current = letters.map((_, letterIndex) => {
      const slot = Math.max(0, letterOrder.indexOf(letterIndex));
      const pos = tilePosition(slot, letters.length);
      return new Animated.ValueXY({ x: pos.left, y: pos.top });
    });
  }

  const isDraggingRef = useRef(false);
  const selRef = useRef<number[]>([]);
  const letterOrderRef = useRef<number[]>(letterOrder);
  letterOrderRef.current = letterOrder;

  const updateSel = (next: number[]) => {
    selRef.current = next;
    setSelectedIndices(next);
  };

  // ---- Round reset ----
  useEffect(() => {
    // CHANGED: every new round starts with the wheel already shuffled.
    // `order[slot] = letterIndex`, so tile `letterIndex` is placed at `slot`.
    const order = shuffleArray(letters.map((_, i) => i));
    setLetterOrder(order);
    letterOrderRef.current = order;
    order.forEach((letterIndex, slotIndex) => {
      const pos = tilePosition(slotIndex, letters.length);
      tileAnim.current[letterIndex]?.setValue({ x: pos.left, y: pos.top });
    });

    isDraggingRef.current = false;
    setScrollLocked(false);
    updateSel([]);
    setFoundWordIdx(new Set());
    knownFoundWordsRef.current = new Set();
    setLastFoundIdx(null);
    setRoundScore(0);
    setBonusFound(new Set());
    setToast(null);
    progressAnim.setValue(0);
    advancedRef.current = false;
    setTimeLeft(round.timeLimitSec);
    setShowSuccess(false);
    successScale.setValue(0.4);
    successOpacity.setValue(0);
    // reset the time's-up overlay and pause state for every new round
    setShowTimeUp(false);
    timeUpScale.setValue(0.4);
    timeUpOpacity.setValue(0);
    setPaused(false);
    setShowQuit(false);
    setQuitBusy(false);

    const initialReveal: Record<string, boolean> = {};
    if (Array.isArray(round.revealedCells) && round.revealedCells.length > 0) {
      round.revealedCells.forEach((c: any) => {
        if (typeof c?.row === "number" && typeof c?.col === "number") initialReveal[cellKey(c.row, c.col)] = true;
      });
    } else {
      wordSlots.forEach((w) => {
        const cells = cellsForWord(w);
        const pick = cells[Math.floor(Math.random() * cells.length)];
        initialReveal[cellKey(pick.r, pick.c)] = true;
      });
    }
    setRevealedCells(initialReveal);
    setSparkleCells({});
    setHintsLeft(MAX_HINTS_PER_ROUND);
    setHintBusy(false);
    setRoundReward(0);
    setRoundThreeGift(0);
    setGiftClosed(false);
    setClaimDone(false);
    giftOpenScale.setValue(0.35);
    setLevelBonus(0);
    setShowSpin(false);
    setSpinDone(false);
    setShowComplete(false);
    setSkipBusy(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.id]);

  // Time's Up overlay with a Try Again button; only reports back to the
  // parent when the player taps it.
  useEffect(() => {
    if (showSuccess || showTimeUp || paused) return;
    if (timeLeft <= 0) {
      setShowTimeUp(true);
      playTimeUpAnimation();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, showSuccess, showTimeUp, paused]);

  // Grid completely filled -> let the fill animation play, THEN show round complete.
  useEffect(() => {
    if (allFound && !showSuccess) {
      const t = setTimeout(() => {
        setShowSuccess(true);
        playSuccessAnimation();
      }, 1100);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFound]);

  const playSuccessAnimation = () => {
    successScale.setValue(0.4);
    successOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(successScale, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }),
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // mirrors playSuccessAnimation for the time's-up overlay
  const playTimeUpAnimation = () => {
    timeUpScale.setValue(0.4);
    timeUpOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(timeUpScale, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }),
      Animated.timing(timeUpOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const playShake = () => {
    shakeX.setValue(0);
    Animated.sequence([
      Animated.timing(shakeX, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const pulseBar = () => {
    barPulse.setValue(1);
    Animated.sequence([
      Animated.timing(barPulse, { toValue: 1.9, duration: 120, useNativeDriver: true }),
      Animated.spring(barPulse, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
    ]).start();
  };

  const showToast = (text: string, kind: ToastKind) => {
    setToast({ text, kind });
    toastAnim.stopAnimation();
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.spring(toastAnim, { toValue: 1, friction: 5, tension: 140, useNativeDriver: true }),
      Animated.delay(900),
      Animated.timing(toastAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
    if (kind === "wrong" || kind === "already") playShake();
  };

  /* ---------- Found a word (BY ME) ---------- */
  const handleFoundWord = async (matchIdx: number, auto = false) => {
    if (!wordSlots[matchIdx]) return;
    const word = wordSlots[matchIdx].word;
    knownFoundWordsRef.current.add(word.toUpperCase());
    setSubmitting(true);
    setLastFoundIdx(matchIdx);
    setFoundWordIdx((prev) => new Set(prev).add(matchIdx));
    setRoundScore((s) => s + word.length * 10);
    pulseBar();
    if (!auto) showToast(`Nice!  +${word.length * 10}`, "found");

    try {
      const timeTaken = Math.max(0, round.timeLimitSec - timeLeft);
      const result = await submitAnswer(String(round.id), playerName, word.toLowerCase(), timeTaken);
      if (typeof result?.livesLeft === "number") setResultLivesLeft(result.livesLeft);
      // NEW: the backend counted this word -> update the "Words" chip at the top
      if (typeof result?.myWordsFound === "number") setMyWordsFound(result.myWordsFound);
      if (typeof result?.points === "number") {
        setRoundScore((s) => s - word.length * 10 + result.points);
      }
    } catch (error) {
      console.warn("submitAnswer failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const applyRemoteFound = (matchIdx: number, foundBy: string) => {
    if (!wordSlots[matchIdx]) return;
    if (foundWordIdx.has(matchIdx)) return;
    setLastFoundIdx(matchIdx);
    setFoundWordIdx((prev) => new Set(prev).add(matchIdx));
    pulseBar();
    if (foundBy && foundBy !== playerName) {
      showToast(`${foundBy} found ${wordSlots[matchIdx].word}!`, "found");
    }
  };

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      // don't poll while the round is paused or already resolved
      if (pollInFlightRef.current || showSuccess || showTimeUp || paused) return;
      pollInFlightRef.current = true;
      try {
        const state = await getRoundState(String(round.id), playerName);
        if (cancelled) return;

        state.foundWords.forEach(({ word, foundBy }: { word: string; foundBy: string }) => {
          const key = word.toUpperCase();
          if (knownFoundWordsRef.current.has(key)) return;
          const idx = wordSlots.findIndex((w) => w.word.toUpperCase() === key);
          if (idx !== -1) {
            knownFoundWordsRef.current.add(key);
            applyRemoteFound(idx, foundBy);
          }
        });

        if (Array.isArray(state.revealedCells) && state.revealedCells.length > 0) {
          setRevealedCells((prev) => {
            const next = { ...prev };
            state.revealedCells.forEach((c: { row: number; col: number }) => {
              next[cellKey(c.row, c.col)] = true;
            });
            return next;
          });
        }

        if (typeof state.hintsLeftForPlayer === "number") setHintsLeft(state.hintsLeftForPlayer);
        if (typeof state.livesLeft === "number") setResultLivesLeft(state.livesLeft);

        // NEW: my total words found (backend counts it from the DB)
        if (typeof state.myWordsFound === "number") setMyWordsFound(state.myWordsFound);

        if (Array.isArray(state.players)) {
          setLivePlayers(
            state.players.map((p: { player_name: string; score: number; wordsFound?: number }) => ({
              player_name: p.player_name,
              score: p.score,
              wordsFound: p.wordsFound ?? 0,
            }))
          );
        }
      } catch (err) {
        console.warn("Round state poll failed:", err);
      } finally {
        pollInFlightRef.current = false;
      }
    };

    poll();
    const interval = setInterval(poll, ROUND_STATE_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.id, showSuccess, showTimeUp, paused]);

  /* ---------- Coins: frontend -> backend -> DB -> JSON back ---------- */

  // Load the wallet balance when the screen opens
  useEffect(() => {
    let cancelled = false;
    fetchCoins(playerName)
      .then((res) => {
        if (cancelled || !res?.success) return;
        setCoins(res.coins);
        setHintTokens(res.hintTokens ?? 0);
      })
      .catch((e) => console.warn("fetchCoins failed:", e));
    return () => {
      cancelled = true;
    };
  }, [playerName]);

  // Every hint / clue costs coins. Returns true only if the backend charged it.
  const payForHint = async (): Promise<boolean> => {
    try {
      const res = await spendHintCoins(playerName, String(round.id));
      if (res?.success) {
        setCoins(res.coins);
        setHintTokens(res.hintTokens ?? 0);
        if (res.usedToken) showToast("Bonus clue used", "clue");
        return true;
      }
      if (typeof res?.coins === "number") setCoins(res.coins);
      if (typeof res?.hintTokens === "number") setHintTokens(res.hintTokens);
      if (res?.insufficient) showToast(`Need ${res.cost ?? 5} coins`, "wrong");
      else showToast("Couldn't use hint", "wrong");
      return false;
    } catch (e) {
      console.warn("spendHintCoins failed:", e);
      showToast("Network error", "wrong");
      return false;
    }
  };

  // Every fifth completed round grants 30 coins.
  useEffect(() => {
    if (!showSuccess) return;
    let cancelled = false;
    claimLevelBonus(playerName, String(round.id), round.roundNumber)
      .then((res) => {
        if (cancelled || !res?.success) return;
        setCoins(res.coins);
        setHintTokens(res.hintTokens ?? 0);
        setRoundReward(res.roundReward ?? 0);
        setRoundThreeGift(res.giftBonus ?? 0);
        if ((res.giftBonus ?? 0) > 0) {
          giftOpenScale.setValue(0.35);
          Animated.spring(giftOpenScale, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }).start();
        }
        if (res.bonusGranted && (res.bonus ?? 0) > 0) setLevelBonus(res.bonus as number);
      })
      .catch((e) => console.warn("claimLevelBonus failed:", e))
      .finally(() => {
        if (!cancelled) setClaimDone(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess]);

  // NEW: extra seconds won on the Lucky Spin are added when the next round starts.
  // (No "cancelled" flag on purpose: the backend clears the seconds when it hands them over.)
  useEffect(() => {
    claimTimeBoost(playerName, String(round.id))
      .then((res) => {
        if (!res?.success) return;
        if ((res.seconds ?? 0) > 0) {
          setTimeLeft((t) => t + (res.seconds as number));
          showToast(`+${res.seconds}s time boost!`, "bonus");
        }
      })
      .catch((e) => console.warn("claimTimeBoost failed:", e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.id]);

  // NEW: load how many skips the player owns
  useEffect(() => {
    let cancelled = false;
    fetchSkipStatus(playerName)
      .then((res) => {
        if (!cancelled && res?.success) setSkips(res.skips);
      })
      .catch((e) => console.warn("fetchSkipStatus failed:", e));
    return () => {
      cancelled = true;
    };
  }, [playerName]);

  // NEW: use one skip token -> backend deducts it, then we jump to the next round
  const handleSkipRound = async () => {
    if (skipBusy || skips <= 0 || paused || showSuccess || showTimeUp || advancedRef.current) return;
    setSkipBusy(true);
    try {
      const res = await consumeSkip(playerName, String(round.id), round.roundNumber);
      if (res?.success) {
        setSkips(res.skips);
        playSound("whoosh");
        advancedRef.current = true;
        onRoundEnd(wordSlots.map((w) => w.word).join(","), true, resultLivesLeft);
      } else {
        if (typeof res?.skips === "number") setSkips(res.skips);
        showToast(res?.insufficient ? "No skips left" : "Couldn't skip", "wrong");
      }
    } catch (e) {
      console.warn("consumeSkip failed:", e);
      showToast("Network error", "wrong");
    } finally {
      setSkipBusy(false);
    }
  };

  /* ---------- Exit / Quit game ---------- */

  // Exit button (top-right) -> pause the game and ask "Are you sure?"
  const openQuit = () => {
    if (showSuccess || showTimeUp || advancedRef.current || showQuit) return;
    isDraggingRef.current = false;
    setScrollLocked(false);
    updateSel([]);
    setPaused(true);
    setShowQuit(true);
  };

  // "No" -> close the popup and continue the game
  const cancelQuit = () => {
    if (quitBusy) return;
    setShowQuit(false);
    setPaused(false);
  };

  // "Yes" -> frontend sends the request, backend saves the quit in the DB and
  // replies with JSON, then we leave the game screen: App.tsx's onQuit opens
  // the Menu screen.
  const confirmQuit = async () => {
    if (quitBusy) return;
    setQuitBusy(true);

    try {
      await quitRound(String(round.id), playerName);
    } catch (e) {
      // even if the network fails the player still leaves the game
      console.warn("quitRound failed:", e);
    }

    // block any further round callbacks (timer / polling) while we leave
    advancedRef.current = true;
    setShowQuit(false);
    setPaused(false);

    // leave the game (App.tsx must navigate to the Menu screen).
    // No setQuitBusy(false) here: this screen unmounts after onQuit.
    if (onQuit) {
      onQuit();
    } else {
      console.warn("GamePlayScreen: onQuit prop is missing. Pass onQuit from App.tsx to open the Menu screen.");
      setQuitBusy(false);
    }
  };

  // Android hardware back button behaves like Exit (real-app feel).
  // A ref keeps the handler fresh without re-subscribing every render.
  const backPressRef = useRef<() => boolean>(() => false);
  backPressRef.current = () => {
    if (showQuit) {
      cancelQuit();
      return true;
    }
    if (showSuccess || showTimeUp || showComplete || showSpin) return false;
    openQuit();
    return true;
  };
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => backPressRef.current());
    return () => sub.remove();
  }, []);

  const wheelRef = useRef<View>(null);
  const wheelOrigin = useRef({ x: 0, y: 0 });

  // FIX: on native we use locationX/locationY (already relative to the wheel),
  // so no origin is needed. Origin is only needed on web (clientX/clientY).
  const refreshOrigin = () => {
    if (Platform.OS !== "web") return;
    const node: any = wheelRef.current;
    if (node?.getBoundingClientRect) {
      const r = node.getBoundingClientRect();
      wheelOrigin.current = { x: r.left, y: r.top };
    }
  };

  const tileAt = (px: number, py: number): number | null => {
    const lx = px - wheelOrigin.current.x;
    const ly = py - wheelOrigin.current.y;
    const order = letterOrderRef.current;
    for (let slot = 0; slot < order.length; slot++) {
      const pos = tilePosition(slot, order.length);
      const cx = pos.left + TILE_SIZE / 2;
      const cy = pos.top + TILE_SIZE / 2;
      if (Math.hypot(lx - cx, ly - cy) <= TILE_SIZE * 0.45) return order[slot];
    }
    return null;
  };

  // CHANGED: plays a tick sound (rising pitch) every time a new letter is
  // added to the selection, and a lower tick when you drag back to undo one.
  const extendTo = (letterIndex: number) => {
    const prev = selRef.current;
    if (prev.length === 0) return updateSel([letterIndex]);
    const last = prev[prev.length - 1];
    if (last === letterIndex) return;
    if (prev.length > 1 && prev[prev.length - 2] === letterIndex) {
      playDragTick(prev.length - 2);
      return updateSel(prev.slice(0, -1));
    }
    if (prev.includes(letterIndex)) return;
    if (prev.length >= longestUnsolvedLen) return;
    playDragTick(prev.length);
    updateSel([...prev, letterIndex]);
  };

  const handleDragStart = (px: number, py: number) => {
    // block interaction while paused, or while a result overlay is up
    if (submitting || showSuccess || showTimeUp || paused) return;
    refreshOrigin();
    const idx = tileAt(px, py);
    if (idx === null) return;
    playDragTick(0); // NEW: first letter sound
    setScrollLocked(true); // FIX: stop the page from scrolling while dragging on the wheel
    isDraggingRef.current = true;
    updateSel([idx]);
  };

  const handleDragMove = (px: number, py: number) => {
    if (!isDraggingRef.current) return;
    const idx = tileAt(px, py);
    if (idx !== null) extendTo(idx);
  };

  const finishSelection = () => {
    setScrollLocked(false); // FIX: always unlock the scroll when the finger lifts
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const sel = selRef.current;
    updateSel([]);
    if (sel.length === 0) return;

    const attempt = sel.map((i) => letters[i]).join("").toLowerCase();
    if (attempt.length < 2) return;

    const gridIdx = wordSlots.findIndex((w) => w.word.toLowerCase() === attempt);
    if (gridIdx !== -1) {
      if (foundWordIdx.has(gridIdx)) showToast("Already found!", "already");
      else handleFoundWord(gridIdx);
      return;
    }

    if (attempt.length >= 3 && dictSet.has(attempt)) {
      if (bonusFound.has(attempt)) {
        showToast("Already found!", "already");
        return;
      }
      const pts = attempt.length * BONUS_PER_LETTER;
      const nextCount = bonusFound.size + 1;
      setBonusFound((prev) => new Set(prev).add(attempt));
      setRoundScore((s) => s + pts);
      pulseBar();
      if (nextCount % BONUSES_PER_FREE_HINT === 0) {
        setHintsLeft((h) => h + 1);
        showToast(`Bonus!  +${pts}  +1 hint`, "bonus");
      } else {
        showToast(`Bonus word!  +${pts}`, "bonus");
      }
      return;
    }

    showToast("Not a word", "wrong");
  };

  const moveRef = useRef(handleDragMove);
  moveRef.current = handleDragMove;
  const finishRef = useRef(finishSelection);
  finishRef.current = finishSelection;

  // FIX: native -> locationX/locationY (position inside the wheel view)
  //      web    -> clientX/clientY (+ wheelOrigin from getBoundingClientRect)
  const getPoint = (e: any) => {
    const ne = e.nativeEvent ?? e;
    const t = ne.touches?.[0] ?? ne.changedTouches?.[0] ?? ne;
    if (Platform.OS !== "web") {
      return { x: t.locationX ?? ne.locationX ?? 0, y: t.locationY ?? ne.locationY ?? 0 };
    }
    return { x: t.clientX ?? t.pageX, y: t.clientY ?? t.pageY };
  };

  const touchHandlers = {
    onTouchStart: (e: any) => {
      const p = getPoint(e);
      handleDragStart(p.x, p.y);
    },
    onTouchMove: (e: any) => {
      const p = getPoint(e);
      moveRef.current(p.x, p.y);
    },
    onTouchEnd: () => finishRef.current(),
    onTouchCancel: () => finishRef.current(),
  };

  const webMouseHandlers =
    Platform.OS === "web"
      ? ({
          onMouseDown: (e: any) => {
            e.preventDefault?.();
            const p = getPoint(e);
            handleDragStart(p.x, p.y);
          },
        } as any)
      : {};

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    const onMove = (e: MouseEvent) => moveRef.current(e.clientX, e.clientY);
    const onUp = () => finishRef.current();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("blur", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("blur", onUp);
    };
  }, []);

  // ---------- Shuffle ----------
  const shuffleLetters = () => {
    // no shuffling while paused
    if (submitting || showSuccess || showTimeUp || paused || isDraggingRef.current) return;
    const shuffled = shuffleArray(letterOrderRef.current);
    shuffled.forEach((letterIndex, slotIndex) => {
      const pos = tilePosition(slotIndex, shuffled.length);
      const anim = tileAnim.current[letterIndex];
      if (!anim) return;
      Animated.timing(anim, {
        toValue: { x: pos.left, y: pos.top },
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
        delay: slotIndex * 25,
      }).start();
    });
    letterOrderRef.current = shuffled;
    setLetterOrder(shuffled);
  };

  // ---------- Hints ----------
  const revealRandomLetterLocal = () => {
    if (hintsLeft <= 0 || submitting || showSuccess || showTimeUp || paused) return;
    const candidates: string[] = [];
    wordSlots.forEach((w, wi) => {
      if (foundWordIdx.has(wi)) return;
      cellsForWord(w).forEach(({ r, c }) => {
        const key = cellKey(r, c);
        if (!revealedCells[key]) candidates.push(key);
      });
    });
    if (candidates.length === 0) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    setRevealedCells((prev) => ({ ...prev, [pick]: true }));
    triggerSparkle(pick); // NEW: minnal + sparkle + sound
    setHintsLeft((h) => Math.max(0, h - 1));
    setRoundScore((s) => Math.max(0, s - HINT_SCORE_PENALTY));
  };

  // Reveals one letter, spends one hint, and takes HINT_SCORE_PENALTY off the round score.
  const revealRandomLetter = async () => {
    // hints disabled while paused
    if (hintsLeft <= 0 || submitting || showSuccess || showTimeUp || paused || hintBusy) return;

    // don't charge coins if there is nothing left to reveal
    const hasTarget = wordSlots.some(
      (w, wi) => !foundWordIdx.has(wi) && cellsForWord(w).some(({ r, c }) => !revealedCells[cellKey(r, c)])
    );
    if (!hasTarget) return;

    // NEW: hint costs coins (backend deducts + stores it). Stop if not affordable.
    setHintBusy(true);
    const paid = await payForHint();
    if (!paid) {
      setHintBusy(false);
      return;
    }

    if (!usesBackendLayout || !serverHint) {
      setHintBusy(false);
      revealRandomLetterLocal();
      return;
    }

    try {
      const result = await serverHint(String(round.id), playerName);
      const revealed = result?.revealed;

      const validCell =
        !!revealed &&
        typeof revealed.row === "number" &&
        typeof revealed.col === "number" &&
        !!grid[revealed.row]?.[revealed.col];

      if (!validCell) {
        revealRandomLetterLocal();
        return;
      }

      setRevealedCells((prev) => ({ ...prev, [cellKey(revealed.row, revealed.col)]: true }));
      triggerSparkle(cellKey(revealed.row, revealed.col)); // NEW: minnal + sparkle + sound

      if (typeof result?.hintsLeft === "number") setHintsLeft(result.hintsLeft);
      else setHintsLeft((h) => Math.max(0, h - 1));

      const penalty = typeof result?.scorePenalty === "number" ? result.scorePenalty : HINT_SCORE_PENALTY;
      setRoundScore((s) => Math.max(0, s - penalty));
    } catch (error) {
      console.warn("Server hint failed, using local reveal instead:", error);
      revealRandomLetterLocal();
    } finally {
      setHintBusy(false);
    }
  };

  const currentWord = selectedIndices.map((i) => letters[i]).join("");

  const handleContinue = () => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    onRoundEnd(wordSlots.map((w) => w.word).join(","), true, resultLivesLeft);
  };

  // "Skip Round" on the Great Job popup (skip token already spent by the modal):
  // round (N+1) is skipped and the game continues at round (N+2).
  const handleSkipAfterSet = () => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    setShowComplete(false);
    onRoundEnd(wordSlots.map((w) => w.word).join(","), true, resultLivesLeft, { skipAhead: 1 });
  };

  // Called when the player taps "Try Again" on the time's-up overlay.
  // Reports isCorrect=false so App.tsx can decide (lose a life, then either
  // reload this same round or send the player to Game Over).
  const handleTimeUpContinue = () => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    onRoundEnd(wordSlots.map((w) => w.word).join(","), false, resultLivesLeft);
  };

  useEffect(() => {
    if (showSuccess || wordSlots.length === 0) return;
    if (foundWordIdx.size === 0 && hintsLeft === MAX_HINTS_PER_ROUND) return;
    wordSlots.forEach((w, i) => {
      if (foundWordIdx.has(i)) return;
      const allVisible = cellsForWord(w).every(({ r, c }) => {
        const cell = grid[r]?.[c];
        return !!revealedCells[cellKey(r, c)] || (!!cell && cell.wordIdx.some((wi) => foundWordIdx.has(wi)));
      });
      if (allVisible) handleFoundWord(i, true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foundWordIdx, revealedCells]);

  useEffect(() => {
    if (!showSuccess || AUTO_NEXT_MS <= 0) return;
    if (isSpinLevel || isFinalLevel) return; // wait for the Lucky Spin / final summary
    if (!claimDone) return; // wait until we know whether a gift was won
    const giftPending = roundThreeGift > 0 && !giftClosed;
    if (giftPending) return; // do NOT move on until the gift is opened
    const t = setTimeout(handleContinue, giftClosed ? 700 : AUTO_NEXT_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess, claimDone, roundThreeGift, giftClosed]);

  const timeLow = timeLeft <= 10;
  const progressPct = wordSlots.length > 0 ? (foundWordIdx.size / wordSlots.length) * 100 : 0;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPct,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressPct]);

  const centerOf = (letterIndex: number) => {
    const slot = Math.max(0, letterOrder.indexOf(letterIndex));
    const p = tilePosition(slot, letterOrder.length);
    return { x: p.left + TILE_SIZE / 2, y: p.top + TILE_SIZE / 2 };
  };

  const trail =
    selectedIndices.length > 1
      ? selectedIndices.slice(1).map((li, i) => {
          const a = centerOf(selectedIndices[i]);
          const b = centerOf(li);
          const len = Math.hypot(b.x - a.x, b.y - a.y);
          const angle = Math.atan2(b.y - a.y, b.x - a.x);
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          return (
            <View
              key={`seg-${i}`}
              pointerEvents="none"
              style={{
                position: "absolute",
                left: mx - len / 2,
                top: my - LINE_W / 2,
                width: len,
                height: LINE_W,
                borderRadius: LINE_W / 2,
                backgroundColor: C.coral,
                opacity: 0.85,
                transform: [{ rotate: `${angle}rad` }],
              }}
            />
          );
        })
      : null;

  // if this round's data came back without usable letters/words, show a
  // friendly recovery screen instead of a blank white screen.
  const noPuzzleData = letters.length === 0 || wordSlots.length === 0;

  if (noPuzzleData) {
    return (
      <View style={styles.flex}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <SplashThemeBackground />
        <SafeAreaView style={styles.flex}>
          <View style={styles.successContainer}>
            <View style={styles.successContent}>
              <View style={[styles.successCircle, { backgroundColor: C.red }]}>
                <Ionicons name="alert-circle-outline" size={56} color="#FFFFFF" />
              </View>
              <Text style={styles.congratsText}>Couldn't load this round</Text>
              <Text style={styles.correctText}>The puzzle data looks incomplete. Please try again.</Text>
              <Pressable
                style={[styles.nextRoundButton, { backgroundColor: C.red }]}
                onPress={handleTimeUpContinue}
              >
                <Text style={styles.nextRoundButtonText}>Retry Round</Text>
                <Ionicons name="refresh" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Time's Up overlay — shown instead of a frozen screen when the
  // countdown reaches zero. Mirrors the success overlay below.
  if (showTimeUp) {
    return (
      <View style={styles.flex}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <SplashThemeBackground />
        <SafeAreaView style={styles.flex}>
          <View style={styles.successContainer}>
            <Animated.View
              style={[styles.successContent, { opacity: timeUpOpacity, transform: [{ scale: timeUpScale }] }]}
            >
              <View style={[styles.successCircle, { backgroundColor: C.red }]}>
                <Ionicons name="time-outline" size={56} color="#FFFFFF" />
              </View>
              <Text style={styles.congratsText}>Time's up!</Text>
              <Text style={styles.correctText}>You ran out of time for this round.</Text>
              <Text style={styles.roundCompleteText}>
                Round {round.roundNumber} of {round.totalRounds}
              </Text>
              <Pressable
                style={[styles.nextRoundButton, { backgroundColor: C.red }]}
                onPress={handleTimeUpContinue}
              >
                <Text style={styles.nextRoundButtonText}>Try Again</Text>
                <Ionicons name="refresh" size={18} color="#FFFFFF" />
              </Pressable>
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (showSuccess) {
    return (
      <View style={styles.flex}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <SplashThemeBackground />
        <SafeAreaView style={styles.flex}>
          <Confetti />
          <View style={styles.successContainer}>
            <Animated.View
              style={[styles.successContent, { opacity: successOpacity, transform: [{ scale: successScale }] }]}
            >
              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={56} color="#FFFFFF" />
              </View>
              <Text style={styles.congratsText}>Congrats! 🎉</Text>
              <Text style={styles.correctText}>+{roundScore} points</Text>
              {roundReward > 0 ? (
                <Text style={styles.bonusSummary}>🪙 +{roundReward} coins — round complete!</Text>
              ) : null}
              {roundThreeGift > 0 && giftClosed ? (
                <Animated.View style={[styles.roundGiftReward, { transform: [{ scale: giftOpenScale }] }]}>
                  <Ionicons name="gift" size={30} color={C.coral} />
                  <View>
                    <Text style={styles.roundGiftTitle}>Gift opened!</Text>
                    <Text style={styles.roundGiftText}>+{roundThreeGift} coins + 1 bonus clue</Text>
                  </View>
                </Animated.View>
              ) : null}
              {bonusFound.size > 0 ? (
                <Text style={styles.bonusSummary}>
                  ★ {bonusFound.size} bonus word{bonusFound.size > 1 ? "s" : ""} found
                </Text>
              ) : null}
              {levelBonus > 0 ? (
                <Text style={styles.bonusSummary}>🪙 +{levelBonus} coins — 5 rounds complete!</Text>
              ) : null}
              <Text style={styles.roundCompleteText}>
                Round {round.roundNumber}
                {round.roundNumber <= round.totalRounds ? ` of ${round.totalRounds}` : ""} complete
              </Text>
              {isSpinLevel && !spinDone ? (
                <Pressable
                  style={[styles.nextRoundButton, { backgroundColor: C.coral }]}
                  onPress={() => setShowSpin(true)}
                >
                  <Text style={styles.nextRoundButtonText}>🎡 Spin the Lucky Wheel</Text>
                </Pressable>
              ) : isFinalLevel ? (
                <Pressable
                  style={[styles.nextRoundButton, { backgroundColor: C.gold }]}
                  onPress={() => setShowComplete(true)}
                >
                  <Text style={styles.nextRoundButtonText}>🏆 Finish</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.nextRoundButton} onPress={handleContinue}>
                  <Text style={styles.nextRoundButtonText}>Next Round</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </Pressable>
              )}
            </Animated.View>
          </View>

          {showSpin ? (
            <LuckySpinWheel
              playerName={playerName}
              roundId={String(round.id)}
              level={round.roundNumber}
              onResult={(r) => {
                setCoins(r.coins);
              }}
              onClose={() => {
                setShowSpin(false);
                setSpinDone(true);
                if (isFinalLevel) setShowComplete(true);
              }}
            />
          ) : null}

          {roundThreeGift > 0 && !giftClosed ? (
            <GiftRewardModal
              coins={roundThreeGift}
              onClose={() => setGiftClosed(true)}
            />
          ) : null}

          {showComplete ? (
            <GameCompleteModal
              playerName={playerName}
              setKey={String(round.id)}
              totalRounds={round.totalRounds}
              fallbackStars={roundScore}
              onClose={() => setShowComplete(false)}
              onViewResults={handleContinue}
              onSkipRound={handleSkipAfterSet}
            />
          ) : null}
        </SafeAreaView>
      </View>
    );
  }

  const gameCard = (
    <>
      <View style={styles.topRow}>
        {/* LEFT group: round + timer */}
        <View style={styles.topRowGroup}>
          <View style={[styles.statPill, styles.statPillIndigo]}>
            <Ionicons name="repeat" size={13} color={C.indigo} />
            <Text style={[styles.statPillText, { color: C.indigo }]}>Round {round.roundNumber}</Text>
          </View>
          <View style={[styles.statPill, timeLow ? styles.statPillCoral : styles.statPillNeutral]}>
            <Ionicons name="time-outline" size={13} color={timeLow ? C.coral : C.text} />
            <Text style={[styles.statPillText, { color: timeLow ? C.coral : C.text }]}>{formatTime(timeLeft)}</Text>
          </View>
        </View>

        {/* RIGHT group: words, hint tokens, skip, coins, EXIT (right corner) */}
        <View style={[styles.topRowGroup, { flexGrow: 1 }]}>
          <View style={[styles.statPill, styles.statPillGreen]}>
            <Ionicons name="book" size={13} color={C.green} />
            <Text style={[styles.statPillText, { color: C.green }]}>
              {myWordsFound} {myWordsFound === 1 ? "word" : "words"}
            </Text>
          </View>
          {hintTokens > 0 ? (
            <View style={[styles.statPill, styles.statPillIndigo]}>
              <Ionicons name="bulb" size={13} color={C.indigo} />
              <Text style={[styles.statPillText, { color: C.indigo }]}>{hintTokens}</Text>
            </View>
          ) : null}
          <Pressable
            style={[styles.statPill, styles.statPillIndigo, { opacity: 0.45 }]}
            onPress={() => showToast("Finish all rounds to use Skip", "clue")}
          >
            <Ionicons name="play-forward" size={13} color={C.indigo} />
            <Text style={[styles.statPillText, { color: C.indigo }]}>Skip</Text>
            {skips > 0 ? (
              <View style={styles.skipBadge}>
                <Text style={styles.skipBadgeText}>{skips}</Text>
              </View>
            ) : null}
          </Pressable>
          <View style={[styles.statPill, styles.statPillGold, { marginLeft: "auto" }]}>
            <Ionicons name="logo-bitcoin" size={13} color={C.gold} />
            <Text style={[styles.statPillText, { color: "#8A6A1D" }]}>{coins}</Text>
          </View>

          {/* Exit button -> "Are you sure you want to quit the game?" popup */}
          <Pressable
            style={[styles.statPill, styles.statPillExit]}
            onPress={openQuit}
            accessibilityRole="button"
            accessibilityLabel="Exit game"
          >
            <Ionicons name="exit-outline" size={14} color={C.red} />
            <Text style={[styles.statPillText, { color: C.red }]}>Exit</Text>
          </Pressable>
        </View>
      </View>

      {/* grid + letter wheel share one row on wide screens; stacked on mobile */}
      <View style={[styles.puzzleRow, wide && styles.puzzleRowWide]}>
        {/* ---- Crossword grid ---- */}
        <View style={styles.gridCard}>
          {grid.map((row, ri) => (
            <View
              key={ri}
              style={[
                styles.gridRow,
                // NEW: row with an active sparkle sits above the others so the burst isn't covered
                row.some((_, ci) => sparkleCells[cellKey(ri, ci)]) && { zIndex: 20, elevation: 20 },
              ]}
            >
              {row.map((cell, ci) => {
                if (!cell) return <View key={ci} style={styles.gridCellEmpty} />;
                const isFound = cell.wordIdx.some((wi) => foundWordIdx.has(wi));
                const isRevealed = !!revealedCells[cellKey(ri, ci)];
                const state = isFound ? "found" : isRevealed ? "revealed" : "blank";

                let delay = 0;
                if (lastFoundIdx !== null && cell.wordIdx.includes(lastFoundIdx)) {
                  const pos = cellsForWord(wordSlots[lastFoundIdx]).findIndex((p) => p.r === ri && p.c === ci);
                  delay = Math.max(0, pos) * 70;
                }
                return (
                  <GridCell
                    key={ci}
                    letter={cell.letter}
                    state={state}
                    delay={delay}
                    sparkle={!!sparkleCells[cellKey(ri, ci)]}
                    onSparkleDone={() =>
                      setSparkleCells((p) => {
                        const n = { ...p };
                        delete n[cellKey(ri, ci)];
                        return n;
                      })
                    }
                  />
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.wheelCard}>
          <View style={styles.wheelWrap}>
            <View
              ref={wheelRef}
              onLayout={refreshOrigin}
              {...touchHandlers}
              {...webMouseHandlers}
              // FIX: become the touch responder and don't give it up to the ScrollView
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderTerminationRequest={() => false}
              style={[
                styles.wheel,
                { width: WHEEL_SIZE, height: WHEEL_SIZE },
                Platform.OS === "web" ? ({ userSelect: "none", touchAction: "none", cursor: "pointer" } as any) : null,
              ]}
            >
              {letterOrder.map((letterIndex) => {
                const selected = selectedIndices.includes(letterIndex);
                const tileColor = TILE_COLORS[letterIndex % TILE_COLORS.length];
                // splash-style letter colours: dark teal / teal / orange
                const letterColor = [C.text, C.indigo, C.coral][letterIndex % 3];
                const anim = tileAnim.current[letterIndex] ?? new Animated.ValueXY({ x: 0, y: 0 });
                return (
                  <Animated.View
                    key={`letter-${letterIndex}`}
                    pointerEvents="none"
                    style={[
                      styles.wheelTileBase,
                      { width: TILE_SIZE, height: TILE_SIZE, transform: anim.getTranslateTransform() },
                    ]}
                  >
                    <View
                      style={[
                        styles.wheelTile,
                        selected && { backgroundColor: tileColor, borderColor: tileColor, borderBottomColor: tileColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.wheelLetter,
                          !selected && { color: letterColor },
                          selected && styles.wheelLetterSelected,
                        ]}
                      >
                        {letters[letterIndex]}
                      </Text>
                    </View>
                  </Animated.View>
                );
              })}
              {trail}
            </View>

            {/* NEW: shuffle is now an icon-only button in the CENTER of the wheel.
                It is a sibling of the wheel View (not a child) so it never
                conflicts with the wheel's drag/touch handlers. */}
            <Pressable
              style={[styles.shuffleCenter, (submitting || paused) && { opacity: 0.5 }]}
              onPress={shuffleLetters}
              disabled={submitting || paused}
              hitSlop={8}
            >
              <Ionicons name="shuffle" size={22} color="#FFFFFF" />
            </Pressable>

            {/* dims the wheel and blocks touches while paused */}
            {paused && !showQuit && (
              <View style={styles.pausedOverlay} pointerEvents="auto">
                <Ionicons name="pause-circle" size={44} color="#FFFFFF" />
                <Text style={styles.pausedOverlayText}>Paused</Text>
                <Pressable style={styles.resumeButton} onPress={() => setPaused(false)}>
                  <Text style={styles.resumeButtonText}>Resume</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.hintRow}>
        <Animated.View style={[styles.progressTrack, { transform: [{ scaleY: barPulse }] }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: allFound ? C.green : C.coral,
                width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }),
              },
            ]}
          />
        </Animated.View>
        <Pressable
          style={[styles.hintBulb, (hintsLeft <= 0 || hintBusy || paused) && styles.hintBulbDisabled]}
          onPress={revealRandomLetter}
          disabled={hintsLeft <= 0 || hintBusy || paused}
        >
          <Ionicons name="bulb" size={16} color="#FFFFFF" />
          {hintsLeft > 0 && (
            <View style={styles.hintBadge}>
              <Text style={styles.hintBadgeText}>{hintsLeft}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.previewBox}>
        <Text style={styles.previewText}>
          {currentWord.length > 0 ? currentWord.split("").join(" ") : "Select letters to form a word"}
        </Text>
        {toast ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.toast,
              {
                backgroundColor: TOAST_BG[toast.kind],
                opacity: toastAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1], extrapolate: "clamp" }),
                transform: [
                  { translateX: shakeX },
                  { scale: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) },
                ],
              },
            ]}
          >
            <Text style={styles.toastText}>{toast.kind === "bonus" ? "★ " : ""}{toast.text}</Text>
          </Animated.View>
        ) : null}
      </View>

      <View style={{ height: 20 }} />
    </>
  );

  const playersCard = (
    <View style={styles.playersBox}>
      <View style={styles.playersHeadRow}>
        <Text style={styles.playersTitle}>Players</Text>
        <View style={styles.playersCountPill}>
          <Ionicons name="people-outline" size={13} color={C.indigo} />
          <Text style={styles.playersCountText}>{livePlayers.length}</Text>
        </View>
      </View>
      {livePlayers.map((player, index) => {
        const isMe = player.player_name === playerName;
        const avatarColor = TILE_COLORS[index % TILE_COLORS.length];
        return (
          <View key={`${player.player_name}-${index}`} style={[styles.playerRow, isMe && styles.playerRowMe]}>
            <View style={[styles.playerAvatar, { backgroundColor: avatarColor }]}>
              <Text style={styles.playerAvatarText}>{player.player_name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.playerName} numberOfLines={1}>{player.player_name}</Text>
              {isMe ? <Text style={styles.playerTag}>That's you</Text> : null}
            </View>
            {/* NEW: how many words this player has found */}
            <View style={styles.playerWordsPill}>
              <Ionicons name="book" size={11} color={C.indigo} />
              <Text style={styles.playerWordsText}>{player.wordsFound ?? 0}</Text>
            </View>
            <View style={styles.playerScorePill}>
              <Text style={styles.playerScore}>{player.score}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.flex}>
      {/* splash-style animated backdrop (mint circles + rings + floating tiles) */}
      <SplashThemeBackground />
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <SafeAreaView style={[styles.flex, { backgroundColor: "transparent" }]}>
        <View style={styles.appRow}>
          {wide && <NavSidebar active="Home" />}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[styles.scroll, { paddingHorizontal: wide ? 32 : 16 }]}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={32}
            onScroll={refreshOrigin}
            // FIX: page can't scroll while the finger is dragging on the wheel
            scrollEnabled={!scrollLocked}
          >
            <View style={styles.page}>
              {wide ? (
                <View style={styles.wideRow}>
                  <View style={styles.mainCol}>{gameCard}</View>
                  <View style={styles.sideCol}>{playersCard}</View>
                </View>
              ) : (
                <View style={{ gap: 16 }}>
                  {gameCard}
                  {playersCard}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Quit confirmation popup.
          CHANGED: a plain absolute overlay instead of <Modal>, so it is always
          centered on the screen (mobile view on web, phone, tablet). */}
      {showQuit && (
        <View style={styles.quitOverlay}>
          <View style={styles.quitCard}>
            <View style={styles.quitIconWrap}>
              <Ionicons name="exit-outline" size={30} color={C.red} />
            </View>
            <Text style={styles.quitTitle}>Quit the game?</Text>
            <Text style={styles.quitText}>
              Are you sure you want to quit the game? Your level progress is saved.
            </Text>

            <View style={styles.quitActions}>
              <Pressable
                style={[styles.quitBtn, styles.quitNoBtn]}
                onPress={cancelQuit}
                disabled={quitBusy}
              >
                <Text style={styles.quitNoText}>No</Text>
              </Pressable>

              <Pressable
                style={[styles.quitBtn, styles.quitYesBtn]}
                onPress={confirmQuit}
                disabled={quitBusy}
              >
                {quitBusy ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.quitYesText}>Yes</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};



const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: C.bg },
  appRow: { flex: 1, flexDirection: "row" },
  scroll: { paddingTop: 14, paddingBottom: 32 },
  page: { width: "100%", maxWidth: 1080, alignSelf: "center" },

  wideRow: { flexDirection: "row", gap: 32, alignItems: "flex-start", justifyContent: "center" },
  mainCol: { width: 640, maxWidth: 640, gap: 14 },
  sideCol: { width: 340, maxWidth: 340 },

  navSidebar: {
    width: 230,
    backgroundColor: C.card,
    borderRightWidth: 1,
    borderRightColor: C.border,
    paddingVertical: 24,
    paddingHorizontal: 18,
    gap: 28,
  },
  navBrandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  navLogoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.tileBg,
    borderWidth: 2,
    borderColor: C.tileBorder,
    borderBottomWidth: 4,
    borderBottomColor: C.tileEdge,
    alignItems: "center",
    justifyContent: "center",
  },
  navLogoText: { color: C.indigo, fontWeight: "900", fontSize: 14 },
  navBrandTitle: { color: C.text, fontWeight: "900", fontSize: 15 },
  navBrandSub: { color: C.sub, fontSize: 11, marginTop: 1 },
  navItems: { gap: 6 },
  navItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 12 },
  navItemActive: { backgroundColor: C.indigoSoft },
  navIconWrap: { width: 28, height: 28, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: C.greySoft },
  navIconWrapActive: { backgroundColor: C.indigo },
  navItemText: { fontSize: 14, fontWeight: "700", color: C.sub },
  navItemTextActive: { color: C.indigo },
  navBottomCard: { marginTop: "auto", backgroundColor: C.text, borderRadius: 18, padding: 16, gap: 10 },
  navBottomIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.coral, alignItems: "center", justifyContent: "center" },
  navBottomText: { color: "#FFFFFF", fontSize: 12.5, fontWeight: "700" },

  topRow: { flexDirection: "row", gap: 8, marginBottom: 4, alignItems: "center", flexWrap: "wrap" },
  topRowGroup: { flexDirection: "row", gap: 8, alignItems: "center" },
  statPill: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14 },
  statPillIndigo: { backgroundColor: C.indigoSoft },
  statPillNeutral: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  statPillCoral: { backgroundColor: C.coralSoft },
  statPillGold: { backgroundColor: C.goldSoft },
  statPillGreen: { backgroundColor: C.greenSoft }, // NEW: "words found" chip
  statPillExit: { backgroundColor: C.redSoft }, // NEW: Exit button
  statPillText: { fontSize: 13, fontWeight: "800" },
  skipBadge: {
    position: "absolute",
    top: -7,
    right: -6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: "#FF3B7F",
    alignItems: "center",
    justifyContent: "center",
  },
  skipBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },

  // shared row that holds the crossword grid and the letter wheel.
  puzzleRow: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    width: "100%",
  },
  puzzleRowWide: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
  },
  gridCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    overflow: "visible", // NEW: sparkle burst can fly outside the card edge
  },
  wheelCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  gridRow: { flexDirection: "row", gap: 4 },
  gridCellEmpty: { width: 36, height: 38 },
  gridCell: { width: 36, height: 38, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  gridCellBlank: { backgroundColor: C.tileBg, borderWidth: 2, borderColor: C.tileBorder, borderStyle: "dashed" },
  gridCellFilled: { backgroundColor: C.indigoSoft, borderWidth: 2, borderColor: C.indigo },
  gridCellRevealed: { backgroundColor: C.goldSoft, borderWidth: 2, borderColor: C.gold, borderStyle: "solid" },
  gridLetter: { fontSize: 18, fontWeight: "900", color: C.text },

  hintRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 16 },
  progressTrack: { flex: 1, height: 10, borderRadius: 999, backgroundColor: C.card, overflow: "hidden", borderWidth: 1, borderColor: C.border },
  progressFill: { height: "100%", backgroundColor: C.coral, borderRadius: 999 },
  hintBulb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.gold,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  hintBulbDisabled: { backgroundColor: C.grey, opacity: 0.5 },
  hintBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: C.coral,
    alignItems: "center",
    justifyContent: "center",
  },
  hintBadgeText: { color: "#FFFFFF", fontSize: 9, fontWeight: "900" },
  // NEW: gift icon button (coral, distinct from gold bulb)
  giftBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.coral,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  toast: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  toastText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900", letterSpacing: 0.5, textAlign: "center" },
  bonusSummary: { marginTop: 10, fontSize: 14, fontWeight: "800", color: "#8A6A1D" },
  roundGiftReward: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: C.goldSoft,
  },
  roundGiftTitle: { fontSize: 15, fontWeight: "900", color: C.text },
  roundGiftText: { fontSize: 13, fontWeight: "800", color: "#8A6A1D" },

  previewBox: {
    marginTop: 14,
    backgroundColor: C.previewBg,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  previewText: { color: "#F2E7D5", fontSize: 16, fontWeight: "800", letterSpacing: 2 },

  wheelWrap: { alignItems: "center", position: "relative" },
  wheel: { position: "relative" },
  wheelTileBase: { position: "absolute", left: 0, top: 0 },
  // splash-style cream tile with a golden edge and a thick bottom edge
  wheelTile: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: C.tileBorder,
    borderBottomWidth: 5,
    borderBottomColor: C.tileEdge,
    backgroundColor: C.tileBg,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#B8A48C",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  wheelLetter: { fontSize: 24, fontWeight: "900", color: C.text },
  wheelLetterSelected: { color: "#FFFFFF" },

  // NEW: icon-only shuffle button, absolutely centered over the wheel
  // (wheel is WHEEL_SIZE_CONST x WHEEL_SIZE_CONST inside wheelWrap).
  shuffleCenter: {
    position: "absolute",
    left: WHEEL_SIZE_CONST / 2 - SHUFFLE_BTN_SIZE / 2,
    top: WHEEL_SIZE_CONST / 2 - SHUFFLE_BTN_SIZE / 2,
    width: SHUFFLE_BTN_SIZE,
    height: SHUFFLE_BTN_SIZE,
    borderRadius: SHUFFLE_BTN_SIZE / 2,
    backgroundColor: C.indigo,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  // pause overlay covering the letter wheel
  pausedOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(14,59,58,0.78)",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  pausedOverlayText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  resumeButton: {
    marginTop: 6,
    backgroundColor: C.indigo,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  resumeButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },

  errorText: { textAlign: "center", fontSize: 13, fontWeight: "700", color: C.coral, minHeight: 20, marginTop: 10 },

  playersBox: { backgroundColor: C.card, borderRadius: 22, borderWidth: 1, borderColor: C.border, padding: 18 },
  playersHeadRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  playersTitle: { fontSize: 17, fontWeight: "900", color: C.text },
  playersCountPill: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 12, backgroundColor: C.indigoSoft },
  playersCountText: { color: C.indigo, fontWeight: "800", fontSize: 12 },
  playerRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, marginBottom: 8 },
  playerRowMe: { backgroundColor: C.indigoSoft },
  playerAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  playerAvatarText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
  playerName: { fontSize: 14.5, fontWeight: "700", color: C.text },
  playerTag: { fontSize: 11, color: C.sub, marginTop: 1 },
  playerWordsPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: C.indigoSoft, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10 },
  playerWordsText: { fontSize: 12.5, fontWeight: "900", color: C.indigo },
  playerScorePill: { backgroundColor: C.greenSoft, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
  playerScore: { fontSize: 14, fontWeight: "900", color: C.green },

  successContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
  successContent: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    backgroundColor: C.card,
    borderRadius: 28,
    padding: 32,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#6FA895",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: C.green,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  congratsText: { fontSize: 26, fontWeight: "900", color: C.text, textAlign: "center" },
  correctText: { marginTop: 8, fontSize: 15, fontWeight: "600", color: C.sub },
  roundCompleteText: { marginTop: 18, fontSize: 14.5, fontWeight: "700", color: C.sub },
  nextRoundButton: {
    marginTop: 26,
    width: "100%",
    height: 54,
    borderRadius: 16,
    backgroundColor: C.indigo,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: C.indigo,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  nextRoundButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },

  /* ---- quit popup (absolute overlay, always centered) ---- */
  quitOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    elevation: 999,
    backgroundColor: "rgba(14,59,58,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  quitCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  quitIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.redSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  quitTitle: { fontSize: 20, fontWeight: "900", color: C.text, textAlign: "center" },
  quitText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: C.sub,
    textAlign: "center",
    fontWeight: "600",
  },
  quitActions: { flexDirection: "row", gap: 12, marginTop: 22, width: "100%" },
  quitBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  quitNoBtn: { backgroundColor: C.greySoft, borderWidth: 1, borderColor: C.border },
  quitYesBtn: { backgroundColor: C.red },
  quitNoText: { color: C.text, fontSize: 15, fontWeight: "800" },
  quitYesText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
});

export default GamePlayScreen;
