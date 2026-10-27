
// import React, { useCallback, useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import {
//   Alert,
//   ActivityIndicator,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import { Difficulty } from "./src/types/game";

// import {
//   fetchStats,
//   fetchSettings,
//   updateSettings as apiUpdateSettings,
//   resetStats as apiResetStats,
//   StatsResponse,
//   SettingsResponse,
// } from "./src/api/api";

// import CodeBreakerShell, { NavKey } from "./src/components/Sidebar";

// import WordScrambleShell, {
//   WsNavKey,
// } from "./src/components/WordScrambleShell";

// import { feedback, setFeedbackSettings } from "./src/utils/feedback";

// import { fetchPlayer } from "./src/api/profileApi";

// import { isLoggedOut, ensureAccount } from "./src/api/authApi";

// import { fetchProfile, WsProfile } from "./src/api/wsProfileApi";

// import GiftRewardModal from "./src/screens/GiftRewardModal";

// import WordScrambleSplashScreen from "./src/screens/WordScrambleSplashScreen";

// import WordScrambleHomeScreen, {
//   TopPlayer,
// } from "./src/screens/Wordscramblehomescreen";

// import CreateRoomScreen, {
//   CreateRoomConfig,
// } from "./src/screens/Createroomscreen";

// import RoomWaitingScreen from "./src/screens/Roomwaitingscreen";

// import GamePlayScreen from "./src/screens/Gameplayscreen";

// import RoundCompleteScreen from "./src/screens/Roundcompletescreen";

// import GameOverScreen from "./src/screens/Gameoverscreen";

// import RoomChatScreen from "./src/screens/Roomchatscreen";

// import RoomSettingsScreen from "./src/screens/Roomsettingscreen";

// import LeaderboardScreen from "./src/screens/Leaderboardscreen";

// import SplashScreen from "./src/screens/SplashScreen";

// import MenuScreen from "./src/screens/MenuScreen";

// import HomeScreen from "./src/screens/HomeScreen";

// import LevelMapScreen from "./src/screens/LevelMapScreen";

// import GameScreen from "./src/screens/GameScreen";

// import WrongGuessScreen from "./src/screens/WrongGuessScreen";

// import StatsScreen from "./src/screens/StatsScreen";

// import SettingsScreen from "./src/screens/SettingsScreen";

// import ProfileScreen from "./src/screens/ProfileScreen";

// import LoginScreen from "./src/screens/LoginScreen";

// import CreateAccountScreen from "./src/screens/CreateAccountScreen";

// // NEW: Level 1 "Start" screen shown after Single Player is tapped
// import LevelStartScreen from "./src/screens/LevelStartScreen";

// // NEW: guest flow screens
// import GuestChoiceScreen from "./src/screens/GuestChoiceScreen";

// import GuestLoginScreen from "./src/screens/GuestLoginScreen";

// import { registerGuest } from "./src/api/guestApi";

// // CHANGED: PlayModeScreen removed (Multiplayer now opens Room Options directly)
// import {
//   RoomOptionsScreen,
//   GuestNicknameScreen,
//   JoinRoomScreen,
//   RoomCreatedScreen,
// } from "./src/screens/WordScrambleFlowScreens";

// import {
//   createRoom,
//   joinRoom,
//   fetchRoom,
//   fetchLeaderboard,
//   startGame,
//   nextRound,
//   retryRound,
//   fetchActiveRoom,
//   WordScrambleRoom,
// } from "./src/api/Wordscrambleapi";

// import ErrorBoundary from "./src/components/ErrorBoundary";

// // Brain Twist screens (now real routes in this navigator)
// import BTSplashScreen from "./src/screens/braintwist/BTSplashScreen";
// import BTHomeScreen from "./src/screens/braintwist/BTHomeScreen";
// import BTGameScreen from "./src/screens/braintwist/BTGameScreen";
// import BTCongratsScreen from "./src/screens/braintwist/BTCongratsScreen";
// import * as btApi from "./src/screens/braintwist/api";
// import BTLevelMapScreen from "./src/screens/braintwist/BTLevelMapScreen";
// import { getMap } from "./src/screens/braintwist/mapApi";



// export type RootStackParamList = {
//   Login: undefined;
//   CreateAccount: undefined;

//   // NEW: guest flow
//   GuestChoice: undefined;
//   GuestLogin: undefined;

//   Menu: undefined;

//   // NEW: Who Is Lying?
//   LiarGame: undefined;

//   CodeBreakerSplash: undefined;
//   WordScrambleSplash: undefined;

//   Home: undefined;
//   Levels: undefined;
//   Game: undefined;
//   WrongGuess: undefined;
//   Stats: undefined;
//   Settings: undefined;
//   Profile: undefined;

//   WordScrambleHome: undefined;

//   // NEW: Single Player -> Level 1 Start screen
//   WsLevelStart: undefined;

//   RoomOptions: undefined;
//   GuestNickname: undefined;
//   JoinRoom: undefined;
//   RoomCreated: undefined;
//   CreateRoom: undefined;
//   RoomWaiting: undefined;
//   WsGame: undefined;
//   RoundComplete: undefined;
//   WsGameOver: undefined;
//   WsChat: undefined;
//   WsRoomSettings: undefined;
//   WsLeaderboard: undefined;

//   // Brain Twist
//   BtSplash: undefined;
//   BtHome: undefined;
//   BtGame: undefined;
//   BtLevels: undefined;
//   BtWin: { stats: { tries: number; hints: number; skipped: boolean } };
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();



// const linking = {
//   prefixes: [],

//   config: {
//     screens: {
//       Login: "login",
//       CreateAccount: "create-account",

//       // NEW: guest flow
//       GuestChoice: "guest-choice",
//       GuestLogin: "guest-login",

//       Menu: "",

//       CodeBreakerSplash: "splash",
//       WordScrambleSplash: "word-scramble-splash",

//       Home: "home",
//       Levels: "levels",
//       Game: "game",
//       WrongGuess: "wrong-guess",
//       Stats: "stats",
//       Settings: "settings",
//       Profile: "profile",

//       WordScrambleHome: "word-scramble",

//       // NEW
//       WsLevelStart: "level-start",

//       RoomOptions: "room-options",
//       GuestNickname: "guest",
//       JoinRoom: "join-room",
//       RoomCreated: "room-created",
//       CreateRoom: "create-room",
//       RoomWaiting: "room-waiting",
//       WsGame: "play",
//       RoundComplete: "round-complete",
//       WsGameOver: "game-over",
//       WsChat: "chat",
//       WsRoomSettings: "room-settings",
//       WsLeaderboard: "leaderboard",

//       // Brain Twist
//       BtSplash: "brain-twist-splash",
//       BtHome: "brain-twist",
//       BtGame: "brain-twist/play",
//       BtLevels: "brain-twist/levels",
//       BtWin: "brain-twist/complete",
//     },
//   },
// };



// export interface WordScrambleRound {
//   id: string | number;
//   roundNumber: number;
//   totalRounds: number;
//   timeLimitSec: number;
//   word?: string;
//   scrambledWord?: string;
//   scrambled?: string;
//   clue?: string;
//   lives?: number;
//   answer?: string;
//   [key: string]: any;
// }

// /* ============================================================
//    DEFAULT VALUES
// ============================================================ */

// const EMPTY_STATS: StatsResponse = {
//   highScore: 0,
//   gamesPlayed: 0,
//   gamesWon: 0,
//   currentStreak: 0,
//   bestStreak: 0,
//   avgAttempts: 0,
// };

// const DEFAULT_SETTINGS: SettingsResponse = {
//   soundEnabled: true,
//   hapticsEnabled: true,
//   darkMode: true,
// };

// const DEFAULT_LIVES = 5;

// const FALLBACK_AVATAR_COLORS = ["#F97066", "#3B82F6", "#2BC98A"];

// const DEFAULT_WS_GAME_CONFIG = {
//   totalRounds: 10,
//   timeLimitSec: 20,
// };

// const ACTIVE_WS_ROOM_KEY = "code-breaker.active-word-scramble-room";

// const SAVED_PLAYER_JSON_KEY = "cyber-mind-player";

// const SAVED_PLAYER_ID_KEY = "cyber-mind-player-id";

// /* ============================================================
//    GIFT / COINS
// ============================================================ */

// const COINS_STORAGE_KEY = "cyber-mind-coins";

// const GIFT_REWARD_AMOUNT = 30;

// /* ============================================================
//    GUEST
// ============================================================ */

// const GUEST_NAME_KEY = "cyber-mind-ws-guest-name";

// /* ============================================================
//    BRAIN TWIST
// ============================================================ */

// const BT_START_HINTS = 50;

// // true  = after a normal win show the "LEVEL COMPLETE" screen (NEXT button)
// // false = after a win / submit go straight to the next unlocked level (e.g. Level 3)
// // (skip always goes straight to the next level)
// const BT_SHOW_COMPLETE_SCREEN = false;

// /* ============================================================
//    ROOM STORAGE
// ============================================================ */

// const rememberWordScrambleRoom = async (roomCode: string) => {
//   try {
//     await AsyncStorage.setItem(ACTIVE_WS_ROOM_KEY, roomCode);
//   } catch (err) {
//     console.warn("Could not save active Word Scramble room:", err);
//   }
// };

// const clearRememberedWordScrambleRoom = async () => {
//   try {
//     await AsyncStorage.removeItem(ACTIVE_WS_ROOM_KEY);
//   } catch (err) {
//     console.warn("Could not clear saved Word Scramble room:", err);
//   }
// };

// /* ============================================================
//    RESPONSE HELPERS
// ============================================================ */

// function extractRoom(data: any): WordScrambleRoom | null {
//   if (!data) return null;

//   if (data.room) {
//     return data.room as WordScrambleRoom;
//   }

//   return data as WordScrambleRoom;
// }

// function extractRound(data: any): WordScrambleRound | null {
//   if (!data) return null;

//   if (data.round) {
//     return normalizeRound(data.round);
//   }

//   if (data.data?.round) {
//     return normalizeRound(data.data.round);
//   }

//   if (data.data) {
//     return normalizeRound(data.data);
//   }

//   return normalizeRound(data);
// }

// function normalizeRound(raw: any): WordScrambleRound | null {
//   if (!raw) return null;

//   return {
//     ...raw,

//     id: raw.id ?? raw.roundId ?? raw.round_id ?? null,

//     roundNumber: Number(
//       raw.roundNumber ?? raw.round_number ?? raw.round ?? 1
//     ),

//     totalRounds: Number(
//       raw.totalRounds ??
//         raw.total_rounds ??
//         DEFAULT_WS_GAME_CONFIG.totalRounds
//     ),

//     timeLimitSec: Number(
//       raw.timeLimitSec ??
//         raw.time_limit_sec ??
//         raw.timePerRoundSec ??
//         raw.time_per_round_sec ??
//         DEFAULT_WS_GAME_CONFIG.timeLimitSec
//     ),

//     word:
//       raw.word ?? raw.answer ?? raw.correctWord ?? raw.correct_word ?? "",

//     scrambledWord:
//       raw.scrambledWord ?? raw.scrambled_word ?? raw.scrambled ?? "",

//     scrambled:
//       raw.scrambled ?? raw.scrambledWord ?? raw.scrambled_word ?? "",

//     clue: raw.clue ?? raw.hint ?? "",
//   };
// }

// /* ============================================================
//    LOADING SCREEN
// ============================================================ */

// function GameLoadingScreen() {
//   return (
//     <View style={styles.loadingContainer}>
//       <ActivityIndicator size="large" color="#4F46E5" />

//       <Text style={styles.loadingTitle}>Starting game...</Text>

//       <Text style={styles.loadingText}>Preparing your first round</Text>
//     </View>
//   );
// }

// /* ============================================================
//    REDIRECT
// ============================================================ */

// function RedirectTo({
//   navigation,
//   to,
// }: {
//   navigation: any;
//   to: string;
// }) {
//   useEffect(() => {
//     navigation.navigate(to);

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return <GameLoadingScreen />;
// }

// /* ============================================================
//    GAME ERROR
// ============================================================ */

// function GameErrorScreen({
//   message,
//   onBack,
//   onRetry,
// }: {
//   message: string;
//   onBack: () => void;
//   onRetry: () => void;
// }) {
//   return (
//     <View style={styles.errorContainer}>
//       <Text style={styles.errorIcon}>!</Text>

//       <Text style={styles.errorTitle}>Unable to start game</Text>

//       <Text style={styles.errorMessage}>{message}</Text>

//       <View style={styles.errorButton}>
//         <Text style={styles.errorButtonText} onPress={onRetry}>
//           Try Again
//         </Text>
//       </View>

//       <Text style={styles.backText} onPress={onBack}>
//         Back to room
//       </Text>
//     </View>
//   );
// }

// /* ============================================================
//    APP
// ============================================================ */

// export default function App() {
//   /* ============================================================
//      CODE BREAKER STATE
//   ============================================================ */

//   const [difficulty, setDifficulty] = useState<Difficulty>("easy");

//   const [selectedLevel, setSelectedLevel] = useState<number>(1);

//   const [attemptsLeft, setAttemptsLeft] = useState<number>(3);

//   const [stats, setStats] = useState<StatsResponse>(EMPTY_STATS);

//   const [settings, setSettings] =
//     useState<SettingsResponse>(DEFAULT_SETTINGS);

//   const [cbPlayerName, setCbPlayerName] = useState<string>("Player");

//   /* ============================================================
//      WORD SCRAMBLE STATE
//   ============================================================ */

//   const [wsProfile, setWsProfile] = useState<WsProfile | null>(null);

//   const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);

//   const [wsRoom, setWsRoom] = useState<WordScrambleRoom | null>(null);

//   const [wsRound, setWsRound] = useState<WordScrambleRound | null>(null);

//   const [wsGameConfig, setWsGameConfig] = useState(DEFAULT_WS_GAME_CONFIG);

//   const [wsLivesLeft, setWsLivesLeft] = useState<number>(DEFAULT_LIVES);

//   const [startingGame, setStartingGame] = useState(false);

//   const [gameStartError, setGameStartError] = useState<string | null>(null);

//   // NEW: Single Player "Level 1 Start" screen state
//   const [spLoading, setSpLoading] = useState(false);

//   const [spError, setSpError] = useState<string | null>(null);

//   /* ============================================================
//      AUTH STATE
//   ============================================================ */

//   const [sessionRestoreReady, setSessionRestoreReady] = useState(false);

//   const [initialRouteName, setInitialRouteName] =
//     useState<keyof RootStackParamList>("Login");

//   const [authed, setAuthed] = useState<boolean>(false);

  

//   const [showGift, setShowGift] = useState(false);

//   const [coins, setCoins] = useState<number>(0);

  

//   const [btN, setBtN] = useState<number>(1);

//   const [btHints, setBtHints] = useState<number>(BT_START_HINTS);

//   const [btPlayer, setBtPlayer] = useState<any>(null);

//   const [btTotal, setBtTotal] = useState<number>(7);

//   // bump this to force a fresh BTGameScreen even when the level number is the same
//   const [btRun, setBtRun] = useState<number>(0);

//   const openBrainTwist = useCallback(async (navigation: any) => {
//     try {
//       // Brain Twist has its own guest player (bt_players table),
//       // so use the Brain Twist API, not the Code Breaker player.
//       const p = await btApi.guest();

//       // backend DB (bt_progress) padi unlocked level
//       let level = Math.max(1, Number(p?.currentLevel) || 1);
//       let total = Number(p?.total) || 7;
//       try {
//         const m = await getMap(p.id);
//         level = m.currentLevel;
//         total = m.total;
//       } catch (e) {}

//       setBtPlayer(p);
//       setBtHints(Number(p?.hints) || 0);
//       setBtN(level);
//       setBtTotal(total);
//     } catch (err: any) {
//       console.warn("Could not start Brain Twist:", err);

//       Alert.alert(
//         "Brain Twist unavailable",
//         err?.message ?? "Could not connect to the Brain Twist server."
//       );

//       return;
//     }

//     navigation.navigate("BtSplash");
//   }, []);

//   /* ============================================================
//      GUEST
//   ============================================================ */

//   const [guestName, setGuestName] = useState<string | null>(null);

//   const [isGuest, setIsGuest] = useState(false);

//   // NEW: which guest option the user picked on the GuestChoice screen
//   const [guestMode, setGuestMode] = useState<"player" | "group">("player");

//   // NEW: true when the guest came through "Join as Group"
//   const [groupGuest, setGroupGuest] = useState(false);

//   // NEW: first screen after authed becomes true (Menu or JoinRoom)
//   const [postAuthRoute, setPostAuthRoute] =
//     useState<keyof RootStackParamList>("Menu");

//   /* ============================================================
//      PLAYER NAME
//   ============================================================ */

//   const playerName =
//     isGuest && guestName ? guestName : wsProfile?.name ?? "";

//   /* ============================================================
//      LOAD GUEST NAME
//   ============================================================ */

//   useEffect(() => {
//     let mounted = true;

//     AsyncStorage.getItem(GUEST_NAME_KEY)
//       .then((name) => {
//         if (mounted && name) {
//           setGuestName(name);
//         }
//       })
//       .catch(() => {});

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   /* ============================================================
//      LOAD COINS
//   ============================================================ */

//   useEffect(() => {
//     let mounted = true;

//     const loadCoins = async () => {
//       try {
//         const stored = await AsyncStorage.getItem(COINS_STORAGE_KEY);

//         if (!mounted) return;

//         if (stored !== null) {
//           const value = Number(stored);

//           if (Number.isFinite(value)) {
//             setCoins(value);
//           }
//         }
//       } catch (err) {
//         console.warn("Failed to load coins:", err);
//       }
//     };

//     loadCoins();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   /* ============================================================
//      CLAIM GIFT
//   ============================================================ */

//   const claimGift = useCallback(async () => {
//     try {
//       setCoins((previousCoins) => {
//         const nextCoins = previousCoins + GIFT_REWARD_AMOUNT;

//         AsyncStorage.setItem(COINS_STORAGE_KEY, String(nextCoins)).catch(
//           (err) => {
//             console.warn("Failed to save coins:", err);
//           }
//         );

//         return nextCoins;
//       });

//       console.log(`Gift claimed: +${GIFT_REWARD_AMOUNT} coins`);
//     } catch (err) {
//       console.warn("Failed to claim gift:", err);
//     }
//   }, []);

//   const openGift = useCallback(() => {
//     setShowGift(true);
//   }, []);

//   const closeGift = useCallback(() => {
//     setShowGift(false);
//   }, []);

//   /* ============================================================
//      SETTINGS SYNC
//   ============================================================ */

//   useEffect(() => {
//     setFeedbackSettings(settings);
//   }, [settings]);

//   /* ============================================================
//      REFRESH STATS
//   ============================================================ */

//   const refreshStats = useCallback(() => {
//     fetchStats()
//       .then((data) => {
//         setStats(data);
//       })
//       .catch((err: unknown) => {
//         console.warn("Failed to refresh stats:", err);
//       });
//   }, []);

//   /* ============================================================
//      REFRESH SETTINGS
//   ============================================================ */

//   const refreshSettings = useCallback(() => {
//     fetchSettings()
//       .then((data) => {
//         setSettings(data);
//       })
//       .catch((err: unknown) => {
//         console.warn("Failed to refresh settings:", err);
//       });
//   }, []);

 

//   const refreshProfile = useCallback(() => {
//     fetchProfile()
//       .then((profile) => {
//         setWsProfile(profile);
//       })
//       .catch((err: unknown) => {
//         console.warn("Failed to load profile:", err);
//       });
//   }, []);

 

//   const refreshCbPlayer = useCallback(() => {
//     fetchPlayer()
//       .then((p) => {
//         const name =
//           (p as any)?.player?.name ?? (p as any)?.name ?? "Player";

//         setCbPlayerName(name);
//       })
//       .catch((err: unknown) => {
//         console.warn("Failed to load player:", err);
//       });
//   }, []);



//   const resetWsSession = useCallback(async () => {
//     await clearRememberedWordScrambleRoom();

//     setWsRoom(null);
//     setWsRound(null);
//     setWsLivesLeft(DEFAULT_LIVES);
//     setGameStartError(null);
//   }, []);

 

//   const clearSessionState = useCallback(async () => {
//     try {
//       await AsyncStorage.multiRemove([
//         ACTIVE_WS_ROOM_KEY,
//         GUEST_NAME_KEY,
//         COINS_STORAGE_KEY,
//       ]);
//     } catch (err) {
//       console.warn("Could not clear saved session data:", err);
//     }

//     setWsProfile(null);
//     setCbPlayerName("Player");

//     setWsRoom(null);
//     setWsRound(null);
//     setWsLivesLeft(DEFAULT_LIVES);

//     setGameStartError(null);

//     setSpLoading(false);
//     setSpError(null);

//     setGuestName(null);
//     setIsGuest(false);

//     // NEW: reset guest-flow state
//     setGroupGuest(false);
//     setPostAuthRoute("Menu");

//     setStats(EMPTY_STATS);
//     setCoins(0);
//     setTopPlayers([]);
//   }, []);



//   const handleAuthSuccess = useCallback(
//     async (user: any, source: string) => {
//       console.log(`${source} onLogin ->`, user);

//       if (!user?.player) {
//         console.warn("onLogin ignored: no player data");

//         return;
//       }

//       // Always start a freshly authenticated session from Menu.
//       // Clear any previous Word Scramble room/session first so an
//       // old WsGame / RoomWaiting route can never become the login target.
//       await clearSessionState();

//       setWsRoom(null);
//       setWsRound(null);
//       setWsLivesLeft(DEFAULT_LIVES);
//       setGameStartError(null);

//       setIsGuest(false);
//       setGuestName(null);

//       refreshProfile();
//       refreshCbPlayer();
//       refreshStats();
//       refreshSettings();

//       // IMPORTANT: login/create-account success ALWAYS starts at Menu.
//       setInitialRouteName("Menu");
//       setPostAuthRoute("Menu");

//       // Changing this state changes the Stack.Navigator key below,
//       // which creates a fresh authenticated navigation stack.
//       setAuthed(true);

//       console.log("AUTH SUCCESS -> MENU");
//     },
//     [
//       clearSessionState,
//       refreshProfile,
//       refreshCbPlayer,
//       refreshStats,
//       refreshSettings,
//     ]
//   );

 

//   const handleGuestEntry = useCallback(
//     async (nickname: string, mode: "player" | "group") => {
//       try {
//         await registerGuest(nickname);
//       } catch (err: any) {
//         Alert.alert(
//           "Could not continue",
//           err?.message ?? "Unable to save your nickname."
//         );

//         return;
//       }

//       // Fresh session (this resets groupGuest / postAuthRoute / guestName)
//       await clearSessionState();

//       try {
//         await AsyncStorage.setItem(GUEST_NAME_KEY, nickname);
//       } catch {}

//       if (mode === "group") {
//         // Join as Group -> Join Room page
//         setGuestName(nickname);
//         setIsGuest(true);
//         setGroupGuest(true);
//         setPostAuthRoute("JoinRoom");
//       } else {
//         // Create as Player -> Menu (normal flow)
//         setGuestName(null);
//         setIsGuest(false);
//         setGroupGuest(false);
//         setPostAuthRoute("Menu");
//       }

//       refreshProfile();
//       refreshCbPlayer();
//       refreshStats();
//       refreshSettings();

//       // New navigator key -> fresh stack starting at postAuthRoute
//       setAuthed(true);
//     },
//     [
//       clearSessionState,
//       refreshProfile,
//       refreshCbPlayer,
//       refreshStats,
//       refreshSettings,
//     ]
//   );

  

//   const loadTopPlayers = useCallback(() => {
//     fetchLeaderboard()
//       .then((players: any[]) => {
//         const formattedPlayers = players
//           .slice(0, 3)
//           .map((p: any, index: number) => ({
//             rank: p.rank ?? index + 1,

//             name: p.name ?? p.player_name ?? "Player",

//             score: Number(p.score ?? 0),

//             avatarColor:
//               p.avatarColor ??
//               p.avatar_color ??
//               FALLBACK_AVATAR_COLORS[index] ??
//               "#4F46E5",
//           }));

//         setTopPlayers(formattedPlayers);
//       })
//       .catch((err: unknown) => {
//         console.warn("Leaderboard failed:", err);
//       });
//   }, []);



//   const ensurePlayerName = useCallback(async (): Promise<string | null> => {
//     if (isGuest && guestName) {
//       return guestName;
//     }

//     if (wsProfile?.name) {
//       return wsProfile.name;
//     }

//     try {
//       const profile = await fetchProfile();

//       setWsProfile(profile);

//       return profile.name;
//     } catch (err) {
//       console.warn("Could not load player:", err);

//       return null;
//     }
//   }, [wsProfile, isGuest, guestName]);

 

//   useEffect(() => {
//     let cancelled = false;

//     const goToLogin = () => {
//       if (cancelled) return;

//       setAuthed(false);
//       setInitialRouteName("Login");
//       setSessionRestoreReady(true);
//     };

//     const restoreWordScrambleSession = async () => {
//       try {
//         if (await isLoggedOut()) {
//           goToLogin();
//           return;
//         }
//       } catch {}

//       try {
//         const savedJson = await AsyncStorage.getItem(SAVED_PLAYER_JSON_KEY);

//         const savedId = await AsyncStorage.getItem(SAVED_PLAYER_ID_KEY);

//         if (!savedJson && !savedId) {
//           goToLogin();
//           return;
//         }
//       } catch {
//         goToLogin();
//         return;
//       }

//       try {
//         await ensureAccount();
//       } catch (err) {
//         console.warn("Could not restore account:", err);

//         goToLogin();
//         return;
//       }

//       if (cancelled) return;

//       setAuthed(true);

//       refreshProfile();
//       refreshCbPlayer();
//       refreshStats();
//       refreshSettings();

//       let restoredRoute: keyof RootStackParamList = "Menu";

//       try {
//         let roomCode = await AsyncStorage.getItem(ACTIVE_WS_ROOM_KEY);

//         if (!roomCode) {
//           try {
//             const me = await fetchProfile();

//             if (me?.name) {
//               const active = await fetchActiveRoom(me.name);

//               roomCode = active?.roomCode ?? null;
//             }
//           } catch {}
//         }

//         if (roomCode) {
//           const [roomResponse, profile] = await Promise.all([
//             fetchRoom(roomCode),
//             fetchProfile(),
//           ]);

//           const room = extractRoom(roomResponse);

//           if (!room || !profile?.name) {
//             throw new Error(
//               "Could not restore the saved Word Scramble room."
//             );
//           }

//           if (cancelled) return;

//           const isMember = (room.players ?? []).some(
//             (p: any) => p.player_name === profile.name
//           );

//           if (!isMember) {
//             await clearRememberedWordScrambleRoom();

//             throw new Error("Saved room belongs to another player.");
//           }

//           setWsProfile(profile);
//           setWsRoom(room);

//           setWsLivesLeft(
//             typeof room.lives === "number" ? room.lives : DEFAULT_LIVES
//           );

//           if (room.status === "in_progress") {
//             const response = await startGame(room.roomCode || roomCode);

//             const round = extractRound(response);

//             if (!round) {
//               throw new Error("The active round could not be restored.");
//             }

//             if (!round.totalRounds) {
//               round.totalRounds =
//                 room.totalRounds ?? DEFAULT_WS_GAME_CONFIG.totalRounds;
//             }

//             if (!round.timeLimitSec) {
//               round.timeLimitSec =
//                 room.timeLimitSec ?? DEFAULT_WS_GAME_CONFIG.timeLimitSec;
//             }

//             setWsGameConfig({
//               totalRounds: round.totalRounds,
//               timeLimitSec: round.timeLimitSec,
//             });

//             setWsLivesLeft(
//               typeof round.lives === "number"
//                 ? round.lives
//                 : room.lives ?? DEFAULT_LIVES
//             );

//             setWsRound(round);

//             restoredRoute = "WsGame";
//           } else if (room.status === "waiting") {
//             setWsRound(null);

//             restoredRoute = "RoomWaiting";
//           } else if (room.status === "finished") {
//             setWsRoom(null);
//             setWsRound(null);

//             await clearRememberedWordScrambleRoom();
//           }
//         }
//       } catch (err) {
//         console.warn("Could not restore Word Scramble session:", err);
//       } finally {
//         if (!cancelled) {
//           setInitialRouteName(restoredRoute);

//           setSessionRestoreReady(true);
//         }
//       }
//     };

//     restoreWordScrambleSession();

//     return () => {
//       cancelled = true;
//     };

//   }, []);

  

//   const makeHandleNav = (navigation: any) => (key: NavKey) => {
//     feedback("tap");

//     if (key === "home") {
//       refreshCbPlayer();

//       navigation.navigate("Home");

//       return;
//     }

//     if (key === "levels") {
//       navigation.navigate("Levels");

//       return;
//     }

//     if (key === "settings") {
//       refreshSettings();

//       navigation.navigate("Settings");

//       return;
//     }
//   };

//   const shell = (
//     navigation: any,
//     active: NavKey,
//     node: React.ReactNode
//   ) => (
//     <CodeBreakerShell active={active} onNavigate={makeHandleNav(navigation)}>
//       {node}
//     </CodeBreakerShell>
//   );

//   /* ============================================================
//      WORD SCRAMBLE NAVIGATION
//   ============================================================ */

//   const makeHandleWsNav = (navigation: any) => (key: WsNavKey) => {
//     if (key === "home") {
//       loadTopPlayers();
//       refreshProfile();

//       navigation.navigate("WordScrambleHome");

//       return;
//     }

//     if (key === "rankings") {
//       navigation.navigate("WsLeaderboard");

//       return;
//     }

//     if (key === "profile") {
//       navigation.navigate("Menu");

//       return;
//     }
//   };

//   const wsShell = (
//     navigation: any,
//     active: WsNavKey,
//     node: React.ReactNode
//   ) => (
//     <WordScrambleShell
//       active={active}
//       onNavigate={makeHandleWsNav(navigation)}
//       profile={wsProfile}
//     >
//       {node}
//     </WordScrambleShell>
//   );

  

//   const handleJoinRoom = async (
//     navigation: any,
//     code: string,
//     nameOverride?: string
//   ): Promise<boolean> => {
//     const name = nameOverride ?? (await ensurePlayerName());

//     if (!name) {
//       Alert.alert(
//         "Player name required",
//         "Unable to load your player profile."
//       );

//       return false;
//     }

//     try {
//       const response = await joinRoom(code.trim(), name);

//       const room = extractRoom(response);

//       if (!room) {
//         throw new Error("Server did not return room information.");
//       }

//       setWsRoom(room);

//       await rememberWordScrambleRoom(room.roomCode);

//       setWsLivesLeft(
//         typeof room.lives === "number" ? room.lives : DEFAULT_LIVES
//       );

//       setWsRound(null);
//       setGameStartError(null);

//       navigation.navigate("RoomWaiting");

//       return true;
//     } catch (err: any) {
//       console.warn("Join room failed:", err);

//       const msg = /not found/i.test(err?.message ?? "")
//         ? "Room not found. Please check the room code."
//         : err?.message ?? "Please check the room code.";

//       Alert.alert("Unable to join room", msg);

//       return false;
//     }
//   };

  

//   const handleGuestContinue = async (navigation: any, nickname: string) => {
//     try {
//       await registerGuest(nickname);
//     } catch (err: any) {
//       Alert.alert(
//         "Could not continue",
//         err?.message ?? "Unable to save your nickname."
//       );

//       return;
//     }

//     try {
//       await AsyncStorage.setItem(GUEST_NAME_KEY, nickname);
//     } catch {}

//     await resetWsSession();

//     setGuestName(nickname);
//     setIsGuest(true);

//     // Guest goes straight to the Join Room page
//     navigation.navigate("JoinRoom");
//   };

//   /* ============================================================
//      START WORD SCRAMBLE
//      (host taps Start, guests are auto-started by RoomWaitingScreen)
//   ============================================================ */

//   const handleStartGame = useCallback(
//     async (navigation: any) => {
//       if (!wsRoom) {
//         Alert.alert(
//           "Room not found",
//           "Please create or join a room first."
//         );

//         return;
//       }

//       if (startingGame) return;

//       const me = await ensurePlayerName();

//       const isMember = (wsRoom.players ?? []).some(
//         (p: any) => p.player_name === me
//       );

//       if (!me || !isMember) {
//         await resetWsSession();

//         Alert.alert(
//           "Room not available",
//           "This room belongs to another account. Please create or join a room again."
//         );

//         navigation.navigate("WordScrambleHome");

//         return;
//       }

//       setStartingGame(true);
//       setGameStartError(null);

//       try {
//         const response = await startGame(wsRoom.roomCode);

//         const round = extractRound(response);

//         if (!round) {
//           throw new Error("Backend did not return the first round.");
//         }

//         if (round.id === null || round.id === undefined) {
//           throw new Error("Round ID is missing from backend response.");
//         }

//         if (!round.roundNumber) {
//           round.roundNumber = 1;
//         }

//         if (!round.totalRounds) {
//           round.totalRounds =
//             wsRoom.totalRounds ?? DEFAULT_WS_GAME_CONFIG.totalRounds;
//         }

//         if (!round.timeLimitSec) {
//           round.timeLimitSec =
//             wsRoom.timeLimitSec ?? DEFAULT_WS_GAME_CONFIG.timeLimitSec;
//         }

//         setWsGameConfig({
//           totalRounds: round.totalRounds,
//           timeLimitSec: round.timeLimitSec,
//         });

//         const lives =
//           typeof round.lives === "number"
//             ? round.lives
//             : typeof wsRoom.lives === "number"
//             ? wsRoom.lives
//             : DEFAULT_LIVES;

//         setWsLivesLeft(lives);
//         setWsRound(round);
//         setGameStartError(null);

//         navigation.navigate("WsGame");
//       } catch (err: any) {
//         console.error("START GAME ERROR:", err);

//         const message = err?.message ?? "Unable to start the game.";

//         setGameStartError(message);

//         Alert.alert("Unable to start game", message);
//       } finally {
//         setStartingGame(false);
//       }
//     },
//     [wsRoom, startingGame, ensurePlayerName, resetWsSession]
//   );

 

//   const prepareSinglePlayer = useCallback(async () => {
//     const name = await ensurePlayerName();

//     if (!name) {
//       setSpError("Unable to load your player profile.");

//       return;
//     }

//     setSpLoading(true);
//     setSpError(null);
//     setGameStartError(null);
//     setWsRound(null);

//     try {
//       // CHANGED: maxPlayers 1 (was 2). With 2, the backend start route
//       // answered "Waiting for all players to join (1/2)".
//       // NOTE: backend must allow maxPlayers = 1 in POST /rooms
//       // (MIN_ROOM_PLAYERS = 1 in Wordscrambleroutes.js).
//       const roomResponse = await createRoom({
//         roomName: "Single Player",

//         roomType: "private",

//         maxPlayers: 1,

//         totalRounds: DEFAULT_WS_GAME_CONFIG.totalRounds,

//         playerName: name,
//       });

//       const room = extractRoom(roomResponse);

//       if (!room) {
//         throw new Error("Server did not return room data.");
//       }

//       setWsRoom(room);

//       await rememberWordScrambleRoom(room.roomCode);

//       const response = await startGame(room.roomCode);

//       const round = extractRound(response);

//       if (!round) {
//         throw new Error("Backend did not return the first round.");
//       }

//       if (round.id === null || round.id === undefined) {
//         throw new Error("Round ID is missing from backend response.");
//       }

//       if (!round.roundNumber) {
//         round.roundNumber = 1;
//       }

//       if (!round.totalRounds) {
//         round.totalRounds =
//           room.totalRounds ?? DEFAULT_WS_GAME_CONFIG.totalRounds;
//       }

//       if (!round.timeLimitSec) {
//         round.timeLimitSec =
//           room.timeLimitSec ?? DEFAULT_WS_GAME_CONFIG.timeLimitSec;
//       }

//       setWsGameConfig({
//         totalRounds: round.totalRounds,
//         timeLimitSec: round.timeLimitSec,
//       });

//       setWsLivesLeft(
//         typeof round.lives === "number"
//           ? round.lives
//           : typeof room.lives === "number"
//           ? room.lives
//           : DEFAULT_LIVES
//       );

//       // Round ready -> Start button on the Level screen becomes active
//       setWsRound(round);
//     } catch (err: any) {
//       console.error("SINGLE PLAYER ERROR:", err);

//       setSpError(err?.message ?? "Unable to start single player.");
//     } finally {
//       setSpLoading(false);
//     }
//   }, [ensurePlayerName]);

//   const handleSinglePlayer = async (navigation: any) => {
//     if (spLoading) return;

//     setIsGuest(false);
//     setWsRoom(null);
//     setWsRound(null);
//     setSpError(null);

//     // Show the Level 1 screen first; the round loads behind it
//     navigation.navigate("WsLevelStart");

//     await prepareSinglePlayer();
//   };

//   /* ============================================================
//      NEXT ROUND
//   ============================================================ */

//   const advanceToNextRound = useCallback(
//     async (navigation: any, skipAhead = 0) => {
//       if (!wsRoom || !wsRound) {
//         return;
//       }

//       try {
//         const response = await nextRound(wsRoom.roomCode, {
//           fromRoundId: wsRound.id,

//           skip: skipAhead,
//         });

//         console.log("nextRound() response:", JSON.stringify(response));

//         if (response?.finished === true || response?.gameFinished === true) {
//           setWsRound(null);

//           navigation.navigate("WsGameOver");

//           return;
//         }

//         const nextRoundData = extractRound(response);

//         if (!nextRoundData) {
//           throw new Error("Backend did not return the next round.");
//         }

//         if (nextRoundData.id === null || nextRoundData.id === undefined) {
//           throw new Error("Next round ID is missing.");
//         }

//         if (!nextRoundData.roundNumber) {
//           nextRoundData.roundNumber = wsRound.roundNumber + 1;
//         }

//         if (!nextRoundData.totalRounds) {
//           nextRoundData.totalRounds =
//             wsRound.totalRounds ?? wsGameConfig.totalRounds;
//         }

//         if (!nextRoundData.timeLimitSec) {
//           nextRoundData.timeLimitSec =
//             wsRound.timeLimitSec ?? wsGameConfig.timeLimitSec;
//         }

//         const hasLetters =
//           Array.isArray(nextRoundData.letters) &&
//           nextRoundData.letters.length > 0;

//         const hasWord = !!(
//           nextRoundData.word ||
//           nextRoundData.scrambled ||
//           nextRoundData.scrambledWord
//         );

//         if (!hasLetters && !hasWord) {
//           throw new Error("The next round's puzzle data was empty.");
//         }

//         if (typeof nextRoundData.lives === "number") {
//           setWsLivesLeft(nextRoundData.lives);
//         }

//         setWsRound(nextRoundData);
//       } catch (err: any) {
//         console.warn("Next round failed:", err);

//         Alert.alert(
//           "Next round failed",
//           err?.message ?? "Unable to load the next round."
//         );
//       }
//     },
//     [wsRoom, wsRound, wsGameConfig]
//   );

 

//   if (!sessionRestoreReady) {
//     return <GameLoadingScreen />;
//   }



//   return (
//     <ErrorBoundary label="Word Scramble">
//       <NavigationContainer
//         linking={linking}
//         fallback={<GameLoadingScreen />}
//       >
//         <Stack.Navigator
//           // Re-create the navigation stack when authentication changes.
//           // This prevents the previous Word Scramble route from being
//           // restored after Login / Create Account success.
//           key={authed ? "authenticated" : "unauthenticated"}
//           screenOptions={{
//             headerShown: false,
//           }}
//           // CHANGED: group guests start at JoinRoom, everyone else at Menu
//           initialRouteName={authed ? postAuthRoute : "Login"}
//         >
//           {!authed ? (
//             <>
//               {/* =====================================================
//                   LOGIN
//               ===================================================== */}

//               <Stack.Screen name="Login">
//                 {({ navigation }) => (
//                   <LoginScreen
//                     onLoginPress={() => {
//                       console.log("LOGIN PRESS -> CreateAccount");

//                       navigation.navigate("CreateAccount");
//                     }}
//                     // NEW: Play as Guest -> Create as Player / Join as Group
//                     onGuestPress={() => {
//                       navigation.navigate("GuestChoice");
//                     }}
//                     onLogin={(user) => {
//                       void handleAuthSuccess(user, "LoginScreen (guest)");
//                     }}
//                   />
//                 )}
//               </Stack.Screen>

//               {/* =====================================================
//                   CREATE ACCOUNT
//               ===================================================== */}

//               <Stack.Screen name="CreateAccount">
//                 {({ navigation }) => (
//                   <CreateAccountScreen
//                     onBack={() => {
//                       if (navigation.canGoBack()) {
//                         navigation.goBack();
//                       } else {
//                         navigation.navigate("Login");
//                       }
//                     }}
//                     onLogin={(user) => {
//                       void handleAuthSuccess(user, "CreateAccount");
//                     }}
//                   />
//                 )}
//               </Stack.Screen>

             

//               <Stack.Screen name="GuestChoice">
//                 {({ navigation }) => (
//                   <GuestChoiceScreen
//                     onBack={() => navigation.navigate("Login")}
//                     onCreatePlayer={() => {
//                       setGuestMode("player");

//                       navigation.navigate("GuestLogin");
//                     }}
//                     onJoinGroup={() => {
//                       setGuestMode("group");

//                       navigation.navigate("GuestLogin");
//                     }}
//                   />
//                 )}
//               </Stack.Screen>

//               {/* =====================================================
//                   GUEST LOGIN (NEW)
//                   Nickname page -> Menu (player) / Join Room (group)
//               ===================================================== */}

//               <Stack.Screen name="GuestLogin">
//                 {({ navigation }) => (
//                   <GuestLoginScreen
//                     mode={guestMode}
//                     onBack={() => navigation.navigate("GuestChoice")}
//                     onContinue={(nick) => {
//                       void handleGuestEntry(nick, guestMode);
//                     }}
//                   />
//                 )}
//               </Stack.Screen>
//             </>
//           ) : (
//             <>
            

//               <Stack.Screen name="Menu">
//                 {({ navigation }) => (
//                   <MenuScreen
//                     bestScore={stats.highScore}
//                     streak={stats.currentStreak}
//                     onSelectGame={(id) => {
//                       if (id === "code-breaker") {
//                         navigation.navigate("CodeBreakerSplash");
//                       }

//                       if (id === "word-scramble") {
//                         navigation.navigate("WordScrambleSplash");
//                       }

//                       if (id === "brain-twist") {
//                         void openBrainTwist(navigation);
//                       }
//                     }}
//                     onOpenProfile={() => {
//                       refreshStats();

//                       navigation.navigate("Profile");
//                     }}
//                   />
//                 )}
//               </Stack.Screen>

//               {/* =====================================================
//                   BRAIN TWIST SPLASH   ->  /brain-twist-splash
//               ===================================================== */}

//               <Stack.Screen name="BtSplash">
//                 {({ navigation }) => (
//                   <BTSplashScreen
//                     onDone={() => navigation.replace("BtHome")}
//                   />
//                 )}
//               </Stack.Screen>

              

//               <Stack.Screen name="BtHome">
//                 {({ navigation }) => !btPlayer ? (
//                   <RedirectTo navigation={navigation} to="Menu" />
//                 ) : (
//                   <BTHomeScreen
//                     n={btN}
//                     hints={btHints}
//                     err=""
//                     onHome={() =>
//                       navigation.reset({
//                         index: 0,
//                         routes: [{ name: "Menu" }],
//                       })
//                     }
//                     onLevels={() => navigation.navigate("BtLevels")}
//                     onGo={async () => {
//                       // always open the level the backend says is unlocked
//                       try {
//                         const m = await getMap(btPlayer.id);
//                         setBtN(m.currentLevel);
//                         setBtTotal(m.total);
//                       } catch (e) {}
//                       navigation.navigate("BtGame");
//                     }}
//                   />
//                 )}
//               </Stack.Screen>

//               {/* =====================================================
//                   BRAIN TWIST LEVEL MAP   ->  /brain-twist/levels
//               ===================================================== */}

//               <Stack.Screen name="BtLevels">
//                 {({ navigation }) => !btPlayer ? (
//                   <RedirectTo navigation={navigation} to="Menu" />
//                 ) : (
//                   <BTLevelMapScreen
//                     playerId={btPlayer.id}
//                     onBack={() => navigation.goBack()}
//                     onPlay={(n: number) => {
//                       setBtN(n);
//                       navigation.navigate("BtGame");
//                     }}
//                   />
//                 )}
//               </Stack.Screen>

           

//               <Stack.Screen name="BtGame">
//                 {({ navigation }) => !btPlayer ? (
//                   <RedirectTo navigation={navigation} to="Menu" />
//                 ) : (
//                   <BTGameScreen
//                     key={btN + '-' + btRun}
//                     n={btN}
//                     player={btPlayer}
//                     hints={btHints}
//                     setHints={setBtHints}
//                     onHome={() => navigation.navigate("BtHome")}
//                     onWin={async (_result: any, stats: any) => {
//                       // SKIP (or SUBMIT when BT_SHOW_COMPLETE_SCREEN is false):
//                       // no "LEVEL COMPLETE" screen, open the next unlocked level directly
//                       if (stats?.skipped || !BT_SHOW_COMPLETE_SCREEN) {
//                         try {
//                           // backend already saved the result + unlocked the next level
//                           const m = await getMap(btPlayer.id);
//                           setBtTotal(m.total);

//                           if (!m.finished) {
//                             setBtN(m.currentLevel);   // next level that is not completed yet (ex: Level 3)
//                             setBtRun((r) => r + 1);   // fresh game even if same level number
//                             navigation.replace("BtGame");
//                             return;
//                           }
//                         } catch (e) {}

//                         // all levels done / network error
//                         navigation.navigate("BtHome");
//                         return;
//                       }

//                       // normal win -> LEVEL COMPLETE screen
//                       navigation.navigate("BtWin", { stats });
//                     }}
//                   />
//                 )}
//               </Stack.Screen>

//               {/* =====================================================
//                   BRAIN TWIST LEVEL COMPLETE   ->  /brain-twist/complete
//               ===================================================== */}

//               <Stack.Screen name="BtWin">
//                 {({ navigation, route }) => {
//                   if (!btPlayer) {
//                     return <RedirectTo navigation={navigation} to="Menu" />;
//                   }

//                   const hasNext = btN < btTotal;

//                   return (
//                     <BTCongratsScreen
//                       key={btN}
//                       n={btN}
//                       hints={btHints}
//                       playerId={btPlayer?.id}
//                       stats={route.params?.stats}
//                       hasNext={hasNext}
//                       onNext={async () => {
//                         // the backend has already saved the win and unlocked the next level
//                         let next = hasNext ? btN + 1 : 0;
//                         try {
//                           const m = await getMap(btPlayer.id);
//                           setBtTotal(m.total);
//                           next = m.finished ? 0 : m.currentLevel;
//                         } catch (e) {}

//                         if (next) {
//                           setBtN(next);
//                           navigation.replace("BtGame");
//                         } else {
//                           navigation.navigate("BtHome");
//                         }
//                       }}
//                       onHome={async () => {
//                         // win aana apram Ready screen la correct next level kaattanum
//                         try {
//                           const m = await getMap(btPlayer.id);
//                           setBtN(m.currentLevel);
//                           setBtTotal(m.total);
//                         } catch (e) {}
//                         navigation.navigate("BtHome");
//                       }}
//                     />
//                   );
//                 }}
//               </Stack.Screen>

            

//               <Stack.Screen name="CodeBreakerSplash">
//                 {({ navigation }) => (
//                   <SplashScreen
//                     onFinish={() => {
//                       refreshCbPlayer();

//                       navigation.replace("Home");
//                     }}
//                   />
//                 )}
//               </Stack.Screen>

           

//               <Stack.Screen name="WordScrambleSplash">
//                 {({ navigation }) => (
//                   <WordScrambleSplashScreen
//                     onFinish={() => {
//                       loadTopPlayers();

//                       refreshProfile();

//                       setIsGuest(false);

//                       navigation.replace("WordScrambleHome");
//                     }}
//                   />
//                 )}
//               </Stack.Screen>

//               {/* =====================================================
//                   LEVELS
//               ===================================================== */}

//               <Stack.Screen name="Levels">
//                 {({ navigation }) =>
//                   shell(
//                     navigation,
//                     "levels",
//                     <LevelMapScreen
//                       darkMode={settings.darkMode}
//                       onBack={() => navigation.navigate("Home")}
//                       onSelect={(level) => {
//                         feedback("tap");

//                         setSelectedLevel(level);

//                         navigation.navigate("Game");
//                       }}
//                     />
//                   )
//                 }
//               </Stack.Screen>

          

//               <Stack.Screen name="Game">
//                 {({ navigation }) =>
//                   shell(
//                     navigation,
//                     "levels",
//                     <GameScreen
//                       difficulty={difficulty}
//                       level={selectedLevel}
//                       darkMode={settings.darkMode}
//                       onBack={() => navigation.navigate("Levels")}
//                       onExitToMenu={() =>
//                         navigation.reset({
//                           index: 0,
//                           routes: [{ name: "Menu" }],
//                         })
//                       }
//                       onWin={() => {
//                         refreshStats();

//                         navigation.navigate("Levels");

//                         setTimeout(() => {
//                           openGift();
//                         }, 350);
//                       }}
//                       onLose={() => {
//                         refreshStats();

//                         navigation.navigate("Levels");
//                       }}
//                     />
//                   )
//                 }
//               </Stack.Screen>

           

//               <Stack.Screen name="WrongGuess">
//                 {({ navigation }) =>
//                   shell(
//                     navigation,
//                     "levels",
//                     <WrongGuessScreen
//                       attemptsLeft={attemptsLeft}
//                       darkMode={settings.darkMode}
//                       onTryAgain={() => navigation.navigate("Game")}
//                     />
//                   )
//                 }
//               </Stack.Screen>

            

//               <Stack.Screen name="Stats">
//                 {({ navigation }) =>
//                   shell(
//                     navigation,
//                     "home",
//                     <StatsScreen
//                       stats={stats}
//                       darkMode={settings.darkMode}
//                       onBack={() => navigation.navigate("Home")}
//                     />
//                   )
//                 }
//               </Stack.Screen>


//               <Stack.Screen name="Settings">
//                 {({ navigation }) =>
//                   shell(
//                     navigation,
//                     "settings",
//                     <SettingsScreen
//                       settings={settings}
//                       onChange={(next) => {
//                         setSettings(next);

//                         apiUpdateSettings(next).catch((err: unknown) =>
//                           console.warn("Failed to save settings:", err)
//                         );
//                       }}
//                       onBack={() => navigation.navigate("Home")}
//                       onResetStats={() => {
//                         apiResetStats()
//                           .then(() => refreshStats())
//                           .catch((err: unknown) =>
//                             console.warn("Failed to reset stats:", err)
//                           );
//                       }}
//                     />
//                   )
//                 }
//               </Stack.Screen>

            

//               <Stack.Screen name="Profile">
//                 {({ navigation }) => (
//                   <ProfileScreen
//                     stats={stats}
//                     onBack={() => {
//                       if (navigation.canGoBack()) {
//                         navigation.goBack();
//                       } else {
//                         navigation.navigate("Menu");
//                       }
//                     }}
//                     onTabHome={() => navigation.navigate("Menu")}
//                     onTabGames={() => navigation.navigate("Menu")}
//                     onOpenSettings={() => {
//                       refreshSettings();

//                       navigation.navigate("Settings");
//                     }}
//                     onLogout={async () => {
//                       await clearSessionState();

//                       setInitialRouteName("Login");

//                       setAuthed(false);
//                     }}
//                   />
//                 )}
//               </Stack.Screen>

             

//               <Stack.Screen name="WordScrambleHome">
//                 {({ navigation }) => (
//                   <WordScrambleHomeScreen
//                     topPlayers={topPlayers}
//                     onBack={() => navigation.navigate("Menu")}
//                     onPlayOnline={() => {
//                       setIsGuest(false);

//                       // CHANGED: Multiplayer goes straight to Create / Join Room
//                       navigation.navigate("RoomOptions");
//                     }}
//                     onGuestPlay={() => {
//                       void handleSinglePlayer(navigation);
//                     }}
//                     onViewAllPlayers={() =>
//                       navigation.navigate("WsLeaderboard")
//                     }
//                     onTabHome={() => navigation.navigate("WordScrambleHome")}
//                     onTabLeaderboard={() =>
//                       navigation.navigate("WsLeaderboard")
//                     }
//                     onTabProfile={() => navigation.navigate("Menu")}
//                   />
//                 )}
//               </Stack.Screen>

//               {/* =====================================================
//                   LEVEL START (NEW)
//                   Single Player -> this screen -> tap Level 1 -> WsGame
//               ===================================================== */}

//               <Stack.Screen name="WsLevelStart">
//                 {({ navigation }) => (
//                   <LevelStartScreen
//                     level={wsRound ? wsRound.roundNumber : null}
//                     loading={spLoading}
//                     error={spError}
//                     onStart={() => {
//                       if (!wsRound) return;

//                       navigation.navigate("WsGame");
//                     }}
//                     onRetry={() => {
//                       void prepareSinglePlayer();
//                     }}
//                     onBack={() => {
//                       void resetWsSession();

//                       setSpError(null);
//                       setSpLoading(false);

//                       navigation.navigate("WordScrambleHome");
//                     }}
//                   />
//                 )}
//               </Stack.Screen>

            

//               <Stack.Screen name="GuestNickname">
//                 {({ navigation }) => (
//                   <GuestNicknameScreen
//                     defaultName={guestName}
//                     onBack={() => navigation.navigate("RoomOptions")}
//                     onContinue={(nick) =>
//                       handleGuestContinue(navigation, nick)
//                     }
//                   />
//                 )}
//               </Stack.Screen>

             

//               <Stack.Screen name="RoomOptions">
//                 {({ navigation }) => (
//                   <RoomOptionsScreen
//                     guestName={isGuest ? guestName : null}
//                     onBack={() => navigation.navigate("WordScrambleHome")}
//                     onCreate={() => navigation.navigate("CreateRoom")}
//                     onJoin={() => navigation.navigate("JoinRoom")}
//                     onChangeName={() => navigation.navigate("GuestNickname")}
//                   />
//                 )}
//               </Stack.Screen>


//               <Stack.Screen name="JoinRoom">
//                 {({ navigation }) => (
//                   <JoinRoomScreen
//                     onBack={async () => {
//                       if (groupGuest) {
//                         await clearSessionState();

//                         setInitialRouteName("Login");

//                         setAuthed(false);

//                         return;
//                       }

//                       navigation.navigate(
//                         isGuest ? "GuestNickname" : "RoomOptions"
//                       );
//                     }}
//                     onJoin={(code) => handleJoinRoom(navigation, code)}
//                   />
//                 )}
//               </Stack.Screen>

             

//               <Stack.Screen name="RoomCreated">
//                 {({ navigation }) => {
//                   if (!wsRoom) {
//                     return (
//                       <RedirectTo
//                         navigation={navigation}
//                         to="WordScrambleHome"
//                       />
//                     );
//                   }

//                   return (
//                     <RoomCreatedScreen
//                       roomName={
//                         (wsRoom as any).roomName ??
//                         (wsRoom as any).room_name ??
//                         "Your Room"
//                       }
//                       roomCode={wsRoom.roomCode}
//                       onBack={() => navigation.navigate("RoomOptions")}
//                       onContinue={() => navigation.navigate("RoomWaiting")}
//                     />
//                   );
//                 }}
//               </Stack.Screen>

            

//               <Stack.Screen name="CreateRoom">
//                 {({ navigation }) => (
//                   <CreateRoomScreen
//                     onBack={() => navigation.navigate("RoomOptions")}
//                     onCreateRoom={async (config: CreateRoomConfig) => {
//                       const name = await ensurePlayerName();

//                       if (!name) {
//                         Alert.alert(
//                           "Player name required",
//                           "Unable to load your player profile."
//                         );

//                         return;
//                       }

//                       try {
//                         const response = await createRoom({
//                           roomName: config.roomName,

//                           roomType: config.roomType,

//                           maxPlayers: config.numberOfPlayers,

//                           totalRounds: config.rounds,

//                           playerName: name,
//                         });

//                         const room = extractRoom(response);

//                         if (!room) {
//                           throw new Error("Server did not return room data.");
//                         }

//                         setWsRoom(room);

//                         await rememberWordScrambleRoom(room.roomCode);

//                         setWsRound(null);

//                         setWsLivesLeft(
//                           typeof room.lives === "number"
//                             ? room.lives
//                             : DEFAULT_LIVES
//                         );

//                         setGameStartError(null);

//                         navigation.navigate("RoomCreated");
//                       } catch (err: any) {
//                         console.warn("Create room failed:", err);

//                         // CreateRoomScreen catches this and shows the
//                         // message in a red box under the form.
//                         throw err;
//                       }
//                     }}
//                     onJoinRoom={(code) => {
//                       void handleJoinRoom(navigation, code);
//                     }}
//                     onTabHome={() => navigation.navigate("WordScrambleHome")}
//                     onTabLeaderboard={() =>
//                       navigation.navigate("WsLeaderboard")
//                     }
//                     onTabProfile={() => navigation.navigate("Menu")}
//                   />
//                 )}
//               </Stack.Screen>

             

//               <Stack.Screen name="RoomWaiting">
//                 {({ navigation }) => {
//                   if (!wsRoom) {
//                     return (
//                       <RedirectTo
//                         navigation={navigation}
//                         to="WordScrambleHome"
//                       />
//                     );
//                   }

//                   return wsShell(
//                     navigation,
//                     "home",
//                     <RoomWaitingScreen
//                       room={wsRoom}
//                       playerName={playerName}
//                       onBack={() => navigation.navigate("WordScrambleHome")}
//                       onStartGame={() => handleStartGame(navigation)}
//                       onOpenChat={() => navigation.navigate("WsChat")}
//                       onOpenRoomSettings={() =>
//                         navigation.navigate("WsRoomSettings")
//                       }
//                     />
//                   );
//                 }}
//               </Stack.Screen>

            

//               <Stack.Screen name="WsGame">
//                 {({ navigation }) => {
//                   if (!wsRound) {
//                     if (!wsRoom) {
//                       return (
//                         <RedirectTo
//                           navigation={navigation}
//                           to="WordScrambleHome"
//                         />
//                       );
//                     }

//                     return (
//                       <GameErrorScreen
//                         message={
//                           gameStartError ??
//                           "The server did not return a valid game round."
//                         }
//                         onBack={() => navigation.navigate("WordScrambleHome")}
//                         onRetry={() => handleStartGame(navigation)}
//                       />
//                     );
//                   }

//                   return (
//                     <GamePlayScreen
//                       playerName={playerName}
//                       round={wsRound as any}
//                       players={(wsRoom?.players ?? []).map((player) => ({
//                         player_name: player.player_name,

//                         score: Number(player.score ?? 0),
//                       }))}
//                       livesLeft={wsLivesLeft}
//                       onRoundEnd={(answer, isCorrect, livesLeft, opts) => {
//                         setWsLivesLeft(livesLeft);

//                         if (isCorrect) {
//                           advanceToNextRound(navigation, opts?.skipAhead ?? 0);

//                           return;
//                         }

//                         if (livesLeft <= 0) {
//                           navigation.navigate("WsGameOver");

//                           return;
//                         }

//                         if (!wsRoom || !wsRound) {
//                           return;
//                         }

//                         retryRound(String(wsRound.id), wsRoom.roomCode)
//                           .then((response) => {
//                             const retryData = extractRound(response);

//                             if (!retryData) {
//                               throw new Error(
//                                 "Backend did not return the retried round."
//                               );
//                             }

//                             retryData.roundNumber = wsRound.roundNumber;

//                             retryData.totalRounds = wsRound.totalRounds;

//                             retryData.timeLimitSec = wsRound.timeLimitSec;

//                             if (typeof retryData.lives === "number") {
//                               setWsLivesLeft(retryData.lives);
//                             }

//                             setWsRound(retryData);
//                           })
//                           .catch((err: any) => {
//                             console.warn("Retry after timeout failed:", err);

//                             Alert.alert(
//                               "Retry failed",
//                               err?.message ?? "Unable to load a new round."
//                             );
//                           });
//                       }}
//                       // NEW: Exit -> Yes -> go to Menu screen
//                       onQuit={() => {
//                         // 1. Navigate first; reset the stack so Back can't
//                         //    return to the game
//                         navigation.reset({
//                           index: 0,
//                           routes: [{ name: "Menu" }],
//                         });

//                         // 2. Then clear the saved room / round state
//                         void clearRememberedWordScrambleRoom();

//                         setWsRoom(null);
//                         setWsRound(null);
//                         setWsLivesLeft(DEFAULT_LIVES);
//                         setGameStartError(null);
//                       }}
//                     />
//                   );
//                 }}
//               </Stack.Screen>

             

//               <Stack.Screen name="RoundComplete">
//                 {({ navigation }) => {
//                   if (!wsRound) {
//                     return (
//                       <RedirectTo
//                         navigation={navigation}
//                         to="WordScrambleHome"
//                       />
//                     );
//                   }

//                   return (
//                     <RoundCompleteScreen
//                       roundId={Number(wsRound.id)}
//                       playerName={playerName}
//                       onNextRound={async (isCorrect: boolean) => {
//                         if (!wsRoom) {
//                           console.warn("Cannot continue: room missing.");

//                           return;
//                         }

//                         if (wsRound.id === null || wsRound.id === undefined) {
//                           Alert.alert("Round error", "Round ID is missing.");

//                           return;
//                         }

//                         try {
//                           if (isCorrect) {
//                             await advanceToNextRound(navigation);

//                             navigation.navigate("WsGame");

//                             return;
//                           }

//                           const response = await retryRound(
//                             String(wsRound.id),
//                             wsRoom.roomCode
//                           );

//                           const retryData = extractRound(response);

//                           if (!retryData) {
//                             throw new Error(
//                               "Backend did not return the retried round."
//                             );
//                           }

//                           retryData.roundNumber = wsRound.roundNumber;

//                           retryData.totalRounds = wsRound.totalRounds;

//                           retryData.timeLimitSec = wsRound.timeLimitSec;

//                           if (typeof retryData.lives === "number") {
//                             setWsLivesLeft(retryData.lives);
//                           }

//                           setWsRound(retryData);

//                           navigation.navigate("WsGame");
//                         } catch (err: any) {
//                           console.warn(
//                             isCorrect
//                               ? "Next round failed:"
//                               : "Retry failed:",
//                             err
//                           );

//                           Alert.alert(
//                             isCorrect ? "Next round failed" : "Retry failed",

//                             err?.message ?? "Unable to load the round."
//                           );
//                         }
//                       }}
//                     />
//                   );
//                 }}
//               </Stack.Screen>

            

//               <Stack.Screen name="WsGameOver">
//                 {({ navigation }) => {
//                   if (!wsRoom) {
//                     return (
//                       <RedirectTo
//                         navigation={navigation}
//                         to="WordScrambleHome"
//                       />
//                     );
//                   }

//                   return (
//                     <GameOverScreen
//                       roomCode={wsRoom.roomCode}
//                       playerName={playerName}
//                       onRematch={() => {
//                         setWsRound(null);

//                         setGameStartError(null);

//                         setWsLivesLeft(
//                           typeof wsRoom.lives === "number"
//                             ? wsRoom.lives
//                             : DEFAULT_LIVES
//                         );

//                         navigation.navigate("RoomWaiting");
//                       }}
//                       onHome={() => {
//                         refreshProfile();
//                         loadTopPlayers();

//                         void clearRememberedWordScrambleRoom();

//                         setWsRoom(null);

//                         setWsRound(null);

//                         setWsLivesLeft(DEFAULT_LIVES);

//                         navigation.navigate("WordScrambleHome");
//                       }}
//                     />
//                   );
//                 }}
//               </Stack.Screen>

//               {/* =====================================================
//                   CHAT
//               ===================================================== */}

//               <Stack.Screen name="WsChat">
//                 {({ navigation }) => {
//                   if (!wsRoom) {
//                     return (
//                       <RedirectTo
//                         navigation={navigation}
//                         to="WordScrambleHome"
//                       />
//                     );
//                   }

//                   return wsShell(
//                     navigation,
//                     "home",
//                     <RoomChatScreen
//                       roomCode={wsRoom.roomCode}
//                       playerName={playerName}
//                       onBack={() => navigation.navigate("RoomWaiting")}
//                     />
//                   );
//                 }}
//               </Stack.Screen>

            

//               <Stack.Screen name="WsRoomSettings">
//                 {({ navigation }) => {
//                   if (!wsRoom) {
//                     return (
//                       <RedirectTo
//                         navigation={navigation}
//                         to="WordScrambleHome"
//                       />
//                     );
//                   }

//                   return wsShell(
//                     navigation,
//                     "home",
//                     <RoomSettingsScreen
//                       room={{
//                         ...wsRoom,

//                         timePerRoundSec:
//                           (wsRoom as any).timePerRoundSec ??
//                           wsGameConfig.timeLimitSec,
//                       }}
//                       playerName={playerName}
//                       onBack={() => navigation.navigate("RoomWaiting")}
//                       onRoomUpdated={(updatedRoom: any) => {
//                         const room = updatedRoom?.room ?? updatedRoom;

//                         setWsRoom(room as WordScrambleRoom);
//                       }}
//                       onLeaveRoom={() => {
//                         void clearRememberedWordScrambleRoom();

//                         setWsRoom(null);

//                         setWsRound(null);

//                         navigation.navigate("WordScrambleHome");
//                       }}
//                     />
//                   );
//                 }}
//               </Stack.Screen>

//               {/* =====================================================
//                   LEADERBOARD
//               ===================================================== */}

//               <Stack.Screen name="WsLeaderboard">
//                 {({ navigation }) =>
//                   wsShell(
//                     navigation,
//                     "rankings",
//                     <LeaderboardScreen
//                       currentPlayerName={playerName}
//                       onBack={() => navigation.navigate("WordScrambleHome")}
//                     />
//                   )
//                 }
//               </Stack.Screen>

            

//               <Stack.Screen name="Home">
//                 {({ navigation }) =>
//                   shell(
//                     navigation,
//                     "home",
//                     <HomeScreen
//                       highScore={stats.highScore}
//                       gamesPlayed={stats.gamesPlayed}
//                       successRate={
//                         stats.gamesPlayed > 0
//                           ? Math.round(
//                               (stats.gamesWon / stats.gamesPlayed) * 100
//                             )
//                           : 0
//                       }
//                       playerName={cbPlayerName}
//                       darkMode={settings.darkMode}
//                       onBack={() => navigation.navigate("Menu")}
//                       onPlay={() => {
//                         feedback("tap");

//                         navigation.navigate("Levels");
//                       }}
//                       onStats={() => {
//                         feedback("tap");

//                         refreshStats();

//                         navigation.navigate("Stats");
//                       }}
//                       onSettings={() => {
//                         feedback("tap");

//                         refreshSettings();

//                         navigation.navigate("Settings");
//                       }}
//                       onProfile={() => {
//                         feedback("tap");

//                         refreshStats();

//                         navigation.navigate("Profile");
//                       }}
//                     />
//                   )
//                 }
//               </Stack.Screen>
//             </>
//           )}
//         </Stack.Navigator>
//       </NavigationContainer>

      

//       {showGift && (
//         <GiftRewardModal
//           coins={GIFT_REWARD_AMOUNT}
//           onClaim={claimGift}
//           onClose={closeGift}
//         />
//       )}
//     </ErrorBoundary>
//   );
// }



// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: "#FFF9F2",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 30,
//   },

//   loadingTitle: {
//     marginTop: 20,
//     fontSize: 22,
//     fontWeight: "800",
//     color: "#17213A",
//   },

//   loadingText: {
//     marginTop: 8,
//     fontSize: 15,
//     color: "#777",
//   },

//   errorContainer: {
//     flex: 1,
//     backgroundColor: "#FFF9F2",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 30,
//   },

//   errorIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#FFE4E6",
//     textAlign: "center",
//     textAlignVertical: "center",
//     fontSize: 36,
//     fontWeight: "900",
//     color: "#E11D48",
//   },

//   errorTitle: {
//     marginTop: 20,
//     fontSize: 24,
//     fontWeight: "900",
//     color: "#17213A",
//     textAlign: "center",
//   },

//   errorMessage: {
//     marginTop: 12,
//     fontSize: 15,
//     lineHeight: 22,
//     color: "#6B7280",
//     textAlign: "center",
//   },

//   errorButton: {
//     marginTop: 25,
//     backgroundColor: "#4F46E5",
//     paddingHorizontal: 35,
//     paddingVertical: 15,
//     borderRadius: 14,
//   },

//   errorButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "800",
//   },

//   backText: {
//     marginTop: 20,
//     color: "#4F46E5",
//     fontSize: 15,
//     fontWeight: "700",
//   },
// });
import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Difficulty } from "./src/types/game";

import {
  fetchStats,
  fetchSettings,
  updateSettings as apiUpdateSettings,
  resetStats as apiResetStats,
  StatsResponse,
  SettingsResponse,
} from "./src/api/api";

import CodeBreakerShell, { NavKey } from "./src/components/Sidebar";

import WordScrambleShell, {
  WsNavKey,
} from "./src/components/WordScrambleShell";

import { feedback, setFeedbackSettings } from "./src/utils/feedback";

import { fetchPlayer } from "./src/api/profileApi";

import { isLoggedOut, ensureAccount } from "./src/api/authApi";

import { fetchProfile, WsProfile } from "./src/api/wsProfileApi";

import GiftRewardModal from "./src/screens/GiftRewardModal";

import WordScrambleSplashScreen from "./src/screens/WordScrambleSplashScreen";

import WordScrambleHomeScreen, {
  TopPlayer,
} from "./src/screens/Wordscramblehomescreen";

import CreateRoomScreen, {
  CreateRoomConfig,
} from "./src/screens/Createroomscreen";

import RoomWaitingScreen from "./src/screens/Roomwaitingscreen";

import GamePlayScreen from "./src/screens/Gameplayscreen";

import RoundCompleteScreen from "./src/screens/Roundcompletescreen";

import GameOverScreen from "./src/screens/Gameoverscreen";

import RoomChatScreen from "./src/screens/Roomchatscreen";

import RoomSettingsScreen from "./src/screens/Roomsettingscreen";

import LeaderboardScreen from "./src/screens/Leaderboardscreen";

import SplashScreen from "./src/screens/SplashScreen";

import MenuScreen from "./src/screens/MenuScreen";

import HomeScreen from "./src/screens/HomeScreen";

import LevelMapScreen from "./src/screens/LevelMapScreen";

import GameScreen from "./src/screens/GameScreen";

import WrongGuessScreen from "./src/screens/WrongGuessScreen";

import StatsScreen from "./src/screens/StatsScreen";

import SettingsScreen from "./src/screens/SettingsScreen";

import ProfileScreen from "./src/screens/ProfileScreen";

import LoginScreen from "./src/screens/LoginScreen";

import CreateAccountScreen from "./src/screens/CreateAccountScreen";

// NEW: Level 1 "Start" screen shown after Single Player is tapped
import LevelStartScreen from "./src/screens/LevelStartScreen";

// NEW: guest flow screens
import GuestChoiceScreen from "./src/screens/GuestChoiceScreen";

import GuestLoginScreen from "./src/screens/GuestLoginScreen";

import { registerGuest } from "./src/api/guestApi";

// CHANGED: PlayModeScreen removed (Multiplayer now opens Room Options directly)
import {
  RoomOptionsScreen,
  GuestNicknameScreen,
  JoinRoomScreen,
  RoomCreatedScreen,
} from "./src/screens/WordScrambleFlowScreens";

import {
  createRoom,
  joinRoom,
  fetchRoom,
  fetchLeaderboard,
  startGame,
  nextRound,
  retryRound,
  fetchActiveRoom,
  WordScrambleRoom,
} from "./src/api/Wordscrambleapi";

import ErrorBoundary from "./src/components/ErrorBoundary";

// Brain Twist screens (now real routes in this navigator)
import BTSplashScreen from "./src/screens/braintwist/BTSplashScreen";
import BTHomeScreen from "./src/screens/braintwist/BTHomeScreen";
import BTGameScreen from "./src/screens/braintwist/BTGameScreen";
import BTCongratsScreen from "./src/screens/braintwist/BTCongratsScreen";
import * as btApi from "./src/screens/braintwist/api";
import BTLevelMapScreen from "./src/screens/braintwist/BTLevelMapScreen";
import { getMap } from "./src/screens/braintwist/mapApi";



export type RootStackParamList = {
  Login: undefined;
  CreateAccount: undefined;

  // NEW: guest flow
  GuestChoice: undefined;
  GuestLogin: undefined;

  Menu: undefined;

  // NEW: Who Is Lying?
  LiarGame: undefined;

  CodeBreakerSplash: undefined;
  WordScrambleSplash: undefined;

  Home: undefined;
  Levels: undefined;
  Game: undefined;
  WrongGuess: undefined;
  Stats: undefined;
  Settings: undefined;
  Profile: undefined;

  WordScrambleHome: undefined;

  // NEW: Single Player -> Level 1 Start screen
  WsLevelStart: undefined;

  RoomOptions: undefined;
  GuestNickname: undefined;
  JoinRoom: undefined;
  RoomCreated: undefined;
  CreateRoom: undefined;
  RoomWaiting: undefined;
  WsGame: undefined;
  RoundComplete: undefined;
  WsGameOver: undefined;
  WsChat: undefined;
  WsRoomSettings: undefined;
  WsLeaderboard: undefined;

  // Brain Twist
  BtSplash: undefined;
  BtHome: undefined;
  BtGame: undefined;
  BtLevels: undefined;
  BtWin: { stats: { tries: number; hints: number; skipped: boolean } };
};

const Stack = createNativeStackNavigator<RootStackParamList>();



const linking = {
  prefixes: [],

  config: {
    screens: {
      Login: "login",
      CreateAccount: "create-account",

      // NEW: guest flow
      GuestChoice: "guest-choice",
      GuestLogin: "guest-login",

      Menu: "",

      CodeBreakerSplash: "splash",
      WordScrambleSplash: "word-scramble-splash",

      Home: "home",
      Levels: "levels",
      Game: "game",
      WrongGuess: "wrong-guess",
      Stats: "stats",
      Settings: "settings",
      Profile: "profile",

      WordScrambleHome: "word-scramble",

      // NEW
      WsLevelStart: "level-start",

      RoomOptions: "room-options",
      GuestNickname: "guest",
      JoinRoom: "join-room",
      RoomCreated: "room-created",
      CreateRoom: "create-room",
      RoomWaiting: "room-waiting",
      WsGame: "play",
      RoundComplete: "round-complete",
      WsGameOver: "game-over",
      WsChat: "chat",
      WsRoomSettings: "room-settings",
      WsLeaderboard: "leaderboard",

      // Brain Twist
      BtSplash: "brain-twist-splash",
      BtHome: "brain-twist",
      BtGame: "brain-twist/play",
      BtLevels: "brain-twist/levels",
      BtWin: "brain-twist/complete",
    },
  },
};



export interface WordScrambleRound {
  id: string | number;
  roundNumber: number;
  totalRounds: number;
  timeLimitSec: number;
  word?: string;
  scrambledWord?: string;
  scrambled?: string;
  clue?: string;
  lives?: number;
  answer?: string;
  [key: string]: any;
}

/* ============================================================
   DEFAULT VALUES
============================================================ */

const EMPTY_STATS: StatsResponse = {
  highScore: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  avgAttempts: 0,
};

const DEFAULT_SETTINGS: SettingsResponse = {
  soundEnabled: true,
  hapticsEnabled: true,
  darkMode: true,
};

const DEFAULT_LIVES = 5;

const FALLBACK_AVATAR_COLORS = ["#F97066", "#3B82F6", "#2BC98A"];

const DEFAULT_WS_GAME_CONFIG = {
  totalRounds: 10,
  timeLimitSec: 20,
};

const ACTIVE_WS_ROOM_KEY = "code-breaker.active-word-scramble-room";

const SAVED_PLAYER_JSON_KEY = "cyber-mind-player";

const SAVED_PLAYER_ID_KEY = "cyber-mind-player-id";

/* ============================================================
   GIFT / COINS
============================================================ */

const COINS_STORAGE_KEY = "cyber-mind-coins";

const GIFT_REWARD_AMOUNT = 30;

/* ============================================================
   GUEST
============================================================ */

const GUEST_NAME_KEY = "cyber-mind-ws-guest-name";

/* ============================================================
   BRAIN TWIST
============================================================ */

const BT_START_HINTS = 50;

// true  = after a normal win show the "LEVEL COMPLETE" screen (NEXT button)
// false = after a win / submit go straight to the next unlocked level (e.g. Level 3)
// (skip always goes straight to the next level)
const BT_SHOW_COMPLETE_SCREEN = false;

/* ============================================================
   ROOM STORAGE
============================================================ */

const rememberWordScrambleRoom = async (roomCode: string) => {
  try {
    await AsyncStorage.setItem(ACTIVE_WS_ROOM_KEY, roomCode);
  } catch (err) {
    console.warn("Could not save active Word Scramble room:", err);
  }
};

const clearRememberedWordScrambleRoom = async () => {
  try {
    await AsyncStorage.removeItem(ACTIVE_WS_ROOM_KEY);
  } catch (err) {
    console.warn("Could not clear saved Word Scramble room:", err);
  }
};

/* ============================================================
   RESPONSE HELPERS
============================================================ */

function extractRoom(data: any): WordScrambleRoom | null {
  if (!data) return null;

  if (data.room) {
    return data.room as WordScrambleRoom;
  }

  return data as WordScrambleRoom;
}

function extractRound(data: any): WordScrambleRound | null {
  if (!data) return null;

  if (data.round) {
    return normalizeRound(data.round);
  }

  if (data.data?.round) {
    return normalizeRound(data.data.round);
  }

  if (data.data) {
    return normalizeRound(data.data);
  }

  return normalizeRound(data);
}

function normalizeRound(raw: any): WordScrambleRound | null {
  if (!raw) return null;

  return {
    ...raw,

    id: raw.id ?? raw.roundId ?? raw.round_id ?? null,

    roundNumber: Number(
      raw.roundNumber ?? raw.round_number ?? raw.round ?? 1
    ),

    totalRounds: Number(
      raw.totalRounds ??
        raw.total_rounds ??
        DEFAULT_WS_GAME_CONFIG.totalRounds
    ),

    timeLimitSec: Number(
      raw.timeLimitSec ??
        raw.time_limit_sec ??
        raw.timePerRoundSec ??
        raw.time_per_round_sec ??
        DEFAULT_WS_GAME_CONFIG.timeLimitSec
    ),

    word:
      raw.word ?? raw.answer ?? raw.correctWord ?? raw.correct_word ?? "",

    scrambledWord:
      raw.scrambledWord ?? raw.scrambled_word ?? raw.scrambled ?? "",

    scrambled:
      raw.scrambled ?? raw.scrambledWord ?? raw.scrambled_word ?? "",

    clue: raw.clue ?? raw.hint ?? "",
  };
}

/* ============================================================
   LOADING SCREEN
============================================================ */

function GameLoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4F46E5" />

      <Text style={styles.loadingTitle}>Starting game...</Text>

      <Text style={styles.loadingText}>Preparing your first round</Text>
    </View>
  );
}

/* ============================================================
   REDIRECT
============================================================ */

function RedirectTo({
  navigation,
  to,
}: {
  navigation: any;
  to: string;
}) {
  useEffect(() => {
    navigation.navigate(to);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <GameLoadingScreen />;
}

/* ============================================================
   GAME ERROR
============================================================ */

function GameErrorScreen({
  message,
  onBack,
  onRetry,
}: {
  message: string;
  onBack: () => void;
  onRetry: () => void;
}) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>!</Text>

      <Text style={styles.errorTitle}>Unable to start game</Text>

      <Text style={styles.errorMessage}>{message}</Text>

      <View style={styles.errorButton}>
        <Text style={styles.errorButtonText} onPress={onRetry}>
          Try Again
        </Text>
      </View>

      <Text style={styles.backText} onPress={onBack}>
        Back to room
      </Text>
    </View>
  );
}

/* ============================================================
   APP
============================================================ */

export default function App() {
  /* ============================================================
     CODE BREAKER STATE
  ============================================================ */

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  const [attemptsLeft, setAttemptsLeft] = useState<number>(3);

  const [stats, setStats] = useState<StatsResponse>(EMPTY_STATS);

  const [settings, setSettings] =
    useState<SettingsResponse>(DEFAULT_SETTINGS);

  const [cbPlayerName, setCbPlayerName] = useState<string>("Player");

  /* ============================================================
     WORD SCRAMBLE STATE
  ============================================================ */

  const [wsProfile, setWsProfile] = useState<WsProfile | null>(null);

  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);

  const [wsRoom, setWsRoom] = useState<WordScrambleRoom | null>(null);

  const [wsRound, setWsRound] = useState<WordScrambleRound | null>(null);

  const [wsGameConfig, setWsGameConfig] = useState(DEFAULT_WS_GAME_CONFIG);

  const [wsLivesLeft, setWsLivesLeft] = useState<number>(DEFAULT_LIVES);

  const [startingGame, setStartingGame] = useState(false);

  const [gameStartError, setGameStartError] = useState<string | null>(null);

  // NEW: Single Player "Level 1 Start" screen state
  const [spLoading, setSpLoading] = useState(false);

  const [spError, setSpError] = useState<string | null>(null);

  /* ============================================================
     AUTH STATE
  ============================================================ */

  const [sessionRestoreReady, setSessionRestoreReady] = useState(false);

  const [initialRouteName, setInitialRouteName] =
    useState<keyof RootStackParamList>("Login");

  const [authed, setAuthed] = useState<boolean>(false);

  

  const [showGift, setShowGift] = useState(false);

  const [coins, setCoins] = useState<number>(0);

  

  const [btN, setBtN] = useState<number>(1);

  const [btHints, setBtHints] = useState<number>(BT_START_HINTS);

  const [btPlayer, setBtPlayer] = useState<any>(null);

  const [btTotal, setBtTotal] = useState<number>(7);

  // bump this to force a fresh BTGameScreen even when the level number is the same
  const [btRun, setBtRun] = useState<number>(0);

  const openBrainTwist = useCallback(async (navigation: any) => {
    try {
      // Brain Twist has its own guest player (bt_players table),
      // so use the Brain Twist API, not the Code Breaker player.
      const p = await btApi.guest();

      // backend DB (bt_progress) padi unlocked level
      let level = Math.max(1, Number(p?.currentLevel) || 1);
      let total = Number(p?.total) || 7;
      try {
        const m = await getMap(p.id);
        level = m.currentLevel;
        total = m.total;
      } catch (e) {}

      setBtPlayer(p);
      setBtHints(Number(p?.hints) || 0);
      setBtN(level);
      setBtTotal(total);
    } catch (err: any) {
      console.warn("Could not start Brain Twist:", err);

      Alert.alert(
        "Brain Twist unavailable",
        err?.message ?? "Could not connect to the Brain Twist server."
      );

      return;
    }

    navigation.navigate("BtSplash");
  }, []);

  /* ============================================================
     GUEST
  ============================================================ */

  const [guestName, setGuestName] = useState<string | null>(null);

  const [isGuest, setIsGuest] = useState(false);

  // NEW: which guest option the user picked on the GuestChoice screen
  const [guestMode, setGuestMode] = useState<"player" | "group">("player");

  // NEW: true when the guest came through "Join as Group"
  const [groupGuest, setGroupGuest] = useState(false);

  // NEW: first screen after authed becomes true (Menu or JoinRoom)
  const [postAuthRoute, setPostAuthRoute] =
    useState<keyof RootStackParamList>("Menu");

  /* ============================================================
     PLAYER NAME
  ============================================================ */

  const playerName =
    isGuest && guestName ? guestName : wsProfile?.name ?? "";

  /* ============================================================
     LOAD GUEST NAME
  ============================================================ */

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(GUEST_NAME_KEY)
      .then((name) => {
        if (mounted && name) {
          setGuestName(name);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  /* ============================================================
     LOAD COINS
  ============================================================ */

  useEffect(() => {
    let mounted = true;

    const loadCoins = async () => {
      try {
        const stored = await AsyncStorage.getItem(COINS_STORAGE_KEY);

        if (!mounted) return;

        if (stored !== null) {
          const value = Number(stored);

          if (Number.isFinite(value)) {
            setCoins(value);
          }
        }
      } catch (err) {
        console.warn("Failed to load coins:", err);
      }
    };

    loadCoins();

    return () => {
      mounted = false;
    };
  }, []);

  /* ============================================================
     CLAIM GIFT
  ============================================================ */

  const claimGift = useCallback(async () => {
    try {
      setCoins((previousCoins) => {
        const nextCoins = previousCoins + GIFT_REWARD_AMOUNT;

        AsyncStorage.setItem(COINS_STORAGE_KEY, String(nextCoins)).catch(
          (err) => {
            console.warn("Failed to save coins:", err);
          }
        );

        return nextCoins;
      });

      console.log(`Gift claimed: +${GIFT_REWARD_AMOUNT} coins`);
    } catch (err) {
      console.warn("Failed to claim gift:", err);
    }
  }, []);

  const openGift = useCallback(() => {
    setShowGift(true);
  }, []);

  const closeGift = useCallback(() => {
    setShowGift(false);
  }, []);

  /* ============================================================
     SETTINGS SYNC
  ============================================================ */

  useEffect(() => {
    setFeedbackSettings(settings);
  }, [settings]);

  /* ============================================================
     REFRESH STATS
  ============================================================ */

  const refreshStats = useCallback(() => {
    fetchStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err: unknown) => {
        console.warn("Failed to refresh stats:", err);
      });
  }, []);

  /* ============================================================
     REFRESH SETTINGS
  ============================================================ */

  const refreshSettings = useCallback(() => {
    fetchSettings()
      .then((data) => {
        setSettings(data);
      })
      .catch((err: unknown) => {
        console.warn("Failed to refresh settings:", err);
      });
  }, []);

 

  const refreshProfile = useCallback(() => {
    fetchProfile()
      .then((profile) => {
        setWsProfile(profile);
      })
      .catch((err: unknown) => {
        console.warn("Failed to load profile:", err);
      });
  }, []);

 

  const refreshCbPlayer = useCallback(() => {
    fetchPlayer()
      .then((p) => {
        const name =
          (p as any)?.player?.name ?? (p as any)?.name ?? "Player";

        setCbPlayerName(name);
      })
      .catch((err: unknown) => {
        console.warn("Failed to load player:", err);
      });
  }, []);



  const resetWsSession = useCallback(async () => {
    await clearRememberedWordScrambleRoom();

    setWsRoom(null);
    setWsRound(null);
    setWsLivesLeft(DEFAULT_LIVES);
    setGameStartError(null);
  }, []);

 

  const clearSessionState = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        ACTIVE_WS_ROOM_KEY,
        GUEST_NAME_KEY,
        COINS_STORAGE_KEY,
      ]);
    } catch (err) {
      console.warn("Could not clear saved session data:", err);
    }

    setWsProfile(null);
    setCbPlayerName("Player");

    setWsRoom(null);
    setWsRound(null);
    setWsLivesLeft(DEFAULT_LIVES);

    setGameStartError(null);

    setSpLoading(false);
    setSpError(null);

    setGuestName(null);
    setIsGuest(false);

    // NEW: reset guest-flow state
    setGroupGuest(false);
    setPostAuthRoute("Menu");

    setStats(EMPTY_STATS);
    setCoins(0);
    setTopPlayers([]);
  }, []);



  const handleAuthSuccess = useCallback(
    async (user: any, source: string) => {
      console.log(`${source} onLogin ->`, user);

      if (!user?.player) {
        console.warn("onLogin ignored: no player data");

        return;
      }

      // Always start a freshly authenticated session from Menu.
      // Clear any previous Word Scramble room/session first so an
      // old WsGame / RoomWaiting route can never become the login target.
      await clearSessionState();

      setWsRoom(null);
      setWsRound(null);
      setWsLivesLeft(DEFAULT_LIVES);
      setGameStartError(null);

      setIsGuest(false);
      setGuestName(null);

      refreshProfile();
      refreshCbPlayer();
      refreshStats();
      refreshSettings();

      // IMPORTANT: login/create-account success ALWAYS starts at Menu.
      setInitialRouteName("Menu");
      setPostAuthRoute("Menu");

      // Changing this state changes the Stack.Navigator key below,
      // which creates a fresh authenticated navigation stack.
      setAuthed(true);

      console.log("AUTH SUCCESS -> MENU");
    },
    [
      clearSessionState,
      refreshProfile,
      refreshCbPlayer,
      refreshStats,
      refreshSettings,
    ]
  );

 

  const handleGuestEntry = useCallback(
    async (nickname: string, mode: "player" | "group") => {
      try {
        await registerGuest(nickname);
      } catch (err: any) {
        Alert.alert(
          "Could not continue",
          err?.message ?? "Unable to save your nickname."
        );

        return;
      }

      // Fresh session (this resets groupGuest / postAuthRoute / guestName)
      await clearSessionState();

      try {
        await AsyncStorage.setItem(GUEST_NAME_KEY, nickname);
      } catch {}

      if (mode === "group") {
        // Join as Group -> Join Room page
        setGuestName(nickname);
        setIsGuest(true);
        setGroupGuest(true);
        setPostAuthRoute("JoinRoom");
      } else {
        // Create as Player -> Menu (normal flow)
        setGuestName(null);
        setIsGuest(false);
        setGroupGuest(false);
        setPostAuthRoute("Menu");
      }

      refreshProfile();
      refreshCbPlayer();
      refreshStats();
      refreshSettings();

      // New navigator key -> fresh stack starting at postAuthRoute
      setAuthed(true);
    },
    [
      clearSessionState,
      refreshProfile,
      refreshCbPlayer,
      refreshStats,
      refreshSettings,
    ]
  );

  

  const loadTopPlayers = useCallback(() => {
    fetchLeaderboard()
      .then((players: any[]) => {
        const formattedPlayers = players
          .slice(0, 3)
          .map((p: any, index: number) => ({
            rank: p.rank ?? index + 1,

            name: p.name ?? p.player_name ?? "Player",

            score: Number(p.score ?? 0),

            avatarColor:
              p.avatarColor ??
              p.avatar_color ??
              FALLBACK_AVATAR_COLORS[index] ??
              "#4F46E5",
          }));

        setTopPlayers(formattedPlayers);
      })
      .catch((err: unknown) => {
        console.warn("Leaderboard failed:", err);
      });
  }, []);



  const ensurePlayerName = useCallback(async (): Promise<string | null> => {
    if (isGuest && guestName) {
      return guestName;
    }

    if (wsProfile?.name) {
      return wsProfile.name;
    }

    try {
      const profile = await fetchProfile();

      setWsProfile(profile);

      return profile.name;
    } catch (err) {
      console.warn("Could not load player:", err);

      return null;
    }
  }, [wsProfile, isGuest, guestName]);

 

  useEffect(() => {
    let cancelled = false;

    const goToLogin = () => {
      if (cancelled) return;

      setAuthed(false);
      setInitialRouteName("Login");
      setSessionRestoreReady(true);
    };

    const restoreWordScrambleSession = async () => {
      try {
        if (await isLoggedOut()) {
          goToLogin();
          return;
        }
      } catch {}

      try {
        const savedJson = await AsyncStorage.getItem(SAVED_PLAYER_JSON_KEY);

        const savedId = await AsyncStorage.getItem(SAVED_PLAYER_ID_KEY);

        if (!savedJson && !savedId) {
          goToLogin();
          return;
        }
      } catch {
        goToLogin();
        return;
      }

      try {
        await ensureAccount();
      } catch (err) {
        console.warn("Could not restore account:", err);

        goToLogin();
        return;
      }

      if (cancelled) return;

      setAuthed(true);

      refreshProfile();
      refreshCbPlayer();
      refreshStats();
      refreshSettings();

      let restoredRoute: keyof RootStackParamList = "Menu";

      try {
        let roomCode = await AsyncStorage.getItem(ACTIVE_WS_ROOM_KEY);

        if (!roomCode) {
          try {
            const me = await fetchProfile();

            if (me?.name) {
              const active = await fetchActiveRoom(me.name);

              roomCode = active?.roomCode ?? null;
            }
          } catch {}
        }

        if (roomCode) {
          const [roomResponse, profile] = await Promise.all([
            fetchRoom(roomCode),
            fetchProfile(),
          ]);

          const room = extractRoom(roomResponse);

          if (!room || !profile?.name) {
            throw new Error(
              "Could not restore the saved Word Scramble room."
            );
          }

          if (cancelled) return;

          const isMember = (room.players ?? []).some(
            (p: any) => p.player_name === profile.name
          );

          if (!isMember) {
            await clearRememberedWordScrambleRoom();

            throw new Error("Saved room belongs to another player.");
          }

          setWsProfile(profile);
          setWsRoom(room);

          setWsLivesLeft(
            typeof room.lives === "number" ? room.lives : DEFAULT_LIVES
          );

          if (room.status === "in_progress") {
            const response = await startGame(room.roomCode || roomCode);

            const round = extractRound(response);

            if (!round) {
              throw new Error("The active round could not be restored.");
            }

            if (!round.totalRounds) {
              round.totalRounds =
                room.totalRounds ?? DEFAULT_WS_GAME_CONFIG.totalRounds;
            }

            if (!round.timeLimitSec) {
              round.timeLimitSec =
                room.timeLimitSec ?? DEFAULT_WS_GAME_CONFIG.timeLimitSec;
            }

            setWsGameConfig({
              totalRounds: round.totalRounds,
              timeLimitSec: round.timeLimitSec,
            });

            setWsLivesLeft(
              typeof round.lives === "number"
                ? round.lives
                : room.lives ?? DEFAULT_LIVES
            );

            setWsRound(round);

            restoredRoute = "WsGame";
          } else if (room.status === "waiting") {
            setWsRound(null);

            restoredRoute = "RoomWaiting";
          } else if (room.status === "finished") {
            setWsRoom(null);
            setWsRound(null);

            await clearRememberedWordScrambleRoom();
          }
        }
      } catch (err) {
        console.warn("Could not restore Word Scramble session:", err);
      } finally {
        if (!cancelled) {
          setInitialRouteName(restoredRoute);

          setSessionRestoreReady(true);
        }
      }
    };

    restoreWordScrambleSession();

    return () => {
      cancelled = true;
    };

  }, []);

  

  const makeHandleNav = (navigation: any) => (key: NavKey) => {
    feedback("tap");

    if (key === "home") {
      refreshCbPlayer();

      navigation.navigate("Home");

      return;
    }

    if (key === "levels") {
      navigation.navigate("Levels");

      return;
    }

    if (key === "settings") {
      refreshSettings();

      navigation.navigate("Settings");

      return;
    }
  };

  const shell = (
    navigation: any,
    active: NavKey,
    node: React.ReactNode
  ) => (
    <CodeBreakerShell active={active} onNavigate={makeHandleNav(navigation)}>
      {node}
    </CodeBreakerShell>
  );

  /* ============================================================
     WORD SCRAMBLE NAVIGATION
  ============================================================ */

  const makeHandleWsNav = (navigation: any) => (key: WsNavKey) => {
    if (key === "home") {
      loadTopPlayers();
      refreshProfile();

      navigation.navigate("WordScrambleHome");

      return;
    }

    if (key === "rankings") {
      navigation.navigate("WsLeaderboard");

      return;
    }

    if (key === "profile") {
      navigation.navigate("Menu");

      return;
    }
  };

  const wsShell = (
    navigation: any,
    active: WsNavKey,
    node: React.ReactNode
  ) => (
    <WordScrambleShell
      active={active}
      onNavigate={makeHandleWsNav(navigation)}
      profile={wsProfile}
    >
      {node}
    </WordScrambleShell>
  );

  

  const handleJoinRoom = async (
    navigation: any,
    code: string,
    nameOverride?: string
  ): Promise<boolean> => {
    const name = nameOverride ?? (await ensurePlayerName());

    if (!name) {
      Alert.alert(
        "Player name required",
        "Unable to load your player profile."
      );

      return false;
    }

    try {
      const response = await joinRoom(code.trim(), name);

      const room = extractRoom(response);

      if (!room) {
        throw new Error("Server did not return room information.");
      }

      setWsRoom(room);

      await rememberWordScrambleRoom(room.roomCode);

      setWsLivesLeft(
        typeof room.lives === "number" ? room.lives : DEFAULT_LIVES
      );

      setWsRound(null);
      setGameStartError(null);

      navigation.navigate("RoomWaiting");

      return true;
    } catch (err: any) {
      console.warn("Join room failed:", err);

      const msg = /not found/i.test(err?.message ?? "")
        ? "Room not found. Please check the room code."
        : err?.message ?? "Please check the room code.";

      Alert.alert("Unable to join room", msg);

      return false;
    }
  };

  

  const handleGuestContinue = async (navigation: any, nickname: string) => {
    try {
      await registerGuest(nickname);
    } catch (err: any) {
      Alert.alert(
        "Could not continue",
        err?.message ?? "Unable to save your nickname."
      );

      return;
    }

    try {
      await AsyncStorage.setItem(GUEST_NAME_KEY, nickname);
    } catch {}

    await resetWsSession();

    setGuestName(nickname);
    setIsGuest(true);

    // Guest goes straight to the Join Room page
    navigation.navigate("JoinRoom");
  };

  /* ============================================================
     START WORD SCRAMBLE
     (host taps Start, guests are auto-started by RoomWaitingScreen)
  ============================================================ */

  const handleStartGame = useCallback(
    async (navigation: any) => {
      if (!wsRoom) {
        Alert.alert(
          "Room not found",
          "Please create or join a room first."
        );

        return;
      }

      if (startingGame) return;

      const me = await ensurePlayerName();

      const isMember = (wsRoom.players ?? []).some(
        (p: any) => p.player_name === me
      );

      if (!me || !isMember) {
        await resetWsSession();

        Alert.alert(
          "Room not available",
          "This room belongs to another account. Please create or join a room again."
        );

        navigation.navigate("WordScrambleHome");

        return;
      }

      setStartingGame(true);
      setGameStartError(null);

      try {
        const response = await startGame(wsRoom.roomCode);

        const round = extractRound(response);

        if (!round) {
          throw new Error("Backend did not return the first round.");
        }

        if (round.id === null || round.id === undefined) {
          throw new Error("Round ID is missing from backend response.");
        }

        if (!round.roundNumber) {
          round.roundNumber = 1;
        }

        if (!round.totalRounds) {
          round.totalRounds =
            wsRoom.totalRounds ?? DEFAULT_WS_GAME_CONFIG.totalRounds;
        }

        if (!round.timeLimitSec) {
          round.timeLimitSec =
            wsRoom.timeLimitSec ?? DEFAULT_WS_GAME_CONFIG.timeLimitSec;
        }

        setWsGameConfig({
          totalRounds: round.totalRounds,
          timeLimitSec: round.timeLimitSec,
        });

        const lives =
          typeof round.lives === "number"
            ? round.lives
            : typeof wsRoom.lives === "number"
            ? wsRoom.lives
            : DEFAULT_LIVES;

        setWsLivesLeft(lives);
        setWsRound(round);
        setGameStartError(null);

        navigation.navigate("WsGame");
      } catch (err: any) {
        console.error("START GAME ERROR:", err);

        const message = err?.message ?? "Unable to start the game.";

        setGameStartError(message);

        Alert.alert("Unable to start game", message);
      } finally {
        setStartingGame(false);
      }
    },
    [wsRoom, startingGame, ensurePlayerName, resetWsSession]
  );

 

  const prepareSinglePlayer = useCallback(async () => {
    const name = await ensurePlayerName();

    if (!name) {
      setSpError("Unable to load your player profile.");

      return;
    }

    setSpLoading(true);
    setSpError(null);
    setGameStartError(null);
    setWsRound(null);

    try {
      // CHANGED: maxPlayers 1 (was 2). With 2, the backend start route
      // answered "Waiting for all players to join (1/2)".
      // NOTE: backend must allow maxPlayers = 1 in POST /rooms
      // (MIN_ROOM_PLAYERS = 1 in Wordscrambleroutes.js).
      const roomResponse = await createRoom({
        roomName: "Single Player",

        roomType: "private",

        maxPlayers: 1,

        totalRounds: DEFAULT_WS_GAME_CONFIG.totalRounds,

        playerName: name,
      });

      const room = extractRoom(roomResponse);

      if (!room) {
        throw new Error("Server did not return room data.");
      }

      setWsRoom(room);

      await rememberWordScrambleRoom(room.roomCode);

      const response = await startGame(room.roomCode);

      const round = extractRound(response);

      if (!round) {
        throw new Error("Backend did not return the first round.");
      }

      if (round.id === null || round.id === undefined) {
        throw new Error("Round ID is missing from backend response.");
      }

      if (!round.roundNumber) {
        round.roundNumber = 1;
      }

      if (!round.totalRounds) {
        round.totalRounds =
          room.totalRounds ?? DEFAULT_WS_GAME_CONFIG.totalRounds;
      }

      if (!round.timeLimitSec) {
        round.timeLimitSec =
          room.timeLimitSec ?? DEFAULT_WS_GAME_CONFIG.timeLimitSec;
      }

      setWsGameConfig({
        totalRounds: round.totalRounds,
        timeLimitSec: round.timeLimitSec,
      });

      setWsLivesLeft(
        typeof round.lives === "number"
          ? round.lives
          : typeof room.lives === "number"
          ? room.lives
          : DEFAULT_LIVES
      );

      // Round ready -> Start button on the Level screen becomes active
      setWsRound(round);
    } catch (err: any) {
      console.error("SINGLE PLAYER ERROR:", err);

      setSpError(err?.message ?? "Unable to start single player.");
    } finally {
      setSpLoading(false);
    }
  }, [ensurePlayerName]);

  const handleSinglePlayer = async (navigation: any) => {
    if (spLoading) return;

    setIsGuest(false);
    setWsRoom(null);
    setWsRound(null);
    setSpError(null);

    // Show the Level 1 screen first; the round loads behind it
    navigation.navigate("WsLevelStart");

    await prepareSinglePlayer();
  };

  /* ============================================================
     NEXT ROUND
  ============================================================ */

  const advanceToNextRound = useCallback(
    async (navigation: any, skipAhead = 0) => {
      if (!wsRoom || !wsRound) {
        return;
      }

      try {
        const response = await nextRound(wsRoom.roomCode, {
          fromRoundId: wsRound.id,

          skip: skipAhead,
        });

        console.log("nextRound() response:", JSON.stringify(response));

        if (response?.finished === true || response?.gameFinished === true) {
          setWsRound(null);

          navigation.navigate("WsGameOver");

          return;
        }

        const nextRoundData = extractRound(response);

        if (!nextRoundData) {
          throw new Error("Backend did not return the next round.");
        }

        if (nextRoundData.id === null || nextRoundData.id === undefined) {
          throw new Error("Next round ID is missing.");
        }

        if (!nextRoundData.roundNumber) {
          nextRoundData.roundNumber = wsRound.roundNumber + 1;
        }

        if (!nextRoundData.totalRounds) {
          nextRoundData.totalRounds =
            wsRound.totalRounds ?? wsGameConfig.totalRounds;
        }

        if (!nextRoundData.timeLimitSec) {
          nextRoundData.timeLimitSec =
            wsRound.timeLimitSec ?? wsGameConfig.timeLimitSec;
        }

        const hasLetters =
          Array.isArray(nextRoundData.letters) &&
          nextRoundData.letters.length > 0;

        const hasWord = !!(
          nextRoundData.word ||
          nextRoundData.scrambled ||
          nextRoundData.scrambledWord
        );

        if (!hasLetters && !hasWord) {
          throw new Error("The next round's puzzle data was empty.");
        }

        if (typeof nextRoundData.lives === "number") {
          setWsLivesLeft(nextRoundData.lives);
        }

        setWsRound(nextRoundData);
      } catch (err: any) {
        console.warn("Next round failed:", err);

        Alert.alert(
          "Next round failed",
          err?.message ?? "Unable to load the next round."
        );
      }
    },
    [wsRoom, wsRound, wsGameConfig]
  );

 

  if (!sessionRestoreReady) {
    return <GameLoadingScreen />;
  }



  return (
    <ErrorBoundary label="Word Scramble">
      <NavigationContainer
        linking={linking}
        fallback={<GameLoadingScreen />}
      >
        <Stack.Navigator
          // Re-create the navigation stack when authentication changes.
          // This prevents the previous Word Scramble route from being
          // restored after Login / Create Account success.
          key={authed ? "authenticated" : "unauthenticated"}
          screenOptions={{
            headerShown: false,
          }}
          // CHANGED: group guests start at JoinRoom, everyone else at Menu
          initialRouteName={authed ? postAuthRoute : "Login"}
        >
          {!authed ? (
            <>
              {/* =====================================================
                  LOGIN
              ===================================================== */}

              <Stack.Screen name="Login">
                {({ navigation }) => (
                  <LoginScreen
                    onLoginPress={() => {
                      console.log("LOGIN PRESS -> CreateAccount");

                      navigation.navigate("CreateAccount");
                    }}
                    // NEW: Play as Guest -> Create as Player / Join as Group
                    onGuestPress={() => {
                      navigation.navigate("GuestChoice");
                    }}
                    onLogin={(user) => {
                      void handleAuthSuccess(user, "LoginScreen (guest)");
                    }}
                  />
                )}
              </Stack.Screen>

              {/* =====================================================
                  CREATE ACCOUNT
              ===================================================== */}

              <Stack.Screen name="CreateAccount">
                {({ navigation }) => (
                  <CreateAccountScreen
                    onBack={() => {
                      if (navigation.canGoBack()) {
                        navigation.goBack();
                      } else {
                        navigation.navigate("Login");
                      }
                    }}
                    onLogin={(user) => {
                      void handleAuthSuccess(user, "CreateAccount");
                    }}
                  />
                )}
              </Stack.Screen>

             

              <Stack.Screen name="GuestChoice">
                {({ navigation }) => (
                  <GuestChoiceScreen
                    onBack={() => navigation.navigate("Login")}
                    onCreatePlayer={() => {
                      setGuestMode("player");

                      navigation.navigate("GuestLogin");
                    }}
                    onJoinGroup={() => {
                      setGuestMode("group");

                      navigation.navigate("GuestLogin");
                    }}
                  />
                )}
              </Stack.Screen>

              {/* =====================================================
                  GUEST LOGIN (NEW)
                  Nickname page -> Menu (player) / Join Room (group)
              ===================================================== */}

              <Stack.Screen name="GuestLogin">
                {({ navigation }) => (
                  <GuestLoginScreen
                    mode={guestMode}
                    onBack={() => navigation.navigate("GuestChoice")}
                    onContinue={(nick) => {
                      void handleGuestEntry(nick, guestMode);
                    }}
                  />
                )}
              </Stack.Screen>
            </>
          ) : (
            <>
            

              <Stack.Screen name="Menu">
                {({ navigation }) => (
                  <MenuScreen
                    bestScore={stats.highScore}
                    streak={stats.currentStreak}
                    onSelectGame={(id) => {
                      if (id === "code-breaker") {
                        navigation.navigate("CodeBreakerSplash");
                      }

                      if (id === "word-scramble") {
                        navigation.navigate("WordScrambleSplash");
                      }

                      if (id === "brain-twist") {
                        void openBrainTwist(navigation);
                      }
                    }}
                    onOpenProfile={() => {
                      refreshStats();

                      navigation.navigate("Profile");
                    }}
                  />
                )}
              </Stack.Screen>

              {/* =====================================================
                  BRAIN TWIST SPLASH   ->  /brain-twist-splash
              ===================================================== */}

              <Stack.Screen name="BtSplash">
                {({ navigation }) => (
                  <BTSplashScreen
                    onDone={() => navigation.replace("BtHome")}
                  />
                )}
              </Stack.Screen>

              

              <Stack.Screen name="BtHome">
                {({ navigation }) => !btPlayer ? (
                  <RedirectTo navigation={navigation} to="Menu" />
                ) : (
                  <BTHomeScreen
                    n={btN}
                    hints={btHints}
                    err=""
                    onHome={() =>
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "Menu" }],
                      })
                    }
                    onLevels={() => navigation.navigate("BtLevels")}
                    onGo={async () => {
                      // always open the level the backend says is unlocked
                      try {
                        const m = await getMap(btPlayer.id);
                        setBtN(m.currentLevel);
                        setBtTotal(m.total);
                      } catch (e) {}
                      navigation.navigate("BtGame");
                    }}
                  />
                )}
              </Stack.Screen>

              {/* =====================================================
                  BRAIN TWIST LEVEL MAP   ->  /brain-twist/levels
              ===================================================== */}

              <Stack.Screen name="BtLevels">
                {({ navigation }) => !btPlayer ? (
                  <RedirectTo navigation={navigation} to="Menu" />
                ) : (
                  <BTLevelMapScreen
                    playerId={btPlayer.id}
                    onBack={() => navigation.goBack()}
                    onPlay={(n: number) => {
                      setBtN(n);
                      navigation.navigate("BtGame");
                    }}
                  />
                )}
              </Stack.Screen>

           

              <Stack.Screen name="BtGame">
                {({ navigation }) => !btPlayer ? (
                  <RedirectTo navigation={navigation} to="Menu" />
                ) : (
                  <BTGameScreen
                    key={btN + '-' + btRun}
                    n={btN}
                    player={btPlayer}
                    hints={btHints}
                    setHints={setBtHints}
                    onHome={() => navigation.navigate("BtHome")}
                    onWin={async (result: any, stats: any) => {
                      // FIXED: Level 1 red SKIP (riddle screen) sends
                      // { direct:true, skipped:true, alsoComplete:[2], next:3 }.
                      // Always open exactly that level (Level 3), even if the
                      // player already unlocked Level 4 / 5 earlier.
                      // (getMap().currentLevel would return the furthest
                      //  unlocked level, which was the bug.)
                      const forcedNext = Number(result?.next);
                      if (
                        stats?.skipped &&
                        result?.direct === true &&
                        Number.isFinite(forcedNext) &&
                        forcedNext > 0
                      ) {
                        try {
                          const m = await getMap(btPlayer.id);
                          setBtTotal(m.total);
                        } catch (e) {}

                        setBtN(forcedNext);        // Level 3
                        setBtRun((r) => r + 1);    // fresh game screen
                        navigation.replace("BtGame");
                        return;
                      }

                      // SKIP (or SUBMIT when BT_SHOW_COMPLETE_SCREEN is false):
                      // no "LEVEL COMPLETE" screen, open the next unlocked level directly
                      if (stats?.skipped || !BT_SHOW_COMPLETE_SCREEN) {
                        try {
                          // backend already saved the result + unlocked the next level
                          const m = await getMap(btPlayer.id);
                          setBtTotal(m.total);

                          if (!m.finished) {
                            setBtN(m.currentLevel);   // next level that is not completed yet
                            setBtRun((r) => r + 1);   // fresh game even if same level number
                            navigation.replace("BtGame");
                            return;
                          }
                        } catch (e) {}

                        // all levels done / network error
                        navigation.navigate("BtHome");
                        return;
                      }

                      // normal win -> LEVEL COMPLETE screen
                      navigation.navigate("BtWin", { stats });
                    }}
                  />
                )}
              </Stack.Screen>

              {/* =====================================================
                  BRAIN TWIST LEVEL COMPLETE   ->  /brain-twist/complete
              ===================================================== */}

              <Stack.Screen name="BtWin">
                {({ navigation, route }) => {
                  if (!btPlayer) {
                    return <RedirectTo navigation={navigation} to="Menu" />;
                  }

                  const hasNext = btN < btTotal;

                  return (
                    <BTCongratsScreen
                      key={btN}
                      n={btN}
                      hints={btHints}
                      playerId={btPlayer?.id}
                      stats={route.params?.stats}
                      hasNext={hasNext}
                      onNext={async () => {
                        // the backend has already saved the win and unlocked the next level
                        let next = hasNext ? btN + 1 : 0;
                        try {
                          const m = await getMap(btPlayer.id);
                          setBtTotal(m.total);
                          next = m.finished ? 0 : m.currentLevel;
                        } catch (e) {}

                        if (next) {
                          setBtN(next);
                          navigation.replace("BtGame");
                        } else {
                          navigation.navigate("BtHome");
                        }
                      }}
                      onHome={async () => {
                        // win aana apram Ready screen la correct next level kaattanum
                        try {
                          const m = await getMap(btPlayer.id);
                          setBtN(m.currentLevel);
                          setBtTotal(m.total);
                        } catch (e) {}
                        navigation.navigate("BtHome");
                      }}
                    />
                  );
                }}
              </Stack.Screen>

            

              <Stack.Screen name="CodeBreakerSplash">
                {({ navigation }) => (
                  <SplashScreen
                    onFinish={() => {
                      refreshCbPlayer();

                      navigation.replace("Home");
                    }}
                  />
                )}
              </Stack.Screen>

           

              <Stack.Screen name="WordScrambleSplash">
                {({ navigation }) => (
                  <WordScrambleSplashScreen
                    onFinish={() => {
                      loadTopPlayers();

                      refreshProfile();

                      setIsGuest(false);

                      navigation.replace("WordScrambleHome");
                    }}
                  />
                )}
              </Stack.Screen>

              {/* =====================================================
                  LEVELS
              ===================================================== */}

              <Stack.Screen name="Levels">
                {({ navigation }) =>
                  shell(
                    navigation,
                    "levels",
                    <LevelMapScreen
                      darkMode={settings.darkMode}
                      onBack={() => navigation.navigate("Home")}
                      onSelect={(level) => {
                        feedback("tap");

                        setSelectedLevel(level);

                        navigation.navigate("Game");
                      }}
                    />
                  )
                }
              </Stack.Screen>

          

              <Stack.Screen name="Game">
                {({ navigation }) =>
                  shell(
                    navigation,
                    "levels",
                    <GameScreen
                      difficulty={difficulty}
                      level={selectedLevel}
                      darkMode={settings.darkMode}
                      onBack={() => navigation.navigate("Levels")}
                      onExitToMenu={() =>
                        navigation.reset({
                          index: 0,
                          routes: [{ name: "Menu" }],
                        })
                      }
                      onWin={() => {
                        refreshStats();

                        navigation.navigate("Levels");

                        setTimeout(() => {
                          openGift();
                        }, 350);
                      }}
                      onLose={() => {
                        refreshStats();

                        navigation.navigate("Levels");
                      }}
                    />
                  )
                }
              </Stack.Screen>

           

              <Stack.Screen name="WrongGuess">
                {({ navigation }) =>
                  shell(
                    navigation,
                    "levels",
                    <WrongGuessScreen
                      attemptsLeft={attemptsLeft}
                      darkMode={settings.darkMode}
                      onTryAgain={() => navigation.navigate("Game")}
                    />
                  )
                }
              </Stack.Screen>

            

              <Stack.Screen name="Stats">
                {({ navigation }) =>
                  shell(
                    navigation,
                    "home",
                    <StatsScreen
                      stats={stats}
                      darkMode={settings.darkMode}
                      onBack={() => navigation.navigate("Home")}
                    />
                  )
                }
              </Stack.Screen>


              <Stack.Screen name="Settings">
                {({ navigation }) =>
                  shell(
                    navigation,
                    "settings",
                    <SettingsScreen
                      settings={settings}
                      onChange={(next) => {
                        setSettings(next);

                        apiUpdateSettings(next).catch((err: unknown) =>
                          console.warn("Failed to save settings:", err)
                        );
                      }}
                      onBack={() => navigation.navigate("Home")}
                      onResetStats={() => {
                        apiResetStats()
                          .then(() => refreshStats())
                          .catch((err: unknown) =>
                            console.warn("Failed to reset stats:", err)
                          );
                      }}
                    />
                  )
                }
              </Stack.Screen>

            

              <Stack.Screen name="Profile">
                {({ navigation }) => (
                  <ProfileScreen
                    stats={stats}
                    onBack={() => {
                      if (navigation.canGoBack()) {
                        navigation.goBack();
                      } else {
                        navigation.navigate("Menu");
                      }
                    }}
                    onTabHome={() => navigation.navigate("Menu")}
                    onTabGames={() => navigation.navigate("Menu")}
                    onOpenSettings={() => {
                      refreshSettings();

                      navigation.navigate("Settings");
                    }}
                    onLogout={async () => {
                      await clearSessionState();

                      setInitialRouteName("Login");

                      setAuthed(false);
                    }}
                  />
                )}
              </Stack.Screen>

             

              <Stack.Screen name="WordScrambleHome">
                {({ navigation }) => (
                  <WordScrambleHomeScreen
                    topPlayers={topPlayers}
                    onBack={() => navigation.navigate("Menu")}
                    onPlayOnline={() => {
                      setIsGuest(false);

                      // CHANGED: Multiplayer goes straight to Create / Join Room
                      navigation.navigate("RoomOptions");
                    }}
                    onGuestPlay={() => {
                      void handleSinglePlayer(navigation);
                    }}
                    onViewAllPlayers={() =>
                      navigation.navigate("WsLeaderboard")
                    }
                    onTabHome={() => navigation.navigate("WordScrambleHome")}
                    onTabLeaderboard={() =>
                      navigation.navigate("WsLeaderboard")
                    }
                    onTabProfile={() => navigation.navigate("Menu")}
                  />
                )}
              </Stack.Screen>

              {/* =====================================================
                  LEVEL START (NEW)
                  Single Player -> this screen -> tap Level 1 -> WsGame
              ===================================================== */}

              <Stack.Screen name="WsLevelStart">
                {({ navigation }) => (
                  <LevelStartScreen
                    level={wsRound ? wsRound.roundNumber : null}
                    loading={spLoading}
                    error={spError}
                    onStart={() => {
                      if (!wsRound) return;

                      navigation.navigate("WsGame");
                    }}
                    onRetry={() => {
                      void prepareSinglePlayer();
                    }}
                    onBack={() => {
                      void resetWsSession();

                      setSpError(null);
                      setSpLoading(false);

                      navigation.navigate("WordScrambleHome");
                    }}
                  />
                )}
              </Stack.Screen>

            

              <Stack.Screen name="GuestNickname">
                {({ navigation }) => (
                  <GuestNicknameScreen
                    defaultName={guestName}
                    onBack={() => navigation.navigate("RoomOptions")}
                    onContinue={(nick) =>
                      handleGuestContinue(navigation, nick)
                    }
                  />
                )}
              </Stack.Screen>

             

              <Stack.Screen name="RoomOptions">
                {({ navigation }) => (
                  <RoomOptionsScreen
                    guestName={isGuest ? guestName : null}
                    onBack={() => navigation.navigate("WordScrambleHome")}
                    onCreate={() => navigation.navigate("CreateRoom")}
                    onJoin={() => navigation.navigate("JoinRoom")}
                    onChangeName={() => navigation.navigate("GuestNickname")}
                  />
                )}
              </Stack.Screen>


              <Stack.Screen name="JoinRoom">
                {({ navigation }) => (
                  <JoinRoomScreen
                    onBack={async () => {
                      if (groupGuest) {
                        await clearSessionState();

                        setInitialRouteName("Login");

                        setAuthed(false);

                        return;
                      }

                      navigation.navigate(
                        isGuest ? "GuestNickname" : "RoomOptions"
                      );
                    }}
                    onJoin={(code) => handleJoinRoom(navigation, code)}
                  />
                )}
              </Stack.Screen>

             

              <Stack.Screen name="RoomCreated">
                {({ navigation }) => {
                  if (!wsRoom) {
                    return (
                      <RedirectTo
                        navigation={navigation}
                        to="WordScrambleHome"
                      />
                    );
                  }

                  return (
                    <RoomCreatedScreen
                      roomName={
                        (wsRoom as any).roomName ??
                        (wsRoom as any).room_name ??
                        "Your Room"
                      }
                      roomCode={wsRoom.roomCode}
                      onBack={() => navigation.navigate("RoomOptions")}
                      onContinue={() => navigation.navigate("RoomWaiting")}
                    />
                  );
                }}
              </Stack.Screen>

            

              <Stack.Screen name="CreateRoom">
                {({ navigation }) => (
                  <CreateRoomScreen
                    onBack={() => navigation.navigate("RoomOptions")}
                    onCreateRoom={async (config: CreateRoomConfig) => {
                      const name = await ensurePlayerName();

                      if (!name) {
                        Alert.alert(
                          "Player name required",
                          "Unable to load your player profile."
                        );

                        return;
                      }

                      try {
                        const response = await createRoom({
                          roomName: config.roomName,

                          roomType: config.roomType,

                          maxPlayers: config.numberOfPlayers,

                          totalRounds: config.rounds,

                          playerName: name,
                        });

                        const room = extractRoom(response);

                        if (!room) {
                          throw new Error("Server did not return room data.");
                        }

                        setWsRoom(room);

                        await rememberWordScrambleRoom(room.roomCode);

                        setWsRound(null);

                        setWsLivesLeft(
                          typeof room.lives === "number"
                            ? room.lives
                            : DEFAULT_LIVES
                        );

                        setGameStartError(null);

                        navigation.navigate("RoomCreated");
                      } catch (err: any) {
                        console.warn("Create room failed:", err);

                        // CreateRoomScreen catches this and shows the
                        // message in a red box under the form.
                        throw err;
                      }
                    }}
                    onJoinRoom={(code) => {
                      void handleJoinRoom(navigation, code);
                    }}
                    onTabHome={() => navigation.navigate("WordScrambleHome")}
                    onTabLeaderboard={() =>
                      navigation.navigate("WsLeaderboard")
                    }
                    onTabProfile={() => navigation.navigate("Menu")}
                  />
                )}
              </Stack.Screen>

             

              <Stack.Screen name="RoomWaiting">
                {({ navigation }) => {
                  if (!wsRoom) {
                    return (
                      <RedirectTo
                        navigation={navigation}
                        to="WordScrambleHome"
                      />
                    );
                  }

                  return wsShell(
                    navigation,
                    "home",
                    <RoomWaitingScreen
                      room={wsRoom}
                      playerName={playerName}
                      onBack={() => navigation.navigate("WordScrambleHome")}
                      onStartGame={() => handleStartGame(navigation)}
                      onOpenChat={() => navigation.navigate("WsChat")}
                      onOpenRoomSettings={() =>
                        navigation.navigate("WsRoomSettings")
                      }
                    />
                  );
                }}
              </Stack.Screen>

            

              <Stack.Screen name="WsGame">
                {({ navigation }) => {
                  if (!wsRound) {
                    if (!wsRoom) {
                      return (
                        <RedirectTo
                          navigation={navigation}
                          to="WordScrambleHome"
                        />
                      );
                    }

                    return (
                      <GameErrorScreen
                        message={
                          gameStartError ??
                          "The server did not return a valid game round."
                        }
                        onBack={() => navigation.navigate("WordScrambleHome")}
                        onRetry={() => handleStartGame(navigation)}
                      />
                    );
                  }

                  return (
                    <GamePlayScreen
                      playerName={playerName}
                      round={wsRound as any}
                      players={(wsRoom?.players ?? []).map((player) => ({
                        player_name: player.player_name,

                        score: Number(player.score ?? 0),
                      }))}
                      livesLeft={wsLivesLeft}
                      onRoundEnd={(answer, isCorrect, livesLeft, opts) => {
                        setWsLivesLeft(livesLeft);

                        if (isCorrect) {
                          advanceToNextRound(navigation, opts?.skipAhead ?? 0);

                          return;
                        }

                        if (livesLeft <= 0) {
                          navigation.navigate("WsGameOver");

                          return;
                        }

                        if (!wsRoom || !wsRound) {
                          return;
                        }

                        retryRound(String(wsRound.id), wsRoom.roomCode)
                          .then((response) => {
                            const retryData = extractRound(response);

                            if (!retryData) {
                              throw new Error(
                                "Backend did not return the retried round."
                              );
                            }

                            retryData.roundNumber = wsRound.roundNumber;

                            retryData.totalRounds = wsRound.totalRounds;

                            retryData.timeLimitSec = wsRound.timeLimitSec;

                            if (typeof retryData.lives === "number") {
                              setWsLivesLeft(retryData.lives);
                            }

                            setWsRound(retryData);
                          })
                          .catch((err: any) => {
                            console.warn("Retry after timeout failed:", err);

                            Alert.alert(
                              "Retry failed",
                              err?.message ?? "Unable to load a new round."
                            );
                          });
                      }}
                      // NEW: Exit -> Yes -> go to Menu screen
                      onQuit={() => {
                        // 1. Navigate first; reset the stack so Back can't
                        //    return to the game
                        navigation.reset({
                          index: 0,
                          routes: [{ name: "Menu" }],
                        });

                        // 2. Then clear the saved room / round state
                        void clearRememberedWordScrambleRoom();

                        setWsRoom(null);
                        setWsRound(null);
                        setWsLivesLeft(DEFAULT_LIVES);
                        setGameStartError(null);
                      }}
                    />
                  );
                }}
              </Stack.Screen>

             

              <Stack.Screen name="RoundComplete">
                {({ navigation }) => {
                  if (!wsRound) {
                    return (
                      <RedirectTo
                        navigation={navigation}
                        to="WordScrambleHome"
                      />
                    );
                  }

                  return (
                    <RoundCompleteScreen
                      roundId={Number(wsRound.id)}
                      playerName={playerName}
                      onNextRound={async (isCorrect: boolean) => {
                        if (!wsRoom) {
                          console.warn("Cannot continue: room missing.");

                          return;
                        }

                        if (wsRound.id === null || wsRound.id === undefined) {
                          Alert.alert("Round error", "Round ID is missing.");

                          return;
                        }

                        try {
                          if (isCorrect) {
                            await advanceToNextRound(navigation);

                            navigation.navigate("WsGame");

                            return;
                          }

                          const response = await retryRound(
                            String(wsRound.id),
                            wsRoom.roomCode
                          );

                          const retryData = extractRound(response);

                          if (!retryData) {
                            throw new Error(
                              "Backend did not return the retried round."
                            );
                          }

                          retryData.roundNumber = wsRound.roundNumber;

                          retryData.totalRounds = wsRound.totalRounds;

                          retryData.timeLimitSec = wsRound.timeLimitSec;

                          if (typeof retryData.lives === "number") {
                            setWsLivesLeft(retryData.lives);
                          }

                          setWsRound(retryData);

                          navigation.navigate("WsGame");
                        } catch (err: any) {
                          console.warn(
                            isCorrect
                              ? "Next round failed:"
                              : "Retry failed:",
                            err
                          );

                          Alert.alert(
                            isCorrect ? "Next round failed" : "Retry failed",

                            err?.message ?? "Unable to load the round."
                          );
                        }
                      }}
                    />
                  );
                }}
              </Stack.Screen>

            

              <Stack.Screen name="WsGameOver">
                {({ navigation }) => {
                  if (!wsRoom) {
                    return (
                      <RedirectTo
                        navigation={navigation}
                        to="WordScrambleHome"
                      />
                    );
                  }

                  return (
                    <GameOverScreen
                      roomCode={wsRoom.roomCode}
                      playerName={playerName}
                      onRematch={() => {
                        setWsRound(null);

                        setGameStartError(null);

                        setWsLivesLeft(
                          typeof wsRoom.lives === "number"
                            ? wsRoom.lives
                            : DEFAULT_LIVES
                        );

                        navigation.navigate("RoomWaiting");
                      }}
                      onHome={() => {
                        refreshProfile();
                        loadTopPlayers();

                        void clearRememberedWordScrambleRoom();

                        setWsRoom(null);

                        setWsRound(null);

                        setWsLivesLeft(DEFAULT_LIVES);

                        navigation.navigate("WordScrambleHome");
                      }}
                    />
                  );
                }}
              </Stack.Screen>

              {/* =====================================================
                  CHAT
              ===================================================== */}

              <Stack.Screen name="WsChat">
                {({ navigation }) => {
                  if (!wsRoom) {
                    return (
                      <RedirectTo
                        navigation={navigation}
                        to="WordScrambleHome"
                      />
                    );
                  }

                  return wsShell(
                    navigation,
                    "home",
                    <RoomChatScreen
                      roomCode={wsRoom.roomCode}
                      playerName={playerName}
                      onBack={() => navigation.navigate("RoomWaiting")}
                    />
                  );
                }}
              </Stack.Screen>

            

              <Stack.Screen name="WsRoomSettings">
                {({ navigation }) => {
                  if (!wsRoom) {
                    return (
                      <RedirectTo
                        navigation={navigation}
                        to="WordScrambleHome"
                      />
                    );
                  }

                  return wsShell(
                    navigation,
                    "home",
                    <RoomSettingsScreen
                      room={{
                        ...wsRoom,

                        timePerRoundSec:
                          (wsRoom as any).timePerRoundSec ??
                          wsGameConfig.timeLimitSec,
                      }}
                      playerName={playerName}
                      onBack={() => navigation.navigate("RoomWaiting")}
                      onRoomUpdated={(updatedRoom: any) => {
                        const room = updatedRoom?.room ?? updatedRoom;

                        setWsRoom(room as WordScrambleRoom);
                      }}
                      onLeaveRoom={() => {
                        void clearRememberedWordScrambleRoom();

                        setWsRoom(null);

                        setWsRound(null);

                        navigation.navigate("WordScrambleHome");
                      }}
                    />
                  );
                }}
              </Stack.Screen>

              {/* =====================================================
                  LEADERBOARD
              ===================================================== */}

              <Stack.Screen name="WsLeaderboard">
                {({ navigation }) =>
                  wsShell(
                    navigation,
                    "rankings",
                    <LeaderboardScreen
                      currentPlayerName={playerName}
                      onBack={() => navigation.navigate("WordScrambleHome")}
                    />
                  )
                }
              </Stack.Screen>

            

              <Stack.Screen name="Home">
                {({ navigation }) =>
                  shell(
                    navigation,
                    "home",
                    <HomeScreen
                      highScore={stats.highScore}
                      gamesPlayed={stats.gamesPlayed}
                      successRate={
                        stats.gamesPlayed > 0
                          ? Math.round(
                              (stats.gamesWon / stats.gamesPlayed) * 100
                            )
                          : 0
                      }
                      playerName={cbPlayerName}
                      darkMode={settings.darkMode}
                      onBack={() => navigation.navigate("Menu")}
                      onPlay={() => {
                        feedback("tap");

                        navigation.navigate("Levels");
                      }}
                      onStats={() => {
                        feedback("tap");

                        refreshStats();

                        navigation.navigate("Stats");
                      }}
                      onSettings={() => {
                        feedback("tap");

                        refreshSettings();

                        navigation.navigate("Settings");
                      }}
                      onProfile={() => {
                        feedback("tap");

                        refreshStats();

                        navigation.navigate("Profile");
                      }}
                    />
                  )
                }
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

      

      {showGift && (
        <GiftRewardModal
          coins={GIFT_REWARD_AMOUNT}
          onClaim={claimGift}
          onClose={closeGift}
        />
      )}
    </ErrorBoundary>
  );
}



const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFF9F2",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  loadingTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "800",
    color: "#17213A",
  },

  loadingText: {
    marginTop: 8,
    fontSize: 15,
    color: "#777",
  },

  errorContainer: {
    flex: 1,
    backgroundColor: "#FFF9F2",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFE4E6",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 36,
    fontWeight: "900",
    color: "#E11D48",
  },

  errorTitle: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "900",
    color: "#17213A",
    textAlign: "center",
  },

  errorMessage: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
  },

  errorButton: {
    marginTop: 25,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 14,
  },

  errorButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  backText: {
    marginTop: 20,
    color: "#4F46E5",
    fontSize: 15,
    fontWeight: "700",
  },
});
