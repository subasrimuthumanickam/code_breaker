import React, { useEffect, useRef } from "react";
import { Modal, View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AnimatedAlertProps {
  visible: boolean;
  variant: "found" | "cracked";
  title: string;
  subtitle?: string;
  onHide: () => void;
  autoHideMs?: number;
}

const AnimatedAlert: React.FC<AnimatedAlertProps> = ({
  visible,
  variant,
  title,
  subtitle,
  onHide,
  autoHideMs = 1400,
}) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    scale.setValue(0);
    opacity.setValue(0);
    spin.setValue(0);

    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1200, useNativeDriver: true })),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(onHide);
    }, autoHideMs);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const isCracked = variant === "cracked";

  return (
    <Modal transparent animationType="none" visible={visible}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, isCracked && styles.cardBig, { transform: [{ scale }], opacity }]}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons
              name={isCracked ? "trophy" : "sparkles"}
              size={isCracked ? 52 : 36}
              color={isCracked ? "#F5C518" : "#22C55E"}
            />
          </Animated.View>
          <Text style={[styles.title, isCracked && styles.titleBig]}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#1E1B2E",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: "center",
    gap: 8,
    minWidth: 220,
  },
  cardBig: { paddingVertical: 32, paddingHorizontal: 40, minWidth: 260, borderWidth: 2, borderColor: "#F5C518" },
  title: { color: "#FFFFFF", fontSize: 16, fontWeight: "800", textAlign: "center", marginTop: 8 },
  titleBig: { fontSize: 20 },
  subtitle: { color: "#B5B0C7", fontSize: 13, textAlign: "center" },
});

export default AnimatedAlert;