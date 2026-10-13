// // // // // // // // // // // import { API_BASE_URL } from "./api";

// // // // // // // // // // // export interface WordScramblePlayer {
// // // // // // // // // // //   id: number;
// // // // // // // // // // //   player_name: string;
// // // // // // // // // // //   is_ready: boolean;
// // // // // // // // // // //   score: number;
// // // // // // // // // // //   lives_left?: number;
// // // // // // // // // // // }

// // // // // // // // // // // export type WordScrambleDifficulty = "easy" | "medium" | "hard";

// // // // // // // // // // // export interface WordScrambleRoom {
// // // // // // // // // // //   id: number;
// // // // // // // // // // //   roomCode: string;
// // // // // // // // // // //   roomName: string;
// // // // // // // // // // //   roomType: "public" | "private";
// // // // // // // // // // //   maxPlayers: number;
// // // // // // // // // // //   difficulty: WordScrambleDifficulty;
// // // // // // // // // // //   status: "waiting" | "in_progress" | "finished";
// // // // // // // // // // //   hostPlayerName: string;
// // // // // // // // // // //   totalRounds: number;
// // // // // // // // // // //   timeLimitSec: number;
// // // // // // // // // // //   lives: number;
// // // // // // // // // // //   players: WordScramblePlayer[];
// // // // // // // // // // // }

// // // // // // // // // // // export async function fetchGameConfig(
// // // // // // // // // // //   difficulty: WordScrambleDifficulty = "easy"
// // // // // // // // // // // ): Promise<{
// // // // // // // // // // //   totalRounds: number;
// // // // // // // // // // //   timeLimitSec: number;
// // // // // // // // // // //   lives: number;
// // // // // // // // // // //   freeReveals: number;
// // // // // // // // // // // }> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/config/${difficulty}`);
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to fetch game config");
// // // // // // // // // // //   return {
// // // // // // // // // // //     totalRounds: data.totalRounds,
// // // // // // // // // // //     timeLimitSec: data.timeLimitSec,
// // // // // // // // // // //     lives: data.lives,
// // // // // // // // // // //     freeReveals: data.freeReveals,
// // // // // // // // // // //   };
// // // // // // // // // // // }

// // // // // // // // // // // export async function createRoom(payload: {
// // // // // // // // // // //   roomName: string;
// // // // // // // // // // //   roomType: "public" | "private";
// // // // // // // // // // //   maxPlayers: number;
// // // // // // // // // // //   playerName: string;
// // // // // // // // // // //   difficulty: WordScrambleDifficulty;
// // // // // // // // // // // }): Promise<WordScrambleRoom> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/rooms`, {
// // // // // // // // // // //     method: "POST",
// // // // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // // // //     body: JSON.stringify(payload),
// // // // // // // // // // //   });
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to create room");
// // // // // // // // // // //   return data.room;
// // // // // // // // // // // }

// // // // // // // // // // // export async function joinRoom(
// // // // // // // // // // //   roomCode: string,
// // // // // // // // // // //   playerName: string
// // // // // // // // // // // ): Promise<WordScrambleRoom> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/rooms/${roomCode}/join`, {
// // // // // // // // // // //     method: "POST",
// // // // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // // // //     body: JSON.stringify({ playerName }),
// // // // // // // // // // //   });
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to join room");
// // // // // // // // // // //   return data.room;
// // // // // // // // // // // }

// // // // // // // // // // // export async function fetchRoom(roomCode: string): Promise<WordScrambleRoom> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/rooms/${roomCode}`);
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to fetch room");
// // // // // // // // // // //   return data.room;
// // // // // // // // // // // }

// // // // // // // // // // // export async function updateRoomSettings(
// // // // // // // // // // //   roomCode: string,
// // // // // // // // // // //   playerName: string,
// // // // // // // // // // //   settings: { totalRounds?: number; timePerRoundSec?: number }
// // // // // // // // // // // ): Promise<WordScrambleRoom> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/rooms/${roomCode}/settings`, {
// // // // // // // // // // //     method: "PATCH",
// // // // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // // // //     body: JSON.stringify({ playerName, ...settings }),
// // // // // // // // // // //   });
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to update room settings");
// // // // // // // // // // //   return data.room;
// // // // // // // // // // // }

// // // // // // // // // // // export async function fetchLeaderboard(): Promise<
// // // // // // // // // // //   { rank: number; name: string; score: number }[]
// // // // // // // // // // // > {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/leaderboard`);
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to fetch leaderboard");
// // // // // // // // // // //   return data.players;
// // // // // // // // // // // }

// // // // // // // // // // // export interface RoundInfo {
// // // // // // // // // // //   id: number;
// // // // // // // // // // //   roundNumber: number;
// // // // // // // // // // //   totalRounds: number;
// // // // // // // // // // //   scrambled: string;
// // // // // // // // // // //   clue: string;
// // // // // // // // // // //   clueType: "direct" | "moderate" | "vague";
// // // // // // // // // // //   timeLimitSec: number;
// // // // // // // // // // //   lives: number;
// // // // // // // // // // //   freeReveals: number;
// // // // // // // // // // // }

// // // // // // // // // // // export async function startGame(roomCode: string): Promise<RoundInfo> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/rooms/${roomCode}/start`, {
// // // // // // // // // // //     method: "POST",
// // // // // // // // // // //   });
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to start game");
// // // // // // // // // // //   return data.round;
// // // // // // // // // // // }

// // // // // // // // // // // export async function submitAnswer(
// // // // // // // // // // //   roundId: number,
// // // // // // // // // // //   playerName: string,
// // // // // // // // // // //   answer: string,
// // // // // // // // // // //   timeTakenSec: number
// // // // // // // // // // // ): Promise<{ isCorrect: boolean; points: number; livesLeft: number }> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/rounds/${roundId}/answer`, {
// // // // // // // // // // //     method: "POST",
// // // // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // // // //     body: JSON.stringify({ playerName, answer, timeTakenSec }),
// // // // // // // // // // //   });
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to submit answer");
// // // // // // // // // // //   return data;
// // // // // // // // // // // }

// // // // // // // // // // // export interface RoundResults {
// // // // // // // // // // //   word: string;
// // // // // // // // // // //   roundNumber: number;
// // // // // // // // // // //   totalRounds: number;
// // // // // // // // // // //   answers: {
// // // // // // // // // // //     player_name: string;
// // // // // // // // // // //     answer: string;
// // // // // // // // // // //     is_correct: boolean;
// // // // // // // // // // //     time_taken_sec: number;
// // // // // // // // // // //     points: number;
// // // // // // // // // // //   }[];
// // // // // // // // // // //   standings: { player_name: string; score: number; lives_left?: number }[];
// // // // // // // // // // // }

// // // // // // // // // // // export async function fetchRoundResults(roundId: number): Promise<RoundResults> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/rounds/${roundId}/results`);
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to fetch round results");
// // // // // // // // // // //   return data;
// // // // // // // // // // // }

// // // // // // // // // // // export async function nextRound(
// // // // // // // // // // //   roomCode: string
// // // // // // // // // // // ): Promise<{ finished: boolean; round?: RoundInfo }> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/rooms/${roomCode}/next-round`, {
// // // // // // // // // // //     method: "POST",
// // // // // // // // // // //   });
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to advance round");
// // // // // // // // // // //   return data;
// // // // // // // // // // // }

// // // // // // // // // // // export interface FinalStandings {
// // // // // // // // // // //   standings: { player_name: string; score: number; lives_left?: number }[];
// // // // // // // // // // //   fastestAnswer: { player_name: string; best_time: number } | null;
// // // // // // // // // // //   totalRounds: number;
// // // // // // // // // // // }

// // // // // // // // // // // export async function fetchFinalStandings(roomCode: string): Promise<FinalStandings> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/rooms/${roomCode}/final`);
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to fetch final standings");
// // // // // // // // // // //   return data;
// // // // // // // // // // // }

// // // // // // // // // // // export async function sendMessage(roomCode: string, playerName: string, message: string) {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/rooms/${roomCode}/messages`, {
// // // // // // // // // // //     method: "POST",
// // // // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // // // //     body: JSON.stringify({ playerName, message }),
// // // // // // // // // // //   });
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to send message");
// // // // // // // // // // // }

// // // // // // // // // // // export async function fetchMessages(
// // // // // // // // // // //   roomCode: string
// // // // // // // // // // // ): Promise<{ player_name: string; message: string; sent_at: string }[]> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/rooms/${roomCode}/messages`);
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to fetch messages");
// // // // // // // // // // //   return data.messages;
// // // // // // // // // // // }

// // // // // // // // // // // export interface WordEntry {
// // // // // // // // // // //   id: number;
// // // // // // // // // // //   word: string;
// // // // // // // // // // //   clue: string;
// // // // // // // // // // //   difficulty: WordScrambleDifficulty;
// // // // // // // // // // //   created_at?: string;
// // // // // // // // // // // }

// // // // // // // // // // // export async function fetchWords(
// // // // // // // // // // //   difficulty?: WordScrambleDifficulty
// // // // // // // // // // // ): Promise<WordEntry[]> {
// // // // // // // // // // //   const query = difficulty ? `?difficulty=${difficulty}` : "";
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/words${query}`);
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to fetch words");
// // // // // // // // // // //   return data.words;
// // // // // // // // // // // }

// // // // // // // // // // // export async function addWord(
// // // // // // // // // // //   word: string,
// // // // // // // // // // //   clue: string,
// // // // // // // // // // //   difficulty: WordScrambleDifficulty
// // // // // // // // // // // ): Promise<WordEntry> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/words`, {
// // // // // // // // // // //     method: "POST",
// // // // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // // // //     body: JSON.stringify({ word, clue, difficulty }),
// // // // // // // // // // //   });
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to add word");
// // // // // // // // // // //   return data.wordEntry;
// // // // // // // // // // // }

// // // // // // // // // // // export async function deleteWord(id: number): Promise<void> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}/wordscramble/words/${id}`, {
// // // // // // // // // // //     method: "DELETE",
// // // // // // // // // // //   });
// // // // // // // // // // //   const data = await res.json();
// // // // // // // // // // //   if (!res.ok) throw new Error(data.error || "Failed to delete word");
// // // // // // // // // // // }
// // // // // // // // // // import { API_BASE_URL } from "./api";

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    TYPES
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export interface WordScramblePlayer {
// // // // // // // // // //   id: number;
// // // // // // // // // //   player_name: string;
// // // // // // // // // //   is_ready: boolean;
// // // // // // // // // //   score: number;
// // // // // // // // // //   lives_left?: number;
// // // // // // // // // // }

// // // // // // // // // // export type WordScrambleDifficulty = "easy" | "medium" | "hard";

// // // // // // // // // // export interface WordScrambleRoom {
// // // // // // // // // //   id: number;
// // // // // // // // // //   roomCode: string;
// // // // // // // // // //   roomName: string;
// // // // // // // // // //   roomType: "public" | "private";
// // // // // // // // // //   maxPlayers: number;
// // // // // // // // // //   difficulty: WordScrambleDifficulty;
// // // // // // // // // //   status: "waiting" | "in_progress" | "finished";
// // // // // // // // // //   hostPlayerName: string;
// // // // // // // // // //   totalRounds: number;
// // // // // // // // // //   timeLimitSec: number;
// // // // // // // // // //   lives: number;
// // // // // // // // // //   players: WordScramblePlayer[];
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    GAME CONFIG
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export async function fetchGameConfig(
// // // // // // // // // //   difficulty: WordScrambleDifficulty = "easy"
// // // // // // // // // // ): Promise<{
// // // // // // // // // //   totalRounds: number;
// // // // // // // // // //   timeLimitSec: number;
// // // // // // // // // //   lives: number;
// // // // // // // // // //   freeReveals: number;
// // // // // // // // // // }> {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/config/${difficulty}`
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to fetch game config"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return {
// // // // // // // // // //     totalRounds: data.totalRounds,
// // // // // // // // // //     timeLimitSec: data.timeLimitSec,
// // // // // // // // // //     lives: data.lives,
// // // // // // // // // //     freeReveals: data.freeReveals,
// // // // // // // // // //   };
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    CREATE ROOM
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export async function createRoom(payload: {
// // // // // // // // // //   roomName: string;
// // // // // // // // // //   roomType: "public" | "private";
// // // // // // // // // //   maxPlayers: number;
// // // // // // // // // //   playerName: string;
// // // // // // // // // //   difficulty: WordScrambleDifficulty;
// // // // // // // // // // }): Promise<WordScrambleRoom> {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/rooms`,
// // // // // // // // // //     {
// // // // // // // // // //       method: "POST",
// // // // // // // // // //       headers: {
// // // // // // // // // //         "Content-Type": "application/json",
// // // // // // // // // //       },
// // // // // // // // // //       body: JSON.stringify(payload),
// // // // // // // // // //     }
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to create room"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return data.room;
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    JOIN ROOM
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export async function joinRoom(
// // // // // // // // // //   roomCode: string,
// // // // // // // // // //   playerName: string
// // // // // // // // // // ): Promise<WordScrambleRoom> {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/rooms/${roomCode}/join`,
// // // // // // // // // //     {
// // // // // // // // // //       method: "POST",
// // // // // // // // // //       headers: {
// // // // // // // // // //         "Content-Type": "application/json",
// // // // // // // // // //       },
// // // // // // // // // //       body: JSON.stringify({
// // // // // // // // // //         playerName,
// // // // // // // // // //       }),
// // // // // // // // // //     }
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to join room"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return data.room;
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    FETCH ROOM
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export async function fetchRoom(
// // // // // // // // // //   roomCode: string
// // // // // // // // // // ): Promise<WordScrambleRoom> {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/rooms/${roomCode}`
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to fetch room"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return data.room;
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    ROOM SETTINGS
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export async function updateRoomSettings(
// // // // // // // // // //   roomCode: string,
// // // // // // // // // //   playerName: string,
// // // // // // // // // //   settings: {
// // // // // // // // // //     totalRounds?: number;
// // // // // // // // // //     timePerRoundSec?: number;
// // // // // // // // // //   }
// // // // // // // // // // ): Promise<WordScrambleRoom> {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/rooms/${roomCode}/settings`,
// // // // // // // // // //     {
// // // // // // // // // //       method: "PATCH",
// // // // // // // // // //       headers: {
// // // // // // // // // //         "Content-Type": "application/json",
// // // // // // // // // //       },
// // // // // // // // // //       body: JSON.stringify({
// // // // // // // // // //         playerName,
// // // // // // // // // //         ...settings,
// // // // // // // // // //       }),
// // // // // // // // // //     }
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to update room settings"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return data.room;
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    LEADERBOARD
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export async function fetchLeaderboard(): Promise<
// // // // // // // // // //   {
// // // // // // // // // //     rank: number;
// // // // // // // // // //     name: string;
// // // // // // // // // //     score: number;
// // // // // // // // // //   }[]
// // // // // // // // // // > {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/leaderboard`
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to fetch leaderboard"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return data.players;
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    ROUND
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export interface RoundInfo {
// // // // // // // // // //   id: number;
// // // // // // // // // //   roundNumber: number;
// // // // // // // // // //   totalRounds: number;
// // // // // // // // // //   scrambled: string;
// // // // // // // // // //   clue: string;
// // // // // // // // // //   clueType: "direct" | "moderate" | "vague";
// // // // // // // // // //   timeLimitSec: number;
// // // // // // // // // //   lives: number;
// // // // // // // // // //   freeReveals: number;
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    START GAME
// // // // // // // // // //    Used ONLY when starting the game initially.
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export async function startGame(
// // // // // // // // // //   roomCode: string
// // // // // // // // // // ): Promise<RoundInfo> {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/rooms/${roomCode}/start`,
// // // // // // // // // //     {
// // // // // // // // // //       method: "POST",
// // // // // // // // // //     }
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to start game"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return data.round;
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    SUBMIT ANSWER
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export async function submitAnswer(
// // // // // // // // // //   roundId: number,
// // // // // // // // // //   playerName: string,
// // // // // // // // // //   answer: string,
// // // // // // // // // //   timeTakenSec: number
// // // // // // // // // // ): Promise<{
// // // // // // // // // //   isCorrect: boolean;
// // // // // // // // // //   points: number;
// // // // // // // // // //   livesLeft: number;
// // // // // // // // // // }> {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/rounds/${roundId}/answer`,
// // // // // // // // // //     {
// // // // // // // // // //       method: "POST",
// // // // // // // // // //       headers: {
// // // // // // // // // //         "Content-Type": "application/json",
// // // // // // // // // //       },
// // // // // // // // // //       body: JSON.stringify({
// // // // // // // // // //         playerName,
// // // // // // // // // //         answer,
// // // // // // // // // //         timeTakenSec,
// // // // // // // // // //       }),
// // // // // // // // // //     }
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to submit answer"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return {
// // // // // // // // // //     isCorrect: Boolean(data.isCorrect),
// // // // // // // // // //     points: Number(data.points || 0),
// // // // // // // // // //     livesLeft: Number(data.livesLeft ?? 0),
// // // // // // // // // //   };
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    NEW FUNCTION
// // // // // // // // // //    WRONG ANSWER → SAME ROUND + NEW QUESTION
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export async function retryRound(
// // // // // // // // // //   roundId: number,
// // // // // // // // // //   roomCode: string
// // // // // // // // // // ): Promise<RoundInfo> {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/rounds/${roundId}/retry`,
// // // // // // // // // //     {
// // // // // // // // // //       method: "POST",
// // // // // // // // // //       headers: {
// // // // // // // // // //         "Content-Type": "application/json",
// // // // // // // // // //       },
// // // // // // // // // //       body: JSON.stringify({
// // // // // // // // // //         roomCode,
// // // // // // // // // //       }),
// // // // // // // // // //     }
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to load new question"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   if (!data.round) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       "Backend did not return a new round"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return data.round;
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    ROUND RESULTS
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export interface RoundResults {
// // // // // // // // // //   word: string;
// // // // // // // // // //   roundNumber: number;
// // // // // // // // // //   totalRounds: number;

// // // // // // // // // //   answers: {
// // // // // // // // // //     player_name: string;
// // // // // // // // // //     answer: string;
// // // // // // // // // //     is_correct: boolean;
// // // // // // // // // //     time_taken_sec: number;
// // // // // // // // // //     points: number;
// // // // // // // // // //   }[];

// // // // // // // // // //   standings: {
// // // // // // // // // //     player_name: string;
// // // // // // // // // //     score: number;
// // // // // // // // // //     lives_left?: number;
// // // // // // // // // //   }[];
// // // // // // // // // // }

// // // // // // // // // // export async function fetchRoundResults(
// // // // // // // // // //   roundId: number
// // // // // // // // // // ): Promise<RoundResults> {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/rounds/${roundId}/results`
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to fetch round results"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return data;
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    NEXT ROUND
// // // // // // // // // //    ONLY CALL THIS AFTER CORRECT ANSWER
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export async function nextRound(
// // // // // // // // // //   roomCode: string
// // // // // // // // // // ): Promise<{
// // // // // // // // // //   finished: boolean;
// // // // // // // // // //   round?: RoundInfo;
// // // // // // // // // // }> {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/rooms/${roomCode}/next-round`,
// // // // // // // // // //     {
// // // // // // // // // //       method: "POST",
// // // // // // // // // //     }
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to advance round"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return data;
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    FINAL STANDINGS
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export interface FinalStandings {
// // // // // // // // // //   standings: {
// // // // // // // // // //     player_name: string;
// // // // // // // // // //     score: number;
// // // // // // // // // //     lives_left?: number;
// // // // // // // // // //   }[];

// // // // // // // // // //   fastestAnswer: {
// // // // // // // // // //     player_name: string;
// // // // // // // // // //     best_time: number;
// // // // // // // // // //   } | null;

// // // // // // // // // //   totalRounds: number;
// // // // // // // // // // }

// // // // // // // // // // export async function fetchFinalStandings(
// // // // // // // // // //   roomCode: string
// // // // // // // // // // ): Promise<FinalStandings> {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/rooms/${roomCode}/final`
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to fetch final standings"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return data;
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    CHAT
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export async function sendMessage(
// // // // // // // // // //   roomCode: string,
// // // // // // // // // //   playerName: string,
// // // // // // // // // //   message: string
// // // // // // // // // // ) {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/rooms/${roomCode}/messages`,
// // // // // // // // // //     {
// // // // // // // // // //       method: "POST",
// // // // // // // // // //       headers: {
// // // // // // // // // //         "Content-Type": "application/json",
// // // // // // // // // //       },
// // // // // // // // // //       body: JSON.stringify({
// // // // // // // // // //         playerName,
// // // // // // // // // //         message,
// // // // // // // // // //       }),
// // // // // // // // // //     }
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to send message"
// // // // // // // // // //     );
// // // // // // // // // //   }
// // // // // // // // // // }

// // // // // // // // // // export async function fetchMessages(
// // // // // // // // // //   roomCode: string
// // // // // // // // // // ): Promise<
// // // // // // // // // //   {
// // // // // // // // // //     player_name: string;
// // // // // // // // // //     message: string;
// // // // // // // // // //     sent_at: string;
// // // // // // // // // //   }[]
// // // // // // // // // // > {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/rooms/${roomCode}/messages`
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to fetch messages"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return data.messages;
// // // // // // // // // // }

// // // // // // // // // // /* =========================================================
// // // // // // // // // //    WORD MANAGEMENT
// // // // // // // // // // ========================================================= */

// // // // // // // // // // export interface WordEntry {
// // // // // // // // // //   id: number;
// // // // // // // // // //   word: string;
// // // // // // // // // //   clue: string;
// // // // // // // // // //   difficulty: WordScrambleDifficulty;
// // // // // // // // // //   created_at?: string;
// // // // // // // // // // }

// // // // // // // // // // /* GET WORDS */

// // // // // // // // // // export async function fetchWords(
// // // // // // // // // //   difficulty?: WordScrambleDifficulty
// // // // // // // // // // ): Promise<WordEntry[]> {
// // // // // // // // // //   const query = difficulty
// // // // // // // // // //     ? `?difficulty=${difficulty}`
// // // // // // // // // //     : "";

// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/words${query}`
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to fetch words"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return data.words;
// // // // // // // // // // }

// // // // // // // // // // /* ADD WORD */

// // // // // // // // // // export async function addWord(
// // // // // // // // // //   word: string,
// // // // // // // // // //   clue: string,
// // // // // // // // // //   difficulty: WordScrambleDifficulty
// // // // // // // // // // ): Promise<WordEntry> {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/words`,
// // // // // // // // // //     {
// // // // // // // // // //       method: "POST",
// // // // // // // // // //       headers: {
// // // // // // // // // //         "Content-Type": "application/json",
// // // // // // // // // //       },
// // // // // // // // // //       body: JSON.stringify({
// // // // // // // // // //         word,
// // // // // // // // // //         clue,
// // // // // // // // // //         difficulty,
// // // // // // // // // //       }),
// // // // // // // // // //     }
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to add word"
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return data.wordEntry;
// // // // // // // // // // }

// // // // // // // // // // /* DELETE WORD */

// // // // // // // // // // export async function deleteWord(
// // // // // // // // // //   id: number
// // // // // // // // // // ): Promise<void> {
// // // // // // // // // //   const res = await fetch(
// // // // // // // // // //     `${API_BASE_URL}/wordscramble/words/${id}`,
// // // // // // // // // //     {
// // // // // // // // // //       method: "DELETE",
// // // // // // // // // //     }
// // // // // // // // // //   );

// // // // // // // // // //   const data = await res.json();

// // // // // // // // // //   if (!res.ok) {
// // // // // // // // // //     throw new Error(
// // // // // // // // // //       data.error || "Failed to delete word"
// // // // // // // // // //     );
// // // // // // // // // //   }
// // // // // // // // // // }
// // // // // // // // // import { API_BASE_URL } from "./api";

// // // // // // // // // /* ============================================================
// // // // // // // // //    TYPES
// // // // // // // // // ============================================================ */

// // // // // // // // // export interface WordSlot {
// // // // // // // // //   id: string;
// // // // // // // // //   length: number;
// // // // // // // // // }

// // // // // // // // // export interface FoundWord {
// // // // // // // // //   id: string;
// // // // // // // // //   word: string;
// // // // // // // // //   foundBy: string;
// // // // // // // // // }

// // // // // // // // // export interface HuntRound {
// // // // // // // // //   id: string;
// // // // // // // // //   roundNumber: number;
// // // // // // // // //   totalRounds: number;
// // // // // // // // //   timeLimitSec: number;
// // // // // // // // //   theme?: string;
// // // // // // // // //   baseLetters: string[];
// // // // // // // // //   wordSlots: WordSlot[];
// // // // // // // // //   totalWords: number;
// // // // // // // // //   foundWords: FoundWord[];
// // // // // // // // // }

// // // // // // // // // export interface Player {
// // // // // // // // //   id?: number;
// // // // // // // // //   player_name: string;
// // // // // // // // //   is_ready?: boolean;
// // // // // // // // //   is_host?: boolean;
// // // // // // // // //   avatar_color?: string;
// // // // // // // // //   score: number;
// // // // // // // // // }

// // // // // // // // // export interface WordScrambleRoom {
// // // // // // // // //   id: number;
// // // // // // // // //   roomCode: string;
// // // // // // // // //   roomName: string;
// // // // // // // // //   roomType: string;
// // // // // // // // //   maxPlayers: number;
// // // // // // // // //   minPlayers: number;
// // // // // // // // //   difficulty: string;
// // // // // // // // //   status: string;
// // // // // // // // //   totalRounds: number;
// // // // // // // // //   timeLimitSec: number;
// // // // // // // // //   lives: number;
// // // // // // // // //   players: Player[];
// // // // // // // // // }

// // // // // // // // // export interface ChatMessage {
// // // // // // // // //   player_name: string;
// // // // // // // // //   message: string;
// // // // // // // // //   sent_at: string;
// // // // // // // // // }

// // // // // // // // // export interface RoundAnswer {
// // // // // // // // //   player_name: string;
// // // // // // // // //   answer: string;
// // // // // // // // //   is_correct: boolean;
// // // // // // // // //   time_taken_sec: number;
// // // // // // // // //   points: number;
// // // // // // // // // }

// // // // // // // // // export interface RoundResults {
// // // // // // // // //   word: string;
// // // // // // // // //   roundNumber: number;
// // // // // // // // //   totalRounds: number;
// // // // // // // // //   answers: RoundAnswer[];
// // // // // // // // //   standings: Player[];
// // // // // // // // // }

// // // // // // // // // /* ============================================================
// // // // // // // // //    WORD HUNT ROUND (existing — unchanged)
// // // // // // // // // ============================================================ */

// // // // // // // // // /**
// // // // // // // // //  * Fetches (or starts) the word-hunt round for a room.
// // // // // // // // //  * GET /api/wordscramble/round/:roomCode
// // // // // // // // //  */
// // // // // // // // // export async function getWordHuntRound(roomCode: string): Promise<HuntRound> {
// // // // // // // // //   const response = await fetch(`${API_BASE_URL}/wordscramble/round/${roomCode}`);

// // // // // // // // //   if (!response.ok) {
// // // // // // // // //     throw new Error(`Failed to load round: ${response.status}`);
// // // // // // // // //   }

// // // // // // // // //   return response.json();
// // // // // // // // // }

// // // // // // // // // /**
// // // // // // // // //  * Submits one word attempt.
// // // // // // // // //  * POST /api/wordscramble/submit-word
// // // // // // // // //  * body: { roundId, playerName, word }
// // // // // // // // //  */
// // // // // // // // // export async function submitWord(
// // // // // // // // //   roundId: string,
// // // // // // // // //   playerName: string,
// // // // // // // // //   word: string
// // // // // // // // // ): Promise<{
// // // // // // // // //   isCorrect: boolean;
// // // // // // // // //   wordsFound: number;
// // // // // // // // //   totalWords: number;
// // // // // // // // //   foundWords: FoundWord[];
// // // // // // // // //   isRoundComplete?: boolean;
// // // // // // // // // }> {
// // // // // // // // //   const response = await fetch(`${API_BASE_URL}/wordscramble/submit-word`, {
// // // // // // // // //     method: "POST",
// // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // //     body: JSON.stringify({ roundId, playerName, word }),
// // // // // // // // //   });

// // // // // // // // //   if (!response.ok) {
// // // // // // // // //     throw new Error(`Failed to submit word: ${response.status}`);
// // // // // // // // //   }

// // // // // // // // //   return response.json();
// // // // // // // // // }

// // // // // // // // // /* ============================================================
// // // // // // // // //    ROOM
// // // // // // // // // ============================================================ */

// // // // // // // // // export async function createRoom(payload: {
// // // // // // // // //   roomName?: string;
// // // // // // // // //   roomType?: string;
// // // // // // // // //   maxPlayers?: number;
// // // // // // // // //   playerName: string;
// // // // // // // // //   difficulty?: string;
// // // // // // // // // }): Promise<{ room: WordScrambleRoom }> {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/rooms`, {
// // // // // // // // //     method: "POST",
// // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // //     body: JSON.stringify(payload),
// // // // // // // // //   });
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to create room: ${res.status}`);
// // // // // // // // //   return res.json();
// // // // // // // // // }

// // // // // // // // // export async function joinRoom(
// // // // // // // // //   roomCode: string,
// // // // // // // // //   playerName: string
// // // // // // // // // ): Promise<{ room: WordScrambleRoom }> {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}/join`, {
// // // // // // // // //     method: "POST",
// // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // //     body: JSON.stringify({ playerName }),
// // // // // // // // //   });
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to join room: ${res.status}`);
// // // // // // // // //   return res.json();
// // // // // // // // // }

// // // // // // // // // export async function fetchRoom(roomCode: string): Promise<{ room: WordScrambleRoom }> {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}`);
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to fetch room: ${res.status}`);
// // // // // // // // //   return res.json();
// // // // // // // // // }

// // // // // // // // // export async function startGame(roomCode: string) {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}/start`, { method: "POST" });
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to start game: ${res.status}`);
// // // // // // // // //   return res.json();
// // // // // // // // // }

// // // // // // // // // export async function nextRound(roomCode: string) {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}/next-round`, { method: "POST" });
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to advance round: ${res.status}`);
// // // // // // // // //   return res.json();
// // // // // // // // // }

// // // // // // // // // export async function fetchFinalStandings(roomCode: string) {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}/final`);
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to fetch final standings: ${res.status}`);
// // // // // // // // //   return res.json();
// // // // // // // // // }

// // // // // // // // // export async function fetchLeaderboard() {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/leaderboard`);
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to fetch leaderboard: ${res.status}`);
// // // // // // // // //   return res.json();
// // // // // // // // // }

// // // // // // // // // /* ============================================================
// // // // // // // // //    ROUND RESULTS / ANSWERS
// // // // // // // // // ============================================================ */

// // // // // // // // // export async function fetchRoundResults(roundId: string): Promise<RoundResults> {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/rounds/${roundId}/results`);
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to fetch round results: ${res.status}`);
// // // // // // // // //   return res.json();
// // // // // // // // // }

// // // // // // // // // export async function submitAnswer(
// // // // // // // // //   roundId: string,
// // // // // // // // //   playerName: string,
// // // // // // // // //   answer: string,
// // // // // // // // //   timeTakenSec: number
// // // // // // // // // ) {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/rounds/${roundId}/answer`, {
// // // // // // // // //     method: "POST",
// // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // //     body: JSON.stringify({ playerName, answer, timeTakenSec }),
// // // // // // // // //   });
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to submit answer: ${res.status}`);
// // // // // // // // //   return res.json();
// // // // // // // // // }

// // // // // // // // // export async function retryRound(roundId: string, roomCode: string) {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/rounds/${roundId}/retry`, {
// // // // // // // // //     method: "POST",
// // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // //     body: JSON.stringify({ roomCode }),
// // // // // // // // //   });
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to retry round: ${res.status}`);
// // // // // // // // //   return res.json();
// // // // // // // // // }

// // // // // // // // // /* ============================================================
// // // // // // // // //    CHAT
// // // // // // // // // ============================================================ */

// // // // // // // // // export async function fetchMessages(roomCode: string): Promise<{ messages: ChatMessage[] }> {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}/messages`);
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
// // // // // // // // //   return res.json();
// // // // // // // // // }

// // // // // // // // // export async function sendMessage(roomCode: string, playerName: string, message: string) {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}/messages`, {
// // // // // // // // //     method: "POST",
// // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // //     body: JSON.stringify({ playerName, message }),
// // // // // // // // //   });
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);
// // // // // // // // //   return res.json();
// // // // // // // // // }

// // // // // // // // // /* ============================================================
// // // // // // // // //    CONFIG / WORD BANK
// // // // // // // // // ============================================================ */

// // // // // // // // // export async function fetchDifficultyConfig(difficulty: string) {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/config/${difficulty}`);
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to fetch config: ${res.status}`);
// // // // // // // // //   return res.json();
// // // // // // // // // }

// // // // // // // // // export async function updateRoomSettings(
// // // // // // // // //   roomCode: string,
// // // // // // // // //   playerName: string,
// // // // // // // // //   settings: { totalRounds: number; timePerRoundSec: number }
// // // // // // // // // ): Promise<WordScrambleRoom & { timePerRoundSec: number }> {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}/rooms/${roomCode}/settings`, {
// // // // // // // // //     method: "PATCH",
// // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // //     body: JSON.stringify({ playerName, ...settings }),
// // // // // // // // //   });
// // // // // // // // //   if (!res.ok) throw new Error(`Failed to update settings: ${res.status}`);
// // // // // // // // //   const data = await res.json();
// // // // // // // // //   return data.room;
// // // // // // // // // }
// // // // // // // // import { API_BASE_URL } from "./api";

// // // // // // // // /* ============================================================
// // // // // // // //    WORD SCRAMBLE API PREFIX
// // // // // // // // ============================================================ */

// // // // // // // // /*
// // // // // // // //  * Your backend Word Scramble router is mounted like:
// // // // // // // //  *
// // // // // // // //  * app.use("/api/wordscramble", wordScrambleRoutes)
// // // // // // // //  *
// // // // // // // //  * API_BASE_URL is already:
// // // // // // // //  *
// // // // // // // //  * http://localhost:4000/api
// // // // // // // //  *
// // // // // // // //  * Therefore every Word Scramble endpoint must use:
// // // // // // // //  *
// // // // // // // //  * http://localhost:4000/api/wordscramble/...
// // // // // // // //  */

// // // // // // // // const WS_API_URL = `${API_BASE_URL}/wordscramble`;

// // // // // // // // /* ============================================================
// // // // // // // //    TYPES
// // // // // // // // ============================================================ */

// // // // // // // // export interface WordSlot {
// // // // // // // //   id: string;
// // // // // // // //   length: number;
// // // // // // // // }

// // // // // // // // export interface FoundWord {
// // // // // // // //   id: string;
// // // // // // // //   word: string;
// // // // // // // //   foundBy: string;
// // // // // // // // }

// // // // // // // // export interface HuntRound {
// // // // // // // //   id: string;
// // // // // // // //   roundNumber: number;
// // // // // // // //   totalRounds: number;
// // // // // // // //   timeLimitSec: number;
// // // // // // // //   theme?: string;
// // // // // // // //   baseLetters: string[];
// // // // // // // //   wordSlots: WordSlot[];
// // // // // // // //   totalWords: number;
// // // // // // // //   foundWords: FoundWord[];
// // // // // // // // }

// // // // // // // // export interface Player {
// // // // // // // //   id?: number;
// // // // // // // //   player_name: string;
// // // // // // // //   is_ready?: boolean;
// // // // // // // //   is_host?: boolean;
// // // // // // // //   avatar_color?: string;
// // // // // // // //   score: number;
// // // // // // // // }

// // // // // // // // export interface WordScrambleRoom {
// // // // // // // //   id: number;
// // // // // // // //   roomCode: string;
// // // // // // // //   roomName: string;
// // // // // // // //   roomType: string;
// // // // // // // //   maxPlayers: number;
// // // // // // // //   minPlayers: number;
// // // // // // // //   difficulty: string;
// // // // // // // //   status: string;
// // // // // // // //   totalRounds: number;
// // // // // // // //   timeLimitSec: number;
// // // // // // // //   lives: number;
// // // // // // // //   players: Player[];
// // // // // // // // }

// // // // // // // // export interface ChatMessage {
// // // // // // // //   player_name: string;
// // // // // // // //   message: string;
// // // // // // // //   sent_at: string;
// // // // // // // // }

// // // // // // // // export interface RoundAnswer {
// // // // // // // //   player_name: string;
// // // // // // // //   answer: string;
// // // // // // // //   is_correct: boolean;
// // // // // // // //   time_taken_sec: number;
// // // // // // // //   points: number;
// // // // // // // // }

// // // // // // // // export interface RoundResults {
// // // // // // // //   word: string;
// // // // // // // //   roundNumber: number;
// // // // // // // //   totalRounds: number;
// // // // // // // //   answers: RoundAnswer[];
// // // // // // // //   standings: Player[];
// // // // // // // // }

// // // // // // // // /* ============================================================
// // // // // // // //    ROUND TYPE
// // // // // // // // ============================================================ */

// // // // // // // // export interface RoundInfo {
// // // // // // // //   id: string | number;

// // // // // // // //   roundNumber: number;

// // // // // // // //   totalRounds: number;

// // // // // // // //   timeLimitSec: number;

// // // // // // // //   word?: string;

// // // // // // // //   scrambledWord?: string;

// // // // // // // //   scrambled?: string;

// // // // // // // //   clue?: string;

// // // // // // // //   lives?: number;

// // // // // // // //   freeReveals?: number;

// // // // // // // //   [key: string]: any;
// // // // // // // // }

// // // // // // // // /* ============================================================
// // // // // // // //    GAME CONFIG
// // // // // // // // ============================================================ */

// // // // // // // // export interface GameConfig {
// // // // // // // //   totalRounds: number;
// // // // // // // //   timeLimitSec: number;
// // // // // // // //   lives: number;
// // // // // // // //   freeReveals?: number;
// // // // // // // // }

// // // // // // // // /* ============================================================
// // // // // // // //    HELPERS
// // // // // // // // ============================================================ */

// // // // // // // // async function getErrorMessage(
// // // // // // // //   response: Response,
// // // // // // // //   fallback: string
// // // // // // // // ): Promise<string> {
// // // // // // // //   try {
// // // // // // // //     const data = await response.json();

// // // // // // // //     return (
// // // // // // // //       data?.message ||
// // // // // // // //       data?.error ||
// // // // // // // //       fallback
// // // // // // // //     );
// // // // // // // //   } catch {
// // // // // // // //     return fallback;
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // /* ============================================================
// // // // // // // //    WORD HUNT
// // // // // // // // ============================================================ */

// // // // // // // // /**
// // // // // // // //  * GET
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/round/:roomCode
// // // // // // // //  */
// // // // // // // // export async function getWordHuntRound(
// // // // // // // //   roomCode: string
// // // // // // // // ): Promise<HuntRound> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/round/${encodeURIComponent(roomCode)}`
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to load round: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /**
// // // // // // // //  * POST
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/submit-word
// // // // // // // //  */
// // // // // // // // export async function submitWord(
// // // // // // // //   roundId: string,
// // // // // // // //   playerName: string,
// // // // // // // //   word: string
// // // // // // // // ): Promise<{
// // // // // // // //   isCorrect: boolean;
// // // // // // // //   wordsFound: number;
// // // // // // // //   totalWords: number;
// // // // // // // //   foundWords: FoundWord[];
// // // // // // // //   isRoundComplete?: boolean;
// // // // // // // // }> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/submit-word`,
// // // // // // // //     {
// // // // // // // //       method: "POST",

// // // // // // // //       headers: {
// // // // // // // //         "Content-Type": "application/json",
// // // // // // // //       },

// // // // // // // //       body: JSON.stringify({
// // // // // // // //         roundId,
// // // // // // // //         playerName,
// // // // // // // //         word,
// // // // // // // //       }),
// // // // // // // //     }
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to submit word: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /* ============================================================
// // // // // // // //    ROOM
// // // // // // // // ============================================================ */

// // // // // // // // /**
// // // // // // // //  * CREATE ROOM
// // // // // // // //  *
// // // // // // // //  * POST
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/rooms
// // // // // // // //  */
// // // // // // // // export async function createRoom(payload: {
// // // // // // // //   roomName?: string;
// // // // // // // //   roomType?: string;
// // // // // // // //   maxPlayers?: number;
// // // // // // // //   playerName: string;
// // // // // // // //   difficulty?: string;
// // // // // // // // }): Promise<{ room: WordScrambleRoom }> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/rooms`,
// // // // // // // //     {
// // // // // // // //       method: "POST",

// // // // // // // //       headers: {
// // // // // // // //         "Content-Type": "application/json",
// // // // // // // //       },

// // // // // // // //       body: JSON.stringify(payload),
// // // // // // // //     }
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to create room: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /**
// // // // // // // //  * JOIN ROOM
// // // // // // // //  *
// // // // // // // //  * POST
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/rooms/:roomCode/join
// // // // // // // //  */
// // // // // // // // export async function joinRoom(
// // // // // // // //   roomCode: string,
// // // // // // // //   playerName: string
// // // // // // // // ): Promise<{ room: WordScrambleRoom }> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/join`,
// // // // // // // //     {
// // // // // // // //       method: "POST",

// // // // // // // //       headers: {
// // // // // // // //         "Content-Type": "application/json",
// // // // // // // //       },

// // // // // // // //       body: JSON.stringify({
// // // // // // // //         playerName,
// // // // // // // //       }),
// // // // // // // //     }
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to join room: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /**
// // // // // // // //  * GET ROOM
// // // // // // // //  *
// // // // // // // //  * GET
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/rooms/:roomCode
// // // // // // // //  */
// // // // // // // // export async function fetchRoom(
// // // // // // // //   roomCode: string
// // // // // // // // ): Promise<{ room: WordScrambleRoom }> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}`
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to fetch room: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /**
// // // // // // // //  * START GAME
// // // // // // // //  *
// // // // // // // //  * POST
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/rooms/:roomCode/start
// // // // // // // //  */
// // // // // // // // export async function startGame(
// // // // // // // //   roomCode: string
// // // // // // // // ): Promise<any> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/start`,
// // // // // // // //     {
// // // // // // // //       method: "POST",
// // // // // // // //     }
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to start game: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /**
// // // // // // // //  * NEXT ROUND
// // // // // // // //  *
// // // // // // // //  * POST
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/rooms/:roomCode/next-round
// // // // // // // //  */
// // // // // // // // export async function nextRound(
// // // // // // // //   roomCode: string
// // // // // // // // ): Promise<any> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/next-round`,
// // // // // // // //     {
// // // // // // // //       method: "POST",
// // // // // // // //     }
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to advance round: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /**
// // // // // // // //  * FINAL STANDINGS
// // // // // // // //  *
// // // // // // // //  * GET
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/rooms/:roomCode/final
// // // // // // // //  */
// // // // // // // // export async function fetchFinalStandings(
// // // // // // // //   roomCode: string
// // // // // // // // ): Promise<any> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/final`
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to fetch final standings: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /* ============================================================
// // // // // // // //    LEADERBOARD
// // // // // // // // ============================================================ */

// // // // // // // // /**
// // // // // // // //  * GET
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/leaderboard
// // // // // // // //  */
// // // // // // // // export async function fetchLeaderboard(): Promise<any[]> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/leaderboard`
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to fetch leaderboard: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   const data = await response.json();

// // // // // // // //   /*
// // // // // // // //    * Backend may return:
// // // // // // // //    *
// // // // // // // //    * [...]
// // // // // // // //    *
// // // // // // // //    * OR
// // // // // // // //    *
// // // // // // // //    * { players: [...] }
// // // // // // // //    *
// // // // // // // //    * OR
// // // // // // // //    *
// // // // // // // //    * { leaderboard: [...] }
// // // // // // // //    */

// // // // // // // //   if (Array.isArray(data)) {
// // // // // // // //     return data;
// // // // // // // //   }

// // // // // // // //   if (Array.isArray(data?.players)) {
// // // // // // // //     return data.players;
// // // // // // // //   }

// // // // // // // //   if (Array.isArray(data?.leaderboard)) {
// // // // // // // //     return data.leaderboard;
// // // // // // // //   }

// // // // // // // //   return [];
// // // // // // // // }

// // // // // // // // /* ============================================================
// // // // // // // //    ROUND RESULTS
// // // // // // // // ============================================================ */

// // // // // // // // /**
// // // // // // // //  * GET
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/rounds/:roundId/results
// // // // // // // //  */
// // // // // // // // export async function fetchRoundResults(
// // // // // // // //   roundId: string
// // // // // // // // ): Promise<RoundResults> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/results`
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to fetch round results: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /* ============================================================
// // // // // // // //    SUBMIT ANSWER
// // // // // // // // ============================================================ */

// // // // // // // // /**
// // // // // // // //  * POST
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/rounds/:roundId/answer
// // // // // // // //  */
// // // // // // // // export async function submitAnswer(
// // // // // // // //   roundId: string,
// // // // // // // //   playerName: string,
// // // // // // // //   answer: string,
// // // // // // // //   timeTakenSec: number
// // // // // // // // ): Promise<any> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/answer`,
// // // // // // // //     {
// // // // // // // //       method: "POST",

// // // // // // // //       headers: {
// // // // // // // //         "Content-Type": "application/json",
// // // // // // // //       },

// // // // // // // //       body: JSON.stringify({
// // // // // // // //         playerName,
// // // // // // // //         answer,
// // // // // // // //         timeTakenSec,
// // // // // // // //       }),
// // // // // // // //     }
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to submit answer: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /* ============================================================
// // // // // // // //    RETRY ROUND
// // // // // // // // ============================================================ */

// // // // // // // // /**
// // // // // // // //  * POST
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/rounds/:roundId/retry
// // // // // // // //  */
// // // // // // // // export async function retryRound(
// // // // // // // //   roundId: string,
// // // // // // // //   roomCode: string
// // // // // // // // ): Promise<any> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/retry`,
// // // // // // // //     {
// // // // // // // //       method: "POST",

// // // // // // // //       headers: {
// // // // // // // //         "Content-Type": "application/json",
// // // // // // // //       },

// // // // // // // //       body: JSON.stringify({
// // // // // // // //         roomCode,
// // // // // // // //       }),
// // // // // // // //     }
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to retry round: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /* ============================================================
// // // // // // // //    CHAT
// // // // // // // // ============================================================ */

// // // // // // // // /**
// // // // // // // //  * GET
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/rooms/:roomCode/messages
// // // // // // // //  */
// // // // // // // // export async function fetchMessages(
// // // // // // // //   roomCode: string
// // // // // // // // ): Promise<{ messages: ChatMessage[] }> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/messages`
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to fetch messages: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /**
// // // // // // // //  * POST
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/rooms/:roomCode/messages
// // // // // // // //  */
// // // // // // // // export async function sendMessage(
// // // // // // // //   roomCode: string,
// // // // // // // //   playerName: string,
// // // // // // // //   message: string
// // // // // // // // ): Promise<any> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/messages`,
// // // // // // // //     {
// // // // // // // //       method: "POST",

// // // // // // // //       headers: {
// // // // // // // //         "Content-Type": "application/json",
// // // // // // // //       },

// // // // // // // //       body: JSON.stringify({
// // // // // // // //         playerName,
// // // // // // // //         message,
// // // // // // // //       }),
// // // // // // // //     }
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to send message: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /* ============================================================
// // // // // // // //    GAME CONFIG
// // // // // // // // ============================================================ */

// // // // // // // // /**
// // // // // // // //  * GET
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/config/:difficulty
// // // // // // // //  */
// // // // // // // // export async function fetchDifficultyConfig(
// // // // // // // //   difficulty: string
// // // // // // // // ): Promise<GameConfig> {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/config/${encodeURIComponent(difficulty)}`
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to fetch config: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // }

// // // // // // // // /*
// // // // // // // //  * App.tsx previously tried to import:
// // // // // // // //  *
// // // // // // // //  * fetchGameConfig()
// // // // // // // //  *
// // // // // // // //  * Keep this function so App.tsx can safely use it.
// // // // // // // //  *
// // // // // // // //  * If your backend has a general config endpoint:
// // // // // // // //  *
// // // // // // // //  * GET /api/wordscramble/config
// // // // // // // //  *
// // // // // // // //  * this will use it.
// // // // // // // //  *
// // // // // // // //  * If that endpoint doesn't exist, it falls back to the
// // // // // // // //  * normal easy configuration.
// // // // // // // //  */
// // // // // // // // export async function fetchGameConfig(): Promise<{
// // // // // // // //   totalRounds: number;
// // // // // // // //   timeLimitSec: number;
// // // // // // // // }> {
// // // // // // // //   try {
// // // // // // // //     const response = await fetch(
// // // // // // // //       `${WS_API_URL}/config`
// // // // // // // //     );

// // // // // // // //     if (response.ok) {
// // // // // // // //       const data = await response.json();

// // // // // // // //       return {
// // // // // // // //         totalRounds:
// // // // // // // //           Number(data?.totalRounds) || 10,

// // // // // // // //         timeLimitSec:
// // // // // // // //           Number(
// // // // // // // //             data?.timeLimitSec ??
// // // // // // // //               data?.timePerRoundSec
// // // // // // // //           ) || 10,
// // // // // // // //       };
// // // // // // // //     }
// // // // // // // //   } catch (error) {
// // // // // // // //     console.warn(
// // // // // // // //       "General game config endpoint unavailable:",
// // // // // // // //       error
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   /*
// // // // // // // //    * Safe fallback.
// // // // // // // //    *
// // // // // // // //    * Actual room configuration will still come
// // // // // // // //    * from the backend when the game starts.
// // // // // // // //    */
// // // // // // // //   return {
// // // // // // // //     totalRounds: 10,
// // // // // // // //     timeLimitSec: 10,
// // // // // // // //   };
// // // // // // // // }

// // // // // // // // /* ============================================================
// // // // // // // //    ROOM SETTINGS
// // // // // // // // ============================================================ */

// // // // // // // // /**
// // // // // // // //  * PATCH
// // // // // // // //  *
// // // // // // // //  * /api/wordscramble/rooms/:roomCode/settings
// // // // // // // //  */
// // // // // // // // export async function updateRoomSettings(
// // // // // // // //   roomCode: string,
// // // // // // // //   playerName: string,
// // // // // // // //   settings: {
// // // // // // // //     totalRounds: number;
// // // // // // // //     timePerRoundSec: number;
// // // // // // // //   }
// // // // // // // // ): Promise<
// // // // // // // //   WordScrambleRoom & {
// // // // // // // //     timePerRoundSec: number;
// // // // // // // //   }
// // // // // // // // > {
// // // // // // // //   const response = await fetch(
// // // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/settings`,
// // // // // // // //     {
// // // // // // // //       method: "PATCH",

// // // // // // // //       headers: {
// // // // // // // //         "Content-Type": "application/json",
// // // // // // // //       },

// // // // // // // //       body: JSON.stringify({
// // // // // // // //         playerName,
// // // // // // // //         ...settings,
// // // // // // // //       }),
// // // // // // // //     }
// // // // // // // //   );

// // // // // // // //   if (!response.ok) {
// // // // // // // //     throw new Error(
// // // // // // // //       await getErrorMessage(
// // // // // // // //         response,
// // // // // // // //         `Failed to update settings: ${response.status}`
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   const data = await response.json();

// // // // // // // //   return (
// // // // // // // //     data?.room ??
// // // // // // // //     data
// // // // // // // //   );
// // // // // // // // }
// // // // // // // const WS_API_URL = `${API_BASE_URL}/wordscramble`;

// // // // // // // /* ============================================================
// // // // // // //    TYPES
// // // // // // // ============================================================ */

// // // // // // // export interface WordSlot {
// // // // // // //   id: string;
// // // // // // //   length: number;
// // // // // // // }

// // // // // // // export interface FoundWord {
// // // // // // //   id: string;
// // // // // // //   word: string;
// // // // // // //   foundBy: string;
// // // // // // // }

// // // // // // // export interface HuntRound {
// // // // // // //   id: string;
// // // // // // //   roundNumber: number;
// // // // // // //   totalRounds: number;
// // // // // // //   timeLimitSec: number;
// // // // // // //   theme?: string;
// // // // // // //   baseLetters: string[];
// // // // // // //   wordSlots: WordSlot[];
// // // // // // //   totalWords: number;
// // // // // // //   foundWords: FoundWord[];
// // // // // // // }

// // // // // // // export interface Player {
// // // // // // //   id?: number;
// // // // // // //   player_name: string;
// // // // // // //   is_ready?: boolean;
// // // // // // //   is_host?: boolean;
// // // // // // //   avatar_color?: string;
// // // // // // //   score: number;
// // // // // // // }

// // // // // // // export interface WordScrambleRoom {
// // // // // // //   id: number;
// // // // // // //   roomCode: string;
// // // // // // //   roomName: string;
// // // // // // //   roomType: string;
// // // // // // //   maxPlayers: number;
// // // // // // //   minPlayers: number;
// // // // // // //   difficulty: string;
// // // // // // //   status: string;
// // // // // // //   totalRounds: number;
// // // // // // //   timeLimitSec: number;
// // // // // // //   lives: number;
// // // // // // //   players: Player[];
// // // // // // // }

// // // // // // // export interface ChatMessage {
// // // // // // //   player_name: string;
// // // // // // //   message: string;
// // // // // // //   sent_at: string;
// // // // // // // }

// // // // // // // export interface RoundAnswer {
// // // // // // //   player_name: string;
// // // // // // //   answer: string;
// // // // // // //   is_correct: boolean;
// // // // // // //   time_taken_sec: number;
// // // // // // //   points: number;
// // // // // // // }

// // // // // // // export interface RoundResults {
// // // // // // //   word: string;
// // // // // // //   roundNumber: number;
// // // // // // //   totalRounds: number;
// // // // // // //   answers: RoundAnswer[];
// // // // // // //   standings: Player[];
// // // // // // // }

// // // // // // // // A single grid cell revealed for free (or via a hint), keyed the same
// // // // // // // // way GamePlayScreen.tsx keys its revealedCells map: `${row}-${col}`.
// // // // // // // export interface RevealedCell {
// // // // // // //   row: number;
// // // // // // //   col: number;
// // // // // // //   letter?: string;
// // // // // // // }

// // // // // // // /* ============================================================
// // // // // // //    ROUND TYPE
// // // // // // // ============================================================ */

// // // // // // // export interface RoundInfo {
// // // // // // //   id: string | number;

// // // // // // //   roundNumber: number;

// // // // // // //   totalRounds: number;

// // // // // // //   timeLimitSec: number;

// // // // // // //   word?: string;

// // // // // // //   scrambledWord?: string;

// // // // // // //   scrambled?: string;

// // // // // // //   clue?: string;

// // // // // // //   lives?: number;

// // // // // // //   freeReveals?: number;

// // // // // // //   // Cells the backend picked as free starter reveals for this round
// // // // // // //   // (see pickInitialReveals in Wordscrambleroutes.js) — every player in
// // // // // // //   // the room gets the same ones, since the grid itself is shared.
// // // // // // //   revealedCells?: RevealedCell[];

// // // // // // //   [key: string]: any;
// // // // // // // }

// // // // // // // /* ============================================================
// // // // // // //    GAME CONFIG
// // // // // // // ============================================================ */

// // // // // // // export interface GameConfig {
// // // // // // //   totalRounds: number;
// // // // // // //   timeLimitSec: number;
// // // // // // //   lives: number;
// // // // // // //   freeReveals?: number;
// // // // // // // }

// // // // // // // /* ============================================================
// // // // // // //    HELPERS
// // // // // // // ============================================================ */

// // // // // // // async function getErrorMessage(
// // // // // // //   response: Response,
// // // // // // //   fallback: string
// // // // // // // ): Promise<string> {
// // // // // // //   try {
// // // // // // //     const data = await response.json();

// // // // // // //     return (
// // // // // // //       data?.message ||
// // // // // // //       data?.error ||
// // // // // // //       fallback
// // // // // // //     );
// // // // // // //   } catch {
// // // // // // //     return fallback;
// // // // // // //   }
// // // // // // // }

// // // // // // // /* ============================================================
// // // // // // //    WORD HUNT
// // // // // // // ============================================================ */

// // // // // // // /**
// // // // // // //  * GET
// // // // // // //  *
// // // // // // //  * /api/wordscramble/round/:roomCode
// // // // // // //  */
// // // // // // // export async function getWordHuntRound(
// // // // // // //   roomCode: string
// // // // // // // ): Promise<HuntRound> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/round/${encodeURIComponent(roomCode)}`
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to load round: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /**
// // // // // // //  * POST
// // // // // // //  *
// // // // // // //  * /api/wordscramble/submit-word
// // // // // // //  */
// // // // // // // export async function submitWord(
// // // // // // //   roundId: string,
// // // // // // //   playerName: string,
// // // // // // //   word: string
// // // // // // // ): Promise<{
// // // // // // //   isCorrect: boolean;
// // // // // // //   wordsFound: number;
// // // // // // //   totalWords: number;
// // // // // // //   foundWords: FoundWord[];
// // // // // // //   isRoundComplete?: boolean;
// // // // // // // }> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/submit-word`,
// // // // // // //     {
// // // // // // //       method: "POST",

// // // // // // //       headers: {
// // // // // // //         "Content-Type": "application/json",
// // // // // // //       },

// // // // // // //       body: JSON.stringify({
// // // // // // //         roundId,
// // // // // // //         playerName,
// // // // // // //         word,
// // // // // // //       }),
// // // // // // //     }
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to submit word: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /* ============================================================
// // // // // // //    ROOM
// // // // // // // ============================================================ */

// // // // // // // /**
// // // // // // //  * CREATE ROOM
// // // // // // //  *
// // // // // // //  * POST
// // // // // // //  *
// // // // // // //  * /api/wordscramble/rooms
// // // // // // //  */
// // // // // // // export async function createRoom(payload: {
// // // // // // //   roomName?: string;
// // // // // // //   roomType?: string;
// // // // // // //   maxPlayers?: number;
// // // // // // //   playerName: string;
// // // // // // //   difficulty?: string;
// // // // // // // }): Promise<{ room: WordScrambleRoom }> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/rooms`,
// // // // // // //     {
// // // // // // //       method: "POST",

// // // // // // //       headers: {
// // // // // // //         "Content-Type": "application/json",
// // // // // // //       },

// // // // // // //       body: JSON.stringify(payload),
// // // // // // //     }
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to create room: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /**
// // // // // // //  * JOIN ROOM
// // // // // // //  *
// // // // // // //  * POST
// // // // // // //  *
// // // // // // //  * /api/wordscramble/rooms/:roomCode/join
// // // // // // //  */
// // // // // // // export async function joinRoom(
// // // // // // //   roomCode: string,
// // // // // // //   playerName: string
// // // // // // // ): Promise<{ room: WordScrambleRoom }> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/join`,
// // // // // // //     {
// // // // // // //       method: "POST",

// // // // // // //       headers: {
// // // // // // //         "Content-Type": "application/json",
// // // // // // //       },

// // // // // // //       body: JSON.stringify({
// // // // // // //         playerName,
// // // // // // //       }),
// // // // // // //     }
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to join room: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /**
// // // // // // //  * GET ROOM
// // // // // // //  *
// // // // // // //  * GET
// // // // // // //  *
// // // // // // //  * /api/wordscramble/rooms/:roomCode
// // // // // // //  */
// // // // // // // export async function fetchRoom(
// // // // // // //   roomCode: string
// // // // // // // ): Promise<{ room: WordScrambleRoom }> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}`
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to fetch room: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /**
// // // // // // //  * START GAME
// // // // // // //  *
// // // // // // //  * POST
// // // // // // //  *
// // // // // // //  * /api/wordscramble/rooms/:roomCode/start
// // // // // // //  */
// // // // // // // export async function startGame(
// // // // // // //   roomCode: string
// // // // // // // ): Promise<any> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/start`,
// // // // // // //     {
// // // // // // //       method: "POST",
// // // // // // //     }
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to start game: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /**
// // // // // // //  * NEXT ROUND
// // // // // // //  *
// // // // // // //  * POST
// // // // // // //  *
// // // // // // //  * /api/wordscramble/rooms/:roomCode/next-round
// // // // // // //  */
// // // // // // // export async function nextRound(
// // // // // // //   roomCode: string
// // // // // // // ): Promise<any> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/next-round`,
// // // // // // //     {
// // // // // // //       method: "POST",
// // // // // // //     }
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to advance round: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /**
// // // // // // //  * FINAL STANDINGS
// // // // // // //  *
// // // // // // //  * GET
// // // // // // //  *
// // // // // // //  * /api/wordscramble/rooms/:roomCode/final
// // // // // // //  */
// // // // // // // export async function fetchFinalStandings(
// // // // // // //   roomCode: string
// // // // // // // ): Promise<any> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/final`
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to fetch final standings: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /* ============================================================
// // // // // // //    LEADERBOARD
// // // // // // // ============================================================ */

// // // // // // // /**
// // // // // // //  * GET
// // // // // // //  *
// // // // // // //  * /api/wordscramble/leaderboard
// // // // // // //  */
// // // // // // // export async function fetchLeaderboard(): Promise<any[]> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/leaderboard`
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to fetch leaderboard: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   const data = await response.json();

// // // // // // //   /*
// // // // // // //    * Backend may return:
// // // // // // //    *
// // // // // // //    * [...]
// // // // // // //    *
// // // // // // //    * OR
// // // // // // //    *
// // // // // // //    * { players: [...] }
// // // // // // //    *
// // // // // // //    * OR
// // // // // // //    *
// // // // // // //    * { leaderboard: [...] }
// // // // // // //    */

// // // // // // //   if (Array.isArray(data)) {
// // // // // // //     return data;
// // // // // // //   }

// // // // // // //   if (Array.isArray(data?.players)) {
// // // // // // //     return data.players;
// // // // // // //   }

// // // // // // //   if (Array.isArray(data?.leaderboard)) {
// // // // // // //     return data.leaderboard;
// // // // // // //   }

// // // // // // //   return [];
// // // // // // // }

// // // // // // // /* ============================================================
// // // // // // //    ROUND RESULTS
// // // // // // // ============================================================ */

// // // // // // // /**
// // // // // // //  * GET
// // // // // // //  *
// // // // // // //  * /api/wordscramble/rounds/:roundId/results
// // // // // // //  */
// // // // // // // export async function fetchRoundResults(
// // // // // // //   roundId: string
// // // // // // // ): Promise<RoundResults> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/results`
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to fetch round results: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /* ============================================================
// // // // // // //    SUBMIT ANSWER
// // // // // // // ============================================================ */

// // // // // // // /**
// // // // // // //  * POST
// // // // // // //  *
// // // // // // //  * /api/wordscramble/rounds/:roundId/answer
// // // // // // //  */
// // // // // // // export async function submitAnswer(
// // // // // // //   roundId: string,
// // // // // // //   playerName: string,
// // // // // // //   answer: string,
// // // // // // //   timeTakenSec: number
// // // // // // // ): Promise<any> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/answer`,
// // // // // // //     {
// // // // // // //       method: "POST",

// // // // // // //       headers: {
// // // // // // //         "Content-Type": "application/json",
// // // // // // //       },

// // // // // // //       body: JSON.stringify({
// // // // // // //         playerName,
// // // // // // //         answer,
// // // // // // //         timeTakenSec,
// // // // // // //       }),
// // // // // // //     }
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to submit answer: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /* ============================================================
// // // // // // //    HINT (reveal a letter)
// // // // // // // ============================================================ */

// // // // // // // /**
// // // // // // //  * POST
// // // // // // //  *
// // // // // // //  * /api/wordscramble/rounds/:roundId/hint
// // // // // // //  *
// // // // // // //  * Called by GamePlayScreen.tsx's revealRandomLetter() when the player
// // // // // // //  * taps the lightbulb on the progress bar. The backend picks which cell
// // // // // // //  * to reveal (so it can avoid cells already shown to anyone else in the
// // // // // // //  * room), persists it, enforces the per-player hint cap, and deducts the
// // // // // // //  * score penalty — this call is the source of truth, not the client.
// // // // // // //  */
// // // // // // // export async function useHint(
// // // // // // //   roundId: string,
// // // // // // //   playerName: string
// // // // // // // ): Promise<{
// // // // // // //   success: boolean;
// // // // // // //   revealed?: { row: number; col: number; letter: string };
// // // // // // //   scorePenalty?: number;
// // // // // // //   hintsLeft?: number;
// // // // // // //   exhausted?: boolean;
// // // // // // // }> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/hint`,
// // // // // // //     {
// // // // // // //       method: "POST",

// // // // // // //       headers: {
// // // // // // //         "Content-Type": "application/json",
// // // // // // //       },

// // // // // // //       body: JSON.stringify({
// // // // // // //         playerName,
// // // // // // //       }),
// // // // // // //     }
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to use hint: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /* ============================================================
// // // // // // //    RETRY ROUND
// // // // // // // ============================================================ */

// // // // // // // /**
// // // // // // //  * POST
// // // // // // //  *
// // // // // // //  * /api/wordscramble/rounds/:roundId/retry
// // // // // // //  */
// // // // // // // export async function retryRound(
// // // // // // //   roundId: string,
// // // // // // //   roomCode: string
// // // // // // // ): Promise<any> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/retry`,
// // // // // // //     {
// // // // // // //       method: "POST",

// // // // // // //       headers: {
// // // // // // //         "Content-Type": "application/json",
// // // // // // //       },

// // // // // // //       body: JSON.stringify({
// // // // // // //         roomCode,
// // // // // // //       }),
// // // // // // //     }
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to retry round: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /* ============================================================
// // // // // // //    CHAT
// // // // // // // ============================================================ */

// // // // // // // /**
// // // // // // //  * GET
// // // // // // //  *
// // // // // // //  * /api/wordscramble/rooms/:roomCode/messages
// // // // // // //  */
// // // // // // // export async function fetchMessages(
// // // // // // //   roomCode: string
// // // // // // // ): Promise<{ messages: ChatMessage[] }> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/messages`
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to fetch messages: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /**
// // // // // // //  * POST
// // // // // // //  *
// // // // // // //  * /api/wordscramble/rooms/:roomCode/messages
// // // // // // //  */
// // // // // // // export async function sendMessage(
// // // // // // //   roomCode: string,
// // // // // // //   playerName: string,
// // // // // // //   message: string
// // // // // // // ): Promise<any> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/messages`,
// // // // // // //     {
// // // // // // //       method: "POST",

// // // // // // //       headers: {
// // // // // // //         "Content-Type": "application/json",
// // // // // // //       },

// // // // // // //       body: JSON.stringify({
// // // // // // //         playerName,
// // // // // // //         message,
// // // // // // //       }),
// // // // // // //     }
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to send message: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /* ============================================================
// // // // // // //    GAME CONFIG
// // // // // // // ============================================================ */

// // // // // // // /**
// // // // // // //  * GET
// // // // // // //  *
// // // // // // //  * /api/wordscramble/config/:difficulty
// // // // // // //  */
// // // // // // // export async function fetchDifficultyConfig(
// // // // // // //   difficulty: string
// // // // // // // ): Promise<GameConfig> {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/config/${encodeURIComponent(difficulty)}`
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to fetch config: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // }

// // // // // // // /*
// // // // // // //  * App.tsx previously tried to import:
// // // // // // //  *
// // // // // // //  * fetchGameConfig()
// // // // // // //  *
// // // // // // //  * Keep this function so App.tsx can safely use it.
// // // // // // //  *
// // // // // // //  * If your backend has a general config endpoint:
// // // // // // //  *
// // // // // // //  * GET /api/wordscramble/config
// // // // // // //  *
// // // // // // //  * this will use it.
// // // // // // //  *
// // // // // // //  * If that endpoint doesn't exist, it falls back to the
// // // // // // //  * normal easy configuration.
// // // // // // //  */
// // // // // // // export async function fetchGameConfig(): Promise<{
// // // // // // //   totalRounds: number;
// // // // // // //   timeLimitSec: number;
// // // // // // // }> {
// // // // // // //   try {
// // // // // // //     const response = await fetch(
// // // // // // //       `${WS_API_URL}/config`
// // // // // // //     );

// // // // // // //     if (response.ok) {
// // // // // // //       const data = await response.json();

// // // // // // //       return {
// // // // // // //         totalRounds:
// // // // // // //           Number(data?.totalRounds) || 10,

// // // // // // //         timeLimitSec:
// // // // // // //           Number(
// // // // // // //             data?.timeLimitSec ??
// // // // // // //               data?.timePerRoundSec
// // // // // // //           ) || 10,
// // // // // // //       };
// // // // // // //     }
// // // // // // //   } catch (error) {
// // // // // // //     console.warn(
// // // // // // //       "General game config endpoint unavailable:",
// // // // // // //       error
// // // // // // //     );
// // // // // // //   }

// // // // // // //   /*
// // // // // // //    * Safe fallback.
// // // // // // //    *
// // // // // // //    * Actual room configuration will still come
// // // // // // //    * from the backend when the game starts.
// // // // // // //    */
// // // // // // //   return {
// // // // // // //     totalRounds: 10,
// // // // // // //     timeLimitSec: 10,
// // // // // // //   };
// // // // // // // }

// // // // // // // /* ============================================================
// // // // // // //    ROOM SETTINGS
// // // // // // // ============================================================ */

// // // // // // // /**
// // // // // // //  * PATCH
// // // // // // //  *
// // // // // // //  * /api/wordscramble/rooms/:roomCode/settings
// // // // // // //  */
// // // // // // // export async function updateRoomSettings(
// // // // // // //   roomCode: string,
// // // // // // //   playerName: string,
// // // // // // //   settings: {
// // // // // // //     totalRounds: number;
// // // // // // //     timePerRoundSec: number;
// // // // // // //   }
// // // // // // // ): Promise<
// // // // // // //   WordScrambleRoom & {
// // // // // // //     timePerRoundSec: number;
// // // // // // //   }
// // // // // // // > {
// // // // // // //   const response = await fetch(
// // // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/settings`,
// // // // // // //     {
// // // // // // //       method: "PATCH",

// // // // // // //       headers: {
// // // // // // //         "Content-Type": "application/json",
// // // // // // //       },

// // // // // // //       body: JSON.stringify({
// // // // // // //         playerName,
// // // // // // //         ...settings,
// // // // // // //       }),
// // // // // // //     }
// // // // // // //   );

// // // // // // //   if (!response.ok) {
// // // // // // //     throw new Error(
// // // // // // //       await getErrorMessage(
// // // // // // //         response,
// // // // // // //         `Failed to update settings: ${response.status}`
// // // // // // //       )
// // // // // // //     );
// // // // // // //   }

// // // // // // //   const data = await response.json();

// // // // // // //   return (
// // // // // // //     data?.room ??
// // // // // // //     data
// // // // // // //   );
// // // // // // // }
// // // // // // import { API_BASE_URL } from "./api"; // adjust path if API_BASE_URL actually lives elsewhere

// // // // // // const WS_API_URL = `${API_BASE_URL}/wordscramble`;

// // // // // // /* ============================================================
// // // // // //    TYPES
// // // // // // ============================================================ */

// // // // // // export interface WordSlot {
// // // // // //   id: string;
// // // // // //   length: number;
// // // // // // }

// // // // // // export interface FoundWord {
// // // // // //   id: string;
// // // // // //   word: string;
// // // // // //   foundBy: string;
// // // // // // }

// // // // // // export interface HuntRound {
// // // // // //   id: string;
// // // // // //   roundNumber: number;
// // // // // //   totalRounds: number;
// // // // // //   timeLimitSec: number;
// // // // // //   theme?: string;
// // // // // //   baseLetters: string[];
// // // // // //   wordSlots: WordSlot[];
// // // // // //   totalWords: number;
// // // // // //   foundWords: FoundWord[];
// // // // // // }

// // // // // // export interface Player {
// // // // // //   id?: number;
// // // // // //   player_name: string;
// // // // // //   is_ready?: boolean;
// // // // // //   is_host?: boolean;
// // // // // //   avatar_color?: string;
// // // // // //   score: number;
// // // // // // }

// // // // // // export interface WordScrambleRoom {
// // // // // //   id: number;
// // // // // //   roomCode: string;
// // // // // //   roomName: string;
// // // // // //   roomType: string;
// // // // // //   maxPlayers: number;
// // // // // //   minPlayers: number;
// // // // // //   difficulty: string;
// // // // // //   status: string;
// // // // // //   totalRounds: number;
// // // // // //   timeLimitSec: number;
// // // // // //   lives: number;
// // // // // //   players: Player[];
// // // // // // }

// // // // // // export interface ChatMessage {
// // // // // //   player_name: string;
// // // // // //   message: string;
// // // // // //   sent_at: string;
// // // // // // }

// // // // // // export interface RoundAnswer {
// // // // // //   player_name: string;
// // // // // //   answer: string;
// // // // // //   is_correct: boolean;
// // // // // //   time_taken_sec: number;
// // // // // //   points: number;
// // // // // // }

// // // // // // export interface RoundResults {
// // // // // //   word: string;
// // // // // //   roundNumber: number;
// // // // // //   totalRounds: number;
// // // // // //   answers: RoundAnswer[];
// // // // // //   standings: Player[];
// // // // // // }

// // // // // // // A single grid cell revealed for free (or via a hint), keyed the same
// // // // // // // way GamePlayScreen.tsx keys its revealedCells map: `${row}-${col}`.
// // // // // // export interface RevealedCell {
// // // // // //   row: number;
// // // // // //   col: number;
// // // // // //   letter?: string;
// // // // // // }

// // // // // // /* ============================================================
// // // // // //    ROUND TYPE
// // // // // // ============================================================ */

// // // // // // export interface RoundInfo {
// // // // // //   id: string | number;

// // // // // //   roundNumber: number;

// // // // // //   totalRounds: number;

// // // // // //   timeLimitSec: number;

// // // // // //   word?: string;

// // // // // //   scrambledWord?: string;

// // // // // //   scrambled?: string;

// // // // // //   clue?: string;

// // // // // //   lives?: number;

// // // // // //   freeReveals?: number;

// // // // // //   // Cells the backend picked as free starter reveals for this round
// // // // // //   // (see pickInitialReveals in Wordscrambleroutes.js) — every player in
// // // // // //   // the room gets the same ones, since the grid itself is shared.
// // // // // //   revealedCells?: RevealedCell[];

// // // // // //   [key: string]: any;
// // // // // // }

// // // // // // /* ============================================================
// // // // // //    GAME CONFIG
// // // // // // ============================================================ */

// // // // // // export interface GameConfig {
// // // // // //   totalRounds: number;
// // // // // //   timeLimitSec: number;
// // // // // //   lives: number;
// // // // // //   freeReveals?: number;
// // // // // // }

// // // // // // /* ============================================================
// // // // // //    HELPERS
// // // // // // ============================================================ */

// // // // // // async function getErrorMessage(
// // // // // //   response: Response,
// // // // // //   fallback: string
// // // // // // ): Promise<string> {
// // // // // //   try {
// // // // // //     const data = await response.json();

// // // // // //     return (
// // // // // //       data?.message ||
// // // // // //       data?.error ||
// // // // // //       fallback
// // // // // //     );
// // // // // //   } catch {
// // // // // //     return fallback;
// // // // // //   }
// // // // // // }

// // // // // // /* ============================================================
// // // // // //    WORD HUNT
// // // // // // ============================================================ */

// // // // // // /**
// // // // // //  * GET
// // // // // //  *
// // // // // //  * /api/wordscramble/round/:roomCode
// // // // // //  */
// // // // // // export async function getWordHuntRound(
// // // // // //   roomCode: string
// // // // // // ): Promise<HuntRound> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/round/${encodeURIComponent(roomCode)}`
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to load round: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /**
// // // // // //  * POST
// // // // // //  *
// // // // // //  * /api/wordscramble/submit-word
// // // // // //  */
// // // // // // export async function submitWord(
// // // // // //   roundId: string,
// // // // // //   playerName: string,
// // // // // //   word: string
// // // // // // ): Promise<{
// // // // // //   isCorrect: boolean;
// // // // // //   wordsFound: number;
// // // // // //   totalWords: number;
// // // // // //   foundWords: FoundWord[];
// // // // // //   isRoundComplete?: boolean;
// // // // // // }> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/submit-word`,
// // // // // //     {
// // // // // //       method: "POST",

// // // // // //       headers: {
// // // // // //         "Content-Type": "application/json",
// // // // // //       },

// // // // // //       body: JSON.stringify({
// // // // // //         roundId,
// // // // // //         playerName,
// // // // // //         word,
// // // // // //       }),
// // // // // //     }
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to submit word: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /* ============================================================
// // // // // //    ROOM
// // // // // // ============================================================ */

// // // // // // /**
// // // // // //  * CREATE ROOM
// // // // // //  *
// // // // // //  * POST
// // // // // //  *
// // // // // //  * /api/wordscramble/rooms
// // // // // //  */
// // // // // // export async function createRoom(payload: {
// // // // // //   roomName?: string;
// // // // // //   roomType?: string;
// // // // // //   maxPlayers?: number;
// // // // // //   playerName: string;
// // // // // //   difficulty?: string;
// // // // // // }): Promise<{ room: WordScrambleRoom }> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/rooms`,
// // // // // //     {
// // // // // //       method: "POST",

// // // // // //       headers: {
// // // // // //         "Content-Type": "application/json",
// // // // // //       },

// // // // // //       body: JSON.stringify(payload),
// // // // // //     }
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to create room: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /**
// // // // // //  * JOIN ROOM
// // // // // //  *
// // // // // //  * POST
// // // // // //  *
// // // // // //  * /api/wordscramble/rooms/:roomCode/join
// // // // // //  */
// // // // // // export async function joinRoom(
// // // // // //   roomCode: string,
// // // // // //   playerName: string
// // // // // // ): Promise<{ room: WordScrambleRoom }> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/join`,
// // // // // //     {
// // // // // //       method: "POST",

// // // // // //       headers: {
// // // // // //         "Content-Type": "application/json",
// // // // // //       },

// // // // // //       body: JSON.stringify({
// // // // // //         playerName,
// // // // // //       }),
// // // // // //     }
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to join room: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /**
// // // // // //  * GET ROOM
// // // // // //  *
// // // // // //  * GET
// // // // // //  *
// // // // // //  * /api/wordscramble/rooms/:roomCode
// // // // // //  */
// // // // // // export async function fetchRoom(
// // // // // //   roomCode: string
// // // // // // ): Promise<{ room: WordScrambleRoom }> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}`
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to fetch room: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /**
// // // // // //  * START GAME
// // // // // //  *
// // // // // //  * POST
// // // // // //  *
// // // // // //  * /api/wordscramble/rooms/:roomCode/start
// // // // // //  */
// // // // // // export async function startGame(
// // // // // //   roomCode: string
// // // // // // ): Promise<any> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/start`,
// // // // // //     {
// // // // // //       method: "POST",
// // // // // //     }
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to start game: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /**
// // // // // //  * NEXT ROUND
// // // // // //  *
// // // // // //  * POST
// // // // // //  *
// // // // // //  * /api/wordscramble/rooms/:roomCode/next-round
// // // // // //  */
// // // // // // export async function nextRound(
// // // // // //   roomCode: string
// // // // // // ): Promise<any> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/next-round`,
// // // // // //     {
// // // // // //       method: "POST",
// // // // // //     }
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to advance round: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /**
// // // // // //  * FINAL STANDINGS
// // // // // //  *
// // // // // //  * GET
// // // // // //  *
// // // // // //  * /api/wordscramble/rooms/:roomCode/final
// // // // // //  */
// // // // // // export async function fetchFinalStandings(
// // // // // //   roomCode: string
// // // // // // ): Promise<any> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/final`
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to fetch final standings: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /* ============================================================
// // // // // //    LEADERBOARD
// // // // // // ============================================================ */

// // // // // // /**
// // // // // //  * GET
// // // // // //  *
// // // // // //  * /api/wordscramble/leaderboard
// // // // // //  */
// // // // // // export async function fetchLeaderboard(): Promise<any[]> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/leaderboard`
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to fetch leaderboard: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   const data = await response.json();

// // // // // //   /*
// // // // // //    * Backend may return:
// // // // // //    *
// // // // // //    * [...]
// // // // // //    *
// // // // // //    * OR
// // // // // //    *
// // // // // //    * { players: [...] }
// // // // // //    *
// // // // // //    * OR
// // // // // //    *
// // // // // //    * { leaderboard: [...] }
// // // // // //    */

// // // // // //   if (Array.isArray(data)) {
// // // // // //     return data;
// // // // // //   }

// // // // // //   if (Array.isArray(data?.players)) {
// // // // // //     return data.players;
// // // // // //   }

// // // // // //   if (Array.isArray(data?.leaderboard)) {
// // // // // //     return data.leaderboard;
// // // // // //   }

// // // // // //   return [];
// // // // // // }

// // // // // // /* ============================================================
// // // // // //    ROUND RESULTS
// // // // // // ============================================================ */

// // // // // // /**
// // // // // //  * GET
// // // // // //  *
// // // // // //  * /api/wordscramble/rounds/:roundId/results
// // // // // //  */
// // // // // // export async function fetchRoundResults(
// // // // // //   roundId: string
// // // // // // ): Promise<RoundResults> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/results`
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to fetch round results: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /* ============================================================
// // // // // //    SUBMIT ANSWER
// // // // // // ============================================================ */

// // // // // // /**
// // // // // //  * POST
// // // // // //  *
// // // // // //  * /api/wordscramble/rounds/:roundId/answer
// // // // // //  */
// // // // // // export async function submitAnswer(
// // // // // //   roundId: string,
// // // // // //   playerName: string,
// // // // // //   answer: string,
// // // // // //   timeTakenSec: number
// // // // // // ): Promise<any> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/answer`,
// // // // // //     {
// // // // // //       method: "POST",

// // // // // //       headers: {
// // // // // //         "Content-Type": "application/json",
// // // // // //       },

// // // // // //       body: JSON.stringify({
// // // // // //         playerName,
// // // // // //         answer,
// // // // // //         timeTakenSec,
// // // // // //       }),
// // // // // //     }
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to submit answer: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /* ============================================================
// // // // // //    HINT (reveal a letter)
// // // // // // ============================================================ */

// // // // // // /**
// // // // // //  * POST
// // // // // //  *
// // // // // //  * /api/wordscramble/rounds/:roundId/hint
// // // // // //  *
// // // // // //  * Called by GamePlayScreen.tsx's revealRandomLetter() when the player
// // // // // //  * taps the lightbulb on the progress bar. The backend picks which cell
// // // // // //  * to reveal (so it can avoid cells already shown to anyone else in the
// // // // // //  * room), persists it, enforces the per-player hint cap, and deducts the
// // // // // //  * score penalty — this call is the source of truth, not the client.
// // // // // //  */
// // // // // // export async function useHint(
// // // // // //   roundId: string,
// // // // // //   playerName: string
// // // // // // ): Promise<{
// // // // // //   success: boolean;
// // // // // //   revealed?: { row: number; col: number; letter: string };
// // // // // //   scorePenalty?: number;
// // // // // //   hintsLeft?: number;
// // // // // //   exhausted?: boolean;
// // // // // // }> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/hint`,
// // // // // //     {
// // // // // //       method: "POST",

// // // // // //       headers: {
// // // // // //         "Content-Type": "application/json",
// // // // // //       },

// // // // // //       body: JSON.stringify({
// // // // // //         playerName,
// // // // // //       }),
// // // // // //     }
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to use hint: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /* ============================================================
// // // // // //    RETRY ROUND
// // // // // // ============================================================ */

// // // // // // /**
// // // // // //  * POST
// // // // // //  *
// // // // // //  * /api/wordscramble/rounds/:roundId/retry
// // // // // //  */
// // // // // // export async function retryRound(
// // // // // //   roundId: string,
// // // // // //   roomCode: string
// // // // // // ): Promise<any> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/retry`,
// // // // // //     {
// // // // // //       method: "POST",

// // // // // //       headers: {
// // // // // //         "Content-Type": "application/json",
// // // // // //       },

// // // // // //       body: JSON.stringify({
// // // // // //         roomCode,
// // // // // //       }),
// // // // // //     }
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to retry round: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /* ============================================================
// // // // // //    CHAT
// // // // // // ============================================================ */

// // // // // // /**
// // // // // //  * GET
// // // // // //  *
// // // // // //  * /api/wordscramble/rooms/:roomCode/messages
// // // // // //  */
// // // // // // export async function fetchMessages(
// // // // // //   roomCode: string
// // // // // // ): Promise<{ messages: ChatMessage[] }> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/messages`
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to fetch messages: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /**
// // // // // //  * POST
// // // // // //  *
// // // // // //  * /api/wordscramble/rooms/:roomCode/messages
// // // // // //  */
// // // // // // export async function sendMessage(
// // // // // //   roomCode: string,
// // // // // //   playerName: string,
// // // // // //   message: string
// // // // // // ): Promise<any> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/messages`,
// // // // // //     {
// // // // // //       method: "POST",

// // // // // //       headers: {
// // // // // //         "Content-Type": "application/json",
// // // // // //       },

// // // // // //       body: JSON.stringify({
// // // // // //         playerName,
// // // // // //         message,
// // // // // //       }),
// // // // // //     }
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to send message: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /* ============================================================
// // // // // //    GAME CONFIG
// // // // // // ============================================================ */

// // // // // // /**
// // // // // //  * GET
// // // // // //  *
// // // // // //  * /api/wordscramble/config/:difficulty
// // // // // //  */
// // // // // // export async function fetchDifficultyConfig(
// // // // // //   difficulty: string
// // // // // // ): Promise<GameConfig> {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/config/${encodeURIComponent(difficulty)}`
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to fetch config: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   return response.json();
// // // // // // }

// // // // // // /*
// // // // // //  * App.tsx previously tried to import:
// // // // // //  *
// // // // // //  * fetchGameConfig()
// // // // // //  *
// // // // // //  * Keep this function so App.tsx can safely use it.
// // // // // //  *
// // // // // //  * If your backend has a general config endpoint:
// // // // // //  *
// // // // // //  * GET /api/wordscramble/config
// // // // // //  *
// // // // // //  * this will use it.
// // // // // //  *
// // // // // //  * If that endpoint doesn't exist, it falls back to the
// // // // // //  * normal easy configuration.
// // // // // //  */
// // // // // // export async function fetchGameConfig(): Promise<{
// // // // // //   totalRounds: number;
// // // // // //   timeLimitSec: number;
// // // // // // }> {
// // // // // //   try {
// // // // // //     const response = await fetch(
// // // // // //       `${WS_API_URL}/config`
// // // // // //     );

// // // // // //     if (response.ok) {
// // // // // //       const data = await response.json();

// // // // // //       return {
// // // // // //         totalRounds:
// // // // // //           Number(data?.totalRounds) || 10,

// // // // // //         timeLimitSec:
// // // // // //           Number(
// // // // // //             data?.timeLimitSec ??
// // // // // //               data?.timePerRoundSec
// // // // // //           ) || 10,
// // // // // //       };
// // // // // //     }
// // // // // //   } catch (error) {
// // // // // //     console.warn(
// // // // // //       "General game config endpoint unavailable:",
// // // // // //       error
// // // // // //     );
// // // // // //   }

// // // // // //   /*
// // // // // //    * Safe fallback.
// // // // // //    *
// // // // // //    * Actual room configuration will still come
// // // // // //    * from the backend when the game starts.
// // // // // //    */
// // // // // //   return {
// // // // // //     totalRounds: 10,
// // // // // //     timeLimitSec: 10,
// // // // // //   };
// // // // // // }

// // // // // // /* ============================================================
// // // // // //    ROOM SETTINGS
// // // // // // ============================================================ */

// // // // // // /**
// // // // // //  * PATCH
// // // // // //  *
// // // // // //  * /api/wordscramble/rooms/:roomCode/settings
// // // // // //  */
// // // // // // export async function updateRoomSettings(
// // // // // //   roomCode: string,
// // // // // //   playerName: string,
// // // // // //   settings: {
// // // // // //     totalRounds: number;
// // // // // //     timePerRoundSec: number;
// // // // // //   }
// // // // // // ): Promise<
// // // // // //   WordScrambleRoom & {
// // // // // //     timePerRoundSec: number;
// // // // // //   }
// // // // // // > {
// // // // // //   const response = await fetch(
// // // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/settings`,
// // // // // //     {
// // // // // //       method: "PATCH",

// // // // // //       headers: {
// // // // // //         "Content-Type": "application/json",
// // // // // //       },

// // // // // //       body: JSON.stringify({
// // // // // //         playerName,
// // // // // //         ...settings,
// // // // // //       }),
// // // // // //     }
// // // // // //   );

// // // // // //   if (!response.ok) {
// // // // // //     throw new Error(
// // // // // //       await getErrorMessage(
// // // // // //         response,
// // // // // //         `Failed to update settings: ${response.status}`
// // // // // //       )
// // // // // //     );
// // // // // //   }

// // // // // //   const data = await response.json();

// // // // // //   return (
// // // // // //     data?.room ??
// // // // // //     data
// // // // // //   );
// // // // // // }
// // // // // import { API_BASE_URL } from "./api"; // adjust path if API_BASE_URL actually lives elsewhere

// // // // // const WS_API_URL = `${API_BASE_URL}/wordscramble`;


// // // // // export interface WordSlot {
// // // // //   id: string;
// // // // //   length: number;
// // // // // }

// // // // // export interface FoundWord {
// // // // //   id: string;
// // // // //   word: string;
// // // // //   foundBy: string;
// // // // // }

// // // // // export interface HuntRound {
// // // // //   id: string;
// // // // //   roundNumber: number;
// // // // //   totalRounds: number;
// // // // //   timeLimitSec: number;
// // // // //   theme?: string;
// // // // //   baseLetters: string[];
// // // // //   wordSlots: WordSlot[];
// // // // //   totalWords: number;
// // // // //   foundWords: FoundWord[];
// // // // // }

// // // // // export interface Player {
// // // // //   id?: number;
// // // // //   player_name: string;
// // // // //   is_ready?: boolean;
// // // // //   is_host?: boolean;
// // // // //   avatar_color?: string;
// // // // //   score: number;
// // // // // }

// // // // // export interface WordScrambleRoom {
// // // // //   id: number;
// // // // //   roomCode: string;
// // // // //   roomName: string;
// // // // //   roomType: string;
// // // // //   maxPlayers: number;
// // // // //   minPlayers: number;
// // // // //   difficulty: string;
// // // // //   status: string;
// // // // //   totalRounds: number;
// // // // //   timeLimitSec: number;
// // // // //   lives: number;
// // // // //   players: Player[];
// // // // // }

// // // // // export interface ChatMessage {
// // // // //   player_name: string;
// // // // //   message: string;
// // // // //   sent_at: string;
// // // // // }

// // // // // export interface RoundAnswer {
// // // // //   player_name: string;
// // // // //   answer: string;
// // // // //   is_correct: boolean;
// // // // //   time_taken_sec: number;
// // // // //   points: number;
// // // // // }

// // // // // export interface RoundResults {
// // // // //   word: string;
// // // // //   roundNumber: number;
// // // // //   totalRounds: number;
// // // // //   answers: RoundAnswer[];
// // // // //   standings: Player[];
// // // // // }

// // // // // // A single grid cell revealed for free (or via a hint), keyed the same
// // // // // // way GamePlayScreen.tsx keys its revealedCells map: `${row}-${col}`.
// // // // // export interface RevealedCell {
// // // // //   row: number;
// // // // //   col: number;
// // // // //   letter?: string;
// // // // // }

// // // // // /* ============================================================
// // // // //    ROUND TYPE
// // // // // ============================================================ */

// // // // // export interface RoundInfo {
// // // // //   id: string | number;

// // // // //   roundNumber: number;

// // // // //   totalRounds: number;

// // // // //   timeLimitSec: number;

// // // // //   word?: string;

// // // // //   scrambledWord?: string;

// // // // //   scrambled?: string;

// // // // //   clue?: string;

// // // // //   lives?: number;

// // // // //   freeReveals?: number;

// // // // //   // Cells the backend picked as free starter reveals for this round
// // // // //   // (see pickInitialReveals in Wordscrambleroutes.js) — every player in
// // // // //   // the room gets the same ones, since the grid itself is shared.
// // // // //   revealedCells?: RevealedCell[];

// // // // //   [key: string]: any;
// // // // // }

// // // // // /* ============================================================
// // // // //    GAME CONFIG
// // // // // ============================================================ */

// // // // // export interface GameConfig {
// // // // //   totalRounds: number;
// // // // //   timeLimitSec: number;
// // // // //   lives: number;
// // // // //   freeReveals?: number;
// // // // // }

// // // // // /* ============================================================
// // // // //    ROUND STATE (multiplayer polling)
// // // // // ============================================================ */

// // // // // // Polled every few seconds by GamePlayScreen.tsx so one player finding a
// // // // // // word, or using a hint, shows up on every OTHER player's screen without
// // // // // // needing sockets. See GET /rounds/:roundId/state in Wordscrambleroutes.js.
// // // // // export interface RoundStateResult {
// // // // //   success: boolean;
// // // // //   roundId: number;
// // // // //   foundWords: { word: string; foundBy: string }[];
// // // // //   revealedCells: { row: number; col: number }[];
// // // // //   totalWords: number;
// // // // //   isRoundComplete: boolean;
// // // // //   players: { player_name: string; score: number }[];
// // // // //   livesLeft: number | null;
// // // // //   hintsLeftForPlayer: number | null;
// // // // // }

// // // // // /* ============================================================
// // // // //    HELPERS
// // // // // ============================================================ */

// // // // // async function getErrorMessage(
// // // // //   response: Response,
// // // // //   fallback: string
// // // // // ): Promise<string> {
// // // // //   try {
// // // // //     const data = await response.json();

// // // // //     return (
// // // // //       data?.message ||
// // // // //       data?.error ||
// // // // //       fallback
// // // // //     );
// // // // //   } catch {
// // // // //     return fallback;
// // // // //   }
// // // // // }

// // // // // /* ============================================================
// // // // //    WORD HUNT
// // // // // ============================================================ */

// // // // // /**
// // // // //  * GET
// // // // //  *
// // // // //  * /api/wordscramble/round/:roomCode
// // // // //  */
// // // // // export async function getWordHuntRound(
// // // // //   roomCode: string
// // // // // ): Promise<HuntRound> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/round/${encodeURIComponent(roomCode)}`
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to load round: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /**
// // // // //  * POST
// // // // //  *
// // // // //  * /api/wordscramble/submit-word
// // // // //  */
// // // // // export async function submitWord(
// // // // //   roundId: string,
// // // // //   playerName: string,
// // // // //   word: string
// // // // // ): Promise<{
// // // // //   isCorrect: boolean;
// // // // //   wordsFound: number;
// // // // //   totalWords: number;
// // // // //   foundWords: FoundWord[];
// // // // //   isRoundComplete?: boolean;
// // // // // }> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/submit-word`,
// // // // //     {
// // // // //       method: "POST",

// // // // //       headers: {
// // // // //         "Content-Type": "application/json",
// // // // //       },

// // // // //       body: JSON.stringify({
// // // // //         roundId,
// // // // //         playerName,
// // // // //         word,
// // // // //       }),
// // // // //     }
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to submit word: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /* ============================================================
// // // // //    ROOM
// // // // // ============================================================ */

// // // // // /**
// // // // //  * CREATE ROOM
// // // // //  *
// // // // //  * POST
// // // // //  *
// // // // //  * /api/wordscramble/rooms
// // // // //  */
// // // // // export async function createRoom(payload: {
// // // // //   roomName?: string;
// // // // //   roomType?: string;
// // // // //   maxPlayers?: number;
// // // // //   playerName: string;
// // // // //   difficulty?: string;
// // // // // }): Promise<{ room: WordScrambleRoom }> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rooms`,
// // // // //     {
// // // // //       method: "POST",

// // // // //       headers: {
// // // // //         "Content-Type": "application/json",
// // // // //       },

// // // // //       body: JSON.stringify(payload),
// // // // //     }
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to create room: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /**
// // // // //  * JOIN ROOM
// // // // //  *
// // // // //  * POST
// // // // //  *
// // // // //  * /api/wordscramble/rooms/:roomCode/join
// // // // //  */
// // // // // export async function joinRoom(
// // // // //   roomCode: string,
// // // // //   playerName: string
// // // // // ): Promise<{ room: WordScrambleRoom }> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/join`,
// // // // //     {
// // // // //       method: "POST",

// // // // //       headers: {
// // // // //         "Content-Type": "application/json",
// // // // //       },

// // // // //       body: JSON.stringify({
// // // // //         playerName,
// // // // //       }),
// // // // //     }
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to join room: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /**
// // // // //  * GET ROOM
// // // // //  *
// // // // //  * GET
// // // // //  *
// // // // //  * /api/wordscramble/rooms/:roomCode
// // // // //  */
// // // // // export async function fetchRoom(
// // // // //   roomCode: string
// // // // // ): Promise<{ room: WordScrambleRoom }> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}`
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to fetch room: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /**
// // // // //  * START GAME
// // // // //  *
// // // // //  * POST
// // // // //  *
// // // // //  * /api/wordscramble/rooms/:roomCode/start
// // // // //  */
// // // // // export async function startGame(
// // // // //   roomCode: string
// // // // // ): Promise<any> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/start`,
// // // // //     {
// // // // //       method: "POST",
// // // // //     }
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to start game: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /**
// // // // //  * NEXT ROUND
// // // // //  *
// // // // //  * POST
// // // // //  *
// // // // //  * /api/wordscramble/rooms/:roomCode/next-round
// // // // //  */
// // // // // export async function nextRound(
// // // // //   roomCode: string
// // // // // ): Promise<any> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/next-round`,
// // // // //     {
// // // // //       method: "POST",
// // // // //     }
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to advance round: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /**
// // // // //  * FINAL STANDINGS
// // // // //  *
// // // // //  * GET
// // // // //  *
// // // // //  * /api/wordscramble/rooms/:roomCode/final
// // // // //  */
// // // // // export async function fetchFinalStandings(
// // // // //   roomCode: string
// // // // // ): Promise<any> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/final`
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to fetch final standings: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /* ============================================================
// // // // //    LEADERBOARD
// // // // // ============================================================ */

// // // // // /**
// // // // //  * GET
// // // // //  *
// // // // //  * /api/wordscramble/leaderboard
// // // // //  */
// // // // // export async function fetchLeaderboard(): Promise<any[]> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/leaderboard`
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to fetch leaderboard: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   const data = await response.json();

// // // // //   /*
// // // // //    * Backend may return:
// // // // //    *
// // // // //    * [...]
// // // // //    *
// // // // //    * OR
// // // // //    *
// // // // //    * { players: [...] }
// // // // //    *
// // // // //    * OR
// // // // //    *
// // // // //    * { leaderboard: [...] }
// // // // //    */

// // // // //   if (Array.isArray(data)) {
// // // // //     return data;
// // // // //   }

// // // // //   if (Array.isArray(data?.players)) {
// // // // //     return data.players;
// // // // //   }

// // // // //   if (Array.isArray(data?.leaderboard)) {
// // // // //     return data.leaderboard;
// // // // //   }

// // // // //   return [];
// // // // // }

// // // // // /* ============================================================
// // // // //    ROUND RESULTS
// // // // // ============================================================ */

// // // // // /**
// // // // //  * GET
// // // // //  *
// // // // //  * /api/wordscramble/rounds/:roundId/results
// // // // //  */
// // // // // export async function fetchRoundResults(
// // // // //   roundId: string
// // // // // ): Promise<RoundResults> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/results`
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to fetch round results: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /* ============================================================
// // // // //    SUBMIT ANSWER
// // // // // ============================================================ */

// // // // // /**
// // // // //  * POST
// // // // //  *
// // // // //  * /api/wordscramble/rounds/:roundId/answer
// // // // //  */
// // // // // export async function submitAnswer(
// // // // //   roundId: string,
// // // // //   playerName: string,
// // // // //   answer: string,
// // // // //   timeTakenSec: number
// // // // // ): Promise<any> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/answer`,
// // // // //     {
// // // // //       method: "POST",

// // // // //       headers: {
// // // // //         "Content-Type": "application/json",
// // // // //       },

// // // // //       body: JSON.stringify({
// // // // //         playerName,
// // // // //         answer,
// // // // //         timeTakenSec,
// // // // //       }),
// // // // //     }
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to submit answer: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /* ============================================================
// // // // //    ROUND STATE (poll — multiplayer sync without sockets)
// // // // // ============================================================ */

// // // // // /**
// // // // //  * GET
// // // // //  *
// // // // //  * /api/wordscramble/rounds/:roundId/state?playerName=X
// // // // //  *
// // // // //  * Called on an interval by GamePlayScreen.tsx. Returns the shared truth
// // // // //  * for the round right now: every word ANY player has found so far, every
// // // // //  * cell revealed so far (starter reveals + anyone's hints), the live
// // // // //  * scoreboard, and this caller's own lives/hints-left. This is what makes
// // // // //  * one player's find show up on every other player's screen.
// // // // //  */
// // // // // export async function getRoundState(
// // // // //   roundId: string,
// // // // //   playerName: string
// // // // // ): Promise<RoundStateResult> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/state?playerName=${encodeURIComponent(playerName)}`
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to fetch round state: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /* ============================================================
// // // // //    HINT (reveal a letter)
// // // // // ============================================================ */

// // // // // /**
// // // // //  * POST
// // // // //  *
// // // // //  * /api/wordscramble/rounds/:roundId/hint
// // // // //  *
// // // // //  * Called by GamePlayScreen.tsx's revealRandomLetter() when the player
// // // // //  * taps the lightbulb on the progress bar. The backend picks which cell
// // // // //  * to reveal (so it can avoid cells already shown to anyone else in the
// // // // //  * room), persists it, enforces the per-player hint cap, and deducts the
// // // // //  * score penalty — this call is the source of truth, not the client.
// // // // //  */
// // // // // export async function useHint(
// // // // //   roundId: string,
// // // // //   playerName: string
// // // // // ): Promise<{
// // // // //   success: boolean;
// // // // //   revealed?: { row: number; col: number; letter: string };
// // // // //   scorePenalty?: number;
// // // // //   hintsLeft?: number;
// // // // //   exhausted?: boolean;
// // // // // }> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/hint`,
// // // // //     {
// // // // //       method: "POST",

// // // // //       headers: {
// // // // //         "Content-Type": "application/json",
// // // // //       },

// // // // //       body: JSON.stringify({
// // // // //         playerName,
// // // // //       }),
// // // // //     }
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to use hint: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /* ============================================================
// // // // //    RETRY ROUND
// // // // // ============================================================ */

// // // // // /**
// // // // //  * POST
// // // // //  *
// // // // //  * /api/wordscramble/rounds/:roundId/retry
// // // // //  */
// // // // // export async function retryRound(
// // // // //   roundId: string,
// // // // //   roomCode: string
// // // // // ): Promise<any> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/retry`,
// // // // //     {
// // // // //       method: "POST",

// // // // //       headers: {
// // // // //         "Content-Type": "application/json",
// // // // //       },

// // // // //       body: JSON.stringify({
// // // // //         roomCode,
// // // // //       }),
// // // // //     }
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to retry round: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /* ============================================================
// // // // //    CHAT
// // // // // ============================================================ */

// // // // // /**
// // // // //  * GET
// // // // //  *
// // // // //  * /api/wordscramble/rooms/:roomCode/messages
// // // // //  */
// // // // // export async function fetchMessages(
// // // // //   roomCode: string
// // // // // ): Promise<{ messages: ChatMessage[] }> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/messages`
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to fetch messages: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /**
// // // // //  * POST
// // // // //  *
// // // // //  * /api/wordscramble/rooms/:roomCode/messages
// // // // //  */
// // // // // export async function sendMessage(
// // // // //   roomCode: string,
// // // // //   playerName: string,
// // // // //   message: string
// // // // // ): Promise<any> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/messages`,
// // // // //     {
// // // // //       method: "POST",

// // // // //       headers: {
// // // // //         "Content-Type": "application/json",
// // // // //       },

// // // // //       body: JSON.stringify({
// // // // //         playerName,
// // // // //         message,
// // // // //       }),
// // // // //     }
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to send message: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /* ============================================================
// // // // //    GAME CONFIG
// // // // // ============================================================ */

// // // // // /**
// // // // //  * GET
// // // // //  *
// // // // //  * /api/wordscramble/config/:difficulty
// // // // //  */
// // // // // export async function fetchDifficultyConfig(
// // // // //   difficulty: string
// // // // // ): Promise<GameConfig> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/config/${encodeURIComponent(difficulty)}`
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to fetch config: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }

// // // // // /*
// // // // //  * App.tsx previously tried to import:
// // // // //  *
// // // // //  * fetchGameConfig()
// // // // //  *
// // // // //  * Keep this function so App.tsx can safely use it.
// // // // //  *
// // // // //  * If your backend has a general config endpoint:
// // // // //  *
// // // // //  * GET /api/wordscramble/config
// // // // //  *
// // // // //  * this will use it.
// // // // //  *
// // // // //  * If that endpoint doesn't exist, it falls back to the
// // // // //  * normal easy configuration.
// // // // //  */
// // // // // export async function fetchGameConfig(): Promise<{
// // // // //   totalRounds: number;
// // // // //   timeLimitSec: number;
// // // // // }> {
// // // // //   try {
// // // // //     const response = await fetch(
// // // // //       `${WS_API_URL}/config`
// // // // //     );

// // // // //     if (response.ok) {
// // // // //       const data = await response.json();

// // // // //       return {
// // // // //         totalRounds:
// // // // //           Number(data?.totalRounds) || 10,

// // // // //         timeLimitSec:
// // // // //           Number(
// // // // //             data?.timeLimitSec ??
// // // // //               data?.timePerRoundSec
// // // // //           ) || 10,
// // // // //       };
// // // // //     }
// // // // //   } catch (error) {
// // // // //     console.warn(
// // // // //       "General game config endpoint unavailable:",
// // // // //       error
// // // // //     );
// // // // //   }

// // // // //   /*
// // // // //    * Safe fallback.
// // // // //    *
// // // // //    * Actual room configuration will still come
// // // // //    * from the backend when the game starts.
// // // // //    */
// // // // //   return {
// // // // //     totalRounds: 10,
// // // // //     timeLimitSec: 10,
// // // // //   };
// // // // // }

// // // // // /* ============================================================
// // // // //    ROOM SETTINGS
// // // // // ============================================================ */

// // // // // /**
// // // // //  * PATCH
// // // // //  *
// // // // //  * /api/wordscramble/rooms/:roomCode/settings
// // // // //  */
// // // // // export async function updateRoomSettings(
// // // // //   roomCode: string,
// // // // //   playerName: string,
// // // // //   settings: {
// // // // //     totalRounds: number;
// // // // //     timePerRoundSec: number;
// // // // //   }
// // // // // ): Promise<
// // // // //   WordScrambleRoom & {
// // // // //     timePerRoundSec: number;
// // // // //   }
// // // // // > {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/settings`,
// // // // //     {
// // // // //       method: "PATCH",

// // // // //       headers: {
// // // // //         "Content-Type": "application/json",
// // // // //       },

// // // // //       body: JSON.stringify({
// // // // //         playerName,
// // // // //         ...settings,
// // // // //       }),
// // // // //     }
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to update settings: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   const data = await response.json();

// // // // //   return (
// // // // //     data?.room ??
// // // // //     data
// // // // //   );
// // // // // }
// // // // import { API_BASE_URL } from "./api"; // adjust path if API_BASE_URL actually lives elsewhere

// // // // const WS_API_URL = `${API_BASE_URL}/wordscramble`;


// // // // export interface WordSlot {
// // // //   id: string;
// // // //   length: number;
// // // // }

// // // // export interface FoundWord {
// // // //   id: string;
// // // //   word: string;
// // // //   foundBy: string;
// // // // }

// // // // export interface HuntRound {
// // // //   id: string;
// // // //   roundNumber: number;
// // // //   totalRounds: number;
// // // //   timeLimitSec: number;
// // // //   theme?: string;
// // // //   baseLetters: string[];
// // // //   wordSlots: WordSlot[];
// // // //   totalWords: number;
// // // //   foundWords: FoundWord[];
// // // // }

// // // // export interface Player {
// // // //   id?: number;
// // // //   player_name: string;
// // // //   is_ready?: boolean;
// // // //   is_host?: boolean;
// // // //   avatar_color?: string;
// // // //   score: number;
// // // // }

// // // // export interface WordScrambleRoom {
// // // //   id: number;
// // // //   roomCode: string;
// // // //   roomName: string;
// // // //   roomType: string;
// // // //   maxPlayers: number;
// // // //   minPlayers: number;
// // // //   difficulty: string;
// // // //   status: string;
// // // //   totalRounds: number;
// // // //   timeLimitSec: number;
// // // //   lives: number;
// // // //   players: Player[];
// // // // }

// // // // export interface ChatMessage {
// // // //   player_name: string;
// // // //   message: string;
// // // //   sent_at: string;
// // // // }

// // // // export interface RoundAnswer {
// // // //   player_name: string;
// // // //   answer: string;
// // // //   is_correct: boolean;
// // // //   time_taken_sec: number;
// // // //   points: number;
// // // // }

// // // // export interface RoundResults {
// // // //   word: string;
// // // //   roundNumber: number;
// // // //   totalRounds: number;
// // // //   answers: RoundAnswer[];
// // // //   standings: Player[];
// // // // }

// // // // // A single grid cell revealed for free (or via a hint), keyed the same
// // // // // way GamePlayScreen.tsx keys its revealedCells map: `${row}-${col}`.
// // // // export interface RevealedCell {
// // // //   row: number;
// // // //   col: number;
// // // //   letter?: string;
// // // // }

// // // // /* ============================================================
// // // //    ROUND TYPE
// // // // ============================================================ */

// // // // export interface RoundInfo {
// // // //   id: string | number;

// // // //   roundNumber: number;

// // // //   totalRounds: number;

// // // //   timeLimitSec: number;

// // // //   word?: string;

// // // //   scrambledWord?: string;

// // // //   scrambled?: string;

// // // //   clue?: string;

// // // //   lives?: number;

// // // //   freeReveals?: number;

// // // //   // Cells the backend picked as free starter reveals for this round
// // // //   // (see pickInitialReveals in Wordscrambleroutes.js) — every player in
// // // //   // the room gets the same ones, since the grid itself is shared.
// // // //   revealedCells?: RevealedCell[];

// // // //   [key: string]: any;
// // // // }

// // // // /* ============================================================
// // // //    GAME CONFIG
// // // // ============================================================ */

// // // // export interface GameConfig {
// // // //   totalRounds: number;
// // // //   timeLimitSec: number;
// // // //   lives: number;
// // // //   freeReveals?: number;
// // // // }

// // // // /* ============================================================
// // // //    ROUND STATE (multiplayer polling)
// // // // ============================================================ */

// // // // // Polled every few seconds by GamePlayScreen.tsx so one player finding a
// // // // // word, or using a hint, shows up on every OTHER player's screen without
// // // // // needing sockets. See GET /rounds/:roundId/state in Wordscrambleroutes.js.
// // // // export interface RoundStateResult {
// // // //   success: boolean;
// // // //   roundId: number;
// // // //   foundWords: { word: string; foundBy: string }[];
// // // //   revealedCells: { row: number; col: number }[];
// // // //   totalWords: number;
// // // //   isRoundComplete: boolean;
// // // //   players: { player_name: string; score: number }[];
// // // //   livesLeft: number | null;
// // // //   hintsLeftForPlayer: number | null;
// // // // }

// // // // /* ============================================================
// // // //    HELPERS
// // // // ============================================================ */

// // // // async function getErrorMessage(
// // // //   response: Response,
// // // //   fallback: string
// // // // ): Promise<string> {
// // // //   try {
// // // //     const data = await response.json();

// // // //     return (
// // // //       data?.message ||
// // // //       data?.error ||
// // // //       fallback
// // // //     );
// // // //   } catch {
// // // //     return fallback;
// // // //   }
// // // // }

// // // // /* ============================================================
// // // //    WORD HUNT
// // // // ============================================================ */

// // // // /**
// // // //  * GET
// // // //  *
// // // //  * /api/wordscramble/round/:roomCode
// // // //  */
// // // // export async function getWordHuntRound(
// // // //   roomCode: string
// // // // ): Promise<HuntRound> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/round/${encodeURIComponent(roomCode)}`
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to load round: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /**
// // // //  * POST
// // // //  *
// // // //  * /api/wordscramble/submit-word
// // // //  */
// // // // export async function submitWord(
// // // //   roundId: string,
// // // //   playerName: string,
// // // //   word: string
// // // // ): Promise<{
// // // //   isCorrect: boolean;
// // // //   wordsFound: number;
// // // //   totalWords: number;
// // // //   foundWords: FoundWord[];
// // // //   isRoundComplete?: boolean;
// // // // }> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/submit-word`,
// // // //     {
// // // //       method: "POST",

// // // //       headers: {
// // // //         "Content-Type": "application/json",
// // // //       },

// // // //       body: JSON.stringify({
// // // //         roundId,
// // // //         playerName,
// // // //         word,
// // // //       }),
// // // //     }
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to submit word: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /* ============================================================
// // // //    ROOM
// // // // ============================================================ */

// // // // /**
// // // //  * CREATE ROOM
// // // //  *
// // // //  * POST
// // // //  *
// // // //  * /api/wordscramble/rooms
// // // //  */
// // // // // export async function createRoom(payload: {
// // // // //   roomName?: string;
// // // // //   roomType?: string;
// // // // //   maxPlayers?: number;
// // // // //   playerName: string;
// // // // //   difficulty?: string;
// // // // // }): Promise<{ room: WordScrambleRoom }> {
// // // // //   const response = await fetch(
// // // // //     `${WS_API_URL}/rooms`,
// // // // //     {
// // // // //       method: "POST",

// // // // //       headers: {
// // // // //         "Content-Type": "application/json",
// // // // //       },

// // // // //       body: JSON.stringify(payload),
// // // // //     }
// // // // //   );

// // // // //   if (!response.ok) {
// // // // //     throw new Error(
// // // // //       await getErrorMessage(
// // // // //         response,
// // // // //         `Failed to create room: ${response.status}`
// // // // //       )
// // // // //     );
// // // // //   }

// // // // //   return response.json();
// // // // // }
// // // // /**
// // // //  * CREATE ROOM
// // // //  *
// // // //  * POST
// // // //  *
// // // //  * /api/wordscramble/rooms
// // // //  */
// // // // export async function createRoom(payload: {
// // // //   roomName: string;
// // // //   roomType?: string;
// // // //   maxPlayers?: number;
// // // //   totalRounds: number;
// // // //   playerName: string;
// // // // }): Promise<{ room: WordScrambleRoom }> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rooms`,
// // // //     {
// // // //       method: "POST",

// // // //       headers: {
// // // //         "Content-Type": "application/json",
// // // //       },

// // // //       body: JSON.stringify(payload),
// // // //     }
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to create room: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }
// // // // /**
// // // //  * JOIN ROOM
// // // //  *
// // // //  * POST
// // // //  *
// // // //  * /api/wordscramble/rooms/:roomCode/join
// // // //  */
// // // // export async function joinRoom(
// // // //   roomCode: string,
// // // //   playerName: string
// // // // ): Promise<{ room: WordScrambleRoom }> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/join`,
// // // //     {
// // // //       method: "POST",

// // // //       headers: {
// // // //         "Content-Type": "application/json",
// // // //       },

// // // //       body: JSON.stringify({
// // // //         playerName,
// // // //       }),
// // // //     }
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to join room: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /**
// // // //  * GET ROOM
// // // //  *
// // // //  * GET
// // // //  *
// // // //  * /api/wordscramble/rooms/:roomCode
// // // //  */
// // // // export async function fetchRoom(
// // // //   roomCode: string
// // // // ): Promise<{ room: WordScrambleRoom }> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}`
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to fetch room: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /**
// // // //  * START GAME
// // // //  *
// // // //  * POST
// // // //  *
// // // //  * /api/wordscramble/rooms/:roomCode/start
// // // //  */
// // // // export async function startGame(
// // // //   roomCode: string
// // // // ): Promise<any> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/start`,
// // // //     {
// // // //       method: "POST",
// // // //     }
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to start game: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /**
// // // //  * NEXT ROUND
// // // //  *
// // // //  * POST
// // // //  *
// // // //  * /api/wordscramble/rooms/:roomCode/next-round
// // // //  *
// // // //  * opts.fromRoundId : the round the client just finished
// // // //  * opts.skip        : how many extra rounds to jump over (Skip Round token)
// // // //  */
// // // // export async function nextRound(
// // // //   roomCode: string,
// // // //   opts?: { fromRoundId?: string | number; skip?: number }
// // // // ): Promise<any> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/next-round`,
// // // //     {
// // // //       method: "POST",
// // // //       headers: { "Content-Type": "application/json" },
// // // //       body: JSON.stringify({
// // // //         fromRoundId: opts?.fromRoundId,
// // // //         skip: opts?.skip ?? 0,
// // // //       }),
// // // //     }
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to advance round: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /**
// // // //  * FINAL STANDINGS
// // // //  *
// // // //  * GET
// // // //  *
// // // //  * /api/wordscramble/rooms/:roomCode/final
// // // //  */
// // // // export async function fetchFinalStandings(
// // // //   roomCode: string
// // // // ): Promise<any> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/final`
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to fetch final standings: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /* ============================================================
// // // //    LEADERBOARD
// // // // ============================================================ */

// // // // /**
// // // //  * GET
// // // //  *
// // // //  * /api/wordscramble/leaderboard
// // // //  */
// // // // export async function fetchLeaderboard(): Promise<any[]> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/leaderboard`
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to fetch leaderboard: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   const data = await response.json();

// // // //   /*
// // // //    * Backend may return:
// // // //    *
// // // //    * [...]
// // // //    *
// // // //    * OR
// // // //    *
// // // //    * { players: [...] }
// // // //    *
// // // //    * OR
// // // //    *
// // // //    * { leaderboard: [...] }
// // // //    */

// // // //   if (Array.isArray(data)) {
// // // //     return data;
// // // //   }

// // // //   if (Array.isArray(data?.players)) {
// // // //     return data.players;
// // // //   }

// // // //   if (Array.isArray(data?.leaderboard)) {
// // // //     return data.leaderboard;
// // // //   }

// // // //   return [];
// // // // }

// // // // /* ============================================================
// // // //    ROUND RESULTS
// // // // ============================================================ */

// // // // /**
// // // //  * GET
// // // //  *
// // // //  * /api/wordscramble/rounds/:roundId/results
// // // //  */
// // // // export async function fetchRoundResults(
// // // //   roundId: string
// // // // ): Promise<RoundResults> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/results`
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to fetch round results: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /* ============================================================
// // // //    SUBMIT ANSWER
// // // // ============================================================ */

// // // // /**
// // // //  * POST
// // // //  *
// // // //  * /api/wordscramble/rounds/:roundId/answer
// // // //  */
// // // // export async function submitAnswer(
// // // //   roundId: string,
// // // //   playerName: string,
// // // //   answer: string,
// // // //   timeTakenSec: number
// // // // ): Promise<any> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/answer`,
// // // //     {
// // // //       method: "POST",

// // // //       headers: {
// // // //         "Content-Type": "application/json",
// // // //       },

// // // //       body: JSON.stringify({
// // // //         playerName,
// // // //         answer,
// // // //         timeTakenSec,
// // // //       }),
// // // //     }
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to submit answer: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /* ============================================================
// // // //    ROUND STATE (poll — multiplayer sync without sockets)
// // // // ============================================================ */

// // // // /**
// // // //  * GET
// // // //  *
// // // //  * /api/wordscramble/rounds/:roundId/state?playerName=X
// // // //  *
// // // //  * Called on an interval by GamePlayScreen.tsx. Returns the shared truth
// // // //  * for the round right now: every word ANY player has found so far, every
// // // //  * cell revealed so far (starter reveals + anyone's hints), the live
// // // //  * scoreboard, and this caller's own lives/hints-left. This is what makes
// // // //  * one player's find show up on every other player's screen.
// // // //  */
// // // // export async function getRoundState(
// // // //   roundId: string,
// // // //   playerName: string
// // // // ): Promise<RoundStateResult> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/state?playerName=${encodeURIComponent(playerName)}`
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to fetch round state: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /* ============================================================
// // // //    HINT (reveal a letter)
// // // // ============================================================ */

// // // // /**
// // // //  * POST
// // // //  *
// // // //  * /api/wordscramble/rounds/:roundId/hint
// // // //  *
// // // //  * Called by GamePlayScreen.tsx's revealRandomLetter() when the player
// // // //  * taps the lightbulb on the progress bar. The backend picks which cell
// // // //  * to reveal (so it can avoid cells already shown to anyone else in the
// // // //  * room), persists it, enforces the per-player hint cap, and deducts the
// // // //  * score penalty — this call is the source of truth, not the client.
// // // //  */
// // // // export async function useHint(
// // // //   roundId: string,
// // // //   playerName: string
// // // // ): Promise<{
// // // //   success: boolean;
// // // //   revealed?: { row: number; col: number; letter: string };
// // // //   scorePenalty?: number;
// // // //   hintsLeft?: number;
// // // //   exhausted?: boolean;
// // // // }> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/hint`,
// // // //     {
// // // //       method: "POST",

// // // //       headers: {
// // // //         "Content-Type": "application/json",
// // // //       },

// // // //       body: JSON.stringify({
// // // //         playerName,
// // // //       }),
// // // //     }
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to use hint: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /* ============================================================
// // // //    RETRY ROUND
// // // // ============================================================ */

// // // // /**
// // // //  * POST
// // // //  *
// // // //  * /api/wordscramble/rounds/:roundId/retry
// // // //  */
// // // // export async function retryRound(
// // // //   roundId: string,
// // // //   roomCode: string
// // // // ): Promise<any> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/retry`,
// // // //     {
// // // //       method: "POST",

// // // //       headers: {
// // // //         "Content-Type": "application/json",
// // // //       },

// // // //       body: JSON.stringify({
// // // //         roomCode,
// // // //       }),
// // // //     }
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to retry round: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /* ============================================================
// // // //    CHAT
// // // // ============================================================ */

// // // // /**
// // // //  * GET
// // // //  *
// // // //  * /api/wordscramble/rooms/:roomCode/messages
// // // //  */
// // // // export async function fetchMessages(
// // // //   roomCode: string
// // // // ): Promise<{ messages: ChatMessage[] }> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/messages`
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to fetch messages: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /**
// // // //  * POST
// // // //  *
// // // //  * /api/wordscramble/rooms/:roomCode/messages
// // // //  */
// // // // export async function sendMessage(
// // // //   roomCode: string,
// // // //   playerName: string,
// // // //   message: string
// // // // ): Promise<any> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/messages`,
// // // //     {
// // // //       method: "POST",

// // // //       headers: {
// // // //         "Content-Type": "application/json",
// // // //       },

// // // //       body: JSON.stringify({
// // // //         playerName,
// // // //         message,
// // // //       }),
// // // //     }
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to send message: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /* ============================================================
// // // //    GAME CONFIG
// // // // ============================================================ */

// // // // /**
// // // //  * GET
// // // //  *
// // // //  * /api/wordscramble/config/:difficulty
// // // //  */
// // // // export async function fetchDifficultyConfig(
// // // //   difficulty: string
// // // // ): Promise<GameConfig> {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/config/${encodeURIComponent(difficulty)}`
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to fetch config: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   return response.json();
// // // // }

// // // // /*
// // // //  * App.tsx previously tried to import:
// // // //  *
// // // //  * fetchGameConfig()
// // // //  *
// // // //  * Keep this function so App.tsx can safely use it.
// // // //  *
// // // //  * If your backend has a general config endpoint:
// // // //  *
// // // //  * GET /api/wordscramble/config
// // // //  *
// // // //  * this will use it.
// // // //  *
// // // //  * If that endpoint doesn't exist, it falls back to the
// // // //  * normal easy configuration.
// // // //  */
// // // // export async function fetchGameConfig(): Promise<{
// // // //   totalRounds: number;
// // // //   timeLimitSec: number;
// // // // }> {
// // // //   try {
// // // //     const response = await fetch(
// // // //       `${WS_API_URL}/config`
// // // //     );

// // // //     if (response.ok) {
// // // //       const data = await response.json();

// // // //       return {
// // // //         totalRounds:
// // // //           Number(data?.totalRounds) || 10,

// // // //         timeLimitSec:
// // // //           Number(
// // // //             data?.timeLimitSec ??
// // // //               data?.timePerRoundSec
// // // //           ) || 10,
// // // //       };
// // // //     }
// // // //   } catch (error) {
// // // //     console.warn(
// // // //       "General game config endpoint unavailable:",
// // // //       error
// // // //     );
// // // //   }

// // // //   /*
// // // //    * Safe fallback.
// // // //    *
// // // //    * Actual room configuration will still come
// // // //    * from the backend when the game starts.
// // // //    */
// // // //   return {
// // // //     totalRounds: 10,
// // // //     timeLimitSec: 10,
// // // //   };
// // // // }

// // // // /* ============================================================
// // // //    ROOM SETTINGS
// // // // ============================================================ */

// // // // /**
// // // //  * PATCH
// // // //  *
// // // //  * /api/wordscramble/rooms/:roomCode/settings
// // // //  */
// // // // export async function updateRoomSettings(
// // // //   roomCode: string,
// // // //   playerName: string,
// // // //   settings: {
// // // //     totalRounds: number;
// // // //     timePerRoundSec: number;
// // // //   }
// // // // ): Promise<
// // // //   WordScrambleRoom & {
// // // //     timePerRoundSec: number;
// // // //   }
// // // // > {
// // // //   const response = await fetch(
// // // //     `${WS_API_URL}/rooms/${encodeURIComponent(roomCode)}/settings`,
// // // //     {
// // // //       method: "PATCH",

// // // //       headers: {
// // // //         "Content-Type": "application/json",
// // // //       },

// // // //       body: JSON.stringify({
// // // //         playerName,
// // // //         ...settings,
// // // //       }),
// // // //     }
// // // //   );

// // // //   if (!response.ok) {
// // // //     throw new Error(
// // // //       await getErrorMessage(
// // // //         response,
// // // //         `Failed to update settings: ${response.status}`
// // // //       )
// // // //     );
// // // //   }

// // // //   const data = await response.json();

// // // //   return (
// // // //     data?.room ??
// // // //     data
// // // //   );
// // // // }

// // // // /* ============================================================
// // // //    ACTIVE ROOM (resume after re-login)
// // // // ============================================================ */

// // // // /**
// // // //  * GET
// // // //  *
// // // //  * /api/wordscramble/active-room/:playerName
// // // //  *
// // // //  * Which in-progress room is this player still in? (lets a returning
// // // //  * player continue even on a different device / after storage is cleared)
// // // //  */
// // // // export async function fetchActiveRoom(
// // // //   playerName: string
// // // // ): Promise<{ roomCode: string | null }> {
// // // //   try {
// // // //     const response = await fetch(
// // // //       `${WS_API_URL}/active-room/${encodeURIComponent(playerName)}`
// // // //     );
// // // //     if (!response.ok) return { roomCode: null };
// // // //     return response.json();
// // // //   } catch {
// // // //     return { roomCode: null };
// // // //   }
// // // // }
// // // // src/api/Wordscrambleapi.ts

// // // const WS_API_URL =
// // //   process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

// // // /**
// // //  * Extract a useful error message from the backend response.
// // //  */
// // // async function getErrorMessage(
// // //   response: Response,
// // //   fallback: string
// // // ): Promise<string> {
// // //   try {
// // //     const text = await response.text();

// // //     if (!text) {
// // //       return fallback;
// // //     }

// // //     try {
// // //       const data: unknown = JSON.parse(text);

// // //       if (
// // //         typeof data === "object" &&
// // //         data !== null
// // //       ) {
// // //         const body = data as {
// // //           message?: unknown;
// // //           error?: unknown;
// // //           detail?: unknown;
// // //         };

// // //         if (typeof body.message === "string") {
// // //           return body.message;
// // //         }

// // //         if (typeof body.error === "string") {
// // //           return body.error;
// // //         }

// // //         if (typeof body.detail === "string") {
// // //           return body.detail;
// // //         }
// // //       }

// // //       return fallback;
// // //     } catch {
// // //       return text || fallback;
// // //     }
// // //   } catch {
// // //     return fallback;
// // //   }
// // // }

// // // /**
// // //  * Quit the current Word Scramble round.
// // //  */
// // // export async function quitRound(
// // //   roundId: string,
// // //   playerName: string
// // // ): Promise<{
// // //   success: boolean;
// // //   roomFinished: boolean;
// // // }> {
// // //   const response = await fetch(
// // //     `${WS_API_URL}/rounds/${encodeURIComponent(roundId)}/quit`,
// // //     {
// // //       method: "POST",

// // //       headers: {
// // //         "Content-Type": "application/json",
// // //       },

// // //       body: JSON.stringify({
// // //         playerName,
// // //       }),
// // //     }
// // //   );

// // //   if (!response.ok) {
// // //     throw new Error(
// // //       await getErrorMessage(
// // //         response,
// // //         `Failed to quit game: ${response.status}`
// // //       )
// // //     );
// // //   }

// // //   return response.json() as Promise<{
// // //     success: boolean;
// // //     roomFinished: boolean;
// // //   }>;
// // // }
// // import { API_BASE_URL } from "./api";

// // /**
// //  * Word Scramble API.
// //  * Backend router is mounted at  <API_BASE_URL>/wordscramble
// //  * (e.g. http://localhost:3000/api/wordscramble/rooms).
// //  * If your backend mounts it somewhere else, change ONLY this line.
// //  */
// // const WS_API_URL = `${API_BASE_URL}/wordscramble`;

// // /* ------------------------------------------------------------------ */
// // /* Types                                                               */
// // /* ------------------------------------------------------------------ */

// // export interface WordScramblePlayer {
// //   id?: number;
// //   player_name: string;
// //   is_ready?: boolean | number;
// //   is_host?: boolean | number;
// //   score?: number;
// //   avatar_color?: string | null;
// //   [key: string]: any;
// // }

// // export interface WordScrambleRoom {
// //   id: number;
// //   roomCode: string;
// //   roomName: string;
// //   roomType: string;
// //   maxPlayers: number;
// //   minPlayers: number;
// //   difficulty: string;
// //   status: string; // "waiting" | "in_progress" | "finished"
// //   totalRounds: number;
// //   timeLimitSec: number;
// //   timePerRoundSec?: number;
// //   lives: number;
// //   players: WordScramblePlayer[];
// //   [key: string]: any;
// // }

// // export interface CreateRoomInput {
// //   roomName: string;
// //   roomType: string;
// //   maxPlayers: number;
// //   totalRounds: number; // 1 - 50 (compulsory)
// //   playerName: string;
// // }

// // /* ------------------------------------------------------------------ */
// // /* Helpers                                                             */
// // /* ------------------------------------------------------------------ */

// // async function getErrorMessage(
// //   response: Response,
// //   fallback: string
// // ): Promise<string> {
// //   try {
// //     const text = await response.text();

// //     if (!text) return fallback;

// //     try {
// //       const data: unknown = JSON.parse(text);

// //       if (typeof data === "object" && data !== null) {
// //         const body = data as {
// //           message?: unknown;
// //           error?: unknown;
// //           detail?: unknown;
// //         };

// //         if (typeof body.error === "string") return body.error;
// //         if (typeof body.message === "string") return body.message;
// //         if (typeof body.detail === "string") return body.detail;
// //       }

// //       return fallback;
// //     } catch {
// //       return text || fallback;
// //     }
// //   } catch {
// //     return fallback;
// //   }
// // }

// // async function request<T = any>(
// //   path: string,
// //   options: {
// //     method?: "GET" | "POST" | "PATCH" | "DELETE";
// //     body?: unknown;
// //   } = {},
// //   fallbackError = "Request failed"
// // ): Promise<T> {
// //   const { method = "GET", body } = options;

// //   const response = await fetch(`${WS_API_URL}${path}`, {
// //     method,
// //     headers: { "Content-Type": "application/json" },
// //     body: body === undefined ? undefined : JSON.stringify(body),
// //   });

// //   if (!response.ok) {
// //     throw new Error(
// //       await getErrorMessage(response, `${fallbackError} (${response.status})`)
// //     );
// //   }

// //   return (await response.json()) as T;
// // }

// // const enc = encodeURIComponent;

// // /* ------------------------------------------------------------------ */
// // /* Rooms                                                               */
// // /* ------------------------------------------------------------------ */

// // /** POST /rooms  -> { success, room } */
// // export function createRoom(input: CreateRoomInput): Promise<any> {
// //   return request(
// //     "/rooms",
// //     { method: "POST", body: input },
// //     "Failed to create room"
// //   );
// // }

// // /** POST /rooms/:code/join  -> { success, room } */
// // export function joinRoom(roomCode: string, playerName: string): Promise<any> {
// //   return request(
// //     `/rooms/${enc(roomCode)}/join`,
// //     { method: "POST", body: { playerName } },
// //     "Failed to join room"
// //   );
// // }

// // /** GET /rooms/:code  -> { success, room } */
// // export function fetchRoom(
// //   roomCode: string
// // ): Promise<{ success: boolean; room: WordScrambleRoom }> {
// //   return request(`/rooms/${enc(roomCode)}`, {}, "Failed to fetch room");
// // }

// // /** GET /active-room/:playerName  -> { roomCode } */
// // export function fetchActiveRoom(
// //   playerName: string
// // ): Promise<{ roomCode: string | null }> {
// //   return request(
// //     `/active-room/${enc(playerName)}`,
// //     {},
// //     "Failed to load active room"
// //   );
// // }

// // /** PATCH /rooms/:code/settings  -> room (with timePerRoundSec) */
// // export async function updateRoomSettings(
// //   roomCode: string,
// //   playerName: string,
// //   settings: { totalRounds: number; timePerRoundSec?: number }
// // ): Promise<WordScrambleRoom> {
// //   const data = await request<{ success: boolean; room: WordScrambleRoom }>(
// //     `/rooms/${enc(roomCode)}/settings`,
// //     {
// //       method: "PATCH",
// //       body: {
// //         playerName,
// //         totalRounds: settings.totalRounds,
// //         timePerRoundSec: settings.timePerRoundSec,
// //       },
// //     },
// //     "Failed to update settings"
// //   );

// //   return data.room;
// // }

// // /* ------------------------------------------------------------------ */
// // /* Leaderboard                                                         */
// // /* ------------------------------------------------------------------ */

// // /** GET /leaderboard  -> array of { rank, name, score, avatarColor } */
// // export async function fetchLeaderboard(): Promise<any[]> {
// //   const data = await request<{ success: boolean; players: any[] }>(
// //     "/leaderboard",
// //     {},
// //     "Failed to fetch leaderboard"
// //   );

// //   return data.players ?? [];
// // }

// // /* ------------------------------------------------------------------ */
// // /* Game flow                                                           */
// // /* ------------------------------------------------------------------ */

// // /** POST /rooms/:code/start  -> { success, round } (idempotent) */
// // export function startGame(roomCode: string): Promise<any> {
// //   return request(
// //     `/rooms/${enc(roomCode)}/start`,
// //     { method: "POST", body: {} },
// //     "Failed to start game"
// //   );
// // }

// // /** POST /rooms/:code/next-round  -> { success, finished, round? } */
// // export function nextRound(
// //   roomCode: string,
// //   opts: { fromRoundId?: string | number; skip?: number } = {}
// // ): Promise<any> {
// //   return request(
// //     `/rooms/${enc(roomCode)}/next-round`,
// //     {
// //       method: "POST",
// //       body: { fromRoundId: opts.fromRoundId, skip: opts.skip ?? 0 },
// //     },
// //     "Failed to advance round"
// //   );
// // }

// // /** POST /rounds/:roundId/retry  -> { success, round } */
// // export function retryRound(roundId: string, roomCode: string): Promise<any> {
// //   return request(
// //     `/rounds/${enc(roundId)}/retry`,
// //     { method: "POST", body: { roomCode } },
// //     "Failed to load new question"
// //   );
// // }

// // /** POST /rounds/:roundId/answer  -> { isCorrect, points, livesLeft, myWordsFound, ... } */
// // export function submitAnswer(
// //   roundId: string,
// //   playerName: string,
// //   answer: string,
// //   timeTakenSec: number
// // ): Promise<any> {
// //   return request(
// //     `/rounds/${enc(roundId)}/answer`,
// //     { method: "POST", body: { playerName, answer, timeTakenSec } },
// //     "Failed to submit answer"
// //   );
// // }

// // /** GET /rounds/:roundId/state?playerName=X  -> shared round state (polled) */
// // export function getRoundState(
// //   roundId: string,
// //   playerName: string
// // ): Promise<any> {
// //   return request(
// //     `/rounds/${enc(roundId)}/state?playerName=${enc(playerName)}`,
// //     {},
// //     "Failed to fetch round state"
// //   );
// // }

// // /** POST /rounds/:roundId/hint  -> { revealed: {row,col,letter}, hintsLeft, scorePenalty } */
// // export function requestHint(roundId: string, playerName: string): Promise<any> {
// //   return request(
// //     `/rounds/${enc(roundId)}/hint`,
// //     { method: "POST", body: { playerName } },
// //     "Failed to reveal hint"
// //   );
// // }

// // /** POST /rounds/:roundId/quit  -> { success, roomFinished } */
// // export function quitRound(
// //   roundId: string,
// //   playerName: string
// // ): Promise<{ success: boolean; roomFinished: boolean }> {
// //   return request(
// //     `/rounds/${enc(roundId)}/quit`,
// //     { method: "POST", body: { playerName } },
// //     "Failed to quit game"
// //   );
// // }
// import { API_BASE_URL } from "./api";

// /**
//  * Word Scramble API.
//  * Backend router is mounted at  <API_BASE_URL>/wordscramble
//  * (e.g. http://localhost:3000/api/wordscramble/rooms).
//  * If your backend mounts it somewhere else, change ONLY this line.
//  */
// const WS_API_URL = `${API_BASE_URL}/wordscramble`;

// /* ------------------------------------------------------------------ */
// /* Types                                                               */
// /* ------------------------------------------------------------------ */

// export interface WordScramblePlayer {
//   id?: number;
//   player_name: string;
//   is_ready?: boolean | number;
//   is_host?: boolean | number;
//   score?: number;
//   avatar_color?: string | null;
//   [key: string]: any;
// }

// export interface WordScrambleRoom {
//   id: number;
//   roomCode: string;
//   roomName: string;
//   roomType: string;
//   maxPlayers: number;
//   minPlayers: number;
//   difficulty: string;
//   status: string; // "waiting" | "in_progress" | "finished"
//   totalRounds: number;
//   timeLimitSec: number;
//   timePerRoundSec?: number;
//   lives: number;
//   players: WordScramblePlayer[];
//   [key: string]: any;
// }

// export interface CreateRoomInput {
//   roomName: string;
//   roomType: string;
//   maxPlayers: number;
//   totalRounds: number; // 1 - 50 (compulsory)
//   playerName: string;
// }

// /** One row of the Rankings (scorecard) screen */
// export interface ScorecardEntry {
//   rank: number;
//   name: string;
//   score: number;
//   wordsFound: number;
//   coinsEarned: number;
//   avatarColor: string | null;
// }

// /* ------------------------------------------------------------------ */
// /* Helpers                                                             */
// /* ------------------------------------------------------------------ */

// async function getErrorMessage(
//   response: Response,
//   fallback: string
// ): Promise<string> {
//   try {
//     const text = await response.text();

//     if (!text) return fallback;

//     try {
//       const data: unknown = JSON.parse(text);

//       if (typeof data === "object" && data !== null) {
//         const body = data as {
//           message?: unknown;
//           error?: unknown;
//           detail?: unknown;
//         };

//         if (typeof body.error === "string") return body.error;
//         if (typeof body.message === "string") return body.message;
//         if (typeof body.detail === "string") return body.detail;
//       }

//       return fallback;
//     } catch {
//       return text || fallback;
//     }
//   } catch {
//     return fallback;
//   }
// }

// async function request<T = any>(
//   path: string,
//   options: {
//     method?: "GET" | "POST" | "PATCH" | "DELETE";
//     body?: unknown;
//   } = {},
//   fallbackError = "Request failed"
// ): Promise<T> {
//   const { method = "GET", body } = options;

//   const response = await fetch(`${WS_API_URL}${path}`, {
//     method,
//     headers: { "Content-Type": "application/json" },
//     body: body === undefined ? undefined : JSON.stringify(body),
//   });

//   if (!response.ok) {
//     throw new Error(
//       await getErrorMessage(response, `${fallbackError} (${response.status})`)
//     );
//   }

//   return (await response.json()) as T;
// }

// const enc = encodeURIComponent;

// /* ------------------------------------------------------------------ */
// /* Rooms                                                               */
// /* ------------------------------------------------------------------ */

// /** POST /rooms  -> { success, room } */
// export function createRoom(input: CreateRoomInput): Promise<any> {
//   return request(
//     "/rooms",
//     { method: "POST", body: input },
//     "Failed to create room"
//   );
// }

// /** POST /rooms/:code/join  -> { success, room } */
// export function joinRoom(roomCode: string, playerName: string): Promise<any> {
//   return request(
//     `/rooms/${enc(roomCode)}/join`,
//     { method: "POST", body: { playerName } },
//     "Failed to join room"
//   );
// }

// /** GET /rooms/:code  -> { success, room } */
// export function fetchRoom(
//   roomCode: string
// ): Promise<{ success: boolean; room: WordScrambleRoom }> {
//   return request(`/rooms/${enc(roomCode)}`, {}, "Failed to fetch room");
// }

// /** GET /active-room/:playerName  -> { roomCode } */
// export function fetchActiveRoom(
//   playerName: string
// ): Promise<{ roomCode: string | null }> {
//   return request(
//     `/active-room/${enc(playerName)}`,
//     {},
//     "Failed to load active room"
//   );
// }

// /** PATCH /rooms/:code/settings  -> room (with timePerRoundSec) */
// export async function updateRoomSettings(
//   roomCode: string,
//   playerName: string,
//   settings: { totalRounds: number; timePerRoundSec?: number }
// ): Promise<WordScrambleRoom> {
//   const data = await request<{ success: boolean; room: WordScrambleRoom }>(
//     `/rooms/${enc(roomCode)}/settings`,
//     {
//       method: "PATCH",
//       body: {
//         playerName,
//         totalRounds: settings.totalRounds,
//         timePerRoundSec: settings.timePerRoundSec,
//       },
//     },
//     "Failed to update settings"
//   );

//   return data.room;
// }

// /* ------------------------------------------------------------------ */
// /* Leaderboard                                                         */
// /* ------------------------------------------------------------------ */

// /** GET /leaderboard  -> array of { rank, name, score, avatarColor } */
// export async function fetchLeaderboard(): Promise<any[]> {
//   const data = await request<{ success: boolean; players: any[] }>(
//     "/leaderboard",
//     {},
//     "Failed to fetch leaderboard"
//   );

//   return data.players ?? [];
// }

// /**
//  * GET /leaderboard/scorecard
//  *   -> array of { rank, name, score, wordsFound, coinsEarned, avatarColor }
//  * Used by the Rankings screen (refreshed every 5 seconds).
//  */
// export async function fetchScorecard(): Promise<ScorecardEntry[]> {
//   const data = await request<{ success: boolean; players: ScorecardEntry[] }>(
//     "/leaderboard/scorecard",
//     {},
//     "Failed to fetch scorecard"
//   );

//   return data.players ?? [];
// }

// /* ------------------------------------------------------------------ */
// /* Game flow                                                           */
// /* ------------------------------------------------------------------ */

// /** POST /rooms/:code/start  -> { success, round } (idempotent) */
// export function startGame(roomCode: string): Promise<any> {
//   return request(
//     `/rooms/${enc(roomCode)}/start`,
//     { method: "POST", body: {} },
//     "Failed to start game"
//   );
// }

// /** POST /rooms/:code/next-round  -> { success, finished, round? } */
// export function nextRound(
//   roomCode: string,
//   opts: { fromRoundId?: string | number; skip?: number } = {}
// ): Promise<any> {
//   return request(
//     `/rooms/${enc(roomCode)}/next-round`,
//     {
//       method: "POST",
//       body: { fromRoundId: opts.fromRoundId, skip: opts.skip ?? 0 },
//     },
//     "Failed to advance round"
//   );
// }

// /** POST /rounds/:roundId/retry  -> { success, round } */
// export function retryRound(roundId: string, roomCode: string): Promise<any> {
//   return request(
//     `/rounds/${enc(roundId)}/retry`,
//     { method: "POST", body: { roomCode } },
//     "Failed to load new question"
//   );
// }

// /** POST /rounds/:roundId/answer  -> { isCorrect, points, livesLeft, myWordsFound, ... } */
// export function submitAnswer(
//   roundId: string,
//   playerName: string,
//   answer: string,
//   timeTakenSec: number
// ): Promise<any> {
//   return request(
//     `/rounds/${enc(roundId)}/answer`,
//     { method: "POST", body: { playerName, answer, timeTakenSec } },
//     "Failed to submit answer"
//   );
// }

// /** GET /rounds/:roundId/state?playerName=X  -> shared round state (polled) */
// export function getRoundState(
//   roundId: string,
//   playerName: string
// ): Promise<any> {
//   return request(
//     `/rounds/${enc(roundId)}/state?playerName=${enc(playerName)}`,
//     {},
//     "Failed to fetch round state"
//   );
// }

// /** POST /rounds/:roundId/hint  -> { revealed: {row,col,letter}, hintsLeft, scorePenalty } */
// export function requestHint(roundId: string, playerName: string): Promise<any> {
//   return request(
//     `/rounds/${enc(roundId)}/hint`,
//     { method: "POST", body: { playerName } },
//     "Failed to reveal hint"
//   );
// }

// /** POST /rounds/:roundId/quit  -> { success, roomFinished } */
// export function quitRound(
//   roundId: string,
//   playerName: string
// ): Promise<{ success: boolean; roomFinished: boolean }> {
//   return request(
//     `/rounds/${enc(roundId)}/quit`,
//     { method: "POST", body: { playerName } },
//     "Failed to quit game"
//   );
// }
import { API_BASE_URL } from "./api";

/**
 * Word Scramble API.
 * Backend router is mounted at  <API_BASE_URL>/wordscramble
 * (e.g. http://localhost:3000/api/wordscramble/rooms).
 * If your backend mounts it somewhere else, change ONLY this line.
 */
const WS_API_URL = `${API_BASE_URL}/wordscramble`;

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface WordScramblePlayer {
  id?: number;
  player_name: string;
  is_ready?: boolean | number;
  is_host?: boolean | number;
  score?: number;
  avatar_color?: string | null;
  [key: string]: any;
}

export interface WordScrambleRoom {
  id: number;
  roomCode: string;
  roomName: string;
  roomType: string;
  maxPlayers: number;
  minPlayers: number;
  difficulty: string;
  status: string; // "waiting" | "in_progress" | "finished"
  totalRounds: number;
  timeLimitSec: number;
  timePerRoundSec?: number;
  lives: number;
  players: WordScramblePlayer[];
  [key: string]: any;
}

export interface CreateRoomInput {
  roomName: string;
  roomType: string;
  maxPlayers: number;
  totalRounds: number; // 1 - 50 (compulsory)
  playerName: string;
}

/** One row of the Rankings (scorecard) screen */
export interface ScorecardEntry {
  rank: number; // 1 = most words found
  name: string;
  score: number;
  wordsFound: number;
  coinsEarned: number;
  avatarColor: string | null;
  isWinner?: boolean; // NEW: rank 1 AND at least one word found
}

/** One submitted answer row of a round */
export interface RoundAnswerRow {
  player_name: string;
  answer: string;
  is_correct: boolean | number | string; // MySQL may send 1/0
  time_taken_sec: number;
  points: number;
}

/** Player total score after a round */
export interface RoundStanding {
  player_name: string;
  score: number;
}

/** GET /rounds/:roundId/results */
export interface RoundResults {
  success: boolean;
  word: string;
  roundNumber: number;
  totalRounds: number;
  answers: RoundAnswerRow[];
  standings: RoundStanding[];
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const text = await response.text();

    if (!text) return fallback;

    try {
      const data: unknown = JSON.parse(text);

      if (typeof data === "object" && data !== null) {
        const body = data as {
          message?: unknown;
          error?: unknown;
          detail?: unknown;
        };

        if (typeof body.error === "string") return body.error;
        if (typeof body.message === "string") return body.message;
        if (typeof body.detail === "string") return body.detail;
      }

      return fallback;
    } catch {
      return text || fallback;
    }
  } catch {
    return fallback;
  }
}

async function request<T = any>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
  } = {},
  fallbackError = "Request failed"
): Promise<T> {
  const { method = "GET", body } = options;

  const response = await fetch(`${WS_API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `${fallbackError} (${response.status})`)
    );
  }

  return (await response.json()) as T;
}

const enc = encodeURIComponent;

/* ------------------------------------------------------------------ */
/* Rooms                                                               */
/* ------------------------------------------------------------------ */

/** POST /rooms  -> { success, room } */
export function createRoom(input: CreateRoomInput): Promise<any> {
  return request(
    "/rooms",
    { method: "POST", body: input },
    "Failed to create room"
  );
}

/** POST /rooms/:code/join  -> { success, room } */
export function joinRoom(roomCode: string, playerName: string): Promise<any> {
  return request(
    `/rooms/${enc(roomCode)}/join`,
    { method: "POST", body: { playerName } },
    "Failed to join room"
  );
}

/** GET /rooms/:code  -> { success, room } */
export function fetchRoom(
  roomCode: string
): Promise<{ success: boolean; room: WordScrambleRoom }> {
  return request(`/rooms/${enc(roomCode)}`, {}, "Failed to fetch room");
}

/** GET /active-room/:playerName  -> { roomCode } */
export function fetchActiveRoom(
  playerName: string
): Promise<{ roomCode: string | null }> {
  return request(
    `/active-room/${enc(playerName)}`,
    {},
    "Failed to load active room"
  );
}

/** PATCH /rooms/:code/settings  -> room (with timePerRoundSec) */
export async function updateRoomSettings(
  roomCode: string,
  playerName: string,
  settings: { totalRounds: number; timePerRoundSec?: number }
): Promise<WordScrambleRoom> {
  const data = await request<{ success: boolean; room: WordScrambleRoom }>(
    `/rooms/${enc(roomCode)}/settings`,
    {
      method: "PATCH",
      body: {
        playerName,
        totalRounds: settings.totalRounds,
        timePerRoundSec: settings.timePerRoundSec,
      },
    },
    "Failed to update settings"
  );

  return data.room;
}

/* ------------------------------------------------------------------ */
/* Leaderboard                                                         */
/* ------------------------------------------------------------------ */

/** GET /leaderboard  -> array of { rank, name, score, avatarColor } */
export async function fetchLeaderboard(): Promise<any[]> {
  const data = await request<{ success: boolean; players: any[] }>(
    "/leaderboard",
    {},
    "Failed to fetch leaderboard"
  );

  return data.players ?? [];
}

/**
 * GET /leaderboard/scorecard
 *   -> array of { rank, name, score, wordsFound, coinsEarned, avatarColor, isWinner }
 * Backend ranks by WORDS FOUND (most first). Used by the Rankings screen
 * (refreshed every 5 seconds).
 */
export async function fetchScorecard(): Promise<ScorecardEntry[]> {
  const data = await request<{ success: boolean; players: ScorecardEntry[] }>(
    "/leaderboard/scorecard",
    {},
    "Failed to fetch scorecard"
  );

  return data.players ?? [];
}

/* ------------------------------------------------------------------ */
/* Game flow                                                           */
/* ------------------------------------------------------------------ */

/** POST /rooms/:code/start  -> { success, round } (idempotent) */
export function startGame(roomCode: string): Promise<any> {
  return request(
    `/rooms/${enc(roomCode)}/start`,
    { method: "POST", body: {} },
    "Failed to start game"
  );
}

/** POST /rooms/:code/next-round  -> { success, finished, round? } */
export function nextRound(
  roomCode: string,
  opts: { fromRoundId?: string | number; skip?: number } = {}
): Promise<any> {
  return request(
    `/rooms/${enc(roomCode)}/next-round`,
    {
      method: "POST",
      body: { fromRoundId: opts.fromRoundId, skip: opts.skip ?? 0 },
    },
    "Failed to advance round"
  );
}

/** POST /rounds/:roundId/retry  -> { success, round } */
export function retryRound(roundId: string, roomCode: string): Promise<any> {
  return request(
    `/rounds/${enc(roundId)}/retry`,
    { method: "POST", body: { roomCode } },
    "Failed to load new question"
  );
}

/** POST /rounds/:roundId/answer  -> { isCorrect, points, livesLeft, myWordsFound, ... } */
export function submitAnswer(
  roundId: string,
  playerName: string,
  answer: string,
  timeTakenSec: number
): Promise<any> {
  return request(
    `/rounds/${enc(roundId)}/answer`,
    { method: "POST", body: { playerName, answer, timeTakenSec } },
    "Failed to submit answer"
  );
}

/** GET /rounds/:roundId/state?playerName=X  -> shared round state (polled) */
export function getRoundState(
  roundId: string,
  playerName: string
): Promise<any> {
  return request(
    `/rounds/${enc(roundId)}/state?playerName=${enc(playerName)}`,
    {},
    "Failed to fetch round state"
  );
}

/** POST /rounds/:roundId/hint  -> { revealed: {row,col,letter}, hintsLeft, scorePenalty } */
export function requestHint(roundId: string, playerName: string): Promise<any> {
  return request(
    `/rounds/${enc(roundId)}/hint`,
    { method: "POST", body: { playerName } },
    "Failed to reveal hint"
  );
}

/** POST /rounds/:roundId/quit  -> { success, roomFinished } */
export function quitRound(
  roundId: string,
  playerName: string
): Promise<{ success: boolean; roomFinished: boolean }> {
  return request(
    `/rounds/${enc(roundId)}/quit`,
    { method: "POST", body: { playerName } },
    "Failed to quit game"
  );
}

/* ------------------------------------------------------------------ */
/* Round results                                                       */
/* ------------------------------------------------------------------ */

/** GET /rounds/:roundId/results  -> { word, roundNumber, totalRounds, answers, standings } */
export function fetchRoundResults(roundId: string): Promise<RoundResults> {
  return request<RoundResults>(
    `/rounds/${enc(roundId)}/results`,
    {},
    "Failed to fetch round results"
  );
}