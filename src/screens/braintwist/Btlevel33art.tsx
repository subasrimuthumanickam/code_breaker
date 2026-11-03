// src/screens/Btlevel33art.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const RoomBackground = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={s.sky} />
    <View style={s.window}>
      <View style={s.cloud} />
      <View style={s.tree} />
    </View>
    <View style={s.lampCord} />
    <View style={s.lamp} />
    <View style={s.frame}>
      <View style={s.sun} />
    </View>
    <View style={s.shelf}>
      <View style={[s.book, { backgroundColor: '#2196F3' }]} />
      <View style={[s.book, { backgroundColor: '#FFD54F' }]} />
      <View style={[s.book, { backgroundColor: '#9C5BD6' }]} />
    </View>
    <View style={s.floor} />
    <View style={s.rug} />
  </View>
);

export const LevelSign = ({ level }: { level: number }) => (
  <View style={s.signWrap}>
    <View style={s.signBox}>
      <Text style={s.signText}>{`< LEVEL ${level} >`}</Text>
    </View>
  </View>
);

export const HintPill = ({ hints }: { hints: number }) => (
  <View style={s.pill}>
    <Text style={s.pillText}>{hints}</Text>
    <Text style={{ fontSize: 18 }}>💡</Text>
  </View>
);

export const QuestionCard = ({ title, prompt }: { title: string; prompt: string }) => (
  <View style={s.qCard}>
    <Text style={s.qTitle}>{title}</Text>
    <Text style={s.qPrompt}>{prompt}</Text>
  </View>
);

type OptState = 'idle' | 'wrong' | 'correct' | 'removed';

export const OptionRow = ({
  id,
  text,
  state,
  onPress,
}: {
  id: string;
  text: string;
  state: OptState;
  onPress: () => void;
}) => {
  if (state === 'removed') return <View style={{ height: 62, marginVertical: 6 }} />;
  const bg =
    state === 'correct' ? '#8BE38B' : state === 'wrong' ? '#F8A5A5' : '#D9F2D0';
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={s.optRow}>
      <View style={s.optBadge}>
        <Text style={s.optBadgeText}>{id}</Text>
      </View>
      <View style={[s.optPill, { backgroundColor: bg }]}>
        <Text style={s.optText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const BottomBar = ({
  hintCost,
  videoReward,
  skipCost,
  onHint,
  onVideo,
  onSkip,
}: {
  hintCost: number;
  videoReward: number;
  skipCost: number;
  onHint: () => void;
  onVideo: () => void;
  onSkip: () => void;
}) => (
  <View style={s.bar}>
    <BarBtn icon="🔍" bg="#7ED321" label={`💡 ${hintCost}`} onPress={onHint} />
    <BarBtn icon="🎬" bg="#FFFFFF" label={`🪙 +${videoReward}`} onPress={onVideo} />
    <BarBtn icon="▶" bg="#EF4444" label={`💡 ${skipCost}`} onPress={onSkip} iconColor="#fff" />
  </View>
);

const BarBtn = ({
  icon,
  bg,
  label,
  onPress,
  iconColor,
}: {
  icon: string;
  bg: string;
  label: string;
  onPress: () => void;
  iconColor?: string;
}) => (
  <View style={{ alignItems: 'center' }}>
    <TouchableOpacity onPress={onPress} style={[s.barBtn, { backgroundColor: bg }]}>
      <Text style={{ fontSize: 28, color: iconColor || '#000' }}>{icon}</Text>
    </TouchableOpacity>
    <View style={s.barLabel}>
      <Text style={s.barLabelText}>{label}</Text>
    </View>
  </View>
);

const s = StyleSheet.create({
  sky: { ...StyleSheet.absoluteFillObject, backgroundColor: '#8FD0FA' },
  window: {
    position: 'absolute', left: 0, top: 90, width: 70, height: 170,
    backgroundColor: '#9BDCFB', borderColor: '#F5B26B', borderWidth: 6,
  },
  cloud: { position: 'absolute', top: 14, left: 8, width: 40, height: 18, borderRadius: 10, backgroundColor: '#fff' },
  tree: { position: 'absolute', bottom: 0, right: 6, width: 36, height: 60, borderRadius: 18, backgroundColor: '#5BC27A' },
  lampCord: { position: 'absolute', top: 0, right: 110, width: 2, height: 28, backgroundColor: '#2B3A67' },
  lamp: { position: 'absolute', top: 26, right: 88, width: 50, height: 26, borderTopLeftRadius: 25, borderTopRightRadius: 25, backgroundColor: '#1E88E5' },
  frame: { position: 'absolute', top: 90, right: 12, width: 56, height: 56, backgroundColor: '#E8F4FB', alignItems: 'center', justifyContent: 'center' },
  sun: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFA726' },
  shelf: { position: 'absolute', right: 0, bottom: 230, width: 60, height: 70, backgroundColor: '#C97B4A', flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 4 },
  book: { width: 8, height: 40, marginRight: 2 },
  floor: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '28%', backgroundColor: '#F8B878' },
  rug: { position: 'absolute', alignSelf: 'center', bottom: 30, width: '85%', height: 110, borderRadius: 60, backgroundColor: '#FB9A6D' },

  signWrap: { alignItems: 'center' },
  signBox: { backgroundColor: '#C9783A', borderRadius: 8, paddingHorizontal: 22, paddingVertical: 8, borderBottomWidth: 4, borderBottomColor: '#A85F28' },
  signText: { color: '#fff', fontSize: 24, fontWeight: '900' },

  pill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, gap: 4 },
  pillText: { fontSize: 18, fontWeight: '900', color: '#000' },

  qCard: { backgroundColor: '#03A9F4', borderRadius: 22, borderWidth: 3, borderColor: '#0B3C8C', paddingVertical: 14, alignItems: 'center', marginHorizontal: 14 },
  qTitle: { fontSize: 28, fontWeight: '900', color: '#0A1F5C' },
  qPrompt: { fontSize: 28, fontWeight: '700', color: '#fff', marginTop: 4 },

  optRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  optBadge: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#1FA463', borderWidth: 3, borderColor: '#0B3C2C', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  optBadgeText: { color: '#fff', fontSize: 26, fontWeight: '900' },
  optPill: { flex: 1, marginLeft: -22, paddingLeft: 30, height: 50, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  optText: { color: '#1B7F3B', fontSize: 18, fontWeight: '700' },

  bar: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#F3E8D8', borderRadius: 50, borderWidth: 6, borderColor: '#8EC5EE', paddingVertical: 14, marginHorizontal: 16 },
  barBtn: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
  barLabel: { backgroundColor: '#6B3A22', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4, marginTop: 6 },
  barLabelText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});