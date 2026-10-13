import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";

type BoxProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
};

/* Fade + slide up (use `delay` to stagger) */
export const FadeInUp = ({
  children,
  style,
  delay = 0,
  distance = 24,
  duration = 450,
}: BoxProps & { distance?: number; duration?: number }) => {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: v,
          transform: [
            { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

/* Spring pop (tiles, stars, icons) */
export const PopIn = ({ children, style, delay = 0 }: BoxProps) => {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(v, {
      toValue: 1,
      delay,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: v.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 1] }),
          transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

/* Floating loop (lock, number tiles) */
export const Float = ({ children, style, delay = 0, y = 8 }: BoxProps & { y?: number }) => {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: 1,
          duration: 1800,
          delay,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Animated.View
      style={[
        style,
        { transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -y] }) }] },
      ]}
    >
      {children}
    </Animated.View>
  );
};

/* Breathing pulse (Play button, next level) */
export const Pulse = ({ children, style, to = 1.05 }: BoxProps & { to?: number }) => {
  const v = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: to,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Animated.View style={[style, { transform: [{ scale: v }] }]}>{children}</Animated.View>;
};

/* Scales down on press, springs back on release.
   `containerStyle` goes on the Pressable (layout: flex, alignSelf...),
   `style` goes on the animated visual box. */
export const PressableScale = ({
  children,
  style,
  containerStyle,
  scaleTo = 0.93,
  ...rest
}: Omit<PressableProps, "style" | "children"> & {
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  scaleTo?: number;
  children: React.ReactNode;
}) => {
  const s = useRef(new Animated.Value(1)).current;
  const to = (val: number) =>
    Animated.spring(s, { toValue: val, friction: 5, tension: 200, useNativeDriver: true }).start();
  return (
    <Pressable
      {...rest}
      style={containerStyle}
      onPressIn={(e) => {
        to(scaleTo);
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        to(1);
        rest.onPressOut?.(e);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale: s }] }]}>{children}</Animated.View>
    </Pressable>
  );
};

/* Shake (error / locked) */
export const useShake = () => {
  const x = useRef(new Animated.Value(0)).current;
  const shake = () =>
    Animated.sequence(
      [10, -10, 8, -8, 4, 0].map((t) =>
        Animated.timing(x, { toValue: t, duration: 55, useNativeDriver: true })
      )
    ).start();
  return { x, shake };
};
