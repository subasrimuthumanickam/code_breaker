import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NumberItem } from './Btlevel47api';

/* ---------------- background scene (same theme as level 46 / 55) ---------------- */
const Cloud: React.FC<{ left?: string; right?: string; top: string; s: number }> = ({
  left,
  right,
  top,
  s,
}) => (
  <View style={{ position: 'absolute', left: left as any, right: right as any, top: top as any }}>
    <View style={{ width: 90 * s, height: 28 * s, borderRadius: 14 * s, backgroundColor: '#fff' }} />
    <View style={[styles.puff, { width: 40 * s, height: 40 * s, left: 14 * s, top: -18 * s }]} />
    <View style={[styles.puff, { width: 30 * s, height: 30 * s, left: 46 * s, top: -12 * s }]} />
  </View>
);

export const Scene: React.FC<{ s: number }> = ({ s }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#A9DBF7' }]} />
    <View style={styles.pinkWall} />
    <View style={styles.floor} />

    <View style={styles.windowFrame}>
      <View style={styles.windowBarV} />
      <View style={styles.windowBarH} />
      <View style={[styles.hill, { width: 110 * s, height: 110 * s, borderRadius: 55 * s }]} />
    </View>

    <Cloud left="20%" top="6%" s={s * 0.8} />
    <Cloud left="6%" top="17%" s={s * 0.7} />
    <Cloud right="14%" top="13%" s={s * 0.9} />

    <View style={[styles.sunGlow, { width: 130 * s, height: 130 * s, borderRadius: 65 * s }]}>
      <View style={{ width: 92 * s, height: 92 * s, borderRadius: 46 * s, backgroundColor: '#FFD84A' }} />
    </View>

    <View style={[styles.shelf, { width: 120 * s, height: 250 * s }]}>
      <View style={styles.shelfTop} />
      <View style={[styles.bear, { width: 46 * s, height: 46 * s, borderRadius: 23 * s }]} />
      <View style={[styles.cup, { width: 28 * s, height: 32 * s }]} />
      <View style={[styles.bookV, { backgroundColor: '#E5457E', left: 62 * s, height: 44 * s }]} />
      <View style={[styles.bookV, { backgroundColor: '#7B54C9', left: 76 * s, height: 50 * s }]} />
      <View style={[styles.shelfMid, { top: 112 * s }]} />
    </View>

    <View style={[styles.stackBook, { backgroundColor: '#5DC25A', bottom: '27%', width: 130 * s, height: 24 * s }]} />
    <View style={[styles.stackBook, { backgroundColor: '#3E8FF0', bottom: '23%', width: 130 * s, height: 24 * s }]} />
    <View style={[styles.stackBook, { backgroundColor: '#F25AA7', bottom: '19%', width: 130 * s, height: 24 * s }]} />
    <View style={[styles.car, { width: 110 * s, height: 32 * s, borderRadius: 10 * s }]}>
      <View style={[styles.carTop, { left: 22 * s, width: 50 * s, height: 20 * s, top: -15 * s }]} />
    </View>
  </View>
);

/* ---------------- lined-paper number list ---------------- */
interface NumberListProps {
  items: NumberItem[];
  pickedIds: string[]; // in click order
  onPick: (id: string) => void;
  locked: boolean;
  solved: boolean;
  wrong: boolean;
  rowH: number;
  fontSize: number;
}

export const NumberList: React.FC<NumberListProps> = ({
  items,
  pickedIds,
  onPick,
  locked,
  solved,
  wrong,
  rowH,
  fontSize,
}) => (
  <View style={styles.list}>
    {items.map((it) => {
      const order = pickedIds.indexOf(it.id);
      const picked = order >= 0;
      const bg = picked
        ? wrong
          ? 'rgba(244,67,54,0.18)'
          : 'rgba(124,201,111,0.35)'
        : 'transparent';
      const color = picked ? (wrong ? '#C62828' : '#2E7D32') : '#10245e';
      return (
        <Pressable
          key={it.id}
          disabled={locked || picked}
          onPress={() => onPick(it.id)}
          style={[
            styles.row,
            { height: rowH, backgroundColor: bg },
            { userSelect: 'none', touchAction: 'manipulation' } as any,
          ]}
        >
          {picked && (
            <View
              style={[
                styles.badge,
                {
                  width: rowH * 0.62,
                  height: rowH * 0.62,
                  borderRadius: rowH * 0.31,
                  backgroundColor: wrong ? '#E57373' : solved ? '#4CAF50' : '#FFB300',
                },
              ]}
            >
              <Text style={[styles.badgeText, { fontSize: rowH * 0.34 }]}>{order + 1}</Text>
            </View>
          )}
          <Text style={[styles.num, { fontSize, color }]}>{it.value}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  /* scene */
  pinkWall: { position: 'absolute', left: 0, right: 0, top: '76%', height: '8%', backgroundColor: '#F7C6D6' },
  floor: { position: 'absolute', left: 0, right: 0, top: '82%', bottom: 0, backgroundColor: '#F2C98A' },
  windowFrame: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '15%',
    height: '56%',
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderColor: '#F0A748',
    overflow: 'hidden',
  },
  windowBarV: { position: 'absolute', left: '30%', top: 0, bottom: 0, width: 8, backgroundColor: '#F0A748' },
  windowBarH: { position: 'absolute', top: '56%', left: 0, right: 0, height: 8, backgroundColor: '#F0A748' },
  hill: { position: 'absolute', bottom: -40, left: 10, backgroundColor: '#5FC66B' },
  puff: { position: 'absolute', backgroundColor: '#fff', borderRadius: 40 },
  sunGlow: {
    position: 'absolute',
    right: '1%',
    top: '9%',
    backgroundColor: 'rgba(255,245,170,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelf: { position: 'absolute', right: 0, bottom: '14%', backgroundColor: '#F4B259', borderTopLeftRadius: 8 },
  shelfTop: { position: 'absolute', top: -8, left: -6, right: 0, height: 10, backgroundColor: '#F7C46E', borderRadius: 4 },
  bear: { position: 'absolute', top: 22, left: 12, backgroundColor: '#8B5E3C' },
  cup: { position: 'absolute', top: 44, left: 62, backgroundColor: '#FFD83B' },
  bookV: { position: 'absolute', top: 34, width: 11 },
  shelfMid: { position: 'absolute', left: 0, right: 0, height: 8, backgroundColor: '#F7C46E' },
  stackBook: { position: 'absolute', left: 0, borderTopRightRadius: 6, borderBottomRightRadius: 6 },
  car: { position: 'absolute', left: 0, bottom: '9%', backgroundColor: '#3E8FF0' },
  carTop: { position: 'absolute', backgroundColor: '#2D7BE0', borderRadius: 8 },

  /* list */
  list: { width: '100%' },
  row: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#C9DDF0',
  },
  num: { fontWeight: '500', textAlign: 'center' },
  badge: { position: 'absolute', left: '12%', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontWeight: '900' },
});