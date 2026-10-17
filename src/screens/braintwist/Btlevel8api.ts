// // // import { BT_API } from './config';

// // // export type Level8View = {
// // //   success: boolean;
// // //   sessionId: number;
// // //   level: number;
// // //   status: string;
// // //   title: string;
// // //   scene: { w: number; h: number };
// // //   lightR: number;                    // spotlight radius, in scene units
// // //   start: { x: number; y: number };   // where the spotlight starts
// // //   hints: number;
// // // };

// // // export type Level8Result = {
// // //   success: boolean;
// // //   found: boolean;
// // //   completed: boolean;
// // //   skipped?: boolean;
// // //   message?: string;
// // //   parrot?: { x: number; y: number; spot: string };   // only sent once the parrot is found
// // //   score?: number;
// // //   stars?: number;
// // //   attempts?: number;
// // //   seconds?: number;
// // //   progressSaved?: boolean;
// // //   next?: number;
// // //   hints?: number;
// // // };

// // // export type Level8Hint = {
// // //   success: boolean;
// // //   x: number;
// // //   y: number;
// // //   hints: number;
// // //   cost: number;
// // // };

// // // export type Level8Reward = {
// // //   success: boolean;
// // //   added: number;
// // //   hints: number;
// // // };

// // // const call = async (path: string, body: unknown) => {
// // //   const url = `${BT_API}${path}`;

// // //   const response = await fetch(url, {
// // //     method: 'POST',
// // //     headers: {
// // //       'Content-Type': 'application/json',
// // //       Accept: 'application/json',
// // //     },
// // //     body: JSON.stringify(body),
// // //   });

// // //   const text = await response.text();

// // //   let data: any;
// // //   try {
// // //     data = text ? JSON.parse(text) : {};
// // //   } catch {
// // //     throw new Error(`Invalid server response (${response.status})`);
// // //   }

// // //   if (!response.ok || data.success === false) {
// // //     const err: any = new Error(data.message || data.error || `Request failed (${response.status})`);
// // //     err.status = response.status;
// // //     throw err;
// // //   }

// // //   return data;
// // // };

// // // // 1. open level 8 (creates or resumes a session; the server hides the parrot)
// // // export const startLevel8 = (playerId: number): Promise<Level8View> =>
// // //   call('/level8/start', { playerId });

// // // // 2. the player moved the spotlight: send where its middle is (scene units)
// // // export const lookLevel8 = (params: {
// // //   sessionId: number;
// // //   playerId: number;
// // //   x: number;
// // //   y: number;
// // // }): Promise<Level8Result> => call('/level8/look', params);

// // // // 3. magnifier: moves the spotlight near the parrot (costs 25 hints)
// // // export const hintLevel8 = (params: {
// // //   sessionId: number;
// // //   playerId: number;
// // // }): Promise<Level8Hint> => call('/level8/hint', params);

// // // // 4. skip the level (costs 50 hints)
// // // export const skipLevel8 = (params: {
// // //   sessionId: number;
// // //   playerId: number;
// // // }): Promise<Level8Result> => call('/level8/skip', params);

// // // // 5. video reward (+75 hints)
// // // export const rewardLevel8 = (playerId: number): Promise<Level8Reward> =>
// // //   call('/level8/reward', { playerId, kind: 'video' });
// // import { BT_API } from './config';

// // export type Level8View = {
// //   success: boolean;
// //   sessionId: number;
// //   level: number;
// //   status: string;
// //   title: string;
// //   scene: { w: number; h: number };
// //   lightR: number;                    // spotlight radius, in scene units
// //   start: { x: number; y: number };   // where the spotlight starts
// //   hints: number;
// // };

// // export type Level8Result = {
// //   success: boolean;
// //   found: boolean;
// //   completed: boolean;
// //   skipped?: boolean;
// //   message?: string;
// //   parrot?: { x: number; y: number; spot: string };   // only sent once the parrot is found
// //   score?: number;
// //   stars?: number;
// //   attempts?: number;
// //   seconds?: number;
// //   progressSaved?: boolean;
// //   next?: number;
// //   hints?: number;
// // };

// // export type Level8Hint = {
// //   success: boolean;
// //   x: number;
// //   y: number;
// //   hints: number;
// //   cost: number;
// // };

// // export type Level8Reward = {
// //   success: boolean;
// //   added: number;
// //   hints: number;
// // };

// // const call = async (path: string, body: unknown) => {
// //   const url = `${BT_API}${path}`;

// //   const response = await fetch(url, {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //       Accept: 'application/json',
// //     },
// //     body: JSON.stringify(body),
// //   });

// //   const text = await response.text();

// //   let data: any;
// //   try {
// //     data = text ? JSON.parse(text) : {};
// //   } catch {
// //     throw new Error(`Invalid server response (${response.status})`);
// //   }

// //   if (!response.ok || data.success === false) {
// //     const err: any = new Error(data.message || data.error || `Request failed (${response.status})`);
// //     err.status = response.status;
// //     throw err;
// //   }

// //   return data;
// // };

// // // 1. open level 8 (creates or resumes a session; the server hides the parrot)
// // export const startLevel8 = (playerId: number): Promise<Level8View> =>
// //   call('/level8/start', { playerId });

// // // 2. the player moved the spotlight: send where its middle is (scene units)
// // export const lookLevel8 = (params: {
// //   sessionId: number;
// //   playerId: number;
// //   x: number;
// //   y: number;
// // }): Promise<Level8Result> => call('/level8/look', params);

// // // 3. magnifier: moves the spotlight near the parrot (costs 25 hints)
// // export const hintLevel8 = (params: {
// //   sessionId: number;
// //   playerId: number;
// // }): Promise<Level8Hint> => call('/level8/hint', params);

// // // 4. skip the level (costs 50 hints)
// // export const skipLevel8 = (params: {
// //   sessionId: number;
// //   playerId: number;
// // }): Promise<Level8Result> => call('/level8/skip', params);

// // // 5. video reward (+75 hints)
// // export const rewardLevel8 = (playerId: number): Promise<Level8Reward> =>
// //   call('/level8/reward', { playerId, kind: 'video' });
// import { BT_API } from './config';

// export type Level8View = {
//   success: boolean;
//   sessionId: number;
//   level: number;
//   status: string;
//   title: string;
//   scene: { w: number; h: number };
//   lightR: number;                    // spotlight radius, in scene units
//   start: { x: number; y: number };   // where the spotlight starts
//   hints: number;
// };

// export type Level8Result = {
//   success: boolean;
//   found: boolean;
//   completed: boolean;
//   skipped?: boolean;
//   message?: string;
//   parrot?: { x: number; y: number; spot: string };   // only sent once the parrot is found
//   score?: number;
//   stars?: number;
//   attempts?: number;
//   seconds?: number;
//   progressSaved?: boolean;
//   next?: number;
//   hints?: number;
// };

// export type Level8Hint = {
//   success: boolean;
//   x: number;
//   y: number;
//   hints: number;
//   cost: number;
// };

// export type Level8Reward = {
//   success: boolean;
//   added: number;
//   hints: number;
// };

// const call = async (path: string, body: unknown) => {
//   const url = `${BT_API}${path}`;

//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     },
//     body: JSON.stringify(body),
//   });

//   const text = await response.text();

//   let data: any;
//   try {
//     data = text ? JSON.parse(text) : {};
//   } catch {
//     throw new Error(`Invalid server response (${response.status})`);
//   }

//   if (!response.ok || data.success === false) {
//     const err: any = new Error(data.message || data.error || `Request failed (${response.status})`);
//     err.status = response.status;
//     throw err;
//   }

//   return data;
// };

// // 1. open level 8 (creates or resumes a session; the server hides the parrot)
// export const startLevel8 = (playerId: number): Promise<Level8View> =>
//   call('/level8/start', { playerId });

// // 2. the player moved the spotlight: send where its middle is (scene units)
// export const lookLevel8 = (params: {
//   sessionId: number;
//   playerId: number;
//   x: number;
//   y: number;
// }): Promise<Level8Result> => call('/level8/look', params);

// // 3. magnifier: moves the spotlight near the parrot (costs 25 hints)
// export const hintLevel8 = (params: {
//   sessionId: number;
//   playerId: number;
// }): Promise<Level8Hint> => call('/level8/hint', params);

// // 4. skip the level (costs 50 hints)
// export const skipLevel8 = (params: {
//   sessionId: number;
//   playerId: number;
// }): Promise<Level8Result> => call('/level8/skip', params);

// // 5. video reward (+75 hints)
// export const rewardLevel8 = (playerId: number): Promise<Level8Reward> =>
//   call('/level8/reward', { playerId, kind: 'video' });
import { BT_API } from './config';

export type Level8View = {
  success: boolean;
  sessionId: number;
  level: number;
  status: string;
  title: string;
  scene: { w: number; h: number };
  lightR: number;                    // spotlight radius, in scene units
  start: { x: number; y: number };   // where the spotlight starts
  hints: number;
};

export type Level8Result = {
  success: boolean;
  found: boolean;
  completed: boolean;
  skipped?: boolean;
  message?: string;
  parrot?: { x: number; y: number; spot: string };   // only sent once the parrot is found
  seen?: { x: number; y: number } | null;            // parrot is inside the light: draw it, the player taps it
  score?: number;
  stars?: number;
  attempts?: number;
  seconds?: number;
  progressSaved?: boolean;
  next?: number;
  hints?: number;
};

export type Level8Hint = {
  success: boolean;
  x: number;
  y: number;
  hints: number;
  cost: number;
};

export type Level8Reward = {
  success: boolean;
  added: number;
  hints: number;
};

const call = async (path: string, body: unknown) => {
  const url = `${BT_API}${path}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Invalid server response (${response.status})`);
  }

  if (!response.ok || data.success === false) {
    const err: any = new Error(data.message || data.error || `Request failed (${response.status})`);
    err.status = response.status;
    throw err;
  }

  return data;
};

// 1. open level 8 (creates or resumes a session; the server hides the parrot)
export const startLevel8 = (playerId: number): Promise<Level8View> =>
  call('/level8/start', { playerId });

// 2. the player moved the spotlight: send where its middle is (scene units)
export const lookLevel8 = (params: {
  sessionId: number;
  playerId: number;
  x: number;
  y: number;
  tap?: boolean;
}): Promise<Level8Result> => call('/level8/look', params);

// 3. magnifier: moves the spotlight near the parrot (costs 25 hints)
export const hintLevel8 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level8Hint> => call('/level8/hint', params);

// 4. skip the level (costs 50 hints)
export const skipLevel8 = (params: {
  sessionId: number;
  playerId: number;
}): Promise<Level8Result> => call('/level8/skip', params);

// 5. video reward (+75 hints)
export const rewardLevel8 = (playerId: number): Promise<Level8Reward> =>
  call('/level8/reward', { playerId, kind: 'video' });