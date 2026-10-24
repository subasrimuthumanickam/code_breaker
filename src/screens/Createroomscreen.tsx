
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type CreateRoomConfig = {
  roomName: string;
  roomType: "public" | "private";
  numberOfPlayers: number;
  rounds: number;
  // removed from this screen (backend uses its default). Optional so old code still compiles.
  difficulty?: "easy" | "medium" | "hard";
  timePerRoundSec?: number;
};

type CreateRoomScreenProps = {
  onBack: () => void;
  onCreateRoom: (config: CreateRoomConfig) => void | Promise<void>;
  onJoinRoom?: (code: string) => void | Promise<void>;
  onTabHome?: () => void;
  onTabLeaderboard?: () => void;
  onTabProfile?: () => void;
};

/* ---------- limits (change here) ---------- */
const MIN_ROUNDS = 1;
const MAX_ROUNDS = 50;
const ROUND_PRESETS = [5, 10, 20, 30, 50];
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 8;
const NAME_MAX = 30;

/* ---------- theme (same as Word Scramble home) ---------- */
const T = {
  bg: "#EAF8F2",
  ink: "#0F3D3E",
  inkSoft: "#4F7476",
  inkFaint: "#8FB0AE",
  teal: "#14A38B",
  tealDark: "#0C7F6B",
  tealPale: "#D2F2E8",
  tangerine: "#FF8A3D",
  tangerineDark: "#DB6A1C",
  tangerinePale: "#FFE8D6",
  lemon: "#FFD84D",
  tile: "#FFF6DF",
  tileEdge: "#E2CD9C",
  card: "#FFFFFF",
  line: "#CBE8DE",
  danger: "#E5484D",
};



const Idle: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  kind?: "bob" | "sway";
  duration?: number;
  delay?: number;
  amount?: number;
}> = ({ children, style, kind = "bob", duration = 1800, delay = 0, amount = 6 }) => {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v, duration, delay]);

  const transform: any[] =
    kind === "bob"
      ? [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -amount] }) }]
      : [
          {
            rotate: v.interpolate({
              inputRange: [0, 1],
              outputRange: [`${-amount}deg`, `${amount}deg`],
            }),
          },
        ];

  return <Animated.View style={[style, { transform }]}>{children}</Animated.View>;
};

const PressScale: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ children, onPress, disabled, style }) => {
  const s = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={[{ transform: [{ scale: s }] }, style]}>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        onPressIn={() =>
          Animated.spring(s, { toValue: 0.94, friction: 8, tension: 220, useNativeDriver: true }).start()
        }
        onPressOut={() =>
          Animated.spring(s, { toValue: 1, friction: 3, tension: 140, useNativeDriver: true }).start()
        }
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

/** Little shake used when a field is invalid. */
function useShake() {
  const x = useRef(new Animated.Value(0)).current;
  const shake = () => {
    x.setValue(0);
    Animated.sequence([
      Animated.timing(x, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(x, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(x, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(x, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };
  return { x, shake };
}

/* ============================================================
   BACKGROUND: rings + floating letter tiles
============================================================ */

const Ring: React.FC<{ cx: number; cy: number; size: number; color: string; opacity: number }> = ({
  cx,
  cy,
  size,
  color,
  opacity,
}) => (
  <View
    pointerEvents="none"
    style={{
      position: "absolute",
      left: cx - size / 2,
      top: cy - size / 2,
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: color,
      opacity,
    }}
  />
);

const FLOATERS = [
  { ch: "W", left: "6%", top: 110, color: T.teal, delay: 0 },
  { ch: "O", left: "82%", top: 170, color: T.tangerine, delay: 300 },
  { ch: "R", left: "10%", top: 420, color: T.ink, delay: 600 },
  { ch: "D", left: "86%", top: 520, color: T.teal, delay: 900 },
  { ch: "S", left: "74%", top: 760, color: T.tangerine, delay: 450 },
  { ch: "Q", left: "4%", top: 700, color: T.ink, delay: 750 },
] as const;

const Background: React.FC = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Ring cx={330} cy={90} size={150} color={T.teal} opacity={0.2} />
    <Ring cx={330} cy={90} size={250} color={T.teal} opacity={0.13} />
    <Ring cx={20} cy={640} size={190} color={T.tangerine} opacity={0.2} />
    <Ring cx={20} cy={640} size={300} color={T.tangerine} opacity={0.12} />

    {FLOATERS.map((f) => (
      <Idle
        key={f.ch + f.top}
        kind="bob"
        amount={10}
        duration={2200}
        delay={f.delay}
        style={{ position: "absolute", left: f.left as any, top: f.top, opacity: 0.55 }}
      >
        <View style={s.floatTile}>
          <Text style={[s.floatChar, { color: f.color }]}>{f.ch}</Text>
        </View>
      </Idle>
    ))}
  </View>
);

/* ============================================================
   STEPPER (value can be null = not selected yet)
============================================================ */

const Stepper: React.FC<{
  value: number | null;
  min: number;
  max: number;
  onChange: (n: number) => void;
}> = ({ value, min, max, onChange }) => {
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (value === null) return;
    pop.setValue(0.8);
    Animated.spring(pop, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }).start();
  }, [value, pop]);

  const canDec = value !== null && value > min;
  const canInc = value === null || value < max;

  return (
    <View style={s.stepRow}>
      <PressScale
        disabled={!canDec}
        onPress={() => value !== null && onChange(Math.max(min, value - 1))}
      >
        <View style={[s.stepBtn, !canDec && s.stepBtnOff]}>
          <Ionicons name="remove" size={22} color={T.ink} />
        </View>
      </PressScale>

      <Animated.View style={[s.stepValueBox, { transform: [{ scale: pop }] }]}>
        <Text style={[s.stepValue, value === null && s.stepValueEmpty]}>
          {value === null ? "—" : value}
        </Text>
      </Animated.View>

      <PressScale
        disabled={!canInc}
        onPress={() => onChange(value === null ? min : Math.min(max, value + 1))}
      >
        <View style={[s.stepBtn, !canInc && s.stepBtnOff]}>
          <Ionicons name="add" size={22} color={T.ink} />
        </View>
      </PressScale>
    </View>
  );
};

/* ============================================================
   SCREEN
============================================================ */

export default function CreateRoomScreen({ onBack, onCreateRoom }: CreateRoomScreenProps) {
  const [roomName, setRoomName] = useState("");
  const [rounds, setRounds] = useState<number | null>(null); // compulsory: starts empty
  const [numberOfPlayers, setNumberOfPlayers] = useState(4);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);

  const nameShake = useShake();
  const roundsShake = useShake();

  // staggered entrance: header, name, rounds, players, button
  const enters = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(
      110,
      enters.map((e) =>
        Animated.timing(e, {
          toValue: 1,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    ).start();
  }, [enters]);

  const rise = (i: number) => ({
    opacity: enters[i],
    transform: [{ translateY: enters[i].interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }],
  });

  const trimmedName = roomName.trim();
  const nameError = trimmedName.length === 0 ? "Room name is required" : "";
  const roundsError =
    rounds === null
      ? "Please select number of rounds"
      : rounds < MIN_ROUNDS || rounds > MAX_ROUNDS
      ? `Rounds must be ${MIN_ROUNDS} - ${MAX_ROUNDS}`
      : "";

  const handleCreate = async () => {
    if (busy) return;
    setSubmitted(true);
    setServerError("");

    if (nameError || roundsError || rounds === null) {
      if (nameError) nameShake.shake();
      if (roundsError) roundsShake.shake();
      return;
    }

    setBusy(true);
    try {
      await onCreateRoom({
        roomName: trimmedName,
        roomType: "private",
        numberOfPlayers,
        rounds,
      });
    } catch (e: any) {
      setServerError(e?.message || "Could not create room. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />
      <Background />

      <SafeAreaView style={s.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* HEADER */}
          <Animated.View style={[s.header, rise(0)]}>
            <TouchableOpacity onPress={onBack} style={s.backBtn} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={20} color={T.ink} />
            </TouchableOpacity>

            <View style={s.headerText}>
              <Text style={s.title}>
                Create <Text style={s.titleAccent}>Room</Text>
              </Text>
              <Text style={s.subtitle}>Set up your game room</Text>
            </View>

            <Idle kind="sway" amount={8} duration={1300} style={s.headerTile}>
              <Text style={s.headerTileW}>W</Text>
              <Text style={s.headerTileS}>S</Text>
            </Idle>
          </Animated.View>

          <ScrollView
            contentContainerStyle={s.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={s.inner}>
              {/* ROOM NAME */}
              <Animated.View style={rise(1)}>
                <Animated.View
                  style={[
                    s.card,
                    submitted && !!nameError && s.cardError,
                    { transform: [{ translateX: nameShake.x }] },
                  ]}
                >
                  <View style={s.labelRow}>
                    <Text style={s.label}>
                      ROOM NAME <Text style={s.required}>*</Text>
                    </Text>
                    <Text style={s.hint}>
                      {roomName.length}/{NAME_MAX}
                    </Text>
                  </View>

                  <View style={[s.inputWrap, submitted && !!nameError && s.inputWrapError]}>
                    <Ionicons name="home-outline" size={18} color={T.inkFaint} />
                    <TextInput
                      value={roomName}
                      onChangeText={(t) => {
                        setRoomName(t);
                        setServerError("");
                      }}
                      placeholder="e.g. Kitty's Room"
                      placeholderTextColor={T.inkFaint}
                      maxLength={NAME_MAX}
                      style={s.input}
                    />
                  </View>

                  {submitted && !!nameError && <Text style={s.errorText}>{nameError}</Text>}
                </Animated.View>
              </Animated.View>

              {/* ROUNDS */}
              <Animated.View style={rise(2)}>
                <Animated.View
                  style={[
                    s.card,
                    submitted && !!roundsError && s.cardError,
                    { transform: [{ translateX: roundsShake.x }] },
                  ]}
                >
                  <View style={s.labelRow}>
                    <Text style={s.label}>
                      ROUNDS <Text style={s.required}>*</Text>
                    </Text>
                    <Text style={s.hint}>
                      ({MIN_ROUNDS} - {MAX_ROUNDS})
                    </Text>
                  </View>

                  <Stepper value={rounds} min={MIN_ROUNDS} max={MAX_ROUNDS} onChange={setRounds} />

                  <View style={s.chips}>
                    {ROUND_PRESETS.filter((n) => n >= MIN_ROUNDS && n <= MAX_ROUNDS).map((n) => {
                      const on = rounds === n;
                      return (
                        <PressScale key={n} onPress={() => setRounds(n)} style={s.chipWrap}>
                          <View style={[s.chip, on && s.chipOn]}>
                            <Text style={[s.chipText, on && s.chipTextOn]}>{n}</Text>
                          </View>
                        </PressScale>
                      );
                    })}
                  </View>

                  {submitted && !!roundsError && <Text style={s.errorText}>{roundsError}</Text>}
                </Animated.View>
              </Animated.View>

              {/* MAX PLAYERS */}
              <Animated.View style={rise(3)}>
                <View style={s.card}>
                  <View style={s.labelRow}>
                    <Text style={s.label}>MAX PLAYERS</Text>
                    <Text style={s.hint}>
                      ({MIN_PLAYERS} - {MAX_PLAYERS})
                    </Text>
                  </View>
                  <Stepper
                    value={numberOfPlayers}
                    min={MIN_PLAYERS}
                    max={MAX_PLAYERS}
                    onChange={setNumberOfPlayers}
                  />
                </View>
              </Animated.View>

              {/* CREATE */}
              <Animated.View style={rise(4)}>
                {!!serverError && (
                  <View style={s.serverError}>
                    <Ionicons name="alert-circle" size={16} color={T.danger} />
                    <Text style={s.serverErrorText}>{serverError}</Text>
                  </View>
                )}

                <PressScale onPress={handleCreate} disabled={busy}>
                  <View style={s.createBtn}>
                    {busy ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <>
                        <Ionicons name="play" size={18} color="#FFF" />
                        <Text style={s.createText}>CREATE ROOM</Text>
                      </>
                    )}
                  </View>
                </PressScale>

                <Text style={s.footer}>You can change the room settings before the game starts.</Text>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}



const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  safe: { flex: 1, backgroundColor: "transparent" },

  floatTile: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: T.tile,
    borderWidth: 2,
    borderColor: T.tileEdge,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  floatChar: { fontSize: 20, fontWeight: "900" },

  header: {
    height: 76,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1, alignItems: "center" },
  title: { color: T.ink, fontSize: 21, fontWeight: "900" },
  titleAccent: { color: T.teal },
  subtitle: { color: T.inkSoft, fontSize: 12, marginTop: 2, fontWeight: "600" },
  headerTile: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: T.tile,
    borderWidth: 2,
    borderColor: T.tileEdge,
    borderBottomWidth: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTileW: { color: T.teal, fontSize: 15, fontWeight: "900" },
  headerTileS: { color: T.tangerine, fontSize: 15, fontWeight: "900" },

  body: { flexGrow: 1, alignItems: "center", padding: 16, paddingBottom: 40 },
  inner: { width: "100%", maxWidth: 440 },

  card: {
    backgroundColor: T.card,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 5,
    padding: 16,
    marginBottom: 14,
  },
  cardError: { borderColor: T.danger },

  label: { color: T.inkSoft, fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  required: { color: T.danger },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  hint: { color: T.inkFaint, fontSize: 11.5, fontWeight: "700" },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    backgroundColor: "#F3FBF8",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: T.line,
    paddingHorizontal: 14,
    gap: 10,
  },
  inputWrapError: { borderColor: T.danger, backgroundColor: "#FFF5F5" },
  input: { flex: 1, minWidth: 0, color: T.ink, fontSize: 15, fontWeight: "800" },

  errorText: { color: T.danger, fontSize: 12, fontWeight: "700", marginTop: 10 },

  stepRow: { flexDirection: "row", alignItems: "center" },
  stepBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: T.tealPale,
    borderWidth: 1.5,
    borderColor: T.line,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnOff: { opacity: 0.4 },
  stepValueBox: { flex: 1, alignItems: "center", justifyContent: "center" },
  stepValue: { color: T.ink, fontSize: 30, fontWeight: "900" },
  stepValueEmpty: { color: T.inkFaint },

  chips: { flexDirection: "row", gap: 8, marginTop: 14 },
  chipWrap: { flex: 1 },
  chip: {
    height: 40,
    borderRadius: 12,
    backgroundColor: T.tile,
    borderWidth: 1.5,
    borderColor: T.tileEdge,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  chipOn: { backgroundColor: T.teal, borderColor: T.tealDark },
  chipText: { color: T.ink, fontSize: 14, fontWeight: "900" },
  chipTextOn: { color: "#FFF" },

  serverError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF0F0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F7C9CB",
    padding: 12,
    marginBottom: 12,
  },
  serverErrorText: { flex: 1, color: T.danger, fontSize: 12.5, fontWeight: "700" },

  createBtn: {
    height: 58,
    borderRadius: 16,
    backgroundColor: T.tangerine,
    borderBottomWidth: 5,
    borderBottomColor: T.tangerineDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  createText: { color: "#FFF", fontSize: 15, fontWeight: "900", letterSpacing: 0.8 },
  footer: { textAlign: "center", color: T.inkSoft, fontSize: 11.5, marginTop: 14 },
});