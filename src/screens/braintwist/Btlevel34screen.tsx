// src/screens/braintwist/Btlevel34screen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  Alert, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import {
  RoomBackground, LevelSign, HintPill, BottomBar,
  RiddleCard, FishingScene, AnswerRow,
} from './Btlevel34art';

/* ===================== API (inline) ===================== */
// web na localhost; phone na PC IP (http://192.168.x.x:4000); Android emulator na http://10.0.2.2:4000
const HOST = 'http://localhost:4000';
const API_BASE = `${HOST}/api/braintwist/level34`;

interface Level34Question {
  text: string;
  hintCost: number;
  skipCost: number;
  videoReward: number;
  reward: number;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return (await res.json()) as T;
}

const post = <T,>(path: string, body: object) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) });

const level34Api = {
  getLevel: (playerId: number) =>
    request<{ success: boolean; question: Level34Question; hints: number }>(
      `/start?playerId=${playerId}`
    ),
  submitAnswer: (playerId: number, answer: string) =>
    post<{ success: boolean; correct: boolean; reward: number; attempts: number; hints: number }>(
      '/answer',
      { playerId, answer }
    ),
  useHint: (playerId: number) =>
    post<{ success: boolean; hints: number; hint?: { text?: string }; error?: string }>(
      '/hint',
      { playerId }
    ),
  skip: (playerId: number) =>
    post<{ success: boolean; hints: number; attempts?: number; error?: string }>('/skip', {
      playerId,
    }),
  videoReward: (playerId: number) =>
    post<{ success: boolean; hints: number }>('/reward', { playerId }),
};

/* ===================== SCREEN ===================== */
type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onComplete?: (r: any) => void;
};

export default function Btlevel34screen({
  playerId,
  hints: hintsProp,
  setHints,
  onExit,
  onComplete,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<Level34Question | null>(null);
  const [localHints, setLocalHints] = useState(0);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const hints = typeof hintsProp === 'number' ? hintsProp : localHints;
  const updateHints = (n: number) => {
    setLocalHints(n);
    setHints?.(n);
  };

  const load = useCallback(async () => {
    try {
      const data = await level34Api.getLevel(playerId);
      if (data.success) {
        setQuestion(data.question);
        updateHints(data.hints);
      } else {
        Alert.alert('Error', 'Level load aagala');
      }
    } catch {
      Alert.alert('Network error', 'Server connect aagala');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId]);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async () => {
    const text = answer.trim();
    if (busy || done || !text) return;
    setBusy(true);
    try {
      const res = await level34Api.submitAnswer(playerId, text);
      updateHints(res.hints);
      if (res.correct) {
        setDone(true);
        setStatus('correct');
        setNote('Correct!');
        setTimeout(() => {
          onComplete?.({
            attempts: Math.max(1, Number(res.attempts) || 1),
            skipped: false,
            correct: true,
          });
        }, 900);
      } else {
        setStatus('wrong');
        setNote('Not quite. Try again!');
        setTimeout(() => {
          setStatus('idle');
          setNote('');
        }, 1200);
      }
    } catch {
      Alert.alert('Network error', 'Try again');
    } finally {
      setBusy(false);
    }
  };

  const onHint = async () => {
    if (busy || done || !question) return;
    setBusy(true);
    try {
      const res = await level34Api.useHint(playerId);
      updateHints(res.hints);
      if (!res.success) {
        Alert.alert('Hint', res.error || 'Not enough hints');
        return;
      }
      if (res.hint?.text) Alert.alert('Hint', res.hint.text);
    } catch {
      Alert.alert('Network error', 'Try again');
    } finally {
      setBusy(false);
    }
  };

  const onVideo = async () => {
    if (busy || done) return;
    // TODO: rewarded video ad SDK inga call pannunga, ad mudinjadhum keela API
    setBusy(true);
    try {
      const res = await level34Api.videoReward(playerId);
      if (res.success) updateHints(res.hints);
    } catch {
      Alert.alert('Network error', 'Try again');
    } finally {
      setBusy(false);
    }
  };

  const doSkip = async () => {
    setBusy(true);
    try {
      const res = await level34Api.skip(playerId);
      updateHints(res.hints);
      if (res.success) {
        setDone(true);
        onComplete?.({ attempts: Math.max(1, Number(res.attempts) || 1), skipped: true });
      } else {
        Alert.alert('Skip', res.error || 'Not enough hints');
      }
    } catch {
      Alert.alert('Network error', 'Try again');
    } finally {
      setBusy(false);
    }
  };

  const onSkip = () => {
    if (busy || done || !question) return;
    if (hints < question.skipCost) {
      Alert.alert('Skip', `Need ${question.skipCost} hints. You have ${hints}.`);
      return;
    }
    Alert.alert('Skip level?', `${question.skipCost} hints cost aagum`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Skip', onPress: doSkip },
    ]);
  };

  if (loading || !question) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <RoomBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topRow}>
              <View style={styles.topLeft}>
                <TouchableOpacity style={styles.roundBtn} onPress={onExit}>
                  <Text style={styles.roundIcon}>🏠</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.roundBtn}>
                  <Text style={styles.roundIcon}>⚙️</Text>
                </TouchableOpacity>
              </View>
              <LevelSign level={34} />
              <HintPill hints={hints} />
            </View>

            <View style={{ marginTop: 22 }}>
              <RiddleCard text={question.text} />
            </View>

            <View style={styles.scene}>
              <FishingScene width={320} />
            </View>

            <AnswerRow
              value={answer}
              onChange={setAnswer}
              onSubmit={onSubmit}
              disabled={busy || done}
              status={status}
            />
            <Text
              style={[
                styles.note,
                { color: status === 'correct' ? '#1f8a3a' : '#c0392b' },
              ]}
            >
              {note}
            </Text>

            <View style={{ marginTop: 6, marginBottom: 18 }}>
              <BottomBar
                videoReward={question.videoReward}
                skipCost={question.skipCost}
                onHint={onHint}
                onVideo={onVideo}
                onSkip={onSkip}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#8FD0FA' },
  center: { alignItems: 'center', justifyContent: 'center' },
  scroll: { flexGrow: 1, paddingBottom: 10 },
  topRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingTop: 8,
  },
  topLeft: { flexDirection: 'row', gap: 8 },
  roundBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFC21A',
    borderWidth: 3, borderColor: '#D99A00', alignItems: 'center', justifyContent: 'center',
  },
  roundIcon: { fontSize: 20 },
  scene: { alignItems: 'center', marginVertical: 12 },
  note: { textAlign: 'center', fontSize: 17, fontWeight: '800', height: 24, marginTop: 6 },
});