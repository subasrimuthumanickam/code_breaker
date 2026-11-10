
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  bt35Answer,
  bt35Hint,
  bt35Reward,
  bt35Skip,
  bt35Start,
} from './Btlevel35api';
import {
  BTBulbIcon,
  BTCoinIcon,
  BTIconButtonGlyph,
  BTMagnifierIcon,
  BTPaperArt,
  BTPlayIcon,
  BTRockArt,
  BTScissorsArt,
  BTVideoIcon,
} from './Btlevel35art';

const HINT_COST = 25;
const SKIP_COST = 50; // keep in sync with the backend costs
const REWARD = 75;
const CORRECT_ANSWER = '052';

const NAVY = '#10245e';
const WOOD = '#e8a45a';
const WOOD_DARK = '#a8601f';

type Props = {
  playerId: any;
  hints?: any;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onComplete?: (r: any) => void;
};

/* ---------- room background (same theme as Level 1) ---------- */
function Room() {
  return (
    <View style={r.room} pointerEvents="none">
      <View style={r.wall} />

      <View style={r.window}>
        <View style={r.windowGlass}>
          <View style={[r.cloud, { top: 30, left: 6, width: 34 }]} />
          <View style={[r.cloud, { top: 62, left: 0, width: 24 }]} />
        </View>
      </View>
      <View style={r.sill} />

      <View style={r.plant}>
        <View style={[r.leaf, { left: 4, height: 50, transform: [{ rotate: '-18deg' }] }]} />
        <View style={[r.leaf, { left: 22, height: 62 }]} />
        <View style={[r.leaf, { left: 40, height: 50, transform: [{ rotate: '18deg' }] }]} />
        <View style={r.pot}>
          <View style={r.eye} />
          <View style={[r.eye, { marginLeft: 8 }]} />
        </View>
      </View>

      <View style={r.picture}>
        <View style={r.pictureSun} />
      </View>

      <View style={r.shelf}>
        <View style={[r.book, { left: 10, height: 48, backgroundColor: '#3aa0e0' }]} />
        <View style={[r.book, { left: 28, height: 52, backgroundColor: '#8a5fd6' }]} />
        <View style={[r.book, { left: 10, top: 80, height: 40, backgroundColor: '#3a7fc4' }]} />
        <View style={[r.book, { left: 28, top: 76, height: 44, backgroundColor: '#2fae9b' }]} />
        <View style={[r.shelfBoard, { top: 62 }]} />
        <View style={[r.shelfBoard, { top: 128 }]} />
      </View>

      <View style={r.cup} />

      <View style={r.baseboard} />
      <View style={r.floor}>
        <View style={[r.plank, { top: '30%' }]} />
        <View style={[r.plank, { top: '65%' }]} />
      </View>

      <View style={r.bush} />
    </View>
  );
}

export default function BTLevel35Screen({
  playerId,
  hints,
  setHints,
  onExit,
  onComplete,
}: Props) {
  const [bulbs, setBulbs] = useState<number | null>(null);
  const [digits, setDigits] = useState('');
  const [note, setNote] = useState('');
  const [hintText, setHintText] = useState('');
  const [done, setDone] = useState(false);
  const busy = useRef(false);
  const finished = useRef(false);
  const inputRef = useRef<TextInput>(null);
  const shake = useRef(new Animated.Value(0)).current;

  // the shared hint balance wins; fall back to the one the server sent
  const bal = Number(hints ?? bulbs ?? 0);

  const flash = (m: string) => {
    setNote(m);
    setTimeout(() => setNote(''), 1800);
  };

  const syncBalance = (n: number) => {
    setBulbs(n);
    if (setHints) setHints(n);
  };

  useEffect(() => {
    bt35Start(playerId)
      .then((res) => syncBalance(res.hints))
      .catch((e: any) => flash(e.message));
  }, [playerId]);

  const doShake = () => {
    shake.setValue(0);
    Animated.sequence(
      [10, -10, 6, -6, 0].map((v) =>
        Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true })
      )
    ).start();
  };

  // level won (by answer or by skip) -> show the tick, then tell the app
  const win = (attempts: number, skipped: boolean) => {
    if (finished.current) return;
    finished.current = true;
    setDone(true);
    setTimeout(() => {
      if (onComplete) {
        onComplete({ correct: true, attempts: Math.max(1, attempts), skipped });
      }
    }, 1200);
  };

  const wrong = () => {
    doShake();
    flash('Not quite. Try again!');
    setTimeout(() => setDigits(''), 600);
  };

  const submit = async (guess: string) => {
    if (busy.current || done) return;
    busy.current = true;
    try {
      const res = await bt35Answer(playerId, guess);
      if (res && typeof res.hints === 'number') syncBalance(res.hints);
      if (res?.correct || guess === CORRECT_ANSWER) {
        win(res?.attempts ?? 1, false);
      } else {
        wrong();
      }
    } catch (e: any) {
      // server problem: still accept the right answer locally
      if (guess === CORRECT_ANSWER) {
        win(1, false);
      } else {
        flash(e?.message || 'Something went wrong');
        setDigits('');
      }
    } finally {
      busy.current = false;
    }
  };

  // digits only, max 3; the 3rd digit checks the answer
  const onChangeDigits = (text: string) => {
    if (busy.current || done) return;
    const clean = text.replace(/\D/g, '').slice(0, 3);
    setDigits(clean);
    if (clean.length === 3) submit(clean);
  };

  const onEnter = () => {
    if (digits.length === 3) submit(digits);
    else flash('Type all 3 digits');
  };

  const onHint = async () => {
    if (busy.current || done) return;
    if (bal < HINT_COST) {
      flash('Need ' + HINT_COST + ' hints. You have ' + bal + '.');
      return;
    }
    busy.current = true;
    try {
      const res = await bt35Hint(playerId);
      syncBalance(res.hints);
      setHintText(res.hint.text);
    } catch (e: any) {
      flash(e.status === 402 ? 'Not enough hints' : e.message);
    } finally {
      busy.current = false;
    }
  };

  const onVideo = async () => {
    if (busy.current || done) return;
    busy.current = true;
    try {
      // TODO: show your rewarded-ad SDK here and call the API only after it finishes
      const res = await bt35Reward(playerId);
      syncBalance(res.hints);
      flash('+' + REWARD + ' hints!');
    } catch (e: any) {
      flash(e.message);
    } finally {
      busy.current = false;
    }
  };

  const onSkip = async () => {
    if (busy.current || done) return;
    if (bal < SKIP_COST) {
      flash('Need ' + SKIP_COST + ' hints. You have ' + bal + '.');
      return;
    }
    busy.current = true;
    try {
      const res = await bt35Skip(playerId);
      syncBalance(res.hints);
      setDigits(res.answer);
      win(res.attempts, true);
    } catch (e: any) {
      flash(e.status === 402 ? 'Not enough hints' : e.message);
    } finally {
      busy.current = false;
    }
  };

  const slots = [0, 1, 2].map((i) => digits[i] || '?');

  return (
    <View style={s.root}>
      <Room />

      <View style={s.topBar}>
        <View style={s.roundBtnRow}>
          <Pressable style={s.roundBtn} onPress={onExit}>
            <BTIconButtonGlyph glyph={'⌂'} />
          </Pressable>
          <Pressable style={s.roundBtn}>
            <BTIconButtonGlyph glyph={'⚙'} />
          </Pressable>
        </View>

        <View style={s.signWrap}>
          <View style={[s.string, { left: 22, transform: [{ rotate: '10deg' }] }]} />
          <View style={[s.string, { right: 22, transform: [{ rotate: '-10deg' }] }]} />
          <View style={s.sign}>
            <Text style={s.arrow}>{'<'}</Text>
            <Text style={s.signText}>LEVEL 35</Text>
            <Text style={s.arrow}>{'>'}</Text>
          </View>
        </View>

        <View style={s.bulbPill}>
          <Text style={s.bulbText}>{bal}</Text>
          <BTBulbIcon size={16} />
        </View>
      </View>

      <View style={s.titleBar}>
        <Text style={s.arrow}>{'<'}</Text>
        <Text style={s.titleText}>Guess the number</Text>
        <Text style={s.arrow}>{'>'}</Text>
      </View>

      <View style={s.card}>
        <View style={s.redPill}>
          <View style={s.symbolTile}>
            <BTRockArt />
          </View>
          <View style={s.symbolTile}>
            <BTPaperArt />
          </View>
          <View style={s.symbolTile}>
            <BTScissorsArt />
          </View>
        </View>

        <View style={s.equalsWrap}>
          <View style={s.equalsBar} />
          <View style={s.equalsBar} />
        </View>

        <Pressable onPress={() => inputRef.current?.focus()}>
          <Animated.View style={[s.bluePill, { transform: [{ translateX: shake }] }]}>
            {slots.map((d, i) => (
              <View key={i} style={s.answerTile}>
                <Text style={s.answerText}>{d}</Text>
              </View>
            ))}
          </Animated.View>
        </Pressable>

        {/* empty box, no placeholder: type 052 */}
        <TextInput
          ref={inputRef}
          style={s.input}
          value={digits}
          onChangeText={onChangeDigits}
          onSubmitEditing={onEnter}
          keyboardType="number-pad"
          returnKeyType="done"
          maxLength={3}
          editable={!done}
          autoFocus
        />

        <Text style={s.hintText}>{hintText}</Text>
        <Text style={s.messageText}>{note}</Text>

        {done ? (
          <View style={s.solvedOverlay}>
            <Text style={s.solvedTitle}>Correct!</Text>
            <Text style={s.solvedSub}>0 5 2</Text>
          </View>
        ) : null}
      </View>

      <View style={s.bottomBar}>
        <View style={s.actionCol}>
          <Pressable style={[s.actionBtn, s.hintBtn]} onPress={onHint}>
            <BTMagnifierIcon />
          </Pressable>
          <View style={s.costPill}>
            <BTBulbIcon size={12} />
            <Text style={s.costText}>{HINT_COST}</Text>
          </View>
        </View>

        <View style={s.actionCol}>
          <Pressable style={[s.actionBtn, s.adBtn]} onPress={onVideo}>
            <BTVideoIcon />
          </Pressable>
          <View style={s.costPill}>
            <BTCoinIcon size={14} />
            <Text style={s.costText}>{'+' + REWARD}</Text>
          </View>
        </View>

        <View style={s.actionCol}>
          <Pressable style={[s.actionBtn, s.skipBtn]} onPress={onSkip}>
            <BTPlayIcon />
          </Pressable>
          <View style={s.costPill}>
            <BTBulbIcon size={12} />
            <Text style={s.costText}>{SKIP_COST}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/* ---------- room styles ---------- */
const r = StyleSheet.create({
  room: { ...StyleSheet.absoluteFillObject },
  wall: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#aed3f2',
  },
  window: {
    position: 'absolute',
    top: 70,
    left: -4,
    width: 100,
    height: 190,
    borderWidth: 6,
    borderColor: WOOD,
    backgroundColor: WOOD,
  },
  windowGlass: {
    flex: 1,
    backgroundColor: '#8fd0f7',
    overflow: 'hidden',
  },
  cloud: {
    position: 'absolute',
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff',
  },
  sill: {
    position: 'absolute',
    top: 258,
    left: 0,
    width: 120,
    height: 12,
    backgroundColor: WOOD,
  },
  plant: {
    position: 'absolute',
    top: 188,
    left: 14,
    width: 70,
    height: 72,
  },
  leaf: {
    position: 'absolute',
    bottom: 26,
    width: 22,
    borderRadius: 14,
    backgroundColor: '#6cc04a',
  },
  pot: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    width: 46,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f1ead8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#8a7a5a',
  },
  picture: {
    position: 'absolute',
    top: 100,
    right: 24,
    width: 88,
    height: 100,
    backgroundColor: '#cfe4f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pictureSun: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f4a53a',
    borderWidth: 5,
    borderColor: '#f9d27a',
  },
  shelf: {
    position: 'absolute',
    right: 0,
    top: 330,
    width: 80,
    height: 200,
    backgroundColor: WOOD,
    borderTopLeftRadius: 6,
    borderWidth: 4,
    borderColor: WOOD,
  },
  shelfBoard: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: WOOD_DARK,
    opacity: 0.6,
  },
  book: {
    position: 'absolute',
    top: 10,
    width: 14,
    borderRadius: 2,
  },
  cup: {
    position: 'absolute',
    right: 24,
    bottom: 120,
    width: 40,
    height: 50,
    borderRadius: 4,
    backgroundColor: '#ffd23f',
  },
  baseboard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 150,
    height: 12,
    backgroundColor: '#f3b8c0',
  },
  floor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
    backgroundColor: '#f0b872',
    overflow: 'hidden',
  },
  plank: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#d99a52',
  },
  bush: {
    position: 'absolute',
    left: -40,
    bottom: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#4fae3a',
  },
});

/* ---------- screen styles ---------- */
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#aed3f2',
    paddingTop: 28,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  roundBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffd23f',
    borderWidth: 3,
    borderColor: '#1b2a41',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signWrap: {
    alignItems: 'center',
    paddingTop: 14,
  },
  string: {
    position: 'absolute',
    top: -6,
    width: 2,
    height: 22,
    backgroundColor: '#9a6a3a',
  },
  sign: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#a8601f',
    borderWidth: 3,
    borderColor: '#d98b3d',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  signText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  arrow: {
    color: '#ffc83d',
    fontSize: 20,
    fontWeight: '900',
  },
  bulbPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 6,
  },
  bulbText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1b2a41',
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    alignSelf: 'center',
    marginTop: 18,
    backgroundColor: '#faf1de',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    fontStyle: 'italic',
    color: NAVY,
  },
  card: {
    marginTop: 14,
    backgroundColor: 'rgba(250,241,222,0.95)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#f0cf8c',
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  redPill: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#e8574d',
    borderWidth: 4,
    borderColor: '#1b2a41',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  symbolTile: {
    width: 74,
    height: 74,
    borderRadius: 16,
    backgroundColor: '#ffc94a',
    borderWidth: 3,
    borderColor: '#e39a1c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  equalsWrap: {
    marginVertical: 12,
    gap: 6,
  },
  equalsBar: {
    width: 30,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f4a730',
  },
  bluePill: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#12a4f5',
    borderWidth: 4,
    borderColor: '#1b2a41',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  answerTile: {
    width: 74,
    height: 74,
    borderRadius: 16,
    backgroundColor: '#2fae5b',
    borderWidth: 3,
    borderColor: '#1b2a41',
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerText: {
    fontSize: 38,
    fontWeight: '900',
    color: '#ffffff',
  },
  input: {
    marginTop: 16,
    width: 220,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: NAVY,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 6,
    color: NAVY,
  },
  hintText: {
    marginTop: 10,
    minHeight: 20,
    fontSize: 14,
    fontWeight: '700',
    color: '#5b4a2a',
    textAlign: 'center',
  },
  messageText: {
    minHeight: 20,
    fontSize: 14,
    fontWeight: '800',
    color: '#d93a3a',
    textAlign: 'center',
  },
  solvedOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    backgroundColor: 'rgba(250,241,222,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solvedTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#2fae5b',
  },
  solvedSub: {
    marginTop: 6,
    fontSize: 26,
    fontWeight: '900',
    color: NAVY,
    letterSpacing: 6,
  },
  bottomBar: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f5e8d0',
    borderWidth: 6,
    borderColor: '#bcd9ee',
    borderRadius: 50,
    paddingVertical: 12,
  },
  actionCol: {
    alignItems: 'center',
  },
  actionBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
  },
  hintBtn: {
    backgroundColor: '#a8e22a',
    borderColor: '#d6f58a',
  },
  adBtn: {
    backgroundColor: '#ffffff',
    borderColor: '#f3f3f3',
  },
  skipBtn: {
    backgroundColor: '#f0484f',
    borderColor: '#ffffff',
  },
  costPill: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#7a4a1f',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  costText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
});