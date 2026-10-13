// Brain Test puzzle bank + random generators. Answers stay on the server.

const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const jit = () => Math.round(Math.random() * 10 - 5);

const SLOTS = [];
for (const y of [22, 50, 78]) for (const x of [20, 50, 80]) SLOTS.push({ x, y });

// ------------------------------------------------------------------
// FIXED BANK (hand-made tricky puzzles). Add more here any time.
// ------------------------------------------------------------------
const BANK = [
  // ---------- TAP ----------
  {
    key: 'tap_odd_one', type: 'tap',
    question: 'Tap the one that does not belong.',
    objects: [
      { id: 'dog', emoji: '🐶' }, { id: 'cat', emoji: '🐱' },
      { id: 'rabbit', emoji: '🐰' }, { id: 'car', emoji: '🚗' },
    ],
    answer: 'car',
    hint: 'Three of them are living things.',
    successText: 'A car is not an animal!',
  },
  {
    key: 'tap_sleeping', type: 'tap',
    question: 'Find the one who is sleeping.',
    objects: [
      { id: 'a', emoji: '😀' }, { id: 'b', emoji: '😃' },
      { id: 'c', emoji: '😴' }, { id: 'd', emoji: '😄' }, { id: 'e', emoji: '🙂' },
    ],
    answer: 'c',
    hint: 'Look for closed eyes and Zzz.',
    successText: 'Shhh... he is fast asleep.',
  },
  {
    key: 'tap_real_door', type: 'tap',
    question: 'Help the man escape. Tap the real exit!',
    objects: [
      { id: 'window', emoji: '🪟' }, { id: 'wall', emoji: '🧱' },
      { id: 'door', emoji: '🚪' }, { id: 'mirror', emoji: '🪞' },
    ],
    answer: 'door',
    hint: 'You walk through it, not look through it.',
    successText: 'Only the door lets him walk out.',
  },
  {
    key: 'tap_hottest', type: 'tap',
    question: 'Tap the hottest thing.',
    objects: [
      { id: 'ice', emoji: '🧊' }, { id: 'snow', emoji: '☃️' },
      { id: 'fire', emoji: '🔥' }, { id: 'flake', emoji: '❄️' },
    ],
    answer: 'fire',
    hint: 'It can burn you.',
    successText: 'Fire is the hottest.',
  },
  {
    key: 'tap_third_letter', type: 'tap',
    question: 'Tap the 3rd letter of the word "BRAIN".',
    objects: [
      { id: 'B', emoji: 'B' }, { id: 'R', emoji: 'R' }, { id: 'A', emoji: 'A' },
      { id: 'I', emoji: 'I' }, { id: 'N', emoji: 'N' },
    ],
    answer: 'A',
    hint: 'B is 1st, R is 2nd...',
    successText: 'B-R-A... the 3rd letter is A.',
  },
  {
    key: 'tap_biggest_animal', type: 'tap',
    question: 'Tap the heaviest animal.',
    objects: [
      { id: 'mouse', emoji: '🐭' }, { id: 'cat', emoji: '🐱' },
      { id: 'elephant', emoji: '🐘' }, { id: 'dog', emoji: '🐶' },
    ],
    answer: 'elephant',
    hint: 'It has a trunk.',
    successText: 'The elephant is the heaviest.',
  },
  {
    key: 'tap_cold_drink', type: 'tap',
    question: 'It is a hot summer day. Tap what helps you cool down.',
    objects: [
      { id: 'coffee', emoji: '☕' }, { id: 'icecream', emoji: '🍦' },
      { id: 'soup', emoji: '🍲' }, { id: 'fire', emoji: '🔥' },
    ],
    answer: 'icecream',
    hint: 'It is served cold.',
    successText: 'Ice cream for the win!',
  },
  {
    key: 'tap_night', type: 'tap',
    question: 'Tap the thing you can see only at night.',
    objects: [
      { id: 'sun', emoji: '☀️' }, { id: 'cloud', emoji: '☁️' },
      { id: 'moon', emoji: '🌙' }, { id: 'rainbow', emoji: '🌈' },
    ],
    answer: 'moon',
    hint: 'It glows in the dark sky.',
    successText: 'The moon shows up at night.',
  },

  // ---------- DRAG & DROP ----------
  {
    key: 'drag_feed_animals', type: 'drag',
    question: 'Feed each animal its favourite food.',
    items: [
      { id: 'bone', emoji: '🦴' }, { id: 'carrot', emoji: '🥕' }, { id: 'fish', emoji: '🐟' },
    ],
    targets: [
      { id: 'dog', label: 'Dog', emoji: '🐶', accepts: 'bone' },
      { id: 'rabbit', label: 'Rabbit', emoji: '🐰', accepts: 'carrot' },
      { id: 'cat', label: 'Cat', emoji: '🐱', accepts: 'fish' },
    ],
    hint: 'Dog loves bones, cat loves fish.',
    successText: 'Everyone is happy and full!',
  },
  {
    key: 'drag_repair_bridge', type: 'drag',
    question: 'Repair the broken bridge so the man can cross.',
    items: [
      { id: 'log', emoji: '🪵' }, { id: 'rock', emoji: '🪨' }, { id: 'balloon', emoji: '🎈' },
    ],
    targets: [{ id: 'gap', label: 'Broken bridge', emoji: '🌉', accepts: 'log' }],
    hint: 'Wood is strong enough to walk on.',
    successText: 'The wooden log fixed the bridge!',
  },
  {
    key: 'drag_open_chest', type: 'drag',
    question: 'Open the treasure chest.',
    items: [
      { id: 'key', emoji: '🔑' }, { id: 'hammer', emoji: '🔨' }, { id: 'fork', emoji: '🍴' },
    ],
    targets: [{ id: 'chest', label: 'Chest', emoji: '🧰', accepts: 'key' }],
    hint: 'Locks have a matching tool.',
    successText: 'Click! The chest is open.',
  },
  {
    key: 'drag_wear_right', type: 'drag',
    question: 'Dress up! Put each item in the right place.',
    items: [
      { id: 'cap', emoji: '🧢' }, { id: 'shoes', emoji: '👟' }, { id: 'gloves', emoji: '🧤' },
    ],
    targets: [
      { id: 'head', label: 'Head', accepts: 'cap' },
      { id: 'feet', label: 'Feet', accepts: 'shoes' },
      { id: 'hands', label: 'Hands', accepts: 'gloves' },
    ],
    hint: 'Think head to toe.',
    successText: 'Perfectly dressed!',
  },
  {
    key: 'drag_charge_phone', type: 'drag',
    question: 'The phone is dead. Charge it!',
    items: [
      { id: 'plug', emoji: '🔌' }, { id: 'magnet', emoji: '🧲' }, { id: 'bulb', emoji: '💡' },
    ],
    targets: [{ id: 'phone', label: 'Phone', emoji: '📱', accepts: 'plug' }],
    hint: 'Which one gives power through a wire?',
    successText: 'Charging... 100%!',
  },
  {
    key: 'drag_rain_day', type: 'drag',
    question: 'It is raining. Protect the boy!',
    items: [
      { id: 'umbrella', emoji: '☂️' }, { id: 'sunglasses', emoji: '🕶️' }, { id: 'scarf', emoji: '🧣' },
    ],
    targets: [{ id: 'boy', label: 'Boy', emoji: '🧒', accepts: 'umbrella' }],
    hint: 'What keeps rain off your head?',
    successText: 'Nice and dry!',
  },
  {
    key: 'drag_light_room', type: 'drag',
    question: 'The room is dark. Light it up!',
    items: [
      { id: 'bulb', emoji: '💡' }, { id: 'spoon', emoji: '🥄' }, { id: 'sock', emoji: '🧦' },
    ],
    targets: [{ id: 'lamp', label: 'Lamp', emoji: '🛋️', accepts: 'bulb' }],
    hint: 'Only one of them can glow.',
    successText: 'Let there be light!',
  },
  {
    key: 'drag_match_pairs', type: 'drag',
    question: 'Match each tool with its job.',
    items: [
      { id: 'brush', emoji: '🪥' }, { id: 'scissors', emoji: '✂️' }, { id: 'pen', emoji: '🖊️' },
    ],
    targets: [
      { id: 'teeth', label: 'Teeth', emoji: '🦷', accepts: 'brush' },
      { id: 'paper', label: 'Cut paper', emoji: '📄', accepts: 'scissors' },
      { id: 'write', label: 'Write', emoji: '📝', accepts: 'pen' },
    ],
    hint: 'Match by what each tool does.',
    successText: 'All tools in the right job!',
  },

  // ---------- TRICKY LOGIC ----------
  {
    key: 'logic_sheep', type: 'logic',
    question: 'A farmer has 17 sheep. All but 9 run away. How many are left?',
    options: [
      { id: 'a', text: '8' }, { id: 'b', text: '9' }, { id: 'c', text: '17' }, { id: 'd', text: '0' },
    ],
    answer: 'b',
    hint: '"All but 9" means 9 stayed.',
    successText: '"All but 9" means only 9 remain.',
  },
  {
    key: 'logic_months', type: 'logic',
    question: 'How many months have 28 days?',
    options: [{ id: 'a', text: '1' }, { id: 'b', text: '2' }, { id: 'c', text: '12' }],
    answer: 'c',
    hint: 'Every month has AT LEAST 28 days.',
    successText: 'All 12 months have at least 28 days!',
  },
  {
    key: 'logic_wetter', type: 'logic',
    question: 'What gets wetter the more it dries?',
    options: [{ id: 'a', text: 'Rain' }, { id: 'b', text: 'Sponge' }, { id: 'c', text: 'Towel' }],
    answer: 'c',
    hint: 'You use it after a bath.',
    successText: 'A towel gets wetter as it dries you.',
  },
  {
    key: 'logic_heavier', type: 'logic',
    question: 'Which is heavier: 1 kg of iron or 1 kg of cotton?',
    options: [{ id: 'a', text: 'Iron' }, { id: 'b', text: 'Cotton' }, { id: 'c', text: 'Same weight' }],
    answer: 'c',
    hint: 'Read the numbers again.',
    successText: '1 kg is 1 kg, whatever it is made of.',
  },
  {
    key: 'logic_race', type: 'logic',
    question: 'You overtake the person in 2nd place in a race. What place are you in?',
    options: [{ id: 'a', text: '1st' }, { id: 'b', text: '2nd' }, { id: 'c', text: '3rd' }],
    answer: 'b',
    hint: 'You take THEIR position.',
    successText: 'You take the 2nd place spot, not 1st.',
  },
  {
    key: 'logic_pills', type: 'logic',
    question: 'A doctor gives you 3 pills: take one every 30 minutes. How long do they last?',
    options: [{ id: 'a', text: '1 hour' }, { id: 'b', text: '1.5 hours' }, { id: 'c', text: '3 hours' }],
    answer: 'a',
    hint: 'You take the first pill right away.',
    successText: 'Pill 1 at 0, pill 2 at 30, pill 3 at 60 minutes.',
  },
  {
    key: 'logic_fingers', type: 'logic',
    question: 'How many fingers are on two hands, including thumbs?',
    options: [{ id: 'a', text: '8' }, { id: 'b', text: '10' }, { id: 'c', text: '12' }],
    answer: 'b',
    hint: 'Thumbs count here.',
    successText: '5 on each hand, so 10 in total.',
  },
  {
    key: 'logic_birthday', type: 'logic',
    question: 'Which word is always spelled wrong in the dictionary?',
    options: [{ id: 'a', text: 'Wrong' }, { id: 'b', text: 'Mistake' }, { id: 'c', text: 'Spelling' }],
    answer: 'a',
    hint: 'Read the question out loud.',
    successText: 'The word "wrong" is spelled "wrong" correctly!',
  },
  {
    key: 'logic_clock', type: 'logic',
    question: 'What has hands but cannot clap?',
    options: [{ id: 'a', text: 'A robot' }, { id: 'b', text: 'A clock' }, { id: 'c', text: 'A statue' }],
    answer: 'b',
    hint: 'It tells you the time.',
    successText: 'A clock has hands but cannot clap.',
  },
];

// ------------------------------------------------------------------
// RANDOM GENERATORS (new puzzle every single time)
// ------------------------------------------------------------------
const LIVE = new Map();

function remember(p) {
  LIVE.set(p.key, { p, t: Date.now() });
  if (LIVE.size > 500) {
    const cutoff = Date.now() - 30 * 60 * 1000;
    for (const [k, v] of LIVE) if (v.t < cutoff) LIVE.delete(k);
    if (LIVE.size > 500) LIVE.delete(LIVE.keys().next().value);
  }
  return p;
}

function genSequence() {
  const kind = rnd(0, 2);
  let seq, next, hint;
  if (kind === 0) {
    const start = rnd(1, 20), step = rnd(2, 9);
    seq = [0, 1, 2, 3].map((i) => start + step * i);
    next = start + step * 4;
    hint = `Add ${step} each time.`;
  } else if (kind === 1) {
    const start = rnd(1, 4), mul = rnd(2, 3);
    seq = [0, 1, 2, 3].map((i) => start * mul ** i);
    next = start * mul ** 4;
    hint = `Multiply by ${mul} each time.`;
  } else {
    const start = rnd(50, 90), step = rnd(3, 8);
    seq = [0, 1, 2, 3].map((i) => start - step * i);
    next = start - step * 4;
    hint = `Subtract ${step} each time.`;
  }
  const wrong = new Set();
  while (wrong.size < 3) {
    const w = next + rnd(-9, 9);
    if (w !== next && w >= 0) wrong.add(w);
  }
  const nums = shuffle([next, ...wrong]);
  const ids = ['a', 'b', 'c', 'd'];
  return {
    key: `dyn_seq_${uid()}`,
    type: 'logic',
    question: `What comes next?  ${seq.join(', ')}, ?`,
    options: nums.map((n, i) => ({ id: ids[i], text: String(n) })),
    answer: ids[nums.indexOf(next)],
    hint,
    successText: `The next number is ${next}.`,
  };
}

const GROUPS = [
  ['🍎', '🍌', '🍇', '🍓', '🍉', '🍒'],
  ['🐶', '🐱', '🐰', '🐻', '🐼', '🦊'],
  ['🚗', '🚕', '🚌', '🚓', '🚑', '🚒'],
  ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐'],
  ['🌹', '🌻', '🌷', '🌼', '🌺', '🌸'],
];

function genOdd() {
  const [g1, g2] = shuffle(GROUPS).slice(0, 2);
  const same = shuffle(g1).slice(0, 4);
  const odd = shuffle(g2)[0];
  const all = shuffle([...same.map((e) => ({ e, odd: false })), { e: odd, odd: true }]);
  const objects = all.map((o, i) => ({ id: `o${i}`, emoji: o.e }));
  const answer = `o${all.findIndex((o) => o.odd)}`;
  return {
    key: `dyn_odd_${uid()}`,
    type: 'tap',
    question: 'Tap the odd one out.',
    objects,
    answer,
    hint: 'Four of them belong to the same group.',
    successText: 'Sharp eyes!',
  };
}

function makeDynamic() {
  return remember(Math.random() < 0.5 ? genSequence() : genOdd());
}

const getPuzzleByKey = (key) => BANK.find((p) => p.key === key) || (LIVE.get(key) || {}).p;

// Strip answers, shuffle everything that can be shuffled
function toPublicPuzzle(p) {
  const base = { key: p.key, type: p.type, question: p.question };
  if (p.type === 'tap') {
    const slots = shuffle(SLOTS);
    return {
      ...base,
      objects: p.objects.map((o, i) => ({
        id: o.id, emoji: o.emoji, x: slots[i].x + jit(), y: slots[i].y + jit(),
      })),
    };
  }
  if (p.type === 'drag') {
    return { ...base, items: shuffle(p.items), targets: shuffle(p.targets) };
  }
  return { ...base, options: shuffle(p.options) };
}

module.exports = { BANK, getPuzzleByKey, toPublicPuzzle, makeDynamic };