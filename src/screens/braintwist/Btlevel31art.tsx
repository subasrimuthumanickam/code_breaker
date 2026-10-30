import React from 'react';
import { View, StyleSheet } from 'react-native';

/* ---------- the notebook-paper card used by level 31 ---------- */
// spiral rings on top, cream paper, faint ruled lines behind the content

const RING_COUNT = 9;

export const NotebookCard = ({ children }: { children?: React.ReactNode }) => (
  <View style={st.notebook}>
    <View style={st.rings} pointerEvents="none">
      {Array.from({ length: RING_COUNT }).map((_, i) => (
        <View key={i} style={st.ring} />
      ))}
    </View>
    {children}
  </View>
);

const st = StyleSheet.create({
  notebook: {
    width: '92%',
    maxWidth: 400,
    backgroundColor: '#fbf3e0',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#e8d9b5',
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  rings: { position: 'absolute', top: -7, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between' },
  ring: { width: 9, height: 16, borderRadius: 5, backgroundColor: '#d9c7a3', borderWidth: 2, borderColor: '#b9a47c' },
});
