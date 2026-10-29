
// import React,{useEffect,useRef,useState} from 'react';
// import {View,Text,Animated,Pressable,PanResponder,Platform,Easing,StyleSheet} from 'react-native';
// import Svg,{Rect,Path,Circle,Ellipse,G,Polygon,Line,Defs,LinearGradient,Stop} from 'react-native-svg';
// import {F,INK,Coin} from './BTShared';
// import {Icon} from './Art';



// const NAVY='#132f70',CREAM='#faf0e2',K='#1d1d1d';
// const SERIF:any=Platform.select({web:'"Playfair Display",Georgia,"Times New Roman",serif',ios:'Georgia-Italic',default:'serif'});
// const DW=942,DH=1669;
// const WALL='#abd1f1',FLOOR='#f0bb75',BASE='#f1bebf';

// /* ---------- Level 1 clues (search button) ---------- */
// const CLUES=[
//   'Think carefully and use your maths skills to find the answer!',
//   'Combine the two correct numbers to reveal the final answer!',
// ];
// const CLUE_COST=25; // only shown on the pill
// const LockArt=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Path d="M30 46 V34 a20 20 0 0 1 40 0 V46" fill="none" stroke="#7a6a55" strokeWidth="9" strokeLinecap="round"/><Rect x="20" y="44" width="60" height="44" rx="10" fill="#9b8a72"/><Circle cx="50" cy="63" r="6" fill="#f4e8d2"/><Rect x="47" y="63" width="6" height="15" rx="3" fill="#f4e8d2"/></Svg>;

// /* ---------- eraser / pencil arts ---------- */
// const EraserArt=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#2ea3e6" stroke={K} strokeWidth="2.5"/><Path d="M4 20 Q4 8 16 8 H46 V54 H16 Q4 54 4 42 Z" fill="#fff" stroke={K} strokeWidth="2.5"/></Svg>;
// const PencilArt=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke={K} strokeWidth="1.5"/><Polygon points="2,15 10,11.5 10,18.5" fill={K}/><Rect x="26" y="4" width="84" height="22" fill="#1f9a4a" stroke={K} strokeWidth="1.5"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#b8b8b8" stroke={K} strokeWidth="1.5"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#8a8a8a" stroke={K} strokeWidth="1.5"/></Svg>;

// /* ---------- the room (static scene drawn in design coordinates) ---------- */
// function Room({w,h}:any){
//   return <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{position:'absolute',left:0,top:0}}>
//     <Defs><LinearGradient id="l1wall" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#abd1f1"/><Stop offset="1" stopColor="#b1d3ef"/></LinearGradient></Defs>
//     <Rect width={DW} height={DH} fill="url(#l1wall)"/>
//     <Polygon points="250,0 430,0 150,1170 0,1170" fill="#fff" opacity="0.10"/>
//     <Polygon points="520,0 640,0 420,1170 330,1170" fill="#fff" opacity="0.07"/>
//     <Rect x="0" y="1165" width={DW} height="34" fill={BASE}/>
//     <Rect x="0" y="1199" width={DW} height={DH-1199} fill={FLOOR}/>
//     {[0,1,2,3,4,5].map(i=><Rect key={i} x={i*170-20} y="1199" width="3" height={DH-1199} fill="#e6a85f" opacity="0.5"/>)}

//     <Rect x="0" y="128" width="205" height="512" fill="#e8a55a"/>
//     <Rect x="0" y="140" width="190" height="488" fill="#97d9f9"/>
//     <Rect x="0" y="372" width="205" height="14" fill="#e8a55a"/>
//     <G fill="#fff"><Ellipse cx="165" cy="215" rx="28" ry="20"/><Ellipse cx="140" cy="230" rx="26" ry="16"/><Ellipse cx="10" cy="345" rx="22" ry="16"/></G>
//     <Rect x="0" y="610" width="245" height="38" fill="#f0be76"/>
//     <Rect x="0" y="640" width="245" height="8" fill="#d99a4e" opacity="0.5"/>
//     <Ellipse cx="85" cy="520" rx="46" ry="92" fill="#6cbf3d"/>
//     <Ellipse cx="150" cy="500" rx="38" ry="84" fill="#7fcf4b" transform="rotate(14 150 500)"/>
//     <Ellipse cx="45" cy="540" rx="34" ry="64" fill="#5fae38" transform="rotate(-14 45 540)"/>
//     <Rect x="68" y="548" width="106" height="68" rx="16" fill="#f4eadc"/>
//     <Circle cx="102" cy="578" r="5" fill="#6b4423"/><Circle cx="140" cy="578" r="5" fill="#6b4423"/>

//     <Rect x="708" y="182" width="162" height="181" fill="#c8e4f3" stroke="#a9d1ea" strokeWidth="5"/>
//     <Circle cx="790" cy="267" r="56" fill="#f9cf6a" opacity="0.7"/>
//     <Circle cx="790" cy="267" r="42" fill="#f5a63e"/>

//     <Rect x="775" y="632" width="167" height="533" fill="#e9ab5e"/>
//     <Rect x="790" y="646" width="152" height="505" fill="#dc9d4f"/>
//     <Rect x="775" y="800" width="167" height="12" fill="#f0bb75"/>
//     <Rect x="775" y="980" width="167" height="12" fill="#f0bb75"/>
//     <Rect x="805" y="690" width="30" height="110" fill="#38aeea"/>
//     <Rect x="835" y="672" width="26" height="128" fill="#f8d04c"/>
//     <Rect x="862" y="692" width="30" height="108" fill="#8a63da"/>
//     <Rect x="805" y="872" width="30" height="106" fill="#5b86d6"/>
//     <Rect x="835" y="858" width="26" height="120" fill="#4db8b4"/>
//     <Circle cx="826" cy="1030" r="20" fill="#c98a4b"/><Circle cx="884" cy="1030" r="20" fill="#c98a4b"/><Circle cx="855" cy="1070" r="42" fill="#c98a4b"/>
//     <Rect x="838" y="522" width="26" height="110" rx="13" fill="#6cbf3d" transform="rotate(-6 851 580)"/>
//     <Rect x="872" y="568" width="30" height="80" rx="15" fill="#5fae38" transform="rotate(26 887 608)"/>

//     <Rect x="0" y="1095" width="195" height="37" fill="#39abea"/>
//     <Rect x="0" y="1132" width="205" height="42" fill="#ef69b0"/>
//     <Rect x="0" y="1175" width="208" height="38" fill="#f9d04c"/>
//     <Rect x="150" y="1185" width="50" height="14" fill="#fff" opacity="0.85"/>
//     <Rect x="0" y="1213" width="215" height="30" fill="#3aaeed"/>
//     <Rect x="18" y="1200" width="136" height="58" rx="18" fill="#39aeec"/>
//     <Rect x="58" y="1186" width="58" height="32" rx="12" fill="#7cc8f4"/>
//     <Circle cx="40" cy="1272" r="16" fill="#27408b"/><Circle cx="122" cy="1272" r="16" fill="#27408b"/>

//     <Rect x="868" y="1030" width="22" height="130" fill="#6cbf3d" transform="rotate(-8 879 1100)"/>
//     <Rect x="880" y="1030" width="22" height="130" fill="#ef5a67" transform="rotate(10 891 1100)"/>
//     <Rect x="902" y="1028" width="20" height="130" fill="#3a8fd8" transform="rotate(22 912 1100)"/>
//     <Rect x="822" y="1140" width="108" height="146" rx="12" fill="#f9cd3a"/>
//     <Rect x="822" y="1140" width="108" height="14" fill="#f2bb21"/>

//     <Rect x="81" y="1248" width="805" height="346" rx="173" fill="#f4e8d2" stroke="#b9d1e2" strokeWidth="22"/>
//     <Path d="M0 1285 C60 1270 108 1320 102 1400 L102 1669 L0 1669 Z" fill="#83c752"/>
//     <Path d="M0 1388 C95 1372 195 1430 205 1510 C214 1580 168 1640 140 1669 L0 1669 Z" fill="#5fa63f"/>
//   </Svg>}

// /* ---------- drag any child freely ---------- */
// function DragView({children}:any){
//   const pan=useRef(new Animated.ValueXY()).current;
//   const pr=useRef(PanResponder.create({
//     onStartShouldSetPanResponder:()=>true,
//     onPanResponderGrant:()=>{pan.extractOffset()},
//     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
//     onPanResponderRelease:()=>{pan.flattenOffset()}})).current;
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
//   const ring=state==='ok'?'#3ec75a':state==='bad'?'#ee4650':'rgba(255,255,255,0.95)';
//   const fill=state==='ok'?'#e3f9e6':state==='bad'?'#ffe3e3':'#fbf3e7';
//   return <Animated.View style={{width:size,height:size,alignItems:'center',justifyContent:'center',
//     transform:[{translateY:f.interpolate({inputRange:[0,1],outputRange:[0,-size*0.03]})}]}}>
//     <Svg width={size} height={size} viewBox="0 0 200 200" style={{position:'absolute'}}>
//       <Circle cx="100" cy="100" r="97" fill="rgba(180,216,242,0.55)" stroke={ring} strokeWidth={state?6:3} strokeDasharray={state?undefined:'8 8'}/>
//       <Circle cx="100" cy="106" r="80" fill="rgba(29,61,102,0.12)"/>
//       <Circle cx="100" cy="100" r="80" fill={fill}/>
//     </Svg>
//     <Pressable disabled={disabled||!onPress} onPress={onPress} style={{width:size*0.8,height:size*0.8,borderRadius:size*0.4,alignItems:'center',justifyContent:'center'}}>
//       {children}</Pressable>
//   </Animated.View>}

// /* =====================  MAIN  ===================== */
// export default function BTLevel1Board({n,lv,hints,hid=[],mark,note,shake,qIn,bg,useRoomBg=false,art,showTools=true,onHome,onSettings,onPick,onClue,onCombine,onVideo,onSkip}:any){
//   const [box,setBox]=useState({w:0,h:0});
//   const sway=useRef(new Animated.Value(0)).current;
//   useEffect(()=>{
//     const a=Animated.loop(Animated.sequence([
//       Animated.timing(sway,{toValue:1,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
//       Animated.timing(sway,{toValue:0,duration:1800,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));
//     a.start();return()=>a.stop()},[]);

//   // ---- clue popup state: seen = how many clues are revealed (0, 1 or 2) ----
//   const [clueOpen,setClueOpen]=useState(false);
//   const [seen,setSeen]=useState(0);
//   const [busy,setBusy]=useState(false);
//   const busyRef=useRef(false);

//   // Clues are free: onClue() is still called (if the parent wants to track it),
//   // but its result / errors never block the clue from showing.
//   const reveal=async(k:number)=>{
//     if(busyRef.current||seen!==k-1)return;
//     busyRef.current=true;setBusy(true);
//     try{if(onClue)await onClue()}catch(e){}
//     setSeen(k);
//     busyRef.current=false;setBusy(false)};
//   const openClues=()=>{setClueOpen(true);if(seen===0)reveal(1)};

//   // ---- drag-to-combine ----
//   const [merged,setMerged]=useState<any>(null);
//   const [dragIdx,setDragIdx]=useState(-1);
//   const dPan=useRef(Array.from({length:6},()=>new Animated.ValueXY())).current;
//   const live=useRef<any>({}).current;
//   const back=(i:number)=>Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();
//   const dPR=useRef(Array.from({length:6},(_,idx)=>PanResponder.create({
//     onStartShouldSetPanResponder:()=>!!live.canDrag?.(idx),
//     onPanResponderGrant:()=>setDragIdx(idx),
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
//     const me=slot(idx),cx=me.x+dx/k,cy=me.y+dy/k;
//     let j=-1,best=1e9;
//     cells.forEach((o:any,s:number)=>{
//       if(s===idx||!o?.it?.drag)return;
//       const p=slot(s),d=Math.hypot(cx-p.x,cy-p.y);
//       if(d<D*0.85&&d<best){best=d;j=s}});
//     if(j<0){back(idx);return}
//     const a=cells[idx].i,b=cells[j].i;
//     const r=onCombine?await onCombine(Math.min(a,b),Math.max(a,b)):null;
//     if(r&&r.correct){const pj=slot(j);setMerged({x:(me.x+pj.x)/2,y:(me.y+pj.y)/2,t:r.result??'',a:idx,b:j})}
//     else back(idx)};

//   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
//   const qFont=P((lv?.question||'').length>22?34:42);

//   const costPill=(x:number,w:number,icon:any,text:string)=>
//     <View style={[A(x,1527,w,67),{borderRadius:P(34),backgroundColor:'#875427',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10)}]}>
//       {icon}<Text numberOfLines={1} style={{fontFamily:F,fontSize:P(38),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{text}</Text></View>;
//   const circleBtn=(x:number,bgc:string,bc:string,onPress:any,icon:any)=>
//     <Squish style={A(x,1351,166,166)} onPress={onPress}><View style={{width:P(166),height:P(166),borderRadius:P(83),backgroundColor:bgc,borderWidth:P(14),borderColor:bc,alignItems:'center',justifyContent:'center',elevation:6}}>{icon}</View></Squish>;

//   return <View style={{flex:1,backgroundColor:WALL}} onLayout={e=>setBox({w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height})}>
//     {useRoomBg&&bg}
//     {box.w>0&&<>
//       {!useRoomBg&&<View pointerEvents="none" style={{position:'absolute',left:0,right:0,top:top0+P(1165),bottom:0,backgroundColor:FLOOR}}/>}
//       {!useRoomBg&&<View pointerEvents="none" style={{position:'absolute',left:0,right:0,top:top0+P(1165),height:P(34),backgroundColor:BASE}}/>}

//       <View style={{position:'absolute',left:(box.w-bw)/2,top:top0,width:bw,height:bh}}>
//         {!useRoomBg&&<Room w={bw} h={bh}/>}

//         {/* top: home, settings */}
//         <Squish style={A(27,111,78,78)} onPress={onHome}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#fbde74',borderWidth:2,borderColor:'#2a2a2a',alignItems:'center',justifyContent:'center'}}><Icon n="home" s={P(42)}/></View></Squish>
//         <Squish style={A(119,111,78,78)} onPress={onSettings}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#fbde74',borderWidth:2,borderColor:'#2a2a2a',alignItems:'center',justifyContent:'center'}}><Icon n="gear" s={P(44)}/></View></Squish>

//         {/* level sign */}
//         <Animated.View style={[A(300,88,346,140),{transform:[{rotate:swayR}]}]}>
//           <View style={{position:'absolute',left:P(62),top:0,width:2,height:P(48),backgroundColor:'#9a6a3a',transform:[{rotate:'6deg'}]}}/>
//           <View style={{position:'absolute',right:P(62),top:0,width:2,height:P(48),backgroundColor:'#9a6a3a',transform:[{rotate:'-6deg'}]}}/>
//           <View style={{position:'absolute',left:0,top:P(42),width:P(346),height:P(98),borderRadius:P(12),backgroundColor:'#bd6b29',borderWidth:P(5),borderColor:'#e0902f',alignItems:'center',justifyContent:'center',elevation:6}}>
//             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10),flexWrap:'nowrap'}}>
//               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'<'}</Text>
//               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{'LEVEL '+n}</Text>
//               <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'>'}</Text>
//             </View>
//           </View>
//           <View style={{position:'absolute',left:-P(6),top:P(36),width:P(34),height:P(58),borderRadius:P(20),backgroundColor:'#6cbf3d',transform:[{rotate:'-30deg'}]}}/>
//           <View style={{position:'absolute',right:-P(6),top:P(36),width:P(34),height:P(58),borderRadius:P(20),backgroundColor:'#6cbf3d',transform:[{rotate:'30deg'}]}}/>
//         </Animated.View>

//         {/* bulbs counter */}
//         <View style={[A(728,128,142,68),{borderRadius:P(34),backgroundColor:'#fff',justifyContent:'center',paddingRight:P(26),alignItems:'center',elevation:4}]}>
//           <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(44),fontWeight:'900',color:INK,includeFontPadding:false}}>{hints}</Text></View>
//         <View style={A(852,118,56,56)}><Icon n="bulb" s={P(56)}/></View>

//         {/* question pill */}
//         <Animated.View style={[A(192,298,556,104),{borderRadius:P(52),backgroundColor:CREAM,alignItems:'center',justifyContent:'center',elevation:4,
//           opacity:qIn??1,transform:[{translateY:qIn?qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]}):0}]}]}>
//           <Text style={{position:'absolute',left:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'<'}</Text>
//           <Text style={{position:'absolute',right:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'>'}</Text>
//           <Text numberOfLines={1} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:qFont,color:'#17307a',maxWidth:P(420),textAlign:'center'}}>{lv?.question}</Text>
//         </Animated.View>

//         {/* options grid */}
//         <Animated.View pointerEvents="box-none" style={[StyleSheet.absoluteFill,{transform:[{translateX:shake??0}]}]}>
//           {cells.map((c:any,idx:number)=>{
//             if(!c)return null;
//             const {x,y}=slot(idx);
//             const pos=A(x-D/2,y-D/2,D,D);
//             if(c.tool)return <View key={'t'+idx} style={[pos,{zIndex:20}]}>
//               <Bubble size={P(D)} delay={idx*350}>
//                 <DragView>{c.tool==='eraser'
//                   ?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
//                   :<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>}</DragView>
//               </Bubble></View>;
//             const {it,i}=c,Art=art?.[it.k],hidden=hid.includes(i);
//             const state=markCell===idx?(mark.ok?'ok':'bad'):undefined;
//             const drag=isCombine&&!!it.drag,gone=!!merged&&(merged.a===idx||merged.b===idx);
//             return <Animated.View key={'o'+idx} {...(drag?dPR[idx].panHandlers:{})}
//               style={[pos,{opacity:gone?0:hidden?0.2:1,zIndex:dragIdx===idx?30:1,elevation:dragIdx===idx?30:0},drag?{transform:dPan[idx].getTranslateTransform()}:null]}>
//               <Bubble size={P(D)} delay={idx*350} state={state} disabled={hidden} onPress={drag?undefined:()=>onPick(i)}>
//                 {it.k==='eraser'?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
//                 :it.k==='pencil'?<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>
//                 :Art&&it.k!=='num'?<Art w={P(130)} t={it.t} grey={it.grey} i={i}/>
//                 :<Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(it.t??'').length>2?78:116),includeFontPadding:false}}>{String(it.t??'')}</Text>}
//               </Bubble>
//               {state&&<View pointerEvents="none" style={{position:'absolute',right:0,top:0}}><Icon n={mark.ok?'check':'cross'} s={P(64)}/></View>}
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

//         {/* hint / video / skip */}
//         {circleBtn(143,'#a4d732','#cff08d',openClues,<Icon n="search" s={P(78)}/>)}
//         {costPill(152,150,<Icon n="bulb" s={P(38)}/>,String(CLUE_COST))}
//         {circleBtn(388,'#f4e8d2','#fff',onVideo,<Icon n="film" s={P(92)}/>)}
//         {costPill(391,162,<Coin s={P(30)}/>,'+75')}
//         {circleBtn(637,'#ed434d','#fff',onSkip,<Icon n="play" s={P(80)}/>)}
//         {costPill(645,151,<Icon n="bulb" s={P(38)}/>,'50')}

//         {/* ---- clue popup (free) ---- */}
//         {clueOpen&&<>
//           <Pressable onPress={()=>setClueOpen(false)} style={[A(0,0,DW,DH),{zIndex:40,elevation:40,backgroundColor:'rgba(10,25,60,0.5)'}]}/>
//           <View style={[A(70,420,802,780),{zIndex:41,elevation:41,borderRadius:P(56),backgroundColor:CREAM,borderWidth:P(14),borderColor:'#e0902f'}]}>
//             <Text style={{position:'absolute',left:0,right:0,top:P(34),textAlign:'center',fontFamily:F,fontSize:P(56),fontWeight:'900',color:NAVY,includeFontPadding:false}}>CLUES</Text>
//             <Squish style={A(640,22,78,78)} onPress={()=>setClueOpen(false)}>
//               <View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#fbde74',borderWidth:2,borderColor:'#2a2a2a',alignItems:'center',justifyContent:'center'}}><Icon n="cross" s={P(40)}/></View></Squish>
//             {[[1,130],[2,410]].map(([k,y])=>{
//               const shown=seen>=k,avail=!shown&&seen===k-1;
//               return <Squish key={'clue'+k} disabled={!avail||busy} onPress={()=>reveal(k)} style={A(36,y,690,250)}>
//                 <View style={{width:P(690),height:P(250),borderRadius:P(40),backgroundColor:shown?'#ffffff':avail?'#f6e3b4':'#e4dccd',borderWidth:P(6),borderColor:shown?'#3ec75a':avail?'#ffb629':'#cfc3ae',flexDirection:'row',alignItems:'center',paddingHorizontal:P(28),gap:P(24)}}>
//                   <View style={{width:P(110),height:P(110),borderRadius:P(55),backgroundColor:shown||avail?'#bd6b29':'#b7a98f',alignItems:'center',justifyContent:'center'}}>
//                     {shown||avail
//                       ?<Text style={{fontFamily:F,fontSize:P(60),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{k}</Text>
//                       :<LockArt s={P(70)}/>}
//                   </View>
//                   <View style={{flex:1}}>
//                     <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(38),fontWeight:'900',color:shown||avail?'#bd6b29':'#8d7f68',includeFontPadding:false}}>{'Clue '+k}</Text>
//                     {shown
//                       ?<Text numberOfLines={4} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:P(36),color:'#17307a',marginTop:P(6)}}>{CLUES[k-1]}</Text>
//                       :avail
//                         ?<Text numberOfLines={1} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:'#6b4423',marginTop:P(8),includeFontPadding:false}}>{busy?'Please wait...':'Tap to reveal'}</Text>
//                         :<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(32),fontWeight:'bold',color:'#8d7f68',marginTop:P(8)}}>{'View Clue '+(k-1)+' first to unlock'}</Text>}
//                   </View>
//                 </View></Squish>})}
//           </View>
//         </>}
//       </View>
//     </>}
//   </View>}
import React,{useEffect,useRef,useState} from 'react';
import {View,Text,Animated,Pressable,PanResponder,Platform,Easing,StyleSheet} from 'react-native';
import Svg,{Rect,Path,Circle,Ellipse,G,Polygon,Line,Defs,LinearGradient,Stop} from 'react-native-svg';
import {F,INK,Coin} from './BTShared';
import {Icon} from './Art';



const NAVY='#132f70',CREAM='#faf0e2',K='#1d1d1d';
const SERIF:any=Platform.select({web:'"Playfair Display",Georgia,"Times New Roman",serif',ios:'Georgia-Italic',default:'serif'});
const DW=942,DH=1669;
const WALL='#abd1f1',FLOOR='#f0bb75',BASE='#f1bebf';

/* ---------- Level 1 clues (search button) ---------- */
// Only one clue now (the old "Think carefully..." clue was removed).
const CLUES=[
  'Combine the two correct numbers to reveal the final answer!',
];
const CLUE_COST=25; // only shown on the pill
const LockArt=({s}:any)=><Svg width={s} height={s} viewBox="0 0 100 100"><Path d="M30 46 V34 a20 20 0 0 1 40 0 V46" fill="none" stroke="#7a6a55" strokeWidth="9" strokeLinecap="round"/><Rect x="20" y="44" width="60" height="44" rx="10" fill="#9b8a72"/><Circle cx="50" cy="63" r="6" fill="#f4e8d2"/><Rect x="47" y="63" width="6" height="15" rx="3" fill="#f4e8d2"/></Svg>;

/* ---------- eraser / pencil arts ---------- */
const EraserArt=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#2ea3e6" stroke={K} strokeWidth="2.5"/><Path d="M4 20 Q4 8 16 8 H46 V54 H16 Q4 54 4 42 Z" fill="#fff" stroke={K} strokeWidth="2.5"/></Svg>;
const PencilArt=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke={K} strokeWidth="1.5"/><Polygon points="2,15 10,11.5 10,18.5" fill={K}/><Rect x="26" y="4" width="84" height="22" fill="#1f9a4a" stroke={K} strokeWidth="1.5"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#b8b8b8" stroke={K} strokeWidth="1.5"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#8a8a8a" stroke={K} strokeWidth="1.5"/></Svg>;

/* ---------- the room (static scene drawn in design coordinates) ---------- */
function Room({w,h}:any){
  return <Svg pointerEvents="none" width={w} height={h} viewBox={`0 0 ${DW} ${DH}`} style={{position:'absolute',left:0,top:0}}>
    <Defs><LinearGradient id="l1wall" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#abd1f1"/><Stop offset="1" stopColor="#b1d3ef"/></LinearGradient></Defs>
    <Rect width={DW} height={DH} fill="url(#l1wall)"/>
    <Polygon points="250,0 430,0 150,1170 0,1170" fill="#fff" opacity="0.10"/>
    <Polygon points="520,0 640,0 420,1170 330,1170" fill="#fff" opacity="0.07"/>
    <Rect x="0" y="1165" width={DW} height="34" fill={BASE}/>
    <Rect x="0" y="1199" width={DW} height={DH-1199} fill={FLOOR}/>
    {[0,1,2,3,4,5].map(i=><Rect key={i} x={i*170-20} y="1199" width="3" height={DH-1199} fill="#e6a85f" opacity="0.5"/>)}

    <Rect x="0" y="128" width="205" height="512" fill="#e8a55a"/>
    <Rect x="0" y="140" width="190" height="488" fill="#97d9f9"/>
    <Rect x="0" y="372" width="205" height="14" fill="#e8a55a"/>
    <G fill="#fff"><Ellipse cx="165" cy="215" rx="28" ry="20"/><Ellipse cx="140" cy="230" rx="26" ry="16"/><Ellipse cx="10" cy="345" rx="22" ry="16"/></G>
    <Rect x="0" y="610" width="245" height="38" fill="#f0be76"/>
    <Rect x="0" y="640" width="245" height="8" fill="#d99a4e" opacity="0.5"/>
    <Ellipse cx="85" cy="520" rx="46" ry="92" fill="#6cbf3d"/>
    <Ellipse cx="150" cy="500" rx="38" ry="84" fill="#7fcf4b" transform="rotate(14 150 500)"/>
    <Ellipse cx="45" cy="540" rx="34" ry="64" fill="#5fae38" transform="rotate(-14 45 540)"/>
    <Rect x="68" y="548" width="106" height="68" rx="16" fill="#f4eadc"/>
    <Circle cx="102" cy="578" r="5" fill="#6b4423"/><Circle cx="140" cy="578" r="5" fill="#6b4423"/>

    <Rect x="708" y="182" width="162" height="181" fill="#c8e4f3" stroke="#a9d1ea" strokeWidth="5"/>
    <Circle cx="790" cy="267" r="56" fill="#f9cf6a" opacity="0.7"/>
    <Circle cx="790" cy="267" r="42" fill="#f5a63e"/>

    <Rect x="775" y="632" width="167" height="533" fill="#e9ab5e"/>
    <Rect x="790" y="646" width="152" height="505" fill="#dc9d4f"/>
    <Rect x="775" y="800" width="167" height="12" fill="#f0bb75"/>
    <Rect x="775" y="980" width="167" height="12" fill="#f0bb75"/>
    <Rect x="805" y="690" width="30" height="110" fill="#38aeea"/>
    <Rect x="835" y="672" width="26" height="128" fill="#f8d04c"/>
    <Rect x="862" y="692" width="30" height="108" fill="#8a63da"/>
    <Rect x="805" y="872" width="30" height="106" fill="#5b86d6"/>
    <Rect x="835" y="858" width="26" height="120" fill="#4db8b4"/>
    <Circle cx="826" cy="1030" r="20" fill="#c98a4b"/><Circle cx="884" cy="1030" r="20" fill="#c98a4b"/><Circle cx="855" cy="1070" r="42" fill="#c98a4b"/>
    <Rect x="838" y="522" width="26" height="110" rx="13" fill="#6cbf3d" transform="rotate(-6 851 580)"/>
    <Rect x="872" y="568" width="30" height="80" rx="15" fill="#5fae38" transform="rotate(26 887 608)"/>

    <Rect x="0" y="1095" width="195" height="37" fill="#39abea"/>
    <Rect x="0" y="1132" width="205" height="42" fill="#ef69b0"/>
    <Rect x="0" y="1175" width="208" height="38" fill="#f9d04c"/>
    <Rect x="150" y="1185" width="50" height="14" fill="#fff" opacity="0.85"/>
    <Rect x="0" y="1213" width="215" height="30" fill="#3aaeed"/>
    <Rect x="18" y="1200" width="136" height="58" rx="18" fill="#39aeec"/>
    <Rect x="58" y="1186" width="58" height="32" rx="12" fill="#7cc8f4"/>
    <Circle cx="40" cy="1272" r="16" fill="#27408b"/><Circle cx="122" cy="1272" r="16" fill="#27408b"/>

    <Rect x="868" y="1030" width="22" height="130" fill="#6cbf3d" transform="rotate(-8 879 1100)"/>
    <Rect x="880" y="1030" width="22" height="130" fill="#ef5a67" transform="rotate(10 891 1100)"/>
    <Rect x="902" y="1028" width="20" height="130" fill="#3a8fd8" transform="rotate(22 912 1100)"/>
    <Rect x="822" y="1140" width="108" height="146" rx="12" fill="#f9cd3a"/>
    <Rect x="822" y="1140" width="108" height="14" fill="#f2bb21"/>

    <Rect x="81" y="1248" width="805" height="346" rx="173" fill="#f4e8d2" stroke="#b9d1e2" strokeWidth="22"/>
    <Path d="M0 1285 C60 1270 108 1320 102 1400 L102 1669 L0 1669 Z" fill="#83c752"/>
    <Path d="M0 1388 C95 1372 195 1430 205 1510 C214 1580 168 1640 140 1669 L0 1669 Z" fill="#5fa63f"/>
  </Svg>}

/* ---------- drag any child freely ---------- */
function DragView({children}:any){
  const pan=useRef(new Animated.ValueXY()).current;
  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>true,
    onPanResponderGrant:()=>{pan.extractOffset()},
    onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
    onPanResponderRelease:()=>{pan.flattenOffset()}})).current;
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
  const ring=state==='ok'?'#3ec75a':state==='bad'?'#ee4650':'rgba(255,255,255,0.95)';
  const fill=state==='ok'?'#e3f9e6':state==='bad'?'#ffe3e3':'#fbf3e7';
  return <Animated.View style={{width:size,height:size,alignItems:'center',justifyContent:'center',
    transform:[{translateY:f.interpolate({inputRange:[0,1],outputRange:[0,-size*0.03]})}]}}>
    <Svg width={size} height={size} viewBox="0 0 200 200" style={{position:'absolute'}}>
      <Circle cx="100" cy="100" r="97" fill="rgba(180,216,242,0.55)" stroke={ring} strokeWidth={state?6:3} strokeDasharray={state?undefined:'8 8'}/>
      <Circle cx="100" cy="106" r="80" fill="rgba(29,61,102,0.12)"/>
      <Circle cx="100" cy="100" r="80" fill={fill}/>
    </Svg>
    <Pressable disabled={disabled||!onPress} onPress={onPress} style={{width:size*0.8,height:size*0.8,borderRadius:size*0.4,alignItems:'center',justifyContent:'center'}}>
      {children}</Pressable>
  </Animated.View>}

/* =====================  MAIN  ===================== */
export default function BTLevel1Board({n,lv,hints,hid=[],mark,note,shake,qIn,bg,useRoomBg=false,art,showTools=true,onHome,onSettings,onPick,onClue,onCombine,onVideo,onSkip}:any){
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
  const busyRef=useRef(false);

  // Clues are free: onClue() is still called (if the parent wants to track it),
  // but its result / errors never block the clue from showing.
  const reveal=async(k:number)=>{
    if(busyRef.current||seen!==k-1)return;
    busyRef.current=true;setBusy(true);
    try{if(onClue)await onClue()}catch(e){}
    setSeen(k);
    busyRef.current=false;setBusy(false)};
  const openClues=()=>{setClueOpen(true);if(seen===0)reveal(1)};

  // ---- drag-to-combine ----
  const [merged,setMerged]=useState<any>(null);
  const [dragIdx,setDragIdx]=useState(-1);
  const dPan=useRef(Array.from({length:6},()=>new Animated.ValueXY())).current;
  const live=useRef<any>({}).current;
  const back=(i:number)=>Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();
  const dPR=useRef(Array.from({length:6},(_,idx)=>PanResponder.create({
    onStartShouldSetPanResponder:()=>!!live.canDrag?.(idx),
    onPanResponderGrant:()=>setDragIdx(idx),
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
    const me=slot(idx),cx=me.x+dx/k,cy=me.y+dy/k;
    let j=-1,best=1e9;
    cells.forEach((o:any,s:number)=>{
      if(s===idx||!o?.it?.drag)return;
      const p=slot(s),d=Math.hypot(cx-p.x,cy-p.y);
      if(d<D*0.85&&d<best){best=d;j=s}});
    if(j<0){back(idx);return}
    const a=cells[idx].i,b=cells[j].i;
    const r=onCombine?await onCombine(Math.min(a,b),Math.max(a,b)):null;
    if(r&&r.correct){const pj=slot(j);setMerged({x:(me.x+pj.x)/2,y:(me.y+pj.y)/2,t:r.result??'',a:idx,b:j})}
    else back(idx)};

  const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
  const qFont=P((lv?.question||'').length>22?34:42);

  const costPill=(x:number,w:number,icon:any,text:string)=>
    <View style={[A(x,1527,w,67),{borderRadius:P(34),backgroundColor:'#875427',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10)}]}>
      {icon}<Text numberOfLines={1} style={{fontFamily:F,fontSize:P(38),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{text}</Text></View>;
  const circleBtn=(x:number,bgc:string,bc:string,onPress:any,icon:any)=>
    <Squish style={A(x,1351,166,166)} onPress={onPress}><View style={{width:P(166),height:P(166),borderRadius:P(83),backgroundColor:bgc,borderWidth:P(14),borderColor:bc,alignItems:'center',justifyContent:'center',elevation:6}}>{icon}</View></Squish>;

  return <View style={{flex:1,backgroundColor:WALL}} onLayout={e=>setBox({w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height})}>
    {useRoomBg&&bg}
    {box.w>0&&<>
      {!useRoomBg&&<View pointerEvents="none" style={{position:'absolute',left:0,right:0,top:top0+P(1165),bottom:0,backgroundColor:FLOOR}}/>}
      {!useRoomBg&&<View pointerEvents="none" style={{position:'absolute',left:0,right:0,top:top0+P(1165),height:P(34),backgroundColor:BASE}}/>}

      <View style={{position:'absolute',left:(box.w-bw)/2,top:top0,width:bw,height:bh}}>
        {!useRoomBg&&<Room w={bw} h={bh}/>}

        {/* top: home, settings */}
        <Squish style={A(27,111,78,78)} onPress={onHome}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#fbde74',borderWidth:2,borderColor:'#2a2a2a',alignItems:'center',justifyContent:'center'}}><Icon n="home" s={P(42)}/></View></Squish>
        <Squish style={A(119,111,78,78)} onPress={onSettings}><View style={{width:P(78),height:P(78),borderRadius:P(39),backgroundColor:'#fbde74',borderWidth:2,borderColor:'#2a2a2a',alignItems:'center',justifyContent:'center'}}><Icon n="gear" s={P(44)}/></View></Squish>

        {/* level sign */}
        <Animated.View style={[A(300,88,346,140),{transform:[{rotate:swayR}]}]}>
          <View style={{position:'absolute',left:P(62),top:0,width:2,height:P(48),backgroundColor:'#9a6a3a',transform:[{rotate:'6deg'}]}}/>
          <View style={{position:'absolute',right:P(62),top:0,width:2,height:P(48),backgroundColor:'#9a6a3a',transform:[{rotate:'-6deg'}]}}/>
          <View style={{position:'absolute',left:0,top:P(42),width:P(346),height:P(98),borderRadius:P(12),backgroundColor:'#bd6b29',borderWidth:P(5),borderColor:'#e0902f',alignItems:'center',justifyContent:'center',elevation:6}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:P(10),flexWrap:'nowrap'}}>
              <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'<'}</Text>
              <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#fff',includeFontPadding:false}}>{'LEVEL '+n}</Text>
              <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(46),fontWeight:'900',color:'#ffc533',includeFontPadding:false}}>{'>'}</Text>
            </View>
          </View>
          <View style={{position:'absolute',left:-P(6),top:P(36),width:P(34),height:P(58),borderRadius:P(20),backgroundColor:'#6cbf3d',transform:[{rotate:'-30deg'}]}}/>
          <View style={{position:'absolute',right:-P(6),top:P(36),width:P(34),height:P(58),borderRadius:P(20),backgroundColor:'#6cbf3d',transform:[{rotate:'30deg'}]}}/>
        </Animated.View>

        {/* bulbs counter */}
        <View style={[A(728,128,142,68),{borderRadius:P(34),backgroundColor:'#fff',justifyContent:'center',paddingRight:P(26),alignItems:'center',elevation:4}]}>
          <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(44),fontWeight:'900',color:INK,includeFontPadding:false}}>{hints}</Text></View>
        <View style={A(852,118,56,56)}><Icon n="bulb" s={P(56)}/></View>

        {/* question pill */}
        <Animated.View style={[A(192,298,556,104),{borderRadius:P(52),backgroundColor:CREAM,alignItems:'center',justifyContent:'center',elevation:4,
          opacity:qIn??1,transform:[{translateY:qIn?qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]}):0}]}]}>
          <Text style={{position:'absolute',left:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'<'}</Text>
          <Text style={{position:'absolute',right:P(30),fontFamily:F,fontSize:P(54),fontWeight:'900',color:'#ffb629',includeFontPadding:false}}>{'>'}</Text>
          <Text numberOfLines={1} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:qFont,color:'#17307a',maxWidth:P(420),textAlign:'center'}}>{lv?.question}</Text>
        </Animated.View>

        {/* options grid */}
        <Animated.View pointerEvents="box-none" style={[StyleSheet.absoluteFill,{transform:[{translateX:shake??0}]}]}>
          {cells.map((c:any,idx:number)=>{
            if(!c)return null;
            const {x,y}=slot(idx);
            const pos=A(x-D/2,y-D/2,D,D);
            if(c.tool)return <View key={'t'+idx} style={[pos,{zIndex:20}]}>
              <Bubble size={P(D)} delay={idx*350}>
                <DragView>{c.tool==='eraser'
                  ?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
                  :<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>}</DragView>
              </Bubble></View>;
            const {it,i}=c,Art=art?.[it.k],hidden=hid.includes(i);
            const state=markCell===idx?(mark.ok?'ok':'bad'):undefined;
            const drag=isCombine&&!!it.drag,gone=!!merged&&(merged.a===idx||merged.b===idx);
            return <Animated.View key={'o'+idx} {...(drag?dPR[idx].panHandlers:{})}
              style={[pos,{opacity:gone?0:hidden?0.2:1,zIndex:dragIdx===idx?30:1,elevation:dragIdx===idx?30:0},drag?{transform:dPan[idx].getTranslateTransform()}:null]}>
              <Bubble size={P(D)} delay={idx*350} state={state} disabled={hidden} onPress={drag?undefined:()=>onPick(i)}>
                {it.k==='eraser'?<View style={{transform:[{rotate:'28deg'}]}}><EraserArt w={P(120)}/></View>
                :it.k==='pencil'?<View style={{transform:[{rotate:'-42deg'}]}}><PencilArt w={P(140)}/></View>
                :Art&&it.k!=='num'?<Art w={P(130)} t={it.t} grey={it.grey} i={i}/>
                :<Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(it.t??'').length>2?78:116),includeFontPadding:false}}>{String(it.t??'')}</Text>}
              </Bubble>
              {state&&<View pointerEvents="none" style={{position:'absolute',right:0,top:0}}><Icon n={mark.ok?'check':'cross'} s={P(64)}/></View>}
            </Animated.View>})}
          {merged&&<View pointerEvents="none" style={[A(merged.x-D/2,merged.y-D/2,D,D),{zIndex:25,elevation:25}]}>
            <Bubble size={P(D)} delay={0} state="ok">
              <Text numberOfLines={1} style={{fontFamily:F,fontWeight:'900',color:NAVY,fontSize:P(String(merged.t).length>2?78:116),includeFontPadding:false}}>{String(merged.t)}</Text>
            </Bubble></View>}
        </Animated.View>

        {/* message line: between the grid and the bottom bar */}
        {!!note&&<View pointerEvents="none" style={[A(60,1170,822,68),{zIndex:20,elevation:20,alignItems:'center',justifyContent:'center'}]}>
          <View style={{backgroundColor:'rgba(255,255,255,0.92)',borderRadius:P(34),paddingHorizontal:P(34),paddingVertical:P(8)}}>
            <Text numberOfLines={2} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:'#c0392b',textAlign:'center'}}>{note}</Text>
          </View>
        </View>}

        {/* hint / video / skip */}
        {circleBtn(143,'#a4d732','#cff08d',openClues,<Icon n="search" s={P(78)}/>)}
        {costPill(152,150,<Icon n="bulb" s={P(38)}/>,String(CLUE_COST))}
        {circleBtn(388,'#f4e8d2','#fff',onVideo,<Icon n="film" s={P(92)}/>)}
        {costPill(391,162,<Coin s={P(30)}/>,'+75')}
        {circleBtn(637,'#ed434d','#fff',onSkip,<Icon n="play" s={P(80)}/>)}
        {costPill(645,151,<Icon n="bulb" s={P(38)}/>,'50')}

        {/* ---- clue popup (free, one clue) ---- */}
        {clueOpen&&<>
          <Pressable onPress={()=>setClueOpen(false)} style={[A(0,0,DW,DH),{zIndex:40,elevation:40,backgroundColor:'rgba(10,25,60,0.5)'}]}/>
          <View style={[A(70,560,802,470),{zIndex:41,elevation:41,borderRadius:P(56),backgroundColor:CREAM,borderWidth:P(14),borderColor:'#e0902f'}]}>
            <Text style={{position:'absolute',left:0,right:0,top:P(34),textAlign:'center',fontFamily:F,fontSize:P(56),fontWeight:'900',color:NAVY,includeFontPadding:false}}>CLUES</Text>
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
                    <Text numberOfLines={1} style={{fontFamily:F,fontSize:P(38),fontWeight:'900',color:shown||avail?'#bd6b29':'#8d7f68',includeFontPadding:false}}>{'Clue '+k}</Text>
                    {shown
                      ?<Text numberOfLines={4} style={{fontFamily:SERIF,fontStyle:'italic',fontSize:P(36),color:'#17307a',marginTop:P(6)}}>{CLUES[k-1]}</Text>
                      :avail
                        ?<Text numberOfLines={1} style={{fontFamily:F,fontSize:P(34),fontWeight:'bold',color:'#6b4423',marginTop:P(8),includeFontPadding:false}}>{busy?'Please wait...':'Tap to reveal'}</Text>
                        :<Text numberOfLines={2} style={{fontFamily:F,fontSize:P(32),fontWeight:'bold',color:'#8d7f68',marginTop:P(8)}}>{'View Clue '+(k-1)+' first to unlock'}</Text>}
                  </View>
                </View></Squish>})}
          </View>
        </>}
      </View>
    </>}
  </View>}
