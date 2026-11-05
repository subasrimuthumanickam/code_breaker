
import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
} from 'react-native-svg';

/* ───────────────────────── Background (kid room, striped wall) ───────────────────────── */

export function Level16Background() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 450 800" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="wall16" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#8fd0f7" />
            <Stop offset="1" stopColor="#bfe4f7" />
          </LinearGradient>
        </Defs>

        {/* striped wall */}
        <Rect x={0} y={0} width={450} height={800} fill="url(#wall16)" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Rect key={i} x={i * 56 + 20} y={0} width={28} height={800} fill="#ffffff" opacity={0.18} />
        ))}

        {/* floor */}
        <Rect x={0} y={640} width={450} height={160} fill="#f6c886" />
        <Rect x={0} y={628} width={450} height={14} fill="#f9b99a" />
        {[690, 735, 780].map((y) => (
          <Rect key={y} x={0} y={y} width={450} height={3} fill="#e8b06a" />
        ))}

        {/* window (left) */}
        <Rect x={-10} y={90} width={120} height={250} fill="#f59a3c" />
        <Rect x={0} y={100} width={98} height={110} fill="#8fd0f8" />
        <Rect x={0} y={220} width={98} height={110} fill="#8fd0f8" />
        <Ellipse cx={30} cy={140} rx={24} ry={11} fill="#ffffff" />
        <Ellipse cx={55} cy={134} rx={18} ry={10} fill="#ffffff" />
        <Ellipse cx={22} cy={262} rx={18} ry={9} fill="#ffffff" />
        <Rect x={-10} y={336} width={130} height={14} fill="#f6c886" />

        {/* plant on the sill */}
        <Ellipse cx={34} cy={300} rx={10} ry={34} fill="#7ad33f" transform="rotate(-18 34 300)" />
        <Ellipse cx={56} cy={292} rx={11} ry={38} fill="#62c22e" />
        <Ellipse cx={78} cy={300} rx={10} ry={34} fill="#7ad33f" transform="rotate(18 78 300)" />
        <Rect x={34} y={314} width={46} height={22} rx={8} fill="#ffffff" />
        {[44, 57, 70].map((x) => (
          <Polygon key={x} points={`${x},322 ${x + 4},326 ${x},330 ${x - 4},326`} fill="#ffe14d" />
        ))}

        {/* left bottom: books + bush + toy car */}
        <Rect x={0} y={566} width={95} height={20} fill="#3fa2e6" />
        <Rect x={0} y={586} width={104} height={22} fill="#f2579f" />
        <Rect x={0} y={608} width={92} height={18} fill="#ffd84a" />
        <Ellipse cx={92} cy={618} rx={36} ry={30} fill="#6cc04a" />
        <Rect x={0} y={640} width={78} height={30} rx={10} fill="#3fa2e6" />
        <Rect x={16} y={626} width={34} height={18} rx={8} fill="#8fd0f8" />
        <Circle cx={18} cy={676} r={12} fill="#1b3a8a" />
        <Circle cx={62} cy={676} r={12} fill="#1b3a8a" />

        {/* bookshelf (right) */}
        <Rect x={392} y={250} width={70} height={380} fill="#f59a3c" />
        <Rect x={398} y={256} width={60} height={110} fill="#f6b55a" />
        <Rect x={398} y={374} width={60} height={110} fill="#f6b55a" />
        <Rect x={398} y={492} width={60} height={130} fill="#f6b55a" />
        <Rect x={404} y={300} width={9} height={64} fill="#2fa84f" />
        <Rect x={415} y={290} width={9} height={74} fill="#3fa2e6" />
        <Rect x={426} y={304} width={9} height={60} fill="#ffd84a" />
        <Rect x={437} y={296} width={9} height={68} fill="#e8453c" />
        <Rect x={448} y={302} width={9} height={62} fill="#7b5cc4" />
        {/* teddy silhouette */}
        <Circle cx={428} cy={434} r={22} fill="#b8652a" />
        <Circle cx={410} cy={414} r={9} fill="#b8652a" />
        <Circle cx={446} cy={414} r={9} fill="#b8652a" />
        <Rect x={414} y={452} width={30} height={26} rx={8} fill="#b8652a" />
        <Rect x={404} y={540} width={10} height={70} fill="#3fa2e6" />
        <Rect x={416} y={548} width={10} height={62} fill="#ffd84a" />
        <Rect x={428} y={538} width={10} height={72} fill="#f2579f" />
        <Rect x={440} y={546} width={10} height={64} fill="#3fa2e6" />

        {/* big leaf bottom left */}
        <Path d="M0 700 Q44 668 70 706 Q80 760 40 800 L0 800 Z" fill="#7ad33f" />
      </Svg>
    </View>
  );
}

/* ───────────────────────── Puzzle board (drag & drop) ───────────────────────── */

export type SceneState = 'idle' | 'wrong' | 'right';
export type Placements = Record<string, string | null>;

const VB_W = 360;
const VB_H = 240;
const STROKE = '#111111';
const BOX = 80; // size of one piece box, in scene units

type FrameDef = { id: string; kind: 'square' | 'down' | 'up'; cx: number; cy: number };

// cx / cy = where a piece is centred when it sits inside the frame
const FRAMES: FrameDef[] = [
  { id: 'f1', kind: 'square', cx: 75, cy: 56 },
  { id: 'f2', kind: 'down', cx: 180, cy: 45 },
  { id: 'f3', kind: 'up', cx: 285, cy: 67 },
];

type PieceDef = {
  id: string;
  kind: 'square' | 'tri-green' | 'tri-cyan';
  fill: string;
  home: { x: number; y: number };
  placedScale: number;
  onlyFrame?: string; // when set, this piece can ONLY be placed in that frame
};

const PIECES: PieceDef[] = [
  { id: 'red', kind: 'square', fill: '#f00000', home: { x: 75, y: 186 }, placedScale: 1 },
  { id: 'green', kind: 'tri-green', fill: '#00f060', home: { x: 180, y: 186 }, placedScale: 1, onlyFrame: 'f1' },
  { id: 'cyan', kind: 'tri-cyan', fill: '#18d2f8', home: { x: 285, y: 186 }, placedScale: 1, onlyFrame: 'f1' },
];

function FrameOutline({ kind, stroke }: { kind: FrameDef['kind']; stroke: string }) {
  // fill is "none": the colored object sits BEHIND the white frame
  const common = { fill: 'none', stroke, strokeWidth: 3, strokeLinejoin: 'miter' as const };
  if (kind === 'square') return <Rect x={39} y={20} width={72} height={72} {...common} />;
  if (kind === 'down') return <Polygon points="132,22 228,22 180,92" {...common} />;
  return <Polygon points="237,92 333,92 285,22" {...common} />;
}

// pieces are drawn around (0,0) inside a -40..40 box
function PieceShape({ kind, fill }: { kind: PieceDef['kind']; fill: string }) {
  const p = { fill, stroke: STROKE, strokeWidth: 3, strokeLinejoin: 'miter' as const };
  if (kind === 'square') return <Rect x={-33} y={-33} width={66} height={66} {...p} />;
  if (kind === 'tri-green') return <Polygon points="-33,-33 33,-33 33,33" {...p} />;
  return <Polygon points="-33,-33 -33,33 33,33" {...p} />;
}

type PieceViewProps = {
  def: PieceDef;
  s: number;
  pos: Animated.ValueXY;
  scale: Animated.Value;
  disabled: boolean;
  z: number;
  onRelease: (id: string, x: number, y: number) => void;
};

function PieceView({ def, s, pos, scale, disabled, z, onRelease }: PieceViewProps) {
  const [dragging, setDragging] = useState(false);

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;
  const releaseRef = useRef(onRelease);
  releaseRef.current = onRelease;

  const finish = () => {
    pos.flattenOffset();
    setDragging(false);
    releaseRef.current(def.id, (pos.x as any)._value, (pos.y as any)._value);
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current,
      onMoveShouldSetPanResponder: () => !disabledRef.current,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        pos.setOffset({ x: (pos.x as any)._value, y: (pos.y as any)._value });
        pos.setValue({ x: 0, y: 0 });
        setDragging(true);
      },
      onPanResponderMove: Animated.event([null, { dx: pos.x, dy: pos.y }], { useNativeDriver: false }) as any,
      onPanResponderRelease: finish,
      onPanResponderTerminate: finish,
    })
  ).current;

  return (
    <Animated.View
      {...responder.panHandlers}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: BOX * s,
        height: BOX * s,
        zIndex: dragging ? 20 : z,
        transform: [...pos.getTranslateTransform(), { scale }],
      }}
    >
      <Svg width={BOX * s} height={BOX * s} viewBox="-40 -40 80 80">
        <PieceShape kind={def.kind} fill={def.fill} />
      </Svg>
    </Animated.View>
  );
}

export function PuzzleBoard({
  width,
  placements,
  state,
  disabled,
  onDrop,
}: {
  width: number;
  placements: Placements;
  state: SceneState;
  disabled: boolean;
  onDrop: (pieceId: string, frameId: string | null) => void;
}) {
  const s = width / VB_W;
  const height = VB_H * s;
  const frameStroke = state === 'wrong' ? '#ef4444' : state === 'right' ? '#22c55e' : STROKE;

  const pos = useRef<Record<string, Animated.ValueXY>>({}).current;
  const scales = useRef<Record<string, Animated.Value>>({}).current;
  PIECES.forEach((p) => {
    if (!pos[p.id]) {
      pos[p.id] = new Animated.ValueXY({ x: (p.home.x - BOX / 2) * s, y: (p.home.y - BOX / 2) * s });
      scales[p.id] = new Animated.Value(1);
    }
  });

  const [stack, setStack] = useState<string[]>(PIECES.map((p) => p.id));

  const placementsRef = useRef(placements);
  placementsRef.current = placements;

  // slide a piece into a frame (or back to its start place when frameId is null)
  const moveTo = (id: string, frameId: string | null) => {
    const def = PIECES.find((p) => p.id === id)!;
    const frame = FRAMES.find((f) => f.id === frameId);
    const c = frame ? { x: frame.cx, y: frame.cy } : def.home;
    Animated.parallel([
      Animated.spring(pos[id], {
        toValue: { x: (c.x - BOX / 2) * s, y: (c.y - BOX / 2) * s },
        friction: 7,
        useNativeDriver: false,
      }),
      Animated.spring(scales[id], {
        toValue: frame ? def.placedScale : 1,
        friction: 7,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // keep pieces in sync with the game state (also resets them after a wrong answer)
  useEffect(() => {
    PIECES.forEach((p) => moveTo(p.id, placements[p.id]));
  }, [placements, width]);

  const handleRelease = (id: string, x: number, y: number) => {
    const cx = x / s + BOX / 2;
    const cy = y / s + BOX / 2;

    // nearest frame to where the piece was dropped
    let target: string | null = null;
    let best = Infinity;
    const piece = PIECES.find((p) => p.id === id)!;
    FRAMES.forEach((f) => {
      // triangles are only allowed in the square frame: other frames reject them
      if (piece.onlyFrame && f.id !== piece.onlyFrame) return;
      const dx = Math.abs(cx - f.cx);
      const dy = Math.abs(cy - f.cy);
      if (dx <= 72 && dy <= 66) {
        const d = dx * dx + dy * dy;
        if (d < best) {
          best = d;
          target = f.id;
        }
      }
    });

    setStack((prev) => [...prev.filter((x) => x !== id), id]);
    moveTo(id, target);
    onDrop(id, target);
  };

  return (
    <View style={{ width, height }}>
      {PIECES.map((p) => (
        <PieceView
          key={p.id}
          def={p}
          s={s}
          pos={pos[p.id]}
          scale={scales[p.id]}
          disabled={disabled}
          z={stack.indexOf(p.id) + 1}
          onRelease={handleRelease}
        />
      ))}

      {/* white frames on top of resting objects (zIndex 5); a dragged object (20) goes above */}
      <View style={[StyleSheet.absoluteFill, { zIndex: 5 }]} pointerEvents="none">
        <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`}>
          {FRAMES.map((f) => (
            <FrameOutline key={f.id} kind={f.kind} stroke={frameStroke} />
          ))}
        </Svg>
      </View>
    </View>
  );
}
