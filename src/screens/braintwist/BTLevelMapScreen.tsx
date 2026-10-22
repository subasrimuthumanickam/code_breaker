
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, ImageBackground, ScrollView, Animated,
  StyleSheet, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMap, openLevel, LevelMap, MapLevel } from './mapApi';


const BG = require('../../../assets/levels_map.jpg');
const RATIO = 1536 / 1024; 


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

type Props = { playerId: number; onBack: () => void; onPlay: (n: number) => void };

export default function BTLevelMapScreen({ playerId, onBack, onPlay }: Props) {
  const { width, height } = useWindowDimensions();
  const W = Math.min(width, 460);
  const H = W * RATIO;

  const [map, setMap] = useState<LevelMap | null>(null);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scroller = useRef<ScrollView>(null);
  const pulse = useRef(new Animated.Value(0)).current;

  
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
        
          const idx = Math.min(Math.max(m.currentLevel, 1), POS.length) - 1;
          setTimeout(() => {
            scroller.current?.scrollTo({ y: Math.max(0, POS[idx][1] * H - height * 0.45), animated: false });
          }, 80);
        })
        .catch((e: any) => alive && showToast(e.message || 'Could not load levels'));
      return () => { alive = false; };
    }, [playerId, H, height])
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

  const visible = map.levels.slice(0, POS.length);
  const earned = map.levels.reduce((sum, l) => sum + (l.stars || 0), 0);
  const maxStars = Math.max(1, map.total) * 3;

  const bubble = (l: MapLevel, i: number) => {
    const [fx, fy, fs] = POS[i];
    const S = Math.max(36, fs * W * 1.12);
    const bodyH = S * 0.8;
    const soon = l.status === 'soon';
    const done = l.status === 'completed';
    const cur = l.status === 'current';
    const last = i === POS.length - 1;

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
          left: fx * W - S / 2,
          top: fy * H - bodyH / 2,
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

  return (
    <View style={st.root}>
      <ScrollView
        ref={scroller}
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground source={BG} resizeMode="stretch" style={{ width: W, height: H }}>
         
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            style={{ position: 'absolute', left: W * 0.024, top: H * 0.056 - W * 0.06, width: W * 0.12, height: W * 0.12, borderRadius: W * 0.06 }}
          />

          {/* star counter (covers the old 50/50 badge) */}
          <View
            style={[
              st.badge,
              { left: W * 0.772, top: H * 0.017, width: W * 0.222, height: H * 0.056 },
            ]}
          >
            <Text style={st.badgeStar}>★</Text>
            <Text style={st.badgeT}>{earned}/{maxStars}</Text>
          </View>

          {/* toast */}
          {!!toast && (
            <View style={[st.toast, { top: H * 0.1, width: W * 0.84, left: W * 0.08 }]}>
              <Text style={st.toastT}>{toast}</Text>
            </View>
          )}

          {/* level bubbles */}
          {visible.map((l, i) => bubble(l, i))}
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2a9d4e' },
  badge: {
    position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: '#a85a1c', borderWidth: 3, borderColor: '#6b3510', borderRadius: 12,
  },
  badgeStar: { color: '#ffd23f', fontSize: 20, fontWeight: '900' },
  badgeT: { color: '#fff', fontSize: 16, fontWeight: '900' },
  toast: {
    position: 'absolute', paddingVertical: 10, borderRadius: 30,
    backgroundColor: 'rgba(45,25,10,0.92)', borderWidth: 2, borderColor: '#8a6a45', zIndex: 5,
  },
  toastT: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
  num: {
    color: '#fff', fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 1,
  },
  starRow: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
});