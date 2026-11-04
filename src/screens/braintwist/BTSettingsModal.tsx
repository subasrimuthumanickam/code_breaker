
import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Alert, BackHandler, Platform,
} from 'react-native';
import Svg, { Path, Circle, Polygon, Line } from 'react-native-svg';

const NAVY = '#10245e';
const CREAM = '#fdebd3';
const PURPLE = '#8a35e8';
const PURPLE_DARK = '#6a1fc2';

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
      fill={PURPLE}
      stroke={PURPLE_DARK}
      strokeWidth={1}
      strokeLinejoin="round"
    />
  </Svg>
);

const Sparks: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <Svg width={30} height={34} viewBox="0 0 30 34" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
    <Line x1={4} y1={17} x2={22} y2={17} stroke="#ffc83d" strokeWidth={4} strokeLinecap="round" />
    <Line x1={7} y1={4} x2={22} y2={10} stroke="#ffc83d" strokeWidth={4} strokeLinecap="round" />
    <Line x1={7} y1={30} x2={22} y2={24} stroke="#ffc83d" strokeWidth={4} strokeLinecap="round" />
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
const Row: React.FC<{ icon: React.ReactNode; label: string; value: boolean; onChange: (v: boolean) => void }> = ({
  icon, label, value, onChange,
}) => (
  <View style={styles.row}>
    <View style={styles.rowIcon}>{icon}</View>
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
          {/* orange framed cream card */}
          <View style={styles.card}>
            <View style={{ height: 34 }} />

            <Row icon={<MusicIcon />} label="Music" value={music} onChange={onMusicChange} />
            <Row icon={<SpeakerIcon />} label="Sound Effects" value={sfx} onChange={onSfxChange} />

            <View style={styles.divider} />

            <View style={styles.aboutRow}>
              <Sparks />
              <TouchableOpacity activeOpacity={0.85} style={styles.aboutBtn} onPress={onAbout || defaultAbout}>
                <Text style={styles.aboutText}>About</Text>
              </TouchableOpacity>
              <Sparks flip />
            </View>

            <View style={styles.versionRow}>
              <StarIcon />
              <Text style={styles.versionText}>Version {version}</Text>
            </View>

            <TouchableOpacity activeOpacity={0.85} style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* wooden "Settings" banner with leaves */}
          <View style={styles.bannerWrap} pointerEvents="none">
            <View style={[styles.leaf, { left: -6, top: -6, transform: [{ rotate: '-35deg' }] }]} />
            <View style={[styles.leaf, { left: 8, top: 18, transform: [{ rotate: '20deg' }] }]} />
            <View style={[styles.leaf, { right: -6, top: -6, transform: [{ rotate: '35deg' }] }]} />
            <View style={[styles.leaf, { right: 8, top: 18, transform: [{ rotate: '-20deg' }] }]} />
            <View style={styles.banner}>
              <Text style={styles.bannerText}>Settings</Text>
            </View>
          </View>

          {/* red close (X) */}
          <TouchableOpacity activeOpacity={0.85} style={styles.xBtn} onPress={onClose}>
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
    backgroundColor: 'rgba(8,16,48,0.55)', alignItems: 'center', justifyContent: 'center',
  },
  card: {
    backgroundColor: CREAM, borderRadius: 34, borderWidth: 7, borderColor: '#f5a21c',
    paddingHorizontal: 22, paddingTop: 34, paddingBottom: 22, marginTop: 30,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 9 },
  rowIcon: {
    width: 58, height: 58, borderRadius: 29, backgroundColor: PURPLE, borderWidth: 3, borderColor: PURPLE_DARK,
    alignItems: 'center', justifyContent: 'center',
  },
  rowLabel: { flex: 1, marginLeft: 16, fontSize: 21, fontWeight: '900', color: NAVY },
  toggle: { width: 112, height: 52, borderRadius: 26, borderWidth: 3, justifyContent: 'center' },
  toggleOn: { backgroundColor: '#2fcf3f', borderColor: '#1f9e2e' },
  toggleOff: { backgroundColor: '#b9b9c6', borderColor: '#8d8da0' },
  toggleText: { position: 'absolute', color: '#fff', fontSize: 20, fontWeight: '900' },
  knob: {
    position: 'absolute', left: 4, width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  divider: { height: 2, backgroundColor: '#c9a6ee', marginTop: 12, marginBottom: 14, marginHorizontal: 6 },
  aboutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  aboutBtn: {
    backgroundColor: PURPLE, borderRadius: 22, paddingHorizontal: 44, paddingVertical: 8,
    borderWidth: 2, borderColor: PURPLE_DARK, marginHorizontal: 8,
  },
  aboutText: { color: '#fff', fontSize: 22, fontWeight: '900' },
  versionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  versionText: { marginLeft: 10, fontSize: 19, fontWeight: '700', color: NAVY },
  closeBtn: {
    alignSelf: 'center', marginTop: 16, backgroundColor: PURPLE, borderRadius: 28, paddingHorizontal: 70, paddingVertical: 10,
    borderWidth: 4, borderColor: PURPLE_DARK,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 3 }, elevation: 5,
  },
  closeText: { color: '#fff', fontSize: 28, fontWeight: '900' },
  bannerWrap: { position: 'absolute', top: 0, left: 14, right: 14, alignItems: 'center' },
  banner: {
    alignSelf: 'stretch', backgroundColor: '#b9672a', borderRadius: 16, borderWidth: 4, borderColor: '#8a4a1b',
    paddingVertical: 6, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, elevation: 8,
  },
  bannerText: {
    color: '#fff', fontSize: 38, fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.35)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 3,
  },
  leaf: { position: 'absolute', width: 46, height: 26, borderRadius: 18, backgroundColor: '#6dbf4a', zIndex: 5 },
  xBtn: {
    position: 'absolute', top: 24, right: -8, width: 46, height: 46, borderRadius: 23, backgroundColor: '#e2182f',
    borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 9,
  },
});
