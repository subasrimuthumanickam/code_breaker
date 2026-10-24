
import { API_BASE_URL } from "./api";
import { getDeviceId } from "../utils/deviceId";
import { getCurrentPlayer } from "./currentPlayer";

/**
 * Backend mounts the Word Scramble router at:
 * /api/wordscramble
 */
const WS_BASE = `${API_BASE_URL}/wordscramble`;



export interface MainPlayerProfile {
  id?: number | string;
  name?: string;
  dob?: string | null;
  gender?: string | null;
  phone?: string | null;
  type?: string | null;
}



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