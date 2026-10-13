import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';

/* ===== CASE DATA ===== */
export type Suspect = {
  id: string;
  name: string;
  emoji: string;
  statements: string[];
};

export type Clue = {
  id: string;
  label: string;
  emoji: string;
  description: string;
};

export type LiarCase = {
  id: number;
  title: string;
  intro: string;
  suspects: Suspect[];
  clues: Clue[];
  liarId: string;
  explanation: string;
};

export const LIAR_CASES: LiarCase[] = [
  {
    id: 1,
    title: 'The Missing Cake',
    intro:
      'Birthday cake kitchen-la irundhu 7 PM-ku kaanaama pochu. Moonu per kitchen pakkathula irundhaanga. Oruthar poi solraanga.',
    suspects: [
      {
        id: 'ravi',
        name: 'Ravi',
        emoji: '🧑',
        statements: [
          'Naan 6 to 8 theatre-la padam paathen.',
          'Kitchen pakkam naan pogave illa.',
        ],
      },
      {
        id: 'meena',
        name: 'Meena',
        emoji: '👩',
        statements: [
          'Naan kitchen-la 7 mani-ku thaan tea pottaen, cake appo irundhuchu.',
          'Ravi thaan edutthirukkanum, avan romba sweet-ku aasai paduvaan!',
          'Naan help panna ready, ennai nambunga.',
        ],
      },
      {
        id: 'karthik',
        name: 'Karthik',
        emoji: '👦',
        statements: [
          'Naan 7 mani-ku terrace-la phone pesittu irundhen.',
          'Cake-a naan paakkave illa.',
        ],
      },
    ],
    clues: [
      {
        id: 'ticket',
        label: 'Theatre Ticket',
        emoji: '🎟️',
        description: 'Ravi-oda ticket: show 6:00 PM to 9:00 PM. Avan 8 mani varai theatre-la thaan irundhan.',
      },
      {
        id: 'apron',
        label: 'Apron',
        emoji: '🧺',
        description: 'Meena-oda apron-la fresh cream and chocolate stain irukku.',
      },
      {
        id: 'call',
        label: 'Call Log',
        emoji: '📱',
        description: 'Karthik-oda call log: 6:50 to 7:20 PM call pesirukkaan. Call terrace-la nadandhuchu.',
      },
      {
        id: 'tea',
        label: 'Tea Cups',
        emoji: '☕',
        description: 'Kitchen-la tea cup onnu kooda use pannala. Stove cold-a irukku.',
      },
    ],
    liarId: 'meena',
    explanation:
      'Meena thaan poi solraanga. Avanga tea potten nu sonnaanga, aana tea cups use aagala, stove-um cold. Apron-la cream stain irukku. Ravi theatre-la irundhaan (ticket proof), so avanga Ravi mela pazhi poda try pannaanga. Romba helpful-a pesuravanga thaan liar!',
  },
  {
    id: 2,
    title: 'The Broken Window',
    intro:
      'School-la lab window udaindhuchu. Moonu students-ah vichaarana panrom.',
    suspects: [
      {
        id: 'anu',
        name: 'Anu',
        emoji: '👧',
        statements: [
          'Naan library-la 4 mani varai padichitu irundhen.',
          'Window udaiyum pothu naan angey illa.',
        ],
      },
      {
        id: 'vijay',
        name: 'Vijay',
        emoji: '🧒',
        statements: [
          'Naan cricket ground-la irundhen, ball-a thaan adichen.',
          'Ball lab pakkam pogave illa, naan unmaiya solren.',
        ],
      },
      {
        id: 'sara',
        name: 'Sara',
        emoji: '👩‍🎓',
        statements: [
          'Naan class-la homework mudichitu irundhen.',
          'Vijay-oda ball thaan window-ku pochu nu naan paathen.',
        ],
      },
    ],
    clues: [
      {
        id: 'register',
        label: 'Library Register',
        emoji: '📖',
        description: 'Anu-oda signature: in 2:30 PM, out 4:10 PM.',
      },
      {
        id: 'ball',
        label: 'Cricket Ball',
        emoji: '🏏',
        description: 'Ball ground-oda opposite side fence kitta kedaichuchu. Lab 100 meter dhoorathula.',
      },
      {
        id: 'cctv',
        label: 'CCTV Note',
        emoji: '📷',
        description: 'Class-room CCTV: Sara 3:40 to 4:00 PM class-la illa.',
      },
      {
        id: 'glass',
        label: 'Glass Pieces',
        emoji: '🪟',
        description: 'Glass pieces lab ullae vizhundhirukku, so window veliyila irundhu udaikkapattirukku.',
      },
    ],
    liarId: 'sara',
    explanation:
      'Sara thaan poi solraanga. Class-la irundhen nu sonnaanga, aana CCTV-la 3:40 to 4:00 illa. Avanga Vijay-oda ball mela pazhi pottaanga, aana ball romba dhoorathula kedaichuchu.',
  },
];

/* ===== SCREEN ===== */

type Props = { onExit?: () => void };

const MAX_LIVES = 3;

export default function LiarGameScreen({ onExit }: Props) {
  const [current, setCurrent] = useState<LiarCase | null>(null);
  const [solved, setSolved] = useState<number[]>([]);
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [foundClues, setFoundClues] = useState<string[]>([]);
  const [openClue, setOpenClue] = useState<string | null>(null);
  const [accusing, setAccusing] = useState(false);
  const [lives, setLives] = useState(MAX_LIVES);
  const [result, setResult] = useState<'won' | 'lost' | null>(null);

  const startCase = (c: LiarCase) => {
    setCurrent(c);
    setSelectedSuspect(null);
    setFoundClues([]);
    setOpenClue(null);
    setAccusing(false);
    setLives(MAX_LIVES);
    setResult(null);
  };

  const backToList = () => setCurrent(null);

  const tapClue = (id: string) => {
    setOpenClue(openClue === id ? null : id);
    if (!foundClues.includes(id)) setFoundClues([...foundClues, id]);
  };

  const accuse = (suspectId: string) => {
    if (!current) return;
    if (suspectId === current.liarId) {
      setSolved((s) => (s.includes(current.id) ? s : [...s, current.id]));
      setResult('won');
    } else {
      const left = lives - 1;
      setLives(left);
      if (left <= 0) setResult('lost');
    }
  };

  // ---------- Level list ----------
  if (!current) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {onExit && (
            <Pressable onPress={onExit}>
              <Text style={styles.back}>← Back</Text>
            </Pressable>
          )}
          <Text style={styles.title}>🕵️ Who Is Lying?</Text>
        </View>
        <ScrollView contentContainerStyle={styles.pad}>
          {LIAR_CASES.map((c) => (
            <Pressable key={c.id} style={styles.card} onPress={() => startCase(c)}>
              <Text style={styles.cardTitle}>
                Case {c.id}: {c.title} {solved.includes(c.id) ? '✅' : ''}
              </Text>
              <Text style={styles.muted}>{c.suspects.length} suspects · {c.clues.length} clues</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }

  // ---------- Result ----------
  if (result) {
    const next = LIAR_CASES.find((c) => c.id === current.id + 1);
    const liar = current.suspects.find((s) => s.id === current.liarId);
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.big}>{result === 'won' ? '🎉 Correct!' : '😵 Case Failed'}</Text>
        <Text style={styles.text}>Liar: {liar?.emoji} {liar?.name}</Text>
        <Text style={[styles.text, styles.pad]}>{current.explanation}</Text>
        <Pressable style={styles.btn} onPress={() => startCase(current)}>
          <Text style={styles.btnText}>Retry</Text>
        </Pressable>
        {result === 'won' && next && (
          <Pressable style={styles.btn} onPress={() => startCase(next)}>
            <Text style={styles.btnText}>Next Case ▶</Text>
          </Pressable>
        )}
        <Pressable style={styles.btnGhost} onPress={backToList}>
          <Text style={styles.btnGhostText}>Case List</Text>
        </Pressable>
      </View>
    );
  }

  // ---------- Playing a case ----------
  const suspect = current.suspects.find((s) => s.id === selectedSuspect);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={backToList}>
          <Text style={styles.back}>← Cases</Text>
        </Pressable>
        <Text style={styles.lives}>{'❤️'.repeat(lives)}{'🖤'.repeat(MAX_LIVES - lives)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.pad}>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.text}>{current.intro}</Text>

        <Text style={styles.section}>{accusing ? '👉 Yaar liar? Select pannunga' : 'Suspects (tap pannunga)'}</Text>
        <View style={styles.row}>
          {current.suspects.map((s) => (
            <Pressable
              key={s.id}
              style={[styles.suspect, selectedSuspect === s.id && !accusing && styles.suspectActive, accusing && styles.suspectAccuse]}
              onPress={() => (accusing ? accuse(s.id) : setSelectedSuspect(s.id))}
            >
              <Text style={styles.emoji}>{s.emoji}</Text>
              <Text style={styles.suspectName}>{s.name}</Text>
            </Pressable>
          ))}
        </View>

        {suspect && !accusing && (
          <View style={styles.box}>
            <Text style={styles.boxTitle}>{suspect.emoji} {suspect.name} says:</Text>
            {suspect.statements.map((st, i) => (
              <Text key={i} style={styles.statement}>“{st}”</Text>
            ))}
          </View>
        )}

        <Text style={styles.section}>Clues ({foundClues.length}/{current.clues.length})</Text>
        <View style={styles.row}>
          {current.clues.map((c) => (
            <Pressable key={c.id} style={styles.clue} onPress={() => tapClue(c.id)}>
              <Text style={styles.emoji}>{c.emoji}</Text>
              <Text style={styles.clueLabel}>{c.label}</Text>
            </Pressable>
          ))}
        </View>

        {openClue && (
          <View style={styles.box}>
            <Text style={styles.statement}>
              {current.clues.find((c) => c.id === openClue)?.description}
            </Text>
          </View>
        )}

        <Pressable style={styles.btn} onPress={() => setAccusing(!accusing)}>
          <Text style={styles.btnText}>{accusing ? 'Cancel' : '🔍 Accuse!'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#14121f' },
  center: { alignItems: 'center', justifyContent: 'center' },
  pad: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 48 },
  back: { color: '#9aa0ff', fontSize: 16 },
  lives: { fontSize: 18 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginVertical: 8 },
  big: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 12 },
  text: { color: '#d8d8e8', fontSize: 15, lineHeight: 22 },
  muted: { color: '#8a8aa0', marginTop: 4 },
  section: { color: '#ffd166', fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { backgroundColor: '#25223a', padding: 16, borderRadius: 14, marginBottom: 12 },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: '600' },
  suspect: { backgroundColor: '#25223a', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 14, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  suspectActive: { borderColor: '#9aa0ff' },
  suspectAccuse: { borderColor: '#ef476f' },
  suspectName: { color: '#fff', marginTop: 4 },
  emoji: { fontSize: 30 },
  clue: { backgroundColor: '#2f2a4a', padding: 10, borderRadius: 12, alignItems: 'center', minWidth: 90 },
  clueLabel: { color: '#fff', fontSize: 12, marginTop: 4 },
  box: { backgroundColor: '#25223a', padding: 14, borderRadius: 12, marginTop: 12 },
  boxTitle: { color: '#ffd166', fontWeight: '700', marginBottom: 6 },
  statement: { color: '#e8e8f5', fontSize: 15, lineHeight: 22, marginBottom: 4 },
  btn: { backgroundColor: '#ef476f', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14, marginTop: 20, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  btnGhost: { marginTop: 14 },
  btnGhostText: { color: '#9aa0ff', fontSize: 16 },
});
