
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';

// A stick is a line from (x1,y1) to (x2,y2) inside its shape box. Red head is at (x2,y2).
export interface Stick {
  id: string;
  shape?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}
interface Geo {
  id: string;
  shape: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const SHAPE = 150;
const GAP = 40;
const THICK = 9;
const PAD = 26;
const SHAPES = 3;
const REMOVE_DISTANCE = 50;

export const BASE_BOARD_W = SHAPES * SHAPE + (SHAPES - 1) * GAP + PAD * 2;
export const BASE_BOARD_H = SHAPE + PAD * 2;
export const boardSize = (k: number) => ({ width: BASE_BOARD_W * k, height: BASE_BOARD_H * k });

/* ---------- fixed layout = level 55 reference picture (15 sticks) ---------- */
const S = SHAPE;
const Hs = (id: string, shape: number, x1: number, x2: number, y: number): Geo => ({
  id, shape, x1, y1: y, x2, y2: y, // horizontal, head on the right
});
const Vs = (id: string, shape: number, x: number): Geo => ({
  id, shape, x1: x, y1: S, x2: x, y2: 0, // vertical, head on top
});

export const LAYOUT: Geo[] = [
  // shape 0: top, bottom + 3 verticals
  Hs('s0_top', 0, 0, S, 0),
  Hs('s0_bot', 0, 0, S, S),
  Vs('s0_l', 0, 0),
  Vs('s0_m', 0, S / 2),
  Vs('s0_r', 0, S),
  // shape 1: top, middle (sticks out both sides), bottom + 2 verticals
  Hs('s1_top', 1, 0, S, 0),
  Hs('s1_mid', 1, -6, S + 14, S / 2),
  Hs('s1_bot', 1, 0, S, S),
  Vs('s1_l', 1, 0),
  Vs('s1_r', 1, S),
  // shape 2: top, bottom, 2 verticals + diagonal (top-left head)
  Hs('s2_top', 2, 0, S, 0),
  Hs('s2_bot', 2, 0, S, S),
  Vs('s2_l', 2, 0),
  Vs('s2_r', 2, S),
  { id: 's2_diag', shape: 2, x1: S, y1: S, x2: 0, y2: 0 },
];

const WOOD = { fill: '#E39A4B', edge: '#8E4A1E', spot: 'rgba(125,62,20,0.75)', shine: 'rgba(255,222,176,0.65)' };
const WOOD_OK = { fill: '#8FD17F', edge: '#3F8A33', spot: 'rgba(30,100,30,0.5)', shine: 'rgba(235,255,225,0.65)' };
const HEAD = { fill: '#EA2434', edge: '#A8101E', shine: 'rgba(255,255,255,0.5)' };

const makeRng = (id: string) => {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h |= 0;
  if (h === 0) h = 1;
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
};

interface StickViewProps {
  stick: Geo;
  k: number;
  removed: boolean;
  locked: boolean;
  solved: boolean;
  onRemove: (id: string) => boolean;
}

const StickView: React.FC<StickViewProps> = ({ stick, k, removed, locked, solved, onRemove }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [dragging, setDragging] = useState(false);

  const live = useRef({ removed, locked, onRemove, k });
  live.current = { removed, locked, onRemove, k };

  const springBack = () =>
    Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !live.current.removed && !live.current.locked,
      onMoveShouldSetPanResponder: () => !live.current.removed && !live.current.locked,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        pan.stopAnimation();
        setDragging(true);
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        setDragging(false);
        const far = Math.hypot(g.dx, g.dy) > REMOVE_DISTANCE;
        if (far && live.current.onRemove(stick.id)) return;
        springBack();
      },
      onPanResponderTerminate: () => {
        setDragging(false);
        springBack();
      },
    })
  ).current;

  useEffect(() => {
    if (removed) {
      Animated.parallel([
        Animated.timing(pan, {
          toValue: { x: (stick.shape - 1) * 50, y: 260 * live.current.k },
          duration: 450,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, { toValue: 0, duration: 450, useNativeDriver: false }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: false }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removed]);

  const spots = useMemo(() => {
    const r = makeRng(stick.id);
    return [0, 1, 2, 3].map((i) => ({
      t: 0.14 + (i + r() * 0.5) * 0.17,
      off: 0.12 + r() * 0.3,
      a: 0.05 + r() * 0.08,
      c: 0.2 + r() * 0.25,
    }));
  }, [stick.id]);

  const palette = solved ? WOOD_OK : WOOD;
  const thick = THICK * k;
  const bw = Math.max(1, 1.5 * k);

  const dx = stick.x2 - stick.x1;
  const dy = stick.y2 - stick.y1;
  const len = Math.hypot(dx, dy) * k + thick * 1.1;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const ox = PAD + stick.shape * (SHAPE + GAP);
  const cx = (ox + (stick.x1 + stick.x2) / 2) * k;
  const cy = (PAD + (stick.y1 + stick.y2) / 2) * k;

  const headLen = thick * 2.1;
  const headWid = thick * 1.7;
  const protrude = thick * 0.65;

  return (
    <Animated.View
      {...responder.panHandlers}
      hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
      style={[
        styles.abs,
        {
          left: cx - len / 2,
          top: cy - thick / 2,
          width: len,
          height: thick,
          opacity,
          zIndex: dragging ? 20 : removed ? 0 : 2,
          transform: [...pan.getTranslateTransform(), { rotate: `${angle}deg` }],
        },
        { userSelect: 'none', touchAction: 'none' } as any,
      ]}
    >
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { borderRadius: thick * 0.45, backgroundColor: palette.fill, borderWidth: bw, borderColor: palette.edge },
        ]}
      />
      <View
        style={[
          styles.abs,
          { left: len * 0.06, right: len * 0.06, top: thick * 0.16, height: thick * 0.2, backgroundColor: palette.shine, borderRadius: thick * 0.15 },
        ]}
      />
      {spots.map((s, i) => {
        const along = len * s.a;
        const across = thick * s.c;
        return (
          <View
            key={i}
            style={[
              styles.abs,
              { left: len * s.t - along / 2, top: thick * s.off, width: along, height: across, backgroundColor: palette.spot, borderRadius: Math.min(along, across) / 2 },
            ]}
          />
        );
      })}
      <View
        style={[
          styles.abs,
          {
            left: len + protrude - headLen,
            top: (thick - headWid) / 2,
            width: headLen,
            height: headWid,
            backgroundColor: HEAD.fill,
            borderWidth: Math.max(1, 1.2 * k),
            borderColor: HEAD.edge,
            borderRadius: headWid / 2,
          },
        ]}
      >
        <View
          style={[
            styles.abs,
            { left: headLen * 0.2, top: headWid * 0.14, width: headLen * 0.32, height: headWid * 0.22, backgroundColor: HEAD.shine, borderRadius: thick * 0.2 },
          ]}
        />
      </View>
    </Animated.View>
  );
};

interface BoardProps {
  sticks?: Stick[]; // ignored: layout is fixed in LAYOUT (kept so the screen needs no change)
  removedIds: string[];
  onRemove: (id: string) => boolean;
  locked?: boolean;
  solved?: boolean;
  scale?: number;
}

export const MatchstickBoard: React.FC<BoardProps> = ({
  removedIds,
  onRemove,
  locked = false,
  solved = false,
  scale = 1,
}) => {
  const size = boardSize(scale);
  return (
    <View style={{ width: size.width, height: size.height }}>
      {LAYOUT.map((s) => {
        const isRemoved = removedIds.includes(s.id);
        return (
          <StickView
            key={s.id}
            stick={s}
            k={scale}
            removed={isRemoved}
            locked={locked}
            solved={solved && !isRemoved}
            onRemove={onRemove}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  abs: { position: 'absolute' },
});