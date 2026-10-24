
import Svg, { Rect, Path, Circle, Ellipse, Line, Polygon } from 'react-native-svg';

// the room is drawn in a 300 x 240 box; everything (server too) uses these units
export const SCENE_W = 300;
export const SCENE_H = 240;


export const HIDE_SPOTS = [
  { name: 'bookshelf top', x: 250, y: 23 },
  { name: 'bookshelf row', x: 252, y: 64 },
  { name: 'sofa back', x: 107, y: 100 },
  { name: 'window sill', x: 108, y: 75 },
  { name: 'curtain', x: 158, y: 64 },
  { name: 'plant', x: 41, y: 128 },
  { name: 'table', x: 212, y: 170 },
  { name: 'toy box', x: 265, y: 182 },
  { name: 'basket', x: 104, y: 196 },
  { name: 'floor lamp', x: 176, y: 96 },
  { name: 'picture frame', x: 31, y: 31 },
  { name: 'boxes', x: 13, y: 172 },
  { name: 'rug', x: 136, y: 204 },
  { name: 'wall shelf', x: 198, y: 77 },
  { name: 'coat hooks', x: 22, y: 80 },
];

const DARK = '#5a3418';
const BOOKS = ['#e63946', '#2a7de1', '#ffd23f', '#3fae4f', '#9b5de5', '#ff8c42', '#00b4d8'];
const HEIGHTS = [28, 24, 30, 22, 27, 25, 29];
const BUNT = ['#e63946', '#2a7de1', '#ffd23f', '#3fae4f', '#9b5de5'];

// one shelf row of books standing on a board (bottom = y of the board top)
const Books = ({ bottom, shift }: { bottom: number; shift: number }) => (
  <>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => {
      const idx = (i + shift) % 7;
      const h = HEIGHTS[idx];
      return (
        <Rect
          key={i}
          x={220 + i * 9}
          y={bottom - h}
          width={8}
          height={h}
          rx={1}
          fill={BOOKS[idx]}
          stroke={DARK}
          strokeWidth={0.8}
        />
      );
    })}
  </>
);

/* ---------- pieces that are drawn in Room AND again in RoomFront (so they can cover the parrot) ---------- */

const CurtainR = () => (
  <>
    <Rect x="136" y="22" width="18" height="72" rx="4" fill="#ffd23f" stroke="#c9951a" strokeWidth="2" />
    <Line x1="145" y1="30" x2="145" y2="88" stroke="#e8b22a" strokeWidth="1.5" />
  </>
);

// the top part of the sofa back
const SofaTop = () => (
  <Path d="M64 130 V120 Q64 108 76 108 H138 Q150 108 150 120 V130 Z" fill="#d94a4a" stroke="#7a1f1f" strokeWidth="3" />
);

const Row1Books = () => (
  <>
    <Books bottom={76} shift={0} />
    <Rect x="214" y="76" width="72" height="5" fill="#b4743f" stroke={DARK} strokeWidth="1.5" />
  </>
);

const PlantPiece = () => (
  <>
    <Path d="M41 176 Q22 160 28 138 Q42 150 41 176 Z" fill="#3fae4f" stroke="#1f6b2c" strokeWidth="1.5" />
    <Path d="M41 176 Q60 160 56 138 Q40 150 41 176 Z" fill="#3fae4f" stroke="#1f6b2c" strokeWidth="1.5" />
    <Path d="M41 176 Q34 148 41 124 Q50 150 41 176 Z" fill="#58c968" stroke="#1f6b2c" strokeWidth="1.5" />
    <Polygon points="26,178 58,178 54,214 30,214" fill="#d9743a" stroke="#8a3f12" strokeWidth="2" />
    <Rect x="24" y="174" width="36" height="7" rx="3" fill="#e8884c" stroke="#8a3f12" strokeWidth="2" />
  </>
);

const BoxesPiece = () => (
  <>
    <Rect x="2" y="200" width="20" height="22" fill="#d9a35a" stroke="#7a4a2a" strokeWidth="2" />
    <Line x1="12" y1="200" x2="12" y2="222" stroke="#b9854a" strokeWidth="2" />
    <Rect x="5" y="180" width="14" height="20" fill="#e8b86e" stroke="#7a4a2a" strokeWidth="2" />
    <Line x1="12" y1="180" x2="12" y2="200" stroke="#b9854a" strokeWidth="2" />
  </>
);

const BasketPiece = () => (
  <>
    <Path d="M92 194 Q104 184 118 194 Z" fill="#9b5de5" stroke="#5c2fa0" strokeWidth="1.5" />
    <Polygon points="88,198 120,198 116,222 92,222" fill="#c98a4b" stroke="#7a4a2a" strokeWidth="2" />
    <Rect x="86" y="194" width="36" height="6" rx="3" fill="#e0a866" stroke="#7a4a2a" strokeWidth="2" />
    <Line x1="90" y1="208" x2="118" y2="208" stroke="#a56a3a" strokeWidth="1.5" />
  </>
);

const TableTop = () => (
  <>
    <Ellipse cx="210" cy="184" rx="26" ry="8" fill="#c98a4b" stroke="#7a4a2a" strokeWidth="2" />
    <Rect x="198" y="172" width="10" height="11" rx="2" fill="#4aa3e0" stroke="#1f5f93" strokeWidth="1.5" />
  </>
);

const ToyBoxPiece = () => (
  <>
    <Rect x="246" y="194" width="38" height="28" rx="3" fill="#3fae4f" stroke="#1f6b2c" strokeWidth="2" />
    <Rect x="244" y="188" width="42" height="8" rx="3" fill="#58c968" stroke="#1f6b2c" strokeWidth="2" />
    <Line x1="246" y1="206" x2="284" y2="206" stroke="#1f6b2c" strokeWidth="1.5" />
    <Circle cx="265" cy="212" r="3" fill="#ffd23f" />
  </>
);

const LampShade = () => (
  <Polygon points="162,104 190,104 184,121 168,121" fill="#ffe27a" stroke="#c9951a" strokeWidth="2" />
);

// small shelf on the wall with a red vase and a blue pot
const WallShelf = () => (
  <>
    <Rect x="164" y="76" width="9" height="14" rx="3" fill="#e63946" stroke="#8a1c26" strokeWidth="1" />
    <Line x1="168" y1="76" x2="166" y2="68" stroke="#3fae4f" strokeWidth="1.5" />
    <Circle cx="166" cy="67" r="2.5" fill="#ffd23f" />
    <Rect x="176" y="80" width="11" height="10" rx="2" fill="#2a7de1" stroke="#1a4f96" strokeWidth="1" />
    <Circle cx="181" cy="78" r="4.5" fill="#3fae4f" />
    <Rect x="164" y="90" width="48" height="4" rx="1" fill="#a56a3a" stroke={DARK} strokeWidth="1" />
  </>
);

// red hat and blue scarf on the coat hooks
const HatScarf = () => (
  <>
    <Rect x="16" y="85" width="12" height="9" rx="4" fill="#e63946" stroke="#8a1c26" strokeWidth="1" />
    <Ellipse cx="22" cy="94" rx="11" ry="4" fill="#e63946" stroke="#8a1c26" strokeWidth="1" />
    <Rect x="38" y="100" width="6" height="20" rx="2" fill="#2a7de1" stroke="#1a4f96" strokeWidth="1" />
    <Line x1="38" y1="108" x2="44" y2="108" stroke="#ffffff" strokeWidth="1.5" />
    <Line x1="38" y1="114" x2="44" y2="114" stroke="#ffffff" strokeWidth="1.5" />
  </>
);

const FLAGS = Array.from({ length: 12 }, (_, i) => {
  const t = 0.04 + i * 0.083;
  return { x: 300 * t, y: 3 + 38 * t * (1 - t), c: BUNT[i % 5] };
});

// busy cartoon room: lots of things, so the parrot is hard to find
export const Room = ({ w }: { w: number }) => (
  <Svg width={w} height={(w * SCENE_H) / SCENE_W} viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}>
    {/* wall + floor */}
    <Rect x="0" y="0" width="300" height="172" fill="#bfe3ef" />
    <Rect x="0" y="164" width="300" height="8" fill="#9fcfe0" />
    <Rect x="0" y="172" width="300" height="68" fill="#d8a35f" />
    {[190, 208, 226].map((y) => (
      <Line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#c08a47" strokeWidth="1.5" />
    ))}

    {/* picture on the wall */}
    <Rect x="14" y="44" width="34" height="42" rx="3" fill="#fff" stroke="#7a4a2a" strokeWidth="3" />
    <Circle cx="31" cy="60" r="7" fill="#ffd23f" />
    <Path d="M18 82 L28 68 L36 76 L44 66 L44 82 Z" fill="#58b85a" />

    {/* coat hooks */}
    <Rect x="12" y="98" width="40" height="4" rx="1" fill="#7a4a2a" />
    {[20, 34, 46].map((x) => (
      <Circle key={x} cx={x} cy="100" r="2.5" fill="#c9951a" />
    ))}
    <HatScarf />

    {/* window with curtains */}
    <Rect x="76" y="26" width="62" height="62" fill="#8fd0f2" stroke="#7a4a2a" strokeWidth="4" />
    <Circle cx="120" cy="42" r="7" fill="#ffd23f" />
    <Path d="M78 86 Q92 66 108 76 Q122 84 136 70 L136 86 Z" fill="#5cc16a" />
    <Line x1="107" y1="26" x2="107" y2="88" stroke="#7a4a2a" strokeWidth="3" />
    <Line x1="76" y1="57" x2="138" y2="57" stroke="#7a4a2a" strokeWidth="3" />
    <Rect x="72" y="88" width="70" height="5" rx="2" fill="#a56a3a" stroke={DARK} strokeWidth="1" />
    <Rect x="124" y="78" width="7" height="10" rx="3" fill="#3fae4f" stroke="#1f6b2c" strokeWidth="1" />
    <Rect x="120" y="81" width="5" height="3" rx="1.5" fill="#3fae4f" />
    <Rect x="60" y="22" width="18" height="72" rx="4" fill="#ffd23f" stroke="#c9951a" strokeWidth="2" />
    <Line x1="69" y1="30" x2="69" y2="88" stroke="#e8b22a" strokeWidth="1.5" />
    <CurtainR />
    <Rect x="52" y="18" width="110" height="6" rx="3" fill="#7a4a2a" />
    <Circle cx="52" cy="21" r="4" fill="#7a4a2a" />
    <Circle cx="162" cy="21" r="4" fill="#7a4a2a" />

    {/* hanging lamp */}
    <Line x1="176" y1="0" x2="176" y2="36" stroke="#555" strokeWidth="2" />
    <Polygon points="160,62 192,62 184,36 168,36" fill="#ffb347" stroke="#c77a14" strokeWidth="2" />
    <Circle cx="176" cy="66" r="4" fill="#fff3a0" />

    {/* party flags */}
    <Path d="M0 3 Q150 41 300 3" fill="none" stroke="#7a4a2a" strokeWidth="1.2" />
    {FLAGS.map((f, i) => (
      <Polygon
        key={i}
        points={`${f.x - 6},${f.y} ${f.x + 6},${f.y} ${f.x},${f.y + 12}`}
        fill={f.c}
        stroke="#00000033"
        strokeWidth="0.8"
      />
    ))}

    {/* wall clock */}
    <Circle cx="203" cy="22" r="9" fill="#ffffff" stroke="#7a4a2a" strokeWidth="2" />
    <Line x1="203" y1="22" x2="203" y2="16" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="203" y1="22" x2="208" y2="24" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

    {/* wall shelf with a vase and a pot */}
    <WallShelf />

    {/* bookshelf with a trophy and a globe on top */}
    <Rect x="214" y="36" width="72" height="132" fill="#b4743f" stroke={DARK} strokeWidth="3" />
    <Rect x="218" y="40" width="64" height="124" fill="#8a5430" />
    <Row1Books />
    <Books bottom={116} shift={3} />
    <Books bottom={156} shift={5} />
    {[116, 156].map((y) => (
      <Rect key={y} x="214" y={y} width="72" height="5" fill="#b4743f" stroke={DARK} strokeWidth="1.5" />
    ))}
    <Path d="M226 24 H238 V29 Q238 34 232 34 Q226 34 226 29 Z" fill="#ffd23f" stroke="#c9951a" strokeWidth="1" />
    <Rect x="229" y="34" width="6" height="2" fill="#c9951a" />
    <Circle cx="274" cy="29" r="6" fill="#2a7de1" stroke="#1a4f96" strokeWidth="1" />
    <Path d="M270 27 Q273 25 275 28 Q273 31 270 30 Z" fill="#3fae4f" />
    <Rect x="272" y="35" width="4" height="2" fill="#7a4a2a" />

    {/* rug + teddy bear + ball + blocks */}
    <Ellipse cx="150" cy="216" rx="72" ry="16" fill="#58b8b2" stroke="#2f7f7a" strokeWidth="2" />
    <Ellipse cx="150" cy="216" rx="52" ry="10" fill="none" stroke="#9be3de" strokeWidth="2" />
    <Circle cx="161" cy="203" r="3" fill="#b9854a" stroke="#7a4a2a" strokeWidth="1" />
    <Circle cx="175" cy="203" r="3" fill="#b9854a" stroke="#7a4a2a" strokeWidth="1" />
    <Ellipse cx="168" cy="222" rx="9" ry="8" fill="#b9854a" stroke="#7a4a2a" strokeWidth="1.5" />
    <Circle cx="168" cy="209" r="8" fill="#b9854a" stroke="#7a4a2a" strokeWidth="1.5" />
    <Ellipse cx="168" cy="212" rx="4" ry="3" fill="#e0b27a" />
    <Circle cx="165" cy="207" r="1" fill="#222" />
    <Circle cx="171" cy="207" r="1" fill="#222" />
    <Polygon points="168,216 163,214 163,219" fill="#e63946" />
    <Polygon points="168,216 173,214 173,219" fill="#e63946" />
    <Circle cx="186" cy="228" r="7" fill="#e63946" stroke="#8a1c26" strokeWidth="1.5" />
    <Path d="M180 226 Q186 230 192 226" stroke="#ffffff" strokeWidth="1.5" fill="none" />
    <Rect x="234" y="226" width="10" height="10" fill="#ffd23f" stroke="#c9951a" strokeWidth="1.5" />
    <Rect x="246" y="226" width="10" height="10" fill="#2a7de1" stroke="#1a4f96" strokeWidth="1.5" />

    {/* sofa + cushions */}
    <Rect x="64" y="108" width="86" height="36" rx="12" fill="#d94a4a" stroke="#7a1f1f" strokeWidth="3" />
    <Rect x="58" y="130" width="98" height="44" rx="10" fill="#d94a4a" stroke="#7a1f1f" strokeWidth="3" />
    <Rect x="52" y="122" width="18" height="52" rx="8" fill="#e25a5a" stroke="#7a1f1f" strokeWidth="3" />
    <Rect x="144" y="122" width="18" height="52" rx="8" fill="#e25a5a" stroke="#7a1f1f" strokeWidth="3" />
    <Line x1="107" y1="136" x2="107" y2="170" stroke="#a53030" strokeWidth="2" />
    <Rect x="64" y="174" width="8" height="7" fill="#5a2a1a" />
    <Rect x="142" y="174" width="8" height="7" fill="#5a2a1a" />
    <Rect x="74" y="116" width="20" height="20" rx="5" fill="#ffd23f" stroke="#c9951a" strokeWidth="1.5" />
    <Rect x="122" y="116" width="20" height="20" rx="5" fill="#4aa3e0" stroke="#1f5f93" strokeWidth="1.5" />

    {/* floor lamp */}
    <Line x1="176" y1="121" x2="176" y2="178" stroke="#555" strokeWidth="3" />
    <LampShade />
    <Ellipse cx="176" cy="179" rx="10" ry="3" fill="#555" />

    {/* plant */}
    <PlantPiece />

    {/* stacked boxes */}
    <BoxesPiece />

    {/* basket with a blanket */}
    <BasketPiece />

    {/* balloons tied to the toy box */}
    <Line x1="254" y1="166" x2="265" y2="190" stroke="#888" strokeWidth="1" />
    <Line x1="270" y1="160" x2="265" y2="190" stroke="#888" strokeWidth="1" />
    <Line x1="284" y1="168" x2="265" y2="190" stroke="#888" strokeWidth="1" />
    <Ellipse cx="254" cy="156" rx="8" ry="10" fill="#e63946" stroke="#8a1c26" strokeWidth="1" />
    <Ellipse cx="270" cy="150" rx="8" ry="10" fill="#2a7de1" stroke="#1a4f96" strokeWidth="1" />
    <Ellipse cx="284" cy="158" rx="8" ry="10" fill="#ffd23f" stroke="#c9951a" strokeWidth="1" />

    {/* little table with a mug */}
    <Line x1="194" y1="188" x2="192" y2="214" stroke="#7a4a2a" strokeWidth="4" />
    <Line x1="226" y1="188" x2="228" y2="214" stroke="#7a4a2a" strokeWidth="4" />
    <Line x1="210" y1="192" x2="210" y2="216" stroke="#7a4a2a" strokeWidth="4" />
    <TableTop />

    {/* toy box */}
    <ToyBoxPiece />
  </Svg>
);

// drawn OVER the parrot: things that hide part of it (curtain, sofa, plant, basket, books, boxes...)
export const RoomFront = ({ w }: { w: number }) => (
  <Svg width={w} height={(w * SCENE_H) / SCENE_W} viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}>
    <CurtainR />
    <SofaTop />
    <Row1Books />
    <WallShelf />
    <HatScarf />
    <PlantPiece />
    <BoxesPiece />
    <BasketPiece />
    <TableTop />
    <ToyBoxPiece />
    <LampShade />
  </Svg>
);

// scarlet macaw facing left; the box is 36 x 50
export const Parrot = ({ w = 24 }: { w?: number }) => (
  <Svg width={w} height={w * (50 / 36)} viewBox="0 0 36 50">
    {/* tail */}
    <Path d="M15 30 Q11 48 18 50 Q23 46 21 30 Z" fill="#2a7de1" stroke="#1a4f96" strokeWidth="1" />
    <Path d="M18 32 Q17 43 19 48" stroke="#e63946" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* body */}
    <Ellipse cx="19" cy="26" rx="10" ry="14" fill="#e63946" stroke="#8a1c26" strokeWidth="1.5" />
    {/* wing */}
    <Path d="M13 19 Q6 30 14 40 Q23 36 23 24 Z" fill="#2a7de1" stroke="#1a4f96" strokeWidth="1" />
    <Path d="M13 24 Q9 30 14 35 Q19 33 20 27 Z" fill="#ffd23f" />
    {/* head */}
    <Circle cx="19" cy="12" r="9" fill="#e63946" stroke="#8a1c26" strokeWidth="1.5" />
    <Ellipse cx="16" cy="12" rx="5" ry="5.5" fill="#ffffff" />
    <Circle cx="15" cy="11" r="2" fill="#1b1b1b" />
    <Circle cx="14.4" cy="10.4" r="0.7" fill="#ffffff" />
    {/* beak */}
    <Path d="M9 12 Q2 14 6 21 Q11 20 12 15 Z" fill="#f4e4b8" stroke="#7a6a3a" strokeWidth="1" />
    <Path d="M6 21 Q8 22 10 20" stroke="#3a3a3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* feet */}
    <Line x1="16" y1="40" x2="16" y2="45" stroke="#6b4a2a" strokeWidth="2" strokeLinecap="round" />
    <Line x1="22" y1="40" x2="22" y2="45" stroke="#6b4a2a" strokeWidth="2" strokeLinecap="round" />
    <Path d="M13 46 L18 46 M19 46 L24 46" stroke="#6b4a2a" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// black cover with a round hole: (x, y, r) are in scene units.
// No <Mask> (it fails on web): the hole is cut with a single path + even-odd fill.
export const Darkness = ({
  w,
  x,
  y,
  r,
}: {
  w: number;
  x: number;
  y: number;
  r: number;
}) => {
  const d =
    `M0 0 H${SCENE_W} V${SCENE_H} H0 Z ` +
    `M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  return (
    <Svg width={w} height={(w * SCENE_H) / SCENE_W} viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}>
      <Path d={d} fill="#000000" fillRule="evenodd" />
      <Circle cx={x} cy={y} r={r} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={1.5} />
    </Svg>
  );
};
