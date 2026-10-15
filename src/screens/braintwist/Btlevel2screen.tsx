// // // // // // src/screens/braintwist/BTLevel2Screen.tsx
// // // // // //
// // // // // // Level 2: "Make a flower" -> "Color a flower"  (chalkboard design)
// // // // // //
// // // // // // Flow
// // // // // //   1. screen opens      -> POST /level2/start   -> backend sends stage 1 (blurred smudge)
// // // // // //   2. drag a tool onto the flower -> POST /level2/action
// // // // // //   3. backend says correct / wrong:
// // // // // //        wrong   -> tool jumps back, flower shakes, chalk message
// // // // // //        stage 1 -> smudge fades, flower lines are drawn, title + tools change
// // // // // //        stage 2 -> flower is painted, result card (stars + score) appears
// // // // // //   The frontend never knows the right answer, it only draws what the backend sends.

// // // // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Platform,ActivityIndicator,useWindowDimensions} from 'react-native';
// // // // // import {startLevel2,dropTool,Level2View,Level2Action} from './btLevel2api';
// // // // // import {ChalkFlower,ToolIcon,Sparks,DashedArrow,HomeIcon,GearIcon,BulbIcon,StarIcon,ChalkTray} from './BTLevel2art';

// // // // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // // const BOARD='#1d6a49',FRAME='#e08a2e',PAGE='#f4e4c6',LIME='#a6e22e',CREAM='#f7f1df',YELLOW='#ffd33d';

// // // // // type Props={
// // // // //   playerId:number;
// // // // //   hints?:number;
// // // // //   onExit:()=>void;
// // // // //   onComplete?:(result:Level2Action)=>void;
// // // // // };

// // // // // type DropResult='ok'|'wrong'|'error';

// // // // // /* =========================================================
// // // // //    ONE DRAGGABLE TOOL
// // // // // ========================================================= */

// // // // // function ToolButton({tool,size,selected,disabled,flowerRef,onSelect,onDrop}:any){
// // // // //   const pan=useRef(new Animated.ValueXY()).current;
// // // // //   const scale=useRef(new Animated.Value(1)).current;
// // // // //   const rot=useRef(new Animated.Value(0)).current;
// // // // //   const fade=useRef(new Animated.Value(1)).current;
// // // // //   const live=useRef({disabled,onSelect,onDrop,tool});
// // // // //   live.current={disabled,onSelect,onDrop,tool};

// // // // //   const back=()=>{
// // // // //     Animated.parallel([
// // // // //       Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}),
// // // // //       Animated.spring(scale,{toValue:1,friction:6,useNativeDriver:false})]).start();
// // // // //   };

// // // // //   // finger lifted: is the tool on top of the flower?
// // // // //   const release=(g:any)=>{
// // // // //     const f=flowerRef.current;
// // // // //     if(!f||!f.measureInWindow){back();return}
// // // // //     f.measureInWindow(async(x:number,y:number,w:number,h:number)=>{
// // // // //       const pad=24;
// // // // //       const hit=g.moveX>=x-pad&&g.moveX<=x+w+pad&&g.moveY>=y-pad&&g.moveY<=y+h+pad;
// // // // //       if(!hit){back();return}
// // // // //       const res:DropResult=await live.current.onDrop(live.current.tool.id);
// // // // //       if(res==='ok'){
// // // // //         // the tool "works" on the flower, then disappears
// // // // //         Animated.sequence([
// // // // //           Animated.timing(rot,{toValue:1,duration:150,useNativeDriver:false}),
// // // // //           Animated.timing(rot,{toValue:-1,duration:300,useNativeDriver:false}),
// // // // //           Animated.timing(rot,{toValue:0,duration:150,useNativeDriver:false}),
// // // // //           Animated.timing(fade,{toValue:0,duration:300,useNativeDriver:false})]).start();
// // // // //       }else back();
// // // // //     });
// // // // //   };

// // // // //   const pr=useRef(PanResponder.create({
// // // // //     onStartShouldSetPanResponder:()=>!live.current.disabled,
// // // // //     onPanResponderGrant:()=>{
// // // // //       live.current.onSelect(live.current.tool.id);
// // // // //       Animated.spring(scale,{toValue:1.3,useNativeDriver:false}).start();
// // // // //     },
// // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // //     onPanResponderRelease:(_,g)=>release(g),
// // // // //     onPanResponderTerminate:()=>back(),
// // // // //   })).current;

// // // // //   const ring=size+16;
// // // // //   const rotate=rot.interpolate({inputRange:[-1,1],outputRange:['-25deg','25deg']});

// // // // //   return <View style={{alignItems:'center',width:ring+10}}>
// // // // //     <View style={{width:ring,height:ring,borderRadius:ring/2,borderWidth:2,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.65)',alignItems:'center',justifyContent:'center'}}>
// // // // //       <View style={{width:size,height:size,borderRadius:size/2,backgroundColor:selected?LIME:CREAM}}/>
// // // // //       <Animated.View {...pr.panHandlers} style={{position:'absolute',width:size,height:size,alignItems:'center',justifyContent:'center',zIndex:30,
// // // // //         opacity:fade,transform:[{translateX:pan.x},{translateY:pan.y},{scale},{rotate}]}}>
// // // // //         <ToolIcon id={tool.id} size={size*0.8}/>
// // // // //       </Animated.View>
// // // // //     </View>
// // // // //     <Text style={st.toolLabel}>{tool.label}</Text>
// // // // //   </View>;
// // // // // }

// // // // // /* =========================================================
// // // // //    SCREEN
// // // // // ========================================================= */

// // // // // export default function BTLevel2Screen({playerId,hints=0,onExit,onComplete}:Props){
// // // // //   const {width,height}=useWindowDimensions();
// // // // //   const bw=Math.min(width,480);
// // // // //   const ts=Math.min(82,Math.floor((bw-16-70)/3.4));
// // // // //   const fh=Math.min(340,Math.max(220,height*0.36));
// // // // //   const fw=fh*0.75;

// // // // //   const [view,setView]=useState<Level2View|null>(null);
// // // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // // //   const [loadErr,setLoadErr]=useState('');
// // // // //   const [msg,setMsg]=useState('');
// // // // //   const [busy,setBusy]=useState(false);
// // // // //   const [selected,setSelected]=useState<string|null>(null);
// // // // //   const [result,setResult]=useState<Level2Action|null>(null);

// // // // //   const fade=useRef(new Animated.Value(1)).current;
// // // // //   const shake=useRef(new Animated.Value(0)).current;
// // // // //   const bob=useRef(new Animated.Value(0)).current;
// // // // //   const pop=useRef(new Animated.Value(0)).current;
// // // // //   const flowerRef=useRef<any>(null);
// // // // //   const timers=useRef<any[]>([]);
// // // // //   const msgTimer=useRef<any>(null);

// // // // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // // // //   // 1. open the level (backend creates or resumes the session)
// // // // //   const load=useCallback(()=>{
// // // // //     setLoadErr('');setView(null);
// // // // //     startLevel2(playerId)
// // // // //       .then(v=>{setSessionId(v.sessionId);setView(v);setSelected(v.hintTool)})
// // // // //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// // // // //   },[playerId]);

// // // // //   useEffect(()=>{
// // // // //     load();
// // // // //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// // // // //   },[load]);

// // // // //   // the hint tool bobs up and down
// // // // //   useEffect(()=>{
// // // // //     const l=Animated.loop(Animated.sequence([
// // // // //       Animated.timing(bob,{toValue:1,duration:600,useNativeDriver:true}),
// // // // //       Animated.timing(bob,{toValue:0,duration:600,useNativeDriver:true})]));
// // // // //     l.start();
// // // // //     return()=>l.stop();
// // // // //   },[]);

// // // // //   // result card pops in
// // // // //   useEffect(()=>{
// // // // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // // // //   },[result]);

// // // // //   const showMsg=(m:string)=>{
// // // // //     setMsg(m);
// // // // //     clearTimeout(msgTimer.current);
// // // // //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// // // // //   };

// // // // //   const shakeFlower=()=>{
// // // // //     Animated.sequence([
// // // // //       Animated.timing(shake,{toValue:10,duration:60,useNativeDriver:true}),
// // // // //       Animated.timing(shake,{toValue:-10,duration:60,useNativeDriver:true}),
// // // // //       Animated.timing(shake,{toValue:6,duration:60,useNativeDriver:true}),
// // // // //       Animated.timing(shake,{toValue:0,duration:60,useNativeDriver:true})]).start();
// // // // //   };

// // // // //   // title, hint and tools fade out, change, fade in
// // // // //   const swapTo=(next:Level2View)=>{
// // // // //     Animated.timing(fade,{toValue:0,duration:160,useNativeDriver:true}).start(()=>{
// // // // //       setView(next);setSelected(next.hintTool);setMsg('');
// // // // //       Animated.timing(fade,{toValue:1,duration:320,useNativeDriver:true}).start(()=>setBusy(false));
// // // // //     });
// // // // //   };

// // // // //   // 2. a tool was dropped on the flower -> ask the backend
// // // // //   const handleDrop=async(tool:string):Promise<DropResult>=>{
// // // // //     if(busy||!sessionId||!view)return 'error';
// // // // //     setBusy(true);setMsg('');
// // // // //     try{
// // // // //       const res=await dropTool({sessionId,playerId,tool});

// // // // //       if(!res.correct){
// // // // //         showMsg(res.message||'Not quite. Try again!');
// // // // //         shakeFlower();
// // // // //         setBusy(false);
// // // // //         return 'wrong';
// // // // //       }

// // // // //       if(res.completed){
// // // // //         // paint the flower, then show the result card
// // // // //         later(()=>setView(v=>v&&{...v,flower:'colored'}),700);
// // // // //         later(()=>setResult(res),3000);
// // // // //       }else{
// // // // //         // stage 1 done: reveal the flower and load stage 2
// // // // //         later(()=>swapTo(res as Level2View),750);
// // // // //       }
// // // // //       return 'ok';
// // // // //     }catch(e:any){
// // // // //       showMsg(e.message||'Network error');
// // // // //       setBusy(false);
// // // // //       return 'error';
// // // // //     }
// // // // //   };

// // // // //   /* ---------- loading / error ---------- */

// // // // //   if(loadErr||!view){
// // // // //     return <View style={st.page}>
// // // // //       <View style={[st.frame,{width:bw-16}]}>
// // // // //         <View style={[st.board,{alignItems:'center',justifyContent:'center'}]}>
// // // // //           {loadErr?<>
// // // // //             <Text style={st.errText}>{loadErr}</Text>
// // // // //             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // // //             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // // //           </>:<>
// // // // //             <ActivityIndicator color="#fff" size="large"/>
// // // // //             <Text style={st.loading}>Loading level 2...</Text>
// // // // //           </>}
// // // // //         </View>
// // // // //       </View>
// // // // //     </View>;
// // // // //   }

// // // // //   const hintText=(msg||view.hint).replace(' onto','\nonto');

// // // // //   return <View style={st.page}>
// // // // //     <View style={[st.frame,{width:bw-16}]}>
// // // // //       <View style={st.board}>

// // // // //         {/* header */}
// // // // //         <View style={st.header}>
// // // // //           <View style={st.headLeft}>
// // // // //             <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon/></TouchableOpacity>
// // // // //             <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon/></TouchableOpacity>
// // // // //           </View>
// // // // //           <View style={st.plaque}>
// // // // //             <Text style={st.chev}>‹</Text>
// // // // //             <Text style={st.plaqueT}>LEVEL 2</Text>
// // // // //             <Text style={st.chev}>›</Text>
// // // // //           </View>
// // // // //           <View style={st.pillWrap}>
// // // // //             <View style={st.pill}><Text style={st.pillT}>{hints}</Text></View>
// // // // //             <View style={st.bulb}><BulbIcon size={28}/></View>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* title */}
// // // // //         <Animated.View style={[st.titleRow,{opacity:fade}]}>
// // // // //           <Sparks/>
// // // // //           <Text style={st.title}>{view.title}</Text>
// // // // //           <Sparks flip/>
// // // // //         </Animated.View>

// // // // //         {/* flower */}
// // // // //         <View style={st.flowerArea}>
// // // // //           <Animated.View style={{transform:[{translateX:shake}]}}>
// // // // //             <View ref={flowerRef} collapsable={false} style={{width:fw,height:fh}}>
// // // // //               <ChalkFlower phase={view.flower} width={fw}/>
// // // // //             </View>
// // // // //           </Animated.View>
// // // // //         </View>

// // // // //         {/* hint */}
// // // // //         <Animated.View style={[st.hintRow,{opacity:fade}]}>
// // // // //           <Animated.View style={{transform:[{translateY:bob.interpolate({inputRange:[0,1],outputRange:[0,-6]})},{rotate:'-12deg'}]}}>
// // // // //             <ToolIcon id={view.hintTool} size={60}/>
// // // // //           </Animated.View>
// // // // //           <View style={{marginTop:-18}}><DashedArrow/></View>
// // // // //           <Text style={[st.hintText,msg?{color:YELLOW}:null]}>{hintText}</Text>
// // // // //         </Animated.View>

// // // // //         {/* tools: drag one onto the flower */}
// // // // //         <Animated.View style={[st.toolsRow,{opacity:fade}]}>
// // // // //           {view.tools.map(t=>
// // // // //             <ToolButton key={view.stage+'-'+t.id} tool={t} size={ts} selected={selected===t.id}
// // // // //               disabled={busy||!!result} flowerRef={flowerRef} onSelect={setSelected} onDrop={handleDrop}/>)}
// // // // //         </Animated.View>

// // // // //         <ChalkTray/>

// // // // //         {/* result card */}
// // // // //         {!!result&&<View style={st.overlay}>
// // // // //           <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // // // //             <Text style={st.cardTitle}>Level complete!</Text>
// // // // //             <Text style={st.cardMsg}>{result.message}</Text>
// // // // //             <View style={st.stars}>{[1,2,3].map(n=><StarIcon key={n} size={46} on={n<=(result.stars||0)}/>)}</View>
// // // // //             <Text style={st.cardScore}>Score {result.score}</Text>
// // // // //             <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // // // //               <Text style={st.nextT}>NEXT</Text>
// // // // //             </TouchableOpacity>
// // // // //           </Animated.View>
// // // // //         </View>}
// // // // //       </View>
// // // // //     </View>
// // // // //   </View>;
// // // // // }

// // // // // /* =========================================================
// // // // //    STYLES
// // // // // ========================================================= */

// // // // // const st=StyleSheet.create({
// // // // //   page:{flex:1,backgroundColor:PAGE,alignItems:'center'},
// // // // //   frame:{flex:1,marginVertical:8,backgroundColor:FRAME,borderRadius:22,padding:9,
// // // // //     shadowColor:'#000',shadowOffset:{width:0,height:6},shadowOpacity:0.2,shadowRadius:10,elevation:6},
// // // // //   board:{flex:1,backgroundColor:BOARD,borderRadius:14,overflow:'hidden',paddingTop:14},

// // // // //   header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12},
// // // // //   headLeft:{flexDirection:'row',gap:8},
// // // // //   round:{width:44,height:44,borderRadius:22,backgroundColor:'#ffd83a',borderWidth:2.5,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
// // // // //   plaque:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#9a5a1c',borderWidth:3,borderColor:'#c98a3e',borderRadius:6,paddingHorizontal:14,paddingVertical:5},
// // // // //   plaqueT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:'#fff',letterSpacing:0.5},
// // // // //   chev:{fontSize:26,fontWeight:'900',color:YELLOW,marginTop:-3},
// // // // //   pillWrap:{width:84,height:44,justifyContent:'center'},
// // // // //   pill:{height:36,borderRadius:18,backgroundColor:'#fff',justifyContent:'center',paddingLeft:18,paddingRight:30},
// // // // //   pillT:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#1b1b1b'},
// // // // //   bulb:{position:'absolute',right:-4,top:-2},

// // // // //   titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,marginTop:16},
// // // // //   title:{fontFamily:FONT,fontSize:34,fontWeight:'700',color:'#fff'},

// // // // //   flowerArea:{flex:1,alignItems:'center',justifyContent:'center'},

// // // // //   hintRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,paddingHorizontal:12,minHeight:64},
// // // // //   hintText:{fontFamily:FONT,fontSize:19,lineHeight:25,fontWeight:'600',color:'#fff',flexShrink:1,maxWidth:200},

// // // // //   toolsRow:{flexDirection:'row',justifyContent:'space-evenly',alignItems:'flex-start',paddingHorizontal:8,marginTop:10,marginBottom:6,zIndex:20},
// // // // //   toolLabel:{fontFamily:FONT,fontSize:18,fontWeight:'600',color:'#fff',marginTop:6},

// // // // //   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
// // // // //   card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
// // // // //   cardTitle:{fontFamily:FONT,fontSize:30,fontWeight:'800',color:'#fff'},
// // // // //   cardMsg:{fontFamily:FONT,fontSize:18,color:'#d8f3e3',textAlign:'center',marginTop:6},
// // // // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // // // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:YELLOW,marginTop:10},
// // // // //   next:{marginTop:18,minWidth:170,height:58,borderRadius:29,backgroundColor:LIME,borderWidth:3,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
// // // // //   nextT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#1b1b1b'},

// // // // //   loading:{fontFamily:FONT,fontSize:18,color:'#fff',marginTop:12},
// // // // //   errText:{fontFamily:FONT,fontSize:18,color:'#fff',textAlign:'center',paddingHorizontal:24},
// // // // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:LIME,borderWidth:2.5,borderColor:'#1b1b1b'},
// // // // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:'#1b1b1b'},
// // // // //   back:{fontFamily:FONT,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
// // // // // });
// // // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Platform,ActivityIndicator,useWindowDimensions} from 'react-native';
// // // // import {startLevel2,dropTool,Level2View,Level2Action} from './Btlevel2api';
// // // // import {ChalkFlower,ToolIcon,Sparks,DashedArrow,HomeIcon,GearIcon,BulbIcon,StarIcon,ChalkTray} from './BTLevel2art';

// // // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // const BOARD='#1d6a49',FRAME='#e08a2e',PAGE='#f4e4c6',LIME='#a6e22e',CREAM='#f7f1df',YELLOW='#ffd33d';

// // // // type Props={
// // // //   playerId:number;
// // // //   hints?:number;
// // // //   onExit:()=>void;
// // // //   onComplete?:(result:Level2Action)=>void;
// // // // };

// // // // type DropResult='ok'|'wrong'|'error';

// // // // /* =========================================================
// // // //    ONE DRAGGABLE TOOL
// // // // ========================================================= */

// // // // function ToolButton({tool,size,selected,disabled,flowerRef,onSelect,onDrop}:any){
// // // //   const pan=useRef(new Animated.ValueXY()).current;
// // // //   const scale=useRef(new Animated.Value(1)).current;
// // // //   const rot=useRef(new Animated.Value(0)).current;
// // // //   const fade=useRef(new Animated.Value(1)).current;
// // // //   const live=useRef({disabled,onSelect,onDrop,tool});
// // // //   live.current={disabled,onSelect,onDrop,tool};

// // // //   const back=()=>{
// // // //     Animated.parallel([
// // // //       Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}),
// // // //       Animated.spring(scale,{toValue:1,friction:6,useNativeDriver:false})]).start();
// // // //   };

// // // //   // finger lifted: is the tool on top of the flower?
// // // //   const release=(g:any)=>{
// // // //     const f=flowerRef.current;
// // // //     if(!f||!f.measureInWindow){back();return}
// // // //     f.measureInWindow(async(x:number,y:number,w:number,h:number)=>{
// // // //       const pad=24;
// // // //       const hit=g.moveX>=x-pad&&g.moveX<=x+w+pad&&g.moveY>=y-pad&&g.moveY<=y+h+pad;
// // // //       if(!hit){back();return}
// // // //       const res:DropResult=await live.current.onDrop(live.current.tool.id);
// // // //       if(res==='ok'){
// // // //         // the tool "works" on the flower, then disappears
// // // //         Animated.sequence([
// // // //           Animated.timing(rot,{toValue:1,duration:150,useNativeDriver:false}),
// // // //           Animated.timing(rot,{toValue:-1,duration:300,useNativeDriver:false}),
// // // //           Animated.timing(rot,{toValue:0,duration:150,useNativeDriver:false}),
// // // //           Animated.timing(fade,{toValue:0,duration:300,useNativeDriver:false})]).start();
// // // //       }else back();
// // // //     });
// // // //   };

// // // //   const pr=useRef(PanResponder.create({
// // // //     onStartShouldSetPanResponder:()=>!live.current.disabled,
// // // //     onPanResponderGrant:()=>{
// // // //       live.current.onSelect(live.current.tool.id);
// // // //       Animated.spring(scale,{toValue:1.3,useNativeDriver:false}).start();
// // // //     },
// // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // //     onPanResponderRelease:(_,g)=>release(g),
// // // //     onPanResponderTerminate:()=>back(),
// // // //   })).current;

// // // //   const ring=size+16;
// // // //   const rotate=rot.interpolate({inputRange:[-1,1],outputRange:['-25deg','25deg']});

// // // //   return <View style={{alignItems:'center',width:ring+10}}>
// // // //     <View style={{width:ring,height:ring,borderRadius:ring/2,borderWidth:2,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.65)',alignItems:'center',justifyContent:'center'}}>
// // // //       <View style={{width:size,height:size,borderRadius:size/2,backgroundColor:selected?LIME:CREAM}}/>
// // // //       <Animated.View {...pr.panHandlers} style={{position:'absolute',width:size,height:size,alignItems:'center',justifyContent:'center',zIndex:30,
// // // //         opacity:fade,transform:[{translateX:pan.x},{translateY:pan.y},{scale},{rotate}]}}>
// // // //         <ToolIcon id={tool.id} size={size*0.8}/>
// // // //       </Animated.View>
// // // //     </View>
// // // //     <Text style={st.toolLabel}>{tool.label}</Text>
// // // //   </View>;
// // // // }

// // // // /* =========================================================
// // // //    SCREEN
// // // // ========================================================= */

// // // // export default function BTLevel2Screen({playerId,hints=0,onExit,onComplete}:Props){
// // // //   const {width,height}=useWindowDimensions();
// // // //   const bw=Math.min(width,480);
// // // //   const ts=Math.min(82,Math.floor((bw-16-70)/3.4));
// // // //   const fh=Math.min(340,Math.max(220,height*0.36));
// // // //   const fw=fh*0.75;

// // // //   const [view,setView]=useState<Level2View|null>(null);
// // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // //   const [loadErr,setLoadErr]=useState('');
// // // //   const [msg,setMsg]=useState('');
// // // //   const [busy,setBusy]=useState(false);
// // // //   const [selected,setSelected]=useState<string|null>(null);
// // // //   const [result,setResult]=useState<Level2Action|null>(null);

// // // //   const fade=useRef(new Animated.Value(1)).current;
// // // //   const shake=useRef(new Animated.Value(0)).current;
// // // //   const bob=useRef(new Animated.Value(0)).current;
// // // //   const pop=useRef(new Animated.Value(0)).current;
// // // //   const flowerRef=useRef<any>(null);
// // // //   const timers=useRef<any[]>([]);
// // // //   const msgTimer=useRef<any>(null);

// // // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // // //   // 1. open the level (backend creates or resumes the session)
// // // //   const load=useCallback(()=>{
// // // //     setLoadErr('');setView(null);
// // // //     startLevel2(playerId)
// // // //       .then(v=>{setSessionId(v.sessionId);setView(v);setSelected(v.hintTool)})
// // // //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// // // //   },[playerId]);

// // // //   useEffect(()=>{
// // // //     load();
// // // //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// // // //   },[load]);

// // // //   // the hint tool bobs up and down
// // // //   useEffect(()=>{
// // // //     const l=Animated.loop(Animated.sequence([
// // // //       Animated.timing(bob,{toValue:1,duration:600,useNativeDriver:true}),
// // // //       Animated.timing(bob,{toValue:0,duration:600,useNativeDriver:true})]));
// // // //     l.start();
// // // //     return()=>l.stop();
// // // //   },[]);

// // // //   // result card pops in
// // // //   useEffect(()=>{
// // // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // // //   },[result]);

// // // //   const showMsg=(m:string)=>{
// // // //     setMsg(m);
// // // //     clearTimeout(msgTimer.current);
// // // //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// // // //   };

// // // //   const shakeFlower=()=>{
// // // //     Animated.sequence([
// // // //       Animated.timing(shake,{toValue:10,duration:60,useNativeDriver:true}),
// // // //       Animated.timing(shake,{toValue:-10,duration:60,useNativeDriver:true}),
// // // //       Animated.timing(shake,{toValue:6,duration:60,useNativeDriver:true}),
// // // //       Animated.timing(shake,{toValue:0,duration:60,useNativeDriver:true})]).start();
// // // //   };

// // // //   // title, hint and tools fade out, change, fade in
// // // //   const swapTo=(next:Level2View)=>{
// // // //     Animated.timing(fade,{toValue:0,duration:160,useNativeDriver:true}).start(()=>{
// // // //       setView(next);setSelected(next.hintTool);setMsg('');
// // // //       Animated.timing(fade,{toValue:1,duration:320,useNativeDriver:true}).start(()=>setBusy(false));
// // // //     });
// // // //   };

// // // //   // 2. a tool was dropped on the flower -> ask the backend
// // // //   const handleDrop=async(tool:string):Promise<DropResult>=>{
// // // //     if(busy||!sessionId||!view)return 'error';
// // // //     setBusy(true);setMsg('');
// // // //     try{
// // // //       const res=await dropTool({sessionId,playerId,tool});

// // // //       if(!res.correct){
// // // //         showMsg(res.message||'Not quite. Try again!');
// // // //         shakeFlower();
// // // //         setBusy(false);
// // // //         return 'wrong';
// // // //       }

// // // //       if(res.completed){
// // // //         // paint the flower, then show the result card
// // // //         later(()=>setView(v=>v&&{...v,flower:'colored'}),700);
// // // //         later(()=>setResult(res),3000);
// // // //       }else{
// // // //         // stage 1 done: reveal the flower and load stage 2
// // // //         later(()=>swapTo(res as Level2View),750);
// // // //       }
// // // //       return 'ok';
// // // //     }catch(e:any){
// // // //       showMsg(e.message||'Network error');
// // // //       setBusy(false);
// // // //       return 'error';
// // // //     }
// // // //   };

// // // //   /* ---------- loading / error ---------- */

// // // //   if(loadErr||!view){
// // // //     return <View style={st.page}>
// // // //       <View style={[st.frame,{width:bw-16}]}>
// // // //         <View style={[st.board,{alignItems:'center',justifyContent:'center'}]}>
// // // //           {loadErr?<>
// // // //             <Text style={st.errText}>{loadErr}</Text>
// // // //             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // //             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // //           </>:<>
// // // //             <ActivityIndicator color="#fff" size="large"/>
// // // //             <Text style={st.loading}>Loading level 2...</Text>
// // // //           </>}
// // // //         </View>
// // // //       </View>
// // // //     </View>;
// // // //   }

// // // //   const hintText=(msg||view.hint).replace(' onto','\nonto');

// // // //   return <View style={st.page}>
// // // //     <View style={[st.frame,{width:bw-16}]}>
// // // //       <View style={st.board}>

// // // //         {/* header */}
// // // //         <View style={st.header}>
// // // //           <View style={st.headLeft}>
// // // //             <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon/></TouchableOpacity>
// // // //             <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon/></TouchableOpacity>
// // // //           </View>
// // // //           <View style={st.plaque}>
// // // //             <Text style={st.chev}>‹</Text>
// // // //             <Text style={st.plaqueT}>LEVEL 2</Text>
// // // //             <Text style={st.chev}>›</Text>
// // // //           </View>
// // // //           <View style={st.pillWrap}>
// // // //             <View style={st.pill}><Text style={st.pillT}>{hints}</Text></View>
// // // //             <View style={st.bulb}><BulbIcon size={28}/></View>
// // // //           </View>
// // // //         </View>

// // // //         {/* title */}
// // // //         <Animated.View style={[st.titleRow,{opacity:fade}]}>
// // // //           <Sparks/>
// // // //           <Text style={st.title}>{view.title}</Text>
// // // //           <Sparks flip/>
// // // //         </Animated.View>

// // // //         {/* flower */}
// // // //         <View style={st.flowerArea}>
// // // //           <Animated.View style={{transform:[{translateX:shake}]}}>
// // // //             <View ref={flowerRef} collapsable={false} style={{width:fw,height:fh}}>
// // // //               <ChalkFlower phase={view.flower} width={fw}/>
// // // //             </View>
// // // //           </Animated.View>
// // // //         </View>

// // // //         {/* hint */}
// // // //         <Animated.View style={[st.hintRow,{opacity:fade}]}>
// // // //           <Animated.View style={{transform:[{translateY:bob.interpolate({inputRange:[0,1],outputRange:[0,-6]})},{rotate:'-12deg'}]}}>
// // // //             <ToolIcon id={view.hintTool} size={60}/>
// // // //           </Animated.View>
// // // //           <View style={{marginTop:-18}}><DashedArrow/></View>
// // // //           <Text style={[st.hintText,msg?{color:YELLOW}:null]}>{hintText}</Text>
// // // //         </Animated.View>

// // // //         {/* tools: drag one onto the flower */}
// // // //         <Animated.View style={[st.toolsRow,{opacity:fade}]}>
// // // //           {view.tools.map(t=>
// // // //             <ToolButton key={view.stage+'-'+t.id} tool={t} size={ts} selected={selected===t.id}
// // // //               disabled={busy||!!result} flowerRef={flowerRef} onSelect={setSelected} onDrop={handleDrop}/>)}
// // // //         </Animated.View>

// // // //         <ChalkTray/>

// // // //         {/* result card */}
// // // //         {!!result&&<View style={st.overlay}>
// // // //           <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // // //             <Text style={st.cardTitle}>Level complete!</Text>
// // // //             <Text style={st.cardMsg}>{result.message}</Text>
// // // //             <View style={st.stars}>{[1,2,3].map(n=><StarIcon key={n} size={46} on={n<=(result.stars||0)}/>)}</View>
// // // //             <Text style={st.cardScore}>Score {result.score}</Text>
// // // //             <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // // //               <Text style={st.nextT}>NEXT</Text>
// // // //             </TouchableOpacity>
// // // //           </Animated.View>
// // // //         </View>}
// // // //       </View>
// // // //     </View>
// // // //   </View>;
// // // // }

// // // // /* =========================================================
// // // //    STYLES
// // // // ========================================================= */

// // // // const st=StyleSheet.create({
// // // //   page:{flex:1,backgroundColor:PAGE,alignItems:'center'},
// // // //   frame:{flex:1,marginVertical:8,backgroundColor:FRAME,borderRadius:22,padding:9,
// // // //     shadowColor:'#000',shadowOffset:{width:0,height:6},shadowOpacity:0.2,shadowRadius:10,elevation:6},
// // // //   board:{flex:1,backgroundColor:BOARD,borderRadius:14,overflow:'hidden',paddingTop:14},

// // // //   header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12},
// // // //   headLeft:{flexDirection:'row',gap:8},
// // // //   round:{width:44,height:44,borderRadius:22,backgroundColor:'#ffd83a',borderWidth:2.5,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
// // // //   plaque:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#9a5a1c',borderWidth:3,borderColor:'#c98a3e',borderRadius:6,paddingHorizontal:14,paddingVertical:5},
// // // //   plaqueT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:'#fff',letterSpacing:0.5},
// // // //   chev:{fontSize:26,fontWeight:'900',color:YELLOW,marginTop:-3},
// // // //   pillWrap:{width:84,height:44,justifyContent:'center'},
// // // //   pill:{height:36,borderRadius:18,backgroundColor:'#fff',justifyContent:'center',paddingLeft:18,paddingRight:30},
// // // //   pillT:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#1b1b1b'},
// // // //   bulb:{position:'absolute',right:-4,top:-2},

// // // //   titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,marginTop:16},
// // // //   title:{fontFamily:FONT,fontSize:34,fontWeight:'700',color:'#fff'},

// // // //   flowerArea:{flex:1,alignItems:'center',justifyContent:'center'},

// // // //   hintRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,paddingHorizontal:12,minHeight:64},
// // // //   hintText:{fontFamily:FONT,fontSize:19,lineHeight:25,fontWeight:'600',color:'#fff',flexShrink:1,maxWidth:200},

// // // //   toolsRow:{flexDirection:'row',justifyContent:'space-evenly',alignItems:'flex-start',paddingHorizontal:8,marginTop:10,marginBottom:6,zIndex:20},
// // // //   toolLabel:{fontFamily:FONT,fontSize:18,fontWeight:'600',color:'#fff',marginTop:6},

// // // //   overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
// // // //   card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
// // // //   cardTitle:{fontFamily:FONT,fontSize:30,fontWeight:'800',color:'#fff'},
// // // //   cardMsg:{fontFamily:FONT,fontSize:18,color:'#d8f3e3',textAlign:'center',marginTop:6},
// // // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:YELLOW,marginTop:10},
// // // //   next:{marginTop:18,minWidth:170,height:58,borderRadius:29,backgroundColor:LIME,borderWidth:3,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
// // // //   nextT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#1b1b1b'},

// // // //   loading:{fontFamily:FONT,fontSize:18,color:'#fff',marginTop:12},
// // // //   errText:{fontFamily:FONT,fontSize:18,color:'#fff',textAlign:'center',paddingHorizontal:24},
// // // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:LIME,borderWidth:2.5,borderColor:'#1b1b1b'},
// // // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:'#1b1b1b'},
// // // //   back:{fontFamily:FONT,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
// // // // });
// // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Platform,ActivityIndicator,useWindowDimensions} from 'react-native';
// // // import {startLevel2,dropTool,Level2View,Level2Action} from './Btlevel2api';
// // // import {ChalkFlower,ToolIcon,Sparks,DashedArrow,HomeIcon,GearIcon,BulbIcon,StarIcon,ChalkTray} from './Btlevel2art';

// // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // const BOARD='#1d6a49',FRAME='#e08a2e',PAGE='#f4e4c6',LIME='#a6e22e',CREAM='#f7f1df',YELLOW='#ffd33d';

// // // type Props={
// // //   playerId:number;
// // //   hints?:number;
// // //   onExit:()=>void;
// // //   onComplete?:(result:Level2Action)=>void;
// // // };

// // // type DropResult='ok'|'wrong'|'error';

// // // /* =========================================================
// // //    ONE DRAGGABLE TOOL
// // // ========================================================= */

// // // function ToolButton({tool,size,selected,disabled,flowerRef,onSelect,onDrop}:any){
// // //   const pan=useRef(new Animated.ValueXY()).current;
// // //   const scale=useRef(new Animated.Value(1)).current;
// // //   const rot=useRef(new Animated.Value(0)).current;
// // //   const fade=useRef(new Animated.Value(1)).current;
// // //   const live=useRef({disabled,onSelect,onDrop,tool});
// // //   live.current={disabled,onSelect,onDrop,tool};

// // //   const back=()=>{
// // //     Animated.parallel([
// // //       Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}),
// // //       Animated.spring(scale,{toValue:1,friction:6,useNativeDriver:false})]).start();
// // //   };

// // //   // finger lifted: is the tool on top of the flower?
// // //   const release=(g:any)=>{
// // //     const f=flowerRef.current;
// // //     if(!f||!f.measureInWindow){back();return}
// // //     f.measureInWindow(async(x:number,y:number,w:number,h:number)=>{
// // //       const pad=24;
// // //       const hit=g.moveX>=x-pad&&g.moveX<=x+w+pad&&g.moveY>=y-pad&&g.moveY<=y+h+pad;
// // //       if(!hit){back();return}
// // //       const res:DropResult=await live.current.onDrop(live.current.tool.id);
// // //       if(res==='ok'){
// // //         // the tool "works" on the flower, then disappears
// // //         Animated.sequence([
// // //           Animated.timing(rot,{toValue:1,duration:150,useNativeDriver:false}),
// // //           Animated.timing(rot,{toValue:-1,duration:300,useNativeDriver:false}),
// // //           Animated.timing(rot,{toValue:0,duration:150,useNativeDriver:false}),
// // //           Animated.timing(fade,{toValue:0,duration:300,useNativeDriver:false})]).start();
// // //       }else back();
// // //     });
// // //   };

// // //   const pr=useRef(PanResponder.create({
// // //     onStartShouldSetPanResponder:()=>!live.current.disabled,
// // //     onPanResponderGrant:()=>{
// // //       live.current.onSelect(live.current.tool.id);
// // //       Animated.spring(scale,{toValue:1.3,useNativeDriver:false}).start();
// // //     },
// // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // //     onPanResponderRelease:(_,g)=>release(g),
// // //     onPanResponderTerminate:()=>back(),
// // //   })).current;

// // //   const ring=size+16;
// // //   const rotate=rot.interpolate({inputRange:[-1,1],outputRange:['-25deg','25deg']});

// // //   return <View style={{alignItems:'center',width:ring+10}}>
// // //     <View style={{width:ring,height:ring,borderRadius:ring/2,borderWidth:2,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.65)',alignItems:'center',justifyContent:'center'}}>
// // //       <View style={{width:size,height:size,borderRadius:size/2,backgroundColor:selected?LIME:CREAM}}/>
// // //       <Animated.View {...pr.panHandlers} style={{position:'absolute',width:size,height:size,alignItems:'center',justifyContent:'center',zIndex:30,
// // //         opacity:fade,transform:[{translateX:pan.x},{translateY:pan.y},{scale},{rotate}]}}>
// // //         <ToolIcon id={tool.id} size={size*0.8}/>
// // //       </Animated.View>
// // //     </View>
// // //     <Text style={st.toolLabel}>{tool.label}</Text>
// // //   </View>;
// // // }

// // // /* =========================================================
// // //    SCREEN
// // // ========================================================= */

// // // export default function BTLevel2Screen({playerId,hints=0,onExit,onComplete}:Props){
// // //   const {width,height}=useWindowDimensions();
// // //   const bw=Math.min(width,480);
// // //   const ts=Math.min(82,Math.floor((bw-16-70)/3.4));
// // //   const fh=Math.min(340,Math.max(220,height*0.36));
// // //   const fw=fh*0.75;

// // //   const [view,setView]=useState<Level2View|null>(null);
// // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // //   const [loadErr,setLoadErr]=useState('');
// // //   const [msg,setMsg]=useState('');
// // //   const [busy,setBusy]=useState(false);
// // //   const [selected,setSelected]=useState<string|null>(null);
// // //   const [result,setResult]=useState<Level2Action|null>(null);

// // //   const fade=useRef(new Animated.Value(1)).current;
// // //   const shake=useRef(new Animated.Value(0)).current;
// // //   const bob=useRef(new Animated.Value(0)).current;
// // //   const pop=useRef(new Animated.Value(0)).current;
// // //   const flowerRef=useRef<any>(null);
// // //   const timers=useRef<any[]>([]);
// // //   const msgTimer=useRef<any>(null);

// // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // //   // 1. open the level (backend creates or resumes the session)
// // //   const load=useCallback(()=>{
// // //     setLoadErr('');setView(null);
// // //     startLevel2(playerId)
// // //       .then(v=>{setSessionId(v.sessionId);setView(v);setSelected(v.hintTool)})
// // //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// // //   },[playerId]);

// // //   useEffect(()=>{
// // //     load();
// // //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// // //   },[load]);

// // //   // the hint tool bobs up and down
// // //   useEffect(()=>{
// // //     const l=Animated.loop(Animated.sequence([
// // //       Animated.timing(bob,{toValue:1,duration:600,useNativeDriver:true}),
// // //       Animated.timing(bob,{toValue:0,duration:600,useNativeDriver:true})]));
// // //     l.start();
// // //     return()=>l.stop();
// // //   },[]);

// // //   // result card pops in
// // //   useEffect(()=>{
// // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // //   },[result]);

// // //   const showMsg=(m:string)=>{
// // //     setMsg(m);
// // //     clearTimeout(msgTimer.current);
// // //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// // //   };

// // //   const shakeFlower=()=>{
// // //     Animated.sequence([
// // //       Animated.timing(shake,{toValue:10,duration:60,useNativeDriver:true}),
// // //       Animated.timing(shake,{toValue:-10,duration:60,useNativeDriver:true}),
// // //       Animated.timing(shake,{toValue:6,duration:60,useNativeDriver:true}),
// // //       Animated.timing(shake,{toValue:0,duration:60,useNativeDriver:true})]).start();
// // //   };

// // //   // title, hint and tools fade out, change, fade in
// // //   const swapTo=(next:Level2View)=>{
// // //     Animated.timing(fade,{toValue:0,duration:160,useNativeDriver:true}).start(()=>{
// // //       setView(next);setSelected(next.hintTool);setMsg('');
// // //       Animated.timing(fade,{toValue:1,duration:320,useNativeDriver:true}).start(()=>setBusy(false));
// // //     });
// // //   };

// // //   // 2. a tool was dropped on the flower -> ask the backend
// // //   const handleDrop=async(tool:string):Promise<DropResult>=>{
// // //     if(busy||!sessionId||!view)return 'error';
// // //     setBusy(true);setMsg('');
// // //     try{
// // //       const res=await dropTool({sessionId,playerId,tool});

// // //       if(!res.correct){
// // //         showMsg(res.message||'Not quite. Try again!');
// // //         shakeFlower();
// // //         setBusy(false);
// // //         return 'wrong';
// // //       }

// // //       if(res.completed){
// // //         // paint the flower, then show the result card
// // //         later(()=>setView(v=>v&&{...v,flower:'colored'}),700);
// // //         later(()=>setResult(res),3000);
// // //       }else{
// // //         // stage 1 done: reveal the flower and load stage 2
// // //         later(()=>swapTo(res as Level2View),750);
// // //       }
// // //       return 'ok';
// // //     }catch(e:any){
// // //       showMsg(e.message||'Network error');
// // //       setBusy(false);
// // //       return 'error';
// // //     }
// // //   };

// // //   /* ---------- loading / error ---------- */

// // //   if(loadErr||!view){
// // //     return <View style={st.page}>
// // //       <View style={[st.frame,{width:bw-16}]}>
// // //         <View style={[st.board,{alignItems:'center',justifyContent:'center'}]}>
// // //           {loadErr?<>
// // //             <Text style={st.errText}>{loadErr}</Text>
// // //             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // //             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // //           </>:<>
// // //             <ActivityIndicator color="#fff" size="large"/>
// // //             <Text style={st.loading}>Loading level 2...</Text>
// // //           </>}
// // //         </View>
// // //       </View>
// // //     </View>;
// // //   }

// // //   const hintText=(msg||view.hint).replace(' onto','\nonto');

// // //   return <View style={st.page}>
// // //     <View style={[st.frame,{width:bw-16}]}>
// // //       <View style={st.board}>

// // //         {/* header */}
// // //         <View style={st.header}>
// // //           <View style={st.headLeft}>
// // //             <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon/></TouchableOpacity>
// // //             <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon/></TouchableOpacity>
// // //           </View>
// // //           <View style={st.plaque}>
// // //             <Text style={st.chev}>‹</Text>
// // //             <Text style={st.plaqueT}>LEVEL 2</Text>
// // //             <Text style={st.chev}>›</Text>
// // //           </View>
// // //           <View style={st.pillWrap}>
// // //             <View style={st.pill}><Text style={st.pillT}>{hints}</Text></View>
// // //             <View style={st.bulb}><BulbIcon size={28}/></View>
// // //           </View>
// // //         </View>

// // //         {/* title */}
// // //         <Animated.View style={[st.titleRow,{opacity:fade}]}>
// // //           <Sparks/>
// // //           <Text style={st.title}>{view.title}</Text>
// // //           <Sparks flip/>
// // //         </Animated.View>

// // //         {/* flower */}
// // //         <View style={st.flowerArea}>
// // //           <Animated.View style={{transform:[{translateX:shake}]}}>
// // //             <View ref={flowerRef} collapsable={false} style={{width:fw,height:fh}}>
// // //               <ChalkFlower phase={view.flower} width={fw}/>
// // //             </View>
// // //           </Animated.View>
// // //         </View>

// // //         {/* hint */}
// // //         <Animated.View style={[st.hintRow,{opacity:fade}]}>
// // //           <Animated.View style={{transform:[{translateY:bob.interpolate({inputRange:[0,1],outputRange:[0,-6]})},{rotate:'-12deg'}]}}>
// // //             <ToolIcon id={view.hintTool} size={60}/>
// // //           </Animated.View>
// // //           <View style={{marginTop:-18}}><DashedArrow/></View>
// // //           <Text style={[st.hintText,msg?{color:YELLOW}:null]}>{hintText}</Text>
// // //         </Animated.View>

// // //         {/* tools: drag one onto the flower */}
// // //         <Animated.View style={[st.toolsRow,{opacity:fade}]}>
// // //           {view.tools.map(t=>
// // //             <ToolButton key={view.stage+'-'+t.id} tool={t} size={ts} selected={selected===t.id}
// // //               disabled={busy||!!result} flowerRef={flowerRef} onSelect={setSelected} onDrop={handleDrop}/>)}
// // //         </Animated.View>

// // //         <ChalkTray/>

// // //         {/* result card */}
// // //         {!!result&&<View style={st.overlay}>
// // //           <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // //             <Text style={st.cardTitle}>Level complete!</Text>
// // //             <Text style={st.cardMsg}>{result.message}</Text>
// // //             <View style={st.stars}>{[1,2,3].map(n=><StarIcon key={n} size={46} on={n<=(result.stars||0)}/>)}</View>
// // //             <Text style={st.cardScore}>Score {result.score}</Text>
// // //             <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // //               <Text style={st.nextT}>NEXT</Text>
// // //             </TouchableOpacity>
// // //           </Animated.View>
// // //         </View>}
// // //       </View>
// // //     </View>
// // //   </View>;
// // // }

// // // /* =========================================================
// // //    STYLES
// // // ========================================================= */

// // // const st=StyleSheet.create({
// // //   page:{flex:1,backgroundColor:PAGE,alignItems:'center'},
// // //   frame:{flex:1,marginVertical:8,backgroundColor:FRAME,borderRadius:22,padding:9,
// // //     shadowColor:'#000',shadowOffset:{width:0,height:6},shadowOpacity:0.2,shadowRadius:10,elevation:6},
// // //   board:{flex:1,backgroundColor:BOARD,borderRadius:14,overflow:'hidden',paddingTop:14},

// // //   header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12},
// // //   headLeft:{flexDirection:'row',gap:8},
// // //   round:{width:44,height:44,borderRadius:22,backgroundColor:'#ffd83a',borderWidth:2.5,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
// // //   plaque:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#9a5a1c',borderWidth:3,borderColor:'#c98a3e',borderRadius:6,paddingHorizontal:14,paddingVertical:5},
// // //   plaqueT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:'#fff',letterSpacing:0.5},
// // //   chev:{fontSize:26,fontWeight:'900',color:YELLOW,marginTop:-3},
// // //   pillWrap:{width:84,height:44,justifyContent:'center'},
// // //   pill:{height:36,borderRadius:18,backgroundColor:'#fff',justifyContent:'center',paddingLeft:18,paddingRight:30},
// // //   pillT:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#1b1b1b'},
// // //   bulb:{position:'absolute',right:-4,top:-2},

// // //   titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,marginTop:16},
// // //   title:{fontFamily:FONT,fontSize:34,fontWeight:'700',color:'#fff'},

// // //   flowerArea:{flex:1,alignItems:'center',justifyContent:'center'},

// // //   hintRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,paddingHorizontal:12,minHeight:64},
// // //   hintText:{fontFamily:FONT,fontSize:19,lineHeight:25,fontWeight:'600',color:'#fff',flexShrink:1,maxWidth:200},

// // //   toolsRow:{flexDirection:'row',justifyContent:'space-evenly',alignItems:'flex-start',paddingHorizontal:8,marginTop:10,marginBottom:6,zIndex:20},
// // //   toolLabel:{fontFamily:FONT,fontSize:18,fontWeight:'600',color:'#fff',marginTop:6},

// // //   overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
// // //   card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
// // //   cardTitle:{fontFamily:FONT,fontSize:30,fontWeight:'800',color:'#fff'},
// // //   cardMsg:{fontFamily:FONT,fontSize:18,color:'#d8f3e3',textAlign:'center',marginTop:6},
// // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:YELLOW,marginTop:10},
// // //   next:{marginTop:18,minWidth:170,height:58,borderRadius:29,backgroundColor:LIME,borderWidth:3,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
// // //   nextT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#1b1b1b'},

// // //   loading:{fontFamily:FONT,fontSize:18,color:'#fff',marginTop:12},
// // //   errText:{fontFamily:FONT,fontSize:18,color:'#fff',textAlign:'center',paddingHorizontal:24},
// // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:LIME,borderWidth:2.5,borderColor:'#1b1b1b'},
// // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:'#1b1b1b'},
// // //   back:{fontFamily:FONT,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
// // // });
// // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Platform,ActivityIndicator,useWindowDimensions} from 'react-native';
// // import {startLevel2,dropTool,Level2View,Level2Action} from './Btlevel2api';
// // import {ChalkFlower,ToolIcon,Sparks,DashedArrow,HomeIcon,GearIcon,BulbIcon,StarIcon,ChalkTray} from './Btlevel2art';

// // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // const BOARD='#1d6a49',FRAME='#e08a2e',PAGE='#f4e4c6',LIME='#a6e22e',CREAM='#f7f1df',YELLOW='#ffd33d';

// // type Props={
// //   playerId:number;
// //   hints?:number;
// //   onExit:()=>void;
// //   onComplete?:(result:Level2Action)=>void;
// // };

// // type DropResult='ok'|'wrong'|'error';

// // /* =========================================================
// //    ONE DRAGGABLE TOOL
// // ========================================================= */

// // function ToolButton({tool,size,selected,disabled,flowerRef,onSelect,onDrop}:any){
// //   const pan=useRef(new Animated.ValueXY()).current;
// //   const scale=useRef(new Animated.Value(1)).current;
// //   const rot=useRef(new Animated.Value(0)).current;
// //   const fade=useRef(new Animated.Value(1)).current;
// //   const live=useRef({disabled,onSelect,onDrop,tool});
// //   live.current={disabled,onSelect,onDrop,tool};

// //   const back=()=>{
// //     Animated.parallel([
// //       Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}),
// //       Animated.spring(scale,{toValue:1,friction:6,useNativeDriver:false})]).start();
// //   };

// //   // finger lifted: is the tool on top of the flower?
// //   const release=(g:any)=>{
// //     const f=flowerRef.current;
// //     if(!f||!f.measureInWindow){back();return}
// //     f.measureInWindow(async(x:number,y:number,w:number,h:number)=>{
// //       const pad=24;
// //       const hit=g.moveX>=x-pad&&g.moveX<=x+w+pad&&g.moveY>=y-pad&&g.moveY<=y+h+pad;
// //       if(!hit){back();return}
// //       const res:DropResult=await live.current.onDrop(live.current.tool.id);
// //       if(res==='ok'){
// //         // the tool "works" on the flower, then disappears
// //         Animated.sequence([
// //           Animated.timing(rot,{toValue:1,duration:150,useNativeDriver:false}),
// //           Animated.timing(rot,{toValue:-1,duration:300,useNativeDriver:false}),
// //           Animated.timing(rot,{toValue:0,duration:150,useNativeDriver:false}),
// //           Animated.timing(fade,{toValue:0,duration:300,useNativeDriver:false})]).start();
// //       }else back();
// //     });
// //   };

// //   const pr=useRef(PanResponder.create({
// //     onStartShouldSetPanResponder:()=>!live.current.disabled,
// //     onPanResponderGrant:()=>{
// //       live.current.onSelect(live.current.tool.id);
// //       Animated.spring(scale,{toValue:1.3,useNativeDriver:false}).start();
// //     },
// //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// //     onPanResponderRelease:(_,g)=>release(g),
// //     onPanResponderTerminate:()=>back(),
// //   })).current;

// //   const ring=size+16;
// //   const rotate=rot.interpolate({inputRange:[-1,1],outputRange:['-25deg','25deg']});

// //   return <View style={{alignItems:'center',width:ring+10}}>
// //     <View style={{width:ring,height:ring,borderRadius:ring/2,borderWidth:2,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.65)',alignItems:'center',justifyContent:'center'}}>
// //       <View style={{width:size,height:size,borderRadius:size/2,backgroundColor:selected?LIME:CREAM}}/>
// //       <Animated.View {...pr.panHandlers} style={{position:'absolute',width:size,height:size,alignItems:'center',justifyContent:'center',zIndex:30,
// //         opacity:fade,transform:[{translateX:pan.x},{translateY:pan.y},{scale},{rotate}]}}>
// //         <ToolIcon id={tool.id} size={size*0.8}/>
// //       </Animated.View>
// //     </View>
// //     <Text style={st.toolLabel}>{tool.label}</Text>
// //   </View>;
// // }

// // /* =========================================================
// //    SCREEN
// // ========================================================= */

// // export default function BTLevel2Screen({playerId,hints=0,onExit,onComplete}:Props){
// //   const {width,height}=useWindowDimensions();
// //   const bw=Math.min(width,480);
// //   const ts=Math.min(82,Math.floor((bw-16-70)/3.4));
// //   const fh=Math.min(340,Math.max(220,height*0.36));
// //   const fw=fh*0.75;

// //   const [view,setView]=useState<Level2View|null>(null);
// //   const [sessionId,setSessionId]=useState<number|null>(null);
// //   const [loadErr,setLoadErr]=useState('');
// //   const [msg,setMsg]=useState('');
// //   const [busy,setBusy]=useState(false);
// //   const [selected,setSelected]=useState<string|null>(null);
// //   const [result,setResult]=useState<Level2Action|null>(null);

// //   const fade=useRef(new Animated.Value(1)).current;
// //   const shake=useRef(new Animated.Value(0)).current;
// //   const bob=useRef(new Animated.Value(0)).current;
// //   const pop=useRef(new Animated.Value(0)).current;
// //   const flowerRef=useRef<any>(null);
// //   const timers=useRef<any[]>([]);
// //   const msgTimer=useRef<any>(null);

// //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// //   // 1. open the level (backend creates or resumes the session)
// //   const load=useCallback(()=>{
// //     setLoadErr('');setView(null);
// //     startLevel2(playerId)
// //       .then(v=>{setSessionId(v.sessionId);setView(v);setSelected(v.hintTool)})
// //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// //   },[playerId]);

// //   useEffect(()=>{
// //     load();
// //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// //   },[load]);

// //   // the hint tool bobs up and down
// //   useEffect(()=>{
// //     const l=Animated.loop(Animated.sequence([
// //       Animated.timing(bob,{toValue:1,duration:600,useNativeDriver:true}),
// //       Animated.timing(bob,{toValue:0,duration:600,useNativeDriver:true})]));
// //     l.start();
// //     return()=>l.stop();
// //   },[]);

// //   // result card pops in
// //   useEffect(()=>{
// //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// //   },[result]);

// //   const showMsg=(m:string)=>{
// //     setMsg(m);
// //     clearTimeout(msgTimer.current);
// //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// //   };

// //   const shakeFlower=()=>{
// //     Animated.sequence([
// //       Animated.timing(shake,{toValue:10,duration:60,useNativeDriver:true}),
// //       Animated.timing(shake,{toValue:-10,duration:60,useNativeDriver:true}),
// //       Animated.timing(shake,{toValue:6,duration:60,useNativeDriver:true}),
// //       Animated.timing(shake,{toValue:0,duration:60,useNativeDriver:true})]).start();
// //   };

// //   // title, hint and tools fade out, change, fade in
// //   const swapTo=(next:Level2View)=>{
// //     Animated.timing(fade,{toValue:0,duration:160,useNativeDriver:true}).start(()=>{
// //       setView(next);setSelected(next.hintTool);setMsg('');
// //       Animated.timing(fade,{toValue:1,duration:320,useNativeDriver:true}).start(()=>setBusy(false));
// //     });
// //   };

// //   // 2. a tool was dropped on the flower -> ask the backend
// //   const handleDrop=async(tool:string):Promise<DropResult>=>{
// //     if(busy||!sessionId||!view)return 'error';
// //     setBusy(true);setMsg('');
// //     try{
// //       const res=await dropTool({sessionId,playerId,tool});

// //       if(!res.correct){
// //         showMsg(res.message||'Not quite. Try again!');
// //         shakeFlower();
// //         setBusy(false);
// //         return 'wrong';
// //       }

// //       if(res.completed){
// //         // paint the flower, then show the result card
// //         later(()=>setView(v=>v&&{...v,flower:'colored'}),700);
// //         later(()=>setResult(res),3000);
// //       }else{
// //         // stage 1 done: reveal the flower and load stage 2
// //         later(()=>swapTo(res as Level2View),750);
// //       }
// //       return 'ok';
// //     }catch(e:any){
// //       showMsg(e.message||'Network error');
// //       setBusy(false);
// //       return 'error';
// //     }
// //   };

// //   /* ---------- loading / error ---------- */

// //   if(loadErr||!view){
// //     return <View style={st.page}>
// //       <View style={[st.frame,{width:bw-16}]}>
// //         <View style={[st.board,{alignItems:'center',justifyContent:'center'}]}>
// //           {loadErr?<>
// //             <Text style={st.errText}>{loadErr}</Text>
// //             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// //             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// //           </>:<>
// //             <ActivityIndicator color="#fff" size="large"/>
// //             <Text style={st.loading}>Loading level 2...</Text>
// //           </>}
// //         </View>
// //       </View>
// //     </View>;
// //   }

// //   const hintText=(msg||view.hint).replace(' onto','\nonto');

// //   return <View style={st.page}>
// //     <View style={[st.frame,{width:bw-16}]}>
// //       <View style={st.board}>

// //         {/* header */}
// //         <View style={st.header}>
// //           <View style={st.headLeft}>
// //             <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon/></TouchableOpacity>
// //             <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon/></TouchableOpacity>
// //           </View>
// //           <View style={st.plaque}>
// //             <Text style={st.chev}>‹</Text>
// //             <Text style={st.plaqueT}>LEVEL 2</Text>
// //             <Text style={st.chev}>›</Text>
// //           </View>
// //           <View style={st.pillWrap}>
// //             <View style={st.pill}><Text style={st.pillT}>{hints}</Text></View>
// //             <View style={st.bulb}><BulbIcon size={28}/></View>
// //           </View>
// //         </View>

// //         {/* title */}
// //         <Animated.View style={[st.titleRow,{opacity:fade}]}>
// //           <Sparks/>
// //           <Text style={st.title}>{view.title}</Text>
// //           <Sparks flip/>
// //         </Animated.View>

// //         {/* flower */}
// //         <View style={st.flowerArea}>
// //           <Animated.View style={{transform:[{translateX:shake}]}}>
// //             <View ref={flowerRef} collapsable={false} style={{width:fw,height:fh}}>
// //               <ChalkFlower phase={view.flower} width={fw}/>
// //             </View>
// //           </Animated.View>
// //         </View>

// //         {/* hint */}
// //         <Animated.View style={[st.hintRow,{opacity:fade}]}>
// //           <Animated.View style={{transform:[{translateY:bob.interpolate({inputRange:[0,1],outputRange:[0,-6]})},{rotate:'-12deg'}]}}>
// //             <ToolIcon id={view.hintTool} size={60}/>
// //           </Animated.View>
// //           <View style={{marginTop:-18}}><DashedArrow/></View>
// //           <Text style={[st.hintText,msg?{color:YELLOW}:null]}>{hintText}</Text>
// //         </Animated.View>

// //         {/* tools: drag one onto the flower */}
// //         <Animated.View style={[st.toolsRow,{opacity:fade}]}>
// //           {view.tools.map(t=>
// //             <ToolButton key={view.stage+'-'+t.id} tool={t} size={ts} selected={selected===t.id}
// //               disabled={busy||!!result} flowerRef={flowerRef} onSelect={setSelected} onDrop={handleDrop}/>)}
// //         </Animated.View>

// //         <ChalkTray/>

// //         {/* result card */}
// //         {!!result&&<View style={st.overlay}>
// //           <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// //             <Text style={st.cardTitle}>Level complete!</Text>
// //             <Text style={st.cardMsg}>{result.message}</Text>
// //             <View style={st.stars}>{[1,2,3].map(n=><StarIcon key={n} size={46} on={n<=(result.stars||0)}/>)}</View>
// //             <Text style={st.cardScore}>Score {result.score}</Text>
// //             <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// //               <Text style={st.nextT}>NEXT</Text>
// //             </TouchableOpacity>
// //           </Animated.View>
// //         </View>}
// //       </View>
// //     </View>
// //   </View>;
// // }

// // /* =========================================================
// //    STYLES
// // ========================================================= */

// // const st=StyleSheet.create({
// //   page:{flex:1,backgroundColor:PAGE,alignItems:'center'},
// //   frame:{flex:1,marginVertical:8,backgroundColor:FRAME,borderRadius:22,padding:9,
// //     shadowColor:'#000',shadowOffset:{width:0,height:6},shadowOpacity:0.2,shadowRadius:10,elevation:6},
// //   board:{flex:1,backgroundColor:BOARD,borderRadius:14,overflow:'hidden',paddingTop:14},

// //   header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12},
// //   headLeft:{flexDirection:'row',gap:8},
// //   round:{width:44,height:44,borderRadius:22,backgroundColor:'#ffd83a',borderWidth:2.5,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
// //   plaque:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#9a5a1c',borderWidth:3,borderColor:'#c98a3e',borderRadius:6,paddingHorizontal:14,paddingVertical:5},
// //   plaqueT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:'#fff',letterSpacing:0.5},
// //   chev:{fontSize:26,fontWeight:'900',color:YELLOW,marginTop:-3},
// //   pillWrap:{minWidth:110,height:44,justifyContent:'center'},
// //   pill:{height:36,borderRadius:18,backgroundColor:'#fff',justifyContent:'center',paddingLeft:18,paddingRight:30},
// //   pillT:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#1b1b1b'},
// //   bulb:{position:'absolute',right:-4,top:-2},

// //   titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,marginTop:16},
// //   title:{fontFamily:FONT,fontSize:34,fontWeight:'700',color:'#fff'},

// //   flowerArea:{flex:1,alignItems:'center',justifyContent:'center'},

// //   hintRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,paddingHorizontal:12,minHeight:64},
// //   hintText:{fontFamily:FONT,fontSize:19,lineHeight:25,fontWeight:'600',color:'#fff',flexShrink:1,maxWidth:200},

// //   toolsRow:{flexDirection:'row',justifyContent:'space-evenly',alignItems:'flex-start',paddingHorizontal:8,marginTop:10,marginBottom:6,zIndex:20},
// //   toolLabel:{fontFamily:FONT,fontSize:18,fontWeight:'600',color:'#fff',marginTop:6},

// //   overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
// //   card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
// //   cardTitle:{fontFamily:FONT,fontSize:30,fontWeight:'800',color:'#fff'},
// //   cardMsg:{fontFamily:FONT,fontSize:18,color:'#d8f3e3',textAlign:'center',marginTop:6},
// //   stars:{flexDirection:'row',gap:6,marginTop:14},
// //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:YELLOW,marginTop:10},
// //   next:{marginTop:18,minWidth:170,height:58,borderRadius:29,backgroundColor:LIME,borderWidth:3,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
// //   nextT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#1b1b1b'},

// //   loading:{fontFamily:FONT,fontSize:18,color:'#fff',marginTop:12},
// //   errText:{fontFamily:FONT,fontSize:18,color:'#fff',textAlign:'center',paddingHorizontal:24},
// //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:LIME,borderWidth:2.5,borderColor:'#1b1b1b'},
// //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:'#1b1b1b'},
// //   back:{fontFamily:FONT,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
// // });
// import React,{useCallback,useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Platform,ActivityIndicator,useWindowDimensions} from 'react-native';
// import {startLevel2,dropTool,Level2View,Level2Action} from './Btlevel2api';
// import {ChalkFlower,ToolIcon,Sparks,DashedArrow,HomeIcon,GearIcon,BulbIcon,StarIcon,ChalkTray} from './Btlevel2art';

// const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// const BOARD='#1d6a49',FRAME='#e08a2e',PAGE='#f4e4c6',LIME='#a6e22e',CREAM='#f7f1df',YELLOW='#ffd33d';

// type Props={
//   playerId:number;
//   hints?:number;
//   onExit:()=>void;
//   onComplete?:(result:Level2Action)=>void;
// };

// type DropResult='ok'|'wrong'|'error';

// /* =========================================================
//    ONE DRAGGABLE TOOL
// ========================================================= */

// function ToolButton({tool,size,selected,disabled,flowerRef,onSelect,onDrop}:any){
//   const pan=useRef(new Animated.ValueXY()).current;
//   const scale=useRef(new Animated.Value(1)).current;
//   const rot=useRef(new Animated.Value(0)).current;
//   const fade=useRef(new Animated.Value(1)).current;
//   const live=useRef({disabled,onSelect,onDrop,tool});
//   live.current={disabled,onSelect,onDrop,tool};

//   const back=()=>{
//     Animated.parallel([
//       Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}),
//       Animated.spring(scale,{toValue:1,friction:6,useNativeDriver:false})]).start();
//   };

//   // finger lifted: is the tool on top of the flower?
//   const release=(g:any)=>{
//     const f=flowerRef.current;
//     if(!f||!f.measureInWindow){back();return}
//     f.measureInWindow(async(x:number,y:number,w:number,h:number)=>{
//       const pad=24;
//       const hit=g.moveX>=x-pad&&g.moveX<=x+w+pad&&g.moveY>=y-pad&&g.moveY<=y+h+pad;
//       if(!hit){back();return}
//       const res:DropResult=await live.current.onDrop(live.current.tool.id);
//       if(res==='ok'){
//         // the tool "works" on the flower, then disappears
//         Animated.sequence([
//           Animated.timing(rot,{toValue:1,duration:150,useNativeDriver:false}),
//           Animated.timing(rot,{toValue:-1,duration:300,useNativeDriver:false}),
//           Animated.timing(rot,{toValue:0,duration:150,useNativeDriver:false}),
//           Animated.timing(fade,{toValue:0,duration:300,useNativeDriver:false})]).start();
//       }else back();
//     });
//   };

//   const pr=useRef(PanResponder.create({
//     onStartShouldSetPanResponder:()=>!live.current.disabled,
//     onPanResponderGrant:()=>{
//       live.current.onSelect(live.current.tool.id);
//       Animated.spring(scale,{toValue:1.3,useNativeDriver:false}).start();
//     },
//     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
//     onPanResponderRelease:(_,g)=>release(g),
//     onPanResponderTerminate:()=>back(),
//   })).current;

//   const ring=size+16;
//   const inner=ring-4;               // dashed border 2px x 2
//   const off=(inner-size)/2;         // exact centre
//   const rotate=rot.interpolate({inputRange:[-1,1],outputRange:['-25deg','25deg']});

//   return <View style={{alignItems:'center',width:ring+10}}>
//     <View style={{width:ring,height:ring,borderRadius:ring/2,borderWidth:2,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.65)'}}>
//       <View style={{position:'absolute',left:off,top:off,width:size,height:size,borderRadius:size/2,backgroundColor:selected?LIME:CREAM}}/>
//       <Animated.View {...pr.panHandlers} style={{position:'absolute',left:off,top:off,width:size,height:size,alignItems:'center',justifyContent:'center',zIndex:30,elevation:30,
//         opacity:fade,transform:[{translateX:pan.x},{translateY:pan.y},{scale},{rotate}]}}>
//         <ToolIcon id={tool.id} size={size*0.8}/>
//       </Animated.View>
//     </View>
//     <Text style={st.toolLabel}>{tool.label}</Text>
//   </View>;
// }

// /* =========================================================
//    SCREEN
// ========================================================= */

// export default function BTLevel2Screen({playerId,hints=0,onExit,onComplete}:Props){
//   const {width,height}=useWindowDimensions();
//   const bw=Math.min(width,480);
//   const ts=Math.min(82,Math.floor((bw-16-70)/3.4));
//   const fh=Math.min(340,Math.max(220,height*0.36));
//   const fw=fh*0.75;

//   const [view,setView]=useState<Level2View|null>(null);
//   const [sessionId,setSessionId]=useState<number|null>(null);
//   const [loadErr,setLoadErr]=useState('');
//   const [msg,setMsg]=useState('');
//   const [busy,setBusy]=useState(false);
//   const [selected,setSelected]=useState<string|null>(null);
//   const [result,setResult]=useState<Level2Action|null>(null);

//   const fade=useRef(new Animated.Value(1)).current;
//   const shake=useRef(new Animated.Value(0)).current;
//   const bob=useRef(new Animated.Value(0)).current;
//   const pop=useRef(new Animated.Value(0)).current;
//   const flowerRef=useRef<any>(null);
//   const timers=useRef<any[]>([]);
//   const msgTimer=useRef<any>(null);

//   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

//   // 1. open the level (backend creates or resumes the session)
//   const load=useCallback(()=>{
//     setLoadErr('');setView(null);
//     startLevel2(playerId)
//       .then(v=>{setSessionId(v.sessionId);setView(v);setSelected(v.hintTool)})
//       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
//   },[playerId]);

//   useEffect(()=>{
//     load();
//     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
//   },[load]);

//   // the hint tool bobs up and down
//   useEffect(()=>{
//     const l=Animated.loop(Animated.sequence([
//       Animated.timing(bob,{toValue:1,duration:600,useNativeDriver:true}),
//       Animated.timing(bob,{toValue:0,duration:600,useNativeDriver:true})]));
//     l.start();
//     return()=>l.stop();
//   },[]);

//   // result card pops in
//   useEffect(()=>{
//     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
//   },[result]);

//   const showMsg=(m:string)=>{
//     setMsg(m);
//     clearTimeout(msgTimer.current);
//     msgTimer.current=setTimeout(()=>setMsg(''),2800);
//   };

//   const shakeFlower=()=>{
//     Animated.sequence([
//       Animated.timing(shake,{toValue:10,duration:60,useNativeDriver:true}),
//       Animated.timing(shake,{toValue:-10,duration:60,useNativeDriver:true}),
//       Animated.timing(shake,{toValue:6,duration:60,useNativeDriver:true}),
//       Animated.timing(shake,{toValue:0,duration:60,useNativeDriver:true})]).start();
//   };

//   // title, hint and tools fade out, change, fade in
//   const swapTo=(next:Level2View)=>{
//     Animated.timing(fade,{toValue:0,duration:160,useNativeDriver:true}).start(()=>{
//       setView(next);setSelected(next.hintTool);setMsg('');
//       Animated.timing(fade,{toValue:1,duration:320,useNativeDriver:true}).start(()=>setBusy(false));
//     });
//   };

//   // 2. a tool was dropped on the flower -> ask the backend
//   const handleDrop=async(tool:string):Promise<DropResult>=>{
//     if(busy||!sessionId||!view)return 'error';
//     setBusy(true);setMsg('');
//     try{
//       const res=await dropTool({sessionId,playerId,tool});

//       if(!res.correct){
//         showMsg(res.message||'Not quite. Try again!');
//         shakeFlower();
//         setBusy(false);
//         return 'wrong';
//       }

//       if(res.completed){
//         // paint the flower, then show the result card
//         later(()=>setView(v=>v&&{...v,flower:'colored'}),700);
//         later(()=>setResult(res),3000);
//       }else{
//         // stage 1 done: blur goes away, outline flower shows, stage 2 loads
//         later(()=>swapTo(res as Level2View),750);
//       }
//       return 'ok';
//     }catch(e:any){
//       showMsg(e.message||'Network error');
//       setBusy(false);
//       return 'error';
//     }
//   };

//   /* ---------- loading / error ---------- */

//   if(loadErr||!view){
//     return <View style={st.page}>
//       <View style={[st.frame,{width:bw-16}]}>
//         <View style={[st.board,{alignItems:'center',justifyContent:'center'}]}>
//           {loadErr?<>
//             <Text style={st.errText}>{loadErr}</Text>
//             <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
//             <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
//           </>:<>
//             <ActivityIndicator color="#fff" size="large"/>
//             <Text style={st.loading}>Loading level 2...</Text>
//           </>}
//         </View>
//       </View>
//     </View>;
//   }

//   const hintText=(msg||view.hint).replace(' onto','\nonto');

//   // stage 1 (pencil) = blurred flower, stage 2 = white outline, finished = coloured
//   const phase=view.flower==='colored'
//     ? 'colored'
//     : (view.hintTool==='pencil' ? 'blurred' : 'outline');

//   return <View style={st.page}>
//     <View style={[st.frame,{width:bw-16}]}>
//       <View style={st.board}>

//         {/* header */}
//         <View style={st.header}>
//           <View style={st.headLeft}>
//             <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon/></TouchableOpacity>
//             <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon/></TouchableOpacity>
//           </View>
//           <View style={st.plaque}>
//             <Text style={st.chev}>‹</Text>
//             <Text style={st.plaqueT}>LEVEL 2</Text>
//             <Text style={st.chev}>›</Text>
//           </View>
//           <View style={st.pillWrap}>
//             <View style={st.pill}><Text style={st.pillT}>{hints}</Text></View>
//             <View style={st.bulb}><BulbIcon size={28}/></View>
//           </View>
//         </View>

//         {/* title */}
//         <Animated.View style={[st.titleRow,{opacity:fade}]}>
//           <Sparks/>
//           <Text style={st.title}>{view.title}</Text>
//           <Sparks flip/>
//         </Animated.View>

//         {/* flower */}
//         <View style={st.flowerArea}>
//           <Animated.View style={{transform:[{translateX:shake}]}}>
//             <View ref={flowerRef} collapsable={false} style={{width:fw,height:fh}}>
//               <ChalkFlower phase={phase as any} width={fw}/>
//             </View>
//           </Animated.View>
//         </View>

//         {/* hint */}
//         <Animated.View style={[st.hintRow,{opacity:fade}]}>
//           <Animated.View style={{transform:[{translateY:bob.interpolate({inputRange:[0,1],outputRange:[0,-6]})},{rotate:'-12deg'}]}}>
//             <ToolIcon id={view.hintTool} size={60}/>
//           </Animated.View>
//           <View style={{marginTop:-18}}><DashedArrow/></View>
//           <Text style={[st.hintText,msg?{color:YELLOW}:null]}>{hintText}</Text>
//         </Animated.View>

//         {/* tools: drag one onto the flower */}
//         <Animated.View style={[st.toolsRow,{opacity:fade}]}>
//           {view.tools.map(t=>
//             <ToolButton key={view.stage+'-'+t.id} tool={t} size={ts} selected={selected===t.id}
//               disabled={busy||!!result} flowerRef={flowerRef} onSelect={setSelected} onDrop={handleDrop}/>)}
//         </Animated.View>

//         <ChalkTray/>

//         {/* result card */}
//         {!!result&&<View style={st.overlay}>
//           <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
//             <Text style={st.cardTitle}>Level complete!</Text>
//             <Text style={st.cardMsg}>{result.message}</Text>
//             <View style={st.stars}>{[1,2,3].map(n=><StarIcon key={n} size={46} on={n<=(result.stars||0)}/>)}</View>
//             <Text style={st.cardScore}>Score {result.score}</Text>
//             <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
//               <Text style={st.nextT}>NEXT</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>}
//       </View>
//     </View>
//   </View>;
// }

// /* =========================================================
//    STYLES
// ========================================================= */

// const st=StyleSheet.create({
//   page:{flex:1,backgroundColor:PAGE,alignItems:'center'},
//   frame:{flex:1,marginVertical:8,backgroundColor:FRAME,borderRadius:22,padding:9,
//     shadowColor:'#000',shadowOffset:{width:0,height:6},shadowOpacity:0.2,shadowRadius:10,elevation:6},
//   board:{flex:1,backgroundColor:BOARD,borderRadius:14,overflow:'hidden',paddingTop:14},

//   header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12},
//   headLeft:{flexDirection:'row',gap:8},
//   round:{width:44,height:44,borderRadius:22,backgroundColor:'#ffd83a',borderWidth:2.5,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
//   plaque:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#9a5a1c',borderWidth:3,borderColor:'#c98a3e',borderRadius:6,paddingHorizontal:14,paddingVertical:5},
//   plaqueT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:'#fff',letterSpacing:0.5},
//   chev:{fontSize:26,fontWeight:'900',color:YELLOW,marginTop:-3},
//   pillWrap:{minWidth:110,height:44,justifyContent:'center'},
//   pill:{height:36,borderRadius:18,backgroundColor:'#fff',justifyContent:'center',paddingLeft:18,paddingRight:30},
//   pillT:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#1b1b1b'},
//   bulb:{position:'absolute',right:-4,top:-2},

//   titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,marginTop:16},
//   title:{fontFamily:FONT,fontSize:34,fontWeight:'700',color:'#fff'},

//   flowerArea:{flex:1,alignItems:'center',justifyContent:'center'},

//   hintRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,paddingHorizontal:12,minHeight:64},
//   hintText:{fontFamily:FONT,fontSize:19,lineHeight:25,fontWeight:'600',color:'#fff',flexShrink:1,maxWidth:200},

//   toolsRow:{flexDirection:'row',justifyContent:'space-evenly',alignItems:'flex-start',paddingHorizontal:8,marginTop:10,marginBottom:6,zIndex:20},
//   toolLabel:{fontFamily:FONT,fontSize:18,fontWeight:'600',color:'#fff',marginTop:6},

//   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
//   card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
//   cardTitle:{fontFamily:FONT,fontSize:30,fontWeight:'800',color:'#fff'},
//   cardMsg:{fontFamily:FONT,fontSize:18,color:'#d8f3e3',textAlign:'center',marginTop:6},
//   stars:{flexDirection:'row',gap:6,marginTop:14},
//   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:YELLOW,marginTop:10},
//   next:{marginTop:18,minWidth:170,height:58,borderRadius:29,backgroundColor:LIME,borderWidth:3,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
//   nextT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#1b1b1b'},

//   loading:{fontFamily:FONT,fontSize:18,color:'#fff',marginTop:12},
//   errText:{fontFamily:FONT,fontSize:18,color:'#fff',textAlign:'center',paddingHorizontal:24},
//   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:LIME,borderWidth:2.5,borderColor:'#1b1b1b'},
//   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:'#1b1b1b'},
//   back:{fontFamily:FONT,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
// });
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Platform,ActivityIndicator,useWindowDimensions} from 'react-native';
import {startLevel2,dropTool,Level2View,Level2Action} from './Btlevel2api';
import {ChalkFlower,ToolIcon,Sparks,DashedArrow,HomeIcon,GearIcon,BulbIcon,StarIcon,ChalkTray} from './Btlevel2art';

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
const BOARD='#1d6a49',FRAME='#e08a2e',PAGE='#f4e4c6',LIME='#a6e22e',CREAM='#f7f1df',YELLOW='#ffd33d';

type Props={
  playerId:number;
  hints?:number;
  onExit:()=>void;
  onComplete?:(result:Level2Action)=>void;
};

type DropResult='ok'|'wrong'|'error';

/* =========================================================
   ONE DRAGGABLE TOOL
========================================================= */

function ToolButton({tool,size,selected,disabled,flowerRef,onSelect,onDrop,onHover}:any){
  const pan=useRef(new Animated.ValueXY()).current;
  const scale=useRef(new Animated.Value(1)).current;
  const rot=useRef(new Animated.Value(0)).current;
  const fade=useRef(new Animated.Value(1)).current;
  const rect=useRef<any>(null);
  const over=useRef(false);
  const live=useRef({disabled,onSelect,onDrop,onHover,tool});
  live.current={disabled,onSelect,onDrop,onHover,tool};

  // tell the screen when the tool enters / leaves the flower
  const setOver=(v:boolean)=>{
    if(over.current===v)return;
    over.current=v;
    if(live.current.onHover)live.current.onHover(live.current.tool.id,v);
  };

  const back=()=>{
    setOver(false);
    Animated.parallel([
      Animated.spring(pan,{toValue:{x:0,y:0},friction:6,useNativeDriver:false}),
      Animated.spring(scale,{toValue:1,friction:6,useNativeDriver:false})]).start();
  };

  // finger lifted: is the tool on top of the flower?
  const release=(g:any)=>{
    const f=flowerRef.current;
    if(!f||!f.measureInWindow){back();return}
    f.measureInWindow(async(x:number,y:number,w:number,h:number)=>{
      const pad=24;
      const hit=g.moveX>=x-pad&&g.moveX<=x+w+pad&&g.moveY>=y-pad&&g.moveY<=y+h+pad;
      if(!hit){back();return}
      const res:DropResult=await live.current.onDrop(live.current.tool.id);
      if(res==='ok'){
        // the tool "works" on the flower, then disappears
        Animated.sequence([
          Animated.timing(rot,{toValue:1,duration:150,useNativeDriver:false}),
          Animated.timing(rot,{toValue:-1,duration:300,useNativeDriver:false}),
          Animated.timing(rot,{toValue:0,duration:150,useNativeDriver:false}),
          Animated.timing(fade,{toValue:0,duration:300,useNativeDriver:false})]).start();
      }else back();
    });
  };

  const pr=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>!live.current.disabled,
    onPanResponderGrant:()=>{
      live.current.onSelect(live.current.tool.id);
      Animated.spring(scale,{toValue:1.3,useNativeDriver:false}).start();
      // remember where the flower is, so hovering can be checked while dragging
      const f=flowerRef.current;
      if(f&&f.measureInWindow){
        f.measureInWindow((x:number,y:number,w:number,h:number)=>{rect.current={x,y,w,h}});
      }
    },
    onPanResponderMove:(_,g)=>{
      pan.setValue({x:g.dx,y:g.dy});
      const r=rect.current;
      if(r){
        const pad=24;
        setOver(g.moveX>=r.x-pad&&g.moveX<=r.x+r.w+pad&&g.moveY>=r.y-pad&&g.moveY<=r.y+r.h+pad);
      }
    },
    onPanResponderRelease:(_,g)=>release(g),
    onPanResponderTerminate:()=>back(),
  })).current;

  const ring=size+16;
  const inner=ring-4;               // dashed border 2px x 2
  const off=(inner-size)/2;         // exact centre
  const rotate=rot.interpolate({inputRange:[-1,1],outputRange:['-25deg','25deg']});

  return <View style={{alignItems:'center',width:ring+10}}>
    <View style={{width:ring,height:ring,borderRadius:ring/2,borderWidth:2,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.65)'}}>
      <View style={{position:'absolute',left:off,top:off,width:size,height:size,borderRadius:size/2,backgroundColor:selected?LIME:CREAM}}/>
      <Animated.View {...pr.panHandlers} style={{position:'absolute',left:off,top:off,width:size,height:size,alignItems:'center',justifyContent:'center',zIndex:30,elevation:30,
        opacity:fade,transform:[{translateX:pan.x},{translateY:pan.y},{scale},{rotate}]}}>
        <ToolIcon id={tool.id} size={size*0.8}/>
      </Animated.View>
    </View>
    <Text style={st.toolLabel}>{tool.label}</Text>
  </View>;
}

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevel2Screen({playerId,hints=0,onExit,onComplete}:Props){
  const {width,height}=useWindowDimensions();
  const bw=Math.min(width,480);
  const ts=Math.min(82,Math.floor((bw-16-70)/3.4));
  const fh=Math.min(340,Math.max(220,height*0.36));
  const fw=fh*0.75;

  const [view,setView]=useState<Level2View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [busy,setBusy]=useState(false);
  const [selected,setSelected]=useState<string|null>(null);
  const [result,setResult]=useState<Level2Action|null>(null);

  const fade=useRef(new Animated.Value(1)).current;
  const shake=useRef(new Animated.Value(0)).current;
  const bob=useRef(new Animated.Value(0)).current;
  const pop=useRef(new Animated.Value(0)).current;
  const wipe=useRef(new Animated.Value(0)).current;   // 0 = fog, 1 = fog cleared by the pencil
  const flowerRef=useRef<any>(null);
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const viewRef=useRef<Level2View|null>(null);
  viewRef.current=view;

  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  // 1. open the level (backend creates or resumes the session)
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel2(playerId)
      .then(v=>{setSessionId(v.sessionId);setView(v);setSelected(v.hintTool)})
      .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
  },[playerId]);

  useEffect(()=>{
    load();
    return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
  },[load]);

  // the hint tool bobs up and down
  useEffect(()=>{
    const l=Animated.loop(Animated.sequence([
      Animated.timing(bob,{toValue:1,duration:600,useNativeDriver:true}),
      Animated.timing(bob,{toValue:0,duration:600,useNativeDriver:true})]));
    l.start();
    return()=>l.stop();
  },[]);

  // result card pops in
  useEffect(()=>{
    if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
  },[result]);

  const showMsg=(m:string)=>{
    setMsg(m);
    clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2800);
  };

  const shakeFlower=()=>{
    Animated.sequence([
      Animated.timing(shake,{toValue:10,duration:60,useNativeDriver:true}),
      Animated.timing(shake,{toValue:-10,duration:60,useNativeDriver:true}),
      Animated.timing(shake,{toValue:6,duration:60,useNativeDriver:true}),
      Animated.timing(shake,{toValue:0,duration:60,useNativeDriver:true})]).start();
  };

  // the pencil is over the flower: the fog clears live. Leaves the flower: fog comes back.
  const handleHover=(toolId:string,over:boolean)=>{
    const v=viewRef.current;
    if(!v||toolId!==v.hintTool||v.flower!=='blurred')return;
    Animated.timing(wipe,{toValue:over?1:0,duration:over?450:250,useNativeDriver:true}).start();
  };

  // title, hint and tools fade out, change, fade in
  const swapTo=(next:Level2View)=>{
    Animated.timing(fade,{toValue:0,duration:160,useNativeDriver:true}).start(()=>{
      setView(next);setSelected(next.hintTool);setMsg('');
      Animated.timing(fade,{toValue:1,duration:320,useNativeDriver:true}).start(()=>setBusy(false));
    });
  };

  // 2. a tool was dropped on the flower -> ask the backend
  const handleDrop=async(tool:string):Promise<DropResult>=>{
    if(busy||!sessionId||!view)return 'error';
    setBusy(true);setMsg('');
    try{
      const res=await dropTool({sessionId,playerId,tool});

      if(!res.correct){
        showMsg(res.message||'Not quite. Try again!');
        shakeFlower();
        setBusy(false);
        return 'wrong';
      }

      if(res.completed){
        // paint the flower, then show the result card
        later(()=>setView(v=>v&&{...v,flower:'colored'}),700);
        later(()=>setResult(res),3000);
      }else{
        // stage 1 done: fog is gone, outline flower shows, stage 2 loads
        later(()=>swapTo(res as Level2View),750);
      }
      return 'ok';
    }catch(e:any){
      showMsg(e.message||'Network error');
      Animated.timing(wipe,{toValue:0,duration:250,useNativeDriver:true}).start();
      setBusy(false);
      return 'error';
    }
  };

  /* ---------- loading / error ---------- */

  if(loadErr||!view){
    return <View style={st.page}>
      <View style={[st.frame,{width:bw-16}]}>
        <View style={[st.board,{alignItems:'center',justifyContent:'center'}]}>
          {loadErr?<>
            <Text style={st.errText}>{loadErr}</Text>
            <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
            <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
          </>:<>
            <ActivityIndicator color="#fff" size="large"/>
            <Text style={st.loading}>Loading level 2...</Text>
          </>}
        </View>
      </View>
    </View>;
  }

  const hintText=(msg||view.hint).replace(' onto','\nonto');

  // stage 1 (pencil) = blurred flower, stage 2 = white outline, finished = coloured
  const phase=view.flower==='colored'
    ? 'colored'
    : (view.hintTool==='pencil' ? 'blurred' : 'outline');

  return <View style={st.page}>
    <View style={[st.frame,{width:bw-16}]}>
      <View style={st.board}>

        {/* header */}
        <View style={st.header}>
          <View style={st.headLeft}>
            <TouchableOpacity style={st.round} onPress={onExit} activeOpacity={0.8}><HomeIcon/></TouchableOpacity>
            <TouchableOpacity style={st.round} activeOpacity={0.8}><GearIcon/></TouchableOpacity>
          </View>
          <View style={st.plaque}>
            <Text style={st.chev}>‹</Text>
            <Text style={st.plaqueT}>LEVEL 2</Text>
            <Text style={st.chev}>›</Text>
          </View>
          <View style={st.pillWrap}>
            <View style={st.pill}><Text style={st.pillT}>{hints}</Text></View>
            <View style={st.bulb}><BulbIcon size={28}/></View>
          </View>
        </View>

        {/* title */}
        <Animated.View style={[st.titleRow,{opacity:fade}]}>
          <Sparks/>
          <Text style={st.title}>{view.title}</Text>
          <Sparks flip/>
        </Animated.View>

        {/* flower */}
        <View style={st.flowerArea}>
          <Animated.View style={{transform:[{translateX:shake}]}}>
            <View ref={flowerRef} collapsable={false} style={{width:fw,height:fh}}>
              <ChalkFlower phase={phase as any} width={fw} wipe={wipe}/>
            </View>
          </Animated.View>
        </View>

        {/* hint */}
        <Animated.View style={[st.hintRow,{opacity:fade}]}>
          <Animated.View style={{transform:[{translateY:bob.interpolate({inputRange:[0,1],outputRange:[0,-6]})},{rotate:'-12deg'}]}}>
            <ToolIcon id={view.hintTool} size={60}/>
          </Animated.View>
          <View style={{marginTop:-18}}><DashedArrow/></View>
          <Text style={[st.hintText,msg?{color:YELLOW}:null]}>{hintText}</Text>
        </Animated.View>

        {/* tools: drag one onto the flower */}
        <Animated.View style={[st.toolsRow,{opacity:fade}]}>
          {view.tools.map(t=>
            <ToolButton key={view.stage+'-'+t.id} tool={t} size={ts} selected={selected===t.id}
              disabled={busy||!!result} flowerRef={flowerRef} onSelect={setSelected} onDrop={handleDrop} onHover={handleHover}/>)}
        </Animated.View>

        <ChalkTray/>

        {/* result card */}
        {!!result&&<View style={st.overlay}>
          <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
            <Text style={st.cardTitle}>Level complete!</Text>
            <Text style={st.cardMsg}>{result.message}</Text>
            <View style={st.stars}>{[1,2,3].map(n=><StarIcon key={n} size={46} on={n<=(result.stars||0)}/>)}</View>
            <Text style={st.cardScore}>Score {result.score}</Text>
            <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
              <Text style={st.nextT}>NEXT</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>}
      </View>
    </View>
  </View>;
}

/* =========================================================
   STYLES
========================================================= */

const st=StyleSheet.create({
  page:{flex:1,backgroundColor:PAGE,alignItems:'center'},
  frame:{flex:1,marginVertical:8,backgroundColor:FRAME,borderRadius:22,padding:9,
    shadowColor:'#000',shadowOffset:{width:0,height:6},shadowOpacity:0.2,shadowRadius:10,elevation:6},
  board:{flex:1,backgroundColor:BOARD,borderRadius:14,overflow:'hidden',paddingTop:14},

  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12},
  headLeft:{flexDirection:'row',gap:8},
  round:{width:44,height:44,borderRadius:22,backgroundColor:'#ffd83a',borderWidth:2.5,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
  plaque:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#9a5a1c',borderWidth:3,borderColor:'#c98a3e',borderRadius:6,paddingHorizontal:14,paddingVertical:5},
  plaqueT:{fontFamily:FONT,fontSize:21,fontWeight:'900',color:'#fff',letterSpacing:0.5},
  chev:{fontSize:26,fontWeight:'900',color:YELLOW,marginTop:-3},
  pillWrap:{minWidth:110,height:44,justifyContent:'center'},
  pill:{height:36,borderRadius:18,backgroundColor:'#fff',justifyContent:'center',paddingLeft:18,paddingRight:30},
  pillT:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#1b1b1b'},
  bulb:{position:'absolute',right:-4,top:-2},

  titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,marginTop:16},
  title:{fontFamily:FONT,fontSize:34,fontWeight:'700',color:'#fff'},

  flowerArea:{flex:1,alignItems:'center',justifyContent:'center'},

  hintRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,paddingHorizontal:12,minHeight:64},
  hintText:{fontFamily:FONT,fontSize:19,lineHeight:25,fontWeight:'600',color:'#fff',flexShrink:1,maxWidth:200},

  toolsRow:{flexDirection:'row',justifyContent:'space-evenly',alignItems:'flex-start',paddingHorizontal:8,marginTop:10,marginBottom:6,zIndex:20},
  toolLabel:{fontFamily:FONT,fontSize:18,fontWeight:'600',color:'#fff',marginTop:6},

  overlay:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
  card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
  cardTitle:{fontFamily:FONT,fontSize:30,fontWeight:'800',color:'#fff'},
  cardMsg:{fontFamily:FONT,fontSize:18,color:'#d8f3e3',textAlign:'center',marginTop:6},
  stars:{flexDirection:'row',gap:6,marginTop:14},
  cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:YELLOW,marginTop:10},
  next:{marginTop:18,minWidth:170,height:58,borderRadius:29,backgroundColor:LIME,borderWidth:3,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
  nextT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#1b1b1b'},

  loading:{fontFamily:FONT,fontSize:18,color:'#fff',marginTop:12},
  errText:{fontFamily:FONT,fontSize:18,color:'#fff',textAlign:'center',paddingHorizontal:24},
  retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:LIME,borderWidth:2.5,borderColor:'#1b1b1b'},
  retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:'#1b1b1b'},
  back:{fontFamily:FONT,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
});