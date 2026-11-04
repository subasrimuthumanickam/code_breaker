// import { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { feedback } from '../../utils/feedback';

// /**
//  * Brain Twist sound settings - ONE global store for ALL levels.
//  *  - Music / Sound Effects ON-OFF is shared by every screen and saved on the device,
//  *    so it stays the same after you change level or reopen the app.
//  *  - Any level can read it with useBTSound(), or play a sound with playSfx().
//  */

// const KEY = 'bt-sound-settings';

// export type BTSoundState = { music: boolean; sfx: boolean };

// let state: BTSoundState = { music: true, sfx: true };
// let loaded = false;
// const subs = new Set<(s: BTSoundState) => void>();

// const emit = () => subs.forEach((f) => f(state));
// const save = () => {
//   AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
// };

// /** current settings (use inside event handlers / game loops) */
// export const getBTSound = () => state;

// /** load the saved settings once (the hook below calls this for you) */
// export const loadBTSound = async (): Promise<BTSoundState> => {
//   if (loaded) return state;
//   try {
//     const raw = await AsyncStorage.getItem(KEY);
//     if (raw) {
//       const p = JSON.parse(raw);
//       state = { music: p.music !== false, sfx: p.sfx !== false };
//     }
//   } catch {}
//   loaded = true;
//   emit();
//   return state;
// };

// export const setBTMusic = (v: boolean) => {
//   state = { ...state, music: v };
//   emit();
//   save();
// };

// export const setBTSfx = (v: boolean) => {
//   state = { ...state, sfx: v };
//   emit();
//   save();
// };

// export const subscribeBTSound = (f: (s: BTSoundState) => void) => {
//   subs.add(f);
//   return () => {
//     subs.delete(f);
//   };
// };

// /** React hook: re-renders the screen whenever Music / SFX is toggled anywhere */
// export function useBTSound() {
//   const [s, setS] = useState<BTSoundState>(state);
//   useEffect(() => {
//     const unsub = subscribeBTSound(setS);
//     loadBTSound().then(setS);
//     return unsub;
//   }, []);
//   return { music: s.music, sfx: s.sfx, setMusic: setBTMusic, setSfx: setBTSfx };
// }

// /** Play a sound effect ONLY when Sound Effects is ON (kind = same names the app's feedback() uses, e.g. 'tap') */
// export const playSfx = (kind: string = 'tap') => {
//   if (!state.sfx) return;
//   try {
//     (feedback as any)(kind);
//   } catch {}
// };
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { feedback } from '../../utils/feedback';

const KEY = 'bt-sound-settings';

export type BTSoundState = { music: boolean; sfx: boolean };

let state: BTSoundState = { music: true, sfx: true };
let loaded = false;
const subs = new Set<(s: BTSoundState) => void>();

const emit = () => subs.forEach((f) => f(state));
const save = () => {
  AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
};

export const getBTSound = () => state;

export const loadBTSound = async (): Promise<BTSoundState> => {
  if (loaded) return state;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      state = { music: p.music !== false, sfx: p.sfx !== false };
    }
  } catch {}
  loaded = true;
  emit();
  return state;
};

export const setBTMusic = (v: boolean) => {
  state = { ...state, music: v };
  emit();
  save();
};

export const setBTSfx = (v: boolean) => {
  state = { ...state, sfx: v };
  emit();
  save();
};

export const subscribeBTSound = (f: (s: BTSoundState) => void) => {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
};

export function useBTSound() {
  const [s, setS] = useState<BTSoundState>(state);
  useEffect(() => {
    const unsub = subscribeBTSound(setS);
    loadBTSound().then(setS);
    return unsub;
  }, []);
  return { music: s.music, sfx: s.sfx, setMusic: setBTMusic, setSfx: setBTSfx };
}

export const playSfx = (kind: string = 'tap') => {
  if (!state.sfx) return;
  try {
    (feedback as any)(kind);
  } catch {}
};