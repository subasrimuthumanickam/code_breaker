
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
// import { F, INK, Stage, Coin } from './BTShared';
// import { Icon } from './Art';
// import { RoomBg15, VaultScene15 } from './Btlevel15art';
// import * as api from './Btlevel15api';


// // same light blue wall as Level 1 (if Level 1 uses another value, copy it here)
// const SKY = '#b3d6f0';
// const CREAM = '#fbf6e9';
// const NAVY = '#10245e';

// const Round = ({ n, onPress }: any) => (
//   <TouchableOpacity onPress={onPress} style={st.round}>
//     <Icon n={n} s={16} />
//   </TouchableOpacity>
// );

// export default function BTLevel15Screen({ playerId, hints, setHints, onExit, onComplete }: any) {
//   const [session, setSession] = useState<api.L15Session | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [typed, setTyped] = useState('');
//   const [note, setNote] = useState('');
//   const [opened, setOpened] = useState(false);
//   const [busy, setBusy] = useState(false);
//   const [clue, setClue] = useState('');
//   const [showClues, setShowClues] = useState(false);

//   const typedRef = useRef('');
//   const busyRef = useRef(false);
//   const doneRef = useRef(false);
//   const noteTimer = useRef<any>(null);
//   const shake = useRef(new Animated.Value(0)).current;
//   const qIn = useRef(new Animated.Value(0)).current;

//   const flash = (m: string) => {
//     setNote(m);
//     clearTimeout(noteTimer.current);
//     noteTimer.current = setTimeout(() => setNote(''), 2200);
//   };

//   const doShake = () =>
//     Animated.sequence([10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

//   /* ---------- start (frontend -> backend -> db -> json) ---------- */

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const s = await api.startLevel15(playerId);
//       setSession(s);
//       setHints?.(s.hints);
//       typedRef.current = '';
//       setTyped('');
//       setOpened(false);
//       doneRef.current = false;
//       Animated.spring(qIn, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
//     } catch (e: any) {
//       setError(e?.message || 'Cannot load level 15');
//     } finally {
//       setLoading(false);
//     }
//   }, [playerId]);

//   useEffect(() => {
//     load();
//     return () => clearTimeout(noteTimer.current);
//   }, [load]);

//   /* ---------- push the vault -> paper appears ---------- */

//   const onPush = async (): Promise<boolean> => {
//     if (!session) return false;
//     try {
//       const s = await api.moveVault(session.sessionId, playerId);
//       setSession(s);
//       flash('A paper was hidden behind the vault!');
//       return true;
//     } catch (e: any) {
//       flash(e?.message || 'Network error');
//       return false;
//     }
//   };

//   /* ---------- decoy: desk and books ---------- */

//   const THING_MSG: any = { books: 'Just some books. Nothing inside.', desk: 'An ordinary desk.' };

//   const onThing = async (target: 'books' | 'desk') => {
//     if (!session || doneRef.current) return;
//     flash(THING_MSG[target]);
//     try {
//       const r = await api.tapThing(session.sessionId, playerId, target);
//       flash(r.message);
//     } catch {
//       /* local message is enough */
//     }
//   };

//   /* ---------- keypad ---------- */

//   const submit = async (code: string) => {
//     if (!session || busyRef.current) return;
//     busyRef.current = true;
//     setBusy(true);
//     try {
//       const r = await api.enterCode(session.sessionId, playerId, code);
//       if (r.correct) {
//         doneRef.current = true;
//         setOpened(true);
//         flash(r.message);
//         setTimeout(() => onComplete?.({ ...r, attempts: r.attempts ?? 1, skipped: false }), 1100);
//       } else {
//         doShake();
//         flash(r.message);
//         typedRef.current = '';
//         setTyped('');
//       }
//     } catch (e: any) {
//       flash(e?.message || 'Network error');
//       typedRef.current = '';
//       setTyped('');
//     } finally {
//       busyRef.current = false;
//       setBusy(false);
//     }
//   };

//   const onKey = (digit: string) => {
//     if (!session || busyRef.current || doneRef.current) return;
//     if (typedRef.current.length >= session.codeLength) return;
//     typedRef.current += digit;
//     setTyped(typedRef.current);
//     if (typedRef.current.length === session.codeLength) submit(typedRef.current);
//   };

//   /* ---------- clue (free) / video / skip ---------- */

//   // tap the search icon -> the clue modal opens directly, no hints are spent
//   const hint = async () => {
//     if (!session || doneRef.current) return;
//     if (clue) {
//       setShowClues(true);
//       return;
//     }
//     try {
//       const r: any = await api.buyHint(session.sessionId, playerId);
//       setHints?.(r.hints);
//       setClue(r.text || r.message);
//       setShowClues(true);
//     } catch (e: any) {
//       flash(e?.message || 'Network error');
//     }
//   };

//   const reward = async () => {
//     try {
//       const r = await api.rewardHints(playerId);
//       setHints?.(r.hints);
//       flash(`+${r.added} hints`);
//     } catch (e: any) {
//       flash(e?.message || 'Network error');
//     }
//   };

//   const skip = async () => {
//     if (!session || doneRef.current) return;
//     try {
//       const r = await api.skipLevel(session.sessionId, playerId);
//       doneRef.current = true;
//       setHints?.(r.hints);
//       onComplete?.({ attempts: Math.max(1, session.wrongAttempts), skipped: true });
//     } catch (e: any) {
//       flash(e?.status === 402 ? 'Not enough hints' : e?.message || 'Network error');
//     }
//   };

//   /* ---------- loading / error ---------- */

//   if (loading || error || !session) {
//     return (
//       <Stage bg={SKY}>
//         <View style={st.wall}>
//           <RoomBg15 />
//           <View style={st.center}>
//             <Text style={st.load}>{error || 'Loading level 15...'}</Text>
//             {!!error && (
//               <>
//                 <TouchableOpacity style={st.tryBtn} onPress={load}>
//                   <Text style={st.tryTxt}>Try again</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={onExit}>
//                   <Text style={st.back}>Back</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Stage>
//     );
//   }

//   /* ---------- game ---------- */

//   const qY = qIn.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

//   return (
//     <Stage bg={SKY}>
//       <View style={st.wall}>
//         <RoomBg15 />
//         <View style={st.board}>
//           {/* top bar */}
//           <View style={st.top}>
//             <View style={st.topL}>
//               <Round n="home" onPress={onExit} />
//               <Round n="gear" />
//             </View>
//             <View style={st.signWrap}>
//               <View style={[st.string, { left: 26, transform: [{ rotate: '12deg' }] }]} />
//               <View style={[st.string, { right: 26, transform: [{ rotate: '-12deg' }] }]} />
//               <View style={st.sign}>
//                 <View style={[st.leafTop, { left: -8, transform: [{ rotate: '-30deg' }] }]} />
//                 <View style={[st.leafTop, { right: -8, transform: [{ rotate: '30deg' }] }]} />
//                 <Text style={st.signt}>LEVEL 15</Text>
//               </View>
//             </View>
//             <View style={st.topR}>
//               <View style={st.bpill}>
//                 <Text style={st.bpt}>{hints}</Text>
//                 <View style={{ position: 'absolute', right: -14, top: -10 }}>
//                   <Icon n="bulb" s={34} />
//                 </View>
//               </View>
//             </View>
//           </View>

//           {/* question */}
//           <Animated.View style={[st.qWrap, { opacity: qIn, transform: [{ translateY: qY }] }]}>
//             <Text style={st.q}>We must open this vault.</Text>
//           </Animated.View>

//           {/* vault picture */}
//           <Animated.View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 130, transform: [{ translateX: shake }] }}>
//             <VaultScene15
//               moved={session.vaultMoved}
//               code={session.code}
//               opened={opened}
//               typed={typed}
//               codeLength={session.codeLength}
//               onKey={onKey}
//               onThing={onThing}
//               onPush={onPush}
//               disabled={busy || opened}
//             />
//           </Animated.View>

//           {/* clue / video / skip */}
//           <View style={st.actions}>
//             <View style={st.acol}>
//               <TouchableOpacity style={st.hintBtn} onPress={hint}>
//                 <Icon n="search" s={34} />
//               </TouchableOpacity>
//               <View style={st.lblRow}>
//                 <Text style={st.lbl}>FREE</Text>
//               </View>
//             </View>
//             <View style={st.acol}>
//               <TouchableOpacity style={st.videoBtn} onPress={reward}>
//                 <Icon n="film" s={40} />
//               </TouchableOpacity>
//               <View style={st.lblRow}>
//                 <Coin s={12} />
//                 <Text style={st.lbl}>+75</Text>
//               </View>
//             </View>
//             <View style={st.acol}>
//               <TouchableOpacity style={st.skipBtn} onPress={skip}>
//                 <Icon n="play" s={36} />
//               </TouchableOpacity>
//               <View style={st.lblRow}>
//                 <Icon n="bulb" s={14} />
//                 <Text style={st.lbl}>50</Text>
//               </View>
//             </View>
//           </View>

//           {!!note && <Text style={st.note}>{note}</Text>}

//           {/* clues modal */}
//           {showClues && (
//             <View style={st.overlay}>
//               <View style={st.modal}>
//                 <Text style={st.mTitle}>CLUES</Text>
//                 <TouchableOpacity style={st.mClose} onPress={() => setShowClues(false)}>
//                   <Text style={st.mCloseX}>✕</Text>
//                 </TouchableOpacity>
//                 <View style={st.clueCard}>
//                   <View style={st.clueNum}>
//                     <Text style={st.clueNumT}>1</Text>
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={st.clueHead}>Clue 1</Text>
//                     <Text style={st.clueBody}>{clue}</Text>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           )}
//         </View>
//       </View>
//     </Stage>
//   );
// }

// /* ---------- styles (same look as the Level 1 room) ---------- */

// const st = StyleSheet.create({
//   wall: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
//   board: { flex: 1, alignItems: 'center', paddingTop: 30 },
//   center: { position: 'absolute', left: 0, right: 0, top: '42%', alignItems: 'center', gap: 14 },
//   load: { fontFamily: F, fontSize: 22, color: NAVY, textAlign: 'center', paddingHorizontal: 20 },
//   tryBtn: { backgroundColor: '#a8e22a', borderWidth: 3, borderColor: INK, borderRadius: 30, paddingHorizontal: 36, paddingVertical: 10 },
//   tryTxt: { fontFamily: F, fontSize: 24, fontWeight: '900', color: INK },
//   back: { fontFamily: F, fontSize: 20, color: NAVY, textDecorationLine: 'underline' },

//   round: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ffe27a', borderWidth: 2, borderColor: INK, alignItems: 'center', justifyContent: 'center' },
//   top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 8, width: '100%' },
//   topL: { flexDirection: 'row', gap: 6, minWidth: 80, marginTop: 10 },
//   topR: { minWidth: 80, alignItems: 'flex-end', marginTop: 14, paddingRight: 14 },
//   signWrap: { alignItems: 'center', paddingTop: 14 },
//   string: { position: 'absolute', top: -6, width: 2, height: 22, backgroundColor: '#9a6a3a' },
//   sign: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#a8601f', borderWidth: 3, borderColor: '#d98b3d', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 } },
//   leafTop: { position: 'absolute', top: -12, width: 16, height: 24, borderRadius: 12, backgroundColor: '#5fae3a' },
//   signt: { fontFamily: F, fontSize: 22, fontWeight: 'bold', color: '#fff' },
//   bpill: { backgroundColor: '#fff', borderRadius: 16, height: 30, minWidth: 58, paddingLeft: 12, paddingRight: 18, justifyContent: 'center', borderWidth: 2, borderColor: '#e6e6e6' },
//   bpt: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: INK },
//   qWrap: { backgroundColor: CREAM, borderRadius: 30, paddingHorizontal: 22, paddingVertical: 10, marginTop: 22, elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
//   q: { fontFamily: F, fontSize: 22, fontWeight: 'bold', color: NAVY, textAlign: 'center' },

//   actions: { position: 'absolute', left: 0, right: 0, bottom: 34, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 34 },
//   acol: { alignItems: 'center' },
//   lblRow: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 26, marginTop: 6, paddingHorizontal: 12, borderRadius: 13, backgroundColor: '#6b4423' },
//   lbl: { fontFamily: F, fontSize: 15, fontWeight: 'bold', color: '#fff' },
//   hintBtn: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#a8e22a', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   videoBtn: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#f3efe2', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   skipBtn: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#f0484f', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   note: { position: 'absolute', bottom: 6, alignSelf: 'center', fontFamily: F, fontSize: 17, fontWeight: 'bold', color: '#c0392b', textAlign: 'center', paddingHorizontal: 12 },

//   /* clues modal */
//   overlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(16,36,94,0.45)', alignItems: 'center', justifyContent: 'center', zIndex: 50, elevation: 50, paddingHorizontal: 16 },
//   modal: { width: '100%', maxWidth: 360, backgroundColor: '#fbf1de', borderWidth: 5, borderColor: '#e8912d', borderRadius: 28, padding: 18, paddingTop: 16 },
//   mTitle: { fontFamily: F, fontSize: 26, fontWeight: 'bold', color: NAVY, textAlign: 'center', marginBottom: 14 },
//   mClose: { position: 'absolute', right: -6, top: -6, width: 38, height: 38, borderRadius: 19, backgroundColor: '#ffe27a', borderWidth: 3, borderColor: INK, alignItems: 'center', justifyContent: 'center' },
//   mCloseX: { fontSize: 18, fontWeight: 'bold', color: '#e0453a' },
//   clueCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fdf6e8', borderWidth: 2, borderColor: '#4cc46a', borderRadius: 22, padding: 14 },
//   clueNum: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#c26a22', alignItems: 'center', justifyContent: 'center' },
//   clueNumT: { fontFamily: F, fontSize: 28, fontWeight: 'bold', color: '#fff' },
//   clueHead: { fontFamily: F, fontSize: 18, fontWeight: 'bold', color: '#c26a22' },
//   clueBody: { fontSize: 17, fontStyle: 'italic', color: NAVY, marginTop: 2 },
// });
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Platform,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { F, Stage, Coin } from './BTShared';
import { Icon } from './Art';
import { VaultScene15 } from './Btlevel15art';
import * as api from './Btlevel15api';
import { play } from './BTSound';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

/* garden palette (same as Level 9) */
const NAVY = '#13235b';
const SKY = '#5cc0f5';
const CREAM = '#faf0e2';
const CREAM_BORDER = '#ead2a4';
const WOOD = '#eba24e';
const WOOD_D = '#c2782c';
const WOOD_DD = '#8f5a1f';
const LIME = '#a4e02a';
const LIME_RING = '#f4f1dc';
const RED = '#f0434d';
const ARROW = '#ffb629';
const BADGE = '#6b4423';
const GREEN_OK = '#3ec45a';
const YEL_BTN = '#fbc02d';
const YEL_BTN_D = '#d98e1c';

/* ---------- garden background (same as Level 9) ---------- */
function Flower({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
      ))}
      <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
    </G>
  );
}

function Tuft({ x, y }: any) {
  return (
    <G transform={`translate(${x} ${y})`} fill="#4fb12c">
      <Polygon points="-14,0 -8,-34 -2,0" />
      <Polygon points="-4,0 4,-44 12,0" />
      <Polygon points="8,0 18,-30 24,0" />
    </G>
  );
}

function Cloud({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
      <Ellipse cx="0" cy="0" rx="70" ry="26" />
      <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
      <Ellipse cx="22" cy="-12" rx="30" ry="22" />
    </G>
  );
}

function Sprout({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <G fill="#5cb85c">
        <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
        <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
        <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
      </G>
      <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
      <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
      <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
      <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
      <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
      <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </G>
  );
}

function Garden() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="g15sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g15sky)" />
      </Svg>

      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
        <Svg width="100%" height="100%" viewBox="0 0 942 330">
          <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
          <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
          <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
          <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
          <Cloud x={850} y={245} s={1} />
        </Svg>
      </View>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
        <Svg width="100%" height="100%" viewBox="0 0 942 1269">
          <Cloud x={50} y={585} s={0.9} />
          <Cloud x={880} y={600} s={0.6} />

          <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
          <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
          <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            const x = -10 + i * 90;
            return (
              <G key={i}>
                <Polygon points={`${x},730 ${x + 33},698 ${x + 66},730`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
                <Rect x={x} y="730" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
              </G>
            );
          })}
          <Rect x="0" y="760" width="942" height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
          <Rect x="0" y="808" width="942" height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

          <G>
            <Rect x="845" y="190" width="80" height="18" rx="4" fill="#e8903a" />
            <Polygon points="852,208 918,208 910,250 860,250" fill="#f0a050" />
            <G fill="#4cb04a">
              <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(-28 885 198)" />
              <Ellipse cx="885" cy="140" rx="20" ry="62" fill="#3a9a3c" />
              <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(28 885 198)" />
            </G>
            <Rect x="780" y="250" width="162" height="575" fill="#eaa24f" />
            <Rect x="796" y="266" width="146" height="545" fill="#dc9d4f" />
            <Rect x="780" y="440" width="162" height="16" fill="#f2b866" />
            <Rect x="780" y="630" width="162" height="16" fill="#f2b866" />
            <Rect x="780" y="250" width="162" height="16" fill="#f2b866" />
            <Rect x="810" y="310" width="36" height="130" fill="#2a9d9d" />
            <Rect x="850" y="290" width="34" height="150" fill="#f06ba8" />
            <Rect x="888" y="315" width="40" height="125" fill="#8a63da" />
            <Rect x="805" y="515" width="30" height="115" fill="#e5484d" />
            <Rect x="840" y="490" width="24" height="140" fill="#3b82e0" />
            <Rect x="868" y="510" width="38" height="120" fill="#4caf50" />
            <Rect x="810" y="695" width="34" height="120" fill="#f5c518" />
            <Rect x="848" y="665" width="40" height="150" fill="#2c6fdc" />
          </G>

          <Sprout x={10} y={740} s={1} />

          <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
          <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

          <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
          <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
          <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
          <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

          <Tuft x="905" y="925" /><Tuft x="910" y="1050" /><Tuft x="20" y="1040" />
          <Tuft x="100" y="1260" /><Tuft x="340" y="1260" /><Tuft x="580" y="1260" /><Tuft x="820" y="1260" />
          <Flower x="885" y="815" s={0.8} />
          <Flower x="200" y="1225" s={0.95} />
          <Flower x="735" y="1225" s={0.95} />
        </Svg>
      </View>
    </View>
  );
}

/* ---------- chain for the hanging sign ---------- */
function Chain({ h = 28, style }: { h?: number; style?: any }) {
  const n = Math.max(2, Math.round(h / 8));
  return (
    <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
      {Array.from({ length: n }).map((_, i) => (
        <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
      ))}
    </Svg>
  );
}

/* ---------- double arrow (skip icon) ---------- */
function DoubleArrow({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
      <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
    </Svg>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevel15Screen({ playerId, hints, setHints, onExit, onComplete }: any) {
  const [session, setSession] = useState<api.L15Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typed, setTyped] = useState('');
  const [note, setNote] = useState('');
  const [opened, setOpened] = useState(false);
  const [busy, setBusy] = useState(false);
  const [clue, setClue] = useState('');
  const [showClues, setShowClues] = useState(false);

  const typedRef = useRef('');
  const busyRef = useRef(false);
  const doneRef = useRef(false);
  const noteTimer = useRef<any>(null);
  const shake = useRef(new Animated.Value(0)).current;
  const qIn = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  const flash = (m: string) => {
    setNote(m);
    clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(''), 2200);
  };

  const doShake = () =>
    Animated.sequence([10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();

  // hanging sign sways gently (same as Level 9)
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [sway]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

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
    play('tap');
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
    play('tap');
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
        play('correct');
        doneRef.current = true;
        setOpened(true);
        flash(r.message);
        setTimeout(() => onComplete?.({ ...r, attempts: r.attempts ?? 1, skipped: false }), 1100);
      } else {
        play('wrong');
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
    play('tap');
    typedRef.current += digit;
    setTyped(typedRef.current);
    if (typedRef.current.length === session.codeLength) submit(typedRef.current);
  };

  /* ---------- clue (free) / video / skip ---------- */

  // tap the search icon -> the clue modal opens directly, no hints are spent
  const hint = async () => {
    if (!session || doneRef.current) return;
    play('clue');
    if (clue) {
      setShowClues(true);
      return;
    }
    try {
      const r: any = await api.buyHint(session.sessionId, playerId);
      setHints?.(r.hints);
      setClue(r.text || r.message);
      setShowClues(true);
    } catch (e: any) {
      flash(e?.message || 'Network error');
    }
  };

  const reward = async () => {
    play('btn');
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
    play('btn');
    try {
      const r = await api.skipLevel(session.sessionId, playerId);
      doneRef.current = true;
      setHints?.(r.hints);
      onComplete?.({ attempts: Math.max(1, session.wrongAttempts), skipped: true });
    } catch (e: any) {
      play('wrong');
      flash(e?.status === 402 ? 'Not enough hints' : e?.message || 'Network error');
    }
  };

  /* ---------- header (same as Level 9) ---------- */
  const header = (
    <View style={st.topBar}>
      <View style={st.leftBtns}>
        <TouchableOpacity style={st.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
          <Icon n="home" s={20} />
        </TouchableOpacity>
        <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
          <Icon n="gear" s={21} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
        <Chain h={30} style={{ left: 24, top: -6 }} />
        <Chain h={30} style={{ right: 24, top: -6 }} />
        <View style={st.sign}>
          <Text style={st.signArrow}>{'<'}</Text>
          <Text style={st.signT}>LEVEL 15</Text>
          <Text style={st.signArrow}>{'>'}</Text>
        </View>
      </Animated.View>

      <View style={st.pillWrap}>
        <View style={st.pill}>
          <Text style={st.pillT}>{hints}</Text>
        </View>
        <View style={st.pillIcon}>
          <Icon n="bulb" s={34} />
        </View>
      </View>
    </View>
  );

  /* ---------- loading / error ---------- */

  if (loading || error || !session) {
    return (
      <Stage bg={SKY}>
        <View style={st.root}>
          <Garden />
          {header}
          <View style={st.centerMsg}>
            <Text style={st.load}>{error || 'Loading level 15...'}</Text>
            {!!error && (
              <>
                <TouchableOpacity style={st.tryBtn} onPress={() => { play('btn'); load(); }}>
                  <Text style={st.tryTxt}>Try again</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { play('btn'); onExit(); }}>
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
      <View style={st.root}>
        <Garden />
        {header}

        {/* question pill */}
        <Animated.View style={[st.qWrap, { opacity: qIn, transform: [{ translateY: qY }] }]}>
          <View style={st.qPill}>
            <Text style={st.qArrow}>{'<'}</Text>
            <Text style={[st.q, note ? { color: '#c0392b' } : null]}>{note || 'We must open this vault.'}</Text>
            <Text style={st.qArrow}>{'>'}</Text>
          </View>
        </Animated.View>

        {/* vault picture */}
        <Animated.View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 170, transform: [{ translateX: shake }] }}>
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

        {/* bottom wooden panel (same as Level 9) */}
        <View style={st.panel}>
          <View style={[st.plank, { top: 18, left: 34, right: 34 }]} />
          <View style={[st.plank, { top: 76, left: 26, right: 26 }]} />
          <View style={[st.plank, { bottom: 16, left: 34, right: 34 }]} />
          <View style={[st.screw, { left: 16, top: 16 }]} />
          <View style={[st.screw, { right: 16, top: 16 }]} />
          <View style={[st.screw, { left: 16, bottom: 16 }]} />
          <View style={[st.screw, { right: 16, bottom: 16 }]} />

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={hint}>
              <Icon n="search" s={40} />
            </TouchableOpacity>
            <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={reward}>
              <Icon n="film" s={46} />
            </TouchableOpacity>
            <View style={st.badge}><Coin s={15} /><Text style={st.badgeT}>+75</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={skip}>
              <DoubleArrow s={42} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={19} /><Text style={st.badgeT}>50</Text></View>
          </View>
        </View>

        {/* CLUES popup */}
        {showClues && (
          <View style={st.overlay}>
            <View style={st.clueCard}>
              <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setShowClues(false); }}>
                <Icon n="cross" s={20} />
              </TouchableOpacity>
              <Text style={st.clueTitle}>HINTS</Text>

              <View style={[st.clueRow, st.clueRowOpen]}>
                <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={st.clueHead}>Hint 1</Text>
                  <Text style={st.clueBody}>{clue}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </Stage>
  );
}

/* =========================================================
   STYLES (same as Level 9)
========================================================= */

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },
  centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 14 },
  load: { fontFamily: FONT, fontSize: 22, color: '#fff', textAlign: 'center', paddingHorizontal: 20 },
  tryBtn: { backgroundColor: LIME, borderWidth: 3, borderColor: '#1b1b1b', borderRadius: 30, paddingHorizontal: 36, paddingVertical: 10 },
  tryTxt: { fontFamily: FONT, fontSize: 24, fontWeight: '900', color: '#1b1b1b' },
  back: { fontFamily: FONT, fontSize: 20, color: '#fff', textDecorationLine: 'underline' },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 14 },
  leftBtns: { flexDirection: 'row', gap: 8 },
  woodBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: YEL_BTN, borderWidth: 2.5, borderColor: YEL_BTN_D, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
  sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 6, backgroundColor: '#bd6b29', borderWidth: 3, borderColor: WOOD_DD, elevation: 3 },
  signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
  pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
  pill: { height: 32, borderRadius: 16, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 18, paddingRight: 30, elevation: 3 },
  pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
  pillIcon: { position: 'absolute', right: -6, top: -4 },

  qWrap: { alignItems: 'center', marginTop: 12, paddingHorizontal: 12 },
  qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, maxWidth: 380, elevation: 3 },
  qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
  q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

  // bottom wooden panel (solid wood, plank lines, corner rivets)
  panel: {
    position: 'absolute', left: 14, right: 14, bottom: 18, height: 148, borderRadius: 46,
    backgroundColor: WOOD, borderWidth: 6, borderColor: WOOD_D,
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 20, elevation: 6,
  },
  plank: { position: 'absolute', height: 2.5, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
  screw: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: WOOD_DD },
  btnCol: { alignItems: 'center' },
  circleBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 7, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 8, minWidth: 76, paddingHorizontal: 12, height: 32, borderRadius: 16, backgroundColor: BADGE },
  badgeT: { fontFamily: FONT, fontSize: 17, fontWeight: '900', color: '#fff' },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50, elevation: 50 },
  clueCard: { width: '86%', maxWidth: 360, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
  clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
  closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12 },
  clueRowOpen: { backgroundColor: '#fff', borderColor: GREEN_OK },
  clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
  clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
  clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
  clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },
});