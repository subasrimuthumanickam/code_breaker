// // // import { API_BASE_URL } from "./api";
// // // import { getDeviceId } from "../utils/deviceId";

// // // /**
// // //  * All Word Scramble endpoints live under this prefix.
// // //  * ⚠️ If your existing Wordscrambleapi.ts uses a different prefix
// // //  * (e.g. `${API_BASE_URL}/ws` or `${API_BASE_URL}/word-scramble`), change it here to match.
// // //  */
// // // const WS_BASE = `${API_BASE_URL}/word-scramble`;

// // // export interface WsProfile {
// // //   id: number | string;
// // //   name: string;
// // //   avatarColor?: string | null;
// // //   gamesPlayed?: number;
// // //   wins?: number;
// // //   rank?: number | null;
// // // }

// // // async function request<T>(url: string, init?: RequestInit): Promise<T> {
// // //   const res = await fetch(url, {
// // //     headers: { "Content-Type": "application/json" },
// // //     ...init,
// // //   });
// // //   const body = await res.json().catch(() => ({}));
// // //   if (!res.ok) {
// // //     throw new Error((body as any).error || `Request failed (${res.status})`);
// // //   }
// // //   return body as T;
// // // }

// // // /**
// // //  * GET /word-scramble/players/:deviceId
// // //  * Backend should create the player row on first call (upsert by deviceId)
// // //  * and return it, so the frontend never invents a name.
// // //  */
// // // export async function fetchProfile(): Promise<WsProfile> {
// // //   const deviceId = await getDeviceId();
// // //   return request<WsProfile>(`${WS_BASE}/players/${encodeURIComponent(deviceId)}`);
// // // }

// // // /** PUT /word-scramble/players/:deviceId   body: { name } */
// // // export async function updateProfileName(name: string): Promise<WsProfile> {
// // //   const deviceId = await getDeviceId();
// // //   return request<WsProfile>(`${WS_BASE}/players/${encodeURIComponent(deviceId)}`, {
// // //     method: "PUT",
// // //     body: JSON.stringify({ name }),
// // //   });
// // // }

// // // /** POST /word-scramble/rooms/:code/ready   body: { playerName, ready } → updated room */
// // // export async function setReady(roomCode: string, playerName: string, ready: boolean) {
// // //   return request<any>(`${WS_BASE}/rooms/${encodeURIComponent(roomCode)}/ready`, {
// // //     method: "POST",
// // //     body: JSON.stringify({ playerName, ready }),
// // //   });
// // // }

// // // /** POST /word-scramble/rooms/:code/leave   body: { playerName } */
// // // export async function leaveRoom(roomCode: string, playerName: string) {
// // //   return request<any>(`${WS_BASE}/rooms/${encodeURIComponent(roomCode)}/leave`, {
// // //     method: "POST",
// // //     body: JSON.stringify({ playerName }),
// // //   });
// // // }
// // import { API_BASE_URL } from "./api";
// // import { getDeviceId } from "../utils/deviceId";

// // /**
// //  * Backend mounts the Word Scramble router at  /api/wordscramble
// //  * (see server.js:  app.use("/api/wordscramble", wordScrambleRoutes)).
// //  * API_BASE_URL is the same base the Code Breaker calls use (…/api).
// //  */
// // const WS_BASE = `${API_BASE_URL}/wordscramble`;

// // export interface WsProfile {
// //   id: number | string;
// //   name: string;
// //   avatarColor?: string | null;
// //   gamesPlayed?: number;
// //   wins?: number;
// //   totalScore?: number;
// //   rank?: number | null;
// // }

// // async function request<T = any>(url: string, init?: RequestInit): Promise<T> {
// //   const res = await fetch(url, {
// //     headers: { "Content-Type": "application/json" },
// //     ...init,
// //   });
// //   const body = await res.json().catch(() => ({}));
// //   if (!res.ok) {
// //     throw new Error((body as any).error || `Request failed (${res.status})`);
// //   }
// //   return body as T;
// // }

// // /**
// //  * GET /wordscramble/players/:deviceId
// //  * The backend creates the profile on first call (generated name + colour)
// //  * and returns { success, profile }.
// //  */
// // export async function fetchProfile(): Promise<WsProfile> {
// //   const deviceId = await getDeviceId();
// //   const data = await request<{ profile: WsProfile }>(`${WS_BASE}/players/${encodeURIComponent(deviceId)}`);
// //   return data.profile;
// // }

// // /** PUT /wordscramble/players/:deviceId   body: { name } */
// // export async function updateProfileName(name: string): Promise<WsProfile> {
// //   const deviceId = await getDeviceId();
// //   const data = await request<{ profile: WsProfile }>(`${WS_BASE}/players/${encodeURIComponent(deviceId)}`, {
// //     method: "PUT",
// //     body: JSON.stringify({ name }),
// //   });
// //   return data.profile;
// // }

// // /** POST /wordscramble/rooms/:code/ready   body: { playerName, ready } */
// // export async function setReady(roomCode: string, playerName: string, ready: boolean) {
// //   const data = await request<{ room: any }>(`${WS_BASE}/rooms/${encodeURIComponent(roomCode)}/ready`, {
// //     method: "POST",
// //     body: JSON.stringify({ playerName, ready }),
// //   });
// //   return data.room;
// // }

// // /** POST /wordscramble/rooms/:code/leave   body: { playerName } */
// // export async function leaveRoom(roomCode: string, playerName: string) {
// //   const data = await request<{ room: any }>(`${WS_BASE}/rooms/${encodeURIComponent(roomCode)}/leave`, {
// //     method: "POST",
// //     body: JSON.stringify({ playerName }),
// //   });
// //   return data.room;
// // }
// import { API_BASE_URL } from "./api";
// import { getDeviceId } from "../utils/deviceId";
// import { getCurrentPlayer } from "./currentPlayer";
// /**
//  * Backend mounts the Word Scramble router at  /api/wordscramble
//  * (see server.js:  app.use("/api/wordscramble", wordScrambleRoutes)).
//  * API_BASE_URL is the same base the Code Breaker calls use (…/api).
//  */
// const WS_BASE = `${API_BASE_URL}/wordscramble`;

// export interface WsProfile {
//   id: number | string;
//   name: string;
//   avatarColor?: string | null;
//   gamesPlayed?: number;
//   wins?: number;
//   totalScore?: number;
//   rank?: number | null;
// }

// async function request<T = any>(url: string, init?: RequestInit): Promise<T> {
//   const res = await fetch(url, {
//     headers: { "Content-Type": "application/json" },
//     ...init,
//   });
//   const body = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     throw new Error((body as any).error || `Request failed (${res.status})`);
//   }
//   return body as T;
// }

// /**
//  * Reads the MAIN app profile (the name set on the menu Profile screen)
//  * straight from GET /api/player, so this file doesn't depend on any other
//  * service file.
//  *
//  * Backend response is { success, data: { player: { id, name }, level, xp, ... } }
//  * (also tolerates a flat { name, id } shape).
//  */
// // async function getMainPlayer(): Promise<{ id?: number | string; name?: string }> {
// //   const raw = await request<any>(`${API_BASE_URL}/player`);
// //   console.log("WS main /player raw response:", JSON.stringify(raw));
// //   const profile = raw?.data ?? raw;
// //   const player = profile?.player ?? profile;
// //   return {
// //     id: player?.id ?? profile?.id,
// //     name: typeof player?.name === "string" ? player.name : undefined,
// //   };
// // }
// // async function getMainPlayer(): Promise<{
// //   id?: number | string;
// //   name?: string;
// // }> {
// //   console.log("WS: getMainPlayer CALLED");

// //   // Get logged-in player's ID
// //   const playerId = await getCurrentPlayerId();

// //   console.log(
// //     "WS: current playerId:",
// //     playerId
// //   );

// //   if (!playerId) {
// //     throw new Error(
// //       "Not logged in. playerId is missing."
// //     );
// //   }

// //   // IMPORTANT:
// //   // Send playerId to backend
// //   const url =
// //     `${API_BASE_URL}/player?playerId=${encodeURIComponent(
// //       String(playerId)
// //     )}`;

// //   console.log(
// //     "WS: GET player URL:",
// //     url
// //   );

// //   const raw =
// //     await request<any>(url);

// //   console.log(
// //     "WS: backend player response:",
// //     JSON.stringify(raw)
// //   );

// //   const profile =
// //     raw?.data ?? raw;

// //   const player =
// //     profile?.player ?? profile;

// //   return {
// //     id:
// //       player?.id ??
// //       profile?.id,

// //     name:
// //       typeof player?.name === "string"
// //         ? player.name
// //         : undefined,
// //   };
// // }
// async function getMainPlayer(): Promise<{
//   id?: number | string;
//   name?: string;
// }> {
//   console.log("WS: getMainPlayer CALLED");

//   const currentPlayer = getCurrentPlayer();

//   console.log(
//     "WS: currentPlayer:",
//     JSON.stringify(currentPlayer)
//   );

//   if (!currentPlayer?.id) {
//     throw new Error("Current player ID is missing.");
//   }

//   const playerId = String(currentPlayer.id);

//   console.log(
//     "WS: requesting playerId:",
//     playerId
//   );

//   const url =
//     `${API_BASE_URL}/player?playerId=${encodeURIComponent(
//       playerId
//     )}`;

//   console.log(
//     "WS: GET:",
//     url
//   );

//   const raw = await request<any>(url);

//   console.log(
//     "WS: player response:",
//     JSON.stringify(raw)
//   );

//   const profile = raw?.data ?? raw;

//   const player = profile?.player ?? profile;

//   return {
//     id: player?.id ?? profile?.id,
//     name:
//       typeof player?.name === "string"
//         ? player.name
//         : undefined,
//   };
// }
// /**
//  * GET /wordscramble/players/:deviceId?name=<main app name>&playerId=<main app id>
//  * Uses the name from the main app profile (e.g. "vimal"). If the main profile
//  * can't be loaded, the backend falls back to a generated name.
//  */
// export async function fetchProfile(): Promise<WsProfile> {
//   console.log("WS fetchProfile CALLED");

//   const deviceId = await getDeviceId();

//   let query = "";
//   try {
//     const main = await getMainPlayer();
//     const params = new URLSearchParams();
//     if (main.name) params.set("name", main.name);
//     if (main.id !== undefined && main.id !== null) params.set("playerId", String(main.id));
//     const qs = params.toString();
//     query = qs ? `?${qs}` : "";
//   } catch (err) {
//     console.warn("WS getMainPlayer FAILED:", err);
//     // main profile unavailable -> backend will use fallback name
//   }

//   console.log("WS fetchProfile query:", query);

//   const data = await request<{ profile: WsProfile }>(
//     `${WS_BASE}/players/${encodeURIComponent(deviceId)}${query}`
//   );

//   console.log("WS fetchProfile result name:", data.profile?.name);
//   return data.profile;
// }

// /** PUT /wordscramble/players/:deviceId   body: { name } */
// export async function updateProfileName(name: string): Promise<WsProfile> {
//   const deviceId = await getDeviceId();
//   const data = await request<{ profile: WsProfile }>(`${WS_BASE}/players/${encodeURIComponent(deviceId)}`, {
//     method: "PUT",
//     body: JSON.stringify({ name }),
//   });
//   return data.profile;
// }

// /** POST /wordscramble/rooms/:code/ready   body: { playerName, ready } */
// export async function setReady(roomCode: string, playerName: string, ready: boolean) {
//   const data = await request<{ room: any }>(`${WS_BASE}/rooms/${encodeURIComponent(roomCode)}/ready`, {
//     method: "POST",
//     body: JSON.stringify({ playerName, ready }),
//   });
//   return data.room;
// }

// /** POST /wordscramble/rooms/:code/leave   body: { playerName } */
// export async function leaveRoom(roomCode: string, playerName: string) {
//   const data = await request<{ room: any }>(`${WS_BASE}/rooms/${encodeURIComponent(roomCode)}/leave`, {
//     method: "POST",
//     body: JSON.stringify({ playerName }),
//   });
//   return data.room;
// }
import { API_BASE_URL } from "./api";
import { getDeviceId } from "../utils/deviceId";
import { getCurrentPlayer } from "./currentPlayer";

/**
 * Backend mounts the Word Scramble router at:
 * /api/wordscramble
 */
const WS_BASE = `${API_BASE_URL}/wordscramble`;

/* ============================================================
   MAIN ACCOUNT PROFILE
   ============================================================ */

export interface MainPlayerProfile {
  id?: number | string;
  name?: string;
  dob?: string | null;
  gender?: string | null;
  phone?: string | null;
  type?: string | null;
}

/* ============================================================
   WORD SCRAMBLE PROFILE
   ============================================================ */

export interface WsProfile {
  id: number | string;
  name: string;

  // Word Scramble profile
  avatarColor?: string | null;
  gamesPlayed?: number;
  wins?: number;
  totalScore?: number;
  rank?: number | null;

  // Main account details
  dob?: string | null;
  gender?: string | null;
  phone?: string | null;
  type?: string | null;
}

/* ============================================================
   REQUEST HELPER
   ============================================================ */

async function request<T = any>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (body as any)?.error ||
        `Request failed (${res.status})`
    );
  }

  return body as T;
}

/* ============================================================
   GET MAIN PLAYER
   GET /api/player?playerId=...
   ============================================================ */

async function getMainPlayer(): Promise<MainPlayerProfile> {
  console.log("WS: getMainPlayer CALLED");

  const currentPlayer = getCurrentPlayer();

  console.log(
    "WS: currentPlayer:",
    JSON.stringify(currentPlayer)
  );

  if (!currentPlayer?.id) {
    throw new Error("Current player ID is missing.");
  }

  const playerId = String(currentPlayer.id);

  console.log(
    "WS: requesting playerId:",
    playerId
  );

  const url =
    `${API_BASE_URL}/player?playerId=${encodeURIComponent(
      playerId
    )}`;

  console.log("WS: GET:", url);

  const raw = await request<any>(url);

  console.log(
    "WS: player response:",
    JSON.stringify(raw)
  );

  const profile = raw?.data ?? raw;

  const player = profile?.player ?? profile;

  return {
    id:
      player?.id ??
      profile?.id,

    name:
      typeof player?.name === "string"
        ? player.name
        : undefined,

    dob:
      player?.dob ??
      profile?.dob ??
      null,

    gender:
      player?.gender ??
      profile?.gender ??
      null,

    phone:
      player?.phone ??
      profile?.phone ??
      null,

    type:
      player?.type ??
      profile?.type ??
      null,
  };
}

/* ============================================================
   FETCH WORD SCRAMBLE PROFILE
   ============================================================ */

export async function fetchProfile(): Promise<WsProfile> {
  console.log("WS fetchProfile CALLED");

  const deviceId = await getDeviceId();

  let query = "";

  let mainPlayer: MainPlayerProfile | null = null;

  try {
    mainPlayer = await getMainPlayer();

    const params = new URLSearchParams();

    if (mainPlayer.name) {
      params.set(
        "name",
        mainPlayer.name
      );
    }

    if (
      mainPlayer.id !== undefined &&
      mainPlayer.id !== null
    ) {
      params.set(
        "playerId",
        String(mainPlayer.id)
      );
    }

    const qs = params.toString();

    query = qs ? `?${qs}` : "";
  } catch (err) {
    console.warn(
      "WS getMainPlayer FAILED:",
      err
    );

    // Word Scramble can still load its own profile.
  }

  console.log(
    "WS fetchProfile query:",
    query
  );

  const data =
    await request<{ profile: WsProfile }>(
      `${WS_BASE}/players/${encodeURIComponent(
        deviceId
      )}${query}`
    );

  console.log(
    "WS fetchProfile result name:",
    data.profile?.name
  );

  /*
   * Word Scramble backend returns its own profile.
   * Merge the main account information into it.
   */
  return {
    ...data.profile,

    dob:
      mainPlayer?.dob ??
      data.profile?.dob ??
      null,

    gender:
      mainPlayer?.gender ??
      data.profile?.gender ??
      null,

    phone:
      mainPlayer?.phone ??
      data.profile?.phone ??
      null,

    type:
      mainPlayer?.type ??
      data.profile?.type ??
      null,
  };
}

/* ============================================================
   UPDATE WORD SCRAMBLE PROFILE NAME
   ============================================================ */

/**
 * PUT /wordscramble/players/:deviceId
 * body: { name }
 */
export async function updateProfileName(
  name: string
): Promise<WsProfile> {
  const deviceId = await getDeviceId();

  const data =
    await request<{ profile: WsProfile }>(
      `${WS_BASE}/players/${encodeURIComponent(
        deviceId
      )}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name,
        }),
      }
    );

  return data.profile;
}

/* ============================================================
   ROOM READY
   ============================================================ */

/**
 * POST /wordscramble/rooms/:code/ready
 * body: { playerName, ready }
 */
export async function setReady(
  roomCode: string,
  playerName: string,
  ready: boolean
) {
  const data =
    await request<{ room: any }>(
      `${WS_BASE}/rooms/${encodeURIComponent(
        roomCode
      )}/ready`,
      {
        method: "POST",
        body: JSON.stringify({
          playerName,
          ready,
        }),
      }
    );

  return data.room;
}

/* ============================================================
   LEAVE ROOM
   ============================================================ */

/**
 * POST /wordscramble/rooms/:code/leave
 * body: { playerName }
 */
export async function leaveRoom(
  roomCode: string,
  playerName: string
) {
  const data =
    await request<{ room: any }>(
      `${WS_BASE}/rooms/${encodeURIComponent(
        roomCode
      )}/leave`,
      {
        method: "POST",
        body: JSON.stringify({
          playerName,
        }),
      }
    );

  return data.room;
}