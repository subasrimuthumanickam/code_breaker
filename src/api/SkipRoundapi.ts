// // // TODO: ungal existing api files (Wordscrambleapi.ts / wordscrambleCoinsApi.ts) la
// // // use pannura same base URL-a inga podunga. Example: http://192.168.1.5:5000
// // const BASE_URL = "http://YOUR_BACKEND_IP:5000";
// // const API = `${BASE_URL}/api/skip`;

// // export interface SkipStats {
// //   roundsCompleted: number;
// //   totalRounds: number;
// //   starsEarned: number;
// // }
// // export interface SkipStatusResponse {
// //   success: boolean;
// //   skips: number;
// // }
// // export interface SkipClaimResponse {
// //   success: boolean;
// //   awarded?: boolean;
// //   reward?: number;
// //   skips: number;
// //   stats: SkipStats;
// //   message?: string;
// // }
// // export interface SkipUseResponse {
// //   success: boolean;
// //   skips: number;
// //   insufficient?: boolean;
// //   message?: string;
// // }

// // const json = async (res: Response) => {
// //   try {
// //     return await res.json();
// //   } catch {
// //     return { success: false, message: "Bad server response" };
// //   }
// // };

// // export const fetchSkipStatus = async (playerName: string): Promise<SkipStatusResponse> =>
// //   json(await fetch(`${API}/status/${encodeURIComponent(playerName)}`));

// // export const claimSkipReward = async (
// //   playerName: string,
// //   setKey: string,
// //   totalRounds: number,
// //   starsEarned: number
// // ): Promise<SkipClaimResponse> =>
// //   json(
// //     await fetch(`${API}/claim`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ playerName, setKey, totalRounds, starsEarned }),
// //     })
// //   );

// // // (named consumeSkip, not useSkip, so React hook lint rules don't complain)
// // export const consumeSkip = async (
// //   playerName: string,
// //   roundId: string,
// //   roundNumber: number
// // ): Promise<SkipUseResponse> =>
// //   json(
// //     await fetch(`${API}/use`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ playerName, roundId, roundNumber }),
// //     })
// //   );
// const BASE_URL = "http://YOUR_BACKEND_IP:5000";

// const API = `${BASE_URL}/api/skip`;

// export interface SkipStats {
//   roundsCompleted: number;
//   totalRounds: number;
//   starsEarned: number;
// }

// export interface SkipStatusResponse {
//   success: boolean;
//   skips: number;
//   message?: string;
// }

// export interface SkipClaimResponse {
//   success: boolean;
//   awarded?: boolean;
//   reward?: number;
//   skips: number;
//   stats: SkipStats;
//   message?: string;
// }

// export interface SkipUseResponse {
//   success: boolean;
//   skips: number;
//   insufficient?: boolean;
//   message?: string;
// }

// const json = async <T>(res: Response): Promise<T> => {
//   try {
//     return await res.json();
//   } catch {
//     return {
//       success: false,
//       message: "Bad server response",
//     } as T;
//   }
// };

// export const fetchSkipStatus = async (
//   playerName: string
// ): Promise<SkipStatusResponse> => {
//   const res = await fetch(
//     `${API}/status/${encodeURIComponent(playerName)}`
//   );

//   return json<SkipStatusResponse>(res);
// };

// export const claimSkipReward = async (
//   playerName: string,
//   setKey: string,
//   totalRounds: number,
//   starsEarned: number
// ): Promise<SkipClaimResponse> => {
//   const res = await fetch(`${API}/claim`, {
//     method: "POST",

//     headers: {
//       "Content-Type": "application/json",
//     },

//     body: JSON.stringify({
//       playerName,
//       setKey,
//       totalRounds,
//       starsEarned,
//     }),
//   });

//   return json<SkipClaimResponse>(res);
// };

// export const consumeSkip = async (
//   playerName: string,
//   roundId: string,
//   roundNumber: number
// ): Promise<SkipUseResponse> => {
//   const res = await fetch(`${API}/use`, {
//     method: "POST",

//     headers: {
//       "Content-Type": "application/json",
//     },

//     body: JSON.stringify({
//       playerName,
//       roundId,
//       roundNumber,
//     }),
//   });

//   return json<SkipUseResponse>(res);
// };
import { API_BASE_URL } from "./api"; // same base URL your other API files use

// API_BASE_URL already ends with "/api" (Wordscrambleapi.ts builds
// `${API_BASE_URL}/wordscramble`), so this becomes ".../api/skip".
const API = `${API_BASE_URL}/skip`;

export interface SkipStats {
  roundsCompleted: number;
  totalRounds: number;
  starsEarned: number;
}

export interface SkipStatusResponse {
  success: boolean;
  skips: number;
  message?: string;
}

export interface SkipClaimResponse {
  success: boolean;
  awarded?: boolean;
  reward?: number;
  skips: number;
  stats: SkipStats;
  message?: string;
}

export interface SkipUseResponse {
  success: boolean;
  skips: number;
  insufficient?: boolean;
  message?: string;
}

const json = async <T>(res: Response): Promise<T> => {
  try {
    return await res.json();
  } catch {
    return {
      success: false,
      message: "Bad server response",
    } as T;
  }
};

export const fetchSkipStatus = async (
  playerName: string
): Promise<SkipStatusResponse> => {
  const res = await fetch(
    `${API}/status/${encodeURIComponent(playerName)}`
  );

  return json<SkipStatusResponse>(res);
};

export const claimSkipReward = async (
  playerName: string,
  setKey: string,
  totalRounds: number,
  starsEarned: number
): Promise<SkipClaimResponse> => {
  const res = await fetch(`${API}/claim`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      playerName,
      setKey,
      totalRounds,
      starsEarned,
    }),
  });

  return json<SkipClaimResponse>(res);
};

export const consumeSkip = async (
  playerName: string,
  roundId: string,
  roundNumber: number
): Promise<SkipUseResponse> => {
  const res = await fetch(`${API}/use`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      playerName,
      roundId,
      roundNumber,
    }),
  });

  return json<SkipUseResponse>(res);
};