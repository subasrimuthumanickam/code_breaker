// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import {BT_API} from './config';
// // const call=async(p:string,b?:any)=>{const r=await fetch(BT_API+p,b?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}:undefined);
// //   const j=await r.json();if(!r.ok)throw Object.assign(new Error(j.error||'error'),{status:r.status});return j};
// // export const guest=async()=>{let d=await AsyncStorage.getItem('bt_device');if(!d){d='bt'+Date.now().toString(36)+Math.random().toString(36).slice(2,9);await AsyncStorage.setItem('bt_device',d)}
// //   return call('/players/guest',{deviceId:d})};
// // export const level=(n:number)=>call('/levels/'+n);
// // export const answer=(n:number,pid:number,a:any)=>call(`/levels/${n}/answer`,{playerId:pid,answer:a});
// // export const hint=(n:number,pid:number,used:number[])=>call(`/levels/${n}/hint`,{playerId:pid,used});
// // export const skip=(n:number,pid:number)=>call(`/levels/${n}/skip`,{playerId:pid});
// // export const reward=(pid:number,kind:string)=>call(`/players/${pid}/reward`,{kind});

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BT_API } from './config';

// const call = async (path: string, body?: unknown) => {
//   const url = `${BT_API}${path}`;

//   console.log('[BrainTwist API]', body ? 'POST' : 'GET', url);

//   const response = await fetch(
//     url,
//     body === undefined
//       ? { method: 'GET' }
//       : {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//           },
//           body: JSON.stringify(body),
//         }
//   );

//   const text = await response.text();

//   let data: any;

//   try {
//     data = text ? JSON.parse(text) : {};
//   } catch {
//     throw new Error(
//       `Invalid API response (${response.status}): ${text.slice(0, 150)}`
//     );
//   }

//   if (!response.ok) {
//     throw new Error(
//       data.message ||
//       data.error ||
//       `API request failed: ${response.status}`
//     );
//   }

//   return data;
// };

// export const guest = async () => {
//   let deviceId = await AsyncStorage.getItem('bt_device');

//   if (!deviceId) {
//     deviceId =
//       'bt' +
//       Date.now().toString(36) +
//       Math.random().toString(36).slice(2, 9);

//     await AsyncStorage.setItem('bt_device', deviceId);
//   }

//   return call('/players/guest', { deviceId });
// };

// export const level = (n: number) =>
//   call(`/levels/${n}`);

// export const answer = (
//   n: number,
//   playerId: number,
//   answerValue: unknown
// ) =>
//   call(`/levels/${n}/answer`, {
//     playerId,
//     answer: answerValue,
//   });

// export const hint = (
//   n: number,
//   playerId: number,
//   used: number[]
// ) =>
//   call(`/levels/${n}/hint`, {
//     playerId,
//     used,
//   });

// export const skip = (n: number, playerId: number) =>
//   call(`/levels/${n}/skip`, {
//     playerId,
//   });

// export const reward = (
//   playerId: number,
//   kind: 'video' | 'gift'
// ) =>
//   call(`/players/${playerId}/reward`, {
//     kind,
//   });
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BT_API } from './config';

const call = async (path: string, body?: unknown) => {
  const url = `${BT_API}${path}`;

  console.log('[BrainTwist API]', body ? 'POST' : 'GET', url);

  const response = await fetch(
    url,
    body === undefined
      ? { method: 'GET' }
      : {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
        }
  );

  const text = await response.text();

  let data: any;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Invalid API response (${response.status}): ${text.slice(0, 150)}`
    );
  }

  if (!response.ok) {
    const err: any = new Error(
      data.message ||
      data.error ||
      `API request failed: ${response.status}`
    );
    // lets the screens check e.status === 402 ("Not enough hints")
    err.status = response.status;
    throw err;
  }

  return data;
};

export const guest = async () => {
  let deviceId = await AsyncStorage.getItem('bt_device');

  if (!deviceId) {
    deviceId =
      'bt' +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 9);

    await AsyncStorage.setItem('bt_device', deviceId);
  }

  return call('/players/guest', { deviceId });
};

export const level = (n: number) =>
  call(`/levels/${n}`);

export const answer = (
  n: number,
  playerId: number,
  answerValue: unknown
) =>
  call(`/levels/${n}/answer`, {
    playerId,
    answer: answerValue,
  });

export const hint = (
  n: number,
  playerId: number,
  used: number[]
) =>
  call(`/levels/${n}/hint`, {
    playerId,
    used,
  });

export const skip = (n: number, playerId: number) =>
  call(`/levels/${n}/skip`, {
    playerId,
  });

export const reward = (
  playerId: number,
  kind: 'video' | 'gift'
) =>
  call(`/players/${playerId}/reward`, {
    kind,
  });

// saves stars / score / attempts in brain_twist_progress
export const complete = (
  playerId: number,
  level: number,
  s: { tries: number; hints: number; skipped: boolean }
) =>
  call('/progress/complete', {
    playerId,
    level,
    attempts: s.tries,
    hintsUsed: s.hints,
    skipped: s.skipped,
  });