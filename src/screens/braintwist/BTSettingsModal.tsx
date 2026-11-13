

// import React, { useEffect, useRef } from 'react';
// import {
//   View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Alert, BackHandler, Platform,
// } from 'react-native';
// import Svg, { Path, Circle, Polygon, Line } from 'react-native-svg';
// import { play } from './BTSound';

// const NAVY = '#10245e';
// const CREAM = '#fdebd3';
// const PURPLE = '#8a35e8';
// const PURPLE_DARK = '#6a1fc2';

// /* ---------- icons ---------- */
// const MusicIcon = () => (
//   <Svg width={32} height={32} viewBox="0 0 24 24">
//     <Path d="M9 18V5l12-2v13" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
//     <Circle cx={6} cy={18} r={3} fill="#fff" />
//     <Circle cx={18} cy={16} r={3} fill="#fff" />
//   </Svg>
// );

// const SpeakerIcon = () => (
//   <Svg width={32} height={32} viewBox="0 0 24 24">
//     <Polygon points="3,9 7,9 12,5 12,19 7,15 3,15" fill="#fff" />
//     <Path d="M15.5 8.5a5 5 0 0 1 0 7" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" />
//     <Path d="M18 6a8.5 8.5 0 0 1 0 12" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" />
//   </Svg>
// );

// const StarIcon = () => (
//   <Svg width={30} height={30} viewBox="0 0 24 24">
//     <Polygon
//       points="12,2 15,9 22,9.5 16.5,14.5 18.5,22 12,17.5 5.5,22 7.5,14.5 2,9.5 9,9"
//       fill={PURPLE}
//       stroke={PURPLE_DARK}
//       strokeWidth={1}
//       strokeLinejoin="round"
//     />
//   </Svg>
// );

// const Sparks: React.FC<{ flip?: boolean }> = ({ flip }) => (
//   <Svg width={30} height={34} viewBox="0 0 30 34" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
//     <Line x1={4} y1={17} x2={22} y2={17} stroke="#ffc83d" strokeWidth={4} strokeLinecap="round" />
//     <Line x1={7} y1={4} x2={22} y2={10} stroke="#ffc83d" strokeWidth={4} strokeLinecap="round" />
//     <Line x1={7} y1={30} x2={22} y2={24} stroke="#ffc83d" strokeWidth={4} strokeLinecap="round" />
//   </Svg>
// );

// /* ---------- ON / OFF toggle ---------- */
// const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => {
//   const x = useRef(new Animated.Value(value ? 1 : 0)).current;
//   useEffect(() => {
//     Animated.timing(x, { toValue: value ? 1 : 0, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
//   }, [value]);
//   const knobX = x.interpolate({ inputRange: [0, 1], outputRange: [0, 58] });
//   return (
//     <TouchableOpacity
//       activeOpacity={0.85}
//       onPress={() => onChange(!value)}
//       style={[styles.toggle, value ? styles.toggleOn : styles.toggleOff]}
//     >
//       <Text style={[styles.toggleText, value ? { left: 16 } : { right: 14 }]}>{value ? 'ON' : 'OFF'}</Text>
//       <Animated.View style={[styles.knob, { transform: [{ translateX: knobX }] }]} />
//     </TouchableOpacity>
//   );
// };

// /* ---------- one row: icon + label + toggle ---------- */
// const Row: React.FC<{ icon: React.ReactNode; label: string; value: boolean; onChange: (v: boolean) => void }> = ({
//   icon, label, value, onChange,
// }) => (
//   <View style={styles.row}>
//     <View style={styles.rowIcon}>{icon}</View>
//     <Text style={styles.rowLabel}>{label}</Text>
//     <Toggle value={value} onChange={onChange} />
//   </View>
// );

// /* ---------- the Settings pop-up ---------- */
// export type BTSettingsModalProps = {
//   visible: boolean;
//   onClose: () => void;
//   music: boolean;
//   sfx: boolean;
//   onMusicChange: (v: boolean) => void;
//   onSfxChange: (v: boolean) => void;
//   onAbout?: () => void;
//   version?: string;
// };

// export default function BTSettingsModal({
//   visible, onClose, music, sfx, onMusicChange, onSfxChange, onAbout, version = '1.0.0',
// }: BTSettingsModalProps) {
//   const pop = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (visible) {
//       pop.setValue(0);
//       Animated.spring(pop, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }).start();
//     }
//   }, [visible]);

//   // Android back button closes the pop-up
//   useEffect(() => {
//     if (!visible || Platform.OS === 'web') return;
//     const sub = BackHandler.addEventListener('hardwareBackPress', () => {
//       onClose();
//       return true;
//     });
//     return () => sub.remove();
//   }, [visible]);

//   // the toggle state lives in BTSound (useBTSound), so just play a confirm tap here
//   const handleSfx = (v: boolean) => { onSfxChange(v); if (v) play('tap'); };
//   const handleMusic = (v: boolean) => { onMusicChange(v); if (sfx) play('tap'); };
//   const handleClose = () => { play('tap'); onClose(); };

//   const defaultAbout =() => Alert.alert('About', `Brain Twist\nVersion ${version}`);

//   // Not a RN <Modal>: it is drawn inside the parent (the game column), so it is always centred in the column.
//   if (!visible) return null;

//   return (
//       <View style={styles.overlay}>
//         <Animated.View
//           style={{
//             width: '88%',
//             maxWidth: 400,
//             opacity: pop,
//             transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
//           }}
//         >
//           {/* orange framed cream card */}
//           <View style={styles.card}>
//             <View style={{ height: 34 }} />

//             <Row icon={<MusicIcon />} label="Music" value={music} onChange={handleMusic} />
//             <Row icon={<SpeakerIcon />} label="Sound Effects" value={sfx} onChange={handleSfx} />

//             <View style={styles.divider} />

//             <View style={styles.aboutRow}>
//               <Sparks />
//               <TouchableOpacity activeOpacity={0.85} style={styles.aboutBtn} onPress={onAbout || defaultAbout}>
//                 <Text style={styles.aboutText}>About</Text>
//               </TouchableOpacity>
//               <Sparks flip />
//             </View>

//             <View style={styles.versionRow}>
//               <StarIcon />
//               <Text style={styles.versionText}>Version {version}</Text>
//             </View>

//             <TouchableOpacity activeOpacity={0.85} style={styles.closeBtn} onPress={handleClose}>
//               <Text style={styles.closeText}>Close</Text>
//             </TouchableOpacity>
//           </View>

//           {/* wooden "Settings" banner with leaves */}
//           <View style={styles.bannerWrap} pointerEvents="none">
//             <View style={[styles.leaf, { left: -6, top: -6, transform: [{ rotate: '-35deg' }] }]} />
//             <View style={[styles.leaf, { left: 8, top: 18, transform: [{ rotate: '20deg' }] }]} />
//             <View style={[styles.leaf, { right: -6, top: -6, transform: [{ rotate: '35deg' }] }]} />
//             <View style={[styles.leaf, { right: 8, top: 18, transform: [{ rotate: '-20deg' }] }]} />
//             <View style={styles.banner}>
//               <Text style={styles.bannerText}>Settings</Text>
//             </View>
//           </View>

//           {/* red close (X) */}
//           <TouchableOpacity activeOpacity={0.85} style={styles.xBtn} onPress={handleClose}>
//             <Svg width={22} height={22} viewBox="0 0 24 24">
//               <Line x1={5} y1={5} x2={19} y2={19} stroke="#fff" strokeWidth={4.5} strokeLinecap="round" />
//               <Line x1={19} y1={5} x2={5} y2={19} stroke="#fff" strokeWidth={4.5} strokeLinecap="round" />
//             </Svg>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     ...StyleSheet.absoluteFillObject, zIndex: 999, elevation: 999,
//     backgroundColor: 'rgba(8,16,48,0.55)', alignItems: 'center', justifyContent: 'center',
//   },
//   card: {
//     backgroundColor: CREAM, borderRadius: 34, borderWidth: 7, borderColor: '#f5a21c',
//     paddingHorizontal: 22, paddingTop: 34, paddingBottom: 22, marginTop: 30,
//     shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 10,
//   },
//   row: { flexDirection: 'row', alignItems: 'center', marginVertical: 9 },
//   rowIcon: {
//     width: 58, height: 58, borderRadius: 29, backgroundColor: PURPLE, borderWidth: 3, borderColor: PURPLE_DARK,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   rowLabel: { flex: 1, marginLeft: 16, fontSize: 21, fontWeight: '900', color: NAVY },
//   toggle: { width: 112, height: 52, borderRadius: 26, borderWidth: 3, justifyContent: 'center' },
//   toggleOn: { backgroundColor: '#2fcf3f', borderColor: '#1f9e2e' },
//   toggleOff: { backgroundColor: '#b9b9c6', borderColor: '#8d8da0' },
//   toggleText: { position: 'absolute', color: '#fff', fontSize: 20, fontWeight: '900' },
//   knob: {
//     position: 'absolute', left: 4, width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff',
//     shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 3,
//   },
//   divider: { height: 2, backgroundColor: '#c9a6ee', marginTop: 12, marginBottom: 14, marginHorizontal: 6 },
//   aboutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
//   aboutBtn: {
//     backgroundColor: PURPLE, borderRadius: 22, paddingHorizontal: 44, paddingVertical: 8,
//     borderWidth: 2, borderColor: PURPLE_DARK, marginHorizontal: 8,
//   },
//   aboutText: { color: '#fff', fontSize: 22, fontWeight: '900' },
//   versionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
//   versionText: { marginLeft: 10, fontSize: 19, fontWeight: '700', color: NAVY },
//   closeBtn: {
//     alignSelf: 'center', marginTop: 16, backgroundColor: PURPLE, borderRadius: 28, paddingHorizontal: 70, paddingVertical: 10,
//     borderWidth: 4, borderColor: PURPLE_DARK,
//     shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 }, elevation: 5,
//   },
//   closeText: { color: '#fff', fontSize: 28, fontWeight: '900' },
//   bannerWrap: { position: 'absolute', top: 0, left: 14, right: 14, alignItems: 'center' },
//   banner: {
//     alignSelf: 'stretch', backgroundColor: '#b9672a', borderRadius: 16, borderWidth: 4, borderColor: '#8a4a1b',
//     paddingVertical: 6, alignItems: 'center',
//     shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, elevation: 8,
//   },
//   bannerText: {
//     color: '#fff', fontSize: 38, fontWeight: '900',
//     textShadowColor: 'rgba(0,0,0,0.35)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 3,
//   },
//   leaf: { position: 'absolute', width: 46, height: 26, borderRadius: 18, backgroundColor: '#6dbf4a', zIndex: 5 },
//   xBtn: {
//     position: 'absolute', top: 24, right: -8, width: 46, height: 46, borderRadius: 23, backgroundColor: '#e2182f',
//     borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
//     shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 9,
//   },
// });
import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Alert, BackHandler, Platform,
} from 'react-native';
import Svg, { Path, Circle, Polygon, Line } from 'react-native-svg';
import { play } from './BTSound';

/* palette (same as the Brain Twist home screen) */
const NAVY = '#10245e';
const INDIGO = '#5a3be0';
const INDIGO_DARK = '#3a1a9a';
const LAVENDER = '#f1eefc';
const LAVENDER_LINE = '#c9b8ff';
const PURPLE = '#8a3fe0';
const PURPLE_DARK = '#5a1fb8';
const BLUE = '#2f8be0';
const BLUE_DARK = '#1c5fb0';
const YELLOW = '#ffd21f';
const ORANGE = '#f08a1c';
const PINK = '#f0457a';

/* ---------- icons ---------- */
const MusicIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 24 24">
    <Path d="M9 18V5l12-2v13" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx={6} cy={18} r={3} fill="#fff" />
    <Circle cx={18} cy={16} r={3} fill="#fff" />
  </Svg>
);

const SpeakerIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 24 24">
    <Polygon points="3,9 7,9 12,5 12,19 7,15 3,15" fill="#fff" />
    <Path d="M15.5 8.5a5 5 0 0 1 0 7" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    <Path d="M18 6a8.5 8.5 0 0 1 0 12" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" />
  </Svg>
);

const StarIcon = () => (
  <Svg width={30} height={30} viewBox="0 0 24 24">
    <Polygon
      points="12,2 15,9 22,9.5 16.5,14.5 18.5,22 12,17.5 5.5,22 7.5,14.5 2,9.5 9,9"
      fill={YELLOW}
      stroke="#f0b020"
      strokeWidth={1}
      strokeLinejoin="round"
    />
  </Svg>
);

const Sparks: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <Svg width={30} height={34} viewBox="0 0 30 34" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
    <Line x1={4} y1={17} x2={22} y2={17} stroke={YELLOW} strokeWidth={4} strokeLinecap="round" />
    <Line x1={7} y1={4} x2={22} y2={10} stroke={YELLOW} strokeWidth={4} strokeLinecap="round" />
    <Line x1={7} y1={30} x2={22} y2={24} stroke={YELLOW} strokeWidth={4} strokeLinecap="round" />
  </Svg>
);

/* 4-point sparkle used on the banner corners */
const Sparkle: React.FC<{ s?: number; c?: string }> = ({ s = 24, c = '#fff3b8' }) => (
  <Svg width={s} height={s} viewBox="0 0 100 100">
    <Polygon points="50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40" fill={c} />
  </Svg>
);

/* ---------- ON / OFF toggle ---------- */
const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => {
  const x = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(x, { toValue: value ? 1 : 0, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [value]);
  const knobX = x.interpolate({ inputRange: [0, 1], outputRange: [0, 58] });
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onChange(!value)}
      style={[styles.toggle, value ? styles.toggleOn : styles.toggleOff]}
    >
      <Text style={[styles.toggleText, value ? { left: 16 } : { right: 14 }]}>{value ? 'ON' : 'OFF'}</Text>
      <Animated.View style={[styles.knob, { transform: [{ translateX: knobX }] }]} />
    </TouchableOpacity>
  );
};

/* ---------- one row: icon + label + toggle ---------- */
const Row: React.FC<{ icon: React.ReactNode; label: string; value: boolean; onChange: (v: boolean) => void; tone?: 'purple' | 'blue' }> = ({
  icon, label, value, onChange, tone = 'purple',
}) => (
  <View style={styles.row}>
    <View style={[styles.rowIcon, tone === 'blue' ? styles.rowIconBlue : styles.rowIconPurple]}>{icon}</View>
    <Text style={styles.rowLabel}>{label}</Text>
    <Toggle value={value} onChange={onChange} />
  </View>
);

/* ---------- the Settings pop-up ---------- */
export type BTSettingsModalProps = {
  visible: boolean;
  onClose: () => void;
  music: boolean;
  sfx: boolean;
  onMusicChange: (v: boolean) => void;
  onSfxChange: (v: boolean) => void;
  onAbout?: () => void;
  version?: string;
};

export default function BTSettingsModal({
  visible, onClose, music, sfx, onMusicChange, onSfxChange, onAbout, version = '1.0.0',
}: BTSettingsModalProps) {
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      pop.setValue(0);
      Animated.spring(pop, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }).start();
    }
  }, [visible]);

  // Android back button closes the pop-up
  useEffect(() => {
    if (!visible || Platform.OS === 'web') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible]);

  // the toggle state lives in BTSound (useBTSound), so just play a confirm tap here
  const handleSfx = (v: boolean) => { onSfxChange(v); if (v) play('tap'); };
  const handleMusic = (v: boolean) => { onMusicChange(v); if (sfx) play('tap'); };
  const handleClose = () => { play('tap'); onClose(); };

  const defaultAbout = () => Alert.alert('About', `Brain Twist\nVersion ${version}`);

  // Not a RN <Modal>: it is drawn inside the parent (the game column), so it is always centred in the column.
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={{
          width: '88%',
          maxWidth: 400,
          opacity: pop,
          transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
        }}
      >
        {/* indigo framed lavender card */}
        <View style={styles.card}>
          <View style={styles.gloss} pointerEvents="none" />
          <View style={{ height: 34 }} />

          <Row icon={<MusicIcon />} label="Music" value={music} onChange={handleMusic} tone="purple" />
          <Row icon={<SpeakerIcon />} label="Sound Effects" value={sfx} onChange={handleSfx} tone="blue" />

          <View style={styles.divider} />

          <View style={styles.aboutRow}>
            <Sparks />
            <TouchableOpacity activeOpacity={0.85} style={styles.aboutBtn} onPress={onAbout || defaultAbout}>
              <View style={styles.aboutShine} />
              <Text style={styles.aboutText}>About</Text>
            </TouchableOpacity>
            <Sparks flip />
          </View>

          <View style={styles.versionRow}>
            <StarIcon />
            <Text style={styles.versionText}>Version {version}</Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.closeBtn} onPress={handleClose}>
            <View style={styles.closeShine} />
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* purple "Settings" banner with sparkles */}
        <View style={styles.bannerWrap} pointerEvents="none">
          <View style={{ position: 'absolute', left: -10, top: -10 }}><Sparkle s={28} /></View>
          <View style={{ position: 'absolute', left: 10, top: 24 }}><Sparkle s={16} c="#ffd21f" /></View>
          <View style={{ position: 'absolute', right: -10, top: -10, zIndex: 5 }}><Sparkle s={28} /></View>
          <View style={{ position: 'absolute', right: 10, top: 24, zIndex: 5 }}><Sparkle s={16} c="#ffd21f" /></View>
          <View style={styles.banner}>
            <View style={styles.bannerShine} />
            <Text style={styles.bannerText}>Settings</Text>
          </View>
        </View>

        {/* pink close (X) */}
        <TouchableOpacity activeOpacity={0.85} style={styles.xBtn} onPress={handleClose}>
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Line x1={5} y1={5} x2={19} y2={19} stroke="#fff" strokeWidth={4.5} strokeLinecap="round" />
            <Line x1={19} y1={5} x2={5} y2={19} stroke="#fff" strokeWidth={4.5} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, zIndex: 999, elevation: 999,
    backgroundColor: 'rgba(20,10,80,0.68)', alignItems: 'center', justifyContent: 'center',
  },
  card: {
    backgroundColor: LAVENDER, borderRadius: 34, borderWidth: 7, borderColor: INDIGO,
    paddingHorizontal: 22, paddingTop: 34, paddingBottom: 22, marginTop: 30, overflow: 'hidden',
    shadowColor: '#9a7bff', shadowOpacity: 0.8, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 12,
  },
  gloss: {
    position: 'absolute', top: 52, left: 22, width: 46, height: 12, borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.95)', transform: [{ rotate: '-14deg' }],
  },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 9 },
  rowIcon: {
    width: 58, height: 58, borderRadius: 29, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
  },
  rowIconPurple: { backgroundColor: PURPLE, borderColor: PURPLE_DARK },
  rowIconBlue: { backgroundColor: BLUE, borderColor: BLUE_DARK },
  rowLabel: { flex: 1, marginLeft: 16, fontSize: 21, fontWeight: '900', color: NAVY },
  toggle: { width: 112, height: 52, borderRadius: 26, borderWidth: 3, justifyContent: 'center' },
  toggleOn: { backgroundColor: '#2fcf3f', borderColor: '#1f9e2e' },
  toggleOff: { backgroundColor: '#b8b2dc', borderColor: '#8a82c0' },
  toggleText: { position: 'absolute', color: '#fff', fontSize: 20, fontWeight: '900' },
  knob: {
    position: 'absolute', left: 4, width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  divider: { height: 2, backgroundColor: LAVENDER_LINE, marginTop: 12, marginBottom: 14, marginHorizontal: 6 },
  aboutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  aboutBtn: {
    backgroundColor: PURPLE, borderRadius: 22, paddingHorizontal: 44, paddingVertical: 8,
    borderWidth: 3, borderColor: INDIGO_DARK, marginHorizontal: 8, overflow: 'hidden',
  },
  aboutShine: {
    position: 'absolute', top: 3, left: 14, right: 14, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)',
  },
  aboutText: { color: '#fff', fontSize: 22, fontWeight: '900' },
  versionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  versionText: { marginLeft: 10, fontSize: 19, fontWeight: '700', color: NAVY },
  closeBtn: {
    alignSelf: 'center', marginTop: 16, backgroundColor: YELLOW, borderRadius: 28, paddingHorizontal: 70, paddingVertical: 10,
    borderWidth: 4, borderColor: ORANGE, overflow: 'hidden',
    shadowColor: '#ffb030', shadowOpacity: 0.6, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  closeShine: {
    position: 'absolute', top: 4, left: 22, right: 22, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)',
  },
  closeText: { color: NAVY, fontSize: 28, fontWeight: '900' },
  bannerWrap: { position: 'absolute', top: 0, left: 14, right: 14, alignItems: 'center' },
  banner: {
    alignSelf: 'stretch', backgroundColor: PURPLE, borderRadius: 16, borderWidth: 4, borderColor: INDIGO_DARK,
    paddingVertical: 6, alignItems: 'center', overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, elevation: 8,
  },
  bannerShine: {
    position: 'absolute', top: 4, left: 18, right: 18, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)',
  },
  bannerText: {
    color: '#fff', fontSize: 38, fontWeight: '900',
    textShadowColor: INDIGO_DARK, textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 3,
  },
  xBtn: {
    position: 'absolute', top: 24, right: -8, width: 46, height: 46, borderRadius: 23, backgroundColor: PINK,
    borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 9,
  },
});