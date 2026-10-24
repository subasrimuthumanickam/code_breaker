
import { API_BASE_URL } from "./api";

/**
 * Word Scramble API.
 * Backend router is mounted at  <API_BASE_URL>/wordscramble
 * (e.g. http://localhost:3000/api/wordscramble/rooms).
 * If your backend mounts it somewhere else, change ONLY this line.
 */
const WS_API_URL = `${API_BASE_URL}/wordscramble`;



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