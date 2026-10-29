import React from 'react';
import {StyleSheet} from 'react-native';
import Svg,{Rect,Path,Circle,Ellipse,Text as SvgText,G} from 'react-native-svg';

const INK='#1b2a4a';

/* lock + binary document picture */
export function LockArt({size=110}:{size?:number}){
  return <Svg width={size*1.15} height={size} viewBox="0 0 230 200">
    <Ellipse cx="115" cy="188" rx="92" ry="8" fill="rgba(0,0,0,0.12)"/>
    {/* document */}
    <Path d="M105 18 H177 L208 49 V172 H105 Z" fill="#eef4fb" stroke={INK} strokeWidth="5" strokeLinejoin="round"/>
    <Path d="M177 18 V49 H208" fill="#cfe0f3" stroke={INK} strokeWidth="5" strokeLinejoin="round"/>
    <SvgText x="118" y="84" fontSize="25" fontWeight="bold" fill={INK}>0101</SvgText>
    <SvgText x="118" y="112" fontSize="25" fontWeight="bold" fill={INK}>1010</SvgText>
    <SvgText x="112" y="140" fontSize="25" fontWeight="bold" fill={INK}>0101</SvgText>
    <Rect x="118" y="152" width="70" height="6" rx="3" fill="#b8cfe8"/>
    <Rect x="118" y="164" width="52" height="6" rx="3" fill="#b8cfe8"/>
    {/* padlock */}
    <Path d="M45 98 V66 A38 38 0 0 1 121 66 V98" fill="none" stroke={INK} strokeWidth="24" strokeLinecap="round"/>
    <Path d="M45 98 V66 A38 38 0 0 1 121 66 V98" fill="none" stroke="#f6c445" strokeWidth="13" strokeLinecap="round"/>
    <Rect x="18" y="92" width="130" height="92" rx="16" fill="#f6c445" stroke={INK} strokeWidth="5"/>
    <Rect x="28" y="100" width="110" height="14" rx="7" fill="#fbe08a"/>
    <Circle cx="83" cy="132" r="13" fill="#3b2a1a"/>
    <Rect x="77" y="134" width="12" height="30" rx="5" fill="#3b2a1a"/>
  </Svg>;
}

/* warm room background: window, plants, bookshelf */
export function WarmRoom(){
  return <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 480 900" preserveAspectRatio="xMidYMid slice">
    <Rect x="0" y="0" width="480" height="900" fill="#f1dcc2"/>
    <Rect x="0" y="560" width="480" height="340" fill="#ecd0b0"/>
    {/* window */}
    <Rect x="0" y="40" width="165" height="330" fill="#8ec9f0"/>
    <Circle cx="40" cy="120" r="34" fill="#ffffff" opacity="0.9"/>
    <Circle cx="78" cy="128" r="26" fill="#ffffff" opacity="0.9"/>
    <Circle cx="30" cy="270" r="60" fill="#7ab648"/>
    <Circle cx="95" cy="300" r="55" fill="#8cc656"/>
    <Rect x="0" y="40" width="165" height="330" fill="none" stroke="#d98b3a" strokeWidth="14"/>
    <Rect x="0" y="365" width="190" height="16" fill="#d98b3a"/>
    <G>
      <Rect x="12" y="320" width="34" height="46" rx="4" fill="#f4e6d4"/>
      <Circle cx="29" cy="310" r="16" fill="#79b84a"/>
    </G>
    {/* bookshelf */}
    <Rect x="395" y="330" width="85" height="570" fill="#c9772c"/>
    <Rect x="395" y="330" width="85" height="14" fill="#e09a48"/>
    <Rect x="410" y="360" width="16" height="70" fill="#3c6fa8"/>
    <Rect x="428" y="352" width="16" height="78" fill="#2f9a8c"/>
    <Rect x="446" y="362" width="16" height="68" fill="#e0a82e"/>
    <Rect x="395" y="432" width="85" height="12" fill="#e09a48"/>
    <Rect x="395" y="560" width="85" height="12" fill="#e09a48"/>
    <Rect x="410" y="580" width="16" height="64" fill="#d85b4a"/>
    <Rect x="428" y="588" width="16" height="56" fill="#3c6fa8"/>
    {/* plants */}
    <Circle cx="440" cy="270" r="40" fill="#5fa83a"/>
    <Circle cx="465" cy="235" r="30" fill="#79c24a"/>
    <Rect x="425" y="300" width="45" height="34" rx="6" fill="#f4e6d4"/>
    {/* desk + rug */}
    <Rect x="0" y="700" width="150" height="14" fill="#c9772c"/>
    <Ellipse cx="240" cy="880" rx="230" ry="38" fill="#f0a58c" opacity="0.8"/>
  </Svg>;
}