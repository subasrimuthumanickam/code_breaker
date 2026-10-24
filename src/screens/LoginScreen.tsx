

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  Easing,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { LoginResponse } from "../api/api";

type Props = {
  /** (not used anymore) kept optional so old callers don't break */
  onLogin?: (user: LoginResponse) => void;
  /** "Login" button pressed -> App.tsx navigates to CreateAccount */
  onLoginPress: () => void;
  /** "Play as Guest" pressed -> App.tsx navigates to GuestChoice */
  onGuestPress: () => void;
};

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

// native driver is not available on web (avoids warnings)
const ND = Platform.OS !== "web";

const NAVY = "#1B2A6B";
const CREAM = "#FDF8F1";
const YELLOW = "#FFC21A";

// web-only style helper (cursor etc.)
const web = (s: object) => (Platform.OS === "web" ? (s as any) : null);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** 0 -> 1 -> 0 forever (smooth). Optional start delay. */
const useLoop = (duration: number, delay = 0) => {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: ND,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: ND,
        }),
      ])
    );
    const timer = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return v;
};

const hexToRgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const lerpColor = (a: string, b: string, t: number) => {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const m = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${m(r1, r2)},${m(g1, g2)},${m(b1, b2)})`;
};

/** Gradient without any extra package (thin colour strips). */
const GradientFill: React.FC<{
  from: string;
  to: string;
  direction: "horizontal" | "vertical";
  steps?: number;
}> = ({ from, to, direction, steps = 16 }) => {
  const strips = useMemo(
    () =>
      Array.from({ length: steps }, (_, i) =>
        lerpColor(from, to, i / (steps - 1))
      ),
    [from, to, steps]
  );

  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { flexDirection: direction === "horizontal" ? "row" : "column" },
      ]}
    >
      {strips.map((c, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: c }} />
      ))}
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Background pieces                                                   */
/* ------------------------------------------------------------------ */

/** Soft blob / hill that slowly drifts. */
const Orb: React.FC<{
  size: number;
  color: string;
  top: number;
  left: number;
  dx?: number;
  dy?: number;
  duration?: number;
  minOpacity?: number;
  maxOpacity?: number;
}> = ({
  size,
  color,
  top,
  left,
  dx = 10,
  dy = 8,
  duration = 6000,
  minOpacity = 0.9,
  maxOpacity = 1,
}) => {
  const t = useLoop(duration);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: t.interpolate({
          inputRange: [0, 1],
          outputRange: [minOpacity, maxOpacity],
        }),
        transform: [
          { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, dx] }) },
          { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, dy] }) },
        ],
      }}
    />
  );
};

/** Bobs up/down and wobbles. */
const FloatItem: React.FC<{
  style: object;
  rotate?: number;
  amp?: number;
  duration?: number;
  delay?: number;
  children: React.ReactNode;
}> = ({ style, rotate = 0, amp = 8, duration = 2400, delay = 0, children }) => {
  const t = useLoop(duration, delay);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: "absolute" },
        style,
        {
          transform: [
            { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [-amp, amp] }) },
            {
              rotate: t.interpolate({
                inputRange: [0, 1],
                outputRange: [`${rotate - 5}deg`, `${rotate + 5}deg`],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const Twinkle: React.FC<{
  left: number;
  top: number;
  size: number;
  color: string;
  delay?: number;
}> = ({ left, top, size, color, delay = 0 }) => {
  const t = useLoop(900, delay);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        top,
        opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }),
        transform: [
          { scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.2] }) },
        ],
      }}
    >
      <MaterialCommunityIcons name="star-four-points" size={size} color={color} />
    </Animated.View>
  );
};

/** Pastel dots slowly rising. */
const Confetti: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const dots = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        x: Math.random() * width,
        size: 6 + Math.random() * 8,
        dur: 9000 + Math.random() * 8000,
        delay: Math.random() * 6000,
        color: ["#FFD95A", "#F9A8D4", "#7DD3FC", "#C4B5FD", "#86EFAC"][i % 5],
        anim: new Animated.Value(0),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const loops = dots.map((d) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(d.delay),
          Animated.timing(d.anim, {
            toValue: 1,
            duration: d.dur,
            easing: Easing.linear,
            useNativeDriver: ND,
          }),
        ])
      );
      loop.start();
      return loop;
    });
    return () => loops.forEach((l) => l.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {dots.map((d, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            left: d.x,
            top: 0,
            width: d.size,
            height: d.size,
            borderRadius: d.size / 2,
            backgroundColor: d.color,
            opacity: d.anim.interpolate({
              inputRange: [0, 0.1, 0.8, 1],
              outputRange: [0, 0.7, 0.5, 0],
            }),
            transform: [
              {
                translateY: d.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height + 20, -30],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Decorations (built from shapes, no images needed)                   */
/* ------------------------------------------------------------------ */

const Block: React.FC<{
  size: number;
  color: string;
  children?: React.ReactNode;
}> = ({ size, color, children }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.26,
      backgroundColor: color,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.6)",
      borderBottomWidth: 4,
      borderBottomColor: "rgba(0,0,0,0.12)",
      shadowColor: color,
      shadowOpacity: 0.45,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 6,
    }}
  >
    {children}
  </View>
);

const Letter: React.FC<{ size: number; text: string }> = ({ size, text }) => (
  <Text style={{ color: "#FFFFFF", fontSize: size * 0.52, fontWeight: "900" }}>
    {text}
  </Text>
);

/** A B C blocks (2x2) */
const AbcBlocks: React.FC<{ size: number }> = ({ size }) => {
  const b = size / 2 - 3;
  return (
    <View style={{ width: size, height: size }}>
      <View style={{ flexDirection: "row" }}>
        <Block size={b} color="#8B5CF6">
          <Letter size={b} text="A" />
        </Block>
        <View style={{ width: 6 }} />
        <Block size={b} color="#F472B6">
          <Letter size={b} text="B" />
        </Block>
      </View>
      <View style={{ height: 6 }} />
      <View style={{ flexDirection: "row" }}>
        <Block size={b} color="#FACC15" />
        <View style={{ width: 6 }} />
        <Block size={b} color="#38BDF8">
          <Letter size={b} text="C" />
        </Block>
      </View>
    </View>
  );
};

/** + - x / blocks (2x2) */
const CalcBlocks: React.FC<{ size: number }> = ({ size }) => {
  const b = size / 2 - 3;
  return (
    <View style={{ width: size, height: size }}>
      <View style={{ flexDirection: "row" }}>
        <Block size={b} color="#8B5CF6">
          <Letter size={b} text="+" />
        </Block>
        <View style={{ width: 6 }} />
        <Block size={b} color="#38BDF8">
          <Letter size={b} text="×" />
        </Block>
      </View>
      <View style={{ height: 6 }} />
      <View style={{ flexDirection: "row" }}>
        <Block size={b} color="#F472B6">
          <Letter size={b} text="−" />
        </Block>
        <View style={{ width: 6 }} />
        <Block size={b} color="#FACC15">
          <Letter size={b} text="÷" />
        </Block>
      </View>
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Mascot: winking brain + glowing light bulb                          */
/* ------------------------------------------------------------------ */

const Mascot: React.FC<{ size: number }> = ({ size }) => {
  const bob = useLoop(1100);
  const wiggle = useLoop(1700, 200);
  const glow = useLoop(900);
  const wink = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(2000),
        Animated.timing(wink, { toValue: 1, duration: 100, useNativeDriver: ND }),
        Animated.delay(450),
        Animated.timing(wink, { toValue: 0, duration: 120, useNativeDriver: ND }),
      ])
    );
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const W = size * 1.6;
  const H = size * 1.45;
  const brainTop = size * 0.36;
  const cx = W / 2;
  const cy = brainTop + size / 2;

  const eyeW = size * 0.1;
  const eyeH = size * 0.15;

  // yellow "burst" drops around the brain
  const drops = [
    { dx: -0.66, dy: -0.2, rot: -38 },
    { dx: -0.78, dy: 0.1, rot: -62 },
    { dx: -0.8, dy: 0.4, rot: -80 },
    { dx: 0.66, dy: -0.2, rot: 38 },
    { dx: 0.78, dy: 0.1, rot: 62 },
    { dx: 0.8, dy: 0.4, rot: 80 },
  ];
  const dropW = size * 0.065;
  const dropH = size * 0.2;

  return (
    <View style={{ width: W, height: H, alignItems: "center" }}>
      {/* burst */}
      {drops.map((d, i) => (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={{
            position: "absolute",
            left: cx + d.dx * size - dropW / 2,
            top: cy + d.dy * size - dropH / 2,
            width: dropW,
            height: dropH,
            borderRadius: dropW,
            backgroundColor: YELLOW,
            opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }),
            transform: [
              { rotate: `${d.rot}deg` },
              {
                scaleY: glow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [i % 2 ? 0.85 : 1, i % 2 ? 1.1 : 0.9],
                }),
              },
            ],
          }}
        />
      ))}

      {/* bulb glow + bulb */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -size * 0.04,
          width: size * 0.62,
          height: size * 0.62,
          borderRadius: size * 0.31,
          backgroundColor: "#FFE58A",
          opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.6] }),
          transform: [
            { scale: glow.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.3] }) },
          ],
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          transform: [
            { scale: glow.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.08] }) },
          ],
        }}
      >
        <MaterialCommunityIcons name="lightbulb-on" size={size * 0.44} color={YELLOW} />
      </Animated.View>

      {/* brain */}
      <Animated.View
        style={{
          position: "absolute",
          top: brainTop,
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
          transform: [
            { translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [-4, 4] }) },
            {
              rotate: wiggle.interpolate({
                inputRange: [0, 1],
                outputRange: ["-4deg", "4deg"],
              }),
            },
          ],
        }}
      >
        <MaterialCommunityIcons name="brain" size={size} color="#F7A1BA" />

        {/* face */}
        <View
          pointerEvents="none"
          style={{ position: "absolute", top: size * 0.36, alignItems: "center" }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* left eye */}
            <View
              style={{
                width: eyeW,
                height: eyeH,
                borderRadius: eyeW / 2,
                backgroundColor: NAVY,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: eyeH * 0.15,
                  left: eyeW * 0.2,
                  width: eyeW * 0.4,
                  height: eyeW * 0.4,
                  borderRadius: eyeW,
                  backgroundColor: "#FFFFFF",
                }}
              />
            </View>
            <View style={{ width: size * 0.15 }} />
            {/* right eye (winks) */}
            <Animated.View
              style={{
                width: eyeW,
                height: eyeH,
                borderRadius: eyeW / 2,
                backgroundColor: NAVY,
                transform: [
                  {
                    scaleY: wink.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.12],
                    }),
                  },
                ],
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: eyeH * 0.15,
                  left: eyeW * 0.2,
                  width: eyeW * 0.4,
                  height: eyeW * 0.4,
                  borderRadius: eyeW,
                  backgroundColor: "#FFFFFF",
                }}
              />
            </Animated.View>
          </View>

          {/* mouth */}
          <View
            style={{
              marginTop: size * 0.04,
              width: size * 0.22,
              height: size * 0.12,
              backgroundColor: "#8A1538",
              borderBottomLeftRadius: size * 0.12,
              borderBottomRightRadius: size * 0.12,
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                width: size * 0.12,
                height: size * 0.07,
                borderTopLeftRadius: size * 0.07,
                borderTopRightRadius: size * 0.07,
                backgroundColor: "#FF7A93",
              }}
            />
          </View>

          {/* cheeks */}
          <View
            style={{
              position: "absolute",
              top: eyeH * 0.85,
              left: -size * 0.12,
              width: size * 0.11,
              height: size * 0.065,
              borderRadius: size * 0.05,
              backgroundColor: "rgba(255,90,130,0.55)",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: eyeH * 0.85,
              right: -size * 0.12,
              width: size * 0.11,
              height: size * 0.065,
              borderRadius: size * 0.05,
              backgroundColor: "rgba(255,90,130,0.55)",
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Pill button (Login = yellow, Play as Guest = light blue)            */
/* ------------------------------------------------------------------ */

type PillProps = {
  label: string;
  icon: IconName;
  variant: "yellow" | "blue";
  onPress: () => void;
  unit: number; // responsive scale
  shineDelay?: number;
  style?: object;
};

const PillButton: React.FC<PillProps> = ({
  label,
  icon,
  variant,
  onPress,
  unit,
  shineDelay = 0,
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const shine = useRef(new Animated.Value(0)).current;
  const star = useLoop(800, shineDelay);
  const [w, setW] = useState(320);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(2200 + shineDelay),
        Animated.timing(shine, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: ND,
        }),
        Animated.timing(shine, { toValue: 0, duration: 0, useNativeDriver: ND }),
      ])
    );
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const to = (v: number, friction = 6, tension = 200) =>
    Animated.spring(scale, {
      toValue: v,
      friction,
      tension,
      useNativeDriver: ND,
    }).start();

  const yellow = variant === "yellow";
  const circle = Math.round(46 * unit);

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        onPressIn={() => to(0.96)}
        onPressOut={() => to(1, 4, 160)}
        // hover (website only, ignored on phones)
        {...({
          onHoverIn: () => to(1.03),
          onHoverOut: () => to(1),
        } as any)}
        style={[
          styles.pillShadow,
          yellow ? styles.shadowYellow : styles.shadowBlue,
          web({ cursor: "pointer" }),
        ]}
      >
        <View
          onLayout={(e) => setW(e.nativeEvent.layout.width)}
          style={[
            styles.pillInner,
            {
              paddingVertical: Math.round(13 * unit),
              paddingHorizontal: Math.round(14 * unit),
            },
            yellow ? styles.innerYellow : styles.innerBlue,
          ]}
        >
          {yellow ? (
            <GradientFill from="#FFE770" to="#FFBE1F" direction="vertical" steps={14} />
          ) : (
            <GradientFill from="#C4EEFF" to="#79C9FF" direction="vertical" steps={14} />
          )}

          {/* top gloss */}
          <View style={styles.gloss} />

          {/* icon bubble */}
          <View
            style={{
              width: circle,
              height: circle,
              borderRadius: circle / 2,
              backgroundColor: yellow ? "#FFF6DD" : "#F2FAFF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons name={icon} size={circle * 0.56} color={NAVY} />
            <Animated.View
              style={{
                position: "absolute",
                top: -3,
                right: -3,
                opacity: star.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
                transform: [
                  { scale: star.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.2] }) },
                ],
              }}
            >
              <MaterialCommunityIcons
                name="star-four-points"
                size={14}
                color={yellow ? YELLOW : "#38BDF8"}
              />
            </Animated.View>
          </View>

          <Text
            numberOfLines={1}
            style={[styles.pillText, { fontSize: Math.round(21 * unit) }]}
          >
            {label}
          </Text>

          <MaterialCommunityIcons
            name="arrow-right"
            size={Math.round(26 * unit)}
            color={NAVY}
            style={{ marginRight: 6 }}
          />

          {/* shine sweep */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.shineBand,
              {
                transform: [
                  {
                    translateX: shine.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-80, w + 80],
                    }),
                  },
                  { skewX: "-20deg" },
                ],
              },
            ]}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export default function LoginScreen({ onLoginPress, onGuestPress }: Props) {
  const { width, height } = useWindowDimensions();

  /* ---------- entrance animation values ---------- */
  const headerIn = useRef(new Animated.Value(0)).current;
  const mascotIn = useRef(new Animated.Value(0)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const taglineIn = useRef(new Animated.Value(0)).current;
  const buttonsIn = useRef(new Animated.Value(0)).current;
  const footerIn = useRef(new Animated.Value(0)).current;

  /* ---------- looping animation values ---------- */
  const shine = useRef(new Animated.Value(0)).current; // title shimmer
  const loginPulse = useLoop(900); // Login button breathing

  useEffect(() => {
    // staggered bouncy entrance
    Animated.stagger(130, [
      Animated.timing(headerIn, {
        toValue: 1,
        duration: 450,
        useNativeDriver: ND,
      }),
      Animated.spring(mascotIn, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: ND,
      }),
      Animated.spring(titleIn, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: ND,
      }),
      Animated.timing(taglineIn, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: ND,
      }),
      Animated.timing(buttonsIn, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: ND,
      }),
      Animated.timing(footerIn, {
        toValue: 1,
        duration: 500,
        useNativeDriver: ND,
      }),
    ]).start();

    // title shimmer sweep
    const shineLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(1800),
        Animated.timing(shine, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: ND,
        }),
        Animated.timing(shine, { toValue: 0, duration: 0, useNativeDriver: ND }),
      ])
    );
    shineLoop.start();

    return () => shineLoop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- responsive sizes ----------
     phone   : width < 600
     tablet  : 600 - 1023
     website : >= 1024  (centered "stage", background fills the screen)
  ------------------------------------------------------------------ */
  const isDesktop = width >= 1024;
  const stageW = Math.min(width, isDesktop ? 800 : 640);
  const colW = Math.min(stageW - 40, 460);
  const unit = Math.min(Math.max(colW / 350, 0.9), 1.25); // button / text scale
  const deco = Math.min(Math.max(stageW / 390, 0.9), 1.3); // decoration scale
  const short = height < 700; // small / landscape phones

  const mascotSize = Math.round(
    Math.min(Math.max(stageW * 0.3, 104), 160) * (short ? 0.82 : 1)
  );
  const mindSize = Math.round(Math.min(Math.max(colW * 0.17, 48), 80));
  const gamesSize = Math.round(mindSize * 0.88);
  const stageLeft = (width - stageW) / 2;
  const statusPad = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  /* ---------- derived animated styles ---------- */

  const slideUp = (v: Animated.Value, dist = 24) => ({
    opacity: v,
    transform: [
      {
        translateY: v.interpolate({
          inputRange: [0, 1],
          outputRange: [dist, 0],
        }),
      },
    ],
  });

  const popIn = (v: Animated.Value) => ({
    opacity: v,
    transform: [
      { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
    ],
  });

  const shineStyle = {
    transform: [
      {
        translateX: shine.interpolate({ inputRange: [0, 1], outputRange: [-160, 360] }),
      },
      { skewX: "-20deg" as const },
    ],
  };

  const tile = Math.round(66 * deco);
  const hillTop = (visible: number) => height - visible;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={CREAM} />

      {/* ================= background (full screen) ================= */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* soft pastel blobs */}
        <Orb size={Math.max(width * 0.6, 280)} color="#FFE9A6"
          top={-Math.max(width * 0.6, 280) * 0.5} left={-Math.max(width * 0.6, 280) * 0.45}
          dx={14} dy={10} duration={7000} minOpacity={0.85} maxOpacity={1} />
        <Orb size={Math.max(width * 0.5, 260)} color="#E4E8FB"
          top={-Math.max(width * 0.5, 260) * 0.4} left={width - Math.max(width * 0.5, 260) * 0.55}
          dx={-12} dy={10} duration={8000} minOpacity={0.8} maxOpacity={1} />
        <Orb size={Math.max(width * 0.14, 70)} color="#FBD5E4"
          top={height * 0.33} left={width - Math.max(width * 0.14, 70) * 0.55}
          dx={-6} dy={8} duration={5000} minOpacity={0.55} maxOpacity={0.8} />
        <Orb size={Math.max(width * 0.12, 60)} color="#D4EAFB"
          top={height * 0.44} left={-Math.max(width * 0.12, 60) * 0.5}
          dx={6} dy={8} duration={5500} minOpacity={0.6} maxOpacity={0.85} />

        <Confetti width={width} height={height} />

        {/* hills (bottom) */}
        <Orb size={Math.max(width * 1.1, 640)} color="#5CC8FF"
          top={hillTop(100)} left={-Math.max(width * 1.1, 640) * 0.4}
          dx={10} dy={-6} duration={6500} minOpacity={0.95} maxOpacity={1} />
        <Orb size={Math.max(width * 1.2, 760)} color="#A8DD72"
          top={hillTop(72)} left={width * 0.18}
          dx={-12} dy={-5} duration={7200} minOpacity={0.95} maxOpacity={1} />
        <Orb size={Math.max(width * 0.9, 520)} color="#FFD454"
          top={hillTop(46)} left={width * 0.6}
          dx={8} dy={-5} duration={6000} minOpacity={0.95} maxOpacity={1} />
      </View>

      {/* ================= stage (centered on websites) ================= */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: stageLeft,
          width: stageW,
        }}
      >
        {/* sparkles */}
        <Twinkle left={stageW * 0.3} top={height * 0.13} size={14} color={YELLOW} />
        <Twinkle left={stageW * 0.78} top={height * 0.3} size={12} color="#38BDF8" delay={300} />
        <Twinkle left={stageW * 0.14} top={height * 0.42} size={12} color="#F472B6" delay={600} />
        <Twinkle left={stageW * 0.9} top={height * 0.6} size={10} color={YELLOW} delay={900} />

        {/* ? tile */}
        <FloatItem style={{ left: -tile * 0.12, top: height * 0.16 }} rotate={-14} duration={2500}>
          <Block size={tile} color="#FF9A2E">
            <Text style={{ color: "#FFFFFF", fontSize: tile * 0.6, fontWeight: "900" }}>?</Text>
          </Block>
        </FloatItem>

        {/* ABC blocks */}
        <FloatItem style={{ right: -tile * 0.1, top: height * 0.17 }} rotate={10} duration={2900} delay={300}>
          <AbcBlocks size={Math.round(84 * deco)} />
        </FloatItem>

        {/* puzzle piece */}
        <FloatItem style={{ left: stageW * 0.015, top: height * 0.31 }} rotate={-12} duration={3100} delay={600}>
          <MaterialCommunityIcons name="puzzle" size={Math.round(72 * deco)} color="#2DD4A8" />
        </FloatItem>

        {/* light bulb */}
        <FloatItem style={{ right: stageW * 0.015, top: height * 0.4 }} rotate={14} duration={2700} delay={900}>
          <MaterialCommunityIcons name="lightbulb-on" size={Math.round(62 * deco)} color={YELLOW} />
        </FloatItem>

        {/* calculator blocks (bottom left) */}
        <FloatItem style={{ left: stageW * 0.02, bottom: height * 0.03 }} rotate={-6} duration={2600} amp={6}>
          <CalcBlocks size={Math.round(80 * deco)} />
        </FloatItem>

        {/* trophy (bottom right) */}
        <FloatItem style={{ right: stageW * 0.03, bottom: height * 0.025 }} rotate={4} duration={2200} amp={6}>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <MaterialCommunityIcons name="leaf" size={Math.round(30 * deco)} color="#4CAF50" style={{ marginRight: -6, transform: [{ rotate: "-20deg" }] }} />
            <MaterialCommunityIcons name="trophy" size={Math.round(78 * deco)} color={YELLOW} />
            <MaterialCommunityIcons name="leaf" size={Math.round(28 * deco)} color="#4CAF50" style={{ marginLeft: -6, transform: [{ rotate: "25deg" }] }} />
          </View>
        </FloatItem>

        {/* greeting (top left) */}
        <Animated.View
          style={[
            styles.header,
            { top: 14 + statusPad, left: 18 },
            { opacity: headerIn },
          ]}
        >
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="face-woman" size={34} color="#F472B6" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.helloSmall}>Hello,</Text>
            <Text style={styles.helloName}>Player</Text>
          </View>
        </Animated.View>
      </View>

      {/* ================= content ================= */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: width < 420 ? 70 : 28 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: colW, alignItems: "center" }}>
          {/* mascot */}
          <Animated.View style={popIn(mascotIn)}>
            <Mascot size={mascotSize} />
          </Animated.View>

          {/* title */}
          <Animated.View style={[{ marginTop: short ? 0 : 4 }, popIn(titleIn)]}>
            <View style={styles.titleFrame}>
              <Text
                style={[
                  styles.titleTop,
                  { fontSize: mindSize, lineHeight: mindSize * 1.05 },
                ]}
              >
                MIND
              </Text>
              <Text
                style={[
                  styles.titleBottom,
                  { fontSize: gamesSize, lineHeight: gamesSize * 1.05 },
                ]}
              >
                GAMES
              </Text>
              <Animated.View pointerEvents="none" style={[styles.shine, shineStyle]} />
            </View>
          </Animated.View>

          {/* tagline */}
          <Animated.Text
            style={[
              styles.tagline,
              {
                fontSize: Math.round(19 * unit),
                marginTop: short ? 10 : 16,
                marginBottom: short ? 18 : 28,
              },
              slideUp(taglineIn, 14),
            ]}
          >
            Think   ·   Solve   ·   Unlock
          </Animated.Text>

          {/* buttons */}
          <Animated.View style={[{ width: "100%" }, slideUp(buttonsIn, 40)]}>
            <Animated.View
              style={{
                transform: [
                  {
                    scale: loginPulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.02],
                    }),
                  },
                ],
              }}
            >
              <PillButton
                label="Login"
                icon="account"
                variant="yellow"
                unit={unit}
                onPress={onLoginPress}
              />
            </Animated.View>

            <PillButton
              label="Play as Guest"
              icon="gamepad-variant"
              variant="blue"
              unit={unit}
              shineDelay={700}
              onPress={onGuestPress}
              style={{ marginTop: Math.round(18 * unit) }}
            />
          </Animated.View>

          {/* footer */}
          <Animated.View style={[styles.footerRow, { opacity: footerIn }]}>
            <MaterialCommunityIcons name="shield-check" size={22} color="#22B573" />
            <Text style={[styles.footer, { fontSize: Math.round(13.5 * unit) }]}>
              Your progress is saved to your account
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CREAM,
    overflow: "hidden",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 90, // keep content above the hills
    paddingHorizontal: 20,
  },

  header: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFEFF4",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F472B6",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  helloSmall: {
    fontSize: 13,
    color: "#46538A",
  },

  helloName: {
    fontSize: 22,
    fontWeight: "800",
    color: NAVY,
  },

  titleFrame: {
    alignItems: "center",
    backgroundColor: "#22308A",
    borderWidth: 4,
    borderColor: "#2E3FB0",
    borderRadius: 36,
    paddingHorizontal: 30,
    paddingTop: 8,
    paddingBottom: 14,
    overflow: "hidden",
    shadowColor: "#22308A",
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  titleTop: {
    fontWeight: "900",
    letterSpacing: 2,
    color: YELLOW,
    textShadowColor: "#E07A00",
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 0,
    ...(Platform.OS === "web"
      ? ({
          fontFamily:
            '"Baloo 2","Fredoka","Trebuchet MS","Segoe UI",system-ui,sans-serif',
        } as any)
      : null),
  },

  titleBottom: {
    fontWeight: "900",
    letterSpacing: 1,
    color: "#FFFFFF",
    textShadowColor: "#8DB8FF",
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 0,
    ...(Platform.OS === "web"
      ? ({
          fontFamily:
            '"Baloo 2","Fredoka","Trebuchet MS","Segoe UI",system-ui,sans-serif',
        } as any)
      : null),
  },

  shine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 50,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  tagline: {
    color: NAVY,
    fontStyle: "italic",
    fontWeight: "600",
    letterSpacing: 0.5,
    ...Platform.select({
      ios: { fontFamily: "Noteworthy" },
      android: { fontFamily: "cursive" },
      web: { fontFamily: '"Segoe Print","Comic Sans MS",cursive' } as any,
      default: {},
    }),
  },

  pillShadow: {
    borderRadius: 999,
  },

  shadowYellow: {
    shadowColor: "#F5A200",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  shadowBlue: {
    shadowColor: "#2F9BFF",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  pillInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 3,
    borderBottomWidth: 6,
  },

  innerYellow: {
    borderColor: "#FFB300",
    borderBottomColor: "#F29A00",
  },

  innerBlue: {
    borderColor: "#3AA7FF",
    borderBottomColor: "#2386E8",
  },

  gloss: {
    position: "absolute",
    top: 5,
    left: 26,
    width: 54,
    height: 11,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  pillText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "800",
    color: NAVY,
  },

  shineBand: {
    position: "absolute",
    top: -10,
    bottom: -10,
    width: 46,
    backgroundColor: "rgba(255,255,255,0.45)",
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },

  footer: {
    marginLeft: 8,
    color: "#3F4D82",
    textAlign: "center",
  },
});
