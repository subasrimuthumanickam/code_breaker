import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  children: React.ReactNode;
  /** Optional label shown in the error UI, e.g. "Word Scramble" */
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary
 * -------------
 * Wrap this around your navigator (or any screen) so that an
 * unexpected render crash shows a friendly "Something went wrong"
 * screen with a Retry button, INSTEAD of a blank white screen.
 *
 * Usage in App.tsx:
 *   <ErrorBoundary>
 *     <NavigationContainer ...>
 *       ...
 *     </NavigationContainer>
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // This is the log to check in your terminal / browser console
    // whenever you see the blank screen — it tells you EXACTLY which
    // component crashed and why.
    console.error("[ErrorBoundary] Caught a render crash:", error, info?.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.icon}>!</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.props.label ? `${this.props.label} ` : ""}
            hit an unexpected error. You can try again below.
          </Text>
          {__DEV__ && this.state.error ? (
            <Text style={styles.devError} numberOfLines={4}>
              {String(this.state.error.message || this.state.error)}
            </Text>
          ) : null}
          <Pressable style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F2",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFE4E6",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 36,
    fontWeight: "900",
    color: "#E11D48",
    overflow: "hidden",
  },
  title: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "900",
    color: "#17213A",
    textAlign: "center",
  },
  message: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
  },
  devError: {
    marginTop: 12,
    fontSize: 12,
    color: "#EF4444",
    textAlign: "center",
    fontFamily: "monospace",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
