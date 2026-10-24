
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./api";

import {
  CurrentPlayer,
  setCurrentPlayer,
  clearCurrentPlayer,
  getCurrentPlayer,
} from "./currentPlayer";

const DEVICE_KEY = "cyber-mind-device-id";
const PLAYER_ID_KEY = "cyber-mind-player-id";
const PLAYER_NAME_KEY = "cyber-mind-player-name";
// full player (id, name, type) saved as JSON so any account can be restored
const PLAYER_JSON_KEY = "cyber-mind-player";
// set to "1" after logout so the app never auto-logs-in again
const LOGGED_OUT_KEY = "cyber-mind-logged-out";

/* --------------------------------------------------------------- */
/* Generic POST helper                                              */
/* --------------------------------------------------------------- */

async function post<T>(path: string, body: object): Promise<T> {
  console.log("AUTH POST:", `${API_BASE_URL}${path}`);
  console.log("AUTH BODY:", JSON.stringify(body));

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  console.log("AUTH RESPONSE:", JSON.stringify(data));

  if (!res.ok || !(data as any)?.success) {
    throw new Error(
      (data as any)?.error ||
        (data as any)?.message ||
        `Request failed (${res.status})`
    );
  }

  return data as T;
}



async function getDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(DEVICE_KEY);

  if (!id) {
    id =
      Math.random().toString(36).slice(2, 12) +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 8);

    await AsyncStorage.setItem(DEVICE_KEY, id);
    console.log("AUTH: created deviceId:", id);
  }

  return id;
}



async function savePlayer(player: CurrentPlayer): Promise<void> {
  if (player?.id === undefined || player?.id === null) {
    throw new Error("Backend did not return player ID.");
  }

  await AsyncStorage.setItem(PLAYER_ID_KEY, String(player.id));

  if (player.name) {
    await AsyncStorage.setItem(PLAYER_NAME_KEY, player.name);
  }

  // whole player object (guest / user, any account)
  await AsyncStorage.setItem(PLAYER_JSON_KEY, JSON.stringify(player));

  setCurrentPlayer(player);

  console.log("AUTH: saved playerId:", player.id);
  console.log("AUTH: saved playerName:", player.name);
}

/* --------------------------------------------------------------- */
/* Restore last logged-in player from local storage                 */
/* --------------------------------------------------------------- */

async function restoreSavedPlayer(): Promise<CurrentPlayer | null> {
  try {
    const json = await AsyncStorage.getItem(PLAYER_JSON_KEY);

    if (json) {
      const parsed = JSON.parse(json);
      if (parsed?.id != null) return parsed as CurrentPlayer;
    }

    // fallback for old installs (only id + name were saved)
    const id = await AsyncStorage.getItem(PLAYER_ID_KEY);
    const name = await AsyncStorage.getItem(PLAYER_NAME_KEY);

    if (id) {
      return { id: Number(id), name: name || "" } as unknown as CurrentPlayer;
    }
  } catch (e) {
    console.warn("AUTH: restore failed:", e);
  }

  return null;
}

/* --------------------------------------------------------------- */
/* Logged-out flag                                                  */
/* --------------------------------------------------------------- */

export async function isLoggedOut(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(LOGGED_OUT_KEY)) === "1";
  } catch {
    return false;
  }
}



export async function markLoggedIn(player: CurrentPlayer): Promise<void> {
  await savePlayer(player);
  await AsyncStorage.removeItem(LOGGED_OUT_KEY);
}



export async function ensureAccount(): Promise<CurrentPlayer> {
  // 1. use the player already in memory
  const existing = getCurrentPlayer();
  if (existing?.id != null) {
    return existing;
  }

  // user logged out -> never auto-login
  if (await isLoggedOut()) {
    throw new Error("Logged out. Please login again.");
  }

  // 2. restore last logged-in player from local storage
  const saved = await restoreSavedPlayer();
  if (saved?.id != null) {
    setCurrentPlayer(saved);
    console.log("AUTH: restored player:", JSON.stringify(saved));
    return saved;
  }

  // 3. nothing saved -> ask backend (deviceId) for an account
  const deviceId = await getDeviceId();
  console.log("AUTH: ensureAccount deviceId:", deviceId);

  const data = await post<{ player: CurrentPlayer }>("/auth/device", {
    deviceId,
  });

  console.log("AUTH: device account:", JSON.stringify(data.player));

  await savePlayer(data.player);

  return data.player;
}

/* --------------------------------------------------------------- */
/* Get current player ID (always resolves via ensureAccount)        */
/* --------------------------------------------------------------- */

export async function getCurrentPlayerId(): Promise<number> {
  const player = await ensureAccount();
  return Number(player.id);
}

/* --------------------------------------------------------------- */
/* Get player headers                                               */
/* --------------------------------------------------------------- */

export async function getPlayerHeaders(): Promise<Record<string, string>> {
  const player = await ensureAccount();

  console.log("AUTH: playerId for request:", player.id);

  return {
    "Content-Type": "application/json",
    "X-Player-Id": String(player.id),
  };
}


export async function enterAccount(name: string): Promise<CurrentPlayer> {
  const trimmedName = name.trim();

  if (trimmedName.length < 1) {
    throw new Error("Name is required.");
  }

  console.log("AUTH: entering account:", trimmedName);

  const data = await post<{ player: CurrentPlayer }>("/auth/enter", {
    name: trimmedName,
  });

  console.log("AUTH: login player:", JSON.stringify(data.player));

  await savePlayer(data.player);
  await AsyncStorage.removeItem(LOGGED_OUT_KEY);

  return data.player;
}



export async function loginAccount(): Promise<CurrentPlayer> {
  const deviceId = await getDeviceId();

  const data = await post<{ player: CurrentPlayer }>("/auth/login", {
    deviceId,
  });

  await savePlayer(data.player);
  await AsyncStorage.removeItem(LOGGED_OUT_KEY);

  return data.player;
}

/* --------------------------------------------------------------- */
/* Play as Guest button (with nickname)                             */
/* --------------------------------------------------------------- */

export async function guestAccount(nickname: string): Promise<CurrentPlayer> {
  const deviceId = await getDeviceId();

  const data = await post<{ player: CurrentPlayer }>("/auth/guest", {
    deviceId,
    nickname,
  });

  await savePlayer(data.player);
  await AsyncStorage.removeItem(LOGGED_OUT_KEY);

  return data.player;
}



export type RegisterInput = {
  username: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  phone: string;
};

export async function registerAccount(
  input: RegisterInput
): Promise<CurrentPlayer> {
  const deviceId = await getDeviceId();

  const data = await post<{ player: CurrentPlayer }>("/auth/register", {
    deviceId,
    ...input,
  });

  await savePlayer(data.player);
  await AsyncStorage.removeItem(LOGGED_OUT_KEY);

  return data.player;
}

/* --------------------------------------------------------------- */
/* Logout                                                           */
/* --------------------------------------------------------------- */

export async function logoutAccount(): Promise<void> {
  const player = getCurrentPlayer();

  // 1. tell the backend (local logout must work even if the network fails)
  if (player?.id != null) {
    try {
      await post("/auth/logout", { playerId: player.id });
    } catch (e) {
      console.warn("AUTH: backend logout failed:", e);
    }
  }

  // 2. clear local data + block auto-login
  clearCurrentPlayer();

  await AsyncStorage.removeItem(PLAYER_ID_KEY);
  await AsyncStorage.removeItem(PLAYER_NAME_KEY);
  await AsyncStorage.removeItem(PLAYER_JSON_KEY);
  await AsyncStorage.setItem(LOGGED_OUT_KEY, "1");

  console.log("AUTH: logged out and playerId removed");
}