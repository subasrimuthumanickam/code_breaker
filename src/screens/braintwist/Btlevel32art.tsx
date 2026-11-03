// // // src/screens/braintwist/Btlevel32art.tsx
// // // Fish artwork. The server decides which variant is the target (v3 by default);
// // // the art file only knows how to draw each variant, in colour or as a shadow.
// // import React from "react";

// // type Variant = "v1" | "v2" | "v3" | "v4";

// // interface Parts {
// //   tail: "normal" | "short";
// //   topFin: boolean;
// //   bottomFin: boolean;
// // }

// // const PARTS: Record<Variant, Parts> = {
// //   v1: { tail: "short", topFin: true, bottomFin: true },
// //   v2: { tail: "normal", topFin: false, bottomFin: true },
// //   v3: { tail: "normal", topFin: true, bottomFin: true },
// //   v4: { tail: "normal", topFin: true, bottomFin: false },
// // };

// // const TAIL_PATH = {
// //   normal: "M148 80 L196 44 L184 80 L196 116 Z",
// //   short: "M148 80 L174 62 L170 80 L174 98 Z",
// // };

// // interface FishProps {
// //   variant: string;
// //   shadow?: boolean;
// //   size?: number;
// // }

// // export const FishArt: React.FC<FishProps> = ({ variant, shadow = false, size = 200 }) => {
// //   const p = PARTS[(variant as Variant) in PARTS ? (variant as Variant) : "v3"];
// //   const f = (color: string) => (shadow ? "#2b2b2b" : color);

// //   return (
// //     <svg
// //       width={size}
// //       height={size * 0.8}
// //       viewBox="0 0 220 160"
// //       role="img"
// //       aria-label={shadow ? "Shadow option" : "Fish"}
// //     >
// //       <path d={TAIL_PATH[p.tail]} fill={f("#f28c28")} />
// //       {p.topFin && <path d="M80 52 Q102 14 128 54 Z" fill={f("#e86a1c")} />}
// //       {p.bottomFin && <path d="M92 108 Q104 134 122 106 Z" fill={f("#e86a1c")} />}
// //       <ellipse cx="100" cy="80" rx="56" ry="34" fill={f("#ffb02e")} />
// //       {!shadow && (
// //         <>
// //           <path d="M96 48 Q108 80 96 112" stroke="#fff4d6" strokeWidth="6" fill="none" strokeLinecap="round" />
// //           <path d="M120 52 Q130 80 120 108" stroke="#fff4d6" strokeWidth="6" fill="none" strokeLinecap="round" />
// //           <circle cx="62" cy="72" r="7" fill="#fff" />
// //           <circle cx="60" cy="72" r="3.5" fill="#1d2b53" />
// //         </>
// //       )}
// //     </svg>
// //   );
// // };
// import React from 'react';
// import Svg, {Path, Ellipse, Circle} from 'react-native-svg';

// const PARTS: any = {
//   v1: {tail: 'short', top: true,  bottom: true},
//   v2: {tail: 'normal', top: false, bottom: true},
//   v3: {tail: 'normal', top: true,  bottom: true},
//   v4: {tail: 'normal', top: true,  bottom: false},
// };
// const TAIL: any = {
//   normal: 'M148 80 L196 44 L184 80 L196 116 Z',
//   short: 'M148 80 L174 62 L170 80 L174 98 Z',
// };

// export const Fish = ({w = 200, v = 'v3', shadow = false}: any) => {
//   const p = PARTS[v] || PARTS.v3;
//   const c = (col: string) => (shadow ? '#2b2b2b' : col);
//   return (
//     <Svg width={w} height={w * 0.73} viewBox="0 0 220 160">
//       <Path d={TAIL[p.tail]} fill={c('#f28c28')} />
//       {p.top && <Path d="M80 52 Q102 14 128 54 Z" fill={c('#e86a1c')} />}
//       {p.bottom && <Path d="M92 108 Q104 134 122 106 Z" fill={c('#e86a1c')} />}
//       <Ellipse cx="100" cy="80" rx="56" ry="34" fill={c('#ffb02e')} />
//       {!shadow && (
//         <>
//           <Path d="M96 48 Q108 80 96 112" stroke="#fff4d6" strokeWidth="6" fill="none" strokeLinecap="round" />
//           <Path d="M120 52 Q130 80 120 108" stroke="#fff4d6" strokeWidth="6" fill="none" strokeLinecap="round" />
//           <Circle cx="62" cy="72" r="7" fill="#fff" />
//           <Circle cx="60" cy="72" r="3.5" fill="#1d2b53" />
//         </>
//       )}
//     </Svg>
//   );
// };
// src/screens/braintwist/Btlevel32art.tsx
// Blue-tit bird on a blossom branch (colour) + matching shadow variants.
// Server sends variant keys v1..v4 (v3 = the correct one).
import React from 'react';
import Svg, {Path, Ellipse, Circle, G} from 'react-native-svg';

const SH = '#2b2b2b';

type Parts = {tail: 'long' | 'short'; leftLeaves: number; right: 'flower' | 'berry'};
const PARTS: Record<string, Parts> = {
  v1: {tail: 'short', leftLeaves: 2, right: 'flower'}, // short tail
  v2: {tail: 'long', leftLeaves: 2, right: 'berry'},   // berries instead of flowers
  v3: {tail: 'long', leftLeaves: 2, right: 'flower'},  // CORRECT
  v4: {tail: 'long', leftLeaves: 1, right: 'flower'},  // one leaf missing
};

const Leaf = ({cx, cy, rot, fill, rx = 22, ry = 10}: any) => (
  <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} rotation={rot} origin={`${cx}, ${cy}`} fill={fill} />
);

const Flower = ({cx, cy, shadow, r = 6}: any) => {
  const pts = [0, 72, 144, 216, 288].map(a => ({
    x: cx + Math.cos((a * Math.PI) / 180) * r * 1.15,
    y: cy + Math.sin((a * Math.PI) / 180) * r * 1.15,
  }));
  return (
    <G>
      {pts.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={r * 0.85} fill={shadow ? SH : '#ffffff'} stroke={shadow ? undefined : '#e6d8c2'} strokeWidth={0.8} />
      ))}
      <Circle cx={cx} cy={cy} r={r * 0.6} fill={shadow ? SH : '#f5b21e'} />
    </G>
  );
};

const Berry = ({cx, cy, shadow}: any) => (
  <G>
    <Path d={`M${cx} ${cy + 6} L${cx - 4} ${cy + 22}`} stroke={shadow ? SH : '#8a5a3a'} strokeWidth={2.5} />
    <Circle cx={cx} cy={cy} r={6.5} fill={shadow ? SH : '#e8483f'} />
  </G>
);

export const Bird = ({w = 280, v = 'v3', shadow = false}: any) => {
  const p = PARTS[v] || PARTS.v3;
  const c = (col: string) => (shadow ? SH : col);
  return (
    <Svg width={w} height={w * 0.867} viewBox="0 0 300 260">
      {/* tail */}
      <Path d={p.tail === 'long' ? 'M128 170 L72 238 L96 244 L146 190 Z' : 'M128 170 L100 212 L120 216 L146 190 Z'} fill={c('#2456b8')} />

      {/* branch */}
      <Path d="M52 198 Q150 188 264 190" stroke={c('#7a4a2a')} strokeWidth={7} fill="none" strokeLinecap="round" />

      {/* left leaves */}
      <Leaf cx={72} cy={180} rot={-30} fill={c('#5fae3a')} />
      {p.leftLeaves >= 2 && <Leaf cx={56} cy={206} rot={25} fill={c('#4f9f34')} />}

      {/* right leaves */}
      <Leaf cx={226} cy={170} rot={-35} fill={c('#5fae3a')} />
      <Leaf cx={266} cy={172} rot={15} fill={c('#4f9f34')} />
      <Leaf cx={242} cy={226} rot={45} fill={c('#5fae3a')} />

      {/* flowers or berries */}
      {p.right === 'flower' ? (
        <>
          <Flower cx={222} cy={199} shadow={shadow} />
          <Flower cx={248} cy={208} shadow={shadow} />
          <Flower cx={268} cy={192} shadow={shadow} r={5.5} />
        </>
      ) : (
        <>
          <Berry cx={222} cy={199} shadow={shadow} />
          <Berry cx={250} cy={206} shadow={shadow} />
          <Berry cx={270} cy={191} shadow={shadow} />
        </>
      )}

      {/* bird */}
      <Ellipse cx={150} cy={140} rx={40} ry={52} rotation={-22} origin="150, 140" fill={c('#ffc531')} />
      {!shadow && <Ellipse cx={138} cy={124} rx={22} ry={30} rotation={-22} origin="138, 124" fill="#a3cc4a" />}
      <Path d="M120 118 Q168 118 148 178 Q112 160 120 118 Z" fill={c('#2456b8')} />
      {!shadow && <Path d="M128 132 Q150 134 144 152" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" />}
      <Path d="M158 70 L162 50 L172 64 L182 48 L188 66 Z" fill={c('#1f55c2')} />
      <Circle cx={178} cy={88} r={28} fill={c('#1f55c2')} />
      {!shadow && (
        <>
          <Ellipse cx={188} cy={97} rx={17} ry={12} fill="#ffffff" />
          <Path d="M168 88 L206 92" stroke="#1d2340" strokeWidth={4} strokeLinecap="round" />
          <Circle cx={187} cy={90} r={3.8} fill="#111" />
          <Ellipse cx={181} cy={113} rx={14} ry={8} fill="#1f3a8a" />
        </>
      )}
      <Path d="M204 94 L225 100 L204 106 Z" fill={c('#444')} />
      {/* feet */}
      <Path d="M146 188 L146 196 M158 188 L160 196" stroke={c('#7a5a3a')} strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
};
