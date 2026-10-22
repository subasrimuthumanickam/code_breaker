import React from 'react';
import Svg, {
  Rect, Path, Circle, Ellipse, Line, Polygon, Text as SvgText,
} from 'react-native-svg';

// the room is drawn in a 300 x 235 box; the tap areas below use the same units
export const SCENE_W = 300;
export const SCENE_H = 235;

// where the calendar hangs (it is drawn on top of the room so it can flip)
export const CAL = { x: 172, y: 70, w: 39, h: 41 };

// tap areas, in scene units. The LAST one is on top. The ids are the same on the server.
export const OBJECTS: { id: string; x: number; y: number; w: number; h: number }[] = [
  { id: 'rug', x: 20, y: 196, w: 266, h: 39 },
  { id: 'lamp', x: 128, y: 0, w: 44, h: 60 },
  { id: 'window', x: 36, y: 52, w: 78, h: 78 },
  { id: 'picture', x: 122, y: 67, w: 40, h: 44 },
  { id: 'clock', x: 216, y: 34, w: 60, h: 60 },
  { id: 'bookshelf', x: 6, y: 108, w: 54, h: 92 },
  { id: 'chairL', x: 72, y: 146, w: 46, h: 76 },
  { id: 'chairR', x: 172, y: 146, w: 44, h: 76 },
  { id: 'table', x: 96, y: 150, w: 104, h: 64 },
  { id: 'cabinet', x: 240, y: 124, w: 52, h: 74 },
  { id: 'girl', x: 202, y: 104, w: 52, h: 128 },
  { id: 'calendar', x: CAL.x - 2, y: CAL.y - 2, w: CAL.w + 4, h: CAL.h + 4 },
];

const LINE = '#2b2b2b';

// the wall calendar: weekday on red, month, big day number
export const Calendar = ({
  w,
  weekday,
  month,
  day,
}: {
  w: number;
  weekday: string;
  month: string;
  day: number;
}) => (
  <Svg width={w} height={w * (CAL.h / CAL.w)} viewBox={`0 0 ${CAL.w} ${CAL.h}`}>
    <Rect x="1" y="1" width="37" height="39" rx="2" fill="#ffffff" stroke={LINE} strokeWidth="1.4" />
    <Rect x="1" y="1" width="37" height="10" rx="2" fill="#e63946" />
    <SvgText x="19.5" y="8.4" fontSize="6" fontWeight="bold" fill="#ffffff" textAnchor="middle">
      {weekday}
    </SvgText>
    <SvgText x="19.5" y="20" fontSize="7" fontWeight="bold" fill="#222222" textAnchor="middle">
      {month}
    </SvgText>
    <SvgText x="19.5" y="36" fontSize="16" fontWeight="bold" fill="#222222" textAnchor="middle">
      {day}
    </SvgText>
  </Svg>
);

// the clock numbers
const ClockNumbers = () => (
  <>
    {Array.from({ length: 12 }, (_, i) => {
      const n = i + 1;
      const a = ((n * 30 - 90) * Math.PI) / 180;
      return (
        <SvgText
          key={n}
          x={246 + Math.cos(a) * 21}
          y={64 + Math.sin(a) * 21 + 1.8}
          fontSize="5.2"
          fontWeight="bold"
          fill="#222222"
          textAnchor="middle"
        >
          {n}
        </SvgText>
      );
    })}
  </>
);

// the room: white walls, red lamp, window, picture, clock, shelf, table, chairs, cabinet and the girl
export const Room12 = ({ w }: { w: number }) => (
  <Svg width={w} height={(w * SCENE_H) / SCENE_W} viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}>
    {/* walls + floor */}
    <Rect x="0" y="0" width="300" height="235" fill="#ececec" />
    <Polygon points="0,0 30,26 30,196 0,235" fill="#e2e2e2" stroke={LINE} strokeWidth="1.6" />
    <Polygon points="300,0 276,26 276,196 300,235" fill="#e2e2e2" stroke={LINE} strokeWidth="1.6" />
    <Rect x="30" y="26" width="246" height="170" fill="#fbfbfb" stroke={LINE} strokeWidth="2" />
    <Polygon points="30,196 276,196 300,235 0,235" fill="#f0f0f0" stroke={LINE} strokeWidth="1.6" />

    {/* rug */}
    <Polygon points="48,192 266,192 288,233 24,233" fill="#7fd0cf" stroke="#2b6f6e" strokeWidth="1.6" />

    {/* hanging lamp */}
    <Line x1="150" y1="0" x2="150" y2="30" stroke={LINE} strokeWidth="1.6" />
    <Path d="M143 31 H157 L167 52 Q150 58 133 52 Z" fill="#d93a35" stroke="#7a1a17" strokeWidth="1.4" />
    <Circle cx="150" cy="55" r="3.5" fill="#ffe27a" stroke="#c9951a" strokeWidth="0.8" />

    {/* window with curtains */}
    <Rect x="36" y="53" width="78" height="3.5" fill="#7a4a2a" />
    <Rect x="58" y="58" width="34" height="66" fill="#8fd0f2" stroke="#4a6a7a" strokeWidth="1.2" />
    <Rect x="40" y="57" width="19" height="70" fill="#a8a07a" stroke="#5a5238" strokeWidth="1.2" />
    <Rect x="91" y="57" width="19" height="70" fill="#a8a07a" stroke="#5a5238" strokeWidth="1.2" />
    {[46, 52, 97, 103].map((x) => (
      <Line key={x} x1={x} y1="60" x2={x} y2="124" stroke="#7d7656" strokeWidth="0.8" />
    ))}

    {/* picture */}
    <Rect x="125" y="70" width="33" height="37" fill="#ffffff" stroke="#7a4a2a" strokeWidth="2.4" />
    <Rect x="129" y="74" width="25" height="29" fill="#a8dcf2" />
    <Rect x="129" y="93" width="25" height="10" fill="#4aa55a" />
    <Circle cx="142" cy="83" r="3.2" fill="#ffd23f" />
    <Rect x="137" y="94" width="10" height="3" rx="1.5" fill="#8a5a2a" />

    {/* clock (about quarter past eight: she is late) */}
    <Circle cx="246" cy="64" r="28" fill="#ffffff" stroke={LINE} strokeWidth="2" />
    <ClockNumbers />
    <Line x1="246" y1="64" x2="236.5" y2="66.5" stroke="#222222" strokeWidth="2" strokeLinecap="round" />
    <Line x1="246" y1="64" x2="266" y2="64" stroke="#35a6c9" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="246" cy="64" r="2" fill="#222222" />

    {/* bookshelf */}
    <Rect x="9" y="125" width="47" height="73" fill="#4a3a2a" stroke={LINE} strokeWidth="1.6" />
    <Line x1="9" y1="161" x2="56" y2="161" stroke={LINE} strokeWidth="1.6" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <Rect key={'a' + i} x={13 + i * 6.8} y="130" width="5.4" height="28" fill={['#3b8f5a', '#6a4aa8', '#3b8f5a', '#a8486a', '#3b8f5a', '#6a4aa8'][i]} />
    ))}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <Rect key={'b' + i} x={13 + i * 6.8} y="166" width="5.4" height="28" fill={['#6a4aa8', '#3b8f5a', '#a8486a', '#3b8f5a', '#6a4aa8', '#3b8f5a'][i]} />
    ))}
    <Rect x="12" y="117" width="30" height="7" fill="#3b5a7a" stroke={LINE} strokeWidth="1" />
    <Rect x="14" y="111" width="26" height="6" fill="#6a7a8a" stroke={LINE} strokeWidth="1" />

    {/* left chair with a red cloth */}
    <Polygon points="80,150 92,148 96,176 84,178" fill="#9b6a45" stroke="#4a2a12" strokeWidth="1.4" />
    <Polygon points="82,178 108,178 114,188 88,188" fill="#b07a50" stroke="#4a2a12" strokeWidth="1.4" />
    <Line x1="88" y1="188" x2="88" y2="219" stroke="#4a2a12" strokeWidth="2.2" />
    <Line x1="112" y1="188" x2="112" y2="217" stroke="#4a2a12" strokeWidth="2.2" />
    <Line x1="80" y1="180" x2="80" y2="214" stroke="#4a2a12" strokeWidth="2" />
    <Ellipse cx="93" cy="170" rx="11" ry="7" fill="#e0523a" stroke="#8a2a1a" strokeWidth="1" />
    <Circle cx="89" cy="168" r="1.6" fill="#ffd9a8" />
    <Circle cx="96" cy="172" r="1.6" fill="#ffd9a8" />

    {/* round table with flowers */}
    <Rect x="142" y="180" width="8" height="24" fill="#8a5a2a" stroke="#4a2a12" strokeWidth="1.2" />
    <Ellipse cx="146" cy="207" rx="22" ry="4" fill="#8a5a2a" stroke="#4a2a12" strokeWidth="1.2" />
    <Ellipse cx="146" cy="173" rx="48" ry="11" fill="#b8763a" stroke="#4a2a12" strokeWidth="1.6" />
    <Ellipse cx="146" cy="173" rx="42" ry="8" fill="none" stroke="#d09a5c" strokeWidth="1" />
    <Rect x="139" y="158" width="14" height="12" rx="2" fill="#b8763a" stroke="#4a2a12" strokeWidth="1.2" />
    <Line x1="143" y1="158" x2="141" y2="147" stroke="#3a8a3a" strokeWidth="1.4" />
    <Line x1="149" y1="158" x2="151" y2="146" stroke="#3a8a3a" strokeWidth="1.4" />
    <Ellipse cx="141" cy="145" rx="2.6" ry="4" fill="#d93a35" stroke="#7a1a17" strokeWidth="0.8" />
    <Ellipse cx="151" cy="144" rx="2.6" ry="4" fill="#d93a35" stroke="#7a1a17" strokeWidth="0.8" />

    {/* right chair */}
    <Polygon points="192,150 204,150 206,178 194,178" fill="#9b6a45" stroke="#4a2a12" strokeWidth="1.4" />
    <Polygon points="176,180 204,180 210,190 182,190" fill="#b07a50" stroke="#4a2a12" strokeWidth="1.4" />
    <Line x1="182" y1="190" x2="182" y2="219" stroke="#4a2a12" strokeWidth="2.2" />
    <Line x1="206" y1="190" x2="206" y2="217" stroke="#4a2a12" strokeWidth="2.2" />
    <Line x1="176" y1="182" x2="176" y2="214" stroke="#4a2a12" strokeWidth="2" />

    {/* cabinet with a phone */}
    <Rect x="262" y="132" width="8" height="16" rx="1.5" fill="#4a4a4a" stroke="#222222" strokeWidth="0.8" />
    <Line x1="266" y1="124" x2="266" y2="132" stroke="#222222" strokeWidth="1.2" />
    <Rect x="241" y="148" width="47" height="5" fill="#b8763a" stroke="#4a2a12" strokeWidth="1.2" />
    <Rect x="243" y="153" width="43" height="40" fill="#c78a4b" stroke="#4a2a12" strokeWidth="1.6" />
    <Rect x="246" y="156" width="37" height="15" fill="#d9a35a" stroke="#4a2a12" strokeWidth="1" />
    <Rect x="246" y="174" width="37" height="15" fill="#d9a35a" stroke="#4a2a12" strokeWidth="1" />
    <Circle cx="264.5" cy="163.5" r="1.8" fill="#4a2a12" />
    <Circle cx="264.5" cy="181.5" r="1.8" fill="#4a2a12" />
    <Line x1="246" y1="193" x2="246" y2="200" stroke="#4a2a12" strokeWidth="2" />
    <Line x1="283" y1="193" x2="283" y2="200" stroke="#4a2a12" strokeWidth="2" />

    {/* the girl: worried, looking at her watch */}
    <Rect x="207" y="138" width="12" height="34" rx="5" fill="#d66bbf" stroke="#8a2f78" strokeWidth="1" />
    <Rect x="220" y="196" width="6" height="14" fill="#f6d3b8" stroke="#7a5a44" strokeWidth="0.8" />
    <Rect x="232" y="196" width="6" height="14" fill="#f6d3b8" stroke="#7a5a44" strokeWidth="0.8" />
    <Rect x="220" y="208" width="6" height="11" fill="#ffffff" stroke="#7a7a7a" strokeWidth="0.8" />
    <Rect x="232" y="208" width="6" height="11" fill="#ffffff" stroke="#7a7a7a" strokeWidth="0.8" />
    <Ellipse cx="222" cy="222" rx="8" ry="4" fill="#4a2a14" />
    <Ellipse cx="237" cy="222" rx="8" ry="4" fill="#4a2a14" />
    <Polygon points="214,168 246,168 252,198 208,198" fill="#1f2d6b" stroke="#0f1a40" strokeWidth="1.2" />
    <Line x1="222" y1="170" x2="219" y2="197" stroke="#34449a" strokeWidth="1" />
    <Line x1="230" y1="170" x2="230" y2="197" stroke="#34449a" strokeWidth="1" />
    <Line x1="238" y1="170" x2="241" y2="197" stroke="#34449a" strokeWidth="1" />
    <Rect x="214" y="142" width="32" height="28" rx="6" fill="#ffffff" stroke="#3a3a3a" strokeWidth="1" />
    <Polygon points="224,142 230,153 236,142" fill="#ffffff" stroke="#3a3a3a" strokeWidth="0.8" />
    <Polygon points="228,150 232,150 233,166 227,166" fill="#1f2d6b" />
    <Path d="M246 150 Q257 161 244 170" stroke="#f6d3b8" strokeWidth="5" fill="none" strokeLinecap="round" />
    <Rect x="240" y="166" width="7" height="3.5" rx="1" fill="#6fa8dc" stroke="#3a3a3a" strokeWidth="0.6" />
    <Ellipse cx="246" cy="124" rx="6" ry="10" fill="#8a4a24" stroke="#4a2a14" strokeWidth="0.8" />
    <Circle cx="229" cy="124" r="17" fill="#8a4a24" stroke="#4a2a14" strokeWidth="0.8" />
    <Circle cx="229" cy="130" r="13.5" fill="#f6d3b8" stroke="#7a5a44" strokeWidth="0.8" />
    <Path d="M216 125 Q229 108 242 125 Q229 118 216 125 Z" fill="#8a4a24" />
    <Circle cx="224" cy="130" r="1.7" fill="#222222" />
    <Circle cx="234" cy="130" r="1.7" fill="#222222" />
    <Line x1="221" y1="126" x2="226" y2="127" stroke="#222222" strokeWidth="0.9" />
    <Line x1="237" y1="126" x2="232" y2="127" stroke="#222222" strokeWidth="0.9" />
    <Path d="M225.5 138 Q229 135 232.5 138" stroke="#222222" strokeWidth="1" fill="none" strokeLinecap="round" />
    <Path d="M252 110 Q254 113 252 116" stroke="#444444" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <Path d="M257 108 Q259 111 257 114" stroke="#444444" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </Svg>
);

// the background behind the game card: blue wall, window with a plant, picture, bookshelf, floor
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

    {/* books on the floor + pencil cup */}
    <Rect x="-10" y="535" width="100" height="22" rx="4" fill="#4aa3e0" />
    <Rect x="-10" y="513" width="92" height="22" rx="4" fill="#e0679a" />
    <Rect x="-10" y="491" width="84" height="22" rx="4" fill="#f6c445" />
    <Rect x="385" y="545" width="58" height="62" rx="8" fill="#f6c445" stroke="#d9a21f" strokeWidth="3" />
    <Line x1="400" y1="545" x2="396" y2="500" stroke="#3b8f5a" strokeWidth="7" strokeLinecap="round" />
    <Line x1="418" y1="545" x2="426" y2="498" stroke="#4aa3e0" strokeWidth="7" strokeLinecap="round" />
  </Svg>
);
