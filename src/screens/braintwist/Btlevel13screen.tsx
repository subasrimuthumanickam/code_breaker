// // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Easing} from 'react-native';
// // // // // import {F,INK,Stage} from './BTShared';
// // // // // import {Icon} from './Art';
// // // // // import * as api from './api';
// // // // // import * as l13 from './Btlevel13api';
// // // // // import {Torch,Flame,Cat,Shelf,Sofa,Pillow,Clothes} from './Btlevel13art';

// // // // // /* =====================================================================
// // // // //    LEVEL 13  -  "Burn everything!"   (cat on the shelf)
// // // // //    - drag the torch onto things to burn them
// // // // //    - sofa -> fire spreads to the pillow, shelf -> the cat runs away,
// // // // //      clothes -> burn them too.  Never burn the cat!
// // // // //    - every move is sent to the backend (POST /level13/...), saved in MySQL,
// // // // //      and the JSON reply tells us what burned / if the level is complete.
// // // // //    ===================================================================== */

// // // // // const SW=320,SH=300;
// // // // // const TORCH={x:18,y:40,w:44,h:120,tipX:22,tipY:16};

// // // // // // hit boxes inside the 320 x 300 scene: [x, y, w, h]  (checked in this order)
// // // // // const BOX:any={cat:[158,22,52,60],pillow:[140,138,60,52],clothes:[210,208,90,60],shelf:[70,74,180,30],sofa:[35,118,250,140]};
// // // // // const ORDER=['cat','pillow','clothes','shelf','sofa'];
// // // // // const hitTest=(x:number,y:number)=>ORDER.find(k=>{const [bx,by,bw,bh]=BOX[k];return x>=bx&&x<=bx+bw&&y>=by&&y<=by+bh});

// // // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;

// // // // // export default function BTLevel13Screen({playerId,hints,setHints,onHints,onExit,onComplete}:any){
// // // // //   const [sid,setSid]=useState<number|null>(null);
// // // // //   const [burned,setBurned]=useState<string[]>([]);
// // // // //   const [catGone,setCatGone]=useState(false);
// // // // //   const [note,setNote]=useState('');
// // // // //   const [loading,setLoading]=useState(true);

// // // // //   const sidR=useRef<number|null>(null),busyR=useRef(false),doneR=useRef(false);
// // // // //   const pan=useRef(new Animated.ValueXY()).current;
// // // // //   const shake=useRef(new Animated.Value(0)).current;
// // // // //   const catX=useRef(new Animated.Value(0)).current,catY=useRef(new Animated.Value(0)).current,catO=useRef(new Animated.Value(1)).current;

// // // // //   const setH=(v:number)=>{setHints?.(v);onHints?.(v)};
// // // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),2200)};
// // // // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();
// // // // //   const runAway=()=>{
// // // // //     setCatGone(true);
// // // // //     Animated.parallel([
// // // // //       Animated.sequence([
// // // // //         Animated.timing(catY,{toValue:-16,duration:220,easing:Easing.out(Easing.quad),useNativeDriver:true}),
// // // // //         Animated.timing(catY,{toValue:62,duration:380,easing:Easing.in(Easing.quad),useNativeDriver:true})]),
// // // // //       Animated.sequence([
// // // // //         Animated.delay(200),
// // // // //         Animated.timing(catX,{toValue:-190,duration:1100,easing:Easing.linear,useNativeDriver:true})]),
// // // // //       Animated.sequence([Animated.delay(900),Animated.timing(catO,{toValue:0,duration:400,useNativeDriver:true})])]).start();
// // // // //   };

// // // // //   /* ---- load / resume the session from the backend ---- */
// // // // //   useEffect(()=>{
// // // // //     l13.start(playerId).then(r=>{
// // // // //       sidR.current=r.sessionId;setSid(r.sessionId);setBurned(r.burned||[]);
// // // // //       if(r.catEscaped){setCatGone(true);catX.setValue(-190);catY.setValue(62);catO.setValue(0)}
// // // // //       setLoading(false);
// // // // //     }).catch((e:any)=>{setLoading(false);flash(e?.message||'Cannot load level 13')});
// // // // //   },[]);

// // // // //   /* ---- send the move to the backend, show what it answered ---- */
// // // // //   const burn=async(item:string)=>{
// // // // //     if(busyR.current||doneR.current||!sidR.current)return;
// // // // //     busyR.current=true;
// // // // //     try{
// // // // //       const r=await l13.burn(playerId,sidR.current,item);
// // // // //       if(r.newlyBurned?.length)setBurned(b=>Array.from(new Set([...b,...r.newlyBurned!])));
// // // // //       if(r.catEscaped&&!catGone)runAway();
// // // // //       if(r.correct===false){doShake()}
// // // // //       if(r.message)flash(r.message);
// // // // //       if(r.completed){
// // // // //         doneR.current=true;
// // // // //         setTimeout(()=>onComplete?.({correct:true,completed:true,attempts:r.attempts}),1500);
// // // // //       }
// // // // //     }catch(e:any){flash(e?.message||'Network error')}
// // // // //     finally{busyR.current=false}
// // // // //   };

// // // // //   /* ---- draggable torch ---- */
// // // // //   const pr=useRef(PanResponder.create({
// // // // //     onStartShouldSetPanResponder:()=>!busyR.current&&!doneR.current,
// // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // //     onPanResponderRelease:(_,g)=>{
// // // // //       const tx=TORCH.x+g.dx+TORCH.tipX,ty=TORCH.y+g.dy+TORCH.tipY;
// // // // //       const item=hitTest(tx,ty);
// // // // //       Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}).start();
// // // // //       if(item)burn(item);
// // // // //     }})).current;

// // // // //   /* ---- hint / video / skip ---- */
// // // // //   const hint=async()=>{
// // // // //     if(!sidR.current)return;
// // // // //     try{const r=await l13.hint(playerId,sidR.current);if(typeof r.hints==='number')setH(r.hints);if(r.text)flash(r.text)}
// // // // //     catch(e:any){flash(e?.status===402?'Not enough hints':(e?.message||'Network error'))}};
// // // // //   const reward=async(k:'video'|'gift')=>{try{const r=await api.reward(playerId,k);setH(r.hints)}catch(e){}};
// // // // //   const skip=async()=>{
// // // // //     try{const r=await api.skip(13,playerId);if(typeof hints==='number')setH(hints-50);onComplete?.({...r,skipped:true,attempts:1})}
// // // // //     catch(e:any){flash(e?.status===402?'Not enough hints':'Network error')}};

// // // // //   const has=(k:string)=>burned.includes(k);
// // // // //   const fires:[string,number,number,number][]=[
// // // // //     ['sofa',70,92,26],['sofa',150,98,30],['sofa',215,98,26],
// // // // //     ['pillow',156,112,26],
// // // // //     ['clothes',226,176,26],['clothes',258,182,22],
// // // // //     ['shelf',96,48,22],['shelf',140,50,24],['shelf',200,48,22]];

// // // // //   return <Stage bg="#e8c9a0"><View style={st.wood}><View style={st.pink}/>
// // // // //     <View style={st.paper}>
// // // // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}

// // // // //       <View style={st.head}>
// // // // //         <Round n="home" onPress={onExit}/><Round n="gear"/><Round n="dots"/>
// // // // //         <Text style={st.title}>LEVEL 13</Text>
// // // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View>
// // // // //       </View>

// // // // //       <View style={st.body}>
// // // // //         <Text style={st.ql}>Burn everything!</Text>

// // // // //         <Animated.View style={{transform:[{translateX:shake}]}}>
// // // // //           {loading?<Text style={st.load}>Loading level 13...</Text>:
// // // // //           <View style={st.scene}>
// // // // //             <View style={{position:'absolute',left:70,top:74}} pointerEvents="none"><Shelf w={180} burned={has('shelf')}/></View>
// // // // //             <Animated.View pointerEvents="none" style={{position:'absolute',left:158,top:22,opacity:catO,transform:[{translateX:catX},{translateY:catY}]}}><Cat w={52}/></Animated.View>
// // // // //             <View style={{position:'absolute',left:35,top:118}} pointerEvents="none"><Sofa w={250} burned={has('sofa')}/></View>
// // // // //             <View style={{position:'absolute',left:140,top:138}} pointerEvents="none"><Pillow w={60} burned={has('pillow')}/></View>
// // // // //             <View style={{position:'absolute',left:210,top:208}} pointerEvents="none"><Clothes w={90} burned={has('clothes')}/></View>

// // // // //             {fires.filter(f=>has(f[0])).map((f,i)=>
// // // // //               <View key={i} pointerEvents="none" style={{position:'absolute',left:f[1],top:f[2]}}><Flame w={f[3]} delay={i*90}/></View>)}

// // // // //             <Animated.View {...pr.panHandlers} style={{position:'absolute',left:TORCH.x,top:TORCH.y,width:TORCH.w,height:TORCH.h,zIndex:10,
// // // // //               transform:pan.getTranslateTransform()}}><Torch/></Animated.View>
// // // // //           </View>}
// // // // //         </Animated.View>

// // // // //         {!!note&&<Text style={st.note}>{note}</Text>}
// // // // //       </View>

// // // // //       <View style={st.bar}>{[['search','x25',hint,'#bdeaf2'],['gift','',()=>reward('gift'),'transparent'],['film','+75',()=>reward('video'),'#d9bff7'],['play','x50',skip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // // //         <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}>
// // // // //           <View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // // //           <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View>
// // // // //         </TouchableOpacity>)}</View>
// // // // //     </View></View></Stage>;
// // // // // }

// // // // // const st=StyleSheet.create({
// // // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},
// // // // //   pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},
// // // // //   hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},
// // // // //   pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // // //   scene:{width:SW,height:SH},
// // // // //   load:{fontFamily:F,fontSize:18,color:'#444'},
// // // // //   note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,fontWeight:'bold',color:'#c0392b',textAlign:'center'},
// // // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},
// // // // //   bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},
// // // // //   cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // // // });
// // // // import React,{useEffect,useRef,useState} from 'react';
// // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Easing} from 'react-native';
// // // // import {F,INK,Stage} from './BTShared';
// // // // import {Icon} from './Art';
// // // // import * as api from './api';
// // // // import * as l13 from './Btlevel13api';
// // // // import {Torch,Flame,Cat,Shelf,Sofa,Pillow,Clothes} from './Btlevel13art';

// // // // /* =====================================================================
// // // //    LEVEL 13  -  "Burn everything!"   (cat on the shelf)
// // // //    Room theme (window, plant, bookshelf, wooden floor, bottom bar)
// // // //    - drag the torch onto things to burn them. Never burn the cat!
// // // //    - when everything is burned, the room and the title text get charred.
// // // //    ===================================================================== */

// // // // const SW=320,SH=300;
// // // // const TORCH={x:18,y:40,w:44,h:120,tipX:22,tipY:16};

// // // // const BOX:any={cat:[158,22,52,60],pillow:[140,138,60,52],clothes:[210,208,90,60],shelf:[70,74,180,30],sofa:[35,118,250,140]};
// // // // const ORDER=['cat','pillow','clothes','shelf','sofa'];
// // // // const hitTest=(x:number,y:number)=>ORDER.find(k=>{const [bx,by,bw,bh]=BOX[k];return x>=bx&&x<=bx+bw&&y>=by&&y<=by+bh});
// // // // const ALL=['sofa','pillow','clothes','shelf'];

// // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;

// // // // /* ---------- room decoration (background only) ---------- */
// // // // const Room=({charred}:{charred:boolean})=><View style={StyleSheet.absoluteFill} pointerEvents="none">
// // // //   {/* window */}
// // // //   <View style={st.window}>
// // // //     <View style={st.sky}><View style={st.cloud}/><View style={[st.cloud,{left:34,top:30,width:20,height:10}]}/></View>
// // // //     <View style={st.sill}/>
// // // //     <View style={st.pot}><View style={st.leafA}/><View style={st.leafB}/></View>
// // // //   </View>
// // // //   {/* sun poster */}
// // // //   <View style={st.poster}><View style={st.sun}/></View>
// // // //   {/* bookshelf */}
// // // //   <View style={st.bshelf}>
// // // //     <View style={st.row}>
// // // //       {['#3aa0e0','#f0c33c','#8a5fd0'].map((c,i)=><View key={i} style={[st.book,{backgroundColor:c,height:48+(i%2)*6}]}/>)}
// // // //     </View>
// // // //     <View style={st.plank}/>
// // // //     <View style={st.row}>
// // // //       {['#5a7fd0','#3fb8b0'].map((c,i)=><View key={i} style={[st.book,{backgroundColor:c,height:40}]}/>)}
// // // //     </View>
// // // //     <View style={st.plank}/>
// // // //     <View style={[st.row,{alignItems:'flex-end'}]}><View style={st.teddy}/></View>
// // // //   </View>
// // // //   {/* pencil cup */}
// // // //   <View style={st.cup}/>
// // // //   {/* books stack + toy car */}
// // // //   <View style={[st.stack,{backgroundColor:'#3aa0e0',bottom:'33%',height:16}]}/>
// // // //   <View style={[st.stack,{backgroundColor:'#ee6fb0',bottom:'33%',marginBottom:16,height:22}]}/>
// // // //   {/* floor */}
// // // //   <View style={st.floor}><View style={st.baseboard}/></View>
// // // //   {/* smoke / char overlay when everything is burned */}
// // // //   {charred&&<View style={[StyleSheet.absoluteFill,{backgroundColor:'rgba(40,28,20,0.45)'}]}/>}
// // // // </View>;

// // // // export default function BTLevel13Screen({playerId,hints,setHints,onHints,onExit,onComplete}:any){
// // // //   const [sid,setSid]=useState<number|null>(null);
// // // //   const [burned,setBurned]=useState<string[]>([]);
// // // //   const [catGone,setCatGone]=useState(false);
// // // //   const [note,setNote]=useState('');
// // // //   const [loading,setLoading]=useState(true);

// // // //   const sidR=useRef<number|null>(null),busyR=useRef(false),doneR=useRef(false);
// // // //   const pan=useRef(new Animated.ValueXY()).current;
// // // //   const shake=useRef(new Animated.Value(0)).current;
// // // //   const catX=useRef(new Animated.Value(0)).current,catY=useRef(new Animated.Value(0)).current,catO=useRef(new Animated.Value(1)).current;

// // // //   const setH=(v:number)=>{setHints?.(v);onHints?.(v)};
// // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),2200)};
// // // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();
// // // //   const runAway=()=>{
// // // //     setCatGone(true);
// // // //     Animated.parallel([
// // // //       Animated.sequence([
// // // //         Animated.timing(catY,{toValue:-16,duration:220,easing:Easing.out(Easing.quad),useNativeDriver:true}),
// // // //         Animated.timing(catY,{toValue:62,duration:380,easing:Easing.in(Easing.quad),useNativeDriver:true})]),
// // // //       Animated.sequence([
// // // //         Animated.delay(200),
// // // //         Animated.timing(catX,{toValue:-190,duration:1100,easing:Easing.linear,useNativeDriver:true})]),
// // // //       Animated.sequence([Animated.delay(900),Animated.timing(catO,{toValue:0,duration:400,useNativeDriver:true})])]).start();
// // // //   };

// // // //   /* ---- load / resume the session from the backend ---- */
// // // //   useEffect(()=>{
// // // //     l13.start(playerId).then(r=>{
// // // //       sidR.current=r.sessionId;setSid(r.sessionId);setBurned(r.burned||[]);
// // // //       if(r.catEscaped){setCatGone(true);catX.setValue(-190);catY.setValue(62);catO.setValue(0)}
// // // //       setLoading(false);
// // // //     }).catch((e:any)=>{setLoading(false);flash(e?.message||'Cannot load level 13')});
// // // //   },[]);

// // // //   /* ---- send the move to the backend ---- */
// // // //   const burn=async(item:string)=>{
// // // //     if(busyR.current||doneR.current||!sidR.current)return;
// // // //     busyR.current=true;
// // // //     try{
// // // //       const r=await l13.burn(playerId,sidR.current,item);
// // // //       if(r.newlyBurned?.length)setBurned(b=>Array.from(new Set([...b,...r.newlyBurned!])));
// // // //       if(r.catEscaped&&!catGone)runAway();
// // // //       if(r.correct===false){doShake()}
// // // //       if(r.message)flash(r.message);
// // // //       if(r.completed){
// // // //         doneR.current=true;
// // // //         setTimeout(()=>onComplete?.({correct:true,completed:true,attempts:r.attempts}),1500);
// // // //       }
// // // //     }catch(e:any){flash(e?.message||'Network error')}
// // // //     finally{busyR.current=false}
// // // //   };

// // // //   /* ---- draggable torch ---- */
// // // //   const pr=useRef(PanResponder.create({
// // // //     onStartShouldSetPanResponder:()=>!busyR.current&&!doneR.current,
// // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // //     onPanResponderRelease:(_,g)=>{
// // // //       const tx=TORCH.x+g.dx+TORCH.tipX,ty=TORCH.y+g.dy+TORCH.tipY;
// // // //       const item=hitTest(tx,ty);
// // // //       Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}).start();
// // // //       if(item)burn(item);
// // // //     }})).current;

// // // //   /* ---- hint / video / skip ---- */
// // // //   const hint=async()=>{
// // // //     if(!sidR.current)return;
// // // //     try{const r=await l13.hint(playerId,sidR.current);if(typeof r.hints==='number')setH(r.hints);if(r.text)flash(r.text)}
// // // //     catch(e:any){flash(e?.status===402?'Not enough hints':(e?.message||'Network error'))}};
// // // //   const reward=async(k:'video'|'gift')=>{try{const r=await api.reward(playerId,k);setH(r.hints)}catch(e){}};
// // // //   const skip=async()=>{
// // // //     try{const r=await api.skip(13,playerId);if(typeof hints==='number')setH(hints-50);onComplete?.({...r,skipped:true,attempts:1})}
// // // //     catch(e:any){flash(e?.status===402?'Not enough hints':'Network error')}};

// // // //   const has=(k:string)=>burned.includes(k);
// // // //   const allBurned=ALL.every(has);
// // // //   const fires:[string,number,number,number][]=[
// // // //     ['sofa',70,92,26],['sofa',150,98,30],['sofa',215,98,26],
// // // //     ['pillow',156,112,26],
// // // //     ['clothes',226,176,26],['clothes',258,182,22],
// // // //     ['shelf',96,48,22],['shelf',140,50,24],['shelf',200,48,22]];

// // // //   const bar:[string,string,any,string,string][]=[
// // // //     ['search','25',hint,'#7ac943','bulb'],
// // // //     ['film','+75',()=>reward('video'),'#ffffff','coin'],
// // // //     ['play','50',skip,'#ee4850','bulb']];

// // // //   return <Stage bg="#bcdcf2"><View style={st.root}>
// // // //     <Room charred={allBurned}/>

// // // //     {/* top row */}
// // // //     <View style={st.head}>
// // // //       <View style={{flexDirection:'row',gap:6}}><Round n="home" onPress={onExit}/><Round n="gear"/></View>
// // // //       <View style={st.signWrap}>
// // // //         <View style={st.rope}/>
// // // //         <View style={st.sign}><Text style={st.signTx}>LEVEL 13</Text></View>
// // // //       </View>
// // // //       <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View>
// // // //     </View>

// // // //     {/* instruction */}
// // // //     <View style={st.qpill}>
// // // //       <Text style={[st.ql,allBurned&&{color:'#2b2b2b'}]}>{allBurned?'🔥 Burn everything! 🔥':'Burn everything!'}</Text>
// // // //     </View>

// // // //     {/* scene */}
// // // //     <View style={st.body}>
// // // //       <Animated.View style={{transform:[{translateX:shake}]}}>
// // // //         {loading?<Text style={st.load}>Loading level 13...</Text>:
// // // //         <View style={st.scene}>
// // // //           <View style={{position:'absolute',left:70,top:74}} pointerEvents="none"><Shelf w={180} burned={has('shelf')}/></View>
// // // //           <Animated.View pointerEvents="none" style={{position:'absolute',left:158,top:22,opacity:catO,transform:[{translateX:catX},{translateY:catY}]}}><Cat w={52}/></Animated.View>
// // // //           <View style={{position:'absolute',left:35,top:118}} pointerEvents="none"><Sofa w={250} burned={has('sofa')}/></View>
// // // //           <View style={{position:'absolute',left:140,top:138}} pointerEvents="none"><Pillow w={60} burned={has('pillow')}/></View>
// // // //           <View style={{position:'absolute',left:210,top:208}} pointerEvents="none"><Clothes w={90} burned={has('clothes')}/></View>

// // // //           {fires.filter(f=>has(f[0])).map((f,i)=>
// // // //             <View key={i} pointerEvents="none" style={{position:'absolute',left:f[1],top:f[2]}}><Flame w={f[3]} delay={i*90}/></View>)}

// // // //           <Animated.View {...pr.panHandlers} style={{position:'absolute',left:TORCH.x,top:TORCH.y,width:TORCH.w,height:TORCH.h,zIndex:10,
// // // //             transform:pan.getTranslateTransform()}}><Torch/></Animated.View>
// // // //         </View>}
// // // //       </Animated.View>
// // // //       {!!note&&<Text style={st.note}>{note}</Text>}
// // // //     </View>

// // // //     {/* bottom bar */}
// // // //     <View style={st.barWrap}>
// // // //       <View style={st.bar}>{bar.map(([n,c,f,bg,ic])=>
// // // //         <View key={n} style={{alignItems:'center'}}>
// // // //           <TouchableOpacity onPress={f} activeOpacity={0.8}
// // // //             style={[st.bcircle,{backgroundColor:bg,borderColor:n==='film'?'#fff':bg==='#7ac943'?'#c9ec9a':'#fff'}]}>
// // // //             <Icon n={n} s={26}/>
// // // //           </TouchableOpacity>
// // // //           <View style={st.cost}>
// // // //             {ic==='coin'?<View style={st.coin}/>:<Icon n="bulb" s={13}/>}
// // // //             <Text style={st.costTx}>{c}</Text>
// // // //           </View>
// // // //         </View>)}</View>
// // // //     </View>
// // // //   </View></Stage>;
// // // // }

// // // // const st=StyleSheet.create({
// // // //   root:{flex:1,backgroundColor:'#bcdcf2',paddingTop:34},

// // // //   /* room */
// // // //   window:{position:'absolute',left:0,top:70,width:80,height:150,backgroundColor:'#e9a95a',borderTopRightRadius:6,borderBottomRightRadius:6,padding:6,paddingLeft:0},
// // // //   sky:{width:68,height:92,backgroundColor:'#9fd0f2'},
// // // //   cloud:{position:'absolute',left:8,top:12,width:28,height:12,borderRadius:8,backgroundColor:'#fff'},
// // // //   sill:{position:'absolute',left:0,right:-6,bottom:26,height:12,backgroundColor:'#f3c58a'},
// // // //   pot:{position:'absolute',left:16,bottom:30,width:26,height:22,borderRadius:6,backgroundColor:'#f6e7c8'},
// // // //   leafA:{position:'absolute',left:-6,top:-40,width:16,height:42,borderRadius:10,backgroundColor:'#7ac943'},
// // // //   leafB:{position:'absolute',left:10,top:-34,width:16,height:36,borderRadius:10,backgroundColor:'#5fb035'},
// // // //   poster:{position:'absolute',right:40,top:84,width:60,height:76,backgroundColor:'#a6cdea',borderRadius:4,alignItems:'center',justifyContent:'center'},
// // // //   sun:{width:38,height:38,borderRadius:19,backgroundColor:'#f6a73c'},
// // // //   bshelf:{position:'absolute',right:0,top:'52%',width:78,height:150,backgroundColor:'#d98a3c',borderTopLeftRadius:6,padding:6,justifyContent:'space-between'},
// // // //   row:{flexDirection:'row',gap:3,alignItems:'flex-end'},
// // // //   book:{width:14,borderRadius:2},
// // // //   plank:{height:4,backgroundColor:'#b86d26',marginHorizontal:-6},
// // // //   teddy:{width:30,height:26,borderRadius:12,backgroundColor:'#b9753c'},
// // // //   cup:{position:'absolute',right:6,top:'42%',width:36,height:34,backgroundColor:'#f6c93c',borderRadius:4},
// // // //   stack:{position:'absolute',left:0,width:90},
// // // //   floor:{position:'absolute',left:0,right:0,bottom:0,height:'33%',backgroundColor:'#f3b872'},
// // // //   baseboard:{height:12,backgroundColor:'#f0c4c4'},

// // // //   /* header */
// // // //   head:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',paddingHorizontal:10},
// // // //   round:{width:34,height:34,borderRadius:17,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // //   signWrap:{alignItems:'center'},
// // // //   rope:{width:2,height:10,backgroundColor:'#7a4b22'},
// // // //   sign:{backgroundColor:'#c9783a',borderWidth:3,borderColor:'#8a4a1e',borderRadius:6,paddingHorizontal:16,paddingVertical:4},
// // // //   signTx:{fontFamily:F,fontSize:19,fontWeight:'bold',color:'#fff',letterSpacing:1},
// // // //   pill:{flexDirection:'row',alignItems:'center',borderRadius:14,paddingHorizontal:10,backgroundColor:'#fff',height:28,marginTop:4},
// // // //   pn:{fontFamily:F,fontWeight:'bold',marginRight:4,color:INK},

// // // //   qpill:{alignSelf:'center',marginTop:10,backgroundColor:'#fbf1dc',borderRadius:20,paddingHorizontal:22,paddingVertical:7},
// // // //   ql:{fontFamily:F,fontSize:19,fontStyle:'italic',color:'#1f2a6b',textAlign:'center'},

// // // //   body:{flex:1,alignItems:'center',justifyContent:'center'},
// // // //   scene:{width:SW,height:SH},
// // // //   load:{fontFamily:F,fontSize:18,color:'#444'},
// // // //   note:{position:'absolute',bottom:-6,fontFamily:F,fontSize:17,fontWeight:'bold',color:'#c0392b',textAlign:'center',backgroundColor:'rgba(255,255,255,0.8)',paddingHorizontal:10,borderRadius:10},

// // // //   /* bottom bar */
// // // //   barWrap:{paddingHorizontal:30,paddingBottom:16},
// // // //   bar:{flexDirection:'row',justifyContent:'space-around',alignItems:'flex-end',backgroundColor:'#f6e8d0',borderRadius:40,paddingVertical:12,paddingHorizontal:14,borderWidth:4,borderColor:'#bcd8ee'},
// // // //   bcircle:{width:58,height:58,borderRadius:29,borderWidth:4,alignItems:'center',justifyContent:'center'},
// // // //   cost:{flexDirection:'row',alignItems:'center',backgroundColor:'#7a4b22',borderRadius:12,paddingHorizontal:10,height:24,marginTop:6},
// // // //   costTx:{fontFamily:F,fontWeight:'bold',fontSize:14,color:'#fff',marginLeft:4},
// // // //   coin:{width:13,height:13,borderRadius:7,backgroundColor:'#f6c93c'},
// // // // });
// // // import React,{useEffect,useRef,useState} from 'react';
// // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Easing} from 'react-native';
// // // import {F,INK,Stage} from './BTShared';
// // // import {Icon} from './Art';
// // // import * as api from './api';
// // // import * as l13 from './Btlevel13api';
// // // import {Torch,Flame,Cat,Shelf,Sofa,Pillow,Clothes} from './Btlevel13art';

// // // /* =====================================================================
// // //    LEVEL 13  -  "Burn everything!"   (cat on the shelf)
// // //    - drag the torch onto things to burn them. Never burn the cat!
// // //    - level always starts clean (no fire), fire only after the torch touches.
// // //    ===================================================================== */

// // // const SW=320,SH=300;
// // // const TORCH={x:18,y:40,w:44,h:120,tipX:22,tipY:16};

// // // const BOX:any={cat:[158,22,52,60],pillow:[140,138,60,52],clothes:[210,208,90,60],shelf:[70,74,180,30],sofa:[35,118,250,140]};
// // // const ORDER=['cat','pillow','clothes','shelf','sofa'];
// // // const hitTest=(x:number,y:number)=>ORDER.find(k=>{const [bx,by,bw,bh]=BOX[k];return x>=bx&&x<=bx+bw&&y>=by&&y<=by+bh});
// // // const ALL=['sofa','pillow','clothes','shelf'];

// // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;

// // // /* ---------- room decoration (background only) ---------- */
// // // const Room=({charred}:{charred:boolean})=><View style={StyleSheet.absoluteFill} pointerEvents="none">
// // //   <View style={st.window}>
// // //     <View style={st.sky}><View style={st.cloud}/><View style={[st.cloud,{left:34,top:30,width:20,height:10}]}/></View>
// // //     <View style={st.sill}/>
// // //     <View style={st.pot}><View style={st.leafA}/><View style={st.leafB}/></View>
// // //   </View>
// // //   <View style={st.poster}><View style={st.sun}/></View>
// // //   <View style={st.bshelf}>
// // //     <View style={st.row}>
// // //       {['#3aa0e0','#f0c33c','#8a5fd0'].map((c,i)=><View key={i} style={[st.book,{backgroundColor:c,height:48+(i%2)*6}]}/>)}
// // //     </View>
// // //     <View style={st.plank}/>
// // //     <View style={st.row}>
// // //       {['#5a7fd0','#3fb8b0'].map((c,i)=><View key={i} style={[st.book,{backgroundColor:c,height:40}]}/>)}
// // //     </View>
// // //     <View style={st.plank}/>
// // //     <View style={[st.row,{alignItems:'flex-end'}]}><View style={st.teddy}/></View>
// // //   </View>
// // //   <View style={st.cup}/>
// // //   <View style={[st.stack,{backgroundColor:'#3aa0e0',bottom:'33%',height:16}]}/>
// // //   <View style={[st.stack,{backgroundColor:'#ee6fb0',bottom:'33%',marginBottom:16,height:22}]}/>
// // //   <View style={st.floor}><View style={st.baseboard}/></View>
// // //   {charred&&<View style={[StyleSheet.absoluteFill,{backgroundColor:'rgba(40,28,20,0.45)'}]}/>}
// // // </View>;

// // // export default function BTLevel13Screen({playerId,hints,setHints,onHints,onExit,onComplete}:any){
// // //   const [sid,setSid]=useState<number|null>(null);
// // //   const [burned,setBurned]=useState<string[]>([]);
// // //   const [catGone,setCatGone]=useState(false);
// // //   const [note,setNote]=useState('');
// // //   const [loading,setLoading]=useState(true);

// // //   const sidR=useRef<number|null>(null),busyR=useRef(false),doneR=useRef(false);
// // //   const pan=useRef(new Animated.ValueXY()).current;
// // //   const shake=useRef(new Animated.Value(0)).current;
// // //   const catX=useRef(new Animated.Value(0)).current,catY=useRef(new Animated.Value(0)).current,catO=useRef(new Animated.Value(1)).current;

// // //   const setH=(v:number)=>{setHints?.(v);onHints?.(v)};
// // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),2200)};
// // //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();
// // //   const runAway=()=>{
// // //     setCatGone(true);
// // //     Animated.parallel([
// // //       Animated.sequence([
// // //         Animated.timing(catY,{toValue:-16,duration:220,easing:Easing.out(Easing.quad),useNativeDriver:true}),
// // //         Animated.timing(catY,{toValue:62,duration:380,easing:Easing.in(Easing.quad),useNativeDriver:true})]),
// // //       Animated.sequence([
// // //         Animated.delay(200),
// // //         Animated.timing(catX,{toValue:-190,duration:1100,easing:Easing.linear,useNativeDriver:true})]),
// // //       Animated.sequence([Animated.delay(900),Animated.timing(catO,{toValue:0,duration:400,useNativeDriver:true})])]).start();
// // //   };

// // //   /* ---- start a session; always begin with a clean scene (no fire) ---- */
// // //   useEffect(()=>{
// // //     l13.start(playerId).then(r=>{
// // //       sidR.current=r.sessionId;setSid(r.sessionId);setBurned([]);
// // //       setLoading(false);
// // //     }).catch((e:any)=>{setLoading(false);flash(e?.message||'Cannot load level 13')});
// // //   },[]);

// // //   /* ---- send the move to the backend ---- */
// // //   const burn=async(item:string)=>{
// // //     if(busyR.current||doneR.current||!sidR.current)return;
// // //     busyR.current=true;
// // //     try{
// // //       const r=await l13.burn(playerId,sidR.current,item);
// // //       const nb:string[]=r.newlyBurned?.length?r.newlyBurned:(item!=='cat'&&r.correct!==false?[item]:[]);
// // //       if(nb.length)setBurned(b=>Array.from(new Set([...b,...nb])));
// // //       if(r.catEscaped&&!catGone)runAway();
// // //       if(r.correct===false){doShake()}
// // //       if(r.message)flash(r.message);
// // //       if(r.completed){
// // //         doneR.current=true;
// // //         setTimeout(()=>onComplete?.({correct:true,completed:true,attempts:r.attempts}),1500);
// // //       }
// // //     }catch(e:any){flash(e?.message||'Network error')}
// // //     finally{busyR.current=false}
// // //   };

// // //   /* ---- draggable torch ---- */
// // //   const pr=useRef(PanResponder.create({
// // //     onStartShouldSetPanResponder:()=>!busyR.current&&!doneR.current,
// // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // //     onPanResponderRelease:(_,g)=>{
// // //       const tx=TORCH.x+g.dx+TORCH.tipX,ty=TORCH.y+g.dy+TORCH.tipY;
// // //       const item=hitTest(tx,ty);
// // //       Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}).start();
// // //       if(item)burn(item);
// // //     }})).current;

// // //   /* ---- hint / video / skip ---- */
// // //   const hint=async()=>{
// // //     if(!sidR.current)return;
// // //     try{const r=await l13.hint(playerId,sidR.current);if(typeof r.hints==='number')setH(r.hints);if(r.text)flash(r.text)}
// // //     catch(e:any){flash(e?.status===402?'Not enough hints':(e?.message||'Network error'))}};
// // //   const reward=async(k:'video'|'gift')=>{try{const r=await api.reward(playerId,k);setH(r.hints)}catch(e){}};
// // //   const skip=async()=>{
// // //     try{const r=await api.skip(13,playerId);if(typeof hints==='number')setH(hints-50);onComplete?.({...r,skipped:true,attempts:1})}
// // //     catch(e:any){flash(e?.status===402?'Not enough hints':'Network error')}};

// // //   const has=(k:string)=>burned.includes(k);
// // //   const allBurned=ALL.every(has);
// // //   const fires:[string,number,number,number][]=[
// // //     ['sofa',70,92,26],['sofa',150,98,30],['sofa',215,98,26],
// // //     ['pillow',156,112,26],
// // //     ['clothes',226,176,26],['clothes',258,182,22],
// // //     ['shelf',96,48,22],['shelf',140,50,24],['shelf',200,48,22]];

// // //   const bar:[string,string,any,string,string][]=[
// // //     ['search','25',hint,'#7ac943','bulb'],
// // //     ['film','+75',()=>reward('video'),'#ffffff','coin'],
// // //     ['play','50',skip,'#ee4850','bulb']];

// // //   return <Stage bg="#bcdcf2"><View style={st.root}>
// // //     <Room charred={allBurned}/>

// // //     {/* top row */}
// // //     <View style={st.head}>
// // //       <View style={{flexDirection:'row',gap:6}}><Round n="home" onPress={onExit}/><Round n="gear"/></View>
// // //       <View style={st.signWrap}>
// // //         <View style={st.rope}/>
// // //         <View style={st.sign}><Text style={st.signTx}>LEVEL 13</Text></View>
// // //       </View>
// // //       <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View>
// // //     </View>

// // //     {/* instruction */}
// // //     <View style={st.qpill}>
// // //       <Text style={st.ql}>Burn everything!</Text>
// // //     </View>

// // //     {/* scene */}
// // //     <View style={st.body}>
// // //       <Animated.View style={{transform:[{translateX:shake}]}}>
// // //         {loading?<Text style={st.load}>Loading level 13...</Text>:
// // //         <View style={st.scene}>
// // //           <View style={{position:'absolute',left:70,top:74}} pointerEvents="none"><Shelf w={180} burned={has('shelf')}/></View>
// // //           <Animated.View pointerEvents="none" style={{position:'absolute',left:158,top:22,opacity:catO,transform:[{translateX:catX},{translateY:catY}]}}><Cat w={52}/></Animated.View>
// // //           <View style={{position:'absolute',left:35,top:118}} pointerEvents="none"><Sofa w={250} burned={has('sofa')}/></View>
// // //           <View style={{position:'absolute',left:140,top:138}} pointerEvents="none"><Pillow w={60} burned={has('pillow')}/></View>
// // //           <View style={{position:'absolute',left:210,top:208}} pointerEvents="none"><Clothes w={90} burned={has('clothes')}/></View>

// // //           {fires.filter(f=>has(f[0])).map((f,i)=>
// // //             <View key={i} pointerEvents="none" style={{position:'absolute',left:f[1],top:f[2]}}><Flame w={f[3]} delay={i*90}/></View>)}

// // //           <Animated.View {...pr.panHandlers} style={{position:'absolute',left:TORCH.x,top:TORCH.y,width:TORCH.w,height:TORCH.h,zIndex:10,
// // //             transform:pan.getTranslateTransform()}}><Torch/></Animated.View>
// // //         </View>}
// // //       </Animated.View>
// // //     </View>

// // //     {/* message (above the bottom bar) */}
// // //     {!!note&&<View style={st.noteWrap} pointerEvents="none"><Text style={st.note}>{note}</Text></View>}

// // //     {/* bottom bar */}
// // //     <View style={st.barWrap}>
// // //       <View style={st.bar}>{bar.map(([n,c,f,bg,ic])=>
// // //         <View key={n} style={{alignItems:'center'}}>
// // //           <TouchableOpacity onPress={f} activeOpacity={0.8}
// // //             style={[st.bcircle,{backgroundColor:bg,borderColor:n==='film'?'#fff':bg==='#7ac943'?'#c9ec9a':'#fff'}]}>
// // //             <Icon n={n} s={26}/>
// // //           </TouchableOpacity>
// // //           <View style={st.cost}>
// // //             {ic==='coin'?<View style={st.coin}/>:<Icon n="bulb" s={13}/>}
// // //             <Text style={st.costTx}>{c}</Text>
// // //           </View>
// // //         </View>)}</View>
// // //     </View>
// // //   </View></Stage>;
// // // }

// // // const st=StyleSheet.create({
// // //   root:{flex:1,backgroundColor:'#bcdcf2',paddingTop:34},

// // //   /* room */
// // //   window:{position:'absolute',left:0,top:70,width:80,height:150,backgroundColor:'#e9a95a',borderTopRightRadius:6,borderBottomRightRadius:6,padding:6,paddingLeft:0},
// // //   sky:{width:68,height:92,backgroundColor:'#9fd0f2'},
// // //   cloud:{position:'absolute',left:8,top:12,width:28,height:12,borderRadius:8,backgroundColor:'#fff'},
// // //   sill:{position:'absolute',left:0,right:-6,bottom:26,height:12,backgroundColor:'#f3c58a'},
// // //   pot:{position:'absolute',left:16,bottom:30,width:26,height:22,borderRadius:6,backgroundColor:'#f6e7c8'},
// // //   leafA:{position:'absolute',left:-6,top:-40,width:16,height:42,borderRadius:10,backgroundColor:'#7ac943'},
// // //   leafB:{position:'absolute',left:10,top:-34,width:16,height:36,borderRadius:10,backgroundColor:'#5fb035'},
// // //   poster:{position:'absolute',right:40,top:84,width:60,height:76,backgroundColor:'#a6cdea',borderRadius:4,alignItems:'center',justifyContent:'center'},
// // //   sun:{width:38,height:38,borderRadius:19,backgroundColor:'#f6a73c'},
// // //   bshelf:{position:'absolute',right:0,top:'52%',width:78,height:150,backgroundColor:'#d98a3c',borderTopLeftRadius:6,padding:6,justifyContent:'space-between'},
// // //   row:{flexDirection:'row',gap:3,alignItems:'flex-end'},
// // //   book:{width:14,borderRadius:2},
// // //   plank:{height:4,backgroundColor:'#b86d26',marginHorizontal:-6},
// // //   teddy:{width:30,height:26,borderRadius:12,backgroundColor:'#b9753c'},
// // //   cup:{position:'absolute',right:6,top:'42%',width:36,height:34,backgroundColor:'#f6c93c',borderRadius:4},
// // //   stack:{position:'absolute',left:0,width:90},
// // //   floor:{position:'absolute',left:0,right:0,bottom:0,height:'33%',backgroundColor:'#f3b872'},
// // //   baseboard:{height:12,backgroundColor:'#f0c4c4'},

// // //   /* header */
// // //   head:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',paddingHorizontal:10},
// // //   round:{width:34,height:34,borderRadius:17,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // //   signWrap:{alignItems:'center'},
// // //   rope:{width:2,height:10,backgroundColor:'#7a4b22'},
// // //   sign:{backgroundColor:'#c9783a',borderWidth:3,borderColor:'#8a4a1e',borderRadius:6,paddingHorizontal:16,paddingVertical:4},
// // //   signTx:{fontFamily:F,fontSize:19,fontWeight:'bold',color:'#fff',letterSpacing:1},
// // //   pill:{flexDirection:'row',alignItems:'center',borderRadius:14,paddingHorizontal:10,backgroundColor:'#fff',height:28,marginTop:4},
// // //   pn:{fontFamily:F,fontWeight:'bold',marginRight:4,color:INK},

// // //   qpill:{alignSelf:'center',marginTop:10,backgroundColor:'#fbf1dc',borderRadius:20,paddingHorizontal:22,paddingVertical:7},
// // //   ql:{fontFamily:F,fontSize:19,fontStyle:'italic',color:'#1f2a6b',textAlign:'center'},

// // //   body:{flex:1,alignItems:'center',justifyContent:'center'},
// // //   scene:{width:SW,height:SH},
// // //   load:{fontFamily:F,fontSize:18,color:'#444'},
// // //   noteWrap:{position:'absolute',left:0,right:0,bottom:150,alignItems:'center',zIndex:20},
// // //   note:{fontFamily:F,fontSize:17,fontWeight:'bold',color:'#c0392b',textAlign:'center',backgroundColor:'rgba(255,255,255,0.92)',paddingHorizontal:14,paddingVertical:4,borderRadius:12,overflow:'hidden'},

// // //   /* bottom bar */
// // //   barWrap:{paddingHorizontal:30,paddingBottom:16},
// // //   bar:{flexDirection:'row',justifyContent:'space-around',alignItems:'flex-end',backgroundColor:'#f6e8d0',borderRadius:40,paddingVertical:12,paddingHorizontal:14,borderWidth:4,borderColor:'#bcd8ee'},
// // //   bcircle:{width:58,height:58,borderRadius:29,borderWidth:4,alignItems:'center',justifyContent:'center'},
// // //   cost:{flexDirection:'row',alignItems:'center',backgroundColor:'#7a4b22',borderRadius:12,paddingHorizontal:10,height:24,marginTop:6},
// // //   costTx:{fontFamily:F,fontWeight:'bold',fontSize:14,color:'#fff',marginLeft:4},
// // //   coin:{width:13,height:13,borderRadius:7,backgroundColor:'#f6c93c'},
// // // });
// // import React,{useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Easing} from 'react-native';
// // import {F,INK,Stage} from './BTShared';
// // import {Icon} from './Art';
// // import * as api from './api';
// // import * as l13 from './Btlevel13api';
// // import {Torch,Flame,Cat,Shelf,Sofa,Pillow,Clothes} from './Btlevel13art';

// // /* =====================================================================
// //    LEVEL 13  -  "Burn everything!"
// //    - drag the torch onto things to burn them (sofa, pillow, clothes,
// //      shelf, the cat and the "Burn everything!" text).
// //    - level always starts clean (no fire).
// //    ===================================================================== */

// // const SW=320,SH=300;
// // const TORCH={x:18,y:40,w:44,h:120,tipX:22,tipY:16};

// // // hit boxes inside the 320 x 300 scene: [x, y, w, h]  (checked in this order)
// // const BOX:any={text:[30,-52,260,44],cat:[158,22,52,60],pillow:[140,138,60,52],clothes:[210,208,90,60],shelf:[70,74,180,30],sofa:[35,118,250,140]};
// // const ORDER=['text','cat','pillow','clothes','shelf','sofa'];
// // const ALL=['sofa','pillow','clothes','shelf','cat','text'];
// // const hitTest=(x:number,y:number)=>ORDER.find(k=>{const [bx,by,bw,bh]=BOX[k];return x>=bx&&x<=bx+bw&&y>=by&&y<=by+bh});

// // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;

// // /* ---------- room decoration (background only) ---------- */
// // const Room=({charred}:{charred:boolean})=><View style={StyleSheet.absoluteFill} pointerEvents="none">
// //   <View style={st.window}>
// //     <View style={st.sky}><View style={st.cloud}/><View style={[st.cloud,{left:34,top:30,width:20,height:10}]}/></View>
// //     <View style={st.sill}/>
// //     <View style={st.pot}><View style={st.leafA}/><View style={st.leafB}/></View>
// //   </View>
// //   <View style={st.poster}><View style={st.sun}/></View>
// //   <View style={st.bshelf}>
// //     <View style={st.row}>
// //       {['#3aa0e0','#f0c33c','#8a5fd0'].map((c,i)=><View key={i} style={[st.book,{backgroundColor:c,height:48+(i%2)*6}]}/>)}
// //     </View>
// //     <View style={st.plank}/>
// //     <View style={st.row}>
// //       {['#5a7fd0','#3fb8b0'].map((c,i)=><View key={i} style={[st.book,{backgroundColor:c,height:40}]}/>)}
// //     </View>
// //     <View style={st.plank}/>
// //     <View style={[st.row,{alignItems:'flex-end'}]}><View style={st.teddy}/></View>
// //   </View>
// //   <View style={st.cup}/>
// //   <View style={[st.stack,{backgroundColor:'#3aa0e0',bottom:'33%',height:16}]}/>
// //   <View style={[st.stack,{backgroundColor:'#ee6fb0',bottom:'33%',marginBottom:16,height:22}]}/>
// //   <View style={st.floor}><View style={st.baseboard}/></View>
// //   {charred&&<View style={[StyleSheet.absoluteFill,{backgroundColor:'rgba(40,28,20,0.45)'}]}/>}
// // </View>;

// // export default function BTLevel13Screen({playerId,hints,setHints,onHints,onExit,onComplete}:any){
// //   const [sid,setSid]=useState<number|null>(null);
// //   const [burned,setBurned]=useState<string[]>([]);
// //   const [catGone,setCatGone]=useState(false);
// //   const [note,setNote]=useState('');
// //   const [loading,setLoading]=useState(true);

// //   const sidR=useRef<number|null>(null),busyR=useRef(false),doneR=useRef(false);
// //   const pan=useRef(new Animated.ValueXY()).current;
// //   const shake=useRef(new Animated.Value(0)).current;
// //   const catX=useRef(new Animated.Value(0)).current,catY=useRef(new Animated.Value(0)).current,catO=useRef(new Animated.Value(1)).current;

// //   const setH=(v:number)=>{setHints?.(v);onHints?.(v)};
// //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),2200)};
// //   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();
// //   const runAway=()=>{
// //     setCatGone(true);
// //     Animated.parallel([
// //       Animated.sequence([
// //         Animated.timing(catY,{toValue:-16,duration:220,easing:Easing.out(Easing.quad),useNativeDriver:true}),
// //         Animated.timing(catY,{toValue:62,duration:380,easing:Easing.in(Easing.quad),useNativeDriver:true})]),
// //       Animated.sequence([
// //         Animated.delay(200),
// //         Animated.timing(catX,{toValue:-190,duration:1100,easing:Easing.linear,useNativeDriver:true})]),
// //       Animated.sequence([Animated.delay(900),Animated.timing(catO,{toValue:0,duration:400,useNativeDriver:true})])]).start();
// //   };

// //   /* ---- start a session; always begin with a clean scene (no fire) ---- */
// //   useEffect(()=>{
// //     l13.start(playerId).then(r=>{
// //       sidR.current=r.sessionId;setSid(r.sessionId);setBurned([]);
// //       setLoading(false);
// //     }).catch((e:any)=>{setLoading(false);flash(e?.message||'Cannot load level 13')});
// //   },[]);

// //   const addB=(...k:string[])=>setBurned(b=>Array.from(new Set([...b,...k])));

// //   /* ---- burn something ---- */
// //   const burn=async(item:string)=>{
// //     if(busyR.current||doneR.current)return;
// //     if(item==='text'){addB('text');return}          // text is only visual
// //     if(item==='cat'&&catGone)return;
// //     if(!sidR.current)return;
// //     busyR.current=true;
// //     try{
// //       const r=await l13.burn(playerId,sidR.current,item);
// //       if(item==='cat')addB('cat');
// //       else if(r.newlyBurned?.length)addB(...r.newlyBurned);
// //       else if(r.correct!==false)addB(item);
// //       if(r.catEscaped&&!catGone&&item!=='cat')runAway();
// //       if(r.correct===false&&item!=='cat')doShake();
// //       if(r.message&&item!=='cat')flash(r.message);
// //       if(r.completed&&!doneR.current){
// //         doneR.current=true;
// //         setTimeout(()=>onComplete?.({correct:true,completed:true,attempts:r.attempts}),1500);
// //       }
// //     }catch(e:any){flash(e?.message||'Network error')}
// //     finally{busyR.current=false}
// //   };

// //   /* ---- everything burned (incl. cat + text) -> finish the level ---- */
// //   useEffect(()=>{
// //     if(ALL.every(k=>burned.includes(k))&&!doneR.current){
// //       const t=setTimeout(()=>{
// //         if(doneR.current)return;
// //         doneR.current=true;
// //         onComplete?.({correct:true,completed:true,attempts:1});
// //       },1800);
// //       return()=>clearTimeout(t);
// //     }
// //   },[burned]);

// //   /* ---- draggable torch ---- */
// //   const pr=useRef(PanResponder.create({
// //     onStartShouldSetPanResponder:()=>!busyR.current&&!doneR.current,
// //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// //     onPanResponderRelease:(_,g)=>{
// //       const tx=TORCH.x+g.dx+TORCH.tipX,ty=TORCH.y+g.dy+TORCH.tipY;
// //       const item=hitTest(tx,ty);
// //       Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}).start();
// //       if(item)burn(item);
// //     }})).current;

// //   /* ---- hint / video / skip ---- */
// //   const hint=async()=>{
// //     if(!sidR.current)return;
// //     try{const r=await l13.hint(playerId,sidR.current);if(typeof r.hints==='number')setH(r.hints);if(r.text)flash(r.text)}
// //     catch(e:any){flash(e?.status===402?'Not enough hints':(e?.message||'Network error'))}};
// //   const reward=async(k:'video'|'gift')=>{try{const r=await api.reward(playerId,k);setH(r.hints)}catch(e){}};
// //   const skip=async()=>{
// //     try{const r=await api.skip(13,playerId);if(typeof hints==='number')setH(hints-50);onComplete?.({...r,skipped:true,attempts:1})}
// //     catch(e:any){flash(e?.status===402?'Not enough hints':'Network error')}};

// //   const has=(k:string)=>burned.includes(k);
// //   const allBurned=ALL.every(has);
// //   const fires:[string,number,number,number][]=[
// //     ['sofa',70,92,26],['sofa',150,98,30],['sofa',215,98,26],
// //     ['pillow',156,112,26],
// //     ['clothes',226,176,26],['clothes',258,182,22],
// //     ['shelf',96,48,22],['shelf',140,50,24],['shelf',200,48,22],
// //     ['cat',166,26,24],['cat',186,48,20],
// //     ['text',50,-52,22],['text',140,-56,26],['text',225,-52,22]];

// //   const bar:[string,string,any,string,string][]=[
// //     ['search','25',hint,'#7ac943','bulb'],
// //     ['film','+75',()=>reward('video'),'#ffffff','coin'],
// //     ['play','50',skip,'#ee4850','bulb']];

// //   return <Stage bg="#bcdcf2"><View style={st.root}>
// //     <Room charred={allBurned}/>

// //     {/* top row */}
// //     <View style={st.head}>
// //       <View style={{flexDirection:'row',gap:6}}><Round n="home" onPress={onExit}/><Round n="gear"/></View>
// //       <View style={st.signWrap}>
// //         <View style={st.rope}/>
// //         <View style={st.sign}><Text style={st.signTx}>LEVEL 13</Text></View>
// //       </View>
// //       <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View>
// //     </View>

// //     {/* scene */}
// //     <View style={st.body}>
// //       <Animated.View style={{transform:[{translateX:shake}]}}>
// //         {loading?<Text style={st.load}>Loading level 13...</Text>:
// //         <View style={st.scene}>
// //           {/* instruction text (can be burned) */}
// //           <View style={{position:'absolute',left:30,top:-48,width:260,alignItems:'center'}} pointerEvents="none">
// //             <View style={[st.qpill,{marginTop:0},has('text')&&{backgroundColor:'#2b2420'}]}>
// //               <Text style={[st.ql,has('text')&&{color:'#8a7d75'}]}>Burn everything!</Text>
// //             </View>
// //           </View>

// //           <View style={{position:'absolute',left:70,top:74}} pointerEvents="none"><Shelf w={180} burned={has('shelf')}/></View>
// //           <Animated.View pointerEvents="none" style={{position:'absolute',left:158,top:22,opacity:catO,transform:[{translateX:catX},{translateY:catY}]}}><Cat w={52} burned={has('cat')}/></Animated.View>
// //           <View style={{position:'absolute',left:35,top:118}} pointerEvents="none"><Sofa w={250} burned={has('sofa')}/></View>
// //           <View style={{position:'absolute',left:140,top:138}} pointerEvents="none"><Pillow w={60} burned={has('pillow')}/></View>
// //           <View style={{position:'absolute',left:210,top:208}} pointerEvents="none"><Clothes w={90} burned={has('clothes')}/></View>

// //           {fires.filter(f=>has(f[0])).map((f,i)=>
// //             <View key={i} pointerEvents="none" style={{position:'absolute',left:f[1],top:f[2]}}><Flame w={f[3]} delay={i*90}/></View>)}

// //           <Animated.View {...pr.panHandlers} style={{position:'absolute',left:TORCH.x,top:TORCH.y,width:TORCH.w,height:TORCH.h,zIndex:10,
// //             transform:pan.getTranslateTransform()}}><Torch/></Animated.View>
// //         </View>}
// //       </Animated.View>
// //     </View>

// //     {/* message (above the bottom bar) */}
// //     {!!note&&<View style={st.noteWrap} pointerEvents="none"><Text style={st.note}>{note}</Text></View>}

// //     {/* bottom bar */}
// //     <View style={st.barWrap}>
// //       <View style={st.bar}>{bar.map(([n,c,f,bg,ic])=>
// //         <View key={n} style={{alignItems:'center'}}>
// //           <TouchableOpacity onPress={f} activeOpacity={0.8}
// //             style={[st.bcircle,{backgroundColor:bg,borderColor:n==='film'?'#fff':bg==='#7ac943'?'#c9ec9a':'#fff'}]}>
// //             <Icon n={n} s={26}/>
// //           </TouchableOpacity>
// //           <View style={st.cost}>
// //             {ic==='coin'?<View style={st.coin}/>:<Icon n="bulb" s={13}/>}
// //             <Text style={st.costTx}>{c}</Text>
// //           </View>
// //         </View>)}</View>
// //     </View>
// //   </View></Stage>;
// // }

// // const st=StyleSheet.create({
// //   root:{flex:1,backgroundColor:'#bcdcf2',paddingTop:34},

// //   /* room */
// //   window:{position:'absolute',left:0,top:70,width:80,height:150,backgroundColor:'#e9a95a',borderTopRightRadius:6,borderBottomRightRadius:6,padding:6,paddingLeft:0},
// //   sky:{width:68,height:92,backgroundColor:'#9fd0f2'},
// //   cloud:{position:'absolute',left:8,top:12,width:28,height:12,borderRadius:8,backgroundColor:'#fff'},
// //   sill:{position:'absolute',left:0,right:-6,bottom:26,height:12,backgroundColor:'#f3c58a'},
// //   pot:{position:'absolute',left:16,bottom:30,width:26,height:22,borderRadius:6,backgroundColor:'#f6e7c8'},
// //   leafA:{position:'absolute',left:-6,top:-40,width:16,height:42,borderRadius:10,backgroundColor:'#7ac943'},
// //   leafB:{position:'absolute',left:10,top:-34,width:16,height:36,borderRadius:10,backgroundColor:'#5fb035'},
// //   poster:{position:'absolute',right:40,top:84,width:60,height:76,backgroundColor:'#a6cdea',borderRadius:4,alignItems:'center',justifyContent:'center'},
// //   sun:{width:38,height:38,borderRadius:19,backgroundColor:'#f6a73c'},
// //   bshelf:{position:'absolute',right:0,top:'52%',width:78,height:150,backgroundColor:'#d98a3c',borderTopLeftRadius:6,padding:6,justifyContent:'space-between'},
// //   row:{flexDirection:'row',gap:3,alignItems:'flex-end'},
// //   book:{width:14,borderRadius:2},
// //   plank:{height:4,backgroundColor:'#b86d26',marginHorizontal:-6},
// //   teddy:{width:30,height:26,borderRadius:12,backgroundColor:'#b9753c'},
// //   cup:{position:'absolute',right:6,top:'42%',width:36,height:34,backgroundColor:'#f6c93c',borderRadius:4},
// //   stack:{position:'absolute',left:0,width:90},
// //   floor:{position:'absolute',left:0,right:0,bottom:0,height:'33%',backgroundColor:'#f3b872'},
// //   baseboard:{height:12,backgroundColor:'#f0c4c4'},

// //   /* header */
// //   head:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',paddingHorizontal:10},
// //   round:{width:34,height:34,borderRadius:17,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// //   signWrap:{alignItems:'center'},
// //   rope:{width:2,height:10,backgroundColor:'#7a4b22'},
// //   sign:{backgroundColor:'#c9783a',borderWidth:3,borderColor:'#8a4a1e',borderRadius:6,paddingHorizontal:16,paddingVertical:4},
// //   signTx:{fontFamily:F,fontSize:19,fontWeight:'bold',color:'#fff',letterSpacing:1},
// //   pill:{flexDirection:'row',alignItems:'center',borderRadius:14,paddingHorizontal:10,backgroundColor:'#fff',height:28,marginTop:4},
// //   pn:{fontFamily:F,fontWeight:'bold',marginRight:4,color:INK},

// //   qpill:{alignSelf:'center',marginTop:10,backgroundColor:'#fbf1dc',borderRadius:20,paddingHorizontal:22,paddingVertical:7},
// //   ql:{fontFamily:F,fontSize:19,fontStyle:'italic',color:'#1f2a6b',textAlign:'center'},

// //   body:{flex:1,alignItems:'center',justifyContent:'center'},
// //   scene:{width:SW,height:SH},
// //   load:{fontFamily:F,fontSize:18,color:'#444'},
// //   noteWrap:{position:'absolute',left:0,right:0,bottom:150,alignItems:'center',zIndex:20},
// //   note:{fontFamily:F,fontSize:17,fontWeight:'bold',color:'#c0392b',textAlign:'center',backgroundColor:'rgba(255,255,255,0.92)',paddingHorizontal:14,paddingVertical:4,borderRadius:12,overflow:'hidden'},

// //   /* bottom bar */
// //   barWrap:{paddingHorizontal:30,paddingBottom:16},
// //   bar:{flexDirection:'row',justifyContent:'space-around',alignItems:'flex-end',backgroundColor:'#f6e8d0',borderRadius:40,paddingVertical:12,paddingHorizontal:14,borderWidth:4,borderColor:'#bcd8ee'},
// //   bcircle:{width:58,height:58,borderRadius:29,borderWidth:4,alignItems:'center',justifyContent:'center'},
// //   cost:{flexDirection:'row',alignItems:'center',backgroundColor:'#7a4b22',borderRadius:12,paddingHorizontal:10,height:24,marginTop:6},
// //   costTx:{fontFamily:F,fontSize:14,fontWeight:'bold',color:'#fff',marginLeft:4},
// //   coin:{width:13,height:13,borderRadius:7,backgroundColor:'#f6c93c'},
// // });
// import React,{useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Easing} from 'react-native';
// import {F,INK,Stage} from './BTShared';
// import {Icon} from './Art';
// import * as api from './api';
// import * as l13 from './Btlevel13api';
// import {Torch,Flame,Cat,Shelf,Sofa,Pillow,Clothes} from './Btlevel13art';

// /* =====================================================================
//    LEVEL 13  -  "Burn everything!"
//    - drag the torch onto things to burn them (sofa, pillow, clothes,
//      shelf, the cat and the "Burn everything!" text).
//    - level always starts clean (no fire).
//    - magnifier opens the CLUES popup (clue 1 free, clue 2 costs 25 hints).
//    ===================================================================== */

// const SW=320,SH=300;
// const TORCH={x:18,y:40,w:44,h:120,tipX:22,tipY:16};

// const NAVY='#1c2a6b';
// const BROWN='#b8651f';
// // TODO: change this text if you want a different clue 1
// const CLUE1='"Everything" really means everything… look carefully at what is on the screen!';

// // hit boxes inside the 320 x 300 scene: [x, y, w, h]  (checked in this order)
// const BOX:any={text:[30,-52,260,44],cat:[158,22,52,60],pillow:[140,138,60,52],clothes:[210,208,90,60],shelf:[70,74,180,30],sofa:[35,118,250,140]};
// const ORDER=['text','cat','pillow','clothes','shelf','sofa'];
// const ALL=['sofa','pillow','clothes','shelf','cat','text'];
// const hitTest=(x:number,y:number)=>ORDER.find(k=>{const [bx,by,bw,bh]=BOX[k];return x>=bx&&x<=bx+bw&&y>=by&&y<=by+bh});

// const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;

// /* ---------- room decoration (background only) ---------- */
// const Room=({charred}:{charred:boolean})=><View style={StyleSheet.absoluteFill} pointerEvents="none">
//   <View style={st.window}>
//     <View style={st.sky}><View style={st.cloud}/><View style={[st.cloud,{left:34,top:30,width:20,height:10}]}/></View>
//     <View style={st.sill}/>
//     <View style={st.pot}><View style={st.leafA}/><View style={st.leafB}/></View>
//   </View>
//   <View style={st.poster}><View style={st.sun}/></View>
//   <View style={st.bshelf}>
//     <View style={st.row}>
//       {['#3aa0e0','#f0c33c','#8a5fd0'].map((c,i)=><View key={i} style={[st.book,{backgroundColor:c,height:48+(i%2)*6}]}/>)}
//     </View>
//     <View style={st.plank}/>
//     <View style={st.row}>
//       {['#5a7fd0','#3fb8b0'].map((c,i)=><View key={i} style={[st.book,{backgroundColor:c,height:40}]}/>)}
//     </View>
//     <View style={st.plank}/>
//     <View style={[st.row,{alignItems:'flex-end'}]}><View style={st.teddy}/></View>
//   </View>
//   <View style={st.cup}/>
//   <View style={[st.stack,{backgroundColor:'#3aa0e0',bottom:'33%',height:16}]}/>
//   <View style={[st.stack,{backgroundColor:'#ee6fb0',bottom:'33%',marginBottom:16,height:22}]}/>
//   <View style={st.floor}><View style={st.baseboard}/></View>
//   {charred&&<View style={[StyleSheet.absoluteFill,{backgroundColor:'rgba(40,28,20,0.45)'}]}/>}
// </View>;

// export default function BTLevel13Screen({playerId,hints,setHints,onHints,onExit,onComplete}:any){
//   const [sid,setSid]=useState<number|null>(null);
//   const [burned,setBurned]=useState<string[]>([]);
//   const [catGone,setCatGone]=useState(false);
//   const [note,setNote]=useState('');
//   const [loading,setLoading]=useState(true);
//   const [clueOpen,setClueOpen]=useState(false);
//   const [clue2,setClue2]=useState('');                 // clue 2 text once revealed

//   const sidR=useRef<number|null>(null),busyR=useRef(false),doneR=useRef(false);
//   const pan=useRef(new Animated.ValueXY()).current;
//   const shake=useRef(new Animated.Value(0)).current;
//   const catX=useRef(new Animated.Value(0)).current,catY=useRef(new Animated.Value(0)).current,catO=useRef(new Animated.Value(1)).current;

//   const setH=(v:number)=>{setHints?.(v);onHints?.(v)};
//   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),2200)};
//   const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();
//   const runAway=()=>{
//     setCatGone(true);
//     Animated.parallel([
//       Animated.sequence([
//         Animated.timing(catY,{toValue:-16,duration:220,easing:Easing.out(Easing.quad),useNativeDriver:true}),
//         Animated.timing(catY,{toValue:62,duration:380,easing:Easing.in(Easing.quad),useNativeDriver:true})]),
//       Animated.sequence([
//         Animated.delay(200),
//         Animated.timing(catX,{toValue:-190,duration:1100,easing:Easing.linear,useNativeDriver:true})]),
//       Animated.sequence([Animated.delay(900),Animated.timing(catO,{toValue:0,duration:400,useNativeDriver:true})])]).start();
//   };

//   /* ---- start a session; always begin with a clean scene (no fire) ---- */
//   useEffect(()=>{
//     l13.start(playerId).then(r=>{
//       sidR.current=r.sessionId;setSid(r.sessionId);setBurned([]);
//       setLoading(false);
//     }).catch((e:any)=>{setLoading(false);flash(e?.message||'Cannot load level 13')});
//   },[]);

//   const addB=(...k:string[])=>setBurned(b=>Array.from(new Set([...b,...k])));

//   /* ---- burn something ---- */
//   const burn=async(item:string)=>{
//     if(busyR.current||doneR.current)return;
//     if(item==='text'){addB('text');return}          // text is only visual
//     if(item==='cat'&&catGone)return;
//     if(!sidR.current)return;
//     busyR.current=true;
//     try{
//       const r=await l13.burn(playerId,sidR.current,item);
//       if(item==='cat')addB('cat');
//       else if(r.newlyBurned?.length)addB(...r.newlyBurned);
//       else if(r.correct!==false)addB(item);
//       if(r.catEscaped&&!catGone&&item!=='cat')runAway();
//       if(r.correct===false&&item!=='cat')doShake();
//       if(r.message&&item!=='cat')flash(r.message);
//       if(r.completed&&!doneR.current){
//         doneR.current=true;
//         setTimeout(()=>onComplete?.({correct:true,completed:true,attempts:r.attempts}),1500);
//       }
//     }catch(e:any){flash(e?.message||'Network error')}
//     finally{busyR.current=false}
//   };

//   /* ---- everything burned (incl. cat + text) -> finish the level ---- */
//   useEffect(()=>{
//     if(ALL.every(k=>burned.includes(k))&&!doneR.current){
//       const t=setTimeout(()=>{
//         if(doneR.current)return;
//         doneR.current=true;
//         onComplete?.({correct:true,completed:true,attempts:1});
//       },1800);
//       return()=>clearTimeout(t);
//     }
//   },[burned]);

//   /* ---- draggable torch ---- */
//   const pr=useRef(PanResponder.create({
//     onStartShouldSetPanResponder:()=>!busyR.current&&!doneR.current,
//     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
//     onPanResponderRelease:(_,g)=>{
//       const tx=TORCH.x+g.dx+TORCH.tipX,ty=TORCH.y+g.dy+TORCH.tipY;
//       const item=hitTest(tx,ty);
//       Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}).start();
//       if(item)burn(item);
//     }})).current;

//   /* ---- clues popup / video / skip ---- */
//   const openClues=()=>{if(!doneR.current)setClueOpen(true)};
//   // clue 2 (25 hints): the server tells which thing is still left to burn
//   const revealClue2=async()=>{
//     if(clue2||!sidR.current)return;
//     try{
//       const r=await l13.hint(playerId,sidR.current);
//       if(typeof r.hints==='number')setH(r.hints);
//       setClue2(r.text||'Keep burning!');
//     }catch(e:any){flash(e?.status===402?'Not enough hints':(e?.message||'Network error'));setClueOpen(false)}};
//   const reward=async(k:'video'|'gift')=>{try{const r=await api.reward(playerId,k);setH(r.hints)}catch(e){}};
//   const skip=async()=>{
//     try{const r=await api.skip(13,playerId);if(typeof hints==='number')setH(hints-50);onComplete?.({...r,skipped:true,attempts:1})}
//     catch(e:any){flash(e?.status===402?'Not enough hints':'Network error')}};

//   const has=(k:string)=>burned.includes(k);
//   const allBurned=ALL.every(has);
//   const fires:[string,number,number,number][]=[
//     ['sofa',70,92,26],['sofa',150,98,30],['sofa',215,98,26],
//     ['pillow',156,112,26],
//     ['clothes',226,176,26],['clothes',258,182,22],
//     ['shelf',96,48,22],['shelf',140,50,24],['shelf',200,48,22],
//     ['cat',166,26,24],['cat',186,48,20],
//     ['text',50,-52,22],['text',140,-56,26],['text',225,-52,22]];

//   const bar:[string,string,any,string,string][]=[
//     ['search','25',openClues,'#7ac943','bulb'],
//     ['film','+75',()=>reward('video'),'#ffffff','coin'],
//     ['play','50',skip,'#ee4850','bulb']];

//   return <Stage bg="#bcdcf2"><View style={st.root}>
//     <Room charred={allBurned}/>

//     {/* top row */}
//     <View style={st.head}>
//       <View style={{flexDirection:'row',gap:6}}><Round n="home" onPress={onExit}/><Round n="gear"/></View>
//       <View style={st.signWrap}>
//         <View style={st.rope}/>
//         <View style={st.sign}><Text style={st.signTx}>LEVEL 13</Text></View>
//       </View>
//       <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View>
//     </View>

//     {/* scene */}
//     <View style={st.body}>
//       <Animated.View style={{transform:[{translateX:shake}]}}>
//         {loading?<Text style={st.load}>Loading level 13...</Text>:
//         <View style={st.scene}>
//           {/* instruction text (can be burned) */}
//           <View style={{position:'absolute',left:30,top:-48,width:260,alignItems:'center'}} pointerEvents="none">
//             <View style={[st.qpill,{marginTop:0},has('text')&&{backgroundColor:'#2b2420'}]}>
//               <Text style={[st.ql,has('text')&&{color:'#8a7d75'}]}>Burn everything!</Text>
//             </View>
//           </View>

//           <View style={{position:'absolute',left:70,top:74}} pointerEvents="none"><Shelf w={180} burned={has('shelf')}/></View>
//           <Animated.View pointerEvents="none" style={{position:'absolute',left:158,top:22,opacity:catO,transform:[{translateX:catX},{translateY:catY}]}}><Cat w={52} burned={has('cat')}/></Animated.View>
//           <View style={{position:'absolute',left:35,top:118}} pointerEvents="none"><Sofa w={250} burned={has('sofa')}/></View>
//           <View style={{position:'absolute',left:140,top:138}} pointerEvents="none"><Pillow w={60} burned={has('pillow')}/></View>
//           <View style={{position:'absolute',left:210,top:208}} pointerEvents="none"><Clothes w={90} burned={has('clothes')}/></View>

//           {fires.filter(f=>has(f[0])).map((f,i)=>
//             <View key={i} pointerEvents="none" style={{position:'absolute',left:f[1],top:f[2]}}><Flame w={f[3]} delay={i*90}/></View>)}

//           <Animated.View {...pr.panHandlers} style={{position:'absolute',left:TORCH.x,top:TORCH.y,width:TORCH.w,height:TORCH.h,zIndex:10,
//             transform:pan.getTranslateTransform()}}><Torch/></Animated.View>
//         </View>}
//       </Animated.View>
//     </View>

//     {/* message (above the bottom bar) */}
//     {!!note&&<View style={st.noteWrap} pointerEvents="none"><Text style={st.note}>{note}</Text></View>}

//     {/* bottom bar */}
//     <View style={st.barWrap}>
//       <View style={st.bar}>{bar.map(([n,c,f,bg,ic])=>
//         <View key={n} style={{alignItems:'center'}}>
//           <TouchableOpacity onPress={f} activeOpacity={0.8}
//             style={[st.bcircle,{backgroundColor:bg,borderColor:n==='film'?'#fff':bg==='#7ac943'?'#c9ec9a':'#fff'}]}>
//             <Icon n={n} s={26}/>
//           </TouchableOpacity>
//           <View style={st.cost}>
//             {ic==='coin'?<View style={st.coin}/>:<Icon n="bulb" s={13}/>}
//             <Text style={st.costTx}>{c}</Text>
//           </View>
//         </View>)}</View>
//     </View>

//     {/* CLUES popup */}
//     {clueOpen&&<View style={st.overlay}>
//       <View style={st.clueCard}>
//         <Text style={st.clueTitle}>CLUES</Text>
//         <TouchableOpacity style={st.closeBtn} onPress={()=>setClueOpen(false)}>
//           <Text style={st.closeX}>✕</Text>
//         </TouchableOpacity>

//         <View style={[st.clueBox,{backgroundColor:'#fff',borderColor:'#4cc35f'}]}>
//           <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
//           <View style={{flex:1}}>
//             <Text style={st.clueHead}>Clue 1</Text>
//             <Text style={st.clueText}>{CLUE1}</Text>
//           </View>
//         </View>

//         <TouchableOpacity activeOpacity={clue2?1:0.8} onPress={revealClue2}
//           style={[st.clueBox,clue2?{backgroundColor:'#fff',borderColor:'#4cc35f'}:{backgroundColor:'#fbe6b4',borderColor:'#f2b632'}]}>
//           <View style={st.clueNum}><Text style={st.clueNumT}>2</Text></View>
//           <View style={{flex:1}}>
//             <Text style={st.clueHead}>Clue 2</Text>
//             {clue2
//               ?<Text style={st.clueText}>{clue2}</Text>
//               :<Text style={st.clueTap}>Tap to reveal</Text>}
//           </View>
//         </TouchableOpacity>
//       </View>
//     </View>}
//   </View></Stage>;
// }

// const st=StyleSheet.create({
//   root:{flex:1,backgroundColor:'#bcdcf2',paddingTop:34},

//   /* room */
//   window:{position:'absolute',left:0,top:70,width:80,height:150,backgroundColor:'#e9a95a',borderTopRightRadius:6,borderBottomRightRadius:6,padding:6,paddingLeft:0},
//   sky:{width:68,height:92,backgroundColor:'#9fd0f2'},
//   cloud:{position:'absolute',left:8,top:12,width:28,height:12,borderRadius:8,backgroundColor:'#fff'},
//   sill:{position:'absolute',left:0,right:-6,bottom:26,height:12,backgroundColor:'#f3c58a'},
//   pot:{position:'absolute',left:16,bottom:30,width:26,height:22,borderRadius:6,backgroundColor:'#f6e7c8'},
//   leafA:{position:'absolute',left:-6,top:-40,width:16,height:42,borderRadius:10,backgroundColor:'#7ac943'},
//   leafB:{position:'absolute',left:10,top:-34,width:16,height:36,borderRadius:10,backgroundColor:'#5fb035'},
//   poster:{position:'absolute',right:40,top:84,width:60,height:76,backgroundColor:'#a6cdea',borderRadius:4,alignItems:'center',justifyContent:'center'},
//   sun:{width:38,height:38,borderRadius:19,backgroundColor:'#f6a73c'},
//   bshelf:{position:'absolute',right:0,top:'52%',width:78,height:150,backgroundColor:'#d98a3c',borderTopLeftRadius:6,padding:6,justifyContent:'space-between'},
//   row:{flexDirection:'row',gap:3,alignItems:'flex-end'},
//   book:{width:14,borderRadius:2},
//   plank:{height:4,backgroundColor:'#b86d26',marginHorizontal:-6},
//   teddy:{width:30,height:26,borderRadius:12,backgroundColor:'#b9753c'},
//   cup:{position:'absolute',right:6,top:'42%',width:36,height:34,backgroundColor:'#f6c93c',borderRadius:4},
//   stack:{position:'absolute',left:0,width:90},
//   floor:{position:'absolute',left:0,right:0,bottom:0,height:'33%',backgroundColor:'#f3b872'},
//   baseboard:{height:12,backgroundColor:'#f0c4c4'},

//   /* header */
//   head:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',paddingHorizontal:10},
//   round:{width:34,height:34,borderRadius:17,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   signWrap:{alignItems:'center'},
//   rope:{width:2,height:10,backgroundColor:'#7a4b22'},
//   sign:{backgroundColor:'#c9783a',borderWidth:3,borderColor:'#8a4a1e',borderRadius:6,paddingHorizontal:16,paddingVertical:4},
//   signTx:{fontFamily:F,fontSize:19,fontWeight:'bold',color:'#fff',letterSpacing:1},
//   pill:{flexDirection:'row',alignItems:'center',borderRadius:14,paddingHorizontal:10,backgroundColor:'#fff',height:28,marginTop:4},
//   pn:{fontFamily:F,fontWeight:'bold',marginRight:4,color:INK},

//   qpill:{alignSelf:'center',marginTop:10,backgroundColor:'#fbf1dc',borderRadius:20,paddingHorizontal:22,paddingVertical:7},
//   ql:{fontFamily:F,fontSize:19,fontStyle:'italic',color:'#1f2a6b',textAlign:'center'},

//   body:{flex:1,alignItems:'center',justifyContent:'center'},
//   scene:{width:SW,height:SH},
//   load:{fontFamily:F,fontSize:18,color:'#444'},
//   noteWrap:{position:'absolute',left:0,right:0,bottom:150,alignItems:'center',zIndex:20},
//   note:{fontFamily:F,fontSize:17,fontWeight:'bold',color:'#c0392b',textAlign:'center',backgroundColor:'rgba(255,255,255,0.92)',paddingHorizontal:14,paddingVertical:4,borderRadius:12,overflow:'hidden'},

//   /* bottom bar */
//   barWrap:{paddingHorizontal:30,paddingBottom:16},
//   bar:{flexDirection:'row',justifyContent:'space-around',alignItems:'flex-end',backgroundColor:'#f6e8d0',borderRadius:40,paddingVertical:12,paddingHorizontal:14,borderWidth:4,borderColor:'#bcd8ee'},
//   bcircle:{width:58,height:58,borderRadius:29,borderWidth:4,alignItems:'center',justifyContent:'center'},
//   cost:{flexDirection:'row',alignItems:'center',backgroundColor:'#7a4b22',borderRadius:12,paddingHorizontal:10,height:24,marginTop:6},
//   costTx:{fontFamily:F,fontSize:14,fontWeight:'bold',color:'#fff',marginLeft:4},
//   coin:{width:13,height:13,borderRadius:7,backgroundColor:'#f6c93c'},

//   /* clues popup */
//   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
//   clueCard:{width:'88%',backgroundColor:'#faeedd',borderWidth:5,borderColor:'#e8932f',borderRadius:22,padding:18,paddingTop:16},
//   clueTitle:{fontFamily:F,fontSize:26,fontWeight:'900',color:NAVY,textAlign:'center',marginBottom:12},
//   closeBtn:{position:'absolute',right:10,top:10,width:36,height:36,borderRadius:18,backgroundColor:'#ffe27a',borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   closeX:{fontSize:18,fontWeight:'900',color:'#e63946'},
//   clueBox:{flexDirection:'row',alignItems:'center',gap:14,borderWidth:2.5,borderRadius:16,padding:14,marginBottom:14},
//   clueNum:{width:48,height:48,borderRadius:24,backgroundColor:'#c26a28',alignItems:'center',justifyContent:'center'},
//   clueNumT:{fontFamily:F,fontSize:26,fontWeight:'900',color:'#fff'},
//   clueHead:{fontFamily:F,fontSize:18,fontWeight:'bold',color:BROWN},
//   clueText:{fontFamily:F,fontSize:17,fontStyle:'italic',color:NAVY,marginTop:2},
//   clueTap:{fontFamily:F,fontSize:16,fontWeight:'bold',color:'#7a4a2a',marginTop:2},
// });
import React,{useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Easing} from 'react-native';
import {F,INK,Stage} from './BTShared';
import {Icon} from './Art';
import * as api from './api';
import * as l13 from './Btlevel13api';
import {Torch,Flame,Cat,Shelf,Sofa,Pillow,Clothes} from './Btlevel13art';

/* =====================================================================
   LEVEL 13  -  "Burn everything!"
   - drag the torch onto things to burn them (sofa, pillow, clothes,
     shelf, the cat and the "Burn everything!" text).
   - level always starts clean (no fire).
   - magnifier opens the CLUES popup (clue 1 free, clue 2 costs 25 hints).
   ===================================================================== */

const SW=320,SH=300;
const TORCH={x:18,y:40,w:44,h:120,tipX:22,tipY:16};

const NAVY='#1c2a6b';
const BROWN='#b8651f';
// TODO: change this text if you want a different clue 1
const CLUE1='"Everything" really means everything… look carefully at what is on the screen!';

// hit boxes inside the 320 x 300 scene: [x, y, w, h]  (checked in this order)
const BOX:any={text:[30,-52,260,44],cat:[158,22,52,60],pillow:[140,138,60,52],clothes:[210,208,90,60],shelf:[70,74,180,30],sofa:[35,118,250,140]};
const ORDER=['text','cat','pillow','clothes','shelf','sofa'];
const ALL=['sofa','pillow','clothes','shelf','cat','text'];
const hitTest=(x:number,y:number)=>ORDER.find(k=>{const [bx,by,bw,bh]=BOX[k];return x>=bx&&x<=bx+bw&&y>=by&&y<=by+bh});

const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;

/* ---------- room decoration (background only) ---------- */
const Room=({charred}:{charred:boolean})=><View style={StyleSheet.absoluteFill} pointerEvents="none">
  <View style={st.window}>
    <View style={st.sky}><View style={st.cloud}/><View style={[st.cloud,{left:34,top:30,width:20,height:10}]}/></View>
    <View style={st.sill}/>
    <View style={st.pot}><View style={st.leafA}/><View style={st.leafB}/></View>
  </View>
  <View style={st.poster}><View style={st.sun}/></View>
  <View style={st.bshelf}>
    <View style={st.row}>
      {['#3aa0e0','#f0c33c','#8a5fd0'].map((c,i)=><View key={i} style={[st.book,{backgroundColor:c,height:48+(i%2)*6}]}/>)}
    </View>
    <View style={st.plank}/>
    <View style={st.row}>
      {['#5a7fd0','#3fb8b0'].map((c,i)=><View key={i} style={[st.book,{backgroundColor:c,height:40}]}/>)}
    </View>
    <View style={st.plank}/>
    <View style={[st.row,{alignItems:'flex-end'}]}><View style={st.teddy}/></View>
  </View>
  <View style={st.cup}/>
  <View style={[st.stack,{backgroundColor:'#3aa0e0',bottom:'33%',height:16}]}/>
  <View style={[st.stack,{backgroundColor:'#ee6fb0',bottom:'33%',marginBottom:16,height:22}]}/>
  <View style={st.floor}><View style={st.baseboard}/></View>
  {charred&&<View style={[StyleSheet.absoluteFill,{backgroundColor:'rgba(40,28,20,0.45)'}]}/>}
</View>;

export default function BTLevel13Screen({playerId,hints,setHints,onHints,onExit,onComplete}:any){
  const [sid,setSid]=useState<number|null>(null);
  const [burned,setBurned]=useState<string[]>([]);
  const [catGone,setCatGone]=useState(false);
  const [note,setNote]=useState('');
  const [loading,setLoading]=useState(true);
  const [clueOpen,setClueOpen]=useState(false);

  const sidR=useRef<number|null>(null),busyR=useRef(false),doneR=useRef(false);
  const pan=useRef(new Animated.ValueXY()).current;
  const shake=useRef(new Animated.Value(0)).current;
  const catX=useRef(new Animated.Value(0)).current,catY=useRef(new Animated.Value(0)).current,catO=useRef(new Animated.Value(1)).current;

  const setH=(v:number)=>{setHints?.(v);onHints?.(v)};
  const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),2200)};
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();
  const runAway=()=>{
    setCatGone(true);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(catY,{toValue:-16,duration:220,easing:Easing.out(Easing.quad),useNativeDriver:true}),
        Animated.timing(catY,{toValue:62,duration:380,easing:Easing.in(Easing.quad),useNativeDriver:true})]),
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(catX,{toValue:-190,duration:1100,easing:Easing.linear,useNativeDriver:true})]),
      Animated.sequence([Animated.delay(900),Animated.timing(catO,{toValue:0,duration:400,useNativeDriver:true})])]).start();
  };

  /* ---- start a session; always begin with a clean scene (no fire) ---- */
  useEffect(()=>{
    l13.start(playerId).then(r=>{
      sidR.current=r.sessionId;setSid(r.sessionId);setBurned([]);
      setLoading(false);
    }).catch((e:any)=>{setLoading(false);flash(e?.message||'Cannot load level 13')});
  },[]);

  const addB=(...k:string[])=>setBurned(b=>Array.from(new Set([...b,...k])));

  /* ---- burn something ---- */
  const burn=async(item:string)=>{
    if(busyR.current||doneR.current)return;
    if(item==='text'){addB('text');return}          // text is only visual
    if(item==='cat'&&catGone)return;
    if(!sidR.current)return;
    busyR.current=true;
    try{
      const r=await l13.burn(playerId,sidR.current,item);
      if(item==='cat')addB('cat');
      else if(r.newlyBurned?.length)addB(...r.newlyBurned);
      else if(r.correct!==false)addB(item);
      if(r.catEscaped&&!catGone&&item!=='cat')runAway();
      if(r.correct===false&&item!=='cat')doShake();
      if(r.message&&item!=='cat')flash(r.message);
      if(r.completed&&!doneR.current){
        doneR.current=true;
        setTimeout(()=>onComplete?.({correct:true,completed:true,attempts:r.attempts}),1500);
      }
    }catch(e:any){flash(e?.message||'Network error')}
    finally{busyR.current=false}
  };

  /* ---- everything burned (incl. cat + text) -> finish the level ---- */
  useEffect(()=>{
    if(ALL.every(k=>burned.includes(k))&&!doneR.current){
      const t=setTimeout(()=>{
        if(doneR.current)return;
        doneR.current=true;
        onComplete?.({correct:true,completed:true,attempts:1});
      },1800);
      return()=>clearTimeout(t);
    }
  },[burned]);

  /* ---- draggable torch ---- */
  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>!busyR.current&&!doneR.current,
    onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
    onPanResponderRelease:(_,g)=>{
      const tx=TORCH.x+g.dx+TORCH.tipX,ty=TORCH.y+g.dy+TORCH.tipY;
      const item=hitTest(tx,ty);
      Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}).start();
      if(item)burn(item);
    }})).current;

  /* ---- clues popup / video / skip ---- */
  const openClues=()=>{if(!doneR.current)setClueOpen(true)};
  const reward=async(k:'video'|'gift')=>{try{const r=await api.reward(playerId,k);setH(r.hints)}catch(e){}};
  const skip=async()=>{
    try{const r=await api.skip(13,playerId);if(typeof hints==='number')setH(hints-50);onComplete?.({...r,skipped:true,attempts:1})}
    catch(e:any){flash(e?.status===402?'Not enough hints':'Network error')}};

  const has=(k:string)=>burned.includes(k);
  const allBurned=ALL.every(has);
  const fires:[string,number,number,number][]=[
    ['sofa',70,92,26],['sofa',150,98,30],['sofa',215,98,26],
    ['pillow',156,112,26],
    ['clothes',226,176,26],['clothes',258,182,22],
    ['shelf',96,48,22],['shelf',140,50,24],['shelf',200,48,22],
    ['cat',166,26,24],['cat',186,48,20],
    ['text',50,-52,22],['text',140,-56,26],['text',225,-52,22]];

  const bar:[string,string,any,string,string][]=[
    ['search','25',openClues,'#7ac943','bulb'],
    ['film','+75',()=>reward('video'),'#ffffff','coin'],
    ['play','50',skip,'#ee4850','bulb']];

  return <Stage bg="#bcdcf2"><View style={st.root}>
    <Room charred={allBurned}/>

    {/* top row */}
    <View style={st.head}>
      <View style={{flexDirection:'row',gap:6}}><Round n="home" onPress={onExit}/><Round n="gear"/></View>
      <View style={st.signWrap}>
        <View style={st.rope}/>
        <View style={st.sign}><Text style={st.signTx}>LEVEL 13</Text></View>
      </View>
      <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View>
    </View>

    {/* scene */}
    <View style={st.body}>
      <Animated.View style={{transform:[{translateX:shake}]}}>
        {loading?<Text style={st.load}>Loading level 13...</Text>:
        <View style={st.scene}>
          {/* instruction text (can be burned) */}
          <View style={{position:'absolute',left:30,top:-48,width:260,alignItems:'center'}} pointerEvents="none">
            <View style={[st.qpill,{marginTop:0},has('text')&&{backgroundColor:'#2b2420'}]}>
              <Text style={[st.ql,has('text')&&{color:'#8a7d75'}]}>Burn everything!</Text>
            </View>
          </View>

          <View style={{position:'absolute',left:70,top:74}} pointerEvents="none"><Shelf w={180} burned={has('shelf')}/></View>
          <Animated.View pointerEvents="none" style={{position:'absolute',left:158,top:22,opacity:catO,transform:[{translateX:catX},{translateY:catY}]}}><Cat w={52} burned={has('cat')}/></Animated.View>
          <View style={{position:'absolute',left:35,top:118}} pointerEvents="none"><Sofa w={250} burned={has('sofa')}/></View>
          <View style={{position:'absolute',left:140,top:138}} pointerEvents="none"><Pillow w={60} burned={has('pillow')}/></View>
          <View style={{position:'absolute',left:210,top:208}} pointerEvents="none"><Clothes w={90} burned={has('clothes')}/></View>

          {fires.filter(f=>has(f[0])).map((f,i)=>
            <View key={i} pointerEvents="none" style={{position:'absolute',left:f[1],top:f[2]}}><Flame w={f[3]} delay={i*90}/></View>)}

          <Animated.View {...pr.panHandlers} style={{position:'absolute',left:TORCH.x,top:TORCH.y,width:TORCH.w,height:TORCH.h,zIndex:10,
            transform:pan.getTranslateTransform()}}><Torch/></Animated.View>
        </View>}
      </Animated.View>
    </View>

    {/* message (above the bottom bar) */}
    {!!note&&<View style={st.noteWrap} pointerEvents="none"><Text style={st.note}>{note}</Text></View>}

    {/* bottom bar */}
    <View style={st.barWrap}>
      <View style={st.bar}>{bar.map(([n,c,f,bg,ic])=>
        <View key={n} style={{alignItems:'center'}}>
          <TouchableOpacity onPress={f} activeOpacity={0.8}
            style={[st.bcircle,{backgroundColor:bg,borderColor:n==='film'?'#fff':bg==='#7ac943'?'#c9ec9a':'#fff'}]}>
            <Icon n={n} s={26}/>
          </TouchableOpacity>
          <View style={st.cost}>
            {ic==='coin'?<View style={st.coin}/>:<Icon n="bulb" s={13}/>}
            <Text style={st.costTx}>{c}</Text>
          </View>
        </View>)}</View>
    </View>

    {/* CLUES popup */}
    {clueOpen&&<View style={st.overlay}>
      <View style={st.clueCard}>
        <Text style={st.clueTitle}>CLUES</Text>
        <TouchableOpacity style={st.closeBtn} onPress={()=>setClueOpen(false)}>
          <Text style={st.closeX}>✕</Text>
        </TouchableOpacity>

        <View style={[st.clueBox,{backgroundColor:'#fff',borderColor:'#4cc35f'}]}>
          <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
          <View style={{flex:1}}>
            <Text style={st.clueHead}>Clue 1</Text>
            <Text style={st.clueText}>{CLUE1}</Text>
          </View>
        </View>
      </View>
    </View>}
  </View></Stage>;
}

const st=StyleSheet.create({
  root:{flex:1,backgroundColor:'#bcdcf2',paddingTop:34},

  /* room */
  window:{position:'absolute',left:0,top:70,width:80,height:150,backgroundColor:'#e9a95a',borderTopRightRadius:6,borderBottomRightRadius:6,padding:6,paddingLeft:0},
  sky:{width:68,height:92,backgroundColor:'#9fd0f2'},
  cloud:{position:'absolute',left:8,top:12,width:28,height:12,borderRadius:8,backgroundColor:'#fff'},
  sill:{position:'absolute',left:0,right:-6,bottom:26,height:12,backgroundColor:'#f3c58a'},
  pot:{position:'absolute',left:16,bottom:30,width:26,height:22,borderRadius:6,backgroundColor:'#f6e7c8'},
  leafA:{position:'absolute',left:-6,top:-40,width:16,height:42,borderRadius:10,backgroundColor:'#7ac943'},
  leafB:{position:'absolute',left:10,top:-34,width:16,height:36,borderRadius:10,backgroundColor:'#5fb035'},
  poster:{position:'absolute',right:40,top:84,width:60,height:76,backgroundColor:'#a6cdea',borderRadius:4,alignItems:'center',justifyContent:'center'},
  sun:{width:38,height:38,borderRadius:19,backgroundColor:'#f6a73c'},
  bshelf:{position:'absolute',right:0,top:'52%',width:78,height:150,backgroundColor:'#d98a3c',borderTopLeftRadius:6,padding:6,justifyContent:'space-between'},
  row:{flexDirection:'row',gap:3,alignItems:'flex-end'},
  book:{width:14,borderRadius:2},
  plank:{height:4,backgroundColor:'#b86d26',marginHorizontal:-6},
  teddy:{width:30,height:26,borderRadius:12,backgroundColor:'#b9753c'},
  cup:{position:'absolute',right:6,top:'42%',width:36,height:34,backgroundColor:'#f6c93c',borderRadius:4},
  stack:{position:'absolute',left:0,width:90},
  floor:{position:'absolute',left:0,right:0,bottom:0,height:'33%',backgroundColor:'#f3b872'},
  baseboard:{height:12,backgroundColor:'#f0c4c4'},

  /* header */
  head:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',paddingHorizontal:10},
  round:{width:34,height:34,borderRadius:17,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
  signWrap:{alignItems:'center'},
  rope:{width:2,height:10,backgroundColor:'#7a4b22'},
  sign:{backgroundColor:'#c9783a',borderWidth:3,borderColor:'#8a4a1e',borderRadius:6,paddingHorizontal:16,paddingVertical:4},
  signTx:{fontFamily:F,fontSize:19,fontWeight:'bold',color:'#fff',letterSpacing:1},
  pill:{flexDirection:'row',alignItems:'center',borderRadius:14,paddingHorizontal:10,backgroundColor:'#fff',height:28,marginTop:4},
  pn:{fontFamily:F,fontWeight:'bold',marginRight:4,color:INK},

  qpill:{alignSelf:'center',marginTop:10,backgroundColor:'#fbf1dc',borderRadius:20,paddingHorizontal:22,paddingVertical:7},
  ql:{fontFamily:F,fontSize:19,fontStyle:'italic',color:'#1f2a6b',textAlign:'center'},

  body:{flex:1,alignItems:'center',justifyContent:'center'},
  scene:{width:SW,height:SH},
  load:{fontFamily:F,fontSize:18,color:'#444'},
  noteWrap:{position:'absolute',left:0,right:0,bottom:150,alignItems:'center',zIndex:20},
  note:{fontFamily:F,fontSize:17,fontWeight:'bold',color:'#c0392b',textAlign:'center',backgroundColor:'rgba(255,255,255,0.92)',paddingHorizontal:14,paddingVertical:4,borderRadius:12,overflow:'hidden'},

  /* bottom bar */
  barWrap:{paddingHorizontal:30,paddingBottom:16},
  bar:{flexDirection:'row',justifyContent:'space-around',alignItems:'flex-end',backgroundColor:'#f6e8d0',borderRadius:40,paddingVertical:12,paddingHorizontal:14,borderWidth:4,borderColor:'#bcd8ee'},
  bcircle:{width:58,height:58,borderRadius:29,borderWidth:4,alignItems:'center',justifyContent:'center'},
  cost:{flexDirection:'row',alignItems:'center',backgroundColor:'#7a4b22',borderRadius:12,paddingHorizontal:10,height:24,marginTop:6},
  costTx:{fontFamily:F,fontSize:14,fontWeight:'bold',color:'#fff',marginLeft:4},
  coin:{width:13,height:13,borderRadius:7,backgroundColor:'#f6c93c'},

  /* clues popup */
  overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
  clueCard:{width:'88%',backgroundColor:'#faeedd',borderWidth:5,borderColor:'#e8932f',borderRadius:22,padding:18,paddingTop:16},
  clueTitle:{fontFamily:F,fontSize:26,fontWeight:'900',color:NAVY,textAlign:'center',marginBottom:12},
  closeBtn:{position:'absolute',right:10,top:10,width:36,height:36,borderRadius:18,backgroundColor:'#ffe27a',borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},
  closeX:{fontSize:18,fontWeight:'900',color:'#e63946'},
  clueBox:{flexDirection:'row',alignItems:'center',gap:14,borderWidth:2.5,borderRadius:16,padding:14,marginBottom:14},
  clueNum:{width:48,height:48,borderRadius:24,backgroundColor:'#c26a28',alignItems:'center',justifyContent:'center'},
  clueNumT:{fontFamily:F,fontSize:26,fontWeight:'900',color:'#fff'},
  clueHead:{fontFamily:F,fontSize:18,fontWeight:'bold',color:BROWN},
  clueText:{fontFamily:F,fontSize:17,fontStyle:'italic',color:NAVY,marginTop:2},
  clueTap:{fontFamily:F,fontSize:16,fontWeight:'bold',color:'#7a4a2a',marginTop:2},
});
