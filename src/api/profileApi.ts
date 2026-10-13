// // // // // src/api/profileApi.ts
// // // // import { API_BASE_URL } from "./api";

// // // // export interface PlayerBadge {
// // // //   id: string;
// // // //   title: string;
// // // //   description: string;
// // // //   icon: string; // MaterialCommunityIcons name
// // // //   color: string;
// // // //   metric: "gamesWon" | "gamesPlayed" | "bestStreak" | "highScore";
// // // //   target: number;
// // // // }

// // // // export interface PlayerActivity {
// // // //   id: number;
// // // //   game: string;
// // // //   type: string;
// // // //   title: string;
// // // //   detail: string;
// // // //   createdAt: string; // ISO date
// // // // }

// // // // export interface PlayerProfile {
// // // //   name: string;
// // // //   joinedAt: string; // ISO date
// // // //   level: number;
// // // //   xp: number; // XP inside the current level
// // // //   xpForNext: number; // XP needed for the next level
// // // //   totalXp: number;
// // // //   badges: PlayerBadge[];
// // // //   recentActivity: PlayerActivity[];
// // // // }

// // // // export type ActivityType = "game_win" | "game_lose" | "high_score" | "room_joined" | "room_created";
// // // // export type ActivityGame = "code-breaker" | "word-scramble";

// // // // async function request<T>(path: string, init?: RequestInit): Promise<T> {
// // // //   const res = await fetch(`${API_BASE_URL}${path}`, {
// // // //     headers: { "Content-Type": "application/json" },
// // // //     ...init,
// // // //   });
// // // //   const data = await res.json().catch(() => ({}));
// // // //   if (!res.ok) throw new Error((data as any).error || `Request failed (${res.status})`);
// // // //   return data as T;
// // // // }

// // // // export const fetchPlayer = () => request<PlayerProfile>("/player");

// // // // export const updatePlayerName = (name: string) =>
// // // //   request<PlayerProfile>("/player", { method: "PUT", body: JSON.stringify({ name }) });

// // // // export const logActivity = (body: { game: ActivityGame; type: ActivityType; value?: number }) =>
// // // //   request<PlayerProfile>("/player/activity", { method: "POST", body: JSON.stringify(body) });
// // // // src/api/profileApi.ts

// // // import { API_BASE_URL } from "./api";

// // // /* =========================================================
// // //    BADGE
// // // ========================================================= */

// // // export interface PlayerBadge {
// // //   id: string;
// // //   title: string;
// // //   description: string;
// // //   icon: string;
// // //   color: string;
// // //   metric:
// // //     | "gamesWon"
// // //     | "gamesPlayed"
// // //     | "bestStreak"
// // //     | "highScore";
// // //   target: number;

// // //   // Backend may send these
// // //   progress?: number;
// // //   unlocked?: boolean;
// // // }

// // // /* =========================================================
// // //    ACTIVITY
// // // ========================================================= */

// // // export interface PlayerActivity {
// // //   id: number;
// // //   game: string;
// // //   type: string;
// // //   title: string;
// // //   detail: string;
// // //   xpAwarded?: number;
// // //   value?: number;
// // //   createdAt: string;
// // // }

// // // /* =========================================================
// // //    STATS
// // // ========================================================= */

// // // export interface PlayerStats {
// // //   gamesPlayed: number;
// // //   gamesWon: number;
// // //   gamesLost?: number;
// // //   highScore: number;
// // //   currentStreak: number;
// // //   bestStreak: number;
// // //   winRate: number;
// // // }

// // // /* =========================================================
// // //    FRONTEND PROFILE
// // // ========================================================= */

// // // /*
// // //   IMPORTANT:

// // //   ProfileScreen expects:

// // //   player.name
// // //   player.joinedAt
// // //   player.level
// // //   player.xp
// // //   player.xpForNext
// // //   player.totalXp
// // //   player.stats
// // //   player.badges
// // //   player.recentActivity

// // //   We normalize the backend response into exactly this shape.
// // // */

// // // export interface PlayerProfile {
// // //   id?: number;
// // //   name: string;
// // //   joinedAt: string;

// // //   level: number;
// // //   xp: number;
// // //   xpForNext: number;
// // //   totalXp: number;

// // //   stats?: PlayerStats;

// // //   badges: PlayerBadge[];
// // //   recentActivity: PlayerActivity[];
// // // }

// // // /* =========================================================
// // //    ACTIVITY TYPES
// // // ========================================================= */

// // // export type ActivityType =
// // //   | "game_win"
// // //   | "game_lose"
// // //   | "high_score"
// // //   | "room_joined"
// // //   | "room_created";

// // // export type ActivityGame =
// // //   | "code-breaker"
// // //   | "word-scramble";

// // // /* =========================================================
// // //    RAW BACKEND TYPES
// // // ========================================================= */

// // // interface RawPlayer {
// // //   id?: number;
// // //   name?: string;
// // //   joinedAt?: string;
// // //   joined_at?: string;
// // // }

// // // interface RawProfileFields {
// // //   player?: RawPlayer;

// // //   // Flat response support
// // //   id?: number;
// // //   name?: string;
// // //   joinedAt?: string;
// // //   joined_at?: string;

// // //   level?: number;
// // //   xp?: number;
// // //   xpForNext?: number;
// // //   totalXp?: number;

// // //   stats?: Partial<PlayerStats>;

// // //   badges?: PlayerBadge[];

// // //   recentActivity?: PlayerActivity[];
// // // }

// // // interface RawProfileResponse extends RawProfileFields {
// // //   success?: boolean;
// // //   data?: RawProfileFields;
// // // }

// // // /* =========================================================
// // //    REQUEST
// // // ========================================================= */

// // // async function request<T>(
// // //   path: string,
// // //   init?: RequestInit
// // // ): Promise<T> {
// // //   const res = await fetch(
// // //     `${API_BASE_URL}${path}`,
// // //     {
// // //       headers: {
// // //         "Content-Type": "application/json",
// // //         ...(init?.headers || {}),
// // //       },
// // //       ...init,
// // //     }
// // //   );

// // //   const data = await res.json().catch(() => ({}));

// // //   if (!res.ok) {
// // //     throw new Error(
// // //       (data as any)?.error ||
// // //         `Request failed (${res.status})`
// // //     );
// // //   }

// // //   return data as T;
// // // }

// // // /* =========================================================
// // //    NORMALIZE PROFILE
// // // ========================================================= */

// // // function normalizeProfile(
// // //   raw: RawProfileResponse
// // // ): PlayerProfile {
// // //   /*
// // //     Backend can return either:

// // //     1. Flat:
// // //        {
// // //          name: "Suba",
// // //          level: 2,
// // //          ...
// // //        }

// // //     OR

// // //     2. Nested:
// // //        {
// // //          player: {
// // //            id: 1,
// // //            name: "Suba",
// // //            joinedAt: "..."
// // //          },
// // //          level: 2,
// // //          ...
// // //        }
// // //   */

// // //   const profile = raw?.data ?? raw;
// // //   const backendPlayer = profile?.player ?? {};

// // //   const name =
// // //     backendPlayer.name ??
// // //     profile?.name ??
// // //     "Player";

// // //   const joinedAt =
// // //     backendPlayer.joinedAt ??
// // //     backendPlayer.joined_at ??
// // //     profile?.joinedAt ??
// // //     profile?.joined_at ??
// // //     new Date().toISOString();

// // //   const stats: PlayerStats = {
// // //     gamesPlayed: Number(
// // //       profile?.stats?.gamesPlayed ?? 0
// // //     ),

// // //     gamesWon: Number(
// // //       profile?.stats?.gamesWon ?? 0
// // //     ),

// // //     gamesLost: Number(
// // //       profile?.stats?.gamesLost ?? 0
// // //     ),

// // //     highScore: Number(
// // //       profile?.stats?.highScore ?? 0
// // //     ),

// // //     currentStreak: Number(
// // //       profile?.stats?.currentStreak ?? 0
// // //     ),

// // //     bestStreak: Number(
// // //       profile?.stats?.bestStreak ?? 0
// // //     ),

// // //     winRate: Number(
// // //       profile?.stats?.winRate ??
// // //         (
// // //           Number(profile?.stats?.gamesPlayed ?? 0) > 0
// // //             ? Math.round(
// // //                 (
// // //                   Number(profile?.stats?.gamesWon ?? 0) /
// // //                   Number(profile?.stats?.gamesPlayed ?? 0)
// // //                 ) * 100
// // //               )
// // //             : 0
// // //         )
// // //     ),
// // //   };

// // //   return {
// // //     id:
// // //       backendPlayer.id ??
// // //       profile?.id,

// // //     name,

// // //     joinedAt,

// // //     level: Number(
// // //       profile?.level ?? 1
// // //     ),

// // //     xp: Number(
// // //       profile?.xp ?? 0
// // //     ),

// // //     xpForNext: Number(
// // //       profile?.xpForNext ?? 300
// // //     ),

// // //     totalXp: Number(
// // //       profile?.totalXp ?? profile?.xp ?? 0
// // //     ),

// // //     stats,

// // //     badges: Array.isArray(profile?.badges)
// // //       ? profile.badges
// // //       : [],

// // //     recentActivity:
// // //       Array.isArray(profile?.recentActivity)
// // //         ? profile.recentActivity
// // //         : [],
// // //   };
// // // }

// // // /* =========================================================
// // //    FETCH PLAYER
// // // ========================================================= */

// // // export const fetchPlayer =
// // //   async (): Promise<PlayerProfile> => {
// // //     const raw =
// // //       await request<RawProfileResponse>(
// // //         "/player"
// // //       );

// // //     return normalizeProfile(raw);
// // //   };

// // // /* =========================================================
// // //    UPDATE PLAYER NAME
// // // ========================================================= */

// // // export const updatePlayerName =
// // //   async (
// // //     name: string
// // //   ): Promise<PlayerProfile> => {
// // //     const raw =
// // //       await request<RawProfileResponse>(
// // //         "/player",
// // //         {
// // //           method: "PUT",

// // //           body: JSON.stringify({
// // //             name,
// // //           }),
// // //         }
// // //       );

// // //     return normalizeProfile(raw);
// // //   };

// // // /* =========================================================
// // //    LOG ACTIVITY
// // // ========================================================= */

// // // export const logActivity = async (
// // //   body: {
// // //     game: ActivityGame;
// // //     type: ActivityType;
// // //     value?: number;
// // //   }
// // // ): Promise<PlayerProfile> => {
// // //   const raw =
// // //     await request<RawProfileResponse>(
// // //       "/player/activity",
// // //       {
// // //         method: "POST",

// // //         body: JSON.stringify(body),
// // //       }
// // //     );

// // //   return normalizeProfile(raw);
// // // };
// // import { API_BASE_URL } from "./api";
// // import { getCurrentPlayerId, withPlayer } from "./currentPlayer";
// // import { getCurrentPlayerId as getStoredPlayerId } from "./authApi";
// // /* =========================================================
// //    BADGE
// // ========================================================= */

// // export interface PlayerBadge {
// //   id: string;
// //   title: string;
// //   description: string;
// //   icon: string;
// //   color: string;
// //   metric:
// //     | "gamesWon"
// //     | "gamesPlayed"
// //     | "bestStreak"
// //     | "highScore";
// //   target: number;

// //   // Backend may send these
// //   progress?: number;
// //   unlocked?: boolean;
// // }

// // /* =========================================================
// //    ACTIVITY
// // ========================================================= */

// // export interface PlayerActivity {
// //   id: number;
// //   game: string;
// //   type: string;
// //   title: string;
// //   detail: string;
// //   xpAwarded?: number;
// //   value?: number;
// //   createdAt: string;
// // }

// // /* =========================================================
// //    STATS
// // ========================================================= */

// // export interface PlayerStats {
// //   gamesPlayed: number;
// //   gamesWon: number;
// //   gamesLost?: number;
// //   highScore: number;
// //   currentStreak: number;
// //   bestStreak: number;
// //   winRate: number;
// // }

// // /* =========================================================
// //    FRONTEND PROFILE
// // ========================================================= */

// // export interface PlayerProfile {
// //   id?: number;
// //   name: string;
// //   joinedAt: string;

// //   level: number;
// //   xp: number;
// //   xpForNext: number;
// //   totalXp: number;

// //   stats?: PlayerStats;

// //   badges: PlayerBadge[];
// //   recentActivity: PlayerActivity[];
// // }

// // /* =========================================================
// //    ACTIVITY TYPES
// // ========================================================= */

// // export type ActivityType =
// //   | "game_win"
// //   | "game_lose"
// //   | "high_score"
// //   | "room_joined"
// //   | "room_created";

// // export type ActivityGame =
// //   | "code-breaker"
// //   | "word-scramble";

// // /* =========================================================
// //    RAW BACKEND TYPES
// // ========================================================= */

// // interface RawPlayer {
// //   id?: number;
// //   name?: string;
// //   joinedAt?: string;
// //   joined_at?: string;
// // }

// // interface RawProfileFields {
// //   player?: RawPlayer;

// //   // Flat response support
// //   id?: number;
// //   name?: string;
// //   joinedAt?: string;
// //   joined_at?: string;

// //   level?: number;
// //   xp?: number;
// //   xpForNext?: number;
// //   totalXp?: number;

// //   stats?: Partial<PlayerStats>;

// //   badges?: PlayerBadge[];

// //   recentActivity?: PlayerActivity[];
// // }

// // interface RawProfileResponse extends RawProfileFields {
// //   success?: boolean;
// //   data?: RawProfileFields;
// // }

// // /* =========================================================
// //    REQUEST
// // ========================================================= */

// // async function request<T>(
// //   path: string,
// //   init?: RequestInit
// // ): Promise<T> {
// //   const res = await fetch(
// //     `${API_BASE_URL}${path}`,
// //     {
// //       headers: {
// //         "Content-Type": "application/json",
// //         ...(init?.headers || {}),
// //       },
// //       ...init,
// //     }
// //   );

// //   const data = await res.json().catch(() => ({}));

// //   if (!res.ok) {
// //     throw new Error(
// //       (data as any)?.error ||
// //         `Request failed (${res.status})`
// //     );
// //   }

// //   return data as T;
// // }

// // /* =========================================================
// //    NORMALIZE PROFILE
// // ========================================================= */

// // function normalizeProfile(
// //   raw: RawProfileResponse
// // ): PlayerProfile {
// //   const profile = raw?.data ?? raw;
// //   const backendPlayer = profile?.player ?? {};

// //   const name =
// //     backendPlayer.name ??
// //     profile?.name ??
// //     "Player";

// //   const joinedAt =
// //     backendPlayer.joinedAt ??
// //     backendPlayer.joined_at ??
// //     profile?.joinedAt ??
// //     profile?.joined_at ??
// //     new Date().toISOString();

// //   const stats: PlayerStats = {
// //     gamesPlayed: Number(
// //       profile?.stats?.gamesPlayed ?? 0
// //     ),

// //     gamesWon: Number(
// //       profile?.stats?.gamesWon ?? 0
// //     ),

// //     gamesLost: Number(
// //       profile?.stats?.gamesLost ?? 0
// //     ),

// //     highScore: Number(
// //       profile?.stats?.highScore ?? 0
// //     ),

// //     currentStreak: Number(
// //       profile?.stats?.currentStreak ?? 0
// //     ),

// //     bestStreak: Number(
// //       profile?.stats?.bestStreak ?? 0
// //     ),

// //     winRate: Number(
// //       profile?.stats?.winRate ??
// //         (
// //           Number(profile?.stats?.gamesPlayed ?? 0) > 0
// //             ? Math.round(
// //                 (
// //                   Number(profile?.stats?.gamesWon ?? 0) /
// //                   Number(profile?.stats?.gamesPlayed ?? 0)
// //                 ) * 100
// //               )
// //             : 0
// //         )
// //     ),
// //   };

// //   return {
// //     id:
// //       backendPlayer.id ??
// //       profile?.id,

// //     name,

// //     joinedAt,

// //     level: Number(
// //       profile?.level ?? 1
// //     ),

// //     xp: Number(
// //       profile?.xp ?? 0
// //     ),

// //     xpForNext: Number(
// //       profile?.xpForNext ?? 300
// //     ),

// //     totalXp: Number(
// //       profile?.totalXp ?? profile?.xp ?? 0
// //     ),

// //     stats,

// //     badges: Array.isArray(profile?.badges)
// //       ? profile.badges
// //       : [],

// //     recentActivity:
// //       Array.isArray(profile?.recentActivity)
// //         ? profile.recentActivity
// //         : [],
// //   };
// // }

// // /* =========================================================
// //    FETCH PLAYER  (the logged-in account's own profile)
// // ========================================================= */

// // // export const fetchPlayer =
// // //   async (): Promise<PlayerProfile> => {
// // //     const raw =
// // //       await request<RawProfileResponse>(
// // //         withPlayer("/player")
// // //       );

// // //     return normalizeProfile(raw);
// // //   };
// // export const fetchPlayer =
// //   async (): Promise<PlayerProfile> => {
// //     const playerId = await getStoredPlayerId();

// //     console.log(
// //       "PROFILE: playerId:",
// //       playerId
// //     );

// //     if (!playerId) {
// //       throw new Error(
// //         "Not logged in. playerId is missing."
// //       );
// //     }

// //     const raw =
// //       await request<RawProfileResponse>(
// //         `/player?playerId=${encodeURIComponent(
// //           String(playerId)
// //         )}`
// //       );

// //     console.log(
// //       "PROFILE: player response:",
// //       JSON.stringify(raw)
// //     );

// //     return normalizeProfile(raw);
// //   };
// // /* =========================================================
// //    UPDATE PLAYER NAME  (only the logged-in account changes)
// // ========================================================= */

// // export const updatePlayerName =
// //   async (
// //     name: string
// //   ): Promise<PlayerProfile> => {
// //     const raw =
// //       await request<RawProfileResponse>(
// //         withPlayer("/player"),
// //         {
// //           method: "PUT",

// //           body: JSON.stringify({
// //             name,
// //             playerId: getCurrentPlayerId() ?? undefined,
// //           }),
// //         }
// //       );

// //     return normalizeProfile(raw);
// //   };

// // /* =========================================================
// //    LOG ACTIVITY
// // ========================================================= */

// // export const logActivity = async (
// //   body: {
// //     game: ActivityGame;
// //     type: ActivityType;
// //     value?: number;
// //   }
// // ): Promise<PlayerProfile> => {
// //   const raw =
// //     await request<RawProfileResponse>(
// //       "/player/activity",
// //       {
// //         method: "POST",

// //         body: JSON.stringify({
// //           ...body,
// //           playerId: getCurrentPlayerId() ?? undefined,
// //         }),
// //       }
// //     );

// //   return normalizeProfile(raw);
// // };
// import { API_BASE_URL } from "./api";
// import { ensureAccount } from "./authApi";

// /* =========================================================
//    BADGE
// ========================================================= */

// export interface PlayerBadge {
//   id: string;
//   title: string;
//   description: string;
//   icon: string;
//   color: string;
//   metric: "gamesWon" | "gamesPlayed" | "bestStreak" | "highScore";
//   target: number;

//   // Backend may send these
//   progress?: number;
//   unlocked?: boolean;
// }

// /* =========================================================
//    ACTIVITY
// ========================================================= */

// export interface PlayerActivity {
//   id: number;
//   game: string;
//   type: string;
//   title: string;
//   detail: string;
//   xpAwarded?: number;
//   value?: number;
//   createdAt: string;
// }

// /* =========================================================
//    STATS
// ========================================================= */

// export interface PlayerStats {
//   gamesPlayed: number;
//   gamesWon: number;
//   gamesLost?: number;
//   highScore: number;
//   currentStreak: number;
//   bestStreak: number;
//   winRate: number;
// }

// /* =========================================================
//    FRONTEND PROFILE
// ========================================================= */

// export interface PlayerProfile {
//   id?: number;
//   name: string;
//   joinedAt: string;

//   level: number;
//   xp: number;
//   xpForNext: number;
//   totalXp: number;

//   stats?: PlayerStats;

//   badges: PlayerBadge[];
//   recentActivity: PlayerActivity[];
// }

// /* =========================================================
//    ACTIVITY TYPES
// ========================================================= */

// export type ActivityType =
//   | "game_win"
//   | "game_lose"
//   | "high_score"
//   | "room_joined"
//   | "room_created";

// export type ActivityGame = "code-breaker" | "word-scramble";

// /* =========================================================
//    RAW BACKEND TYPES
// ========================================================= */

// interface RawPlayer {
//   id?: number;
//   name?: string;
//   joinedAt?: string;
//   joined_at?: string;
// }

// interface RawProfileFields {
//   player?: RawPlayer;

//   // Flat response support
//   id?: number;
//   name?: string;
//   joinedAt?: string;
//   joined_at?: string;

//   level?: number;
//   xp?: number;
//   xpForNext?: number;
//   totalXp?: number;

//   stats?: Partial<PlayerStats>;

//   badges?: PlayerBadge[];

//   recentActivity?: PlayerActivity[];
// }

// interface RawProfileResponse extends RawProfileFields {
//   success?: boolean;
//   data?: RawProfileFields;
// }

// /* =========================================================
//    REQUEST
// ========================================================= */

// async function request<T>(path: string, init?: RequestInit): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     ...init,
//     headers: {
//       "Content-Type": "application/json",
//       ...(init?.headers || {}),
//     },
//   });

//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     throw new Error((data as any)?.error || `Request failed (${res.status})`);
//   }

//   return data as T;
// }

// /* =========================================================
//    NORMALIZE PROFILE
// ========================================================= */

// function normalizeProfile(raw: RawProfileResponse): PlayerProfile {
//   const profile = raw?.data ?? raw;
//   const backendPlayer = profile?.player ?? {};

//   const name = backendPlayer.name ?? profile?.name ?? "Player";

//   const joinedAt =
//     backendPlayer.joinedAt ??
//     backendPlayer.joined_at ??
//     profile?.joinedAt ??
//     profile?.joined_at ??
//     new Date().toISOString();

//   const gamesPlayed = Number(profile?.stats?.gamesPlayed ?? 0);
//   const gamesWon = Number(profile?.stats?.gamesWon ?? 0);

//   const stats: PlayerStats = {
//     gamesPlayed,
//     gamesWon,
//     gamesLost: Number(profile?.stats?.gamesLost ?? 0),
//     highScore: Number(profile?.stats?.highScore ?? 0),
//     currentStreak: Number(profile?.stats?.currentStreak ?? 0),
//     bestStreak: Number(profile?.stats?.bestStreak ?? 0),
//     winRate: Number(
//       profile?.stats?.winRate ??
//         (gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0)
//     ),
//   };

//   return {
//     id: backendPlayer.id ?? profile?.id,
//     name,
//     joinedAt,

//     level: Number(profile?.level ?? 1),
//     xp: Number(profile?.xp ?? 0),
//     xpForNext: Number(profile?.xpForNext ?? 300),
//     totalXp: Number(profile?.totalXp ?? profile?.xp ?? 0),

//     stats,

//     badges: Array.isArray(profile?.badges) ? profile.badges : [],

//     recentActivity: Array.isArray(profile?.recentActivity)
//       ? profile.recentActivity
//       : [],
//   };
// }

// /* =========================================================
//    FETCH PLAYER  (the logged-in account's own profile)
// ========================================================= */

// export const fetchPlayer = async (): Promise<PlayerProfile> => {
//   // Backend (DB) la irundhu account eduthukkum / illa na create pannum
//   const player = await ensureAccount();

//   console.log("PROFILE: playerId:", player.id);

//   const raw = await request<RawProfileResponse>(
//     `/player?playerId=${encodeURIComponent(String(player.id))}`
//   );

//   console.log("PROFILE: player response:", JSON.stringify(raw));

//   return normalizeProfile(raw);
// };

// /* =========================================================
//    UPDATE PLAYER NAME  (only the logged-in account changes)
// ========================================================= */

// export const updatePlayerName = async (
//   name: string
// ): Promise<PlayerProfile> => {
//   const player = await ensureAccount();

//   const raw = await request<RawProfileResponse>(
//     `/player?playerId=${encodeURIComponent(String(player.id))}`,
//     {
//       method: "PUT",
//       body: JSON.stringify({
//         name,
//         playerId: player.id,
//       }),
//     }
//   );

//   return normalizeProfile(raw);
// };

// /* =========================================================
//    LOG ACTIVITY
// ========================================================= */

// export const logActivity = async (body: {
//   game: ActivityGame;
//   type: ActivityType;
//   value?: number;
// }): Promise<PlayerProfile> => {
//   const player = await ensureAccount();

//   const raw = await request<RawProfileResponse>("/player/activity", {
//     method: "POST",
//     body: JSON.stringify({
//       ...body,
//       playerId: player.id,
//     }),
//   });

//   return normalizeProfile(raw);
// };
import { API_BASE_URL } from "./api";
import { ensureAccount } from "./authApi";

/* =========================================================
   BADGE
========================================================= */

export interface PlayerBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  metric: "gamesWon" | "gamesPlayed" | "bestStreak" | "highScore";
  target: number;

  // Backend may send these
  progress?: number;
  unlocked?: boolean;
}

/* =========================================================
   ACTIVITY
========================================================= */

export interface PlayerActivity {
  id: number;
  game: string;
  type: string;
  title: string;
  detail: string;
  xpAwarded?: number;
  value?: number;
  createdAt: string;
}

/* =========================================================
   STATS
========================================================= */

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost?: number;
  highScore: number;
  currentStreak: number;
  bestStreak: number;
  winRate: number;
}

/* =========================================================
   FRONTEND PROFILE
========================================================= */

export interface PlayerProfile {
  id?: number;
  name: string;

  // NEW: personal details
  dob: string;
  gender: string;
  phone: string;

  joinedAt: string;

  level: number;
  xp: number;
  xpForNext: number;
  totalXp: number;

  stats?: PlayerStats;

  badges: PlayerBadge[];
  recentActivity: PlayerActivity[];
}

/* =========================================================
   ACTIVITY TYPES
========================================================= */

export type ActivityType =
  | "game_win"
  | "game_lose"
  | "high_score"
  | "room_joined"
  | "room_created";

export type ActivityGame = "code-breaker" | "word-scramble";

/* =========================================================
   RAW BACKEND TYPES
========================================================= */

interface RawPlayer {
  id?: number;
  name?: string;

  // NEW
  dob?: string;
  gender?: string;
  phone?: string;
  mobile?: string;
  type?: string;

  joinedAt?: string;
  joined_at?: string;
}

interface RawProfileFields {
  player?: RawPlayer;

  // Flat response support
  id?: number;
  name?: string;
  dob?: string;
  gender?: string;
  phone?: string;
  mobile?: string;
  joinedAt?: string;
  joined_at?: string;

  level?: number;
  xp?: number;
  xpForNext?: number;
  totalXp?: number;

  stats?: Partial<PlayerStats>;

  badges?: PlayerBadge[];

  recentActivity?: PlayerActivity[];
}

interface RawProfileResponse extends RawProfileFields {
  success?: boolean;
  data?: RawProfileFields;
}

/* =========================================================
   REQUEST
========================================================= */

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as any)?.error || `Request failed (${res.status})`);
  }

  return data as T;
}

/* =========================================================
   NORMALIZE PROFILE
========================================================= */

function normalizeProfile(raw: RawProfileResponse): PlayerProfile {
  const profile = raw?.data ?? raw;
  const backendPlayer: RawPlayer = profile?.player ?? {};

  const name = backendPlayer.name ?? profile?.name ?? "Player";

  // NEW: personal details (nested player first, then flat fallback)
  const dob = String(backendPlayer.dob ?? profile?.dob ?? "");
  const gender = String(backendPlayer.gender ?? profile?.gender ?? "");
  const phone = String(
    backendPlayer.phone ??
      backendPlayer.mobile ??
      profile?.phone ??
      profile?.mobile ??
      ""
  );

  const joinedAt =
    backendPlayer.joinedAt ??
    backendPlayer.joined_at ??
    profile?.joinedAt ??
    profile?.joined_at ??
    new Date().toISOString();

  const gamesPlayed = Number(profile?.stats?.gamesPlayed ?? 0);
  const gamesWon = Number(profile?.stats?.gamesWon ?? 0);

  const stats: PlayerStats = {
    gamesPlayed,
    gamesWon,
    gamesLost: Number(profile?.stats?.gamesLost ?? 0),
    highScore: Number(profile?.stats?.highScore ?? 0),
    currentStreak: Number(profile?.stats?.currentStreak ?? 0),
    bestStreak: Number(profile?.stats?.bestStreak ?? 0),
    winRate: Number(
      profile?.stats?.winRate ??
        (gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0)
    ),
  };

  return {
    id: backendPlayer.id ?? profile?.id,
    name,

    dob,
    gender,
    phone,

    joinedAt,

    level: Number(profile?.level ?? 1),
    xp: Number(profile?.xp ?? 0),
    xpForNext: Number(profile?.xpForNext ?? 300),
    totalXp: Number(profile?.totalXp ?? profile?.xp ?? 0),

    stats,

    badges: Array.isArray(profile?.badges) ? profile.badges : [],

    recentActivity: Array.isArray(profile?.recentActivity)
      ? profile.recentActivity
      : [],
  };
}

/* =========================================================
   FETCH PLAYER  (the logged-in account's own profile)
========================================================= */

export const fetchPlayer = async (): Promise<PlayerProfile> => {
  // Backend (DB) la irundhu account eduthukkum / illa na create pannum
  const player = await ensureAccount();

  console.log("PROFILE: playerId:", player.id);

  const raw = await request<RawProfileResponse>(
    `/player?playerId=${encodeURIComponent(String(player.id))}`
  );

  console.log("PROFILE: player response:", JSON.stringify(raw));

  return normalizeProfile(raw);
};

/* =========================================================
   UPDATE PLAYER NAME  (only the logged-in account changes)
========================================================= */

export const updatePlayerName = async (
  name: string
): Promise<PlayerProfile> => {
  const player = await ensureAccount();

  const raw = await request<RawProfileResponse>(
    `/player?playerId=${encodeURIComponent(String(player.id))}`,
    {
      method: "PUT",
      body: JSON.stringify({
        name,
        playerId: player.id,
      }),
    }
  );

  return normalizeProfile(raw);
};

/* =========================================================
   LOG ACTIVITY
========================================================= */

export const logActivity = async (body: {
  game: ActivityGame;
  type: ActivityType;
  value?: number;
}): Promise<PlayerProfile> => {
  const player = await ensureAccount();

  const raw = await request<RawProfileResponse>("/player/activity", {
    method: "POST",
    body: JSON.stringify({
      ...body,
      playerId: player.id,
    }),
  });

  return normalizeProfile(raw);
};