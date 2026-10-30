// // Btlevel29art.tsx
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// export const Car = () => (
//   <View style={styles.car}>
//     <View style={styles.mirrorL} />
//     <View style={styles.mirrorR} />
//     <View style={styles.windshield} />
//     <View style={styles.roof} />
//     <View style={styles.rearWindow} />
//     <View style={styles.lightL} />
//     <View style={styles.lightR} />
//   </View>
// );

// interface Props {
//   spots: string[]; // "?" = car
// }

// export const ParkingRow: React.FC<Props> = ({ spots }) => (
//   <View style={styles.row}>
//     {spots.map((s, i) => (
//       <View key={i} style={styles.spot}>
//         {s === '?' ? <Car /> : <Text style={styles.num}>{s}</Text>}
//       </View>
//     ))}
//     <View style={styles.floor} />
//   </View>
// );

// const styles = StyleSheet.create({
//   row: {
//     flexDirection: 'row',
//     height: 170,
//     marginTop: 14,
//     borderLeftWidth: 4,
//     borderColor: '#F9B934',
//   },
//   spot: {
//     flex: 1,
//     borderRightWidth: 4,
//     borderColor: '#F9B934',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     paddingBottom: 10,
//   },
//   floor: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: 4,
//     backgroundColor: '#F9B934',
//   },
//   num: { fontSize: 24, fontWeight: '800', color: '#1F2A5C' },

//   car: {
//     width: 44,
//     height: 100,
//     backgroundColor: '#EF4B3F',
//     borderRadius: 22,
//     borderWidth: 2,
//     borderColor: '#1F2A5C',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   windshield: {
//     position: 'absolute',
//     top: 14,
//     width: 30,
//     height: 18,
//     backgroundColor: '#1F2A5C',
//     borderRadius: 8,
//   },
//   roof: {
//     position: 'absolute',
//     top: 36,
//     width: 28,
//     height: 22,
//     backgroundColor: '#E03A30',
//     borderRadius: 6,
//   },
//   rearWindow: {
//     position: 'absolute',
//     top: 62,
//     width: 30,
//     height: 14,
//     backgroundColor: '#1F2A5C',
//     borderRadius: 7,
//   },
//   mirrorL: {
//     position: 'absolute',
//     left: -7,
//     top: 34,
//     width: 8,
//     height: 5,
//     backgroundColor: '#1F2A5C',
//     borderRadius: 2,
//   },
//   mirrorR: {
//     position: 'absolute',
//     right: -7,
//     top: 34,
//     width: 8,
//     height: 5,
//     backgroundColor: '#1F2A5C',
//     borderRadius: 2,
//   },
//   lightL: {
//     position: 'absolute',
//     bottom: 4,
//     left: 6,
//     width: 8,
//     height: 6,
//     backgroundColor: '#F9B934',
//     borderRadius: 3,
//   },
//   lightR: {
//     position: 'absolute',
//     bottom: 4,
//     right: 6,
//     width: 8,
//     height: 6,
//     backgroundColor: '#F9B934',
//     borderRadius: 3,
//   },
// });
// Btlevel29art.tsx - Level 1 cozy room background + parking row + car
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';

const NAVY = '#1F2A5C';

/* ---------- room background (same as Level 1, clean = no rug / no front plant) ---------- */
const yoyo = (v: Animated.Value, ms: number) =>
  Animated.loop(
    Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])
  ).start();

const Mote = ({ left, size, ms, delay }: any) => {
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.loop(Animated.timing(p, { toValue: 1, duration: ms, easing: Easing.linear, useNativeDriver: true })),
    ]).start();
  }, []);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left,
        bottom: '18%',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#fff',
        opacity: p.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.8, 0.6, 0] }),
        transform: [
          { translateY: p.interpolate({ inputRange: [0, 1], outputRange: [0, -420] }) },
          { translateX: p.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 14, -8] }) },
        ],
      }}
    />
  );
};

const Leaf = ({ l, b, w, h, r, c }: any) => (
  <View
    style={{
      position: 'absolute',
      left: l,
      bottom: b,
      width: w,
      height: h,
      borderRadius: h / 2,
      backgroundColor: c || '#5fae3a',
      transform: [{ rotate: r + 'deg' }],
    }}
  />
);

export function RoomBg() {
  const beam = useRef(new Animated.Value(0)).current,
    cl = useRef(new Animated.Value(0)).current,
    sw = useRef(new Animated.Value(0)).current,
    sw2 = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    yoyo(beam, 3600);
    yoyo(sw, 2400);
    yoyo(sw2, 3000);
    Animated.loop(Animated.timing(cl, { toValue: 1, duration: 26000, easing: Easing.linear, useNativeDriver: true })).start();
  }, []);
  const bo = beam.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }),
    bx = beam.interpolate({ inputRange: [0, 1], outputRange: [-14, 14] }),
    cx = cl.interpolate({ inputRange: [0, 1], outputRange: [-50, 90] }),
    plantR = sw.interpolate({ inputRange: [0, 1], outputRange: ['-3deg', '3deg'] }),
    plantR2 = sw2.interpolate({ inputRange: [0, 1], outputRange: ['2.5deg', '-2.5deg'] });
  const books = (arr: any[]) =>
    arr.map((b, i) => (
      <View key={i} style={{ width: b[0], height: b[1], backgroundColor: b[2], borderRadius: 2, marginRight: 1 }} />
    ));
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* wall */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '45%', backgroundColor: 'rgba(255,255,255,0.22)' }} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: '45%', height: '30%', backgroundColor: 'rgba(255,255,255,0.08)' }} />
      {/* picture frame (sun) */}
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
            <View style={rs.eye} />
            <View style={rs.eye} />
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
      {/* hanging vine on shelf */}
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
      {/* dust motes */}
      {[[40, 5, 9000, 0], [110, 4, 11000, 2500], [180, 6, 10000, 1200], [240, 4, 12000, 4000], [300, 5, 9500, 800], [75, 3, 13000, 6000], [210, 3, 8500, 3200]].map((m, i) => (
        <Mote key={i} left={m[0]} size={m[1]} ms={m[2]} delay={m[3]} />
      ))}
    </View>
  );
}

/* ---------- car (top view) ---------- */
export const Car = () => (
  <View style={styles.car}>
    <View style={styles.mirrorL} />
    <View style={styles.mirrorR} />
    <View style={styles.windshield} />
    <View style={styles.roof} />
    <View style={styles.rearWindow} />
    <View style={styles.lightL} />
    <View style={styles.lightR} />
  </View>
);

/* ---------- parking row ("?" = car) ---------- */
interface Props {
  spots: string[];
}

export const ParkingRow: React.FC<Props> = ({ spots }) => (
  <View style={styles.row}>
    {spots.map((s, i) => (
      <View key={i} style={styles.spot}>
        {s === '?' ? <Car /> : <Text style={styles.num}>{s}</Text>}
      </View>
    ))}
    <View style={styles.floor} />
  </View>
);

const rs = StyleSheet.create({ eye: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#5b3a29' } });

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 150,
    marginTop: 14,
    borderLeftWidth: 4,
    borderColor: '#F9B934',
  },
  spot: {
    flex: 1,
    borderRightWidth: 4,
    borderColor: '#F9B934',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  floor: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, backgroundColor: '#F9B934' },
  num: { fontSize: 24, fontWeight: '800', color: NAVY },

  car: {
    width: 44,
    height: 100,
    backgroundColor: '#EF4B3F',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: NAVY,
    alignItems: 'center',
    marginBottom: 4,
  },
  windshield: { position: 'absolute', top: 14, width: 30, height: 18, backgroundColor: NAVY, borderRadius: 8 },
  roof: { position: 'absolute', top: 36, width: 28, height: 22, backgroundColor: '#E03A30', borderRadius: 6 },
  rearWindow: { position: 'absolute', top: 62, width: 30, height: 14, backgroundColor: NAVY, borderRadius: 7 },
  mirrorL: { position: 'absolute', left: -7, top: 34, width: 8, height: 5, backgroundColor: NAVY, borderRadius: 2 },
  mirrorR: { position: 'absolute', right: -7, top: 34, width: 8, height: 5, backgroundColor: NAVY, borderRadius: 2 },
  lightL: { position: 'absolute', bottom: 4, left: 6, width: 8, height: 6, backgroundColor: '#F9B934', borderRadius: 3 },
  lightR: { position: 'absolute', bottom: 4, right: 6, width: 8, height: 6, backgroundColor: '#F9B934', borderRadius: 3 },
});