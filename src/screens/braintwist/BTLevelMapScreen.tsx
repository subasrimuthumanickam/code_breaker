// // // import React,{useCallback,useEffect,useState} from 'react';
// // // import {View,Text,TouchableOpacity,ScrollView,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // // import Svg,{Path} from 'react-native-svg';
// // // import {getMap,openLevel,LevelMap,MapLevel} from './mapApi';

// // // type Props={playerId:number;onBack:()=>void;onPlay:(n:number)=>void};

// // // const GAP=118;          // vertical distance between level bubbles
// // // const NODE=74;

// // // function Stars({n}:{n:number}){
// // //   return(
// // //     <View style={{flexDirection:'row',position:'absolute',top:-16}}>
// // //       {[0,1,2].map(i=><Text key={i} style={{fontSize:16,color:i<n?'#ffd23f':'#ffffff66'}}>★</Text>)}
// // //     </View>
// // //   );
// // // }

// // // export default function BTLevelMapScreen({playerId,onBack,onPlay}:Props){
// // //   const {width}=useWindowDimensions();
// // //   const W=Math.min(width,460);
// // //   const [map,setMap]=useState<LevelMap|null>(null);
// // //   const [msg,setMsg]=useState('');
// // //   const [busy,setBusy]=useState(false);

// // //   const load=useCallback(async()=>{
// // //     try{setMap(await getMap(playerId));setMsg('');}
// // //     catch(e:any){setMsg(e.message||'Could not load levels');}
// // //   },[playerId]);
// // //   useEffect(()=>{load();},[load]);

// // //   const tap=async(l:MapLevel)=>{
// // //     if(busy)return;
// // //     if(l.status==='completed'){setMsg(`Level ${l.n} is completed and locked 🔒`);return;}
// // //     if(l.status==='locked'){setMsg('Finish the earlier level first 🔒');return;}
// // //     setBusy(true);
// // //     try{await openLevel(playerId,l.n);onPlay(l.n);}   // backend confirms the level may be opened
// // //     catch(e:any){setMsg(e.message||'Cannot open level');if(e.map)setMap(e.map);}
// // //     finally{setBusy(false);}
// // //   };

// // //   if(!map)return(
// // //     <View style={[st.root,{justifyContent:'center'}]}>
// // //       {msg?<Text style={st.msg}>{msg}</Text>:<ActivityIndicator color="#fff" size="large"/>}
// // //     </View>
// // //   );

// // //   // level 1 sits at the BOTTOM, path winds upward (like the mockup)
// // //   const count=map.levels.length;
// // //   const H=count*GAP+140;
// // //   const pos=(i:number)=>({x:W/2+Math.sin(i*1.25)*(W*0.28),y:H-90-i*GAP});
// // //   let d='';
// // //   map.levels.forEach((_,i)=>{
// // //     const p=pos(i);
// // //     if(i===0)d+=`M${p.x} ${p.y}`;
// // //     else{const q=pos(i-1);d+=` C${q.x} ${q.y-GAP*0.5} ${p.x} ${p.y+GAP*0.5} ${p.x} ${p.y}`;}
// // //   });

// // //   return(
// // //     <View style={st.root}>
// // //       <View style={[st.bar,{width:W}]}>
// // //         <TouchableOpacity onPress={onBack} style={st.back}><Text style={st.backT}>‹</Text></TouchableOpacity>
// // //         <Text style={st.head}>LEVELS</Text>
// // //         <View style={{width:44}}/>
// // //       </View>
// // //       {!!msg&&<Text style={st.msg}>{msg}</Text>}
// // //       <ScrollView contentOffset={{x:0,y:Math.max(0,H-700)}} showsVerticalScrollIndicator={false}>
// // //         <View style={{width:W,height:H,alignSelf:'center'}}>
// // //           <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
// // //             <Path d={d} stroke="#0e7a3a" strokeWidth={30} fill="none" strokeLinecap="round"/>
// // //             <Path d={d} stroke="#7be08d" strokeWidth={22} fill="none" strokeLinecap="round"/>
// // //             <Path d={d} stroke="#c9f7cf" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="2 14"/>
// // //           </Svg>
// // //           {map.levels.map((l,i)=>{
// // //             const p=pos(i);
// // //             const done=l.status==='completed',cur=l.status==='current';
// // //             const bg=done?'#ff8a3d':cur?'#2fb4ff':'#9aa3ad';
// // //             return(
// // //               <TouchableOpacity key={l.n} activeOpacity={0.8} onPress={()=>tap(l)}
// // //                 style={[st.node,{left:p.x-NODE/2,top:p.y-NODE/2,backgroundColor:bg,borderColor:cur?'#fff':'#ffffffaa'}]}>
// // //                 {done&&<Stars n={l.stars}/>}
// // //                 <Text style={st.nodeT}>{l.n}</Text>
// // //                 {(done||l.status==='locked')&&<Text style={st.lock}>🔒</Text>}
// // //                 {cur&&<View style={st.here}><Text style={st.hereT}>PLAY</Text></View>}
// // //               </TouchableOpacity>
// // //             );
// // //           })}
// // //         </View>
// // //       </ScrollView>
// // //     </View>
// // //   );
// // // }

// // // const st=StyleSheet.create({
// // //   root:{flex:1,backgroundColor:'#43c466',alignItems:'center'},
// // //   bar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:14,paddingVertical:12,backgroundColor:'#2a9d4e'},
// // //   back:{width:44,height:44,borderRadius:22,backgroundColor:'#ffffff33',alignItems:'center',justifyContent:'center'},
// // //   backT:{color:'#fff',fontSize:30,fontWeight:'900',marginTop:-4},
// // //   head:{color:'#fff',fontSize:26,fontWeight:'900',letterSpacing:3},
// // //   msg:{color:'#fff',backgroundColor:'#00000055',paddingHorizontal:14,paddingVertical:6,borderRadius:12,marginTop:8,fontWeight:'700',textAlign:'center'},
// // //   node:{position:'absolute',width:NODE,height:NODE,borderRadius:NODE/2,borderWidth:4,alignItems:'center',justifyContent:'center',borderBottomWidth:7},
// // //   nodeT:{color:'#fff',fontSize:30,fontWeight:'900'},
// // //   lock:{position:'absolute',right:-6,bottom:-6,fontSize:18},
// // //   here:{position:'absolute',bottom:-18,backgroundColor:'#ffd23f',paddingHorizontal:10,borderRadius:10},
// // //   hereT:{color:'#7a4a00',fontWeight:'900',fontSize:12},
// // // });
// // import React, { useCallback, useRef, useState } from 'react';
// // import {
// //   View, Text, TouchableOpacity, ImageBackground, ScrollView,
// //   StyleSheet, ActivityIndicator, useWindowDimensions,
// // } from 'react-native';
// // import { useFocusEffect } from '@react-navigation/native';
// // import { getMap, openLevel, LevelMap, MapLevel } from './mapApi';
// // const BG = require('../../../assets/images.jpg');
// // const RATIO = 1661 / 947; // image height / width

// // // stone centres on the image (% of width / height), level 1 at the bottom
// // const POS = [
// //   { x: 47.7, y: 83.4 },
// //   { x: 69.2, y: 65.6 },
// //   { x: 68.1, y: 48.2 },
// //   { x: 44.9, y: 31.7 },
// //   { x: 26.1, y: 17.8 },
// // ];
// // const PER_PAGE = POS.length;

// // type Props = { playerId: number; onBack: () => void; onPlay: (n: number) => void };

// // export default function BTLevelMapScreen({ playerId, onBack, onPlay }: Props) {
// //   const { width } = useWindowDimensions();
// //   const W = Math.min(width, 460);
// //   const H = W * RATIO;
// //   const STONE = W * 0.175;

// //   const [map, setMap] = useState<LevelMap | null>(null);
// //   const [page, setPage] = useState(0);
// //   const [toast, setToast] = useState('');
// //   const [busy, setBusy] = useState(false);
// //   const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

// //   const showToast = (m: string) => {
// //     setToast(m);
// //     if (timer.current) clearTimeout(timer.current);
// //     timer.current = setTimeout(() => setToast(''), 2400);
// //   };

// //   // runs every time this screen comes into focus (after winning a level too)
// //   useFocusEffect(
// //     useCallback(() => {
// //       let alive = true;
// //       getMap(playerId)
// //         .then((m) => {
// //           if (!alive) return;
// //           setMap(m);
// //           setPage(Math.floor((m.currentLevel - 1) / PER_PAGE));
// //         })
// //         .catch((e: any) => alive && showToast(e.message || 'Could not load levels'));
// //       return () => { alive = false; };
// //     }, [playerId])
// //   );

// //   const tap = async (l: MapLevel) => {
// //     if (busy) return;
// //     if (l.status === 'completed') return showToast(`Level ${l.n} is completed and locked 🔒`);
// //     if (l.status === 'locked') return showToast('Finish the earlier level first 🔒');
// //     setBusy(true);
// //     try {
// //       await openLevel(playerId, l.n); // backend confirms
// //       onPlay(l.n);
// //     } catch (e: any) {
// //       showToast(e.message || 'Cannot open level');
// //       if (e.map) setMap(e.map);
// //     } finally {
// //       setBusy(false);
// //     }
// //   };

// //   if (!map) {
// //     return (
// //       <View style={[st.root, { justifyContent: 'center', alignItems: 'center' }]}>
// //         <ActivityIndicator size="large" color="#fff" />
// //       </View>
// //     );
// //   }

// //   const pages = Math.ceil(map.levels.length / PER_PAGE);
// //   const visible = map.levels.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

// //   return (
// //     <View style={st.root}>
// //       <ScrollView contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
// //         <ImageBackground source={BG} resizeMode="stretch" style={{ width: W, height: H }}>
// //           {/* back */}
// //           <TouchableOpacity onPress={onBack} style={[st.back, { top: H * 0.025, left: W * 0.04 }]}>
// //             <Text style={st.backT}>‹</Text>
// //           </TouchableOpacity>

// //           {/* wooden title */}
// //           <View style={[st.banner, { top: H * 0.02, left: W * 0.22, width: W * 0.56 }]}>
// //             <Text style={st.bannerT}>LEVELS</Text>
// //           </View>

// //           {/* toast */}
// //           {!!toast && (
// //             <View style={[st.toast, { top: H * 0.105, width: W * 0.84, left: W * 0.08 }]}>
// //               <Text style={st.toastT}>{toast}</Text>
// //             </View>
// //           )}

// //           {/* stones */}
// //           {visible.map((l, i) => {
// //             const p = POS[i];
// //             const locked = l.status === 'locked';
// //             const done = l.status === 'completed';
// //             const cur = l.status === 'current';
// //             return (
// //               <TouchableOpacity
// //                 key={l.n}
// //                 activeOpacity={0.85}
// //                 onPress={() => tap(l)}
// //                 style={[
// //                   st.stone,
// //                   {
// //                     width: STONE, height: STONE, borderRadius: STONE * 0.22,
// //                     left: (p.x / 100) * W - STONE / 2,
// //                     top: (p.y / 100) * H - STONE / 2,
// //                     backgroundColor: cur ? '#ff8a3d' : '#6b4a3a',
// //                   },
// //                 ]}
// //               >
// //                 {done && (
// //                   <View style={st.stars}>
// //                     {[0, 1, 2].map((s) => (
// //                       <Text key={s} style={{ fontSize: 15, color: s < l.stars ? '#ffd23f' : '#ffffff66' }}>★</Text>
// //                     ))}
// //                   </View>
// //                 )}
// //                 <Text style={[st.num, { fontSize: STONE * 0.45 }]}>{l.n}</Text>
// //                 {(locked || done) && (
// //                   <View style={st.lock}><Text style={{ fontSize: 14 }}>🔒</Text></View>
// //                 )}
// //               </TouchableOpacity>
// //             );
// //           })}

// //           {/* page arrows (levels 6+ use the same map) */}
// //           {pages > 1 && (
// //             <>
// //               {page > 0 && (
// //                 <TouchableOpacity style={[st.pg, { left: W * 0.04, bottom: H * 0.06 }]} onPress={() => setPage(page - 1)}>
// //                   <Text style={st.pgT}>‹</Text>
// //                 </TouchableOpacity>
// //               )}
// //               {page < pages - 1 && (
// //                 <TouchableOpacity style={[st.pg, { right: W * 0.04, bottom: H * 0.06 }]} onPress={() => setPage(page + 1)}>
// //                   <Text style={st.pgT}>›</Text>
// //                 </TouchableOpacity>
// //               )}
// //             </>
// //           )}
// //         </ImageBackground>
// //       </ScrollView>
// //     </View>
// //   );
// // }

// // const st = StyleSheet.create({
// //   root: { flex: 1, backgroundColor: '#2a9d4e' },
// //   back: {
// //     position: 'absolute', width: 52, height: 52, borderRadius: 26,
// //     backgroundColor: '#b8561f', borderWidth: 3, borderColor: '#f3b27a',
// //     alignItems: 'center', justifyContent: 'center',
// //   },
// //   backT: { color: '#fff', fontSize: 34, fontWeight: '900', marginTop: -5 },
// //   banner: {
// //     position: 'absolute', paddingVertical: 8, borderRadius: 12,
// //     backgroundColor: '#a8581f', borderWidth: 3, borderColor: '#7a3a10', alignItems: 'center',
// //   },
// //   bannerT: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: 2 },
// //   toast: {
// //     position: 'absolute', paddingVertical: 10, borderRadius: 30,
// //     backgroundColor: 'rgba(45,25,10,0.92)', borderWidth: 2, borderColor: '#8a6a45', zIndex: 5,
// //   },
// //   toastT: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
// //   stone: {
// //     position: 'absolute', borderWidth: 4, borderColor: '#f4f4f4',
// //     borderBottomWidth: 9, borderBottomColor: '#d6d6d6',
// //     alignItems: 'center', justifyContent: 'center',
// //     shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 6,
// //   },
// //   num: { color: '#fff', fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 0 },
// //   lock: {
// //     position: 'absolute', right: -10, bottom: -12, width: 28, height: 28, borderRadius: 8,
// //     backgroundColor: '#ffb800', alignItems: 'center', justifyContent: 'center',
// //   },
// //   stars: { position: 'absolute', top: -20, flexDirection: 'row' },
// //   pg: {
// //     position: 'absolute', width: 46, height: 46, borderRadius: 23,
// //     backgroundColor: '#b8561f', borderWidth: 3, borderColor: '#f3b27a',
// //     alignItems: 'center', justifyContent: 'center',
// //   },
// //   pgT: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: -3 },
// // });
// import React, { useCallback, useRef, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, ImageBackground, ScrollView,
//   StyleSheet, ActivityIndicator, useWindowDimensions,
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { getMap, openLevel, LevelMap, MapLevel } from './mapApi';
// const BG = require('../../../assets/images.jpg');
// const RATIO = 1661 / 947; // image height / width

// // stone centres on the image (% of width / height), level 1 at the bottom
// const POS = [
//   { x: 47.7, y: 83.4 },
//   { x: 69.2, y: 65.6 },
//   { x: 68.1, y: 48.2 },
//   { x: 44.9, y: 31.7 },
//   { x: 26.1, y: 17.8 },
// ];
// const PER_PAGE = POS.length;

// type Props = { playerId: number; onBack: () => void; onPlay: (n: number) => void };

// export default function BTLevelMapScreen({ playerId, onBack, onPlay }: Props) {
//   const { width } = useWindowDimensions();
//   const W = Math.min(width, 460);
//   const H = W * RATIO;
//   const STONE = W * 0.175;

//   const [map, setMap] = useState<LevelMap | null>(null);
//   const [page, setPage] = useState(0);
//   const [toast, setToast] = useState('');
//   const [busy, setBusy] = useState(false);
//   const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const showToast = (m: string) => {
//     setToast(m);
//     if (timer.current) clearTimeout(timer.current);
//     timer.current = setTimeout(() => setToast(''), 2400);
//   };

//   // runs every time this screen comes into focus (after winning a level too)
//   useFocusEffect(
//     useCallback(() => {
//       let alive = true;
//       getMap(playerId)
//         .then((m) => {
//           if (!alive) return;
//           setMap(m);
//           setPage(Math.floor((m.currentLevel - 1) / PER_PAGE));
//         })
//         .catch((e: any) => alive && showToast(e.message || 'Could not load levels'));
//       return () => { alive = false; };
//     }, [playerId])
//   );

//   // no level is locked: any built level can be opened
//   const tap = async (l: MapLevel) => {
//     if (busy) return;
//     if (l.status === 'soon') return showToast('Coming soon!');
//     setBusy(true);
//     try {
//       await openLevel(playerId, l.n); // backend confirms
//       onPlay(l.n);
//     } catch (e: any) {
//       showToast(e.message || 'Cannot open level');
//       if (e.map) setMap(e.map);
//     } finally {
//       setBusy(false);
//     }
//   };

//   if (!map) {
//     return (
//       <View style={[st.root, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color="#fff" />
//       </View>
//     );
//   }

//   const pages = Math.ceil(map.levels.length / PER_PAGE);
//   const visible = map.levels.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

//   return (
//     <View style={st.root}>
//       <ScrollView contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
//         <ImageBackground source={BG} resizeMode="stretch" style={{ width: W, height: H }}>
//           {/* back */}
//           <TouchableOpacity onPress={onBack} style={[st.back, { top: H * 0.025, left: W * 0.04 }]}>
//             <Text style={st.backT}>‹</Text>
//           </TouchableOpacity>

//           {/* wooden title */}
//           <View style={[st.banner, { top: H * 0.02, left: W * 0.22, width: W * 0.56 }]}>
//             <Text style={st.bannerT}>LEVELS</Text>
//           </View>

//           {/* toast */}
//           {!!toast && (
//             <View style={[st.toast, { top: H * 0.105, width: W * 0.84, left: W * 0.08 }]}>
//               <Text style={st.toastT}>{toast}</Text>
//             </View>
//           )}

//           {/* stones */}
//           {visible.map((l, i) => {
//             const p = POS[i];
//             const soon = l.status === 'soon';
//             const done = l.status === 'completed';
//             const cur = l.status === 'current';
//             return (
//               <TouchableOpacity
//                 key={l.n}
//                 activeOpacity={0.85}
//                 onPress={() => tap(l)}
//                 style={[
//                   st.stone,
//                   {
//                     width: STONE, height: STONE, borderRadius: STONE * 0.22,
//                     left: (p.x / 100) * W - STONE / 2,
//                     top: (p.y / 100) * H - STONE / 2,
//                     backgroundColor: cur ? '#ff8a3d' : soon ? '#6b4a3a' : '#2f7fe0',
//                     opacity: soon ? 0.85 : 1,
//                   },
//                 ]}
//               >
//                 {done && (
//                   <View style={st.stars}>
//                     {[0, 1, 2].map((s) => (
//                       <Text key={s} style={{ fontSize: 15, color: s < l.stars ? '#ffd23f' : '#ffffff66' }}>★</Text>
//                     ))}
//                   </View>
//                 )}
//                 <Text style={[st.num, { fontSize: STONE * 0.45 }]}>{l.n}</Text>
//               </TouchableOpacity>
//             );
//           })}

//           {/* page arrows (levels 6+ use the same map) */}
//           {pages > 1 && (
//             <>
//               {page > 0 && (
//                 <TouchableOpacity style={[st.pg, { left: W * 0.04, bottom: H * 0.06 }]} onPress={() => setPage(page - 1)}>
//                   <Text style={st.pgT}>‹</Text>
//                 </TouchableOpacity>
//               )}
//               {page < pages - 1 && (
//                 <TouchableOpacity style={[st.pg, { right: W * 0.04, bottom: H * 0.06 }]} onPress={() => setPage(page + 1)}>
//                   <Text style={st.pgT}>›</Text>
//                 </TouchableOpacity>
//               )}
//             </>
//           )}
//         </ImageBackground>
//       </ScrollView>
//     </View>
//   );
// }

// const st = StyleSheet.create({
//   root: { flex: 1, backgroundColor: '#2a9d4e' },
//   back: {
//     position: 'absolute', width: 52, height: 52, borderRadius: 26,
//     backgroundColor: '#b8561f', borderWidth: 3, borderColor: '#f3b27a',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   backT: { color: '#fff', fontSize: 34, fontWeight: '900', marginTop: -5 },
//   banner: {
//     position: 'absolute', paddingVertical: 8, borderRadius: 12,
//     backgroundColor: '#a8581f', borderWidth: 3, borderColor: '#7a3a10', alignItems: 'center',
//   },
//   bannerT: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: 2 },
//   toast: {
//     position: 'absolute', paddingVertical: 10, borderRadius: 30,
//     backgroundColor: 'rgba(45,25,10,0.92)', borderWidth: 2, borderColor: '#8a6a45', zIndex: 5,
//   },
//   toastT: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
//   stone: {
//     position: 'absolute', borderWidth: 4, borderColor: '#f4f4f4',
//     borderBottomWidth: 9, borderBottomColor: '#d6d6d6',
//     alignItems: 'center', justifyContent: 'center',
//     shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 6,
//   },
//   num: { color: '#fff', fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 0 },
//   stars: { position: 'absolute', top: -20, flexDirection: 'row' },
//   pg: {
//     position: 'absolute', width: 46, height: 46, borderRadius: 23,
//     backgroundColor: '#b8561f', borderWidth: 3, borderColor: '#f3b27a',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   pgT: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: -3 },
// });
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, ImageBackground, ScrollView, Animated,
  StyleSheet, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMap, openLevel, LevelMap, MapLevel } from './mapApi';

// clean map picture (the old number bubbles are removed from it)
const BG = require('../../../assets/levels_map.jpg');
const RATIO = 1536 / 1024; // image height / width

// [x, y, size] of every level bubble as a fraction of the image.
// Index 0 = level 1 (bottom, next to START), last = the castle level at the top.
const POS: [number, number, number][] = [
  [0.5010, 0.8711, 0.1152],
  [0.6543, 0.8255, 0.0879],
  [0.5264, 0.7852, 0.0918],
  [0.3779, 0.7721, 0.0889],
  [0.3613, 0.7142, 0.0811],
  [0.4834, 0.6641, 0.0762],
  [0.6133, 0.6576, 0.0742],
  [0.7285, 0.6777, 0.0742],
  [0.3193, 0.5788, 0.0771],
  [0.4521, 0.5840, 0.0742],
  [0.5723, 0.5898, 0.0723],
  [0.6992, 0.5983, 0.0752],
  [0.8105, 0.5762, 0.0762],
  [0.7500, 0.5169, 0.0762],
  [0.6240, 0.5091, 0.0752],
  [0.4863, 0.5182, 0.0752],
  [0.3438, 0.5156, 0.0762],
  [0.2910, 0.4701, 0.0801],
  [0.3975, 0.4271, 0.0771],
  [0.5342, 0.4323, 0.0771],
  [0.6650, 0.4382, 0.0752],
  [0.7812, 0.4290, 0.0771],
  [0.7383, 0.3724, 0.0762],
  [0.6006, 0.3652, 0.0762],
  [0.4512, 0.3704, 0.0752],
  [0.2969, 0.3783, 0.0732],
  [0.2373, 0.3307, 0.0732],
  [0.3486, 0.3125, 0.0723],
  [0.4668, 0.3086, 0.0732],
  [0.5938, 0.3073, 0.0742],
  [0.7275, 0.2982, 0.0742],
  [0.7061, 0.2428, 0.0732],
  [0.5850, 0.2448, 0.0723],
  [0.4570, 0.2461, 0.0723],
  [0.3281, 0.2480, 0.0723],
  [0.2363, 0.2194, 0.0723],
  [0.3262, 0.1764, 0.0713],
  [0.4375, 0.1699, 0.0713],
  [0.5469, 0.1777, 0.0723],
  [0.6543, 0.1777, 0.0732],
  [0.7637, 0.1432, 0.0977],
];

type Props = { playerId: number; onBack: () => void; onPlay: (n: number) => void };

export default function BTLevelMapScreen({ playerId, onBack, onPlay }: Props) {
  const { width, height } = useWindowDimensions();
  const W = Math.min(width, 460);
  const H = W * RATIO;

  const [map, setMap] = useState<LevelMap | null>(null);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scroller = useRef<ScrollView>(null);
  const pulse = useRef(new Animated.Value(0)).current;

  // the current level gently pulses
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const showToast = (m: string) => {
    setToast(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2400);
  };

  // runs every time this screen comes into focus (after winning a level too)
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      getMap(playerId)
        .then((m) => {
          if (!alive) return;
          setMap(m);
          // scroll so the current level is in the middle of the screen
          const idx = Math.min(Math.max(m.currentLevel, 1), POS.length) - 1;
          setTimeout(() => {
            scroller.current?.scrollTo({ y: Math.max(0, POS[idx][1] * H - height * 0.45), animated: false });
          }, 80);
        })
        .catch((e: any) => alive && showToast(e.message || 'Could not load levels'));
      return () => { alive = false; };
    }, [playerId, H, height])
  );

  // no level is locked: any built level can be opened
  const tap = async (l: MapLevel) => {
    if (busy) return;
    if (l.status === 'soon') return showToast('Coming soon!');
    setBusy(true);
    try {
      await openLevel(playerId, l.n); // backend confirms
      onPlay(l.n);
    } catch (e: any) {
      showToast(e.message || 'Cannot open level');
      if (e.map) setMap(e.map);
    } finally {
      setBusy(false);
    }
  };

  if (!map) {
    return (
      <View style={[st.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const visible = map.levels.slice(0, POS.length);
  const earned = map.levels.reduce((sum, l) => sum + (l.stars || 0), 0);
  const maxStars = Math.max(1, map.total) * 3;

  const bubble = (l: MapLevel, i: number) => {
    const [fx, fy, fs] = POS[i];
    const S = Math.max(36, fs * W * 1.12);
    const bodyH = S * 0.8;
    const soon = l.status === 'soon';
    const done = l.status === 'completed';
    const cur = l.status === 'current';
    const last = i === POS.length - 1;

    let bg = '#1f9d3a';
    let edge = '#0f6b22';
    if (soon) { bg = '#5f8f66'; edge = '#3f6a46'; }
    if (last && !soon) { bg = '#ffb300'; edge = '#c77f00'; }
    if (cur) { bg = '#ff9a1f'; edge = '#c2610a'; }

    const scale = cur
      ? pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] })
      : 1;

    return (
      <TouchableOpacity
        key={l.n}
        activeOpacity={0.85}
        onPress={() => tap(l)}
        hitSlop={{ top: 8, bottom: 14, left: 8, right: 8 }}
        style={{
          position: 'absolute',
          width: S,
          height: bodyH + S * 0.3,
          left: fx * W - S / 2,
          top: fy * H - bodyH / 2,
        }}
      >
        <Animated.View
          style={{
            width: S,
            height: bodyH,
            borderRadius: S * 0.4,
            backgroundColor: bg,
            borderWidth: 3,
            borderColor: '#fffbe6',
            borderBottomWidth: 5,
            borderBottomColor: edge,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: soon ? 0.85 : 1,
            transform: [{ scale }],
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
          }}
        >
          <Text style={[st.num, { fontSize: S * 0.42 }]}>{l.n}</Text>
        </Animated.View>

        {done && (
          <View style={[st.starRow, { top: bodyH - 3 }]}>
            {[0, 1, 2].map((s) => (
              <Text key={s} style={{ fontSize: S * 0.28, color: s < l.stars ? '#ffd23f' : '#ffffff88' }}>★</Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={st.root}>
      <ScrollView
        ref={scroller}
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground source={BG} resizeMode="stretch" style={{ width: W, height: H }}>
          {/* back: transparent button on top of the arrow drawn in the picture */}
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            style={{ position: 'absolute', left: W * 0.024, top: H * 0.056 - W * 0.06, width: W * 0.12, height: W * 0.12, borderRadius: W * 0.06 }}
          />

          {/* star counter (covers the old 50/50 badge) */}
          <View
            style={[
              st.badge,
              { left: W * 0.772, top: H * 0.017, width: W * 0.222, height: H * 0.056 },
            ]}
          >
            <Text style={st.badgeStar}>★</Text>
            <Text style={st.badgeT}>{earned}/{maxStars}</Text>
          </View>

          {/* toast */}
          {!!toast && (
            <View style={[st.toast, { top: H * 0.1, width: W * 0.84, left: W * 0.08 }]}>
              <Text style={st.toastT}>{toast}</Text>
            </View>
          )}

          {/* level bubbles */}
          {visible.map((l, i) => bubble(l, i))}
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2a9d4e' },
  badge: {
    position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: '#a85a1c', borderWidth: 3, borderColor: '#6b3510', borderRadius: 12,
  },
  badgeStar: { color: '#ffd23f', fontSize: 20, fontWeight: '900' },
  badgeT: { color: '#fff', fontSize: 16, fontWeight: '900' },
  toast: {
    position: 'absolute', paddingVertical: 10, borderRadius: 30,
    backgroundColor: 'rgba(45,25,10,0.92)', borderWidth: 2, borderColor: '#8a6a45', zIndex: 5,
  },
  toastT: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
  num: {
    color: '#fff', fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 1,
  },
  starRow: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
});