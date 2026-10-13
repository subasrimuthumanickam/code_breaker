// // // // // export type Difficulty = "easy" | "medium" | "hard" | "extreme";

// // // // // export interface DifficultyConfig {
// // // // //   label: string;
// // // // //   codeLength: number;
// // // // //   maxAttempts: number;
// // // // //   timeLimitSec: number;
// // // // //   color: string;
// // // // // }

// // // // // // Only 10 possible digits (0-9), so codeLength must stay <= 10 to keep
// // // // // // "no repeated digit" guarantees possible. This is the ONLY place these
// // // // // // numbers live — every screen reads from here, nothing is duplicated.
// // // // // export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
// // // // //   easy: { label: "EASY", codeLength: 3, maxAttempts: 5, timeLimitSec: 30, color: "#22C55E" },
// // // // //   medium: { label: "MEDIUM", codeLength: 4, maxAttempts: 5, timeLimitSec: 45, color: "#EAB308" },
// // // // //   hard: { label: "HARD", codeLength: 5, maxAttempts: 4, timeLimitSec: 60, color: "#EF4444" },
// // // // //   extreme: { label: "EXTREME", codeLength: 6, maxAttempts: 3, timeLimitSec: 90, color: "#A855F7" },
// // // // // };
// // // // export type Difficulty = "easy" | "medium" | "hard" | "extreme";
// // // // export type ClueType = "direct" | "moderate" | "hard";

// // // // export interface DifficultyConfig {
// // // //   label: string;
// // // //   codeLength: number;
// // // //   maxAttempts: number;
// // // //   timeLimitSec: number; // per-round time limit
// // // //   rounds: number;       // number of separate rounds in one session at this difficulty
// // // //   clueType: ClueType;
// // // //   color: string;
// // // // }

// // // // // MUST stay in sync with backend config/difficulty.js — the backend is the
// // // // // source of truth for scoring/attempts/time, this file just mirrors it.
// // // // export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
// // // //   easy: { label: "EASY", codeLength: 3, maxAttempts: 4, timeLimitSec: 240, rounds: 8, clueType: "direct", color: "#22C55E" },
// // // //   medium: { label: "MEDIUM", codeLength: 4, maxAttempts: 6, timeLimitSec: 180, rounds: 7, clueType: "moderate", color: "#F5C518" },
// // // //   hard: { label: "HARD", codeLength: 5, maxAttempts: 8, timeLimitSec: 120, rounds: 6, clueType: "hard", color: "#F97316" },
// // // //   extreme: { label: "EXTREME", codeLength: 6, maxAttempts: 10, timeLimitSec: 60, rounds: 4, clueType: "hard", color: "#EF4444" },
// // // // };
// // // export type Difficulty = "easy" | "medium" | "hard" | "extreme";
// // // export type ClueType = "direct" | "moderate" | "hard";

// // // export interface DifficultyConfig {
// // //   label: string;
// // //   codeLength: number;
// // //   maxAttempts: number;
// // //   timeLimitSec: number; // per-round time limit
// // //   rounds: number;       // number of separate rounds in one session at this difficulty
// // //   clueType: ClueType;
// // //   color: string;
// // // }

// // // // MUST stay in sync with backend config/difficulty.js — the backend is the
// // // // source of truth for scoring/attempts/time, this file just mirrors it.
// // // export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
// // //   easy: { label: "EASY", codeLength: 3, maxAttempts: 4, timeLimitSec: 240, rounds: 8, clueType: "direct", color: "#22C55E" },
// // //   medium: { label: "MEDIUM", codeLength: 4, maxAttempts: 6, timeLimitSec: 180, rounds: 7, clueType: "moderate", color: "#F5C518" },
// // //   hard: { label: "HARD", codeLength: 5, maxAttempts: 8, timeLimitSec: 120, rounds: 6, clueType: "hard", color: "#F97316" },
// // //   extreme: { label: "EXTREME", codeLength: 6, maxAttempts: 10, timeLimitSec: 60, rounds: 4, clueType: "hard", color: "#EF4444" },
// // // };
// // // frontend/src/types/game.ts

// // export type Difficulty = "easy" | "medium" | "hard" | "extreme";

// // export interface DifficultyOption {
// //   label: string;
// //   codeLength: number;
// //   maxAttempts: number;
  
// //   timeLimitSec: number;
// //   color: string;
// // }

// // // ⚠️ These values must match backend/src/config/difficulty.js exactly —
// // // this file is only for display (DifficultyScreen labels, GameScreen hearts count).
// // // The backend is the source of truth for actual game rules.
// // export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyOption> = {
// //   easy: {
// //     label: "Easy",
// //     codeLength: 3,
// //     maxAttempts: 6,       // 👈 matches backend now
// //     timeLimitSec: 90,
// //     color: "#22C55E",
// //   },
// //   medium: {
// //     label: "Medium",
// //     codeLength: 4,
// //     maxAttempts: 8,
// //     timeLimitSec: 90,
// //     color: "#F5C518",
// //   },
// //   hard: {
// //     label: "Hard",
// //     codeLength: 4,
// //     maxAttempts: 8,
// //     timeLimitSec: 75,
// //     color: "#F97066",
// //   },
// //   extreme: {
// //     label: "Extreme",
// //     codeLength: 5,
// //     maxAttempts: 10,
// //     timeLimitSec: 60,
// //     color: "#A855F7",
// //   },
// // };
// export type Difficulty = "easy" | "medium" | "hard" | "extreme";

// export interface DifficultyOption {
//   label: string;
//   codeLength: number;
//   maxAttempts: number;
//   rounds: number;
//   timeLimitSec: number;
//   color: string;
// }

// // ⚠️ These values must match backend/src/config/difficulty.js exactly —
// // this file is only for display (DifficultyScreen labels, GameScreen hearts count).
// // The backend is the source of truth for actual game rules.
// export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyOption> = {
//   easy: {
//     label: "Easy",
//     codeLength: 3,
//     maxAttempts: 6,       // 👈 matches backend now
//     rounds: 3,             // ⚠️ verify against backend/src/config/difficulty.js
//     timeLimitSec: 90,
//     color: "#22C55E",
//   },
//   medium: {
//     label: "Medium",
//     codeLength: 4,
//     maxAttempts: 8,
//     rounds: 4,             // ⚠️ verify against backend/src/config/difficulty.js
//     timeLimitSec: 90,
//     color: "#F5C518",
//   },
//   hard: {
//     label: "Hard",
//     codeLength: 4,
//     maxAttempts: 8,
//     rounds: 5,             // ⚠️ verify against backend/src/config/difficulty.js
//     timeLimitSec: 75,
//     color: "#F97066",
//   },
//   extreme: {
//     label: "Extreme",
//     codeLength: 5,
//     maxAttempts: 10,
//     rounds: 6,             // ⚠️ verify against backend/src/config/difficulty.js
//     timeLimitSec: 60,
//     color: "#A855F7",
//   },
// };
export type Difficulty = "easy" | "medium" | "hard" | "extreme";

export type ClueType = "direct" | "counts" | "hard";

export interface DifficultyOption {
  label: string;
  clueType: ClueType;
  codeLength: number;
  maxAttempts: number;
  rounds: number;
  timeLimitSec: number;
  color: string;
}

// ⚠️ These values must match backend/src/config/difficulty.js exactly —
// this file is only for display (DifficultyScreen labels, GameScreen hearts count)
// AND for the frontend's clueType branching (free-reveal digit, numpad coloring, etc).
// The backend is the source of truth for actual game rules.
export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyOption> = {
  easy: {
    label: "Easy",
    clueType: "direct",
    codeLength: 3,
    maxAttempts: 6,
    rounds: 7,             // matches backend/src/config/difficulty.js
    timeLimitSec: 240,     // matches backend/src/config/difficulty.js
    color: "#22C55E",
  },
  medium: {
    label: "Medium",
    clueType: "counts",
    codeLength: 4,
    maxAttempts: 8,
    rounds: 7,             // matches backend/src/config/difficulty.js
    timeLimitSec: 180,     // matches backend/src/config/difficulty.js
    color: "#F5C518",
  },
  hard: {
    label: "Hard",
    clueType: "hard",
    codeLength: 4,
    maxAttempts: 8,
    rounds: 7,             // matches backend/src/config/difficulty.js
    timeLimitSec: 120,     // matches backend/src/config/difficulty.js
    color: "#F97066",
  },
  extreme: {
    label: "Extreme",
    clueType: "hard",
    codeLength: 5,
    maxAttempts: 10,
    rounds: 7,             // matches backend/src/config/difficulty.js
    timeLimitSec: 60,      // matches backend/src/config/difficulty.js
    color: "#A855F7",
  },
};