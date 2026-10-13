

// import { Platform, Vibration } from "react-native";
// // import { Audio } from "expo-av";
// import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
// import * as Haptics from "expo-haptics";

// export type SoundKind = "tap" | "correct" | "wrong" | "combo" | "win";
// export type HapticKind = "tap" | "success" | "error";

// const SOURCES: Record<SoundKind, any> = {
//   tap: require("../../assets/sounds/codebreaker/tap.wav"),
//   correct: require("../../assets/sounds/codebreaker/correct.wav"),
//   wrong: require("../../assets/sounds/codebreaker/wrong.wav"),
//   combo: require("../../assets/sounds/codebreaker/combo.wav"),
//   win: require("../../assets/sounds/codebreaker/win.wav"),
// };

// /* ---------------- current settings (kept in sync from App.tsx) ---------------- */

// let soundOn = true;
// let hapticsOn = true;

// export const setFeedbackSettings = (s: { soundEnabled: boolean; hapticsEnabled: boolean }) => {
//   soundOn = s.soundEnabled;
//   hapticsOn = s.hapticsEnabled;
// };

// /* ---------------- sound ---------------- */

// let audioReady = false;

// const ensureAudio = async () => {
//   if (audioReady) return;
//   try {
//     await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
//   } catch {}
//   audioReady = true;
// };

// const play = async (kind: SoundKind) => {
//   try {
//     await ensureAudio();
//     const { sound } = await Audio.Sound.createAsync(SOURCES[kind], { shouldPlay: true });
//     sound.setOnPlaybackStatusUpdate((st) => {
//       if (st.isLoaded && st.didJustFinish) sound.unloadAsync().catch(() => {});
//     });
//   } catch (e) {
//     console.warn("Sound failed:", e);
//   }
// };

// /** Plays only when Sound Effects is ON. */
// export const playSound = (kind: SoundKind) => {
//   if (!soundOn) return;
//   play(kind);
// };

// /** Ignores the toggle - used right when the user switches Sound Effects on. */
// export const previewSound = () => play("tap");

// /* ---------------- haptics ---------------- */

// const buzz = (kind: HapticKind) => {
//   try {
//     if (Platform.OS === "web") {
//       // Works on Android Chrome; silently ignored on desktop browsers / iOS Safari
//       const nav: any = typeof navigator !== "undefined" ? navigator : null;
//       if (nav?.vibrate) nav.vibrate(kind === "tap" ? 15 : kind === "success" ? [20, 40, 20] : [40, 40, 40]);
//       return;
//     }
//     if (kind === "tap") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//     else if (kind === "success") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//     else Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
//   } catch {
//     Vibration.vibrate(20);
//   }
// };

// /** Vibrates only when Haptic Feedback is ON. */
// export const haptic = (kind: HapticKind = "tap") => {
//   if (!hapticsOn) return;
//   buzz(kind);
// };

// /** Ignores the toggle - used right when the user switches Haptic Feedback on. */
// export const previewHaptic = () => buzz("success");

// /** Convenience: sound + haptic together. */
// export const feedback = (kind: "tap" | "correct" | "wrong" | "combo" | "win") => {
//   playSound(kind);
//   haptic(kind === "wrong" ? "error" : kind === "tap" ? "tap" : "success");
// };

import { Platform, Vibration } from "react-native";
import {
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";
import * as Haptics from "expo-haptics";

export type SoundKind = "tap" | "correct" | "wrong" | "combo" | "win";
export type HapticKind = "tap" | "success" | "error";

const SOURCES: Record<SoundKind, any> = {
  tap: require("../../assets/sounds/codebreaker/tap.wav"),
  correct: require("../../assets/sounds/codebreaker/correct.wav"),
  wrong: require("../../assets/sounds/codebreaker/wrong.wav"),
  combo: require("../../assets/sounds/codebreaker/combo.wav"),
  win: require("../../assets/sounds/codebreaker/win.wav"),
};

let soundOn = true;
let hapticsOn = true;

export const setFeedbackSettings = (s: {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}) => {
  soundOn = s.soundEnabled;
  hapticsOn = s.hapticsEnabled;
};

/* Sound effects */

let audioReady = false;

const ensureAudio = async () => {
  if (audioReady) return;

  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
    });
    audioReady = true;
  } catch (error) {
    console.warn("Audio setup failed:", error);
  }
};

const play = async (kind: SoundKind) => {
  try {
    await ensureAudio();

    const player = createAudioPlayer(SOURCES[kind]);

    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        if (status.didJustFinish) {
          subscription.remove();
          player.release();
        }
      }
    );

    player.play();
  } catch (error) {
    console.warn("Sound failed:", error);
  }
};

export const playSound = (kind: SoundKind) => {
  if (!soundOn) return;
  void play(kind);
};

export const previewSound = () => {
  void play("tap");
};

/* Haptic feedback */

const buzz = (kind: HapticKind) => {
  try {
    if (Platform.OS === "web") {
      const nav: any =
        typeof navigator !== "undefined" ? navigator : null;

      if (nav?.vibrate) {
        nav.vibrate(
          kind === "tap"
            ? 15
            : kind === "success"
              ? [20, 40, 20]
              : [40, 40, 40]
        );
      }
      return;
    }

    if (kind === "tap") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (kind === "success") {
      void Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    } else {
      void Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
    }
  } catch {
    Vibration.vibrate(20);
  }
};

export const haptic = (kind: HapticKind = "tap") => {
  if (!hapticsOn) return;
  buzz(kind);
};

export const previewHaptic = () => buzz("success");

export const feedback = (
  kind: "tap" | "correct" | "wrong" | "combo" | "win"
) => {
  playSound(kind);
  haptic(
    kind === "wrong"
      ? "error"
      : kind === "tap"
        ? "tap"
        : "success"
  );
};
