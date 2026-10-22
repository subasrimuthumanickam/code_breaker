
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { F, INK, Stage, Coin } from './BTShared';
import { Icon } from './Art';
import { RoomBg15, VaultScene15 } from './Btlevel15art';
import * as api from './Btlevel15api';


const SKY = '#9fc6ea';
const CREAM = '#fbf6e9';
const NAVY = '#10245e';

const Round = ({ n, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={st.round}>
    <Icon n={n} s={16} />
  </TouchableOpacity>
);

export default function BTLevel15Screen({ playerId, hints, setHints, onExit, onComplete }: any) {
  const [session, setSession] = useState<api.L15Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typed, setTyped] = useState('');
  const [note, setNote] = useState('');
  const [opened, setOpened] = useState(false);
  const [busy, setBusy] = useState(false);

  const typedRef = useRef('');
  const busyRef = useRef(false);
  const doneRef = useRef(false);
  const noteTimer = useRef<any>(null);
  const shake = useRef(new Animated.Value(0)).current;
  const qIn = useRef(new Animated.Value(0)).current;

  const flash = (m: string) => {
    setNote(m);
    clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(''), 2200);
  };

  const doShake = () =>
    Animated.sequence([10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

  /* ---------- start (frontend -> backend -> db -> json) ---------- */

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const s = await api.startLevel15(playerId);
      setSession(s);
      setHints?.(s.hints);
      typedRef.current = '';
      setTyped('');
      setOpened(false);
      doneRef.current = false;
      Animated.spring(qIn, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
    } catch (e: any) {
      setError(e?.message || 'Cannot load level 15');
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    load();
    return () => clearTimeout(noteTimer.current);
  }, [load]);

  /* ---------- push the vault -> paper appears ---------- */

  const onPush = async (): Promise<boolean> => {
    if (!session) return false;
    try {
      const s = await api.moveVault(session.sessionId, playerId);
      setSession(s);
      flash('A paper was hidden behind the vault!');
      return true;
    } catch (e: any) {
      flash(e?.message || 'Network error');
      return false;
    }
  };

  /* ---------- decoy: desk and books ---------- */

  const THING_MSG: any = { books: 'Just some books. Nothing inside.', desk: 'An ordinary desk.' };

  const onThing = async (target: 'books' | 'desk') => {
    if (!session || doneRef.current) return;
    flash(THING_MSG[target]);
    try {
      const r = await api.tapThing(session.sessionId, playerId, target);
      flash(r.message);
    } catch {
      /* local message is enough */
    }
  };

  /* ---------- keypad ---------- */

  const submit = async (code: string) => {
    if (!session || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      const r = await api.enterCode(session.sessionId, playerId, code);
      if (r.correct) {
        doneRef.current = true;
        setOpened(true);
        flash(r.message);
        setTimeout(() => onComplete?.({ ...r, attempts: r.attempts ?? 1, skipped: false }), 1100);
      } else {
        doShake();
        flash(r.message);
        typedRef.current = '';
        setTyped('');
      }
    } catch (e: any) {
      flash(e?.message || 'Network error');
      typedRef.current = '';
      setTyped('');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const onKey = (digit: string) => {
    if (!session || busyRef.current || doneRef.current) return;
    if (typedRef.current.length >= session.codeLength) return;
    typedRef.current += digit;
    setTyped(typedRef.current);
    if (typedRef.current.length === session.codeLength) submit(typedRef.current);
  };

  /* ---------- hint / video / skip ---------- */

  const hint = async () => {
    if (!session || doneRef.current) return;
    try {
      const r = await api.buyHint(session.sessionId, playerId);
      setHints?.(r.hints);
      flash(r.message);
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : e?.message || 'Network error');
    }
  };

  const reward = async () => {
    try {
      const r = await api.rewardHints(playerId);
      setHints?.(r.hints);
      flash(`+${r.added} hints`);
    } catch (e: any) {
      flash(e?.message || 'Network error');
    }
  };

  const skip = async () => {
    if (!session || doneRef.current) return;
    try {
      const r = await api.skipLevel(session.sessionId, playerId);
      doneRef.current = true;
      setHints?.(r.hints);
      onComplete?.({ attempts: Math.max(1, session.wrongAttempts), skipped: true });
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : e?.message || 'Network error');
    }
  };

  /* ---------- loading / error ---------- */

  if (loading || error || !session) {
    return (
      <Stage bg={SKY}>
        <View style={st.wall}>
          <RoomBg15 />
          <View style={st.center}>
            <Text style={st.load}>{error || 'Loading level 15...'}</Text>
            {!!error && (
              <>
                <TouchableOpacity style={st.tryBtn} onPress={load}>
                  <Text style={st.tryTxt}>Try again</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onExit}>
                  <Text style={st.back}>Back</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Stage>
    );
  }

  /* ---------- game ---------- */

  const qY = qIn.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

  return (
    <Stage bg={SKY}>
      <View style={st.wall}>
        <RoomBg15 />
        <View style={st.board}>
          {/* top bar */}
          <View style={st.top}>
            <View style={st.topL}>
              <Round n="home" onPress={onExit} />
              <Round n="gear" />
            </View>
            <View style={st.signWrap}>
              <View style={[st.string, { left: 26, transform: [{ rotate: '12deg' }] }]} />
              <View style={[st.string, { right: 26, transform: [{ rotate: '-12deg' }] }]} />
              <View style={st.sign}>
                <View style={[st.leafTop, { left: -8, transform: [{ rotate: '-30deg' }] }]} />
                <View style={[st.leafTop, { right: -8, transform: [{ rotate: '30deg' }] }]} />
                <Text style={st.signt}>LEVEL 15</Text>
              </View>
            </View>
            <View style={st.topR}>
              <View style={st.bpill}>
                <Text style={st.bpt}>{hints}</Text>
                <View style={{ position: 'absolute', right: -14, top: -10 }}>
                  <Icon n="bulb" s={34} />
                </View>
              </View>
            </View>
          </View>

          {/* question */}
          <Animated.View style={[st.qWrap, { opacity: qIn, transform: [{ translateY: qY }] }]}>
            <Text style={st.q}>We must open this vault.</Text>
          </Animated.View>

          {/* vault picture */}
          <Animated.View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 130, transform: [{ translateX: shake }] }}>
            <VaultScene15
              moved={session.vaultMoved}
              code={session.code}
              opened={opened}
              typed={typed}
              codeLength={session.codeLength}
              onKey={onKey}
              onThing={onThing}
              onPush={onPush}
              disabled={busy || opened}
            />
          </Animated.View>

          {/* hint / video / skip */}
          <View style={st.actions}>
            <View style={st.acol}>
              <TouchableOpacity style={st.hintBtn} onPress={hint}>
                <Icon n="search" s={34} />
              </TouchableOpacity>
              <View style={st.lblRow}>
                <Icon n="bulb" s={14} />
                <Text style={st.lbl}>25</Text>
              </View>
            </View>
            <View style={st.acol}>
              <TouchableOpacity style={st.videoBtn} onPress={reward}>
                <Icon n="film" s={40} />
              </TouchableOpacity>
              <View style={st.lblRow}>
                <Coin s={12} />
                <Text style={st.lbl}>+75</Text>
              </View>
            </View>
            <View style={st.acol}>
              <TouchableOpacity style={st.skipBtn} onPress={skip}>
                <Icon n="play" s={36} />
              </TouchableOpacity>
              <View style={st.lblRow}>
                <Icon n="bulb" s={14} />
                <Text style={st.lbl}>50</Text>
              </View>
            </View>
          </View>

          {!!note && <Text style={st.note}>{note}</Text>}
        </View>
      </View>
    </Stage>
  );
}

/* ---------- styles (same look as the Level 1 room) ---------- */

const st = StyleSheet.create({
  wall: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
  board: { flex: 1, alignItems: 'center', paddingTop: 30 },
  center: { position: 'absolute', left: 0, right: 0, top: '42%', alignItems: 'center', gap: 14 },
  load: { fontFamily: F, fontSize: 22, color: NAVY, textAlign: 'center', paddingHorizontal: 20 },
  tryBtn: { backgroundColor: '#a8e22a', borderWidth: 3, borderColor: INK, borderRadius: 30, paddingHorizontal: 36, paddingVertical: 10 },
  tryTxt: { fontFamily: F, fontSize: 24, fontWeight: '900', color: INK },
  back: { fontFamily: F, fontSize: 20, color: NAVY, textDecorationLine: 'underline' },

  round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ffe27a', borderWidth: 2, borderColor: INK, alignItems: 'center', justifyContent: 'center' },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 8, width: '100%' },
  topL: { flexDirection: 'row', gap: 6, minWidth: 80, marginTop: 10 },
  topR: { minWidth: 80, alignItems: 'flex-end', marginTop: 14, paddingRight: 14 },
  signWrap: { alignItems: 'center', paddingTop: 14 },
  string: { position: 'absolute', top: -6, width: 2, height: 22, backgroundColor: '#9a6a3a' },
  sign: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#a8601f', borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 } },
  leafTop: { position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: '#5fae3a' },
  signt: { fontFamily: F, fontSize: 22, fontWeight: 'bold', color: '#fff' },
  bpill: { backgroundColor: '#fff', borderRadius: 16, height: 30, minWidth: 58, paddingLeft: 12, paddingRight: 18, justifyContent: 'center', borderWidth: 2, borderColor: '#e6e6e6' },
  bpt: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK },
  qWrap: { backgroundColor: CREAM, borderRadius: 30, paddingHorizontal: 22, paddingVertical: 10, marginTop: 22, elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  q: { fontFamily: F, fontSize: 22, fontWeight: 'bold', color: NAVY, textAlign: 'center' },

  actions: { position: 'absolute', left: 0, right: 0, bottom: 34, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 34 },
  acol: { alignItems: 'center' },
  lblRow: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 26, marginTop: 6, paddingHorizontal: 12, borderRadius: 13, backgroundColor: '#6b4423' },
  lbl: { fontFamily: F, fontSize: 15, fontWeight: 'bold', color: '#fff' },
  hintBtn: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#a8e22a', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  videoBtn: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#f3efe2', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  skipBtn: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#f0484f', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  note: { position: 'absolute', bottom: 6, alignSelf: 'center', fontFamily: F, fontSize: 17, fontWeight: 'bold', color: '#c0392b', textAlign: 'center', paddingHorizontal: 12 },
});
