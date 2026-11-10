
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
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
  if (!v) stopAll(); // sound effects OFF -> stop anything that is playing
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

/* ============================================================
   LEVEL SOUND EFFECTS (drag / erase / pencil / clue / correct / wrong ...)
   Uses the same `state.sfx` flag, so the Settings toggle controls them.
   Native: expo-av   |   Web: HTMLAudio
   Sounds load on demand, so it works even if loadSounds() was never called.
============================================================ */

export type SfxName =
  | 'drag'
  | 'erase'
  | 'pencil'
  | 'clue'
  | 'correct'
  | 'wrong'
  | 'merge'
  | 'key'
  | 'btn'
  | 'tap'
  | 'line1'
  | 'line2'
  | 'line3'
  | 'line4'
  | 'line5';

const FILES: Record<SfxName, any> = {
  drag: require('../../../assets/sounds/drag.wav'),
  erase: require('../../../assets/sounds/erase.wav'),
  pencil: require('../../../assets/sounds/pencil.wav'),
  clue: require('../../../assets/sounds/clue.wav'),
  correct: require('../../../assets/sounds/correct.wav'),
  wrong: require('../../../assets/sounds/wrong.wav'),
  merge: require('../../../assets/sounds/merge.wav'),
  key: require('../../../assets/sounds/key.wav'),
  btn: require('../../../assets/sounds/btn.wav'),
  tap: require('../../../assets/sounds/tap.wav'),
  line1: require('../../../assets/sounds/line1.wav'),
  line2: require('../../../assets/sounds/line2.wav'),
  line3: require('../../../assets/sounds/line3.wav'),
  line4: require('../../../assets/sounds/line4.wav'),
  line5: require('../../../assets/sounds/line5.wav'),
};

const native: Partial<Record<SfxName, any>> = {};
const webCache: Partial<Record<SfxName, any>> = {};
const loading: Partial<Record<SfxName, Promise<any>>> = {};
let audioModeSet = false;
let soundsLoaded = false;

// loads ONE sound (native). A broken file never blocks the others.
async function ensureNative(name: SfxName): Promise<any> {
  if (native[name]) return native[name];
  if (loading[name]) return loading[name];

  loading[name] = (async () => {
    try {
      const { Audio } = require('expo-av');
      if (!audioModeSet) {
        audioModeSet = true;
        try {
          await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        } catch {}
      }
      const { sound } = await Audio.Sound.createAsync(FILES[name], { shouldPlay: false });
      native[name] = sound;
      return sound;
    } catch (e) {
      console.warn('[BTSound] could not load "' + name + '":', e);
      return null;
    } finally {
      delete loading[name];
    }
  })();

  return loading[name];
}

/** Optional: call once at app start (App.tsx) so the first play has no delay. */
export async function loadSounds() {
  if (soundsLoaded) return;
  loadBTSound(); // also restore saved music/sfx settings
  if (Platform.OS === 'web') {
    soundsLoaded = true;
    return;
  }
  await Promise.all((Object.keys(FILES) as SfxName[]).map((k) => ensureNative(k)));
  soundsLoaded = true;
}

export function play(name: SfxName, opts: { loop?: boolean } = {}) {
  if (!state.sfx) return;
  try {
    if (Platform.OS === 'web') {
      const src = FILES[name];
      const url = typeof src === 'string' ? src : src?.default || src?.uri || src;
      let a = webCache[name];
      if (!a) {
        a = new (window as any).Audio(url);
        webCache[name] = a;
      }
      a.loop = !!opts.loop;
      a.currentTime = 0;
      a.play().catch((e: any) => console.warn('[BTSound] web play blocked:', name, e));
      return;
    }

    const run = (s: any) => {
      if (!s) return;
      s.setIsLoopingAsync(!!opts.loop).catch(() => {});
      s.replayAsync().catch((e: any) => console.warn('[BTSound] replay failed:', name, e));
    };

    const ready = native[name];
    if (ready) run(ready);
    else ensureNative(name).then(run);   // not loaded yet -> load now, then play
  } catch (e) {
    console.warn('[BTSound] play error:', name, e);
  }
}

export function stop(name: SfxName) {
  try {
    if (Platform.OS === 'web') {
      const a = webCache[name];
      if (a) {
        a.pause();
        a.currentTime = 0;
      }
    } else {
      native[name]?.stopAsync().catch(() => {});
    }
  } catch (e) {}
}

export function stopAll() {
  (Object.keys(FILES) as SfxName[]).forEach(stop);
}