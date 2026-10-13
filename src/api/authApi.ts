// // // // // // // // // // // import { API_BASE_URL } from "./api";
// // // // // // // // // // // import {
// // // // // // // // // // //   CurrentPlayer,
// // // // // // // // // // //   setCurrentPlayer,
// // // // // // // // // // //   clearCurrentPlayer,
// // // // // // // // // // // } from "./currentPlayer";

// // // // // // // // // // // async function post<T>(path: string, body: object): Promise<T> {
// // // // // // // // // // //   const res = await fetch(`${API_BASE_URL}${path}`, {
// // // // // // // // // // //     method: "POST",
// // // // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // // // //     body: JSON.stringify(body),
// // // // // // // // // // //   });

// // // // // // // // // // //   const data = await res.json().catch(() => ({}));

// // // // // // // // // // //   if (!res.ok || !(data as any)?.success) {
// // // // // // // // // // //     throw new Error((data as any)?.error || `Request failed (${res.status})`);
// // // // // // // // // // //   }

// // // // // // // // // // //   return data as T;
// // // // // // // // // // // }

// // // // // // // // // // // /* Create a new account (own row in DB, own name) and log in */
// // // // // // // // // // // export async function registerAccount(
// // // // // // // // // // //   username: string,
// // // // // // // // // // //   password: string,
// // // // // // // // // // //   name: string
// // // // // // // // // // // ): Promise<CurrentPlayer> {
// // // // // // // // // // //   const data = await post<{ player: CurrentPlayer }>("/auth/register", {
// // // // // // // // // // //     username,
// // // // // // // // // // //     password,
// // // // // // // // // // //     name,
// // // // // // // // // // //   });
// // // // // // // // // // //   setCurrentPlayer(data.player);
// // // // // // // // // // //   return data.player;
// // // // // // // // // // // }

// // // // // // // // // // // /* Log in: backend checks DB, returns this account's id + name */
// // // // // // // // // // // export async function loginAccount(
// // // // // // // // // // //   username: string,
// // // // // // // // // // //   password: string
// // // // // // // // // // // ): Promise<CurrentPlayer> {
// // // // // // // // // // //   const data = await post<{ player: CurrentPlayer }>("/auth/login", {
// // // // // // // // // // //     username,
// // // // // // // // // // //     password,
// // // // // // // // // // //   });
// // // // // // // // // // //   setCurrentPlayer(data.player);
// // // // // // // // // // //   return data.player;
// // // // // // // // // // // }

// // // // // // // // // // // export function logoutAccount() {
// // // // // // // // // // //   clearCurrentPlayer();
// // // // // // // // // // // }
// // // // // // // // // // import { API_BASE_URL } from "./api";
// // // // // // // // // // import {
// // // // // // // // // //   CurrentPlayer,
// // // // // // // // // //   setCurrentPlayer,
// // // // // // // // // //   clearCurrentPlayer,
// // // // // // // // // // } from "./currentPlayer";

// // // // // // // // // // async function post<T>(path: string, body: object): Promise<T> {
// // // // // // // // // //   const res = await fetch(`${API_BASE_URL}${path}`, {
// // // // // // // // // //     method: "POST",
// // // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // // //     body: JSON.stringify(body),
// // // // // // // // // //   });

// // // // // // // // // //   const data = await res.json().catch(() => ({}));

// // // // // // // // // //   if (!res.ok || !(data as any)?.success) {
// // // // // // // // // //     throw new Error((data as any)?.error || `Request failed (${res.status})`);
// // // // // // // // // //   }

// // // // // // // // // //   return data as T;
// // // // // // // // // // }

// // // // // // // // // // /* Create a new account (own row in DB, own name) and log in */
// // // // // // // // // // export async function registerAccount(
// // // // // // // // // //   username: string,
// // // // // // // // // //   password: string,
// // // // // // // // // //   name: string
// // // // // // // // // // ): Promise<CurrentPlayer> {
// // // // // // // // // //   const data = await post<{ player: CurrentPlayer }>("/auth/register", {
// // // // // // // // // //     username,
// // // // // // // // // //     password,
// // // // // // // // // //     name,
// // // // // // // // // //   });
// // // // // // // // // //   setCurrentPlayer(data.player);
// // // // // // // // // //   return data.player;
// // // // // // // // // // }

// // // // // // // // // // /* Log in: backend checks DB, returns this account's id + name */
// // // // // // // // // // export async function loginAccount(
// // // // // // // // // //   username: string,
// // // // // // // // // //   password: string
// // // // // // // // // // ): Promise<CurrentPlayer> {
// // // // // // // // // //   const data = await post<{ player: CurrentPlayer }>("/auth/login", {
// // // // // // // // // //     username,
// // // // // // // // // //     password,
// // // // // // // // // //   });
// // // // // // // // // //   setCurrentPlayer(data.player);
// // // // // // // // // //   return data.player;
// // // // // // // // // // }

// // // // // // // // // // /* Name-only login: existing name -> same account, new name -> new account */
// // // // // // // // // // export async function enterAccount(name: string): Promise<CurrentPlayer> {
// // // // // // // // // //   const data = await post<{ player: CurrentPlayer }>("/auth/enter", { name });
// // // // // // // // // //   setCurrentPlayer(data.player);
// // // // // // // // // //   return data.player;
// // // // // // // // // // }

// // // // // // // // // // export function logoutAccount() {
// // // // // // // // // //   clearCurrentPlayer();
// // // // // // // // // // }
// // // // // // // // // import { API_BASE_URL } from "./api";
// // // // // // // // // import {
// // // // // // // // //   CurrentPlayer,
// // // // // // // // //   setCurrentPlayer,
// // // // // // // // //   clearCurrentPlayer,
// // // // // // // // // } from "./currentPlayer";

// // // // // // // // // async function post<T>(path: string, body: object): Promise<T> {
// // // // // // // // //   const res = await fetch(`${API_BASE_URL}${path}`, {
// // // // // // // // //     method: "POST",
// // // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // // //     body: JSON.stringify(body),
// // // // // // // // //   });

// // // // // // // // //   const data = await res.json().catch(() => ({}));

// // // // // // // // //   if (!res.ok || !(data as any)?.success) {
// // // // // // // // //     throw new Error((data as any)?.error || `Request failed (${res.status})`);
// // // // // // // // //   }

// // // // // // // // //   return data as T;
// // // // // // // // // }

// // // // // // // // // /* Name-only login: existing name -> same account, new name -> new account */
// // // // // // // // // export async function enterAccount(name: string): Promise<CurrentPlayer> {
// // // // // // // // //   const data = await post<{ player: CurrentPlayer }>("/auth/enter", { name });
// // // // // // // // //   setCurrentPlayer(data.player);
// // // // // // // // //   return data.player;
// // // // // // // // // }

// // // // // // // // // export function logoutAccount() {
// // // // // // // // //   clearCurrentPlayer();
// // // // // // // // // }
// // // // // // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // // // // // import { API_BASE_URL } from "./api";
// // // // // // // // import {
// // // // // // // //   CurrentPlayer,
// // // // // // // //   setCurrentPlayer,
// // // // // // // //   clearCurrentPlayer,
// // // // // // // //   getCurrentPlayer,
// // // // // // // // } from "./currentPlayer";

// // // // // // // // const DEVICE_KEY = "cyber-mind-device-id";

// // // // // // // // async function post<T>(path: string, body: object): Promise<T> {
// // // // // // // //   const res = await fetch(`${API_BASE_URL}${path}`, {
// // // // // // // //     method: "POST",
// // // // // // // //     headers: { "Content-Type": "application/json" },
// // // // // // // //     body: JSON.stringify(body),
// // // // // // // //   });

// // // // // // // //   const data = await res.json().catch(() => ({}));

// // // // // // // //   if (!res.ok || !(data as any)?.success) {
// // // // // // // //     throw new Error((data as any)?.error || `Request failed (${res.status})`);
// // // // // // // //   }

// // // // // // // //   return data as T;
// // // // // // // // }

// // // // // // // // /* A random id that identifies this app install / browser. */
// // // // // // // // async function getDeviceId(): Promise<string> {
// // // // // // // //   let id = await AsyncStorage.getItem(DEVICE_KEY);

// // // // // // // //   if (!id) {
// // // // // // // //     id =
// // // // // // // //       Math.random().toString(36).slice(2, 12) +
// // // // // // // //       Date.now().toString(36) +
// // // // // // // //       Math.random().toString(36).slice(2, 8);

// // // // // // // //     await AsyncStorage.setItem(DEVICE_KEY, id);
// // // // // // // //   }

// // // // // // // //   return id;
// // // // // // // // }

// // // // // // // // /*
// // // // // // // //   Called before any profile request. Asks the backend for THIS device's
// // // // // // // //   own account (creates it the first time) and remembers its id in memory.
// // // // // // // // */
// // // // // // // // export async function ensureAccount(): Promise<CurrentPlayer> {
// // // // // // // //   const existing = getCurrentPlayer();
// // // // // // // //   if (existing) return existing;

// // // // // // // //   const deviceId = await getDeviceId();

// // // // // // // //   const data = await post<{ player: CurrentPlayer }>("/auth/device", {
// // // // // // // //     deviceId,
// // // // // // // //   });

// // // // // // // //   setCurrentPlayer(data.player);

// // // // // // // //   return data.player;
// // // // // // // // }

// // // // // // // // /* Name-only login (kept for later use): same name -> same account */
// // // // // // // // export async function enterAccount(name: string): Promise<CurrentPlayer> {
// // // // // // // //   const data = await post<{ player: CurrentPlayer }>("/auth/enter", { name });
// // // // // // // //   setCurrentPlayer(data.player);
// // // // // // // //   return data.player;
// // // // // // // // }

// // // // // // // // export function logoutAccount() {
// // // // // // // //   clearCurrentPlayer();
// // // // // // // // }
// // // // // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // // // // import { API_BASE_URL } from "./api";

// // // // // // // import {
// // // // // // //   CurrentPlayer,
// // // // // // //   setCurrentPlayer,
// // // // // // //   clearCurrentPlayer,
// // // // // // //   getCurrentPlayer,
// // // // // // // } from "./currentPlayer";

// // // // // // // const DEVICE_KEY = "cyber-mind-device-id";
// // // // // // // const PLAYER_ID_KEY = "cyber-mind-player-id";
// // // // // // // const PLAYER_NAME_KEY = "cyber-mind-player-name";

// // // // // // // /* --------------------------------------------------------------- */
// // // // // // // /* Generic POST helper                                              */
// // // // // // // /* --------------------------------------------------------------- */

// // // // // // // async function post<T>(
// // // // // // //   path: string,
// // // // // // //   body: object
// // // // // // // ): Promise<T> {

// // // // // // //   console.log("AUTH POST:", `${API_BASE_URL}${path}`);
// // // // // // //   console.log("AUTH BODY:", JSON.stringify(body));

// // // // // // //   const res = await fetch(
// // // // // // //     `${API_BASE_URL}${path}`,
// // // // // // //     {
// // // // // // //       method: "POST",
// // // // // // //       headers: {
// // // // // // //         "Content-Type": "application/json",
// // // // // // //       },
// // // // // // //       body: JSON.stringify(body),
// // // // // // //     }
// // // // // // //   );

// // // // // // //   const data = await res.json().catch(() => ({}));

// // // // // // //   console.log(
// // // // // // //     "AUTH RESPONSE:",
// // // // // // //     JSON.stringify(data)
// // // // // // //   );

// // // // // // //   if (
// // // // // // //     !res.ok ||
// // // // // // //     !(data as any)?.success
// // // // // // //   ) {
// // // // // // //     throw new Error(
// // // // // // //       (data as any)?.error ||
// // // // // // //       `Request failed (${res.status})`
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return data as T;
// // // // // // // }

// // // // // // // /* --------------------------------------------------------------- */
// // // // // // // /* Device ID                                                        */
// // // // // // // /* --------------------------------------------------------------- */

// // // // // // // /*
// // // // // // //   A random ID that identifies this app installation/browser.
// // // // // // // */

// // // // // // // async function getDeviceId(): Promise<string> {

// // // // // // //   let id =
// // // // // // //     await AsyncStorage.getItem(
// // // // // // //       DEVICE_KEY
// // // // // // //     );

// // // // // // //   if (!id) {

// // // // // // //     id =
// // // // // // //       Math.random()
// // // // // // //         .toString(36)
// // // // // // //         .slice(2, 12) +

// // // // // // //       Date.now()
// // // // // // //         .toString(36) +

// // // // // // //       Math.random()
// // // // // // //         .toString(36)
// // // // // // //         .slice(2, 8);

// // // // // // //     await AsyncStorage.setItem(
// // // // // // //       DEVICE_KEY,
// // // // // // //       id
// // // // // // //     );

// // // // // // //     console.log(
// // // // // // //       "AUTH: created deviceId:",
// // // // // // //       id
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return id;
// // // // // // // }

// // // // // // // /* --------------------------------------------------------------- */
// // // // // // // /* Save current player                                              */
// // // // // // // /* --------------------------------------------------------------- */

// // // // // // // async function savePlayer(
// // // // // // //   player: CurrentPlayer
// // // // // // // ): Promise<void> {

// // // // // // //   if (
// // // // // // //     player?.id === undefined ||
// // // // // // //     player?.id === null
// // // // // // //   ) {
// // // // // // //     throw new Error(
// // // // // // //       "Backend did not return player ID."
// // // // // // //     );
// // // // // // //   }

// // // // // // //   await AsyncStorage.setItem(
// // // // // // //     PLAYER_ID_KEY,
// // // // // // //     String(player.id)
// // // // // // //   );

// // // // // // //   if (player.name) {
// // // // // // //     await AsyncStorage.setItem(
// // // // // // //       PLAYER_NAME_KEY,
// // // // // // //       player.name
// // // // // // //     );
// // // // // // //   }

// // // // // // //   setCurrentPlayer(player);

// // // // // // //   console.log(
// // // // // // //     "AUTH: saved playerId:",
// // // // // // //     player.id
// // // // // // //   );

// // // // // // //   console.log(
// // // // // // //     "AUTH: saved playerName:",
// // // // // // //     player.name
// // // // // // //   );
// // // // // // // }

// // // // // // // /* --------------------------------------------------------------- */
// // // // // // // /* Get current player ID                                            */
// // // // // // // /* --------------------------------------------------------------- */

// // // // // // // export async function getCurrentPlayerId(): Promise<
// // // // // // //   number | null
// // // // // // // > {

// // // // // // //   /*
// // // // // // //     First try memory.
// // // // // // //   */

// // // // // // //   const current =
// // // // // // //     getCurrentPlayer();

// // // // // // //   if (
// // // // // // //     current?.id !== undefined &&
// // // // // // //     current?.id !== null
// // // // // // //   ) {

// // // // // // //     const id =
// // // // // // //       Number(current.id);

// // // // // // //     if (
// // // // // // //       Number.isInteger(id) &&
// // // // // // //       id > 0
// // // // // // //     ) {

// // // // // // //       console.log(
// // // // // // //         "AUTH: playerId from memory:",
// // // // // // //         id
// // // // // // //       );

// // // // // // //       return id;
// // // // // // //     }
// // // // // // //   }

// // // // // // //   /*
// // // // // // //     If memory is empty, read AsyncStorage.
// // // // // // //   */

// // // // // // //   const stored =
// // // // // // //     await AsyncStorage.getItem(
// // // // // // //       PLAYER_ID_KEY
// // // // // // //     );

// // // // // // //   console.log(
// // // // // // //     "AUTH: stored playerId:",
// // // // // // //     stored
// // // // // // //   );

// // // // // // //   if (!stored) {
// // // // // // //     return null;
// // // // // // //   }

// // // // // // //   const playerId =
// // // // // // //     Number(stored);

// // // // // // //   if (
// // // // // // //     !Number.isInteger(playerId) ||
// // // // // // //     playerId <= 0
// // // // // // //   ) {
// // // // // // //     return null;
// // // // // // //   }

// // // // // // //   return playerId;
// // // // // // // }

// // // // // // // /* --------------------------------------------------------------- */
// // // // // // // /* Get player headers                                               */
// // // // // // // /* --------------------------------------------------------------- */

// // // // // // // export async function getPlayerHeaders(): Promise<
// // // // // // //   Record<string, string>
// // // // // // // > {

// // // // // // //   const playerId =
// // // // // // //     await getCurrentPlayerId();

// // // // // // //   console.log(
// // // // // // //     "AUTH: playerId for request:",
// // // // // // //     playerId
// // // // // // //   );

// // // // // // //   if (!playerId) {
// // // // // // //     throw new Error(
// // // // // // //       "Not logged in. playerId is missing."
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return {
// // // // // // //     "Content-Type": "application/json",
// // // // // // //     "X-Player-Id": String(playerId),
// // // // // // //   };
// // // // // // // }

// // // // // // // /* --------------------------------------------------------------- */
// // // // // // // /* Ensure account by device                                         */
// // // // // // // /* --------------------------------------------------------------- */

// // // // // // // /*
// // // // // // //   Called before profile requests.

// // // // // // //   Backend:
// // // // // // //   POST /api/auth/device

// // // // // // //   Request:
// // // // // // //   {
// // // // // // //     deviceId: "xxxxx"
// // // // // // //   }

// // // // // // //   Response:
// // // // // // //   {
// // // // // // //     success: true,
// // // // // // //     player: {
// // // // // // //       id: 2,
// // // // // // //       name: "Suba"
// // // // // // //     }
// // // // // // //   }
// // // // // // // */

// // // // // // // export async function ensureAccount(): Promise<CurrentPlayer> {

// // // // // // //   const existing =
// // // // // // //     getCurrentPlayer();

// // // // // // //   if (existing) {

// // // // // // //     /*
// // // // // // //       Make sure AsyncStorage also contains
// // // // // // //       the player ID.
// // // // // // //     */

// // // // // // //     await savePlayer(existing);

// // // // // // //     return existing;
// // // // // // //   }

// // // // // // //   const deviceId =
// // // // // // //     await getDeviceId();

// // // // // // //   console.log(
// // // // // // //     "AUTH: ensureAccount deviceId:",
// // // // // // //     deviceId
// // // // // // //   );

// // // // // // //   const data =
// // // // // // //     await post<{
// // // // // // //       player: CurrentPlayer;
// // // // // // //     }>(
// // // // // // //       "/auth/device",
// // // // // // //       {
// // // // // // //         deviceId,
// // // // // // //       }
// // // // // // //     );

// // // // // // //   console.log(
// // // // // // //     "AUTH: device account:",
// // // // // // //     JSON.stringify(data.player)
// // // // // // //   );

// // // // // // //   await savePlayer(
// // // // // // //     data.player
// // // // // // //   );

// // // // // // //   return data.player;
// // // // // // // }

// // // // // // // /* --------------------------------------------------------------- */
// // // // // // // /* Name login                                                       */
// // // // // // // /* --------------------------------------------------------------- */

// // // // // // // /*
// // // // // // //   Backend:
// // // // // // //   POST /api/auth/enter

// // // // // // //   Request:
// // // // // // //   {
// // // // // // //     name: "Suba"
// // // // // // //   }

// // // // // // //   Backend saves/finds the account in MySQL.

// // // // // // //   Response:
// // // // // // //   {
// // // // // // //     success: true,
// // // // // // //     player: {
// // // // // // //       id: 2,
// // // // // // //       name: "Suba"
// // // // // // //     }
// // // // // // //   }
// // // // // // // */

// // // // // // // export async function enterAccount(
// // // // // // //   name: string
// // // // // // // ): Promise<CurrentPlayer> {

// // // // // // //   const trimmedName =
// // // // // // //     name.trim();

// // // // // // //   if (trimmedName.length < 1) {
// // // // // // //     throw new Error(
// // // // // // //       "Name is required."
// // // // // // //     );
// // // // // // //   }

// // // // // // //   console.log(
// // // // // // //     "AUTH: entering account:",
// // // // // // //     trimmedName
// // // // // // //   );

// // // // // // //   const data =
// // // // // // //     await post<{
// // // // // // //       player: CurrentPlayer;
// // // // // // //     }>(
// // // // // // //       "/auth/enter",
// // // // // // //       {
// // // // // // //         name: trimmedName,
// // // // // // //       }
// // // // // // //     );

// // // // // // //   console.log(
// // // // // // //     "AUTH: login player:",
// // // // // // //     JSON.stringify(data.player)
// // // // // // //   );

// // // // // // //   /*
// // // // // // //     IMPORTANT:
// // // // // // //     Save player ID into AsyncStorage.
// // // // // // //   */

// // // // // // //   await savePlayer(
// // // // // // //     data.player
// // // // // // //   );

// // // // // // //   return data.player;
// // // // // // // }

// // // // // // // /* --------------------------------------------------------------- */
// // // // // // // /* Logout                                                           */
// // // // // // // /* --------------------------------------------------------------- */

// // // // // // // export async function logoutAccount(): Promise<void> {

// // // // // // //   clearCurrentPlayer();

// // // // // // //   await AsyncStorage.removeItem(
// // // // // // //     PLAYER_ID_KEY
// // // // // // //   );

// // // // // // //   await AsyncStorage.removeItem(
// // // // // // //     PLAYER_NAME_KEY
// // // // // // //   );

// // // // // // //   console.log(
// // // // // // //     "AUTH: logged out and playerId removed"
// // // // // // //   );
// // // // // // // }
// // // // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // // // import { API_BASE_URL } from "./api";

// // // // // // import {
// // // // // //   CurrentPlayer,
// // // // // //   setCurrentPlayer,
// // // // // //   clearCurrentPlayer,
// // // // // //   getCurrentPlayer,
// // // // // // } from "./currentPlayer";

// // // // // // const DEVICE_KEY = "cyber-mind-device-id";
// // // // // // const PLAYER_ID_KEY = "cyber-mind-player-id";
// // // // // // const PLAYER_NAME_KEY = "cyber-mind-player-name";

// // // // // // /* --------------------------------------------------------------- */
// // // // // // /* Generic POST helper                                              */
// // // // // // /* --------------------------------------------------------------- */

// // // // // // async function post<T>(path: string, body: object): Promise<T> {
// // // // // //   console.log("AUTH POST:", `${API_BASE_URL}${path}`);
// // // // // //   console.log("AUTH BODY:", JSON.stringify(body));

// // // // // //   const res = await fetch(`${API_BASE_URL}${path}`, {
// // // // // //     method: "POST",
// // // // // //     headers: { "Content-Type": "application/json" },
// // // // // //     body: JSON.stringify(body),
// // // // // //   });

// // // // // //   const data = await res.json().catch(() => ({}));

// // // // // //   console.log("AUTH RESPONSE:", JSON.stringify(data));

// // // // // //   if (!res.ok || !(data as any)?.success) {
// // // // // //     throw new Error((data as any)?.error || `Request failed (${res.status})`);
// // // // // //   }

// // // // // //   return data as T;
// // // // // // }

// // // // // // /* --------------------------------------------------------------- */
// // // // // // /* Device ID (only this is stored locally)                          */
// // // // // // /* --------------------------------------------------------------- */

// // // // // // async function getDeviceId(): Promise<string> {
// // // // // //   let id = await AsyncStorage.getItem(DEVICE_KEY);

// // // // // //   if (!id) {
// // // // // //     id =
// // // // // //       Math.random().toString(36).slice(2, 12) +
// // // // // //       Date.now().toString(36) +
// // // // // //       Math.random().toString(36).slice(2, 8);

// // // // // //     await AsyncStorage.setItem(DEVICE_KEY, id);
// // // // // //     console.log("AUTH: created deviceId:", id);
// // // // // //   }

// // // // // //   return id;
// // // // // // }

// // // // // // /* --------------------------------------------------------------- */
// // // // // // /* Save current player                                              */
// // // // // // /* --------------------------------------------------------------- */

// // // // // // async function savePlayer(player: CurrentPlayer): Promise<void> {
// // // // // //   if (player?.id === undefined || player?.id === null) {
// // // // // //     throw new Error("Backend did not return player ID.");
// // // // // //   }

// // // // // //   await AsyncStorage.setItem(PLAYER_ID_KEY, String(player.id));

// // // // // //   if (player.name) {
// // // // // //     await AsyncStorage.setItem(PLAYER_NAME_KEY, player.name);
// // // // // //   }

// // // // // //   setCurrentPlayer(player);

// // // // // //   console.log("AUTH: saved playerId:", player.id);
// // // // // //   console.log("AUTH: saved playerName:", player.name);
// // // // // // }

// // // // // // /* --------------------------------------------------------------- */
// // // // // // /* Ensure account (memory -> storage -> backend/DB)                 */
// // // // // // /* --------------------------------------------------------------- */

// // // // // // /*
// // // // // //   Backend: POST /api/auth/device
// // // // // //   Request : { deviceId: "xxxxx" }
// // // // // //   Response: { success: true, player: { id: 2, name: "Suba" } }
// // // // // // */

// // // // // // export async function ensureAccount(): Promise<CurrentPlayer> {
// // // // // //   // 1. Memory la irundha adhey use pannu
// // // // // //   const existing = getCurrentPlayer();
// // // // // //   if (existing?.id != null) {
// // // // // //     return existing;
// // // // // //   }

// // // // // //   // 2. Backend kitta deviceId anuppi account eduthuko / create pannu
// // // // // //   const deviceId = await getDeviceId();
// // // // // //   console.log("AUTH: ensureAccount deviceId:", deviceId);

// // // // // //   const data = await post<{ player: CurrentPlayer }>("/auth/device", {
// // // // // //     deviceId,
// // // // // //   });

// // // // // //   console.log("AUTH: device account:", JSON.stringify(data.player));

// // // // // //   await savePlayer(data.player);

// // // // // //   return data.player;
// // // // // // }

// // // // // // /* --------------------------------------------------------------- */
// // // // // // /* Get current player ID (always resolves via ensureAccount)        */
// // // // // // /* --------------------------------------------------------------- */

// // // // // // export async function getCurrentPlayerId(): Promise<number> {
// // // // // //   const player = await ensureAccount();
// // // // // //   return Number(player.id);
// // // // // // }

// // // // // // /* --------------------------------------------------------------- */
// // // // // // /* Get player headers                                               */
// // // // // // /* --------------------------------------------------------------- */

// // // // // // export async function getPlayerHeaders(): Promise<Record<string, string>> {
// // // // // //   const player = await ensureAccount();

// // // // // //   console.log("AUTH: playerId for request:", player.id);

// // // // // //   return {
// // // // // //     "Content-Type": "application/json",
// // // // // //     "X-Player-Id": String(player.id),
// // // // // //   };
// // // // // // }

// // // // // // /* --------------------------------------------------------------- */
// // // // // // /* Name login                                                       */
// // // // // // /* --------------------------------------------------------------- */

// // // // // // /*
// // // // // //   Backend: POST /api/auth/enter
// // // // // //   Request : { name: "Suba" }
// // // // // //   Response: { success: true, player: { id: 2, name: "Suba" } }
// // // // // // */

// // // // // // export async function enterAccount(name: string): Promise<CurrentPlayer> {
// // // // // //   const trimmedName = name.trim();

// // // // // //   if (trimmedName.length < 1) {
// // // // // //     throw new Error("Name is required.");
// // // // // //   }

// // // // // //   console.log("AUTH: entering account:", trimmedName);

// // // // // //   const data = await post<{ player: CurrentPlayer }>("/auth/enter", {
// // // // // //     name: trimmedName,
// // // // // //   });

// // // // // //   console.log("AUTH: login player:", JSON.stringify(data.player));

// // // // // //   await savePlayer(data.player);

// // // // // //   return data.player;
// // // // // // }

// // // // // // /* --------------------------------------------------------------- */
// // // // // // /* Logout                                                           */
// // // // // // /* --------------------------------------------------------------- */

// // // // // // export async function logoutAccount(): Promise<void> {
// // // // // //   clearCurrentPlayer();

// // // // // //   await AsyncStorage.removeItem(PLAYER_ID_KEY);
// // // // // //   await AsyncStorage.removeItem(PLAYER_NAME_KEY);

// // // // // //   console.log("AUTH: logged out and playerId removed");
// // // // // // }
// // // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // // import { API_BASE_URL } from "./api";

// // // // // import {
// // // // //   CurrentPlayer,
// // // // //   setCurrentPlayer,
// // // // //   clearCurrentPlayer,
// // // // //   getCurrentPlayer,
// // // // // } from "./currentPlayer";

// // // // // const DEVICE_KEY = "cyber-mind-device-id";
// // // // // const PLAYER_ID_KEY = "cyber-mind-player-id";
// // // // // const PLAYER_NAME_KEY = "cyber-mind-player-name";
// // // // // // NEW: set to "1" after logout so the app never auto-logs-in again
// // // // // const LOGGED_OUT_KEY = "cyber-mind-logged-out";

// // // // // /* --------------------------------------------------------------- */
// // // // // /* Generic POST helper                                              */
// // // // // /* --------------------------------------------------------------- */

// // // // // async function post<T>(path: string, body: object): Promise<T> {
// // // // //   console.log("AUTH POST:", `${API_BASE_URL}${path}`);
// // // // //   console.log("AUTH BODY:", JSON.stringify(body));

// // // // //   const res = await fetch(`${API_BASE_URL}${path}`, {
// // // // //     method: "POST",
// // // // //     headers: { "Content-Type": "application/json" },
// // // // //     body: JSON.stringify(body),
// // // // //   });

// // // // //   const data = await res.json().catch(() => ({}));

// // // // //   console.log("AUTH RESPONSE:", JSON.stringify(data));

// // // // //   if (!res.ok || !(data as any)?.success) {
// // // // //     throw new Error((data as any)?.error || `Request failed (${res.status})`);
// // // // //   }

// // // // //   return data as T;
// // // // // }

// // // // // /* --------------------------------------------------------------- */
// // // // // /* Device ID (only this is stored locally)                          */
// // // // // /* --------------------------------------------------------------- */

// // // // // async function getDeviceId(): Promise<string> {
// // // // //   let id = await AsyncStorage.getItem(DEVICE_KEY);

// // // // //   if (!id) {
// // // // //     id =
// // // // //       Math.random().toString(36).slice(2, 12) +
// // // // //       Date.now().toString(36) +
// // // // //       Math.random().toString(36).slice(2, 8);

// // // // //     await AsyncStorage.setItem(DEVICE_KEY, id);
// // // // //     console.log("AUTH: created deviceId:", id);
// // // // //   }

// // // // //   return id;
// // // // // }

// // // // // /* --------------------------------------------------------------- */
// // // // // /* Save current player                                              */
// // // // // /* --------------------------------------------------------------- */

// // // // // async function savePlayer(player: CurrentPlayer): Promise<void> {
// // // // //   if (player?.id === undefined || player?.id === null) {
// // // // //     throw new Error("Backend did not return player ID.");
// // // // //   }

// // // // //   await AsyncStorage.setItem(PLAYER_ID_KEY, String(player.id));

// // // // //   if (player.name) {
// // // // //     await AsyncStorage.setItem(PLAYER_NAME_KEY, player.name);
// // // // //   }

// // // // //   setCurrentPlayer(player);

// // // // //   console.log("AUTH: saved playerId:", player.id);
// // // // //   console.log("AUTH: saved playerName:", player.name);
// // // // // }

// // // // // /* --------------------------------------------------------------- */
// // // // // /* Logged-out flag                                                  */
// // // // // /* --------------------------------------------------------------- */

// // // // // export async function isLoggedOut(): Promise<boolean> {
// // // // //   try {
// // // // //     return (await AsyncStorage.getItem(LOGGED_OUT_KEY)) === "1";
// // // // //   } catch {
// // // // //     return false;
// // // // //   }
// // // // // }

// // // // // /* --------------------------------------------------------------- */
// // // // // /* Ensure account (memory -> storage -> backend/DB)                 */
// // // // // /* --------------------------------------------------------------- */

// // // // // /*
// // // // //   Backend: POST /api/auth/device
// // // // //   Request : { deviceId: "xxxxx" }
// // // // //   Response: { success: true, player: { id: 2, name: "Suba" } }
// // // // // */

// // // // // export async function ensureAccount(): Promise<CurrentPlayer> {
// // // // //   // 1. Memory la irundha adhey use pannu
// // // // //   const existing = getCurrentPlayer();
// // // // //   if (existing?.id != null) {
// // // // //     return existing;
// // // // //   }

// // // // //   // NEW: user logout panniruntha auto-login panna koodadhu
// // // // //   if (await isLoggedOut()) {
// // // // //     throw new Error("Logged out. Please login again.");
// // // // //   }

// // // // //   // 2. Backend kitta deviceId anuppi account eduthuko / create pannu
// // // // //   const deviceId = await getDeviceId();
// // // // //   console.log("AUTH: ensureAccount deviceId:", deviceId);

// // // // //   const data = await post<{ player: CurrentPlayer }>("/auth/device", {
// // // // //     deviceId,
// // // // //   });

// // // // //   console.log("AUTH: device account:", JSON.stringify(data.player));

// // // // //   await savePlayer(data.player);

// // // // //   return data.player;
// // // // // }

// // // // // /* --------------------------------------------------------------- */
// // // // // /* Get current player ID (always resolves via ensureAccount)        */
// // // // // /* --------------------------------------------------------------- */

// // // // // export async function getCurrentPlayerId(): Promise<number> {
// // // // //   const player = await ensureAccount();
// // // // //   return Number(player.id);
// // // // // }

// // // // // /* --------------------------------------------------------------- */
// // // // // /* Get player headers                                               */
// // // // // /* --------------------------------------------------------------- */

// // // // // export async function getPlayerHeaders(): Promise<Record<string, string>> {
// // // // //   const player = await ensureAccount();

// // // // //   console.log("AUTH: playerId for request:", player.id);

// // // // //   return {
// // // // //     "Content-Type": "application/json",
// // // // //     "X-Player-Id": String(player.id),
// // // // //   };
// // // // // }

// // // // // /* --------------------------------------------------------------- */
// // // // // /* Name login                                                       */
// // // // // /* --------------------------------------------------------------- */

// // // // // /*
// // // // //   Backend: POST /api/auth/enter
// // // // //   Request : { name: "Suba" }
// // // // //   Response: { success: true, player: { id: 2, name: "Suba" } }
// // // // // */

// // // // // export async function enterAccount(name: string): Promise<CurrentPlayer> {
// // // // //   const trimmedName = name.trim();

// // // // //   if (trimmedName.length < 1) {
// // // // //     throw new Error("Name is required.");
// // // // //   }

// // // // //   console.log("AUTH: entering account:", trimmedName);

// // // // //   const data = await post<{ player: CurrentPlayer }>("/auth/enter", {
// // // // //     name: trimmedName,
// // // // //   });

// // // // //   console.log("AUTH: login player:", JSON.stringify(data.player));

// // // // //   await savePlayer(data.player);

// // // // //   // NEW: login aachu, auto-login block ah remove pannu
// // // // //   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

// // // // //   return data.player;
// // // // // }

// // // // // /* --------------------------------------------------------------- */
// // // // // /* Logout                                                           */
// // // // // /* --------------------------------------------------------------- */

// // // // // /*
// // // // //   Frontend -> POST /api/auth/logout { playerId }
// // // // //   Backend  -> UPDATE player SET last_logout = NOW()
// // // // //   Backend  -> { success: true } JSON
// // // // //   Frontend -> clears local data + sets logged-out flag
// // // // // */

// // // // // export async function logoutAccount(): Promise<void> {
// // // // //   const player = getCurrentPlayer();

// // // // //   // 1. Backend ku sollu (network illana kooda local logout work aaganum)
// // // // //   if (player?.id != null) {
// // // // //     try {
// // // // //       await post("/auth/logout", { playerId: player.id });
// // // // //     } catch (e) {
// // // // //       console.warn("AUTH: backend logout failed:", e);
// // // // //     }
// // // // //   }

// // // // //   // 2. Local clear + auto-login block
// // // // //   clearCurrentPlayer();

// // // // //   await AsyncStorage.removeItem(PLAYER_ID_KEY);
// // // // //   await AsyncStorage.removeItem(PLAYER_NAME_KEY);
// // // // //   await AsyncStorage.setItem(LOGGED_OUT_KEY, "1");

// // // // //   console.log("AUTH: logged out and playerId removed");
// // // // // }
// // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // import { API_BASE_URL } from "./api";

// // // // import {
// // // //   CurrentPlayer,
// // // //   setCurrentPlayer,
// // // //   clearCurrentPlayer,
// // // //   getCurrentPlayer,
// // // // } from "./currentPlayer";

// // // // const DEVICE_KEY = "cyber-mind-device-id";
// // // // const PLAYER_ID_KEY = "cyber-mind-player-id";
// // // // const PLAYER_NAME_KEY = "cyber-mind-player-name";
// // // // // NEW: set to "1" after logout so the app never auto-logs-in again
// // // // const LOGGED_OUT_KEY = "cyber-mind-logged-out";

// // // // /* --------------------------------------------------------------- */
// // // // /* Generic POST helper                                              */
// // // // /* --------------------------------------------------------------- */

// // // // async function post<T>(path: string, body: object): Promise<T> {
// // // //   console.log("AUTH POST:", `${API_BASE_URL}${path}`);
// // // //   console.log("AUTH BODY:", JSON.stringify(body));

// // // //   const res = await fetch(`${API_BASE_URL}${path}`, {
// // // //     method: "POST",
// // // //     headers: { "Content-Type": "application/json" },
// // // //     body: JSON.stringify(body),
// // // //   });

// // // //   const data = await res.json().catch(() => ({}));

// // // //   console.log("AUTH RESPONSE:", JSON.stringify(data));

// // // //   if (!res.ok || !(data as any)?.success) {
// // // //     throw new Error(
// // // //       (data as any)?.error ||
// // // //         (data as any)?.message ||
// // // //         `Request failed (${res.status})`
// // // //     );
// // // //   }

// // // //   return data as T;
// // // // }

// // // // /* --------------------------------------------------------------- */
// // // // /* Device ID (only this is stored locally)                          */
// // // // /* --------------------------------------------------------------- */

// // // // async function getDeviceId(): Promise<string> {
// // // //   let id = await AsyncStorage.getItem(DEVICE_KEY);

// // // //   if (!id) {
// // // //     id =
// // // //       Math.random().toString(36).slice(2, 12) +
// // // //       Date.now().toString(36) +
// // // //       Math.random().toString(36).slice(2, 8);

// // // //     await AsyncStorage.setItem(DEVICE_KEY, id);
// // // //     console.log("AUTH: created deviceId:", id);
// // // //   }

// // // //   return id;
// // // // }

// // // // /* --------------------------------------------------------------- */
// // // // /* Save current player                                              */
// // // // /* --------------------------------------------------------------- */

// // // // async function savePlayer(player: CurrentPlayer): Promise<void> {
// // // //   if (player?.id === undefined || player?.id === null) {
// // // //     throw new Error("Backend did not return player ID.");
// // // //   }

// // // //   await AsyncStorage.setItem(PLAYER_ID_KEY, String(player.id));

// // // //   if (player.name) {
// // // //     await AsyncStorage.setItem(PLAYER_NAME_KEY, player.name);
// // // //   }

// // // //   setCurrentPlayer(player);

// // // //   console.log("AUTH: saved playerId:", player.id);
// // // //   console.log("AUTH: saved playerName:", player.name);
// // // // }

// // // // /* --------------------------------------------------------------- */
// // // // /* Logged-out flag                                                  */
// // // // /* --------------------------------------------------------------- */

// // // // export async function isLoggedOut(): Promise<boolean> {
// // // //   try {
// // // //     return (await AsyncStorage.getItem(LOGGED_OUT_KEY)) === "1";
// // // //   } catch {
// // // //     return false;
// // // //   }
// // // // }

// // // // /* --------------------------------------------------------------- */
// // // // /* Ensure account (memory -> storage -> backend/DB)                 */
// // // // /* --------------------------------------------------------------- */

// // // // /*
// // // //   Backend: POST /api/auth/device
// // // //   Request : { deviceId: "xxxxx" }
// // // //   Response: { success: true, player: { id: 2, name: "Suba" } }
// // // // */

// // // // export async function ensureAccount(): Promise<CurrentPlayer> {
// // // //   // 1. Memory la irundha adhey use pannu
// // // //   const existing = getCurrentPlayer();
// // // //   if (existing?.id != null) {
// // // //     return existing;
// // // //   }

// // // //   // NEW: user logout panniruntha auto-login panna koodadhu
// // // //   if (await isLoggedOut()) {
// // // //     throw new Error("Logged out. Please login again.");
// // // //   }

// // // //   // 2. Backend kitta deviceId anuppi account eduthuko / create pannu
// // // //   const deviceId = await getDeviceId();
// // // //   console.log("AUTH: ensureAccount deviceId:", deviceId);

// // // //   const data = await post<{ player: CurrentPlayer }>("/auth/device", {
// // // //     deviceId,
// // // //   });

// // // //   console.log("AUTH: device account:", JSON.stringify(data.player));

// // // //   await savePlayer(data.player);

// // // //   return data.player;
// // // // }

// // // // /* --------------------------------------------------------------- */
// // // // /* Get current player ID (always resolves via ensureAccount)        */
// // // // /* --------------------------------------------------------------- */

// // // // export async function getCurrentPlayerId(): Promise<number> {
// // // //   const player = await ensureAccount();
// // // //   return Number(player.id);
// // // // }

// // // // /* --------------------------------------------------------------- */
// // // // /* Get player headers                                               */
// // // // /* --------------------------------------------------------------- */

// // // // export async function getPlayerHeaders(): Promise<Record<string, string>> {
// // // //   const player = await ensureAccount();

// // // //   console.log("AUTH: playerId for request:", player.id);

// // // //   return {
// // // //     "Content-Type": "application/json",
// // // //     "X-Player-Id": String(player.id),
// // // //   };
// // // // }

// // // // /* --------------------------------------------------------------- */
// // // // /* Name login (old flow, kept so nothing else breaks)               */
// // // // /* --------------------------------------------------------------- */

// // // // /*
// // // //   Backend: POST /api/auth/enter
// // // //   Request : { name: "Suba" }
// // // //   Response: { success: true, player: { id: 2, name: "Suba" } }
// // // // */

// // // // export async function enterAccount(name: string): Promise<CurrentPlayer> {
// // // //   const trimmedName = name.trim();

// // // //   if (trimmedName.length < 1) {
// // // //     throw new Error("Name is required.");
// // // //   }

// // // //   console.log("AUTH: entering account:", trimmedName);

// // // //   const data = await post<{ player: CurrentPlayer }>("/auth/enter", {
// // // //     name: trimmedName,
// // // //   });

// // // //   console.log("AUTH: login player:", JSON.stringify(data.player));

// // // //   await savePlayer(data.player);

// // // //   // NEW: login aachu, auto-login block ah remove pannu
// // // //   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

// // // //   return data.player;
// // // // }

// // // // /* --------------------------------------------------------------- */
// // // // /* NEW: Login button                                                */
// // // // /* --------------------------------------------------------------- */

// // // // /*
// // // //   Backend: POST /api/auth/login
// // // //   Request : { deviceId }
// // // //   Response: { success: true, player: { id, name, type: "user" } }
// // // // */

// // // // export async function loginAccount(): Promise<CurrentPlayer> {
// // // //   const deviceId = await getDeviceId();

// // // //   const data = await post<{ player: CurrentPlayer }>("/auth/login", {
// // // //     deviceId,
// // // //   });

// // // //   await savePlayer(data.player);
// // // //   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

// // // //   return data.player;
// // // // }

// // // // /* --------------------------------------------------------------- */
// // // // /* NEW: Play as Guest button                                        */
// // // // /* --------------------------------------------------------------- */

// // // // /*
// // // //   Backend: POST /api/auth/guest
// // // //   Request : { deviceId }
// // // //   Response: { success: true, player: { id, name, type: "guest" } }
// // // // */

// // // // export async function guestAccount(): Promise<CurrentPlayer> {
// // // //   const deviceId = await getDeviceId();

// // // //   const data = await post<{ player: CurrentPlayer }>("/auth/guest", {
// // // //     deviceId,
// // // //   });

// // // //   await savePlayer(data.player);
// // // //   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

// // // //   return data.player;
// // // // }

// // // // /* --------------------------------------------------------------- */
// // // // /* Logout                                                           */
// // // // /* --------------------------------------------------------------- */

// // // // /*
// // // //   Frontend -> POST /api/auth/logout { playerId }
// // // //   Backend  -> UPDATE player SET last_logout = NOW()
// // // //   Backend  -> { success: true } JSON
// // // //   Frontend -> clears local data + sets logged-out flag
// // // // */

// // // // export async function logoutAccount(): Promise<void> {
// // // //   const player = getCurrentPlayer();

// // // //   // 1. Backend ku sollu (network illana kooda local logout work aaganum)
// // // //   if (player?.id != null) {
// // // //     try {
// // // //       await post("/auth/logout", { playerId: player.id });
// // // //     } catch (e) {
// // // //       console.warn("AUTH: backend logout failed:", e);
// // // //     }
// // // //   }

// // // //   // 2. Local clear + auto-login block
// // // //   clearCurrentPlayer();

// // // //   await AsyncStorage.removeItem(PLAYER_ID_KEY);
// // // //   await AsyncStorage.removeItem(PLAYER_NAME_KEY);
// // // //   await AsyncStorage.setItem(LOGGED_OUT_KEY, "1");

// // // //   console.log("AUTH: logged out and playerId removed");
// // // // }
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import { API_BASE_URL } from "./api";

// // // import {
// // //   CurrentPlayer,
// // //   setCurrentPlayer,
// // //   clearCurrentPlayer,
// // //   getCurrentPlayer,
// // // } from "./currentPlayer";

// // // const DEVICE_KEY = "cyber-mind-device-id";
// // // const PLAYER_ID_KEY = "cyber-mind-player-id";
// // // const PLAYER_NAME_KEY = "cyber-mind-player-name";
// // // // NEW: set to "1" after logout so the app never auto-logs-in again
// // // const LOGGED_OUT_KEY = "cyber-mind-logged-out";

// // // /* --------------------------------------------------------------- */
// // // /* Generic POST helper                                              */
// // // /* --------------------------------------------------------------- */

// // // async function post<T>(path: string, body: object): Promise<T> {
// // //   console.log("AUTH POST:", `${API_BASE_URL}${path}`);
// // //   console.log("AUTH BODY:", JSON.stringify(body));

// // //   const res = await fetch(`${API_BASE_URL}${path}`, {
// // //     method: "POST",
// // //     headers: { "Content-Type": "application/json" },
// // //     body: JSON.stringify(body),
// // //   });

// // //   const data = await res.json().catch(() => ({}));

// // //   console.log("AUTH RESPONSE:", JSON.stringify(data));

// // //   if (!res.ok || !(data as any)?.success) {
// // //     throw new Error(
// // //       (data as any)?.error ||
// // //         (data as any)?.message ||
// // //         `Request failed (${res.status})`
// // //     );
// // //   }

// // //   return data as T;
// // // }

// // // /* --------------------------------------------------------------- */
// // // /* Device ID (only this is stored locally)                          */
// // // /* --------------------------------------------------------------- */

// // // async function getDeviceId(): Promise<string> {
// // //   let id = await AsyncStorage.getItem(DEVICE_KEY);

// // //   if (!id) {
// // //     id =
// // //       Math.random().toString(36).slice(2, 12) +
// // //       Date.now().toString(36) +
// // //       Math.random().toString(36).slice(2, 8);

// // //     await AsyncStorage.setItem(DEVICE_KEY, id);
// // //     console.log("AUTH: created deviceId:", id);
// // //   }

// // //   return id;
// // // }

// // // /* --------------------------------------------------------------- */
// // // /* Save current player                                              */
// // // /* --------------------------------------------------------------- */

// // // async function savePlayer(player: CurrentPlayer): Promise<void> {
// // //   if (player?.id === undefined || player?.id === null) {
// // //     throw new Error("Backend did not return player ID.");
// // //   }

// // //   await AsyncStorage.setItem(PLAYER_ID_KEY, String(player.id));

// // //   if (player.name) {
// // //     await AsyncStorage.setItem(PLAYER_NAME_KEY, player.name);
// // //   }

// // //   setCurrentPlayer(player);

// // //   console.log("AUTH: saved playerId:", player.id);
// // //   console.log("AUTH: saved playerName:", player.name);
// // // }

// // // /* --------------------------------------------------------------- */
// // // /* Logged-out flag                                                  */
// // // /* --------------------------------------------------------------- */

// // // export async function isLoggedOut(): Promise<boolean> {
// // //   try {
// // //     return (await AsyncStorage.getItem(LOGGED_OUT_KEY)) === "1";
// // //   } catch {
// // //     return false;
// // //   }
// // // }

// // // /* --------------------------------------------------------------- */
// // // /* Ensure account (memory -> storage -> backend/DB)                 */
// // // /* --------------------------------------------------------------- */

// // // /*
// // //   Backend: POST /api/auth/device
// // //   Request : { deviceId: "xxxxx" }
// // //   Response: { success: true, player: { id: 2, name: "Suba" } }
// // // */

// // // export async function ensureAccount(): Promise<CurrentPlayer> {
// // //   // 1. Memory la irundha adhey use pannu
// // //   const existing = getCurrentPlayer();
// // //   if (existing?.id != null) {
// // //     return existing;
// // //   }

// // //   // NEW: user logout panniruntha auto-login panna koodadhu
// // //   if (await isLoggedOut()) {
// // //     throw new Error("Logged out. Please login again.");
// // //   }

// // //   // 2. Backend kitta deviceId anuppi account eduthuko / create pannu
// // //   const deviceId = await getDeviceId();
// // //   console.log("AUTH: ensureAccount deviceId:", deviceId);

// // //   const data = await post<{ player: CurrentPlayer }>("/auth/device", {
// // //     deviceId,
// // //   });

// // //   console.log("AUTH: device account:", JSON.stringify(data.player));

// // //   await savePlayer(data.player);

// // //   return data.player;
// // // }

// // // /* --------------------------------------------------------------- */
// // // /* Get current player ID (always resolves via ensureAccount)        */
// // // /* --------------------------------------------------------------- */

// // // export async function getCurrentPlayerId(): Promise<number> {
// // //   const player = await ensureAccount();
// // //   return Number(player.id);
// // // }

// // // /* --------------------------------------------------------------- */
// // // /* Get player headers                                               */
// // // /* --------------------------------------------------------------- */

// // // export async function getPlayerHeaders(): Promise<Record<string, string>> {
// // //   const player = await ensureAccount();

// // //   console.log("AUTH: playerId for request:", player.id);

// // //   return {
// // //     "Content-Type": "application/json",
// // //     "X-Player-Id": String(player.id),
// // //   };
// // // }

// // // /* --------------------------------------------------------------- */
// // // /* Name login (old flow, kept so nothing else breaks)               */
// // // /* --------------------------------------------------------------- */

// // // /*
// // //   Backend: POST /api/auth/enter
// // //   Request : { name: "Suba" }
// // //   Response: { success: true, player: { id: 2, name: "Suba" } }
// // // */

// // // export async function enterAccount(name: string): Promise<CurrentPlayer> {
// // //   const trimmedName = name.trim();

// // //   if (trimmedName.length < 1) {
// // //     throw new Error("Name is required.");
// // //   }

// // //   console.log("AUTH: entering account:", trimmedName);

// // //   const data = await post<{ player: CurrentPlayer }>("/auth/enter", {
// // //     name: trimmedName,
// // //   });

// // //   console.log("AUTH: login player:", JSON.stringify(data.player));

// // //   await savePlayer(data.player);

// // //   // NEW: login aachu, auto-login block ah remove pannu
// // //   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

// // //   return data.player;
// // // }

// // // /* --------------------------------------------------------------- */
// // // /* NEW: Login button                                                */
// // // /* --------------------------------------------------------------- */

// // // /*
// // //   Backend: POST /api/auth/login
// // //   Request : { deviceId }
// // //   Response: { success: true, player: { id, name, type: "user" } }
// // // */

// // // export async function loginAccount(): Promise<CurrentPlayer> {
// // //   const deviceId = await getDeviceId();

// // //   const data = await post<{ player: CurrentPlayer }>("/auth/login", {
// // //     deviceId,
// // //   });

// // //   await savePlayer(data.player);
// // //   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

// // //   return data.player;
// // // }

// // // /* --------------------------------------------------------------- */
// // // /* NEW: Play as Guest button                                        */
// // // /* --------------------------------------------------------------- */

// // // /*
// // //   Backend: POST /api/auth/guest
// // //   Request : { deviceId }
// // //   Response: { success: true, player: { id, name, type: "guest" } }
// // // */

// // // // export async function guestAccount(): Promise<CurrentPlayer> {
// // // //   const deviceId = await getDeviceId();

// // // //   const data = await post<{ player: CurrentPlayer }>("/auth/guest", {
// // // //     deviceId,
// // // //   });

// // // //   await savePlayer(data.player);
// // // //   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

// // // //   return data.player;
// // // // }
// // // export async function guestAccount(nickname: string) {
// // //   const deviceId = await getDeviceId(); // un existing deviceId logic inga use pannu

// // //   const res = await fetch(`${BASE_URL}/api/auth/guest`, {
// // //     method: "POST",
// // //     headers: { "Content-Type": "application/json" },
// // //     body: JSON.stringify({ deviceId, nickname }),
// // //   });

// // //   const data = await res.json();

// // //   if (!res.ok || !data.success) {
// // //     throw new Error(data.message || "Guest login failed");
// // //   }

// // //   return data.player;
// // // }
// // // /* --------------------------------------------------------------- */
// // // /* NEW: Create account / Login form (username, dob, gender, phone)  */
// // // /* --------------------------------------------------------------- */

// // // /*
// // //   Backend: POST /api/auth/register
// // //   Request : { deviceId, username, dob: "YYYY-MM-DD", gender, phone: "+91XXXXXXXXXX" }
// // //   Response: { success: true, player: { id, name, type: "user" } }
// // // */

// // // export type RegisterInput = {
// // //   username: string;
// // //   dob: string;
// // //   gender: "Male" | "Female" | "Other";
// // //   phone: string;
// // // };

// // // export async function registerAccount(
// // //   input: RegisterInput
// // // ): Promise<CurrentPlayer> {
// // //   const deviceId = await getDeviceId();

// // //   const data = await post<{ player: CurrentPlayer }>("/auth/register", {
// // //     deviceId,
// // //     ...input,
// // //   });

// // //   await savePlayer(data.player);
// // //   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

// // //   return data.player;
// // // }

// // // /* --------------------------------------------------------------- */
// // // /* Logout                                                           */
// // // /* --------------------------------------------------------------- */

// // // /*
// // //   Frontend -> POST /api/auth/logout { playerId }
// // //   Backend  -> UPDATE player SET last_logout = NOW()
// // //   Backend  -> { success: true } JSON
// // //   Frontend -> clears local data + sets logged-out flag
// // // */

// // // export async function logoutAccount(): Promise<void> {
// // //   const player = getCurrentPlayer();

// // //   // 1. Backend ku sollu (network illana kooda local logout work aaganum)
// // //   if (player?.id != null) {
// // //     try {
// // //       await post("/auth/logout", { playerId: player.id });
// // //     } catch (e) {
// // //       console.warn("AUTH: backend logout failed:", e);
// // //     }
// // //   }

// // //   // 2. Local clear + auto-login block
// // //   clearCurrentPlayer();

// // //   await AsyncStorage.removeItem(PLAYER_ID_KEY);
// // //   await AsyncStorage.removeItem(PLAYER_NAME_KEY);
// // //   await AsyncStorage.setItem(LOGGED_OUT_KEY, "1");

// // //   console.log("AUTH: logged out and playerId removed");
// // // }
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { API_BASE_URL } from "./api";

// // import {
// //   CurrentPlayer,
// //   setCurrentPlayer,
// //   clearCurrentPlayer,
// //   getCurrentPlayer,
// // } from "./currentPlayer";

// // const DEVICE_KEY = "cyber-mind-device-id";
// // const PLAYER_ID_KEY = "cyber-mind-player-id";
// // const PLAYER_NAME_KEY = "cyber-mind-player-name";
// // // NEW: set to "1" after logout so the app never auto-logs-in again
// // const LOGGED_OUT_KEY = "cyber-mind-logged-out";

// // /* --------------------------------------------------------------- */
// // /* Generic POST helper                                              */
// // /* --------------------------------------------------------------- */

// // async function post<T>(path: string, body: object): Promise<T> {
// //   console.log("AUTH POST:", `${API_BASE_URL}${path}`);
// //   console.log("AUTH BODY:", JSON.stringify(body));

// //   const res = await fetch(`${API_BASE_URL}${path}`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify(body),
// //   });

// //   const data = await res.json().catch(() => ({}));

// //   console.log("AUTH RESPONSE:", JSON.stringify(data));

// //   if (!res.ok || !(data as any)?.success) {
// //     throw new Error(
// //       (data as any)?.error ||
// //         (data as any)?.message ||
// //         `Request failed (${res.status})`
// //     );
// //   }

// //   return data as T;
// // }

// // /* --------------------------------------------------------------- */
// // /* Device ID (only this is stored locally)                          */
// // /* --------------------------------------------------------------- */

// // async function getDeviceId(): Promise<string> {
// //   let id = await AsyncStorage.getItem(DEVICE_KEY);

// //   if (!id) {
// //     id =
// //       Math.random().toString(36).slice(2, 12) +
// //       Date.now().toString(36) +
// //       Math.random().toString(36).slice(2, 8);

// //     await AsyncStorage.setItem(DEVICE_KEY, id);
// //     console.log("AUTH: created deviceId:", id);
// //   }

// //   return id;
// // }

// // /* --------------------------------------------------------------- */
// // /* Save current player                                              */
// // /* --------------------------------------------------------------- */

// // async function savePlayer(player: CurrentPlayer): Promise<void> {
// //   if (player?.id === undefined || player?.id === null) {
// //     throw new Error("Backend did not return player ID.");
// //   }

// //   await AsyncStorage.setItem(PLAYER_ID_KEY, String(player.id));

// //   if (player.name) {
// //     await AsyncStorage.setItem(PLAYER_NAME_KEY, player.name);
// //   }

// //   setCurrentPlayer(player);

// //   console.log("AUTH: saved playerId:", player.id);
// //   console.log("AUTH: saved playerName:", player.name);
// // }

// // /* --------------------------------------------------------------- */
// // /* Logged-out flag                                                  */
// // /* --------------------------------------------------------------- */

// // export async function isLoggedOut(): Promise<boolean> {
// //   try {
// //     return (await AsyncStorage.getItem(LOGGED_OUT_KEY)) === "1";
// //   } catch {
// //     return false;
// //   }
// // }

// // /* --------------------------------------------------------------- */
// // /* Ensure account (memory -> storage -> backend/DB)                 */
// // /* --------------------------------------------------------------- */

// // /*
// //   Backend: POST /api/auth/device
// //   Request : { deviceId: "xxxxx" }
// //   Response: { success: true, player: { id: 2, name: "Suba" } }
// // */

// // export async function ensureAccount(): Promise<CurrentPlayer> {
// //   // 1. Memory la irundha adhey use pannu
// //   const existing = getCurrentPlayer();
// //   if (existing?.id != null) {
// //     return existing;
// //   }

// //   // NEW: user logout panniruntha auto-login panna koodadhu
// //   if (await isLoggedOut()) {
// //     throw new Error("Logged out. Please login again.");
// //   }

// //   // 2. Backend kitta deviceId anuppi account eduthuko / create pannu
// //   const deviceId = await getDeviceId();
// //   console.log("AUTH: ensureAccount deviceId:", deviceId);

// //   const data = await post<{ player: CurrentPlayer }>("/auth/device", {
// //     deviceId,
// //   });

// //   console.log("AUTH: device account:", JSON.stringify(data.player));

// //   await savePlayer(data.player);

// //   return data.player;
// // }

// // /* --------------------------------------------------------------- */
// // /* Get current player ID (always resolves via ensureAccount)        */
// // /* --------------------------------------------------------------- */

// // export async function getCurrentPlayerId(): Promise<number> {
// //   const player = await ensureAccount();
// //   return Number(player.id);
// // }

// // /* --------------------------------------------------------------- */
// // /* Get player headers                                               */
// // /* --------------------------------------------------------------- */

// // export async function getPlayerHeaders(): Promise<Record<string, string>> {
// //   const player = await ensureAccount();

// //   console.log("AUTH: playerId for request:", player.id);

// //   return {
// //     "Content-Type": "application/json",
// //     "X-Player-Id": String(player.id),
// //   };
// // }

// // /* --------------------------------------------------------------- */
// // /* Name login (old flow, kept so nothing else breaks)               */
// // /* --------------------------------------------------------------- */

// // /*
// //   Backend: POST /api/auth/enter
// //   Request : { name: "Suba" }
// //   Response: { success: true, player: { id: 2, name: "Suba" } }
// // */

// // export async function enterAccount(name: string): Promise<CurrentPlayer> {
// //   const trimmedName = name.trim();

// //   if (trimmedName.length < 1) {
// //     throw new Error("Name is required.");
// //   }

// //   console.log("AUTH: entering account:", trimmedName);

// //   const data = await post<{ player: CurrentPlayer }>("/auth/enter", {
// //     name: trimmedName,
// //   });

// //   console.log("AUTH: login player:", JSON.stringify(data.player));

// //   await savePlayer(data.player);

// //   // NEW: login aachu, auto-login block ah remove pannu
// //   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

// //   return data.player;
// // }

// // /* --------------------------------------------------------------- */
// // /* NEW: Login button                                                */
// // /* --------------------------------------------------------------- */

// // /*
// //   Backend: POST /api/auth/login
// //   Request : { deviceId }
// //   Response: { success: true, player: { id, name, type: "user" } }
// // */

// // export async function loginAccount(): Promise<CurrentPlayer> {
// //   const deviceId = await getDeviceId();

// //   const data = await post<{ player: CurrentPlayer }>("/auth/login", {
// //     deviceId,
// //   });

// //   await savePlayer(data.player);
// //   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

// //   return data.player;
// // }

// // /* --------------------------------------------------------------- */
// // /* NEW: Play as Guest button (with nickname)                        */
// // /* --------------------------------------------------------------- */

// // /*
// //   Backend: POST /api/auth/guest
// //   Request : { deviceId, nickname }
// //   Response: { success: true, player: { id, name, type: "guest" } }
// // */

// // export async function guestAccount(nickname: string): Promise<CurrentPlayer> {
// //   const deviceId = await getDeviceId();

// //   const data = await post<{ player: CurrentPlayer }>("/auth/guest", {
// //     deviceId,
// //     nickname,
// //   });

// //   await savePlayer(data.player);
// //   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

// //   return data.player;
// // }

// // /* --------------------------------------------------------------- */
// // /* NEW: Create account / Login form (username, dob, gender, phone)  */
// // /* --------------------------------------------------------------- */

// // /*
// //   Backend: POST /api/auth/register
// //   Request : { deviceId, username, dob: "YYYY-MM-DD", gender, phone: "+91XXXXXXXXXX" }
// //   Response: { success: true, player: { id, name, type: "user" } }
// // */

// // export type RegisterInput = {
// //   username: string;
// //   dob: string;
// //   gender: "Male" | "Female" | "Other";
// //   phone: string;
// // };

// // export async function registerAccount(
// //   input: RegisterInput
// // ): Promise<CurrentPlayer> {
// //   const deviceId = await getDeviceId();

// //   const data = await post<{ player: CurrentPlayer }>("/auth/register", {
// //     deviceId,
// //     ...input,
// //   });

// //   await savePlayer(data.player);
// //   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

// //   return data.player;
// // }

// // /* --------------------------------------------------------------- */
// // /* Logout                                                           */
// // /* --------------------------------------------------------------- */

// // /*
// //   Frontend -> POST /api/auth/logout { playerId }
// //   Backend  -> UPDATE player SET last_logout = NOW()
// //   Backend  -> { success: true } JSON
// //   Frontend -> clears local data + sets logged-out flag
// // */

// // export async function logoutAccount(): Promise<void> {
// //   const player = getCurrentPlayer();

// //   // 1. Backend ku sollu (network illana kooda local logout work aaganum)
// //   if (player?.id != null) {
// //     try {
// //       await post("/auth/logout", { playerId: player.id });
// //     } catch (e) {
// //       console.warn("AUTH: backend logout failed:", e);
// //     }
// //   }

// //   // 2. Local clear + auto-login block
// //   clearCurrentPlayer();

// //   await AsyncStorage.removeItem(PLAYER_ID_KEY);
// //   await AsyncStorage.removeItem(PLAYER_NAME_KEY);
// //   await AsyncStorage.setItem(LOGGED_OUT_KEY,"1");

// //   console.log("AUTH: logged out and playerId removed");
// // }
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_BASE_URL } from "./api";

// import {
//   CurrentPlayer,
//   setCurrentPlayer,
//   clearCurrentPlayer,
//   getCurrentPlayer,
// } from "./currentPlayer";

// const DEVICE_KEY = "cyber-mind-device-id";
// const PLAYER_ID_KEY = "cyber-mind-player-id";
// const PLAYER_NAME_KEY = "cyber-mind-player-name";
// // NEW: full player (id, name, type) saved as JSON so any account can be restored
// const PLAYER_JSON_KEY = "cyber-mind-player";
// // set to "1" after logout so the app never auto-logs-in again
// const LOGGED_OUT_KEY = "cyber-mind-logged-out";

// /* --------------------------------------------------------------- */
// /* Generic POST helper                                              */
// /* --------------------------------------------------------------- */

// async function post<T>(path: string, body: object): Promise<T> {
//   console.log("AUTH POST:", `${API_BASE_URL}${path}`);
//   console.log("AUTH BODY:", JSON.stringify(body));

//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });

//   const data = await res.json().catch(() => ({}));

//   console.log("AUTH RESPONSE:", JSON.stringify(data));

//   if (!res.ok || !(data as any)?.success) {
//     throw new Error(
//       (data as any)?.error ||
//         (data as any)?.message ||
//         `Request failed (${res.status})`
//     );
//   }

//   return data as T;
// }

// /* --------------------------------------------------------------- */
// /* Device ID (only this is stored locally)                          */
// /* --------------------------------------------------------------- */

// async function getDeviceId(): Promise<string> {
//   let id = await AsyncStorage.getItem(DEVICE_KEY);

//   if (!id) {
//     id =
//       Math.random().toString(36).slice(2, 12) +
//       Date.now().toString(36) +
//       Math.random().toString(36).slice(2, 8);

//     await AsyncStorage.setItem(DEVICE_KEY, id);
//     console.log("AUTH: created deviceId:", id);
//   }

//   return id;
// }

// /* --------------------------------------------------------------- */
// /* Save current player                                              */
// /* --------------------------------------------------------------- */

// async function savePlayer(player: CurrentPlayer): Promise<void> {
//   if (player?.id === undefined || player?.id === null) {
//     throw new Error("Backend did not return player ID.");
//   }

//   await AsyncStorage.setItem(PLAYER_ID_KEY, String(player.id));

//   if (player.name) {
//     await AsyncStorage.setItem(PLAYER_NAME_KEY, player.name);
//   }

//   // NEW: whole player object (guest / user, any account)
//   await AsyncStorage.setItem(PLAYER_JSON_KEY, JSON.stringify(player));

//   setCurrentPlayer(player);

//   console.log("AUTH: saved playerId:", player.id);
//   console.log("AUTH: saved playerName:", player.name);
// }

// /* --------------------------------------------------------------- */
// /* NEW: Restore last logged-in player from local storage            */
// /* --------------------------------------------------------------- */

// async function restoreSavedPlayer(): Promise<CurrentPlayer | null> {
//   try {
//     const json = await AsyncStorage.getItem(PLAYER_JSON_KEY);

//     if (json) {
//       const parsed = JSON.parse(json);
//       if (parsed?.id != null) return parsed as CurrentPlayer;
//     }

//     // fallback for old installs (only id + name were saved)
//     const id = await AsyncStorage.getItem(PLAYER_ID_KEY);
//     const name = await AsyncStorage.getItem(PLAYER_NAME_KEY);

//     if (id) {
//       return { id: Number(id), name: name || "" } as unknown as CurrentPlayer;
//     }
//   } catch (e) {
//     console.warn("AUTH: restore failed:", e);
//   }

//   return null;
// }

// /* --------------------------------------------------------------- */
// /* Logged-out flag                                                  */
// /* --------------------------------------------------------------- */

// export async function isLoggedOut(): Promise<boolean> {
//   try {
//     return (await AsyncStorage.getItem(LOGGED_OUT_KEY)) === "1";
//   } catch {
//     return false;
//   }
// }

// /* --------------------------------------------------------------- */
// /* Ensure account (memory -> storage -> backend/DB)                 */
// /* --------------------------------------------------------------- */

// /*
//   Order:
//   1. memory (current player)
//   2. local storage (last logged-in account: guest / user / register)
//   3. backend POST /api/auth/device  (only when nothing is saved)
// */

// export async function ensureAccount(): Promise<CurrentPlayer> {
//   // 1. Memory la irundha adhey use pannu
//   const existing = getCurrentPlayer();
//   if (existing?.id != null) {
//     return existing;
//   }

//   // user logout panniruntha auto-login panna koodadhu
//   if (await isLoggedOut()) {
//     throw new Error("Logged out. Please login again.");
//   }

//   // 2. Local storage la last login panna player irundha restore pannu
//   const saved = await restoreSavedPlayer();
//   if (saved?.id != null) {
//     setCurrentPlayer(saved);
//     console.log("AUTH: restored player:", JSON.stringify(saved));
//     return saved;
//   }

//   // 3. Onnume illa -> backend kitta deviceId anuppi account eduthuko / create pannu
//   const deviceId = await getDeviceId();
//   console.log("AUTH: ensureAccount deviceId:", deviceId);

//   const data = await post<{ player: CurrentPlayer }>("/auth/device", {
//     deviceId,
//   });

//   console.log("AUTH: device account:", JSON.stringify(data.player));

//   await savePlayer(data.player);

//   return data.player;
// }

// /* --------------------------------------------------------------- */
// /* Get current player ID (always resolves via ensureAccount)        */
// /* --------------------------------------------------------------- */

// export async function getCurrentPlayerId(): Promise<number> {
//   const player = await ensureAccount();
//   return Number(player.id);
// }

// /* --------------------------------------------------------------- */
// /* Get player headers                                               */
// /* --------------------------------------------------------------- */

// export async function getPlayerHeaders(): Promise<Record<string, string>> {
//   const player = await ensureAccount();

//   console.log("AUTH: playerId for request:", player.id);

//   return {
//     "Content-Type": "application/json",
//     "X-Player-Id": String(player.id),
//   };
// }

// /* --------------------------------------------------------------- */
// /* Name login (old flow, kept so nothing else breaks)               */
// /* --------------------------------------------------------------- */

// export async function enterAccount(name: string): Promise<CurrentPlayer> {
//   const trimmedName = name.trim();

//   if (trimmedName.length < 1) {
//     throw new Error("Name is required.");
//   }

//   console.log("AUTH: entering account:", trimmedName);

//   const data = await post<{ player: CurrentPlayer }>("/auth/enter", {
//     name: trimmedName,
//   });

//   console.log("AUTH: login player:", JSON.stringify(data.player));

//   await savePlayer(data.player);
//   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

//   return data.player;
// }

// /* --------------------------------------------------------------- */
// /* Login button                                                     */
// /* --------------------------------------------------------------- */

// export async function loginAccount(): Promise<CurrentPlayer> {
//   const deviceId = await getDeviceId();

//   const data = await post<{ player: CurrentPlayer }>("/auth/login", {
//     deviceId,
//   });

//   await savePlayer(data.player);
//   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

//   return data.player;
// }

// /* --------------------------------------------------------------- */
// /* Play as Guest button (with nickname)                             */
// /* --------------------------------------------------------------- */

// export async function guestAccount(nickname: string): Promise<CurrentPlayer> {
//   const deviceId = await getDeviceId();

//   const data = await post<{ player: CurrentPlayer }>("/auth/guest", {
//     deviceId,
//     nickname,
//   });

//   await savePlayer(data.player);
//   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

//   return data.player;
// }

// /* --------------------------------------------------------------- */
// /* Create account / Login form (username, dob, gender, phone)       */
// /* --------------------------------------------------------------- */

// export type RegisterInput = {
//   username: string;
//   dob: string;
//   gender: "Male" | "Female" | "Other";
//   phone: string;
// };

// export async function registerAccount(
//   input: RegisterInput
// ): Promise<CurrentPlayer> {
//   const deviceId = await getDeviceId();

//   const data = await post<{ player: CurrentPlayer }>("/auth/register", {
//     deviceId,
//     ...input,
//   });

//   await savePlayer(data.player);
//   await AsyncStorage.removeItem(LOGGED_OUT_KEY);

//   return data.player;
// }

// /* --------------------------------------------------------------- */
// /* Logout                                                           */
// /* --------------------------------------------------------------- */

// export async function logoutAccount(): Promise<void> {
//   const player = getCurrentPlayer();

//   // 1. Backend ku sollu (network illana kooda local logout work aaganum)
//   if (player?.id != null) {
//     try {
//       await post("/auth/logout", { playerId: player.id });
//     } catch (e) {
//       console.warn("AUTH: backend logout failed:", e);
//     }
//   }

//   // 2. Local clear + auto-login block
//   clearCurrentPlayer();

//   await AsyncStorage.removeItem(PLAYER_ID_KEY);
//   await AsyncStorage.removeItem(PLAYER_NAME_KEY);
//   await AsyncStorage.removeItem(PLAYER_JSON_KEY);
//   await AsyncStorage.setItem(LOGGED_OUT_KEY, "1");

//   console.log("AUTH: logged out and playerId removed");
// }
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

/* --------------------------------------------------------------- */
/* Device ID (only this is stored locally)                          */
/* --------------------------------------------------------------- */

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

/* --------------------------------------------------------------- */
/* Save current player                                              */
/* --------------------------------------------------------------- */

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

/* --------------------------------------------------------------- */
/* Mark a player as logged in (called by App.tsx after any login)   */
/* Saves the player in memory + storage and clears the logged-out   */
/* flag, so Profile and other APIs never see a "logged out" state.  */
/* --------------------------------------------------------------- */

export async function markLoggedIn(player: CurrentPlayer): Promise<void> {
  await savePlayer(player);
  await AsyncStorage.removeItem(LOGGED_OUT_KEY);
}

/* --------------------------------------------------------------- */
/* Ensure account (memory -> storage -> backend/DB)                 */
/* --------------------------------------------------------------- */

/*
  Order:
  1. memory (current player)
  2. local storage (last logged-in account: guest / user / register)
  3. backend POST /api/auth/device  (only when nothing is saved)
*/

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

/* --------------------------------------------------------------- */
/* Name login (old flow, kept so nothing else breaks)               */
/* --------------------------------------------------------------- */

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

/* --------------------------------------------------------------- */
/* Login button                                                     */
/* --------------------------------------------------------------- */

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

/* --------------------------------------------------------------- */
/* Create account / Login form (username, dob, gender, phone)       */
/* --------------------------------------------------------------- */

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