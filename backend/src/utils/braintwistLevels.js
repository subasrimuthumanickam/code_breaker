

// // // // // // // // module.exports = [
// // // // // // // //   // ---------- LEVEL 1 ----------
// // // // // // // //   {
// // // // // // // //     n: 1,
// // // // // // // //     type: 'choice',
// // // // // // // //     q: 'Which one is the biggest?',
// // // // // // // //     cfg: {
// // // // // // // //       items: [
// // // // // // // //         { k: 'lion',     x: 20,  y: 10,  w: 90 },
// // // // // // // //         { k: 'elephant', x: 190, y: 10,  w: 110 },
// // // // // // // //         { k: 'mouse',    x: 30,  y: 150, w: 70 },
// // // // // // // //         { k: 'zebra',    x: 190, y: 150, w: 100 },
// // // // // // // //         { k: 'sloth',    x: 110, y: 200, w: 80 },
// // // // // // // //       ],
// // // // // // // //       hand: { x: 60, y: 60 },
// // // // // // // //       hint: 'Think about the heaviest animal!',
// // // // // // // //     },
// // // // // // // //     a: { v: 1, msg: 'The elephant is the biggest!' },
// // // // // // // //   },

// // // // // // // //   // ---------- LEVEL 2: drag the cloud away, sun shines, flower blooms ----------
// // // // // // // //   {
// // // // // // // //     n: 2,
// // // // // // // //     type: 'drag',
// // // // // // // //     q: 'How to blossom this flower?',
// // // // // // // //     cfg: {
// // // // // // // //       mode: 'away',
// // // // // // // //       target: 1,
// // // // // // // //       items: [
// // // // // // // //         { k: 'cloud',  x: 190, y: 10,  w: 110 }, // 0: draggable cloud covering the sun
// // // // // // // //         { k: 'sun',    x: 200, y: 20,  w: 90 },  // 1: sun hidden behind the cloud
// // // // // // // //         { k: 'flower', x: 70,  y: 140, w: 130 }, // 2: flower
// // // // // // // //       ],
// // // // // // // //       hand: { x: 215, y: 40 },
// // // // // // // //       hint: 'The flower needs sunlight. Move the cloud away!',
// // // // // // // //     },
// // // // // // // //     a: { v: { from: 0, to: 1 }, msg: 'Sunlight makes the flower bloom!' },
// // // // // // // //   },

// // // // // // // //   // ---------- LEVEL 3: elephant into the fridge ----------
// // // // // // // //   {
// // // // // // // //     n: 3,
// // // // // // // //     type: 'drag',
// // // // // // // //     q: 'Put the elephant into the fridge.',
// // // // // // // //     cfg: {
// // // // // // // //       items: [
// // // // // // // //         { k: 'elephant', x: 20,  y: 100, w: 110 },
// // // // // // // //         { k: 'fridge',   x: 190, y: 70,  w: 110 },
// // // // // // // //       ],
// // // // // // // //       hand: { x: 50, y: 130 },
// // // // // // // //       hint: 'Open the fridge first!',
// // // // // // // //     },
// // // // // // // //     a: { v: { from: 0, to: 1 }, msg: 'Great! The elephant is inside!' },
// // // // // // // //   },

// // // // // // // //   // ---------- LEVEL 4 ----------
// // // // // // // //   {
// // // // // // // //     n: 4,
// // // // // // // //     type: 'choice',
// // // // // // // //     q: 'Which one is closest to us?',
// // // // // // // //     cfg: {
// // // // // // // //       items: [
// // // // // // // //         { k: 'moon',      x: 110, y: 10,  w: 100 },
// // // // // // // //         { k: 'cloudpair', x: 80,  y: 125, w: 160 },
// // // // // // // //         { k: 'sun',       x: 130, y: 230, w: 60 },
// // // // // // // //       ],
// // // // // // // //       hint: 'Which one is inside our sky, not in space?',
// // // // // // // //     },
// // // // // // // //     a: { v: 1, msg: 'Clouds are the closest!' },
// // // // // // // //   },

// // // // // // // //   // ---------- LEVEL 5 ----------
// // // // // // // //   {
// // // // // // // //     n: 5,
// // // // // // // //     type: 'choice',
// // // // // // // //     q: 'How many pizza slices do we have?',
// // // // // // // //     cfg: {
// // // // // // // //       input: 'counter',
// // // // // // // //       items: [
// // // // // // // //         { k: 'pizza', x: 75,  y: 5,   w: 70, rot: -25 },
// // // // // // // //         { k: 'pizza', x: 175, y: 5,   w: 70, rot: 25 },
// // // // // // // //         { k: 'pizza', x: 35,  y: 85,  w: 70, rot: -75 },
// // // // // // // //         { k: 'pizza', x: 215, y: 85,  w: 70, rot: 75 },
// // // // // // // //         { k: 'pizza', x: 125, y: 110, w: 70, rot: 0 },
// // // // // // // //       ],
// // // // // // // //       hint: 'Count every slice once!',
// // // // // // // //     },
// // // // // // // //     a: { v: 5, msg: 'Yummy! 5 slices!' },
// // // // // // // //   },

// // // // // // // //   // ---------- LEVEL 6 ----------
// // // // // // // //   {
// // // // // // // //     n: 6,
// // // // // // // //     type: 'choice',
// // // // // // // //     q: 'I overtook the 2nd placed racer, what is my position?',
// // // // // // // //     cfg: {
// // // // // // // //       input: 'keypad',
// // // // // // // //       items: [],
// // // // // // // //       hint: 'You took his place, you did not pass the leader.',
// // // // // // // //     },
// // // // // // // //     a: { v: 2, msg: 'Right, you are 2nd now!' },
// // // // // // // //   },

// // // // // // // //   // ---------- LEVEL 7: feed the cat ----------
// // // // // // // //   {
// // // // // // // //     n: 7,
// // // // // // // //     type: 'drag',
// // // // // // // //     q: 'Feed the cat please, he is hungry!',
// // // // // // // //     cfg: {
// // // // // // // //       target: 3,
// // // // // // // //       items: [
// // // // // // // //         { k: 'cookie',  x: 120, y: 10,  w: 55 },
// // // // // // // //         { k: 'cookie',  x: 150, y: 10,  w: 55 },
// // // // // // // //         { k: 'barrier', x: 20,  y: 100, w: 280 },
// // // // // // // //         { k: 'cat',     x: 115, y: 190, w: 90 },
// // // // // // // //       ],
// // // // // // // //       hand: { x: 125, y: 40 },
// // // // // // // //       hint: 'Drag the cookie right to the cat.',
// // // // // // // //     },
// // // // // // // //     a: { v: { from: 0, to: 3 }, msg: 'Yum! The cat is happy!' },
// // // // // // // //   },
// // // // // // // // ];
// // // // // // // module.exports = [
// // // // // // //   // ---------- LEVEL 1: hand now points at the elephant ----------
// // // // // // //   {
// // // // // // //     n: 1,
// // // // // // //     type: 'choice',
// // // // // // //     q: 'Which one is the biggest?',
// // // // // // //     cfg: {
// // // // // // //       items: [
// // // // // // //         { k: 'lion',     x: 20,  y: 10,  w: 90 },
// // // // // // //         { k: 'elephant', x: 190, y: 10,  w: 110 },
// // // // // // //         { k: 'mouse',    x: 30,  y: 150, w: 70 },
// // // // // // //         { k: 'zebra',    x: 190, y: 150, w: 100 },
// // // // // // //         { k: 'sloth',    x: 110, y: 200, w: 80 },
// // // // // // //       ],
// // // // // // //       hand: { x: 215, y: 45 },
// // // // // // //       hint: 'Think about the heaviest animal!',
// // // // // // //     },
// // // // // // //     a: { v: 1, msg: 'The elephant is the biggest!' },
// // // // // // //   },

// // // // // // //   // ---------- LEVEL 2: many clouds cover the sun above the flower ----------
// // // // // // //   {
// // // // // // //     n: 2,
// // // // // // //     type: 'drag',
// // // // // // //     q: 'How to blossom this flower?',
// // // // // // //     cfg: {
// // // // // // //       mode: 'uncover',
// // // // // // //       drag: [2, 3, 4], // draggable clouds
// // // // // // //       items: [
// // // // // // //         { k: 'sun',    x: 125, y: 30,  w: 70 },   // 0: hidden behind clouds
// // // // // // //         { k: 'flower', x: 100, y: 170, w: 120 },  // 1: centre, below the clouds
// // // // // // //         { k: 'cloud',  x: 75,  y: 12,  w: 110 },  // 2
// // // // // // //         { k: 'cloud',  x: 135, y: 6,   w: 110 },  // 3
// // // // // // //         { k: 'cloud',  x: 105, y: 34,  w: 110 },  // 4
// // // // // // //       ],
// // // // // // //       hand: { x: 170, y: 55 },
// // // // // // //       hint: 'Move all the clouds away to let the sun shine!',
// // // // // // //     },
// // // // // // //     a: { v: { cleared: [2, 3, 4] }, msg: 'Sunlight makes the flower bloom!' },
// // // // // // //   },

// // // // // // //   // ---------- LEVEL 3 (unchanged) ----------
// // // // // // //   {
// // // // // // //     n: 3,
// // // // // // //     type: 'drag',
// // // // // // //     q: 'Put the elephant into the fridge.',
// // // // // // //     cfg: {
// // // // // // //       items: [
// // // // // // //         { k: 'elephant', x: 20,  y: 100, w: 110 },
// // // // // // //         { k: 'fridge',   x: 190, y: 70,  w: 110 },
// // // // // // //       ],
// // // // // // //       hand: { x: 50, y: 130 },
// // // // // // //       hint: 'Open the fridge first!',
// // // // // // //     },
// // // // // // //     a: { v: { from: 0, to: 1 }, msg: 'Great! The elephant is inside!' },
// // // // // // //   },

// // // // // // //   // ---------- LEVEL 4: the MOON is the answer (index 0) ----------
// // // // // // //   {
// // // // // // //     n: 4,
// // // // // // //     type: 'choice',
// // // // // // //     q: 'Which one is closest to us?',
// // // // // // //     cfg: {
// // // // // // //       items: [
// // // // // // //         { k: 'moon',      x: 110, y: 10,  w: 100 },
// // // // // // //         { k: 'cloudpair', x: 80,  y: 125, w: 160 },
// // // // // // //         { k: 'sun',       x: 130, y: 230, w: 60 },
// // // // // // //       ],
// // // // // // //       hint: 'Which one is nearest to the Earth in space?',
// // // // // // //     },
// // // // // // //     a: { v: 0, msg: 'The moon is the closest to us!' },
// // // // // // //   },

// // // // // // //   // ---------- LEVEL 5: pizza slices in a circle (like image 7), answer 9 ----------
// // // // // // //   {
// // // // // // //     n: 5,
// // // // // // //     type: 'choice',
// // // // // // //     q: 'How many pizza slices do we have?',
// // // // // // //     cfg: {
// // // // // // //       input: 'counter',
// // // // // // //       items: [
// // // // // // //         { k: 'pizza', x: 120, y: 29,  w: 80, rot: 0 },
// // // // // // //         { k: 'pizza', x: 164, y: 61,  w: 80, rot: 72 },
// // // // // // //         { k: 'pizza', x: 147, y: 112, w: 80, rot: 144 },
// // // // // // //         { k: 'pizza', x: 93,  y: 112, w: 80, rot: 216 },
// // // // // // //         { k: 'pizza', x: 76,  y: 61,  w: 80, rot: 288 },
// // // // // // //       ],
// // // // // // //       hint: 'Count every slice once!',
// // // // // // //     },
// // // // // // //     a: { v: 9, msg: 'Yummy! 9 slices!' },
// // // // // // //   },

// // // // // // //   // ---------- LEVEL 6 (unchanged) ----------
// // // // // // //   {
// // // // // // //     n: 6,
// // // // // // //     type: 'choice',
// // // // // // //     q: 'I overtook the 2nd placed racer, what is my position?',
// // // // // // //     cfg: {
// // // // // // //       input: 'keypad',
// // // // // // //       items: [],
// // // // // // //       hint: 'You took his place, you did not pass the leader.',
// // // // // // //     },
// // // // // // //     a: { v: 2, msg: 'Right, you are 2nd now!' },
// // // // // // //   },

// // // // // // //   // ---------- LEVEL 7: BOTH cookies must reach the cat, barbed wire in the middle ----------
// // // // // // //   {
// // // // // // //     n: 7,
// // // // // // //     type: 'drag',
// // // // // // //     q: 'Feed the cat please, he is hungry!',
// // // // // // //     cfg: {
// // // // // // //       mode: 'feed',
// // // // // // //       target: 3,        // cat index
// // // // // // //       drag: [0, 1],     // both cookies
// // // // // // //       items: [
// // // // // // //         { k: 'cookie', x: 120, y: 10,  w: 55 },
// // // // // // //         { k: 'cookie', x: 150, y: 10,  w: 55 },
// // // // // // //         { k: 'wire',   x: 10,  y: 110, w: 300 },
// // // // // // //         { k: 'cat',    x: 115, y: 190, w: 90 },
// // // // // // //       ],
// // // // // // //       hand: { x: 125, y: 40 },
// // // // // // //       hint: 'Drag both cookies to the cat.',
// // // // // // //     },
// // // // // // //     a: { v: { fed: [0, 1] }, msg: 'Yum! The cat is happy!' },
// // // // // // //   },
// // // // // // // ];
// // // // // // // Brain Twist: only ONE level for now (whiteboard level).
// // // // // // // Seed deletes every old level that is not listed here.
// // // // // // //
// // // // // // // Stage size in the app is 320 x 300.
// // // // // // // item.k    = art name (num = number text, duster, chalk)
// // // // // // // item.drag = true -> can be dragged
// // // // // // // type 'drag' + mode 'combine' -> player drags one number onto another.
// // // // // // //   The frontend sends { from, to } (item indexes, smaller index first).
// // // // // // //   The backend checks it against a.v.

// // // // // // module.exports = [
// // // // // //   {
// // // // // //     n: 1,
// // // // // //     type: 'drag',
// // // // // //     q: 'What is 5+5?',
// // // // // //     cfg: {
// // // // // //       bg: 'board',        // whiteboard background
// // // // // //       mode: 'combine',
// // // // // //       items: [
// // // // // //         { k: 'num',    t: '1', x: 70,  y: 10,  w: 64, drag: true }, // 0
// // // // // //         { k: 'num',    t: '6', x: 190, y: 10,  w: 64, drag: true }, // 1
// // // // // //         { k: 'num',    t: '3', x: 70,  y: 110, w: 64, drag: true }, // 2
// // // // // //         { k: 'num',    t: '4', x: 190, y: 110, w: 64, drag: true }, // 3
// // // // // //         { k: 'duster', x: 55,  y: 225, w: 90 },                     // 4
// // // // // //         { k: 'chalk',  x: 175, y: 235, w: 110 },                    // 5
// // // // // //       ],
// // // // // //       hint: 'Join two numbers together. Which two make 10?',
// // // // // //     },
// // // // // //     // 6 (index 1) + 4 (index 3) = 10
// // // // // //     a: { v: { from: 1, to: 3 }, msg: 'Correct! 6 + 4 = 10!' },
// // // // // //   },
// // // // // // ];
// // // // // // Brain Twist: only ONE level for now (chalkboard level).
// // // // // // Seed deletes every old level that is not listed here.
// // // // // //
// // // // // // Stage size in the app is 320 wide.
// // // // // // item.k    = art name (num = chalk circle with a number, duster, chalk)
// // // // // // item.drag = true -> can be dragged
// // // // // // type 'drag' + mode 'combine' -> player drags one number onto another.
// // // // // //   The frontend sends { from, to } (item indexes, smaller index first).
// // // // // //   The backend checks it against a.v.
// // // // // // duster / chalk are drawn on the board ledge by the frontend.

// // // // // module.exports = [
// // // // //   {
// // // // //     n: 1,
// // // // //     type: 'drag',
// // // // //     q: 'What is 5+5?',
// // // // //     cfg: {
// // // // //       bg: 'board',        // chalkboard screen
// // // // //       mode: 'combine',
// // // // //       items: [
// // // // //         { k: 'num',    t: '1', x: 38,  y: 20,  w: 88, drag: true }, // 0
// // // // //         { k: 'num',    t: '6', x: 194, y: 20,  w: 88, drag: true }, // 1
// // // // //         { k: 'num',    t: '3', x: 38,  y: 150, w: 88, drag: true }, // 2
// // // // //         { k: 'num',    t: '4', x: 194, y: 150, w: 88, drag: true }, // 3
// // // // //         { k: 'duster', x: 0,   y: 0,   w: 100 },                    // 4 (ledge)
// // // // //         { k: 'chalk',  x: 0,   y: 0,   w: 100 },                    // 5 (ledge)
// // // // //       ],
// // // // //       hint: 'Join two numbers together. Which two make 10?',
// // // // //     },
// // // // //     // 6 (index 1) + 4 (index 3) = 10
// // // // //     a: { v: { from: 1, to: 3 }, msg: 'Correct! 6 + 4 = 10!' },
// // // // //   },
// // // // // ];
// // // // // Brain Twist: only ONE level for now (chalkboard level).
// // // // // Seed deletes every old level that is not listed here.
// // // // //
// // // // // For the chalkboard screen the positions are in DESIGN units (the mockup is 940 x 1672).
// // // // // item.k    = 'num' -> the chalk circle sprite for item.t (1, 3, 4, 6)
// // // // // item.x/y  = top-left of the sprite, item.w = sprite size
// // // // // item.drag = true -> can be dragged
// // // // // type 'drag' + mode 'combine' -> player drags one number onto another.
// // // // //   The frontend sends { from, to } (item indexes, smaller index first).
// // // // //   The backend checks it against a.v.

// // // // module.exports = [
// // // //  {
// // // //   n: 1,
// // // //   type: 'drag',
// // // //   q: 'What is 4+3?',
// // // //   cfg: {
// // // //     bg: 'board',
// // // //     mode: 'combine',
// // // //     items: [
// // // //       { k: 'num', t: 5, x: 30,  y: 0,   w: 80, drag: true }, // 0
// // // //       { k: 'num', t: 6, x: 215, y: 0,   w: 80, drag: true }, // 1
// // // //       { k: 'num', t: 3, x: 30,  y: 140, w: 80, drag: true }, // 2
// // // //       { k: 'num', t: 2, x: 215, y: 140, w: 80, drag: true }, // 3
// // // //       { k: 'duster' },
// // // //       { k: 'chalk' },
// // // //     ],
// // // //     hint: 'Which two numbers add up to 7?',
// // // //   },
// // // //   a: { v: { from: 0, to: 3 }, msg: '5 + 2 = 7!', result: 7 },
// // // // },
// // // // ];
// // // module.exports = [
// // //   // ---------- LEVEL 1: 4+3 = 7 (drag 5 and 2 together) ----------
// // //   {
// // //     n: 1,
// // //     type: 'drag',
// // //     q: 'What is 4+3?',
// // //     cfg: {
// // //       bg: 'board',
// // //       mode: 'combine',
// // //       items: [
// // //         { k: 'num', t: '5', x: 38,  y: 20,  w: 88, drag: true }, // 0
// // //         { k: 'num', t: '6', x: 194, y: 20,  w: 88, drag: true }, // 1
// // //         { k: 'num', t: '3', x: 38,  y: 150, w: 88, drag: true }, // 2
// // //         { k: 'num', t: '2', x: 194, y: 150, w: 88, drag: true }, // 3
// // //         { k: 'duster', x: 0, y: 0, w: 100 },
// // //         { k: 'chalk',  x: 0, y: 0, w: 100 },
// // //       ],
// // //       hint: 'Which two numbers add up to 7?',
// // //     },
// // //     a: { v: { from: 0, to: 3 }, msg: '5 + 2 = 7!', result: 7 },
// // //   },
// // //     // ---------- LEVEL 2: Make a flower (own screen + own routes) ----------
// // //   {
// // //     n: 2,
// // //     type: 'tool',
// // //     q: 'Make a flower',
// // //     cfg: { screen: 'level2', hint: 'Drag the pencil onto the flower.' },
// // //     a: { v: 'pencil', msg: 'Beautiful flower!' },
// // //   },
// // // ];
// // module.exports = [
// //   // ---------- LEVEL 1: 4+3 = 7 (drag 5 and 2 together) ----------
// //   {
// //     n: 1,
// //     type: 'drag',
// //     q: 'What is 4+3?',
// //     cfg: {
// //       bg: 'board',
// //       mode: 'combine',
// //       items: [
// //         { k: 'num', t: '5', x: 38,  y: 20,  w: 88, drag: true }, // 0
// //         { k: 'num', t: '6', x: 194, y: 20,  w: 88, drag: true }, // 1
// //         { k: 'num', t: '3', x: 38,  y: 150, w: 88, drag: true }, // 2
// //         { k: 'num', t: '2', x: 194, y: 150, w: 88, drag: true }, // 3
// //         { k: 'duster', x: 0, y: 0, w: 100 },
// //         { k: 'chalk',  x: 0, y: 0, w: 100 },
// //       ],
// //       hint: 'Which two numbers add up to 7?',
// //     },
// //     a: { v: { from: 0, to: 3 }, msg: '5 + 2 = 7!', result: 7 },
// //   },

// //   // ---------- LEVEL 2: Make a flower / Color a flower ----------
// //   // This row only makes the total level count 2 (so level 1 shows NEXT and
// //   // skip/hint work). The real level 2 game runs on its own screen
// //   // (Btlevel2screen.tsx) and its own routes (Braintwistlevel2routes.js).
// //   {
// //     n: 2,
// //     type: 'tool',
// //     q: 'Make a flower',
// //     cfg: { screen: 'level2', hint: 'Drag the pencil onto the flower.' },
// //     a: { v: 'pencil', msg: 'Beautiful flower!' },
// //   },
// // ];
// module.exports = [
//   // ---------- LEVEL 1: Half of 10, plus 4 = 9 (tap 9) ----------
//   // x values are all different on purpose: the board finds the tapped circle by x.
//   // answer v = INDEX of the correct item (9 is index 2).
//   {
//     n: 1,
//     type: 'choice',
//     q: 'Half of 10, plus 4',
//     cfg: {
//       bg: 'board',
//       items: [
//         { k: 'num', t: '14', x: 36,  y: 20,  w: 88 }, // 0
//         { k: 'num', t: '5',  x: 192, y: 20,  w: 88 }, // 1
//         { k: 'num', t: '9',  x: 38,  y: 150, w: 88 }, // 2  <- correct
//         { k: 'num', t: '4',  x: 194, y: 150, w: 88 }, // 3
//       ],
//       hint: 'Half of 10 is 5. Now add 4.',
//     },
//     a: { v: 2, msg: 'Half of 10 is 5, and 5 + 4 = 9!', result: 9 },
//   },

//   // ---------- LEVEL 2: Make a flower / Color a flower ----------
//   // This row only makes the total level count 2 (so level 1 shows NEXT and
//   // skip/hint work). The real level 2 game runs on its own screen
//   // (Btlevel2screen.tsx) and its own routes (Braintwistlevel2routes.js).
//   {
//     n: 2,
//     type: 'tool',
//     q: 'Make a flower',
//     cfg: { screen: 'level2', hint: 'Drag the pencil onto the flower.' },
//     a: { v: 'pencil', msg: 'Beautiful flower!' },
//   },
// ];
module.exports = [
  // ---------- LEVEL 1: Half of 10, plus 4 = 9 (drag 5 and 4 together) ----------
  // Items keep the same order as the design: 14, 5, 9, 4
  // (the board puts the eraser + pencil in the other two circles automatically).
  // Every number is draggable; only dropping 5 (index 1) on 4 (index 3) is correct.
  // answer v = { from, to } = the two item INDEXES (lower index first).
  {
    n: 1,
    type: 'drag',
    q: 'Half of 10, plus 4',
    cfg: {
      bg: 'board',
      mode: 'combine',
      items: [
        { k: 'num', t: '14', x: 36,  y: 20,  w: 88, drag: true }, // 0
        { k: 'num', t: '5',  x: 192, y: 20,  w: 88, drag: true }, // 1
        { k: 'num', t: '9',  x: 38,  y: 150, w: 88, drag: true }, // 2
        { k: 'num', t: '4',  x: 194, y: 150, w: 88, drag: true }, // 3
      ],
      hint: 'Half of 10 is 5. Drag 5 onto 4.',
    },
    a: { v: { from: 1, to: 3 }, msg: 'Half of 10 is 5, and 5 + 4 = 9!', result: 9 },
  },

  // ---------- LEVEL 2: Make a flower / Color a flower ----------
  // This row only makes the total level count 2 (so level 1 shows NEXT and
  // skip/hint work). The real level 2 game runs on its own screen
  // (Btlevel2screen.tsx) and its own routes (Braintwistlevel2routes.js).
  {
    n: 2,
    type: 'tool',
    q: 'Make a flower',
    cfg: { screen: 'level2', hint: 'Drag the pencil onto the flower.' },
    a: { v: 'pencil', msg: 'Beautiful flower!' },
  },
];