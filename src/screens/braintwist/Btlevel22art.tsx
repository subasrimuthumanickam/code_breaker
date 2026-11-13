
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, PanResponder, StyleSheet, Easing } from 'react-native';
import Svg, { Rect, Path, Polygon, Line, Circle, Ellipse } from 'react-native-svg';

/* ======================= cozy room background ======================= */
const yoyo = (v: Animated.Value, ms: number) =>
  Animated.loop(
    Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])
  ).start();

const Leaf = ({ l, b, w, h, r, c }: any) => (
  <View
    style={{
      position: 'absolute', left: l, bottom: b, width: w, height: h,
      borderRadius: h / 2, backgroundColor: c || '#5fae3a', transform: [{ rotate: r + 'deg' }],
    }}
  />
);

export function Level22Room() {
  const beam = useRef(new Animated.Value(0)).current;
  const cl = useRef(new Animated.Value(0)).current;
  const sw = useRef(new Animated.Value(0)).current;
  const sw2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    yoyo(beam, 3600);
    yoyo(sw, 2400);
    yoyo(sw2, 3000);
    Animated.loop(
      Animated.timing(cl, { toValue: 1, duration: 26000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  const bo = beam.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] });
  const bx = beam.interpolate({ inputRange: [0, 1], outputRange: [-14, 14] });
  const cx = cl.interpolate({ inputRange: [0, 1], outputRange: [-50, 90] });
  const plantR = sw.interpolate({ inputRange: [0, 1], outputRange: ['-3deg', '3deg'] });
  const plantR2 = sw2.interpolate({ inputRange: [0, 1], outputRange: ['2.5deg', '-2.5deg'] });

  const books = (arr: any[]) =>
    arr.map((b, i) => (
      <View key={i} style={{ width: b[0], height: b[1], backgroundColor: b[2], borderRadius: 2, marginRight: 1 }} />
    ));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* wall */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '45%', backgroundColor: 'rgba(255,255,255,0.22)' }} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: '45%', height: '30%', backgroundColor: 'rgba(255,255,255,0.08)' }} />

      {/* picture frame */}
      <View style={{ position: 'absolute', right: '7%', top: '11%', width: 66, height: 74, backgroundColor: '#cfe6f3', borderWidth: 4, borderColor: '#8fc3d8' }}>
        <View style={{ alignSelf: 'center', marginTop: 14, width: 34, height: 34, borderRadius: 17, backgroundColor: '#f6a43c', borderWidth: 4, borderColor: '#f7c36a' }} />
      </View>

      {/* window */}
      <View style={{ position: 'absolute', left: -4, top: '8%', width: 82, height: 200, backgroundColor: '#f0b878', borderWidth: 5, borderColor: '#e2a35e', borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ flex: 1, backgroundColor: '#8fd3f6', overflow: 'hidden' }}>
          <Animated.View style={{ position: 'absolute', top: 24, transform: [{ translateX: cx }] }}>
            <View style={{ width: 50, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.9)' }} />
            <View style={{ position: 'absolute', left: 10, top: -9, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.9)' }} />
          </Animated.View>
          <Animated.View style={{ position: 'absolute', top: 76, transform: [{ translateX: cx.interpolate({ inputRange: [-50, 90], outputRange: [60, -60] }) }] }}>
            <View style={{ width: 36, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.75)' }} />
          </Animated.View>
          <View style={{ position: 'absolute', left: 6, bottom: -14, width: 44, height: 60, borderRadius: 30, backgroundColor: '#7bc65a' }} />
          <View style={{ position: 'absolute', left: 36, bottom: -20, width: 50, height: 70, borderRadius: 35, backgroundColor: '#62b24a' }} />
        </View>
        <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 4, backgroundColor: '#e2a35e' }} />
      </View>

      {/* window sill + plant */}
      <View style={{ position: 'absolute', left: 0, top: '8%', marginTop: 196, width: 96, height: 14, backgroundColor: '#e9b370', borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />
      <Animated.View style={{ position: 'absolute', left: 10, top: '8%', marginTop: 132, width: 70, height: 66, transform: [{ rotate: plantR }] }}>
        <Leaf l={6} b={24} w={20} h={50} r={-28} />
        <Leaf l={22} b={24} w={22} h={60} r={-4} c="#4f9f34" />
        <Leaf l={40} b={24} w={20} h={48} r={26} />
        <View style={{ position: 'absolute', left: 14, bottom: 0, width: 40, height: 28, borderRadius: 8, backgroundColor: '#f5ead8' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 9 }}>
            <View style={s.eye} />
            <View style={s.eye} />
          </View>
        </View>
      </Animated.View>

      {/* sunbeams */}
      <Animated.View style={{ position: 'absolute', top: '-6%', left: '14%', width: 96, height: '82%', backgroundColor: 'rgba(255,255,255,0.16)', opacity: bo, transform: [{ translateX: bx }, { rotate: '-17deg' }] }} />
      <Animated.View style={{ position: 'absolute', top: '-6%', left: '34%', width: 64, height: '80%', backgroundColor: 'rgba(255,255,255,0.12)', opacity: bo.interpolate({ inputRange: [0.45, 1], outputRange: [1, 0.5] }), transform: [{ translateX: bx }, { rotate: '-17deg' }] }} />
      <Animated.View style={{ position: 'absolute', top: '-6%', left: '54%', width: 110, height: '78%', backgroundColor: 'rgba(255,255,255,0.10)', opacity: bo, transform: [{ translateX: bx }, { rotate: '-17deg' }] }} />

      {/* bookshelf (right) */}
      <View style={{ position: 'absolute', right: 0, top: '38%', width: 70, height: '31%', backgroundColor: '#e0a85e', borderLeftWidth: 5, borderTopWidth: 5, borderColor: '#c98d4d' }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 8, borderBottomWidth: 5, borderColor: '#c98d4d' }}>
          {books([[12, 46, '#58a6c8'], [10, 52, '#f2c14e'], [12, 44, '#7b6bd0']])}
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 8, borderBottomWidth: 5, borderColor: '#c98d4d' }}>
          {books([[12, 40, '#3f7fc4'], [10, 46, '#59b3a0']])}
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
          <View style={{ width: 44, height: 34, borderRadius: 16, backgroundColor: '#b9763a' }} />
          <View style={{ position: 'absolute', top: 6, left: 10, width: 14, height: 14, borderRadius: 7, backgroundColor: '#b9763a' }} />
          <View style={{ position: 'absolute', top: 6, right: 14, width: 14, height: 14, borderRadius: 7, backgroundColor: '#b9763a' }} />
          <View style={{ position: 'absolute', top: 20, width: 20, height: 14, borderRadius: 8, backgroundColor: '#f0cfa0' }} />
        </View>
      </View>

      {/* hanging vine */}
      <Animated.View style={{ position: 'absolute', right: 2, top: '30%', width: 50, height: 80, transform: [{ rotate: plantR2 }] }}>
        <Leaf l={6} b={8} w={14} h={30} r={-20} />
        <Leaf l={22} b={20} w={14} h={32} r={18} c="#4f9f34" />
        <Leaf l={10} b={42} w={14} h={30} r={-10} />
      </Animated.View>

      {/* floor */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '31%', backgroundColor: '#e9b575' }}>
        {[18, 46, 78, 112, 150].map((t, i) => (
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: t, height: 1.5, backgroundColor: 'rgba(150,90,40,0.18)' }} />
        ))}
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: '31%', height: 14, backgroundColor: '#e8b8b0' }} />

      {/* books stack + toy car (left) */}
      <View style={{ position: 'absolute', left: -6, bottom: '27%' }}>
        <View style={{ width: 84, height: 16, borderRadius: 3, backgroundColor: '#3f9ad6', marginBottom: 1 }} />
        <View style={{ width: 92, height: 16, borderRadius: 3, backgroundColor: '#e86fae', marginBottom: 1, marginLeft: -4 }} />
        <View style={{ width: 88, height: 16, borderRadius: 3, backgroundColor: '#f2c14e', marginBottom: 1 }} />
        <View style={{ width: 80, height: 14, borderRadius: 3, backgroundColor: '#4b7fc4' }} />
      </View>
      <View style={{ position: 'absolute', left: 6, bottom: '25%', width: 54, height: 24, borderRadius: 10, backgroundColor: '#3aa0e0' }}>
        <View style={{ position: 'absolute', left: 14, top: -10, width: 24, height: 14, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#7cc7f0' }} />
        <View style={{ position: 'absolute', left: 6, bottom: -6, width: 12, height: 12, borderRadius: 6, backgroundColor: '#2d4a6b' }} />
        <View style={{ position: 'absolute', right: 6, bottom: -6, width: 12, height: 12, borderRadius: 6, backgroundColor: '#2d4a6b' }} />
      </View>

      {/* pencil cup (right) */}
      <View style={{ position: 'absolute', right: 6, bottom: '24%', width: 44, height: 58, borderRadius: 6, backgroundColor: '#f5c63a', borderWidth: 2, borderColor: '#e0a81f' }} />
      <View style={{ position: 'absolute', right: 22, bottom: '24%', marginBottom: 54, width: 6, height: 46, backgroundColor: '#e86f6f', transform: [{ rotate: '-10deg' }] }} />
      <View style={{ position: 'absolute', right: 14, bottom: '24%', marginBottom: 54, width: 6, height: 50, backgroundColor: '#3f7fc4', transform: [{ rotate: '-22deg' }] }} />
      <View style={{ position: 'absolute', right: 30, bottom: '24%', marginBottom: 54, width: 6, height: 44, backgroundColor: '#5fae3a', transform: [{ rotate: '8deg' }] }} />
    </View>
  );
}

/* ======================= small drawings (kept from before) ======================= */
export const Eraser = ({ w }: { w: number }) => (
  <Svg width={w} height={w * 0.62} viewBox="0 0 100 62">
    <Rect x="4" y="8" width="92" height="46" rx="12" fill="#f4f4f0" stroke="#d9d9d4" strokeWidth="2" />
    <Path d="M4 20 Q4 8 16 8 H70 L52 54 H16 Q4 54 4 42 Z" fill="#2ab4d9" />
    <Path d="M12 15 H60" stroke="#8fe0f2" strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

export const Pencil = ({ w }: { w: number }) => (
  <Svg width={w} height={w * 0.2} viewBox="0 0 150 30">
    <Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke="#c9985a" strokeWidth="1" />
    <Polygon points="2,15 10,11.5 10,18.5" fill="#333" />
    <Rect x="26" y="4" width="84" height="22" fill="#2fa86f" />
    <Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2" />
    <Line x1="28" y1="19" x2="108" y2="19" stroke="#1f7a4e" strokeWidth="2" />
    <Rect x="110" y="3" width="26" height="24" fill="#9a9a9a" />
    <Line x1="116" y1="3" x2="116" y2="27" stroke="#6f6f6f" strokeWidth="2" />
    <Line x1="124" y1="3" x2="124" y2="27" stroke="#6f6f6f" strokeWidth="2" />
    <Rect x="136" y="6" width="12" height="18" rx="6" fill="#f4f2ea" />
  </Svg>
);

export function FreeDrag({ children }: any) {
  const pan = useRef(new Animated.ValueXY()).current;
  const pr = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;
  return (
    <Animated.View {...pr.panHandlers} style={{ transform: pan.getTranslateTransform() }}>
      {children}
    </Animated.View>
  );
}

/* ======================= level 22: apples, kids and the plate ======================= */

const Apple = ({ w }: { w: number }) => (
  <Svg width={w} height={w} viewBox="0 0 60 60">
    <Path
      d="M30 16 C22 8 6 12 6 32 C6 48 18 58 30 54 C42 58 54 48 54 32 C54 12 38 8 30 16Z"
      fill="#e8222b" stroke="#a31219" strokeWidth="2"
    />
    <Path d="M30 16 C30 10 32 6 36 3" stroke="#6b4423" strokeWidth="3" fill="none" strokeLinecap="round" />
    <Path d="M34 8 C40 2 48 4 50 8 C44 12 38 12 34 8Z" fill="#5fae3a" />
    <Path d="M14 24 Q16 16 22 14" stroke="#ff8a8a" strokeWidth="3" fill="none" strokeLinecap="round" />
  </Svg>
);

const Bowl = ({ w }: { w: number }) => (
  <Svg width={w} height={w * 0.25} viewBox="0 0 200 50">
    <Path d="M0 10 Q100 -6 200 10 Q196 46 100 48 Q4 46 0 10Z" fill="#3b3b42" />
    <Ellipse cx="100" cy="10" rx="100" ry="8" fill="#56565e" />
  </Svg>
);

// kind: 0 = blonde girl (left), 1 = boy in the middle, 2 = curly boy (right)
const Kid = ({ kind }: { kind: number }) => {
  const eyes = (
    <>
      <Circle cx="40" cy="58" r="2.8" fill="#222" />
      <Circle cx="60" cy="58" r="2.8" fill="#222" />
    </>
  );
  const smile = <Path d="M40 68 Q50 77 60 68" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  const cheeks = (
    <>
      <Circle cx="34" cy="66" r="4" fill="#f58a8a" opacity={0.55} />
      <Circle cx="66" cy="66" r="4" fill="#f58a8a" opacity={0.55} />
    </>
  );
  return (
    <Svg width={100} height={150} viewBox="0 0 100 150">
      {kind === 0 && (
        <>
          <Circle cx="50" cy="50" r="38" fill="#ffd21f" />
          <Path d="M16 160 Q16 100 50 94 Q84 100 84 160Z" fill="#6b3a9a" />
          <Path d="M40 94 L50 108 L60 94Z" fill="#2f7fd0" />
          <Circle cx="50" cy="58" r="26" fill="#f6b894" />
          <Path d="M24 52 Q28 22 52 24 Q74 24 76 52 Q62 38 50 40 Q36 38 24 52Z" fill="#ffd21f" />
          {eyes}{smile}{cheeks}
        </>
      )}
      {kind === 1 && (
        <>
          <Path d="M16 160 Q16 100 50 94 Q84 100 84 160Z" fill="#2f6fc9" />
          <Path d="M36 112 H64" stroke="#ffd21f" strokeWidth="4" strokeLinecap="round" />
          <Circle cx="50" cy="58" r="26" fill="#f6b894" />
          <Path d="M22 54 Q22 24 50 24 Q78 24 78 54 Q70 38 50 38 Q30 38 22 54Z" fill="#8a5a2b" />
          {eyes}{smile}{cheeks}
        </>
      )}
      {kind === 2 && (
        <>
          <Circle cx="26" cy="46" r="13" fill="#f39a1f" />
          <Circle cx="38" cy="30" r="14" fill="#f39a1f" />
          <Circle cx="54" cy="26" r="14" fill="#f39a1f" />
          <Circle cx="69" cy="34" r="14" fill="#f39a1f" />
          <Circle cx="76" cy="50" r="12" fill="#f39a1f" />
          <Rect x="18" y="94" width="64" height="80" rx="24" fill="#f0c36a" />
          {[108, 120, 132, 144].map((y) => (
            <Line key={y} x1="20" y1={y} x2="80" y2={y} stroke="#b8782a" strokeWidth="5" />
          ))}
          <Circle cx="50" cy="60" r="25" fill="#f6b894" />
          <Path d="M28 46 Q50 34 72 46 Q60 40 50 41 Q38 40 28 46Z" fill="#f39a1f" />
          <Circle cx="40" cy="58" r="2.8" fill="#222" />
          <Circle cx="60" cy="58" r="2.8" fill="#222" />
          <Path d="M40 67 Q50 82 60 67Z" fill="#c0242b" />
          {cheeks}
        </>
      )}
    </Svg>
  );
};

/* layout of the playing card (all numbers are pixels inside the card) */
const SW = 320;                       // card width
const SH = 305;                       // card height
const COLW = SW / 3;                  // one column per kid
const KID_W = 100;
const KID_TOP = 8;
const KID_BOTTOM = 190;               // dropping above this line = giving to a kid
const PL_L = 60, PL_T = 215, PL_W = 200, PL_H = 90;
const PL_CX = PL_L + PL_W / 2;        // plate centre
const PL_CY = PL_T + PL_H / 2;
const APPLE_W = 56;
const SLOT_X = [36, 100, 164];        // apple centres inside the plate
const APPLE_CY = PL_T + APPLE_W / 2;
const KID_PLATE_Y = 140;              // where the plate lands when it is given to a kid

/*
  ApplesGame
  - drag a loose apple onto a kid  -> move "apple:K"
  - drag the plate (with its apples) onto a kid -> move "plate:K"
  The game only records the moves; the server decides if they are right.
  onFinish is called once: when the plate was given away or when the plate has no apples left.
*/
export function ApplesGame({ onFinish }: { onFinish: (moves: string[]) => void }) {
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const [onPlate, setOnPlate] = useState([true, true, true]);
  const [kidHas, setKidHas] = useState([false, false, false]);
  const [dragIdx, setDragIdx] = useState(-1);

  const onPlateRef = useRef([true, true, true]);
  const lock = useRef(false);
  const moves = useRef<string[]>([]);
  const timers = useRef<any[]>([]);

  const plateXY = useRef(new Animated.ValueXY()).current;
  const plateS = useRef(new Animated.Value(1)).current;
  const appleXY = useRef([0, 1, 2].map(() => new Animated.ValueXY())).current;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const kidAt = (cx: number, cy: number) =>
    cy < KID_BOTTOM && cx >= 0 && cx < SW ? Math.min(2, Math.floor(cx / COLW)) : -1;

  const back = (v: Animated.ValueXY) =>
    Animated.spring(v, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();

  const finishSoon = (ms: number) => {
    lock.current = true;
    timers.current.push(setTimeout(() => finishRef.current(moves.current.slice()), ms));
  };

  const dropApple = (i: number, dx: number, dy: number) => {
    setDragIdx(-1);
    const kid = kidAt(PL_L + SLOT_X[i] + dx, APPLE_CY + dy);
    if (kid < 0) { back(appleXY[i]); return; }
    moves.current.push('apple:' + kid);
    onPlateRef.current[i] = false;
    setOnPlate(onPlateRef.current.slice());
    setKidHas((p) => { const n = p.slice(); n[kid] = true; return n; });
    appleXY[i].setValue({ x: 0, y: 0 });
    if (!onPlateRef.current.some(Boolean)) finishSoon(450);   // the plate is empty now
  };

  const dropPlate = (dx: number, dy: number) => {
    const kid = kidAt(PL_CX + dx, PL_CY + dy);
    if (kid < 0) { back(plateXY); return; }
    moves.current.push('plate:' + kid);
    lock.current = true;
    const kx = kid * COLW + COLW / 2;
    Animated.parallel([
      Animated.spring(plateXY, { toValue: { x: kx - PL_CX, y: KID_PLATE_Y - PL_CY }, friction: 7, useNativeDriver: false }),
      Animated.timing(plateS, { toValue: 0.5, duration: 260, useNativeDriver: false }),
    ]).start();
    finishSoon(700);
  };

  const applePans = useRef(
    [0, 1, 2].map((i) =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !lock.current && onPlateRef.current[i],
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => setDragIdx(i),
        onPanResponderMove: Animated.event([null, { dx: appleXY[i].x, dy: appleXY[i].y }], { useNativeDriver: false }) as any,
        onPanResponderRelease: (_e, g) => dropApple(i, g.dx, g.dy),
        onPanResponderTerminate: () => { setDragIdx(-1); back(appleXY[i]); },
      })
    )
  ).current;

  const platePan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !lock.current,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: Animated.event([null, { dx: plateXY.x, dy: plateXY.y }], { useNativeDriver: false }) as any,
      onPanResponderRelease: (_e, g) => { if (!lock.current) dropPlate(g.dx, g.dy); },
      onPanResponderTerminate: () => { if (!lock.current) back(plateXY); },
    })
  ).current;

  return (
    <View style={{ width: SW, height: SH }}>
      {/* notebook card */}
      <View style={[StyleSheet.absoluteFill, s.card]} pointerEvents="none">
        {[40, 72, 104, 136, 168, 200, 232, 264].map((y) => (
          <View key={y} style={{ position: 'absolute', left: 0, right: 0, top: y, height: 1.5, backgroundColor: 'rgba(120,170,215,0.28)' }} />
        ))}
      </View>

      {/* the three kids */}
      {[0, 1, 2].map((k) => (
        <View key={k} pointerEvents="none" style={{ position: 'absolute', left: k * COLW + (COLW - KID_W) / 2, top: KID_TOP }}>
          <Kid kind={k} />
          {kidHas[k] && (
            <View style={{ position: 'absolute', left: 34, top: 98 }}>
              <Apple w={32} />
            </View>
          )}
        </View>
      ))}

      {/* the plate with its apples (drag the bowl to move everything) */}
      <Animated.View
        {...platePan.panHandlers}
        style={{
          position: 'absolute', left: PL_L, top: PL_T, width: PL_W, height: PL_H, zIndex: 10,
          transform: [{ translateX: plateXY.x }, { translateY: plateXY.y }, { scale: plateS }],
        }}
      >
        {[0, 1, 2].map((i) =>
          onPlate[i] ? (
            <Animated.View
              key={i}
              {...applePans[i].panHandlers}
              style={{
                position: 'absolute', left: SLOT_X[i] - APPLE_W / 2, top: 0,
                zIndex: dragIdx === i ? 20 : 1,
                transform: [{ translateX: appleXY[i].x }, { translateY: appleXY[i].y }],
              }}
            >
              <Apple w={APPLE_W} />
            </Animated.View>
          ) : null
        )}
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 36, zIndex: 5 }}>
          <Bowl w={PL_W} />
        </View>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  eye: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#5b3a29' },
  card: { backgroundColor: 'rgba(251,246,233,0.94)', borderRadius: 22, overflow: 'hidden', borderWidth: 3, borderColor: '#fff' },
});
