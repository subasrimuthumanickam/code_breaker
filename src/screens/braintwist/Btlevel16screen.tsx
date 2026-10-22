
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as api from './api'; // same generic api as BTGameScreen (api.reward for the video button)
import { Level16Background, PizzaScene, SceneState } from './Btlevel16art';
import {
  answerLevel16,
  hintLevel16,
  Level16Data,
  skipLevel16,
  startLevel16,
} from './Btlevel16api';

type Props = {
  playerId: number;
  hints: number;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onComplete?: (r: any) => void;
};

const HINT_COST = 25;
const SKIP_COST = 50;

export default function Btlevel16screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
  const { width } = useWindowDimensions();
  const W = Math.min(width, 450);
  const sceneW = Math.min(W - 24, 420);

  const [level, setLevel] = useState<Level16Data | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<string | null>(null);
  const [sceneState, setSceneState] = useState<SceneState>('idle');
  const [locked, setLocked] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const shake = useRef(new Animated.Value(0)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const d = await startLevel16(playerId);
      setSessionId(d.sessionId);
      setLevel(d.level);
    } catch (e: any) {
      setError(e?.message ?? 'Cannot load level 16');
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (m: string) => {
    setNote(m);
    later(() => setNote(null), 2600);
  };

  const runShake = () => {
    shake.setValue(0);
    Animated.sequence(
      [1, -1, 1, 0].map((v) =>
        Animated.timing(shake, { toValue: v, duration: 70, easing: Easing.linear, useNativeDriver: true })
      )
    ).start();
  };

  const handlePick = async (choice: string) => {
    if (locked || !sessionId) return;
    setLocked(true);
    setSelected(choice);
    setSceneState('idle');
    try {
      const r = await answerLevel16(playerId, sessionId, choice);
      if (r.correct) {
        setSceneState('right');
        setExplanation(r.explanation);
        later(() => onComplete?.({ ...r, skipped: false }), 2400);
      } else {
        setSceneState('wrong');
        runShake();
        later(() => {
          setSelected(null);
          setSceneState('idle');
          setLocked(false);
        }, 900);
      }
    } catch (e: any) {
      flash('Network error');
      setSelected(null);
      setLocked(false);
    }
  };

  const handleHint = async () => {
    if (!sessionId || locked) return;
    try {
      const r = await hintLevel16(playerId, sessionId);
      setHints?.(r.hints);
      flash(r.hint.text);
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
    }
  };

  const handleSkip = async () => {
    if (!sessionId || locked) return;
    try {
      setLocked(true);
      const r = await skipLevel16(playerId, sessionId);
      setHints?.(r.hints);
      onComplete?.({ ...r, skipped: true });
    } catch (e: any) {
      setLocked(false);
      flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
    }
  };

  const handleVideo = async () => {
    try {
      const r = await api.reward(playerId, 'video');
      setHints?.(r.hints);
    } catch (e) {}
  };

  const shakeX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-9, 9] });

  return (
    <View style={styles.root}>
      <Level16Background />

      <View style={[styles.column, { width: W }]}>
        <View style={styles.topBar}>
          <View style={styles.topLeft}>
            <Pressable style={styles.roundBtn} onPress={onExit}>
              <Ionicons name="home" size={18} color="#3a2a12" />
            </Pressable>
            <Pressable style={styles.roundBtn}>
              <Ionicons name="settings-sharp" size={18} color="#3a2a12" />
            </Pressable>
          </View>
          <View style={styles.bulbPill}>
            <Text style={styles.bulbText}>{hints}</Text>
            <Text style={{ fontSize: 18 }}>💡</Text>
          </View>
        </View>

        <View style={styles.signWrap}>
          <View style={styles.string} />
          <View style={styles.string} />
        </View>
        <View style={styles.sign}>
          <View style={[styles.leaf, { left: -8, top: -14, transform: [{ rotate: '-30deg' }] }]} />
          <View style={[styles.leaf, { right: -8, top: -14, transform: [{ rotate: '30deg' }] }]} />
          <Text style={styles.signText}>‹ LEVEL 16 ›</Text>
        </View>

        {loading && <ActivityIndicator size="large" color="#3a2a12" style={{ marginTop: 40 }} />}

        {!loading && error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryBtn} onPress={load}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {!loading && !error && level && (
          <>
            <View style={styles.banner}>
              <Text style={styles.bannerSub}>{level.subtitle}</Text>
              <Text style={styles.bannerQ}>{level.question}</Text>
            </View>

            <Animated.View style={[styles.sceneCard, { width: sceneW, transform: [{ translateX: shakeX }] }]}>
              <PizzaScene width={sceneW - 8} selected={selected} state={sceneState} />
              <View style={styles.hitRow}>
                {level.options.map((opt: string) => (
                  <Pressable key={opt} style={styles.hit} onPress={() => handlePick(opt)} />
                ))}
              </View>
            </Animated.View>

            {explanation ? (
              <View style={[styles.note, { backgroundColor: '#dff7e4', borderColor: '#35b26a' }]}>
                <Text style={styles.noteTitle}>✅ Correct! It's B</Text>
                <Text style={styles.noteText}>{explanation}</Text>
              </View>
            ) : note ? (
              <View style={styles.note}>
                <Text style={styles.noteText}>💡 {note}</Text>
              </View>
            ) : null}
          </>
        )}
      </View>

      <View style={[styles.bottomBar, { width: W - 28 }]}>
        <View style={styles.actionCol}>
          <Pressable style={[styles.actionBtn, { backgroundColor: '#a6e22e' }]} onPress={handleHint}>
            <Ionicons name="search" size={30} color="#2b2b2b" />
          </Pressable>
          <View style={styles.costPill}>
            <Text style={styles.costText}>💡 {HINT_COST}</Text>
          </View>
        </View>
        <View style={styles.actionCol}>
          <Pressable style={[styles.actionBtn, { backgroundColor: '#f4f1ec' }]} onPress={handleVideo}>
            <Ionicons name="film" size={28} color="#7a4fd0" />
          </Pressable>
          <View style={styles.costPill}>
            <Text style={styles.costText}>🪙 +75</Text>
          </View>
        </View>
        <View style={styles.actionCol}>
          <Pressable style={[styles.actionBtn, { backgroundColor: '#f0475a' }]} onPress={handleSkip}>
            <Ionicons name="play" size={30} color="#2b2b2b" />
          </Pressable>
          <View style={styles.costPill}>
            <Text style={styles.costText}>💡 {SKIP_COST}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#8fd0f7', alignItems: 'center' },
  column: { flex: 1, alignItems: 'center', paddingTop: 30 },

  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  topLeft: { flexDirection: 'row', gap: 8 },
  roundBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ffe27a',
    borderWidth: 2,
    borderColor: '#3a2a12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulbPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  bulbText: { fontSize: 17, fontWeight: '800', color: '#1a2a5a' },

  signWrap: { flexDirection: 'row', height: 18, marginTop: 2, gap: 86 },
  string: { width: 2, height: 18, backgroundColor: '#7a4a1e' },
  sign: {
    backgroundColor: '#a8601f',
    borderRadius: 8,
    paddingHorizontal: 26,
    paddingVertical: 8,
    borderWidth: 3,
    borderColor: '#d98b3d',
  },
  signText: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  leaf: { position: 'absolute', width: 22, height: 14, borderRadius: 10, backgroundColor: '#5cbf3f' },

  banner: {
    marginTop: 14,
    backgroundColor: '#fbf6e9',
    borderRadius: 26,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  bannerSub: { fontSize: 15, color: '#3a4a7a', fontWeight: '600' },
  bannerQ: { fontSize: 19, color: '#10245e', fontWeight: '900', textAlign: 'center', marginTop: 2 },

  sceneCard: {
    marginTop: 16,
    backgroundColor: '#fdf3df',
    borderRadius: 22,
    borderWidth: 4,
    borderColor: '#e9c98a',
    padding: 4,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  // explicit values instead of StyleSheet.absoluteFillObject (not available in newer RN typings)
  hitRow: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row' },
  hit: { flex: 1 },

  note: {
    marginTop: 14,
    marginHorizontal: 18,
    backgroundColor: '#fff8e1',
    borderColor: '#f0c24b',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  noteTitle: { fontSize: 16, fontWeight: '900', color: '#1b6b3a', marginBottom: 2 },
  noteText: { fontSize: 14, fontWeight: '600', color: '#33302a', textAlign: 'center' },

  errorBox: { marginTop: 40, alignItems: 'center', gap: 12 },
  errorText: { color: '#7a1c1c', fontWeight: '700' },
  retryBtn: { backgroundColor: '#ef4444', paddingHorizontal: 22, paddingVertical: 10, borderRadius: 20 },
  retryText: { color: '#fff', fontWeight: '800' },

  bottomBar: {
    position: 'absolute',
    bottom: 18,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#f6e7c8',
    borderWidth: 5,
    borderColor: '#c7dbe8',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 6,
  },
  actionCol: { alignItems: 'center', gap: 6 },
  actionBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  costPill: { backgroundColor: '#6b4423', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 3 },
  costText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});
