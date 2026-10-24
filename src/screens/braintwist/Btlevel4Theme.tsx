import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Ellipse, Path, G, Line } from 'react-native-svg';

// Level 1 style kids' room: blue wall, window + plant, bookshelf, pink skirting, wooden floor.
// Drawn in a 448 x 796 box and stretched to cover the whole screen.
export const RoomBackground = () => (
  <Svg
    style={StyleSheet.absoluteFill}
    width="100%"
    height="100%"
    viewBox="0 0 448 796"
    preserveAspectRatio="xMidYMid slice"
  >
    {/* wall */}
    <Rect x="0" y="0" width="448" height="796" fill="#bddaee" />
    <Path d="M120 0 L220 0 L120 560 L40 560 Z" fill="rgba(255,255,255,0.18)" />
    <Path d="M250 0 L300 0 L230 560 L190 560 Z" fill="rgba(255,255,255,0.12)" />

    {/* window */}
    <Rect x="-10" y="64" width="108" height="236" fill="#e9a55a" />
    <Rect x="-10" y="72" width="98" height="108" fill="#9fd6f5" />
    <Rect x="-10" y="188" width="98" height="104" fill="#9fd6f5" />
    <Ellipse cx="68" cy="108" rx="22" ry="9" fill="#ffffff" />
    <Ellipse cx="50" cy="114" rx="16" ry="8" fill="#ffffff" />
    <Ellipse cx="30" cy="208" rx="20" ry="8" fill="#ffffff" opacity="0.9" />
    <Rect x="-10" y="294" width="128" height="18" fill="#e8b46d" />

    {/* plant on the sill */}
    <G>
      <Ellipse cx="22" cy="248" rx="20" ry="38" fill="#6cbf4a" transform="rotate(-18 22 248)" />
      <Ellipse cx="74" cy="242" rx="20" ry="40" fill="#8bd05a" transform="rotate(18 74 242)" />
      <Ellipse cx="48" cy="236" rx="18" ry="42" fill="#5bb043" />
      <Rect x="30" y="262" width="42" height="34" rx="10" fill="#f6ead6" />
      <Circle cx="43" cy="278" r="2.2" fill="#8a7a66" />
      <Circle cx="59" cy="278" r="2.2" fill="#8a7a66" />
    </G>

    {/* bookshelf */}
    <Rect x="372" y="304" width="90" height="320" fill="#dc9d4c" />
    <Rect x="372" y="304" width="90" height="10" fill="#f0b768" />
    <Rect x="372" y="384" width="90" height="8" fill="#f0b768" />
    <Rect x="372" y="466" width="90" height="8" fill="#f0b768" />
    <Rect x="372" y="548" width="90" height="8" fill="#f0b768" />
    <Rect x="388" y="326" width="14" height="58" fill="#3fa7e0" />
    <Rect x="404" y="320" width="14" height="64" fill="#f3c63c" />
    <Rect x="420" y="332" width="14" height="52" fill="#8e63d8" />
    <Rect x="388" y="418" width="14" height="48" fill="#3f6fd0" />
    <Rect x="404" y="412" width="14" height="54" fill="#35b0a8" />
    <Circle cx="404" cy="508" r="20" fill="#b9793a" />
    <Circle cx="390" cy="492" r="8" fill="#b9793a" />
    <Circle cx="420" cy="492" r="8" fill="#b9793a" />

    {/* skirting + wooden floor */}
    <Rect x="0" y="560" width="448" height="20" fill="#f1c3c9" />
    <Rect x="0" y="580" width="448" height="216" fill="#e7b57a" />
    {[0, 1, 2, 3, 4].map((i) => (
      <Line key={i} x1="0" y1={612 + i * 46} x2="448" y2={612 + i * 46} stroke="#d99f63" strokeWidth="2" />
    ))}
    {[60, 170, 290, 400].map((x, i) => (
      <Line key={`v${i}`} x1={x} y1={580 + (i % 2) * 20} x2={x} y2={612 + (i % 2) * 20} stroke="#d99f63" strokeWidth="2" />
    ))}
  </Svg>
);

// water drops etc. stay in Btlevel4art.tsx - this file is only the Level 1 look.
export const THEME = {
  wood: '#b8762f',
  woodDark: '#8d5521',
  cream: '#f8ecd8',
  navy: '#1c2f6b',
  panel: '#f6e8d3',
  panelBorder: '#b9d3e8',
  yellow: '#ffe08a',
  yellowBorder: '#e8b84a',
  green: '#a8dc3c',
  greenRing: '#d3ec8f',
  red: '#ee4558',
  badge: '#7a4a2a',
  orange: '#f5a623',
};
