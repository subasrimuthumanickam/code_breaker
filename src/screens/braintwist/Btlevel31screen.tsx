import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Icon } from './Art';
import { F, INK, Stage, Coin, loop } from './BTShared';
import { RoomBg } from './Btlevel29art';
import { NotebookCard } from './Btlevel31art';
import {
  startLevel31,
  answerLevel31,
  hintLevel31,
  skipLevel31,
  rewardLevel31,
  Level31Data,
  BASE_URL,
} from './Btlevel31api';

interface Props {
  playerId: any;
  hints: number;
  setHints?: (v: number) => void;
  onHints?: (v: number) => void;
  onExit?: () => void;
  onComplete?: (r: any) => void;
}

const NAVY = '#10245e';
const CREAM = '#fbf3e0';
const SKY = '#9fc6ea';
const ORANGE = '#e8912e';

const Round = ({ n, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={s.round}>
    <Icon n={n} s={16} />
  </TouchableOpacity>
);

const Btlevel31screen: React.FC<Props> = ({ playerId, hints, setHints, onHints, onExit, onComplete }) => {
  const [data, setData] = useState<Level31Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState('');
  const [note, setNote] = useState('');
  const [noteOk, setNoteOk] = useState(false);
  const [solved, setSolved] = useState(false);
  const [clue, setClue] = useState('');
  const [showClue, setShowClue] = useState(false);
  const busy = useRef(false);
  const shake = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const cardIn = useRef(new Animated.Value(0)).current;

  const updateHints = (v: number) => {
    setHints?.(v);
    onHints?.(v);
  };

  const flash = (m: string, ok = false) => {
    setNote(m);
    setNoteOk(ok);
    setTimeout(() => setNote(''), 1800);
  };

  const doShake = () =>
    Animated.sequence([10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const d = await startLevel31(playerId);
      setData(d);
      setSolved(d.progress.solved);
      if (typeof d.hints === 'number') updateHints(d.hints);
    } catch (e: any) {
      console.log('[Level31] load failed:', e?.url || BASE_URL, e?.message);
      setError('Server connect aagala.\n' + (e?.url || BASE_URL) + '\n' + (e?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [playerId]);

  useEffect(() => {
    loop(sway, 1800);
  }, []);

  useEffect(() => {
    if (data) Animated.spring(cardIn, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
  }, [!!data]);

  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] }),
    cardY = cardIn.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

  // CHECK: send the typed word to the backend
  const check = async () => {
    const text = answer.trim();
    if (!text || solved || busy.current) return;
    busy.current = true;
    try {
      const r = await answerLevel31(playerId, text);
      if (r.correct) {
        setSolved(true);
        flash('Correct! 🎉', true);
        setTimeout(() => onComplete?.({ correct: true, attempts: r.attempts, skipped: false }), 1100);
      } else {
        doShake();
        flash('Not quite. Try again!');
      }
    } catch (e: any) {
      flash('Network error');
    } finally {
      busy.current = false;
    }
  };

  // search icon: the backend sends the clue, the CLUES popup opens
  const clueBtn = async () => {
    if (!data || busy.current || solved) return;
    if ((Number(hints) || 0) < data.hintCost) {
      flash(`Need ${data.hintCost} hints. You have ${Number(hints) || 0}.`);
      return;
    }
    busy.current = true;
    try {
      const r = await hintLevel31(playerId);
      updateHints(r.hints);
      setClue(r.hint.text);
      setShowClue(true);
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
    } finally {
      busy.current = false;
    }
  };

  // video icon: +75 hints
  const reward = async () => {
    if (busy.current || solved) return;
    busy.current = true;
    try {
      const r = await rewardLevel31(playerId);
      updateHints(r.hints);
      flash('+' + r.added + ' hints', true);
    } catch (e: any) {
      flash('Network error');
    } finally {
      busy.current = false;
    }
  };

  // skip icon
  const skip = async () => {
    if (!data || busy.current || solved) return;
    if ((Number(hints) || 0) < data.skipCost) {
      flash(`Need ${data.skipCost} hints. You have ${Number(hints) || 0}.`);
      return;
    }
    busy.current = true;
    try {
      const r = await skipLevel31(playerId);
      updateHints(r.hints);
      setSolved(true);
      onComplete?.({ skipped: true, attempts: r.attempts });
    } catch (e: any) {
      flash(e?.status === 402 ? 'Not enough hints' : 'Network error');
    } finally {
      busy.current = false;
    }
  };

  if (loading) {
    return (
      <Stage bg={SKY}>
        <View style={s.wall}>
          <RoomBg />
          <View style={[s.board, { justifyContent: 'center' }]}>
            <ActivityIndicator size="large" color="#F28C28" />
          </View>
        </View>
      </Stage>
    );
  }

  if (error || !data) {
    return (
      <Stage bg={SKY}>
        <View style={s.wall}>
          <RoomBg />
          <View style={[s.board, { justifyContent: 'center', paddingHorizontal: 20 }]}>
            <Text style={s.errorText}>{error || 'No data'}</Text>
            <TouchableOpacity style={[s.checkBtn, { marginTop: 16 }]} onPress={load}>
              <Text style={s.checkText}>RETRY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.checkBtn, { marginTop: 10, backgroundColor: ORANGE }]} onPress={onExit}>
              <Text style={s.checkText}>HOME</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Stage>
    );
  }

  return (
    <Stage bg={SKY}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.wall}>
          <RoomBg />
          <View style={s.board}>
            {/* top bar */}
            <View style={s.top}>
              <View style={s.topL}>
                <Round n="home" onPress={onExit} />
                <Round n="gear" />
              </View>
              <Animated.View style={[s.signWrap, { transform: [{ rotate: swayR }] }]}>
                <View style={[s.string, { left: 26, transform: [{ rotate: '12deg' }] }]} />
                <View style={[s.string, { right: 26, transform: [{ rotate: '-12deg' }] }]} />
                <View style={s.sign}>
                  <View style={[s.leafTop, { left: -8, transform: [{ rotate: '-30deg' }] }]} />
                  <View style={[s.leafTop, { right: -8, transform: [{ rotate: '30deg' }] }]} />
                  <Text style={s.arrow}>{'<'}</Text>
                  <Text style={s.signt}>LEVEL 31</Text>
                  <Text style={s.arrow}>{'>'}</Text>
                </View>
              </Animated.View>
              <View style={s.topR}>
                <View style={s.bpill}>
                  <Text style={s.bpt}>{Number(hints) || 0}</Text>
                  <View style={{ position: 'absolute', right: -14, top: -10 }}>
                    <Icon n="bulb" s={34} />
                  </View>
                </View>
              </View>
            </View>

            {/* notebook card: the question (with the typo!) + the alphabet */}
            <Animated.View style={{ width: '100%', alignItems: 'center', marginTop: 26, opacity: cardIn, transform: [{ translateY: cardY }] }}>
              <NotebookCard>
                <View style={s.qWrap}>
                  <Text style={s.q}>{data.question}</Text>
                </View>

                <View style={s.lines}>
                  {data.lines.map((ln, i) => (
                    <Text key={i} style={s.lineT} numberOfLines={1} adjustsFontSizeToFit>
                      {ln}
                    </Text>
                  ))}
                </View>
              </NotebookCard>
            </Animated.View>

            {/* empty answer box: type the repeated word */}
            <Animated.View style={{ width: '100%', alignItems: 'center', marginTop: 18, transform: [{ translateX: shake }] }}>
              <View style={s.answerRow}>
                <TextInput
                  style={s.input}
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="Type your answer..."
                  placeholderTextColor="#B9B2A0"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  editable={!solved}
                  onSubmitEditing={check}
                />
                <TouchableOpacity style={[s.checkBtn, (solved || !answer.trim()) && { opacity: 0.5 }]} onPress={check} disabled={solved}>
                  <Text style={s.checkText}>CHECK</Text>
                </TouchableOpacity>
              </View>
              <Text style={[s.note, noteOk && { color: '#2e8b3d' }]}>{note}</Text>
            </Animated.View>
          </View>

          {/* bottom rounded panel: search / video / skip */}
          <View style={s.panel}>
            <View style={s.btnCol}>
              <TouchableOpacity style={s.ringGreen} activeOpacity={0.85} onPress={clueBtn}>
                <View style={s.circleGreen}>
                  <Icon n="search" s={32} />
                </View>
              </TouchableOpacity>
              <View style={s.badge}>
                <Icon n="bulb" s={13} />
                <Text style={s.badgeT}>{data.hintCost}</Text>
              </View>
            </View>

            <View style={s.btnCol}>
              <TouchableOpacity style={s.ringWhite} activeOpacity={0.85} onPress={reward}>
                <Icon n="film" s={36} />
              </TouchableOpacity>
              <View style={s.badge}>
                <Coin s={12} />
                <Text style={s.badgeT}>+{data.videoReward}</Text>
              </View>
            </View>

            <View style={s.btnCol}>
              <TouchableOpacity style={s.ringWhite} activeOpacity={0.85} onPress={skip}>
                <View style={s.circleRed}>
                  <Icon n="play" s={30} />
                </View>
              </TouchableOpacity>
              <View style={s.badge}>
                <Icon n="bulb" s={13} />
                <Text style={s.badgeT}>{data.skipCost}</Text>
              </View>
            </View>
          </View>

          {/* CLUES popup (only from the search icon) */}
          {showClue && (
            <View style={s.overlay}>
              <View style={s.clueCard}>
                <TouchableOpacity style={s.closeBtn} activeOpacity={0.85} onPress={() => setShowClue(false)}>
                  <Text style={s.closeT}>✕</Text>
                </TouchableOpacity>
                <Text style={s.clueTitle}>CLUES</Text>
                <View style={s.clueRow}>
                  <View style={s.clueNum}>
                    <Text style={s.clueNumT}>1</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.clueHead}>Clue 1</Text>
                    <Text style={s.clueBody}>{clue}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Stage>
  );
};

export default Btlevel31screen;

const s = StyleSheet.create({
  wall: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
  board: { flex: 1, alignItems: 'center', paddingTop: 30, paddingBottom: 134 },
  errorText: { fontFamily: F, fontSize: 16, color: NAVY, fontWeight: 'bold', textAlign: 'center' },

  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 8, width: '100%' },
  topL: { flexDirection: 'row', gap: 6, minWidth: 80, marginTop: 10 },
  topR: { minWidth: 80, alignItems: 'flex-end', marginTop: 14, paddingRight: 14 },
  round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ffe27a', borderWidth: 2, borderColor: INK, alignItems: 'center', justifyContent: 'center' },

  signWrap: { alignItems: 'center', paddingTop: 14 },
  string: { position: 'absolute', top: -6, width: 2, height: 22, backgroundColor: '#9a6a3a' },
  sign: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#c8742b', borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 } },
  leafTop: { position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: '#5fae3a' },
  signt: { fontFamily: F, fontSize: 22, fontWeight: 'bold', color: '#fff' },
  arrow: { fontFamily: F, fontSize: 20, fontWeight: '900', color: '#ffc83d' },

  bpill: { backgroundColor: '#fff', borderRadius: 16, height: 30, minWidth: 58, paddingLeft: 12, paddingRight: 18, justifyContent: 'center', borderWidth: 2, borderColor: '#e6e6e6' },
  bpt: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK },

  qWrap: { backgroundColor: '#fde6b0', borderWidth: 2, borderColor: '#f0c26a', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16, width: '100%' },
  q: { fontFamily: F, fontSize: 17, fontWeight: 'bold', color: NAVY, textAlign: 'center' },

  lines: { width: '100%', marginTop: 16, gap: 10 },
  lineT: { fontFamily: F, fontSize: 18, fontWeight: '900', color: NAVY, textAlign: 'center', letterSpacing: 0.5 },

  answerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, width: '94%', maxWidth: 380 },
  input: { flex: 1, height: 50, borderWidth: 3, borderColor: '#F3C14B', borderRadius: 14, backgroundColor: '#fff', paddingHorizontal: 14, fontSize: 18, fontWeight: '700', color: NAVY },
  checkBtn: { backgroundColor: '#7CC043', paddingHorizontal: 18, paddingVertical: 13, borderRadius: 14 },
  checkText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  note: { marginTop: 10, minHeight: 22, fontFamily: F, fontSize: 16, fontWeight: 'bold', color: '#c0392b', textAlign: 'center' },

  panel: { position: 'absolute', left: 16, right: 16, bottom: 14, height: 112, borderRadius: 56, backgroundColor: '#f8e9cf', borderWidth: 8, borderColor: '#b5d3ea', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 8 },
  btnCol: { alignItems: 'center' },
  ringGreen: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#c5f158', alignItems: 'center', justifyContent: 'center' },
  circleGreen: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#a3d92a', alignItems: 'center', justifyContent: 'center' },
  ringWhite: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  circleRed: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ee4558', alignItems: 'center', justifyContent: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4, paddingHorizontal: 10, height: 22, borderRadius: 11, backgroundColor: '#7b4a22' },
  badgeT: { fontFamily: F, fontSize: 13, fontWeight: '900', color: '#fff' },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  clueCard: { width: '86%', maxWidth: 360, backgroundColor: '#f9efdf', borderColor: ORANGE, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
  clueTitle: { fontFamily: F, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
  closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: '#ffe27a', borderWidth: 3, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  closeT: { fontSize: 18, fontWeight: '900', color: '#ee4558' },
  clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12, backgroundColor: '#fff', borderColor: '#3ec45a' },
  clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#c0702b', alignItems: 'center', justifyContent: 'center' },
  clueNumT: { fontFamily: F, fontSize: 28, fontWeight: '900', color: '#fff' },
  clueHead: { fontFamily: F, fontSize: 20, fontWeight: '900', color: '#c0702b' },
  clueBody: { fontFamily: F, fontSize: 16, fontStyle: 'italic', color: NAVY, marginTop: 2 },
});
