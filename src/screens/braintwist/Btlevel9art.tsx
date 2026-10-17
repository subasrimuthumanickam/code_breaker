import React from 'react';
import Svg, { Rect, Path, Circle, Ellipse, Line, Polygon } from 'react-native-svg';

// open sides of a cell (the server sends one number per cell)
export const OPEN_N = 1;
export const OPEN_E = 2;
export const OPEN_S = 4;
export const OPEN_W = 8;

// cute dog facing right; the box is 60 x 60
export const Dog = ({ w = 40 }: { w?: number }) => (
  <Svg width={w} height={w} viewBox="0 0 60 60">
    {/* tail */}
    <Path d="M16 36 Q5 30 9 19" stroke="#c97a2b" strokeWidth="5" fill="none" strokeLinecap="round" />
    {/* legs */}
    <Rect x="16" y="44" width="7" height="11" rx="3" fill="#e8a24a" stroke="#8a4f14" strokeWidth="1.2" />
    <Rect x="35" y="44" width="7" height="11" rx="3" fill="#e8a24a" stroke="#8a4f14" strokeWidth="1.2" />
    {/* body */}
    <Ellipse cx="29" cy="38" rx="18" ry="11" fill="#e8a24a" stroke="#8a4f14" strokeWidth="1.5" />
    <Ellipse cx="22" cy="36" rx="7" ry="5" fill="#fff3dd" />
    {/* head */}
    <Ellipse cx="46" cy="22" rx="5" ry="9" fill="#b8651a" stroke="#7a4210" strokeWidth="1" />
    <Circle cx="36" cy="24" r="12" fill="#f3b25c" stroke="#8a4f14" strokeWidth="1.5" />
    <Ellipse cx="26" cy="22" rx="5" ry="9" fill="#b8651a" stroke="#7a4210" strokeWidth="1" />
    {/* face */}
    <Ellipse cx="41" cy="29" rx="7" ry="5" fill="#fff3dd" />
    <Circle cx="45" cy="27.5" r="2.4" fill="#222222" />
    <Circle cx="37" cy="21" r="2.2" fill="#222222" />
    <Circle cx="37.7" cy="20.3" r="0.8" fill="#ffffff" />
    <Path d="M40 31 Q44 35 47 31" stroke="#222222" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <Path d="M42 32.5 Q43.5 38 46 32.5 Z" fill="#ff7a8a" />
    {/* collar */}
    <Rect x="30" y="33" width="12" height="3.5" rx="1.5" fill="#e63946" />
    <Circle cx="36" cy="38.5" r="1.8" fill="#ffd23f" />
  </Svg>
);

// a bone with a soft glow; the box is 60 x 30
export const Bone = ({ w = 40 }: { w?: number }) => (
  <Svg width={w} height={w / 2} viewBox="0 0 60 30">
    <Ellipse cx="30" cy="15" rx="29" ry="14" fill="rgba(255,226,80,0.35)" />
    <Rect x="13" y="11" width="34" height="8" rx="3" fill="#ffffff" stroke="#b9a874" strokeWidth="1.5" />
    <Circle cx="12" cy="10" r="5.5" fill="#ffffff" stroke="#b9a874" strokeWidth="1.5" />
    <Circle cx="12" cy="20" r="5.5" fill="#ffffff" stroke="#b9a874" strokeWidth="1.5" />
    <Circle cx="48" cy="10" r="5.5" fill="#ffffff" stroke="#b9a874" strokeWidth="1.5" />
    <Circle cx="48" cy="20" r="5.5" fill="#ffffff" stroke="#b9a874" strokeWidth="1.5" />
    <Rect x="13" y="12" width="34" height="6" fill="#ffffff" />
  </Svg>
);

// little red-roof dog house; the box is 60 x 60
export const DogHouse = ({ w = 40 }: { w?: number }) => (
  <Svg width={w} height={w} viewBox="0 0 60 60">
    <Rect x="9" y="28" width="42" height="27" fill="#d9a35a" stroke="#7a4a2a" strokeWidth="2" />
    <Line x1="9" y1="38" x2="51" y2="38" stroke="#b9854a" strokeWidth="1.2" />
    <Line x1="9" y1="47" x2="51" y2="47" stroke="#b9854a" strokeWidth="1.2" />
    <Polygon points="3,31 30,6 57,31" fill="#e63946" stroke="#8a1c26" strokeWidth="2" />
    <Circle cx="30" cy="24" r="4.5" fill="#ffe27a" stroke="#c9951a" strokeWidth="1" />
    <Path d="M23 55 V43 Q23 34 30 34 Q37 34 37 43 V55 Z" fill="#3a2412" />
  </Svg>
);

type MazeProps = {
  cells: number[];
  cols: number;
  rows: number;
  cs: number;          // size of one cell in pixels
  trail: number[];     // cells the dog has walked
  hint: number[];      // cells shown by the magnifier
  goal: number;
};

// the maze: cream paths, dark brown walls, grass at the start, dog house + bone at the goal
export const Maze = ({ cells, cols, rows, cs, trail, hint, goal }: MazeProps) => {
  const MW = cols * cs;
  const MH = rows * cs;
  const sw = Math.max(3, cs * 0.11);

  const walls: React.ReactNode[] = [];
  const wall = (k: string, x1: number, y1: number, x2: number, y2: number) => (
    <Line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4a2c17" strokeWidth={sw} strokeLinecap="round" />
  );

  for (let i = 0; i < cells.length; i += 1) {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    const x = cx * cs;
    const y = cy * cs;
    const open = cells[i];

    if (!(open & OPEN_N) && i !== 0) walls.push(wall('n' + i, x, y, x + cs, y));   // cell 0 = the entrance
    if (!(open & OPEN_W)) walls.push(wall('w' + i, x, y, x, y + cs));
    if (cx === cols - 1) walls.push(wall('e' + i, x + cs, y, x + cs, y + cs));
    if (cy === rows - 1) walls.push(wall('s' + i, x, y + cs, x + cs, y + cs));
  }

  const gx = (goal % cols) * cs;
  const gy = Math.floor(goal / cols) * cs;

  return (
    <Svg width={MW} height={MH}>
      <Rect x="0" y="0" width={MW} height={MH} fill="#f9f0d6" />

      {/* grass patch where the dog starts */}
      <Ellipse cx={cs / 2} cy={cs * 0.78} rx={cs * 0.42} ry={cs * 0.16} fill="#7ccf4a" />

      {/* where the dog walked */}
      {trail.map((c) => (
        <Rect
          key={'t' + c}
          x={(c % cols) * cs + cs * 0.12}
          y={Math.floor(c / cols) * cs + cs * 0.12}
          width={cs * 0.76}
          height={cs * 0.76}
          rx={cs * 0.2}
          fill="rgba(124,207,74,0.38)"
        />
      ))}

      {/* magnifier: the way to the bone */}
      {hint.map((c) => (
        <Circle
          key={'h' + c}
          cx={(c % cols) * cs + cs / 2}
          cy={Math.floor(c / cols) * cs + cs / 2}
          r={cs * 0.15}
          fill="#ffb300"
        />
      ))}

      {walls}
    </Svg>
  );
};
