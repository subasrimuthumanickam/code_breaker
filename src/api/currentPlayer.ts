// // /**
// //  * Holds the id of the player (account) that is logged in right now.
// //  * Call setCurrentPlayerId(...) after a successful login and
// //  * clearCurrentPlayerId() on logout.
// //  *
// //  * On web the id is also kept in localStorage so a page refresh keeps it.
// //  */
// // const STORAGE_KEY = "current_player_id";

// // function readStored(): number | null {
// //   try {
// //     if (typeof localStorage === "undefined") return null;
// //     const raw = localStorage.getItem(STORAGE_KEY);
// //     const n = Number(raw);
// //     return Number.isInteger(n) && n > 0 ? n : null;
// //   } catch {
// //     return null;
// //   }
// // }

// // let currentPlayerId: number | null = readStored();

// // export function setCurrentPlayerId(id: number | string | null | undefined) {
// //   const n = Number(id);
// //   currentPlayerId = Number.isInteger(n) && n > 0 ? n : null;
// //   try {
// //     if (typeof localStorage !== "undefined") {
// //       if (currentPlayerId === null) localStorage.removeItem(STORAGE_KEY);
// //       else localStorage.setItem(STORAGE_KEY, String(currentPlayerId));
// //     }
// //   } catch {
// //     // ignore storage errors
// //   }
// // }

// // export function getCurrentPlayerId(): number | null {
// //   return currentPlayerId;
// // }

// // export function clearCurrentPlayerId() {
// //   setCurrentPlayerId(null);
// // }

// // /** Adds ?playerId=<current> (or &playerId=) to a path / url. */
// // export function withPlayer(path: string): string {
// //   if (currentPlayerId === null) return path;
// //   return `${path}${path.includes("?") ? "&" : "?"}playerId=${currentPlayerId}`;
// // }
// /*
//   Holds the logged-in account in MEMORY only (no localStorage).
//   LoginScreen calls setCurrentPlayer(...) after a successful login.
//   Logout calls clearCurrentPlayer().
//   Every API file uses getCurrentPlayerId() / withPlayer() to send the id.
// */

// export interface CurrentPlayer {
//   id: number;
//   username: string;
//   name: string;
// }

// let current: CurrentPlayer | null = null;

// export const setCurrentPlayer = (p: CurrentPlayer) => {
//   current = p;
// };

// export const clearCurrentPlayer = () => {
//   current = null;
// };

// export const getCurrentPlayer = (): CurrentPlayer | null => current;

// export const getCurrentPlayerId = (): number | null =>
//   current ? current.id : null;

// /* "/player" -> "/player?playerId=2"  |  "/x?a=1" -> "/x?a=1&playerId=2" */
// export const withPlayer = (path: string): string => {
//   const id = getCurrentPlayerId();
//   if (id == null) return path;
//   const sep = path.includes("?") ? "&" : "?";
//   return `${path}${sep}playerId=${id}`;
// };
/*
  Holds the logged-in account in MEMORY only (no localStorage).
  LoginScreen calls setCurrentPlayer(...) after a successful login.
  Logout calls clearCurrentPlayer().
  Every API file uses getCurrentPlayerId() / withPlayer() to send the id.
*/

export interface CurrentPlayer {
  id: number;
  username: string;
  name: string;
}

let current: CurrentPlayer | null = null;

export const setCurrentPlayer = (p: CurrentPlayer) => {
  current = p;
};

export const clearCurrentPlayer = () => {
  current = null;
};

export const getCurrentPlayer = (): CurrentPlayer | null => current;

export const getCurrentPlayerId = (): number | null =>
  current ? current.id : null;

/* "/player" -> "/player?playerId=2"  |  "/x?a=1" -> "/x?a=1&playerId=2" */
export const withPlayer = (path: string): string => {
  const id = getCurrentPlayerId();
  if (id == null) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}playerId=${id}`;
};