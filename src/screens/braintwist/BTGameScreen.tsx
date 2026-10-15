// // // // import React,{useEffect,useRef,useState} from 'react';
// // // // import {View,Text,TouchableOpacity,Pressable,Animated,PanResponder,StyleSheet} from 'react-native';
// // // // import Svg,{Rect,Path,Circle,Polygon,Line} from 'react-native-svg';
// // // // import * as api from './api';
// // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Icon} from './Art';
// // // // import {PointerHand} from './CelebrationHands';
// // // // import {F,INK,Stage,Coin,loop} from './BTShared';

// // // // const GREEN='#c5f158',CHALK='#f6f4ea';

// // // // /* ---------- chalkboard art ---------- */
// // // // // big chalk number inside a faint dashed chalk ring
// // // // const Num=({w,t}:any)=><View style={{width:w,height:w,alignItems:'center',justifyContent:'center'}}>
// // // //   <Svg width={w} height={w} viewBox="0 0 100 100" style={{position:'absolute'}}>
// // // //     <Circle cx="50" cy="50" r="46" stroke="rgba(246,244,234,0.3)" strokeWidth="2.5" strokeDasharray="5 7" fill="rgba(255,255,255,0.04)"/></Svg>
// // // //   <Text style={{fontFamily:F,fontSize:w*0.78,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{t}</Text></View>;
// // // // const Duster=({w}:any)=><Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>;
// // // // const Chalk=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>;
// // // // const Eraser=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#f4f4f0" stroke="#d9d9d4" strokeWidth="2"/><Path d="M4 20 Q4 8 16 8 H70 L52 54 H16 Q4 54 4 42 Z" fill="#2ab4d9"/><Path d="M12 15 H60" stroke="#8fe0f2" strokeWidth="3" strokeLinecap="round"/></Svg>;
// // // // const Pencil=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke="#c9985a" strokeWidth="1"/><Polygon points="2,15 10,11.5 10,18.5" fill="#333"/><Rect x="26" y="4" width="84" height="22" fill="#2fa86f"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Line x1="28" y1="19" x2="108" y2="19" stroke="#1f7a4e" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#9a9a9a"/><Line x1="116" y1="3" x2="116" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Line x1="124" y1="3" x2="124" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#f4f2ea"/></Svg>;

// // // // function FreeDrag({children}:any){
// // // //   const pan=useRef(new Animated.ValueXY()).current;
// // // //   const pr=useRef(PanResponder.create({
// // // //     onStartShouldSetPanResponder:()=>true,
// // // //     onPanResponderGrant:()=>{pan.extractOffset()},
// // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // //     onPanResponderRelease:()=>{pan.flattenOffset()}})).current;
// // // //   return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// // // // // pops in on mount, squishes when pressed. style = outer (position), inner = visual style
// // // // function PopTouch({style,inner,onPress,disabled,delay=0,children}:any){
// // // //   const e=useRef(new Animated.Value(0)).current,s=useRef(new Animated.Value(1)).current;
// // // //   useEffect(()=>{Animated.sequence([Animated.delay(delay),Animated.spring(e,{toValue:1,friction:5,tension:90,useNativeDriver:true})]).start()},[]);
// // // //   const to=(v:number)=>Animated.spring(s,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
// // // //   return <Pressable disabled={disabled} onPress={onPress} onPressIn={()=>to(0.88)} onPressOut={()=>to(1)} style={style}>
// // // //     <Animated.View style={[inner,{opacity:e,transform:[{scale:Animated.multiply(e,s)}]}]}>{children}</Animated.View></Pressable>}

// // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat,num:Num,duster:Duster,chalk:Chalk};

// // // // /* ---------- notebook layout pieces (non-board levels) ---------- */
// // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// // // //   <View style={st.wood}><View style={st.pink}/>
// // // //     <View style={st.paper}>
// // // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // // //       <View style={st.body}>{children}</View>{bottom}
// // // //     </View></View>);
// // // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // // /* =====================  GAME SCREEN  ===================== */
// // // // export default function BTGameScreen({n,player,hints,setHints,onWin,onHome}:any){
// // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
// // // //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // //   const shake=useRef(new Animated.Value(0)).current,sway=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,qIn=useRef(new Animated.Value(0)).current;
// // // //   const stats=useRef({tries:0,hints:0});   // sent to the congrats screen -> backend (stars / score)
// // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();
// // // //   const win=(r:any,skipped?:boolean)=>onWin(r,{tries:Math.max(1,stats.current.tries),hints:stats.current.hints,skipped:!!skipped});
// // // //   const send=async(a:any)=>{stats.current.tries+=1;try{return await api.answer(n,player.id,a)}catch(e){stats.current.tries-=1;flash('Network error');return null}};
// // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start();
// // // //     loop(sway,1800);loop(pulse,900)},[]);
// // // //   useEffect(()=>{if(lv)Animated.spring(qIn,{toValue:1,friction:6,tension:70,useNativeDriver:true}).start()},[!!lv]);
// // // //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']}),
// // // //     pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.09]}),
// // // //     qY=qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]});

// // // //   // choice level: tap an item (answer = item index)
// // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // //     if(r.correct){setDone(true);setTimeout(()=>win(r),1000)}else{doShake();setTimeout(()=>setMark(null),800)}};
// // // //   // choice level with number options
// // // //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// // // //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>win(r),900)}else{doShake();flash('Not quite. Try again!')}};
// // // //   // counter / keypad levels
// // // //   const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
// // // //     if(r.correct){setOv('check');setDone(true);setTimeout(()=>win(r),1000)}
// // // //     else{doShake();setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
// // // //   // old tap-the-cloud level
// // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&win(r)},2800)};

// // // //   // multi-drag levels (combine / away / feed)
// // // //   const[merged,setMerged]=useState<any>(null);
// // // //   const goneR=useRef<number[]>([]),dPan=useRef(Array.from({length:10},()=>new Animated.ValueXY())).current,dSc=useRef(Array.from({length:10},()=>new Animated.Value(1))).current;
// // // //   const dPR=useRef(Array.from({length:10},(_,i)=>PanResponder.create({
// // // //     onStartShouldSetPanResponder:()=>!goneR.current.includes(i),onPanResponderGrant:()=>setHand(false),
// // // //     onPanResponderMove:Animated.event([null,{dx:dPan[i].x,dy:dPan[i].y}],{useNativeDriver:false}),
// // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current;if(!l)return;const to=l.target??1,el=l.items[i],fr=l.items[to];
// // // //       if(l.mode==='combine'){
// // // //         const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;
// // // //         const j=l.items.findIndex((o:any,k:number)=>k!==i&&o.drag&&Math.hypot(cx-(o.x+o.w/2),cy-(o.y+o.w/2))<o.w*0.85);
// // // //         if(j<0){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// // // //         const a=Math.min(i,j),b=Math.max(i,j),A=l.items[a],B=l.items[b],r=await send({from:a,to:b});
// // // //         if(r?.correct){setMerged({x:(A.x+B.x)/2+A.w/2-52,y:(A.y+B.y)/2+A.w/2-52,t:r.result??'',a,b});setDone(true);setTimeout(()=>win(r),1500)}
// // // //         else{doShake();flash('Not quite. Try again!');Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start()}
// // // //         return}
// // // //       let ok=false;
// // // //       if(l.mode==='away')ok=Math.hypot(g.dx,g.dy)>80;
// // // //       else{const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;ok=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w}
// // // //       if(!ok){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// // // //       goneR.current=[...goneR.current,i];
// // // //       if(l.mode==='feed')Animated.parallel([Animated.timing(dPan[i],{toValue:{x:fr.x+fr.w/2-(el.x+el.w/2),y:fr.y+fr.w*0.4-(el.y+el.w/2)},duration:350,useNativeDriver:false}),Animated.timing(dSc[i],{toValue:0.05,duration:350,useNativeDriver:false})]).start();
// // // //       const need=l.items.map((it:any,k:number)=>it.drag?k:-1).filter((k:number)=>k>=0);
// // // //       if(need.every((k:number)=>goneR.current.includes(k))){const r=await send({from:0,to});
// // // //         if(r?.correct){setDone(true);if(l.mode==='away')setBloom(true);setTimeout(()=>win(r),l.mode==='away'?2200:900)}}
// // // //     }}))).current;
// // // //   // drag level: item 0 -> item lv.target
// // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to];
// // // //       const cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// // // //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// // // //         setOpen(true);
// // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // //         setTimeout(()=>win(r),1100);return}}
// // // //       else if(hit)flash('Open the fridge first!');
// // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);stats.current.hints+=1;setHints(r.hints);const h=r.hint;
// // // //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);win(r,true)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // // //   if(!lv)return <Stage bg="#f1dcc0"><View style={bd.wall}><View style={bd.frame}><View style={[bd.board,{justifyContent:'center'}]}>
// // // //     <Text style={bd.load}>{note||('Loading level '+n+'...')}</Text></View></View></View></Stage>;

// // // //   const board=lv.bg==='board';

// // // //   const stage=<View style={[st.stage,board&&{height:290,marginTop:0},lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
// // // //       {(lv.items||[]).map((it:any,i:number)=>{if(board&&(it.k==='duster'||it.k==='chalk'))return null;
// // // //         const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
// // // //         const body=<A w={it.w} t={it.t} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:(merged&&(i===merged.a||i===merged.b))?0:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
// // // //         if(it.drag&&(lv.mode==='away'||lv.mode==='feed'||lv.mode==='combine'))return <Animated.View key={i} {...dPR[i].panHandlers} style={[pos,{zIndex:5+i,transform:[...dPan[i].getTranslateTransform(),{scale:dSc[i]}]}]}>{body}</Animated.View>;
// // // //         if(lv.type==='choice'&&!lv.options&&!lv.input)return <PopTouch key={i} style={pos} delay={i*90} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</PopTouch>;
// // // //         if(lv.type==='taps'&&it.k==='cloud')return <PopTouch key={i} style={pos} onPress={cloud}>{body}</PopTouch>;
// // // //         if(lv.type==='drag'&&!lv.mode&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // //       {merged&&<View pointerEvents="none" style={{position:'absolute',left:merged.x,top:merged.y,width:104,height:104,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:84,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{merged.t}</Text></View>}
// // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // // //     </View>;

// // // //   // ---------- chalkboard layout ----------
// // // //   if(board)return <Stage bg="#f1dcc0"><View style={bd.wall}>
// // // //     <View style={bd.frame}><View style={bd.board}>
// // // //       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
// // // //       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
// // // //       <View pointerEvents="none" style={[bd.smudge,{bottom:150,left:20,width:200,height:90,transform:[{rotate:'6deg'}]}]}/>
// // // //       <View pointerEvents="none" style={bd.sheen}/>

// // // //       {/* top bar */}
// // // //       <View style={bd.top}>
// // // //         <View style={bd.topL}><Round n="home" onPress={onHome}/><Round n="gear"/></View>
// // // //         <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
// // // //           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
// // // //           <View style={bd.sign}>
// // // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
// // // //             <Text style={bd.signt}>{'LEVEL '+n}</Text>
// // // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
// // // //           </View>
// // // //         </Animated.View>
// // // //         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
// // // //       </View>

// // // //       <Animated.Text style={[bd.q,{opacity:qIn,transform:[{translateY:qY}]}]}>{lv.question}</Animated.Text>

// // // //       <Animated.View style={{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:240,transform:[{translateX:shake}]}}>{stage}</Animated.View>

// // // //       {/* draggable eraser + pencil */}
// // // //       <View pointerEvents="box-none" style={bd.decor}>
// // // //         <FreeDrag><View style={{transform:[{rotate:'-8deg'}]}}><Eraser w={84}/></View></FreeDrag>
// // // //         <FreeDrag><View style={{transform:[{rotate:'2deg'}]}}><Pencil w={150}/></View></FreeDrag>
// // // //       </View>

// // // //       {/* hint / video / skip */}
// // // //       <View style={bd.actions}>
// // // //         <View style={bd.acol}>
// // // //           <Animated.View style={{transform:[{scale:pulseS}]}}><PopTouch inner={bd.hintBtn} onPress={hint}><Icon n="search" s={34}/></PopTouch></Animated.View>
// // // //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
// // // //         </View>
// // // //         <View style={bd.acol}>
// // // //           <PopTouch inner={bd.videoBtn} onPress={()=>reward('video')}><Icon n="film" s={40}/></PopTouch>
// // // //           <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
// // // //         </View>
// // // //         <View style={bd.acol}>
// // // //           <PopTouch inner={bd.skipBtn} onPress={skip}><Icon n="play" s={36}/></PopTouch>
// // // //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
// // // //         </View>
// // // //       </View>

// // // //       {/* chalk tray */}
// // // //       <View style={bd.ledge}>
// // // //         {[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:6+i*6,height:1,backgroundColor:'rgba(90,45,10,0.25)'}}/>)}
// // // //         <View style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>
// // // //         <View style={{position:'absolute',left:'40%',bottom:20}}><Chalk w={78}/></View>
// // // //         <View style={{position:'absolute',left:'64%',bottom:22,transform:[{rotate:'-8deg'}]}}><Chalk w={54}/></View>
// // // //       </View>
// // // //       {!!note&&<Text style={bd.note}>{note}</Text>}
// // // //     </View></View>
// // // //     <View style={bd.wallBottom}/>
// // // //   </View></Stage>;

// // // //   // ---------- notebook layout (other levels) ----------
// // // //   return <Stage bg="#e8c9a0"><Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // //     <Text style={st.ql}>{lv.question}</Text>
// // // //     <Animated.View style={{transform:[{translateX:shake}]}}>{stage}</Animated.View>
// // // //     {lv.options&&<View style={st.opts}>{lv.options.map((o:number)=>
// // // //       <TouchableOpacity key={o} disabled={done||hidOpt.includes(o)} onPress={()=>pickOpt(o)}
// // // //         style={[st.opt,{backgroundColor:sel===o?GREEN:'#fff',opacity:hidOpt.includes(o)?0.2:1}]}><Text style={st.ot}>{o}</Text></TouchableOpacity>)}</View>}
// // // //     {lv.input==='counter'&&<View style={st.cwrap}>
// // // //       <View style={st.crow}>
// // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={st.cbt}>−</Text></TouchableOpacity>
// // // //         <View style={st.cnumBox}><Text style={st.cnum}>{count}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={64}/></View>}</View>
// // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={st.cbt}>+</Text></TouchableOpacity>
// // // //       </View>
// // // //       <TouchableOpacity style={st.submit} disabled={done} onPress={()=>submitNum(count)}><Text style={st.subt}>SUBMIT</Text></TouchableOpacity>
// // // //     </View>}
// // // //     {lv.input==='keypad'&&<View style={st.kwrap}>
// // // //       <View style={st.krow}>
// // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={st.kst}>✕</Text></TouchableOpacity>
// // // //         <View style={st.kpill}><Text style={st.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={52}/></View>}</View>
// // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={()=>submitNum(Number(typed))}><Text style={st.kst}>✓</Text></TouchableOpacity>
// // // //       </View>
// // // //       {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={st.krow}>{row.map(d=>
// // // //         <TouchableOpacity key={d} style={st.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,2))}><Text style={st.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
// // // //     </View>}
// // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // //   </Paper></Stage>}

// // // // /* ---------- styles ---------- */
// // // // const bd=StyleSheet.create({
// // // //   wall:{flex:1,backgroundColor:'#f1dcc0'},
// // // //   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:8,backgroundColor:'#1f5b44',overflow:'hidden'},
// // // //   board:{flex:1,alignItems:'center'},
// // // //   load:{fontFamily:F,fontSize:22,color:CHALK},
// // // //   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
// // // //   sheen:{position:'absolute',left:0,right:0,top:0,height:120,backgroundColor:'rgba(255,255,255,0.04)'},
// // // //   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
// // // //   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
// // // //   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
// // // //   signWrap:{alignItems:'center',paddingTop:14},
// // // //   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
// // // //   sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
// // // //   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
// // // //   dashes:{gap:4,justifyContent:'center'},dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
// // // //   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
// // // //   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},
// // // //   q:{fontFamily:F,fontSize:25,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
// // // //   decor:{position:'absolute',zIndex:30,elevation:30,left:0,right:0,bottom:160,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingHorizontal:40},
// // // //   actions:{position:'absolute',left:0,right:0,bottom:62,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
// // // //   acol:{alignItems:'center'},
// // // //   lblRow:{flexDirection:'row',alignItems:'center',gap:3,height:20,marginTop:4},
// // // //   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
// // // //   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// // // //   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // //   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},
// // // //   note:{position:'absolute',bottom:40,alignSelf:'center',fontFamily:F,fontSize:17,color:'#ffb4a8'},
// // // //   wallBottom:{height:18}});

// // // // const st=StyleSheet.create({
// // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // // //   opts:{flexDirection:'row',gap:12,marginTop:6},
// // // //   opt:{width:54,height:54,borderRadius:16,borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},ot:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK},
// // // //   cwrap:{alignItems:'center',marginTop:4},crow:{flexDirection:'row',alignItems:'center',gap:14},
// // // //   cbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#5ba8d0',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},cbt:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK,lineHeight:30},
// // // //   cnumBox:{minWidth:60,height:44,alignItems:'center',justifyContent:'center'},cnum:{fontFamily:F,fontSize:34,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-8,alignItems:'center'},
// // // //   submit:{marginTop:12,paddingHorizontal:26,paddingVertical:8,borderRadius:18,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff'},subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // // //   kwrap:{alignItems:'center',gap:10,marginTop:-60},krow:{flexDirection:'row',alignItems:'center',gap:8},
// // // //   kside:{width:36,height:36,borderRadius:18,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
// // // //   kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // //   kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
// // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2}});
// // // import React,{useEffect,useRef,useState} from 'react';
// // // import {View,Text,TouchableOpacity,Pressable,Animated,PanResponder,StyleSheet} from 'react-native';
// // // import Svg,{Rect,Path,Circle,Polygon,Line} from 'react-native-svg';
// // // import * as api from './api';
// // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Icon} from './Art';
// // // import {PointerHand} from './CelebrationHands';
// // // import {F,INK,Stage,Coin,loop} from './BTShared';

// // // const GREEN='#c5f158',CHALK='#f6f4ea';

// // // /* ---------- chalkboard art ---------- */
// // // // big chalk number inside a faint dashed chalk ring
// // // const Num=({w,t}:any)=><View style={{width:w,height:w,alignItems:'center',justifyContent:'center'}}>
// // //   <Svg width={w} height={w} viewBox="0 0 100 100" style={{position:'absolute'}}>
// // //     <Circle cx="50" cy="50" r="46" stroke="rgba(246,244,234,0.3)" strokeWidth="2.5" strokeDasharray="5 7" fill="rgba(255,255,255,0.04)"/></Svg>
// // //   <Text style={{fontFamily:F,fontSize:w*0.78,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{t}</Text></View>;
// // // const Duster=({w}:any)=><Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>;
// // // const Chalk=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>;
// // // const Eraser=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#f4f4f0" stroke="#d9d9d4" strokeWidth="2"/><Path d="M4 20 Q4 8 16 8 H70 L52 54 H16 Q4 54 4 42 Z" fill="#2ab4d9"/><Path d="M12 15 H60" stroke="#8fe0f2" strokeWidth="3" strokeLinecap="round"/></Svg>;
// // // const Pencil=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke="#c9985a" strokeWidth="1"/><Polygon points="2,15 10,11.5 10,18.5" fill="#333"/><Rect x="26" y="4" width="84" height="22" fill="#2fa86f"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Line x1="28" y1="19" x2="108" y2="19" stroke="#1f7a4e" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#9a9a9a"/><Line x1="116" y1="3" x2="116" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Line x1="124" y1="3" x2="124" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#f4f2ea"/></Svg>;

// // // function FreeDrag({children}:any){
// // //   const pan=useRef(new Animated.ValueXY()).current;
// // //   const pr=useRef(PanResponder.create({
// // //     onStartShouldSetPanResponder:()=>true,
// // //     onPanResponderGrant:()=>{pan.extractOffset()},
// // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // //     onPanResponderRelease:()=>{pan.flattenOffset()}})).current;
// // //   return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// // // // pops in on mount, squishes when pressed. style = outer (position), inner = visual style
// // // function PopTouch({style,inner,onPress,disabled,delay=0,children}:any){
// // //   const e=useRef(new Animated.Value(0)).current,s=useRef(new Animated.Value(1)).current;
// // //   useEffect(()=>{Animated.sequence([Animated.delay(delay),Animated.spring(e,{toValue:1,friction:5,tension:90,useNativeDriver:true})]).start()},[]);
// // //   const to=(v:number)=>Animated.spring(s,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
// // //   return <Pressable disabled={disabled} onPress={onPress} onPressIn={()=>to(0.88)} onPressOut={()=>to(1)} style={style}>
// // //     <Animated.View style={[inner,{opacity:e,transform:[{scale:Animated.multiply(e,s)}]}]}>{children}</Animated.View></Pressable>}

// // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat,num:Num,duster:Duster,chalk:Chalk};

// // // /* ---------- notebook layout pieces (non-board levels) ---------- */
// // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// // //   <View style={st.wood}><View style={st.pink}/>
// // //     <View style={st.paper}>
// // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // //       <View style={st.body}>{children}</View>{bottom}
// // //     </View></View>);
// // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // /* =====================  GAME SCREEN  ===================== */
// // // export default function BTGameScreen({n,player,hints,setHints,onWin,onHome}:any){
// // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
// // //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // //   const shake=useRef(new Animated.Value(0)).current,sway=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,qIn=useRef(new Animated.Value(0)).current;
// // //   const stats=useRef({tries:0,hints:0});   // sent to the congrats screen -> backend (stars / score)
// // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();
// // //   const win=(r:any,skipped?:boolean)=>onWin(r,{tries:Math.max(1,stats.current.tries),hints:stats.current.hints,skipped:!!skipped});
// // //   const send=async(a:any)=>{stats.current.tries+=1;try{return await api.answer(n,player.id,a)}catch(e){stats.current.tries-=1;flash('Network error');return null}};
// // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start();
// // //     loop(sway,1800);loop(pulse,900)},[]);
// // //   useEffect(()=>{if(lv)Animated.spring(qIn,{toValue:1,friction:6,tension:70,useNativeDriver:true}).start()},[!!lv]);
// // //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']}),
// // //     pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.09]}),
// // //     qY=qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]});

// // //   // choice level: tap an item (answer = item index)
// // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // //     if(r.correct){setDone(true);setTimeout(()=>win(r),1000)}else{doShake();setTimeout(()=>setMark(null),800)}};
// // //   // choice level with number options
// // //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// // //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>win(r),900)}else{doShake();flash('Not quite. Try again!')}};
// // //   // counter / keypad levels
// // //   const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
// // //     if(r.correct){setOv('check');setDone(true);setTimeout(()=>win(r),1000)}
// // //     else{doShake();setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
// // //   // old tap-the-cloud level
// // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&win(r)},2800)};

// // //   // multi-drag levels (combine / away / feed)
// // //   const[merged,setMerged]=useState<any>(null);
// // //   const goneR=useRef<number[]>([]),dPan=useRef(Array.from({length:10},()=>new Animated.ValueXY())).current,dSc=useRef(Array.from({length:10},()=>new Animated.Value(1))).current;
// // //   const dPR=useRef(Array.from({length:10},(_,i)=>PanResponder.create({
// // //     onStartShouldSetPanResponder:()=>!goneR.current.includes(i),onPanResponderGrant:()=>setHand(false),
// // //     onPanResponderMove:Animated.event([null,{dx:dPan[i].x,dy:dPan[i].y}],{useNativeDriver:false}),
// // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current;if(!l)return;const to=l.target??1,el=l.items[i],fr=l.items[to];
// // //       if(l.mode==='combine'){
// // //         const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;
// // //         const j=l.items.findIndex((o:any,k:number)=>k!==i&&o.drag&&Math.hypot(cx-(o.x+o.w/2),cy-(o.y+o.w/2))<o.w*0.85);
// // //         if(j<0){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// // //         const a=Math.min(i,j),b=Math.max(i,j),A=l.items[a],B=l.items[b],r=await send({from:a,to:b});
// // //         if(r?.correct){setMerged({x:(A.x+B.x)/2+A.w/2-52,y:(A.y+B.y)/2+A.w/2-52,t:r.result??'',a,b});setDone(true);setTimeout(()=>win(r),1500)}
// // //         else{doShake();flash('Not quite. Try again!');Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start()}
// // //         return}
// // //       let ok=false;
// // //       if(l.mode==='away')ok=Math.hypot(g.dx,g.dy)>80;
// // //       else{const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;ok=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w}
// // //       if(!ok){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// // //       goneR.current=[...goneR.current,i];
// // //       if(l.mode==='feed')Animated.parallel([Animated.timing(dPan[i],{toValue:{x:fr.x+fr.w/2-(el.x+el.w/2),y:fr.y+fr.w*0.4-(el.y+el.w/2)},duration:350,useNativeDriver:false}),Animated.timing(dSc[i],{toValue:0.05,duration:350,useNativeDriver:false})]).start();
// // //       const need=l.items.map((it:any,k:number)=>it.drag?k:-1).filter((k:number)=>k>=0);
// // //       if(need.every((k:number)=>goneR.current.includes(k))){const r=await send({from:0,to});
// // //         if(r?.correct){setDone(true);if(l.mode==='away')setBloom(true);setTimeout(()=>win(r),l.mode==='away'?2200:900)}}
// // //     }}))).current;
// // //   // drag level: item 0 -> item lv.target
// // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to];
// // //       const cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// // //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// // //         setOpen(true);
// // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // //         setTimeout(()=>win(r),1100);return}}
// // //       else if(hit)flash('Open the fridge first!');
// // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);stats.current.hints+=1;setHints(r.hints);const h=r.hint;
// // //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // //   // FIX: reward kind is typed as 'video' | 'gift' (api.reward only accepts these two)
// // //   const reward=async(k:'video'|'gift')=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);win(r,true)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // //   if(!lv)return <Stage bg="#f1dcc0"><View style={bd.wall}><View style={bd.frame}><View style={[bd.board,{justifyContent:'center'}]}>
// // //     <Text style={bd.load}>{note||('Loading level '+n+'...')}</Text></View></View></View></Stage>;

// // //   const board=lv.bg==='board';

// // //   const stage=<View style={[st.stage,board&&{height:290,marginTop:0},lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
// // //       {(lv.items||[]).map((it:any,i:number)=>{if(board&&(it.k==='duster'||it.k==='chalk'))return null;
// // //         const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
// // //         const body=<A w={it.w} t={it.t} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:(merged&&(i===merged.a||i===merged.b))?0:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
// // //         if(it.drag&&(lv.mode==='away'||lv.mode==='feed'||lv.mode==='combine'))return <Animated.View key={i} {...dPR[i].panHandlers} style={[pos,{zIndex:5+i,transform:[...dPan[i].getTranslateTransform(),{scale:dSc[i]}]}]}>{body}</Animated.View>;
// // //         if(lv.type==='choice'&&!lv.options&&!lv.input)return <PopTouch key={i} style={pos} delay={i*90} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</PopTouch>;
// // //         if(lv.type==='taps'&&it.k==='cloud')return <PopTouch key={i} style={pos} onPress={cloud}>{body}</PopTouch>;
// // //         if(lv.type==='drag'&&!lv.mode&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // //       {merged&&<View pointerEvents="none" style={{position:'absolute',left:merged.x,top:merged.y,width:104,height:104,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:84,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{merged.t}</Text></View>}
// // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // //     </View>;

// // //   // ---------- chalkboard layout ----------
// // //   if(board)return <Stage bg="#f1dcc0"><View style={bd.wall}>
// // //     <View style={bd.frame}><View style={bd.board}>
// // //       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
// // //       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
// // //       <View pointerEvents="none" style={[bd.smudge,{bottom:150,left:20,width:200,height:90,transform:[{rotate:'6deg'}]}]}/>
// // //       <View pointerEvents="none" style={bd.sheen}/>

// // //       {/* top bar */}
// // //       <View style={bd.top}>
// // //         <View style={bd.topL}><Round n="home" onPress={onHome}/><Round n="gear"/></View>
// // //         <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
// // //           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
// // //           <View style={bd.sign}>
// // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
// // //             <Text style={bd.signt}>{'LEVEL '+n}</Text>
// // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
// // //           </View>
// // //         </Animated.View>
// // //         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
// // //       </View>

// // //       <Animated.Text style={[bd.q,{opacity:qIn,transform:[{translateY:qY}]}]}>{lv.question}</Animated.Text>

// // //       <Animated.View style={{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:240,transform:[{translateX:shake}]}}>{stage}</Animated.View>

// // //       {/* draggable eraser + pencil */}
// // //       <View pointerEvents="box-none" style={bd.decor}>
// // //         <FreeDrag><View style={{transform:[{rotate:'-8deg'}]}}><Eraser w={84}/></View></FreeDrag>
// // //         <FreeDrag><View style={{transform:[{rotate:'2deg'}]}}><Pencil w={150}/></View></FreeDrag>
// // //       </View>

// // //       {/* hint / video / skip */}
// // //       <View style={bd.actions}>
// // //         <View style={bd.acol}>
// // //           <Animated.View style={{transform:[{scale:pulseS}]}}><PopTouch inner={bd.hintBtn} onPress={hint}><Icon n="search" s={34}/></PopTouch></Animated.View>
// // //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
// // //         </View>
// // //         <View style={bd.acol}>
// // //           <PopTouch inner={bd.videoBtn} onPress={()=>reward('video')}><Icon n="film" s={40}/></PopTouch>
// // //           <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
// // //         </View>
// // //         <View style={bd.acol}>
// // //           <PopTouch inner={bd.skipBtn} onPress={skip}><Icon n="play" s={36}/></PopTouch>
// // //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
// // //         </View>
// // //       </View>

// // //       {/* chalk tray */}
// // //       <View style={bd.ledge}>
// // //         {[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:6+i*6,height:1,backgroundColor:'rgba(90,45,10,0.25)'}}/>)}
// // //         <View style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>
// // //         <View style={{position:'absolute',left:'40%',bottom:20}}><Chalk w={78}/></View>
// // //         <View style={{position:'absolute',left:'64%',bottom:22,transform:[{rotate:'-8deg'}]}}><Chalk w={54}/></View>
// // //       </View>
// // //       {!!note&&<Text style={bd.note}>{note}</Text>}
// // //     </View></View>
// // //     <View style={bd.wallBottom}/>
// // //   </View></Stage>;

// // //   // ---------- notebook layout (other levels) ----------
// // //   return <Stage bg="#e8c9a0"><Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // //     <Text style={st.ql}>{lv.question}</Text>
// // //     <Animated.View style={{transform:[{translateX:shake}]}}>{stage}</Animated.View>
// // //     {lv.options&&<View style={st.opts}>{lv.options.map((o:number)=>
// // //       <TouchableOpacity key={o} disabled={done||hidOpt.includes(o)} onPress={()=>pickOpt(o)}
// // //         style={[st.opt,{backgroundColor:sel===o?GREEN:'#fff',opacity:hidOpt.includes(o)?0.2:1}]}><Text style={st.ot}>{o}</Text></TouchableOpacity>)}</View>}
// // //     {lv.input==='counter'&&<View style={st.cwrap}>
// // //       <View style={st.crow}>
// // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={st.cbt}>−</Text></TouchableOpacity>
// // //         <View style={st.cnumBox}><Text style={st.cnum}>{count}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={64}/></View>}</View>
// // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={st.cbt}>+</Text></TouchableOpacity>
// // //       </View>
// // //       <TouchableOpacity style={st.submit} disabled={done} onPress={()=>submitNum(count)}><Text style={st.subt}>SUBMIT</Text></TouchableOpacity>
// // //     </View>}
// // //     {lv.input==='keypad'&&<View style={st.kwrap}>
// // //       <View style={st.krow}>
// // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={st.kst}>✕</Text></TouchableOpacity>
// // //         <View style={st.kpill}><Text style={st.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={52}/></View>}</View>
// // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={()=>submitNum(Number(typed))}><Text style={st.kst}>✓</Text></TouchableOpacity>
// // //       </View>
// // //       {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={st.krow}>{row.map(d=>
// // //         <TouchableOpacity key={d} style={st.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,2))}><Text style={st.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
// // //     </View>}
// // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // //   </Paper></Stage>}

// // // /* ---------- styles ---------- */
// // // const bd=StyleSheet.create({
// // //   wall:{flex:1,backgroundColor:'#f1dcc0'},
// // //   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:8,backgroundColor:'#1f5b44',overflow:'hidden'},
// // //   board:{flex:1,alignItems:'center'},
// // //   load:{fontFamily:F,fontSize:22,color:CHALK},
// // //   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
// // //   sheen:{position:'absolute',left:0,right:0,top:0,height:120,backgroundColor:'rgba(255,255,255,0.04)'},
// // //   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
// // //   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
// // //   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
// // //   signWrap:{alignItems:'center',paddingTop:14},
// // //   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
// // //   sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
// // //   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
// // //   dashes:{gap:4,justifyContent:'center'},dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
// // //   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
// // //   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},
// // //   q:{fontFamily:F,fontSize:25,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
// // //   decor:{position:'absolute',zIndex:30,elevation:30,left:0,right:0,bottom:160,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingHorizontal:40},
// // //   actions:{position:'absolute',left:0,right:0,bottom:62,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
// // //   acol:{alignItems:'center'},
// // //   lblRow:{flexDirection:'row',alignItems:'center',gap:3,height:20,marginTop:4},
// // //   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
// // //   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// // //   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // //   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},
// // //   note:{position:'absolute',bottom:40,alignSelf:'center',fontFamily:F,fontSize:17,color:'#ffb4a8'},
// // //   wallBottom:{height:18}});

// // // const st=StyleSheet.create({
// // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // //   opts:{flexDirection:'row',gap:12,marginTop:6},
// // //   opt:{width:54,height:54,borderRadius:16,borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},ot:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK},
// // //   cwrap:{alignItems:'center',marginTop:4},crow:{flexDirection:'row',alignItems:'center',gap:14},
// // //   cbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#5ba8d0',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},cbt:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK,lineHeight:30},
// // //   cnumBox:{minWidth:60,height:44,alignItems:'center',justifyContent:'center'},cnum:{fontFamily:F,fontSize:34,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-8,alignItems:'center'},
// // //   submit:{marginTop:12,paddingHorizontal:26,paddingVertical:8,borderRadius:18,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff'},subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // //   kwrap:{alignItems:'center',gap:10,marginTop:-60},krow:{flexDirection:'row',alignItems:'center',gap:8},
// // //   kside:{width:36,height:36,borderRadius:18,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
// // //   kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // //   kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
// // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2}});
// // import React,{useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Pressable,Animated,PanResponder,StyleSheet} from 'react-native';
// // import Svg,{Rect,Path,Circle,Polygon,Line} from 'react-native-svg';
// // import * as api from './api';
// // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Icon} from './Art';
// // import {PointerHand} from './CelebrationHands';
// // import {F,INK,Stage,Coin,loop} from './BTShared';

// // const GREEN='#c5f158',CHALK='#f6f4ea';

// // /* ---------- chalkboard art ---------- */
// // // big chalk number inside a faint dashed chalk ring
// // const Num=({w,t}:any)=><View style={{width:w,height:w,alignItems:'center',justifyContent:'center'}}>
// //   <Svg width={w} height={w} viewBox="0 0 100 100" style={{position:'absolute'}}>
// //     <Circle cx="50" cy="50" r="46" stroke="rgba(246,244,234,0.3)" strokeWidth="2.5" strokeDasharray="5 7" fill="rgba(255,255,255,0.04)"/></Svg>
// //   <Text style={{fontFamily:F,fontSize:w*0.78,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{t}</Text></View>;
// // const Duster=({w}:any)=><Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>;
// // const Chalk=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>;
// // const Eraser=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#f4f4f0" stroke="#d9d9d4" strokeWidth="2"/><Path d="M4 20 Q4 8 16 8 H70 L52 54 H16 Q4 54 4 42 Z" fill="#2ab4d9"/><Path d="M12 15 H60" stroke="#8fe0f2" strokeWidth="3" strokeLinecap="round"/></Svg>;
// // const Pencil=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke="#c9985a" strokeWidth="1"/><Polygon points="2,15 10,11.5 10,18.5" fill="#333"/><Rect x="26" y="4" width="84" height="22" fill="#2fa86f"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Line x1="28" y1="19" x2="108" y2="19" stroke="#1f7a4e" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#9a9a9a"/><Line x1="116" y1="3" x2="116" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Line x1="124" y1="3" x2="124" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#f4f2ea"/></Svg>;

// // function FreeDrag({children}:any){
// //   const pan=useRef(new Animated.ValueXY()).current;
// //   const pr=useRef(PanResponder.create({
// //     onStartShouldSetPanResponder:()=>true,
// //     onPanResponderGrant:()=>{pan.extractOffset()},
// //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// //     onPanResponderRelease:()=>{pan.flattenOffset()}})).current;
// //   return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// // // pops in on mount, squishes when pressed. style = outer (position), inner = visual style
// // function PopTouch({style,inner,onPress,disabled,delay=0,children}:any){
// //   const e=useRef(new Animated.Value(0)).current,s=useRef(new Animated.Value(1)).current;
// //   useEffect(()=>{Animated.sequence([Animated.delay(delay),Animated.spring(e,{toValue:1,friction:5,tension:90,useNativeDriver:true})]).start()},[]);
// //   const to=(v:number)=>Animated.spring(s,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
// //   return <Pressable disabled={disabled} onPress={onPress} onPressIn={()=>to(0.88)} onPressOut={()=>to(1)} style={style}>
// //     <Animated.View style={[inner,{opacity:e,transform:[{scale:Animated.multiply(e,s)}]}]}>{children}</Animated.View></Pressable>}

// // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat,num:Num,duster:Duster,chalk:Chalk};

// // /* ---------- notebook layout pieces (non-board levels) ---------- */
// // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// //   <View style={st.wood}><View style={st.pink}/>
// //     <View style={st.paper}>
// //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// //       <View style={st.body}>{children}</View>{bottom}
// //     </View></View>);
// // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // /* =====================  GAME SCREEN  ===================== */
// // export default function BTGameScreen({n,player,hints,setHints,onWin,onHome}:any){
// //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
// //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// //   const shake=useRef(new Animated.Value(0)).current,sway=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,qIn=useRef(new Animated.Value(0)).current;
// //   const stats=useRef({tries:0,hints:0});   // sent to the congrats screen -> backend (stars / score)
// //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();
// //   // level finished: save stars / score / attempts in brain_twist_progress, then open the congrats screen
// //   const win=(r:any,skipped?:boolean)=>{
// //     const s={tries:Math.max(1,stats.current.tries),hints:stats.current.hints,skipped:!!skipped};
// //     api.complete(player.id,n,s).catch((e:any)=>console.log('[BrainTwist] complete failed:',e?.message));
// //     onWin(r,s)};
// //   const send=async(a:any)=>{stats.current.tries+=1;try{return await api.answer(n,player.id,a)}catch(e){stats.current.tries-=1;flash('Network error');return null}};
// //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start();
// //     loop(sway,1800);loop(pulse,900)},[]);
// //   useEffect(()=>{if(lv)Animated.spring(qIn,{toValue:1,friction:6,tension:70,useNativeDriver:true}).start()},[!!lv]);
// //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']}),
// //     pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.09]}),
// //     qY=qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]});

// //   // choice level: tap an item (answer = item index)
// //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// //     if(r.correct){setDone(true);setTimeout(()=>win(r),1000)}else{doShake();setTimeout(()=>setMark(null),800)}};
// //   // choice level with number options
// //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>win(r),900)}else{doShake();flash('Not quite. Try again!')}};
// //   // counter / keypad levels
// //   const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
// //     if(r.correct){setOv('check');setDone(true);setTimeout(()=>win(r),1000)}
// //     else{doShake();setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
// //   // old tap-the-cloud level
// //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&win(r)},2800)};

// //   // multi-drag levels (combine / away / feed)
// //   const[merged,setMerged]=useState<any>(null);
// //   const goneR=useRef<number[]>([]),dPan=useRef(Array.from({length:10},()=>new Animated.ValueXY())).current,dSc=useRef(Array.from({length:10},()=>new Animated.Value(1))).current;
// //   const dPR=useRef(Array.from({length:10},(_,i)=>PanResponder.create({
// //     onStartShouldSetPanResponder:()=>!goneR.current.includes(i),onPanResponderGrant:()=>setHand(false),
// //     onPanResponderMove:Animated.event([null,{dx:dPan[i].x,dy:dPan[i].y}],{useNativeDriver:false}),
// //     onPanResponderRelease:async(_,g)=>{const l=lvR.current;if(!l)return;const to=l.target??1,el=l.items[i],fr=l.items[to];
// //       if(l.mode==='combine'){
// //         const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;
// //         const j=l.items.findIndex((o:any,k:number)=>k!==i&&o.drag&&Math.hypot(cx-(o.x+o.w/2),cy-(o.y+o.w/2))<o.w*0.85);
// //         if(j<0){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// //         const a=Math.min(i,j),b=Math.max(i,j),A=l.items[a],B=l.items[b],r=await send({from:a,to:b});
// //         if(r?.correct){setMerged({x:(A.x+B.x)/2+A.w/2-52,y:(A.y+B.y)/2+A.w/2-52,t:r.result??'',a,b});setDone(true);setTimeout(()=>win(r),1500)}
// //         else{doShake();flash('Not quite. Try again!');Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start()}
// //         return}
// //       let ok=false;
// //       if(l.mode==='away')ok=Math.hypot(g.dx,g.dy)>80;
// //       else{const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;ok=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w}
// //       if(!ok){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// //       goneR.current=[...goneR.current,i];
// //       if(l.mode==='feed')Animated.parallel([Animated.timing(dPan[i],{toValue:{x:fr.x+fr.w/2-(el.x+el.w/2),y:fr.y+fr.w*0.4-(el.y+el.w/2)},duration:350,useNativeDriver:false}),Animated.timing(dSc[i],{toValue:0.05,duration:350,useNativeDriver:false})]).start();
// //       const need=l.items.map((it:any,k:number)=>it.drag?k:-1).filter((k:number)=>k>=0);
// //       if(need.every((k:number)=>goneR.current.includes(k))){const r=await send({from:0,to});
// //         if(r?.correct){setDone(true);if(l.mode==='away')setBloom(true);setTimeout(()=>win(r),l.mode==='away'?2200:900)}}
// //     }}))).current;
// //   // drag level: item 0 -> item lv.target
// //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to];
// //       const cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// //         setOpen(true);
// //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// //         setTimeout(()=>win(r),1100);return}}
// //       else if(hit)flash('Open the fridge first!');
// //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);stats.current.hints+=1;setHints(r.hints);const h=r.hint;
// //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// //   // reward kind is typed as 'video' | 'gift' (api.reward only accepts these two)
// //   const reward=async(k:'video'|'gift')=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);win(r,true)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// //   if(!lv)return <Stage bg="#f1dcc0"><View style={bd.wall}><View style={bd.frame}><View style={[bd.board,{justifyContent:'center'}]}>
// //     <Text style={bd.load}>{note||('Loading level '+n+'...')}</Text></View></View></View></Stage>;

// //   const board=lv.bg==='board';

// //   const stage=<View style={[st.stage,board&&{height:290,marginTop:0},lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
// //       {(lv.items||[]).map((it:any,i:number)=>{if(board&&(it.k==='duster'||it.k==='chalk'))return null;
// //         const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
// //         const body=<A w={it.w} t={it.t} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:(merged&&(i===merged.a||i===merged.b))?0:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
// //         if(it.drag&&(lv.mode==='away'||lv.mode==='feed'||lv.mode==='combine'))return <Animated.View key={i} {...dPR[i].panHandlers} style={[pos,{zIndex:5+i,transform:[...dPan[i].getTranslateTransform(),{scale:dSc[i]}]}]}>{body}</Animated.View>;
// //         if(lv.type==='choice'&&!lv.options&&!lv.input)return <PopTouch key={i} style={pos} delay={i*90} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</PopTouch>;
// //         if(lv.type==='taps'&&it.k==='cloud')return <PopTouch key={i} style={pos} onPress={cloud}>{body}</PopTouch>;
// //         if(lv.type==='drag'&&!lv.mode&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// //       {merged&&<View pointerEvents="none" style={{position:'absolute',left:merged.x,top:merged.y,width:104,height:104,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:84,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{merged.t}</Text></View>}
// //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// //     </View>;

// //   // ---------- chalkboard layout ----------
// //   if(board)return <Stage bg="#f1dcc0"><View style={bd.wall}>
// //     <View style={bd.frame}><View style={bd.board}>
// //       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
// //       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
// //       <View pointerEvents="none" style={[bd.smudge,{bottom:150,left:20,width:200,height:90,transform:[{rotate:'6deg'}]}]}/>
// //       <View pointerEvents="none" style={bd.sheen}/>

// //       {/* top bar */}
// //       <View style={bd.top}>
// //         <View style={bd.topL}><Round n="home" onPress={onHome}/><Round n="gear"/></View>
// //         <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
// //           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
// //           <View style={bd.sign}>
// //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
// //             <Text style={bd.signt}>{'LEVEL '+n}</Text>
// //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
// //           </View>
// //         </Animated.View>
// //         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
// //       </View>

// //       <Animated.Text style={[bd.q,{opacity:qIn,transform:[{translateY:qY}]}]}>{lv.question}</Animated.Text>

// //       <Animated.View style={{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:240,transform:[{translateX:shake}]}}>{stage}</Animated.View>

// //       {/* draggable eraser + pencil */}
// //       <View pointerEvents="box-none" style={bd.decor}>
// //         <FreeDrag><View style={{transform:[{rotate:'-8deg'}]}}><Eraser w={84}/></View></FreeDrag>
// //         <FreeDrag><View style={{transform:[{rotate:'2deg'}]}}><Pencil w={150}/></View></FreeDrag>
// //       </View>

// //       {/* hint / video / skip */}
// //       <View style={bd.actions}>
// //         <View style={bd.acol}>
// //           <Animated.View style={{transform:[{scale:pulseS}]}}><PopTouch inner={bd.hintBtn} onPress={hint}><Icon n="search" s={34}/></PopTouch></Animated.View>
// //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
// //         </View>
// //         <View style={bd.acol}>
// //           <PopTouch inner={bd.videoBtn} onPress={()=>reward('video')}><Icon n="film" s={40}/></PopTouch>
// //           <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
// //         </View>
// //         <View style={bd.acol}>
// //           <PopTouch inner={bd.skipBtn} onPress={skip}><Icon n="play" s={36}/></PopTouch>
// //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
// //         </View>
// //       </View>

// //       {/* chalk tray */}
// //       <View style={bd.ledge}>
// //         {[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:6+i*6,height:1,backgroundColor:'rgba(90,45,10,0.25)'}}/>)}
// //         <View style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>
// //         <View style={{position:'absolute',left:'40%',bottom:20}}><Chalk w={78}/></View>
// //         <View style={{position:'absolute',left:'64%',bottom:22,transform:[{rotate:'-8deg'}]}}><Chalk w={54}/></View>
// //       </View>
// //       {!!note&&<Text style={bd.note}>{note}</Text>}
// //     </View></View>
// //     <View style={bd.wallBottom}/>
// //   </View></Stage>;

// //   // ---------- notebook layout (other levels) ----------
// //   return <Stage bg="#e8c9a0"><Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// //     <Text style={st.ql}>{lv.question}</Text>
// //     <Animated.View style={{transform:[{translateX:shake}]}}>{stage}</Animated.View>
// //     {lv.options&&<View style={st.opts}>{lv.options.map((o:number)=>
// //       <TouchableOpacity key={o} disabled={done||hidOpt.includes(o)} onPress={()=>pickOpt(o)}
// //         style={[st.opt,{backgroundColor:sel===o?GREEN:'#fff',opacity:hidOpt.includes(o)?0.2:1}]}><Text style={st.ot}>{o}</Text></TouchableOpacity>)}</View>}
// //     {lv.input==='counter'&&<View style={st.cwrap}>
// //       <View style={st.crow}>
// //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={st.cbt}>−</Text></TouchableOpacity>
// //         <View style={st.cnumBox}><Text style={st.cnum}>{count}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={64}/></View>}</View>
// //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={st.cbt}>+</Text></TouchableOpacity>
// //       </View>
// //       <TouchableOpacity style={st.submit} disabled={done} onPress={()=>submitNum(count)}><Text style={st.subt}>SUBMIT</Text></TouchableOpacity>
// //     </View>}
// //     {lv.input==='keypad'&&<View style={st.kwrap}>
// //       <View style={st.krow}>
// //         <TouchableOpacity style={[st.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={st.kst}>✕</Text></TouchableOpacity>
// //         <View style={st.kpill}><Text style={st.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={52}/></View>}</View>
// //         <TouchableOpacity style={[st.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={()=>submitNum(Number(typed))}><Text style={st.kst}>✓</Text></TouchableOpacity>
// //       </View>
// //       {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={st.krow}>{row.map(d=>
// //         <TouchableOpacity key={d} style={st.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,2))}><Text style={st.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
// //     </View>}
// //     {!!note&&<Text style={st.note}>{note}</Text>}
// //   </Paper></Stage>}

// // /* ---------- styles ---------- */
// // const bd=StyleSheet.create({
// //   wall:{flex:1,backgroundColor:'#f1dcc0'},
// //   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:8,backgroundColor:'#1f5b44',overflow:'hidden'},
// //   board:{flex:1,alignItems:'center'},
// //   load:{fontFamily:F,fontSize:22,color:CHALK},
// //   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
// //   sheen:{position:'absolute',left:0,right:0,top:0,height:120,backgroundColor:'rgba(255,255,255,0.04)'},
// //   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
// //   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
// //   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
// //   signWrap:{alignItems:'center',paddingTop:14},
// //   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
// //   sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
// //   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
// //   dashes:{gap:4,justifyContent:'center'},dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
// //   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
// //   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},
// //   q:{fontFamily:F,fontSize:25,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
// //   decor:{position:'absolute',zIndex:30,elevation:30,left:0,right:0,bottom:160,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingHorizontal:40},
// //   actions:{position:'absolute',left:0,right:0,bottom:62,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
// //   acol:{alignItems:'center'},
// //   lblRow:{flexDirection:'row',alignItems:'center',gap:3,height:20,marginTop:4},
// //   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
// //   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// //   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// //   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},
// //   note:{position:'absolute',bottom:40,alignSelf:'center',fontFamily:F,fontSize:17,color:'#ffb4a8'},
// //   wallBottom:{height:18}});

// // const st=StyleSheet.create({
// //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// //   opts:{flexDirection:'row',gap:12,marginTop:6},
// //   opt:{width:54,height:54,borderRadius:16,borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},ot:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK},
// //   cwrap:{alignItems:'center',marginTop:4},crow:{flexDirection:'row',alignItems:'center',gap:14},
// //   cbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#5ba8d0',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},cbt:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK,lineHeight:30},
// //   cnumBox:{minWidth:60,height:44,alignItems:'center',justifyContent:'center'},cnum:{fontFamily:F,fontSize:34,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-8,alignItems:'center'},
// //   submit:{marginTop:12,paddingHorizontal:26,paddingVertical:8,borderRadius:18,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff'},subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// //   kwrap:{alignItems:'center',gap:10,marginTop:-60},krow:{flexDirection:'row',alignItems:'center',gap:8},
// //   kside:{width:36,height:36,borderRadius:18,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
// //   kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// //   kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
// //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2}});
// import React,{useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Pressable,Animated,PanResponder,StyleSheet} from 'react-native';
// import Svg,{Rect,Path,Circle,Polygon,Line} from 'react-native-svg';
// import * as api from './api';
// import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Icon} from './Art';
// import {PointerHand} from './CelebrationHands';
// import {F,INK,Stage,Coin,loop} from './BTShared';
// import BTLevel2Screen from './Btlevel2screen';

// const GREEN='#c5f158',CHALK='#f6f4ea';

// /* ---------- chalkboard art ---------- */
// // big chalk number inside a faint dashed chalk ring
// const Num=({w,t}:any)=><View style={{width:w,height:w,alignItems:'center',justifyContent:'center'}}>
//   <Svg width={w} height={w} viewBox="0 0 100 100" style={{position:'absolute'}}>
//     <Circle cx="50" cy="50" r="46" stroke="rgba(246,244,234,0.3)" strokeWidth="2.5" strokeDasharray="5 7" fill="rgba(255,255,255,0.04)"/></Svg>
//   <Text style={{fontFamily:F,fontSize:w*0.78,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{t}</Text></View>;
// const Duster=({w}:any)=><Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>;
// const Chalk=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>;
// const Eraser=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#f4f4f0" stroke="#d9d9d4" strokeWidth="2"/><Path d="M4 20 Q4 8 16 8 H70 L52 54 H16 Q4 54 4 42 Z" fill="#2ab4d9"/><Path d="M12 15 H60" stroke="#8fe0f2" strokeWidth="3" strokeLinecap="round"/></Svg>;
// const Pencil=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke="#c9985a" strokeWidth="1"/><Polygon points="2,15 10,11.5 10,18.5" fill="#333"/><Rect x="26" y="4" width="84" height="22" fill="#2fa86f"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Line x1="28" y1="19" x2="108" y2="19" stroke="#1f7a4e" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#9a9a9a"/><Line x1="116" y1="3" x2="116" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Line x1="124" y1="3" x2="124" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#f4f2ea"/></Svg>;

// function FreeDrag({children}:any){
//   const pan=useRef(new Animated.ValueXY()).current;
//   const pr=useRef(PanResponder.create({
//     onStartShouldSetPanResponder:()=>true,
//     onPanResponderGrant:()=>{pan.extractOffset()},
//     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
//     onPanResponderRelease:()=>{pan.flattenOffset()}})).current;
//   return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// // pops in on mount, squishes when pressed. style = outer (position), inner = visual style
// function PopTouch({style,inner,onPress,disabled,delay=0,children}:any){
//   const e=useRef(new Animated.Value(0)).current,s=useRef(new Animated.Value(1)).current;
//   useEffect(()=>{Animated.sequence([Animated.delay(delay),Animated.spring(e,{toValue:1,friction:5,tension:90,useNativeDriver:true})]).start()},[]);
//   const to=(v:number)=>Animated.spring(s,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
//   return <Pressable disabled={disabled} onPress={onPress} onPressIn={()=>to(0.88)} onPressOut={()=>to(1)} style={style}>
//     <Animated.View style={[inner,{opacity:e,transform:[{scale:Animated.multiply(e,s)}]}]}>{children}</Animated.View></Pressable>}

// const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat,num:Num,duster:Duster,chalk:Chalk};

// /* ---------- notebook layout pieces (non-board levels) ---------- */
// const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// const Paper=({title,hints,onHome,bottom,children}:any)=>(
//   <View style={st.wood}><View style={st.pink}/>
//     <View style={st.paper}>
//       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
//       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
//       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
//         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
//         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
//       <View style={st.body}>{children}</View>{bottom}
//     </View></View>);
// const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
//   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
//     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// /* =====================  GAME SCREEN  ===================== */
// function BTGameScreenInner({n,player,hints,setHints,onWin,onHome}:any){
//   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
//     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
//     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
//   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
//   const shake=useRef(new Animated.Value(0)).current,sway=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,qIn=useRef(new Animated.Value(0)).current;
//   const stats=useRef({tries:0,hints:0});   // sent to the congrats screen -> backend (stars / score)
//   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
//   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
//   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();
//   // level finished: save stars / score / attempts in brain_twist_progress, then open the congrats screen
//   const win=(r:any,skipped?:boolean)=>{
//     const s={tries:Math.max(1,stats.current.tries),hints:stats.current.hints,skipped:!!skipped};
//     api.complete(player.id,n,s).catch((e:any)=>console.log('[BrainTwist] complete failed:',e?.message));
//     onWin(r,s)};
//   const send=async(a:any)=>{stats.current.tries+=1;try{return await api.answer(n,player.id,a)}catch(e){stats.current.tries-=1;flash('Network error');return null}};
//   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
//     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start();
//     loop(sway,1800);loop(pulse,900)},[]);
//   useEffect(()=>{if(lv)Animated.spring(qIn,{toValue:1,friction:6,tension:70,useNativeDriver:true}).start()},[!!lv]);
//   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']}),
//     pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.09]}),
//     qY=qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]});

//   // choice level: tap an item (answer = item index)
//   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
//     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
//     if(r.correct){setDone(true);setTimeout(()=>win(r),1000)}else{doShake();setTimeout(()=>setMark(null),800)}};
//   // choice level with number options
//   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
//     if(r.correct){setSel(o);setDone(true);setTimeout(()=>win(r),900)}else{doShake();flash('Not quite. Try again!')}};
//   // counter / keypad levels
//   const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
//     if(r.correct){setOv('check');setDone(true);setTimeout(()=>win(r),1000)}
//     else{doShake();setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
//   // old tap-the-cloud level
//   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&win(r)},2800)};

//   // multi-drag levels (combine / away / feed)
//   const[merged,setMerged]=useState<any>(null);
//   const goneR=useRef<number[]>([]),dPan=useRef(Array.from({length:10},()=>new Animated.ValueXY())).current,dSc=useRef(Array.from({length:10},()=>new Animated.Value(1))).current;
//   const dPR=useRef(Array.from({length:10},(_,i)=>PanResponder.create({
//     onStartShouldSetPanResponder:()=>!goneR.current.includes(i),onPanResponderGrant:()=>setHand(false),
//     onPanResponderMove:Animated.event([null,{dx:dPan[i].x,dy:dPan[i].y}],{useNativeDriver:false}),
//     onPanResponderRelease:async(_,g)=>{const l=lvR.current;if(!l)return;const to=l.target??1,el=l.items[i],fr=l.items[to];
//       if(l.mode==='combine'){
//         const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;
//         const j=l.items.findIndex((o:any,k:number)=>k!==i&&o.drag&&Math.hypot(cx-(o.x+o.w/2),cy-(o.y+o.w/2))<o.w*0.85);
//         if(j<0){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
//         const a=Math.min(i,j),b=Math.max(i,j),A=l.items[a],B=l.items[b],r=await send({from:a,to:b});
//         if(r?.correct){setMerged({x:(A.x+B.x)/2+A.w/2-52,y:(A.y+B.y)/2+A.w/2-52,t:r.result??'',a,b});setDone(true);setTimeout(()=>win(r),1500)}
//         else{doShake();flash('Not quite. Try again!');Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start()}
//         return}
//       let ok=false;
//       if(l.mode==='away')ok=Math.hypot(g.dx,g.dy)>80;
//       else{const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;ok=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w}
//       if(!ok){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
//       goneR.current=[...goneR.current,i];
//       if(l.mode==='feed')Animated.parallel([Animated.timing(dPan[i],{toValue:{x:fr.x+fr.w/2-(el.x+el.w/2),y:fr.y+fr.w*0.4-(el.y+el.w/2)},duration:350,useNativeDriver:false}),Animated.timing(dSc[i],{toValue:0.05,duration:350,useNativeDriver:false})]).start();
//       const need=l.items.map((it:any,k:number)=>it.drag?k:-1).filter((k:number)=>k>=0);
//       if(need.every((k:number)=>goneR.current.includes(k))){const r=await send({from:0,to});
//         if(r?.correct){setDone(true);if(l.mode==='away')setBloom(true);setTimeout(()=>win(r),l.mode==='away'?2200:900)}}
//     }}))).current;
//   // drag level: item 0 -> item lv.target
//   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
//     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
//     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to];
//       const cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
//       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
//       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
//         setOpen(true);
//         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
//         setTimeout(()=>win(r),1100);return}}
//       else if(hit)flash('Open the fridge first!');
//       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

//   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);stats.current.hints+=1;setHints(r.hints);const h=r.hint;
//     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
//   // reward kind is typed as 'video' | 'gift' (api.reward only accepts these two)
//   const reward=async(k:'video'|'gift')=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
//   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);win(r,true)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

//   if(!lv)return <Stage bg="#f1dcc0"><View style={bd.wall}><View style={bd.frame}><View style={[bd.board,{justifyContent:'center'}]}>
//     <Text style={bd.load}>{note||('Loading level '+n+'...')}</Text></View></View></View></Stage>;

//   const board=lv.bg==='board';

//   const stage=<View style={[st.stage,board&&{height:290,marginTop:0},lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
//       {(lv.items||[]).map((it:any,i:number)=>{if(board&&(it.k==='duster'||it.k==='chalk'))return null;
//         const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
//         const body=<A w={it.w} t={it.t} grey={it.grey} bloom={bloom} open={open} i={i}/>,
//         pos:any={position:'absolute',left:it.x,top:it.y,opacity:(merged&&(i===merged.a||i===merged.b))?0:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
//         if(it.drag&&(lv.mode==='away'||lv.mode==='feed'||lv.mode==='combine'))return <Animated.View key={i} {...dPR[i].panHandlers} style={[pos,{zIndex:5+i,transform:[...dPan[i].getTranslateTransform(),{scale:dSc[i]}]}]}>{body}</Animated.View>;
//         if(lv.type==='choice'&&!lv.options&&!lv.input)return <PopTouch key={i} style={pos} delay={i*90} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</PopTouch>;
//         if(lv.type==='taps'&&it.k==='cloud')return <PopTouch key={i} style={pos} onPress={cloud}>{body}</PopTouch>;
//         if(lv.type==='drag'&&!lv.mode&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
//         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
//         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
//       {merged&&<View pointerEvents="none" style={{position:'absolute',left:merged.x,top:merged.y,width:104,height:104,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:84,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{merged.t}</Text></View>}
//       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
//         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
//       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
//       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
//     </View>;

//   // ---------- chalkboard layout ----------
//   if(board)return <Stage bg="#f1dcc0"><View style={bd.wall}>
//     <View style={bd.frame}><View style={bd.board}>
//       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
//       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
//       <View pointerEvents="none" style={[bd.smudge,{bottom:150,left:20,width:200,height:90,transform:[{rotate:'6deg'}]}]}/>
//       <View pointerEvents="none" style={bd.sheen}/>

//       {/* top bar */}
//       <View style={bd.top}>
//         <View style={bd.topL}><Round n="home" onPress={onHome}/><Round n="gear"/></View>
//         <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
//           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
//           <View style={bd.sign}>
//             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
//             <Text style={bd.signt}>{'LEVEL '+n}</Text>
//             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
//           </View>
//         </Animated.View>
//         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
//       </View>

//       <Animated.Text style={[bd.q,{opacity:qIn,transform:[{translateY:qY}]}]}>{lv.question}</Animated.Text>

//       <Animated.View style={{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:240,transform:[{translateX:shake}]}}>{stage}</Animated.View>

//       {/* draggable eraser + pencil */}
//       <View pointerEvents="box-none" style={bd.decor}>
//         <FreeDrag><View style={{transform:[{rotate:'-8deg'}]}}><Eraser w={84}/></View></FreeDrag>
//         <FreeDrag><View style={{transform:[{rotate:'2deg'}]}}><Pencil w={150}/></View></FreeDrag>
//       </View>

//       {/* hint / video / skip */}
//       <View style={bd.actions}>
//         <View style={bd.acol}>
//           <Animated.View style={{transform:[{scale:pulseS}]}}><PopTouch inner={bd.hintBtn} onPress={hint}><Icon n="search" s={34}/></PopTouch></Animated.View>
//           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
//         </View>
//         <View style={bd.acol}>
//           <PopTouch inner={bd.videoBtn} onPress={()=>reward('video')}><Icon n="film" s={40}/></PopTouch>
//           <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
//         </View>
//         <View style={bd.acol}>
//           <PopTouch inner={bd.skipBtn} onPress={skip}><Icon n="play" s={36}/></PopTouch>
//           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
//         </View>
//       </View>

//       {/* chalk tray */}
//       <View style={bd.ledge}>
//         {[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:6+i*6,height:1,backgroundColor:'rgba(90,45,10,0.25)'}}/>)}
//         <View style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>
//         <View style={{position:'absolute',left:'40%',bottom:20}}><Chalk w={78}/></View>
//         <View style={{position:'absolute',left:'64%',bottom:22,transform:[{rotate:'-8deg'}]}}><Chalk w={54}/></View>
//       </View>
//       {!!note&&<Text style={bd.note}>{note}</Text>}
//     </View></View>
//     <View style={bd.wallBottom}/>
//   </View></Stage>;

//   // ---------- notebook layout (other levels) ----------
//   return <Stage bg="#e8c9a0"><Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
//     <Text style={st.ql}>{lv.question}</Text>
//     <Animated.View style={{transform:[{translateX:shake}]}}>{stage}</Animated.View>
//     {lv.options&&<View style={st.opts}>{lv.options.map((o:number)=>
//       <TouchableOpacity key={o} disabled={done||hidOpt.includes(o)} onPress={()=>pickOpt(o)}
//         style={[st.opt,{backgroundColor:sel===o?GREEN:'#fff',opacity:hidOpt.includes(o)?0.2:1}]}><Text style={st.ot}>{o}</Text></TouchableOpacity>)}</View>}
//     {lv.input==='counter'&&<View style={st.cwrap}>
//       <View style={st.crow}>
//         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={st.cbt}>−</Text></TouchableOpacity>
//         <View style={st.cnumBox}><Text style={st.cnum}>{count}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={64}/></View>}</View>
//         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={st.cbt}>+</Text></TouchableOpacity>
//       </View>
//       <TouchableOpacity style={st.submit} disabled={done} onPress={()=>submitNum(count)}><Text style={st.subt}>SUBMIT</Text></TouchableOpacity>
//     </View>}
//     {lv.input==='keypad'&&<View style={st.kwrap}>
//       <View style={st.krow}>
//         <TouchableOpacity style={[st.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={st.kst}>✕</Text></TouchableOpacity>
//         <View style={st.kpill}><Text style={st.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={52}/></View>}</View>
//         <TouchableOpacity style={[st.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={()=>submitNum(Number(typed))}><Text style={st.kst}>✓</Text></TouchableOpacity>
//       </View>
//       {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={st.krow}>{row.map(d=>
//         <TouchableOpacity key={d} style={st.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,2))}><Text style={st.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
//     </View>}
//     {!!note&&<Text style={st.note}>{note}</Text>}
//   </Paper></Stage>}

// /* ---------- styles ---------- */
// const bd=StyleSheet.create({
//   wall:{flex:1,backgroundColor:'#f1dcc0'},
//   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:8,backgroundColor:'#1f5b44',overflow:'hidden'},
//   board:{flex:1,alignItems:'center'},
//   load:{fontFamily:F,fontSize:22,color:CHALK},
//   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
//   sheen:{position:'absolute',left:0,right:0,top:0,height:120,backgroundColor:'rgba(255,255,255,0.04)'},
//   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
//   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
//   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
//   signWrap:{alignItems:'center',paddingTop:14},
//   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
//   sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
//   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
//   dashes:{gap:4,justifyContent:'center'},dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
//   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
//   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},
//   q:{fontFamily:F,fontSize:25,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
//   decor:{position:'absolute',zIndex:30,elevation:30,left:0,right:0,bottom:160,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingHorizontal:40},
//   actions:{position:'absolute',left:0,right:0,bottom:62,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
//   acol:{alignItems:'center'},
//   lblRow:{flexDirection:'row',alignItems:'center',gap:3,height:20,marginTop:4},
//   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
//   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
//   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
//   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
//   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},
//   note:{position:'absolute',bottom:40,alignSelf:'center',fontFamily:F,fontSize:17,color:'#ffb4a8'},
//   wallBottom:{height:18}});

// const st=StyleSheet.create({
//   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
//   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
//   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
//   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
//   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
//   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
//   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
//   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
//   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
//   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
//   opts:{flexDirection:'row',gap:12,marginTop:6},
//   opt:{width:54,height:54,borderRadius:16,borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},ot:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK},
//   cwrap:{alignItems:'center',marginTop:4},crow:{flexDirection:'row',alignItems:'center',gap:14},
//   cbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#5ba8d0',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},cbt:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK,lineHeight:30},
//   cnumBox:{minWidth:60,height:44,alignItems:'center',justifyContent:'center'},cnum:{fontFamily:F,fontSize:34,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-8,alignItems:'center'},
//   submit:{marginTop:12,paddingHorizontal:26,paddingVertical:8,borderRadius:18,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff'},subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
//   kwrap:{alignItems:'center',gap:10,marginTop:-60},krow:{flexDirection:'row',alignItems:'center',gap:8},
//   kside:{width:36,height:36,borderRadius:18,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
//   kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
//   kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
//   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2}});

// /* =====================  ENTRY  =====================
//    Level 2 has its own screen + own backend routes (Braintwistlevel2routes.js).
//    Every other level uses the generic game screen above. */
// export default function BTGameScreen(props:any){
//   const {n,player,hints,onWin,onHome}=props;
//   if(n===2)return <BTLevel2Screen
//     playerId={player.id}
//     hints={hints}
//     onExit={onHome}
//     onComplete={(r:any)=>onWin(r,{tries:Math.max(1,Number(r?.attempts)||1),hints:0,skipped:false})}/>;
//   return <BTGameScreenInner {...props}/>;
// }
import React,{useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Pressable,Animated,PanResponder,StyleSheet} from 'react-native';
import Svg,{Rect,Path,Circle,Polygon,Line} from 'react-native-svg';
import * as api from './api';
import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Icon} from './Art';
import {PointerHand} from './CelebrationHands';
import {F,INK,Stage,Coin,loop} from './BTShared';
import BTLevel2Screen from './Btlevel2screen';
import {completeLevel} from './mapApi';

const GREEN='#c5f158',CHALK='#f6f4ea';

/* ---------- chalkboard art ---------- */
// big chalk number inside a faint dashed chalk ring
const Num=({w,t}:any)=><View style={{width:w,height:w,alignItems:'center',justifyContent:'center'}}>
  <Svg width={w} height={w} viewBox="0 0 100 100" style={{position:'absolute'}}>
    <Circle cx="50" cy="50" r="46" stroke="rgba(246,244,234,0.3)" strokeWidth="2.5" strokeDasharray="5 7" fill="rgba(255,255,255,0.04)"/></Svg>
  <Text style={{fontFamily:F,fontSize:w*0.78,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{t}</Text></View>;
const Duster=({w}:any)=><Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>;
const Chalk=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>;
const Eraser=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#f4f4f0" stroke="#d9d9d4" strokeWidth="2"/><Path d="M4 20 Q4 8 16 8 H70 L52 54 H16 Q4 54 4 42 Z" fill="#2ab4d9"/><Path d="M12 15 H60" stroke="#8fe0f2" strokeWidth="3" strokeLinecap="round"/></Svg>;
const Pencil=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke="#c9985a" strokeWidth="1"/><Polygon points="2,15 10,11.5 10,18.5" fill="#333"/><Rect x="26" y="4" width="84" height="22" fill="#2fa86f"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Line x1="28" y1="19" x2="108" y2="19" stroke="#1f7a4e" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#9a9a9a"/><Line x1="116" y1="3" x2="116" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Line x1="124" y1="3" x2="124" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#f4f2ea"/></Svg>;

function FreeDrag({children}:any){
  const pan=useRef(new Animated.ValueXY()).current;
  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>true,
    onPanResponderGrant:()=>{pan.extractOffset()},
    onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
    onPanResponderRelease:()=>{pan.flattenOffset()}})).current;
  return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// pops in on mount, squishes when pressed. style = outer (position), inner = visual style
function PopTouch({style,inner,onPress,disabled,delay=0,children}:any){
  const e=useRef(new Animated.Value(0)).current,s=useRef(new Animated.Value(1)).current;
  useEffect(()=>{Animated.sequence([Animated.delay(delay),Animated.spring(e,{toValue:1,friction:5,tension:90,useNativeDriver:true})]).start()},[]);
  const to=(v:number)=>Animated.spring(s,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
  return <Pressable disabled={disabled} onPress={onPress} onPressIn={()=>to(0.88)} onPressOut={()=>to(1)} style={style}>
    <Animated.View style={[inner,{opacity:e,transform:[{scale:Animated.multiply(e,s)}]}]}>{children}</Animated.View></Pressable>}

const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat,num:Num,duster:Duster,chalk:Chalk};

/* ---------- notebook layout pieces (non-board levels) ---------- */
const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
const Paper=({title,hints,onHome,bottom,children}:any)=>(
  <View style={st.wood}><View style={st.pink}/>
    <View style={st.paper}>
      <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
      {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
      <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
        {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
        <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
      <View style={st.body}>{children}</View>{bottom}
    </View></View>);
const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
  <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
    <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

/* =====================  GAME SCREEN  ===================== */
function BTGameScreenInner({n,player,hints,setHints,onWin,onHome}:any){
  const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
    [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
    [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
  const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
  const shake=useRef(new Animated.Value(0)).current,sway=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,qIn=useRef(new Animated.Value(0)).current;
  const stats=useRef({tries:0,hints:0});   // sent to the congrats screen -> backend (stars / score)
  const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
  const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();
  // level finished: save stars / score / attempts in brain_twist_progress, then open the congrats screen
  const win=(r:any,skipped?:boolean)=>{
    const s={tries:Math.max(1,stats.current.tries),hints:stats.current.hints,skipped:!!skipped};
    api.complete(player.id,n,s).catch((e:any)=>console.log('[BrainTwist] complete failed:',e?.message));
    onWin(r,s)};
  const send=async(a:any)=>{stats.current.tries+=1;try{return await api.answer(n,player.id,a)}catch(e){stats.current.tries-=1;flash('Network error');return null}};
  useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
    Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start();
    loop(sway,1800);loop(pulse,900)},[]);
  useEffect(()=>{if(lv)Animated.spring(qIn,{toValue:1,friction:6,tension:70,useNativeDriver:true}).start()},[!!lv]);
  const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']}),
    pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.09]}),
    qY=qIn.interpolate({inputRange:[0,1],outputRange:[-16,0]});

  // choice level: tap an item (answer = item index)
  const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
    setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
    if(r.correct){setDone(true);setTimeout(()=>win(r),1000)}else{doShake();setTimeout(()=>setMark(null),800)}};
  // choice level with number options
  const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
    if(r.correct){setSel(o);setDone(true);setTimeout(()=>win(r),900)}else{doShake();flash('Not quite. Try again!')}};
  // counter / keypad levels
  const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
    if(r.correct){setOv('check');setDone(true);setTimeout(()=>win(r),1000)}
    else{doShake();setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
  // old tap-the-cloud level
  const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&win(r)},2800)};

  // multi-drag levels (combine / away / feed)
  const[merged,setMerged]=useState<any>(null);
  const goneR=useRef<number[]>([]),dPan=useRef(Array.from({length:10},()=>new Animated.ValueXY())).current,dSc=useRef(Array.from({length:10},()=>new Animated.Value(1))).current;
  const dPR=useRef(Array.from({length:10},(_,i)=>PanResponder.create({
    onStartShouldSetPanResponder:()=>!goneR.current.includes(i),onPanResponderGrant:()=>setHand(false),
    onPanResponderMove:Animated.event([null,{dx:dPan[i].x,dy:dPan[i].y}],{useNativeDriver:false}),
    onPanResponderRelease:async(_,g)=>{const l=lvR.current;if(!l)return;const to=l.target??1,el=l.items[i],fr=l.items[to];
      if(l.mode==='combine'){
        const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;
        const j=l.items.findIndex((o:any,k:number)=>k!==i&&o.drag&&Math.hypot(cx-(o.x+o.w/2),cy-(o.y+o.w/2))<o.w*0.85);
        if(j<0){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
        const a=Math.min(i,j),b=Math.max(i,j),A=l.items[a],B=l.items[b],r=await send({from:a,to:b});
        if(r?.correct){setMerged({x:(A.x+B.x)/2+A.w/2-52,y:(A.y+B.y)/2+A.w/2-52,t:r.result??'',a,b});setDone(true);setTimeout(()=>win(r),1500)}
        else{doShake();flash('Not quite. Try again!');Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start()}
        return}
      let ok=false;
      if(l.mode==='away')ok=Math.hypot(g.dx,g.dy)>80;
      else{const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;ok=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w}
      if(!ok){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
      goneR.current=[...goneR.current,i];
      if(l.mode==='feed')Animated.parallel([Animated.timing(dPan[i],{toValue:{x:fr.x+fr.w/2-(el.x+el.w/2),y:fr.y+fr.w*0.4-(el.y+el.w/2)},duration:350,useNativeDriver:false}),Animated.timing(dSc[i],{toValue:0.05,duration:350,useNativeDriver:false})]).start();
      const need=l.items.map((it:any,k:number)=>it.drag?k:-1).filter((k:number)=>k>=0);
      if(need.every((k:number)=>goneR.current.includes(k))){const r=await send({from:0,to});
        if(r?.correct){setDone(true);if(l.mode==='away')setBloom(true);setTimeout(()=>win(r),l.mode==='away'?2200:900)}}
    }}))).current;
  // drag level: item 0 -> item lv.target
  const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
    onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
    onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to];
      const cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
      const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
      if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
        setOpen(true);
        Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
        setTimeout(()=>win(r),1100);return}}
      else if(hit)flash('Open the fridge first!');
      Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

  const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);stats.current.hints+=1;setHints(r.hints);const h=r.hint;
    if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
  // reward kind is typed as 'video' | 'gift' (api.reward only accepts these two)
  const reward=async(k:'video'|'gift')=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
  const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);win(r,true)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

  if(!lv)return <Stage bg="#f1dcc0"><View style={bd.wall}><View style={bd.frame}><View style={[bd.board,{justifyContent:'center'}]}>
    <Text style={bd.load}>{note||('Loading level '+n+'...')}</Text></View></View></View></Stage>;

  const board=lv.bg==='board';

  const stage=<View style={[st.stage,board&&{height:290,marginTop:0},lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
      {(lv.items||[]).map((it:any,i:number)=>{if(board&&(it.k==='duster'||it.k==='chalk'))return null;
        const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
        const body=<A w={it.w} t={it.t} grey={it.grey} bloom={bloom} open={open} i={i}/>,
        pos:any={position:'absolute',left:it.x,top:it.y,opacity:(merged&&(i===merged.a||i===merged.b))?0:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
        if(it.drag&&(lv.mode==='away'||lv.mode==='feed'||lv.mode==='combine'))return <Animated.View key={i} {...dPR[i].panHandlers} style={[pos,{zIndex:5+i,transform:[...dPan[i].getTranslateTransform(),{scale:dSc[i]}]}]}>{body}</Animated.View>;
        if(lv.type==='choice'&&!lv.options&&!lv.input)return <PopTouch key={i} style={pos} delay={i*90} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</PopTouch>;
        if(lv.type==='taps'&&it.k==='cloud')return <PopTouch key={i} style={pos} onPress={cloud}>{body}</PopTouch>;
        if(lv.type==='drag'&&!lv.mode&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
        if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
        return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
      {merged&&<View pointerEvents="none" style={{position:'absolute',left:merged.x,top:merged.y,width:104,height:104,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:84,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{merged.t}</Text></View>}
      {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
        transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
      {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
      {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
    </View>;

  // ---------- chalkboard layout ----------
  if(board)return <Stage bg="#f1dcc0"><View style={bd.wall}>
    <View style={bd.frame}><View style={bd.board}>
      <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
      <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
      <View pointerEvents="none" style={[bd.smudge,{bottom:150,left:20,width:200,height:90,transform:[{rotate:'6deg'}]}]}/>
      <View pointerEvents="none" style={bd.sheen}/>

      {/* top bar */}
      <View style={bd.top}>
        <View style={bd.topL}><Round n="home" onPress={onHome}/><Round n="gear"/></View>
        <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
          <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
          <View style={bd.sign}>
            <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
            <Text style={bd.signt}>{'LEVEL '+n}</Text>
            <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
          </View>
        </Animated.View>
        <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
      </View>

      <Animated.Text style={[bd.q,{opacity:qIn,transform:[{translateY:qY}]}]}>{lv.question}</Animated.Text>

      <Animated.View style={{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:240,transform:[{translateX:shake}]}}>{stage}</Animated.View>

      {/* draggable eraser + pencil */}
      <View pointerEvents="box-none" style={bd.decor}>
        <FreeDrag><View style={{transform:[{rotate:'-8deg'}]}}><Eraser w={84}/></View></FreeDrag>
        <FreeDrag><View style={{transform:[{rotate:'2deg'}]}}><Pencil w={150}/></View></FreeDrag>
      </View>

      {/* hint / video / skip */}
      <View style={bd.actions}>
        <View style={bd.acol}>
          <Animated.View style={{transform:[{scale:pulseS}]}}><PopTouch inner={bd.hintBtn} onPress={hint}><Icon n="search" s={34}/></PopTouch></Animated.View>
          <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
        </View>
        <View style={bd.acol}>
          <PopTouch inner={bd.videoBtn} onPress={()=>reward('video')}><Icon n="film" s={40}/></PopTouch>
          <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
        </View>
        <View style={bd.acol}>
          <PopTouch inner={bd.skipBtn} onPress={skip}><Icon n="play" s={36}/></PopTouch>
          <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
        </View>
      </View>

      {/* chalk tray */}
      <View style={bd.ledge}>
        {[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:6+i*6,height:1,backgroundColor:'rgba(90,45,10,0.25)'}}/>)}
        <View style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>
        <View style={{position:'absolute',left:'40%',bottom:20}}><Chalk w={78}/></View>
        <View style={{position:'absolute',left:'64%',bottom:22,transform:[{rotate:'-8deg'}]}}><Chalk w={54}/></View>
      </View>
      {!!note&&<Text style={bd.note}>{note}</Text>}
    </View></View>
    <View style={bd.wallBottom}/>
  </View></Stage>;

  // ---------- notebook layout (other levels) ----------
  return <Stage bg="#e8c9a0"><Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
    <Text style={st.ql}>{lv.question}</Text>
    <Animated.View style={{transform:[{translateX:shake}]}}>{stage}</Animated.View>
    {lv.options&&<View style={st.opts}>{lv.options.map((o:number)=>
      <TouchableOpacity key={o} disabled={done||hidOpt.includes(o)} onPress={()=>pickOpt(o)}
        style={[st.opt,{backgroundColor:sel===o?GREEN:'#fff',opacity:hidOpt.includes(o)?0.2:1}]}><Text style={st.ot}>{o}</Text></TouchableOpacity>)}</View>}
    {lv.input==='counter'&&<View style={st.cwrap}>
      <View style={st.crow}>
        <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={st.cbt}>−</Text></TouchableOpacity>
        <View style={st.cnumBox}><Text style={st.cnum}>{count}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={64}/></View>}</View>
        <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={st.cbt}>+</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={st.submit} disabled={done} onPress={()=>submitNum(count)}><Text style={st.subt}>SUBMIT</Text></TouchableOpacity>
    </View>}
    {lv.input==='keypad'&&<View style={st.kwrap}>
      <View style={st.krow}>
        <TouchableOpacity style={[st.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={st.kst}>✕</Text></TouchableOpacity>
        <View style={st.kpill}><Text style={st.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={52}/></View>}</View>
        <TouchableOpacity style={[st.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={()=>submitNum(Number(typed))}><Text style={st.kst}>✓</Text></TouchableOpacity>
      </View>
      {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={st.krow}>{row.map(d=>
        <TouchableOpacity key={d} style={st.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,2))}><Text style={st.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
    </View>}
    {!!note&&<Text style={st.note}>{note}</Text>}
  </Paper></Stage>}

/* ---------- styles ---------- */
const bd=StyleSheet.create({
  wall:{flex:1,backgroundColor:'#f1dcc0'},
  frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:8,backgroundColor:'#1f5b44',overflow:'hidden'},
  board:{flex:1,alignItems:'center'},
  load:{fontFamily:F,fontSize:22,color:CHALK},
  smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
  sheen:{position:'absolute',left:0,right:0,top:0,height:120,backgroundColor:'rgba(255,255,255,0.04)'},
  top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
  topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
  topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
  signWrap:{alignItems:'center',paddingTop:14},
  string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
  sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
  signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
  dashes:{gap:4,justifyContent:'center'},dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
  bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
  bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},
  q:{fontFamily:F,fontSize:25,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
  decor:{position:'absolute',zIndex:30,elevation:30,left:0,right:0,bottom:160,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingHorizontal:40},
  actions:{position:'absolute',left:0,right:0,bottom:62,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
  acol:{alignItems:'center'},
  lblRow:{flexDirection:'row',alignItems:'center',gap:3,height:20,marginTop:4},
  lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
  hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
  videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
  skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
  ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},
  note:{position:'absolute',bottom:40,alignSelf:'center',fontFamily:F,fontSize:17,color:'#ffb4a8'},
  wallBottom:{height:18}});

const st=StyleSheet.create({
  wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
  paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
  holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
  ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
  head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
  round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
  title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
  pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
  body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
  ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
  stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
  opts:{flexDirection:'row',gap:12,marginTop:6},
  opt:{width:54,height:54,borderRadius:16,borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},ot:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK},
  cwrap:{alignItems:'center',marginTop:4},crow:{flexDirection:'row',alignItems:'center',gap:14},
  cbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#5ba8d0',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},cbt:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK,lineHeight:30},
  cnumBox:{minWidth:60,height:44,alignItems:'center',justifyContent:'center'},cnum:{fontFamily:F,fontSize:34,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-8,alignItems:'center'},
  submit:{marginTop:12,paddingHorizontal:26,paddingVertical:8,borderRadius:18,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff'},subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
  kwrap:{alignItems:'center',gap:10,marginTop:-60},krow:{flexDirection:'row',alignItems:'center',gap:8},
  kside:{width:36,height:36,borderRadius:18,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
  kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
  kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
  bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2}});

/* =====================  ENTRY  =====================
   Level 2 has its own screen + own backend routes (Braintwistlevel2routes.js).
   Every other level uses the generic game screen above. */
export default function BTGameScreen(props:any){
  const {n,player,hints,onWin,onHome}=props;
  // after ANY level is won: backend saves it (level locks) + unlocks the next, then App moves on
  const finish=async(r:any,s:any)=>{
    try{await completeLevel(player.id,n,Math.max(1,Number(s?.tries)||1));}catch(e){}
    onWin(r,s);
  };
  if(n===2)return <BTLevel2Screen
    playerId={player.id}
    hints={hints}
    onExit={onHome}
    onComplete={(r:any)=>finish(r,{tries:Math.max(1,Number(r?.attempts)||1),hints:0,skipped:false})}/>;
  return <BTGameScreenInner {...props} onWin={finish}/>;
}
