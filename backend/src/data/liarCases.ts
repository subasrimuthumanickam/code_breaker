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