// import React, { useEffect, useRef } from 'react';
// import { Animated, Easing, StyleSheet, View } from 'react-native';

// const PARTICLES = 8;

// // Hint use pannumbodhu tile mela minnal + sparkle burst
// export default function SparkleBurst({ size = 46, onDone }: { size?: number; onDone?: () => void }) {
//   const t = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.timing(t, { toValue: 1, duration: 750, easing: Easing.out(Easing.quad), useNativeDriver: true })
//       .start(() => onDone?.());
//   }, []);

//   return (
//     <View pointerEvents="none" style={[StyleSheet.absoluteFill, s.center]}>
//       {/* glow flash */}
//       <Animated.View
//         style={{
//           position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: '#FFF3B0',
//           opacity: t.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0.95, 0.6, 0] }),
//           transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.4, 2.3] }) }],
//         }}
//       />
//       {/* minnal bolt */}
//       <Animated.Text
//         style={{
//           position: 'absolute', fontSize: size * 0.8,
//           opacity: t.interpolate({ inputRange: [0, 0.15, 0.5, 1], outputRange: [0, 1, 0.8, 0] }),
//           transform: [{ scale: t.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.3, 1.3, 0.9] }) }],
//         }}
//       >
//         ⚡
//       </Animated.Text>
//       {/* flying sparkles */}
//       {Array.from({ length: PARTICLES }).map((_, i) => {
//         const a = (i / PARTICLES) * Math.PI * 2;
//         const d = size * 1.15;
//         return (
//           <Animated.Text
//             key={i}
//             style={{
//               position: 'absolute', fontSize: i % 2 ? 14 : 20, color: i % 2 ? '#FFC83D' : '#ffffff',
//               textShadowColor: '#F2A900', textShadowRadius: 6,
//               opacity: t.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
//               transform: [
//                 { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(a) * d] }) },
//                 { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(a) * d] }) },
//                 { scale: t.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.2, 1.2, 0.4] }) },
//                 { rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) },
//               ],
//             }}
//           >
//             ✦
//           </Animated.Text>
//         );
//       })}
//     </View>
//   );
// }

// // Letter tile ulla varumbodhu "pop" animation
// export function PopIn({ children }: { children: React.ReactNode }) {
//   const v = useRef(new Animated.Value(0.2)).current;
//   useEffect(() => {
//     Animated.spring(v, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }).start();
//   }, []);
//   return <Animated.View style={{ transform: [{ scale: v }] }}>{children}</Animated.View>;
// }

// const s = StyleSheet.create({ center: { alignItems: 'center', justifyContent: 'center', overflow: 'visible' } });
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from "react-native";

const PARTICLES = 8;

interface SparkleBurstProps {
  size?: number;
  onDone?: () => void;
}

export default function SparkleBurst({
  size = 46,
  onDone,
}: SparkleBurstProps) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(t, {
      toValue: 1,

      duration: 750,

      easing: Easing.out(Easing.quad),

      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished) {
        onDone?.();
      }
    });

    return () => {
      animation.stop();
    };
  }, [onDone, t]);

  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        s.center,
      ]}
    >
      {/* Glow flash */}
      <Animated.View
        style={{
          position: "absolute",

          width: size,
          height: size,

          borderRadius: size / 2,

          backgroundColor: "#FFF3B0",

          opacity: t.interpolate({
            inputRange: [0, 0.25, 1],
            outputRange: [0.95, 0.6, 0],
          }),

          transform: [
            {
              scale: t.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 2.3],
              }),
            },
          ],
        }}
      />

      {/* Lightning */}
      <Animated.Text
        style={{
          position: "absolute",

          fontSize: size * 0.8,

          opacity: t.interpolate({
            inputRange: [0, 0.15, 0.5, 1],
            outputRange: [0, 1, 0.8, 0],
          }),

          transform: [
            {
              scale: t.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [0.3, 1.3, 0.9],
              }),
            },
          ],
        }}
      >
        ⚡
      </Animated.Text>

      {/* Flying sparkles */}
      {Array.from({ length: PARTICLES }).map((_, i) => {
        const angle =
          (i / PARTICLES) * Math.PI * 2;

        const distance = size * 1.15;

        return (
          <Animated.Text
            key={i}
            style={{
              position: "absolute",

              fontSize: i % 2 ? 14 : 20,

              color:
                i % 2
                  ? "#FFC83D"
                  : "#FFFFFF",

              textShadowColor: "#F2A900",

              textShadowRadius: 6,

              opacity: t.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [1, 1, 0],
              }),

              transform: [
                {
                  translateX: t.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      0,
                      Math.cos(angle) * distance,
                    ],
                  }),
                },

                {
                  translateY: t.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      0,
                      Math.sin(angle) * distance,
                    ],
                  }),
                },

                {
                  scale: t.interpolate({
                    inputRange: [0, 0.3, 1],
                    outputRange: [0.2, 1.2, 0.4],
                  }),
                },

                {
                  rotate: t.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      "0deg",
                      "180deg",
                    ],
                  }),
                },
              ],
            }}
          >
            ✦
          </Animated.Text>
        );
      })}
    </View>
  );
}

interface PopInProps {
  children: React.ReactNode;
}

export function PopIn({
  children,
}: PopInProps) {
  const v = useRef(
    new Animated.Value(0.2)
  ).current;

  useEffect(() => {
    Animated.spring(v, {
      toValue: 1,

      friction: 4,

      tension: 160,

      useNativeDriver: true,
    }).start();
  }, [v]);

  return (
    <Animated.View
      style={{
        transform: [
          {
            scale: v,
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

const s = StyleSheet.create({
  center: {
    alignItems: "center",

    justifyContent: "center",

    overflow: "visible",
  },
});