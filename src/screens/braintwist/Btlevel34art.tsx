// src/screens/braintwist/Btlevel34art.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Ellipse, Path, Line } from 'react-native-svg';

// room theme pieces Level 33 art file la irukku, inga re-export pannurom
export { RoomBackground, LevelSign, HintPill, BottomBar } from './Btlevel33art';

/* ---------- riddle card (cream, orange border) ---------- */
export const RiddleCard = ({ text }: { text: string }) => (
  <View style={s.card}>
    <Text style={s.cardText}>{text}</Text>
  </View>
);

/* ---------- fishing dock scene: boy + doctor ---------- */
export const FishingScene = ({ width = 330 }: { width?: number }) => {
  const h = width * (220 / 340);
  return (
    <Svg width={width} height={h} viewBox="0 0 340 220">
      {/* sky + bushes */}
      <Rect x="0" y="0" width="340" height="220" fill="#a9d8fb" />
      <Circle cx="40" cy="120" r="44" fill="#6cc080" />
      <Circle cx="95" cy="130" r="38" fill="#58b36f" />
      <Circle cx="250" cy="125" r="42" fill="#6cc080" />
      <Circle cx="310" cy="130" r="40" fill="#58b36f" />
      <Rect x="0" y="140" width="340" height="14" fill="#58b36f" />

      {/* water */}
      <Rect x="0" y="150" width="340" height="70" fill="#2f9be0" />
      <Path d="M0 170 Q40 164 80 170 T160 170 T240 170 T340 170" stroke="#6cc4f2" strokeWidth="2" fill="none" />

      {/* dock */}
      <Rect x="40" y="140" width="16" height="52" rx="3" fill="#7a4f2a" />
      <Rect x="150" y="136" width="16" height="56" rx="3" fill="#7a4f2a" />
      <Rect x="262" y="140" width="16" height="52" rx="3" fill="#7a4f2a" />
      <Rect x="26" y="148" width="288" height="16" rx="3" fill="#9a6a3a" />
      <Line x1="26" y1="156" x2="314" y2="156" stroke="#7a4f2a" strokeWidth="1.5" />

      {/* ----- boy ----- */}
      {/* legs */}
      <Rect x="96" y="156" width="11" height="30" rx="5" fill="#f7c9a0" />
      <Rect x="113" y="156" width="11" height="30" rx="5" fill="#f7c9a0" />
      {/* shorts */}
      <Rect x="92" y="138" width="38" height="18" rx="6" fill="#2f5aa8" />
      {/* shirt */}
      <Rect x="92" y="106" width="38" height="36" rx="9" fill="#ffffff" />
      <Rect x="92" y="116" width="38" height="4" fill="#5aa2e8" />
      <Rect x="92" y="126" width="38" height="4" fill="#5aa2e8" />
      {/* head */}
      <Circle cx="111" cy="82" r="25" fill="#f7c9a0" />
      <Path d="M87 78 Q90 62 111 62 Q132 62 135 78 Q122 68 111 70 Q98 68 87 78Z" fill="#6b3f22" />
      <Circle cx="101" cy="84" r="3" fill="#222" />
      <Circle cx="121" cy="84" r="3" fill="#222" />
      <Circle cx="95" cy="92" r="4" fill="#f4a3a0" opacity="0.7" />
      <Circle cx="127" cy="92" r="4" fill="#f4a3a0" opacity="0.7" />
      <Path d="M104 93 Q111 100 118 93" stroke="#b03a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* straw hat */}
      <Ellipse cx="111" cy="64" rx="40" ry="9" fill="#f2b84b" />
      <Path d="M86 64 Q111 26 136 64Z" fill="#f2b84b" />
      <Rect x="87" y="54" width="48" height="7" fill="#e24a3b" />

      {/* ----- doctor ----- */}
      {/* legs */}
      <Rect x="198" y="160" width="13" height="28" rx="5" fill="#2b3a67" />
      <Rect x="220" y="160" width="13" height="28" rx="5" fill="#2b3a67" />
      <Rect x="194" y="144" width="44" height="20" rx="6" fill="#2b3a67" />
      {/* coat */}
      <Rect x="190" y="98" width="52" height="54" rx="11" fill="#ffffff" stroke="#dfe6ee" strokeWidth="2" />
      <Path d="M210 100 L216 128 L222 100Z" fill="#4aa3e0" />
      <Path d="M213 112 L216 150 L219 112Z" fill="#2f7fc4" />
      {/* stethoscope */}
      <Path d="M200 100 Q198 128 212 130" stroke="#445" strokeWidth="2.5" fill="none" />
      <Circle cx="213" cy="131" r="4" fill="#9aa5b1" />
      {/* head */}
      <Circle cx="216" cy="72" r="25" fill="#f7c9a0" />
      <Path d="M190 70 Q192 42 216 44 Q241 42 242 70 Q232 56 216 58 Q200 56 190 70Z" fill="#1d1d24" />
      <Circle cx="206" cy="76" r="3" fill="#222" />
      <Circle cx="226" cy="76" r="3" fill="#222" />
      <Circle cx="200" cy="84" r="4" fill="#f4a3a0" opacity="0.7" />
      <Circle cx="232" cy="84" r="4" fill="#f4a3a0" opacity="0.7" />
      <Path d="M208 85 Q216 93 224 85" stroke="#b03a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* ----- fishing rods ----- */}
      <Line x1="124" y1="124" x2="38" y2="28" stroke="#7a4a2a" strokeWidth="3" strokeLinecap="round" />
      <Line x1="38" y1="28" x2="38" y2="176" stroke="#ffffff" strokeWidth="1" />
      <Circle cx="38" cy="176" r="6" fill="#e24a3b" />
      <Ellipse cx="38" cy="182" rx="17" ry="4" stroke="#bfe6fb" strokeWidth="1.5" fill="none" />

      <Line x1="232" y1="124" x2="308" y2="28" stroke="#7a4a2a" strokeWidth="3" strokeLinecap="round" />
      <Line x1="308" y1="28" x2="308" y2="176" stroke="#ffffff" strokeWidth="1" />
      <Circle cx="308" cy="176" r="6" fill="#e24a3b" />
      <Ellipse cx="308" cy="182" rx="17" ry="4" stroke="#bfe6fb" strokeWidth="1.5" fill="none" />
    </Svg>
  );
};

/* ---------- answer box (type + check button) ---------- */
export const AnswerRow = ({
  value,
  onChange,
  onSubmit,
  disabled,
  status,
}: {
  value: string;
  onChange: (t: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  status: 'idle' | 'wrong' | 'correct';
}) => {
  const border =
    status === 'correct' ? '#2ea84a' : status === 'wrong' ? '#e0473f' : '#0B3C8C';
  return (
    <View style={s.answerRow}>
      <TextInput
        style={[s.input, { borderColor: border }]}
        value={value}
        onChangeText={onChange}
        placeholder="Type your answer"
        placeholderTextColor="#7a8bb0"
        editable={!disabled}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        maxLength={40}
      />
      <TouchableOpacity
        style={[s.check, { opacity: disabled || !value.trim() ? 0.5 : 1 }]}
        disabled={disabled || !value.trim()}
        onPress={onSubmit}
      >
        <Text style={s.checkText}>✓</Text>
      </TouchableOpacity>
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    backgroundColor: '#FBF3DC',
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#F39C22',
    borderBottomWidth: 6,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginHorizontal: 14,
  },
  cardText: {
    fontSize: 22,
    lineHeight: 31,
    fontWeight: '800',
    color: '#10245e',
    textAlign: 'center',
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 14,
  },
  input: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    fontSize: 20,
    fontWeight: '700',
    color: '#10245e',
  },
  check: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7ED321',
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { fontSize: 28, fontWeight: '900', color: '#10245e' },
});