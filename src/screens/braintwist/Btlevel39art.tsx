// // // // Icons (from the 2nd screen style): home, settings, search, clue bulb, skip, tick, cross
// // // // npm i react-native-svg
// // // import React from 'react';
// // // import { View, StyleSheet } from 'react-native';
// // // import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

// // // const NAVY = '#0b1f4d';

// // // export const HomeIcon = ({ size = 28 }: { size?: number }) => (
// // //   <Svg width={size} height={size} viewBox="0 0 24 24">
// // //     <Path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z" fill={NAVY} />
// // //   </Svg>
// // // );

// // // export const GearIcon = ({ size = 28 }: { size?: number }) => (
// // //   <Svg width={size} height={size} viewBox="0 0 24 24">
// // //     <Circle cx="12" cy="12" r="6" stroke={NAVY} strokeWidth="2.4" fill="none" />
// // //     <Circle cx="12" cy="12" r="2.2" fill={NAVY} />
// // //     {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
// // //       <Rect key={a} x="10.8" y="1.5" width="2.4" height="4" rx="1" fill={NAVY} transform={`rotate(${a} 12 12)`} />
// // //     ))}
// // //   </Svg>
// // // );

// // // export const BulbIcon = ({ size = 24, color = '#ffd21f' }: { size?: number; color?: string }) => (
// // //   <Svg width={size} height={size} viewBox="0 0 24 24">
// // //     <Path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2z" fill={color} stroke={NAVY} strokeWidth="1.5" />
// // //     <Rect x="9" y="19" width="6" height="3" rx="1.2" fill={NAVY} />
// // //   </Svg>
// // // );

// // // export const SearchIcon = ({ size = 34 }: { size?: number }) => (
// // //   <Svg width={size} height={size} viewBox="0 0 24 24">
// // //     <Circle cx="10" cy="10" r="6" stroke={NAVY} strokeWidth="2.8" fill="none" />
// // //     <Path d="M15 15l6 6" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
// // //   </Svg>
// // // );

// // // export const SkipIcon = ({ size = 34 }: { size?: number }) => (
// // //   <Svg width={size} height={size} viewBox="0 0 24 24">
// // //     <Path d="M3 4l9 8-9 8zM12 4l9 8-9 8z" fill={NAVY} />
// // //   </Svg>
// // // );

// // // export const CheckIcon = ({ size = 30 }: { size?: number }) => (
// // //   <Svg width={size} height={size} viewBox="0 0 24 24">
// // //     <Path d="M4 12l5 5L20 6" stroke={NAVY} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
// // //   </Svg>
// // // );

// // // export const CrossIcon = ({ size = 30 }: { size?: number }) => (
// // //   <Svg width={size} height={size} viewBox="0 0 24 24">
// // //     <G stroke={NAVY} strokeWidth="3.6" strokeLinecap="round">
// // //       <Path d="M5 5l14 14" />
// // //       <Path d="M19 5L5 19" />
// // //     </G>
// // //   </Svg>
// // // );

// // // export const RoundIcon = ({ color, size = 62, children }: { color: string; size?: number; children: React.ReactNode }) => (
// // //   <View style={[styles.round, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]}>
// // //     {children}
// // //   </View>
// // // );

// // // const styles = StyleSheet.create({
// // //   round: { alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff', elevation: 4 },
// // // });

// // // export const COLORS = {
// // //   green: '#8ae234',
// // //   purple: '#b074f5',
// // //   red: '#ff6b7a',
// // //   navy: NAVY,
// // //   brown: '#7a3d12',
// // //   cream: '#fbf1d8',
// // // };
// // // Icons (from the 2nd screen style): home, settings, search, clue bulb, skip, tick, cross
// // // npm i react-native-svg
// // import React from 'react';
// // import { View, StyleSheet } from 'react-native';
// // import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

// // const NAVY = '#0b1f4d';

// // export const HomeIcon = ({ size = 28 }: { size?: number }) => (
// //   <Svg width={size} height={size} viewBox="0 0 24 24">
// //     <Path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z" fill={NAVY} />
// //   </Svg>
// // );

// // export const GearIcon = ({ size = 28 }: { size?: number }) => (
// //   <Svg width={size} height={size} viewBox="0 0 24 24">
// //     <Circle cx="12" cy="12" r="6" stroke={NAVY} strokeWidth="2.4" fill="none" />
// //     <Circle cx="12" cy="12" r="2.2" fill={NAVY} />
// //     {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
// //       <Rect key={a} x="10.8" y="1.5" width="2.4" height="4" rx="1" fill={NAVY} transform={`rotate(${a} 12 12)`} />
// //     ))}
// //   </Svg>
// // );

// // export const BulbIcon = ({ size = 24, color = '#ffd21f' }: { size?: number; color?: string }) => (
// //   <Svg width={size} height={size} viewBox="0 0 24 24">
// //     <Path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2z" fill={color} stroke={NAVY} strokeWidth="1.5" />
// //     <Rect x="9" y="19" width="6" height="3" rx="1.2" fill={NAVY} />
// //   </Svg>
// // );

// // export const SearchIcon = ({ size = 34 }: { size?: number }) => (
// //   <Svg width={size} height={size} viewBox="0 0 24 24">
// //     <Circle cx="10" cy="10" r="6" stroke={NAVY} strokeWidth="2.8" fill="none" />
// //     <Path d="M15 15l6 6" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
// //   </Svg>
// // );

// // export const SkipIcon = ({ size = 34 }: { size?: number }) => (
// //   <Svg width={size} height={size} viewBox="0 0 24 24">
// //     <Path d="M3 4l9 8-9 8zM12 4l9 8-9 8z" fill={NAVY} />
// //   </Svg>
// // );

// // export const CheckIcon = ({ size = 30 }: { size?: number }) => (
// //   <Svg width={size} height={size} viewBox="0 0 24 24">
// //     <Path d="M4 12l5 5L20 6" stroke={NAVY} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
// //   </Svg>
// // );

// // export const CrossIcon = ({ size = 30 }: { size?: number }) => (
// //   <Svg width={size} height={size} viewBox="0 0 24 24">
// //     <G stroke={NAVY} strokeWidth="3.6" strokeLinecap="round">
// //       <Path d="M5 5l14 14" />
// //       <Path d="M19 5L5 19" />
// //     </G>
// //   </Svg>
// // );

// // export const RoundIcon = ({ color, size = 62, children }: { color: string; size?: number; children: React.ReactNode }) => (
// //   <View style={[styles.round, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]}>
// //     {children}
// //   </View>
// // );

// // const styles = StyleSheet.create({
// //   round: { alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff', elevation: 4 },
// // });

// // export const COLORS = {
// //   green: '#8ae234',
// //   purple: '#b074f5',
// //   red: '#ff6b7a',
// //   navy: NAVY,
// //   brown: '#7a3d12',
// //   cream: '#fbf1d8',
// // };
// // Icons (from the 2nd screen style): home, settings, search, clue bulb, skip, tick, cross
// // npm i react-native-svg
// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

// const NAVY = '#0b1f4d';

// export const HomeIcon = ({ size = 28 }: { size?: number }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24">
//     <Path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z" fill={NAVY} />
//   </Svg>
// );

// export const GearIcon = ({ size = 28 }: { size?: number }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24">
//     <Circle cx="12" cy="12" r="6" stroke={NAVY} strokeWidth="2.4" fill="none" />
//     <Circle cx="12" cy="12" r="2.2" fill={NAVY} />
//     {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
//       <Rect key={a} x="10.8" y="1.5" width="2.4" height="4" rx="1" fill={NAVY} transform={`rotate(${a} 12 12)`} />
//     ))}
//   </Svg>
// );

// export const BulbIcon = ({ size = 24, color = '#ffd21f' }: { size?: number; color?: string }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24">
//     <Path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2z" fill={color} stroke={NAVY} strokeWidth="1.5" />
//     <Rect x="9" y="19" width="6" height="3" rx="1.2" fill={NAVY} />
//   </Svg>
// );

// export const SearchIcon = ({ size = 34 }: { size?: number }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24">
//     <Circle cx="10" cy="10" r="6" stroke={NAVY} strokeWidth="2.8" fill="none" />
//     <Path d="M15 15l6 6" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
//   </Svg>
// );

// export const SkipIcon = ({ size = 34 }: { size?: number }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24">
//     <Path d="M3 4l9 8-9 8zM12 4l9 8-9 8z" fill={NAVY} />
//   </Svg>
// );

// export const CheckIcon = ({ size = 30 }: { size?: number }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24">
//     <Path d="M4 12l5 5L20 6" stroke={NAVY} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );

// export const CrossIcon = ({ size = 30 }: { size?: number }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24">
//     <G stroke={NAVY} strokeWidth="3.6" strokeLinecap="round">
//       <Path d="M5 5l14 14" />
//       <Path d="M19 5L5 19" />
//     </G>
//   </Svg>
// );

// export const RoundIcon = ({ color, size = 62, children }: { color: string; size?: number; children: React.ReactNode }) => (
//   <View style={[styles.round, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]}>
//     {children}
//   </View>
// );

// const styles = StyleSheet.create({
//   round: { alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff', elevation: 4 },
// });

// export const COLORS = {
//   green: '#8ae234',
//   purple: '#b074f5',
//   red: '#ff6b7a',
//   navy: NAVY,
//   brown: '#7a3d12',
//   cream: '#fbf1d8',
// };
// Icons + cozy room background + bottom mat for Level 39
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

const NAVY = '#0b1f4d';

export const HomeIcon = ({ size = 28 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z" fill={NAVY} />
  </Svg>
);

export const GearIcon = ({ size = 28 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="6" stroke={NAVY} strokeWidth="2.4" fill="none" />
    <Circle cx="12" cy="12" r="2.2" fill={NAVY} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <Rect key={a} x="10.8" y="1.5" width="2.4" height="4" rx="1" fill={NAVY} transform={`rotate(${a} 12 12)`} />
    ))}
  </Svg>
);

export const BulbIcon = ({ size = 24, color = '#ffd21f' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2z" fill={color} stroke={NAVY} strokeWidth="1.5" />
    <Rect x="9" y="19" width="6" height="3" rx="1.2" fill={NAVY} />
  </Svg>
);

export const SearchIcon = ({ size = 34 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="10" cy="10" r="6" stroke={NAVY} strokeWidth="2.8" fill="none" />
    <Path d="M15 15l6 6" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

export const SkipIcon = ({ size = 34 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M3 4l9 8-9 8zM12 4l9 8-9 8z" fill={NAVY} />
  </Svg>
);

export const CheckIcon = ({ size = 30, color = NAVY }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 12l5 5L20 6" stroke={color} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CrossIcon = ({ size = 30, color = NAVY }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G stroke={color} strokeWidth="3.6" strokeLinecap="round">
      <Path d="M5 5l14 14" />
      <Path d="M19 5L5 19" />
    </G>
  </Svg>
);

export const RoundIcon = ({ color, size = 62, children }: { color: string; size?: number; children: React.ReactNode }) => (
  <View style={[styles.round, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]}>
    {children}
  </View>
);

/* ---------- cozy room background (same style as the other levels) ---------- */
const Leaf = ({ l, b, w, h, r, c }: any) => (
  <View
    style={{
      position: 'absolute', left: l, bottom: b, width: w, height: h, borderRadius: h / 2,
      backgroundColor: c || '#5fae3a', transform: [{ rotate: r + 'deg' }],
    }}
  />
);

export const RoomBackground = () => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {/* wall */}
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '45%', backgroundColor: 'rgba(255,255,255,0.22)' }} />

    {/* window */}
    <View style={{ position: 'absolute', left: -4, top: '4%', width: 70, height: 160, backgroundColor: '#f0b878', borderWidth: 5, borderColor: '#e2a35e', borderRadius: 4, overflow: 'hidden' }}>
      <View style={{ flex: 1, backgroundColor: '#8fd3f6', overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: 22, left: 8, width: 44, height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.9)' }} />
        <View style={{ position: 'absolute', left: 4, bottom: -12, width: 40, height: 54, borderRadius: 28, backgroundColor: '#7bc65a' }} />
        <View style={{ position: 'absolute', left: 30, bottom: -18, width: 44, height: 62, borderRadius: 32, backgroundColor: '#62b24a' }} />
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 4, backgroundColor: '#e2a35e' }} />
    </View>

    {/* picture frame */}
    <View style={{ position: 'absolute', right: '30%', top: '5%', width: 52, height: 60, backgroundColor: '#cfe6f3', borderWidth: 4, borderColor: '#8fc3d8' }}>
      <View style={{ alignSelf: 'center', marginTop: 12, width: 26, height: 26, borderRadius: 13, backgroundColor: '#f6a43c', borderWidth: 3, borderColor: '#f7c36a' }} />
    </View>

    {/* bookshelf (right) */}
    <View style={{ position: 'absolute', right: 0, top: '30%', width: 56, height: '26%', backgroundColor: '#e0a85e', borderLeftWidth: 5, borderTopWidth: 5, borderColor: '#c98d4d' }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 6, borderBottomWidth: 5, borderColor: '#c98d4d' }}>
        <View style={{ width: 10, height: 40, backgroundColor: '#58a6c8', marginRight: 1 }} />
        <View style={{ width: 9, height: 46, backgroundColor: '#f2c14e', marginRight: 1 }} />
        <View style={{ width: 10, height: 38, backgroundColor: '#7b6bd0' }} />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 6, borderBottomWidth: 5, borderColor: '#c98d4d' }}>
        <View style={{ width: 10, height: 34, backgroundColor: '#3f7fc4', marginRight: 1 }} />
        <View style={{ width: 9, height: 40, backgroundColor: '#59b3a0' }} />
      </View>
    </View>

    {/* floor */}
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '33%', backgroundColor: '#e9b575' }}>
      {[18, 46, 78, 112, 150].map((t, i) => (
        <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: t, height: 1.5, backgroundColor: 'rgba(150,90,40,0.18)' }} />
      ))}
    </View>
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: '33%', height: 12, backgroundColor: '#e8b8b0' }} />

    {/* books stack + toy car (left) */}
    <View style={{ position: 'absolute', left: -6, bottom: '29%' }}>
      <View style={{ width: 70, height: 13, borderRadius: 3, backgroundColor: '#3f9ad6', marginBottom: 1 }} />
      <View style={{ width: 78, height: 13, borderRadius: 3, backgroundColor: '#e86fae', marginBottom: 1, marginLeft: -4 }} />
      <View style={{ width: 72, height: 13, borderRadius: 3, backgroundColor: '#f2c14e', marginBottom: 1 }} />
    </View>
    <View style={{ position: 'absolute', left: 4, bottom: '25%', width: 46, height: 20, borderRadius: 9, backgroundColor: '#3aa0e0' }}>
      <View style={{ position: 'absolute', left: 12, top: -9, width: 20, height: 12, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: '#7cc7f0' }} />
      <View style={{ position: 'absolute', left: 5, bottom: -5, width: 10, height: 10, borderRadius: 5, backgroundColor: '#2d4a6b' }} />
      <View style={{ position: 'absolute', right: 5, bottom: -5, width: 10, height: 10, borderRadius: 5, backgroundColor: '#2d4a6b' }} />
    </View>

    {/* pencil cup (right) */}
    <View style={{ position: 'absolute', right: 6, bottom: '27%', width: 38, height: 50, borderRadius: 6, backgroundColor: '#f5c63a', borderWidth: 2, borderColor: '#e0a81f' }} />
    <View style={{ position: 'absolute', right: 20, bottom: '27%', marginBottom: 46, width: 5, height: 40, backgroundColor: '#e86f6f', transform: [{ rotate: '-10deg' }] }} />
    <View style={{ position: 'absolute', right: 13, bottom: '27%', marginBottom: 46, width: 5, height: 44, backgroundColor: '#3f7fc4', transform: [{ rotate: '-22deg' }] }} />
    <View style={{ position: 'absolute', right: 27, bottom: '27%', marginBottom: 46, width: 5, height: 38, backgroundColor: '#5fae3a', transform: [{ rotate: '8deg' }] }} />

    {/* plant (bottom-left) */}
    <View style={{ position: 'absolute', left: -30, bottom: -24, width: 130, height: 180 }}>
      <Leaf l={6} b={0} w={52} h={140} r={-14} c="#6bbb3f" />
      <Leaf l={38} b={0} w={48} h={124} r={18} c="#4f9f34" />
      <Leaf l={20} b={0} w={44} h={160} r={2} c="#7cc94a" />
    </View>
  </View>
);

/* ---------- bottom mat (cream panel with blue border) that holds Search / Clue / Skip ---------- */
export const BottomMat = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.mat}>{children}</View>
);

const styles = StyleSheet.create({
  round: { alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff', elevation: 4 },
  mat: {
    backgroundColor: '#f7e6c4',
    borderRadius: 40,
    borderWidth: 7,
    borderColor: '#9cc8ec',
    paddingVertical: 14,
    paddingHorizontal: 10,
    elevation: 6,
  },
});

export const COLORS = {
  green: '#8ae234',
  purple: '#b074f5',
  red: '#ff6b7a',
  navy: NAVY,
  brown: '#7a3d12',
  cream: '#fbf1d8',
};
