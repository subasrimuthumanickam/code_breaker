import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface LockAnimationProps {
  /** Final on-screen size (square). The drawing is made at 280 and scaled. */
  size?: number;
  /** Numbers that orbit the lock */
  digits?: string[];
}



const BASE = 280;
const LOOP_MS = 7000; // one full "key opens lock" cycle
const ORBIT_MS = 14000; // one full turn of the numbers
const ORBIT_RADIUS = 104;
const ORBIT_CENTER = { x: 140, y: 142 };
const TILE = 46;

// lock body
const BODY_W = 124;
const BODY_H = 100;
const BODY_LEFT = (BASE - BODY_W) / 2; // 78
const BODY_TOP = 120;

// shackle (the U on top)
const SH_W = 64;
const SH_H = 66;
const SH_LEFT = (BASE - SH_W) / 2; // 108
const SH_TOP = BODY_TOP - SH_H + 10; // legs sit 10px inside the body
const PIVOT_X = SH_W / 2 - 5; // right leg
const PIVOT_Y = SH_H / 2 - 8; // near the bottom of the legs

// keyhole centre
const KEYHOLE = { x: BASE / 2, y: BODY_TOP + BODY_H / 2 };

const TILE_BORDERS = ["#22D3EE", "#F5A623", "#22D3EE", "#F5A623"];

const useNative = Platform.OS !== "web";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ORBIT_STEPS = 36;

// Smooth circular motion built from many keyframes (works with the native driver)
const makeOrbit = (orbit: Animated.Value, phase: number, radius: number) => {
  const inputRange = Array.from({ length: ORBIT_STEPS + 1 }, (_, i) => i / ORBIT_STEPS);
  const angle = (i: number) => phase + (i / ORBIT_STEPS) * Math.PI * 2;
  return {
    x: orbit.interpolate({
      inputRange,
      outputRange: inputRange.map((_, i) => Math.cos(angle(i)) * radius),
    }),
    y: orbit.interpolate({
      inputRange,
      outputRange: inputRange.map((_, i) => Math.sin(angle(i)) * radius),
    }),
  };
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const LockAnimation: React.FC<LockAnimationProps> = ({
  size = 260,
  digits = ["7", "3", "9", "5"],
}) => {
  const p = useRef(new Animated.Value(0)).current; // key + lock timeline 0 -> 1
  const orbit = useRef(new Animated.Value(0)).current; // numbers 0 -> 1

  useEffect(() => {
    const timeline = Animated.loop(
      Animated.timing(p, {
        toValue: 1,
        duration: LOOP_MS,
        easing: Easing.linear,
        useNativeDriver: useNative,
      })
    );
    const spin = Animated.loop(
      Animated.timing(orbit, {
        toValue: 1,
        duration: ORBIT_MS,
        easing: Easing.linear,
        useNativeDriver: useNative,
      })
    );
    timeline.start();
    spin.start();
    return () => {
      timeline.stop();
      spin.stop();
    };
  }, [p, orbit]);

  /* ---------------- key: comes in, slides into the hole, turns ---------------- */

  const keyOpacity = p.interpolate({
    inputRange: [0, 0.08, 0.84, 0.9, 1],
    outputRange: [0, 1, 1, 0, 0],
  });
  const keyX = p.interpolate({
    inputRange: [0, 0.2, 0.3, 1],
    outputRange: [90, 40, 0, 0],
  });
  const keyY = p.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [44, 0, 0],
  });
  const keyRotate = p.interpolate({
    inputRange: [0, 0.34, 0.46, 1],
    outputRange: ["0deg", "0deg", "90deg", "90deg"],
  });

  /* ---------------- shackle: lifts and swings open, then closes ---------------- */

  const shackleKeys = [0, 0.46, 0.58, 0.82, 0.92, 1];
  const shackleLift = p.interpolate({
    inputRange: shackleKeys,
    outputRange: [0, 0, -12, -12, 0, 0],
  });
  const shackleRotate = p.interpolate({
    inputRange: shackleKeys,
    outputRange: ["0deg", "0deg", "28deg", "28deg", "0deg", "0deg"],
  });

  /* ---------------- unlock feedback ---------------- */

  const lockScale = p.interpolate({
    inputRange: [0, 0.46, 0.5, 0.58, 0.66, 1],
    outputRange: [1, 1, 0.96, 1.05, 1, 1],
  });
  const greenTint = p.interpolate({
    inputRange: [0, 0.5, 0.58, 0.82, 0.92, 1],
    outputRange: [0, 0, 0.3, 0.3, 0, 0],
  });
  const burstScale = p.interpolate({
    inputRange: [0, 0.56, 0.72, 1],
    outputRange: [0.5, 0.5, 2.3, 2.3],
  });
  const burstOpacity = p.interpolate({
    inputRange: [0, 0.56, 0.58, 0.72, 1],
    outputRange: [0, 0, 0.9, 0, 0],
  });
  const haloScale = p.interpolate({
    inputRange: [0, 0.5, 0.6, 0.85, 1],
    outputRange: [1, 1, 1.12, 1.12, 1],
  });

  /* ---------------- numbers ---------------- */

  const tiles = digits.map((d, i) => {
    const phase = (i / digits.length) * Math.PI * 2 - Math.PI / 2;
    const { x, y } = makeOrbit(orbit, phase, ORBIT_RADIUS);
    const rotate = orbit.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", i % 2 === 0 ? "360deg" : "-360deg"],
    });
    return { d, i, x, y, rotate };
  });

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View style={[styles.stage, { transform: [{ scale: size / BASE }] }]}>
        {/* soft halo behind the lock */}
        <Animated.View style={[styles.halo, { transform: [{ scale: haloScale }] }]} />

        {/* ring burst when it unlocks */}
        <Animated.View
          style={[
            styles.burst,
            { opacity: burstOpacity, transform: [{ scale: burstScale }] },
          ]}
        />

        {/* the lock (shackle + body) */}
        <Animated.View style={[styles.fill, { transform: [{ scale: lockScale }] }]}>
          {/* shackle is drawn first so the body covers the bottom of its legs */}
          <Animated.View
            style={[
              styles.shackle,
              {
                transform: [
                  { translateY: shackleLift },
                  { translateX: PIVOT_X },
                  { translateY: PIVOT_Y },
                  { rotate: shackleRotate },
                  { translateY: -PIVOT_Y },
                  { translateX: -PIVOT_X },
                ],
              },
            ]}
          />

          <LinearGradient
            colors={["#DDD6FE", "#A78BFA", "#7C3AED"]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.body}
          >
            <Animated.View style={[styles.bodyTint, { opacity: greenTint }]} />
          </LinearGradient>

          {/* keyhole */}
          <View style={styles.keyholeDot} />
          <View style={styles.keyholeSlot} />
        </Animated.View>

        {/* orbiting numbers */}
        {tiles.map((t) => (
          <Animated.View
            key={t.i}
            style={[
              styles.tile,
              {
                borderColor: TILE_BORDERS[t.i % TILE_BORDERS.length],
                transform: [{ translateX: t.x }, { translateY: t.y }, { rotate: t.rotate }],
              },
            ]}
          >
            <Text style={styles.tileText}>{t.d}</Text>
          </Animated.View>
        ))}

        {/* the key: pivot is the tip, so it turns inside the keyhole */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.keyPivot,
            {
              opacity: keyOpacity,
              transform: [{ translateX: keyX }, { translateY: keyY }, { rotate: keyRotate }],
            },
          ]}
        >
          <View style={styles.keyShaft} />
          <View style={[styles.keyTooth, { left: 8 }]} />
          <View style={[styles.keyTooth, { left: 19 }]} />
          <View style={styles.keyRing} />
        </Animated.View>
      </View>
    </View>
  );
};

export default LockAnimation;

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  stage: { width: BASE, height: BASE },

  // same as the old StyleSheet.absoluteFillObject (removed in newer React Native)
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  halo: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    left: (BASE - 210) / 2,
    top: ORBIT_CENTER.y - 105,
    backgroundColor: "rgba(139,92,246,0.22)",
  },
  burst: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    left: KEYHOLE.x - 60,
    top: KEYHOLE.y - 60,
    borderWidth: 3,
    borderColor: "#34D399",
  },

  shackle: {
    position: "absolute",
    left: SH_LEFT,
    top: SH_TOP,
    width: SH_W,
    height: SH_H,
    borderWidth: 11,
    borderBottomWidth: 0,
    borderTopLeftRadius: SH_W / 2,
    borderTopRightRadius: SH_W / 2,
    borderColor: "#A5B4FC",
  },
  body: {
    position: "absolute",
    left: BODY_LEFT,
    top: BODY_TOP,
    width: BODY_W,
    height: BODY_H,
    borderRadius: 26,
    overflow: "hidden",
  },
  bodyTint: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#34D399",
  },
  keyholeDot: {
    position: "absolute",
    left: KEYHOLE.x - 9,
    top: KEYHOLE.y - 16,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#2E1A7A",
  },
  keyholeSlot: {
    position: "absolute",
    left: KEYHOLE.x - 4,
    top: KEYHOLE.y - 4,
    width: 8,
    height: 22,
    borderRadius: 4,
    backgroundColor: "#2E1A7A",
  },

  tile: {
    position: "absolute",
    left: ORBIT_CENTER.x - TILE / 2,
    top: ORBIT_CENTER.y - TILE / 2,
    width: TILE,
    height: TILE,
    borderRadius: 13,
    borderWidth: 2,
    backgroundColor: "#141852",
    alignItems: "center",
    justifyContent: "center",
  },
  tileText: { color: "#FFFFFF", fontSize: 22, fontWeight: "900" },

  /* key: 2x2 pivot box exactly on the keyhole; the key hangs off to the right */
  keyPivot: {
    position: "absolute",
    left: KEYHOLE.x - 1,
    top: KEYHOLE.y - 1,
    width: 2,
    height: 2,
  },
  keyShaft: {
    position: "absolute",
    left: 0,
    top: -4,
    width: 60,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FBBF24",
  },
  keyTooth: {
    position: "absolute",
    top: 3,
    width: 6,
    height: 9,
    borderRadius: 2,
    backgroundColor: "#FBBF24",
  },
  keyRing: {
    position: "absolute",
    left: 54,
    top: -13,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 6,
    borderColor: "#FBBF24",
  },
});