import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const WOOD = '#f0b872';
const NAVY = '#10245e';

export function BTIconButtonGlyph({ glyph }: { glyph: string }) {
  return <Text style={{ fontSize: 22, fontWeight: '900', color: '#3b2a12' }}>{glyph}</Text>;
}

export function BTBulbIcon({ size = 16 }: { size?: number }) {
  const bulb = size * 0.75;
  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      <View
        style={{
          width: bulb,
          height: bulb,
          borderRadius: bulb / 2,
          backgroundColor: '#ffd23f',
          borderWidth: Math.max(1, size / 14),
          borderColor: '#e0a800',
        }}
      />
      <View
        style={{
          width: bulb * 0.5,
          height: size * 0.22,
          backgroundColor: '#9aa0a6',
          borderRadius: 2,
          marginTop: -1,
        }}
      />
    </View>
  );
}

export function BTMagnifierIcon() {
  return (
    <View style={{ width: 40, height: 40 }}>
      <View
        style={{
          position: 'absolute',
          left: 3,
          top: 3,
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 5,
          borderColor: '#1b2a41',
          backgroundColor: '#eaf6ff',
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 25,
          top: 22,
          width: 7,
          height: 17,
          borderRadius: 3,
          backgroundColor: '#1b2a41',
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}

export function BTGiftIcon() {
  return (
    <View style={{ width: 38, height: 38, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', marginBottom: -2 }}>
        <View style={g.bow} />
        <View style={[g.bow, { marginLeft: 2 }]} />
      </View>
      <View style={g.lid}>
        <View style={g.ribbonV} />
      </View>
      <View style={g.box}>
        <View style={g.ribbonV} />
      </View>
    </View>
  );
}

export function BTVideoIcon() {
  return (
    <View style={v.frame}>
      <View style={v.screen}>
        <View style={v.play} />
      </View>
    </View>
  );
}

/* hanging lamp (top centre-right) */
export function BTLamp() {
  return (
    <View style={l.wrap} pointerEvents="none">
      <View style={l.cord} />
      <View style={l.shade} />
      <View style={l.bulb} />
    </View>
  );
}

/* room background */
export function BTLevel36Room() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#7fc4f5' }]} />

      {/* window */}
      <View style={r.window}>
        <View style={r.glass}>
          <View style={[r.cloud, { top: 22, left: 8, width: 40 }]} />
          <View style={[r.cloud, { top: 60, left: 0, width: 26 }]} />
        </View>
      </View>
      <View style={r.sill} />
      <View style={r.plantPot}>
        <View style={r.eye} />
        <View style={[r.eye, { marginLeft: 8 }]} />
      </View>
      <View style={[r.leaf, { left: 18, bottom: 380, height: 52 }]} />
      <View style={[r.leaf, { left: 38, bottom: 380, height: 66 }]} />

      {/* wall pictures */}
      <View style={[r.picture, { top: 120, right: 10 }]}>
        <View style={r.sun} />
      </View>
      <View style={[r.picture, { top: 215, right: 14, width: 50, height: 52 }]}>
        <View style={[r.sun, { width: 26, height: 26, borderRadius: 13 }]} />
      </View>

      {/* bookshelf */}
      <View style={r.shelf}>
        <View style={[r.book, { left: 6, height: 40, backgroundColor: '#2fa0e8' }]} />
        <View style={[r.book, { left: 18, height: 46, backgroundColor: '#ffc83d' }]} />
        <View style={[r.book, { left: 30, height: 42, backgroundColor: '#8a5fd6' }]} />
        <View style={[r.book, { left: 6, top: 86, height: 38, backgroundColor: '#3a6fd0' }]} />
        <View style={[r.book, { left: 18, top: 82, height: 42, backgroundColor: '#2fae9b' }]} />
      </View>

      {/* floor + rug */}
      <View style={r.floor} />
      <View style={r.rug} />

      {/* bush */}
      <View style={r.bush} />
      <View style={[r.bush, { left: 20, bottom: -50, width: 90, height: 90, backgroundColor: '#3f9a2f' }]} />
    </View>
  );
}

const g = StyleSheet.create({
  bow: {
    width: 12,
    height: 10,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d62828',
    backgroundColor: '#ff5a5f',
  },
  lid: {
    width: 36,
    height: 9,
    borderRadius: 3,
    backgroundColor: '#e63946',
    alignItems: 'center',
  },
  box: {
    width: 32,
    height: 18,
    backgroundColor: '#ff4d57',
    alignItems: 'center',
  },
  ribbonV: {
    width: 7,
    height: '100%',
    backgroundColor: '#ffe27a',
  },
});

const v = StyleSheet.create({
  frame: {
    width: 40,
    height: 34,
    borderRadius: 6,
    borderWidth: 4,
    borderColor: NAVY,
    backgroundColor: '#ffffff',
    padding: 3,
  },
  screen: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: '#b57be6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  play: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#ffffff',
    marginLeft: 3,
  },
});

const l = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: '66%', alignItems: 'center' },
  cord: { width: 3, height: 26, backgroundColor: '#1b6fc2' },
  shade: {
    width: 46,
    height: 22,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    backgroundColor: '#1e90ff',
  },
  bulb: {
    width: 16,
    height: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#fff27a',
  },
});

const r = StyleSheet.create({
  window: {
    position: 'absolute',
    top: 110,
    left: -6,
    width: 90,
    height: 220,
    borderWidth: 6,
    borderColor: WOOD,
    backgroundColor: WOOD,
  },
  glass: { flex: 1, backgroundColor: '#9fdbfb', overflow: 'hidden' },
  cloud: { position: 'absolute', height: 14, borderRadius: 7, backgroundColor: '#fff' },
  sill: {
    position: 'absolute',
    top: 326,
    left: 0,
    width: 100,
    height: 12,
    backgroundColor: WOOD,
  },
  plantPot: {
    position: 'absolute',
    top: 296,
    left: 14,
    width: 44,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#f6f1e3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#5b4a2a' },
  leaf: {
    position: 'absolute',
    width: 22,
    borderRadius: 14,
    backgroundColor: '#5fbf3a',
  },
  picture: {
    position: 'absolute',
    width: 62,
    height: 70,
    backgroundColor: '#dcecf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sun: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f4a53a',
    borderWidth: 4,
    borderColor: '#f9d27a',
  },
  shelf: {
    position: 'absolute',
    right: 0,
    top: 330,
    width: 62,
    height: 150,
    backgroundColor: '#e39a4d',
    borderTopLeftRadius: 6,
  },
  book: { position: 'absolute', top: 10, width: 10, borderRadius: 2 },
  floor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 190,
    backgroundColor: '#f6b46a',
  },
  rug: {
    position: 'absolute',
    left: '8%',
    right: '8%',
    bottom: 10,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f07f5a',
  },
  bush: {
    position: 'absolute',
    left: -40,
    bottom: -40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#4fae3a',
  },
});