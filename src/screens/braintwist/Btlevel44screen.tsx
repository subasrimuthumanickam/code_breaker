
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Animated, Easing, StyleSheet, Dimensions, TouchableOpacity, Alert, PanResponder, useWindowDimensions,
} from 'react-native';
import {
  RoomBackground, WoodSign, PaperCard, Bowl, Apple, HeaderCircle, HintPill,
  RoundButton, SearchIcon, SkipIcon, COLORS,
} from './Btlevel44art';
import { fetchLevel44, checkLevel44, getLevel44Hint, Level44Data } from './Btlevel44api';

const { width: W, height: H } = Dimensions.get('window');

// play area inside the paper card
const AREA_W = 320;
const AREA_H = 230;
const APPLE = 58;
const CARD_W = Math.min(W - 24, 360);
const CARD_H = 300;

// text shown after the number in the question: "We need 9 apples in basket."
// (this replaces the suffix that comes from the server)
const QUESTION_SUFFIX = 'apples in basket.';

// start positions of the 6 apples (top-left corner inside the area)
const APPLE_POS = [
  { x: 262, y: 20 }, { x: 40, y: 85 }, { x: 142, y: 98 },
  { x: 240, y: 105 }, { x: 80, y: 152 }, { x: 180, y: 158 },
];
const BOWL_POS = { x: 70, y: 0, w: 170 };
// where each apple settles inside the bowl (centre point)
const SLOTS = [
  { x: 110, y: 26 }, { x: 155, y: 26 }, { x: 200, y: 26 },
  { x: 132, y: 12 }, { x: 178, y: 12 }, { x: 155, y: 0 },
];
const PLACED_SCALE = 0.62;

const FALLBACK: Level44Data = {
  level: 44, prefix: 'We need', suffix: QUESTION_SUFFIX, shownNumber: 9, appleCount: 6, hintCost: 25, skipCost: 50,
};

const inBowlZone = (cx: number, cy: number) =>
  cx > BOWL_POS.x - 5 && cx < BOWL_POS.x + BOWL_POS.w + 5 && cy > -30 && cy < 80;

type DragProps = {
  pos: { x: number; y: number };
  inZone: (cx: number, cy: number) => boolean;
  onPlace: () => { x: number; y: number };
  locked: boolean;
};

/** One apple that can be dragged into the bowl. If dropped outside, it springs back. */
function DraggableApple({ pos, inZone, onPlace, locked }: DragProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const cur = useRef({ x: 0, y: 0 });
  const start = useRef({ x: 0, y: 0 });
  const placed = useRef(false);
  const [lifted, setLifted] = useState(false);
  const latest = useRef({ pos, inZone, onPlace, locked });
  latest.current = { pos, inZone, onPlace, locked };

  const finishDrag = () => {
    setLifted(false);
    const { pos: p, inZone: zone, onPlace: place } = latest.current;
    const cx = p.x + APPLE / 2 + cur.current.x;
    const cy = p.y + APPLE / 2 + cur.current.y;
    if (zone(cx, cy)) {
      const slot = place();
      placed.current = true;
      const tx = slot.x - (p.x + APPLE / 2);
      const ty = slot.y - (p.y + APPLE / 2);
      cur.current = { x: tx, y: ty };
      Animated.parallel([
        Animated.spring(pan, { toValue: { x: tx, y: ty }, friction: 6, useNativeDriver: false }),
        Animated.timing(scale, { toValue: PLACED_SCALE, duration: 250, useNativeDriver: false }),
      ]).start();
    } else {
      cur.current = { x: 0, y: 0 };
      Animated.parallel([
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: false }),
      ]).start();
    }
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !placed.current && !latest.current.locked,
      onMoveShouldSetPanResponder: () => !placed.current && !latest.current.locked,
      onPanResponderGrant: () => {
        start.current = { ...cur.current };
        setLifted(true);
        Animated.spring(scale, { toValue: 1.15, useNativeDriver: false }).start();
      },
      onPanResponderMove: (_, g) => {
        const x = start.current.x + g.dx;
        const y = start.current.y + g.dy;
        cur.current = { x, y };
        pan.setValue({ x, y });
      },
      onPanResponderRelease: finishDrag,
      onPanResponderTerminate: finishDrag,
    })
  ).current;

  return (
    <Animated.View
      {...responder.panHandlers}
      style={{
        position: 'absolute', left: pos.x, top: pos.y, zIndex: lifted ? 30 : 5,
        transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }],
      }}
    >
      <Apple size={APPLE} />
    </Animated.View>
  );
}

export default function Btlevel44screen({ playerId, hints, setHints, onExit, onComplete }: any) {
  const { width: SW, height: SH } = useWindowDimensions();
  const USER_ID = String(playerId ?? 'guest');
  const tries = useRef(0);
  const [data, setData] = useState<Level44Data>(FALLBACK);
  const dataRef = useRef<Level44Data>(FALLBACK);
  const [solved, setSolved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const flip = useRef(new Animated.Value(0)).current;
  const flippedRef = useRef(false); // false = shows 9, true = shows 6
  const placedCount = useRef(0);

  useEffect(() => {
    fetchLevel44()
      .then(d => { dataRef.current = d; setData(d); })
      .catch(() => { dataRef.current = FALLBACK; setData(FALLBACK); }); // works offline too
  }, []);

  // 9 rotated 180deg looks exactly like 6
  const rotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  // tap the number: 9 <-> 6
  const onTapNumber = () => {
    if (solved || busy) return;
    const next = !flippedRef.current;
    flippedRef.current = next;
    Animated.timing(flip, {
      toValue: next ? 1 : 0, duration: 600, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true,
    }).start();
  };

  // all apples are in the bowl -> submit the number that is currently shown
  const finish = async () => {
    tries.current += 1;
    const answer = flippedRef.current ? 6 : dataRef.current.shownNumber;
    let correct = false;
    try {
      correct = (await checkLevel44(USER_ID, answer)).correct;
    } catch {
      correct = answer === dataRef.current.appleCount; // offline fallback
    }
    if (correct) {
      setSolved(true);
      setTimeout(() => {
        onComplete?.({ correct: true, attempts: Math.max(1, tries.current), skipped: false });
      }, 1100);
    } else {
      setTimeout(() => {
        placedCount.current = 0;
        setBusy(false);
        setResetKey(k => k + 1); // apples go back to the start
      }, 1500);
    }
  };

  const handlePlace = () => {
    const slot = SLOTS[placedCount.current];
    placedCount.current += 1;
    if (placedCount.current === APPLE_POS.length) {
      setBusy(true);
      setTimeout(finish, 700);
    }
    return slot;
  };

  const onHint = async () => {
    try {
      if (Number(hints) < data.hintCost) {
        Alert.alert('Hint', `Need ${data.hintCost} hints. You have ${Number(hints)}.`);
        return;
      }
      const r = await getLevel44Hint(USER_ID);
      setHints(Number(hints) - r.cost);
      Alert.alert('Hint', r.hint);
    } catch {
      setHints(Number(hints) - data.hintCost);
      Alert.alert('Hint', 'Count the apples... then look at the number again. Can you turn it?');
    }
  };

  const onSkip = () => {
    if (Number(hints) < data.skipCost) {
      Alert.alert('Skip', `Need ${data.skipCost} hints. You have ${Number(hints)}.`);
      return;
    }
    setHints(Number(hints) - data.skipCost);
    onComplete?.({ skipped: true, attempts: Math.max(1, tries.current) });
  };

  return (
    <View style={[styles.root, { width: SW, height: SH }]}>
      <RoomBackground width={SW} height={SH} />

      {/* header */}
      <View style={styles.headerLeft}>
        <HeaderCircle label="⌂" onPress={onExit} />
        <HeaderCircle label="⚙" />
      </View>
      <View style={styles.headerRight}>
        <HintPill count={hints} />
      </View>
      <View style={styles.signWrap}>
        <WoodSign text={`LEVEL ${data.level}`} />
      </View>

      {/* question bubble: "We need 9 apples in basket." */}
      <View style={[styles.bubble, solved && { backgroundColor: '#c9f0c2' }]}>
        <Text style={styles.stText}>{data.prefix} </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onTapNumber} style={styles.numberBtn}>
          <Animated.Text style={[styles.stText, styles.number, { transform: [{ rotate }] }]}>
            {data.shownNumber}
          </Animated.Text>
        </TouchableOpacity>
        <Text style={styles.stText}> {QUESTION_SUFFIX}</Text>
      </View>

      {/* paper card with bowl + draggable apples */}
      <View style={styles.cardWrap}>
        <PaperCard width={CARD_W} height={CARD_H}>
          <View style={styles.area}>
            <View style={{ position: 'absolute', left: BOWL_POS.x, top: BOWL_POS.y, zIndex: 1 }}>
              <Bowl width={BOWL_POS.w} />
            </View>
            {APPLE_POS.map((p, i) => (
              <DraggableApple
                key={`${i}-${resetKey}`}
                pos={p}
                inZone={inBowlZone}
                onPlace={handlePlace}
                locked={busy || solved}
              />
            ))}
          </View>

        </PaperCard>
      </View>

      {/* bottom bar */}
      <View style={styles.bottom}>
        <RoundButton bg="#a3d62f" ring="#d4ec9b" cost="25" onPress={onHint}>
          <SearchIcon />
        </RoundButton>
        <RoundButton bg="#fff" ring="#f0e0c8">
          <Text style={{ fontSize: 24 }}>🎁</Text>
        </RoundButton>
        <RoundButton bg="#fff" ring="#f0e0c8" cost="+75" costIcon="🪙">
          <Text style={{ fontSize: 24 }}>🎬</Text>
        </RoundButton>
        <RoundButton bg="#ef4452" ring="#fff" cost="50" onPress={onSkip}>
          <SkipIcon />
        </RoundButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, overflow: 'hidden', backgroundColor: '#8ccaf3' },
  headerLeft: { position: 'absolute', top: 44, left: 14, flexDirection: 'row' },
  headerRight: { position: 'absolute', top: 44, right: 14 },
  signWrap: { position: 'absolute', top: 36, left: 0, right: 0, alignItems: 'center' },
  bubble: {
    position: 'absolute', top: 118, left: 20, right: 20, minHeight: 58,
    backgroundColor: COLORS.cream, borderRadius: 30, flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16,
  },
  stText: { fontSize: 22, color: '#2a2a5a', fontFamily: 'serif' },
  numberBtn: { paddingHorizontal: 6 },
  number: { fontWeight: '900', color: '#000', fontSize: 28 },
  cardWrap: { position: 'absolute', top: 195, left: 0, right: 0 },
  area: { width: AREA_W, height: AREA_H, alignSelf: 'center', marginTop: 34 },
  bottom: {
    position: 'absolute', bottom: 20, left: 24, right: 24, height: 124,
    backgroundColor: '#f7ead4', borderRadius: 62, borderWidth: 6, borderColor: '#bcd9ee',
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 4,
  },
});
