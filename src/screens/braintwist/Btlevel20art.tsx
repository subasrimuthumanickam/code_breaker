// // src/screens/braintwist/Btlevel20art.tsx
// // Cozy study room matching the Level 20 reference: window (left), wall clock (right),
// // bookshelf + teddy (right), desk + chair (left), wooden floor with a pink rug, plants.
// // Pure Views, no extra packages. All positions are percentages so it scales per device.

// import React from 'react';
// import { StyleSheet, View } from 'react-native';

// export const C = {
//   wall: '#F4E3C8',
//   wallShade: '#EBD3AE',
//   wood: '#C98A4B',
//   woodDark: '#A8622A',
//   woodLight: '#E3A862',
//   floor: '#E9A95F',
//   floorLine: '#D18F45',
//   base: '#D9A46A',
//   rug: '#F2A99B',
//   rugEdge: '#F8C9BD',
//   leaf: '#5FAE3F',
//   leafDark: '#3F8A2C',
//   cream: '#F8EBD2',
//   navy: '#0F2E7A',
//   ink: '#2A2118',
//   gold: '#F7D358',
//   sky: '#8EC8F0',
// };

// const Leaf = ({ x, y, w = 30, h = 15, rot = 0, c = C.leaf }: any) => (
//   <View style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: h, backgroundColor: c, transform: [{ rotate: `${rot}deg` }] }} />
// );

// export const Vine = ({ style }: { style?: any }) => (
//   <View style={[{ position: 'absolute', width: 40, height: 60 }, style]} pointerEvents="none">
//     <Leaf x={4} y={0} rot={-30} />
//     <Leaf x={12} y={14} rot={25} c={C.leafDark} />
//     <Leaf x={0} y={28} rot={-20} />
//     <Leaf x={14} y={42} rot={30} c={C.leafDark} />
//   </View>
// );

// function Plant({ style, size = 1 }: { style?: any; size?: number }) {
//   return (
//     <View style={[{ position: 'absolute', width: 90 * size, height: 120 * size, alignItems: 'center', justifyContent: 'flex-end' }, style]}>
//       <View style={{ position: 'absolute', bottom: 40 * size, width: 90 * size, height: 80 * size }}>
//         <Leaf x={4 * size} y={30 * size} w={38 * size} h={20 * size} rot={-40} />
//         <Leaf x={44 * size} y={26 * size} w={38 * size} h={20 * size} rot={40} c={C.leafDark} />
//         <Leaf x={20 * size} y={6 * size} w={34 * size} h={20 * size} rot={-70} />
//         <Leaf x={36 * size} y={4 * size} w={34 * size} h={20 * size} rot={70} c={C.leafDark} />
//         <Leaf x={26 * size} y={34 * size} w={36 * size} h={20 * size} rot={0} />
//       </View>
//       <View style={{ width: 52 * size, height: 44 * size, backgroundColor: '#F3E6D2', borderBottomLeftRadius: 14 * size, borderBottomRightRadius: 14 * size, borderTopWidth: 5 * size, borderTopColor: '#E2D0B4' }} />
//     </View>
//   );
// }

// export function WallClock({ size }: { size: number }) {
//   const face = size - 22;
//   const hand = (len: number, deg: number, w: number) => (
//     <View style={{ position: 'absolute', width: face, height: face, alignItems: 'center', transform: [{ rotate: `${deg}deg` }] }}>
//       <View style={{ width: w, height: len, marginTop: face / 2 - len, backgroundColor: C.ink, borderRadius: w }} />
//     </View>
//   );
//   return (
//     <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: C.woodDark, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: C.wood }}>
//       <View style={{ width: face, height: face, borderRadius: face / 2, backgroundColor: '#FBF4E4', alignItems: 'center', justifyContent: 'center' }}>
//         {Array.from({ length: 12 }).map((_, i) => (
//           <View key={i} style={{ position: 'absolute', width: face, height: face, alignItems: 'center', transform: [{ rotate: `${i * 30}deg` }] }}>
//             <View style={{ width: 2, height: 7, marginTop: 4, backgroundColor: C.ink }} />
//           </View>
//         ))}
//         {hand(face * 0.3, -60, 4)}
//         {hand(face * 0.42, 60, 3)}
//         <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: C.woodDark }} />
//       </View>
//     </View>
//   );
// }

// const Book = ({ c, w, h }: { c: string; w: number; h: number }) => (
//   <View style={{ width: w, height: h, backgroundColor: c, borderRadius: 2, marginRight: 2 }} />
// );

// export function Level20Room({ children }: { children: React.ReactNode }) {
//   return (
//     <View style={s.root}>
//       {/* wall shading */}
//       <View style={s.wallShade} />

//       {/* window, left */}
//       <View style={s.window}>
//         <View style={s.sky}>
//           <View style={[s.cloud, { top: 30, left: 6, width: 38, height: 16 }]} />
//           <View style={[s.cloud, { top: 64, left: 22, width: 26, height: 12 }]} />
//           <View style={[s.tree, { bottom: -20, left: -10, width: 90, height: 90 }]} />
//           <View style={[s.tree, { bottom: -34, left: 40, width: 70, height: 70, backgroundColor: C.leafDark }]} />
//         </View>
//         <View style={s.sill} />
//       </View>

//       {/* wall clock, right (cropped by the screen edge) */}
//       <View style={s.clockPos}>
//         <WallClock size={150} />
//       </View>

//       {/* bookshelf, right */}
//       <View style={s.shelf}>
//         <View style={s.shelfRow}>
//           <Book c="#3E6FB0" w={14} h={52} /><Book c="#4E9A5B" w={12} h={46} /><Book c="#E0A63A" w={12} h={54} />
//         </View>
//         <View style={s.shelfBoard} />
//         <View style={s.shelfRow}>
//           <View style={s.teddy}><View style={s.teddyEar} /><View style={[s.teddyEar, { left: 32 }]} /></View>
//         </View>
//         <View style={s.shelfBoard} />
//         <View style={s.shelfRow}>
//           <Book c="#E08A3A" w={14} h={44} /><Book c="#4E9A5B" w={12} h={40} /><Book c="#7B5BB0" w={12} h={46} />
//         </View>
//       </View>
//       <Plant style={s.shelfPlant} size={0.8} />

//       {/* floor */}
//       <View style={s.floor}>
//         {[18, 46, 78].map(t => <View key={t} style={[s.floorLine, { top: `${t}%` }]} />)}
//         <View style={s.rug}><View style={s.rugInner} /></View>
//       </View>
//       <View style={s.baseboard} />

//       {/* desk + chair, left */}
//       <View style={s.desk}>
//         <View style={s.deskBooks}>
//           <View style={{ width: 70, height: 12, backgroundColor: '#4E9A5B', borderRadius: 2 }} />
//           <View style={{ width: 66, height: 12, backgroundColor: '#E0553A', borderRadius: 2, marginLeft: 4 }} />
//           <View style={{ width: 62, height: 12, backgroundColor: '#3E6FB0', borderRadius: 2 }} />
//         </View>
//         <View style={s.deskTop} />
//         <View style={s.deskLeg} />
//       </View>
//       <View style={s.chair} />

//       {/* foreground plant, bottom-left */}
//       <Plant style={s.fgPlant} size={1.3} />

//       {children}
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   root: { flex: 1, backgroundColor: C.wall, overflow: 'hidden' },
//   wallShade: { position: 'absolute', left: '18%', top: 0, width: '30%', bottom: '40%', backgroundColor: C.wallShade, opacity: 0.35 },

//   window: { position: 'absolute', left: -6, top: '8%', width: '26%', height: '36%', backgroundColor: C.wood, borderWidth: 6, borderColor: C.woodDark, borderLeftWidth: 0 },
//   sky: { flex: 1, backgroundColor: C.sky, overflow: 'hidden' },
//   cloud: { position: 'absolute', backgroundColor: '#FFFFFF', borderRadius: 20, opacity: 0.95 },
//   tree: { position: 'absolute', borderRadius: 60, backgroundColor: C.leaf },
//   sill: { position: 'absolute', left: -4, right: -22, bottom: -14, height: 12, backgroundColor: C.woodLight, borderRadius: 4 },

//   clockPos: { position: 'absolute', right: -36, top: '14%' },

//   shelf: { position: 'absolute', right: 0, top: '38%', width: '18%', height: '28%', backgroundColor: C.wood, borderLeftWidth: 5, borderLeftColor: C.woodDark, justifyContent: 'space-around', paddingLeft: 4 },
//   shelfRow: { flexDirection: 'row', alignItems: 'flex-end', height: 56 },
//   shelfBoard: { height: 6, backgroundColor: C.woodDark },
//   teddy: { width: 40, height: 42, borderRadius: 18, backgroundColor: '#B07A4A' },
//   teddyEar: { position: 'absolute', top: -6, left: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#B07A4A' },
//   shelfPlant: { right: 6, top: '29%' },

//   floor: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '36%', backgroundColor: C.floor, overflow: 'hidden' },
//   floorLine: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: C.floorLine, opacity: 0.5 },
//   rug: { position: 'absolute', left: '14%', right: '-6%', bottom: '2%', height: '66%', backgroundColor: C.rugEdge, borderRadius: 400 },
//   rugInner: { flex: 1, margin: 10, backgroundColor: C.rug, borderRadius: 400 },
//   baseboard: { position: 'absolute', left: 0, right: 0, bottom: '36%', height: 12, backgroundColor: C.base },

//   desk: { position: 'absolute', left: -8, bottom: '30%', width: 118 },
//   deskBooks: { marginLeft: 0, marginBottom: 0 },
//   deskTop: { height: 14, backgroundColor: C.wood, borderRadius: 3 },
//   deskLeg: { width: 14, height: 62, backgroundColor: C.woodDark, marginLeft: 70 },
//   chair: { position: 'absolute', left: 70, bottom: '24%', width: 24, height: 90, backgroundColor: C.woodDark, borderRadius: 6 },
//   fgPlant: { left: -22, bottom: '2%' },
// });
// src/screens/braintwist/Btlevel20art.tsx
// Cozy study room matching the Level 20 reference: window (left), wall clock (right),
// bookshelf + teddy (right), desk + chair (left), wooden floor with a pink rug, plants.
// Pure Views, no extra packages. All positions are percentages so it scales per device.

import React from 'react';
import { StyleSheet, View } from 'react-native';

export const C = {
  wall: '#F4E3C8',
  wallShade: '#EBD3AE',
  wood: '#C98A4B',
  woodDark: '#A8622A',
  woodLight: '#E3A862',
  floor: '#E9A95F',
  floorLine: '#D18F45',
  base: '#D9A46A',
  rug: '#F2A99B',
  rugEdge: '#F8C9BD',
  leaf: '#5FAE3F',
  leafDark: '#3F8A2C',
  cream: '#F8EBD2',
  navy: '#0F2E7A',
  ink: '#2A2118',
  gold: '#F7D358',
  sky: '#8EC8F0',
};

const Leaf = ({ x, y, w = 30, h = 15, rot = 0, c = C.leaf }: any) => (
  <View style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: h, backgroundColor: c, transform: [{ rotate: `${rot}deg` }] }} />
);

export const Vine = ({ style }: { style?: any }) => (
  <View style={[{ position: 'absolute', width: 40, height: 60 }, style]} pointerEvents="none">
    <Leaf x={4} y={0} rot={-30} />
    <Leaf x={12} y={14} rot={25} c={C.leafDark} />
    <Leaf x={0} y={28} rot={-20} />
    <Leaf x={14} y={42} rot={30} c={C.leafDark} />
  </View>
);

function Plant({ style, size = 1 }: { style?: any; size?: number }) {
  return (
    <View style={[{ position: 'absolute', width: 90 * size, height: 120 * size, alignItems: 'center', justifyContent: 'flex-end' }, style]}>
      <View style={{ position: 'absolute', bottom: 40 * size, width: 90 * size, height: 80 * size }}>
        <Leaf x={4 * size} y={30 * size} w={38 * size} h={20 * size} rot={-40} />
        <Leaf x={44 * size} y={26 * size} w={38 * size} h={20 * size} rot={40} c={C.leafDark} />
        <Leaf x={20 * size} y={6 * size} w={34 * size} h={20 * size} rot={-70} />
        <Leaf x={36 * size} y={4 * size} w={34 * size} h={20 * size} rot={70} c={C.leafDark} />
        <Leaf x={26 * size} y={34 * size} w={36 * size} h={20 * size} rot={0} />
      </View>
      <View style={{ width: 52 * size, height: 44 * size, backgroundColor: '#F3E6D2', borderBottomLeftRadius: 14 * size, borderBottomRightRadius: 14 * size, borderTopWidth: 5 * size, borderTopColor: '#E2D0B4' }} />
    </View>
  );
}

export function WallClock({ size }: { size: number }) {
  const face = size - 22;
  const hand = (len: number, deg: number, w: number) => (
    <View style={{ position: 'absolute', width: face, height: face, alignItems: 'center', transform: [{ rotate: `${deg}deg` }] }}>
      <View style={{ width: w, height: len, marginTop: face / 2 - len, backgroundColor: C.ink, borderRadius: w }} />
    </View>
  );
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: C.woodDark, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: C.wood }}>
      <View style={{ width: face, height: face, borderRadius: face / 2, backgroundColor: '#FBF4E4', alignItems: 'center', justifyContent: 'center' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={i} style={{ position: 'absolute', width: face, height: face, alignItems: 'center', transform: [{ rotate: `${i * 30}deg` }] }}>
            <View style={{ width: 2, height: 7, marginTop: 4, backgroundColor: C.ink }} />
          </View>
        ))}
        {hand(face * 0.3, -60, 4)}
        {hand(face * 0.42, 60, 3)}
        <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: C.woodDark }} />
      </View>
    </View>
  );
}

const Book = ({ c, w, h }: { c: string; w: number; h: number }) => (
  <View style={{ width: w, height: h, backgroundColor: c, borderRadius: 2, marginRight: 2 }} />
);

export function Level20Room({ children }: { children: React.ReactNode }) {
  return (
    <View style={s.root}>
      {/* wall shading */}
      <View style={s.wallShade} />

      {/* window, left */}
      <View style={s.window}>
        <View style={s.sky}>
          <View style={[s.cloud, { top: 30, left: 6, width: 38, height: 16 }]} />
          <View style={[s.cloud, { top: 64, left: 22, width: 26, height: 12 }]} />
          <View style={[s.tree, { bottom: -20, left: -10, width: 90, height: 90 }]} />
          <View style={[s.tree, { bottom: -34, left: 40, width: 70, height: 70, backgroundColor: C.leafDark }]} />
        </View>
        <View style={s.sill} />
      </View>

      {/* wall clock, right (cropped by the screen edge) */}
      <View style={s.clockPos}>
        <WallClock size={150} />
      </View>

      {/* bookshelf, right */}
      <View style={s.shelf}>
        <View style={s.shelfRow}>
          <Book c="#3E6FB0" w={14} h={52} /><Book c="#4E9A5B" w={12} h={46} /><Book c="#E0A63A" w={12} h={54} />
        </View>
        <View style={s.shelfBoard} />
        <View style={s.shelfRow}>
          <View style={s.teddy}><View style={s.teddyEar} /><View style={[s.teddyEar, { left: 32 }]} /></View>
        </View>
        <View style={s.shelfBoard} />
        <View style={s.shelfRow}>
          <Book c="#E08A3A" w={14} h={44} /><Book c="#4E9A5B" w={12} h={40} /><Book c="#7B5BB0" w={12} h={46} />
        </View>
      </View>
      <Plant style={s.shelfPlant} size={0.8} />

      {/* floor */}
      <View style={s.floor}>
        {[18, 46, 78].map(t => <View key={t} style={[s.floorLine, { top: `${t}%` }]} />)}
        <View style={s.rug}><View style={s.rugInner} /></View>
      </View>
      <View style={s.baseboard} />

      {/* desk + chair, left */}
      <View style={s.desk}>
        <View style={s.deskBooks}>
          <View style={{ width: 70, height: 12, backgroundColor: '#4E9A5B', borderRadius: 2 }} />
          <View style={{ width: 66, height: 12, backgroundColor: '#E0553A', borderRadius: 2, marginLeft: 4 }} />
          <View style={{ width: 62, height: 12, backgroundColor: '#3E6FB0', borderRadius: 2 }} />
        </View>
        <View style={s.deskTop} />
        <View style={s.deskLeg} />
      </View>
      <View style={s.chair} />

      {/* foreground plant, bottom-left */}
      <Plant style={s.fgPlant} size={1.3} />

      {children}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.wall, overflow: 'hidden' },
  wallShade: { position: 'absolute', left: '18%', top: 0, width: '30%', bottom: '40%', backgroundColor: C.wallShade, opacity: 0.35 },

  window: { position: 'absolute', left: -6, top: '8%', width: '26%', height: '36%', backgroundColor: C.wood, borderWidth: 6, borderColor: C.woodDark, borderLeftWidth: 0 },
  sky: { flex: 1, backgroundColor: C.sky, overflow: 'hidden' },
  cloud: { position: 'absolute', backgroundColor: '#FFFFFF', borderRadius: 20, opacity: 0.95 },
  tree: { position: 'absolute', borderRadius: 60, backgroundColor: C.leaf },
  sill: { position: 'absolute', left: -4, right: -22, bottom: -14, height: 12, backgroundColor: C.woodLight, borderRadius: 4 },

  clockPos: { position: 'absolute', right: -36, top: '14%' },

  shelf: { position: 'absolute', right: 0, top: '38%', width: '18%', height: '28%', backgroundColor: C.wood, borderLeftWidth: 5, borderLeftColor: C.woodDark, justifyContent: 'space-around', paddingLeft: 4 },
  shelfRow: { flexDirection: 'row', alignItems: 'flex-end', height: 56 },
  shelfBoard: { height: 6, backgroundColor: C.woodDark },
  teddy: { width: 40, height: 42, borderRadius: 18, backgroundColor: '#B07A4A' },
  teddyEar: { position: 'absolute', top: -6, left: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#B07A4A' },
  shelfPlant: { right: 6, top: '29%' },

  floor: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '36%', backgroundColor: C.floor, overflow: 'hidden' },
  floorLine: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: C.floorLine, opacity: 0.5 },
  rug: { position: 'absolute', left: '14%', right: '-6%', bottom: '2%', height: '66%', backgroundColor: C.rugEdge, borderRadius: 400 },
  rugInner: { flex: 1, margin: 10, backgroundColor: C.rug, borderRadius: 400 },
  baseboard: { position: 'absolute', left: 0, right: 0, bottom: '36%', height: 12, backgroundColor: C.base },

  desk: { position: 'absolute', left: -8, bottom: '30%', width: 118 },
  deskBooks: { marginLeft: 0, marginBottom: 0 },
  deskTop: { height: 14, backgroundColor: C.wood, borderRadius: 3 },
  deskLeg: { width: 14, height: 62, backgroundColor: C.woodDark, marginLeft: 70 },
  chair: { position: 'absolute', left: 70, bottom: '24%', width: 24, height: 90, backgroundColor: C.woodDark, borderRadius: 6 },
  fgPlant: { left: -22, bottom: '2%' },
});
