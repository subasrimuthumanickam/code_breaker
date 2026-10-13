// // npx expo install expo-audio
// import { createAudioPlayer, AudioPlayer } from 'expo-audio';

// const FILES = {
//   drag0: require('../../assets/sounds/drag0.wav'),
//   drag1: require('../../assets/sounds/drag1.wav'),
//   drag2: require('../../assets/sounds/drag2.wav'),
//   drag3: require('../../assets/sounds/drag3.wav'),
//   drag4: require('../../assets/sounds/drag4.wav'),
//   drag5: require('../../assets/sounds/drag5.wav'),
//   sparkle: require('../../assets/sounds/sparkle.wav'),
//   spinTick: require('../../assets/sounds/spinTick.wav'),
//   whoosh: require('../../assets/sounds/whoosh.wav'),
//   win: require('../../assets/sounds/win.wav'),
//   jackpot: require('../../assets/sounds/jackpot.wav'),
// };

// export type SoundName = keyof typeof FILES;

// const players: Partial<Record<SoundName, AudioPlayer>> = {};
// const lastPlayed: Partial<Record<SoundName, number>> = {};
// let enabled = true;

// // Settings screen la sound on/off toggle ku use pannalaam
// export const setSoundEnabled = (v: boolean) => { enabled = v; };

// const getPlayer = (name: SoundName) => {
//   if (!players[name]) players[name] = createAudioPlayer(FILES[name]);
//   return players[name]!;
// };

// // App start la (App.tsx useEffect) oru thadava call pannunga -> first play la delay irukkathu
// export const loadSounds = () => (Object.keys(FILES) as SoundName[]).forEach(getPlayer);

// export function playSound(name: SoundName, minGapMs = 0) {
//   if (!enabled) return;
//   const now = Date.now();
//   if (minGapMs && now - (lastPlayed[name] ?? 0) < minGapMs) return;
//   lastPlayed[name] = now;
//   try {
//     const p = getPlayer(name);
//     p.seekTo(0);
//     p.play();
//   } catch {}
// }

// // Letter wheel drag: 1st letter low pitch, next letters higher pitch
// export const playDragTick = (selectedCount: number) =>
//   playSound(`drag${Math.min(Math.max(selectedCount, 0), 5)}` as SoundName);
// npx expo install expo-audio
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';

const FILES = {
  drag0: require('../../assets/sounds/drag0.wav'),
  drag1: require('../../assets/sounds/drag1.wav'),
  drag2: require('../../assets/sounds/drag2.wav'),
  drag3: require('../../assets/sounds/drag3.wav'),
  drag4: require('../../assets/sounds/drag4.wav'),
  drag5: require('../../assets/sounds/drag5.wav'),
  sparkle: require('../../assets/sounds/sparkle.wav'),
  spinTick: require('../../assets/sounds/spinTick.wav'),
  whoosh: require('../../assets/sounds/whoosh.wav'),
  win: require('../../assets/sounds/win.wav'),
  jackpot: require('../../assets/sounds/jackpot.wav'),
};

export type SoundName = keyof typeof FILES;

const players: Partial<Record<SoundName, AudioPlayer>> = {};
const lastPlayed: Partial<Record<SoundName, number>> = {};
let enabled = true;
let modeReady = false;

export const setSoundEnabled = (v: boolean) => { enabled = v; };

// iPhone silent mode la kooda sound varanum, matha app audio-va stop pannakoodathu
async function ensureAudioMode() {
  if (modeReady) return;
  modeReady = true;
  try {
    await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' });
  } catch (e) {
    console.warn('[sound] setAudioMode failed', e);
  }
}

const getPlayer = (name: SoundName) => {
  if (!players[name]) players[name] = createAudioPlayer(FILES[name]);
  return players[name]!;
};

// App.tsx la useEffect la oru thadava call pannunga
export const loadSounds = () => {
  ensureAudioMode();
  (Object.keys(FILES) as SoundName[]).forEach(n => {
    try { getPlayer(n); } catch (e) { console.warn('[sound] load failed', n, e); }
  });
  console.log('[sound] loaded');
};

export function playSound(name: SoundName, minGapMs = 0) {
  if (!enabled) return;
  const now = Date.now();
  if (minGapMs && now - (lastPlayed[name] ?? 0) < minGapMs) return;
  lastPlayed[name] = now;

  ensureAudioMode();
  try {
    const p = getPlayer(name);
    // seekTo fail aanaalum play aagum
    Promise.resolve(p.seekTo(0)).catch(() => {}).finally(() => {
      try { p.play(); } catch (e) { console.warn('[sound] play failed', name, e); }
    });
  } catch (e) {
    console.warn('[sound] error', name, e);
  }
}

export const playDragTick = (selectedCount: number) =>
  playSound(`drag${Math.min(Math.max(selectedCount, 0), 5)}` as SoundName);