import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

/**
 * BTSkipRiddle - riddle screen shown when the red SKIP button is pressed on Level 1.
 * Self-contained: NO image file needed (everything is drawn with Views).
 *
 * Props (same as BTGameScreen.tsx uses):
 *   hints     - hint balance shown in the top-right pill
 *   onHome    - home button
 *   onBack    - gear button / Android back -> return to Level 1
 *   onSkipped - called after the right answer. Return '' for success, else an error message.
 */
type Props = {
  hints?: number;
  onHome?: () => void;
  onBack?: () => void;
  onSkipped: () => Promise<string> | string;
};

// Riddle: "What goes up but never comes down?"  ->  age
const QUESTION = 'What goes up\nbut never comes down?';
const ANSWERS = ['age', 'your age', 'my age', 'an age', 'the age'];

const NAVY = '#0f1f4d';
const WALL = '#5cbcea';

const clean = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');

export default function BTSkipRiddle({ hints, onHome, onBack, onSkipped }: Props) {
  const [text, setText] = useState('');
  const [wrong, setWrong] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const shake = useRef(new Animated.Value(0)).current;

  // Android hardware back -> back to Level 1
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onBack) {
        onBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [onBack]);

  const doShake = () => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const submit = async () => {
    if (busy) return;
    const ans = clean(text);
    if (ans && ANSWERS.includes(ans)) {
      setWrong(false);
      setMsg('');
      setBusy(true);
      try {
        const err = await onSkipped(); // right answer -> skip + next level
        if (err) setMsg(err);
      } catch (e) {
        setMsg('Network error');
      }
      setBusy(false);
    } else {
      setWrong(true);
      setMsg('');
      doShake();
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* soft light beams on the wall */}
      <View pointerEvents="none" style={[s.beam, { left: '8%', width: 90 }]} />
      <View pointerEvents="none" style={[s.beam, { left: '42%', width: 60, opacity: 0.1 }]} />

      {/* ---------- top bar ---------- */}
      <View style={s.top}>
        <View style={s.topLeft}>
          <TouchableOpacity style={s.round} onPress={onHome} activeOpacity={0.8}>
            <Text style={s.roundIcon}>🏠</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.round} onPress={onBack} activeOpacity={0.8}>
            <Text style={s.roundIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <View style={s.hintPill}>
          <Text numberOfLines={1} style={s.hintNum}>
            {typeof hints === 'number' ? hints : 0}
          </Text>
          <Text style={s.hintBulb}>💡</Text>
        </View>
      </View>

      {/* ---------- notebook-paper question card ---------- */}
      <View style={s.cardWrap}>
        <View style={s.card}>
          <View style={s.holes}>
            {Array.from({ length: 11 }).map((_, i) => (
              <View key={i} style={s.hole} />
            ))}
          </View>
          <View style={[s.line, { top: 70 }]} />
          <View style={[s.line, { top: 120 }]} />
          <View style={[s.line, { top: 170 }]} />
          <View style={[s.line, { top: 220 }]} />

          <Text style={s.question}>{QUESTION}</Text>
          <Text style={s.qMark}>?</Text>
        </View>

        {/* yellow sticky note with bulb */}
        <View style={s.sticky}>
          <Text style={s.stickyBulb}>💡</Text>
        </View>
      </View>

      {/* ---------- answer input ---------- */}
      <Animated.View style={[s.inputWrap, { transform: [{ translateX: shake }] }]}>
        <TextInput
          value={text}
          onChangeText={(t) => {
            setText(t);
            setWrong(false);
            setMsg('');
          }}
          placeholder="Type your answer..."
          placeholderTextColor="#9aa0b4"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={submit}
          returnKeyType="done"
          style={[s.input, wrong && s.inputWrong]}
        />
      </Animated.View>

      {/* ---------- submit ---------- */}
      <TouchableOpacity
        style={[s.submit, busy && { opacity: 0.7 }]}
        onPress={submit}
        disabled={busy}
        activeOpacity={0.85}
      >
        <Text style={s.submitText}>Submit</Text>
      </TouchableOpacity>

      {(wrong || !!msg) && (
        <Text style={s.err}>{msg || 'Wrong answer, try again!'}</Text>
      )}

      {/* ---------- desk, books, thinking face ---------- */}
      <View pointerEvents="none" style={s.desk} />
      <View pointerEvents="none" style={s.books}>
        <View style={[s.book, { width: 96, backgroundColor: '#3f9ad6' }]} />
        <View style={[s.book, { width: 104, backgroundColor: '#f2c14e', marginLeft: 4 }]} />
        <View style={[s.book, { width: 98, backgroundColor: '#e86fae' }]} />
        <View style={[s.book, { width: 92, backgroundColor: '#5b46c9', marginLeft: 3 }]} />
      </View>
      <Text pointerEvents="none" style={s.thinker}>
        🤔
      </Text>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: WALL,
    alignItems: 'center',
    paddingTop: 34,
    overflow: 'hidden',
  },
  beam: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    opacity: 0.14,
    transform: [{ rotate: '-14deg' }],
  },

  /* top bar */
  top: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  topLeft: { flexDirection: 'row', gap: 10 },
  round: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fbc928',
    borderWidth: 3,
    borderColor: '#3a2a10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundIcon: { fontSize: 22 },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf9f1',
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#e7b04a',
    paddingLeft: 18,
    paddingRight: 8,
    height: 46,
    minWidth: 96,
    justifyContent: 'space-between',
  },
  hintNum: { fontSize: 26, fontWeight: '900', color: NAVY },
  hintBulb: { fontSize: 26, marginLeft: 6 },

  /* question card */
  cardWrap: { width: '92%', marginTop: 40 },
  card: {
    backgroundColor: '#fbf7ec',
    borderRadius: 14,
    paddingTop: 34,
    paddingBottom: 34,
    paddingHorizontal: 22,
    minHeight: 250,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-1.6deg' }],
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  holes: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  hole: { width: 14, height: 14, borderRadius: 7, backgroundColor: WALL },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#dcebf5',
  },
  question: {
    fontSize: 30,
    fontWeight: '900',
    color: NAVY,
    textAlign: 'center',
    lineHeight: 42,
  },
  qMark: {
    position: 'absolute',
    right: 16,
    top: 18,
    fontSize: 54,
    fontWeight: '900',
    color: '#ffb629',
  },
  sticky: {
    position: 'absolute',
    left: -6,
    top: -22,
    width: 78,
    height: 78,
    backgroundColor: '#f9d35a',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-9deg' }],
    elevation: 8,
  },
  stickyBulb: { fontSize: 42 },

  /* input + submit */
  inputWrap: { width: '82%', marginTop: 30 },
  input: {
    backgroundColor: '#fdfdff',
    borderWidth: 3,
    borderColor: '#1e7fe0',
    borderRadius: 40,
    height: 62,
    paddingHorizontal: 26,
    fontSize: 22,
    fontWeight: '700',
    color: NAVY,
  },
  inputWrong: { borderColor: '#e53935', backgroundColor: '#fff1f1' },
  submit: {
    marginTop: 22,
    backgroundColor: '#5fcd2b',
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#2f8a12',
    paddingHorizontal: 64,
    paddingVertical: 12,
    elevation: 6,
  },
  submitText: { color: '#fff', fontSize: 30, fontWeight: '900' },
  err: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    color: '#c0392b',
    fontWeight: '800',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 16,
    overflow: 'hidden',
  },

  /* decoration */
  desk: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    backgroundColor: '#f0b86e',
  },
  books: { position: 'absolute', left: -6, bottom: 60 },
  book: { height: 24, borderRadius: 4, marginBottom: 2 },
  thinker: { position: 'absolute', right: 14, bottom: 26, fontSize: 84 },
});
