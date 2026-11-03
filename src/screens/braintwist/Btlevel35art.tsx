// BTLevel35Art.tsx
// Pure View/Text artwork (no extra libraries needed).

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function BTRockArt() {
  return (
    <View style={art.center}>
      <View style={art.rock}>
        <View style={art.rockShine} />
      </View>
    </View>
  );
}

export function BTPaperArt() {
  return (
    <View style={art.center}>
      <View style={art.paper}>
        <View style={art.paperLine} />
        <View style={art.paperLine} />
        <View style={art.paperLine} />
        <View style={art.paperLine} />
      </View>
    </View>
  );
}

export function BTScissorsArt() {
  return (
    <View style={art.center}>
      <View style={art.scissors}>
        <View style={[art.blade, { transform: [{ rotate: '22deg' }] }]} />
        <View style={[art.blade, { transform: [{ rotate: '-22deg' }] }]} />
        <View style={[art.ring, { left: 4 }]} />
        <View style={[art.ring, { right: 4 }]} />
      </View>
    </View>
  );
}

export function BTBulbIcon({ size = 18 }: { size?: number }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#ffd23f',
          borderWidth: 2,
          borderColor: '#e0a800',
        }}
      />
      <View
        style={{
          width: size * 0.5,
          height: size * 0.3,
          backgroundColor: '#8a93a0',
          borderRadius: 2,
          marginTop: -1,
        }}
      />
    </View>
  );
}

export function BTCoinIcon({ size = 18 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#ffc61a',
        borderWidth: 2,
        borderColor: '#d89a00',
      }}
    />
  );
}

export function BTMagnifierIcon() {
  return (
    <View style={{ width: 40, height: 40 }}>
      <View
        style={{
          position: 'absolute',
          left: 4,
          top: 4,
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 5,
          borderColor: '#1b2a41',
          backgroundColor: '#dff6ff',
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 24,
          top: 26,
          width: 6,
          height: 18,
          borderRadius: 3,
          backgroundColor: '#1b2a41',
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}

export function BTVideoIcon() {
  return (
    <View style={art.videoBox}>
      <View style={art.triangleSmall} />
    </View>
  );
}

export function BTPlayIcon() {
  return <View style={art.triangleBig} />;
}

export function BTIconButtonGlyph({ glyph }: { glyph: string }) {
  return <Text style={{ fontSize: 26, color: '#1b2a41', fontWeight: '900' }}>{glyph}</Text>;
}

const art = StyleSheet.create({
  center: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rock: {
    width: 54,
    height: 38,
    borderRadius: 24,
    backgroundColor: '#8a93a0',
    borderWidth: 3,
    borderColor: '#4a5260',
    transform: [{ rotate: '-15deg' }],
  },
  rockShine: {
    position: 'absolute',
    left: 8,
    top: 6,
    width: 18,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#c3cad4',
  },
  paper: {
    width: 42,
    height: 52,
    borderRadius: 4,
    backgroundColor: '#fff7d6',
    borderWidth: 2,
    borderColor: '#c9b36a',
    paddingTop: 8,
    paddingHorizontal: 6,
    transform: [{ rotate: '18deg' }],
  },
  paperLine: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#e4b84a',
    marginBottom: 6,
  },
  scissors: {
    width: 56,
    height: 56,
  },
  blade: {
    position: 'absolute',
    left: 25,
    top: 2,
    width: 6,
    height: 34,
    borderRadius: 3,
    backgroundColor: '#aab4c2',
    borderWidth: 1,
    borderColor: '#5b6575',
  },
  ring: {
    position: 'absolute',
    bottom: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 4,
    borderColor: '#e0405a',
  },
  videoBox: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#a13de0',
    borderWidth: 3,
    borderColor: '#1b2a41',
    alignItems: 'center',
    justifyContent: 'center',
  },
  triangleSmall: {
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 11,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#ffffff',
  },
  triangleBig: {
    width: 0,
    height: 0,
    borderTopWidth: 14,
    borderBottomWidth: 14,
    borderLeftWidth: 24,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#1b1b1b',
    marginLeft: 6,
  },
});
