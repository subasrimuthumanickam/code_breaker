
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, ViewStyle } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');



type BlobConfig = {
  size: number;
  top: number;
  left: number;
  color: string;
  duration: number;
  floatDistance: number;
};

type GhostLetterConfig = {
  letter: string;
  top: number;
  left: number;
  size: number;
  rotate: string;
};

type SparkleConfig = {
  top: number;
  left: number;
  size: number;
  delay: number;
};

const BLOBS: BlobConfig[] = [
  { size: 220, top: -60, left: -50, color: '#D6CCF7', duration: 6000, floatDistance: 14 },
  { size: 180, top: 40, left: SCREEN_W - 140, color: '#FFD6C2', duration: 7000, floatDistance: 18 },
  { size: 150, top: SCREEN_H * 0.42, left: -60, color: '#C9EBD7', duration: 5500, floatDistance: 12 },
  { size: 200, top: SCREEN_H * 0.62, left: SCREEN_W - 150, color: '#FFE1A8', duration: 6500, floatDistance: 16 },
  { size: 130, top: SCREEN_H * 0.15, left: SCREEN_W * 0.35, color: '#FBD1DC', duration: 5000, floatDistance: 10 },
];

const GHOST_LETTERS: GhostLetterConfig[] = [
  { letter: 'W', top: SCREEN_H * 0.1, left: SCREEN_W * 0.08, size: 46, rotate: '-8deg' },
  { letter: 'O', top: SCREEN_H * 0.2, left: SCREEN_W * 0.78, size: 40, rotate: '10deg' },
  { letter: 'R', top: SCREEN_H * 0.5, left: SCREEN_W * 0.85, size: 44, rotate: '-6deg' },
  { letter: 'D', top: SCREEN_H * 0.72, left: SCREEN_W * 0.1, size: 42, rotate: '7deg' },
];

const SPARKLES: SparkleConfig[] = [
  { top: SCREEN_H * 0.12, left: SCREEN_W * 0.5, size: 14, delay: 0 },
  { top: SCREEN_H * 0.3, left: SCREEN_W * 0.2, size: 10, delay: 400 },
  { top: SCREEN_H * 0.35, left: SCREEN_W * 0.7, size: 12, delay: 800 },
  { top: SCREEN_H * 0.58, left: SCREEN_W * 0.4, size: 9, delay: 1200 },
  { top: SCREEN_H * 0.68, left: SCREEN_W * 0.65, size: 13, delay: 1600 },
  { top: SCREEN_H * 0.85, left: SCREEN_W * 0.25, size: 11, delay: 2000 },
];

function FloatingBlob({ config }: { config: BlobConfig }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: config.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, config.duration]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.floatDistance],
  });
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.floatDistance * 0.5],
  });

  return (
    <Animated.View
      style={[
        styles.blob,
        {
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          top: config.top,
          left: config.left,
          backgroundColor: config.color,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    />
  );
}

function TwinkleSparkle({ config }: { config: SparkleConfig }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 700,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(1200),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, config.delay]);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.9] });
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.15] });

  return (
    <Animated.Text
      style={[
        styles.sparkle,
        {
          top: config.top,
          left: config.left,
          fontSize: config.size,
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      ✦
    </Animated.Text>
  );
}

function GhostLetter({ config }: { config: GhostLetterConfig }) {
  return (
    <Text
      style={[
        styles.ghostLetter,
        {
          top: config.top,
          left: config.left,
          fontSize: config.size,
          transform: [{ rotate: config.rotate }],
        },
      ]}
    >
      {config.letter}
    </Text>
  );
}

type Props = {
  backgroundColor?: string;
  style?: ViewStyle;
  showGhostLetters?: boolean;
  showSparkles?: boolean;
};

export default function WordScrambleAnimatedBackground({
  backgroundColor = '#FFF6EC',
  style,
  showGhostLetters = true,
  showSparkles = true,
}: Props) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor }, style]}>
      {BLOBS.map((b, i) => (
        <FloatingBlob key={`blob-${i}`} config={b} />
      ))}
      {showGhostLetters &&
        GHOST_LETTERS.map((g, i) => <GhostLetter key={`ghost-${i}`} config={g} />)}
      {showSparkles &&
        SPARKLES.map((s, i) => <TwinkleSparkle key={`sparkle-${i}`} config={s} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    opacity: 0.85,
  },
  ghostLetter: {
    position: 'absolute',
    fontWeight: '900',
    color: '#2B2140',
    opacity: 0.06,
  },
  sparkle: {
    position: 'absolute',
    color: '#FFFFFF',
    textShadowColor: 'rgba(120, 90, 200, 0.35)',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 0 },
  },
});
