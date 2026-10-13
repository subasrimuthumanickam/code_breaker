// import { Audio } from "expo-av";

// // Requires: expo install expo-av
// // Drop 3 short mp3s into assets/sounds/ with these exact names.
// let foundSound: Audio.Sound | null = null;
// let winSound: Audio.Sound | null = null;
// let wrongSound: Audio.Sound | null = null;
// let loaded = false;

// export async function loadSounds() {
//   if (loaded) return;
//   try {
//     const [{ sound: s1 }, { sound: s2 }, { sound: s3 }] = await Promise.all([
//       Audio.Sound.createAsync(require("../assets/sounds/found.mp3")),
//       Audio.Sound.createAsync(require("../assets/sounds/win.mp3")),
//       Audio.Sound.createAsync(require("../assets/sounds/wrong.mp3")),
//     ]);
//     foundSound = s1;
//     winSound = s2;
//     wrongSound = s3;
//     loaded = true;
//   } catch (e) {
//     console.warn("Could not load sound effects:", e);
//   }
// }

// export async function playFound() {
//   try {
//     await foundSound?.replayAsync();
//   } catch {}
// }

// export async function playWin() {
//   try {
//     await winSound?.replayAsync();
//   } catch {}
// }

// export async function playWrong() {
//   try {
//     await wrongSound?.replayAsync();
//   } catch {}
// }

// export async function unloadSounds() {
//   await foundSound?.unloadAsync();
//   await winSound?.unloadAsync();
//   await wrongSound?.unloadAsync();
//   loaded = false;
// }
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
    // munnadi play aagirundha thirumba arambathukku; first time na direct play
    if (p.currentTime > 0) p.seekTo(0);
    p.play();
  } catch (e) {
    console.warn('[sound] error', name, e);
  }
}

// Debug: screen la alert-a status kaattum (work aana apram delete pannidunga)
export function debugSound(name: SoundName = 'win') {
  try {
    const p = getPlayer(name);
    p.play();
    setTimeout(() => {
      alert(`${name}: loaded=${p.isLoaded} playing=${p.playing} duration=${p.duration} volume=${p.volume} muted=${p.muted}`);
    }, 600);
  } catch (e) {
    alert('sound error: ' + String(e));
  }
}

export const playDragTick = (selectedCount: number) =>
  playSound(`drag${Math.min(Math.max(selectedCount, 0), 5)}` as SoundName);