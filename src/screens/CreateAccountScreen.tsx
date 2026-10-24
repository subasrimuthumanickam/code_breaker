


import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  Modal,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { LoginResponse } from "../api/api";
import { registerAccount } from "../api/authApi";

type Props = {
  onBack: () => void;
  onLogin: (user: LoginResponse) => void;
};

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;
type Gender = "Male" | "Female" | "Other";

// native driver is not available on web (avoids warnings)
const ND = Platform.OS !== "web";

const NAVY = "#1B2A6B";
const DEEP = "#22308A";
const CREAM = "#FDF8F1";
const YELLOW = "#FFC21A";
const GREEN = "#22B573";
const INPUT_BG = "#F6F8FF";
const INPUT_BORDER = "#DCE2F8";
const PLACEHOLDER = "#9AA5CF";
const ERROR = "#E5484D";

const NAME_REGEX = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const GENDERS: { value: Gender; icon: IconName; color: string }[] = [
  { value: "Male", icon: "face-man", color: "#3B82F6" },
  { value: "Female", icon: "face-woman", color: "#EC4899" },
  { value: "Other", icon: "account-star", color: "#8B5CF6" },
];

// web-only style helper (cursor etc.)
const web = (s: object) => (Platform.OS === "web" ? (s as any) : null);

/* DD / MM / YYYY display from digits only */
const formatDob = (digits: string) => {
  const d = digits.slice(0, 2);
  const m = digits.slice(2, 4);
  const y = digits.slice(4, 8);
  return [d, m, y].filter(Boolean).join(" / ");
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MIN_DOB_YEAR = 1900;


const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

const formatSelectedDate = (date: Date) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}${mm}${yyyy}`;
};

type Errors = {
  username?: string;
  dob?: string;
  gender?: string;
  phone?: string;
};

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

/** Smooth gradient without horizontal strip/seam lines. */
const GradientFill: React.FC<{
  from: string;
  to: string;
  steps?: number;
}> = ({ from, to }) => (
  <LinearGradient
    pointerEvents="none"
    colors={[from, to]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={StyleSheet.absoluteFill}
  />
);

/* Soft blob that slowly drifts. */
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
                outputRange: [`${rotate - 6}deg`, `${rotate + 6}deg`],
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
      Array.from({ length: 14 }, (_, i) => ({
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
/* Mascot (winking brain + bulb)                                       */
/* ------------------------------------------------------------------ */

const Mascot: React.FC<{ size: number }> = ({ size }) => {
  const bob = useLoop(1200);
  const rotate = useLoop(1800, 150);
  const glow = useLoop(1000);

  const W = size * 1.45;
  const H = size * 1.35;

  return (
    <Animated.View
      style={{
        width: W,
        height: H,
        alignItems: "center",
        justifyContent: "center",
        transform: [
          {
            translateY: bob.interpolate({
              inputRange: [0, 1],
              outputRange: [-5, 5],
            }),
          },
          {
            rotate: rotate.interpolate({
              inputRange: [0, 1],
              outputRange: ["-3deg", "3deg"],
            }),
          },
        ],
      }}
    >
      {/* Soft animated glow */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: size * 0.9,
          height: size * 0.9,
          borderRadius: size * 0.45,
          backgroundColor: "#5EEAD4",
          opacity: glow.interpolate({
            inputRange: [0, 1],
            outputRange: [0.12, 0.28],
          }),
          transform: [
            {
              scale: glow.interpolate({
                inputRange: [0, 1],
                outputRange: [0.85, 1.2],
              }),
            },
          ],
        }}
      />

      {/* Floating stars */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: size * 0.03,
          left: size * 0.08,
          opacity: glow.interpolate({
            inputRange: [0, 1],
            outputRange: [0.45, 1],
          }),
        }}
      >
        <MaterialCommunityIcons
          name="star-four-points"
          size={size * 0.16}
          color={YELLOW}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: size * 0.22,
          right: size * 0.02,
          opacity: glow.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.9],
          }),
        }}
      >
        <MaterialCommunityIcons
          name="star-four-points"
          size={size * 0.11}
          color="#F9A8D4"
        />
      </Animated.View>

      {/* Game controller */}
      <View
        style={{
          width: size * 0.98,
          height: size * 0.62,
          borderRadius: size * 0.26,
          backgroundColor: "#5B6EE1",
          borderWidth: 4,
          borderColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#111A5C",
          shadowOpacity: 0.22,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }}
      >
        {/* D-pad */}
        <View
          style={{
            position: "absolute",
            left: size * 0.17,
            top: size * 0.19,
            width: size * 0.25,
            height: size * 0.09,
            borderRadius: size * 0.04,
            backgroundColor: "#FFFFFF",
          }}
        />
        <View
          style={{
            position: "absolute",
            left: size * 0.25,
            top: size * 0.11,
            width: size * 0.09,
            height: size * 0.25,
            borderRadius: size * 0.04,
            backgroundColor: "#FFFFFF",
          }}
        />

        {/* Action buttons */}
        <View
          style={{
            position: "absolute",
            right: size * 0.16,
            top: size * 0.13,
            flexDirection: "row",
            gap: size * 0.055,
          }}
        >
          <View
            style={{
              width: size * 0.13,
              height: size * 0.13,
              borderRadius: size * 0.065,
              backgroundColor: "#F9A8D4",
            }}
          />
          <View
            style={{
              width: size * 0.13,
              height: size * 0.13,
              borderRadius: size * 0.065,
              backgroundColor: YELLOW,
            }}
          />
        </View>
      </View>

      {/* Floating puzzle piece */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: size * 0.01,
          right: size * 0.03,
          transform: [
            {
              rotate: rotate.interpolate({
                inputRange: [0, 1],
                outputRange: ["-8deg", "8deg"],
              }),
            },
          ],
        }}
      >
        <MaterialCommunityIcons
          name="puzzle"
          size={size * 0.32}
          color="#5EEAD4"
        />
      </Animated.View>
    </Animated.View>
  );
};

/* ------------------------------------------------------------------ */
/* Form pieces                                                         */
/* ------------------------------------------------------------------ */

/** Field with a coloured "game block" icon on the left */
const Field: React.FC<{
  label: string;
  icon: IconName;
  color: string;
  focused: boolean;
  error?: string;
  block: number;
  children: React.ReactNode;
}> = ({ label, icon, color, focused, error, block, children }) => (
  <View>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View
      style={[
        styles.fieldBox,
        focused && {
          borderColor: color,
          backgroundColor: "#FFFFFF",
          shadowColor: color,
          shadowOpacity: 0.3,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        },
        !!error && styles.fieldError,
      ]}
    >
      <View style={[styles.iconBlock, { backgroundColor: color, width: block }]}>
        <MaterialCommunityIcons name={icon} size={22} color="#FFFFFF" />
      </View>
      {children}
    </View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

/** Square gender card that lifts when selected */
const GenderCard: React.FC<{
  value: Gender;
  icon: IconName;
  color: string;
  active: boolean;
  disabled: boolean;
  height: number;
  onPress: () => void;
  gap: boolean;
}> = ({ value, icon, color, active, disabled, height, onPress, gap }) => {
  const lift = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(lift, {
      toValue: active ? 1 : 0,
      friction: 5,
      tension: 160,
      useNativeDriver: ND,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const to = (v: number) =>
    Animated.spring(press, {
      toValue: v,
      friction: 6,
      tension: 220,
      useNativeDriver: ND,
    }).start();

  return (
    <Animated.View
      style={{
        flex: 1,
        marginLeft: gap ? 10 : 0,
        transform: [
          { translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) },
          { scale: press },
        ],
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={value}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => to(0.94)}
        onPressOut={() => to(1)}
        {...({
          onHoverIn: () => to(1.04),
          onHoverOut: () => to(1),
        } as any)}
        style={[
          styles.genderCard,
          { height },
          active && styles.genderCardActive,
          active && { shadowColor: color },
          web({ cursor: "pointer" }),
        ]}
      >
        <View
          style={[
            styles.genderIcon,
            { backgroundColor: active ? "#FFFFFF" : color + "22" },
          ]}
        >
          <MaterialCommunityIcons name={icon} size={30} color={color} />
        </View>
        <Text style={[styles.genderText, active && { color: NAVY }]}>{value}</Text>

        {active ? (
          <View style={styles.checkBadge}>
            <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export default function CreateAccountScreen({ onBack, onLogin }: Props) {
  const { width, height } = useWindowDimensions();

  const [username, setUsername] = useState("");
  const [dobDigits, setDobDigits] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [phone, setPhone] = useState("");

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarMode, setCalendarMode] = useState<"days" | "months" | "years">("days");
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);
  const [btnW, setBtnW] = useState(320);

  /* ---------- progress (how many fields are filled correctly) ---------- */
  const cleanedName = username.trim().replace(/\s+/g, " ");
  const nameOk =
    cleanedName.length >= 2 && cleanedName.length <= 20 && NAME_REGEX.test(cleanedName);
  const dobOk = dobDigits.length === 8;
  const genderOk = !!gender;
  const phoneOk = PHONE_REGEX.test(phone);
  const done = [nameOk, dobOk, genderOk, phoneOk].filter(Boolean).length;

  /* ---------- animation values ---------- */
  const headerIn = useRef(new Animated.Value(0)).current;
  const mascotIn = useRef(new Animated.Value(0)).current;
  const cardIn = useRef(new Animated.Value(0)).current;
  const avatarIn = useRef(new Animated.Value(0)).current;
  const secIn = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(0))
  ).current; // username, dob, gender, phone, button
  const backIn = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const celebrate = useRef(new Animated.Value(0)).current;
  const avatarPop = useRef(new Animated.Value(1)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const btnShine = useRef(new Animated.Value(0)).current;
  const btnStar = useLoop(800);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(backIn, { toValue: 1, duration: 350, useNativeDriver: ND }),
        Animated.timing(headerIn, {
          toValue: 1,
          duration: 550,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: ND,
        }),
        Animated.spring(mascotIn, {
          toValue: 1,
          friction: 5,
          tension: 80,
          delay: 150,
          useNativeDriver: ND,
        }),
      ]),
      Animated.parallel([
        Animated.timing(cardIn, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: ND,
        }),
        Animated.spring(avatarIn, {
          toValue: 1,
          friction: 4,
          tension: 90,
          delay: 150,
          useNativeDriver: ND,
        }),
        Animated.stagger(
          90,
          secIn.map((v) =>
            Animated.timing(v, {
              toValue: 1,
              duration: 420,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: ND,
            })
          )
        ),
      ]),
    ]).start();

    const shineLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(2200),
        Animated.timing(btnShine, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: ND,
        }),
        Animated.timing(btnShine, { toValue: 0, duration: 0, useNativeDriver: ND }),
      ])
    );
    shineLoop.start();
    return () => shineLoop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // progress bar fill + celebrate when everything is filled
  useEffect(() => {
    Animated.timing(progress, {
      toValue: done / 4,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // animates width
    }).start();

    Animated.spring(celebrate, {
      toValue: done === 4 ? 1 : 0,
      friction: 4,
      tension: 140,
      useNativeDriver: ND,
    }).start();
  }, [done]);

  // avatar "pop" whenever the gender changes
  useEffect(() => {
    Animated.sequence([
      Animated.timing(avatarPop, { toValue: 0.75, duration: 90, useNativeDriver: ND }),
      Animated.spring(avatarPop, {
        toValue: 1,
        friction: 3,
        tension: 160,
        useNativeDriver: ND,
      }),
    ]).start();
  }, [gender]);

  const playShake = () => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: ND }),
      Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: ND }),
      Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: ND }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: ND }),
    ]).start();
  };

  const btnTo = (v: number, friction = 6, tension = 200) =>
    Animated.spring(btnScale, {
      toValue: v,
      friction,
      tension,
      useNativeDriver: ND,
    }).start();

  const clearError = (key: keyof Errors) => {
    setServerError("");
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const openCalendar = () => {
    if (loading) return;

    if (dobDigits.length === 8) {
      const mm = Number(dobDigits.slice(2, 4)) - 1;
      const yyyy = Number(dobDigits.slice(4, 8));

      if (mm >= 0 && mm <= 11 && yyyy >= MIN_DOB_YEAR && yyyy <= today.getFullYear()) {
        setCalendarMonth(mm);
        setCalendarYear(yyyy);
      } else {
        setCalendarMonth(today.getMonth());
        setCalendarYear(today.getFullYear());
      }
    } else {
      setCalendarMonth(today.getMonth());
      setCalendarYear(today.getFullYear());
    }

    setCalendarMode("days");
    setCalendarVisible(true);
  };

  const isCurrentMonth =
    calendarYear === today.getFullYear() && calendarMonth === today.getMonth();

  const isAtFirstMonth =
    calendarYear === MIN_DOB_YEAR && calendarMonth === 0;

  const isAtLastMonth =
    calendarYear === today.getFullYear() && calendarMonth === today.getMonth();

  const goToPreviousMonth = () => {
    if (isAtFirstMonth) return;

    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((year) => year - 1);
    } else {
      setCalendarMonth((month) => month - 1);
    }
  };

  const goToNextMonth = () => {
    if (isAtLastMonth) return;

    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((year) => year + 1);
    } else {
      setCalendarMonth((month) => month + 1);
    }
  };

  const selectCalendarYear = (year: number) => {
    let month = calendarMonth;

    // If the user jumps to the current year, never show a future month.
    if (year === today.getFullYear() && month > today.getMonth()) {
      month = today.getMonth();
    }

    setCalendarYear(year);
    setCalendarMonth(month);
    setCalendarMode("days");
  };

  const selectCalendarMonth = (month: number) => {
    if (calendarYear === today.getFullYear() && month > today.getMonth()) return;

    setCalendarMonth(month);
    setCalendarMode("days");
  };

  const calendarYears = Array.from(
    { length: today.getFullYear() - MIN_DOB_YEAR + 1 },
    (_, index) => today.getFullYear() - index
  );

  const selectDob = (day: number) => {
    const selected = new Date(calendarYear, calendarMonth, day);

    if (selected > today || calendarYear < MIN_DOB_YEAR) return;

    setDobDigits(formatSelectedDate(selected));
    clearError("dob");
    setCalendarVisible(false);
  };

  /* ---------- validation ---------- */

  const validate = () => {
    const e: Errors = {};

    if (!cleanedName) e.username = "Please enter your username";
    else if (cleanedName.length < 2) e.username = "At least 2 letters";
    else if (cleanedName.length > 20) e.username = "Maximum 20 letters";
    else if (!NAME_REGEX.test(cleanedName)) e.username = "Only letters are allowed";

    // DOB
    let isoDob = "";
    if (dobDigits.length !== 8) {
      e.dob = "Enter date as DD / MM / YYYY";
    } else {
      const dd = Number(dobDigits.slice(0, 2));
      const mm = Number(dobDigits.slice(2, 4));
      const yyyy = Number(dobDigits.slice(4, 8));
      const date = new Date(yyyy, mm - 1, dd);
      const valid =
        date.getFullYear() === yyyy &&
        date.getMonth() === mm - 1 &&
        date.getDate() === dd;

      if (!valid || yyyy < MIN_DOB_YEAR) e.dob = "Enter a valid date";
      else if (date.getTime() > Date.now()) e.dob = "Date can't be in the future";
      else
        isoDob = `${String(yyyy)}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
    }

    if (!gender) e.gender = "Please select your gender";

    if (!PHONE_REGEX.test(phone)) e.phone = "Enter a valid 10 digit number";

    setErrors(e);
    return { ok: Object.keys(e).length === 0, cleanName: cleanedName, isoDob };
  };

  /* ---------- submit ---------- */

  const handleSubmit = async () => {
    if (loading) return;

    const { ok, cleanName, isoDob } = validate();
    if (!ok || !gender) {
      playShake();
      return;
    }

    setServerError("");
    setLoading(true);

    try {
      /**
       * FRONTEND -> POST /api/auth/register { deviceId, username, dob, gender, phone }
       * BACKEND  -> validates, finds / creates player in MySQL
       * BACKEND  -> JSON { success, player: { id, name } }
       */
      const player = await registerAccount({
        username: cleanName,
        dob: isoDob,
        gender,
        phone: `+91${phone}`,
      });

      onLogin({
        success: true,
        player: player,
      } as unknown as LoginResponse);
    } catch (err: any) {
      setServerError(err?.message || "Couldn't connect. Check server and try again.");
      playShake();
    } finally {
      setLoading(false);
    }
  };

  /* ---------- responsive layout ----------
     phone / tablet : header band on top, form card overlaps it
     website (>=900): split screen - hero on the left, form on the right
  ------------------------------------------------------------------ */
  const wide = width >= 900;
  const heroW = wide ? Math.min(Math.max(width * 0.44, 400), 620) : 0;
  const rightW = wide ? width - heroW : width;
  const colW = Math.min(rightW - (wide ? 64 : 32), 480);
  const unit = Math.min(Math.max(colW / 350, 0.92), 1.15);
  const block = Math.round(50 * unit);
  const short = height < 700;
  const statusPad = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  const avatarMeta =
    gender === "Male"
      ? { icon: "face-man" as IconName, color: "#3B82F6", bg: "#DBEAFE" }
      : gender === "Female"
      ? { icon: "face-woman" as IconName, color: "#EC4899", bg: "#FCE7F3" }
      : gender === "Other"
      ? { icon: "account-star" as IconName, color: "#8B5CF6", bg: "#EDE9FE" }
      : { icon: "emoticon-happy-outline" as IconName, color: "#9AA5CF", bg: "#EEF1FD" };

  const firstName = cleanedName.split(" ")[0];

  const slideUp = (v: Animated.Value, dist = 22) => ({
    opacity: v,
    transform: [
      { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [dist, 0] }) },
    ],
  });

  const webNoOutline = web({ outlineStyle: "none" });

  const inputStyle = [styles.input, webNoOutline];

  /* ================= form card (shared by both layouts) ================= */
  const formCard = (
    <Animated.View
      style={[
        styles.card,
        { width: colW, paddingHorizontal: Math.round(22 * unit) },
        {
          opacity: cardIn,
          transform: [
            {
              translateY: cardIn.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
            { translateX: shake },
          ],
        },
      ]}
    >
      {/* avatar preview (changes with gender) */}
      <Animated.View
        style={[
          styles.avatarRing,
          {
            opacity: avatarIn,
            transform: [
              { scale: Animated.multiply(avatarIn, avatarPop) },
            ],
          },
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: avatarMeta.bg }]}>
          <MaterialCommunityIcons name={avatarMeta.icon} size={46} color={avatarMeta.color} />
        </View>
      </Animated.View>

      <Text style={[styles.hi, { fontSize: Math.round(22 * unit) }]} numberOfLines={1}>
        {firstName ? `Hi, ${firstName}!` : "Hi there!"}
      </Text>
      <Text style={styles.hiSub}>Fill in your details to continue</Text>

      {/* progress (like an XP bar) */}
      <View style={styles.progressWrap}>
        <View style={styles.progressTop}>
          <Text style={styles.progressLabel}>Profile ready</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Animated.View
              style={{
                marginRight: 6,
                opacity: celebrate,
                transform: [
                  { scale: celebrate.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) },
                ],
              }}
            >
              <MaterialCommunityIcons name="trophy" size={18} color={YELLOW} />
            </Animated.View>
            <Text style={[styles.progressCount, done === 4 && { color: GREEN }]}>
              {done}/4
            </Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: done === 4 ? GREEN : YELLOW,
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* Username */}
      <Animated.View style={[styles.section, slideUp(secIn[0])]}>
        <Field
          label="USERNAME"
          icon="account"
          color="#8B5CF6"
          block={block}
          focused={focus === "username"}
          error={errors.username}
        >
          <TextInput
            value={username}
            onChangeText={(t) => {
              setUsername(t.replace(/[^A-Za-z ]/g, ""));
              clearError("username");
            }}
            placeholder="Enter your username"
            placeholderTextColor={PLACEHOLDER}
            maxLength={20}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!loading}
            onFocus={() => setFocus("username")}
            onBlur={() => setFocus(null)}
            style={inputStyle}
          />
          {nameOk ? (
            <MaterialCommunityIcons
              name="check-circle"
              size={22}
              color={GREEN}
              style={{ marginRight: 12 }}
            />
          ) : null}
        </Field>
      </Animated.View>

      {/* Date of birth */}
      <Animated.View style={[styles.section, slideUp(secIn[1])]} >
        <Field
          label="DATE OF BIRTH"
          icon="cake-variant"
          color="#F59E0B"
          block={block}
          focused={calendarVisible || focus === "dob"}
          error={errors.dob}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Select date of birth"
            onPress={openCalendar}
            disabled={loading}
            style={styles.dobPressable}
          >
            <TextInput
              value={formatDob(dobDigits)}
              placeholder="DD / MM / YYYY"
              placeholderTextColor={PLACEHOLDER}
              editable={false}
              pointerEvents="none"
              style={inputStyle}
            />

            {dobOk ? (
              <MaterialCommunityIcons
                name="check-circle"
                size={22}
                color={GREEN}
                style={{ marginRight: 12 }}
              />
            ) : (
              <View style={styles.calendarButton}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={25}
                  color="#8B5CF6"
                />
              </View>
            )}
          </Pressable>
        </Field>
      </Animated.View>

      {/* Gender */}
      <Animated.View style={[styles.section, slideUp(secIn[2])]}>
        <Text style={styles.fieldLabel}>GENDER</Text>
        <View style={{ flexDirection: "row", paddingTop: 6 }}>
          {GENDERS.map((g, i) => (
            <GenderCard
              key={g.value}
              value={g.value}
              icon={g.icon}
              color={g.color}
              gap={i > 0}
              height={Math.round(92 * unit)}
              active={gender === g.value}
              disabled={loading}
              onPress={() => {
                setGender(g.value);
                clearError("gender");
              }}
            />
          ))}
        </View>
        {errors.gender ? <Text style={styles.error}>{errors.gender}</Text> : null}
      </Animated.View>

      {/* Phone */}
      <Animated.View style={[styles.section, slideUp(secIn[3])]}>
        <Field
          label="PHONE NUMBER"
          icon="phone"
          color="#10B981"
          block={block}
          focused={focus === "phone"}
          error={errors.phone}
        >
          <View style={styles.codeChip}>
            <Text style={styles.codeText}>+91</Text>
          </View>
          <TextInput
            value={phone}
            onChangeText={(t) => {
              setPhone(t.replace(/\D/g, "").slice(0, 10));
              clearError("phone");
            }}
            placeholder="10 digit number"
            placeholderTextColor={PLACEHOLDER}
            keyboardType="phone-pad"
            maxLength={10}
            editable={!loading}
            onFocus={() => setFocus("phone")}
            onBlur={() => setFocus(null)}
            onSubmitEditing={handleSubmit}
            style={[inputStyle, { paddingLeft: 10 }]}
          />
          {phoneOk ? (
            <MaterialCommunityIcons
              name="check-circle"
              size={22}
              color={GREEN}
              style={{ marginRight: 12 }}
            />
          ) : null}
        </Field>
      </Animated.View>

      {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

      {/* Login button */}
      <Animated.View style={[{ marginTop: 22 }, slideUp(secIn[4], 30)]}>
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Login"
            disabled={loading}
            onPress={handleSubmit}
            onPressIn={() => btnTo(0.97)}
            onPressOut={() => btnTo(1, 4, 160)}
            {...({
              onHoverIn: () => btnTo(1.025),
              onHoverOut: () => btnTo(1),
            } as any)}
            style={[styles.btnShadow, loading && { opacity: 0.85 }, web({ cursor: "pointer" })]}
          >
            <View
              onLayout={(e) => setBtnW(e.nativeEvent.layout.width)}
              style={[styles.btnInner, { paddingVertical: Math.round(14 * unit) }]}
            >
              <GradientFill from="#3A4BD0" to="#1F2D86" />

              <View style={{ width: 40 }}>
                <Animated.View
                  style={{
                    opacity: btnStar.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
                    transform: [
                      { scale: btnStar.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.25] }) },
                    ],
                  }}
                >
                  <MaterialCommunityIcons name="star-four-points" size={18} color={YELLOW} />
                </Animated.View>
              </View>

              {loading ? (
                <View style={{ flex: 1, alignItems: "center" }}>
                  <ActivityIndicator color="#FFFFFF" />
                </View>
              ) : (
                <Text style={[styles.btnText, { fontSize: Math.round(21 * unit) }]}>Login</Text>
              )}

              <View style={styles.btnArrow}>
                <MaterialCommunityIcons name="arrow-right" size={22} color={NAVY} />
              </View>

              <Animated.View
                pointerEvents="none"
                style={[
                  styles.shineBand,
                  {
                    transform: [
                      {
                        translateX: btnShine.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-80, btnW + 80],
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

        <View style={styles.noteRow}>
          <MaterialCommunityIcons name="shield-check" size={18} color={GREEN} />
          <Text style={styles.note}>
            Already registered? Use the same phone number to log in.
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );

  /* ================= header band (phone / tablet) ================= */
  const header = (
    <Animated.View
      style={[
        styles.header,
        {
          paddingTop: (short ? 62 : 72) + statusPad,
          paddingBottom: 78,
          opacity: headerIn,
          transform: [
            {
              translateY: headerIn.interpolate({
                inputRange: [0, 1],
                outputRange: [-40, 0],
              }),
            },
          ],
        },
      ]}
    >
      <GradientFill from="#3445C4" to="#1B2A6B" />

      <Orb size={240} color="#FFFFFF" top={-90} left={width - 150}
        dx={-10} dy={10} duration={7000} minOpacity={0.06} maxOpacity={0.12} />
      <Orb size={170} color={YELLOW} top={40} left={-70}
        dx={12} dy={-8} duration={6000} minOpacity={0.15} maxOpacity={0.28} />

      <Twinkle left={width * 0.46} top={52 + statusPad} size={14} color={YELLOW} />
      <Twinkle left={width * 0.12} top={110 + statusPad} size={10} color="#7DD3FC" delay={400} />

      <FloatItem style={{ left: width * 0.5, bottom: 56 }} rotate={-10} duration={2800}>
        <MaterialCommunityIcons name="puzzle" size={34} color="#5EEAD4" />
      </FloatItem>

      <View
        style={{
          width: Math.min(width - 32, 560),
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 4,
        }}
      >
        <View style={{ flex: 1, paddingRight: 8 }}>
          <View style={styles.chip}>
            <MaterialCommunityIcons name="rocket-launch" size={14} color={NAVY} />
            <Text style={styles.chipText}>Let's get started!</Text>
          </View>
          <Text
            style={[
              styles.headTitle,
              { fontSize: Math.round(Math.min(Math.max(width * 0.075, 26), 38)) },
            ]}
          >
            Create Your{"\n"}Account
          </Text>
          <Text style={styles.headSub}>Join MIND GAMES and start playing.</Text>
        </View>

        <Animated.View
          style={{
            opacity: mascotIn,
            transform: [
              { scale: mascotIn.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
            ],
          }}
        >
          <Mascot size={Math.round(Math.min(Math.max(width * 0.2, 78), 110))} />
        </Animated.View>
      </View>
    </Animated.View>
  );

  /* ================= hero panel (website) ================= */
  const features: { icon: IconName; text: string; color: string }[] = [
    { icon: "trophy", text: "Earn rewards and level up", color: YELLOW },
    { icon: "chart-line", text: "Track your progress", color: "#5EEAD4" },
    { icon: "account-group", text: "Play with friends", color: "#F9A8D4" },
  ];

  const hero = (
    <View style={[styles.hero, { width: heroW }]}>
      <GradientFill from="#3445C4" to="#1B2A6B" />

      <Orb size={420} color="#FFFFFF" top={-150} left={heroW - 240}
        dx={-14} dy={14} duration={8000} minOpacity={0.05} maxOpacity={0.1} />
      <Orb size={300} color={YELLOW} top={height - 220} left={-110}
        dx={14} dy={-12} duration={7000} minOpacity={0.14} maxOpacity={0.26} />

      <Twinkle left={heroW * 0.16} top={height * 0.14} size={16} color={YELLOW} />
      <Twinkle left={heroW * 0.84} top={height * 0.3} size={12} color="#7DD3FC" delay={400} />
      <Twinkle left={heroW * 0.78} top={height * 0.78} size={14} color="#F9A8D4" delay={800} />

      <FloatItem style={{ left: heroW * 0.1, top: height * 0.62 }} rotate={-12} duration={3000}>
        <MaterialCommunityIcons name="puzzle" size={52} color="#5EEAD4" />
      </FloatItem>
      <FloatItem style={{ right: heroW * 0.1, top: height * 0.52 }} rotate={12} duration={2600} delay={500}>
        <MaterialCommunityIcons name="lightbulb-on" size={46} color={YELLOW} />
      </FloatItem>

      <View style={styles.heroInner}>
        <Animated.View
          style={{
            opacity: mascotIn,
            transform: [
              { scale: mascotIn.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
            ],
          }}
        >
          <Mascot size={Math.round(Math.min(Math.max(heroW * 0.3, 120), 170))} />
        </Animated.View>

        <Animated.View style={[{ alignItems: "center" }, slideUp(headerIn, 20)]}>
          <View style={styles.brandPill}>
            <Text style={styles.brandMind}>MIND</Text>
            <Text style={styles.brandGames}> GAMES</Text>
          </View>

          <Text style={styles.heroTitle}>Create Your Account</Text>
          <Text style={styles.heroSub}>
            Let's get started! Fill in your details to continue.
          </Text>

          <View style={{ marginTop: 26, alignSelf: "stretch" }}>
            {features.map((f) => (
              <View key={f.text} style={styles.featureRow}>
                <View style={[styles.featureIcon, { backgroundColor: f.color + "33" }]}>
                  <MaterialCommunityIcons name={f.icon} size={20} color={f.color} />
                </View>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </View>
  );

  /* ================= render ================= */
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle={wide ? "dark-content" : "light-content"}
        backgroundColor={wide ? CREAM : "#3445C4"}
      />

      {wide ? (
        <View style={{ flex: 1, flexDirection: "row" }}>
          {hero}

          {/* right: form */}
          <View style={{ flex: 1, backgroundColor: CREAM, overflow: "hidden" }}>
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <Orb size={320} color="#FFE9A6" top={-140} left={rightW - 200}
                dx={-12} dy={10} duration={7000} minOpacity={0.7} maxOpacity={1} />
              <Orb size={260} color="#E4E8FB" top={height - 160} left={-110}
                dx={12} dy={-8} duration={8000} minOpacity={0.7} maxOpacity={1} />
              <Confetti width={rightW} height={height} />
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }}>
              <ScrollView
                contentContainerStyle={styles.rightScroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={{ paddingTop: 54 }}>{formCard}</View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Orb size={260} color="#E4E8FB" top={height * 0.55} left={-120}
              dx={12} dy={-8} duration={8000} minOpacity={0.7} maxOpacity={1} />
            <Orb size={220} color="#FFE9A6" top={height * 0.75} left={width - 120}
              dx={-10} dy={10} duration={7000} minOpacity={0.7} maxOpacity={1} />
            <Confetti width={width} height={height} />
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.stackScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {header}

              <View style={styles.cardLift}>
                <View style={{ paddingTop: 44 }}>{formCard}</View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      )}

      {/* back button (always on top) */}
      <Animated.View
        style={[styles.backWrap, { top: 14 + statusPad, left: 16, opacity: backIn }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          style={[styles.backBtn, web({ cursor: "pointer" })]}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={NAVY} />
        </Pressable>
      </Animated.View>

      {/* Date picker modal */}
      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <Pressable
          style={styles.calendarOverlay}
          onPress={() => setCalendarVisible(false)}
        >
          <Pressable
            style={styles.calendarModal}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.calendarHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.calendarSmallTitle}>DATE OF BIRTH</Text>
                <Text style={styles.calendarSelectedDate}>
                  {dobDigits.length === 8 ? formatDob(dobDigits) : "Select your date"}
                </Text>
              </View>

              <Pressable
                onPress={() => setCalendarVisible(false)}
                style={styles.calendarClose}
              >
                <MaterialCommunityIcons name="close" size={22} color={NAVY} />
              </Pressable>
            </View>

            {calendarMode === "days" ? (
              <>
                <View style={styles.monthNavigation}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Previous month"
                    disabled={isAtFirstMonth}
                    style={[styles.monthArrow, isAtFirstMonth && styles.monthArrowDisabled]}
                    onPress={goToPreviousMonth}
                  >
                    <MaterialCommunityIcons
                      name="chevron-left"
                      size={28}
                      color={isAtFirstMonth ? "#B9C0D6" : NAVY}
                    />
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Change month or year"
                    onPress={() => setCalendarMode("months")}
                    style={styles.monthTitleButton}
                  >
                    <Text style={styles.monthTitle}>
                      {MONTHS[calendarMonth]} {calendarYear}
                    </Text>
                    <MaterialCommunityIcons name="chevron-down" size={19} color="#8B5CF6" />
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Next month"
                    disabled={isAtLastMonth}
                    style={[styles.monthArrow, isAtLastMonth && styles.monthArrowDisabled]}
                    onPress={goToNextMonth}
                  >
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={28}
                      color={isAtLastMonth ? "#B9C0D6" : NAVY}
                    />
                  </Pressable>
                </View>

                <View style={styles.quickPickerRow}>
                  <Pressable
                    style={[styles.quickPickerButton, styles.quickPickerButtonActive]}
                    onPress={() => setCalendarMode("months")}
                  >
                    <MaterialCommunityIcons name="calendar-month" size={17} color="#8B5CF6" />
                    <Text style={styles.quickPickerText}>Month</Text>
                  </Pressable>
                  <Pressable
                    style={styles.quickPickerButton}
                    onPress={() => setCalendarMode("years")}
                  >
                    <MaterialCommunityIcons name="calendar-range" size={17} color="#65709F" />
                    <Text style={styles.quickPickerTextMuted}>Year</Text>
                  </Pressable>
                </View>

                <View style={styles.weekRow}>
                  {WEEK_DAYS.map((day) => (
                    <Text key={day} style={styles.weekDay}>
                      {day}
                    </Text>
                  ))}
                </View>

                <View style={styles.daysGrid}>
                  {Array.from(
                    { length: getFirstDayOfMonth(calendarYear, calendarMonth) },
                    (_, index) => (
                      <View key={`empty-${index}`} style={styles.dayCell} />
                    )
                  )}

                  {Array.from(
                    { length: getDaysInMonth(calendarYear, calendarMonth) },
                    (_, index) => {
                      const day = index + 1;
                      const selected =
                        dobDigits.length === 8 &&
                        Number(dobDigits.slice(0, 2)) === day &&
                        Number(dobDigits.slice(2, 4)) - 1 === calendarMonth &&
                        Number(dobDigits.slice(4, 8)) === calendarYear;

                      const date = new Date(calendarYear, calendarMonth, day);
                      const isToday =
                        date.getFullYear() === today.getFullYear() &&
                        date.getMonth() === today.getMonth() &&
                        date.getDate() === today.getDate();
                      const isFuture = date > today;

                      return (
                        <Pressable
                          key={day}
                          accessibilityRole="button"
                          accessibilityLabel={`${MONTHS[calendarMonth]} ${day}, ${calendarYear}`}
                          disabled={isFuture}
                          onPress={() => selectDob(day)}
                          style={[
                            styles.dayCell,
                            isToday && !selected && styles.todayDay,
                            selected && styles.selectedDay,
                            isFuture && styles.disabledDay,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              isToday && !selected && styles.todayDayText,
                              selected && styles.selectedDayText,
                              isFuture && styles.disabledDayText,
                            ]}
                          >
                            {day}
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>
              </>
            ) : calendarMode === "months" ? (
              <>
                <View style={styles.selectorHeader}>
                  <Pressable onPress={() => setCalendarMode("days")} style={styles.selectorBack}>
                    <MaterialCommunityIcons name="arrow-left" size={20} color={NAVY} />
                  </Pressable>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.selectorTitle}>Select month</Text>
                    <Text style={styles.selectorSubtitle}>{calendarYear}</Text>
                  </View>
                  <Pressable onPress={() => setCalendarMode("years")} style={styles.selectorYearButton}>
                    <Text style={styles.selectorYearText}>{calendarYear}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={17} color="#8B5CF6" />
                  </Pressable>
                </View>

                <View style={styles.monthGrid}>
                  {MONTHS.map((month, index) => {
                    const disabled = calendarYear === today.getFullYear() && index > today.getMonth();
                    const active = calendarMonth === index;
                    return (
                      <Pressable
                        key={month}
                        disabled={disabled}
                        onPress={() => selectCalendarMonth(index)}
                        style={[
                          styles.monthOption,
                          active && styles.monthOptionActive,
                          disabled && styles.monthOptionDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.monthOptionText,
                            active && styles.monthOptionTextActive,
                            disabled && styles.monthOptionTextDisabled,
                          ]}
                        >
                          {month.slice(0, 3)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable style={styles.selectorDone} onPress={() => setCalendarMode("days")}>
                  <Text style={styles.selectorDoneText}>Back to calendar</Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.selectorHeader}>
                  <Pressable onPress={() => setCalendarMode("days")} style={styles.selectorBack}>
                    <MaterialCommunityIcons name="arrow-left" size={20} color={NAVY} />
                  </Pressable>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.selectorTitle}>Select year</Text>
                    <Text style={styles.selectorSubtitle}>Choose your birth year</Text>
                  </View>
                  <View style={styles.currentYearBadge}>
                    <Text style={styles.currentYearBadgeText}>{calendarYear}</Text>
                  </View>
                </View>

                <ScrollView
                  style={styles.yearScroll}
                  contentContainerStyle={styles.yearGrid}
                  showsVerticalScrollIndicator={false}
                >
                  {calendarYears.map((year) => {
                    const active = calendarYear === year;
                    return (
                      <Pressable
                        key={year}
                        onPress={() => selectCalendarYear(year)}
                        style={[styles.yearOption, active && styles.yearOptionActive]}
                      >
                        <Text style={[styles.yearOptionText, active && styles.yearOptionTextActive]}>
                          {year}
                        </Text>
                        {active ? (
                          <MaterialCommunityIcons name="check" size={17} color="#FFFFFF" />
                        ) : null}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </>
            )}

            {calendarMode === "days" ? (
              <Pressable
                style={styles.calendarDone}
                onPress={() => setCalendarVisible(false)}
              >
                <Text style={styles.calendarDoneText}>Done</Text>
              </Pressable>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
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

  stackScroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 40,
  },

  rightScroll: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 32,
  },

  cardLift: {
    marginTop: -62,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  /* header band */
  header: {
    width: "100%",
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
    overflow: "hidden",
    paddingHorizontal: 16,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: YELLOW,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 10,
  },

  chipText: {
    marginLeft: 6,
    color: NAVY,
    fontSize: 12,
    fontWeight: "800",
  },

  headTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    letterSpacing: 0.5,
    ...(Platform.OS === "web"
      ? ({
          fontFamily:
            '"Baloo 2","Fredoka","Trebuchet MS","Segoe UI",system-ui,sans-serif',
        } as any)
      : null),
  },

  headSub: {
    marginTop: 6,
    color: "#C9D2FF",
    fontSize: 13.5,
  },

  /* hero (website) */
  hero: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  heroInner: {
    width: "100%",
    maxWidth: 440,
    alignItems: "center",
    paddingHorizontal: 36,
  },

  brandPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginTop: 4,
  },

  brandMind: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: YELLOW,
  },

  brandGames: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#FFFFFF",
  },

  heroTitle: {
    marginTop: 22,
    fontSize: 38,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    ...(Platform.OS === "web"
      ? ({
          fontFamily:
            '"Baloo 2","Fredoka","Trebuchet MS","Segoe UI",system-ui,sans-serif',
        } as any)
      : null),
  },

  heroSub: {
    marginTop: 8,
    fontSize: 15,
    color: "#C9D2FF",
    textAlign: "center",
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  featureText: {
    marginLeft: 12,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  /* back */
  backWrap: {
    position: "absolute",
    zIndex: 30,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0B1240",
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },

  /* card */
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E9EDFB",
    borderRadius: 32,
    paddingTop: 52,
    paddingBottom: 22,
    shadowColor: "#22308A",
    shadowOpacity: 0.18,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },

  avatarRing: {
    position: "absolute",
    top: -42,
    alignSelf: "center",
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#22308A",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  hi: {
    textAlign: "center",
    fontWeight: "900",
    color: NAVY,
  },

  hiSub: {
    textAlign: "center",
    marginTop: 2,
    fontSize: 13,
    color: "#5A67A8",
  },

  progressWrap: {
    marginTop: 16,
    marginBottom: 6,
  },

  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  progressLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#5A67A8",
    letterSpacing: 0.5,
  },

  progressCount: {
    fontSize: 13,
    fontWeight: "900",
    color: NAVY,
  },

  progressTrack: {
    height: 10,
    borderRadius: 6,
    backgroundColor: "#EEF1FD",
    overflow: "hidden",
  },

  progressFill: {
    height: 10,
    borderRadius: 6,
  },

  section: {
    marginTop: 16,
  },

  /* date picker */
  dobPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  calendarButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },

  calendarOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  calendarModal: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    shadowColor: "#172554",
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 15,
  },

  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  calendarSmallTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#8B5CF6",
  },

  calendarSelectedDate: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "900",
    color: NAVY,
  },

  calendarClose: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F3FF",
    alignItems: "center",
    justifyContent: "center",
  },

  monthNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  monthArrow: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F1F3FF",
    alignItems: "center",
    justifyContent: "center",
  },

  monthTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: NAVY,
  },

  monthTitleButton: {
    minWidth: 170,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#F7F5FF",
  },

  monthArrowDisabled: {
    backgroundColor: "#F7F8FC",
    opacity: 0.9,
  },

  quickPickerRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  quickPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F5F6FB",
  },

  quickPickerButtonActive: {
    backgroundColor: "#EEE9FF",
  },

  quickPickerText: {
    marginLeft: 6,
    color: "#8B5CF6",
    fontSize: 12.5,
    fontWeight: "900",
  },

  quickPickerTextMuted: {
    marginLeft: 6,
    color: "#65709F",
    fontSize: 12.5,
    fontWeight: "800",
  },

  todayDay: {
    borderWidth: 1.5,
    borderColor: "#8B5CF6",
  },

  todayDayText: {
    color: "#8B5CF6",
    fontWeight: "900",
  },

  selectorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  selectorBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  selectorTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: NAVY,
  },

  selectorSubtitle: {
    marginTop: 2,
    color: "#7A84A9",
    fontSize: 12,
    fontWeight: "600",
  },

  selectorYearButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EEE9FF",
  },

  selectorYearText: {
    color: "#8B5CF6",
    fontWeight: "900",
    marginRight: 2,
  },

  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  monthOption: {
    width: "31.5%",
    height: 54,
    borderRadius: 15,
    backgroundColor: "#F6F8FD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
    borderWidth: 1.5,
    borderColor: "#EEF1F8",
  },

  monthOptionActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },

  monthOptionDisabled: {
    opacity: 0.35,
  },

  monthOptionText: {
    color: NAVY,
    fontSize: 14,
    fontWeight: "800",
  },

  monthOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  monthOptionTextDisabled: {
    color: "#9BA4BF",
  },

  selectorDone: {
    marginTop: 8,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F1F3FF",
    alignItems: "center",
    justifyContent: "center",
  },

  selectorDoneText: {
    color: NAVY,
    fontSize: 14,
    fontWeight: "900",
  },

  yearScroll: {
    height: 300,
    marginHorizontal: -4,
  },

  yearGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 4,
    paddingBottom: 6,
    justifyContent: "space-between",
  },

  yearOption: {
    width: "31.5%",
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F6F8FD",
    borderWidth: 1.5,
    borderColor: "#EEF1F8",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 8,
  },

  yearOptionActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },

  yearOptionText: {
    color: NAVY,
    fontSize: 13.5,
    fontWeight: "800",
  },

  yearOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "900",
    marginRight: 3,
  },

  currentYearBadge: {
    minWidth: 58,
    height: 36,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
  },

  currentYearBadgeText: {
    color: "#8B5CF6",
    fontSize: 13,
    fontWeight: "900",
  },

  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  weekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
    color: "#8A94B8",
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayCell: {
    width: "14.2857%",
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    marginBottom: 3,
  },

  dayText: {
    fontSize: 15,
    fontWeight: "700",
    color: NAVY,
  },

  selectedDay: {
    backgroundColor: "#8B5CF6",
  },

  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  disabledDay: {
    opacity: 0.25,
  },

  disabledDayText: {
    color: "#AAB2CC",
  },

  calendarDone: {
    marginTop: 16,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
  },

  calendarDoneText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  /* fields */
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#5A67A8",
    marginBottom: 6,
    marginLeft: 4,
  },

  fieldBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: INPUT_BG,
    borderWidth: 2,
    borderColor: INPUT_BORDER,
    borderRadius: 18,
    overflow: "hidden",
  },

  fieldError: {
    borderColor: ERROR,
    backgroundColor: "#FFF5F5",
  },

  iconBlock: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    paddingVertical: 14,
    paddingHorizontal: 14,
    color: NAVY,
    fontSize: 15.5,
    fontWeight: "700",
  },

  codeChip: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#E3F8EF",
  },

  codeText: {
    color: "#0B7A55",
    fontSize: 14.5,
    fontWeight: "900",
  },

  error: {
    color: ERROR,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
    marginLeft: 6,
  },

  serverError: {
    color: ERROR,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 16,
  },

  /* gender */
  genderCard: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: INPUT_BORDER,
    backgroundColor: INPUT_BG,
  },

  genderCardActive: {
    backgroundColor: YELLOW,
    borderColor: "#FFB300",
    borderBottomColor: "#F29A00",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  genderIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },

  genderText: {
    marginTop: 6,
    fontSize: 13.5,
    fontWeight: "800",
    color: "#5A67A8",
  },

  checkBadge: {
    position: "absolute",
    top: -7,
    right: -7,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GREEN,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  /* button */
  btnShadow: {
    borderRadius: 20,
    shadowColor: "#22308A",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  btnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    overflow: "hidden",
    paddingLeft: 16,
    paddingRight: 12,
    borderBottomWidth: 5,
    borderBottomColor: "#111B52",
  },

  btnText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  btnArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: YELLOW,
    alignItems: "center",
    justifyContent: "center",
  },

  shineBand: {
    position: "absolute",
    top: -10,
    bottom: -10,
    width: 46,
    backgroundColor: "rgba(255,255,255,0.22)",
  },

  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },

  note: {
    marginLeft: 7,
    fontSize: 12.5,
    color: "#3F4D82",
    flexShrink: 1,
    textAlign: "center",
  },
});