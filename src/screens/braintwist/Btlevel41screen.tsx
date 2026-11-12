
// Btlevel41screen.tsx — Brain Twist Level 41 (Level 40 theme + bg, bottom mat Clue / Skip)
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Animated, Pressable, SafeAreaView,
  StatusBar, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native';
import Btlevel41art from './Btlevel41art';
import {
  Level41State, fetchLevel41, skipLevel41, submitLevel41Answer, requestLevel41Clue,
} from './Btlevel41api';

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onComplete?: (r: { attempts: number; skipped: boolean }) => void; // App unlocks level 42 + shows congrats
};

const KEYS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

export default function Btlevel41screen({ playerId, onExit, onComplete }: Props) {
  const [state, setState] = useState<Level41State | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [locked, setLocked] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [done, setDone] = useState<'solved' | 'skipped' | null>(null);
  const shake = useRef(new Animated.Value(0)).current;
  // adapt picture + key size to the screen height so the last keyboard row is never cut off
  const { height: winH } = useWindowDimensions();
  const artH = Math.max(90, Math.min(180, winH - 560));
  const keyH = winH < 700 ? 32 : 40;
  // level finished -> hand over to the app (its own congrats screen), no popup here
  const finishedRef = useRef(false);
  const finish = (attempts: number, skipped: boolean, delay = 0) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setTimeout(() => onComplete?.({ attempts: Math.max(1, attempts), skipped }), delay);
  };

  // apply server state to the answer boxes
  const applyState = useCallback((s: Level41State) => {
    setState(s);
    setSlots((prev) => {
      const next = Array.from({ length: s.answerLength }, (_, i) => (prev[i] && !prev[i].startsWith('#') ? prev[i] : ''));
      s.revealed.forEach((r) => (next[r.index] = r.letter));
      return next;
    });
    setLocked(() => {
      const l = Array(s.answerLength).fill(false);
      s.revealed.forEach((r) => (l[r.index] = true));
      return l;
    });
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const r = await fetchLevel41(playerId);
      if (r.success && r.state) applyState(r.state);
      else Alert.alert('Server error', r.message ?? 'Cannot load Level 41');
      setLoading(false);
    })();
  }, [playerId, applyState, reloadKey]);

  const doShake = () => {
    setWrong(true);
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start(() => {
      setWrong(false);
      setSlots((p) => p.map((c, i) => (locked[i] ? c : '')));
    });
  };

  const submit = async (letters: string[]) => {
    setBusy(true);
    const r = await submitLevel41Answer(playerId, letters.join(''));
    setBusy(false);
    if (!r.success || !r.state) return Alert.alert('Error', r.message ?? 'Try again');
    if (r.correct) {
      applyState(r.state);
      setDone('solved');
      finish(r.state.attempts, false, 900); // short pause so the green answer is visible
    }
    else {
      setState(r.state);
      doShake();
    }
  };

  const onKey = (k: string) => {
    if (busy || wrong || done) return;
    const idx = slots.findIndex((c, i) => !c && !locked[i]);
    if (idx === -1) return;
    const next = [...slots];
    next[idx] = k;
    setSlots(next);
    if (next.every((c) => c)) submit(next);
  };

  const onBackspace = () => {
    if (busy || wrong || done) return;
    for (let i = slots.length - 1; i >= 0; i--) {
      if (slots[i] && !locked[i]) {
        const next = [...slots];
        next[i] = '';
        return setSlots(next);
      }
    }
  };

  const onClue = async () => {
    if (busy || done || !state) return;
    setBusy(true);
    const r = await requestLevel41Clue(playerId);
    setBusy(false);
    if (r.state) {
      // keep typed letters in boxes that are not the revealed one
      const revealedIdx = r.state.revealed.map((x) => x.index);
      setSlots((p) => p.map((c, i) => (revealedIdx.includes(i) ? '' : c)));
      applyState(r.state);
    }
    if (!r.success) {
      if (r.error === 'NOT_ENOUGH_BULBS') Alert.alert('Not enough bulbs 💡', `You need ${state.clueCost} bulbs for a clue.`);
      else if (r.error === 'NO_MORE_CLUES') Alert.alert('No more clues', 'Try the last letter yourself!');
    }
  };

  const onSkip = () => {
    if (busy || done || !state) return;
    Alert.alert('Skip level?', `This costs ${state.skipCost} bulbs.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Skip',
        onPress: async () => {
          setBusy(true);
          const r = await skipLevel41(playerId);
          setBusy(false);
          if (r.state) applyState(r.state);
          if (r.success && r.state) { setDone('skipped'); finish(r.state.attempts, true, 400); }
          if (!r.success && r.error === 'NOT_ENOUGH_BULBS') {
            Alert.alert('Not enough bulbs 💡', `You need ${state.skipCost} bulbs to skip.`);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[s.root, s.center]}>
        <ActivityIndicator size="large" color="#A9611D" />
      </View>
    );
  }
  if (!state) {
    return (
      <View style={[s.root, s.center]}>
        <Text style={s.modalTitle}>Cannot load Level 41</Text>
        <Text style={[s.modalSub, { marginTop: 8, textAlign: 'center', paddingHorizontal: 24 }]}>
          Check the backend is running and the API URL is correct.
        </Text>
        <Pressable style={s.nextBtn} onPress={() => setReloadKey((k) => k + 1)}>
          <Text style={s.nextTxt}>RETRY</Text>
        </Pressable>
        <Pressable style={[s.nextBtn, { backgroundColor: '#8EC9F2' }]} onPress={onExit}>
          <Text style={s.nextTxt}>BACK</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="dark-content" />
      {/* background decor like level 40 */}
      <View style={s.bgShelf} />
      <View style={s.bgPlantA} />
      <View style={s.bgPlantB} />

      {/* top bar */}
      <View style={s.topRow}>
        <Pressable style={s.round} onPress={onExit}><Text style={s.roundTxt}>🏠</Text></Pressable>
        <View style={s.round}><Text style={s.roundTxt}>⚙️</Text></View>
        <View style={s.levelPill}>
          <Text style={s.arrow}>‹</Text>
          <Text style={s.levelTxt}>LEVEL 41</Text>
          <Text style={s.arrow}>›</Text>
        </View>
        <View style={s.bulbPill}>
          <Text style={s.bulbTxt}>{state.bulbs}</Text>
          <Text style={{ fontSize: 22 }}>💡</Text>
        </View>
      </View>

      {/* question bar */}
      <View style={s.questionBar}>
        <Text style={s.questionTxt}>What does the picture say?</Text>
      </View>

      {/* notebook card */}
      <View style={s.card}>
        <View style={s.holes}>{Array.from({ length: 9 }).map((_, i) => <View key={i} style={s.hole} />)}</View>
        <View style={s.artWrap}><Btlevel41art width={Math.round((artH * 240) / 180)} height={artH} /></View>

        <Animated.View style={[s.slotRow, { transform: [{ translateX: shake }] }]}>
          {slots.map((c, i) => (
            <View key={i} style={[s.slot, locked[i] && s.slotLocked, wrong && s.slotWrong]}>
              <Text style={s.slotTxt}>{c}</Text>
            </View>
          ))}
        </Animated.View>

        {/* keyboard */}
        <View style={s.kb}>
          {KEYS.map((row, ri) => (
            <View key={ri} style={s.kbRow}>
              {row.split('').map((k) => (
                <Pressable key={k} style={({ pressed }) => [s.key, { height: keyH }, pressed && { transform: [{ scale: 0.92 }] }]} onPress={() => onKey(k)}>
                  <Text style={s.keyTxt}>{k}</Text>
                </Pressable>
              ))}
              {ri === 2 && (
                <Pressable style={[s.key, s.keyDel, { height: keyH }]} onPress={onBackspace}>
                  <Text style={s.keyTxt}>⌫</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* bottom mat : Clue + Skip */}
      <View style={s.mat}>
        <View style={s.matItem}>
          <Text style={s.cost}>💡 x{state.clueCost}</Text>
          <Pressable style={[s.circle, { backgroundColor: '#BEE8FA' }]} onPress={onClue}>
            <Text style={{ fontSize: 28 }}>🔍</Text>
          </Pressable>
          <View style={s.label}><Text style={s.labelTxt}>Hint</Text></View>
        </View>
        <View style={s.matItem}>
          <Text style={s.cost}>💡 x{state.skipCost}</Text>
          <Pressable style={[s.circle, { backgroundColor: '#FF7FA3' }]} onPress={onSkip}>
            <Text style={{ fontSize: 24, color: '#111' }}>⏭</Text>
          </Pressable>
          <View style={s.label}><Text style={s.labelTxt}>Skip</Text></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const BROWN = '#A9611D';
const CREAM = '#FBEBD3';
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#BEE1F6' },
  center: { alignItems: 'center', justifyContent: 'center' },
  bgShelf: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '28%', backgroundColor: '#EFBE7D' },
  bgPlantA: { position: 'absolute', left: -20, bottom: 40, width: 70, height: 150, borderRadius: 35, backgroundColor: '#9ADA55' },
  bgPlantB: { position: 'absolute', right: -20, bottom: 60, width: 60, height: 120, borderRadius: 30, backgroundColor: '#FFD21F' },

  topRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingTop: 12, gap: 8 },
  round: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFD91F', borderWidth: 2, borderColor: '#222', alignItems: 'center', justifyContent: 'center' },
  roundTxt: { fontSize: 22 },
  levelPill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: BROWN, borderRadius: 12, borderWidth: 3, borderColor: '#D9893A', paddingVertical: 8 },
  levelTxt: { color: '#fff', fontSize: 20, fontWeight: '900' },
  arrow: { color: '#FFC62B', fontSize: 26, fontWeight: '900' },
  bulbPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 22, paddingHorizontal: 14, height: 44 },
  bulbTxt: { fontSize: 22, fontWeight: '900', color: '#111' },

  questionBar: { marginHorizontal: 16, marginTop: 12, backgroundColor: CREAM, borderRadius: 26, paddingVertical: 14, alignItems: 'center' },
  questionTxt: { fontSize: 20, fontWeight: '800', fontStyle: 'italic', color: '#16295C' },

  card: { flex: 1, marginHorizontal: 16, marginTop: 10, backgroundColor: '#fff', borderRadius: 22, paddingBottom: 12, alignItems: 'center', justifyContent: 'space-between' },
  holes: { flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', paddingHorizontal: 14, paddingTop: 12 },
  hole: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#8FCBF3' },
  artWrap: { marginTop: 4 },
  slotRow: { flexDirection: 'row', gap: 8, marginTop: 2 },
  slot: { width: 46, height: 50, borderRadius: 10, borderWidth: 3, borderColor: '#222', backgroundColor: '#F6F6F6', alignItems: 'center', justifyContent: 'center' },
  slotLocked: { backgroundColor: '#FFE08A' },
  slotWrong: { backgroundColor: '#FF9C9C' },
  slotTxt: { fontSize: 28, fontWeight: '900', color: '#2A12E8' },

  kb: { alignSelf: 'stretch', paddingHorizontal: 8, gap: 6 },
  kbRow: { flexDirection: 'row', justifyContent: 'center', gap: 4 },
  key: { flex: 1, maxWidth: 38, height: 40, borderRadius: 8, backgroundColor: '#FFF6E6', borderWidth: 2, borderColor: '#222', alignItems: 'center', justifyContent: 'center' },
  keyDel: { flex: 1.5, maxWidth: 56, backgroundColor: '#FFB3C6' },
  keyTxt: { fontSize: 19, fontWeight: '900', color: '#111' },

  mat: { marginHorizontal: 24, marginTop: 10, marginBottom: 14, backgroundColor: CREAM, borderRadius: 34, borderWidth: 4, borderColor: '#8EC9F2', paddingVertical: 6, flexDirection: 'row', justifyContent: 'space-evenly' },
  matItem: { alignItems: 'center' },
  cost: { fontSize: 15, fontWeight: '900', color: '#16295C', marginBottom: 2 },
  circle: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  label: { marginTop: 4, backgroundColor: BROWN, borderRadius: 14, paddingHorizontal: 22, paddingVertical: 3 },
  labelTxt: { color: '#fff', fontWeight: '900', fontSize: 16 },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  modalBox: { width: '80%', backgroundColor: CREAM, borderRadius: 26, borderWidth: 5, borderColor: '#8EC9F2', padding: 22, alignItems: 'center' },
  modalTitle: { fontSize: 26, fontWeight: '900', color: '#16295C' },
  modalAns: { fontSize: 38, fontWeight: '900', color: '#2A12E8', marginVertical: 8, letterSpacing: 4 },
  modalSub: { fontSize: 18, fontWeight: '700', color: '#16295C', marginBottom: 4 },
  nextBtn: { marginTop: 12, backgroundColor: BROWN, borderRadius: 16, paddingHorizontal: 28, paddingVertical: 12 },
  nextTxt: { color: '#fff', fontSize: 20, fontWeight: '900' },
});
