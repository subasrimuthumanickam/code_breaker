
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
import { Level16Background, Placements, PuzzleBoard, SceneState } from './Btlevel16art';
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
const NAVY = '#10245e';
const INK = '#3a2a12';
const YELLOW = '#ffc21a';

const EMPTY: Placements = { red: null, green: null, cyan: null };

export default function Btlevel16screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
  const { width } = useWindowDimensions();
  const W = Math.min(width, 450);
  const panelW = W - 24;
  const sceneW = panelW - 40;

  const [level, setLevel] = useState<Level16Data | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [placements, setPlacements] = useState<Placements>(EMPTY);
  const [sceneState, setSceneState] = useState<SceneState>('idle');
  const [locked, setLocked] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [clues, setClues] = useState<string[]>([]);
  const [showClues, setShowClues] = useState(false);

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
      setClues(d.clues ?? []);
      if (typeof d.hints === 'number') setHints?.(d.hints);
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

  /* ---------- puzzle (drag & drop) ---------- */

  const submit = async (next: Placements) => {
    if (!sessionId) return;
    setLocked(true);
    try {
      const r = await answerLevel16(playerId, sessionId, next as Record<string, string>);
      if (r.correct) {
        setSceneState('right');
        setExplanation(r.explanation);
        later(() => onComplete?.({ ...r, skipped: false }), 2400);
      } else {
        setSceneState('wrong');
        runShake();
        if (r.message) flash(r.message);
        later(() => {
          setPlacements(EMPTY);
          setSceneState('idle');
          setLocked(false);
        }, 1000);
      }
    } catch (e: any) {
      flash('Network error');
      setPlacements(EMPTY);
      setLocked(false);
    }
  };

  // an object was dropped: into a frame (frameId) or back outside (null)
  const handleDrop = (pieceId: string, frameId: string | null) => {
    if (locked) return;
    const next = { ...placements, [pieceId]: frameId };
    setPlacements(next);
    if (Object.values(next).every(Boolean)) submit(next);
  };

  /* ---------- bottom buttons ---------- */

  // each tap buys the next clue (25 hints); when all clues are bought it just opens the list
  const handleHint = async () => {
    if (!sessionId || locked) return;
    const total = level?.hintCount ?? 3;
    if (clues.filter(Boolean).length >= total) {
      setShowClues(true);
      return;
    }
    if (hints < HINT_COST) {
      flash('Not enough hints');
      return;
    }
    try {
      const r = await hintLevel16(playerId, sessionId);
      setClues((prev) => {
        const copy = [...prev];
        copy[r.hint.number - 1] = r.hint.text;
        return copy;
      });
      setHints?.(r.hints);
      setShowClues(true);
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
  const shownClues = clues.map((text, i) => ({ text, n: i + 1 })).filter((c) => !!c.text);

  return (
    <View style={styles.root}>
      <Level16Background />

      <View style={[styles.column, { width: W }]}>
        {/* top bar */}
        <View style={styles.topBar}>
          <View style={styles.topLeft}>
            <Pressable style={styles.roundBtn} onPress={onExit}>
              <Ionicons name="home" size={18} color={INK} />
            </Pressable>
            <Pressable style={styles.roundBtn}>
              <Ionicons name="settings-sharp" size={18} color={INK} />
            </Pressable>
          </View>
          <View style={styles.bulbPill}>
            <Text style={styles.bulbText}>{hints}</Text>
            <Text style={{ fontSize: 20 }}>💡</Text>
          </View>
        </View>

        {/* hanging sign */}
        <View style={styles.signWrap}>
          <View style={styles.string} />
          <View style={styles.string} />
        </View>
        <View style={styles.sign}>
          <View style={[styles.leaf, { left: -8, top: -14, transform: [{ rotate: '-30deg' }] }]} />
          <View style={[styles.leaf, { right: -8, top: -14, transform: [{ rotate: '30deg' }] }]} />
          <Text style={styles.signText}>
            <Text style={styles.signArrow}>‹ </Text>LEVEL 16<Text style={styles.signArrow}> ›</Text>
          </Text>
        </View>

        {loading && <ActivityIndicator size="large" color={INK} style={{ marginTop: 40 }} />}

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
            {/* notebook panel */}
            <View style={[styles.panel, { width: panelW }]}>
              <View style={styles.rings}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <View key={i} style={styles.ring} />
                ))}
              </View>

              <View style={styles.paper}>
                {/* faint ruled lines */}
                <View style={styles.lines} pointerEvents="none">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <View key={i} style={styles.line} />
                  ))}
                </View>

                <View style={styles.banner}>
                  <Text style={styles.arrow}>‹</Text>
                  <View style={styles.bannerPill}>
                    <Text style={styles.bannerQ}>{level.question}</Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </View>

                <Animated.View style={{ transform: [{ translateX: shakeX }], marginTop: 6 }}>
                  <PuzzleBoard
                    width={sceneW}
                    placements={placements}
                    state={sceneState}
                    disabled={locked}
                    onDrop={handleDrop}
                  />
                </Animated.View>

                {explanation ? (
                  <View style={[styles.note, { backgroundColor: '#dff7e4', borderColor: '#35b26a' }]}>
                    <Text style={styles.noteTitle}>✅ Correct!</Text>
                    <Text style={styles.noteText}>{explanation}</Text>
                  </View>
                ) : note ? (
                  <View style={styles.note}>
                    <Text style={styles.noteText}>💡 {note}</Text>
                  </View>
                ) : (
                  <Text style={styles.tip}>{level.subtitle}</Text>
                )}
              </View>
            </View>
          </>
        )}
      </View>

      {/* action buttons on the floor mat, outside the notebook */}
      <View style={[styles.mat, { width: W - 28 }]}>
        <View style={styles.actionCol}>
          <Text style={styles.costText}>💡 x{HINT_COST}</Text>
          <Pressable style={[styles.actionBtn, { backgroundColor: '#8fe6f7' }]} onPress={handleHint}>
            <Ionicons name="search" size={30} color="#1b1b1b" />
          </Pressable>
        </View>
        <View style={styles.actionCol}>
          <Text style={styles.costText}>💡 +75</Text>
          <Pressable style={[styles.actionBtn, { backgroundColor: '#f4d9ff' }]} onPress={handleVideo}>
            <Ionicons name="film" size={28} color="#b13fd8" />
          </Pressable>
        </View>
        <View style={styles.actionCol}>
          <Text style={styles.costText}>💡 x{SKIP_COST}</Text>
          <Pressable style={[styles.actionBtn, { backgroundColor: '#ff8f9a' }]} onPress={handleSkip}>
            <Ionicons name="play-forward" size={30} color="#1b1b1b" />
          </Pressable>
        </View>
      </View>

      {/* clues modal */}
      {showClues && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.mTitle}>HINTS</Text>
            <Pressable style={styles.mClose} onPress={() => setShowClues(false)}>
              <Text style={styles.mCloseX}>✕</Text>
            </Pressable>
            {shownClues.map((c) => (
              <View key={c.n} style={[styles.clueCard, { marginTop: c.n === 1 ? 0 : 10 }]}>
                <View style={styles.clueNum}>
                  <Text style={styles.clueNumT}>{c.n}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clueHead}>Hint {c.n}</Text>
                  <Text style={styles.clueBody}>{c.text}</Text>
                </View>
              </View>
            ))}
            {level && shownClues.length < level.hintCount && (
              <Text style={styles.mFoot}>Tap the 🔍 button for the next hint ({HINT_COST} 💡)</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#b3d6f0', alignItems: 'center' },
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffe14d',
    borderWidth: 2,
    borderColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulbPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  bulbText: { fontSize: 20, fontWeight: '900', color: '#1a2a5a' },

  signWrap: { flexDirection: 'row', height: 16, marginTop: 0, gap: 120 },
  string: { width: 3, height: 16, backgroundColor: '#7a4a1e' },
  sign: {
    backgroundColor: '#c8741f',
    borderRadius: 8,
    paddingHorizontal: 28,
    paddingVertical: 6,
    borderWidth: 3,
    borderColor: '#e39a47',
  },
  signText: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  signArrow: { color: YELLOW },
  leaf: { position: 'absolute', width: 24, height: 15, borderRadius: 10, backgroundColor: '#3fd13f' },

  /* notebook panel */
  panel: {
    marginTop: 14,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 4,
    borderColor: '#a9d6f5',
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  rings: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 12, marginBottom: 6 },
  ring: { width: 12, height: 16, borderRadius: 6, backgroundColor: '#8ec8f2' },

  paper: {
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#8ec8f2',
    backgroundColor: '#fbfdff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  lines: { position: 'absolute', left: 0, right: 0, top: 70, bottom: 0 },
  line: { height: 1, backgroundColor: '#dbeaf7', marginBottom: 22 },

  banner: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arrow: { fontSize: 38, fontWeight: '900', color: YELLOW, width: 24, textAlign: 'center', marginTop: -6 },
  bannerPill: {
    flex: 1,
    backgroundColor: '#fbf0e3',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
  },
  bannerQ: { fontSize: 17, color: '#1c3f9a', fontWeight: '700', fontStyle: 'italic', textAlign: 'center' },

  tip: { marginTop: 4, fontSize: 13, fontWeight: '700', color: '#6a7ea8' },

  note: {
    marginTop: 8,
    marginHorizontal: 6,
    backgroundColor: '#fff8e1',
    borderColor: '#f0c24b',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  noteTitle: { fontSize: 16, fontWeight: '900', color: '#1b6b3a', marginBottom: 2, textAlign: 'center' },
  noteText: { fontSize: 14, fontWeight: '600', color: '#33302a', textAlign: 'center' },

  // floor mat under the notebook: hint / video / skip buttons
  mat: {
    position: 'absolute',
    bottom: 18,
    height: 122,
    borderRadius: 61,
    backgroundColor: '#f6e7c8',
    borderWidth: 5,
    borderColor: '#c7dbe8',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionCol: { alignItems: 'center', gap: 4 },
  costText: { fontSize: 16, fontWeight: '900', color: '#1a1a1a' },
  actionBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  errorBox: { marginTop: 40, alignItems: 'center', gap: 12 },
  errorText: { color: '#7a1c1c', fontWeight: '700' },
  retryBtn: { backgroundColor: '#ef4444', paddingHorizontal: 22, paddingVertical: 10, borderRadius: 20 },
  retryText: { color: '#fff', fontWeight: '800' },

  /* clues modal */
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(16,36,94,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    elevation: 50,
    paddingHorizontal: 16,
  },
  modal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fbf1de',
    borderWidth: 5,
    borderColor: '#e8912d',
    borderRadius: 28,
    padding: 18,
    paddingTop: 16,
  },
  mTitle: { fontSize: 26, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
  mClose: {
    position: 'absolute',
    right: -6,
    top: -6,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffe27a',
    borderWidth: 3,
    borderColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mCloseX: { fontSize: 18, fontWeight: 'bold', color: '#e0453a' },
  mFoot: { marginTop: 12, textAlign: 'center', fontSize: 13, fontWeight: '700', color: '#7a5a2a' },
  clueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fdf6e8',
    borderWidth: 2,
    borderColor: '#4cc46a',
    borderRadius: 22,
    padding: 12,
  },
  clueNum: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#c26a22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clueNumT: { fontSize: 24, fontWeight: '900', color: '#fff' },
  clueHead: { fontSize: 17, fontWeight: '900', color: '#c26a22' },
  clueBody: { fontSize: 15, fontStyle: 'italic', color: NAVY, marginTop: 2 },
});
