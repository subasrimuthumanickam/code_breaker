
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import {
  checkLevel46,
  fetchLevel46,
  fetchLevel46Solution,
  Level46Data,
} from './Btlevel46api';
import { BASE_BOARD_H, BASE_BOARD_W, MatchstickBoard } from './Btlevel46art';

type Status = 'idle' | 'checking' | 'correct' | 'wrong' | 'demo';

interface Props {
  playerId?: number | string;
  hints?: number | string;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onSettings?: () => void;
  onComplete?: (r: { attempts: number; skipped: boolean }) => void;
}

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' });

/* ---------------- background scene (same theme as level 55) ---------------- */
const Cloud: React.FC<{ left?: string; right?: string; top: string; s: number }> = ({
  left,
  right,
  top,
  s,
}) => (
  <View style={{ position: 'absolute', left: left as any, right: right as any, top: top as any }}>
    <View style={{ width: 90 * s, height: 28 * s, borderRadius: 14 * s, backgroundColor: '#fff' }} />
    <View style={[styles.puff, { width: 40 * s, height: 40 * s, left: 14 * s, top: -18 * s }]} />
    <View style={[styles.puff, { width: 30 * s, height: 30 * s, left: 46 * s, top: -12 * s }]} />
  </View>
);

const Scene: React.FC<{ s: number }> = ({ s }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#A9DBF7' }]} />
    <View style={styles.pinkWall} />
    <View style={styles.floor} />

    {/* window */}
    <View style={styles.windowFrame}>
      <View style={styles.windowBarV} />
      <View style={styles.windowBarH} />
      <View style={[styles.hill, { width: 110 * s, height: 110 * s, borderRadius: 55 * s }]} />
    </View>

    <Cloud left="20%" top="6%" s={s * 0.8} />
    <Cloud left="6%" top="17%" s={s * 0.7} />
    <Cloud right="14%" top="13%" s={s * 0.9} />

    {/* sun */}
    <View
      style={[
        styles.sunGlow,
        { width: 130 * s, height: 130 * s, borderRadius: 65 * s },
      ]}
    >
      <View style={{ width: 92 * s, height: 92 * s, borderRadius: 46 * s, backgroundColor: '#FFD84A' }} />
    </View>

    {/* bookshelf (right) */}
    <View style={[styles.shelf, { width: 120 * s, height: 250 * s }]}>
      <View style={styles.shelfTop} />
      <View style={[styles.bear, { width: 46 * s, height: 46 * s, borderRadius: 23 * s }]} />
      <View style={[styles.cup, { width: 28 * s, height: 32 * s }]} />
      <View style={[styles.bookV, { backgroundColor: '#E5457E', left: 62 * s, height: 44 * s }]} />
      <View style={[styles.bookV, { backgroundColor: '#7B54C9', left: 76 * s, height: 50 * s }]} />
      <View style={[styles.shelfMid, { top: 112 * s }]} />
    </View>

    {/* books + car (left) */}
    <View style={[styles.stackBook, { backgroundColor: '#5DC25A', bottom: '27%', width: 130 * s, height: 24 * s }]} />
    <View style={[styles.stackBook, { backgroundColor: '#3E8FF0', bottom: '23%', width: 130 * s, height: 24 * s }]} />
    <View style={[styles.stackBook, { backgroundColor: '#F25AA7', bottom: '19%', width: 130 * s, height: 24 * s }]} />
    <View style={[styles.car, { width: 110 * s, height: 32 * s, borderRadius: 10 * s }]}>
      <View style={[styles.carTop, { left: 22 * s, width: 50 * s, height: 20 * s, top: -15 * s }]} />
    </View>
  </View>
);

/* ---------------- screen ---------------- */
const Btlevel46screen: React.FC<Props> = ({ hints, onExit, onSettings, onComplete }) => {
  const win = useWindowDimensions();
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const W = box?.w ?? win.width;
  const H = box?.h ?? win.height;
  const onLayoutBox = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) setBox({ w: width, h: height });
  };

  const attempts = useRef(0);
  const usedSolution = useRef(false);
  const finished = useRef(false);
  const complete = (skipped: boolean) => {
    if (finished.current) return;
    finished.current = true;
    onComplete && onComplete({ attempts: Math.max(1, attempts.current), skipped });
  };
  const [level, setLevel] = useState<Level46Data | null>(null);
  const [removed, setRemoved] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

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
    fetchLevel46()
      .then(setLevel)
      .catch((e) => setError(e.message || 'Server connect aagala'));
    return () => {
      mounted.current = false;
      clearTimers();
    };
  }, []);

  const verify = useCallback(async (ids: string[]) => {
    setStatus('checking');
    try {
      const res = await checkLevel46(ids);
      if (!mounted.current) return;
      attempts.current += 1;
      if (res.correct) {
        setStatus('correct');
        later(() => complete(false), 1600);
      } else {
        setStatus('wrong');
        later(() => {
          setRemoved([]);
          setStatus('idle');
        }, 1200);
      }
    } catch (e: any) {
      if (!mounted.current) return;
      setError(e.message || 'Server connect aagala');
      setStatus('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = (id: string): boolean => {
    if (!level || status !== 'idle') return false;
    if (removed.includes(id) || removed.length >= level.removeCount) return false;
    const next = [...removed, id];
    setRemoved(next);
    if (next.length === level.removeCount) verify(next);
    return true;
  };

  const undo = () => {
    if (status !== 'idle' || removed.length === 0) return;
    setRemoved((r) => r.slice(0, -1));
  };

  const reset = () => {
    clearTimers();
    setRemoved([]);
    setStatus('idle');
    setError(null);
  };

  const playSolution = async () => {
    if (!level || status === 'demo' || status === 'checking') return;
    clearTimers();
    setRemoved([]);
    setStatus('demo');
    usedSolution.current = true;
    try {
      const ids = await fetchLevel46Solution();
      ids.forEach((id, i) => {
        later(() => {
          setRemoved((prev) => [...prev, id]);
          if (i === ids.length - 1) later(() => setStatus('correct'), 900);
        }, 700 + i * 700);
      });
    } catch (e: any) {
      setError(e.message || 'Server connect aagala');
      setStatus('idle');
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
  const boardLocked = status !== 'idle';

  /* ---------- layout maths: everything derives from the real screen box ---------- */
  const portrait = W < H;
  const s = Math.max(0.7, Math.min(W / 1000, H / 600, 1.3)); // UI scale

  const btn = 56 * s;
  const signW = Math.min(330 * s, W * 0.5);
  const signH = 62 * s;

  const toolbarH = 118 * s;
  const toolbarW = Math.min(portrait ? W * 0.94 : W * 0.66, 980);
  const toolbarBottom = Math.max(8, H * 0.035);
  const toolbarTop = H - toolbarBottom - toolbarH;

  const cardTop = Math.max(signH + 30 * s, H * 0.15);
  const cardW = Math.min(portrait ? W * 0.94 : W * 0.78, 1000);
  const cardH = Math.max(120, toolbarTop - 12 - cardTop);

  const qFont = Math.max(16, Math.min(30, cardW * 0.036, cardH * 0.1));
  const qH = qFont * 1.5 + 14;
  const infoH = 46 * s;
  const innerPad = 10;
  const boardAreaW = cardW - innerPad * 2 - 16;
  const boardAreaH = cardH - innerPad * 2 - qH - infoH - 6;
  const k = Math.max(
    0.3,
    Math.min(boardAreaW / BASE_BOARD_W, boardAreaH / BASE_BOARD_H, 1.5)
  );

  const circle = 64 * s;
  const lineCount = Math.max(3, Math.floor((cardH - qH - 20) / (28 * s)));

  const showError = status === 'idle' && !!error;

  return (
    <View style={styles.root}>
      <Scene s={s} />
      <SafeAreaView style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1 }} onLayout={onLayoutBox}>
          {/* ---------- top bar ---------- */}
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

          {/* ---------- paper card ---------- */}
          <View
            style={[
              styles.abs,
              styles.cardOuter,
              { left: (W - cardW) / 2, top: cardTop, width: cardW, height: cardH, padding: innerPad - 4 },
            ]}
          >
            <View style={styles.card}>
              {Array.from({ length: lineCount }).map((_, i) => (
                <View key={i} style={[styles.line, { top: qH + 6 + i * ((cardH - qH - 30) / lineCount) }]} />
              ))}

              <Text style={[styles.question, { fontSize: qFont, marginTop: 10 }]} numberOfLines={2}>
                {level.question}
              </Text>

              {/* board area */}
              <View style={[styles.boardArea, { top: qH, bottom: infoH }]}>
                <MatchstickBoard
                  sticks={level.sticks}
                  removedIds={removed}
                  onRemove={handleRemove}
                  locked={boardLocked}
                  solved={solved}
                  scale={k}
                />
                {status === 'wrong' && (
                  <View style={styles.wrongPill} pointerEvents="none">
                    <Text style={styles.wrongText}>Wrong! Try again</Text>
                  </View>
                )}
              </View>

              {/* info row */}
              <View style={[styles.infoRow, { height: infoH }]}>
                <Pressable onPress={undo} style={styles.miniBtn}>
                  <Text style={styles.miniBtnText}>Undo</Text>
                </Pressable>
                <Text style={styles.counter} numberOfLines={1}>
                  {showError ? error : `Removed ${removed.length}/${level.removeCount}`}
                  {solved ? '  ✔' : ''}
                </Text>
                <Pressable onPress={reset} style={styles.miniBtn}>
                  <Text style={styles.miniBtnText}>Reset</Text>
                </Pressable>
              </View>

              {solved && usedSolution.current && (
                <Pressable style={styles.nextBtn} onPress={() => complete(true)}>
                  <Text style={styles.nextText}>Next ▶</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* ---------- bottom toolbar ---------- */}
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
                onPress={playSolution}
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

export default Btlevel46screen;

const styles = StyleSheet.create({
  // fixed to the screen: the page can never scroll
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

  /* scene */
  pinkWall: { position: 'absolute', left: 0, right: 0, top: '76%', height: '8%', backgroundColor: '#F7C6D6' },
  floor: { position: 'absolute', left: 0, right: 0, top: '82%', bottom: 0, backgroundColor: '#F2C98A' },
  windowFrame: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '15%',
    height: '56%',
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderColor: '#F0A748',
    overflow: 'hidden',
  },
  windowBarV: { position: 'absolute', left: '30%', top: 0, bottom: 0, width: 8, backgroundColor: '#F0A748' },
  windowBarH: { position: 'absolute', top: '56%', left: 0, right: 0, height: 8, backgroundColor: '#F0A748' },
  hill: { position: 'absolute', bottom: -40, left: 10, backgroundColor: '#5FC66B' },
  puff: { position: 'absolute', backgroundColor: '#fff', borderRadius: 40 },
  sunGlow: {
    position: 'absolute',
    right: '1%',
    top: '9%',
    backgroundColor: 'rgba(255,245,170,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelf: { position: 'absolute', right: 0, bottom: '14%', backgroundColor: '#F4B259', borderTopLeftRadius: 8 },
  shelfTop: { position: 'absolute', top: -8, left: -6, right: 0, height: 10, backgroundColor: '#F7C46E', borderRadius: 4 },
  bear: { position: 'absolute', top: 22, left: 12, backgroundColor: '#8B5E3C' },
  cup: { position: 'absolute', top: 44, left: 62, backgroundColor: '#FFD83B' },
  bookV: { position: 'absolute', top: 34, width: 11 },
  shelfMid: { position: 'absolute', left: 0, right: 0, height: 8, backgroundColor: '#F7C46E' },
  stackBook: { position: 'absolute', left: 0, borderTopRightRadius: 6, borderBottomRightRadius: 6 },
  car: { position: 'absolute', left: 0, bottom: '9%', backgroundColor: '#3E8FF0' },
  carTop: { position: 'absolute', backgroundColor: '#2D7BE0', borderRadius: 8 },

  /* top bar */
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

  /* card */
  cardOuter: {
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#BFDDF7',
    backgroundColor: 'rgba(191,221,247,0.55)',
  },
  card: { flex: 1, backgroundColor: '#FBF1DD', borderRadius: 28, alignItems: 'center', overflow: 'hidden' },
  line: { position: 'absolute', left: 18, right: 18, height: 1.5, backgroundColor: '#D6E4F2' },
  question: { fontFamily: SERIF, fontStyle: 'italic', color: '#1E3A8A', textAlign: 'center', paddingHorizontal: 12 },
  boardArea: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  wrongPill: {
    position: 'absolute',
    bottom: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
  },
  wrongText: { fontSize: 16, fontWeight: '800', color: '#D32F2F' },
  infoRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  counter: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: '800',
    marginHorizontal: 6,
  },
  miniBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#BFDDF7',
  },
  miniBtnText: { fontSize: 14, fontWeight: '800', color: '#1E3A8A' },
  nextBtn: {
    position: 'absolute',
    top: 10,
    right: 14,
    backgroundColor: '#8BE08B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#10245e',
  },
  nextText: { fontSize: 15, fontWeight: '800', color: '#10245e' },

  /* toolbar */
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