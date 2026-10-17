// // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Animated,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // import {F,INK,Coin} from './BTShared';
// // import {Icon} from './Art';
// // import {BigStar,Duster,ChalkPiece} from './Btlevel7art';
// // import {Maze,Dog,Bone,DogHouse,OPEN_N,OPEN_E,OPEN_S,OPEN_W} from './Btlevel9art';
// // import {startLevel9,hintLevel9,finishLevel9,skipLevel9,rewardLevel9,Level9View,Level9Result} from './Btlevel9api';

// // const CHALK='#f6f4ea';

// // type Props={
// //   playerId:number;
// //   hints?:number;
// //   setHints?:(n:number)=>void;
// //   onExit:()=>void;
// //   onComplete?:(result:Level9Result)=>void;
// // };

// // const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));

// // export default function BTLevel9Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// //   const {width,height}=useWindowDimensions();
// //   const RW=Math.min(width-36,340);                 // frame width
// //   const IW=RW-6;                                   // inside the 3px border

// //   const [view,setView]=useState<Level9View|null>(null);
// //   const [sessionId,setSessionId]=useState<number|null>(null);
// //   const [loadErr,setLoadErr]=useState('');
// //   const [msg,setMsg]=useState('');
// //   const [done,setDone]=useState(false);
// //   const [trail,setTrail]=useState<number[]>([]);
// //   const [hintCells,setHintCells]=useState<number[]>([]);
// //   const [result,setResult]=useState<Level9Result|null>(null);
// //   const [confirmSkip,setConfirmSkip]=useState(false);

// //   const cols=view?view.cols:9;
// //   const rows=view?view.rows:9;
// //   const cs=Math.max(24,Math.floor(Math.min(IW/cols,(height-470)/rows)));   // one cell in pixels
// //   const ds=cs*0.92;                                                         // dog size

// //   const dogPos=useRef(new Animated.ValueXY()).current;
// //   const hop=useRef(new Animated.Value(0)).current;
// //   const pop=useRef(new Animated.Value(0)).current;
// //   const sway=useRef(new Animated.Value(0)).current;

// //   const geo=useRef({cs,cols,rows,ds});
// //   geo.current={cs,cols,rows,ds};
// //   const cellsRef=useRef<number[]>([]);
// //   const goalRef=useRef(0);
// //   const curRef=useRef(0);                          // the cell the dog stands on
// //   const pathRef=useRef<number[]>([0]);             // cells walked, from the start
// //   const base=useRef({x0:0,y0:0,px:0,py:0});        // where the finger started / the pointer in maze pixels
// //   const doneRef=useRef(false);
// //   const sessionRef=useRef<number|null>(null);
// //   const timers=useRef<any[]>([]);
// //   const msgTimer=useRef<any>(null);
// //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// //   const flash=(m:string)=>{
// //     setMsg(m);clearTimeout(msgTimer.current);
// //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// //   };

// //   // top-left pixel of the dog when it stands on a cell
// //   const xyOf=(c:number)=>{
// //     const g=geo.current;
// //     return {x:(c%g.cols)*g.cs+(g.cs-g.ds)/2,y:Math.floor(c/g.cols)*g.cs+(g.cs-g.ds)/2};
// //   };

// //   // 1. open the level - the backend builds a NEW maze every time
// //   const load=useCallback(()=>{
// //     setLoadErr('');setView(null);
// //     startLevel9(playerId)
// //       .then(v=>{
// //         cellsRef.current=v.cells;
// //         goalRef.current=v.goal;
// //         curRef.current=v.start;
// //         pathRef.current=[v.start];
// //         doneRef.current=false;
// //         setDone(false);setResult(null);setHintCells([]);setTrail([v.start]);
// //         setSessionId(v.sessionId);sessionRef.current=v.sessionId;
// //         setView(v);
// //         if(setHints&&typeof v.hints==='number')setHints(v.hints);
// //       })
// //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// //   },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

// //   useEffect(()=>{
// //     load();
// //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// //   },[load]);

// //   // put the dog on its cell when the maze appears or the size changes
// //   useEffect(()=>{
// //     if(view)dogPos.setValue(xyOf(curRef.current));
// //   },[view,cs]);                                    // eslint-disable-line react-hooks/exhaustive-deps

// //   useEffect(()=>{
// //     const l=Animated.loop(Animated.sequence([
// //       Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
// //       Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
// //     l.start();
// //     return()=>l.stop();
// //   },[]);

// //   useEffect(()=>{
// //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// //   },[result]);

// //   // 2. the dog reached the bone: send the walked path, the backend checks it and saves the win
// //   const finish=async(attempt:number)=>{
// //     const sid=sessionRef.current;
// //     if(!sid)return;
// //     try{
// //       const path=pathRef.current.slice();
// //       const r=await finishLevel9({sessionId:sid,playerId,path,moves:Math.max(0,path.length-1)});
// //       if(setHints&&typeof r.hints==='number')setHints(r.hints);
// //       setDone(true);
// //       Animated.sequence([
// //         Animated.timing(hop,{toValue:-14,duration:160,useNativeDriver:true}),
// //         Animated.timing(hop,{toValue:0,duration:160,useNativeDriver:true}),
// //         Animated.timing(hop,{toValue:-10,duration:140,useNativeDriver:true}),
// //         Animated.timing(hop,{toValue:0,duration:140,useNativeDriver:true}),
// //       ]).start();
// //       later(()=>setResult(r),1300);
// //     }catch(e:any){
// //       if(attempt<2){later(()=>finishRef.current(attempt+1),1200);return}
// //       doneRef.current=false;
// //       flash(e.message||'Network error. Move the dog a little and come back.');
// //     }
// //   };
// //   const finishRef=useRef(finish);
// //   finishRef.current=finish;

// //   // walk the dog towards a cell: one step at a time, only through open sides (no wall jumping)
// //   const tryMove=(tx:number,ty:number)=>{
// //     const g=geo.current;
// //     const cells=cellsRef.current;
// //     let cur=curRef.current;
// //     let moved=false;
// //     for(let n=0;n<12;n+=1){
// //       const cx=cur%g.cols,cy=Math.floor(cur/g.cols);
// //       const dx=tx-cx,dy=ty-cy;
// //       if(dx===0&&dy===0)break;
// //       const tries=Math.abs(dx)>=Math.abs(dy)?[[dx,0],[0,dy]]:[[0,dy],[dx,0]];
// //       let next=-1;
// //       for(const [ax,ay] of tries){
// //         if(ax===0&&ay===0)continue;
// //         const sx=Math.sign(ax),sy=Math.sign(ay);
// //         const bit=sx>0?OPEN_E:sx<0?OPEN_W:sy>0?OPEN_S:OPEN_N;
// //         if(cells[cur]&bit){next=(cy+sy)*g.cols+cx+sx;break}
// //       }
// //       if(next<0)break;
// //       const p=pathRef.current;
// //       if(p.length>1&&p[p.length-2]===next)p.pop();else p.push(next);   // walking back removes the step
// //       cur=next;moved=true;
// //       if(cur===goalRef.current)break;
// //     }
// //     if(!moved)return;
// //     curRef.current=cur;
// //     setTrail(pathRef.current.slice());
// //     Animated.timing(dogPos,{toValue:xyOf(cur),duration:90,useNativeDriver:false}).start();
// //     if(cur===goalRef.current){
// //       doneRef.current=true;
// //       setConfirmSkip(false);
// //       finishRef.current(0);
// //     }
// //   };

// //   // drag anywhere on the maze: the dog follows the finger, but only along open paths
// //   const pan=useRef(PanResponder.create({
// //     onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// //     onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// //     onPanResponderTerminationRequest:()=>false,
// //     onPanResponderGrant:(_e,g)=>{
// //       const q=geo.current,c=curRef.current;
// //       base.current={x0:g.x0,y0:g.y0,px:(c%q.cols+0.5)*q.cs,py:(Math.floor(c/q.cols)+0.5)*q.cs};
// //       setConfirmSkip(false);
// //     },
// //     onPanResponderMove:(_e,g)=>{
// //       if(doneRef.current)return;
// //       const q=geo.current,b=base.current,c=curRef.current;
// //       let px=b.px+(g.moveX-b.x0),py=b.py+(g.moveY-b.y0);
// //       // the pointer never gets more than a cell away from the dog, so a blocked drag cannot get stuck
// //       const cx=(c%q.cols+0.5)*q.cs,cy=(Math.floor(c/q.cols)+0.5)*q.cs,lim=q.cs*1.1;
// //       const qx=clamp(px,cx-lim,cx+lim),qy=clamp(py,cy-lim,cy+lim);
// //       b.px+=qx-px;b.py+=qy-py;px=qx;py=qy;
// //       tryMove(clamp(Math.floor(px/q.cs),0,q.cols-1),clamp(Math.floor(py/q.cs),0,q.rows-1));
// //     },
// //   })).current;

// //   // magnifier: the server shows the next cells of the right way (25 hints)
// //   const onHint=async()=>{
// //     if(done||!sessionId)return;
// //     setConfirmSkip(false);
// //     try{
// //       const r=await hintLevel9({sessionId,playerId,cell:curRef.current});
// //       setHints&&setHints(r.hints);
// //       setHintCells(r.path);
// //       later(()=>setHintCells([]),6000);
// //     }catch(e:any){
// //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// //     }
// //   };

// //   // video reward (+75 hints)
// //   const onReward=async()=>{
// //     if(done)return;
// //     setConfirmSkip(false);
// //     try{
// //       const r=await rewardLevel9(playerId);
// //       setHints&&setHints(r.hints);
// //       flash('+'+r.added+' hints');
// //     }catch(e:any){
// //       flash(e.message||'Network error');
// //     }
// //   };

// //   // skip (50 hints): tap twice
// //   const onSkip=async()=>{
// //     if(done||!sessionId)return;
// //     if(!confirmSkip){
// //       setConfirmSkip(true);
// //       flash('Skip costs 50 hints. Tap again to skip.');
// //       return;
// //     }
// //     try{
// //       const r=await skipLevel9({sessionId,playerId});
// //       setHints&&setHints(r.hints||0);
// //       doneRef.current=true;
// //       onComplete?onComplete(r):onExit();
// //     }catch(e:any){
// //       setConfirmSkip(false);
// //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// //     }
// //   };

// //   /* ---------- loading / error ---------- */

// //   if(loadErr||!view){
// //     return <View style={bd.wall}><View style={bd.frame}><View style={[bd.board,{justifyContent:'center'}]}>
// //       {loadErr?<>
// //         <Text style={bd.err}>{loadErr}</Text>
// //         <TouchableOpacity style={bd.retry} onPress={load}><Text style={bd.retryT}>Try again</Text></TouchableOpacity>
// //         <TouchableOpacity onPress={onExit}><Text style={bd.back}>Back</Text></TouchableOpacity>
// //       </>:<>
// //         <ActivityIndicator size="large" color={CHALK}/>
// //         <Text style={bd.load}>Loading level 9...</Text>
// //       </>}
// //     </View></View></View>;
// //   }

// //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
// //   const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'grab'}:{};
// //   const gx=(view.goal%cols)*cs,gy=Math.floor(view.goal/cols)*cs;

// //   return <View style={bd.wall}>
// //     <View style={bd.frame}><View style={bd.board}>
// //       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
// //       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
// //       <View pointerEvents="none" style={bd.sheen}/>

// //       {/* top bar */}
// //       <View style={bd.top}>
// //         <View style={bd.topL}>
// //           <TouchableOpacity style={bd.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
// //           <View style={bd.round}><Icon n="gear" s={16}/></View>
// //         </View>
// //         <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
// //           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
// //           <View style={bd.sign}>
// //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
// //             <Text style={bd.signt}>LEVEL 9</Text>
// //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
// //           </View>
// //         </Animated.View>
// //         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
// //       </View>

// //       <Text style={[bd.q,msg?{color:'#ffb4a8'}:null]}>{msg||view.title}</Text>

// //       {/* the maze: drag the dog to the bone */}
// //       <View style={bd.boardWrap}>
// //         <View style={bd.panel}>
// //           <Maze cells={view.cells} cols={cols} rows={rows} cs={cs} trail={trail} hint={hintCells} goal={view.goal}/>

// //           {/* dog house + bone at the goal */}
// //           <View pointerEvents="none" style={{position:'absolute',left:gx+cs*0.02,top:gy+cs*0.02}}><DogHouse w={cs*0.96}/></View>
// //           <View pointerEvents="none" style={{position:'absolute',left:gx+cs*0.06,top:gy+cs*0.66}}><Bone w={cs*0.8}/></View>

// //           {/* the dog */}
// //           <Animated.View pointerEvents="none"
// //             style={{position:'absolute',left:0,top:0,transform:[...dogPos.getTranslateTransform(),{translateY:hop}]}}>
// //             <Dog w={ds}/>
// //           </Animated.View>

// //           <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
// //         </View>
// //       </View>

// //       {/* hint / video / skip */}
// //       <View style={bd.actions}>
// //         <View style={bd.acol}>
// //           <TouchableOpacity style={bd.hintBtn} onPress={onHint}><Icon n="search" s={34}/></TouchableOpacity>
// //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
// //         </View>
// //         <View style={bd.acol}>
// //           <TouchableOpacity style={bd.videoBtn} onPress={onReward}><Icon n="film" s={40}/></TouchableOpacity>
// //           <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
// //         </View>
// //         <View style={bd.acol}>
// //           <TouchableOpacity style={bd.skipBtn} onPress={onSkip}><Icon n="play" s={36}/></TouchableOpacity>
// //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
// //         </View>
// //       </View>

// //       {/* chalk tray */}
// //       <View style={bd.ledge}>
// //         {[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:6+i*6,height:1,backgroundColor:'rgba(90,45,10,0.25)'}}/>)}
// //         <View style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>
// //         <View style={{position:'absolute',left:'40%',bottom:20}}><ChalkPiece w={78}/></View>
// //         <View style={{position:'absolute',left:'64%',bottom:22,transform:[{rotate:'-8deg'}]}}><ChalkPiece w={54}/></View>
// //       </View>

// //       {/* result card */}
// //       {!!result&&<View style={bd.overlay}>
// //         <Animated.View style={[bd.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// //           <Text style={bd.cardTitle}>Level complete!</Text>
// //           <Text style={bd.cardMsg}>{result.message}</Text>
// //           <View style={bd.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// //           <Text style={bd.cardScore}>Score {result.score}</Text>
// //           <TouchableOpacity style={bd.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// //             <Text style={bd.nextT}>NEXT</Text>
// //           </TouchableOpacity>
// //         </Animated.View>
// //       </View>}
// //     </View></View>
// //   </View>;
// // }

// // /* =========================================================
// //    STYLES  (same green chalkboard as level 7 and 8)
// // ========================================================= */

// // const bd=StyleSheet.create({
// //   wall:{flex:1,backgroundColor:'#f1dcc0',paddingBottom:18},
// //   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:8,backgroundColor:'#1f5b44',overflow:'hidden'},
// //   board:{flex:1,alignItems:'center'},
// //   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
// //   sheen:{position:'absolute',left:0,right:0,top:0,height:120,backgroundColor:'rgba(255,255,255,0.04)'},

// //   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
// //   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
// //   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
// //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// //   signWrap:{alignItems:'center',paddingTop:14},
// //   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
// //   sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
// //   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
// //   dashes:{gap:4,justifyContent:'center'},
// //   dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
// //   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
// //   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},

// //   q:{fontFamily:F,fontSize:21,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,paddingHorizontal:12,
// //     textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
// //   panel:{borderWidth:3,borderColor:'#f6f4ea',borderRadius:10,overflow:'hidden',backgroundColor:'#8fd14f'},
// //   boardWrap:{flex:1,alignItems:'center',justifyContent:'flex-start',paddingTop:14,paddingBottom:200},

// //   actions:{position:'absolute',left:0,right:0,bottom:62,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
// //   acol:{alignItems:'center'},
// //   lblRow:{flexDirection:'row',alignItems:'center',gap:3,height:20,marginTop:4},
// //   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
// //   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// //   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// //   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},

// //   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
// //   card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
// //   cardTitle:{fontFamily:F,fontSize:28,fontWeight:'800',color:'#fff'},
// //   cardMsg:{fontFamily:F,fontSize:17,color:'#d8f3e3',textAlign:'center',marginTop:6},
// //   stars:{flexDirection:'row',gap:6,marginTop:14},
// //   cardScore:{fontFamily:F,fontSize:22,fontWeight:'700',color:'#ffd33d',marginTop:10},
// //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:'#a6e22e',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
// //   nextT:{fontFamily:F,fontSize:26,fontWeight:'900',color:INK},

// //   load:{fontFamily:F,fontSize:22,color:CHALK,marginTop:12},
// //   err:{fontFamily:F,fontSize:18,color:CHALK,textAlign:'center',paddingHorizontal:24},
// //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
// //   retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
// //   back:{fontFamily:F,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
// // });
// import React,{useCallback,useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Animated,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// import {F,INK,Coin} from './BTShared';
// import {Icon} from './Art';
// import {BigStar,Duster,ChalkPiece} from './Btlevel7art';
// import {Maze,Dog,Bone,DogHouse} from './Btlevel9art';
// import {startLevel9,hintLevel9,finishLevel9,skipLevel9,rewardLevel9,Level9View,Level9Result} from './Btlevel9api';

// const CHALK='#f6f4ea';

// type Props={
//   playerId:number;
//   hints?:number;
//   setHints?:(n:number)=>void;
//   onExit:()=>void;
//   onComplete?:(result:Level9Result)=>void;
// };

// const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));

// export default function BTLevel9Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
//   const {width,height}=useWindowDimensions();
//   const RW=Math.min(width-36,340);                 // frame width
//   const IW=RW-6;                                   // inside the 3px border

//   const [view,setView]=useState<Level9View|null>(null);
//   const [sessionId,setSessionId]=useState<number|null>(null);
//   const [loadErr,setLoadErr]=useState('');
//   const [msg,setMsg]=useState('');
//   const [done,setDone]=useState(false);
//   const [trail,setTrail]=useState<number[]>([]);
//   const [hintCells,setHintCells]=useState<number[]>([]);
//   const [result,setResult]=useState<Level9Result|null>(null);
//   const [confirmSkip,setConfirmSkip]=useState(false);

//   const cols=view?view.cols:9;
//   const rows=view?view.rows:9;
//   const cs=Math.max(24,Math.floor(Math.min(IW/cols,(height-470)/rows)));   // one cell in pixels
//   const ds=cs*0.92;                                                         // dog size

//   const dogPos=useRef(new Animated.ValueXY()).current;
//   const hop=useRef(new Animated.Value(0)).current;
//   const pop=useRef(new Animated.Value(0)).current;
//   const sway=useRef(new Animated.Value(0)).current;

//   const geo=useRef({cs,cols,rows,ds});
//   geo.current={cs,cols,rows,ds};
//   const cellsRef=useRef<number[]>([]);
//   const goalRef=useRef(0);
//   const curRef=useRef(0);                          // the cell the dog stands on
//   const pathRef=useRef<number[]>([0]);             // start -> bone (free drag)
//   const dogC=useRef({x:0,y:0});                    // dog centre in maze pixels
//   const touch=useRef({on:false,sx:0,sy:0});        // drag state
//   const doneRef=useRef(false);
//   const sessionRef=useRef<number|null>(null);
//   const timers=useRef<any[]>([]);
//   const msgTimer=useRef<any>(null);
//   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

//   const flash=(m:string)=>{
//     setMsg(m);clearTimeout(msgTimer.current);
//     msgTimer.current=setTimeout(()=>setMsg(''),2800);
//   };

//   // put the dog (by its centre) at a pixel of the maze
//   const moveDogTo=(x:number,y:number)=>{
//     const q=geo.current;
//     dogC.current={x,y};
//     dogPos.setValue({x:x-q.ds/2,y:y-q.ds/2});
//   };

//   // centre pixel of a cell
//   const centreOf=(c:number)=>{
//     const g=geo.current;
//     return {x:(c%g.cols+0.5)*g.cs,y:(Math.floor(c/g.cols)+0.5)*g.cs};
//   };

//   // 1. open the level - the backend builds a NEW maze every time
//   const load=useCallback(()=>{
//     setLoadErr('');setView(null);
//     startLevel9(playerId)
//       .then(v=>{
//         cellsRef.current=v.cells;
//         goalRef.current=v.goal;
//         curRef.current=v.start;
//         pathRef.current=[v.start];
//         doneRef.current=false;
//         touch.current={on:false,sx:0,sy:0};
//         const g=geo.current;
//         dogC.current={x:(v.start%v.cols+0.5)*g.cs,y:(Math.floor(v.start/v.cols)+0.5)*g.cs};
//         setDone(false);setResult(null);setHintCells([]);setTrail([v.start]);
//         setSessionId(v.sessionId);sessionRef.current=v.sessionId;
//         setView(v);
//         if(setHints&&typeof v.hints==='number')setHints(v.hints);
//       })
//       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
//   },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(()=>{
//     load();
//     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
//   },[load]);

//   // when the maze appears or the size changes, keep the dog on the same spot (scaled)
//   const lastCs=useRef(cs);
//   useEffect(()=>{
//     if(!view)return;
//     if(lastCs.current!==cs){
//       const k=cs/lastCs.current;
//       dogC.current={x:dogC.current.x*k,y:dogC.current.y*k};
//       lastCs.current=cs;
//     }
//     moveDogTo(dogC.current.x,dogC.current.y);
//   },[view,cs]);                                    // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(()=>{
//     const l=Animated.loop(Animated.sequence([
//       Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
//       Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
//     l.start();
//     return()=>l.stop();
//   },[]);

//   useEffect(()=>{
//     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
//   },[result]);

//   // 2. the dog reached the bone: tell the backend, it saves the win
//   const finish=async(attempt:number)=>{
//     const sid=sessionRef.current;
//     if(!sid)return;
//     try{
//       const path=pathRef.current.slice();
//       const r=await finishLevel9({sessionId:sid,playerId,path,moves:Math.max(1,path.length-1)});
//       if(setHints&&typeof r.hints==='number')setHints(r.hints);
//       setDone(true);
//       Animated.sequence([
//         Animated.timing(hop,{toValue:-14,duration:160,useNativeDriver:true}),
//         Animated.timing(hop,{toValue:0,duration:160,useNativeDriver:true}),
//         Animated.timing(hop,{toValue:-10,duration:140,useNativeDriver:true}),
//         Animated.timing(hop,{toValue:0,duration:140,useNativeDriver:true}),
//       ]).start();
//       later(()=>setResult(r),1300);
//     }catch(e:any){
//       if(attempt<2){later(()=>finishRef.current(attempt+1),1200);return}
//       doneRef.current=false;
//       flash(e.message||'Network error. Move the dog a little and come back.');
//     }
//   };
//   const finishRef=useRef(finish);
//   finishRef.current=finish;

//   // grab the dog and drag it ANYWHERE (walls do not matter). Reach the bone = win
//   const pan=useRef(PanResponder.create({
//     onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
//     onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
//     onPanResponderTerminationRequest:()=>false,
//     onPanResponderGrant:(e)=>{
//       const q=geo.current,c=dogC.current;
//       const d=Math.hypot(e.nativeEvent.locationX-c.x,e.nativeEvent.locationY-c.y);
//       touch.current={on:d<=q.cs*1.1,sx:c.x,sy:c.y};   // touch must start on the dog
//       setConfirmSkip(false);
//     },
//     onPanResponderMove:(_e,g)=>{
//       const t=touch.current;
//       if(doneRef.current||!t.on)return;
//       const q=geo.current;
//       const x=clamp(t.sx+g.dx,q.ds/2,q.cols*q.cs-q.ds/2);
//       const y=clamp(t.sy+g.dy,q.ds/2,q.rows*q.cs-q.ds/2);
//       moveDogTo(x,y);
//       const cell=clamp(Math.floor(y/q.cs),0,q.rows-1)*q.cols+clamp(Math.floor(x/q.cs),0,q.cols-1);
//       curRef.current=cell;
//       if(cell===goalRef.current){
//         doneRef.current=true;
//         t.on=false;
//         setConfirmSkip(false);
//         const gc=goalRef.current,p=centreOf(gc);
//         moveDogTo(p.x,p.y);                         // snap to the bone
//         pathRef.current=[0,gc];
//         finishRef.current(0);
//       }
//     },
//     onPanResponderRelease:()=>{touch.current.on=false},
//     onPanResponderTerminate:()=>{touch.current.on=false},
//   })).current;

//   // magnifier: the server shows the next cells of the right way (25 hints)
//   const onHint=async()=>{
//     if(done||!sessionId)return;
//     setConfirmSkip(false);
//     try{
//       const r=await hintLevel9({sessionId,playerId,cell:curRef.current});
//       setHints&&setHints(r.hints);
//       setHintCells(r.path);
//       later(()=>setHintCells([]),6000);
//     }catch(e:any){
//       flash(e.status===402?'Not enough hints':e.message||'Network error');
//     }
//   };

//   // video reward (+75 hints)
//   const onReward=async()=>{
//     if(done)return;
//     setConfirmSkip(false);
//     try{
//       const r=await rewardLevel9(playerId);
//       setHints&&setHints(r.hints);
//       flash('+'+r.added+' hints');
//     }catch(e:any){
//       flash(e.message||'Network error');
//     }
//   };

//   // skip (50 hints): tap twice
//   const onSkip=async()=>{
//     if(done||!sessionId)return;
//     if(!confirmSkip){
//       setConfirmSkip(true);
//       flash('Skip costs 50 hints. Tap again to skip.');
//       return;
//     }
//     try{
//       const r=await skipLevel9({sessionId,playerId});
//       setHints&&setHints(r.hints||0);
//       doneRef.current=true;
//       onComplete?onComplete(r):onExit();
//     }catch(e:any){
//       setConfirmSkip(false);
//       flash(e.status===402?'Not enough hints':e.message||'Network error');
//     }
//   };

//   /* ---------- loading / error ---------- */

//   if(loadErr||!view){
//     return <View style={bd.wall}><View style={bd.frame}><View style={[bd.board,{justifyContent:'center'}]}>
//       {loadErr?<>
//         <Text style={bd.err}>{loadErr}</Text>
//         <TouchableOpacity style={bd.retry} onPress={load}><Text style={bd.retryT}>Try again</Text></TouchableOpacity>
//         <TouchableOpacity onPress={onExit}><Text style={bd.back}>Back</Text></TouchableOpacity>
//       </>:<>
//         <ActivityIndicator size="large" color={CHALK}/>
//         <Text style={bd.load}>Loading level 9...</Text>
//       </>}
//     </View></View></View>;
//   }

//   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
//   const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'grab'}:{};
//   const gx=(view.goal%cols)*cs,gy=Math.floor(view.goal/cols)*cs;

//   return <View style={bd.wall}>
//     <View style={bd.frame}><View style={bd.board}>
//       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
//       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
//       <View pointerEvents="none" style={bd.sheen}/>

//       {/* top bar */}
//       <View style={bd.top}>
//         <View style={bd.topL}>
//           <TouchableOpacity style={bd.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
//           <View style={bd.round}><Icon n="gear" s={16}/></View>
//         </View>
//         <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
//           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
//           <View style={bd.sign}>
//             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
//             <Text style={bd.signt}>LEVEL 9</Text>
//             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
//           </View>
//         </Animated.View>
//         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
//       </View>

//       <Text style={[bd.q,msg?{color:'#ffb4a8'}:null]}>{msg||view.title}</Text>

//       {/* the maze: drag the dog to the bone */}
//       <View style={bd.boardWrap}>
//         <View style={bd.panel}>
//           <Maze cells={view.cells} cols={cols} rows={rows} cs={cs} trail={trail} hint={hintCells} goal={view.goal}/>

//           {/* dog house + bone at the goal */}
//           <View pointerEvents="none" style={{position:'absolute',left:gx+cs*0.02,top:gy+cs*0.02}}><DogHouse w={cs*0.96}/></View>
//           <View pointerEvents="none" style={{position:'absolute',left:gx+cs*0.06,top:gy+cs*0.66}}><Bone w={cs*0.8}/></View>

//           {/* the dog */}
//           <Animated.View pointerEvents="none"
//             style={{position:'absolute',left:0,top:0,transform:[...dogPos.getTranslateTransform(),{translateY:hop}]}}>
//             <Dog w={ds}/>
//           </Animated.View>

//           <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
//         </View>
//       </View>

//       {/* hint / video / skip */}
//       <View style={bd.actions}>
//         <View style={bd.acol}>
//           <TouchableOpacity style={bd.hintBtn} onPress={onHint}><Icon n="search" s={34}/></TouchableOpacity>
//           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
//         </View>
//         <View style={bd.acol}>
//           <TouchableOpacity style={bd.videoBtn} onPress={onReward}><Icon n="film" s={40}/></TouchableOpacity>
//           <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
//         </View>
//         <View style={bd.acol}>
//           <TouchableOpacity style={bd.skipBtn} onPress={onSkip}><Icon n="play" s={36}/></TouchableOpacity>
//           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
//         </View>
//       </View>

//       {/* chalk tray */}
//       <View style={bd.ledge}>
//         {[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:6+i*6,height:1,backgroundColor:'rgba(90,45,10,0.25)'}}/>)}
//         <View style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>
//         <View style={{position:'absolute',left:'40%',bottom:20}}><ChalkPiece w={78}/></View>
//         <View style={{position:'absolute',left:'64%',bottom:22,transform:[{rotate:'-8deg'}]}}><ChalkPiece w={54}/></View>
//       </View>

//       {/* result card */}
//       {!!result&&<View style={bd.overlay}>
//         <Animated.View style={[bd.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
//           <Text style={bd.cardTitle}>Level complete!</Text>
//           <Text style={bd.cardMsg}>{result.message}</Text>
//           <View style={bd.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
//           <Text style={bd.cardScore}>Score {result.score}</Text>
//           <TouchableOpacity style={bd.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
//             <Text style={bd.nextT}>NEXT</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>}
//     </View></View>
//   </View>;
// }

// /* =========================================================
//    STYLES  (same green chalkboard as level 7 and 8)
// ========================================================= */

// const bd=StyleSheet.create({
//   wall:{flex:1,backgroundColor:'#f1dcc0',paddingBottom:18},
//   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:8,backgroundColor:'#1f5b44',overflow:'hidden'},
//   board:{flex:1,alignItems:'center'},
//   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
//   sheen:{position:'absolute',left:0,right:0,top:0,height:120,backgroundColor:'rgba(255,255,255,0.04)'},

//   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
//   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
//   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
//   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   signWrap:{alignItems:'center',paddingTop:14},
//   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
//   sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
//   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
//   dashes:{gap:4,justifyContent:'center'},
//   dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
//   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
//   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},

//   q:{fontFamily:F,fontSize:21,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,paddingHorizontal:12,
//     textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
//   panel:{borderWidth:3,borderColor:'#f6f4ea',borderRadius:10,overflow:'hidden',backgroundColor:'#8fd14f'},
//   boardWrap:{flex:1,alignItems:'center',justifyContent:'flex-start',paddingTop:14,paddingBottom:200},

//   actions:{position:'absolute',left:0,right:0,bottom:62,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
//   acol:{alignItems:'center'},
//   lblRow:{flexDirection:'row',alignItems:'center',gap:3,height:20,marginTop:4},
//   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
//   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
//   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
//   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
//   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},

//   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
//   card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
//   cardTitle:{fontFamily:F,fontSize:28,fontWeight:'800',color:'#fff'},
//   cardMsg:{fontFamily:F,fontSize:17,color:'#d8f3e3',textAlign:'center',marginTop:6},
//   stars:{flexDirection:'row',gap:6,marginTop:14},
//   cardScore:{fontFamily:F,fontSize:22,fontWeight:'700',color:'#ffd33d',marginTop:10},
//   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:'#a6e22e',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
//   nextT:{fontFamily:F,fontSize:26,fontWeight:'900',color:INK},

//   load:{fontFamily:F,fontSize:22,color:CHALK,marginTop:12},
//   err:{fontFamily:F,fontSize:18,color:CHALK,textAlign:'center',paddingHorizontal:24},
//   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
//   retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
//   back:{fontFamily:F,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
// });
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
import {F,INK,Coin} from './BTShared';
import {Icon} from './Art';
import {BigStar,Duster,ChalkPiece} from './Btlevel7art';
import {Maze,Dog,Bone,DogHouse,OPEN_N,OPEN_E,OPEN_S,OPEN_W} from './Btlevel9art';
import {startLevel9,hintLevel9,finishLevel9,skipLevel9,rewardLevel9,Level9View,Level9Result} from './Btlevel9api';

const CHALK='#f6f4ea';

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level9Result)=>void;
};

const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
const PADC=1.3;                                    // free green board around the maze, in cells

export default function BTLevel9Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width,height}=useWindowDimensions();
  const RW=Math.min(width-36,340);                 // frame width
  const IW=RW-6;                                   // inside the 3px border

  const [view,setView]=useState<Level9View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [done,setDone]=useState(false);
  const [trail,setTrail]=useState<number[]>([]);
  const [hintCells,setHintCells]=useState<number[]>([]);
  const [result,setResult]=useState<Level9Result|null>(null);
  const [confirmSkip,setConfirmSkip]=useState(false);

  const cols=view?view.cols:9;
  const rows=view?view.rows:9;
  const cs=Math.max(20,Math.floor(Math.min(IW/(cols+2*PADC),(height-410)/(rows+2*PADC))));   // one cell in pixels
  const ds=cs*0.9;                                                          // dog size
  const pad=cs*PADC;                                                        // green board around the maze
  const FW=cols*cs+2*pad;                                                   // whole drag field
  const FH=rows*cs+2*pad;

  const dogPos=useRef(new Animated.ValueXY()).current;
  const hop=useRef(new Animated.Value(0)).current;
  const pop=useRef(new Animated.Value(0)).current;
  const sway=useRef(new Animated.Value(0)).current;

  const geo=useRef({cs,cols,rows,ds,pad,FW,FH});
  geo.current={cs,cols,rows,ds,pad,FW,FH};
  const startRef=useRef(0);
  const outsideRef=useRef(false);                  // the dog is on the green board, outside the maze
  const cellsRef=useRef<number[]>([]);
  const goalRef=useRef(0);
  const curRef=useRef(0);                          // the cell the dog stands on
  const pathRef=useRef<number[]>([0]);             // start -> bone (free drag)
  const dogC=useRef({x:0,y:0});                    // dog centre in maze pixels
  const touch=useRef({on:false,sx:0,sy:0});        // drag state
  const doneRef=useRef(false);
  const sessionRef=useRef<number|null>(null);
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

  const flash=(m:string)=>{
    setMsg(m);clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2800);
  };

  // put the dog (by its centre) at a pixel of the maze
  const moveDogTo=(x:number,y:number)=>{
    const q=geo.current;
    dogC.current={x,y};
    dogPos.setValue({x:x-q.ds/2,y:y-q.ds/2});
  };

  // centre pixel of a cell
  const centreOf=(c:number)=>{
    const g=geo.current;
    return {x:g.pad+(c%g.cols+0.5)*g.cs,y:g.pad+(Math.floor(c/g.cols)+0.5)*g.cs};
  };

  // 1. open the level - the backend builds a NEW maze every time
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel9(playerId)
      .then(v=>{
        cellsRef.current=v.cells;
        goalRef.current=v.goal;
        curRef.current=v.start;
        pathRef.current=[v.start];
        doneRef.current=false;
        touch.current={on:false,sx:0,sy:0};
        startRef.current=v.start;
        outsideRef.current=false;
        const g=geo.current;
        dogC.current={x:g.pad+(v.start%v.cols+0.5)*g.cs,y:g.pad+(Math.floor(v.start/v.cols)+0.5)*g.cs};
        setDone(false);setResult(null);setHintCells([]);setTrail([v.start]);
        setSessionId(v.sessionId);sessionRef.current=v.sessionId;
        setView(v);
        if(setHints&&typeof v.hints==='number')setHints(v.hints);
      })
      .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
  },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{
    load();
    return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
  },[load]);

  // when the maze appears or the size changes, keep the dog on the same spot (scaled)
  const lastCs=useRef(cs);
  useEffect(()=>{
    if(!view)return;
    if(lastCs.current!==cs){
      const k=cs/lastCs.current;
      dogC.current={x:dogC.current.x*k,y:dogC.current.y*k};
      lastCs.current=cs;
    }
    moveDogTo(dogC.current.x,dogC.current.y);
  },[view,cs]);                                    // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{
    const l=Animated.loop(Animated.sequence([
      Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
      Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
    l.start();
    return()=>l.stop();
  },[]);

  useEffect(()=>{
    if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
  },[result]);

  // 2. the dog reached the bone: tell the backend, it saves the win
  const finish=async(attempt:number)=>{
    const sid=sessionRef.current;
    if(!sid)return;
    try{
      const path=pathRef.current.slice();
      const r=await finishLevel9({sessionId:sid,playerId,path,moves:Math.max(1,path.length-1)});
      if(setHints&&typeof r.hints==='number')setHints(r.hints);
      setDone(true);
      Animated.sequence([
        Animated.timing(hop,{toValue:-14,duration:160,useNativeDriver:true}),
        Animated.timing(hop,{toValue:0,duration:160,useNativeDriver:true}),
        Animated.timing(hop,{toValue:-10,duration:140,useNativeDriver:true}),
        Animated.timing(hop,{toValue:0,duration:140,useNativeDriver:true}),
      ]).start();
      later(()=>setResult(r),1300);
    }catch(e:any){
      if(attempt<2){later(()=>finishRef.current(attempt+1),1200);return}
      doneRef.current=false;
      flash(e.message||'Network error. Move the dog a little and come back.');
    }
  };
  const finishRef=useRef(finish);
  finishRef.current=finish;

  // which maze cell is under a pixel of the field (-1 = on the green board outside the maze)
  const cellAt=(x:number,y:number)=>{
    const q=geo.current;
    const mx=x-q.pad,my=y-q.pad;
    if(mx<0||my<0||mx>=q.cols*q.cs||my>=q.rows*q.cs)return -1;
    return Math.floor(my/q.cs)*q.cols+Math.floor(mx/q.cs);
  };

  // can the dog step from (ox,oy) to (nx,ny)?
  //  - inside the maze: only through open sides (walls block the dog)
  //  - outside the maze: free, but it cannot cut through the maze walls
  //  - the only gates: top of the start cell and bottom of the goal cell
  const stand=(ox:number,oy:number,nx:number,ny:number)=>{
    const q=geo.current,cells=cellsRef.current;
    if(nx<q.ds/2||nx>q.FW-q.ds/2||ny<q.ds/2||ny>q.FH-q.ds/2)return false;
    const mx0=q.pad,my0=q.pad,mx1=q.pad+q.cols*q.cs,my1=q.pad+q.rows*q.cs;
    const oc=cellAt(ox,oy),nc=cellAt(nx,ny);

    if(oc>=0&&nc>=0){                                       // inside -> inside
      if(oc===nc)return true;
      const dx=(nc%q.cols)-(oc%q.cols),dy=Math.floor(nc/q.cols)-Math.floor(oc/q.cols);
      if(Math.abs(dx)+Math.abs(dy)!==1)return false;
      const bit=dx>0?OPEN_E:dx<0?OPEN_W:dy>0?OPEN_S:OPEN_N;
      return !!(cells[oc]&bit);
    }
    if(oc<0&&nc<0){                                         // outside -> outside
      const B=q.ds*0.5;                                     // keep the dog off the outer wall
      const near=nx>mx0-B&&nx<mx1+B&&ny>my0-B&&ny<my1+B;
      if(!near)return true;
      const startGate=nx>=mx0&&nx<mx0+q.cs&&ny<my0;
      const goalGate=nx>=mx1-q.cs&&nx<mx1&&ny>=my1;
      return startGate||goalGate;
    }
    if(oc<0){                                               // outside -> inside
      if(nc===startRef.current&&oy<my0)return true;
      if(nc===goalRef.current&&oy>=my1)return true;
      return false;
    }
    if(oc===startRef.current&&ny<my0)return true;           // inside -> outside
    if(oc===goalRef.current&&ny>=my1)return true;
    return false;
  };

  // grab the dog and drag it. Walls block it inside the maze, so the way to the bone is OUTSIDE.
  const pan=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
    onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
    onPanResponderTerminationRequest:()=>false,
    onPanResponderGrant:(e)=>{
      const q=geo.current,c=dogC.current;
      const d=Math.hypot(e.nativeEvent.locationX-c.x,e.nativeEvent.locationY-c.y);
      touch.current={on:d<=q.cs*1.1,sx:c.x,sy:c.y};         // touch must start on the dog
      setConfirmSkip(false);
    },
    onPanResponderMove:(_e,g)=>{
      const t=touch.current;
      if(doneRef.current||!t.on)return;
      const q=geo.current,d=dogC.current;

      // where the finger wants the dog (the finger never runs more than ~1 cell ahead of a blocked dog)
      let tx=t.sx+g.dx,ty=t.sy+g.dy;
      const ox=tx-d.x,oy=ty-d.y,len=Math.hypot(ox,oy),lim=q.cs*1.2;
      if(len>lim){const k=(len-lim)/len;t.sx-=ox*k;t.sy-=oy*k;tx-=ox*k;ty-=oy*k}

      // walk in small steps so a fast swipe cannot jump over a wall; slide along walls
      let x=d.x,y=d.y;
      const n=Math.max(1,Math.ceil(Math.hypot(tx-x,ty-y)/(q.cs/6)));
      const sx=(tx-x)/n,sy=(ty-y)/n;
      for(let i=0;i<n;i+=1){
        if(stand(x,y,x+sx,y+sy)){x+=sx;y+=sy}
        else if(stand(x,y,x+sx,y)){x+=sx}
        else if(stand(x,y,x,y+sy)){y+=sy}
      }
      if(x===d.x&&y===d.y)return;
      moveDogTo(x,y);

      const cell=cellAt(x,y);
      outsideRef.current=cell<0;
      if(cell>=0&&cell!==curRef.current){
        curRef.current=cell;
        const p=pathRef.current;
        if(p.length>1&&p[p.length-2]===cell)p.pop();else p.push(cell);
        setTrail(p.slice());
      }

      // win: the dog reaches the bone. From the green board outside, getting close to the bone house is enough.
      // Inside the maze the goal is walled off, so the only way to win is the outside way.
      const gp=centreOf(goalRef.current);
      const nearBone=cell<0&&Math.hypot(x-gp.x,y-gp.y)<=q.cs*1.4;
      if(nearBone||(cell>=0&&cell===goalRef.current)){
        doneRef.current=true;
        t.on=false;
        setConfirmSkip(false);
        moveDogTo(gp.x,gp.y);                               // snap to the bone
        finishRef.current(0);
      }
    },
    onPanResponderRelease:()=>{touch.current.on=false},
    onPanResponderTerminate:()=>{touch.current.on=false},
  })).current;

  // magnifier: inside the maze the server shows the way back to the exit (25 hints)
  const onHint=async()=>{
    if(done||!sessionId)return;
    setConfirmSkip(false);
    if(outsideRef.current){flash('The way to the bone is around the OUTSIDE of the maze!');return}   // free tip
    try{
      const r=await hintLevel9({sessionId,playerId,cell:curRef.current});
      setHints&&setHints(r.hints);
      setHintCells(r.path);
      later(()=>setHintCells([]),6000);
    }catch(e:any){
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }
  };

  // video reward (+75 hints)
  const onReward=async()=>{
    if(done)return;
    setConfirmSkip(false);
    try{
      const r=await rewardLevel9(playerId);
      setHints&&setHints(r.hints);
      flash('+'+r.added+' hints');
    }catch(e:any){
      flash(e.message||'Network error');
    }
  };

  // skip (50 hints): tap twice
  const onSkip=async()=>{
    if(done||!sessionId)return;
    if(!confirmSkip){
      setConfirmSkip(true);
      flash('Skip costs 50 hints. Tap again to skip.');
      return;
    }
    try{
      const r=await skipLevel9({sessionId,playerId});
      setHints&&setHints(r.hints||0);
      doneRef.current=true;
      onComplete?onComplete(r):onExit();
    }catch(e:any){
      setConfirmSkip(false);
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }
  };

  /* ---------- loading / error ---------- */

  if(loadErr||!view){
    return <View style={bd.wall}><View style={bd.frame}><View style={[bd.board,{justifyContent:'center'}]}>
      {loadErr?<>
        <Text style={bd.err}>{loadErr}</Text>
        <TouchableOpacity style={bd.retry} onPress={load}><Text style={bd.retryT}>Try again</Text></TouchableOpacity>
        <TouchableOpacity onPress={onExit}><Text style={bd.back}>Back</Text></TouchableOpacity>
      </>:<>
        <ActivityIndicator size="large" color={CHALK}/>
        <Text style={bd.load}>Loading level 9...</Text>
      </>}
    </View></View></View>;
  }

  const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
  const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'grab'}:{};
  const gx=pad+(view.goal%cols)*cs,gy=pad+Math.floor(view.goal/cols)*cs;

  return <View style={bd.wall}>
    <View style={bd.frame}><View style={bd.board}>
      <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
      <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
      <View pointerEvents="none" style={bd.sheen}/>

      {/* top bar */}
      <View style={bd.top}>
        <View style={bd.topL}>
          <TouchableOpacity style={bd.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
          <View style={bd.round}><Icon n="gear" s={16}/></View>
        </View>
        <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
          <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
          <View style={bd.sign}>
            <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
            <Text style={bd.signt}>LEVEL 9</Text>
            <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
          </View>
        </Animated.View>
        <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
      </View>

      <Text style={[bd.q,msg?{color:'#ffb4a8'}:null]}>{msg||view.title}</Text>

      {/* the maze: drag the dog to the bone */}
      <View style={bd.boardWrap}>
        <View style={{width:FW,height:FH}}>
          {/* the maze sits in the middle, the green board around it is free to walk on */}
          <View style={{position:'absolute',left:pad,top:pad,width:cols*cs,height:rows*cs}}>
            <Maze cells={view.cells} cols={cols} rows={rows} cs={cs} trail={trail} hint={hintCells} goal={view.goal}/>
          </View>

          {/* dog house + bone at the goal */}
          <View pointerEvents="none" style={{position:'absolute',left:gx+cs*0.02,top:gy+cs*0.02}}><DogHouse w={cs*0.96}/></View>
          <View pointerEvents="none" style={{position:'absolute',left:gx+cs*0.06,top:gy+cs*0.66}}><Bone w={cs*0.8}/></View>

          {/* the dog */}
          <Animated.View pointerEvents="none"
            style={{position:'absolute',left:0,top:0,transform:[...dogPos.getTranslateTransform(),{translateY:hop}]}}>
            <Dog w={ds}/>
          </Animated.View>

          <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
        </View>
      </View>

      {/* hint / video / skip */}
      <View style={bd.actions}>
        <View style={bd.acol}>
          <TouchableOpacity style={bd.hintBtn} onPress={onHint}><Icon n="search" s={34}/></TouchableOpacity>
          <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
        </View>
        <View style={bd.acol}>
          <TouchableOpacity style={bd.videoBtn} onPress={onReward}><Icon n="film" s={40}/></TouchableOpacity>
          <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
        </View>
        <View style={bd.acol}>
          <TouchableOpacity style={bd.skipBtn} onPress={onSkip}><Icon n="play" s={36}/></TouchableOpacity>
          <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
        </View>
      </View>

      {/* chalk tray */}
      <View style={bd.ledge}>
        {[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:6+i*6,height:1,backgroundColor:'rgba(90,45,10,0.25)'}}/>)}
        <View style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>
        <View style={{position:'absolute',left:'40%',bottom:20}}><ChalkPiece w={78}/></View>
        <View style={{position:'absolute',left:'64%',bottom:22,transform:[{rotate:'-8deg'}]}}><ChalkPiece w={54}/></View>
      </View>

      {/* result card */}
      {!!result&&<View style={bd.overlay}>
        <Animated.View style={[bd.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
          <Text style={bd.cardTitle}>Level complete!</Text>
          <Text style={bd.cardMsg}>{result.message}</Text>
          <View style={bd.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
          <Text style={bd.cardScore}>Score {result.score}</Text>
          <TouchableOpacity style={bd.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
            <Text style={bd.nextT}>NEXT</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>}
    </View></View>
  </View>;
}

/* =========================================================
   STYLES  (same green chalkboard as level 7 and 8)
========================================================= */

const bd=StyleSheet.create({
  wall:{flex:1,backgroundColor:'#f1dcc0',paddingBottom:18},
  frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:8,backgroundColor:'#1f5b44',overflow:'hidden'},
  board:{flex:1,alignItems:'center'},
  smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
  sheen:{position:'absolute',left:0,right:0,top:0,height:120,backgroundColor:'rgba(255,255,255,0.04)'},

  top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
  topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
  topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
  round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
  signWrap:{alignItems:'center',paddingTop:14},
  string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
  sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
  signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
  dashes:{gap:4,justifyContent:'center'},
  dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
  bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
  bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},

  q:{fontFamily:F,fontSize:21,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,paddingHorizontal:12,
    textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
  panel:{borderWidth:3,borderColor:'#f6f4ea',borderRadius:10,overflow:'hidden',backgroundColor:'#8fd14f'},
  boardWrap:{flex:1,alignItems:'center',justifyContent:'flex-start',paddingTop:14,paddingBottom:200},

  actions:{position:'absolute',left:0,right:0,bottom:62,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
  acol:{alignItems:'center'},
  lblRow:{flexDirection:'row',alignItems:'center',gap:3,height:20,marginTop:4},
  lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
  hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
  videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
  skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
  ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},

  overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
  card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
  cardTitle:{fontFamily:F,fontSize:28,fontWeight:'800',color:'#fff'},
  cardMsg:{fontFamily:F,fontSize:17,color:'#d8f3e3',textAlign:'center',marginTop:6},
  stars:{flexDirection:'row',gap:6,marginTop:14},
  cardScore:{fontFamily:F,fontSize:22,fontWeight:'700',color:'#ffd33d',marginTop:10},
  next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:'#a6e22e',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
  nextT:{fontFamily:F,fontSize:26,fontWeight:'900',color:INK},

  load:{fontFamily:F,fontSize:22,color:CHALK,marginTop:12},
  err:{fontFamily:F,fontSize:18,color:CHALK,textAlign:'center',paddingHorizontal:24},
  retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
  retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
  back:{fontFamily:F,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
});
