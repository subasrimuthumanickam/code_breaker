// // // // import React from 'react';
// // // // import Svg, { Path, Circle, Ellipse, Line, Rect } from 'react-native-svg';

// // // // const K = '#2b2b2b';
// // // // const ol = { stroke: K, strokeWidth: 2.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

// // // // // size of every vegetable on the board (width, height)
// // // // export const VEG_SIZE: Record<string, { w: number; h: number }> = {
// // // //   cucumber: { w: 112, h: 44.8 },
// // // //   zucchini: { w: 112, h: 44.8 },
// // // //   gourd: { w: 112, h: 44.8 },
// // // //   kovakkai: { w: 84, h: 33.6 },
// // // //   carrot: { w: 104, h: 41.6 },
// // // //   brinjal: { w: 100, h: 40 },
// // // //   tomato: { w: 66, h: 66 },
// // // //   onion: { w: 60, h: 60 },
// // // //   capsicum: { w: 62, h: 62 },
// // // // };

// // // // /* kovakkai (ivy gourd): small, light green, pale stripes, rounded finger shape */
// // // // export const Kovakkai = ({ w = 84 }: { w?: number }) => (
// // // //   <Svg width={w} height={w * 0.4} viewBox="0 0 90 36">
// // // //     <Path d="M6 18 C6 9 20 6 45 6 C70 6 84 9 84 18 C84 27 70 30 45 30 C20 30 6 27 6 18Z" fill="#92d44f" {...ol} />
// // // //     <Path d="M12 13 C30 9 60 9 78 13 M10 18 C30 17 60 17 80 18 M12 23 C30 27 60 27 78 23" stroke="#dff5b0" strokeWidth={2.2} fill="none" strokeLinecap="round" />
// // // //     <Path d="M6 18 C2 18 1 15 2 12" stroke="#5f8f2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
// // // //     <Path d="M84 18 C87 18 88 20 88 22" stroke="#5f8f2a" strokeWidth={2} fill="none" strokeLinecap="round" />
// // // //   </Svg>
// // // // );

// // // // /* carrot: orange cone with green leaves */
// // // // export const Carrot = ({ w = 104 }: { w?: number }) => (
// // // //   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
// // // //     <Path d="M26 10 C60 8 100 20 116 24 C100 28 60 40 26 38 C18 38 16 12 26 10Z" fill="#f28c1e" {...ol} />
// // // //     <Path d="M40 17 L50 19 M58 23 L70 24 M44 31 L54 30 M76 26 L88 25" stroke="#c4600f" strokeWidth={2.2} strokeLinecap="round" />
// // // //     <Path d="M26 24 C18 14 10 10 4 9 C7 15 9 19 12 22 C7 25 4 28 3 34 C11 31 17 29 26 26Z" fill="#3fa23a" {...ol} strokeWidth={2} />
// // // //   </Svg>
// // // // );

// // // // /* brinjal (aubergine): purple with green cap */
// // // // export const Brinjal = ({ w = 100 }: { w?: number }) => (
// // // //   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
// // // //     <Path d="M22 24 C22 10 44 6 72 8 C102 10 116 18 116 26 C116 36 100 40 72 40 C44 42 22 38 22 24Z" fill="#6b2d8f" {...ol} />
// // // //     <Path d="M34 15 C56 10 86 13 104 20" stroke="#a96fd0" strokeWidth={3.2} fill="none" strokeLinecap="round" />
// // // //     <Path d="M24 12 L10 8 L16 20 L4 24 L16 28 L10 40 L24 36 Z" fill="#3f9a3a" {...ol} strokeWidth={2} />
// // // //   </Svg>
// // // // );

// // // // /* onion: red, pointed top */
// // // // export const Onion = ({ w = 60 }: { w?: number }) => (
// // // //   <Svg width={w} height={w} viewBox="0 0 70 70">
// // // //     <Path d="M35 12 C52 22 62 32 60 44 C58 58 46 64 35 64 C24 64 12 58 10 44 C8 32 18 22 35 12Z" fill="#c4569f" {...ol} />
// // // //     <Path d="M35 16 C28 28 26 46 35 62 M35 16 C42 28 44 46 35 62" stroke="#e79bcf" strokeWidth={2.2} fill="none" strokeLinecap="round" />
// // // //     <Path d="M35 12 C34 8 36 5 40 3" stroke="#7a9a2f" strokeWidth={3} fill="none" strokeLinecap="round" />
// // // //     <Path d="M30 64 L28 68 M35 64 L35 69 M40 64 L42 68" stroke="#e8d3a4" strokeWidth={1.8} strokeLinecap="round" />
// // // //   </Svg>
// // // // );

// // // // /* capsicum: green bell pepper */
// // // // export const Capsicum = ({ w = 62 }: { w?: number }) => (
// // // //   <Svg width={w} height={w} viewBox="0 0 70 70">
// // // //     <Path d="M16 26 C16 14 28 12 35 18 C42 12 54 14 54 26 C58 40 52 58 35 61 C18 58 12 40 16 26Z" fill="#43b24e" {...ol} />
// // // //     <Path d="M30 22 C26 36 28 50 33 58 M40 22 C44 36 42 50 37 58" stroke="#7fd986" strokeWidth={2.4} fill="none" strokeLinecap="round" />
// // // //     <Path d="M35 18 C35 12 38 8 43 7" stroke="#2f7d2c" strokeWidth={4} fill="none" strokeLinecap="round" />
// // // //   </Svg>
// // // // );
// // // import React from 'react';
// // // import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

// // // const K = '#2b2b2b';
// // // const ol = { stroke: K, strokeWidth: 2.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

// // // // size of every vegetable picture on the board (width, height)
// // // export const VEG_SIZE: Record<string, { w: number; h: number }> = {
// // //   cucumber: { w: 112, h: 44.8 },
// // //   zucchini: { w: 112, h: 44.8 },
// // //   gourd: { w: 112, h: 44.8 },
// // //   kovakkai: { w: 84, h: 33.6 },
// // //   pointed: { w: 84, h: 37 },
// // //   snake: { w: 112, h: 44.8 },
// // //   ridge: { w: 108, h: 43 },
// // //   carrot: { w: 104, h: 41.6 },
// // //   brinjal: { w: 100, h: 40 },
// // //   tomato: { w: 66, h: 66 },
// // //   pumpkin: { w: 72, h: 59 },
// // //   onion: { w: 60, h: 60 },
// // //   capsicum: { w: 62, h: 62 },
// // // };

// // // /* ivy gourd (kovakkai): small, light green, pale stripes */
// // // export const Kovakkai = ({ w = 84 }: { w?: number }) => (
// // //   <Svg width={w} height={w * 0.4} viewBox="0 0 90 36">
// // //     <Path d="M6 18 C6 9 20 6 45 6 C70 6 84 9 84 18 C84 27 70 30 45 30 C20 30 6 27 6 18Z" fill="#92d44f" {...ol} />
// // //     <Path d="M12 13 C30 9 60 9 78 13 M10 18 C30 17 60 17 80 18 M12 23 C30 27 60 27 78 23" stroke="#dff5b0" strokeWidth={2.2} fill="none" strokeLinecap="round" />
// // //     <Path d="M6 18 C2 18 1 15 2 12" stroke="#5f8f2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
// // //   </Svg>
// // // );

// // // /* pointed gourd (parwal): plump, pointed ends, pale stripes */
// // // export const PointedGourd = ({ w = 84 }: { w?: number }) => (
// // //   <Svg width={w} height={w * 0.44} viewBox="0 0 90 40">
// // //     <Path d="M3 20 C14 8 30 5 46 5 C62 5 76 8 87 20 C76 32 62 35 46 35 C30 35 14 32 3 20Z" fill="#5fb546" {...ol} />
// // //     <Path d="M10 20 C24 18 66 18 80 20" stroke="#d5efb5" strokeWidth={2.2} fill="none" strokeLinecap="round" />
// // //     <Path d="M16 12 C32 9 60 9 74 12 M16 28 C32 31 60 31 74 28" stroke="#d5efb5" strokeWidth={2.2} fill="none" strokeLinecap="round" />
// // //     <Path d="M3 20 L-1 20" stroke="#4f7a2a" strokeWidth={2.4} strokeLinecap="round" />
// // //   </Svg>
// // // );

// // // /* snake gourd: long, curved, thin, pale green with dark stripes */
// // // export const SnakeGourd = ({ w = 112 }: { w?: number }) => (
// // //   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
// // //     <Path d="M6 26 C30 20 72 22 96 16 C106 13 113 10 117 5 C115 14 108 22 96 29 C72 40 30 40 6 35 C2 33 2 28 6 26Z" fill="#bfe3a0" {...ol} />
// // //     <Path d="M10 29 C36 26 72 27 102 16 M10 33 C36 34 72 34 98 24" stroke="#5a9a3e" strokeWidth={2.4} fill="none" strokeLinecap="round" />
// // //     <Path d="M6 30 C2 30 1 27 2 24" stroke="#5f8f2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
// // //   </Svg>
// // // );

// // // /* ridge gourd (turai): long with dark angular ridges */
// // // export const RidgeGourd = ({ w = 108 }: { w?: number }) => (
// // //   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
// // //     <Path d="M8 22 C8 16 20 12 60 12 C100 12 116 16 116 25 C116 33 100 38 60 38 C20 38 8 32 8 22Z" fill="#6fae4b" {...ol} />
// // //     <Path d="M14 17 L110 19 M12 24 L114 26 M14 31 L108 32" stroke="#2f6a2a" strokeWidth={2.6} fill="none" strokeLinecap="round" />
// // //     <Path d="M30 15 L32 34 M56 14 L58 36 M82 15 L84 35" stroke="#9ad176" strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
// // //     <Path d="M8 22 C3 22 2 18 3 15" stroke="#5f8f2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
// // //   </Svg>
// // // );

// // // /* carrot */
// // // export const Carrot = ({ w = 104 }: { w?: number }) => (
// // //   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
// // //     <Path d="M26 10 C60 8 100 20 116 24 C100 28 60 40 26 38 C18 38 16 12 26 10Z" fill="#f28c1e" {...ol} />
// // //     <Path d="M40 17 L50 19 M58 23 L70 24 M44 31 L54 30 M76 26 L88 25" stroke="#c4600f" strokeWidth={2.2} strokeLinecap="round" />
// // //     <Path d="M26 24 C18 14 10 10 4 9 C7 15 9 19 12 22 C7 25 4 28 3 34 C11 31 17 29 26 26Z" fill="#3fa23a" {...ol} strokeWidth={2} />
// // //   </Svg>
// // // );

// // // /* brinjal (aubergine) */
// // // export const Brinjal = ({ w = 100 }: { w?: number }) => (
// // //   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
// // //     <Path d="M22 24 C22 10 44 6 72 8 C102 10 116 18 116 26 C116 36 100 40 72 40 C44 42 22 38 22 24Z" fill="#6b2d8f" {...ol} />
// // //     <Path d="M34 15 C56 10 86 13 104 20" stroke="#a96fd0" strokeWidth={3.2} fill="none" strokeLinecap="round" />
// // //     <Path d="M24 12 L10 8 L16 20 L4 24 L16 28 L10 40 L24 36 Z" fill="#3f9a3a" {...ol} strokeWidth={2} />
// // //   </Svg>
// // // );

// // // /* pumpkin */
// // // export const Pumpkin = ({ w = 72 }: { w?: number }) => (
// // //   <Svg width={w} height={w * 0.82} viewBox="0 0 80 66">
// // //     <Ellipse cx={40} cy={38} rx={36} ry={26} fill="#f59a23" {...ol} />
// // //     <Path d="M40 12 C28 22 28 54 40 64 M40 12 C52 22 52 54 40 64" stroke="#c9700f" strokeWidth={2.4} fill="none" strokeLinecap="round" />
// // //     <Path d="M22 16 C10 28 10 50 22 60 M58 16 C70 28 70 50 58 60" stroke="#c9700f" strokeWidth={2.2} fill="none" strokeLinecap="round" />
// // //     <Path d="M40 12 C40 6 43 3 47 2" stroke="#4d7a2a" strokeWidth={5} fill="none" strokeLinecap="round" />
// // //     <Circle cx={30} cy={28} r={3} fill="#ffc86b" opacity={0.7} />
// // //   </Svg>
// // // );

// // // /* onion */
// // // export const Onion = ({ w = 60 }: { w?: number }) => (
// // //   <Svg width={w} height={w} viewBox="0 0 70 70">
// // //     <Path d="M35 12 C52 22 62 32 60 44 C58 58 46 64 35 64 C24 64 12 58 10 44 C8 32 18 22 35 12Z" fill="#c4569f" {...ol} />
// // //     <Path d="M35 16 C28 28 26 46 35 62 M35 16 C42 28 44 46 35 62" stroke="#e79bcf" strokeWidth={2.2} fill="none" strokeLinecap="round" />
// // //     <Path d="M35 12 C34 8 36 5 40 3" stroke="#7a9a2f" strokeWidth={3} fill="none" strokeLinecap="round" />
// // //   </Svg>
// // // );

// // // /* capsicum */
// // // export const Capsicum = ({ w = 62 }: { w?: number }) => (
// // //   <Svg width={w} height={w} viewBox="0 0 70 70">
// // //     <Path d="M16 26 C16 14 28 12 35 18 C42 12 54 14 54 26 C58 40 52 58 35 61 C18 58 12 40 16 26Z" fill="#43b24e" {...ol} />
// // //     <Path d="M30 22 C26 36 28 50 33 58 M40 22 C44 36 42 50 37 58" stroke="#7fd986" strokeWidth={2.4} fill="none" strokeLinecap="round" />
// // //     <Path d="M35 18 C35 12 38 8 43 7" stroke="#2f7d2c" strokeWidth={4} fill="none" strokeLinecap="round" />
// // //   </Svg>
// // // );
// // import React from 'react';
// // import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

// // const K = '#2b2b2b';
// // const ol = { stroke: K, strokeWidth: 2.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

// // // size of every vegetable picture on the board (width, height)
// // export const VEG_SIZE: Record<string, { w: number; h: number }> = {
// //   cucumber: { w: 112, h: 44.8 },
// //   kovakkai: { w: 84, h: 33.6 },
// //   pointed: { w: 84, h: 37 },
// //   snake: { w: 112, h: 44.8 },
// //   ridge: { w: 108, h: 43 },
// //   capsicum: { w: 62, h: 62 },
// //   okra: { w: 96, h: 38.4 },
// //   chilli: { w: 100, h: 40 },
// //   cabbage: { w: 64, h: 64 },
// //   broccoli: { w: 64, h: 64 },
// // };

// // /* 1. ivy gourd (kovakkai): small, oval, green with light stripes */
// // export const Kovakkai = ({ w = 84 }: { w?: number }) => (
// //   <Svg width={w} height={w * 0.4} viewBox="0 0 90 36">
// //     <Path d="M6 18 C6 9 20 6 45 6 C70 6 84 9 84 18 C84 27 70 30 45 30 C20 30 6 27 6 18Z" fill="#92d44f" {...ol} />
// //     <Path d="M12 13 C30 9 60 9 78 13 M10 18 C30 17 60 17 80 18 M12 23 C30 27 60 27 78 23" stroke="#dff5b0" strokeWidth={2.2} fill="none" strokeLinecap="round" />
// //     <Path d="M6 18 C2 18 1 15 2 12" stroke="#5f8f2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
// //   </Svg>
// // );

// // /* 2. snake gourd: long, slender, green */
// // export const SnakeGourd = ({ w = 112 }: { w?: number }) => (
// //   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
// //     <Path d="M6 26 C30 20 72 22 96 16 C106 13 113 10 117 5 C115 14 108 22 96 29 C72 40 30 40 6 35 C2 33 2 28 6 26Z" fill="#bfe3a0" {...ol} />
// //     <Path d="M10 29 C36 26 72 27 102 16 M10 33 C36 34 72 34 98 24" stroke="#5a9a3e" strokeWidth={2.4} fill="none" strokeLinecap="round" />
// //     <Path d="M6 30 C2 30 1 27 2 24" stroke="#5f8f2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
// //   </Svg>
// // );

// // /* 3. ridge gourd: long green with ridges */
// // export const RidgeGourd = ({ w = 108 }: { w?: number }) => (
// //   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
// //     <Path d="M8 22 C8 16 20 12 60 12 C100 12 116 16 116 25 C116 33 100 38 60 38 C20 38 8 32 8 22Z" fill="#6fae4b" {...ol} />
// //     <Path d="M14 17 L110 19 M12 24 L114 26 M14 31 L108 32" stroke="#2f6a2a" strokeWidth={2.6} fill="none" strokeLinecap="round" />
// //     <Path d="M30 15 L32 34 M56 14 L58 36 M82 15 L84 35" stroke="#9ad176" strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
// //     <Path d="M8 22 C3 22 2 18 3 15" stroke="#5f8f2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
// //   </Svg>
// // );

// // /* 4. pointed gourd (parwal): plump, pointed ends, pale stripes */
// // export const PointedGourd = ({ w = 84 }: { w?: number }) => (
// //   <Svg width={w} height={w * 0.44} viewBox="0 0 90 40">
// //     <Path d="M3 20 C14 8 30 5 46 5 C62 5 76 8 87 20 C76 32 62 35 46 35 C30 35 14 32 3 20Z" fill="#5fb546" {...ol} />
// //     <Path d="M10 20 C24 18 66 18 80 20" stroke="#d5efb5" strokeWidth={2.2} fill="none" strokeLinecap="round" />
// //     <Path d="M16 12 C32 9 60 9 74 12 M16 28 C32 31 60 31 74 28" stroke="#d5efb5" strokeWidth={2.2} fill="none" strokeLinecap="round" />
// //   </Svg>
// // );

// // /* other green vegetables (not cucumbers) */

// // export const Capsicum = ({ w = 62 }: { w?: number }) => (
// //   <Svg width={w} height={w} viewBox="0 0 70 70">
// //     <Path d="M16 26 C16 14 28 12 35 18 C42 12 54 14 54 26 C58 40 52 58 35 61 C18 58 12 40 16 26Z" fill="#43b24e" {...ol} />
// //     <Path d="M30 22 C26 36 28 50 33 58 M40 22 C44 36 42 50 37 58" stroke="#7fd986" strokeWidth={2.4} fill="none" strokeLinecap="round" />
// //     <Path d="M35 18 C35 12 38 8 43 7" stroke="#2f7d2c" strokeWidth={4} fill="none" strokeLinecap="round" />
// //   </Svg>
// // );

// // /* okra / ladies finger */
// // export const Okra = ({ w = 96 }: { w?: number }) => (
// //   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
// //     <Path d="M18 14 C50 12 90 20 116 26 C90 34 50 38 18 34 C10 32 10 16 18 14Z" fill="#6cc24a" {...ol} />
// //     <Path d="M24 18 C54 17 90 23 108 26 M24 30 C54 32 90 30 108 27" stroke="#2f8f3a" strokeWidth={2.2} fill="none" strokeLinecap="round" />
// //     <Path d="M18 14 C12 12 8 8 6 4 M18 34 C12 36 8 40 6 44" stroke="#3d7d2a" strokeWidth={3} fill="none" strokeLinecap="round" />
// //     <Path d="M18 14 L18 34" stroke="#3d7d2a" strokeWidth={4} strokeLinecap="round" />
// //   </Svg>
// // );

// // /* green chilli */
// // export const GreenChilli = ({ w = 100 }: { w?: number }) => (
// //   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
// //     <Path d="M14 12 C44 8 94 18 116 40 C92 36 44 32 16 24 C8 22 8 14 14 12Z" fill="#34b43c" {...ol} />
// //     <Path d="M24 14 C54 12 90 22 106 34" stroke="#8fe08f" strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.9} />
// //     <Path d="M12 13 C8 9 6 7 3 5" stroke="#2f6d27" strokeWidth={4} fill="none" strokeLinecap="round" />
// //   </Svg>
// // );

// // /* cabbage */
// // export const Cabbage = ({ w = 64 }: { w?: number }) => (
// //   <Svg width={w} height={w} viewBox="0 0 70 70">
// //     <Ellipse cx={35} cy={37} rx={29} ry={27} fill="#9fdc7a" {...ol} />
// //     <Path d="M35 10 C24 22 22 48 35 64 M35 10 C46 22 48 48 35 64" stroke="#5aa63f" strokeWidth={2.2} fill="none" strokeLinecap="round" />
// //     <Path d="M12 30 C26 28 44 28 58 30 M14 46 C28 50 42 50 56 46" stroke="#5aa63f" strokeWidth={2.2} fill="none" strokeLinecap="round" />
// //     <Path d="M20 20 C24 14 30 12 34 14" stroke="#d6f5bf" strokeWidth={3} fill="none" strokeLinecap="round" />
// //   </Svg>
// // );

// // /* broccoli */
// // export const Broccoli = ({ w = 64 }: { w?: number }) => (
// //   <Svg width={w} height={w} viewBox="0 0 70 70">
// //     <Path d="M29 66 L32 42 L40 42 L43 66 Z" fill="#9ccf6c" {...ol} />
// //     <Circle cx={20} cy={34} r={13} fill="#2f9a3d" {...ol} />
// //     <Circle cx={50} cy={34} r={13} fill="#2f9a3d" {...ol} />
// //     <Circle cx={35} cy={22} r={15} fill="#37ad47" {...ol} />
// //     <Circle cx={35} cy={38} r={12} fill="#2f9a3d" {...ol} />
// //     <Circle cx={30} cy={18} r={2} fill="#7fdc8a" />
// //     <Circle cx={42} cy={24} r={2} fill="#7fdc8a" />
// //     <Circle cx={18} cy={32} r={2} fill="#7fdc8a" />
// //     <Circle cx={52} cy={32} r={2} fill="#7fdc8a" />
// //   </Svg>
// // );
// import React from 'react';
// import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

// const K = '#2b2b2b';
// const ol = { stroke: K, strokeWidth: 2.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

// // size of every vegetable picture on the board (width, height)
// export const VEG_SIZE: Record<string, { w: number; h: number }> = {
//   cucumber: { w: 112, h: 44.8 },
//   kovakkai: { w: 84, h: 33.6 },
//   pointed: { w: 84, h: 37 },
//   snake: { w: 112, h: 44.8 },
//   ridge: { w: 108, h: 43 },
//   capsicum: { w: 62, h: 62 },
//   okra: { w: 96, h: 38.4 },
//   chilli: { w: 100, h: 40 },
//   cabbage: { w: 64, h: 64 },
//   broccoli: { w: 64, h: 64 },
// };

// /* 1. ivy gourd (kovakkai): small, oval, green with light stripes */
// export const Kovakkai = ({ w = 84 }: { w?: number }) => (
//   <Svg width={w} height={w * 0.4} viewBox="0 0 90 36">
//     <Path d="M6 18 C6 9 20 6 45 6 C70 6 84 9 84 18 C84 27 70 30 45 30 C20 30 6 27 6 18Z" fill="#92d44f" {...ol} />
//     <Path d="M12 13 C30 9 60 9 78 13 M10 18 C30 17 60 17 80 18 M12 23 C30 27 60 27 78 23" stroke="#dff5b0" strokeWidth={2.2} fill="none" strokeLinecap="round" />
//     <Path d="M6 18 C2 18 1 15 2 12" stroke="#5f8f2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
//   </Svg>
// );

// /* 2. snake gourd: long, slender, green */
// export const SnakeGourd = ({ w = 112 }: { w?: number }) => (
//   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
//     <Path d="M6 26 C30 20 72 22 96 16 C106 13 113 10 117 5 C115 14 108 22 96 29 C72 40 30 40 6 35 C2 33 2 28 6 26Z" fill="#bfe3a0" {...ol} />
//     <Path d="M10 29 C36 26 72 27 102 16 M10 33 C36 34 72 34 98 24" stroke="#5a9a3e" strokeWidth={2.4} fill="none" strokeLinecap="round" />
//     <Path d="M6 30 C2 30 1 27 2 24" stroke="#5f8f2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
//   </Svg>
// );

// /* 3. ridge gourd: long green with ridges */
// export const RidgeGourd = ({ w = 108 }: { w?: number }) => (
//   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
//     <Path d="M8 22 C8 16 20 12 60 12 C100 12 116 16 116 25 C116 33 100 38 60 38 C20 38 8 32 8 22Z" fill="#6fae4b" {...ol} />
//     <Path d="M14 17 L110 19 M12 24 L114 26 M14 31 L108 32" stroke="#2f6a2a" strokeWidth={2.6} fill="none" strokeLinecap="round" />
//     <Path d="M30 15 L32 34 M56 14 L58 36 M82 15 L84 35" stroke="#9ad176" strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
//     <Path d="M8 22 C3 22 2 18 3 15" stroke="#5f8f2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
//   </Svg>
// );

// /* 4. pointed gourd (parwal): plump, pointed ends, pale stripes */
// export const PointedGourd = ({ w = 84 }: { w?: number }) => (
//   <Svg width={w} height={w * 0.44} viewBox="0 0 90 40">
//     <Path d="M3 20 C14 8 30 5 46 5 C62 5 76 8 87 20 C76 32 62 35 46 35 C30 35 14 32 3 20Z" fill="#5fb546" {...ol} />
//     <Path d="M10 20 C24 18 66 18 80 20" stroke="#d5efb5" strokeWidth={2.2} fill="none" strokeLinecap="round" />
//     <Path d="M16 12 C32 9 60 9 74 12 M16 28 C32 31 60 31 74 28" stroke="#d5efb5" strokeWidth={2.2} fill="none" strokeLinecap="round" />
//   </Svg>
// );

// /* other green vegetables (not cucumbers) */

// export const Capsicum = ({ w = 62 }: { w?: number }) => (
//   <Svg width={w} height={w} viewBox="0 0 70 70">
//     <Path d="M16 26 C16 14 28 12 35 18 C42 12 54 14 54 26 C58 40 52 58 35 61 C18 58 12 40 16 26Z" fill="#43b24e" {...ol} />
//     <Path d="M30 22 C26 36 28 50 33 58 M40 22 C44 36 42 50 37 58" stroke="#7fd986" strokeWidth={2.4} fill="none" strokeLinecap="round" />
//     <Path d="M35 18 C35 12 38 8 43 7" stroke="#2f7d2c" strokeWidth={4} fill="none" strokeLinecap="round" />
//   </Svg>
// );

// /* okra / ladies finger */
// export const Okra = ({ w = 96 }: { w?: number }) => (
//   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
//     <Path d="M18 14 C50 12 90 20 116 26 C90 34 50 38 18 34 C10 32 10 16 18 14Z" fill="#6cc24a" {...ol} />
//     <Path d="M24 18 C54 17 90 23 108 26 M24 30 C54 32 90 30 108 27" stroke="#2f8f3a" strokeWidth={2.2} fill="none" strokeLinecap="round" />
//     <Path d="M18 14 C12 12 8 8 6 4 M18 34 C12 36 8 40 6 44" stroke="#3d7d2a" strokeWidth={3} fill="none" strokeLinecap="round" />
//     <Path d="M18 14 L18 34" stroke="#3d7d2a" strokeWidth={4} strokeLinecap="round" />
//   </Svg>
// );

// /* green chilli */
// export const GreenChilli = ({ w = 100 }: { w?: number }) => (
//   <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
//     <Path d="M14 12 C44 8 94 18 116 40 C92 36 44 32 16 24 C8 22 8 14 14 12Z" fill="#34b43c" {...ol} />
//     <Path d="M24 14 C54 12 90 22 106 34" stroke="#8fe08f" strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.9} />
//     <Path d="M12 13 C8 9 6 7 3 5" stroke="#2f6d27" strokeWidth={4} fill="none" strokeLinecap="round" />
//   </Svg>
// );

// /* cabbage */
// export const Cabbage = ({ w = 64 }: { w?: number }) => (
//   <Svg width={w} height={w} viewBox="0 0 70 70">
//     <Ellipse cx={35} cy={37} rx={29} ry={27} fill="#9fdc7a" {...ol} />
//     <Path d="M35 10 C24 22 22 48 35 64 M35 10 C46 22 48 48 35 64" stroke="#5aa63f" strokeWidth={2.2} fill="none" strokeLinecap="round" />
//     <Path d="M12 30 C26 28 44 28 58 30 M14 46 C28 50 42 50 56 46" stroke="#5aa63f" strokeWidth={2.2} fill="none" strokeLinecap="round" />
//     <Path d="M20 20 C24 14 30 12 34 14" stroke="#d6f5bf" strokeWidth={3} fill="none" strokeLinecap="round" />
//   </Svg>
// );

// /* broccoli */
// export const Broccoli = ({ w = 64 }: { w?: number }) => (
//   <Svg width={w} height={w} viewBox="0 0 70 70">
//     <Path d="M29 66 L32 42 L40 42 L43 66 Z" fill="#9ccf6c" {...ol} />
//     <Circle cx={20} cy={34} r={13} fill="#2f9a3d" {...ol} />
//     <Circle cx={50} cy={34} r={13} fill="#2f9a3d" {...ol} />
//     <Circle cx={35} cy={22} r={15} fill="#37ad47" {...ol} />
//     <Circle cx={35} cy={38} r={12} fill="#2f9a3d" {...ol} />
//     <Circle cx={30} cy={18} r={2} fill="#7fdc8a" />
//     <Circle cx={42} cy={24} r={2} fill="#7fdc8a" />
//     <Circle cx={18} cy={32} r={2} fill="#7fdc8a" />
//     <Circle cx={52} cy={32} r={2} fill="#7fdc8a" />
//   </Svg>
// );

import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

const K = '#2b2b2b';
const ol = { stroke: K, strokeWidth: 2.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

// size of every vegetable picture on the board (width, height)
export const VEG_SIZE: Record<string, { w: number; h: number }> = {
  cucumber: { w: 112, h: 44.8 },
  kovakkai: { w: 84, h: 33.6 },
  pointed: { w: 84, h: 37 },
  snake: { w: 112, h: 44.8 },
  ridge: { w: 108, h: 43 },
  capsicum: { w: 62, h: 62 },
  okra: { w: 96, h: 38.4 },
  chilli: { w: 100, h: 40 },
  cabbage: { w: 64, h: 64 },
  broccoli: { w: 64, h: 64 },
  // added: these were missing and caused "Cannot read property 'w' of undefined"
  tomato: { w: 56, h: 56 },
  pumpkin: { w: 66, h: 56.6 },
  brinjal: { w: 90, h: 36 },
  carrot: { w: 90, h: 36 },
  onion: { w: 58, h: 58 },
};

/* 1. ivy gourd (kovakkai): small, oval, green with light stripes */
export const Kovakkai = ({ w = 84 }: { w?: number }) => (
  <Svg width={w} height={w * 0.4} viewBox="0 0 90 36">
    <Path d="M6 18 C6 9 20 6 45 6 C70 6 84 9 84 18 C84 27 70 30 45 30 C20 30 6 27 6 18Z" fill="#92d44f" {...ol} />
    <Path d="M12 13 C30 9 60 9 78 13 M10 18 C30 17 60 17 80 18 M12 23 C30 27 60 27 78 23" stroke="#dff5b0" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    <Path d="M6 18 C2 18 1 15 2 12" stroke="#5f8f2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
  </Svg>
);

/* 2. snake gourd: long, slender, green */
export const SnakeGourd = ({ w = 112 }: { w?: number }) => (
  <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
    <Path d="M6 26 C30 20 72 22 96 16 C106 13 113 10 117 5 C115 14 108 22 96 29 C72 40 30 40 6 35 C2 33 2 28 6 26Z" fill="#bfe3a0" {...ol} />
    <Path d="M10 29 C36 26 72 27 102 16 M10 33 C36 34 72 34 98 24" stroke="#5a9a3e" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    <Path d="M6 30 C2 30 1 27 2 24" stroke="#5f8f2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
  </Svg>
);

/* 3. ridge gourd: long green with ridges */
export const RidgeGourd = ({ w = 108 }: { w?: number }) => (
  <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
    <Path d="M8 22 C8 16 20 12 60 12 C100 12 116 16 116 25 C116 33 100 38 60 38 C20 38 8 32 8 22Z" fill="#6fae4b" {...ol} />
    <Path d="M14 17 L110 19 M12 24 L114 26 M14 31 L108 32" stroke="#2f6a2a" strokeWidth={2.6} fill="none" strokeLinecap="round" />
    <Path d="M30 15 L32 34 M56 14 L58 36 M82 15 L84 35" stroke="#9ad176" strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
    <Path d="M8 22 C3 22 2 18 3 15" stroke="#5f8f2a" strokeWidth={2.4} fill="none" strokeLinecap="round" />
  </Svg>
);

/* 4. pointed gourd (parwal): plump, pointed ends, pale stripes */
export const PointedGourd = ({ w = 84 }: { w?: number }) => (
  <Svg width={w} height={w * 0.44} viewBox="0 0 90 40">
    <Path d="M3 20 C14 8 30 5 46 5 C62 5 76 8 87 20 C76 32 62 35 46 35 C30 35 14 32 3 20Z" fill="#5fb546" {...ol} />
    <Path d="M10 20 C24 18 66 18 80 20" stroke="#d5efb5" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    <Path d="M16 12 C32 9 60 9 74 12 M16 28 C32 31 60 31 74 28" stroke="#d5efb5" strokeWidth={2.2} fill="none" strokeLinecap="round" />
  </Svg>
);

/* other green vegetables (not cucumbers) */

export const Capsicum = ({ w = 62 }: { w?: number }) => (
  <Svg width={w} height={w} viewBox="0 0 70 70">
    <Path d="M16 26 C16 14 28 12 35 18 C42 12 54 14 54 26 C58 40 52 58 35 61 C18 58 12 40 16 26Z" fill="#43b24e" {...ol} />
    <Path d="M30 22 C26 36 28 50 33 58 M40 22 C44 36 42 50 37 58" stroke="#7fd986" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    <Path d="M35 18 C35 12 38 8 43 7" stroke="#2f7d2c" strokeWidth={4} fill="none" strokeLinecap="round" />
  </Svg>
);

/* okra / ladies finger */
export const Okra = ({ w = 96 }: { w?: number }) => (
  <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
    <Path d="M18 14 C50 12 90 20 116 26 C90 34 50 38 18 34 C10 32 10 16 18 14Z" fill="#6cc24a" {...ol} />
    <Path d="M24 18 C54 17 90 23 108 26 M24 30 C54 32 90 30 108 27" stroke="#2f8f3a" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    <Path d="M18 14 C12 12 8 8 6 4 M18 34 C12 36 8 40 6 44" stroke="#3d7d2a" strokeWidth={3} fill="none" strokeLinecap="round" />
    <Path d="M18 14 L18 34" stroke="#3d7d2a" strokeWidth={4} strokeLinecap="round" />
  </Svg>
);

/* green chilli */
export const GreenChilli = ({ w = 100 }: { w?: number }) => (
  <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
    <Path d="M14 12 C44 8 94 18 116 40 C92 36 44 32 16 24 C8 22 8 14 14 12Z" fill="#34b43c" {...ol} />
    <Path d="M24 14 C54 12 90 22 106 34" stroke="#8fe08f" strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.9} />
    <Path d="M12 13 C8 9 6 7 3 5" stroke="#2f6d27" strokeWidth={4} fill="none" strokeLinecap="round" />
  </Svg>
);

/* cabbage */
export const Cabbage = ({ w = 64 }: { w?: number }) => (
  <Svg width={w} height={w} viewBox="0 0 70 70">
    <Ellipse cx={35} cy={37} rx={29} ry={27} fill="#9fdc7a" {...ol} />
    <Path d="M35 10 C24 22 22 48 35 64 M35 10 C46 22 48 48 35 64" stroke="#5aa63f" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    <Path d="M12 30 C26 28 44 28 58 30 M14 46 C28 50 42 50 56 46" stroke="#5aa63f" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    <Path d="M20 20 C24 14 30 12 34 14" stroke="#d6f5bf" strokeWidth={3} fill="none" strokeLinecap="round" />
  </Svg>
);

/* broccoli */
export const Broccoli = ({ w = 64 }: { w?: number }) => (
  <Svg width={w} height={w} viewBox="0 0 70 70">
    <Path d="M29 66 L32 42 L40 42 L43 66 Z" fill="#9ccf6c" {...ol} />
    <Circle cx={20} cy={34} r={13} fill="#2f9a3d" {...ol} />
    <Circle cx={50} cy={34} r={13} fill="#2f9a3d" {...ol} />
    <Circle cx={35} cy={22} r={15} fill="#37ad47" {...ol} />
    <Circle cx={35} cy={38} r={12} fill="#2f9a3d" {...ol} />
    <Circle cx={30} cy={18} r={2} fill="#7fdc8a" />
    <Circle cx={42} cy={24} r={2} fill="#7fdc8a" />
    <Circle cx={18} cy={32} r={2} fill="#7fdc8a" />
    <Circle cx={52} cy={32} r={2} fill="#7fdc8a" />
  </Svg>
);

/* ---------- added: non-green vegetables to confuse the player ---------- */

/* pumpkin: orange, ribbed, short stem */
export const Pumpkin = ({ w = 66 }: { w?: number }) => (
  <Svg width={w} height={(w * 60) / 70} viewBox="0 0 70 60">
    <Ellipse cx={35} cy={35} rx={30} ry={22} fill="#f59a2b" {...ol} />
    <Path d="M35 13 C24 21 24 49 35 57 M35 13 C46 21 46 49 35 57" stroke="#c96d12" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    <Path d="M19 18 C12 28 12 42 19 51 M51 18 C58 28 58 42 51 51" stroke="#c96d12" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    <Path d="M35 13 C35 8 37 5 41 3" stroke="#4f7d2a" strokeWidth={5} fill="none" strokeLinecap="round" />
  </Svg>
);

/* brinjal (eggplant): purple, green cap on the left */
export const Brinjal = ({ w = 90 }: { w?: number }) => (
  <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
    <Path d="M20 16 C50 8 96 14 116 28 C96 40 50 40 20 32 C12 30 12 18 20 16Z" fill="#6b3a8f" {...ol} />
    <Path d="M30 17 C56 13 86 18 104 26" stroke="#a67cc4" strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.85} />
    <Path d="M22 13 C14 13 12 19 12 24 C12 29 14 35 22 35 C25 28 25 20 22 13Z" fill="#4f9a3a" {...ol} />
    <Path d="M12 24 C7 24 4 22 2 18" stroke="#3d7d2a" strokeWidth={3} fill="none" strokeLinecap="round" />
  </Svg>
);

/* carrot: orange, pointed to the right, leaves on the left */
export const Carrot = ({ w = 90 }: { w?: number }) => (
  <Svg width={w} height={w * 0.4} viewBox="0 0 120 48">
    <Path d="M24 14 C60 12 100 22 118 28 C100 34 60 40 24 36 C16 34 16 16 24 14Z" fill="#f28a24" {...ol} />
    <Path d="M44 20 L50 24 M66 26 L72 30 M86 27 L91 29 M52 33 L58 31" stroke="#c96510" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    <Path d="M22 25 C14 18 8 14 3 12 M22 25 C14 25 8 25 2 25 M22 25 C14 32 8 36 3 38" stroke="#3fa33a" strokeWidth={4} fill="none" strokeLinecap="round" />
  </Svg>
);

/* onion: purple-pink bulb, sprout on top, small roots below */
export const Onion = ({ w = 58 }: { w?: number }) => (
  <Svg width={w} height={w} viewBox="0 0 70 70">
    <Path d="M35 14 C44 26 60 30 60 44 C60 56 48 63 35 63 C22 63 10 56 10 44 C10 30 26 26 35 14Z" fill="#c46fb3" {...ol} />
    <Path d="M35 18 C28 34 26 50 32 62 M35 18 C42 34 44 50 38 62" stroke="#8f3f82" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    <Path d="M35 14 C35 9 37 6 40 4" stroke="#4f9a3a" strokeWidth={4} fill="none" strokeLinecap="round" />
    <Path d="M30 64 L28 68 M35 64 L35 68 M40 64 L42 68" stroke="#7a5a3a" strokeWidth={2} fill="none" strokeLinecap="round" />
  </Svg>
);
