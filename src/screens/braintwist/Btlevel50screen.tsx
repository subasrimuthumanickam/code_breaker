// Btlevel50screen.tsx — "Please turn on all the lights." (3 bulbs, 4 switches)
// Rules: switch 4 ON then OFF lights bulbs 1 & 2. Then drag bulb 3 to the right end of the screen.
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Animated, PanResponder, Pressable, StyleSheet, Text, useWindowDimensions, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchLevel50Info, Level50Info, Move, requestLevel50Clue, requestLevel50Skip, submitLevel50Answer,
} from './Btlevel50api';
import { Bulb, COLORS, LevelSign, Notebook, RoomBackground, WallSwitch } from './Btlevel50art';

type Props = {
  playerId: string;
  hints: number;
  setHints: (n: number) => void;
  onExit: () => void;
  onComplete: (info?: { skipped?: boolean; reward?: number }) => void;
};

export default function BTLevel50Screen({ playerId, hints, setHints, onExit, onComplete }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const u = Math.max(0.7, Math.min(1, H / 820));
  const bulbSize = Math.round(84 * u);
  const matH = Math.round(98 * Math.max(u, 0.85));

  const [info, setInfo] = useState<Level50Info | null>(null);
  const [bulbs, setBulbs] = useState<boolean[]>([false, false, false]);
  const [sw, setSw] = useState<boolean[]>([false, false, false, false]);
  const [status, setStatus] = useState<'' | 'ok' | 'bad'>('');
  const [msg, setMsg] = useState('');
  const [loadErr, setLoadErr] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [dragging, setDragging] = useState(false);

  const movesR = useRef<Move[]>([]);
  const bulbsR = useRef<boolean[]>([false, false, false]);
  const busyR = useRef(false);
  const doneR = useRef(false);
  const dropR = useRef<(moveX: number) => void>(() => {});
  const msgTimer = useRef<any>(null);
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    setLoadErr('');
    fetchLevel50Info(playerId)
      .then((d) => {
        if (!d || !d.ok || !Array.isArray(d.switches)) throw new Error(d?.error || 'Bad level data');
        setInfo(d);
      })
      .catch((e: any) => setLoadErr(e?.name === 'AbortError' ? 'Server timeout' : e?.message || 'Server connect aagala'));
  }, [playerId, attempt]);

  const flash = (m: string, ms = 1600) => {
    setMsg(m);
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), ms);
  };

  const resetBulbPos = () =>
    Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();

  // ---- switch pressed: lights follow the rule sent by the server ----
  const toggle = (i: number) => {
    if (!info || doneR.current) return;
    const on = !sw[i];
    const nextSw = [...sw];
    nextSw[i] = on;
    setSw(nextSw);
    const rule = info.switches[i][on ? 'on' : 'off'];
    const nb = rule.map((v) => v === 1);
    bulbsR.current = nb;
    setBulbs(nb);
    movesR.current = [...movesR.current, { s: i, on }];
    setStatus('');
    setMsg('');
  };

  // ---- bulb 3 released ----
  dropR.current = async (moveX: number) => {
    setDragging(false);
    if (!info || doneR.current || busyR.current) return resetBulbPos();
    const reachedEnd = moveX >= W - 50;
    if (!reachedEnd) return resetBulbPos();

    busyR.current = true;
    try {
      const r = await submitLevel50Answer(playerId, movesR.current, true);
      if (r.correct) {
        doneR.current = true;
        setStatus('ok');
        setMsg('✅ Correct!');
        setHints(hints + (r.reward || 0));
        setTimeout(() => onComplete({ reward: r.reward }), 1300);
      } else {
        setStatus('bad');
        setMsg('❌ Wrong! Try again');
        resetBulbPos();
        setTimeout(() => {
          setStatus('');
          setMsg('');
        }, 1400);
      }
    } catch {
      flash('Network error');
      resetBulbPos();
    } finally {
      busyR.current = false;
    }
  };

  // only bulb 3 can be dragged
  const pr = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !doneR.current,
      onMoveShouldSetPanResponder: () => !doneR.current,
      onPanResponderGrant: () => setDragging(true),
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_e, g) => dropR.current(g.moveX),
      onPanResponderTerminate: () => {
        setDragging(false);
        resetBulbPos();
      },
    })
  ).current;

  const onClue = async () => {
    if (!info || doneR.current) return;
    if (hints < info.clueCost) return flash('Hints madhiri illa');
    try {
      const r = await requestLevel50Clue(playerId, hints);
      if (r.ok && r.text) {
        setHints(hints - (r.cost || 0));
        flash('💡 ' + r.text, 5000);
      } else if (r.error === 'not_enough_hints') flash('Hints madhiri illa');
    } catch {
      flash('Network error');
    }
  };

  const onSkip = async () => {
    if (!info || doneR.current) return;
    if (hints < info.skipCost) return flash('Hints madhiri illa');
    try {
      const r = await requestLevel50Skip(playerId, hints);
      if (r.ok) {
        doneR.current = true;
        setHints(hints - (r.cost || 0));
        onComplete({ skipped: true });
      }
    } catch {
      flash('Network error');
    }
  };

  if (!info) {
    return (
      <View style={[st.root, st.center]}>
        <RoomBackground width={W} height={H} />
        {!loadErr ? (
          <ActivityIndicator size="large" color={COLORS.navy} />
        ) : (
          <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
            <Text style={[st.msg, { height: undefined, fontSize: 18 }]}>{loadErr}</Text>
            <Pressable style={st.retry} onPress={() => setAttempt((a) => a + 1)}>
              <Text style={st.retryText}>Retry</Text>
            </Pressable>
            <Pressable style={{ marginTop: 16 }} onPress={onExit}>
              <Text style={st.msg}>Home</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={st.root}>
      <RoomBackground width={W} height={H} />

      {/* top bar */}
      <View style={st.topBar}>
        <View style={st.topLeft}>
          <Pressable style={st.roundBtn} onPress={onExit}>
            <Ionicons name="home" size={20} color="#222" />
          </Pressable>
          <Pressable style={st.roundBtn}>
            <Ionicons name="settings-sharp" size={20} color="#222" />
          </Pressable>
        </View>
        <LevelSign level={50} />
        <View style={st.hintPill}>
          <Text style={st.hintText}>{hints}</Text>
          <Ionicons name="bulb" size={22} color="#F5B800" />
        </View>
      </View>

      {/* notebook with the puzzle */}
      <Notebook style={[st.notebook, { marginBottom: matH + 26 }]}>
        <Text style={st.question}>{info.question}</Text>

        {/* bulbs: only bulb 3 can be dragged */}
        <View style={st.bulbRow}>
          <View style={st.bulbCell}>
            <Bulb on={bulbs[0]} size={bulbSize} />
          </View>
          <View style={st.bulbCell}>
            <Bulb on={bulbs[1]} size={bulbSize} />
          </View>
          <View style={[st.bulbCell, dragging && { zIndex: 99, elevation: 20 }]}>
            <Animated.View
              {...pr.panHandlers}
              style={[
                st.drag,
                { zIndex: 99, elevation: 20, transform: pan.getTranslateTransform() },
                // @ts-ignore (web only) show the grab cursor
                { cursor: 'grab' },
              ]}
            >
              <Bulb on={bulbs[2]} size={bulbSize} />
            </Animated.View>
          </View>
        </View>

        {/* 4 switches */}
        <View style={st.switchRow}>
          {sw.map((on, i) => (
            <View key={i} style={st.switchCell}>
              <WallSwitch on={on} onPress={() => toggle(i)} size={Math.round(66 * u)} />
            </View>
          ))}
        </View>

        <Text style={[st.msg, status === 'ok' && st.msgOk, status === 'bad' && st.msgBad]}>{msg}</Text>
      </Notebook>

      {/* bottom mat: search (clue) + skip icons */}
      <View style={st.matWrap}>
        <View style={[st.mat, { height: matH }]}>
          <View style={st.matItem}>
            <Pressable style={[st.circle, { backgroundColor: COLORS.green, borderColor: COLORS.greenRing }]} onPress={onClue}>
              <Ionicons name="search" size={32} color="#1D2B15" />
            </Pressable>
            <View style={st.cost}>
              <Ionicons name="bulb" size={13} color={COLORS.yellow} />
              <Text style={st.costText}>{info.clueCost}</Text>
            </View>
          </View>
          <View style={st.matItem}>
            <Pressable style={[st.circle, { backgroundColor: COLORS.red, borderColor: '#fff' }]} onPress={onSkip}>
              <Ionicons name="play" size={30} color="#fff" />
            </Pressable>
            <View style={st.cost}>
              <Ionicons name="bulb" size={13} color={COLORS.yellow} />
              <Text style={st.costText}>{info.skipCost}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#D5EEFB', overflow: 'hidden' },
  center: { alignItems: 'center', justifyContent: 'center' },
  topBar: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingTop: 22, paddingHorizontal: 10,
  },
  topLeft: { flexDirection: 'row', width: 92, marginTop: 8 },
  roundBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.yellow,
    borderWidth: 2, borderColor: '#222', alignItems: 'center', justifyContent: 'center', marginRight: 6,
  },
  hintPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4, marginTop: 12, minWidth: 80, justifyContent: 'center',
  },
  hintText: { fontSize: 20, fontWeight: '900', color: '#111', marginRight: 4 },
  notebook: { flex: 1, marginHorizontal: 12, marginTop: 14, paddingTop: 14, paddingHorizontal: 10, zIndex: 5 },
  question: { textAlign: 'center', fontSize: 19, color: COLORS.navy, marginTop: 8 },
  bulbRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginTop: 26 },
  bulbCell: { marginHorizontal: 10, alignItems: 'center' },
  drag: { alignItems: 'center' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 46 },
  switchCell: { marginHorizontal: 6 },
  msg: { textAlign: 'center', marginTop: 20, minHeight: 44, fontWeight: '800', fontSize: 16, color: COLORS.navy, paddingHorizontal: 8 },
  msgOk: { color: '#1E8E1E', fontSize: 22, fontWeight: '900' },
  msgBad: { color: '#D83A3A', fontSize: 22, fontWeight: '900' },
  matWrap: { position: 'absolute', left: 0, right: 0, bottom: 10, alignItems: 'center' },
  mat: {
    width: '78%', backgroundColor: COLORS.mat, borderRadius: 60, borderWidth: 6, borderColor: COLORS.matBorder,
    flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center',
  },
  matItem: { alignItems: 'center' },
  circle: {
    width: 62, height: 62, borderRadius: 31, borderWidth: 5, alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
  cost: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.brown, borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 2, marginTop: -8,
  },
  costText: { color: '#fff', fontWeight: '800', marginLeft: 3, fontSize: 14 },
  retry: { marginTop: 14, backgroundColor: COLORS.green, borderRadius: 24, paddingHorizontal: 28, paddingVertical: 10 },
  retryText: { color: '#1D2B15', fontWeight: '900', fontSize: 20 },
});
