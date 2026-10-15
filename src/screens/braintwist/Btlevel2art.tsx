// // // // // src/screens/braintwist/BTLevel2Art.tsx
// // // // // Chalkboard drawings for level 2 (react-native-svg)
// // // // import React,{useEffect,useRef} from 'react';
// // // // import {View,Animated,Easing,StyleSheet} from 'react-native';
// // // // import Svg,{Defs,RadialGradient,Stop,Circle,Path,Rect,Ellipse,G,Polygon,Line} from 'react-native-svg';

// // // // export type Phase='blurred'|'outline'|'colored';

// // // // /* =========================================================
// // // //    FLOWER GEOMETRY  (viewBox 300 x 400)
// // // // ========================================================= */

// // // // // outline of the 5 petals joined together
// // // // const PETALS='M100.1 71.3 A50 50 0 0 1 199.9 71.3 A50 50 0 0 1 230.8 166.2 A50 50 0 0 1 150.0 224.9 A50 50 0 0 1 69.2 166.2 A50 50 0 0 1 100.1 71.3 Z';
// // // // const PETAL_CENTERS=[[150,74],[212.8,119.6],[188.8,193.4],[111.2,193.4],[87.2,119.6]];
// // // // const PETAL_COLORS=['#ff79b0','#ff8ec0','#ff6aa8','#ff8ec0','#ff79b0'];
// // // // const STEM='M150 232 L150 372';
// // // // const LEAF_L='M150 372 C100 372 62 340 56 292 C108 292 146 322 150 372 Z';
// // // // const LEAF_R='M150 372 C200 372 238 340 244 292 C192 292 154 322 150 372 Z';

// // // // // soft dust blobs: a smudge on the board, it must not look like a flower
// // // // const DUST=[[150,130,86],[105,168,64],[196,176,70],[150,236,58],[118,92,50],[190,96,54],[150,330,44],[96,300,34]];

// // // // const AnimatedPath=Animated.createAnimatedComponent(Path);
// // // // const CHALK='#ffffff';

// // // // /* =========================================================
// // // //    CHALK FLOWER
// // // //    blurred -> outline : smudge fades, lines are drawn
// // // //    outline -> colored : parts get painted one by one
// // // // ========================================================= */

// // // // export function ChalkFlower({phase,width}:{phase:Phase;width:number}){
// // // //   const height=width*4/3;
// // // //   const smudge=useRef(new Animated.Value(phase==='blurred'?1:0)).current;
// // // //   const draw=useRef(new Animated.Value(phase==='blurred'?0:1)).current;
// // // //   const paint=useRef(Array.from({length:9},()=>new Animated.Value(phase==='colored'?1:0))).current;
// // // //   const dust=useRef(new Animated.Value(0)).current;
// // // //   const prev=useRef<Phase>(phase);

// // // //   // slow breathing of the chalk dust
// // // //   useEffect(()=>{
// // // //     const l=Animated.loop(Animated.sequence([
// // // //       Animated.timing(dust,{toValue:1,duration:1800,useNativeDriver:true}),
// // // //       Animated.timing(dust,{toValue:0,duration:1800,useNativeDriver:true})]));
// // // //     l.start();
// // // //     return()=>l.stop();
// // // //   },[]);

// // // //   useEffect(()=>{
// // // //     if(prev.current===phase)return;
// // // //     if(phase==='outline'){
// // // //       Animated.parallel([
// // // //         Animated.timing(smudge,{toValue:0,duration:900,useNativeDriver:true}),
// // // //         Animated.timing(draw,{toValue:1,duration:1500,easing:Easing.inOut(Easing.quad),useNativeDriver:false})]).start();
// // // //     }else if(phase==='colored'){
// // // //       Animated.stagger(120,paint.map(p=>Animated.spring(p,{toValue:1,friction:6,tension:60,useNativeDriver:true}))).start();
// // // //     }else{
// // // //       smudge.setValue(1);draw.setValue(0);paint.forEach(p=>p.setValue(0));
// // // //     }
// // // //     prev.current=phase;
// // // //   },[phase]);

// // // //   const abs:any={position:'absolute',left:0,top:0};
// // // //   const vb='0 0 300 400';

// // // //   // draw a part of the outline between two points of the animation
// // // //   const part=(a:number,b:number,len:number)=>({
// // // //     strokeDasharray:`${len} ${len}`,
// // // //     strokeDashoffset:draw.interpolate({inputRange:[a,b],outputRange:[len,0],extrapolate:'clamp'}),
// // // //     strokeOpacity:draw.interpolate({inputRange:[0,a+0.001,1],outputRange:[0,1,1],extrapolate:'clamp'}),
// // // //   });

// // // //   // the 9 colour layers (stem, 2 leaves, 5 petals, centre)
// // // //   const layers=[
// // // //     <Path key="s" d={STEM} stroke="#3aa655" strokeWidth={9} strokeLinecap="round" fill="none"/>,
// // // //     <Path key="l1" d={LEAF_L} fill="#4cc26a"/>,
// // // //     <Path key="l2" d={LEAF_R} fill="#4cc26a"/>,
// // // //     ...PETAL_CENTERS.map((c,i)=><Circle key={'p'+i} cx={c[0]} cy={c[1]} r={50} fill={PETAL_COLORS[i]}/>),
// // // //     <Circle key="c" cx={150} cy={140} r={28} fill="#ffd84a"/>,
// // // //   ];

// // // //   return <View style={{width,height}}>
// // // //     {/* blurred chalk smudge */}
// // // //     <Animated.View pointerEvents="none" style={[abs,{opacity:Animated.multiply(smudge,dust.interpolate({inputRange:[0,1],outputRange:[0.75,1]}))}]}>
// // // //       <Svg width={width} height={height} viewBox={vb}>
// // // //         <Defs>
// // // //           <RadialGradient id="chalkDust" cx="50%" cy="50%" r="50%">
// // // //             <Stop offset="0" stopColor="#e6f7ec" stopOpacity="0.5"/>
// // // //             <Stop offset="1" stopColor="#e6f7ec" stopOpacity="0"/>
// // // //           </RadialGradient>
// // // //         </Defs>
// // // //         {DUST.map((d,i)=><Circle key={i} cx={d[0]} cy={d[1]} r={d[2]} fill="url(#chalkDust)"/>)}
// // // //       </Svg>
// // // //     </Animated.View>

// // // //     {/* colour */}
// // // //     {layers.map((el,i)=>
// // // //       <Animated.View key={i} pointerEvents="none" style={[abs,{opacity:paint[i],transform:[{scale:paint[i].interpolate({inputRange:[0,1],outputRange:[0.75,1]})}]}]}>
// // // //         <Svg width={width} height={height} viewBox={vb}>{el}</Svg>
// // // //       </Animated.View>)}

// // // //     {/* white chalk lines */}
// // // //     <Svg width={width} height={height} viewBox={vb} style={abs}>
// // // //       <AnimatedPath d={PETALS} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" {...(part(0,0.5,1300) as any)}/>
// // // //       <AnimatedPath d="M178 140 A28 28 0 1 1 122 140 A28 28 0 1 1 178 140" fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" {...(part(0.4,0.6,200) as any)}/>
// // // //       <AnimatedPath d={STEM} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" {...(part(0.5,0.7,170) as any)}/>
// // // //       <AnimatedPath d={LEAF_L} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" {...(part(0.65,1,420) as any)}/>
// // // //       <AnimatedPath d={LEAF_R} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" {...(part(0.65,1,420) as any)}/>
// // // //     </Svg>
// // // //   </View>;
// // // // }

// // // // /* =========================================================
// // // //    TOOL ICONS  (viewBox 100 x 100)
// // // // ========================================================= */

// // // // const INK='#4a3a1a';
// // // // const pencilBody=(
// // // //   <G>
// // // //     <Rect x={40} y={26} width={20} height={44} fill="#ffcf3a" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
// // // //     <Rect x={50} y={26} width={10} height={44} fill="#f0b520"/>
// // // //     <Rect x={40} y={6} width={20} height={12} rx={4} fill="#f48fb1" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
// // // //     <Rect x={40} y={18} width={20} height={8} fill="#c9ced6" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
// // // //     <Path d="M40 70 H60 L50 92 Z" fill="#f3d2a2" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
// // // //     <Path d="M46 82 H54 L50 92 Z" fill="#333"/>
// // // //   </G>
// // // // );

// // // // export function ToolIcon({id,size}:{id:string;size:number}){
// // // //   let art:any=null;

// // // //   if(id==='pencil'){
// // // //     art=<G transform="rotate(35 50 50)">{pencilBody}</G>;
// // // //   }else if(id==='sketch'){
// // // //     art=<G>
// // // //       <G transform="rotate(30 50 50)">{pencilBody}</G>
// // // //       <Path d="M12 90 q8 -10 16 0 t16 0" fill="none" stroke="#888" strokeWidth={3} strokeLinecap="round"/>
// // // //     </G>;
// // // //   }else if(id==='scissors'){
// // // //     art=<G>
// // // //       <Path d="M46 52 L32 8 L44 6 L56 48 Z" fill="#cfd4dc" stroke="#5b6068" strokeWidth={2.5} strokeLinejoin="round"/>
// // // //       <Path d="M54 52 L68 8 L56 6 L44 48 Z" fill="#b9bfc8" stroke="#5b6068" strokeWidth={2.5} strokeLinejoin="round"/>
// // // //       <Circle cx={50} cy={52} r={3.5} fill="#777"/>
// // // //       <Path d="M48 55 L36 68 M52 55 L64 68" stroke="#d62d2d" strokeWidth={6} fill="none" strokeLinecap="round"/>
// // // //       <Ellipse cx={30} cy={78} rx={11} ry={9} stroke="#d62d2d" strokeWidth={6} fill="none"/>
// // // //       <Ellipse cx={70} cy={78} rx={11} ry={9} stroke="#d62d2d" strokeWidth={6} fill="none"/>
// // // //     </G>;
// // // //   }else if(id==='pen'){
// // // //     art=<G transform="rotate(35 50 50)">
// // // //       <Rect x={42} y={12} width={16} height={58} rx={7} fill="#2f7fe0" stroke="#173f88" strokeWidth={2.5}/>
// // // //       <Rect x={56} y={16} width={5} height={28} rx={2} fill="#1a4fa0" stroke="#173f88" strokeWidth={1.5}/>
// // // //       <Rect x={42} y={12} width={16} height={10} rx={5} fill="#5aa2f0"/>
// // // //       <Path d="M43 70 H57 L50 92 Z" fill="#a9c9f5" stroke="#173f88" strokeWidth={2.5} strokeLinejoin="round"/>
// // // //       <Path d="M48 86 H52 L50 92 Z" fill="#222"/>
// // // //     </G>;
// // // //   }else if(id==='paintbrush'){
// // // //     art=<G transform="rotate(35 50 50)">
// // // //       <Path d="M45 44 H55 L57 94 Q50 98 43 94 Z" fill="#a8642a" stroke="#5a3210" strokeWidth={2.5} strokeLinejoin="round"/>
// // // //       <Rect x={42} y={28} width={16} height={17} fill="#d5d9e0" stroke="#6b7078" strokeWidth={2.5}/>
// // // //       <Path d="M43 28 Q38 10 50 3 Q62 10 57 28 Z" fill="#f0c06a" stroke="#6b4a1a" strokeWidth={2.5} strokeLinejoin="round"/>
// // // //       <Path d="M42 17 Q50 -2 58 17 Q50 12 42 17 Z" fill="#2f6fe0"/>
// // // //     </G>;
// // // //   }else if(id==='crayons'){
// // // //     const cr=(x:number,h:number,c:string)=><G key={x}>
// // // //       <Rect x={x} y={70-h} width={16} height={h} fill={c} stroke="#222" strokeWidth={2} strokeLinejoin="round"/>
// // // //       <Rect x={x} y={70-h+10} width={16} height={12} fill="#fff" fillOpacity={0.85} stroke="#222" strokeWidth={1.2}/>
// // // //       <Path d={`M${x} ${70-h} L${x+8} ${70-h-12} L${x+16} ${70-h} Z`} fill={c} stroke="#222" strokeWidth={2} strokeLinejoin="round"/>
// // // //     </G>;
// // // //     art=<G>{cr(10,46,'#e53935')}{cr(30,52,'#1e88e5')}{cr(50,50,'#43a047')}{cr(70,44,'#fdd835')}</G>;
// // // //   }

// // // //   return <Svg width={size} height={size} viewBox="0 0 100 100">{art}</Svg>;
// // // // }

// // // // /* =========================================================
// // // //    SMALL CHALKBOARD DECORATIONS
// // // // ========================================================= */

// // // // // three yellow dashes next to the title (flip=true for the right side)
// // // // export function Sparks({flip}:{flip?:boolean}){
// // // //   const ln={stroke:'#ffd33d',strokeWidth:4,strokeLinecap:'round' as const};
// // // //   return <View style={{width:26,height:34,transform:[{scaleX:flip?-1:1}]}}>
// // // //     <Svg width={26} height={34} viewBox="0 0 26 34">
// // // //       <Line x1={4} y1={6} x2={16} y2={12} {...ln}/><Line x1={2} y1={18} x2={16} y2={18} {...ln}/><Line x1={4} y1={30} x2={16} y2={24} {...ln}/>
// // // //     </Svg>
// // // //   </View>;
// // // // }

// // // // // dashed curved arrow that points from the tool to the flower
// // // // export function DashedArrow(){
// // // //   return <Svg width={46} height={56} viewBox="0 0 46 56">
// // // //     <Path d="M6 54 C4 30 18 14 38 10" fill="none" stroke="#fff" strokeWidth={2.5} strokeDasharray="5 5" strokeLinecap="round"/>
// // // //     <Path d="M30 3 L40 10 L31 18" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
// // // //   </Svg>;
// // // // }

// // // // export function HomeIcon(){
// // // //   return <Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#1b1b1b" stroke="#1b1b1b" strokeWidth={1.5} strokeLinejoin="round"/></Svg>;
// // // // }

// // // // export function GearIcon(){
// // // //   return <Svg width={22} height={22} viewBox="0 0 24 24">
// // // //     <Circle cx={12} cy={12} r={8} stroke="#1b1b1b" strokeWidth={4} strokeDasharray="3 3.3" fill="none"/>
// // // //     <Circle cx={12} cy={12} r={5} fill="none" stroke="#1b1b1b" strokeWidth={2.6}/>
// // // //   </Svg>;
// // // // }

// // // // export function BulbIcon({size=24}:{size?:number}){
// // // //   return <Svg width={size} height={size} viewBox="0 0 24 24">
// // // //     <Circle cx={12} cy={10} r={6.5} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
// // // //     <Rect x={9.5} y={16.5} width={5} height={4} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
// // // //   </Svg>;
// // // // }

// // // // export function StarIcon({size=40,on=true}:{size?:number;on?:boolean}){
// // // //   const pts=Array.from({length:10},(_,i)=>{
// // // //     const r=i%2?9:21,a=(-90+i*36)*Math.PI/180;
// // // //     return `${(24+r*Math.cos(a)).toFixed(1)},${(25+r*Math.sin(a)).toFixed(1)}`;
// // // //   }).join(' ');
// // // //   return <Svg width={size} height={size} viewBox="0 0 48 48">
// // // //     <Polygon points={pts} fill={on?'#ffd33d':'none'} stroke={on?'#f5a800':'rgba(255,255,255,0.5)'} strokeWidth={3} strokeLinejoin="round"/>
// // // //   </Svg>;
// // // // }

// // // // // wooden chalk tray with an eraser and two chalk sticks
// // // // export function ChalkTray(){
// // // //   return <View style={st.tray}>
// // // //     <View style={st.ledge}/>
// // // //     <View style={st.eraser}>
// // // //       <View style={st.eraserTop}/>
// // // //       <View style={st.eraserBottom}><View style={st.eraserLine}/><View style={st.eraserLine}/></View>
// // // //     </View>
// // // //     <View style={[st.chalk,{left:'33%',bottom:12,width:46}]}/>
// // // //     <View style={[st.chalk,{left:'50%',bottom:14,width:40,transform:[{rotate:'-12deg'}]}]}/>
// // // //   </View>;
// // // // }

// // // // const st=StyleSheet.create({
// // // //   tray:{height:44,width:'100%'},
// // // //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:20,backgroundColor:'#e08a2e',borderTopWidth:3,borderTopColor:'#f2a64a'},
// // // //   eraser:{position:'absolute',left:'8%',bottom:12,width:62,height:30},
// // // //   eraserTop:{height:14,backgroundColor:'#b0702a',borderTopLeftRadius:4,borderTopRightRadius:4},
// // // //   eraserBottom:{height:16,backgroundColor:'#222',borderBottomLeftRadius:3,borderBottomRightRadius:3,justifyContent:'space-evenly',paddingHorizontal:3},
// // // //   eraserLine:{height:2,backgroundColor:'#555'},
// // // //   chalk:{position:'absolute',height:8,borderRadius:4,backgroundColor:'#f6f3ea'},
// // // // });
// // // // src/screens/braintwist/BTLevel2Art.tsx
// // // // Chalkboard drawings for level 2 (react-native-svg)
// // // import React,{useEffect,useRef} from 'react';
// // // import {View,Animated,Easing,StyleSheet} from 'react-native';
// // // import Svg,{Defs,RadialGradient,Stop,Circle,Path,Rect,Ellipse,G,Polygon,Line} from 'react-native-svg';

// // // export type Phase='blurred'|'outline'|'colored';

// // // /* =========================================================
// // //    FLOWER GEOMETRY  (viewBox 300 x 400)
// // // ========================================================= */

// // // // outline of the 5 petals joined together
// // // const PETALS='M100.1 71.3 A50 50 0 0 1 199.9 71.3 A50 50 0 0 1 230.8 166.2 A50 50 0 0 1 150.0 224.9 A50 50 0 0 1 69.2 166.2 A50 50 0 0 1 100.1 71.3 Z';
// // // const PETAL_CENTERS=[[150,74],[212.8,119.6],[188.8,193.4],[111.2,193.4],[87.2,119.6]];
// // // const PETAL_COLORS=['#ff79b0','#ff8ec0','#ff6aa8','#ff8ec0','#ff79b0'];
// // // const STEM='M150 232 L150 372';
// // // const LEAF_L='M150 372 C100 372 62 340 56 292 C108 292 146 322 150 372 Z';
// // // const LEAF_R='M150 372 C200 372 238 340 244 292 C192 292 154 322 150 372 Z';

// // // // soft dust blobs: a smudge on the board, it must not look like a flower
// // // const DUST=[[150,130,86],[105,168,64],[196,176,70],[150,236,58],[118,92,50],[190,96,54],[150,330,44],[96,300,34]];

// // // const AnimatedPath=Animated.createAnimatedComponent(Path);
// // // const CHALK='#ffffff';

// // // /* =========================================================
// // //    CHALK FLOWER
// // //    blurred -> outline : smudge fades, lines are drawn
// // //    outline -> colored : parts get painted one by one
// // // ========================================================= */

// // // export function ChalkFlower({phase,width}:{phase:Phase;width:number}){
// // //   const height=width*4/3;
// // //   const smudge=useRef(new Animated.Value(phase==='blurred'?1:0)).current;
// // //   const draw=useRef(new Animated.Value(phase==='blurred'?0:1)).current;
// // //   const paint=useRef(Array.from({length:9},()=>new Animated.Value(phase==='colored'?1:0))).current;
// // //   const dust=useRef(new Animated.Value(0)).current;
// // //   const prev=useRef<Phase>(phase);

// // //   // slow breathing of the chalk dust
// // //   useEffect(()=>{
// // //     const l=Animated.loop(Animated.sequence([
// // //       Animated.timing(dust,{toValue:1,duration:1800,useNativeDriver:true}),
// // //       Animated.timing(dust,{toValue:0,duration:1800,useNativeDriver:true})]));
// // //     l.start();
// // //     return()=>l.stop();
// // //   },[]);

// // //   useEffect(()=>{
// // //     if(prev.current===phase)return;
// // //     if(phase==='outline'){
// // //       Animated.parallel([
// // //         Animated.timing(smudge,{toValue:0,duration:900,useNativeDriver:true}),
// // //         Animated.timing(draw,{toValue:1,duration:1500,easing:Easing.inOut(Easing.quad),useNativeDriver:false})]).start();
// // //     }else if(phase==='colored'){
// // //       Animated.stagger(120,paint.map(p=>Animated.spring(p,{toValue:1,friction:6,tension:60,useNativeDriver:true}))).start();
// // //     }else{
// // //       smudge.setValue(1);draw.setValue(0);paint.forEach(p=>p.setValue(0));
// // //     }
// // //     prev.current=phase;
// // //   },[phase]);

// // //   const abs:any={position:'absolute',left:0,top:0};
// // //   const vb='0 0 300 400';

// // //   // draw a part of the outline between two points of the animation
// // //   const part=(a:number,b:number,len:number)=>({
// // //     strokeDasharray:`${len} ${len}`,
// // //     strokeDashoffset:draw.interpolate({inputRange:[a,b],outputRange:[len,0],extrapolate:'clamp'}),
// // //     strokeOpacity:draw.interpolate({inputRange:[0,a+0.001,1],outputRange:[0,1,1],extrapolate:'clamp'}),
// // //   });

// // //   // the 9 colour layers (stem, 2 leaves, 5 petals, centre)
// // //   const layers=[
// // //     <Path key="s" d={STEM} stroke="#3aa655" strokeWidth={9} strokeLinecap="round" fill="none"/>,
// // //     <Path key="l1" d={LEAF_L} fill="#4cc26a"/>,
// // //     <Path key="l2" d={LEAF_R} fill="#4cc26a"/>,
// // //     ...PETAL_CENTERS.map((c,i)=><Circle key={'p'+i} cx={c[0]} cy={c[1]} r={50} fill={PETAL_COLORS[i]}/>),
// // //     <Circle key="c" cx={150} cy={140} r={28} fill="#ffd84a"/>,
// // //   ];

// // //   return <View style={{width,height}}>
// // //     {/* blurred chalk smudge */}
// // //     <Animated.View pointerEvents="none" style={[abs,{opacity:Animated.multiply(smudge,dust.interpolate({inputRange:[0,1],outputRange:[0.75,1]}))}]}>
// // //       <Svg width={width} height={height} viewBox={vb}>
// // //         <Defs>
// // //           <RadialGradient id="chalkDust" cx="50%" cy="50%" r="50%">
// // //             <Stop offset="0" stopColor="#e6f7ec" stopOpacity="0.5"/>
// // //             <Stop offset="1" stopColor="#e6f7ec" stopOpacity="0"/>
// // //           </RadialGradient>
// // //         </Defs>
// // //         {DUST.map((d,i)=><Circle key={i} cx={d[0]} cy={d[1]} r={d[2]} fill="url(#chalkDust)"/>)}
// // //       </Svg>
// // //     </Animated.View>

// // //     {/* colour */}
// // //     {layers.map((el,i)=>
// // //       <Animated.View key={i} pointerEvents="none" style={[abs,{opacity:paint[i],transform:[{scale:paint[i].interpolate({inputRange:[0,1],outputRange:[0.75,1]})}]}]}>
// // //         <Svg width={width} height={height} viewBox={vb}>{el}</Svg>
// // //       </Animated.View>)}

// // //     {/* white chalk lines */}
// // //     <Svg width={width} height={height} viewBox={vb} style={abs}>
// // //       <AnimatedPath d={PETALS} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" {...(part(0,0.5,1300) as any)}/>
// // //       <AnimatedPath d="M178 140 A28 28 0 1 1 122 140 A28 28 0 1 1 178 140" fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" {...(part(0.4,0.6,200) as any)}/>
// // //       <AnimatedPath d={STEM} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" {...(part(0.5,0.7,170) as any)}/>
// // //       <AnimatedPath d={LEAF_L} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" {...(part(0.65,1,420) as any)}/>
// // //       <AnimatedPath d={LEAF_R} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" {...(part(0.65,1,420) as any)}/>
// // //     </Svg>
// // //   </View>;
// // // }

// // // /* =========================================================
// // //    TOOL ICONS  (viewBox 100 x 100)
// // // ========================================================= */

// // // const INK='#4a3a1a';
// // // const pencilBody=(
// // //   <G>
// // //     <Rect x={40} y={26} width={20} height={44} fill="#ffcf3a" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
// // //     <Rect x={50} y={26} width={10} height={44} fill="#f0b520"/>
// // //     <Rect x={40} y={6} width={20} height={12} rx={4} fill="#f48fb1" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
// // //     <Rect x={40} y={18} width={20} height={8} fill="#c9ced6" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
// // //     <Path d="M40 70 H60 L50 92 Z" fill="#f3d2a2" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
// // //     <Path d="M46 82 H54 L50 92 Z" fill="#333"/>
// // //   </G>
// // // );

// // // export function ToolIcon({id,size}:{id:string;size:number}){
// // //   let art:any=null;

// // //   if(id==='pencil'){
// // //     art=<G transform="rotate(35 50 50)">{pencilBody}</G>;
// // //   }else if(id==='sketch'){
// // //     art=<G>
// // //       <G transform="rotate(30 50 50)">{pencilBody}</G>
// // //       <Path d="M12 90 q8 -10 16 0 t16 0" fill="none" stroke="#888" strokeWidth={3} strokeLinecap="round"/>
// // //     </G>;
// // //   }else if(id==='scissors'){
// // //     art=<G>
// // //       <Path d="M46 52 L32 8 L44 6 L56 48 Z" fill="#cfd4dc" stroke="#5b6068" strokeWidth={2.5} strokeLinejoin="round"/>
// // //       <Path d="M54 52 L68 8 L56 6 L44 48 Z" fill="#b9bfc8" stroke="#5b6068" strokeWidth={2.5} strokeLinejoin="round"/>
// // //       <Circle cx={50} cy={52} r={3.5} fill="#777"/>
// // //       <Path d="M48 55 L36 68 M52 55 L64 68" stroke="#d62d2d" strokeWidth={6} fill="none" strokeLinecap="round"/>
// // //       <Ellipse cx={30} cy={78} rx={11} ry={9} stroke="#d62d2d" strokeWidth={6} fill="none"/>
// // //       <Ellipse cx={70} cy={78} rx={11} ry={9} stroke="#d62d2d" strokeWidth={6} fill="none"/>
// // //     </G>;
// // //   }else if(id==='pen'){
// // //     art=<G transform="rotate(35 50 50)">
// // //       <Rect x={42} y={12} width={16} height={58} rx={7} fill="#2f7fe0" stroke="#173f88" strokeWidth={2.5}/>
// // //       <Rect x={56} y={16} width={5} height={28} rx={2} fill="#1a4fa0" stroke="#173f88" strokeWidth={1.5}/>
// // //       <Rect x={42} y={12} width={16} height={10} rx={5} fill="#5aa2f0"/>
// // //       <Path d="M43 70 H57 L50 92 Z" fill="#a9c9f5" stroke="#173f88" strokeWidth={2.5} strokeLinejoin="round"/>
// // //       <Path d="M48 86 H52 L50 92 Z" fill="#222"/>
// // //     </G>;
// // //   }else if(id==='paintbrush'){
// // //     art=<G transform="rotate(35 50 50)">
// // //       <Path d="M45 44 H55 L57 94 Q50 98 43 94 Z" fill="#a8642a" stroke="#5a3210" strokeWidth={2.5} strokeLinejoin="round"/>
// // //       <Rect x={42} y={28} width={16} height={17} fill="#d5d9e0" stroke="#6b7078" strokeWidth={2.5}/>
// // //       <Path d="M43 28 Q38 10 50 3 Q62 10 57 28 Z" fill="#f0c06a" stroke="#6b4a1a" strokeWidth={2.5} strokeLinejoin="round"/>
// // //       <Path d="M42 17 Q50 -2 58 17 Q50 12 42 17 Z" fill="#2f6fe0"/>
// // //     </G>;
// // //   }else if(id==='crayons'){
// // //     const cr=(x:number,h:number,c:string)=><G key={x}>
// // //       <Rect x={x} y={70-h} width={16} height={h} fill={c} stroke="#222" strokeWidth={2} strokeLinejoin="round"/>
// // //       <Rect x={x} y={70-h+10} width={16} height={12} fill="#fff" fillOpacity={0.85} stroke="#222" strokeWidth={1.2}/>
// // //       <Path d={`M${x} ${70-h} L${x+8} ${70-h-12} L${x+16} ${70-h} Z`} fill={c} stroke="#222" strokeWidth={2} strokeLinejoin="round"/>
// // //     </G>;
// // //     art=<G>{cr(10,46,'#e53935')}{cr(30,52,'#1e88e5')}{cr(50,50,'#43a047')}{cr(70,44,'#fdd835')}</G>;
// // //   }

// // //   return <Svg width={size} height={size} viewBox="0 0 100 100">{art}</Svg>;
// // // }

// // // /* =========================================================
// // //    SMALL CHALKBOARD DECORATIONS
// // // ========================================================= */

// // // // three yellow dashes next to the title (flip=true for the right side)
// // // export function Sparks({flip}:{flip?:boolean}){
// // //   const ln={stroke:'#ffd33d',strokeWidth:4,strokeLinecap:'round' as const};
// // //   return <View style={{width:26,height:34,transform:[{scaleX:flip?-1:1}]}}>
// // //     <Svg width={26} height={34} viewBox="0 0 26 34">
// // //       <Line x1={4} y1={6} x2={16} y2={12} {...ln}/><Line x1={2} y1={18} x2={16} y2={18} {...ln}/><Line x1={4} y1={30} x2={16} y2={24} {...ln}/>
// // //     </Svg>
// // //   </View>;
// // // }

// // // // dashed curved arrow that points from the tool to the flower
// // // export function DashedArrow(){
// // //   return <Svg width={46} height={56} viewBox="0 0 46 56">
// // //     <Path d="M6 54 C4 30 18 14 38 10" fill="none" stroke="#fff" strokeWidth={2.5} strokeDasharray="5 5" strokeLinecap="round"/>
// // //     <Path d="M30 3 L40 10 L31 18" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
// // //   </Svg>;
// // // }

// // // export function HomeIcon(){
// // //   return <Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#1b1b1b" stroke="#1b1b1b" strokeWidth={1.5} strokeLinejoin="round"/></Svg>;
// // // }

// // // export function GearIcon(){
// // //   return <Svg width={22} height={22} viewBox="0 0 24 24">
// // //     <Circle cx={12} cy={12} r={8} stroke="#1b1b1b" strokeWidth={4} strokeDasharray="3 3.3" fill="none"/>
// // //     <Circle cx={12} cy={12} r={5} fill="none" stroke="#1b1b1b" strokeWidth={2.6}/>
// // //   </Svg>;
// // // }

// // // export function BulbIcon({size=24}:{size?:number}){
// // //   return <Svg width={size} height={size} viewBox="0 0 24 24">
// // //     <Circle cx={12} cy={10} r={6.5} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
// // //     <Rect x={9.5} y={16.5} width={5} height={4} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
// // //   </Svg>;
// // // }

// // // export function StarIcon({size=40,on=true}:{size?:number;on?:boolean}){
// // //   const pts=Array.from({length:10},(_,i)=>{
// // //     const r=i%2?9:21,a=(-90+i*36)*Math.PI/180;
// // //     return `${(24+r*Math.cos(a)).toFixed(1)},${(25+r*Math.sin(a)).toFixed(1)}`;
// // //   }).join(' ');
// // //   return <Svg width={size} height={size} viewBox="0 0 48 48">
// // //     <Polygon points={pts} fill={on?'#ffd33d':'none'} stroke={on?'#f5a800':'rgba(255,255,255,0.5)'} strokeWidth={3} strokeLinejoin="round"/>
// // //   </Svg>;
// // // }

// // // // wooden chalk tray with an eraser and two chalk sticks
// // // export function ChalkTray(){
// // //   return <View style={st.tray}>
// // //     <View style={st.ledge}/>
// // //     <View style={st.eraser}>
// // //       <View style={st.eraserTop}/>
// // //       <View style={st.eraserBottom}><View style={st.eraserLine}/><View style={st.eraserLine}/></View>
// // //     </View>
// // //     <View style={[st.chalk,{left:'33%',bottom:12,width:46}]}/>
// // //     <View style={[st.chalk,{left:'50%',bottom:14,width:40,transform:[{rotate:'-12deg'}]}]}/>
// // //   </View>;
// // // }

// // // const st=StyleSheet.create({
// // //   tray:{height:44,width:'100%'},
// // //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:20,backgroundColor:'#e08a2e',borderTopWidth:3,borderTopColor:'#f2a64a'},
// // //   eraser:{position:'absolute',left:'8%',bottom:12,width:62,height:30},
// // //   eraserTop:{height:14,backgroundColor:'#b0702a',borderTopLeftRadius:4,borderTopRightRadius:4},
// // //   eraserBottom:{height:16,backgroundColor:'#222',borderBottomLeftRadius:3,borderBottomRightRadius:3,justifyContent:'space-evenly',paddingHorizontal:3},
// // //   eraserLine:{height:2,backgroundColor:'#555'},
// // //   chalk:{position:'absolute',height:8,borderRadius:4,backgroundColor:'#f6f3ea'},
// // // });
// // import React,{useEffect,useRef} from 'react';
// // import {View,Animated,StyleSheet} from 'react-native';
// // import Svg,{Circle,Path,Rect,Ellipse,G,Polygon,Line} from 'react-native-svg';

// // export type Phase='blurred'|'outline'|'colored';

// // /* =========================================================
// //    FLOWER GEOMETRY  (viewBox 300 x 400)
// // ========================================================= */

// // // outline of the 5 petals joined together
// // const PETALS='M100.1 71.3 A50 50 0 0 1 199.9 71.3 A50 50 0 0 1 230.8 166.2 A50 50 0 0 1 150.0 224.9 A50 50 0 0 1 69.2 166.2 A50 50 0 0 1 100.1 71.3 Z';
// // const PETAL_CENTERS=[[150,74],[212.8,119.6],[188.8,193.4],[111.2,193.4],[87.2,119.6]];
// // const PETAL_COLORS=['#ff79b0','#ff8ec0','#ff6aa8','#ff8ec0','#ff79b0'];
// // const STEM='M150 232 L150 372';
// // const LEAF_L='M150 372 C100 372 62 340 56 292 C108 292 146 322 150 372 Z';
// // const LEAF_R='M150 372 C200 372 238 340 244 292 C192 292 154 322 150 372 Z';

// // const CHALK='#ffffff';
// // const SMUDGE='#e9f7ef';

// // // blur = the same flower shape drawn many times with fat, faint strokes
// // const BLUR_LAYERS=[
// //   {w:48,o:0.07},{w:38,o:0.08},{w:30,o:0.09},{w:22,o:0.10},{w:15,o:0.12},{w:8,o:0.14},
// // ];

// // /* =========================================================
// //    CHALK FLOWER
// //    blurred -> outline : smudge fades, white lines fade in
// //    outline -> colored : parts get painted one by one
// // ========================================================= */

// // export function ChalkFlower({phase,width}:{phase:Phase;width:number}){
// //   const height=width*4/3;
// //   const smudge=useRef(new Animated.Value(phase==='blurred'?1:0)).current;
// //   const line=useRef(new Animated.Value(phase==='blurred'?0:1)).current;
// //   const paint=useRef(Array.from({length:9},()=>new Animated.Value(phase==='colored'?1:0))).current;
// //   const dust=useRef(new Animated.Value(0)).current;
// //   const prev=useRef<Phase>(phase);

// //   // slow breathing of the chalk dust
// //   useEffect(()=>{
// //     const l=Animated.loop(Animated.sequence([
// //       Animated.timing(dust,{toValue:1,duration:1800,useNativeDriver:true}),
// //       Animated.timing(dust,{toValue:0,duration:1800,useNativeDriver:true})]));
// //     l.start();
// //     return()=>l.stop();
// //   },[]);

// //   useEffect(()=>{
// //     if(prev.current===phase)return;
// //     if(phase==='outline'){
// //       Animated.parallel([
// //         Animated.timing(smudge,{toValue:0,duration:900,useNativeDriver:true}),
// //         Animated.timing(line,{toValue:1,duration:1200,useNativeDriver:true})]).start();
// //     }else if(phase==='colored'){
// //       smudge.setValue(0);line.setValue(1);
// //       Animated.stagger(120,paint.map(p=>Animated.spring(p,{toValue:1,friction:6,tension:60,useNativeDriver:true}))).start();
// //     }else{
// //       smudge.setValue(1);line.setValue(0);paint.forEach(p=>p.setValue(0));
// //     }
// //     prev.current=phase;
// //   },[phase]);

// //   const abs:any={position:'absolute',left:0,top:0};
// //   const vb='0 0 300 400';

// //   // the 9 colour layers (stem, 2 leaves, 5 petals, centre)
// //   const layers=[
// //     <Path key="s" d={STEM} stroke="#3aa655" strokeWidth={9} strokeLinecap="round" fill="none"/>,
// //     <Path key="l1" d={LEAF_L} fill="#4cc26a"/>,
// //     <Path key="l2" d={LEAF_R} fill="#4cc26a"/>,
// //     ...PETAL_CENTERS.map((c,i)=><Circle key={'p'+i} cx={c[0]} cy={c[1]} r={50} fill={PETAL_COLORS[i]}/>),
// //     <Circle key="c" cx={150} cy={140} r={28} fill="#ffd84a"/>,
// //   ];

// //   return <View style={{width,height}}>
// //     {/* colour layers */}
// //     {layers.map((el,i)=>
// //       <Animated.View key={i} pointerEvents="none" style={[abs,{opacity:paint[i],transform:[{scale:paint[i].interpolate({inputRange:[0,1],outputRange:[0.75,1]})}]}]}>
// //         <Svg width={width} height={height} viewBox={vb}>{el}</Svg>
// //       </Animated.View>)}

// //     {/* white chalk outline */}
// //     <Animated.View pointerEvents="none" style={[abs,{width,height,opacity:line}]}>
// //       <Svg width={width} height={height} viewBox={vb}>
// //         <Path d={PETALS} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/>
// //         <Circle cx={150} cy={140} r={28} fill="none" stroke={CHALK} strokeWidth={6}/>
// //         <Path d={STEM} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round"/>
// //         <Path d={LEAF_L} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/>
// //         <Path d={LEAF_R} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/>
// //       </Svg>
// //     </Animated.View>

// //     {/* blurred flower-shaped chalk smudge */}
// //     <Animated.View pointerEvents="none" style={[abs,{width,height,opacity:Animated.multiply(smudge,dust.interpolate({inputRange:[0,1],outputRange:[0.8,1]}))}]}>
// //       <Svg width={width} height={height} viewBox={vb}>
// //         {/* soft fill so the shape reads as a cloud */}
// //         <Path d={PETALS} fill={SMUDGE} fillOpacity={0.12}/>
// //         <Circle cx={150} cy={140} r={28} fill={SMUDGE} fillOpacity={0.10}/>
// //         <Path d={LEAF_L} fill={SMUDGE} fillOpacity={0.10}/>
// //         <Path d={LEAF_R} fill={SMUDGE} fillOpacity={0.10}/>
// //         {BLUR_LAYERS.map((b,i)=>
// //           <G key={i}>
// //             <Path d={PETALS} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w} strokeLinejoin="round"/>
// //             <Circle cx={150} cy={140} r={28} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w}/>
// //             <Path d={STEM} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w} strokeLinecap="round"/>
// //             <Path d={LEAF_L} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w} strokeLinejoin="round"/>
// //             <Path d={LEAF_R} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w} strokeLinejoin="round"/>
// //           </G>)}
// //       </Svg>
// //     </Animated.View>
// //   </View>;
// // }

// // /* =========================================================
// //    TOOL ICONS  (viewBox 100 x 100)
// // ========================================================= */

// // const INK='#4a3a1a';
// // const pencilBody=(
// //   <G>
// //     <Rect x={40} y={26} width={20} height={44} fill="#ffcf3a" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
// //     <Rect x={50} y={26} width={10} height={44} fill="#f0b520"/>
// //     <Rect x={40} y={6} width={20} height={12} rx={4} fill="#f48fb1" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
// //     <Rect x={40} y={18} width={20} height={8} fill="#c9ced6" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
// //     <Path d="M40 70 H60 L50 92 Z" fill="#f3d2a2" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
// //     <Path d="M46 82 H54 L50 92 Z" fill="#333"/>
// //   </G>
// // );

// // export function ToolIcon({id,size}:{id:string;size:number}){
// //   let art:any=null;

// //   if(id==='pencil'){
// //     art=<G transform="rotate(35 50 50)">{pencilBody}</G>;
// //   }else if(id==='sketch'){
// //     art=<G>
// //       <G transform="rotate(30 50 50)">{pencilBody}</G>
// //       <Path d="M12 90 q8 -10 16 0 t16 0" fill="none" stroke="#888" strokeWidth={3} strokeLinecap="round"/>
// //     </G>;
// //   }else if(id==='scissors'){
// //     art=<G>
// //       <Path d="M46 52 L32 8 L44 6 L56 48 Z" fill="#cfd4dc" stroke="#5b6068" strokeWidth={2.5} strokeLinejoin="round"/>
// //       <Path d="M54 52 L68 8 L56 6 L44 48 Z" fill="#b9bfc8" stroke="#5b6068" strokeWidth={2.5} strokeLinejoin="round"/>
// //       <Circle cx={50} cy={52} r={3.5} fill="#777"/>
// //       <Path d="M48 55 L36 68 M52 55 L64 68" stroke="#d62d2d" strokeWidth={6} fill="none" strokeLinecap="round"/>
// //       <Ellipse cx={30} cy={78} rx={11} ry={9} stroke="#d62d2d" strokeWidth={6} fill="none"/>
// //       <Ellipse cx={70} cy={78} rx={11} ry={9} stroke="#d62d2d" strokeWidth={6} fill="none"/>
// //     </G>;
// //   }else if(id==='pen'){
// //     art=<G transform="rotate(35 50 50)">
// //       <Rect x={42} y={12} width={16} height={58} rx={7} fill="#2f7fe0" stroke="#173f88" strokeWidth={2.5}/>
// //       <Rect x={56} y={16} width={5} height={28} rx={2} fill="#1a4fa0" stroke="#173f88" strokeWidth={1.5}/>
// //       <Rect x={42} y={12} width={16} height={10} rx={5} fill="#5aa2f0"/>
// //       <Path d="M43 70 H57 L50 92 Z" fill="#a9c9f5" stroke="#173f88" strokeWidth={2.5} strokeLinejoin="round"/>
// //       <Path d="M48 86 H52 L50 92 Z" fill="#222"/>
// //     </G>;
// //   }else if(id==='paintbrush'||id==='paint'||id==='brush'){
// //     art=<G transform="rotate(35 50 50)">
// //       <Path d="M45 44 H55 L57 94 Q50 98 43 94 Z" fill="#a8642a" stroke="#5a3210" strokeWidth={2.5} strokeLinejoin="round"/>
// //       <Rect x={42} y={28} width={16} height={17} fill="#d5d9e0" stroke="#6b7078" strokeWidth={2.5}/>
// //       <Path d="M43 28 Q38 10 50 3 Q62 10 57 28 Z" fill="#f0c06a" stroke="#6b4a1a" strokeWidth={2.5} strokeLinejoin="round"/>
// //       <Path d="M42 17 Q50 -2 58 17 Q50 12 42 17 Z" fill="#2f6fe0"/>
// //     </G>;
// //   }else if(id==='crayons'){
// //     const cr=(x:number,h:number,c:string)=><G key={x}>
// //       <Rect x={x} y={70-h} width={16} height={h} fill={c} stroke="#222" strokeWidth={2} strokeLinejoin="round"/>
// //       <Rect x={x} y={70-h+10} width={16} height={12} fill="#fff" fillOpacity={0.85} stroke="#222" strokeWidth={1.2}/>
// //       <Path d={`M${x} ${70-h} L${x+8} ${70-h-12} L${x+16} ${70-h} Z`} fill={c} stroke="#222" strokeWidth={2} strokeLinejoin="round"/>
// //     </G>;
// //     art=<G>{cr(10,46,'#e53935')}{cr(30,52,'#1e88e5')}{cr(50,50,'#43a047')}{cr(70,44,'#fdd835')}</G>;
// //   }

// //   return <Svg width={size} height={size} viewBox="0 0 100 100">{art}</Svg>;
// // }

// // /* =========================================================
// //    SMALL CHALKBOARD DECORATIONS
// // ========================================================= */

// // // three yellow dashes next to the title (flip=true for the right side)
// // export function Sparks({flip}:{flip?:boolean}){
// //   const ln={stroke:'#ffd33d',strokeWidth:4,strokeLinecap:'round' as const};
// //   return <View style={{width:26,height:34,transform:[{scaleX:flip?-1:1}]}}>
// //     <Svg width={26} height={34} viewBox="0 0 26 34">
// //       <Line x1={4} y1={6} x2={16} y2={12} {...ln}/><Line x1={2} y1={18} x2={16} y2={18} {...ln}/><Line x1={4} y1={30} x2={16} y2={24} {...ln}/>
// //     </Svg>
// //   </View>;
// // }

// // // dashed curved arrow that points from the tool to the flower
// // export function DashedArrow(){
// //   return <Svg width={46} height={56} viewBox="0 0 46 56">
// //     <Path d="M6 54 C4 30 18 14 38 10" fill="none" stroke="#fff" strokeWidth={2.5} strokeDasharray="5 5" strokeLinecap="round"/>
// //     <Path d="M30 3 L40 10 L31 18" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
// //   </Svg>;
// // }

// // export function HomeIcon(){
// //   return <Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#1b1b1b" stroke="#1b1b1b" strokeWidth={1.5} strokeLinejoin="round"/></Svg>;
// // }

// // export function GearIcon(){
// //   return <Svg width={22} height={22} viewBox="0 0 24 24">
// //     <Circle cx={12} cy={12} r={8} stroke="#1b1b1b" strokeWidth={4} strokeDasharray="3 3.3" fill="none"/>
// //     <Circle cx={12} cy={12} r={5} fill="none" stroke="#1b1b1b" strokeWidth={2.6}/>
// //   </Svg>;
// // }

// // export function BulbIcon({size=24}:{size?:number}){
// //   return <Svg width={size} height={size} viewBox="0 0 24 24">
// //     <Circle cx={12} cy={10} r={6.5} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
// //     <Rect x={9.5} y={16.5} width={5} height={4} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
// //   </Svg>;
// // }

// // export function StarIcon({size=40,on=true}:{size?:number;on?:boolean}){
// //   const pts=Array.from({length:10},(_,i)=>{
// //     const r=i%2?9:21,a=(-90+i*36)*Math.PI/180;
// //     return `${(24+r*Math.cos(a)).toFixed(1)},${(25+r*Math.sin(a)).toFixed(1)}`;
// //   }).join(' ');
// //   return <Svg width={size} height={size} viewBox="0 0 48 48">
// //     <Polygon points={pts} fill={on?'#ffd33d':'none'} stroke={on?'#f5a800':'rgba(255,255,255,0.5)'} strokeWidth={3} strokeLinejoin="round"/>
// //   </Svg>;
// // }

// // // wooden chalk tray with an eraser and two chalk sticks
// // export function ChalkTray(){
// //   return <View style={st.tray}>
// //     <View style={st.ledge}/>
// //     <View style={st.eraser}>
// //       <View style={st.eraserTop}/>
// //       <View style={st.eraserBottom}><View style={st.eraserLine}/><View style={st.eraserLine}/></View>
// //     </View>
// //     <View style={[st.chalk,{left:'33%',bottom:12,width:46}]}/>
// //     <View style={[st.chalk,{left:'50%',bottom:14,width:40,transform:[{rotate:'-12deg'}]}]}/>
// //   </View>;
// // }

// // const st=StyleSheet.create({
// //   tray:{height:44,width:'100%'},
// //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:20,backgroundColor:'#e08a2e',borderTopWidth:3,borderTopColor:'#f2a64a'},
// //   eraser:{position:'absolute',left:'8%',bottom:12,width:62,height:30},
// //   eraserTop:{height:14,backgroundColor:'#b0702a',borderTopLeftRadius:4,borderTopRightRadius:4},
// //   eraserBottom:{height:16,backgroundColor:'#222',borderBottomLeftRadius:3,borderBottomRightRadius:3,justifyContent:'space-evenly',paddingHorizontal:3},
// //   eraserLine:{height:2,backgroundColor:'#555'},
// //   chalk:{position:'absolute',height:8,borderRadius:4,backgroundColor:'#f6f3ea'},
// // });
// import React,{useEffect,useRef} from 'react';
// import {View,Animated,StyleSheet,Image,Easing} from 'react-native';
// import Svg,{Circle,Path,Rect,Ellipse,G,Polygon,Line} from 'react-native-svg';
// import {FLOWER_OUTLINE_IMG,FLOWER_COLORED_IMG} from './Btlevel2images';

// export type Phase='blurred'|'outline'|'colored';

// /* =========================================================
//    FLOWER GEOMETRY  (viewBox 300 x 400)
// ========================================================= */

// // outline of the 5 petals joined together
// const PETALS='M100.1 71.3 A50 50 0 0 1 199.9 71.3 A50 50 0 0 1 230.8 166.2 A50 50 0 0 1 150.0 224.9 A50 50 0 0 1 69.2 166.2 A50 50 0 0 1 100.1 71.3 Z';
// const PETAL_CENTERS=[[150,74],[212.8,119.6],[188.8,193.4],[111.2,193.4],[87.2,119.6]];
// const PETAL_COLORS=['#ff79b0','#ff8ec0','#ff6aa8','#ff8ec0','#ff79b0'];
// const STEM='M150 232 L150 372';
// const LEAF_L='M150 372 C100 372 62 340 56 292 C108 292 146 322 150 372 Z';
// const LEAF_R='M150 372 C200 372 238 340 244 292 C192 292 154 322 150 372 Z';

// const CHALK='#ffffff';
// const SMUDGE='#e9f7ef';

// // blur = the same flower shape drawn many times with fat, faint strokes
// const BLUR_LAYERS=[
//   {w:48,o:0.07},{w:38,o:0.08},{w:30,o:0.09},{w:22,o:0.10},{w:15,o:0.12},{w:8,o:0.14},
// ];

// // chalk dust puffs that fly out when the fog is wiped away
// const PUFFS=Array.from({length:12},(_,i)=>{
//   const a=(i/12)*Math.PI*2+0.25;
//   return {dx:Math.cos(a),dy:Math.sin(a),d:0.26+(i%3)*0.09,s:16+(i%4)*7};
// });

// /* =========================================================
//    CHALK FLOWER
//    blurred -> outline : fog scatters like dust, real outline image fades in
//    outline -> colored : real coloured image is painted in top to bottom
//    (falls back to the SVG flower when the PNG files are not set)
// ========================================================= */

// export function ChalkFlower({phase,width}:{phase:Phase;width:number}){
//   const height=width*4/3;
//   const realOutline=!!FLOWER_OUTLINE_IMG;
//   const realColor=!!FLOWER_COLORED_IMG;

//   const smudge=useRef(new Animated.Value(phase==='blurred'?1:0)).current;
//   const smudgeScale=useRef(new Animated.Value(1)).current;
//   const puff=useRef(new Animated.Value(0)).current;
//   const line=useRef(new Animated.Value(phase==='blurred'?0:1)).current;
//   const paint=useRef(Array.from({length:9},()=>new Animated.Value(phase==='colored'?1:0))).current;
//   const reveal=useRef(new Animated.Value(phase==='colored'?1:0)).current;
//   const dust=useRef(new Animated.Value(0)).current;
//   const prev=useRef<Phase>(phase);

//   // slow breathing of the chalk dust
//   useEffect(()=>{
//     const l=Animated.loop(Animated.sequence([
//       Animated.timing(dust,{toValue:1,duration:1800,useNativeDriver:true}),
//       Animated.timing(dust,{toValue:0,duration:1800,useNativeDriver:true})]));
//     l.start();
//     return()=>l.stop();
//   },[]);

//   useEffect(()=>{
//     if(prev.current===phase)return;
//     if(phase==='outline'){
//       // pencil used: the fog is wiped away, the clear flower appears
//       puff.setValue(0);
//       smudgeScale.setValue(1);
//       Animated.parallel([
//         Animated.timing(smudge,{toValue:0,duration:1100,easing:Easing.out(Easing.quad),useNativeDriver:true}),
//         Animated.timing(smudgeScale,{toValue:1.35,duration:1100,easing:Easing.out(Easing.quad),useNativeDriver:true}),
//         Animated.timing(puff,{toValue:1,duration:1000,easing:Easing.out(Easing.quad),useNativeDriver:true}),
//         Animated.sequence([
//           Animated.delay(450),
//           Animated.timing(line,{toValue:1,duration:900,useNativeDriver:true})]),
//       ]).start();
//     }else if(phase==='colored'){
//       smudge.setValue(0);line.setValue(1);
//       if(realColor){
//         // paint wipes down over the real outline image
//         reveal.setValue(0);
//         Animated.timing(reveal,{toValue:1,duration:1600,easing:Easing.inOut(Easing.quad),useNativeDriver:false}).start();
//       }else{
//         Animated.stagger(120,paint.map(p=>Animated.spring(p,{toValue:1,friction:6,tension:60,useNativeDriver:true}))).start();
//       }
//     }else{
//       smudge.setValue(1);smudgeScale.setValue(1);puff.setValue(0);
//       line.setValue(0);reveal.setValue(0);paint.forEach(p=>p.setValue(0));
//     }
//     prev.current=phase;
//   },[phase]);

//   const abs:any={position:'absolute',left:0,top:0};
//   const vb='0 0 300 400';

//   // the 9 colour layers (stem, 2 leaves, 5 petals, centre) - SVG fallback
//   const layers=[
//     <Path key="s" d={STEM} stroke="#3aa655" strokeWidth={9} strokeLinecap="round" fill="none"/>,
//     <Path key="l1" d={LEAF_L} fill="#4cc26a"/>,
//     <Path key="l2" d={LEAF_R} fill="#4cc26a"/>,
//     ...PETAL_CENTERS.map((c,i)=><Circle key={'p'+i} cx={c[0]} cy={c[1]} r={50} fill={PETAL_COLORS[i]}/>),
//     <Circle key="c" cx={150} cy={140} r={28} fill="#ffd84a"/>,
//   ];

//   const revealHeight=reveal.interpolate({inputRange:[0,1],outputRange:[0,height]});
//   const brushY=reveal.interpolate({inputRange:[0,1],outputRange:[0,height-6]});
//   const brushOpacity=reveal.interpolate({inputRange:[0,0.03,0.97,1],outputRange:[0,1,1,0]});

//   return <View style={{width,height}}>
//     {/* SVG colour layers (only when there is no real coloured image) */}
//     {!realColor&&layers.map((el,i)=>
//       <Animated.View key={i} pointerEvents="none" style={[abs,{opacity:paint[i],transform:[{scale:paint[i].interpolate({inputRange:[0,1],outputRange:[0.75,1]})}]}]}>
//         <Svg width={width} height={height} viewBox={vb}>{el}</Svg>
//       </Animated.View>)}

//     {/* white chalk outline: real image if set, otherwise SVG lines */}
//     <Animated.View pointerEvents="none" style={[abs,{width,height,opacity:line}]}>
//       {realOutline
//         ?<Image source={FLOWER_OUTLINE_IMG} style={{width,height}} resizeMode="contain"/>
//         :<Svg width={width} height={height} viewBox={vb}>
//           <Path d={PETALS} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/>
//           <Circle cx={150} cy={140} r={28} fill="none" stroke={CHALK} strokeWidth={6}/>
//           <Path d={STEM} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round"/>
//           <Path d={LEAF_L} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/>
//           <Path d={LEAF_R} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/>
//         </Svg>}
//     </Animated.View>

//     {/* real coloured image: paint wipes in from the top */}
//     {realColor&&<Animated.View pointerEvents="none" style={[abs,{width,height:revealHeight,overflow:'hidden'}]}>
//       <Image source={FLOWER_COLORED_IMG} style={{position:'absolute',left:0,top:0,width,height}} resizeMode="contain"/>
//     </Animated.View>}

//     {/* wet paint line that moves down with the wipe */}
//     {realColor&&<Animated.View pointerEvents="none" style={[abs,{width,height:6,borderRadius:3,backgroundColor:'rgba(255,255,255,0.55)',opacity:brushOpacity,transform:[{translateY:brushY}]}]}/>}

//     {/* blurred flower-shaped chalk fog (scatters when the pencil is used) */}
//     <Animated.View pointerEvents="none" style={[abs,{width,height,
//       opacity:Animated.multiply(smudge,dust.interpolate({inputRange:[0,1],outputRange:[0.8,1]})),
//       transform:[{scale:smudgeScale}]}]}>
//       <Svg width={width} height={height} viewBox={vb}>
//         {/* soft fill so the shape reads as a cloud */}
//         <Path d={PETALS} fill={SMUDGE} fillOpacity={0.12}/>
//         <Circle cx={150} cy={140} r={28} fill={SMUDGE} fillOpacity={0.10}/>
//         <Path d={LEAF_L} fill={SMUDGE} fillOpacity={0.10}/>
//         <Path d={LEAF_R} fill={SMUDGE} fillOpacity={0.10}/>
//         {BLUR_LAYERS.map((b,i)=>
//           <G key={i}>
//             <Path d={PETALS} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w} strokeLinejoin="round"/>
//             <Circle cx={150} cy={140} r={28} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w}/>
//             <Path d={STEM} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w} strokeLinecap="round"/>
//             <Path d={LEAF_L} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w} strokeLinejoin="round"/>
//             <Path d={LEAF_R} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w} strokeLinejoin="round"/>
//           </G>)}
//       </Svg>
//     </Animated.View>

//     {/* chalk dust puffs flying out of the flower */}
//     {PUFFS.map((p,i)=>
//       <Animated.View key={'puff'+i} pointerEvents="none" style={{
//         position:'absolute',
//         left:width/2-p.s/2,
//         top:height*0.4-p.s/2,
//         width:p.s,height:p.s,borderRadius:p.s/2,
//         backgroundColor:SMUDGE,
//         opacity:puff.interpolate({inputRange:[0,0.2,1],outputRange:[0,0.7,0]}),
//         transform:[
//           {translateX:puff.interpolate({inputRange:[0,1],outputRange:[0,p.dx*p.d*width*1.6]})},
//           {translateY:puff.interpolate({inputRange:[0,1],outputRange:[0,p.dy*p.d*width*1.6]})},
//           {scale:puff.interpolate({inputRange:[0,1],outputRange:[0.5,1.7]})},
//         ]}}/>)}
//   </View>;
// }

// /* =========================================================
//    TOOL ICONS  (viewBox 100 x 100)
// ========================================================= */

// const INK='#4a3a1a';
// const pencilBody=(
//   <G>
//     <Rect x={40} y={26} width={20} height={44} fill="#ffcf3a" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
//     <Rect x={50} y={26} width={10} height={44} fill="#f0b520"/>
//     <Rect x={40} y={6} width={20} height={12} rx={4} fill="#f48fb1" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
//     <Rect x={40} y={18} width={20} height={8} fill="#c9ced6" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
//     <Path d="M40 70 H60 L50 92 Z" fill="#f3d2a2" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
//     <Path d="M46 82 H54 L50 92 Z" fill="#333"/>
//   </G>
// );

// export function ToolIcon({id,size}:{id:string;size:number}){
//   let art:any=null;

//   if(id==='pencil'){
//     art=<G transform="rotate(35 50 50)">{pencilBody}</G>;
//   }else if(id==='sketch'){
//     art=<G>
//       <G transform="rotate(30 50 50)">{pencilBody}</G>
//       <Path d="M12 90 q8 -10 16 0 t16 0" fill="none" stroke="#888" strokeWidth={3} strokeLinecap="round"/>
//     </G>;
//   }else if(id==='scissors'){
//     art=<G>
//       <Path d="M46 52 L32 8 L44 6 L56 48 Z" fill="#cfd4dc" stroke="#5b6068" strokeWidth={2.5} strokeLinejoin="round"/>
//       <Path d="M54 52 L68 8 L56 6 L44 48 Z" fill="#b9bfc8" stroke="#5b6068" strokeWidth={2.5} strokeLinejoin="round"/>
//       <Circle cx={50} cy={52} r={3.5} fill="#777"/>
//       <Path d="M48 55 L36 68 M52 55 L64 68" stroke="#d62d2d" strokeWidth={6} fill="none" strokeLinecap="round"/>
//       <Ellipse cx={30} cy={78} rx={11} ry={9} stroke="#d62d2d" strokeWidth={6} fill="none"/>
//       <Ellipse cx={70} cy={78} rx={11} ry={9} stroke="#d62d2d" strokeWidth={6} fill="none"/>
//     </G>;
//   }else if(id==='pen'){
//     art=<G transform="rotate(35 50 50)">
//       <Rect x={42} y={12} width={16} height={58} rx={7} fill="#2f7fe0" stroke="#173f88" strokeWidth={2.5}/>
//       <Rect x={56} y={16} width={5} height={28} rx={2} fill="#1a4fa0" stroke="#173f88" strokeWidth={1.5}/>
//       <Rect x={42} y={12} width={16} height={10} rx={5} fill="#5aa2f0"/>
//       <Path d="M43 70 H57 L50 92 Z" fill="#a9c9f5" stroke="#173f88" strokeWidth={2.5} strokeLinejoin="round"/>
//       <Path d="M48 86 H52 L50 92 Z" fill="#222"/>
//     </G>;
//   }else if(id==='paintbrush'||id==='paint'||id==='brush'){
//     art=<G transform="rotate(35 50 50)">
//       <Path d="M45 44 H55 L57 94 Q50 98 43 94 Z" fill="#a8642a" stroke="#5a3210" strokeWidth={2.5} strokeLinejoin="round"/>
//       <Rect x={42} y={28} width={16} height={17} fill="#d5d9e0" stroke="#6b7078" strokeWidth={2.5}/>
//       <Path d="M43 28 Q38 10 50 3 Q62 10 57 28 Z" fill="#f0c06a" stroke="#6b4a1a" strokeWidth={2.5} strokeLinejoin="round"/>
//       <Path d="M42 17 Q50 -2 58 17 Q50 12 42 17 Z" fill="#2f6fe0"/>
//     </G>;
//   }else if(id==='crayons'){
//     const cr=(x:number,h:number,c:string)=><G key={x}>
//       <Rect x={x} y={70-h} width={16} height={h} fill={c} stroke="#222" strokeWidth={2} strokeLinejoin="round"/>
//       <Rect x={x} y={70-h+10} width={16} height={12} fill="#fff" fillOpacity={0.85} stroke="#222" strokeWidth={1.2}/>
//       <Path d={`M${x} ${70-h} L${x+8} ${70-h-12} L${x+16} ${70-h} Z`} fill={c} stroke="#222" strokeWidth={2} strokeLinejoin="round"/>
//     </G>;
//     art=<G>{cr(10,46,'#e53935')}{cr(30,52,'#1e88e5')}{cr(50,50,'#43a047')}{cr(70,44,'#fdd835')}</G>;
//   }

//   return <Svg width={size} height={size} viewBox="0 0 100 100">{art}</Svg>;
// }

// /* =========================================================
//    SMALL CHALKBOARD DECORATIONS
// ========================================================= */

// // three yellow dashes next to the title (flip=true for the right side)
// export function Sparks({flip}:{flip?:boolean}){
//   const ln={stroke:'#ffd33d',strokeWidth:4,strokeLinecap:'round' as const};
//   return <View style={{width:26,height:34,transform:[{scaleX:flip?-1:1}]}}>
//     <Svg width={26} height={34} viewBox="0 0 26 34">
//       <Line x1={4} y1={6} x2={16} y2={12} {...ln}/><Line x1={2} y1={18} x2={16} y2={18} {...ln}/><Line x1={4} y1={30} x2={16} y2={24} {...ln}/>
//     </Svg>
//   </View>;
// }

// // dashed curved arrow that points from the tool to the flower
// export function DashedArrow(){
//   return <Svg width={46} height={56} viewBox="0 0 46 56">
//     <Path d="M6 54 C4 30 18 14 38 10" fill="none" stroke="#fff" strokeWidth={2.5} strokeDasharray="5 5" strokeLinecap="round"/>
//     <Path d="M30 3 L40 10 L31 18" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
//   </Svg>;
// }

// export function HomeIcon(){
//   return <Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#1b1b1b" stroke="#1b1b1b" strokeWidth={1.5} strokeLinejoin="round"/></Svg>;
// }

// export function GearIcon(){
//   return <Svg width={22} height={22} viewBox="0 0 24 24">
//     <Circle cx={12} cy={12} r={8} stroke="#1b1b1b" strokeWidth={4} strokeDasharray="3 3.3" fill="none"/>
//     <Circle cx={12} cy={12} r={5} fill="none" stroke="#1b1b1b" strokeWidth={2.6}/>
//   </Svg>;
// }

// export function BulbIcon({size=24}:{size?:number}){
//   return <Svg width={size} height={size} viewBox="0 0 24 24">
//     <Circle cx={12} cy={10} r={6.5} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
//     <Rect x={9.5} y={16.5} width={5} height={4} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
//   </Svg>;
// }

// export function StarIcon({size=40,on=true}:{size?:number;on?:boolean}){
//   const pts=Array.from({length:10},(_,i)=>{
//     const r=i%2?9:21,a=(-90+i*36)*Math.PI/180;
//     return `${(24+r*Math.cos(a)).toFixed(1)},${(25+r*Math.sin(a)).toFixed(1)}`;
//   }).join(' ');
//   return <Svg width={size} height={size} viewBox="0 0 48 48">
//     <Polygon points={pts} fill={on?'#ffd33d':'none'} stroke={on?'#f5a800':'rgba(255,255,255,0.5)'} strokeWidth={3} strokeLinejoin="round"/>
//   </Svg>;
// }

// // wooden chalk tray with an eraser and two chalk sticks
// export function ChalkTray(){
//   return <View style={st.tray}>
//     <View style={st.ledge}/>
//     <View style={st.eraser}>
//       <View style={st.eraserTop}/>
//       <View style={st.eraserBottom}><View style={st.eraserLine}/><View style={st.eraserLine}/></View>
//     </View>
//     <View style={[st.chalk,{left:'33%',bottom:12,width:46}]}/>
//     <View style={[st.chalk,{left:'50%',bottom:14,width:40,transform:[{rotate:'-12deg'}]}]}/>
//   </View>;
// }

// const st=StyleSheet.create({
//   tray:{height:44,width:'100%'},
//   ledge:{position:'absolute',left:0,right:0,bottom:0,height:20,backgroundColor:'#e08a2e',borderTopWidth:3,borderTopColor:'#f2a64a'},
//   eraser:{position:'absolute',left:'8%',bottom:12,width:62,height:30},
//   eraserTop:{height:14,backgroundColor:'#b0702a',borderTopLeftRadius:4,borderTopRightRadius:4},
//   eraserBottom:{height:16,backgroundColor:'#222',borderBottomLeftRadius:3,borderBottomRightRadius:3,justifyContent:'space-evenly',paddingHorizontal:3},
//   eraserLine:{height:2,backgroundColor:'#555'},
//   chalk:{position:'absolute',height:8,borderRadius:4,backgroundColor:'#f6f3ea'},
// });
import React,{useEffect,useRef} from 'react';
import {View,Animated,StyleSheet,Image,Easing} from 'react-native';
import Svg,{Circle,Path,Rect,Ellipse,G,Polygon,Line} from 'react-native-svg';

/* =========================================================
   REAL FLOWER IMAGES
   Images ready aana apram null-ku badhula require use pannunga:
   export const FLOWER_OUTLINE_IMG:any=require('../../../assets/flower_outline.png');
   export const FLOWER_COLORED_IMG:any=require('../../../assets/flower_colored.png');
   null irundha SVG flower use aagum.
========================================================= */
export const FLOWER_OUTLINE_IMG:any=null;
export const FLOWER_COLORED_IMG:any=null;

export type Phase='blurred'|'outline'|'colored';

/* =========================================================
   FLOWER GEOMETRY  (viewBox 300 x 400)
========================================================= */

// outline of the 5 petals joined together
const PETALS='M100.1 71.3 A50 50 0 0 1 199.9 71.3 A50 50 0 0 1 230.8 166.2 A50 50 0 0 1 150.0 224.9 A50 50 0 0 1 69.2 166.2 A50 50 0 0 1 100.1 71.3 Z';
const PETAL_CENTERS=[[150,74],[212.8,119.6],[188.8,193.4],[111.2,193.4],[87.2,119.6]];
const PETAL_COLORS=['#ff79b0','#ff8ec0','#ff6aa8','#ff8ec0','#ff79b0'];
const STEM='M150 232 L150 372';
const LEAF_L='M150 372 C100 372 62 340 56 292 C108 292 146 322 150 372 Z';
const LEAF_R='M150 372 C200 372 238 340 244 292 C192 292 154 322 150 372 Z';

const CHALK='#ffffff';
const SMUDGE='#e9f7ef';

// blur = the same flower shape drawn many times with fat, faint strokes
const BLUR_LAYERS=[
  {w:48,o:0.07},{w:38,o:0.08},{w:30,o:0.09},{w:22,o:0.10},{w:15,o:0.12},{w:8,o:0.14},
];

// chalk dust puffs that fly out when the fog is wiped away
const PUFFS=Array.from({length:12},(_,i)=>{
  const a=(i/12)*Math.PI*2+0.25;
  return {dx:Math.cos(a),dy:Math.sin(a),d:0.26+(i%3)*0.09,s:16+(i%4)*7};
});

/* =========================================================
   CHALK FLOWER
   blurred -> outline : fog scatters like dust, outline fades in
   outline -> colored : flower is painted
========================================================= */

export function ChalkFlower({phase,width}:{phase:Phase;width:number}){
  const height=width*4/3;
  const realOutline=!!FLOWER_OUTLINE_IMG;
  const realColor=!!FLOWER_COLORED_IMG;

  const smudge=useRef(new Animated.Value(phase==='blurred'?1:0)).current;
  const smudgeScale=useRef(new Animated.Value(1)).current;
  const puff=useRef(new Animated.Value(0)).current;
  const line=useRef(new Animated.Value(phase==='blurred'?0:1)).current;
  const paint=useRef(Array.from({length:9},()=>new Animated.Value(phase==='colored'?1:0))).current;
  const reveal=useRef(new Animated.Value(phase==='colored'?1:0)).current;
  const dust=useRef(new Animated.Value(0)).current;
  const prev=useRef<Phase>(phase);

  // slow breathing of the chalk dust
  useEffect(()=>{
    const l=Animated.loop(Animated.sequence([
      Animated.timing(dust,{toValue:1,duration:1800,useNativeDriver:true}),
      Animated.timing(dust,{toValue:0,duration:1800,useNativeDriver:true})]));
    l.start();
    return()=>l.stop();
  },[]);

  useEffect(()=>{
    if(prev.current===phase)return;
    if(phase==='outline'){
      // pencil used: the fog is wiped away, the clear flower appears
      puff.setValue(0);
      smudgeScale.setValue(1);
      Animated.parallel([
        Animated.timing(smudge,{toValue:0,duration:1100,easing:Easing.out(Easing.quad),useNativeDriver:true}),
        Animated.timing(smudgeScale,{toValue:1.35,duration:1100,easing:Easing.out(Easing.quad),useNativeDriver:true}),
        Animated.timing(puff,{toValue:1,duration:1000,easing:Easing.out(Easing.quad),useNativeDriver:true}),
        Animated.sequence([
          Animated.delay(450),
          Animated.timing(line,{toValue:1,duration:900,useNativeDriver:true})]),
      ]).start();
    }else if(phase==='colored'){
      smudge.setValue(0);line.setValue(1);
      if(realColor){
        // paint wipes down over the real outline image
        reveal.setValue(0);
        Animated.timing(reveal,{toValue:1,duration:1600,easing:Easing.inOut(Easing.quad),useNativeDriver:false}).start();
      }else{
        Animated.stagger(120,paint.map(p=>Animated.spring(p,{toValue:1,friction:6,tension:60,useNativeDriver:true}))).start();
      }
    }else{
      smudge.setValue(1);smudgeScale.setValue(1);puff.setValue(0);
      line.setValue(0);reveal.setValue(0);paint.forEach(p=>p.setValue(0));
    }
    prev.current=phase;
  },[phase]);

  const abs:any={position:'absolute',left:0,top:0};
  const vb='0 0 300 400';

  // the 9 colour layers (stem, 2 leaves, 5 petals, centre) - SVG fallback
  const layers=[
    <Path key="s" d={STEM} stroke="#3aa655" strokeWidth={9} strokeLinecap="round" fill="none"/>,
    <Path key="l1" d={LEAF_L} fill="#4cc26a"/>,
    <Path key="l2" d={LEAF_R} fill="#4cc26a"/>,
    ...PETAL_CENTERS.map((c,i)=><Circle key={'p'+i} cx={c[0]} cy={c[1]} r={50} fill={PETAL_COLORS[i]}/>),
    <Circle key="c" cx={150} cy={140} r={28} fill="#ffd84a"/>,
  ];

  const revealHeight=reveal.interpolate({inputRange:[0,1],outputRange:[0,height]});
  const brushY=reveal.interpolate({inputRange:[0,1],outputRange:[0,height-6]});
  const brushOpacity=reveal.interpolate({inputRange:[0,0.03,0.97,1],outputRange:[0,1,1,0]});

  return <View style={{width,height}}>
    {/* SVG colour layers (only when there is no real coloured image) */}
    {!realColor&&layers.map((el,i)=>
      <Animated.View key={i} pointerEvents="none" style={[abs,{opacity:paint[i],transform:[{scale:paint[i].interpolate({inputRange:[0,1],outputRange:[0.75,1]})}]}]}>
        <Svg width={width} height={height} viewBox={vb}>{el}</Svg>
      </Animated.View>)}

    {/* white chalk outline: real image if set, otherwise SVG lines */}
    <Animated.View pointerEvents="none" style={[abs,{width,height,opacity:line}]}>
      {realOutline
        ?<Image source={FLOWER_OUTLINE_IMG} style={{width,height}} resizeMode="contain"/>
        :<Svg width={width} height={height} viewBox={vb}>
          <Path d={PETALS} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/>
          <Circle cx={150} cy={140} r={28} fill="none" stroke={CHALK} strokeWidth={6}/>
          <Path d={STEM} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round"/>
          <Path d={LEAF_L} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/>
          <Path d={LEAF_R} fill="none" stroke={CHALK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>}
    </Animated.View>

    {/* real coloured image: paint wipes in from the top */}
    {realColor&&<Animated.View pointerEvents="none" style={[abs,{width,height:revealHeight,overflow:'hidden'}]}>
      <Image source={FLOWER_COLORED_IMG} style={{position:'absolute',left:0,top:0,width,height}} resizeMode="contain"/>
    </Animated.View>}

    {/* wet paint line that moves down with the wipe */}
    {realColor&&<Animated.View pointerEvents="none" style={[abs,{width,height:6,borderRadius:3,backgroundColor:'rgba(255,255,255,0.55)',opacity:brushOpacity,transform:[{translateY:brushY}]}]}/>}

    {/* blurred flower-shaped chalk fog (scatters when the pencil is used) */}
    <Animated.View pointerEvents="none" style={[abs,{width,height,
      opacity:Animated.multiply(smudge,dust.interpolate({inputRange:[0,1],outputRange:[0.8,1]})),
      transform:[{scale:smudgeScale}]}]}>
      <Svg width={width} height={height} viewBox={vb}>
        {/* soft fill so the shape reads as a cloud */}
        <Path d={PETALS} fill={SMUDGE} fillOpacity={0.12}/>
        <Circle cx={150} cy={140} r={28} fill={SMUDGE} fillOpacity={0.10}/>
        <Path d={LEAF_L} fill={SMUDGE} fillOpacity={0.10}/>
        <Path d={LEAF_R} fill={SMUDGE} fillOpacity={0.10}/>
        {BLUR_LAYERS.map((b,i)=>
          <G key={i}>
            <Path d={PETALS} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w} strokeLinejoin="round"/>
            <Circle cx={150} cy={140} r={28} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w}/>
            <Path d={STEM} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w} strokeLinecap="round"/>
            <Path d={LEAF_L} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w} strokeLinejoin="round"/>
            <Path d={LEAF_R} fill="none" stroke={SMUDGE} strokeOpacity={b.o} strokeWidth={b.w} strokeLinejoin="round"/>
          </G>)}
      </Svg>
    </Animated.View>

    {/* chalk dust puffs flying out of the flower */}
    {PUFFS.map((p,i)=>
      <Animated.View key={'puff'+i} pointerEvents="none" style={{
        position:'absolute',
        left:width/2-p.s/2,
        top:height*0.4-p.s/2,
        width:p.s,height:p.s,borderRadius:p.s/2,
        backgroundColor:SMUDGE,
        opacity:puff.interpolate({inputRange:[0,0.2,1],outputRange:[0,0.7,0]}),
        transform:[
          {translateX:puff.interpolate({inputRange:[0,1],outputRange:[0,p.dx*p.d*width*1.6]})},
          {translateY:puff.interpolate({inputRange:[0,1],outputRange:[0,p.dy*p.d*width*1.6]})},
          {scale:puff.interpolate({inputRange:[0,1],outputRange:[0.5,1.7]})},
        ]}}/>)}
  </View>;
}

/* =========================================================
   TOOL ICONS  (viewBox 100 x 100)
========================================================= */

const INK='#4a3a1a';
const pencilBody=(
  <G>
    <Rect x={40} y={26} width={20} height={44} fill="#ffcf3a" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
    <Rect x={50} y={26} width={10} height={44} fill="#f0b520"/>
    <Rect x={40} y={6} width={20} height={12} rx={4} fill="#f48fb1" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
    <Rect x={40} y={18} width={20} height={8} fill="#c9ced6" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
    <Path d="M40 70 H60 L50 92 Z" fill="#f3d2a2" stroke={INK} strokeWidth={2.5} strokeLinejoin="round"/>
    <Path d="M46 82 H54 L50 92 Z" fill="#333"/>
  </G>
);

export function ToolIcon({id,size}:{id:string;size:number}){
  let art:any=null;

  if(id==='pencil'){
    art=<G transform="rotate(35 50 50)">{pencilBody}</G>;
  }else if(id==='sketch'){
    art=<G>
      <G transform="rotate(30 50 50)">{pencilBody}</G>
      <Path d="M12 90 q8 -10 16 0 t16 0" fill="none" stroke="#888" strokeWidth={3} strokeLinecap="round"/>
    </G>;
  }else if(id==='scissors'){
    art=<G>
      <Path d="M46 52 L32 8 L44 6 L56 48 Z" fill="#cfd4dc" stroke="#5b6068" strokeWidth={2.5} strokeLinejoin="round"/>
      <Path d="M54 52 L68 8 L56 6 L44 48 Z" fill="#b9bfc8" stroke="#5b6068" strokeWidth={2.5} strokeLinejoin="round"/>
      <Circle cx={50} cy={52} r={3.5} fill="#777"/>
      <Path d="M48 55 L36 68 M52 55 L64 68" stroke="#d62d2d" strokeWidth={6} fill="none" strokeLinecap="round"/>
      <Ellipse cx={30} cy={78} rx={11} ry={9} stroke="#d62d2d" strokeWidth={6} fill="none"/>
      <Ellipse cx={70} cy={78} rx={11} ry={9} stroke="#d62d2d" strokeWidth={6} fill="none"/>
    </G>;
  }else if(id==='pen'){
    art=<G transform="rotate(35 50 50)">
      <Rect x={42} y={12} width={16} height={58} rx={7} fill="#2f7fe0" stroke="#173f88" strokeWidth={2.5}/>
      <Rect x={56} y={16} width={5} height={28} rx={2} fill="#1a4fa0" stroke="#173f88" strokeWidth={1.5}/>
      <Rect x={42} y={12} width={16} height={10} rx={5} fill="#5aa2f0"/>
      <Path d="M43 70 H57 L50 92 Z" fill="#a9c9f5" stroke="#173f88" strokeWidth={2.5} strokeLinejoin="round"/>
      <Path d="M48 86 H52 L50 92 Z" fill="#222"/>
    </G>;
  }else if(id==='paintbrush'||id==='paint'||id==='brush'){
    art=<G transform="rotate(35 50 50)">
      <Path d="M45 44 H55 L57 94 Q50 98 43 94 Z" fill="#a8642a" stroke="#5a3210" strokeWidth={2.5} strokeLinejoin="round"/>
      <Rect x={42} y={28} width={16} height={17} fill="#d5d9e0" stroke="#6b7078" strokeWidth={2.5}/>
      <Path d="M43 28 Q38 10 50 3 Q62 10 57 28 Z" fill="#f0c06a" stroke="#6b4a1a" strokeWidth={2.5} strokeLinejoin="round"/>
      <Path d="M42 17 Q50 -2 58 17 Q50 12 42 17 Z" fill="#2f6fe0"/>
    </G>;
  }else if(id==='crayons'){
    const cr=(x:number,h:number,c:string)=><G key={x}>
      <Rect x={x} y={70-h} width={16} height={h} fill={c} stroke="#222" strokeWidth={2} strokeLinejoin="round"/>
      <Rect x={x} y={70-h+10} width={16} height={12} fill="#fff" fillOpacity={0.85} stroke="#222" strokeWidth={1.2}/>
      <Path d={`M${x} ${70-h} L${x+8} ${70-h-12} L${x+16} ${70-h} Z`} fill={c} stroke="#222" strokeWidth={2} strokeLinejoin="round"/>
    </G>;
    art=<G>{cr(10,46,'#e53935')}{cr(30,52,'#1e88e5')}{cr(50,50,'#43a047')}{cr(70,44,'#fdd835')}</G>;
  }

  return <Svg width={size} height={size} viewBox="0 0 100 100">{art}</Svg>;
}

/* =========================================================
   SMALL CHALKBOARD DECORATIONS
========================================================= */

// three yellow dashes next to the title (flip=true for the right side)
export function Sparks({flip}:{flip?:boolean}){
  const ln={stroke:'#ffd33d',strokeWidth:4,strokeLinecap:'round' as const};
  return <View style={{width:26,height:34,transform:[{scaleX:flip?-1:1}]}}>
    <Svg width={26} height={34} viewBox="0 0 26 34">
      <Line x1={4} y1={6} x2={16} y2={12} {...ln}/><Line x1={2} y1={18} x2={16} y2={18} {...ln}/><Line x1={4} y1={30} x2={16} y2={24} {...ln}/>
    </Svg>
  </View>;
}

// dashed curved arrow that points from the tool to the flower
export function DashedArrow(){
  return <Svg width={46} height={56} viewBox="0 0 46 56">
    <Path d="M6 54 C4 30 18 14 38 10" fill="none" stroke="#fff" strokeWidth={2.5} strokeDasharray="5 5" strokeLinecap="round"/>
    <Path d="M30 3 L40 10 L31 18" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>;
}

export function HomeIcon(){
  return <Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#1b1b1b" stroke="#1b1b1b" strokeWidth={1.5} strokeLinejoin="round"/></Svg>;
}

export function GearIcon(){
  return <Svg width={22} height={22} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={8} stroke="#1b1b1b" strokeWidth={4} strokeDasharray="3 3.3" fill="none"/>
    <Circle cx={12} cy={12} r={5} fill="none" stroke="#1b1b1b" strokeWidth={2.6}/>
  </Svg>;
}

export function BulbIcon({size=24}:{size?:number}){
  return <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx={12} cy={10} r={6.5} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
    <Rect x={9.5} y={16.5} width={5} height={4} fill="#ffd83a" stroke="#1b1b1b" strokeWidth={1.8}/>
  </Svg>;
}

export function StarIcon({size=40,on=true}:{size?:number;on?:boolean}){
  const pts=Array.from({length:10},(_,i)=>{
    const r=i%2?9:21,a=(-90+i*36)*Math.PI/180;
    return `${(24+r*Math.cos(a)).toFixed(1)},${(25+r*Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return <Svg width={size} height={size} viewBox="0 0 48 48">
    <Polygon points={pts} fill={on?'#ffd33d':'none'} stroke={on?'#f5a800':'rgba(255,255,255,0.5)'} strokeWidth={3} strokeLinejoin="round"/>
  </Svg>;
}

// wooden chalk tray with an eraser and two chalk sticks
export function ChalkTray(){
  return <View style={st.tray}>
    <View style={st.ledge}/>
    <View style={st.eraser}>
      <View style={st.eraserTop}/>
      <View style={st.eraserBottom}><View style={st.eraserLine}/><View style={st.eraserLine}/></View>
    </View>
    <View style={[st.chalk,{left:'33%',bottom:12,width:46}]}/>
    <View style={[st.chalk,{left:'50%',bottom:14,width:40,transform:[{rotate:'-12deg'}]}]}/>
  </View>;
}

const st=StyleSheet.create({
  tray:{height:44,width:'100%'},
  ledge:{position:'absolute',left:0,right:0,bottom:0,height:20,backgroundColor:'#e08a2e',borderTopWidth:3,borderTopColor:'#f2a64a'},
  eraser:{position:'absolute',left:'8%',bottom:12,width:62,height:30},
  eraserTop:{height:14,backgroundColor:'#b0702a',borderTopLeftRadius:4,borderTopRightRadius:4},
  eraserBottom:{height:16,backgroundColor:'#222',borderBottomLeftRadius:3,borderBottomRightRadius:3,justifyContent:'space-evenly',paddingHorizontal:3},
  eraserLine:{height:2,backgroundColor:'#555'},
  chalk:{position:'absolute',height:8,borderRadius:4,backgroundColor:'#f6f3ea'},
});