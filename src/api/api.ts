
import Constants from "expo-constants";
import { Platform } from "react-native";
import { getCurrentPlayerId, withPlayer } from "./currentPlayer";

/**
 * IMPORTANT — set this before building a standalone APK.
 *
 * In a standalone/production build there is NO Metro dev server attached,
 * so Constants.expoConfig?.hostUri and manifest?.debuggerHost are both
 * undefined (they only exist when running through `expo start` / Expo Go).
 * Without this fallback, resolveHost() below falls through to "localhost",
 * which on a physical phone means the PHONE itself — not your backend
 * machine — so every API call (profile, rooms, etc.) fails and the app
 * shows things like "Player name required".
 *
 * - For local testing on your own WiFi: put your computer's LAN IP here
 *   (Windows: `ipconfig`, look for IPv4 Address under your WiFi adapter —
 *   e.g. "192.168.1.5"). Your phone and computer must be on the SAME WiFi.
 * - For a real deployment: put your deployed backend's URL/host here
 *   instead (e.g. "my-backend.onrender.com") so it works over any network.
 *
 * Whenever you change this, you must rebuild the APK — this value gets
 * baked into the JS bundle at build time, a running install won't pick up
 * an edit to this file.
 */
const FALLBACK_HOST = "192.168.1.5"; // <-- CHANGE THIS to your machine's LAN IP or deployed host

function resolveHost(): string {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.location.hostname;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as any).manifest2?.extra?.expoClient?.hostUri ??
    (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    return hostUri.split(":")[0];
  }

  // No dev server attached -> this is a standalone/production build.
  // "localhost" would point at the phone itself, so use the fixed
  // fallback configured above instead.
  return FALLBACK_HOST;
}

const API_PORT = 4000;
export const API_BASE_URL = `http://${resolveHost()}:${API_PORT}/api`;

export interface StatsResponse {
  highScore: number;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  avgAttempts: number;
}

export interface SettingsResponse {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  darkMode: boolean;
}

export interface StartGameResponse {
  gameId: string;
  difficulty: string;
  codeLength: number;
  maxAttempts: number;
  timeLimitSec: number;
  attemptsUsed: number;
  attemptsLeft: number;
  score: number;
  status: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  createdAt: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

/* Current account id -> header, so backend knows which account is calling */
function playerHeaders(
  extra: Record<string, string> = {}
): Record<string, string> {
  const id = getCurrentPlayerId();
  return id != null ? { ...extra, "X-Player-Id": String(id) } : extra;
}

/* "/stats" -> "http://host:4000/api/stats?playerId=ID" */
function url(path: string): string {
  return `${API_BASE_URL}${withPlayer(path)}`;
}

export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(url("/stats"), { headers: playerHeaders() });
  return handleResponse<StatsResponse>(res);
}

export async function fetchSettings(): Promise<SettingsResponse> {
  const res = await fetch(url("/settings"), { headers: playerHeaders() });
  return handleResponse<SettingsResponse>(res);
}

export async function updateSettings(
  settings: SettingsResponse
): Promise<SettingsResponse> {
  const res = await fetch(url("/settings"), {
    method: "PUT",
    headers: playerHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ ...settings, playerId: getCurrentPlayerId() }),
  });
  return handleResponse<SettingsResponse>(res);
}

export async function resetStats(): Promise<void> {
  const res = await fetch(url("/settings/reset-stats"), {
    method: "POST",
    headers: playerHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ playerId: getCurrentPlayerId() }),
  });
  await handleResponse(res);
}

export async function startGame(difficulty: string): Promise<StartGameResponse> {
  const res = await fetch(url("/games/start"), {
    method: "POST",
    headers: playerHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ difficulty, playerId: getCurrentPlayerId() }),
  });
  return handleResponse<StartGameResponse>(res);
}

export async function loginUser(username: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return handleResponse<LoginResponse>(res);
}