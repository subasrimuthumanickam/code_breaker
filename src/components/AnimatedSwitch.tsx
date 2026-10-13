import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleProp, ViewStyle } from "react-native";

interface Props {
  value: boolean;
  onValueChange: (next: boolean) => void;
  onColor?: string;
  offColor?: string;
  style?: StyleProp<ViewStyle>;
}

const W = 52;
const H = 30;
const PAD = 3;
const THUMB = H - PAD * 2;

/* Drop-in replacement for <Switch>: thumb springs across, track colour
   fades, thumb stretches while pressed. */
const AnimatedSwitch: React.FC<Props> = ({
  value,
  onValueChange,
  onColor = "#7C3AED",
  offColor = "rgba(139,92,246,0.25)",
  style,
}) => {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current; // 0 = off, 1 = on
  const press = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: value ? 1 : 0,
      friction: 6,
      tension: 140,
      useNativeDriver: false, // colour interpolation needs the JS driver
    }).start();
  }, [value]);

  const pressTo = (v: number) =>
    Animated.timing(press, {
      toValue: v,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

  const trackColor = progress.interpolate({ inputRange: [0, 1], outputRange: [offColor, onColor] });
  const thumbWidth = press.interpolate({ inputRange: [0, 1], outputRange: [THUMB, THUMB + 6] });
  const left = Animated.add(
    progress.interpolate({ inputRange: [0, 1], outputRange: [PAD, W - PAD - THUMB] }),
    press.interpolate({ inputRange: [0, 1], outputRange: [0, 0] })
  );
  // when pressed while ON, keep the stretched thumb inside the track
  const shift = Animated.multiply(progress, press.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      onPressIn={() => pressTo(1)}
      onPressOut={() => pressTo(0)}
      hitSlop={8}
      style={style}
    >
      <Animated.View style={{ width: W, height: H, borderRadius: H / 2, backgroundColor: trackColor }}>
        <Animated.View
          style={{
            position: "absolute",
            top: PAD,
            left: Animated.add(left, shift),
            width: thumbWidth,
            height: THUMB,
            borderRadius: THUMB / 2,
            backgroundColor: "#FFFFFF",
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
            elevation: 3,
          }}
        />
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedSwitch;
