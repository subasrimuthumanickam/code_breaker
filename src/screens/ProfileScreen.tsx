
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
  Modal,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPlayer } from "../api/profileApi";
import * as ProfileApi from "../api/profileApi";

/* ------------------------------------------------------------------ */
/* Props                                                              */
/* ------------------------------------------------------------------ */

export type ProfileField = "name" | "dob" | "gender" | "mobile";

type Props = {
  stats?: any;
  onBack: () => void;
  onLogout: () => void | Promise<void>;
  onTabHome?: () => void;
  onTabGames?: () => void;
  onOpenSettings?: () => void;

  name?: string;
  dob?: string;
  gender?: string;
  mobile?: string;

  onEditField?: (field: ProfileField, currentValue: string) => void;
};

/* ------------------------------------------------------------------ */
/* Theme                                                              */
/* ------------------------------------------------------------------ */

const ND = Platform.OS !== "web";

const NAVY = "#1B2A6B";
const CREAM = "#FDF8F1";
const YELLOW = "#FFC21A";

const web = (s: object) => (Platform.OS === "web" ? (s as any) : null);

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

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

    const timer = setTimeout(() => {
      loop.start();
    }, delay);

    return () => {
      clearTimeout(timer);
      loop.stop();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return v;
};

const pick = (obj: any, keys: string[]): string => {
  if (!obj) return "";

  for (const k of keys) {
    const v = obj?.[k];

    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v);
    }
  }

  return "";
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatDob = (raw: string): string => {
  if (!raw) return "";

  // 1) ISO: 2000-10-07 or 2000-10-07T00:00:00.000Z
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);

  if (iso) {
    const month = MONTHS[Number(iso[2]) - 1];

    if (month) {
      return `${iso[3]} ${month} ${iso[1]}`;
    }
  }

  // 2) Date-string style: "Wed Oct 07" or "Wed Oct 07 2000"
  const txt = /^[A-Za-z]{3},?\s+([A-Za-z]{3})\s+(\d{1,2})(?:\s+(\d{4}))?/.exec(raw.trim());

  if (txt) {
    const day = txt[2].padStart(2, "0");
    return txt[3] ? `${day} ${txt[1]} ${txt[3]}` : `${day} ${txt[1]}`;
  }

  return raw;
};

const formatGender = (raw: string): string => {
  if (!raw) return "";

  const s = raw.trim().toLowerCase();

  if (s === "m" || s === "male") return "Male";
  if (s === "f" || s === "female") return "Female";

  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const formatMobile = (raw: string): string => {
  if (!raw) return "";

  const digits = raw.replace(/\s+/g, "");

  if (/^\+/.test(digits)) {
    // +919834923748 -> +91 9834923748
    const m = /^\+91(\d{10})$/.exec(digits);
    return m ? `+91 ${m[1]}` : raw;
  }

  if (/^\d{10}$/.test(digits)) {
    return `+91 ${digits}`;
  }

  return raw;
};

/* ------------------------------------------------------------------ */
/* Background Orb                                                     */
/* ------------------------------------------------------------------ */

const Orb: React.FC<{
  size: number;
  color: string;
  top: number;
  left: number;
  dx?: number;
  dy?: number;
  duration?: number;
}> = ({ size, color, top, left, dx = 10, dy = 8, duration = 6500 }) => {
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
        transform: [
          { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, dx] }) },
          { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, dy] }) },
        ],
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Floating Decoration                                                */
/* ------------------------------------------------------------------ */

const FloatItem: React.FC<{
  style: object;
  rotate?: number;
  amp?: number;
  duration?: number;
  delay?: number;
  children: React.ReactNode;
}> = ({ style, rotate = 0, amp = 6, duration = 2400, delay = 0, children }) => {
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

/* ------------------------------------------------------------------ */
/* Twinkle                                                            */
/* ------------------------------------------------------------------ */

const Twinkle: React.FC<{
  left?: number;
  right?: number;
  top: number;
  size: number;
  color: string;
  delay?: number;
}> = ({ left, right, top, size, color, delay = 0 }) => {
  const t = useLoop(900, delay);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        right,
        top,
        opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }),
        transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.25] }) }],
      }}
    >
      <MaterialCommunityIcons name="star-four-points" size={size} color={color} />
    </Animated.View>
  );
};

/* ------------------------------------------------------------------ */
/* Block                                                              */
/* ------------------------------------------------------------------ */

const Block: React.FC<{ size: number; color: string; letter: string }> = ({ size, color, letter }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.26,
      backgroundColor: color,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.65)",
      borderBottomWidth: 3,
      borderBottomColor: "rgba(0,0,0,0.12)",
      shadowColor: color,
      shadowOpacity: 0.45,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    }}
  >
    <Text style={{ color: "#fff", fontSize: size * 0.52, fontWeight: "900" }}>{letter}</Text>
  </View>
);

/* ------------------------------------------------------------------ */
/* Rays                                                               */
/* ------------------------------------------------------------------ */

const Rays: React.FC<{
  count?: number;
  radius: number;
  size: number;
  color?: string;
  spread?: [number, number];
  delay?: number;
}> = ({ count = 6, radius, size, color = YELLOW, spread = [0, 360], delay = 0 }) => {
  const t = useLoop(1000, delay);

  const items = Array.from({ length: count }, (_, i) => spread[0] + ((spread[1] - spread[0]) / count) * (i + 0.5));

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        width: radius * 2,
        height: radius * 2,
        alignItems: "center",
        justifyContent: "center",
        opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }),
        transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.05] }) }],
      }}
    >
      {items.map((deg, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: size * 0.3,
            height: size,
            borderRadius: size,
            backgroundColor: color,
            transform: [{ rotate: `${deg}deg` }, { translateY: -radius + size / 2 }],
          }}
        />
      ))}
    </Animated.View>
  );
};

/* ------------------------------------------------------------------ */
/* Avatar                                                             */
/* ------------------------------------------------------------------ */

const Avatar: React.FC<{
  size: number;
  photoUri?: string;
  onPress?: () => void;
  busy?: boolean;
}> = ({ size, photoUri, onPress, busy }) => {
  const bob = useLoop(1500);
  const crown = useLoop(1100, 150);
  const glow = useLoop(1800);

  const ring = size * 0.84;
  const badge = Math.round(size * 0.32);

  return (
    <View style={{ width: size * 1.7, height: size * 1.45, alignItems: "center" }}>
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: size * 0.12,
          width: size * 1.5,
          height: size * 1.25,
          borderRadius: size * 0.7,
          backgroundColor: "#EDE6FA",
          opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] }),
          transform: [{ scale: glow.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1.04] }) }],
        }}
      />

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: size * 0.12,
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Rays count={5} radius={size * 0.78} size={size * 0.17} spread={[-110, -20]} />
        <Rays count={5} radius={size * 0.78} size={size * 0.17} spread={[20, 110]} delay={250} />
      </View>

      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -size * 0.02,
          zIndex: 5,
          transform: [
            { translateY: crown.interpolate({ inputRange: [0, 1], outputRange: [-3, 3] }) },
            { rotate: crown.interpolate({ inputRange: [0, 1], outputRange: ["-5deg", "5deg"] }) },
          ],
        }}
      >
        <MaterialCommunityIcons name="crown" size={size * 0.34} color="#FFC21A" />
      </Animated.View>

      <Animated.View
        style={{
          position: "absolute",
          top: size * 0.26,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#F472B6",
          shadowOpacity: 0.35,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 5 },
          elevation: 8,
          transform: [{ translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [-3, 3] }) }],
        }}
      >
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
          style={[
            {
              width: ring,
              height: ring,
              borderRadius: ring / 2,
              backgroundColor: "#F9A8C9",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 3,
              borderColor: "#FFD3E4",
              overflow: "hidden",
            },
            web({ cursor: "pointer" }),
          ]}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={{ width: ring, height: ring }} resizeMode="cover" />
          ) : (
            <View
              style={{
                width: size * 0.62,
                height: size * 0.62,
                borderRadius: size * 0.31,
                backgroundColor: "#FFE1EC",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <MaterialCommunityIcons name="face-woman" size={size * 0.62} color="#FF5C97" />
            </View>
          )}

          {busy ? (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255,255,255,0.6)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator color="#7C5CE8" />
            </View>
          ) : null}
        </Pressable>

        {/* camera badge */}
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Add or change photo"
          style={[
            {
              position: "absolute",
              right: -size * 0.02,
              bottom: size * 0.02,
              width: badge,
              height: badge,
              borderRadius: badge / 2,
              backgroundColor: "#7C5CE8",
              borderWidth: 2,
              borderColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#7C5CE8",
              shadowOpacity: 0.4,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
              elevation: 6,
            },
            web({ cursor: "pointer" }),
          ]}
        >
          <MaterialCommunityIcons name="camera" size={Math.round(badge * 0.55)} color="#FFFFFF" />
        </Pressable>
      </Animated.View>
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Info Row                                                           */
/* ------------------------------------------------------------------ */

type RowProps = {
  label: string;
  value: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconBg: string;
  bg: string;
  border: string;
  spark: string;
  appear: Animated.Value;
  unit: number;
  delay: number;
  onPress?: () => void;
};

const InfoRow: React.FC<RowProps> = ({
  label,
  value,
  icon,
  iconBg,
  bg,
  border,
  spark,
  appear,
  unit,
  delay,
  onPress,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const twinkle = useLoop(900, delay);
  const bounce = useLoop(2200, delay);

  const to = (v: number) => {
    Animated.spring(scale, { toValue: v, friction: 6, tension: 220, useNativeDriver: ND }).start();
  };

  const iconBox = Math.round(50 * unit);

  return (
    <Animated.View
      style={{
        opacity: appear,
        transform: [
          { translateX: appear.interpolate({ inputRange: [0, 1], outputRange: [-60, 0] }) },
          { scale },
        ],
        marginBottom: Math.round(12 * unit),
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => to(0.97)}
        onPressOut={() => to(1)}
        {...({
          onHoverIn: () => to(1.02),
          onHoverOut: () => to(1),
        } as any)}
        style={[
          styles.row,
          {
            backgroundColor: bg,
            borderColor: border,
            paddingVertical: Math.round(10 * unit),
            shadowColor: border,
          },
          web({ cursor: "pointer" }),
        ]}
      >
        <Animated.View
          style={[
            styles.rowIcon,
            {
              width: iconBox,
              height: iconBox,
              backgroundColor: iconBg,
              transform: [{ translateY: bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) }],
            },
          ]}
        >
          <View style={styles.rowIconGloss} />
          <MaterialCommunityIcons name={icon} size={Math.round(26 * unit)} color="#FFFFFF" />
        </Animated.View>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.rowLabel, { fontSize: Math.round(12 * unit) }]}>{label}</Text>

          <Text numberOfLines={1} style={[styles.rowValue, { fontSize: Math.round(18 * unit) }]}>
            {value || "Not set"}
          </Text>
        </View>

        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 8,
            right: 40,
            opacity: twinkle.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
            transform: [{ rotate: "-35deg" }],
          }}
        >
          <View style={{ width: 12, height: 3, borderRadius: 3, backgroundColor: spark }} />
          <View
            style={{
              width: 8,
              height: 3,
              borderRadius: 3,
              backgroundColor: spark,
              marginTop: 4,
              marginLeft: 5,
            }}
          />
        </Animated.View>

        <MaterialCommunityIcons name="chevron-right" size={Math.round(26 * unit)} color={NAVY} />
      </Pressable>
    </Animated.View>
  );
};

/* ------------------------------------------------------------------ */
/* Profile Screen                                                      */
/* ------------------------------------------------------------------ */

export default function ProfileScreen({
  onBack,
  onLogout,

  name: nameProp,
  dob: dobProp,
  gender: genderProp,
  mobile: mobileProp,

  onEditField,
}: Props) {
  const { width, height } = useWindowDimensions();

  /* -------------------------------------------------------------- */
  /* Data                                                            */
  /* -------------------------------------------------------------- */

  const [name, setName] = useState(nameProp ?? "");
  const [dob, setDob] = useState(dobProp ?? "");
  const [gender, setGender] = useState(genderProp ?? "");
  const [mobile, setMobile] = useState(mobileProp ?? "");

  /* -------------------------------------------------------------- */
  /* Load Profile                                                    */
  /* -------------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        // fetchPlayer() already returns a normalized PlayerProfile:
        // { id, name, dob, gender, phone, ... }
        const p: any = await fetchPlayer();

        if (!mounted) return;

        const apiName = pick(p, ["name", "playerName", "player_name", "nickname"]);

        const apiDob = pick(p, [
          "dob",
          "dateOfBirth",
          "date_of_birth",
          "birthday",
          "birthDate",
          "birth_date",
        ]);

        const apiGender = pick(p, ["gender", "sex"]);

        const apiMobile = pick(p, [
          "phone",
          "mobile",
          "mobileNumber",
          "mobile_number",
          "phoneNumber",
          "phone_number",
        ]);

        const apiPhoto = pick(p, [
          "photo",
          "photoUrl",
          "photo_url",
          "avatar",
          "avatarUrl",
          "avatar_url",
          "profileImage",
          "profile_image",
          "image",
        ]);

        // API value irundha always set pannu
        if (apiPhoto) setPhotoUri((cur) => cur || apiPhoto);
        if (apiName) setName(apiName);
        if (apiDob) setDob(apiDob);
        if (apiGender) setGender(apiGender);
        if (apiMobile) setMobile(apiMobile);
      } catch (err) {
        console.warn("Profile: failed to load player:", err);
      }
    };

    void loadProfile();

    return () => {
      mounted = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------------------------------------------- */
  /* Profile photo (camera / gallery)                                */
  /* -------------------------------------------------------------- */

  const [photoUri, setPhotoUri] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoErr, setPhotoErr] = useState("");

  const photoKey = `profile_photo:${name || "player"}`;

  // load the saved photo
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(photoKey)
      .then((v) => {
        if (alive && v) setPhotoUri(v);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [photoKey]);

  const savePhoto = async (uri: string) => {
    setPhotoUri(uri);
    try {
      await AsyncStorage.setItem(photoKey, uri);
    } catch (e) {
      console.warn("save photo locally failed:", e);
    }
    // optional: if profileApi has uploadProfilePhoto(uri), it is called too
    try {
      const up = (ProfileApi as any).uploadProfilePhoto;
      if (typeof up === "function") await up(uri);
    } catch (e) {
      console.warn("upload photo failed:", e);
    }
  };

  const handlePicked = async (res: ImagePicker.ImagePickerResult) => {
    if (res.canceled) return;
    const asset = res.assets?.[0];
    if (!asset) return;
    const uri = asset.base64
      ? `data:${asset.mimeType ?? "image/jpeg"};base64,${asset.base64}`
      : asset.uri;
    setPhotoBusy(true);
    await savePhoto(uri);
    setPhotoBusy(false);
  };

  const pickOptions = {
    mediaTypes: ["images"] as any,
    allowsEditing: true,
    aspect: [1, 1] as [number, number],
    quality: 0.5,
    base64: true,
  };

  const closeSheet = async () => {
    setSheetOpen(false);
    // small wait so the sheet is fully closed before the picker opens (iOS)
    await new Promise((r) => setTimeout(r, 250));
  };

  const pickFromGallery = async () => {
    await closeSheet();
    setPhotoErr("");
    try {
      if (Platform.OS !== "web") {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          setPhotoErr("Gallery permission venum. Settings-la allow pannunga.");
          return;
        }
      }
      const res = await ImagePicker.launchImageLibraryAsync(pickOptions);
      await handlePicked(res);
    } catch (e) {
      console.warn("gallery pick failed:", e);
      setPhotoErr("Photo edukka mudiyala. Thirumba try pannunga.");
    }
  };

  const takePhoto = async () => {
    await closeSheet();
    setPhotoErr("");
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        setPhotoErr("Camera permission venum. Settings-la allow pannunga.");
        return;
      }
      const res = await ImagePicker.launchCameraAsync(pickOptions);
      await handlePicked(res);
    } catch (e) {
      console.warn("camera failed:", e);
      setPhotoErr("Camera open aagala. Thirumba try pannunga.");
    }
  };

  const removePhoto = async () => {
    setSheetOpen(false);
    setPhotoErr("");
    setPhotoUri("");
    try {
      await AsyncStorage.removeItem(photoKey);
    } catch {}
  };

  /* -------------------------------------------------------------- */
  /* Prop Updates (ignore empty strings so API data isn't wiped)     */
  /* -------------------------------------------------------------- */

  useEffect(() => {
    if (nameProp) setName(nameProp);
  }, [nameProp]);

  useEffect(() => {
    if (dobProp) setDob(dobProp);
  }, [dobProp]);

  useEffect(() => {
    if (genderProp) setGender(genderProp);
  }, [genderProp]);

  useEffect(() => {
    if (mobileProp) setMobile(mobileProp);
  }, [mobileProp]);

  /* -------------------------------------------------------------- */
  /* Entrance Animation                                              */
  /* -------------------------------------------------------------- */

  const backIn = useRef(new Animated.Value(0)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const avatarIn = useRef(new Animated.Value(0)).current;
  const pillIn = useRef(new Animated.Value(0)).current;

  const rows = useMemo(() => Array.from({ length: 4 }, () => new Animated.Value(0)), []);

  const logoutIn = useRef(new Animated.Value(0)).current;
  const shine = useRef(new Animated.Value(0)).current;
  const titleShine = useRef(new Animated.Value(0)).current;
  const logoutScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(110, [
      Animated.timing(backIn, { toValue: 1, duration: 350, useNativeDriver: ND }),
      Animated.spring(titleIn, { toValue: 1, friction: 5, tension: 90, useNativeDriver: ND }),
      Animated.spring(avatarIn, { toValue: 1, friction: 5, tension: 80, useNativeDriver: ND }),
      Animated.spring(pillIn, { toValue: 1, friction: 6, tension: 90, useNativeDriver: ND }),
      ...rows.map((v) => Animated.spring(v, { toValue: 1, friction: 7, tension: 70, useNativeDriver: ND })),
      Animated.spring(logoutIn, { toValue: 1, friction: 6, tension: 80, useNativeDriver: ND }),
    ]).start();

    const l1 = Animated.loop(
      Animated.sequence([
        Animated.delay(2200),
        Animated.timing(shine, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: ND,
        }),
        Animated.timing(shine, { toValue: 0, duration: 0, useNativeDriver: ND }),
      ])
    );

    const l2 = Animated.loop(
      Animated.sequence([
        Animated.delay(1800),
        Animated.timing(titleShine, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: ND,
        }),
        Animated.timing(titleShine, { toValue: 0, duration: 0, useNativeDriver: ND }),
      ])
    );

    l1.start();
    l2.start();

    return () => {
      l1.stop();
      l2.stop();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------------------------------------------- */
  /* Responsive (CHANGED: smaller, capped sizes so it never looks    */
  /* zoomed in on phones, tablets or wide web windows)               */
  /* -------------------------------------------------------------- */

  // content column: never wider than 400px
  const colW = Math.min(width - 32, 400);

  // everything scales from a 360px-wide phone; max 1 so big screens don't zoom in
  const unit = Math.min(Math.max(colW / 360, 0.78), 1);

  // decoration scale
  const deco = Math.min(Math.max(width / 390, 0.7), 1);

  const avatarSize = Math.round(Math.min(Math.max(colW * 0.28, 84), 112));

  const statusPad = Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  // decorations stay inside a phone-sized stage in the middle of the screen
  const stageW = Math.min(width, 480);
  const stageLeft = (width - stageW) / 2;

  const popIn = (v: Animated.Value) => ({
    opacity: v,
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
  });

  const dropIn = (v: Animated.Value) => ({
    opacity: v,
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }],
  });

  /* -------------------------------------------------------------- */
  /* Rows                                                            */
  /* -------------------------------------------------------------- */

  const rowDefs: {
    field: ProfileField;
    label: string;
    value: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    iconBg: string;
    bg: string;
    border: string;
    spark: string;
  }[] = [
    {
      field: "name",
      label: "Name",
      value: name,
      icon: "account",
      iconBg: "#FFB61E",
      bg: "#FFF8E3",
      border: "#FFE08A",
      spark: "#FFC21A",
    },
    {
      field: "dob",
      label: "Date of Birth",
      value: formatDob(dob),
      icon: "calendar-month",
      iconBg: "#8B6CF0",
      bg: "#F3EFFF",
      border: "#D4C8F7",
      spark: "#B9A6F5",
    },
    {
      field: "gender",
      label: "Gender",
      value: formatGender(gender),
      icon: "gender-male-female",
      iconBg: "#F5558F",
      bg: "#FFEEF4",
      border: "#FFC2D6",
      spark: "#F9A8C9",
    },
    {
      field: "mobile",
      label: "Mobile Number",
      value: formatMobile(mobile),
      icon: "phone",
      iconBg: "#25C28F",
      bg: "#E9F9FB",
      border: "#A8E6EC",
      spark: "#5BD6E0",
    },
  ];

  const currentOf = (f: ProfileField) =>
    f === "name" ? name : f === "dob" ? dob : f === "gender" ? gender : mobile;

  /* -------------------------------------------------------------- */
  /* UI                                                              */
  /* -------------------------------------------------------------- */

  const orbA = Math.min(Math.max(width * 0.5, 220), 320);
  const orbB = Math.min(Math.max(width * 0.28, 120), 180);
  const orbC = Math.min(Math.max(width * 0.18, 70), 110);
  const orbD = Math.min(Math.max(width * 1.0, 500), 800);
  const orbE = Math.min(Math.max(width * 0.8, 400), 700);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={CREAM} />

      {/* Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Orb size={orbA} color="#FFE9A6" top={-orbA * 0.5} left={-orbA * 0.42} dx={14} dy={10} duration={7000} />
        <Orb size={orbA} color="#D6EBFB" top={-orbA * 0.4} left={width - orbA * 0.62} dx={-12} dy={10} duration={8000} />
        <Orb size={orbB} color="#C8E3FA" top={height * 0.1} left={width - orbB * 0.55} dx={-8} dy={8} duration={6000} />
        <Orb size={orbC} color="#D8EEFB" top={height * 0.43} left={-orbC * 0.6} dx={6} dy={8} duration={5500} />
        <Orb size={orbD} color="#BFE9A0" top={height - 50} left={-orbD * 0.3} dx={10} dy={-6} duration={7000} />
        <Orb size={orbE} color="#A9D8FF" top={height - 40} left={width * 0.4} dx={-10} dy={-6} duration={6200} />
      </View>

      {/* Decorations (smaller + kept in the screen margins) */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 0, bottom: 0, left: stageLeft, width: stageW }}
      >
        <FloatItem style={{ left: stageW * 0.03, top: height * 0.13 }} rotate={-10} duration={2600}>
          <MaterialCommunityIcons name="star" size={Math.round(34 * deco)} color="#FFC21A" />
        </FloatItem>

        <FloatItem style={{ left: stageW * 0.01, top: height * 0.24 }} rotate={-12} duration={3100} delay={500}>
          <MaterialCommunityIcons name="puzzle" size={Math.round(46 * deco)} color="#2DD4A8" />
        </FloatItem>

        <FloatItem style={{ right: stageW * 0.03, top: height * 0.03 }} rotate={14} duration={2800} delay={200}>
          <MaterialCommunityIcons name="gamepad-variant" size={Math.round(40 * deco)} color="#7C5CE8" />
        </FloatItem>

        <FloatItem style={{ right: stageW * 0.2, top: height * 0.15 }} duration={2300} delay={700} amp={4}>
          <MaterialCommunityIcons name="heart" size={Math.round(18 * deco)} color="#F9A8C9" />
        </FloatItem>

        <FloatItem style={{ right: stageW * 0.02, top: height * 0.2 }} rotate={10} duration={2700} delay={900}>
          <MaterialCommunityIcons name="lightbulb-on" size={Math.round(42 * deco)} color={YELLOW} />
        </FloatItem>

        <Twinkle left={stageW * 0.2} top={height * 0.1} size={11} color={YELLOW} />
        <Twinkle right={stageW * 0.1} top={height * 0.33} size={10} color="#38BDF8" delay={300} />
        <Twinkle left={stageW * 0.06} top={height * 0.4} size={9} color="#F472B6" delay={600} />
        <Twinkle right={stageW * 0.05} top={height * 0.58} size={9} color={YELLOW} delay={900} />

        {/* ABC Blocks */}
        <FloatItem style={{ left: stageW * 0.01, bottom: height * 0.02 }} rotate={-6} duration={2600} amp={4}>
          <View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ marginLeft: 6 }}>
                <Block size={Math.round(26 * deco)} color="#8B5CF6" letter="A" />
              </View>
            </View>

            <View style={{ flexDirection: "row", marginTop: 3 }}>
              <Block size={Math.round(26 * deco)} color="#F472B6" letter="B" />
              <View style={{ width: 3 }} />
              <Block size={Math.round(26 * deco)} color="#38BDF8" letter="C" />
            </View>
          </View>
        </FloatItem>

        <FloatItem style={{ right: stageW * 0.02, bottom: height * 0.02 }} rotate={14} duration={3000} amp={4}>
          <MaterialCommunityIcons name="puzzle" size={Math.round(46 * deco)} color="#2DD4A8" />
        </FloatItem>
      </View>

      {/* Back */}
      <Animated.View style={[styles.backWrap, { top: 10 + statusPad, left: 14, opacity: backIn }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onBack} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={NAVY} />
        </Pressable>
      </Animated.View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: 12 + statusPad,
          paddingBottom: 50,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: colW, alignItems: "center" }}>
          {/* Title */}
          <Animated.View style={[{ alignItems: "center", marginTop: 4 }, dropIn(titleIn)]}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View
                pointerEvents="none"
                style={{ position: "absolute", width: colW * 0.9, height: 60 }}
              >
                <View style={{ position: "absolute", left: -2, top: 6 }}>
                  <Rays count={3} radius={24} size={11} spread={[-150, -60]} />
                </View>

                <View style={{ position: "absolute", right: 4, top: 6 }}>
                  <Rays count={3} radius={24} size={11} spread={[60, 150]} delay={300} />
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Text
                  style={[
                    styles.titleMy,
                    { fontSize: Math.round(32 * unit), lineHeight: Math.round(38 * unit) },
                  ]}
                >
                  My{" "}
                </Text>

                <Text
                  style={[
                    styles.titleProfile,
                    { fontSize: Math.round(35 * unit), lineHeight: Math.round(41 * unit) },
                  ]}
                >
                  Profile
                </Text>
              </View>

              <Animated.View
                pointerEvents="none"
                style={[
                  styles.titleShine,
                  {
                    transform: [
                      {
                        translateX: titleShine.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-colW * 0.4, colW * 0.4],
                        }),
                      },
                      { skewX: "-20deg" },
                    ],
                  },
                ]}
              />
            </View>

            <Text style={[styles.tagline, { fontSize: Math.round(13 * unit) }]}>Your details, your journey!</Text>
          </Animated.View>

          {/* Avatar */}
          <Animated.View style={[{ alignItems: "center", marginTop: 2 }, popIn(avatarIn)]}>
            <Avatar
              size={avatarSize}
              photoUri={photoUri}
              busy={photoBusy}
              onPress={() => setSheetOpen(true)}
            />
          </Animated.View>

          {/* Name Pill */}
          <Animated.View style={[{ marginTop: -Math.round(avatarSize * 0.18) }, popIn(pillIn)]}>
            <View style={[styles.namePill, { paddingHorizontal: Math.round(30 * unit) }]}>
              <Text numberOfLines={1} style={[styles.namePillText, { fontSize: Math.round(24 * unit) }]}>
                {name || "Player"}
              </Text>
            </View>
          </Animated.View>

          {photoErr ? <Text style={styles.photoErr}>{photoErr}</Text> : null}

          {/* Information Rows */}
          <View style={{ width: "100%", marginTop: Math.round(18 * unit) }}>
            {rowDefs.map((r, i) => (
              <InfoRow
                key={r.field}
                label={r.label}
                value={r.value}
                icon={r.icon}
                iconBg={r.iconBg}
                bg={r.bg}
                border={r.border}
                spark={r.spark}
                appear={rows[i]}
                unit={unit}
                delay={i * 250}
                onPress={onEditField ? () => onEditField(r.field, currentOf(r.field)) : undefined}
              />
            ))}
          </View>

          {/* Logout */}
          <Animated.View
            style={[{ marginTop: Math.round(6 * unit), alignItems: "center", width: "100%" }, popIn(logoutIn)]}
          >
            <View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
              <View pointerEvents="none" style={{ position: "absolute", left: 6 }}>
                <Rays count={3} radius={28} size={10} spread={[-160, -70]} />
              </View>

              <View pointerEvents="none" style={{ position: "absolute", right: 6 }}>
                <Rays count={3} radius={28} size={10} spread={[70, 160]} delay={300} />
              </View>

              <Animated.View style={{ transform: [{ scale: logoutScale }], width: "60%" }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Logout"
                  onPress={() => {
                    void onLogout();
                  }}
                  onPressIn={() =>
                    Animated.spring(logoutScale, {
                      toValue: 0.95,
                      friction: 6,
                      tension: 220,
                      useNativeDriver: ND,
                    }).start()
                  }
                  onPressOut={() =>
                    Animated.spring(logoutScale, {
                      toValue: 1,
                      friction: 4,
                      tension: 160,
                      useNativeDriver: ND,
                    }).start()
                  }
                  {...({
                    onHoverIn: () =>
                      Animated.spring(logoutScale, { toValue: 1.03, useNativeDriver: ND }).start(),
                    onHoverOut: () =>
                      Animated.spring(logoutScale, { toValue: 1, useNativeDriver: ND }).start(),
                  } as any)}
                  style={[styles.logoutBtn, { height: Math.round(50 * unit) }, web({ cursor: "pointer" })]}
                >
                  <View style={styles.logoutGloss} />

                  <MaterialCommunityIcons name="logout-variant" size={Math.round(24 * unit)} color="#FFFFFF" />

                  <Text style={[styles.logoutText, { fontSize: Math.round(19 * unit) }]}>Logout</Text>

                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.shineBand,
                      {
                        transform: [
                          {
                            translateX: shine.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-80, colW * 0.6 + 80],
                            }),
                          },
                          { skewX: "-20deg" },
                        ],
                      },
                    ]}
                  />
                </Pressable>
              </Animated.View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Photo options sheet */}
      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setSheetOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Profile Photo</Text>

            {Platform.OS !== "web" && (
              <Pressable style={styles.sheetBtn} onPress={takePhoto}>
                <View style={[styles.sheetIcon, { backgroundColor: "#7C5CE8" }]}>
                  <MaterialCommunityIcons name="camera" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.sheetBtnText}>Take Photo</Text>
              </Pressable>
            )}

            <Pressable style={styles.sheetBtn} onPress={pickFromGallery}>
              <View style={[styles.sheetIcon, { backgroundColor: "#25C28F" }]}>
                <MaterialCommunityIcons name="image-multiple" size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.sheetBtnText}>Choose from Gallery</Text>
            </Pressable>

            {photoUri ? (
              <Pressable style={styles.sheetBtn} onPress={removePhoto}>
                <View style={[styles.sheetIcon, { backgroundColor: "#F5555D" }]}>
                  <MaterialCommunityIcons name="trash-can-outline" size={22} color="#FFFFFF" />
                </View>
                <Text style={[styles.sheetBtnText, { color: "#D93C45" }]}>Remove Photo</Text>
              </Pressable>
            ) : null}

            <Pressable style={styles.sheetCancel} onPress={() => setSheetOpen(false)}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */

const FONT_DISPLAY =
  Platform.OS === "web"
    ? ({
        fontFamily: '"Baloo 2","Fredoka","Trebuchet MS","Segoe UI",system-ui,sans-serif',
      } as any)
    : null;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CREAM,
    overflow: "hidden",
  },

  backWrap: {
    position: "absolute",
    zIndex: 20,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F7ECEE",
    shadowColor: "#F472B6",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  titleMy: {
    fontWeight: "900",
    color: "#2B3AA0",
    fontStyle: "italic",
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
    ...FONT_DISPLAY,
  },

  titleProfile: {
    fontWeight: "900",
    color: YELLOW,
    fontStyle: "italic",
    textShadowColor: "#E07A00",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 0,
    ...FONT_DISPLAY,
  },

  titleShine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 30,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  tagline: {
    color: NAVY,
    fontStyle: "italic",
    fontWeight: "600",
    marginTop: 2,
    transform: [{ rotate: "-3deg" }],
    ...Platform.select({
      ios: { fontFamily: "Noteworthy" },
      android: { fontFamily: "cursive" },
      web: {
        fontFamily: '"Segoe Print","Comic Sans MS",cursive',
      } as any,
      default: {},
    }),
  },

  namePill: {
    alignSelf: "center",
    paddingVertical: 6,
    borderRadius: 30,
    backgroundColor: "#FFF7E0",
    borderWidth: 2,
    borderColor: "#FFEBB0",
    borderBottomWidth: 4,
    borderBottomColor: "#FFE08A",
    shadowColor: "#F5B400",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  namePillText: {
    fontWeight: "900",
    color: NAVY,
    textAlign: "center",
    ...FONT_DISPLAY,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 2,
    paddingHorizontal: 12,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  rowIcon: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderBottomColor: "rgba(0,0,0,0.14)",
    overflow: "hidden",
  },

  rowIconGloss: {
    position: "absolute",
    top: 3,
    left: 6,
    width: 20,
    height: 7,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  rowLabel: {
    color: "#5B6AA6",
    fontWeight: "700",
  },

  rowValue: {
    color: NAVY,
    fontWeight: "900",
    marginTop: 1,
    ...FONT_DISPLAY,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 999,
    backgroundColor: "#F5555D",
    borderWidth: 2,
    borderColor: "#FF7A80",
    borderBottomWidth: 5,
    borderBottomColor: "#D93C45",
    overflow: "hidden",
    shadowColor: "#F5555D",
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  logoutGloss: {
    position: "absolute",
    top: 5,
    left: 24,
    width: 54,
    height: 9,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "900",
    ...FONT_DISPLAY,
  },

  photoErr: {
    marginTop: 8,
    color: "#D93C45",
    fontWeight: "700",
    fontSize: 12,
    textAlign: "center",
  },

  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(20,27,52,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sheet: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 26,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E4E0EA",
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: NAVY,
    textAlign: "center",
    marginBottom: 14,
    ...FONT_DISPLAY,
  },
  sheetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "#F8F5FF",
    marginBottom: 10,
  },
  sheetIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: NAVY,
  },
  sheetCancel: {
    marginTop: 4,
    paddingVertical: 13,
    borderRadius: 18,
    backgroundColor: "#F1EEF0",
    alignItems: "center",
  },
  sheetCancelText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#5B6AA6",
  },

  shineBand: {
    position: "absolute",
    top: -10,
    bottom: -10,
    width: 36,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
});
