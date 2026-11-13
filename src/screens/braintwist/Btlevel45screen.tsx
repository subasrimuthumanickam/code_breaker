import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Animated, Easing, StyleSheet, Alert, useWindowDimensions,
} from 'react-native';
import {
  RoomBackground, WoodSign, BoardCard, GlossyOption, HeaderCircle, HintPill,
  RoundButton, SearchIcon, SkipIcon, COLORS,
} from './Btlevel45art';
import {
  fetchLevel45, checkLevel45, getLevel45Hint, Level45Data,
} from './Btlevel45api';

// Used only when the server can't be reached (so the game never gets stuck).
const FALLBACK: Level45Data = {
  level: 45,
  hintCost: 0,
  skipCost: 50,
  stages: [
    {
      stage: 1, prompt: 'Pick the red color!',
      options: [
        { label: 'BLUE', color: '#e8112d' },
        { label: 'PURPLE', color: '#f5a500' },
        { label: 'RED', color: '#ffffff' },
      ],
    },
    {
      stage: 2, prompt: 'Pick the yellow!',
      options: [
        { label: 'BLACK', color: '#d400ff' },
        { label: 'YELLOW', color: '#ffa500' },
        { label: 'ORANGE', color: '#ffd700' },
      ],
    },
    {
      stage: 3, prompt: "Pick the 'red'!",
      options: [
        { label: 'RED', color: '#ffa500' },
        { label: 'BLUE', color: '#3ff7ff' },
        { label: 'ORANGE', color: '#ff0a1f' },
      ],
    },
  ],
};
const FALLBACK_ANSWERS = [0, 2, 0];
export default function Btlevel45screen({ playerId, hints, setHints, onExit, onComplete }: any) {
  const { width: SW, height: SH } = useWindowDimensions();
  const USER_ID = String(playerId ?? 'guest');

  const tries = useRef(0);
  const [data, setData] = useState<Level45Data>(FALLBACK);
  const [stageIdx, setStageIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<'ok' | 'bad' | null>(null);
  const [busy, setBusy] = useState(false);

  const fade = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchLevel45().then(setData).catch(() => setData(FALLBACK)); // works offline too
  }, []);

  const stage = data.stages[Math.min(stageIdx, data.stages.length - 1)];

  const doShake = () => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 90, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 90, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const goNextStage = () => {
    Animated.timing(fade, { toValue: 0, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true })
      .start(() => {
        setStageIdx(i => i + 1);
        setPicked(null);
        setResult(null);
        Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start(() => setBusy(false));
      });
  };

  const onPick = async (i: number) => {
    if (busy) return;
    setBusy(true);
    setPicked(i);
    tries.current += 1;

    const isLastStage = stageIdx >= data.stages.length - 1;
    let correct = false;
    let completed = false;
    try {
      const r = await checkLevel45(USER_ID, stage.stage, i);
      correct = r.correct;
      completed = r.completed;
    } catch {
      correct = FALLBACK_ANSWERS[stageIdx] === i; // offline fallback
      completed = correct && isLastStage;
    }

    if (correct) {
      setResult('ok');
      if (completed) {
        setTimeout(() => {
          onComplete?.({ correct: true, attempts: Math.max(1, tries.current), skipped: false });
        }, 900);
      } else {
        setTimeout(goNextStage, 700);
      }
    } else {
      setResult('bad');
      doShake();
      setTimeout(() => {
        setResult(null);
        setPicked(null);
        setBusy(false);
      }, 700);
    }
  };

  const onHint = async () => {
    try {
      const r = await getLevel45Hint(USER_ID, stage.stage);
      Alert.alert('Hint', r.hint);
    } catch {
      Alert.alert('Hint', 'Could not load hint. Please try again.');
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

  const cardH = Math.max(380, SH - 120 - 150 - 16);
  const cardW = Math.min(SW - 32, 420);
  const shakeX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] });

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

      {/* board with the question + 3 colour buttons */}
      <View style={styles.cardWrap}>
        <BoardCard width={cardW} height={cardH}>
          <Animated.View style={[styles.cardBody, { opacity: fade }]}>
            <Text style={styles.prompt}>{stage.prompt}</Text>
            <Animated.View style={[styles.options, { transform: [{ translateX: shakeX }] }]}>
              {stage.options.map((o, i) => (
                <GlossyOption
                  key={`${stage.stage}-${i}`}
                  label={o.label}
                  color={o.color}
                  state={picked === i ? result : null}
                  disabled={busy}
                  onPress={() => onPick(i)}
                />
              ))}
            </Animated.View>
          </Animated.View>
        </BoardCard>
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
  cardWrap: { position: 'absolute', top: 120, left: 0, right: 0 },
  cardBody: { flex: 1, alignItems: 'center', paddingTop: 18, paddingBottom: 10 },
  prompt: {
    fontSize: 26, fontStyle: 'italic', fontWeight: '700', color: COLORS.prompt, fontFamily: 'serif',
    textAlign: 'center', paddingHorizontal: 12,
  },
  options: { flex: 1, justifyContent: 'space-evenly', alignItems: 'center', alignSelf: 'stretch' },
  bottom: {
    position: 'absolute', bottom: 20, left: 24, right: 24, height: 124,
    backgroundColor: '#f7ead4', borderRadius: 62, borderWidth: 6, borderColor: '#bcd9ee',
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 4,
  },
});
