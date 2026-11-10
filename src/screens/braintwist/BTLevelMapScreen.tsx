
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, ScrollView, Animated,
  StyleSheet, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMap, openLevel, LevelMap, MapLevel } from './mapApi';

const BG = require('../../../assets/levels_map.jpg');
const RATIO = 1536 / 1024;

// part of the picture (top) that is hidden: it holds the baked "LEVELS" banner.
// if the castle flag of level 41 gets cut, make this smaller (e.g. 0.07)
const CROP = 0.085;
const HEADER_H = 64; // space for the fixed header on top of the scroll content

// levels 1..41 : positions on the picture  [x, y, size]  (fractions of the picture)
const POS: [number, number, number][] = [
  [0.5010, 0.8711, 0.1152],
  [0.6543, 0.8255, 0.0879],
  [0.5264, 0.7852, 0.0918],
  [0.3779, 0.7721, 0.0889],
  [0.3613, 0.7142, 0.0811],
  [0.4834, 0.6641, 0.0762],
  [0.6133, 0.6576, 0.0742],
  [0.7285, 0.6777, 0.0742],
  [0.3193, 0.5788, 0.0771],
  [0.4521, 0.5840, 0.0742],
  [0.5723, 0.5898, 0.0723],
  [0.6992, 0.5983, 0.0752],
  [0.8105, 0.5762, 0.0762],
  [0.7500, 0.5169, 0.0762],
  [0.6240, 0.5091, 0.0752],
  [0.4863, 0.5182, 0.0752],
  [0.3438, 0.5156, 0.0762],
  [0.2910, 0.4701, 0.0801],
  [0.3975, 0.4271, 0.0771],
  [0.5342, 0.4323, 0.0771],
  [0.6650, 0.4382, 0.0752],
  [0.7812, 0.4290, 0.0771],
  [0.7383, 0.3724, 0.0762],
  [0.6006, 0.3652, 0.0762],
  [0.4512, 0.3704, 0.0752],
  [0.2969, 0.3783, 0.0732],
  [0.2373, 0.3307, 0.0732],
  [0.3486, 0.3125, 0.0723],
  [0.4668, 0.3086, 0.0732],
  [0.5938, 0.3073, 0.0742],
  [0.7275, 0.2982, 0.0742],
  [0.7061, 0.2428, 0.0732],
  [0.5850, 0.2448, 0.0723],
  [0.4570, 0.2461, 0.0723],
  [0.3281, 0.2480, 0.0723],
  [0.2363, 0.2194, 0.0723],
  [0.3262, 0.1764, 0.0713],
  [0.4375, 0.1699, 0.0713],
  [0.5469, 0.1777, 0.0723],
  [0.6543, 0.1777, 0.0732],
  [0.7637, 0.1432, 0.0977],
];

// levels 42..50 : "Sky Path" section above the picture  [x, y, size]
// x, y are fractions of the section (y = 0 top ... 1 bottom, 42 is at the bottom near level 41)
const EXT_POS: [number, number, number][] = [
  [0.62, 0.92, 0.0770], // 42
  [0.44, 0.85, 0.0770], // 43
  [0.26, 0.77, 0.0770], // 44
  [0.38, 0.66, 0.0770], // 45
  [0.57, 0.59, 0.0770], // 46
  [0.75, 0.50, 0.0770], // 47
  [0.60, 0.37, 0.0770], // 48
  [0.42, 0.29, 0.0770], // 49
  [0.50, 0.12, 0.1050], // 50 (big, castle)
];
const EXT_H_RATIO = 1.35; // section height = width * this
const CLOUDS: [number, number, number][] = [ // x, y, scale
  [0.10, 0.06, 1.0], [0.72, 0.20, 0.8], [0.12, 0.42, 0.7], [0.80, 0.70, 0.9], [0.08, 0.88, 0.8],
];

type Props = { playerId: number; onBack: () => void; onPlay: (n: number) => void };

export default function BTLevelMapScreen({ playerId, onBack, onPlay }: Props) {
  const { width, height } = useWindowDimensions();
  const W = Math.min(width, 460);
  const H = W * RATIO;           // full picture height
  const E = W * EXT_H_RATIO;     // sky section height
  const imgH = H * (1 - CROP);   // visible part of the picture
  const imgTop = HEADER_H + E;   // where the picture starts in the scroll content
  const contentH = imgTop + imgH;

  const [map, setMap] = useState<LevelMap | null>(null);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scroller = useRef<ScrollView>(null);
  const pulse = useRef(new Animated.Value(0)).current;

  // centre + size of every bubble (index 0 = level 1) in scroll-content pixels
  const centers = useMemo(() => {
    const a: { x: number; y: number; s: number }[] = [];
    POS.forEach(([fx, fy, fs]) => a.push({ x: fx * W, y: imgTop + fy * H - CROP * H, s: fs * W }));
    EXT_POS.forEach(([fx, fy, fs]) => a.push({ x: fx * W, y: HEADER_H + fy * E, s: fs * W }));
    return a;
  }, [W, H, E, imgTop]);

  // dotted path from level 41 up to level 50
  const pathDots = useMemo(() => {
    const pts = [centers[40], ...centers.slice(41)];
    const dots: { x: number; y: number }[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      for (let k = 1; k <= 5; k++) {
        const t = k / 6;
        dots.push({ x: pts[i].x + (pts[i + 1].x - pts[i].x) * t, y: pts[i].y + (pts[i + 1].y - pts[i].y) * t });
      }
    }
    return dots;
  }, [centers]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const showToast = (m: string) => {
    setToast(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2400);
  };

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      getMap(playerId)
        .then((m) => {
          if (!alive) return;
          setMap(m);
          const idx = Math.min(Math.max(m.currentLevel, 1), centers.length) - 1;
          setTimeout(() => {
            scroller.current?.scrollTo({ y: Math.max(0, centers[idx].y - height * 0.45), animated: false });
          }, 80);
        })
        .catch((e: any) => alive && showToast(e.message || 'Could not load levels'));
      return () => { alive = false; };
    }, [playerId, centers, height])
  );

  // no level is locked: any built level can be opened
  const tap = async (l: MapLevel) => {
    if (busy) return;
    if (l.status === 'soon') return showToast('Coming soon!');
    setBusy(true);
    try {
      await openLevel(playerId, l.n); // backend confirms
      onPlay(l.n);
    } catch (e: any) {
      showToast(e.message || 'Cannot open level');
      if (e.map) setMap(e.map);
    } finally {
      setBusy(false);
    }
  };

  if (!map) {
    return (
      <View style={[st.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const visible = map.levels.slice(0, centers.length);
  const earned = map.levels.reduce((sum, l) => sum + (l.stars || 0), 0);
  const maxStars = Math.max(1, map.total) * 3;

  const bubble = (l: MapLevel, i: number) => {
    const c = centers[i];
    const S = Math.max(36, c.s * 1.12);
    const bodyH = S * 0.8;
    const soon = l.status === 'soon';
    const done = l.status === 'completed';
    const cur = l.status === 'current';
    const last = i === centers.length - 1; // level 50

    let bg = '#1f9d3a';
    let edge = '#0f6b22';
    if (soon) { bg = '#5f8f66'; edge = '#3f6a46'; }
    if (last && !soon) { bg = '#ffb300'; edge = '#c77f00'; }
    if (cur) { bg = '#ff9a1f'; edge = '#c2610a'; }

    const scale = cur
      ? pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] })
      : 1;

    return (
      <TouchableOpacity
        key={l.n}
        activeOpacity={0.85}
        onPress={() => tap(l)}
        hitSlop={{ top: 8, bottom: 14, left: 8, right: 8 }}
        style={{
          position: 'absolute',
          width: S,
          height: bodyH + S * 0.3,
          left: c.x - S / 2,
          top: c.y - bodyH / 2,
        }}
      >
        <Animated.View
          style={{
            width: S,
            height: bodyH,
            borderRadius: S * 0.4,
            backgroundColor: bg,
            borderWidth: 3,
            borderColor: '#fffbe6',
            borderBottomWidth: 5,
            borderBottomColor: edge,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: soon ? 0.85 : 1,
            transform: [{ scale }],
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
          }}
        >
          <Text style={[st.num, { fontSize: S * 0.42 }]}>{l.n}</Text>
        </Animated.View>

        {done && (
          <View style={[st.starRow, { top: bodyH - 3 }]}>
            {[0, 1, 2].map((s) => (
              <Text key={s} style={{ fontSize: S * 0.28, color: s < l.stars ? '#ffd23f' : '#ffffff88' }}>★</Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const c50 = centers[centers.length - 1];

  return (
    <View style={st.root}>
      <ScrollView
        ref={scroller}
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: W, height: contentH, backgroundColor: '#8fd4f5' }}>
          {/* sky section (levels 42-50) */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: imgTop, backgroundColor: '#8fd4f5' }} />
          <View style={{ position: 'absolute', left: 0, right: 0, top: imgTop * 0.45, height: imgTop * 0.55, backgroundColor: '#a9e0f8' }} />
          {CLOUDS.map(([fx, fy, sc], i) => (
            <View key={i} style={{ position: 'absolute', left: fx * W, top: HEADER_H + fy * E, opacity: 0.9 }}>
              <View style={{ width: 90 * sc, height: 30 * sc, borderRadius: 20 * sc, backgroundColor: '#fff' }} />
              <View style={{ position: 'absolute', left: 14 * sc, top: -14 * sc, width: 40 * sc, height: 40 * sc, borderRadius: 20 * sc, backgroundColor: '#fff' }} />
              <View style={{ position: 'absolute', left: 42 * sc, top: -8 * sc, width: 34 * sc, height: 34 * sc, borderRadius: 17 * sc, backgroundColor: '#fff' }} />
            </View>
          ))}

          {/* dotted path 41 -> 50 */}
          {pathDots.map((d, i) => (
            <View key={i} style={{ position: 'absolute', left: d.x - 4, top: d.y - 4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#fffbe6', opacity: 0.95 }} />
          ))}

          {/* castle above level 50 */}
          <Text style={{ position: 'absolute', left: c50.x - 30, top: c50.y - c50.s * 1.15 - 34, fontSize: 52 }}>🏰</Text>

          {/* the map picture (top part with the old banner is cropped away) */}
          <View style={{ position: 'absolute', left: 0, top: imgTop, width: W, height: imgH, overflow: 'hidden' }}>
            <Image source={BG} resizeMode="stretch" style={{ position: 'absolute', left: 0, top: -CROP * H, width: W, height: H }} />
          </View>

          {/* level bubbles 1..50 */}
          {visible.map((l, i) => bubble(l, i))}
        </View>
      </ScrollView>

      {/* fixed header (replaces the banner that was drawn inside the picture) */}
      <View style={st.header} pointerEvents="box-none">
        <TouchableOpacity onPress={onBack} activeOpacity={0.8} style={st.backBtn}>
          <Text style={st.backTxt}>←</Text>
        </TouchableOpacity>
        <View style={st.title}>
          <Text style={st.titleTxt}>LEVELS</Text>
        </View>
        <View style={st.badge}>
          <Text style={st.badgeStar}>★</Text>
          <Text style={st.badgeT}>{earned}/{maxStars}</Text>
        </View>
      </View>

      {/* toast */}
      {!!toast && (
        <View style={[st.toast, { top: HEADER_H + 8, width: W * 0.84, alignSelf: 'center' }]}>
          <Text style={st.toastT}>{toast}</Text>
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#8fd4f5' },
  header: {
    position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingTop: 6, zIndex: 10,
  },
  backBtn: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#e8741c',
    borderWidth: 3, borderColor: '#8a3f0c', alignItems: 'center', justifyContent: 'center',
  },
  backTxt: { color: '#fff', fontSize: 26, fontWeight: '900', marginTop: -2 },
  title: {
    backgroundColor: '#a85a1c', borderWidth: 3, borderColor: '#6b3510', borderRadius: 14,
    paddingHorizontal: 24, paddingVertical: 6,
  },
  titleTxt: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  badge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: '#a85a1c', borderWidth: 3, borderColor: '#6b3510', borderRadius: 12,
    paddingHorizontal: 10, height: 40,
  },
  badgeStar: { color: '#ffd23f', fontSize: 20, fontWeight: '900' },
  badgeT: { color: '#fff', fontSize: 16, fontWeight: '900' },
  toast: {
    position: 'absolute', paddingVertical: 10, borderRadius: 30,
    backgroundColor: 'rgba(45,25,10,0.92)', borderWidth: 2, borderColor: '#8a6a45', zIndex: 20,
  },
  toastT: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
  num: {
    color: '#fff', fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 1,
  },
  starRow: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
});