import React, { useEffect } from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

type Props = { visible: boolean; onClose: () => void };

export default function HowToPlayModal({ visible, onClose }: Props) {
  const player = useVideoPlayer(
    // require("../../assets/videos/Code_Breaker_How_To_Play_Tutorial.mp4"),
    require("../../assets/vedios/Code_Breaker_How_To_Play_Tutorial.mp4"),
    (p) => {
      p.loop = false;
    }
  );

  useEffect(() => {
    if (visible) {
      player.currentTime = 0;
      player.play();
    } else {
      player.pause();
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <View style={styles.header}>
            <Text style={styles.title}>How to Play</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>
          <VideoView
            player={player}
            style={styles.video}
            nativeControls
            contentFit="contain"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    padding: 16,
  },
  box: {
    backgroundColor: "#141638",
    borderRadius: 20,
    padding: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "800" },
  close: { color: "#fff", fontSize: 22, paddingHorizontal: 6 },
  video: {
    width: "100%",
    aspectRatio: 9 / 16,
    maxHeight: 520,
    borderRadius: 12,
    backgroundColor: "#000",
  },
});