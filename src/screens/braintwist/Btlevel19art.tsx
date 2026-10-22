import React from 'react';
import Svg, { Rect, Path, Circle, Ellipse, Line, Text as SvgText } from 'react-native-svg';

const INKLINE = '#1f1f1f';
const PINK = '#ff5a7a';


export const Grid = ({ lines, size, mark }: { lines: number; size: number; mark?: string }) => {
  const gap = 24;
  const pos = Array.from({ length: lines }, (_, i) => 50 + (i - (lines - 1) / 2) * gap);

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {pos.map((p, i) => (
        <Path
          key={'v' + i}
          d={`M${p} 12 Q${p + (i % 2 ? -1.4 : 1.4)} 50 ${p} 88`}
          stroke={INKLINE}
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      {pos.map((p, i) => (
        <Path
          key={'h' + i}
          d={`M12 ${p} Q50 ${p + (i % 2 ? 1.4 : -1.4)} 88 ${p}`}
          stroke={INKLINE}
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      {!!mark && (
        <SvgText x="50" y="58" fontSize="22" fontWeight="bold" fill={PINK} textAnchor="middle">
          {mark}
        </SvgText>
      )}
    </Svg>
  );
};

// the bright room behind the game: blue wall, window with a plant, picture, bookshelf, floor
export const Backdrop = () => (
  <Svg
    width="100%"
    height="100%"
    viewBox="0 0 450 800"
    preserveAspectRatio="xMidYMid slice"
    style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
  >
    <Rect x="0" y="0" width="450" height="800" fill="#bfe0f7" />
    <Rect x="0" y="0" width="450" height="130" fill="#cde8fa" />

    {/* window + plant */}
    <Rect x="-20" y="70" width="130" height="235" fill="#9ad3f5" stroke="#e0a96d" strokeWidth="8" />
    <Ellipse cx="30" cy="120" rx="34" ry="14" fill="#ffffff" opacity="0.8" />
    <Rect x="-20" y="300" width="145" height="14" fill="#e8b77a" />
    <Ellipse cx="42" cy="262" rx="12" ry="36" fill="#7cc65a" />
    <Ellipse cx="22" cy="272" rx="10" ry="30" fill="#8fd26a" />
    <Ellipse cx="62" cy="272" rx="10" ry="30" fill="#6fba4e" />
    <Rect x="24" y="274" width="40" height="28" rx="10" fill="#f4e1c0" />
    <Circle cx="36" cy="288" r="2" fill="#5b3a29" />
    <Circle cx="52" cy="288" r="2" fill="#5b3a29" />

    {/* picture frame */}
    <Rect x="340" y="95" width="92" height="92" fill="#8fd0e8" stroke="#c7e2ef" strokeWidth="6" />
    <Circle cx="386" cy="141" r="26" fill="#ffa63d" stroke="#ffd08a" strokeWidth="5" />

    {/* bookshelf */}
    <Rect x="375" y="330" width="90" height="270" fill="#e9a45c" stroke="#c07f3a" strokeWidth="5" />
    <Line x1="375" y1="412" x2="465" y2="412" stroke="#c07f3a" strokeWidth="5" />
    <Line x1="375" y1="505" x2="465" y2="505" stroke="#c07f3a" strokeWidth="5" />
    {['#4aa3e0', '#f6c445', '#3b8f5a', '#e0679a'].map((c, i) => (
      <Rect key={'s1' + i} x={385 + i * 17} y={350} width="14" height={58} fill={c} />
    ))}
    {['#e0679a', '#4aa3e0', '#f6c445'].map((c, i) => (
      <Rect key={'s2' + i} x={385 + i * 19} y={430} width="16" height={72} fill={c} />
    ))}

    {/* floor */}
    <Rect x="0" y="575" width="450" height="30" fill="#f0c48a" />
    <Rect x="0" y="605" width="450" height="195" fill="#e8b676" />
    {[640, 690, 740].map((y) => (
      <Line key={y} x1="0" y1={y} x2="450" y2={y} stroke="#d9a35f" strokeWidth="3" />
    ))}

    {/* books on the floor */}
    <Rect x="-10" y="535" width="100" height="22" rx="4" fill="#4aa3e0" />
    <Rect x="-10" y="513" width="92" height="22" rx="4" fill="#e0679a" />
    <Rect x="-10" y="491" width="84" height="22" rx="4" fill="#f6c445" />
  </Svg>
);
