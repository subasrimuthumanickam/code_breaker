// // import React,{useCallback,useEffect,useState} from 'react';
// // import {View,Text,TouchableOpacity,ScrollView,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // import Svg,{Path} from 'react-native-svg';
// // import {getMap,openLevel,LevelMap,MapLevel} from './mapApi';

// // type Props={playerId:number;onBack:()=>void;onPlay:(n:number)=>void};

// // const GAP=118;          // vertical distance between level bubbles
// // const NODE=74;

// // function Stars({n}:{n:number}){
// //   return(
// //     <View style={{flexDirection:'row',position:'absolute',top:-16}}>
// //       {[0,1,2].map(i=><Text key={i} style={{fontSize:16,color:i<n?'#ffd23f':'#ffffff66'}}>★</Text>)}
// //     </View>
// //   );
// // }

// // export default function BTLevelMapScreen({playerId,onBack,onPlay}:Props){
// //   const {width}=useWindowDimensions();
// //   const W=Math.min(width,460);
// //   const [map,setMap]=useState<LevelMap|null>(null);
// //   const [msg,setMsg]=useState('');
// //   const [busy,setBusy]=useState(false);

// //   const load=useCallback(async()=>{
// //     try{setMap(await getMap(playerId));setMsg('');}
// //     catch(e:any){setMsg(e.message||'Could not load levels');}
// //   },[playerId]);
// //   useEffect(()=>{load();},[load]);

// //   const tap=async(l:MapLevel)=>{
// //     if(busy)return;
// //     if(l.status==='completed'){setMsg(`Level ${l.n} is completed and locked 🔒`);return;}
// //     if(l.status==='locked'){setMsg('Finish the earlier level first 🔒');return;}
// //     setBusy(true);
// //     try{await openLevel(playerId,l.n);onPlay(l.n);}   // backend confirms the level may be opened
// //     catch(e:any){setMsg(e.message||'Cannot open level');if(e.map)setMap(e.map);}
// //     finally{setBusy(false);}
// //   };

// //   if(!map)return(
// //     <View style={[st.root,{justifyContent:'center'}]}>
// //       {msg?<Text style={st.msg}>{msg}</Text>:<ActivityIndicator color="#fff" size="large"/>}
// //     </View>
// //   );

// //   // level 1 sits at the BOTTOM, path winds upward (like the mockup)
// //   const count=map.levels.length;
// //   const H=count*GAP+140;
// //   const pos=(i:number)=>({x:W/2+Math.sin(i*1.25)*(W*0.28),y:H-90-i*GAP});
// //   let d='';
// //   map.levels.forEach((_,i)=>{
// //     const p=pos(i);
// //     if(i===0)d+=`M${p.x} ${p.y}`;
// //     else{const q=pos(i-1);d+=` C${q.x} ${q.y-GAP*0.5} ${p.x} ${p.y+GAP*0.5} ${p.x} ${p.y}`;}
// //   });

// //   return(
// //     <View style={st.root}>
// //       <View style={[st.bar,{width:W}]}>
// //         <TouchableOpacity onPress={onBack} style={st.back}><Text style={st.backT}>‹</Text></TouchableOpacity>
// //         <Text style={st.head}>LEVELS</Text>
// //         <View style={{width:44}}/>
// //       </View>
// //       {!!msg&&<Text style={st.msg}>{msg}</Text>}
// //       <ScrollView contentOffset={{x:0,y:Math.max(0,H-700)}} showsVerticalScrollIndicator={false}>
// //         <View style={{width:W,height:H,alignSelf:'center'}}>
// //           <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
// //             <Path d={d} stroke="#0e7a3a" strokeWidth={30} fill="none" strokeLinecap="round"/>
// //             <Path d={d} stroke="#7be08d" strokeWidth={22} fill="none" strokeLinecap="round"/>
// //             <Path d={d} stroke="#c9f7cf" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="2 14"/>
// //           </Svg>
// //           {map.levels.map((l,i)=>{
// //             const p=pos(i);
// //             const done=l.status==='completed',cur=l.status==='current';
// //             const bg=done?'#ff8a3d':cur?'#2fb4ff':'#9aa3ad';
// //             return(
// //               <TouchableOpacity key={l.n} activeOpacity={0.8} onPress={()=>tap(l)}
// //                 style={[st.node,{left:p.x-NODE/2,top:p.y-NODE/2,backgroundColor:bg,borderColor:cur?'#fff':'#ffffffaa'}]}>
// //                 {done&&<Stars n={l.stars}/>}
// //                 <Text style={st.nodeT}>{l.n}</Text>
// //                 {(done||l.status==='locked')&&<Text style={st.lock}>🔒</Text>}
// //                 {cur&&<View style={st.here}><Text style={st.hereT}>PLAY</Text></View>}
// //               </TouchableOpacity>
// //             );
// //           })}
// //         </View>
// //       </ScrollView>
// //     </View>
// //   );
// // }

// // const st=StyleSheet.create({
// //   root:{flex:1,backgroundColor:'#43c466',alignItems:'center'},
// //   bar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:14,paddingVertical:12,backgroundColor:'#2a9d4e'},
// //   back:{width:44,height:44,borderRadius:22,backgroundColor:'#ffffff33',alignItems:'center',justifyContent:'center'},
// //   backT:{color:'#fff',fontSize:30,fontWeight:'900',marginTop:-4},
// //   head:{color:'#fff',fontSize:26,fontWeight:'900',letterSpacing:3},
// //   msg:{color:'#fff',backgroundColor:'#00000055',paddingHorizontal:14,paddingVertical:6,borderRadius:12,marginTop:8,fontWeight:'700',textAlign:'center'},
// //   node:{position:'absolute',width:NODE,height:NODE,borderRadius:NODE/2,borderWidth:4,alignItems:'center',justifyContent:'center',borderBottomWidth:7},
// //   nodeT:{color:'#fff',fontSize:30,fontWeight:'900'},
// //   lock:{position:'absolute',right:-6,bottom:-6,fontSize:18},
// //   here:{position:'absolute',bottom:-18,backgroundColor:'#ffd23f',paddingHorizontal:10,borderRadius:10},
// //   hereT:{color:'#7a4a00',fontWeight:'900',fontSize:12},
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

//   const tap = async (l: MapLevel) => {
//     if (busy) return;
//     if (l.status === 'completed') return showToast(`Level ${l.n} is completed and locked 🔒`);
//     if (l.status === 'locked') return showToast('Finish the earlier level first 🔒');
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
//             const locked = l.status === 'locked';
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
//                     backgroundColor: cur ? '#ff8a3d' : '#6b4a3a',
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
//                 {(locked || done) && (
//                   <View style={st.lock}><Text style={{ fontSize: 14 }}>🔒</Text></View>
//                 )}
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
//   lock: {
//     position: 'absolute', right: -10, bottom: -12, width: 28, height: 28, borderRadius: 8,
//     backgroundColor: '#ffb800', alignItems: 'center', justifyContent: 'center',
//   },
//   stars: { position: 'absolute', top: -20, flexDirection: 'row' },
//   pg: {
//     position: 'absolute', width: 46, height: 46, borderRadius: 23,
//     backgroundColor: '#b8561f', borderWidth: 3, borderColor: '#f3b27a',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   pgT: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: -3 },
// });
import React, { useCallback, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, ImageBackground, ScrollView,
  StyleSheet, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMap, openLevel, LevelMap, MapLevel } from './mapApi';
const BG = require('../../../assets/images.jpg');
const RATIO = 1661 / 947; // image height / width

// stone centres on the image (% of width / height), level 1 at the bottom
const POS = [
  { x: 47.7, y: 83.4 },
  { x: 69.2, y: 65.6 },
  { x: 68.1, y: 48.2 },
  { x: 44.9, y: 31.7 },
  { x: 26.1, y: 17.8 },
];
const PER_PAGE = POS.length;

type Props = { playerId: number; onBack: () => void; onPlay: (n: number) => void };

export default function BTLevelMapScreen({ playerId, onBack, onPlay }: Props) {
  const { width } = useWindowDimensions();
  const W = Math.min(width, 460);
  const H = W * RATIO;
  const STONE = W * 0.175;

  const [map, setMap] = useState<LevelMap | null>(null);
  const [page, setPage] = useState(0);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          setPage(Math.floor((m.currentLevel - 1) / PER_PAGE));
        })
        .catch((e: any) => alive && showToast(e.message || 'Could not load levels'));
      return () => { alive = false; };
    }, [playerId])
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

  const pages = Math.ceil(map.levels.length / PER_PAGE);
  const visible = map.levels.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <View style={st.root}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
        <ImageBackground source={BG} resizeMode="stretch" style={{ width: W, height: H }}>
          {/* back */}
          <TouchableOpacity onPress={onBack} style={[st.back, { top: H * 0.025, left: W * 0.04 }]}>
            <Text style={st.backT}>‹</Text>
          </TouchableOpacity>

          {/* wooden title */}
          <View style={[st.banner, { top: H * 0.02, left: W * 0.22, width: W * 0.56 }]}>
            <Text style={st.bannerT}>LEVELS</Text>
          </View>

          {/* toast */}
          {!!toast && (
            <View style={[st.toast, { top: H * 0.105, width: W * 0.84, left: W * 0.08 }]}>
              <Text style={st.toastT}>{toast}</Text>
            </View>
          )}

          {/* stones */}
          {visible.map((l, i) => {
            const p = POS[i];
            const soon = l.status === 'soon';
            const done = l.status === 'completed';
            const cur = l.status === 'current';
            return (
              <TouchableOpacity
                key={l.n}
                activeOpacity={0.85}
                onPress={() => tap(l)}
                style={[
                  st.stone,
                  {
                    width: STONE, height: STONE, borderRadius: STONE * 0.22,
                    left: (p.x / 100) * W - STONE / 2,
                    top: (p.y / 100) * H - STONE / 2,
                    backgroundColor: cur ? '#ff8a3d' : soon ? '#6b4a3a' : '#2f7fe0',
                    opacity: soon ? 0.85 : 1,
                  },
                ]}
              >
                {done && (
                  <View style={st.stars}>
                    {[0, 1, 2].map((s) => (
                      <Text key={s} style={{ fontSize: 15, color: s < l.stars ? '#ffd23f' : '#ffffff66' }}>★</Text>
                    ))}
                  </View>
                )}
                <Text style={[st.num, { fontSize: STONE * 0.45 }]}>{l.n}</Text>
              </TouchableOpacity>
            );
          })}

          {/* page arrows (levels 6+ use the same map) */}
          {pages > 1 && (
            <>
              {page > 0 && (
                <TouchableOpacity style={[st.pg, { left: W * 0.04, bottom: H * 0.06 }]} onPress={() => setPage(page - 1)}>
                  <Text style={st.pgT}>‹</Text>
                </TouchableOpacity>
              )}
              {page < pages - 1 && (
                <TouchableOpacity style={[st.pg, { right: W * 0.04, bottom: H * 0.06 }]} onPress={() => setPage(page + 1)}>
                  <Text style={st.pgT}>›</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2a9d4e' },
  back: {
    position: 'absolute', width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#b8561f', borderWidth: 3, borderColor: '#f3b27a',
    alignItems: 'center', justifyContent: 'center',
  },
  backT: { color: '#fff', fontSize: 34, fontWeight: '900', marginTop: -5 },
  banner: {
    position: 'absolute', paddingVertical: 8, borderRadius: 12,
    backgroundColor: '#a8581f', borderWidth: 3, borderColor: '#7a3a10', alignItems: 'center',
  },
  bannerT: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: 2 },
  toast: {
    position: 'absolute', paddingVertical: 10, borderRadius: 30,
    backgroundColor: 'rgba(45,25,10,0.92)', borderWidth: 2, borderColor: '#8a6a45', zIndex: 5,
  },
  toastT: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
  stone: {
    position: 'absolute', borderWidth: 4, borderColor: '#f4f4f4',
    borderBottomWidth: 9, borderBottomColor: '#d6d6d6',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  num: { color: '#fff', fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 0 },
  stars: { position: 'absolute', top: -20, flexDirection: 'row' },
  pg: {
    position: 'absolute', width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#b8561f', borderWidth: 3, borderColor: '#f3b27a',
    alignItems: 'center', justifyContent: 'center',
  },
  pgT: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: -3 },
});