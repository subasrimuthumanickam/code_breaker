
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { getTheme } from "../theme/theme";
import { PopIn, FadeInUp, PressableScale, Pulse, useShake } from "../components/motion";

interface WrongGuessScreenProps {
  onTryAgain: () => void;
  attemptsLeft: number;
  darkMode: boolean;
}

const WrongGuessScreen: React.FC<WrongGuessScreenProps> = ({
  onTryAgain,
  attemptsLeft,
  darkMode,
}) => {
  const theme = getTheme(darkMode);
  const { x, shake } = useShake();

  // shake the ✕ icon right after it pops in
  useEffect(() => {
    const t = setTimeout(shake, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#111827" : "#F3F4F6" }]}>
      {/* Result Icon */}
      <PopIn>
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: darkMode ? "#3A2025" : "#FCE4E4" },
            { transform: [{ translateX: x }] },
          ]}
        >
          <Text style={styles.icon}>✕</Text>
        </Animated.View>
      </PopIn>

      {/* Title */}
      <FadeInUp delay={150}>
        <Text style={[styles.title, { color: theme.text }]}>NOT CORRECT</Text>
      </FadeInUp>

      <FadeInUp delay={250}>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          That's not the secret code.
        </Text>
      </FadeInUp>

      {/* Attempts */}
      <FadeInUp delay={350} style={styles.attemptWrap}>
        <View style={[styles.attemptCard, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.attemptLabel, { color: theme.subtext }]}>ATTEMPTS LEFT</Text>

          <View style={styles.heartsRow}>
            {Array.from({ length: attemptsLeft }).map((_, i) => (
              <PopIn key={i} delay={600 + i * 150}>
                <Text style={styles.heart}>❤️</Text>
              </PopIn>
            ))}
          </View>

          <Text style={[styles.attemptNumber, { color: theme.subtext }]}>
            {attemptsLeft} {attemptsLeft === 1 ? "attempt" : "attempts"} remaining
          </Text>
        </View>
      </FadeInUp>

      {/* Message */}
      <FadeInUp delay={500}>
        <Text style={[styles.message, { color: theme.subtext }]}>
          Use the clues and try another combination.
        </Text>
      </FadeInUp>

      {/* Try Again */}
      <FadeInUp delay={650} style={styles.buttonWrap}>
        <Pulse to={1.03}>
          <PressableScale onPress={onTryAgain} style={styles.button}>
            <Text style={styles.buttonText}>TRY AGAIN</Text>
          </PressableScale>
        </Pulse>
      </FadeInUp>

      {/* Hint */}
      <FadeInUp delay={800}>
        <Text style={[styles.footer, { color: theme.subtext }]}>
          Think carefully • Check the clues
        </Text>
      </FadeInUp>
    </View>
  );
};

export default WrongGuessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  icon: {
    color: "#F87171",
    fontSize: 48,
    fontWeight: "bold",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
  attemptWrap: {
    width: "100%",
    maxWidth: 400,
    marginTop: 30,
  },
  attemptCard: {
    width: "100%",
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: 22,
  },
  attemptLabel: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  heartsRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 10,
    minHeight: 30,
  },
  heart: {
    fontSize: 22,
  },
  attemptNumber: {
    fontSize: 13,
    marginTop: 8,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    maxWidth: 350,
    lineHeight: 22,
    marginTop: 25,
  },
  buttonWrap: {
    width: "100%",
    maxWidth: 330,
    marginTop: 30,
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#6C5CE7",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  footer: {
    fontSize: 12,
    marginTop: 25,
    textAlign: "center",
  },
});
