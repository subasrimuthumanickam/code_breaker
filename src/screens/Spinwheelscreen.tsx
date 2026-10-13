// import React, { useRef, useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Modal, ActivityIndicator } from 'react-native';
// import Svg, { Path, G, Text as SvgText, Circle } from 'react-native-svg';
// // npx expo install react-native-svg
// import { getDeviceId } from '../utils/deviceId'; // ungal function name ku match pannunga

// const API_URL = 'http://YOUR_BACKEND_IP:5000/api/spin'; // mathikonga

// type Reward = { id: string; type: 'coins' | 'hint' | 'time'; amount: number; label: string; sub: string; icon: string };

// const SIZE = 300;
// const R = SIZE / 2;
// const COLORS = ['#F5E6B3', '#2E9BFF', '#B146F0', '#FF4F9A', '#2ECC71', '#FF4F9A', '#2E9BFF', '#F5E6B3'];
// const TEXT_DARK = ['#5a4300', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#5a4300'];

// const polar = (angleDeg: number, r: number) => {
//   const a = ((angleDeg - 90) * Math.PI) / 180; // 0° = top
//   return { x: R + r * Math.cos(a), y: R + r * Math.sin(a) };
// };
// const slicePath = (i: number, n: number) => {
//   const step = 360 / n;
//   const p1 = polar(i * step, R - 8);
//   const p2 = polar((i + 1) * step, R - 8);
//   return `M${R},${R} L${p1.x},${p1.y} A${R - 8},${R - 8} 0 0 1 ${p2.x},${p2.y} Z`;
// };

// export default function SpinWheelScreen({ route, navigation }: any) {
//   const sessionId: string = route?.params?.sessionId;
//   const [rewards, setRewards] = useState<Reward[]>([]);
//   const [spinning, setSpinning] = useState(false);
//   const [won, setWon] = useState<Reward | null>(null);
//   const [spun, setSpun] = useState(false);
//   const rotation = useRef(new Animated.Value(0)).current;
//   const current = useRef(0);

//   // 1) wheel slices backend la irundhu load
//   useEffect(() => {
//     fetch(`${API_URL}/config`).then(r => r.json()).then(d => d.success && setRewards(d.rewards)).catch(() => {});
//   }, []);

//   const animateTo = (prizeIndex: number, n: number) =>
//     new Promise<void>(resolve => {
//       const step = 360 / n;
//       const jitter = (Math.random() - 0.5) * step * 0.6; // slice kulla random idathula nikkum
//       const target = 360 * 6 - (prizeIndex * step + step / 2 + jitter);
//       const next = current.current + ((target - (current.current % 360) + 360) % 360) + 360 * 5;
//       Animated.timing(rotation, { toValue: next, duration: 5000, easing: Easing.out(Easing.cubic), useNativeDriver: true })
//         .start(() => { current.current = next; resolve(); });
//     });

//   // 2) SPIN press -> backend ku request -> result vandhadhum wheel rotate
//   const onSpin = async () => {
//     if (spinning || spun || !rewards.length) return;
//     setSpinning(true);
//     try {
//       const playerId = await getDeviceId();
//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ playerId, sessionId }),
//       });
//       const data = await res.json();
//       if (!data.success && res.status !== 409) throw new Error(data.message);
//       await animateTo(data.prizeIndex, rewards.length);
//       setWon(data.reward);
//       setSpun(true);
//     } catch (e: any) {
//       alert(e.message || 'Spin failed, try again');
//     } finally {
//       setSpinning(false);
//     }
//   };

//   const spinDeg = rotation.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
//   const n = rewards.length || 8;

//   return (
//     <View style={s.container}>
//       <Text style={s.title}>5 rounds complete!</Text>
//       <Text style={s.subtitle}>Spin pannunga, reward jeyichukonga</Text>

//       <View style={{ width: SIZE, height: SIZE + 20 }}>
//         {/* pointer */}
//         <View style={s.pointer} />
//         <Animated.View style={{ marginTop: 20, transform: [{ rotate: spinDeg }] }}>
//           <Svg width={SIZE} height={SIZE}>
//             <Circle cx={R} cy={R} r={R - 2} fill="#F2A900" />
//             {rewards.map((rw, i) => {
//               const mid = polar(i * (360 / n) + 180 / n, R * 0.66);
//               const rot = i * (360 / n) + 180 / n;
//               return (
//                 <G key={rw.id}>
//                   <Path d={slicePath(i, n)} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth={1.5} />
//                   <G rotation={rot} origin={`${mid.x}, ${mid.y}`}>
//                     <SvgText x={mid.x} y={mid.y - 6} fontSize={18} textAnchor="middle">{rw.icon}</SvgText>
//                     <SvgText x={mid.x} y={mid.y + 14} fontSize={13} fontWeight="bold" textAnchor="middle" fill={TEXT_DARK[i % 8]}>
//                       {rw.label}
//                     </SvgText>
//                   </G>
//                 </G>
//               );
//             })}
//           </Svg>
//         </Animated.View>

//         {/* center SPIN button */}
//         <TouchableOpacity style={s.center} onPress={onSpin} disabled={spinning || spun} activeOpacity={0.85}>
//           {spinning ? <ActivityIndicator color="#F2A900" /> : <Text style={s.centerText}>{spun ? 'DONE' : 'SPIN'}</Text>}
//         </TouchableOpacity>
//       </View>

//       <Modal transparent visible={!!won} animationType="fade">
//         <View style={s.overlay}>
//           <View style={s.card}>
//             <Text style={{ fontSize: 56 }}>{won?.icon}</Text>
//             <Text style={s.winTitle}>{won?.type === 'coins' && won.amount >= 100 ? 'JACKPOT!' : 'You won!'}</Text>
//             <Text style={s.winSub}>{won?.sub}</Text>
//             <TouchableOpacity
//               style={s.btn}
//               onPress={() => { setWon(null); navigation.replace('Roundcompletescreen', { sessionId }); }} // ungal next screen name
//             >
//               <Text style={s.btnText}>Continue</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#1B5FD1', alignItems: 'center', justifyContent: 'center' },
//   title: { color: '#fff', fontSize: 26, fontWeight: '800' },
//   subtitle: { color: '#d6e4ff', marginBottom: 24, marginTop: 4 },
//   pointer: {
//     position: 'absolute', top: 0, left: R - 14, zIndex: 5, width: 0, height: 0,
//     borderLeftWidth: 14, borderRightWidth: 14, borderTopWidth: 30,
//     borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#2ECC71',
//   },
//   center: {
//     position: 'absolute', top: 20 + R - 42, left: R - 42, width: 84, height: 84, borderRadius: 42,
//     backgroundColor: '#8B1A1A', borderWidth: 6, borderColor: '#F2A900', alignItems: 'center', justifyContent: 'center',
//   },
//   centerText: { color: '#FFC83D', fontWeight: '900', fontSize: 18 },
//   overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
//   card: { backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center', width: 280 },
//   winTitle: { fontSize: 24, fontWeight: '800', marginTop: 8 },
//   winSub: { fontSize: 16, color: '#555', marginTop: 6, textAlign: 'center' },
//   btn: { marginTop: 20, backgroundColor: '#1B5FD1', paddingVertical: 12, paddingHorizontal: 36, borderRadius: 24 },
//   btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
// });
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import Svg, { Path, G, Text as SvgText, Circle } from 'react-native-svg';
// npx expo install react-native-svg
import { getDeviceId } from '../utils/deviceId'; // ungal function name ku match pannunga
import { playSound } from '../utils/sound';

const API_URL = 'http://YOUR_BACKEND_IP:5000/api/spin'; // mathikonga

type Reward = { id: string; type: 'coins' | 'hint' | 'time'; amount: number; label: string; sub: string; icon: string };

const SIZE = 300;
const R = SIZE / 2;
const COLORS = ['#F5E6B3', '#2E9BFF', '#B146F0', '#FF4F9A', '#2ECC71', '#FF4F9A', '#2E9BFF', '#F5E6B3'];
const TEXT_DARK = ['#5a4300', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#5a4300'];

const polar = (angleDeg: number, r: number) => {
  const a = ((angleDeg - 90) * Math.PI) / 180; // 0° = top
  return { x: R + r * Math.cos(a), y: R + r * Math.sin(a) };
};
const slicePath = (i: number, n: number) => {
  const step = 360 / n;
  const p1 = polar(i * step, R - 8);
  const p2 = polar((i + 1) * step, R - 8);
  return `M${R},${R} L${p1.x},${p1.y} A${R - 8},${R - 8} 0 0 1 ${p2.x},${p2.y} Z`;
};

export default function SpinWheelScreen({ route, navigation }: any) {
  const sessionId: string = route?.params?.sessionId;
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [won, setWon] = useState<Reward | null>(null);
  const [spun, setSpun] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const current = useRef(0);

  // 1) wheel slices backend la irundhu load
  useEffect(() => {
    fetch(`${API_URL}/config`).then(r => r.json()).then(d => d.success && setRewards(d.rewards)).catch(() => {});
  }, []);

  const animateTo = (prizeIndex: number, n: number) =>
    new Promise<void>(resolve => {
      const step = 360 / n;
      const jitter = (Math.random() - 0.5) * step * 0.6; // slice kulla random idathula nikkum
      const target = 360 * 6 - (prizeIndex * step + step / 2 + jitter);
      const next = current.current + ((target - (current.current % 360) + 360) % 360) + 360 * 5;
      // slice boundary pointer-a cross pannum bodhu "tik tik tik" sound
      let lastSlice = Math.floor(current.current / step);
      const id = rotation.addListener(({ value }) => {
        const slice = Math.floor(value / step);
        if (slice !== lastSlice) { lastSlice = slice; playSound('spinTick', 35); }
      });
      Animated.timing(rotation, { toValue: next, duration: 5000, easing: Easing.out(Easing.cubic), useNativeDriver: true })
        .start(() => { rotation.removeListener(id); current.current = next; resolve(); });
    });

  // 2) SPIN press -> backend ku request -> result vandhadhum wheel rotate
  const onSpin = async () => {
    if (spinning || spun || !rewards.length) return;
    setSpinning(true);
    try {
      const playerId = await getDeviceId();
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, sessionId }),
      });
      const data = await res.json();
      if (!data.success && res.status !== 409) throw new Error(data.message);
      playSound('whoosh');
      await animateTo(data.prizeIndex, rewards.length);
      playSound(data.reward.id === 'jackpot' ? 'jackpot' : 'win');
      setWon(data.reward);
      setSpun(true);
    } catch (e: any) {
      alert(e.message || 'Spin failed, try again');
    } finally {
      setSpinning(false);
    }
  };

  const spinDeg = rotation.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
  const n = rewards.length || 8;

  return (
    <View style={s.container}>
      <Text style={s.title}>5 rounds complete!</Text>
      <Text style={s.subtitle}>Spin pannunga, reward jeyichukonga</Text>

      <View style={{ width: SIZE, height: SIZE + 20 }}>
        {/* pointer */}
        <View style={s.pointer} />
        <Animated.View style={{ marginTop: 20, transform: [{ rotate: spinDeg }] }}>
          <Svg width={SIZE} height={SIZE}>
            <Circle cx={R} cy={R} r={R - 2} fill="#F2A900" />
            {rewards.map((rw, i) => {
              const mid = polar(i * (360 / n) + 180 / n, R * 0.66);
              const rot = i * (360 / n) + 180 / n;
              return (
                <G key={rw.id}>
                  <Path d={slicePath(i, n)} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth={1.5} />
                  <G rotation={rot} origin={`${mid.x}, ${mid.y}`}>
                    <SvgText x={mid.x} y={mid.y - 6} fontSize={18} textAnchor="middle">{rw.icon}</SvgText>
                    <SvgText x={mid.x} y={mid.y + 14} fontSize={13} fontWeight="bold" textAnchor="middle" fill={TEXT_DARK[i % 8]}>
                      {rw.label}
                    </SvgText>
                  </G>
                </G>
              );
            })}
          </Svg>
        </Animated.View>

        {/* center SPIN button */}
        <TouchableOpacity style={s.center} onPress={onSpin} disabled={spinning || spun} activeOpacity={0.85}>
          {spinning ? <ActivityIndicator color="#F2A900" /> : <Text style={s.centerText}>{spun ? 'DONE' : 'SPIN'}</Text>}
        </TouchableOpacity>
      </View>

      <Modal transparent visible={!!won} animationType="fade">
        <View style={s.overlay}>
          <View style={s.card}>
            <Text style={{ fontSize: 56 }}>{won?.icon}</Text>
            <Text style={s.winTitle}>{won?.type === 'coins' && won.amount >= 100 ? 'JACKPOT!' : 'You won!'}</Text>
            <Text style={s.winSub}>{won?.sub}</Text>
            <TouchableOpacity
              style={s.btn}
              onPress={() => { setWon(null); navigation.replace('Roundcompletescreen', { sessionId }); }} // ungal next screen name
            >
              <Text style={s.btnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1B5FD1', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 26, fontWeight: '800' },
  subtitle: { color: '#d6e4ff', marginBottom: 24, marginTop: 4 },
  pointer: {
    position: 'absolute', top: 0, left: R - 14, zIndex: 5, width: 0, height: 0,
    borderLeftWidth: 14, borderRightWidth: 14, borderTopWidth: 30,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#2ECC71',
  },
  center: {
    position: 'absolute', top: 20 + R - 42, left: R - 42, width: 84, height: 84, borderRadius: 42,
    backgroundColor: '#8B1A1A', borderWidth: 6, borderColor: '#F2A900', alignItems: 'center', justifyContent: 'center',
  },
  centerText: { color: '#FFC83D', fontWeight: '900', fontSize: 18 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center', width: 280 },
  winTitle: { fontSize: 24, fontWeight: '800', marginTop: 8 },
  winSub: { fontSize: 16, color: '#555', marginTop: 6, textAlign: 'center' },
  btn: { marginTop: 20, backgroundColor: '#1B5FD1', paddingVertical: 12, paddingHorizontal: 36, borderRadius: 24 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
