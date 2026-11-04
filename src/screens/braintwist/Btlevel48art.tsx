
import React, { useRef } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

/* ---------------- background scene (same theme as level 46 / 47) ---------------- */
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

export const Scene: React.FC<{ s: number }> = ({ s }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#A9DBF7' }]} />
    <View style={styles.pinkWall} />
    <View style={styles.floor} />

    <View style={styles.windowFrame}>
      <View style={styles.windowBarV} />
      <View style={styles.windowBarH} />
      <View style={[styles.hill, { width: 110 * s, height: 110 * s, borderRadius: 55 * s }]} />
    </View>

    <Cloud left="20%" top="6%" s={s * 0.8} />
    <Cloud left="6%" top="17%" s={s * 0.7} />
    <Cloud right="14%" top="13%" s={s * 0.9} />

    <View style={[styles.sunGlow, { width: 130 * s, height: 130 * s, borderRadius: 65 * s }]}>
      <View style={{ width: 92 * s, height: 92 * s, borderRadius: 46 * s, backgroundColor: '#FFD84A' }} />
    </View>

    <View style={[styles.shelf, { width: 120 * s, height: 250 * s }]}>
      <View style={styles.shelfTop} />
      <View style={[styles.bear, { width: 46 * s, height: 46 * s, borderRadius: 23 * s }]} />
      <View style={[styles.cup, { width: 28 * s, height: 32 * s }]} />
      <View style={[styles.bookV, { backgroundColor: '#E5457E', left: 62 * s, height: 44 * s }]} />
      <View style={[styles.bookV, { backgroundColor: '#7B54C9', left: 76 * s, height: 50 * s }]} />
      <View style={[styles.shelfMid, { top: 112 * s }]} />
    </View>

    <View style={[styles.stackBook, { backgroundColor: '#5DC25A', bottom: '27%', width: 130 * s, height: 24 * s }]} />
    <View style={[styles.stackBook, { backgroundColor: '#3E8FF0', bottom: '23%', width: 130 * s, height: 24 * s }]} />
    <View style={[styles.stackBook, { backgroundColor: '#F25AA7', bottom: '19%', width: 130 * s, height: 24 * s }]} />
    <View style={[styles.car, { width: 110 * s, height: 32 * s, borderRadius: 10 * s }]}>
      <View style={[styles.carTop, { left: 22 * s, width: 50 * s, height: 20 * s, top: -15 * s }]} />
    </View>
  </View>
);

/* ---------------- draggable rectangles ---------------- */
// design space 360 x 210 (scaled to `width`)
// outer box, A (left), B (lower right), C (top right)  -> 4 rectangles, each can be dragged
const RECTS = [
  { id: 'outer', x: 4, y: 4, w: 348, h: 196 },
  { id: 'A', x: 47, y: 32, w: 208, h: 113 },
  { id: 'B', x: 109, y: 60, w: 208, h: 112 },
  { id: 'C', x: 200, y: 4, w: 152, h: 85 },
];

const DragRect: React.FC<{
  k: number;
  r: { id: string; x: number; y: number; w: number; h: number };
}> = ({ k, r }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  return (
    <Animated.View
      {...responder.panHandlers}
      style={{
        position: 'absolute',
        left: r.x * k,
        top: r.y * k,
        width: r.w * k,
        height: r.h * k,
        borderWidth: 4,
        borderColor: '#111',
        backgroundColor: 'rgba(255,255,255,0.01)',
        transform: pan.getTranslateTransform(),
      }}
    />
  );
};

export const RectFigure: React.FC<{ width: number }> = ({ width }) => {
  const k = width / 360;
  const height = 210 * k;
  return (
    <View style={{ width, height }}>
      {RECTS.map((r) => (
        <DragRect key={r.id} k={k} r={r} />
      ))}
    </View>
  );
};

/* ---------------- counter  ( - 0 + )  and SUBMIT ---------------- */
interface CounterProps {
  value: number;
  onMinus: () => void;
  onPlus: () => void;
  onSubmit: () => void;
  locked: boolean;
  correct: boolean;
  wrong: boolean;
  s: number;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  onMinus,
  onPlus,
  onSubmit,
  locked,
  correct,
  wrong,
  s,
}) => {
  const b = 40 * s;
  const numColor = correct ? '#2E9B3E' : wrong ? '#D32F2F' : '#10245e';
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.counterRow}>
        <Pressable
          disabled={locked}
          onPress={onMinus}
          style={[styles.cBtn, { width: b, height: b, borderRadius: b / 2 }]}
        >
          <Text style={[styles.cBtnText, { fontSize: 28 * s }]}>−</Text>
        </Pressable>
        <View style={{ minWidth: 70 * s, alignItems: 'center' }}>
          <Text style={[styles.cNum, { fontSize: 44 * s, color: numColor }]}>{value}</Text>
        </View>
        <Pressable
          disabled={locked}
          onPress={onPlus}
          style={[styles.cBtn, { width: b, height: b, borderRadius: b / 2 }]}
        >
          <Text style={[styles.cBtnText, { fontSize: 28 * s }]}>+</Text>
        </Pressable>
      </View>
      <Pressable
        disabled={locked}
        onPress={onSubmit}
        style={[styles.submit, { paddingHorizontal: 30 * s, paddingVertical: 8 * s, opacity: locked ? 0.7 : 1 }]}
      >
        <Text style={[styles.submitText, { fontSize: 20 * s }]}>SUBMIT</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
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

  /* counter */
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  cBtn: {
    backgroundColor: '#5BB4EC',
    borderWidth: 2.5,
    borderColor: '#10245e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cBtnText: { color: '#10245e', fontWeight: '900', includeFontPadding: false },
  cNum: { fontWeight: '900', fontStyle: 'italic' },
  submit: {
    marginTop: 6,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#10245e',
    borderRadius: 20,
  },
  submitText: { fontWeight: '900', color: '#10245e', letterSpacing: 0.5 },
});