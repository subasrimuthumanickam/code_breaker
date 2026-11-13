
// // // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // // import {View,Text,Animated,Pressable,PanResponder,Platform,Easing,StyleSheet} from 'react-native';
// // // // // // import Svg,{Rect,Path,Circle,Ellipse,G,Polygon,Line,Defs,LinearGradient,Stop} from 'react-native-svg';
// // // // // // import {F,INK,Coin} from './BTShared';
// // // // // // import {Icon} from './Art';
// // // // // // import {play,stop} from './BTSound';



// // // // // // const NAVY='#132f70',CREAM='#faf0e2',K='#1d1d1d';
// // // // // // const SERIF:any=Platform.select({web:'"Playfair Display",Georgia,"Times New Roman",serif',ios:'Georgia-Italic',default:'serif'});
// // // // // // const DW=942,DH=1669;
// // // // // // const WALL='#8fd3f4';


// // // // // // const CLUES=[
// // // // // //   'Combine the two correct numbers to reveal the final answer!',
// // // // // // ];
// // // // // // const CLUE_COST=25; // only shown on the pill
// // // // // // const LockArt=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Path d="M30 46 V34 a20 20 0 0 1 40 0 V46" fill="none" stroke="#7a6a55" strokeWidth="9" strokeLinecap="round"/><Rect x="20" y="44" width="60" height="44" rx="10" fill="#9b8a72"/><Circle cx="50" cy="63" r="6" fill="#f4e8d2"/><Rect x="47" y="63" width="6" height="15" rx="3" fill="#f4e8d2"/></Svg>;

// // // // // // /* ---------- eraser / pencil arts ---------- */
// // // // // // const EraserArt=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#2ea3e6" stroke={K} strokeWidth="2.5"/><Path d="M4 20 Q4 8 16 8 H46 V54 H16 Q4 54 4 42 Z" fill="#fff" stroke={K} strokeWidth="2.5"/></Svg>;
// // // // // // const PencilArt=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke={K} strokeWidth="1.5"/><Polygon points="2,15 10,11.5 10,18.5" fill={K}/><Rect x="26" y="4" width="84" height="22" fill="#1f9a4a" stroke={K} strokeWidth="1.5"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#b8b8b8" stroke={K} strokeWidth="1.5"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#8a8a8a" stroke={K} strokeWidth="1.5"/></Svg>;

// // // // // // /* ---------- garden scene (drawn in design coordinates) ---------- */
// // // // // // const Cloud=({x,y,s}:any)=><G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.96"><Ellipse cx="0" cy="0" rx="70" ry="34"/><Ellipse cx="-52" cy="12" rx="48" ry="26"/><Ellipse cx="56" cy="14" rx="52" ry="26"/><Ellipse cx="8" cy="-26" rx="44" ry="30"/></G>;
// // // // // // const Flower=({x,y,s=1}:any)=><G transform={`translate(${x} ${y}) scale(${s})`}>
// // // // // //   <Path d="M-26 28 Q-8 -4 0 10 Q10 -6 30 26 Q10 20 0 30 Q-12 20 -26 28Z" fill="#4faa2e"/>
// // // // // //   {[0,72,144,216,288].map(a=><Ellipse key={a} cx="0" cy="-17" rx="11" ry="17" fill="#fff" stroke="#e8e0d0" strokeWidth="1.5" transform={`rotate(${a})`}/>)}
// // // // // //   <Circle cx="0" cy="0" r="9" fill="#f9c933"/></G>;
// // // // // // const Tuft=({x,y,s=1}:any)=><Path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0 Q-8 -34 -18 -50 Q-2 -30 3 -46 Q10 -24 26 -40 Q12 -14 16 0Z" fill="#58b82f"/>;
// // // // // // const Rock=({x,y,w,h}:any)=><G><Ellipse cx={x} cy={y} rx={w} ry={h} fill="#8f969e"/><Ellipse cx={x-w*0.2} cy={y-h*0.3} rx={w*0.55} ry={h*0.4} fill="#aeb4bb"/></G>;
// // // // // // const Chain=({h}:any)=><Svg width={h*0.34} height={h} viewBox="0 0 20 60"><Ellipse cx="10" cy="9" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/><Ellipse cx="10" cy="27" rx="6" ry="9" fill="none" stroke="#6a5540" strokeWidth="3.2"/><Ellipse cx="10" cy="45" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/></Svg>;
// // // // // // const FFIcon=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Polygon points="14,22 50,50 14,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/><Polygon points="52,22 88,50 52,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/></Svg>;

// // // // // // function Room({w,h}:any){
// // // // // //   const books1:any[]=[[822,36,112,'#2fa6a0'],[860,34,122,'#f27ab0'],[896,40,106,'#8a63da']];
// // // // // //   const books2:any[]=[[822,32,102,'#e5483f'],[856,26,92,'#2f8fd8'],[884,44,118,'#3eae52']];
// // // // // //   const books3:any[]=[[822,34,96,'#f4c431'],[858,38,124,'#2f6fd0'],[898,34,104,'#e8913a']];
// // // // // //   const shelf=(arr:any[],bottom:number)=>arr.map((b,i)=><Rect key={bottom+'-'+i} x={b[0]} y={bottom-b[2]} width={b[1]} height={b[2]} rx="4" fill={b[3]} stroke="rgba(0,0,0,0.18)" strokeWidth="2"/>);
// // // // // //   return <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{position:'absolute',left:0,top:0}}>
// // // // // //     <Defs>
// // // // // //       <LinearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#4cb8ee"/><Stop offset="0.55" stopColor="#9ad8f6"/><Stop offset="1" stopColor="#d6f1fb"/></LinearGradient>
// // // // // //       <LinearGradient id="gGrass" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#97e050"/><Stop offset="1" stopColor="#4ba72d"/></LinearGradient>
// // // // // //       <LinearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#f0a94f"/><Stop offset="1" stopColor="#d98a3a"/></LinearGradient>
// // // // // //     </Defs>

// // // // // //     {/* sky + clouds */}
// // // // // //     <Rect width={DW} height={DH} fill="url(#gSky)"/>
// // // // // //     <Polygon points="250,0 430,0 150,1000 0,1000" fill="#fff" opacity="0.08"/>
// // // // // //     <Polygon points="520,0 640,0 420,1000 330,1000" fill="#fff" opacity="0.06"/>
// // // // // //     <Cloud x={170} y={340} s={0.9}/><Cloud x={800} y={310} s={0.8}/><Cloud x={760} y={760} s={1}/><Cloud x={80} y={800} s={0.7}/>

// // // // // //     {/* far bushes behind the fence */}
// // // // // //     <Ellipse cx="110" cy="975" rx="170" ry="95" fill="#62b83a"/><Ellipse cx="60" cy="940" rx="110" ry="80" fill="#74c746"/>
// // // // // //     <Ellipse cx="360" cy="1000" rx="150" ry="70" fill="#6cc03f"/>
// // // // // //     <Ellipse cx="610" cy="990" rx="190" ry="80" fill="#5db535"/>
// // // // // //     <Ellipse cx="870" cy="965" rx="150" ry="85" fill="#6cc03f"/>

// // // // // //     {/* meadow */}
// // // // // //     <Path d="M0 1050 Q471 1005 942 1050 V1669 H0Z" fill="url(#gGrass)"/>

// // // // // //     {/* wooden fence */}
// // // // // //     <Rect x="0" y="1018" width={DW} height="18" fill="#e49c46"/>
// // // // // //     <Rect x="0" y="1070" width={DW} height="18" fill="#e49c46"/>
// // // // // //     {[0,1,2,3,4,5,6,7,8,9,10].map(i=>{const x=i*92-4;return <G key={'p'+i}>
// // // // // //       <Path d={`M${x} 1105 V985 L${x+27} 952 L${x+54} 985 V1105Z`} fill="#f0b45a" stroke="#c27a2a" strokeWidth="3"/>
// // // // // //       <Circle cx={x+27} cy="1000" r="4.5" fill="#8a5a2a"/><Circle cx={x+27} cy="1090" r="4.5" fill="#8a5a2a"/></G>})}

// // // // // //     {/* grass details */}
// // // // // //     <Tuft x={40} y={1140} s={1}/><Tuft x={250} y={1180} s={0.9}/><Tuft x={470} y={1150} s={0.8}/><Tuft x={700} y={1200} s={1}/>
// // // // // //     <Tuft x={150} y={1620} s={1.2}/><Tuft x={560} y={1650} s={1}/><Tuft x={780} y={1560} s={1}/>
// // // // // //     <Flower x={85} y={1135}/><Flower x={900} y={1255} s={0.9}/><Flower x={185} y={1610} s={1.1}/><Flower x={730} y={1630} s={1}/>
// // // // // //     <Rock x={60} y={1560} w={95} h={58}/><Rock x={875} y={1618} w={105} h={62}/><Rock x={110} y={1240} w={55} h={32}/>

// // // // // //     {/* window frame (left) */}
// // // // // //     <Rect x="0" y="190" width="192" height="18" fill="#e9a54e"/>
// // // // // //     <Rect x="168" y="190" width="24" height="492" fill="#e9a54e"/>
// // // // // //     <Rect x="0" y="400" width="192" height="16" fill="#e9a54e"/>
// // // // // //     <Polygon points="18,212 110,212 36,396 0,396 0,300" fill="#fff" opacity="0.22"/>
// // // // // //     <Rect x="0" y="646" width="218" height="38" fill="#f0b45e"/><Rect x="0" y="676" width="218" height="8" fill="#c98a3e" opacity="0.5"/>
// // // // // //     {/* cute plant on the sill */}
// // // // // //     <Ellipse cx="95" cy="520" rx="44" ry="92" fill="#58b132"/>
// // // // // //     <Ellipse cx="152" cy="505" rx="34" ry="80" fill="#6fc842" transform="rotate(16 152 505)"/>
// // // // // //     <Ellipse cx="42" cy="535" rx="32" ry="64" fill="#4ea12b" transform="rotate(-16 42 535)"/>
// // // // // //     <Rect x="34" y="566" width="126" height="82" rx="28" fill="#f7ede0"/>
// // // // // //     <Circle cx="76" cy="604" r="6" fill="#5b3a29"/><Circle cx="118" cy="604" r="6" fill="#5b3a29"/>
// // // // // //     <Ellipse cx="56" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/><Ellipse cx="138" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/>
// // // // // //     <Path d="M88 618 Q97 628 106 618" stroke="#5b3a29" strokeWidth="4" fill="none" strokeLinecap="round"/>

// // // // // //     {/* bookshelf (right) */}
// // // // // //     <Rect x="785" y="645" width="157" height="580" fill="#e8a24a"/>
// // // // // //     <Rect x="802" y="662" width="140" height="548" fill="#d58a33"/>
// // // // // //     {shelf(books1,826)}{shelf(books2,1006)}{shelf(books3,1190)}
// // // // // //     <Rect x="785" y="826" width="157" height="18" fill="#f2b862"/>
// // // // // //     <Rect x="785" y="1006" width="157" height="18" fill="#f2b862"/>
// // // // // //     <Rect x="785" y="1190" width="157" height="20" fill="#f2b862"/>
// // // // // //     <Rect x="785" y="645" width="157" height="20" fill="#f2b862"/>
// // // // // //     {/* plant on top of the shelf */}
// // // // // //     <Ellipse cx="850" cy="560" rx="26" ry="62" fill="#58b132" transform="rotate(-20 850 560)"/>
// // // // // //     <Ellipse cx="880" cy="545" rx="28" ry="72" fill="#6fc842"/>
// // // // // //     <Ellipse cx="912" cy="565" rx="24" ry="58" fill="#4ea12b" transform="rotate(22 912 565)"/>
// // // // // //     <Path d="M828 600 H934 L922 648 H840Z" fill="#e58a3e"/><Rect x="822" y="590" width="118" height="16" rx="6" fill="#f09a4a"/>

// // // // // //     {/* leaves in the top corners */}
// // // // // //     <Ellipse cx="30" cy="10" rx="170" ry="78" fill="#3f9f35"/><Ellipse cx="200" cy="0" rx="120" ry="52" fill="#58b940"/><Ellipse cx="90" cy="70" rx="80" ry="34" fill="#6fcb4c"/>
// // // // // //     <Ellipse cx="900" cy="8" rx="190" ry="84" fill="#3a9a32"/><Ellipse cx="730" cy="0" rx="115" ry="48" fill="#58b940"/><Ellipse cx="860" cy="78" rx="85" ry="34" fill="#6fcb4c"/>

// // // // // //     {/* wooden board behind the bottom buttons */}
// // // // // //     <Rect x="30" y="1292" width="882" height="304" rx="70" fill="url(#gWood)" stroke="#a65d1d" strokeWidth="10"/>
// // // // // //     <Path d="M70 1385 H872 M56 1490 H886" stroke="#b9722a" strokeWidth="5" opacity="0.7"/>
// // // // // //     <Path d="M120 1330 H260 M520 1345 H760 M90 1430 H300 M600 1440 H840 M180 1540 H420 M560 1550 H800" stroke="#c98235" strokeWidth="3" opacity="0.55" strokeLinecap="round"/>
// // // // // //     <Circle cx="82" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="82" cy="1548" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1548" r="9" fill="#8a5a2a"/>
// // // // // //   </Svg>}

// // // // // // /* ---------- drag any child freely ---------- */
// // // // // // function DragView({children,sound}:any){
// // // // // //   const pan=useRef(new Animated.ValueXY()).current;
// // // // // //   const pr=useRef(PanResponder.create({
// // // // // //     onStartShouldSetPanResponder:()=>true,
// // // // // //     onPanResponderGrant:()=>{pan.extractOffset();if(sound)play(sound,{loop:true})},   // eraser = rubbing, pencil = scratching while dragging
// // // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // // //     onPanResponderRelease:()=>{pan.flattenOffset();if(sound)stop(sound)},
// // // // // //     onPanResponderTerminate:()=>{if(sound)stop(sound)}})).current;
// // // // // //   return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// // // // // // /* ---------- squish on press ---------- */
// // // // // // function Squish({style,onPress,disabled,children}:any){
// // // // // //   const s=useRef(new Animated.Value(1)).current;
// // // // // //   const to=(v:number)=>Animated.spring(s,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
// // // // // //   return <Pressable disabled={disabled} onPress={onPress} onPressIn={()=>to(0.92)} onPressOut={()=>to(1)} style={style}>
// // // // // //     <Animated.View style={{transform:[{scale:s}]}}>{children}</Animated.View></Pressable>}

// // // // // // /* ---------- one option circle ---------- */
// // // // // // function Bubble({size,delay,state,onPress,disabled,children}:any){
// // // // // //   const f=useRef(new Animated.Value(0)).current;
// // // // // //   useEffect(()=>{
// // // // // //     const a=Animated.loop(Animated.sequence([
// // // // // //       Animated.timing(f,{toValue:1,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
// // // // // //       Animated.timing(f,{toValue:0,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
// // // // // //     const t=setTimeout(()=>a.start(),delay);
// // // // // //     return()=>{clearTimeout(t);a.stop()}},[]);
// // // // // //   const wood=state==='ok'?'#46c25f':state==='bad'?'#ee4650':'#d98a3d';
// // // // // //   const woodEdge=state==='ok'?'#2a9a43':state==='bad'?'#b81f29':'#8f4f1c';
// // // // // //   const fill=state==='ok'?'#e3f9e6':state==='bad'?'#ffe3e3':'#fcf3e2';
// // // // // //   return <Animated.View style={{width:size,height:size,alignItems:'center',justifyContent:'center',
// // // // // //     transform:[{translateY:f.interpolate({inputRange:[0,1],outputRange:[0,-size*0.03]})}]}}>
// // // // // //     <Svg width={size} height={size} viewBox="0 0 200 200" style={{position:'absolute'}}>
// // // // // //       <Circle cx="100" cy="108" r="97" fill="rgba(60,30,5,0.28)"/>
// // // // // //       <Circle cx="100" cy="100" r="97" fill={wood}/>
// // // // // //       <Circle cx="100" cy="100" r="97" fill="none" stroke={woodEdge} strokeWidth="5"/>
// // // // // //       <Circle cx="100" cy="100" r="87" fill="none" stroke="rgba(255,225,170,0.55)" strokeWidth="3"/>
// // // // // //       <Circle cx="100" cy="100" r="78" fill={fill} stroke="rgba(120,70,20,0.35)" strokeWidth="3"/>
// // // // // //     </Svg>
// // // // // //     <Pressable disabled={disabled||!onPress} onPress={onPress} style={{width:size*0.8,height:size*0.8,borderRadius:size*0.4,alignItems:'center',justifyContent:'center'}}>
// // // // // //       {children}</Pressable>
// // // // // //   </Animated.View>}

// // // // // // /* =====================  MAIN  ===================== */
// // // // // // export default function BTLevel1Board({n,lv,hints,hid=[],mark,note,shake,qIn,bg,useRoomBg=false,art,showTools=true,onHome,onSettings,onPick,onClue,onCombine,onVideo,onSkip}:any){
// // // // // //   const [box,setBox]=useState({w:0,h:0});
// // // // // //   const sway=useRef(new Animated.Value(0)).current;
// // // // // //   useEffect(()=>{
// // // // // //     const a=Animated.loop(Animated.sequence([
// // // // // //       Animated.timing(sway,{toValue:1,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
// // // // // //       Animated.timing(sway,{toValue:0,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
// // // // // //     a.start();return()=>a.stop()},[]);

// // // // // //   // ---- clue popup state: seen = how many clues are revealed (0 or 1) ----
// // // // // //   const [clueOpen,setClueOpen]=useState(false);
// // // // // //   const [seen,setSeen]=useState(0);
// // // // // //   const [busy,setBusy]=useState(false);
// // // // // //   const busyRef=useRef(false);

// // // // // //   // Clues are free: onClue() is still called (if the parent wants to track it),
// // // // // //   // but its result / errors never block the clue from showing.
// // // // // //   const reveal=async(k:number)=>{
// // // // // //     if(busyRef.current||seen!==k-1)return;
// // // // // //     busyRef.current=true;setBusy(true);
// // // // // //     try{if(onClue)await onClue()}catch(e){}
// // // // // //     setSeen(k);
// // // // // //     busyRef.current=false;setBusy(false)};
// // // // // //   const openClues=()=>{play('clue');setClueOpen(true);if(seen===0)reveal(1)};

// // // // // //   // ---- correct / wrong answer sound (parent sets `mark` when an option is picked) ----
// // // // // //   useEffect(()=>{if(mark)play(mark.ok?'correct':'wrong')},[mark]);

// // // // // //   // ---- drag-to-combine ----
// // // // // //   const [merged,setMerged]=useState<any>(null);
// // // // // //   const [dragIdx,setDragIdx]=useState(-1);
// // // // // //   const dPan=useRef(Array.from({length:6},()=>new Animated.ValueXY())).current;
// // // // // //   const live=useRef<any>({}).current;
// // // // // //   const back=(i:number)=>Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();
// // // // // //   const dPR=useRef(Array.from({length:6},(_,idx)=>PanResponder.create({
// // // // // //     onStartShouldSetPanResponder:()=>!!live.canDrag?.(idx),
// // // // // //     onPanResponderGrant:()=>{setDragIdx(idx);play('drag')},
// // // // // //     onPanResponderMove:Animated.event([null,{dx:dPan[idx].x,dy:dPan[idx].y}],{useNativeDriver:false}),
// // // // // //     onPanResponderRelease:(_e,g)=>{setDragIdx(-1);live.drop?.(idx,g.dx,g.dy)},
// // // // // //     onPanResponderTerminate:()=>{setDragIdx(-1);back(idx)}}))).current;

// // // // // //   // scale the 942x1669 design to the space we actually got
// // // // // //   const bw=Math.min(box.w,box.h*DW/DH),k=bw/DW,bh=bw*DH/DW;
// // // // // //   const top0=(box.h-bh)/2;
// // // // // //   const P=(v:number)=>v*k;
// // // // // //   const A=(x:number,y:number,w:number,h:number):any=>({position:'absolute',left:P(x),top:P(y),width:P(w),height:P(h)});

// // // // // //   // ---- build the 6 grid cells ----
// // // // // //   const opts:any[]=(lv?.items||[]).map((it:any,i:number)=>({it,i})).filter((o:any)=>o.it.k!=='duster'&&o.it.k!=='chalk').slice(0,6);
// // // // // //   const tools:any[]=showTools?[{tool:'eraser'},{tool:'pencil'}]:[];
// // // // // //   const total=opts.length+tools.length;
// // // // // //   const cells:any[]=new Array(total).fill(null);
// // // // // //   if(tools.length===2&&total===6){
// // // // // //     cells[1]=tools[0];cells[2]=tools[1];
// // // // // //     let q=0;for(let s=0;s<total;s++)if(!cells[s])cells[s]=opts[q++];
// // // // // //   }else{[...opts,...tools].forEach((c,s)=>{cells[s]=c})}
// // // // // //   const rows=Math.max(1,Math.ceil(total/2));
// // // // // //   const rowY=rows>=3?[546,791,1045]:rows===2?[650,945]:[795];
// // // // // //   const slot=(idx:number)=>{const r=Math.floor(idx/2),c=idx%2,alone=total%2===1&&idx===total-1;
// // // // // //     return {x:alone?480:[324,637][c],y:rowY[Math.min(r,rowY.length-1)]}};
// // // // // //   const markCell=mark?cells.findIndex((c:any)=>c&&c.it&&Math.abs(c.it.x+c.it.w/2-mark.x)<0.6):-1;
// // // // // //   const D=204;

// // // // // //   const isCombine=lv?.mode==='combine';
// // // // // //   live.canDrag=(idx:number)=>isCombine&&!merged&&!!cells[idx]?.it?.drag;
// // // // // //   live.drop=async(idx:number,dx:number,dy:number)=>{
// // // // // //     const me=slot(idx),cx=me.x+dx/k,cy=me.y+dy/k;
// // // // // //     let j=-1,best=1e9;
// // // // // //     cells.forEach((o:any,s:number)=>{
// // // // // //       if(s===idx||!o?.it?.drag)return;
// // // // // //       const p=slot(s),d=Math.hypot(cx-p.x,cy-p.y);
// // // // // //       if(d<D*0.85&&d<best){best=d;j=s}});
// // // // // //     if(j<0){back(idx);return}
// // // // // //     const a=cells[idx].i,b=cells[j].i;
// // // // // //     const r=onCombine?await onCombine(Math.min(a,b),Math.max(a,b)):null;
// // // // // //     if(r&&r.correct){play('merge');const pj=slot(j);setMerged({x:(me.x+pj.x)/2,y:(me.y+pj.y)/2,t:r.result??'',a:idx,b:j})}
// // // // // //     else{play('wrong');back(idx)}};

// // // // // //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
// // // // // //   const qFont=P((lv?.question||'').length>22?34:42);

// // // // // //   const costPill=(x:number,w:number,icon:any,text:string)=>
// // // // // //     <View style={[A(x,1527,w,67),{borderRadius:P(34),backgroundColor:'#7a4520',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10)}]}>
// // // // // //       {icon}<Text numberOfLines={1} style={{fontFamily:F,fontSize:P(38),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{text}</Text></View>;
// // // // // //   const circleBtn=(x:number,bgc:string,bc:string,onPress:any,icon:any)=>
// // // // // //     <Squish style={A(x,1351,166,166)} onPress={onPress}><View style={{width:P(166),height:P(166),borderRadius:P(83),backgroundColor:bgc,borderWidth:P(14),borderColor:bc,alignItems:'center',justifyContent:'center',elevation:6}}>{icon}</View></Squish>;

// // // // // //   return <View style={{flex:1,backgroundColor:WALL}} onLayout={e=>setBox({w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height})}>
// // // // // //     {useRoomBg&&bg}
// // // // // //     {box.w>0&&<>

// // // // // //       <View style={{position:'absolute',left:(box.w-bw)/2,top:top0,width:bw,height:bh}}>
// // // // // //         {!useRoomBg&&<Room w={bw} h={bh}/>}

// // // // // //         {/* top: home, settings */}
// // // // // //         <Squish style={A(27,111,78,78)} onPress={onHome}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="home" s={P(40)}/></View></Squish>
// // // // // //         <Squish style={A(119,111,78,78)} onPress={onSettings}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="gear" s={P(42)}/></View></Squish>

// // // // // //         {/* level sign (wood plank on chains) */}
// // // // // //         <Animated.View style={[A(300,88,346,140),{transform:[{rotate:swayR}]}]}>
// // // // // //           <View style={{position:'absolute',left:P(56),top:0}}><Chain h={P(56)}/></View>
// // // // // //           <View style={{position:'absolute',right:P(56),top:0}}><Chain h={P(56)}/></View>
// // // // // //           <View style={{position:'absolute',left:0,top:P(42),width:P(346),height:P(98),borderRadius:P(14),backgroundColor:'#b4651f',borderWidth:P(6),borderColor:'#8a4a1b',alignItems:'center',justifyContent:'center',elevation:6}}>
// // // // // //             <View style={{position:'absolute',top:P(8),left:P(16),right:P(16),height:P(5),borderRadius:P(3),backgroundColor:'rgba(255,214,150,0.35)'}}/>
// // // // // //             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10),flexWrap:'nowrap'}}>
// // // // // //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'<'}</Text>
// // // // // //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#fff',includeFontPadding:false,textShadowColor:'rgba(60,25,0,0.55)',textShadowOffset:{width:0,height:2},textShadowRadius:3}}>{'LEVEL '+n}</Text>
// // // // // //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'>'}</Text>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </Animated.View>

// // // // // //         {/* bulbs counter */}
// // // // // //         <View style={[A(728,126,142,72),{borderRadius:P(36),backgroundColor:'#fbf3e1',borderWidth:P(3),borderColor:'#d9c79e',borderStyle:'dashed',justifyContent:'center',paddingRight:P(30),alignItems:'center',elevation:4}]}>
// // // // // //           <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(44),fontWeight:'900',color:INK,includeFontPadding:false}}>{hints}</Text></View>
// // // // // //         <View style={A(846,100,70,70)}><Icon n="bulb" s={P(70)}/></View>

// // // // // //         {/* question pill */}
// // // // // //         <Animated.View style={[A(192,298,556,104),{borderRadius:P(52),backgroundColor:'#faf0da',borderWidth:P(4),borderColor:'#e9d4a6',alignItems:'center',justifyContent:'center',elevation:4,
// // // // // //           opacity:qIn??1,transform:[{translateY:qIn?qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]}):0}]}]}>
// // // // // //           <Text style={{position:'absolute',left:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'<'}</Text>
// // // // // //           <Text style={{position:'absolute',right:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'>'}</Text>
// // // // // //           <Text numberOfLines={1} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:qFont,color:'#17307a',maxWidth:P(420),textAlign:'center'}}>{lv?.question}</Text>
// // // // // //         </Animated.View>

// // // // // //         {/* options grid */}
// // // // // //         <Animated.View pointerEvents="box-none" style={[StyleSheet.absoluteFill,{transform:[{translateX:shake??0}]}]}>
// // // // // //           {cells.map((c:any,idx:number)=>{
// // // // // //             if(!c)return null;
// // // // // //             const {x,y}=slot(idx);
// // // // // //             const pos=A(x-D/2,y-D/2,D,D);
// // // // // //             if(c.tool)return <View key={'t'+idx} style={[pos,{zIndex:20}]}>
// // // // // //               <Bubble size={P(D)} delay={idx*350}>
// // // // // //                 <DragView sound={c.tool}>{c.tool==='eraser'
// // // // // //                   ?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
// // // // // //                   :<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>}</DragView>
// // // // // //               </Bubble></View>;
// // // // // //             const {it,i}=c,Art=art?.[it.k],hidden=hid.includes(i);
// // // // // //             const state=markCell===idx?(mark.ok?'ok':'bad'):undefined;
// // // // // //             const drag=isCombine&&!!it.drag,gone=!!merged&&(merged.a===idx||merged.b===idx);
// // // // // //             return <Animated.View key={'o'+idx} {...(drag?dPR[idx].panHandlers:{})}
// // // // // //               style={[pos,{opacity:gone?0:hidden?0.2:1,zIndex:dragIdx===idx?30:1,elevation:dragIdx===idx?30:0},drag?{transform:dPan[idx].getTranslateTransform()}:null]}>
// // // // // //               <Bubble size={P(D)} delay={idx*350} state={state} disabled={hidden} onPress={drag?undefined:()=>onPick(i)}>
// // // // // //                 {it.k==='eraser'?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
// // // // // //                 :it.k==='pencil'?<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>
// // // // // //                 :Art&&it.k!=='num'?<Art w={P(130)} t={it.t} grey={it.grey} i={i}/>
// // // // // //                 :<Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(it.t??'').length>2?78:116),includeFontPadding:false}}>{String(it.t??'')}</Text>}
// // // // // //               </Bubble>
// // // // // //               {state&&<View pointerEvents="none" style={{position:'absolute',right:0,top:0}}><Icon n={mark.ok?'check':'cross'} s={P(64)}/></View>}
// // // // // //             </Animated.View>})}
// // // // // //           {merged&&<View pointerEvents="none" style={[A(merged.x-D/2,merged.y-D/2,D,D),{zIndex:25,elevation:25}]}>
// // // // // //             <Bubble size={P(D)} delay={0} state="ok">
// // // // // //               <Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(merged.t).length>2?78:116),includeFontPadding:false}}>{String(merged.t)}</Text>
// // // // // //             </Bubble></View>}
// // // // // //         </Animated.View>

// // // // // //         {/* message line: between the grid and the bottom bar */}
// // // // // //         {!!note&&<View pointerEvents="none" style={[A(60,1170,822,68),{zIndex:20,elevation:20,alignItems:'center',justifyContent:'center'}]}>
// // // // // //           <View style={{backgroundColor:'rgba(255,255,255,0.92)',borderRadius:P(34),paddingHorizontal:P(34),paddingVertical:P(8)}}>
// // // // // //             <Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:'#c0392b',textAlign:'center'}}>{note}</Text>
// // // // // //           </View>
// // // // // //         </View>}

// // // // // //         {/* hint / video / skip */}
// // // // // //         {circleBtn(143,'#a4d732','#f7f0d8',openClues,<Icon n="search" s={P(78)}/>)}
// // // // // //         {costPill(152,150,<Icon n="bulb" s={P(38)}/>,String(CLUE_COST))}
// // // // // //         {circleBtn(388,'#f7ecd6','#f7f0d8',onVideo,<Icon n="film" s={P(92)}/>)}
// // // // // //         {costPill(391,162,<Coin s={P(30)}/>,'+75')}
// // // // // //         {circleBtn(637,'#ed434d','#f7f0d8',onSkip,<FFIcon s={P(92)}/>)}
// // // // // //         {costPill(645,151,<Icon n="bulb" s={P(38)}/>,'50')}

// // // // // //         {/* ---- clue popup (free, one clue) ---- */}
// // // // // //         {clueOpen&&<>
// // // // // //           <Pressable onPress={()=>setClueOpen(false)} style={[A(0,0,DW,DH),{zIndex:40,elevation:40,backgroundColor:'rgba(10,25,60,0.5)'}]}/>
// // // // // //           <View style={[A(70,560,802,470),{zIndex:41,elevation:41,borderRadius:P(56),backgroundColor:CREAM,borderWidth:P(14),borderColor:'#e0902f'}]}>
// // // // // //             <Text style={{position:'absolute',left:0,right:0,top:P(34),textAlign:'center',fontFamily:F,fontSize:P(56),fontWeight:'900',color:NAVY,includeFontPadding:false}}>CLUES</Text>
// // // // // //             <Squish style={A(640,22,78,78)} onPress={()=>setClueOpen(false)}>
// // // // // //               <View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#fbde74',borderWidth:2,borderColor:'#2a2a2a',alignItems:'center',justifyContent:'center'}}><Icon n="cross" s={P(40)}/></View></Squish>
// // // // // //             {[[1,130]].map(([k,y])=>{
// // // // // //               const shown=seen>=k,avail=!shown&&seen===k-1;
// // // // // //               return <Squish key={'clue'+k} disabled={!avail||busy} onPress={()=>reveal(k)} style={A(36,y,690,250)}>
// // // // // //                 <View style={{width:P(690),height:P(250),borderRadius:P(40),backgroundColor:shown?'#ffffff':avail?'#f6e3b4':'#e4dccd',borderWidth:P(6),borderColor:shown?'#3ec75a':avail?'#ffb629':'#cfc3ae',flexDirection:'row',alignItems:'center',paddingHorizontal:P(28),gap:P(24)}}>
// // // // // //                   <View style={{width:P(110),height:P(110),borderRadius:P(55),backgroundColor:shown||avail?'#bd6b29':'#b7a98f',alignItems:'center',justifyContent:'center'}}>
// // // // // //                     {shown||avail
// // // // // //                       ?<Text style={{fontFamily:F,fontSize:P(60),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{k}</Text>
// // // // // //                       :<LockArt s={P(70)}/>}
// // // // // //                   </View>
// // // // // //                   <View style={{flex:1}}>
// // // // // //                     <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(38),fontWeight:'900',color:shown||avail?'#bd6b29':'#8d7f68',includeFontPadding:false}}>{'Clue '+k}</Text>
// // // // // //                     {shown
// // // // // //                       ?<Text numberOfLines={4} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:P(36),color:'#17307a',marginTop:P(6)}}>{CLUES[k-1]}</Text>
// // // // // //                       :avail
// // // // // //                         ?<Text numberOfLines={1} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:'#6b4423',marginTop:P(8),includeFontPadding:false}}>{busy?'Please wait...':'Tap to reveal'}</Text>
// // // // // //                         :<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(32),fontWeight:'bold',color:'#8d7f68',marginTop:P(8)}}>{'View Clue '+(k-1)+' first to unlock'}</Text>}
// // // // // //                   </View>
// // // // // //                 </View></Squish>})}
// // // // // //           </View>
// // // // // //         </>}
// // // // // //       </View>
// // // // // //     </>}
// // // // // //   </View>}
// // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // import {View,Text,Animated,Pressable,PanResponder,Platform,Easing,StyleSheet} from 'react-native';
// // // // // import Svg,{Rect,Path,Circle,Ellipse,G,Polygon,Line,Defs,LinearGradient,Stop} from 'react-native-svg';
// // // // // import {F,INK,Coin} from './BTShared';
// // // // // import {Icon} from './Art';
// // // // // import {play,stop} from './BTSound';
// // // // // import {fetchClue} from './Btclueapi';



// // // // // const NAVY='#132f70',CREAM='#faf0e2',K='#1d1d1d';
// // // // // const SERIF:any=Platform.select({web:'"Playfair Display",Georgia,"Times New Roman",serif',ios:'Georgia-Italic',default:'serif'});
// // // // // const DW=942,DH=1669;
// // // // // const WALL='#8fd3f4';

// // // // // const FALLBACK_CLUE='Could not load the clue. Tap to try again.';
// // // // // const LockArt=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Path d="M30 46 V34 a20 20 0 0 1 40 0 V46" fill="none" stroke="#7a6a55" strokeWidth="9" strokeLinecap="round"/><Rect x="20" y="44" width="60" height="44" rx="10" fill="#9b8a72"/><Circle cx="50" cy="63" r="6" fill="#f4e8d2"/><Rect x="47" y="63" width="6" height="15" rx="3" fill="#f4e8d2"/></Svg>;

// // // // // /* ---------- eraser / pencil arts ---------- */
// // // // // const EraserArt=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#2ea3e6" stroke={K} strokeWidth="2.5"/><Path d="M4 20 Q4 8 16 8 H46 V54 H16 Q4 54 4 42 Z" fill="#fff" stroke={K} strokeWidth="2.5"/></Svg>;
// // // // // const PencilArt=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke={K} strokeWidth="1.5"/><Polygon points="2,15 10,11.5 10,18.5" fill={K}/><Rect x="26" y="4" width="84" height="22" fill="#1f9a4a" stroke={K} strokeWidth="1.5"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#b8b8b8" stroke={K} strokeWidth="1.5"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#8a8a8a" stroke={K} strokeWidth="1.5"/></Svg>;

// // // // // /* ---------- garden scene (drawn in design coordinates) ---------- */
// // // // // const Cloud=({x,y,s}:any)=><G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.96"><Ellipse cx="0" cy="0" rx="70" ry="34"/><Ellipse cx="-52" cy="12" rx="48" ry="26"/><Ellipse cx="56" cy="14" rx="52" ry="26"/><Ellipse cx="8" cy="-26" rx="44" ry="30"/></G>;
// // // // // const Flower=({x,y,s=1}:any)=><G transform={`translate(${x} ${y}) scale(${s})`}>
// // // // //   <Path d="M-26 28 Q-8 -4 0 10 Q10 -6 30 26 Q10 20 0 30 Q-12 20 -26 28Z" fill="#4faa2e"/>
// // // // //   {[0,72,144,216,288].map(a=><Ellipse key={a} cx="0" cy="-17" rx="11" ry="17" fill="#fff" stroke="#e8e0d0" strokeWidth="1.5" transform={`rotate(${a})`}/>)}
// // // // //   <Circle cx="0" cy="0" r="9" fill="#f9c933"/></G>;
// // // // // const Tuft=({x,y,s=1}:any)=><Path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0 Q-8 -34 -18 -50 Q-2 -30 3 -46 Q10 -24 26 -40 Q12 -14 16 0Z" fill="#58b82f"/>;
// // // // // const Rock=({x,y,w,h}:any)=><G><Ellipse cx={x} cy={y} rx={w} ry={h} fill="#8f969e"/><Ellipse cx={x-w*0.2} cy={y-h*0.3} rx={w*0.55} ry={h*0.4} fill="#aeb4bb"/></G>;
// // // // // const Chain=({h}:any)=><Svg width={h*0.34} height={h} viewBox="0 0 20 60"><Ellipse cx="10" cy="9" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/><Ellipse cx="10" cy="27" rx="6" ry="9" fill="none" stroke="#6a5540" strokeWidth="3.2"/><Ellipse cx="10" cy="45" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/></Svg>;
// // // // // const FFIcon=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Polygon points="14,22 50,50 14,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/><Polygon points="52,22 88,50 52,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/></Svg>;

// // // // // /* ---- Level 3 style room: sky, clouds, hill, fence, face-plant (left), bookshelf (right) ---- */
// // // // // function Room({w,h}:any){
// // // // //   const books1:any[]=[[822,36,112,'#2fa6a0'],[860,34,122,'#f27ab0'],[896,40,106,'#8a63da']];
// // // // //   const books2:any[]=[[822,32,102,'#e5483f'],[856,26,92,'#2f8fd8'],[884,44,118,'#3eae52']];
// // // // //   const books3:any[]=[[822,34,96,'#f4c431'],[858,38,124,'#2f6fd0'],[898,34,104,'#e8913a']];
// // // // //   const shelf=(arr:any[],bottom:number)=>arr.map((b,i)=><Rect key={bottom+'-'+i} x={b[0]} y={bottom-b[2]} width={b[1]} height={b[2]} rx="4" fill={b[3]} stroke="rgba(0,0,0,0.18)" strokeWidth="2"/>);
// // // // //   return <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{position:'absolute',left:0,top:0}}>
// // // // //     <Defs>
// // // // //       <LinearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#58b9f1"/><Stop offset="0.6" stopColor="#6cc3f4"/><Stop offset="1" stopColor="#9bdcf8"/></LinearGradient>
// // // // //       <LinearGradient id="gGrass" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#8fdc4f"/><Stop offset="1" stopColor="#4ba72d"/></LinearGradient>
// // // // //       <LinearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#f0a94f"/><Stop offset="1" stopColor="#d98a3a"/></LinearGradient>
// // // // //     </Defs>

// // // // //     {/* sky + clouds */}
// // // // //     <Rect width={DW} height={DH} fill="url(#gSky)"/>
// // // // //     <Cloud x={850} y={235} s={0.62}/><Cloud x={95} y={985} s={0.55}/><Cloud x={760} y={900} s={0.5}/>

// // // // //     {/* rolling hills behind the fence */}
// // // // //     <Ellipse cx="170" cy="1215" rx="330" ry="150" fill="#9be05a"/>
// // // // //     <Ellipse cx="640" cy="1250" rx="420" ry="140" fill="#86d14a"/>
// // // // //     <Ellipse cx="930" cy="1190" rx="200" ry="120" fill="#a4e464"/>

// // // // //     {/* meadow */}
// // // // //     <Path d="M0 1215 Q471 1180 942 1215 V1669 H0Z" fill="url(#gGrass)"/>

// // // // //     {/* wooden fence */}
// // // // //     <G transform="translate(0 150)">
// // // // //       <Rect x="0" y="1018" width={DW} height="18" fill="#e49c46"/>
// // // // //       <Rect x="0" y="1070" width={DW} height="18" fill="#e49c46"/>
// // // // //       {[0,1,2,3,4,5,6,7,8,9,10].map(i=>{const x=i*92-4;return <G key={'p'+i}>
// // // // //         <Path d={`M${x} 1105 V985 L${x+27} 952 L${x+54} 985 V1105Z`} fill="#f0b45a" stroke="#c27a2a" strokeWidth="3"/>
// // // // //         <Circle cx={x+27} cy="1000" r="4.5" fill="#8a5a2a"/><Circle cx={x+27} cy="1090" r="4.5" fill="#8a5a2a"/></G>})}
// // // // //     </G>

// // // // //     {/* grass details */}
// // // // //     <Tuft x={250} y={1300} s={0.9}/><Tuft x={470} y={1285} s={0.8}/><Tuft x={700} y={1310} s={1}/>
// // // // //     <Tuft x={150} y={1620} s={1.2}/><Tuft x={560} y={1650} s={1}/><Tuft x={780} y={1560} s={1}/>
// // // // //     <Flower x={885} y={1235} s={0.9}/><Flower x={185} y={1610} s={1.1}/><Flower x={730} y={1630} s={1}/>
// // // // //     <Rock x={60} y={1560} w={95} h={58}/><Rock x={875} y={1618} w={105} h={62}/>

// // // // //     {/* cute plant in front of the fence (bottom-left) */}
// // // // //     <G transform="translate(-27 629)">
// // // // //       <Ellipse cx="95" cy="520" rx="44" ry="92" fill="#58b132"/>
// // // // //       <Ellipse cx="152" cy="505" rx="34" ry="80" fill="#6fc842" transform="rotate(16 152 505)"/>
// // // // //       <Ellipse cx="42" cy="535" rx="32" ry="64" fill="#4ea12b" transform="rotate(-16 42 535)"/>
// // // // //       <Rect x="34" y="566" width="126" height="82" rx="28" fill="#f7ede0"/>
// // // // //       <Circle cx="76" cy="604" r="6" fill="#5b3a29"/><Circle cx="118" cy="604" r="6" fill="#5b3a29"/>
// // // // //       <Ellipse cx="56" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/><Ellipse cx="138" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/>
// // // // //       <Path d="M88 618 Q97 628 106 618" stroke="#5b3a29" strokeWidth="4" fill="none" strokeLinecap="round"/>
// // // // //     </G>

// // // // //     {/* bookshelf (right) */}
// // // // //     <Rect x="785" y="645" width="157" height="580" fill="#e8a24a"/>
// // // // //     <Rect x="802" y="662" width="140" height="548" fill="#d58a33"/>
// // // // //     {shelf(books1,826)}{shelf(books2,1006)}{shelf(books3,1190)}
// // // // //     <Rect x="785" y="826" width="157" height="18" fill="#f2b862"/>
// // // // //     <Rect x="785" y="1006" width="157" height="18" fill="#f2b862"/>
// // // // //     <Rect x="785" y="1190" width="157" height="20" fill="#f2b862"/>
// // // // //     <Rect x="785" y="645" width="157" height="20" fill="#f2b862"/>
// // // // //     {/* plant on top of the shelf */}
// // // // //     <Ellipse cx="850" cy="560" rx="26" ry="62" fill="#58b132" transform="rotate(-20 850 560)"/>
// // // // //     <Ellipse cx="880" cy="545" rx="28" ry="72" fill="#6fc842"/>
// // // // //     <Ellipse cx="912" cy="565" rx="24" ry="58" fill="#4ea12b" transform="rotate(22 912 565)"/>
// // // // //     <Path d="M828 600 H934 L922 648 H840Z" fill="#e58a3e"/><Rect x="822" y="590" width="118" height="16" rx="6" fill="#f09a4a"/>

// // // // //     {/* leaves in the top corners */}
// // // // //     <Ellipse cx="30" cy="10" rx="170" ry="78" fill="#3f9f35"/><Ellipse cx="200" cy="0" rx="120" ry="52" fill="#58b940"/><Ellipse cx="90" cy="70" rx="80" ry="34" fill="#6fcb4c"/>
// // // // //     <Ellipse cx="900" cy="8" rx="190" ry="84" fill="#3a9a32"/><Ellipse cx="730" cy="0" rx="115" ry="48" fill="#58b940"/><Ellipse cx="860" cy="78" rx="85" ry="34" fill="#6fcb4c"/>

// // // // //     {/* wooden board behind the bottom buttons */}
// // // // //     <Rect x="30" y="1292" width="882" height="304" rx="70" fill="url(#gWood)" stroke="#a65d1d" strokeWidth="10"/>
// // // // //     <Path d="M70 1385 H872 M56 1490 H886" stroke="#b9722a" strokeWidth="5" opacity="0.7"/>
// // // // //     <Path d="M120 1330 H260 M520 1345 H760 M90 1430 H300 M600 1440 H840 M180 1540 H420 M560 1550 H800" stroke="#c98235" strokeWidth="3" opacity="0.55" strokeLinecap="round"/>
// // // // //     <Circle cx="82" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="82" cy="1548" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1548" r="9" fill="#8a5a2a"/>
// // // // //   </Svg>}

// // // // // /* ---------- drag any child freely ---------- */
// // // // // function DragView({children,sound}:any){
// // // // //   const pan=useRef(new Animated.ValueXY()).current;
// // // // //   const pr=useRef(PanResponder.create({
// // // // //     onStartShouldSetPanResponder:()=>true,
// // // // //     onPanResponderGrant:()=>{pan.extractOffset();if(sound)play(sound,{loop:true})},   // eraser = rubbing, pencil = scratching while dragging
// // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // //     onPanResponderRelease:()=>{pan.flattenOffset();if(sound)stop(sound)},
// // // // //     onPanResponderTerminate:()=>{if(sound)stop(sound)}})).current;
// // // // //   return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// // // // // /* ---------- squish on press ---------- */
// // // // // function Squish({style,onPress,disabled,children}:any){
// // // // //   const s=useRef(new Animated.Value(1)).current;
// // // // //   const to=(v:number)=>Animated.spring(s,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
// // // // //   return <Pressable disabled={disabled} onPress={onPress} onPressIn={()=>to(0.92)} onPressOut={()=>to(1)} style={style}>
// // // // //     <Animated.View style={{transform:[{scale:s}]}}>{children}</Animated.View></Pressable>}

// // // // // /* ---------- one option circle ---------- */
// // // // // function Bubble({size,delay,state,onPress,disabled,children}:any){
// // // // //   const f=useRef(new Animated.Value(0)).current;
// // // // //   useEffect(()=>{
// // // // //     const a=Animated.loop(Animated.sequence([
// // // // //       Animated.timing(f,{toValue:1,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
// // // // //       Animated.timing(f,{toValue:0,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
// // // // //     const t=setTimeout(()=>a.start(),delay);
// // // // //     return()=>{clearTimeout(t);a.stop()}},[]);
// // // // //   const wood=state==='ok'?'#46c25f':state==='bad'?'#ee4650':'#d98a3d';
// // // // //   const woodEdge=state==='ok'?'#2a9a43':state==='bad'?'#b81f29':'#8f4f1c';
// // // // //   const fill=state==='ok'?'#e3f9e6':state==='bad'?'#ffe3e3':'#fcf3e2';
// // // // //   return <Animated.View style={{width:size,height:size,alignItems:'center',justifyContent:'center',
// // // // //     transform:[{translateY:f.interpolate({inputRange:[0,1],outputRange:[0,-size*0.03]})}]}}>
// // // // //     <Svg width={size} height={size} viewBox="0 0 200 200" style={{position:'absolute'}}>
// // // // //       <Circle cx="100" cy="108" r="97" fill="rgba(60,30,5,0.28)"/>
// // // // //       <Circle cx="100" cy="100" r="97" fill={wood}/>
// // // // //       <Circle cx="100" cy="100" r="97" fill="none" stroke={woodEdge} strokeWidth="5"/>
// // // // //       <Circle cx="100" cy="100" r="87" fill="none" stroke="rgba(255,225,170,0.55)" strokeWidth="3"/>
// // // // //       <Circle cx="100" cy="100" r="78" fill={fill} stroke="rgba(120,70,20,0.35)" strokeWidth="3"/>
// // // // //     </Svg>
// // // // //     <Pressable disabled={disabled||!onPress} onPress={onPress} style={{width:size*0.8,height:size*0.8,borderRadius:size*0.4,alignItems:'center',justifyContent:'center'}}>
// // // // //       {children}</Pressable>
// // // // //   </Animated.View>}

// // // // // /* =====================  MAIN  ===================== */
// // // // // export default function BTLevel1Board({n,lv,hints,hid=[],mark,note,shake,qIn,bg,useRoomBg=false,art,showTools=true,playerId,onHome,onSettings,onPick,onClue,onCombine,onVideo,onSkip}:any){
// // // // //   const [box,setBox]=useState({w:0,h:0});
// // // // //   const sway=useRef(new Animated.Value(0)).current;
// // // // //   useEffect(()=>{
// // // // //     const a=Animated.loop(Animated.sequence([
// // // // //       Animated.timing(sway,{toValue:1,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
// // // // //       Animated.timing(sway,{toValue:0,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
// // // // //     a.start();return()=>a.stop()},[]);

// // // // //   // ---- clue popup state: seen = how many clues are revealed (0 or 1) ----
// // // // //   const [clueOpen,setClueOpen]=useState(false);
// // // // //   const [seen,setSeen]=useState(0);
// // // // //   const [busy,setBusy]=useState(false);
// // // // //   const [clueText,setClueText]=useState('');
// // // // //   const [clueErr,setClueErr]=useState(false);
// // // // //   const busyRef=useRef(false);

// // // // //   // Clue flow: frontend -> POST /api/braintwist/clue -> backend reads the clue + saves the view in MySQL -> JSON back -> shown here.
// // // // //   const reveal=async(k:number)=>{
// // // // //     if(busyRef.current||seen!==k-1)return;
// // // // //     busyRef.current=true;setBusy(true);setClueErr(false);
// // // // //     const r=await fetchClue(playerId,Number(n));
// // // // //     if(r.success&&r.clue){
// // // // //       setClueText(r.clue);setSeen(k);
// // // // //       try{if(onClue)onClue(r)}catch(e){}
// // // // //     }else{
// // // // //       setClueErr(true);
// // // // //     }
// // // // //     busyRef.current=false;setBusy(false)};
// // // // //   const openClues=()=>{play('clue');setClueOpen(true);if(seen===0)reveal(1)};

// // // // //   // ---- correct / wrong answer sound (parent sets `mark` when an option is picked) ----
// // // // //   useEffect(()=>{if(mark)play(mark.ok?'correct':'wrong')},[mark]);

// // // // //   // ---- drag-to-combine ----
// // // // //   const [merged,setMerged]=useState<any>(null);
// // // // //   const [dragIdx,setDragIdx]=useState(-1);
// // // // //   const dPan=useRef(Array.from({length:6},()=>new Animated.ValueXY())).current;
// // // // //   const live=useRef<any>({}).current;
// // // // //   const back=(i:number)=>Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();
// // // // //   const dPR=useRef(Array.from({length:6},(_,idx)=>PanResponder.create({
// // // // //     onStartShouldSetPanResponder:()=>!!live.canDrag?.(idx),
// // // // //     onPanResponderGrant:()=>{setDragIdx(idx);play('drag')},
// // // // //     onPanResponderMove:Animated.event([null,{dx:dPan[idx].x,dy:dPan[idx].y}],{useNativeDriver:false}),
// // // // //     onPanResponderRelease:(_e,g)=>{setDragIdx(-1);live.drop?.(idx,g.dx,g.dy)},
// // // // //     onPanResponderTerminate:()=>{setDragIdx(-1);back(idx)}}))).current;

// // // // //   // scale the 942x1669 design to the space we actually got
// // // // //   const bw=Math.min(box.w,box.h*DW/DH),k=bw/DW,bh=bw*DH/DW;
// // // // //   const top0=(box.h-bh)/2;
// // // // //   const P=(v:number)=>v*k;
// // // // //   const A=(x:number,y:number,w:number,h:number):any=>({position:'absolute',left:P(x),top:P(y),width:P(w),height:P(h)});

// // // // //   // ---- build the 6 grid cells ----
// // // // //   const opts:any[]=(lv?.items||[]).map((it:any,i:number)=>({it,i})).filter((o:any)=>o.it.k!=='duster'&&o.it.k!=='chalk').slice(0,6);
// // // // //   const tools:any[]=showTools?[{tool:'eraser'},{tool:'pencil'}]:[];
// // // // //   const total=opts.length+tools.length;
// // // // //   const cells:any[]=new Array(total).fill(null);
// // // // //   if(tools.length===2&&total===6){
// // // // //     cells[1]=tools[0];cells[2]=tools[1];
// // // // //     let q=0;for(let s=0;s<total;s++)if(!cells[s])cells[s]=opts[q++];
// // // // //   }else{[...opts,...tools].forEach((c,s)=>{cells[s]=c})}
// // // // //   const rows=Math.max(1,Math.ceil(total/2));
// // // // //   const rowY=rows>=3?[546,791,1045]:rows===2?[650,945]:[795];
// // // // //   const slot=(idx:number)=>{const r=Math.floor(idx/2),c=idx%2,alone=total%2===1&&idx===total-1;
// // // // //     return {x:alone?480:[324,637][c],y:rowY[Math.min(r,rowY.length-1)]}};
// // // // //   const markCell=mark?cells.findIndex((c:any)=>c&&c.it&&Math.abs(c.it.x+c.it.w/2-mark.x)<0.6):-1;
// // // // //   const D=204;

// // // // //   const isCombine=lv?.mode==='combine';
// // // // //   live.canDrag=(idx:number)=>isCombine&&!merged&&!!cells[idx]?.it?.drag;
// // // // //   live.drop=async(idx:number,dx:number,dy:number)=>{
// // // // //     const me=slot(idx),cx=me.x+dx/k,cy=me.y+dy/k;
// // // // //     let j=-1,best=1e9;
// // // // //     cells.forEach((o:any,s:number)=>{
// // // // //       if(s===idx||!o?.it?.drag)return;
// // // // //       const p=slot(s),d=Math.hypot(cx-p.x,cy-p.y);
// // // // //       if(d<D*0.85&&d<best){best=d;j=s}});
// // // // //     if(j<0){back(idx);return}
// // // // //     const a=cells[idx].i,b=cells[j].i;
// // // // //     const r=onCombine?await onCombine(Math.min(a,b),Math.max(a,b)):null;
// // // // //     if(r&&r.correct){play('merge');const pj=slot(j);setMerged({x:(me.x+pj.x)/2,y:(me.y+pj.y)/2,t:r.result??'',a:idx,b:j})}
// // // // //     else{play('wrong');back(idx)}};

// // // // //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
// // // // //   const qFont=P((lv?.question||'').length>22?34:42);

// // // // //   // ---- bottom bar: 3 smaller, evenly spaced buttons (centres 226 / 471 / 716) ----
// // // // //   const BTN=128,BTN_TOP=1342,PILL_Y=1484;
// // // // //   const costPill=(cx:number,w:number,icon:any,text:string)=>
// // // // //     <View style={[A(cx-w/2,PILL_Y,w,62),{borderRadius:P(31),backgroundColor:'#7a4520',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10)}]}>
// // // // //       {icon}<Text numberOfLines={1} style={{fontFamily:F,fontSize:P(34),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{text}</Text></View>;
// // // // //   const circleBtn=(cx:number,bgc:string,bc:string,onPress:any,icon:any)=>
// // // // //     <Squish style={A(cx-BTN/2,BTN_TOP,BTN,BTN)} onPress={onPress}><View style={{width:P(BTN),height:P(BTN),borderRadius:P(BTN/2),backgroundColor:bgc,borderWidth:P(12),borderColor:bc,alignItems:'center',justifyContent:'center',elevation:6}}>{icon}</View></Squish>;

// // // // //   return <View style={{flex:1,backgroundColor:WALL}} onLayout={e=>setBox({w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height})}>
// // // // //     {useRoomBg&&bg}
// // // // //     {box.w>0&&<>

// // // // //       <View style={{position:'absolute',left:(box.w-bw)/2,top:top0,width:bw,height:bh}}>
// // // // //         {!useRoomBg&&<Room w={bw} h={bh}/>}

// // // // //         {/* top: home, settings */}
// // // // //         <Squish style={A(27,111,78,78)} onPress={onHome}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="home" s={P(40)}/></View></Squish>
// // // // //         <Squish style={A(119,111,78,78)} onPress={onSettings}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="gear" s={P(42)}/></View></Squish>

// // // // //         {/* level sign (wood plank on chains) */}
// // // // //         <Animated.View style={[A(300,88,346,140),{transform:[{rotate:swayR}]}]}>
// // // // //           <View style={{position:'absolute',left:P(56),top:0}}><Chain h={P(56)}/></View>
// // // // //           <View style={{position:'absolute',right:P(56),top:0}}><Chain h={P(56)}/></View>
// // // // //           <View style={{position:'absolute',left:0,top:P(42),width:P(346),height:P(98),borderRadius:P(14),backgroundColor:'#b4651f',borderWidth:P(6),borderColor:'#8a4a1b',alignItems:'center',justifyContent:'center',elevation:6}}>
// // // // //             <View style={{position:'absolute',top:P(8),left:P(16),right:P(16),height:P(5),borderRadius:P(3),backgroundColor:'rgba(255,214,150,0.35)'}}/>
// // // // //             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10),flexWrap:'nowrap'}}>
// // // // //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'<'}</Text>
// // // // //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#fff',includeFontPadding:false,textShadowColor:'rgba(60,25,0,0.55)',textShadowOffset:{width:0,height:2},textShadowRadius:3}}>{'LEVEL '+n}</Text>
// // // // //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'>'}</Text>
// // // // //             </View>
// // // // //           </View>
// // // // //         </Animated.View>

// // // // //         {/* bulbs counter */}
// // // // //         <View style={[A(728,126,142,72),{borderRadius:P(36),backgroundColor:'#fbf3e1',borderWidth:P(3),borderColor:'#d9c79e',borderStyle:'dashed',justifyContent:'center',paddingRight:P(30),alignItems:'center',elevation:4}]}>
// // // // //           <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(44),fontWeight:'900',color:INK,includeFontPadding:false}}>{hints}</Text></View>
// // // // //         <View style={A(846,100,70,70)}><Icon n="bulb" s={P(70)}/></View>

// // // // //         {/* question pill */}
// // // // //         <Animated.View style={[A(192,298,556,104),{borderRadius:P(52),backgroundColor:'#faf0da',borderWidth:P(4),borderColor:'#e9d4a6',alignItems:'center',justifyContent:'center',elevation:4,
// // // // //           opacity:qIn??1,transform:[{translateY:qIn?qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]}):0}]}]}>
// // // // //           <Text style={{position:'absolute',left:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'<'}</Text>
// // // // //           <Text style={{position:'absolute',right:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'>'}</Text>
// // // // //           <Text numberOfLines={1} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:qFont,color:'#17307a',maxWidth:P(420),textAlign:'center'}}>{lv?.question}</Text>
// // // // //         </Animated.View>

// // // // //         {/* options grid */}
// // // // //         <Animated.View pointerEvents="box-none" style={[StyleSheet.absoluteFill,{transform:[{translateX:shake??0}]}]}>
// // // // //           {cells.map((c:any,idx:number)=>{
// // // // //             if(!c)return null;
// // // // //             const {x,y}=slot(idx);
// // // // //             const pos=A(x-D/2,y-D/2,D,D);
// // // // //             if(c.tool)return <View key={'t'+idx} style={[pos,{zIndex:20}]}>
// // // // //               <Bubble size={P(D)} delay={idx*350}>
// // // // //                 <DragView sound={c.tool}>{c.tool==='eraser'
// // // // //                   ?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
// // // // //                   :<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>}</DragView>
// // // // //               </Bubble></View>;
// // // // //             const {it,i}=c,Art=art?.[it.k],hidden=hid.includes(i);
// // // // //             const state=markCell===idx?(mark.ok?'ok':'bad'):undefined;
// // // // //             const drag=isCombine&&!!it.drag,gone=!!merged&&(merged.a===idx||merged.b===idx);
// // // // //             return <Animated.View key={'o'+idx} {...(drag?dPR[idx].panHandlers:{})}
// // // // //               style={[pos,{opacity:gone?0:hidden?0.2:1,zIndex:dragIdx===idx?30:1,elevation:dragIdx===idx?30:0},drag?{transform:dPan[idx].getTranslateTransform()}:null]}>
// // // // //               <Bubble size={P(D)} delay={idx*350} state={state} disabled={hidden} onPress={drag?undefined:()=>onPick(i)}>
// // // // //                 {it.k==='eraser'?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
// // // // //                 :it.k==='pencil'?<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>
// // // // //                 :Art&&it.k!=='num'?<Art w={P(130)} t={it.t} grey={it.grey} i={i}/>
// // // // //                 :<Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(it.t??'').length>2?78:116),includeFontPadding:false}}>{String(it.t??'')}</Text>}
// // // // //               </Bubble>
// // // // //               {state&&<View pointerEvents="none" style={{position:'absolute',right:0,top:0}}><Icon n={mark.ok?'check':'cross'} s={P(64)}/></View>}
// // // // //             </Animated.View>})}
// // // // //           {merged&&<View pointerEvents="none" style={[A(merged.x-D/2,merged.y-D/2,D,D),{zIndex:25,elevation:25}]}>
// // // // //             <Bubble size={P(D)} delay={0} state="ok">
// // // // //               <Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(merged.t).length>2?78:116),includeFontPadding:false}}>{String(merged.t)}</Text>
// // // // //             </Bubble></View>}
// // // // //         </Animated.View>

// // // // //         {/* message line: between the grid and the bottom bar */}
// // // // //         {!!note&&<View pointerEvents="none" style={[A(60,1170,822,68),{zIndex:20,elevation:20,alignItems:'center',justifyContent:'center'}]}>
// // // // //           <View style={{backgroundColor:'rgba(255,255,255,0.92)',borderRadius:P(34),paddingHorizontal:P(34),paddingVertical:P(8)}}>
// // // // //             <Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:'#c0392b',textAlign:'center'}}>{note}</Text>
// // // // //           </View>
// // // // //         </View>}

// // // // //         {/* hint / video / skip  (clue has no cost pill now) */}
// // // // //         {circleBtn(226,'#a4d732','#f7f0d8',openClues,<Icon n="search" s={P(60)}/>)}
// // // // //         {circleBtn(471,'#f7ecd6','#f7f0d8',onVideo,<Icon n="film" s={P(70)}/>)}
// // // // //         {costPill(471,162,<Coin s={P(28)}/>,'+75')}
// // // // //         {circleBtn(716,'#ed434d','#f7f0d8',onSkip,<FFIcon s={P(70)}/>)}
// // // // //         {costPill(716,150,<Icon n="bulb" s={P(36)}/>,'50')}

// // // // //         {/* ---- clue popup (one clue, loaded from backend) ---- */}
// // // // //         {clueOpen&&<>
// // // // //           <Pressable onPress={()=>setClueOpen(false)} style={[A(0,0,DW,DH),{zIndex:40,elevation:40,backgroundColor:'rgba(10,25,60,0.5)'}]}/>
// // // // //           <View style={[A(70,560,802,470),{zIndex:41,elevation:41,borderRadius:P(56),backgroundColor:CREAM,borderWidth:P(14),borderColor:'#e0902f'}]}>
// // // // //             <Text style={{position:'absolute',left:0,right:0,top:P(34),textAlign:'center',fontFamily:F,fontSize:P(56),fontWeight:'900',color:NAVY,includeFontPadding:false}}>CLUES</Text>
// // // // //             <Squish style={A(640,22,78,78)} onPress={()=>setClueOpen(false)}>
// // // // //               <View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#fbde74',borderWidth:2,borderColor:'#2a2a2a',alignItems:'center',justifyContent:'center'}}><Icon n="cross" s={P(40)}/></View></Squish>
// // // // //             {[[1,130]].map(([k,y])=>{
// // // // //               const shown=seen>=k,avail=!shown&&seen===k-1;
// // // // //               return <Squish key={'clue'+k} disabled={!avail||busy} onPress={()=>reveal(k)} style={A(36,y,690,250)}>
// // // // //                 <View style={{width:P(690),height:P(250),borderRadius:P(40),backgroundColor:shown?'#ffffff':avail?'#f6e3b4':'#e4dccd',borderWidth:P(6),borderColor:shown?'#3ec75a':avail?'#ffb629':'#cfc3ae',flexDirection:'row',alignItems:'center',paddingHorizontal:P(28),gap:P(24)}}>
// // // // //                   <View style={{width:P(110),height:P(110),borderRadius:P(55),backgroundColor:shown||avail?'#bd6b29':'#b7a98f',alignItems:'center',justifyContent:'center'}}>
// // // // //                     {shown||avail
// // // // //                       ?<Text style={{fontFamily:F,fontSize:P(60),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{k}</Text>
// // // // //                       :<LockArt s={P(70)}/>}
// // // // //                   </View>
// // // // //                   <View style={{flex:1}}>
// // // // //                     <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(38),fontWeight:'900',color:shown||avail?'#bd6b29':'#8d7f68',includeFontPadding:false}}>{'Clue '+k}</Text>
// // // // //                     {shown
// // // // //                       ?<Text numberOfLines={4} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:P(36),color:'#17307a',marginTop:P(6)}}>{clueText}</Text>
// // // // //                       :avail
// // // // //                         ?<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:clueErr&&!busy?'#c0392b':'#6b4423',marginTop:P(8),includeFontPadding:false}}>{busy?'Loading clue...':clueErr?FALLBACK_CLUE:'Tap to reveal'}</Text>
// // // // //                         :<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(32),fontWeight:'bold',color:'#8d7f68',marginTop:P(8)}}>{'View Clue '+(k-1)+' first to unlock'}</Text>}
// // // // //                   </View>
// // // // //                 </View></Squish>})}
// // // // //           </View>
// // // // //         </>}
// // // // //       </View>
// // // // //     </>}
// // // // //   </View>}
// // // // import React,{useEffect,useRef,useState} from 'react';
// // // // import {View,Text,Animated,Pressable,PanResponder,Platform,Easing,StyleSheet} from 'react-native';
// // // // import Svg,{Rect,Path,Circle,Ellipse,G,Polygon,Line,Defs,LinearGradient,Stop} from 'react-native-svg';
// // // // import {F,INK,Coin} from './BTShared';
// // // // import {Icon} from './Art';
// // // // import {play,stop} from './BTSound';
// // // // import {fetchClue} from './Btclueapi';



// // // // const NAVY='#132f70',CREAM='#faf0e2',K='#1d1d1d';
// // // // const SERIF:any=Platform.select({web:'"Playfair Display",Georgia,"Times New Roman",serif',ios:'Georgia-Italic',default:'serif'});
// // // // const DW=942,DH=1669;
// // // // const WALL='#8fd3f4';

// // // // const FALLBACK_CLUE='Could not load the clue. Tap to try again.';
// // // // const LockArt=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Path d="M30 46 V34 a20 20 0 0 1 40 0 V46" fill="none" stroke="#7a6a55" strokeWidth="9" strokeLinecap="round"/><Rect x="20" y="44" width="60" height="44" rx="10" fill="#9b8a72"/><Circle cx="50" cy="63" r="6" fill="#f4e8d2"/><Rect x="47" y="63" width="6" height="15" rx="3" fill="#f4e8d2"/></Svg>;

// // // // /* ---------- eraser / pencil arts ---------- */
// // // // const EraserArt=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#2ea3e6" stroke={K} strokeWidth="2.5"/><Path d="M4 20 Q4 8 16 8 H46 V54 H16 Q4 54 4 42 Z" fill="#fff" stroke={K} strokeWidth="2.5"/></Svg>;
// // // // const PencilArt=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke={K} strokeWidth="1.5"/><Polygon points="2,15 10,11.5 10,18.5" fill={K}/><Rect x="26" y="4" width="84" height="22" fill="#1f9a4a" stroke={K} strokeWidth="1.5"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#b8b8b8" stroke={K} strokeWidth="1.5"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#8a8a8a" stroke={K} strokeWidth="1.5"/></Svg>;

// // // // /* ---------- garden scene (drawn in design coordinates) ---------- */
// // // // const Cloud=({x,y,s}:any)=><G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.96"><Ellipse cx="0" cy="0" rx="70" ry="34"/><Ellipse cx="-52" cy="12" rx="48" ry="26"/><Ellipse cx="56" cy="14" rx="52" ry="26"/><Ellipse cx="8" cy="-26" rx="44" ry="30"/></G>;
// // // // const Flower=({x,y,s=1}:any)=><G transform={`translate(${x} ${y}) scale(${s})`}>
// // // //   <Path d="M-26 28 Q-8 -4 0 10 Q10 -6 30 26 Q10 20 0 30 Q-12 20 -26 28Z" fill="#4faa2e"/>
// // // //   {[0,72,144,216,288].map(a=><Ellipse key={a} cx="0" cy="-17" rx="11" ry="17" fill="#fff" stroke="#e8e0d0" strokeWidth="1.5" transform={`rotate(${a})`}/>)}
// // // //   <Circle cx="0" cy="0" r="9" fill="#f9c933"/></G>;
// // // // const Tuft=({x,y,s=1}:any)=><Path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0 Q-8 -34 -18 -50 Q-2 -30 3 -46 Q10 -24 26 -40 Q12 -14 16 0Z" fill="#58b82f"/>;
// // // // const Rock=({x,y,w,h}:any)=><G><Ellipse cx={x} cy={y} rx={w} ry={h} fill="#8f969e"/><Ellipse cx={x-w*0.2} cy={y-h*0.3} rx={w*0.55} ry={h*0.4} fill="#aeb4bb"/></G>;
// // // // const Chain=({h}:any)=><Svg width={h*0.34} height={h} viewBox="0 0 20 60"><Ellipse cx="10" cy="9" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/><Ellipse cx="10" cy="27" rx="6" ry="9" fill="none" stroke="#6a5540" strokeWidth="3.2"/><Ellipse cx="10" cy="45" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/></Svg>;
// // // // const FFIcon=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Polygon points="14,22 50,50 14,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/><Polygon points="52,22 88,50 52,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/></Svg>;

// // // // /* ---- Level 3 style room: sky, clouds, hill, fence, face-plant (left), bookshelf (right) ---- */
// // // // function Room({w,h}:any){
// // // //   const books1:any[]=[[822,36,112,'#2fa6a0'],[860,34,122,'#f27ab0'],[896,40,106,'#8a63da']];
// // // //   const books2:any[]=[[822,32,102,'#e5483f'],[856,26,92,'#2f8fd8'],[884,44,118,'#3eae52']];
// // // //   const books3:any[]=[[822,34,96,'#f4c431'],[858,38,124,'#2f6fd0'],[898,34,104,'#e8913a']];
// // // //   const shelf=(arr:any[],bottom:number)=>arr.map((b,i)=><Rect key={bottom+'-'+i} x={b[0]} y={bottom-b[2]} width={b[1]} height={b[2]} rx="4" fill={b[3]} stroke="rgba(0,0,0,0.18)" strokeWidth="2"/>);
// // // //   return <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{position:'absolute',left:0,top:0}}>
// // // //     <Defs>
// // // //       <LinearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#58b9f1"/><Stop offset="0.6" stopColor="#6cc3f4"/><Stop offset="1" stopColor="#9bdcf8"/></LinearGradient>
// // // //       <LinearGradient id="gGrass" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#8fdc4f"/><Stop offset="1" stopColor="#4ba72d"/></LinearGradient>
// // // //       <LinearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#f0a94f"/><Stop offset="1" stopColor="#d98a3a"/></LinearGradient>
// // // //     </Defs>

// // // //     {/* sky + clouds */}
// // // //     <Rect width={DW} height={DH} fill="url(#gSky)"/>
// // // //     <Cloud x={850} y={235} s={0.62}/><Cloud x={95} y={985} s={0.55}/><Cloud x={760} y={900} s={0.5}/>

// // // //     {/* rolling hills behind the fence */}
// // // //     <Ellipse cx="170" cy="1215" rx="330" ry="150" fill="#9be05a"/>
// // // //     <Ellipse cx="640" cy="1250" rx="420" ry="140" fill="#86d14a"/>
// // // //     <Ellipse cx="930" cy="1190" rx="200" ry="120" fill="#a4e464"/>

// // // //     {/* meadow */}
// // // //     <Path d="M0 1215 Q471 1180 942 1215 V1669 H0Z" fill="url(#gGrass)"/>

// // // //     {/* wooden fence */}
// // // //     <G transform="translate(0 150)">
// // // //       <Rect x="0" y="1018" width={DW} height="18" fill="#e49c46"/>
// // // //       <Rect x="0" y="1070" width={DW} height="18" fill="#e49c46"/>
// // // //       {[0,1,2,3,4,5,6,7,8,9,10].map(i=>{const x=i*92-4;return <G key={'p'+i}>
// // // //         <Path d={`M${x} 1105 V985 L${x+27} 952 L${x+54} 985 V1105Z`} fill="#f0b45a" stroke="#c27a2a" strokeWidth="3"/>
// // // //         <Circle cx={x+27} cy="1000" r="4.5" fill="#8a5a2a"/><Circle cx={x+27} cy="1090" r="4.5" fill="#8a5a2a"/></G>})}
// // // //     </G>

// // // //     {/* grass details */}
// // // //     <Tuft x={250} y={1300} s={0.9}/><Tuft x={470} y={1285} s={0.8}/><Tuft x={700} y={1310} s={1}/>
// // // //     <Tuft x={150} y={1620} s={1.2}/><Tuft x={560} y={1650} s={1}/><Tuft x={780} y={1560} s={1}/>
// // // //     <Flower x={885} y={1235} s={0.9}/><Flower x={185} y={1610} s={1.1}/><Flower x={730} y={1630} s={1}/>
// // // //     <Rock x={60} y={1560} w={95} h={58}/><Rock x={875} y={1618} w={105} h={62}/>

// // // //     {/* cute plant in front of the fence (bottom-left) */}
// // // //     <G transform="translate(-27 629)">
// // // //       <Ellipse cx="95" cy="520" rx="44" ry="92" fill="#58b132"/>
// // // //       <Ellipse cx="152" cy="505" rx="34" ry="80" fill="#6fc842" transform="rotate(16 152 505)"/>
// // // //       <Ellipse cx="42" cy="535" rx="32" ry="64" fill="#4ea12b" transform="rotate(-16 42 535)"/>
// // // //       <Rect x="34" y="566" width="126" height="82" rx="28" fill="#f7ede0"/>
// // // //       <Circle cx="76" cy="604" r="6" fill="#5b3a29"/><Circle cx="118" cy="604" r="6" fill="#5b3a29"/>
// // // //       <Ellipse cx="56" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/><Ellipse cx="138" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/>
// // // //       <Path d="M88 618 Q97 628 106 618" stroke="#5b3a29" strokeWidth="4" fill="none" strokeLinecap="round"/>
// // // //     </G>

// // // //     {/* bookshelf (right) */}
// // // //     <Rect x="785" y="645" width="157" height="580" fill="#e8a24a"/>
// // // //     <Rect x="802" y="662" width="140" height="548" fill="#d58a33"/>
// // // //     {shelf(books1,826)}{shelf(books2,1006)}{shelf(books3,1190)}
// // // //     <Rect x="785" y="826" width="157" height="18" fill="#f2b862"/>
// // // //     <Rect x="785" y="1006" width="157" height="18" fill="#f2b862"/>
// // // //     <Rect x="785" y="1190" width="157" height="20" fill="#f2b862"/>
// // // //     <Rect x="785" y="645" width="157" height="20" fill="#f2b862"/>
// // // //     {/* plant on top of the shelf */}
// // // //     <Ellipse cx="850" cy="560" rx="26" ry="62" fill="#58b132" transform="rotate(-20 850 560)"/>
// // // //     <Ellipse cx="880" cy="545" rx="28" ry="72" fill="#6fc842"/>
// // // //     <Ellipse cx="912" cy="565" rx="24" ry="58" fill="#4ea12b" transform="rotate(22 912 565)"/>
// // // //     <Path d="M828 600 H934 L922 648 H840Z" fill="#e58a3e"/><Rect x="822" y="590" width="118" height="16" rx="6" fill="#f09a4a"/>

// // // //     {/* leaves in the top corners */}
// // // //     <Ellipse cx="30" cy="10" rx="170" ry="78" fill="#3f9f35"/><Ellipse cx="200" cy="0" rx="120" ry="52" fill="#58b940"/><Ellipse cx="90" cy="70" rx="80" ry="34" fill="#6fcb4c"/>
// // // //     <Ellipse cx="900" cy="8" rx="190" ry="84" fill="#3a9a32"/><Ellipse cx="730" cy="0" rx="115" ry="48" fill="#58b940"/><Ellipse cx="860" cy="78" rx="85" ry="34" fill="#6fcb4c"/>

// // // //     {/* wooden board behind the bottom buttons */}
// // // //     <Rect x="30" y="1292" width="882" height="304" rx="70" fill="url(#gWood)" stroke="#a65d1d" strokeWidth="10"/>
// // // //     <Path d="M70 1385 H872 M56 1490 H886" stroke="#b9722a" strokeWidth="5" opacity="0.7"/>
// // // //     <Path d="M120 1330 H260 M520 1345 H760 M90 1430 H300 M600 1440 H840 M180 1540 H420 M560 1550 H800" stroke="#c98235" strokeWidth="3" opacity="0.55" strokeLinecap="round"/>
// // // //     <Circle cx="82" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="82" cy="1548" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1548" r="9" fill="#8a5a2a"/>
// // // //   </Svg>}

// // // // /* ---------- drag any child freely (onTap fires when released with almost no movement) ---------- */
// // // // function DragView({children,sound,onTap}:any){
// // // //   const pan=useRef(new Animated.ValueXY()).current;
// // // //   const pr=useRef(PanResponder.create({
// // // //     onStartShouldSetPanResponder:()=>true,
// // // //     onPanResponderGrant:()=>{pan.extractOffset();if(sound)play(sound,{loop:true})},   // eraser = rubbing, pencil = scratching while dragging
// // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // //     onPanResponderRelease:(_e,g)=>{pan.flattenOffset();if(sound)stop(sound);
// // // //       if(onTap&&Math.hypot(g.dx,g.dy)<8)onTap()},
// // // //     onPanResponderTerminate:()=>{if(sound)stop(sound)}})).current;
// // // //   return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// // // // /* ---------- squish on press ---------- */
// // // // function Squish({style,onPress,disabled,children}:any){
// // // //   const s=useRef(new Animated.Value(1)).current;
// // // //   const to=(v:number)=>Animated.spring(s,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
// // // //   return <Pressable disabled={disabled} onPress={onPress} onPressIn={()=>to(0.92)} onPressOut={()=>to(1)} style={style}>
// // // //     <Animated.View style={{transform:[{scale:s}]}}>{children}</Animated.View></Pressable>}

// // // // /* ---------- one option circle ---------- */
// // // // function Bubble({size,delay,state,onPress,disabled,children}:any){
// // // //   const f=useRef(new Animated.Value(0)).current;
// // // //   useEffect(()=>{
// // // //     const a=Animated.loop(Animated.sequence([
// // // //       Animated.timing(f,{toValue:1,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
// // // //       Animated.timing(f,{toValue:0,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
// // // //     const t=setTimeout(()=>a.start(),delay);
// // // //     return()=>{clearTimeout(t);a.stop()}},[]);
// // // //   const wood=state==='ok'?'#46c25f':state==='bad'?'#ee4650':'#d98a3d';
// // // //   const woodEdge=state==='ok'?'#2a9a43':state==='bad'?'#b81f29':'#8f4f1c';
// // // //   const fill=state==='ok'?'#e3f9e6':state==='bad'?'#ffe3e3':'#fcf3e2';
// // // //   return <Animated.View style={{width:size,height:size,alignItems:'center',justifyContent:'center',
// // // //     transform:[{translateY:f.interpolate({inputRange:[0,1],outputRange:[0,-size*0.03]})}]}}>
// // // //     <Svg width={size} height={size} viewBox="0 0 200 200" style={{position:'absolute'}}>
// // // //       <Circle cx="100" cy="108" r="97" fill="rgba(60,30,5,0.28)"/>
// // // //       <Circle cx="100" cy="100" r="97" fill={wood}/>
// // // //       <Circle cx="100" cy="100" r="97" fill="none" stroke={woodEdge} strokeWidth="5"/>
// // // //       <Circle cx="100" cy="100" r="87" fill="none" stroke="rgba(255,225,170,0.55)" strokeWidth="3"/>
// // // //       <Circle cx="100" cy="100" r="78" fill={fill} stroke="rgba(120,70,20,0.35)" strokeWidth="3"/>
// // // //     </Svg>
// // // //     <Pressable disabled={disabled||!onPress} onPress={onPress} style={{width:size*0.8,height:size*0.8,borderRadius:size*0.4,alignItems:'center',justifyContent:'center'}}>
// // // //       {children}</Pressable>
// // // //   </Animated.View>}

// // // // /* =====================  MAIN  ===================== */
// // // // export default function BTLevel1Board({n,lv,hints,hid=[],mark,note,shake,qIn,bg,useRoomBg=false,art,showTools=true,playerId,onHome,onSettings,onPick,onClue,onCombine,onVideo,onSkip}:any){
// // // //   const [box,setBox]=useState({w:0,h:0});
// // // //   const sway=useRef(new Animated.Value(0)).current;
// // // //   useEffect(()=>{
// // // //     const a=Animated.loop(Animated.sequence([
// // // //       Animated.timing(sway,{toValue:1,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
// // // //       Animated.timing(sway,{toValue:0,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
// // // //     a.start();return()=>a.stop()},[]);

// // // //   // ---- clue popup state: seen = how many clues are revealed (0 or 1) ----
// // // //   const [clueOpen,setClueOpen]=useState(false);
// // // //   const [seen,setSeen]=useState(0);
// // // //   const [busy,setBusy]=useState(false);
// // // //   const [clueText,setClueText]=useState('');
// // // //   const [clueErr,setClueErr]=useState(false);
// // // //   const busyRef=useRef(false);

// // // //   // Clue flow: frontend -> POST /api/braintwist/clue -> backend reads the clue + saves the view in MySQL -> JSON back -> shown here.
// // // //   const reveal=async(k:number)=>{
// // // //     if(busyRef.current||seen!==k-1)return;
// // // //     busyRef.current=true;setBusy(true);setClueErr(false);
// // // //     const r=await fetchClue(playerId,Number(n));
// // // //     if(r.success&&r.clue){
// // // //       setClueText(r.clue);setSeen(k);
// // // //       try{if(onClue)onClue(r)}catch(e){}
// // // //     }else{
// // // //       setClueErr(true);
// // // //     }
// // // //     busyRef.current=false;setBusy(false)};
// // // //   const openClues=()=>{play('clue');setClueOpen(true);if(seen===0)reveal(1)};

// // // //   // ---- correct / wrong answer sound (parent sets `mark` when an option is picked) ----
// // // //   useEffect(()=>{if(mark)play(mark.ok?'correct':'wrong')},[mark]);

// // // //   // ---- wrong sign: flashes on a ring (number / eraser / pencil) for a moment ----
// // // //   const [flash,setFlash]=useState(-1);
// // // //   const flashT=useRef<any>(null);
// // // //   const flashBad=(idx:number)=>{
// // // //     play('wrong');setFlash(idx);
// // // //     clearTimeout(flashT.current);
// // // //     flashT.current=setTimeout(()=>setFlash(-1),900)};
// // // //   useEffect(()=>()=>clearTimeout(flashT.current),[]);

// // // //   // ---- drag-to-combine ----
// // // //   const [merged,setMerged]=useState<any>(null);
// // // //   const [dragIdx,setDragIdx]=useState(-1);
// // // //   const dPan=useRef(Array.from({length:6},()=>new Animated.ValueXY())).current;
// // // //   const live=useRef<any>({}).current;
// // // //   const back=(i:number)=>Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();
// // // //   const dPR=useRef(Array.from({length:6},(_,idx)=>PanResponder.create({
// // // //     onStartShouldSetPanResponder:()=>!!live.canDrag?.(idx),
// // // //     onPanResponderGrant:()=>{setDragIdx(idx);play('drag')},
// // // //     onPanResponderMove:Animated.event([null,{dx:dPan[idx].x,dy:dPan[idx].y}],{useNativeDriver:false}),
// // // //     onPanResponderRelease:(_e,g)=>{setDragIdx(-1);live.drop?.(idx,g.dx,g.dy)},
// // // //     onPanResponderTerminate:()=>{setDragIdx(-1);back(idx)}}))).current;

// // // //   // scale the 942x1669 design to the space we actually got
// // // //   const bw=Math.min(box.w,box.h*DW/DH),k=bw/DW,bh=bw*DH/DW;
// // // //   const top0=(box.h-bh)/2;
// // // //   const P=(v:number)=>v*k;
// // // //   const A=(x:number,y:number,w:number,h:number):any=>({position:'absolute',left:P(x),top:P(y),width:P(w),height:P(h)});

// // // //   // ---- build the 6 grid cells ----
// // // //   const opts:any[]=(lv?.items||[]).map((it:any,i:number)=>({it,i})).filter((o:any)=>o.it.k!=='duster'&&o.it.k!=='chalk').slice(0,6);
// // // //   const tools:any[]=showTools?[{tool:'eraser'},{tool:'pencil'}]:[];
// // // //   const total=opts.length+tools.length;
// // // //   const cells:any[]=new Array(total).fill(null);
// // // //   if(tools.length===2&&total===6){
// // // //     cells[1]=tools[0];cells[2]=tools[1];
// // // //     let q=0;for(let s=0;s<total;s++)if(!cells[s])cells[s]=opts[q++];
// // // //   }else{[...opts,...tools].forEach((c,s)=>{cells[s]=c})}
// // // //   const rows=Math.max(1,Math.ceil(total/2));
// // // //   const rowY=rows>=3?[546,791,1045]:rows===2?[650,945]:[795];
// // // //   const slot=(idx:number)=>{const r=Math.floor(idx/2),c=idx%2,alone=total%2===1&&idx===total-1;
// // // //     return {x:alone?480:[324,637][c],y:rowY[Math.min(r,rowY.length-1)]}};
// // // //   const markCell=mark?cells.findIndex((c:any)=>c&&c.it&&Math.abs(c.it.x+c.it.w/2-mark.x)<0.6):-1;
// // // //   const D=204;

// // // //   const isCombine=lv?.mode==='combine';
// // // //   live.canDrag=(idx:number)=>isCombine&&!merged&&!!cells[idx]?.it?.drag;
// // // //   live.drop=async(idx:number,dx:number,dy:number)=>{
// // // //     // plain tap on a draggable number (no real movement) -> wrong sign
// // // //     if(Math.hypot(dx,dy)<8){back(idx);flashBad(idx);return}
// // // //     const me=slot(idx),cx=me.x+dx/k,cy=me.y+dy/k;
// // // //     let j=-1,best=1e9;
// // // //     cells.forEach((o:any,s:number)=>{
// // // //       if(s===idx||!o?.it?.drag)return;
// // // //       const p=slot(s),d=Math.hypot(cx-p.x,cy-p.y);
// // // //       if(d<D*0.85&&d<best){best=d;j=s}});
// // // //     if(j<0){back(idx);flashBad(idx);return}
// // // //     const a=cells[idx].i,b=cells[j].i;
// // // //     const r=onCombine?await onCombine(Math.min(a,b),Math.max(a,b)):null;
// // // //     if(r&&r.correct){play('merge');const pj=slot(j);setMerged({x:(me.x+pj.x)/2,y:(me.y+pj.y)/2,t:r.result??'',a:idx,b:j})}
// // // //     else{back(idx);flashBad(idx)}};

// // // //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
// // // //   const qFont=P((lv?.question||'').length>22?34:42);

// // // //   // ---- bottom bar: 3 smaller, evenly spaced buttons (centres 226 / 471 / 716) ----
// // // //   const BTN=128,BTN_TOP=1342,PILL_Y=1484;
// // // //   const costPill=(cx:number,w:number,icon:any,text:string)=>
// // // //     <View style={[A(cx-w/2,PILL_Y,w,62),{borderRadius:P(31),backgroundColor:'#7a4520',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10)}]}>
// // // //       {icon}<Text numberOfLines={1} style={{fontFamily:F,fontSize:P(34),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{text}</Text></View>;
// // // //   const circleBtn=(cx:number,bgc:string,bc:string,onPress:any,icon:any)=>
// // // //     <Squish style={A(cx-BTN/2,BTN_TOP,BTN,BTN)} onPress={onPress}><View style={{width:P(BTN),height:P(BTN),borderRadius:P(BTN/2),backgroundColor:bgc,borderWidth:P(12),borderColor:bc,alignItems:'center',justifyContent:'center',elevation:6}}>{icon}</View></Squish>;

// // // //   return <View style={{flex:1,backgroundColor:WALL}} onLayout={e=>setBox({w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height})}>
// // // //     {useRoomBg&&bg}
// // // //     {box.w>0&&<>

// // // //       <View style={{position:'absolute',left:(box.w-bw)/2,top:top0,width:bw,height:bh}}>
// // // //         {!useRoomBg&&<Room w={bw} h={bh}/>}

// // // //         {/* top: home, settings */}
// // // //         <Squish style={A(27,111,78,78)} onPress={onHome}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="home" s={P(40)}/></View></Squish>
// // // //         <Squish style={A(119,111,78,78)} onPress={onSettings}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="gear" s={P(42)}/></View></Squish>

// // // //         {/* level sign (wood plank on chains) */}
// // // //         <Animated.View style={[A(300,88,346,140),{transform:[{rotate:swayR}]}]}>
// // // //           <View style={{position:'absolute',left:P(56),top:0}}><Chain h={P(56)}/></View>
// // // //           <View style={{position:'absolute',right:P(56),top:0}}><Chain h={P(56)}/></View>
// // // //           <View style={{position:'absolute',left:0,top:P(42),width:P(346),height:P(98),borderRadius:P(14),backgroundColor:'#b4651f',borderWidth:P(6),borderColor:'#8a4a1b',alignItems:'center',justifyContent:'center',elevation:6}}>
// // // //             <View style={{position:'absolute',top:P(8),left:P(16),right:P(16),height:P(5),borderRadius:P(3),backgroundColor:'rgba(255,214,150,0.35)'}}/>
// // // //             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10),flexWrap:'nowrap'}}>
// // // //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'<'}</Text>
// // // //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#fff',includeFontPadding:false,textShadowColor:'rgba(60,25,0,0.55)',textShadowOffset:{width:0,height:2},textShadowRadius:3}}>{'LEVEL '+n}</Text>
// // // //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'>'}</Text>
// // // //             </View>
// // // //           </View>
// // // //         </Animated.View>

// // // //         {/* bulbs counter */}
// // // //         <View style={[A(728,126,142,72),{borderRadius:P(36),backgroundColor:'#fbf3e1',borderWidth:P(3),borderColor:'#d9c79e',borderStyle:'dashed',justifyContent:'center',paddingRight:P(30),alignItems:'center',elevation:4}]}>
// // // //           <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(44),fontWeight:'900',color:INK,includeFontPadding:false}}>{hints}</Text></View>
// // // //         <View style={A(846,100,70,70)}><Icon n="bulb" s={P(70)}/></View>

// // // //         {/* question pill */}
// // // //         <Animated.View style={[A(192,298,556,104),{borderRadius:P(52),backgroundColor:'#faf0da',borderWidth:P(4),borderColor:'#e9d4a6',alignItems:'center',justifyContent:'center',elevation:4,
// // // //           opacity:qIn??1,transform:[{translateY:qIn?qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]}):0}]}]}>
// // // //           <Text style={{position:'absolute',left:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'<'}</Text>
// // // //           <Text style={{position:'absolute',right:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'>'}</Text>
// // // //           <Text numberOfLines={1} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:qFont,color:'#17307a',maxWidth:P(420),textAlign:'center'}}>{lv?.question}</Text>
// // // //         </Animated.View>

// // // //         {/* options grid */}
// // // //         <Animated.View pointerEvents="box-none" style={[StyleSheet.absoluteFill,{transform:[{translateX:shake??0}]}]}>
// // // //           {cells.map((c:any,idx:number)=>{
// // // //             if(!c)return null;
// // // //             const {x,y}=slot(idx);
// // // //             const pos=A(x-D/2,y-D/2,D,D);

// // // //             /* eraser / pencil ring: tap shows the wrong sign (combine mode) */
// // // //             if(c.tool)return <View key={'t'+idx} style={[pos,{zIndex:20}]}>
// // // //               <Bubble size={P(D)} delay={idx*350} state={flash===idx?'bad':undefined}>
// // // //                 <DragView sound={c.tool} onTap={isCombine?()=>flashBad(idx):undefined}>{c.tool==='eraser'
// // // //                   ?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
// // // //                   :<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>}</DragView>
// // // //               </Bubble>
// // // //               {flash===idx&&<View pointerEvents="none" style={{position:'absolute',right:0,top:0}}><Icon n="cross" s={P(64)}/></View>}
// // // //             </View>;

// // // //             const {it,i}=c,Art=art?.[it.k],hidden=hid.includes(i);
// // // //             const state=markCell===idx?(mark.ok?'ok':'bad'):(flash===idx?'bad':undefined);
// // // //             const drag=isCombine&&!!it.drag,gone=!!merged&&(merged.a===idx||merged.b===idx);
// // // //             return <Animated.View key={'o'+idx} {...(drag?dPR[idx].panHandlers:{})}
// // // //               style={[pos,{opacity:gone?0:hidden?0.2:1,zIndex:dragIdx===idx?30:1,elevation:dragIdx===idx?30:0},drag?{transform:dPan[idx].getTranslateTransform()}:null]}>
// // // //               <Bubble size={P(D)} delay={idx*350} state={state} disabled={hidden} onPress={drag?undefined:()=>{isCombine?flashBad(idx):onPick(i)}}>
// // // //                 {it.k==='eraser'?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
// // // //                 :it.k==='pencil'?<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>
// // // //                 :Art&&it.k!=='num'?<Art w={P(130)} t={it.t} grey={it.grey} i={i}/>
// // // //                 :<Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(it.t??'').length>2?78:116),includeFontPadding:false}}>{String(it.t??'')}</Text>}
// // // //               </Bubble>
// // // //               {state&&<View pointerEvents="none" style={{position:'absolute',right:0,top:0}}><Icon n={state==='ok'?'check':'cross'} s={P(64)}/></View>}
// // // //             </Animated.View>})}
// // // //           {merged&&<View pointerEvents="none" style={[A(merged.x-D/2,merged.y-D/2,D,D),{zIndex:25,elevation:25}]}>
// // // //             <Bubble size={P(D)} delay={0} state="ok">
// // // //               <Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(merged.t).length>2?78:116),includeFontPadding:false}}>{String(merged.t)}</Text>
// // // //             </Bubble></View>}
// // // //         </Animated.View>

// // // //         {/* message line: between the grid and the bottom bar */}
// // // //         {!!note&&<View pointerEvents="none" style={[A(60,1170,822,68),{zIndex:20,elevation:20,alignItems:'center',justifyContent:'center'}]}>
// // // //           <View style={{backgroundColor:'rgba(255,255,255,0.92)',borderRadius:P(34),paddingHorizontal:P(34),paddingVertical:P(8)}}>
// // // //             <Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:'#c0392b',textAlign:'center'}}>{note}</Text>
// // // //           </View>
// // // //         </View>}

// // // //         {/* hint / video / skip  (clue has no cost pill now) */}
// // // //         {circleBtn(226,'#a4d732','#f7f0d8',openClues,<Icon n="search" s={P(60)}/>)}
// // // //         {circleBtn(471,'#f7ecd6','#f7f0d8',onVideo,<Icon n="film" s={P(70)}/>)}
// // // //         {costPill(471,162,<Coin s={P(28)}/>,'+75')}
// // // //         {circleBtn(716,'#ed434d','#f7f0d8',onSkip,<FFIcon s={P(70)}/>)}
// // // //         {costPill(716,150,<Icon n="bulb" s={P(36)}/>,'50')}

// // // //         {/* ---- clue popup (one clue, loaded from backend) ---- */}
// // // //         {clueOpen&&<>
// // // //           <Pressable onPress={()=>setClueOpen(false)} style={[A(0,0,DW,DH),{zIndex:40,elevation:40,backgroundColor:'rgba(10,25,60,0.5)'}]}/>
// // // //           <View style={[A(70,560,802,470),{zIndex:41,elevation:41,borderRadius:P(56),backgroundColor:CREAM,borderWidth:P(14),borderColor:'#e0902f'}]}>
// // // //             <Text style={{position:'absolute',left:0,right:0,top:P(34),textAlign:'center',fontFamily:F,fontSize:P(56),fontWeight:'900',color:NAVY,includeFontPadding:false}}>CLUES</Text>
// // // //             <Squish style={A(640,22,78,78)} onPress={()=>setClueOpen(false)}>
// // // //               <View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#fbde74',borderWidth:2,borderColor:'#2a2a2a',alignItems:'center',justifyContent:'center'}}><Icon n="cross" s={P(40)}/></View></Squish>
// // // //             {[[1,130]].map(([k,y])=>{
// // // //               const shown=seen>=k,avail=!shown&&seen===k-1;
// // // //               return <Squish key={'clue'+k} disabled={!avail||busy} onPress={()=>reveal(k)} style={A(36,y,690,250)}>
// // // //                 <View style={{width:P(690),height:P(250),borderRadius:P(40),backgroundColor:shown?'#ffffff':avail?'#f6e3b4':'#e4dccd',borderWidth:P(6),borderColor:shown?'#3ec75a':avail?'#ffb629':'#cfc3ae',flexDirection:'row',alignItems:'center',paddingHorizontal:P(28),gap:P(24)}}>
// // // //                   <View style={{width:P(110),height:P(110),borderRadius:P(55),backgroundColor:shown||avail?'#bd6b29':'#b7a98f',alignItems:'center',justifyContent:'center'}}>
// // // //                     {shown||avail
// // // //                       ?<Text style={{fontFamily:F,fontSize:P(60),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{k}</Text>
// // // //                       :<LockArt s={P(70)}/>}
// // // //                   </View>
// // // //                   <View style={{flex:1}}>
// // // //                     <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(38),fontWeight:'900',color:shown||avail?'#bd6b29':'#8d7f68',includeFontPadding:false}}>{'Clue '+k}</Text>
// // // //                     {shown
// // // //                       ?<Text numberOfLines={4} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:P(36),color:'#17307a',marginTop:P(6)}}>{clueText}</Text>
// // // //                       :avail
// // // //                         ?<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:clueErr&&!busy?'#c0392b':'#6b4423',marginTop:P(8),includeFontPadding:false}}>{busy?'Loading clue...':clueErr?FALLBACK_CLUE:'Tap to reveal'}</Text>
// // // //                         :<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(32),fontWeight:'bold',color:'#8d7f68',marginTop:P(8)}}>{'View Clue '+(k-1)+' first to unlock'}</Text>}
// // // //                   </View>
// // // //                 </View></Squish>})}
// // // //           </View>
// // // //         </>}
// // // //       </View>
// // // //     </>}
// // // //   </View>}
// // // import React,{useEffect,useRef,useState} from 'react';
// // // import {View,Text,Animated,Pressable,PanResponder,Platform,Easing,StyleSheet} from 'react-native';
// // // import Svg,{Rect,Path,Circle,Ellipse,G,Polygon,Line,Defs,LinearGradient,Stop} from 'react-native-svg';
// // // import {F,INK,Coin} from './BTShared';
// // // import {Icon} from './Art';
// // // import {play,stop} from './BTSound';
// // // import {fetchClue} from './Btclueapi';



// // // const NAVY='#132f70',CREAM='#faf0e2',K='#1d1d1d';
// // // const SERIF:any=Platform.select({web:'"Playfair Display",Georgia,"Times New Roman",serif',ios:'Georgia-Italic',default:'serif'});
// // // const DW=942,DH=1669;
// // // const WALL='#8fd3f4';

// // // const FALLBACK_CLUE='Could not load the hint. Tap to try again.';
// // // const LockArt=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Path d="M30 46 V34 a20 20 0 0 1 40 0 V46" fill="none" stroke="#7a6a55" strokeWidth="9" strokeLinecap="round"/><Rect x="20" y="44" width="60" height="44" rx="10" fill="#9b8a72"/><Circle cx="50" cy="63" r="6" fill="#f4e8d2"/><Rect x="47" y="63" width="6" height="15" rx="3" fill="#f4e8d2"/></Svg>;

// // // /* ---------- eraser / pencil arts ---------- */
// // // const EraserArt=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#2ea3e6" stroke={K} strokeWidth="2.5"/><Path d="M4 20 Q4 8 16 8 H46 V54 H16 Q4 54 4 42 Z" fill="#fff" stroke={K} strokeWidth="2.5"/></Svg>;
// // // const PencilArt=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke={K} strokeWidth="1.5"/><Polygon points="2,15 10,11.5 10,18.5" fill={K}/><Rect x="26" y="4" width="84" height="22" fill="#1f9a4a" stroke={K} strokeWidth="1.5"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#b8b8b8" stroke={K} strokeWidth="1.5"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#8a8a8a" stroke={K} strokeWidth="1.5"/></Svg>;

// // // /* ---------- garden scene (drawn in design coordinates) ---------- */
// // // const Cloud=({x,y,s}:any)=><G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.96"><Ellipse cx="0" cy="0" rx="70" ry="34"/><Ellipse cx="-52" cy="12" rx="48" ry="26"/><Ellipse cx="56" cy="14" rx="52" ry="26"/><Ellipse cx="8" cy="-26" rx="44" ry="30"/></G>;
// // // const Flower=({x,y,s=1}:any)=><G transform={`translate(${x} ${y}) scale(${s})`}>
// // //   <Path d="M-26 28 Q-8 -4 0 10 Q10 -6 30 26 Q10 20 0 30 Q-12 20 -26 28Z" fill="#4faa2e"/>
// // //   {[0,72,144,216,288].map(a=><Ellipse key={a} cx="0" cy="-17" rx="11" ry="17" fill="#fff" stroke="#e8e0d0" strokeWidth="1.5" transform={`rotate(${a})`}/>)}
// // //   <Circle cx="0" cy="0" r="9" fill="#f9c933"/></G>;
// // // const Tuft=({x,y,s=1}:any)=><Path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0 Q-8 -34 -18 -50 Q-2 -30 3 -46 Q10 -24 26 -40 Q12 -14 16 0Z" fill="#58b82f"/>;
// // // const Rock=({x,y,w,h}:any)=><G><Ellipse cx={x} cy={y} rx={w} ry={h} fill="#8f969e"/><Ellipse cx={x-w*0.2} cy={y-h*0.3} rx={w*0.55} ry={h*0.4} fill="#aeb4bb"/></G>;
// // // const Chain=({h}:any)=><Svg width={h*0.34} height={h} viewBox="0 0 20 60"><Ellipse cx="10" cy="9" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/><Ellipse cx="10" cy="27" rx="6" ry="9" fill="none" stroke="#6a5540" strokeWidth="3.2"/><Ellipse cx="10" cy="45" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/></Svg>;
// // // const FFIcon=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Polygon points="14,22 50,50 14,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/><Polygon points="52,22 88,50 52,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/></Svg>;

// // // /* ---- Level 3 style room: sky, clouds, hill, fence, face-plant (left), bookshelf (right) ---- */
// // // function Room({w,h}:any){
// // //   const books1:any[]=[[822,36,112,'#2fa6a0'],[860,34,122,'#f27ab0'],[896,40,106,'#8a63da']];
// // //   const books2:any[]=[[822,32,102,'#e5483f'],[856,26,92,'#2f8fd8'],[884,44,118,'#3eae52']];
// // //   const books3:any[]=[[822,34,96,'#f4c431'],[858,38,124,'#2f6fd0'],[898,34,104,'#e8913a']];
// // //   const shelf=(arr:any[],bottom:number)=>arr.map((b,i)=><Rect key={bottom+'-'+i} x={b[0]} y={bottom-b[2]} width={b[1]} height={b[2]} rx="4" fill={b[3]} stroke="rgba(0,0,0,0.18)" strokeWidth="2"/>);
// // //   return <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{position:'absolute',left:0,top:0}}>
// // //     <Defs>
// // //       <LinearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#58b9f1"/><Stop offset="0.6" stopColor="#6cc3f4"/><Stop offset="1" stopColor="#9bdcf8"/></LinearGradient>
// // //       <LinearGradient id="gGrass" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#8fdc4f"/><Stop offset="1" stopColor="#4ba72d"/></LinearGradient>
// // //       <LinearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#f0a94f"/><Stop offset="1" stopColor="#d98a3a"/></LinearGradient>
// // //     </Defs>

// // //     {/* sky + clouds */}
// // //     <Rect width={DW} height={DH} fill="url(#gSky)"/>
// // //     <Cloud x={850} y={235} s={0.62}/><Cloud x={95} y={985} s={0.55}/><Cloud x={760} y={900} s={0.5}/>

// // //     {/* rolling hills behind the fence */}
// // //     <Ellipse cx="170" cy="1215" rx="330" ry="150" fill="#9be05a"/>
// // //     <Ellipse cx="640" cy="1250" rx="420" ry="140" fill="#86d14a"/>
// // //     <Ellipse cx="930" cy="1190" rx="200" ry="120" fill="#a4e464"/>

// // //     {/* meadow */}
// // //     <Path d="M0 1215 Q471 1180 942 1215 V1669 H0Z" fill="url(#gGrass)"/>

// // //     {/* wooden fence */}
// // //     <G transform="translate(0 150)">
// // //       <Rect x="0" y="1018" width={DW} height="18" fill="#e49c46"/>
// // //       <Rect x="0" y="1070" width={DW} height="18" fill="#e49c46"/>
// // //       {[0,1,2,3,4,5,6,7,8,9,10].map(i=>{const x=i*92-4;return <G key={'p'+i}>
// // //         <Path d={`M${x} 1105 V985 L${x+27} 952 L${x+54} 985 V1105Z`} fill="#f0b45a" stroke="#c27a2a" strokeWidth="3"/>
// // //         <Circle cx={x+27} cy="1000" r="4.5" fill="#8a5a2a"/><Circle cx={x+27} cy="1090" r="4.5" fill="#8a5a2a"/></G>})}
// // //     </G>

// // //     {/* grass details */}
// // //     <Tuft x={250} y={1300} s={0.9}/><Tuft x={470} y={1285} s={0.8}/><Tuft x={700} y={1310} s={1}/>
// // //     <Tuft x={150} y={1620} s={1.2}/><Tuft x={560} y={1650} s={1}/><Tuft x={780} y={1560} s={1}/>
// // //     <Flower x={885} y={1235} s={0.9}/><Flower x={185} y={1610} s={1.1}/><Flower x={730} y={1630} s={1}/>
// // //     <Rock x={60} y={1560} w={95} h={58}/><Rock x={875} y={1618} w={105} h={62}/>

// // //     {/* cute plant in front of the fence (bottom-left) */}
// // //     <G transform="translate(-27 629)">
// // //       <Ellipse cx="95" cy="520" rx="44" ry="92" fill="#58b132"/>
// // //       <Ellipse cx="152" cy="505" rx="34" ry="80" fill="#6fc842" transform="rotate(16 152 505)"/>
// // //       <Ellipse cx="42" cy="535" rx="32" ry="64" fill="#4ea12b" transform="rotate(-16 42 535)"/>
// // //       <Rect x="34" y="566" width="126" height="82" rx="28" fill="#f7ede0"/>
// // //       <Circle cx="76" cy="604" r="6" fill="#5b3a29"/><Circle cx="118" cy="604" r="6" fill="#5b3a29"/>
// // //       <Ellipse cx="56" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/><Ellipse cx="138" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/>
// // //       <Path d="M88 618 Q97 628 106 618" stroke="#5b3a29" strokeWidth="4" fill="none" strokeLinecap="round"/>
// // //     </G>

// // //     {/* bookshelf (right) */}
// // //     <Rect x="785" y="645" width="157" height="580" fill="#e8a24a"/>
// // //     <Rect x="802" y="662" width="140" height="548" fill="#d58a33"/>
// // //     {shelf(books1,826)}{shelf(books2,1006)}{shelf(books3,1190)}
// // //     <Rect x="785" y="826" width="157" height="18" fill="#f2b862"/>
// // //     <Rect x="785" y="1006" width="157" height="18" fill="#f2b862"/>
// // //     <Rect x="785" y="1190" width="157" height="20" fill="#f2b862"/>
// // //     <Rect x="785" y="645" width="157" height="20" fill="#f2b862"/>
// // //     {/* plant on top of the shelf */}
// // //     <Ellipse cx="850" cy="560" rx="26" ry="62" fill="#58b132" transform="rotate(-20 850 560)"/>
// // //     <Ellipse cx="880" cy="545" rx="28" ry="72" fill="#6fc842"/>
// // //     <Ellipse cx="912" cy="565" rx="24" ry="58" fill="#4ea12b" transform="rotate(22 912 565)"/>
// // //     <Path d="M828 600 H934 L922 648 H840Z" fill="#e58a3e"/><Rect x="822" y="590" width="118" height="16" rx="6" fill="#f09a4a"/>

// // //     {/* leaves in the top corners */}
// // //     <Ellipse cx="30" cy="10" rx="170" ry="78" fill="#3f9f35"/><Ellipse cx="200" cy="0" rx="120" ry="52" fill="#58b940"/><Ellipse cx="90" cy="70" rx="80" ry="34" fill="#6fcb4c"/>
// // //     <Ellipse cx="900" cy="8" rx="190" ry="84" fill="#3a9a32"/><Ellipse cx="730" cy="0" rx="115" ry="48" fill="#58b940"/><Ellipse cx="860" cy="78" rx="85" ry="34" fill="#6fcb4c"/>

// // //     {/* wooden board behind the bottom buttons */}
// // //     <Rect x="30" y="1292" width="882" height="304" rx="70" fill="url(#gWood)" stroke="#a65d1d" strokeWidth="10"/>
// // //     <Path d="M70 1385 H872 M56 1490 H886" stroke="#b9722a" strokeWidth="5" opacity="0.7"/>
// // //     <Path d="M120 1330 H260 M520 1345 H760 M90 1430 H300 M600 1440 H840 M180 1540 H420 M560 1550 H800" stroke="#c98235" strokeWidth="3" opacity="0.55" strokeLinecap="round"/>
// // //     <Circle cx="82" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="82" cy="1548" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1548" r="9" fill="#8a5a2a"/>
// // //   </Svg>}

// // // /* ---------- drag any child freely (onTap fires when released with almost no movement) ---------- */
// // // function DragView({children,sound,onTap}:any){
// // //   const pan=useRef(new Animated.ValueXY()).current;
// // //   const pr=useRef(PanResponder.create({
// // //     onStartShouldSetPanResponder:()=>true,
// // //     onPanResponderGrant:()=>{pan.extractOffset();if(sound)play(sound,{loop:true})},   // eraser = rubbing, pencil = scratching while dragging
// // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // //     onPanResponderRelease:(_e,g)=>{pan.flattenOffset();if(sound)stop(sound);
// // //       if(onTap&&Math.hypot(g.dx,g.dy)<8)onTap()},
// // //     onPanResponderTerminate:()=>{if(sound)stop(sound)}})).current;
// // //   return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// // // /* ---------- squish on press ---------- */
// // // function Squish({style,onPress,disabled,children}:any){
// // //   const s=useRef(new Animated.Value(1)).current;
// // //   const to=(v:number)=>Animated.spring(s,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
// // //   return <Pressable disabled={disabled} onPress={onPress} onPressIn={()=>to(0.92)} onPressOut={()=>to(1)} style={style}>
// // //     <Animated.View style={{transform:[{scale:s}]}}>{children}</Animated.View></Pressable>}

// // // /* ---------- one option circle ---------- */
// // // function Bubble({size,delay,state,onPress,disabled,children}:any){
// // //   const f=useRef(new Animated.Value(0)).current;
// // //   useEffect(()=>{
// // //     const a=Animated.loop(Animated.sequence([
// // //       Animated.timing(f,{toValue:1,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
// // //       Animated.timing(f,{toValue:0,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
// // //     const t=setTimeout(()=>a.start(),delay);
// // //     return()=>{clearTimeout(t);a.stop()}},[]);
// // //   const wood=state==='ok'?'#46c25f':state==='bad'?'#ee4650':'#d98a3d';
// // //   const woodEdge=state==='ok'?'#2a9a43':state==='bad'?'#b81f29':'#8f4f1c';
// // //   const fill=state==='ok'?'#e3f9e6':state==='bad'?'#ffe3e3':'#fcf3e2';
// // //   return <Animated.View style={{width:size,height:size,alignItems:'center',justifyContent:'center',
// // //     transform:[{translateY:f.interpolate({inputRange:[0,1],outputRange:[0,-size*0.03]})}]}}>
// // //     <Svg width={size} height={size} viewBox="0 0 200 200" style={{position:'absolute'}}>
// // //       <Circle cx="100" cy="108" r="97" fill="rgba(60,30,5,0.28)"/>
// // //       <Circle cx="100" cy="100" r="97" fill={wood}/>
// // //       <Circle cx="100" cy="100" r="97" fill="none" stroke={woodEdge} strokeWidth="5"/>
// // //       <Circle cx="100" cy="100" r="87" fill="none" stroke="rgba(255,225,170,0.55)" strokeWidth="3"/>
// // //       <Circle cx="100" cy="100" r="78" fill={fill} stroke="rgba(120,70,20,0.35)" strokeWidth="3"/>
// // //     </Svg>
// // //     <Pressable disabled={disabled||!onPress} onPress={onPress} style={{width:size*0.8,height:size*0.8,borderRadius:size*0.4,alignItems:'center',justifyContent:'center'}}>
// // //       {children}</Pressable>
// // //   </Animated.View>}

// // // /* =====================  MAIN  ===================== */
// // // export default function BTLevel1Board({n,lv,hints,hid=[],mark,note,shake,qIn,bg,useRoomBg=false,art,showTools=true,playerId,onHome,onSettings,onPick,onClue,onCombine,onVideo,onSkip}:any){
// // //   const [box,setBox]=useState({w:0,h:0});
// // //   const sway=useRef(new Animated.Value(0)).current;
// // //   useEffect(()=>{
// // //     const a=Animated.loop(Animated.sequence([
// // //       Animated.timing(sway,{toValue:1,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
// // //       Animated.timing(sway,{toValue:0,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
// // //     a.start();return()=>a.stop()},[]);

// // //   // ---- clue popup state: seen = how many clues are revealed (0 or 1) ----
// // //   const [clueOpen,setClueOpen]=useState(false);
// // //   const [seen,setSeen]=useState(0);
// // //   const [busy,setBusy]=useState(false);
// // //   const [clueText,setClueText]=useState('');
// // //   const [clueErr,setClueErr]=useState(false);
// // //   const busyRef=useRef(false);

// // //   // Clue flow: frontend -> POST /api/braintwist/clue -> backend reads the clue + saves the view in MySQL -> JSON back -> shown here.
// // //   const reveal=async(k:number)=>{
// // //     if(busyRef.current||seen!==k-1)return;
// // //     busyRef.current=true;setBusy(true);setClueErr(false);
// // //     const r=await fetchClue(playerId,Number(n));
// // //     if(r.success&&r.clue){
// // //       setClueText(r.clue);setSeen(k);
// // //       try{if(onClue)onClue(r)}catch(e){}
// // //     }else{
// // //       setClueErr(true);
// // //     }
// // //     busyRef.current=false;setBusy(false)};
// // //   const openClues=()=>{play('clue');setClueOpen(true);if(seen===0)reveal(1)};

// // //   // ---- correct / wrong answer sound (parent sets `mark` when an option is picked) ----
// // //   useEffect(()=>{if(mark)play(mark.ok?'correct':'wrong')},[mark]);

// // //   // ---- wrong sign: flashes on a ring (number / eraser / pencil) for a moment ----
// // //   const [flash,setFlash]=useState(-1);
// // //   const flashT=useRef<any>(null);
// // //   const flashBad=(idx:number)=>{
// // //     play('wrong');setFlash(idx);
// // //     clearTimeout(flashT.current);
// // //     flashT.current=setTimeout(()=>setFlash(-1),900)};
// // //   useEffect(()=>()=>clearTimeout(flashT.current),[]);

// // //   // ---- drag-to-combine ----
// // //   const [merged,setMerged]=useState<any>(null);
// // //   const [dragIdx,setDragIdx]=useState(-1);
// // //   const dPan=useRef(Array.from({length:6},()=>new Animated.ValueXY())).current;
// // //   const live=useRef<any>({}).current;
// // //   const back=(i:number)=>Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();
// // //   const dPR=useRef(Array.from({length:6},(_,idx)=>PanResponder.create({
// // //     onStartShouldSetPanResponder:()=>!!live.canDrag?.(idx),
// // //     onPanResponderGrant:()=>{setDragIdx(idx);play('drag')},
// // //     onPanResponderMove:Animated.event([null,{dx:dPan[idx].x,dy:dPan[idx].y}],{useNativeDriver:false}),
// // //     onPanResponderRelease:(_e,g)=>{setDragIdx(-1);live.drop?.(idx,g.dx,g.dy)},
// // //     onPanResponderTerminate:()=>{setDragIdx(-1);back(idx)}}))).current;

// // //   // scale the 942x1669 design to the space we actually got
// // //   const bw=Math.min(box.w,box.h*DW/DH),k=bw/DW,bh=bw*DH/DW;
// // //   const top0=(box.h-bh)/2;
// // //   const P=(v:number)=>v*k;
// // //   const A=(x:number,y:number,w:number,h:number):any=>({position:'absolute',left:P(x),top:P(y),width:P(w),height:P(h)});

// // //   // ---- build the 6 grid cells ----
// // //   const opts:any[]=(lv?.items||[]).map((it:any,i:number)=>({it,i})).filter((o:any)=>o.it.k!=='duster'&&o.it.k!=='chalk').slice(0,6);
// // //   const tools:any[]=showTools?[{tool:'eraser'},{tool:'pencil'}]:[];
// // //   const total=opts.length+tools.length;
// // //   const cells:any[]=new Array(total).fill(null);
// // //   if(tools.length===2&&total===6){
// // //     cells[1]=tools[0];cells[2]=tools[1];
// // //     let q=0;for(let s=0;s<total;s++)if(!cells[s])cells[s]=opts[q++];
// // //   }else{[...opts,...tools].forEach((c,s)=>{cells[s]=c})}
// // //   const rows=Math.max(1,Math.ceil(total/2));
// // //   const rowY=rows>=3?[546,791,1045]:rows===2?[650,945]:[795];
// // //   const slot=(idx:number)=>{const r=Math.floor(idx/2),c=idx%2,alone=total%2===1&&idx===total-1;
// // //     return {x:alone?480:[324,637][c],y:rowY[Math.min(r,rowY.length-1)]}};
// // //   const markCell=mark?cells.findIndex((c:any)=>c&&c.it&&Math.abs(c.it.x+c.it.w/2-mark.x)<0.6):-1;
// // //   const D=204;

// // //   const isCombine=lv?.mode==='combine';
// // //   live.canDrag=(idx:number)=>isCombine&&!merged&&!!cells[idx]?.it?.drag;
// // //   live.drop=async(idx:number,dx:number,dy:number)=>{
// // //     // plain tap on a draggable number (no real movement) -> wrong sign
// // //     if(Math.hypot(dx,dy)<8){back(idx);flashBad(idx);return}
// // //     const me=slot(idx),cx=me.x+dx/k,cy=me.y+dy/k;
// // //     let j=-1,best=1e9;
// // //     cells.forEach((o:any,s:number)=>{
// // //       if(s===idx||!o?.it?.drag)return;
// // //       const p=slot(s),d=Math.hypot(cx-p.x,cy-p.y);
// // //       if(d<D*0.85&&d<best){best=d;j=s}});
// // //     if(j<0){back(idx);flashBad(idx);return}
// // //     const a=cells[idx].i,b=cells[j].i;
// // //     const r=onCombine?await onCombine(Math.min(a,b),Math.max(a,b)):null;
// // //     if(r&&r.correct){play('merge');const pj=slot(j);setMerged({x:(me.x+pj.x)/2,y:(me.y+pj.y)/2,t:r.result??'',a:idx,b:j})}
// // //     else{back(idx);flashBad(idx)}};

// // //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
// // //   const qLen=(lv?.question||'').length;
// // //   const qFont=P(qLen>60?27:qLen>22?34:42);

// // //   // ---- bottom bar: 3 smaller, evenly spaced buttons (centres 226 / 471 / 716) ----
// // //   const BTN=128,BTN_TOP=1342,PILL_Y=1484;
// // //   const costPill=(cx:number,w:number,icon:any,text:string)=>
// // //     <View style={[A(cx-w/2,PILL_Y,w,62),{borderRadius:P(31),backgroundColor:'#7a4520',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10)}]}>
// // //       {icon}<Text numberOfLines={1} style={{fontFamily:F,fontSize:P(34),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{text}</Text></View>;
// // //   const circleBtn=(cx:number,bgc:string,bc:string,onPress:any,icon:any)=>
// // //     <Squish style={A(cx-BTN/2,BTN_TOP,BTN,BTN)} onPress={onPress}><View style={{width:P(BTN),height:P(BTN),borderRadius:P(BTN/2),backgroundColor:bgc,borderWidth:P(12),borderColor:bc,alignItems:'center',justifyContent:'center',elevation:6}}>{icon}</View></Squish>;

// // //   return <View style={{flex:1,backgroundColor:WALL}} onLayout={e=>setBox({w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height})}>
// // //     {useRoomBg&&bg}
// // //     {box.w>0&&<>

// // //       <View style={{position:'absolute',left:(box.w-bw)/2,top:top0,width:bw,height:bh}}>
// // //         {!useRoomBg&&<Room w={bw} h={bh}/>}

// // //         {/* top: home, settings */}
// // //         <Squish style={A(27,111,78,78)} onPress={onHome}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="home" s={P(40)}/></View></Squish>
// // //         <Squish style={A(119,111,78,78)} onPress={onSettings}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="gear" s={P(42)}/></View></Squish>

// // //         {/* level sign (wood plank on chains) */}
// // //         <Animated.View style={[A(300,88,346,140),{transform:[{rotate:swayR}]}]}>
// // //           <View style={{position:'absolute',left:P(56),top:0}}><Chain h={P(56)}/></View>
// // //           <View style={{position:'absolute',right:P(56),top:0}}><Chain h={P(56)}/></View>
// // //           <View style={{position:'absolute',left:0,top:P(42),width:P(346),height:P(98),borderRadius:P(14),backgroundColor:'#b4651f',borderWidth:P(6),borderColor:'#8a4a1b',alignItems:'center',justifyContent:'center',elevation:6}}>
// // //             <View style={{position:'absolute',top:P(8),left:P(16),right:P(16),height:P(5),borderRadius:P(3),backgroundColor:'rgba(255,214,150,0.35)'}}/>
// // //             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10),flexWrap:'nowrap'}}>
// // //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'<'}</Text>
// // //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#fff',includeFontPadding:false,textShadowColor:'rgba(60,25,0,0.55)',textShadowOffset:{width:0,height:2},textShadowRadius:3}}>{'LEVEL '+n}</Text>
// // //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'>'}</Text>
// // //             </View>
// // //           </View>
// // //         </Animated.View>

// // //         {/* bulbs counter */}
// // //         <View style={[A(728,126,142,72),{borderRadius:P(36),backgroundColor:'#fbf3e1',borderWidth:P(3),borderColor:'#d9c79e',borderStyle:'dashed',justifyContent:'center',paddingRight:P(30),alignItems:'center',elevation:4}]}>
// // //           <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(44),fontWeight:'900',color:INK,includeFontPadding:false}}>{hints}</Text></View>
// // //         <View style={A(846,100,70,70)}><Icon n="bulb" s={P(70)}/></View>

// // //         {/* question pill */}
// // //         <Animated.View style={[A(192,292,556,qLen>60?136:104),{borderRadius:P(qLen>60?44:52),backgroundColor:'#faf0da',borderWidth:P(4),borderColor:'#e9d4a6',alignItems:'center',justifyContent:'center',elevation:4,
// // //           opacity:qIn??1,transform:[{translateY:qIn?qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]}):0}]}]}>
// // //           <Text style={{position:'absolute',left:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'<'}</Text>
// // //           <Text style={{position:'absolute',right:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'>'}</Text>
// // //           <Text numberOfLines={3} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:qFont,color:'#17307a',maxWidth:P(430),textAlign:'center'}}>{lv?.question}</Text>
// // //         </Animated.View>

// // //         {/* options grid */}
// // //         <Animated.View pointerEvents="box-none" style={[StyleSheet.absoluteFill,{transform:[{translateX:shake??0}]}]}>
// // //           {cells.map((c:any,idx:number)=>{
// // //             if(!c)return null;
// // //             const {x,y}=slot(idx);
// // //             const pos=A(x-D/2,y-D/2,D,D);

// // //             /* eraser / pencil ring: tap shows the wrong sign (combine mode) */
// // //             if(c.tool)return <View key={'t'+idx} style={[pos,{zIndex:20}]}>
// // //               <Bubble size={P(D)} delay={idx*350} state={flash===idx?'bad':undefined}>
// // //                 <DragView sound={c.tool} onTap={isCombine?()=>flashBad(idx):undefined}>{c.tool==='eraser'
// // //                   ?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
// // //                   :<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>}</DragView>
// // //               </Bubble>
// // //               {flash===idx&&<View pointerEvents="none" style={{position:'absolute',right:0,top:0}}><Icon n="cross" s={P(64)}/></View>}
// // //             </View>;

// // //             const {it,i}=c,Art=art?.[it.k],hidden=hid.includes(i);
// // //             const state=markCell===idx?(mark.ok?'ok':'bad'):(flash===idx?'bad':undefined);
// // //             const drag=isCombine&&!!it.drag,gone=!!merged&&(merged.a===idx||merged.b===idx);
// // //             return <Animated.View key={'o'+idx} {...(drag?dPR[idx].panHandlers:{})}
// // //               style={[pos,{opacity:gone?0:hidden?0.2:1,zIndex:dragIdx===idx?30:1,elevation:dragIdx===idx?30:0},drag?{transform:dPan[idx].getTranslateTransform()}:null]}>
// // //               <Bubble size={P(D)} delay={idx*350} state={state} disabled={hidden} onPress={drag?undefined:()=>{isCombine?flashBad(idx):onPick(i)}}>
// // //                 {it.k==='eraser'?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
// // //                 :it.k==='pencil'?<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>
// // //                 :Art&&it.k!=='num'?<Art w={P(130)} t={it.t} grey={it.grey} i={i}/>
// // //                 :<Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(it.t??'').length>2?78:116),includeFontPadding:false}}>{String(it.t??'')}</Text>}
// // //               </Bubble>
// // //               {state&&<View pointerEvents="none" style={{position:'absolute',right:0,top:0}}><Icon n={state==='ok'?'check':'cross'} s={P(64)}/></View>}
// // //             </Animated.View>})}
// // //           {merged&&<View pointerEvents="none" style={[A(merged.x-D/2,merged.y-D/2,D,D),{zIndex:25,elevation:25}]}>
// // //             <Bubble size={P(D)} delay={0} state="ok">
// // //               <Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(merged.t).length>2?78:116),includeFontPadding:false}}>{String(merged.t)}</Text>
// // //             </Bubble></View>}
// // //         </Animated.View>

// // //         {/* message line: between the grid and the bottom bar */}
// // //         {!!note&&<View pointerEvents="none" style={[A(60,1170,822,68),{zIndex:20,elevation:20,alignItems:'center',justifyContent:'center'}]}>
// // //           <View style={{backgroundColor:'rgba(255,255,255,0.92)',borderRadius:P(34),paddingHorizontal:P(34),paddingVertical:P(8)}}>
// // //             <Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:'#c0392b',textAlign:'center'}}>{note}</Text>
// // //           </View>
// // //         </View>}

// // //         {/* hint / video / skip  (clue has no cost pill now) */}
// // //         {circleBtn(226,'#a4d732','#f7f0d8',openClues,<Icon n="search" s={P(60)}/>)}
// // //         {circleBtn(471,'#f7ecd6','#f7f0d8',onVideo,<Icon n="film" s={P(70)}/>)}
// // //         {costPill(471,162,<Coin s={P(28)}/>,'+75')}
// // //         {circleBtn(716,'#ed434d','#f7f0d8',onSkip,<FFIcon s={P(70)}/>)}
// // //         {costPill(716,150,<Icon n="bulb" s={P(36)}/>,'50')}

// // //         {/* ---- clue popup (one clue, loaded from backend) ---- */}
// // //         {clueOpen&&<>
// // //           <Pressable onPress={()=>setClueOpen(false)} style={[A(0,0,DW,DH),{zIndex:40,elevation:40,backgroundColor:'rgba(10,25,60,0.5)'}]}/>
// // //           <View style={[A(70,560,802,470),{zIndex:41,elevation:41,borderRadius:P(56),backgroundColor:CREAM,borderWidth:P(14),borderColor:'#e0902f'}]}>
// // //             <Text style={{position:'absolute',left:0,right:0,top:P(34),textAlign:'center',fontFamily:F,fontSize:P(56),fontWeight:'900',color:NAVY,includeFontPadding:false}}>HINTS</Text>
// // //             <Squish style={A(640,22,78,78)} onPress={()=>setClueOpen(false)}>
// // //               <View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#fbde74',borderWidth:2,borderColor:'#2a2a2a',alignItems:'center',justifyContent:'center'}}><Icon n="cross" s={P(40)}/></View></Squish>
// // //             {[[1,130]].map(([k,y])=>{
// // //               const shown=seen>=k,avail=!shown&&seen===k-1;
// // //               return <Squish key={'clue'+k} disabled={!avail||busy} onPress={()=>reveal(k)} style={A(36,y,690,250)}>
// // //                 <View style={{width:P(690),height:P(250),borderRadius:P(40),backgroundColor:shown?'#ffffff':avail?'#f6e3b4':'#e4dccd',borderWidth:P(6),borderColor:shown?'#3ec75a':avail?'#ffb629':'#cfc3ae',flexDirection:'row',alignItems:'center',paddingHorizontal:P(28),gap:P(24)}}>
// // //                   <View style={{width:P(110),height:P(110),borderRadius:P(55),backgroundColor:shown||avail?'#bd6b29':'#b7a98f',alignItems:'center',justifyContent:'center'}}>
// // //                     {shown||avail
// // //                       ?<Text style={{fontFamily:F,fontSize:P(60),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{k}</Text>
// // //                       :<LockArt s={P(70)}/>}
// // //                   </View>
// // //                   <View style={{flex:1}}>
// // //                     <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(38),fontWeight:'900',color:shown||avail?'#bd6b29':'#8d7f68',includeFontPadding:false}}>{'Hint '+k}</Text>
// // //                     {shown
// // //                       ?<Text numberOfLines={4} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:P(36),color:'#17307a',marginTop:P(6)}}>{clueText}</Text>
// // //                       :avail
// // //                         ?<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:clueErr&&!busy?'#c0392b':'#6b4423',marginTop:P(8),includeFontPadding:false}}>{busy?'Loading hint...':clueErr?FALLBACK_CLUE:'Tap to reveal'}</Text>
// // //                         :<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(32),fontWeight:'bold',color:'#8d7f68',marginTop:P(8)}}>{'View Hint '+(k-1)+' first to unlock'}</Text>}
// // //                   </View>
// // //                 </View></Squish>})}
// // //           </View>
// // //         </>}
// // //       </View>
// // //     </>}
// // //   </View>}
// // import React,{useEffect,useRef,useState} from 'react';
// // import {View,Text,Animated,Pressable,PanResponder,Platform,Easing,StyleSheet} from 'react-native';
// // import Svg,{Rect,Path,Circle,Ellipse,G,Polygon,Line,Defs,LinearGradient,Stop} from 'react-native-svg';
// // import {F,INK,Coin} from './BTShared';
// // import {Icon} from './Art';
// // import {play,stop} from './BTSound';
// // import {fetchClue} from './Btclueapi';



// // const NAVY='#132f70',CREAM='#faf0e2',K='#1d1d1d';
// // const SERIF:any=Platform.select({web:'"Playfair Display",Georgia,"Times New Roman",serif',ios:'Georgia-Italic',default:'serif'});
// // const DW=942,DH=1669;
// // const WALL='#8fd3f4';

// // const FALLBACK_CLUE='Could not load the hint. Tap to try again.';
// // const LockArt=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Path d="M30 46 V34 a20 20 0 0 1 40 0 V46" fill="none" stroke="#7a6a55" strokeWidth="9" strokeLinecap="round"/><Rect x="20" y="44" width="60" height="44" rx="10" fill="#9b8a72"/><Circle cx="50" cy="63" r="6" fill="#f4e8d2"/><Rect x="47" y="63" width="6" height="15" rx="3" fill="#f4e8d2"/></Svg>;

// // /* ---------- eraser / pencil arts ---------- */
// // const EraserArt=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#2ea3e6" stroke={K} strokeWidth="2.5"/><Path d="M4 20 Q4 8 16 8 H46 V54 H16 Q4 54 4 42 Z" fill="#fff" stroke={K} strokeWidth="2.5"/></Svg>;
// // const PencilArt=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke={K} strokeWidth="1.5"/><Polygon points="2,15 10,11.5 10,18.5" fill={K}/><Rect x="26" y="4" width="84" height="22" fill="#1f9a4a" stroke={K} strokeWidth="1.5"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#b8b8b8" stroke={K} strokeWidth="1.5"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#8a8a8a" stroke={K} strokeWidth="1.5"/></Svg>;

// // /* ---------- garden scene (drawn in design coordinates) ---------- */
// // const Cloud=({x,y,s}:any)=><G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.96"><Ellipse cx="0" cy="0" rx="70" ry="34"/><Ellipse cx="-52" cy="12" rx="48" ry="26"/><Ellipse cx="56" cy="14" rx="52" ry="26"/><Ellipse cx="8" cy="-26" rx="44" ry="30"/></G>;
// // const Flower=({x,y,s=1}:any)=><G transform={`translate(${x} ${y}) scale(${s})`}>
// //   <Path d="M-26 28 Q-8 -4 0 10 Q10 -6 30 26 Q10 20 0 30 Q-12 20 -26 28Z" fill="#4faa2e"/>
// //   {[0,72,144,216,288].map(a=><Ellipse key={a} cx="0" cy="-17" rx="11" ry="17" fill="#fff" stroke="#e8e0d0" strokeWidth="1.5" transform={`rotate(${a})`}/>)}
// //   <Circle cx="0" cy="0" r="9" fill="#f9c933"/></G>;
// // const Tuft=({x,y,s=1}:any)=><Path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0 Q-8 -34 -18 -50 Q-2 -30 3 -46 Q10 -24 26 -40 Q12 -14 16 0Z" fill="#58b82f"/>;
// // const Rock=({x,y,w,h}:any)=><G><Ellipse cx={x} cy={y} rx={w} ry={h} fill="#8f969e"/><Ellipse cx={x-w*0.2} cy={y-h*0.3} rx={w*0.55} ry={h*0.4} fill="#aeb4bb"/></G>;
// // const Chain=({h}:any)=><Svg width={h*0.34} height={h} viewBox="0 0 20 60"><Ellipse cx="10" cy="9" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/><Ellipse cx="10" cy="27" rx="6" ry="9" fill="none" stroke="#6a5540" strokeWidth="3.2"/><Ellipse cx="10" cy="45" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/></Svg>;
// // const FFIcon=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Polygon points="14,22 50,50 14,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/><Polygon points="52,22 88,50 52,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/></Svg>;

// // /* ---- Level 3 style room: sky, clouds, hill, fence, face-plant (left), bookshelf (right) ---- */
// // function Room({w,h}:any){
// //   const books1:any[]=[[822,36,112,'#2fa6a0'],[860,34,122,'#f27ab0'],[896,40,106,'#8a63da']];
// //   const books2:any[]=[[822,32,102,'#e5483f'],[856,26,92,'#2f8fd8'],[884,44,118,'#3eae52']];
// //   const books3:any[]=[[822,34,96,'#f4c431'],[858,38,124,'#2f6fd0'],[898,34,104,'#e8913a']];
// //   const shelf=(arr:any[],bottom:number)=>arr.map((b,i)=><Rect key={bottom+'-'+i} x={b[0]} y={bottom-b[2]} width={b[1]} height={b[2]} rx="4" fill={b[3]} stroke="rgba(0,0,0,0.18)" strokeWidth="2"/>);
// //   return <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{position:'absolute',left:0,top:0}}>
// //     <Defs>
// //       <LinearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#58b9f1"/><Stop offset="0.6" stopColor="#6cc3f4"/><Stop offset="1" stopColor="#9bdcf8"/></LinearGradient>
// //       <LinearGradient id="gGrass" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#8fdc4f"/><Stop offset="1" stopColor="#4ba72d"/></LinearGradient>
// //       <LinearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#f0a94f"/><Stop offset="1" stopColor="#d98a3a"/></LinearGradient>
// //     </Defs>

// //     {/* sky + clouds */}
// //     <Rect width={DW} height={DH} fill="url(#gSky)"/>
// //     <Cloud x={850} y={235} s={0.62}/><Cloud x={95} y={985} s={0.55}/><Cloud x={760} y={900} s={0.5}/>

// //     {/* rolling hills behind the fence */}
// //     <Ellipse cx="170" cy="1215" rx="330" ry="150" fill="#9be05a"/>
// //     <Ellipse cx="640" cy="1250" rx="420" ry="140" fill="#86d14a"/>
// //     <Ellipse cx="930" cy="1190" rx="200" ry="120" fill="#a4e464"/>

// //     {/* meadow */}
// //     <Path d="M0 1215 Q471 1180 942 1215 V1669 H0Z" fill="url(#gGrass)"/>

// //     {/* wooden fence */}
// //     <G transform="translate(0 150)">
// //       <Rect x="0" y="1018" width={DW} height="18" fill="#e49c46"/>
// //       <Rect x="0" y="1070" width={DW} height="18" fill="#e49c46"/>
// //       {[0,1,2,3,4,5,6,7,8,9,10].map(i=>{const x=i*92-4;return <G key={'p'+i}>
// //         <Path d={`M${x} 1105 V985 L${x+27} 952 L${x+54} 985 V1105Z`} fill="#f0b45a" stroke="#c27a2a" strokeWidth="3"/>
// //         <Circle cx={x+27} cy="1000" r="4.5" fill="#8a5a2a"/><Circle cx={x+27} cy="1090" r="4.5" fill="#8a5a2a"/></G>})}
// //     </G>

// //     {/* grass details */}
// //     <Tuft x={250} y={1300} s={0.9}/><Tuft x={470} y={1285} s={0.8}/><Tuft x={700} y={1310} s={1}/>
// //     <Tuft x={150} y={1620} s={1.2}/><Tuft x={560} y={1650} s={1}/><Tuft x={780} y={1560} s={1}/>
// //     <Flower x={885} y={1235} s={0.9}/><Flower x={185} y={1610} s={1.1}/><Flower x={730} y={1630} s={1}/>
// //     <Rock x={60} y={1560} w={95} h={58}/><Rock x={875} y={1618} w={105} h={62}/>

// //     {/* cute plant in front of the fence (bottom-left) */}
// //     <G transform="translate(-27 629)">
// //       <Ellipse cx="95" cy="520" rx="44" ry="92" fill="#58b132"/>
// //       <Ellipse cx="152" cy="505" rx="34" ry="80" fill="#6fc842" transform="rotate(16 152 505)"/>
// //       <Ellipse cx="42" cy="535" rx="32" ry="64" fill="#4ea12b" transform="rotate(-16 42 535)"/>
// //       <Rect x="34" y="566" width="126" height="82" rx="28" fill="#f7ede0"/>
// //       <Circle cx="76" cy="604" r="6" fill="#5b3a29"/><Circle cx="118" cy="604" r="6" fill="#5b3a29"/>
// //       <Ellipse cx="56" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/><Ellipse cx="138" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/>
// //       <Path d="M88 618 Q97 628 106 618" stroke="#5b3a29" strokeWidth="4" fill="none" strokeLinecap="round"/>
// //     </G>

// //     {/* bookshelf (right) */}
// //     <Rect x="785" y="645" width="157" height="580" fill="#e8a24a"/>
// //     <Rect x="802" y="662" width="140" height="548" fill="#d58a33"/>
// //     {shelf(books1,826)}{shelf(books2,1006)}{shelf(books3,1190)}
// //     <Rect x="785" y="826" width="157" height="18" fill="#f2b862"/>
// //     <Rect x="785" y="1006" width="157" height="18" fill="#f2b862"/>
// //     <Rect x="785" y="1190" width="157" height="20" fill="#f2b862"/>
// //     <Rect x="785" y="645" width="157" height="20" fill="#f2b862"/>
// //     {/* plant on top of the shelf */}
// //     <Ellipse cx="850" cy="560" rx="26" ry="62" fill="#58b132" transform="rotate(-20 850 560)"/>
// //     <Ellipse cx="880" cy="545" rx="28" ry="72" fill="#6fc842"/>
// //     <Ellipse cx="912" cy="565" rx="24" ry="58" fill="#4ea12b" transform="rotate(22 912 565)"/>
// //     <Path d="M828 600 H934 L922 648 H840Z" fill="#e58a3e"/><Rect x="822" y="590" width="118" height="16" rx="6" fill="#f09a4a"/>

// //     {/* leaves in the top corners */}
// //     <Ellipse cx="30" cy="10" rx="170" ry="78" fill="#3f9f35"/><Ellipse cx="200" cy="0" rx="120" ry="52" fill="#58b940"/><Ellipse cx="90" cy="70" rx="80" ry="34" fill="#6fcb4c"/>
// //     <Ellipse cx="900" cy="8" rx="190" ry="84" fill="#3a9a32"/><Ellipse cx="730" cy="0" rx="115" ry="48" fill="#58b940"/><Ellipse cx="860" cy="78" rx="85" ry="34" fill="#6fcb4c"/>

// //     {/* wooden board behind the bottom buttons */}
// //     <Rect x="30" y="1292" width="882" height="304" rx="70" fill="url(#gWood)" stroke="#a65d1d" strokeWidth="10"/>
// //     <Path d="M70 1385 H872 M56 1490 H886" stroke="#b9722a" strokeWidth="5" opacity="0.7"/>
// //     <Path d="M120 1330 H260 M520 1345 H760 M90 1430 H300 M600 1440 H840 M180 1540 H420 M560 1550 H800" stroke="#c98235" strokeWidth="3" opacity="0.55" strokeLinecap="round"/>
// //     <Circle cx="82" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="82" cy="1548" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1548" r="9" fill="#8a5a2a"/>
// //   </Svg>}

// // /* ---------- drag any child freely (onTap fires when released with almost no movement) ---------- */
// // function DragView({children,sound,onTap}:any){
// //   const pan=useRef(new Animated.ValueXY()).current;
// //   const pr=useRef(PanResponder.create({
// //     onStartShouldSetPanResponder:()=>true,
// //     onPanResponderGrant:()=>{pan.extractOffset();if(sound)play(sound,{loop:true})},   // eraser = rubbing, pencil = scratching while dragging
// //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// //     onPanResponderRelease:(_e,g)=>{pan.flattenOffset();if(sound)stop(sound);
// //       if(onTap&&Math.hypot(g.dx,g.dy)<8)onTap()},
// //     onPanResponderTerminate:()=>{if(sound)stop(sound)}})).current;
// //   return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// // /* ---------- squish on press ---------- */
// // function Squish({style,onPress,disabled,children}:any){
// //   const s=useRef(new Animated.Value(1)).current;
// //   const to=(v:number)=>Animated.spring(s,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
// //   return <Pressable disabled={disabled} onPress={onPress} onPressIn={()=>to(0.92)} onPressOut={()=>to(1)} style={style}>
// //     <Animated.View style={{transform:[{scale:s}]}}>{children}</Animated.View></Pressable>}

// // /* ---------- one option circle ---------- */
// // function Bubble({size,delay,state,onPress,disabled,children}:any){
// //   const f=useRef(new Animated.Value(0)).current;
// //   useEffect(()=>{
// //     const a=Animated.loop(Animated.sequence([
// //       Animated.timing(f,{toValue:1,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
// //       Animated.timing(f,{toValue:0,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
// //     const t=setTimeout(()=>a.start(),delay);
// //     return()=>{clearTimeout(t);a.stop()}},[]);
// //   const wood=state==='ok'?'#46c25f':state==='bad'?'#ee4650':'#d98a3d';
// //   const woodEdge=state==='ok'?'#2a9a43':state==='bad'?'#b81f29':'#8f4f1c';
// //   const fill=state==='ok'?'#e3f9e6':state==='bad'?'#ffe3e3':'#fcf3e2';
// //   return <Animated.View style={{width:size,height:size,alignItems:'center',justifyContent:'center',
// //     transform:[{translateY:f.interpolate({inputRange:[0,1],outputRange:[0,-size*0.03]})}]}}>
// //     <Svg width={size} height={size} viewBox="0 0 200 200" style={{position:'absolute'}}>
// //       <Circle cx="100" cy="108" r="97" fill="rgba(60,30,5,0.28)"/>
// //       <Circle cx="100" cy="100" r="97" fill={wood}/>
// //       <Circle cx="100" cy="100" r="97" fill="none" stroke={woodEdge} strokeWidth="5"/>
// //       <Circle cx="100" cy="100" r="87" fill="none" stroke="rgba(255,225,170,0.55)" strokeWidth="3"/>
// //       <Circle cx="100" cy="100" r="78" fill={fill} stroke="rgba(120,70,20,0.35)" strokeWidth="3"/>
// //     </Svg>
// //     <Pressable disabled={disabled||!onPress} onPress={onPress} style={{width:size*0.8,height:size*0.8,borderRadius:size*0.4,alignItems:'center',justifyContent:'center'}}>
// //       {children}</Pressable>
// //   </Animated.View>}

// // /* ---------- FULL wrong sign: covers the whole ring (red tint + big X), pops in ---------- */
// // function WrongMark({size}:any){
// //   const s=useRef(new Animated.Value(0)).current;
// //   useEffect(()=>{Animated.spring(s,{toValue:1,friction:5,tension:150,useNativeDriver:true}).start()},[]);
// //   return <Animated.View pointerEvents="none" style={{position:'absolute',left:0,top:0,width:size,height:size,alignItems:'center',justifyContent:'center',
// //     opacity:s.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}),
// //     transform:[{scale:s.interpolate({inputRange:[0,1],outputRange:[0.4,1]})}]}}>
// //     <Svg width={size} height={size} viewBox="0 0 200 200">
// //       <Circle cx="100" cy="100" r="97" fill="rgba(238,70,80,0.38)"/>
// //       <Circle cx="100" cy="100" r="97" fill="none" stroke="#b81f29" strokeWidth="6"/>
// //       {/* white outline */}
// //       <Line x1="52" y1="52" x2="148" y2="148" stroke="#fff" strokeWidth="38" strokeLinecap="round"/>
// //       <Line x1="148" y1="52" x2="52" y2="148" stroke="#fff" strokeWidth="38" strokeLinecap="round"/>
// //       {/* red X */}
// //       <Line x1="52" y1="52" x2="148" y2="148" stroke="#e2182f" strokeWidth="26" strokeLinecap="round"/>
// //       <Line x1="148" y1="52" x2="52" y2="148" stroke="#e2182f" strokeWidth="26" strokeLinecap="round"/>
// //     </Svg>
// //   </Animated.View>}

// // /* =====================  MAIN  ===================== */
// // export default function BTLevel1Board({n,lv,hints,hid=[],mark,note,shake,qIn,bg,useRoomBg=false,art,showTools=true,playerId,onHome,onSettings,onPick,onClue,onCombine,onVideo,onSkip}:any){
// //   const [box,setBox]=useState({w:0,h:0});
// //   const sway=useRef(new Animated.Value(0)).current;
// //   useEffect(()=>{
// //     const a=Animated.loop(Animated.sequence([
// //       Animated.timing(sway,{toValue:1,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
// //       Animated.timing(sway,{toValue:0,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
// //     a.start();return()=>a.stop()},[]);

// //   // ---- clue popup state: seen = how many clues are revealed (0 or 1) ----
// //   const [clueOpen,setClueOpen]=useState(false);
// //   const [seen,setSeen]=useState(0);
// //   const [busy,setBusy]=useState(false);
// //   const [clueText,setClueText]=useState('');
// //   const [clueErr,setClueErr]=useState(false);
// //   const busyRef=useRef(false);

// //   // Clue flow: frontend -> POST /api/braintwist/clue -> backend reads the clue + saves the view in MySQL -> JSON back -> shown here.
// //   const reveal=async(k:number)=>{
// //     if(busyRef.current||seen!==k-1)return;
// //     busyRef.current=true;setBusy(true);setClueErr(false);
// //     const r=await fetchClue(playerId,Number(n));
// //     if(r.success&&r.clue){
// //       setClueText(r.clue);setSeen(k);
// //       try{if(onClue)onClue(r)}catch(e){}
// //     }else{
// //       setClueErr(true);
// //     }
// //     busyRef.current=false;setBusy(false)};
// //   const openClues=()=>{play('clue');setClueOpen(true);if(seen===0)reveal(1)};

// //   // ---- correct / wrong answer sound (parent sets `mark` when an option is picked) ----
// //   useEffect(()=>{if(mark)play(mark.ok?'correct':'wrong')},[mark]);

// //   // ---- wrong sign: flashes FULLY on a ring (number / eraser / pencil) for a moment ----
// //   const [flash,setFlash]=useState(-1);
// //   const flashT=useRef<any>(null);
// //   const flashBad=(idx:number)=>{
// //     play('wrong');setFlash(-1);                       // reset so the pop animation replays on repeated taps
// //     clearTimeout(flashT.current);
// //     setTimeout(()=>setFlash(idx),0);
// //     flashT.current=setTimeout(()=>setFlash(-1),900)};
// //   useEffect(()=>()=>clearTimeout(flashT.current),[]);

// //   // ---- drag-to-combine ----
// //   const [merged,setMerged]=useState<any>(null);
// //   const [dragIdx,setDragIdx]=useState(-1);
// //   const dPan=useRef(Array.from({length:6},()=>new Animated.ValueXY())).current;
// //   const live=useRef<any>({}).current;
// //   const back=(i:number)=>Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();
// //   const dPR=useRef(Array.from({length:6},(_,idx)=>PanResponder.create({
// //     onStartShouldSetPanResponder:()=>!!live.canDrag?.(idx),
// //     onPanResponderGrant:()=>{setDragIdx(idx);play('drag')},
// //     onPanResponderMove:Animated.event([null,{dx:dPan[idx].x,dy:dPan[idx].y}],{useNativeDriver:false}),
// //     onPanResponderRelease:(_e,g)=>{setDragIdx(-1);live.drop?.(idx,g.dx,g.dy)},
// //     onPanResponderTerminate:()=>{setDragIdx(-1);back(idx)}}))).current;

// //   // scale the 942x1669 design to the space we actually got
// //   const bw=Math.min(box.w,box.h*DW/DH),k=bw/DW,bh=bw*DH/DW;
// //   const top0=(box.h-bh)/2;
// //   const P=(v:number)=>v*k;
// //   const A=(x:number,y:number,w:number,h:number):any=>({position:'absolute',left:P(x),top:P(y),width:P(w),height:P(h)});

// //   // ---- build the 6 grid cells ----
// //   const opts:any[]=(lv?.items||[]).map((it:any,i:number)=>({it,i})).filter((o:any)=>o.it.k!=='duster'&&o.it.k!=='chalk').slice(0,6);
// //   const tools:any[]=showTools?[{tool:'eraser'},{tool:'pencil'}]:[];
// //   const total=opts.length+tools.length;
// //   const cells:any[]=new Array(total).fill(null);
// //   if(tools.length===2&&total===6){
// //     cells[1]=tools[0];cells[2]=tools[1];
// //     let q=0;for(let s=0;s<total;s++)if(!cells[s])cells[s]=opts[q++];
// //   }else{[...opts,...tools].forEach((c,s)=>{cells[s]=c})}
// //   const rows=Math.max(1,Math.ceil(total/2));
// //   const rowY=rows>=3?[546,791,1045]:rows===2?[650,945]:[795];
// //   const slot=(idx:number)=>{const r=Math.floor(idx/2),c=idx%2,alone=total%2===1&&idx===total-1;
// //     return {x:alone?480:[324,637][c],y:rowY[Math.min(r,rowY.length-1)]}};
// //   const markCell=mark?cells.findIndex((c:any)=>c&&c.it&&Math.abs(c.it.x+c.it.w/2-mark.x)<0.6):-1;
// //   const D=204;

// //   const isCombine=lv?.mode==='combine';
// //   live.canDrag=(idx:number)=>isCombine&&!merged&&!!cells[idx]?.it?.drag;
// //   live.drop=async(idx:number,dx:number,dy:number)=>{
// //     // plain tap on a draggable number (no real movement) -> wrong sign
// //     if(Math.hypot(dx,dy)<8){back(idx);flashBad(idx);return}
// //     const me=slot(idx),cx=me.x+dx/k,cy=me.y+dy/k;
// //     let j=-1,best=1e9;
// //     cells.forEach((o:any,s:number)=>{
// //       if(s===idx||!o?.it?.drag)return;
// //       const p=slot(s),d=Math.hypot(cx-p.x,cy-p.y);
// //       if(d<D*0.85&&d<best){best=d;j=s}});
// //     if(j<0){back(idx);flashBad(idx);return}
// //     const a=cells[idx].i,b=cells[j].i;
// //     const r=onCombine?await onCombine(Math.min(a,b),Math.max(a,b)):null;
// //     if(r&&r.correct){play('merge');const pj=slot(j);setMerged({x:(me.x+pj.x)/2,y:(me.y+pj.y)/2,t:r.result??'',a:idx,b:j})}
// //     else{back(idx);flashBad(idx)}};

// //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
// //   const qLen=(lv?.question||'').length;
// //   const qFont=P(qLen>60?27:qLen>22?34:42);

// //   // ---- bottom bar: 3 smaller, evenly spaced buttons (centres 226 / 471 / 716) ----
// //   const BTN=128,BTN_TOP=1342,PILL_Y=1484;
// //   const costPill=(cx:number,w:number,icon:any,text:string)=>
// //     <View style={[A(cx-w/2,PILL_Y,w,62),{borderRadius:P(31),backgroundColor:'#7a4520',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10)}]}>
// //       {icon}<Text numberOfLines={1} style={{fontFamily:F,fontSize:P(34),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{text}</Text></View>;
// //   const circleBtn=(cx:number,bgc:string,bc:string,onPress:any,icon:any)=>
// //     <Squish style={A(cx-BTN/2,BTN_TOP,BTN,BTN)} onPress={onPress}><View style={{width:P(BTN),height:P(BTN),borderRadius:P(BTN/2),backgroundColor:bgc,borderWidth:P(12),borderColor:bc,alignItems:'center',justifyContent:'center',elevation:6}}>{icon}</View></Squish>;

// //   return <View style={{flex:1,backgroundColor:WALL}} onLayout={e=>setBox({w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height})}>
// //     {useRoomBg&&bg}
// //     {box.w>0&&<>

// //       <View style={{position:'absolute',left:(box.w-bw)/2,top:top0,width:bw,height:bh}}>
// //         {!useRoomBg&&<Room w={bw} h={bh}/>}

// //         {/* top: home, settings */}
// //         <Squish style={A(27,111,78,78)} onPress={onHome}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="home" s={P(40)}/></View></Squish>
// //         <Squish style={A(119,111,78,78)} onPress={onSettings}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="gear" s={P(42)}/></View></Squish>

// //         {/* level sign (wood plank on chains) */}
// //         <Animated.View style={[A(300,88,346,140),{transform:[{rotate:swayR}]}]}>
// //           <View style={{position:'absolute',left:P(56),top:0}}><Chain h={P(56)}/></View>
// //           <View style={{position:'absolute',right:P(56),top:0}}><Chain h={P(56)}/></View>
// //           <View style={{position:'absolute',left:0,top:P(42),width:P(346),height:P(98),borderRadius:P(14),backgroundColor:'#b4651f',borderWidth:P(6),borderColor:'#8a4a1b',alignItems:'center',justifyContent:'center',elevation:6}}>
// //             <View style={{position:'absolute',top:P(8),left:P(16),right:P(16),height:P(5),borderRadius:P(3),backgroundColor:'rgba(255,214,150,0.35)'}}/>
// //             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10),flexWrap:'nowrap'}}>
// //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'<'}</Text>
// //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#fff',includeFontPadding:false,textShadowColor:'rgba(60,25,0,0.55)',textShadowOffset:{width:0,height:2},textShadowRadius:3}}>{'LEVEL '+n}</Text>
// //               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'>'}</Text>
// //             </View>
// //           </View>
// //         </Animated.View>

// //         {/* bulbs counter */}
// //         <View style={[A(728,126,142,72),{borderRadius:P(36),backgroundColor:'#fbf3e1',borderWidth:P(3),borderColor:'#d9c79e',borderStyle:'dashed',justifyContent:'center',paddingRight:P(30),alignItems:'center',elevation:4}]}>
// //           <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(44),fontWeight:'900',color:INK,includeFontPadding:false}}>{hints}</Text></View>
// //         <View style={A(846,100,70,70)}><Icon n="bulb" s={P(70)}/></View>

// //         {/* question pill */}
// //         <Animated.View style={[A(192,292,556,qLen>60?136:104),{borderRadius:P(qLen>60?44:52),backgroundColor:'#faf0da',borderWidth:P(4),borderColor:'#e9d4a6',alignItems:'center',justifyContent:'center',elevation:4,
// //           opacity:qIn??1,transform:[{translateY:qIn?qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]}):0}]}]}>
// //           <Text style={{position:'absolute',left:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'<'}</Text>
// //           <Text style={{position:'absolute',right:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'>'}</Text>
// //           <Text numberOfLines={3} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:qFont,color:'#17307a',maxWidth:P(430),textAlign:'center'}}>{lv?.question}</Text>
// //         </Animated.View>

// //         {/* options grid */}
// //         <Animated.View pointerEvents="box-none" style={[StyleSheet.absoluteFill,{transform:[{translateX:shake??0}]}]}>
// //           {cells.map((c:any,idx:number)=>{
// //             if(!c)return null;
// //             const {x,y}=slot(idx);
// //             const pos=A(x-D/2,y-D/2,D,D);

// //             /* eraser / pencil ring: tap ALWAYS shows the full wrong sign */
// //             if(c.tool)return <View key={'t'+idx} style={[pos,{zIndex:flash===idx?35:20,elevation:flash===idx?35:0}]}>
// //               <Bubble size={P(D)} delay={idx*350} state={flash===idx?'bad':undefined}>
// //                 <DragView sound={c.tool} onTap={()=>flashBad(idx)}>{c.tool==='eraser'
// //                   ?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
// //                   :<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>}</DragView>
// //               </Bubble>
// //               {flash===idx&&<WrongMark size={P(D)}/>}
// //             </View>;

// //             const {it,i}=c,Art=art?.[it.k],hidden=hid.includes(i);
// //             const state=markCell===idx?(mark.ok?'ok':'bad'):(flash===idx?'bad':undefined);
// //             const drag=isCombine&&!!it.drag,gone=!!merged&&(merged.a===idx||merged.b===idx);
// //             return <Animated.View key={'o'+idx} {...(drag?dPR[idx].panHandlers:{})}
// //               style={[pos,{opacity:gone?0:hidden?0.2:1,zIndex:dragIdx===idx?30:state==='bad'?25:1,elevation:dragIdx===idx?30:state==='bad'?25:0},drag?{transform:dPan[idx].getTranslateTransform()}:null]}>
// //               <Bubble size={P(D)} delay={idx*350} state={state} disabled={hidden} onPress={drag?undefined:()=>{isCombine?flashBad(idx):onPick(i)}}>
// //                 {it.k==='eraser'?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
// //                 :it.k==='pencil'?<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>
// //                 :Art&&it.k!=='num'?<Art w={P(130)} t={it.t} grey={it.grey} i={i}/>
// //                 :<Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(it.t??'').length>2?78:116),includeFontPadding:false}}>{String(it.t??'')}</Text>}
// //               </Bubble>
// //               {state==='bad'&&<WrongMark size={P(D)}/>}
// //               {state==='ok'&&<View pointerEvents="none" style={{position:'absolute',right:0,top:0}}><Icon n="check" s={P(64)}/></View>}
// //             </Animated.View>})}
// //           {merged&&<View pointerEvents="none" style={[A(merged.x-D/2,merged.y-D/2,D,D),{zIndex:25,elevation:25}]}>
// //             <Bubble size={P(D)} delay={0} state="ok">
// //               <Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(merged.t).length>2?78:116),includeFontPadding:false}}>{String(merged.t)}</Text>
// //             </Bubble></View>}
// //         </Animated.View>

// //         {/* message line: between the grid and the bottom bar */}
// //         {!!note&&<View pointerEvents="none" style={[A(60,1170,822,68),{zIndex:20,elevation:20,alignItems:'center',justifyContent:'center'}]}>
// //           <View style={{backgroundColor:'rgba(255,255,255,0.92)',borderRadius:P(34),paddingHorizontal:P(34),paddingVertical:P(8)}}>
// //             <Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:'#c0392b',textAlign:'center'}}>{note}</Text>
// //           </View>
// //         </View>}

// //         {/* hint / video / skip  (clue has no cost pill now) */}
// //         {circleBtn(226,'#a4d732','#f7f0d8',openClues,<Icon n="search" s={P(60)}/>)}
// //         {circleBtn(471,'#f7ecd6','#f7f0d8',onVideo,<Icon n="film" s={P(70)}/>)}
// //         {costPill(471,162,<Coin s={P(28)}/>,'+75')}
// //         {circleBtn(716,'#ed434d','#f7f0d8',onSkip,<FFIcon s={P(70)}/>)}
// //         {costPill(716,150,<Icon n="bulb" s={P(36)}/>,'50')}

// //         {/* ---- clue popup (one clue, loaded from backend) ---- */}
// //         {clueOpen&&<>
// //           <Pressable onPress={()=>setClueOpen(false)} style={[A(0,0,DW,DH),{zIndex:40,elevation:40,backgroundColor:'rgba(10,25,60,0.5)'}]}/>
// //           <View style={[A(70,560,802,470),{zIndex:41,elevation:41,borderRadius:P(56),backgroundColor:CREAM,borderWidth:P(14),borderColor:'#e0902f'}]}>
// //             <Text style={{position:'absolute',left:0,right:0,top:P(34),textAlign:'center',fontFamily:F,fontSize:P(56),fontWeight:'900',color:NAVY,includeFontPadding:false}}>HINTS</Text>
// //             <Squish style={A(640,22,78,78)} onPress={()=>setClueOpen(false)}>
// //               <View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#fbde74',borderWidth:2,borderColor:'#2a2a2a',alignItems:'center',justifyContent:'center'}}><Icon n="cross" s={P(40)}/></View></Squish>
// //             {[[1,130]].map(([k,y])=>{
// //               const shown=seen>=k,avail=!shown&&seen===k-1;
// //               return <Squish key={'clue'+k} disabled={!avail||busy} onPress={()=>reveal(k)} style={A(36,y,690,250)}>
// //                 <View style={{width:P(690),height:P(250),borderRadius:P(40),backgroundColor:shown?'#ffffff':avail?'#f6e3b4':'#e4dccd',borderWidth:P(6),borderColor:shown?'#3ec75a':avail?'#ffb629':'#cfc3ae',flexDirection:'row',alignItems:'center',paddingHorizontal:P(28),gap:P(24)}}>
// //                   <View style={{width:P(110),height:P(110),borderRadius:P(55),backgroundColor:shown||avail?'#bd6b29':'#b7a98f',alignItems:'center',justifyContent:'center'}}>
// //                     {shown||avail
// //                       ?<Text style={{fontFamily:F,fontSize:P(60),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{k}</Text>
// //                       :<LockArt s={P(70)}/>}
// //                   </View>
// //                   <View style={{flex:1}}>
// //                     <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(38),fontWeight:'900',color:shown||avail?'#bd6b29':'#8d7f68',includeFontPadding:false}}>{'Hint '+k}</Text>
// //                     {shown
// //                       ?<Text numberOfLines={4} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:P(36),color:'#17307a',marginTop:P(6)}}>{clueText}</Text>
// //                       :avail
// //                         ?<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:clueErr&&!busy?'#c0392b':'#6b4423',marginTop:P(8),includeFontPadding:false}}>{busy?'Loading hint...':clueErr?FALLBACK_CLUE:'Tap to reveal'}</Text>
// //                         :<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(32),fontWeight:'bold',color:'#8d7f68',marginTop:P(8)}}>{'View Hint '+(k-1)+' first to unlock'}</Text>}
// //                   </View>
// //                 </View></Squish>})}
// //           </View>
// //         </>}
// //       </View>
// //     </>}
// //   </View>}
// import React,{useEffect,useRef,useState} from 'react';
// import {View,Text,Animated,Pressable,PanResponder,Platform,Easing,StyleSheet} from 'react-native';
// import Svg,{Rect,Path,Circle,Ellipse,G,Polygon,Line,Polyline,Defs,LinearGradient,Stop} from 'react-native-svg';
// import {F,INK,Coin} from './BTShared';
// import {Icon} from './Art';
// import {play,stop} from './BTSound';
// import {fetchClue} from './Btclueapi';



// const NAVY='#132f70',CREAM='#faf0e2',K='#1d1d1d';
// const SERIF:any=Platform.select({web:'"Playfair Display",Georgia,"Times New Roman",serif',ios:'Georgia-Italic',default:'serif'});
// const DW=942,DH=1669;
// const WALL='#8fd3f4';

// const FALLBACK_CLUE='Could not load the hint. Tap to try again.';
// const LockArt=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Path d="M30 46 V34 a20 20 0 0 1 40 0 V46" fill="none" stroke="#7a6a55" strokeWidth="9" strokeLinecap="round"/><Rect x="20" y="44" width="60" height="44" rx="10" fill="#9b8a72"/><Circle cx="50" cy="63" r="6" fill="#f4e8d2"/><Rect x="47" y="63" width="6" height="15" rx="3" fill="#f4e8d2"/></Svg>;

// /* ---------- eraser / pencil arts ---------- */
// const EraserArt=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#2ea3e6" stroke={K} strokeWidth="2.5"/><Path d="M4 20 Q4 8 16 8 H46 V54 H16 Q4 54 4 42 Z" fill="#fff" stroke={K} strokeWidth="2.5"/></Svg>;
// const PencilArt=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke={K} strokeWidth="1.5"/><Polygon points="2,15 10,11.5 10,18.5" fill={K}/><Rect x="26" y="4" width="84" height="22" fill="#1f9a4a" stroke={K} strokeWidth="1.5"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#b8b8b8" stroke={K} strokeWidth="1.5"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#8a8a8a" stroke={K} strokeWidth="1.5"/></Svg>;

// /* ---------- garden scene (drawn in design coordinates) ---------- */
// const Cloud=({x,y,s}:any)=><G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.96"><Ellipse cx="0" cy="0" rx="70" ry="34"/><Ellipse cx="-52" cy="12" rx="48" ry="26"/><Ellipse cx="56" cy="14" rx="52" ry="26"/><Ellipse cx="8" cy="-26" rx="44" ry="30"/></G>;
// const Flower=({x,y,s=1}:any)=><G transform={`translate(${x} ${y}) scale(${s})`}>
//   <Path d="M-26 28 Q-8 -4 0 10 Q10 -6 30 26 Q10 20 0 30 Q-12 20 -26 28Z" fill="#4faa2e"/>
//   {[0,72,144,216,288].map(a=><Ellipse key={a} cx="0" cy="-17" rx="11" ry="17" fill="#fff" stroke="#e8e0d0" strokeWidth="1.5" transform={`rotate(${a})`}/>)}
//   <Circle cx="0" cy="0" r="9" fill="#f9c933"/></G>;
// const Tuft=({x,y,s=1}:any)=><Path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0 Q-8 -34 -18 -50 Q-2 -30 3 -46 Q10 -24 26 -40 Q12 -14 16 0Z" fill="#58b82f"/>;
// const Rock=({x,y,w,h}:any)=><G><Ellipse cx={x} cy={y} rx={w} ry={h} fill="#8f969e"/><Ellipse cx={x-w*0.2} cy={y-h*0.3} rx={w*0.55} ry={h*0.4} fill="#aeb4bb"/></G>;
// const Chain=({h}:any)=><Svg width={h*0.34} height={h} viewBox="0 0 20 60"><Ellipse cx="10" cy="9" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/><Ellipse cx="10" cy="27" rx="6" ry="9" fill="none" stroke="#6a5540" strokeWidth="3.2"/><Ellipse cx="10" cy="45" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/></Svg>;
// const FFIcon=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Polygon points="14,22 50,50 14,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/><Polygon points="52,22 88,50 52,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/></Svg>;

// /* ---- Level 3 style room: sky, clouds, hill, fence, face-plant (left), bookshelf (right) ---- */
// function Room({w,h}:any){
//   const books1:any[]=[[822,36,112,'#2fa6a0'],[860,34,122,'#f27ab0'],[896,40,106,'#8a63da']];
//   const books2:any[]=[[822,32,102,'#e5483f'],[856,26,92,'#2f8fd8'],[884,44,118,'#3eae52']];
//   const books3:any[]=[[822,34,96,'#f4c431'],[858,38,124,'#2f6fd0'],[898,34,104,'#e8913a']];
//   const shelf=(arr:any[],bottom:number)=>arr.map((b,i)=><Rect key={bottom+'-'+i} x={b[0]} y={bottom-b[2]} width={b[1]} height={b[2]} rx="4" fill={b[3]} stroke="rgba(0,0,0,0.18)" strokeWidth="2"/>);
//   return <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{position:'absolute',left:0,top:0}}>
//     <Defs>
//       <LinearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#58b9f1"/><Stop offset="0.6" stopColor="#6cc3f4"/><Stop offset="1" stopColor="#9bdcf8"/></LinearGradient>
//       <LinearGradient id="gGrass" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#8fdc4f"/><Stop offset="1" stopColor="#4ba72d"/></LinearGradient>
//       <LinearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#f0a94f"/><Stop offset="1" stopColor="#d98a3a"/></LinearGradient>
//     </Defs>

//     {/* sky + clouds */}
//     <Rect width={DW} height={DH} fill="url(#gSky)"/>
//     <Cloud x={850} y={235} s={0.62}/><Cloud x={95} y={985} s={0.55}/><Cloud x={760} y={900} s={0.5}/>

//     {/* rolling hills behind the fence */}
//     <Ellipse cx="170" cy="1215" rx="330" ry="150" fill="#9be05a"/>
//     <Ellipse cx="640" cy="1250" rx="420" ry="140" fill="#86d14a"/>
//     <Ellipse cx="930" cy="1190" rx="200" ry="120" fill="#a4e464"/>

//     {/* meadow */}
//     <Path d="M0 1215 Q471 1180 942 1215 V1669 H0Z" fill="url(#gGrass)"/>

//     {/* wooden fence */}
//     <G transform="translate(0 150)">
//       <Rect x="0" y="1018" width={DW} height="18" fill="#e49c46"/>
//       <Rect x="0" y="1070" width={DW} height="18" fill="#e49c46"/>
//       {[0,1,2,3,4,5,6,7,8,9,10].map(i=>{const x=i*92-4;return <G key={'p'+i}>
//         <Path d={`M${x} 1105 V985 L${x+27} 952 L${x+54} 985 V1105Z`} fill="#f0b45a" stroke="#c27a2a" strokeWidth="3"/>
//         <Circle cx={x+27} cy="1000" r="4.5" fill="#8a5a2a"/><Circle cx={x+27} cy="1090" r="4.5" fill="#8a5a2a"/></G>})}
//     </G>

//     {/* grass details */}
//     <Tuft x={250} y={1300} s={0.9}/><Tuft x={470} y={1285} s={0.8}/><Tuft x={700} y={1310} s={1}/>
//     <Tuft x={150} y={1620} s={1.2}/><Tuft x={560} y={1650} s={1}/><Tuft x={780} y={1560} s={1}/>
//     <Flower x={885} y={1235} s={0.9}/><Flower x={185} y={1610} s={1.1}/><Flower x={730} y={1630} s={1}/>
//     <Rock x={60} y={1560} w={95} h={58}/><Rock x={875} y={1618} w={105} h={62}/>

//     {/* cute plant in front of the fence (bottom-left) */}
//     <G transform="translate(-27 629)">
//       <Ellipse cx="95" cy="520" rx="44" ry="92" fill="#58b132"/>
//       <Ellipse cx="152" cy="505" rx="34" ry="80" fill="#6fc842" transform="rotate(16 152 505)"/>
//       <Ellipse cx="42" cy="535" rx="32" ry="64" fill="#4ea12b" transform="rotate(-16 42 535)"/>
//       <Rect x="34" y="566" width="126" height="82" rx="28" fill="#f7ede0"/>
//       <Circle cx="76" cy="604" r="6" fill="#5b3a29"/><Circle cx="118" cy="604" r="6" fill="#5b3a29"/>
//       <Ellipse cx="56" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/><Ellipse cx="138" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/>
//       <Path d="M88 618 Q97 628 106 618" stroke="#5b3a29" strokeWidth="4" fill="none" strokeLinecap="round"/>
//     </G>

//     {/* bookshelf (right) */}
//     <Rect x="785" y="645" width="157" height="580" fill="#e8a24a"/>
//     <Rect x="802" y="662" width="140" height="548" fill="#d58a33"/>
//     {shelf(books1,826)}{shelf(books2,1006)}{shelf(books3,1190)}
//     <Rect x="785" y="826" width="157" height="18" fill="#f2b862"/>
//     <Rect x="785" y="1006" width="157" height="18" fill="#f2b862"/>
//     <Rect x="785" y="1190" width="157" height="20" fill="#f2b862"/>
//     <Rect x="785" y="645" width="157" height="20" fill="#f2b862"/>
//     {/* plant on top of the shelf */}
//     <Ellipse cx="850" cy="560" rx="26" ry="62" fill="#58b132" transform="rotate(-20 850 560)"/>
//     <Ellipse cx="880" cy="545" rx="28" ry="72" fill="#6fc842"/>
//     <Ellipse cx="912" cy="565" rx="24" ry="58" fill="#4ea12b" transform="rotate(22 912 565)"/>
//     <Path d="M828 600 H934 L922 648 H840Z" fill="#e58a3e"/><Rect x="822" y="590" width="118" height="16" rx="6" fill="#f09a4a"/>

//     {/* leaves in the top corners */}
//     <Ellipse cx="30" cy="10" rx="170" ry="78" fill="#3f9f35"/><Ellipse cx="200" cy="0" rx="120" ry="52" fill="#58b940"/><Ellipse cx="90" cy="70" rx="80" ry="34" fill="#6fcb4c"/>
//     <Ellipse cx="900" cy="8" rx="190" ry="84" fill="#3a9a32"/><Ellipse cx="730" cy="0" rx="115" ry="48" fill="#58b940"/><Ellipse cx="860" cy="78" rx="85" ry="34" fill="#6fcb4c"/>

//     {/* wooden board behind the bottom buttons */}
//     <Rect x="30" y="1292" width="882" height="304" rx="70" fill="url(#gWood)" stroke="#a65d1d" strokeWidth="10"/>
//     <Path d="M70 1385 H872 M56 1490 H886" stroke="#b9722a" strokeWidth="5" opacity="0.7"/>
//     <Path d="M120 1330 H260 M520 1345 H760 M90 1430 H300 M600 1440 H840 M180 1540 H420 M560 1550 H800" stroke="#c98235" strokeWidth="3" opacity="0.55" strokeLinecap="round"/>
//     <Circle cx="82" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="82" cy="1548" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1548" r="9" fill="#8a5a2a"/>
//   </Svg>}

// /* ---------- drag any child freely (onTap fires when released with almost no movement) ---------- */
// function DragView({children,sound,onTap}:any){
//   const pan=useRef(new Animated.ValueXY()).current;
//   const pr=useRef(PanResponder.create({
//     onStartShouldSetPanResponder:()=>true,
//     onPanResponderGrant:()=>{pan.extractOffset();if(sound)play(sound,{loop:true})},   // eraser = rubbing, pencil = scratching while dragging
//     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
//     onPanResponderRelease:(_e,g)=>{pan.flattenOffset();if(sound)stop(sound);
//       if(onTap&&Math.hypot(g.dx,g.dy)<8)onTap()},
//     onPanResponderTerminate:()=>{if(sound)stop(sound)}})).current;
//   return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// /* ---------- squish on press ---------- */
// function Squish({style,onPress,disabled,children}:any){
//   const s=useRef(new Animated.Value(1)).current;
//   const to=(v:number)=>Animated.spring(s,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
//   return <Pressable disabled={disabled} onPress={onPress} onPressIn={()=>to(0.92)} onPressOut={()=>to(1)} style={style}>
//     <Animated.View style={{transform:[{scale:s}]}}>{children}</Animated.View></Pressable>}

// /* ---------- one option circle ---------- */
// function Bubble({size,delay,state,onPress,disabled,children}:any){
//   const f=useRef(new Animated.Value(0)).current;
//   useEffect(()=>{
//     const a=Animated.loop(Animated.sequence([
//       Animated.timing(f,{toValue:1,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
//       Animated.timing(f,{toValue:0,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
//     const t=setTimeout(()=>a.start(),delay);
//     return()=>{clearTimeout(t);a.stop()}},[]);
//   const wood=state==='ok'?'#46c25f':state==='bad'?'#ee4650':'#d98a3d';
//   const woodEdge=state==='ok'?'#2a9a43':state==='bad'?'#b81f29':'#8f4f1c';
//   const fill=state==='ok'?'#e3f9e6':state==='bad'?'#ffe3e3':'#fcf3e2';
//   return <Animated.View style={{width:size,height:size,alignItems:'center',justifyContent:'center',
//     transform:[{translateY:f.interpolate({inputRange:[0,1],outputRange:[0,-size*0.03]})}]}}>
//     <Svg width={size} height={size} viewBox="0 0 200 200" style={{position:'absolute'}}>
//       <Circle cx="100" cy="108" r="97" fill="rgba(60,30,5,0.28)"/>
//       <Circle cx="100" cy="100" r="97" fill={wood}/>
//       <Circle cx="100" cy="100" r="97" fill="none" stroke={woodEdge} strokeWidth="5"/>
//       <Circle cx="100" cy="100" r="87" fill="none" stroke="rgba(255,225,170,0.55)" strokeWidth="3"/>
//       <Circle cx="100" cy="100" r="78" fill={fill} stroke="rgba(120,70,20,0.35)" strokeWidth="3"/>
//     </Svg>
//     <Pressable disabled={disabled||!onPress} onPress={onPress} style={{width:size*0.8,height:size*0.8,borderRadius:size*0.4,alignItems:'center',justifyContent:'center'}}>
//       {children}</Pressable>
//   </Animated.View>}

// /* ---------- FULL wrong sign: covers the whole ring (red tint + big X), pops in ---------- */
// function WrongMark({size}:any){
//   const s=useRef(new Animated.Value(0)).current;
//   useEffect(()=>{Animated.spring(s,{toValue:1,friction:5,tension:150,useNativeDriver:true}).start()},[]);
//   return <Animated.View pointerEvents="none" style={{position:'absolute',left:0,top:0,width:size,height:size,alignItems:'center',justifyContent:'center',
//     opacity:s.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}),
//     transform:[{scale:s.interpolate({inputRange:[0,1],outputRange:[0.4,1]})}]}}>
//     <Svg width={size} height={size} viewBox="0 0 200 200">
//       <Circle cx="100" cy="100" r="97" fill="rgba(238,70,80,0.38)"/>
//       <Circle cx="100" cy="100" r="97" fill="none" stroke="#b81f29" strokeWidth="6"/>
//       {/* white outline */}
//       <Line x1="52" y1="52" x2="148" y2="148" stroke="#fff" strokeWidth="38" strokeLinecap="round"/>
//       <Line x1="148" y1="52" x2="52" y2="148" stroke="#fff" strokeWidth="38" strokeLinecap="round"/>
//       {/* red X */}
//       <Line x1="52" y1="52" x2="148" y2="148" stroke="#e2182f" strokeWidth="26" strokeLinecap="round"/>
//       <Line x1="148" y1="52" x2="52" y2="148" stroke="#e2182f" strokeWidth="26" strokeLinecap="round"/>
//     </Svg>
//   </Animated.View>}

// /* ---------- FULL correct sign: covers the whole ring (green tint + big tick), pops in ---------- */
// function CorrectMark({size}:any){
//   const s=useRef(new Animated.Value(0)).current;
//   useEffect(()=>{Animated.spring(s,{toValue:1,friction:5,tension:150,useNativeDriver:true}).start()},[]);
//   return <Animated.View pointerEvents="none" style={{position:'absolute',left:0,top:0,width:size,height:size,alignItems:'center',justifyContent:'center',
//     opacity:s.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}),
//     transform:[{scale:s.interpolate({inputRange:[0,1],outputRange:[0.4,1]})}]}}>
//     <Svg width={size} height={size} viewBox="0 0 200 200">
//       <Circle cx="100" cy="100" r="97" fill="rgba(70,194,95,0.42)"/>
//       <Circle cx="100" cy="100" r="97" fill="none" stroke="#2a9a43" strokeWidth="6"/>
//       {/* white outline */}
//       <Polyline points="52,104 88,140 150,62" fill="none" stroke="#fff" strokeWidth="38" strokeLinecap="round" strokeLinejoin="round"/>
//       {/* green tick */}
//       <Polyline points="52,104 88,140 150,62" fill="none" stroke="#1fae3e" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round"/>
//     </Svg>
//   </Animated.View>}

// /* =====================  MAIN  ===================== */
// export default function BTLevel1Board({n,lv,hints,hid=[],mark,note,shake,qIn,bg,useRoomBg=false,art,showTools=true,playerId,onHome,onSettings,onPick,onClue,onCombine,onVideo,onSkip}:any){
//   const [box,setBox]=useState({w:0,h:0});
//   const sway=useRef(new Animated.Value(0)).current;
//   useEffect(()=>{
//     const a=Animated.loop(Animated.sequence([
//       Animated.timing(sway,{toValue:1,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
//       Animated.timing(sway,{toValue:0,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
//     a.start();return()=>a.stop()},[]);

//   // ---- clue popup state: seen = how many clues are revealed (0 or 1) ----
//   const [clueOpen,setClueOpen]=useState(false);
//   const [seen,setSeen]=useState(0);
//   const [busy,setBusy]=useState(false);
//   const [clueText,setClueText]=useState('');
//   const [clueErr,setClueErr]=useState(false);
//   const busyRef=useRef(false);

//   // Clue flow: frontend -> POST /api/braintwist/clue -> backend reads the clue + saves the view in MySQL -> JSON back -> shown here.
//   const reveal=async(k:number)=>{
//     if(busyRef.current||seen!==k-1)return;
//     busyRef.current=true;setBusy(true);setClueErr(false);
//     const r=await fetchClue(playerId,Number(n));
//     if(r.success&&r.clue){
//       setClueText(r.clue);setSeen(k);
//       try{if(onClue)onClue(r)}catch(e){}
//     }else{
//       setClueErr(true);
//     }
//     busyRef.current=false;setBusy(false)};
//   const openClues=()=>{play('clue');setClueOpen(true);if(seen===0)reveal(1)};

//   // ---- correct / wrong answer sound (parent sets `mark` when an option is picked) ----
//   useEffect(()=>{if(mark)play(mark.ok?'correct':'wrong')},[mark]);

//   // ---- wrong sign: flashes FULLY on a ring (number / eraser / pencil) for a moment ----
//   const [flash,setFlash]=useState(-1);
//   const flashT=useRef<any>(null);
//   const flashBad=(idx:number)=>{
//     play('wrong');setFlash(-1);                       // reset so the pop animation replays on repeated taps
//     clearTimeout(flashT.current);
//     setTimeout(()=>setFlash(idx),0);
//     flashT.current=setTimeout(()=>setFlash(-1),900)};
//   useEffect(()=>()=>clearTimeout(flashT.current),[]);

//   // ---- drag-to-combine ----
//   const [merged,setMerged]=useState<any>(null);
//   const [dragIdx,setDragIdx]=useState(-1);
//   const dPan=useRef(Array.from({length:6},()=>new Animated.ValueXY())).current;
//   const live=useRef<any>({}).current;
//   const back=(i:number)=>Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();
//   const dPR=useRef(Array.from({length:6},(_,idx)=>PanResponder.create({
//     onStartShouldSetPanResponder:()=>!!live.canDrag?.(idx),
//     onPanResponderGrant:()=>{setDragIdx(idx);play('drag')},
//     onPanResponderMove:Animated.event([null,{dx:dPan[idx].x,dy:dPan[idx].y}],{useNativeDriver:false}),
//     onPanResponderRelease:(_e,g)=>{setDragIdx(-1);live.drop?.(idx,g.dx,g.dy)},
//     onPanResponderTerminate:()=>{setDragIdx(-1);back(idx)}}))).current;

//   // scale the 942x1669 design to the space we actually got
//   const bw=Math.min(box.w,box.h*DW/DH),k=bw/DW,bh=bw*DH/DW;
//   const top0=(box.h-bh)/2;
//   const P=(v:number)=>v*k;
//   const A=(x:number,y:number,w:number,h:number):any=>({position:'absolute',left:P(x),top:P(y),width:P(w),height:P(h)});

//   // ---- build the 6 grid cells ----
//   const opts:any[]=(lv?.items||[]).map((it:any,i:number)=>({it,i})).filter((o:any)=>o.it.k!=='duster'&&o.it.k!=='chalk').slice(0,6);
//   const tools:any[]=showTools?[{tool:'eraser'},{tool:'pencil'}]:[];
//   const total=opts.length+tools.length;
//   const cells:any[]=new Array(total).fill(null);
//   if(tools.length===2&&total===6){
//     cells[1]=tools[0];cells[2]=tools[1];
//     let q=0;for(let s=0;s<total;s++)if(!cells[s])cells[s]=opts[q++];
//   }else{[...opts,...tools].forEach((c,s)=>{cells[s]=c})}
//   const rows=Math.max(1,Math.ceil(total/2));
//   const rowY=rows>=3?[546,791,1045]:rows===2?[650,945]:[795];
//   const slot=(idx:number)=>{const r=Math.floor(idx/2),c=idx%2,alone=total%2===1&&idx===total-1;
//     return {x:alone?480:[324,637][c],y:rowY[Math.min(r,rowY.length-1)]}};
//   const markCell=mark?cells.findIndex((c:any)=>c&&c.it&&Math.abs(c.it.x+c.it.w/2-mark.x)<0.6):-1;
//   const D=204;

//   const isCombine=lv?.mode==='combine';
//   live.canDrag=(idx:number)=>isCombine&&!merged&&!!cells[idx]?.it?.drag;
//   live.drop=async(idx:number,dx:number,dy:number)=>{
//     // plain tap on a draggable number (no real movement) -> wrong sign
//     if(Math.hypot(dx,dy)<8){back(idx);flashBad(idx);return}
//     const me=slot(idx),cx=me.x+dx/k,cy=me.y+dy/k;
//     let j=-1,best=1e9;
//     cells.forEach((o:any,s:number)=>{
//       if(s===idx||!o?.it?.drag)return;
//       const p=slot(s),d=Math.hypot(cx-p.x,cy-p.y);
//       if(d<D*0.85&&d<best){best=d;j=s}});
//     if(j<0){back(idx);flashBad(idx);return}
//     const a=cells[idx].i,b=cells[j].i;
//     const r=onCombine?await onCombine(Math.min(a,b),Math.max(a,b)):null;
//     if(r&&r.correct){play('merge');const pj=slot(j);setMerged({x:(me.x+pj.x)/2,y:(me.y+pj.y)/2,t:r.result??'',a:idx,b:j})}
//     else{back(idx);flashBad(idx)}};

//   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
//   const qLen=(lv?.question||'').length;
//   const qFont=P(qLen>60?27:qLen>22?34:42);

//   // ---- bottom bar: 3 smaller, evenly spaced buttons (centres 226 / 471 / 716) ----
//   const BTN=128,BTN_TOP=1342,PILL_Y=1484;
//   const costPill=(cx:number,w:number,icon:any,text:string)=>
//     <View style={[A(cx-w/2,PILL_Y,w,62),{borderRadius:P(31),backgroundColor:'#7a4520',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10)}]}>
//       {icon}<Text numberOfLines={1} style={{fontFamily:F,fontSize:P(34),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{text}</Text></View>;
//   const circleBtn=(cx:number,bgc:string,bc:string,onPress:any,icon:any)=>
//     <Squish style={A(cx-BTN/2,BTN_TOP,BTN,BTN)} onPress={onPress}><View style={{width:P(BTN),height:P(BTN),borderRadius:P(BTN/2),backgroundColor:bgc,borderWidth:P(12),borderColor:bc,alignItems:'center',justifyContent:'center',elevation:6}}>{icon}</View></Squish>;

//   return <View style={{flex:1,backgroundColor:WALL}} onLayout={e=>setBox({w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height})}>
//     {useRoomBg&&bg}
//     {box.w>0&&<>

//       <View style={{position:'absolute',left:(box.w-bw)/2,top:top0,width:bw,height:bh}}>
//         {!useRoomBg&&<Room w={bw} h={bh}/>}

//         {/* top: home, settings */}
//         <Squish style={A(27,111,78,78)} onPress={onHome}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="home" s={P(40)}/></View></Squish>
//         <Squish style={A(119,111,78,78)} onPress={onSettings}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="gear" s={P(42)}/></View></Squish>

//         {/* level sign (wood plank on chains) */}
//         <Animated.View style={[A(300,88,346,140),{transform:[{rotate:swayR}]}]}>
//           <View style={{position:'absolute',left:P(56),top:0}}><Chain h={P(56)}/></View>
//           <View style={{position:'absolute',right:P(56),top:0}}><Chain h={P(56)}/></View>
//           <View style={{position:'absolute',left:0,top:P(42),width:P(346),height:P(98),borderRadius:P(14),backgroundColor:'#b4651f',borderWidth:P(6),borderColor:'#8a4a1b',alignItems:'center',justifyContent:'center',elevation:6}}>
//             <View style={{position:'absolute',top:P(8),left:P(16),right:P(16),height:P(5),borderRadius:P(3),backgroundColor:'rgba(255,214,150,0.35)'}}/>
//             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10),flexWrap:'nowrap'}}>
//               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'<'}</Text>
//               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#fff',includeFontPadding:false,textShadowColor:'rgba(60,25,0,0.55)',textShadowOffset:{width:0,height:2},textShadowRadius:3}}>{'LEVEL '+n}</Text>
//               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'>'}</Text>
//             </View>
//           </View>
//         </Animated.View>

//         {/* bulbs counter */}
//         <View style={[A(728,126,142,72),{borderRadius:P(36),backgroundColor:'#fbf3e1',borderWidth:P(3),borderColor:'#d9c79e',borderStyle:'dashed',justifyContent:'center',paddingRight:P(30),alignItems:'center',elevation:4}]}>
//           <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(44),fontWeight:'900',color:INK,includeFontPadding:false}}>{hints}</Text></View>
//         <View style={A(846,100,70,70)}><Icon n="bulb" s={P(70)}/></View>

//         {/* question pill */}
//         <Animated.View style={[A(192,292,556,qLen>60?136:104),{borderRadius:P(qLen>60?44:52),backgroundColor:'#faf0da',borderWidth:P(4),borderColor:'#e9d4a6',alignItems:'center',justifyContent:'center',elevation:4,
//           opacity:qIn??1,transform:[{translateY:qIn?qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]}):0}]}]}>
//           <Text style={{position:'absolute',left:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'<'}</Text>
//           <Text style={{position:'absolute',right:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'>'}</Text>
//           <Text numberOfLines={3} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:qFont,color:'#17307a',maxWidth:P(430),textAlign:'center'}}>{lv?.question}</Text>
//         </Animated.View>

//         {/* options grid */}
//         <Animated.View pointerEvents="box-none" style={[StyleSheet.absoluteFill,{transform:[{translateX:shake??0}]}]}>
//           {cells.map((c:any,idx:number)=>{
//             if(!c)return null;
//             const {x,y}=slot(idx);
//             const pos=A(x-D/2,y-D/2,D,D);

//             /* eraser / pencil ring: tap ALWAYS shows the full wrong sign */
//             if(c.tool)return <View key={'t'+idx} style={[pos,{zIndex:flash===idx?35:20,elevation:flash===idx?35:0}]}>
//               <Bubble size={P(D)} delay={idx*350} state={flash===idx?'bad':undefined}>
//                 <DragView sound={c.tool} onTap={()=>flashBad(idx)}>{c.tool==='eraser'
//                   ?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
//                   :<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>}</DragView>
//               </Bubble>
//               {flash===idx&&<WrongMark size={P(D)}/>}
//             </View>;

//             const {it,i}=c,Art=art?.[it.k],hidden=hid.includes(i);
//             const state=markCell===idx?(mark.ok?'ok':'bad'):(flash===idx?'bad':undefined);
//             const drag=isCombine&&!!it.drag,gone=!!merged&&(merged.a===idx||merged.b===idx);
//             return <Animated.View key={'o'+idx} {...(drag?dPR[idx].panHandlers:{})}
//               style={[pos,{opacity:gone?0:hidden?0.2:1,zIndex:dragIdx===idx?30:state?25:1,elevation:dragIdx===idx?30:state?25:0},drag?{transform:dPan[idx].getTranslateTransform()}:null]}>
//               <Bubble size={P(D)} delay={idx*350} state={state} disabled={hidden} onPress={drag?undefined:()=>{isCombine?flashBad(idx):onPick(i)}}>
//                 {it.k==='eraser'?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
//                 :it.k==='pencil'?<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>
//                 :Art&&it.k!=='num'?<Art w={P(130)} t={it.t} grey={it.grey} i={i}/>
//                 :<Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(it.t??'').length>2?78:116),includeFontPadding:false}}>{String(it.t??'')}</Text>}
//               </Bubble>
//               {state==='bad'&&<WrongMark size={P(D)}/>}
//               {state==='ok'&&<CorrectMark size={P(D)}/>}
//             </Animated.View>})}
//           {merged&&<View pointerEvents="none" style={[A(merged.x-D/2,merged.y-D/2,D,D),{zIndex:25,elevation:25}]}>
//             <Bubble size={P(D)} delay={0} state="ok">
//               <Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(merged.t).length>2?78:116),includeFontPadding:false}}>{String(merged.t)}</Text>
//             </Bubble></View>}
//         </Animated.View>

//         {/* message line: between the grid and the bottom bar */}
//         {!!note&&<View pointerEvents="none" style={[A(60,1170,822,68),{zIndex:20,elevation:20,alignItems:'center',justifyContent:'center'}]}>
//           <View style={{backgroundColor:'rgba(255,255,255,0.92)',borderRadius:P(34),paddingHorizontal:P(34),paddingVertical:P(8)}}>
//             <Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:'#c0392b',textAlign:'center'}}>{note}</Text>
//           </View>
//         </View>}

//         {/* hint / video / skip  (clue has no cost pill now) */}
//         {circleBtn(226,'#a4d732','#f7f0d8',openClues,<Icon n="search" s={P(60)}/>)}
//         {circleBtn(471,'#f7ecd6','#f7f0d8',onVideo,<Icon n="film" s={P(70)}/>)}
//         {costPill(471,162,<Coin s={P(28)}/>,'+75')}
//         {circleBtn(716,'#ed434d','#f7f0d8',onSkip,<FFIcon s={P(70)}/>)}
//         {costPill(716,150,<Icon n="bulb" s={P(36)}/>,'50')}

//         {/* ---- clue popup (one clue, loaded from backend) ---- */}
//         {clueOpen&&<>
//           <Pressable onPress={()=>setClueOpen(false)} style={[A(0,0,DW,DH),{zIndex:40,elevation:40,backgroundColor:'rgba(10,25,60,0.5)'}]}/>
//           <View style={[A(70,560,802,470),{zIndex:41,elevation:41,borderRadius:P(56),backgroundColor:CREAM,borderWidth:P(14),borderColor:'#e0902f'}]}>
//             <Text style={{position:'absolute',left:0,right:0,top:P(34),textAlign:'center',fontFamily:F,fontSize:P(56),fontWeight:'900',color:NAVY,includeFontPadding:false}}>HINTS</Text>
//             <Squish style={A(640,22,78,78)} onPress={()=>setClueOpen(false)}>
//               <View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#fbde74',borderWidth:2,borderColor:'#2a2a2a',alignItems:'center',justifyContent:'center'}}><Icon n="cross" s={P(40)}/></View></Squish>
//             {[[1,130]].map(([k,y])=>{
//               const shown=seen>=k,avail=!shown&&seen===k-1;
//               return <Squish key={'clue'+k} disabled={!avail||busy} onPress={()=>reveal(k)} style={A(36,y,690,250)}>
//                 <View style={{width:P(690),height:P(250),borderRadius:P(40),backgroundColor:shown?'#ffffff':avail?'#f6e3b4':'#e4dccd',borderWidth:P(6),borderColor:shown?'#3ec75a':avail?'#ffb629':'#cfc3ae',flexDirection:'row',alignItems:'center',paddingHorizontal:P(28),gap:P(24)}}>
//                   <View style={{width:P(110),height:P(110),borderRadius:P(55),backgroundColor:shown||avail?'#bd6b29':'#b7a98f',alignItems:'center',justifyContent:'center'}}>
//                     {shown||avail
//                       ?<Text style={{fontFamily:F,fontSize:P(60),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{k}</Text>
//                       :<LockArt s={P(70)}/>}
//                   </View>
//                   <View style={{flex:1}}>
//                     <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(38),fontWeight:'900',color:shown||avail?'#bd6b29':'#8d7f68',includeFontPadding:false}}>{'Hint '+k}</Text>
//                     {shown
//                       ?<Text numberOfLines={4} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:P(36),color:'#17307a',marginTop:P(6)}}>{clueText}</Text>
//                       :avail
//                         ?<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:clueErr&&!busy?'#c0392b':'#6b4423',marginTop:P(8),includeFontPadding:false}}>{busy?'Loading hint...':clueErr?FALLBACK_CLUE:'Tap to reveal'}</Text>
//                         :<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(32),fontWeight:'bold',color:'#8d7f68',marginTop:P(8)}}>{'View Hint '+(k-1)+' first to unlock'}</Text>}
//                   </View>
//                 </View></Squish>})}
//           </View>
//         </>}
//       </View>
//     </>}
//   </View>}
import React,{useEffect,useRef,useState} from 'react';
import {View,Text,Animated,Pressable,PanResponder,Platform,Easing,StyleSheet} from 'react-native';
import Svg,{Rect,Path,Circle,Ellipse,G,Polygon,Line,Polyline,Defs,LinearGradient,Stop} from 'react-native-svg';
import {F,INK,Coin} from './BTShared';
import {Icon} from './Art';
import {play,stop} from './BTSound';
import {fetchClue} from './Btclueapi';



const NAVY='#132f70',CREAM='#faf0e2',K='#1d1d1d';
const SERIF:any=Platform.select({web:'"Playfair Display",Georgia,"Times New Roman",serif',ios:'Georgia-Italic',default:'serif'});
const DW=942,DH=1669;
const WALL='#8fd3f4';

const FALLBACK_CLUE='Could not load the hint. Tap to try again.';
const LockArt=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Path d="M30 46 V34 a20 20 0 0 1 40 0 V46" fill="none" stroke="#7a6a55" strokeWidth="9" strokeLinecap="round"/><Rect x="20" y="44" width="60" height="44" rx="10" fill="#9b8a72"/><Circle cx="50" cy="63" r="6" fill="#f4e8d2"/><Rect x="47" y="63" width="6" height="15" rx="3" fill="#f4e8d2"/></Svg>;

/* ---------- eraser / pencil arts ---------- */
const EraserArt=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#2ea3e6" stroke={K} strokeWidth="2.5"/><Path d="M4 20 Q4 8 16 8 H46 V54 H16 Q4 54 4 42 Z" fill="#fff" stroke={K} strokeWidth="2.5"/></Svg>;
const PencilArt=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke={K} strokeWidth="1.5"/><Polygon points="2,15 10,11.5 10,18.5" fill={K}/><Rect x="26" y="4" width="84" height="22" fill="#1f9a4a" stroke={K} strokeWidth="1.5"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#b8b8b8" stroke={K} strokeWidth="1.5"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#8a8a8a" stroke={K} strokeWidth="1.5"/></Svg>;

/* ---------- garden scene (drawn in design coordinates) ---------- */
const Cloud=({x,y,s}:any)=><G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.96"><Ellipse cx="0" cy="0" rx="70" ry="34"/><Ellipse cx="-52" cy="12" rx="48" ry="26"/><Ellipse cx="56" cy="14" rx="52" ry="26"/><Ellipse cx="8" cy="-26" rx="44" ry="30"/></G>;
const Flower=({x,y,s=1}:any)=><G transform={`translate(${x} ${y}) scale(${s})`}>
  <Path d="M-26 28 Q-8 -4 0 10 Q10 -6 30 26 Q10 20 0 30 Q-12 20 -26 28Z" fill="#4faa2e"/>
  {[0,72,144,216,288].map(a=><Ellipse key={a} cx="0" cy="-17" rx="11" ry="17" fill="#fff" stroke="#e8e0d0" strokeWidth="1.5" transform={`rotate(${a})`}/>)}
  <Circle cx="0" cy="0" r="9" fill="#f9c933"/></G>;
const Tuft=({x,y,s=1}:any)=><Path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0 Q-8 -34 -18 -50 Q-2 -30 3 -46 Q10 -24 26 -40 Q12 -14 16 0Z" fill="#58b82f"/>;
const Rock=({x,y,w,h}:any)=><G><Ellipse cx={x} cy={y} rx={w} ry={h} fill="#8f969e"/><Ellipse cx={x-w*0.2} cy={y-h*0.3} rx={w*0.55} ry={h*0.4} fill="#aeb4bb"/></G>;
const Chain=({h}:any)=><Svg width={h*0.34} height={h} viewBox="0 0 20 60"><Ellipse cx="10" cy="9" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/><Ellipse cx="10" cy="27" rx="6" ry="9" fill="none" stroke="#6a5540" strokeWidth="3.2"/><Ellipse cx="10" cy="45" rx="6" ry="9" fill="none" stroke="#4a3a2a" strokeWidth="3.2"/></Svg>;
const FFIcon=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Polygon points="14,22 50,50 14,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/><Polygon points="52,22 88,50 52,78" fill="#3a0a10" stroke="#3a0a10" strokeWidth="6" strokeLinejoin="round"/></Svg>;

/* ---- Level 3 style room: sky, clouds, hill, fence, face-plant (left), bookshelf (right) ---- */
function Room({w,h}:any){
  const books1:any[]=[[822,36,112,'#2fa6a0'],[860,34,122,'#f27ab0'],[896,40,106,'#8a63da']];
  const books2:any[]=[[822,32,102,'#e5483f'],[856,26,92,'#2f8fd8'],[884,44,118,'#3eae52']];
  const books3:any[]=[[822,34,96,'#f4c431'],[858,38,124,'#2f6fd0'],[898,34,104,'#e8913a']];
  const shelf=(arr:any[],bottom:number)=>arr.map((b,i)=><Rect key={bottom+'-'+i} x={b[0]} y={bottom-b[2]} width={b[1]} height={b[2]} rx="4" fill={b[3]} stroke="rgba(0,0,0,0.18)" strokeWidth="2"/>);
  return <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{position:'absolute',left:0,top:0}}>
    <Defs>
      <LinearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#58b9f1"/><Stop offset="0.6" stopColor="#6cc3f4"/><Stop offset="1" stopColor="#9bdcf8"/></LinearGradient>
      <LinearGradient id="gGrass" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#8fdc4f"/><Stop offset="1" stopColor="#4ba72d"/></LinearGradient>
      <LinearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#f0a94f"/><Stop offset="1" stopColor="#d98a3a"/></LinearGradient>
    </Defs>

    {/* sky + clouds */}
    <Rect width={DW} height={DH} fill="url(#gSky)"/>
    <Cloud x={850} y={235} s={0.62}/><Cloud x={95} y={985} s={0.55}/><Cloud x={760} y={900} s={0.5}/>

    {/* rolling hills behind the fence */}
    <Ellipse cx="170" cy="1215" rx="330" ry="150" fill="#9be05a"/>
    <Ellipse cx="640" cy="1250" rx="420" ry="140" fill="#86d14a"/>
    <Ellipse cx="930" cy="1190" rx="200" ry="120" fill="#a4e464"/>

    {/* meadow */}
    <Path d="M0 1215 Q471 1180 942 1215 V1669 H0Z" fill="url(#gGrass)"/>

    {/* wooden fence */}
    <G transform="translate(0 150)">
      <Rect x="0" y="1018" width={DW} height="18" fill="#e49c46"/>
      <Rect x="0" y="1070" width={DW} height="18" fill="#e49c46"/>
      {[0,1,2,3,4,5,6,7,8,9,10].map(i=>{const x=i*92-4;return <G key={'p'+i}>
        <Path d={`M${x} 1105 V985 L${x+27} 952 L${x+54} 985 V1105Z`} fill="#f0b45a" stroke="#c27a2a" strokeWidth="3"/>
        <Circle cx={x+27} cy="1000" r="4.5" fill="#8a5a2a"/><Circle cx={x+27} cy="1090" r="4.5" fill="#8a5a2a"/></G>})}
    </G>

    {/* grass details */}
    <Tuft x={250} y={1300} s={0.9}/><Tuft x={470} y={1285} s={0.8}/><Tuft x={700} y={1310} s={1}/>
    <Tuft x={150} y={1620} s={1.2}/><Tuft x={560} y={1650} s={1}/><Tuft x={780} y={1560} s={1}/>
    <Flower x={885} y={1235} s={0.9}/><Flower x={185} y={1610} s={1.1}/><Flower x={730} y={1630} s={1}/>
    <Rock x={60} y={1560} w={95} h={58}/><Rock x={875} y={1618} w={105} h={62}/>

    {/* cute plant in front of the fence (bottom-left) */}
    <G transform="translate(-27 629)">
      <Ellipse cx="95" cy="520" rx="44" ry="92" fill="#58b132"/>
      <Ellipse cx="152" cy="505" rx="34" ry="80" fill="#6fc842" transform="rotate(16 152 505)"/>
      <Ellipse cx="42" cy="535" rx="32" ry="64" fill="#4ea12b" transform="rotate(-16 42 535)"/>
      <Rect x="34" y="566" width="126" height="82" rx="28" fill="#f7ede0"/>
      <Circle cx="76" cy="604" r="6" fill="#5b3a29"/><Circle cx="118" cy="604" r="6" fill="#5b3a29"/>
      <Ellipse cx="56" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/><Ellipse cx="138" cy="620" rx="11" ry="7" fill="#f4a3a3" opacity="0.8"/>
      <Path d="M88 618 Q97 628 106 618" stroke="#5b3a29" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </G>

    {/* bookshelf (right) */}
    <Rect x="785" y="645" width="157" height="580" fill="#e8a24a"/>
    <Rect x="802" y="662" width="140" height="548" fill="#d58a33"/>
    {shelf(books1,826)}{shelf(books2,1006)}{shelf(books3,1190)}
    <Rect x="785" y="826" width="157" height="18" fill="#f2b862"/>
    <Rect x="785" y="1006" width="157" height="18" fill="#f2b862"/>
    <Rect x="785" y="1190" width="157" height="20" fill="#f2b862"/>
    <Rect x="785" y="645" width="157" height="20" fill="#f2b862"/>
    {/* plant on top of the shelf */}
    <Ellipse cx="850" cy="560" rx="26" ry="62" fill="#58b132" transform="rotate(-20 850 560)"/>
    <Ellipse cx="880" cy="545" rx="28" ry="72" fill="#6fc842"/>
    <Ellipse cx="912" cy="565" rx="24" ry="58" fill="#4ea12b" transform="rotate(22 912 565)"/>
    <Path d="M828 600 H934 L922 648 H840Z" fill="#e58a3e"/><Rect x="822" y="590" width="118" height="16" rx="6" fill="#f09a4a"/>

    {/* leaves in the top corners */}
    <Ellipse cx="30" cy="10" rx="170" ry="78" fill="#3f9f35"/><Ellipse cx="200" cy="0" rx="120" ry="52" fill="#58b940"/><Ellipse cx="90" cy="70" rx="80" ry="34" fill="#6fcb4c"/>
    <Ellipse cx="900" cy="8" rx="190" ry="84" fill="#3a9a32"/><Ellipse cx="730" cy="0" rx="115" ry="48" fill="#58b940"/><Ellipse cx="860" cy="78" rx="85" ry="34" fill="#6fcb4c"/>

    {/* wooden board behind the bottom buttons */}
    <Rect x="30" y="1292" width="882" height="304" rx="70" fill="url(#gWood)" stroke="#a65d1d" strokeWidth="10"/>
    <Path d="M70 1385 H872 M56 1490 H886" stroke="#b9722a" strokeWidth="5" opacity="0.7"/>
    <Path d="M120 1330 H260 M520 1345 H760 M90 1430 H300 M600 1440 H840 M180 1540 H420 M560 1550 H800" stroke="#c98235" strokeWidth="3" opacity="0.55" strokeLinecap="round"/>
    <Circle cx="82" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1338" r="9" fill="#8a5a2a"/><Circle cx="82" cy="1548" r="9" fill="#8a5a2a"/><Circle cx="860" cy="1548" r="9" fill="#8a5a2a"/>
  </Svg>}

/* ---------- drag any child freely (onTap fires when released with almost no movement) ---------- */
function DragView({children,sound,onTap}:any){
  const pan=useRef(new Animated.ValueXY()).current;
  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>true,
    onPanResponderGrant:()=>{pan.extractOffset();if(sound)play(sound,{loop:true})},   // eraser = rubbing, pencil = scratching while dragging
    onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
    onPanResponderRelease:(_e,g)=>{pan.flattenOffset();if(sound)stop(sound);
      if(onTap&&Math.hypot(g.dx,g.dy)<8)onTap()},
    onPanResponderTerminate:()=>{if(sound)stop(sound)}})).current;
  return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

/* ---------- squish on press ---------- */
function Squish({style,onPress,disabled,children}:any){
  const s=useRef(new Animated.Value(1)).current;
  const to=(v:number)=>Animated.spring(s,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
  return <Pressable disabled={disabled} onPress={onPress} onPressIn={()=>to(0.92)} onPressOut={()=>to(1)} style={style}>
    <Animated.View style={{transform:[{scale:s}]}}>{children}</Animated.View></Pressable>}

/* ---------- one option circle ---------- */
function Bubble({size,delay,state,onPress,disabled,children}:any){
  const f=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    const a=Animated.loop(Animated.sequence([
      Animated.timing(f,{toValue:1,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
      Animated.timing(f,{toValue:0,duration:1700,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
    const t=setTimeout(()=>a.start(),delay);
    return()=>{clearTimeout(t);a.stop()}},[]);
  const wood=state==='ok'?'#46c25f':state==='bad'?'#ee4650':'#d98a3d';
  const woodEdge=state==='ok'?'#2a9a43':state==='bad'?'#b81f29':'#8f4f1c';
  const fill=state==='ok'?'#e3f9e6':state==='bad'?'#ffe3e3':'#fcf3e2';
  return <Animated.View style={{width:size,height:size,alignItems:'center',justifyContent:'center',
    transform:[{translateY:f.interpolate({inputRange:[0,1],outputRange:[0,-size*0.03]})}]}}>
    <Svg width={size} height={size} viewBox="0 0 200 200" style={{position:'absolute'}}>
      <Circle cx="100" cy="108" r="97" fill="rgba(60,30,5,0.28)"/>
      <Circle cx="100" cy="100" r="97" fill={wood}/>
      <Circle cx="100" cy="100" r="97" fill="none" stroke={woodEdge} strokeWidth="5"/>
      <Circle cx="100" cy="100" r="87" fill="none" stroke="rgba(255,225,170,0.55)" strokeWidth="3"/>
      <Circle cx="100" cy="100" r="78" fill={fill} stroke="rgba(120,70,20,0.35)" strokeWidth="3"/>
    </Svg>
    <Pressable disabled={disabled||!onPress} onPress={onPress} style={{width:size*0.8,height:size*0.8,borderRadius:size*0.4,alignItems:'center',justifyContent:'center'}}>
      {children}</Pressable>
  </Animated.View>}

/* ---------- FULL wrong sign: covers the whole ring (red tint + big X), pops in ---------- */
function WrongMark({size}:any){
  const s=useRef(new Animated.Value(0)).current;
  useEffect(()=>{Animated.spring(s,{toValue:1,friction:5,tension:150,useNativeDriver:true}).start()},[]);
  return <Animated.View pointerEvents="none" style={{position:'absolute',left:0,top:0,width:size,height:size,alignItems:'center',justifyContent:'center',
    opacity:s.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}),
    transform:[{scale:s.interpolate({inputRange:[0,1],outputRange:[0.4,1]})}]}}>
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="97" fill="rgba(238,70,80,0.38)"/>
      <Circle cx="100" cy="100" r="97" fill="none" stroke="#b81f29" strokeWidth="6"/>
      {/* white outline */}
      <Line x1="52" y1="52" x2="148" y2="148" stroke="#fff" strokeWidth="38" strokeLinecap="round"/>
      <Line x1="148" y1="52" x2="52" y2="148" stroke="#fff" strokeWidth="38" strokeLinecap="round"/>
      {/* red X */}
      <Line x1="52" y1="52" x2="148" y2="148" stroke="#e2182f" strokeWidth="26" strokeLinecap="round"/>
      <Line x1="148" y1="52" x2="52" y2="148" stroke="#e2182f" strokeWidth="26" strokeLinecap="round"/>
    </Svg>
  </Animated.View>}

/* ---------- FULL correct sign: covers the whole ring (green tint + big tick), pops in ---------- */
function CorrectMark({size}:any){
  const s=useRef(new Animated.Value(0)).current;
  useEffect(()=>{Animated.spring(s,{toValue:1,friction:5,tension:150,useNativeDriver:true}).start()},[]);
  return <Animated.View pointerEvents="none" style={{position:'absolute',left:0,top:0,width:size,height:size,alignItems:'center',justifyContent:'center',
    opacity:s.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}),
    transform:[{scale:s.interpolate({inputRange:[0,1],outputRange:[0.4,1]})}]}}>
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="97" fill="rgba(70,194,95,0.42)"/>
      <Circle cx="100" cy="100" r="97" fill="none" stroke="#2a9a43" strokeWidth="6"/>
      {/* white outline */}
      <Polyline points="52,104 88,140 150,62" fill="none" stroke="#fff" strokeWidth="38" strokeLinecap="round" strokeLinejoin="round"/>
      {/* green tick */}
      <Polyline points="52,104 88,140 150,62" fill="none" stroke="#1fae3e" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  </Animated.View>}

/* =====================  MAIN  ===================== */
export default function BTLevel1Board({n,lv,hints,hid=[],mark,note,shake,qIn,bg,useRoomBg=false,art,showTools=true,playerId,onHome,onSettings,onPick,onClue,onCombine,onVideo,onSkip}:any){
  const [box,setBox]=useState({w:0,h:0});
  const sway=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    const a=Animated.loop(Animated.sequence([
      Animated.timing(sway,{toValue:1,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
      Animated.timing(sway,{toValue:0,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
    a.start();return()=>a.stop()},[]);

  // ---- clue popup state: seen = how many clues are revealed (0 or 1) ----
  const [clueOpen,setClueOpen]=useState(false);
  const [seen,setSeen]=useState(0);
  const [busy,setBusy]=useState(false);
  const [clueText,setClueText]=useState('');
  const [clueErr,setClueErr]=useState(false);
  const busyRef=useRef(false);

  // Clue flow: frontend -> POST /api/braintwist/clue -> backend reads the clue + saves the view in MySQL -> JSON back -> shown here.
  const reveal=async(k:number)=>{
    if(busyRef.current||seen!==k-1)return;
    busyRef.current=true;setBusy(true);setClueErr(false);
    const r=await fetchClue(playerId,Number(n));
    if(r.success&&r.clue){
      setClueText(r.clue);setSeen(k);
      try{if(onClue)onClue(r)}catch(e){}
    }else{
      setClueErr(true);
    }
    busyRef.current=false;setBusy(false)};
  const openClues=()=>{play('clue');setClueOpen(true);if(seen===0)reveal(1)};

  // ---- correct / wrong answer sound (parent sets `mark` when an option is picked) ----
  useEffect(()=>{if(mark)play(mark.ok?'correct':'wrong')},[mark]);

  // ---- wrong sign: flashes FULLY on a ring (number / eraser / pencil) for a moment ----
  const [flash,setFlash]=useState(-1);
  const flashT=useRef<any>(null);
  const flashBad=(idx:number)=>{
    play('wrong');setFlash(-1);                       // reset so the pop animation replays on repeated taps
    clearTimeout(flashT.current);
    setTimeout(()=>setFlash(idx),0);
    flashT.current=setTimeout(()=>setFlash(-1),900)};
  useEffect(()=>()=>clearTimeout(flashT.current),[]);

  // ---- drag-to-combine ----
  const [merged,setMerged]=useState<any>(null);
  const [dragIdx,setDragIdx]=useState(-1);
  const dPan=useRef(Array.from({length:6},()=>new Animated.ValueXY())).current;
  const live=useRef<any>({}).current;
  const back=(i:number)=>Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();
  const dPR=useRef(Array.from({length:6},(_,idx)=>PanResponder.create({
    onStartShouldSetPanResponder:()=>!!live.canDrag?.(idx),
    onPanResponderGrant:()=>{setDragIdx(idx);play('drag')},
    onPanResponderMove:Animated.event([null,{dx:dPan[idx].x,dy:dPan[idx].y}],{useNativeDriver:false}),
    onPanResponderRelease:(_e,g)=>{setDragIdx(-1);live.drop?.(idx,g.dx,g.dy)},
    onPanResponderTerminate:()=>{setDragIdx(-1);back(idx)}}))).current;

  // scale the 942x1669 design to the space we actually got
  const bw=Math.min(box.w,box.h*DW/DH),k=bw/DW,bh=bw*DH/DW;
  const top0=(box.h-bh)/2;
  const P=(v:number)=>v*k;
  const A=(x:number,y:number,w:number,h:number):any=>({position:'absolute',left:P(x),top:P(y),width:P(w),height:P(h)});

  // ---- build the 6 grid cells ----
  const opts:any[]=(lv?.items||[]).map((it:any,i:number)=>({it,i})).filter((o:any)=>o.it.k!=='duster'&&o.it.k!=='chalk').slice(0,6);
  const tools:any[]=showTools?[{tool:'eraser'},{tool:'pencil'}]:[];
  const total=opts.length+tools.length;
  const cells:any[]=new Array(total).fill(null);
  if(tools.length===2&&total===6){
    cells[1]=tools[0];cells[2]=tools[1];
    let q=0;for(let s=0;s<total;s++)if(!cells[s])cells[s]=opts[q++];
  }else{[...opts,...tools].forEach((c,s)=>{cells[s]=c})}
  const rows=Math.max(1,Math.ceil(total/2));
  const rowY=rows>=3?[546,791,1045]:rows===2?[650,945]:[795];
  const slot=(idx:number)=>{const r=Math.floor(idx/2),c=idx%2,alone=total%2===1&&idx===total-1;
    return {x:alone?480:[324,637][c],y:rowY[Math.min(r,rowY.length-1)]}};
  const markCell=mark?cells.findIndex((c:any)=>c&&c.it&&Math.abs(c.it.x+c.it.w/2-mark.x)<0.6):-1;
  const D=204;

  const isCombine=lv?.mode==='combine';
  live.canDrag=(idx:number)=>isCombine&&!merged&&!!cells[idx]?.it?.drag;
  live.drop=async(idx:number,dx:number,dy:number)=>{
    // plain tap on a draggable number (no real movement) -> wrong sign
    if(Math.hypot(dx,dy)<8){back(idx);flashBad(idx);return}
    const me=slot(idx),cx=me.x+dx/k,cy=me.y+dy/k;
    let j=-1,best=1e9;
    cells.forEach((o:any,s:number)=>{
      if(s===idx||!o?.it?.drag)return;
      const p=slot(s),d=Math.hypot(cx-p.x,cy-p.y);
      if(d<D*0.85&&d<best){best=d;j=s}});
    if(j<0){back(idx);flashBad(idx);return}
    const a=cells[idx].i,b=cells[j].i;
    const r=onCombine?await onCombine(Math.min(a,b),Math.max(a,b)):null;
    if(r&&r.correct){play('merge');const pj=slot(j);setMerged({x:(me.x+pj.x)/2,y:(me.y+pj.y)/2,t:r.result??'',a:idx,b:j})}
    else{back(idx);flashBad(idx)}};

  const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
  const qLen=(lv?.question||'').length;
  const qFont=P(qLen>60?27:qLen>22?34:42);

  // ---- bottom bar: 3 smaller, evenly spaced buttons (centres 226 / 471 / 716) ----
  const BTN=128,BTN_TOP=1342,PILL_Y=1484;
  const costPill=(cx:number,w:number,icon:any,text:string)=>
    <View style={[A(cx-w/2,PILL_Y,w,62),{borderRadius:P(31),backgroundColor:'#7a4520',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10)}]}>
      {icon}<Text numberOfLines={1} style={{fontFamily:F,fontSize:P(34),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{text}</Text></View>;
  const circleBtn=(cx:number,bgc:string,bc:string,onPress:any,icon:any)=>
    <Squish style={A(cx-BTN/2,BTN_TOP,BTN,BTN)} onPress={onPress}><View style={{width:P(BTN),height:P(BTN),borderRadius:P(BTN/2),backgroundColor:bgc,borderWidth:P(12),borderColor:bc,alignItems:'center',justifyContent:'center',elevation:6}}>{icon}</View></Squish>;

  return <View style={{flex:1,backgroundColor:WALL}} onLayout={e=>setBox({w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height})}>
    {useRoomBg&&bg}
    {box.w>0&&<>

      <View style={{position:'absolute',left:(box.w-bw)/2,top:top0,width:bw,height:bh}}>
        {!useRoomBg&&<Room w={bw} h={bh}/>}

        {/* top: home, settings */}
        <Squish style={A(27,111,78,78)} onPress={onHome}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="home" s={P(40)}/></View></Squish>
        <Squish style={A(119,111,78,78)} onPress={onSettings}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#f9c93d',borderWidth:P(6),borderColor:'#d98a1c',alignItems:'center',justifyContent:'center',elevation:4}}><Icon n="gear" s={P(42)}/></View></Squish>

        {/* level sign (wood plank on chains) */}
        <Animated.View style={[A(300,88,346,140),{transform:[{rotate:swayR}]}]}>
          <View style={{position:'absolute',left:P(56),top:0}}><Chain h={P(56)}/></View>
          <View style={{position:'absolute',right:P(56),top:0}}><Chain h={P(56)}/></View>
          <View style={{position:'absolute',left:0,top:P(42),width:P(346),height:P(98),borderRadius:P(14),backgroundColor:'#b4651f',borderWidth:P(6),borderColor:'#8a4a1b',alignItems:'center',justifyContent:'center',elevation:6}}>
            <View style={{position:'absolute',top:P(8),left:P(16),right:P(16),height:P(5),borderRadius:P(3),backgroundColor:'rgba(255,214,150,0.35)'}}/>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10),flexWrap:'nowrap'}}>
              <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'<'}</Text>
              <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#fff',includeFontPadding:false,textShadowColor:'rgba(60,25,0,0.55)',textShadowOffset:{width:0,height:2},textShadowRadius:3}}>{'LEVEL '+n}</Text>
              <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'>'}</Text>
            </View>
          </View>
        </Animated.View>

        {/* bulbs counter */}
        <View style={[A(728,126,142,72),{borderRadius:P(36),backgroundColor:'#fbf3e1',borderWidth:P(3),borderColor:'#d9c79e',borderStyle:'dashed',justifyContent:'center',paddingRight:P(30),alignItems:'center',elevation:4}]}>
          <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(44),fontWeight:'900',color:INK,includeFontPadding:false}}>{hints}</Text></View>
        <View style={A(846,100,70,70)}><Icon n="bulb" s={P(70)}/></View>

        {/* question pill */}
        <Animated.View style={[A(192,292,556,qLen>60?136:104),{borderRadius:P(qLen>60?44:52),backgroundColor:'#faf0da',borderWidth:P(4),borderColor:'#e9d4a6',alignItems:'center',justifyContent:'center',elevation:4,
          opacity:qIn??1,transform:[{translateY:qIn?qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]}):0}]}]}>
          <Text style={{position:'absolute',left:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'<'}</Text>
          <Text style={{position:'absolute',right:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'>'}</Text>
          <Text numberOfLines={3} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:qFont,color:'#17307a',maxWidth:P(430),textAlign:'center'}}>{lv?.question}</Text>
        </Animated.View>

        {/* options grid */}
        <Animated.View pointerEvents="box-none" style={[StyleSheet.absoluteFill,{transform:[{translateX:shake??0}]}]}>
          {cells.map((c:any,idx:number)=>{
            if(!c)return null;
            const {x,y}=slot(idx);
            const pos=A(x-D/2,y-D/2,D,D);

            /* eraser / pencil ring: tap ALWAYS shows the full wrong sign */
            if(c.tool)return <View key={'t'+idx} style={[pos,{zIndex:flash===idx?35:20,elevation:flash===idx?35:0}]}>
              <Bubble size={P(D)} delay={idx*350} state={flash===idx?'bad':undefined}>
                <DragView sound={c.tool} onTap={()=>flashBad(idx)}>{c.tool==='eraser'
                  ?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
                  :<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>}</DragView>
              </Bubble>
              {flash===idx&&<WrongMark size={P(D)}/>}
            </View>;

            const {it,i}=c,Art=art?.[it.k],hidden=hid.includes(i);
            const state=markCell===idx?(mark.ok?'ok':'bad'):(flash===idx?'bad':undefined);
            const drag=isCombine&&!!it.drag,gone=!!merged&&(merged.a===idx||merged.b===idx);
            return <Animated.View key={'o'+idx} {...(drag?dPR[idx].panHandlers:{})}
              style={[pos,{opacity:gone?0:hidden?0.2:1,zIndex:dragIdx===idx?30:state?25:1,elevation:dragIdx===idx?30:state?25:0},drag?{transform:dPan[idx].getTranslateTransform()}:null]}>
              <Bubble size={P(D)} delay={idx*350} state={state} disabled={hidden} onPress={drag?undefined:()=>{isCombine?flashBad(idx):onPick(i)}}>
                {it.k==='eraser'?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
                :it.k==='pencil'?<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>
                :Art&&it.k!=='num'?<Art w={P(130)} t={it.t} grey={it.grey} i={i}/>
                :<Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(it.t??'').length>2?78:116),includeFontPadding:false}}>{String(it.t??'')}</Text>}
              </Bubble>
              {state==='bad'&&<WrongMark size={P(D)}/>}
              {state==='ok'&&<CorrectMark size={P(D)}/>}
            </Animated.View>})}

          {/* merged result ring (5 + 4 = 9): FULL green tick, same style as the wrong X */}
          {merged&&<View pointerEvents="none" style={[A(merged.x-D/2,merged.y-D/2,D,D),{zIndex:25,elevation:25}]}>
            <Bubble size={P(D)} delay={0} state="ok">
              <Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(merged.t).length>2?78:116),includeFontPadding:false}}>{String(merged.t)}</Text>
            </Bubble>
            <CorrectMark size={P(D)}/>
          </View>}
        </Animated.View>

        {/* message line: between the grid and the bottom bar */}
        {!!note&&<View pointerEvents="none" style={[A(60,1170,822,68),{zIndex:20,elevation:20,alignItems:'center',justifyContent:'center'}]}>
          <View style={{backgroundColor:'rgba(255,255,255,0.92)',borderRadius:P(34),paddingHorizontal:P(34),paddingVertical:P(8)}}>
            <Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:'#c0392b',textAlign:'center'}}>{note}</Text>
          </View>
        </View>}

        {/* hint / video / skip  (clue has no cost pill now) */}
        {circleBtn(226,'#a4d732','#f7f0d8',openClues,<Icon n="search" s={P(60)}/>)}
        {circleBtn(471,'#f7ecd6','#f7f0d8',onVideo,<Icon n="film" s={P(70)}/>)}
        {costPill(471,162,<Coin s={P(28)}/>,'+75')}
        {circleBtn(716,'#ed434d','#f7f0d8',onSkip,<FFIcon s={P(70)}/>)}
        {costPill(716,150,<Icon n="bulb" s={P(36)}/>,'50')}

        {/* ---- clue popup (one clue, loaded from backend) ---- */}
        {clueOpen&&<>
          <Pressable onPress={()=>setClueOpen(false)} style={[A(0,0,DW,DH),{zIndex:40,elevation:40,backgroundColor:'rgba(10,25,60,0.5)'}]}/>
          <View style={[A(70,560,802,470),{zIndex:41,elevation:41,borderRadius:P(56),backgroundColor:CREAM,borderWidth:P(14),borderColor:'#e0902f'}]}>
            <Text style={{position:'absolute',left:0,right:0,top:P(34),textAlign:'center',fontFamily:F,fontSize:P(56),fontWeight:'900',color:NAVY,includeFontPadding:false}}>HINTS</Text>
            <Squish style={A(640,22,78,78)} onPress={()=>setClueOpen(false)}>
              <View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#fbde74',borderWidth:2,borderColor:'#2a2a2a',alignItems:'center',justifyContent:'center'}}><Icon n="cross" s={P(40)}/></View></Squish>
            {[[1,130]].map(([k,y])=>{
              const shown=seen>=k,avail=!shown&&seen===k-1;
              return <Squish key={'clue'+k} disabled={!avail||busy} onPress={()=>reveal(k)} style={A(36,y,690,250)}>
                <View style={{width:P(690),height:P(250),borderRadius:P(40),backgroundColor:shown?'#ffffff':avail?'#f6e3b4':'#e4dccd',borderWidth:P(6),borderColor:shown?'#3ec75a':avail?'#ffb629':'#cfc3ae',flexDirection:'row',alignItems:'center',paddingHorizontal:P(28),gap:P(24)}}>
                  <View style={{width:P(110),height:P(110),borderRadius:P(55),backgroundColor:shown||avail?'#bd6b29':'#b7a98f',alignItems:'center',justifyContent:'center'}}>
                    {shown||avail
                      ?<Text style={{fontFamily:F,fontSize:P(60),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{k}</Text>
                      :<LockArt s={P(70)}/>}
                  </View>
                  <View style={{flex:1}}>
                    <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(38),fontWeight:'900',color:shown||avail?'#bd6b29':'#8d7f68',includeFontPadding:false}}>{'Hint '+k}</Text>
                    {shown
                      ?<Text numberOfLines={4} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:P(36),color:'#17307a',marginTop:P(6)}}>{clueText}</Text>
                      :avail
                        ?<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:clueErr&&!busy?'#c0392b':'#6b4423',marginTop:P(8),includeFontPadding:false}}>{busy?'Loading hint...':clueErr?FALLBACK_CLUE:'Tap to reveal'}</Text>
                        :<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(32),fontWeight:'bold',color:'#8d7f68',marginTop:P(8)}}>{'View Hint '+(k-1)+' first to unlock'}</Text>}
                  </View>
                </View></Squish>})}
          </View>
        </>}
      </View>
    </>}
  </View>}