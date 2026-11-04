import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { checkLevel48, fetchLevel48, fetchLevel48Hint, Level48Data } from './Btlevel48api';
import { Counter, RectFigure, Scene } from './Btlevel48art';

type Status = 'idle' | 'checking' | 'correct' | 'wrong';

interface Props {
  playerId?: number | string;
  hints?: number | string;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onSettings?: () => void;
  onComplete?: (r: { attempts: number; skipped: boolean }) => void;
}

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' });

const Btlevel48screen: React.FC<Props> = ({ hints, onExit, onSettings, onComplete }) => {
  const win = useWindowDimensions();
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const W = box?.w ?? win.width;
  const H = box?.h ?? win.height;
  const onLayoutBox = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) setBox({ w: width, h: height });
  };

  const wrongCount = useRef(0);
  const finished = useRef(false);
  const complete = (skipped: boolean) => {
    if (finished.current) return;
    finished.current = true;
    onComplete &&
      onComplete({ attempts: Math.max(1, wrongCount.current + (skipped ? 0 : 1)), skipped });
  };

  const [level, setLevel] = useState<Level48Data | null>(null);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mounted = useRef(true);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    mounted.current = true;
    fetchLevel48()
      .then(setLevel)
      .catch((e) => setError(e.message || 'Server connect aagala'));
    return () => {
      mounted.current = false;
      clearTimers();
    };
  }, []);

  const submit = async () => {
    if (!level || status !== 'idle') return;
    setError(null);
    setMsg('');
    setStatus('checking');
    try {
      const res = await checkLevel48(count);
      if (!mounted.current) return;
      if (res.correct) {
        setStatus('correct');
        later(() => complete(false), 1400);
      } else {
        wrongCount.current += 1;
        setStatus('wrong');
        later(() => setStatus('idle'), 900);
      }
    } catch (e: any) {
      if (!mounted.current) return;
      setError(e.message || 'Server connect aagala');
      setStatus('idle');
    }
  };

  const showHint = async () => {
    if (!level || status !== 'idle') return;
    try {
      const h = await fetchLevel48Hint();
      if (mounted.current) {
        setError(null);
        setMsg(h);
      }
    } catch (e: any) {
      if (mounted.current) setError(e.message || 'Server connect aagala');
    }
  };

  if (error && !level) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </SafeAreaView>
      </View>
    );
  }
  if (!level) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.center}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </View>
    );
  }

  const solved = status === 'correct';
  const wrong = status === 'wrong';
  const locked = status !== 'idle';

  /* ---------- layout maths ---------- */
  const portrait = W < H;
  const s = Math.max(0.7, Math.min(W / 1000, H / 600, 1.3));

  const btn = 56 * s;
  const signW = Math.min(330 * s, W * 0.5);
  const signH = 62 * s;

  const toolbarH = 118 * s;
  const toolbarW = Math.min(portrait ? W * 0.94 : W * 0.66, 980);
  const toolbarBottom = Math.max(8, H * 0.035);
  const toolbarTop = H - toolbarBottom - toolbarH;

  const cardTop = Math.max(signH + 30 * s, H * 0.15);
  const cardW = Math.min(portrait ? W * 0.94 : W * 0.78, 1000);
  const cardH = Math.max(160, toolbarTop - 12 - cardTop);

  const qFont = Math.max(16, Math.min(30, cardW * 0.05, cardH * 0.1));
  const qH = qFont * 1.5 + 14;
  const ctrlH = 130 * s + 30; // counter + submit + message line
  const maxFigH = Math.max(60, cardH - qH - ctrlH - 20);
  const figW = Math.max(120, Math.min(cardW * 0.72, (maxFigH * 360) / 210));
  const circle = 64 * s;

  const infoText = error ? error : wrong ? 'Wrong! Try again' : solved ? 'Correct! ✔' : msg;

  return (
    <View style={styles.root}>
      <Scene s={s} />
      <SafeAreaView style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1 }} onLayout={onLayoutBox}>
          {/* top bar */}
          <View style={[styles.abs, { left: 14, top: 10, flexDirection: 'row' }]}>
            {onExit ? (
              <Pressable onPress={onExit} style={[styles.roundBtn, { width: btn, height: btn, borderRadius: btn / 2 }]}>
                <Text style={{ fontSize: 24 * s }}>🏠</Text>
              </Pressable>
            ) : (
              <View style={[styles.roundBtn, { width: btn, height: btn, borderRadius: btn / 2 }]} />
            )}
            <Pressable
              onPress={onSettings}
              style={[styles.roundBtn, { width: btn, height: btn, borderRadius: btn / 2, marginLeft: 10 }]}
            >
              <Text style={{ fontSize: 24 * s }}>⚙️</Text>
            </Pressable>
          </View>

          {/* hanging sign */}
          <View style={[styles.abs, { left: (W - signW) / 2, top: 0, width: signW, alignItems: 'center' }]}>
            <View style={[styles.rope, { left: signW * 0.2 }]} />
            <View style={[styles.rope, { right: signW * 0.2 }]} />
            <View style={[styles.sign, { width: signW, height: signH, marginTop: 20 * s }]}>
              <View style={[styles.leaf, { left: -10, transform: [{ rotate: '-35deg' }] }]} />
              <View style={[styles.leaf, { right: -10, transform: [{ rotate: '35deg' }] }]} />
              <Text style={[styles.signArrow, { fontSize: 32 * s }]}>‹</Text>
              <Text style={[styles.signText, { fontSize: 30 * s }]} numberOfLines={1}>
                LEVEL {level.id}
              </Text>
              <Text style={[styles.signArrow, { fontSize: 32 * s }]}>›</Text>
            </View>
          </View>

          {/* hint pill */}
          <View
            style={[
              styles.abs,
              styles.hintPill,
              { right: 14, top: 12, height: 46 * s, minWidth: 96 * s, borderRadius: 23 * s },
            ]}
          >
            <Text style={[styles.hintText, { fontSize: 22 * s }]}>{String(hints ?? '0')}</Text>
            <Text style={{ fontSize: 20 * s }}>💡</Text>
          </View>

          {/* paper card */}
          <View
            style={[
              styles.abs,
              styles.cardOuter,
              { left: (W - cardW) / 2, top: cardTop, width: cardW, height: cardH, padding: 6 },
            ]}
          >
            <View style={styles.card}>
              <Text style={[styles.question, { fontSize: qFont, marginTop: 10 }]} numberOfLines={2}>
                {level.question}
              </Text>

              <View style={styles.figureWrap}>
                <RectFigure width={figW} />
              </View>

              <Counter
                value={count}
                onMinus={() => setCount((c) => Math.max(0, c - 1))}
                onPlus={() => setCount((c) => Math.min(99, c + 1))}
                onSubmit={submit}
                locked={locked}
                correct={solved}
                wrong={wrong}
                s={s}
              />

              <Text
                style={[
                  styles.info,
                  wrong && { color: '#D32F2F' },
                  solved && { color: '#2E9B3E' },
                  !!error && { color: '#D32F2F' },
                ]}
                numberOfLines={2}
              >
                {infoText || ' '}
              </Text>
            </View>
          </View>

          {/* bottom toolbar */}
          <View
            style={[
              styles.abs,
              styles.toolbar,
              { left: (W - toolbarW) / 2, top: toolbarTop, width: toolbarW, height: toolbarH },
            ]}
          >
            <View style={styles.tool}>
              <Text style={[styles.toolLabel, { fontSize: 15 * s }]}>💡 x25</Text>
              <Pressable
                onPress={showHint}
                style={[styles.toolCircle, { width: circle, height: circle, borderRadius: circle / 2, backgroundColor: '#BFE3FA' }]}
              >
                <Text style={{ fontSize: 28 * s }}>🔍</Text>
              </Pressable>
            </View>
            <View style={styles.tool}>
              <Text style={[styles.toolLabel, { fontSize: 15 * s }]}> </Text>
              <Pressable style={{ width: circle, height: circle, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 32 * s }}>🎁</Text>
              </Pressable>
            </View>
            <View style={styles.tool}>
              <Text style={[styles.toolLabel, { fontSize: 15 * s }]}>💡 +75</Text>
              <Pressable style={{ width: circle, height: circle, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 32 * s }}>🎬</Text>
              </Pressable>
            </View>
            <View style={styles.tool}>
              <Text style={[styles.toolLabel, { fontSize: 15 * s }]}>💡 +50</Text>
              <Pressable
                onPress={() => complete(true)}
                style={[styles.toolCircle, { width: circle, height: circle, borderRadius: circle / 2, backgroundColor: '#FFC2CF' }]}
              >
                <Text style={{ fontSize: 28 * s }}>⏭</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Btlevel48screen;

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    backgroundColor: '#A9DBF7',
  },
  abs: { position: 'absolute' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#B00020', fontSize: 16 },

  roundBtn: {
    backgroundColor: '#FFE23B',
    borderWidth: 3,
    borderColor: '#10245e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rope: { position: 'absolute', top: 0, width: 3, height: 28, backgroundColor: '#6b4a2b' },
  sign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C9801F',
    borderWidth: 3,
    borderColor: '#E8A23A',
    borderRadius: 6,
  },
  leaf: { position: 'absolute', top: -14, width: 26, height: 14, borderRadius: 8, backgroundColor: '#5FC66B' },
  signArrow: { color: '#FFE23B', fontWeight: '900', marginHorizontal: 6, marginTop: -4 },
  signText: { color: '#fff', fontWeight: '900', letterSpacing: 1 },
  hintPill: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 3,
    borderColor: '#BFDDF7',
  },
  hintText: { fontWeight: '900', color: '#10245e', marginRight: 8 },

  cardOuter: {
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#BFDDF7',
    backgroundColor: 'rgba(191,221,247,0.55)',
  },
  card: { flex: 1, backgroundColor: '#FBF1DD', borderRadius: 28, alignItems: 'center', overflow: 'hidden' },
  question: { fontFamily: SERIF, fontStyle: 'italic', color: '#1E3A8A', textAlign: 'center', paddingHorizontal: 12 },
  figureWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  info: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E3A8A',
    textAlign: 'center',
    paddingHorizontal: 14,
    marginTop: 6,
    marginBottom: 8,
    minHeight: 20,
  },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: '#FBF1DD',
    borderWidth: 4,
    borderColor: '#BFDDF7',
    borderRadius: 44,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  tool: { alignItems: 'center' },
  toolLabel: { fontWeight: '900', color: '#10245e', marginBottom: 2 },
  toolCircle: {
    borderWidth: 3,
    borderColor: '#10245e',
    alignItems: 'center',
    justifyContent: 'center',
  },
});