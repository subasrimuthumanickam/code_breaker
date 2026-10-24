
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Animated, Easing, ActivityIndicator } from "react-native";
import Svg, { Path, G, Text as SvgText, Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

import { fetchSpinConfig, spinWheel, SpinSegment, SpinResponse } from "../api/wordscrambleCoinsApi";
// NEW: spin sound effects
import { playSound } from "../utils/sound";

interface Props {
  playerName: string;
  roundId: string;
  level: number;
  /** called once the spin has landed, so the screen can refresh coins / tokens */
  onResult: (res: SpinResponse) => void;
  /** called when the player taps Continue */
  onClose: () => void;
}

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = SIZE / 2 - 10;

const C = {
  card: "#FFFFFF",
  border: "#F1E7DC",
  text: "#141B34",
  sub: "#6B7280",
  indigo: "#4F46E5",
  coral: "#FF6B57",
  gold: "#F2B640",
};

const pt = (deg: number) => ({
  x: CX + R * Math.cos((deg * Math.PI) / 180),
  y: CY + R * Math.sin((deg * Math.PI) / 180),
});

const prizeText = (p?: SpinSegment) => {
  if (!p) return "";
  if (p.type === "coins") return `+${p.amount} coins`;
  if (p.type === "hints") return `+${p.amount} free hint${p.amount > 1 ? "s" : ""}`;
  return `+${p.amount}s extra time in the next round`;
};

// NEW: big reward -> jackpot sound
const isJackpot = (p: any) =>
  !!p && (p.id === "jackpot" || /jackpot/i.test(String(p.label ?? "")) || (p.type === "coins" && p.amount >= 100));

const LuckySpinWheel: React.FC<Props> = ({ playerName, roundId, level, onResult, onClose }) => {
  const [segments, setSegments] = useState<SpinSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rotation = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0)).current;
  // NEW: id of the rotation listener that plays the "tik tik" sound
  const tickListenerRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSpinConfig()
      .then((res) => {
        if (cancelled) return;
        if (res?.success && res.segments?.length) setSegments(res.segments);
        else setError("Couldn't load the wheel.");
      })
      .catch(() => !cancelled && setError("Couldn't load the wheel."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // NEW: make sure the tick listener is removed if the wheel closes mid-spin
  useEffect(() => {
    return () => {
      if (tickListenerRef.current) rotation.removeListener(tickListenerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SEG = segments.length > 0 ? 360 / segments.length : 45;

  const onSpin = async () => {
    if (spinning || result || segments.length === 0) return;
    setError(null);
    setSpinning(true);
    try {
      // The SERVER decides the prize; the wheel only animates to it.
      const res = await spinWheel(playerName, roundId, level);
      if (!res?.success || typeof res.segmentIndex !== "number") {
        setError(res?.message ?? "Spin failed. Try again.");
        setSpinning(false);
        return;
      }
      const center = res.segmentIndex * SEG + SEG / 2;
      const jitter = (Math.random() - 0.5) * SEG * 0.6; // land somewhere inside the wedge
      const target = 360 * 6 + (360 - center) + jitter;

      rotation.setValue(0);

      // NEW: "tik tik tik" every time a wedge edge passes the pointer
      let lastSlice = 0;
      tickListenerRef.current = rotation.addListener(({ value }) => {
        const slice = Math.floor(value / SEG);
        if (slice !== lastSlice) {
          lastSlice = slice;
          playSound("spinTick", 35);
        }
      });
      // NEW: whoosh when the wheel starts turning
      playSound("whoosh");

      Animated.timing(rotation, {
        toValue: target,
        duration: 4800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        // NEW: stop ticking, play win / jackpot sound
        if (tickListenerRef.current) {
          rotation.removeListener(tickListenerRef.current);
          tickListenerRef.current = null;
        }
        playSound(isJackpot(res.prize) ? "jackpot" : "win");

        setSpinning(false);
        setResult(res);
        onResult(res);
        pop.setValue(0);
        Animated.spring(pop, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
      });
    } catch (e) {
      console.warn("spinWheel failed:", e);
      setError("Network error. Try again.");
      setSpinning(false);
    }
  };

  const spinDeg = rotation.interpolate({ inputRange: [0, 3600], outputRange: ["0deg", "3600deg"] });

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <Text style={styles.title}>🎡 Lucky Spin</Text>
        <Text style={styles.sub}>Level {level} complete! Spin for a reward.</Text>

        {loading ? (
          <ActivityIndicator style={{ marginVertical: 80 }} color={C.indigo} />
        ) : (
          <View style={styles.wheelArea}>
            {/* pointer */}
            <View style={styles.pointer} />

            <Animated.View style={{ width: SIZE, height: SIZE, transform: [{ rotate: spinDeg }] }}>
              <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                <Circle cx={CX} cy={CY} r={R + 8} fill="#241B12" />
                {segments.map((s, i) => {
                  const a0 = -90 + i * SEG;
                  const a1 = a0 + SEG;
                  const p0 = pt(a0);
                  const p1 = pt(a1);
                  const d = `M ${CX} ${CY} L ${p0.x} ${p0.y} A ${R} ${R} 0 0 1 ${p1.x} ${p1.y} Z`;
                  const mid = i * SEG + SEG / 2;
                  return (
                    <G key={s.id}>
                      <Path d={d} fill={s.color} stroke="#FFFFFF" strokeWidth={2} />
                      <G transform={`rotate(${mid} ${CX} ${CY})`}>
                        <SvgText x={CX} y={CY - R * 0.76} fontSize={22} textAnchor="middle">
                          {s.emoji}
                        </SvgText>
                        <SvgText
                          x={CX}
                          y={CY - R * 0.52}
                          fontSize={s.label.length > 5 ? 11 : 14}
                          fontWeight="bold"
                          fill="#FFFFFF"
                          textAnchor="middle"
                        >
                          {s.label}
                        </SvgText>
                      </G>
                    </G>
                  );
                })}
              </Svg>
            </Animated.View>

            {/* hub */}
            <View style={styles.hub}>
              <Ionicons name="star" size={20} color={C.gold} />
            </View>
          </View>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {result ? (
          <Animated.View style={[styles.resultBox, { transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
            <Text style={styles.resultEmoji}>{result.prize?.emoji}</Text>
            <Text style={styles.resultText}>{prizeText(result.prize)}</Text>
            {result.alreadySpun ? <Text style={styles.resultNote}>You already spun for this set of levels.</Text> : null}
          </Animated.View>
        ) : null}

        {result ? (
          <Pressable style={[styles.btn, { backgroundColor: C.indigo }]} onPress={onClose}>
            <Text style={styles.btnText}>Continue</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </Pressable>
        ) : (
          <Pressable
            style={[styles.btn, { backgroundColor: C.coral }, (spinning || loading || segments.length === 0) && { opacity: 0.6 }]}
            onPress={onSpin}
            disabled={spinning || loading || segments.length === 0}
          >
            <Text style={styles.btnText}>{spinning ? "Spinning..." : "SPIN!"}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(20,27,52,0.72)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    zIndex: 50,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: C.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: C.border,
    padding: 22,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "900", color: C.text },
  sub: { marginTop: 4, marginBottom: 14, fontSize: 13.5, fontWeight: "600", color: C.sub, textAlign: "center" },
  wheelArea: { width: SIZE, height: SIZE, alignItems: "center", justifyContent: "center", marginTop: 10 },
  pointer: {
    position: "absolute",
    top: -14,
    zIndex: 5,
    width: 0,
    height: 0,
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderTopWidth: 26,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: C.text,
  },
  hub: {
    position: "absolute",
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.text,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  error: { marginTop: 12, color: "#F0566A", fontWeight: "700", fontSize: 13, textAlign: "center" },
  resultBox: {
    marginTop: 16,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#FBEBC8",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  resultEmoji: { fontSize: 30 },
  resultText: { marginTop: 4, fontSize: 18, fontWeight: "900", color: "#8A6A1D", textAlign: "center" },
  resultNote: { marginTop: 4, fontSize: 12, fontWeight: "600", color: C.sub },
  btn: {
    marginTop: 18,
    width: "100%",
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800", letterSpacing: 1 },
});

export default LuckySpinWheel;
