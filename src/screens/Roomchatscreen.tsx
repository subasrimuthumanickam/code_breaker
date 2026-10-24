
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  AppState,
  AppStateStatus,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { fetchMessages, sendMessage } from "../api/Wordscrambleapi";

interface RoomChatScreenProps {
  roomCode: string;
  playerName: string;
  onBack: () => void;
}

interface Message {
  player_name: string;
  message: string;
  sent_at: string;
}

const QUICK_REACTIONS = ["👍", "❤️", "😄", "🔥", "👏"];

const AVATAR_COLORS = ["#5B3FD6", "#FF6B57", "#22B573", "#3B82F6", "#F2B640", "#F0566A"];
const colorForName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const formatTime = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

const RoomChatScreen: React.FC<RoomChatScreenProps> = ({ roomCode, playerName, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  // Prevents overlapping requests: if a poll is still in-flight (slow network),
  // the next interval tick skips instead of firing another request on top of it.
  // This is what was causing the request pile-up you saw in devtools.
  const inFlightRef = useRef(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const activeRef = useRef(true);

  const poll = useCallback(async () => {
    if (inFlightRef.current || !activeRef.current) return;
    inFlightRef.current = true;
    try {
      // FIX: fetchMessages() resolves to { messages: ChatMessage[] },
      // not a bare array — destructure the field before passing it to state.
      const { messages: msgs } = await fetchMessages(roomCode);
      setMessages(msgs);
    } catch (err) {
      console.warn("Fetch messages failed:", err);
    } finally {
      inFlightRef.current = false;
      setLoaded(true);
    }
  }, [roomCode]);

  useEffect(() => {
    activeRef.current = true;
    poll();

    const interval = setInterval(() => {
      // Skip polling while the app is backgrounded — no point hitting the
      // API when nobody can see the screen anyway.
      if (appStateRef.current === "active") poll();
    }, 3000);

    const sub = AppState.addEventListener("change", (next) => {
      appStateRef.current = next;
    });

    return () => {
      activeRef.current = false;
      clearInterval(interval);
      sub.remove();
    };
  }, [poll]);

  const handleSend = async (msg: string) => {
    const trimmed = msg.trim();
    if (!trimmed || sending) return;
    setText("");
    setSending(true);
    try {
      await sendMessage(roomCode, playerName, trimmed);
      await poll();
    } catch (err) {
      console.warn("Send message failed:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <LinearGradient colors={["#0B1020", "#141B36", "#0B1020"]} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <StatusBar barStyle="light-content" backgroundColor="#0B1020" />

        <View style={styles.topRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.topTitle}>Room {roomCode}</Text>
            <Text style={styles.topSub}>{messages.length} messages</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {!loaded ? (
            <View style={styles.centerFill}>
              <ActivityIndicator color="#5B3FD6" />
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.centerFill}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptySub}>Say hi to the room!</Text>
            </View>
          ) : (
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item, i) => `${item.sent_at}-${i}`}
              contentContainerStyle={styles.messageList}
              onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
              renderItem={({ item, index }) => {
                const isMine = item.player_name === playerName;
                const prev = messages[index - 1];
                const showSender = !isMine && (!prev || prev.player_name !== item.player_name);

                return (
                  <View style={[styles.messageRow, isMine && styles.messageRowMine]}>
                    {showSender ? (
                      <View style={styles.senderRow}>
                        <View style={[styles.avatar, { backgroundColor: colorForName(item.player_name) }]}>
                          <Text style={styles.avatarText}>{item.player_name.charAt(0).toUpperCase()}</Text>
                        </View>
                        <Text style={styles.senderName}>{item.player_name}</Text>
                      </View>
                    ) : null}
                    <View
                      style={[
                        styles.bubble,
                        isMine ? styles.bubbleMine : styles.bubbleTheirs,
                        !isMine && !showSender && { marginLeft: 38 },
                      ]}
                    >
                      <Text style={styles.bubbleText}>{item.message}</Text>
                    </View>
                    <Text style={[styles.timeText, isMine && styles.timeTextMine, !isMine && !showSender && { marginLeft: 38 }]}>
                      {formatTime(item.sent_at)}
                    </Text>
                  </View>
                );
              }}
            />
          )}

          <View style={styles.reactionsRow}>
            {QUICK_REACTIONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.reactionButton}
                onPress={() => handleSend(emoji)}
                activeOpacity={0.8}
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#5A6478"
              value={text}
              onChangeText={setText}
              onSubmitEditing={() => handleSend(text)}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendButton, (!text.trim() || sending) && styles.sendButtonDisabled]}
              onPress={() => handleSend(text)}
              disabled={!text.trim() || sending}
              activeOpacity={0.85}
            >
              {sending ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Ionicons name="send" size={16} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default RoomChatScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1E2A4D",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#141B36",
    justifyContent: "center",
    alignItems: "center",
  },
  topTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  topSub: { color: "#6B7597", fontSize: 11, marginTop: 2 },

  centerFill: { flex: 1, justifyContent: "center", alignItems: "center", gap: 6 },
  emptyEmoji: { fontSize: 32, marginBottom: 4 },
  emptyTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  emptySub: { color: "#6B7597", fontSize: 13 },

  messageList: { paddingHorizontal: 16, paddingVertical: 14, gap: 4 },
  messageRow: { maxWidth: "80%", alignSelf: "flex-start", marginBottom: 8 },
  messageRowMine: { alignSelf: "flex-end" },
  senderRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  avatar: { width: 22, height: 22, borderRadius: 11, justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
  senderName: { color: "#9AA5C0", fontSize: 11.5, fontWeight: "600" },
  bubble: { borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14 },
  bubbleTheirs: { backgroundColor: "#141B36", borderTopLeftRadius: 4 },
  bubbleMine: { backgroundColor: "#5B3FD6", borderTopRightRadius: 4 },
  bubbleText: { color: "#FFFFFF", fontSize: 14, lineHeight: 19 },
  timeText: { color: "#4B5578", fontSize: 10, marginTop: 3 },
  timeTextMine: { alignSelf: "flex-end" },

  reactionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#1E2A4D",
  },
  reactionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#141B36",
    justifyContent: "center",
    alignItems: "center",
  },
  reactionEmoji: { fontSize: 18 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#141B36",
    paddingHorizontal: 18,
    color: "#FFFFFF",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#232E52",
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#5B3FD6",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
