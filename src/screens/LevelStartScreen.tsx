import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LevelStartScreenProps {
  /** level shown in the circle (null while the round is still loading) */
  level: number | null;
  /** true while the room / first round is being prepared by the backend */
  loading: boolean;
  /** error from the backend (shown with a Try again button) */
  error?: string | null;
  onStart: () => void;
  onRetry: () => void;
  onBack: () => void;
}

const C = {
  bg: "#C9F3EE",
  bgSoft: "#DDF8F1",
  cloud: "#F2FFFB",
  mint: "#8FE3C8",
  teal: "#3FC9B0",
  purple: "#8B7BEF",
  greenOuter: "#FFFFFF",
  greenRing: "#12C95C",
  green: "#0E9F48",
  greenDark: "#0A7A37",
  startText: "#A8F0C6",
  ray: "#FFD21F",
  star: "#FFC21A",
  ink: "#0F3D3E",
  red: "#F0566A",
};

const CIRCLE = 230;
const RAY_BOX = CIRCLE + 70;
const RAY_ANGLES = [-45, 0, 45, 90, 135, 180, 225, 270].map((a) => a + 22.5);

/* small decorative star (twinkles) */
const Sparkle: React.FC<{
  style: any;
  size?: number;
  delay?: number;
}> = ({ style, size = 18, delay = 0 }) => {
  const a = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(a, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(a, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.sparkle, style, { opacity: a }]}>
      <Ionicons name="star" size={size} color={C.mint} />
    </Animated.View>
  );
};

const LevelStartScreen: React.FC<LevelStartScreenProps> = ({
  level,
  loading,
  error,
  onStart,
  onRetry,
  onBack,
}) => {
  const pulse = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.35)).current;
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.05,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glow, { toValue: 0.7, duration: 900, useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.35, duration: 900, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ready = !loading && !error && level !== null;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* background clouds + bushes */}
      <View pointerEvents="none" style={[styles.cloud, styles.cloudTopLeft]} />
      <View pointerEvents="none" style={[styles.cloud, styles.cloudTopRight]} />
      <View pointerEvents="none" style={[styles.cloud, styles.cloudMidLeft]} />
      <View pointerEvents="none" style={[styles.cloud, styles.cloudBottomRight]} />
      <View pointerEvents="none" style={[styles.bush, styles.bushLeft]} />
      <View pointerEvents="none" style={[styles.bush, styles.bushLeft2]} />
      <View pointerEvents="none" style={[styles.bush, styles.bushRight]} />
      <View pointerEvents="none" style={[styles.bushPurple, styles.bushPurpleLeft]} />
      <View pointerEvents="none" style={[styles.bushPurple, styles.bushPurpleRight]} />

      <Sparkle style={{ left: "12%", top: "36%" }} size={16} />
      <Sparkle style={{ left: "10%", top: "57%" }} size={22} delay={300} />
      <Sparkle style={{ right: "9%", top: "32%" }} size={24} delay={150} />
      <Sparkle style={{ right: "12%", top: "62%" }} size={22} delay={450} />

      <SafeAreaView style={styles.flex}>
        <Pressable style={styles.backBtn} onPress={onBack} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={C.ink} />
        </Pressable>

        <View style={styles.center}>
          <Animated.View
            style={[
              styles.badgeWrap,
              {
                opacity: enter,
                transform: [
                  { scale: Animated.multiply(enter, pulse) },
                ],
              },
            ]}
          >
            {/* glow */}
            <Animated.View style={[styles.glow, { opacity: glow }]} />

            {/* yellow rays */}
            {RAY_ANGLES.map((deg) => (
              <View
                key={deg}
                pointerEvents="none"
                style={[styles.rayBox, { transform: [{ rotate: `${deg}deg` }] }]}
              >
                <View style={styles.ray} />
              </View>
            ))}

            {/* the Level badge (tap = Start) */}
            <Pressable
              onPress={onStart}
              disabled={!ready}
              style={({ pressed }) => [
                styles.circleOuter,
                pressed && { transform: [{ scale: 0.97 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel={ready ? `Start level ${level}` : "Loading"}
            >
              <View style={styles.circleRing}>
                <View style={styles.circleInner}>
                  <Ionicons name="star" size={46} color={C.star} />

                  <Text style={styles.levelText}>
                    {level !== null ? `Level ${level}` : "Level"}
                  </Text>

                  <Text style={styles.startText}>
                    {error ? "Failed" : loading ? "Loading..." : "Start"}
                  </Text>

                  {loading && !error ? (
                    <ActivityIndicator
                      style={styles.playIcon}
                      size="large"
                      color="#FFFFFF"
                    />
                  ) : error ? (
                    <Ionicons
                      name="alert-circle"
                      size={44}
                      color="#FFFFFF"
                      style={styles.playIcon}
                    />
                  ) : (
                    <Ionicons
                      name="play"
                      size={48}
                      color="#FFFFFF"
                      style={styles.playIcon}
                    />
                  )}
                </View>
              </View>
            </Pressable>
          </Animated.View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText} numberOfLines={3}>
                {error}
              </Text>

              <Pressable style={styles.retryBtn} onPress={onRetry}>
                <Ionicons name="refresh" size={16} color="#FFFFFF" />
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LevelStartScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1 },

  backBtn: {
    position: "absolute",
    top: 14,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#BFE8DE",
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  badgeWrap: {
    width: RAY_BOX,
    height: RAY_BOX,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: CIRCLE + 50,
    height: CIRCLE + 50,
    borderRadius: (CIRCLE + 50) / 2,
    backgroundColor: "#FFE76B",
  },
  rayBox: {
    position: "absolute",
    width: RAY_BOX,
    height: RAY_BOX,
    alignItems: "center",
  },
  ray: {
    width: 7,
    height: 24,
    borderRadius: 4,
    backgroundColor: C.ray,
    marginTop: 0,
  },

  circleOuter: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: C.greenOuter,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0A7A37",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  circleRing: {
    width: CIRCLE - 14,
    height: CIRCLE - 14,
    borderRadius: (CIRCLE - 14) / 2,
    backgroundColor: C.greenRing,
    alignItems: "center",
    justifyContent: "center",
  },
  circleInner: {
    width: CIRCLE - 34,
    height: CIRCLE - 34,
    borderRadius: (CIRCLE - 34) / 2,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: C.greenDark,
  },
  levelText: {
    marginTop: 2,
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0.3,
    textShadowColor: "rgba(10,90,40,0.55)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  startText: {
    color: C.startText,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 2,
  },
  playIcon: { marginTop: 8 },

  errorBox: {
    marginTop: 26,
    alignItems: "center",
    paddingHorizontal: 30,
    gap: 12,
  },
  errorText: {
    color: C.red,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.red,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  retryText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },

  /* decorations */
  sparkle: { position: "absolute" },
  cloud: {
    position: "absolute",
    backgroundColor: C.cloud,
    borderRadius: 999,
    opacity: 0.85,
  },
  cloudTopLeft: { width: 130, height: 90, top: -20, left: -40, backgroundColor: "#A6EFCB" },
  cloudTopRight: { width: 150, height: 80, top: 20, right: -40 },
  cloudMidLeft: { width: 110, height: 80, top: "22%", left: -50, backgroundColor: C.bgSoft },
  cloudBottomRight: { width: 140, height: 80, bottom: "24%", right: -50 },
  bush: {
    position: "absolute",
    bottom: -40,
    width: 120,
    height: 150,
    borderRadius: 70,
    backgroundColor: C.teal,
  },
  bushLeft: { left: -30 },
  bushLeft2: { left: 60, width: 100, height: 110, backgroundColor: "#2FB59C" },
  bushRight: { right: -30, width: 130, height: 140 },
  bushPurple: {
    position: "absolute",
    bottom: -30,
    width: 90,
    height: 80,
    borderRadius: 45,
    backgroundColor: C.purple,
  },
  bushPurpleLeft: { left: 10 },
  bushPurpleRight: { right: 20 },
});
