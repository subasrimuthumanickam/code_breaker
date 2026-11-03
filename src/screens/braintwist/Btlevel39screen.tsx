// // // import React, { useCallback, useEffect, useState } from 'react';
// // // import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
// // // import {
// // //   getLevel39, submitLevel39, searchLevel39, clueLevel39, skipLevel39, Level39Data,
// // // } from './Btlevel39api';
// // // import {
// // //   HomeIcon, GearIcon, BulbIcon, SearchIcon, SkipIcon, CheckIcon, CrossIcon, RoundIcon, COLORS,
// // // } from './Btlevel39art';

// // // interface Props {
// // //   userId: string;
// // //   onHome?: () => void;
// // //   onSettings?: () => void;
// // //   onNextLevel?: (level: number) => void;
// // // }

// // // const KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// // // export default function Btlevel39screen({ userId, onHome, onSettings, onNextLevel }: Props) {
// // //   const [data, setData] = useState<Level39Data | null>(null);
// // //   const [coins, setCoins] = useState(0);
// // //   const [input, setInput] = useState('');
// // //   const [loading, setLoading] = useState(true);
// // //   const [busy, setBusy] = useState(false);

// // //   const load = useCallback(async () => {
// // //     setLoading(true);
// // //     const res = await getLevel39(userId);
// // //     if (res.success && res.data) {
// // //       setData(res.data);
// // //       setCoins(res.data.coins);
// // //     } else {
// // //       Alert.alert('Error', res.message || 'Could not load level');
// // //     }
// // //     setLoading(false);
// // //   }, [userId]);

// // //   useEffect(() => { load(); }, [load]);

// // //   const press = (k: string) => input.length < 3 && setInput(input + k);

// // //   const submit = async () => {
// // //     if (!input || busy) return;
// // //     setBusy(true);
// // //     const res = await submitLevel39(userId, input);
// // //     setBusy(false);
// // //     if (!res.success || !res.data) return Alert.alert('Error', res.message || 'Try again');
// // //     setCoins(res.data.coins);
// // //     if (res.data.correct) {
// // //       Alert.alert('Correct! 🎉', `+${res.data.reward} coins`, [
// // //         { text: 'Next', onPress: () => res.data!.nextLevel && onNextLevel?.(res.data!.nextLevel) },
// // //       ]);
// // //     } else {
// // //       Alert.alert('Wrong', res.data.message);
// // //       setInput('');
// // //     }
// // //   };

// // //   const search = async () => {
// // //     setBusy(true);
// // //     const res = await searchLevel39(userId);
// // //     setBusy(false);
// // //     if (res.data) setCoins(res.data.coins);
// // //     Alert.alert(res.success ? 'Hint' : 'Oops', res.success ? res.data?.hint : res.message);
// // //   };

// // //   const clue = async () => {
// // //     // play your clue video/ad here, then credit the reward:
// // //     setBusy(true);
// // //     const res = await clueLevel39(userId);
// // //     setBusy(false);
// // //     if (res.success && res.data) setCoins(res.data.coins);
// // //     else Alert.alert('Error', res.message || 'Try again');
// // //   };

// // //   const skip = async () => {
// // //     setBusy(true);
// // //     const res = await skipLevel39(userId);
// // //     setBusy(false);
// // //     if (res.data) setCoins(res.data.coins);
// // //     if (res.success && res.data) onNextLevel?.(res.data.nextLevel);
// // //     else Alert.alert('Oops', res.message || 'Try again');
// // //   };

// // //   if (loading || !data) {
// // //     return <SafeAreaView style={styles.center}><ActivityIndicator size="large" color={COLORS.brown} /></SafeAreaView>;
// // //   }

// // //   return (
// // //     <SafeAreaView style={styles.root}>
// // //       {/* header */}
// // //       <View style={styles.header}>
// // //         <View style={styles.row}>
// // //           <TouchableOpacity style={styles.yellowBtn} onPress={onHome}><HomeIcon /></TouchableOpacity>
// // //           <TouchableOpacity style={styles.yellowBtn} onPress={onSettings}><GearIcon /></TouchableOpacity>
// // //         </View>
// // //         <View style={styles.levelSign}><Text style={styles.levelText}>LEVEL {data.level}</Text></View>
// // //         <View style={styles.coinPill}>
// // //           <Text style={styles.coinText}>{coins}</Text>
// // //           <BulbIcon size={26} />
// // //         </View>
// // //       </View>

// // //       {/* question */}
// // //       <View style={styles.questionPill}>
// // //         <Text style={styles.questionText}>{data.question}</Text>
// // //       </View>

// // //       {/* notebook card */}
// // //       <View style={styles.card}>
// // //         <View style={styles.row}>
// // //           <TouchableOpacity style={[styles.roundBtn, { backgroundColor: '#ff2b2b' }]} onPress={() => setInput('')}>
// // //             <CrossIcon />
// // //           </TouchableOpacity>
// // //           <View style={styles.answerBox}><Text style={styles.answerText}>{input}</Text></View>
// // //           <TouchableOpacity style={[styles.roundBtn, { backgroundColor: '#8ae234' }]} onPress={submit} disabled={busy}>
// // //             <CheckIcon />
// // //           </TouchableOpacity>
// // //         </View>

// // //         <View style={styles.keypad}>
// // //           {KEYS.map((k) => (
// // //             <TouchableOpacity key={k} style={styles.key} onPress={() => press(k)}>
// // //               <Text style={styles.keyText}>{k}</Text>
// // //             </TouchableOpacity>
// // //           ))}
// // //         </View>

// // //         {/* actions */}
// // //         <View style={styles.actions}>
// // //           <Action label="Search" badge={`x${data.costs.search}`} onPress={search} disabled={busy}>
// // //             <RoundIcon color={COLORS.green}><SearchIcon /></RoundIcon>
// // //           </Action>
// // //           <Action label="Clue" badge={`+${data.costs.clue}`} onPress={clue} disabled={busy}>
// // //             <RoundIcon color={COLORS.purple}><BulbIcon size={34} /></RoundIcon>
// // //           </Action>
// // //           <Action label="Skip" badge={`x${data.costs.skip}`} onPress={skip} disabled={busy}>
// // //             <RoundIcon color={COLORS.red}><SkipIcon /></RoundIcon>
// // //           </Action>
// // //         </View>
// // //       </View>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const Action = ({ label, badge, onPress, disabled, children }: any) => (
// // //   <TouchableOpacity style={styles.action} onPress={onPress} disabled={disabled}>
// // //     <View style={styles.badge}><BulbIcon size={22} /><Text style={styles.badgeText}>{badge}</Text></View>
// // //     {children}
// // //     <View style={styles.label}><Text style={styles.labelText}>{label}</Text></View>
// // //   </TouchableOpacity>
// // // );

// // // const styles = StyleSheet.create({
// // //   root: { flex: 1, backgroundColor: '#8fd3ff', padding: 12 },
// // //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#8fd3ff' },
// // //   row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
// // //   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
// // //   yellowBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#ffd21f', borderWidth: 2, borderColor: '#d9a800', alignItems: 'center', justifyContent: 'center' },
// // //   levelSign: { backgroundColor: '#b8651f', paddingHorizontal: 22, paddingVertical: 8, borderRadius: 8 },
// // //   levelText: { color: '#fff', fontSize: 24, fontWeight: '800' },
// // //   coinPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 22 },
// // //   coinText: { fontSize: 22, fontWeight: '800', color: COLORS.navy },
// // //   questionPill: { backgroundColor: COLORS.cream, borderRadius: 30, padding: 14, marginTop: 10 },
// // //   questionText: { textAlign: 'center', fontSize: 20, fontWeight: '800', color: COLORS.navy },
// // //   card: { flex: 1, backgroundColor: '#fff', borderRadius: 18, marginTop: 12, padding: 14, alignItems: 'center' },
// // //   roundBtn: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
// // //   answerBox: { width: 170, height: 54, borderRadius: 27, borderWidth: 2.5, borderColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
// // //   answerText: { fontSize: 28, fontWeight: '800', color: COLORS.navy },
// // //   keypad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: 330, marginTop: 14, gap: 8 },
// // //   key: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#eceff3', borderWidth: 2, borderColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
// // //   keyText: { fontSize: 28, fontWeight: '800', color: COLORS.navy },
// // //   actions: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 'auto' },
// // //   action: { alignItems: 'center' },
// // //   badge: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 2 },
// // //   badgeText: { fontSize: 18, fontWeight: '800', color: COLORS.navy },
// // //   label: { backgroundColor: COLORS.brown, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4, marginTop: 4 },
// // //   labelText: { color: '#fff', fontWeight: '800', fontSize: 16 },
// // // });
// // import React, { useCallback, useEffect, useState } from 'react';
// // import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
// // import {
// //   getLevel39, submitLevel39, searchLevel39, clueLevel39, skipLevel39, Level39Data,
// // } from './Btlevel39api';
// // import {
// //   HomeIcon, GearIcon, BulbIcon, SearchIcon, SkipIcon, CheckIcon, CrossIcon, RoundIcon, COLORS,
// // } from './Btlevel39art';

// // // Same props as the other BTLevelXXScreen files (see BTGameScreen entry)
// // interface Props {
// //   playerId: string | number;
// //   hints?: number;
// //   setHints?: (n: number) => void;
// //   onExit?: () => void;
// //   onComplete?: (r: any) => void;
// // }

// // const KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// // export default function Btlevel39screen({ playerId, setHints, onExit, onComplete }: Props) {
// //   const userId = String(playerId);
// //   const [data, setData] = useState<Level39Data | null>(null);
// //   const [coins, setCoins] = useState(0);
// //   const [input, setInput] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [busy, setBusy] = useState(false);

// //   const load = useCallback(async () => {
// //     setLoading(true);
// //     const res = await getLevel39(userId);
// //     if (res.success && res.data) {
// //       setData(res.data);
// //       setCoins(res.data.coins);
// //     } else {
// //       Alert.alert('Error', res.message || 'Could not load level');
// //     }
// //     setLoading(false);
// //   }, [userId]);

// //   useEffect(() => { load(); }, [load]);

// //   // keep the global hint (bulb) balance in sync with this level's balance
// //   useEffect(() => { if (data) setHints?.(coins); }, [coins]);

// //   const press = (k: string) => input.length < 3 && setInput(input + k);

// //   const submit = async () => {
// //     if (!input || busy) return;
// //     setBusy(true);
// //     const res = await submitLevel39(userId, input);
// //     setBusy(false);
// //     if (!res.success || !res.data) return Alert.alert('Error', res.message || 'Try again');
// //     setCoins(res.data.coins);
// //     if (res.data.correct) {
// //       Alert.alert('Correct! 🎉', `+${res.data.reward} coins`, [
// //         { text: 'Next', onPress: () => onComplete?.({ attempts: 1, skipped: false }) },
// //       ]);
// //     } else {
// //       Alert.alert('Wrong', res.data.message);
// //       setInput('');
// //     }
// //   };

// //   const search = async () => {
// //     setBusy(true);
// //     const res = await searchLevel39(userId);
// //     setBusy(false);
// //     if (res.data) setCoins(res.data.coins);
// //     Alert.alert(res.success ? 'Hint' : 'Oops', res.success ? res.data?.hint : res.message);
// //   };

// //   const clue = async () => {
// //     // play your clue video/ad here, then credit the reward:
// //     setBusy(true);
// //     const res = await clueLevel39(userId);
// //     setBusy(false);
// //     if (res.success && res.data) setCoins(res.data.coins);
// //     else Alert.alert('Error', res.message || 'Try again');
// //   };

// //   const skip = async () => {
// //     setBusy(true);
// //     const res = await skipLevel39(userId);
// //     setBusy(false);
// //     if (res.data) setCoins(res.data.coins);
// //     if (res.success && res.data) onComplete?.({ attempts: 1, skipped: true });
// //     else Alert.alert('Oops', res.message || 'Try again');
// //   };

// //   if (loading || !data) {
// //     return <SafeAreaView style={styles.center}><ActivityIndicator size="large" color={COLORS.brown} /></SafeAreaView>;
// //   }

// //   return (
// //     <SafeAreaView style={styles.root}>
// //       {/* header */}
// //       <View style={styles.header}>
// //         <View style={styles.row}>
// //           <TouchableOpacity style={styles.yellowBtn} onPress={onExit}><HomeIcon /></TouchableOpacity>
// //           <TouchableOpacity style={styles.yellowBtn}><GearIcon /></TouchableOpacity>
// //         </View>
// //         <View style={styles.levelSign}><Text style={styles.levelText}>LEVEL {data.level}</Text></View>
// //         <View style={styles.coinPill}>
// //           <Text style={styles.coinText}>{coins}</Text>
// //           <BulbIcon size={26} />
// //         </View>
// //       </View>

// //       {/* question */}
// //       <View style={styles.questionPill}>
// //         <Text style={styles.questionText}>{data.question}</Text>
// //       </View>

// //       {/* notebook card */}
// //       <View style={styles.card}>
// //         <View style={styles.row}>
// //           <TouchableOpacity style={[styles.roundBtn, { backgroundColor: '#ff2b2b' }]} onPress={() => setInput('')}>
// //             <CrossIcon />
// //           </TouchableOpacity>
// //           <View style={styles.answerBox}><Text style={styles.answerText}>{input}</Text></View>
// //           <TouchableOpacity style={[styles.roundBtn, { backgroundColor: '#8ae234' }]} onPress={submit} disabled={busy}>
// //             <CheckIcon />
// //           </TouchableOpacity>
// //         </View>

// //         <View style={styles.keypad}>
// //           {KEYS.map((k) => (
// //             <TouchableOpacity key={k} style={styles.key} onPress={() => press(k)}>
// //               <Text style={styles.keyText}>{k}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>

// //         {/* actions */}
// //         <View style={styles.actions}>
// //           <Action label="Search" badge={`x${data.costs.search}`} onPress={search} disabled={busy}>
// //             <RoundIcon color={COLORS.green}><SearchIcon /></RoundIcon>
// //           </Action>
// //           <Action label="Clue" badge={`+${data.costs.clue}`} onPress={clue} disabled={busy}>
// //             <RoundIcon color={COLORS.purple}><BulbIcon size={34} /></RoundIcon>
// //           </Action>
// //           <Action label="Skip" badge={`x${data.costs.skip}`} onPress={skip} disabled={busy}>
// //             <RoundIcon color={COLORS.red}><SkipIcon /></RoundIcon>
// //           </Action>
// //         </View>
// //       </View>
// //     </SafeAreaView>
// //   );
// // }

// // const Action = ({ label, badge, onPress, disabled, children }: any) => (
// //   <TouchableOpacity style={styles.action} onPress={onPress} disabled={disabled}>
// //     <View style={styles.badge}><BulbIcon size={22} /><Text style={styles.badgeText}>{badge}</Text></View>
// //     {children}
// //     <View style={styles.label}><Text style={styles.labelText}>{label}</Text></View>
// //   </TouchableOpacity>
// // );

// // const styles = StyleSheet.create({
// //   root: { flex: 1, backgroundColor: '#8fd3ff', padding: 12 },
// //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#8fd3ff' },
// //   row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
// //   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
// //   yellowBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#ffd21f', borderWidth: 2, borderColor: '#d9a800', alignItems: 'center', justifyContent: 'center' },
// //   levelSign: { backgroundColor: '#b8651f', paddingHorizontal: 22, paddingVertical: 8, borderRadius: 8 },
// //   levelText: { color: '#fff', fontSize: 24, fontWeight: '800' },
// //   coinPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 22 },
// //   coinText: { fontSize: 22, fontWeight: '800', color: COLORS.navy },
// //   questionPill: { backgroundColor: COLORS.cream, borderRadius: 30, padding: 14, marginTop: 10 },
// //   questionText: { textAlign: 'center', fontSize: 20, fontWeight: '800', color: COLORS.navy },
// //   card: { flex: 1, backgroundColor: '#fff', borderRadius: 18, marginTop: 12, padding: 14, alignItems: 'center' },
// //   roundBtn: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
// //   answerBox: { width: 170, height: 54, borderRadius: 27, borderWidth: 2.5, borderColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
// //   answerText: { fontSize: 28, fontWeight: '800', color: COLORS.navy },
// //   keypad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: 330, marginTop: 14, gap: 8 },
// //   key: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#eceff3', borderWidth: 2, borderColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
// //   keyText: { fontSize: 28, fontWeight: '800', color: COLORS.navy },
// //   actions: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 'auto' },
// //   action: { alignItems: 'center' },
// //   badge: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 2 },
// //   badgeText: { fontSize: 18, fontWeight: '800', color: COLORS.navy },
// //   label: { backgroundColor: COLORS.brown, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4, marginTop: 4 },
// //   labelText: { color: '#fff', fontWeight: '800', fontSize: 16 },
// // });
// import React, { useCallback, useEffect, useState } from 'react';
// import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
// import {
//   getLevel39, submitLevel39, searchLevel39, clueLevel39, skipLevel39, Level39Data,
// } from './Btlevel39api';
// import {
//   HomeIcon, GearIcon, BulbIcon, SearchIcon, SkipIcon, CheckIcon, CrossIcon, RoundIcon, COLORS,
// } from './Btlevel39art';

// // Same props as the other BTLevelXXScreen files (see BTGameScreen entry)
// interface Props {
//   playerId: string | number;
//   hints?: number;
//   setHints?: (n: number) => void;
//   onExit?: () => void;
//   onComplete?: (r: any) => void;
// }

// const KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// export default function Btlevel39screen({ playerId, setHints, onExit, onComplete }: Props) {
//   const userId = String(playerId);
//   const [data, setData] = useState<Level39Data | null>(null);
//   const [coins, setCoins] = useState(0);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [busy, setBusy] = useState(false);

//   const load = useCallback(async () => {
//     setLoading(true);
//     const res = await getLevel39(userId);
//     if (res.success && res.data) {
//       setData(res.data);
//       setCoins(res.data.coins);
//     } else {
//       Alert.alert('Error', res.message || 'Could not load level');
//     }
//     setLoading(false);
//   }, [userId]);

//   useEffect(() => { load(); }, [load]);

//   // keep the global hint (bulb) balance in sync with this level's balance
//   useEffect(() => { if (data) setHints?.(coins); }, [coins]);

//   const press = (k: string) => input.length < 3 && setInput(input + k);

//   const submit = async () => {
//     if (!input || busy) return;
//     setBusy(true);
//     const res = await submitLevel39(userId, input);
//     setBusy(false);
//     if (!res.success || !res.data) return Alert.alert('Error', res.message || 'Try again');
//     setCoins(res.data.coins);
//     if (res.data.correct) {
//       Alert.alert('Correct! 🎉', `+${res.data.reward} coins`, [
//         { text: 'Next', onPress: () => onComplete?.({ attempts: 1, skipped: false }) },
//       ]);
//     } else {
//       Alert.alert('Wrong', res.data.message);
//       setInput('');
//     }
//   };

//   const search = async () => {
//     setBusy(true);
//     const res = await searchLevel39(userId);
//     setBusy(false);
//     if (res.data) setCoins(res.data.coins);
//     Alert.alert(res.success ? 'Hint' : 'Oops', res.success ? res.data?.hint : res.message);
//   };

//   const clue = async () => {
//     // play your clue video/ad here, then credit the reward:
//     setBusy(true);
//     const res = await clueLevel39(userId);
//     setBusy(false);
//     if (res.success && res.data) setCoins(res.data.coins);
//     else Alert.alert('Error', res.message || 'Try again');
//   };

//   const skip = async () => {
//     setBusy(true);
//     const res = await skipLevel39(userId);
//     setBusy(false);
//     if (res.data) setCoins(res.data.coins);
//     if (res.success && res.data) onComplete?.({ attempts: 1, skipped: true });
//     else Alert.alert('Oops', res.message || 'Try again');
//   };

//   if (loading || !data) {
//     return <SafeAreaView style={styles.center}><ActivityIndicator size="large" color={COLORS.brown} /></SafeAreaView>;
//   }

//   return (
//     <SafeAreaView style={styles.root}>
//       {/* header */}
//       <View style={styles.header}>
//         <View style={styles.row}>
//           <TouchableOpacity style={styles.yellowBtn} onPress={onExit}><HomeIcon /></TouchableOpacity>
//           <TouchableOpacity style={styles.yellowBtn}><GearIcon /></TouchableOpacity>
//         </View>
//         <View style={styles.levelSign}><Text style={styles.levelText}>LEVEL {data.level}</Text></View>
//         <View style={styles.coinPill}>
//           <Text style={styles.coinText}>{coins}</Text>
//           <BulbIcon size={26} />
//         </View>
//       </View>

//       {/* question */}
//       <View style={styles.questionPill}>
//         <Text style={styles.questionText}>{data.question}</Text>
//       </View>

//       {/* notebook card */}
//       <View style={styles.card}>
//         <View style={styles.row}>
//           <TouchableOpacity style={[styles.roundBtn, { backgroundColor: '#ff2b2b' }]} onPress={() => setInput('')}>
//             <CrossIcon />
//           </TouchableOpacity>
//           <View style={styles.answerBox}><Text style={styles.answerText}>{input}</Text></View>
//           <TouchableOpacity style={[styles.roundBtn, { backgroundColor: '#8ae234' }]} onPress={submit} disabled={busy}>
//             <CheckIcon />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.keypad}>
//           {KEYS.map((k) => (
//             <TouchableOpacity key={k} style={styles.key} onPress={() => press(k)}>
//               <Text style={styles.keyText}>{k}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* actions */}
//         <View style={styles.actions}>
//           <Action label="Search" badge={`x${data.costs.search}`} onPress={search} disabled={busy}>
//             <RoundIcon color={COLORS.green}><SearchIcon /></RoundIcon>
//           </Action>
//           <Action label="Clue" badge={`+${data.costs.clue}`} onPress={clue} disabled={busy}>
//             <RoundIcon color={COLORS.purple}><BulbIcon size={34} /></RoundIcon>
//           </Action>
//           <Action label="Skip" badge={`x${data.costs.skip}`} onPress={skip} disabled={busy}>
//             <RoundIcon color={COLORS.red}><SkipIcon /></RoundIcon>
//           </Action>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const Action = ({ label, badge, onPress, disabled, children }: any) => (
//   <TouchableOpacity style={styles.action} onPress={onPress} disabled={disabled}>
//     <View style={styles.badge}><BulbIcon size={22} /><Text style={styles.badgeText}>{badge}</Text></View>
//     {children}
//     <View style={styles.label}><Text style={styles.labelText}>{label}</Text></View>
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#8fd3ff', padding: 12 },
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#8fd3ff' },
//   row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   yellowBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#ffd21f', borderWidth: 2, borderColor: '#d9a800', alignItems: 'center', justifyContent: 'center' },
//   levelSign: { backgroundColor: '#b8651f', paddingHorizontal: 22, paddingVertical: 8, borderRadius: 8 },
//   levelText: { color: '#fff', fontSize: 24, fontWeight: '800' },
//   coinPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 22 },
//   coinText: { fontSize: 22, fontWeight: '800', color: COLORS.navy },
//   questionPill: { backgroundColor: COLORS.cream, borderRadius: 30, padding: 14, marginTop: 10 },
//   questionText: { textAlign: 'center', fontSize: 20, fontWeight: '800', color: COLORS.navy },
//   card: { flex: 1, backgroundColor: '#fff', borderRadius: 18, marginTop: 12, padding: 14, alignItems: 'center' },
//   roundBtn: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
//   answerBox: { width: 170, height: 54, borderRadius: 27, borderWidth: 2.5, borderColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
//   answerText: { fontSize: 28, fontWeight: '800', color: COLORS.navy },
//   keypad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: 330, marginTop: 14, gap: 8 },
//   key: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#eceff3', borderWidth: 2, borderColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
//   keyText: { fontSize: 28, fontWeight: '800', color: COLORS.navy },
//   actions: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 'auto' },
//   action: { alignItems: 'center' },
//   badge: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 2 },
//   badgeText: { fontSize: 18, fontWeight: '800', color: COLORS.navy },
//   label: { backgroundColor: COLORS.brown, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4, marginTop: 4 },
//   labelText: { color: '#fff', fontWeight: '800', fontSize: 16 },
// });
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import {
  getLevel39, submitLevel39, searchLevel39, clueLevel39, skipLevel39, Level39Data,
} from './Btlevel39api';
import {
  HomeIcon, GearIcon, BulbIcon, SearchIcon, SkipIcon, CheckIcon, CrossIcon, RoundIcon,
  RoomBackground, BottomMat, COLORS,
} from './Btlevel39art';

// Same props as the other BTLevelXXScreen files (see BTGameScreen entry)
interface Props {
  playerId: string | number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit?: () => void;
  onComplete?: (r: any) => void;
}

const KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function Btlevel39screen({ playerId, setHints, onExit, onComplete }: Props) {
  const userId = String(playerId);
  const [data, setData] = useState<Level39Data | null>(null);
  const [coins, setCoins] = useState(0);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<'ok' | 'bad' | null>(null); // tick / cross on the answer box
  const [note, setNote] = useState('');

  const flash = (m: string) => {
    setNote(m);
    setTimeout(() => setNote(''), 2200);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getLevel39(userId);
    if (res.success && res.data) {
      setData(res.data);
      setCoins(res.data.coins);
    } else {
      Alert.alert('Error', res.message || 'Could not load level');
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  // keep the global hint (bulb) balance in sync with this level's balance
  useEffect(() => { if (data) setHints?.(coins); }, [coins]);

  const press = (k: string) => {
    if (result === 'ok') return;
    if (input.length < 3) setInput(input + k);
  };

  const submit = async () => {
    if (!input || busy || result === 'ok') return;
    setBusy(true);
    const res = await submitLevel39(userId, input);
    setBusy(false);
    if (!res.success || !res.data) return flash(res.message || 'Network error');
    setCoins(res.data.coins);
    if (res.data.correct) {
      setResult('ok'); // green tick + "Correct!"
      flash('Correct! 🎉');
      setTimeout(() => onComplete?.({ attempts: 1, skipped: false }), 1300);
    } else {
      setResult('bad');
      flash('Not quite. Try again!');
      setTimeout(() => { setResult(null); setInput(''); }, 800);
    }
  };

  const search = async () => {
    if (busy) return;
    setBusy(true);
    const res = await searchLevel39(userId);
    setBusy(false);
    if (res.data) setCoins(res.data.coins);
    flash(res.success ? (res.data?.hint || 'Hint') : (res.message || 'Try again'));
  };

  const clue = async () => {
    if (busy) return;
    // play your clue video/ad here, then credit the reward:
    setBusy(true);
    const res = await clueLevel39(userId);
    setBusy(false);
    if (res.success && res.data) {
      setCoins(res.data.coins);
      flash(`+${res.data.added} hints`);
    } else flash(res.message || 'Try again');
  };

  const skip = async () => {
    if (busy) return;
    setBusy(true);
    const res = await skipLevel39(userId);
    setBusy(false);
    if (res.data) setCoins(res.data.coins);
    if (res.success && res.data) onComplete?.({ attempts: 1, skipped: true });
    else flash(res.message || 'Not enough hints');
  };

  if (loading || !data) {
    return <SafeAreaView style={styles.center}><ActivityIndicator size="large" color={COLORS.brown} /></SafeAreaView>;
  }

  return (
    <View style={styles.root}>
      <RoomBackground />
      <SafeAreaView style={styles.safe}>
        {/* header */}
        <View style={styles.header}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.yellowBtn} onPress={onExit}><HomeIcon size={24} /></TouchableOpacity>
            <TouchableOpacity style={styles.yellowBtn}><GearIcon size={24} /></TouchableOpacity>
          </View>
          <View style={styles.levelSign}>
            <Text style={styles.arrow}>‹</Text>
            <Text style={styles.levelText}>LEVEL {data.level}</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
          <View style={styles.coinPill}>
            <Text style={styles.coinText}>{coins}</Text>
            <View style={styles.coinBulb}><BulbIcon size={30} /></View>
          </View>
        </View>

        {/* question */}
        <View style={styles.questionPill}>
          <Text style={styles.questionText}>{data.question}</Text>
        </View>

        {/* half-size white notebook paper */}
        <View style={styles.paper}>
          <View style={styles.holes}>
            {Array.from({ length: 8 }, (_, i) => <View key={i} style={styles.hole} />)}
          </View>
          {[0, 1, 2, 3, 4, 5].map((i) => <View key={i} style={[styles.line, { top: 52 + i * 40 }]} />)}

          <View style={styles.row}>
            <TouchableOpacity style={[styles.roundBtn, { backgroundColor: '#ff2b2b' }]} onPress={() => { if (result !== 'ok') setInput(''); }}>
              <CrossIcon />
            </TouchableOpacity>
            <View style={[styles.answerBox, result === 'ok' && styles.answerOk, result === 'bad' && styles.answerBad]}>
              <Text style={styles.answerText}>{input}</Text>
              {result && (
                <View pointerEvents="none" style={styles.resultIcon}>
                  {result === 'ok' ? <CheckIcon size={44} color="#1fb33a" /> : <CrossIcon size={40} color="#e0302f" />}
                </View>
              )}
            </View>
            <TouchableOpacity style={[styles.roundBtn, { backgroundColor: '#8ae234' }]} onPress={submit} disabled={busy}>
              <CheckIcon />
            </TouchableOpacity>
          </View>

          <View style={styles.keypad}>
            {KEYS.map((k) => (
              <TouchableOpacity key={k} style={styles.key} onPress={() => press(k)}>
                <Text style={styles.keyText}>{k}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {!!note && <Text style={styles.note}>{note}</Text>}

        <View style={{ flex: 1 }} />

        {/* mat with Search / Clue / Skip */}
        <View style={styles.matWrap}>
          <BottomMat>
            <View style={styles.actions}>
              <Action label="Search" badge={`x${data.costs.search}`} onPress={search} disabled={busy}>
                <RoundIcon color={COLORS.green}><SearchIcon /></RoundIcon>
              </Action>
              <Action label="Clue" badge={`+${data.costs.clue}`} onPress={clue} disabled={busy}>
                <RoundIcon color={COLORS.purple}><BulbIcon size={34} /></RoundIcon>
              </Action>
              <Action label="Skip" badge={`x${data.costs.skip}`} onPress={skip} disabled={busy}>
                <RoundIcon color={COLORS.red}><SkipIcon /></RoundIcon>
              </Action>
            </View>
          </BottomMat>
        </View>
      </SafeAreaView>
    </View>
  );
}

const Action = ({ label, badge, onPress, disabled, children }: any) => (
  <TouchableOpacity style={styles.action} onPress={onPress} disabled={disabled}>
    <View style={styles.badge}><BulbIcon size={20} /><Text style={styles.badgeText}>{badge}</Text></View>
    {children}
    <View style={styles.label}><Text style={styles.labelText}>{label}</Text></View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#9fd0f2', overflow: 'hidden' },
  safe: { flex: 1, padding: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#9fd0f2' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  yellowBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffd21f', borderWidth: 2, borderColor: '#d9a800', alignItems: 'center', justifyContent: 'center' },
  levelSign: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#a8601f', borderWidth: 3, borderColor: '#d98b3d', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, elevation: 5 },
  levelText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  arrow: { color: '#ffc83d', fontSize: 24, fontWeight: '900', marginTop: -3 },
  coinPill: { backgroundColor: '#fff', borderRadius: 18, height: 32, minWidth: 64, paddingLeft: 14, paddingRight: 20, justifyContent: 'center', marginRight: 12 },
  coinText: { fontSize: 20, fontWeight: '800', color: COLORS.navy },
  coinBulb: { position: 'absolute', right: -14, top: -6 },
  questionPill: { backgroundColor: COLORS.cream, borderRadius: 30, paddingVertical: 12, paddingHorizontal: 18, marginTop: 14, elevation: 4 },
  questionText: { textAlign: 'center', fontSize: 20, fontWeight: '800', color: COLORS.navy },
  paper: { backgroundColor: '#fffdf8', borderRadius: 10, marginTop: 14, paddingTop: 34, paddingBottom: 18, alignItems: 'center', elevation: 5, overflow: 'hidden' },
  holes: { position: 'absolute', top: 6, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around' },
  hole: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#bfe0f5' },
  line: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#e3f0ee' },
  roundBtn: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
  answerBox: { width: 160, height: 50, borderRadius: 25, borderWidth: 2.5, borderColor: COLORS.navy, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  answerOk: { borderColor: '#1fb33a', backgroundColor: '#eaffec' },
  answerBad: { borderColor: '#e0302f', backgroundColor: '#ffeceb' },
  answerText: { fontSize: 28, fontWeight: '800', color: COLORS.navy },
  resultIcon: { position: 'absolute', right: 10, top: 2, bottom: 2, justifyContent: 'center' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: 320, marginTop: 14, gap: 8 },
  key: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#eceff3', borderWidth: 2, borderColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
  keyText: { fontSize: 26, fontWeight: '800', color: COLORS.navy },
  note: { textAlign: 'center', marginTop: 10, fontSize: 17, fontWeight: '800', color: COLORS.navy, backgroundColor: 'rgba(255,255,255,0.85)', alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 14, overflow: 'hidden' },
  matWrap: { marginBottom: 6 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  action: { alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 2 },
  badgeText: { fontSize: 17, fontWeight: '800', color: COLORS.navy },
  label: { backgroundColor: COLORS.brown, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4, marginTop: 6 },
  labelText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
