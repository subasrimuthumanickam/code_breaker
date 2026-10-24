
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
   import { PressableScale } from "../components/motion";
import { playSound } from "../utils/sound";


interface Props {
  coins?: number; // default 30
  onClaim?: () => void | Promise<void>; // called once, when the coins are revealed (save them here)
  onClose: () => void; // called after the user taps "Awesome!"
}

const STAGE_W = 300;
const STAGE_H = 340;
const CONFETTI = ["#FBBF24", "#A855F7", "#EC4899", "#38BDF8", "#34D399", "#F97316"];

// FIX 2: StyleSheet.absoluteFillObject was removed in newer React Native types.
// Use a plain object instead.
const FILL = {
  position: "absolute" as const,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

/* ---------------- coin ---------------- */
const Coin: React.FC<{ size: number }> = ({ size }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: "#F59E0B",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#F59E0B",
      shadowOpacity: 0.6,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 6,
    }}
  >
    <View
      style={{
        width: size * 0.82,
        height: size * 0.82,
        borderRadius: size * 0.41,
        backgroundColor: "#FBBF24",
        borderWidth: size * 0.05,
        borderColor: "#FDE68A",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name="star" size={size * 0.46} color="#FEF3C7" />
    </View>
  </View>
);


const ConfettiBurst: React.FC<{
  play: boolean;
  originX: number;
  originY: number;
  count?: number;
  spread?: number;
}> = ({ play, originX, originY, count = 26, spread = 1 }) => {
  const t = useRef(new Animated.Value(0)).current;

  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = -Math.PI * (0.05 + Math.random() * 0.9); // fans upwards
        const dist = (80 + Math.random() * 140) * spread;
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          fall: 70 + Math.random() * 100,
          size: 8 + Math.random() * 8,
          color: CONFETTI[i % CONFETTI.length],
          star: i % 4 === 0,
          spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540),
        };
      }),
    [count, spread]
  );

  useEffect(() => {
    if (!play) return;
    t.setValue(0);
    Animated.timing(t, {
      toValue: 1,
      duration: 1400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [play]);

  if (!play) return null;

  return (
    <>
      {parts.map((p) => (
        <Animated.View
          key={p.id}
          pointerEvents="none"
          style={{
            position: "absolute",
            left: originX - p.size / 2,
            top: originY,
            width: p.size,
            height: p.star ? p.size : p.size * 0.5,
            borderRadius: 2,
            backgroundColor: p.star ? "transparent" : p.color,
            opacity: t.interpolate({ inputRange: [0, 0.06, 0.7, 1], outputRange: [0, 1, 1, 0] }),
            transform: [
              { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, p.dx] }) },
              { translateY: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, p.dy, p.dy + p.fall] }) },
              { rotate: t.interpolate({ inputRange: [0, 1], outputRange: ["0deg", `${p.spin}deg`] }) },
            ],
          }}
        >
          {p.star ? <Ionicons name="star" size={p.size + 4} color={p.color} /> : null}
        </Animated.View>
      ))}
    </>
  );
};

/* =====================================================
   MAIN
===================================================== */
const GiftRewardModal: React.FC<Props> = ({ coins = 30, onClaim, onClose }) => {
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [count, setCount] = useState(0);
  const [burst1, setBurst1] = useState(false);
  const [burst2, setBurst2] = useState(false);

  const bg = useRef(new Animated.Value(0)).current;
  const boxScale = useRef(new Animated.Value(0.2)).current;
  const hop = useRef(new Animated.Value(0)).current;
  const tilt = useRef(new Animated.Value(0)).current; // -1..1
  const sparks = useRef(new Animated.Value(0)).current;
  const hint = useRef(new Animated.Value(1)).current;
  const lid = useRef(new Animated.Value(0)).current; // 0 closed, 1 open
  const beam = useRef(new Animated.Value(0)).current;
  const rays = useRef(new Animated.Value(0)).current;
  const raySpin = useRef(new Animated.Value(0)).current;
  const card = useRef(new Animated.Value(0)).current;
  const layerOpacity = useRef(new Animated.Value(1)).current;
  const modal = useRef(new Animated.Value(0)).current;
  const countAnim = useRef(new Animated.Value(0)).current;

  const idleLoop = useRef<Animated.CompositeAnimation | null>(null);
  const sparkLoop = useRef<Animated.CompositeAnimation | null>(null);
  const hintLoop = useRef<Animated.CompositeAnimation | null>(null);
  const spinLoop = useRef<Animated.CompositeAnimation | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const claimed = useRef(false);
  const closing = useRef(false);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  /* ---------- mount: fade in, pop the box, start idle loops ---------- */
  useEffect(() => {
    Animated.timing(bg, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    Animated.spring(boxScale, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }).start();

    idleLoop.current = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(tilt, { toValue: 1, duration: 160, useNativeDriver: true }),
          Animated.timing(hop, { toValue: -10, duration: 160, useNativeDriver: true }),
        ]),
        Animated.timing(tilt, { toValue: -1, duration: 320, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(tilt, { toValue: 0, duration: 160, useNativeDriver: true }),
          Animated.timing(hop, { toValue: 0, duration: 160, useNativeDriver: true }),
        ]),
        Animated.delay(700),
      ])
    );
    idleLoop.current.start();

    sparkLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(sparks, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(sparks, { toValue: 0.2, duration: 450, useNativeDriver: true }),
      ])
    );
    sparkLoop.current.start();

    hintLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(hint, { toValue: 0.45, duration: 700, useNativeDriver: true }),
        Animated.timing(hint, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    hintLoop.current.start();

    spinLoop.current = Animated.loop(
      Animated.timing(raySpin, { toValue: 1, duration: 16000, easing: Easing.linear, useNativeDriver: true })
    );
    spinLoop.current.start();

    const id = countAnim.addListener(({ value }) => setCount(Math.round(value)));

    return () => {
      idleLoop.current?.stop();
      sparkLoop.current?.stop();
      hintLoop.current?.stop();
      spinLoop.current?.stop();
      countAnim.removeListener(id);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  /* ---------- tap: run the whole sequence ---------- */
  const open = () => {
    if (stage !== 0) return;
    setStage(1);

    idleLoop.current?.stop();
    sparkLoop.current?.stop();
    hintLoop.current?.stop();

    Animated.timing(hint, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    Animated.timing(sparks, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    Animated.timing(hop, { toValue: 0, duration: 100, useNativeDriver: true }).start();

    // box shakes hard
    Animated.sequence(
      [1, -1, 1, -1, 0].map((v) => Animated.timing(tilt, { toValue: v, duration: 70, useNativeDriver: true }))
    ).start();
    Animated.sequence([
      Animated.timing(boxScale, { toValue: 1.12, duration: 220, useNativeDriver: true }),
      Animated.spring(boxScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();

    // lid pops, beam of light, confetti
    later(() => {
      setBurst1(true);
      try {
        playSound("jackpot" as any);
      } catch {}
      Animated.parallel([
        Animated.spring(lid, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
        Animated.timing(beam, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(rays, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 380);

    // "+30 Coins" card flies out (coins are saved here)
    later(() => {
      setStage(2);
      if (!claimed.current) {
        claimed.current = true;
        Promise.resolve(onClaim?.()).catch(() => {});
      }
      Animated.spring(card, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }).start();
    }, 900);

    // switch to the cream modal
    later(() => {
      setStage(3);
      setBurst2(true);
      Animated.parallel([
        Animated.timing(layerOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.spring(modal, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
      ]).start();
      countAnim.setValue(0);
      Animated.timing(countAnim, {
        toValue: coins,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, 2500);
  };

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    Animated.parallel([
      Animated.timing(modal, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(bg, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  /* ---------- derived animation values ---------- */
  const lidY = lid.interpolate({ inputRange: [0, 1], outputRange: [0, -78] });
  const lidX = lid.interpolate({ inputRange: [0, 1], outputRange: [0, 44] });
  const lidRot = lid.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "28deg"] });
  const boxRot = tilt.interpolate({ inputRange: [-1, 1], outputRange: ["-7deg", "7deg"] });

  const spark = (style: object, rot: string) => (
    <Animated.View
      style={[
        styles.spark,
        style,
        { opacity: sparks, transform: [{ rotate: rot }] },
      ]}
    />
  );

  return (
    <Animated.View style={[styles.backdrop, { opacity: bg }]}>
      {/* tap anywhere to open */}
      <Pressable style={FILL} onPress={open} accessibilityLabel="Open gift" />

      {/* ===================== gift stage ===================== */}
      <Animated.View style={[styles.stage, { opacity: layerOpacity }]} pointerEvents="none">
        {/* rotating light rays */}
        <Animated.View
          style={[
            styles.raysWrap,
            {
              opacity: rays,
              transform: [{ rotate: raySpin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }],
            },
          ]}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <View key={i} style={[styles.rayArm, { transform: [{ rotate: `${i * 36}deg` }] }]}>
              <View style={styles.ray} />
            </View>
          ))}
        </Animated.View>

        {/* ground shadow */}
        <View style={styles.groundShadow} />

        {/* warm glow behind the box opening */}
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: beam.interpolate({ inputRange: [0, 1], outputRange: [0, 0.9] }),
              transform: [{ scale: beam.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1.2] }) }],
            },
          ]}
        />

        
        <Animated.View
          style={[
            styles.beam,
            {
              opacity: beam,
              transform: [
                { translateY: beam.interpolate({ inputRange: [0, 1], outputRange: [65, 0] }) },
                { scaleY: beam },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(253,224,71,0)", "rgba(253,224,71,0.9)"]}
            style={FILL}
          />
        </Animated.View>

        {/* idle sparks */}
        {spark({ top: 178, left: 46 }, "-28deg")}
        {spark({ top: 202, left: 34 }, "0deg")}
        {spark({ top: 226, left: 46 }, "28deg")}
        {spark({ top: 178, left: 232 }, "28deg")}
        {spark({ top: 202, left: 244 }, "0deg")}
        {spark({ top: 226, left: 232 }, "-28deg")}

        {/* the gift box */}
        <Animated.View
          style={[
            FILL,
            { transform: [{ scale: boxScale }, { translateY: hop }, { rotate: boxRot }] },
          ]}
        >
          {/* body */}
          <LinearGradient colors={["#8B5CF6", "#6D28D9"]} style={styles.body}>
            <View style={styles.bodyRibbon} />
            <Ionicons name="star" size={9} color="rgba(255,255,255,0.25)" style={{ position: "absolute", top: 18, left: 16 }} />
            <Ionicons name="star" size={7} color="rgba(255,255,255,0.2)" style={{ position: "absolute", top: 60, left: 30 }} />
            <Ionicons name="star" size={9} color="rgba(255,255,255,0.25)" style={{ position: "absolute", top: 34, right: 16 }} />
            <Ionicons name="star" size={7} color="rgba(255,255,255,0.2)" style={{ position: "absolute", top: 72, right: 28 }} />
          </LinearGradient>

          {/* lid + bow (pops off) */}
          <Animated.View
            style={[
              styles.lid,
              { transform: [{ translateX: lidX }, { translateY: lidY }, { rotate: lidRot }] },
            ]}
          >
            <LinearGradient colors={["#A78BFA", "#7C3AED"]} style={styles.lidFace}>
              <View style={styles.lidRibbon} />
            </LinearGradient>
            <View style={[styles.bowLoop, { left: 36, transform: [{ rotate: "-28deg" }] }]} />
            <View style={[styles.bowLoop, { right: 36, transform: [{ rotate: "28deg" }] }]} />
            <View style={styles.bowKnot} />
          </Animated.View>
        </Animated.View>

        {/* hint */}
        <Animated.Text style={[styles.hint, { opacity: hint }]}>Tap to open your gift!</Animated.Text>

        {/* "+30 Coins" card flying out */}
        {stage >= 2 && (
          <Animated.View
            style={[
              styles.coinCard,
              {
                opacity: card.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1] }),
                transform: [
                  { translateY: card.interpolate({ inputRange: [0, 1], outputRange: [50, -90] }) },
                  { scale: card.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
                  { rotate: "-8deg" },
                ],
              },
            ]}
          >
            <Coin size={46} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.cardPlus}>+{coins}</Text>
              <Text style={styles.cardCoins}>Coins</Text>
            </View>
          </Animated.View>
        )}

        {/* confetti from the box */}
        <ConfettiBurst play={burst1} originX={STAGE_W / 2} originY={170} />
      </Animated.View>

      {/* ===================== final modal ===================== */}
      <Animated.View
        style={[
          FILL,
          styles.modalWrap,
          { opacity: modal, transform: [{ scale: modal.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] },
        ]}
        pointerEvents={stage === 3 ? "auto" : "none"}
      >
        <View style={styles.confettiOrigin} pointerEvents="none">
          <ConfettiBurst play={burst2} originX={0} originY={-40} count={30} spread={1.25} />
        </View>

        <View style={styles.modalCard}>
          <View style={styles.modalCoin}>
            <Coin size={88} />
          </View>
          <Text style={styles.modalPlus}>+{count}</Text>
          <Text style={styles.modalCoinsText}>Coins</Text>

          <PressableScale onPress={close} scaleTo={0.94} containerStyle={{ alignSelf: "stretch" }} style={styles.awesomeBtn}>
            <LinearGradient colors={["#FCD34D", "#F59E0B"]} style={styles.awesomeFace}>
              <Text style={styles.awesomeText}>Awesome!</Text>
            </LinearGradient>
          </PressableScale>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default GiftRewardModal;

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  backdrop: {
    ...FILL,
    backgroundColor: "rgba(10,8,40,0.82)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  stage: {
    width: STAGE_W,
    height: STAGE_H,
  },

  /* rays */
  raysWrap: {
    position: "absolute",
    left: 0,
    top: 50,
    width: STAGE_W,
    height: STAGE_W,
  },
  rayArm: {
    position: "absolute",
    left: 0,
    top: 0,
    width: STAGE_W,
    height: STAGE_W,
    alignItems: "center",
  },
  ray: {
    marginTop: 10,
    width: 10,
    height: 140,
    borderRadius: 5,
    backgroundColor: "rgba(253,224,71,0.22)",
  },

  groundShadow: {
    position: "absolute",
    left: 60,
    top: 262,
    width: 180,
    height: 26,
    borderRadius: 90,
    backgroundColor: "rgba(124,58,237,0.45)",
  },
  glow: {
    position: "absolute",
    left: 70,
    top: 100,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(253,224,71,0.5)",
  },
  beam: {
    position: "absolute",
    left: 95,
    top: 45,
    width: 110,
    height: 130,
  },
  spark: {
    position: "absolute",
    width: 22,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#FBBF24",
  },

  /* box */
  body: {
    position: "absolute",
    left: 85,
    top: 170,
    width: 130,
    height: 100,
    borderRadius: 12,
    alignItems: "center",
    overflow: "hidden",
  },
  bodyRibbon: {
    width: 26,
    height: "100%",
    backgroundColor: "#FBBF24",
  },
  lid: {
    position: "absolute",
    left: 77,
    top: 138,
    width: 146,
    height: 38,
  },
  lidFace: {
    width: 146,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    overflow: "hidden",
  },
  lidRibbon: {
    width: 26,
    height: "100%",
    backgroundColor: "#FBBF24",
  },
  bowLoop: {
    position: "absolute",
    top: -28,
    width: 40,
    height: 32,
    borderRadius: 16,
    borderWidth: 8,
    borderColor: "#FBBF24",
    backgroundColor: "transparent",
  },
  bowKnot: {
    position: "absolute",
    top: -12,
    left: 63,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F59E0B",
    borderWidth: 3,
    borderColor: "#FCD34D",
  },
  hint: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 302,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  /* flying card */
  coinCard: {
    position: "absolute",
    left: 45,
    top: 150,
    width: 210,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "#FEF3C7",
    borderWidth: 2,
    borderColor: "#FDE68A",
    shadowColor: "#FBBF24",
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  cardPlus: { fontSize: 38, fontWeight: "900", color: "#1E1B4B", lineHeight: 40 },
  cardCoins: { fontSize: 16, fontWeight: "800", color: "#1E1B4B", marginTop: -2 },

  /* final modal */
  modalWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  confettiOrigin: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 0,
    height: 0,
  },
  modalCard: {
    width: 260,
    alignItems: "center",
    paddingTop: 58,
    paddingBottom: 22,
    paddingHorizontal: 22,
    borderRadius: 28,
    backgroundColor: "#FFF3C4",
    borderWidth: 3,
    borderColor: "#FDE68A",
    shadowColor: "#FBBF24",
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 14,
  },
  modalCoin: {
    position: "absolute",
    top: -44,
  },
  modalPlus: { fontSize: 52, fontWeight: "900", color: "#1E1B4B", lineHeight: 58 },
  modalCoinsText: { fontSize: 28, fontWeight: "900", color: "#1E1B4B", marginTop: -4 },
  awesomeBtn: {
    marginTop: 18,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#D97706",
    paddingBottom: 4,
  },
  awesomeFace: {
    flex: 1,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  awesomeText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    textShadowColor: "rgba(146,64,14,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});
